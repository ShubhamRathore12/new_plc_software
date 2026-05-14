# config-sync

Generic, additive sync of named exports between TypeScript / JavaScript files.

Drop this folder into any project, edit `config.json`, run.

## What it does

For each entry in `config.json`, the tool:

1. Parses both source and target files (via the TypeScript compiler API — no regex hacks).
2. Locates the named `export const X = { ... }` in each.
3. Finds keys present in source but missing in target.
4. Appends those keys to target. Never overwrites existing keys, never deletes.
5. If the new entries reference any top-level constants that don't exist in target (e.g. `tags: GTPL_999_TAGS`), copies those constants over too — so the target still compiles.

## Run

```bash
# from project root
node scripts/config-sync/sync.mjs --dry-run     # preview only
node scripts/config-sync/sync.mjs               # apply changes
node scripts/config-sync/sync.mjs --config <path/to/config.json>
```

Or via the npm script:

```bash
npm run sync:devices -- --dry-run
npm run sync:devices
```

## Configure

`config.json` lives next to `sync.mjs`. Paths are resolved relative to the config file.

```json
{
  "syncs": [
    {
      "name": "human-readable label",
      "source": "../../src/lib/machineConfig.ts",
      "target": "../../../other-project/constants/machine-config.ts",
      "export": "MACHINE_CONFIG",
      "mode": "additive",
      "caseSensitive": false
    }
  ]
}
```

Per-entry options:

| Field | Default | Meaning |
|---|---|---|
| `name` | `export` value | Human-readable label for log output. |
| `source` | required | Path to source TS/JS file (relative to config). |
| `target` | required | Path to target TS/JS file (relative to config). |
| `export` | required | Name of the exported `const` to sync. Must be an object literal. |
| `mode` | `"additive"` | Only `"additive"` is supported (never overwrites/deletes). |
| `caseSensitive` | `false` | If `false`, treats `"FOO"` and `"foo"` as the same key. Mismatches are reported (not auto-corrected). Set `true` for projects where casing carries meaning. |

To sync multiple exports (e.g. add `MACHINE_NAME_ALIASES` later), add more entries to the `syncs` array.

## Case-mismatch handling

Real-world projects often disagree on casing for the same logical key — e.g. dashboard has `GTPL-148-gT-450T-S7-1200` while mobile has `GTPL-148-GT-450T-S7-1200`. With `caseSensitive: false` (default), the tool:

- Treats these as the same key → does **not** add a duplicate.
- Logs a `case mismatch` warning so you can decide which casing wins.
- Does **not** silently rewrite either side. Pick one, fix manually, and the warning will go away on the next run.

## What it does NOT do

- Does not overwrite or delete existing keys in the target. This is by design — both the dashboard and the mobile app may intentionally have different values for the same key (e.g. different `table` or `type`). Manual reconciliation is required if you want to change an existing entry.
- Does not handle nested re-keying or schema migration.
- Does not handle non-object exports (e.g. arrays, classes). Only `export const X = { ... }`.
- Does not push to git, open PRs, or trigger builds. That's the next phase (CI workflow).

## Design notes

- The tool uses the TypeScript compiler API to safely parse and locate AST nodes, then splices the *original* source text of each new property into the target file. This preserves comments inside individual properties and keeps formatting close to the source.
- Comments *between* properties (like `// S7-200`) live in trivia and aren't copied — they belong to the file's structure, not to any one entry.
- Built-in identifiers (`Object`, `Record`, `Map`, etc.) are skipped when scanning for missing references.
