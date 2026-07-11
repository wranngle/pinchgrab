// Compose the NOODLE FESTIVAL card from the raw x11grab that
// scripts/noodle-drive.ts produced. Same visual system as
// scripts/capture-store-shots.ts composeFrame (brand dark gradient, mono
// kicker, tilted framed shot) at 1600x900 (@2x).
//
// Numbers on the card are the MEASURED values from
// docs/brand/noodle-festival-measurements.json; nothing here invents a count.
//
// Run from the repo root, after scripts/noodle-drive.ts:
//   bun scripts/compose-noodle-card.ts

import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BRAND_DIR = path.join(process.cwd(), 'docs', 'brand');

const run = async (): Promise<void> => {
  const m = JSON.parse(fs.readFileSync(path.join(BRAND_DIR, 'noodle-festival-measurements.json'), 'utf-8')) as {
    noodles: number;
    rings: number;
    committedSelectors: number;
  };
  const shotB64 = fs.readFileSync(path.join(BRAND_DIR, 'noodle-festival.png')).toString('base64');
  const browser = await chromium.launch({headless: true});
  const ctx = await browser.newContext({viewport: {width: 1600, height: 900}, deviceScaleFactor: 2});
  const fp = await ctx.newPage();
  await fp.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    * { margin:0; box-sizing:border-box; }
    body {
      width:1600px; height:900px; overflow:hidden;
      display:flex; flex-direction:column; align-items:center;
      font-family:-apple-system,'Segoe UI',Roboto,sans-serif; color:#fcfaf5;
      background:
        radial-gradient(980px 520px at 85% -12%, rgba(255,95,0,.17), transparent 60%),
        radial-gradient(760px 480px at 2% 112%, rgba(239,75,0,.12), transparent 55%),
        linear-gradient(150deg, #16151f 0%, #0e0d14 60%, #131019 100%);
    }
    .top { width:100%; padding:52px 96px 22px; }
    .kicker { font:700 15px/1 ui-monospace,monospace; color:#ff5f00; letter-spacing:.14em; text-transform:uppercase; margin-bottom:14px; }
    h1 { font-size:54px; font-weight:800; letter-spacing:-1.2px; line-height:1.06; }
    h1 .a { color:#ff5f00; }
    .sub { margin-top:12px; font-size:21px; color:#cbc7d3; max-width:1080px; }
    .stage { flex:1; width:100%; display:flex; justify-content:center; align-items:flex-start; padding:8px 96px 0; }
    .card {
      border-radius:14px; overflow:hidden;
      border:1px solid rgba(255,95,0,.35);
      box-shadow: 0 34px 90px rgba(0,0,0,.65), 0 0 60px rgba(255,95,0,.10);
      transform: rotate(-0.6deg);
      background:#0e0d14;
    }
    .card img { display:block; width:1010px; }
    .foot {
      position:fixed; left:96px; bottom:20px; right:96px;
      font:500 12.5px/1.5 ui-monospace,monospace; color:#847d9a;
    }
    .foot b { color:#a99dc7; font-weight:600; }
  </style></head><body>
    <div class="top">
      <div class="kicker">\u{1F90F} Every noodle is a locator</div>
      <h1>${m.noodles} noodles. <span class="a">One hover.</span></h1>
      <div class="sub">Hover Export and PinchGrab rings every capture on the live page, each one wired back to the docked panel. ${m.committedSelectors} committed captures, a staged pending group, and an open comment box, all at once.</div>
    </div>
    <div class="stage"><div class="card">
      <img src="data:image/png;base64,${shotB64}" alt="">
    </div></div>
    <div class="foot">Measured, not mocked: <b>${m.noodles} connector paths</b> and <b>${m.rings} live rings</b> counted in the extension overlay (#__pinchgrab_overlay shadow root) by noodle-drive.ts; real build driven by Playwright on a demo page, grabbed off the X display.</div>
  </body></html>`);
  await fp.waitForTimeout(400);
  const out = path.join(BRAND_DIR, 'noodle-festival-card.png');
  await fp.screenshot({path: out, clip: {x: 0, y: 0, width: 1600, height: 900}});
  console.log('wrote', out);
  await browser.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
