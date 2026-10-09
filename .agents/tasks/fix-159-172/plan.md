# Implementation Plan — Fix GTPL-159…172 (match GTPL-154)

Scope: make the 14 machines `GTPL-159-gT-650T-S7-1200` … `GTPL-172-gT-650T-S7-1200`
behave exactly like `GTPL-154-gT-650T-S7-1200` for three reported bugs. These machines
were cloned 1:1 from GTPL-154.

## Hard constraints (do not violate)

- Do NOT edit `src/hooks/useAutoData.ts` or the Analog Inputs page config
  (`src/app/menu/inputs/analog/[seaction]/page.tsx`). Those are owned by a separate,
  concurrently running workflow (the `ALWAYS_FETCH_DEVICES` bypass). The bypass commit
  `7b1b5ca` is already on this branch.
- Do NOT revert the prior clone/feature work: the Analog page's "Condenser fan speed"
  (`Condenser_fan_speed`) + "Static Pressure" (`Static_pressure`) inputs for 159..172, and
  `AutoDiagram1.tsx`'s condenser fan-speed % label + static-pressure badge gated on
  `is159to172Machine`. Keep all of it.
- Only change behavior for 159..172 (and GTPL-154 where the task says 154 must match 159..172,
  i.e. the RH hiding in Issue 2 — 154 also has no RH sensor, so hiding there is correct and
  in-scope). Do not change behavior for any other machine.

## Root-cause summary (grounded in code read during exploration)

Every in-repo per-machine config layer ALREADY contains 159..172 identical to 154. Verified:
- `src/lib/faultConfig.ts` — 159..172 present, `GPL_124_TAGS`, `activeFaultColumns:
  MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]`, each its own `GTPL_1NN_GT_650T_S7_1200` table.
- `src/lib/machineConfig.ts` — 159..172 present, each its own table, same shape as 154.
  This is the file `src/app/api/getActiveFaults/route.ts` imports (NOT `faultConfig.ts`).
- `src/hooks/useAutoData.ts` — 159..172 in `autoTypeToTableMap`, `deviceNameToStatusKey`, and
  `ALWAYS_FETCH_DEVICES` (the running-status gate bypass).
- `src/lib/devices.ts` — all 14 present, `location: "Noida"`.
- `alarm_handler.py` — all 14 in `machine_tables`; `machine_id = table.split('_')[1]` yields
  `"159"`…`"172"`, same registration scheme as `"154"`.

