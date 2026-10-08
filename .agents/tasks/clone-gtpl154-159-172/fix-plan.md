# Fix Plan — Analog inputs blank for GTPL-159 … GTPL-172

## Root cause (one paragraph, grounded in code read)

The analog page `src/app/menu/inputs/analog/[seaction]/page.tsx` renders every input and output
cell from the single `data` object returned by `useAutoData(device)` (line ~489:
`const { data, isConnected, error, formatValue } = useAutoData(device || "")`; each cell reads
`data?.[liveKey]`). `useAutoData` (`src/hooks/useAutoData.ts`) gates its table fetch on the
machine's running flag: in `fetchData()` it looks up `deviceStatus = machinesRef.current.find(m => m.machineName === statusKey)` (where `statusKey = deviceNameToStatusKey["GTPL-159-…"] = "GTPL_159"`),
computes `isMachineRunning = deviceStatus?.machineStatus ?? false`, and if false it `return`s early
**before** calling `/api/table`, leaving `data = {}` so every input renders blank. That running flag
comes from `status.machines`, populated by `MachineStatusProvider` from
`GET /api/machine/status-public`, which proxies to the Go backend
(`grain_backend/handlers/machine.go → HandleMachineStatus`). I verified the backend's
`machineStatusTables` map already enumerates GTPL_159…172 (committed in `grain_backend@e13cf0b`),
and `useAutoData`'s `autoTypeToTableMap` / `deviceNameToStatusKey` already contain correct entries
for all 14 (committed in `new_plc_software@e635734`) — so this is **not** a missing-mapping or
missing-registration problem. The flag is false at runtime for two reasons that are **outside this
repo's reach**: (1) `getMachineSpecificResponse` sets `machineStatus = hasNewData`, and `hasNewData`
is only true when the row ID changed since the last 3s poll **or** the row timestamp is within the
last 30 minutes — a machine that is powered but idle / in Manual mode (exactly what the captured
GTPL-159 row shows: `Manual_mode:"True"`, every run flag false, a fixed `created_at`) reports
`machineStatus=false`; and (2) `filterMachineStatuses` drops any machine not covered by the signed-in
user's `monitorAccess` grant (per-user DB data), so 159…172 can be **absent** from `status.machines`
entirely → `deviceStatus` undefined → `isMachineRunning=false`. In both runtime situations the
`/api/table` endpoint still returns the stored row (the user captured it live with real
`LP_value`/`HP_value`/`T2_1_ambient_temp`/`Static_pressure` values), so the data exists; `useAutoData`
simply never asks for it. GTPL-154/155 "work" only because they happen to be actively streaming
and/or are in the caller's grant.

## Fix layer decision (with justification)

Two options were considered (the task frames them as (a) and (b)):

- **(a) Register 159…172 in the status source.** Rejected — not applicable. The status source is the
  remote Go backend's `machineStatusTables` map, and it **already** contains GTPL_159…172 (verified by
  reading `grain_backend/handlers/machine.go` lines ~41–100; the clone commit `e13cf0b` added them).
  There is no missing registration to add. The remaining causes (idle→`hasNewData=false`, or per-user
  `monitorAccess` filtering) are runtime/DB conditions, not code registration, and are not fixable
  from either repo in code.

- **(b) Make `useAutoData` resilient (CHOSEN).** The least-invasive fix that restores values for
  159…172 without regressing any other machine is to stop treating "not reported running" as "do not
  fetch" **for the 14 devices in scope only**. The task explicitly permits scoping the behavior change
  to GTPL-159…172. A *general* "always fetch" change was rejected because it would regress the intended
  machine-off blanking (the F-16 design that deliberately stops polling an off machine and keeps the
  last readings rather than showing fabricated zeros) for every other machine, including 154/155.

**Chosen design:** in `useAutoData.ts`, define a scoped set of the 14 device display-names
(`GTPL-159-gT-650T-S7-1200` … `GTPL-172-gT-650T-S7-1200`) — mirroring the existing
`GTPL_159_172_DEVICES` constant already used in the analog page — and in `fetchData()` bypass the
`isMachineRunning` early-return for those devices, so they always fetch `/api/table` (the table row
exists regardless of the streaming flag, as the user proved). Behavior for all machines NOT in the set
is byte-for-byte unchanged: the existing `isMachineRunning` gate and `machine-off` telemetry state are
preserved exactly. This is provably safe for 154/155 and every other machine because the only code path
that changes is reached solely when `autoType` is one of the 14 scoped names.

