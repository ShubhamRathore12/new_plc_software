# Scoped table-fetch bypass for GTPL-159..172 analog inputs

The analog inputs page rendered blank for GTPL-159 through GTPL-172 because `useAutoData` returns early — before calling `/api/table` — whenever a device's `machineStatus` flag from the status feed is falsy, and these 14 machines report off (idle/Manual mode) or are omitted from the feed entirely under per-user `monitorAccess` filtering. The fix adds a module-scoped `ALWAYS_FETCH_DEVICES` set of the 14 display names and changes the machine-off guard from `if (!isMachineRunning)` to `if (!isMachineRunning && !alwaysFetch)`, so those devices fall through to the existing `/api/table` fetch while every other machine keeps its machine-off blanking unchanged. The table row exists on the backend regardless of the streaming flag — the user's captured live response proves it — so once the fetch fires, `LP_value`, `HP_value`, the temps, `Static_pressure`, and `Condenser_fan_speed` all populate through the existing success path. The change touches only `src/hooks/useAutoData.ts` (plus the plan doc); the earlier fan-speed/static-pressure feature work is untouched.

Watch for: nothing blocking. (possible) A user without the `monitorAccess` grant for these tables will still see blanks, because `/api/table` enforces its own 403 — this is an operational/DB condition outside this repo's reach, correctly scoped out in the plan.

**Verdict**: APPROVED

## High-level view

The fix is a two-line behavioral change plus a 14-entry allowlist, confined to the one hook that gates the fetch. The design chose resilience in `useAutoData` over registering the machines in the status source, correctly, since the status source already enumerates them and the real cause is a runtime streaming/grant condition that no code registration can change.

Correctness holds: `/api/table` resolves against the Go backend directly (via the `api()` client and `API_BASE`), not a Next.js route, and returns the stored row independent of the status flag. For a scoped device the early-return is skipped, the fetch runs, and the real response flows into `data`, `telemetryState="live"`, and the analog page's `shared650T_withFanSpeed_config` input/output maps.

Regression safety is tight. The only code path that changed is reached solely when `autoType` is one of the 14 names in the set; for 154/155 and every other device `alwaysFetch` is false and the guard behaves exactly as before. The machine-off branch body is byte-for-byte unchanged.

The intended feature work from the prior commit survives: `shared650T_withFanSpeed_config`, the `is159to172` flag and `Static Pressure`/`Condenser fan speed` wiring in the analog page, and `is159to172Machine` fan-speed label + static-pressure badge in `AutoDiagram1.tsx` are all present at HEAD. This commit did not touch those files.

One residual gap is honest and out of scope: if the backend rejects the table request for lack of grant, the fetch 403s into the catch block and the device still shows blank. That is operational data, not a code defect.

<details>
<summary>Issues (2)</summary>

1. **monitorAccess still gates /api/table** (possible) — a user without the backend grant for GTPL-159..172 tables gets a 403 and still sees blanks; the fix cannot change that from this repo. Operational/DB condition, correctly scoped out. No code action.
2. **No automated test for the scoped-fetch behavior** (confirmed) — the repo has no test framework, so the guard change is covered only by typecheck + build + manual trace. Acceptable given the project, but the behavioral contract (scoped devices fetch when off; others blank) is unguarded against future edits.

</details>

<details>
<summary>Details</summary>

### The guard change and why it lands in the right place

`useAutoData` is the single choke point: the analog page reads every input and output cell from the one `data` object this hook returns, so gating the fetch here gates the whole page. The pre-fix guard treated "status flag falsy" as "do not fetch", which conflated two distinct states — a machine deliberately powered off (where keeping last readings and blanking is the intended F-16 behavior) and a machine whose row exists but whose streaming flag is false because it is idle or filtered out of the caller's status payload. The fix splits those two only for the 14 named devices:

```ts
const alwaysFetch = ALWAYS_FETCH_DEVICES.has(autoType);
...
if (!isMachineRunning && !alwaysFetch) {
  setIsConnected(false);
  setTelemetryState("machine-off");
  ...
  return;
}
```

