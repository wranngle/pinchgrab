// Shared types & message protocol between content script, side panel, and
// background service worker.

export type Rect = {x: number; y: number; w: number; h: number};
export type Viewport = {
  w: number; h: number; dpr: number;
  // User-preference media-query state at capture time. Lets a downstream
  // LLM reason about why captured appearance differs between sessions
  // (e.g. dark-mode vs light-mode of the same component).
  colorScheme?: 'dark' | 'light';
  reducedMotion?: boolean;
  // Document direction (`ltr` / `rtl`) — different from viewport size,
  // changes the meaning of `start`/`end` in CSS and the sense of
  // `rect.x`. Captured per page header so RTL captures don't get
  // silently mixed with LTR ones.
  direction?: 'ltr' | 'rtl';
  // Browser zoom level. `visualViewport.scale` reports the pinch-zoom
  // factor; values != 1 mean the user has zoomed in/out and any layout
  // bug they're capturing may not repro at default zoom.
  zoom?: number;
};

export type FrameworkInfo = {
  framework: 'react' | 'vue' | 'lit' | 'stencil' | 'svelte' | 'web-component';
  name?: string;
  displayName?: string;
  source?: {file?: string | null; line?: number | null};
  // Up-tree component ancestry (innermost first). For React, walked via
  // fiber `return` chain; for Vue, via `__vueParentComponent.parent`.
  // The component name alone doesn't tell an agent which file owns the
  // rendering — the chain helps it grep upward to find the route
  // component, then drill into the owning file.
  chain?: string[];
};

export type Ancestor = {
  tag: string;
  id?: string;
  role?: string;
  testId?: string;
  classes?: string[];
};

export type MatchedRule = {
  selector: string;
  declarations?: Record<string, string>;
  media?: string;
  // Was the @media query that wraps this rule actually matched at
  // capture time? `true` = active,
  // `false` = matched the selector but inactive (e.g. mobile rules
  // captured on a desktop viewport), `undefined` = matchMedia threw.
  mediaActive?: boolean;
};

// Synthetic hints PinchGrab adds to entries — kept distinct from `attrs`
// (real DOM attributes) so consumers can tell what came from the page vs
// what the capture pipeline injected.
export type EntryHints = {
  format?: string;     // input format hint (e.g. 'YYYY-MM-DD')
  valueMasked?: boolean; // password value was masked at capture time
};

