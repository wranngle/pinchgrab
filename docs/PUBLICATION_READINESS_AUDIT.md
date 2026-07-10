# PinchGrab Public GitHub + Chrome Publish Readiness Audit

Generated: 2026-06-13

Scope: current worktree at `/home/wranngle/projects/pinchgrab`, public repo
`wranngle/pinchgrab`, and local Chrome package `dist/pinchgrab-1.1.0.zip`.

This audit is paired with `docs/PUBLICATION_FILE_INVENTORY.tsv`, which contains
one row per tracked or non-ignored untracked file in the current worktree,
including size, MIME type, public GitHub assessment, and Chrome publish
assessment.

## Executive Status

| Surface | Status | Evidence |
|---|---|---|
| Public GitHub repo | **Not current** | Local `main` is 41 commits ahead of `origin/main`; the public repo does not yet contain the latest store-readiness work. |
| Public GitHub safety | **Mostly ready, with disclosure/noise warnings** | `gitleaks detect --redact --config .gitleaks.toml --source .` found no leaks; `trufflehog filesystem --only-verified --json .` found zero verified/unverified secrets in its scan. |
| Chrome ZIP mechanics | **Ready locally** | `bun run package` produced `dist/pinchgrab-1.1.0.zip` with `manifest.json` at root and 12 included files. |
| Chrome policy posture | **Close, but not submit-ready** | Manifest is MV3 and least-privilege compared with prior docs, but the store still needs a live privacy-policy URL, a dashboard listing, final permission text, and visual review of store assets. |
| Local verification | **Mostly green** | `bun run typecheck`, local `xo@0.60.0`, `bun tests/extension.spec.ts`, and `gitleaks` pass. `bun run lint` uses a broken/global XO path in this checkout; direct local XO passes. |

## Inventory Summary

- Files inventoried: **406** tracked or non-ignored untracked files.
- Tracked bytes: about **6.1 MB**.
- Top-level tracked file counts:
  - `lib/`: 215 files
  - `scripts/`: 41 files
  - `tests/`: 33 files
  - `src/`: 30 files
  - `.agents/`: 25 files
  - `.github/`: 13 files
  - `extension/`: 13 files
  - `docs/`: 9 files after this audit report/inventory
  - `store-assets/`: 2 files
- Largest tracked files:
  - `extension/sidepanel.js`
  - `extension/content-script.js`
  - `.dotfiles.sh`
  - `store-assets/screenshot-5-1280x800.png`
  - `src/sidepanel.ts`
  - `DESIGN.md`
  - `.agents/skills/ui/SKILL.md`
  - `src/templates/PinchGrab.SKILL.template.md`
  - `extension/templates/PinchGrab.SKILL.template.md`

Ignored/local-only publication-relevant files observed:

- `dist/` contains generated Chrome ZIPs and is ignored.
- `node_modules/` is ignored.
- `src/templates/local.*` and `extension/templates/local.*` are ignored and
  stripped from the Chrome ZIP.
- `.artifacts/`, `.claude/`, `old/`, `temp/`, `logs/`, and `tests/output/` are
  ignored.

## Public GitHub Assessment

### Pass Signals

- Repository is public, MIT licensed, default branch `main`, issues enabled.
- Security and community files exist: `LICENSE`, `SECURITY.md`,
  `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, issue templates, PR template, and
  Codeowners.
- Workflows exist for CI, gitleaks, actionlint/zizmor/security checks,
  Dependabot, issue triage, and PR issue-link enforcement.
- No non-ignored untracked files were present before this audit's generated
  docs.
- No scanner-confirmed secrets were found by local `gitleaks` and `trufflehog`
  runs.

### Public GitHub Blockers / Warnings

1. **Public repo is behind local work.**
   - Evidence: local `main...origin/main [ahead 41]`.
   - Impact: the actual public GitHub repo is not ready to represent Chrome
     readiness until these commits, plus this audit/fix work, are pushed.

2. **Dirty worktree remains.**
   - Pre-existing dirty files include `.dotfiles.sh`,
     `.agents/skills/ui/SKILL.md`, `src/templates/PinchGrab.SKILL.template.md`,
     and generated extension template copies.
   - This audit intentionally adds/fixes publication files; do not publish a
     release tag from a dirty tree.

3. **`lib/` is a large vendored/local orchestration surface.**
   - 215 tracked files are under `lib/`, mostly not part of the Chrome extension
     product.
   - Scanners did not find secrets, but the public repo sends mixed product
     signals and increases review/audit burden.

4. **`.dotfiles.sh` is large personal bootstrap code.**
   - It is public-safe by scanner evidence, but it contains personal workflow
     automation and is not core extension source.
   - Keep only if this repo intentionally dogfoods dotfiles; otherwise move to a
     separate repo/submodule.

5. **`extension/README.txt` contains a local WSL load path.**
   - It is tracked for load-unpacked convenience but excluded from Chrome ZIP by
     `scripts/package-extension.ts`.
   - Public GitHub acceptability is a product decision; Chrome ZIP must continue
     excluding it.

6. **Contact email inconsistency.**
   - `docs/PRIVACY.md` uses `hello@wranngle.com`.
   - `SECURITY.md`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md` use
     `cody@wranngle.com`.
   - Not a blocker, but align before a public launch if support ownership should
     look deliberate.

