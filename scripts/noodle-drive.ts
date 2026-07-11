// NOODLE FESTIVAL drive script: real PinchGrab extension, headed Chromium
// under Xvfb. Performs real Alt+Click captures plus an Alt+Drag stage sweep on
// the demo page in demo/index.html, types real comments into the on-page
// annotation box, then hovers the panel's Export button so outline-multi rings
// EVERY committed capture at once (one noodle per ring, drawn by the
// extension's own overlay). The final frame is grabbed off the X display with
// ffmpeg so browser chrome and the docked side panel are in shot.
//
// MEASUREMENT (honesty law): ring and noodle counts are read live out of the
// extension's overlay shadow root (`#__pinchgrab_overlay`): rings =
// div.ring[display:block], noodles = svg path[d!=""]. Printed as JSON to
// stdout and saved to docs/brand/noodle-festival-measurements.json.
//
// Run from the repo root (ffmpeg and xvfb-run required):
//   bun run build
//   xvfb-run -s "-screen 0 1920x1080x24" bun scripts/noodle-drive.ts
//
// Outputs:
//   docs/brand/noodle-festival.png                    raw 1920x1080 x11grab
//   docs/brand/noodle-festival-measurements.json      measured counts + method
// Compose the README card afterwards with scripts/compose-noodle-card.ts.

import {chromium, type BrowserContext, type Page, type Worker} from 'playwright';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const DEMO_DIR = path.join(ROOT, 'demo');
const OUT_DIR = path.join(ROOT, 'docs', 'brand');

const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const startServer = (): Promise<{server: http.Server; base: string}> =>
  new Promise((resolve) => {
    const server = http.createServer((_request, response) => {
      response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      response.end(fs.readFileSync(path.join(DEMO_DIR, 'index.html'), 'utf-8'));
    });
    server.listen(4173, '127.0.0.1', () => {
      resolve({server, base: 'http://127.0.0.1:4173'});
    });
  });

const waitForServiceWorker = async (ctx: BrowserContext, timeoutMs = 15_000): Promise<Worker> => {
  const start = Date.now();
  for (;;) {
    const sws = ctx.serviceWorkers();
    const first = sws[0];
    if (first) return first;
    if (Date.now() - start > timeoutMs) throw new Error('extension service worker did not register');
    await sleep(100);
  }
};

