// DOM helpers shared by the content script. Pure functions where possible —
// any DOM-bound state lives in the calling module.

import type {Entry, Rect, MatchedRule, FrameworkInfo, Ancestor, Viewport, DomMutation} from './types.ts';

// Hook for the content-script-owned MutationObserver buffer. Set by
// content-script.ts at boot via `setMutationBufferGetter`; nullable
// because dom.ts is also imported by tests / standalone harnesses that
// don't run an observer. captureEntry reads the most recent 3 records
// in the 8-second window via this getter (§4.8 — repro context).
let mutationBufferGetter: (() => DomMutation[]) | null = null;
export const setMutationBufferGetter = (fn: () => DomMutation[]): void => {
  mutationBufferGetter = fn;
};

// ---- Limits ---------------------------------------------------------------
const MAX_TEXT = 140;
const MAX_SNIPPET = 2600;
const MAX_ATTR = 140;
const MAX_RULES = 12;
const MAX_PREVIEW_CSS = 420;

// ---- Tiny utilities -------------------------------------------------------
const canEscape = typeof CSS !== 'undefined' && typeof CSS.escape === 'function';
export const escapeCss = (v: string): string =>
  canEscape ? CSS.escape(v) : String(v)
    .replaceAll('\\', '\\\\')
    .replace(/([ #;?%&,.+*~':"!^$[\]()=>|/@])/g, '\\$1');

export const trimText = (v: unknown, max = MAX_TEXT): string =>
  String(v ?? '').replaceAll(/\s+/g, ' ').trim().slice(0, max);

const safeCall = <T>(fn: () => T, fallback: T): T => {
  try { return fn(); } catch { return fallback; }
};

const toPositiveInt = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

const attr = (el: Element, name: string): string =>
  trimText(el.getAttribute(name), 120);

export const compactTarget = (el: Element): string => {
  let out = el.tagName.toLowerCase();
  if (el.id) out += '#' + el.id;
  if (el.classList?.length) {
    out += '.' + Array.from(el.classList).slice(0, 4).join('.');
  }
  return trimText(out, 180);
};

// ---- Selector building ----------------------------------------------------
const DYNAMIC_ID_RE = /^(radix-|headlessui-|mui-|aria-|ember|react-aria|:r[0-9a-z]+:)/i;
export const isStableId = (id: string | null | undefined): id is string =>
  Boolean(id) && !DYNAMIC_ID_RE.test(id!) && !/[:\s]/.test(id!) && !/^\d/.test(id!);

// Tailwind / utility-CSS class noise + CSS-in-JS hash prefixes. Anything
// matching this prefix-set is filtered out of stableClasses() so cssPath()
// prefers semantic classes.
//
// Source-of-truth filter:
//  • Tailwind utility prefixes (flex, grid, w-, h-, transition, duration-, …)
//  • Pseudo-state prefixes (hover:, focus:, sm:, dark:)
//  • CSS-in-JS hash classes (css-, sc-, emotion-, chakra-, jss123, makeStyles-,
//    MuiBox-, _next-, --) — added 2026 from css-selector-generator's
//    `ignoreGeneratedClassNames` defaults.
const UTILITY_CLASS_RE =
  /^(flex|grid|block|inline|hidden|relative|absolute|fixed|sticky|w-|h-|p-|m-|px-|py-|pt-|pb-|pl-|pr-|mx-|my-|mt-|mb-|ml-|mr-|gap-|space-|text-|font-|leading-|tracking-|bg-|border|rounded|shadow|opacity|cursor-|select-|pointer-|overflow|whitespace|truncate|items-|justify-|content-|self-|place-|z-|top-|left-|right-|bottom-|min-|max-|aspect-|object-|inset-|order-|col-|row-|gap|hover:|focus:|active:|disabled:|sm:|md:|lg:|xl:|2xl:|dark:|first|last|odd|even|group|peer|transition|duration-|delay-|ease-|animate-|transform|scale-|rotate-|translate-|skew-|origin-|ring-|divide-|outline-|fill-|stroke-|from-|to-|via-|placeholder-|caret-|accent-|appearance-|backdrop-|clip-|contain-|decoration-|underline|line-|list-|tabular|nums|prose|not-|motion-|isolate|isolation|will-|antialiased|subpixel-|sr-only|float-|clear-|resize-|scroll-|snap-|touch-|invisible|visible|css-|sc-[a-z0-9]|emotion-|chakra-|jss\d+|makeStyles-|MuiBox-|_next-|MuiButtonBase-|ρd__|__wab_|wab_|plsmc-)/i;

const stableClasses = (el: Element, max = 2): string[] => {
  if (!el.classList) return [];
  const all = Array.from(el.classList);
  const stable = all.filter((c) => !UTILITY_CLASS_RE.test(c));
  if (stable.length) return stable.slice(0, max);
  return all.slice(0, 1);
};

const isUnique = (scope: ParentNode, selector: string, target: Element): boolean => {
  try {
    const matches = scope.querySelectorAll(selector);
    return matches.length === 1 && matches[0] === target;
  } catch { return false; }
};

const ownDescriptor = (el: Element): string => {
  let s = el.nodeName.toLowerCase();
  const c = stableClasses(el);
  if (c.length) s += '.' + c.map(escapeCss).join('.');
  return s;
};

// Build the shortest CSS selector that uniquely identifies `el` on the page.
// Strategy (each candidate tested with querySelectorAll for uniqueness):
//
//   1. tag.semanticClass — page-wide unique (e.g. `header.sticky`).
//   2. #stableAncestorId tag.semanticClass — if a stable-id ancestor exists.
//   3. Full descendant path; THEN run optimize() — try removing each interior
//      segment one at a time and keep the result if it's still unique.
//      Inspired by antonmedv/finder's optimize loop. Drops e.g. `body > main >
//      section.x > div.wrap > h1.brand` to `main > h1.brand` when middle
//      segments don't constrain uniqueness.
//
// Empirically (audit on wranngle.com) this drops typical selector tokens
// from ~70 chars to ~15-25 chars without sacrificing resolvability.
const partsToSelector = (parts: string[], anchor: string | null): string =>
  anchor ? `${anchor} ${parts.join(' > ')}` : parts.join(' > ');

const optimizePath = (parts: string[], anchor: string | null, target: Element, scope: Document | ShadowRoot): string[] => {
  // Don't touch the head (the leaf element descriptor) or, if there's no
  // anchor, the very first segment that anchors the path. Try removing each
  // interior segment; keep the shorter form if the selector still resolves
  // to a unique target.
  let best = parts;
  let i = 0;
  while (i < best.length - 1) {
    const candidate = [...best.slice(0, i), ...best.slice(i + 1)];
    if (candidate.length === 0) { i++; continue; }
    if (isUnique(scope, partsToSelector(candidate, anchor), target)) {
      best = candidate;
      // restart from start of trimmed path
      i = 0;
    } else {
      i++;
    }
  }
  return best;
};

export const cssPath = (el: Element): string => {
  if (isStableId(el.id)) return '#' + escapeCss(el.id);

  // Shadow-rooted elements aren't reachable via `document.querySelector`, so
  // the uniqueness checks must scope to the owning root. Otherwise every
  // probe falls back to a full descendant path that climbs to `body` —
  // which it can never reach because of the shadow boundary — and the
  // selector ends up over-specified or nonsense.
  const rootNode = el.getRootNode();
  const cssScope: Document | ShadowRoot = rootNode instanceof ShadowRoot ? rootNode : document;
  const scopeBoundary: Node = rootNode instanceof ShadowRoot ? rootNode : document.body;

  // Find the nearest stable-id ancestor as an anchor candidate.
  let anchorId: string | null = null;
  let anchorEl: Element | null = null;
  let cur: Element | null = el.parentElement;
  while (cur && cur !== scopeBoundary) {
    if (isStableId(cur.id)) {
      anchorId = '#' + escapeCss(cur.id);
      anchorEl = cur;
      break;
    }
    cur = cur.parentElement;
  }

  const own = ownDescriptor(el);

  // Candidate 1: own descriptor alone, if it's page-wide unique.
  if (isUnique(cssScope, own, el)) return own;

  // Candidate 2: anchor + own descriptor.
  if (anchorId) {
    const c2 = `${anchorId} ${own}`;
    if (isUnique(anchorEl!, own, el) || isUnique(cssScope, c2, el)) return c2;
  }

  // Candidate 2.5 — ARIA-anchored selectors. Before falling through to
  // brittle `:nth-of-type` chains the roast called out (§2.5), try
  // anchoring at semantically-named markers an LLM or human can read:
  //
  //   • the element's own aria-label / role
  //   • a nearby ancestor's aria-label / role
  //
  // Selectors like `[aria-label="Pipeline trend"] .spark-wrap` are
  // both stable-against-DOM-shuffle AND human-readable in a way that
  // `div.stat:nth-of-type(1) > div.stat__spark:nth-of-type(4) > span` is
  // not. Cap the chain depth so we don't walk past a meaningful boundary.
  const ariaQuoted = (val: string): string => '"' + val.replace(/[\\"]/g, '\\$&') + '"';
  const ariaSelector = (e: Element): string | null => {
    const label = e.getAttribute('aria-label');
    if (label && label.length > 0 && label.length < 80) {
      return `[aria-label=${ariaQuoted(label)}]`;
    }
    return null;
  };
  // Try an ARIA-anchored selector for THIS element first.
  const ownAria = ariaSelector(el);
  if (ownAria && isUnique(cssScope, ownAria, el)) return ownAria;
  // Walk up to 4 ancestors and try `[aria-label="…"] tag.cls`. Stop at the
  // anchorEl if we found one — anything above is already covered.
  let ariaCur: Element | null = el.parentElement;
  let depth = 0;
  while (ariaCur && depth < 4 && ariaCur !== scopeBoundary && ariaCur !== anchorEl) {
    const a = ariaSelector(ariaCur);
    if (a) {
      const candidate = `${a} ${own}`;
      if (isUnique(cssScope, candidate, el)) return candidate;
    }
    ariaCur = ariaCur.parentElement;
    depth++;
  }

  // Candidate 2.6 — role + name anchor. ARIA-only labels caught above; this
  // tier handles the case where the ancestor has BOTH a `role` and an
  // `aria-label` (or `data-testid`). Selector is more specific and
  // doesn't risk colliding when two labels happen to match across roles.
  const roleNameSelector = (e: Element): string | null => {
    const role = e.getAttribute('role');
    const label = e.getAttribute('aria-label');
    if (role && label && label.length < 80) {
      return `[role=${ariaQuoted(role)}][aria-label=${ariaQuoted(label)}]`;
    }
    return null;
  };
  let rnCur: Element | null = el.parentElement;
  depth = 0;
  while (rnCur && depth < 4 && rnCur !== scopeBoundary && rnCur !== anchorEl) {
    const a = roleNameSelector(rnCur);
    if (a) {
      const candidate = `${a} ${own}`;
      if (isUnique(cssScope, candidate, el)) return candidate;
    }
    rnCur = rnCur.parentElement;
    depth++;
  }

  // Candidate 2.7 — unique-class-ancestor anchor (§2.5 selector ladder).
  // Walk ancestors looking for one whose class chain (via stableClasses)
  // is unique on the page; use it as `.unique-class own`. Fixes the case
  // where the elements between the captured node and the document have
  // no aria/testid/id, but ONE of them carries a meaningful semantic
  // class (`.attention-banner`, `.mission-stats`).
  let ucCur: Element | null = el.parentElement;
  depth = 0;
  while (ucCur && depth < 6 && ucCur !== scopeBoundary && ucCur !== anchorEl) {
    const cls = stableClasses(ucCur);
    if (cls.length) {
      const ancDescriptor = `${ucCur.nodeName.toLowerCase()}.${cls.map(escapeCss).join('.')}`;
      // `.cls` (without the tag prefix) is shorter and reads better when
      // the ancestor's class is page-unique on its own.
      const justCls = '.' + cls.map(escapeCss).join('.');
      if (isUnique(cssScope, justCls, ucCur)) {
        const candidate = `${justCls} ${own}`;
        if (isUnique(cssScope, candidate, el)) return candidate;
      }
      if (isUnique(cssScope, ancDescriptor, ucCur)) {
        const candidate = `${ancDescriptor} ${own}`;
        if (isUnique(cssScope, candidate, el)) return candidate;
      }
    }
    ucCur = ucCur.parentElement;
    depth++;
  }

  // Candidate 3: full descendant path, then optimize.
  const parts: string[] = [];
  cur = el;
  while (cur && cur.nodeType === Node.ELEMENT_NODE && cur !== scopeBoundary) {
    if (cur !== el && isStableId(cur.id)) break;
    let s = cur.nodeName.toLowerCase();
    const cls = stableClasses(cur);
    if (cls.length) s += '.' + cls.map(escapeCss).join('.');
    const parent: Element | null = cur.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter((sib) => sib.nodeName === cur!.nodeName);
      if (sameTag.length > 1) s += `:nth-of-type(${sameTag.indexOf(cur) + 1})`;
    }
    parts.unshift(s);
    cur = cur.parentElement;
  }
  if (!parts.length) return el.tagName.toLowerCase();
  const optimized = optimizePath(parts, anchorId, el, cssScope);
  return partsToSelector(optimized, anchorId);
};

// ---- Naming, roles, ancestors --------------------------------------------
// Roles whose accessibleName is, per the AccName algorithm, the recursive
// concatenation of every descendant's accessible text. For these the field
// becomes a useless 200-char dump of the whole subtree (often truncated
// mid-word). We ONLY surface an explicit aria-label / title / alt for
// container roles — otherwise leave it empty and let the LLM read the
// children separately.
const CONTAINER_ROLES = new Set([
  'group', 'region', 'list', 'listbox', 'grid', 'gridcell', 'rowgroup',
  'row', 'table', 'main', 'navigation', 'banner', 'contentinfo',
  'complementary', 'tabpanel', 'article', 'section', 'document',
  'feed', 'figure', 'form',
]);

// Resolve text the accname algorithm pulls from referenced elements. Used
// for both `aria-labelledby` (priority) and `<label for="id">` association
// (form-control fallback). Ids in idrefs are space-separated; each ref's
// resolved text is joined by a single space.
const collectIdRefText = (refs: string, scope: Document | ShadowRoot): string => {
  const parts: string[] = [];
  for (const id of refs.split(/\s+/).filter(Boolean)) {
    try {
      const node = scope.getElementById(id);
      if (node) parts.push(trimText(node.textContent, 180));
    } catch { /* ignore */ }
  }
  return parts.filter(Boolean).join(' ');
};

const accessibleName = (el: Element, role: string | null): string => {
  // Priority follows the accname algorithm (simplified):
  //   1. aria-labelledby — resolved text of every referenced id.
  //   2. aria-label — direct string.
  //   3. For form controls: associated <label> (either `<label for=ID>`
  //      OR an ancestor <label> that wraps the control). Every
  //      framework weather app pairs the search input with a
  //      visually-hidden label; without following the link PinchGrab
  //      returns an empty accessibleName.
  //   4. title / alt / placeholder (only when none of the above hit).
  //   5. textContent (suppressed for container roles whose accname
  //      would otherwise be a 200-char subtree dump).
  const labelledby = attr(el, 'aria-labelledby');
  if (labelledby) {
    const root = el.getRootNode();
    const scope: Document | ShadowRoot = root instanceof ShadowRoot ? root : document;
    const text = collectIdRefText(labelledby, scope);
    if (text) return trimText(text, 180);
  }
  const ariaLabel = attr(el, 'aria-label');
  if (ariaLabel) return trimText(ariaLabel, 180);

  const tag = el.tagName.toLowerCase();
  const isFormControl = tag === 'input' || tag === 'select' || tag === 'textarea' || tag === 'button' || tag === 'meter' || tag === 'progress' || tag === 'output';
  if (isFormControl) {
    if (el.id) {
      const root = el.getRootNode();
      const scope: Document | ShadowRoot = root instanceof ShadowRoot ? root : document;
      let labelFor: Element | null = null;
      try { labelFor = scope.querySelector(`label[for="${escapeCss(el.id)}"]`); } catch { /* invalid id */ }
      if (labelFor) {
        const text = trimText(labelFor.textContent, 180);
        if (text) return text;
      }
    }
    let labelParent: Element | null = el.parentElement;
    while (labelParent) {
      if (labelParent.tagName === 'LABEL') {
        const text = trimText(labelParent.textContent, 180);
        if (text) return text;
        break;
      }
      labelParent = labelParent.parentElement;
    }
  }

  const titleAttr = attr(el, 'title');
  if (titleAttr) return trimText(titleAttr, 180);
  const altAttr = attr(el, 'alt');
  if (altAttr) return trimText(altAttr, 180);
  const placeholderAttr = attr(el, 'placeholder');
  if (placeholderAttr) return trimText(placeholderAttr, 180);
  if (role && CONTAINER_ROLES.has(role)) return '';

  if (!isNameFromContent(el, tag, role)) return '';
  return trimText(el.textContent, 180);
};

// Tags whose implicit role has "Name from: contents" in the ARIA spec.
// These are leaf-ish or naturally-labeled-by-children elements; capturing
// one means the user wants the rendered text as the name.
const NAME_FROM_CONTENT_TAGS = new Set([
  'a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'summary', 'th', 'td', 'caption', 'figcaption', 'legend', 'label',
  'option', 'output', 'dt',
]);
// Explicit ARIA roles in "Name from: contents".
const NAME_FROM_CONTENT_ROLES = new Set([
  'button', 'cell', 'checkbox', 'columnheader', 'gridcell', 'heading',
  'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option',
  'radio', 'row', 'rowheader', 'switch', 'tab', 'tooltip', 'treeitem',
]);
const isNameFromContent = (el: Element, tag: string, role: string | null): boolean => {
  if (role && NAME_FROM_CONTENT_ROLES.has(role)) return true;
  if (NAME_FROM_CONTENT_TAGS.has(tag)) return true;
  // Inline / phrasing tags also legitimately get textContent as their
  // "name" — capturing a <span>Click</span> should show "Click", not "".
  // We only allow this when the element has ONLY text-node children (no
  // structural children), so a <span> wrapping seven cards still returns
  // empty.
  const INLINE_PHRASING = new Set(['span', 'em', 'strong', 'b', 'i', 'mark', 'small', 'code', 'kbd', 'samp', 'var', 'time', 'cite', 'q', 'abbr', 'sub', 'sup']);
  if (INLINE_PHRASING.has(tag) && !el.children.length) return true;
  return false;
};

const implicitRole = (el: Element): string | null => {
  if (el instanceof HTMLButtonElement) return 'button';
  if (el instanceof HTMLInputElement) return 'textbox';
  if (el instanceof HTMLTextAreaElement) return 'textbox';
  if (el instanceof HTMLSelectElement) return 'listbox';
  if (el instanceof HTMLAnchorElement && el.href) return 'link';
  if (el instanceof HTMLLIElement) return 'listitem';
  if (el instanceof HTMLUListElement || el instanceof HTMLOListElement) return 'list';
  if (el instanceof HTMLTableElement) return 'table';
  if (el instanceof HTMLTableCellElement) return 'cell';
  if (el instanceof HTMLTableRowElement) return 'row';
  if (el instanceof HTMLFormElement) return 'form';
  if (el instanceof HTMLProgressElement) return 'progressbar';
  if (el instanceof HTMLMeterElement) return 'meter';
  return null;
};

const SEMANTIC_TAGS = new Set(['main', 'section', 'article', 'nav', 'header', 'footer', 'aside', 'form', 'table', 'ul', 'ol']);

const componentRoot = (el: Element): {compact: string} | null => {
  let current: Element | null = el.parentElement;
  let depth = 0;
  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body && depth < 12) {
    const marker =
      current.id ||
      current.getAttribute('data-component') ||
      current.getAttribute('data-testid') ||
      current.getAttribute('data-test') ||
      current.getAttribute('data-cy') ||
      current.getAttribute('data-qa') ||
      current.getAttribute('role') ||
      SEMANTIC_TAGS.has(current.nodeName.toLowerCase());
    if (marker) return {compact: compactTarget(current)};
    if (current.parentElement === null && current.parentNode instanceof ShadowRoot) {
      current = current.parentNode.host || null;
    } else {
      current = current.parentElement;
    }
    depth++;
  }
  return null;
};

const ancestorChain = (el: Element, depth = 4): Ancestor[] => {
  const out: Ancestor[] = [];
  let current = el.parentElement;
  let i = 0;
  while (current && current !== document.body && i < depth) {
    const item: Ancestor = {tag: current.tagName.toLowerCase()};
    if (isStableId(current.id)) item.id = current.id;
    const role = attr(current, 'role');
    if (role) item.role = role;
    const tid = attr(current, 'data-testid') || attr(current, 'data-test') ||
      attr(current, 'data-cy') || attr(current, 'data-qa');
    if (tid) item.testId = tid;
    const cls = current.classList ? Array.from(current.classList).slice(0, 3) : [];
    if (cls.length) item.classes = cls;
    out.push(item);
    current = current.parentElement;
    i++;
  }
  return out;
};

// ---- Attrs / styles / matched rules ---------------------------------------
const ATTR_ALLOWLIST = new Set([
  'href', 'src', 'alt', 'title', 'placeholder', 'name', 'type', 'value', 'target', 'for',
  'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-expanded',
  'aria-checked', 'aria-selected', 'aria-haspopup', 'aria-live', 'aria-hidden', 'role',
]);
const ATTR_PREFIX_ALLOW = ['aria-', 'data-'];
const ATTR_BLOCKLIST = new Set(['class', 'style', 'id']);

// Per-input-type format hints so an LLM consuming the export doesn't have
// to infer the expected shape. Direct port from browser-use's serializer.
const INPUT_FORMAT_HINTS: Record<string, string> = {
  date: 'YYYY-MM-DD',
  'datetime-local': 'YYYY-MM-DDTHH:mm',
  month: 'YYYY-MM',
  time: 'HH:mm',
  week: 'YYYY-Www',
  number: 'numeric',
  range: 'numeric',
  tel: 'phone',
  email: 'email',
  url: 'url',
  color: '#rrggbb',
};

// Attrs that are always promoted to top-level entry fields (`testId`,
// `accessibleName`, `role`). Keeping them ALSO in `attrs` was duplicate
// payload — drop them here so the consumer sees one canonical source.
// `data-testid`, `data-test`, `data-cy`, `data-qa` all get promoted.
const ATTR_DEDUP_AGAINST_TOP_LEVEL = new Set([
  'data-testid', 'data-test', 'data-cy', 'data-qa',
  'aria-label', 'role', 'title', 'alt',
]);

// Regex denylists for likely-secret-bearing strings. Match against attribute
// VALUES — if a value looks like a JWT, an OAuth bearer, or a long token
// sandwiched in a non-allowlisted spot, we redact rather than ship.
const JWT_RE = /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g;
// Conservative bearer-token regex: 24+ chars of base64url-ish content
// where the attribute name strongly implies a secret. Applied per-attr.
const SECRET_ATTR_NAME_RE = /(token|secret|password|api[_-]?key|auth(orization)?|csrf|xsrf|session)/i;
const redactSecrets = (name: string, value: string): string => {
  if (SECRET_ATTR_NAME_RE.test(name) && value.length > 8) return '[redacted: looks-like-secret]';
  return value.replace(JWT_RE, '[redacted: jwt]');
};

const populatedAttrs = (el: Element): {attrs: Record<string, string>; hints: import('./types.ts').EntryHints | undefined} => {
  const attrs: Record<string, string> = {};
  if (!el.attributes) return {attrs, hints: undefined};
  let valueMasked = false;
  for (const a of Array.from(el.attributes)) {
    const name = a.name;
    if (!name || ATTR_BLOCKLIST.has(name)) continue;
    if (ATTR_DEDUP_AGAINST_TOP_LEVEL.has(name)) continue;
    const allowed = ATTR_ALLOWLIST.has(name) || ATTR_PREFIX_ALLOW.some((p) => name.startsWith(p));
    if (!allowed) continue;
    let v = trimText(a.value, MAX_ATTR);
    // Sensitive-input redaction. Beyond `<input type="password">`, also
    // strip values for: hidden inputs (often carry CSRF/JWT bootstraps),
    // any input whose `autocomplete` attribute marks it as a payment-
    // card field (`cc-number`, `cc-csc`, `cc-exp*`), or a one-time
    // code. The roast called this out under TH-001 / D.4 — never ship a
    // token shaped like a credit-card or session bootstrap.
    if (name === 'value' && el instanceof HTMLInputElement && v) {
      const t = el.type;
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase();
      const sensitive = t === 'password'
        || t === 'hidden'
        || /^(cc-(number|csc|exp(-month|-year)?|name)|one-time-code|new-password|current-password)$/.test(ac);
      if (sensitive) {
        v = '••••';
        valueMasked = true;
      }
    }
    if (v) {
      const redacted = redactSecrets(name, v);
      if (redacted !== v) { v = redacted; valueMasked = true; }
    }
    if (v) attrs[name] = v;
  }
  // Capture-time synthetic hints sit in their own bag (not mixed with real
  // attributes). Per-input-type format helps an LLM know the expected shape.
  const hints: import('./types.ts').EntryHints = {};
  if (el instanceof HTMLInputElement) {
    const fmt = INPUT_FORMAT_HINTS[el.type];
    if (fmt) hints.format = fmt;
  }
  if (valueMasked) hints.valueMasked = true;
  return {attrs, hints: Object.keys(hints).length ? hints : undefined};
};

const NOISE_VALUES = new Set(['initial', 'inherit', 'unset', 'revert', 'revert-layer', 'normal', 'auto', 'none', 'static']);
const NOISE_FOR_KEY: Record<string, string[]> = {
  visibility: ['visible'], opacity: ['1'], overflow: ['visible'],
  overflowX: ['visible'], overflowY: ['visible'], display: ['inline', 'block'],
  margin: ['0px'], padding: ['0px'],
  border: ['0px none rgb(0, 0, 0)', '0px none rgba(0, 0, 0, 0)'],
  borderRadius: ['0px'],
  backgroundColor: ['rgba(0, 0, 0, 0)', 'transparent'],
  pointerEvents: ['auto'],
  // The roast called these out as default-value noise that appears on
  // every entry: top/right/bottom/left default to 0px on relative
  // positioning, flexDirection/flexWrap default to row/nowrap on
  // non-flex containers, and `transition: all` is the universal-reset
  // side effect — none meaningful as captured per-element.
  top: ['0px'], right: ['0px'], bottom: ['0px'], left: ['0px'],
  flexDirection: ['row'],
  flexWrap: ['nowrap'],
  transition: ['all', 'all 0s ease 0s'],
  // Spec defaults for grid + flex alignment.
  alignItems: ['stretch'], justifyContent: ['flex-start', 'normal'],
  // textAlign default is `start`. Useful when explicitly set; noise otherwise.
  textAlign: ['start'],
  textDecoration: ['none solid rgb(0, 0, 0)'],
};
const isMeaningful = (k: string, v: string | null | undefined): v is string => {
  if (v == null || v === '') return false;
  if (NOISE_VALUES.has(v)) return false;
  return !NOISE_FOR_KEY[k]?.includes(v);
};

const STYLE_KEYS = [
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textAlign', 'textTransform', 'textDecoration', 'color',
  'padding', 'margin', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'backgroundColor', 'backgroundImage', 'border', 'borderRadius',
  'display', 'position', 'top', 'right', 'bottom', 'left', 'zIndex',
  'flexDirection', 'alignItems', 'justifyContent', 'gap', 'flexWrap',
  'gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow',
  'boxShadow', 'opacity', 'overflow', 'filter', 'backdropFilter', 'transform',
  'transition', 'animation', 'cursor', 'visibility', 'pointerEvents',
] as const;
const STYLE_LIMITS: Record<string, number> = {
  fontFamily: 256, backgroundImage: 1000, boxShadow: 1000, border: 256,
  filter: 512, backdropFilter: 512, transform: 512, transition: 512, animation: 512,
  gridTemplateColumns: 1000, gridTemplateRows: 1000,
};

// Pixel values reported by getComputedStyle on high-DPR displays come back
// at subpixel precision (`15.9983px`, `21.9965px`). The fractional digits
// are arithmetic noise, not meaningful layout signal — round to 1 decimal
// for readability. We only round simple `<float>px` values; anything more
// complex (calc(), shorthand padding, etc.) is left intact.
const PX_RE = /^-?\d+\.\d+px$/;
const roundPx = (v: string): string => {
  if (!PX_RE.test(v)) return v;
  const n = parseFloat(v);
  return Number.isFinite(n) ? `${Math.round(n * 10) / 10}px` : v;
};

// Style props worth dual-emitting both their resolved (`rgb(...)`) and
// declared (`var(--token)`) forms. The resolved value is what an LLM
// reasons about visually; the declared form is what the user wrote in
// CSS / what a designer recognizes. Only meaningful for token-driven
// theming, so we limit the dual-emit to color-shaped properties.
const VAR_DUAL_EMIT = new Set(['color', 'backgroundColor', 'borderColor']);

const essentialStyles = (el: Element): Record<string, string> => {
  const cs = window.getComputedStyle(el);
  const out: Record<string, string> = {};
  for (const k of STYLE_KEYS) {
    const v = (cs as any)[k];
    if (!isMeaningful(k, v)) continue;
    out[k] = roundPx(trimText(v, STYLE_LIMITS[k] ?? 140));
  }
  // Dual-emit the original `var(--…)` form for theme-driven properties.
  // We pull from the inline `style` attribute first (cheapest), then walk
  // matchedRules for ones whose declared text contains a `var(`. The
  // resolved value already lives in `out[k]`; we add a `<key>Var` sibling.
  if (el instanceof HTMLElement) {
    for (const k of VAR_DUAL_EMIT) {
      if (!out[k]) continue;
      // CSSStyleDeclaration uses kebab-case in `getPropertyValue`.
      const dashKey = k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
      const inline = el.style?.getPropertyValue(dashKey)?.trim();
      if (inline && inline.includes('var(')) {
        out[`${k}Var`] = trimText(inline, 140);
      }
    }
  }
  return out;
};

const PSEUDO_KEYS = ['display', 'position', 'width', 'height', 'backgroundColor', 'backgroundImage', 'border', 'borderRadius', 'boxShadow', 'transform', 'opacity', 'top', 'right', 'bottom', 'left', 'zIndex'] as const;
const pseudoStyles = (el: Element): Record<string, Record<string, string>> => {
  const out: Record<string, Record<string, string>> = {};
  for (const which of ['::before', '::after']) {
    const cs = safeCall(() => window.getComputedStyle(el, which), null);
    if (!cs) continue;
    const content = cs.content;
    if (!content || content === 'none' || content === 'normal') continue;
    const block: Record<string, string> = {content: trimText(content, 256)};
    for (const k of PSEUDO_KEYS) {
      const v = (cs as any)[k];
      if (isMeaningful(k, v)) block[k] = trimText(v, STYLE_LIMITS[k] ?? 140);
    }
    out[which.replace('::', '')] = block;
  }
  return out;
};

// Pseudo-classes safe for any tag.
const STATES_KEEP_UNIVERSAL = ['hover', 'focus', 'focus-visible', 'focus-within', 'active', 'target', 'visited'] as const;
// Form-state pseudos. ALL elements technically match `:valid` / `:invalid`
// (per CSS spec), so capturing them on a `<button>` or `<div>` produces
// `states.valid: true` noise that confused LLMs ("the button is valid?
// what does that mean?"). Only emit these for genuine form-control tags.
const STATES_KEEP_FORM = ['checked', 'disabled', 'required', 'optional', 'read-only', 'read-write', 'in-range', 'out-of-range', 'valid', 'invalid'] as const;
const FORM_TAGS = new Set(['input', 'select', 'textarea', 'option', 'fieldset', 'output', 'progress', 'meter']);
// v2: array form. Easier for DuckDB queries (`'hover' = ANY(states)`) and a
// few bytes shorter on the wire than the object-as-set shape.
const pickTrueStates = (el: Element): string[] => {
  const out: string[] = [];
  for (const s of STATES_KEEP_UNIVERSAL) {
    try { if (el.matches(`:${s}`)) out.push(s); } catch { /* ignore invalid */ }
  }
  if (FORM_TAGS.has(el.tagName.toLowerCase())) {
    for (const s of STATES_KEEP_FORM) {
      try { if (el.matches(`:${s}`)) out.push(s); } catch { /* ignore */ }
    }
  }
  return out;
};

const STYLE_INTERESTS = [
  'display', 'position', 'visibility', 'overflow', 'overflowX', 'overflowY',
  'boxSizing', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'margin', 'padding', 'borderWidth', 'borderTopWidth', 'borderRightWidth',
  'borderBottomWidth', 'borderLeftWidth', 'borderRadius', 'color', 'backgroundColor',
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign', 'textDecoration',
  'opacity', 'transform', 'transition', 'animation',
] as const;

// Universal selectors and @media print blocks are present on every captured
// element across both Plasmic and the Wranngle console. They never explain
// what makes a SPECIFIC element look the way it does, so they're pure
// noise — ~21% of total payload bytes per the roast measurement.
const isFilterableSelector = (sel: string): boolean => {
  const trimmed = sel.replace(/\s+/g, ' ').trim();
  if (trimmed === '*') return true;
  if (trimmed === '*, ::before, ::after') return true;
  if (trimmed === '::before, ::after, *') return true;
  return false;
};

const collectMatchedRules = (el: Element): MatchedRule[] => {
  const rules: MatchedRule[] = [];
  const mediaStack: string[] = [];
  const pushRule = (rule: CSSStyleRule): boolean => {
    try { if (!el.matches(rule.selectorText)) return true; } catch { return true; }
    if (isFilterableSelector(rule.selectorText)) return true;
    // Drop @media print blocks — captures are always for the screen view.
    const mediaJoined = mediaStack.join(' && ');
    if (/\bprint\b/.test(mediaJoined) && !/\bscreen\b/.test(mediaJoined)) return true;
    const declared: Record<string, string> = {};
    for (const p of STYLE_INTERESTS) {
      const v = rule.style?.getPropertyValue(p);
      if (v) declared[p] = trimText(v, 140);
    }
    if (!Object.keys(declared).length) return true;
    // A rule can MATCH the selector without being ACTIVE if it lives
    // inside an unmatched @media query. Test with matchMedia so
    // receivers know which rules shaped the captured viewport vs.
    // which would shape a different one (e.g. mobile rules captured
    // on desktop).
    const mediaActive = mediaStack.length === 0
      ? true
      : (() => {
        try {
          // mediaStack joins multiple nested @media — all must match.
          for (const cond of mediaStack) {
            const rawCond = cond.replace(/^@media\s*/, '');
            if (!matchMedia(rawCond).matches) return false;
          }
          return true;
        } catch { return undefined; }
      })();
    const ruleEntry: MatchedRule = {
      selector: rule.selectorText,
      declarations: declared,
      ...(mediaStack.length ? {media: mediaJoined} : {}),
    };
    if (mediaStack.length) ruleEntry.mediaActive = mediaActive;
    rules.push(ruleEntry);
    return rules.length < MAX_RULES;
  };
  const walk = (sheet: CSSStyleSheet | null, list: CSSRuleList): void => {
    for (let i = 0; i < list.length && rules.length < MAX_RULES; i++) {
      const rule = list[i];
      if (!rule || typeof rule.type !== 'number') continue;
      if (rule.type === CSSRule.STYLE_RULE) {
        if (!pushRule(rule as CSSStyleRule)) break;
        continue;
      }
      if (rule.type === CSSRule.MEDIA_RULE || rule.type === CSSRule.SUPPORTS_RULE) {
        const cond = String((rule as CSSMediaRule).conditionText || '').trim();
        if (cond) mediaStack.push(cond);
        if ((rule as CSSGroupingRule).cssRules) walk(sheet, (rule as CSSGroupingRule).cssRules);
        if (cond) mediaStack.pop();
        continue;
      }
      if (rule.type === CSSRule.IMPORT_RULE && (rule as CSSImportRule).styleSheet) {
        try {
          const im = (rule as CSSImportRule).styleSheet;
          if (im?.cssRules) walk(im, im.cssRules);
        } catch { /* CORS-blocked sheet */ }
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets || [])) {
    const m = sheet.media?.mediaText;
    if (m) mediaStack.push(`@media ${m}`);
    let css: CSSRuleList | undefined;
    try { css = sheet.cssRules; } catch { if (m) mediaStack.pop(); continue; }
    if (css) walk(sheet, css);
    if (m) mediaStack.pop();
  }
  return rules;
};

// Event-handler probes. Returns a flat `{ onClick: "handlerName", … }` map
// pulled from whatever framework wired the handler. The map answers
// "which handler ran when this fired?" without forcing an LLM to grep
// the codebase. Three sources stacked:
//
//   1. React fibers — `__reactProps$<key>.onX` (function whose `.name`
//      is the source name in dev builds, minified in prod).
//   2. Vue 3 vnode props — `__vueParentComponent.vnode.props.onX`
//      (Vue 3 normalizes `@click` template attrs to `onClick` on the
//      component vnode).
//   3. Inline `on*` HTML attributes — the legacy `onclick="…"` form.
//      Captured value is the source string with whitespace collapsed,
//      capped to 200 chars (full-script inline handlers get truncated).
//
// Each source can contribute; later sources don't overwrite earlier ones
// — a React handler beats an inline one when both exist on the node.
const HANDLER_KEYS = ['onClick', 'onMouseDown', 'onSubmit', 'onChange', 'onKeyDown', 'onFocus', 'onBlur', 'onInput'] as const;
const INLINE_ON_ATTRS = ['onclick', 'onmousedown', 'onsubmit', 'onchange', 'onkeydown', 'onfocus', 'onblur', 'oninput'] as const;

const reactEventNames = (el: Element, out: Record<string, string>): void => {
  const propsKey = Object.keys(el).find((k) => k.startsWith('__reactProps$'));
  if (!propsKey) return;
  const props = (el as any)[propsKey] as Record<string, any> | undefined;
  if (!props) return;
  for (const k of HANDLER_KEYS) {
    if (out[k]) continue;
    const fn = props[k];
    if (typeof fn === 'function') {
      const n = fn.name && fn.name !== '' ? fn.name : '<anonymous>';
      out[k] = trimText(n, 80);
    }
  }
};

const vueEventNames = (el: Element, out: Record<string, string>): void => {
  // Vue 3: events live on the parent-component vnode's props as `onClick`,
  // `onMyEvent`, etc. Vue 2: `el.__vue__.$listeners` had them; we sniff
  // both shapes. Cheap fallthrough when neither is present.
  const v: any = (el as any).__vueParentComponent || (el as any).__vue__;
  if (!v) return;
  const props = v.vnode?.props || v.$options?.propsData || v.$listeners;
  if (!props || typeof props !== 'object') return;
  for (const k of HANDLER_KEYS) {
    if (out[k]) continue;
    const fn = props[k] || props[k.toLowerCase()];
    if (typeof fn === 'function') {
      const n = fn.name && fn.name !== '' ? fn.name : '<vue-anonymous>';
      out[k] = trimText(n, 80);
    }
  }
};

const inlineEventNames = (el: Element, out: Record<string, string>): void => {
  for (const attr of INLINE_ON_ATTRS) {
    const camel = 'on' + attr.charAt(2).toUpperCase() + attr.slice(3);
    if (out[camel]) continue;
    const v = el.getAttribute(attr);
    if (v) out[camel] = trimText(v, 200);
  }
};

const collectEventNames = (el: Element): Record<string, string> | null => {
  const out: Record<string, string> = {};
  reactEventNames(el, out);
  vueEventNames(el, out);
  inlineEventNames(el, out);
  return Object.keys(out).length ? out : null;
};

// "Behavior" attributes — htmx, Stimulus, Alpine, Turbo. Server-rendered
// apps don't have React fibers; the wiring for "what this button does"
// lives in HTML attributes. Capture them as a separate field so an LLM
// asked "why doesn't this button work?" sees the binding immediately
// rather than digging through `attrs`.
const BEHAVIOR_ATTR_PREFIXES = ['hx-', 'data-hx-', 'data-controller', 'data-action', 'data-target', 'x-data', 'x-on:', 'x-bind:', 'x-model', 'x-show', 'x-if', '@click', '@submit', 'data-turbo'] as const;
const collectBehaviorAttrs = (el: Element): Record<string, string> | null => {
  if (!el.attributes) return null;
  const out: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) {
    const name = a.name;
    if (BEHAVIOR_ATTR_PREFIXES.some((p) => name === p || name.startsWith(p))) {
      out[name] = trimText(a.value, 200);
    }
  }
  return Object.keys(out).length ? out : null;
};

// Walk up the shadow-DOM boundaries. When the captured element lives
// inside a closed/open shadow root, the host's selector is the only way
// the panel side (or an LLM later) can re-find the entry on the live
// page — `document.querySelector` doesn't pierce shadow boundaries.
const shadowHostSelector = (el: Element): string | null => {
  const root = el.getRootNode();
  if (!(root instanceof ShadowRoot)) return null;
  const host = root.host;
  if (!host) return null;
  // cssPath is defined later; route through the shared selector builder.
  try { return cssPath(host); } catch { return host.tagName.toLowerCase(); }
};

// Walk up to find the nearest `contenteditable=true` ancestor (the
// rich-text editor's "root"). Returns null when the captured element is
// outside any editor.
const findEditorRoot = (el: Element): Element | null => {
  let cur: Element | null = el;
  while (cur) {
    if (cur instanceof HTMLElement && cur.isContentEditable) {
      // Walk up further to find the OUTERMOST contenteditable=true
      // ancestor — ProseMirror nests nodes that each report
      // isContentEditable=true, but the actual editor root is at the top.
      let outer: Element = cur;
      let probe: Element | null = cur.parentElement;
      while (probe && probe instanceof HTMLElement && probe.isContentEditable) {
        outer = probe;
        probe = probe.parentElement;
      }
      return outer;
    }
    cur = cur.parentElement;
  }
  return null;
};

// Identify the editor library by markers each one stamps on the editor
// root. Most libraries leave a class or data-* attribute that's stable
// across versions; some leave a runtime field on the DOM node. Order
// matters — TipTap reuses ProseMirror under the hood, so check tiptap
// markers first; ditto Quill (pure ProseMirror-free) before generic
// `.ProseMirror`.
const detectEditorKind = (root: Element): 'prosemirror' | 'lexical' | 'slate' | 'quill' | 'tiptap' | 'native' => {
  const r: any = root;
  if (root.classList?.contains('tiptap') || r.__tiptap) return 'tiptap';
  if (root.hasAttribute('data-lexical-editor') || r.__lexicalEditor) return 'lexical';
  if (root.hasAttribute('data-slate-editor') || r.__slateEditor) return 'slate';
  if (root.classList?.contains('ql-editor') || root.closest('.ql-container')) return 'quill';
  if (root.classList?.contains('ProseMirror') || r.__pmViewDesc || r.pmViewDesc) return 'prosemirror';
  return 'native';
};

const editorContext = (el: Element): {kind: 'prosemirror' | 'lexical' | 'slate' | 'quill' | 'tiptap' | 'native'; rootSelector: string; contentLength: number} | null => {
  const root = findEditorRoot(el);
  if (!root) return null;
  let rootSelector: string;
  try { rootSelector = cssPath(root); } catch { rootSelector = root.tagName.toLowerCase(); }
  const text = (root as HTMLElement).innerText ?? root.textContent ?? '';
  return {
    kind: detectEditorKind(root),
    rootSelector,
    contentLength: text.length,
  };
};

// Layout bugs frequently live in the PARENT's flex/grid/overflow/
// scroll/stacking context, not on the captured element itself.
// Capture a slim summary of the parent chain that's structurally
// relevant to layout — display, position, overflow, scroll offset,
// transform/will-change (stacking), and flex/grid summary on the
// immediate parent.
type LayoutContextEntry = {
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
};
const isLayoutInteresting = (cs: CSSStyleDeclaration): boolean => {
  if (cs.position && cs.position !== 'static') return true;
  if (cs.display && /(flex|grid|table|contents|inline-block)/.test(cs.display)) return true;
  if (cs.overflow && cs.overflow !== 'visible') return true;
  if (cs.transform && cs.transform !== 'none') return true;
  return false;
};
const captureLayoutContext = (el: Element, depth = 4): LayoutContextEntry[] => {
  const out: LayoutContextEntry[] = [];
  let cur: Element | null = el.parentElement;
  let i = 0;
  while (cur && cur !== document.body && i < depth) {
    try {
      const cs = window.getComputedStyle(cur);
      const interesting = isLayoutInteresting(cs);
      if (interesting) {
        const entry: LayoutContextEntry = {tag: cur.tagName.toLowerCase()};
        entry.display = cs.display;
        entry.position = cs.position;
        if (cs.overflow !== 'visible') entry.overflow = cs.overflow;
        if (cs.zIndex && cs.zIndex !== 'auto') entry.zIndex = cs.zIndex;
        if (cs.transform && cs.transform !== 'none') entry.transform = trimText(cs.transform, 120);
        if (cs.willChange && cs.willChange !== 'auto') entry.willChange = cs.willChange;
        if ((cur as HTMLElement).scrollWidth > cur.clientWidth || (cur as HTMLElement).scrollHeight > cur.clientHeight) {
          entry.isScrollContainer = true;
          entry.scrollLeft = (cur as HTMLElement).scrollLeft;
          entry.scrollTop = (cur as HTMLElement).scrollTop;
        }
        if (/flex/.test(cs.display)) {
          entry.flex = {
            direction: cs.flexDirection,
            wrap: cs.flexWrap,
            alignItems: cs.alignItems,
            justifyContent: cs.justifyContent,
            gap: cs.gap !== 'normal' ? cs.gap : undefined,
          };
        } else if (/grid/.test(cs.display)) {
          entry.grid = {
            templateColumns: trimText(cs.gridTemplateColumns, 200),
            templateRows: trimText(cs.gridTemplateRows, 200),
            gap: cs.gap !== 'normal' ? cs.gap : undefined,
          };
        }
        out.push(entry);
      }
    } catch { /* ignore */ }
    cur = cur.parentElement;
    i++;
  }
  return out;
};

// Surface a contrast-ratio number for text elements so an a11y-aware
// reviewer can flag failing pairs without re-running an audit. Returns
// null when no text or when background is transparent and we can't
// resolve a base color.
//
// We only report contrast for elements with direct text children; for
// containers we'd need to traverse, which is outside the scope of a
// lightweight in-capture audit.
const parseRgb = (s: string): [number, number, number, number] | null => {
  // rgb(255, 95, 0) | rgba(255, 95, 0, 0.5) | #ff5f00 | #f50
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/.exec(s);
  if (m) {
    return [parseInt(m[1]!, 10), parseInt(m[2]!, 10), parseInt(m[3]!, 10), m[4] ? parseFloat(m[4]) : 1];
  }
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    let h = hex[1]!;
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  return null;
};
const relativeLuminance = ([r, g, b]: [number, number, number, number]): number => {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrastRatio = (fg: string, bg: string): number | null => {
  const f = parseRgb(fg); const b = parseRgb(bg);
  if (!f || !b) return null;
  const lf = relativeLuminance(f);
  const lb = relativeLuminance(b);
  const [lo, hi] = lf > lb ? [lb, lf] : [lf, lb];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};
// Walk up the parent chain to find the first opaque background color.
// Most elements report `rgba(0,0,0,0)` (transparent) for backgroundColor;
// the actual visible background is the nearest ancestor that paints.
const resolveBackground = (el: Element): string | null => {
  let cur: Element | null = el;
  while (cur) {
    const cs = window.getComputedStyle(cur);
    const bg = cs.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
    cur = cur.parentElement;
  }
  return null;
};
const computeAccessibilityCheck = (el: Element): {contrastRatio?: number; contrastPasses?: 'AA' | 'AAA' | 'fail'; tabbable?: boolean; focusVisible?: boolean} | null => {
  const out: {contrastRatio?: number; contrastPasses?: 'AA' | 'AAA' | 'fail'; tabbable?: boolean; focusVisible?: boolean} = {};
  try {
    if (hasOwnTextNode(el)) {
      const cs = window.getComputedStyle(el);
      const fg = cs.color;
      const bg = resolveBackground(el);
      if (fg && bg) {
        const r = contrastRatio(fg, bg);
        if (r !== null) {
          out.contrastRatio = r;
          // Use 18pt+ / 14pt-bold thresholds (3.0 / 4.5) when applicable;
          // otherwise the standard 4.5 / 7.0.
          const fontSize = parseFloat(cs.fontSize);
          const isBold = parseInt(cs.fontWeight, 10) >= 700;
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
          const aa = isLargeText ? 3 : 4.5;
          const aaa = isLargeText ? 4.5 : 7;
          out.contrastPasses = r >= aaa ? 'AAA' : r >= aa ? 'AA' : 'fail';
        }
      }
    }
    // Tab order proxy: tabIndex >= 0 OR matches the natural-tabbable set.
    const ti = (el as HTMLElement).tabIndex;
    const naturallyTabbable = /^(a|button|input|select|textarea|iframe|details|audio|video)$/i.test(el.tagName) && !el.hasAttribute('disabled') && (el.tagName !== 'A' || Boolean((el as HTMLAnchorElement).href));
    out.tabbable = ti >= 0 || naturallyTabbable;
  } catch { /* ignore */ }
  return Object.keys(out).length ? out : null;
};

// Animation-context flag. captureEntry calls this — if `getAnimations()`
// returns anything actively playing, the rect / transform / opacity we
// captured may be at an interpolated mid-animation value, not the
// settled layout. Helps an LLM not anchor on values that won't repeat.
const hasActiveAnimation = (el: Element): boolean => {
  const fn = (el as any).getAnimations;
  if (typeof fn !== 'function') return false;
  try {
    const animations = fn.call(el) as Array<{playState?: string}>;
    for (const a of animations) {
      if (a?.playState === 'running') return true;
    }
  } catch { /* ignore */ }
  return false;
};

// Production builds minify component constructor names to 1-3 chars
// (`Bd`, `Ke`, `qa`, `$d`, `e8`). The string carries zero semantic
// information to an LLM — it's just minifier output. We treat such names
// as missing and fall through to the displayName path (or drop the
// `component` field entirely when neither survives the minifier).
//
// JavaScript identifier-start chars include `$` and `_`; identifier-continue
// adds digits. Real component names are almost always camelCase / PascalCase
// words ≥4 chars (`Button`, `WeatherCard`). Anything ≤3 chars that uses the
// minifier alphabet is treated as junk.
const MINIFIED_NAME_RE = /^[A-Za-z$_][A-Za-z0-9$_]{0,2}$/;
const BUNDLER_SCAFFOLD_NAMES = new Set([
  'Anonymous', 'anonymous', 'default', '_default',
  // Vue SFC compiler stamps every `<script setup>` default export with this
  // sentinel when no explicit `name` is set — semantically empty.
  '_sfc_main', 'sfc_main',
]);
const isMeaningfulComponentName = (name: string | null | undefined): boolean => {
  if (!name) return false;
  if (BUNDLER_SCAFFOLD_NAMES.has(name)) return false;
  if (MINIFIED_NAME_RE.test(name)) return false;
  return true;
};

// ---- React / Vue ----------------------------------------------------------
const reactInfo = (el: Element): FrameworkInfo | null => {
  const reactKey = Object.keys(el).find((k) =>
    k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
  if (!reactKey) return null;
  let node: any = (el as any)[reactKey];
  const seen = new Set<any>();
  let result: FrameworkInfo | null = null;
  while (node && typeof node === 'object' && !seen.has(node)) {
    seen.add(node);
    const type = node.type || node.elementType;
    if (!result?.name && type && typeof type !== 'string') {
      // displayName is developer-supplied (React.displayName, forwardRef
      // wrapper names) and survives minification when set explicitly. Prefer
      // it. type.name is the constructor.name string, which minifies to
      // junk like "Bd" in prod builds — only accept it if it survives the
      // meaningful-name filter.
      const display = typeof type.displayName === 'string' ? type.displayName : null;
      const ctorName = typeof type.name === 'string' ? type.name : null;
      const cand = isMeaningfulComponentName(display)
        ? display!
        : isMeaningfulComponentName(ctorName) ? ctorName! : null;
      if (cand) {
        result = {framework: 'react', name: trimText(cand, 120)};
        if (display && display !== cand) {
          result.displayName = trimText(display, 180);
        }
      }
    }
    if (result && !result.source && node._debugSource) {
      result.source = {
        file: node._debugSource.fileName || node._debugSource.file || null,
        line: node._debugSource.lineNumber || node._debugSource.line || null,
      };
    }
    if (node._debugOwner) { node = node._debugOwner; continue; }
    if (node.return) { node = node.return; continue; }
    break;
  }
  // No usable name → emit nothing rather than `{framework:"react"}` with a
  // mystery 2-char name. An LLM reading the export learns nothing from
  // either shape; suppressing keeps the row honest.
  if (!result?.name) return null;

  // Walk the fiber chain to collect ancestor component names. The
  // `_debugOwner` path is more meaningful than `return` (it skips host
  // wrappers), but we fall back to `return` when owner data is
  // unavailable (production builds). Cap at 8 ancestors so the field
  // doesn't balloon for deeply-nested apps.
  const chain: string[] = [];
  const seenChain = new Set<any>();
  let walker: any = (el as any)[reactKey];
  while (walker && typeof walker === 'object' && !seenChain.has(walker) && chain.length < 8) {
    seenChain.add(walker);
    const t = walker.type || walker.elementType;
    if (t && typeof t !== 'string') {
      const n = (typeof t.displayName === 'string' && isMeaningfulComponentName(t.displayName))
        ? t.displayName
        : (typeof t.name === 'string' && isMeaningfulComponentName(t.name))
          ? t.name
          : null;
      if (n && (chain.length === 0 || chain[chain.length - 1] !== n)) chain.push(n);
    }
    walker = walker._debugOwner ?? walker.return;
  }
  if (chain.length > 0) result.chain = chain;
  return result;
};

const vueInfo = (el: Element): FrameworkInfo | null => {
  const v: any = (el as any)?.__vueParentComponent || (el as any)?.__vue_app__?._instance ||
    (el as any)?.__vnode?.component || (el as any)?.__vue__;
  const type = v?.type || v?.ctx?.type;
  // type.name is developer-set via `name: 'MyComp'`; type.__name is
  // populated by `<script setup>` and tools that infer the filename. Both
  // are real names in dev; prod builds can leave only a minified glyph.
  const rawName = type?.name || type?.__name;
  if (!isMeaningfulComponentName(rawName)) return null;
  const result: FrameworkInfo = {
    framework: 'vue',
    name: trimText(rawName, 160),
    source: {file: type?.__file || null},
  };
  // Walk the parent-component chain.
  const chain: string[] = [];
  let cur: any = v;
  const seen = new Set<any>();
  while (cur && typeof cur === 'object' && !seen.has(cur) && chain.length < 8) {
    seen.add(cur);
    const t = cur.type || cur.ctx?.type;
    const n = t?.name ?? t?.__name;
    if (typeof n === 'string' && isMeaningfulComponentName(n)) {
      if (chain.length === 0 || chain[chain.length - 1] !== n) chain.push(n);
    }
    cur = cur.parent;
  }
  if (chain.length > 0) result.chain = chain;
  return result;
};

// Lit (lit-element) — instances are custom elements whose constructor
// carries `_$litElement$`, `elementProperties`, or `styles`. The tag is
// the component's identity; the constructor name is the developer-facing
// class name when provided.
const litInfo = (el: Element): FrameworkInfo | null => {
  if (!el.tagName.includes('-')) return null;
  const ctor: any = el.constructor;
  if (!ctor) return null;
  const isLit = Boolean(
    ctor._$litElement$ ||
    ctor.elementProperties ||
    ctor._$litElementVersion$ ||
    (ctor.styles && Array.isArray(ctor.styles)),
  );
  if (!isLit) return null;
  // ctor.name in prod is a 2-char minifier glyph. The tag is the
  // developer-facing identity for any custom element — use it as the
  // canonical name when ctor.name is minified away.
  const tag = el.tagName.toLowerCase();
  const ctorName = typeof ctor.name === 'string' ? ctor.name : null;
  const name = isMeaningfulComponentName(ctorName) ? ctorName! : tag;
  return {
    framework: 'lit',
    name: trimText(name, 120),
    displayName: tag,
  };
};

// Stencil components — custom elements whose constructor exposes a
// static `is` (the tag), and which carry stencil-internal props on the
// host (`__hostCss`, `s-id`, `__stencil_subscriberId`, etc).
const stencilInfo = (el: Element): FrameworkInfo | null => {
  if (!el.tagName.includes('-')) return null;
  const ctor: any = el.constructor;
  if (!ctor) return null;
  const looksStencil = Boolean(
    typeof ctor.is === 'string' && ctor.is.includes('-') ||
    (el as any).__hostCss !== undefined ||
    (el as any).__stencil_subscriberId !== undefined ||
    el.hasAttribute('s-id'),
  );
  if (!looksStencil) return null;
  const tag = el.tagName.toLowerCase();
  // `ctor.is` is the Stencil-static tag declaration (always present, always
  // meaningful). `ctor.name` is the minified class name in prod. Fall back
  // through the same meaningfulness filter as the other frameworks.
  const isField = typeof ctor.is === 'string' ? ctor.is : null;
  const ctorName = typeof ctor.name === 'string' ? ctor.name : null;
  const name = isField || (isMeaningfulComponentName(ctorName) ? ctorName! : tag);
  return {
    framework: 'stencil',
    name: trimText(name, 120),
    displayName: tag,
  };
};

// Svelte — runtime instance lookup is sparse, but the dev-mode
// compiler attaches `__svelte_meta` to elements with source-loc info
// (`{ loc: { file, line, char } }`). In prod that property is absent,
// so detection silently falls through.
const svelteInfo = (el: Element): FrameworkInfo | null => {
  const meta: any = (el as any).__svelte_meta;
  if (!meta?.loc) return null;
  const file = typeof meta.loc.file === 'string' ? meta.loc.file : null;
  return {
    framework: 'svelte',
    name: trimText(file ?? 'svelte-component', 160),
    source: {
      file,
      line: typeof meta.loc.line === 'number' ? meta.loc.line : null,
    },
  };
};

// Generic web-component fallback — when the element has a custom-element
// tag (kebab-case) and `customElements.get(...)` recognizes it, but no
// framework-specific marker matched. Captures the tag as the identity.
const webComponentInfo = (el: Element): FrameworkInfo | null => {
  const tag = el.tagName.toLowerCase();
  if (!tag.includes('-')) return null;
  try {
    if (typeof customElements !== 'undefined' && customElements.get(tag)) {
      return {
        framework: 'web-component',
        name: tag,
        displayName: tag,
      };
    }
  } catch { /* ignore */ }
  return null;
};

// Plug-in style: try React first (most common in our captured apps),
// then Vue, then Lit / Stencil / Svelte / generic web-component. First
// resolver to return non-null wins.
const frameworkInfo = (el: Element): FrameworkInfo | null =>
  reactInfo(el) || vueInfo(el) || litInfo(el) || stencilInfo(el) || svelteInfo(el) || webComponentInfo(el);

// ---- Capture: assemble the full entry --------------------------------------
// Strip the body of long `data:` URIs (Plasmic's aspect-ratio SVG spacers,
// inlined PNG/JPEG fallbacks) since the base64 payload is mechanism, not
// signal. Keep the scheme + a length hint so an LLM can tell something
// was elided.
const elideDataUris = (html: string): string =>
  html.replace(/data:([\w/+.-]+);base64,([A-Za-z0-9+/=]{60,})/g,
    (_m, mime: string, payload: string) =>
      `data:${mime};base64,[${payload.length}-char base64 elided]`);

// Replace inline icon SVGs with placeholders. The path data of a
// Lucide/Heroicon refresh icon is ~280 bytes that an LLM doesn't need —
// the surrounding button caption already tells it what the icon means.
//
// A stripped-down `<svg/>` loses icon identity (which lucide/feather/
// heroicon was used? what aria-label described it? what class did it
// carry?). We preserve every signal that helps a repair agent locate
// the icon definition without keeping the path data:
//   • aria-label, role, title         — accessible identity
//   • data-icon, data-lucide, data-*  — common icon-library hints
//   • class                            — style hooks (`.icon-trash-2`)
//   • width, height                    — rendered size
//   • viewBox                          — coordinate system (helps
//     match against a known icon library by aspect ratio)
//   • <title>/<desc> first-child text — ARIA-recommended a11y children
const PRESERVED_SVG_ATTR_PREFIXES = ['data-', 'aria-'];
const PRESERVED_SVG_ATTRS = new Set(['role', 'class', 'width', 'height', 'viewBox', 'title', 'name', 'fill']);
const elideInlineSvgs = (html: string): string =>
  html.replace(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g, (_m, attrs: string, body: string) => {
    const out: string[] = [];
    // Pluck every preserved attribute by regex over the raw attrs string.
    // The regex tolerates unquoted values + double + single quotes.
    const attrRe = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(attrs)) !== null) {
      const name = m[1]!;
      const v = m[2] ?? m[3] ?? m[4] ?? '';
      const keep = PRESERVED_SVG_ATTRS.has(name) || PRESERVED_SVG_ATTR_PREFIXES.some((p) => name.startsWith(p));
      if (keep) out.push(`${name}="${v.replace(/"/g, '&quot;')}"`);
    }
    // Surface inner <title>/<desc> text — ARIA-recommended way to label
    // an SVG, and often the only signal of icon meaning when no aria
    // attributes are set on the host.
    const titleText = /<title[^>]*>([\s\S]*?)<\/title>/.exec(body)?.[1]?.trim();
    if (titleText) out.push(`data-pg-svg-title="${titleText.replace(/"/g, '&quot;')}"`);
    const descText = /<desc[^>]*>([\s\S]*?)<\/desc>/.exec(body)?.[1]?.trim();
    if (descText) out.push(`data-pg-svg-desc="${descText.replace(/"/g, '&quot;')}"`);
    out.push('data-pg-elided="svg"');
    return `<svg ${out.join(' ')}/>`;
  });

// `<script>` content can carry bootstrap data (`window.__APP_DATA__ =
// {token: "..."}`), API keys, vendor analytics keys, and backend URLs.
// `<style>` content is usually irrelevant noise. `<meta>` elements often
// carry CSRF/CSP tokens. Strip the inner contents of all three.
const stripDangerousElements = (html: string): string =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/\s*script\s*>/gi, '<script data-pg-elided="script-content"/>')
    .replace(/<style\b[^>]*>[\s\S]*?<\/\s*style\s*>/gi, '<style data-pg-elided="style-content"/>')
    .replace(/<meta\b[^>]*\bcontent="[^"]*"[^>]*>/gi, (m) => {
      // Keep meta name/charset visible but redact `content` if the name
      // looks token-bearing.
      const nameMatch = /\bname="([^"]*)"/.exec(m);
      const name = nameMatch?.[1] ?? '';
      if (/(csrf|token|xsrf|nonce|api[_-]?key)/i.test(name)) {
        return m.replace(/\bcontent="[^"]*"/, 'content="[redacted: meta-token]"');
      }
      return m;
    });

