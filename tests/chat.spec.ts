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

  // Test 4 ── When no screenshot is available (the headless test harness has
  // no background screenshot pipeline, so the shot resolves "unavailable"),
  // the reserved preview placeholder collapses and no .preview tile remains.
  // A reserved skeleton is only shown while a shot is genuinely expected
  // (covered by test 40).
  await page.waitForFunction(() => document.querySelector('.msg.selector .preview') === null);
  console.log('test 4 ok: preview collapses when no screenshot is available');

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

  // Test 7 ── Visual find (Ctrl+F) filters the list live.
  await page.evaluate(() => window.__pinchgrab_panel.setSearch('green'));
  const matchCount = await page.locator('.msg').count();
  assert(matchCount === 1, `expected 1 match for "green", got ${matchCount}`);
  await page.evaluate(() => window.__pinchgrab_panel.setSearch(''));
  console.log('test 7 ok: visual find filter');

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

  // Test 21 ── Send clears the active visual find.
  await page.evaluate(() => window.__pinchgrab_panel.setSearch('xyz'));
  await page.evaluate(() => {
    const ta = document.querySelector('[data-composer]');
    ta.value = 'final test';
  });
  await page.evaluate(() => window.__pinchgrab_panel.sendFeedback());
  const findAfterSend = await page.evaluate(() => ({
    value: document.querySelector('[data-find]')?.value ?? '',
    open: window.__pinchgrab_panel.isFindOpen(),
  }));
  assert.strictEqual(findAfterSend.value, '', 'send should clear the find input');
  assert.strictEqual(findAfterSend.open, false, 'send should close the find bar');
  console.log('test 21 ok: send clears visual find');

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

  // Test 32 ── Empty state is readable and action-oriented.
  await page.evaluate(() => window.__pinchgrab_panel.clear());
  await page.waitForFunction(() => !!document.querySelector('.empty'));
  const parseRgb = (value: string): [number, number, number] => {
    const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(value);
    if (!match) throw new Error(`cannot parse rgb: ${value}`);
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  };
  const srgb = (n: number): number => {
    const channel = n / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  const luminance = ([r, g, b]: [number, number, number]): number => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  const contrast = (a: [number, number, number], b: [number, number, number]): number => {
    const lighter = Math.max(luminance(a), luminance(b));
    const darker = Math.min(luminance(a), luminance(b));
    return (lighter + 0.05) / (darker + 0.05);
  };
  const emptyState = await page.evaluate(() => {
    const empty = document.querySelector<HTMLElement>('.empty')!;
    const text = empty.textContent ?? '';
    return {
      text,
      color: getComputedStyle(empty).color,
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      size: Number.parseFloat(getComputedStyle(empty).fontSize),
    };
  });
  const emptyContrast = contrast(parseRgb(emptyState.color), parseRgb(emptyState.backgroundColor));
  assert(emptyState.text.includes('Alt+Click to capture'), `empty state should include capture action: ${emptyState.text}`);
  assert(emptyContrast >= 4.5, `empty state contrast should pass WCAG AA, got ${emptyContrast.toFixed(2)}`);
  assert(emptyState.size >= 13, `empty state text should be at least 13px, got ${emptyState.size}`);
  console.log('test 32 ok: empty state contrast and copy');

  // Test 33 ── The header search affordance opens the command palette; the
  // Ctrl+F visual find is a separate surface. They are distinct.
  await page.evaluate(() => { window.__pinchgrab_panel.closePalette(); window.__pinchgrab_panel.closeFind(); });
  // Clicking/focusing the header search opens the command palette.
  await page.locator('[data-search]').click();
  const paletteAfterSearchClick = await page.evaluate(() => !document.querySelector<HTMLElement>('[data-palette]')!.hidden);
  assert.strictEqual(paletteAfterSearchClick, true, 'header search click should open the command palette');
  const findClosedWhilePalette = await page.evaluate(() => window.__pinchgrab_panel.isFindOpen());
  assert.strictEqual(findClosedWhilePalette, false, 'header search should NOT open the visual find');
  await page.evaluate(() => window.__pinchgrab_panel.closePalette());
  // Ctrl+F opens the visual find bar (and not the palette).
  await page.keyboard.press('Control+f');
  const findState = await page.evaluate(() => ({
    findOpen: window.__pinchgrab_panel.isFindOpen(),
    paletteOpen: !document.querySelector<HTMLElement>('[data-palette]')!.hidden,
    focusOnFind: document.activeElement === document.querySelector('[data-find]'),
  }));
  assert.strictEqual(findState.findOpen, true, 'Ctrl+F should open the visual find bar');
  assert.strictEqual(findState.paletteOpen, false, 'Ctrl+F should not open the command palette');
  assert.strictEqual(findState.focusOnFind, true, 'Ctrl+F should focus the find input');
  await page.evaluate(() => window.__pinchgrab_panel.closeFind());
  console.log('test 33 ok: header search opens palette, Ctrl+F opens visual find (distinct)');

  // Test 34 ── Icon-only buttons expose accessible names.
  const unnamedButtons = await page.evaluate(() => [...document.querySelectorAll('button')]
    .filter((button) => !button.textContent?.trim() && !button.getAttribute('aria-label'))
    .map((button) => button.outerHTML.slice(0, 120)));
  assert.deepStrictEqual(unnamedButtons, [], `icon-only buttons need names: ${JSON.stringify(unnamedButtons)}`);
  console.log('test 34 ok: icon-only buttons named');

  // Test 35 ── Settings are chunked into deliberate disclosure groups.
  await page.evaluate(() => window.__pinchgrab_panel.openDrawer());
  const settingsGroups = await page.evaluate(() => [...document.querySelectorAll('.drawer details.prefs')].map((details) => ({
    label: details.querySelector('summary')?.textContent?.trim(),
    open: (details as HTMLDetailsElement).open,
  })));
  assert.deepStrictEqual(settingsGroups.map((group) => group.label), ['Workspaces', 'Export', 'Capture', 'Templates', 'Hotkeys', 'Help & about']);
  assert.strictEqual(settingsGroups.filter((group) => group.open).length, 1, 'only Workspaces should be open by default');
  console.log('test 35 ok: settings grouped');

  // Test 36 ── Markdown previews are summaries, not giant inline documents.
  const mdSummaries = await page.evaluate(() => [...document.querySelectorAll('[data-md-preview]')].map((el) => ({
    text: el.textContent ?? '',
    height: el.getBoundingClientRect().height,
  })));
  assert(mdSummaries.every((item) => item.text.includes('Sections:')), `markdown previews should summarize sections: ${JSON.stringify(mdSummaries)}`);
  assert(mdSummaries.every((item) => item.height < 140), `markdown previews should stay compact: ${JSON.stringify(mdSummaries)}`);
  console.log('test 36 ok: markdown previews summarized');

  // Test 37 ── 320px layout has no horizontal overflow or brand/stat spill.
  await page.setViewportSize({ width: 320, height: 700 });
  const narrow = await page.evaluate(() => {
    const brand = document.querySelector<HTMLElement>('.brand')!.getBoundingClientRect();
    const stats = document.querySelector<HTMLElement>('.stats')!.getBoundingClientRect();
    return {
      bodyOverflow: document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth,
      brandRight: Math.round(brand.right),
      statsRight: Math.round(stats.right),
      width: window.innerWidth,
    };
  });
  assert.strictEqual(narrow.bodyOverflow, false, `narrow viewport should not horizontally overflow: ${JSON.stringify(narrow)}`);
  assert(narrow.brandRight <= narrow.width, `brand should fit at 320px: ${JSON.stringify(narrow)}`);
  assert(narrow.statsRight <= narrow.width, `stats should fit at 320px: ${JSON.stringify(narrow)}`);
  console.log('test 37 ok: 320px layout fits');

  // Test 38 ── Page/URL divider only renders when the URL changes between
  // consecutive captures. Two captures on the same URL get one divider; a
  // third capture on a new URL gets its own.
  await page.setViewportSize({ width: 420, height: 800 });
  await page.evaluate(() => {
    window.__pinchgrab_panel.clear();
    const mk = (n, url, sel) => {
      window.__pinchgrab_panel.pushMessage({ type: 'page', id: 'p' + n, ts: new Date().toISOString(), url });
      window.__pinchgrab_panel.pushMessage({
        type: 'selector', id: 's' + n, ts: new Date().toISOString(),
        entry: { n, ts: new Date().toISOString(), url, tag: 'div', selector: sel, rect: { x: 0, y: 0, w: 100, h: 40 } },
      });
    };
    mk(1, 'http://example/a', '#one');
    mk(2, 'http://example/a', '#two');   // same URL → no repeated divider
    mk(3, 'http://example/b', '#three'); // new URL → its own divider
  });
  await page.waitForFunction(() => document.querySelectorAll('.msg.selector').length === 3);
  const dividerUrls = await page.evaluate(() =>
    [...document.querySelectorAll('.page-divider .url')].map((el) => el.textContent));
  assert.deepStrictEqual(dividerUrls, ['http://example/a', 'http://example/b'],
    `consecutive same-URL captures should share one divider, got ${JSON.stringify(dividerUrls)}`);
  console.log('test 38 ok: page divider dedupes consecutive same-URL captures');

  // Test 39 ── Per-capture JSON Wrap toggle. With minify OFF: wrap ON renders
  // a single (newline-free) minified line that soft-wraps; wrap OFF renders
  // the pretty-printed multi-line form.
  await page.evaluate(() => window.__pinchgrab_panel.setPrefs({ minify: false }));
  await page.evaluate(() => {
    const sel = document.querySelector('.msg.selector');
    sel.classList.add('expanded');
  });
  const wrapJson = await page.evaluate(() => {
    const sel = document.querySelector('.msg.selector');
    const check = sel.querySelector('.json-wrap-toggle input');
    const body = sel.querySelector('.body-json');
    // Default is wrap ON → single line.
    const onText = body.textContent ?? '';
    const onWhiteSpace = getComputedStyle(body).whiteSpace;
    // Toggle wrap OFF → multi-line pretty print.
    check.checked = false;
    check.dispatchEvent(new Event('change', { bubbles: true }));
    const offText = sel.querySelector('.body-json').textContent ?? '';
    return { onSingleLine: !onText.includes('\n'), onWhiteSpace, offMultiLine: offText.includes('\n') };
  });
  assert(wrapJson.onSingleLine, 'wrap ON should render JSON as a single line');
  assert(wrapJson.onWhiteSpace === 'pre-wrap', `wrap ON should soft-wrap (pre-wrap), got ${wrapJson.onWhiteSpace}`);
  assert(wrapJson.offMultiLine, 'wrap OFF (minify off) should render multi-line pretty JSON');
  console.log('test 39 ok: per-capture JSON wrap toggle flattens to one soft-wrapping line');

  // Test 40 ── While a screenshot is expected but not yet loaded, the preview
  // reserves its final height (from the element's aspect ratio) and shows a
  // skeleton loader, so the timeline doesn't shift when the shot swaps in.
  await page.evaluate(() => {
    window.__pinchgrab_panel.clear();
    window.__pinchgrab_panel.setPrefs({ autoScreenshot: true });
    window.__pinchgrab_panel.pushMessage({ type: 'page', id: 'pp', ts: new Date().toISOString(), url: 'http://example/c' });
    window.__pinchgrab_panel.pushMessage({
      type: 'selector', id: 'ss', ts: new Date().toISOString(),
      entry: { n: 1, ts: new Date().toISOString(), url: 'http://example/c', tag: 'div', selector: '#shot', rect: { x: 0, y: 0, w: 200, h: 100 } },
    });
  });
  await page.waitForFunction(() => !!document.querySelector('.msg.selector .preview.reserved'));
  const reserved = await page.evaluate(() => {
    const prev = document.querySelector('.msg.selector .preview.reserved');
    const skel = prev?.querySelector('.shot-skeleton');
    const h = prev?.getBoundingClientRect().height ?? 0;
    return { hasSkeleton: !!skel, isLoading: prev?.classList.contains('loading'), height: h };
  });
  assert(reserved.hasSkeleton, 'expected-shot preview should render a skeleton loader');
  assert(reserved.isLoading, 'preview should be in loading state before the shot arrives');
  assert(reserved.height > 20, `reserved preview should commit a non-trivial height up front, got ${reserved.height}`);
  console.log('test 40 ok: reserved preview height + skeleton before screenshot loads');

  // Test 41 ── Header workspace dropdown exposes a "+ New workspace" action
  // that creates and switches to a new workspace via the shared flow.
  await page.evaluate(() => window.__pinchgrab_panel.openDrawer());
  const hasNewOption = await page.evaluate(() => {
    const sel = document.querySelector('[data-workspace]');
    return [...sel.options].some((o) => o.value === '__new_workspace__' && o.textContent.includes('New workspace'));
  });
  assert(hasNewOption, 'header workspace dropdown should include a "+ New workspace" option');
  const createdViaDropdown = await page.evaluate(async () => {
    window.prompt = () => 'from-dropdown';
    const sel = document.querySelector('[data-workspace]');
    sel.value = '__new_workspace__';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    // The flow is async (loadWorkspace); poll briefly.
    for (let i = 0; i < 40; i++) {
      if (window.__pinchgrab_panel.listWorkspaces().some((w) => w.name === 'from-dropdown')) return true;
      await new Promise((r) => setTimeout(r, 25));
    }
    return false;
  });
  assert(createdViaDropdown, 'selecting "+ New workspace" should create the workspace');
  await page.evaluate(() => window.__pinchgrab_panel.switchWorkspace('default'));
  await page.evaluate(() => window.__pinchgrab_panel.closeDrawer());
  console.log('test 41 ok: header dropdown "+ New workspace" creates a workspace');

  // Test 42 ── Settings labels word-wrap at narrow widths instead of clipping.
  await page.setViewportSize({ width: 320, height: 760 });
  await page.evaluate(() => window.__pinchgrab_panel.openDrawer());
  await page.waitForFunction(() => !document.querySelector('[data-drawer]').hidden);
  const labelWrap = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('.drawer .prefs label')];
    const drawerBody = document.querySelector('.drawer-body');
    const noClip = labels.every((l) => getComputedStyle(l).whiteSpace === 'normal');
    // No label should extend past the drawer's content box (no right-cutoff).
    const right = drawerBody.getBoundingClientRect().right;
    const noOverflow = labels.every((l) => Math.floor(l.getBoundingClientRect().right) <= Math.ceil(right));
    return { noClip, noOverflow };
  });
  assert(labelWrap.noClip, 'settings labels should use white-space:normal (wrap, not clip)');
  assert(labelWrap.noOverflow, 'settings labels should not overflow the drawer at 320px');
  await page.evaluate(() => window.__pinchgrab_panel.closeDrawer());
  console.log('test 42 ok: settings labels word-wrap at narrow width');

  // Test 43 ── Main-pane footer carries a GitHub-star CTA, sits below the
  // composer, and does not overlap it.
  await page.setViewportSize({ width: 420, height: 760 });
  const footer = await page.evaluate(() => {
    const f = document.querySelector('.pane-footer');
    if (!f) return null;
    const cta = f.querySelector('.pane-footer-cta');
    const composer = document.querySelector('.composer');
    const fRect = f.getBoundingClientRect();
    const cRect = composer.getBoundingClientRect();
    return {
      text: f.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      action: cta?.getAttribute('data-action'),
      belowComposer: Math.floor(fRect.top) >= Math.floor(cRect.bottom),
    };
  });
  assert(footer, 'main-pane footer should exist');
  assert(footer.text.includes('PinchGrab') && footer.text.toLowerCase().includes('star'),
    `footer should pitch a GitHub star, got "${footer.text}"`);
  assert.strictEqual(footer.action, 'github', 'footer CTA should trigger the GitHub action');
  assert(footer.belowComposer, 'footer must sit below the composer, not overlap it');
  console.log('test 43 ok: main-pane GitHub-star footer below composer');

  // Test 44 ── DESIGN.md is presented as the recommended, brand-education
  // primary action; SKILL.md is de-emphasized as advanced/optional; and a
  // Help & about group explains the tool and the Alt+Click → comment → export
  // flow.
  await page.evaluate(() => window.__pinchgrab_panel.openDrawer());
  const settingsCopy = await page.evaluate(() => {
    const designCard = document.querySelector('.md-card-primary');
    const designText = designCard?.textContent?.toLowerCase() ?? '';
    const advanced = document.querySelector('.prefs-advanced');
    const help = [...document.querySelectorAll('.drawer details.prefs summary')]
      .find((s) => /help/i.test(s.textContent ?? ''))?.closest('details');
    return {
      designHasRecommended: !!designCard?.querySelector('.md-badge-recommended'),
      designEducatesBrand: designText.includes('brand') && designText.includes('build'),
      skillIsAdvancedDetails: advanced?.tagName.toLowerCase() === 'details',
      skillCollapsedByDefault: advanced ? !(advanced as HTMLDetailsElement).open : false,
      skillLabeledAdvanced: /advanced/i.test(advanced?.querySelector('summary')?.textContent ?? ''),
      helpExists: !!help,
      helpHasHowTo: /alt\+click/i.test(help?.textContent ?? '') && /export/i.test(help?.textContent ?? ''),
    };
  });
  assert(settingsCopy.designHasRecommended, 'DESIGN.md should carry a Recommended badge');
  assert(settingsCopy.designEducatesBrand, 'DESIGN.md copy should educate about building UI in the user brand');
  assert(settingsCopy.skillIsAdvancedDetails, 'SKILL.md should live in an advanced <details> disclosure');
  assert(settingsCopy.skillCollapsedByDefault, 'SKILL.md advanced disclosure should be collapsed by default');
  assert(settingsCopy.skillLabeledAdvanced, 'SKILL.md disclosure should be labeled Advanced');
  assert(settingsCopy.helpExists, 'settings should include a Help & about group');
  assert(settingsCopy.helpHasHowTo, 'Help should explain the Alt+Click → comment → export flow');
  await page.evaluate(() => window.__pinchgrab_panel.closeDrawer());
  console.log('test 44 ok: DESIGN.md recommended, SKILL.md advanced, Help group present');

  console.log('chat.spec all tests passed');
  await browser.close();
  server.close();
})().catch((err) => { console.error(err); process.exit(1); });
