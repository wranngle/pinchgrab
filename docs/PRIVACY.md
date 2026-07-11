---
title: PinchGrab Privacy Policy
---

# PinchGrab Privacy Policy

**Last updated: 2026-05-30**

PinchGrab is a browser extension for capturing the structure of web pages —
DOM selectors, element text, and screenshots — and handing that capture off to
you (or an LLM) as structured files. This policy explains, in plain language,
what PinchGrab does with your data.

The short version: **PinchGrab keeps your captures on your own machine. It does
not upload the pages or screenshots you capture to any server.**

## What PinchGrab captures

When you explicitly act on a page — holding Alt to outline an element,
Alt+Clicking to capture it, taking a screenshot, or exporting a workspace —
PinchGrab reads:

- **DOM structure and selectors** of the elements you act on (tag names,
  attributes, CSS selectors, and surrounding structure).
- **Text content** of those elements, as it appears on the page.
- **Screenshots** of the visible tab (and, for full-page shots, a scroll-and-
  stitch of the page), captured via the browser's `tabs.captureVisibleTab` API.

PinchGrab only captures pages **you choose to act on**. It does not run a
background crawler, and it does not silently scrape pages you merely visit.

## Where your data goes

Everything PinchGrab captures is written **locally to your own device**, in
your Downloads folder, under:

```
Downloads/.pinchgrab/<workspace>/...
```

This is done through the browser's `downloads` permission — the same mechanism
any "save file" action uses. Captured selectors, notes, and settings are also
kept in the extension's local browser storage on your device.

**PinchGrab does not transmit your captures — DOM, text, or screenshots — to
any server, ours or anyone else's.** There is no cloud sync, no account, no
upload, and no third-party capture pipeline.

## No analytics, no telemetry

PinchGrab includes **no analytics and no telemetry**. It does not track your
browsing, your usage, or which pages you capture, and it does not send any
usage data anywhere.

## The one network request PinchGrab makes

For full transparency: the side panel makes a single, optional, **read-only**
network request to GitHub's public API
(`https://api.github.com/repos/wranngle/pinchgrab`) to display the project's
public star count. This request:

- sends **none** of your captured data, page content, or personal information;
- only reads a public number (the repository's star count) and caches it
  locally for an hour;
- fails silently if it can't reach GitHub, with no effect on capture.

This is the only outbound network call PinchGrab makes. It exists solely to
show a star count in the UI and can be safely blocked.

## Permissions PinchGrab uses, and why

| Permission | Why it's needed |
|---|---|
| `sidePanel` | The side panel is PinchGrab's main interface. |
| `storage` | Saves your captured selectors, notes, and settings locally. |
| `activeTab` / `tabs` | Acts on the tab you invoked PinchGrab on and targets screenshots correctly. |
| `scripting` | Injects the outline/capture logic into the page when you use it. |
| `contextMenus` | Adds PinchGrab's right-click entry points. |
| `downloads` | Saves your exports and screenshots to your Downloads folder. |

PinchGrab does **not** request persistent `host_permissions` such as
`<all_urls>`. Instead, when you click the toolbar button on a tab, the browser's
`activeTab` grant lets PinchGrab inject its capture script into that tab for
that user-initiated session.

## How to delete your data

Because everything stays on your device, you are always in control:

- **Delete your captures and screenshots:** remove the `.pinchgrab` folder (and
  any files inside it) from your Downloads folder.
- **Clear saved selectors, notes, and settings:** remove the extension, or
  clear its site data, from your browser's extension settings
  (`chrome://extensions` or `edge://extensions`).

Once those files are removed, no copy of your captures remains — there is
nothing stored on any server to delete.

## Changes to this policy

If a future version of PinchGrab ever changes what it captures or where that
data goes — for example, adding cloud sync or any form of telemetry — this
policy and the extension's store data disclosures will be updated **before**
that version ships.

## Contact

Questions about this policy or PinchGrab's data handling:
**hello@wranngle.com** — or open an issue at
<https://github.com/wranngle/pinchgrab/issues>.
