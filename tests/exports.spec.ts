// Schema-v2 + epoch filenames + manifest + DuckDB snippet + ZIP shape.
// All tests run against the side panel's __pinchgrab_panel test API.

import { chromium } from 'playwright';
import assert from 'node:assert';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const ASSETS = ['sidepanel.html', 'sidepanel.css', 'sidepanel.js'];
const SRC = path.resolve('./extension');

const startServer = (): Promise<{ server: http.Server; base: string }> =>
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
      // Templates loaded by the sidepanel at runtime via fetch('templates/*.md').
      const m = /\/templates\/([\w.-]+\.md)$/.exec(url);
      if (m) {
        const p = path.join(SRC, 'templates', m[1]!);
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
          res.end(fs.readFileSync(p, 'utf-8'));
          return;
        }
      }
      // Vendored skills fetched at export time via fetch('skills/…') —
      // mirrors chrome.runtime.getURL resolution inside the extension.
      const sk = /\/(skills\/.+)$/.exec(url);
      if (sk) {
        const p = path.resolve(SRC, sk[1]!);
        if (p.startsWith(path.resolve(SRC, 'skills')) && fs.existsSync(p) && fs.statSync(p).isFile()) {
          const ct = p.endsWith('.json') ? 'application/json' : 'text/plain';
          res.writeHead(200, { 'Content-Type': ct + '; charset=utf-8' });
          res.end(fs.readFileSync(p));
          return;
        }
      }
      res.writeHead(404); res.end();
    });
    server.listen(0, '127.0.0.1', () => {
      const a = server.address() as { port: number };
      resolve({ server, base: `http://127.0.0.1:${a.port}` });
    });
  });