## Chrome Publish Assessment

Chrome criteria checked against official docs:

- Permissions must be declared in the manifest and justified in the dashboard:
  <https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions>
- Privacy tab requires single purpose and accurate permission/data disclosure:
  <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy>
- Store listing requires images such as a 128x128 icon, screenshot, and small
  promo tile:
  <https://developer.chrome.com/docs/webstore/images>
- MV3 forbids remotely hosted executable code in extension logic:
  <https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code>

### Pass Signals

- `src/manifest.json` and ZIP `manifest.json` use `"manifest_version": 3`.
- Current manifest has:
  - no persistent `host_permissions`
  - no always-on `content_scripts`
  - no `downloads.ui`
  - no `downloads.shelf`
  - permissions limited to `sidePanel`, `storage`, `activeTab`, `tabs`,
    `scripting`, `contextMenus`, and `downloads`
- Icons exist at 16, 32, 48, and 128 px under `src/icons/` and
  `extension/icons/`.
- Store assets exist:
  - `store-assets/screenshot-1-1280x800.png`
  - `store-assets/promo-440x280.png`
- `scripts/package-extension.ts` builds a minified package, strips
  `README.txt`, strips `templates/local.*`, strips source maps, and writes
  `dist/pinchgrab-1.1.0.zip`.
- ZIP contents are exactly:
  - `manifest.json`
  - `background.js`
  - `content-script.js`
  - `sidepanel.html`
  - `sidepanel.css`
  - `sidepanel.js`
  - `icons/icon16.png`
  - `icons/icon32.png`
  - `icons/icon48.png`
  - `icons/icon128.png`
  - `templates/DESIGN.template.md`
  - `templates/PinchGrab.SKILL.template.md`
- Package scan found no `README.txt`, no `templates/local.*`, no source maps,
  no `node_modules`, no `src/`, and no `.git/`.
- Packaged/public skill template no longer contains literal CDN script examples
  for `unpkg` or `cdn.tailwindcss.com`.
- `bun tests/extension.spec.ts` passed after the permission-warning cleanup.

### Chrome Blockers / Warnings

1. **No live privacy-policy URL is proven.**
   - `docs/PRIVACY.md` exists and has been updated to match the current
     manifest.
   - The Chrome dashboard needs a public URL; this audit did not verify GitHub
     Pages or site hosting.

2. **No Chrome Web Store listing/dashboard state is proven.**
   - The ZIP exists locally, but no dashboard item, developer account, or
     submitted listing was verified.

3. **Manual review remains plausible.**
   - The extension captures DOM content and screenshots on user activation and
     uses `tabs`, `scripting`, and `downloads`.
   - The current manifest is materially better than the prior `<all_urls>`
     posture, but dashboard explanations must be precise.

4. **Only one required screenshot is present.**
   - Chrome allows one, but more screenshots would make review/listing quality
     stronger.

5. **`sidepanel.ts` makes one network request to GitHub's public API.**
   - `docs/PRIVACY.md` discloses this star-count request.
   - Keep it disabled or documented if the listing claims "no network activity";
     the safer claim is "no captured page data is transmitted."

## Changes Made During This Audit

- Removed stale `downloads.ui`/`downloads.shelf` calls from
  `src/background.ts`, eliminating runtime permission warnings.
- Updated `docs/PRIVACY.md` to remove stale `downloads.ui`,
  `downloads.shelf`, and `<all_urls>` claims.
- Updated `docs/BROWSER-EXTENSION-DEPLOYMENT.md` to reflect the current
  manifest, existing assets, existing privacy policy, and on-demand injection.
- Replaced CDN executable examples in `.agents/skills/ui/SKILL.md` and
  `src/templates/PinchGrab.SKILL.template.md` with local/bundled guidance;
  rebuilt `extension/templates/PinchGrab.SKILL.template.md`.
- Fixed `scripts/package-extension.ts` lint by using `Set.has`.
- Added `docs/PUBLICATION_FILE_INVENTORY.tsv`.

## Verification Commands Run

```bash
git status --short --branch
curl -fsSL https://api.github.com/repos/wranngle/pinchgrab
git ls-files -z | xargs -0 ...
gitleaks detect --redact --no-banner --config .gitleaks.toml --source . --exit-code 1
trufflehog filesystem --no-update --only-verified --json .
bun run typecheck
node node_modules/xo/cli.js
bun run package
unzip -Z1 dist/pinchgrab-1.1.0.zip
rg -n "unpkg|cdn\\.tailwindcss|<script src=\"https?://|https?://[^'\") ]+\\.(m?js)(['\")?# ])" /tmp/pinchgrab-zipcheck -S
bun run build
bun tests/extension.spec.ts
```

## Remaining Release Checklist

1. Push the 41 local commits plus this audit/fix work, or open a PR.
2. Publish `docs/PRIVACY.md` at a stable public URL.
3. Confirm the Chrome Web Store dashboard listing fields:
   - single purpose
   - permission justifications
   - data disclosure for website content/screenshots handled locally
   - no sale/transfer/unrelated-use certifications
4. Visually review `store-assets/*` and optionally add more screenshots.
5. Upload `dist/pinchgrab-1.1.0.zip`.
6. After upload, verify the dashboard accepts the package without remote-code or
   permission warnings.
