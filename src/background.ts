// PinchGrab — background service worker (MV3)
//
// • Open the side panel on action click
// • Inject the content script into already-open tabs (no refresh needed)
// • Right-click "PinchGrab capture" context menu
// • Capture visible-tab screenshots on side-panel request
// • Auto-open the side panel on first capture (uses Chrome 116+ user-gesture
//   propagation through chrome.runtime.sendMessage)
// • Relay content-script messages to side-panel ports
// • Screenshot worker: shot-element / shot-group / shot-page kinds. Each
//   captures via chrome.tabs.captureVisibleTab, optionally crops/stitches
//   in an OffscreenCanvas, and writes the PNG into the user's Downloads
//   under .pinchgrab/<workspace>/screenshots/.

import type {AnyMessage, PgEnvelope, ShotReply} from './types.ts';
import {pg} from './types.ts';

const LOG = '[PinchGrab/bg]';

// ─── Toolbar icon: render the 🤏 emoji into ImageData ─────────────────────
// We don't ship static PNG icons; we draw them at startup so the OS's own
// pinch glyph is used (consistent with the brand in the side panel).
async function setEmojiIcon(): Promise<void> {
  try {
    const sizes = [16, 32, 48, 128];
    const imageData: Record<number, ImageData> = {};
    for (const size of sizes) {
      const c = new OffscreenCanvas(size, size);
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, size, size);
      ctx.font = `${Math.floor(size * 0.82)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🤏', size / 2, size / 2 + size * 0.04);
      imageData[size] = ctx.getImageData(0, 0, size, size);
    }
    await chrome.action.setIcon({imageData});
  } catch (e) { console.warn(LOG, 'setEmojiIcon', e); }
}

// Suppress the global Chrome downloads UI ("downloads bubble" / shelf) so
// per-capture screenshot saves don't pop the panel on every alt-click.
// The user's complaint: "selecting elements is downloading every screenshot
// like showing my downloads pane open". Chrome offers two APIs depending on
// version — we try both (each requires its own permission) and ignore
// failures so the extension still works without the permissions.
//
// Tradeoff: this disables the shelf for ALL downloads while pinchgrab is
// running. A future "settings → quiet downloads" toggle can make this
// opt-out.
const quietDownloadsUi = (): void => {
  // Newer API (Chrome 96+ via downloads.ui permission).
  try {
    (chrome.downloads as any).setUiOptions?.({enabled: false}, () => {
      if (chrome.runtime.lastError) console.log(LOG, 'setUiOptions:', chrome.runtime.lastError.message);
    });
  } catch (e) { console.log(LOG, 'setUiOptions threw', e); }
  // Older API (still present through Chrome 113ish via downloads.shelf).
  try { (chrome.downloads as any).setShelfEnabled?.(false); } catch { /* ignore */ }
};

chrome.runtime.onInstalled.addListener(async () => {
  try { await chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}); }
  catch (e) { console.warn(LOG, 'setPanelBehavior', e); }
  try { chrome.contextMenus.create({id: 'pg-capture', title: 'PinchGrab — capture this element', contexts: ['all']}); }
  catch { /* may already exist */ }
  quietDownloadsUi();
  void injectIntoOpenTabs();
  void setEmojiIcon();
});

chrome.runtime.onStartup?.addListener(() => {
  quietDownloadsUi();
  void injectIntoOpenTabs();
  void setEmojiIcon();
});

// Re-quiet on each cold start of the SW — the setting can be reset by the
// user or other extensions, and SWs go idle aggressively.
quietDownloadsUi();

async function injectIntoOpenTabs(): Promise<void> {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (!tab.id || !tab.url || !/^https?:/.test(tab.url)) continue;
      try {
        await chrome.scripting.executeScript({
          target: {tabId: tab.id, allFrames: false},
          files: ['content-script.js'],
          injectImmediately: true,
        });
      } catch { /* protected page; ignore */ }
    }
  } catch (e) { console.warn(LOG, 'injectIntoOpenTabs', e); }
}

chrome.tabs.onActivated.addListener(async ({tabId}) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab?.url || !/^https?:/.test(tab.url)) return;
    chrome.scripting.executeScript({
      target: {tabId},
      files: ['content-script.js'],
      injectImmediately: true,
    }).catch(() => { /* ignore */ });
  } catch { /* ignore */ }
});

chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'pg-capture' || !tab?.id) return;
  chrome.tabs.sendMessage(tab.id, {__pg: true, kind: 'context-capture'}).catch(() => { /* ignore */ });
});

// ─── Screenshot helpers ────────────────────────────────────────────────────

// Filename timestamp is epoch milliseconds. Sorting by name = sorting by
// time within a host bucket. We accept an optional ISO string for tests but
// normalize to epoch ms so the output is uniform.
export const tsForFilename = (iso?: string): string => {
  if (!iso) return String(Date.now());
  const t = Date.parse(iso);
  return Number.isFinite(t) ? String(t) : String(Date.now());
};

// host-slug: replace `.` with `_` (per project convention so filenames are
// shell-friendly and don't look like multi-extension paths like `app.pinch
// grab.com-...`), strip any other non-word/hyphen characters, cap at 40
// chars. `localhost:3000` → `localhost_3000`.
export const hostSlug = (url: string): string => {
  let host: string;
  try { host = new URL(url).host; } catch { host = 'unknown'; }
  return host.replace(/\./g, '_').replace(/[^\w-]/g, '_').slice(0, 40) || 'unknown';
};

// Filename layout: `<host_underscored>-n<N>-<kind>[-<extra>]-<epoch>.png`.
// Host first means screenshots in Downloads/.pinchgrab/<ws>/screenshots/
// group naturally per site; epoch as a tail key gives chronological order
// inside each bucket.
export const buildFilename = (
  kind: 'element' | 'group' | 'page',
  ts: string,
  n: number,
  url: string,
  opts: {count?: number; truncated?: boolean} = {},
): string => {
  const stamp = tsForFilename(ts);
  const slug = hostSlug(url);
  if (kind === 'element') return `${slug}-n${n}-element-${stamp}.png`;
  if (kind === 'group') return `${slug}-n${n}-group${opts.count ?? 0}-${stamp}.png`;
  // page
  const suffix = opts.truncated ? 'page-trunc' : 'page';
  return `${slug}-n${n}-${suffix}-${stamp}.png`;
};

// dataURL → Blob without going through fetch/atob roundtrips that browsers
// in service-worker context sometimes balk at. PNG only.
const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const r = await fetch(dataUrl);
  return r.blob();
};

// Decode a PNG dataURL into an ImageBitmap usable by OffscreenCanvas. We
// can't `new Image()` in a service worker — Image is a DOM-only constructor.
const dataUrlToBitmap = async (dataUrl: string): Promise<ImageBitmap> => {
  const blob = await dataUrlToBlob(dataUrl);
  return createImageBitmap(blob);
};

// Encode an OffscreenCanvas to a PNG blob.
const canvasToBlob = async (canvas: OffscreenCanvas): Promise<Blob> =>
  canvas.convertToBlob({type: 'image/png'});

// Downscale a bitmap into a PNG dataURL with max width capped. The thumbnail
// is what the side panel paints into the .preview tile — the original lives
// only on disk. We use FileReader (works in MV3 SWs) since the dataURL is
// passed back through chrome.runtime.sendMessage where size matters less.
const makeThumbnail = async (bitmap: ImageBitmap, maxWidth = 320): Promise<string> => {
  const ratio = bitmap.width <= maxWidth ? 1 : maxWidth / bitmap.width;
  const w = Math.max(1, Math.round(bitmap.width * ratio));
  const h = Math.max(1, Math.round(bitmap.height * ratio));
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await canvas.convertToBlob({type: 'image/png'});
  // arrayBuffer + btoa avoids any FileReader-availability concern.
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x80_00;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return `data:image/png;base64,${btoa(binary)}`;
};

// Per-tab serialization: at most one capture in flight at a time. Without a
// queue, the throttling on captureVisibleTab (~2 calls/sec) shows up as
// missing screenshots when the user fires several captures back-to-back.
type QueueTask = () => Promise<void>;
const tabQueues = new Map<number, Promise<void>>();
const enqueue = (tabId: number, task: QueueTask): Promise<void> => {
  const prev = tabQueues.get(tabId) ?? Promise.resolve();
  const next = prev.then(() => task()).catch((e) => { console.warn(LOG, 'queue task failed', e); });
  tabQueues.set(tabId, next);
  return next;
};

// One-shot CS round-trip: ask the content script to hide its overlay then
// wait for ack. We use sendMessage with a timeout so a CS that's stuck or
// not loaded can't wedge the queue.
const tellCs = async <T = unknown>(tabId: number, payload: any, timeoutMs = 600): Promise<T | null> => {
  return new Promise<T | null>((resolve) => {
    let done = false;
    const finish = (v: T | null): void => { if (!done) { done = true; resolve(v); } };
    setTimeout(() => finish(null), timeoutMs);
    try {
      chrome.tabs.sendMessage(tabId, pg(payload), (reply) => {
        if (chrome.runtime.lastError) { finish(null); return; }
        finish((reply ?? null) as T | null);
      });
    } catch { finish(null); }
  });
};

// Run a function inside the page's main world (or isolated, doesn't matter
// here because we only read layout numbers). args is passed positionally.
const runInPage = async <T>(
  tabId: number,
  func: (...args: any[]) => T,
  args: any[] = [],
): Promise<T | null> => {
  try {
    const results = await chrome.scripting.executeScript({
      target: {tabId},
      func: func as any,
      args,
    });
    return (results?.[0]?.result ?? null) as T | null;
  } catch (e) {
    console.warn(LOG, 'runInPage', e);
    return null;
  }
};

// Compute union bbox of selectors INSIDE the page, scroll it into view, and
// return the bbox + dpr for cropping. padding is applied symmetrically.
type BboxResult = {x: number; y: number; w: number; h: number; dpr: number; vw: number; vh: number};
const computeAndScroll = async (
  tabId: number,
  selectors: string[],
  padding: number,
): Promise<BboxResult | null> => {
  return runInPage<BboxResult | null>(tabId, (sels: string[], pad: number) => {
    const els = sels.map((s) => {
      try { return document.querySelector(s); } catch { return null; }
    }).filter((e): e is Element => Boolean(e));
    if (!els.length) return null;
    // Scroll union midpoint into view first; some pages have lazy images
    // that won't paint until they're near the viewport.
    const rectsBefore = els.map((e) => e.getBoundingClientRect());
    const minXAbs = Math.min(...rectsBefore.map((r) => r.left)) + window.scrollX;
    const minYAbs = Math.min(...rectsBefore.map((r) => r.top)) + window.scrollY;
    const maxXAbs = Math.max(...rectsBefore.map((r) => r.right)) + window.scrollX;
    const maxYAbs = Math.max(...rectsBefore.map((r) => r.bottom)) + window.scrollY;
    const cx = (minXAbs + maxXAbs) / 2;
    const cy = (minYAbs + maxYAbs) / 2;
    const targetX = Math.max(0, cx - window.innerWidth / 2);
    const targetY = Math.max(0, cy - window.innerHeight / 2);
    window.scrollTo({left: targetX, top: targetY, behavior: 'instant' as ScrollBehavior});

    // Recompute bboxes after scroll.
    const rects = els.map((e) => e.getBoundingClientRect());
    const minX = Math.min(...rects.map((r) => r.left)) - pad;
    const minY = Math.min(...rects.map((r) => r.top)) - pad;
    const maxX = Math.max(...rects.map((r) => r.right)) + pad;
    const maxY = Math.max(...rects.map((r) => r.bottom)) + pad;
    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
      dpr: window.devicePixelRatio || 1,
      vw: window.innerWidth,
      vh: window.innerHeight,
    };
  }, [selectors, padding]);
};

