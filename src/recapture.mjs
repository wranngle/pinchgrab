// Recapture: re-locate exported captures on a live page and screenshot them.
//
// This is the verification leg of the Send-to-Agent loop (AGENT-PROTOCOL.md
// §verify): after a coding agent applies fixes, `pinchgrab recapture` walks
// the bundle's JSONL, re-locates every commented selector with the SAME
// CSS→XPath→a11y fallback chain the replayer uses (src/replay.mjs), writes
// a fresh PNG per located element, and records an append-only run under
// recaptures/<runId>/ so the agent can diff "after" against the bundle's
// original screenshots/ and update its work manifest.
//
// Row-shape tolerance: accepts both the v2 export rows the extension emits
// (flat `selector` / `role` / `accessibleName`, leading `manifest` row) and
// the legacy v3 `selector-capture-entry` shape (`selectors.css`,
// `element.accessibility…`) that the replay tooling grew up on.
//
// Determinism: identical inputs (rows + runId + ts) → identical manifest
// bytes. The CLI stamps runId/ts; nothing here calls Date.now().

import { mkdirSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { replayEntry } from "./replay.mjs";

// ─── Row-shape shim ─────────────────────────────────────────────────────────

/** True when the row already looks like a legacy v3 capture entry. */
const isLegacyEntry = (row) => Boolean(row?.selectors?.css || row?.selectors?.xpath);

/**
 * Map one bundle row (v2 export or legacy v3) onto the entry shape
 * `replayEntry` expects: `{selectors:{css,xpath}, element:{role,
 * accessibleName,…}}`.
 */
export const toReplayEntry = (row) => {
  if (isLegacyEntry(row)) return row;
  return {
    selectors: {
      css: row?.selector ?? null,
      xpath: row?._audit?.xpath ?? null,
    },
    element: {
      role: row?.role ?? null,
      accessibleName: row?.accessibleName ?? null,
      id: row?.id ?? null,
      testId: row?.testId ?? null,
    },
  };
};

/**
 * Parse a bundle JSONL (or legacy capture JSONL) into its row families.
 * Bad lines are skipped, mirroring the extension's tolerant import.
 */
export const parseBundleJsonl = (raw) => {
  const manifest = [];
  const selectors = [];
  const feedback = [];
  const pages = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let row;
    try {
      row = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (row.type === "manifest") manifest.push(row);
    else if (row.type === "feedback") feedback.push(row);
    else if (row.type === "page") pages.push(row);
    else if (row.type === "selector" || isLegacyEntry(row)) selectors.push(row);
  }
  return { manifest: manifest[0] ?? null, selectors, feedback, pages };
};

/**
 * Pick the selector rows a recapture run should verify. Default: only
 * comment-bearing captures (that is what the operator complained about);
 * `all: true` recaptures everything. Legacy v3 entries carry feedback
 * inline, so a non-empty `feedback` field marks them commented.
 */
export const selectTargets = (parsed, { all = false } = {}) => {
  if (all) return parsed.selectors;
  const commented = new Set(
    parsed.feedback.map((f) => f.parentUid).filter(Boolean),
  );
  return parsed.selectors.filter((row) => {
    if (row.uid && commented.has(row.uid)) return true;
    // Legacy inline feedback (string or non-empty array).
    const fb = row.feedback;
    return Boolean(typeof fb === "string" ? fb.trim() : Array.isArray(fb) && fb.length);
  });
};

const feedbackUidsFor = (parsed, row) =>
  parsed.feedback.filter((f) => f.parentUid && f.parentUid === row.uid).map((f) => f.uid);

const originalScreenshotFor = (row) =>
  row?.screenshot?.element ?? row?.screenshot?.group ?? row?.screenshot?.page ?? null;

// ─── Recapture run ──────────────────────────────────────────────────────────

/**
 * Run a recapture pass.
 *
 * @param adapter  replay adapter (see src/replay.mjs); its findBy* methods
 *                 must return the located handle. When the handle exposes
 *                 `.screenshot({path})` (a Playwright locator does), each
 *                 located element is shot to recaptures/<runId>/screenshots/.
 * @param parsed   output of parseBundleJsonl
 * @param opts     {url, outDir, runId, ts, all?, workspaceDir?, sourceBundle?}
 *                 `outDir` is the run directory (…/recaptures/<runId>);
 *                 `ts` is the ISO stamp for the manifest header;
 *                 `workspaceDir` (when given) receives an appended
 *                 `recapture-run` row in its work-manifest.jsonl.
 * @returns summary {runId, url, located, total, screenshots, results, manifestPath}
 */
export const recapture = async (adapter, parsed, opts) => {
  const { url, outDir, runId, ts, all = false, workspaceDir = null, sourceBundle = null } = opts;
  const targets = selectTargets(parsed, { all });
  const shotsDir = join(outDir, "screenshots");
  mkdirSync(shotsDir, { recursive: true });

  const results = [];
  let located = 0;
  let screenshots = 0;
  for (const row of targets) {
    const entry = toReplayEntry(row);
    const hit = await replayEntry(adapter, entry);
    const uid = row.uid ?? `n${row.n ?? row.sequence ?? results.length}`;
    const result = {
      type: "recapture",
      uid,
      feedbackUids: feedbackUidsFor(parsed, row),
      selector: entry.selectors?.css ?? null,
      strategy: hit.strategy,
      located: hit.success,
      screenshot: null,
      originalScreenshot: originalScreenshotFor(row),
    };
    if (hit.success) {
      located++;
      // Re-resolve through the winning strategy to get the handle back
      // (replayEntry returns only the strategy + locator string).
      let handle = null;
      try {
        if (hit.strategy === "css") handle = await adapter.findByCss(entry.selectors.css);
        else if (hit.strategy === "xpath") handle = await adapter.findByXPath(entry.selectors.xpath);
        else if (hit.strategy === "a11y") handle = await adapter.findByRole(entry.element.role, entry.element.accessibleName);
      } catch {
        handle = null;
      }
      if (handle && typeof handle.screenshot === "function") {
        const shotPath = join(shotsDir, `${uid}.png`);
        try {
          await handle.screenshot({ path: shotPath });
          result.screenshot = `screenshots/${uid}.png`;
          screenshots++;
        } catch {
          // Element may be zero-sized / detached mid-shot; locating it is
          // still the primary signal, so a failed PNG doesn't fail the row.
        }
      }
    }
    results.push(result);
  }

  const header = {
    v: 1,
    type: "recapture-manifest",
    runId,
    ts,
    sourceBundle,
    bundleId: parsed.manifest?.bundleId ?? null,
    url,
    counts: { located, total: targets.length, screenshots },
  };
  const manifestPath = join(outDir, "recapture-manifest.jsonl");
  writeFileSync(
    manifestPath,
    [header, ...results].map((r) => JSON.stringify(r)).join("\n") + "\n",
  );

  if (workspaceDir) {
    const ledger = join(workspaceDir, "work-manifest.jsonl");
    const runRow = {
      v: 1,
      type: "recapture-run",
      runId,
      ts,
      bundleId: header.bundleId,
      located,
      total: targets.length,
    };
    if (existsSync(ledger)) appendFileSync(ledger, JSON.stringify(runRow) + "\n");
    else writeFileSync(ledger, JSON.stringify(runRow) + "\n");
  }

  return { runId, url, located, total: targets.length, screenshots, results, manifestPath };
};
