# Verification — Fix GTPL-159…172 (match GTPL-154)

Iteration: FIRST (no `review.json` present at start).
Scope: three reported bugs for the 14 machines `GTPL-159-gT-650T-S7-1200` …
`GTPL-172-gT-650T-S7-1200`, made to behave exactly like `GTPL-154-gT-650T-S7-1200`.

## Commands run

| Command | Exit code | Result |
|---|---|---|
| `npx tsc --noEmit` (repo root) | 0 | No type errors. |
| `npx next build` (repo root) | 0 | Compiled successfully; all routes generated, incl. `/menu/fault/[fault]`, `/menu/aerations/with-heating/[with-heating]`, `/menu/aerations/without-heating/[without-heating]`, `/menu/inputs/analog/[seaction]`. |

Key build output (tail): the dynamic (ƒ) routes `/menu/fault/[fault]`,
`/menu/inputs/analog/[seaction]`, `/menu/auto/[auto]` all built without error. Exit 0.

No test framework exists in this repo (`package.json` has no test runner), so no automated
tests were run. No tests were added — Issue 2 is a straightforward conditional-render fix and
the build/typecheck cover it.

## Files changed (Issue 2 only)

- `src/components/AerationDiagram.tsx`
- `src/app/menu/aerations/without-heating/[without-heating]/page.tsx`
- `src/app/menu/aerations/with-heating/[with-heating]/page.tsx`

Confirmed NOT edited by this task:
- `src/hooks/useAutoData.ts` — left untouched (the 159..172 `ALWAYS_FETCH_DEVICES`
  bypass and the three per-device maps were already on the branch from commit `7b1b5ca`).
- `src/app/menu/inputs/analog/[seaction]/page.tsx` config — the `is159to172` /
  `shared650T_withFanSpeed_config` "Condenser fan speed" + "Static Pressure" feature work
  is intact and unchanged.
- `src/components/AutoDiagram1.tsx` — `is159to172Machine` fan-speed label + static-pressure
  badge intact and unchanged.

(Note: a workspace auto-commit swept pre-existing uncommitted GTPL-141 edits by another
workflow into commit `8a17533`; those `useAutoData.ts` / analog `+1` lines are about GTPL-141,
not authored by this task, and are unrelated to 159..172.)

---

## Issue 1 — Fault / Alarm history for 159..172

### Root cause / finding
No remaining in-repo gap. Every per-machine config layer already resolves 159..172
identically to GTPL-154:

- `src/lib/faultConfig.ts` — all 14 entries (`GTPL-159..172-gT-650T-S7-1200`) present, each
  byte-identical in shape to the 154 block: own `table: "GTPL_1NN_GT_650T_S7_1200"`,
  `tags: GPL_124_TAGS`, `type: "S7-1200"`, `faultCodeColumn: "FAULT_CODE"`,
  `activeFaultColumns: MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]` (same source as 154).
- `src/lib/machineConfig.ts` — all 14 present with own `GTPL_1NN_GT_650T_S7_1200` table,
  `GPL_124_TAGS`, `type: "S7-1200"`. This is the file `src/app/api/getActiveFaults/route.ts`
  imports, so Alarm History resolves their table correctly and does NOT 404.
- `src/hooks/useAutoData.ts` — 159..172 present in `autoTypeToTableMap`,
  `deviceNameToStatusKey`, and `ALWAYS_FETCH_DEVICES`, so the live row for Active Alarms is
  fetched even when the status feed reports them off (same data as 154 would get).
- `alarm_handler.py` — all 14 tables present in `machine_tables`, byte-identical in form to the
  `GTPL_154_GT_650T_S7_1200` / `GTPL_155_…` lines. Registration via
  `machine_id = table.split('_')[1]` yields `"159"`…`"172"`, the same scheme that yields `"154"`.

### Code path of the fix
No in-repo file needed changing for Issue 1. The exact paths that carry 159..172 to parity
with 154:
- Fault page `src/app/menu/fault/[fault]/page.tsx` has **no running-status gate** — it renders
  for any machine. "Active Alarms" uses `getActiveFaults(machineName, data)` (data from
  `useAutoData`, already fetched for 159..172). "Alarm History" (`FaultLogsPaginated`) calls
  `GET /api/getActiveFaults?machineName=…`, which resolves the table from `machineConfig.ts`
  (present for 159..172) → `backendJson(/api/all700data/paginatedSmart200?table=…)`.

Noted but irrelevant: `src/app/api/check-faults/route.ts` has its own hardcoded `MACHINE_CONFIG`
that omits BOTH 154 and 159..172. A repo-wide search shows **no caller** of `/api/check-faults`
in the frontend — it is dead/standalone, so it is not the source of the bug and was left
unchanged (editing it would not be "match 154", since 154 is absent there too).