// One-frame yield inside the page so any post-scroll layout settles. We pin
// to two rAFs to be conservative — pages with sticky headers sometimes need
// the second frame to repaint the header at its new offset.
const yieldRaf = async (tabId: number): Promise<void> => {
  await runInPage<void>(tabId, () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
};

// Restore the page scroll position after stitching. The original positions
// are passed back from the stitch loop.
const restoreScroll = async (tabId: number, x: number, y: number): Promise<void> => {
  await runInPage<void>(tabId, (sx: number, sy: number) => {
    window.scrollTo({left: sx, top: sy, behavior: 'instant' as ScrollBehavior});
  }, [x, y]);
};

const PAGE_CHUNK_LIMIT = 8;
const CANVAS_PIXEL_LIMIT = 16384; // OffscreenCanvas safety cap

// Page (full-document) shot. Loops captureVisibleTab while scrolling by
// viewport-height chunks; stops at chunk count, pixel cap, or scrollHeight.
const stitchPage = async (
  tabId: number,
  windowId: number,
): Promise<{blob: Blob; bitmap: ImageBitmap; truncated: boolean} | null> => {
  // Snapshot scroll geometry up front.
  const geom = await runInPage<{vw: number; vh: number; sw: number; sh: number; dpr: number; sx: number; sy: number}>(
    tabId,
    () => ({
      vw: window.innerWidth,
      vh: window.innerHeight,
      sw: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
      sh: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
      dpr: window.devicePixelRatio || 1,
      sx: window.scrollX,
      sy: window.scrollY,
    }),
  );
  if (!geom) return null;

  const dpr = geom.dpr;
  const totalH = geom.sh;
  const totalHpx = Math.round(totalH * dpr);
  const widthPx = Math.round(geom.vw * dpr);

  // If the page is short enough to fit in the viewport, single shot.
  let chunks = 0;
  let y = 0;
  let stitchedHpx = 0;
  let truncated = false;

  // Allocate the canvas at the conservative final size; we'll trim later if
  // we stop early. width is fixed; height grows up to min(totalHpx, cap).
  const targetHpx = Math.min(totalHpx, CANVAS_PIXEL_LIMIT);
  const canvas = new OffscreenCanvas(widthPx, targetHpx);
  const ctx = canvas.getContext('2d')!;

  while (y < totalH) {
    if (chunks >= PAGE_CHUNK_LIMIT) { truncated = true; break; }
    if (stitchedHpx >= CANVAS_PIXEL_LIMIT) { truncated = true; break; }
    await runInPage<void>(tabId, (yy: number) => {
      window.scrollTo({left: 0, top: yy, behavior: 'instant' as ScrollBehavior});
    }, [y]);
    await yieldRaf(tabId);
    let dataUrl: string;
    try {
      dataUrl = await chrome.tabs.captureVisibleTab(windowId, {format: 'png'});
    } catch (e) {
      console.warn(LOG, 'captureVisibleTab page chunk failed', e);
      break;
    }
    const bm = await dataUrlToBitmap(dataUrl);
    // Determine how much of THIS chunk to draw. The last chunk usually
    // overlaps the previous one (because totalH is not a viewport multiple);
    // drawing the full bitmap would duplicate pixels. So we crop by the
    // remainder of the page height when on the tail.
    const remainingPx = Math.round((totalH - y) * dpr);
    const drawSrcH = Math.min(bm.height, remainingPx);
    const drawDestH = Math.min(targetHpx - stitchedHpx, drawSrcH);
    if (drawDestH <= 0) { truncated = true; break; }
    ctx.drawImage(bm, 0, 0, bm.width, drawDestH, 0, stitchedHpx, bm.width, drawDestH);
    stitchedHpx += drawDestH;
    chunks++;
    y += geom.vh;
    bm.close?.();
  }

  // Restore scroll.
  await restoreScroll(tabId, geom.sx, geom.sy);

  // Trim canvas to actual stitched height if we stopped before targetHpx.
  let outCanvas = canvas;
  if (stitchedHpx < targetHpx) {
    const trimmed = new OffscreenCanvas(widthPx, Math.max(1, stitchedHpx));
    const tctx = trimmed.getContext('2d')!;
    tctx.drawImage(canvas, 0, 0);
    outCanvas = trimmed;
  }
  const blob = await canvasToBlob(outCanvas);
  const bitmap = await createImageBitmap(blob);
  return {blob, bitmap, truncated};
};

// Element/group shot: hide overlays, capture viewport, crop in canvas.
const shotElementCommon = async (
  tabId: number,
  windowId: number,
  selectors: string[],
  padding: number,
): Promise<{blob: Blob; bitmap: ImageBitmap; tabUrl: string; cropMeta: ShotReply['crop']} | null> => {
  const tab = await chrome.tabs.get(tabId);
  const tabUrl = tab?.url ?? '';
  // Item 17 (flashing): hide + freeze overlays BEFORE we scroll the page to
  // frame the capture. The old order scrolled first, so the content script's
  // ring rAF loops chased the new scroll offset (a visible jump) before they
  // were hidden, and a grouped capture's many rings amplified the flicker.
  // Hiding first means the whole scroll→yield→capture→restore window happens
  // with the overlay frozen and out of layout — no on-screen flash.
  await tellCs(tabId, {kind: 'hide-overlays'});
  let dataUrl: string;
  let bbox: BboxResult | null = null;
  try {
    bbox = await computeAndScroll(tabId, selectors, padding);
    if (!bbox) return null;
    await yieldRaf(tabId);
    dataUrl = await chrome.tabs.captureVisibleTab(windowId, {format: 'png'});
  } catch (e) {
    console.warn(LOG, 'captureVisibleTab failed', e);
    return null;
  } finally {
    await tellCs(tabId, {kind: 'show-overlays'});
  }

  const bm = await dataUrlToBitmap(dataUrl);
  // Convert CSS-pixel bbox → device-pixel bbox; clamp to bitmap bounds so
  // a partially off-screen element doesn't crash drawImage.
  const sx = Math.max(0, Math.round(bbox.x * bbox.dpr));
  const sy = Math.max(0, Math.round(bbox.y * bbox.dpr));
  const sw = Math.max(1, Math.min(bm.width - sx, Math.round(bbox.w * bbox.dpr)));
  const sh = Math.max(1, Math.min(bm.height - sy, Math.round(bbox.h * bbox.dpr)));
  const canvas = new OffscreenCanvas(sw, sh);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bm, sx, sy, sw, sh, 0, 0, sw, sh);
  bm.close?.();
  const blob = await canvasToBlob(canvas);
  const bitmap = await createImageBitmap(blob);
  // Bug #3 from the export roast: surface crop metadata so receivers
  // can map between the stored PNG and the original page coordinates.
  // cssRect = pre-DPR CSS pixel rect of the captured region.
  // devicePxRect = post-DPR pixel rect inside the source bitmap.
  // imageSize = dimensions of the produced PNG.
  // dpr = the conversion factor.
  const cropMeta: ShotReply['crop'] = {
    cssRect: {x: bbox.x, y: bbox.y, w: bbox.w, h: bbox.h},
    devicePxRect: {x: sx, y: sy, w: sw, h: sh},
    imageSize: {w: sw, h: sh},
    dpr: bbox.dpr,
    padding,
    selectors,
  };
  return {blob, bitmap, tabUrl, cropMeta};
};

