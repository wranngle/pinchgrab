// Programmatic PinchGrab driver. Boots a Playwright page, injects the
// bundled content-script.js (which exposes window.__pinchgrab when running
// outside the extension), and gives the caller helpers to walk a page and
// capture every interesting element exactly the way Alt+Click would.
//
// The driver intentionally talks to the same `captureEntry` /
// `buildPageContext` / `snapToComponent` / `pickDragCandidates` /
// `elementsInRect` functions the real extension uses, so any selector /
// payload bug a user would hit shows up here too.

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium, type Browser, type BrowserContext, type Page} from 'playwright';

const ROOT = path.resolve(process.cwd());
const CS_PATH = path.resolve(ROOT, 'extension/content-script.js');
const PAGE_TOUR_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'page-tour.js');

export type DriverEntry = {
  uid: string;
  n: number;
  ts: string;
  url: string;
  tag: string;
  selector: string;
  text?: string;
  role?: string;
  accessibleName?: string;
  testId?: string;
  classes?: string[];
  rect?: {x: number; y: number; w: number; h: number};
  outerHTML?: string;
  styles?: Record<string, string>;
  matchedRules?: Array<{selector: string; declarations?: Record<string, string>; media?: string}>;
  ancestors?: any[];
  inShadowDOM?: boolean;
  shadowHost?: string;
  component?: {framework: string; name?: string};
  events?: Record<string, string>;
  behaviorAttrs?: Record<string, string>;
  states?: string[];
  [k: string]: any;
};

export type Capture = {
  entry: DriverEntry;
  page: {url: string; title?: string; viewport: any};
  source: 'click' | 'drag' | 'probe';
  probe?: string;
};

export type TourReport = {
  framework: string;
  url: string;
  startedAt: string;
  finishedAt: string;
  loadOk: boolean;
  loadError?: string;
  navTimingMs?: number;
  captureCount: number;
  captures: Capture[];
  bugs: BugFinding[];
  selectorBuckets: Record<string, number>;
  duplicateSelectors: Array<{selector: string; count: number}>;
  invalidSelectors: Array<{selector: string; reason: string}>;
  emptyTextOnLeaf: number;
  framework_detected: Record<string, number>;
  shadowDomCount: number;
  testIdCoverage: number;
  jsonlRawBytes: number;
  jsonlMinBytes: number;
  jsonlMinTokens: number;
  consoleErrors: string[];
};

export type BugFinding = {
  kind: 'invalid-selector' | 'duplicate-selector' | 'empty-capture' | 'huge-rect' | 'capture-threw' | 'shadow-host-unresolved' | 'no-accessible-name' | 'tag-only-selector';
  detail: string;
  selector?: string;
  probe?: string;
};

// ---- Probe set --------------------------------------------------------------
// The harness walks each page collecting elements an LLM-savvy user would
// realistically grab. Order matters: data-testid / role / id-based probes
// first (so dedup keeps the highest-signal selector when several probes hit
// the same element), then semantic landmarks, then leaf interactives, then
// the broad "every visible <button>/<a>/<input>/etc." sweep.
export const HARNESS_PROBES: ReadonlyArray<{selector: string; cap: number; label: string}> = [
  {selector: '[data-testid]',                      cap: 20, label: 'testId'},
  {selector: '[role]:not([role=""])',              cap: 20, label: 'role'},
  {selector: '[id]:not([id=""])',                  cap: 20, label: 'stableId'},

  // Semantic landmarks
  {selector: 'header',                             cap: 3,  label: 'header'},
  {selector: 'nav',                                cap: 3,  label: 'nav'},
  {selector: 'main',                               cap: 2,  label: 'main'},
  {selector: 'section',                            cap: 6,  label: 'section'},
  {selector: 'article',                            cap: 4,  label: 'article'},
  {selector: 'aside',                              cap: 3,  label: 'aside'},
  {selector: 'footer',                             cap: 3,  label: 'footer'},
  {selector: 'h1, h2, h3, h4, h5, h6',             cap: 16, label: 'heading'},

  // Form / interactive
  {selector: 'button',                             cap: 20, label: 'button'},
  {selector: 'a[href]',                            cap: 20, label: 'link'},
  {selector: 'input',                              cap: 20, label: 'input'},
  {selector: 'select',                             cap: 8,  label: 'select'},
  {selector: 'textarea',                           cap: 8,  label: 'textarea'},
  {selector: 'label',                              cap: 8,  label: 'label'},
  {selector: 'form',                               cap: 4,  label: 'form'},

  // Lists / tabular
  {selector: 'ul > li',                            cap: 16, label: 'li'},
  {selector: 'ol > li',                            cap: 8,  label: 'li-ordered'},
  {selector: 'table',                              cap: 4,  label: 'table'},

  // Web components / shadow hosts
  {selector: '*',                                  cap: 0,  label: 'custom-element', custom: 'webComponent'},
  {selector: '*',                                  cap: 0,  label: 'shadow-host',    custom: 'shadowHost'},

  // Generic visible interactive layer (catches `<div onClick>`, role-less
  // buttons, framework-specific clickable wrappers).
  {selector: '[onclick], [tabindex]:not([tabindex="-1"])', cap: 16, label: 'clickable-fallback'},
] as unknown as Array<{selector: string; cap: number; label: string}>;

