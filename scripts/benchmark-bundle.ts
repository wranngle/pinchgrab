// Bundle token-minification benchmark. Measures, on the SAME live pages the
// framework tour drives (tests/fixtures/framework-apps.json), how many bytes /
// estimated tokens PinchGrab's minified export saves versus the raw outerHTML
// a human would otherwise copy-paste into a chat, and what a whole export
// bundle actually weighs on disk.
//
// Usage: `bun run scripts/benchmark-bundle.ts [--only=react,vue] [--headless=false] [--concurrency=4]`
//
// Methodology (every number below is measured, nothing is assumed):
//   RAW BASELINE  — for each captured element, the page's own full
//                   `outerHTML` string as served PLUS the content of every
//                   open shadow root inside it (each root's innerHTML counted
//                   exactly once, recursively) — i.e. the markup that renders
//                   what the user sees. Resolution against the live DOM is
//                   shadow-scope-aware, same strategy as the tour validator.
//                   This is the conservative floor of what a human pastes:
//                   real users usually paste the parent container or the
//                   whole page, both larger. (For shadow-DOM components a
//                   human's clipboard cannot even reach this content —
//                   DevTools copy-outerHTML returns the empty host tag.)
//   BUNDLE ROW    — `JSON.stringify(slimEntry(entry, true))`, i.e. the exact
//                   minified JSONL row the export writes (same slimEntry the
//                   tour harness mirrors from sidepanel.ts).
//   TOKENS        — ESTIMATED as bytes/4. This repo carries no BPE tokenizer
//                   dependency, so every token figure here (and in the
//                   product UI) is the chars/4 heuristic, clearly labeled.
//   SCREENSHOTS   — real Playwright clip screenshots of each captured
//                   element's rect on the live page (the harness stand-in
//                   for the extension's captureVisibleTab crop).
//   BUNDLE        — assembled with the same `buildTar` + `wrapZstd` writers
//                   the extension ships (src/tar.ts) and the same README /
//                   AGENTS doc builders (src/export-bundle-docs.mjs), plus
//                   the minified JSONL and the screenshots index. Panel-state
//                   sidecars the harness cannot honestly produce (repair
//                   index from user feedback, schema.json, duckdb.sql,
//                   DESIGN.md) are excluded and noted; together they are a
//                   few KB of static text. `wrapZstd` writes raw (stored)
//                   zstd blocks because Chromium has no
//                   CompressionStream('zstd'); a real `zstd -19` pass over
//                   the same tar is reported alongside for reference.
//
// Elements whose raw baseline cannot be re-resolved live (SPA re-render
// between sweep and measure) are excluded from BOTH sides of the comparison
// and counted, so raw vs minified stays apples-to-apples.

import fs from 'node:fs';
import path from 'node:path';
import {PinchgrabDriver, type TourReport, type Capture, exportJsonl, slimEntry} from '../tests/harness/pinchgrab-driver';
import {buildTar, wrapZstd, type TarEntry} from '../src/tar.ts';
import {buildBundleAgentsMd, buildBundleReadmeMd} from '../src/export-bundle-docs.mjs';

const ROOT = path.resolve(process.cwd());
const FIXTURE = path.resolve(ROOT, 'tests/fixtures/framework-apps.json');
const OUT_DIR = path.resolve(ROOT, 'tests/output/benchmark');

type FrameworkEntry = {slug: string; label: string; url: string};
const catalog: {frameworks: FrameworkEntry[]} = JSON.parse(fs.readFileSync(FIXTURE, 'utf-8'));

const argMap = (() => {
  const out: Record<string, string> = {};
  for (const a of process.argv.slice(2)) {
    const m = /^--([^=]+)(?:=(.*))?$/.exec(a);
    if (m) out[m[1]!] = m[2] ?? 'true';
  }
  return out;
})();

const onlySet = argMap.only ? new Set(argMap.only.split(',').map((s) => s.trim())) : null;
const headless = argMap.headless !== 'false';
const concurrency = Math.max(1, Math.min(12, Math.trunc(Number(argMap.concurrency ?? 4))));

const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
// Token ESTIMATE — chars/4 heuristic; no BPE tokenizer dep exists in this
// repo, so this mirrors the product's own meter (sidepanel.ts tokenCount).
const estTokens = (bytes: number) => Math.ceil(bytes / 4);

// ---- Per-run measurement stores (keyed by framework label) -----------------
type RawBaseline = {uid: string; bytes: number};
const rawBaselines = new Map<string, Map<string, number>>(); // framework -> uid -> raw bytes
const pageHtmlBytes = new Map<string, number>();             // framework -> whole-document outerHTML bytes
const screenshots = new Map<string, Map<string, Uint8Array>>(); // framework -> uid -> png
const shotFailures = new Map<string, number>();

