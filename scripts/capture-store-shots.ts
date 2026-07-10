// Chrome Web Store screenshot generator for PinchGrab's side panel.
//
// Mirrors the tests/chat.spec.ts harness: serves extension/sidepanel.html over
// a tiny static server, loads it in headless Chromium, and drives the panel
// through window.__pinchgrab_panel to seed a believable capture + comment
// state. Then it sizes the viewport to the store's required 1280×800 and
// writes a PNG to store-assets/.
//
// Run: bun run scripts/capture-store-shots.ts   (after `bun run build`)
//
// The inline preview thumbnails come from the panel's `shots` map, which is
// hydrated from localStorage (pinchgrab.ws.<ws>.shots.v1) on workspace load.
// We seed the timeline, write thumbnail dataURLs to that key, then reload the
// workspace so the previews paint as real screenshots rather than skeletons.

import { chromium, type Browser, type Page } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const SRC = path.resolve('./extension');
const OUT_DIR = path.resolve('./store-assets');
const ASSETS = ['sidepanel.html', 'sidepanel.css', 'sidepanel.js'];

type Served = { server: http.Server; base: string };

const startServer = (): Promise<Served> =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url || '/';
      if (url === '/' || url === '/sidepanel.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(path.join(SRC, 'sidepanel.html'), 'utf-8'));
        return;
      }
      const asset = ASSETS.find((a) => url.endsWith('/' + a));
      if (asset) {
        const ext = path.extname(asset).slice(1);
        const ct = ext === 'css' ? 'text/css' : ext === 'html' ? 'text/html' : 'text/javascript';
        res.writeHead(200, { 'Content-Type': ct + '; charset=utf-8' });
        res.end(fs.readFileSync(path.join(SRC, asset), 'utf-8'));
        return;
      }
      const m = /\/templates\/([\w.-]+\.md)$/.exec(url);
      if (m) {
        // Never serve the developer's local.* override templates into store
        // screenshots — the panel must fall back to the neutral starter so
        // the shots don't leak the dogfooded brand book.
        if (m[1]!.startsWith('local.')) { res.writeHead(404); res.end(); return; }
        const p = path.join(SRC, 'templates', m[1]!);
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
          res.end(fs.readFileSync(p, 'utf-8'));
          return;
        }
      }
      if (url === '/demo') {
        // A light-mode SaaS landing page for the on-page capture screenshot —
        // deliberately NOT the panel's dark theme so the shot set reads as
        // "your page + PinchGrab on it", not more panel chrome.
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Lumen — Pricing</title><style>
          * { margin:0; box-sizing:border-box; font-family:-apple-system,'Segoe UI',Roboto,sans-serif; }
          body { background:#fafaf8; color:#1c1b22; }
          nav { display:flex; align-items:center; gap:28px; padding:18px 56px; border-bottom:1px solid #eceae4; background:#fff; }
          nav b { font-size:19px; } nav a { color:#5d5a6b; text-decoration:none; font-size:14px; }
          nav .cta-sm { margin-left:auto; background:#1c1b22; color:#fff; padding:8px 16px; border-radius:8px; }
          .hero { text-align:center; padding:64px 24px 40px; }
          .hero h1 { font-size:44px; letter-spacing:-1px; margin-bottom:12px; }
          .hero p { color:#5d5a6b; font-size:18px; margin-bottom:24px; }
          #cta { background:#4f46e5; color:#fff; border:0; font-size:17px; font-weight:600; padding:14px 30px; border-radius:10px; cursor:pointer; }
          .plans { display:flex; gap:20px; justify-content:center; padding:24px 24px 64px; }
          .plan { background:#fff; border:1px solid #eceae4; border-radius:14px; padding:26px; width:240px; }
          .plan.pro { border-color:#4f46e5; box-shadow:0 8px 28px rgba(79,70,229,.12); position:relative; }
          .plan .badge { position:absolute; top:-12px; left:24px; background:#4f46e5; color:#fff; font-size:12px; font-weight:700; padding:4px 10px; border-radius:99px; }
          .plan h3 { font-size:15px; color:#5d5a6b; margin-bottom:6px; } .plan .price { font-size:32px; font-weight:800; margin-bottom:14px; }
          .plan li { list-style:none; font-size:14px; color:#5d5a6b; padding:5px 0; }
          .plan button { width:100%; margin-top:14px; padding:10px; border-radius:8px; border:1px solid #d8d5cc; background:#fff; cursor:pointer; }
          .plan.pro button { background:#4f46e5; color:#fff; border:0; }
        </style></head><body>
          <nav><b>Lumen</b><a href="#">Product</a><a href="#">Docs</a><a href="#">Pricing</a><a class="cta-sm" href="#">Sign in</a></nav>
          <div class="hero"><h1>Analytics your whole team can read</h1>
          <p>Dashboards, alerts and reports — wired up in minutes, not sprints.</p>
          <button id="cta">Start free trial</button></div>
          <div class="plans">
            <div class="plan"><h3>Starter</h3><div class="price">$0</div><ul><li>✓ 3 dashboards</li><li>✓ 1 seat</li><li>✓ Community support</li></ul><button>Choose</button></div>
            <div class="plan pro"><span class="badge">Most popular</span><h3>Pro</h3><div class="price">$29</div><ul><li>✓ Unlimited dashboards</li><li>✓ 10 seats</li><li>✓ Alerts &amp; exports</li></ul><button id="choose-pro">Choose Pro</button></div>
            <div class="plan"><h3>Scale</h3><div class="price">$99</div><ul><li>✓ Everything in Pro</li><li>✓ SSO &amp; audit log</li><li>✓ Priority support</li></ul><button>Talk to us</button></div>
          </div>
        </body></html>`);
        return;
      }
      res.writeHead(404); res.end();
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as { port: number };
      resolve({ server, base: `http://127.0.0.1:${addr.port}` });
    });
  });

// Seed a realistic timeline: a page divider, three captured elements on a
// pricing page, with threaded review comments. Runs entirely in page context.
const seedState = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const sp: any = (window as any).__pinchgrab_panel;
    const now = () => new Date().toISOString();
    sp.clear();
    sp.setPrefs({ autoScreenshot: true });

    const url = 'https://acme.example/pricing';

    // Build small, attractive thumbnail dataURLs in-page (canvas), one per
    // captured selector. These stand in for the side-panel-friendly
    // downscaled screenshots a real capture would produce.
    const makeThumb = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void): string => {
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      const c = cv.getContext('2d')!;
      draw(c);
      return cv.toDataURL('image/png');
    };

    const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      if (c.roundRect) { c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
      else c.fillRect(x, y, w, h);
    };

    // Thumbnails are rendered at the captured element's own aspect ratio so the
    // panel's object-fit:contain image fills the textured preview box edge to
    // edge (rather than letterboxing a mismatched square into it).
    const heroShot = makeThumb(600, 300, (c) => {
      const g = c.createLinearGradient(0, 0, 600, 300);
      g.addColorStop(0, '#171327'); g.addColorStop(1, '#2c2142');
      c.fillStyle = g; c.fillRect(0, 0, 600, 300);
      c.fillStyle = '#f4f0ff'; c.font = 'bold 34px sans-serif';
      c.fillText('Ship UI feedback', 48, 110);
      c.fillText('your agent can read', 48, 152);
      c.fillStyle = '#a99dc7'; c.font = '16px sans-serif';
      c.fillText('Capture any element. Comment in plain English. Export JSONL.', 48, 192);
      c.fillStyle = '#ff5f00'; rr(c, 48, 222, 190, 48, 8);
      c.fillStyle = '#fff'; c.font = 'bold 17px sans-serif'; c.fillText('Start free trial', 74, 252);
    });

    const cardShot = makeThumb(320, 360, (c) => {
      c.fillStyle = '#14101e'; c.fillRect(0, 0, 320, 360);
      c.fillStyle = '#211934'; rr(c, 22, 22, 276, 316, 14);
      c.fillStyle = '#ff5f00'; c.font = 'bold 44px sans-serif'; c.fillText('$29', 44, 96);
      c.fillStyle = '#9b8fb8'; c.font = '16px sans-serif'; c.fillText('/month', 134, 96);
      c.fillStyle = '#cfc6e6'; c.font = '15px sans-serif';
      let y = 140;
      for (const line of ['Unlimited captures', 'Full screenshot export', 'Team workspaces', 'Priority support']) {
        c.fillStyle = '#7bd97a'; c.fillText('✓', 44, y);
        c.fillStyle = '#cfc6e6'; c.fillText(line, 70, y);
        y += 34;
      }
      c.fillStyle = '#3a2d57'; rr(c, 44, 286, 232, 40, 8);
      c.fillStyle = '#cabfe6'; c.font = 'bold 15px sans-serif'; c.fillText('Choose Pro', 120, 312);
    });

    const badgeShot = makeThumb(260, 56, (c) => {
      c.fillStyle = '#0e0d14'; c.fillRect(0, 0, 260, 56);
      c.fillStyle = '#2bbd6e'; rr(c, 8, 10, 200, 36, 18);
      c.fillStyle = '#06210f'; c.font = 'bold 16px sans-serif'; c.fillText('Most popular', 40, 33);
    });

    const captures: Array<{ entry: any; thumb: string; comments: string[] }> = [
      {
        entry: {
          n: 1, ts: now(), url, tag: 'section', selector: '.hero',
          text: 'Ship UI feedback your agent can read', classes: ['hero'],
          rect: { x: 80, y: 120, w: 600, h: 300 },
          viewport: { w: 1280, h: 800, dpr: 2 },
          outerHTML: '<section class="hero"><h1>Ship UI feedback your agent can read</h1><a class="cta">Start free trial</a></section>',
        },
        thumb: heroShot,
        comments: [
          'Headline is great, but the CTA contrast is borderline on the dark bg — bump it one step.',
          'Tighten the gap between H1 and subhead by ~8px so it reads as one block.',
        ],
      },
      {
        entry: {
          n: 2, ts: now(), url, tag: 'div', selector: '.plan-card.pro',
          text: '$29 /month', classes: ['plan-card', 'pro'],
          rect: { x: 440, y: 480, w: 320, h: 360 },
          viewport: { w: 1280, h: 800, dpr: 2 },
          outerHTML: '<div class="plan-card pro"><span class="price">$29</span><ul class="features">…</ul><button>Choose Pro</button></div>',
        },
        thumb: cardShot,
        comments: ['The "Choose Pro" button should be the primary orange — right now it disappears.'],
      },
      {
        entry: {
          n: 3, ts: now(), url, tag: 'span', selector: '.plan-card.pro .badge',
          text: 'Most popular', classes: ['badge'],
          rect: { x: 470, y: 460, w: 130, h: 28 },
          viewport: { w: 1280, h: 800, dpr: 2 },
          outerHTML: '<span class="badge">Most popular</span>',
        },
        thumb: badgeShot,
        comments: [],
      },
    ];

    // One page divider, then each selector followed by its threaded comments.
    sp.pushMessage({ type: 'page', id: 'pg-1', ts: now(), url, title: 'Acme — Pricing' });
    let sidx = 0;
    for (const cap of captures) {
      const sid = 'sel-' + (++sidx);
      sp.pushMessage({ type: 'selector', id: sid, ts: now(), entry: cap.entry });
      let cidx = 0;
      for (const text of cap.comments) {
        sp.pushMessage({ type: 'feedback', id: `${sid}-fb-${++cidx}`, ts: now(), text });
      }
    }

    // Hydrate the inline-preview `shots` map via its localStorage backing key,
    // then reload the workspace so previews paint as real thumbnails.
    const shotMap: Record<string, string> = {};
    for (const cap of captures) shotMap[cap.entry.selector] = cap.thumb;
    localStorage.setItem('pinchgrab.ws.default.shots.v1', JSON.stringify(shotMap));
  });

  // Reload the default workspace so `shots` rehydrates from localStorage and
  // the previews render as images (not skeletons). switchWorkspace re-reads
  // messages from storage too, so the seeded timeline is preserved.
  await page.evaluate(async () => {
    await (window as any).__pinchgrab_panel.switchWorkspace('default');
  });

  // Give the thumbnail <img> elements a beat to decode so .loaded is set and
  // the skeleton underlay is gone before we screenshot.
  await page.waitForFunction(() => {
    const imgs = [...document.querySelectorAll('.msg.selector .preview img.shot')] as HTMLImageElement[];
    return imgs.length >= 3 && imgs.every((i) => i.complete && i.naturalWidth > 0);
  }, undefined, { timeout: 10_000 });
  await page.waitForTimeout(300);
};

const run = async (): Promise<void> => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { server, base } = await startServer();
  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.error('[pageerror]', e.message));
    await page.goto(base + '/');
    await page.waitForFunction(() => Boolean((window as any).__pinchgrab_panel), undefined, { timeout: 10_000 });

    await seedState(page);

    // Render auto-scrolls the timeline to the bottom; pull it back to the top
    // so the page divider and the hero capture (#1, the strongest visual) lead
    // the shot instead of opening mid-list.
    await page.evaluate(() => {
      const list = document.querySelector('[data-list]') as HTMLElement | null;
      if (list) list.scrollTop = 0;
    });
    await page.waitForTimeout(150);
    await page.evaluate(() => {
      const list = document.querySelector('[data-list]') as HTMLElement | null;
      if (list) list.scrollTop = 0;
    });

    // Raw panel capture is a SOURCE (embedded in the marquee frame), not a
    // shipped listing screenshot — full-app captures read as tiny noise at
    // carousel scale. The shipped screenshots are the composed frames below.
    const mainPath = path.join(OUT_DIR, 'src-panel-1280x800.png');
    await page.screenshot({ path: mainPath, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log('wrote', mainPath);

    // Small promo tile (440×280): a BRAND tile, not a screenshot — CWS image
    // guidelines: "Don't just use a screenshot; your images should primarily
    // communicate the brand", "Avoid text", "Assume the image will be on a
    // light gray background", "Use saturated colors", "Fill the entire
    // region". Mark + wordmark only, saturated dark gradient, defined edges.
    const promoPage = await ctx.newPage();
    await promoPage.setViewportSize({ width: 440, height: 280 });
    await promoPage.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      * { margin: 0; box-sizing: border-box; }
      body {
        width: 440px; height: 280px; overflow: hidden;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
        font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
        background:
          radial-gradient(360px 240px at 50% -20%, rgba(255,95,0,.30), transparent 62%),
          radial-gradient(300px 200px at 50% 120%, rgba(239,75,0,.22), transparent 60%),
          linear-gradient(160deg, #1a1923 0%, #0e0d14 100%);
        border: 2px solid rgba(255,95,0,.65);
      }
      .mark { font-size: 108px; line-height: 1; filter: drop-shadow(0 6px 22px rgba(255,95,0,.35)); }
      h1 { font-size: 44px; font-weight: 800; letter-spacing: -1px; color: #fcfaf5; }
      h1 .grab { color: #ff5f00; }
    </style></head><body>
      <div class="mark">🤏</div>
      <h1>Pinch<span class="grab">Grab</span></h1>
    </body></html>`);
    await promoPage.waitForTimeout(300);
    const promoPath = path.join(OUT_DIR, 'promo-440x280.png');
    await promoPage.screenshot({ path: promoPath, clip: { x: 0, y: 0, width: 440, height: 280 } });
    console.log('wrote', promoPath);

    // Marquee tile (1400×560): a brand banner, not a raw UI shot — mark +
    // name + tagline on the left, the real panel screenshot framed on the
    // right. Colors come from the side panel's own tokens (sidepanel.css).
    const shotB64 = fs.readFileSync(mainPath).toString('base64');
    const marqueePage = await ctx.newPage();
    await marqueePage.setViewportSize({ width: 1400, height: 560 });
    await marqueePage.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      * { margin: 0; box-sizing: border-box; }
      body {
        width: 1400px; height: 560px; overflow: hidden; display: flex;
        font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
        color: #fcfaf5;
        background:
          radial-gradient(900px 500px at 88% -10%, rgba(255,95,0,.16), transparent 60%),
          radial-gradient(700px 420px at -8% 110%, rgba(255,95,0,.10), transparent 55%),
          linear-gradient(135deg, #0e0d14 0%, #15141d 55%, #1a1923 100%);
      }
      .left { flex: 0 0 620px; padding: 72px 24px 72px 72px; display: flex; flex-direction: column; justify-content: center; }
      .mark { font-size: 76px; line-height: 1; margin-bottom: 18px; }
      h1 { font-size: 64px; font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; }
      h1 .grab { color: #ff5f00; }
      .tag { font-size: 26px; line-height: 1.35; color: #cbc7d3; margin-bottom: 26px; max-width: 480px; }
      .pills { display: flex; gap: 10px; flex-wrap: wrap; }
      .pill {
        font: 600 15px/1 monospace; color: #fcfaf5; padding: 9px 14px;
        border: 1px solid rgba(255,95,0,.55); border-radius: 999px;
        background: rgba(255,95,0,.12);
      }
      .right { flex: 1; position: relative; }
      .frame {
        position: absolute; top: 54px; left: 10px; width: 760px;
        border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(252,250,245,.14);
        box-shadow: 0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4);
        transform: rotate(-1.2deg);
        background: #0e0d14;
      }
      .chrome { height: 34px; display: flex; align-items: center; gap: 7px; padding: 0 14px; background: #221f2c; }
      .dot { width: 11px; height: 11px; border-radius: 50%; background: #4a455a; }
      .dot:first-child { background: #ff5f00; }
      .frame img { display: block; width: 100%; }
    </style></head><body>
      <div class="left">
        <div class="mark">🤏</div>
        <h1>Pinch<span class="grab">Grab</span></h1>
        <div class="tag">UI feedback your AI coding agent can actually act on.</div>
        <div class="pills">
          <span class="pill">Alt+Click to capture</span>
          <span class="pill">Comment in English</span>
          <span class="pill">Export for your agent</span>
        </div>
      </div>
      <div class="right">
        <div class="frame">
          <div class="chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
          <img src="data:image/png;base64,${shotB64}" alt="">
        </div>
      </div>
    </body></html>`);
    await marqueePage.waitForTimeout(400);
    const marqueePath = path.join(OUT_DIR, 'marquee-1400x560.png');
    await marqueePage.screenshot({ path: marqueePath, clip: { x: 0, y: 0, width: 1400, height: 560 } });
    console.log('wrote', marqueePath);

    // ─── Store screenshots: composed frames, not raw app dumps ────────────
    // At carousel scale (~640×400) a full-app capture is illegible noise.
    // Each shipped screenshot is ONE idea: a real UI crop captured at 2×
    // (crisp when shown large) set on the brand-dark gradient with a short
    // outcome headline. Same visual system as the promo tile + marquee so
    // the whole listing reads as one designed set.
    const px = (n: number | undefined): number => Math.round(n ?? 0);
    const grabRegion = async (
      p: import('playwright').Page,
      rect: { x: number; y: number; w: number; h: number },
      pad = 14,
    ): Promise<string> => {
      const vp = p.viewportSize()!;
      const x = Math.max(0, rect.x - pad);
      const y = Math.max(0, rect.y - pad);
      const buf = await p.screenshot({ clip: {
        x, y,
        width: Math.min(vp.width - x, rect.w + pad * 2),
        height: Math.min(vp.height - y, rect.h + pad * 2),
      } });
      return buf.toString('base64');
    };

    const composeFrame = async (
      out: string,
      opts: { kicker: string; headline: string; sub: string; imgB64: string; imgWidth: number; tilt?: number },
    ): Promise<void> => {
      const fp = await ctx.newPage();
      await fp.setViewportSize({ width: 1280, height: 800 });
      await fp.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        * { margin:0; box-sizing:border-box; }
        body {
          width:1280px; height:800px; overflow:hidden;
          display:flex; flex-direction:column; align-items:center;
          font-family:-apple-system,'Segoe UI',Roboto,sans-serif; color:#fcfaf5;
          background:
            radial-gradient(820px 460px at 85% -12%, rgba(255,95,0,.17), transparent 60%),
            radial-gradient(640px 420px at 2% 112%, rgba(239,75,0,.12), transparent 55%),
            linear-gradient(150deg, #16151f 0%, #0e0d14 60%, #131019 100%);
        }
        .top { width:100%; padding:56px 84px 26px; }
        .kicker { font:700 15px/1 ui-monospace,monospace; color:#ff5f00; letter-spacing:.14em; text-transform:uppercase; margin-bottom:14px; }
        h1 { font-size:56px; font-weight:800; letter-spacing:-1.2px; line-height:1.06; }
        h1 .a { color:#ff5f00; }
        .sub { margin-top:12px; font-size:21px; color:#cbc7d3; max-width:900px; }
        .stage { flex:1; width:100%; display:flex; justify-content:center; align-items:flex-start; padding:6px 84px 0; }
        .card {
          border-radius:14px; overflow:hidden;
          border:1px solid rgba(255,95,0,.35);
          box-shadow: 0 34px 90px rgba(0,0,0,.65), 0 0 60px rgba(255,95,0,.10);
          transform: rotate(var(--tilt, -0.7deg));
          background:#0e0d14;
        }
        .card img { display:block; width:var(--w); }
      </style></head><body>
        <div class="top">
          <div class="kicker">${opts.kicker}</div>
          <h1>${opts.headline}</h1>
          <div class="sub">${opts.sub}</div>
        </div>
        <div class="stage"><div class="card" style="--w:${opts.imgWidth}px; --tilt:${opts.tilt ?? -0.7}deg">
          <img src="data:image/png;base64,${opts.imgB64}" alt="">
        </div></div>
      </body></html>`);
      await fp.waitForTimeout(250);
      await fp.screenshot({ path: out, clip: { x: 0, y: 0, width: 1280, height: 800 } });
      await fp.close();
      console.log('wrote', out);
    };

    // 2× context for crisp crops.
    const hi = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });

    // ── Source A: on-page capture (ring + comment box) on the demo page ──
    const onpage = await hi.newPage();
    await onpage.goto(base + '/demo');
    await onpage.addScriptTag({ content: fs.readFileSync(path.join(SRC, 'content-script.js'), 'utf-8') });
    await onpage.waitForFunction(() => Boolean((window as any).__pinchgrab));
    await onpage.keyboard.down('Alt');
    await onpage.hover('#cta');
    await onpage.waitForTimeout(250);
    await onpage.click('#cta');
    await onpage.waitForTimeout(200);
    await onpage.hover('#cta');
    await onpage.waitForTimeout(250);
    // Panel-side ack via the standalone bridge opens the on-page comment box;
    // no pointer movement afterward (movement dismisses an unlocked box).
    await onpage.evaluate(() => {
      const cap = (window as any).__pinchgrab.captures[0];
      window.dispatchEvent(new CustomEvent('pinchgrab:to-cs', {
        detail: {
          kind: 'annotation', selector: cap.entry.selector,
          payload: { uid: cap.entry.uid, n: cap.entry.n, captured: true, feedback: ['Bump the contrast a step — this is the primary action.'] },
        },
      }));
    });
    await onpage.waitForTimeout(600);
    const onpageRect = await onpage.evaluate(() => {
      const cta = document.querySelector('#cta')!.getBoundingClientRect();
      const box = document.getElementById('__pinchgrab_overlay')?.shadowRoot
        ?.querySelector('.annotation')?.getBoundingClientRect();
      const l = Math.min(cta.left, box?.left ?? cta.left);
      const t = Math.min(cta.top, box?.top ?? cta.top);
      const r = Math.max(cta.right, box?.right ?? cta.right);
      const b = Math.max(cta.bottom, box?.bottom ?? cta.bottom);
      return { x: l, y: t, w: r - l, h: b - t };
    });
    const srcOnpage = await grabRegion(onpage, {
      x: px(onpageRect.x), y: px(onpageRect.y), w: px(onpageRect.w), h: px(onpageRect.h),
    }, 36);
    await onpage.keyboard.up('Alt');

    // ── Panel sources at real side-panel width (460px) so cards read true ──
    const panel = await hi.newPage();
    await panel.setViewportSize({ width: 460, height: 900 });
    await panel.goto(base + '/');
    await panel.waitForFunction(() => Boolean((window as any).__pinchgrab_panel), undefined, { timeout: 10_000 });
    await seedState(panel);
    await panel.evaluate(() => { (document.querySelector('[data-list]') as HTMLElement).scrollTop = 0; });
    await panel.waitForTimeout(250);

    // Source B: first capture card + its comment bubbles. Comments render as
    // separate .msg.feedback bubbles (right-aligned), so span the LIST from
    // the first card's top to the next capture card's top.
    const cardRect = await panel.evaluate(() => {
      const list = document.querySelector('[data-list]')!.getBoundingClientRect();
      const cards = [...document.querySelectorAll('.msg.selector')] as HTMLElement[];
      const top = cards[0]!.getBoundingClientRect().top;
      const bottom = cards[1] ? cards[1].getBoundingClientRect().top - 10 : top + 520;
      return { x: list.left, y: top, w: list.width, h: bottom - top };
    });
    const srcCard = await grabRegion(panel, { x: px(cardRect.x), y: px(cardRect.y), w: px(cardRect.w), h: px(cardRect.h) });

    // Source C: the capture's JSON body (selector + outerHTML — the payload
    // an agent receives). Hidden until the card's peek expands, so expand
    // first and guard against zero-size rects (a hidden element's 0×0 rect
    // would silently crop the panel header).
    await panel.evaluate(() => { (document.querySelector('.peek-summary') as HTMLElement | null)?.click(); });
    await panel.waitForTimeout(350);
    const jsonRect = await panel.evaluate(() => {
      const el = document.querySelector('.body-json') as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 80 || r.height < 60) return null;
      return { x: r.left, y: Math.max(0, r.top), w: r.width, h: Math.min(r.height, 380) };
    });
    const srcJson = jsonRect ? await grabRegion(panel, { x: px(jsonRect.x), y: px(jsonRect.y), w: px(jsonRect.w), h: px(jsonRect.h) }) : srcCard;
    if (!jsonRect) console.warn('source C fell back to the capture card (no visible .body-json)');
    await panel.evaluate(() => { (document.querySelector('.peek-summary') as HTMLElement | null)?.click(); });

    // Source D: workspaces group in the drawer.
    await panel.evaluate(async () => {
      const sp: any = (window as any).__pinchgrab_panel;
      await sp.createWorkspace('app.lumen.dev');
      await sp.createWorkspace('dashboard — staging');
      await sp.createWorkspace('docs.lumen.dev');
      await sp.switchWorkspace('default');
      sp.openDrawer();
    });
    await panel.waitForTimeout(400);
    const wsRect = await panel.evaluate(() => {
      for (const d of document.querySelectorAll('.drawer details.prefs')) {
        if (d.querySelector('summary')?.textContent?.trim() === 'Workspaces') {
          const r = d.getBoundingClientRect();
          return { x: r.left, y: r.top, w: r.width, h: r.height };
        }
      }
      return null;
    });
    const srcWs = wsRect ? await grabRegion(panel, { x: px(wsRect.x), y: px(wsRect.y), w: px(wsRect.w), h: px(wsRect.h) }) : srcCard;

    // Source E: the DESIGN.md (brand education) card.
    await panel.evaluate(() => {
      for (const d of document.querySelectorAll<HTMLDetailsElement>('.drawer details.prefs')) {
        d.open = d.querySelector('summary')?.textContent?.trim() === 'Templates';
      }
    });
    await panel.waitForTimeout(400);
    const designRect = await panel.evaluate(() => {
      const el = document.querySelector('[data-md-preview="design"]')?.closest('.md-preview-row')?.parentElement as HTMLElement | null;
      const r = (el ?? document.querySelector('[data-md-preview="design"]'))!.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    });
    const srcDesign = await grabRegion(panel, { x: px(designRect.x), y: px(designRect.y), w: px(designRect.w), h: px(designRect.h) });

    // ── Compose the five shipped screenshots (story order = the trail) ──
    await composeFrame(path.join(OUT_DIR, 'screenshot-1-1280x800.png'), {
      kicker: 'Alt+Click any element',
      headline: 'Point at <span class="a">what\'s wrong.</span>',
      sub: 'PinchGrab rings the element on the live page and opens a comment box right there.',
      imgB64: srcOnpage, imgWidth: 780, tilt: -0.8,
    });
    await composeFrame(path.join(OUT_DIR, 'screenshot-2-1280x800.png'), {
      kicker: 'Comments stay paired',
      headline: 'Say it in <span class="a">plain English.</span>',
      sub: 'Every note stays attached to the exact element you grabbed — screenshot included.',
      imgB64: srcCard, imgWidth: 620, tilt: 0.7,
    });
    await composeFrame(path.join(OUT_DIR, 'screenshot-3-1280x800.png'), {
      kicker: 'Selectors, HTML, screenshots, notes',
      headline: 'Hand your agent the <span class="a">exact element.</span>',
      sub: 'Export a structured bundle — or copy one capture — for Claude, Cursor, or any coding agent.',
      imgB64: srcJson, imgWidth: 640, tilt: -0.6,
    });
    await composeFrame(path.join(OUT_DIR, 'screenshot-4-1280x800.png'), {
      kicker: 'One workspace per tab',
      headline: 'Critique <span class="a">many sites</span> at once.',
      sub: 'Each tab you activate gets its own workspace — switch back and forth without mixing feedback.',
      imgB64: srcWs, imgWidth: 700, tilt: 0.6,
    });
    await composeFrame(path.join(OUT_DIR, 'screenshot-5-1280x800.png'), {
      kicker: 'DESIGN.md ships with every export',
      headline: 'Teach it <span class="a">your brand.</span>',
      sub: 'Your colors, type, and voice ride along, so the agent fixes things the way you would.',
      imgB64: srcDesign, imgWidth: 700, tilt: -0.6,
    });

    await hi.close();
    await ctx.close();
  } finally {
    await browser?.close();
    server.close();
  }
};

run().catch((err) => { console.error(err); process.exit(1); });
