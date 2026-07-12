// PinchGrab side-panel UI. Receives captures + hovers from the content
// script; renders the chat-bubble timeline, exports, validates, etc.
//
// Decomposed into small files for clarity:
//   • types.ts      — shared types, message protocol
//   • lucide.ts     — icon registry
//   • this file     — wire-up / rendering / export builders
//
// Loaded as the side panel page: chrome.sidePanel default_path.

import type {
  AnnotationPayload, CsToPanel, Entry, ExportDiagnostic, ExportManifest, FeedbackMessage, PageMessage,
  PageSnapshot, PanelMessage, PanelToBg, PanelToCs, PgEnvelope, SaveReply, SelectorMessage, ShotReply, Viewport,
} from './types.ts';
import {pg} from './types.ts';
import {PG_ICONS} from './lucide.ts';
import {buildTar, wrapZstd, type TarEntry} from './tar.ts';
import {TEMPLATES_PRESENT} from './templates.gen.ts';
import {BUNDLED_SKILLS_PRESENT, BUNDLED_SKILL_FILES} from './bundled-skills.gen.ts';
import {buildAgentPromptJsonl, buildAgentProtocolMd, type SkillsIndex} from './export-agent-prompt.mjs';
import {serializeCaptureJson} from './export-capture.mjs';

