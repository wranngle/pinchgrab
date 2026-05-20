import { chromium } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to https://react.dev/');
  await page.goto('https://react.dev/', { waitUntil: 'domcontentloaded' });

  await page.addScriptTag({ content: fs.readFileSync('./extension/content-script.js', 'utf-8') });
  await page.waitForFunction(() => !!window.__pinchgrab);

  await page.evaluate(() => {
    const a = document.querySelector('a');
    if (a) a.dispatchEvent(new MouseEvent('click', { altKey: true, bubbles: true, cancelable: true }));
  });
  await page.evaluate(() => {
    const svg = document.querySelector('svg');
    if (svg) svg.dispatchEvent(new MouseEvent('click', { altKey: true, bubbles: true, cancelable: true }));
  });

  const captures = await page.evaluate(() => window.__pinchgrab.captures);
  console.log('captures:', captures.length);

  for (const [i, c] of captures.entries()) {
    const e = c.entry;
    console.log(`[#${i}] tag=${e.tag} selector=${(e.selector || '').slice(0, 80)} component=${e.component?.name || '-'}`);
    assert(e.tag);
    assert(e.selector);
  }
  console.log('react ok');
  await browser.close();
})().catch((err) => { console.error(err); process.exit(1); });
