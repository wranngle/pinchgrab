// PinchGrab content script — Alt+Click capture, Alt+drag rubber-band,
// gold-staging multi-select, on-page comment overlay. Loaded on every page;
// communicates with the side panel via chrome.runtime messages (and a
// CustomEvent fallback in standalone test/Playwright mode).
//
// Decomposed into:
//   • dom.ts     — pure helpers (cssPath, captureEntry, elementsInRect)
//   • types.ts   — shared types & message protocol
//   • this file  — overlay, hover state machine, drag, IPC plumbing
//
// Re-entry guard: if a previous instance already ran in this page (e.g.
// service-worker re-injection on tab activation), reuse it.

import {
  captureEntry,
  buildPageContext,
  cssPath,
  compactTarget,
  elementsInRect,
  pickDragCandidates,
  snapToComponent,
  noteTabPressed,
  setMutationBufferGetter,
} from './dom.ts';
import type {
  AnnotationPayload,
  CsToPanel,
  DomMutation,
  Entry,
  PageSnapshot,
  PageSnapshotReply,
  PanelToCs,
  PgEnvelope,
} from './types.ts';
import {pg} from './types.ts';
import {PG_ICONS} from './lucide.ts';

declare global {
  interface Window {
    __pinchgrabContent?: PinchgrabApi;
    __pinchgrab?: PinchgrabApi;
  }
}

type PinchgrabApi = {
  captureEntry: typeof captureEntry;
  buildPageContext: typeof buildPageContext;
  captures: Array<{entry: Entry; page: ReturnType<typeof buildPageContext>; grouped?: boolean}> | null;
  flashElement: (sel: string) => void;
  setAlt: (on: boolean) => void;
  nextSeq: () => number;
  handleCommand: (msg: PgEnvelope<PanelToCs>, respond: (r: any) => void) => boolean;
  destroy: () => void;
};

const LOG = '[PinchGrab/cs]';
const KEY = '__pinchgrabContent';

if (window[KEY]) {
  console.log(LOG, 'already initialized; reusing.');
} else {
  init();
}

