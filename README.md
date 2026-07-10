# PinchGrab

Browser-side UI capture exports for review agents.

[![CI](https://github.com/wranngle/pinchgrab/actions/workflows/ci.yml/badge.svg)](https://github.com/wranngle/pinchgrab/actions/workflows/ci.yml)

> [!NOTE]
> PinchGrab is a local-first browser extension. It captures selected UI elements, comments, screenshots, page context, and export bundles for agent review workflows.

![Real PinchGrab capture on a demo page: holding Alt and clicking an element rings it and drops its selector into the docked side panel](docs/hero.webp)

## Quick Start

```powershell
bun install
bun run build
```

Load the generated extension:

1. Open `edge://extensions` or `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select the repo's `extension/` folder.
5. Pin PinchGrab, open a page, then hold `Alt` to inspect and `Alt+Click` to capture.

## What It Does

- Captures selector rows with URL, viewport, DOM context, component hints, accessibility signals, event hints, and sanitized HTML.
- Lets you add feedback directly beside captured selectors.
- Saves screenshots and full workspace exports under `Downloads/pinchgrab/<workspace>/...`.
- Exports JSONL, DuckDB recipes, screenshot indexes, README guidance, and `.tar.zst` workspace bundles.
- Includes replay/export utilities for Playwright, Puppeteer, plain-English recipes, visual diffs, network replay, and step annotations.

## Commands

```powershell
bun run build
bun run test
bun run test:fast
bun run devserver
```

Focused checks:

```powershell
bun run typecheck
bun run lint
bun run test:extension
bun run test:exports
bun run test:legacy
```

Legacy utility commands from the CLI/replay surface:

```powershell
bun run replay
bun run replay:multi
bun run export:playwright
bun run export:puppeteer
bun run export:english
bun run visual-diff
bun run network-capture
bun run annotator
```

## Export Shape

The extension emits newline-delimited JSON with a manifest row followed by page, selector, and feedback rows. Workspace archives add:

- `README.md`
- `repair-index.md`
- `<workspace>.jsonl`
- `screenshots.json`
- `duckdb.sql`
- `schema.json`
- screenshot PNGs when available
- bundled PinchGrab skill/design context

The older standalone capture schema lives at [docs/capture-schema.json](docs/capture-schema.json), with samples in [docs/capture-sample.jsonl](docs/capture-sample.jsonl).

## Project Layout

- `src/` TypeScript extension source.
- `extension/` generated unpacked browser extension.
- `tests/` Playwright, export, extension, framework-tour, and legacy CLI tests.
- `scripts/` build and repo automation.
- `.agents/` dogfooded agent skills and design context.
- `lib/` dotfiles-managed local orchestration libraries.

## License

See [LICENSE](LICENSE).
