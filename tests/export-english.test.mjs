// Plain-English recipe exporter tests.
//
// Drives src/export-english.mjs against tests/fixtures/export-capture.jsonl
// — the same fixture the Playwright (PR #6) and Puppeteer (PR #7)
// exporters consume — so the three exporters share one ground truth.
//
// Asserts per the round-2 spec:
//   - ≥1 step references a captured action (the Upgrade button click).
//   - When --auth-state is supplied, the recipe references the auth
//     state file path.
//   - Deterministic: identical input produces byte-identical output.
//   - parseCaptureJsonl rejects malformed lines and wrong-schema lines.
//   - CLI writes out/recipe.md and exits 0.

import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  describeEntry,
  exportEnglish,
  parseCaptureJsonl,
} from "../src/export-english.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(here, "fixtures/export-capture.jsonl");
const fixtureRaw = readFileSync(fixturePath, "utf-8");
const fixtureEntries = parseCaptureJsonl(fixtureRaw);

test("parseCaptureJsonl: returns one entry per non-empty line", () => {
  assert.equal(fixtureEntries.length, 4);
  for (const entry of fixtureEntries) {
    assert.equal(entry.schema, "selector-capture-entry");
    assert.equal(entry.version, 3);
  }
});

test("parseCaptureJsonl: rejects invalid JSON with line number", () => {
  assert.throws(
    () => parseCaptureJsonl('{"schema":"selector-capture-entry"}\n{not json}\n'),
    /line 2: invalid JSON/,
  );
});

test("parseCaptureJsonl: rejects wrong-schema entries", () => {
  assert.throws(
    () => parseCaptureJsonl('{"schema":"something-else"}\n'),
    /not a selector-capture-entry/,
  );
});

test("describeEntry: click step for buttons, type step for editable inputs", () => {
  const upgradeStep = describeEntry(fixtureEntries[0], 1);
  assert.match(upgradeStep, /^1\. Click the \*\*Upgrade to Pro\*\* button\.$/);

  const emailStep = describeEntry(fixtureEntries[2], 3);
  assert.match(emailStep, /^3\. Type `hello@acme\.test` into the \*\*Email\*\* (textbox|field)\.$/);
});

test("exportEnglish: ≥1 step references the captured Upgrade action", () => {
  const md = exportEnglish(fixtureEntries, { recipeName: "fixture" });
  const stepLines = md.split("\n").filter((l) => /^\d+\.\s/.test(l));
  assert.ok(stepLines.length >= 1, "expected at least one numbered step");
  assert.ok(
    stepLines.some((l) => l.includes("Upgrade to Pro")),
    "expected a step referencing the captured Upgrade action",
  );
  assert.equal(stepLines.length, fixtureEntries.length);
});

test("exportEnglish: groups steps by URL with markdown headers", () => {
  const md = exportEnglish(fixtureEntries, { recipeName: "fixture" });
  const headers = md.split("\n").filter((l) => l.startsWith("## On "));
  assert.equal(headers.length, 2, "two distinct page URLs in the fixture → two groups");
  assert.ok(headers[0].includes("acme.test/pricing"));
  assert.ok(headers[1].includes("app.acme.test/settings"));
});

test("exportEnglish: when authState supplied, recipe references it", () => {
  const md = exportEnglish(fixtureEntries, {
    recipeName: "fixture",
    authState: "./fixtures/storage-state.json",
  });
  assert.match(md, /## Auth/);
  assert.ok(
    md.includes("./fixtures/storage-state.json"),
    "expected the auth-state path to appear in the recipe",
  );
  assert.match(md, /pinchgrab replay --auth-state/);
});

test("exportEnglish: omits Auth section when authState not supplied", () => {
  const md = exportEnglish(fixtureEntries, { recipeName: "fixture" });
  assert.equal(md.includes("## Auth"), false);
});

test("exportEnglish: deterministic — same input → byte-identical output", () => {
  const a = exportEnglish(fixtureEntries, { recipeName: "fixture" });
  const b = exportEnglish(fixtureEntries, { recipeName: "fixture" });
  assert.equal(a, b);

  const c = exportEnglish(fixtureEntries, {
    recipeName: "fixture",
    authState: "/tmp/storage.json",
  });
  const d = exportEnglish(fixtureEntries, {
    recipeName: "fixture",
    authState: "/tmp/storage.json",
  });
  assert.equal(c, d);
});

test("exportEnglish: throws on empty entries array", () => {
  assert.throws(() => exportEnglish([]), /non-empty array/);
});

test("CLI: writes <recipe-name>.recipe.md and exits 0", () => {
  const outdir = mkdtempSync(join(tmpdir(), "pinchgrab-english-"));
  try {
    const stdout = execFileSync(
      process.execPath,
      [
        resolve(here, "../src/export-english.mjs"),
        fixturePath,
        outdir,
        "--auth-state",
        "./demo-storage.json",
      ],
      { encoding: "utf-8" },
    );
    assert.match(stdout, /export-capture\.recipe\.md/);
    assert.match(stdout, /4 step\(s\) for 4 capture entries/);

    const md = readFileSync(join(outdir, "export-capture.recipe.md"), "utf-8");
    assert.match(md, /^# Recipe: export-capture$/m);
    assert.match(md, /## Auth/);
    assert.ok(md.includes("./demo-storage.json"));
    assert.ok(md.includes("Upgrade to Pro"));
  } finally {
    rmSync(outdir, { recursive: true, force: true });
  }
});