Also surface a sensible telemetry state for the scoped devices so the UI dot/stale logic stays coherent:
when a scoped device is fetched while its status entry is absent or reports off, let the normal
success/`live` path set the state from the actual fetch result (as it already does), rather than the
`machine-off` early-return.

## Constraints honored

- The intentional feature changes are NOT touched: `shared650T_withFanSpeed_config`, the `is159to172`
  flag, the `Static Pressure` input and `Condenser fan speed` output in
  `src/app/menu/inputs/analog/[seaction]/page.tsx`, and the `is159to172Machine` fan-speed/static-pressure
  rendering in `src/components/AutoDiagram1.tsx` all remain as-is. This plan changes only `useAutoData.ts`.
- The behavior change is scoped to GTPL-159…172. No other machine's fetch/blanking behavior changes.
- All paths below are absolute; step agents run with cwd `/Users/shubham/Desktop/project/new_plc_software`.

## Build / test commands (discovered during exploration)

- Typecheck gate (authoritative, fast): `npx tsc --noEmit` — must exit 0. Confirmed passing on the
  current tree before any edit (baseline exit 0).
- Full build: `npm run build` (runs `node scripts/check-translations.mjs && next build`). Heavier; run
  once at the end.
- No unit-test framework is configured in `package.json` (scripts are `dev`/`build`/`start`/`lint`/
  `sync:devices`/`check:i18n`), so verification is the typecheck + build + a manual data-flow reasoning
  check described per item. No tests to add.

---

# Implementation Plan

> IMPLEMENTED on this iteration. Verification results (both gates passed, cwd
> `/Users/shubham/Desktop/project/new_plc_software`):
> - `npx tsc --noEmit` → exit 0.
> - `npm run build` (`check-translations.mjs && next build`) → exit 0, "Compiled
>   successfully"; `/menu/inputs/analog/[seaction]` present in the route table.
> Only `src/hooks/useAutoData.ts` was changed (steps 1 & 2). Step 3 required no
> edit: the mount effect calls `fetchRef.current()` unconditionally, so the first
> fetch already fires for scoped devices regardless of `isThisMachineRunning`.

- [x] 1. Add a scoped constant of the 14 in-scope device display-names at module scope in
      `useAutoData.ts`, immediately after the `deviceNameToStatusKey` map definition (before
      `export const useAutoData`). Use the exact hyphen + lowercase-`gT` display names
      `"GTPL-159-gT-650T-S7-1200"` … `"GTPL-172-gT-650T-S7-1200"` (same strings already keyed in
      `autoTypeToTableMap` / `deviceNameToStatusKey` in this file and listed as `GTPL_159_172_DEVICES`
      in the analog page). Define it as a `Set<string>` named `ALWAYS_FETCH_DEVICES` with a one-line
      comment stating WHY: these 650T machines' table rows must render even when the status feed reports
      them off or omits them (idle/Manual mode or a per-user monitorAccess grant that excludes them),
      because the table endpoint still returns their stored row.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/hooks/useAutoData.ts
      Verify: `cd /Users/shubham/Desktop/project/new_plc_software && npx tsc --noEmit` exits 0.

- [x] 2. In `useAutoData.ts` `fetchData()`, change the machine-off early-return so it does NOT fire for
      the scoped devices. Concretely, compute `const alwaysFetch = ALWAYS_FETCH_DEVICES.has(autoType)`
      near the top of `fetchData` (after `const table = autoTypeToTableMap[autoType]`), and change the
      guard `if (!isMachineRunning) { … return }` to `if (!isMachineRunning && !alwaysFetch) { … return }`.
      Leave the body of the early-return block (sets `machine-off`, keeps last readings) exactly as-is —
      it still runs for every non-scoped machine. Do not alter the `if (!table)` check, the fetch, or the
      catch block. This makes the 14 devices fall through to the existing `/api/table` fetch, which sets
      `data`, `isConnected`, and `telemetryState = "live"` from the real response — so inputs
      (`LP_value`, `HP_value`, `T*_*`, `Static_pressure`) and outputs (`Condenser_fan_speed`, etc.) all
      populate. Rationale: the table row exists independent of the streaming flag (user-captured live
      response confirms it), and the change is unreachable for any device not in the scoped set.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/hooks/useAutoData.ts
      Verify: `npx tsc --noEmit` exits 0.

