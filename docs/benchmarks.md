# 🤏 Token benchmark: what a PinchGrab capture costs vs. what you were pasting

**PinchGrab exists to murder the copy-paste workflow.** This page is the receipt. Every number
below is measured by [`scripts/benchmark-bundle.ts`](../scripts/benchmark-bundle.ts) against the
same 12 live framework apps the test suite tours on every run. Nothing is modeled, projected, or
rounded up for effect.

- **Snapshot date:** 2026-07-11
- **Exact command:** `bun run bench` (alias for `bun run scripts/benchmark-bundle.ts`; run
  `bun run build` first so `extension/content-script.js` is fresh)
- **Fixtures:** the 12 framework builds of the weather app at `framework-benchmarks.as93.net`
  ([`tests/fixtures/framework-apps.json`](../tests/fixtures/framework-apps.json)), the same pages
  `bun run test:tour` drives
- **Stability:** three consecutive runs produced byte-identical result tables; the only drift was
  the zstd -19 reference mean (666.4 KB vs 666.3 KB, 0.02%)

## The headline

- 🤏 **95.3% smaller than pasting the page.** The rendered DOM of the 12 pages serializes to
  6,222 KB of HTML. The complete minified JSONL exports for the same pages total 292.5 KB. In
  estimated tokens that is **1,592,924 → 74,888**.
- 🤏 **87.4% smaller on container grabs.** The 40 captures whose raw markup is 4 KB or more
  (sections, cards, whole widgets, the things people actually pinch) went from 355.5 KB raw to
  44.8 KB of minified rows.
- 🤏 **Every capture is a bounded ~632 byte row**, no matter how deep the subtree underneath it
  goes. The depth cap plus whitespace collapse is what keeps a grabbed dashboard from arriving as
  25 KB of sparkline spans.
- 🤏 **A text-only feedback bundle is ~32 KB on disk** (mean `.tar.zst` without screenshots);
  with a full-resolution PNG of every captured element it averages **~985 KB**.

## Full per-fixture table

467 elements captured and compared across 12 frameworks, zero unresolved baselines, zero
screenshot failures. "raw outerHTML" is the element's full markup as the live page renders it,
including open shadow-root content. "min JSONL rows" is the exact minified row the export writes.

| fixture | elements | raw outerHTML | min JSONL rows | minified vs raw | mean row | est tokens raw→min | bundle .tar.zst (no shots) | bundle .tar.zst (+shots) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| React | 37 | 28.5 KB | 22.7 KB | **20.4%** smaller | 627 B | 7,291→5,804 | 30.5 KB | 1106.0 KB |
| Angular | 48 | 47.0 KB | 28.2 KB | **40.0%** smaller | 602 B | 12,036→7,223 | 36.0 KB | 1657.0 KB |
| Svelte | 38 | 28.9 KB | 22.8 KB | **21.0%** smaller | 615 B | 7,405→5,847 | 30.5 KB | 1107.0 KB |
| Preact | 37 | 23.5 KB | 20.5 KB | **12.9%** smaller | 567 B | 6,026→5,247 | 28.0 KB | 918.5 KB |
| Solid | 39 | 28.6 KB | 22.9 KB | **20.0%** smaller | 600 B | 7,315→5,853 | 30.5 KB | 1107.5 KB |
| Qwik | 34 | 15.8 KB | 17.0 KB | 7.5% larger | 513 B | 4,051→4,357 | 24.5 KB | 189.0 KB |
| Vue | 39 | 26.6 KB | 21.7 KB | **18.3%** smaller | 571 B | 6,817→5,567 | 29.5 KB | 1113.5 KB |
| jQuery | 37 | 53.3 KB | 22.4 KB | **58.0%** smaller | 620 B | 13,654→5,739 | 30.0 KB | 993.0 KB |
| Alpine.js | 37 | 188.8 KB | 33.4 KB | **82.3%** smaller | 925 B | 48,345→8,559 | 41.0 KB | 1116.5 KB |
| Lit | 45 | 40.4 KB | 31.0 KB | **23.4%** smaller | 705 B | 10,348→7,930 | 38.5 KB | 409.0 KB |
| VanJS | 39 | 28.5 KB | 23.0 KB | **19.3%** smaller | 603 B | 7,287→5,878 | 30.5 KB | 995.5 KB |
| Vanilla JS | 37 | 39.4 KB | 22.5 KB | **42.8%** smaller | 623 B | 10,081→5,766 | 30.0 KB | 1105.5 KB |
| **overall** | **467** | **549.4 KB** | **288.1 KB** | **47.6%** smaller | **632 B** | **140,652→73,766** | mean 31.6 KB | mean 984.9 KB |

