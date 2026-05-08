import { chromium } from 'playwright';
import assert from 'node:assert';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to http://127.0.0.1:4173/');
  await page.goto('http://127.0.0.1:4173/');
  
  console.log('Activating selector capture mode');
  await page.click('#run-local');
  
  console.log('Alt+Clicking on a button');
  await page.locator('button.button.primary:has-text("Publish")').click({ modifiers: ['Alt'] });
  
  console.log('Alt+Clicking on global search input');
  await page.locator('input[data-testid="global-search"]').click({ modifiers: ['Alt'] });

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
  
  // Assert top-level fields
  assert.strictEqual(entry1.schema, 'selector-capture-entry');
  assert.strictEqual(entry1.version, 3);
  assert(entry1.page && entry1.page.url.includes('127.0.0.1:4173'));
  assert(entry1.selectors && entry1.selectors.css);
  assert(entry1.element && entry1.element.tag === 'button');
  assert(entry1.styles && entry1.styles.computed);
  assert(entry1.domBreadcrumb && entry1.domBreadcrumb.length > 0);

  assert.strictEqual(entry2.schema, 'selector-capture-entry');
  assert.strictEqual(entry2.version, 3);
  assert(entry2.element.tag === 'input');
  
  console.log('All basic assertions passed.');
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