Registering the machines in the status source (option a) was correctly rejected: the backend `machineStatusTables` map and this file's `autoTypeToTableMap`/`deviceNameToStatusKey` already enumerate all 14, so there is nothing to register — the false flag is a runtime streaming/grant condition, not a missing mapping.

### Data-flow trace confirms inputs populate

`/api/table` is not a Next.js route in this app (there is no `src/app/api/table/`). The `api()` client in `src/lib/apiClient.ts` prefixes any non-`http` path with `API_BASE` (`NEXT_PUBLIC_BACKEND_URL`, default `https://www.primeosys.com/backend`), so `api("/api/table?table=GTPL_159_GT_650T_S7_1200")` hits the Go backend directly and returns the stored row regardless of the streaming flag. That matches the user's captured response exactly. With the guard bypassed, the existing success branch runs:

```
autoType "GTPL-159-gT-650T-S7-1200"
  -> table = autoTypeToTableMap[...] = "GTPL_159_GT_650T_S7_1200"   (present)
  -> alwaysFetch = true -> early-return skipped
  -> GET /api/table?table=GTPL_159_GT_650T_S7_1200
  -> result.data -> setData([result.data]); telemetryState = "live"
  -> page reads data[0].LP_value / HP_value / T*_* / Static_pressure / Condenser_fan_speed
```

The mount effect calls `fetchRef.current()` unconditionally and then on a 10s interval, so the first fetch fires on mount even though `isThisMachineRunning` is false; no change to the effect's dependency array was needed, and none was made. First paint therefore populates once the response returns.

### Regression surface is limited to the 14 names

A non-scoped device such as `GTPL-124-gT-450T-S7-1200` has `alwaysFetch = false`, so `!isMachineRunning && !alwaysFetch` reduces to the original `!isMachineRunning` and the machine-off branch is taken unchanged — last readings held, `telemetryState="machine-off"`, no fetch. 154 and 155 map to `shared650T_config` and are absent from `ALWAYS_FETCH_DEVICES`, so they are unaffected. The guard body, the `if (!table)` check, the fetch, and the catch block are all untouched. The blast radius is exactly the set membership test.

### Failure mode when the grant is missing

The backend still authorizes `/api/table` per user. If GTPL-159..172 are absent from the caller's `monitorAccess` grant, the request returns 403, which `api()` turns into `ForbiddenError`; that is not a `SessionExpiredError`, so it falls into the catch block, sets `telemetryState="reconnecting"`, and the page stays blank. This is the one path where the fix does not restore data, and it is correctly identified in the plan as an operational/DB condition rather than a code defect. Worth stating plainly so no one chases it in code after deploy.

### Verification evidence

The recorded evidence (commit message `7b1b5ca` and `fix-plan.md`) states `npx tsc --noEmit` exited 0 and `npm run build` exited 0 ("Compiled successfully", route table includes `/menu/inputs/analog/[seaction]`). Per the task I did not re-run those suites. The diff is additive and type-trivial (a `Set<string>` literal and a boolean `&&` term), consistent with a clean typecheck, so no spot-check was warranted.

### Preservation of the prior feature work

Confirmed present at HEAD, untouched by this commit: `shared650T_withFanSpeed_config` with `"Static Pressure": "Static_pressure"` input and `"Condenser fan speed": "Condenser_fan_speed"` output, all 14 `shared650T_withFanSpeed_config` config-map entries, the `is159to172` flag and its `return true` output-filter branch in the analog page, and `is159to172Machine` driving the fan-speed % label and static-pressure badge in `AutoDiagram1.tsx`. The fix commit's stat shows only `useAutoData.ts` and the plan doc changed, so no accidental revert occurred.

</details>

<details>
<summary>File map</summary>

- `src/hooks/useAutoData.ts` — added `ALWAYS_FETCH_DEVICES` set (14 names) and the `&& !alwaysFetch` term on the machine-off guard; no other logic changed.
- `.agents/tasks/clone-gtpl154-159-172/fix-plan.md` — new planning/verification record (not product code).

Full diff: `git show 7b1b5ca`.

</details>