export type Entry = {
  // Stable per-entry uuid. Generated at capture time. Distinct from `n`
  // (display sequence) and from `id` (DOM html id attribute). Foreign-key
  // target for FeedbackMessage.parentId.
  uid: string;
  // Foreign key into the session row (PageMessage.sessionId). Lets a
  // consumer link captures back to "which page-load context did they
  // come from?" without depending on URL string equality, which breaks
  // on hash navigation, query-param swaps, and SPA routing. Set by the
  // side panel at message-receive time, not on the page side.
  sessionId?: string;
  n: number;
  ts: string;
  url: string;
  tag: string;
  selector: string;
  outerHTML?: string;
  text?: string;
  // The visually-rendered form when CSS `text-transform` is set. Captured
  // alongside `text` (which is the source-truth `textContent`) so an LLM
  // can disambiguate between e.g. source `Refresh` and rendered `REFRESH`
  // without false-grepping against either.
  renderedText?: string;
  role?: string;
  accessibleName?: string;
  id?: string;            // the DOM html id attribute (unchanged)
  testId?: string;
  classes?: string[];
  attrs?: Record<string, string>; // real DOM attributes only
  hints?: EntryHints;     // synthetic capture-time hints
  rect: Rect;
  viewport: Viewport;
  inShadowDOM?: boolean;
  // CSS selector for the shadow host when `inShadowDOM` is true. Lets a
  // consumer (or the panel's re-validation pass) find the host element
  // since `document.querySelectorAll` doesn't pierce shadow roots.
  shadowHost?: string;
  componentRoot?: string;
  ancestors?: Ancestor[];
  component?: FrameworkInfo;
  // React event handler names probed from `__reactProps$<key>` — answers
  // "which handler fires when this is clicked?" without an LLM having to
  // grep the codebase. In dev builds these are real function names; in
  // prod they're minified but still anchor-able.
  events?: Record<string, string>;
  // htmx / Stimulus / Alpine / Turbo wiring on the element. Server-
  // rendered apps don't have React fibers — for them, this IS the
  // component shape.
  behaviorAttrs?: Record<string, string>;
  // True when `el.getAnimations()` reported an actively-playing
  // animation at capture time. Tells the consumer that captured rect /
  // transform / opacity may be at an interpolated mid-animation value.
  isAnimating?: boolean;
  // For elements rendered into a `<canvas>`, the DOM gives us essentially
  // nothing about what was clicked — the canvas has no children, no
  // text, no meaningful selectors below the canvas itself. Capture the
  // click position relative to the canvas's bounding box so a downstream
  // consumer can correlate (e.g. against a Datadog / Tableau / charting
  // library that exposes data-point coordinates). Coordinates are CSS
  // pixels; multiply by `viewport.dpr` to get device pixels.
  canvasClick?: {
    offsetX: number;
    offsetY: number;
    canvasW: number;
    canvasH: number;
    canvasSelector: string;
  };
  // Contenteditable rich-text editor context. Populated when the captured
  // node is, or lives inside, a `[contenteditable=true]` ancestor. Lets
  // an LLM reasoning about a "copy is wrong" / "the editor breaks when X"
  // capture know which editor library to look at — selectors generated
  // by ProseMirror / Lexical / etc are runtime-internal and won't grep
  // against user code, but the LIBRARY pointer routes the LLM to the
  // right wrapper component.
  editor?: {
    kind: 'prosemirror' | 'lexical' | 'slate' | 'quill' | 'tiptap' | 'native';
    rootSelector: string;
    contentLength: number;
  };
  // Last few DOM mutations BEFORE the click. Repro context for bugs like
  // "I clicked the wrong dropdown option" or "the value flickered before
  // I clicked it" — without this, the JSON snapshots only the post-
  // mutation state, leaving the LLM blind to what triggered the
  // appearance the user complained about. Pinchgrab keeps an 8-second
  // ring buffer of mutation records; capture attaches the most recent
  // 3 as a snapshot.
  domMutations?: DomMutation[];
  states?: string[];      // active pseudo-classes (was Record<string, true> in v1)
  // Locator quality: how many elements `selector` resolves to in its
  // scope (1 = unique). Higher means the selector is ambiguous.
  selectorMatchCount?: number;
  // Disambiguated ordering fields.
  // `n` is preserved for backwards compat (it's the capture-sequence
  // display label in the sidebar). The new fields are emit-time only:
  //   • captureIndex — same as `n` (capture sequence within session)
  //   • eventIndex   — monotonic position in the JSONL stream
  //   • visualOrder  — top→bottom, left→right rank within the page
  //   • displayLabel — human-facing label (mirrors `n` today)
  captureIndex?: number;
  eventIndex?: number;
  visualOrder?: number;
  displayLabel?: string;
  // Group flattening fields.
  // The group head carries `groupMemberUids` (just the IDs); each
  // member emits as its own top-level row with `groupUid` pointing
  // back at the head.
  groupMemberUids?: string[];
  groupUid?: string;
  // Lightweight a11y audit captured at click time. Heavier checks
  // (focus-visible screenshots, axe violations) are not yet wired.
  a11y?: {
    contrastRatio?: number;
    contrastPasses?: 'AA' | 'AAA' | 'fail';
    tabbable?: boolean;
    focusVisible?: boolean;
  };
  // Parent layout context — flex/grid/overflow/scroll/stacking
  // ancestors that shape the captured element's appearance.
  layoutContext?: Array<{
    tag: string;
    display?: string;
    position?: string;
    overflow?: string;
    zIndex?: string;
    transform?: string;
    willChange?: string;
    isScrollContainer?: boolean;
    scrollLeft?: number;
    scrollTop?: number;
    flex?: {direction?: string; wrap?: string; alignItems?: string; justifyContent?: string; gap?: string};
    grid?: {templateColumns?: string; templateRows?: string; gap?: string};
  }>;
  // Asset references inside the captured subtree (img src, <use href>,
  // background-image url). When a complaint is about a logo / icon /
  // artwork, an agent without these references would be left guessing.
  assets?: Array<{
    src: string;
    naturalW?: number; naturalH?: number;
    renderedW?: number; renderedH?: number;
    alt?: string;
    loaded?: boolean;
  }>;
  styles?: Record<string, string>;
  matchedRules?: MatchedRule[];
  pseudoElements?: Record<string, Record<string, string>>;
  // Truncation markers — present when capture had to elide content. Lets
  // a consumer detect "this entry was cut down" and refetch from the
  // live page if it needs the full version.
  //   outerHTML — original html length before the size-cap kicked in.
  //   children  — number of descendant subtrees replaced by depth-cap
  //               elision markers (`<!-- N children elided -->`).
  truncated?: {outerHTML?: number; children?: number; text?: number};
  // Group of additional captures associated with this entry (Alt+Shift+Click
  // / Alt+drag selections collapse here).
  group?: Entry[];
  // Optional screenshot bundle: each field is a relative path under the
  // user's Downloads/.pinchgrab/<workspace>/ root. The capturedAt stamp is
  // the ISO timestamp when the shot was taken.
  screenshot?: {
    element?: string;
    group?: string;
    page?: string;
    capturedAt?: string;
    // An empty `screenshot` field could mean "not yet shot", "failed",
    // or "skipped on purpose". When the pipeline declines or fails,
    // set this so receivers know it's not a retry candidate.
    unavailableReason?: 'autoScreenshotOff' | 'skipScreenshotHosts' | 'captureFailed' | 'permissionDenied' | string;
    // Crop metadata describing where the cropped PNG fits in the
    // original page coordinate system.
    crop?: {
      cssRect: {x: number; y: number; w: number; h: number};
      devicePxRect: {x: number; y: number; w: number; h: number};
      imageSize: {w: number; h: number};
      dpr: number;
      padding: number;
      selectors: string[];
    };
  };
};