// ---- Driver ----------------------------------------------------------------
export type DriverOpts = {
  headless?: boolean;
  blockExternalRequests?: boolean;
  viewport?: {width: number; height: number};
  timeoutMs?: number;
};

export class PinchgrabDriver {
  private browser!: Browser;
  private ctx!: BrowserContext;
  private csSource: string;
  private pageTourSource: string;

  constructor(private opts: DriverOpts = {}) {
    if (!fs.existsSync(CS_PATH)) {
      throw new Error(`content-script.js not found at ${CS_PATH} — run \`bun run build\` first.`);
    }
    this.csSource = fs.readFileSync(CS_PATH, 'utf-8');
    this.pageTourSource = fs.readFileSync(PAGE_TOUR_PATH, 'utf-8');
  }

  async launch(): Promise<void> {
    this.browser = await chromium.launch({headless: this.opts.headless ?? true});
    this.ctx = await this.browser.newContext({
      viewport: this.opts.viewport ?? {width: 1280, height: 800},
    });
  }

  async close(): Promise<void> {
    await this.ctx?.close();
    await this.browser?.close();
  }

  async tour(framework: string, url: string): Promise<TourReport> {
    const startedAt = new Date().toISOString();
    const consoleErrors: string[] = [];
    const page = await this.ctx.newPage();
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => consoleErrors.push(`[pageerror] ${err.message}`));

    const report: TourReport = {
      framework, url, startedAt, finishedAt: '',
      loadOk: false,
      captureCount: 0, captures: [], bugs: [],
      selectorBuckets: {testId: 0, stableId: 0, classBased: 0, nthOfType: 0, tag: 0, aria: 0, role: 0},
      duplicateSelectors: [],
      invalidSelectors: [],
      emptyTextOnLeaf: 0,
      framework_detected: {},
      shadowDomCount: 0,
      testIdCoverage: 0,
      jsonlRawBytes: 0,
      jsonlMinBytes: 0,
      jsonlMinTokens: 0,
      consoleErrors,
    };

    const navStart = Date.now();
    try {
      await page.goto(url, {waitUntil: 'domcontentloaded', timeout: this.opts.timeoutMs ?? 30_000});
      // SPA settle — most framework weather apps fetch open-meteo on mount.
      // 1500ms is long enough for the slowest framework (Angular zone) we've
      // seen here, while keeping a 12-framework run under 60s.
      await page.waitForTimeout(1500);
      report.navTimingMs = Date.now() - navStart;
      report.loadOk = true;
    } catch (e: any) {
      report.loadError = String(e?.message ?? e);
      report.finishedAt = new Date().toISOString();
      await page.close();
      return report;
    }

    // Inject the content script. Standalone mode (no chrome.* APIs) drops
    // the script into the page; window.__pinchgrab becomes the public
    // surface the harness drives.
    try {
      await page.addScriptTag({content: this.csSource});
      await page.waitForFunction(() => Boolean((window as any).__pinchgrab), null, {timeout: 5000});
    } catch (e: any) {
      report.loadError = `injection failed: ${String(e?.message ?? e)}`;
      report.finishedAt = new Date().toISOString();
      await page.close();
      return report;
    }

    // Run the page-side capture sweep in a single evaluate so we don't pay
    // a round-trip per element. The page-side script body lives in a
    // separate .js file (not tsx-compiled) so it doesn't carry tsx's
    // `__name` helper into the page context.
    const probes = HARNESS_PROBES.map((p) => ({selector: p.selector, cap: p.cap, label: p.label, custom: (p as any).custom}));
    let raw: Capture[] = [];
    try {
      // page.evaluate accepts a function-expression string; we wrap the
      // page-tour body to invoke it with `probes`.
      const evalSource = `(${this.pageTourSource})(${JSON.stringify(probes)})`;
      raw = await page.evaluate(evalSource);
    } catch (e: any) {
      report.bugs.push({kind: 'capture-threw', detail: String(e?.message ?? e)});
    }

    report.captures = raw;
    report.captureCount = raw.length;

