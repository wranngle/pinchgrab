import { chromium } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to React page (https://react.dev/)...');
  await page.goto('https://react.dev/');
  
  console.log('Injecting selector-capture-mode.js...');
  const scriptContent = fs.readFileSync('./src/selector-capture-mode.js', 'utf-8');
  await page.addScriptTag({ content: scriptContent });
  
  console.log('Alt+Clicking on a button or link...');
  await page.evaluate(() => {
    const el = document.querySelector('a');
    if (el) el.dispatchEvent(new MouseEvent('click', { altKey: true, bubbles: true, cancelable: true }));
  });
  
  console.log('Alt+Clicking on an SVG...');
  await page.evaluate(() => {
    const el = document.querySelector('svg');
    if (el) el.dispatchEvent(new MouseEvent('click', { altKey: true, bubbles: true, cancelable: true }));
  });

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
  
  for (let i = 0; i < entries.length; i++) {
    const entry = JSON.parse(entries[i]);
    console.log(`Entry ${i} tag:`, entry.element.tag);
    if (entry.component) {
      console.log(`Entry ${i} React component:`, entry.component.componentName);
    }
  }

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
