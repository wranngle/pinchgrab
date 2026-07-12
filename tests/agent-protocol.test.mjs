// Send-to-Agent protocol units: the prompt/protocol builders
// (src/export-agent-prompt.mjs) and the recapture verification leg
// (src/recapture.mjs). Grouped here by concern: everything a consuming
// agent depends on AFTER the export leaves the extension.
//
// Run: node --test tests/agent-protocol.test.mjs

import test from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildAgentPromptJsonl,
  buildAgentProtocolMd,
  buildBootstrapScript,
  renderBundleTree,
  extractDir,
} from '../src/export-agent-prompt.mjs';
import { parseBundleJsonl, recapture, selectTargets, toReplayEntry } from '../src/recapture.mjs';

const OPTS = {
  workspace: 'default',
  bundleId: 'abcdef0123456789',
  archivePath: '/home/u/Downloads/pinchgrab/default/exports/pinchgrab-default-app-abcdef01.tar.zst',
  exportTs: '2026-07-11T00:00:00.000Z',
  jsonlName: 'pinchgrab-default-app-abcdef01.jsonl',
  counts: { comments: 2, selectors: 3, pages: 1, screenshots: 4 },
  entryNames: [
    'README.md', 'AGENT-PROTOCOL.md', 'repair-index.md',
    'pinchgrab-default-app-abcdef01.jsonl', 'screenshots.json', 'duckdb.sql',
    'schema.json', 'DESIGN.md', 'skills-index.json',
    '.agents/skills/PinchGrab/SKILL.md',
    'perception-first-design/skills/pfd/SKILL.md',
    'screenshots/a.png', 'screenshots/b.png',
  ],
  designIsTemplate: true,
};

// ─── Prompt payload ─────────────────────────────────────────────────────────

test('payload: deterministic — identical opts produce identical bytes', () => {
  assert.strictEqual(buildAgentPromptJsonl(OPTS), buildAgentPromptJsonl(OPTS));
});

test('payload: nine lines in protocol order, warning gated on template design', () => {
  const lines = buildAgentPromptJsonl(OPTS).split('\n').map((l) => JSON.parse(l));
  assert.deepStrictEqual(
    lines.map((l) => l.type),
    ['pinchgrab-send-to-agent', 'instruction', 'bootstrap', 'files', 'tree', 'orchestration', 'warning', 'verify', 'done'],
  );
  const without = buildAgentPromptJsonl({ ...OPTS, designIsTemplate: false })
    .split('\n').map((l) => JSON.parse(l).type);
  assert(!without.includes('warning'), 'customized DESIGN.md must drop the warning line');
});

test('payload: mandatory clauses survive verbatim', () => {
  const payload = buildAgentPromptJsonl(OPTS);
  for (const phrase of [
    'NON-OPTIONAL', 'Do NOT grep', 'mapped_skills', 'suggestedSkills',
    '/plan (planning) capability', "blind atomic 'roast' peer review",
    '/perception-first-design:all', 'SERIALLY in this exact order',
    'NO need to install them permanently', 'pinchgrab recapture',
    'append-only: add rows, never rewrite history',
  ]) {
    assert(payload.includes(phrase), `payload must retain "${phrase}"`);
  }
});

test('payload: files line paths are @-prefixed under the extraction dir', () => {
  const files = buildAgentPromptJsonl(OPTS).split('\n').map((l) => JSON.parse(l)).find((l) => l.type === 'files');
  const xDir = extractDir(OPTS.workspace, OPTS.bundleId);
  assert(files.paths.every((p) => p.startsWith(`@${xDir}/`)), files.paths.join('\n'));
  // pfd SKILL is present in entryNames, so its mandatory-read path appears;
  // absent entries must not be promised.
  assert(files.paths.some((p) => p.endsWith('perception-first-design/skills/pfd/SKILL.md')));
  const noPfd = buildAgentPromptJsonl({ ...OPTS, entryNames: OPTS.entryNames.filter((n) => !n.startsWith('perception-first-design/')) });
  const files2 = noPfd.split('\n').map((l) => JSON.parse(l)).find((l) => l.type === 'files');
  assert(!files2.paths.some((p) => p.includes('perception-first-design')), 'files list must not promise absent entries');
});

