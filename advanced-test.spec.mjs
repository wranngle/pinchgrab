import { chromium } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to complex page (https://example.com)...');
  await page.goto('https://example.com/');
  
  console.log('Injecting selector-capture-mode.js...');
  const scriptContent = fs.readFileSync('./src/selector-capture-mode.js', 'utf-8');
  await page.addScriptTag({ content: scriptContent });
  
  console.log('Alt+Clicking on the h1 element');
  await page.locator('h1').click({ modifiers: ['Alt'] });
  
  console.log('Alt+Clicking on a link');
  await page.locator('a').click({ modifiers: ['Alt'] });

  const textareaContent = await page.evaluate(() => {
    const host = document.getElementById('__selector_capture_mode_panel');
    if (!host) return null;
    const root = host.shadowRoot;
    if (!root) return null;
    const textarea = root.querySelector('textarea');
    return textarea ? textarea.value : null;
  });
  
  assert(textareaContent !== null, 'Panel textarea not found');
  console.log('Textarea content length:', textareaContent.length);
  
  const entries = textareaContent.trim().split('\n').filter(Boolean);
  console.log('Found', entries.length, 'entries');
  assert(entries.length === 2, 'Expected exactly 2 entries');
  
  const entry1 = JSON.parse(entries[0]);
  const entry2 = JSON.parse(entries[1]);
  
  // Assert top-level fields for H1
  assert.strictEqual(entry1.schema, 'selector-capture-entry');
  assert(entry1.element.tag === 'h1', 'First captured element should be h1');
  assert(entry1.selectors && entry1.selectors.css);
  
  // Assert top-level fields for Link
  assert(entry2.element.tag === 'a', 'Second captured element should be a');
  console.log('Captured href:', entry2.element.href);
  assert(entry2.element.href === 'https://iana.org/domains/example', 'Href should be captured');
  
  console.log('Advanced assertions passed.');
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
