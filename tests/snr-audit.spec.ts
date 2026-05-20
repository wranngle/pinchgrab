// SNR audit: capture from real pages with the bundled content script,
// hand the entries through the side panel's exporters (both raw + minified
// JSONL and Markdown), and print a quality report.
//
// Read this output to judge whether selectors are stable, payloads are
// useful, and what the minify step actually saves.

import {chromium, type Page} from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const SRC = path.resolve('./extension');
const ASSETS = ['sidepanel.html', 'sidepanel.css', 'sidepanel.js'];

const SITES = [
  {url: 'https://wranngle.com/', label: 'wranngle.com'},
  {url: 'https://app.wranngle.com/', label: 'app.wranngle.com'},
  {url: 'https://github.com/wranngle/pinchtab', label: 'github.com (CSP-strict)'},
];

// What we capture on each page. Picks a mix of structural / interactive /
// component-marked elements.
const PROBES = [
  'header:not(:has(header))', 'nav:not(:has(nav))',
  'h1', 'h2:nth-of-type(1)',
  'main button:nth-of-type(1)', 'main a[href]:nth-of-type(1)',
  '[data-testid]:nth-of-type(1)', '[role]:nth-of-type(1)',
  'footer:not(:has(footer))',
  '[class*="card"]:nth-of-type(1)', '[class*="hero"]',
];

const tokenCount = (s: string): number => Math.ceil(s.length / 4);
const wordCount = (s: string): number => (s.match(/\S+/g) ?? []).length;
const fmt = (n: number): string => n.toLocaleString();

const startServer = (): Promise<{server: http.Server; base: string}> =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url ?? '/';
      if (url === '/' || url === '/sidepanel.html') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync(path.join(SRC, 'sidepanel.html'), 'utf-8'));
        return;
      }
      const asset = ASSETS.find((a) => url.endsWith('/' + a));
      if (asset) {
        const ext = path.extname(asset).slice(1);
        const ct = ext === 'css' ? 'text/css' : ext === 'html' ? 'text/html' : 'text/javascript';
        res.writeHead(200, {'Content-Type': ct + '; charset=utf-8'});
        res.end(fs.readFileSync(path.join(SRC, asset), 'utf-8'));
        return;
      }
      res.writeHead(404);
      res.end();
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as {port: number};
      resolve({server, base: `http://127.0.0.1:${addr.port}`});
    });
  });

type Entry = {n: number; selector: string; tag: string; testId?: string; text?: string; rect?: {w: number; h: number}};
type Capture = {entry: Entry; page: {url: string; title?: string; viewport: any; tokens: any}; grouped?: boolean};

const captureFromSite = async (page: Page, url: string): Promise<Capture[]> => {
  await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 25_000});
  await page.waitForTimeout(800); // SPA settle
  await page.addScriptTag({content: fs.readFileSync(path.join(SRC, 'content-script.js'), 'utf-8')});
  await page.waitForFunction(() => Boolean((window as any).__pinchgrab));

  return page.evaluate((probes: string[]) => {
    const cs = (window as any).__pinchgrab;
    const seen = new Set<Element>();
    const captures: Capture[] = [];
    for (const p of probes) {
      let nodes: NodeListOf<Element> | null = null;
      try { nodes = document.querySelectorAll(p); }
      catch { continue; }
      for (const n of Array.from(nodes).slice(0, 2)) {
        if (seen.has(n)) continue;
        seen.add(n);
        const e = cs.captureEntry(n, cs.nextSeq());
        // Skip viewport-spanning wrappers (matches the runtime filter).
        if (e.rect && e.rect.w > window.innerWidth * 0.9 && e.rect.h > window.innerHeight * 0.9) continue;
        captures.push({entry: e, page: cs.buildPageContext()});
        if (captures.length >= 12) break;
      }
      if (captures.length >= 12) break;
    }
    return captures;
  }, PROBES);
};

// Hand-rolled exporters that mirror sidepanel.ts. Kept in sync intentionally;
// the audit is meant to read what the user would see on Copy/Export.
type Prefs = {
  includeOuterHTML: boolean; includeMatchedRules: boolean;
  includeStyles: boolean; minify: boolean;
};