test('bootstrap: hydrates workspace/bundle/archive, parses as bash, idempotence-guarded', () => {
  const script = buildBootstrapScript(OPTS);
  assert(script.includes(`WS='${OPTS.workspace}'`));
  assert(script.includes(`BID='${OPTS.bundleId}'`));
  assert(script.includes(`SRC='${OPTS.archivePath}'`));
  assert(script.includes('.extracted'), 'must be guarded by the .extracted marker');
  assert(script.includes('work-manifest.jsonl'), 'must seed the work manifest header');
  assert(script.startsWith('#!/usr/bin/env bash'));
});

test('tree: collapses big FLAT directories and stays deterministic', () => {
  const many = Array.from({ length: 40 }, (_, i) => `screenshots/s${i}.png`);
  const text = renderBundleTree(['README.md', ...many]);
  assert(text.includes('screenshots/ (40 files)'), text);
  assert(!text.includes('s17.png'), 'collapsed dirs must not enumerate children');
  assert.strictEqual(text, renderBundleTree([...many, 'README.md'].reverse()), 'order-insensitive');
});

test('tree: keeps skill-locator structure visible, not folded into one line', () => {
  // The regression: a naive size-based collapse folded the whole .agents/
  // tree into `.agents/ (35 files)`, hiding the very locators mapped_skills
  // cites. Structured dirs must be descended so those paths stay visible.
  const names = [
    '.agents/skills/PinchGrab/SKILL.md',
    ...Array.from({ length: 32 }, (_, i) => `.agents/skills/impeccable/reference/r${i}.md`),
    'perception-first-design/skills/pfd/SKILL.md',
  ];
  const text = renderBundleTree(names);
  assert(!/\.agents\/ \(\d+ files\)/.test(text), `.agents/ must NOT collapse to one opaque line:\n${text}`);
  assert(text.includes('PinchGrab/'), 'PinchGrab skill dir must be visible');
  assert(text.includes('pfd/'), 'pfd skill dir must be visible');
  assert(/reference\/ \(32 files\)/.test(text), 'the flat 32-file reference dir may collapse');
});

// ─── AGENT-PROTOCOL.md ──────────────────────────────────────────────────────

test('protocol doc: tokenized bootstrap + doctrine sections + skill table', () => {
  const md = buildAgentProtocolMd({
    ...OPTS,
    skillsIndex: { skills: [
      { id: 'pinchgrab', path: '.agents/skills/PinchGrab/SKILL.md', purpose: 'triage' },
      { id: 'pfd', path: 'perception-first-design/skills/pfd/SKILL.md', purpose: 'framework', invoke: '/perception-first-design:all' },
    ] },
  });
  assert(md.includes("SRC='<ARCHIVE_PATH>'"), 'in-bundle bootstrap must stay tokenized');
  for (const phrase of [
    'work-manifest.jsonl', 'mapped_skills', 'pinchgrab-subagent-plan',
    'never skip a phase', 'NOT overwrite', 'pinchgrab recapture',
    '| `pfd` |', '/perception-first-design:all',
  ]) {
    assert(md.includes(phrase), `protocol doc must retain "${phrase}"`);
  }
  assert.strictEqual(md, buildAgentProtocolMd({ ...OPTS, skillsIndex: { skills: [
    { id: 'pinchgrab', path: '.agents/skills/PinchGrab/SKILL.md', purpose: 'triage' },
    { id: 'pfd', path: 'perception-first-design/skills/pfd/SKILL.md', purpose: 'framework', invoke: '/perception-first-design:all' },
  ] } }), 'deterministic');
});

// ─── Recapture ──────────────────────────────────────────────────────────────

