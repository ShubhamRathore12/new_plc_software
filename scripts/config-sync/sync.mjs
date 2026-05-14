#!/usr/bin/env node
/*
 * config-sync — additive sync of named exports between TS/JS files.
 *
 * Generic. Drop this folder into any project, edit config.json, run.
 *
 * Behavior: for each sync entry, finds keys present in source's exported
 * object literal but missing in target's, and appends them to target.
 * Never overwrites existing target keys, never deletes. Also copies any
 * top-level constants the new entries reference (so target compiles).
 *
 *   node scripts/config-sync/sync.mjs                 # apply changes
 *   node scripts/config-sync/sync.mjs --dry-run       # preview only
 *   node scripts/config-sync/sync.mjs --config <path> # custom config
 *
 * Config schema (see config.json):
 *   {
 *     "syncs": [
 *       { "name": "...", "source": "...", "target": "...",
 *         "export": "MACHINE_CONFIG", "mode": "additive" }
 *     ]
 *   }
 *
 * Source/target paths are resolved relative to the config file.
 */

import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const out = { config: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") out.config = argv[++i];
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`unknown arg: ${a}`);
      process.exit(2);
    }
  }
  return out;
}

function printHelp() {
  console.log(`config-sync — additive sync of TS/JS named exports.

Usage:
  node scripts/config-sync/sync.mjs [--config <path>] [--dry-run]

Default config: ./scripts/config-sync/config.json (relative to cwd).
`);
}

function loadConfig(configArg) {
  const resolved = configArg
    ? path.resolve(process.cwd(), configArg)
    : path.join(__dirname, "config.json");
  if (!fs.existsSync(resolved)) {
    throw new Error(`config file not found: ${resolved}`);
  }
  const raw = fs.readFileSync(resolved, "utf8");
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    throw new Error(`config file is not valid JSON (${resolved}): ${e.message}`);
  }
  return { configPath: resolved, config: json };
}

function readSource(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
  );
  return { text, sourceFile };
}

function isExported(stmt) {
  return stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

function findExport(sourceFile, name) {
  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    if (!isExported(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === name) {
        return { statement: stmt, decl, init: decl.initializer ?? null };
      }
    }
  }
  return null;
}

function getObjectLiteralEntries(objLit) {
  const entries = [];
  for (const prop of objLit.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    let key = null;
    if (ts.isStringLiteral(prop.name) || ts.isNoSubstitutionTemplateLiteral(prop.name)) {
      key = prop.name.text;
    } else if (ts.isIdentifier(prop.name)) {
      key = prop.name.text;
    } else if (ts.isNumericLiteral(prop.name)) {
      key = prop.name.text;
    }
    if (key !== null) entries.push({ key, prop });
  }
  return entries;
}

function collectIdentifierRefs(node) {
  const refs = new Set();
  function visit(n) {
    if (ts.isIdentifier(n)) {
      const p = n.parent;
      // skip property names in property assignments / shorthand
      if ((ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) && p.name === n) {
        // but a shorthand property's name *is* a reference — keep it
        if (!ts.isShorthandPropertyAssignment(p)) {
          ts.forEachChild(n, visit);
          return;
        }
      }
      // skip the "b" in "a.b"
      if (ts.isPropertyAccessExpression(p) && p.name === n) {
        return;
      }
      // skip type references inside type annotations — values only
      // (object literal values shouldn't contain type refs anyway)
      refs.add(n.text);
    }
    ts.forEachChild(n, visit);
  }
  visit(node);
  return refs;
}

function getDeclaredAndImportedIdentifiers(sourceFile) {
  const ids = new Set();
  for (const stmt of sourceFile.statements) {
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) ids.add(decl.name.text);
      }
    } else if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      ids.add(stmt.name.text);
    } else if (ts.isClassDeclaration(stmt) && stmt.name) {
      ids.add(stmt.name.text);
    } else if (ts.isEnumDeclaration(stmt) && stmt.name) {
      ids.add(stmt.name.text);
    } else if (ts.isImportDeclaration(stmt) && stmt.importClause) {
      const ic = stmt.importClause;
      if (ic.name) ids.add(ic.name.text);
      if (ic.namedBindings) {
        if (ts.isNamedImports(ic.namedBindings)) {
          for (const e of ic.namedBindings.elements) ids.add(e.name.text);
        } else if (ts.isNamespaceImport(ic.namedBindings)) {
          ids.add(ic.namedBindings.name.text);
        }
      }
    }
  }
  return ids;
}