// Page-only path. Hides overlays, stitches, restores.
const shotPageCommon = async (
  tabId: number,
  windowId: number,
): Promise<{blob: Blob; bitmap: ImageBitmap; tabUrl: string; truncated: boolean} | null> => {
  const tab = await chrome.tabs.get(tabId);
  const tabUrl = tab?.url ?? '';
  await tellCs(tabId, {kind: 'hide-overlays'});
  let stitched: {blob: Blob; bitmap: ImageBitmap; truncated: boolean} | null = null;
  try {
    stitched = await stitchPage(tabId, windowId);
  } finally {
    await tellCs(tabId, {kind: 'show-overlays'});
  }
  if (!stitched) return null;
  return {...stitched, tabUrl};
};

// Save the blob as a download under .pinchgrab/<workspace>/<subdir>/.
//
// MV3 service workers DO NOT have URL.createObjectURL — calling it throws
// "URL.createObjectURL is not a function" (verified live in extension.spec).
// We base64-encode the blob into a data URL instead. Tradeoff: the data
// URL is ~33% larger than raw bytes, and chrome.downloads.download has a
// data-URL size limit somewhere around 32 MB; for typical workspace
// exports (sub-MB JSONL + low-MB ZIPs) this is well under the limit.
type SavedFile = {
  relPath: string;
  absPath: string;
  copyPath: string;
  tempPath: boolean;
  downloadState?: chrome.downloads.DownloadItem['state'];
};