export type DomMutation = {
  type: 'childList' | 'attributes' | 'characterData';
  ts: string;            // ISO of when the mutation fired
  target: string;        // compact descriptor of the mutation's target (`tag#id.cls`)
  attributeName?: string;
  oldValue?: string;     // truncated, with secret-shaped names redacted
  newValue?: string;     // truncated, with secret-shaped names redacted
  added?: number;        // childList: count of added nodes
  removed?: number;      // childList: count of removed nodes
  summary?: string;      // one-line human-readable description
};

export type PageContext = {
  url: string;
  title: string;
  viewport: Viewport;
  tokens: Record<string, string>;
  // Browser + locale fingerprint for session-level context. Lets a
  // downstream consumer answer "which browser produced this capture?" or
  // "was the captured app rendered in an RTL locale?" without rerunning.
  userAgent?: string;
  lang?: string;
  // Git build identity, when the captured app exposes
  // `<meta name="pinchgrab-build" content="commit:abc branch:main">`.
  gitContext?: {commit?: string; branch?: string; build?: string};
  // Whatever element had focus at capture time, plus a hint as to
  // whether the user navigated there with the keyboard (Tab / Shift+Tab
  // pressed in the last second). Useful for accessibility-bug captures:
  // "this element looks wrong only when keyboard-focused".
  activeFocus?: {selector?: string; recentlyTabbed?: boolean};
};

// ---------- Side-panel "messages" (UI rows) ---------------------------------
export type SelectorMessage = {
  type: 'selector';
  id: string;
  ts: string;
  entry: Entry;
  pinned?: boolean;
  // Legacy field kept around because old workspaces may still have it; we
  // strip it on capture, but don't reject it on import.
  dupePending?: unknown;
};

export type FeedbackMessage = {
  type: 'feedback';
  id: string;
  ts: string;
  text: string;
  // Optional foreign key into Entry.uid. Adjacency to a preceding selector
  // is the historical link; parentId makes it explicit and survives
  // re-ordering / split-group / import-export round-trips.
  parentUid?: string;
  tags?: string[];
  // Severity (`note` / `fix` / `block`) was removed from the UI in
  // 2026-05. The field is retained on the type as `unknown` so
  // tolerant readers (`denormalizeEntry`) don't drop the value from
  // legacy JSONL exports; new sessions never set it.
  severity?: 'note' | 'fix' | 'block';
};