function findTopLevelVarStatement(sourceFile, name) {
  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === name) {
        return stmt;
      }
    }
  }
  return null;
}

// well-known identifiers that don't need to be copied (built-ins, globals)
const BUILTIN_IDENTIFIERS = new Set([
  "Object", "Array", "Map", "Set", "Date", "Math", "JSON", "Number", "String",
  "Boolean", "RegExp", "Error", "Promise", "Symbol", "BigInt", "console",
  "undefined", "NaN", "Infinity", "globalThis", "process", "window", "document",
  "true", "false", "null",
  "Record", "Partial", "Required", "Readonly", "Pick", "Omit", "Exclude", "Extract",
]);

function nodeText(text, node) {
  return text.slice(node.getStart(), node.getEnd());
}

function syncOne(syncDef, ctx) {
  const sourcePath = path.resolve(ctx.configDir, syncDef.source);
  const targetPath = path.resolve(ctx.configDir, syncDef.target);
  const exportName = syncDef.export;
  const mode = syncDef.mode || "additive";
  // Default: case-insensitive key matching. Source/target often disagree on
  // casing for the same logical entity (e.g. "GTPL-148-GT-..." vs "...-gT-...").
  // A naive case-sensitive sync would create duplicates. Set caseSensitive: true
  // to opt out.
  const caseSensitive = syncDef.caseSensitive === true;

  if (mode !== "additive") {
    throw new Error(`unsupported mode: ${mode} (only "additive" is supported)`);
  }

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`source file not found: ${sourcePath}`);
  }
  if (!fs.existsSync(targetPath)) {
    throw new Error(`target file not found: ${targetPath}`);
  }

  const src = readSource(sourcePath);
  const tgt = readSource(targetPath);

  const srcExp = findExport(src.sourceFile, exportName);
  if (!srcExp) throw new Error(`export "${exportName}" not found in source: ${sourcePath}`);
  if (!srcExp.init || !ts.isObjectLiteralExpression(srcExp.init)) {
    throw new Error(`source export "${exportName}" is not an object literal`);
  }

  const tgtExp = findExport(tgt.sourceFile, exportName);
  if (!tgtExp) throw new Error(`export "${exportName}" not found in target: ${targetPath}`);
  if (!tgtExp.init || !ts.isObjectLiteralExpression(tgtExp.init)) {
    throw new Error(`target export "${exportName}" is not an object literal`);
  }

  const srcEntries = getObjectLiteralEntries(srcExp.init);
  const tgtEntries = getObjectLiteralEntries(tgtExp.init);

  const norm = (k) => (caseSensitive ? k : k.toLowerCase());
  // Map normalized key -> original target key, for case-mismatch detection.
  const tgtKeyByNorm = new Map(tgtEntries.map((e) => [norm(e.key), e.key]));

  const newEntries = [];
  const caseMismatches = [];
  for (const e of srcEntries) {
    const tgtKey = tgtKeyByNorm.get(norm(e.key));
    if (tgtKey === undefined) {
      newEntries.push(e);
    } else if (tgtKey !== e.key) {
      caseMismatches.push({ sourceKey: e.key, targetKey: tgtKey });
    }
    // exact match → already in sync, no action.
  }

  if (newEntries.length === 0) {
    return {
      name: syncDef.name || exportName,
      sourcePath,
      targetPath,
      addedKeys: [],
      addedConsts: [],
      unresolvedRefs: [],
      caseMismatches,
      changed: false,
    };
  }

  const tgtDeclared = getDeclaredAndImportedIdentifiers(tgt.sourceFile);
  const missingRefs = new Set();
  for (const entry of newEntries) {
    const refs = collectIdentifierRefs(entry.prop);
    for (const r of refs) {
      if (BUILTIN_IDENTIFIERS.has(r)) continue;
      if (tgtDeclared.has(r)) continue;
      missingRefs.add(r);
    }
  }

  const constsToCopy = [];
  const unresolvedRefs = [];
  for (const ref of missingRefs) {
    const stmt = findTopLevelVarStatement(src.sourceFile, ref);
    if (stmt) constsToCopy.push({ name: ref, statement: stmt });
    else unresolvedRefs.push(ref);
  }

  let newText = tgt.text;

  // 1. Inject missing const declarations directly above the target export.
  if (constsToCopy.length > 0) {
    const insertAt = tgtExp.statement.getStart();
    const block = constsToCopy
      .map((c) => `// [config-sync] copied from source\n${nodeText(src.text, c.statement)}`)
      .join("\n\n");
    newText = `${newText.slice(0, insertAt)}${block}\n\n${newText.slice(insertAt)}`;
  }

  // 2. Re-parse to get fresh positions, then insert new entries before "}".
  const tgt2 = ts.createSourceFile(targetPath, newText, ts.ScriptTarget.Latest, true);
  const tgt2Exp = findExport(tgt2, exportName);
  if (!tgt2Exp || !tgt2Exp.init || !ts.isObjectLiteralExpression(tgt2Exp.init)) {
    throw new Error(`internal: lost target export after re-parse`);
  }
  const objStart = tgt2Exp.init.getStart();
  const objEnd = tgt2Exp.init.getEnd();
  const closeBracePos = objEnd - 1; // position of "}"

  // Inspect content between "{" and "}" to decide if a comma is needed.
  const inner = newText.slice(objStart + 1, closeBracePos);
  const innerTrimmed = inner.replace(/\s+$/u, "");
  const lastNonWS = innerTrimmed.length === 0 ? "" : innerTrimmed[innerTrimmed.length - 1];
  // If the object is non-empty and the last meaningful char isn't a comma, add one.
  const needsLeadingComma = innerTrimmed.length > 0 && lastNonWS !== ",";

  let entriesText = "";
  for (const entry of newEntries) {
    const propText = nodeText(src.text, entry.prop);
    entriesText += `\n  ${propText},`;
  }
  entriesText += "\n";

  newText =
    newText.slice(0, closeBracePos) +
    (needsLeadingComma ? "," : "") +
    entriesText +
    newText.slice(closeBracePos);

  if (!ctx.dryRun) {
    fs.writeFileSync(targetPath, newText, "utf8");
  }

  return {
    name: syncDef.name || exportName,
    sourcePath,
    targetPath,
    addedKeys: newEntries.map((e) => e.key),
    addedConsts: constsToCopy.map((c) => c.name),
    unresolvedRefs,
    caseMismatches,
    changed: true,
  };
}