const isPlaywrightArtifactPath = (path: string): boolean =>
  /(?:^|[\\/])(?:playwright-artifacts|pinchgrab-dl)-[^\\/]+[\\/][0-9a-f-]{8}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{12}$/i.test(path);

const blobToDataUrl = async (blob: Blob): Promise<string> => {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // Build base64 in 32 KiB chunks so String.fromCharCode.apply doesn't
  // overflow the call stack on large inputs.
  let binary = '';
  const chunk = 0x80_00;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  const mime = blob.type || 'application/octet-stream';
  return `data:${mime};base64,${btoa(binary)}`;
};

const saveDownload = async (
  blob: Blob,
  workspace: string,
  filename: string,
  subdir = 'screenshots',
): Promise<SavedFile> => {
  const relPath = subdir ? `${subdir}/${filename}` : filename;
  const fullPath = `pinchgrab/${workspace}/${relPath}`;
  console.log(LOG, 'saveDownload start', {fullPath, mime: blob.type, size: blob.size});
  const url = await blobToDataUrl(blob);
  const downloadId = await new Promise<number>((resolve, reject) => {
    chrome.downloads.download(
      {url, filename: fullPath, conflictAction: 'overwrite'},
      (id) => {
        if (chrome.runtime.lastError) {
          console.error(LOG, 'chrome.downloads.download lastError:', chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message ?? 'download failed'));
          return;
        }
        if (id == null) {
          console.error(LOG, 'chrome.downloads.download returned no id');
          reject(new Error('download returned no id'));
          return;
        }
        resolve(id);
      },
    );
  });
  console.log(LOG, 'chrome.downloads.download accepted', {id: downloadId, fullPath});
  // Resolve the OS-absolute path and do not report success until Chrome says
  // the download completed. `chrome.downloads.download` only means "accepted";
  // disk-full, permission, or interrupted writes surface later through
  // downloads.search.
  let absPath = `${workspace}/${relPath}`;
  let downloadState: chrome.downloads.DownloadItem['state'] | undefined;
  let interruptedError = '';
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const items = await chrome.downloads.search({id: downloadId});
      const item = items?.[0];
      if (item?.filename) absPath = item.filename;
      downloadState = item?.state;
      if (item?.state === 'interrupted') {
        interruptedError = `download interrupted${item.error ? `: ${item.error}` : ''}`;
        break;
      }
      if (item?.state === 'complete' && item.filename) break;
    } catch (e) { console.warn(LOG, 'downloads.search threw:', e); }
    await new Promise((r) => setTimeout(r, 100));
  }
  if (interruptedError) throw new Error(interruptedError);
  if (downloadState !== 'complete') {
    throw new Error(`download did not complete${downloadState ? ` (state: ${downloadState})` : ''}`);
  }
  const tempPath = isPlaywrightArtifactPath(absPath);
  // Playwright rewrites Chrome downloads to extensionless UUID files under
  // /tmp/playwright-artifacts-*; copying that to the user is confusing and
  // often stale. Keep it in absPath for tests/debugging, but expose the
  // intended browser download target for the side panel's clipboard action.
  const copyPath = tempPath ? `~/Downloads/${fullPath}` : absPath;
  console.log(LOG, 'saveDownload returning', {relPath, absPath, copyPath, tempPath, downloadState});
  return {relPath: `${workspace}/${relPath}`, absPath, copyPath, tempPath, downloadState};
};