export type PageMessage = {
  type: 'page';
  id: string;
  ts: string;
  url: string;
  title?: string;
  viewport?: Viewport;
  tokens?: Record<string, string>;
  userAgent?: string;
  lang?: string;
  gitContext?: {commit?: string; branch?: string; build?: string};
  // Route identity beyond the URL. Best-effort breakdown of pathname
  // / query / hash + a guess at the
  // active routeName (`?route=settings` or `#/users/42` style).
  route?: {
    pathname?: string;
    query?: Record<string, string>;
    hash?: string;
    routeName?: string;
    routeParam?: string;
  };
  // Redacted state snapshot. Surfaces the SHAPE of state that produced
  // the page (storage keys, cookie names, feature flags) without
  // leaking values. Lets a downstream agent reproduce by setting up the
  // same keys with their own data.
  state?: {
    storageKeys?: string[];
    sessionKeys?: string[];
    cookieNames?: string[];
    featureFlags?: string;
  };
  // Session uuid. Stable per workspace-boot — selector entries reference
  // it via `Entry.sessionId` so a consumer can link captures to their
  // session header without URL-string comparison.
  sessionId?: string;
};

export type PanelMessage = SelectorMessage | FeedbackMessage | PageMessage;

// ---------- IPC payloads (CS ↔ Panel ↔ Background) --------------------------
export type CsToPanel =
  | {kind: 'capture'; entry: Entry; page: PageContext; grouped?: boolean}
  | {kind: 'hover'; selector: string; tag: string; label: string; rect: Rect}
  | {kind: 'hover-end'}
  | {kind: 'pending-add'; entry: Entry}
  | {kind: 'pending-clear'}
  // Add a feedback row attached to a selector. The lookup is by
  // composite key — selector + url + parentUid — so a comment on
  // `[data-testid="forecast-item"]` on page A doesn't bleed into a
  // capture with the same selector on page B. parentUid (when the
  // content script can supply it from the annotation overlay's
  // associated capture) is the strongest disambiguator; url is the
  // fallback when only the on-page comment box is in play.
  | {kind: 'feedback-add'; selector: string; text: string; url?: string; parentUid?: string}
  // Fired when a session-level preference flips (dark-mode toggle, OS
  // motion-pref change). The panel appends a fresh page row so the
  // export's chronology reflects the toggle and post-change captures
  // carry the new viewport state.
  | {kind: 'preference-change'; reason: 'color-scheme' | 'reduced-motion'; page: PageContext};

export type PanelToCs =
  | {kind: 'outline'; selector: string; gold?: boolean; dashed?: boolean}
  | {kind: 'outline-clear'}
  | {kind: 'outline-multi'; selectors: string[]}
  | {kind: 'outline-multi-clear'}
  | {kind: 'scroll-to'; selector: string; sticky?: boolean}
  | {kind: 'sticky-clear'}
  // One-shot locator animation: scroll into view + three pulsing rings.
  // Distinct from `outline` (subtle hover ring) and `scroll-to` (silent
  // recenter) so the side panel Locate button can request something users
  // can actually find on a busy page.
  | {kind: 'locate-flash'; selector: string}
  | {kind: 'validate'; selectors: string[]}
  | {kind: 'log-element'; selector: string; n?: number}
  | {kind: 'recapture'; selector: string; n?: number}
  | {kind: 'capture-ancestor'; selector: string; depth: number}
  // Outline the Nth ancestor of `selector` without capturing it — used by
  // hover on ancestor breadcrumb chips in the side panel so the user
  // previews which element a chip refers to before clicking.
  | {kind: 'outline-ancestor'; selector: string; depth: number}
  | {kind: 'alt-state'; on: boolean}
  | {kind: 'manual-capture'; selector: string; n?: number}
  | {kind: 'annotation'; selector: string; payload: AnnotationPayload | null}
  | {kind: 'annotation-clear'}
  | {kind: 'pending-cancel'}
  | {kind: 'pending-commit'}
  | {kind: 'context-capture'}
  | {kind: 'set-captured'; selectors: string[]}
  | {kind: 'set-cs-prefs'; spacingOverlay?: boolean; hoverSnap?: boolean}
  // Screenshot-time overlay toggles. The background asks the content script
  // to hide its shadow-root chrome (rings, rubber-band, annotation) before
  // captureVisibleTab fires, then restores visibility once the PNG is back.
  | {kind: 'hide-overlays'}
  | {kind: 'show-overlays'};

