// Vendor third-party skill sources into third_party/ at pinned commits.
//
// PinchGrab bundles design skills into every export so a consuming agent can
// map user comments onto them (see skills-index.json + AGENT-PROTOCOL.md).
// This script is the ONLY sanctioned way to add or update that content:
// it resolves a ref to a commit SHA via the GitHub API, downloads the
// codeload tarball (no git dependency, no submodule), extracts just the
// configured include paths, and records provenance in UPSTREAM.lock —
// repo, ref, sha, per-file sha256 — so drift is detectable in CI
// (tests/bundled-skills.test.mjs) and updates are reviewable diffs.
//
// Usage:
//   bun run sync:skills                 # sync every source at its configured ref
//   bun run sync:skills -- --source impeccable --ref <branch|tag|sha>

import {mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, readdirSync, statSync, mkdtempSync, copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {resolve, join, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');
const thirdPartyDir = resolve(root, 'third_party');

type Include = {
  // Repo-relative path prefix to vendor ('' = whole tree). Exact files match too.
  prefix: string;
  // Leading path segment to strip when writing into third_party/<name>/.
  strip?: string;
};
type Source = {
  name: string;
  repo: string; // owner/name
  ref: string;
  license: string;
  trademark?: string;
  include: Include[];
};

const SOURCES: Source[] = [
  {
    // Only the reference guides — the impeccable plugin itself (agents/,
    // scripts/, SKILL.md orchestration) assumes its own harness and is not
    // wanted inside PinchGrab bundles.
    name: 'impeccable',
    repo: 'pbakaus/impeccable',
    ref: 'main',
    license: 'Apache-2.0',
    include: [
      {prefix: '.agents/skills/impeccable/reference/', strip: '.agents/skills/impeccable/'},
      {prefix: 'LICENSE'},
      {prefix: 'NOTICE.md'},
    ],
  },
  {
    // Whole tracked tree, verbatim (CC BY-SA 4.0 "Share"): the pfd skill
    // references its own corpus/framework/commands, and consuming agents
    // are told to run /perception-first-design:all against the intact repo.
    name: 'perception-first-design',
    repo: 'skovalik/perception-first-design',
    ref: 'main',
    license: 'CC-BY-SA-4.0',
    trademark: '"Perception-First Design" and "PFD" are trademarks of Stefan Kovalik (U.S. Serial No. 99686343); used for attribution only.',
    include: [{prefix: ''}],
  },
];

// One-line purpose for the skills index: frontmatter `description:` when
// present (folded `>-` blocks joined), else the first prose line.
const extractPurpose = (md: string): string => {
  const clip = (s: string): string => s.replace(/\s+/g, ' ').trim().slice(0, 140);
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(md);
  if (fm) {
    const lines = fm[1]!.split(/\r?\n/);
    const i = lines.findIndex((l) => /^description:/.test(l));
    if (i >= 0) {
      let out = lines[i]!.replace(/^description:\s*(>-?\s*)?/, '');
      for (let j = i + 1; j < lines.length && /^\s+\S/.test(lines[j]!); j++) out += ' ' + lines[j]!.trim();
      if (out.trim()) return clip(out);
    }
  }
  const body = fm ? md.slice(fm[0].length) : md;
  const first = body.split(/\r?\n/).find((l) => l.trim() && !l.trim().startsWith('#') && !l.trim().startsWith('<'));
  return clip(first ?? '');
};

const sha256 = (buf: Buffer): string => createHash('sha256').update(buf).digest('hex');

const walk = (dir: string): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
};

const ghJson = async (url: string): Promise<any> => {
  const res = await fetch(url, {headers: {'user-agent': 'pinchgrab-sync-bundled-skills', accept: 'application/vnd.github+json'}});
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
  return res.json();
};

type LockFile = {
  repo: string;
  ref: string;
  sha: string;
  fetchedAt: string;
  license: string;
  trademark?: string;
  include: string[];
  files: Array<{path: string; sha256: string; bytes: number; purpose?: string}>;
};

const syncSource = async (source: Source, refOverride?: string): Promise<void> => {
  const ref = refOverride ?? source.ref;
  console.log(`── ${source.name}: resolving ${source.repo}@${ref}`);
  const commit = await ghJson(`https://api.github.com/repos/${source.repo}/commits/${ref}`);
  const sha: string = commit.sha;
  console.log(`   pinned ${sha}`);

  const tarballUrl = `https://codeload.github.com/${source.repo}/tar.gz/${sha}`;
  const res = await fetch(tarballUrl, {headers: {'user-agent': 'pinchgrab-sync-bundled-skills'}});
  if (!res.ok) throw new Error(`codeload ${res.status} for ${tarballUrl}`);
  const tarball = Buffer.from(await res.arrayBuffer());

  const tmp = mkdtempSync(join(tmpdir(), `pg-sync-${source.name}-`));
  try {
    const tarPath = join(tmp, 'src.tar.gz');
    writeFileSync(tarPath, tarball);
    execFileSync('tar', ['-xzf', tarPath, '-C', tmp]);
    const extractedRoot = readdirSync(tmp).map((n) => join(tmp, n)).find((p) => statSync(p).isDirectory());
    if (!extractedRoot) throw new Error('tarball extracted to nothing');

    const destRoot = resolve(thirdPartyDir, source.name);
    // Content files are wiped and rewritten; the lock is written LAST so a
    // failed sync never leaves a lock that lies about the tree.
    rmSync(destRoot, {recursive: true, force: true});
    mkdirSync(destRoot, {recursive: true});

    const files: LockFile['files'] = [];
    for (const abs of walk(extractedRoot).sort()) {
      const rel = relative(extractedRoot, abs);
      const inc = source.include.find((i) => i.prefix === '' || rel === i.prefix || rel.startsWith(i.prefix));
      if (!inc) continue;
      const out = inc.strip && rel.startsWith(inc.strip) ? rel.slice(inc.strip.length) : rel;
      const dest = resolve(destRoot, out);
      mkdirSync(dirname(dest), {recursive: true});
      copyFileSync(abs, dest);
      const buf = readFileSync(dest);
      const row: LockFile['files'][number] = {path: out, sha256: sha256(buf), bytes: buf.length};
      if (out.endsWith('.md')) {
        const purpose = extractPurpose(buf.toString('utf-8'));
        if (purpose) row.purpose = purpose;
      }
      files.push(row);
    }
    if (!files.length) throw new Error(`no files matched include prefixes for ${source.name}`);

    const lock: LockFile = {
      repo: `https://github.com/${source.repo}`,
      ref,
      sha,
      fetchedAt: new Date().toISOString(),
      license: source.license,
      ...(source.trademark ? {trademark: source.trademark} : {}),
      include: source.include.map((i) => i.prefix || '(whole tree)'),
      files,
    };
    writeFileSync(resolve(destRoot, 'UPSTREAM.lock'), JSON.stringify(lock, null, 2) + '\n');
    const bytes = files.reduce((a, f) => a + f.bytes, 0);
    console.log(`   vendored ${files.length} files (${(bytes / 1024).toFixed(0)} KB) → third_party/${source.name}/`);
  } finally {
    rmSync(tmp, {recursive: true, force: true});
  }
};

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const only = flag('source');
const refOverride = flag('ref');
const targets = SOURCES.filter((s) => !only || s.name === only);
if (!targets.length) {
  console.error(`Unknown --source ${only}. Known: ${SOURCES.map((s) => s.name).join(', ')}`);
  process.exit(1);
}
if (!existsSync(thirdPartyDir)) mkdirSync(thirdPartyDir, {recursive: true});
for (const s of targets) await syncSource(s, only ? refOverride : undefined);
console.log('Done. Review the third_party/ diff + UPSTREAM.lock changes, then rebuild (bun run build).');
