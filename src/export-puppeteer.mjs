// Capture → Puppeteer script exporter.
//
// Sibling to src/export-playwright.mjs (round-1 PR #6). Reads the same
// JSONL capture file (`schema: selector-capture-entry`, version 3) and
// emits a ready-to-run Puppeteer script. Each capture entry becomes one
// `await page.click(...)` (or `.type(...)` for editable inputs); entries
// sharing a page URL group under a single `await page.goto(...)` so the
// emitted script mirrors the browsing session.
//
// Selector preference, per entry, matches the Playwright exporter and
// the replay chain in src/replay.mjs: data-testid > id > primary CSS >
// ARIA role+name. Puppeteer has no native `getByRole` so role+name
// degrades to an `::-p-aria(...)` selector (page.click('::-p-aria(...)')),
// which Puppeteer ≥ 21 honours; the fallback still picks a selector the
// replayer can resolve. Editable inputs use `page.type(selector, value)`
// instead of `page.click(selector)`.
//
// Output is deterministic: identical input always produces byte-identical
// output (no timestamps, no env-dependent paths). The emitted file is
// plain JavaScript that `node --check` parses without error and that
// `puppeteer.launch()` can drive directly.
//
// Programmatic API:
//   exportPuppeteer(entries, { scriptName }) → string
//   parseCaptureJsonl(raw)                   → entries (re-exported)
//   buildPuppeteerCall(entry)                → { selector, action, isAria }
//
// CLI:
//   node src/export-puppeteer.mjs <capture.jsonl> [outdir]
//     Writes <outdir>/<script-name>.puppeteer.js and prints path + count.

import { mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { argv, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

export const parseCaptureJsonl = (raw) => {
  const out = [];
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (err) {
      throw new Error(`line ${i + 1}: invalid JSON — ${err.message}`);
    }
    if (entry?.schema !== "selector-capture-entry") {
      throw new Error(
        `line ${i + 1}: not a selector-capture-entry (schema=${entry?.schema ?? "missing"})`,
      );
    }
    out.push(entry);
  }
  return out;
};

const escapeForSingleQuotedString = (value) =>
  String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const looksFillable = (entry) => {
  const el = entry?.element ?? {};
  if (el.isEditable === true) return true;
  if (el.tag === "input" || el.tag === "textarea") {
    const t = (el.type ?? "").toLowerCase();
    return t !== "button" && t !== "submit" && t !== "checkbox" && t !== "radio" && t !== "file";
  }
  return false;
};

export const buildPuppeteerCall = (entry) => {
  const sel = entry?.selectors ?? {};
  const el = entry?.element ?? {};
  const testId = el.testId ?? sel.dataIds ?? null;
  const id = el.id ?? sel.id ?? null;
  const css = sel.css ?? sel.compact ?? null;
  const role = el?.accessibility?.computed?.computedRole ?? el.role ?? null;
  const accessibleName = el.accessibleName ?? el?.accessibility?.computed?.explicitName ?? null;

  let selector;
  let isAria = false;
  if (testId) {
    selector = `[data-testid="${escapeForSingleQuotedString(testId).replace(/"/g, '\\"')}"]`;
  } else if (id) {
    selector = `#${escapeForSingleQuotedString(id)}`;
  } else if (css) {
    selector = escapeForSingleQuotedString(css);
  } else if (role) {
    isAria = true;
    selector = accessibleName
      ? `::-p-aria(${escapeForSingleQuotedString(accessibleName)}[role="${escapeForSingleQuotedString(role).replace(/"/g, '\\"')}"])`
      : `::-p-aria([role="${escapeForSingleQuotedString(role).replace(/"/g, '\\"')}"])`;
  } else {
    throw new Error(
      `entry sequence=${entry?.sequence ?? "?"}: no usable selector (testId/id/css/role all empty)`,
    );
  }

  let action;
  if (looksFillable(entry)) {
    const value = el.value ?? el.placeholder ?? "";
    action = `await page.type('${selector}', '${escapeForSingleQuotedString(value)}');`;
  } else {
    action = `await page.click('${selector}');`;
  }

  return { selector, action, isAria };
};

const groupByUrl = (entries) => {
  const groups = [];
  let current = null;
  for (const entry of entries) {
    const url = entry?.page?.url ?? "about:blank";
    if (!current || current.url !== url) {
      current = { url, entries: [] };
      groups.push(current);
    }
    current.entries.push(entry);
  }
  return groups;
};

const slugify = (raw) =>
  String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "captures";

export const exportPuppeteer = (entries, opts = {}) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("exportPuppeteer: entries must be a non-empty array");
  }
  const scriptName = opts.scriptName ?? "captures";
  const groups = groupByUrl(entries);
  const lines = [];
  lines.push(
    "// Generated by pinchgrab export — do not edit by hand.",
    "// Regenerate with: node src/export-puppeteer.mjs <capture.jsonl>",
    "",
    `const puppeteer = require('puppeteer');`,
    "",
    `async function run() {`,
    `  const browser = await puppeteer.launch({ headless: 'new' });`,
    `  const page = await browser.newPage();`,
    "",
  );
  for (let g = 0; g < groups.length; g += 1) {
    const group = groups[g];
    const title = `${scriptName} ${g + 1}: ${group.url}`;
    lines.push(`  // ${escapeForSingleQuotedString(title)}`);
    lines.push(`  await page.goto('${escapeForSingleQuotedString(group.url)}');`);
    for (const entry of group.entries) {
      const call = buildPuppeteerCall(entry);
      lines.push(`  ${call.action}`);
    }
    lines.push("");
  }
  lines.push(
    `  await browser.close();`,
    `}`,
    "",
    `run().catch((err) => { console.error(err); process.exit(1); });`,
    "",
  );
  return lines.join("\n");
};

const usage = `pinchgrab export — emit Puppeteer scripts from JSONL captures

Usage:
  node src/export-puppeteer.mjs <capture.jsonl> [outdir]

Writes <outdir>/<script-name>.puppeteer.js (outdir defaults to the
current directory; script-name derives from the capture file's basename).
Each capture entry becomes one page.click()/page.type() call.
`;

const cli = async () => {
  const [, , file, outdir = "."] = argv;
  if (!file || file === "-h" || file === "--help") {
    stdout.write(usage);
    exit(file ? 0 : 2);
  }
  const raw = readFileSync(resolve(file), "utf-8");
  const entries = parseCaptureJsonl(raw);
  const scriptName = slugify(basename(file, extname(file)));
  const code = exportPuppeteer(entries, { scriptName });
  mkdirSync(resolve(outdir), { recursive: true });
  const outPath = resolve(outdir, `${scriptName}.puppeteer.js`);
  writeFileSync(outPath, code, "utf-8");
  const clickLines = code.split("\n").filter((l) => /await page\.(click|type|goto)\(/.test(l));
  stdout.write(`${outPath}\n`);
  stdout.write(`${clickLines.length} action(s) for ${entries.length} capture entr${entries.length === 1 ? "y" : "ies"}\n`);
};

// Compare realpaths, not raw argv[1] — see bin/pinchgrab for why a raw
// URL comparison silently breaks when this file is reached via a symlink.
const isDirectRun = (() => {
  try {
    return fileURLToPath(import.meta.url) === realpathSync(argv[1]);
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  cli().catch((err) => {
    stderr.write(`${err?.stack || String(err)}\n`);
    exit(1);
  });
}