// afterSweep hook: runs while the tour page is still live. Measures the raw
// outerHTML baseline for every captured element (shadow-scope-aware, same
// resolution strategy as the tour validator) and takes a real clip
// screenshot of each element rect.
const measure = async (page: import('playwright').Page, report: TourReport): Promise<void> => {
  const reqs = report.captures
    .filter((c) => c.entry?.selector && c.entry?.uid)
    .map((c) => ({uid: c.entry.uid, selector: c.entry.selector, shadowHost: c.entry.shadowHost}));

  // Plain-string page function (same __name/tsx constraint as the driver).
  const measureSource = `(function(reqs){
    var enc = new TextEncoder();
    var allRoots = [document];
    var stack = [document];
    while (stack.length) {
      var node = stack.pop();
      var els = node.querySelectorAll('*');
      for (var i = 0; i < els.length; i++) {
        var sr = els[i].shadowRoot;
        if (sr) { allRoots.push(sr); stack.push(sr); }
      }
    }
    function resolveEl(sel, shadowHostSel) {
      if (shadowHostSel) {
        for (var r = 0; r < allRoots.length; r++) {
          try {
            var host = allRoots[r].querySelector(shadowHostSel);
            if (host && host.shadowRoot) {
              var found = host.shadowRoot.querySelector(sel);
              if (found) return found;
            }
          } catch (e) { /* ignore */ }
        }
        return null;
      }
      for (var r2 = 0; r2 < allRoots.length; r2++) {
        try {
          var el = allRoots[r2].querySelector(sel);
          if (el) return el;
        } catch (e) { /* ignore */ }
      }
      return null;
    }
    // Raw bytes = outerHTML + every open shadow root's innerHTML inside the
    // subtree, counted exactly once per root (outerHTML/innerHTML never
    // include shadow content, so recursing one level per host is exact).
    function rawServedBytes(el) {
      var total = enc.encode(el.outerHTML).length;
      // querySelectorAll never crosses shadow boundaries, so each element
      // belongs to exactly one scope and every shadow root is counted once.
      function addShadowContent(scope) {
        var els = scope.querySelectorAll('*');
        for (var i = 0; i < els.length; i++) {
          var sr = els[i].shadowRoot;
          if (sr) { total += enc.encode(sr.innerHTML).length; addShadowContent(sr); }
        }
      }
      if (el.shadowRoot) { total += enc.encode(el.shadowRoot.innerHTML).length; addShadowContent(el.shadowRoot); }
      addShadowContent(el);
      return total;
    }
    var pageBytes = rawServedBytes(document.documentElement);
    var out = {byUid: {}, pageBytes: pageBytes};
    for (var k = 0; k < reqs.length; k++) {
      var el2 = resolveEl(reqs[k].selector, reqs[k].shadowHost);
      if (!el2) continue;
      out.byUid[reqs[k].uid] = rawServedBytes(el2);
    }
    return out;
  })(${JSON.stringify(reqs)})`;
  const measured: {byUid: Record<string, number>; pageBytes: number} = await page.evaluate(measureSource);
  rawBaselines.set(report.framework, new Map(Object.entries(measured.byUid)));
  pageHtmlBytes.set(report.framework, measured.pageBytes);

  // Real element screenshots — clip the capture rect, clamped to viewport.
  const shots = new Map<string, Uint8Array>();
  let failures = 0;
  const vp = page.viewportSize() ?? {width: 1280, height: 800};
  for (const c of report.captures) {
    const e = c.entry;
    if (!e?.uid || !e.rect) continue;
    const x = Math.max(0, e.rect.x);
    const y = Math.max(0, e.rect.y);
    const w = Math.min(e.rect.w, vp.width - x);
    const h = Math.min(e.rect.h, vp.height - y);
    if (w < 1 || h < 1) continue;
    try {
      const png = await page.screenshot({clip: {x, y, width: w, height: h}});
      shots.set(e.uid, new Uint8Array(png));
    } catch {
      failures++;
    }
  }
  screenshots.set(report.framework, shots);
  shotFailures.set(report.framework, failures);
};

// ---- Bundle assembly (mirrors sidepanel onExportZip's tar layout) ----------
type BundleSizes = {
  tarNoShots: number;
  tarZstNoShots: number;
  tarWithShots: number;
  tarZstWithShots: number;
  realZstd19NoShots: number | null;
  realZstd19WithShots: number | null;
  shotCount: number;
  shotBytes: number;
};

