# Implementation Plan — Clone GTPL-154 config to 14 new machines (GTPL-159 … GTPL-172)

## Goal

Add 14 new machines, each wired IDENTICALLY to the existing `GTPL-154-gT-650T-S7-1200`, into every code reference site in both repos. Purely mechanical replication: no new tags, no new faults, no DB schema changes, no new fault-column keys. The 14 DB tables already exist.

The 14 machines (frontend display name → DB table → short name), always inserted in ascending order 159→172, immediately AFTER the GTPL-154 entry (or after GTPL-155 where 155 follows 154 — see each item for the exact anchor):

| Display name (hyphen + lowercase `gT`) | DB table (underscore + UPPER) | Short name |
|---|---|---|
| GTPL-159-gT-650T-S7-1200 | GTPL_159_GT_650T_S7_1200 | GTPL_159 |
| GTPL-160-gT-650T-S7-1200 | GTPL_160_GT_650T_S7_1200 | GTPL_160 |
| GTPL-161-gT-650T-S7-1200 | GTPL_161_GT_650T_S7_1200 | GTPL_161 |
| GTPL-162-gT-650T-S7-1200 | GTPL_162_GT_650T_S7_1200 | GTPL_162 |
| GTPL-163-gT-650T-S7-1200 | GTPL_163_GT_650T_S7_1200 | GTPL_163 |
| GTPL-164-gT-650T-S7-1200 | GTPL_164_GT_650T_S7_1200 | GTPL_164 |
| GTPL-165-gT-650T-S7-1200 | GTPL_165_GT_650T_S7_1200 | GTPL_165 |
| GTPL-166-gT-650T-S7-1200 | GTPL_166_GT_650T_S7_1200 | GTPL_166 |
| GTPL-167-gT-650T-S7-1200 | GTPL_167_GT_650T_S7_1200 | GTPL_167 |
| GTPL-168-gT-650T-S7-1200 | GTPL_168_GT_650T_S7_1200 | GTPL_168 |
| GTPL-169-gT-650T-S7-1200 | GTPL_169_GT_650T_S7_1200 | GTPL_169 |
| GTPL-170-gT-650T-S7-1200 | GTPL_170_GT_650T_S7_1200 | GTPL_170 |
| GTPL-171-gT-650T-S7-1200 | GTPL_171_GT_650T_S7_1200 | GTPL_171 |
| GTPL-172-gT-650T-S7-1200 | GTPL_172_GT_650T_S7_1200 | GTPL_172 |

## Design decisions (grounded in the code read during exploration)

1. **Reuse GTPL-154's exact values, invent nothing.** Every 650T attribute GTPL-154 uses is reused verbatim: `tags: GPL_124_TAGS`, `type: "S7-1200"`, `image: "/images/650.jpeg"`, `plc: "S7-1200"`, `chillerModel: "GT-650T"` (uppercase `GT` — matches GTPL-154 in `devices.ts`), `faultCodeColumn: "FAULT_CODE"`, `activeFaultColumns: MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]`, `shared650T_config`, and the three temperature-sensor/control/compressor sub-objects. Rationale: the task is a 1:1 clone; GTPL-154 already references shared constants, so no new tag arrays, no new fault-column keys, and no new `faultConfig_complete.ts` entries are needed — the new machines point at the SAME existing `GTPL_068_GT_650T_S7_1200` fault-column key that GTPL-154 points at.

2. **Location = `Noida` everywhere a location field exists for the device.** This applies to `src/lib/devices.ts` and `src/components/layout/activity-panel.tsx` (where GTPL-154 currently reads `"Ganga Nagar"` and `"India"` respectively — the new machines use `"Noida"`). Rationale: explicit user instruction. NOTE: `machineConfig.ts` GTPL-154 has NO `location` field (only the Philippines machines 156/157 do), so to clone GTPL-154 exactly the new `machineConfig.ts` entries must NOT add a `location` key.

3. **Casing is literal and differs by context.** Frontend display keys use hyphen + lowercase `gT` (`GTPL-159-gT-650T-S7-1200`). Table names and short names use underscore + UPPER (`GTPL_159_GT_650T_S7_1200`, `GTPL_159`). Do not normalize or cross-convert.

