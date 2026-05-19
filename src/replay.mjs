// Replay a captured JSONL log against a live page adapter.
//
// Each entry is resolved through a fallback chain:
//   1. selectors.css       (primary CSS path)
//   2. selectors.xpath     (structural XPath)
//   3. a11y role + name    (computed role + accessible name)
//
// The page adapter is duck-typed; production uses a Playwright Page
// (wrapped by `bin/pinchgrab`), tests use an in-memory adapter. The
// adapter contract is:
//
//   await adapter.findByCss(selector)   -> truthy when exactly one match
//   await adapter.findByXPath(xpath)    -> truthy when exactly one match
//   await adapter.findByRole(role,name) -> truthy when exactly one match
//
// All three return `null` when the locator fails to resolve to a unique
// hit; any thrown error is treated as a miss and the next strategy is
// attempted.
//
// When `replay()` is called with `{ healedLedgerPath }`, every entry
// rescued by a non-css strategy is also written to the healing ledger
// (src/healing.mjs). Primary-css hits are NOT recorded — the ledger is
// drift signal, not a full replay log.

import { collectHeals, writeHealedLedger } from "./healing.mjs";

const STRATEGIES = ["css", "xpath", "a11y"];

const tryStrategy = async (adapter, strategy, entry) => {
  try {
    if (strategy === "css") {
      const sel = entry?.selectors?.css;
      if (!sel) return null;
      return (await adapter.findByCss(sel)) ? { strategy, locator: sel } : null;
    }
    if (strategy === "xpath") {
      const xp = entry?.selectors?.xpath;
      if (!xp) return null;
      return (await adapter.findByXPath(xp)) ? { strategy, locator: xp } : null;
    }
    if (strategy === "a11y") {
      const role =
        entry?.element?.accessibility?.computed?.computedRole ||
        entry?.element?.accessibility?.computed?.explicitRole ||
        entry?.element?.role ||
        null;
      const name =
        entry?.element?.accessibleName ||
        entry?.element?.accessibility?.computed?.explicitName ||
        null;
      if (!role) return null;
      return (await adapter.findByRole(role, name))
        ? { strategy, locator: `role=${role}${name ? `[name="${name}"]` : ""}` }
        : null;
    }
  } catch {
    return null;
  }
  return null;
};

export const replayEntry = async (adapter, entry, strategies = STRATEGIES) => {
  for (const strategy of strategies) {
    const hit = await tryStrategy(adapter, strategy, entry);
    if (hit) return { success: true, ...hit };
  }
  return { success: false, strategy: null, locator: null };
};

export const replay = async (adapter, entries, options = {}) => {
  const { strategies = STRATEGIES, healedLedgerPath = null } = options;
  const results = [];
  for (let i = 0; i < entries.length; i++) {
    const r = await replayEntry(adapter, entries[i], strategies);
    results.push({ index: i, ...r });
  }
  const found = results.filter((r) => r.success).length;
  const summary = { found, total: entries.length, results };
  if (healedLedgerPath) {
    const ledger = await collectHeals(adapter, entries);
    const write = await writeHealedLedger(healedLedgerPath, ledger);
    summary.healed = { path: write.path, count: write.count, entries: ledger };
  }
  return summary;
};

export const parseCaptureJsonl = (raw) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

// Playwright page adapter. Kept here so `bin/pinchgrab` and tests share
// the same construction shape. The Playwright dependency is loaded
// lazily so the unit test path never pays for it.
export const playwrightAdapter = (page) => ({
  findByCss: async (selector) => {
    const loc = page.locator(selector);
    return (await loc.count()) >= 1 ? loc.first() : null;
  },
  findByXPath: async (xpath) => {
    const loc = page.locator(`xpath=${xpath}`);
    return (await loc.count()) >= 1 ? loc.first() : null;
  },
  findByRole: async (role, name) => {
    const loc = name ? page.getByRole(role, { name }) : page.getByRole(role);
    return (await loc.count()) >= 1 ? loc.first() : null;
  },
});
