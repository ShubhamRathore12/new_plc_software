# Verification — Clone GTPL-154 config to GTPL-159 … GTPL-172

Iteration: first (no `review.json` present at start).

Scope implemented: 14 new machines (GTPL-159 … GTPL-172) cloned 1:1 from GTPL-154-gT-650T-S7-1200
across all 25 reference sites in the plan (frontend `src` + `alarm_handler.py` + 3 backend Go files).
No new tags/faults/schemas invented; reused `GPL_124_TAGS`, `shared650T_config`, `T_650`,
`GTPL_650T_cols`, `MACHINE_FAULT_COLUMNS["GTPL_068_GT_650T_S7_1200"]`. GTPL-154 / GTPL-155 untouched.
Location = `Noida` in `devices.ts` and `activity-panel.tsx` (14 each). No `location` key added in `machineConfig.ts`.

## Commands run and results

### Frontend TypeScript typecheck
`cd /Users/shubham/Desktop/project/new_plc_software && npx tsc --noEmit`
Result: exit 0 — no type errors.

### Frontend full build
`cd /Users/shubham/Desktop/project/new_plc_software && npm run build`
Result: exit 0 — "Compiled successfully", "Generating static pages (53/53)". No errors/warnings.

### Python alarm handler syntax
`python3 -m py_compile alarm_handler.py`
Result: exit 0 — no syntax error.

### Backend Go (SKIPPED — toolchain unavailable)
`go` and `gofmt` are NOT installed in this environment (`which go` / `which gofmt` → not found),
so `go build ./...` and `gofmt -l` could not be run. The 3 backend edits were verified structurally instead:
- `handlers/machine.go`: 14 new `"GTPL_1NN_GT_650T_S7_1200":<tab-aligned>"GTPL_1NN",` entries, byte-identical
  in shape/padding to the GTPL_154 line (tab + 9 spaces after `":"`), matching gofmt column alignment of the
  surrounding block; map braces balanced.
- `handlers/export.go`: 14 new `"GTPL_1NN": mustLoadLocation("Asia/Kolkata"),` entries, identical shape to GTPL_154.
- `handlers/export_excel.go`: 14 new `"GTPL_1NN": true,` entries appended after `"GTPL_155": true,` on continuation
  lines with the same two-tab indent; map literal balanced.

### Linter note (biome)
`npx biome check` on edited files reports pre-existing whole-file formatting diagnostics (indentation/quote style)
that also flag the untouched GTPL-148/154/155 lines — i.e. the files were not biome-formatted before this change.
The new lines match the existing GTPL-154 lines byte-for-byte in style, so no new deviation was introduced.
The authoritative gates (tsc + next build) both pass.

## Per-machine occurrence cross-check (sanity: each new machine == GTPL-154 footprint)

Frontend display name `GTPL-1NN-gT-650T-S7-1200` total occurrences in `src` + `alarm_handler.py`:
- GTPL-154 = 29, GTPL-155 = 29, and EACH of GTPL-159 … GTPL-172 = 29. (uniform)

Frontend table name `GTPL_1NN_GT_650T_S7_1200` total occurrences in `src` + `alarm_handler.py`:
- GTPL_154 = 10, and EACH of GTPL_159 … GTPL_172 = 10. (uniform)

Backend:
- `machine.go`: all 14 `GTPL_1NN_GT_650T_S7_1200 -> GTPL_1NN` entries present (1 each), alignment preserved.
- `export.go`: all 14 `"GTPL_1NN": mustLoadLocation("Asia/Kolkata")` present (1 each).
- `export_excel.go`: all 14 `"GTPL_1NN": true` present (1 each).

Location check:
- `devices.ts`: 14 new-machine objects each `location: "Noida"`.
- `activity-panel.tsx`: 14 new-machine objects each `location: "Noida"`.

Per-file frontend 154-vs-1NN parity confirmed for all edited files (menu auto/grain/paddy serialNumbers
`GTPL_1NN`, `GTPL_1NN_GRAIN`, `GTPL_1NN_PADDY` all present; the four analog OR-chains/config map each got 14;
AutoDiagram1 all three arrays; reports all three sites; useAutoData both maps; dbSchema both maps + comment untouched).

GTPL-154 / GTPL-155 entries unchanged (counts match pre-change baseline).