function init(): void {
  // Cross-world takeover: an extension reload orphans the previous content
  // script in a *different isolated world*, where our window[KEY] guard
  // can't see it — but its DOM overlay and capture listeners persist with a
  // dead chrome.runtime ("Alt stops working"). Plain DOM events DO cross
  // isolated worlds: fire the takeover signal so any predecessor tears
  // itself down, sweep its stale overlay, and register the same listener
  // for our own successor.
  try { document.dispatchEvent(new Event('__pinchgrab-takeover')); } catch { /* ignore */ }
  document.getElementById('__pinchgrab_overlay')?.remove();

  const inExtension = typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);
  const testCaptures = inExtension ? null : ([] as Array<{entry: Entry; page: ReturnType<typeof buildPageContext>; grouped?: boolean}>);

  // Orphan self-detection: after an extension reload, chrome.runtime.id in
  // the old world goes undefined (or throws). Hot handlers short-circuit
  // through this guard and tear the orphan down instead of silently eating
  // Alt gestures forever.
  let destroyed = false;
  const contextAlive = (): boolean => {
    if (!inExtension) return true;
    try { return Boolean(chrome.runtime?.id); } catch { return false; }
  };
  const orphanGuard = (): boolean => {
    if (destroyed) return false;
    if (contextAlive()) return true;
    console.warn(LOG, 'extension context invalidated — tearing down orphaned content script');
    try { window[KEY]?.destroy(); } catch { /* ignore */ }
    return false;
  };

  // ─── Overlay shadow host (rings, rubber-band, annotation) ────────────────
  // Strict-CSP pages (GitHub, banks) reject inline <style> tags AND
  // adoptedStyleSheets — both are gated by the page's `style-src`. Browsers
  // do allow inline-style mutations through the JS `HTMLElement.style` API,
  // so we apply every overlay style that way (see applyStyles below).
  const overlayHost = document.createElement('div');
  overlayHost.id = '__pinchgrab_overlay';
  Object.assign(overlayHost.style, {
    all: 'initial', position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
    pointerEvents: 'none', zIndex: '2147483646',
  });
  document.documentElement.appendChild(overlayHost);
  const shadow = overlayHost.attachShadow({mode: 'open'});

  // ─── Top-layer promotion ──────────────────────────────────────────────────
  // A max z-index host still loses to the browser top layer
  // (<dialog>.showModal(), page popovers) and can be trapped by stacking
  // contexts. The Popover API puts the host in the top layer itself;
  // popover="manual" opts out of ESC/light-dismiss. UA [popover] styles
  // (auto margins, border, fit-content sizing, display:none-when-closed)
  // are neutralized inline because page CSP can block stylesheets. On any
  // failure the popover attribute is removed so the plain max-z fallback
  // keeps painting.
  const promoteToTopLayer = (): void => {
    if (!('showPopover' in overlayHost)) return;
    try {
      overlayHost.setAttribute('popover', 'manual');
      Object.assign(overlayHost.style, {
        margin: '0', border: '0', padding: '0',
        width: 'auto', height: 'auto',
        background: 'transparent', overflow: 'visible', color: 'inherit',
      });
      if (!overlayHost.matches(':popover-open')) overlayHost.showPopover();
    } catch (e) {
      console.warn(LOG, 'top-layer promotion failed — max z-index fallback', e);
      try { overlayHost.removeAttribute('popover'); } catch { /* ignore */ }
    }
  };
  // Top-layer stacking is insertion-ordered: a hide+show cycle re-stacks the
  // overlay above any dialog/popover the page opened after us. Called when a
  // new ring or the comment box appears — not per frame.
  const bringToFront = (): void => {
    if (!('showPopover' in overlayHost)) return;
    if (overlayHost.style.display === 'none') return; // mid-capture; stay hidden
    try {
      if (overlayHost.matches(':popover-open')) overlayHost.hidePopover();
      overlayHost.showPopover();
    } catch { promoteToTopLayer(); }
  };
  promoteToTopLayer();

  // ─── Noodle SVG: connectors from the side-panel edge of the viewport to
  // each ringed element. The page can't see the side-panel itself (separate
  // frame), but Chrome puts the side-panel adjacent to the page's right
  // edge, so a curve from (innerWidth, midY) is the visual stand-in for
  // "from the side-panel". One container, one path per ring slot.
  const noodleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.assign(noodleSvg.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: '2',
    overflow: 'visible',
  });

  // ─── Ring pool: tracks elements with rAF-positioned outline rings ────────
  type Slot = {el: HTMLDivElement; label: HTMLDivElement; path: SVGPathElement; raf: number; target: Element | null};
  const rings = new Map<string, Slot>();
  const RING_BASE: Partial<CSSStyleDeclaration> = {
    position: 'fixed', pointerEvents: 'none',
    border: '2px solid #ff5f00',
    borderRadius: '6px',
    boxShadow: '0 0 0 3px rgba(255,95,0,.18), 0 0 16px rgba(255,95,0,.4)',
    transition: 'opacity .08s linear',
    boxSizing: 'border-box',
    zIndex: '1',
  };
  const RING_GOLD: Partial<CSSStyleDeclaration> = {
    borderColor: '#ffd166',
    boxShadow: '0 0 0 3px rgba(255,209,102,.22), 0 0 18px rgba(255,209,102,.45)',
  };
  // Live drag preview: bright lime, thicker border, more visible halo so
  // the user can clearly see what the rubber band will commit on release.
  const RING_PREVIEW: Partial<CSSStyleDeclaration> = {
    borderColor: '#7bd97a',
    borderWidth: '3px',
    boxShadow: '0 0 0 3px rgba(123,217,122,.32), 0 0 22px rgba(123,217,122,.55)',
  };
  const LABEL_BASE: Partial<CSSStyleDeclaration> = {
    position: 'fixed', pointerEvents: 'none',
    background: 'rgba(255,95,0,.65)', color: '#fff',
    font: "600 11px/1.2 ui-monospace,'JetBrains Mono',Menlo,monospace",
    padding: '3px 6px', borderRadius: '3px',
    width: '220px', height: '16px',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    textShadow: '0 1px 2px rgba(0,0,0,.45)',
    boxSizing: 'border-box',
    display: 'none',
  };
  const ensureRing = (key: string): Slot => {
    let slot = rings.get(key);
    if (slot) return slot;
    // Classes are kept purely as identifiers (querySelector test hooks);
    // visual styling is inline because page CSP can block stylesheets.
    const el = document.createElement('div');
    el.className = 'ring';
    Object.assign(el.style, RING_BASE);
    const label = document.createElement('div');
    label.className = 'label';
    Object.assign(label.style, LABEL_BASE);
    // Noodle path connecting (innerWidth, midY) → element center.
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.5');
    if (!noodleSvg.isConnected) shadow.append(noodleSvg);
    noodleSvg.append(path);
    shadow.append(el, label);
    slot = {el, label, path, raf: 0, target: null};
    rings.set(key, slot);
    return slot;
  };
  const removeRing = (key: string): void => {
    const slot = rings.get(key);
    if (!slot) return;
    if (slot.raf) cancelAnimationFrame(slot.raf);
    slot.el.remove();
    slot.label.remove();
    slot.path.remove();
    rings.delete(key);
    ringTrackOpts.delete(key);
  };
  const clearRings = (): void => {
    for (const k of [...rings.keys()]) removeRing(k);
    noodleSvg.remove();
  };
  type RingOpts = {gold?: boolean; dashed?: boolean; preview?: boolean; label?: string};
  const positionRing = (slot: Slot, target: Element, opts: RingOpts): void => {
    const r = target.getBoundingClientRect();
    const ringStyle = slot.el.style;
    ringStyle.left = `${Math.max(0, r.left - 3)}px`;
    ringStyle.top = `${Math.max(0, r.top - 3)}px`;
    ringStyle.width = `${Math.max(0, r.width + 6)}px`;
    ringStyle.height = `${Math.max(0, r.height + 6)}px`;
    ringStyle.display = 'block';
    if (opts.preview) {
      Object.assign(ringStyle, RING_PREVIEW);
    } else if (opts.gold) {
      Object.assign(ringStyle, RING_GOLD);
      ringStyle.borderWidth = '2px';
    } else {
      ringStyle.borderColor = '#ff5f00';
      ringStyle.boxShadow = RING_BASE.boxShadow!;
      ringStyle.borderWidth = '2px';
    }
    ringStyle.borderStyle = opts.dashed ? 'dashed' : 'solid';
    // No floating label above the highlighted element — the on-page comment
    // box (annotation overlay) already shows everything the user needs and
    // the floating label was just visual noise above the ring border.
    slot.label.style.display = 'none';

    // Page-side noodle: a single curve from the right edge of the page
    // (where the side panel sits) to the CLOSEST POINT on the ring rect.
    // We don't try to align with a panel-side companion curve anymore —
    // that needed innerHeight parity which broke under DevTools dock /
    // browser zoom. This half stands alone: the visual is "an arrow from
    // the panel side, pointing at the captured element" and works at
    // any viewport.
    const ringPad = 3;
    const ringL = r.left - ringPad;
    const ringR = r.right + ringPad;
    const ringT = r.top - ringPad;
    const ringB = r.bottom + ringPad;
    const ox = window.innerWidth;          // origin x (page right edge)
    const oy = window.innerHeight / 2;     // origin y (page midY)
    // Closest-point projection: clamp origin onto the ring rect.
    const ex = Math.max(ringL, Math.min(ox, ringR));
    const ey = Math.max(ringT, Math.min(oy, ringB));
    if (Math.hypot(ex - ox, ey - oy) < 24) {
      // Element is essentially at the panel-side edge — drawing a 24px
      // curve there looks like a smudge. Skip.
      slot.path.setAttribute('d', '');
    } else {
      // Bezier: first lobe pulled left from the origin, second lobe
      // pulled outward from the ring on the side facing the origin so
      // the curve approaches the boundary perpendicular-ish.
      const c1x = ox - 80, c1y = oy;
      const approachDx = ox > ringR ? 60 : ox < ringL ? -60 : 0;
      const c2x = ex + approachDx, c2y = ey;
      slot.path.setAttribute('d', `M ${ox} ${oy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`);
    }
    // Stroke matches ring tier so a glance at the page tells the user
    // which capture this curve points to.
    const stroke = opts.preview ? '#7bd97a' : opts.gold ? '#ffd166' : '#ff5f00';
    slot.path.setAttribute('stroke', stroke);
  };
  // Overlay-freeze flag. During a screenshot the background tells us to
  // hide-overlays; while hidden we also FREEZE every ring's rAF reposition
  // loop. Without this the loops keep firing through the capture cycle —
  // they reposition rings to the post-scroll offset (a visible jump) and
  // repaint a burst the instant the host is shown again, which is the
  // flashing the user saw on grouped captures (more rings = more flicker).
  // Frozen, the rings hold their last frame and the host is display:none,
  // so there is nothing to repaint until we thaw. (See hide/show-overlays.)
  let overlayFrozen = false;
  // Remember each tracked ring's opts so thaw() can re-arm its loop.
  const ringTrackOpts = new Map<string, {el: Element; opts: RingOpts}>();
  const armRingLoop = (key: string, el: Element, opts: RingOpts): void => {
    const slot = rings.get(key);
    if (!slot) return;
    if (slot.raf) cancelAnimationFrame(slot.raf);
    const tick = (): void => {
      if (!el.isConnected) { removeRing(key); ringTrackOpts.delete(key); return; }
      if (overlayFrozen) { slot.raf = 0; return; } // hold last frame; thaw() re-arms
      positionRing(slot, el, opts);
      slot.raf = requestAnimationFrame(tick);
    };
    tick();
  };
  const trackElement = (key: string, el: Element, opts: RingOpts = {}): void => {
    const slot = ensureRing(key);
    slot.target = el;
    ringTrackOpts.set(key, {el, opts});
    armRingLoop(key, el, opts);
    // A fresh ring is a good moment to re-stack above any dialog/popover
    // the page opened since we last painted.
    bringToFront();
  };
  // Stop every ring's rAF loop in place (used during screenshot capture).
  // The slot keeps its current geometry; thawRings re-arms the loops.
  const freezeRings = (): void => {
    for (const slot of rings.values()) {
      if (slot.raf) { cancelAnimationFrame(slot.raf); slot.raf = 0; }
    }
  };
  // Re-arm every tracked ring's loop after a freeze. Each loop's first tick
  // runs synchronously, so all rings reposition on the same frame.
  const thawRings = (): void => {
    for (const [key, {el, opts}] of ringTrackOpts) armRingLoop(key, el, opts);
  };

  const flashElement = (el: Element): void => {
    const slot = ensureRing('flash');
    positionRing(slot, el, {});
    // Web Animations API — keyframes need no <style>, no CSP issue.
    slot.el.animate([
      {opacity: 1, transform: 'scale(1.04)', borderColor: '#ffe066', boxShadow: '0 0 0 6px rgba(255,224,102,.4)'},
      {opacity: 0, transform: 'scale(1)'},
    ], {duration: 700, easing: 'ease-out', fill: 'forwards'});
    setTimeout(() => removeRing('flash'), 720);
  };

  // Locate-on-page is a deliberate user request from the side panel ("where
  // is this thing?"), so the visual must be loud enough to find on a
  // crowded page. Three sequential pulses with an expanding shadow halo,
  // plus a center-anchored scale that pops then settles. Each pulse runs
  // ~500ms; total ~1.5s. Distinct color (electric cyan) so it doesn't
  // confuse with the orange hover ring or the lime drag preview.
  const locateFlash = (el: Element): void => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    el.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
    const slot = ensureRing('locate');
    positionRing(slot, el, {});
    Object.assign(slot.el.style, {
      borderColor: '#5fd1ff',
      borderWidth: '3px',
      boxShadow: '0 0 0 4px rgba(95,209,255,.35), 0 0 36px rgba(95,209,255,.7)',
      opacity: '1',
    });
    // Three pulse cycles: brighter halo + slight scale pulse on each beat.
    slot.el.animate([
      {transform: 'scale(1.00)', opacity: 1, boxShadow: '0 0 0 4px rgba(95,209,255,.45), 0 0 20px rgba(95,209,255,.55)'},
      {transform: 'scale(1.06)', opacity: 1, boxShadow: '0 0 0 12px rgba(95,209,255,.18), 0 0 60px rgba(95,209,255,.85)'},
      {transform: 'scale(1.00)', opacity: 1, boxShadow: '0 0 0 4px rgba(95,209,255,.45), 0 0 20px rgba(95,209,255,.55)'},
      {transform: 'scale(1.06)', opacity: 1, boxShadow: '0 0 0 12px rgba(95,209,255,.18), 0 0 60px rgba(95,209,255,.85)'},
      {transform: 'scale(1.00)', opacity: 1, boxShadow: '0 0 0 4px rgba(95,209,255,.45), 0 0 20px rgba(95,209,255,.55)'},
      {transform: 'scale(1.06)', opacity: 1, boxShadow: '0 0 0 12px rgba(95,209,255,.18), 0 0 60px rgba(95,209,255,.85)'},
      {transform: 'scale(1.00)', opacity: 0},
    ], {duration: 1600, easing: 'ease-in-out', fill: 'forwards'});
    setTimeout(() => removeRing('locate'), 1700);
  };

  // ─── Spacing visualizer (Plasmic-inspired) ───────────────────────────────
  // 4 margin strips (light orange, outside the element) + 4 padding strips
  // (light blue, inside the element). Side-panel pushes a `set-cs-prefs`
  // message to toggle. When ON, fireHover paints these stripes around the
  // currently-hovered element each frame.
  let spacingOverlay = false;
  const spacingDivs: HTMLDivElement[] = [];
  const ensureSpacingDivs = (): HTMLDivElement[] => {
    if (spacingDivs.length) return spacingDivs;
    for (let i = 0; i < 8; i++) {
      const d = document.createElement('div');
      Object.assign(d.style, {
        position: 'fixed', pointerEvents: 'none',
        boxSizing: 'border-box', display: 'none',
        background: i < 4 ? 'rgba(255,159,64,.28)' : 'rgba(108,178,235,.28)',
      });
      shadow.append(d);
      spacingDivs.push(d);
    }
    return spacingDivs;
  };
  const clearSpacingOverlay = (): void => {
    for (const d of spacingDivs) d.style.display = 'none';
  };
  const paintSpacingOverlay = (el: Element): void => {
    if (!spacingOverlay) { clearSpacingOverlay(); return; }
    const cs = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const mt = parseFloat(cs.marginTop) || 0;
    const mr = parseFloat(cs.marginRight) || 0;
    const mb = parseFloat(cs.marginBottom) || 0;
    const ml = parseFloat(cs.marginLeft) || 0;
    const pt = parseFloat(cs.paddingTop) || 0;
    const pr = parseFloat(cs.paddingRight) || 0;
    const pb = parseFloat(cs.paddingBottom) || 0;
    const pl = parseFloat(cs.paddingLeft) || 0;
    const [m1, m2, m3, m4, p1, p2, p3, p4] = ensureSpacingDivs();
    // Margin strips (around the element)
    const set = (d: HTMLDivElement, x: number, y: number, w: number, h: number): void => {
      if (w <= 0 || h <= 0) { d.style.display = 'none'; return; }
      d.style.left = x + 'px';
      d.style.top = y + 'px';
      d.style.width = w + 'px';
      d.style.height = h + 'px';
      d.style.display = 'block';
    };
    set(m1!, r.left - ml, r.top - mt, r.width + ml + mr, mt);            // top
    set(m2!, r.right, r.top, mr, r.height);                              // right
    set(m3!, r.left - ml, r.bottom, r.width + ml + mr, mb);              // bottom
    set(m4!, r.left - ml, r.top, ml, r.height);                          // left
    // Padding strips (inside the element)
    set(p1!, r.left, r.top, r.width, pt);                                // top
    set(p2!, r.right - pr, r.top + pt, pr, r.height - pt - pb);          // right
    set(p3!, r.left, r.bottom - pb, r.width, pb);                        // bottom
    set(p4!, r.left, r.top + pt, pl, r.height - pt - pb);                // left
  };

  // ─── On-page annotation tooltip ──────────────────────────────────────────
  const annotationEl = document.createElement('div');
  annotationEl.className = 'annotation';
  Object.assign(annotationEl.style, {
    position: 'fixed', pointerEvents: 'auto',
    background: 'rgba(15,15,20,.96)',
    color: '#fcfaf5',
    border: '1px solid rgba(255,95,0,.5)',
    borderRadius: '10px',
    padding: '8px 10px',
    font: "12px/1.45 ui-monospace,'JetBrains Mono',Menlo,monospace",
    maxWidth: 'min(360px, 70vw)',
    boxShadow: '0 8px 32px rgba(0,0,0,.55)',
    boxSizing: 'border-box',
    display: 'none',
    // Annotation always paints on top of rings/rubber-band/preview rings
    // (rings are zIndex:1; this lifts the comment box clear).
    zIndex: '2147483647',
  });
  shadow.append(annotationEl);
  const annotation = setupAnnotation(annotationEl, {
    sendToPanel,
    // For an uncaptured element, the user typing into the box and pressing
    // Enter both captures and attaches the comment.
    captureAndComment: (el, text) => {
      const entry = captureEntry(el, nextSeq());
      flashElement(el);
      const page = buildPageContext();
      sendToPanel({kind: 'capture', entry, page});
      testCaptures?.push({entry, page});
      // parentUid + url disambiguate which capture the comment
      // belongs to when the same selector exists on multiple pages
      // or for multiple sibling elements with the same testId.
      sendToPanel({kind: 'feedback-add', selector: entry.selector, text, url: page.url, parentUid: entry.uid});
      return entry;
    },
    // Box hides → tear down the matching hover ring so the two go together.
    onHide: () => removeRing('hover'),
    // Box appears for an element → ensure the ring is on the same element.
    onShow: (el) => trackElement('hover', el, {label: compactTarget(el)}),
  });

  // ─── Alt-hover state machine ─────────────────────────────────────────────
  let altActive = false;
  let altForwarded = false;
  let lastHoverEl: Element | null = null;
  let lastMouse = {x: -1, y: -1};
  let knownCaptured = new Set<string>();
  // Hover/click snap: when ON, every alt-hover and capture walks up to the
  // nearest component-marker ancestor (data-testid/role/id/button/a/input)
  // so single-click and rubber-band selection pick consistent layers
  // regardless of pixel-level cursor placement. Pushed by the side panel
  // via `set-cs-prefs`.
  let hoverSnap = true;

  const fireHoverEnd = (): void => {
    removeRing('hover');
    clearSpacingOverlay();
    lastHoverEl = null;
    sendToPanel({kind: 'hover-end'});
  };

  const setAltActive = (on: boolean): void => {
    if (altActive === on) return;
    altActive = on;
    if (!on) {
      // If the comment box is visible, ring and box are a unit: keep BOTH
      // on screen and hand focus to the textarea so the user can type
      // immediately. If there's no box, no focus to give — tear down the
      // ring as before.
      if (annotationEl.style.display === 'block') {
        sendToPanel({kind: 'hover-end'}); // panel-side status reset
        annotation.focusTextarea();
        // (ring remains; rAF keeps it tracking the current element)
      } else {
        fireHoverEnd();
      }
      return;
    }
    if (lastMouse.x >= 0) {
      const tgt = document.elementFromPoint(lastMouse.x, lastMouse.y);
      if (tgt instanceof Element) { lastHoverEl = tgt; fireHover(tgt); }
    }
  };

  // True when an element is too large to be a meaningful capture target —
  // body / html / wrappers covering most of the viewport. Used to reject
  // alt-click and pending-stage captures so the user doesn't accidentally
  // grab the whole page when they click on dead space.
  const isHugeElement = (el: Element): boolean => {
    if (el === document.body || el === document.documentElement) return true;
    const r = el.getBoundingClientRect();
    return r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9;
  };

  const resolveHoverTarget = (tgt: Element): {el: Element; selector: string} => {
    const el = hoverSnap ? snapToComponent(tgt, knownCaptured) : tgt;
    // Reuse a known-captured selector verbatim if the snapped element
    // matches one — keeps the captured-side identity stable.
    for (const sel of knownCaptured) {
      try { if (el.matches(sel)) return {el, selector: sel}; } catch { /* ignore */ }
    }
    return {el, selector: cssPath(el)};
  };

  const fireHover = (tgt: Element): void => {
    const {el, selector} = resolveHoverTarget(tgt);
    // Reject body / html / any page-spanning wrapper at the hover stage too.
    // The earlier filter only ran on click + stagePending, so alt-hovering
    // empty page area still painted a ring around the entire page.
    if (isHugeElement(el)) {
      removeRing('hover');
      sendToPanel({kind: 'hover-end'});
      return;
    }
    trackElement('hover', el, {label: compactTarget(el)});
    paintSpacingOverlay(el);
    const r = el.getBoundingClientRect();
    sendToPanel({
      kind: 'hover',
      selector,
      tag: el.tagName.toLowerCase(),
      label: compactTarget(el),
      rect: {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)},
    });
  };

  // ─── Drag state ──────────────────────────────────────────────────────────
  let sequenceCounter = 0;
  const nextSeq = (): number => ++sequenceCounter;
  let lastContextEl: Element | null = null;
  let suppressNextClick = false;
  let dragStart: {x: number; y: number} | null = null;
  let dragRect: HTMLDivElement | null = null;
  let dragSavedUserSelect = '';
  // Stable candidate pool locked at drag start — every elementsInRect call
  // for this drag uses the same pool, so the rubber-band selection grows /
  // shrinks monotonically with rect size (no tier-shift churn).
  let dragCandidates: readonly Element[] = [];

  const clearPreviewRings = (): void => {
    for (const k of [...rings.keys()]) if (k.startsWith('preview:')) removeRing(k);
  };
  const ensureDragRect = (): HTMLDivElement => {
    if (dragRect) return dragRect;
    dragRect = document.createElement('div');
    dragRect.className = 'rubber';
    Object.assign(dragRect.style, {
      position: 'fixed', pointerEvents: 'none',
      // Border style is set by updateDragRect each frame: solid for "full
      // enclosure" (left→right), dashed for "partial overlap" (right→left).
      border: '2px solid #ff5f00',
      background: 'rgba(255,95,0,.14)',
      borderRadius: '4px',
      boxShadow: '0 0 0 1px rgba(255,95,0,.35), 0 0 18px rgba(255,95,0,.25)',
      boxSizing: 'border-box',
    });
    shadow.append(dragRect);
    dragSavedUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.cursor = 'crosshair';
    // Drag mode: hide the comment box so it doesn't obscure the rubber band.
    annotation.hide();
    removeRing('hover');
    // Lock the candidate pool ONCE per drag (rigorous-3d-app behavior).
    dragCandidates = pickDragCandidates(overlayHost);
    console.log(LOG, 'drag candidate pool locked:', dragCandidates.length, 'elements');
    return dragRect;
  };
  const teardownDragRect = (): void => {
    if (dragRect) { dragRect.remove(); dragRect = null; }
    document.body.style.userSelect = dragSavedUserSelect;
    document.body.style.webkitUserSelect = '';
    document.body.style.cursor = '';
    clearPreviewRings();
    dragCandidates = [];
  };
  let lastPreviewKeys = new Set<Element>();
  // Selection mode is decided by drag direction (3D-app convention):
  //   left→right  : 'full'    — element must be entirely inside the rect;
  //                              rubber-band has a SOLID border.
  //   right→left  : 'partial' — any overlap selects;
  //                              rubber-band has a DOTTED border.
  const dragMode = (e: MouseEvent): 'partial' | 'full' =>
    dragStart && e.clientX >= dragStart.x ? 'full' : 'partial';

  const updateDragRect = (e: MouseEvent): void => {
    if (!dragStart) return;
    const dx = Math.abs(e.clientX - dragStart.x);
    const dy = Math.abs(e.clientY - dragStart.y);
    if (!dragRect && dx < 2 && dy < 2) return;
    const x1 = Math.min(dragStart.x, e.clientX);
    const y1 = Math.min(dragStart.y, e.clientY);
    const x2 = Math.max(dragStart.x, e.clientX);
    const y2 = Math.max(dragStart.y, e.clientY);
    const r = ensureDragRect();
    const mode = dragMode(e);
    Object.assign(r.style, {
      left: x1 + 'px',
      top: y1 + 'px',
      width: (x2 - x1) + 'px',
      height: (y2 - y1) + 'px',
      borderStyle: mode === 'full' ? 'solid' : 'dashed',
    });
    // Live preview: paint a vivid ring on every candidate the rubber band
    // would commit if the user released right now. Diff against the last
    // frame so we don't churn rings when the set is unchanged. The
    // candidate pool was locked at drag-start so the set is monotonic with
    // rect size — no random select/deselect mid-drag.
    const els = elementsInRect(dragCandidates, x1, y1, x2, y2, mode);
    const next = new Set(els);
    let same = next.size === lastPreviewKeys.size;
    if (same) for (const el of next) { if (!lastPreviewKeys.has(el)) { same = false; break; } }
    if (!same) {
      clearPreviewRings();
      els.forEach((el, i) => trackElement(`preview:${i}`, el, {preview: true}));
      lastPreviewKeys = next;
      console.log(LOG, `drag preview (${mode}):`, els.length, 'targets', els.map(compactTarget));
    }
  };

  // ─── Pending-multi staging ───────────────────────────────────────────────
  let pendingMulti: Array<{el: Element; entry: Entry}> = [];
  const stagePending = (raw: Element, clickAt?: {clientX: number; clientY: number}): void => {
    const el = hoverSnap ? snapToComponent(raw, knownCaptured) : raw;
    if (isHugeElement(el)) {
      console.log(LOG, 'skipping huge element from staging:', compactTarget(el));
      return;
    }
    const entry = captureEntry(el, nextSeq(), {
      ...(clickAt ? {clickAt} : {}),
    });
    if (pendingMulti.some((p) => p.el === el || p.entry.selector === entry.selector)) {
      flashElement(el);
      return;
    }
    const idx = pendingMulti.length;
    pendingMulti.push({el, entry});
    trackElement(`pending:${idx}`, el, {gold: true, label: `#${idx + 1} ${compactTarget(el)}`});
    flashElement(el);
    sendToPanel({kind: 'pending-add', entry});
  };
  const commitPendingMulti = (): void => {
    if (!pendingMulti.length) return;
    console.log(LOG, 'commitPendingMulti — committing', pendingMulti.length, 'staged elements');
    console.trace(LOG, 'commit stack trace');
    pendingMulti.forEach(({el, entry}, i) => {
      const page = buildPageContext();
      sendToPanel({kind: 'capture', entry, page, grouped: i > 0});
      testCaptures?.push({entry, page, grouped: i > 0});
      removeRing(`pending:${i}`);
      if (el.isConnected) flashElement(el);
    });
    pendingMulti = [];
    sendToPanel({kind: 'pending-clear'});
  };
  const cancelPendingMulti = (): void => {
    if (pendingMulti.length) console.log(LOG, 'cancelPendingMulti — discarding', pendingMulti.length, 'staged');
    pendingMulti.forEach((_, i) => removeRing(`pending:${i}`));
    pendingMulti = [];
    sendToPanel({kind: 'pending-clear'});
  };

  // ─── Mouse listeners ─────────────────────────────────────────────────────
  let lastMoveTs = 0;
  const onMouseMove = (e: MouseEvent): void => {
    if (!orphanGuard()) return;
    if (e.timeStamp === lastMoveTs) return;
    lastMoveTs = e.timeStamp;
    lastMouse = {x: e.clientX, y: e.clientY};
    if (dragStart) {
      // In a rubber-band drag the only highlight that should appear is the
      // lime PREVIEW ring on candidates inside the rect. The orange hover
      // ring would otherwise repaint on whatever element the cursor is
      // over, mixing two colors and confusing the user.
      updateDragRect(e);
      removeRing('hover');
      sendToPanel({kind: 'hover-end'});
      lastHoverEl = null;
      return;
    }
    const altOn = e.altKey || altForwarded;
    if (!altOn) { if (altActive) setAltActive(false); return; }
    if (!altActive) setAltActive(true);
    const tgt = e.target;
    if (!(tgt instanceof Element) || tgt === lastHoverEl) return;
    lastHoverEl = tgt;
    fireHover(tgt);
  };

  const isInsideAnnotation = (e: Event): boolean => {
    if (annotationEl.style.display !== 'block') return false;
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    for (const node of path) if (node === annotationEl) return true;
    return false;
  };

  // F.18 — never capture an element that's part of pinchgrab's own UI.
  // The shadow host is `#__pinchgrab_overlay`; everything painted inside
  // (rings, rubber band, noodle SVG, annotation textarea) lives in its
  // shadow root. Open-mode shadow + composedPath() lets us see the real
  // target even when event retargeting is in play, so we walk the
  // composed path looking for the host. The cheap id check still runs
  // first as a fast path.
  const isPinchgrabOwnUi = (e: Event): boolean => {
    const t = e.target;
    if (t instanceof Element && t.id === '__pinchgrab_overlay') return true;
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    for (const node of path) {
      if (node instanceof Element && node.id === '__pinchgrab_overlay') return true;
      if (node === overlayHost) return true;
    }
    return false;
  };

  const onMouseDown = (e: MouseEvent): void => {
    if (!orphanGuard()) return;
    if (isInsideAnnotation(e)) return;
    if (annotationEl.style.display === 'block' && !annotation.isLocked()) annotation.hide();
    if (!e.altKey || dragStart) return;
    if (isPinchgrabOwnUi(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragStart = {x: e.clientX, y: e.clientY};
    console.log(LOG, 'drag armed at', dragStart);
  };

  const onMouseUp = (e: MouseEvent): void => {
    if (!dragStart) return;
    const start = dragStart;
    const wasDrag = Boolean(dragRect);
    dragStart = null;
    teardownDragRect();
    if (!wasDrag) {
      console.log(LOG, 'drag too short, treated as single click');
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    suppressNextClick = true;
    setTimeout(() => { suppressNextClick = false; }, 200);
    const mode: 'partial' | 'full' = e.clientX >= start.x ? 'full' : 'partial';
    // Use the SAME candidate pool that was locked at drag start so the
    // committed set matches what the user saw highlighted moments before.
    const poolForCommit = dragCandidates.length ? dragCandidates : pickDragCandidates(overlayHost);
    const els = elementsInRect(poolForCommit, start.x, start.y, e.clientX, e.clientY, mode);
    console.log(LOG, `drag END — mode=${mode} — STAGING (NOT committing)`, els.length, 'elements:', els.map(compactTarget));
    // Drag mirrors Alt+Shift+Click — every element stages into the pending
    // bay. The user MUST click "Commit group" in the side panel to finalize;
    // there is no auto-commit timer.
    for (const el of els) stagePending(el);
  };

  const onClick = (event: MouseEvent): void => {
    if (!orphanGuard()) return;
    if (suppressNextClick) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (isInsideAnnotation(event)) return;
    if (!event.altKey) return;
    if (isPinchgrabOwnUi(event)) return;
    event.preventDefault();
    event.stopPropagation();
    const raw = event.target;
    if (!(raw instanceof Element)) return;
    // Snap clicks the same way hover does so the captured element matches
    // exactly what the orange ring was around when the user clicked.
    const el = hoverSnap ? snapToComponent(raw, knownCaptured) : raw;
    if (isHugeElement(el)) {
      console.log(LOG, 'skipping huge click target:', compactTarget(el));
      return;
    }
    if (event.shiftKey) {
      stagePending(el, {clientX: event.clientX, clientY: event.clientY});
      return;
    }
    const entry = captureEntry(el, nextSeq(), {
      clickAt: {clientX: event.clientX, clientY: event.clientY},
    });
    flashElement(el);
    const page = buildPageContext();
    sendToPanel({kind: 'capture', entry, page});
    testCaptures?.push({entry, page});
  };

  // Bind on both window and document. Some pages call stopImmediatePropagation
  // on their own document-level capture handler — listening on window picks up
  // those events first. A 1ms timestamp dedupe prevents double-handling.
  for (const target of [window, document]) {
    target.addEventListener('mousemove', onMouseMove as EventListener, true);
    target.addEventListener('mousedown', onMouseDown as EventListener, true);
    target.addEventListener('mouseup', onMouseUp as EventListener, true);
  }
  document.addEventListener('click', onClick as EventListener, true);
  document.addEventListener('contextmenu', (e) => {
    if (e.target instanceof Element) lastContextEl = e.target;
  }, true);

  // Keyboard listeners (page-focused case). Named so destroy() can remove
  // them — the orphan-takeover path must leave zero listeners behind.
  const onKeyDownAlt = (e: KeyboardEvent): void => {
    if (!orphanGuard()) return;
    if (e.altKey) {
      setAltActive(true);
      // Pre-empt the browser's Alt → menu-bar focus shift on Windows. If we
      // don't preventDefault here, the keyup that follows will steal focus
      // from our overlay textarea.
      if (e.key === 'Alt' && annotationEl.style.display === 'block') {
        e.preventDefault();
      }
    }
  };
  const onKeyUpAlt = (e: KeyboardEvent): void => {
    if (!orphanGuard()) return;
    if (e.key === 'Alt' || !e.altKey) {
      // Same Alt-→-menu suppression on release: Chrome / Edge on Windows
      // shift focus to the menu bar when Alt is released without another
      // key intervening. Block it so our textarea keeps focus.
      if (annotationEl.style.display === 'block') e.preventDefault();
      altForwarded = false;
      setAltActive(false);
      // No auto-commit timer — the user explicitly clicks "Commit group"
      // in the side-panel pending bay (or Esc to cancel).
    }
  };
  const onWindowBlur = (): void => {
    altForwarded = false;
    setAltActive(false);
    // Note: don't cancel pendingMulti — clicking the side-panel commit button
    // blurs the host page and we'd lose the staging state right before commit.
  };
  window.addEventListener('keydown', onKeyDownAlt, true);
  window.addEventListener('keyup', onKeyUpAlt, true);
  window.addEventListener('blur', onWindowBlur, true);

  // ─── Side-panel commands ─────────────────────────────────────────────────
  const safeQuery = (sel: string | undefined): Element | null => {
    try { return sel ? document.querySelector(sel) : null; } catch { return null; }
  };

  const handleCommand = (msg: PgEnvelope<PanelToCs>, respond: (r: any) => void): boolean => {
    switch (msg.kind) {
      case 'outline': {
        const el = safeQuery(msg.selector);
        if (el) trackElement('from-panel', el, {label: compactTarget(el), gold: msg.gold, dashed: msg.dashed});
        else removeRing('from-panel');
        return false;
      }
      case 'outline-clear':
        removeRing('from-panel');
        removeRing('multi');
        return false;
      case 'outline-multi': {
        removeRing('multi');
        let i = 0;
        for (const sel of msg.selectors) {
          const el = safeQuery(sel);
          if (el) trackElement(`multi:${i++}`, el, {gold: true});
        }
        return false;
      }
      case 'outline-multi-clear': {
        for (const k of [...rings.keys()]) if (k.startsWith('multi:')) removeRing(k);
        return false;
      }
      case 'scroll-to': {
        const el = safeQuery(msg.selector);
        if (!el) return false;
        el.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
        if (msg.sticky) trackElement('sticky', el, {label: compactTarget(el), gold: true});
        else flashElement(el);
        return false;
      }
      case 'locate-flash': {
        const el = safeQuery(msg.selector);
        if (!el) return false;
        locateFlash(el);
        return false;
      }
      case 'sticky-clear':
        removeRing('sticky');
        return false;
      case 'validate': {
        const valid: Record<string, boolean> = {};
        for (const sel of msg.selectors) {
          try { valid[sel] = Boolean(document.querySelector(sel)); } catch { valid[sel] = false; }
        }
        respond({valid});
        return true;
      }
      case 'log-element': {
        const el = safeQuery(msg.selector);
        if (!el) { respond({ok: false}); return true; }
        try { el.setAttribute('data-pinchgrab-id', String(msg.n ?? '')); } catch { /* sandbox */ }
        console.log('%c[PinchGrab] element:', 'color:#ff5f00;font-weight:700;', el,
          `\n  • Right-click → Reveal in Elements panel\n  • Or in DevTools console: $('[data-pinchgrab-id="${msg.n ?? ''}"]')`);
        el.scrollIntoView({behavior: 'smooth', block: 'center'});
        flashElement(el);
        respond({ok: true, snippet: `$('${msg.selector}')`});
        return true;
      }
      case 'recapture': {
        const el = safeQuery(msg.selector);
        if (!el) { respond({ok: false, reason: 'not-found'}); return true; }
        const entry = captureEntry(el, msg.n ?? nextSeq());
        respond({ok: true, entry, page: buildPageContext()});
        return true;
      }
      case 'capture-ancestor': {
        // Walk up `depth` ancestor levels from the original selector and
        // capture that element. Used by the ancestor-breadcrumb chips in
        // the side-panel bubble so the user can escalate "I meant the card,
        // not the h3 inside it" without re-clicking on the page.
        let cur: Element | null = safeQuery(msg.selector);
        if (!cur) { respond({ok: false, reason: 'not-found'}); return true; }
        for (let i = 0; i < msg.depth && cur && cur.parentElement && cur !== document.body; i++) {
          cur = cur.parentElement;
        }
        if (!cur || isHugeElement(cur)) { respond({ok: false, reason: 'too-large'}); return true; }
        const entry = captureEntry(cur, nextSeq());
        flashElement(cur);
        sendToPanel({kind: 'capture', entry, page: buildPageContext()});
        respond({ok: true, entry});
        return true;
      }
      case 'outline-ancestor': {
        // Preview the Nth ancestor — same walk as capture-ancestor but
        // outlines the result with the existing gold-ring tracker instead
        // of capturing. Side panel calls this on hover of a breadcrumb chip.
        let cur: Element | null = safeQuery(msg.selector);
        if (!cur) return false;
        for (let i = 0; i < msg.depth && cur && cur.parentElement && cur !== document.body; i++) {
          cur = cur.parentElement;
        }
        if (!cur || isHugeElement(cur)) {
          removeRing('from-panel');
          return false;
        }
        trackElement('from-panel', cur, {label: compactTarget(cur), gold: true});
        return false;
      }
      case 'alt-state':
        altForwarded = msg.on;
        setAltActive(msg.on);
        return false;
      case 'manual-capture': {
        const el = safeQuery(msg.selector);
        if (!el) { respond({ok: false, reason: 'not-found'}); return true; }
        const entry = captureEntry(el, msg.n ?? nextSeq());
        flashElement(el);
        sendToPanel({kind: 'capture', entry, page: buildPageContext()});
        respond({ok: true, entry});
        return true;
      }
      case 'annotation': {
        const el = safeQuery(msg.selector);
        if (el) annotation.show(el, {...(msg.payload ?? {}), selector: msg.selector});
        return false;
      }
      case 'annotation-clear':
        annotation.hide();
        return false;
      case 'pending-cancel':
        cancelPendingMulti();
        return false;
      case 'pending-commit':
        commitPendingMulti();
        return false;
      case 'context-capture': {
        if (lastContextEl) {
          const entry = captureEntry(lastContextEl, nextSeq());
          flashElement(lastContextEl);
          sendToPanel({kind: 'capture', entry, page: buildPageContext()});
        }
        return false;
      }
      case 'set-captured':
        knownCaptured = new Set(msg.selectors);
        return false;
      case 'set-cs-prefs':
        if (typeof msg.spacingOverlay === 'boolean') {
          spacingOverlay = msg.spacingOverlay;
          if (!spacingOverlay) clearSpacingOverlay();
        }
        if (typeof msg.hoverSnap === 'boolean') hoverSnap = msg.hoverSnap;
        return false;
      case 'hide-overlays': {
        // The user's complaint: PinchGrab rings/borders were still visible
        // in the captured PNG. Root cause: the message handler used to
        // ack synchronously the moment we set `visibility: hidden`, but
        // the browser's compositor hadn't yet painted that frame, so
        // captureVisibleTab fired against a still-composited overlay.
        //
        // Fix: switch to `display: none` (rips it out of layout entirely
        // — stronger guarantee than visibility:hidden), force a layout
        // flush, and wait for TWO animation frames before acking. Two
        // RAFs is the standard "next paint has happened" signal in
        // browsers.
        //
        // Item 17 (flashing): also FREEZE the ring rAF loops for the whole
        // capture window. The background hides overlays BEFORE it scrolls
        // the page to frame the capture; if the loops kept running they'd
        // chase the scroll offset (a visible jump) and repaint a burst when
        // the host is shown again. Frozen + display:none = the rings hold
        // their last frame and there is nothing to flicker. The annotation
        // box freezes implicitly (its anchor watchdog only repositions, and
        // the host is hidden), so no extra handling is needed there.
        overlayFrozen = true;
        freezeRings();
        overlayHost.style.display = 'none';
        // Force layout flush so the change takes effect.
        void overlayHost.getBoundingClientRect();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => respond({ok: true}));
        });
        return true;
      }
      case 'show-overlays': {
        overlayHost.style.display = '';
        overlayHost.style.visibility = 'visible';
        // Re-enter the top layer: the capture window (or the page) may have
        // dismissed our popover while the host was display:none.
        promoteToTopLayer();
        // Thaw: re-arm every ring loop in a single batch so they snap to the
        // (now restored) scroll position on the SAME frame — one clean
        // reposition instead of a staggered repaint cascade.
        overlayFrozen = false;
        thawRings();
        respond({ok: true});
        return true;
      }
      default:
        return false;
    }
  };

  // ─── IPC bridge ──────────────────────────────────────────────────────────
  function sendToPanel(payload: CsToPanel): void {
    const msg = pg(payload);
    if (inExtension) {
      try { void chrome.runtime.sendMessage(msg).catch?.(() => { /* ignore */ }); }
      catch { /* ignore */ }
    }
    else {
      try { window.dispatchEvent(new CustomEvent('pinchgrab:to-panel', {detail: msg})); } catch { /* ignore */ }
    }
    // Item 18: the first capture on a given page URL triggers a one-time
    // full-page snapshot (screenshot + metadata) routed to the panel. Dedup
    // is by URL inside maybeSnapshotPage.
    if (payload.kind === 'capture') void maybeSnapshotPage(payload.page.url);
  }

  // ─── Page-snapshot (item 18) ──────────────────────────────────────────────
  // Round-trip request to the background worker (which owns captureVisibleTab).
  // Resolves to the reply object, or null on any failure / non-extension mode.
  const requestBg = <R>(payload: {kind: string} & Record<string, unknown>): Promise<R | null> =>
    new Promise<R | null>((resolve) => {
      if (!inExtension) { resolve(null); return; }
      try {
        chrome.runtime.sendMessage(pg(payload as any), (reply: R) => {
          if (chrome.runtime.lastError) { resolve(null); return; }
          resolve((reply ?? null) as R | null);
        });
      } catch { resolve(null); }
    });

  // Dedup set: at most one page-snapshot per distinct URL per page session.
  const snapshottedUrls = new Set<string>();
  let snapshotInFlight = false;
  const maybeSnapshotPage = async (url: string): Promise<void> => {
    if (!inExtension) return;            // viewport capture needs the worker
    if (snapshottedUrls.has(url)) return;
    if (snapshotInFlight) return;        // serialize; the next capture retries
    snapshottedUrls.add(url);            // optimistic — avoids a duplicate burst
    snapshotInFlight = true;
    try {
      // Metadata is read on the page side (the worker can't see the DOM).
      // capturedAt is stamped before the (slower) screenshot request so it
      // reflects when the snapshot was initiated.
      const capturedAt = new Date().toISOString();
      const meta = {
        url: location.href,
        title: document.title,
        viewport: {width: window.innerWidth, height: window.innerHeight},
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
        scrollHeight: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
        devicePixelRatio: window.devicePixelRatio || 1,
        lang: document.documentElement.lang || navigator.language || '',
      };
      const reply = await requestBg<PageSnapshotReply>({kind: 'page-snapshot-shot'});
      if (!reply?.ok || !reply.screenshot) {
        // Capture failed — drop the dedup entry so a later capture on this
        // URL can retry rather than permanently skipping the snapshot.
        snapshottedUrls.delete(url);
        return;
      }
      const snapshot: PageSnapshot = {
        ...meta,
        capturedAt,
        screenshot: reply.screenshot,
        ...(reply.partial ? {partial: true} : {}),
      };
      sendToPanel({kind: 'page-snapshot', payload: snapshot});
    } catch {
      snapshottedUrls.delete(url);
    } finally {
      snapshotInFlight = false;
    }
  };

  if (inExtension) {
    chrome.runtime.onMessage.addListener((msg: any, _sender, sendResponse) => {
      if (msg && msg.__pg === true) return handleCommand(msg as PgEnvelope<PanelToCs>, sendResponse);
      return false;
    });
  } else {
    window.addEventListener('pinchgrab:to-cs', (e: Event) => {
      const msg = (e as CustomEvent).detail;
      const reqId = msg?.__reqId;
      let responded = false;
      const respond = (reply: unknown): void => {
        if (responded) return;
        responded = true;
        if (reqId) window.dispatchEvent(new CustomEvent('pinchgrab:cs-response', {detail: {__reqId: reqId, reply}}));
      };
      handleCommand(msg, respond);
    });
  }

  // ─── Recent-Tab tracker (for activeFocus.recentlyTabbed) ────────────────
  // The page-context activeFocus field flags focus as "keyboard-driven"
  // when the user pressed Tab / Shift+Tab in the last second. Useful for
  // a11y bug captures where the visual issue only shows up while
  // tabbing, not on click. We capture in the capture phase so a page's
  // own keydown handler can't suppress us.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') noteTabPressed();
  }, true);

  // ─── Preference-change listener (dark-mode toggle, motion pref) ──────────
  // Browsers emit `change` events on a MediaQueryList when the OS / page
  // setting flips. We forward to the panel so the export's chronology
  // captures the moment the user switched modes — without it, captures
  // before and after the flip mix appearance values with no signal as to
  // which mode was active.
  const wirePreferenceListeners = (): void => {
    try {
      const cs = matchMedia('(prefers-color-scheme: dark)');
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = (reason: 'color-scheme' | 'reduced-motion'): void => {
        sendToPanel({kind: 'preference-change', reason, page: buildPageContext()});
      };
      cs.addEventListener?.('change', () => onChange('color-scheme'));
      motion.addEventListener?.('change', () => onChange('reduced-motion'));
    } catch { /* old browser / matchMedia unavailable */ }
  };
  wirePreferenceListeners();

  // ─── DOM-mutation ring buffer for capture repro context (§4.8) ──────────
  // Pages with active animation/polling can churn through hundreds of
  // mutations per second; we cap memory at MUTATION_BUFFER_CAP records
  // and only return mutations within the last MUTATION_WINDOW_MS to
  // captureEntry. compactTarget is cheaper than cssPath, used here to
  // avoid quadratic cost on large DOMs.
  const MUTATION_BUFFER_CAP = 50;
  const MUTATION_WINDOW_MS = 8_000;
  const SECRET_ATTR_NAME_RE = /(password|token|secret|api[_-]?key|csrf|xsrf|session|nonce)/i;
  const mutationBuffer: DomMutation[] = [];
  const truncate = (s: string | null | undefined, max = 120): string =>
    String(s ?? '').slice(0, max);

  const mutationObserver = new MutationObserver((records) => {
    const now = new Date().toISOString();
    for (const r of records) {
      // Skip mutations inside our own overlay — every ring repaint is a
      // mutation and we'd flood the buffer with self-noise.
      const tNode = r.target;
      if (tNode instanceof Node && (overlayHost === tNode || overlayHost.contains(tNode))) continue;
      const tEl: Element | null = tNode instanceof Element
        ? tNode
        : (tNode.parentElement ?? null);
      const targetDesc = tEl ? compactTarget(tEl) : tNode.nodeName.toLowerCase();
      let entry: DomMutation;
      if (r.type === 'childList') {
        const added = r.addedNodes.length;
        const removed = r.removedNodes.length;
        let summary = `${targetDesc}:`;
        if (added > 0) {
          const first = r.addedNodes[0];
          summary += ` +${added} ${first instanceof Element ? compactTarget(first) : 'text'}`;
        }
        if (removed > 0) {
          const first = r.removedNodes[0];
          summary += ` -${removed} ${first instanceof Element ? compactTarget(first) : 'text'}`;
        }
        entry = {type: 'childList', ts: now, target: targetDesc, added, removed, summary: truncate(summary, 200)};
      } else if (r.type === 'attributes') {
        const name = r.attributeName ?? '';
        const isSecret = SECRET_ATTR_NAME_RE.test(name);
        const newValRaw = (tEl ? tEl.getAttribute(name) : null) ?? '';
        const oldValRaw = r.oldValue ?? null;
        const oldValue = isSecret ? '[redacted]' : (oldValRaw === null ? undefined : truncate(oldValRaw));
        const newValue = isSecret ? '[redacted]' : truncate(newValRaw);
        entry = {
          type: 'attributes', ts: now, target: targetDesc, attributeName: name,
          oldValue, newValue,
          summary: truncate(`${targetDesc}[${name}]: ${oldValue ?? '∅'} → ${newValue}`, 200),
        };
      } else {
        // characterData
        const oldValue = r.oldValue ?? undefined;
        const newValue = tNode.nodeValue ?? '';
        entry = {
          type: 'characterData', ts: now, target: targetDesc,
          oldValue: oldValue !== undefined ? truncate(oldValue) : undefined,
          newValue: truncate(newValue),
          summary: truncate(`${targetDesc} text: ${truncate(oldValue, 30)} → ${truncate(newValue, 30)}`, 200),
        };
      }
      mutationBuffer.push(entry);
      if (mutationBuffer.length > MUTATION_BUFFER_CAP) mutationBuffer.shift();
    }
  });
  try {
    mutationObserver.observe(document.documentElement, {
      childList: true, subtree: true,
      attributes: true, attributeOldValue: true,
      characterData: true, characterDataOldValue: true,
    });
  } catch (e) { console.warn(LOG, 'MutationObserver.observe failed', e); }

  // Hand captureEntry a getter so it can read the buffer without
  // importing content-script-only state.
  setMutationBufferGetter(() => {
    const cutoff = Date.now() - MUTATION_WINDOW_MS;
    return mutationBuffer.filter((m) => Date.parse(m.ts) >= cutoff);
  });

  // ─── Test/standalone API ─────────────────────────────────────────────────
  const api: PinchgrabApi = {
    captureEntry,
    buildPageContext,
    captures: testCaptures,
    flashElement: (sel: string) => {
      const el = document.querySelector(sel);
      if (el) flashElement(el);
    },
    setAlt: (on: boolean) => { setAltActive(on); },
    nextSeq,
    handleCommand,
    destroy: () => {
      destroyed = true;
      for (const target of [window, document]) {
        target.removeEventListener('mousemove', onMouseMove as EventListener, true);
        target.removeEventListener('mousedown', onMouseDown as EventListener, true);
        target.removeEventListener('mouseup', onMouseUp as EventListener, true);
      }
      document.removeEventListener('click', onClick as EventListener, true);
      window.removeEventListener('keydown', onKeyDownAlt, true);
      window.removeEventListener('keyup', onKeyUpAlt, true);
      window.removeEventListener('blur', onWindowBlur, true);
      clearRings();
      try { if (overlayHost.matches(':popover-open')) overlayHost.hidePopover(); } catch { /* ignore */ }
      overlayHost.remove();
      delete window[KEY];
    },
  };
  window[KEY] = api;
  window.__pinchgrab = api;
  // Successor takeover: when a fresh copy of this script injects (extension
  // reload), it fires this event from its own isolated world — tear down so
  // exactly one live copy owns the page.
  document.addEventListener('__pinchgrab-takeover', () => {
    try { api.destroy(); } catch { /* ignore */ }
  }, {once: true});
  console.log(LOG, 'ready', {inExtension});
}