const realZstd = (data: Uint8Array): number | null => {
  // Reference number only: what the same tar weighs under an actual zstd -19
  // pass (the extension itself ships raw-block frames — see src/tar.ts).
  if (typeof Bun === 'undefined') return null;
  try {
    return Bun.zstdCompressSync(data, {level: 19}).length;
  } catch {
    return null;
  }
};

const buildBundle = (slug: string, captures: Capture[], shots: Map<string, Uint8Array>): BundleSizes => {
  const jsonlName = `${slug}.jsonl`;
  const min = exportJsonl(captures).min;
  const baseEntries: TarEntry[] = [
    {name: 'README.md', data: buildBundleReadmeMd({jsonlName})},
    {name: 'AGENTS.md', data: buildBundleAgentsMd({jsonlName})},
    {name: jsonlName, data: min},
  ];
  const shotEntries: TarEntry[] = [];
  const byUid: Record<string, {element: string}> = {};
  const files: string[] = [];
  for (const [uid, png] of shots) {
    const file = `screenshots/${uid}.png`;
    shotEntries.push({name: file, data: png});
    byUid[uid] = {element: file};
    files.push(file);
  }
  const index = JSON.stringify({v: 2, kind: 'pinchgrab/screenshots-index', byUid, files}, null, 2);

  const tarNoShots = buildTar(baseEntries);
  const tarWithShots = buildTar([...baseEntries, {name: 'screenshots.json', data: index}, ...shotEntries]);
  let shotBytes = 0;
  for (const png of shots.values()) shotBytes += png.length;
  return {
    tarNoShots: tarNoShots.length,
    tarZstNoShots: wrapZstd(tarNoShots).length,
    tarWithShots: tarWithShots.length,
    tarZstWithShots: wrapZstd(tarWithShots).length,
    realZstd19NoShots: realZstd(tarNoShots),
    realZstd19WithShots: realZstd(tarWithShots),
    shotCount: shots.size,
    shotBytes,
  };
};

// ---- Per-fixture result row -------------------------------------------------
// Size buckets: the minification story differs by grab size. Container /
// component grabs (the "grab this card / section" gesture) carry deep
// subtrees the depth-cap elides; leaf grabs (a lone button) cost a bounded
// metadata row that can exceed their tiny raw HTML. Reporting one blended
// mean would hide both truths, so buckets are first-class.
type Bucket = {label: string; min: number; count: number; rawBytes: number; rowBytes: number};
const makeBuckets = (): Bucket[] => [
  {label: 'container (raw ≥ 4 KB)', min: 4096, count: 0, rawBytes: 0, rowBytes: 0},
  {label: 'component (raw 1–4 KB)', min: 1024, count: 0, rawBytes: 0, rowBytes: 0},
  {label: 'leaf (raw < 1 KB)', min: 0, count: 0, rawBytes: 0, rowBytes: 0},
];

type ElementRecord = {uid: string; probe?: string; tag: string; selector: string; rawBytes: number; rowBytes: number};

type FixtureResult = {
  slug: string;
  framework: string;
  url: string;
  captures: number;
  comparedElements: number;
  unresolvedBaselines: number;
  rawBytes: number;
  minRowBytes: number;
  meanRowBytes: number;
  minificationPct: number; // 1 - min/raw over compared elements
  rawTokensEst: number;
  minTokensEst: number;
  jsonlFileBytes: number;  // whole minified JSONL file incl. manifest + page rows
  pageHtmlBytes: number;
  screenshotFailures: number;
  buckets: Bucket[];
  elements: ElementRecord[];
  bundle: BundleSizes;
};