### Verifiable only at runtime
Whether the 159..172 `/api/getActiveFaults` request returns ROWS depends on the Go backend /
MySQL having the `GTPL_159_GT_650T_S7_1200` … `GTPL_172_GT_650T_S7_1200` tables populated. The
clone's backend Go edits live in a separate repo (per
`.agents/tasks/clone-gtpl154-159-172/verification.md`, which notes the Go toolchain was absent),
so this cannot be confirmed from this repo. If Alarm History is still blank for 159..172 in a
running browser while it is populated for 154, the residual cause is backend/DB table
provisioning — OUT OF THIS REPO'S SCOPE. The in-repo code is correct and mirrors 154.

`alarm_handler.py` was NOT run: no Python toolchain was invoked for it. Its 159..172 block was
verified structurally (byte-level parity with the 154/155 lines) by reading the file.

---

## Issue 2 — Aeration shows a blank "RH" readout (FIXED, in-repo)

### Root cause
650T machines (GTPL-154 and 159..172) have no RH sensor. `src/lib/aerationReadings.ts` resolves
`humidity` from keys `["AI_RH_Analog_Scale","RH_Analog_Scale","RH"]`; the live row for these
machines contains none of them, so `humidity` is `undefined` and `formatValue(undefined, "%")`
rendered a blank `"--"` RH chip (diagram) and a blank `"--"` RH telemetry row (both aeration
pages), plus a dangling "RH = Relative Humidity" legend line.

### Fix (code paths changed)
1. `src/components/AerationDiagram.tsx`
   - Added `const hasRh = humidity !== null && humidity !== undefined && String(humidity) !== "";`
   - Wrapped the RH `<Chip label="RH" …/>` block (the `left:40, top:452` div) in `{hasRh && (…)}`.
   - Wrapped the legend `<div>RH = Relative Humidity</div>` in `{hasRh && …}`.
   - The T2-ambient chip, blower/heater/supply chips, and all other readouts are unchanged.
2. `src/app/menu/aerations/without-heating/[without-heating]/page.tsx`
   - Computed the same `hasRh` from `humidityRaw` and made the `humidity` row of
     `temperatureRows` conditional (`...(hasRh ? [humidityRow] : [])`). `supply` + `ambient`
     rows unchanged.
3. `src/app/menu/aerations/with-heating/[with-heating]/page.tsx`
   - Same change pattern as (2).

### Match to GTPL-154
154 is also a 650T machine with no RH key, so hiding RH there is correct and in-scope (the task
explicitly says 154 must match 159..172 for this fix). A machine that DOES report an RH key
(`humidity` non-empty) still shows the RH chip, legend line, and telemetry row — no regression
for other machines.

### Verifiable only at runtime
The exact pixel layout (whether the gap left by the removed chip looks acceptable) is only
observable in a running browser. The logic (chip/legend/row absent when `humidity` is empty,
present when non-empty) is covered by the code and the successful build.

---

## Issue 3 — Device detail / menu page shows nothing for 159..172

### Root cause / finding
No remaining in-repo gap. The menu grid `src/app/menu/[section]/page.tsx` builds its tiles purely
from the `device` string:
- 159..172 are NOT `isGrainPaddyDevice`, NOT `isS7200Device`, and `showAnalogMenu` is false for
  them (none of its code fragments match). They therefore fall into the same `else` /
  `baseMenuItems` branch as GTPL-154 (154 is likewise absent from all those lists). There is no
  running-status gate and no per-device omission in the grid.
- `monitorAccess` filtering is per-user, not per-machine, so it is identical for 154 and 159..172.

The device CONTENT pages (`auto`, aeration, fault, inputs, outputs, settings) read telemetry via
`useAutoData`, whose running-status gate is already bypassed for 159..172 by
`ALWAYS_FETCH_DEVICES` (commit `7b1b5ca`, already on the branch). So the historical
"blank page / no input" cause — the running-status data starvation — is already resolved upstream
and makes 159..172 take the same data path as 154.

### Code path
No in-repo file needed changing for Issue 3. Parity with 154 is produced by:
- the string-pattern `else` branch in `src/app/menu/[section]/page.tsx` (identical tiles), and
- the `ALWAYS_FETCH_DEVICES` bypass in `useAutoData.ts` (NOT edited here) feeding every content
  page the same live row 154 gets.

### Verifiable only at runtime
Whether each content screen is visually populated for 159..172 depends on the backend returning
their table rows (same backend dependency as Issue 1). From this repo, the routing and data wiring
are confirmed identical to 154; the actual on-screen content requires a running browser + populated
backend to confirm.

---

## Summary

- Issue 2: concrete in-repo bug, FIXED in 3 files; typecheck + build pass.
- Issues 1 and 3: no in-repo gap remained — every config layer (faultConfig.ts, machineConfig.ts,
  useAutoData.ts incl. ALWAYS_FETCH_DEVICES, devices.ts, alarm_handler.py, the menu grid branch)
  already mirrors GTPL-154 for 159..172. Any residual blank history/content in a running browser
  is backend/DB table provisioning for `GTPL_159..172_GT_650T_S7_1200`, which is outside this
  repo. Documented rather than papered over with an invented in-repo change.
- Forbidden files (`useAutoData.ts`, Analog page config) and prior feature work
  (AutoDiagram1 `is159to172Machine`, Analog `shared650T_withFanSpeed_config`) left intact.
