# Chrome Web Store submission checklist

Everything up to the operator-only wall is done. This is the exact remaining
path, plus the README edit to apply the moment a listing URL exists. Full
background: [BROWSER-EXTENSION-DEPLOYMENT.md](BROWSER-EXTENSION-DEPLOYMENT.md).

## v1.2.0 re-submission notes (Send-to-Agent release)

- **Permissions delta:** install-time permissions are UNCHANGED. One addition
  under `optional_permissions`: `downloads.ui`, requested at runtime only when
  the user enables *Quiet saves* (suppresses Chrome's download bubble during
  PinchGrab's own writes). Optional permissions do not trigger install-time
  warnings or the disabled-on-update prompt.
- **Package size:** the ZIP grows from ~157 KB to roughly ~600 KB because the
  vendored design skills now ship under `extension/skills/` (Apache-2.0
  impeccable reference guides + CC BY-SA 4.0 perception-first-design; see
  `THIRD-PARTY-NOTICES.md`). All inert text/data — the two `.py` files inside
  `perception-first-design/scripts/` are DATA bundled into exports, never
  loaded or executed by the extension (no remote code, CSP unchanged).
- **Behavior notes for the reviewer form:** the export button is now "Send to
  Agent" (writes the same local files + copies a text prompt to the
  clipboard); content-script injection remains strictly on-demand
  (toolbar-click / panel re-attach / refresh of an already-attached tab via
  `chrome.storage.session` tracking — still no `host_permissions`).

## Already done (nothing to redo here)

- Manifest hardened: no persistent `host_permissions`, no always-on
  `content_scripts`, no `downloads.ui`/`downloads.shelf`. Current permission
  set: `sidePanel, storage, activeTab, tabs, scripting, contextMenus, downloads`.