// Cap outerHTML to a clone of the live element with descendants beyond
// `maxDepth` levels replaced by `<!-- N children elided -->` markers. The
// roast called out a single grouped capture coming back at 25 KB because
// the `outerHTML` swallowed 60 sparkline data spans — exactly what a
// depth cap solves at the source. Returns the cloned outerHTML and how
// many descendant subtrees were elided.
// Serialize an element's shadowRoot content as `<template shadowrootmode="…">…</template>`.
// `cloneNode(true)` does NOT include shadow DOM, so captures of custom-element
// hosts (Lit's `<forecast-item>`, Stencil components, generic web-components)
// would otherwise come back as `<forecast-item></forecast-item>` — an LLM
// reading that row sees nothing about what the host actually renders. We use
// the declarative-shadow-DOM serialization shape so the LLM (and any tooling)
// can tell shadow content from light-DOM children, AND so the payload is
// round-trippable into another browser if a consumer wants to.
const serializeShadowContent = (host: Element, depth: number, maxDepth: number, elided: {count: number}): string | null => {
  const sr = (host as any).shadowRoot as ShadowRoot | null | undefined;
  if (!sr) return null;
  const mode = sr.mode || 'open';
  // Clone each top-level shadow child individually so we can apply the same
  // depth-cap walker to them.
  const parts: string[] = [];
  for (const child of Array.from(sr.children)) {
    parts.push(serializeWithShadow(child, depth + 1, maxDepth, elided));
  }
  return `<template shadowrootmode="${mode}">${parts.join('')}</template>`;
};

