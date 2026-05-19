// Export unit + integration test for src/export-puppeteer.mjs.
//
// Sibling to tests/export.test.mjs (Playwright exporter). Same fixture,
// same selector-preference rules, same determinism contract. The proof
// gate is `node --check` against the emitted .puppeteer.js file plus
// presence of both `puppeteer.launch` and `await page.click` — without
// that the exporter is just string concatenation.
//
// Behaviour under test:
//   1. parseCaptureJsonl filters blanks, rejects non-schema lines.
//   2. buildPuppeteerCall prefers testId > id > css > ARIA role+name
//      and picks `page.type()` over `page.click()` when editable.
//   3. exportPuppeteer groups consecutive entries by page.url so one
//      logical session emits one `await page.goto(...)` per visited URL.
//   4. The emitted .puppeteer.js passes `node --check` (proof gate).
//   5. Emitted source contains `puppeteer.launch(` AND `await page.click(`
//      so the runnable contract is intact.
//   6. Action-call count equals capture entry count (one action per
//      entry, type-or-click).
//   7. Determinism: identical input → byte-identical output.
//
// Run: `node --test tests/export-puppeteer.test.mjs`.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildPuppeteerCall,
  exportPuppeteer,
  parseCaptureJsonl,
} from "../src/export-puppeteer.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const fixturePath = resolve(here, "fixtures/export-capture.jsonl");
const fixture = readFileSync(fixturePath, "utf-8");

test("parseCaptureJsonl skips blank lines and rejects non-schema rows", () => {
  const entries = parseCaptureJsonl(fixture);
  assert.equal(entries.length, 4);
  for (const entry of entries) {
    assert.equal(entry.schema, "selector-capture-entry");
    assert.equal(entry.version, 3);
  }
  assert.throws(
    () => parseCaptureJsonl(`${fixture}\n{"schema":"other"}\n`),
    /not a selector-capture-entry/,
  );
  assert.throws(() => parseCaptureJsonl("not json"), /invalid JSON/);
});

test("buildPuppeteerCall prefers data-testid then id then css then aria", () => {
  const [withTestId, withId, withEditable, roleOnly] = parseCaptureJsonl(fixture);

  const a = buildPuppeteerCall(withTestId);
  assert.equal(a.selector, '[data-testid="cta-upgrade"]');
  assert.equal(a.isAria, false);
  assert.match(a.action, /^await page\.click\('\[data-testid="cta-upgrade"\]'\);$/);

  const b = buildPuppeteerCall(withId);
  assert.equal(b.selector, "#compose");
  assert.equal(b.isAria, false);
  assert.match(b.action, /^await page\.click\('#compose'\);$/);

  const c = buildPuppeteerCall(withEditable);
  assert.equal(c.selector, "#email");
  assert.equal(c.isAria, false);
  assert.match(c.action, /^await page\.type\('#email', 'hello@acme\.test'\);$/);

  const d = buildPuppeteerCall(roleOnly);
  assert.equal(d.isAria, true);
  assert.match(d.selector, /::-p-aria\(Save\[role="button"\]\)/);
  assert.match(d.action, /^await page\.click\('::-p-aria\(Save\[role="button"\]\)'\);$/);
});

test("buildPuppeteerCall throws when no usable selector exists", () => {
  assert.throws(
    () =>
      buildPuppeteerCall({
        sequence: 99,
        selectors: { css: null, dataIds: null, id: null },
        element: {
          id: null,
          testId: null,
          accessibility: { computed: { computedRole: null, explicitName: null } },
        },
      }),
    /no usable selector/,
  );
});

test("exportPuppeteer groups consecutive entries by page url", () => {
  const entries = parseCaptureJsonl(fixture);
  const code = exportPuppeteer(entries, { scriptName: "demo" });
  const gotoCalls = code.match(/await page\.goto\(/g) ?? [];
  assert.equal(gotoCalls.length, 2, "two URLs → two goto calls");
  assert.match(code, /await page\.goto\('https:\/\/acme\.test\/pricing'\);/);
  assert.match(code, /await page\.goto\('https:\/\/app\.acme\.test\/settings'\);/);
});

test("emitted script contains puppeteer.launch and await page.click", () => {
  const entries = parseCaptureJsonl(fixture);
  const code = exportPuppeteer(entries, { scriptName: "demo" });
  assert.match(code, /puppeteer\.launch\(/, "must call puppeteer.launch");
  assert.match(code, /await page\.click\(/, "must emit at least one await page.click");
});

test("action-call count equals capture-entry count", () => {
  const entries = parseCaptureJsonl(fixture);
  const code = exportPuppeteer(entries, { scriptName: "demo" });
  const calls = code
    .split("\n")
    .filter((l) => /^\s*await page\.(click|type)\(/.test(l));
  assert.equal(
    calls.length,
    entries.length,
    `expected ${entries.length} action calls, got ${calls.length}`,
  );
});

test("emitted .puppeteer.js passes node --check", () => {
  const entries = parseCaptureJsonl(fixture);
  const code = exportPuppeteer(entries, { scriptName: "demo" });
  const checkDir = resolve(repoRoot, "node_modules/.pinchgrab-puppeteer-check");
  const scriptPath = resolve(checkDir, "demo.puppeteer.js");
  mkdirSync(checkDir, { recursive: true });
  writeFileSync(scriptPath, code, "utf-8");
  try {
    execFileSync(process.execPath, ["--check", scriptPath], {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf-8",
    });
  } catch (err) {
    const out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    assert.fail(`node --check failed:\n${out}\n--- emitted source ---\n${code}`);
  }
});

test("output is deterministic for identical input", () => {
  const entries = parseCaptureJsonl(fixture);
  const a = exportPuppeteer(entries, { scriptName: "demo" });
  const b = exportPuppeteer(entries, { scriptName: "demo" });
  assert.equal(a, b);
});
