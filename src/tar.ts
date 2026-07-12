// USTAR-format tar encoder. Each entry is a 512-byte header followed by
// content bytes padded up to the next 512-byte boundary. The archive ends
// with two zero-filled 512-byte blocks. ~80 lines, no dependencies.
//
// We pick tar (rather than zip) because zstd is the wire format we want to
// pair it with and tar.zst is the standard combo (zip is its own
// compression container). Paths longer than 100 chars use the standard
// ustar prefix field (155 bytes at offset 345): the path is split at a
// slash into prefix(≤155)/name(≤100). Only unsplittable paths throw —
// GNU/PAX long-name extensions are deliberately not implemented.

const enc = new TextEncoder();

const writeOctal = (buf: Uint8Array, offset: number, value: number, length: number): void => {
  // tar fields are zero-padded null-terminated octal strings.
  let s = value.toString(8);
  s = s.padStart(length - 1, '0');
  for (let i = 0; i < length - 1; i++) buf[offset + i] = s.charCodeAt(i);
  buf[offset + length - 1] = 0;
};

const writeAscii = (buf: Uint8Array, offset: number, str: string, length: number): void => {
  const bytes = enc.encode(str);
  const len = Math.min(bytes.length, length);
  for (let i = 0; i < len; i++) buf[offset + i] = bytes[i]!;
};

const headerChecksum = (header: Uint8Array): number => {
  // The checksum field (8 bytes at offset 148) is treated as ASCII spaces
  // during computation, then the actual checksum is written into it.
  let sum = 0;
  for (let i = 0; i < 512; i++) {
    if (i >= 148 && i < 156) sum += 0x20;
    else sum += header[i] ?? 0;
  }
  return sum;
};

export type TarEntry = {
  name: string;
  data: Uint8Array | string;
  mtime?: number; // unix epoch seconds; defaults to now
};

// ustar name split: paths ≤100 chars go straight into the name field;
// longer paths split at the rightmost slash that leaves prefix ≤155 and
// tail ≤100. The reader reassembles `prefix + '/' + name`.
const splitTarName = (full: string): {name: string; prefix: string} => {
  if (full.length <= 100) return {name: full, prefix: ''};
  let cut = -1;
  for (let i = full.indexOf('/'); i !== -1; i = full.indexOf('/', i + 1)) {
    if (i <= 155 && full.length - i - 1 <= 100) cut = i;
  }
  if (cut === -1) {
    throw new Error(`tar: path not splittable into ustar prefix(155)/name(100): ${full}`);
  }
  return {prefix: full.slice(0, cut), name: full.slice(cut + 1)};
};

export const buildTar = (entries: TarEntry[]): Uint8Array => {
  const blocks: Uint8Array[] = [];
  const nowSec = Math.floor(Date.now() / 1000);
  for (const entry of entries) {
    const data = typeof entry.data === 'string' ? enc.encode(entry.data) : entry.data;
    const {name, prefix} = splitTarName(entry.name);
    const header = new Uint8Array(512);
    writeAscii(header, 0, name, 100);
    writeOctal(header, 100, 0o644, 8);                         // mode
    writeOctal(header, 108, 0, 8);                             // uid
    writeOctal(header, 116, 0, 8);                             // gid
    writeOctal(header, 124, data.length, 12);                  // size
    writeOctal(header, 136, entry.mtime ?? nowSec, 12);        // mtime
    for (let i = 148; i < 156; i++) header[i] = 0x20;          // checksum placeholder
    header[156] = 0x30;                                        // typeflag '0' = regular file
    writeAscii(header, 257, 'ustar', 6);                       // magic
    writeAscii(header, 263, '00', 2);                          // version
    if (prefix) writeAscii(header, 345, prefix, 155);          // ustar prefix
    // uname/gname/devmajor/devminor left zero.

    const checksum = headerChecksum(header);
    writeOctal(header, 148, checksum, 8);

    blocks.push(header);
    blocks.push(data);
    const pad = (512 - (data.length % 512)) % 512;
    if (pad) blocks.push(new Uint8Array(pad));
  }
  // Trailer: two consecutive 512-byte zero blocks.
  blocks.push(new Uint8Array(1024));

  let total = 0;
  for (const b of blocks) total += b.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const b of blocks) { out.set(b, offset); offset += b.length; }
  return out;
};