- Icons exist at all four required sizes: `src/icons/icon{16,32,48,128}.png`
  (the deployment doc's "ships no icons" note is stale — ignore it).
- Store assets regenerated and visually verified, screenshot #1's crop-bleed
  defect (PGRB-001 finding #1) fixed: `store-assets/{screenshot-1..5,promo,marquee}*.png`.
- Manifest short description (117 chars, under the 132-char cap, plain
  language already): *"Click any element on a page to capture it with a
  comment, then export the whole UI critique for your AI coding agent."*
- Privacy policy hosted and verified live and rendering correctly (not raw
  markdown) at **`https://wranngle.github.io/pinchgrab/PRIVACY.html`**
  (GitHub Pages enabled on this repo, source `main` / `/docs`; `docs/PRIVACY.md`
  got minimal Jekyll front matter so it renders as a normal page rather than
  plaintext).
- Submission ZIP built and verified (`manifest.json` at ZIP root, no dev/test
  junk, valid JS in all three bundles): `dist/pinchgrab-1.1.2.zip`. Rebuild
  anytime with `bun run package` (see PR body for the exact recipe).

## Remaining operator-only steps

1. **Register the CWS developer account + pay the $5 one-time fee.**
   <https://chrome.google.com/webstore/devconsole> — needs a Google account
   and a card. If you want a verified publisher/domain badge, start this
   early; verification can add a day.

2. **Create a new item, upload the ZIP.**
   Upload `dist/pinchgrab-1.1.2.zip` (rebuild first with `bun run package` if
   any code has changed since this checklist was written — the version in
   the filename must match `src/manifest.json`, and store versions can never
   be re-uploaded, only incremented).

3. **Store listing tab** — asset-to-slot mapping:

   | Field | Value |
   |---|---|
   | Store icon (128×128) | `src/icons/icon128.png` |
   | Screenshots (up to 5) | `store-assets/screenshot-1-1280x800.png` … `screenshot-5-1280x800.png`, in that numeric order (the order is a deliberate story: capture → describe → hand off → scale → customize) |
   | Small promo tile (440×280) | `store-assets/promo-440x280.png` |
   | Marquee promo tile (1400×560) | `store-assets/marquee-1400x560.png` |
   | Short summary (≤132 chars) | `Click any element on a page to capture it with a comment, then export the whole UI critique for your AI coding agent.` (117 chars — already plain language, paste as-is) |
   | Category | Developer Tools (recommended — change anytime post-publish, low stakes) |
   | Language | English |

   Do **not** upload `store-assets/src-panel-1280x800.png` — it's explicitly a
   source asset embedded in the marquee, not a listing image.

4. **Privacy practices tab** — pre-written, paste directly:

   - **Single purpose:** "PinchGrab lets you Alt+Click any element on a
     webpage to capture its DOM structure and a screenshot, attach a
     plain-English comment, and export the bundle so an AI coding agent can
     act on the feedback."
   - **Permission justifications** (one per permission, all already trimmed
     to the minimum in the manifest):
     - `sidePanel` — Core UI surface; the whole product is the side panel.
     - `storage` — Persists captured selectors, notes, and settings locally
       on the user's device.
     - `activeTab` — Acts only on the tab the user explicitly invokes
       PinchGrab on.
     - `tabs` — Targets `captureVisibleTab` at the correct tab/window;
       not used for browsing history or persistent tracking.
     - `scripting` — Injects the capture/outline logic into the active tab
       on demand, only when the user invokes PinchGrab.
     - `contextMenus` — Adds the right-click entry points that trigger
       capture.
     - `downloads` — Writes the user's own exported JSONL bundle and
       screenshots to their local Downloads folder; user-initiated export of
       their own data, never uploaded anywhere.
   - **Data collection disclosure:** check **website content** (PinchGrab
     reads DOM/text/screenshots of pages the user explicitly acts on). Leave
     other categories unchecked — PinchGrab doesn't collect PII, financial,
     health, location, or authentication data as such; it captures whatever
     is on the page the user chooses to act on, and ships it nowhere.
   - **Three Limited-Use certifications:** all three are safely checkable as
     true — PinchGrab doesn't sell/transfer user data, doesn't use data
     outside the single purpose above, and doesn't use data for
     creditworthiness or lending. (The only outbound network call at all is
     a read-only, no-data-sent GitHub star-count fetch — see `docs/PRIVACY.md`.)
   - **Privacy policy URL:** `https://wranngle.github.io/pinchgrab/PRIVACY.html`

5. **Distribution tab.** Pick visibility — this is a judgment call, not
   pre-decidable: **Public** (searchable, anyone can install) vs.
   **Unlisted** (installable only via direct link) vs. **Private**
   (restricted to a Google Workspace group). The deployment doc's
   recommendation is Public given PinchGrab is meant for public reach; switch
   to Unlisted first if you want a quiet soft-launch before announcing it.

6. **Submit for review.** Expect same-day-to-a-few-days for most MV3 items;
   PinchGrab's `scripting`/`tabs`/`downloads` + screenshot capture makes
   manual review plausible, so budget up to a few weeks in the worst case. If
   it clears 3 weeks with no decision, contact developer support.

7. **(Later, optional) Mirror to Edge Add-ons.** Free account at
   <https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account>,
   same ZIP, same assets, same privacy URL. Do this only after the Chrome
   listing clears, per the deployment doc's ordering.

## README diff to apply the moment the listing URL exists

Not applied yet — there is no listing, so the README's current "Load
unpacked" instructions are the honest, accurate install path today. The
moment step 6 above produces a live `chromewebstore.google.com/detail/<id>`
URL, apply this diff (promotes the store install to primary, demotes
"Load unpacked" to a developer-only path):

```diff
 [![CI](https://github.com/wranngle/pinchgrab/actions/workflows/ci.yml/badge.svg)](https://github.com/wranngle/pinchgrab/actions/workflows/ci.yml) [![License](https://img.shields.io/github/license/wranngle/pinchgrab?color=A371F7)](LICENSE) ![Status](https://img.shields.io/badge/status-active-brightgreen.svg)
+[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/<EXTENSION_ID>?label=Chrome%20Web%20Store&color=A371F7)](https://chromewebstore.google.com/detail/<EXTENSION_ID>)

 > [!NOTE]
 > Active personal project. Used in my own workflow. Issues triaged on a personal-time cadence.

-## Quick start
+## Install
+
+**[Add PinchGrab from the Chrome Web Store](https://chromewebstore.google.com/detail/<EXTENSION_ID>)**
+— works in Chrome, Edge, Brave, and other Chromium browsers.
+
+## Developer install

 ```bash
 git clone https://github.com/wranngle/pinchgrab && cd pinchgrab
 bun install
 bun run build
 ```
```

`<EXTENSION_ID>` is assigned by the CWS dashboard the moment a draft item is
created (step 2) — fill it in from the dashboard URL or the listing's public
page, in both the badge and the two links above.
