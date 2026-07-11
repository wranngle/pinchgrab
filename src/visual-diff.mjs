// Visual regression baseline — DOM snapshot diff.
//
// Pinchgrab captures already record a self-healing selector chain
// (round-1 PR #3, `src/healing.mjs`). The selector chain rescues a
// replay when the underlying DOM moves; this module is the next layer
// up — it tells the operator which captured *steps* now resolve to a
// different node than the baseline, so a heal that succeeds silently
// is still surfaced as a visual regression.
//
// A DOM snapshot is one line of JSONL:
//   { schema: "dom-snapshot", version: 1, sequence: <int>,
//     selector: <string>, outerHTML: <string> }
//
// Replay reads a baseline file + a current file, joins on `sequence`,
// and classifies each pair as "unchanged" | "changed" | "added"
// (current only) | "removed" (baseline only). The Markdown report at
// `out/visual-diff.md` lists every non-unchanged step with the before
// and after outerHTML so a reviewer can eyeball the drift.
//
// Output is deterministic: identical input → byte-identical Markdown.
// Steps are ordered by `sequence` ascending; trailing newline is
// always present.
//
// Programmatic API:
//   parseDomSnapshots(raw)               → entries
//   diffSnapshots(baseline, current)     → step results
//   renderVisualDiffMarkdown(diff, opts) → string
//   replayVisualDiff(baselinePath, currentPath, opts) → { outPath, diff }
//
// CLI:
//   node src/visual-diff.mjs <baseline.jsonl> <current.jsonl> [out.md]
//     Defaults out path to `out/visual-diff.md`. Exits 0 always —
//     the report itself is the signal, not the exit code, so the
//     CLI is composable with downstream graders.

import { mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { argv, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

export const DOM_SNAPSHOT_SCHEMA = "dom-snapshot";

export const parseDomSnapshots = (raw) => {
  const out = [];
  const lines = String(raw).split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (err) {
      throw new Error(`line ${i + 1}: invalid JSON — ${err.message}`);
    }
    if (entry?.schema !== DOM_SNAPSHOT_SCHEMA) {
      throw new Error(
        `line ${i + 1}: not a dom-snapshot (schema=${entry?.schema ?? "missing"})`,
      );
    }
    if (typeof entry.sequence !== "number" || !Number.isFinite(entry.sequence)) {
      throw new Error(`line ${i + 1}: missing numeric sequence`);
    }
    if (typeof entry.outerHTML !== "string") {
      throw new Error(`line ${i + 1}: missing outerHTML string`);
    }
    out.push(entry);
  }
  return out;
};

const indexBySequence = (entries) => {
  const map = new Map();
  for (const entry of entries) {
    if (map.has(entry.sequence)) {
      throw new Error(`duplicate sequence ${entry.sequence}`);
    }
    map.set(entry.sequence, entry);
  }
  return map;
};

export const diffSnapshots = (baseline, current) => {
  const base = indexBySequence(baseline);
  const next = indexBySequence(current);
  const sequences = new Set([...base.keys(), ...next.keys()]);
  const results = [];
  for (const sequence of sequences) {
    const b = base.get(sequence) ?? null;
    const c = next.get(sequence) ?? null;
    let status;
    if (b && c) {
      status = b.outerHTML === c.outerHTML ? "unchanged" : "changed";
    } else if (c) {
      status = "added";
    } else {
      status = "removed";
    }
    results.push({
      sequence,
      selector: (c ?? b)?.selector ?? null,
      status,
      baseline: b?.outerHTML ?? null,
      current: c?.outerHTML ?? null,
    });
  }
  results.sort((a, b) => a.sequence - b.sequence);
  return results;
};

const fenceForHTML = (html) => {
  const body = html ?? "";
  return ["```html", body, "```"].join("\n");
};

export const renderVisualDiffMarkdown = (diff, opts = {}) => {
  const title = opts.title ?? "Visual regression report";
  const changed = diff.filter((d) => d.status !== "unchanged");
  const unchangedCount = diff.length - changed.length;
  const lines = [];
  lines.push(`# ${title}`);
  lines.push("");
  lines.push(
    `Steps compared: ${diff.length} — changed: ${changed.length}, unchanged: ${unchangedCount}.`,
  );
  lines.push("");
  if (changed.length === 0) {
    lines.push("No drift detected.");
    lines.push("");
    return lines.join("\n");
  }
  lines.push("## Changed steps");
  lines.push("");
  for (const step of changed) {
    lines.push(`### Step ${step.sequence} — ${step.status}`);
    lines.push("");
    lines.push(`Selector: \`${step.selector ?? "(none)"}\``);
    lines.push("");
    lines.push("Baseline:");
    lines.push("");
    lines.push(fenceForHTML(step.baseline));
    lines.push("");
    lines.push("Current:");
    lines.push("");
    lines.push(fenceForHTML(step.current));
    lines.push("");
  }
  return lines.join("\n");
};

export const replayVisualDiff = (baselinePath, currentPath, opts = {}) => {
  const outPath = resolve(opts.outPath ?? "out/visual-diff.md");
  const baseline = parseDomSnapshots(readFileSync(resolve(baselinePath), "utf-8"));
  const current = parseDomSnapshots(readFileSync(resolve(currentPath), "utf-8"));
  const diff = diffSnapshots(baseline, current);
  const md = renderVisualDiffMarkdown(diff, { title: opts.title });
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, md, "utf-8");
  return { outPath, diff, markdown: md };
};

const usage = `pinchgrab visual-diff — DOM snapshot regression report

Usage:
  node src/visual-diff.mjs <baseline.jsonl> <current.jsonl> [out.md]

Reads two dom-snapshot JSONL files, joins by sequence, and writes a
Markdown report listing every step whose outerHTML drifted. Defaults
out path to out/visual-diff.md.
`;

const cli = () => {
  const [, , baseline, current, outArg] = argv;
  if (!baseline || !current || baseline === "-h" || baseline === "--help") {
    stdout.write(usage);
    exit(baseline && current ? 0 : 2);
  }
  const { outPath, diff } = replayVisualDiff(baseline, current, {
    outPath: outArg ?? "out/visual-diff.md",
  });
  const changed = diff.filter((d) => d.status !== "unchanged").length;
  stdout.write(`${outPath}\n`);
  stdout.write(`${changed} changed step(s) of ${diff.length} total\n`);
};

// Compare realpaths, not raw argv[1] — see bin/pinchgrab for why a raw
// URL comparison silently breaks when this file is reached via a symlink.
const isDirectRun = (() => {
  try {
    return fileURLToPath(import.meta.url) === realpathSync(argv[1] ?? "");
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  try {
    cli();
  } catch (err) {
    stderr.write(`${err?.stack || String(err)}\n`);
    exit(1);
  }
}