const saveTextDownload = async (
  text: string,
  workspace: string,
  filename: string,
  mime: string,
  subdir = 'exports',
): Promise<SavedFile> => {
  const blob = new Blob([text], {type: mime});
  return saveDownload(blob, workspace, filename, subdir);
};

const saveBytesDownload = async (
  bytes: Uint8Array,
  workspace: string,
  filename: string,
  mime: string,
  subdir = 'exports',
): Promise<SavedFile> => {
  const blob = new Blob([bytes as unknown as BlobPart], {type: mime});
  return saveDownload(blob, workspace, filename, subdir);
};

// ─── Service requests + relay ─────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg: PgEnvelope<AnyMessage> | any, sender, sendResponse) => {
  if (!msg || msg.__pg !== true) return false;

  if (msg.kind === 'capture-screenshot') {
    void (async () => {
      try {
        const tabs = msg.tabId ? [await chrome.tabs.get(msg.tabId)]
          : await chrome.tabs.query({active: true, currentWindow: true});
        const tab = tabs[0];
        if (!tab?.windowId) { sendResponse({error: 'no active tab'}); return; }
        const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'});
        sendResponse({dataUrl});
      } catch (e) { sendResponse({error: String((e as Error)?.message ?? e)}); }
    })();
    return true;
  }
  if (msg.kind === 'switch-to-tab') {
    void (async () => {
      try {
        const tabs = await chrome.tabs.query({url: msg.url});
        if (tabs.length && tabs[0]?.id != null) {
          await chrome.tabs.update(tabs[0].id, {active: true});
          if (tabs[0].windowId != null) await chrome.windows.update(tabs[0].windowId, {focused: true});
          sendResponse({found: true});
        } else if (msg.openIfMissing) {
          const t = await chrome.tabs.create({url: msg.url, active: true});
          sendResponse({found: false, opened: t.id});
        } else sendResponse({found: false});
      } catch (e) { sendResponse({error: String((e as Error)?.message ?? e)}); }
    })();
    return true;
  }
  if (msg.kind === 'list-open-tabs') {
    void (async () => {
      try {
        const tabs = await chrome.tabs.query({});
        sendResponse({tabs: tabs.filter((t) => t.url).map((t) => ({id: t.id, url: t.url, title: t.title}))});
      } catch (e) { sendResponse({error: String((e as Error)?.message ?? e), tabs: []}); }
    })();
    return true;
  }

  if (msg.kind === 'shot-element' || msg.kind === 'shot-group' || msg.kind === 'shot-page') {
    void (async () => {
      try {
        const tabId = msg.tabId ?? sender.tab?.id;
        let resolvedTabId = tabId;
        let windowId: number | undefined;
        if (resolvedTabId == null) {
          const tabs = await chrome.tabs.query({active: true, currentWindow: true});
          resolvedTabId = tabs[0]?.id;
          windowId = tabs[0]?.windowId;
        } else {
          const t = await chrome.tabs.get(resolvedTabId);
          windowId = t?.windowId;
        }
        if (resolvedTabId == null || windowId == null) {
          sendResponse({ok: false, error: 'no active tab'} satisfies ShotReply);
          return;
        }
        const tabIdFinal = resolvedTabId;
        const windowIdFinal = windowId;
        await enqueue(tabIdFinal, async () => {
          try {
            const reply = await runShot(msg, tabIdFinal, windowIdFinal);
            sendResponse(reply);
          } catch (e) {
            sendResponse({ok: false, error: String((e as Error)?.message ?? e)} satisfies ShotReply);
          }
        });
      } catch (e) {
        sendResponse({ok: false, error: String((e as Error)?.message ?? e)} satisfies ShotReply);
      }
    })();
    return true;
  }

  // Full-page snapshot for the page-snapshot feature. Reuses the same
  // hide-overlays → stitch → restore path as shot-page, but returns the PNG
  // as a data URL instead of writing a file. Serialized per tab through the
  // same queue so it can't race a concurrent element/group capture.
  if (msg.kind === 'page-snapshot-shot') {
    void (async () => {
      try {
        const tabId = msg.tabId ?? sender.tab?.id;
        let resolvedTabId = tabId;
        let windowId: number | undefined;
        if (resolvedTabId == null) {
          const tabs = await chrome.tabs.query({active: true, currentWindow: true});
          resolvedTabId = tabs[0]?.id;
          windowId = tabs[0]?.windowId;
        } else {
          const t = await chrome.tabs.get(resolvedTabId);
          windowId = t?.windowId;
        }
        if (resolvedTabId == null || windowId == null) {
          sendResponse({ok: false, error: 'no active tab'});
          return;
        }
        const tabIdFinal = resolvedTabId;
        const windowIdFinal = windowId;
        await enqueue(tabIdFinal, async () => {
          try {
            const got = await shotPageCommon(tabIdFinal, windowIdFinal);
            if (!got) { sendResponse({ok: false, error: 'capture failed'}); return; }
            const screenshot = await blobToFullDataUrl(got.blob);
            got.bitmap.close?.();
            // `truncated` here means the stitch stopped early (chunk/pixel
            // cap) — the PNG covers only part of the document, which is
            // exactly the `partial` signal the PageSnapshot contract wants.
            sendResponse({ok: true, screenshot, partial: got.truncated});
          } catch (e) {
            sendResponse({ok: false, error: String((e as Error)?.message ?? e)});
          }
        });
      } catch (e) {
        sendResponse({ok: false, error: String((e as Error)?.message ?? e)});
      }
    })();
    return true;
  }

  if (msg.kind === 'save-text' || msg.kind === 'save-bytes') {
    void (async () => {
      try {
        let stored: SavedFile;
        const workspace = String(msg.workspace ?? 'default');
        const filename = String(msg.filename ?? 'export.bin');
        const mime = String(msg.mime ?? 'application/octet-stream');
        const subdir = String(msg.subdir ?? 'exports');
        if (msg.kind === 'save-text') {
          stored = await saveTextDownload(String(msg.text ?? ''), workspace, filename, mime, subdir);
        } else {
          // Defensive decode: chrome.runtime.sendMessage can deliver bytes
          // as a Uint8Array, a number[], or a generic indexed object
          // (depending on Chrome version + caller). Accept all shapes.
          const raw: any = msg.bytes;
          let bytes: Uint8Array;
          if (raw instanceof Uint8Array) bytes = raw;
          else if (Array.isArray(raw)) bytes = Uint8Array.from(raw);
          else if (raw && typeof raw === 'object') {
            const vals = Object.values(raw) as number[];
            bytes = Uint8Array.from(vals);
          } else bytes = new Uint8Array();
          console.log(LOG, 'save-bytes decoded', {bytes: bytes.length, rawType: typeof raw, isArray: Array.isArray(raw), isU8: raw instanceof Uint8Array});
          stored = await saveBytesDownload(bytes, workspace, filename, mime, subdir);
        }
        sendResponse({
          ok: true, filename: stored.relPath, absPath: stored.absPath,
          copyPath: stored.copyPath, tempPath: stored.tempPath, downloadState: stored.downloadState,
        });
      } catch (e) {
        sendResponse({ok: false, error: String((e as Error)?.message ?? e)});
      }
    })();
    return true;
  }

  // Auto-open the side panel on first capture/staging. Chrome 116+ propagates
  // the user activation through chrome.runtime.sendMessage so this doesn't
  // throw — the click that triggered the capture in the content script is
  // still considered "live" here in the worker.
  //
  // INVESTIGATE-1 (first-capture race): on the VERY FIRST Alt+Click the panel
  // document doesn't exist yet, so its chrome.runtime.onMessage listener isn't
  // registered. chrome.runtime.sendMessage only reaches listeners that are
  // already live, so this first capture is dropped — the user has to click a
  // second time (panel now listening) to see it. The robust fix is a panel→bg
  // "panel-ready, send me anything pending" handshake, but that needs a
  // sidepanel.ts change (reported separately). As a background-only, low-risk
  // mitigation we re-broadcast the first capture(s) a few times over a short
  // window AFTER opening the panel. The panel registers its onMessage listener
  // synchronously at script-eval (before its async loadAll), and it already
  // buffers messages until ready AND dedupes by __mid — so a replay that lands
  // after the listener exists is processed exactly once, and replays that lose
  // the race are harmless no-ops.
  //
  // We guard on `sender.tab?.id != null` so our OWN replays (which have no
  // sender.tab) never re-enter this branch — no open/replay loop.
  if ((msg.kind === 'capture' || msg.kind === 'pending-add') && sender.tab?.id != null) {
    chrome.sidePanel.open({tabId: sender.tab.id}).catch(() => { /* already open */ });
    // Always replay — we can't reliably tell from here whether the panel was
    // already listening (sidePanel has no "is-open" API, and open() resolving
    // vs rejecting is not a clean signal across Chrome versions / gesture
    // states). Over-replaying when the panel is already up is harmless: the
    // panel dedupes by __mid, so the redundant broadcasts collapse to nothing.
    // Under-replaying would resurrect the dropped-first-capture bug, so we err
    // toward always replaying. The window is short and bounded (3 sends).
    replayFirstCapture(msg as PgEnvelope<AnyMessage>);
  }

  // No port relay: the side panel listens directly on chrome.runtime.onMessage,
  // which already receives broadcasts from content scripts. Relaying through
  // a port causes every message to be delivered twice — that surfaced as
  // duplicated multi-select entries in production.
  return false;
});