(async () => {
  const { server, base } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  await page.goto(base + '/');
  await page.waitForFunction(() => !!window.__pinchgrab_panel);

  // Helper: seed a minimal capture set (one page, two selectors, one feedback).
  const seed = async (): Promise<void> => {
    await page.evaluate(() => window.__pinchgrab_panel.clear());
    await page.evaluate(() => {
      const sp: any = window.__pinchgrab_panel;
      const e1 = {
        uid: 'aaaa-aaaa', n: 1, ts: '2026-05-08T10:00:00.000Z',
        url: 'https://app.example.com/dash', tag: 'button',
        selector: '#cta', text: 'Buy now',
        rect: { x: 0, y: 0, w: 100, h: 32 },
        viewport: { w: 1280, h: 800, dpr: 1 },
        outerHTML: '<button id="cta">Buy now</button>',
        classes: ['btn', 'primary'],
        attrs: { type: 'button' },
        hints: { format: 'YYYY-MM-DD' },
        states: ['hover'],
        ancestors: [{ tag: 'div', id: 'panel' }],
        component: { framework: 'react', name: 'Button' },
        componentRoot: '#panel > Button',
        inShadowDOM: false,
        styles: { color: 'rgb(255, 95, 0)' },
      };
      const e2 = {
        uid: 'bbbb-bbbb', n: 2, ts: '2026-05-08T10:01:00.000Z',
        url: 'https://app.example.com/dash', tag: 'a',
        selector: '#learn',
        rect: { x: 0, y: 32, w: 60, h: 16 },
        viewport: { w: 1280, h: 800, dpr: 1 },
      };
      sp.pushMessage({ type: 'page', id: 'p1', ts: e1.ts, url: e1.url, title: 'Dash' });
      sp.pushMessage({ type: 'selector', id: 's1', ts: e1.ts, entry: e1 });
      sp.pushMessage({ type: 'feedback', id: 'f1', ts: e1.ts, text: 'change copy', parentUid: 'aaaa-aaaa', severity: 'fix' });
      sp.pushMessage({ type: 'selector', id: 's2', ts: e2.ts, entry: e2 });
    });
  };

  // ─── Test 1 ── v2 selector line shape ──────────────────────────────────
  await seed();
  {
    const jsonl = await page.evaluate(() => window.__pinchgrab_panel.buildJsonl('test.jsonl'));
    const lines = jsonl.split('\n').filter(Boolean).map((l) => JSON.parse(l));
    assert(lines.length >= 1, `expected lines, got ${lines.length}`);
    const manifest = lines[0];
    assert.strictEqual(manifest.type, 'manifest', `first line should be manifest, got ${manifest.type}`);
    assert.strictEqual(manifest.v, 2);
    assert.strictEqual(manifest.tool, 'pinchgrab');
    assert.strictEqual(manifest.format, 'jsonl');
    assert.strictEqual(manifest.filename, 'test.jsonl');
    assert.strictEqual(manifest.counts.selectors, 2);
    assert.strictEqual(manifest.counts.feedback, 1);
    assert.strictEqual(manifest.counts.pages, 1);
    assert.deepStrictEqual(manifest.hosts, ['app.example.com']);
    assert(typeof manifest.generated === 'number' && manifest.generated > 1_700_000_000_000,
      `manifest.generated should be epoch ms, got ${manifest.generated}`);

    const sel1 = lines.find((l) => l.type === 'selector' && l.uid === 'aaaa-aaaa');
    assert(sel1, 'sel1 missing in jsonl');
    assert.strictEqual(sel1.v, 2);
    assert.strictEqual(sel1.uid, 'aaaa-aaaa');
    assert.deepStrictEqual(sel1.hints, { format: 'YYYY-MM-DD' }, 'hints round-trip');
    assert(Array.isArray(sel1.states) && sel1.states.includes('hover'), 'states is array');
    assert(sel1._audit, 'selector should have _audit namespace');
    assert(sel1._audit.ancestors, '_audit.ancestors expected');
    assert.strictEqual(sel1._audit.componentRoot, '#panel > Button');
    assert.strictEqual(sel1.ancestors, undefined, 'ancestors should NOT be top-level in v2');
    assert.strictEqual(sel1.componentRoot, undefined, 'componentRoot should NOT be top-level in v2');
    console.log('exports 1 ok: v2 selector + manifest line shape');
  }

  // ─── Test 2 ── Feedback round-trip with parentUid ──────────────────────
  {
    const jsonl = await page.evaluate(() => window.__pinchgrab_panel.buildJsonl('t.jsonl'));
    const lines = jsonl.split('\n').filter(Boolean).map((l) => JSON.parse(l));
    const fb = lines.find((l) => l.type === 'feedback');
    assert(fb, 'feedback line missing');
    assert.strictEqual(fb.parentUid, 'aaaa-aaaa');
    // severity was removed from the export shape in 2026-05 (the UI no
    // longer surfaces it); readers tolerate it on legacy JSONL but new
    // exports never emit it.
    assert.strictEqual(fb.severity, undefined, 'severity should NOT be emitted in v2 exports');
    const sel1 = lines.find((l) => l.type === 'selector' && l.uid === 'aaaa-aaaa');
    // Bundled string-array feedback on the selector is still emitted for
    // v1 readers.
    assert(Array.isArray(sel1.feedback) && sel1.feedback[0] === 'change copy',
      'bundled string feedback array still present for v1 readers');
    console.log('exports 2 ok: feedback parentUid present, severity dropped');
  }

  // ─── Test 3 ── Filename: host_underscored + epoch ──────────────────────
  {
    const filename = await page.evaluate(() => window.__pinchgrab_panel.buildExportFilename('jsonl'));
    assert(/^pinchgrab-default-(app_example_com|empty|multi)-\d+\.jsonl$/.test(filename),
      `filename shape mismatch: ${filename}`);
    const tail = filename.match(/-(\d+)\.jsonl$/);
    assert(tail && Number(tail[1]) > 1_700_000_000_000, `filename epoch tail must be ms, got ${filename}`);
    // Multi-host: change one entry's url and re-build.
    await page.evaluate(() => {
      const sp: any = window.__pinchgrab_panel;
      sp.clear();
      sp.pushMessage({
        type: 'selector', id: 's1', ts: '2026-05-08T10:00:00.000Z',
        entry: { uid: 'a', n: 1, ts: '2026-05-08T10:00:00.000Z',
          url: 'https://one.com/', tag: 'a', selector: '#x',
          rect: { x: 0, y: 0, w: 1, h: 1 }, viewport: { w: 1, h: 1, dpr: 1 } } });
      sp.pushMessage({
        type: 'selector', id: 's2', ts: '2026-05-08T10:01:00.000Z',
        entry: { uid: 'b', n: 2, ts: '2026-05-08T10:01:00.000Z',
          url: 'https://two.com/', tag: 'a', selector: '#y',
          rect: { x: 0, y: 0, w: 1, h: 1 }, viewport: { w: 1, h: 1, dpr: 1 } } });
    });
    const fnMulti = await page.evaluate(() => window.__pinchgrab_panel.buildExportFilename('jsonl'));
    assert(/-multi-/.test(fnMulti), `multi-host export should slug as 'multi', got ${fnMulti}`);
    console.log(`exports 3 ok: filename = ${filename}`);
  }

  // ─── Test 4 ── JSONL manifest header row ───────────────────────────────
  // Replaces the old Markdown-frontmatter test — the Markdown export was
  // deleted, so the manifest now lives only at the head of the JSONL.
  await seed();
  {
    const jsonl = await page.evaluate(() => window.__pinchgrab_panel.buildJsonl('out.jsonl'));
    const head = JSON.parse(jsonl.split('\n')[0]!);
    assert.strictEqual(head.type, 'manifest', 'first JSONL line should be the manifest');
    assert.strictEqual(head.v, 2);
    assert.strictEqual(head.workspace, 'default');
    assert.strictEqual(head.filename, 'out.jsonl');
    assert.strictEqual(head.format, 'jsonl');
    assert.deepStrictEqual(head.hosts, ['app.example.com']);
    assert.strictEqual(head.counts.selectors, 2);
    console.log('exports 4 ok: jsonl manifest shape');
  }

  // ─── Test 5 ── DuckDB snippet ──────────────────────────────────────────
  {
    const sql = await page.evaluate(() => window.__pinchgrab_panel.duckDbSnippet('captures.jsonl'));
    assert(/read_json_auto\(\s*'captures\.jsonl'/.test(sql), `should reference filename in read_json_auto`);
    assert(sql.includes('format=\'newline_delimited\''));
    // Loader must opt into a full schema scan so rare feedback fields
    // (severity, parentUid) don't get dropped by sniff-based inference.
    assert(/sample_size\s*=\s*-1/.test(sql),
      'loader should pass sample_size=-1 for full-file schema inference');
    assert(sql.includes("type = 'selector'"));
    assert(sql.includes("type = 'feedback'"));
    // Multi-line join now: `JOIN pg s\n  ON s.uid = f.parentUid\n AND s.type = 'selector'`.
    assert(/JOIN pg s\s+ON s\.uid = f\.parentUid/.test(sql),
      'feedback-to-selector recipe should use uid join');
    assert(sql.includes("AND s.type = 'selector'"),
      'feedback-to-selector recipe should filter to selector rows');
    assert(!sql.includes('coalesce(classes, [])'),
      'should not use the empty-list coalesce that fails DuckDB type inference');
    assert(sql.includes('outerHTML'));
    assert(sql.split('\n').length >= 30, 'snippet should be reasonably comprehensive');
    console.log(`exports 5 ok: DuckDB snippet (${sql.split('\n').length} lines)`);
  }

  // ─── Test 6 ── Round-trip: export v2 then re-import ────────────────────
  await seed();
  {
    const jsonl = await page.evaluate(() => window.__pinchgrab_panel.buildJsonl('rt.jsonl'));
    // Use the denormalizeEntry helper to simulate import on each selector line.
    const importedEntries = await page.evaluate((j) => {
      const lines = j.split('\n').filter(Boolean).map((l) => JSON.parse(l));
      const sp: any = window.__pinchgrab_panel;
      return lines
        .filter((l) => l.type === 'selector')
        .map((l) => sp.denormalizeEntry(l));
    }, jsonl);
    const a = importedEntries.find((e: any) => e.uid === 'aaaa-aaaa');
    assert(a, 'reimported entry aaaa missing');
    assert.deepStrictEqual(a.hints, { format: 'YYYY-MM-DD' });
    assert(Array.isArray(a.states) && a.states.includes('hover'));
    // _audit fields must be hoisted back to flat shape.
    assert(Array.isArray(a.ancestors), 'ancestors hoisted from _audit');
    assert.strictEqual(a.componentRoot, '#panel > Button');
    assert.strictEqual(a._audit, undefined, 'export-only _audit field must not leak into runtime entry');
    console.log('exports 6 ok: v2 round-trip preserves uid/hints/_audit hoisting');
  }

  // ─── Test 7 ── Migration of legacy v1 entry (no uid, states-as-record) ─
  {
    const migrated = await page.evaluate(() => {
      const sp: any = window.__pinchgrab_panel;
      const v1 = {
        n: 1, ts: '2026-05-08T10:00:00.000Z',
        url: 'https://h.com/', tag: 'button', selector: '#x',
        rect: { x: 0, y: 0, w: 1, h: 1 }, viewport: { w: 1, h: 1, dpr: 1 },
        states: { hover: true, focus: true } as any,
        attrs: { type: 'button', format: 'YYYY-MM-DD' },
      };
      return sp.denormalizeEntry(v1);
    });
    assert(typeof migrated.uid === 'string' && migrated.uid.length > 0, 'uid must be generated');
    assert(Array.isArray(migrated.states), 'states must become array');
    assert.deepStrictEqual([...migrated.states].sort(), ['focus', 'hover']);
    assert.strictEqual(migrated.attrs.format, undefined, 'attrs.format must move to hints.format');
    assert.strictEqual(migrated.hints?.format, 'YYYY-MM-DD');
    console.log('exports 7 ok: v1 → v2 migration via denormalizeEntry');
  }

  // ─── Test 8 ── Last-export tracker after JSONL/Markdown export ─────────
  // Toolbar lost the dedicated copy-path button (single download-full
  // action replaces all of: copy-all, copy-md, export-jsonl, export-md,
  // export-zip, copy-path). The path-tracker state still updates so
  // command-palette `copy-path` and the auto-copy-on-export both work.
  {
    await seed();
    let last = await page.evaluate(() => window.__pinchgrab_panel.getLastExport());
    assert.strictEqual(last.absPath, null, 'lastExport.absPath should start null');
    await page.evaluate(() => window.__pinchgrab_panel.onExport());
    await page.waitForFunction(() => {
      const sp: any = window.__pinchgrab_panel;
      return sp.getLastExport().relPath !== null;
    });
    last = await page.evaluate(() => window.__pinchgrab_panel.getLastExport());
    assert.strictEqual(last.kind, 'jsonl');
    assert(/\.jsonl$/.test(last.absPath ?? ''), `last export path should be .jsonl, got ${last.absPath}`);
    console.log(`exports 8 ok: lastExport tracker (${last.absPath})`);
  }

  // ─── Test 9 ── tar.zst end-to-end ──────────────────────────────────────
  // Decode the zstd frame, then walk the inner tar to verify all entries
  // (README, JSONL, screenshots.json, DuckDB SQL, plus any seeded
  // PNG screenshots) are present and round-trippable. The Markdown
  // report was removed — JSONL is now the only structured data file.
  await seed();
  {
    // Inject a fake full-size PNG into shotsFull so the export bundles
    // it. This mirrors what runShot would have done after a real capture.
    await page.evaluate(() => {
      // 1x1 transparent PNG for the test
      const tinyPngB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII=';
      const sp: any = (window as any).__pinchgrab_panel;
      // Reach into the panel state. The exposed test API doesn't directly
      // expose shotsFull; populate via seed message + manually attach the
      // dataUrl through the test API. We dispatch a fake screenshot reply.
      const all = sp.getMessages();
      for (const m of all) {
        if (m.type !== 'selector') continue;
        m.entry.screenshot = {element: `default/screenshots/elem-${m.entry.n}.png`, capturedAt: m.ts};
      }
      // Push the dataUrl into shotsFull via the test hatch.
      sp.__seedShotsFull?.(`data:image/png;base64,${tinyPngB64}`);
    });

    const captured = await page.evaluate(async () => {
      let savedBytes: Uint8Array | null = null;
      const origCreate = URL.createObjectURL;
      const origRevoke = URL.revokeObjectURL;
      URL.createObjectURL = () => 'blob:test://stub';
      URL.revokeObjectURL = () => {};
      const origAnchorClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () { /* no-op */ };
      const origBlob = window.Blob;
      (window as any).Blob = function (parts: any[], opts: any) {
        if (parts && parts[0] && (parts[0] as any).byteLength) {
          const p = parts[0];
          savedBytes = p instanceof Uint8Array ? new Uint8Array(p) : new Uint8Array(p.buffer ?? p);
        }
        return new origBlob(parts, opts);
      } as any;
      await window.__pinchgrab_panel.onExportZip();
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
      HTMLAnchorElement.prototype.click = origAnchorClick;
      (window as any).Blob = origBlob;
      if (!savedBytes) return null;
      return Array.from(savedBytes);
    });
    assert(captured && captured.length > 0, 'archive bytes should be captured');
    const u8 = Uint8Array.from(captured);

    // zstd magic: 28 B5 2F FD
    assert.strictEqual(u8[0], 0x28, 'zstd magic byte 0');
    assert.strictEqual(u8[1], 0xb5, 'zstd magic byte 1');
    assert.strictEqual(u8[2], 0x2f, 'zstd magic byte 2');
    assert.strictEqual(u8[3], 0xfd, 'zstd magic byte 3');

    // Decompress (raw-block frame, 4-byte FCS) — mirrors src/tar.ts unwrapZstd.
    const fhd = u8[4];
    const fcsSize = (fhd >>> 6) & 0b11;
    assert.strictEqual(fcsSize, 0b10, 'expected 4-byte FCS');
    const fcs = u8[5] | (u8[6] << 8) | (u8[7] << 16) | (u8[8] * 0x1000000);
    let pos = 9;
    const tar = new Uint8Array(fcs);
    let outPos = 0;
    for (;;) {
      const headerInt = u8[pos] | (u8[pos + 1] << 8) | (u8[pos + 2] << 16);
      pos += 3;
      const isLast = (headerInt & 1) === 1;
      const blockType = (headerInt >>> 1) & 0b11;
      const blockSize = (headerInt >>> 3) & 0x1f_ff_ff;
      assert.strictEqual(blockType, 0, `expected raw block, got ${blockType}`);
      tar.set(u8.subarray(pos, pos + blockSize), outPos);
      outPos += blockSize;
      pos += blockSize;
      if (isLast) break;
    }

    // Walk the tar — each entry is a 512-byte header + size-rounded-up data.
    const dec = new TextDecoder();
    const readNullStr = (offset: number, length: number): string => {
      let end = offset + length;
      for (let i = offset; i < offset + length; i++) {
        if (tar[i] === 0) { end = i; break; }
      }
      return dec.decode(tar.subarray(offset, end));
    };
    const tarEntries: {name: string; size: number; data: Uint8Array}[] = [];
    let tp = 0;
    while (tp + 512 <= tar.length) {
      let allZero = true;
      for (let i = 0; i < 512; i++) if (tar[tp + i] !== 0) { allZero = false; break; }
      if (allZero) break;
      // ustar prefix split: long paths carry their directory in the
      // 155-byte prefix field at offset 345.
      const short = readNullStr(tp, 100);
      const prefix = readNullStr(tp + 345, 155);
      const name = prefix ? `${prefix}/${short}` : short;
      const sizeStr = readNullStr(tp + 124, 12).trim();
      const size = sizeStr ? parseInt(sizeStr, 8) : 0;
      tp += 512;
      if (size > 0) {
        tarEntries.push({name, size, data: tar.subarray(tp, tp + size)});
        tp += size;
        const pad = (512 - (size % 512)) % 512;
        tp += pad;
      }
    }

    const names = tarEntries.map((e) => e.name).sort();
    assert(names.includes('README.md'), `tar should include README.md, got ${names.join(', ')}`);
    assert(names.includes('duckdb.sql'), `tar should include duckdb.sql, got ${names.join(', ')}`);
    assert(names.includes('screenshots.json'), `tar should include screenshots.json, got ${names.join(', ')}`);
    assert(names.some((n) => /\.jsonl$/.test(n)), `tar should include a .jsonl entry, got ${names.join(', ')}`);
    // Markdown report was eliminated — verify it's *not* bundled. The
    // only .md files that should appear are the README, the agent-
    // friendly repair-index, AGENT-PROTOCOL.md (Send-to-Agent doctrine),
    // the bundled DESIGN.md, the PinchGrab triage SKILL.md (under
    // .agents/), and the vendored skill trees (impeccable reference set +
    // perception-first-design, when bundled).
    const allowedMd = new Set(['README.md', 'repair-index.md', 'AGENT-PROTOCOL.md', 'DESIGN.md', '.agents/skills/PinchGrab/SKILL.md']);
    const isVendoredSkillMd = (n: string): boolean =>
      n.startsWith('.agents/skills/impeccable/') || n.startsWith('perception-first-design/');
    assert(!names.some((n) => /\.md$/.test(n) && !allowedMd.has(n) && !isVendoredSkillMd(n)),
      `tar must not include a Markdown report .md, got ${names.join(', ')}`);
    assert(names.includes('AGENT-PROTOCOL.md'), `tar should include AGENT-PROTOCOL.md, got ${names.join(', ')}`);
    // Screenshots: at least one screenshots/*.png entry from the seeded shotsFull.
    const pngEntries = tarEntries.filter((e) => /^screenshots\/.+\.png$/.test(e.name));
    assert(pngEntries.length >= 1, `tar should include at least one screenshot PNG, got: ${names.filter((n) => n.startsWith('screenshots/')).join(', ')}`);
    // PNG signature on the first PNG entry.
    const png = pngEntries[0]!.data;
    assert(png[0] === 0x89 && png[1] === 0x50 && png[2] === 0x4e && png[3] === 0x47,
      `screenshot entry should have PNG magic, got bytes ${[...png.subarray(0, 4)].map((b) => b.toString(16))}`);

    // README content check (verifies tar didn't corrupt strings).
    const readme = tarEntries.find((e) => e.name === 'README.md')!;
    const readmeText = dec.decode(readme.data);
    assert(readmeText.startsWith('# PinchGrab Workspace Export'), 'README.md content should round-trip');
    assert(readmeText.includes('.tar.zst'), 'README should reference the .tar.zst format');

    console.log(`exports 9 ok: tar.zst parses (${tarEntries.length} entries, ${pngEntries.length} screenshots, README round-trips)`);
  }

  // ─── Test 10 ── No day-keyed strings anywhere in built output ──────────
  await seed();
  {
    const jsonl = await page.evaluate(() => window.__pinchgrab_panel.buildJsonl('z.jsonl'));
    const filename = await page.evaluate(() => window.__pinchgrab_panel.buildExportFilename('jsonl'));
    assert(!/\d{4}-\d{2}-\d{2}\.jsonl$/.test(filename),
      `filename must not end in YYYY-MM-DD, got ${filename}`);
    const manifest = JSON.parse(jsonl.split('\n')[0]!);
    assert(/^\d+$/.test(String(manifest.generated)), 'manifest.generated must be raw epoch');
    console.log('exports 10 ok: no YYYY-MM-DD keys in filenames');
  }

  // ─── Test 11 ── denormalizeEntry is pure: doesn't mutate input nested objects.
  // Prevents the regression where attrs.format was deleted from the caller's
  // attrs object via a shallow {...raw} spread.
  {
    const result = await page.evaluate(() => {
      const sp: any = window.__pinchgrab_panel;
      const original = {
        n: 1, ts: '2026-05-08T10:00:00.000Z',
        url: 'https://h.com/', tag: 'button', selector: '#x',
        rect: { x: 0, y: 0, w: 1, h: 1 }, viewport: { w: 1, h: 1, dpr: 1 },
        attrs: { type: 'button', format: 'YYYY-MM-DD' },
      };
      const beforeAttrsKeys = Object.keys(original.attrs);
      const out = sp.denormalizeEntry(original);
      const afterAttrsKeys = Object.keys(original.attrs);
      return {
        beforeAttrsKeys, afterAttrsKeys,
        originalAttrsFormat: original.attrs.format,
        outAttrsFormat: out.attrs.format,
        outHintsFormat: out.hints?.format,
      };
    });
    assert.deepStrictEqual(result.afterAttrsKeys, result.beforeAttrsKeys,
      `denormalizeEntry must not mutate input: original.attrs keys went from ${result.beforeAttrsKeys} to ${result.afterAttrsKeys}`);
    assert.strictEqual(result.originalAttrsFormat, 'YYYY-MM-DD', 'original.attrs.format must remain');
    assert.strictEqual(result.outAttrsFormat, undefined, 'output entry should have format moved off attrs');
    assert.strictEqual(result.outHintsFormat, 'YYYY-MM-DD', 'output entry should have format on hints');
    console.log('exports 11 ok: denormalizeEntry is pure (input attrs unchanged)');
  }

  // ─── Test 12 ── DuckDB snippet references lastExport.relPath when set.
  {
    // Reset, run an export to populate lastExport, then check the snippet
    // uses that filename's leaf rather than synthesizing a fresh epoch one.
    await seed();
    await page.evaluate(() => window.__pinchgrab_panel.onExport());
    await page.waitForFunction(() => {
      const sp: any = window.__pinchgrab_panel;
      return sp.getLastExport().relPath !== null;
    });
    const observed = await page.evaluate(() => {
      const sp: any = window.__pinchgrab_panel;
      const last = sp.getLastExport();
      // Manually invoke the snippet builder using the same path the palette
      // command uses. We expose duckDbSnippet directly; the file-picking
      // logic lives in onDuckDbSnippet, so we reproduce it here:
      const leaf = (last.relPath ?? '').split('/').pop();
      return { leaf, sql: sp.duckDbSnippet(leaf) };
    });
    assert(observed.leaf && /\.jsonl$/.test(observed.leaf),
      `lastExport leaf should be a .jsonl, got ${observed.leaf}`);
    assert(new RegExp(`read_json_auto\\(\\s*'${observed.leaf.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}'`).test(observed.sql),
      `DuckDB snippet must reference last export filename ${observed.leaf}`);
    // And the SQL should NOT use the broken empty-list coalesce.
    assert(!observed.sql.includes('coalesce(classes, [])'),
      'DuckDB snippet must not use the empty-list coalesce that fails type inference');
    assert(observed.sql.includes("AND s.type = 'selector'"),
      'feedback↔selector join should filter s.type to avoid feedback↔feedback matches');
    console.log(`exports 12 ok: DuckDB snippet uses lastExport (${observed.leaf})`);
  }

  // ─── Test 13 ── Manifest carries skill + design pointers ──────────────
  await seed();
  {
    const manifest = await page.evaluate(() => {
      const sp: any = window.__pinchgrab_panel;
      const jsonl = sp.buildJsonl('z.jsonl');
      return JSON.parse(jsonl.split('\n')[0]!);
    });
    assert(manifest.skill, `manifest should carry a skill block, got ${JSON.stringify(manifest)}`);
    // Skill renamed to PinchGrab in 2026-05 (was `ui`). For JSONL-only
    // exports, the skill is referenced by `path` (the receiver resolves
    // it on their filesystem); only tar.zst exports flip `inline: true`
    // because that's where the file is physically bundled.
    assert.strictEqual(manifest.skill.name, 'PinchGrab');
    assert.strictEqual(manifest.skill.inline, false, 'JSONL export references skill by path, not inline');
    assert(/SKILL\.md$/.test(manifest.skill.path), `skill.path should reference SKILL.md, got ${manifest.skill.path}`);
    assert(manifest.design, `manifest should carry a design block, got ${JSON.stringify(manifest)}`);
    assert.strictEqual(manifest.design.inline, false, 'JSONL export references design by path, not inline');
    assert(/DESIGN\.md$/.test(manifest.design.path), `design.path should reference DESIGN.md, got ${manifest.design.path}`);
    console.log(`exports 13 ok: manifest skill + design pointers (${manifest.skill.path}, ${manifest.design.path})`);
  }

  // ─── Test 14 ── DESIGN.md inline bundling in tar.zst ──────────────────
  // When the user pastes/uploads DESIGN.md content via settings, the
  // archive should bundle it as a `DESIGN.md` entry AND the manifest
  // should flip `design.inline: true`.
  {
    const captured = await page.evaluate(async () => {
      const sp: any = window.__pinchgrab_panel;
      sp.setPrefs({designMd: '# My Design\n\nColor primary: #abc123\n'});
      let savedBytes: Uint8Array | null = null;
      const origCreate = URL.createObjectURL;
      URL.createObjectURL = () => 'blob:test://stub';
      const origAnchorClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () { /* no-op */ };
      const origBlob = window.Blob;
      (window as any).Blob = function (parts: any[], opts: any) {
        if (parts && parts[0] && (parts[0] as any).byteLength) {
          const p = parts[0];
          savedBytes = p instanceof Uint8Array ? new Uint8Array(p) : new Uint8Array(p.buffer ?? p);
        }
        return new origBlob(parts, opts);
      } as any;
      await sp.onExportZip();
      URL.createObjectURL = origCreate;
      HTMLAnchorElement.prototype.click = origAnchorClick;
      (window as any).Blob = origBlob;
      // Reset designMd so it doesn't pollute later tests.
      sp.setPrefs({designMd: ''});
      return savedBytes ? Array.from(savedBytes) : null;
    });
    assert(captured && captured.length > 0, 'archive bytes should be captured');
    const u8 = Uint8Array.from(captured);
    // Decompress the tar.zst (raw-block frame as before).
    const fcsSize = (u8[4]! >>> 6) & 0b11;
    assert.strictEqual(fcsSize, 0b10);
    const fcs = u8[5]! | (u8[6]! << 8) | (u8[7]! << 16) | (u8[8]! * 0x1000000);
    let pos = 9;
    const tar = new Uint8Array(fcs);
    let outPos = 0;
    for (;;) {
      const headerInt = u8[pos]! | (u8[pos + 1]! << 8) | (u8[pos + 2]! << 16);
      pos += 3;
      const isLast = (headerInt & 1) === 1;
      const blockSize = (headerInt >>> 3) & 0x1f_ff_ff;
      tar.set(u8.subarray(pos, pos + blockSize), outPos);
      outPos += blockSize;
      pos += blockSize;
      if (isLast) break;
    }
    // Walk the tar — same shape as test 9.
    const dec = new TextDecoder();
    const readNullStr = (offset: number, length: number): string => {
      let end = offset + length;
      for (let i = offset; i < offset + length; i++) {
        if (tar[i] === 0) { end = i; break; }
      }
      return dec.decode(tar.subarray(offset, end));
    };
    const tarEntries: {name: string; data: Uint8Array}[] = [];
    let tp = 0;
    while (tp + 512 <= tar.length) {
      let allZero = true;
      for (let i = 0; i < 512; i++) if (tar[tp + i] !== 0) { allZero = false; break; }
      if (allZero) break;
      const name = readNullStr(tp, 100);
      const sizeStr = readNullStr(tp + 124, 12).trim();
      const size = sizeStr ? parseInt(sizeStr, 8) : 0;
      tp += 512;
      if (size > 0) {
        tarEntries.push({name, data: tar.subarray(tp, tp + size)});
        tp += size;
        const pad = (512 - (size % 512)) % 512;
        tp += pad;
      }
    }
    const designEntry = tarEntries.find((e) => e.name === 'DESIGN.md');
    assert(designEntry, `tar should contain DESIGN.md, got ${tarEntries.map((e) => e.name).join(', ')}`);
    const designText = dec.decode(designEntry!.data);
    assert(designText.includes('My Design') && designText.includes('#abc123'),
      `DESIGN.md content should round-trip, got "${designText.slice(0, 80)}…"`);
    // Manifest inside the JSONL entry should declare inline: true.
    const jsonlEntry = tarEntries.find((e) => /\.jsonl$/.test(e.name));
    assert(jsonlEntry, 'tar should contain a .jsonl entry');
    const manifestLine = JSON.parse(dec.decode(jsonlEntry!.data).split('\n')[0]!);
    assert.strictEqual(manifestLine.design.inline, true,
      `manifest design.inline should be true when DESIGN.md is bundled, got ${JSON.stringify(manifestLine.design)}`);
    console.log(`exports 14 ok: DESIGN.md bundled (${designEntry.data.length} bytes) · manifest design.inline=true`);
  }

  // Shared helper for tests 15–17: run onExportZip with the download
  // plumbing stubbed, returning the captured archive bytes + the payload.
  const exportZipCaptured = async (): Promise<{bytes: number[]; prompt: string | null; relPath: string | null}> =>
    page.evaluate(async () => {
      const sp: any = window.__pinchgrab_panel;
      let savedBytes: Uint8Array | null = null;
      const origCreate = URL.createObjectURL;
      URL.createObjectURL = () => 'blob:test://stub';
      const origAnchorClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () { /* no-op */ };
      const origBlob = window.Blob;
      (window as any).Blob = function (parts: any[], opts: any) {
        if (parts && parts[0] && (parts[0] as any).byteLength) {
          const p = parts[0];
          savedBytes = p instanceof Uint8Array ? new Uint8Array(p) : new Uint8Array(p.buffer ?? p);
        }
        return new origBlob(parts, opts);
      } as any;
      await sp.onExportZip();
      URL.createObjectURL = origCreate;
      HTMLAnchorElement.prototype.click = origAnchorClick;
      (window as any).Blob = origBlob;
      return {
        bytes: savedBytes ? Array.from(savedBytes as Uint8Array) : [],
        prompt: sp.getLastAgentPrompt(),
        relPath: sp.getLastExport().relPath,
      };
    });
  // Prefix-aware tar extraction (ustar prefix field at offset 345).
  const extractTar = (archive: number[]): {name: string; data: Uint8Array}[] => {
    const u8 = Uint8Array.from(archive);
    const fcs = u8[5]! | (u8[6]! << 8) | (u8[7]! << 16) | (u8[8]! * 0x1000000);
    let pos = 9;
    const tar = new Uint8Array(fcs);
    let outPos = 0;
    for (;;) {
      const headerInt = u8[pos]! | (u8[pos + 1]! << 8) | (u8[pos + 2]! << 16);
      pos += 3;
      const isLast = (headerInt & 1) === 1;
      const blockSize = (headerInt >>> 3) & 0x1f_ff_ff;
      tar.set(u8.subarray(pos, pos + blockSize), outPos);
      outPos += blockSize;
      pos += blockSize;
      if (isLast) break;
    }
    const dec2 = new TextDecoder();
    const readStr = (offset: number, length: number): string => {
      let end = offset + length;
      for (let i = offset; i < offset + length; i++) if (tar[i] === 0) { end = i; break; }
      return dec2.decode(tar.subarray(offset, end));
    };
    const out: {name: string; data: Uint8Array}[] = [];
    let tp = 0;
    while (tp + 512 <= tar.length) {
      let allZero = true;
      for (let i = 0; i < 512; i++) if (tar[tp + i] !== 0) { allZero = false; break; }
      if (allZero) break;
      const short = readStr(tp, 100);
      const prefix = readStr(tp + 345, 155);
      const name = prefix ? `${prefix}/${short}` : short;
      const sizeStr = readStr(tp + 124, 12).trim();
      const size = sizeStr ? parseInt(sizeStr, 8) : 0;
      tp += 512;
      if (size > 0) {
        out.push({name, data: tar.subarray(tp, tp + size)});
        tp += size;
        const pad = (512 - (size % 512)) % 512;
        tp += pad;
      }
    }
    return out;
  };

  // ─── Test 15 ── Send-to-Agent clipboard payload: line order + contracts ─
  // The payload is the product promise of the Send-to-Agent flow: exact
  // line ordering, @-prefixed absolute paths, the non-optional no-grep
  // rule, a hydrated idempotent bootstrap, and a stock-DESIGN warning that
  // appears ONLY while the operator ships the template.
  await seed();
  {
    await page.evaluate(() => window.__pinchgrab_panel.__setExportClock('2026-07-11T00:00:00.000Z'));
    const templated = await exportZipCaptured();
    assert(templated.prompt, 'Send to Agent should record an agent prompt');
    const lines = templated.prompt!.split('\n').map((l) => JSON.parse(l));
    assert.deepStrictEqual(
      lines.map((l) => l.type),
      ['pinchgrab-send-to-agent', 'instruction', 'bootstrap', 'files', 'tree', 'orchestration', 'warning', 'verify', 'done'],
      'payload line order must match the protocol exactly (warning present on template DESIGN.md)');
    const header = lines[0];
    assert(/^[0-9a-f]{16}$/.test(header.bundleId), `bundleId should be 16 hex, got ${header.bundleId}`);
    assert.strictEqual(header.designIsStockTemplate, true);
    assert.strictEqual(header.counts.comments, 1);
    const files = lines.find((l) => l.type === 'files');
    assert.strictEqual(files.noGrep, true);
    assert.strictEqual(files.readFully, true);
    assert(files.paths.every((p: string) => p.startsWith('@')), `every file path must be @-prefixed, got ${files.paths.join(', ')}`);
    assert(files.paths.some((p: string) => p.endsWith('/AGENT-PROTOCOL.md')), 'files must include AGENT-PROTOCOL.md');
    assert(/do not grep/i.test(files.rule), 'the no-grep rule must be spelled out');
    const boot = lines.find((l) => l.type === 'bootstrap');
    assert.strictEqual(boot.idempotent, true);
    assert(boot.script.includes("WS='default'") && boot.script.includes(`BID='${header.bundleId}'`),
      'bootstrap must hydrate workspace + bundleId');
    assert(boot.script.includes('.extracted'), 'bootstrap must be guarded by the .extracted marker');
    const orch = lines.find((l) => l.type === 'orchestration');
    assert.deepStrictEqual(orch.phases, ['map', 'plan', 'implement', 'audit', 'verify']);
    for (const phrase of ['mapped_skills', '/plan', 'roast', '/perception-first-design:all', 'NOT overwrite', 'SERIALLY']) {
      assert(orch.text.includes(phrase), `orchestration must retain "${phrase}"`);
    }
    assert(lines.find((l) => l.type === 'verify').text.includes('pinchgrab recapture'),
      'verify line must point at the recapture CLI');
    // Customized DESIGN.md → warning line disappears.
    await page.evaluate(() => window.__pinchgrab_panel.setPrefs({designMd: '# Product canon\n'}));
    const customized = await exportZipCaptured();
    const types2 = customized.prompt!.split('\n').map((l) => JSON.parse(l).type);
    assert(!types2.includes('warning'), 'warning line must vanish once DESIGN.md is customized');
    assert.strictEqual(JSON.parse(customized.prompt!.split('\n')[0]!).designIsStockTemplate, false);
    await page.evaluate(() => window.__pinchgrab_panel.setPrefs({designMd: ''}));
    console.log('exports 15 ok: Send-to-Agent payload (9-line order, @-paths, no-grep, hydrated bootstrap, conditional warning)');
  }

  // ─── Test 16 ── Frozen clock ⇒ re-export is byte-identical + same name ─
  await seed();
  {
    await page.evaluate(() => window.__pinchgrab_panel.__setExportClock('2026-07-11T00:00:00.000Z'));
    const a = await exportZipCaptured();
    const b = await exportZipCaptured();
    assert(a.bytes.length > 0, 'first export should produce bytes');
    assert.strictEqual(a.relPath, b.relPath, 'unchanged content must re-export to the SAME filename (overwrite, not duplicate)');
    assert.strictEqual(a.bytes.length, b.bytes.length, 'byte length must match across re-exports');
    for (let i = 0; i < a.bytes.length; i++) {
      if (a.bytes[i] !== b.bytes[i]) assert.fail(`archives diverge at byte ${i}`);
    }

    // ─── Test 17 ── Bundle extras: vendored skills, protocol, manifest ──
    const entries = extractTar(a.bytes);
    const names = entries.map((e) => e.name);
    for (const expected of [
      'AGENT-PROTOCOL.md',
      'skills-index.json',
      '.agents/skills/impeccable/reference/polish.md',
      '.agents/skills/impeccable/LICENSE',
      'perception-first-design/skills/pfd/SKILL.md',
      'perception-first-design/LICENSE',
      // 107 chars — proves the ustar prefix path survives end-to-end.
      'perception-first-design/skills/pfd/references/learnings/L0/l018-backend-mechanics-as-frontend-complexity.md',
    ]) {
      assert(names.includes(expected), `tar must include ${expected} (got ${names.length} entries)`);
    }
    const dec = new TextDecoder();
    const protocol = dec.decode(entries.find((e) => e.name === 'AGENT-PROTOCOL.md')!.data);
    for (const phrase of ['work-manifest.jsonl', 'mapped_skills', 'pinchgrab recapture', 'never skip a phase', 'NOT overwrite']) {
      assert(protocol.includes(phrase), `AGENT-PROTOCOL.md must retain "${phrase}"`);
    }
    const jsonl = dec.decode(entries.find((e) => /\.jsonl$/.test(e.name))!.data);
    const manifest = JSON.parse(jsonl.split('\n')[0]!);
    assert.strictEqual(manifest.agentProtocol?.archivePath, 'AGENT-PROTOCOL.md');
    assert(Array.isArray(manifest.bundledSkills) && manifest.bundledSkills.length >= 34,
      `manifest.bundledSkills should list the skill inventory, got ${manifest.bundledSkills?.length}`);
    assert(/^[0-9a-f]{16}$/.test(manifest.bundleId), 'manifest.bundleId should be 16 hex');
    // Bundle .gitignore + token budget (signal < total, ignore points at it).
    const ignore = entries.find((e) => e.name === '.gitignore');
    assert(ignore, `tar should include a bundle .gitignore, got ${names.join(', ')}`);
    const ignoreTxt = dec.decode(ignore!.data);
    assert(/\.agents\/skills\/impeccable\//.test(ignoreTxt) && /do NOT honor this too strictly/i.test(ignoreTxt),
      'bundle .gitignore must mark the lazy skills set and carry the not-too-strictly warning');
    assert(manifest.tokens && manifest.tokens.ignore === '.gitignore', 'manifest.tokens should point at the .gitignore');
    assert(manifest.tokens.signalTokens < manifest.tokens.totalTokens,
      `signal tokens (${manifest.tokens?.signalTokens}) must be < total (${manifest.tokens?.totalTokens}) with skills bundled`);
    const fb = jsonl.split('\n').filter(Boolean).map((l) => JSON.parse(l)).find((l) => l.type === 'feedback');
    assert(Array.isArray(fb.suggestedSkills) && fb.suggestedSkills.some((s: any) => s.skill === 'pinchgrab'),
      `feedback rows should carry suggestedSkills locator seeds, got ${JSON.stringify(fb.suggestedSkills)}`);
    await page.evaluate(() => window.__pinchgrab_panel.__setExportClock(null));
    console.log(`exports 16+17 ok: frozen-clock re-export byte-identical (${a.bytes.length} bytes) · vendored skills + protocol + manifest addenda in tar (${names.length} entries)`);
  }

  // ─── Test 18 ── PII redaction (opt-in) scrubs captured content ─────────
  {
    await page.evaluate(() => window.__pinchgrab_panel.clear());
    const out = await page.evaluate(() => {
      const sp: any = window.__pinchgrab_panel;
      sp.setPrefs({ redactPII: true });
      sp.pushMessage({ type: 'selector', id: 'pii1', ts: 't', entry: {
        uid: 'p1', n: 1, ts: 't', url: 'https://x.test/p?token=sk-ABCdef0123456789xyz&keep=1',
        tag: 'div', selector: '#p', text: 'reach me: jane@acme.io / 415-555-0199',
        accessibleName: 'ssn 123-45-6789', rect: { x: 0, y: 0, w: 1, h: 1 }, viewport: { w: 1, h: 1, dpr: 1 },
      }});
      const jsonl = sp.buildJsonl('pii.jsonl');
      const sel = jsonl.split('\n').map((l: string) => { try { return JSON.parse(l); } catch { return {}; } })
        .find((x: any) => x.type === 'selector');
      sp.setPrefs({ redactPII: false });
      return { text: sel.text, an: sel.accessibleName, url: sel.url };
    });
    assert(out.text.includes('[redacted-email]') && out.text.includes('[redacted-phone]'), `text should be scrubbed: ${out.text}`);
    assert(out.an.includes('[redacted-ssn]'), `accessibleName ssn should be scrubbed: ${out.an}`);
    assert(!out.url.includes('sk-ABCdef0123456789xyz') && /keep=1/.test(out.url), `url token scrubbed, non-secret kept: ${out.url}`);
    console.log('exports 18 ok: PII redaction scrubs text / accessibleName / url query');
  }

  console.log('exports.spec all tests passed');
  await browser.close();
  server.close();
  process.exit(0);
})();

declare global {
  interface Window {
    __pinchgrab_panel: any;
    __pinchgrab: any;
  }
}
