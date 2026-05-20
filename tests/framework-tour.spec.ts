// Framework Tour — drives PinchGrab against the weather-app build of every
// framework on framework-benchmarks.as93.net, captures every interesting
// element, validates selectors against the live DOM, and writes per-framework
// JSONL exports (raw + minified) for debugging regressions.
//
// Usage: `tsx tests/framework-tour.spec.ts [--only react,vue,...] [--headless=false]`

import fs from 'node:fs';
import path from 'node:path';
import {PinchgrabDriver, type TourReport, exportJsonl} from './harness/pinchgrab-driver';

const ROOT = path.resolve(process.cwd());
const FIXTURE = path.resolve(ROOT, 'tests/fixtures/framework-apps.json');
const OUT_DIR = path.resolve(ROOT, 'tests/output/framework-tour');

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
// Default 4-way concurrency. Each parallel slot opens its own page
// in the shared BrowserContext — pages within a context don't share
// state for unrelated origins (no cookies / localStorage cross-talk
// between framework-benchmarks.as93.net pages, since they all share
// the same origin and don't write storage anyway). On a 16GB machine
// 4 concurrent chromium pages is comfortable; on a tiny CI runner
// drop to 2 with --concurrency=2.
const concurrency = Math.max(1, Math.min(12, Math.trunc(Number(argMap.concurrency ?? 4))));

const ms = (n: number) => `${Math.round(n)}ms`;
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;

const writeArtifacts = (reports: TourReport[]): void => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, {recursive: true});

  // Per-framework raw JSON (full report — useful for debugging specific framework failures)
  // and per-framework JSONL (the actual export shape a user would ship).
  for (const r of reports) {
    const f = path.join(OUT_DIR, `${r.framework}.json`);
    fs.writeFileSync(f, JSON.stringify(r, null, 2));
    const exportRes = exportJsonl(r.captures);
    fs.writeFileSync(path.join(OUT_DIR, `${r.framework}.raw.jsonl`), exportRes.raw);
    fs.writeFileSync(path.join(OUT_DIR, `${r.framework}.min.jsonl`), exportRes.min);
  }
};

