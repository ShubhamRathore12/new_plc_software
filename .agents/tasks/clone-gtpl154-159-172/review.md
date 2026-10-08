# Clone GTPL-154 config to 14 new machines (GTPL-159 … GTPL-172)

This change registers 14 new 650T chiller machines (GTPL-159 through GTPL-172) by replicating the existing `GTPL-154-gT-650T-S7-1200` device 1:1 across both repos: 23 reference sites in the Next.js frontend (`new_plc_software`, including `alarm_handler.py`) and 3 map sites in the Go backend (`grain_backend`). It is a purely mechanical clone — no new tags, fault columns, or DB schemas are invented; every new entry points at the same shared constants GTPL-154 uses (`GPL_124_TAGS`, `shared650T_config`, `T_650`, `GTPL_650T_cols`, `MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]`). The only intentional deviation from GTPL-154 is the location field, set to `Noida` wherever a location exists.

Watch for: the backend `go build ./...` was NOT run — the Go toolchain is absent from this environment (confirmed: `which go` / `gofmt` both fail), so the three Go edits were verified structurally and by byte-level diff inspection rather than by compiler (confirmed). Everything else passes the authoritative frontend gates (`tsc --noEmit` + `next build`).

**Verdict**: APPROVED

## High-level view

The replication is complete and uniform. A grep cross-check confirms each of the 14 new machines has exactly the same footprint as GTPL-154 — 29 display-name occurrences and 10 table-name occurrences across the frontend, and 3 short-name occurrences across the backend — meaning no reference site was missed and none was duplicated (confirmed).

Naming follows the three required casings exactly: display form `GTPL-159-gT-650T-S7-1200` (hyphen + lowercase `gT`), DB table `GTPL_159_GT_650T_S7_1200` (underscore + uppercase), short name `GTPL_159`, plus the `_GRAIN` / `_PADDY` serial-number variants in the auto-grain and auto-paddy config maps (confirmed). Location is `Noida` in `devices.ts` and `activity-panel.tsx`; `machineConfig.ts` correctly omits a location key because GTPL-154 has none there (confirmed).

Config values are reused verbatim with no invented tags or fault columns — all 14 fault-config entries point at the shared `GTPL_068_GT_650T_S7_1200` fault-column key, and the backend timezone is `Asia/Kolkata` for all 14 (confirmed). GTPL-154 and GTPL-155 entries are untouched (confirmed).

The backend edits are correct by inspection but unverified by compiler, which is an acceptable gap here given the edits are trivial map-key additions byte-identical in shape to the GTPL-154 lines they follow, and the toolchain is unavailable to anyone in this environment (confirmed). Two cosmetic artifacts (a stray trailing-whitespace blank line, inconsistent indentation in one config map) are non-blocking and matched existing file style.

<details>
<summary>Issues (3)</summary>

1. **Backend go build unverified** (non-blocking) — `go build ./...` could not run because the Go toolchain is absent from the environment. The 3 edits are byte-identical map-entry additions confirmed in the diff; re-run `go build ./...` in a Go-enabled environment before merge if one is available.
2. **Stray trailing-whitespace line in devices/page.tsx** (cosmetic) — an empty `+    ` line was added before the closing `};` of the short-name map. Harmless; drop it on cleanup.
3. **Indentation inconsistency in auto/[auto]/page.tsx** (cosmetic) — the 14 inserted config keys use 6-space indentation, matching the pre-existing GTPL-081 entry's style in the same map rather than the 4-space GTPL-154 style. Does not affect behavior; build passes.

</details>

<details>
<summary>Details</summary>

### Naming and casing across the three contexts

