Rewrote `README.md` for pinchgrab. Renamed from "Selector Capture Mode" to the actual repo name, replaced `npm`/PowerShell calls with `bun`, dropped the "zero-config" tagline and the historical "you asked for…" framing, and added the required structure: tagline + body blockquote, three-badge row, `[!NOTE]` status callout (verbatim), Quick start, What it does, Usage, JSONL schema, Files, License.

What the user needs to know:
- The hero `<picture>` block was skipped because `demo/hero-light.webp` and `demo/hero-dark.webp` don't exist (only `demo/cassette.tape`). If you want a hero, drop both webp files into `demo/` and re-stamp.
- The CI badge points at `.github/workflows/ci.yml`. If that workflow file doesn't exist yet, the badge will render broken until you add the workflow or rename the file.