// Serialize an element + its shadow content into HTML, applying the
// depth-cap walker uniformly to both. Caller passes a shared `elided`
// counter so the final count reflects all subtrees we collapsed.
const serializeWithShadow = (el: Element, depth: number, maxDepth: number, elided: {count: number}): string => {
  // Reconstruct the open tag from attributes (innerHTML would be cheaper
  // but we can't combine it with a manually-serialized shadow root).
  const tag = el.tagName.toLowerCase();
  const attrs: string[] = [];
  if (el.attributes) {
    for (const a of Array.from(el.attributes)) {
      // Escape attribute value's double-quotes and ampersands so the
      // produced HTML round-trips.
      const v = String(a.value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      attrs.push(`${a.name}="${v}"`);
    }
  }
  const open = `<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
  // Self-closing voids — match HTML spec serializer behavior.
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  if (VOID.has(tag)) return open;

  const shadow = serializeShadowContent(el, depth, maxDepth, elided);

  // Depth cap kicks in for the LIGHT-DOM children only; the shadow content
  // already counts its own depth via the recursive call.
  let lightInner: string;
  if (depth >= maxDepth && el.children.length) {
    const count = el.children.length;
    elided.count += count;
    lightInner = `<!-- ${count} ${count === 1 ? 'child' : 'children'} elided -->`;
  } else {
    const segs: string[] = [];
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === 1 /* element */) {
        segs.push(serializeWithShadow(node as Element, depth + 1, maxDepth, elided));
      } else if (node.nodeType === 3 /* text */) {
        segs.push(String(node.nodeValue ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      } else if (node.nodeType === 8 /* comment */) {
        segs.push(`<!--${String(node.nodeValue ?? '')}-->`);
      }
    }
    lightInner = segs.join('');
  }
  // Declarative shadow DOM convention: <template shadowrootmode> sits as the
  // first child of the host's content, BEFORE light-DOM children. Mirrors
  // the spec so an LLM (or HTML parser) reading this knows shadow from light.
  return `${open}${shadow ?? ''}${lightInner}</${tag}>`;
};

const cappedOuterHTML = (el: Element, maxDepth = 2): {html: string; elided: number} => {
  // Fast path: element has no shadow root and neither do its descendants
  // we'd touch. cloneNode + the original walk is cheaper than the manual
  // serializer, and it preserves quirks (boolean attribute serialization,
  // namespaced SVG, etc.) that the manual path approximates.
  const hasAnyShadow = (() => {
    if ((el as any).shadowRoot) return true;
    // Cheap scan: look at the first ~50 descendants for a shadowRoot. A
    // page with many shadow hosts is rare in light-DOM apps; the cost of
    // the full scan would defeat the purpose. 50 is enough to catch the
    // common case (a single shadow root inside the captured subtree).
    try {
      const desc = el.querySelectorAll('*');
      const N = Math.min(desc.length, 50);
      for (let i = 0; i < N; i++) if ((desc[i] as any).shadowRoot) return true;
    } catch { /* ignore */ }
    return false;
  })();
  if (hasAnyShadow) {
    const elided = {count: 0};
    try {
      const html = serializeWithShadow(el, 0, maxDepth, elided);
      return {html, elided: elided.count};
    } catch {
      // Fall through to cloneNode path as a safety net.
    }
  }
  let elided = 0;
  try {
    const clone = el.cloneNode(true) as Element;
    const walk = (node: Element, depth: number): void => {
      if (!node.children || !node.children.length) return;
      if (depth >= maxDepth) {
        const count = node.children.length;
        elided += count;
        node.innerHTML = `<!-- ${count} ${count === 1 ? 'child' : 'children'} elided -->`;
        return;
      }
      for (const child of Array.from(node.children)) walk(child, depth + 1);
    };
    walk(clone, 0);
    return {html: clone.outerHTML, elided};
  } catch {
    return {html: el.outerHTML, elided: 0};
  }
};

// Returns BOTH the trimmed HTML and the original byte length when the
// trim cap kicked in. Lets captureEntry expose `truncated.outerHTML`
// (per BUG-013) so a consumer can detect elision and refetch if needed.
const trimHtmlWithSize = (html: string, max: number): {value: string; truncated?: number} => {
  if (!html) return {value: html};
  let cleaned = elideDataUris(html);
  cleaned = elideInlineSvgs(cleaned);
  cleaned = stripDangerousElements(cleaned);
  if (cleaned.length <= max) return {value: cleaned};
  const originalLen = html.length;
  const cut = cleaned.slice(0, max);
  const last = cut.lastIndexOf('>');
  const value = (last > max - 200 ? cut.slice(0, last + 1) : cut) + '…';
  return {value, truncated: originalLen};
};

const trimHtml = (html: string, max: number): string => trimHtmlWithSize(html, max).value;

const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)};
};

// Generate a uuid that works in service workers, content scripts, and
// older Chrome contexts. crypto.randomUUID exists in modern browsers; the
// fallback uses crypto.getRandomValues if available, else a per-page counter.
let fallbackUidCounter = 0;
const uuid = (): string => {
  try { if (crypto.randomUUID) return crypto.randomUUID(); } catch { /* fall through */ }
  try {
    const a = new Uint8Array(16);
    crypto.getRandomValues(a);
    a[6] = (a[6]! & 0x0f) | 0x40;
    a[8] = (a[8]! & 0x3f) | 0x80;
    const h = Array.from(a).map((b) => b.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  } catch {
    return `uid_${Date.now().toString(36)}_${(++fallbackUidCounter).toString(36)}`;
  }
};

// True if `el` has at least one direct text-node child with non-whitespace
// content. The roast caught us emitting concatenated descendant text on
// container elements (`<header>`, `<main>`, etc.) as `text` — which
// produced 200-char dumps that were noise to LLMs. Only emit `text` when
// the element directly owns text or is otherwise a content-bearing leaf.
const hasOwnTextNode = (el: Element): boolean => {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3 /* TEXT_NODE */) {
      const v = (node as Text).nodeValue ?? '';
      if (v.trim().length > 0) return true;
    }
  }
  return false;
};

// Optional click context. Threaded by the content-script when the
// capture is driven by a click (alt-click, alt-shift-click, alt-drag);
// absent for manual-capture / recapture / programmatic flows. Used to
// compute canvas-relative click coordinates when the captured element
// lives inside a `<canvas>`.
export type CaptureOpts = {
  clickAt?: {clientX: number; clientY: number};
};

const findCanvasAncestor = (el: Element): HTMLCanvasElement | null => {
  let cur: Element | null = el;
  while (cur) {
    if (cur instanceof HTMLCanvasElement) return cur;
    cur = cur.parentElement;
  }
  return null;
};

export const captureEntry = (el: Element, sequence: number, opts: CaptureOpts = {}): Entry => {
  const tag = el.tagName.toLowerCase();
  // textContent (NOT innerText) so source `Refresh` doesn't get captured
  // as the CSS-rendered `REFRESH`. Roast BUG-001.
  // Skip on non-leaf containers that don't own direct text — otherwise
  // the value is the concatenation of every descendant's text, often
  // truncated mid-word, which an LLM treats as one wall of mush.
  const isLeafish = !el.children?.length || hasOwnTextNode(el);
  const text = isLeafish ? trimText(el.textContent, 250) : '';
  const role = attr(el, 'role') || implicitRole(el);
  // Capture the visually-rendered form too when CSS transformed it. Useful
  // for LLMs that need both source and rendered for a UI bug like "the
  // label says SNOOZE 1H in the screenshot but the source has Snooze 1h".
  const renderedText = (() => {
    try {
      const cs = window.getComputedStyle(el);
      if (cs.textTransform && cs.textTransform !== 'none') {
        const r = trimText((el as HTMLElement).innerText, 250);
        return r && r !== text ? r : null;
      }
    } catch { /* ignore */ }
    return null;
  })();
  const accName = accessibleName(el, role);
  const testId = attr(el, 'data-testid') || attr(el, 'data-test') ||
    attr(el, 'data-cy') || attr(el, 'data-qa');
  const stableId = isStableId(el.id) ? el.id : null;
  const classes = el.classList ? Array.from(el.classList).slice(0, 32) : [];
  const {attrs, hints} = populatedAttrs(el);
  const compRoot = componentRoot(el);
  const fwk = frameworkInfo(el);
  const trueStates = pickTrueStates(el);
  const styles = essentialStyles(el);
  const pseudo = pseudoStyles(el);
  const rules = collectMatchedRules(el);
  const root = el.getRootNode();
  const inShadow = root instanceof ShadowRoot;
  // Shadow-rooted elements aren't reachable from `document.querySelectorAll`,
  // so uniqueness checks against the document always fail. Scope to the
  // owning ShadowRoot when present — that's also where a consumer querying
  // `shadowHost.shadowRoot.querySelector(...)` would resolve the selector.
  const scope: Document | ShadowRoot = inShadow ? (root as ShadowRoot) : document;

  // Test-IDs and stable IDs are PREFERRED, but only when actually unique on
  // the page. Real-world weather/list UIs commonly tag every card with the
  // same `data-testid="forecast-item"` — emitting `[data-testid="forecast-item"]`
  // would resolve to 7 elements and the consumer can't tell which one was
  // captured. When the testId / stableId is non-unique we fall through to
  // cssPath, which adds whatever path / ancestor scope makes the captured
  // element addressable.
  let selector: string;
  if (testId) {
    const testIdSel = `[data-testid="${testId}"]`;
    if (isUnique(scope, testIdSel, el)) {
      selector = testIdSel;
    } else {
      // Try anchoring the testId to a unique ancestor, or appending the
      // captured element's path-tail. cssPath() already does both via the
      // ARIA / role / unique-class ancestor ladder, but it doesn't START
      // from the testId. We bias toward keeping the testId visible by
      // pairing it with a child descriptor that distinguishes siblings.
      const parent = el.parentElement;
      let scoped = '';
      if (parent) {
        const sameTagSibs = Array.from(parent.children).filter((c) => c.nodeName === el.nodeName);
        if (sameTagSibs.length > 1) {
          scoped = `${testIdSel}:nth-of-type(${sameTagSibs.indexOf(el) + 1})`;
          if (isUnique(scope, scoped, el)) {
            selector = scoped;
          } else {
            selector = cssPath(el);
          }
        } else {
          selector = cssPath(el);
        }
      } else {
        selector = cssPath(el);
      }
    }
  } else if (stableId) {
    const idSel = `#${escapeCss(stableId)}`;
    selector = isUnique(scope, idSel, el) ? idSel : cssPath(el);
  } else {
    selector = cssPath(el);
  }

  // Cap outerHTML at depth=2 BEFORE the length-cap pass: a sparkline
  // wrapper with 60 data spans would otherwise consume ~9 KB of one
  // entry. Cloning into a detached subtree lets us replace deep
  // children with `<!-- N children elided -->` markers without
  // touching the live DOM.
  const cappedHtml = cappedOuterHTML(el, 2);
  const trimmed = trimHtmlWithSize(cappedHtml.html, MAX_SNIPPET);
  const out: Entry = {
    uid: uuid(),
    n: sequence,
    ts: new Date().toISOString(),
    url: location.href,
    tag,
    selector,
    outerHTML: trimmed.value,
    rect: rectOf(el),
    // Round dpr to 2 decimals — Windows display scaling reports raw values
    // like 1.7999999523162842 (== 1.8) which is float-arithmetic noise.
    // Capture user-preference media-query state too (light vs dark, motion
    // pref) so a downstream LLM can reason about why a captured
    // appearance might differ between sessions.
    viewport: buildViewportSnapshot(),
  };
  if (cappedHtml.elided > 0 || trimmed.truncated !== undefined) {
    out.truncated = {};
    if (cappedHtml.elided > 0) out.truncated.children = cappedHtml.elided;
    if (trimmed.truncated !== undefined) out.truncated.outerHTML = trimmed.truncated;
  }
  if (text) out.text = text;
  if (renderedText) out.renderedText = renderedText;
  if (role) out.role = role;
  if (accName && accName !== text) out.accessibleName = accName;
  if (stableId) out.id = stableId;
  if (testId) out.testId = testId;
  if (classes.length) out.classes = classes;
  if (Object.keys(attrs).length) out.attrs = attrs;
  if (hints) out.hints = hints;
  if (inShadow) {
    out.inShadowDOM = true;
    const sh = shadowHostSelector(el);
    if (sh) out.shadowHost = sh;
  }
  if (compRoot?.compact) out.componentRoot = compRoot.compact;
  const ancestors = ancestorChain(el);
  if (ancestors.length) out.ancestors = ancestors;
  if (fwk) out.component = fwk;
  const events = collectEventNames(el);
  if (events) out.events = events;
  const behaviorAttrs = collectBehaviorAttrs(el);
  if (behaviorAttrs) out.behaviorAttrs = behaviorAttrs;
  if (hasActiveAnimation(el)) out.isAnimating = true;
  // Capture asset references so complaints about logos / icons /
  // artwork can be repaired without visual guessing. Walks <img>,
  // <picture><source>, and <svg use href> within the captured subtree
  // (one level only — descendant scope is already capped by outerHTML
  // elision).
  const assets: Array<{src: string; naturalW?: number; naturalH?: number; renderedW?: number; renderedH?: number; alt?: string; loaded?: boolean}> = [];
  try {
    const imgList = el.querySelectorAll('img');
    for (let i = 0; i < imgList.length && assets.length < 8; i++) {
      const img = imgList[i] as HTMLImageElement;
      const src = img.currentSrc || img.src;
      if (!src || src.startsWith('data:')) continue; // skip data: URIs
      const r = img.getBoundingClientRect();
      assets.push({
        src: trimText(src, 200),
        naturalW: img.naturalWidth || undefined,
        naturalH: img.naturalHeight || undefined,
        renderedW: Math.round(r.width) || undefined,
        renderedH: Math.round(r.height) || undefined,
        alt: img.alt || undefined,
        loaded: img.complete && img.naturalWidth > 0,
      });
    }
    const useList = el.querySelectorAll('use[href], use[xlink\\:href]');
    for (let i = 0; i < useList.length && assets.length < 12; i++) {
      const u = useList[i] as SVGUseElement;
      const href = u.getAttribute('href') || u.getAttribute('xlink:href');
      if (href) assets.push({src: trimText(href, 200)});
    }
    // Element's own background-image (CSS-driven artwork — logos
    // sometimes ship via `background-image: url(...)`).
    try {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') {
        const urlM = /url\((['"]?)(.+?)\1\)/.exec(bg);
        if (urlM && !urlM[2]!.startsWith('data:')) {
          assets.push({src: trimText(urlM[2]!, 200)});
        }
      }
    } catch { /* ignore */ }
  } catch { /* ignore */ }
  if (assets.length) out.assets = assets;

  // Ship an a11y check on every entry (contrast ratio for text,
  // tabbability flag) so reviewers don't need to re-run an audit.
  // Heavier checks (focus-visible screenshot, axe-style violations)
  // need their own pipeline; this is the in-capture portion.
  const a11y = computeAccessibilityCheck(el);
  if (a11y) out.a11y = a11y;
  // Parent layout context (overflow / position / flex / grid / scroll
  // containers / stacking). Layout bugs typically live in the ancestor
  // chain, not on the captured element itself.
  const layout = captureLayoutContext(el);
  if (layout.length) out.layoutContext = layout;
  // Last few DOM mutations before the click — repro context (§4.8).
  // The content-script-owned ring buffer feeds us the recent history;
  // we slice the last 3 so the entry stays small. Skipped when the
  // getter isn't wired (test/standalone harnesses).
  if (mutationBufferGetter) {
    try {
      const recent = mutationBufferGetter();
      // Filter out tool-induced mutations (cursor swap, body style
      // hits from crosshair mode, overlay paints, ring repaints) so
      // the consumer doesn't have to wonder whether `body { cursor:
      // crosshair }` is part of their app. We mark our own mutations
      // by source and exclude them; un-marked mutations are app-driven.
      const TOOL_NOISE_RE = /^(html|body|#__pinchgrab_overlay)\b|cursor|user-select|webkit-user-select/i;
      const filtered = recent.filter((m) => {
        if (TOOL_NOISE_RE.test(m.target)) return false;
        if (m.type === 'attributes' && m.attributeName && /^(style|cursor)$/.test(m.attributeName)) {
          // body { cursor: crosshair } from PinchGrab's drag mode
          return !(m.target.startsWith('html') || m.target.startsWith('body'));
        }
        return true;
      });
      if (filtered.length) out.domMutations = filtered.slice(-3);
    } catch { /* ignore observer errors */ }
  }
  // Contenteditable editor context (F.5). When the captured element
  // lives inside a rich-text editor (ProseMirror / Lexical / Slate /
  // Quill / TipTap / native), surface the library kind + root selector
  // so an LLM looking at "copy is wrong" feedback knows the editor
  // wrapper to inspect rather than chasing internal editor selectors.
  const editor = editorContext(el);
  if (editor) out.editor = editor;
  // Canvas click coords (F.3). When the capture target is a canvas (or
  // a descendant — DataDog-style charts often render into a canvas with
  // pseudo-elements layered on top), compute click position relative to
  // the canvas's bounding box. Skipped if the caller didn't provide
  // click coords (manual-capture / recapture flows).
  if (opts.clickAt) {
    const canvas = findCanvasAncestor(el);
    if (canvas) {
      const r = canvas.getBoundingClientRect();
      out.canvasClick = {
        offsetX: Math.round(opts.clickAt.clientX - r.left),
        offsetY: Math.round(opts.clickAt.clientY - r.top),
        canvasW: Math.round(r.width),
        canvasH: Math.round(r.height),
        canvasSelector: (() => { try { return cssPath(canvas); } catch { return 'canvas'; } })(),
      };
    }
  }
  if (trueStates.length) out.states = trueStates;
  if (Object.keys(styles).length) out.styles = styles;
  if (rules.length) out.matchedRules = rules;
  if (Object.keys(pseudo).length) out.pseudoElements = pseudo;

  // Locator quality: how many elements `selector` resolves to in its
  // scope (1 = unique). >1 means the selector is ambiguous; useful
  // when paired with rect / ancestors to disambiguate.
  try {
    out.selectorMatchCount = scope.querySelectorAll(selector).length;
  } catch { /* invalid selector, leave fields off */ }

  return out;
};

const collectRootCssVars = (): Record<string, string> => {
  const cs = window.getComputedStyle(document.documentElement);
  const out: Record<string, string> = {};
  for (let i = 0; i < cs.length; i++) {
    const n = cs[i];
    if (n?.startsWith('--')) {
      const v = cs.getPropertyValue(n).trim();
      if (v) out[n] = v;
    }
  }
  return out;
};

// Shared viewport snapshot — used by both buildPageContext (session
// header) and captureEntry (per-capture, in case state changed between
// the page row and the capture). Picks up dpr rounding, colorScheme,
// reducedMotion, RTL direction (F.13), and visualViewport zoom (F.14).
const buildViewportSnapshot = (): Viewport => {
  const v: Viewport = {
    w: Math.round(window.innerWidth),
    h: Math.round(window.innerHeight),
    dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
  };
  try {
    if (matchMedia('(prefers-color-scheme: dark)').matches) v.colorScheme = 'dark';
    else if (matchMedia('(prefers-color-scheme: light)').matches) v.colorScheme = 'light';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) v.reducedMotion = true;
  } catch { /* ignore */ }
  // Document direction. `dir="rtl"` on <html>, or computed CSS direction
  // when an LTR document embeds an RTL subtree. We snapshot the document
  // root's computed direction.
  try {
    const dir = window.getComputedStyle(document.documentElement).direction;
    if (dir === 'rtl') v.direction = 'rtl';
    else if (dir === 'ltr') v.direction = 'ltr';
  } catch { /* ignore */ }
  // Zoom level. `visualViewport.scale` is the pinch-zoom factor on
  // touch devices; on desktop with browser zoom the value stays at 1
  // but window.innerWidth/Height shrink, so this won't pick up
  // Ctrl+plus/minus zoom — that surfaces as a smaller viewport. Both
  // are useful and we capture both.
  try {
    const scale = (window.visualViewport as any)?.scale;
    if (typeof scale === 'number' && Math.abs(scale - 1) > 0.001) {
      v.zoom = Math.round(scale * 100) / 100;
    }
  } catch { /* ignore */ }
  return v;
};

// Recent-Tab tracker for activeFocus. Wired by content-script.ts at
// boot; we keep the timestamp of the last Tab keydown so buildPageContext
// can decide whether to flag the focus as "keyboard-driven".
let lastTabAt = 0;
export const noteTabPressed = (): void => { lastTabAt = Date.now(); };

const activeFocusSnapshot = (): {selector?: string; recentlyTabbed?: boolean} | null => {
  const ae = document.activeElement;
  if (!ae || ae === document.body || ae === document.documentElement) return null;
  let selector: string | undefined;
  try { selector = cssPath(ae); } catch { selector = ae.tagName.toLowerCase(); }
  const out: {selector?: string; recentlyTabbed?: boolean} = {selector};
  if (Date.now() - lastTabAt < 1000) out.recentlyTabbed = true;
  return out;
};

// Read git context from a `<meta name="pinchgrab-build" content="commit:abc
// branch:main">` tag if the captured app exposes one. No-op when absent.
// Lets a downstream consumer answer "which build was this captured from?"
// without forcing the user to remember.
const readGitContext = (): {commit?: string; branch?: string; build?: string} | null => {
  const meta = document.querySelector('meta[name="pinchgrab-build"]') as HTMLMetaElement | null;
  if (!meta?.content) return null;
  const content = meta.content;
  const out: {commit?: string; branch?: string; build?: string} = {};
  const commit = /\bcommit:([\w.-]+)/.exec(content)?.[1];
  const branch = /\bbranch:([\w./-]+)/.exec(content)?.[1];
  const build = /\bbuild:([\w./-]+)/.exec(content)?.[1];
  if (commit) out.commit = trimText(commit, 80);
  if (branch) out.branch = trimText(branch, 80);
  if (build) out.build = trimText(build, 80);
  return Object.keys(out).length ? out : null;
};

// A URL alone doesn't tell an agent what the user was looking at.
// Many SPAs drive routing via query params (`?route=settings`), hash
// routes (`#/users/42`), or path segments. Best-effort breakdown from
// the URL — receivers verify against the screenshot if they care.
const buildRouteSnapshot = (): {pathname?: string; query?: Record<string, string>; hash?: string; routeName?: string; routeParam?: string} => {
  const out: {pathname?: string; query?: Record<string, string>; hash?: string; routeName?: string; routeParam?: string} = {};
  try {
    const u = new URL(location.href);
    if (u.pathname) out.pathname = u.pathname;
    if (u.hash) out.hash = u.hash;
    const params: Record<string, string> = {};
    let nParams = 0;
    for (const [k, v] of u.searchParams) {
      if (nParams >= 16) break;
      params[k] = trimText(v, 200);
      nParams++;
    }
    if (Object.keys(params).length) out.query = params;
    // Common SPA route hints: `?route=settings`, `?tab=foo`, `#/users/42`.
    const routeQuery = u.searchParams.get('route') ?? u.searchParams.get('tab') ?? u.searchParams.get('view');
    if (routeQuery) out.routeName = trimText(routeQuery, 80);
    if (u.hash && u.hash.length > 1) {
      const hashPath = u.hash.replace(/^#\/?/, '');
      const segs = hashPath.split('/').filter(Boolean);
      if (segs.length) {
        out.routeName = out.routeName ?? trimText(segs[0]!, 80);
        if (segs.length > 1) out.routeParam = trimText(segs.slice(1).join('/'), 200);
      }
    }
  } catch { /* ignore */ }
  return out;
};

// Capture a redacted state snapshot so receivers can repro the screen.
// We avoid copying everything — that would leak secrets — and surface
// only:
//   • localStorage keys + sizes (NOT values; receivers need to know
//     what storage shaped the screen, not the contents)
//   • cookie names (NO values, ever)
//   • known feature-flag conventions: `<meta name="pinchgrab-flags">`
const buildStateSnapshot = (): {storageKeys?: string[]; sessionKeys?: string[]; cookieNames?: string[]; featureFlags?: string} | null => {
  const out: {storageKeys?: string[]; sessionKeys?: string[]; cookieNames?: string[]; featureFlags?: string} = {};
  try {
    const lsKeys: string[] = [];
    for (let i = 0; i < localStorage.length && lsKeys.length < 32; i++) {
      const k = localStorage.key(i);
      if (k) lsKeys.push(k);
    }
    if (lsKeys.length) out.storageKeys = lsKeys;
  } catch { /* SecurityError on cross-origin frames */ }
  try {
    const ssKeys: string[] = [];
    for (let i = 0; i < sessionStorage.length && ssKeys.length < 32; i++) {
      const k = sessionStorage.key(i);
      if (k) ssKeys.push(k);
    }
    if (ssKeys.length) out.sessionKeys = ssKeys;
  } catch { /* ignore */ }
  try {
    const cookieNames = document.cookie
      .split(';')
      .map((c) => c.trim().split('=')[0]!)
      .filter(Boolean)
      .slice(0, 32);
    if (cookieNames.length) out.cookieNames = cookieNames;
  } catch { /* ignore */ }
  try {
    const flagMeta = document.querySelector('meta[name="pinchgrab-flags"]') as HTMLMetaElement | null;
    if (flagMeta?.content) out.featureFlags = trimText(flagMeta.content, 400);
  } catch { /* ignore */ }
  return Object.keys(out).length ? out : null;
};

export const buildPageContext = () => {
  const ctx: any = {
    url: location.href,
    title: trimText(document.title, 200),
    viewport: buildViewportSnapshot(),
    tokens: collectRootCssVars(),
    userAgent: trimText(navigator.userAgent, 240),
    lang: document.documentElement.getAttribute('lang') || navigator.language || '',
  };
  const git = readGitContext();
  if (git) ctx.gitContext = git;
  const focus = activeFocusSnapshot();
  if (focus) ctx.activeFocus = focus;
  const route = buildRouteSnapshot();
  if (Object.keys(route).length) ctx.route = route;
  const state = buildStateSnapshot();
  if (state) ctx.state = state;
  return ctx;
};

// ---- Element-set semantics for rubber-band drag ---------------------------
const STRONG_ID_RE = /^(radix-|headlessui-|mui-|:r[0-9a-z]+:)/i;
const isStrongMarker = (el: Element): boolean =>
  Boolean(
    el.getAttribute('data-testid') || el.getAttribute('data-test') ||
    el.getAttribute('data-cy') || el.getAttribute('data-qa') ||
    el.getAttribute('role') || (el.id && !STRONG_ID_RE.test(el.id)),
  );
const MEDIUM_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'FORM']);
const WEAK_TAGS = new Set(['ARTICLE', 'SECTION', 'NAV', 'HEADER', 'FOOTER', 'LI']);
const isMediumMarker = (el: Element): boolean => MEDIUM_TAGS.has(el.tagName);
const isWeakMarker = (el: Element): boolean =>
  WEAK_TAGS.has(el.tagName) || /^H[1-6]$/.test(el.tagName);

// Snap hover/click target to its nearest "component" ancestor. Without
// this, alt-hovering a button with structured children (icon span +
// label span) selects whichever inner span the cursor happened to land
// on — three different captures of the "same component" depending on a
// few-pixel mouse difference. Snap walks up the DOM looking for the
// closest STRONG or MEDIUM marker within `maxDepth` levels and returns
// that ancestor; falls back to the original element when none is found.
//
// Also folds the existing "known captured selector ancestor" lookup into
// one helper so callers don't have to chain two passes.
// True when an element fills 90%+ of the viewport in both axes. The
// runtime filters out such captures (alt-click skips, drag rejects)
// because grabbing the page wrapper is never the user's intent. Used
// here in snapToComponent to AVOID walking up to a huge ancestor —
// that produced silent failures on sites like wranngle.com/about
// where the nearest STRONG marker is `<main id="main">` (huge), so
// the user's alt-click on a heading got snapped to <main> and then
// rejected for being huge, with no capture and no ring.
const isHugeViewportFill = (el: Element): boolean => {
  if (el === document.body || el === document.documentElement) return true;
  const r = el.getBoundingClientRect();
  return r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9;
};

export const snapToComponent = (
  tgt: Element,
  knownCaptured: ReadonlySet<string>,
  maxDepth = 4,
): Element => {
  // First pass: prefer a known-captured ancestor (so re-hovering a child
  // of an already-saved card snaps to the card).
  if (knownCaptured.size) {
    let cur: Element | null = tgt;
    while (cur && cur !== document.body) {
      for (const sel of knownCaptured) {
        try { if (cur.matches(sel)) return cur; } catch { /* invalid selector */ }
      }
      cur = cur.parentElement;
    }
  }
  // Second pass: nearest STRONG or MEDIUM marker within depth, BUT
  // skip any ancestor that's viewport-sized. The runtime's huge-element
  // filter rejects huge captures, so snapping there is a guaranteed
  // silent miss. If the marker we find is huge, keep walking and try
  // the next; if nothing in-depth is non-huge, return the original
  // click target (which captureEntry then validates separately).
  let cur: Element | null = tgt;
  for (let i = 0; i <= maxDepth && cur && cur !== document.body; i++) {
    if ((isStrongMarker(cur) || isMediumMarker(cur)) && !isHugeViewportFill(cur)) return cur;
    cur = cur.parentElement;
  }
  return tgt;
};

// 3D-app-style rigorous selection: pre-collect a STABLE candidate set when
// the drag starts (`pickDragCandidates`), then `elementsInRect` filters
// that set by the rubber-band rect each frame. The pool is locked once so
// the rubber band grows / shrinks monotonically with rect size — no random
// selects/deselects mid-drag.
//
// Earlier this function picked a single "tier" (STRONG=data-testid →
// MEDIUM=role/id/button → WEAK=class), preferring whichever had ≥2 hits,
// and silently EXCLUDED everything outside that tier for the rest of the
// drag. The user reported it felt like the marquee was "discriminating on
// z or tree tier" — exactly the symptom of a strongly-marked sibling
// hijacking the tier and filtering out an element the user could clearly
// see inside the rect. We now return every visible non-overlay element;
// the innermost-only filter in elementsInRect drops ancestor matches when
// a descendant also matches, which gives the intuitive "select what's in
// the rect" behavior without the invisible exclusion.
//
// Selection mode (drag direction):
//   • 'full'    — element bbox FULLY ENCLOSED by the rect (left→right).
//   • 'partial' — element bbox INTERSECTS the rect (right→left).
export const pickDragCandidates = (overlayHost: Element): Element[] => {
  const allRaw = Array.from(document.body.querySelectorAll('*'));
  return allRaw.filter((el) => {
    if (overlayHost.contains(el)) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    // Drop the page-spanning wrappers (body, full-bleed sections, etc.);
    // those would always match the rect and crowd out their children.
    if (r.width > window.innerWidth * 0.9 && r.height > window.innerHeight * 0.9) return false;
    return true;
  });
};

export const elementsInRect = (
  candidates: readonly Element[],
  x1: number, y1: number, x2: number, y2: number,
  mode: 'partial' | 'full' = 'partial',
): Element[] => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const matches: Element[] = [];
  for (const el of candidates) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (mode === 'full') {
      if (r.left < minX || r.top < minY || r.right > maxX || r.bottom > maxY) continue;
    } else {
      if (r.right < minX || r.left > maxX || r.bottom < minY || r.top > maxY) continue;
    }
    matches.push(el);
  }
  // Innermost — drop ancestors that contain another match. Stable because
  // it only depends on the matches set, not on ranks.
  //
  // No artificial cap. The earlier 24-element ceiling existed to keep
  // ring repaint cost predictable in worst-case "rubber-band the whole
  // viewport" drags, but it became user-visible: a real selection of
  // ~30 grid cells would silently drop the trailing ones with no
  // feedback. Two safer mitigations now keep performance bounded:
  //   • pickDragCandidates already trims body / page-spanning wrappers
  //     (the elements that would otherwise dominate any rect).
  //   • content-script paints rings via a diff (only NEW elements get
  //     a ring), so a stable 200-element selection is one paint, not
  //     200 paints per frame.
  // If a future page genuinely produces thousands of innermost matches
  // we'll revisit; until then, ship what the user actually drew.
  return matches.filter((a) => !matches.some((b) => a !== b && a.contains(b)));
};