The three required name forms are applied in the correct contexts throughout. Display keys everywhere use the hyphenated lowercase-`gT` form (`GTPL-159-gT-650T-S7-1200`), appearing in `devices.ts`, `machineConfig.ts`, `faultConfig.ts`, `dbSchema.ts` (`DEVICE_TO_SCHEMA_TABLE`), `monitorOptions.ts`, `reports/page.tsx`, `registration-form/page.tsx`, `devices/page.tsx`, `useAutoData.ts`, `faultLogs.ts`, `activity-panel.tsx`, the four analog/output/aeration OR-chains, the three `AutoDiagram1` arrays, and the three auto config maps. Table keys use the underscore-uppercase form (`GTPL_159_GT_650T_S7_1200`) in `dbSchema.ts` (`DB_SCHEMAS`), `kabuColumnOrder.ts`, `reports/page.tsx` (`ALLOWED_TABLES`), `getAllDataSmart200/route.ts`, `alarm_handler.py`, and `machine.go`. Short names (`GTPL_159`) land in `devices/page.tsx`, `useAutoData.ts` (`deviceNameToStatusKey`), `export.go`, and `export_excel.go`. The auto-grain and auto-paddy maps correctly use the `GTPL_159_GRAIN` and `GTPL_159_PADDY` serial-number variants, while the plain `auto` map uses the bare `GTPL_159` serial — matching GTPL-154's three variants.

### Config reuse — nothing invented

Every new entry reuses GTPL-154's exact shared references. `machineConfig.ts` and `faultConfig.ts` entries carry `tags: GPL_124_TAGS` and `type: "S7-1200"`; the fault-config entries additionally carry `faultCodeColumn: "FAULT_CODE"` and `activeFaultColumns: MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]` — the same shared fault-column key GTPL-154 points at, not a new per-machine key. `dbSchema.ts` maps all 14 tables to the shared `T_650` schema; `kabuColumnOrder.ts` to `parseColumns(GTPL_650T_cols)`; the analog config map to `shared650T_config`. The three auto config objects reproduce the identical `temperatureSensors` / `controls` / `compressor` sub-objects, and the `auto` variant preserves the `// Note: TH (Supply Air) is intentionally excluded` comment inside each object. `devices.ts` reuses `image: "/images/650.jpeg"`, `plc: "S7-1200"`, `chillerModel: "GT-650T"` (uppercase `GT`, as GTPL-154 uses there), while `activity-panel.tsx` reuses its lowercase `gT-650T` chillerModel. No fault columns such as condenser-fan-speed or static-pressure were added — the user's prompt referenced those as part of GTPL-154's existing config, and they flow in via the shared constants rather than new columns, which is the correct 1:1 interpretation.

### Location set to Noida

`location: "Noida"` is applied in the two places a location field exists for these devices — all 14 objects in `devices.ts` (where GTPL-154 reads `"Ganga Nagar"`) and all 14 in `activity-panel.tsx` (where GTPL-154 reads `"India"`). `machineConfig.ts` correctly adds no `location` key, since GTPL-154 has none there and the clone must match GTPL-154's shape exactly.

### Ordering and non-destruction

New entries are inserted in ascending order 159→172 immediately after the GTPL-155 anchor at every site. In files where the 650T family is one contiguous block (reports, analog, outputs, AutoDiagram1, useAutoData, kabuColumnOrder, dbSchema), the 14 lines sit directly between the GTPL-155 line and the next existing line. In files where GTPL-154/155 are followed by non-contiguous 650T members (devices.ts, faultConfig.ts, machineConfig.ts, the auto maps), the entries were still placed right after 155 per the plan's anchor, leaving GTPL-081/105/131 etc. after them. The GTPL-154 and GTPL-155 entries themselves are byte-for-byte unchanged in every file — the diff shows them only as unchanged context lines.

### Backend edits — correct by inspection, uncompiled

```
machine.go      machineStatusTables   "GTPL_1NN_GT_650T_S7_1200": "GTPL_1NN"   (×14)
export.go       machineTimezones      "GTPL_1NN": mustLoadLocation("Asia/Kolkata")  (×14)
export_excel.go isIndianMachine map   "GTPL_1NN": true   (×14, on continuation lines)
```

