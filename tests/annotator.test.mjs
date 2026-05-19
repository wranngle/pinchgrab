import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { annotate, headlessRun } from "../src/annotator.mjs";

const entry = (sequence, extra = {}) => ({
  schema: "selector-capture-entry",
  version: 3,
  sequence,
  capturedAt: `2026-05-14T17:0${sequence}:00.000Z`,
  page: { url: `https://acme.test/step-${sequence}` },
  selectors: { css: `button.step-${sequence}` },
  element: { tag: "button" },
  notes: { url: `https://acme.test/step-${sequence}` },
  feedback: "",
  ...extra,
});

const toJsonl = (...rows) => rows.map((r) => JSON.stringify(r)).join("\n");

test("annotate: adds annotation field to targeted step (sequence match)", () => {
  const input = toJsonl(entry(1), entry(2), entry(3));
  const { jsonl, applied, unapplied, warnings } = annotate(input, [
    { sequence: 2, annotation: "click upgrade" },
  ]);
  const out = jsonl.split("\n").map((l) => JSON.parse(l));
  assert.equal(out[0].annotation, undefined, "step 1 untouched");
  assert.equal(out[1].annotation, "click upgrade", "step 2 annotated");
  assert.equal(out[2].annotation, undefined, "step 3 untouched");
  assert.deepEqual(applied, [2]);
  assert.deepEqual(unapplied, []);
  assert.deepEqual(warnings, []);
});

test("annotate: preserves all other fields on the annotated entry (no field loss)", () => {
  const input = toJsonl(entry(1, { feedback: "hovered first" }));
  const { jsonl } = annotate(input, [{ sequence: 1, annotation: "primary CTA" }]);
  const out = JSON.parse(jsonl);
  assert.equal(out.schema, "selector-capture-entry");
  assert.equal(out.version, 3);
  assert.equal(out.feedback, "hovered first");
  assert.equal(out.notes.url, "https://acme.test/step-1");
  assert.equal(out.annotation, "primary CTA");
});

test("annotate: multiple ops in one pass, deterministic order", () => {
  const input = toJsonl(entry(1), entry(2), entry(3), entry(4));
  const { jsonl, applied } = annotate(input, [
    { sequence: 1, annotation: "open page" },
    { sequence: 4, annotation: "submit" },
  ]);
  const out = jsonl.split("\n").map((l) => JSON.parse(l));
  assert.equal(out[0].annotation, "open page");
  assert.equal(out[1].annotation, undefined);
  assert.equal(out[2].annotation, undefined);
  assert.equal(out[3].annotation, "submit");
  assert.deepEqual(applied, [1, 4]);
});

test("annotate: unmatched ops surface in `unapplied`", () => {
  const input = toJsonl(entry(1));
  const { unapplied } = annotate(input, [{ sequence: 99, annotation: "ghost" }]);
  assert.deepEqual(unapplied, [99]);
});

test("annotate: idempotent — re-running overwrites prior annotation", () => {
  const input = toJsonl(entry(2));
  const first = annotate(input, [{ sequence: 2, annotation: "v1" }]);
  const second = annotate(first.jsonl, [{ sequence: 2, annotation: "v2" }]);
  const out = JSON.parse(second.jsonl);
  assert.equal(out.annotation, "v2");
});

test("annotate: skips lines that are not capture entries (non-schema JSON passes through)", () => {
  const foreign = JSON.stringify({ schema: "other-thing", sequence: 2 });
  const input = [JSON.stringify(entry(1)), foreign, JSON.stringify(entry(2))].join("\n");
  const { jsonl, applied } = annotate(input, [{ sequence: 2, annotation: "tag" }]);
  const lines = jsonl.split("\n").map((l) => JSON.parse(l));
  assert.equal(lines[1].annotation, undefined, "foreign line untouched");
  assert.equal(lines[1].schema, "other-thing");
  assert.equal(lines[2].annotation, "tag");
  assert.deepEqual(applied, [2]);
});

