#!/usr/bin/env node
// Quick extraction tool for PinchGrab .tar.zst exports. Uses fzstd via
// dynamic import (already a transitive dep of bun); falls back to a
// pure-JS streaming approach if not present.
//
// Usage: node scripts/extract-export.mjs <path.tar.zst> [outDir]

import fs from 'node:fs';
import path from 'node:path';

const inFile = process.argv[2];
const outDir = process.argv[3] || (inFile?.replace(/\.tar\.zst$/, '-extracted'));
if (!inFile || !fs.existsSync(inFile)) {
  console.error('usage: node scripts/extract-export.mjs <path.tar.zst> [outDir]');
  process.exit(1);
}
const data = new Uint8Array(fs.readFileSync(inFile));

// Try fzstd first.
let raw;
try {
  const mod = await import('fzstd');
  raw = mod.decompress(data);
} catch (_) {
  console.error('fzstd not available — install with: npm i -D fzstd');
  process.exit(1);
}

// Now tar-untar. Posix ustar format. Each entry is 512-byte header + body padded to 512.
fs.mkdirSync(outDir, {recursive: true});
let p = 0;
const dec = new TextDecoder();
const readNullStr = (off, len) => {
  let end = off + len;
  for (let i = off; i < off + len; i++) if (raw[i] === 0) { end = i; break; }
  return dec.decode(raw.subarray(off, end));
};
const entries = [];
while (p + 512 <= raw.length) {
  let allZero = true;
  for (let i = 0; i < 512; i++) if (raw[p + i] !== 0) { allZero = false; break; }
  if (allZero) break;
  const name = readNullStr(p, 100);
  const sizeStr = readNullStr(p + 124, 12).trim();
  const size = sizeStr ? parseInt(sizeStr, 8) : 0;
  p += 512;
  if (size > 0) {
    const body = raw.subarray(p, p + size);
    const outPath = path.join(outDir, name);
    fs.mkdirSync(path.dirname(outPath), {recursive: true});
    fs.writeFileSync(outPath, body);
    entries.push({name, size});
    p += size;
    const pad = (512 - (size % 512)) % 512;
    p += pad;
  }
}
console.log(`Extracted ${entries.length} files to ${outDir}`);
for (const e of entries) console.log(`  ${e.size.toString().padStart(10)} ${e.name}`);
