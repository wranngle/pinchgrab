import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "..", "..");
const sourcePath = resolve(root, "src", "selector-capture-mode.js");
const distRoot = resolve(root, "extension");
const manifestPath = resolve(distRoot, "manifest.json");
const contentScriptPath = resolve(distRoot, "content-script.js");
const installHintsPath = resolve(distRoot, "README.txt");

mkdirSync(distRoot, { recursive: true });
copyFileSync(sourcePath, contentScriptPath);

const manifest = {
  manifest_version: 3,
  name: "Selector Capture Mode",
  description: "Capture selector + metadata notes with Alt+Click in JSONL.",
  version: "1.0.0",
  permissions: [],
  host_permissions: ["http://*/*", "https://*/*"],
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["content-script.js"],
      run_at: "document_idle",
    },
  ],
};

const installHints = [
  "Selector Capture Mode extension",
  "",
  "1. Open this folder in your file manager.",
  "2. Open edge://extensions or chrome://extensions.",
  "3. Enable Developer mode.",
  "4. Click Load unpacked and select:",
  `   ${distRoot}`,
  "5. Open a page and Alt+Click an element to open the capture panel.",
  "",
  "The panel is bootstrapped automatically on first Alt+Click.",
].join("\n");

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(installHintsPath, `${installHints}\n`);

console.log(`Wrote ${manifestPath}`);
console.log(`Wrote ${contentScriptPath}`);
console.log(`Wrote ${installHintsPath}`);