    // Score & validate each capture's selector against the live page.
    // Same `__name` constraint applies — keep the validator's source as a
    // plain string so tsx doesn't sneak helpers into the page context.
    //
    // Validation is SCOPE-AWARE: a shadow-rooted entry resolves within its
    // shadowHost's shadow root, not globally. PinchGrab stores `shadowHost`
    // alongside `selector` so the consumer pieces them together — counting
    // cross-shadow-root matches would mis-flag every per-component testId
    // as a duplicate (Lit / Stencil pattern where every <forecast-item>
    // tags its own internal div with `data-testid="forecast-item"`).
    const validationRequest = raw
      .filter((c) => c.entry?.selector)
      .map((c) => ({selector: c.entry.selector, shadowHost: c.entry.shadowHost}));
    const validateSource = `(function(reqs){
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
      function resolveScope(shadowHostSel) {
        if (!shadowHostSel) return allRoots; // global scope when no host
        // Find the shadowHost element and return its shadowRoot as the scope.
        // The shadowHost selector itself may live inside another shadow root
        // (nested components), so check every root.
        for (var r = 0; r < allRoots.length; r++) {
          try {
            var host = allRoots[r].querySelector(shadowHostSel);
            if (host && host.shadowRoot) return [host.shadowRoot];
          } catch (e) { /* ignore */ }
        }
        return null; // shadowHost unresolvable
      }
      var out = {};
      for (var k = 0; k < reqs.length; k++) {
        var sel = reqs[k].selector;
        var scope = resolveScope(reqs[k].shadowHost);
        if (sel == null) continue;
        if (scope == null) {
          out[sel + '|' + (reqs[k].shadowHost||'')] = {valid: false, matchCount: 0, syntax: true, scope: 'shadowHost-unresolved'};
          continue;
        }
        var total = 0;
        var validSyntax = true;
        for (var r2 = 0; r2 < scope.length; r2++) {
          try {
            total += scope[r2].querySelectorAll(sel).length;
          } catch (e) {
            validSyntax = false;
          }
        }
        out[sel + '|' + (reqs[k].shadowHost||'')] = {valid: total > 0, matchCount: total, syntax: validSyntax, scope: reqs[k].shadowHost ? 'shadow' : 'doc'};
      }
      return out;
    })(${JSON.stringify(validationRequest)})`;
    const validationByKey: Record<string, {valid: boolean; matchCount: number; syntax?: boolean; scope?: string}> = await page.evaluate(validateSource);
    const validationFor = (sel: string, shadowHost: string | undefined) =>
      validationByKey[`${sel}|${shadowHost ?? ''}`];

    // Bucket selectors + collect bugs
    const dupCounts = new Map<string, number>();
    for (const c of raw) {
      const e = c.entry;
      if (!e || !e.selector) continue;
      const sel = e.selector;
      dupCounts.set(sel, (dupCounts.get(sel) ?? 0) + 1);
      const bucket =
        e.testId ? 'testId'
        : sel.startsWith('#') ? 'stableId'
        : sel.startsWith('[aria-label') ? 'aria'
        : sel.startsWith('[role') ? 'role'
        : sel.includes(':nth-of-type') ? 'nthOfType'
        : sel.includes('.') ? 'classBased'
        : 'tag';
      report.selectorBuckets[bucket] = (report.selectorBuckets[bucket] ?? 0) + 1;

      const v = validationFor(sel, e.shadowHost);
      if (!v || !v.valid || v.syntax === false) {
        report.invalidSelectors.push({selector: sel, reason: v?.syntax === false ? 'syntax-error' : 'no-match'});
        report.bugs.push({kind: 'invalid-selector', detail: `${sel} did not resolve on the page`, selector: sel, probe: c.probe});
      } else if (v.matchCount > 1) {
        // Genuine non-uniqueness is a bug — the user clicked one element
        // but the selector matches multiple. Even 2 matches is wrong.
        report.bugs.push({kind: 'duplicate-selector', detail: `${sel} matches ${v.matchCount} elements`, selector: sel, probe: c.probe});
      }
      // Tag-only selector is only fragile when it matches MORE THAN ONE
      // element — `<header>` / `<main>` / `<app-weather>` that are unique
      // on the page are perfectly fine. Custom-element tags (containing `-`)
      // are likewise high-signal anchors.
      if (e.tag && !e.testId && bucket === 'tag' && v && v.matchCount > 1 && !sel.includes('-')) {
        report.bugs.push({kind: 'tag-only-selector', detail: `bare ${sel} — fragile (matches ${v.matchCount})`, selector: sel, probe: c.probe});
      }
      if (e.rect && (e.rect.w >= 1200 && e.rect.h >= 700)) {
        report.bugs.push({kind: 'huge-rect', detail: `${sel} captured viewport-sized rect ${e.rect.w}x${e.rect.h}`, selector: sel});
      }
      if (e.testId) report.testIdCoverage++;
      if (e.inShadowDOM) report.shadowDomCount++;
      if (e.inShadowDOM && !e.shadowHost) {
        report.bugs.push({kind: 'shadow-host-unresolved', detail: `${sel} flagged inShadowDOM but no shadowHost selector`, selector: sel});
      }
      if (e.component?.framework) {
        report.framework_detected[e.component.framework] = (report.framework_detected[e.component.framework] ?? 0) + 1;
      }
      if (!e.text && !e.accessibleName && ['button', 'a', 'input', 'label'].includes(e.tag)) {
        report.bugs.push({kind: 'no-accessible-name', detail: `${e.tag} ${sel} has no text or accessible name`, selector: sel});
      }
    }
    for (const [sel, n] of dupCounts) if (n > 1) report.duplicateSelectors.push({selector: sel, count: n});
    report.duplicateSelectors.sort((a, b) => b.count - a.count);