export type AnnotationPayload = {
  selector?: string;
  // The captured entry's stable uid. The content script needs this so
  // its on-page comment box can route the comment to the *specific*
  // capture rather than to "any selector that matches." Prevents
  // cross-contamination when two captures share a selector across
  // pages or two sibling elements share a testId.
  uid?: string;
  n?: number;
  captured?: boolean;
  feedback?: string[];
};

export type PanelToBg =
  | {kind: 'capture-screenshot'; tabId?: number}
  | {kind: 'switch-to-tab'; url: string; openIfMissing?: boolean}
  | {kind: 'list-open-tabs'}
  | {kind: 'shot-element'; selector: string; n: number; workspace: string; padding?: number; tabId?: number}
  | {kind: 'shot-group'; selectors: string[]; n: number; workspace: string; padding?: number; tabId?: number}
  | {kind: 'shot-page'; n: number; workspace: string; tabId?: number}
  // Side panel asks the background to write a UTF-8 string (JSONL, Markdown,
  // README) to disk. `subdir` is relative to .pinchgrab/<workspace>/ — we
  // default to 'exports' so JSONL/MD live separate from screenshots.
  | {kind: 'save-text'; workspace: string; filename: string; text: string; mime: string; subdir?: string}
  // Same as save-text but for binary blobs (workspace ZIP). chrome.runtime
  // .sendMessage uses structured cloning, which preserves Uint8Array, so we
  // pass the typed array directly. number[] is accepted as a fallback for
  // older callers and tests that pre-serialize.
  | {kind: 'save-bytes'; workspace: string; filename: string; bytes: Uint8Array | number[]; mime: string; subdir?: string};

export type ShotReply = {
  ok: boolean;
  filename?: string;     // workspace-relative path (e.g. default/screenshots/foo.png)
  absPath?: string;      // OS-absolute path for "Copy as path"
  copyPath?: string;     // UI-facing path; avoids Playwright temp artifact names
  tempPath?: boolean;    // true when absPath is a browser/test-harness artifact path
  downloadState?: 'in_progress' | 'interrupted' | 'complete';
  dataUrl?: string;      // downscaled thumbnail (≤320px wide) for the side-panel preview
  fullDataUrl?: string;  // full-resolution PNG dataURL — used by the workspace archive export
  error?: string;
  truncated?: boolean;
  // Crop metadata. Lets receivers map between the stored PNG and
  // original page coordinates so they can
  // draw their own overlay or reproduce the crop on a fresh capture.
  crop?: {
    cssRect: {x: number; y: number; w: number; h: number};
    devicePxRect: {x: number; y: number; w: number; h: number};
    imageSize: {w: number; h: number};
    dpr: number;
    padding: number;
    selectors: string[];
  };
};

export type SaveReply = {
  ok: boolean;
  filename?: string; // workspace-relative path
  absPath?: string;  // OS-absolute path
  copyPath?: string; // UI-facing path
  tempPath?: boolean;
  downloadState?: 'in_progress' | 'interrupted' | 'complete';
  error?: string;
};

export type BgReply =
  | {dataUrl: string}
  | {found: boolean; opened?: number}
  | {tabs: Array<{id?: number; url?: string; title?: string}>}
  | {error: string}
  | ShotReply
  | SaveReply;