const slimEntry = (e: any, prefs: Prefs): any => {
  if (!prefs.minify && prefs.includeOuterHTML && prefs.includeMatchedRules && prefs.includeStyles) return e;
  const out: any = {...e};
  if (!prefs.includeOuterHTML) delete out.outerHTML;
  if (!prefs.includeMatchedRules) delete out.matchedRules;
  if (!prefs.includeStyles) delete out.styles;
  if (prefs.minify) {
    if (out.outerHTML) out.outerHTML = String(out.outerHTML).replaceAll(/\s+/g, ' ').trim();
    if (out.text) out.text = String(out.text).replaceAll(/\s+/g, ' ').trim();
    if (out.accessibleName) out.accessibleName = String(out.accessibleName).replaceAll(/\s+/g, ' ').trim();
    delete out.ancestors;
    delete out.viewport;
    delete out.componentRoot;
    delete out.pseudoElements;
    if (Array.isArray(out.classes) && out.classes.length > 8) out.classes = out.classes.slice(0, 8);
    if (Array.isArray(out.matchedRules)) {
      out.matchedRules = out.matchedRules.map((r: any) => {
        const r2: any = {selector: r.selector};
        if (r.declarations && Object.keys(r.declarations).length) r2.declarations = r.declarations;
        if (r.media) r2.media = r.media;
        return r2;
      });
    }
    for (const [k, v] of Object.entries(out)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0) delete out[k];
    }
  }
  return out;
};

// Same shared-slim pipeline the side-panel uses: render JSONL and Markdown
// off one intermediate representation so both formats reflect the same
// minify decisions.
type SlimLine = Record<string, any>;
const buildSlim = (captures: Capture[], prefs: Prefs): SlimLine[] => {
  const lines: SlimLine[] = [];
  let lastUrl: string | null = null;
  for (const c of captures) {
    if (c.page.url !== lastUrl) {
      const slim: SlimLine = {type: 'page', url: c.page.url, title: c.page.title, viewport: c.page.viewport};
      if (!prefs.minify) slim.tokens = c.page.tokens;
      lines.push(slim);
      lastUrl = c.page.url;
    }
    lines.push(slimEntry(c.entry, prefs));
  }
  return lines;
};
const buildJsonl = (captures: Capture[], prefs: Prefs): string =>
  buildSlim(captures, prefs).map((l) => JSON.stringify(l)).join('\n') + '\n';

const buildMarkdown = (captures: Capture[], prefs: Prefs): string => {
  const out: string[] = [];
  for (const line of buildSlim(captures, prefs)) {
    if (line.type === 'page') {
      out.push(`\n---\n# ${line.title ?? line.url}\n\`${line.url}\`\n`);
      if (line.viewport) out.push(`viewport: ${line.viewport.w}×${line.viewport.h} @${line.viewport.dpr}x`);
      continue;
    }
    if (line.type === 'feedback') {
      out.push(`\n${line.text}\n`);
      continue;
    }
    const e = line;
    out.push(`\n## #${e.n} \`${e.selector}\``);
    if (e.text) out.push(`> ${e.text}`);
    const meta = [e.tag, e.role && `role=${e.role}`, e.rect && `${e.rect.w}×${e.rect.h}`].filter(Boolean).join(' · ');
    if (meta) out.push(`<sub>${meta}</sub>`);
    if (e.outerHTML) out.push('```html\n' + e.outerHTML + '\n```');
    if (e.styles && Object.keys(e.styles).length) {
      out.push('```css');
      for (const [k, v] of Object.entries(e.styles)) out.push(`${k}: ${v};`);
      out.push('```');
    }
    if (Array.isArray(e.feedback) && e.feedback.length) {
      for (const t of e.feedback) out.push(`- ${t}`);
    }
  }
  return out.join('\n');
};

const selectorBucket = (e: Entry): 'testId' | 'stableId' | 'classBased' | 'nthOfType' | 'tag' => {
  if (e.testId) return 'testId';
  if (e.selector.startsWith('#')) return 'stableId';
  if (e.selector.includes(':nth-of-type')) return 'nthOfType';
  if (e.selector.includes('.')) return 'classBased';
  return 'tag';
};

