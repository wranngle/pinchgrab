// Self-healing selector chain — exercises the drift recovery path
// without paying for a real browser. The adapter is an in-memory map;
// the system under test is src/healing.mjs (chain logic + ledger write)
// and the optional healedLedgerPath wiring in src/replay.mjs.
//
// Run: `node tests/healing.test.mjs`. Exits 0 on success.

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { collectHeals, healEntry, writeHealedLedger } from "../src/healing.mjs";
import { parseCaptureJsonl, replay } from "../src/replay.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(here, "fixtures/capture.jsonl");
const entries = parseCaptureJsonl(readFileSync(fixturePath, "utf-8"));
assert.equal(entries.length, 3, "fixture must contain exactly 3 entries");

// Adapter where every primary CSS class has been renamed (the bug we
// are testing against). The XPath and a11y locators still resolve, so
// the healing chain must recover all three entries.
const makeRenamedCssAdapter = () => ({
  cssHits: new Set(),
  xpathHits: new Set([
    "/html/body/main/button[1]",
    "/html/body/main/input",
    "/html/body/main/a",
  ]),
  roleHits: new Set(["button::Publish", "searchbox::Search", "link::Docs"]),
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

// ---- 1: renamed CSS class — XPath rescues every entry --------------------
{
  const adapter = makeRenamedCssAdapter();
  const result0 = await healEntry(adapter, entries[0]);
  assert.equal(result0.healed, true, "entry must heal when CSS misses");
  assert.equal(result0.strategy, "xpath", "xpath is first fallback");
  assert.equal(result0.original_selector, "button.btn.btn--primary");
  assert.equal(result0.winning_selector, "/html/body/main/button[1]");
  console.log("ok 1 - healEntry: renamed CSS rescued by XPath, fields present");
}

// ---- 2: collectHeals only records DRIFT, not primary-css hits -----------
{
  // adapter where entry 0 still resolves via CSS, entries 1+2 only via xpath
  const adapter = {
    cssHits: new Set(["button.btn.btn--primary"]),
    xpathHits: new Set(["/html/body/main/input", "/html/body/main/a"]),
    roleHits: new Set(),
    async findByCss(s) {
      return this.cssHits.has(s) ? { tag: "match" } : null;
    },
    async findByXPath(x) {
      return this.xpathHits.has(x) ? { tag: "match" } : null;
    },
    async findByRole() {
      return null;
    },
  };
  const ledger = await collectHeals(adapter, entries);
  assert.equal(ledger.length, 2, "primary-css hits must not be in the ledger");
  assert.deepEqual(
    ledger.map((r) => r.index),
    [1, 2],
    "ledger indices must match the entries whose CSS drifted",
  );
  for (const row of ledger) {
    assert.ok(row.original_selector, "every ledger row carries original_selector");
    assert.ok(row.winning_selector, "every ledger row carries winning_selector");
    assert.equal(row.strategy, "xpath");
  }
  console.log("ok 2 - collectHeals: ledger filters out primary-css hits");
}

// ---- 3: a11y rescues when CSS and XPath both fail -----------------------
{
  const adapter = {
    cssHits: new Set(),
    xpathHits: new Set(),
    roleHits: new Set(["button::Publish"]),
    async findByCss() {
      return null;
    },
    async findByXPath() {
      return null;
    },
    async findByRole(role, name) {
      return this.roleHits.has(`${role}::${name ?? ""}`) ? { tag: "match" } : null;
    },
  };
  const r = await healEntry(adapter, entries[0]);
  assert.equal(r.healed, true);
  assert.equal(r.strategy, "a11y");
  assert.equal(r.winning_selector, 'role=button[name="Publish"]');
  console.log("ok 3 - healEntry: a11y rescues when CSS and XPath drift");
}

// ---- 4: writeHealedLedger emits required fields per row -----------------
{
  const tmp = mkdtempSync(join(tmpdir(), "pinchgrab-heal-"));
  const ledgerPath = join(tmp, "healed.jsonl");
  try {
    const adapter = makeRenamedCssAdapter();
    const ledger = await collectHeals(adapter, entries);
    const written = await writeHealedLedger(ledgerPath, ledger);
    assert.equal(written.count, 3);
    const lines = readFileSync(ledgerPath, "utf-8").trim().split("\n");
    assert.equal(lines.length, 3, "one JSONL line per healed entry");
    for (const line of lines) {
      const row = JSON.parse(line);
      assert.ok("original_selector" in row, "row must have original_selector");
      assert.ok("winning_selector" in row, "row must have winning_selector");
      assert.ok("strategy" in row);
      assert.ok("index" in row);
    }
    console.log("ok 4 - writeHealedLedger: emits original_selector + winning_selector per row");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// ---- 5: replay({ healedLedgerPath }) integration -----------------------
{
  const tmp = mkdtempSync(join(tmpdir(), "pinchgrab-heal-"));
  const ledgerPath = join(tmp, "healed.jsonl");
  try {
    const adapter = makeRenamedCssAdapter();
    const summary = await replay(adapter, entries, { healedLedgerPath: ledgerPath });
    assert.equal(summary.found, 3, "all three entries should still resolve");
    for (const r of summary.results) assert.equal(r.strategy, "xpath");
    assert.equal(summary.healed.count, 3, "ledger should record 3 healed entries");
    assert.equal(summary.healed.path, ledgerPath);
    const raw = readFileSync(ledgerPath, "utf-8");
    assert.ok(raw.includes("original_selector"));
    assert.ok(raw.includes("winning_selector"));
    console.log("ok 5 - replay: writes healed.jsonl when ledger path is supplied");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// ---- 6: empty ledger is written when nothing drifted -------------------
{
  const tmp = mkdtempSync(join(tmpdir(), "pinchgrab-heal-"));
  const ledgerPath = join(tmp, "healed.jsonl");
  try {
    const adapter = {
      cssHits: new Set([
        "button.btn.btn--primary",
        "input[data-testid='global-search']",
        "a.link-out",
      ]),
      xpathHits: new Set(),
      roleHits: new Set(),
      async findByCss(s) {
        return this.cssHits.has(s) ? { tag: "match" } : null;
      },
      async findByXPath() {
        return null;
      },
      async findByRole() {
        return null;
      },
    };
    const summary = await replay(adapter, entries, { healedLedgerPath: ledgerPath });
    assert.equal(summary.found, 3);
    assert.equal(summary.healed.count, 0, "no drift -> empty ledger");
    const raw = readFileSync(ledgerPath, "utf-8");
    assert.equal(raw, "", "empty file written when nothing drifted");
    console.log("ok 6 - replay: empty ledger written when no drift");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

console.log("# all healing tests passed");
