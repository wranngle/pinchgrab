# Contributing to pinchgrab

Thanks for poking around. pinchgrab is a small browser utility for capturing UI review notes as JSONL, and contributions are welcome — bug reports, fixes, schema ideas, or just stories about how you're using it.

## Local setup

```bash
git clone https://github.com/wranngle/pinchgrab.git
cd pinchgrab
bun install
```

Build the extension and bookmarklet artifacts:

```bash
bun run build:extension
bun run build:bookmarklet
```

Load the unpacked `extension/` folder via `edge://extensions` or `chrome://extensions` with Developer mode on.

## Running checks

```bash
node --check src/selector-capture-mode.js
bun test
```

If you add behavior, add a test next to the change. One test file per concern, named `<thing>.test.ts` (or `.js`) colocated with the source. Test names should describe the behavior (`"alt+click appends jsonl line with leading newline"`), not the function. Skip syntax-only checks, presence-of-string assertions, and help-text smoke tests — they cost more than they catch.

## Code style

- Match the existing file. No new formatters, no sweeping rewrites alongside a feature change.
- Prefer early returns, destructuring, and template literals over branching prose.
- Comments earn their bytes by explaining a non-obvious *why*. Delete the ones that paraphrase the next line.
- Keep the JSONL schema additive — bump `version` when fields change shape, never silently.

## Filing a PR

1. Open an issue first (even a one-liner) so the change has a paper trail. Use the bug, feature, or research form.
2. Branch, commit with a conventional summary (`feat: capture shadow-root selectors`), keep the diff focused.
3. Reference the issue in the PR body with `Closes #N`.
4. Note what you tested — which page, which browser, what got captured.

Small PRs land faster than large ones. If you're unsure about scope, open the issue and ask before writing the code.

## Questions vs bugs

- **Bug or concrete feature request** → open an issue.
- **"How do I…" or "what if pinchgrab also…"** → start a Discussion. Easier to think out loud there without the issue tracker pressure.
- **Security concern** → email cody@wranngle.com instead of filing publicly.

That's it. Be kind, be specific, and assume the other person is doing their best.
