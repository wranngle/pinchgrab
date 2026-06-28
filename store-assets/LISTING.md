# PinchGrab — Store Submission Packet

Copy-paste fields for the Chrome Web Store and Edge Add-ons dashboards. Draft as
of 2026-05-31; adjust wording to taste. Sizes/labels match the CWS "Store
listing" and "Privacy practices" tabs.

---

## Store listing

**Item name**
```
PinchGrab
```

**Short summary** (≤132 chars — becomes the listing tagline)
```
Click any element on a page to capture it with a comment, then export the whole UI critique for your AI coding agent.
```
*(116 chars)*

**Category**
```
Developer Tools
```

**Language**
```
English (United States)
```

**Detailed description**
```
PinchGrab turns "this button is wrong" into something your AI coding agent can actually act on.

Click the PinchGrab icon on any page, then Alt+Click the elements you want to critique. Each capture grabs the element's selector, structure, text, and a screenshot — and you attach plain-language comments right next to it. When you're done, export the whole thing as a structured bundle (JSONL + screenshots + a README/AGENTS guide) that drops straight into Claude, Cursor, or any coding agent so it can find the exact element and make the fix.

Built for the loop between human design feedback and AI implementation:

• Alt+Click to capture an element — selector, outer HTML, text, and a screenshot.
• Alt+Shift+Click to group several elements into one capture.
• Type comments inline; they stay paired with the element they describe.
• Organize work by tab — each page you activate PinchGrab on is its own workspace.
• Export a clean handoff bundle (or copy a single capture as JSON) for your agent.
• Point your agent at the included DESIGN.md to keep fixes on-brand.

Privacy-first by design: PinchGrab only reads a page after you explicitly activate it by clicking the toolbar icon. Everything you capture stays on your device — saved to your Downloads folder. Nothing is sent to any server, and there is no analytics or tracking.
```

---

## Privacy practices tab

**Single purpose**
```
PinchGrab lets you annotate UI elements on a web page and export that feedback as a structured bundle for an AI coding agent to act on.
```

**Permission justifications** (one per permission — reviewers read these closely)

| Permission | Justification to paste |
|---|---|
| `activeTab` | Grants access to the current tab only when the user clicks the PinchGrab toolbar icon, so the extension can read the elements the user chooses to capture. This is the primary access model — there is no broad host access. |
| `scripting` | Injects the element-capture overlay into the current tab when the user activates PinchGrab by clicking the toolbar icon. |
| `sidePanel` | The entire user interface is a side panel that displays captured elements and comments and performs exports. |
| `storage` | Persists the user's captures, comments, workspaces, and settings locally in the browser. |
| `tabs` | Reads tab title/URL to label captures, organize each activated tab as its own workspace, and switch back to a tab the user captured on. |
| `downloads` | Saves the user's exported feedback bundle and element screenshots to their Downloads folder when they choose to export. |
| `contextMenus` | Adds a right-click "capture this element" entry point. |

> NOTE: there are **no `host_permissions`** — capture works via the `activeTab`
> grant from the toolbar click. Call this out; it is the strongest signal that
> PinchGrab does not have standing access to every page.

**Data collection disclosure** (checkboxes)
- Website content — **YES** (the extension reads DOM structure/text and takes screenshots of pages the user explicitly captures).
- Personally identifiable info, health, financial, authentication, location, web history, user activity — **NO** (none collected or transmitted).
- "Is this data sold/transferred to third parties?" — **NO**.
- "Is this data used/transferred for purposes unrelated to the item's single purpose?" — **NO**.
- "Is this data used to determine creditworthiness or for lending?" — **NO**.

**Three Limited-Use certifications** (all must be checked — all true for PinchGrab)
- ✅ I do not sell or transfer user data to third parties, outside of the approved use cases.
- ✅ I do not use or transfer user data for purposes unrelated to my item's single purpose.
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Privacy policy URL**
```
https://wranngle.com/privacy
```
⚠️ Before submitting, confirm that page actually describes PinchGrab's data
handling (see the ready-to-paste section below). A generic company policy that
doesn't mention the extension's capture/screenshot behavior is a common
rejection cause.

---

## Privacy section to add to https://wranngle.com/privacy

Paste this under a "PinchGrab Browser Extension" heading so the policy matches
what the code actually does (sourced from `docs/PRIVACY.md`):

```
PinchGrab Browser Extension

PinchGrab captures DOM structure and screenshots of web page elements that you
explicitly select. It only reads a page after you activate it by clicking the
PinchGrab toolbar icon on that page.

What it accesses: the structure, text, and a screenshot of the elements you
capture, plus the title and URL of tabs you activate it on (used to label and
organize your captures).

Where your data goes: everything you capture is stored locally on your device —
in your browser's local storage and, on export, in your Downloads folder under
"pinchgrab/". PinchGrab does not transmit your captures, comments, screenshots,
or browsing data to any server. There is no analytics or telemetry.

Deleting your data: remove the files under Downloads/pinchgrab/, and clear the
extension's data from your browser's extension settings.

Contact: hello@wranngle.com
```

---

## Assets checklist (in `store-assets/` and the build)
- ✅ Store icon 128×128 — `extension/icons/icon128.png`
- ✅ Screenshot 1280×800 — `store-assets/screenshot-1280x800.png`
- ✅ Small promo tile 440×280 — `store-assets/promo-440x280.png`
- ✅ Upload ZIP — `dist/pinchgrab-1.1.0.zip` (run `bun run package` to regenerate)
- ⬜ Marquee promo 1400×560 (optional, for featuring)

## Edge Add-ons
Reuse the same ZIP, icon, screenshots, description, and privacy URL. Edge
supports the same MV3 APIs PinchGrab uses; no code changes needed.
