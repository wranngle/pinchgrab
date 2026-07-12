// Produce a clean, store-ready ZIP of the built extension.
//
// Implements docs/BROWSER-EXTENSION-DEPLOYMENT.md §6. The store ZIP must have
// manifest.json at its ROOT (not nested in a folder), and must NOT ship any
// dev-only files. We therefore:
//
//   1. Run a production (minified) build into extension/.
//   2. Stage a copy of extension/ to a temp dir.
//   3. Strip from the staged copy:
//        - README.txt           (leaks the WSL \\wsl.localhost dev path)
//        - templates/local.*    (per-user brand overrides — never ship)
//        - *.map                (stray source maps, if any)
//   4. Zip the CONTENTS of the staged dir to dist/pinchgrab-<version>.zip,
//      reading <version> from src/manifest.json.
//
// Run with: bun run package   (or  bun run scripts/package-extension.ts)

import {existsSync, mkdirSync, readFileSync, rmSync, readdirSync, statSync} from 'node:fs';
import {resolve, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');
const extensionDir = resolve(root, 'extension');
const srcManifest = resolve(root, 'src', 'manifest.json');
const distDir = resolve(root, 'dist');

// Files/globs to strip from the staged copy before zipping.
const STRIP_EXACT = new Set(['README.txt']);
const STRIP_TEMPLATE_PREFIX = 'local.'; // templates/local.*
const STRIP_SUFFIX = ['.map'];

const log = (msg: string): void => { console.log(msg); };

// ─── 1. Production build ────────────────────────────────────────────────────
log('▸ Building extension (minified, NODE_ENV=production)…');
const build = Bun.spawnSync(['bun', 'run', 'scripts/build-extension.ts', '--minify'], {
  cwd: root,
  env: {...process.env, NODE_ENV: 'production'},
  stdout: 'inherit',
  stderr: 'inherit',
});
if (build.exitCode !== 0) {
  console.error('Build failed — aborting package.');
  process.exit(build.exitCode ?? 1);
}
if (!existsSync(extensionDir)) {
  console.error(`Build did not produce ${extensionDir} — aborting.`);
  process.exit(1);
}

// ─── 2. Read version from src/manifest.json ─────────────────────────────────
const manifest = JSON.parse(readFileSync(srcManifest, 'utf-8')) as {version?: string};
const version = manifest.version;
if (!version) {
  console.error(`No "version" in ${srcManifest} — aborting.`);
  process.exit(1);
}

// ─── 3. Stage a copy and strip dev-only files ───────────────────────────────
const stageDir = resolve(root, '.pkg-stage');
rmSync(stageDir, {recursive: true, force: true});
mkdirSync(stageDir, {recursive: true});

const included: string[] = [];
const excluded: string[] = [];

const shouldStrip = (relPath: string): boolean => {
  const parts = relPath.split('/');
  const name = parts[parts.length - 1] ?? '';
  if (STRIP_EXACT.has(relPath)) return true;
  if (STRIP_SUFFIX.some(s => name.endsWith(s))) return true;
  // templates/local.* — per-user overrides
  if (parts[0] === 'templates' && name.startsWith(STRIP_TEMPLATE_PREFIX)) return true;
  return false;
};

// Recursively copy extensionDir → stageDir, honoring the strip list.
const copyTree = (absSrc: string): void => {
  for (const entry of readdirSync(absSrc)) {
    const absChild = join(absSrc, entry);
    const rel = relative(extensionDir, absChild).split('\\').join('/');
    const st = statSync(absChild);
    if (st.isDirectory()) {
      copyTree(absChild);
      continue;
    }
    if (shouldStrip(rel)) {
      excluded.push(rel);
      continue;
    }
    const dest = join(stageDir, rel);
    mkdirSync(resolve(dest, '..'), {recursive: true});
    Bun.write(dest, Bun.file(absChild));
    included.push(rel);
  }
};
copyTree(extensionDir);

// The vendored skills must ship in the store ZIP — exports read them at
// runtime via chrome.runtime.getURL('skills/…'). A missing index means the
// build regressed (or sync:skills was never run); fail loudly rather than
// shipping a package that silently exports skill-less bundles.
if (!included.includes('skills/skills-index.json')) {
  console.error('skills/skills-index.json missing from the staged package — run `bun run sync:skills` and rebuild.');
  process.exit(1);
}

// ─── 4. Zip the CONTENTS of the staged dir (manifest.json at the root) ───────
mkdirSync(distDir, {recursive: true});
const zipPath = resolve(distDir, `pinchgrab-${version}.zip`);
rmSync(zipPath, {force: true});

const haveBinary = (bin: string): boolean =>
  Bun.spawnSync(['sh', '-c', `command -v ${bin}`]).exitCode === 0;

if (haveBinary('zip')) {
  // `zip -r -X <zip> .` from inside the stage dir puts files at the zip root.
  const zip = Bun.spawnSync(['zip', '-r', '-q', '-X', zipPath, '.'], {
    cwd: stageDir,
    stdout: 'inherit',
    stderr: 'inherit',
  });
  if (zip.exitCode !== 0) {
    console.error('zip failed.');
    process.exit(zip.exitCode ?? 1);
  }
} else if (haveBinary('python3')) {
  // Fallback: build the ZIP with Python's stdlib zipfile (no `zip` binary, no
  // npm dependency). Walks the stage dir and stores each file at the zip root
  // with forward-slash arcnames, deflate-compressed — a valid store ZIP.
  const py = [
    'import os,sys,zipfile',
    'stage,out=sys.argv[1],sys.argv[2]',
    'z=zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED)',
    'for r,_,fs in os.walk(stage):',
    '    for f in sorted(fs):',
    '        p=os.path.join(r,f)',
    '        z.write(p,os.path.relpath(p,stage).replace(os.sep,"/"))',
    'z.close()',
  ].join('\n');
  const zip = Bun.spawnSync(['python3', '-c', py, stageDir, zipPath], {
    stdout: 'inherit',
    stderr: 'inherit',
  });
  if (zip.exitCode !== 0) {
    console.error('python3 zipfile fallback failed.');
    process.exit(zip.exitCode ?? 1);
  }
} else {
  console.error('No `zip` or `python3` available to create the archive.');
  process.exit(1);
}

rmSync(stageDir, {recursive: true, force: true});

// ─── Report ─────────────────────────────────────────────────────────────────
included.sort();
excluded.sort();
log('');
log(`Included (${included.length}):`);
for (const f of included) log(`  + ${f}`);
log(`Excluded (${excluded.length}):`);
if (excluded.length === 0) log('  (none — no dev-only files were present)');
for (const f of excluded) log(`  - ${f}`);
log('');
log(`✓ ${relative(root, zipPath)}  (manifest.json at ZIP root, version ${version})`);