const summarize = (slug: string, r: TourReport): FixtureResult => {
  const baselines = rawBaselines.get(r.framework) ?? new Map<string, number>();
  const shots = screenshots.get(r.framework) ?? new Map<string, Uint8Array>();
  let rawBytes = 0;
  let minRowBytes = 0;
  let compared = 0;
  let unresolved = 0;
  const buckets = makeBuckets();
  const elements: ElementRecord[] = [];
  for (const c of r.captures) {
    const e = c.entry;
    if (!e?.selector || !e.uid) continue;
    const raw = baselines.get(e.uid);
    if (raw === undefined) { unresolved++; continue; }
    const row = Buffer.byteLength(JSON.stringify(slimEntry(e, true)), 'utf-8');
    rawBytes += raw;
    minRowBytes += row;
    compared++;
    const bucket = buckets.find((b) => raw >= b.min)!;
    bucket.count++;
    bucket.rawBytes += raw;
    bucket.rowBytes += row;
    elements.push({uid: e.uid, probe: c.probe, tag: e.tag, selector: e.selector, rawBytes: raw, rowBytes: row});
  }
  return {
    slug,
    framework: r.framework,
    url: r.url,
    captures: r.captureCount,
    comparedElements: compared,
    unresolvedBaselines: unresolved,
    rawBytes,
    minRowBytes,
    meanRowBytes: compared ? Math.round(minRowBytes / compared) : 0,
    minificationPct: rawBytes ? 1 - (minRowBytes / rawBytes) : 0,
    rawTokensEst: estTokens(rawBytes),
    minTokensEst: estTokens(minRowBytes),
    jsonlFileBytes: r.jsonlMinBytes,
    pageHtmlBytes: pageHtmlBytes.get(r.framework) ?? 0,
    screenshotFailures: shotFailures.get(r.framework) ?? 0,
    buckets,
    elements,
    bundle: buildBundle(slug, r.captures, shots),
  };
};

// ---- Markdown / JSON emit ----------------------------------------------------
const buildMarkdown = (rows: FixtureResult[], wallMs: number): string => {
  const totRaw = rows.reduce((a, r) => a + r.rawBytes, 0);
  const totMin = rows.reduce((a, r) => a + r.minRowBytes, 0);
  const totCompared = rows.reduce((a, r) => a + r.comparedElements, 0);
  const meanPct = rows.reduce((a, r) => a + r.minificationPct, 0) / (rows.length || 1);
  const meanRow = totCompared ? Math.round(totMin / totCompared) : 0;
  const meanBundleNoShots = Math.round(rows.reduce((a, r) => a + r.bundle.tarZstNoShots, 0) / (rows.length || 1));
  const meanBundleShots = Math.round(rows.reduce((a, r) => a + r.bundle.tarZstWithShots, 0) / (rows.length || 1));
  const lines: string[] = [];
  lines.push('# PinchGrab bundle benchmark: measured results');
  lines.push('');
  lines.push(`Run: ${new Date().toISOString()} · ${rows.length} fixtures · wall-clock ${Math.round(wallMs / 1000)}s`);
  lines.push('Command: `bun run scripts/benchmark-bundle.ts`');
  lines.push('Tokens are ESTIMATES (bytes/4 heuristic; this repo has no BPE tokenizer dependency).');
  lines.push('');
  lines.push('| fixture | elements | raw outerHTML | min JSONL rows | minified vs raw | mean row | est tokens raw→min | bundle .tar.zst (no shots) | bundle .tar.zst (+shots) |');
  lines.push('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
  for (const r of rows) {
    lines.push(`| ${r.framework} | ${r.comparedElements} | ${kb(r.rawBytes)} | ${kb(r.minRowBytes)} | **${pct(r.minificationPct)}** smaller | ${r.meanRowBytes} B | ${r.rawTokensEst.toLocaleString()}→${r.minTokensEst.toLocaleString()} | ${kb(r.bundle.tarZstNoShots)} | ${kb(r.bundle.tarZstWithShots)} |`);
  }
  lines.push(`| **overall** | **${totCompared}** | **${kb(totRaw)}** | **${kb(totMin)}** | **${pct(1 - totMin / totRaw)}** smaller | **${meanRow} B** | **${estTokens(totRaw).toLocaleString()}→${estTokens(totMin).toLocaleString()}** | mean ${kb(meanBundleNoShots)} | mean ${kb(meanBundleShots)} |`);
  lines.push('');
  lines.push(`Mean per-fixture minification: ${pct(meanPct)}. Byte-weighted overall: ${pct(1 - totMin / totRaw)}.`);
  lines.push('');

  // Bucketed view — blended means hide the two regimes (deep container
  // grabs shrink hard; leaf grabs pay a bounded metadata row).
  lines.push('## By grab size (aggregated across fixtures)');
  lines.push('');
  lines.push('| grab size | elements | raw outerHTML | min JSONL rows | delta |');
  lines.push('|---|---:|---:|---:|---:|');
  const agg = makeBuckets();
  for (const r of rows) {
    for (let i = 0; i < agg.length; i++) {
      agg[i]!.count += r.buckets[i]!.count;
      agg[i]!.rawBytes += r.buckets[i]!.rawBytes;
      agg[i]!.rowBytes += r.buckets[i]!.rowBytes;
    }
  }
  for (const b of agg) {
    if (!b.count) continue;
    const delta = 1 - (b.rowBytes / b.rawBytes);
    const word = delta >= 0 ? `**${pct(delta)}** smaller` : `${pct(-delta)} larger`;
    lines.push(`| ${b.label} | ${b.count} | ${kb(b.rawBytes)} | ${kb(b.rowBytes)} | ${word} |`);
  }
  lines.push('');

  // Whole-page paste comparison — the other realistic human baseline is
  // pasting the entire page HTML once.
  const totPage = rows.reduce((a, r) => a + r.pageHtmlBytes, 0);
  const totJsonl = rows.reduce((a, r) => a + r.jsonlFileBytes, 0);
  lines.push(`Whole-page paste baseline: the rendered DOM of the ${rows.length} pages serializes to ${kb(totPage)} of HTML (incl. open shadow content); the complete minified JSONL exports for the same pages total ${kb(totJsonl)}, ${pct(1 - totJsonl / totPage)} smaller (est. ${estTokens(totPage).toLocaleString()}→${estTokens(totJsonl).toLocaleString()} tokens).`);
  lines.push('');
  const z19 = rows.map((r) => r.bundle.realZstd19WithShots).filter((n): n is number => n !== null);
  if (z19.length === rows.length) {
    const meanZ = Math.round(z19.reduce((a, b) => a + b, 0) / z19.length);
    lines.push(`Shipped .tar.zst uses raw (stored) zstd blocks because Chromium has no CompressionStream('zstd'). A real zstd -19 pass over the same +shots tar averages ${kb(meanZ)} (reference only).`);
  }
  lines.push('');
  return lines.join('\n');
};

// ---- Main --------------------------------------------------------------------
const probeReachable = async (url: string, timeoutMs = 5000): Promise<boolean> => {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {method: 'HEAD', signal: ctrl.signal, redirect: 'follow'});
    clearTimeout(timer);
    return res.ok || res.status === 405;
  } catch {
    return false;
  }
};