    // Export pipeline — JSONL (raw + minified). We inline a tiny mirror of
    // sidepanel.ts's slimEntry/buildJsonl so the harness doesn't need to
    // boot the side-panel chrome-extension page.
    const exportRes = exportJsonl(raw);
    report.jsonlRawBytes = exportRes.rawBytes;
    report.jsonlMinBytes = exportRes.minBytes;
    report.jsonlMinTokens = Math.ceil(exportRes.minBytes / 4);

    report.finishedAt = new Date().toISOString();
    await page.close();
    return report;
  }
}

// ---- Inlined slim/export (mirrors sidepanel.ts) ----------------------------
const slimEntry = (e: any, minify: boolean): Record<string, any> => {
  const out: Record<string, any> = {
    v: 2, type: 'selector',
    uid: e.uid, n: e.n, ts: e.ts, url: e.url,
    tag: e.tag, selector: e.selector,
  };
  if (e.text !== undefined) out.text = minify ? String(e.text).replaceAll(/\s+/g, ' ').trim() : e.text;
  if (e.role !== undefined) out.role = e.role;
  if (e.accessibleName !== undefined) out.accessibleName = minify ? String(e.accessibleName).replaceAll(/\s+/g, ' ').trim() : e.accessibleName;
  if (e.id !== undefined) out.id = e.id;
  if (e.testId !== undefined) out.testId = e.testId;
  if (e.classes && e.classes.length) out.classes = (minify && e.classes.length > 8) ? e.classes.slice(0, 8) : e.classes;
  if (e.attrs && Object.keys(e.attrs).length) out.attrs = e.attrs;
  if (e.rect) out.rect = e.rect;
  if (e.states && e.states.length) out.states = e.states;
  if (e.component) out.component = e.component;
  if (e.outerHTML !== undefined) out.outerHTML = minify ? String(e.outerHTML).replaceAll(/\s+/g, ' ').trim() : e.outerHTML;
  if (!minify && e.styles && Object.keys(e.styles).length) out.styles = e.styles;
  if (e.events && Object.keys(e.events).length) out.events = e.events;
  if (e.behaviorAttrs && Object.keys(e.behaviorAttrs).length) out.behaviorAttrs = e.behaviorAttrs;
  if (e.shadowHost) out.shadowHost = e.shadowHost;
  if (e.inShadowDOM) out.inShadowDOM = true;
  if (!minify) {
    const audit: Record<string, any> = {};
    if (e.ancestors && e.ancestors.length) audit.ancestors = e.ancestors;
    if (e.componentRoot) audit.componentRoot = e.componentRoot;
    if (e.matchedRules && e.matchedRules.length) audit.matchedRules = e.matchedRules;
    if (e.viewport) audit.viewport = e.viewport;
    if (Object.keys(audit).length) out._audit = audit;
  }
  return out;
};

export const exportJsonl = (captures: Capture[]): {raw: string; min: string; rawBytes: number; minBytes: number} => {
  const render = (minify: boolean): string => {
    const lines: string[] = [];
    let lastUrl: string | null = null;
    const manifest: Record<string, any> = {
      v: 2, type: 'manifest', tool: 'pinchgrab',
      ts: new Date().toISOString(),
      counts: {selectors: captures.filter((c) => c.entry?.selector).length, pages: 1},
    };
    lines.push(JSON.stringify(manifest));
    for (const c of captures) {
      if (!c.entry?.selector) continue;
      if (c.page.url !== lastUrl) {
        const page: Record<string, any> = {v: 2, type: 'page', ts: c.entry.ts, url: c.page.url};
        if (c.page.title) page.title = c.page.title;
        if (c.page.viewport) page.viewport = c.page.viewport;
        lines.push(JSON.stringify(page));
        lastUrl = c.page.url;
      }
      lines.push(JSON.stringify(slimEntry(c.entry, minify)));
    }
    return lines.join('\n') + '\n';
  };
  const raw = render(false);
  const min = render(true);
  return {raw, min, rawBytes: Buffer.byteLength(raw, 'utf-8'), minBytes: Buffer.byteLength(min, 'utf-8')};
};
