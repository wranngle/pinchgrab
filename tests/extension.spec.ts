// Real-extension test: launches Chromium with --load-extension so the
// chrome.* APIs are actually present. Exercises the bg ↔ side panel save
// pipeline + the screenshot pipeline against an unpacked build of
// extension/ — this is what the user runs in production, not the script-
// tag harness used by chat.spec.ts.
//
// Headless extensions in chromium >=110 require `--headless=new`. We use
// a fresh user-data dir per run so chrome doesn't carry state.

import { chromium, type BrowserContext, type Page, type Worker } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';

const EXTENSION_DIR = path.resolve('./extension');

const startHostServer = (): Promise<{ server: http.Server; base: string }> =>
  new Promise((resolve) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>host</title></head>
<body style="margin:0;padding:24px;background:#fff;color:#000">
  <button id="cta" style="padding:8px 16px;background:#ff5f00;color:#fff;border:0;border-radius:4px;font:14px sans-serif">Buy now</button>
  <a id="learn" href="#more" style="margin-left:12px">Learn more</a>
</body></html>`;
    const server = http.createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    server.listen(0, '127.0.0.1', () => {
      const a = server.address() as { port: number };
      resolve({ server, base: `http://127.0.0.1:${a.port}` });
    });
  });

// Wait for the extension's service worker to register itself in the context.
const waitForServiceWorker = async (ctx: BrowserContext, timeoutMs = 10_000): Promise<Worker> => {
  const start = Date.now();
  for (;;) {
    const sws = ctx.serviceWorkers();
    if (sws.length) return sws[0]!;
    if (Date.now() - start > timeoutMs) throw new Error('extension service worker did not register');
    await new Promise((r) => setTimeout(r, 100));
  }
};

// Pull the extension id off any service-worker URL: chrome-extension://<id>/background.js
const idFromWorker = (worker: Worker): string => {
  const m = /chrome-extension:\/\/([a-z]+)\//.exec(worker.url());
  if (!m) throw new Error(`could not parse extension id from ${worker.url()}`);
  return m[1]!;
};

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