// ─── Zstd raw-block frame writer ───────────────────────────────────────────
//
// CompressionStream('zstd') isn't shipped in current Chromium (verified via
// runtime probe), so we write a valid zstd frame containing one or more
// raw (uncompressed) blocks. The output is structurally a real `.tar.zst`
// file: `zstd -d` accepts it, 7-Zip accepts it, libzstd accepts it. It
// just doesn't actually compress — for our payload, which is mostly PNG
// (already compressed) plus a few KB of JSONL/Markdown, the loss vs. real
// DEFLATE is single-digit percent.
//
// Frame layout (per RFC 8878 + Zstandard format spec):
//   magic_number       4 bytes  0x28 0xB5 0x2F 0xFD (LE: 0xFD2FB528)
//   FHD                1 byte   FCS_size=2 (4-byte FCS), Single_Segment=1
//   FCS                4 bytes  uncompressed payload size (u32 LE)
//   blocks             N blocks each: 3-byte header + payload
//
// Block header (3 bytes LE):
//   bit 0       Last_Block flag
//   bits 1..2   Block_Type (00 = Raw, 01 = RLE, 10 = Compressed, 11 = Reserved)
//   bits 3..23  Block_Size (max 128 KiB for raw / RLE)
//
// We chunk into 128 KiB raw blocks to respect the per-block size limit.

const ZSTD_RAW_BLOCK_MAX = 128 * 1024;

export const wrapZstd = (data: Uint8Array): Uint8Array => {
  const blocks: Uint8Array[] = [];
  let pos = 0;
  while (pos < data.length || data.length === 0) {
    const remaining = data.length - pos;
    const blockSize = Math.min(remaining, ZSTD_RAW_BLOCK_MAX);
    const isLast = pos + blockSize >= data.length ? 1 : 0;
    const headerInt = isLast | (0 << 1) | (blockSize << 3); // type=raw=0
    const blockHeader = new Uint8Array([
      headerInt & 0xff,
      (headerInt >>> 8) & 0xff,
      (headerInt >>> 16) & 0xff,
    ]);
    blocks.push(blockHeader);
    if (blockSize > 0) blocks.push(data.subarray(pos, pos + blockSize));
    pos += blockSize;
    if (data.length === 0) break;
  }
  const fcs = data.length;
  const fhd = 0b1010_0000; // FCS_size=10 (4 bytes) | Single_Segment=1
  const head = new Uint8Array([
    0x28, 0xb5, 0x2f, 0xfd,                              // magic
    fhd,                                                 // FHD
    fcs & 0xff, (fcs >>> 8) & 0xff, (fcs >>> 16) & 0xff, (fcs >>> 24) & 0xff,
  ]);
  let total = head.length;
  for (const b of blocks) total += b.length;
  const out = new Uint8Array(total);
  let off = 0;
  out.set(head, off); off += head.length;
  for (const b of blocks) { out.set(b, off); off += b.length; }
  return out;
};