4. **Do not modify or delete the GTPL-154 or GTPL-155 entries.** Only insert new lines.

5. **Comments are not edited.** Lines like `// 650T machines (GTPL_154/155 ...)` and `// 650T family shares the GTPL_154/155 ...` are documentation inside source and need no change (the logic they annotate is updated via the code clauses).

6. **Scope of "skip docs":** `DATABASE_SCHEMA.md`, `kabu_tables_column_order.md`, `README.md`, `.kiro/specs/*`, and `scripts/config-sync/config.json` are NOT edited. `config.json` only syncs `MACHINE_CONFIG` to a *different* project (the grain_technik mobile app) and is additive-only; it is not read by this app at runtime, so it is out of scope. All `.md` files are pure documentation.

## Reference-site inventory (verified by grep of BOTH repos for `GTPL-154` AND `GTPL_154`)

Frontend `src` files with real code refs (count excludes comment-only lines):
`machineConfig.ts`, `faultConfig.ts`, `dbSchema.ts`, `monitorOptions.ts`, `kabuColumnOrder.ts`, `app/reports/page.tsx`, `app/registration-form/page.tsx`, `app/devices/page.tsx`, `hooks/useAutoData.ts`, `utils/faultLogs.ts`, `components/layout/activity-panel.tsx`, `components/AerationwithHeating.tsx`, `components/AutoDiagram1.tsx`, `app/menu/aerations/[aerations]/page.tsx`, `app/menu/auto/[auto]/page.tsx`, `app/menu/auto-grain/[auto-grain]/page.tsx`, `app/menu/auto-paddy/[auto-paddy]/page.tsx`, `app/menu/inputs/analog/[seaction]/page.tsx`, `app/menu/outputs/[outputs]/page.tsx`, `app/api/getAllDataSmart200/route.ts`.
Frontend non-src: `alarm_handler.py`.
Backend (`grain_backend`): `handlers/machine.go`, `handlers/export.go`, `handlers/export_excel.go`.

**TWO sites beyond the task's original numbered list were found and ARE included below (items 24 and 25): `src/app/api/getAllDataSmart200/route.ts` (table-name array) and `src/lib/kabuColumnOrder.ts` (table → column-order map).**

## Build / test commands discovered

- Frontend: `cd /Users/shubham/Desktop/project/new_plc_software`
  - Type/lint gate used by this plan: `npx tsc --noEmit` (TypeScript strict check; fastest way to catch a mistyped key/missing const). The project's full build is `npm run build` (runs `node scripts/check-translations.mjs && next build`) — heavier; run once at the end.
  - Node v24 and `npx` are available in this environment; `tsconfig.json` is present.
- Backend: `cd /Users/shubham/Desktop/project/grain_backend`
  - Ideal: `gofmt -l handlers/*.go` (must list NO files → formatting/alignment correct) and `go build ./...`.
  - **CONSTRAINT:** the Go toolchain is NOT installed in this environment (`go` not found). If `go`/`gofmt` remain unavailable to the implementer, verify the Go edits by: (a) confirming each new map entry is syntactically identical in shape to the GTPL_154/GTPL_155 lines it follows, (b) confirming the `machine.go` map keeps gofmt column alignment (value column aligned to the longest key — the existing block pads keys to the `":"` then aligns the value start; new 650T keys are the same length as `GTPL_154_GT_650T_S7_1200` so reuse the SAME padding), and (c) running the frontend tsc check which is unaffected. State clearly in the result which backend verification was run vs skipped.

---

# Implementation Plan