const BUNDLE_JSONL = [
  '{"v":2,"type":"manifest","tool":"pinchgrab","ts":"2026-07-11T00:00:00.000Z","workspace":"default","filename":"b.tar.zst","format":"tar.zst","bundleId":"abcdef0123456789","hosts":[],"counts":{"selectors":2,"feedback":1,"pages":0}}',
  '{"v":2,"type":"selector","uid":"u-hit","n":1,"ts":"t","url":"http://x/","tag":"button","selector":"#cta","role":"button","accessibleName":"Buy","screenshot":{"element":"screenshots/cta.png"}}',
  '{"v":2,"type":"feedback","uid":"f-1","ts":"t","text":"wrong color","parentUid":"u-hit","tags":[]}',
  '{"v":2,"type":"selector","uid":"u-quiet","n":2,"ts":"t","url":"http://x/","tag":"p","selector":"p.blurb"}',
].join('\n');

test('recapture: v2 shim maps flat rows onto the replay entry shape', () => {
  const entry = toReplayEntry({ selector: '#cta', role: 'button', accessibleName: 'Buy', id: 'cta' });
  assert.strictEqual(entry.selectors.css, '#cta');
  assert.strictEqual(entry.element.role, 'button');
  assert.strictEqual(entry.element.accessibleName, 'Buy');
  // Legacy v3 entries pass through untouched.
  const legacy = { selectors: { css: '.x' }, element: {} };
  assert.strictEqual(toReplayEntry(legacy), legacy);
});

test('recapture: targets only commented selectors by default; --all widens', () => {
  const parsed = parseBundleJsonl(BUNDLE_JSONL);
  assert.strictEqual(parsed.manifest.bundleId, 'abcdef0123456789');
  assert.deepStrictEqual(selectTargets(parsed).map((r) => r.uid), ['u-hit']);
  assert.deepStrictEqual(selectTargets(parsed, { all: true }).map((r) => r.uid), ['u-hit', 'u-quiet']);
});

test('recapture: append-only runs write manifest + ledger rows deterministically', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pg-recap-'));
  try {
    const parsed = parseBundleJsonl(BUNDLE_JSONL);
    // In-memory adapter: only the css strategy hits, no screenshot method —
    // locating remains the primary signal.
    const adapter = {
      findByCss: async (sel) => (sel === '#cta' ? {} : null),
      findByXPath: async () => null,
      findByRole: async () => null,
    };
    const runOpts = { url: 'http://x/', runId: 'r1', ts: '2026-07-11T01:00:00.000Z', workspaceDir: dir, sourceBundle: 'b.jsonl' };
    const s1 = await recapture(adapter, parsed, { ...runOpts, outDir: join(dir, 'recaptures', 'r1') });
    assert.strictEqual(s1.located, 1);
    assert.strictEqual(s1.total, 1);
    const manifest = readFileSync(join(dir, 'recaptures', 'r1', 'recapture-manifest.jsonl'), 'utf-8');
    const rows = manifest.trim().split('\n').map((l) => JSON.parse(l));
    assert.strictEqual(rows[0].type, 'recapture-manifest');
    assert.strictEqual(rows[0].bundleId, 'abcdef0123456789');
    assert.deepStrictEqual(rows[1].feedbackUids, ['f-1']);
    assert.strictEqual(rows[1].originalScreenshot, 'screenshots/cta.png');
    // Second run under a NEW id appends to the ledger — never rewrites.
    await recapture(adapter, parsed, { ...runOpts, runId: 'r2', outDir: join(dir, 'recaptures', 'r2') });
    const ledger = readFileSync(join(dir, 'work-manifest.jsonl'), 'utf-8').trim().split('\n').map((l) => JSON.parse(l));
    assert.deepStrictEqual(ledger.map((r) => r.runId), ['r1', 'r2'], 'ledger must accrete run rows');
    // Determinism: identical run inputs → identical manifest bytes.
    const again = mkdtempSync(join(tmpdir(), 'pg-recap2-'));
    try {
      await recapture(adapter, parsed, { ...runOpts, outDir: join(again, 'r1'), workspaceDir: null });
      assert.strictEqual(readFileSync(join(again, 'r1', 'recapture-manifest.jsonl'), 'utf-8'), manifest);
    } finally {
      rmSync(again, { recursive: true, force: true });
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