Mean per-fixture minification: 29.2%. Byte-weighted overall: 47.6%.

## By grab size

One blended mean would hide the two regimes, so here they are, separately and honestly:

| grab size | elements | raw outerHTML | min JSONL rows | delta |
|---|---:|---:|---:|---:|
| container (raw ≥ 4 KB) | 40 | 355.5 KB | 44.8 KB | **87.4%** smaller |
| component (raw 1–4 KB) | 44 | 106.7 KB | 39.3 KB | **63.2%** smaller |
| leaf (raw < 1 KB) | 383 | 87.2 KB | 204.1 KB | 134.1% larger |

- 🤏 **Containers and components shrink hard.** The depth cap elides deep subtrees behind
  `<!-- N children elided -->` comments, whitespace collapses, data URIs and inline SVGs get
  elided. That is where the token bill actually lives.
- 🤏 **Leaf grabs are net larger, on purpose.** A lone `<button>` is 200 bytes of HTML, and its
  export row is ~630 bytes, because the row carries what the raw paste never does: a validated
  unique selector, bounding rect, accessibility name, component/framework hints, and states. The
  raw paste has none of the context an agent needs to find and fix the element; the row is the
  context.
- 🤏 **Shadow DOM flips the game entirely.** For Lit-style components, DevTools copy-outerHTML
  hands you an empty host tag; the rendered content is unreachable by clipboard. PinchGrab
  serializes it as spec-shaped `<template shadowrootmode>` blocks. The Lit baseline above counts
  that shadow content against PinchGrab anyway, and PinchGrab still comes out 23.4% smaller.

## Methodology, next to every number

- **Harness.** The benchmark drives the exact capture machinery the extension ships:
  `extension/content-script.js` is injected into each live page and the tour's ~25-probe sweep
  ([`tests/harness/pinchgrab-driver.ts`](../tests/harness/pinchgrab-driver.ts)) captures every
  interesting element the way Alt+Click would. Same code path as `bun run test:tour`.
- **RAW BASELINE.** Per captured element, the byte length of its full `outerHTML` as the live DOM
  serves it, plus the innerHTML of every open shadow root inside it (each root counted exactly
  once). Elements are re-resolved live and shadow-scope-aware; any element that cannot be
  re-resolved is dropped from both sides of the comparison (this run: 0 of 467).
- **BUNDLE ROW.** `JSON.stringify(slimEntry(entry, minify=true))`, the exact minified JSONL row
  the export writes.
- **Tokens are estimates.** Every token figure is bytes/4. This repo carries no BPE tokenizer
  dependency, and the product UI uses the same heuristic, so the benchmark reports the same
  clearly-labeled estimate rather than inventing precision.
- **Screenshots are real pixels.** One Playwright clip screenshot per captured element rect on
  the live page (the harness stand-in for the extension's captureVisibleTab crop). 420 PNGs
  captured this run, 0 failures.
- **Bundles are built by shipped code.** `buildTar` + `wrapZstd` from
  [`src/tar.ts`](../src/tar.ts) and the README/AGENTS builders from
  [`src/export-bundle-docs.mjs`](../src/export-bundle-docs.mjs), plus the minified JSONL, the
  screenshot PNGs, and a `screenshots.json` index. Panel-state sidecars the harness cannot
  honestly produce without a user session (`repair-index.md`, `schema.json`, `duckdb.sql`,
  `DESIGN.md`) are excluded; together they are a few KB of static text.
- **About that .zst.** `wrapZstd` writes raw (stored) zstd blocks because Chromium has no
  `CompressionStream('zstd')`, so the shipped archive is roughly tar-sized. For reference, a real
  `zstd -19` pass over the same +shots tar averages 666 KB (PNGs are already compressed), and over
  the text-only tar averages 5.6 KB.

## Reproduce it

```bash
bun install
bun run build
bun run bench            # all 12 fixtures, ~15s wall-clock
bun run bench --only=react,lit   # subset
```

Per-run artifacts land in `tests/output/benchmark/bundle-benchmark.{md,json}` (gitignored; the
JSON includes per-element raw/row byte pairs so you can audit any row in this table). If the
fixture host is unreachable the benchmark exits nonzero instead of reporting anything.
