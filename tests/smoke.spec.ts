import { chromium } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';
import http from 'node:http';

// Minimal HTTP fixture so localStorage works and the script can use chrome shims.
const FIXTURE = `<!doctype html><html><head><meta charset="utf-8"><title>smoke</title></head>
<body>
  <h1 id="hero">Hero</h1>
  <button class="btn btn--primary">Publish</button>
  <input data-testid="global-search" placeholder="Search" />
</body></html>`;

const startServer = () =>
  new Promise((resolve) => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(FIXTURE);
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, base: `http://127.0.0.1:${addr.port}` });
    });
  });

(async () => {
  const { server, base } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(base + '/');

  await page.addScriptTag({ content: fs.readFileSync('./extension/content-script.js', 'utf-8') });
  await page.waitForFunction(() => !!window.__pinchgrab);

  // Standalone: captures land in window.__pinchgrab.captures
  await page.locator('button.btn.btn--primary:has-text("Publish")').click({ modifiers: ['Alt'] });
  await page.locator('input[data-testid="global-search"]').click({ modifiers: ['Alt'] });

  const captures = await page.evaluate(() => window.__pinchgrab.captures);
  assert(Array.isArray(captures) && captures.length === 2, `expected 2 captures, got ${captures?.length}`);

  const e1 = captures[0].entry;
  const e2 = captures[1].entry;

  // Schema sanity: lean, ordered, no nulls/empty objects.
  assert.strictEqual(e1.tag, 'button');
  assert.strictEqual(e1.n, 1);
  assert(typeof e1.ts === 'string' && e1.ts.length > 0);
  assert(e1.selector && typeof e1.selector === 'string');
  assert(e1.rect && typeof e1.rect.w === 'number');
  assert(e1.viewport && typeof e1.viewport.w === 'number');
  assert(e1.outerHTML, 'outerHTML should be present');

  assert.strictEqual(e2.tag, 'input');
  assert.strictEqual(e2.testId, 'global-search');
  assert.strictEqual(e2.selector, '[data-testid="global-search"]');

  for (const e of [e1, e2]) {
    for (const [k, v] of Object.entries(e)) {
      assert(v !== null, `entry has null field: ${k}`);
      if (typeof v === 'object' && !Array.isArray(v)) {
        assert(Object.keys(v).length > 0, `entry has empty object field: ${k}`);
      }
    }
    assert(!('feedback' in e));
    assert(!('schema' in e));
    assert(!('page' in e));
    assert(!('computedTail' in e));
  }

  // Page context produced separately, not on the entry.
  assert(captures[0].page && captures[0].page.url, 'page context missing');
  assert(captures[0].page.tokens && typeof captures[0].page.tokens === 'object', 'tokens missing');

  console.log('smoke ok: lean schema, no nulls, page context separate.');
  await browser.close();
  server.close();
})().catch((err) => { console.error(err); process.exit(1); });