- [x] 3. In `useAutoData.ts`, make the re-fetch trigger consistent with step 2 so the poll for a scoped
      device is not suppressed when its status flag is false. The effect dependency currently keys on
      `isThisMachineRunning` (derived from `status.machines`), and `isThisMachineRunning` is computed with
      the same `?? false` fallback as the gate. The interval/`fetchRef` already re-runs `fetchData` every
      10s regardless, and `fetchData` now fetches for scoped devices, so no extra polling wiring is
      required — but confirm by inspection that for a scoped device the FIRST `fetchRef.current()` call in
      the mount effect (lines ~ the `useEffect([autoType, isThisMachineRunning])`) actually performs the
      fetch (it will, because `fetchData` no longer returns early for scoped devices). If and only if the
      first paint still shows blank because `isThisMachineRunning` is false and the effect has not yet
      re-run, OR the lint/type gate flags `ALWAYS_FETCH_DEVICES` as unused in the running-flag derivation,
      extend the `isThisMachineRunning` expression to `|| ALWAYS_FETCH_DEVICES.has(autoType)` so the
      initial state is coherent. Prefer NOT adding this if the fetch already fires on mount; keep the diff
      minimal. Document whichever choice is made in a one-line comment.
      Files: /Users/shubham/Desktop/project/new_plc_software/src/hooks/useAutoData.ts
      Verify: `npx tsc --noEmit` exits 0.

- [x] 4. Data-flow correctness check (reasoning, no new tooling). Trace in the edited `useAutoData.ts`
      that for `autoType === "GTPL-159-gT-650T-S7-1200"`: `table = "GTPL_159_GT_650T_S7_1200"` (present in
      `autoTypeToTableMap`), `alwaysFetch = true`, the early-return is skipped, `/api/table?table=…` is
      called, and on the user-provided response shape `{ data: { LP_value, HP_value, T2_1_ambient_temp,
      Static_pressure, Condenser_fan_speed, … } }` the hook sets `data = [result.data]` so
      `data[0]` carries every field the analog page's `shared650T_withFanSpeed_config.inputs` maps
      (`"Suction Pressure"→LP_value`, `"Discharge Pressure"→HP_value`, the T0/T1/T2 temps,
      `"Static Pressure"→Static_pressure`). Confirm a NON-scoped machine (e.g. `GTPL-124-gT-450T-S7-1200`)
      still hits the unchanged `if (!isMachineRunning) return` path (so machine-off blanking is preserved).
      Files: none (verification only)
      Verify: documented trace holds; `npx tsc --noEmit` exits 0.

- [x] 5. Final build. After the edits, run the full frontend build once.
      Files: none (verification only)
      Verify: `cd /Users/shubham/Desktop/project/new_plc_software && npx tsc --noEmit` exits 0, then
      `npm run build` completes without error ("Compiled successfully"). If `next build` cannot run in the
      step environment (e.g. network/font fetch or memory limits), state that explicitly and treat the
      passing `npx tsc --noEmit` as the authoritative gate, matching how the prior clone task recorded its
      verification.

## Notes / assumptions

- The user's remark that analog *outputs* appear while *inputs* are blank cannot be literally true under
  the current code, since both read the same `data` object — when `useAutoData` returns early, both are
  blank, and the outputs the user saw are the configured-default template values. The fix above restores
  BOTH from live data, which is the intended outcome either way. No input-specific config bug exists for
  159…172: `shared650T_withFanSpeed_config.inputs` maps every input description to a tag that is present
  in the captured table row (verified).
- If, after deploying this fix, 159…172 still show blank, the remaining cause is a per-user
  `monitorAccess` grant that excludes these tables at the backend (`filterMachineStatuses`) which also
  blocks `/api/table` itself via `resolveTable`/`authorizedTables`; that is operational DB data, not a
  code defect, and is out of scope for this repo change. This is noted so the implementer does not chase
  it in code.
