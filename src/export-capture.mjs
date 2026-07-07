// Single-capture full export.
//
// "Copy capture as JSON" wants a COMPLETE, self-contained textual export of
// ONE capture: its selectors/paths, element text/content, outerHTML,
// metadata, AND every note/comment attached to it — everything a full
// workspace export carries, but scoped to a single element.
//
// The panel models a capture as an `Entry` (src/types.ts) plus zero or more
// `FeedbackMessage` rows linked back via `parentUid → Entry.uid`. Because
// notes live on separate rows, the serializer takes the capture entry and
// its feedback rows together so the JSON is genuinely self-contained — a
// caller can hand the output to an agent and nothing dangles.
//
// Group heads (Alt+Shift+Click selections) carry child captures under
// `entry.group`; we inline those children (with their own feedback) so a
// grouped capture exports as one complete object too.
//
// Two output forms, mirroring the workspace export's JSON + english split:
//   serializeCaptureFull(capture, opts)     → object  (structured, complete)
//   serializeCaptureJson(capture, opts)      → string  (pretty JSON + newline)
//   serializeCaptureText(capture, opts)      → string  (markdown, human/LLM)
//
// `capture` accepts either:
//   • { entry, feedback?, members? }  — explicit shape, OR
//   • a bare `Entry`                  — feedback defaults to []
//
// Output is deterministic: identical input → byte-identical output. No
// timestamps are injected; only the capture's own `ts` fields appear.

// ─── Input normalization ────────────────────────────────────────────────────

// Accept a bare Entry or a {entry, feedback, members} wrapper and return a
// normalized {entry, feedback, members} with arrays always present.
const normalizeCapture = (capture) => {
  if (!capture || typeof capture !== "object") {
    throw new Error("serializeCaptureFull: capture must be an object");
  }
  // Bare Entry: it has a `selector` / `uid` but no nested `entry`.
  const entry = capture.entry ?? capture;
  if (!entry || typeof entry !== "object") {
    throw new Error("serializeCaptureFull: capture has no entry");
  }
  const feedback = Array.isArray(capture.feedback) ? capture.feedback : [];
  // Group members may be supplied explicitly, else fall back to the entry's
  // own `group` array (the panel stores child captures there).
  const members = Array.isArray(capture.members)
    ? capture.members
    : Array.isArray(entry.group)
      ? entry.group
      : [];
  return { entry, feedback, members };
};

// A feedback row scoped to a single capture. Strips routing/UI cruft
// (id, type) and keeps only what a reviewer needs: the text, when it was
// written, any tags, and the parent link for traceability.
const slimComment = (fb) => {
  const out = { text: typeof fb.text === "string" ? fb.text : "" };
  if (fb.ts) out.ts = fb.ts;
  if (fb.uid) out.uid = fb.uid;
  if (fb.parentUid) out.parentUid = fb.parentUid;
  if (Array.isArray(fb.tags) && fb.tags.length) out.tags = fb.tags;
  return out;
};

// Collect the paths/selectors for a capture into one block so every way of
// locating the element is in a single, obvious place. Tolerant of both the
// panel `Entry` shape (flat `selector` + `id`/`testId`) and the richer
// `selectors` sub-object some capture pipelines emit.
const collectPaths = (entry) => {
  const paths = {};
  if (entry.selector) paths.css = entry.selector;
  const sel = entry.selectors;
  if (sel && typeof sel === "object") {
    if (sel.css && sel.css !== paths.css) paths.cssFull = sel.css;
    if (sel.compact) paths.compact = sel.compact;
    if (sel.xpath) paths.xpath = sel.xpath;
    if (sel.dataIds) paths.dataIds = sel.dataIds;
  }
  if (entry.componentRoot) paths.componentRoot = entry.componentRoot;
  if (entry.shadowHost) paths.shadowHost = entry.shadowHost;
  if (entry.id) paths.domId = entry.id;
  if (entry.testId) paths.testId = entry.testId;
  if (typeof entry.selectorMatchCount === "number") {
    paths.matchCount = entry.selectorMatchCount;
  }
  return paths;
};

// ─── Full structured form ───────────────────────────────────────────────────

