// Bundle directional docs tests (item 14: README.md + AGENTS.md).
//
// The bundle's README/AGENTS must be concise, machine-agnostic (no
// absolute paths or host names), point at DESIGN.md as brand canon, tell
// the agent to follow per-capture comments and to verify by running the
// app, and be deterministic.

import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  buildBundleAgentsMd,
  buildBundleReadmeMd,
} from "../src/export-bundle-docs.mjs";

test("AGENTS.md: directional guidance present", () => {
  const md = buildBundleAgentsMd();
  assert.match(md, /^# AGENTS\.md/m);
  assert.match(md, /DESIGN\.md/);
  assert.match(md, /brand\s+canon/i);
  assert.match(md, /comments/i);
  assert.match(md, /verify/i);
  assert.match(md, /run the app/i);
  // Tells the agent where UI source usually lives, generically.
  assert.match(md, /src\/|components\/|app\//);
});

test("README.md: explains each bundle file and points at AGENTS.md", () => {
  const md = buildBundleReadmeMd();
  assert.match(md, /^# PinchGrab feedback bundle/m);
  assert.match(md, /Read `AGENTS\.md` first/);
  assert.match(md, /screenshots\.json/);
  assert.match(md, /schema\.json/);
  assert.match(md, /DESIGN\.md/);
});

test("docs are machine-agnostic: no absolute paths or host names", () => {
  for (const md of [buildBundleAgentsMd(), buildBundleReadmeMd()]) {
    assert.doesNotMatch(md, /\/home\/|\/Users\/|C:\\/, "no absolute machine path");
    assert.doesNotMatch(md, /https?:\/\/[a-z0-9.-]+\.(com|test|io|dev)/i, "no host names");
  }
});

test("jsonlName flows into both docs", () => {
  const opts = { jsonlName: "my-workspace.jsonl" };
  assert.match(buildBundleAgentsMd(opts), /my-workspace\.jsonl/);
  assert.match(buildBundleReadmeMd(opts), /my-workspace\.jsonl/);
});

test("deterministic", () => {
  assert.equal(buildBundleAgentsMd(), buildBundleAgentsMd());
  assert.equal(buildBundleReadmeMd({ jsonlName: "x.jsonl" }), buildBundleReadmeMd({ jsonlName: "x.jsonl" }));
});
