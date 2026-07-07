# Publishing PinchGrab as a Real Browser Extension

A practical, current (verified May 2026) guide to taking PinchGrab from
"Load unpacked" to a published, installable extension. Written against this
repo's actual Manifest V3 setup (`src/manifest.json` → built to `extension/`).

> If you've never shipped an extension before, read the
> [First publish — step by step](#7-first-publish--step-by-step) section last;
> everything above it is the context you'll need to fill in the dashboard forms.

---

## 1. Your publishing options

PinchGrab is a **Manifest V3 (MV3) Chromium** extension. That gives you four
realistic distribution paths:

| Channel | Cost | Audience | Effort for PinchGrab |
|---|---|---|---|
| **Chrome Web Store (CWS)** | **$5 one-time** dev fee | Chrome + most Chromium browsers (Brave, Arc, Opera, Vivaldi can install from CWS) | Primary target. Needs assets + privacy disclosures. |
| **Microsoft Edge Add-ons** | **Free** | Edge users | Easy second store — same ZIP, free account. |
| **Firefox (AMO)** | **Free** | Firefox users | Extra work — MV3 differs, and some Chrome-only APIs PinchGrab uses don't exist. See [§5](#5-firefox-amo--worth-it). |
| **Self-host / unlisted** | Free (CWS "unlisted" still needs the $5 account) | Anyone you give the link to | Good for private/beta distribution without public listing. |

**Recommendation for PinchGrab:** publish to the **Chrome Web Store first**
(largest reach, and PinchGrab is built for Chromium), then mirror the same build
to **Edge Add-ons** (free, trivial). Treat Firefox as a later, optional port.

A note on "self-hosting": for Chromium, you cannot just host a `.crx` and have
users one-click install it anymore — Chrome blocks side-loading of off-store
extensions for normal users. The realistic "private" path is a CWS **unlisted**
or **private** listing (visible only via direct link or to a Google Workspace
group). Enterprise force-install via policy is a separate, IT-managed route.

---

## 2. Chrome Web Store: the full path

### 2.1 Developer account + the one-time fee

- Register at the **Developer Dashboard**: <https://chrome.google.com/webstore/devconsole>
- You need a Google account, must accept the developer agreement, and pay a
  **one-time $5 registration fee** (card required). This is the only fee Google
  charges to publish.
- Official: <https://developer.chrome.com/docs/webstore/register>
- For a product like PinchGrab you may be prompted to verify your identity and
  set a **publisher display name** (and, if you want, verify a domain so the
  homepage shows as verified). Do this early — verification can add a day.

### 2.2 The dashboard & creating a listing

From the dashboard you create a **new item**, upload the package ZIP, and then
fill out tabs for **Store listing**, **Privacy practices**, and
**Distribution**. You can save drafts and only submit when everything passes the
form validation.

### 2.3 The package: a ZIP of the built extension

You upload a **ZIP of the extension directory** — the folder that contains
`manifest.json` at its root (not a folder containing the folder). For PinchGrab
that's the `extension/` output of `bun run build`. See [§6](#6-packaging-the-upload-zip)
for the exact command and what to strip out.

### 2.4 Required listing assets (verified pixel sizes)

Per the official "supply images" guidance
(<https://developer.chrome.com/docs/webstore/images>):

| Asset | Size | Required? | Notes |
|---|---|---|---|
| **Store icon** | **128×128 PNG** | Required | Visible art should be ~96×96 with ~16px transparent padding per side. Must read on light *and* dark backgrounds. |
| **Screenshots** | **1280×800** (or 640×400) PNG/JPEG | **≥1 required**, up to 5 | Square corners, full-bleed, no padding. |
| **Small promo tile** | **440×280** | Optional but recommended | Listings without it rank below those with it; needed to be eligible for featuring. |
| **Marquee promo tile** | **1400×560** | Optional | For featured placement. |

Plus text fields: an **item name**, a **short summary** (≤132 chars), a longer
**detailed description**, a **category**, and a **language**.

> PinchGrab ships **no icons at all today** (see [§4](#4-pre-submission-checklist-specific-to-this-repo)).
> You must create the manifest icons *and* the 128×128 store icon before you can submit.

### 2.5 Privacy practices, permissions justification & data disclosure

This is the tab most first-time submitters underestimate, and for PinchGrab it
matters a lot because it **captures page content and screenshots** (see
[§4b](#4b-privacy-reality-pinchgrab-reads-page-content--takes-screenshots)).

On the **Privacy practices** tab
(<https://developer.chrome.com/docs/webstore/cws-dashboard-privacy>) you must:

1. **Single purpose** — one clear sentence describing what the extension does.
2. **Permission justifications** — a free-text justification for **each**
   permission and for `host_permissions`. Reviewers reject extensions whose
   permissions exceed their stated purpose. (PinchGrab requests several powerful
   permissions — pre-write these; see the table in §4.)
3. **Data collection disclosure** — checkboxes for the categories of user data
   you collect/transmit (personally identifiable info, web history, user
   content, etc.).
4. **Three certifications** you must affirmatively check, derived from the
   **Limited Use** policy
   (<https://developer.chrome.com/docs/webstore/program-policies/limited-use>):
   - You do **not** sell or transfer user data to third parties outside approved
     use cases;
   - You do **not** use or transfer user data for purposes unrelated to your
     item's single purpose;
   - You do **not** use or transfer user data to determine creditworthiness or
     for lending.
5. **Privacy policy URL** — **mandatory** when you collect user data (PinchGrab
   does, in the technical sense — it processes page content). The URL must be
   live and must not contradict your code or your checkbox disclosures.

### 2.6 Review process & timeline

Official: <https://developer.chrome.com/docs/webstore/review-process>

- Simple MV3 extensions with narrow permissions can clear **automated review in
  under an hour**; most are reviewed within a **few days**, and ~90% within
  **3 days**. Broad permissions and complex code push you toward **manual review
  and the slower end (up to a few weeks)**.
- PinchGrab uses `scripting`, `tabs`, and `downloads`, and handles website
  content/screenshots when the user activates it, so plan for manual review even
  though the current manifest avoids persistent `<all_urls>` host access.
- If you're past **three weeks** with no decision, contact developer support.

### 2.7 What commonly causes rejection

From the official policies and the field reports (verify against
<https://developer.chrome.com/docs/webstore/review-process>):

- **Code obfuscation** — zero tolerance. (PinchGrab's prod build is *minified*,
  which is allowed; **obfuscation is not**. Don't confuse the two. If a reviewer
  flags the minified bundle, ship a readable/source-mapped build — see §4.)
- **Remotely hosted code** — MV3 forbids loading executable code from a remote
  URL. PinchGrab bundles everything locally, so you're fine *as long as* you
  don't fetch-and-eval anything.
- **Excessive / unjustified permissions** — the single most common avoidable
  rejection. Justify every permission; drop ones you don't need.
- **Missing/contradictory privacy policy** — e.g. claiming "we collect nothing"
  while the code reads page DOM and screenshots.
- **Incomplete or misleading listing** — blank/vague description, missing icon,
  broken screenshots.
- **Non-functional on review** — reviewer can't make it work (e.g. needs a
  setup step or external service they can't reach). PinchGrab works standalone,
  but make sure the side panel does something visible on a plain web page
  without any external dependency.

---

## 3. Microsoft Edge Add-ons

Edge is the easiest "second store" because it consumes the **same MV3 ZIP** and
costs nothing.

- **Account:** free. Register in **Partner Center** with a Microsoft account.
  Official: <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account>
- **Submit:** upload the same `extension/` ZIP, fill the listing (it reuses the
  same asset types/sizes as Chrome — your CWS icon and screenshots work as-is),
  and provide the same privacy-policy URL.
  <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension>
- **Review:** standard certification can take **up to 7 business days**; Edge
  added **expedited reviews** in 2025 for high-quality, frequently-updated,
  failure-free submissions.
  <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/add-ons-curation>
- **Policies:** <https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies>

No code changes needed versus the Chrome build — PinchGrab's manifest is plain
MV3 and Edge supports the same `sidePanel`, `scripting`, and `downloads` APIs.

---

## 4. Pre-submission checklist (specific to THIS repo)

Read against `src/manifest.json` (the source of truth; `extension/manifest.json`
is a build copy). Current manifest:

```jsonc
{
  "manifest_version": 3,
  "name": "PinchGrab",
  "description": "Alt+Click DOM elements → structured selector + plain-text comments → JSONL hand-off for LLMs.",
  "version": "1.1.0",
  "homepage_url": "https://github.com/wranngle/pinchgrab",
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "permissions": ["sidePanel","storage","activeTab","tabs","scripting",
                  "contextMenus","downloads"],
  "background": { "service_worker": "background.js" },
  "side_panel": { "default_path": "sidepanel.html" },
  "action": {
    "default_title": "PinchGrab — open side panel",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  }
}
```

### 4.1 Remaining blockers before submission

- **[BLOCKER] Public privacy-policy URL.** `docs/PRIVACY.md` exists and matches
  the current local-only data model, but the store needs a live URL. Publish it
  through GitHub Pages or your site and paste that public URL into Chrome and
  Edge.
- **[BLOCKER] Store developer account / listing form.** The package and assets
  exist locally, but no Chrome Web Store item is created from this repo. Create
  the listing, upload the ZIP, and complete the privacy/distribution tabs.
- **[RECHECK] Store asset quality.** Required image dimensions are present:
  `src/icons/icon128.png`, `store-assets/screenshot-1280x800.png`, and
  `store-assets/promo-440x280.png`. Review them visually in the dashboard before
  submission.

### 4.2 Permission hardening — justify or trim each one

Pre-write these justifications for the Privacy tab; trim what you can to speed
review:

| Permission | Keep? | Justification / action |
|---|---|---|
| `sidePanel` | Keep | Core UI surface; the whole product is the side panel. |
| `storage` | Keep | Persists captured selectors/notes and settings locally. |
| `activeTab` | Keep | Acts on the tab the user invoked PinchGrab on. |
| `tabs` | **Review** | Justify the need to read tab/window metadata (used for capture + `captureVisibleTab` targeting). If only the active tab is needed, see if `activeTab` alone suffices. |
| `scripting` | Keep | Injects the capture/outline logic on demand. |
| `contextMenus` | Keep | Right-click entry points. |
| `downloads` | Keep | Exports JSONL + saves screenshots to `Downloads/.pinchgrab/`. Justify as "user-initiated export of their captured data." |

Already removed: `downloads.ui`, `downloads.shelf`, persistent
`host_permissions`, and always-on `content_scripts`. Capture is now attached to
the active tab on toolbar click via `activeTab` + `scripting`.

### 4.3 Listing / metadata hardening

- **`description`** uses arrows (`→`) and the term "JSONL hand-off for LLMs."
  It's accurate but jargon-heavy for a store audience. Keep a clean
  ≤132-char store summary in plain language; you can keep the technical phrasing
  in the long description. (The manifest `description` becomes the default short
  summary.)
- **`name`** "PinchGrab" is fine and distinctive.
- **`homepage_url`** points to the GitHub repo — good; consider verifying the
  domain for a "verified" badge.
- **`version`** is `1.1.0` — semver is fine. Note: stores require the version to
  **increase on every update**; you can't re-upload the same version number.

### 4.4 Remove dev-only / WSL bits before packaging

- **`extension/README.txt`** is generated by `scripts/build-extension.ts` and
  contains a **WSL UNC dev path** (`\\wsl.localhost\...`) and "Load unpacked"
  instructions. **Exclude it from the ZIP** — it's dev-only and leaks your local
  path. (Easiest: delete it from the staged copy before zipping, or stop writing
  it in production builds.)
- **`extension/templates/`** ships `DESIGN.template.md` and
  `PinchGrab.SKILL.template.md` and *optionally* `local.DESIGN.md` /
  `local.SKILL.md`. Confirm no `local.*` override contains anything private
  before you publish (those are gitignored per-user files). The generic
  templates are fine to ship; the build only copies `local.*` if you created
  them.
- **Source maps:** non-minified builds inline source maps. Ship the **minified**
  build (`NODE_ENV=production bun run build` or `bun run build --minify`) so the
  bundle is clean — but remember **minified ≠ obfuscated**; minification is
  allowed, obfuscation is not. If a reviewer asks, be ready to point at this
  public repo as the unminified source.
- **`extension/templates/` + `.md` files** are legitimate runtime resources
  (loaded via `chrome.runtime.getURL`) — keep them; just audit `local.*`.

### 4.5 Things that are already fine

- MV3 service worker (`background.js`) — correct, no MV2 background page.
- No remotely-hosted code — everything is bundled locally by Bun.
- `manifest_version: 3` — required; you're already on it.

---

## 4b. Privacy reality: PinchGrab reads page content & takes screenshots

Be honest here — this is the single most important disclosure, and getting it
wrong (or vague) is a top rejection cause.

What the code actually does (grounded in `src/background.ts` and
`src/content-script.ts`):

- **Reads DOM** of pages the user explicitly activates PinchGrab on (selectors,
  element structure, text) — the core capture feature, injected on demand via
  `activeTab` + `scripting`.
- **Captures screenshots** via `chrome.tabs.captureVisibleTab` (visible-tab and
  full-page scroll-and-stitch). See `src/background.ts` (multiple
  `captureVisibleTab` call sites and the page-shot stitch loop).
- **Writes captured data + screenshots to the user's disk** under
  `Downloads/.pinchgrab/<workspace>/...` via the `downloads` permission.

For the store this means:

- On the **data disclosure** checkboxes you should mark that the extension
  handles **website content** (and, depending on what pages users capture,
  potentially **personal/sensitive content** that happens to be on those pages).
- Your **privacy policy must state plainly**: *"PinchGrab captures DOM structure
  and screenshots of pages you explicitly act on. This data is stored **locally**
  on your device (in your Downloads folder) and is **not transmitted to any
  server** by the extension."* — assuming that's true today (it is: there's no
  network upload of captures in the extension itself). If you ever add cloud
  sync/telemetry, this policy and the disclosures must change *before* you ship
  that version.
- The honest framing — **"local-only, user-initiated, no server"** — is exactly
  what makes a broad-permission capture tool *approvable*. Lead with it.

---

## 5. Firefox (AMO) — worth it?

Optional, and more work than Edge. Key differences to know before you commit:

- **MV3 on Firefox** supports `background.service_worker` from **Firefox 109+**,
  but historically Firefox preferred an **`scripts` background** array; you may
  need a browser-specific manifest key (`browser_specific_settings`) and to
  test the service worker path. (<https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/>)
- **Host permissions** are granted differently (install-time from Firefox 127+).
- **API gaps that affect PinchGrab specifically:**
  - `sidePanel` is a Chrome API; Firefox uses **`sidebar_action`** instead — a
    different manifest key and API. The side panel would need a port.
  - `downloads.ui` / `downloads.shelf` are **Chrome-only** sub-permissions; they
    are not in the current Chrome manifest and should stay out of any Firefox
    variant.
- **AMO** is free to publish (<https://addons.mozilla.org>) and reviews can
  include source-code review for obfuscated/minified bundles — you'd likely
  submit the unminified source alongside.

**Verdict:** ship Chrome + Edge first. Treat Firefox as a separate porting
project (mainly: side panel → sidebar, and drop the `downloads.*` UI perms).

---

## 6. Packaging the upload ZIP

The store ZIP must have **`manifest.json` at the ZIP root**. PinchGrab's build
emits exactly that layout into `extension/`, so:

```bash
# 1. Produce a clean, minified production build
NODE_ENV=production bun run build      # writes ./extension/

# 2. Stage a copy and strip dev-only files
rm -rf /tmp/pinchgrab-pkg && cp -r extension /tmp/pinchgrab-pkg
rm -f  /tmp/pinchgrab-pkg/README.txt                 # WSL/dev path — never ship
rm -f  /tmp/pinchgrab-pkg/templates/local.*          # per-user overrides, if any
# (optionally) remove any *.map files if a non-minified build left them
find /tmp/pinchgrab-pkg -name '*.map' -delete

# 3. Zip the CONTENTS of the folder (manifest.json at the root of the zip)
( cd /tmp/pinchgrab-pkg && zip -r -X ../pinchgrab-1.1.0.zip . )
#  -> /tmp/pinchgrab-1.1.0.zip   (upload this)
```

**Include:** `manifest.json`, `background.js`, `content-script.js`,
`sidepanel.html`, `sidepanel.css`, `sidepanel.js`, `templates/*.template.md`,
and the new `icons/*.png`.

**Exclude:** `README.txt`, any `templates/local.*`, source maps, and of course
everything outside `extension/` (no `node_modules`, no `src/`, no `.git`).

> Sanity-check the ZIP by unzipping it to a temp dir and doing **Load unpacked**
> on *that* dir in Chrome — if it loads and works, it's the same bytes the
> store will run.

---

## 7. First publish — step by step

A realistic ordering with rough timelines:

1. **Review the existing assets (≈ 30 min).**
   - Confirm `src/icons/icon16/32/48/128.png`,
     `store-assets/screenshot-1280x800.png`, and
     `store-assets/promo-440x280.png` look good in the dashboard.
2. **Host the existing privacy policy (≈ 1 hour).**
   - Publish `docs/PRIVACY.md` via GitHub Pages or your site, note the public URL.
3. **Review the hardened manifest (≈ 30 min).**
   - Confirm `src/manifest.json` still has no persistent `host_permissions`, no
     always-on `content_scripts`, and no `downloads.ui` / `downloads.shelf`.
   - Pre-write a one-line justification for every remaining permission.
4. **Register the Chrome dev account & pay $5 (≈ 15 min + possible verification
   delay of up to ~1 day).** <https://chrome.google.com/webstore/devconsole>
5. **Build, package, self-test the ZIP (≈ 30 min).** Follow §6; Load-unpacked the
   unzipped package to confirm parity.
6. **Create the CWS listing & submit (≈ 1 hour to fill forms).**
   - Upload ZIP → fill Store listing (name, summary, description, category,
     screenshots, icon, promo) → fill Privacy practices (single purpose, per-
     permission justifications, data disclosures, 3 Limited-Use certifications,
     privacy-policy URL) → submit.
7. **Wait for review (hours → up to a few weeks; expect days for PinchGrab given
   page-content capture + screenshots).** Watch email/dashboard for the
   decision; if rejected, the notice names the policy — fix and resubmit (most
   resubmissions succeed).
8. **Mirror to Edge Add-ons (≈ 30 min + up to 7 business days review).** Reuse
   the same ZIP, assets, and privacy URL in Partner Center.
9. **(Later, optional) Port to Firefox/AMO** per §5.

**End state:** a public CWS listing (and Edge listing) where anyone can click
"Add to Chrome," plus a maintainable build→package flow you can repeat for each
version bump (remember to increment `version` every upload).

---

## Unverified / to confirm at submission time

- Exact **character limits** for the store summary/description and the precise
  current wording of the three Limited-Use certification checkboxes are shown in
  the dashboard at submission; the policy text is cited above but Google adjusts
  the dashboard copy periodically. Confirm against the live form.
- Whether Google routes PinchGrab to **manual review** is determined at
  submission by its permission set and data disclosures; `scripting`, `tabs`,
  `downloads`, screenshots, and website-content capture make manual review
  plausible, but the exact track isn't guaranteed.
- Edge's **expedited review** eligibility is automatic and not something you can
  request; the up-to-7-business-days figure is the documented standard.

## Source links (official, verified May 2026)

- Register / fees: <https://developer.chrome.com/docs/webstore/register>
- Image asset specs: <https://developer.chrome.com/docs/webstore/images>
- Privacy tab: <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy>
- Limited Use policy: <https://developer.chrome.com/docs/webstore/program-policies/limited-use>
- Review process: <https://developer.chrome.com/docs/webstore/review-process>
- Edge dev account: <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account>
- Edge publish: <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension>
- Edge curation/review: <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/add-ons-curation>
- Edge policies: <https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies>
- Firefox MV3 migration: <https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/>
