import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "src/selector-capture-mode.js");
const outPath = resolve(root, "dist/bookmarklet-data.js");
const txtPath = resolve(root, "dist/selector-capture-mode.url.txt");

const source = readFileSync(sourcePath, "utf8").trim();
const bookmarklet = "javascript:" + encodeURIComponent(source);

mkdirSync(resolve(root, "dist"), { recursive: true });
writeFileSync(
  outPath,
  `window.SELECTOR_CAPTURE_BOOKMARKLET=${JSON.stringify(bookmarklet)};\n`,
);
writeFileSync(txtPath, bookmarklet + "\n");

console.log(`Wrote ${outPath}`);
console.log(`Wrote ${txtPath}`);