// Re-broadcast a capture/pending-add envelope a few times over a short window
// so a freshly-opened side panel (whose listener registers a few ms after the
// document starts loading) catches it. Same __mid each time → the panel's
// recentMids ring dedupes to a single processed message. Bounded (no loop):
// three attempts inside ~450ms, then we stop. Resending the SAME envelope is
// important — a new __mid would defeat the dedup and double-insert.
const REPLAY_DELAYS_MS = [60, 180, 450];
const replayFirstCapture = (envelope: PgEnvelope<AnyMessage>): void => {
  for (const delay of REPLAY_DELAYS_MS) {
    setTimeout(() => {
      // sendMessage with no callback; the panel consumes it. Wrapped so a
      // "receiving end does not exist" rejection (panel still not up on the
      // earliest attempt) is swallowed rather than logged as an error.
      try { void chrome.runtime.sendMessage(envelope).catch?.(() => { /* not up yet */ }); }
      catch { /* ignore */ }
    }, delay);
  }
};

// Encode a PNG blob into a base64 data URL using the same chunked-btoa
// path saveDownload uses. The result is two purposes-in-one: the
// downscaled thumbnail goes back to the side panel's preview tile (small,
// ~5-15 KB), while the FULL png also rides back so the panel can stash it
// in `shotsFull` and bundle it into the workspace .tar.zst export later.
const blobToFullDataUrl = async (blob: Blob): Promise<string> => {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x80_00;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return `data:image/png;base64,${btoa(binary)}`;
};