test("annotate: malformed JSON line passes through with a warning", () => {
  const input = [JSON.stringify(entry(1)), "{not json", JSON.stringify(entry(2))].join("\n");
  const { jsonl, warnings } = annotate(input, [{ sequence: 2, annotation: "ok" }]);
  const lines = jsonl.split("\n");
  assert.equal(lines[1], "{not json", "malformed line preserved byte-for-byte");
  assert.equal(JSON.parse(lines[2]).annotation, "ok");
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /line 2/);
});

test("annotate: blank lines preserved (JSONL append-friendly)", () => {
  const input = `\n${JSON.stringify(entry(1))}\n\n${JSON.stringify(entry(2))}\n`;
  const { jsonl } = annotate(input, [{ sequence: 1, annotation: "first" }]);
  const lines = jsonl.split("\n");
  assert.equal(lines[0], "");
  assert.equal(JSON.parse(lines[1]).annotation, "first");
  assert.equal(lines[2], "");
  assert.equal(JSON.parse(lines[3]).sequence, 2);
  assert.equal(lines[4], "");
});

test("annotate: rejects malformed ops shape", () => {
  assert.throws(() => annotate("", [{ sequence: 0, annotation: "x" }]), /positive integer/);
  assert.throws(() => annotate("", [{ sequence: 1 }]), /must be a string/);
  assert.throws(() => annotate("", "nope"), /must be an array/);
});

test("headlessRun: reads input file, writes output file, returns result", () => {
  const dir = mkdtempSync(join(tmpdir(), "pinchgrab-annot-"));
  try {
    const inPath = join(dir, "in.jsonl");
    const outPath = join(dir, "out.jsonl");
    writeFileSync(inPath, toJsonl(entry(1), entry(2), entry(3)));
    const result = headlessRun({
      inputPath: inPath,
      ops: [{ sequence: 3, annotation: "final step" }],
      outputPath: outPath,
    });
    assert.deepEqual(result.applied, [3]);
    const written = readFileSync(outPath, "utf-8");
    const lines = written.split("\n").map((l) => JSON.parse(l));
    assert.equal(lines[2].annotation, "final step");
    assert.equal(lines[0].annotation, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("headlessRun: returns result without writing when outputPath omitted", () => {
  const dir = mkdtempSync(join(tmpdir(), "pinchgrab-annot-"));
  try {
    const inPath = join(dir, "in.jsonl");
    writeFileSync(inPath, toJsonl(entry(1)));
    const result = headlessRun({
      inputPath: inPath,
      ops: [{ sequence: 1, annotation: "note" }],
    });
    assert.equal(JSON.parse(result.jsonl).annotation, "note");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("output is valid JSONL — every non-blank line re-parses", () => {
  const input = toJsonl(entry(1), entry(2), entry(3));
  const { jsonl } = annotate(input, [
    { sequence: 1, annotation: "a" },
    { sequence: 2, annotation: 'b "quoted" \\backslash' },
    { sequence: 3, annotation: "c\nwith\nnewlines" },
  ]);
  const lines = jsonl.split("\n").filter((l) => l.length > 0);
  for (const line of lines) assert.doesNotThrow(() => JSON.parse(line));
  const parsed = lines.map((l) => JSON.parse(l));
  assert.equal(parsed[1].annotation, 'b "quoted" \\backslash');
  assert.equal(parsed[2].annotation, "c\nwith\nnewlines");
});

test("docs/capture-sample.jsonl shape is honored (sequence 2 captures get annotated)", () => {
  // synthesize three sample-shaped entries; the real PR #1 sample uses the same
  // top-level `sequence` field, so this verifies cross-PR compatibility without
  // depending on PR #1 being merged.
  const sample = toJsonl(
    entry(1, { component: { framework: "react", componentName: "UpgradeButton" } }),
    entry(2, { component: null }),
    entry(3, { component: { framework: "vue", componentName: "AccountForm" } }),
  );
  const { jsonl, applied } = annotate(sample, [
    { sequence: 2, annotation: "compose link click" },
  ]);
  const out = jsonl.split("\n").map((l) => JSON.parse(l));
  assert.equal(out[1].annotation, "compose link click");
  assert.equal(out[1].component, null);
  assert.deepEqual(applied, [2]);
});