// Reachability probe — the framework benchmarks site is on the open
// internet and CI machines occasionally don't have network. Skip the
// tour gracefully (exit 0) instead of failing if the host is down or
// unreachable. Hard regressions (bugs > 0 or load failures with the
// site reachable) still fail the suite.
const probeReachable = async (url: string, timeoutMs = 5000): Promise<boolean> => {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {method: 'HEAD', signal: ctrl.signal, redirect: 'follow'});
    clearTimeout(timer);
    return res.ok || res.status === 405; // 405 = HEAD not allowed but server is up
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

  // Honor an env-var skip switch so CI environments can opt out without
  // flipping any code. `PINCHGRAB_SKIP_TOUR=1 npm test` runs everything
  // else and reports the tour as skipped.
  if (process.env.PINCHGRAB_SKIP_TOUR === '1') {
    console.log('framework-tour: skipped via PINCHGRAB_SKIP_TOUR=1');
    process.exit(0);
  }

  // Probe the upstream site once before launching Playwright. If the
  // host is unreachable (offline CI, DNS issue, upstream down) we
  // skip with a clear message — the tour can't tell us anything
  // useful when it can't even load the page.
  const probeUrl = catalog.frameworks[0]!.url;
  const reachable = await probeReachable(probeUrl);
  if (!reachable) {
    console.log(`framework-tour: skipped — ${probeUrl} unreachable (offline?)`);
    process.exit(0);
  }

  console.log(`PinchGrab framework tour — ${targets.length} target(s), headless=${headless}, concurrency=${concurrency}`);
  const tStart = Date.now();
  const driver = new PinchgrabDriver({headless});
  await driver.launch();

  // Concurrent runner with a fixed-size worker pool. Each "slot" pulls
  // the next target off the queue and runs `driver.tour()` on it.
  // Output prints in completion order with the slug clearly shown so
  // interleaved logs stay readable.
  const formatLine = (slug: string, r: TourReport): string => {
    const ok = r.loadOk ? '✓' : '✗';
    const buckets = r.selectorBuckets;
    const good = (buckets.testId ?? 0) + (buckets.stableId ?? 0) + (buckets.aria ?? 0) + (buckets.role ?? 0);
    return `  ${slug.padEnd(10)} → ${ok} ${String(r.captureCount).padStart(3)} caps · ${good} stable · ${r.bugs.length} bugs · min ${kb(r.jsonlMinBytes)}${r.loadError ? `  [${r.loadError.slice(0, 60)}]` : ''}`;
  };
  const queue = [...targets];
  const reports: TourReport[] = [];
  const reportsBySlug = new Map<string, TourReport>();

  const worker = async (): Promise<void> => {
    for (;;) {
      const t = queue.shift();
      if (!t) return;
      try {
        const r = await driver.tour(t.label, t.url);
        reports.push(r);
        reportsBySlug.set(t.slug, r);
        console.log(formatLine(t.slug, r));
      } catch (e: any) {
        const r: TourReport = {
          framework: t.label, url: t.url,
          startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(),
          loadOk: false, loadError: String(e?.message ?? e),
          captureCount: 0, captures: [], bugs: [{kind: 'capture-threw', detail: String(e?.message ?? e)}],
          selectorBuckets: {}, duplicateSelectors: [], invalidSelectors: [],
          emptyTextOnLeaf: 0, framework_detected: {}, shadowDomCount: 0, testIdCoverage: 0,
          jsonlRawBytes: 0, jsonlMinBytes: 0, jsonlMinTokens: 0, consoleErrors: [],
        };
        reports.push(r);
        reportsBySlug.set(t.slug, r);
        console.log(`  ${t.slug.padEnd(10)} → THREW — ${(e?.message ?? e).slice(0, 80)}`);
      }
    }
  };
  await Promise.all(Array.from({length: Math.min(concurrency, targets.length)}, () => worker()));

  // Re-sort reports to catalog order so the report file is deterministic
  // even though completion order was concurrency-dependent.
  const ordered: TourReport[] = [];
  for (const t of targets) {
    const r = reportsBySlug.get(t.slug);
    if (r) ordered.push(r);
  }

  await driver.close();
  console.log(`\nTour wall-clock: ${ms(Date.now() - tStart)}`);
  writeArtifacts(ordered);
  // The downstream summary expects `reports` to be in catalog order.
  reports.length = 0;
  reports.push(...ordered);

  // Compute pass/fail. The tour is now part of `npm test`, so a
  // regression must fail the suite — silent exit-0 was hiding bugs.
  const loadFailures = reports.filter((r) => !r.loadOk);
  const bugRegressions = reports.filter((r) => r.loadOk && r.bugs.length > 0);
  const fail = loadFailures.length + bugRegressions.length > 0;

  if (loadFailures.length) {
    console.log(`\nLoad failures (${loadFailures.length}):`);
    for (const r of loadFailures) console.log(`  ${r.framework.padEnd(12)} — ${r.loadError ?? 'unknown'}`);
  }
  if (bugRegressions.length) {
    console.log(`\nBug regressions (${bugRegressions.length}):`);
    for (const r of bugRegressions) {
      console.log(`  ${r.framework.padEnd(12)} ${r.bugs.length} bugs · sample: ${r.bugs[0]?.kind} — ${(r.bugs[0]?.detail ?? '').slice(0, 80)}`);
    }
  }

  if (fail) {
    console.error(`\nframework-tour FAIL: ${loadFailures.length} load failures, ${bugRegressions.length} bug regressions across ${reports.length} frameworks`);
    process.exit(1);
  }
  console.log(`\nframework-tour ok: ${reports.length}/${reports.length} frameworks clean (0 load failures, 0 bug regressions)`);
  process.exit(0);
})().catch((err) => { console.error(err); process.exit(1); });