In `machine.go` the 14 new keys reuse the exact tab + 9-space padding of the GTPL_154 line (the new table keys are the same character length, so gofmt column alignment is preserved). In `export.go` all 14 use `Asia/Kolkata`, matching GTPL_154. In `export_excel.go` the 14 `true` entries are appended on new continuation lines inside the same map literal right after `"GTPL_155": true,` — gofmt-neutral since Go map literals don't care about line breaks. All three maps stay brace-balanced. `go build ./...` and `gofmt -l` could not be run (no Go toolchain in this environment, confirmed), so these are verified by diff inspection only. Given the edits are additive map keys identical in shape to adjacent working lines, the compile risk is low, but the gate evidence for the backend is structural rather than a passing build.

### Verification evidence

The frontend authoritative gates both passed per the coder's note: `npx tsc --noEmit` (exit 0, no type errors) and `npm run build` (exit 0, "Compiled successfully", 53/53 pages). `python3 -m py_compile alarm_handler.py` passed. The per-machine occurrence cross-check reproduced independently here: GTPL-154 and each of GTPL-159…172 show 29 display-name and 10 table-name occurrences in the frontend, and 3 short-name occurrences in the backend — uniform across all 14, confirming full coverage with no missed or duplicated site.

### Cosmetic artifacts

Two non-behavioral blemishes appear in the diff. `devices/page.tsx` gained a stray `+    ` blank line (trailing whitespace) before the closing `};` of the short-name map. `auto/[auto]/page.tsx` inserts its 14 config keys at 6-space indentation with the opening brace trailing the GTPL-155 close brace; this matches the pre-existing GTPL-081 entry's indentation in the same map rather than GTPL-154's 4-space style, so it is internally consistent with that file. Neither affects compilation (build passed) or behavior.

</details>

<details>
<summary>File map</summary>

Frontend (`new_plc_software`, staged):
- `src/lib/devices.ts` — 14 `Device` objects, location `Noida`
- `src/lib/machineConfig.ts` — 14 `MACHINE_CONFIG` entries (no location key)
- `src/lib/faultConfig.ts` — 14 entries reusing the shared fault-column key
- `src/lib/dbSchema.ts` — 14 `DB_SCHEMAS` + 14 `DEVICE_TO_SCHEMA_TABLE` entries
- `src/lib/monitorOptions.ts` — 14 display names
- `src/lib/kabuColumnOrder.ts` — 14 table→column-order entries
- `src/app/reports/page.tsx` — 14 each in name array, table map, allowed-tables array
- `src/app/registration-form/page.tsx` — 14 `{value,label}` options
- `src/app/devices/page.tsx` — 14 display→short entries (+ stray blank line)
- `src/hooks/useAutoData.ts` — 14 each in two maps
- `src/utils/faultLogs.ts` — 14 OR-chain clauses
- `src/components/layout/activity-panel.tsx` — 14 device objects, location `Noida`
- `src/components/AerationwithHeating.tsx` — 14 OR-chain clauses
- `src/components/AutoDiagram1.tsx` — 14 each in three arrays
- `src/app/menu/aerations/[aerations]/page.tsx` — 14 OR-chain clauses
- `src/app/menu/auto/[auto]/page.tsx` — 14 full config objects + 14 device-list names
- `src/app/menu/auto-grain/[auto-grain]/page.tsx` — 14 `_GRAIN` config objects
- `src/app/menu/auto-paddy/[auto-paddy]/page.tsx` — 14 `_PADDY` config objects
- `src/app/menu/inputs/analog/[seaction]/page.tsx` — 14 each in config map + three OR-chains
- `src/app/menu/outputs/[outputs]/page.tsx` — 14 each in two OR-chains
- `src/app/api/getAllDataSmart200/route.ts` — 14 table-name strings
- `alarm_handler.py` — 14 table-name strings

Backend (`grain_backend`, commit `e13cf0b "newmachines"`):
- `handlers/machine.go` — 14 table→short-name entries
- `handlers/export.go` — 14 short-name→timezone entries
- `handlers/export_excel.go` — 14 short-name→bool entries

Full diffs: `git -C new_plc_software diff --cached` and `git -C grain_backend show HEAD`.

</details>