function relPath(p) {
  const rel = path.relative(process.cwd(), p);
  return rel || p;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let info;
  try {
    info = loadConfig(args.config);
  } catch (e) {
    console.error(`error: ${e.message}`);
    process.exit(1);
  }
  const { configPath, config } = info;

  if (!Array.isArray(config.syncs)) {
    console.error(`error: config.syncs must be an array`);
    process.exit(1);
  }

  const ctx = {
    configDir: path.dirname(configPath),
    dryRun: args.dryRun,
  };

  console.log(`config-sync${args.dryRun ? " [dry run]" : ""}`);
  console.log(`config: ${relPath(configPath)}`);
  console.log("");

  let totalAdded = 0;
  let totalConsts = 0;
  let hadChanges = false;

  for (const def of config.syncs) {
    const label = def.name || def.export || "(unnamed)";
    console.log(`[${label}]`);
    let r;
    try {
      r = syncOne(def, ctx);
    } catch (e) {
      console.error(`  error: ${e.message}`);
      process.exit(1);
    }
    console.log(`  source: ${relPath(r.sourcePath)}`);
    console.log(`  target: ${relPath(r.targetPath)}`);
    if (r.caseMismatches && r.caseMismatches.length > 0) {
      console.log(`  ! case mismatch — same key, different casing (NOT added):`);
      for (const m of r.caseMismatches) {
        console.log(`      source: ${m.sourceKey}`);
        console.log(`      target: ${m.targetKey}`);
      }
      console.log(`    (decide which casing wins, then update by hand)`);
    }
    if (!r.changed) {
      console.log(`  in sync (no new keys)`);
    } else {
      hadChanges = true;
      console.log(`  + ${r.addedKeys.length} new key(s):`);
      for (const k of r.addedKeys) console.log(`      ${k}`);
      if (r.addedConsts.length > 0) {
        console.log(`  + ${r.addedConsts.length} supporting const(s):`);
        for (const c of r.addedConsts) console.log(`      ${c}`);
      }
      if (r.unresolvedRefs.length > 0) {
        console.log(
          `  ! unresolved references — verify manually: ${r.unresolvedRefs.join(", ")}`,
        );
      }
      totalAdded += r.addedKeys.length;
      totalConsts += r.addedConsts.length;
    }
    console.log("");
  }

  const verb = args.dryRun ? "would add" : "added";
  if (!hadChanges) {
    console.log("nothing to sync.");
  } else {
    console.log(`${verb} ${totalAdded} key(s) and ${totalConsts} const(s).`);
    if (args.dryRun) {
      console.log("re-run without --dry-run to write changes.");
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