Data-flow facts:
- Fault page `src/app/menu/fault/[fault]/page.tsx` has two views:
  - "Active Alarms" → live row via `useAutoData(machineName)` + `getActiveFaults(...)`
    (`faultConfig.ts`). Gated on running-status, but 159..172 are in `ALWAYS_FETCH_DEVICES`,
    so the live row is fetched already.
  - "Alarm History" → `src/components/FaultLogsPaginated.tsx` → `GET /api/getActiveFaults`
    (this repo's Next.js route) → `backendJson(/api/all700data/paginatedSmart200?table=<table>)`
    → the remote Go backend at `primeosys.com/backend`. The table name comes from
    `machineConfig.ts` and is correct (`GTPL_1NN_GT_650T_S7_1200`).
- The route returns HTTP 404 `{"error":"Unknown machine identifier"}` only when the device key
  is absent from `machineConfig.MACHINE_CONFIG`. 159..172 ARE present, so this route will not
  404 for them. On 404/500/empty, `FaultLogsPaginated` renders the error/empty state (blank history).

Conclusion for Issue 1: there is NO in-repo gap left to close — the in-repo paths resolve 159..172
exactly like 154. The remaining plausible cause of "no API call / blank history" is OUTSIDE this
repo: the Go backend / MySQL may not yet have the `GTPL_159_GT_650T_S7_1200`…`GTPL_172…` tables or
rows (the clone's backend Go edits live in a separate repo per
`.agents/tasks/clone-gtpl154-159-172/verification.md`, which notes the Go toolchain was absent).
Per instructions, we do NOT dismiss the user report on code reading alone: Issue 1 is carried as a
runtime-verification item, with a precise in-repo fix path IF (and only if) runtime shows a concrete
in-repo gap.

Overlap with the other workflow: Issues 1 and 3 both historically depended on the running-status
gate in `useAutoData.ts`. That gate is already bypassed for 159..172 by `ALWAYS_FETCH_DEVICES`
(commit `7b1b5ca`, on this branch). So the live-data starvation cause is already resolved upstream;
do not re-fix it here and do not touch `useAutoData.ts`.

## Verification commands (project-real)

- Typecheck (fast, authoritative): `npx tsc --noEmit` → exit 0, no errors.
- Full build (authoritative gate, includes i18n check): `npm run build` → "Compiled successfully".
- Runtime (required for Issues 1 and 3; coder MUST do this in-context): run `npm run dev`, sign in,
  open the fault and aeration/auto screens for a 159..172 machine AND for GTPL-154, and compare using
  browser DevTools Network + Console. There is no automated test framework in this repo
  (`package.json` has no test runner), so runtime checks are manual.

---

## Items

- [ ] 1. Issue 2 — hide the RH chip and the "RH = Relative Humidity" legend line in
      `AerationDiagram.tsx` when there is no RH value (no RH sensor). The component already resolves
      `humidity` via `readAeration(data).humidity` (keys `["AI_RH_Analog_Scale","RH_Analog_Scale","RH"]`);
      for 650T machines (154 and 159..172) the live row has none of these, so `humidity` is `undefined`.
      Compute a boolean `hasRh = humidity !== null && humidity !== undefined && String(humidity) !== ""`.
      Wrap the RH `<Chip label="RH" .../>` block (the `<div>` at `left: 40, top: 452`) in `{hasRh && (...)}`
      and wrap the legend `<div>RH = Relative Humidity</div>` in `{hasRh && (...)}`. Do NOT change the T2
      ambient chip above it or any other readout. A machine that DOES report an RH key keeps showing RH.
      A visual gap where the chip was is acceptable (note it if it looks bad).
      Files: `src/components/AerationDiagram.tsx`
      Verify: `npx tsc --noEmit` passes; then `npm run dev` and open the "without heating" aeration
      screen for a 159..172 machine and for GTPL-154 — the RH chip and the RH legend line are gone (no
      stray "--"), and the diagram otherwise matches GTPL-154. Confirm the blower/ambient/supply chips
      still render.

- [ ] 2. Issue 2 (same bug, second location) — stop rendering the blank "RH" row in the aeration
      telemetry panel for machines with no RH sensor. Both pages build a `temperatureRows` array that
      unconditionally pushes `{ key: "humidity", label: t("RH"), value: formatValue(humidityRaw, "%") }`,
      which shows "--" for 650T machines. Make that row conditional on RH availability (same `hasRh`
      rule as item 1: include the humidity row only when `humidityRaw != null && String(humidityRaw) !== ""`).
      Keep the `supply` and `ambient` rows unchanged. Apply the SAME change pattern to BOTH files.
      Files: `src/app/menu/aerations/without-heating/[without-heating]/page.tsx`,
      `src/app/menu/aerations/with-heating/[with-heating]/page.tsx`
      Verify: `npx tsc --noEmit` passes; then in `npm run dev`, open both aeration screens for a 159..172
      machine and GTPL-154 — the "RH" telemetry row is absent (no "--"), supply + ambient rows still show.
      For a machine that has an RH key, the RH row still appears (do not regress other machines).

- [ ] 3. Issue 1 — verify in-context whether the Fault "Alarm History" API fires for 159..172, and
      fix only a concrete in-repo gap if found. Background (already confirmed by code read, do NOT
      re-edit without runtime proof): `machineConfig.ts`, `faultConfig.ts`, `useAutoData.ts`,
      `devices.ts`, and `alarm_handler.py` already contain 159..172 identical to 154, and
      `src/app/api/getActiveFaults/route.ts` resolves their table from `machineConfig.ts` correctly.
      Steps for the coder:
      (a) `npm run dev`, sign in, open `/menu/fault/<device>` for e.g. `GTPL-159-gT-650T-S7-1200`,
          click "Alarm History" (and "Active Alarms"). In DevTools Network, confirm a request to
          `/api/getActiveFaults?machineName=GTPL-159-gT-650T-S7-1200&...` fires, and record its status
          and JSON. Repeat for `GTPL-154-gT-650T-S7-1200` and compare.
      (b) If the 159..172 request DOES fire and returns the same shape as 154 (data or empty-but-ok),
          there is NO in-repo bug — the blank history is backend/DB data (the `GTPL_1NN_GT_650T_S7_1200`
          tables/rows on the Go backend). Document this in the report: in-repo code is correct and
          mirrors 154; the resolution is backend/DB provisioning, out of this repo's scope. Do NOT invent
          an in-repo change to paper over missing backend data.
      (c) If the 159..172 request 404s with "Unknown machine identifier" (would indicate a missing
          `machineConfig.ts` key — currently present, so only possible if a key/string drifted) or
          resolves to the WRONG table, fix the specific `MACHINE_CONFIG` entry in
          `src/lib/machineConfig.ts` to mirror GTPL-154's shape (own table `GTPL_1NN_GT_650T_S7_1200`,
          `tags: GPL_124_TAGS`, `type: "S7-1200"`). If "Active Alarms" (live) is blank, confirm the device
          is in `ALWAYS_FETCH_DEVICES` in `useAutoData.ts` — it already is; do NOT edit that file.
      (d) If `alarm_handler.py` is the writer of history and a 159..172 entry is wrong, mirror the exact
          `GTPL_154` lines; note that the Python/Go toolchain may be unavailable (verify structurally via
          byte-level parity with the 154 block and say in the report it was not run).
      Files (only if a concrete gap is found): `src/lib/machineConfig.ts` and/or `alarm_handler.py`.
      If no gap is found, no files change for this item — that is an acceptable, documented outcome.
      Verify: Network tab shows the 159..172 `/api/getActiveFaults` request firing with the same status
      and table as GTPL-154. If any file changed, `npx tsc --noEmit` and `npm run build` pass; for
      `alarm_handler.py`, `python3 -m py_compile alarm_handler.py` (note if the interpreter is absent).

