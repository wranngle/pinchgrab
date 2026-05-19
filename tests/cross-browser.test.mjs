// Cross-browser replay matrix test.
//
// Mocks the playwright multi-browser runner — no real browser launches.
// Asserts: one attempt per browser, summary report contains one row per
// browser, error paths still produce a row (not a thrown exception).
//
// Run: `node --test tests/cross-browser.test.mjs`

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseCaptureJsonl,
  renderReport,
  runMatrix,
} from "../src/replay-multi.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(here, "fixtures/cross-browser-capture.jsonl");
const entries = parseCaptureJsonl(readFileSync(fixturePath, "utf-8"));

const mockRunner = ({ cssHits = new Set(), failOn = new Set() } = {}) => {
  const launches = [];
  return {
    launches,
    async launch(name) {
      launches.push(name);
      if (failOn.has(name)) throw new Error(`engine "${name}" unavailable`);
      return {
        async newPage() {
          return {
            async goto() {},
            locate(selector) {
              return { count: async () => (cssHits.has(selector) ? 1 : 0) };
            },
          };
        },
        async close() {},
      };
    },
  };
};

test("runMatrix attempts one launch per browser", async () => {
  const runner = mockRunner({
    cssHits: new Set(["button.primary", "input#email", "a.docs"]),
  });
  const matrix = await runMatrix(entries, {
    browsers: ["chromium", "firefox", "webkit"],
    runner,
    url: "https://example.test",
  });
  assert.deepEqual(runner.launches, ["chromium", "firefox", "webkit"]);
  assert.equal(matrix.browsers.length, 3);
  for (const row of matrix.browsers) {
    assert.equal(row.attempted, true);
    assert.equal(row.found, 3);
    assert.equal(row.total, 3);
    assert.equal(row.error, null);
  }
  assert.deepEqual(matrix.summary, { passed: 3, failed: 0, total: 3 });
});

test("summary report contains one row per browser", async () => {
  const runner = mockRunner({
    cssHits: new Set(["button.primary", "input#email", "a.docs"]),
  });
  const matrix = await runMatrix(entries, {
    browsers: ["chromium", "firefox", "webkit"],
    runner,
    url: "https://example.test",
  });
  const report = renderReport(matrix);
  for (const name of ["chromium", "firefox", "webkit"]) {
    const rowRegex = new RegExp(`^\\| ${name} \\| `, "m");
    assert.match(report, rowRegex, `report missing row for ${name}`);
  }
  const dataRowCount = report
    .split("\n")
    .filter((l) => /^\| (chromium|firefox|webkit) \| /.test(l)).length;
  assert.equal(dataRowCount, 3, "report must have exactly 3 data rows");
});

test("failed engine appears as a fail row, not an exception", async () => {
  const runner = mockRunner({
    cssHits: new Set(["button.primary", "input#email", "a.docs"]),
    failOn: new Set(["webkit"]),
  });
  const matrix = await runMatrix(entries, {
    browsers: ["chromium", "firefox", "webkit"],
    runner,
    url: "https://example.test",
  });
  assert.equal(runner.launches.length, 3, "all 3 engines must be attempted");
  const webkit = matrix.browsers.find((r) => r.name === "webkit");
  assert.ok(webkit, "webkit row present");
  assert.equal(webkit.error?.includes("unavailable"), true);
  assert.equal(webkit.found, 0);
  assert.equal(matrix.summary.passed, 2);
  assert.equal(matrix.summary.failed, 1);

  const report = renderReport(matrix);
  assert.match(report, /\| webkit \| fail \|/);
});

test("partial selector miss reports found < total", async () => {
  const runner = mockRunner({
    cssHits: new Set(["button.primary", "a.docs"]),
  });
  const matrix = await runMatrix(entries, {
    browsers: ["chromium", "firefox"],
    runner,
  });
  for (const row of matrix.browsers) {
    assert.equal(row.found, 2);
    assert.equal(row.total, 3);
  }
  assert.equal(matrix.summary.passed, 0);
  assert.equal(matrix.summary.failed, 2);
});

test("runMatrix requires a runner", async () => {
  await assert.rejects(
    () => runMatrix(entries, { browsers: ["chromium"] }),
    /runner/,
  );
});

test("renderReport summary line cites engine counts", async () => {
  const runner = mockRunner({
    cssHits: new Set(["button.primary", "input#email", "a.docs"]),
  });
  const matrix = await runMatrix(entries, {
    browsers: ["chromium", "firefox", "webkit"],
    runner,
  });
  const report = renderReport(matrix);
  assert.match(report, /Engines: 3/);
  assert.match(report, /Passed: 3/);
  assert.match(report, /Failed: 0/);
});
