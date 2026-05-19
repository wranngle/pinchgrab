// Export unit + integration test for src/export-playwright.mjs.
//
// Behaviour under test:
//   1. parseCaptureJsonl filters blanks, rejects non-schema lines.
//   2. buildLocatorCall prefers testId > id > css > role+name and
//      picks `.fill()` over `.click()` when the element is editable.
//   3. exportPlaywright groups consecutive entries by page.url so one
//      logical session emits one `test()` block per visited URL.
//   4. The emitted .spec.ts compiles cleanly under `tsc --noEmit`
//      against the `playwright/test` types shipped with the
//      playwright devDependency. This is the proof gate spelled out
//      in the feature spec — without it the exporter is just a
//      string concatenator.
//   5. Locator-call count equals capture entry count (one click per
//      entry, fills counted), so an n-line input always produces an
//      n-line script.
//
// Run: `node --test tests/export.test.mjs`.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildLocatorCall,
  exportPlaywright,
  parseCaptureJsonl,
} from "../src/export-playwright.mjs";

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

test("buildLocatorCall prefers data-testid then id then css then role", () => {
  const [withTestId, withId, withEditable, roleOnly] = parseCaptureJsonl(fixture);
  const a = buildLocatorCall(withTestId);
  assert.equal(a.method, "getByTestId");
  assert.equal(a.args, "'cta-upgrade'");
  assert.equal(a.action, ".click()");

  const b = buildLocatorCall(withId);
  assert.equal(b.method, "locator");
  assert.equal(b.args, "'#compose'");
  assert.equal(b.action, ".click()");

  const c = buildLocatorCall(withEditable);
  assert.equal(c.method, "locator");
  assert.equal(c.args, "'#email'");
  assert.equal(c.action, ".fill('hello@acme.test')");

  const d = buildLocatorCall(roleOnly);
  assert.equal(d.method, "getByRole");
  assert.equal(d.args, "'button', { name: 'Save' }");
  assert.equal(d.action, ".click()");
});

test("buildLocatorCall throws when no usable selector exists", () => {
  assert.throws(
    () =>
      buildLocatorCall({
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

test("exportPlaywright groups consecutive entries by page url", () => {
  const entries = parseCaptureJsonl(fixture);
  const code = exportPlaywright(entries, { specName: "demo" });
  const testBlocks = code.match(/^test\(/gm) ?? [];
  assert.equal(testBlocks.length, 2, "two URLs → two test blocks");
  assert.match(code, /await page\.goto\('https:\/\/acme\.test\/pricing'\);/);
  assert.match(code, /await page\.goto\('https:\/\/app\.acme\.test\/settings'\);/);
});

test("locator-call count equals capture-entry count", () => {
  const entries = parseCaptureJsonl(fixture);
  const code = exportPlaywright(entries, { specName: "demo" });
  const calls = code
    .split("\n")
    .filter((l) => /^\s+await page\.(locator|getByTestId|getByRole)\(/.test(l));
  assert.equal(
    calls.length,
    entries.length,
    `expected ${entries.length} locator calls, got ${calls.length}`,
  );
});

test("emitted .spec.ts compiles under tsc --noEmit", () => {
  const entries = parseCaptureJsonl(fixture);
  const code = exportPlaywright(entries, { specName: "demo" });
  const checkDir = resolve(repoRoot, "node_modules/.pinchgrab-export-check");
  const specPath = resolve(checkDir, "demo.spec.ts");
  const tsconfigPath = resolve(checkDir, "tsconfig.json");
  mkdirSync(checkDir, { recursive: true });
  writeFileSync(specPath, code, "utf-8");
  const tsconfig = {
    compilerOptions: {
      target: "es2022",
      module: "esnext",
      moduleResolution: "bundler",
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      esModuleInterop: true,
      types: [],
    },
    include: ["./demo.spec.ts"],
  };
  writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), "utf-8");
  assert.ok(
    existsSync(resolve(repoRoot, "node_modules/playwright/test.d.ts")),
    "playwright/test types must be installed (run npm install first)",
  );
  try {
    execFileSync("tsc", ["-p", tsconfigPath], {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf-8",
    });
  } catch (err) {
    const out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    assert.fail(`tsc --noEmit failed:\n${out}\n--- emitted source ---\n${code}`);
  }
});

test("output is deterministic for identical input", () => {
  const entries = parseCaptureJsonl(fixture);
  const a = exportPlaywright(entries, { specName: "demo" });
  const b = exportPlaywright(entries, { specName: "demo" });
  assert.equal(a, b);
});