const runShot = async (msg: any, tabId: number, windowId: number): Promise<ShotReply> => {
  const ts = new Date().toISOString();
  const padding = typeof msg.padding === 'number' ? msg.padding : 24;
  if (msg.kind === 'shot-element') {
    const got = await shotElementCommon(tabId, windowId, [msg.selector], padding);
    if (!got) return {ok: false, error: 'capture failed'};
    const filename = buildFilename('element', ts, msg.n, got.tabUrl);
    const stored = await saveDownload(got.blob, msg.workspace, filename);
    const dataUrl = await makeThumbnail(got.bitmap);
    const fullDataUrl = await blobToFullDataUrl(got.blob);
    got.bitmap.close?.();
    return {
      ok: true, filename: stored.relPath, absPath: stored.absPath,
      copyPath: stored.copyPath, tempPath: stored.tempPath, downloadState: stored.downloadState,
      dataUrl, fullDataUrl,
      crop: got.cropMeta,
    };
  }
  if (msg.kind === 'shot-group') {
    const got = await shotElementCommon(tabId, windowId, msg.selectors, padding);
    if (!got) return {ok: false, error: 'capture failed'};
    const filename = buildFilename('group', ts, msg.n, got.tabUrl, {count: msg.selectors.length});
    const stored = await saveDownload(got.blob, msg.workspace, filename);
    const dataUrl = await makeThumbnail(got.bitmap);
    const fullDataUrl = await blobToFullDataUrl(got.blob);
    got.bitmap.close?.();
    return {
      ok: true, filename: stored.relPath, absPath: stored.absPath,
      copyPath: stored.copyPath, tempPath: stored.tempPath, downloadState: stored.downloadState,
      dataUrl, fullDataUrl,
      crop: got.cropMeta,
    };
  }
  // page
  const got = await shotPageCommon(tabId, windowId);
  if (!got) return {ok: false, error: 'capture failed'};
  const filename = buildFilename('page', ts, msg.n, got.tabUrl, {truncated: got.truncated});
  const stored = await saveDownload(got.blob, msg.workspace, filename);
  const dataUrl = await makeThumbnail(got.bitmap);
  const fullDataUrl = await blobToFullDataUrl(got.blob);
  got.bitmap.close?.();
  return {
    ok: true, filename: stored.relPath, absPath: stored.absPath,
    copyPath: stored.copyPath, tempPath: stored.tempPath, downloadState: stored.downloadState,
    dataUrl, fullDataUrl, truncated: got.truncated,
  };
};

// (save-text / save-bytes are folded into the single listener above.)
