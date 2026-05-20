#!/usr/bin/env node
// Run multiple shell commands in parallel with buffered, labeled output.
//
// Usage (each arg = label=cmd_with_underscores_for_spaces):
//   node scripts/run-parallel.mjs typecheck=tsc_--noEmit lint=xo
//
// We use `=` (not `:`) because npm-script line tokenization on Windows
// re-splits arguments containing `:` from the package.json string. We
// use `_` for spaces inside the cmd so each job can be one shell-safe
// argv token across both POSIX and PowerShell. The script restores
// real spaces before invoking the shell.
//
// Each child's stdout/stderr is captured and printed AFTER all children
// finish, prefixed with the label, so failures stay legible even when
// commands write interleaved output. Exits 0 only if every child does.

import {spawn} from 'node:child_process';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('run-parallel: expected at least 2 commands, got', args.length);
  process.exit(2);
}

const jobs = args.map((spec) => {
  const i = spec.indexOf('=');
  if (i < 0) throw new Error(`bad spec, expected "label=cmd": ${spec}`);
  return {label: spec.slice(0, i), cmd: spec.slice(i + 1).replaceAll('_', ' ')};
});

const run = ({label, cmd}) => new Promise((resolve) => {
  const start = Date.now();
  // Cross-platform: use shell so npm-script syntax works on Windows + POSIX.
  const child = spawn(cmd, {shell: true});
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (d) => { stdout += d.toString(); });
  child.stderr.on('data', (d) => { stderr += d.toString(); });
  child.on('close', (code) => {
    resolve({label, code: code ?? 1, ms: Date.now() - start, stdout, stderr});
  });
  child.on('error', (err) => {
    resolve({label, code: 1, ms: Date.now() - start, stdout, stderr: stderr + '\n' + String(err)});
  });
});

const results = await Promise.all(jobs.map(run));
let failed = 0;
for (const r of results) {
  const status = r.code === 0 ? 'OK' : `FAIL (${r.code})`;
  const head = `── ${r.label} · ${status} · ${r.ms}ms ─────────────────────────────`;
  process.stdout.write(head.slice(0, 76) + '\n');
  if (r.stdout.trim()) process.stdout.write(r.stdout);
  if (r.stderr.trim()) process.stderr.write(r.stderr);
  if (r.code !== 0) failed++;
}
console.log(`\nrun-parallel: ${results.length - failed}/${results.length} passed (max ${Math.max(...results.map((r) => r.ms))}ms)`);
process.exit(failed > 0 ? 1 : 0);
