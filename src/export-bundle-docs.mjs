// Bundle-level directional docs (item 14).
//
// Every PinchGrab workspace export should carry two short, generically-
// useful guide files so the AI agent that receives the bundle knows how to
// read it and how to apply the captured feedback without guessing:
//
//   README.md  — what the bundle IS and what each file/folder is for.
//   AGENTS.md  — directional guidance for ACTING on the feedback: where UI
//                source usually lives, that DESIGN.md is the brand canon,
//                to follow each capture's comments, and to verify by
//                running the app.
//
// These are intentionally machine-agnostic: no absolute paths, no host
// names, no per-user content. They describe the bundle's own structure and
// the generic loop an agent should follow. Project-specific brand/voice
// lives in the bundled DESIGN.md; project-specific triage method lives in
// the bundled SKILL.md — these two files only POINT at those.
//
// The panel already emits a richer, manifest-aware README via its own
// buildReadme(); `buildBundleReadmeMd()` here is the neutral standalone
// form for callers that want a self-contained default. `buildBundleAgentsMd()`
// is the new directional companion the panel adds to the tar.
//
// Exports:
//   buildBundleAgentsMd(opts?) -> string
//   buildBundleReadmeMd(opts?) -> string
//
// `opts.jsonlName` (default "export.jsonl") lets the caller name the JSONL
// stream so the docs reference the real filename. Output is deterministic.

const DEFAULT_JSONL = "export.jsonl";

export const buildBundleAgentsMd = (opts = {}) => {
  const jsonl = opts.jsonlName ?? DEFAULT_JSONL;
  return [
    "# AGENTS.md — applying this PinchGrab feedback bundle",
    "",
    "You are receiving captured UI feedback from a real browsing session.",
    "Each capture is one element the user pointed at, with their comments",
    "attached. Your job is to apply that feedback to the project's frontend",
    "source and verify the result. Work one capture at a time.",
    "",
    "## Read order",
    "",
    "1. `README.md` — what each file in this bundle is.",
    "2. `repair-index.md` (if present) — a ready-made triage punch list.",
    "3. `DESIGN.md` (if present) — the project's visual identity: color",
    "   tokens, typography, spacing, motion, and voice. **This is brand",
    "   canon.** Snap any visual change to these tokens; do not invent",
    "   colors, fonts, or spacing.",
    "4. `.agents/skills/PinchGrab/SKILL.md` (if present) — how to triage a",
    "   capture into a grounded, minimal fix.",
    `5. \`${jsonl}\` — the source of truth: one JSON object per line. Each`,
    "   capture carries its selector/paths, text, `outerHTML`, and the",
    "   user's `comments`.",
    "",
    "## How to act on a capture",
    "",
    "- **Locate the element in source.** Prefer the capture's `testId` or",
    "  `id`, then a stable class, then the CSS selector. Grep the codebase",
    "  for that handle. Frontend source usually lives under `src/`, `app/`,",
    "  `components/`, `ui/`, or a framework's pages/routes directory —",
    "  detect the real layout instead of assuming.",
    "- **Read the comments as the intent.** The user's note on a capture is",
    "  the requested change. Do exactly what it asks; if it is ambiguous,",
    "  surface the ambiguity rather than guessing wide.",
    "- **Stay scoped.** If the user pointed at one element, fix that element.",
    "  If you suspect a shared component or pattern is affected, call it out",
    "  as a follow-up — do not silently rewrite siblings.",
    "- **Ground every change.** Tie each edit to the captured selector +",
    "  the DESIGN.md token it should match. No 'trust me' changes.",
    "",
    "## Verify before you finish",
    "",
    "- Run the app and look at the element you changed (or diff a",
    "  screenshot against `screenshots/` if present).",
    "- Confirm the user's comment is satisfied and nothing adjacent",
    "  regressed.",
    "- Keep a one-line rollback note for each change.",
    "",
    "## Don't",
    "",
    "- Don't hardcode values that DESIGN.md defines as tokens.",
    "- Don't escalate an instance fix to a pattern-wide rewrite without",
    "  asking.",
    "- Don't treat the bundled DESIGN.md / SKILL.md as yours to discard —",
    "  if they look like placeholder templates, say so and verify against",
    "  the real project before applying.",
    "",
  ].join("\n");
};

export const buildBundleReadmeMd = (opts = {}) => {
  const jsonl = opts.jsonlName ?? DEFAULT_JSONL;
  return [
    "# PinchGrab feedback bundle",
    "",
    "This archive is captured UI feedback exported from PinchGrab. It pairs",
    "a machine-readable stream of element captures with the screenshots and",
    "the brand/triage context an AI coding agent needs to fix the user's",
    "frontend.",
    "",
    "## Start here",
    "",
    "Read `AGENTS.md` first — it tells you, the agent, how to apply this",
    "feedback and verify the result.",
    "",
    "## What's in the bundle",
    "",
    `- \`${jsonl}\` — the source of truth. One JSON object per line: a leading`,
    "  manifest, then one row per capture (selector/paths, text, `outerHTML`,",
    "  and the user's `comments`), plus standalone `feedback` rows.",
    "- `screenshots/*.png` — full-resolution PNGs of each captured element,",
    "  group, and page (when screenshots were enabled).",
    "- `screenshots.json` — uid-keyed index mapping captures to their PNGs.",
    "- `schema.json` — JSON-Schema describing every row type in the stream.",
    "- `duckdb.sql` — copy-paste SQL recipes for querying the stream.",
    "- `repair-index.md` — agent-friendly triage punch list (when present).",
    "- `DESIGN.md` — the project's visual identity / brand canon (when",
    "  configured). Snap visual changes to its tokens.",
    "- `.agents/skills/PinchGrab/SKILL.md` — how to triage a capture into a",
    "  grounded fix (when configured).",
    "",
    "## How an agent should read it",
    "",
    "1. `AGENTS.md` — the application loop.",
    "2. `DESIGN.md` — what the result should look like.",
    `3. \`${jsonl}\` — what to change and why (the user's comments).`,
    "4. `screenshots/` — what it looked like when captured.",
    "",
    "Work one capture at a time, ground each change in the captured selector",
    "and the DESIGN tokens, then run the app to verify.",
    "",
  ].join("\n");
};