// ─── Export shapes (v2) ─────────────────────────────────────────────────────
// Manifest line emitted as the very first JSONL line. Carries the metadata
// necessary to resync a downloaded file with its workspace + tooling.
export type ExportManifest = {
  v: 2;
  type: 'manifest';
  ts: string;       // ISO of when the export was generated
  generated: number; // epoch ms (mirror of ts in machine-readable form)
  tool: 'pinchgrab';
  workspace: string;
  filename: string;
  format: 'jsonl' | 'markdown' | 'tar.zst';
  hosts: string[];
  // Ambiguous totals. The previous `selectors / feedback / pages`
  // triple didn't say whether nested
  // group members were counted, whether feedback-bearing parents were
  // a subset, or how screenshots were tallied. The expanded shape
  // below names every category explicitly so a downstream agent can
  // tell exactly what's in the bundle.
  counts: {
    // Top-level selector rows in the JSONL stream (excludes nested
    // group members, but the `groupMembers` field counts those).
    selectors: number;
    feedback: number;
    pages: number;
    // Number of selector rows that have at least one feedback child.
    // Useful for "show me only the items with comments".
    feedbackBearingSelectors?: number;
    // Selectors that ship under a group head's `entry.group` array
    // rather than as their own top-level row.
    groupMembers?: number;
    // Screenshot inventory (counted by file, deduped).
    screenshotsElement?: number;
    screenshotsGroup?: number;
    screenshotsPage?: number;
    // Selector rows that should have an element screenshot but don't
    // (post-bug-#2 forced shoot may still fail). Repair agents can
    // skip these or request a re-capture.
    selectorsMissingScreenshot?: number;
    // Feedback rows whose parentUid doesn't resolve to any selector
    // in this archive. Should always be 0; non-zero means the export
    // got truncated or a parent was deleted between capture + emit.
    orphanedFeedback?: number;
  };
  // Resolution root for every path field in the JSONL stream.
  //   • 'archive'   — paths are relative to the extracted archive root
  //                   (used for tar.zst exports).
  //   • 'workspace' — paths are relative to the workspace dir on disk,
  //                   i.e. `Downloads/.pinchgrab/<workspace>/`
  //                   (used for plain JSONL exports).
  // Receivers prepend the appropriate root to resolve any path field.
  pathRoot?: 'archive' | 'workspace';
  // Indirection pointer to the UI skill that knows how to triage these
  // captures. When `inline: true`, the skill content lives at
  // `archivePath` inside the tar (default: `.agents/skills/PinchGrab/SKILL.md`).
  //
  // `customized` and `template` are mutually-exclusive confidence flags:
  //   • customized: true → user uploaded / pasted their own content.
  //                       Treat the file as authoritative.
  //   • template: true   → user is shipping the bundled default.
  //                       Treat as generic boilerplate; verify before
  //                       applying.
  // (The previous `template` flag alone was ambiguous because the
  // bundled local template still looks project-specific.)
  skill?: {name: string; path: string; inline?: boolean; archivePath?: string; template?: boolean; customized?: boolean};
  // Pointer to the project's DESIGN.md. Same rules: `customized: true`
  // means the user supplied this content; `template: true` means it's
  // PinchGrab's bundled default.
  design?: {path?: string; inline?: boolean; archivePath?: string; template?: boolean; customized?: boolean};
  // Self-roast section. The export surfaces its own gaps so a
  // downstream LLM doesn't have to discover
  // them. Empty array = clean export. Each diagnostic has a stable
  // `code` so receivers can dispatch on it programmatically.
  exportDiagnostics?: ExportDiagnostic[];
  // Archive integrity. Receivers can detect partial extraction /
  // corruption with a single check.
  archiveIntegrity?: {
    files: Array<{path: string; size: number}>;
  };
  // Build/source identity. Captured from a
  // `<meta name="pinchgrab-build" content="commit:abc branch:main dirty:true">`
  // tag the user's app injects, plus PinchGrab extension version.
  // Receivers can tell if the export is stale relative to the repo.
  // Omitted entirely when no build info is available.
  build?: {
    extensionVersion?: string;
    commit?: string;
    branch?: string;
    dirty?: boolean;
    deployBuild?: string;
  };
};

export type ExportDiagnostic = {
  severity: 'error' | 'warn' | 'info';
  code: string;
  detail?: string;
  uid?: string;
};

// Envelope marker used on every PinchGrab message (so other extension
// messages traveling through the same channel are ignored). __mid is a
// per-dispatch unique stamp so receivers can dedupe a message that arrives
// through more than one channel (e.g. runtime.onMessage + a port relay).
export type PgEnvelope<T> = T & {__pg: true; __mid: string};

export type AnyMessage = CsToPanel | PanelToCs | PanelToBg;

let _midCounter = 0;
const newMid = (): string =>
  `${Date.now().toString(36)}-${(++_midCounter).toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Helper: stamp a payload with the envelope marker + unique message id.
export const pg = <T extends {kind: string}>(payload: T): PgEnvelope<T> =>
  ({__pg: true, __mid: newMid(), ...payload}) as PgEnvelope<T>;
