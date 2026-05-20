// Self-healing selector chain.
//
// When the primary CSS selector for a captured entry fails on replay,
// walk a deterministic fallback chain and record what won. The ledger
// emitted via `writeHealedLedger` is the durable record of every heal —
// downstream tooling re-ranks selectors or rewrites the capture using
// `winning_selector` as the new primary.
//
// The chain mirrors `src/replay.mjs` strategy order:
//   1. css        (primary — never appears as a fallback)
//   2. xpath      (structural fallback)
//   3. a11y role+name (semantic fallback, last resort)
//
// Page adapters are duck-typed; production wraps a Playwright Page,
// tests use an in-memory map. The contract is identical to replay.mjs.

import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const FALLBACK_STRATEGIES = ["xpath", "a11y"];

const primarySelector = (entry) => entry?.selectors?.css ?? null;

const rolePair = (entry) => {
  const role =
    entry?.element?.accessibility?.computed?.computedRole ||
    entry?.element?.accessibility?.computed?.explicitRole ||
    entry?.element?.role ||
    null;
  const name =
    entry?.element?.accessibleName ||
    entry?.element?.accessibility?.computed?.explicitName ||
    null;
  return { role, name };
};

const tryFallback = async (adapter, strategy, entry) => {
  try {
    if (strategy === "xpath") {
      const xp = entry?.selectors?.xpath;
      if (!xp) return null;
      return (await adapter.findByXPath(xp)) ? { strategy, locator: xp } : null;
    }
    if (strategy === "a11y") {
      const { role, name } = rolePair(entry);
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

// Try the primary CSS selector; on miss, walk the fallback chain.
// Returns a HealResult: { healed: bool, strategy, original_selector,
// winning_selector } when the primary missed and a fallback rescued
// the entry; { healed: false, ... } when the primary hit; null when
// nothing in the chain matched.
export const healEntry = async (adapter, entry, fallbacks = FALLBACK_STRATEGIES) => {
  const original = primarySelector(entry);
  if (original) {
    try {
      if (await adapter.findByCss(original)) {
        return { healed: false, strategy: "css", original_selector: original, winning_selector: original };
      }
    } catch {
      // primary threw — treat as miss and continue down the chain
    }
  }
  for (const strategy of fallbacks) {
    const hit = await tryFallback(adapter, strategy, entry);
    if (hit) {
      return {
        healed: original !== null,
        strategy: hit.strategy,
        original_selector: original,
        winning_selector: hit.locator,
      };
    }
  }
  return null;
};

// Build a ledger of every heal observed across a capture set. Entries
// that resolved via the primary CSS are NOT recorded — the ledger is
// signal about what DRIFTED, not a full replay log.
export const collectHeals = async (adapter, entries, fallbacks = FALLBACK_STRATEGIES) => {
  const ledger = [];
  for (let i = 0; i < entries.length; i++) {
    const result = await healEntry(adapter, entries[i], fallbacks);
    if (!result) continue;
    if (!result.healed) continue;
    ledger.push({
      index: i,
      sequence: entries[i]?.sequence ?? null,
      original_selector: result.original_selector,
      winning_selector: result.winning_selector,
      strategy: result.strategy,
    });
  }
  return ledger;
};

// Persist the ledger as newline-delimited JSON. Creates parent dirs as
// needed. An empty ledger writes an empty file — callers can stat the
// path to detect "no drift observed".
export const writeHealedLedger = async (path, ledger) => {
  await mkdir(dirname(path), { recursive: true });
  const body = ledger.map((row) => JSON.stringify(row)).join("\n");
  await writeFile(path, body.length ? `${body}\n` : "", "utf-8");
  return { path, count: ledger.length };
};

// Streaming append variant for long-running replays where the ledger
// should be observable line-by-line as the run progresses.
export const appendHealedLine = async (path, row) => {
  await mkdir(dirname(path), { recursive: true });
  await appendFile(path, `${JSON.stringify(row)}\n`, "utf-8");
};