- [ ] 4. Issue 3 — verify in-context that the device detail/menu content renders for 159..172, and fix
      only a concrete in-repo page-level gap if found. Background (confirmed by code read): the menu grid
      `src/app/menu/[section]/page.tsx` builds its items purely from the `device` string pattern — 159..172
      fall into the same `else`/`baseMenuItems` branch as GTPL-154 (they are not `isGrainPaddyDevice`,
      not `isS7200Device`), with no running-status gate and no per-device omission, so the menu grid itself
      renders for 159..172 exactly like 154. The device CONTENT pages (`src/app/menu/auto/[auto]/page.tsx`,
      the aeration pages) read telemetry via `useAutoData`, whose running-status gate is already bypassed
      for 159..172 by `ALWAYS_FETCH_DEVICES`.
      Steps for the coder:
      (a) `npm run dev`, open `/menu/GTPL-159-gT-650T-S7-1200` (menu grid) and then each tile
          (Auto, Aeration, Fault, Inputs, Outputs, Settings) for 159..172 and for GTPL-154; compare.
      (b) If content now renders the same as 154 (expected, because the `useAutoData` bypass is on this
          branch), there is NO new in-repo change. Document that Issue 3's cause was the running-status
          data gate, resolved by the other workflow's `ALWAYS_FETCH_DEVICES` fix (commit `7b1b5ca`), and
          that this task confirms parity with 154. Do NOT edit `useAutoData.ts`.
      (c) If a specific page is still blank for 159..172 while populated for 154, trace that page's own
          gating (e.g. a device allow-list, a `useDataStore().user.monitorAccess` filter, or a 3D/mode
          branch) and apply a localized page-level fix so 159..172 take the same path as 154. Do NOT touch
          `useAutoData.ts` or the Analog Inputs page config.
      Files (only if a concrete page-level gap is found): the specific page under `src/app/menu/...`.
      If no gap is found, no files change for this item — documented outcome.
      Verify: for 159..172 the menu grid and each content screen render the same sections/content as
      GTPL-154 (visual compare in `npm run dev`). If any file changed, `npx tsc --noEmit` and
      `npm run build` pass.

- [ ] 5. Final verification gate. Run `npx tsc --noEmit` (exit 0) and `npm run build`
      ("Compiled successfully", static pages generated, no errors). Confirm no edits were made to
      `src/hooks/useAutoData.ts` or `src/app/menu/inputs/analog/[seaction]/page.tsx`
      (`git diff --name-only` must not list them). Confirm the prior Analog + AutoDiagram1 159..172
      features are untouched. Clean up any temporary files.
      Files: none (verification only).
      Verify: both commands pass; `git diff --name-only` shows only the intended files (a subset of
      `src/components/AerationDiagram.tsx`, the two aeration pages, and — only if runtime proved a gap —
      `src/lib/machineConfig.ts` and/or `alarm_handler.py` and/or a specific `src/app/menu` page).

## Notes / assumptions

- Issues 1 and 3 may require NO in-repo code change: exploration shows every in-repo config already
  mirrors GTPL-154 and the `useAutoData` running-status gate is already bypassed for 159..172. They are
  kept in the plan as runtime-verification items (never dismissed on code reading alone), with exact
  in-repo fix paths should runtime reveal a concrete gap. The honest, documented outcome if runtime is
  clean is: Issue 1 residue is backend/DB (out of repo), Issue 3 residue was the already-landed
  `useAutoData` bypass.
- Issue 2 is a definite in-repo bug with a concrete fix in 3 files (items 1 and 2).
- The loop's stop contract is unchanged: the reviewer writes
  `.agents/tasks/fix-159-172/review.json` with top-level `"verdict": "APPROVED"` as the loop's last child.