(async () => {
  const targets = catalog.frameworks.filter((f) => !onlySet || onlySet.has(f.slug));
  if (!targets.length) {
    console.error(`No frameworks selected. --only=${argMap.only ?? ''}`);
    process.exit(1);
  }

  // A benchmark with no live page has no honest numbers to report — fail
  // loudly instead of emitting anything.
  const probeUrl = catalog.frameworks[0]!.url;
  if (!(await probeReachable(probeUrl))) {
    console.error(`benchmark-bundle: ${probeUrl} unreachable — cannot measure, refusing to fabricate.`);
    process.exit(1);
  }

  console.log(`PinchGrab bundle benchmark — ${targets.length} fixture(s), headless=${headless}, concurrency=${concurrency}`);
  const tStart = Date.now();
  const driver = new PinchgrabDriver({headless, afterSweep: measure});
  await driver.launch();

  const queue = [...targets];
  const bySlug = new Map<string, TourReport>();
  const worker = async (): Promise<void> => {
    for (;;) {
      const t = queue.shift();
      if (!t) return;
      const r = await driver.tour(t.label, t.url);
      bySlug.set(t.slug, r);
      console.log(`  ${t.slug.padEnd(10)} → ${r.loadOk ? '✓' : '✗'} ${String(r.captureCount).padStart(3)} caps${r.loadError ? `  [${r.loadError.slice(0, 60)}]` : ''}`);
    }
  };
  await Promise.all(Array.from({length: Math.min(concurrency, targets.length)}, () => worker()));
  await driver.close();

  const failed = targets.filter((t) => !bySlug.get(t.slug)?.loadOk);
  if (failed.length) {
    console.error(`benchmark-bundle: ${failed.length} fixture(s) failed to load (${failed.map((t) => t.slug).join(', ')}) — refusing to report partial numbers.`);
    process.exit(1);
  }

  const rows = targets.map((t) => summarize(t.slug, bySlug.get(t.slug)!));
  const wallMs = Date.now() - tStart;
  const md = buildMarkdown(rows, wallMs);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, {recursive: true});
  fs.writeFileSync(path.join(OUT_DIR, 'bundle-benchmark.json'), JSON.stringify({generatedAt: new Date().toISOString(), wallMs, tokenNote: 'tokens are estimated as bytes/4 — no BPE tokenizer dependency in this repo', rows}, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'bundle-benchmark.md'), md);

  console.log('');
  console.log(md);
  console.log(`Artifacts: ${path.relative(ROOT, OUT_DIR)}/bundle-benchmark.{md,json}`);
  process.exit(0);
})().catch((err) => { console.error(err); process.exit(1); });