// Companion decoder for our own writer — used by tests. Accepts any zstd
// frame written by `wrapZstd` (single Raw_Block stream, 4-byte FCS,
// single-segment, no checksum, no dict). Throws on anything else so tests
// fail loudly rather than silently mis-parse.
export const unwrapZstd = (frame: Uint8Array): Uint8Array => {
  if (frame.length < 9) throw new Error('zstd: frame too short');
  if (frame[0] !== 0x28 || frame[1] !== 0xb5 || frame[2] !== 0x2f || frame[3] !== 0xfd) {
    throw new Error('zstd: bad magic number');
  }
  const fhd = frame[4]!;
  const fcsSizeFlag = (fhd >>> 6) & 0b11;
  const singleSegment = ((fhd >>> 5) & 1) === 1;
  const checksum = ((fhd >>> 2) & 1) === 1;
  const dictId = fhd & 0b11;
  if (!singleSegment) throw new Error('zstd: only Single_Segment frames supported');
  if (checksum) throw new Error('zstd: content checksum not supported');
  if (dictId) throw new Error('zstd: dictionaries not supported');
  let pos = 5;
  let fcs = 0;
  if (fcsSizeFlag === 0b00) { fcs = frame[pos]!; pos += 1; }
  else if (fcsSizeFlag === 0b01) { fcs = frame[pos]! | (frame[pos + 1]! << 8); fcs += 256; pos += 2; }
  else if (fcsSizeFlag === 0b10) { fcs = frame[pos]! | (frame[pos + 1]! << 8) | (frame[pos + 2]! << 16) | (frame[pos + 3]! * 0x1000000); pos += 4; }
  else throw new Error('zstd: 8-byte FCS unsupported');
  const out = new Uint8Array(fcs);
  let outPos = 0;
  for (;;) {
    if (pos + 3 > frame.length) throw new Error('zstd: truncated block header');
    const headerInt = frame[pos]! | (frame[pos + 1]! << 8) | (frame[pos + 2]! << 16);
    pos += 3;
    const isLast = (headerInt & 1) === 1;
    const blockType = (headerInt >>> 1) & 0b11;
    const blockSize = (headerInt >>> 3) & 0x1f_ff_ff;
    if (blockType !== 0) throw new Error(`zstd: only Raw_Block (0) supported, got ${blockType}`);
    if (pos + blockSize > frame.length) throw new Error('zstd: truncated block payload');
    out.set(frame.subarray(pos, pos + blockSize), outPos);
    outPos += blockSize;
    pos += blockSize;
    if (isLast) break;
  }
  if (outPos !== fcs) throw new Error(`zstd: FCS mismatch (got ${outPos}, expected ${fcs})`);
  return out;
};

// ─── Tar listing decoder (test-only) ───────────────────────────────────────
// Walks a tar byte buffer, returning {name, data} for each entry. Stops at
// the trailer (two zero blocks). Only reads the fields PinchGrab writes.

export type ParsedTarEntry = {name: string; data: Uint8Array; size: number};

const dec = new TextDecoder();

const readNullStr = (buf: Uint8Array, offset: number, length: number): string => {
  let end = offset + length;
  for (let i = offset; i < offset + length; i++) {
    if (buf[i] === 0) { end = i; break; }
  }
  return dec.decode(buf.subarray(offset, end));
};

const readOctal = (buf: Uint8Array, offset: number, length: number): number => {
  const s = readNullStr(buf, offset, length).trim();
  return s ? parseInt(s, 8) : 0;
};

export const parseTar = (buf: Uint8Array): ParsedTarEntry[] => {
  const entries: ParsedTarEntry[] = [];
  let pos = 0;
  while (pos + 512 <= buf.length) {
    const header = buf.subarray(pos, pos + 512);
    let allZero = true;
    for (let i = 0; i < 512; i++) { if (header[i] !== 0) { allZero = false; break; } }
    if (allZero) break; // trailer
    const shortName = readNullStr(header, 0, 100);
    const prefix = readNullStr(header, 345, 155);
    const name = prefix ? `${prefix}/${shortName}` : shortName;
    const size = readOctal(header, 124, 12);
    pos += 512;
    if (size > 0) {
      entries.push({name, size, data: buf.subarray(pos, pos + size)});
      pos += size;
      const pad = (512 - (size % 512)) % 512;
      pos += pad;
    }
  }
  return entries;
};