(() => {
  const LOG = '[PinchGrab/sp]';
  const PREFS_STORAGE_NAME = 'pinchgrab.prefs.v2';
  const WORKSPACES_KEY = 'pinchgrab.workspaces.v1';
  const inExtension = typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);

  // ─── Template resource loader ───────────────────────────────────────────
  // Earlier the templates were baked as string constants into this IIFE
  // (~360KB across DESIGN + SKILL). That bloated the sidepanel bundle to
  // ~1.95MB and slowed first-open parse time noticeably. They now ship as
  // separate `.md` files under `extension/templates/` and load on demand
  // via fetch — when the user opens the editor modal, or when the export
  // pipeline needs to bundle a fallback.
  //
  // Cache results in-process so repeat reads (modal open → close → reopen,
  // or sequential exports) don't re-fetch.
  const templateCache = new Map<string, string>();
  const TEMPLATE_FILES = {
    designTemplate: 'DESIGN.template.md',
    skillTemplate: 'PinchGrab.SKILL.template.md',
    localDesign: 'local.DESIGN.md',
    localSkill: 'local.SKILL.md',
  } as const;
  type TemplateKey = keyof typeof TEMPLATE_FILES;
  const templateUrl = (file: string): string => {
    // Inside the extension, the sidepanel runs from
    // chrome-extension://<id>/sidepanel.html, so resources resolve via
    // chrome.runtime.getURL. The Playwright static-server tests serve
    // `/templates/<file>` from the extension root directly, so a
    // relative URL works there as a fallback.
    if (inExtension && chrome.runtime?.getURL) {
      return chrome.runtime.getURL(`templates/${file}`);
    }
    return `templates/${file}`;
  };
  const loadTemplate = async (key: TemplateKey): Promise<string> => {
    if (!TEMPLATES_PRESENT[key]) return '';
    const file = TEMPLATE_FILES[key];
    const cached = templateCache.get(file);
    if (cached !== undefined) return cached;
    try {
      const res = await fetch(templateUrl(file));
      if (!res.ok) throw new Error(`status ${res.status}`);
      const text = await res.text();
      templateCache.set(file, text);
      return text;
    } catch (err) {
      console.warn(LOG, `template fetch failed: ${file}`, err);
      templateCache.set(file, '');
      return '';
    }
  };
  // Effective content used by the export pipeline and the modal. When the
  // user has customized via the textarea/upload, that wins; otherwise the
  // PLAIN STOCK template. The old `local.*` dev-override preference is
  // gone (operator ruling 2026-07-11): it silently substituted the
  // developer's own brand files as the "default", contaminating exports
  // that the manifest still flagged as bundled-default content.
  const resolveDesignContent = async (): Promise<string> => {
    if (prefs.designMd && prefs.designMd.trim()) return prefs.designMd;
    return loadTemplate('designTemplate');
  };
  const resolveSkillContent = async (): Promise<string> => {
    if (prefs.skillMd && prefs.skillMd.trim()) return prefs.skillMd;
    return loadTemplate('skillTemplate');
  };
  // True when the user hasn't customized → prefs.{designMd|skillMd} is
  // empty and we're falling back to a bundled template/local resource.
  const isUsingTemplateDesign = (): boolean => !prefs.designMd || !prefs.designMd.trim();
  const isUsingTemplateSkill = (): boolean => !prefs.skillMd || !prefs.skillMd.trim();

  // Vendored third-party skill resources (impeccable reference set +
  // perception-first-design), shipped under extension/skills/ by the build
  // and inlined into bundle exports. Same lazy fetch + cache pattern as the
  // templates above.
  const bundledSkillCache = new Map<string, string>();
  const loadBundledSkillFile = async (extPath: string): Promise<string | null> => {
    const cached = bundledSkillCache.get(extPath);
    if (cached !== undefined) return cached;
    try {
      const url = inExtension && chrome.runtime?.getURL ? chrome.runtime.getURL(extPath) : extPath;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const text = await res.text();
      bundledSkillCache.set(extPath, text);
      return text;
    } catch (err) {
      console.warn(LOG, `bundled skill fetch failed: ${extPath}`, err);
      return null;
    }
  };

  // ─── Storage adapter ─────────────────────────────────────────────────────
  const Store = {
    async get<T>(key: string, fallback: T): Promise<T> {
      if (inExtension && chrome.storage?.local) {
        try { const o = await chrome.storage.local.get(key); return (o[key] as T) ?? fallback; }
        catch { return fallback; }
      }
      try { const r = localStorage.getItem(key); return r === null ? fallback : (JSON.parse(r) as T); }
      catch { return fallback; }
    },
    async set(key: string, value: unknown): Promise<void> {
      if (inExtension && chrome.storage?.local) {
        try { await chrome.storage.local.set({[key]: value}); return; } catch { /* ignore */ }
      }
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    },
  };

  // ─── DOM refs ────────────────────────────────────────────────────────────
  const $ = <T extends Element = HTMLElement>(s: string): T => document.querySelector(s) as T;
  const list = $('[data-list]');
  const composer = $<HTMLTextAreaElement>('[data-composer]');
  const status = $('[data-status]');
  const search = $<HTMLInputElement>('[data-search]');
  // Ctrl+F visual-find bar (distinct from the header search, which opens the
  // command palette). May be absent in very old cached markup, so consumers
  // null-guard.
  const findBar = document.querySelector<HTMLElement>('[data-find-bar]');
  const findInput = document.querySelector<HTMLInputElement>('[data-find]');
  const findCount = document.querySelector<HTMLElement>('[data-find-count]');
  // Canonicalize keyboard-shortcut pills per platform. Every shortcut pill
  // is authored in the canonical Cmd-form (each token capitalized, joined
  // with '+': Alt+Click, Cmd+K, Cmd+Shift+Z); on non-Mac we swap the leading
  // Cmd modifier for Ctrl. Pills opt in via data-mod-* so a string like the
  // 'Alt+…' pills (which never carry Cmd) are left untouched.
  const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
  if (!isMac) {
    for (const el of document.querySelectorAll<HTMLElement>('kbd[data-mod-k], kbd[data-mod-z], kbd[data-mod-shift-z]')) {
      el.textContent = (el.textContent ?? '').replace(/^Cmd\b/, 'Ctrl');
    }
  }
  const importFile = $<HTMLInputElement>('#import-file');
  const statsEl = $('[data-stats]');
  const starsEl = $('[data-stars]');
  const tooltipEl = $('[data-tooltip]');
  const drilldownEl = $('[data-drilldown]');
  const drawer = $('[data-drawer]');
  const palette = $('[data-palette]');
  const paletteInput = $<HTMLInputElement>('[data-palette-input]');
  const paletteList = $('[data-palette-list]');
  const compWords = $('[data-comp-words]');
  const compTokens = $('[data-comp-tokens]');
  const statTokens = $('[data-stat-tokens]');
  const statWords = $('[data-stat-words]');
  const wsSelect = $<HTMLSelectElement>('[data-workspace]');
  const wsList = $('[data-ws-list]');
  const wsName = $<HTMLInputElement>('[data-ws-name]');

  const mountIcons = (root: ParentNode = document): void => {
    for (const el of root.querySelectorAll<HTMLElement>('[data-icon]')) {
      const name = el.getAttribute('data-icon');
      const size = Number(el.getAttribute('data-size') ?? 16);
      if (name && PG_ICONS.has(name)) el.innerHTML = PG_ICONS.svgString(name, size);
    }
  };
  mountIcons();

  // ─── State ──────────────────────────────────────────────────────────────
  type Prefs = {
    includeOuterHTML: boolean;
    includeMatchedRules: boolean;
    includeStyles: boolean;
    minify: boolean;
    autoScrollToHovered: boolean;
    useScreenshots: boolean;
    spacingOverlay: boolean;
    hoverSnap: boolean;
    autoScreenshot: boolean;
    // Comma-separated host patterns (substring match). Hosts in this list
    // skip the entire screenshot pipeline — useful for sensitive pages
    // (banking, internal admin) where the user doesn't want PNGs landing
    // on disk.
    skipScreenshotHosts: string;
    // Inline DESIGN.md content the user pasted or uploaded via the side
    // panel settings. Defaults to a templated placeholder so out-of-the-
    // box exports always include a DESIGN.md — the consumer LLM can
    // either work from the placeholder (and ask for the real one) or
    // from a user-customized copy. The settings UI flags this banner-
    // style when the value still matches the template so the user
    // knows to fill it in.
    designMd: string;
    // Resolved path the receiver should read DESIGN.md from. Defaults
    // to `~/.agents/DESIGN.md`; user can override per-machine.
    designPath: string;
    // Resolved path of the PinchGrab UI skill on the receiver's
    // filesystem. The skill content itself is bundled inline into the
    // archive (see `skillMd`), so this is a hint for receivers that
    // want to persist the skill at a canonical location.
    skillPath: string;
    // Inline UI-skill content. Default is the bundled PinchGrab triage
    // skill template; user can customize via settings paste/upload.
    // Bundled into the archive at `./.agents/skills/PinchGrab/SKILL.md`.
    skillMd: string;
    // When true, fire a fresh page screenshot on EVERY capture rather
    // than once per (workspace, url) tuple. Useful for capturing a
    // multi-step flow where the page state changes between captures.
    // Default false — most users want the default first-only behavior
    // since page screenshots are large and the first one already gives
    // a session-level reference.
    pageShotPerCapture: boolean;
    // Suppress Chrome's download bubble while PinchGrab writes its own
    // files (screenshots + exports). Requires the optional `downloads.ui`
    // permission. Default ON as intent; until the permission is actually
    // granted (needs a user gesture — the nudge banner or the settings
    // checkbox), saves stay visible.
    quietSaves: boolean;
    // The user dismissed the quiet-saves nudge banner — never re-show it.
    quietNudgeDismissed: boolean;
    // Bundle the vendored third-party design skills (impeccable reference
    // set + perception-first-design) plus skills-index.json into archive
    // exports. On by default: the Send-to-Agent protocol's skill-mapping
    // phase assumes their presence. ~1.2 MB of markdown per bundle.
    bundleSkills: boolean;
    // Bundle the full serialized HTML of each captured page under pages/.
    // Off by default (documents can be huge); collected lazily at export
    // time from live tabs, never persisted to chrome.storage.
    includePageHTML: boolean;
  };
  const DEFAULT_PREFS: Prefs = {
    includeOuterHTML: true,
    includeMatchedRules: true,
    includeStyles: true,
    // Default to minified exports — most agents want the smallest
    // token-footprint payload. Existing users' saved prefs are merged over
    // this default in loadAll(), so only NEW/unset installs see the flip.
    minify: true,
    autoScrollToHovered: true,
    useScreenshots: true,
    spacingOverlay: false,
    hoverSnap: true,
    autoScreenshot: true,
    skipScreenshotHosts: '',
    // designMd / skillMd default to '' which the resolver treats as
    // "fall back to the bundled template at export time". Storing the
    // empty string keeps chrome.storage small and lets `isUsingTemplate*`
    // be a cheap synchronous check.
    designMd: '',
    designPath: '~/.agents/DESIGN.md',
    skillPath: '~/.agents/skills/PinchGrab/SKILL.md',
    skillMd: '',
    pageShotPerCapture: false,
    quietSaves: true,
    quietNudgeDismissed: false,
    bundleSkills: true,
    includePageHTML: false,
  };

  // Rewrite the `name:` field in a SKILL.md's YAML frontmatter. The
  // user's source-of-truth SKILL.md is catalogued under whatever name
  // their wider `.agents/skills/` tree uses (often `ui`); the bundled
  // archive copy should always identify as `PinchGrab` so a downstream
  // LLM reading the manifest doesn't get confused about which skill
  // file applies. Only the FIRST top-of-file `name:` line within the
  // leading `---` block is touched.
  const rebrandSkillName = (md: string, newName: string): string => {
    // The frontmatter block, if present, is between leading `---\n`
    // and the next `\n---\n`. Anything else (no frontmatter, name not
    // on a single line, etc.) returns unchanged — better to ship the
    // original than risk corrupting the file.
    const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!m) return md;
    const fm = m[1]!;
    const rebrandedFm = fm.replace(/^name:\s*.+$/m, `name: ${newName}`);
    if (rebrandedFm === fm) return md; // no `name:` field; nothing to do
    return md.replace(m[0], `---\n${rebrandedFm}\n---\n`);
  };
  type Workspace = {name: string; createdAt: string; tabId?: number; url?: string; title?: string};
  // One archived state of a workspace (captured just before a Clear-all).
  // `shots` is the thumbnail map (full-res PNGs are session-only and not
  // archived). Restorable from Settings → Workspaces.
  type WorkspaceSnapshot = {
    id: string;
    ts: string;
    messages: PanelMessage[];
    shots: Record<string, string>;
    selectors: number;
    comments: number;
  };

  let messages: PanelMessage[] = [];
  let liveTabUrl: string | null = null;
  let liveTabPath: string | null = null;
  const selectorValidity = new Map<string, boolean | 'diff-page'>();
  const selectorErrors = new Map<string, string>();
  const insertBefore: {current: string | null; comment: boolean} = {current: null, comment: false};
  let searchQuery = '';
  let lastActiveSelector: string | null = null;
  let stickyTimer = 0;
  let STICKY_TTL_MS = 5_000;
  let panelHovered = false;
  let phantomTarget: {selector: string; label: string; tag?: string; rect?: DOMRect} | null = null;
  let pendingMulti: Entry[] = [];
  const shots = new Map<string, string>();
  // Full-resolution PNG dataURL per selector. NOT persisted to
  // chrome.storage (cap pressure — 100 captures × 80 KB each = 8 MB), so
  // it's only available for the current session's archive export. Cleared
  // on workspace switch.
  const shotsFull = new Map<string, string>();
  // Track which (workspace, page-url) tuples already fired a page shot so we
  // don't re-shoot the entire page on every capture. Reset on workspace
  // switch — no day key, the dedupe is per-session.
  const pageShotsFired = new Set<string>();
  const pageShotKey = (url: string): string => `${activeWs}:${url}`;
  // Last successful export — both the workspace-relative path (shown to the
  // user) and the OS-absolute path (copied by the "Copy as path" button).
  // Updated on JSONL/MD/ZIP/screenshot saves.
  const lastExport: {relPath: string | null; absPath: string | null; copyPath: string | null; tempPath: boolean; kind: string | null; agentPrompt: string | null} = {
    relPath: null, absPath: null, copyPath: null, tempPath: false, kind: null, agentPrompt: null,
  };
  let workspaces: Workspace[] = [{name: 'default', createdAt: new Date().toISOString()}];
  let activeWs = 'default';
  // Session uuid — generated once per workspace boot. Goes onto every
  // page row and every selector entry so a consumer can link captures
  // to "which session?" without URL-string compare. Stable across a
  // single workspace load; resets on workspace switch.
  let sessionId: string = '';
  const wsMsgKey = (n: string): string => `pinchgrab.ws.${n}.messages.v1`;
  const wsShotsKey = (n: string): string => `pinchgrab.ws.${n}.shots.v1`;
  // Persistent snapshot history per workspace — a Clear-all archives the wiped
  // captures+comments+thumbnails here so they can be restored later from
  // Settings → Workspaces. Lives in the same chrome.storage layer as the rest
  // of the workspace data.
  const wsSnapshotsKey = (n: string): string => `pinchgrab.ws.${n}.snapshots.v1`;
  // Cap so the history can't balloon storage; oldest snapshots drop off.
  const WS_SNAPSHOT_CAP = 10;
  const wsShotsFullKey = (n: string): string => `pinchgrab.ws.${n}.shotsFull.v1`;
  // chrome.storage.local has a 10 MB default quota; we budget half of
  // that for full-resolution PNGs (the rest is messages, prefs, thumbs).
  // When the budget is reached we FIFO-evict the oldest entries (Map
  // preserves insertion order). Estimate dataURL size = string length.
  const SHOTS_FULL_BUDGET_BYTES = 5 * 1024 * 1024;
  const undoStack: string[] = [];
  const redoStack: string[] = [];
  const UNDO_CAP = 30;
  let suspendSnapshots = false;
  let prefs: Prefs = {...DEFAULT_PREFS};

  // ─── Status helper ──────────────────────────────────────────────────────
  let statusTimer = 0;
  const setStatus = (msg: string, opts: {kind?: 'warn' | 'info' | 'ok'} = {}): void => {
    status.textContent = msg || '';
    clearTimeout(statusTimer);
    if (msg) {
      status.style.color = opts.kind === 'warn' ? 'var(--red)' :
        opts.kind === 'info' ? 'var(--text-3)' : 'var(--green)';
      statusTimer = window.setTimeout(() => { status.textContent = ''; }, 2200);
    }
  };
  let toastTimer = 0;
  const showToast = (title: string, detail = '', kind: 'ok' | 'warn' = 'ok'): void => {
    let toast = document.querySelector<HTMLElement>('[data-copy-toast]');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'copy-toast';
      toast.dataset.copyToast = 'true';
      document.body.append(toast);
    }
    toast.classList.toggle('warn', kind === 'warn');
    toast.innerHTML = `<span class="copy-toast-icon">${PG_ICONS.svgString(kind === 'warn' ? 'alert-circle' : 'circle-check', 22)}</span>
      <span class="copy-toast-text"><b>${escapeHtml(title)}</b>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}</span>`;
    toast.hidden = false;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast?.classList.remove('show');
      window.setTimeout(() => { if (toast) toast.hidden = true; }, 180);
    }, 1450);
  };
  const showCopied = (label: string, detail = ''): void => showToast(label, detail, 'ok');
  const showDownloadError = (label: string, detail: string): void => showToast(label, detail, 'warn');

  // ─── Utilities ──────────────────────────────────────────────────────────
  let fallbackIdCounter = 0;
  const secureToken = (bytes = 12): string => {
    try {
      const raw = new Uint8Array(bytes);
      globalThis.crypto.getRandomValues(raw);
      return Array.from(raw).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return `${Date.now().toString(36)}_${(++fallbackIdCounter).toString(36)}`;
    }
  };
  const msgId = (): string => {
    try { if (globalThis.crypto.randomUUID) return globalThis.crypto.randomUUID(); } catch { /* fall through */ }
    return `id_${secureToken(16)}`;
  };
  const escapeHtml = (s: string): string =>
    String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlightMatch = (text: string, q: string): string => {
    if (!q) return escapeHtml(text);
    return escapeHtml(text).replace(new RegExp(`(${escapeRe(q)})`, 'gi'), '<mark>$1</mark>');
  };
  // Walk text nodes inside `root`, wrapping case-insensitive matches of `q`
  // in <mark> elements. Doesn't touch attribute strings or inner-tag HTML so
  // it's safe to run on already-highlighted JSON output.
  const wrapSearchHitsInTextNodes = (root: HTMLElement, q: string): void => {
    if (!q) return;
    const re = new RegExp(escapeRe(q), 'gi');
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const targets: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (re.test(node.nodeValue ?? '')) targets.push(node as Text);
      re.lastIndex = 0;
    }
    for (const t of targets) {
      const value = t.nodeValue ?? '';
      const frag = document.createDocumentFragment();
      let last = 0;
      for (const m of value.matchAll(re)) {
        const i = m.index ?? 0;
        if (i > last) frag.append(value.slice(last, i));
        const mk = document.createElement('mark');
        mk.textContent = m[0];
        frag.append(mk);
        last = i + m[0].length;
      }
      if (last < value.length) frag.append(value.slice(last));
      t.replaceWith(frag);
    }
  };
  const wordCount = (s: string): number => (s.match(/\S+/g) ?? []).length;
  const tokenCount = (s: string): number => Math.ceil(s.length / 4);
  const pathOf = (u: string): string => { try { return new URL(u).pathname; } catch { return u; } };
  const hostOf = (u: string): string => { try { return new URL(u).host; } catch { return ''; } };
  // Filename-safe host slug: dots → underscores per project convention.
  // Mirrors background.ts hostSlug for symmetry across screenshot + export
  // filenames.
  const hostSlug = (url: string): string => {
    const h = hostOf(url);
    if (!h) return 'unknown';
    return h.replace(/\./g, '_').replace(/[^\w-]/g, '_').slice(0, 40) || 'unknown';
  };
  // Pick the most-frequent host across all selector captures (for export
  // filenames). When the workspace spans multiple hosts, return 'multi'.
  const dominantHostSlug = (): string => {
    const counts = new Map<string, number>();
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      const h = hostSlug(m.entry.url);
      counts.set(h, (counts.get(h) ?? 0) + 1);
    }
    if (!counts.size) return 'empty';
    let best = '';
    let bestN = 0;
    for (const [h, n] of counts) {
      if (n > bestN) { best = h; bestN = n; }
    }
    return counts.size > 1 ? 'multi' : best;
  };
  // Distinct hosts present in this workspace (alphabetical, capped). Used in
  // the export manifest's `hosts` field.
  const distinctHosts = (): string[] => {
    const set = new Set<string>();
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      const h = hostOf(m.entry.url);
      if (h) set.add(h);
    }
    return [...set].sort().slice(0, 20);
  };
  // ─── Deterministic export identity ──────────────────────────────────────
  // One clock per export: every timestamp inside a single export derives
  // from the same instant, and tests can freeze it so two exports of the
  // same content are byte-identical.
  let exportClockOverride: string | null = null;
  const exportNowIso = (): string => exportClockOverride ?? new Date().toISOString();
  // Stable content identity: SHA-256 over the slim rows plus the sorted
  // screenshot archive names. Same workspace content → same hash → same
  // filename (the background saves with conflictAction 'overwrite'), so
  // re-exporting unchanged content replaces rather than duplicates.
  const computeContentHash = async (shotNames: string[]): Promise<string> => {
    const payload = buildSlim().map((l) => JSON.stringify(l)).join('\n') + '\n' + [...shotNames].sort().join('\n');
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  };
  // Build a filename of the shape `pinchgrab-<workspace>-<host>-<stamp>.<ext>`.
  // The stamp is the export's content-hash prefix when supplied (bundle and
  // JSONL exports), falling back to the epoch for legacy callers.
  const buildExportFilename = (ext: 'jsonl' | 'md' | 'tar.zst', stamp?: string): string =>
    `pinchgrab-${activeWs}-${dominantHostSlug()}-${stamp ?? Date.now()}.${ext}`;
  // Skip-list match: substring (case-insensitive) match against the URL's
  // host. We intentionally don't use URL parsing on the patterns so the user
  // can write `wranngle.com` and have it match `app.wranngle.com` too.
  const shouldSkipScreenshot = (url: string): boolean => {
    const list = (prefs.skipScreenshotHosts ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (!list.length) return false;
    const host = hostOf(url).toLowerCase();
    return list.some((pat) => host.includes(pat));
  };

  // JSON syntax highlight (per-key color is hashed for visual variety).
  const KEY_PALETTE = ['#ff7e78', '#ffb454', '#ffe066', '#7bd97a', '#5fd1ff', '#9b8cff', '#ff85c1', '#ff5f00', '#10b981', '#f59e0b', '#a78bfa', '#34d399'];
  const colorForKey = (k: string): string => {
    let h = 0;
    for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
    return KEY_PALETTE[h % KEY_PALETTE.length]!;
  };
  const JSON_TOKEN_RE = /(\s+)|("(?:[^"\\]|\\.)*")|(true|false|null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g;
  const appendJsonHighlight = (root: HTMLElement, text: string): void => {
    root.textContent = '';
    let m: RegExpExecArray | null;
    let last = 0;
    JSON_TOKEN_RE.lastIndex = 0;
    while ((m = JSON_TOKEN_RE.exec(text)) !== null) {
      if (m.index > last) root.append(document.createTextNode(text.slice(last, m.index)));
      last = JSON_TOKEN_RE.lastIndex;
      const [, ws, str, lit, num, punct] = m;
      if (ws) { root.append(document.createTextNode(ws)); continue; }
      if (str) {
        let k = JSON_TOKEN_RE.lastIndex;
        while (k < text.length && (text[k] === ' ' || text[k] === '\t' || text[k] === '\n')) k++;
        const span = document.createElement('span');
        if (text[k] === ':') {
          let key: string;
          try { key = JSON.parse(str) as string; } catch { key = str.slice(1, -1); }
          span.className = 'k';
          span.style.color = colorForKey(key);
        } else {
          span.className = 's';
        }
        span.textContent = str;
        root.append(span);
        continue;
      }
      const span = document.createElement('span');
      if (lit) span.className = 'b';
      else if (num) span.className = 'n';
      else if (punct) span.className = 'p';
      span.textContent = lit ?? num ?? punct ?? '';
      root.append(span);
    }
    if (last < text.length) root.append(document.createTextNode(text.slice(last)));
  };

  // ─── Persistence ────────────────────────────────────────────────────────
  const loadAll = async (): Promise<void> => {
    workspaces = (await Store.get<Workspace[]>(WORKSPACES_KEY, workspaces)) || workspaces;
    if (!workspaces.length) workspaces = [{name: 'default', createdAt: new Date().toISOString()}];
    activeWs = (await Store.get<string>('pinchgrab.activeWorkspace', 'default')) || 'default';
    if (!workspaces.find((w) => w.name === activeWs)) activeWs = workspaces[0]!.name;
    prefs = {...DEFAULT_PREFS, ...(await Store.get<Partial<Prefs>>(PREFS_STORAGE_NAME, {}))};
    // Path migration: prior versions defaulted skillPath to
    // `~/.agents/skills/ui/SKILL.md`, and some users had it stored as
    // `~/.dotfiles/.agents/skills/ui/SKILL.md`. The skill was renamed
    // to `PinchGrab`; any `~/.dotfiles/` prefix is stripped from
    // exposed defaults (dotfiles is a personal config source — exports
    // shouldn't leak that path).
    const upgradePath = (p: string | undefined, fresh: string): string => {
      if (!p) return fresh;
      if (p.includes('.dotfiles')) return fresh;
      if (p.endsWith('skills/ui/SKILL.md')) return fresh;
      return p;
    };
    prefs.designPath = upgradePath(prefs.designPath, DEFAULT_PREFS.designPath);
    prefs.skillPath = upgradePath(prefs.skillPath, DEFAULT_PREFS.skillPath);
    // Content migration: previous versions stored the entire template
    // text inside `prefs.designMd` / `prefs.skillMd` as defaults. That
    // ate ~360KB of chrome.storage quota for no benefit. Detect when
    // the stored value matches one of the bundled templates and clear
    // it — the resolver falls back to the bundled file on the fly.
    // Also scrub any leaked `~/.dotfiles/` substring.
    const scrubDotfiles = (s: string): string =>
      s.replaceAll('~/.dotfiles/.agents/', '~/.agents/')
       .replaceAll('~/.dotfiles/', '~/.agents/');
    const collapseIfMatchesTemplate = async (current: string, keys: TemplateKey[]): Promise<string> => {
      if (!current || !current.trim()) return '';
      const trimmed = current.trim();
      for (const k of keys) {
        const tpl = (await loadTemplate(k)).trim();
        if (tpl && tpl === trimmed) return ''; // matches a bundled template — collapse to empty
      }
      return current.includes('.dotfiles') ? scrubDotfiles(current) : current;
    };
    prefs.designMd = await collapseIfMatchesTemplate(prefs.designMd ?? '', ['localDesign', 'designTemplate']);
    prefs.skillMd = await collapseIfMatchesTemplate(prefs.skillMd ?? '', ['localSkill', 'skillTemplate']);
    await loadWorkspace(activeWs);
  };
  const loadWorkspace = async (name: string): Promise<void> => {
    activeWs = name;
    void Store.set('pinchgrab.activeWorkspace', name);
    // Mint a new sessionId per workspace load. Same workspace re-opened
    // = new session: distinct uuid so a consumer can tell two boots
    // apart even when the captures land in the same on-disk file.
    sessionId = msgId();
    messages = (await Store.get<PanelMessage[]>(wsMsgKey(name), [])) || [];
    if (!Array.isArray(messages)) messages = [];
    // Migrate legacy entries (no uid, states-as-record, attrs.format) and
    // persist if anything changed so we don't pay the migration cost again
    // next load.
    if (migrateLoadedMessages()) void Store.set(wsMsgKey(name), messages);
    shots.clear();
    shotsFull.clear();
    pageShotsFired.clear();
    const stored = (await Store.get<Record<string, string>>(wsShotsKey(name), {})) || {};
    for (const [k, v] of Object.entries(stored)) shots.set(k, v);
    // Restore the full-resolution PNG cache so a workspace archive
    // exported AFTER a panel reload still bundles screenshots from
    // earlier captures. FIFO order is preserved by Object key order.
    const storedFull = (await Store.get<Record<string, string>>(wsShotsFullKey(name), {})) || {};
    for (const [k, v] of Object.entries(storedFull)) shotsFull.set(k, v);
    // Load this workspace's persistent snapshot history (Clear-all archives).
    await loadWsSnapshots(name);
    selectorValidity.clear();
    selectorErrors.clear();
    undoStack.length = 0;
    redoStack.length = 0;
    liveTabUrl = null;
    lastActiveSelector = null;
    insertBefore.current = null;
    insertBefore.comment = false;
    lastExport.relPath = null;
    lastExport.absPath = null;
    lastExport.copyPath = null;
    lastExport.tempPath = false;
    lastExport.kind = null;
    applyPrefsToUI();
    renderWsControls();
    updateCopyPathButton();
  };
  const persist = (): void => {
    void Store.set(wsMsgKey(activeWs), messages);
    // Push captured-selector set so the content script's hover walker can
    // resolve descendants → captured ancestor.
    const selectors = messages.filter((m): m is SelectorMessage => m.type === 'selector').map((m) => m.entry.selector);
    sendToCS({kind: 'set-captured', selectors});
  };
  const persistPrefs = (): void => {
    void Store.set(PREFS_STORAGE_NAME, prefs);
    // Push the subset of prefs the content script cares about so its
    // overlay (spacing visualizer, hover snap, etc.) reflects the latest.
    void sendToCS({
      kind: 'set-cs-prefs',
      spacingOverlay: prefs.spacingOverlay,
      hoverSnap: prefs.hoverSnap,
    });
  };
  const persistShots = (): void => {
    const obj: Record<string, string> = {};
    for (const [k, v] of shots) obj[k] = v;
    void Store.set(wsShotsKey(activeWs), obj);
  };
  // Full-resolution PNG persistence with FIFO eviction. dataURL strings
  // can run 50-500 KB each; the default quota gets exhausted in tens of
  // captures without a budget. Map insertion order = FIFO order, so
  // we evict from the front until under budget before persisting.
  const evictShotsFullToBudget = (): number => {
    let total = 0;
    for (const v of shotsFull.values()) total += v.length;
    let evicted = 0;
    while (total > SHOTS_FULL_BUDGET_BYTES) {
      const firstKey = shotsFull.keys().next().value;
      if (firstKey === undefined) break;
      const removed = shotsFull.get(firstKey);
      if (removed === undefined) break;
      shotsFull.delete(firstKey);
      total -= removed.length;
      evicted++;
    }
    return evicted;
  };
  const persistShotsFull = (): void => {
    const evicted = evictShotsFullToBudget();
    if (evicted > 0) {
      console.log(LOG, `shotsFull FIFO-evicted ${evicted} oldest entries to fit ${SHOTS_FULL_BUDGET_BYTES / 1024 / 1024}MB budget`);
    }
    const obj: Record<string, string> = {};
    for (const [k, v] of shotsFull) obj[k] = v;
    void Store.set(wsShotsFullKey(activeWs), obj);
  };
  const persistWorkspaces = (): void => { void Store.set(WORKSPACES_KEY, workspaces); };

  // ─── Tab ⇄ workspace binding (#18) ───────────────────────────────────────
  // Background announces each toolbar-click activation via 'pg-tab-activated'.
  // The first activation adopts the current unbound workspace; later tabs each
  // get their own. Picking a bound workspace jumps the browser to its tab.
  const slugForTab = (url: string, title: string): string => {
    try { const h = new URL(url).hostname.replace(/^www\./, ''); if (h) return h; } catch { /* not a url */ }
    const t = (title || '').trim();
    return t ? t.slice(0, 24) : 'tab';
  };
  const uniqueWsName = (base: string): string => {
    if (!workspaces.some((w) => w.name === base)) return base;
    for (let i = 2; ; i++) { const n = `${base} ${i}`; if (!workspaces.some((w) => w.name === n)) return n; }
  };
  const onTabActivated = async ({tabId, url, title}: {tabId: number; url: string; title: string}): Promise<void> => {
    let ws = workspaces.find((w) => w.tabId === tabId);
    if (ws) {
      if (ws.url !== url || ws.title !== title) { ws.url = url; ws.title = title; persistWorkspaces(); }
    } else {
      const current = workspaces.find((w) => w.name === activeWs);
      if (current && current.tabId == null) {
        ws = current; ws.tabId = tabId; ws.url = url; ws.title = title;
      } else {
        ws = {name: uniqueWsName(slugForTab(url, title)), createdAt: new Date().toISOString(), tabId, url, title};
        workspaces.push(ws);
      }
      persistWorkspaces();
    }
    if (activeWs !== ws.name) await loadWorkspace(ws.name);
    renderWsControls();
    render();
  };
  // Bring the browser to a workspace's bound tab when the user picks it.
  const focusWorkspaceTab = (name: string): void => {
    const ws = workspaces.find((w) => w.name === name);
    if (!inExtension || ws?.tabId == null) return;
    chrome.tabs.update(ws.tabId, {active: true}).then((t) => {
      if (t?.windowId != null) void chrome.windows?.update(t.windowId, {focused: true})?.catch?.(() => { /* ignore */ });
    }).catch(() => { /* tab was closed */ });
  };

  // ─── Snapshot / undo / redo ─────────────────────────────────────────────
  const snapshot = (): void => {
    if (suspendSnapshots) return;
    if (undoStack.length >= UNDO_CAP) undoStack.shift();
    undoStack.push(JSON.stringify(messages));
    redoStack.length = 0;
    updateUndoButtons();
  };
  const restore = (json: string): void => {
    suspendSnapshots = true;
    try { messages = JSON.parse(json) as PanelMessage[]; } catch { messages = []; }
    suspendSnapshots = false;
    persist();
    render();
  };
  const undo = (): void => {
    if (!undoStack.length) { setStatus('Nothing to undo', {kind: 'info'}); return; }
    redoStack.push(JSON.stringify(messages));
    restore(undoStack.pop()!);
    setStatus('Undone');
    updateUndoButtons();
  };
  const redo = (): void => {
    if (!redoStack.length) { setStatus('Nothing to redo', {kind: 'info'}); return; }
    undoStack.push(JSON.stringify(messages));
    restore(redoStack.pop()!);
    setStatus('Redone');
    updateUndoButtons();
  };
  const updateUndoButtons = (): void => {
    document.querySelector('[data-action="undo"]')?.classList.toggle('disabled', undoStack.length === 0);
    document.querySelector('[data-action="redo"]')?.classList.toggle('disabled', redoStack.length === 0);
  };
  const updateCopyPathButton = (): void => {
    const btn = document.querySelector<HTMLElement>('[data-action="copy-path"]');
    if (!btn) return;
    const has = Boolean(lastExport.copyPath ?? lastExport.absPath);
    btn.classList.toggle('disabled', !has);
    btn.dataset.tip = has
      ? `Copy the path of your last export.\n${lastExport.copyPath ?? lastExport.absPath ?? ''}`
      : 'Copy the path of your last export. Run an export first.';
  };
  const onCopyPath = async (): Promise<void> => {
    const pathToCopy = lastExport.copyPath ?? lastExport.absPath;
    if (!pathToCopy) {
      setStatus('No export yet — run a download first', {kind: 'warn'});
      return;
    }
    try {
      await navigator.clipboard.writeText(pathToCopy);
      // Show only the leaf filename in the status — the full Windows-style
      // absolute path would be 100+ chars and was disrupting the sidebar
      // layout for the 2-second status TTL.
      const leaf = pathToCopy.replace(/[\\/]+$/, '').split(/[\\/]/).pop() ?? pathToCopy;
      setStatus(`Copied path · ${leaf}`);
      showCopied('Copied path', leaf);
    } catch (e) {
      setStatus('Clipboard write failed: ' + String((e as Error)?.message ?? e), {kind: 'warn'});
      showDownloadError('Clipboard failed', String((e as Error)?.message ?? e));
    }
  };

  // ─── Bridge to active tab ───────────────────────────────────────────────
  const sendToCS = async (payload: PanelToCs): Promise<void> => {
    const msg = pg(payload);
    if (inExtension) {
      try {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        if (tabs[0]?.id != null) await chrome.tabs.sendMessage(tabs[0].id, msg).catch(() => { /* ignore */ });
      } catch { /* ignore */ }
    } else {
      try { window.dispatchEvent(new CustomEvent('pinchgrab:to-cs', {detail: msg})); } catch { /* ignore */ }
    }
  };
  const sendToCSAndWait = async <R>(payload: PanelToCs): Promise<R | null> => new Promise<R | null>((resolve) => {
    if (!inExtension) {
      const reqId = `req_${secureToken(12)}`;
      const onResp = (e: Event): void => {
        const detail = (e as CustomEvent).detail;
        if (detail?.__reqId === reqId) {
          window.removeEventListener('pinchgrab:cs-response', onResp);
          resolve(detail.reply);
        }
      };
      window.addEventListener('pinchgrab:cs-response', onResp);
      window.dispatchEvent(new CustomEvent('pinchgrab:to-cs', {detail: {__reqId: reqId, ...pg(payload)}}));
      setTimeout(() => { window.removeEventListener('pinchgrab:cs-response', onResp); resolve(null); }, 1000);
      return;
    }
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0]?.id) { resolve(null); return; }
      chrome.tabs.sendMessage(tabs[0].id, pg(payload), (r: R) => resolve(r));
    });
  });
  const sendToBg = async <R>(payload: PanelToBg): Promise<R | null> => {
    if (!inExtension) return null;
    try { return (await chrome.runtime.sendMessage(pg(payload))) as R; }
    catch (e) { return {error: String((e as Error)?.message ?? e)} as unknown as R; }
  };

  // ─── Receiving from content script ──────────────────────────────────────
  // Defensive ring-buffer dedupe: even though we now use only one channel,
  // any message that somehow arrives twice within ~2 seconds is ignored.
  const recentMids: string[] = [];
  const RECENT_MID_CAP = 64;
  const onCsMessage = (msg: PgEnvelope<CsToPanel>): void => {
    if (!msg || msg.__pg !== true) return;
    if (msg.__mid) {
      if (recentMids.includes(msg.__mid)) return;
      recentMids.push(msg.__mid);
      if (recentMids.length > RECENT_MID_CAP) recentMids.shift();
    }
    if ((msg as {kind?: string}).kind === 'pg-tab-activated') {
      void onTabActivated(msg as unknown as {tabId: number; url: string; title: string});
      return;
    }
    switch (msg.kind) {
      case 'capture': onCapture(msg); return;
      case 'hover': onHover(msg as Extract<CsToPanel, {kind: 'hover'}>); return;
      case 'hover-end': onHoverEnd(); return;
      case 'pending-add': onPendingAdd(msg); return;
      case 'pending-clear': onPendingClear(); return;
      case 'feedback-add': onFeedbackAdd(msg); return;
      case 'preference-change': onPreferenceChange(msg as Extract<CsToPanel, {kind: 'preference-change'}>); return;
      case 'page-snapshot': onPageSnapshot((msg as Extract<CsToPanel, {kind: 'page-snapshot'}>).payload); return;
      default: return;
    }
  };

  const onPreferenceChange = ({reason, page}: {reason: string; page: any}): void => {
    liveTabUrl = page?.url ?? liveTabUrl;
    liveTabPath = liveTabUrl ? pathOf(liveTabUrl) : liveTabPath;
    // Page rows are capture headers, not a tab/page telemetry feed. The next
    // selector capture from this page will carry the new viewport/state and
    // insert a page header only if needed.
    setStatus(`${reason} changed`, {kind: 'info'});
  };

  // Page-group records may carry a full-page snapshot (viewport, scroll
  // extents, dpr, lang, full-page screenshot). PageMessage in types.ts doesn't
  // yet declare the field, so we widen it locally — the value persists with
  // the rest of the message JSON and round-trips through export.
  type PageMessageWithSnapshot = PageMessage & {snapshot?: PageSnapshot};
  // Snapshots that arrived before a page-group record exists for their URL.
  // Applied when the page header is later created (see onCapture).
  const pendingSnapshots = new Map<string, PageSnapshot>();
  const applySnapshotToPage = (snap: PageSnapshot): boolean => {
    // Attach to the most recent page-group record for this URL.
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m?.type === 'page' && m.url === snap.url) {
        (m as PageMessageWithSnapshot).snapshot = snap;
        return true;
      }
    }
    return false;
  };
  const onPageSnapshot = (payload: PageSnapshot): void => {
    if (!payload?.url) return;
    if (applySnapshotToPage(payload)) {
      persist();
      render();
    } else {
      // No page record yet — stash for the next capture on this URL.
      pendingSnapshots.set(payload.url, payload);
    }
  };

  const onFeedbackAdd = ({selector, text, url, parentUid}: {selector: string; text: string; url?: string; parentUid?: string}): void => {
    if (!text) return;
    // Resolve the parent in priority order:
    //   1. parentUid — the content script supplied a stable uid (the
    //      strongest match; survives selector changes, sibling
    //      collisions, multiple captures of the same element).
    //   2. selector + url — composite key; prevents cross-page
    //      contamination when the same selector exists on multiple URLs.
    //   3. selector + liveTabUrl — fallback when the message didn't
    //      carry an explicit url (older content-script messages).
    let idx = -1;
    if (parentUid) {
      idx = messages.findIndex((m) => m.type === 'selector' && m.entry.uid === parentUid);
    }
    if (idx < 0) {
      const wantUrl = url ?? liveTabUrl ?? null;
      idx = messages.findIndex((m) =>
        m.type === 'selector'
        && m.entry.selector === selector
        && (!wantUrl || m.entry.url === wantUrl));
    }
    if (idx < 0) {
      console.warn(LOG, 'onFeedbackAdd: no parent found', {selector, url, parentUid});
      setStatus('Comment lost its parent — check the active capture', {kind: 'warn'});
      return;
    }
    snapshot();
    const parentMsg = messages[idx] as SelectorMessage;
    let insertAt = idx + 1;
    while (insertAt < messages.length && messages[insertAt]?.type === 'feedback') insertAt++;
    // Stamp parentUid on the new feedback row so the export carries
    // the FK link explicitly (not just by capture-adjacency).
    messages.splice(insertAt, 0, {
      type: 'feedback', id: msgId(), ts: new Date().toISOString(), text,
      parentUid: parentMsg.entry.uid,
    });
    persist();
    render();
    setStatus('Comment added from page');
    // Every feedback parent should have a screenshot. If the parent
    // capture didn't get one (autoScreenshot off, skipScreenshotHosts
    // hit, network glitch), re-fire now.
    if (!parentMsg.entry.screenshot?.element) {
      void fireElementShot(parentMsg);
    }
  };

  const onPendingAdd = ({entry}: {entry: Entry}): void => { pendingMulti.push(entry); render(); };
  const onPendingClear = (): void => { pendingMulti = []; render(); };

  const findDuplicate = (selector: string, url: string): SelectorMessage | undefined =>
    messages.find((m): m is SelectorMessage =>
      m.type === 'selector' && m.entry.selector === selector && (!url || m.entry.url === url));

  // Find an existing capture for the active tab + selector. Cross-page
  // contamination prevention (see types.ts feedback-add docstring):
  // a selector alone is NOT a stable identity — `[data-testid="forecast-item"]`
  // exists on every page; `button` is everywhere. Strong identity is
  // (selector + url). Returns the most recent match so re-hovering an
  // already-captured element resolves consistently.
  const findCaptureForCurrentPage = (selector: string): SelectorMessage | undefined => {
    const url = liveTabUrl;
    // Walk backwards so the most recent matching capture wins when a
    // selector legitimately has multiple captures on the same page
    // (e.g., the user re-captured the same element after edits).
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m?.type !== 'selector') continue;
      if (m.entry.selector !== selector) continue;
      if (url && m.entry.url !== url) continue;
      return m;
    }
    return undefined;
  };

  const canonicalEntry = (e: Entry): string => JSON.stringify({
    tag: e.tag, selector: e.selector, text: e.text, role: e.role,
    attrs: e.attrs, classes: e.classes,
    rect: e.rect, outerHTML: e.outerHTML,
    styles: e.styles, matchedRules: e.matchedRules,
  });

  const onCapture = ({entry, page, grouped}: Extract<CsToPanel, {kind: 'capture'}>): void => {
    if (!entry || !page) return;
    snapshot();
    liveTabUrl = page.url;
    liveTabPath = pathOf(page.url);
    if (grouped) {
      for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (m?.type === 'selector') {
          const group = m.entry.group ?? [];
          group.push(entry);
          m.entry.group = group;
          persist(); render(); composer.focus();
          // Fire a group shot using the head + members. The head's selector
          // is m.entry.selector; members' selectors are in the freshly
          // mutated group array.
          const selectors = [m.entry.selector, ...(m.entry.group ?? []).map((g) => g.selector)];
          void fireGroupShot(m, selectors);
          return;
        }
      }
    }
    // Dupe detection. Cross-contamination fix: a (selector, url) match
    // is NECESSARY but not SUFFICIENT — two sibling elements with the
    // same testId / same role/aria selector live on the same URL but
    // are different captures. Compare the canonical-entry hash (which
    // includes rect, text, outerHTML, etc.) before treating the new
    // capture as a refresh of the old one. When the hash differs, we
    // keep BOTH captures rather than overwriting.
    const dupe = findDuplicate(entry.selector, entry.url);
    if (dupe) {
      const before = canonicalEntry(dupe.entry);
      const after = canonicalEntry(entry);
      if (before === after) {
        composer.focus();
        return;
      }
      // Hashes differ. Two cases:
      //   (a) Same element re-captured after content change — the rect
      //       stays put (within a few px), but text/outerHTML moved.
      //       Treat as a refresh.
      //   (b) Different element that happens to share a selector — the
      //       rect is in a different position. Treat as a new capture.
      // We discriminate by rect overlap: if both rects exist and their
      // centers are within 8px on both axes, refresh; otherwise keep
      // both.
      const r1 = dupe.entry.rect;
      const r2 = entry.rect;
      const sameElement = r1 && r2
        && Math.abs((r1.x + r1.w / 2) - (r2.x + r2.w / 2)) <= 8
        && Math.abs((r1.y + r1.h / 2) - (r2.y + r2.h / 2)) <= 8;
      if (sameElement) {
        delete dupe.dupePending;
        dupe.entry = entry;
        persist(); render();
        setStatus(`Updated #${dupe.entry.n}`, {kind: 'info'});
        composer.focus();
        return;
      }
      // Different element with the same selector → fall through and
      // emit as a new capture. The agent reading the export sees both
      // rows with the same selector but different uids + rects.
    }
    let position = messages.length;
    if (insertBefore.current) {
      position = messages.findIndex((m) => m.id === insertBefore.current);
      if (position < 0) position = messages.length;
      insertBefore.current = null;
      insertBefore.comment = false;
    }
    // Stamp the session FK so the consumer can join entries to their
    // session header without URL-string compare.
    if (sessionId) entry.sessionId = sessionId;
    const newMsg: SelectorMessage = {type: 'selector', id: msgId(), ts: entry.ts, entry};
    // Page rows exist only as headers for captured selectors. Do not create
    // them from tab activation, validation, or preference changes; insert one
    // immediately before the first selector of a new page block.
    let previousPage: PageMessage | null = null;
    for (let i = position - 1; i >= 0; i--) {
      const m = messages[i];
      if (m?.type === 'page') { previousPage = m; break; }
      if (m?.type === 'selector') break;
    }
    if (!previousPage || previousPage.url !== page.url) {
      const pageMsg: PageMessage = {
        type: 'page', id: msgId(), ts: new Date().toISOString(),
        url: page.url, title: page.title, viewport: page.viewport, tokens: page.tokens,
        userAgent: page.userAgent, lang: page.lang,
        gitContext: (page as any).gitContext,
        route: (page as any).route,
        state: (page as any).state,
        sessionId,
      };
      // Attach any page-snapshot that arrived before this page header existed.
      const pending = pendingSnapshots.get(page.url);
      if (pending) {
        (pageMsg as PageMessageWithSnapshot).snapshot = pending;
        pendingSnapshots.delete(page.url);
      }
      messages.splice(position, 0, pageMsg);
      position++;
    }
    messages.splice(position, 0, newMsg);
    persist();
    // Intentionally NO setLastActive(entry.selector) here — the user asked
    // for fresh captures to stay un-highlighted in the sidebar. The sticky
    // ring + last-active outline now only get applied on explicit
    // hover/click of the sidebar bubble (and the page-side flash from
    // captureEntry still confirms the capture visually on the page).
    render();
    composer.focus();
    void fireElementShot(newMsg);
    void firePageShotIfNeeded(newMsg);
    void runValidation();
  };

  // ─── Screenshot wiring ───────────────────────────────────────────────────
  // Fire the per-element shot, attach the returned filename + dataUrl onto
  // the entry, and persist. shouldSkipScreenshot bails on hosts in the
  // user's skip list; autoScreenshot=false bails globally.
  const fireElementShot = async (msg: SelectorMessage): Promise<void> => {
    if (!prefs.autoScreenshot) {
      console.log(LOG, 'fireElementShot skipped: autoScreenshot=false');
      // Bug #2: tell the export why the shot is missing.
      msg.entry.screenshot = {...(msg.entry.screenshot ?? {}), unavailableReason: 'autoScreenshotOff'};
      // Re-render so the reserved skeleton (which assumed a shot was coming)
      // collapses now that we know one won't arrive.
      render();
      return;
    }
    if (shouldSkipScreenshot(msg.entry.url)) {
      console.log(LOG, 'fireElementShot skipped: host on skip list', msg.entry.url);
      msg.entry.screenshot = {...(msg.entry.screenshot ?? {}), unavailableReason: 'skipScreenshotHosts'};
      render();
      return;
    }
    console.log(LOG, 'fireElementShot →', msg.entry.selector);
    // SW cold-start race: the FIRST capture in a session often loses its
    // first message because the bg worker is still starting. Retry once
    // after a short delay if the first call comes back null/empty.
    let reply = await sendToBg<ShotReply>({
      kind: 'shot-element', selector: msg.entry.selector, n: msg.entry.n, workspace: activeWs,
    });
    if (!reply || (!reply.ok && !reply.error)) {
      console.log(LOG, 'first screenshot reply was empty; retrying after 200ms (SW cold-start)');
      await new Promise((r) => setTimeout(r, 200));
      reply = await sendToBg<ShotReply>({
        kind: 'shot-element', selector: msg.entry.selector, n: msg.entry.n, workspace: activeWs,
      });
    }
    console.log(LOG, 'fireElementShot reply:', reply);
    if (!reply?.ok || !reply.filename) {
      setStatus(`Screenshot failed: ${reply?.error ?? 'no reply from background'}`, {kind: 'warn'});
      msg.entry.screenshot = {
        ...(msg.entry.screenshot ?? {}),
        unavailableReason: reply?.error ?? 'captureFailed',
      };
      // Collapse the reserved skeleton — no shot is coming for this capture.
      render();
      return;
    }
    // Successful retry — strip any prior unavailableReason since we now
    // have a real shot.
    delete msg.entry.screenshot?.unavailableReason;
    msg.entry.screenshot = {
      ...(msg.entry.screenshot ?? {}),
      element: reply.filename,
      capturedAt: new Date().toISOString(),
      ...(reply.crop ? {crop: reply.crop} : {}),
    };
    if (reply.dataUrl) {
      shots.set(msg.entry.selector, reply.dataUrl);
      persistShots();
    }
    if (reply.fullDataUrl) {
      shotsFull.set(msg.entry.selector, reply.fullDataUrl);
      persistShotsFull();
    }
    persist();
    render();
  };

  // Fire the group shot (union bbox of head + all members) and stash the
  // filename on the head-of-group entry.
  const fireGroupShot = async (head: SelectorMessage, selectors: string[]): Promise<void> => {
    if (!prefs.autoScreenshot) return;
    if (shouldSkipScreenshot(head.entry.url)) return;
    const reply = await sendToBg<ShotReply>({
      kind: 'shot-group', selectors, n: head.entry.n, workspace: activeWs,
    });
    if (!reply?.ok || !reply.filename) return;
    head.entry.screenshot = {
      ...(head.entry.screenshot ?? {}),
      group: reply.filename,
      capturedAt: new Date().toISOString(),
    };
    if (reply.dataUrl) {
      shots.set(head.entry.selector, reply.dataUrl);
      if (reply.fullDataUrl) { shotsFull.set(head.entry.selector, reply.fullDataUrl); persistShotsFull(); }
      persistShots();
    }
    persist();
    render();
  };

  // Page-level shot once per (workspace, page-url, day). Subsequent captures
  // on the same page reuse the same on-disk file path.
  const firePageShotIfNeeded = async (msg: SelectorMessage): Promise<void> => {
    if (!prefs.autoScreenshot) return;
    if (shouldSkipScreenshot(msg.entry.url)) return;
    // Per-capture page-shot mode (§4.5): when enabled, skip the
    // per-(workspace, url) dedupe and fire a fresh page shot every time.
    // Useful when the page state changes between captures (modal opens,
    // multi-step flow, etc.) and the user wants to see the whole page at
    // each step. Costs one full-page PNG per capture, so default off.
    if (!prefs.pageShotPerCapture) {
      const key = pageShotKey(msg.entry.url);
      if (pageShotsFired.has(key)) {
        const existing = findExistingPageShot(msg.entry.url);
        if (existing) {
          msg.entry.screenshot = {
            ...(msg.entry.screenshot ?? {}),
            page: existing,
          };
          persist();
          render();
        }
        return;
      }
      pageShotsFired.add(key);
    }
    const reply = await sendToBg<ShotReply>({
      kind: 'shot-page', n: msg.entry.n, workspace: activeWs,
    });
    if (!reply?.ok || !reply.filename) return;
    // Apply to THIS entry and to any other entries already captured on the
    // same URL today (so the page-shot appears uniformly).
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      if (m.entry.url !== msg.entry.url) continue;
      m.entry.screenshot = {
        ...(m.entry.screenshot ?? {}),
        page: reply.filename,
      };
    }
    // Stash the full PNG so the workspace archive can bundle it. Keyed
    // by URL since page shots are page-scoped, not selector-scoped.
    if (reply.fullDataUrl) {
      shotsFull.set('page::' + msg.entry.url, reply.fullDataUrl);
      persistShotsFull();
    }
    persist();
    render();
  };

  // Find any selector entry on this URL that already has a `page` shot
  // recorded — used so that retroactive captures inherit the existing PNG
  // path instead of refiring.
  const findExistingPageShot = (url: string): string | null => {
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      if (m.entry.url !== url) continue;
      if (m.entry.screenshot?.page) return m.entry.screenshot.page;
    }
    return null;
  };

  const onHover = ({selector, label, tag, rect}: Extract<CsToPanel, {kind: 'hover'}>): void => {
    setStatus(`Alt-hover · ${label}`, {kind: 'info'});
    // Identity is (selector, url). Same selector on two different URLs
    // is two different captures; the previous selector-only lookup
    // caused cross-page comment contamination. Prefer same-URL +
    // same-selector as the strongest match.
    const existing = findCaptureForCurrentPage(selector);
    if (existing) {
      if (prefs.autoScrollToHovered) scrollMessageIntoView(existing.id);
      const feedback = collectFeedbackAfter(existing.id);
      void sendToCS({kind: 'annotation', selector, payload: {uid: existing.entry.uid, n: existing.entry.n, captured: true, feedback}});
      if (phantomTarget) { phantomTarget = null; render(); }
    } else {
      // ALWAYS show the comment box, even for uncaptured elements. On submit
      // the content script will capture the element first, then attach the
      // comment — turning hover-comment into a capture+comment shortcut.
      phantomTarget = {selector, label, tag, rect: rect as unknown as DOMRect};
      void sendToCS({kind: 'annotation', selector, payload: {captured: false, feedback: []}});
      renderPhantom();
    }
  };
  const onHoverEnd = (): void => {
    if (status.textContent?.startsWith('Alt-hover')) status.textContent = '';
    if (phantomTarget) { phantomTarget = null; renderPhantom(); }
    // No annotation-clear here — the content script keeps the box open so the
    // user can mouse to it and type. Outside-click / Esc dismiss it.
  };

  const collectFeedbackAfter = (selectorId: string): string[] => {
    const out: string[] = [];
    let found = false;
    for (const m of messages) {
      if (!found) { if (m.id === selectorId) found = true; continue; }
      if (m.type === 'selector' || m.type === 'page') break;
      if (m.type === 'feedback') out.push(m.text);
    }
    return out;
  };

  const centerElementInList = (el: HTMLElement): void => {
    const listRect = list.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const target = list.scrollTop + elRect.top - listRect.top - (list.clientHeight / 2) + (elRect.height / 2);
    list.scrollTo({top: Math.max(0, target), behavior: 'smooth'});
  };

  const scrollMessageIntoView = (id: string): void => {
    const el = list.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (!el) return;
    centerElementInList(el);
    el.classList.remove('flash-into-view');
    void el.offsetWidth;
    el.classList.add('flash-into-view');
  };

  // ─── Sticky highlight management ────────────────────────────────────────
  const setLastActive = (selector: string | null): void => {
    lastActiveSelector = selector;
    clearTimeout(stickyTimer);
    if (selector) {
      void sendToCS({kind: 'scroll-to', selector, sticky: true});
      armStickyExpiry();
    } else {
      void sendToCS({kind: 'sticky-clear'});
    }
  };
  const armStickyExpiry = (): void => {
    clearTimeout(stickyTimer);
    stickyTimer = window.setTimeout(() => {
      if (!panelHovered) {
        void sendToCS({kind: 'sticky-clear'});
        lastActiveSelector = null;
        for (const el of list.querySelectorAll('.msg.selector.last-active')) el.classList.remove('last-active');
      } else armStickyExpiry();
    }, STICKY_TTL_MS);
  };

  // Fast sticky-clear: when the user's cursor leaves the panel, fire
  // sticky-clear after a 300 ms grace window. Prior behavior waited the
  // full STICKY_TTL_MS (~5 s) which felt like the page-side highlight
  // "doesn't go away even after I unhover". 300 ms is short enough to
  // feel responsive but long enough that a quick reposition (e.g.
  // accidentally crossing the seam) doesn't kill the ring mid-flight.
  let stickyClearGrace = 0;
  list.addEventListener('mouseenter', () => {
    panelHovered = true;
    if (stickyClearGrace) { clearTimeout(stickyClearGrace); stickyClearGrace = 0; }
    armStickyExpiry();
  });
  list.addEventListener('mouseleave', () => {
    panelHovered = false;
    if (stickyClearGrace) clearTimeout(stickyClearGrace);
    stickyClearGrace = window.setTimeout(() => {
      void sendToCS({kind: 'sticky-clear'});
      // Also drop our own from-panel + multi rings in case they leaked.
      void sendToCS({kind: 'outline-clear'});
      stickyClearGrace = 0;
    }, 300);
  });
  document.body.addEventListener('mouseenter', () => {
    // When the user moves their mouse into the panel, suppress page-side
    // alt-hover state so the orange ring doesn't keep following the cursor.
    void sendToCS({kind: 'alt-state', on: false});
  });

  // ─── Rendering ──────────────────────────────────────────────────────────
  const NEAR_BOTTOM_PX = 80;
  const wasNearBottom = (): boolean =>
    list.scrollHeight - list.scrollTop - list.clientHeight <= NEAR_BOTTOM_PX;

  const matchesSearch = (m: PanelMessage): boolean => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (m.type === 'feedback') return m.text.toLowerCase().includes(q);
    if (m.type === 'selector') {
      const e = m.entry;
      // Match against the WHOLE entry (selector, text, classes, attrs,
      // outerHTML, styles, etc.) so search hits anything visible in the
      // body-json. Stringifying once is fine — the cost is tiny vs render.
      return JSON.stringify(e).toLowerCase().includes(q);
    }
    if (m.type === 'page') return (m.url + ' ' + (m.title ?? '')).toLowerCase().includes(q);
    return true;
  };
  // True when the bubble's body-json (or outerHTML) contains the search —
  // tells renderSelector to auto-expand so the user sees the highlighted hit.
  const bodyMatchesSearch = (m: SelectorMessage): boolean => {
    if (!searchQuery) return false;
    const q = searchQuery.toLowerCase();
    return JSON.stringify(m.entry).toLowerCase().includes(q);
  };

  const insertRail = (beforeId: string): HTMLDivElement => {
    const div = document.createElement('div');
    div.className = 'insert-rail';
    div.dataset.beforeId = beforeId;
    if (insertBefore.current === beforeId) {
      div.classList.add('expanded');
      div.append(buildInlineComment({
        onCancel: () => { insertBefore.current = null; insertBefore.comment = false; render(); },
        onSubmit: (text) => sendInline(text),
        autofocus: true,
      }));
    } else {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'add-btn';
      btn.dataset.tip = 'Insert capture or comment here';
      btn.setAttribute('aria-label', 'Insert capture or comment here');
      btn.innerHTML = PG_ICONS.svgString('plus', 12);
      btn.addEventListener('click', () => { insertBefore.current = beforeId; insertBefore.comment = true; render(); });
      div.append(btn);
    }
    return div;
  };

  type InlineCommentOpts = {
    initial?: string;
    onCancel?: () => void;
    onSubmit?: (text: string) => void;
    autofocus?: boolean;
  };
  const buildInlineComment = ({initial = '', onCancel, onSubmit, autofocus}: InlineCommentOpts): HTMLDivElement => {
    const wrap = document.createElement('div');
    wrap.className = 'inline-comment';
    const ta = document.createElement('textarea');
    ta.value = initial;
    ta.rows = 2;
    ta.placeholder = 'Insert a comment here, or Alt+Click to insert a capture';
    const row = document.createElement('div');
    row.className = 'row';
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = '0w · 0t';
    // Both Save / Cancel are uniform icon buttons (.iconbtn). Save uses the
    // primary accent variant via .primary so it still pops, but its width
    // matches Cancel exactly.
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'iconbtn';
    cancel.dataset.tip = 'Cancel · Esc';
    cancel.setAttribute('aria-label', 'Cancel inline comment');
    cancel.innerHTML = PG_ICONS.svgString('x', 20);
    cancel.addEventListener('click', () => onCancel?.());
    const send = document.createElement('button');
    send.type = 'button';
    send.className = 'iconbtn primary';
    send.dataset.tip = 'Save · Enter';
    send.setAttribute('aria-label', 'Save inline comment');
    send.innerHTML = PG_ICONS.svgString('check', 20);
    const submit = (): void => onSubmit?.(ta.value);
    send.addEventListener('click', submit);
    ta.addEventListener('input', () => { meta.textContent = `${wordCount(ta.value)}w · ${tokenCount(ta.value)}t`; });
    ta.addEventListener('keydown', (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      if (e.key === 'Escape') onCancel?.();
    });
    row.append(meta, cancel, send);
    wrap.append(ta, row);
    if (autofocus) requestAnimationFrame(() => ta.focus());
    return wrap;
  };

  const sendInline = (text: string): void => {
    text = (text ?? '').trim();
    if (!text) { insertBefore.current = null; render(); return; }
    snapshot();
    const beforeId = insertBefore.current;
    insertBefore.current = null;
    insertBefore.comment = false;
    let pos = beforeId ? messages.findIndex((m) => m.id === beforeId) : messages.length;
    if (pos < 0) pos = messages.length;
    // parentUid resolution: walk back from the insert position to the
    // nearest preceding selector. Single source of truth for the FK.
    let pIdx = pos - 1;
    while (pIdx >= 0 && messages[pIdx]?.type === 'feedback') pIdx--;
    const parent = pIdx >= 0 ? messages[pIdx] : undefined;
    const parentUid = parent && parent.type === 'selector' ? parent.entry.uid : undefined;
    const fb: FeedbackMessage = {
      type: 'feedback', id: msgId(), ts: new Date().toISOString(), text,
      ...(parentUid ? {parentUid} : {}),
    };
    messages.splice(pos, 0, fb);
    persist();
    render();
    setStatus('Inserted');
  };

  const renderPhantom = (): void => {
    list.querySelector('.phantom')?.remove();
    if (!phantomTarget) return;
    const ph = document.createElement('div');
    ph.className = 'phantom visible';
    ph.innerHTML = `<code>${escapeHtml(phantomTarget.label)}</code>`;
    list.append(ph);
    requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  };

  // Reorder a flat message list so selectors within each page-delimited
  // block are sorted by their visual rect (top→bottom, left→right).
  // Feedback rows stay attached to their preceding selector (capture
  // adjacency) so editing/threading behavior survives the sort.
  //
  // Used ONLY by the export pipeline (`buildSlim`), not the sidebar
  // render. The sidebar keeps messages in insertion/capture order so
  // the user sees them where they expect; the export gets the agent-
  // friendly reading-order treatment.
  const reorderForExport = (msgs: PanelMessage[]): PanelMessage[] => {
    type Group = {kind: 'group'; sel: SelectorMessage; trailing: FeedbackMessage[]};
    type Loose = {kind: 'loose'; m: FeedbackMessage};
    type Slot = Group | Loose | {kind: 'page'; m: PageMessage};
    const slots: Slot[] = [];
    let curGroup: Group | null = null;
    const flushGroup = (): void => {
      if (curGroup) { slots.push(curGroup); curGroup = null; }
    };
    for (const m of msgs) {
      if (m.type === 'page') {
        flushGroup();
        slots.push({kind: 'page', m});
      } else if (m.type === 'selector') {
        flushGroup();
        curGroup = {kind: 'group', sel: m, trailing: []};
      } else {
        // Detached comments never travel with the preceding selector's
        // group — they stay loose in export order.
        if (curGroup && !m.detached) curGroup.trailing.push(m);
        else slots.push({kind: 'loose', m});
      }
    }
    flushGroup();
    const out: PanelMessage[] = [];
    let runStart = 0;
    const flushRun = (end: number): void => {
      const indices: number[] = [];
      const groupRects: Array<{idx: number; y: number; x: number}> = [];
      for (let i = runStart; i < end; i++) {
        const s = slots[i]!;
        if (s.kind === 'group') {
          const r = s.sel.entry.rect;
          groupRects.push({idx: i, y: r?.y ?? Number.POSITIVE_INFINITY, x: r?.x ?? Number.POSITIVE_INFINITY});
        }
        indices.push(i);
      }
      groupRects.sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });
      let gi = 0;
      for (const i of indices) {
        const s = slots[i]!;
        if (s.kind === 'group') {
          const replacementIdx = groupRects[gi++]!.idx;
          const r = slots[replacementIdx]! as Group;
          out.push(r.sel);
          for (const f of r.trailing) out.push(f);
        } else if (s.kind === 'loose') {
          out.push(s.m);
        }
      }
    };
    for (let i = 0; i < slots.length; i++) {
      if (slots[i]!.kind === 'page') {
        flushRun(i);
        out.push((slots[i] as {kind: 'page'; m: PageMessage}).m);
        runStart = i + 1;
      }
    }
    flushRun(slots.length);
    return out;
  };

  const render = (): void => {
    const stickToBottom = list.children.length === 0 || wasNearBottom();
    list.innerHTML = '';

    // Stats numbers
    let totalSelectors = 0;
    let totalComments = 0;
    let totalStale = 0;
    const distinctPages = new Set<string>();
    for (const m of messages) {
      if (m.type === 'selector') {
        totalSelectors++;
        if (selectorValidity.get(m.entry.selector) === false) totalStale++;
      } else if (m.type === 'feedback') totalComments++;
      else if (m.type === 'page') {
        if (messages.some((x) => x.type === 'selector' && x.entry.url === m.url)) distinctPages.add(m.url);
      }
    }
    statsEl.querySelector<HTMLElement>('[data-stat="selectors"] .stat-num')!.textContent = String(totalSelectors);
    statsEl.querySelector<HTMLElement>('[data-stat="comments"] .stat-num')!.textContent = String(totalComments);
    const staleNum = statsEl.querySelector<HTMLElement>('[data-stat="stale"] .stat-num')!;
    staleNum.textContent = String(totalStale);
    staleNum.dataset.zero = totalStale === 0 ? 'true' : 'false';
    statsEl.querySelector<HTMLElement>('[data-stat="pages"] .stat-num')!.textContent = String(distinctPages.size);
    const exportText = buildJsonl();
    statTokens.textContent = exportText ? String(tokenCount(exportText)) : '0';
    statWords.textContent = exportText ? String(wordCount(exportText)) : '0';

    // Minify reduction stats
    let fullT = 0, curT = 0, fullW = 0, curW = 0, pct = 0;
    if (exportText) {
      const wasMin = prefs.minify;
      prefs.minify = true; const minText = buildJsonl();
      prefs.minify = false; const fullText = buildJsonl();
      prefs.minify = wasMin;
      fullT = tokenCount(fullText); curT = tokenCount(minText);
      fullW = wordCount(fullText); curW = wordCount(minText);
      pct = fullT > 0 ? Math.round((1 - curT / fullT) * 100) : 0;
    }
    const minifyStatsEl = document.querySelector<HTMLElement>('[data-minify-stats]');
    if (minifyStatsEl) {
      if (prefs.minify && exportText) {
        minifyStatsEl.textContent = `${fullT.toLocaleString()} → ${curT.toLocaleString()} tokens · ${fullW.toLocaleString()} → ${curW.toLocaleString()} words · ${pct}% reduction`;
      } else if (exportText) {
        minifyStatsEl.textContent = `Would save ${(fullT - curT).toLocaleString()} tokens · ${pct}% if enabled`;
      } else minifyStatsEl.textContent = '';
    }

    // Per-checkbox contribution stats: how many tokens/words each toggle
    // adds to the current export. Computed by toggling that single pref
    // and diffing the export — gives an honest answer that reflects the
    // current minify state and the rest of the toggles.
    const contribKeys: Array<keyof Prefs> = ['includeOuterHTML', 'includeMatchedRules', 'includeStyles'];
    if (exportText && messages.length) {
      const baseT = tokenCount(exportText);
      const baseW = wordCount(exportText);
      for (const key of contribKeys) {
        const el = document.querySelector<HTMLElement>(`[data-contrib="${key}"]`);
        if (!el) continue;
        const wasOn = prefs[key] as boolean;
        (prefs as any)[key] = !wasOn;
        const altText = buildJsonl();
        (prefs as any)[key] = wasOn;
        const altT = tokenCount(altText);
        const altW = wordCount(altText);
        // wasOn=true → currently included; cost = base - alt (turning OFF saves this).
        // wasOn=false → currently excluded; gain = alt - base (turning ON adds this).
        const dT = wasOn ? baseT - altT : altT - baseT;
        const dW = wasOn ? baseW - altW : altW - baseW;
        const sign = wasOn ? '' : '+';
        el.textContent = wasOn
          ? `· ${dT.toLocaleString()} t · ${dW.toLocaleString()} w in export${prefs.minify ? ' (minified)' : ''}`
          : `· ${sign}${dT.toLocaleString()} t · ${sign}${dW.toLocaleString()} w if enabled`;
      }
    } else {
      for (const key of contribKeys) {
        const el = document.querySelector<HTMLElement>(`[data-contrib="${key}"]`);
        if (el) el.textContent = '';
      }
    }

    // Toolbar export stats
    document.querySelectorAll<HTMLElement>('.stat.export-stats').forEach((s, i) => {
      const num = s.querySelector<HTMLElement>('.stat-num');
      const lab = s.querySelector<HTMLElement>('.stat-label');
      if (num) num.textContent = num.textContent!.replace(/\*$/, '');
      if (lab) lab.textContent = lab.textContent!.replace(/^\*/, '');
      if (prefs.minify && num) num.textContent = num.textContent + '*';
      const isToken = i === 0;
      const fullV = isToken ? fullT : fullW;
      const curV = isToken ? curT : curW;
      const which = isToken ? 'tokens' : 'words';
      s.dataset.tip = prefs.minify
        ? `MINIFIED · ${curV.toLocaleString()} ${which}\nFull would be ${fullV.toLocaleString()} · saves ${pct}%`
        : `${fullV.toLocaleString()} ${which} · full export\nMinified would be ${curV.toLocaleString()} · saves ${pct}%`;
    });

    if (messages.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.innerHTML = `<div class="empty-icon">🤏</div>
        <div class="empty-title">Start with the page you want to critique.</div>
        <div class="empty-body">Open a page, then capture an element. Comments stay paired with the thing you grabbed.</div>
        <div class="empty-keys">Alt+Click to capture</div>`;
      list.append(empty);
      if (pendingMulti.length) renderPendingBay();
      return;
    }

    const selectorUrls = new Set(messages.filter((m): m is SelectorMessage => m.type === 'selector').map((m) => m.entry.url));
    const visibleMessages = messages.filter((m) => m.type !== 'page' || selectorUrls.has(m.url));
    const pinned = visibleMessages.filter((m): m is SelectorMessage => m.type === 'selector' && Boolean(m.pinned));
    const unpinned = visibleMessages.filter((m) => !pinned.includes(m as SelectorMessage));
    // Sidebar shows captures in INSERTION order (most recent at the
    // bottom). Visual-position reordering happens ONLY at export time
    // so the sidebar stays predictable while the agent-facing export
    // gets reading-order convenience. (Prior implementation sorted in
    // both places; user feedback was that sidebar shuffling was
    // disorienting.)
    const ordered = [...pinned, ...unpinned];

    list.append(insertRail(messages[0]!.id));
    let lastSelectorSel: string | null = null;
    // Track the URL of the most recently rendered page divider so we can
    // suppress a repeated header when consecutive captures share the same
    // page. Restating the URL above every capture in a same-URL run is
    // noise — the divider only earns its space when the URL actually
    // changes from the previous capture in sequence.
    let lastRenderedPageUrl: string | null = null;
    let renderedAny = false;
    for (let i = 0; i < ordered.length; i++) {
      const m = ordered[i]!;
      if (!matchesSearch(m)) continue;
      // Collapse consecutive same-URL page dividers into the first one.
      if (m.type === 'page') {
        if (m.url === lastRenderedPageUrl) continue;
        lastRenderedPageUrl = m.url;
      }
      // Detached comments render unthreaded — adjacency must not re-adopt
      // a comment the user explicitly disassociated.
      const adjacency = m.type === 'feedback' && m.detached ? null : lastSelectorSel;
      const node = renderMessage(m, adjacency);
      list.append(node);
      if (m.type === 'selector') lastSelectorSel = m.entry.selector;
      if (i < ordered.length - 1) list.append(insertRail(ordered[i + 1]!.id));
      renderedAny = true;
    }
    list.append(insertRail('__end__'));
    if (!renderedAny && searchQuery) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = `No matches for "${searchQuery}".`;
      list.append(empty);
    }

    if (pendingMulti.length) renderPendingBay();
    if (phantomTarget) renderPhantom();

    requestAnimationFrame(redrawNoodles);
    if (stickToBottom) requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  };

  const renderPendingBay = (): void => {
    list.querySelector('.pending-bay')?.remove();
    if (!pendingMulti.length) return;
    const bay = document.createElement('div');
    bay.className = 'pending-bay';
    const head = document.createElement('div');
    head.className = 'pending-head';
    head.textContent = `Pending group · ${pendingMulti.length} element${pendingMulti.length === 1 ? '' : 's'}`;
    bay.append(head);
    pendingMulti.forEach((e, i) => {
      const card = document.createElement('div');
      card.className = 'pending-card';
      const seq = document.createElement('span');
      seq.className = 'seq';
      seq.textContent = `#${i + 1}`;
      const label = document.createElement('span');
      label.textContent = (e.text && e.text.length <= 60 ? e.text : (e.componentRoot ?? e.selector ?? e.tag));
      card.append(seq, label);
      bay.append(card);
    });
    const row = document.createElement('div');
    row.className = 'pending-row';
    const commit = document.createElement('button');
    commit.type = 'button';
    commit.className = 'primary pending-commit';
    commit.textContent = `Commit group · ${pendingMulti.length}`;
    commit.addEventListener('click', () => sendToCS({kind: 'pending-commit'}));
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'iconbtn pending-cancel';
    cancel.dataset.tip = 'Cancel pending group';
    cancel.setAttribute('aria-label', 'Cancel pending group');
    cancel.innerHTML = PG_ICONS.svgString('x', 13);
    cancel.addEventListener('click', () => sendToCS({kind: 'pending-cancel'}));
    row.append(commit, cancel);
    bay.append(row);
    const hint = document.createElement('div');
    hint.className = 'pending-hint';
    hint.textContent = 'Alt+Shift+Click more · Commit to finalize · Esc to cancel';
    bay.append(hint);
    list.append(bay);
  };

  // ─── Noodles ────────────────────────────────────────────────────────────
  const clearNoodles = (): void => { for (const n of list.querySelectorAll('.tree-noodle')) n.remove(); };

  // Cross-seam panel↔canvas noodles were removed: aligning two SVG halves
  // across the panel/page boundary depended on innerHeight parity which
  // breaks under DevTools dock and zoom, and the visual benefit didn't
  // justify the maintenance cost. The in-panel feedback-tree noodles
  // (drawNoodle / redrawNoodles below) are unaffected.
  const clearBubbleNoodle = (): void => { /* no-op */ };
  const redrawNoodles = (): void => {
    clearNoodles();
    let lastSelectorEl: HTMLElement | null = null;
    for (const node of [...list.children] as HTMLElement[]) {
      if (node.classList.contains('msg') && node.classList.contains('selector')) lastSelectorEl = node;
      // Only THREADED comments get a connector — a detached comment must
      // lose its noodle, not just its indent (the visible "disconnect").
      else if (node.classList.contains('msg') && node.classList.contains('feedback') && node.classList.contains('threaded') && lastSelectorEl) drawNoodle(lastSelectorEl, node);
      else if (node.classList.contains('insert-rail') && node.classList.contains('expanded') && lastSelectorEl) {
        const target = node.querySelector<HTMLElement>('.inline-comment') ?? node;
        drawNoodle(lastSelectorEl, target);
      } else if (node.classList.contains('page-divider') || node.classList.contains('group-head')) {
        lastSelectorEl = null;
      }
    }
  };
  const drawNoodle = (selectorEl: HTMLElement, feedbackEl: HTMLElement): void => {
    const sR = selectorEl.getBoundingClientRect();
    const fR = feedbackEl.getBoundingClientRect();
    const lR = list.getBoundingClientRect();
    const x1 = sR.left - lR.left + 12;
    const y1 = sR.bottom - lR.top + list.scrollTop;
    const x2 = fR.left - lR.left;
    const y2 = fR.top - lR.top + list.scrollTop + 14;
    const w = Math.max(20, x2 - x1 + 4);
    const h = Math.max(20, y2 - y1);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'tree-noodle');
    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.style.left = `${x1 - 2}px`;
    svg.style.top = `${y1}px`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const sx = 2, sy = 0, ex = w - 2, ey = h;
    path.setAttribute('d', `M ${sx} ${sy} C ${sx} ${sy + h * 0.55}, ${ex - w * 0.4} ${ey}, ${ex} ${ey}`);
    svg.append(path);
    list.append(svg);
  };
  let scrollRaf = 0;
  list.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; redrawNoodles(); });
  });
  window.addEventListener('resize', redrawNoodles);

  // ─── Per-message renderers ──────────────────────────────────────────────
  const renderMessage = (m: PanelMessage, lastSelectorSel: string | null): HTMLElement => {
    if (m.type === 'page') return renderPage(m);
    if (m.type === 'selector') return renderSelector(m);
    if (m.type === 'feedback') return renderFeedback(m, lastSelectorSel);
    return document.createElement('div');
  };

  const renderPage = (m: PageMessage): HTMLElement => {
    const d = document.createElement('div');
    d.className = 'page-divider';
    d.dataset.id = m.id;
    const ts = document.createElement('span');
    ts.className = 'tab-status';
    ts.dataset.url = m.url;
    if (m.url === liveTabUrl) ts.classList.add('open');
    d.append(ts);
    const u = document.createElement('span');
    u.className = 'url';
    u.textContent = m.url;
    u.dataset.tip = `${m.title ?? ''} · ${m.url}`;
    d.append(u);
    d.addEventListener('click', async () => {
      // If we're already on this page in the active tab, clicking the URL
      // shouldn't reload or steal focus — it should just be a no-op
      // visually (the row already indicates "open" via .tab-status). The
      // user complained about getting forced into a navigation when they
      // were just trying to read the row.
      if (m.url === liveTabUrl) {
        setStatus('Already on this page', {kind: 'info'});
        return;
      }
      const r = await sendToBg<{found?: boolean; opened?: number; error?: string}>({kind: 'switch-to-tab', url: m.url, openIfMissing: true});
      if (r?.found) setStatus('Switched to tab');
      else if (r?.opened) setStatus('Opened in new tab');
      else setStatus("Couldn't open tab", {kind: 'warn'});
    });
    return d;
  };

  const titleFromEntry = (e: Entry): string => {
    if (e.testId) return `[testId=${e.testId}]`;
    if (e.id) return `#${e.id}`;
    if (e.classes?.length) return `${e.tag}.${e.classes.slice(0, 2).join('.')}`;
    return e.selector || e.tag || '(unknown)';
  };

  // Pick the most "humanly readable" label for the bubble preview. Prefers
  // visible-to-user text in this priority:
  //   1. innerText / textContent (`entry.text`) — what the user reads on screen
  //   2. accessibleName (aria-label / title / alt fallback chain)
  //   3. input value (skipped if it's the masked password placeholder)
  //   4. input placeholder
  //   5. img alt
  //   6. componentRoot (e.g. "button#cta")
  //   7. titleFromEntry — last-resort tag/class/id fallback
  // CSS handles visual truncation via text-overflow:ellipsis; we ship the
  // full string so the tooltip on hover can show the complete value.
  const niceLabel = (e: Entry): string => {
    if (e.text) return e.text;
    if (e.accessibleName) return e.accessibleName;
    const v = e.attrs?.value;
    if (v && v !== '••••') return v;
    if (e.attrs?.placeholder) return e.attrs.placeholder;
    if (e.attrs?.alt) return e.attrs.alt;
    if (e.componentRoot) return e.componentRoot;
    return titleFromEntry(e);
  };

  const renderSelector = (m: SelectorMessage): HTMLElement => {
    const valid = selectorValidity.get(m.entry.selector);
    const samePath = pathOf(m.entry.url ?? '') === liveTabPath;
    const div = document.createElement('div');
    div.className = 'msg selector';
    if (valid === false && samePath) div.classList.add('stale');
    else if (valid === false && !samePath) div.classList.add('diff-page');
    if (m.pinned) div.classList.add('pinned');
    if (m.entry.group?.length) div.classList.add('has-group');
    if (m.entry.selector === lastActiveSelector) div.classList.add('last-active');
    // Auto-expand on search hit so the user sees where the match landed.
    const matchedBody = bodyMatchesSearch(m);
    if (matchedBody) div.classList.add('expanded', 'search-hit');
    div.dataset.id = m.id;
    div.dataset.selector = m.entry.selector;
    // Drag-to-reparent: every selector bubble is a valid drop target for
    // a comment being dragged from elsewhere in the sidebar.
    wireSelectorDropTarget(div, m);

    const head = document.createElement('div');
    head.className = 'head';
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.innerHTML = PG_ICONS.svgString('chevron-right', 12);
    head.append(caret);
    const pinMarker = document.createElement('span');
    pinMarker.className = 'pin-marker';
    pinMarker.innerHTML = PG_ICONS.svgString('star-filled', 11);
    head.append(pinMarker);
    const seq = document.createElement('span');
    seq.className = 'seq';
    seq.textContent = `#${m.entry.n}`;
    if (m.entry.group?.length) seq.textContent += `+${m.entry.group.length}`;
    head.append(seq);
    const compact = document.createElement('span');
    compact.className = 'compact';
    const compactStr = niceLabel(m.entry);
    compact.innerHTML = highlightMatch(compactStr, searchQuery);
    // Show the full label on hover even when CSS ellipsis truncates the
    // visible portion — useful when the visible text/placeholder is long.
    if (compactStr.length > 24) compact.dataset.tip = compactStr;
    head.append(compact);
    const meta = document.createElement('span');
    meta.className = 'meta';
    const r = m.entry.rect;
    meta.textContent = r ? `${r.w}×${r.h}` : (m.entry.tag ?? '');
    head.append(meta);
    div.append(head);

    const summary = document.createElement('span');
    summary.className = 'peek-summary';
    summary.innerHTML = `<span data-icon="alert-circle" data-size="11"></span>
      <span class="t">${div.classList.contains('diff-page') ? 'different page' : 'stale'}</span>`;
    head.append(summary);
    mountIcons(summary);

    const err = document.createElement('div');
    err.className = 'peek-error';
    const reason = selectorErrors.get(m.entry.selector);
    const pathFromEntry = pathOf(m.entry.url ?? '');
    err.innerHTML = samePath
      ? `<b>Stale</b> · ${escapeHtml(reason ?? 'no element on the live page matches.')}<br><code>${escapeHtml(m.entry.selector)}</code>`
      : `Captured on <code>${escapeHtml(pathFromEntry)}</code> — current tab is <code>${escapeHtml(liveTabPath ?? '')}</code>. Switch tabs to validate.<br><code>${escapeHtml(m.entry.selector)}</code>`;
    div.append(err);

    // Ancestor breadcrumb — Plasmic-style escalator. Chips for each entry in
    // entry.ancestors (closest first). Click a chip to capture that
    // ancestor on the live page (depth = chip index + 1 since the entry's
    // own selector is depth 0). Brightness gradient darkens deeper chips.
    if (m.entry.ancestors?.length) {
      const crumbs = document.createElement('div');
      crumbs.className = 'ancestor-crumbs';
      crumbs.dataset.tip = 'Click a crumb to escalate the capture to an ancestor element';
      m.entry.ancestors.forEach((anc, i) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ancestor-chip';
        // Brightness gradient: deeper chips get progressively dimmer.
        chip.style.filter = `brightness(${(1 - i * 0.08).toFixed(2)})`;
        const label = anc.testId ? `[${anc.testId}]`
          : anc.id ? `#${anc.id}`
          : anc.classes?.length ? `${anc.tag}.${anc.classes[0]}`
          : anc.tag;
        chip.textContent = label;
        chip.dataset.tip = `Capture the ancestor ${i + 1} level${i ? 's' : ''} up · ${anc.tag}${anc.id ? '#' + anc.id : ''}`;
        // Hover-preview the ancestor on the live page so the user can see
        // which element a chip refers to before committing. Mirrors how
        // hovering a selector bubble paints its ring. Clearing on
        // mouseleave swaps back to the bubble's own outline (the bubble's
        // mouseenter handler painted it; leaving the chip just removes
        // the override).
        chip.addEventListener('mouseenter', () => {
          void sendToCS({kind: 'outline-ancestor', selector: m.entry.selector, depth: i + 1});
        });
        chip.addEventListener('mouseleave', () => {
          // Re-paint the bubble's own ring rather than clearing entirely
          // so the user doesn't see a flicker of "nothing" between chips.
          void sendToCS({kind: 'outline', selector: m.entry.selector, gold: true});
        });
        chip.addEventListener('click', async (e) => {
          e.stopPropagation();
          const reply = await sendToCSAndWait<{ok: boolean; entry?: Entry}>({
            kind: 'capture-ancestor', selector: m.entry.selector, depth: i + 1,
          });
          if (reply?.ok) setStatus(`Captured ancestor ${anc.tag}`);
          else setStatus('Could not capture ancestor', {kind: 'warn'});
        });
        crumbs.append(chip);
      });
      div.append(crumbs);
    }

    // Preview tile. The full PNG lives on disk under
    // .pinchgrab/<ws>/screenshots/; the dataUrl is a side-panel-friendly
    // downscale (≤320px wide). To stop the layout from jumping when a shot
    // arrives a second after capture, we RESERVE the final image height up
    // front using the captured element's known aspect ratio and paint a
    // skeleton loader in that space, then swap the screenshot in with no
    // reflow. The reservation only happens when a shot is actually expected
    // (autoScreenshot on, host not skipped, no recorded failure) so captures
    // that will never get a shot don't carry an empty box.
    const shotDataUrl = shots.get(m.entry.selector);
    const shotExpected = prefs.autoScreenshot
      && !shouldSkipScreenshot(m.entry.url ?? '')
      && !m.entry.screenshot?.unavailableReason;
    if (shotDataUrl || shotExpected) {
      const preview = document.createElement('div');
      preview.className = 'preview';
      // Reserve vertical space immediately from the element's width/height.
      // The thumbnail is rendered at the bubble's content width, so the box
      // height tracks the element's aspect ratio. Clamp so a very tall
      // element doesn't reserve an absurd amount of space.
      const r = m.entry.rect;
      if (r && r.w > 0 && r.h > 0) {
        const ratio = Math.min(Math.max(r.h / r.w, 0.12), 2.2);
        preview.style.setProperty('--shot-ratio', String(ratio));
        preview.classList.add('reserved');
      }
      if (shotDataUrl) {
        const img = document.createElement('img');
        img.className = 'shot';
        img.alt = `Screenshot of #${m.entry.n}`;
        // Reveal only once decoded so the swap is instant and reflow-free;
        // the skeleton stays visible underneath until then.
        img.addEventListener('load', () => preview.classList.add('loaded'));
        img.src = shotDataUrl;
        if (img.complete) preview.classList.add('loaded');
        preview.append(img);
      } else {
        // No shot yet — show a skeleton shimmer occupying the reserved space.
        preview.classList.add('loading');
        const skel = document.createElement('div');
        skel.className = 'shot-skeleton';
        skel.setAttribute('aria-label', `Loading screenshot of #${m.entry.n}`);
        preview.append(skel);
      }
      div.append(preview);
    }

    const stats = document.createElement('div');
    stats.className = 'ent-stats';
    const fb = collectFeedbackAfter(m.id);
    const myTokens = tokenCount(JSON.stringify(m.entry));
    const totalTokens = messages
      .filter((mm): mm is SelectorMessage => mm.type === 'selector')
      .reduce((s, mm) => s + tokenCount(JSON.stringify(mm.entry)), 0);
    const sharePct = totalTokens > 0 ? Math.round((myTokens / totalTokens) * 100) : 0;
    const groupCount = m.entry.group?.length ?? 0;
    const groupTokens = (m.entry.group ?? []).reduce((s, g) => s + tokenCount(JSON.stringify(g)), 0);
    type StatCell = {label: string; value: string; tip: string};
    const cells: StatCell[] = [
      {label: 'HTML', value: `${m.entry.outerHTML?.length ?? 0}`, tip: 'Outer HTML char length'},
      {label: 'Tokens', value: `${myTokens}`, tip: 'Approx LLM tokens for this entry'},
      {label: 'Share', value: `${sharePct}%`, tip: 'Token share of all selectors'},
      {label: 'Comments', value: `${fb.length}`, tip: 'Inline comments threaded under this entry'},
      {label: 'Rules', value: `${m.entry.matchedRules?.length ?? 0}`, tip: 'Matched CSS rules'},
      {label: 'Styles', value: `${Object.keys(m.entry.styles ?? {}).length}`, tip: 'Computed-style fields kept'},
    ];
    if (groupCount) {
      cells.push({label: 'Group', value: `${groupCount}`, tip: 'Members folded into this group'});
      cells.push({label: 'Group T', value: `${groupTokens}`, tip: 'Tokens contributed by group members'});
    }
    stats.innerHTML = cells.map((c) =>
      `<span class="ent-stat" data-tip="${escapeHtml(c.tip)}"><span class="lbl">${c.label}</span><span class="val">${c.value}</span></span>`,
    ).join('');
    div.append(stats);

    // ── JSON pane with toolbar ──────────────────────────────────────────
    // Toolbar above the JSON body: left = line-wrap toggle, right = copy.
    // The JSON itself reflects the global `minify` setting so the user sees
    // the same shape that will end up in the export.
    const jsonWrap = document.createElement('div');
    jsonWrap.className = 'body-json-wrap';
    const jsonBar = document.createElement('div');
    jsonBar.className = 'body-json-bar';

    // Line-wrap checkbox (per-bubble local state, default ON). When ON the
    // JSON is flattened to ONE minified line that soft-wraps to the bubble
    // width (no horizontal scroll); when OFF it falls back to the global
    // minify-respecting pretty/compact form with horizontal scroll.
    const wrapLabel = document.createElement('label');
    wrapLabel.className = 'json-wrap-toggle';
    wrapLabel.dataset.tip = 'Flatten to a single soft-wrapping line instead of horizontal scroll';
    const wrapCheck = document.createElement('input');
    wrapCheck.type = 'checkbox';
    wrapCheck.checked = true;
    wrapLabel.append(wrapCheck, document.createTextNode(' Wrap'));
    jsonBar.append(wrapLabel);

    // Copy button (mirrors the "Copy this capture as JSON" action below,
    // surfaced at the top so the user doesn't have to scroll past the JSON
    // to find it).
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'iconbtn json-copy';
    copyBtn.dataset.tip = 'Copy this capture as JSON';
    copyBtn.setAttribute('aria-label', 'Copy capture as JSON');
    copyBtn.innerHTML = PG_ICONS.svgString('copy', 13);
    copyBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      // Full single-capture export: identity + paths + text/content + every
      // attached note/comment — the same depth as a full export, scoped to
      // this one capture (item 7). Distinct from the raw entry shown below.
      const feedback = messages.flatMap((x) => x.type === 'feedback' && x.parentUid === m.entry.uid
        ? [{text: x.text, ts: x.ts, uid: x.id, parentUid: x.parentUid}] : []);
      await navigator.clipboard.writeText(serializeCaptureJson({entry: m.entry, feedback}));
      setStatus('Copied capture export');
      showCopied('Copied capture', `#${m.entry.n}`);
    });
    jsonBar.append(copyBtn);
    jsonWrap.append(jsonBar);

    const body = document.createElement('div');
    body.className = 'body-json wrap-on';
    // Render the JSON to match the wrap state:
    //   wrap ON  → a single minified line (indent 0) that soft-wraps to the
    //              bubble width (CSS handles the visual wrapping via
    //              overflow-wrap:anywhere), so the whole object is one
    //              continuous string with no horizontal scroll.
    //   wrap OFF → the global minify-respecting form: pretty-printed full
    //              entry, or the slimEntry compact form when minify is on,
    //              with horizontal scroll for long lines.
    const renderJson = (): void => {
      body.textContent = '';
      const wrapped = wrapCheck.checked;
      const payload = (wrapped || prefs.minify) ? slimEntry(m.entry, {includeGroup: true}) : m.entry;
      const indent = (wrapped || prefs.minify) ? 0 : 2;
      const text = JSON.stringify(payload, null, indent);
      appendJsonHighlight(body, text);
      if (searchQuery) wrapSearchHitsInTextNodes(body, searchQuery);
    };
    renderJson();
    wrapCheck.addEventListener('change', () => {
      body.classList.toggle('wrap-on', wrapCheck.checked);
      body.classList.toggle('wrap-off', !wrapCheck.checked);
      renderJson();
    });
    // Stop the click on the toolbar from collapsing the bubble — the head's
    // click handler toggles `.expanded` on click, and the bar lives inside
    // the bubble.
    jsonBar.addEventListener('click', (e) => e.stopPropagation());
    jsonWrap.append(body);
    div.append(jsonWrap);

    head.addEventListener('click', () => {
      div.classList.toggle('expanded');
      requestAnimationFrame(redrawNoodles);
    });
    div.addEventListener('mouseenter', () => {
      void sendToCS({kind: 'outline', selector: m.entry.selector, gold: true});
      lastActiveSelector = m.entry.selector;
      armStickyExpiry();
    });
    div.addEventListener('mouseleave', () => {
      void sendToCS({kind: 'outline-clear'});
      if (lastActiveSelector) void sendToCS({kind: 'scroll-to', selector: lastActiveSelector, sticky: true});
    });

    const actions = document.createElement('div');
    actions.className = 'actions';
    // Note: NO actions-row mouseenter/mouseleave. The bubble's own
    // mouseenter/mouseleave already paints the page-side outline while
    // the cursor is anywhere inside the bubble — including over action
    // buttons. Adding handlers HERE used to clear the outline whenever
    // the cursor moved from .actions back to the bubble body (because
    // .mouseleave fires on the parent path even though .mouseenter on
    // the bubble doesn't refire), which read as "the highlight flickers
    // off mid-hover".
    actions.append(actionBtn(m.pinned ? 'star-filled' : 'star', m.pinned ? 'Unpin from top' : 'Pin to top', () => {
      snapshot();
      m.pinned = !m.pinned;
      persist();
      render();
    }, {toggled: m.pinned}));
    // Locate is a one-shot: scroll the page to the element and run the
    // 3-pulse cyan ring animation. It used to share `lastActiveSelector`
    // with the hover-sticky path, which made the button appear toggled
    // any time the user merely hovered the bubble. Now it has no
    // persistent state — pressing it always plays the same flash.
    actions.append(actionBtn('crosshair', 'Locate this element on the page', () => {
      void sendToCS({kind: 'locate-flash', selector: m.entry.selector});
      setStatus('Locating…');
    }));
    actions.append(actionBtn('message-square-plus', 'Add a comment after this capture', () => {
      const idx = messages.findIndex((mm) => mm.id === m.id);
      const beforeId = idx >= 0 && idx < messages.length - 1 ? messages[idx + 1]!.id : '__end__';
      insertBefore.current = beforeId;
      insertBefore.comment = true;
      render();
    }, {size: 15}));
    if (groupCount) {
      // Split-group action: promote each group member back to its own
      // top-level selector entry, then fire a fresh element screenshot
      // for each promoted member. Group captures share a single union-
      // bbox screenshot keyed on the head; the members never get their
      // own element shots until split. After this, each child has its
      // own ring + thumbnail.
      actions.append(actionBtn('list-tree', `Split this group of ${groupCount} into individual entries`, () => {
        snapshot();
        const idx = messages.findIndex((mm) => mm.id === m.id);
        if (idx < 0) return;
        const members = m.entry.group ?? [];
        delete m.entry.group;
        const fresh: SelectorMessage[] = members.map((entry) => ({
          type: 'selector', id: msgId(), ts: entry.ts ?? new Date().toISOString(), entry,
        }));
        messages.splice(idx + 1, 0, ...fresh);
        persist();
        render();
        setStatus(`Split group of ${members.length} · capturing screenshots…`);
        // Fire per-member element shots — sequentially so they don't
        // race captureVisibleTab. Failures (selector no longer matches,
        // host on skip-list) leave the member without a thumbnail but
        // don't block the others.
        void (async () => {
          let captured = 0;
          for (const child of fresh) {
            try {
              await fireElementShot(child);
              if (child.entry.screenshot?.element) captured++;
            } catch (e) { console.warn(LOG, 'split-group shot failed for', child.entry.selector, e); }
          }
          setStatus(`Split done · ${captured}/${members.length} screenshots`);
        })();
      }));
    }
    actions.append(actionBtn('external-link', 'Log the element and copy a console snippet', async () => {
      const reply = await sendToCSAndWait<{snippet?: string}>({kind: 'log-element', selector: m.entry.selector, n: m.entry.n});
      const snippet = reply?.snippet ?? `document.querySelector('${m.entry.selector}')`;
      try { await navigator.clipboard.writeText(snippet); setStatus('Logged + copied console snippet'); showCopied('Copied snippet'); }
      catch { setStatus('Logged to console'); }
    }));
    actions.append(actionBtn('refresh-cw', 'Re-capture this element from the live page', async () => {
      const reply = await sendToCSAndWait<{ok: boolean; entry?: Entry}>({kind: 'recapture', selector: m.entry.selector, n: m.entry.n});
      if (reply?.ok && reply.entry) {
        snapshot();
        m.entry = reply.entry;
        persist();
        render();
        setStatus('Re-captured');

      } else setStatus('Re-capture failed', {kind: 'warn'});
    }));
    actions.append(actionBtn('copy', 'Copy this capture as a full export (paths, text, comments)', async () => {
      const feedback = messages.flatMap((x) => x.type === 'feedback' && x.parentUid === m.entry.uid
        ? [{text: x.text, ts: x.ts, uid: x.id, parentUid: x.parentUid}] : []);
      await navigator.clipboard.writeText(serializeCaptureJson({entry: m.entry, feedback}));
      setStatus('Copied capture export');
      showCopied('Copied capture', `#${m.entry.n}`);
    }));
    actions.append(deleteBtn(() => removeMessage(m.id)));
    div.append(actions);
    return div;
  };

  const renderFeedback = (m: FeedbackMessage, lastSelectorSel: string | null): HTMLElement => {
    const div = document.createElement('div');
    div.className = 'msg feedback';
    if (lastSelectorSel) div.classList.add('threaded');
    div.dataset.id = m.id;
    div.innerHTML = highlightMatch(m.text, searchQuery);
    if (lastSelectorSel) {
      // Resolve the parent selector — prefer parentUid (the persisted FK)
      // over capture-adjacency, since drag-to-reparent moves the chip but
      // the trailing-selector heuristic gives stale results until render
      // settles. The annotation overlay needs the parent's selector to
      // anchor the on-page tooltip.
      const {parentSel, parentUid} = (() => {
        if (m.parentUid) {
          const p = messages.find(
            (mm) => mm.type === 'selector' && (mm as SelectorMessage).entry.uid === m.parentUid,
          );
          if (p && p.type === 'selector') return {parentSel: p.entry.selector, parentUid: p.entry.uid};
        }
        return {parentSel: lastSelectorSel, parentUid: undefined as string | undefined};
      })();
      div.addEventListener('mouseenter', () => {
        sendToCS({kind: 'outline', selector: parentSel, gold: true});
        // Scroll the parent element into view + show the on-page
        // annotation tooltip rendering THIS comment's text. Pass the
        // parent's uid so a same-selector sibling capture doesn't get
        // mistakenly identified as "the same target" by the content
        // script's annotation overlay.
        if (prefs.autoScrollToHovered) {
          sendToCS({kind: 'scroll-to', selector: parentSel, sticky: true});
        }
        sendToCS({
          kind: 'annotation',
          selector: parentSel,
          payload: {selector: parentSel, uid: parentUid, captured: true, feedback: [m.text]},
        });
      });
      div.addEventListener('mouseleave', () => {
        sendToCS({kind: 'outline-clear'});
        sendToCS({kind: 'annotation-clear'});
      });
    }
    div.dataset.commentId = m.id;
    const beginCommentDrag = (e: DragEvent): void => {
      div.classList.add('dragging');
      e.dataTransfer?.setData('application/x-pinchgrab-comment', m.id);
      e.dataTransfer?.setData('text/plain', m.text);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    };
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
    const actions = document.createElement('div');
    actions.className = 'actions';
    const dragHandle = actionBtn('grip', 'Drag this handle onto a selector to reparent', () => { /* drag handle only */ });
    dragHandle.classList.add('drag-handle');
    dragHandle.draggable = true;
    dragHandle.addEventListener('dragstart', beginCommentDrag);
    dragHandle.addEventListener('dragend', () => div.classList.remove('dragging'));
    dragHandle.addEventListener('click', (e) => e.stopPropagation());
    actions.append(dragHandle);
    // Detach — the inverse of drag-to-reparent. Only meaningful when the
    // comment currently reads as threaded (FK or adjacency).
    if (lastSelectorSel || m.parentUid) {
      actions.append(actionBtn('unlink', 'Detach from its capture — make this a standalone comment', () => {
        // Resolve by id from the LIVE array: workspace switches and
        // undo/redo reassign `messages`, so the closure's `m` can be a
        // stale object whose mutation would be silently dropped by the
        // next persist().
        const live = messages.find((x): x is FeedbackMessage => x.type === 'feedback' && x.id === m.id);
        if (!live) { setStatus('Comment no longer exists', {kind: 'warn'}); return; }
        snapshot();
        delete live.parentUid;
        live.detached = true;
        persist();
        render();
        setStatus('Comment detached — drag its handle onto a capture to reattach');
      }));
    }
    actions.append(actionBtn('copy', 'Copy comment text', async () => {
      await navigator.clipboard.writeText(m.text);
      setStatus('Copied comment');
      showCopied('Copied comment');
    }));
    actions.append(actionBtn('pencil', 'Edit comment', () => enterFeedbackEdit(div, m), {size: 15}));
    actions.append(deleteBtn(() => removeMessage(m.id)));
    div.append(actions);
    return div;
  };

  // Drop handler shared by every selector bubble. Accepts a dragged
  // comment ID via the `application/x-pinchgrab-comment` MIME, updates
  // parentUid + adjacency, persists, re-renders.
  const wireSelectorDropTarget = (div: HTMLElement, m: SelectorMessage): void => {
    div.addEventListener('dragover', (e) => {
      const types = e.dataTransfer?.types;
      if (!types || !Array.from(types).includes('application/x-pinchgrab-comment')) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      div.classList.add('drop-target');
    });
    div.addEventListener('dragleave', () => div.classList.remove('drop-target'));
    div.addEventListener('drop', (e) => {
      div.classList.remove('drop-target');
      const id = e.dataTransfer?.getData('application/x-pinchgrab-comment');
      if (!id) return;
      e.preventDefault();
      const srcIdx = messages.findIndex((mm) => mm.id === id);
      if (srcIdx < 0) return;
      const src = messages[srcIdx]! as FeedbackMessage;
      if (src.type !== 'feedback') return;
      const dstIdx = messages.findIndex((mm) => mm.id === m.id);
      if (dstIdx < 0) return;
      snapshot();
      // Update the FK pointer first — that's the source of truth in
      // exports. Adjacency is just a render convenience. Reparenting is
      // the inverse of detach, so the detached flag is cleared.
      src.parentUid = m.entry.uid;
      delete src.detached;
      // Splice src out of its current slot and re-insert right after the
      // new parent (and any feedback already trailing it, so the most-
      // recent feedback ends up nearest the parent visually).
      messages.splice(srcIdx, 1);
      const newDstIdx = messages.findIndex((mm) => mm.id === m.id);
      let insertAt = newDstIdx + 1;
      while (insertAt < messages.length && messages[insertAt]!.type === 'feedback') insertAt++;
      messages.splice(insertAt, 0, src);
      persist();
      render();
      setStatus('Comment reparented');
    });
  };

  type ActionBtnOpts = {warn?: boolean; toggled?: boolean; size?: number};
  const actionBtn = (icon: string, title: string, fn: () => void, opts: ActionBtnOpts = {}): HTMLButtonElement => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.tip = title;
    b.setAttribute('aria-label', title);
    if (opts.warn) b.className = 'warn';
    if (opts.toggled) b.classList.add('toggled');
    // Default icon size 13 reads slightly small in a 22×22 button — fine
    // for icons with simple shapes (crosshair, list-tree, undo) but visibly
    // squeezed for `message-square-plus` and `pencil`, where the
    // interior strokes vanish into hairline blur. Callers can bump with
    // `size: 15` for those.
    b.innerHTML = PG_ICONS.svgString(icon, opts.size ?? 13);
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  };

  const deleteBtn = (onConfirm: () => void): HTMLButtonElement => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'warn';
    b.dataset.tip = 'Delete';
    b.setAttribute('aria-label', 'Delete capture');
    b.innerHTML = PG_ICONS.svgString('trash-2', 13);
    let parent: HTMLElement | null = null;
    let revertTimer = 0;
    const revert = (): void => {
      if (!parent) return;
      for (const n of parent.querySelectorAll('.confirm-yes, .confirm-no')) n.remove();
      if (!b.parentElement) parent.append(b);
      clearTimeout(revertTimer);
    };
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      parent = b.parentElement as HTMLElement;
      const yes = document.createElement('button');
      yes.type = 'button';
      yes.className = 'confirm-yes';
      yes.dataset.tip = 'Confirm delete';
      yes.setAttribute('aria-label', 'Confirm delete');
      yes.innerHTML = PG_ICONS.svgString('check', 13);
      yes.addEventListener('click', (ev) => { ev.stopPropagation(); revert(); onConfirm(); });
      const no = document.createElement('button');
      no.type = 'button';
      no.className = 'confirm-no';
      no.dataset.tip = 'Cancel delete';
      no.setAttribute('aria-label', 'Cancel delete');
      no.innerHTML = PG_ICONS.svgString('x', 13);
      no.addEventListener('click', (ev) => { ev.stopPropagation(); revert(); });
      b.replaceWith(yes);
      yes.after(no);
      revertTimer = window.setTimeout(revert, 8000);
    });
    return b;
  };

  const enterFeedbackEdit = (div: HTMLElement, m: FeedbackMessage): void => {
    const next = document.createElement('div');
    next.className = 'msg feedback editing';
    if (div.classList.contains('threaded')) next.classList.add('threaded');
    next.dataset.id = m.id;
    next.append(buildInlineComment({
      initial: m.text,
      onCancel: () => { div.replaceWith(div.cloneNode(true)); render(); },
      onSubmit: (text) => {
        const trimmed = (text ?? '').trim();
        if (trimmed === m.text) { render(); return; }
        snapshot();
        m.text = trimmed;
        // Severity has been removed from the UI. Strip any legacy value
        // that came back from an older JSONL import so saves don't keep
        // re-emitting it.
        delete (m as any).severity;
        persist();
        render();
      },
      autofocus: true,
    }));
    div.replaceWith(next);
  };

  const removeMessage = (id: string): void => {
    const el = list.querySelector<HTMLElement>(`[data-id="${id}"]`);
    const finish = (): void => {
      snapshot();
      messages = messages.filter((m) => m.id !== id);
      persist();
      render();
      setStatus('Deleted');
    };
    if (!el) { finish(); return; }
    el.style.maxHeight = el.scrollHeight + 'px';
    void el.offsetWidth;
    el.classList.add('removing');
    let done = false;
    const cleanup = (): void => { if (done) return; done = true; finish(); };
    el.addEventListener('transitionend', cleanup, {once: true});
    setTimeout(cleanup, 380);
  };

  // ─── Composer ───────────────────────────────────────────────────────────
  const sendFeedback = (): void => {
    const text = composer.value.trim();
    if (!text) return;
    snapshot();
    let position = messages.length;
    if (insertBefore.current) {
      position = messages.findIndex((m) => m.id === insertBefore.current);
      if (position < 0) position = messages.length;
      insertBefore.current = null;
      insertBefore.comment = false;
    }
    // Stamp parentUid on the in-memory message at creation time so the
    // FK is the single source of truth. The slim emit no longer has to
    // infer the parent from capture-adjacency, and `manifest.counts`
    // accurately reflects feedback-bearing selectors.
    // Walk back to the nearest preceding selector before splice.
    let pIdx = position - 1;
    while (pIdx >= 0 && messages[pIdx]?.type === 'feedback') pIdx--;
    const parent = pIdx >= 0 ? messages[pIdx] : undefined;
    const parentUid = parent && parent.type === 'selector' ? parent.entry.uid : undefined;
    messages.splice(position, 0, {
      type: 'feedback', id: msgId(), ts: new Date().toISOString(), text,
      ...(parentUid ? {parentUid} : {}),
    });
    composer.value = '';
    updateComposerMeter();
    // Sending clears any active visual find so the new comment isn't hidden
    // behind a stale filter.
    if (searchQuery) closeFind();
    persist();
    render();
    setStatus('Sent');
    composer.focus();
    // Bug #2: feedback's parent should have a screenshot.
    if (parent && parent.type === 'selector' && !parent.entry.screenshot?.element) {
      void fireElementShot(parent as SelectorMessage);
    }
  };

  composer.addEventListener('keydown', async (e) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const handled = await tryManualCaptureFromComposer();
      if (!handled) sendFeedback();
    }
    if (e.key === 'Escape' && insertBefore.current) {
      insertBefore.current = null;
      setStatus('Insert mode cancelled');
    }
  });
  const updateComposerMeter = (): void => {
    const t = composer.value;
    compWords.textContent = String(wordCount(t));
    compTokens.textContent = String(tokenCount(t));
    composer.classList.toggle('cmd-mode', /^>/.test(t.trim()));
  };
  composer.addEventListener('input', updateComposerMeter);

  // ── Header search → command palette ────────────────────────────────────
  // The header search affordance no longer runs its own filter; clicking or
  // focusing it opens the Cmd+K command palette (which searches captures AND
  // runs commands). It's a readonly trigger, so we just open the palette and
  // drop focus so the palette input takes over cleanly.
  const triggerPaletteFromSearch = (): void => {
    if (!palette.hidden) return;
    openPalette();
    search.blur();
  };
  search.addEventListener('focus', triggerPaletteFromSearch);
  search.addEventListener('click', triggerPaletteFromSearch);
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerPaletteFromSearch(); }
  });

  // ── Ctrl+F visual find (in-list filter + highlight) ────────────────────
  const scrollFirstFindHitIntoView = (): void => {
    if (!searchQuery) return;
    requestAnimationFrame(() => {
      const firstHit = list.querySelector<HTMLElement>('.msg.selector.search-hit');
      if (firstHit) {
        centerElementInList(firstHit);
        const mk = firstHit.querySelector<HTMLElement>('mark');
        if (mk) centerElementInList(mk);
      } else {
        const firstMatch = list.querySelector<HTMLElement>('.msg mark');
        if (firstMatch) centerElementInList(firstMatch);
      }
    });
  };
  const updateFindCount = (): void => {
    if (!findCount) return;
    findCount.textContent = searchQuery ? `${list.querySelectorAll('.msg').length} match` : '';
  };
  const applyFind = (value: string): void => {
    searchQuery = value.trim();
    render();
    updateFindCount();
    scrollFirstFindHitIntoView();
  };
  const openFind = (): void => {
    if (!findBar || !findInput) return;
    findBar.hidden = false;
    document.querySelector('.panel')?.classList.add('find-open');
    findInput.focus();
    findInput.select();
  };
  const closeFind = (): void => {
    if (findBar) findBar.hidden = true;
    document.querySelector('.panel')?.classList.remove('find-open');
    if (findInput) findInput.value = '';
    if (searchQuery) { searchQuery = ''; render(); }
    updateFindCount();
  };
  findInput?.addEventListener('input', () => applyFind(findInput.value));
  findInput?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closeFind(); } });
  document.querySelector('[data-find-clear]')?.addEventListener('click', closeFind);

  const tryManualCaptureFromComposer = async (): Promise<boolean> => {
    const m = /^>\s*(.+)$/.exec(composer.value.trim());
    if (!m) return false;
    const sel = m[1]!.trim();
    if (!sel) return false;
    const reply = await sendToCSAndWait<{ok: boolean}>({kind: 'manual-capture', selector: sel});
    if (reply?.ok) { composer.value = ''; updateComposerMeter(); setStatus('Captured ' + sel); }
    else setStatus('Selector did not match: ' + sel, {kind: 'warn'});
    return true;
  };

  // ─── Export builders ────────────────────────────────────────────────────
  // v2 export shape: top level keeps user-facing identification fields
  // (uid, n, selector, text, role, attrs, hints, classes, styles, component,
  // states, screenshot, group). Diagnostic / detection metadata moves under
  // an `_audit` namespace (ancestors, componentRoot, inShadowDOM,
  // pseudoElements, matchedRules, viewport). The version marker is emitted
  // as `v: 2`. Importers detect either v1 (flat) or v2 and denormalize.
  //
  // Aggressive minify additionally drops fields the selector already
  // implies: ancestors, viewport (one per page), componentRoot when
  // redundant with the selector, and pseudoElements.
  const slimEntry = (e: Entry, opts: {includeGroup?: boolean; eventIndex?: number; visualOrder?: number; groupUid?: string} = {}): Record<string, any> => {
    const includeOuter = prefs.includeOuterHTML;
    const includeMatched = prefs.includeMatchedRules;
    const includeStyles = prefs.includeStyles;
    const minify = prefs.minify;

    // Top-level user-facing fields. Order matters for output readability —
    // we want `v / type / uid / n / selector` first so JSONL is greppable.
    //
    // `n` stays as the capture-sequence display label for backwards
    // compatibility with v1/v2 readers (and the sidebar's "#3" chips).
    // The disambiguated cousins (`captureIndex`, `eventIndex`,
    // `visualOrder`, `displayLabel`) live on the row so a downstream
    // agent can pick whichever ordering is meaningful — bug #10.
    const out: Record<string, any> = {
      v: 2,
      type: 'selector',
      uid: e.uid,
      n: e.n,
      ts: e.ts,
      url: e.url,
      tag: e.tag,
      selector: e.selector,
      captureIndex: e.n,
      displayLabel: String(e.n),
    };
    if (opts.eventIndex !== undefined) out.eventIndex = opts.eventIndex;
    if (opts.visualOrder !== undefined) out.visualOrder = opts.visualOrder;
    if (e.sessionId) out.sessionId = e.sessionId;
    if (e.text !== undefined) out.text = minify ? e.text.replaceAll(/\s+/g, ' ').trim() : e.text;
    if (e.role !== undefined) out.role = e.role;
    if (e.accessibleName !== undefined) out.accessibleName = minify ? e.accessibleName.replaceAll(/\s+/g, ' ').trim() : e.accessibleName;
    if (e.id !== undefined) out.id = e.id;
    if (e.testId !== undefined) out.testId = e.testId;
    if (e.classes && e.classes.length) {
      out.classes = (minify && e.classes.length > 8) ? e.classes.slice(0, 8) : e.classes;
    }
    if (e.attrs && Object.keys(e.attrs).length) out.attrs = e.attrs;
    if (e.hints && Object.keys(e.hints).length) out.hints = e.hints;
    if (e.rect) out.rect = e.rect;
    if (e.states && e.states.length) out.states = e.states;
    if (e.component) out.component = e.component;
    // Locator-quality field. Promote even when minified — it's a single
    // small int and a downstream agent uses it to decide whether to
    // trust the selector.
    if (e.selectorMatchCount !== undefined) out.selectorMatchCount = e.selectorMatchCount;
    if (e.a11y) out.a11y = e.a11y;
    if (e.assets && e.assets.length) out.assets = e.assets;
    if (e.layoutContext && e.layoutContext.length) out.layoutContext = e.layoutContext;
    if (includeOuter && e.outerHTML !== undefined) {
      out.outerHTML = minify ? e.outerHTML.replaceAll(/\s+/g, ' ').trim() : e.outerHTML;
    }
    if (includeStyles && e.styles && Object.keys(e.styles).length) out.styles = e.styles;
    if (e.screenshot) {
      // Path normalization: the live `entry.screenshot.element` carries a
      // workspace-prefixed path (e.g. `default/screenshots/foo.png`)
      // because the background's chrome.downloads.download API stamps
      // the workspace into the on-disk path. But the .tar.zst archive
      // bundles screenshots flat at `screenshots/foo.png`, so the
      // workspace-prefix would resolve to nothing for an agent that
      // extracted the archive. Strip the workspace prefix on emit so
      // every path is valid relative to the manifest's declared
      // `pathRoot` (archive root for tar.zst; workspace root for plain
      // JSONL — i.e., `Downloads/.pinchgrab/<workspace>/`).
      const stripWs = (p: string | undefined): string | undefined => {
        if (!p) return p;
        // Strip exactly one leading `<workspace>/` segment if present.
        const wsPrefix = `${activeWs}/`;
        return p.startsWith(wsPrefix) ? p.slice(wsPrefix.length) : p;
      };
      out.screenshot = {...e.screenshot};
      if (out.screenshot.element) out.screenshot.element = stripWs(out.screenshot.element);
      if (out.screenshot.group) out.screenshot.group = stripWs(out.screenshot.group);
      if (out.screenshot.page) out.screenshot.page = stripWs(out.screenshot.page);
    }
    // Promote runtime/behavior signals to top-level. These are primary
    // signal for triage (events tells "which handler ran", behaviorAttrs
    // tells "what server-rendered binding does this fire", canvasClick
    // tells "where on the chart was clicked", editor tells "which
    // rich-text library wraps this", domMutations tells "what changed
    // before the click", isAnimating warns about transient state).
    if (e.events && Object.keys(e.events).length) out.events = e.events;
    if (e.behaviorAttrs && Object.keys(e.behaviorAttrs).length) out.behaviorAttrs = e.behaviorAttrs;
    if (e.canvasClick) out.canvasClick = e.canvasClick;
    if (e.editor) out.editor = e.editor;
    if (e.isAnimating) out.isAnimating = true;
    if (e.shadowHost) out.shadowHost = e.shadowHost;
    if (e.renderedText !== undefined) out.renderedText = e.renderedText;
    if (e.truncated && Object.keys(e.truncated).length) out.truncated = e.truncated;
    if (e.sessionId) out.sessionId = e.sessionId;
    if (e.domMutations && e.domMutations.length) out.domMutations = e.domMutations;

    // _audit: detection chain & diagnostic shape.
    // README claimed `_audit.ancestors` and `_audit.componentRoot` were
    // always present, but the slim emit dropped them whenever
    // `minify: true`. The fix: emit every declared `_audit` field
    // whenever the source data exists, and let
    // `minify` slim ONLY the high-volume blocks (matchedRules,
    // pseudoElements). Small structural metadata (ancestors,
    // componentRoot, viewport) survives minify so the schema claims
    // stay honest.
    const audit: Record<string, any> = {};
    if (e.ancestors && e.ancestors.length) audit.ancestors = e.ancestors;
    if (e.componentRoot !== undefined) audit.componentRoot = e.componentRoot;
    if (e.inShadowDOM) audit.inShadowDOM = true;
    if (e.pseudoElements && Object.keys(e.pseudoElements).length && !minify) audit.pseudoElements = e.pseudoElements;
    if (includeMatched && e.matchedRules && e.matchedRules.length) {
      audit.matchedRules = minify
        ? e.matchedRules.map((r) => {
          const r2: Record<string, any> = {selector: r.selector};
          if (r.declarations && Object.keys(r.declarations).length) r2.declarations = r.declarations;
          if (r.media) r2.media = r.media;
          return r2;
        })
        : e.matchedRules;
    }
    if (e.viewport) audit.viewport = e.viewport;
    if (Object.keys(audit).length) out._audit = audit;

    // Group head linkage. Previously the group head's `entry.group`
    // carried full nested entry objects.
    // That made DuckDB joins ugly and broke the rule that every
    // selector should be a top-level row. We now emit:
    //   • on the group head: `groupMemberUids: [uid, uid, ...]` (just IDs)
    //   • each member as its own top-level slim row with `groupUid`
    //     pointing back at the head (handled in `buildSlim` flush logic).
    if (opts.includeGroup && e.group && e.group.length) {
      out.groupMemberUids = e.group.map((g) => g.uid).filter(Boolean);
    }
    if (opts.groupUid) out.groupUid = opts.groupUid;

    return out;
  };
  // ─── Shared "slim data" pipeline ────────────────────────────────────────
  // JSONL renders off this intermediate representation. (Markdown used to
  // share it; the Markdown export was retired in favor of JSONL-only.)
  //
  // v2 differences vs v1:
  //   • Selector lines have explicit `type: 'selector'` and `v: 2`.
  //   • _audit nests detection / debug fields (ancestors, componentRoot, …).
  //   • Feedback emits as standalone `{type:'feedback', parentUid, …}` lines
  //     PLUS bundled `feedback` arrays on selectors (so old single-line
  //     readers still see them adjacent).
  //   • A leading manifest line carries workspace + counts + filename.
  type SlimPage = {v: 2; type: 'page'; ts: string; url: string; title?: string; viewport?: Viewport; tokens?: Record<string, string>; userAgent?: string; lang?: string; gitContext?: {commit?: string; branch?: string; build?: string}; route?: any; state?: any; sessionId?: string; snapshot?: PageSnapshot};
  // Severity was removed from the UI (2026-05). Tolerant readers may still
  // see `severity` on legacy JSONL — denormalizeEntry preserves it on
  // FeedbackMessage so re-export round-trips, but new sessions never set
  // it and we don't emit it here. Keep the field off SlimFeedback so new
  // exports stay clean.
  // `tags` is always emitted (default empty array) so DuckDB schema
  // inference always sees the column.
  type SlimFeedback = {v: 2; type: 'feedback'; uid: string; ts: string; text: string; parentUid?: string; detached?: boolean; tags: string[]; isTestData?: boolean; suggestedSkills?: Array<{skill: string; locator: string}>};
  // Cheap test-data sniff: matches strings the user types while smoke-
  // testing the extension ("test", "asdf", "foo", "lorem ipsum",
  // "placeholder", or any phrase obviously stubbed-out). False positives
  // here are recoverable — the consumer can ignore the flag — but
  // excluding real feedback would not be, so we keep the regex narrow.
  const TEST_DATA_RE = /^(test|asdf|qwer|foo|bar|baz|lorem|placeholder|todo|x{3,}|hello world|sample|dummy|something|anything|ignore me|wip|tbd|n\/a|hi)\b/i;
  const looksLikeTestData = (text: string): boolean => {
    const t = text.trim();
    if (!t) return false;
    if (TEST_DATA_RE.test(t)) return true;
    if (/test feedback/i.test(t)) return true;
    return false;
  };
  type SlimSelector = Record<string, any> & {v: 2; type: 'selector'; n: number; selector: string; feedback?: string[]};
  type SlimLine = SlimPage | SlimFeedback | SlimSelector;
  const buildSlim = (): SlimLine[] => {
    const lines: SlimLine[] = [];
    // Pre-compute visualOrder (top→bottom, left→right) for every
    // selector message. The previous single `n` field conflated
    // capture order, JSONL stream order,
    // visual order, and display label. We now emit four orthogonal
    // fields and document each:
    //   • eventIndex   — monotonic position in the JSONL stream
    //   • captureIndex — the original `n` (capture sequence)
    //   • visualOrder  — sort by rect.y asc, rect.x asc
    //   • displayLabel — the human-facing number shown in the sidebar
    //                    (currently mirrors captureIndex; can drift if
    //                    the sidebar adopts a different label scheme).
    const visualRank = new Map<string, number>();
    const sels = messages
      .filter((m): m is SelectorMessage => m.type === 'selector')
      .slice()
      .sort((a, b) => {
        const ar = a.entry.rect; const br = b.entry.rect;
        if (!ar || !br) return 0;
        if (ar.y !== br.y) return ar.y - br.y;
        return ar.x - br.x;
      });
    sels.forEach((m, i) => visualRank.set(m.id, i + 1));
    let pendingSel: SelectorMessage | null = null;
    // We collect both the bundled string array (for v1-friendly readers) and
    // the rich objects (for v2 standalone lines).
    let pendingFbStrings: string[] = [];
    let pendingFbRich: SlimFeedback[] = [];
    const flush = (): void => {
      if (!pendingSel) return;
      const eventIndex = lines.length + 1;
      const visualOrder = visualRank.get(pendingSel.id);
      const out: any = slimEntry(pendingSel.entry, {includeGroup: true, eventIndex, visualOrder});
      if (pendingFbStrings.length) out.feedback = [...pendingFbStrings];
      lines.push(out as SlimLine);
      // Group flatness (bug #9). Emit each group member as its own
      // top-level slim row right after the head, with `groupUid`
      // linking back. This lets DuckDB / SQL queries treat group
      // members as first-class selector rows without descending into
      // nested objects.
      const groupMembers = pendingSel.entry.group ?? [];
      for (const member of groupMembers) {
        const mEvent = lines.length + 1;
        const memberRow: any = slimEntry(member, {includeGroup: false, eventIndex: mEvent, groupUid: pendingSel.entry.uid});
        lines.push(memberRow as SlimLine);
      }
      // Emit each standalone feedback line right after the selector(s).
      for (const fb of pendingFbRich) lines.push(fb);
      pendingSel = null;
      pendingFbStrings = [];
      pendingFbRich = [];
    };
    // Reorder for export only — sidebar keeps capture order, the
    // emitted JSONL reads top→bottom, left→right within each page.
    // Feedback rows stay attached to their preceding selector via the
    // `reorderForExport` helper, so threading is preserved through
    // the rearrangement.
    const exportOrdered = reorderForExport(messages);
    for (const m of exportOrdered) {
      if (m.type === 'page') {
        flush();
        const slim: SlimPage = {v: 2, type: 'page', ts: m.ts, url: m.url};
        if (m.title !== undefined) slim.title = m.title;
        if (m.viewport) slim.viewport = m.viewport;
        if (!prefs.minify && m.tokens) slim.tokens = m.tokens;
        if (m.userAgent) slim.userAgent = m.userAgent;
        if (m.lang) slim.lang = m.lang;
        if (m.gitContext) slim.gitContext = m.gitContext;
        if (m.route) slim.route = m.route;
        if (m.state) slim.state = m.state;
        if (m.sessionId) slim.sessionId = m.sessionId;
        // Full-page snapshot (viewport, scroll extents, dpr, lang, screenshot)
        // captured for this URL. Part of the export deliverable so a downstream
        // agent has whole-page context, not just element crops.
        const snap = (m as PageMessage & {snapshot?: PageSnapshot}).snapshot;
        if (snap) slim.snapshot = snap;
        lines.push(slim);
      } else if (m.type === 'selector') { flush(); pendingSel = m; }
      else if (m.type === 'feedback') {
        // Always include `tags: []` (even when empty) so DuckDB's schema
        // inference picks the column up.
        // `uid` is the message's stable id: PRs / repair reports need
        // a stable per-feedback handle, not just parentUid.
        const rich: SlimFeedback = {v: 2, type: 'feedback', uid: m.id, ts: m.ts, text: m.text, tags: m.tags ?? []};
        // (severity removed 2026-05 — old JSONLs may still contain it
        // on the read side, but we no longer emit it on write.)
        // Heuristic flag for stub-looking feedback ("test", "asdf", "foo",
        // "Howdy , test feedback here", etc). Lets a downstream consumer
        // filter pollution from real intent without manual cleanup.
        if (looksLikeTestData(m.text)) rich.isTestData = true;
        // A detached comment never adopts the pending selector via
        // adjacency — the user explicitly disassociated it. The flag is
        // emitted so import round-trips don't re-adopt by adjacency either.
        if (m.detached) rich.detached = true;
        // Heuristic skill locators for the agent's map phase (verified and
        // rewritten into work-manifest mapped_skills by the consumer).
        rich.suggestedSkills = suggestSkillsFor(m.text);
        if (pendingSel && !m.detached) {
          rich.parentUid = m.parentUid ?? pendingSel.entry.uid;
          pendingFbStrings.push(m.text);
          pendingFbRich.push(rich);
        } else {
          if (m.parentUid) rich.parentUid = m.parentUid;
          lines.push(rich);
        }
      }
    }
    flush();
    return lines;
  };
  // Build the leading manifest line of the JSONL export. The
  // manifest carries the export filename + workspace + host(s) + counts so
  // a downstream LLM can resync the file with its workspace and grep for
  // duplicates across exports.
  const buildManifest = (filename: string, format: ExportManifest['format'], opts: {nowIso?: string; bundleId?: string} = {}): ExportManifest => {
    let nSel = 0; let nFb = 0; let nPg = 0;
    let nGroupMembers = 0;
    let nFeedbackBearing = 0;
    let nMissingShot = 0;
    let nElementShots = 0;
    let nGroupShots = 0;
    let nPageShots = 0;
    let nOrphanedFb = 0;
    const selectorUids = new Set<string>();
    const feedbackParentSelectorIds = new Set<string>();
    // First pass: collect uids + per-selector feedback presence.
    for (const m of messages) {
      if (m.type === 'selector') {
        nSel++;
        selectorUids.add(m.entry.uid);
        if (m.entry.group?.length) nGroupMembers += m.entry.group.length;
        if (m.entry.screenshot?.element) nElementShots++;
        if (m.entry.screenshot?.group) nGroupShots++;
        if (m.entry.screenshot?.page) nPageShots++;
      } else if (m.type === 'feedback') {
        nFb++;
        if (m.parentUid) feedbackParentSelectorIds.add(m.parentUid);
      } else if (m.type === 'page') nPg++;
    }
    // Second pass: feedback-bearing selectors + orphaned feedback +
    // selectors that should have a shot but don't.
    for (const m of messages) {
      if (m.type === 'selector' && feedbackParentSelectorIds.has(m.entry.uid)) {
        nFeedbackBearing++;
        if (!m.entry.screenshot?.element && !m.entry.screenshot?.group) nMissingShot++;
      }
    }
    for (const fbUid of feedbackParentSelectorIds) {
      if (!selectorUids.has(fbUid)) nOrphanedFb++;
    }
    const nowIso = opts.nowIso ?? exportNowIso();
    const out: ExportManifest = {
      v: 2, type: 'manifest', tool: 'pinchgrab',
      ts: nowIso,
      generated: Date.parse(nowIso),
      workspace: activeWs,
      filename,
      format,
      hosts: distinctHosts(),
      counts: {
        // Total selector rows the JSONL will emit = top-level + flat
        // group members. This matches what a downstream
        // `read_json_auto(...)` would see; the previous behavior of
        // reporting only the in-memory top-level count contradicted
        // the actual stream.
        selectors: nSel + nGroupMembers,
        feedback: nFb,
        pages: nPg,
        feedbackBearingSelectors: nFeedbackBearing,
        groupMembers: nGroupMembers,
        screenshotsElement: nElementShots,
        screenshotsGroup: nGroupShots,
        screenshotsPage: nPageShots,
        selectorsMissingScreenshot: nMissingShot,
        orphanedFeedback: nOrphanedFb,
      },
      // Single canonical resolution rule. Every path field in the JSONL
      // (screenshot.element/group/page) is relative to `pathRoot`:
      //   • 'archive': for tar.zst exports, paths are relative to the
      //     extracted archive root (e.g. `screenshots/foo.png`).
      //   • 'workspace': for plain JSONL exports, paths are relative to
      //     the workspace dir (`Downloads/.pinchgrab/<workspace>/`).
      // Receivers no longer have to guess which path shape applies.
      pathRoot: format === 'tar.zst' ? 'archive' : 'workspace',
    };
    // Content-derived identity (SHA-256 prefix over slim rows + screenshot
    // names). Same content → same bundleId → downstream ~/.pinchgrab state
    // keys stay stable across re-exports.
    if (opts.bundleId) out.bundleId = opts.bundleId;
    // Indirection pointers so a downstream agent knows which UI skill
    // owns the triage flow + which DESIGN.md owns the visual identity.
    //
    // `inline: true` is set ONLY for tar.zst exports (where the .md
    // files are physically bundled into the archive). JSONL-only
    // exports emit `inline: false` plus the receiver-side `path` so
    // a consumer paired with the standalone JSONL can resolve the
    // referenced file off their own filesystem.
    //
    // `template: true` flags when the user hasn't customized — useful
    // for receivers who want to distinguish bundled-default content
    // from the user's actual working notes.
    const isTarBundle = format === 'tar.zst';
    out.skill = {
      name: 'PinchGrab',
      path: prefs.skillPath,
      inline: isTarBundle,
    };
    if (isTarBundle) out.skill.archivePath = '.agents/skills/PinchGrab/SKILL.md';
    if (isUsingTemplateSkill()) out.skill.template = true;
    else out.skill.customized = true;
    out.design = {
      path: prefs.designPath,
      inline: isTarBundle,
    };
    if (isTarBundle) out.design.archivePath = 'DESIGN.md';
    if (isUsingTemplateDesign()) out.design.template = true;
    else out.design.customized = true;

    // Self-roast diagnostics.
    const diagnostics: ExportDiagnostic[] = [];
    // Feedback-bearing selectors with no screenshot.
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      if (!feedbackParentSelectorIds.has(m.entry.uid)) continue;
      if (!m.entry.screenshot?.element && !m.entry.screenshot?.group) {
        diagnostics.push({
          severity: 'warn',
          code: 'FEEDBACK_PARENT_MISSING_SCREENSHOT',
          uid: m.entry.uid,
          detail: `selector ${m.entry.selector} carries feedback but has no element/group screenshot`,
        });
      }
    }
    // Orphaned feedback (parentUid doesn't resolve).
    for (const fbUid of feedbackParentSelectorIds) {
      if (!selectorUids.has(fbUid)) {
        diagnostics.push({
          severity: 'error',
          code: 'ORPHANED_FEEDBACK',
          uid: fbUid,
          detail: 'feedback row references a parentUid that has no matching selector in this archive',
        });
      }
    }
    // Hover-state captures usually need a before/after; flag any whose
    // screenshot story is incomplete (bug #16 partial).
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      if (m.entry.states && m.entry.states.includes('hover') && !m.entry.screenshot?.element) {
        diagnostics.push({
          severity: 'warn',
          code: 'HOVER_STATE_NO_SCREENSHOT',
          uid: m.entry.uid,
          detail: `selector captured in :hover state but has no screenshot`,
        });
      }
    }
    // A11y: flag failing contrast (bug #15 follow-through).
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      if (m.entry.a11y?.contrastPasses === 'fail') {
        diagnostics.push({
          severity: 'warn',
          code: 'CONTRAST_BELOW_AA',
          uid: m.entry.uid,
          detail: `text contrast ratio ${m.entry.a11y.contrastRatio ?? '?'} is below WCAG AA`,
        });
      }
    }
    if (diagnostics.length) out.exportDiagnostics = diagnostics;

    // Build identity. Pull from the most recent page row's gitContext
    // (sourced via `<meta name="pinchgrab-build">` on the captured app)
    // plus the PinchGrab extension version. Omit the block entirely
    // when neither is available.
    const lastPage = [...messages].reverse().find((m) => m.type === 'page') as PageMessage | undefined;
    const git = lastPage?.gitContext;
    const extVer = inExtension && chrome.runtime?.getManifest ? chrome.runtime.getManifest().version : undefined;
    if (git || extVer) {
      out.build = {};
      if (extVer) out.build.extensionVersion = extVer;
      if (git?.commit) out.build.commit = git.commit;
      if (git?.branch) out.build.branch = git.branch;
      if (git?.build) out.build.deployBuild = git.build;
    }
    return out;
  };
  const buildJsonl = (filenameForManifest?: string, format: ExportManifest['format'] = 'jsonl', opts: {nowIso?: string; bundleId?: string} = {}): string => {
    const filename = filenameForManifest ?? buildExportFilename('jsonl');
    const manifest = buildManifest(filename, format, opts);
    const lines = buildSlim();
    if (!lines.length) {
      // Even an empty workspace gets a manifest line so downstream tools
      // can verify the file was generated by PinchGrab.
      return JSON.stringify(manifest) + '\n';
    }
    return [JSON.stringify(manifest), ...lines.map((l) => JSON.stringify(l))].join('\n') + '\n';
  };
  const downloadFile = (content: string, filename: string, mime = 'text/plain'): void => {
    const url = URL.createObjectURL(new Blob([content], {type: mime}));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onCopyAll = async (): Promise<void> => {
    const text = buildJsonl();
    if (text.trim().split('\n').length <= 1 && !messages.length) {
      // Manifest-only output for an empty workspace shouldn't pretend to be a copy.
      setStatus('Nothing to copy', {kind: 'warn'}); return;
    }
    await navigator.clipboard.writeText(text);
    setStatus(`Copied JSONL · ${tokenCount(text)} tokens · ${wordCount(text)} words`);
    showCopied('Copied JSONL', `${tokenCount(text)} tokens · ${wordCount(text)} words`);
  };
  // Save through the background's file bridge if we're in an extension
  // context, so the file lands under Downloads/.pinchgrab/<ws>/exports/.
  // Otherwise (test page, dev server), fall back to a synthetic blob URL.
  const saveExportToDisk = async (text: string, filename: string, mime: string, kind: string): Promise<void> => {
    if (inExtension) {
      console.log(LOG, 'saveExportToDisk →', {filename, mime, size: text.length, kind});
      const reply = await sendToBg<SaveReply>({kind: 'save-text', workspace: activeWs, filename, text, mime});
      console.log(LOG, 'saveExportToDisk reply:', reply);
      if (reply?.ok && reply.absPath) {
        lastExport.relPath = reply.filename ?? null;
        lastExport.absPath = reply.absPath;
        lastExport.copyPath = reply.copyPath ?? reply.absPath;
        lastExport.tempPath = Boolean(reply.tempPath);
        lastExport.kind = kind;
        updateCopyPathButton();
        setStatus(`Exported · ${lastExport.copyPath}`);
        return;
      }
      const err = reply?.error ?? 'no reply from background (worker dead? reload extension at chrome://extensions)';
      console.error(LOG, 'saveExportToDisk failed:', err);
      setStatus(`Export failed: ${err}`, {kind: 'warn'});
      showDownloadError('Export failed', String(err));
      return;
    }
    downloadFile(text, filename, mime);
    lastExport.relPath = filename;
    lastExport.absPath = filename;
    lastExport.copyPath = filename;
    lastExport.tempPath = false;
    lastExport.kind = kind;
    updateCopyPathButton();
    setStatus('Exported');
  };
  const onExport = async (): Promise<void> => {
    if (!messages.length) { setStatus('Nothing to export', {kind: 'warn'}); return; }
    const contentHash = await computeContentHash([]);
    const filename = buildExportFilename('jsonl', contentHash.slice(0, 8));
    const text = buildJsonl(filename, 'jsonl', {nowIso: exportNowIso(), bundleId: contentHash.slice(0, 16)});
    await saveExportToDisk(text, filename, 'application/jsonl', 'jsonl');
  };
  // ─── tar.zst workspace export ────────────────────────────────────────────
  // Bundle JSONL + README + DuckDB recipes + screenshots.json + actual PNG
  // screenshots into a single .tar.zst archive. tar gives us a clean
  // container (one file per entry, no zip-style central-directory
  // contortions); zstd is the modern compression pair. Implementation is
  // pure-TS — see src/tar.ts for the encoder + zstd-frame writer.
  // Bug #28: a JSON-Schema describing every row type in the JSONL.
  // Receivers can use this to validate fixtures, drive autocomplete in
  // editors, and auto-generate parsers. Keep this in sync with the
  // shapes emitted by buildSlim/slimEntry — `npm run test` validates a
  // sample against this schema.
  const buildSchemaJson = (): string => JSON.stringify({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://wranngle.com/pinchgrab/export.v2.schema.json',
    title: 'PinchGrab export (v2)',
    description: 'JSONL row + manifest schemas for PinchGrab workspace exports.',
    oneOf: [
      {$ref: '#/$defs/manifest'},
      {$ref: '#/$defs/page'},
      {$ref: '#/$defs/selector'},
      {$ref: '#/$defs/feedback'},
    ],
    $defs: {
      manifest: {
        type: 'object',
        required: ['v', 'type', 'tool', 'ts', 'workspace', 'filename', 'format', 'hosts', 'counts'],
        properties: {
          v: {const: 2},
          type: {const: 'manifest'},
          tool: {const: 'pinchgrab'},
          ts: {type: 'string', format: 'date-time'},
          generated: {type: 'integer'},
          workspace: {type: 'string'},
          filename: {type: 'string'},
          format: {enum: ['jsonl', 'markdown', 'tar.zst']},
          bundleId: {type: 'string', pattern: '^[0-9a-f]{16}$'},
          hosts: {type: 'array', items: {type: 'string'}},
          pathRoot: {enum: ['archive', 'workspace']},
          counts: {
            type: 'object',
            required: ['selectors', 'feedback', 'pages'],
            properties: {
              selectors: {type: 'integer'},
              feedback: {type: 'integer'},
              pages: {type: 'integer'},
              feedbackBearingSelectors: {type: 'integer'},
              groupMembers: {type: 'integer'},
              screenshotsElement: {type: 'integer'},
              screenshotsGroup: {type: 'integer'},
              screenshotsPage: {type: 'integer'},
              selectorsMissingScreenshot: {type: 'integer'},
              orphanedFeedback: {type: 'integer'},
              pagesHtml: {type: 'integer'},
            },
          },
          agentProtocol: {
            type: 'object',
            required: ['archivePath'],
            properties: {archivePath: {type: 'string'}},
          },
          bundledSkills: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'kind', 'archivePath'],
              properties: {
                id: {type: 'string'},
                kind: {enum: ['skill', 'reference']},
                archivePath: {type: 'string'},
                invocation: {type: 'string'},
              },
            },
          },
          pagesHtml: {
            type: 'array',
            items: {
              type: 'object',
              required: ['url', 'archivePath', 'bytes'],
              properties: {
                url: {type: 'string'},
                archivePath: {type: 'string'},
                bytes: {type: 'integer'},
              },
            },
          },
          skill: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              path: {type: 'string'},
              inline: {type: 'boolean'},
              archivePath: {type: 'string'},
              template: {type: 'boolean'},
              customized: {type: 'boolean'},
            },
          },
          design: {
            type: 'object',
            properties: {
              path: {type: 'string'},
              inline: {type: 'boolean'},
              archivePath: {type: 'string'},
              template: {type: 'boolean'},
              customized: {type: 'boolean'},
            },
          },
          build: {
            type: 'object',
            properties: {
              extensionVersion: {type: 'string'},
              commit: {type: 'string'},
              branch: {type: 'string'},
              dirty: {type: 'boolean'},
              deployBuild: {type: 'string'},
            },
          },
          exportDiagnostics: {
            type: 'array',
            items: {
              type: 'object',
              required: ['severity', 'code'],
              properties: {
                severity: {enum: ['error', 'warn', 'info']},
                code: {type: 'string'},
                detail: {type: 'string'},
                uid: {type: 'string'},
              },
            },
          },
        },
      },
      page: {
        type: 'object',
        required: ['v', 'type', 'ts', 'url'],
        properties: {
          v: {const: 2},
          type: {const: 'page'},
          ts: {type: 'string', format: 'date-time'},
          url: {type: 'string'},
          title: {type: 'string'},
          viewport: {$ref: '#/$defs/viewport'},
          tokens: {type: 'object', additionalProperties: {type: 'string'}},
          userAgent: {type: 'string'},
          lang: {type: 'string'},
          gitContext: {
            type: 'object',
            properties: {
              commit: {type: 'string'},
              branch: {type: 'string'},
              build: {type: 'string'},
            },
          },
          sessionId: {type: 'string'},
        },
      },
      selector: {
        type: 'object',
        required: ['v', 'type', 'uid', 'n', 'ts', 'url', 'tag', 'selector'],
        properties: {
          v: {const: 2},
          type: {const: 'selector'},
          uid: {type: 'string'},
          n: {type: 'integer'},
          captureIndex: {type: 'integer'},
          eventIndex: {type: 'integer'},
          visualOrder: {type: 'integer'},
          displayLabel: {type: 'string'},
          ts: {type: 'string', format: 'date-time'},
          url: {type: 'string'},
          tag: {type: 'string'},
          selector: {type: 'string'},
          selectorMatchCount: {type: 'integer', minimum: 0},
          text: {type: 'string'},
          renderedText: {type: 'string'},
          role: {type: 'string'},
          accessibleName: {type: 'string'},
          id: {type: 'string'},
          testId: {type: 'string'},
          classes: {type: 'array', items: {type: 'string'}},
          attrs: {type: 'object', additionalProperties: {type: 'string'}},
          rect: {$ref: '#/$defs/rect'},
          states: {type: 'array', items: {type: 'string'}},
          component: {
            type: 'object',
            properties: {
              framework: {enum: ['react', 'vue', 'lit', 'stencil', 'svelte', 'web-component']},
              name: {type: 'string'},
              displayName: {type: 'string'},
              chain: {type: 'array', items: {type: 'string'}},
              source: {
                type: 'object',
                properties: {file: {type: ['string', 'null']}, line: {type: ['integer', 'null']}},
              },
            },
          },
          outerHTML: {type: 'string'},
          styles: {type: 'object', additionalProperties: {type: 'string'}},
          screenshot: {
            type: 'object',
            properties: {
              element: {type: 'string'},
              group: {type: 'string'},
              page: {type: 'string'},
              capturedAt: {type: 'string', format: 'date-time'},
            },
          },
          shadowHost: {type: 'string'},
          inShadowDOM: {type: 'boolean'},
          groupUid: {type: 'string'},
          groupMemberUids: {type: 'array', items: {type: 'string'}},
          feedback: {type: 'array', items: {type: 'string'}},
          _audit: {
            type: 'object',
            properties: {
              ancestors: {type: 'array', items: {$ref: '#/$defs/ancestor'}},
              componentRoot: {type: 'string'},
              inShadowDOM: {type: 'boolean'},
              pseudoElements: {type: 'object'},
              matchedRules: {type: 'array', items: {$ref: '#/$defs/matchedRule'}},
              viewport: {$ref: '#/$defs/viewport'},
            },
          },
        },
      },
      feedback: {
        type: 'object',
        required: ['v', 'type', 'uid', 'ts', 'text', 'tags'],
        properties: {
          v: {const: 2},
          type: {const: 'feedback'},
          uid: {type: 'string'},
          ts: {type: 'string', format: 'date-time'},
          text: {type: 'string'},
          parentUid: {type: 'string'},
          detached: {type: 'boolean'},
          tags: {type: 'array', items: {type: 'string'}},
          isTestData: {type: 'boolean'},
          suggestedSkills: {
            type: 'array',
            items: {
              type: 'object',
              required: ['skill', 'locator'],
              properties: {skill: {type: 'string'}, locator: {type: 'string'}},
            },
          },
        },
      },
      viewport: {
        type: 'object',
        properties: {
          w: {type: 'integer'}, h: {type: 'integer'}, dpr: {type: 'number'},
          colorScheme: {enum: ['light', 'dark']},
          reducedMotion: {type: 'boolean'},
          direction: {enum: ['ltr', 'rtl']},
          zoom: {type: 'number'},
        },
      },
      rect: {
        type: 'object',
        required: ['x', 'y', 'w', 'h'],
        properties: {x: {type: 'number'}, y: {type: 'number'}, w: {type: 'number'}, h: {type: 'number'}},
      },
      ancestor: {
        type: 'object',
        required: ['tag'],
        properties: {
          tag: {type: 'string'},
          id: {type: 'string'},
          role: {type: 'string'},
          testId: {type: 'string'},
          classes: {type: 'array', items: {type: 'string'}},
        },
      },
      matchedRule: {
        type: 'object',
        required: ['selector'],
        properties: {
          selector: {type: 'string'},
          declarations: {type: 'object', additionalProperties: {type: 'string'}},
          media: {type: 'string'},
        },
      },
    },
  }, null, 2) + '\n';

  // Generate repair-index.md as a structured starting point for an
  // autonomous coding agent. For every feedback row, mechanically derive:
  //   • target identity (uid, selector, tag, accessible name)
  //   • screenshot path (with archive-relative form)
  //   • source hints (component chain, sourcemap file/line)
  //   • suggested fix category (cheap heuristic on text)
  // The agent uses this as a starting punch list, then validates +
  // refines each suggestion against the full JSONL.
  const inferFeedbackCategory = (text: string): string => {
    const t = text.toLowerCase();
    if (/\b(typo|copy|wording|label|misspell|grammar|capitaliz)/.test(t)) return 'copy';
    if (/\b(align|spacing|padding|margin|layout|overlap|crowded|cramped|tight|gap)/.test(t)) return 'layout';
    if (/\b(unclear|confusing|what does|what is|don't understand|hard to|nav|navigation)/.test(t)) return 'affordance';
    if (/\b(contrast|color blind|screen reader|aria|focus|keyboard|tab|a11y|accessib)/.test(t)) return 'accessibility';
    if (/\b(broken|crash|null|undefined|error|404|fail)/.test(t)) return 'state';
    if (/\b(ugly|color|gradient|shadow|polish|visual|style)/.test(t)) return 'visual-polish';
    return 'unspecified';
  };
  // Heuristic seed for the Send-to-Agent protocol's map phase: category →
  // bundled-skill locators (ids match skills-index.json). The consuming
  // agent is told to VERIFY these, not trust them — they exist so the map
  // phase starts from something instead of nothing. Only locators that can
  // actually exist in the archive are emitted (vendored ones gate on the
  // bundleSkills pref).
  const suggestSkillsFor = (text: string): Array<{skill: string; locator: string}> => {
    const PINCHGRAB = {skill: 'pinchgrab', locator: '.agents/skills/PinchGrab/SKILL.md'};
    const PFD = {skill: 'pfd', locator: 'perception-first-design/skills/pfd/SKILL.md'};
    const imp = (slug: string): {skill: string; locator: string} =>
      ({skill: `impeccable/${slug}`, locator: `.agents/skills/impeccable/reference/${slug}.md`});
    const vendored = prefs.bundleSkills && BUNDLED_SKILLS_PRESENT;
    if (!vendored) return [PINCHGRAB];
    switch (inferFeedbackCategory(text)) {
      case 'copy': return [PINCHGRAB, imp('clarify'), PFD];
      case 'layout': return [PINCHGRAB, imp('layout'), PFD];
      case 'affordance': return [PINCHGRAB, imp('interaction-design'), PFD];
      case 'accessibility': return [PINCHGRAB, imp('audit'), PFD];
      case 'state': return [PINCHGRAB, PFD];
      case 'visual-polish': return [PINCHGRAB, imp('polish'), PFD];
      default: return [PINCHGRAB, PFD];
    }
  };
  const buildRepairIndex = (manifest: ExportManifest, jsonlName: string): string => {
    type Row = {feedback: FeedbackMessage; parent?: SelectorMessage};
    const rows: Row[] = [];
    const byUid = new Map<string, SelectorMessage>();
    for (const m of messages) if (m.type === 'selector') byUid.set(m.entry.uid, m);
    for (const m of messages) {
      if (m.type !== 'feedback') continue;
      const parent = m.parentUid ? byUid.get(m.parentUid) : undefined;
      rows.push({feedback: m, parent});
    }
    if (!rows.length) {
      return [
        '# repair-index.md',
        '',
        `Generated: ${manifest.ts}`,
        '',
        '_(no feedback in this export — nothing to repair)_',
        '',
      ].join('\n');
    }
    const out: string[] = [];
    out.push('# repair-index.md');
    out.push('');
    out.push(`Generated: ${manifest.ts}`);
    out.push(`Workspace: \`${manifest.workspace}\` · Hosts: ${manifest.hosts.map((h) => '`' + h + '`').join(', ') || '(none)'}`);
    out.push('');
    out.push('A starting punch list for an autonomous repair agent. Each row is one user complaint with the data needed to locate, fix, and verify. Cross-reference `' + jsonlName + '` for the full record.');
    out.push('');
    out.push('## Tasks');
    out.push('');
    rows.forEach(({feedback, parent}, i) => {
      const fbId = `F${String(i + 1).padStart(3, '0')}`;
      const target = parent?.entry;
      out.push(`### ${fbId} — ${feedback.text.slice(0, 80)}${feedback.text.length > 80 ? '…' : ''}`);
      out.push('');
      out.push(`> ${feedback.text.split('\n').join('\n> ')}`);
      out.push('');
      out.push(`- **feedbackUid:** \`${feedback.id}\``);
      if (target) {
        out.push(`- **target:** \`${target.selector}\` _(uid \`${target.uid}\`, n=${target.n})_`);
        if (target.tag) out.push(`- **tag:** \`<${target.tag}>\`${target.role ? ` · role=\`${target.role}\`` : ''}`);
        if (target.accessibleName) out.push(`- **accessible name:** "${target.accessibleName.slice(0, 100)}"`);
        if (target.text && target.text !== target.accessibleName) {
          out.push(`- **visible text:** "${target.text.slice(0, 100)}"`);
        }
        if (target.selectorMatchCount !== undefined) {
          out.push(`- **selector quality:** matches ${target.selectorMatchCount} element${target.selectorMatchCount === 1 ? '' : 's'}`);
        }
        if (target.screenshot?.element) {
          out.push(`- **screenshot:** \`${target.screenshot.element}\``);
        } else if (target.screenshot?.group) {
          out.push(`- **screenshot (group):** \`${target.screenshot.group}\``);
        } else {
          out.push(`- **screenshot:** _(missing — see exportDiagnostics)_`);
        }
        if (target.component) {
          const c = target.component;
          const ch = c.chain && c.chain.length ? ` · chain ${c.chain.slice(0, 5).map((n) => '`' + n + '`').join(' → ')}` : '';
          out.push(`- **component:** \`${c.name ?? c.displayName ?? '?'}\` (${c.framework})${ch}`);
          if (c.source?.file) out.push(`- **source:** \`${c.source.file}\`${c.source.line ? `:${c.source.line}` : ''}`);
        }
        if (target.componentRoot) out.push(`- **component root:** ${target.componentRoot}`);
        if (target.ancestors && target.ancestors.length) {
          const chain = target.ancestors.slice(0, 4).map((a) => `<${a.tag}>${a.id ? '#' + a.id : a.testId ? `[testId="${a.testId}"]` : ''}`).join(' › ');
          out.push(`- **ancestor chain:** ${chain}`);
        }
        if (target.url) out.push(`- **url:** ${target.url}`);
      } else {
        out.push(`- **target:** _(no selector — orphaned feedback)_`);
      }
      const cat = inferFeedbackCategory(feedback.text);
      out.push(`- **suggested category:** ${cat}`);
      out.push('');
    });
    out.push('---');
    out.push('');
    out.push('Categories are inferred from feedback text via keyword heuristics — verify before acting.');
    return out.join('\n');
  };

  const buildReadme = (manifest: ExportManifest, jsonlName: string, shotCount: number): string => {
    const lines: string[] = [
      '# PinchGrab Workspace Export',
      '',
      `Generated: ${manifest.ts}`,
      `Workspace: \`${manifest.workspace}\``,
      `Hosts: ${manifest.hosts.length ? manifest.hosts.map((h) => '`' + h + '`').join(', ') : '(none)'}`,
      `Counts: **${manifest.counts.selectors}** selectors · **${manifest.counts.feedback}** comments · **${manifest.counts.pages}** pages · **${shotCount}** screenshots`,
      '',
      '## Triage materials',
      '',
      manifest.skill?.inline
        ? `- **UI skill (mechanic):** bundled at \`./${manifest.skill.archivePath ?? '.agents/skills/PinchGrab/SKILL.md'}\`${manifest.skill.customized ? ' _(customized — trust as authoritative)_' : manifest.skill.template ? ' _(bundled default — generic boilerplate, verify before applying)_' : ''} — how to read this export and triage the captures.`
        : (manifest.skill?.path
          ? `- **UI skill (mechanic):** \`${manifest.skill.path}\` — read on the receiver's filesystem.`
          : '- **UI skill (mechanic):** not configured.'),
      manifest.design?.inline
        ? `- **DESIGN.md (visual identity):** bundled inline at \`./${manifest.design.archivePath ?? 'DESIGN.md'}\`${manifest.design.customized ? ' _(customized — trust the tokens / voice rules as project canon)_' : manifest.design.template ? ' _(bundled default — placeholder, verify before applying)_' : ''} — color tokens, typography, spacing, motion, voice.`
        : (manifest.design?.path
          ? `- **DESIGN.md (visual identity):** \`${manifest.design.path}\` — read on the receiver's filesystem.`
          : '- **DESIGN.md (visual identity):** not configured.'),
      '',
      '## Files',
      '',
      manifest.agentProtocol ? `- \`${manifest.agentProtocol.archivePath}\` — the agent working doctrine: phases, persistence layout, verification loop (**agents start here**).` : '',
      '- `repair-index.md` — agent-friendly triage punch list (one task per comment).',
      `- \`${jsonlName}\` — JSONL stream (one capture per line, leading manifest, schema v2).`,
      '- `screenshots/*.png` — full-resolution PNGs of each captured element / group / page.',
      '- `screenshots.json` — uid-keyed index: `byUid[uid] → { element?, group?, page? }`, `byUrl[url] → { page?, uids[] }`, plus a flat `files[]` listing.',
      '- `schema.json` — JSON-Schema (draft 2020-12) describing every row type.',
      '- `duckdb.sql` — copy-and-paste recipes for querying the JSONL with DuckDB.',
      manifest.bundledSkills?.length ? `- \`skills-index.json\` — locator index for the ${manifest.bundledSkills.length} bundled skill documents (id → archive path → purpose → upstream provenance).` : '',
      manifest.bundledSkills?.length ? '- `.agents/skills/impeccable/reference/*.md` + `perception-first-design/**` — vendored design skills, each with its upstream license; read them from this archive, no installation needed.' : '',
      manifest.pagesHtml?.length ? `- \`pages/*.html\` — full serialized HTML of ${manifest.pagesHtml.length} captured page${manifest.pagesHtml.length === 1 ? '' : 's'} (opt-in).` : '',
      manifest.design?.inline ? `- \`DESIGN.md\` — ${manifest.design.customized ? 'project-customized design source-of-truth (trust as canonical).' : manifest.design.template ? 'PinchGrab\'s bundled DESIGN.md template (placeholder — verify before applying).' : ''}` : '',
      manifest.skill?.inline ? `- \`.agents/skills/PinchGrab/SKILL.md\` — ${manifest.skill.customized ? 'project-customized triage skill.' : manifest.skill.template ? 'PinchGrab\'s bundled default triage skill (template content).' : ''}` : '',
      '',
      '## Extracting',
      '',
      'Pick whichever variant your machine supports — not every system ships `zstd`.',
      '',
      '```sh',
      '# 1. Modern tar with built-in zstd support (Linux + recent macOS):',
      `tar --zstd -xf ${manifest.filename}`,
      '',
      '# 2. tar + standalone zstd CLI:',
      `zstd -d ${manifest.filename} -o ${manifest.filename.replace(/\.zst$/, '')}`,
      `tar -xf ${manifest.filename.replace(/\.zst$/, '')}`,
      '',
      '# 3. Pure-Node fallback (no zstd CLI / no tar):',
      `npx -y @ronomon/zstandard < ${manifest.filename} > ${manifest.filename.replace(/\.zst$/, '')}`,
      `# … then use any tar reader (e.g. \`npx tar-stream\`)`,
      '```',
      '',
      'Expected file list after extraction:',
      '',
      '```',
      `${jsonlName}                    # JSONL stream (the source of truth)`,
      manifest.agentProtocol ? 'AGENT-PROTOCOL.md               # agent working doctrine (start here)' : '',
      `screenshots/                    # element / group / page PNGs`,
      `screenshots.json                # uid-keyed lookup index`,
      `duckdb.sql                      # copy-paste SQL recipes`,
      `schema.json                     # JSON-Schema for every row type`,
      `README.md                       # this file`,
      manifest.bundledSkills?.length ? 'skills-index.json               # bundled-skill locator index' : '',
      manifest.bundledSkills?.length ? '.agents/skills/impeccable/      # vendored reference guides (Apache-2.0)' : '',
      manifest.bundledSkills?.length ? 'perception-first-design/        # vendored PFD framework (CC BY-SA 4.0)' : '',
      manifest.pagesHtml?.length ? 'pages/                          # full page HTML (opt-in)' : '',
      manifest.design?.inline ? 'DESIGN.md                       # visual identity source-of-truth' : '',
      manifest.skill?.inline ? '.agents/skills/PinchGrab/SKILL.md  # triage instructions' : '',
      '```',
      '',
      '## Quick DuckDB',
      '',
      '```sql',
      `CREATE TABLE captures AS SELECT * FROM read_json_auto('${jsonlName}', format='newline_delimited', maximum_object_size=104857600);`,
      "SELECT n, selector, tag, role, hints FROM captures WHERE type = 'selector' LIMIT 20;",
      '```',
      '',
      '## Schema',
      '',
      'Selector lines have `type: "selector"`, `v: 2`, a stable `uid`, top-level identification fields, and an `_audit` namespace nesting detection metadata (ancestors, componentRoot, matchedRules, viewport). Feedback lines link back via `parentUid` and carry their own `uid`. Group heads carry `groupMemberUids: [uid…]`; each group member is a top-level row with `groupUid` pointing back at the head. Bundled `schema.json` is the canonical machine-readable form.',
      '',
    ];
    return lines.join('\n');
  };
  // screenshots.json — proper keyed index instead of the old TSV. Three
  // shapes for three lookup patterns:
  //   • byUid:  uid → { n, selector, url, element?, group?, page?, members? }
  //              "give me every shot for this entry"
  //   • byUrl:  url → { page?, uids[] }
  //              "what page shot covers this URL? which captures landed here?"
  //   • files:  flat list of every PNG path in the archive
  //              "what's in screenshots/ ?"
  // The `inArchive` flag on each file mirrors the tar bundle membership
  // so a consumer downstream of the .tar.zst extraction can tell which
  // paths point INSIDE the archive (relative) vs at on-disk siblings.
  const buildScreenshotsIndex = (bundled: Set<string>, nowIso?: string): string => {
    const byUid: Record<string, any> = {};
    const byUrl: Record<string, {page?: string; uids: string[]}> = {};
    const files: Array<{path: string; archivePath: string | null; kind: 'element' | 'group' | 'page'; uid?: string; n?: number; selector?: string; url?: string}> = [];
    const seenFile = new Set<string>();
    const archiveLeaf = (rel: string): string => `screenshots/${rel.split('/').pop() ?? rel}`;
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      const e = m.entry;
      if (!e.uid) continue;
      const slot: any = {n: e.n, selector: e.selector, url: e.url};
      if (e.screenshot?.element) slot.element = e.screenshot.element;
      if (e.screenshot?.group) slot.group = e.screenshot.group;
      if (e.screenshot?.page) slot.page = e.screenshot.page;
      if (e.group && e.group.length) {
        slot.members = e.group.map((g) => g.uid).filter(Boolean);
      }
      byUid[e.uid] = slot;

      const url = e.url;
      const urlSlot = byUrl[url] ?? (byUrl[url] = {uids: []});
      urlSlot.uids.push(e.uid);
      if (e.screenshot?.page && !urlSlot.page) urlSlot.page = e.screenshot.page;

      const pushFile = (rel: string | undefined, kind: 'element' | 'group' | 'page'): void => {
        if (!rel || seenFile.has(rel)) return;
        seenFile.add(rel);
        const inArchive = bundled.has(rel);
        files.push({
          path: rel,
          archivePath: inArchive ? archiveLeaf(rel) : null,
          kind, uid: e.uid, n: e.n,
          selector: e.selector, url: e.url,
        });
      };
      pushFile(e.screenshot?.element, 'element');
      pushFile(e.screenshot?.group, 'group');
      pushFile(e.screenshot?.page, 'page');
    }
    const out = {
      v: 2,
      kind: 'pinchgrab/screenshots-index',
      generated: nowIso ?? exportNowIso(),
      counts: {
        files: files.length,
        bundled: files.filter((f) => f.archivePath).length,
        captures: Object.keys(byUid).length,
        urls: Object.keys(byUrl).length,
      },
      byUid,
      byUrl,
      files,
    };
    return JSON.stringify(out, null, 2) + '\n';
  };

  // Decode a `data:image/png;base64,...` URL into the raw PNG bytes.
  const dataUrlToBytes = (dataUrl: string): Uint8Array => {
    const comma = dataUrl.indexOf(',');
    if (comma < 0) return new Uint8Array();
    const b64 = dataUrl.slice(comma + 1);
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  };

  // Walk the messages and gather every screenshot we should bundle.
  // Returns the tar entries (each `screenshots/<leaf>.png`) AND the set of
  // workspace-relative PNG paths that landed in the archive (for the
  // manifest's "in-archive" column).
  const collectScreenshotEntries = (): {entries: TarEntry[]; bundled: Set<string>} => {
    const entries: TarEntry[] = [];
    const bundled = new Set<string>();
    const seen = new Set<string>();
    const push = (relPath: string | undefined, dataUrl: string | undefined): void => {
      if (!relPath || !dataUrl) return;
      const leaf = relPath.split('/').pop() ?? relPath;
      if (seen.has(leaf)) return; // dedupe within archive
      const bytes = dataUrlToBytes(dataUrl);
      if (!bytes.length) return;
      entries.push({name: `screenshots/${leaf}`, data: bytes});
      bundled.add(relPath);
      seen.add(leaf);
    };
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      const sel = m.entry.selector;
      const url = m.entry.url;
      push(m.entry.screenshot?.element, shotsFull.get(sel));
      push(m.entry.screenshot?.group, shotsFull.get(sel));
      push(m.entry.screenshot?.page, shotsFull.get('page::' + url));
    }
    return {entries, bundled};
  };

  // Full-page HTML entries (opt-in includePageHTML pref). Collected LAZILY
  // at export time from whichever live tabs still show a captured URL —
  // never persisted to chrome.storage, so big documents can't evict
  // full-res screenshots from the quota. URLs with no live tab are recorded
  // as info-level diagnostics instead of failing the export.
  const pageHtmlSlug = (url: string, taken: Set<string>): string => {
    let slug = 'page';
    try {
      const u = new URL(url);
      slug = `${u.host}${u.pathname}`.replace(/\/+$/, '').replace(/[^\w.-]+/g, '_').slice(0, 80) || u.host;
    } catch { /* keep fallback */ }
    let unique = slug;
    for (let i = 2; taken.has(unique); i++) unique = `${slug}~${i}`;
    taken.add(unique);
    return unique;
  };
  const collectPageHtmlEntries = async (): Promise<{entries: TarEntry[]; pagesMeta: Array<{url: string; archivePath: string; bytes: number}>; diagnostics: ExportDiagnostic[]}> => {
    const entries: TarEntry[] = [];
    const pagesMeta: Array<{url: string; archivePath: string; bytes: number}> = [];
    const diagnostics: ExportDiagnostic[] = [];
    if (!prefs.includePageHTML || !inExtension) return {entries, pagesMeta, diagnostics};
    const urls = new Set<string>();
    for (const m of messages) {
      if (m.type === 'selector' && m.entry.url) urls.add(m.entry.url);
      else if (m.type === 'page' && m.url) urls.add(m.url);
    }
    if (!urls.size) return {entries, pagesMeta, diagnostics};
    let tabs: chrome.tabs.Tab[] = [];
    try { tabs = await chrome.tabs.query({}); } catch { /* fall through to diagnostics */ }
    const taken = new Set<string>();
    for (const url of [...urls].sort()) {
      const tab = tabs.find((t) => t.url === url) ?? tabs.find((t) => (t.url ?? '').split('#')[0] === url.split('#')[0]);
      let html: string | undefined;
      if (tab?.id != null) {
        try {
          const reply = await chrome.tabs.sendMessage(tab.id, pg({kind: 'page-html'})) as {ok?: boolean; html?: string} | undefined;
          if (reply?.ok && reply.html) html = reply.html;
        } catch { /* tab has no live content script */ }
      }
      if (!html) {
        diagnostics.push({severity: 'info', code: 'PAGE_HTML_UNAVAILABLE', detail: url});
        continue;
      }
      const archivePath = `pages/${pageHtmlSlug(url, taken)}.html`;
      entries.push({name: archivePath, data: html});
      pagesMeta.push({url, archivePath, bytes: new TextEncoder().encode(html).length});
    }
    return {entries, pagesMeta, diagnostics};
  };

  const onExportZip = async (): Promise<void> => {
    if (!messages.length) { setStatus('Nothing to export', {kind: 'warn'}); return; }
    // One clock + one content hash per export: every timestamp and the
    // filename stem derive from these so re-exporting unchanged content
    // produces the same filename (overwritten, not duplicated) and — with
    // a frozen clock — byte-identical archives.
    const exportedAtIso = exportNowIso();
    const mtimeSec = Math.floor(Date.parse(exportedAtIso) / 1000);
    const {entries: shotEntries, bundled} = collectScreenshotEntries();
    const contentHash = await computeContentHash(shotEntries.map((e) => e.name));
    const bundleId = contentHash.slice(0, 16);
    const archiveName = buildExportFilename('tar.zst', contentHash.slice(0, 8));
    const stem = archiveName.replace(/\.tar\.zst$/, '');
    const jsonlName = `${stem}.jsonl`;
    const manifestOpts = {nowIso: exportedAtIso, bundleId};
    const manifest = buildManifest(archiveName, 'tar.zst', manifestOpts);
    // Load the tar-bound extras BEFORE the docs render so the README and
    // manifest can describe exactly what ships: vendored skills (+ parsed
    // skills index) and opt-in full-page HTML.
    const skillEntries: TarEntry[] = [];
    let skillsIndex: SkillsIndex | null = null;
    if (prefs.bundleSkills && BUNDLED_SKILLS_PRESENT) {
      const loaded = await Promise.all(BUNDLED_SKILL_FILES.map(async (f) => ({f, data: await loadBundledSkillFile(f.ext)})));
      let skipped = 0;
      for (const {f, data} of loaded) {
        if (data == null) { skipped++; continue; }
        skillEntries.push({name: f.archive, data});
        if (f.archive === 'skills-index.json') {
          try { skillsIndex = JSON.parse(data) as SkillsIndex; } catch { /* unreadable index — table degrades */ }
        }
      }
      if (skipped) console.warn(LOG, `bundled skills: ${skipped}/${loaded.length} files missing from this build — export continues without them`);
    }
    const {entries: pageHtmlEntries, pagesMeta, diagnostics: pageHtmlDiagnostics} = await collectPageHtmlEntries();
    manifest.agentProtocol = {archivePath: 'AGENT-PROTOCOL.md'};
    if (skillsIndex?.skills?.length) {
      manifest.bundledSkills = skillsIndex.skills.map((s) => ({
        id: s.id,
        kind: s.id.startsWith('impeccable/') ? 'reference' as const : 'skill' as const,
        archivePath: s.path,
        ...(s.invoke ? {invocation: s.invoke} : {}),
      }));
    }
    if (pagesMeta.length) {
      manifest.pagesHtml = pagesMeta;
      manifest.counts.pagesHtml = pagesMeta.length;
    }
    if (pageHtmlDiagnostics.length) {
      manifest.exportDiagnostics = [...(manifest.exportDiagnostics ?? []), ...pageHtmlDiagnostics];
    }
    // The JSONL inside the archive must declare itself as part of a
    // tar.zst bundle so its manifest's `design.inline` / `skill.inline`
    // flags match what's actually present in the surrounding tar.
    const jsonlText = buildJsonl(jsonlName, 'tar.zst', manifestOpts);
    const sql = duckDbSnippet(jsonlName);
    const readme = buildReadme(manifest, jsonlName, shotEntries.length);
    const shotsJson = buildScreenshotsIndex(bundled, exportedAtIso);

    // Markdown export was dropped: it carried no data the JSONL didn't
    // already have (the human-readable surface was just a curated subset
    // of the same fields), and the divergence — md silently dropped
    // group children + the entire `_audit` namespace — risked
    // misleading any human skim. README.md inside the archive is the
    // human entry point now.
    // Bug #7: generate repair-index.md as the agent's first-read entry
    // point. Bug #40 first-read order: README points the receiver at
    // repair-index.md before SKILL.md / DESIGN.md.
    const repairIndex = buildRepairIndex(manifest, jsonlName);
    const tarEntries: TarEntry[] = [
      {name: 'README.md', data: readme},
      {name: 'repair-index.md', data: repairIndex},
      {name: jsonlName, data: jsonlText},
      {name: 'screenshots.json', data: shotsJson},
      {name: 'duckdb.sql', data: sql},
      // Bug #28: machine-readable JSON-Schema for every row type.
      {name: 'schema.json', data: buildSchemaJson()},
      ...shotEntries,
    ];
    // DESIGN.md — either the user's customized content or the bundled
    // template / local override. Resolved through the same loader the
    // settings modal uses so chrome.storage stays small (empty prefs
    // → fallback to extension/templates/*.md via fetch).
    const designContent = await resolveDesignContent();
    if (designContent.trim()) {
      tarEntries.push({name: 'DESIGN.md', data: designContent});
    }
    // PinchGrab UI skill — same story. Lives at the canonical receiver
    // path inside the archive so the receiver's `.agents/` tree can be
    // populated by a simple `tar -x` from the archive root.
    //
    // Frontmatter rename: a user's source SKILL.md may use `name: ui`
    // (because that's how it's catalogued in their global `.agents/`
    // skills tree). Inside a PinchGrab archive the skill is *the*
    // PinchGrab skill, so we rebrand the frontmatter `name:` field on
    // the way into the tar without touching the body. Only the FIRST
    // `name:` line inside the leading `---` block is rewritten.
    const skillContent = await resolveSkillContent();
    if (skillContent.trim()) {
      const rebranded = rebrandSkillName(skillContent, 'PinchGrab');
      tarEntries.push({name: '.agents/skills/PinchGrab/SKILL.md', data: rebranded});
    }
    // Vendored skills + opt-in page HTML (loaded above, before the docs).
    tarEntries.push(...skillEntries, ...pageHtmlEntries);
    // AGENT-PROTOCOL.md — the full Send-to-Agent doctrine. Hydrated last so
    // its bundle tree reflects every entry above (plus itself); the same
    // options rebuild the clipboard payload after the save resolves the
    // real absolute archive path.
    const entryNamesForDocs = [...tarEntries.map((e) => e.name), 'AGENT-PROTOCOL.md'].sort();
    const agentPromptOpts = {
      workspace: activeWs,
      bundleId,
      archivePath: archiveName,
      exportTs: exportedAtIso,
      jsonlName,
      counts: {comments: manifest.counts.feedback, selectors: manifest.counts.selectors, pages: manifest.counts.pages, screenshots: shotEntries.length},
      entryNames: entryNamesForDocs,
      designIsTemplate: isUsingTemplateDesign(),
    };
    tarEntries.push({name: 'AGENT-PROTOCOL.md', data: buildAgentProtocolMd({...agentPromptOpts, skillsIndex})});
    // Rebuild the manifest line in the JSONL with archiveIntegrity
    // (file list + sizes). Has to happen AFTER all tarEntries are
    // assembled but BEFORE we tar them, so we know what's in the
    // bundle. Then we replace the JSONL's manifest with the augmented
    // version.
    try {
      const integrity: {files: Array<{path: string; size: number}>} = {files: []};
      for (const e of tarEntries) {
        const data = typeof e.data === 'string' ? new TextEncoder().encode(e.data) : (e.data as Uint8Array);
        integrity.files.push({path: e.name, size: data.length});
      }
      // Re-emit the JSONL with the augmented manifest. Cheaper to do
      // this re-render than to maintain mutable state through the slim
      // emit. We swap the leading manifest line in-place.
      const augmentedManifest = {...manifest, archiveIntegrity: integrity};
      const lines = jsonlText.split('\n');
      lines[0] = JSON.stringify(augmentedManifest);
      const newJsonl = lines.join('\n');
      const idx = tarEntries.findIndex((e) => e.name === jsonlName);
      if (idx >= 0) tarEntries[idx] = {name: jsonlName, data: newJsonl};
    } catch (err) {
      console.warn(LOG, 'archiveIntegrity computation failed', err);
    }

    // Stamp every entry with the export clock so archive bytes are a pure
    // function of content + clock (buildTar would otherwise sample now()).
    for (const e of tarEntries) e.mtime ??= mtimeSec;
    const tarBytes = buildTar(tarEntries);
    const archiveBytes = wrapZstd(tarBytes);

    // Copy the Send-to-Agent payload NOW, while the click's focus is still
    // fresh: the save below can take seconds (screenshot batches, download
    // completion polling) and Chrome's download UI can steal focus, which
    // makes navigator.clipboard writes fail silently. The predicted path is
    // the stable Downloads-relative form (the bootstrap expands the ~);
    // once the save resolves we re-copy with the real absolute path,
    // best-effort — if that one fails, this copy already stands.
    const predictedPath = `~/Downloads/pinchgrab/${activeWs}/exports/${archiveName}`;
    lastExport.agentPrompt = buildAgentPromptJsonl({...agentPromptOpts, archivePath: predictedPath});
    const earlyCopied = await copyToClipboardSilent(lastExport.agentPrompt);

    if (inExtension) {
      console.log(LOG, 'onExportArchive →', {archiveName, tarBytes: tarBytes.length, archiveBytes: archiveBytes.length, screenshots: shotEntries.length});
      // Pass as a plain number[] over sendMessage; structured-clone of
      // Uint8Array via chrome.runtime.sendMessage isn't reliable across
      // Chrome versions.
      const reply = await sendToBg<SaveReply>({
        kind: 'save-bytes', workspace: activeWs, filename: archiveName,
        bytes: Array.from(archiveBytes), mime: 'application/zstd',
      });
      console.log(LOG, 'onExportArchive reply:', reply);
      if (reply?.ok && reply.absPath) {
        lastExport.relPath = reply.filename ?? null;
        lastExport.absPath = reply.absPath;
        lastExport.copyPath = reply.copyPath ?? reply.absPath;
        lastExport.tempPath = Boolean(reply.tempPath);
        lastExport.kind = 'tar.zst';
        updateCopyPathButton();
        // Refresh the already-copied payload with the REAL saved path.
        // Best-effort: focus may be gone by now, and the early copy above
        // already holds a valid payload (predicted ~/Downloads path).
        const pathToCopy = lastExport.copyPath ?? reply.absPath;
        lastExport.agentPrompt = buildAgentPromptJsonl({...agentPromptOpts, archivePath: pathToCopy});
        const lateCopied = await copyToClipboardSilent(lastExport.agentPrompt);
        const promptCopied = lateCopied || earlyCopied;
        const leaf = pathToCopy.replace(/[\\/]+$/, '').split(/[\\/]/).pop() ?? pathToCopy;
        if (promptCopied) showCopied('Sent to agent', 'prompt copied — paste into your coding agent');
        setStatus(
          `Sent to agent · ${shotEntries.length} screenshot${shotEntries.length === 1 ? '' : 's'} bundled${promptCopied ? ' · prompt copied' : ' · clipboard blocked — use Cmd+K → Copy Send-to-Agent prompt'}${lastExport.tempPath ? ' · Playwright temp hidden' : ''} · ${leaf}`,
        );
        return;
      }
      const err = reply?.error ?? 'no reply from background';
      console.error(LOG, 'onExportArchive failed:', err);
      setStatus(`Archive export failed: ${err}`, {kind: 'warn'});
      showDownloadError('Export failed', String(err));
      return;
    }
    // Test/dev fallback: synthesize a download link.
    const blob = new Blob([archiveBytes as unknown as BlobPart], {type: 'application/zstd'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = archiveName; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    lastExport.relPath = archiveName;
    lastExport.absPath = archiveName;
    lastExport.copyPath = archiveName;
    lastExport.tempPath = false;
    lastExport.kind = 'tar.zst';
    updateCopyPathButton();
    // The predicted-path payload was already copied before the save.
    showCopied('Sent to agent', 'prompt copied — paste into your coding agent');
    setStatus(`Sent to agent · ${shotEntries.length} screenshot${shotEntries.length === 1 ? '' : 's'} bundled${earlyCopied ? ' · prompt copied' : ''}`);
  };

  // Best-effort clipboard write — never throws; returns whether the
  // write succeeded so the caller can adjust the status message.
  // Clipboard writes can fail when the panel doesn't have focus or in
  // some test harnesses, and we don't want that to block the export.
  const copyToClipboardSilent = async (text: string): Promise<boolean> => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch { return false; }
  };
  // ─── DuckDB snippet ──────────────────────────────────────────────────────
  // Canonical SQL recipes for querying a JSONL export. Copies to clipboard
  // and prints a status message — we don't run DuckDB ourselves, the user
  // pipes the snippet into `duckdb` on their machine. The recipes target
  // questions a UI-engineer LLM workflow tends to ask: list captures by
  // host, find duplicate outerHTML, find captures missing a screenshot,
  // and unique-token frequency for a quick design-tokens overview.
  const duckDbSnippet = (jsonlName: string): string => `-- PinchGrab → DuckDB recipes
-- Save your JSONL export, then in your shell:
--   duckdb < this_file.sql
-- Or open a duckdb shell and paste these one at a time.

-- 1) Load the JSONL into a table.
--    sample_size=-1 forces a full-file scan for schema inference. Without
--    it, DuckDB only sniffs the first 20 480 rows — and PinchGrab exports
--    mix selector + feedback row types, so rare feedback-only fields
--    (tags, parentUid) can be dropped from the inferred schema if they
--    don't appear early enough. That bites recipe 6 below.
CREATE OR REPLACE TABLE pg AS
SELECT * FROM read_json_auto(
  '${jsonlName}',
  format='newline_delimited',
  maximum_object_size=104857600,
  sample_size=-1
);

-- 2) Quick overview: how many captures per host.
SELECT
  regexp_extract(url, '://([^/]+)', 1) AS host,
  COUNT(*) FILTER (WHERE type = 'selector') AS captures,
  COUNT(*) FILTER (WHERE type = 'feedback') AS comments
FROM pg
GROUP BY 1
ORDER BY captures DESC;

-- 3) Find duplicate outerHTML across captures (often signals a reused
--    component the user has clicked into multiple times).
SELECT outerHTML, COUNT(*) AS hits, list(selector) AS selectors
FROM pg
WHERE type = 'selector' AND outerHTML IS NOT NULL
GROUP BY outerHTML
HAVING hits > 1
ORDER BY hits DESC
LIMIT 25;

-- 4) Captures still missing a screenshot path.
SELECT n, url, selector
FROM pg
WHERE type = 'selector' AND screenshot IS NULL
ORDER BY n;

-- 5) Quick design-token surface: rank classes that appear in many captures.
--    NOTE: filter classes IS NOT NULL rather than using a coalesce-with-empty
--    fallback; DuckDB cannot infer element types for an empty list literal.
WITH expanded AS (
  SELECT unnest(classes) AS c
  FROM pg
  WHERE type = 'selector' AND classes IS NOT NULL
)
SELECT c, COUNT(*) AS hits
FROM expanded
GROUP BY 1
ORDER BY hits DESC
LIMIT 30;

-- 6) Comments joined to their parent selector via parentUid. The
--    s.type filter prevents an accidental feedback↔feedback join in case
--    two rows ever share a uid by coincidence.
SELECT s.n, s.selector, f.text, f.tags
FROM pg f
JOIN pg s
  ON s.uid = f.parentUid
 AND s.type = 'selector'
WHERE f.type = 'feedback'
ORDER BY s.n;
`;
  const onDuckDbSnippet = async (): Promise<void> => {
    // Prefer the JSONL filename of the most recent export so the user can
    // paste this directly without editing the read_json_auto path. Fall
    // back to a fresh epoch-based name if nothing has been exported yet.
    const last = lastExport.relPath;
    const jsonlName = (last && /\.jsonl$/.test(last))
      ? last.split('/').pop()!  // strip workspace/exports/ prefix
      : buildExportFilename('jsonl');
    const sql = duckDbSnippet(jsonlName);
    try {
      await navigator.clipboard.writeText(sql);
      setStatus(`DuckDB recipes copied · paste into \`duckdb\` shell · references ${jsonlName}`);
      showCopied('Copied DuckDB SQL', jsonlName);
    } catch {
      setStatus('Clipboard failed — open the panel in an extension context', {kind: 'warn'});
      showDownloadError('Clipboard failed', 'Open the panel in an extension context');
    }
  };
  // ─── Schema migration ───────────────────────────────────────────────────
  // Convert a v1-shaped Entry-or-export-line into our internal Entry. Idempotent.
  // Supports:
  //   • flat v1 entry (no `_audit`, no `v` field)
  //   • v2 export entry (has `_audit`, `v: 2`, `type: 'selector'`)
  //   • mixed (some fields nested, some flat — last wins for safety)
  // Pure: never mutates `raw` or any of its nested objects. Returns a new
  // entry with all migrations applied. Touched subobjects (attrs, hints,
  // group members) are cloned before edit; untouched ones share refs with
  // raw, which is fine since we never write to them.
  const denormalizeEntry = (raw: any): Entry => {
    const out: any = {...raw};
    delete out.v;
    delete out.type;
    delete out.feedback;
    if (out._audit && typeof out._audit === 'object') {
      const a = out._audit;
      if (a.ancestors !== undefined) out.ancestors = a.ancestors;
      if (a.componentRoot !== undefined) out.componentRoot = a.componentRoot;
      if (a.inShadowDOM !== undefined) out.inShadowDOM = a.inShadowDOM;
      if (a.pseudoElements !== undefined) out.pseudoElements = a.pseudoElements;
      if (a.matchedRules !== undefined) out.matchedRules = a.matchedRules;
      if (a.viewport !== undefined) out.viewport = a.viewport;
      delete out._audit;
    }
    // states: v1 used Record<string, true>; v2 uses string[]. Normalize both.
    if (out.states && !Array.isArray(out.states) && typeof out.states === 'object') {
      out.states = Object.keys(out.states).filter((k) => Boolean((out.states as any)[k]));
    }
    // attrs.format → hints.format. Clone attrs first so we don't mutate the
    // caller's nested object. Same for hints (we may merge into it).
    if (out.attrs && typeof out.attrs === 'object' && typeof out.attrs.format === 'string') {
      const fmt = out.attrs.format;
      const {format: _drop, ...restAttrs} = out.attrs;
      out.attrs = restAttrs;
      out.hints = {...(out.hints ?? {}), format: fmt};
    }
    if (!out.uid) out.uid = msgId();
    if (Array.isArray(out.group)) out.group = out.group.map(denormalizeEntry);
    return out as Entry;
  };
  // Walk all loaded messages and migrate any legacy entries. Returns true if
  // anything mutated so the caller can persist.
  const migrateLoadedMessages = (): boolean => {
    let mutated = false;
    for (const m of messages) {
      if (m.type !== 'selector') continue;
      const before = m.entry;
      // Cheap pre-check: if uid exists AND states is an array AND no _audit
      // AND no attrs.format → nothing to do, skip the work.
      const needsWork =
        !before.uid ||
        (before.states && !Array.isArray(before.states)) ||
        (before as any)._audit !== undefined ||
        (before.attrs && typeof (before.attrs as any).format === 'string');
      if (!needsWork) continue;
      m.entry = denormalizeEntry(before);
      mutated = true;
    }
    return mutated;
  };
  const onImport = (): void => importFile.click();
  importFile.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    snapshot();
    const text = await file.text();
    const imported: PanelMessage[] = [];
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const o = JSON.parse(line);
        if (o.type === 'manifest') {
          // Manifest line — informational only on import. Skip.
          continue;
        }
        if (o.type === 'page') imported.push({type: 'page', id: msgId(), ts: o.ts ?? new Date().toISOString(), url: o.url, title: o.title, viewport: o.viewport, tokens: o.tokens, userAgent: o.userAgent, lang: o.lang});
        else if (o.type === 'feedback') {
          const fb: FeedbackMessage = {
            type: 'feedback', id: msgId(),
            ts: o.ts ?? new Date().toISOString(), text: o.text,
          };
          if (o.parentUid) fb.parentUid = o.parentUid;
          if (o.detached) fb.detached = true;
          if (Array.isArray(o.tags) && o.tags.length) fb.tags = o.tags;
          if (o.severity) fb.severity = o.severity;
          imported.push(fb);
        } else {
          // selector line — could be v1 (flat) or v2 (with _audit). The
          // bundled feedback array must be split out into separate feedback
          // messages for round-trip with v1 readers — but in v2 we already
          // emit standalone feedback lines, so dropping the bundled list is
          // safe to avoid double-counting.
          const fb = Array.isArray(o.feedback) ? o.feedback : null;
          const entry = denormalizeEntry(o);
          imported.push({type: 'selector', id: msgId(), ts: o.ts ?? new Date().toISOString(), entry});
          // Only inflate bundled feedback if the file is v1 (no version
          // marker on the selector lines). v2 has its own standalone
          // feedback lines that arrive separately.
          if (fb && o.v !== 2) {
            for (const t of fb) imported.push({
              type: 'feedback', id: msgId(),
              ts: o.ts ?? new Date().toISOString(),
              text: typeof t === 'string' ? t : t?.text ?? '',
              parentUid: entry.uid,
            });
          }
        }
      } catch { /* skip bad line */ }
    }
    messages = [...messages, ...imported];
    persist();
    await runValidation();
    render();
    setStatus(`Imported ${imported.length} message${imported.length === 1 ? '' : 's'}`);
    importFile.value = '';
  });
  // ─── Workspace snapshot history ─────────────────────────────────────────
  // Persistent (not the in-session undo stack). A Clear-all archives the
  // current workspace state so it can be restored from Settings later.
  let wsSnapshots: WorkspaceSnapshot[] = [];
  const loadWsSnapshots = async (name: string): Promise<void> => {
    wsSnapshots = (await Store.get<WorkspaceSnapshot[]>(wsSnapshotsKey(name), [])) || [];
  };
  const persistWsSnapshots = (): void => { void Store.set(wsSnapshotsKey(activeWs), wsSnapshots); };
  // Archive the CURRENT workspace state (before it's wiped). No-op if empty.
  const archiveWorkspaceSnapshot = (): WorkspaceSnapshot | null => {
    if (!messages.length) return null;
    const snap: WorkspaceSnapshot = {
      id: secureToken(8),
      ts: new Date().toISOString(),
      messages: structuredClone(messages),
      shots: Object.fromEntries(shots),
      selectors: messages.filter((m) => m.type === 'selector').length,
      comments: messages.filter((m) => m.type === 'feedback').length,
    };
    // Newest first; cap the history.
    wsSnapshots.unshift(snap);
    if (wsSnapshots.length > WS_SNAPSHOT_CAP) wsSnapshots = wsSnapshots.slice(0, WS_SNAPSHOT_CAP);
    persistWsSnapshots();
    return snap;
  };
  const restoreWorkspaceSnapshot = (id: string): boolean => {
    const snap = wsSnapshots.find((s) => s.id === id);
    if (!snap) return false;
    // Push the live state onto the in-session undo stack so a mistaken
    // restore is itself undoable.
    snapshot();
    messages = structuredClone(snap.messages);
    shots.clear();
    for (const [k, v] of Object.entries(snap.shots)) shots.set(k, v);
    shotsFull.clear();
    selectorValidity.clear();
    insertBefore.current = null;
    persistShots();
    persistShotsFull();
    persist();
    render();
    renderWsControls();
    setStatus(`Restored snapshot · ${snap.selectors} selectors`);
    return true;
  };
  const deleteWorkspaceSnapshot = (id: string): void => {
    wsSnapshots = wsSnapshots.filter((s) => s.id !== id);
    persistWsSnapshots();
    renderWsControls();
  };

  const onClear = (): void => {
    if (!confirm('Clear all captures? A snapshot will be saved to Settings → Workspaces first.')) return;
    // Archive the workspace BEFORE wiping so it can be restored later.
    const snap = archiveWorkspaceSnapshot();
    snapshot();
    messages = [];
    liveTabUrl = null;
    selectorValidity.clear();
    insertBefore.current = null;
    shots.clear();
    shotsFull.clear();
    persistShots();
    persistShotsFull();
    persist();
    render();
    renderWsControls();
    // Never claim a snapshot that didn't happen (empty workspace no-ops).
    setStatus(snap ? 'Cleared · snapshot saved — restore in Settings → Workspaces' : 'Cleared');
  };

  // ─── Validation ─────────────────────────────────────────────────────────
  const runValidation = async (): Promise<void> => {
    const selectors = [...new Set(messages.filter((m): m is SelectorMessage => m.type === 'selector').map((m) => m.entry.selector))];
    if (!selectors.length || !inExtension) return;
    try {
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      if (!tabs[0]) return;
      liveTabUrl = tabs[0].url ?? liveTabUrl;
      liveTabPath = pathOf(liveTabUrl ?? '');
      const reply = await chrome.tabs.sendMessage(tabs[0].id!, pg({kind: 'validate', selectors})) as {valid?: Record<string, boolean>};
      if (reply?.valid) {
        for (const [sel, ok] of Object.entries(reply.valid)) {
          selectorValidity.set(sel, ok);
          if (!ok) selectorErrors.set(sel, 'No element on the live page matches this selector.');
        }
        render();
      }
    } catch { /* tab not ready */ }
  };
  const onValidate = async (): Promise<void> => {
    setStatus('Re-checking…', {kind: 'info'});
    await runValidation();
    setStatus('Validated');
  };

  // (Screenshot machinery removed alongside the .preview tile.)

  // ─── GitHub stars ───────────────────────────────────────────────────────
  const fetchStars = async (): Promise<void> => {
    const cacheKey = 'pinchgrab.gh.stars';
    const cached = await Store.get<{count: number; ts: number} | null>(cacheKey, null);
    if (cached && Date.now() - cached.ts < 3_600_000) {
      starsEl.textContent = String(cached.count);
      return;
    }
    try {
      const r = await fetch('https://api.github.com/repos/wranngle/pinchgrab', {cache: 'no-store'});
      if (!r.ok) throw new Error('status ' + r.status);
      const j = await r.json() as {stargazers_count?: number};
      const count = j.stargazers_count ?? 0;
      starsEl.textContent = String(count);
      void Store.set(cacheKey, {count, ts: Date.now()});
    } catch { starsEl.textContent = '·'; }
  };
  const onGithub = (): void => {
    const url = 'https://github.com/wranngle/pinchgrab';
    if (inExtension) chrome.tabs.create({url});
    else window.open(url, '_blank', 'noopener');
  };

  // Re-inject the content script into the active tab — the recovery path
  // for "Alt+Click stopped working" (an extension reload orphans the page's
  // script). Refreshing an attached tab re-injects automatically; this
  // covers every other case without hunting for the toolbar icon.
  const onReattach = async (): Promise<void> => {
    if (!inExtension) { setStatus('Re-attach only works inside the extension', {kind: 'warn'}); return; }
    const reply = await sendToBg<{ok: boolean; error?: string}>({kind: 'pg-reinject'});
    if (reply?.ok) setStatus('Re-attached — Alt+Click is live');
    else setStatus(`Couldn't re-attach — click the PinchGrab toolbar button on the page${reply?.error ? ` · ${reply.error}` : ''}`, {kind: 'warn'});
  };

  // ─── Quiet-saves nudge ────────────────────────────────────────────────────
  // quietSaves defaults ON as intent, but the optional downloads.ui
  // permission Chrome demands can only be requested inside a user gesture.
  // This banner is that gesture: shown while the pref is on, the permission
  // is missing, and the user hasn't dismissed it.
  const quietNudge = document.querySelector<HTMLElement>('[data-quiet-nudge]');
  const maybeShowQuietNudge = async (): Promise<void> => {
    if (!quietNudge || !inExtension || !chrome.permissions?.contains) return;
    if (!prefs.quietSaves || prefs.quietNudgeDismissed) { quietNudge.hidden = true; return; }
    try {
      const granted = await chrome.permissions.contains({permissions: ['downloads.ui']});
      quietNudge.hidden = granted;
    } catch { quietNudge.hidden = true; }
  };
  const onQuietEnable = async (): Promise<void> => {
    let granted = false;
    try { granted = await chrome.permissions.request({permissions: ['downloads.ui']}); }
    catch (err) { console.warn(LOG, 'downloads.ui permission request failed', err); }
    prefs.quietSaves = granted;
    if (!granted) prefs.quietNudgeDismissed = true; // declined once — never nag again
    persistPrefs();
    applyPrefsToUI();
    if (quietNudge) quietNudge.hidden = true;
    setStatus(granted ? 'Quiet saves on — no more download popups' : 'Saves stay visible — re-enable in Settings → Capture', granted ? {} : {kind: 'info'});
  };
  const onQuietDismiss = (): void => {
    prefs.quietSaves = false;
    prefs.quietNudgeDismissed = true;
    persistPrefs();
    applyPrefsToUI();
    if (quietNudge) quietNudge.hidden = true;
  };

  // ─── Settings drawer / workspaces ───────────────────────────────────────
  const applyPrefsToUI = (): void => {
    for (const el of drawer.querySelectorAll<HTMLInputElement>('input[data-pref]')) {
      el.checked = Boolean(prefs[el.dataset.pref as keyof Prefs]);
    }
    for (const el of drawer.querySelectorAll<HTMLTextAreaElement>('textarea[data-pref-text]')) {
      el.value = String(prefs[el.dataset.prefText as keyof Prefs] ?? '');
    }
    // Plain-text inputs (designPath, skillPath) also use data-pref-text.
    for (const el of drawer.querySelectorAll<HTMLInputElement>('input[type="text"][data-pref-text]')) {
      el.value = String(prefs[el.dataset.prefText as keyof Prefs] ?? '');
    }
    updateDesignMdStatus();
  };
  // Render the design-md / skill-md status labels and the template-banner
  // so the user sees at a glance whether they're shipping a customized
  // file vs. falling back to the bundled template. Async because we
  // need to read the bundled file's size to display "template · N lines"
  // even when prefs is empty.
  const updateMdStatuses = async (): Promise<void> => {
    const designEl = document.querySelector<HTMLElement>('[data-design-md-status]');
    const skillEl = document.querySelector<HTMLElement>('[data-skill-md-status]');
    const designBanner = document.querySelector<HTMLElement>('[data-template-banner="design"]');
    const skillBanner = document.querySelector<HTMLElement>('[data-template-banner="skill"]');
    const tag = (md: string, isTpl: boolean): string => {
      const lines = md.split('\n').length;
      const bytes = new Blob([md]).size;
      return `${isTpl ? 'template' : 'custom'} · ${lines} lines · ${(bytes / 1024).toFixed(1)} KB`;
    };
    if (designEl) {
      const content = await resolveDesignContent();
      designEl.textContent = content.trim() ? tag(content, isUsingTemplateDesign()) : '(empty)';
      designEl.classList.toggle('has-content', !isUsingTemplateDesign());
    }
    if (skillEl) {
      const content = await resolveSkillContent();
      skillEl.textContent = content.trim() ? tag(content, isUsingTemplateSkill()) : '(empty)';
      skillEl.classList.toggle('has-content', !isUsingTemplateSkill());
    }
    if (designBanner) designBanner.hidden = !isUsingTemplateDesign();
    if (skillBanner) skillBanner.hidden = !isUsingTemplateSkill();
    // Also refresh the compact preview text on the editor-row button.
    await renderMdPreview('design');
    await renderMdPreview('skill');
  };
  // Back-compat alias — earlier code paths called updateDesignMdStatus().
  const updateDesignMdStatus = (): void => { void updateMdStatuses(); };

  // ─── Compact preview + modal editor for DESIGN.md / SKILL.md ───────────
  // Replaces the giant inline textareas with small document summaries.
  type MdKind = 'design' | 'skill';
  const markdownOverview = (content: string, kind: MdKind, usingTemplate: boolean): string => {
    const lines = content.trim() ? content.split('\n').length : 0;
    const bytes = new Blob([content]).size;
    const headings = content
      .split('\n')
      .map((line) => /^#{1,3}\s+(.+)$/.exec(line.trim())?.[1]?.trim())
      .filter((heading): heading is string => Boolean(heading))
      .slice(0, 4);
    // Warm, plain-language framing of what each file teaches the agent.
    // DESIGN.md is the headline artifact: it's where you describe your own
    // brand and UI taste so the agent builds in *your* voice rather than a
    // generic default. SKILL.md is the advanced triage guide for reading
    // exports — useful, but not where most people should start.
    const label = kind === 'design'
      ? 'Teaches your agent to build UI in your brand'
      : 'Advanced: how your agent should read PinchGrab exports';
    const source = usingTemplate
      ? (kind === 'design' ? 'Starter template — make it yours' : 'Bundled template')
      : 'Customized';
    const sections = headings.length ? headings.join(' / ') : 'No section headings found';
    return `${label}\n${source} · ${lines.toLocaleString()} lines · ${(bytes / 1024).toFixed(1)} KB\nSections: ${sections}`;
  };

  const renderMdPreview = async (kind: 'design' | 'skill'): Promise<void> => {
    const previewEl = document.querySelector<HTMLElement>(`[data-md-preview="${kind}"]`);
    if (!previewEl) return;
    const content = kind === 'design' ? await resolveDesignContent() : await resolveSkillContent();
    const usingTemplate = kind === 'design' ? isUsingTemplateDesign() : isUsingTemplateSkill();
    previewEl.textContent = markdownOverview(content, kind, usingTemplate);
  };

  const openMdModal = async (kind: MdKind): Promise<void> => {
    const overlay = document.querySelector<HTMLElement>('[data-md-modal]');
    if (!overlay) return;
    const titleEl = overlay.querySelector<HTMLElement>('[data-md-modal-title]')!;
    const taEl = overlay.querySelector<HTMLTextAreaElement>('[data-md-modal-textarea]')!;
    const statsEl = overlay.querySelector<HTMLElement>('[data-md-modal-stats]')!;
    const bannerEl = overlay.querySelector<HTMLElement>('[data-md-modal-banner]')!;
    const summaryEl = overlay.querySelector<HTMLElement>('[data-md-modal-summary]')!;
    const saveBtn = overlay.querySelector<HTMLButtonElement>('[data-md-modal-save]')!;
    const resetBtn = overlay.querySelector<HTMLButtonElement>('[data-md-modal-reset]')!;
    const uploadBtn = overlay.querySelector<HTMLButtonElement>('[data-md-modal-upload]')!;
    const downloadBtn = overlay.querySelector<HTMLButtonElement>('[data-md-modal-download]')!;
    const closeBtn = overlay.querySelector<HTMLButtonElement>('[data-md-modal-close]')!;

    const isDesign = kind === 'design';
    const initial = isDesign ? await resolveDesignContent() : await resolveSkillContent();
    const usingTemplate = isDesign ? isUsingTemplateDesign() : isUsingTemplateSkill();
    titleEl.textContent = isDesign ? 'DESIGN.md' : 'PinchGrab SKILL.md';
    taEl.value = initial;
    overlay.dataset.kind = kind;

    const refreshStats = (): void => {
      const text = taEl.value;
      const lines = text.split('\n').length;
      const bytes = new Blob([text]).size;
      statsEl.textContent = `${lines} lines · ${(bytes / 1024).toFixed(1)} KB`;
      summaryEl.textContent = markdownOverview(text, kind, usingTemplate);
    };
    refreshStats();
    bannerEl.hidden = !usingTemplate;
    bannerEl.textContent = usingTemplate
      ? `⚠ Currently shipping the bundled ${isDesign ? 'DESIGN.md' : 'SKILL.md'} template — edits here become your customized version.`
      : '';
    taEl.oninput = refreshStats;

    const onSave = (): void => {
      const text = taEl.value;
      // Save empty string → revert to template fallback. Anything non-empty
      // → user customization (persisted in chrome.storage).
      if (isDesign) prefs.designMd = text;
      else prefs.skillMd = text;
      persistPrefs();
      void updateMdStatuses();
      setStatus(`${isDesign ? 'DESIGN.md' : 'SKILL.md'} saved`);
      closeMdModal();
    };
    const onReset = (): void => {
      taEl.value = ''; // empty = fallback to bundled template
      refreshStats();
      bannerEl.hidden = false;
      bannerEl.textContent = 'Cleared — Save to revert to bundled template, or paste new content.';
    };
    const onUpload = (): void => {
      const inputId = isDesign ? 'design-md-file' : 'skill-md-file';
      (document.getElementById(inputId) as HTMLInputElement | null)?.click();
    };
    const onDownload = (): void => {
      const name = isDesign ? 'DESIGN.template.md' : 'PinchGrab.SKILL.template.md';
      downloadText(name, taEl.value);
    };

    saveBtn.onclick = onSave;
    resetBtn.onclick = onReset;
    uploadBtn.onclick = onUpload;
    downloadBtn.onclick = onDownload;
    closeBtn.onclick = closeMdModal;
    overlay.hidden = false;
    requestAnimationFrame(() => taEl.focus());
  };

  const closeMdModal = (): void => {
    const overlay = document.querySelector<HTMLElement>('[data-md-modal]');
    if (overlay) overlay.hidden = true;
  };

  const downloadText = (filename: string, text: string, mime = 'text/markdown'): void => {
    const blob = new Blob([text], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const wireMdFileInput = (id: string, prefKey: 'designMd' | 'skillMd', label: string): void => {
    const fileInput = document.getElementById(id) as HTMLInputElement | null;
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setStatus(`${label} too large (${(file.size / 1024 / 1024).toFixed(1)} MB > 5 MB cap)`, {kind: 'warn'});
        fileInput.value = '';
        return;
      }
      const text = await file.text();
      (prefs as any)[prefKey] = text;
      persistPrefs();
      applyPrefsToUI();
      setStatus(`${label} uploaded · ${file.name} · ${(file.size / 1024).toFixed(1)} KB`);
      fileInput.value = '';
    });
  };
  wireMdFileInput('design-md-file', 'designMd', 'DESIGN.md');
  wireMdFileInput('skill-md-file', 'skillMd', 'SKILL.md');
  drawer?.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    if ((t as HTMLInputElement).dataset?.pref) {
      const key = t.dataset.pref!;
      const checked = Boolean((t as HTMLInputElement).checked);
      // Quiet saves needs the optional downloads.ui permission; request it
      // inside this user gesture and revert the checkbox on decline.
      if (key === 'quietSaves' && checked && inExtension && chrome.permissions?.request) {
        void (async () => {
          let granted = false;
          try { granted = await chrome.permissions.request({permissions: ['downloads.ui']}); }
          catch (err) { console.warn(LOG, 'downloads.ui permission request failed', err); }
          prefs.quietSaves = granted;
          (t as HTMLInputElement).checked = granted;
          persistPrefs();
          setStatus(granted ? 'Quiet saves on — no more download popups' : 'Permission declined — saves stay visible', granted ? {} : {kind: 'warn'});
        })();
        return;
      }
      (prefs as any)[key] = checked;
      persistPrefs();
      render();
      return;
    }
    if (t.dataset?.prefText) {
      (prefs as any)[t.dataset.prefText] = (t as HTMLTextAreaElement).value;
      persistPrefs();
    }
  });
  // Textarea inputs also fire `input` events as the user types — we want to
  // save those incrementally so a panel reload doesn't lose half-typed
  // entries. `change` only fires on blur for textareas.
  drawer?.addEventListener('input', (e) => {
    const t = e.target as HTMLTextAreaElement;
    if (t?.dataset?.prefText) {
      (prefs as any)[t.dataset.prefText] = t.value;
      persistPrefs();
    }
  });
  const openDrawer = (): void => { drawer.hidden = false; renderWsControls(); };
  const closeDrawer = (): void => { drawer.hidden = true; };

  // Reusable create-workspace flow: validates uniqueness, persists, switches.
  // Shared by the settings Create button and the header dropdown's
  // "+ New workspace" action so both paths behave identically.
  const createWorkspaceFlow = async (name: string): Promise<boolean> => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (workspaces.find((w) => w.name === trimmed)) {
      setStatus('Already exists', {kind: 'warn'});
      return false;
    }
    workspaces.push({name: trimmed, createdAt: new Date().toISOString()});
    persistWorkspaces();
    await loadWorkspace(trimmed);
    render();
    renderWsControls();
    setStatus(`Created workspace "${trimmed}"`);
    return true;
  };

  const renderWsControls = (): void => {
    if (!wsSelect) return;
    wsSelect.innerHTML = '';
    for (const w of workspaces) {
      const opt = document.createElement('option');
      opt.value = w.name;
      opt.textContent = w.name;
      if (w.name === activeWs) opt.selected = true;
      wsSelect.append(opt);
    }
    // Inline "+ New workspace" action so users can spin up a workspace
    // straight from the header switcher without opening settings. Handled
    // as a sentinel value in the change listener below.
    const newOpt = document.createElement('option');
    newOpt.value = '__new_workspace__';
    newOpt.textContent = '+ New workspace';
    wsSelect.append(newOpt);
    if (!wsList) return;
    wsList.innerHTML = '';
    for (const w of workspaces) {
      const li = document.createElement('li');
      if (w.name === activeWs) li.classList.add('active');
      li.dataset.tip = w.name === activeWs
        ? `Active workspace: ${w.name}`
        : `Switch to workspace "${w.name}"`;
      // Whole row is the switch trigger — no dedicated check button.
      li.addEventListener('click', async (e) => {
        // Ignore clicks on inner controls (the delete button below).
        if ((e.target as HTMLElement).closest('button')) return;
        focusWorkspaceTab(w.name);
        if (w.name === activeWs) return;
        await loadWorkspace(w.name);
        render();
      });
      const name = document.createElement('span');
      name.className = 'ws-name';
      name.textContent = w.name;
      li.append(name);
      const meta = document.createElement('span');
      meta.className = 'ws-meta';
      meta.textContent = new Date(w.createdAt).toLocaleDateString();
      li.append(meta);
      if (workspaces.length > 1) {
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'danger';
        del.dataset.tip = 'Delete this workspace and everything in it';
        del.setAttribute('aria-label', `Delete workspace ${w.name}`);
        del.innerHTML = PG_ICONS.svgString('trash-2', 13);
        del.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm(`Delete workspace "${w.name}" and all its captures?`)) return;
          workspaces = workspaces.filter((x) => x.name !== w.name);
          persistWorkspaces();
          if (inExtension) chrome.storage.local.remove([wsMsgKey(w.name), wsShotsKey(w.name), wsShotsFullKey(w.name), wsSnapshotsKey(w.name)]).catch(() => { /* ignore */ });
          if (activeWs === w.name) await loadWorkspace(workspaces[0]!.name);
          render();
        });
        li.append(del);
      }
      wsList.append(li);
    }
    renderWsSnapshotHistory();
  };

  // Render the active workspace's snapshot history (Clear-all archives) with
  // a Restore action. Appended under the workspace list in Settings.
  const renderWsSnapshotHistory = (): void => {
    const host = document.querySelector<HTMLElement>('[data-ws-snapshots]');
    if (!host) return;
    host.innerHTML = '';
    if (!wsSnapshots.length) {
      host.hidden = true;
      return;
    }
    host.hidden = false;
    const head = document.createElement('div');
    head.className = 'ws-snap-head';
    head.textContent = `Snapshot history · ${wsSnapshots.length}`;
    head.dataset.tip = 'Restorable snapshots saved before each Clear-all';
    host.append(head);
    const ul = document.createElement('ul');
    ul.className = 'ws-snap-list';
    for (const snap of wsSnapshots) {
      const li = document.createElement('li');
      const meta = document.createElement('span');
      meta.className = 'ws-snap-meta';
      meta.textContent = `${new Date(snap.ts).toLocaleString()} · ${snap.selectors} sel · ${snap.comments} cmt`;
      li.append(meta);
      const restore = document.createElement('button');
      restore.type = 'button';
      restore.className = 'ws-snap-restore';
      restore.textContent = 'Restore';
      restore.dataset.tip = 'Restore this snapshot into the current workspace (current state is kept on the undo stack)';
      restore.addEventListener('click', (e) => {
        e.stopPropagation();
        if (messages.length && !confirm('Restore this snapshot? The current captures will be replaced (undoable).')) return;
        restoreWorkspaceSnapshot(snap.id);
      });
      li.append(restore);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'danger ws-snap-del';
      del.dataset.tip = 'Delete this snapshot';
      del.setAttribute('aria-label', 'Delete snapshot');
      del.innerHTML = PG_ICONS.svgString('trash-2', 12);
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteWorkspaceSnapshot(snap.id);
      });
      li.append(del);
      ul.append(li);
    }
    host.append(ul);
  };
  wsSelect?.addEventListener('change', async (e) => {
    const value = (e.target as HTMLSelectElement).value;
    if (value === '__new_workspace__') {
      // Reset the select back to the active workspace first so the sentinel
      // never sticks as the displayed value if the prompt is cancelled.
      renderWsControls();
      const name = (window.prompt('New workspace name') ?? '').trim();
      if (name) await createWorkspaceFlow(name);
      return;
    }
    await loadWorkspace(value);
    focusWorkspaceTab(value);
    render();
  });

  // ─── Command palette ────────────────────────────────────────────────────
  type Command = {id: string; label: string; run: () => void};
  const COMMANDS: Command[] = [
    {id: 'copy-all', label: 'Copy all as JSONL', run: () => void onCopyAll()},
    {id: 'export', label: 'Download JSONL file', run: () => void onExport()},
    {id: 'export-zip', label: 'Send to Agent — export .tar.zst + copy the agent prompt', run: () => void onExportZip()},
    {id: 'copy-path', label: 'Copy path of last export', run: () => void onCopyPath()},
    {id: 'copy-agent-prompt', label: 'Copy Send-to-Agent prompt (last export)', run: () => {
      void (async () => {
        if (!lastExport.agentPrompt) { setStatus('No export yet — Send to Agent first', {kind: 'warn'}); return; }
        const ok = await copyToClipboardSilent(lastExport.agentPrompt);
        setStatus(ok ? 'Agent prompt copied' : 'Clipboard unavailable', ok ? {} : {kind: 'warn'});
      })();
    }},
    {id: 'duckdb', label: 'Generate DuckDB query snippet (SQL recipes)', run: () => void onDuckDbSnippet()},
    {id: 'import', label: 'Import JSONL file', run: onImport},
    {id: 'validate', label: 'Re-check selectors', run: () => void onValidate()},
    {id: 'reattach', label: 'Re-attach to page (fix Alt+Click)', run: () => void onReattach()},
    {id: 'reload-extension', label: 'Reload the PinchGrab extension (last resort)', run: () => { if (inExtension) chrome.runtime.reload(); }},
    {id: 'clear', label: 'Clear all captures', run: onClear},
    {id: 'settings', label: 'Open settings', run: openDrawer},
    {id: 'github', label: 'Open GitHub repo', run: onGithub},
    {id: 'manual', label: 'Manual capture (start composer with `> selector`)', run: () => { composer.value = '> '; composer.focus(); updateComposerMeter(); }},
    {id: 'undo', label: 'Undo', run: undo},
    {id: 'redo', label: 'Redo', run: redo},
  ];
  const renderPalette = (q = ''): void => {
    paletteList.innerHTML = '';
    const ql = q.toLowerCase();
    const items = [
      ...COMMANDS.filter((c) => !ql || c.label.toLowerCase().includes(ql))
        .map((c) => ({label: c.label, preview: 'command', run: c.run})),
      ...messages.filter((m): m is SelectorMessage => m.type === 'selector' && (!ql ||
        (m.entry.selector + ' ' + (m.entry.text ?? '') + ' ' + (m.entry.componentRoot ?? ''))
          .toLowerCase().includes(ql)))
        .slice(0, 30)
        .map((m) => {
          const fb = collectFeedbackAfter(m.id);
          const preview = (m.entry.text ?? fb[0] ?? m.entry.componentRoot ?? m.entry.selector ?? '').slice(0, 80);
          return {
            label: `#${m.entry.n} ${m.entry.componentRoot ?? m.entry.selector}`,
            preview,
            run: () => {
              closePalette();
              scrollMessageIntoView(m.id);
              void sendToCS({kind: 'scroll-to', selector: m.entry.selector});
            },
          };
        }),
    ];
    items.forEach((it, i) => {
      const li = document.createElement('li');
      const lbl = document.createElement('span');
      lbl.className = 'label';
      lbl.innerHTML = highlightMatch(it.label, q);
      li.append(lbl);
      const p = document.createElement('span');
      p.className = 'preview';
      p.innerHTML = highlightMatch(it.preview ?? '', q);
      li.append(p);
      const kbd = document.createElement('span');
      kbd.className = 'kbd';
      kbd.textContent = '↵';
      li.append(kbd);
      if (i === 0) li.classList.add('active');
      li.addEventListener('click', () => { it.run(); });
      paletteList.append(li);
    });
  };
  const openPalette = (preset = ''): void => {
    palette.hidden = false;
    paletteInput.value = preset;
    renderPalette(preset);
    paletteInput.focus();
    paletteInput.setSelectionRange(preset.length, preset.length);
  };
  const closePalette = (): void => { palette.hidden = true; };
  paletteInput.addEventListener('input', () => renderPalette(paletteInput.value));
  paletteInput.addEventListener('keydown', (e) => {
    const items = [...paletteList.children];
    let active = items.findIndex((li) => li.classList.contains('active'));
    if (e.key === 'ArrowDown') { e.preventDefault(); for (const li of items) li.classList.remove('active'); active = Math.min(items.length - 1, active + 1); items[active]?.classList.add('active'); }
    if (e.key === 'ArrowUp') { e.preventDefault(); for (const li of items) li.classList.remove('active'); active = Math.max(0, active - 1); items[active]?.classList.add('active'); }
    if (e.key === 'Enter') { e.preventDefault(); (items[active] as HTMLElement | undefined)?.click(); }
    if (e.key === 'Escape') closePalette();
  });
  palette.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });

  // ─── Context strip (hover help) ─────────────────────────────────────────
  // Replaces the old floating cursor tooltip: [data-tip] hover text is
  // written into the fixed strip under the header, so help never occludes
  // other controls and can't strand mid-screen through re-renders.
  const TIP_IDLE = 'Alt+Click on the page to capture · hover any control for help';
  let tipFor: HTMLElement | null = null;
  // The settings drawer overlays the strip (position:absolute, inset 0), so
  // hover help for drawer controls lands in a second sink inside the
  // drawer header. Both sinks always receive the same text.
  const drawerTipEl = document.querySelector<HTMLElement>('[data-drawer-tip]');
  const showTip = (target: HTMLElement): void => {
    const text = target.getAttribute('data-tip');
    if (!text) return;
    tooltipEl.textContent = text;
    tooltipEl.dataset.shown = 'true';
    if (drawerTipEl) { drawerTipEl.textContent = text; drawerTipEl.dataset.shown = 'true'; }
  };
  const hideTip = (): void => {
    tipFor = null;
    tooltipEl.textContent = TIP_IDLE;
    tooltipEl.dataset.shown = 'false';
    if (drawerTipEl) { drawerTipEl.textContent = ''; drawerTipEl.dataset.shown = 'false'; }
  };
  document.addEventListener('mouseover', (e) => {
    const t = (e.target as HTMLElement).closest('[data-tip]') as HTMLElement | null;
    if (!t || t === tipFor) return;
    tipFor = t;
    showTip(t);
  });
  document.addEventListener('mouseout', (e) => {
    const t = (e.target as HTMLElement).closest('[data-tip]') as HTMLElement | null;
    if (t && t === tipFor && !t.contains(e.relatedTarget as Node)) hideTip();
  });
  // Re-renders can drop the hovered node without ever firing mouseout
  // (render() resets list.innerHTML, confirm buttons replaceWith); reset
  // the strip to its idle hint when that happens.
  const tipGuard = new MutationObserver(() => {
    if (tipFor && !tipFor.isConnected) hideTip();
  });
  tipGuard.observe(document.body, {childList: true, subtree: true});

  // ─── Stat drilldowns ────────────────────────────────────────────────────
  const appendHeading = (root: ParentNode, text: string): void => {
    const h = document.createElement('h5');
    h.textContent = text;
    root.append(h);
  };
  const appendBold = (root: ParentNode, text: string): void => {
    const b = document.createElement('b');
    b.textContent = text;
    root.append(b);
  };
  const appendCode = (root: ParentNode, text: string): void => {
    const code = document.createElement('code');
    code.textContent = text;
    root.append(code);
  };
  const buildDrilldown = (kind: string): DocumentFragment => {
    const frag = document.createDocumentFragment();
    if (kind === 'selectors') {
      appendHeading(frag, 'Selectors by quality');
      const buckets = {id: 0, testid: 0, class: 0, nth: 0, tag: 0};
      for (const m of messages) {
        if (m.type !== 'selector') continue;
        const e = m.entry;
        if (e.testId) buckets.testid++;
        else if (e.id || /^#[\w-]+$/.test(e.selector)) buckets.id++;
        else if ((e.selector ?? '').includes(':nth-of-type')) buckets.nth++;
        else if (/\./.test(e.selector ?? '')) buckets.class++;
        else buckets.tag++;
      }
      const ul = document.createElement('ul');
      for (const [value, label] of [
        [buckets.testid, ' data-testid'],
        [buckets.id, ' stable id'],
        [buckets.class, ' class-based'],
        [buckets.nth, ' nth-of-type'],
        [buckets.tag, ' tag-only'],
      ] as const) {
        const li = document.createElement('li');
        appendBold(li, String(value));
        li.append(label);
        ul.append(li);
      }
      frag.append(ul);
    } else if (kind === 'stale') {
      appendHeading(frag, 'Stale captures');
      const ul = document.createElement('ul');
      const stale = messages.filter((m): m is SelectorMessage => m.type === 'selector' && selectorValidity.get(m.entry.selector) === false);
      if (!stale.length) {
        const li = document.createElement('li');
        li.textContent = 'None - everything resolves.';
        ul.append(li);
      } else for (const m of stale) {
        const li = document.createElement('li');
        appendBold(li, `#${m.entry.n}`);
        li.append(' ');
        appendCode(li, (m.entry.selector ?? '').slice(0, 50));
        ul.append(li);
      }
      frag.append(ul);
    } else if (kind === 'comments') {
      appendHeading(frag, 'Comments');
      const ul = document.createElement('ul');
      const fbs = messages.filter((m): m is FeedbackMessage => m.type === 'feedback');
      const total = document.createElement('li');
      total.append('Total words: ');
      appendBold(total, String(fbs.reduce((s, m) => s + wordCount(m.text), 0)));
      ul.append(total);
      const avg = document.createElement('li');
      avg.append('Average length: ');
      appendBold(avg, String(fbs.length ? Math.round(fbs.reduce((s, m) => s + m.text.length, 0) / fbs.length) : 0));
      avg.append(' chars');
      ul.append(avg);
      frag.append(ul);
    } else if (kind === 'pages') {
      appendHeading(frag, 'Pages');
      const ul = document.createElement('ul');
      const seen = new Map<string, number>();
      for (const m of messages) if (m.type === 'selector') seen.set(m.entry.url, (seen.get(m.entry.url) ?? 0) + 1);
      for (const [url, n] of seen) {
        const li = document.createElement('li');
        appendBold(li, String(n));
        li.append(` selector${n === 1 ? '' : 's'} · `);
        appendCode(li, pathOf(url));
        ul.append(li);
      }
      frag.append(ul);
    }
    return frag;
  };
  const showDrilldown = (target: HTMLElement): void => {
    const kind = target.getAttribute('data-stat');
    if (!kind) return;
    drilldownEl.replaceChildren(buildDrilldown(kind));
    drilldownEl.hidden = false;
    const r = target.getBoundingClientRect();
    const dR = drilldownEl.getBoundingClientRect();
    let top = r.bottom + 6;
    let left = r.left + r.width / 2 - dR.width / 2;
    if (top + dR.height + 4 > window.innerHeight) top = r.top - dR.height - 6;
    if (left < 6) left = 6;
    if (left + dR.width > window.innerWidth - 6) left = window.innerWidth - dR.width - 6;
    drilldownEl.style.cssText = `top:${top}px;left:${left}px;`;
  };
  const hideDrilldown = (): void => { drilldownEl.hidden = true; };
  statsEl.addEventListener('mouseover', (e) => {
    const t = (e.target as HTMLElement).closest('.stat[data-stat]') as HTMLElement | null;
    if (t) showDrilldown(t);
  });
  statsEl.addEventListener('mouseout', (e) => {
    if (!statsEl.contains(e.relatedTarget as Node)) hideDrilldown();
  });

  // ─── Export-button hover → outline-multi on page ────────────────────────
  for (const btn of document.querySelectorAll('[data-export-hover]')) {
    btn.addEventListener('mouseenter', () => {
      const selectors = messages.filter((m): m is SelectorMessage => m.type === 'selector').map((m) => m.entry.selector);
      void sendToCS({kind: 'outline-multi', selectors});
      for (const el of list.querySelectorAll('.msg.selector')) el.classList.add('export-hover');
    });
    btn.addEventListener('mouseleave', () => {
      void sendToCS({kind: 'outline-multi-clear'});
      for (const el of list.querySelectorAll('.msg.selector')) el.classList.remove('export-hover');
    });
  }

  // ─── Click delegation ───────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest('[data-action]');
    if (!trigger) return;
    e.preventDefault();
    const action = trigger.getAttribute('data-action');
    switch (action) {
      case 'send': sendFeedback(); return;
      case 'copy-all': void onCopyAll(); return;
      case 'export': void onExport(); return;
      case 'export-zip': void onExportZip(); return;
      case 'copy-path': void onCopyPath(); return;
      case 'import': onImport(); return;
      case 'validate': void onValidate(); return;
      case 'reattach': void onReattach(); return;
      case 'quiet-enable': void onQuietEnable(); return;
      case 'quiet-dismiss': onQuietDismiss(); return;
      case 'clear': onClear(); return;
      case 'github': onGithub(); return;
      case 'settings': openDrawer(); return;
      case 'close-drawer': closeDrawer(); return;
      case 'undo': undo(); return;
      case 'redo': redo(); return;
      case 'design-edit': { void openMdModal('design'); return; }
      case 'skill-edit':  { void openMdModal('skill'); return; }
      case 'design-upload': {
        (document.getElementById('design-md-file') as HTMLInputElement | null)?.click();
        return;
      }
      case 'design-template-download': {
        void (async () => {
          // Always the PLAIN STOCK template — the local.* dev-override
          // preference contaminated defaults with a developer's own brand.
          const text = await loadTemplate('designTemplate');
          if (!text) { setStatus('Template not found', {kind: 'warn'}); return; }
          downloadText('DESIGN.template.md', text);
          setStatus('DESIGN.md template downloaded — fill in and re-upload');
        })();
        return;
      }
      case 'design-reset-template': {
        prefs.designMd = '';
        persistPrefs();
        applyPrefsToUI();
        setStatus('DESIGN.md reset — exports will bundle the template');
        return;
      }
      case 'skill-upload': {
        (document.getElementById('skill-md-file') as HTMLInputElement | null)?.click();
        return;
      }
      case 'skill-template-download': {
        void (async () => {
          const text = await loadTemplate('skillTemplate');
          if (!text) { setStatus('Template not found', {kind: 'warn'}); return; }
          downloadText('PinchGrab.SKILL.template.md', text);
          setStatus('SKILL.md template downloaded');
        })();
        return;
      }
      case 'skill-reset-template': {
        prefs.skillMd = '';
        persistPrefs();
        applyPrefsToUI();
        setStatus('SKILL.md reset — exports will bundle the template');
        return;
      }
      case 'ws-create': {
        const name = (wsName.value ?? '').trim();
        if (!name) return;
        void createWorkspaceFlow(name).then((ok) => { if (ok) wsName.value = ''; });
      }
    }
  });

  // ─── Global keyboard ────────────────────────────────────────────────────
  const isEditableKeyboardTarget = (target: EventTarget | null): boolean => {
    const el = target instanceof HTMLElement ? target : null;
    return Boolean(el?.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]'));
  };

  document.addEventListener('keydown', (e) => {
    const editableTarget = isEditableKeyboardTarget(e.target);
    if (editableTarget && (e.metaKey || e.ctrlKey) && ['a', 'z', 'y'].includes(e.key.toLowerCase())) return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); return; }
    // Ctrl+F (and Cmd+F) opens the in-list visual find — distinct from the
    // Cmd+K command palette. Override the browser's native find so the panel
    // owns the gesture.
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); openFind(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); redo(); return; }
    if (e.key === 'Escape') {
      const mdModal = document.querySelector<HTMLElement>('[data-md-modal]');
      if (mdModal && !mdModal.hidden) { closeMdModal(); return; }
      if (!palette.hidden) { closePalette(); return; }
      if (!drawer.hidden) { closeDrawer(); return; }
      if (findBar && !findBar.hidden) { closeFind(); return; }
      if (pendingMulti.length) { void sendToCS({kind: 'pending-cancel'}); pendingMulti = []; render(); setStatus('Pending group cancelled'); return; }
      if (insertBefore.current) { insertBefore.current = null; render(); setStatus('Insert mode cancelled'); return; }
      if (searchQuery) closeFind();
    }
    if (e.key === 'Alt' || e.altKey) void sendToCS({kind: 'alt-state', on: true});
  });
  document.addEventListener('keyup', (e) => {
    if (!e.altKey) void sendToCS({kind: 'alt-state', on: false});
  });

  // ─── Bridge wiring ──────────────────────────────────────────────────────
  let panelReady = false;
  const pendingPanelMessages: any[] = [];
  const receivePanelMessage = (m: any): void => {
    if (!panelReady) {
      pendingPanelMessages.push(m);
      return;
    }
    onCsMessage(m);
  };
  if (inExtension) {
    // Single channel: chrome.runtime.onMessage. The background used to relay
    // through a port too, but content-script broadcasts already reach the
    // side panel directly — relaying produced duplicate dispatches.
    chrome.runtime.onMessage.addListener((m: any) => receivePanelMessage(m));
    chrome.tabs?.onActivated?.addListener(() => void runValidation());
    chrome.tabs?.onUpdated?.addListener((_id, info) => { if (info?.status === 'complete') void runValidation(); });
    chrome.tabs?.onRemoved?.addListener((closedId) => {
      const ws = workspaces.find((w) => w.tabId === closedId);
      if (ws) { ws.tabId = undefined; persistWorkspaces(); renderWsControls(); }
    });
  } else {
    window.addEventListener('pinchgrab:to-panel', (e) => receivePanelMessage((e as CustomEvent).detail));
  }

  // ─── Test API ──────────────────────────────────────────────────────────
  const installTestApi = (): void => {
    (window as any).__pinchgrab_panel = {
      pushMessage: (m: PanelMessage) => { messages.push(m); persist(); render(); },
      onCapture, onHover, onHoverEnd, onPageSnapshot,
      getMessages: () => [...messages],
      getPrefs: () => ({...prefs}),
      setPrefs: (p: Partial<Prefs>) => { prefs = {...prefs, ...p}; persistPrefs(); applyPrefsToUI(); render(); },
      buildJsonl,
      buildExportFilename, buildManifest, dominantHostSlug, distinctHosts,
      duckDbSnippet, onExportZip, onExport, onCopyPath,
      denormalizeEntry,
      getLastExport: () => ({...lastExport}),
      getLastAgentPrompt: () => lastExport.agentPrompt,
      // Test hatch: seed every selector capture with the same full PNG dataURL
      // so the archive export has something to bundle. Real captures populate
      // shotsFull from the bg `runShot` reply; tests can't easily run a
      // captureVisibleTab, so this lets us prove the PNG bundling path.
      __seedShotsFull: (dataUrl: string) => {
        for (const m of messages) {
          if (m.type === 'selector') shotsFull.set(m.entry.selector, dataUrl);
        }
        persistShotsFull();
      },
      __getShotsFull: () => shotsFull,
      // Freeze the export clock (ISO string) so tests can assert two
      // exports of identical content are byte-identical. Pass null to
      // restore wall-clock behavior.
      __setExportClock: (iso: string | null) => { exportClockOverride = iso; },
      // setSearch drives the Ctrl+F visual-find path (the header search now
      // opens the command palette instead of filtering).
      setSearch: (q: string) => {
        if (q) { openFind(); if (findInput) findInput.value = q; applyFind(q); }
        else closeFind();
      },
      openFind, closeFind,
      isFindOpen: () => Boolean(findBar && !findBar.hidden),
      setValidity: (sel: string, ok: boolean | 'diff-page', reason?: string) => {
        selectorValidity.set(sel, ok);
        if (reason) selectorErrors.set(sel, reason);
        render();
      },
      clear: () => {
        snapshot();
        messages = [];
        liveTabUrl = null;
        liveTabPath = null;
        lastActiveSelector = null;
        pendingMulti = [];
        selectorValidity.clear();
        shots.clear();
        persist();
        render();
      },
      openPalette, closePalette, openDrawer, closeDrawer,
      sendFeedback, undo, redo,
      listWorkspaces: () => [...workspaces],
      activeWorkspace: () => activeWs,
      setStickyTTL: (ms: number) => { STICKY_TTL_MS = ms; },
      forceStickyExpire: () => { clearTimeout(stickyTimer); panelHovered = false; armStickyExpiry(); },
      setLastActive,
      createWorkspace: (n: string) => { workspaces.push({name: n, createdAt: new Date().toISOString()}); persistWorkspaces(); return loadWorkspace(n).then(render); },
      switchWorkspace: (n: string) => loadWorkspace(n).then(render),
      clearAll: onClear,
      listSnapshots: () => wsSnapshots.map((s) => ({id: s.id, ts: s.ts, selectors: s.selectors, comments: s.comments})),
      restoreSnapshot: (id: string) => restoreWorkspaceSnapshot(id),
    };
  };

  // ─── Panel self-heal ─────────────────────────────────────────────────────
  // After a dev extension reload (or an auto-update), the side panel keeps
  // running its OLD code with an INVALIDATED chrome.runtime: chrome.runtime.id
  // goes undefined and every chrome.* call throws "Extension context
  // invalidated". A dead panel can't reach the background, so NO button in it
  // works — which is exactly why the only recovery used to be "close the pane
  // and reclick the toolbar". This heartbeat detects that death and reloads
  // the panel page, which re-fetches the fresh code and reconnects. A
  // sessionStorage counter (survives the reload) prevents a loop when the
  // extension is genuinely gone rather than reloaded.
  const watchContextHealth = (): void => {
    if (!inExtension) return;
    const RELOAD_KEY = 'pg.ctxReloads';
    // Once we've been stably alive for a while, clear the loop guard.
    setTimeout(() => { try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ } }, 15000);
    setInterval(() => {
      let alive = false;
      try { alive = Boolean(chrome.runtime?.id); } catch { alive = false; }
      if (alive) return;
      let n = 0;
      try { n = Number(sessionStorage.getItem(RELOAD_KEY) ?? '0'); } catch { /* ignore */ }
      if (n >= 3) {
        // Auto-recovery exhausted (extension likely uninstalled, not reloaded).
        if (status) status.textContent = 'PinchGrab was reloaded — close this panel and reopen it from the toolbar.';
        return;
      }
      try { sessionStorage.setItem(RELOAD_KEY, String(n + 1)); } catch { /* ignore */ }
      if (status) status.textContent = 'PinchGrab reloaded — reconnecting…';
      setTimeout(() => { try { location.reload(); } catch { /* ignore */ } }, 600);
    }, 2000);
  };

  // ─── Boot ──────────────────────────────────────────────────────────────
  void (async () => {
    await loadAll();
    panelReady = true;
    for (const m of pendingPanelMessages.splice(0)) onCsMessage(m);
    render();
    installTestApi();
    void runValidation();
    void maybeShowQuietNudge();
    void fetchStars();
    updateComposerMeter();
    updateUndoButtons();
    watchContextHealth();
    console.log(LOG, 'ready', {inExtension, ws: activeWs, messages: messages.length});
  })();
})();
