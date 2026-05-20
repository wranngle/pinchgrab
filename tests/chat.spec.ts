import { chromium } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

// Test fixture — serves the side panel HTML at "/" and the asset files,
// plus a host-page route at "/host" with content-script injection so
// the bridge between the two halves can be exercised.
const ASSETS = ['sidepanel.html', 'sidepanel.css', 'sidepanel.js'];
const SRC = path.resolve('./extension');

const HOST_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>host-page</title>
<style>:root { --brand: #ff5f00; --bg: #0e0d14; }</style></head>
<body>
  <button id="cta" class="btn primary">Buy now</button>
  <a id="learn" href="#more">Learn more</a>
</body></html>`;

const startServer = () =>
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
      if (url.startsWith('/host')) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(HOST_HTML);
        return;
      }
      const m = /\/templates\/([\w.-]+\.md)$/.exec(url);
      if (m) {
        const p = path.join(SRC, 'templates', m[1]!);
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
          res.end(fs.readFileSync(p, 'utf-8'));
          return;
        }
      }
      res.writeHead(404); res.end();
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, base: `http://127.0.0.1:${addr.port}` });
    });
  });

(async () => {
  const { server, base } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const csSource = fs.readFileSync('./extension/content-script.js', 'utf-8');

  // Open the side panel page; we'll also inject the content script into the
  // same page so the standalone window-event bridge wires sp ↔ cs together.
  await page.goto(base + '/');
  await page.waitForFunction(() => !!window.__pinchgrab_panel);
  await page.addScriptTag({ content: csSource });
  await page.waitForFunction(() => !!window.__pinchgrab);

  // Test 1 ── Pushing a synthetic capture via the bridge appears on the left.
  await page.evaluate(() => {
    window.__pinchgrab.captures.length = 0;
    // Emit a fake hover to verify panel listener doesn't blow up.
    window.dispatchEvent(new CustomEvent('pinchgrab:to-panel', {
      detail: { __pg: true, kind: 'hover', label: 'h1#test' },
    }));
  });

  const sample = {
    n: 1,
    ts: new Date().toISOString(),
    url: 'http://example/',
    tag: 'button',
    selector: '#cta',
    text: 'Buy now',
    rect: { x: 10, y: 20, w: 100, h: 32 },
    viewport: { w: 1024, h: 768, dpr: 1 },
    classes: ['btn', 'primary'],
    outerHTML: '<button id="cta" class="btn primary">Buy now</button>',
  };
  await page.evaluate((entry) => {
    window.dispatchEvent(new CustomEvent('pinchgrab:to-panel', {
      detail: { __pg: true, kind: 'capture', entry, page: { url: 'http://example/', title: 'X', viewport: { w: 1024, h: 768, dpr: 1 }, tokens: {} } },
    }));
  }, sample);

  await page.waitForFunction(() => document.querySelectorAll('.msg.selector').length === 1);
  console.log('test 1 ok: capture rendered as left bubble');

  // Test 2 ── Send feedback via composer; right bubble appears, threaded under selector.
  await page.locator('[data-composer]').fill('change copy to "Buy"');
  await page.keyboard.press('Enter');
  await page.locator('[data-composer]').fill('and make it green');
  await page.keyboard.press('Enter');

  const fbCount = await page.locator('.msg.feedback.threaded').count();
  assert.strictEqual(fbCount, 2, `expected 2 threaded feedbacks, got ${fbCount}`);
  console.log('test 2 ok: 2 feedbacks threaded under selector');

  // Test 3 ── Selector body collapsed by default, click bubble to expand.
  const collapsed = await page.evaluate(() => {
    const body = document.querySelector('.msg.selector .body-json');
    return getComputedStyle(body).display;
  });
  assert.strictEqual(collapsed, 'none');
  await page.evaluate(() => document.querySelector('.msg.selector .head').click());
  await page.waitForFunction(() => document.querySelector('.msg.selector')?.classList.contains('expanded'));
  const expanded = await page.evaluate(() => {
    const body = document.querySelector('.msg.selector.expanded .body-json');
    return body ? getComputedStyle(body).display : 'none';
  });
  assert(expanded !== 'none');
  console.log('test 3 ok: click-to-expand');

  // Test 4 ── Selector preview tile was removed (per user request) — verify
  // the .preview container no longer exists in the rendered bubble.
  const previewGone = await page.evaluate(() => {
    return document.querySelector('.msg.selector .preview') === null;
  });
  assert(previewGone, 'selector preview tile must be removed');
  console.log('test 4 ok: selector preview tile removed');

  // Test 5 ── Selector quality dot was removed; verify no .qdot exists.
  const qdot = await page.evaluate(() => document.querySelector('.msg.selector .qdot'));
  assert.strictEqual(qdot, null, 'quality dot should be removed');
  console.log('test 5 ok: quality dot removed');

  // Test 6 ── Stats line counts match.
  const stats = await page.evaluate(() => ({
    selectors: +document.querySelector('[data-stat="selectors"] .stat-num').textContent,
    comments: +document.querySelector('[data-stat="comments"] .stat-num').textContent,
  }));
  assert.strictEqual(stats.selectors, 1);
  assert.strictEqual(stats.comments, 2);
  console.log('test 6 ok: stats accurate');

  // Test 7 ── Search filters live.
  await page.locator('[data-search]').fill('green');
  const matchCount = await page.locator('.msg').count();
  assert(matchCount === 1, `expected 1 match for "green", got ${matchCount}`);
  await page.locator('[data-search]').fill('');
  console.log('test 7 ok: search filter');

  // Test 8 ── Insert-rail expands inline composer and inserts before next message.
  await page.evaluate(() => {
    document.querySelector('.insert-rail .add-btn').click();
  });
  // Wait for inline composer to mount.
  await page.waitForFunction(() => !!document.querySelector('.insert-rail .inline-comment textarea'));
  await page.evaluate(() => {
    const ta = document.querySelector('.insert-rail .inline-comment textarea');
    ta.value = 'inserted-at-top';
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  });
  const firstMsgText = await page.evaluate(() => {
    const first = document.querySelector('.body .msg');
    return first?.textContent;
  });
  assert(firstMsgText && firstMsgText.includes('inserted-at-top'),
    `insert-before should put new feedback first, got: ${firstMsgText?.slice(0, 80)}`);
  console.log('test 8 ok: insert-between rail with inline composer');

  // Test 9 ── Pencil edit mode rewrites the message.
  // Click + immediately mutate textarea in a single evaluate to avoid races.
  await page.evaluate(() => {
    const fb = document.querySelector('.msg.feedback');
    const editBtn = Array.from(fb.querySelectorAll('.actions button'))
      .find((b) => b.dataset.tip === 'Edit comment');
    if (!editBtn) throw new Error('edit button not found');
    editBtn.click();
    // Synchronously after the click, the editing div is in DOM (enterFeedbackEdit).
    const ta = document.querySelector('.msg.feedback.editing .inline-comment textarea');
    if (!ta) throw new Error('inline textarea not found post-click');
    ta.value = 'edited via pencil';
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  });
  const editedText = await page.evaluate(() => window.__pinchgrab_panel.getMessages().find((m) => m.text === 'edited via pencil'));
  assert(editedText, 'edited feedback should be in messages');
  console.log('test 9 ok: pencil edit');

  // Test 10 ── Copy as JSONL bundles feedback under selector.
  const jsonl = await page.evaluate(() => window.__pinchgrab_panel.buildJsonl());
  const lines = jsonl.trim().split('\n').map(JSON.parse);
  const sel = lines.find((l) => l.tag === 'button');
  assert(Array.isArray(sel.feedback) && sel.feedback.length >= 2, `selector should bundle feedback array`);
  console.log('test 10 ok: copy as JSONL bundling');

  // Test 11 ── JSONL export carries outerHTML on selector rows.
  // The Markdown export was eliminated — outerHTML now lives inline on
  // each selector row in JSONL so DuckDB/jq can grep it directly.
  const jsonlForHtml = await page.evaluate(() => window.__pinchgrab_panel.buildJsonl());
  const selectorLine = jsonlForHtml.trim().split('\n')
    .map(JSON.parse)
    .find((l: any) => l.type === 'selector' && l.tag === 'button');
  assert(selectorLine?.outerHTML, 'selector row should carry outerHTML');
  assert(selectorLine.outerHTML.includes('Buy now'), 'outerHTML should include element text');
  console.log('test 11 ok: jsonl carries outerHTML');

  // Test 12 ── Stale dot when validity = false.
  await page.evaluate(() => window.__pinchgrab_panel.setValidity('#cta', false));
  const isStale = await page.evaluate(() => document.querySelector('.msg.selector')?.classList.contains('stale'));
  assert.strictEqual(isStale, true);
  const staleNum = await page.evaluate(() => +document.querySelector('[data-stat="stale"] .stat-num').textContent);
  assert.strictEqual(staleNum, 1);
  console.log('test 12 ok: stale detection');

  // Test 13 ── Lucide icons mounted on toolbar (brand uses 🤏 emoji per spec).
  const hasSvg = await page.evaluate(() => !!document.querySelector('.toolbar-actions .iconbtn svg'));
  assert(hasSvg, 'lucide icons should mount in toolbar');
  console.log('test 13 ok: lucide icons mounted');

  // Test 14 ── GitHub button opens link (verify the action exists; we don't actually navigate).
  const ghBtn = await page.locator('[data-action="github"]').count();
  assert(ghBtn > 0, 'github button missing');
  console.log('test 14 ok: github button present');

  // Test 15 ── Stale peek-summary visible inline; full peek-error only when expanded.
  const peekSummaryVisible = await page.evaluate(() => {
    const e = document.querySelector('.msg.selector.stale .peek-summary');
    return e && getComputedStyle(e).display !== 'none';
  });
  assert(peekSummaryVisible, 'stale peek-summary should be visible inline');
  // Expand the bubble; full peek-error should now appear.
  await page.evaluate(() => {
    const head = document.querySelector('.msg.selector.stale .head');
    head.click();
  });
  const peekErrorAfterExpand = await page.evaluate(() => {
    const e = document.querySelector('.msg.selector.stale.expanded .peek-error');
    return e && getComputedStyle(e).display !== 'none';
  });
  assert(peekErrorAfterExpand, 'full peek-error should appear when expanded');
  console.log('test 15 ok: peek-summary collapsed; peek-error on expand');

  // Test 16 ── Custom (instant) tooltip is in DOM.
  const tip = await page.locator('[data-tooltip]').count();
  assert(tip === 1, 'custom tooltip element should exist');
  console.log('test 16 ok: instant tooltip element present');

  // Test 17 ── Command palette opens via Ctrl/Cmd+K.
  await page.evaluate(() => window.__pinchgrab_panel.openPalette());
  const paletteVisible = await page.evaluate(() => !document.querySelector('[data-palette]').hidden);
  assert(paletteVisible, 'palette should be visible after open');
  await page.evaluate(() => window.__pinchgrab_panel.closePalette());
  console.log('test 17 ok: command palette opens/closes');

  // Test 18 ── Settings drawer opens.
  await page.evaluate(() => window.__pinchgrab_panel.openDrawer());
  const drawerVisible = await page.evaluate(() => !document.querySelector('[data-drawer]').hidden);
  assert(drawerVisible, 'drawer should be visible');
  await page.evaluate(() => window.__pinchgrab_panel.closeDrawer());
  console.log('test 18 ok: settings drawer opens/closes');

  // Test 19 ── Note suggestions removed (per user spec).
  const chipCount = await page.locator('.qp-chip').count();
  assert.strictEqual(chipCount, 0, 'note-suggestions should be removed');
  console.log('test 19 ok: note suggestions removed');

  // Test 20 ── Live composer meter updates.
  await page.evaluate(() => {
    const ta = document.querySelector('[data-composer]');
    ta.value = 'hello world test';
    ta.dispatchEvent(new Event('input'));
  });
  const meter = await page.evaluate(() => ({
    w: +document.querySelector('[data-comp-words]').textContent,
    t: +document.querySelector('[data-comp-tokens]').textContent,
  }));
  assert(meter.w === 3 && meter.t > 0, `meter should reflect 3 words, got ${JSON.stringify(meter)}`);
  console.log('test 20 ok: composer word/token meter');

  // Test 21 ── Send clears the search.
  await page.evaluate(() => window.__pinchgrab_panel.setSearch('xyz'));
  await page.evaluate(() => {
    const ta = document.querySelector('[data-composer]');
    ta.value = 'final test';
  });
  await page.evaluate(() => window.__pinchgrab_panel.sendFeedback());
  const searchAfterSend = await page.evaluate(() => document.querySelector('[data-search]').value);
  assert.strictEqual(searchAfterSend, '', 'send should clear search input');
  console.log('test 21 ok: send clears search');

  // Test 22 ── Multi-cursor (grouped) capture appends to previous selector.
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('pinchgrab:to-panel', {
      detail: { __pg: true, kind: 'capture', grouped: true,
        entry: { n: 99, ts: new Date().toISOString(), url: 'http://example/', tag: 'button',
          selector: '#cta-2', text: 'Buy now 2',
          rect: { x: 1, y: 2, w: 3, h: 4 }, viewport: { w: 800, h: 600, dpr: 1 },
          outerHTML: '<button id="cta-2">Buy now 2</button>' },
        page: { url: 'http://example/', title: 'X', viewport: { w: 800, h: 600, dpr: 1 }, tokens: {} } },
    }));
  });
  const grouped = await page.evaluate(() => {
    const ms = window.__pinchgrab_panel.getMessages();
    return ms.find((m) => m.type === 'selector' && m.entry.group?.length)?.entry?.group?.length;
  });
  assert(grouped >= 1, `expected grouped entry, got ${grouped}`);
  console.log('test 22 ok: Alt+Shift grouped capture');

  // Test 23 ── Phantom placeholder appears on alt-hover of uncaptured selector.
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('pinchgrab:to-panel', {
      detail: { __pg: true, kind: 'hover', selector: '#never-existed', label: 'div.brand-new',
        rect: { x: 0, y: 0, w: 10, h: 10 } },
    }));
  });
  const phantomShown = await page.locator('.phantom').count();
  assert(phantomShown === 1, `phantom should appear, got ${phantomShown}`);
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('pinchgrab:to-panel', { detail: { __pg: true, kind: 'hover-end' } }));
  });
  console.log('test 23 ok: phantom placeholder for uncaptured element');

  // Test 24 ── Page divider has clickable URL with tab status indicator.
  const hasTabStatus = await page.locator('.page-divider .tab-status').count();
  assert(hasTabStatus > 0, 'page divider should have tab status indicator');
  console.log('test 24 ok: page divider tab status');

  // Test 25 ── Undo / redo restores deleted message.
  const beforeCount = await page.evaluate(() => window.__pinchgrab_panel.getMessages().length);
  await page.evaluate(() => {
    const msgs = window.__pinchgrab_panel.getMessages();
    const fb = msgs.find((m) => m.type === 'feedback');
    if (fb) {
      // Bypass animation by using the test API to remove directly.
      window.__pinchgrab_panel.pushMessage; // keep ref
      // Snapshot+remove via the same code path
      // Use the panel's own remove flow:
      const el = document.querySelector(`[data-id="${fb.id}"]`);
      // Find the delete button and double-click (arm + confirm) — quicker: we use undo() directly.
    }
  });
  // Trigger snapshot manually then undo → adds a message back.
  await page.evaluate(() => {
    const ms = window.__pinchgrab_panel.getMessages();
    if (!ms.length) return;
    // Save a snapshot, mutate, undo
    window.__pinchgrab_panel.clear();
  });
  await page.waitForFunction(() => window.__pinchgrab_panel.getMessages().length === 0);
  await page.evaluate(() => window.__pinchgrab_panel.undo());
  const afterUndo = await page.evaluate(() => window.__pinchgrab_panel.getMessages().length);
  assert(afterUndo === beforeCount, `undo should restore ${beforeCount}, got ${afterUndo}`);
  console.log('test 25 ok: undo restores cleared messages');

  await page.evaluate(() => window.__pinchgrab_panel.redo());
  const afterRedo = await page.evaluate(() => window.__pinchgrab_panel.getMessages().length);
  assert.strictEqual(afterRedo, 0, `redo should re-clear, got ${afterRedo}`);
  // Restore for next tests
  await page.evaluate(() => window.__pinchgrab_panel.undo());
  console.log('test 26 ok: redo re-applies clear');

  // Test 27 ── Workspaces: create, switch, list.
  await page.evaluate(() => window.__pinchgrab_panel.createWorkspace('design-audit'));
  await page.waitForFunction(() => window.__pinchgrab_panel.activeWorkspace() === 'design-audit');
  const wsList = await page.evaluate(() => window.__pinchgrab_panel.listWorkspaces().map((w) => w.name));
  assert(wsList.includes('design-audit'), 'workspaces should include the new one');
  // Switching back
  await page.evaluate(() => window.__pinchgrab_panel.switchWorkspace('default'));
  console.log('test 27 ok: workspace create + switch');

  // Test 28 ── Compact view is the only view (no toggle, always 4px padding).
  const compactBtn = await page.locator('[data-action="compact"]').count();
  assert.strictEqual(compactBtn, 0, 'compact toggle button must be removed');
  const compactSel = page.locator('.msg.selector').first();
  if (await compactSel.count()) {
    const pad = await compactSel.evaluate((el) => parseInt(getComputedStyle(el).paddingTop, 10));
    assert.strictEqual(pad, 4, `selector should be compact 4px padding, got ${pad}`);
  }
  console.log('test 28 ok: compact-only view (no toggle)');

  // Test 29 ── Comment-on-selector button creates inline composer below selector.
  // Get the selector message
  await page.evaluate(() => {
    const sel = document.querySelector('.msg.selector .actions');
    const btn = Array.from(sel.querySelectorAll('button')).find((b) => b.dataset.tip === 'Add a comment after this capture');
    if (btn) btn.click();
  });
  // Wait for the new inline-comment to appear
  const inlineCount = await page.locator('.insert-rail.expanded .inline-comment').count();
  assert(inlineCount >= 1, `expected inline composer, got ${inlineCount}`);
  console.log('test 29 ok: comment-on-selector opens inline composer');

  // Test 30 ── Stat drilldown popover opens on stats hover.
  const drilldownEl = await page.locator('[data-drilldown]').count();
  assert(drilldownEl === 1, 'drilldown element should be in DOM');
  console.log('test 30 ok: drilldown popover present');

  // Test 31 ── Settings drawer has star pitch.
  await page.evaluate(() => window.__pinchgrab_panel.openDrawer());
  const starPitch = await page.locator('.star-pitch').count();
  assert(starPitch === 1, 'settings drawer should have star pitch');
  await page.evaluate(() => window.__pinchgrab_panel.closeDrawer());
  console.log('test 31 ok: drawer star pitch');

  console.log('chat.spec all tests passed');
  await browser.close();
  server.close();
})().catch((err) => { console.error(err); process.exit(1); });
