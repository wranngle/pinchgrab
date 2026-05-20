import { chromium } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to https://example.com/');
  await page.goto('https://example.com/');

  await page.addScriptTag({ content: fs.readFileSync('./extension/content-script.js', 'utf-8') });
  await page.waitForFunction(() => !!window.__pinchgrab);

  await page.locator('h1').click({ modifiers: ['Alt'] });
  await page.locator('a').click({ modifiers: ['Alt'] });

  const captures = await page.evaluate(() => window.__pinchgrab.captures);
  assert.strictEqual(captures.length, 2);

  assert.strictEqual(captures[0].entry.tag, 'h1');
  assert(captures[0].entry.text);

  assert.strictEqual(captures[1].entry.tag, 'a');
  console.log('Captured href:', captures[1].entry.attrs?.href);
  assert(captures[1].entry.attrs?.href?.includes('iana'), `unexpected href: ${captures[1].entry.attrs?.href}`);

  console.log('advanced ok');
  await browser.close();
})().catch((err) => { console.error(err); process.exit(1); });
