// Doctrine-drift guards for the vendored skill sources and the public README.
//
// third_party/*/UPSTREAM.lock is the provenance contract written by
// scripts/sync-bundled-skills.ts; the vendored tree, the built
// extension/skills/ copy, and the generated skills-index.json must all agree
// with it. These tests fail when anyone hand-edits vendored content without
// re-syncing, or when a build regresses the skills packaging the
// Send-to-Agent protocol depends on.
//
// Run: node --test tests/bundled-skills.test.mjs   (after `bun run build`)

import test from 'node:test';
import assert from 'node:assert';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve('.');
const THIRD = join(ROOT, 'third_party');
const EXT_SKILLS = join(ROOT, 'extension', 'skills');

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const walk = (dir) => {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
};

const sources = readdirSync(THIRD).filter((n) => existsSync(join(THIRD, n, 'UPSTREAM.lock')));
assert(sources.length >= 2, `expected impeccable + perception-first-design under third_party/, got ${sources.join(', ')}`);

for (const name of sources) {
  const lock = JSON.parse(readFileSync(join(THIRD, name, 'UPSTREAM.lock'), 'utf-8'));

  test(`${name}: lock provenance is well-formed`, () => {
    assert(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/.test(lock.repo), `repo url: ${lock.repo}`);
    assert(/^[0-9a-f]{40}$/.test(lock.sha), `pinned sha: ${lock.sha}`);
    assert(lock.license, 'license recorded');
    assert(Array.isArray(lock.files) && lock.files.length > 0, 'file list recorded');
  });

  test(`${name}: vendored tree matches the lock byte-for-byte`, () => {
    for (const row of lock.files) {
      const p = join(THIRD, name, row.path);
      assert(existsSync(p), `lock lists missing file: ${row.path}`);
      const buf = readFileSync(p);
      assert.strictEqual(buf.length, row.bytes, `${row.path}: size drift`);
      assert.strictEqual(sha256(buf), row.sha256, `${row.path}: content drift — re-run bun run sync:skills`);
    }
    // No stragglers: everything under the content tree is in the lock.
    const locked = new Set(lock.files.map((f) => f.path));
    const actual = walk(join(THIRD, name))
      .map((p) => p.slice(join(THIRD, name).length + 1).split('\\').join('/'))
      .filter((p) => p !== 'UPSTREAM.lock');
    for (const p of actual) assert(locked.has(p), `unlocked file in third_party/${name}: ${p}`);
  });

  test(`${name}: build copied every locked file into extension/skills/`, () => {
    for (const row of lock.files) {
      const p = join(EXT_SKILLS, name, row.path);
      assert(existsSync(p), `extension/skills/${name}/${row.path} missing — run bun run build`);
      assert.strictEqual(sha256(readFileSync(p)), row.sha256, `${row.path}: built copy drifted from lock`);
    }
  });
}

test('licensing: upstream LICENSE/NOTICE files travel with the vendored trees', () => {
  for (const p of [
    'impeccable/LICENSE', 'impeccable/NOTICE.md',
    'perception-first-design/LICENSE', 'perception-first-design/NOTICE',
  ]) {
    assert(existsSync(join(THIRD, p)), `third_party/${p} must exist`);
  }
  const notices = readFileSync(join(ROOT, 'THIRD-PARTY-NOTICES.md'), 'utf-8');
  for (const marker of ['Apache', 'CC BY-SA 4.0', '99686343', 'sync:skills']) {
    assert(notices.includes(marker), `THIRD-PARTY-NOTICES.md must mention "${marker}"`);
  }
});

test('skills-index.json: 34 locators, provenance per source, pfd invocation', () => {
  const index = JSON.parse(readFileSync(join(EXT_SKILLS, 'skills-index.json'), 'utf-8'));
  assert.strictEqual(index.kind, 'pinchgrab/skills-index');
  assert.strictEqual(index.skills.length, 34, `pinchgrab + 32 impeccable + pfd, got ${index.skills.length}`);
  for (const s of index.sources) assert(/^[0-9a-f]{40}$/.test(s.sha), `source ${s.name} must pin a sha`);
  const pfd = index.skills.find((s) => s.id === 'pfd');
  assert.strictEqual(pfd.invoke, '/perception-first-design:all');
  assert.strictEqual(pfd.path, 'perception-first-design/skills/pfd/SKILL.md');
  // Every locator the index promises exists in the built extension.
  for (const s of index.skills) {
    if (s.source === 'pinchgrab') continue; // prefs-resolved at export time
    const extPath = s.path.startsWith('.agents/skills/impeccable/')
      ? join(EXT_SKILLS, 'impeccable', s.path.slice('.agents/skills/impeccable/'.length))
      : join(EXT_SKILLS, s.path);
    assert(existsSync(extPath), `index promises ${s.path} but ${extPath} is missing`);
  }
});

test('README: no benchmark wording (operator ruling), links resolve, matrix present', () => {
  const md = readFileSync(join(ROOT, 'README.md'), 'utf-8');
  assert(!/benchmark/i.test(md), 'README must not reintroduce benchmark wording');
  assert(md.includes('## 🥊 PinchGrab vs Claude Design'), 'comparison section present');
  assert((md.match(/^\| /gm) ?? []).length >= 14, 'comparison matrix should have its rows');
  assert(md.includes('What PinchGrab is — and is not'), 'positioning section present');
  assert(md.includes('THIRD-PARTY-NOTICES.md'), 'license section points at third-party notices');
  const links = [...md.matchAll(/\]\((?!http|#|mailto)([^)]+)\)/g)].map((m) => m[1].split(' ')[0]);
  for (const l of links) assert(existsSync(join(ROOT, l)), `README links to missing file: ${l}`);
});