// ─── Annotation overlay (sticky comment box) ───────────────────────────────
type AnnotationDeps = {
  sendToPanel: (m: CsToPanel) => void;
  captureAndComment: (el: Element, text: string) => Entry;
  // Called when the box hides — used to tear down the matching hover ring
  // so ring + box stay coupled.
  onHide: () => void;
  // Called when the box appears or moves to a new element — used to
  // (re-)paint the hover ring on that element. Covers the race where alt
  // was released before the annotation message round-tripped back.
  onShow: (el: Element) => void;
};
type AnnotationApi = {
  show: (el: Element, payload: AnnotationPayload | null) => void;
  hide: () => void;
  isLocked: () => boolean;
  focusTextarea: () => void;
  // rAF watchdog that keeps the box pinned to its anchor and tears it down
  // when the anchor leaves the DOM. Internal lifecycle hooks; the public
  // surface (show/hide) drives them, but they're exposed for the destroy()
  // teardown path.
  startWatchdog: () => void;
  stopWatchdog: () => void;
};

function setupAnnotation(el: HTMLDivElement, {sendToPanel, captureAndComment, onHide, onShow}: AnnotationDeps): AnnotationApi {
  let selector: string | null = null;
  // Active capture's stable uid (when payload.captured + uid). Used by
  // submit() so the comment routes to the SPECIFIC capture rather than
  // to any selector match — prevents cross-page / cross-sibling
  // contamination.
  let activeUid: string | null = null;
  let lockedTo: Element | null = null;
  let locked = false;
  let textarea: HTMLTextAreaElement | null = null;
  let feedbackList: HTMLUListElement | null = null;

  // Builders with inline styles (CSP-safe; no inline <style> or class CSS).
  const styled = <T extends HTMLElement>(tag: string, styles: Partial<CSSStyleDeclaration>): T => {
    const node = document.createElement(tag) as T;
    Object.assign(node.style, styles);
    return node;
  };

  const buildBody = (payload: AnnotationPayload): void => {
    el.replaceChildren();
    const captured = Boolean(payload.captured);
    // Header — only when captured. Just a tiny orange `#N` chip; no
    // "PinchGrab" or "Capture + comment" labels.
    if (captured) {
      const header = styled<HTMLDivElement>('div', {
        color: '#ff5f00', fontWeight: '700',
        font: "700 13px/1 'Bricolage Grotesque','Outfit',ui-monospace,monospace",
        marginBottom: '4px',
        letterSpacing: '0.02em',
      });
      header.textContent = `#${payload.n ?? '?'}`;
      el.append(header);
    }

    const list = styled<HTMLUListElement>('ul', {
      margin: '0 0 6px 0', padding: '0 0 0 16px', listStyle: 'disc',
    });
    feedbackList = list;
    if (payload.feedback?.length) {
      // Attach the list BEFORE appending items: appendFeedback's lazy
      // insertBefore(list, addRow) otherwise dereferences `addRow` while the
      // const is still in its temporal dead zone (declared below), throwing
      // ReferenceError and killing the box for any capture that already has
      // comments. With a parent set, that branch never runs during build.
      el.append(list);
      for (const t of payload.feedback) appendFeedback(t);
    }
    // (No "No comments yet." filler — empty list = no list shown.)

    const addRow = styled<HTMLDivElement>('div', {
      display: 'flex', gap: '6px', alignItems: 'stretch',
      marginTop: '4px', paddingTop: '6px',
      borderTop: '1px solid rgba(255,95,0,.2)',
    });
    const ta = styled<HTMLTextAreaElement>('textarea', {
      flex: '1', minHeight: '28px', maxHeight: '120px',
      resize: 'none',
      background: 'rgba(0,0,0,.35)', color: '#fcfaf5',
      border: '1px solid rgba(255,95,0,.3)',
      borderRadius: '6px',
      padding: '4px 6px',
      font: "12px/1.4 ui-monospace,'JetBrains Mono',Menlo,monospace",
      outline: '0',
      boxSizing: 'border-box',
    });
    ta.placeholder = captured ? 'Comment…' : 'Comment to capture…';
    ta.rows = 2;
    ta.addEventListener('focus', () => { ta.style.borderColor = '#ff5f00'; });
    ta.addEventListener('blur', () => { ta.style.borderColor = 'rgba(255,95,0,.3)'; });
    textarea = ta;
    // Send button — must MATCH the side panel's main composer Send button
    // (src/sidepanel.html `.composer .send` + src/sidepanel.css). That button
    // is the `message-square-plus` lucide icon + a short text label on the
    // orange→orange-2 primary gradient. We rebuild it here with inline styles
    // (CSP-safe; no shared stylesheet across the two documents) so it reads as
    // the same control even though it lives in the page's shadow root.
    const sendBtn = styled<HTMLButtonElement>('button', {
      flex: '0 0 auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: '4px',
      padding: '0 10px',
      // Match the textarea min-height so the button doesn't drag when the
      // textarea grows (mirrors `.composer .send { height: 36px }`, scaled to
      // the more compact on-page box).
      height: '28px',
      background: 'linear-gradient(180deg, #ff5f00 0%, #ef4b00 100%)',
      color: '#fff', border: '0', borderRadius: '6px',
      font: "700 11px/1 'Bricolage Grotesque','Outfit',system-ui,sans-serif",
      letterSpacing: '.01em',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      boxShadow: '0 0 24px rgba(255,95,0,.25)',
    });
    const sendIcon = styled<HTMLSpanElement>('span', {
      display: 'inline-flex', lineHeight: '0',
    });
    sendIcon.innerHTML = PG_ICONS.svgString('message-square-plus', 16);
    const sendLabel = styled<HTMLSpanElement>('span', {fontSize: '10px'});
    sendLabel.textContent = captured ? 'Add' : 'Capture';
    sendBtn.append(sendIcon, sendLabel);
    sendBtn.setAttribute('aria-label', captured ? 'Add comment' : 'Capture and comment');
    addRow.append(ta, sendBtn);
    el.append(addRow);

    const hint = styled<HTMLDivElement>('div', {
      color: '#847d9a', fontSize: '10px', marginTop: '4px',
    });
    hint.textContent = captured
      ? 'Enter to add · Shift+Enter newline · Esc to close'
      : 'Enter to capture & save · Shift+Enter newline · Esc to close';
    el.append(hint);

    function appendFeedback(text: string): void {
      const li = styled<HTMLLIElement>('li', {
        margin: '2px 0', color: '#fcfaf5', wordBreak: 'break-word',
      });
      li.textContent = text;
      list.append(li);
      if (!list.parentNode) el.insertBefore(list, addRow);
    }

    const submit = (): void => {
      const text = ta.value.trim();
      if (!text) return;
      if (captured && selector) {
        // Route by stable uid + URL when available. Side-panel's
        // onFeedbackAdd prefers parentUid; selector + url is the
        // composite fallback. The bare-selector path that used to
        // ship caused cross-page comment contamination.
        sendToPanel({
          kind: 'feedback-add', selector, text,
          url: location.href,
          ...(activeUid ? {parentUid: activeUid} : {}),
        });
      } else if (lockedTo) {
        // Capture + attach the comment in one motion, then rebuild the
        // body with captured=true so the orange #N header appears, button
        // text flips to "Add", etc.
        const entry = captureAndComment(lockedTo, text);
        payload.captured = true;
        payload.uid = entry.uid;
        payload.n = entry.n;
        payload.selector = entry.selector;
        payload.feedback = [...(payload.feedback ?? []), text];
        selector = entry.selector;
        activeUid = entry.uid;
        buildBody(payload);
        return;
      }
      ta.value = '';
      payload.feedback = [...(payload.feedback ?? []), text];
      appendFeedback(text);
    };
    sendBtn.addEventListener('click', submit);
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      if (e.key === 'Escape') { e.preventDefault(); hide(); }
      e.stopPropagation();
    });
    // If a focus request came in before the textarea existed (alt-release
    // raced ahead of the annotation round-trip), claim it now.
    if (wantsFocus) {
      wantsFocus = false;
      requestAnimationFrame(() => ta.focus({preventScroll: true}));
    }
  };

  const GAP = 8;     // gap between anchor edge and box
  const MARGIN = 8;  // min distance from any viewport edge

  // Deterministic placement relative to `anchor`. Two subtleties the old
  // version got wrong, which produced the "box in a random spot" reports:
  //   1. It read `el.offsetHeight` while the box was still `display:none`,
  //      so height measured as 0 and the above/below decision + the
  //      Math.max(8, …) clamp were computed against garbage.
  //   2. It clamped the left edge with a hardcoded 360px width instead of
  //      the box's real measured width, so a narrower box (short comment)
  //      drifted and a wider box (long feedback list) overflowed.
  // We force the box visible but transparent for one synchronous measure,
  // then place it using its real rendered size. All numbers are clamped so
  // the whole box always lands inside the viewport.
  const position = (anchor: Element): void => {
    const r = anchor.getBoundingClientRect();
    // Measure the real box size. It's already in the DOM (buildBody ran);
    // making it `block` lets getBoundingClientRect report true dimensions.
    // visibility:hidden keeps the measure invisible so there's no flash at
    // a pre-placement location.
    const prevVis = el.style.visibility;
    el.style.visibility = 'hidden';
    el.style.display = 'block';
    el.style.left = '0px';
    el.style.top = '0px';
    const box = el.getBoundingClientRect();
    const bw = box.width || 320;
    const bh = box.height || 160;
    el.style.visibility = prevVis || 'visible';

    // Vertical: prefer below the anchor; flip above when below would clip
    // the bottom edge AND there's more room above.
    const roomBelow = window.innerHeight - r.bottom - GAP;
    const roomAbove = r.top - GAP;
    const useAbove = bh > roomBelow && roomAbove > roomBelow;
    let top = useAbove ? r.top - GAP - bh : r.bottom + GAP;
    top = Math.max(MARGIN, Math.min(top, window.innerHeight - bh - MARGIN));

    // Horizontal: left-align to the anchor, then clamp the whole box inside
    // the viewport using its real width.
    let left = r.left;
    left = Math.max(MARGIN, Math.min(left, window.innerWidth - bw - MARGIN));

    el.style.left = Math.round(left) + 'px';
    el.style.top = Math.round(top) + 'px';
    el.style.display = 'block';
  };

  const hide = (): void => {
    stopWatchdog();
    el.style.display = 'none';
    selector = null;
    activeUid = null;
    lockedTo = null;
    locked = false;
    textarea = null;
    feedbackList = null;
    wantsFocus = false;
    lastAnchorKey = '';
    onHide();
  };

  const isTyping = (): boolean => Boolean(textarea) && document.activeElement === textarea;
  const show = (anchor: Element, payload: AnnotationPayload | null): void => {
    if (!payload) {
      if (locked || isTyping()) return;
      hide();
      return;
    }
    // Same capture — preserve textarea content + focus, just refresh
    // the feedback list. We compare BOTH uid and selector so a stale
    // payload pointing at a different capture (same selector, e.g.
    // alt-hovering a sibling with the same testId) triggers a full
    // refresh instead of pretending nothing changed.
    if (selector === payload.selector && (payload.uid ?? null) === activeUid) {
      if (payload.feedback?.length && feedbackList) {
        feedbackList.replaceChildren();
        for (const t of payload.feedback) {
          const li = document.createElement('li');
          Object.assign(li.style, {margin: '2px 0', color: '#fcfaf5', wordBreak: 'break-word'});
          li.textContent = t;
          feedbackList.append(li);
        }
      }
      return;
    }
    // Different capture — switch fully. Alt-hover only fires while Alt
    // is held, so this only happens when the user deliberately moves to
    // a new target; losing in-progress typing is the expected cost of
    // switching. Once Alt is released, mousemoves don't trigger hover
    // events, so the box freezes on the last element and typing is safe.
    selector = payload.selector ?? null;
    activeUid = payload.uid ?? null;
    lockedTo = anchor;
    buildBody(payload);
    position(anchor);
    startWatchdog();
    onShow(anchor);
  };
  // Pending-focus flag: if focus is requested before the textarea exists
  // (e.g. alt was released before the annotation message round-tripped
  // back), we set the flag and the buildBody completion path picks it up.
  let wantsFocus = false;
  const doFocus = (): void => {
    if (!textarea) return;
    if (document.activeElement === el || document.activeElement === textarea) return;
    // Defer to the next frame so we land AFTER any focus-stealing browser
    // behaviour (e.g. Alt → menu-bar on Windows) has settled.
    requestAnimationFrame(() => {
      if (textarea) textarea.focus({preventScroll: true});
    });
  };
  // Public hook: focus the textarea (called on alt-release so typing is
  // immediate without the user having to mouse to the box).
  const focusTextarea = (): void => {
    wantsFocus = true;
    doFocus();
  };

  el.addEventListener('mouseenter', () => {
    locked = true;
    if (textarea && document.activeElement !== textarea) textarea.focus();
  });
  el.addEventListener('mouseleave', () => {
    if (textarea && (textarea.value.length > 0 || document.activeElement === textarea)) return;
    locked = false;
  });

  // True when the anchor has left the DOM or collapsed to nothing (display
  // toggled off, removed, detached). A box anchored to a vanished element is
  // the "tooltip stranded after its anchor leaves" failure — tear it down.
  const anchorIsGone = (): boolean => {
    if (!lockedTo) return true;
    if (!lockedTo.isConnected) return true;
    const r = lockedTo.getBoundingClientRect();
    return r.width === 0 && r.height === 0;
  };

  const reposition = (): void => {
    if (el.style.display !== 'block') return;
    if (anchorIsGone()) { hide(); return; }
    position(lockedTo!);
  };
  window.addEventListener('scroll', reposition, true);
  window.addEventListener('resize', reposition);

  // Anchor watchdog. Scroll/resize cover most movement, but an SPA that
  // swaps the anchored element out (route change, list re-render, modal
  // close) fires neither — leaving the box stranded at a stale position.
  // A self-cancelling rAF loop that only runs while the box is visible
  // catches that: it repositions on layout drift and hides the moment the
  // anchor is gone. It stops itself when the box hides so there's no
  // ambient loop on every page.
  let watchdog = 0;
  const stopWatchdog = (): void => {
    if (watchdog) { cancelAnimationFrame(watchdog); watchdog = 0; }
  };
  let lastAnchorKey = '';
  const startWatchdog = (): void => {
    stopWatchdog();
    const tick = (): void => {
      if (el.style.display !== 'block') { watchdog = 0; return; }
      if (anchorIsGone()) { hide(); return; }
      // Reposition only when the anchor actually moved, so we don't fight
      // the user's caret / re-measure every frame.
      const r = lockedTo!.getBoundingClientRect();
      const key = `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}`;
      if (key !== lastAnchorKey) { lastAnchorKey = key; position(lockedTo!); }
      watchdog = requestAnimationFrame(tick);
    };
    watchdog = requestAnimationFrame(tick);
  };

  // Escape from anywhere (not just the focused textarea) dismisses the box.
  // The textarea's own keydown handles Escape while focused; this covers the
  // case where the box is locked/open but focus is elsewhere on the page.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.style.display === 'block') { hide(); }
  }, true);

  return {show, hide, isLocked: () => locked || isTyping(), focusTextarea, startWatchdog, stopWatchdog};
}

// (No shadow stylesheet — every overlay element gets its style applied via
// the JS HTMLElement.style API, which Chrome allows under strict CSP.)
