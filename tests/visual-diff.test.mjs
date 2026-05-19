// Visual regression baseline — DOM snapshot diff tests.
//
// Sibling to tests/export-puppeteer.test.mjs. Same fixture style, same
// determinism contract, same proof gate (the replay produces a Markdown
// report listing the changed step). Round-2 plan §11 item 3.
//
// Behaviour under test:
//   1. parseDomSnapshots skips blanks, rejects non-schema lines,
//      requires numeric `sequence` and string `outerHTML`.
//   2. diffSnapshots classifies steps as unchanged|changed|added|removed
//      and orders results by sequence ascending (determinism).
//   3. renderVisualDiffMarkdown header reports total + changed counts;
//      empty diff renders "No drift detected".
//   4. renderVisualDiffMarkdown lists only changed steps in the
//      "## Changed steps" section, never unchanged ones.
//   5. replayVisualDiff writes out/visual-diff.md against the bundled
//      fixture pair; the report names the changed step (sequence 2).
//   6. Output is byte-identical for byte-identical input.
//
// Run: `node --test tests/visual-diff.test.mjs`.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DOM_SNAPSHOT_SCHEMA,
  diffSnapshots,
  parseDomSnapshots,
  renderVisualDiffMarkdown,
  replayVisualDiff,
} from "../src/visual-diff.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const baselinePath = resolve(here, "fixtures/dom-baseline.jsonl");
const currentPath = resolve(here, "fixtures/dom-current.jsonl");
const baselineRaw = readFileSync(baselinePath, "utf-8");
const currentRaw = readFileSync(currentPath, "utf-8");

test("DOM_SNAPSHOT_SCHEMA constant is the expected literal", () => {
  assert.equal(DOM_SNAPSHOT_SCHEMA, "dom-snapshot");
});

test("parseDomSnapshots skips blanks and rejects malformed rows", () => {
  const baseline = parseDomSnapshots(baselineRaw);
  assert.equal(baseline.length, 4);
  for (const entry of baseline) {
    assert.equal(entry.schema, "dom-snapshot");
    assert.equal(typeof entry.sequence, "number");
    assert.equal(typeof entry.outerHTML, "string");
  }
  assert.throws(() => parseDomSnapshots("not json"), /invalid JSON/);
  assert.throws(
    () => parseDomSnapshots(`{"schema":"other","sequence":1,"outerHTML":"x"}`),
    /not a dom-snapshot/,
  );
  assert.throws(
    () => parseDomSnapshots(`{"schema":"dom-snapshot","outerHTML":"x"}`),
    /missing numeric sequence/,
  );
  assert.throws(
    () => parseDomSnapshots(`{"schema":"dom-snapshot","sequence":1}`),
    /missing outerHTML string/,
  );
});

test("diffSnapshots classifies unchanged, changed, added, removed", () => {
  const baseline = parseDomSnapshots(baselineRaw);
  const current = parseDomSnapshots(currentRaw);
  const diff = diffSnapshots(baseline, current);
  assert.equal(diff.length, 4, "four shared sequences in fixtures");
  const statusBySeq = Object.fromEntries(diff.map((d) => [d.sequence, d.status]));
  assert.equal(statusBySeq[1], "unchanged");
  assert.equal(statusBySeq[2], "changed", "fixture step 2 mutated class+text");
  assert.equal(statusBySeq[3], "unchanged");
  assert.equal(statusBySeq[4], "unchanged");

  const addedOnly = diffSnapshots(
    [],
    [{ schema: "dom-snapshot", sequence: 9, selector: "x", outerHTML: "<x/>" }],
  );
  assert.equal(addedOnly[0].status, "added");

  const removedOnly = diffSnapshots(
    [{ schema: "dom-snapshot", sequence: 9, selector: "x", outerHTML: "<x/>" }],
    [],
  );
  assert.equal(removedOnly[0].status, "removed");
});

test("diffSnapshots orders results by sequence ascending", () => {
  const baseline = [
    { schema: "dom-snapshot", sequence: 3, selector: "c", outerHTML: "<c/>" },
    { schema: "dom-snapshot", sequence: 1, selector: "a", outerHTML: "<a/>" },
    { schema: "dom-snapshot", sequence: 2, selector: "b", outerHTML: "<b/>" },
  ];
  const diff = diffSnapshots(baseline, baseline);
  assert.deepEqual(
    diff.map((d) => d.sequence),
    [1, 2, 3],
  );
});

test("renderVisualDiffMarkdown header reports totals and 'no drift' on empty diff", () => {
  const baseline = parseDomSnapshots(baselineRaw);
  const md = renderVisualDiffMarkdown(diffSnapshots(baseline, baseline));
  assert.match(md, /Steps compared: 4 — changed: 0, unchanged: 4\./);
  assert.match(md, /No drift detected\./);
  assert.ok(!md.includes("## Changed steps"));
});

test("renderVisualDiffMarkdown lists only changed steps", () => {
  const baseline = parseDomSnapshots(baselineRaw);
  const current = parseDomSnapshots(currentRaw);
  const md = renderVisualDiffMarkdown(diffSnapshots(baseline, current));
  assert.match(md, /Steps compared: 4 — changed: 1, unchanged: 3\./);
  assert.match(md, /## Changed steps/);
  assert.match(md, /### Step 2 — changed/);
  assert.ok(!md.includes("### Step 1"), "unchanged step 1 must not appear");
  assert.ok(!md.includes("### Step 3"), "unchanged step 3 must not appear");
  assert.match(md, /Selector: `a#compose`/);
  assert.match(md, /compose-v2/);
  assert.match(md, /New message/);
});

test("replayVisualDiff writes out/visual-diff.md naming the changed step", () => {
  const outPath = resolve(repoRoot, "tests/.tmp-visual-diff/out/visual-diff.md");
  rmSync(dirname(dirname(outPath)), { recursive: true, force: true });
  const result = replayVisualDiff(baselinePath, currentPath, { outPath });
  assert.equal(result.outPath, outPath);
  const written = readFileSync(outPath, "utf-8");
  assert.equal(written, result.markdown);
  assert.match(written, /### Step 2 — changed/);
  assert.match(written, /compose-v2/);
  rmSync(dirname(dirname(outPath)), { recursive: true, force: true });
});

test("output is deterministic for identical input", () => {
  const baseline = parseDomSnapshots(baselineRaw);
  const current = parseDomSnapshots(currentRaw);
  const a = renderVisualDiffMarkdown(diffSnapshots(baseline, current));
  const b = renderVisualDiffMarkdown(diffSnapshots(baseline, current));
  assert.equal(a, b);
});
