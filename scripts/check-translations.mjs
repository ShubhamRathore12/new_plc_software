#!/usr/bin/env node
/**
 * Fails the build when a locale is missing a key that the UI asks for, or when
 * a catalogue is not valid JSON.
 *
 * English showing raw keys (`devices`, `select_a_location`, …) was not a
 * translation gap — the English catalogue was invalid JSON, so every lookup
 * fell through. A parse check alone would have caught it.
 *
 * Usage: node scripts/check-translations.mjs
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const LOCALES_DIR = join(ROOT, "public", "locales");
const SRC_DIR = join(ROOT, "src");
/** Locales offered in the UI — must match SUPPORTED_LANGUAGES. */
const REQUIRED_LOCALES = ["en", "de", "th"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);
/**
 * Values that are legitimately identical to the English source: the product
 * name, instrument/tag abbreviations printed on the machine, and words that are
 * simply the same in the target language.
 */
const SAME_IN_EVERY_LOCALE = new Set([
  "Grain Technik",
  "HP",
  "LP",
  "RH",
  "T0",
  "TH",
  "Delta(A)",
  "Blower",
  "Internet",
  "Name",
  "Start",
  "Live",
  "live",
]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "__tests__") continue;
      walk(full, files);
    } else if (SOURCE_EXTENSIONS.has(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

/** Literal keys only: `t(variable)` cannot be checked statically. */
function collectKeys(files) {
  const keys = new Set();
  const pattern = /\bt\(\s*(["'`])((?:(?!\1)[^\\])*?)\1\s*\)/g;
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(pattern)) {
      keys.add(match[2]);
    }
  }
  return keys;
}

function loadCatalogue(locale) {
  const path = join(LOCALES_DIR, locale, "translation.json");
  if (!existsSync(path)) {
    return { path, error: "catalogue file does not exist", data: null };
  }
  try {
    return { path, error: null, data: JSON.parse(readFileSync(path, "utf8")) };
  } catch (error) {
    return { path, error: `invalid JSON — ${error.message}`, data: null };
  }
}

const usedKeys = collectKeys(walk(SRC_DIR));
const problems = [];

for (const locale of REQUIRED_LOCALES) {
  const { path, error, data } = loadCatalogue(locale);
  if (error) {
    problems.push(`${locale}: ${error} (${path})`);
    continue;
  }

  const missing = [...usedKeys].filter((key) => {
    const value = data[key];
    return value === undefined || value === null || String(value).trim() === "";
  });

  // A value identical to its key is an untranslated placeholder, not a
  // translation — except in English, where key and copy often coincide.
  const untranslated =
    locale === "en"
      ? []
      : Object.entries(data)
          .filter(
            ([key, value]) =>
              usedKeys.has(key) &&
              value === key &&
              !SAME_IN_EVERY_LOCALE.has(key)
          )
          .map(([key]) => key);

  if (missing.length) {
    problems.push(
      `${locale}: ${missing.length} missing key(s): ${missing.sort().join(", ")}`
    );
  }
  if (untranslated.length) {
    problems.push(
      `${locale}: ${untranslated.length} untranslated key(s): ${untranslated
        .sort()
        .join(", ")}`
    );
  }
}

if (problems.length) {
  console.error("Translation check failed:\n");
  for (const problem of problems) console.error(`  • ${problem}`);
  console.error(
    `\n${usedKeys.size} literal key(s) are referenced by the UI.\n`
  );
  process.exit(1);
}

console.log(
  `Translation check passed — ${usedKeys.size} keys across ${REQUIRED_LOCALES.join(", ")}.`
);
