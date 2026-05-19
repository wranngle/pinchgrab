// Replay unit test — exercises the CSS → XPath → a11y fallback chain
// without paying for a real browser. The adapter is an in-memory map
// of synthetic locators; the strategy chain in src/replay.mjs is the
// system under test.
//
// Run: `node tests/replay.test.mjs`. Exits 0 on success.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseCaptureJsonl, replay, replayEntry } from "../src/replay.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(here, "fixtures/capture.jsonl");
const fixture = readFileSync(fixturePath, "utf-8");

const makeAdapter = (state) => ({
  cssHits: new Set(state.css ?? []),
  xpathHits: new Set(state.xpath ?? []),
  roleHits: new Set((state.roles ?? []).map((r) => `${r.role}::${r.name ?? ""}`)),
  async findByCss(selector) {
    return this.cssHits.has(selector) ? { tag: "match" } : null;
  },
  async findByXPath(xpath) {
    return this.xpathHits.has(xpath) ? { tag: "match" } : null;
  },
  async findByRole(role, name) {
    if (this.roleHits.has(`${role}::${name ?? ""}`)) return { tag: "match" };
    if (this.roleHits.has(`${role}::`)) return { tag: "match" };
    return null;
  },
});

const entries = parseCaptureJsonl(fixture);
assert.equal(entries.length, 3, "fixture must contain exactly 3 entries");

// ---- happy path: all primary CSS selectors hit ---------------------------
{
  const adapter = makeAdapter({
    css: [
      "button.btn.btn--primary",
      "input[data-testid='global-search']",
      "a.link-out",
    ],
  });
  const summary = await replay(adapter, entries);
  assert.equal(summary.total, 3);
  assert.equal(summary.found, 3, "all three entries should resolve via CSS");
  for (const r of summary.results) {
    assert.equal(r.success, true);
    assert.equal(r.strategy, "css");
  }
  console.log("ok 1 - happy path: 3/3 via CSS");
}

// ---- CSS broken, XPath rescues every entry --------------------------------
{
  const adapter = makeAdapter({
    css: [],
    xpath: [
      "/html/body/main/button[1]",
      "/html/body/main/input",
      "/html/body/main/a",
    ],
  });
  const summary = await replay(adapter, entries);
  assert.equal(summary.found, 3);
  for (const r of summary.results) assert.equal(r.strategy, "xpath");
  console.log("ok 2 - CSS broken: 3/3 via XPath");
}

// ---- CSS and XPath broken, a11y rescues -----------------------------------
{
  const adapter = makeAdapter({
    css: [],
    xpath: [],
    roles: [
      { role: "button", name: "Publish" },
      { role: "searchbox", name: "Search" },
      { role: "link", name: "Docs" },
    ],
  });
  const summary = await replay(adapter, entries);
  assert.equal(summary.found, 3);
  for (const r of summary.results) assert.equal(r.strategy, "a11y");
  console.log("ok 3 - CSS+XPath broken: 3/3 via a11y");
}

// ---- nothing works: 0 found ---------------------------------------------
{
  const adapter = makeAdapter({});
  const summary = await replay(adapter, entries);
  assert.equal(summary.found, 0);
  for (const r of summary.results) {
    assert.equal(r.success, false);
    assert.equal(r.strategy, null);
  }
  console.log("ok 4 - nothing wired: 0/3");
}

// ---- partial: 2 via CSS, 1 via a11y ---------------------------------------
{
  const adapter = makeAdapter({
    css: ["button.btn.btn--primary", "a.link-out"],
    roles: [{ role: "searchbox", name: "Search" }],
  });
  const summary = await replay(adapter, entries);
  assert.equal(summary.found, 3);
  assert.equal(summary.results[0].strategy, "css");
  assert.equal(summary.results[1].strategy, "a11y");
  assert.equal(summary.results[2].strategy, "css");
  console.log("ok 5 - mixed strategies: 3/3");
}

// ---- single-entry helper preserves strategy ordering ----------------------
{
  const adapter = makeAdapter({
    xpath: ["/html/body/main/input"],
    roles: [{ role: "searchbox", name: "Search" }],
  });
  const r = await replayEntry(adapter, entries[1]);
  assert.equal(r.success, true);
  assert.equal(r.strategy, "xpath", "xpath must be tried before a11y");
  console.log("ok 6 - replayEntry: strategy order respected");
}

console.log("# all replay tests passed");