- [ ] 1. `src/lib/devices.ts` — add 14 `Device` objects to the `ALL_DEVICES` array, immediately AFTER the `GTPL-155-gT-650T-S7-1200` object (GTPL-155 directly follows GTPL-154 here; insert after 155 to keep 154/155 together, then 159→172).
      Existing GTPL-154 literal (the shape to copy; change name + set location to `Noida`):
      ```ts
      {
        name: "GTPL-154-gT-650T-S7-1200",
        location: "Ganga Nagar",
        image: "/images/650.jpeg",
        plc: "S7-1200",
        chillerModel: "GT-650T",
      },
      ```
      Insert 14 objects (159…172), each exactly:
      ```ts
      {
        name: "GTPL-159-gT-650T-S7-1200",
        location: "Noida",
        image: "/images/650.jpeg",
        plc: "S7-1200",
        chillerModel: "GT-650T",
      },
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/lib/devices.ts (after ~line 338, the GTPL-155 object)
      Verify: `cd /Users/shubham/Desktop/project/new_plc_software && npx tsc --noEmit` passes with no new errors.

- [ ] 2. `src/lib/machineConfig.ts` — add 14 entries to the `MACHINE_CONFIG` object, immediately AFTER the `"GTPL-155-gT-650T-S7-1200"` entry (~line after the 155 block). Do NOT add a `location` field (GTPL-154 has none here).
      Existing GTPL-154 literal:
      ```ts
      "GTPL-154-gT-650T-S7-1200": {
        table: "GTPL_154_GT_650T_S7_1200",
        tags: GPL_124_TAGS,
        type: "S7-1200",
      },
      ```
      Insert 14 (159…172), each exactly (table uses the machine's own number):
      ```ts
      "GTPL-159-gT-650T-S7-1200": {
        table: "GTPL_159_GT_650T_S7_1200",
        tags: GPL_124_TAGS,
        type: "S7-1200",
      },
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/lib/machineConfig.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 3. `src/lib/faultConfig.ts` — add 14 entries to the `MACHINE_CONFIG` object (this file has its OWN `MACHINE_CONFIG` separate from machineConfig.ts), immediately AFTER the `"GTPL-155-gT-650T-S7-1200"` entry (GTPL-154 is at ~line 572, GTPL-155 at ~579). Reuse the SAME `MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]` key — do NOT create a new fault-column key.
      Existing GTPL-154 literal (~line 572):
      ```ts
      "GTPL-154-gT-650T-S7-1200": {
        table: "GTPL_154_GT_650T_S7_1200",
        tags: GPL_124_TAGS,
        type: "S7-1200",
        faultCodeColumn: "FAULT_CODE",
        activeFaultColumns: MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"],
      },
      ```
      Insert 14 (159…172), each exactly (only the display key and `table` change; `activeFaultColumns` stays `GTPL_068_GT_650T_S7_1200`):
      ```ts
      "GTPL-159-gT-650T-S7-1200": {
        table: "GTPL_159_GT_650T_S7_1200",
        tags: GPL_124_TAGS,
        type: "S7-1200",
        faultCodeColumn: "FAULT_CODE",
        activeFaultColumns: MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"],
      },
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/lib/faultConfig.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 4. `src/lib/dbSchema.ts` — TWO maps. (a) In `DB_SCHEMAS` (~line after `GTPL_154_GT_650T_S7_1200: T_650,` / `GTPL_155_GT_650T_S7_1200: T_650,`), add 14 keys pointing at the SAME `T_650` schema. (b) In `DEVICE_TO_SCHEMA_TABLE`, add 14 display-name → table-name entries after the GTPL-155 line. The leading comment `// ---- 650T machines (GTPL_154 / GTPL_155 ...)` is left unchanged.
      Existing in `DB_SCHEMAS`:
      ```ts
      GTPL_154_GT_650T_S7_1200: T_650,
      GTPL_155_GT_650T_S7_1200: T_650,
      ```
      Add 14 (159…172), each:
      ```ts
      GTPL_159_GT_650T_S7_1200: T_650,
      ```
      Existing in `DEVICE_TO_SCHEMA_TABLE`:
      ```ts
      "GTPL-154-gT-650T-S7-1200": "GTPL_154_GT_650T_S7_1200",
      "GTPL-155-gT-650T-S7-1200": "GTPL_155_GT_650T_S7_1200",
      ```
      Add 14 (159…172), each:
      ```ts
      "GTPL-159-gT-650T-S7-1200": "GTPL_159_GT_650T_S7_1200",
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/lib/dbSchema.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 5. `src/lib/monitorOptions.ts` — add 14 display-name strings to the `MONITOR_ACCESS_OPTIONS` source array, immediately after `"GTPL-155-gT-650T-S7-1200",` (last-but-one before the closing `].map(...)`).
      Existing:
      ```ts
      "GTPL-154-gT-650T-S7-1200",
      "GTPL-155-gT-650T-S7-1200",
      ```
      Add 14 (159…172), each `  "GTPL-159-gT-650T-S7-1200",` … `  "GTPL-172-gT-650T-S7-1200",`.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/lib/monitorOptions.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 6. `src/lib/kabuColumnOrder.ts` — add 14 entries to the `KABU_COLUMN_ORDER` map, immediately after the GTPL-155 line (~line 72–73), each pointing at `parseColumns(GTPL_650T_cols)` (same column set GTPL-154/155 use). **(Site beyond original task list — found via grep.)**
      Existing (~line 72):
      ```ts
      'GTPL_154_GT_650T_S7_1200': parseColumns(GTPL_650T_cols),
      'GTPL_155_GT_650T_S7_1200': parseColumns(GTPL_650T_cols),
      ```
      Add 14 (159…172), each:
      ```ts
      'GTPL_159_GT_650T_S7_1200': parseColumns(GTPL_650T_cols),
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/lib/kabuColumnOrder.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 7. `src/app/reports/page.tsx` — THREE places. (a) name array (~line 69): after `"GTPL-155-gT-650T-S7-1200",` add 14 display names. (b) display-name→table map (~line 115): after the GTPL-155 line add 14 `"GTPL-159-gT-650T-S7-1200": "GTPL_159_GT_650T_S7_1200",` entries. (c) table-name array (~line 169): after `"GTPL_155_GT_650T_S7_1200",` add 14 table-name strings.
      Existing snippets:
      ```ts
      // (a) ~69
      "GTPL-154-gT-650T-S7-1200",
      "GTPL-155-gT-650T-S7-1200",
      // (b) ~115
      "GTPL-154-gT-650T-S7-1200": "GTPL_154_GT_650T_S7_1200",
      "GTPL-155-gT-650T-S7-1200": "GTPL_155_GT_650T_S7_1200",
      // (c) ~169
      "GTPL_154_GT_650T_S7_1200",
      "GTPL_155_GT_650T_S7_1200",
      ```
      Add the 14 analogous lines (159…172) in EACH of the three locations, matching that location's exact format.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/reports/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 8. `src/app/registration-form/page.tsx` — add 14 `{ value, label }` options after the GTPL-155 line (~line 272–273).
      Existing (~272):
      ```ts
      { value: "GTPL-154-gT-650T-S7-1200", label: "GTPL-154-gT-650T-S7-1200" },
      { value: "GTPL-155-gT-650T-S7-1200", label: "GTPL-155-gT-650T-S7-1200" },
      ```
      Add 14 (159…172), each:
      ```ts
      { value: "GTPL-159-gT-650T-S7-1200", label: "GTPL-159-gT-650T-S7-1200" },
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/registration-form/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 9. `src/app/devices/page.tsx` — add 14 display-name → short-name entries after the GTPL-155 line (~line 779–780).
      Existing (~779):
      ```ts
      "GTPL-154-gT-650T-S7-1200": "GTPL_154",
      "GTPL-155-gT-650T-S7-1200": "GTPL_155",
      ```
      Add 14 (159…172), each `"GTPL-159-gT-650T-S7-1200": "GTPL_159",`.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/devices/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 10. `src/hooks/useAutoData.ts` — TWO maps. (a) display-name → full table (~line 46–47): add 14 `"GTPL-159-gT-650T-S7-1200": "GTPL_159_GT_650T_S7_1200",`. (b) display-name → short name (~line 93–94, note no space after colon in existing lines): add 14 `"GTPL-159-gT-650T-S7-1200":"GTPL_159",`.
      Existing:
      ```ts
      // (a) ~46
       "GTPL-154-gT-650T-S7-1200": "GTPL_154_GT_650T_S7_1200",
       "GTPL-155-gT-650T-S7-1200": "GTPL_155_GT_650T_S7_1200",
      // (b) ~93
        "GTPL-154-gT-650T-S7-1200":"GTPL_154",
        "GTPL-155-gT-650T-S7-1200":"GTPL_155",
      ```
      Add the 14 analogous lines in BOTH maps, matching each map's exact spacing.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/hooks/useAutoData.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 11. `src/utils/faultLogs.ts` — in the 650T-family `if` chain (~line 383), add 14 `||` clauses after the `machineName === "GTPL-155-gT-650T-S7-1200" ||` line. Comments at ~313 and ~381 are not edited.
      Existing (~383):
      ```ts
          machineName === "GTPL-154-gT-650T-S7-1200" ||
          machineName === "GTPL-155-gT-650T-S7-1200" ||
      ```
      Add 14 (159…172), each on its own line in the same style:
      ```ts
          machineName === "GTPL-159-gT-650T-S7-1200" ||
      ```
      (Insert them between the GTPL-155 clause and the GTPL-133 clause.)
      Files: /Users/shubham/Desktop/project/new_plc_software/src/utils/faultLogs.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 12. `src/components/layout/activity-panel.tsx` — add 14 machine objects after the GTPL-155 object (~line 38–39), one per line matching the existing single-line object format; set `location: "Noida"`.
      Existing (~38):
      ```tsx
      { name: "GTPL-154-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
      { name: "GTPL-155-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
      ```
      Add 14 (159…172), each (location → Noida; keep `chillerModel: "gT-650T"` exactly as the 154/155 lines here use lowercase `gT`):
      ```tsx
      { name: "GTPL-159-gT-650T-S7-1200", location: "Noida", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/components/layout/activity-panel.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 13. `src/components/AerationwithHeating.tsx` — in the single-line OR-chain (~line 162), add 14 `|| machineName === "GTPL-159-gT-650T-S7-1200"` … clauses immediately after the existing `machineName === "GTPL-154-gT-650T-S7-1200" || machineName === "GTPL-155-gT-650T-S7-1200"` segment (keep it a continuous expression ending in `? "T0" : "TH"`).
      Existing fragment within the line:
      ```tsx
      machineName === "GTPL-154-gT-650T-S7-1200" || machineName === "GTPL-155-gT-650T-S7-1200" ||
      ```
      Insert after the 155 clause: `machineName === "GTPL-159-gT-650T-S7-1200" || … || machineName === "GTPL-172-gT-650T-S7-1200" ||` (all 14, keeping the trailing `||` so the following `GTPL-131` clause stays valid).
      Files: /Users/shubham/Desktop/project/new_plc_software/src/components/AerationwithHeating.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 14. `src/components/AutoDiagram1.tsx` — THREE string arrays each contain GTPL-154/155; add the 14 display names to each, immediately after that array's `"GTPL-155-gT-650T-S7-1200",` line. The arrays are at ~line 960 (first array, `.some(name => machineName.includes(name))`), ~line 999 (`isHTRMachine`), and ~line 1044 (`is6FanMachine`). In each, add:
      ```tsx
      "GTPL-159-gT-650T-S7-1200",
      … through …
      "GTPL-172-gT-650T-S7-1200",
      ```
      Existing anchor in each array:
      ```tsx
      "GTPL-154-gT-650T-S7-1200",
      "GTPL-155-gT-650T-S7-1200",
      ```
      Files: /Users/shubham/Desktop/project/new_plc_software/src/components/AutoDiagram1.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 15. `src/app/menu/aerations/[aerations]/page.tsx` — in the single-line `device === …` OR-chain (~line 25), add 14 `|| device === "GTPL-159-gT-650T-S7-1200"` … clauses after the existing `device === "GTPL-154-gT-650T-S7-1200" || device === "GTPL-155-gT-650T-S7-1200"` segment.
      Existing fragment:
      ```tsx
      device === "GTPL-154-gT-650T-S7-1200" || device === "GTPL-155-gT-650T-S7-1200" ||
      ```
      Insert the 14 clauses (159…172) right after the 155 clause, each `device === "GTPL-159-gT-650T-S7-1200" ||`.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/menu/aerations/[aerations]/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 16. `src/app/menu/auto/[auto]/page.tsx` — TWO places. (a) Per-machine config object (~line 398) keyed by display name with `serialNumber: "GTPL_154"` + temperatureSensors/controls/compressor: replicate the FULL object 14 times after the GTPL-155 block (~line 417+), using matching short serial numbers (`GTPL_159`…`GTPL_172`). Preserve the `// Note: TH (Supply Air) is intentionally excluded for this machine` comment line inside each object (it is part of the GTPL-154/155 shape here). (b) Device-list array (~line 853): add 14 display names after `"GTPL-155-gT-650T-S7-1200",`.
      Existing (a) GTPL-154 object (~398):
      ```tsx
        "GTPL-154-gT-650T-S7-1200": {
        serialNumber: "GTPL_154",
        temperatureSensors: {
          T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
          T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
          T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
          // Note: TH (Supply Air) is intentionally excluded for this machine
        },
        controls: {
          AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
          HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
          BLOWER: { key: "Blower_speed", label: "Blower" },
        },
        compressor: {
          time: "Compressor_timer",
          hp: "HP_value",
          lp: "LP_value",
        },
      },
      ```
      Add 14 objects (159…172); for GTPL-159 the only change is the key and `serialNumber: "GTPL_159"` (everything else identical). Existing (b) array (~853):
      ```tsx
      "GTPL-154-gT-650T-S7-1200",
      "GTPL-155-gT-650T-S7-1200",
      ```
      Add 14 display names after the 155 line.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/menu/auto/[auto]/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 17. `src/app/menu/auto-grain/[auto-grain]/page.tsx` — per-machine config object (~line 393) with `serialNumber: "GTPL_154_GRAIN"` + temperatureSensors/controls/compressor; replicate the FULL object 14 times after the GTPL-155 block (~line 411+) with serial `GTPL_159_GRAIN`…`GTPL_172_GRAIN`.
      Existing GTPL-154 object (~393):
      ```tsx
      "GTPL-154-gT-650T-S7-1200": {
        serialNumber: "GTPL_154_GRAIN",
        temperatureSensors: {
          T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
          T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
          T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
          AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
          HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
          BLOWER: { key: "Blower_speed", label: "Blower" },
        },
        compressor: {
          time: "Compressor_timer",
          hp: "HP_value",
          lp: "LP_value",
        },
      },
      ```
      Add 14 (159…172); GTPL-159 uses key `"GTPL-159-gT-650T-S7-1200"` and `serialNumber: "GTPL_159_GRAIN"`, rest identical.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/menu/auto-grain/[auto-grain]/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 18. `src/app/menu/auto-paddy/[auto-paddy]/page.tsx` — per-machine config object (~line 401) with `serialNumber: "GTPL_154_PADDY"` + temperatureSensors/controls/compressor; replicate the FULL object 14 times after the GTPL-155 block (~line 419+) with serial `GTPL_159_PADDY`…`GTPL_172_PADDY`. Same object shape as item 17 but `_PADDY` suffix.
      Existing GTPL-154 object (~401):
      ```tsx
      "GTPL-154-gT-650T-S7-1200": {
        serialNumber: "GTPL_154_PADDY",
        temperatureSensors: {
          T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
          T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
          T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
          AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
          HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
          BLOWER: { key: "Blower_speed", label: "Blower" },
        },
        compressor: {
          time: "Compressor_timer",
          hp: "HP_value",
          lp: "LP_value",
        },
      },
      ```
      Add 14 (159…172); GTPL-159 uses `serialNumber: "GTPL_159_PADDY"`.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/menu/auto-paddy/[auto-paddy]/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 19. `src/app/menu/inputs/analog/[seaction]/page.tsx` — FOUR edits. (a) config map (~line 374): after `"GTPL-155-gT-650T-S7-1200": shared650T_config,` add 14 `"GTPL-159-gT-650T-S7-1200": shared650T_config,` entries. (b) single-line OR-chain (~line 595): add 14 `|| device === "GTPL-159-gT-650T-S7-1200"` clauses after the 155 clause. (c) multi-line OR-chain (~line 681): add 14 `device === 'GTPL-159-gT-650T-S7-1200' ||` lines after `device === 'GTPL-155-gT-650T-S7-1200' ||` — NOTE this block uses SINGLE quotes. (d) second multi-line OR-chain (~line 696): same 14 single-quoted clauses after its 155 line.
      Existing (a) (~374):
      ```tsx
      "GTPL-154-gT-650T-S7-1200": shared650T_config,
      "GTPL-155-gT-650T-S7-1200": shared650T_config,
      ```
      Existing (b) fragment (~595, double quotes): `device === "GTPL-154-gT-650T-S7-1200" || device === "GTPL-155-gT-650T-S7-1200" ||`
      Existing (c)/(d) (~681 / ~696, single quotes):
      ```tsx
      device === 'GTPL-154-gT-650T-S7-1200' ||
      device === 'GTPL-155-gT-650T-S7-1200' ||
      ```
      Add the 14 analogous entries in all four spots, matching each spot's quote style and layout.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/menu/inputs/analog/[seaction]/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 20. `src/app/menu/outputs/[outputs]/page.tsx` — TWO OR-chains. (a) `deviceType === …` (~line 60): add 14 `|| deviceType === "GTPL-159-gT-650T-S7-1200"` clauses after the GTPL-155 clause. (b) `device === …` (~line 373): add 14 `|| device === "GTPL-159-gT-650T-S7-1200"` clauses after the GTPL-155 clause.
      Existing (a): `deviceType === "GTPL-154-gT-650T-S7-1200" || deviceType === "GTPL-155-gT-650T-S7-1200" ||`
      Existing (b): `device === "GTPL-154-gT-650T-S7-1200" || device === "GTPL-155-gT-650T-S7-1200" ||`
      Add 14 clauses in each, matching the respective variable name (`deviceType` vs `device`).
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/menu/outputs/[outputs]/page.tsx
      Verify: `npx tsc --noEmit` passes.

- [ ] 21. `src/app/api/getAllDataSmart200/route.ts` — add 14 table-name strings to the `as const` table-name array, immediately after `"GTPL_155_GT_650T_S7_1200",` (~line 712–713). **(Site beyond original task list — found via grep.)**
      Existing (~712):
      ```ts
      "GTPL_154_GT_650T_S7_1200",
      "GTPL_155_GT_650T_S7_1200",
      ```
      Add 14 (159…172), each `  "GTPL_159_GT_650T_S7_1200",`.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/app/api/getAllDataSmart200/route.ts
      Verify: `npx tsc --noEmit` passes.

- [ ] 22. `alarm_handler.py` (frontend repo root) — add 14 table-name strings to the `machine_tables` list, immediately after `'GTPL_155_GT_650T_S7_1200',` (~line 174–175). This list is read by the app's alarm handler (an enumerated list, not docs), so it is in scope.
      Existing (~174):
      ```python
      'GTPL_154_GT_650T_S7_1200',
      'GTPL_155_GT_650T_S7_1200',
      ```
      Add 14 (159…172), each `            'GTPL_159_GT_650T_S7_1200',` (match the existing 12-space indent).
      Files: /Users/shubham/Desktop/project/new_plc_software/alarm_handler.py
      Verify: `cd /Users/shubham/Desktop/project/new_plc_software && python3 -m py_compile alarm_handler.py` exits 0 (no syntax error). If `python3` is unavailable, confirm each added line matches the existing quoting/indent and the list brackets remain balanced.

- [ ] 23. BACKEND `handlers/machine.go` — add 14 entries to the table → short-name map, immediately after `"GTPL_155_GT_650T_S7_1200":         "GTPL_155",` (~line 63–64). CRITICAL: preserve gofmt column alignment. The new 650T table keys are the SAME character length as `"GTPL_154_GT_650T_S7_1200":`, so copy the exact whitespace padding from the GTPL_154/GTPL_155 lines (do not retype spaces by eye — duplicate the 154 line and change the digits).
      Existing (~63):
      ```go
      "GTPL_154_GT_650T_S7_1200":         "GTPL_154",
      "GTPL_155_GT_650T_S7_1200":         "GTPL_155",
      ```
      Add 14 (159…172), each:
      ```go
      "GTPL_159_GT_650T_S7_1200":         "GTPL_159",
      ```
      Files: /Users/shubham/Desktop/project/grain_backend/handlers/machine.go
      Verify (preferred): `cd /Users/shubham/Desktop/project/grain_backend && gofmt -l handlers/machine.go` prints nothing AND `go build ./...` succeeds. If the Go toolchain is unavailable (it is not installed in this environment), confirm the 14 new lines are byte-identical in shape/padding to the GTPL_154 line and the map braces stay balanced; state in the result that `go build`/`gofmt` was skipped due to missing toolchain.

- [ ] 24. BACKEND `handlers/export.go` — add 14 entries to the short-name → timezone map, immediately after `"GTPL_155": mustLoadLocation("Asia/Kolkata"),` (~line 48–49). Use `Asia/Kolkata` for all 14 (same as GTPL_154).
      Existing (~48):
      ```go
      "GTPL_154": mustLoadLocation("Asia/Kolkata"),
      "GTPL_155": mustLoadLocation("Asia/Kolkata"),
      ```
      Add 14 (159…172), each:
      ```go
      "GTPL_159": mustLoadLocation("Asia/Kolkata"),
      ```
      Files: /Users/shubham/Desktop/project/grain_backend/handlers/export.go
      Verify: same as item 23 (`gofmt -l` + `go build ./...` if available; otherwise shape/brace check and note the skip).

- [ ] 25. BACKEND `handlers/export_excel.go` — add the 14 short names to the allowed-table bool map. The existing line (~124) packs several entries on one line: `"GTPL_132": true, "GTPL_133": true, "GTPL_154": true, "GTPL_155": true,`. Add the 14 new entries (`"GTPL_159": true,` … `"GTPL_172": true,`) immediately after `"GTPL_155": true,`; adding them on a new continuation line within the same map literal is fine (gofmt will normalize spacing).
      Existing (~124):
      ```go
      "GTPL_132": true, "GTPL_133": true, "GTPL_154": true, "GTPL_155": true,
      ```
      Resulting addition (one acceptable layout):
      ```go
      "GTPL_132": true, "GTPL_133": true, "GTPL_154": true, "GTPL_155": true,
      "GTPL_159": true, "GTPL_160": true, "GTPL_161": true, "GTPL_162": true,
      "GTPL_163": true, "GTPL_164": true, "GTPL_165": true, "GTPL_166": true,
      "GTPL_167": true, "GTPL_168": true, "GTPL_169": true, "GTPL_170": true,
      "GTPL_171": true, "GTPL_172": true,
      ```
      Files: /Users/shubham/Desktop/project/grain_backend/handlers/export_excel.go
      Verify: same as item 23 (`gofmt -l` + `go build ./...` if available; otherwise brace/quote check and note the skip).

- [ ] 26. Final integration verification (frontend).
      Run the full frontend build once all frontend edits are in. Confirm all 14 new machine names appear exactly once per expected site via a cross-check grep (count should increase by 14 per site vs the GTPL-154 baseline).
      Files: none (verification only)
      Verify: `cd /Users/shubham/Desktop/project/new_plc_software && npx tsc --noEmit` passes, then `npm run build` completes without error. Cross-check: `grep -rc "GTPL-159-gT-650T-S7-1200" src` returns the same per-file counts that GTPL-154 had in each edited file (e.g. reports/page.tsx shows the name in the two name-keyed spots; AutoDiagram1 shows it in all three arrays). Also `grep -rn "GTPL-15[0-8]\|GTPL_15[0-8]" src | grep -c 154` is unchanged (GTPL-154 untouched).

- [ ] 27. Final integration verification (backend).
      Files: none (verification only)
      Verify (preferred): `cd /Users/shubham/Desktop/project/grain_backend && gofmt -l handlers/machine.go handlers/export.go handlers/export_excel.go` prints nothing and `go build ./...` succeeds. If the Go toolchain is unavailable, perform the structural checks described in items 23–25 for all three files and clearly state in the final report that `go build`/`gofmt` verification was skipped because `go` is not installed in this environment.

## Final checklist (must all hold)

- 14 names, exact casing: display `GTPL-159-gT-650T-S7-1200`…`GTPL-172-gT-650T-S7-1200`; tables `GTPL_159_GT_650T_S7_1200`…; shorts `GTPL_159`…`GTPL_172`.
- Location = `Noida` in `devices.ts` and `activity-panel.tsx` only (the two device-list sites with a location field). No `location` key added in `machineConfig.ts`.
- No new tags, fault arrays, or fault-column keys; new entries reuse `GPL_124_TAGS`, `shared650T_config`, `T_650`, `GTPL_650T_cols`, and `MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]`.
- GTPL-154 and GTPL-155 entries unchanged everywhere.
- Ordering: new entries inserted in ascending 159→172 immediately after the GTPL-155 anchor (or after GTPL-154 where 155 is not adjacent).
- Backend Go map alignment preserved (gofmt-clean).
- `.md` docs and `scripts/config-sync/config.json` NOT edited.