const auditCaptures = (label: string, captures: Capture[]): void => {
  if (!captures.length) {
    console.log(`\n══ ${label}: NO CAPTURES`);
    return;
  }
  const prefsRaw: Prefs = {includeOuterHTML: true, includeMatchedRules: true, includeStyles: true, minify: false};
  const prefsMin: Prefs = {includeOuterHTML: true, includeMatchedRules: true, includeStyles: true, minify: true};
  const jsonlRaw = buildJsonl(captures, prefsRaw);
  const jsonlMin = buildJsonl(captures, prefsMin);
  const mdRaw = buildMarkdown(captures, prefsRaw);
  const mdMin = buildMarkdown(captures, prefsMin);

  console.log(`\n══ ${label} · ${captures.length} captures`);

  // Selector quality
  const buckets: Record<string, number> = {testId: 0, stableId: 0, classBased: 0, nthOfType: 0, tag: 0};
  for (const c of captures) buckets[selectorBucket(c.entry)]!++;
  console.log(`   selector quality:`);
  for (const [k, v] of Object.entries(buckets)) {
    if (v) console.log(`     ${k.padEnd(12)} ${v}`);
  }

  // Sizes + reduction
  const measure = (label: string, raw: string, min: string): void => {
    const rTok = tokenCount(raw); const mTok = tokenCount(min);
    const rW = wordCount(raw); const mW = wordCount(min);
    const pct = rTok > 0 ? Math.round((1 - mTok / rTok) * 100) : 0;
    console.log(`   ${label.padEnd(8)} raw ${fmt(raw.length).padStart(8)} ch · ${fmt(rTok).padStart(7)} tok · ${fmt(rW).padStart(6)} w   →   min ${fmt(min.length).padStart(8)} ch · ${fmt(mTok).padStart(7)} tok · ${fmt(mW).padStart(6)} w   (${pct}% off)`);
  };
  measure('JSONL', jsonlRaw, jsonlMin);
  measure('MD',    mdRaw,    mdMin);

  // Per-entry token share — find the heaviest captures so user knows what's
  // bloating the export.
  const perEntry = captures.map((c) => ({
    n: c.entry.n,
    sel: c.entry.selector,
    rawTok: tokenCount(JSON.stringify(c.entry)),
    minTok: tokenCount(JSON.stringify(slimEntry(c.entry, prefsMin))),
  })).sort((a, b) => b.rawTok - a.rawTok);
  const topRaw = perEntry.slice(0, 3);
  console.log(`   heaviest entries (raw):`);
  for (const e of topRaw) console.log(`     #${String(e.n).padStart(2)}  ${fmt(e.rawTok).padStart(5)} tok → ${fmt(e.minTok).padStart(5)} tok   ${e.sel.slice(0, 80)}`);

  // First two selectors as a sanity peek.
  console.log(`   sample selectors:`);
  for (const c of captures.slice(0, Math.min(5, captures.length))) {
    const e = c.entry;
    const niceText = e.text?.slice(0, 40) ?? '(no text)';
    console.log(`     #${String(e.n).padStart(2)}  ${e.tag.padEnd(6)} ${e.selector.slice(0, 70).padEnd(70)} ${niceText}`);
  }

  // Markdown sample (first 2 entries) so user can see export shape.
  const mdSample = mdMin.split('\n## ').slice(0, 3).join('\n## ').slice(0, 600);
  console.log(`   markdown (minified, first ~600 chars):`);
  console.log(mdSample.split('\n').map((l) => '       ' + l).join('\n'));
};

(async () => {
  const browser = await chromium.launch({headless: true});
  const ctx = await browser.newContext();
  for (const site of SITES) {
    const page = await ctx.newPage();
    try {
      const captures = await captureFromSite(page, site.url);
      auditCaptures(site.label, captures);
    } catch (err: any) {
      console.log(`\n══ ${site.label}: ERROR — ${err?.message ?? err}`);
    } finally {
      await page.close();
    }
  }
  await browser.close();
})().catch((err) => { console.error(err); process.exit(1); });
