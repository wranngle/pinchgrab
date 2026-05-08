# Selector Capture Mode

A zero-config browser utility for UI review notes.

It captures one JSONL object per Alt+Click and places it directly into a scratchpad in-page.

## Why this is useful

You asked for "just enough to identify the exact component and styling context fast."  
The capture line is JSON, one object per newline (`.jsonl`), with:

- URL + viewport + route
- CSS/XPath/JS path + compact selectors
- data attributes (`data-testid`, `data-test`, `data-cy`, `data-qa`) + `id` + `class`
- full `outerHTML` snippet
- DOM breadcrumb to disambiguate repeated sections
- React/Vue best-effort component + source file/line metadata
- computed style summary + custom properties + box/pseudo style info
- pseudo-state flags (`:hover`, `:focus`, `:disabled`, etc.)
- event-handler hints
- accessibility signals (role/name/aria data + optional native snapshot if available)

Every new capture is appended with a leading newline. So you can paste directly without pressing Enter first.

## Install (recommended: extension)

```powershell
npm run build:extension
```

In Edge/Chrome:

1. Open `edge://extensions` or `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Pick this folder:
   `C:\Users\root\Documents\dev\visual_copy_design\extension`

You can also install from scripts with browser launch:

```powershell
npm run install:extension -- -Open
```

## Optional bookmarklet install

```powershell
npm run build:bookmarklet
# optional launch into browser
npm run install:bookmarklet -- -Open
```

## Workflow

1. Open prototype page.
2. Alt+Click element.
3. Scratchpad panel appears with one JSONL line.
4. Write your feedback right after the `"feedback":` field on that line.
5. Alt+Click next element and continue.
6. Click **Copy all** when done.

## JSONL schema (v3)

```
{
  "schema": "selector-capture-entry",
  "version": 3,
  "sequence": 1,
  "capturedAt": "2026-05-07T..."
}
```

Top-level sections:

- `page`: URL/route/viewport/scroll/lang/readyState + URL parts.
- `selectors`: `compact`, `css`, `xpath`, `jsPath`, `domPath`, `siblingIndex`, `nodeIndex`, `id`, `classes`, `dataIds`.
- `componentRoot`: nearest semantic/component root (`id`, `role`, `data-*`, selector + source hints).
- `component`: best-effort React/Vue component metadata.
- `element`: element attributes + `dataset` + `aria` + `accessibility` + `relation` + `bounds` + `outerHTML`.
- `styles`: `computed` + `computedTail` + `pseudoStyles` + `customProperties` + `matchedRules`.
- `events`: inline handler attrs, assigned properties, and best-effort devtools listeners.
- `states`: pseudo-state booleans (`hover`, `focus`, `disabled`, ...).
- `domBreadcrumb`: ancestor chain.
- `feedback`: free-text field you edit directly.

## Local test + check

```powershell
npm run build:extension
npm run build:bookmarklet
node --check src/selector-capture-mode.js
```

```powershell
node scripts/build-extension.mjs
```

> If you want browser-level regression coverage, run a tiny Playwright smoke script that:
> - opens `http://127.0.0.1:4175/`
> - Alt+Clicks two known elements
> - asserts top-level required fields.


## Files

- `src/selector-capture-mode.js` (source logic)
- `extension/` (generated extension artifact)
- `dist/bookmarklet-data.js` (generated bookmarklet)
- `dist/selector-capture-mode.url.txt` (copy-paste URL)