// Build the complete object for ONE capture. Everything textual the
// workspace export would carry for this element, with notes/comments
// inlined. Group members recurse so a grouped capture is self-contained.
export const serializeCaptureFull = (capture, opts = {}) => {
  const { entry, feedback, members } = normalizeCapture(capture);

  const out = {
    kind: "pinchgrab/capture-full",
    v: 1,
  };
  if (entry.uid) out.uid = entry.uid;
  if (entry.n !== undefined) out.n = entry.n;
  if (entry.ts) out.ts = entry.ts;
  if (entry.url) out.url = entry.url;
  if (entry.tag) out.tag = entry.tag;

  // Identity / a11y naming.
  const identity = {};
  if (entry.role !== undefined) identity.role = entry.role;
  if (entry.accessibleName !== undefined) identity.accessibleName = entry.accessibleName;
  if (entry.testId !== undefined) identity.testId = entry.testId;
  if (entry.id !== undefined) identity.id = entry.id;
  if (Array.isArray(entry.classes) && entry.classes.length) identity.classes = entry.classes;
  if (Object.keys(identity).length) out.identity = identity;

  // Paths — every way to locate the element.
  const paths = collectPaths(entry);
  if (Object.keys(paths).length) out.paths = paths;

  // Text / content. We keep all textual surfaces so nothing the user can
  // see is lost: source text, the CSS-rendered form, and the markup.
  const content = {};
  if (entry.text !== undefined) content.text = entry.text;
  if (entry.renderedText !== undefined) content.renderedText = entry.renderedText;
  if (entry.value !== undefined) content.value = entry.value;
  if (entry.placeholder !== undefined) content.placeholder = entry.placeholder;
  if (entry.outerHTML !== undefined) content.outerHTML = entry.outerHTML;
  if (Object.keys(content).length) out.content = content;

  // Notes / comments attached to this capture.
  if (feedback.length) out.comments = feedback.map(slimComment);

  // Remaining structured metadata an agent may want — copied through
  // verbatim so this export is as complete as the JSONL row. We allow-list
  // the heavy/structured fields rather than dumping the whole Entry so the
  // output ordering stays stable and obvious.
  const meta = {};
  const passthrough = [
    "rect", "viewport", "states", "attrs", "hints", "component", "events",
    "behaviorAttrs", "a11y", "assets", "layoutContext", "styles",
    "matchedRules", "ancestors", "screenshot", "truncated", "sessionId",
    "canvasClick", "editor", "domMutations", "isAnimating",
  ];
  for (const key of passthrough) {
    if (entry[key] !== undefined) meta[key] = entry[key];
  }
  if (Object.keys(meta).length) out.meta = meta;

  // Group members: recurse so each child capture is fully serialized too.
  // A member may carry its own feedback when the caller supplies a
  // {entry, feedback} pair; bare child Entries serialize with no comments.
  if (members.length) {
    out.members = members.map((m) => serializeCaptureFull(m, opts));
  }

  return out;
};

// Pretty JSON string for the "Copy capture as JSON" button. Trailing
// newline so it round-trips cleanly through editors / `pbpaste`.
export const serializeCaptureJson = (capture, opts = {}) =>
  JSON.stringify(serializeCaptureFull(capture, opts), null, 2) + "\n";

// ─── Single-capture markdown form ───────────────────────────────────────────
//
// Matches the workspace export's english/markdown surface but scoped to one
// capture. Useful when the user wants to paste a human-readable card rather
// than raw JSON.

const heading = (entry) => {
  const name =
    entry.accessibleName ||
    entry.testId ||
    entry.id ||
    entry.selector ||
    entry.tag ||
    "capture";
  const label = entry.n !== undefined ? `Capture #${entry.n}` : "Capture";
  return `${label}: ${name}`;
};

const renderPaths = (paths) => {
  const lines = [];
  for (const [k, v] of Object.entries(paths)) {
    lines.push(`- **${k}:** \`${v}\``);
  }
  return lines;
};

export const serializeCaptureText = (capture, opts = {}) => {
  const { entry, feedback, members } = normalizeCapture(capture);
  const lines = [];
  lines.push(`# ${heading(entry)}`, "");
  if (entry.url) lines.push(`Page: <${entry.url}>`, "");
  if (entry.tag) lines.push(`Element: \`<${entry.tag}>\``, "");

  const paths = collectPaths(entry);
  if (Object.keys(paths).length) {
    lines.push("", "## Paths", "", ...renderPaths(paths));
  }

  if (entry.text !== undefined || entry.renderedText !== undefined) {
    lines.push("", "## Text", "");
    if (entry.text !== undefined) lines.push(`Source: ${JSON.stringify(entry.text)}`);
    if (entry.renderedText !== undefined && entry.renderedText !== entry.text) {
      lines.push(`Rendered: ${JSON.stringify(entry.renderedText)}`);
    }
  }

  if (entry.outerHTML !== undefined) {
    lines.push("", "## Markup", "", "```html", entry.outerHTML, "```");
  }

  if (feedback.length) {
    lines.push("", "## Notes & comments", "");
    for (const fb of feedback) {
      const text = typeof fb.text === "string" ? fb.text : "";
      const tags = Array.isArray(fb.tags) && fb.tags.length ? ` _(${fb.tags.join(", ")})_` : "";
      lines.push(`- ${text}${tags}`);
    }
  }

  if (members.length) {
    lines.push("", "## Grouped with", "");
    for (const m of members) {
      const me = normalizeCapture(m).entry;
      lines.push(`- ${heading(me)} — \`${me.selector ?? me.tag ?? "?"}\``);
    }
  }

  return lines.join("\n") + "\n";
};
