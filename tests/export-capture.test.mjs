// Single-capture full-export tests (item 7: "Copy capture as JSON").
//
// Exercises src/export-capture.mjs against a hand-built capture in the
// panel's `Entry` shape (src/types.ts) plus attached feedback rows. The
// invariant under test: the serializer produces a COMPLETE, self-contained
// export of ONE capture — paths, text/content, outerHTML, AND every
// note/comment — and is deterministic.

import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  serializeCaptureFull,
  serializeCaptureJson,
  serializeCaptureText,
} from "../src/export-capture.mjs";

// A representative panel-side capture: a button with text, outerHTML, a
// couple of selector forms, a screenshot path, plus two comments.
const sampleEntry = {
  uid: "u-cta-1",
  n: 3,
  ts: "2026-05-14T00:00:00.000Z",
  url: "https://app.example.com/pricing",
  tag: "button",
  selector: 'button[data-testid="cta-upgrade"]',
  selectors: {
    css: 'main > section > button[data-testid="cta-upgrade"]',
    compact: "button[data-testid=cta-upgrade]",
    xpath: "//main/section/button",
    dataIds: "cta-upgrade",
  },
  text: "Upgrade to Pro",
  renderedText: "UPGRADE TO PRO",
  outerHTML: '<button class="btn btn--primary" data-testid="cta-upgrade">Upgrade to Pro</button>',
  role: "button",
  accessibleName: "Upgrade to Pro",
  testId: "cta-upgrade",
  classes: ["btn", "btn--primary"],
  rect: { x: 10, y: 20, w: 120, h: 40 },
  selectorMatchCount: 1,
  screenshot: { element: "screenshots/u-cta-1.png" },
};

const sampleComments = [
  { type: "feedback", id: "f1", uid: "fb-1", ts: "2026-05-14T00:01:00.000Z", text: "Make this violet, not blue.", parentUid: "u-cta-1", tags: ["color"] },
  { type: "feedback", id: "f2", uid: "fb-2", ts: "2026-05-14T00:02:00.000Z", text: "Casing should be sentence case.", parentUid: "u-cta-1" },
];

const sampleCapture = { entry: sampleEntry, feedback: sampleComments };

test("serializeCaptureFull: includes paths, text, outerHTML, comments, metadata", () => {
  const out = serializeCaptureFull(sampleCapture);
  assert.equal(out.kind, "pinchgrab/capture-full");
  assert.equal(out.uid, "u-cta-1");
  assert.equal(out.url, "https://app.example.com/pricing");
  // paths: every locator form present
  assert.equal(out.paths.css, 'button[data-testid="cta-upgrade"]');
  assert.equal(out.paths.xpath, "//main/section/button");
  assert.equal(out.paths.testId, "cta-upgrade");
  assert.equal(out.paths.matchCount, 1);
  // content: source + rendered + markup
  assert.equal(out.content.text, "Upgrade to Pro");
  assert.equal(out.content.renderedText, "UPGRADE TO PRO");
  assert.match(out.content.outerHTML, /Upgrade to Pro<\/button>/);
  // identity
  assert.equal(out.identity.accessibleName, "Upgrade to Pro");
  assert.deepEqual(out.identity.classes, ["btn", "btn--primary"]);
  // comments: both, with text + tags preserved
  assert.equal(out.comments.length, 2);
  assert.equal(out.comments[0].text, "Make this violet, not blue.");
  assert.deepEqual(out.comments[0].tags, ["color"]);
  assert.equal(out.comments[1].text, "Casing should be sentence case.");
  // metadata passthrough
  assert.deepEqual(out.meta.rect, { x: 10, y: 20, w: 120, h: 40 });
  assert.equal(out.meta.screenshot.element, "screenshots/u-cta-1.png");
});

test("serializeCaptureFull: accepts a bare Entry (no feedback wrapper)", () => {
  const out = serializeCaptureFull(sampleEntry);
  assert.equal(out.uid, "u-cta-1");
  assert.equal(out.comments, undefined, "bare entry has no comments key");
  assert.equal(out.content.text, "Upgrade to Pro");
});

test("serializeCaptureFull: inlines group members recursively", () => {
  const child = { ...sampleEntry, uid: "u-child", n: 4, group: undefined };
  const head = { entry: { ...sampleEntry, group: [child] }, feedback: sampleComments };
  const out = serializeCaptureFull(head);
  assert.equal(out.members.length, 1);
  assert.equal(out.members[0].uid, "u-child");
  assert.equal(out.members[0].kind, "pinchgrab/capture-full");
});

test("serializeCaptureFull: throws on non-object input", () => {
  assert.throws(() => serializeCaptureFull(null), /capture must be an object/);
});

test("serializeCaptureJson: pretty JSON, trailing newline, deterministic", () => {
  const a = serializeCaptureJson(sampleCapture);
  const b = serializeCaptureJson(sampleCapture);
  assert.equal(a, b);
  assert.ok(a.endsWith("\n"));
  assert.ok(a.includes("\n  "), "pretty-printed (indented)");
  // round-trips
  const parsed = JSON.parse(a);
  assert.equal(parsed.uid, "u-cta-1");
  assert.equal(parsed.comments.length, 2);
});

test("serializeCaptureText: markdown carries paths, text, markup, comments", () => {
  const md = serializeCaptureText(sampleCapture);
  assert.match(md, /^# Capture #3: Upgrade to Pro$/m);
  assert.match(md, /## Paths/);
  assert.match(md, /cta-upgrade/);
  assert.match(md, /## Text/);
  assert.match(md, /Rendered:/);
  assert.match(md, /## Markup/);
  assert.match(md, /## Notes & comments/);
  assert.match(md, /Make this violet, not blue\. _\(color\)_/);
  assert.match(md, /Casing should be sentence case\./);
  assert.ok(md.endsWith("\n"));
});

test("serializeCaptureText: deterministic", () => {
  assert.equal(serializeCaptureText(sampleCapture), serializeCaptureText(sampleCapture));
});