(async () => {
  const { server, base } = await startHostServer();

  // Per-run profile + downloads directory. We point chrome at the
  // downloads dir explicitly so tests can scan it without guessing the
  // user's real Downloads folder.
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pinchgrab-profile-'));
  const downloadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pinchgrab-dl-'));

  // The production manifest intentionally has NO host_permissions (#18: capture
  // works via the activeTab grant from the toolbar-click activation). A headless
  // test can't perform that toolbar click, so we load a COPY of the build with
  // host_permissions added — standing in for the real activeTab grant so the
  // screenshot/capture pipeline can be exercised. The shipped extension/ stays
  // clean; this only affects what Chromium loads in-test.
  const loadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pinchgrab-ext-'));
  fs.cpSync(EXTENSION_DIR, loadDir, { recursive: true });
  {
    const mfPath = path.join(loadDir, 'manifest.json');
    const mf = JSON.parse(fs.readFileSync(mfPath, 'utf8'));
    mf.host_permissions = ['<all_urls>'];
    fs.writeFileSync(mfPath, JSON.stringify(mf, null, 2));
  }

  const ctx = await chromium.launchPersistentContext(profileDir, {
    headless: true,
    channel: 'chromium',
    downloadsPath: downloadsDir,
    acceptDownloads: true,
    args: [
      `--disable-extensions-except=${loadDir}`,
      `--load-extension=${loadDir}`,
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });

  // Tap into both consoles + chrome.runtime errors so a broken pipeline
  // surfaces a real message rather than a silent timeout.
  const collected: string[] = [];
  ctx.on('weberror', (err) => collected.push(`[weberror] ${err.error()}`));
  ctx.on('serviceworker', (sw) => {
    sw.on('console', (msg) => collected.push(`[sw:${msg.type()}] ${msg.text()}`));
  });

  const sw = await waitForServiceWorker(ctx);
  sw.on('console', (msg) => collected.push(`[sw:${msg.type()}] ${msg.text()}`));
  const extId = idFromWorker(sw);
  console.log(`extension test: extId=${extId}, profile=${profileDir}, downloads=${downloadsDir}`);

  // Open a host tab so chrome.tabs.captureVisibleTab has a target.
  const host = await ctx.newPage();
  host.on('console', (msg) => collected.push(`[host:${msg.type()}] ${msg.text()}`));
  await host.goto(base + '/');

  // Open the side panel page directly. Chrome doesn't let test code call
  // chrome.sidePanel.open without a user gesture, so we navigate to the
  // side-panel HTML by extension URL — the same code paths run.
  const panel = await ctx.newPage();
  panel.on('console', (msg) => collected.push(`[panel:${msg.type()}] ${msg.text()}`));
  panel.on('pageerror', (err) => collected.push(`[panel:error] ${err.message}`));
  await panel.goto(`chrome-extension://${extId}/sidepanel.html`);
  await panel.waitForFunction(() => Boolean((window as any).__pinchgrab_panel), null, { timeout: 10_000 });

  // ─── Test 1: JSONL save round-trips through chrome.downloads ───────────
  // Seed one capture, fire onExport, then poll the downloads dir until the
  // file appears (or fail loudly with whatever console output we collected).
  const seedAndExport = async (): Promise<{ filename: string | null }> => {
    return panel.evaluate(async () => {
      const sp: any = (window as any).__pinchgrab_panel;
      sp.clear();
      const e = {
        uid: 'aaaa', n: 1, ts: '2026-05-08T10:00:00.000Z',
        url: 'http://127.0.0.1/x', tag: 'button',
        selector: '#cta', text: 'Buy now',
        rect: { x: 0, y: 0, w: 100, h: 32 },
        viewport: { w: 1280, h: 800, dpr: 1 },
        outerHTML: '<button id="cta">Buy now</button>',
      };
      sp.pushMessage({ type: 'page', id: 'p1', ts: e.ts, url: e.url, title: 't' });
      sp.pushMessage({ type: 'selector', id: 's1', ts: e.ts, entry: e });
      // Disable auto-screenshot so this first test isn't double-asserting.
      sp.setPrefs({ autoScreenshot: false });
      await sp.onExport();
      // Wait a tick for the bg round-trip + file write.
      await new Promise((r) => setTimeout(r, 300));
      const last = sp.getLastExport();
      return { filename: last.absPath ?? null };
    });
  };

  // Helper: poll-wait for a file to exist on disk. Playwright with
  // `acceptDownloads: true` rewrites the on-disk path to a UUID under
  // downloadsPath; the bg reports the UUID path back via absPath, which
  // we then confirm by reading. In real Chrome (no Playwright shim) the
  // file lands at Downloads/pinchgrab/<workspace>/<subdir>/<filename>.
  const waitForFile = async (absPath: string, timeoutMs = 6_000): Promise<boolean> => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try { if (fs.statSync(absPath).size > 0) return true; } catch { /* not yet */ }
      await sleep(100);
    }
    return false;
  };

  const failures: string[] = [];
  try {
    const exportRes = await seedAndExport();
    if (!exportRes.filename) {
      failures.push('JSONL export: side panel never set lastExport.absPath');
    } else if (!(await waitForFile(exportRes.filename))) {
      failures.push(`JSONL export: file did not appear at ${exportRes.filename}`);
    } else {
      const content = fs.readFileSync(exportRes.filename, 'utf-8');
      assert(content.includes('"type":"manifest"'), 'export should include the manifest line');
      assert(content.includes('"selector":"#cta"'), 'export should include the seeded selector');
      console.log(`extension 1 ok: JSONL written → ${exportRes.filename} (${content.length} bytes)`);
    }
  } catch (e) {
    failures.push(`JSONL export threw: ${(e as Error).message}`);
  }

  // ─── Test 2: tar.zst archive export ────────────────────────────────────
  try {
    const archivePath = await panel.evaluate(async () => {
      const sp: any = (window as any).__pinchgrab_panel;
      await sp.onExportZip();
      await new Promise((r) => setTimeout(r, 400));
      return sp.getLastExport().absPath;
    });
    if (!archivePath) {
      failures.push('archive export: side panel never set lastExport.absPath');
    } else if (!(await waitForFile(archivePath))) {
      failures.push(`archive export: file did not appear at ${archivePath}`);
    } else {
      const buf = fs.readFileSync(archivePath);
      assert(buf.length > 100, `archive is suspiciously small: ${buf.length} bytes`);
      // zstd magic: 28 B5 2F FD
      assert(buf[0] === 0x28 && buf[1] === 0xb5 && buf[2] === 0x2f && buf[3] === 0xfd,
        `archive should start with zstd magic 28 B5 2F FD, got ${[...buf.subarray(0, 4)].map((b) => b.toString(16))}`);
      console.log(`extension 2 ok: tar.zst written → ${archivePath} (${buf.length} bytes)`);
    }
  } catch (e) {
    failures.push(`archive export threw: ${(e as Error).message}`);
  }

  // ─── Test 3: Screenshot pipeline (shot-element through bg) ─────────────
  // We can't easily simulate Alt+Click in a Playwright tab while the
  // content script's listeners are wired — instead we ask the side panel
  // to fire a shot-element directly via the bg's message API. We pass the
  // host tab id explicitly so capture targets the page (not the side-panel
  // chrome-extension URL, which executeScript can't read).
  try {
    await host.bringToFront();
    await sleep(200);
    // Get the host tab's id by asking the bg from the panel context.
    const hostTabId = await panel.evaluate(async () => {
      const tabs = await new Promise<any[]>((resolve) => {
        chrome.tabs.query({}, (ts) => resolve(ts));
      });
      const hostTab = tabs.find((t: any) => typeof t.url === 'string' && t.url.startsWith('http://127.0.0.1'));
      return hostTab?.id ?? null;
    });
    if (hostTabId == null) {
      failures.push('screenshot: could not locate host tab id');
    }
    const replyOk = hostTabId == null ? null : await panel.evaluate(async (tabId) => {
      const reply = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { __pg: true, __mid: 'test-shot', kind: 'shot-element', selector: '#cta', n: 99, workspace: 'default', tabId },
          (r) => resolve(r),
        );
      });
      return reply;
    }, hostTabId);
    const reply = replyOk as { ok?: boolean; absPath?: string; error?: string } | null;
    if (!reply || reply.ok !== true) {
      failures.push(`shot-element reply was not ok: ${JSON.stringify(replyOk)}`);
    } else if (!reply.absPath) {
      failures.push(`shot-element reply missing absPath: ${JSON.stringify(replyOk)}`);
    } else if (!(await waitForFile(reply.absPath))) {
      failures.push(`shot-element: file did not appear at ${reply.absPath}`);
    } else {
      const buf = fs.readFileSync(reply.absPath);
      // PNG magic: 89 50 4E 47 0D 0A 1A 0A
      const magicOk = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
      assert(magicOk, `PNG magic missing in ${reply.absPath}`);
      console.log(`extension 3 ok: screenshot written → ${reply.absPath} (${buf.length} bytes)`);
    }
  } catch (e) {
    failures.push(`screenshot threw: ${(e as Error).message}`);
  }

  // ─── Test 4: page-snapshot generation (item 18) ───────────────────────
  // The content script asks the bg for a full-page snapshot via the new
  // `page-snapshot-shot` request; the bg returns a PNG data URL (best-effort
  // full page, `partial` when stitch was capped). We exercise the generation
  // half directly against the real worker — same path the content script
  // drives on the first capture of a new URL.
  try {
    await host.bringToFront();
    await sleep(150);
    const hostTabId = await panel.evaluate(async () => {
      const tabs = await new Promise<any[]>((resolve) => chrome.tabs.query({}, (ts) => resolve(ts)));
      const hostTab = tabs.find((t: any) => typeof t.url === 'string' && t.url.startsWith('http://127.0.0.1'));
      return hostTab?.id ?? null;
    });
    if (hostTabId == null) {
      failures.push('page-snapshot: could not locate host tab id');
    } else {
      const reply = await panel.evaluate(async (tabId) =>
        new Promise<any>((resolve) => {
          chrome.runtime.sendMessage(
            { __pg: true, __mid: 'test-snap', kind: 'page-snapshot-shot', tabId },
            (r) => resolve(r),
          );
        }), hostTabId) as { ok?: boolean; screenshot?: string; partial?: boolean; error?: string };
      if (!reply || reply.ok !== true) {
        failures.push(`page-snapshot reply was not ok: ${JSON.stringify(reply)}`);
      } else if (typeof reply.screenshot !== 'string' || !reply.screenshot.startsWith('data:image/png;base64,')) {
        failures.push(`page-snapshot screenshot is not a PNG data URL: ${String(reply.screenshot).slice(0, 40)}`);
      } else {
        // Decode the base64 PNG and check the magic bytes.
        const b64 = reply.screenshot.slice('data:image/png;base64,'.length);
        const bytes = Buffer.from(b64, 'base64');
        const magicOk = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
        assert(magicOk, 'page-snapshot PNG magic missing');
        console.log(`extension 4 ok: page-snapshot PNG (${bytes.length} bytes, partial=${reply.partial === true})`);
      }
    }
  } catch (e) {
    failures.push(`page-snapshot threw: ${(e as Error).message}`);
  }

  // ─── Test 5: #18 on-demand injection → Alt+Click capture ───────────────
  // Reproduce the toolbar-click activation end-to-end: the SW injects
  // content-script.js into the host tab (what action.onClicked does), the
  // content script must initialize, and a REAL Alt+Click must produce a
  // capture that reaches the side panel. This is the flow the user reported
  // broken after #18.
  try {
    const hostTabId = await sw.evaluate(async (hostBase) => {
      const tabs = await chrome.tabs.query({});
      const t = tabs.find((x) => typeof x.url === 'string' && x.url.startsWith(hostBase));
      return t?.id ?? null;
    }, base);
    if (hostTabId == null) {
      failures.push('#18 inject: could not find host tab id');
    } else {
      const injectErr = await sw.evaluate(async (tabId) => {
        try {
          await chrome.scripting.executeScript({ target: { tabId }, files: ['content-script.js'], injectImmediately: true });
          return null;
        } catch (e) { return String(e); }
      }, hostTabId);
      if (injectErr) {
        failures.push(`#18 inject: executeScript failed: ${injectErr}`);
      } else {
        await sleep(300);
        // The content script runs in the ISOLATED world, so its window[KEY] is
        // invisible to host.evaluate() (main world). Detect init via the overlay
        // host element it appends to the page DOM instead.
        const csReady = await host.evaluate(() => Boolean(document.getElementById('__pinchgrab_overlay')));
        if (!csReady) {
          failures.push('#18 inject: content script did not initialize (no #__pinchgrab_overlay after executeScript)');
        } else {
          await panel.evaluate(() => (window as any).__pinchgrab_panel.clear());
          await host.bringToFront();
          await host.keyboard.down('Alt');
          await host.click('#cta');
          await host.keyboard.up('Alt');
          await sleep(600);
          const caps = await panel.evaluate(() =>
            (window as any).__pinchgrab_panel.getMessages()
              .filter((m: any) => m.type === 'selector')
              .map((m: any) => m.entry?.selector));
          if (!caps.includes('#cta')) {
            failures.push(`#18 Alt+Click: no #cta capture reached the panel (got ${JSON.stringify(caps)})`);
          } else {
            console.log(`extension 5 ok: #18 on-demand injection + Alt+Click capture (selectors=${JSON.stringify(caps)})`);
          }
        }
      }
    }
  } catch (e) {
    failures.push(`#18 inject/Alt threw: ${(e as Error).message}`);
  }

  // ─── Test 6: SW boot leaves openPanelOnActionClick=false ────────────────
  // The bug that killed Alt+Click: a stale openPanelOnActionClick:true makes
  // the toolbar click auto-open the panel WITHOUT firing action.onClicked, so
  // the content script never injects. The fix sets it false at SW TOP LEVEL —
  // onInstalled no longer touches it at all — so a booted SW showing false
  // proves the top-level call ran. (A stronger restart-the-SW variant is not
  // possible in this harness: chrome.runtime.reload() under Playwright
  // headless kills the extension without respawning the worker — verified.
  // Chrome's own toolbar-click → onClicked dispatch when the flag is false is
  // platform behavior and needs a manual check.)
  try {
    const bootVal = await sw.evaluate(async () =>
      (await chrome.sidePanel.getPanelBehavior()).openPanelOnActionClick ?? null);
    if (bootVal !== false) {
      failures.push(`panel-behavior: expected openPanelOnActionClick=false after SW boot, got ${String(bootVal)}`);
    } else {
      console.log('extension 6 ok: SW boot set openPanelOnActionClick=false (toolbar click reaches onClicked)');
    }
  } catch (e) {
    failures.push(`panel-behavior test threw: ${(e as Error).message}`);
  }

  // Print collected console output regardless — visibility while debugging.
  if (collected.length) {
    console.log('--- console capture (last 50 lines) ---');
    for (const line of collected.slice(-50)) console.log(line);
    console.log('---');
  }

  await ctx.close();
  server.close();
  // Best-effort cleanup; ignore EBUSY on Windows.
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch { /* ignore */ }

  if (failures.length) {
    console.error('extension.spec FAILURES:\n  ' + failures.join('\n  '));
    process.exit(1);
  }
  console.log('extension.spec all tests passed');
  process.exit(0);
})().catch((err) => { console.error(err); process.exit(1); });