(async () => {
  fs.mkdirSync(OUT_DIR, {recursive: true});
  const {server, base} = await startServer();

  // Load a COPY of the build with host_permissions (same stand-in for the
  // activeTab grant that tests/extension.spec.ts uses; the shipped build
  // stays clean).
  const loadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-noodle-ext-'));
  fs.cpSync(path.join(ROOT, 'extension'), loadDir, {recursive: true});
  const manifestPath = path.join(loadDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Record<string, unknown>;
  manifest.host_permissions = ['<all_urls>'];
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-noodle-profile-'));
  const ctx = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    channel: 'chromium',
    viewport: null,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      `--disable-extensions-except=${loadDir}`,
      `--load-extension=${loadDir}`,
      '--window-size=1920,1080',
      '--window-position=0,0',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-crash-restore-bubble',
    ],
  });

  const sw = await waitForServiceWorker(ctx);
  sw.on('console', (message) => {
    console.log('[sw]', message.text());
  });

  // Create the host tab from the extension (chrome.tabs.create) instead of
  // navigating the boot tab: a programmatically created tab focuses the PAGE,
  // not the omnibox, so the grab has no selected-URL artifact.
  const pagePromise = ctx.waitForEvent('page');
  await sw.evaluate(async (b: string) => {
    await chrome.tabs.create({url: b + '/', active: true});
  }, base);
  const page: Page = await pagePromise;
  await page.waitForLoadState('domcontentloaded');
  // Close the original boot tab so only the demo tab remains.
  for (const p of ctx.pages()) {
    if (p !== page) await p.close().catch(() => undefined);
  }

  // Inject the content script the same way the toolbar click does.
  const tabId = await sw.evaluate(async (b: string) => {
    const tabs = await chrome.tabs.query({});
    const t = tabs.find((x) => typeof x.url === 'string' && x.url.startsWith(b));
    if (!t?.id) throw new Error('host tab not found');
    await chrome.scripting.executeScript({target: {tabId: t.id}, files: ['content-script.js'], injectImmediately: true});
    return t.id;
  }, base);
  await sleep(400);
  const csReady = await page.evaluate(() => Boolean(document.getElementById('__pinchgrab_overlay')));
  if (!csReady) throw new Error('content script did not initialize');
  console.log('content script ready, tabId', tabId);

  // Raw coordinate input (no actionability checks; the extension's own
  // full-viewport overlay host confuses Playwright's hit-testing, and raw
  // mouse events are closer to real user input anyway).
  const center = (sel: string): Promise<{x: number; y: number}> =>
    page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) throw new Error('no element for ' + s);
      const r = el.getBoundingClientRect();
      return {x: r.x + (r.width / 2), y: r.y + Math.min(r.height / 2, 20)};
    }, sel);

  // Plain Alt+Click captures, spread across the whole canvas.
  const plainCaptures = [
    '#subhead', '#demo-link', '#stat-teams', '#stat-uptime', '#badge',
    '#plan-scale', '#f-sql', '#signin', '#nav-pricing', '#brand', '#nav-product',
    '#choose-starter', '#choose-scale', '#foot-changelog', '#foot-status', '#quote',
  ];
  for (const sel of plainCaptures) {
    const c = await center(sel);
    await page.keyboard.down('Alt');
    await page.mouse.move(c.x, c.y, {steps: 3});
    await sleep(220);
    await page.mouse.down();
    await page.mouse.up();
    await sleep(400);
    await page.keyboard.up('Alt');
    await sleep(250);
  }
  console.log('committed', plainCaptures.length, 'plain Alt+Click captures');

  // Hover-comment captures (the product's capture+comment shortcut).
  // Alt+hover shows the on-page comment box; releasing Alt locks + focuses
  // it; Enter captures the element AND attaches the typed comment.
  const commented: Array<{sel: string; comment: string}> = [
    {sel: '#headline', comment: 'Tighten the gap to the subhead so this reads as one block.'},
    {sel: '#choose-pro', comment: 'This should be the loudest button on the page and it is not.'},
    {sel: '#f-alerts', comment: 'Alerts is the wedge feature. Move this tile first in the row.'},
  ];
  for (const cap of commented) {
    const c = await center(cap.sel);
    await page.keyboard.down('Alt');
    await page.mouse.move(c.x, c.y, {steps: 3});
    await sleep(450); // Hover ack round-trip shows the comment box.
    await page.keyboard.up('Alt'); // Locks the box + focuses the textarea.
    await sleep(350);
    await page.keyboard.type(cap.comment, {delay: 8});
    await page.keyboard.press('Enter'); // Capture + attach in one motion.
    await sleep(400);
    await page.keyboard.press('Escape');
    await sleep(250);
  }
  console.log('committed', commented.length, 'hover-comment captures');

  // Alt+Drag stage sweep (right-to-left = partial/intersect mode) across a
  // row: every element inside stages into the pending bay, each with its own
  // persistent gold ring + noodle.
  const dragSweep = async (selector: string): Promise<void> => {
    const rect = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) throw new Error('no element for ' + s);
      const r = (el as HTMLElement).getBoundingClientRect();
      return {x: r.x, y: r.y, w: r.width, h: r.height};
    }, selector);
    await page.keyboard.down('Alt');
    await page.mouse.move(rect.x + rect.w - 8, rect.y + 4);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) {
      await page.mouse.move(
        rect.x + rect.w - 8 - ((rect.w - 16) * i) / 12,
        rect.y + 4 + (((rect.h - 8) * i) / 12),
      );
      await sleep(30);
    }
    await page.mouse.up();
    await page.keyboard.up('Alt');
    await sleep(600);
  };
  await dragSweep('.features');
  await dragSweep('.social');

  // Money-shot comment box: Alt+hover the CTA, release Alt to lock the box,
  // type a comment, Enter (capture+comment), then leave the box open so the
  // shot shows a committed bullet plus a fresh composer row.
  const ctaCenter = await center('#cta');
  await page.keyboard.down('Alt');
  await page.mouse.move(ctaCenter.x, ctaCenter.y, {steps: 3});
  await sleep(450);
  await page.keyboard.up('Alt');
  await sleep(350);
  await page.keyboard.type('Primary action. Bump the contrast one step.', {delay: 8});
  await page.keyboard.press('Enter');
  await sleep(400);

  // Find the DOCKED side panel as a Playwright page and hover Export.
  let panel: Page | undefined;
  const deadline = Date.now() + 8000;
  while (!panel && Date.now() < deadline) {
    panel = ctx.pages().find((p) => p.url().includes('sidepanel.html'));
    if (!panel) await sleep(200);
  }
  // The REAL committed selector list, read back from the panel's own
  // persisted workspace (chrome.storage.local `pinchgrab.ws.<ws>.messages.v1`),
  // the same list the export-hover handler maps over.
  const committedSelectors: string[] = await sw.evaluate(async () => {
    const all = await chrome.storage.local.get(null);
    let best: string[] = [];
    for (const [k, v] of Object.entries(all)) {
      if (!/^pinchgrab\.ws\..*\.messages\.v1$/.test(k) || !Array.isArray(v)) continue;
      const sels = (v as Array<{type?: string; entry?: {selector?: string}}>)
        .filter((m) => m?.type === 'selector')
        .map((m) => m.entry?.selector)
        .filter((s): s is string => Boolean(s));
      if (sels.length > best.length) best = sels;
    }
    return best;
  });
  console.log('committed selectors in workspace:', committedSelectors.length, committedSelectors);

  if (panel) {
    console.log('docked panel found as page:', panel.url());
    await panel.hover('[data-export-hover]');
    console.log('hovering export button (outline-multi live)');
  } else {
    // Fallback: send the exact same message the export-button mouseenter
    // sends (sidepanel.ts export-hover wiring), with the same selector list.
    console.log('panel page not reachable; sending outline-multi via bg');
    await sw.evaluate(async (arg: {tabId: number; selectors: string[]}) => {
      await chrome.tabs.sendMessage(arg.tabId, {__pg: true, __mid: 'noodle-fest', kind: 'outline-multi', selectors: arg.selectors});
    }, {tabId, selectors: committedSelectors});
  }
  await sleep(900); // Let every ring's rAF loop paint.

  // MEASURE: rings + noodles straight out of the overlay shadow root.
  const counts = await page.evaluate(() => {
    const sh = document.getElementById('__pinchgrab_overlay')?.shadowRoot;
    if (!sh) return null;
    const rings = [...sh.querySelectorAll('div.ring')].filter((r) => (r as HTMLElement).style.display === 'block').length;
    const noodles = [...sh.querySelectorAll('svg path')].filter((p) => (p.getAttribute('d') ?? '').length > 0).length;
    const annotationOpen = (sh.querySelector('.annotation') as HTMLElement | null)?.style.display === 'block';
    return {rings, noodles, annotationOpen, innerWidth: window.innerWidth, innerHeight: window.innerHeight};
  });
  if (!counts) throw new Error('overlay shadow root not measurable');
  console.log('MEASURED', JSON.stringify(counts));
  fs.writeFileSync(path.join(OUT_DIR, 'noodle-festival-measurements.json'), JSON.stringify({
    method: 'page.evaluate over #__pinchgrab_overlay shadowRoot: rings = div.ring with display:block; noodles = svg path with non-empty d; committed selectors read from chrome.storage.local pinchgrab.ws.*.messages.v1; script = scripts/noodle-drive.ts',
    committedSelectors: committedSelectors.length,
    ...counts,
  }, null, 2) + '\n');

  // Grab the whole X display (browser chrome + docked panel + page).
  const display = process.env.DISPLAY ?? ':99';
  const rawPath = path.join(OUT_DIR, 'noodle-festival.png');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'x11grab', '-video_size', '1920x1080', '-i', display, '-frames:v', '1', rawPath]);
  console.log('wrote', rawPath);

  await ctx.close();
  server.close();
  try {
    fs.rmSync(profileDir, {recursive: true, force: true});
  } catch {}

  try {
    fs.rmSync(loadDir, {recursive: true, force: true});
  } catch {}

  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
