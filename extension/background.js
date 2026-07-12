(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  function __accessProp(key) {
    return this[key];
  }
  var __toCommonJS = (from) => {
    var entry = (__moduleCache ??= new WeakMap).get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function") {
      for (var key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(entry, key))
          __defProp(entry, key, {
            get: __accessProp.bind(from, key),
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
          });
    }
    __moduleCache.set(from, entry);
    return entry;
  };
  var __moduleCache;
  var __returnValue = (v) => v;
  function __exportSetter(name, newValue) {
    this[name] = __returnValue.bind(null, newValue);
  }
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: __exportSetter.bind(all, name)
      });
  };

  // src/background.ts
  var exports_background = {};
  __export(exports_background, {
    tsForFilename: () => tsForFilename,
    hostSlug: () => hostSlug,
    buildFilename: () => buildFilename
  });

  // src/types.ts
  var _midCounter = 0;
  var newMid = () => {
    const prefix = `${Date.now().toString(36)}-${(++_midCounter).toString(36)}`;
    try {
      const bytes = new Uint8Array(4);
      globalThis.crypto.getRandomValues(bytes);
      return `${prefix}-${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
    } catch {
      return prefix;
    }
  };
  var pg = (payload) => ({ __pg: true, __mid: newMid(), ...payload });

  // src/background.ts
  var LOG = "[PinchGrab/bg]";
  async function setEmojiIcon() {
    try {
      const sizes = [16, 32, 48, 128];
      const imageData = {};
      for (const size of sizes) {
        const c = new OffscreenCanvas(size, size);
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, size, size);
        ctx.font = `${Math.floor(size * 0.82)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("\uD83E\uDD0F", size / 2, size / 2 + size * 0.04);
        imageData[size] = ctx.getImageData(0, 0, size, size);
      }
      await chrome.action.setIcon({ imageData });
    } catch (e) {
      console.warn(LOG, "setEmojiIcon", e);
    }
  }
  chrome.runtime.onInstalled.addListener(async () => {
    try {
      chrome.contextMenus.create({ id: "pg-capture", title: "PinchGrab — capture this element", contexts: ["all"] });
    } catch {}
    setEmojiIcon();
  });
  chrome.runtime.onStartup?.addListener(() => {
    setEmojiIcon();
  });
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch((e) => console.warn(LOG, "setPanelBehavior (startup)", e));
  var ACTIVE_TABS_KEY = "pg.activeTabs";
  var readActiveTabs = async () => {
    try {
      const o = await chrome.storage.session.get(ACTIVE_TABS_KEY);
      return o[ACTIVE_TABS_KEY] ?? {};
    } catch {
      return {};
    }
  };
  var trackActiveTab = async (tabId) => {
    const cur = await readActiveTabs();
    cur[String(tabId)] = true;
    try {
      await chrome.storage.session.set({ [ACTIVE_TABS_KEY]: cur });
    } catch {}
  };
  var untrackActiveTab = async (tabId) => {
    const cur = await readActiveTabs();
    if (!(String(tabId) in cur))
      return;
    delete cur[String(tabId)];
    try {
      await chrome.storage.session.set({ [ACTIVE_TABS_KEY]: cur });
    } catch {}
  };
  chrome.tabs.onRemoved.addListener((tabId) => void untrackActiveTab(tabId));
  chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    if (info.status !== "complete")
      return;
    if (!tab.url || !/^https?:/.test(tab.url))
      return;
    (async () => {
      const tracked = await readActiveTabs();
      if (!tracked[String(tabId)])
        return;
      try {
        await chrome.scripting.executeScript({ target: { tabId, allFrames: false }, files: ["content-script.js"], injectImmediately: true });
        console.log(LOG, "reinjected after navigation", tabId);
      } catch (e) {
        console.warn(LOG, "reinject after navigation failed (grant revoked?)", tabId, e);
        await untrackActiveTab(tabId);
      }
    })();
  });
  chrome.action.onClicked.addListener((tab) => {
    if (!tab?.id)
      return;
    const tabId = tab.id;
    console.log(LOG, "action click → activate tab", tabId, tab.url ?? "(no url)");
    if (!tab.url || /^https?:/.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        files: ["content-script.js"],
        injectImmediately: true
      }).catch((e) => console.warn(LOG, "activate inject FAILED", e));
      trackActiveTab(tabId);
    } else {
      console.warn(LOG, "activate: cannot inject into", tab.url);
    }
    chrome.sidePanel.open({ tabId }).catch((e) => console.warn(LOG, "sidePanel.open", e));
    const meta = { __pg: true, kind: "pg-tab-activated", tabId, url: tab.url ?? "", title: tab.title ?? "" };
    const announce = () => {
      try {
        chrome.runtime.sendMessage(meta).catch?.(() => {});
      } catch {}
    };
    announce();
    setTimeout(announce, 150);
    setTimeout(announce, 500);
  });
  chrome.contextMenus?.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== "pg-capture" || !tab?.id)
      return;
    chrome.tabs.sendMessage(tab.id, { __pg: true, kind: "context-capture" }).catch(() => {});
  });
  var tsForFilename = (iso) => {
    if (!iso)
      return String(Date.now());
    const t = Date.parse(iso);
    return Number.isFinite(t) ? String(t) : String(Date.now());
  };
  var hostSlug = (url) => {
    let host;
    try {
      host = new URL(url).host;
    } catch {
      host = "unknown";
    }
    return host.replace(/\./g, "_").replace(/[^\w-]/g, "_").slice(0, 40) || "unknown";
  };
  var buildFilename = (kind, ts, n, url, opts = {}) => {
    const stamp = tsForFilename(ts);
    const slug = hostSlug(url);
    if (kind === "element")
      return `${slug}-n${n}-element-${stamp}.png`;
    if (kind === "group")
      return `${slug}-n${n}-group${opts.count ?? 0}-${stamp}.png`;
    const suffix = opts.truncated ? "page-trunc" : "page";
    return `${slug}-n${n}-${suffix}-${stamp}.png`;
  };
  var dataUrlToBlob = async (dataUrl) => {
    const r = await fetch(dataUrl);
    return r.blob();
  };
  var dataUrlToBitmap = async (dataUrl) => {
    const blob = await dataUrlToBlob(dataUrl);
    return createImageBitmap(blob);
  };
  var canvasToBlob = async (canvas) => canvas.convertToBlob({ type: "image/png" });
  var makeThumbnail = async (bitmap, maxWidth = 320) => {
    const ratio = bitmap.width <= maxWidth ? 1 : maxWidth / bitmap.width;
    const w = Math.max(1, Math.round(bitmap.width * ratio));
    const h = Math.max(1, Math.round(bitmap.height * ratio));
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunk = 32768;
    for (let i = 0;i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    return `data:image/png;base64,${btoa(binary)}`;
  };
  var tabQueues = new Map;
  var enqueue = (tabId, task) => {
    const prev = tabQueues.get(tabId) ?? Promise.resolve();
    const next = prev.then(() => task()).catch((e) => {
      console.warn(LOG, "queue task failed", e);
    });
    tabQueues.set(tabId, next);
    return next;
  };
  var tellCs = async (tabId, payload, timeoutMs = 600) => {
    return new Promise((resolve) => {
      let done = false;
      const finish = (v) => {
        if (!done) {
          done = true;
          resolve(v);
        }
      };
      setTimeout(() => finish(null), timeoutMs);
      try {
        chrome.tabs.sendMessage(tabId, pg(payload), (reply) => {
          if (chrome.runtime.lastError) {
            finish(null);
            return;
          }
          finish(reply ?? null);
        });
      } catch {
        finish(null);
      }
    });
  };
  var runInPage = async (tabId, func, args = []) => {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func,
        args
      });
      return results?.[0]?.result ?? null;
    } catch (e) {
      console.warn(LOG, "runInPage", e);
      return null;
    }
  };
  var computeAndScroll = async (tabId, selectors, padding) => {
    return runInPage(tabId, (sels, pad) => {
      const els = sels.map((s) => {
        try {
          return document.querySelector(s);
        } catch {
          return null;
        }
      }).filter((e) => Boolean(e));
      if (!els.length)
        return null;
      const rectsBefore = els.map((e) => e.getBoundingClientRect());
      const uMinX = Math.min(...rectsBefore.map((r) => r.left));
      const uMinY = Math.min(...rectsBefore.map((r) => r.top));
      const uMaxX = Math.max(...rectsBefore.map((r) => r.right));
      const uMaxY = Math.max(...rectsBefore.map((r) => r.bottom));
      const fullyVisible = uMinX >= 0 && uMinY >= 0 && uMaxX <= window.innerWidth && uMaxY <= window.innerHeight;
      if (!fullyVisible) {
        const cx = (uMinX + uMaxX) / 2 + window.scrollX;
        const cy = (uMinY + uMaxY) / 2 + window.scrollY;
        const targetX = Math.max(0, cx - window.innerWidth / 2);
        const targetY = Math.max(0, cy - window.innerHeight / 2);
        window.scrollTo({ left: targetX, top: targetY, behavior: "instant" });
      }
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
        vh: window.innerHeight
      };
    }, [selectors, padding]);
  };
  var yieldRaf = async (tabId) => {
    await runInPage(tabId, () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  };
  var restoreScroll = async (tabId, x, y) => {
    await runInPage(tabId, (sx, sy) => {
      window.scrollTo({ left: sx, top: sy, behavior: "instant" });
    }, [x, y]);
  };
  var PAGE_CHUNK_LIMIT = 8;
  var CANVAS_PIXEL_LIMIT = 16384;
  var stitchPage = async (tabId, windowId) => {
    const geom = await runInPage(tabId, () => ({
      vw: window.innerWidth,
      vh: window.innerHeight,
      sw: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
      sh: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
      dpr: window.devicePixelRatio || 1,
      sx: window.scrollX,
      sy: window.scrollY
    }));
    if (!geom)
      return null;
    const dpr = geom.dpr;
    const totalH = geom.sh;
    const totalHpx = Math.round(totalH * dpr);
    const widthPx = Math.round(geom.vw * dpr);
    let chunks = 0;
    let y = 0;
    let stitchedHpx = 0;
    let truncated = false;
    const targetHpx = Math.min(totalHpx, CANVAS_PIXEL_LIMIT);
    const canvas = new OffscreenCanvas(widthPx, targetHpx);
    const ctx = canvas.getContext("2d");
    while (y < totalH) {
      if (chunks >= PAGE_CHUNK_LIMIT) {
        truncated = true;
        break;
      }
      if (stitchedHpx >= CANVAS_PIXEL_LIMIT) {
        truncated = true;
        break;
      }
      await runInPage(tabId, (yy) => {
        window.scrollTo({ left: 0, top: yy, behavior: "instant" });
      }, [y]);
      await yieldRaf(tabId);
      let dataUrl;
      try {
        dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: "png" });
      } catch (e) {
        console.warn(LOG, "captureVisibleTab page chunk failed", e);
        break;
      }
      const bm = await dataUrlToBitmap(dataUrl);
      const remainingPx = Math.round((totalH - y) * dpr);
      const drawSrcH = Math.min(bm.height, remainingPx);
      const drawDestH = Math.min(targetHpx - stitchedHpx, drawSrcH);
      if (drawDestH <= 0) {
        truncated = true;
        break;
      }
      ctx.drawImage(bm, 0, 0, bm.width, drawDestH, 0, stitchedHpx, bm.width, drawDestH);
      stitchedHpx += drawDestH;
      chunks++;
      y += geom.vh;
      bm.close?.();
    }
    await restoreScroll(tabId, geom.sx, geom.sy);
    let outCanvas = canvas;
    if (stitchedHpx < targetHpx) {
      const trimmed = new OffscreenCanvas(widthPx, Math.max(1, stitchedHpx));
      const tctx = trimmed.getContext("2d");
      tctx.drawImage(canvas, 0, 0);
      outCanvas = trimmed;
    }
    const blob = await canvasToBlob(outCanvas);
    const bitmap = await createImageBitmap(blob);
    return { blob, bitmap, truncated };
  };
  var shotElementCommon = async (tabId, windowId, selectors, padding) => {
    const tab = await chrome.tabs.get(tabId);
    const tabUrl = tab?.url ?? "";
    await tellCs(tabId, { kind: "hide-overlays" });
    const origScroll = await runInPage(tabId, () => ({ x: window.scrollX, y: window.scrollY })) ?? { x: 0, y: 0 };
    let dataUrl;
    let bbox = null;
    try {
      bbox = await computeAndScroll(tabId, selectors, padding);
      if (!bbox)
        return null;
      await yieldRaf(tabId);
      dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: "png" });
    } catch (e) {
      console.warn(LOG, "captureVisibleTab failed", e);
      return null;
    } finally {
      await restoreScroll(tabId, origScroll.x, origScroll.y);
      await tellCs(tabId, { kind: "show-overlays" });
    }
    const bm = await dataUrlToBitmap(dataUrl);
    const sx = Math.max(0, Math.round(bbox.x * bbox.dpr));
    const sy = Math.max(0, Math.round(bbox.y * bbox.dpr));
    const sw = Math.max(1, Math.min(bm.width - sx, Math.round(bbox.w * bbox.dpr)));
    const sh = Math.max(1, Math.min(bm.height - sy, Math.round(bbox.h * bbox.dpr)));
    const canvas = new OffscreenCanvas(sw, sh);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bm, sx, sy, sw, sh, 0, 0, sw, sh);
    bm.close?.();
    const blob = await canvasToBlob(canvas);
    const bitmap = await createImageBitmap(blob);
    const cropMeta = {
      cssRect: { x: bbox.x, y: bbox.y, w: bbox.w, h: bbox.h },
      devicePxRect: { x: sx, y: sy, w: sw, h: sh },
      imageSize: { w: sw, h: sh },
      dpr: bbox.dpr,
      padding,
      selectors
    };
    return { blob, bitmap, tabUrl, cropMeta };
  };
  var shotPageCommon = async (tabId, windowId) => {
    const tab = await chrome.tabs.get(tabId);
    const tabUrl = tab?.url ?? "";
    await tellCs(tabId, { kind: "hide-overlays" });
    let stitched = null;
    try {
      stitched = await stitchPage(tabId, windowId);
    } finally {
      await tellCs(tabId, { kind: "show-overlays" });
    }
    if (!stitched)
      return null;
    return { ...stitched, tabUrl };
  };
  var isPlaywrightArtifactPath = (path) => /(?:^|[\\/])(?:playwright-artifacts|pinchgrab-dl)-[^\\/]+[\\/][0-9a-f-]{8}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{12}$/i.test(path);
  var blobToDataUrl = async (blob) => {
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunk = 32768;
    for (let i = 0;i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    const mime = blob.type || "application/octet-stream";
    return `data:${mime};base64,${btoa(binary)}`;
  };
  var QUIET_RESTORE_MS = 1500;
  var quietDepth = 0;
  var quietRestoreTimer;
  var setDownloadUi = (enabled) => {
    try {
      const api = chrome.downloads.setUiOptions;
      if (api)
        api.call(chrome.downloads, { enabled }).catch((e) => console.warn(LOG, "setUiOptions", e));
    } catch (e) {
      console.warn(LOG, "setUiOptions threw", e);
    }
  };
  var quietSavesActive = async () => {
    try {
      const store = await chrome.storage.local.get("pinchgrab.prefs.v2");
      const prefs = store["pinchgrab.prefs.v2"];
      if (!prefs?.quietSaves)
        return false;
      return await chrome.permissions.contains({ permissions: ["downloads.ui"] });
    } catch {
      return false;
    }
  };
  var beginQuiet = async () => {
    if (!await quietSavesActive())
      return false;
    quietDepth++;
    if (quietRestoreTimer) {
      clearTimeout(quietRestoreTimer);
      quietRestoreTimer = undefined;
    }
    setDownloadUi(false);
    return true;
  };
  var endQuiet = () => {
    if (quietDepth > 0)
      quietDepth--;
    if (quietDepth === 0) {
      if (quietRestoreTimer)
        clearTimeout(quietRestoreTimer);
      quietRestoreTimer = setTimeout(() => {
        quietRestoreTimer = undefined;
        setDownloadUi(true);
      }, QUIET_RESTORE_MS);
    }
  };
  chrome.permissions?.contains({ permissions: ["downloads.ui"] }).then((granted) => {
    if (granted)
      setDownloadUi(true);
  }).catch(() => {});
  var saveDownload = async (blob, workspace, filename, subdir = "screenshots") => {
    const relPath = subdir ? `${subdir}/${filename}` : filename;
    const fullPath = `pinchgrab/${workspace}/${relPath}`;
    console.log(LOG, "saveDownload start", { fullPath, mime: blob.type, size: blob.size });
    const quiet = await beginQuiet();
    try {
      return await saveDownloadInner(blob, workspace, relPath, fullPath);
    } finally {
      if (quiet)
        endQuiet();
    }
  };
  var saveDownloadInner = async (blob, workspace, relPath, fullPath) => {
    const url = await blobToDataUrl(blob);
    const downloadId = await new Promise((resolve, reject) => {
      chrome.downloads.download({ url, filename: fullPath, conflictAction: "overwrite" }, (id) => {
        if (chrome.runtime.lastError) {
          console.error(LOG, "chrome.downloads.download lastError:", chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message ?? "download failed"));
          return;
        }
        if (id == null) {
          console.error(LOG, "chrome.downloads.download returned no id");
          reject(new Error("download returned no id"));
          return;
        }
        resolve(id);
      });
    });
    console.log(LOG, "chrome.downloads.download accepted", { id: downloadId, fullPath });
    let absPath = `${workspace}/${relPath}`;
    let downloadState;
    let interruptedError = "";
    for (let attempt = 0;attempt < 100; attempt++) {
      try {
        const items = await chrome.downloads.search({ id: downloadId });
        const item = items?.[0];
        if (item?.filename)
          absPath = item.filename;
        downloadState = item?.state;
        if (item?.state === "interrupted") {
          interruptedError = `download interrupted${item.error ? `: ${item.error}` : ""}`;
          break;
        }
        if (item?.state === "complete" && item.filename)
          break;
      } catch (e) {
        console.warn(LOG, "downloads.search threw:", e);
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    if (interruptedError)
      throw new Error(interruptedError);
    if (downloadState !== "complete") {
      throw new Error(`download did not complete${downloadState ? ` (state: ${downloadState})` : ""}`);
    }
    const tempPath = isPlaywrightArtifactPath(absPath);
    const copyPath = tempPath ? `~/Downloads/${fullPath}` : absPath;
    console.log(LOG, "saveDownload returning", { relPath, absPath, copyPath, tempPath, downloadState });
    return { relPath: `${workspace}/${relPath}`, absPath, copyPath, tempPath, downloadState };
  };
  var saveTextDownload = async (text, workspace, filename, mime, subdir = "exports") => {
    const blob = new Blob([text], { type: mime });
    return saveDownload(blob, workspace, filename, subdir);
  };
  var saveBytesDownload = async (bytes, workspace, filename, mime, subdir = "exports") => {
    const blob = new Blob([bytes], { type: mime });
    return saveDownload(blob, workspace, filename, subdir);
  };
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || msg.__pg !== true)
      return false;
    if (msg.kind === "capture-screenshot") {
      (async () => {
        try {
          const tabs = msg.tabId ? [await chrome.tabs.get(msg.tabId)] : await chrome.tabs.query({ active: true, currentWindow: true });
          const tab = tabs[0];
          if (!tab?.windowId) {
            sendResponse({ error: "no active tab" });
            return;
          }
          const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
          sendResponse({ dataUrl });
        } catch (e) {
          sendResponse({ error: String(e?.message ?? e) });
        }
      })();
      return true;
    }
    if (msg.kind === "switch-to-tab") {
      (async () => {
        try {
          const tabs = await chrome.tabs.query({ url: msg.url });
          if (tabs.length && tabs[0]?.id != null) {
            await chrome.tabs.update(tabs[0].id, { active: true });
            if (tabs[0].windowId != null)
              await chrome.windows.update(tabs[0].windowId, { focused: true });
            sendResponse({ found: true });
          } else if (msg.openIfMissing) {
            const t = await chrome.tabs.create({ url: msg.url, active: true });
            sendResponse({ found: false, opened: t.id });
          } else
            sendResponse({ found: false });
        } catch (e) {
          sendResponse({ error: String(e?.message ?? e) });
        }
      })();
      return true;
    }
    if (msg.kind === "list-open-tabs") {
      (async () => {
        try {
          const tabs = await chrome.tabs.query({});
          sendResponse({ tabs: tabs.filter((t) => t.url).map((t) => ({ id: t.id, url: t.url, title: t.title })) });
        } catch (e) {
          sendResponse({ error: String(e?.message ?? e), tabs: [] });
        }
      })();
      return true;
    }
    if (msg.kind === "shot-element" || msg.kind === "shot-group" || msg.kind === "shot-page") {
      (async () => {
        try {
          const tabId = msg.tabId ?? sender.tab?.id;
          let resolvedTabId = tabId;
          let windowId;
          if (resolvedTabId == null) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            resolvedTabId = tabs[0]?.id;
            windowId = tabs[0]?.windowId;
          } else {
            const t = await chrome.tabs.get(resolvedTabId);
            windowId = t?.windowId;
          }
          if (resolvedTabId == null || windowId == null) {
            sendResponse({ ok: false, error: "no active tab" });
            return;
          }
          const tabIdFinal = resolvedTabId;
          const windowIdFinal = windowId;
          await enqueue(tabIdFinal, async () => {
            try {
              const reply = await runShot(msg, tabIdFinal, windowIdFinal);
              sendResponse(reply);
            } catch (e) {
              sendResponse({ ok: false, error: String(e?.message ?? e) });
            }
          });
        } catch (e) {
          sendResponse({ ok: false, error: String(e?.message ?? e) });
        }
      })();
      return true;
    }
    if (msg.kind === "page-snapshot-shot") {
      (async () => {
        try {
          const tabId = msg.tabId ?? sender.tab?.id;
          let resolvedTabId = tabId;
          let windowId;
          if (resolvedTabId == null) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            resolvedTabId = tabs[0]?.id;
            windowId = tabs[0]?.windowId;
          } else {
            const t = await chrome.tabs.get(resolvedTabId);
            windowId = t?.windowId;
          }
          if (resolvedTabId == null || windowId == null) {
            sendResponse({ ok: false, error: "no active tab" });
            return;
          }
          const tabIdFinal = resolvedTabId;
          const windowIdFinal = windowId;
          await enqueue(tabIdFinal, async () => {
            try {
              const got = await shotPageCommon(tabIdFinal, windowIdFinal);
              if (!got) {
                sendResponse({ ok: false, error: "capture failed" });
                return;
              }
              const screenshot = await blobToFullDataUrl(got.blob);
              got.bitmap.close?.();
              sendResponse({ ok: true, screenshot, partial: got.truncated });
            } catch (e) {
              sendResponse({ ok: false, error: String(e?.message ?? e) });
            }
          });
        } catch (e) {
          sendResponse({ ok: false, error: String(e?.message ?? e) });
        }
      })();
      return true;
    }
    if (msg.kind === "pg-reinject") {
      (async () => {
        try {
          let tabId = msg.tabId;
          if (tabId == null) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            tabId = tabs[0]?.id;
          }
          if (tabId == null) {
            sendResponse({ ok: false, error: "no active tab" });
            return;
          }
          const tab = await chrome.tabs.get(tabId);
          if (tab.url && !/^https?:/.test(tab.url)) {
            sendResponse({ ok: false, error: `cannot attach to ${tab.url}` });
            return;
          }
          await chrome.scripting.executeScript({ target: { tabId, allFrames: false }, files: ["content-script.js"], injectImmediately: true });
          await trackActiveTab(tabId);
          sendResponse({ ok: true, tabId });
        } catch (e) {
          sendResponse({ ok: false, error: String(e?.message ?? e) });
        }
      })();
      return true;
    }
    if (msg.kind === "save-text" || msg.kind === "save-bytes") {
      (async () => {
        try {
          let stored;
          const workspace = String(msg.workspace ?? "default");
          const filename = String(msg.filename ?? "export.bin");
          const mime = String(msg.mime ?? "application/octet-stream");
          const subdir = String(msg.subdir ?? "exports");
          if (msg.kind === "save-text") {
            stored = await saveTextDownload(String(msg.text ?? ""), workspace, filename, mime, subdir);
          } else {
            const raw = msg.bytes;
            let bytes;
            if (raw instanceof Uint8Array)
              bytes = raw;
            else if (Array.isArray(raw))
              bytes = Uint8Array.from(raw);
            else if (raw && typeof raw === "object") {
              const vals = Object.values(raw);
              bytes = Uint8Array.from(vals);
            } else
              bytes = new Uint8Array;
            console.log(LOG, "save-bytes decoded", { bytes: bytes.length, rawType: typeof raw, isArray: Array.isArray(raw), isU8: raw instanceof Uint8Array });
            stored = await saveBytesDownload(bytes, workspace, filename, mime, subdir);
          }
          sendResponse({
            ok: true,
            filename: stored.relPath,
            absPath: stored.absPath,
            copyPath: stored.copyPath,
            tempPath: stored.tempPath,
            downloadState: stored.downloadState
          });
        } catch (e) {
          sendResponse({ ok: false, error: String(e?.message ?? e) });
        }
      })();
      return true;
    }
    if ((msg.kind === "capture" || msg.kind === "pending-add") && sender.tab?.id != null) {
      chrome.sidePanel.open({ tabId: sender.tab.id }).catch(() => {});
      replayFirstCapture(msg);
    }
    return false;
  });
  var REPLAY_DELAYS_MS = [60, 180, 450];
  var replayFirstCapture = (envelope) => {
    for (const delay of REPLAY_DELAYS_MS) {
      setTimeout(() => {
        try {
          chrome.runtime.sendMessage(envelope).catch?.(() => {});
        } catch {}
      }, delay);
    }
  };
  var blobToFullDataUrl = async (blob) => {
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunk = 32768;
    for (let i = 0;i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    return `data:image/png;base64,${btoa(binary)}`;
  };
  var runShot = async (msg, tabId, windowId) => {
    const ts = new Date().toISOString();
    const padding = typeof msg.padding === "number" ? msg.padding : 24;
    if (msg.kind === "shot-element") {
      const got2 = await shotElementCommon(tabId, windowId, [msg.selector], padding);
      if (!got2)
        return { ok: false, error: "capture failed" };
      const filename2 = buildFilename("element", ts, msg.n, got2.tabUrl);
      const stored2 = await saveDownload(got2.blob, msg.workspace, filename2);
      const dataUrl2 = await makeThumbnail(got2.bitmap);
      const fullDataUrl2 = await blobToFullDataUrl(got2.blob);
      got2.bitmap.close?.();
      return {
        ok: true,
        filename: stored2.relPath,
        absPath: stored2.absPath,
        copyPath: stored2.copyPath,
        tempPath: stored2.tempPath,
        downloadState: stored2.downloadState,
        dataUrl: dataUrl2,
        fullDataUrl: fullDataUrl2,
        crop: got2.cropMeta
      };
    }
    if (msg.kind === "shot-group") {
      const got2 = await shotElementCommon(tabId, windowId, msg.selectors, padding);
      if (!got2)
        return { ok: false, error: "capture failed" };
      const filename2 = buildFilename("group", ts, msg.n, got2.tabUrl, { count: msg.selectors.length });
      const stored2 = await saveDownload(got2.blob, msg.workspace, filename2);
      const dataUrl2 = await makeThumbnail(got2.bitmap);
      const fullDataUrl2 = await blobToFullDataUrl(got2.blob);
      got2.bitmap.close?.();
      return {
        ok: true,
        filename: stored2.relPath,
        absPath: stored2.absPath,
        copyPath: stored2.copyPath,
        tempPath: stored2.tempPath,
        downloadState: stored2.downloadState,
        dataUrl: dataUrl2,
        fullDataUrl: fullDataUrl2,
        crop: got2.cropMeta
      };
    }
    const got = await shotPageCommon(tabId, windowId);
    if (!got)
      return { ok: false, error: "capture failed" };
    const filename = buildFilename("page", ts, msg.n, got.tabUrl, { truncated: got.truncated });
    const stored = await saveDownload(got.blob, msg.workspace, filename);
    const dataUrl = await makeThumbnail(got.bitmap);
    const fullDataUrl = await blobToFullDataUrl(got.blob);
    got.bitmap.close?.();
    return {
      ok: true,
      filename: stored.relPath,
      absPath: stored.absPath,
      copyPath: stored.copyPath,
      tempPath: stored.tempPath,
      downloadState: stored.downloadState,
      dataUrl,
      fullDataUrl,
      truncated: got.truncated
    };
  };
})();

//# debugId=404E584C31DF399F64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9iYWNrZ3JvdW5kLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIFNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2wgYmV0d2VlbiBjb250ZW50IHNjcmlwdCwgc2lkZSBwYW5lbCwgYW5kXG4vLyBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyLlxuXG5leHBvcnQgdHlwZSBSZWN0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG5leHBvcnQgdHlwZSBWaWV3cG9ydCA9IHtcbiAgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyO1xuICAvLyBVc2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgYXQgY2FwdHVyZSB0aW1lLiBMZXRzIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhc29uIGFib3V0IHdoeSBjYXB0dXJlZCBhcHBlYXJhbmNlIGRpZmZlcnMgYmV0d2VlbiBzZXNzaW9uc1xuICAvLyAoZS5nLiBkYXJrLW1vZGUgdnMgbGlnaHQtbW9kZSBvZiB0aGUgc2FtZSBjb21wb25lbnQpLlxuICBjb2xvclNjaGVtZT86ICdkYXJrJyB8ICdsaWdodCc7XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICAvLyBEb2N1bWVudCBkaXJlY3Rpb24gKGBsdHJgIC8gYHJ0bGApIOKAlCBkaWZmZXJlbnQgZnJvbSB2aWV3cG9ydCBzaXplLFxuICAvLyBjaGFuZ2VzIHRoZSBtZWFuaW5nIG9mIGBzdGFydGAvYGVuZGAgaW4gQ1NTIGFuZCB0aGUgc2Vuc2Ugb2ZcbiAgLy8gYHJlY3QueGAuIENhcHR1cmVkIHBlciBwYWdlIGhlYWRlciBzbyBSVEwgY2FwdHVyZXMgZG9uJ3QgZ2V0XG4gIC8vIHNpbGVudGx5IG1peGVkIHdpdGggTFRSIG9uZXMuXG4gIGRpcmVjdGlvbj86ICdsdHInIHwgJ3J0bCc7XG4gIC8vIEJyb3dzZXIgem9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCByZXBvcnRzIHRoZSBwaW5jaC16b29tXG4gIC8vIGZhY3RvcjsgdmFsdWVzICE9IDEgbWVhbiB0aGUgdXNlciBoYXMgem9vbWVkIGluL291dCBhbmQgYW55IGxheW91dFxuICAvLyBidWcgdGhleSdyZSBjYXB0dXJpbmcgbWF5IG5vdCByZXBybyBhdCBkZWZhdWx0IHpvb20uXG4gIHpvb20/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGcmFtZXdvcmtJbmZvID0ge1xuICBmcmFtZXdvcms6ICdyZWFjdCcgfCAndnVlJyB8ICdsaXQnIHwgJ3N0ZW5jaWwnIHwgJ3N2ZWx0ZScgfCAnd2ViLWNvbXBvbmVudCc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuICBzb3VyY2U/OiB7ZmlsZT86IHN0cmluZyB8IG51bGw7IGxpbmU/OiBudW1iZXIgfCBudWxsfTtcbiAgLy8gVXAtdHJlZSBjb21wb25lbnQgYW5jZXN0cnkgKGlubmVybW9zdCBmaXJzdCkuIEZvciBSZWFjdCwgd2Fsa2VkIHZpYVxuICAvLyBmaWJlciBgcmV0dXJuYCBjaGFpbjsgZm9yIFZ1ZSwgdmlhIGBfX3Z1ZVBhcmVudENvbXBvbmVudC5wYXJlbnRgLlxuICAvLyBUaGUgY29tcG9uZW50IG5hbWUgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoaWNoIGZpbGUgb3ducyB0aGVcbiAgLy8gcmVuZGVyaW5nIOKAlCB0aGUgY2hhaW4gaGVscHMgaXQgZ3JlcCB1cHdhcmQgdG8gZmluZCB0aGUgcm91dGVcbiAgLy8gY29tcG9uZW50LCB0aGVuIGRyaWxsIGludG8gdGhlIG93bmluZyBmaWxlLlxuICBjaGFpbj86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5jZXN0b3IgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBNYXRjaGVkUnVsZSA9IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgZGVjbGFyYXRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWVkaWE/OiBzdHJpbmc7XG4gIC8vIFdhcyB0aGUgQG1lZGlhIHF1ZXJ5IHRoYXQgd3JhcHMgdGhpcyBydWxlIGFjdHVhbGx5IG1hdGNoZWQgYXRcbiAgLy8gY2FwdHVyZSB0aW1lPyBgdHJ1ZWAgPSBhY3RpdmUsXG4gIC8vIGBmYWxzZWAgPSBtYXRjaGVkIHRoZSBzZWxlY3RvciBidXQgaW5hY3RpdmUgKGUuZy4gbW9iaWxlIHJ1bGVzXG4gIC8vIGNhcHR1cmVkIG9uIGEgZGVza3RvcCB2aWV3cG9ydCksIGB1bmRlZmluZWRgID0gbWF0Y2hNZWRpYSB0aHJldy5cbiAgbWVkaWFBY3RpdmU/OiBib29sZWFuO1xufTtcblxuLy8gU3ludGhldGljIGhpbnRzIFBpbmNoR3JhYiBhZGRzIHRvIGVudHJpZXMg4oCUIGtlcHQgZGlzdGluY3QgZnJvbSBgYXR0cnNgXG4vLyAocmVhbCBET00gYXR0cmlidXRlcykgc28gY29uc3VtZXJzIGNhbiB0ZWxsIHdoYXQgY2FtZSBmcm9tIHRoZSBwYWdlIHZzXG4vLyB3aGF0IHRoZSBjYXB0dXJlIHBpcGVsaW5lIGluamVjdGVkLlxuZXhwb3J0IHR5cGUgRW50cnlIaW50cyA9IHtcbiAgZm9ybWF0Pzogc3RyaW5nOyAgICAgLy8gaW5wdXQgZm9ybWF0IGhpbnQgKGUuZy4gJ1lZWVktTU0tREQnKVxuICB2YWx1ZU1hc2tlZD86IGJvb2xlYW47IC8vIHBhc3N3b3JkIHZhbHVlIHdhcyBtYXNrZWQgYXQgY2FwdHVyZSB0aW1lXG59O1xuXG5leHBvcnQgdHlwZSBFbnRyeSA9IHtcbiAgLy8gU3RhYmxlIHBlci1lbnRyeSB1dWlkLiBHZW5lcmF0ZWQgYXQgY2FwdHVyZSB0aW1lLiBEaXN0aW5jdCBmcm9tIGBuYFxuICAvLyAoZGlzcGxheSBzZXF1ZW5jZSkgYW5kIGZyb20gYGlkYCAoRE9NIGh0bWwgaWQgYXR0cmlidXRlKS4gRm9yZWlnbi1rZXlcbiAgLy8gdGFyZ2V0IGZvciBGZWVkYmFja01lc3NhZ2UucGFyZW50SWQuXG4gIHVpZDogc3RyaW5nO1xuICAvLyBGb3JlaWduIGtleSBpbnRvIHRoZSBzZXNzaW9uIHJvdyAoUGFnZU1lc3NhZ2Uuc2Vzc2lvbklkKS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIGxpbmsgY2FwdHVyZXMgYmFjayB0byBcIndoaWNoIHBhZ2UtbG9hZCBjb250ZXh0IGRpZCB0aGV5XG4gIC8vIGNvbWUgZnJvbT9cIiB3aXRob3V0IGRlcGVuZGluZyBvbiBVUkwgc3RyaW5nIGVxdWFsaXR5LCB3aGljaCBicmVha3NcbiAgLy8gb24gaGFzaCBuYXZpZ2F0aW9uLCBxdWVyeS1wYXJhbSBzd2FwcywgYW5kIFNQQSByb3V0aW5nLiBTZXQgYnkgdGhlXG4gIC8vIHNpZGUgcGFuZWwgYXQgbWVzc2FnZS1yZWNlaXZlIHRpbWUsIG5vdCBvbiB0aGUgcGFnZSBzaWRlLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG4gIG46IG51bWJlcjtcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBvdXRlckhUTUw/OiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIC8vIFRoZSB2aXN1YWxseS1yZW5kZXJlZCBmb3JtIHdoZW4gQ1NTIGB0ZXh0LXRyYW5zZm9ybWAgaXMgc2V0LiBDYXB0dXJlZFxuICAvLyBhbG9uZ3NpZGUgYHRleHRgICh3aGljaCBpcyB0aGUgc291cmNlLXRydXRoIGB0ZXh0Q29udGVudGApIHNvIGFuIExMTVxuICAvLyBjYW4gZGlzYW1iaWd1YXRlIGJldHdlZW4gZS5nLiBzb3VyY2UgYFJlZnJlc2hgIGFuZCByZW5kZXJlZCBgUkVGUkVTSGBcbiAgLy8gd2l0aG91dCBmYWxzZS1ncmVwcGluZyBhZ2FpbnN0IGVpdGhlci5cbiAgcmVuZGVyZWRUZXh0Pzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICBhY2Nlc3NpYmxlTmFtZT86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7ICAgICAgICAgICAgLy8gdGhlIERPTSBodG1sIGlkIGF0dHJpYnV0ZSAodW5jaGFuZ2VkKVxuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbiAgYXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyByZWFsIERPTSBhdHRyaWJ1dGVzIG9ubHlcbiAgaGludHM/OiBFbnRyeUhpbnRzOyAgICAgLy8gc3ludGhldGljIGNhcHR1cmUtdGltZSBoaW50c1xuICByZWN0OiBSZWN0O1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIGluU2hhZG93RE9NPzogYm9vbGVhbjtcbiAgLy8gQ1NTIHNlbGVjdG9yIGZvciB0aGUgc2hhZG93IGhvc3Qgd2hlbiBgaW5TaGFkb3dET01gIGlzIHRydWUuIExldHMgYVxuICAvLyBjb25zdW1lciAob3IgdGhlIHBhbmVsJ3MgcmUtdmFsaWRhdGlvbiBwYXNzKSBmaW5kIHRoZSBob3N0IGVsZW1lbnRcbiAgLy8gc2luY2UgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyByb290cy5cbiAgc2hhZG93SG9zdD86IHN0cmluZztcbiAgY29tcG9uZW50Um9vdD86IHN0cmluZztcbiAgYW5jZXN0b3JzPzogQW5jZXN0b3JbXTtcbiAgY29tcG9uZW50PzogRnJhbWV3b3JrSW5mbztcbiAgLy8gUmVhY3QgZXZlbnQgaGFuZGxlciBuYW1lcyBwcm9iZWQgZnJvbSBgX19yZWFjdFByb3BzJDxrZXk+YCDigJQgYW5zd2Vyc1xuICAvLyBcIndoaWNoIGhhbmRsZXIgZmlyZXMgd2hlbiB0aGlzIGlzIGNsaWNrZWQ/XCIgd2l0aG91dCBhbiBMTE0gaGF2aW5nIHRvXG4gIC8vIGdyZXAgdGhlIGNvZGViYXNlLiBJbiBkZXYgYnVpbGRzIHRoZXNlIGFyZSByZWFsIGZ1bmN0aW9uIG5hbWVzOyBpblxuICAvLyBwcm9kIHRoZXkncmUgbWluaWZpZWQgYnV0IHN0aWxsIGFuY2hvci1hYmxlLlxuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBodG14IC8gU3RpbXVsdXMgLyBBbHBpbmUgLyBUdXJibyB3aXJpbmcgb24gdGhlIGVsZW1lbnQuIFNlcnZlci1cbiAgLy8gcmVuZGVyZWQgYXBwcyBkb24ndCBoYXZlIFJlYWN0IGZpYmVycyDigJQgZm9yIHRoZW0sIHRoaXMgSVMgdGhlXG4gIC8vIGNvbXBvbmVudCBzaGFwZS5cbiAgYmVoYXZpb3JBdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIFRydWUgd2hlbiBgZWwuZ2V0QW5pbWF0aW9ucygpYCByZXBvcnRlZCBhbiBhY3RpdmVseS1wbGF5aW5nXG4gIC8vIGFuaW1hdGlvbiBhdCBjYXB0dXJlIHRpbWUuIFRlbGxzIHRoZSBjb25zdW1lciB0aGF0IGNhcHR1cmVkIHJlY3QgL1xuICAvLyB0cmFuc2Zvcm0gLyBvcGFjaXR5IG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZS5cbiAgaXNBbmltYXRpbmc/OiBib29sZWFuO1xuICAvLyBGb3IgZWxlbWVudHMgcmVuZGVyZWQgaW50byBhIGA8Y2FudmFzPmAsIHRoZSBET00gZ2l2ZXMgdXMgZXNzZW50aWFsbHlcbiAgLy8gbm90aGluZyBhYm91dCB3aGF0IHdhcyBjbGlja2VkIOKAlCB0aGUgY2FudmFzIGhhcyBubyBjaGlsZHJlbiwgbm9cbiAgLy8gdGV4dCwgbm8gbWVhbmluZ2Z1bCBzZWxlY3RvcnMgYmVsb3cgdGhlIGNhbnZhcyBpdHNlbGYuIENhcHR1cmUgdGhlXG4gIC8vIGNsaWNrIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMncyBib3VuZGluZyBib3ggc28gYSBkb3duc3RyZWFtXG4gIC8vIGNvbnN1bWVyIGNhbiBjb3JyZWxhdGUgKGUuZy4gYWdhaW5zdCBhIERhdGFkb2cgLyBUYWJsZWF1IC8gY2hhcnRpbmdcbiAgLy8gbGlicmFyeSB0aGF0IGV4cG9zZXMgZGF0YS1wb2ludCBjb29yZGluYXRlcykuIENvb3JkaW5hdGVzIGFyZSBDU1NcbiAgLy8gcGl4ZWxzOyBtdWx0aXBseSBieSBgdmlld3BvcnQuZHByYCB0byBnZXQgZGV2aWNlIHBpeGVscy5cbiAgY2FudmFzQ2xpY2s/OiB7XG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIG9mZnNldFk6IG51bWJlcjtcbiAgICBjYW52YXNXOiBudW1iZXI7XG4gICAgY2FudmFzSDogbnVtYmVyO1xuICAgIGNhbnZhc1NlbGVjdG9yOiBzdHJpbmc7XG4gIH07XG4gIC8vIENvbnRlbnRlZGl0YWJsZSByaWNoLXRleHQgZWRpdG9yIGNvbnRleHQuIFBvcHVsYXRlZCB3aGVuIHRoZSBjYXB0dXJlZFxuICAvLyBub2RlIGlzLCBvciBsaXZlcyBpbnNpZGUsIGEgYFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1gIGFuY2VzdG9yLiBMZXRzXG4gIC8vIGFuIExMTSByZWFzb25pbmcgYWJvdXQgYSBcImNvcHkgaXMgd3JvbmdcIiAvIFwidGhlIGVkaXRvciBicmVha3Mgd2hlbiBYXCJcbiAgLy8gY2FwdHVyZSBrbm93IHdoaWNoIGVkaXRvciBsaWJyYXJ5IHRvIGxvb2sgYXQg4oCUIHNlbGVjdG9ycyBnZW5lcmF0ZWRcbiAgLy8gYnkgUHJvc2VNaXJyb3IgLyBMZXhpY2FsIC8gZXRjIGFyZSBydW50aW1lLWludGVybmFsIGFuZCB3b24ndCBncmVwXG4gIC8vIGFnYWluc3QgdXNlciBjb2RlLCBidXQgdGhlIExJQlJBUlkgcG9pbnRlciByb3V0ZXMgdGhlIExMTSB0byB0aGVcbiAgLy8gcmlnaHQgd3JhcHBlciBjb21wb25lbnQuXG4gIGVkaXRvcj86IHtcbiAgICBraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnO1xuICAgIHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbiAgfTtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBCRUZPUkUgdGhlIGNsaWNrLiBSZXBybyBjb250ZXh0IGZvciBidWdzIGxpa2VcbiAgLy8gXCJJIGNsaWNrZWQgdGhlIHdyb25nIGRyb3Bkb3duIG9wdGlvblwiIG9yIFwidGhlIHZhbHVlIGZsaWNrZXJlZCBiZWZvcmVcbiAgLy8gSSBjbGlja2VkIGl0XCIg4oCUIHdpdGhvdXQgdGhpcywgdGhlIEpTT04gc25hcHNob3RzIG9ubHkgdGhlIHBvc3QtXG4gIC8vIG11dGF0aW9uIHN0YXRlLCBsZWF2aW5nIHRoZSBMTE0gYmxpbmQgdG8gd2hhdCB0cmlnZ2VyZWQgdGhlXG4gIC8vIGFwcGVhcmFuY2UgdGhlIHVzZXIgY29tcGxhaW5lZCBhYm91dC4gUGluY2hncmFiIGtlZXBzIGFuIDgtc2Vjb25kXG4gIC8vIHJpbmcgYnVmZmVyIG9mIG11dGF0aW9uIHJlY29yZHM7IGNhcHR1cmUgYXR0YWNoZXMgdGhlIG1vc3QgcmVjZW50XG4gIC8vIDMgYXMgYSBzbmFwc2hvdC5cbiAgZG9tTXV0YXRpb25zPzogRG9tTXV0YXRpb25bXTtcbiAgc3RhdGVzPzogc3RyaW5nW107ICAgICAgLy8gYWN0aXZlIHBzZXVkby1jbGFzc2VzICh3YXMgUmVjb3JkPHN0cmluZywgdHJ1ZT4gaW4gdjEpXG4gIC8vIExvY2F0b3IgcXVhbGl0eTogaG93IG1hbnkgZWxlbWVudHMgYHNlbGVjdG9yYCByZXNvbHZlcyB0byBpbiBpdHNcbiAgLy8gc2NvcGUgKDEgPSB1bmlxdWUpLiBIaWdoZXIgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91cy5cbiAgc2VsZWN0b3JNYXRjaENvdW50PzogbnVtYmVyO1xuICAvLyBEaXNhbWJpZ3VhdGVkIG9yZGVyaW5nIGZpZWxkcy5cbiAgLy8gYG5gIGlzIHByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdCAoaXQncyB0aGUgY2FwdHVyZS1zZXF1ZW5jZVxuICAvLyBkaXNwbGF5IGxhYmVsIGluIHRoZSBzaWRlYmFyKS4gVGhlIG5ldyBmaWVsZHMgYXJlIGVtaXQtdGltZSBvbmx5OlxuICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHNhbWUgYXMgYG5gIChjYXB0dXJlIHNlcXVlbmNlIHdpdGhpbiBzZXNzaW9uKVxuICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgcmFuayB3aXRoaW4gdGhlIHBhZ2VcbiAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCBodW1hbi1mYWNpbmcgbGFiZWwgKG1pcnJvcnMgYG5gIHRvZGF5KVxuICBjYXB0dXJlSW5kZXg/OiBudW1iZXI7XG4gIGV2ZW50SW5kZXg/OiBudW1iZXI7XG4gIHZpc3VhbE9yZGVyPzogbnVtYmVyO1xuICBkaXNwbGF5TGFiZWw/OiBzdHJpbmc7XG4gIC8vIEdyb3VwIGZsYXR0ZW5pbmcgZmllbGRzLlxuICAvLyBUaGUgZ3JvdXAgaGVhZCBjYXJyaWVzIGBncm91cE1lbWJlclVpZHNgIChqdXN0IHRoZSBJRHMpOyBlYWNoXG4gIC8vIG1lbWJlciBlbWl0cyBhcyBpdHMgb3duIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nXG4gIC8vIGJhY2sgYXQgdGhlIGhlYWQuXG4gIGdyb3VwTWVtYmVyVWlkcz86IHN0cmluZ1tdO1xuICBncm91cFVpZD86IHN0cmluZztcbiAgLy8gTGlnaHR3ZWlnaHQgYTExeSBhdWRpdCBjYXB0dXJlZCBhdCBjbGljayB0aW1lLiBIZWF2aWVyIGNoZWNrc1xuICAvLyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90cywgYXhlIHZpb2xhdGlvbnMpIGFyZSBub3QgeWV0IHdpcmVkLlxuICBhMTF5Pzoge1xuICAgIGNvbnRyYXN0UmF0aW8/OiBudW1iZXI7XG4gICAgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7XG4gICAgdGFiYmFibGU/OiBib29sZWFuO1xuICAgIGZvY3VzVmlzaWJsZT86IGJvb2xlYW47XG4gIH07XG4gIC8vIFBhcmVudCBsYXlvdXQgY29udGV4dCDigJQgZmxleC9ncmlkL292ZXJmbG93L3Njcm9sbC9zdGFja2luZ1xuICAvLyBhbmNlc3RvcnMgdGhhdCBzaGFwZSB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGFwcGVhcmFuY2UuXG4gIGxheW91dENvbnRleHQ/OiBBcnJheTx7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgZGlzcGxheT86IHN0cmluZztcbiAgICBwb3NpdGlvbj86IHN0cmluZztcbiAgICBvdmVyZmxvdz86IHN0cmluZztcbiAgICB6SW5kZXg/OiBzdHJpbmc7XG4gICAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICAgIHdpbGxDaGFuZ2U/OiBzdHJpbmc7XG4gICAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICAgIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gICAgc2Nyb2xsVG9wPzogbnVtYmVyO1xuICAgIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICB9PjtcbiAgLy8gQXNzZXQgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIGNhcHR1cmVkIHN1YnRyZWUgKGltZyBzcmMsIDx1c2UgaHJlZj4sXG4gIC8vIGJhY2tncm91bmQtaW1hZ2UgdXJsKS4gV2hlbiBhIGNvbXBsYWludCBpcyBhYm91dCBhIGxvZ28gLyBpY29uIC9cbiAgLy8gYXJ0d29yaywgYW4gYWdlbnQgd2l0aG91dCB0aGVzZSByZWZlcmVuY2VzIHdvdWxkIGJlIGxlZnQgZ3Vlc3NpbmcuXG4gIGFzc2V0cz86IEFycmF5PHtcbiAgICBzcmM6IHN0cmluZztcbiAgICBuYXR1cmFsVz86IG51bWJlcjsgbmF0dXJhbEg/OiBudW1iZXI7XG4gICAgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7XG4gICAgYWx0Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gIH0+O1xuICBzdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtYXRjaGVkUnVsZXM/OiBNYXRjaGVkUnVsZVtdO1xuICBwc2V1ZG9FbGVtZW50cz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICAvLyBUcnVuY2F0aW9uIG1hcmtlcnMg4oCUIHByZXNlbnQgd2hlbiBjYXB0dXJlIGhhZCB0byBlbGlkZSBjb250ZW50LiBMZXRzXG4gIC8vIGEgY29uc3VtZXIgZGV0ZWN0IFwidGhpcyBlbnRyeSB3YXMgY3V0IGRvd25cIiBhbmQgcmVmZXRjaCBmcm9tIHRoZVxuICAvLyBsaXZlIHBhZ2UgaWYgaXQgbmVlZHMgdGhlIGZ1bGwgdmVyc2lvbi5cbiAgLy8gICBvdXRlckhUTUwg4oCUIG9yaWdpbmFsIGh0bWwgbGVuZ3RoIGJlZm9yZSB0aGUgc2l6ZS1jYXAga2lja2VkIGluLlxuICAvLyAgIGNoaWxkcmVuICDigJQgbnVtYmVyIG9mIGRlc2NlbmRhbnQgc3VidHJlZXMgcmVwbGFjZWQgYnkgZGVwdGgtY2FwXG4gIC8vICAgICAgICAgICAgICAgZWxpc2lvbiBtYXJrZXJzIChgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gKS5cbiAgdHJ1bmNhdGVkPzoge291dGVySFRNTD86IG51bWJlcjsgY2hpbGRyZW4/OiBudW1iZXI7IHRleHQ/OiBudW1iZXJ9O1xuICAvLyBHcm91cCBvZiBhZGRpdGlvbmFsIGNhcHR1cmVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudHJ5IChBbHQrU2hpZnQrQ2xpY2tcbiAgLy8gLyBBbHQrZHJhZyBzZWxlY3Rpb25zIGNvbGxhcHNlIGhlcmUpLlxuICBncm91cD86IEVudHJ5W107XG4gIC8vIE9wdGlvbmFsIHNjcmVlbnNob3QgYnVuZGxlOiBlYWNoIGZpZWxkIGlzIGEgcmVsYXRpdmUgcGF0aCB1bmRlciB0aGVcbiAgLy8gdXNlcidzIERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+LyByb290LiBUaGUgY2FwdHVyZWRBdCBzdGFtcCBpc1xuICAvLyB0aGUgSVNPIHRpbWVzdGFtcCB3aGVuIHRoZSBzaG90IHdhcyB0YWtlbi5cbiAgc2NyZWVuc2hvdD86IHtcbiAgICBlbGVtZW50Pzogc3RyaW5nO1xuICAgIGdyb3VwPzogc3RyaW5nO1xuICAgIHBhZ2U/OiBzdHJpbmc7XG4gICAgY2FwdHVyZWRBdD86IHN0cmluZztcbiAgICAvLyBBbiBlbXB0eSBgc2NyZWVuc2hvdGAgZmllbGQgY291bGQgbWVhbiBcIm5vdCB5ZXQgc2hvdFwiLCBcImZhaWxlZFwiLFxuICAgIC8vIG9yIFwic2tpcHBlZCBvbiBwdXJwb3NlXCIuIFdoZW4gdGhlIHBpcGVsaW5lIGRlY2xpbmVzIG9yIGZhaWxzLFxuICAgIC8vIHNldCB0aGlzIHNvIHJlY2VpdmVycyBrbm93IGl0J3Mgbm90IGEgcmV0cnkgY2FuZGlkYXRlLlxuICAgIHVuYXZhaWxhYmxlUmVhc29uPzogJ2F1dG9TY3JlZW5zaG90T2ZmJyB8ICdza2lwU2NyZWVuc2hvdEhvc3RzJyB8ICdjYXB0dXJlRmFpbGVkJyB8ICdwZXJtaXNzaW9uRGVuaWVkJyB8IHN0cmluZztcbiAgICAvLyBDcm9wIG1ldGFkYXRhIGRlc2NyaWJpbmcgd2hlcmUgdGhlIGNyb3BwZWQgUE5HIGZpdHMgaW4gdGhlXG4gICAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICBjcm9wPzoge1xuICAgICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZHByOiBudW1iZXI7XG4gICAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59O1xuXG4vLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIHBhZ2UgbWV0YWRhdGEsIGVtaXR0ZWQgb25jZSBwZXIgZGlzdGluY3QgcGFnZSBVUkxcbi8vIGludm9sdmVkIGluIGNhcHR1cmVzIChkZWR1cGVkIGJ5IFVSTCkuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTC5cbi8vIGBwYXJ0aWFsYCBpcyBzZXQgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCBjb3VsZCBiZSBjYXB0dXJlZCAoZnVsbC1wYWdlIHN0aXRjaFxuLy8gdW5hdmFpbGFibGUpIOKAlCBzZWUgYmFja2dyb3VuZC50cyBzdGl0Y2hQYWdlIGxpbWl0YXRpb25zLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90ID0geyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZzsgY2FwdHVyZWRBdDogc3RyaW5nOyB2aWV3cG9ydDoge3dpZHRoOiBudW1iZXI7aGVpZ2h0OiBudW1iZXJ9OyBzY3JvbGxXaWR0aDogbnVtYmVyOyBzY3JvbGxIZWlnaHQ6IG51bWJlcjsgZGV2aWNlUGl4ZWxSYXRpbzogbnVtYmVyOyBsYW5nOiBzdHJpbmc7IHNjcmVlbnNob3Q6IHN0cmluZzsgcGFydGlhbD86IGJvb2xlYW4gfTtcblxuZXhwb3J0IHR5cGUgRG9tTXV0YXRpb24gPSB7XG4gIHR5cGU6ICdjaGlsZExpc3QnIHwgJ2F0dHJpYnV0ZXMnIHwgJ2NoYXJhY3RlckRhdGEnO1xuICB0czogc3RyaW5nOyAgICAgICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBtdXRhdGlvbiBmaXJlZFxuICB0YXJnZXQ6IHN0cmluZzsgICAgICAgIC8vIGNvbXBhY3QgZGVzY3JpcHRvciBvZiB0aGUgbXV0YXRpb24ncyB0YXJnZXQgKGB0YWcjaWQuY2xzYClcbiAgYXR0cmlidXRlTmFtZT86IHN0cmluZztcbiAgb2xkVmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBuZXdWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIGFkZGVkPzogbnVtYmVyOyAgICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiBhZGRlZCBub2Rlc1xuICByZW1vdmVkPzogbnVtYmVyOyAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgcmVtb3ZlZCBub2Rlc1xuICBzdW1tYXJ5Pzogc3RyaW5nOyAgICAgIC8vIG9uZS1saW5lIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uXG59O1xuXG5leHBvcnQgdHlwZSBQYWdlQ29udGV4dCA9IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgdG9rZW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBCcm93c2VyICsgbG9jYWxlIGZpbmdlcnByaW50IGZvciBzZXNzaW9uLWxldmVsIGNvbnRleHQuIExldHMgYVxuICAvLyBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJyb3dzZXIgcHJvZHVjZWQgdGhpcyBjYXB0dXJlP1wiIG9yXG4gIC8vIFwid2FzIHRoZSBjYXB0dXJlZCBhcHAgcmVuZGVyZWQgaW4gYW4gUlRMIGxvY2FsZT9cIiB3aXRob3V0IHJlcnVubmluZy5cbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICAvLyBHaXQgYnVpbGQgaWRlbnRpdHksIHdoZW4gdGhlIGNhcHR1cmVkIGFwcCBleHBvc2VzXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW5cIj5gLlxuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFdoYXRldmVyIGVsZW1lbnQgaGFkIGZvY3VzIGF0IGNhcHR1cmUgdGltZSwgcGx1cyBhIGhpbnQgYXMgdG9cbiAgLy8gd2hldGhlciB0aGUgdXNlciBuYXZpZ2F0ZWQgdGhlcmUgd2l0aCB0aGUga2V5Ym9hcmQgKFRhYiAvIFNoaWZ0K1RhYlxuICAvLyBwcmVzc2VkIGluIHRoZSBsYXN0IHNlY29uZCkuIFVzZWZ1bCBmb3IgYWNjZXNzaWJpbGl0eS1idWcgY2FwdHVyZXM6XG4gIC8vIFwidGhpcyBlbGVtZW50IGxvb2tzIHdyb25nIG9ubHkgd2hlbiBrZXlib2FyZC1mb2N1c2VkXCIuXG4gIGFjdGl2ZUZvY3VzPzoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59O1xufTtcblxuLy8gLS0tLS0tLS0tLSBTaWRlLXBhbmVsIFwibWVzc2FnZXNcIiAoVUkgcm93cykgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBTZWxlY3Rvck1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdzZWxlY3Rvcic7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIGVudHJ5OiBFbnRyeTtcbiAgcGlubmVkPzogYm9vbGVhbjtcbiAgLy8gTGVnYWN5IGZpZWxkIGtlcHQgYXJvdW5kIGJlY2F1c2Ugb2xkIHdvcmtzcGFjZXMgbWF5IHN0aWxsIGhhdmUgaXQ7IHdlXG4gIC8vIHN0cmlwIGl0IG9uIGNhcHR1cmUsIGJ1dCBkb24ndCByZWplY3QgaXQgb24gaW1wb3J0LlxuICBkdXBlUGVuZGluZz86IHVua25vd247XG59O1xuXG5leHBvcnQgdHlwZSBGZWVkYmFja01lc3NhZ2UgPSB7XG4gIHR5cGU6ICdmZWVkYmFjayc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgLy8gT3B0aW9uYWwgZm9yZWlnbiBrZXkgaW50byBFbnRyeS51aWQuIEFkamFjZW5jeSB0byBhIHByZWNlZGluZyBzZWxlY3RvclxuICAvLyBpcyB0aGUgaGlzdG9yaWNhbCBsaW5rOyBwYXJlbnRJZCBtYWtlcyBpdCBleHBsaWNpdCBhbmQgc3Vydml2ZXNcbiAgLy8gcmUtb3JkZXJpbmcgLyBzcGxpdC1ncm91cCAvIGltcG9ydC1leHBvcnQgcm91bmQtdHJpcHMuXG4gIHBhcmVudFVpZD86IHN0cmluZztcbiAgLy8gVXNlciBleHBsaWNpdGx5IGRldGFjaGVkIHRoaXMgY29tbWVudCBmcm9tIGFueSBzZWxlY3Rvci4gV2l0aG91dCB0aGVcbiAgLy8gZmxhZywgYWRqYWNlbmN5IHRvIHRoZSBwcmVjZWRpbmcgc2VsZWN0b3Igd291bGQgc2lsZW50bHkgcmUtYWRvcHQgdGhlXG4gIC8vIGNvbW1lbnQgYXQgcmVuZGVyL2V4cG9ydCB0aW1lLlxuICBkZXRhY2hlZD86IGJvb2xlYW47XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIC8vIFBhZ2UgcmVwb3J0cyBpdHMgc3RpY2t5IHBpbmNoLW1vZGUgc3RhdGUgKGUuZy4gdGhlIHVzZXIgcHJlc3NlZCBFc2Mgb25cbiAgLy8gdGhlIHBhZ2UgdG8gZXhpdCkgc28gdGhlIHBhbmVsIHRvZ2dsZSBzdGF5cyBpbiBzeW5jLlxuICB8IHtraW5kOiAnc2VsZWN0LW1vZGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIC8vIFN0aWNreSBcInBpbmNoIG1vZGVcIjogd2hpbGUgb24sIHBsYWluIGhvdmVyL2NsaWNrIGNhcHR1cmVzIHdpdGhvdXQgdGhlXG4gIC8vIEFsdCBtb2RpZmllciwgYW5kIHRoZSBwYWdlIHNob3dzIGEgbW9kZSBpbmRpY2F0b3IuIEVzYyBleGl0cy5cbiAgfCB7a2luZDogJ3NlbGVjdC1tb2RlJzsgb246IGJvb2xlYW59XG4gIC8vIEV4cG9ydC10aW1lIHJlcXVlc3QgZm9yIHRoZSBmdWxsIHNlcmlhbGl6ZWQgcGFnZSAob3B0LWluIHByZWZcbiAgLy8gaW5jbHVkZVBhZ2VIVE1MKS4gUmVwbGllZCB3aXRoIHtvaywgdXJsLCB0aXRsZSwgaHRtbH07IG5ldmVyIHBlcnNpc3RlZFxuICAvLyB0byBjaHJvbWUuc3RvcmFnZSDigJQgdGhlIHBheWxvYWQgZ29lcyBzdHJhaWdodCBpbnRvIHRoZSB0YXIuXG4gIHwge2tpbmQ6ICdwYWdlLWh0bWwnfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gRnVsbC1wYWdlIChiZXN0LWVmZm9ydCkgc2NyZWVuc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gVW5saWtlXG4gIC8vIHNob3QtcGFnZSB0aGlzIGRvZXMgTk9UIHdyaXRlIGEgZmlsZSBvciBidWlsZCBhIHRodW1ibmFpbCDigJQgaXQganVzdFxuICAvLyByZXR1cm5zIHRoZSBzdGl0Y2hlZCBQTkcgYXMgYSBkYXRhIFVSTCBzbyB0aGUgY2FsbGVyIChjb250ZW50IHNjcmlwdCkgY2FuXG4gIC8vIGF0dGFjaCBpdCB0byBhIFBhZ2VTbmFwc2hvdC4gYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydFxuICAvLyBjb3VsZCBiZSBjYXB0dXJlZC5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gKHJlKWluamVjdCB0aGUgY29udGVudCBzY3JpcHQg4oCUIHRoZSBmaXhcbiAgLy8gZm9yIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIGNvbnRlbnQgc2NyaXB0LiBEZWZhdWx0cyB0byB0aGUgYWN0aXZlIHRhYi5cbiAgfCB7a2luZDogJ3BnLXJlaW5qZWN0JzsgdGFiSWQ/OiBudW1iZXJ9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuLy8gUmVwbHkgdG8gYSBgcGFnZS1zbmFwc2hvdC1zaG90YCByZXF1ZXN0LiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwgb2Zcbi8vIHRoZSAoYmVzdC1lZmZvcnQpIGZ1bGwgcGFnZTsgYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCB3YXNcbi8vIGNhcHR1cmVkLiBgb2s6ZmFsc2VgIGNhcnJpZXMgYW4gZXJyb3Igc3RyaW5nLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBzY3JlZW5zaG90Pzogc3RyaW5nO1xuICBwYXJ0aWFsPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBTYXZlUmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGhcbiAgYWJzUGF0aD86IHN0cmluZzsgIC8vIE9TLWFic29sdXRlIHBhdGhcbiAgY29weVBhdGg/OiBzdHJpbmc7IC8vIFVJLWZhY2luZyBwYXRoXG4gIHRlbXBQYXRoPzogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBCZ1JlcGx5ID1cbiAgfCB7ZGF0YVVybDogc3RyaW5nfVxuICB8IHtmb3VuZDogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyfVxuICB8IHt0YWJzOiBBcnJheTx7aWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9Pn1cbiAgfCB7ZXJyb3I6IHN0cmluZ31cbiAgfCBTaG90UmVwbHlcbiAgfCBTYXZlUmVwbHlcbiAgfCBQYWdlU25hcHNob3RSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5OiBmaXJzdCAxNiBoZXggY2hhcnMgb2YgYSBTSEEtMjU2IG92ZXIgdGhlXG4gIC8vIHNsaW0gcm93cyArIHNjcmVlbnNob3QgbmFtZXMuIFN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cyBvZiB0aGUgc2FtZVxuICAvLyBjb250ZW50LCBzbyBkb3duc3RyZWFtIHN0YXRlIChlLmcuIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyovYnVuZGxlcy8pXG4gIC8vIGtleXMgb24gaXQgd2l0aG91dCBkdXBsaWNhdGluZyB3b3JrLlxuICBidW5kbGVJZD86IHN0cmluZztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gICAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gICAgcGFnZXNIdG1sPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBXaGVyZSB0aGUgYWdlbnQgZG9jdHJpbmUgbGl2ZXMgaW5zaWRlIHRoZSBhcmNoaXZlIChTZW5kLXRvLUFnZW50XG4gIC8vIHByb3RvY29sKS4gQWJzZW50IG9uIHBsYWluIEpTT05MIGV4cG9ydHMuXG4gIGFnZW50UHJvdG9jb2w/OiB7YXJjaGl2ZVBhdGg6IHN0cmluZ307XG4gIC8vIEJ1bmRsZSB0b2tlbiBidWRnZXQ6IGBzaWduYWwqYCBpcyB0aGUgdXAtZnJvbnQgcmVhZCAoQUdFTlQtUFJPVE9DT0wsXG4gIC8vIFJFQURNRSwgcmVwYWlyLWluZGV4LCB0aGUgSlNPTkwsIERFU0lHTiwgdGhlIHR3byBTS0lMTHMsIHNraWxscy1pbmRleCk7XG4gIC8vIGB0b3RhbCpgIGlzIHRoZSB3aG9sZSBhcmNoaXZlLiBUaGUgbGF6eSByZW1haW5kZXIgaXMgZW51bWVyYXRlZCBpbiB0aGVcbiAgLy8gYnVuZGxlIGZpbGUgbmFtZWQgYnkgYGlnbm9yZWAuIEVzdGltYXRvciBoZXVyaXN0aWM6IGJ5dGVzIC8gNC5cbiAgdG9rZW5zPzoge3NpZ25hbEJ5dGVzOiBudW1iZXI7IHRvdGFsQnl0ZXM6IG51bWJlcjsgc2lnbmFsVG9rZW5zOiBudW1iZXI7IHRvdGFsVG9rZW5zOiBudW1iZXI7IGlnbm9yZTogc3RyaW5nfTtcbiAgLy8gVmVuZG9yZWQgc2tpbGwgZG9jdW1lbnRzIGJ1bmRsZWQgaW50byB0aGlzIGFyY2hpdmUgKHN1YnNldCBvZiB0aGVcbiAgLy8gcmljaGVyIHNraWxscy1pbmRleC5qc29uIGF0IHRoZSBhcmNoaXZlIHJvb3QpLiBgaW52b2NhdGlvbmAgY2FycmllcyBhXG4gIC8vIHBsdWdpbi1jb21tYW5kIGZvcm0gZm9yIGhhcm5lc3NlcyB0aGF0IHN1cHBvcnQgaXQuXG4gIGJ1bmRsZWRTa2lsbHM/OiBBcnJheTx7aWQ6IHN0cmluZzsga2luZDogJ3NraWxsJyB8ICdyZWZlcmVuY2UnOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBpbnZvY2F0aW9uPzogc3RyaW5nfT47XG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGRvY3VtZW50cyBidW5kbGVkIHVuZGVyIHBhZ2VzLyAob3B0LWluIHByZWYpLlxuICBwYWdlc0h0bWw/OiBBcnJheTx7dXJsOiBzdHJpbmc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGJ5dGVzOiBudW1iZXJ9PjtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gUGluY2hHcmFiIOKAlCBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyIChNVjMpXG4vL1xuLy8g4oCiIE9wZW4gdGhlIHNpZGUgcGFuZWwgb24gYWN0aW9uIGNsaWNrXG4vLyDigKIgSW5qZWN0IHRoZSBjb250ZW50IHNjcmlwdCBpbnRvIGFscmVhZHktb3BlbiB0YWJzIChubyByZWZyZXNoIG5lZWRlZClcbi8vIOKAoiBSaWdodC1jbGljayBcIlBpbmNoR3JhYiBjYXB0dXJlXCIgY29udGV4dCBtZW51XG4vLyDigKIgQ2FwdHVyZSB2aXNpYmxlLXRhYiBzY3JlZW5zaG90cyBvbiBzaWRlLXBhbmVsIHJlcXVlc3Rcbi8vIOKAoiBBdXRvLW9wZW4gdGhlIHNpZGUgcGFuZWwgb24gZmlyc3QgY2FwdHVyZSAodXNlcyBDaHJvbWUgMTE2KyB1c2VyLWdlc3R1cmVcbi8vICAgcHJvcGFnYXRpb24gdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSlcbi8vIOKAoiBSZWxheSBjb250ZW50LXNjcmlwdCBtZXNzYWdlcyB0byBzaWRlLXBhbmVsIHBvcnRzXG4vLyDigKIgU2NyZWVuc2hvdCB3b3JrZXI6IHNob3QtZWxlbWVudCAvIHNob3QtZ3JvdXAgLyBzaG90LXBhZ2Uga2luZHMuIEVhY2hcbi8vICAgY2FwdHVyZXMgdmlhIGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiLCBvcHRpb25hbGx5IGNyb3BzL3N0aXRjaGVzXG4vLyAgIGluIGFuIE9mZnNjcmVlbkNhbnZhcywgYW5kIHdyaXRlcyB0aGUgUE5HIGludG8gdGhlIHVzZXIncyBEb3dubG9hZHNcbi8vICAgdW5kZXIgLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9zY3JlZW5zaG90cy8uXG5cbmltcG9ydCB0eXBlIHtBbnlNZXNzYWdlLCBQZ0VudmVsb3BlLCBTaG90UmVwbHl9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5cbmNvbnN0IExPRyA9ICdbUGluY2hHcmFiL2JnXSc7XG5cbi8vIOKUgOKUgOKUgCBUb29sYmFyIGljb246IHJlbmRlciB0aGUg8J+kjyBlbW9qaSBpbnRvIEltYWdlRGF0YSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdlIGRvbid0IHNoaXAgc3RhdGljIFBORyBpY29uczsgd2UgZHJhdyB0aGVtIGF0IHN0YXJ0dXAgc28gdGhlIE9TJ3Mgb3duXG4vLyBwaW5jaCBnbHlwaCBpcyB1c2VkIChjb25zaXN0ZW50IHdpdGggdGhlIGJyYW5kIGluIHRoZSBzaWRlIHBhbmVsKS5cbmFzeW5jIGZ1bmN0aW9uIHNldEVtb2ppSWNvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzaXplcyA9IFsxNiwgMzIsIDQ4LCAxMjhdO1xuICAgIGNvbnN0IGltYWdlRGF0YTogUmVjb3JkPG51bWJlciwgSW1hZ2VEYXRhPiA9IHt9O1xuICAgIGZvciAoY29uc3Qgc2l6ZSBvZiBzaXplcykge1xuICAgICAgY29uc3QgYyA9IG5ldyBPZmZzY3JlZW5DYW52YXMoc2l6ZSwgc2l6ZSk7XG4gICAgICBjb25zdCBjdHggPSBjLmdldENvbnRleHQoJzJkJykhO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICAgIGN0eC5mb250ID0gYCR7TWF0aC5mbG9vcihzaXplICogMC44Mil9cHggXCJBcHBsZSBDb2xvciBFbW9qaVwiLFwiU2Vnb2UgVUkgRW1vamlcIixcIk5vdG8gQ29sb3IgRW1vamlcIixzZXJpZmA7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICBjdHguZmlsbFRleHQoJ/CfpI8nLCBzaXplIC8gMiwgc2l6ZSAvIDIgKyBzaXplICogMC4wNCk7XG4gICAgICBpbWFnZURhdGFbc2l6ZV0gPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHNpemUsIHNpemUpO1xuICAgIH1cbiAgICBhd2FpdCBjaHJvbWUuYWN0aW9uLnNldEljb24oe2ltYWdlRGF0YX0pO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzZXRFbW9qaUljb24nLCBlKTsgfVxufVxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihhc3luYyAoKSA9PiB7XG4gIHRyeSB7IGNocm9tZS5jb250ZXh0TWVudXMuY3JlYXRlKHtpZDogJ3BnLWNhcHR1cmUnLCB0aXRsZTogJ1BpbmNoR3JhYiDigJQgY2FwdHVyZSB0aGlzIGVsZW1lbnQnLCBjb250ZXh0czogWydhbGwnXX0pOyB9XG4gIGNhdGNoIHsgLyogbWF5IGFscmVhZHkgZXhpc3QgKi8gfVxuICB2b2lkIHNldEVtb2ppSWNvbigpO1xufSk7XG5cbmNocm9tZS5ydW50aW1lLm9uU3RhcnR1cD8uYWRkTGlzdGVuZXIoKCkgPT4ge1xuICB2b2lkIHNldEVtb2ppSWNvbigpO1xufSk7XG5cbi8vIEVuc3VyZSB0aGUgdG9vbGJhciBjbGljayBmaXJlcyBPVVIgYWN0aW9uLm9uQ2xpY2tlZCAobm90IENocm9tZSdzIHBhbmVsXG4vLyBhdXRvLW9wZW4pIG9uIEVWRVJZIHNlcnZpY2Utd29ya2VyIHN0YXJ0IOKAlCBvbkluc3RhbGxlZCBhbG9uZSBpcyB1bnJlbGlhYmxlXG4vLyBhY3Jvc3MgcmVsb2FkcywgYW5kIGEgc3RhbGUgb3BlblBhbmVsT25BY3Rpb25DbGljazp0cnVlIHNpbGVudGx5IHN3YWxsb3dzIHRoZVxuLy8gY2xpY2sgc28gdGhlIGNvbnRlbnQgc2NyaXB0IG5ldmVyIGluamVjdHMgKEFsdCtDbGljayBjYXB0dXJlIGdvZXMgZGVhZCkuXG4vLyBJZGVtcG90ZW50IGFuZCBjaGVhcC4gKCMxOClcbnZvaWQgY2hyb21lLnNpZGVQYW5lbC5zZXRQYW5lbEJlaGF2aW9yKHtvcGVuUGFuZWxPbkFjdGlvbkNsaWNrOiBmYWxzZX0pXG4gIC5jYXRjaCgoZSkgPT4gY29uc29sZS53YXJuKExPRywgJ3NldFBhbmVsQmVoYXZpb3IgKHN0YXJ0dXApJywgZSkpO1xuXG4vLyDilIDilIDilIAgQWN0aXZhdGlvbiAoIzE4KTogdG9vbGJhciBjbGljayBhdHRhY2hlcyBQaW5jaEdyYWIgdG8gVEhJUyB0YWIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBQaW5jaEdyYWIgbm8gbG9uZ2VyIGF1dG8taW5qZWN0cyBpbnRvIGV2ZXJ5IHBhZ2Ug4oCUIHRoZSA8YWxsX3VybHM+XG4vLyBjb250ZW50X3NjcmlwdHMgZW50cnkgYW5kIGhvc3RfcGVybWlzc2lvbnMgYXJlIGdvbmUuIENsaWNraW5nIHRoZSB0b29sYmFyXG4vLyBhY3Rpb24gZ3JhbnRzIGFjdGl2ZVRhYiBmb3IgdGhlIGNsaWNrZWQgdGFiOyB3ZSBpbmplY3QgdGhlIGNhcHR1cmUgc2NyaXB0XG4vLyB0aGVyZSBhbmQgb3BlbiB0aGUgc2lkZSBwYW5lbC4gRWFjaCBhY3RpdmF0ZWQgdGFiIGJlY29tZXMgaXRzIG93biB3b3Jrc3BhY2UsXG4vLyB0cmFja2VkIHBhbmVsLXNpZGUgdmlhIHRoZSBwZy10YWItYWN0aXZhdGVkIG1lc3NhZ2UgYmVsb3cuXG4vLyDilIDilIDilIAgQWN0aXZhdGVkLXRhYiB0cmFja2luZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFRhYnMgUGluY2hHcmFiIGlzIGF0dGFjaGVkIHRvICh0b29sYmFyIGNsaWNrIG9yIHBhbmVsIHJlLWF0dGFjaCkuIFNlc3Npb25cbi8vIHN0b3JhZ2Ugc3Vydml2ZXMgc2VydmljZS13b3JrZXIgcmVzdGFydHMgYW5kIGNsZWFycyBvbiBicm93c2VyIGV4aXQg4oCUIHRoZVxuLy8gc2FtZSBsaWZldGltZSBhcyB0aGUgYWN0aXZlVGFiIGdyYW50IGNoYWluIHRoZSByZS1pbmplY3QgcGF0aCByZWxpZXMgb24uXG5jb25zdCBBQ1RJVkVfVEFCU19LRVkgPSAncGcuYWN0aXZlVGFicyc7XG5jb25zdCByZWFkQWN0aXZlVGFicyA9IGFzeW5jICgpOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+PiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgbyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnNlc3Npb24uZ2V0KEFDVElWRV9UQUJTX0tFWSk7XG4gICAgcmV0dXJuIChvW0FDVElWRV9UQUJTX0tFWV0gYXMgUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gfCB1bmRlZmluZWQpID8/IHt9O1xuICB9IGNhdGNoIHsgcmV0dXJuIHt9OyB9XG59O1xuY29uc3QgdHJhY2tBY3RpdmVUYWIgPSBhc3luYyAodGFiSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCBjdXIgPSBhd2FpdCByZWFkQWN0aXZlVGFicygpO1xuICBjdXJbU3RyaW5nKHRhYklkKV0gPSB0cnVlO1xuICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLnNldCh7W0FDVElWRV9UQUJTX0tFWV06IGN1cn0pOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbn07XG5jb25zdCB1bnRyYWNrQWN0aXZlVGFiID0gYXN5bmMgKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgY3VyID0gYXdhaXQgcmVhZEFjdGl2ZVRhYnMoKTtcbiAgaWYgKCEoU3RyaW5nKHRhYklkKSBpbiBjdXIpKSByZXR1cm47XG4gIGRlbGV0ZSBjdXJbU3RyaW5nKHRhYklkKV07XG4gIHRyeSB7IGF3YWl0IGNocm9tZS5zdG9yYWdlLnNlc3Npb24uc2V0KHtbQUNUSVZFX1RBQlNfS0VZXTogY3VyfSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxufTtcblxuY2hyb21lLnRhYnMub25SZW1vdmVkLmFkZExpc3RlbmVyKCh0YWJJZCkgPT4gdm9pZCB1bnRyYWNrQWN0aXZlVGFiKHRhYklkKSk7XG5cbi8vIFJlLWluamVjdCBhZnRlciBhIHJlZnJlc2ggLyBzYW1lLXRhYiBuYXZpZ2F0aW9uIG9mIGFuIGF0dGFjaGVkIHRhYiwgc29cbi8vIEFsdCtDbGljayBzdXJ2aXZlcyByZWxvYWRzIHdpdGhvdXQgYW5vdGhlciB0b29sYmFyIGNsaWNrLiBUaGUgYWN0aXZlVGFiXG4vLyBncmFudCBwZXJzaXN0cyBhY3Jvc3MgcmVsb2FkcyBvZiB0aGUgZ3JhbnRlZCB0YWI7IHdoZW4gQ2hyb21lIHJldm9rZXMgaXRcbi8vIChlLmcuIGNyb3NzLW9yaWdpbiBuYXZpZ2F0aW9uKSBleGVjdXRlU2NyaXB0IHJlamVjdHMgYW5kIHdlIHVudHJhY2sg4oCUXG4vLyB0aGUgcGFuZWwncyByZS1hdHRhY2ggYWZmb3JkYW5jZSBjb3ZlcnMgdGhhdCBjYXNlLlxuY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgaW5mbywgdGFiKSA9PiB7XG4gIGlmIChpbmZvLnN0YXR1cyAhPT0gJ2NvbXBsZXRlJykgcmV0dXJuO1xuICBpZiAoIXRhYi51cmwgfHwgIS9eaHR0cHM/Oi8udGVzdCh0YWIudXJsKSkgcmV0dXJuO1xuICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdHJhY2tlZCA9IGF3YWl0IHJlYWRBY3RpdmVUYWJzKCk7XG4gICAgaWYgKCF0cmFja2VkW1N0cmluZyh0YWJJZCldKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7dGFyZ2V0OiB7dGFiSWQsIGFsbEZyYW1lczogZmFsc2V9LCBmaWxlczogWydjb250ZW50LXNjcmlwdC5qcyddLCBpbmplY3RJbW1lZGlhdGVseTogdHJ1ZX0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAncmVpbmplY3RlZCBhZnRlciBuYXZpZ2F0aW9uJywgdGFiSWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdyZWluamVjdCBhZnRlciBuYXZpZ2F0aW9uIGZhaWxlZCAoZ3JhbnQgcmV2b2tlZD8pJywgdGFiSWQsIGUpO1xuICAgICAgYXdhaXQgdW50cmFja0FjdGl2ZVRhYih0YWJJZCk7XG4gICAgfVxuICB9KSgpO1xufSk7XG5cbmNocm9tZS5hY3Rpb24ub25DbGlja2VkLmFkZExpc3RlbmVyKCh0YWIpID0+IHtcbiAgaWYgKCF0YWI/LmlkKSByZXR1cm47XG4gIGNvbnN0IHRhYklkID0gdGFiLmlkO1xuICBjb25zb2xlLmxvZyhMT0csICdhY3Rpb24gY2xpY2sg4oaSIGFjdGl2YXRlIHRhYicsIHRhYklkLCB0YWIudXJsID8/ICcobm8gdXJsKScpO1xuICAvLyBJbmplY3QgdGhlIGNhcHR1cmUgc2NyaXB0IEZJUlNULCB3aGlsZSB0aGUgY2xpY2sncyBhY3RpdmVUYWIgZ3JhbnQgaXNcbiAgLy8gZnJlc2hlc3Q7IGF0dGVtcHQgb24gaHR0cChzKSBwYWdlcyAoYW5kIHdoZW4gdGhlIFVSTCBpcyB1bmtub3duKSwgYW5kIHNraXBcbiAgLy8gcmVzdHJpY3RlZCBzY2hlbWVzIHdoZXJlIGluamVjdGlvbiB3b3VsZCBvbmx5IGVycm9yLlxuICBpZiAoIXRhYi51cmwgfHwgL15odHRwcz86Ly50ZXN0KHRhYi51cmwpKSB7XG4gICAgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDoge3RhYklkLCBhbGxGcmFtZXM6IGZhbHNlfSxcbiAgICAgIGZpbGVzOiBbJ2NvbnRlbnQtc2NyaXB0LmpzJ10sXG4gICAgICBpbmplY3RJbW1lZGlhdGVseTogdHJ1ZSxcbiAgICB9KS5jYXRjaCgoZSkgPT4gY29uc29sZS53YXJuKExPRywgJ2FjdGl2YXRlIGluamVjdCBGQUlMRUQnLCBlKSk7XG4gICAgdm9pZCB0cmFja0FjdGl2ZVRhYih0YWJJZCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKExPRywgJ2FjdGl2YXRlOiBjYW5ub3QgaW5qZWN0IGludG8nLCB0YWIudXJsKTtcbiAgfVxuICAvLyBUaGVuIG9wZW4gdGhlIHNpZGUgcGFuZWwgKGFsc28gYSB1c2VyLWdlc3R1cmUgY2FsbCkuXG4gIGNocm9tZS5zaWRlUGFuZWwub3Blbih7dGFiSWR9KS5jYXRjaCgoZSkgPT4gY29uc29sZS53YXJuKExPRywgJ3NpZGVQYW5lbC5vcGVuJywgZSkpO1xuICAvLyBCaW5kIHRoaXMgdGFiIHRvIGEgd29ya3NwYWNlIHBhbmVsLXNpZGUuIFRoZSBwYW5lbCBtYXkgaGF2ZSBqdXN0IG9wZW5lZCBhbmRcbiAgLy8gbm90IGJlIGxpc3RlbmluZyB5ZXQsIHNvIHJlcGxheSBhIGZldyB0aW1lczsgdGhlIHBhbmVsIGRlZHVwcyBieSB0YWJJZC5cbiAgY29uc3QgbWV0YSA9IHtfX3BnOiB0cnVlLCBraW5kOiAncGctdGFiLWFjdGl2YXRlZCcsIHRhYklkLCB1cmw6IHRhYi51cmwgPz8gJycsIHRpdGxlOiB0YWIudGl0bGUgPz8gJyd9O1xuICBjb25zdCBhbm5vdW5jZSA9ICgpOiB2b2lkID0+IHsgdHJ5IHsgdm9pZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXRhKS5jYXRjaD8uKCgpID0+IHsgLyogbm90IHVwIHlldCAqLyB9KTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9IH07XG4gIGFubm91bmNlKCk7XG4gIHNldFRpbWVvdXQoYW5ub3VuY2UsIDE1MCk7XG4gIHNldFRpbWVvdXQoYW5ub3VuY2UsIDUwMCk7XG59KTtcblxuY2hyb21lLmNvbnRleHRNZW51cz8ub25DbGlja2VkLmFkZExpc3RlbmVyKChpbmZvLCB0YWIpID0+IHtcbiAgaWYgKGluZm8ubWVudUl0ZW1JZCAhPT0gJ3BnLWNhcHR1cmUnIHx8ICF0YWI/LmlkKSByZXR1cm47XG4gIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge19fcGc6IHRydWUsIGtpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfSkuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG59KTtcblxuLy8g4pSA4pSA4pSAIFNjcmVlbnNob3QgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gRmlsZW5hbWUgdGltZXN0YW1wIGlzIGVwb2NoIG1pbGxpc2Vjb25kcy4gU29ydGluZyBieSBuYW1lID0gc29ydGluZyBieVxuLy8gdGltZSB3aXRoaW4gYSBob3N0IGJ1Y2tldC4gV2UgYWNjZXB0IGFuIG9wdGlvbmFsIElTTyBzdHJpbmcgZm9yIHRlc3RzIGJ1dFxuLy8gbm9ybWFsaXplIHRvIGVwb2NoIG1zIHNvIHRoZSBvdXRwdXQgaXMgdW5pZm9ybS5cbmV4cG9ydCBjb25zdCB0c0ZvckZpbGVuYW1lID0gKGlzbz86IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGlmICghaXNvKSByZXR1cm4gU3RyaW5nKERhdGUubm93KCkpO1xuICBjb25zdCB0ID0gRGF0ZS5wYXJzZShpc28pO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKHQpID8gU3RyaW5nKHQpIDogU3RyaW5nKERhdGUubm93KCkpO1xufTtcblxuLy8gaG9zdC1zbHVnOiByZXBsYWNlIGAuYCB3aXRoIGBfYCAocGVyIHByb2plY3QgY29udmVudGlvbiBzbyBmaWxlbmFtZXMgYXJlXG4vLyBzaGVsbC1mcmllbmRseSBhbmQgZG9uJ3QgbG9vayBsaWtlIG11bHRpLWV4dGVuc2lvbiBwYXRocyBsaWtlIGBhcHAucGluY2hcbi8vIGdyYWIuY29tLS4uLmApLCBzdHJpcCBhbnkgb3RoZXIgbm9uLXdvcmQvaHlwaGVuIGNoYXJhY3RlcnMsIGNhcCBhdCA0MFxuLy8gY2hhcnMuIGBsb2NhbGhvc3Q6MzAwMGAg4oaSIGBsb2NhbGhvc3RfMzAwMGAuXG5leHBvcnQgY29uc3QgaG9zdFNsdWcgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBsZXQgaG9zdDogc3RyaW5nO1xuICB0cnkgeyBob3N0ID0gbmV3IFVSTCh1cmwpLmhvc3Q7IH0gY2F0Y2ggeyBob3N0ID0gJ3Vua25vd24nOyB9XG4gIHJldHVybiBob3N0LnJlcGxhY2UoL1xcLi9nLCAnXycpLnJlcGxhY2UoL1teXFx3LV0vZywgJ18nKS5zbGljZSgwLCA0MCkgfHwgJ3Vua25vd24nO1xufTtcblxuLy8gRmlsZW5hbWUgbGF5b3V0OiBgPGhvc3RfdW5kZXJzY29yZWQ+LW48Tj4tPGtpbmQ+Wy08ZXh0cmE+XS08ZXBvY2g+LnBuZ2AuXG4vLyBIb3N0IGZpcnN0IG1lYW5zIHNjcmVlbnNob3RzIGluIERvd25sb2Fkcy8ucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvXG4vLyBncm91cCBuYXR1cmFsbHkgcGVyIHNpdGU7IGVwb2NoIGFzIGEgdGFpbCBrZXkgZ2l2ZXMgY2hyb25vbG9naWNhbCBvcmRlclxuLy8gaW5zaWRlIGVhY2ggYnVja2V0LlxuZXhwb3J0IGNvbnN0IGJ1aWxkRmlsZW5hbWUgPSAoXG4gIGtpbmQ6ICdlbGVtZW50JyB8ICdncm91cCcgfCAncGFnZScsXG4gIHRzOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgdXJsOiBzdHJpbmcsXG4gIG9wdHM6IHtjb3VudD86IG51bWJlcjsgdHJ1bmNhdGVkPzogYm9vbGVhbn0gPSB7fSxcbik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHN0YW1wID0gdHNGb3JGaWxlbmFtZSh0cyk7XG4gIGNvbnN0IHNsdWcgPSBob3N0U2x1Zyh1cmwpO1xuICBpZiAoa2luZCA9PT0gJ2VsZW1lbnQnKSByZXR1cm4gYCR7c2x1Z30tbiR7bn0tZWxlbWVudC0ke3N0YW1wfS5wbmdgO1xuICBpZiAoa2luZCA9PT0gJ2dyb3VwJykgcmV0dXJuIGAke3NsdWd9LW4ke259LWdyb3VwJHtvcHRzLmNvdW50ID8/IDB9LSR7c3RhbXB9LnBuZ2A7XG4gIC8vIHBhZ2VcbiAgY29uc3Qgc3VmZml4ID0gb3B0cy50cnVuY2F0ZWQgPyAncGFnZS10cnVuYycgOiAncGFnZSc7XG4gIHJldHVybiBgJHtzbHVnfS1uJHtufS0ke3N1ZmZpeH0tJHtzdGFtcH0ucG5nYDtcbn07XG5cbi8vIGRhdGFVUkwg4oaSIEJsb2Igd2l0aG91dCBnb2luZyB0aHJvdWdoIGZldGNoL2F0b2Igcm91bmR0cmlwcyB0aGF0IGJyb3dzZXJzXG4vLyBpbiBzZXJ2aWNlLXdvcmtlciBjb250ZXh0IHNvbWV0aW1lcyBiYWxrIGF0LiBQTkcgb25seS5cbmNvbnN0IGRhdGFVcmxUb0Jsb2IgPSBhc3luYyAoZGF0YVVybDogc3RyaW5nKTogUHJvbWlzZTxCbG9iPiA9PiB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChkYXRhVXJsKTtcbiAgcmV0dXJuIHIuYmxvYigpO1xufTtcblxuLy8gRGVjb2RlIGEgUE5HIGRhdGFVUkwgaW50byBhbiBJbWFnZUJpdG1hcCB1c2FibGUgYnkgT2Zmc2NyZWVuQ2FudmFzLiBXZVxuLy8gY2FuJ3QgYG5ldyBJbWFnZSgpYCBpbiBhIHNlcnZpY2Ugd29ya2VyIOKAlCBJbWFnZSBpcyBhIERPTS1vbmx5IGNvbnN0cnVjdG9yLlxuY29uc3QgZGF0YVVybFRvQml0bWFwID0gYXN5bmMgKGRhdGFVcmw6IHN0cmluZyk6IFByb21pc2U8SW1hZ2VCaXRtYXA+ID0+IHtcbiAgY29uc3QgYmxvYiA9IGF3YWl0IGRhdGFVcmxUb0Jsb2IoZGF0YVVybCk7XG4gIHJldHVybiBjcmVhdGVJbWFnZUJpdG1hcChibG9iKTtcbn07XG5cbi8vIEVuY29kZSBhbiBPZmZzY3JlZW5DYW52YXMgdG8gYSBQTkcgYmxvYi5cbmNvbnN0IGNhbnZhc1RvQmxvYiA9IGFzeW5jIChjYW52YXM6IE9mZnNjcmVlbkNhbnZhcyk6IFByb21pc2U8QmxvYj4gPT5cbiAgY2FudmFzLmNvbnZlcnRUb0Jsb2Ioe3R5cGU6ICdpbWFnZS9wbmcnfSk7XG5cbi8vIERvd25zY2FsZSBhIGJpdG1hcCBpbnRvIGEgUE5HIGRhdGFVUkwgd2l0aCBtYXggd2lkdGggY2FwcGVkLiBUaGUgdGh1bWJuYWlsXG4vLyBpcyB3aGF0IHRoZSBzaWRlIHBhbmVsIHBhaW50cyBpbnRvIHRoZSAucHJldmlldyB0aWxlIOKAlCB0aGUgb3JpZ2luYWwgbGl2ZXNcbi8vIG9ubHkgb24gZGlzay4gV2UgdXNlIEZpbGVSZWFkZXIgKHdvcmtzIGluIE1WMyBTV3MpIHNpbmNlIHRoZSBkYXRhVVJMIGlzXG4vLyBwYXNzZWQgYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIHdoZXJlIHNpemUgbWF0dGVycyBsZXNzLlxuY29uc3QgbWFrZVRodW1ibmFpbCA9IGFzeW5jIChiaXRtYXA6IEltYWdlQml0bWFwLCBtYXhXaWR0aCA9IDMyMCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IHJhdGlvID0gYml0bWFwLndpZHRoIDw9IG1heFdpZHRoID8gMSA6IG1heFdpZHRoIC8gYml0bWFwLndpZHRoO1xuICBjb25zdCB3ID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChiaXRtYXAud2lkdGggKiByYXRpbykpO1xuICBjb25zdCBoID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChiaXRtYXAuaGVpZ2h0ICogcmF0aW8pKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3LCBoKTtcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuICBjdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9ICdoaWdoJztcbiAgY3R4LmRyYXdJbWFnZShiaXRtYXAsIDAsIDAsIHcsIGgpO1xuICBjb25zdCBibG9iID0gYXdhaXQgY2FudmFzLmNvbnZlcnRUb0Jsb2Ioe3R5cGU6ICdpbWFnZS9wbmcnfSk7XG4gIC8vIGFycmF5QnVmZmVyICsgYnRvYSBhdm9pZHMgYW55IEZpbGVSZWFkZXItYXZhaWxhYmlsaXR5IGNvbmNlcm4uXG4gIGNvbnN0IGJ1ZiA9IGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWYpO1xuICBsZXQgYmluYXJ5ID0gJyc7XG4gIGNvbnN0IGNodW5rID0gMHg4MF8wMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gY2h1bmspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBBcnJheS5mcm9tKGJ5dGVzLnN1YmFycmF5KGksIGkgKyBjaHVuaykpKTtcbiAgfVxuICByZXR1cm4gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuLy8gUGVyLXRhYiBzZXJpYWxpemF0aW9uOiBhdCBtb3N0IG9uZSBjYXB0dXJlIGluIGZsaWdodCBhdCBhIHRpbWUuIFdpdGhvdXQgYVxuLy8gcXVldWUsIHRoZSB0aHJvdHRsaW5nIG9uIGNhcHR1cmVWaXNpYmxlVGFiICh+MiBjYWxscy9zZWMpIHNob3dzIHVwIGFzXG4vLyBtaXNzaW5nIHNjcmVlbnNob3RzIHdoZW4gdGhlIHVzZXIgZmlyZXMgc2V2ZXJhbCBjYXB0dXJlcyBiYWNrLXRvLWJhY2suXG50eXBlIFF1ZXVlVGFzayA9ICgpID0+IFByb21pc2U8dm9pZD47XG5jb25zdCB0YWJRdWV1ZXMgPSBuZXcgTWFwPG51bWJlciwgUHJvbWlzZTx2b2lkPj4oKTtcbmNvbnN0IGVucXVldWUgPSAodGFiSWQ6IG51bWJlciwgdGFzazogUXVldWVUYXNrKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IHByZXYgPSB0YWJRdWV1ZXMuZ2V0KHRhYklkKSA/PyBQcm9taXNlLnJlc29sdmUoKTtcbiAgY29uc3QgbmV4dCA9IHByZXYudGhlbigoKSA9PiB0YXNrKCkpLmNhdGNoKChlKSA9PiB7IGNvbnNvbGUud2FybihMT0csICdxdWV1ZSB0YXNrIGZhaWxlZCcsIGUpOyB9KTtcbiAgdGFiUXVldWVzLnNldCh0YWJJZCwgbmV4dCk7XG4gIHJldHVybiBuZXh0O1xufTtcblxuLy8gT25lLXNob3QgQ1Mgcm91bmQtdHJpcDogYXNrIHRoZSBjb250ZW50IHNjcmlwdCB0byBoaWRlIGl0cyBvdmVybGF5IHRoZW5cbi8vIHdhaXQgZm9yIGFjay4gV2UgdXNlIHNlbmRNZXNzYWdlIHdpdGggYSB0aW1lb3V0IHNvIGEgQ1MgdGhhdCdzIHN0dWNrIG9yXG4vLyBub3QgbG9hZGVkIGNhbid0IHdlZGdlIHRoZSBxdWV1ZS5cbmNvbnN0IHRlbGxDcyA9IGFzeW5jIDxUID0gdW5rbm93bj4odGFiSWQ6IG51bWJlciwgcGF5bG9hZDogYW55LCB0aW1lb3V0TXMgPSA2MDApOiBQcm9taXNlPFQgfCBudWxsPiA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxUIHwgbnVsbD4oKHJlc29sdmUpID0+IHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IGZpbmlzaCA9ICh2OiBUIHwgbnVsbCk6IHZvaWQgPT4geyBpZiAoIWRvbmUpIHsgZG9uZSA9IHRydWU7IHJlc29sdmUodik7IH0gfTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGZpbmlzaChudWxsKSwgdGltZW91dE1zKTtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIHBnKHBheWxvYWQpLCAocmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikgeyBmaW5pc2gobnVsbCk7IHJldHVybjsgfVxuICAgICAgICBmaW5pc2goKHJlcGx5ID8/IG51bGwpIGFzIFQgfCBudWxsKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggeyBmaW5pc2gobnVsbCk7IH1cbiAgfSk7XG59O1xuXG4vLyBSdW4gYSBmdW5jdGlvbiBpbnNpZGUgdGhlIHBhZ2UncyBtYWluIHdvcmxkIChvciBpc29sYXRlZCwgZG9lc24ndCBtYXR0ZXJcbi8vIGhlcmUgYmVjYXVzZSB3ZSBvbmx5IHJlYWQgbGF5b3V0IG51bWJlcnMpLiBhcmdzIGlzIHBhc3NlZCBwb3NpdGlvbmFsbHkuXG5jb25zdCBydW5JblBhZ2UgPSBhc3luYyA8VD4oXG4gIHRhYklkOiBudW1iZXIsXG4gIGZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gVCxcbiAgYXJnczogYW55W10gPSBbXSxcbik6IFByb21pc2U8VCB8IG51bGw+ID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDoge3RhYklkfSxcbiAgICAgIGZ1bmM6IGZ1bmMgYXMgYW55LFxuICAgICAgYXJncyxcbiAgICB9KTtcbiAgICByZXR1cm4gKHJlc3VsdHM/LlswXT8ucmVzdWx0ID8/IG51bGwpIGFzIFQgfCBudWxsO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKExPRywgJ3J1bkluUGFnZScsIGUpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuXG4vLyBDb21wdXRlIHVuaW9uIGJib3ggb2Ygc2VsZWN0b3JzIElOU0lERSB0aGUgcGFnZSwgc2Nyb2xsIGl0IGludG8gdmlldywgYW5kXG4vLyByZXR1cm4gdGhlIGJib3ggKyBkcHIgZm9yIGNyb3BwaW5nLiBwYWRkaW5nIGlzIGFwcGxpZWQgc3ltbWV0cmljYWxseS5cbnR5cGUgQmJveFJlc3VsdCA9IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyOyB2dzogbnVtYmVyOyB2aDogbnVtYmVyfTtcbmNvbnN0IGNvbXB1dGVBbmRTY3JvbGwgPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHNlbGVjdG9yczogc3RyaW5nW10sXG4gIHBhZGRpbmc6IG51bWJlcixcbik6IFByb21pc2U8QmJveFJlc3VsdCB8IG51bGw+ID0+IHtcbiAgcmV0dXJuIHJ1bkluUGFnZTxCYm94UmVzdWx0IHwgbnVsbD4odGFiSWQsIChzZWxzOiBzdHJpbmdbXSwgcGFkOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBlbHMgPSBzZWxzLm1hcCgocykgPT4ge1xuICAgICAgdHJ5IHsgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iocyk7IH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICAgIH0pLmZpbHRlcigoZSk6IGUgaXMgRWxlbWVudCA9PiBCb29sZWFuKGUpKTtcbiAgICBpZiAoIWVscy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJlY3RzQmVmb3JlID0gZWxzLm1hcCgoZSkgPT4gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgY29uc3QgdU1pblggPSBNYXRoLm1pbiguLi5yZWN0c0JlZm9yZS5tYXAoKHIpID0+IHIubGVmdCkpO1xuICAgIGNvbnN0IHVNaW5ZID0gTWF0aC5taW4oLi4ucmVjdHNCZWZvcmUubWFwKChyKSA9PiByLnRvcCkpO1xuICAgIGNvbnN0IHVNYXhYID0gTWF0aC5tYXgoLi4ucmVjdHNCZWZvcmUubWFwKChyKSA9PiByLnJpZ2h0KSk7XG4gICAgY29uc3QgdU1heFkgPSBNYXRoLm1heCguLi5yZWN0c0JlZm9yZS5tYXAoKHIpID0+IHIuYm90dG9tKSk7XG4gICAgLy8gRE9OJ1Qgc2Nyb2xsIHdoZW4gdGhlIHRhcmdldCBpcyBhbHJlYWR5IG9uIHNjcmVlbiDigJQgc2Nyb2xsaW5nIGEgdmlzaWJsZVxuICAgIC8vIGVsZW1lbnQgdG8gY2VudGVyIGlzIHRoZSBqYXJyaW5nIGp1bXAgdGhlIG9wZXJhdG9yIGZsYWdnZWQsIGFuZCBpdCdzXG4gICAgLy8gdGhlIGNvbW1vbiBjYXNlICh5b3UgY2FwdHVyZSB3aGF0IHlvdSBjYW4gc2VlKS4gT25seSBzY3JvbGwgd2hlbiB0aGVcbiAgICAvLyBlbGVtZW50IGlzIG9mZi1zY3JlZW4gb3IgY2xpcHBlZCAobGF6eSBpbWFnZXMgYmVsb3cgdGhlIGZvbGQgbmVlZCBpdCkuXG4gICAgY29uc3QgZnVsbHlWaXNpYmxlID0gdU1pblggPj0gMCAmJiB1TWluWSA+PSAwICYmIHVNYXhYIDw9IHdpbmRvdy5pbm5lcldpZHRoICYmIHVNYXhZIDw9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBpZiAoIWZ1bGx5VmlzaWJsZSkge1xuICAgICAgY29uc3QgY3ggPSAodU1pblggKyB1TWF4WCkgLyAyICsgd2luZG93LnNjcm9sbFg7XG4gICAgICBjb25zdCBjeSA9ICh1TWluWSArIHVNYXhZKSAvIDIgKyB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgIGNvbnN0IHRhcmdldFggPSBNYXRoLm1heCgwLCBjeCAtIHdpbmRvdy5pbm5lcldpZHRoIC8gMik7XG4gICAgICBjb25zdCB0YXJnZXRZID0gTWF0aC5tYXgoMCwgY3kgLSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKTtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogdGFyZ2V0WCwgdG9wOiB0YXJnZXRZLCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG4gICAgfVxuXG4gICAgLy8gUmVjb21wdXRlIGJib3hlcyBhZnRlciBzY3JvbGwuXG4gICAgY29uc3QgcmVjdHMgPSBlbHMubWFwKChlKSA9PiBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBjb25zdCBtaW5YID0gTWF0aC5taW4oLi4ucmVjdHMubWFwKChyKSA9PiByLmxlZnQpKSAtIHBhZDtcbiAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oLi4ucmVjdHMubWFwKChyKSA9PiByLnRvcCkpIC0gcGFkO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoKHIpID0+IHIucmlnaHQpKSArIHBhZDtcbiAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKChyKSA9PiByLmJvdHRvbSkpICsgcGFkO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBtaW5YLFxuICAgICAgeTogbWluWSxcbiAgICAgIHc6IG1heFggLSBtaW5YLFxuICAgICAgaDogbWF4WSAtIG1pblksXG4gICAgICBkcHI6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgICB2dzogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICB2aDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgIH07XG4gIH0sIFtzZWxlY3RvcnMsIHBhZGRpbmddKTtcbn07XG5cbi8vIE9uZS1mcmFtZSB5aWVsZCBpbnNpZGUgdGhlIHBhZ2Ugc28gYW55IHBvc3Qtc2Nyb2xsIGxheW91dCBzZXR0bGVzLiBXZSBwaW5cbi8vIHRvIHR3byByQUZzIHRvIGJlIGNvbnNlcnZhdGl2ZSDigJQgcGFnZXMgd2l0aCBzdGlja3kgaGVhZGVycyBzb21ldGltZXMgbmVlZFxuLy8gdGhlIHNlY29uZCBmcmFtZSB0byByZXBhaW50IHRoZSBoZWFkZXIgYXQgaXRzIG5ldyBvZmZzZXQuXG5jb25zdCB5aWVsZFJhZiA9IGFzeW5jICh0YWJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGF3YWl0IHJ1bkluUGFnZTx2b2lkPih0YWJJZCwgKCkgPT5cbiAgICBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVzb2x2ZSgpKSkpLFxuICApO1xufTtcblxuLy8gUmVzdG9yZSB0aGUgcGFnZSBzY3JvbGwgcG9zaXRpb24gYWZ0ZXIgc3RpdGNoaW5nLiBUaGUgb3JpZ2luYWwgcG9zaXRpb25zXG4vLyBhcmUgcGFzc2VkIGJhY2sgZnJvbSB0aGUgc3RpdGNoIGxvb3AuXG5jb25zdCByZXN0b3JlU2Nyb2xsID0gYXN5bmMgKHRhYklkOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGF3YWl0IHJ1bkluUGFnZTx2b2lkPih0YWJJZCwgKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpID0+IHtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oe2xlZnQ6IHN4LCB0b3A6IHN5LCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG4gIH0sIFt4LCB5XSk7XG59O1xuXG5jb25zdCBQQUdFX0NIVU5LX0xJTUlUID0gODtcbmNvbnN0IENBTlZBU19QSVhFTF9MSU1JVCA9IDE2Mzg0OyAvLyBPZmZzY3JlZW5DYW52YXMgc2FmZXR5IGNhcFxuXG4vLyBQYWdlIChmdWxsLWRvY3VtZW50KSBzaG90LiBMb29wcyBjYXB0dXJlVmlzaWJsZVRhYiB3aGlsZSBzY3JvbGxpbmcgYnlcbi8vIHZpZXdwb3J0LWhlaWdodCBjaHVua3M7IHN0b3BzIGF0IGNodW5rIGNvdW50LCBwaXhlbCBjYXAsIG9yIHNjcm9sbEhlaWdodC5cbmNvbnN0IHN0aXRjaFBhZ2UgPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4pOiBQcm9taXNlPHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbD4gPT4ge1xuICAvLyBTbmFwc2hvdCBzY3JvbGwgZ2VvbWV0cnkgdXAgZnJvbnQuXG4gIGNvbnN0IGdlb20gPSBhd2FpdCBydW5JblBhZ2U8e3Z3OiBudW1iZXI7IHZoOiBudW1iZXI7IHN3OiBudW1iZXI7IHNoOiBudW1iZXI7IGRwcjogbnVtYmVyOyBzeDogbnVtYmVyOyBzeTogbnVtYmVyfT4oXG4gICAgdGFiSWQsXG4gICAgKCkgPT4gKHtcbiAgICAgIHZ3OiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHZoOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICBzdzogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoLCBkb2N1bWVudC5ib2R5Py5zY3JvbGxXaWR0aCA/PyAwKSxcbiAgICAgIHNoOiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0LCBkb2N1bWVudC5ib2R5Py5zY3JvbGxIZWlnaHQgPz8gMCksXG4gICAgICBkcHI6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgICBzeDogd2luZG93LnNjcm9sbFgsXG4gICAgICBzeTogd2luZG93LnNjcm9sbFksXG4gICAgfSksXG4gICk7XG4gIGlmICghZ2VvbSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZHByID0gZ2VvbS5kcHI7XG4gIGNvbnN0IHRvdGFsSCA9IGdlb20uc2g7XG4gIGNvbnN0IHRvdGFsSHB4ID0gTWF0aC5yb3VuZCh0b3RhbEggKiBkcHIpO1xuICBjb25zdCB3aWR0aFB4ID0gTWF0aC5yb3VuZChnZW9tLnZ3ICogZHByKTtcblxuICAvLyBJZiB0aGUgcGFnZSBpcyBzaG9ydCBlbm91Z2ggdG8gZml0IGluIHRoZSB2aWV3cG9ydCwgc2luZ2xlIHNob3QuXG4gIGxldCBjaHVua3MgPSAwO1xuICBsZXQgeSA9IDA7XG4gIGxldCBzdGl0Y2hlZEhweCA9IDA7XG4gIGxldCB0cnVuY2F0ZWQgPSBmYWxzZTtcblxuICAvLyBBbGxvY2F0ZSB0aGUgY2FudmFzIGF0IHRoZSBjb25zZXJ2YXRpdmUgZmluYWwgc2l6ZTsgd2UnbGwgdHJpbSBsYXRlciBpZlxuICAvLyB3ZSBzdG9wIGVhcmx5LiB3aWR0aCBpcyBmaXhlZDsgaGVpZ2h0IGdyb3dzIHVwIHRvIG1pbih0b3RhbEhweCwgY2FwKS5cbiAgY29uc3QgdGFyZ2V0SHB4ID0gTWF0aC5taW4odG90YWxIcHgsIENBTlZBU19QSVhFTF9MSU1JVCk7XG4gIGNvbnN0IGNhbnZhcyA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGhQeCwgdGFyZ2V0SHB4KTtcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuXG4gIHdoaWxlICh5IDwgdG90YWxIKSB7XG4gICAgaWYgKGNodW5rcyA+PSBQQUdFX0NIVU5LX0xJTUlUKSB7IHRydW5jYXRlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgaWYgKHN0aXRjaGVkSHB4ID49IENBTlZBU19QSVhFTF9MSU1JVCkgeyB0cnVuY2F0ZWQgPSB0cnVlOyBicmVhazsgfVxuICAgIGF3YWl0IHJ1bkluUGFnZTx2b2lkPih0YWJJZCwgKHl5OiBudW1iZXIpID0+IHtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogMCwgdG9wOiB5eSwgYmVoYXZpb3I6ICdpbnN0YW50JyBhcyBTY3JvbGxCZWhhdmlvcn0pO1xuICAgIH0sIFt5XSk7XG4gICAgYXdhaXQgeWllbGRSYWYodGFiSWQpO1xuICAgIGxldCBkYXRhVXJsOiBzdHJpbmc7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGFVcmwgPSBhd2FpdCBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih3aW5kb3dJZCwge2Zvcm1hdDogJ3BuZyd9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnY2FwdHVyZVZpc2libGVUYWIgcGFnZSBjaHVuayBmYWlsZWQnLCBlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBibSA9IGF3YWl0IGRhdGFVcmxUb0JpdG1hcChkYXRhVXJsKTtcbiAgICAvLyBEZXRlcm1pbmUgaG93IG11Y2ggb2YgVEhJUyBjaHVuayB0byBkcmF3LiBUaGUgbGFzdCBjaHVuayB1c3VhbGx5XG4gICAgLy8gb3ZlcmxhcHMgdGhlIHByZXZpb3VzIG9uZSAoYmVjYXVzZSB0b3RhbEggaXMgbm90IGEgdmlld3BvcnQgbXVsdGlwbGUpO1xuICAgIC8vIGRyYXdpbmcgdGhlIGZ1bGwgYml0bWFwIHdvdWxkIGR1cGxpY2F0ZSBwaXhlbHMuIFNvIHdlIGNyb3AgYnkgdGhlXG4gICAgLy8gcmVtYWluZGVyIG9mIHRoZSBwYWdlIGhlaWdodCB3aGVuIG9uIHRoZSB0YWlsLlxuICAgIGNvbnN0IHJlbWFpbmluZ1B4ID0gTWF0aC5yb3VuZCgodG90YWxIIC0geSkgKiBkcHIpO1xuICAgIGNvbnN0IGRyYXdTcmNIID0gTWF0aC5taW4oYm0uaGVpZ2h0LCByZW1haW5pbmdQeCk7XG4gICAgY29uc3QgZHJhd0Rlc3RIID0gTWF0aC5taW4odGFyZ2V0SHB4IC0gc3RpdGNoZWRIcHgsIGRyYXdTcmNIKTtcbiAgICBpZiAoZHJhd0Rlc3RIIDw9IDApIHsgdHJ1bmNhdGVkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICBjdHguZHJhd0ltYWdlKGJtLCAwLCAwLCBibS53aWR0aCwgZHJhd0Rlc3RILCAwLCBzdGl0Y2hlZEhweCwgYm0ud2lkdGgsIGRyYXdEZXN0SCk7XG4gICAgc3RpdGNoZWRIcHggKz0gZHJhd0Rlc3RIO1xuICAgIGNodW5rcysrO1xuICAgIHkgKz0gZ2VvbS52aDtcbiAgICBibS5jbG9zZT8uKCk7XG4gIH1cblxuICAvLyBSZXN0b3JlIHNjcm9sbC5cbiAgYXdhaXQgcmVzdG9yZVNjcm9sbCh0YWJJZCwgZ2VvbS5zeCwgZ2VvbS5zeSk7XG5cbiAgLy8gVHJpbSBjYW52YXMgdG8gYWN0dWFsIHN0aXRjaGVkIGhlaWdodCBpZiB3ZSBzdG9wcGVkIGJlZm9yZSB0YXJnZXRIcHguXG4gIGxldCBvdXRDYW52YXMgPSBjYW52YXM7XG4gIGlmIChzdGl0Y2hlZEhweCA8IHRhcmdldEhweCkge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoUHgsIE1hdGgubWF4KDEsIHN0aXRjaGVkSHB4KSk7XG4gICAgY29uc3QgdGN0eCA9IHRyaW1tZWQuZ2V0Q29udGV4dCgnMmQnKSE7XG4gICAgdGN0eC5kcmF3SW1hZ2UoY2FudmFzLCAwLCAwKTtcbiAgICBvdXRDYW52YXMgPSB0cmltbWVkO1xuICB9XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXNUb0Jsb2Iob3V0Q2FudmFzKTtcbiAgY29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XG4gIHJldHVybiB7YmxvYiwgYml0bWFwLCB0cnVuY2F0ZWR9O1xufTtcblxuLy8gRWxlbWVudC9ncm91cCBzaG90OiBoaWRlIG92ZXJsYXlzLCBjYXB0dXJlIHZpZXdwb3J0LCBjcm9wIGluIGNhbnZhcy5cbmNvbnN0IHNob3RFbGVtZW50Q29tbW9uID0gYXN5bmMgKFxuICB0YWJJZDogbnVtYmVyLFxuICB3aW5kb3dJZDogbnVtYmVyLFxuICBzZWxlY3RvcnM6IHN0cmluZ1tdLFxuICBwYWRkaW5nOiBudW1iZXIsXG4pOiBQcm9taXNlPHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0YWJVcmw6IHN0cmluZzsgY3JvcE1ldGE6IFNob3RSZXBseVsnY3JvcCddfSB8IG51bGw+ID0+IHtcbiAgY29uc3QgdGFiID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHRhYklkKTtcbiAgY29uc3QgdGFiVXJsID0gdGFiPy51cmwgPz8gJyc7XG4gIC8vIEl0ZW0gMTcgKGZsYXNoaW5nKTogaGlkZSArIGZyZWV6ZSBvdmVybGF5cyBCRUZPUkUgd2Ugc2Nyb2xsIHRoZSBwYWdlIHRvXG4gIC8vIGZyYW1lIHRoZSBjYXB0dXJlLiBUaGUgb2xkIG9yZGVyIHNjcm9sbGVkIGZpcnN0LCBzbyB0aGUgY29udGVudCBzY3JpcHQnc1xuICAvLyByaW5nIHJBRiBsb29wcyBjaGFzZWQgdGhlIG5ldyBzY3JvbGwgb2Zmc2V0IChhIHZpc2libGUganVtcCkgYmVmb3JlIHRoZXlcbiAgLy8gd2VyZSBoaWRkZW4sIGFuZCBhIGdyb3VwZWQgY2FwdHVyZSdzIG1hbnkgcmluZ3MgYW1wbGlmaWVkIHRoZSBmbGlja2VyLlxuICAvLyBIaWRpbmcgZmlyc3QgbWVhbnMgdGhlIHdob2xlIHNjcm9sbOKGknlpZWxk4oaSY2FwdHVyZeKGknJlc3RvcmUgd2luZG93IGhhcHBlbnNcbiAgLy8gd2l0aCB0aGUgb3ZlcmxheSBmcm96ZW4gYW5kIG91dCBvZiBsYXlvdXQg4oCUIG5vIG9uLXNjcmVlbiBmbGFzaC5cbiAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfSk7XG4gIC8vIFJlbWVtYmVyIHRoZSBvcGVyYXRvcidzIHNjcm9sbCBzbyBhIGNhcHR1cmUgbmV2ZXIgbGVhdmVzIHRoZSBwYWdlIG1vdmVkLlxuICAvLyBjb21wdXRlQW5kU2Nyb2xsIG9ubHkgc2Nyb2xscyB3aGVuIHRoZSB0YXJnZXQgaXMgb2ZmLXNjcmVlbiAoYSBncm91cFxuICAvLyB0aGF0IHNuYXBwZWQgcGFzdCB0aGUgZm9sZCk7IHdlIGFsd2F5cyByZXN0b3JlIGFmdGVyd2FyZCByZWdhcmRsZXNzLlxuICBjb25zdCBvcmlnU2Nyb2xsID0gYXdhaXQgcnVuSW5QYWdlPHt4OiBudW1iZXI7IHk6IG51bWJlcn0+KHRhYklkLCAoKSA9PiAoe3g6IHdpbmRvdy5zY3JvbGxYLCB5OiB3aW5kb3cuc2Nyb2xsWX0pKSA/PyB7eDogMCwgeTogMH07XG4gIGxldCBkYXRhVXJsOiBzdHJpbmc7XG4gIGxldCBiYm94OiBCYm94UmVzdWx0IHwgbnVsbCA9IG51bGw7XG4gIHRyeSB7XG4gICAgYmJveCA9IGF3YWl0IGNvbXB1dGVBbmRTY3JvbGwodGFiSWQsIHNlbGVjdG9ycywgcGFkZGluZyk7XG4gICAgaWYgKCFiYm94KSByZXR1cm4gbnVsbDtcbiAgICBhd2FpdCB5aWVsZFJhZih0YWJJZCk7XG4gICAgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKExPRywgJ2NhcHR1cmVWaXNpYmxlVGFiIGZhaWxlZCcsIGUpO1xuICAgIHJldHVybiBudWxsO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlc3RvcmVTY3JvbGwodGFiSWQsIG9yaWdTY3JvbGwueCwgb3JpZ1Njcm9sbC55KTtcbiAgICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnc2hvdy1vdmVybGF5cyd9KTtcbiAgfVxuXG4gIGNvbnN0IGJtID0gYXdhaXQgZGF0YVVybFRvQml0bWFwKGRhdGFVcmwpO1xuICAvLyBDb252ZXJ0IENTUy1waXhlbCBiYm94IOKGkiBkZXZpY2UtcGl4ZWwgYmJveDsgY2xhbXAgdG8gYml0bWFwIGJvdW5kcyBzb1xuICAvLyBhIHBhcnRpYWxseSBvZmYtc2NyZWVuIGVsZW1lbnQgZG9lc24ndCBjcmFzaCBkcmF3SW1hZ2UuXG4gIGNvbnN0IHN4ID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChiYm94LnggKiBiYm94LmRwcikpO1xuICBjb25zdCBzeSA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoYmJveC55ICogYmJveC5kcHIpKTtcbiAgY29uc3Qgc3cgPSBNYXRoLm1heCgxLCBNYXRoLm1pbihibS53aWR0aCAtIHN4LCBNYXRoLnJvdW5kKGJib3gudyAqIGJib3guZHByKSkpO1xuICBjb25zdCBzaCA9IE1hdGgubWF4KDEsIE1hdGgubWluKGJtLmhlaWdodCAtIHN5LCBNYXRoLnJvdW5kKGJib3guaCAqIGJib3guZHByKSkpO1xuICBjb25zdCBjYW52YXMgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHN3LCBzaCk7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcbiAgY3R4LmRyYXdJbWFnZShibSwgc3gsIHN5LCBzdywgc2gsIDAsIDAsIHN3LCBzaCk7XG4gIGJtLmNsb3NlPy4oKTtcbiAgY29uc3QgYmxvYiA9IGF3YWl0IGNhbnZhc1RvQmxvYihjYW52YXMpO1xuICBjb25zdCBiaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChibG9iKTtcbiAgLy8gQnVnICMzIGZyb20gdGhlIGV4cG9ydCByb2FzdDogc3VyZmFjZSBjcm9wIG1ldGFkYXRhIHNvIHJlY2VpdmVyc1xuICAvLyBjYW4gbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kIHRoZSBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzLlxuICAvLyBjc3NSZWN0ID0gcHJlLURQUiBDU1MgcGl4ZWwgcmVjdCBvZiB0aGUgY2FwdHVyZWQgcmVnaW9uLlxuICAvLyBkZXZpY2VQeFJlY3QgPSBwb3N0LURQUiBwaXhlbCByZWN0IGluc2lkZSB0aGUgc291cmNlIGJpdG1hcC5cbiAgLy8gaW1hZ2VTaXplID0gZGltZW5zaW9ucyBvZiB0aGUgcHJvZHVjZWQgUE5HLlxuICAvLyBkcHIgPSB0aGUgY29udmVyc2lvbiBmYWN0b3IuXG4gIGNvbnN0IGNyb3BNZXRhOiBTaG90UmVwbHlbJ2Nyb3AnXSA9IHtcbiAgICBjc3NSZWN0OiB7eDogYmJveC54LCB5OiBiYm94LnksIHc6IGJib3gudywgaDogYmJveC5ofSxcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBzeCwgeTogc3ksIHc6IHN3LCBoOiBzaH0sXG4gICAgaW1hZ2VTaXplOiB7dzogc3csIGg6IHNofSxcbiAgICBkcHI6IGJib3guZHByLFxuICAgIHBhZGRpbmcsXG4gICAgc2VsZWN0b3JzLFxuICB9O1xuICByZXR1cm4ge2Jsb2IsIGJpdG1hcCwgdGFiVXJsLCBjcm9wTWV0YX07XG59O1xuXG4vLyBQYWdlLW9ubHkgcGF0aC4gSGlkZXMgb3ZlcmxheXMsIHN0aXRjaGVzLCByZXN0b3Jlcy5cbmNvbnN0IHNob3RQYWdlQ29tbW9uID0gYXN5bmMgKFxuICB0YWJJZDogbnVtYmVyLFxuICB3aW5kb3dJZDogbnVtYmVyLFxuKTogUHJvbWlzZTx7YmxvYjogQmxvYjsgYml0bWFwOiBJbWFnZUJpdG1hcDsgdGFiVXJsOiBzdHJpbmc7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsPiA9PiB7XG4gIGNvbnN0IHRhYiA9IGF3YWl0IGNocm9tZS50YWJzLmdldCh0YWJJZCk7XG4gIGNvbnN0IHRhYlVybCA9IHRhYj8udXJsID8/ICcnO1xuICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnaGlkZS1vdmVybGF5cyd9KTtcbiAgbGV0IHN0aXRjaGVkOiB7YmxvYjogQmxvYjsgYml0bWFwOiBJbWFnZUJpdG1hcDsgdHJ1bmNhdGVkOiBib29sZWFufSB8IG51bGwgPSBudWxsO1xuICB0cnkge1xuICAgIHN0aXRjaGVkID0gYXdhaXQgc3RpdGNoUGFnZSh0YWJJZCwgd2luZG93SWQpO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHRlbGxDcyh0YWJJZCwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ30pO1xuICB9XG4gIGlmICghc3RpdGNoZWQpIHJldHVybiBudWxsO1xuICByZXR1cm4gey4uLnN0aXRjaGVkLCB0YWJVcmx9O1xufTtcblxuLy8gU2F2ZSB0aGUgYmxvYiBhcyBhIGRvd25sb2FkIHVuZGVyIC5waW5jaGdyYWIvPHdvcmtzcGFjZT4vPHN1YmRpcj4vLlxuLy9cbi8vIE1WMyBzZXJ2aWNlIHdvcmtlcnMgRE8gTk9UIGhhdmUgVVJMLmNyZWF0ZU9iamVjdFVSTCDigJQgY2FsbGluZyBpdCB0aHJvd3Ncbi8vIFwiVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYSBmdW5jdGlvblwiICh2ZXJpZmllZCBsaXZlIGluIGV4dGVuc2lvbi5zcGVjKS5cbi8vIFdlIGJhc2U2NC1lbmNvZGUgdGhlIGJsb2IgaW50byBhIGRhdGEgVVJMIGluc3RlYWQuIFRyYWRlb2ZmOiB0aGUgZGF0YVxuLy8gVVJMIGlzIH4zMyUgbGFyZ2VyIHRoYW4gcmF3IGJ5dGVzLCBhbmQgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBoYXMgYVxuLy8gZGF0YS1VUkwgc2l6ZSBsaW1pdCBzb21ld2hlcmUgYXJvdW5kIDMyIE1COyBmb3IgdHlwaWNhbCB3b3Jrc3BhY2Vcbi8vIGV4cG9ydHMgKHN1Yi1NQiBKU09OTCArIGxvdy1NQiBaSVBzKSB0aGlzIGlzIHdlbGwgdW5kZXIgdGhlIGxpbWl0LlxudHlwZSBTYXZlZEZpbGUgPSB7XG4gIHJlbFBhdGg6IHN0cmluZztcbiAgYWJzUGF0aDogc3RyaW5nO1xuICBjb3B5UGF0aDogc3RyaW5nO1xuICB0ZW1wUGF0aDogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86IGNocm9tZS5kb3dubG9hZHMuRG93bmxvYWRJdGVtWydzdGF0ZSddO1xufTtcblxuY29uc3QgaXNQbGF5d3JpZ2h0QXJ0aWZhY3RQYXRoID0gKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4gPT5cbiAgLyg/Ol58W1xcXFwvXSkoPzpwbGF5d3JpZ2h0LWFydGlmYWN0c3xwaW5jaGdyYWItZGwpLVteXFxcXC9dK1tcXFxcL11bMC05YS1mLV17OH0tWzAtOWEtZi1dezR9LVswLTlhLWYtXXs0fS1bMC05YS1mLV17NH0tWzAtOWEtZi1dezEyfSQvaS50ZXN0KHBhdGgpO1xuXG5jb25zdCBibG9iVG9EYXRhVXJsID0gYXN5bmMgKGJsb2I6IEJsb2IpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICBjb25zdCBidWYgPSBhd2FpdCBibG9iLmFycmF5QnVmZmVyKCk7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgLy8gQnVpbGQgYmFzZTY0IGluIDMyIEtpQiBjaHVua3Mgc28gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseSBkb2Vzbid0XG4gIC8vIG92ZXJmbG93IHRoZSBjYWxsIHN0YWNrIG9uIGxhcmdlIGlucHV0cy5cbiAgbGV0IGJpbmFyeSA9ICcnO1xuICBjb25zdCBjaHVuayA9IDB4ODBfMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IGNodW5rKSB7XG4gICAgYmluYXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgQXJyYXkuZnJvbShieXRlcy5zdWJhcnJheShpLCBpICsgY2h1bmspKSk7XG4gIH1cbiAgY29uc3QgbWltZSA9IGJsb2IudHlwZSB8fCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgcmV0dXJuIGBkYXRhOiR7bWltZX07YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG4vLyDilIDilIDilIAgUXVpZXQgc2F2ZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBXaXRoIHRoZSBvcHRpb25hbCBgZG93bmxvYWRzLnVpYCBwZXJtaXNzaW9uIGdyYW50ZWQgYW5kIHRoZSBxdWlldFNhdmVzXG4vLyBwcmVmIG9uLCBDaHJvbWUncyBkb3dubG9hZCBidWJibGUgaXMgc3VwcHJlc3NlZCB3aGlsZSBQaW5jaEdyYWIgd3JpdGVzIGl0c1xuLy8gb3duIGZpbGVzLCB0aGVuIHJlc3RvcmVkIGFmdGVyIGEgc2hvcnQgZGVib3VuY2Ugc28gYmFjay10by1iYWNrIGNhcHR1cmVzXG4vLyBkb24ndCBmbGFwIHRoZSBVSSBhbmQgdGhlIHVzZXIncyBvdGhlciBkb3dubG9hZHMga2VlcCB0aGVpciBzdXJmYWNlLlxuLy8gRGVwdGgtY291bnRlZDogY29uY3VycmVudCBzYXZlcyBzaGFyZSBvbmUgc3VwcHJlc3Npb24gd2luZG93LlxuY29uc3QgUVVJRVRfUkVTVE9SRV9NUyA9IDE1MDA7XG5sZXQgcXVpZXREZXB0aCA9IDA7XG5sZXQgcXVpZXRSZXN0b3JlVGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgdW5kZWZpbmVkO1xuY29uc3Qgc2V0RG93bmxvYWRVaSA9IChlbmFibGVkOiBib29sZWFuKTogdm9pZCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgYXBpID0gKGNocm9tZS5kb3dubG9hZHMgYXMgdW5rbm93biBhcyB7c2V0VWlPcHRpb25zPzogKG86IHtlbmFibGVkOiBib29sZWFufSkgPT4gUHJvbWlzZTx2b2lkPn0pLnNldFVpT3B0aW9ucztcbiAgICBpZiAoYXBpKSB2b2lkIGFwaS5jYWxsKGNocm9tZS5kb3dubG9hZHMsIHtlbmFibGVkfSkuY2F0Y2goKGU6IHVua25vd24pID0+IGNvbnNvbGUud2FybihMT0csICdzZXRVaU9wdGlvbnMnLCBlKSk7XG4gIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ3NldFVpT3B0aW9ucyB0aHJldycsIGUpOyB9XG59O1xuY29uc3QgcXVpZXRTYXZlc0FjdGl2ZSA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzdG9yZSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgncGluY2hncmFiLnByZWZzLnYyJyk7XG4gICAgY29uc3QgcHJlZnMgPSBzdG9yZVsncGluY2hncmFiLnByZWZzLnYyJ10gYXMge3F1aWV0U2F2ZXM/OiBib29sZWFufSB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIXByZWZzPy5xdWlldFNhdmVzKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5jb250YWlucyh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KTtcbiAgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxufTtcbmNvbnN0IGJlZ2luUXVpZXQgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gIGlmICghKGF3YWl0IHF1aWV0U2F2ZXNBY3RpdmUoKSkpIHJldHVybiBmYWxzZTtcbiAgcXVpZXREZXB0aCsrO1xuICBpZiAocXVpZXRSZXN0b3JlVGltZXIpIHsgY2xlYXJUaW1lb3V0KHF1aWV0UmVzdG9yZVRpbWVyKTsgcXVpZXRSZXN0b3JlVGltZXIgPSB1bmRlZmluZWQ7IH1cbiAgc2V0RG93bmxvYWRVaShmYWxzZSk7XG4gIHJldHVybiB0cnVlO1xufTtcbmNvbnN0IGVuZFF1aWV0ID0gKCk6IHZvaWQgPT4ge1xuICBpZiAocXVpZXREZXB0aCA+IDApIHF1aWV0RGVwdGgtLTtcbiAgaWYgKHF1aWV0RGVwdGggPT09IDApIHtcbiAgICBpZiAocXVpZXRSZXN0b3JlVGltZXIpIGNsZWFyVGltZW91dChxdWlldFJlc3RvcmVUaW1lcik7XG4gICAgcXVpZXRSZXN0b3JlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHsgcXVpZXRSZXN0b3JlVGltZXIgPSB1bmRlZmluZWQ7IHNldERvd25sb2FkVWkodHJ1ZSk7IH0sIFFVSUVUX1JFU1RPUkVfTVMpO1xuICB9XG59O1xuLy8gV29ya2VyLXN0YXJ0IHJlc3RvcmUgZ3VhcmQ6IGlmIGEgcHJldmlvdXMgd29ya2VyIGRpZWQgbWlkLXN1cHByZXNzaW9uIHRoZVxuLy8gYnViYmxlIHdvdWxkIHN0YXkgaGlkZGVuIGZvciBldmVyeSBkb3dubG9hZCBpbiB0aGUgYnJvd3Nlci4gc2V0VWlPcHRpb25zXG4vLyBzdGF0ZSBvdXRsaXZlcyB0aGUgd29ya2VyLCBzbyByZS1lbmFibGUgb24gZXZlcnkgc3RhcnQgKHBlcm1pc3Npb24tZ2F0ZWQsXG4vLyBuby1vcCBvdGhlcndpc2UpLlxudm9pZCBjaHJvbWUucGVybWlzc2lvbnM/LmNvbnRhaW5zKHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pXG4gIC50aGVuKChncmFudGVkKSA9PiB7IGlmIChncmFudGVkKSBzZXREb3dubG9hZFVpKHRydWUpOyB9KVxuICAuY2F0Y2goKCkgPT4geyAvKiBwZXJtaXNzaW9ucyBBUEkgdW5hdmFpbGFibGUgaW4gc29tZSBoYXJuZXNzZXMgKi8gfSk7XG5cbmNvbnN0IHNhdmVEb3dubG9hZCA9IGFzeW5jIChcbiAgYmxvYjogQmxvYixcbiAgd29ya3NwYWNlOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdzY3JlZW5zaG90cycsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCByZWxQYXRoID0gc3ViZGlyID8gYCR7c3ViZGlyfS8ke2ZpbGVuYW1lfWAgOiBmaWxlbmFtZTtcbiAgY29uc3QgZnVsbFBhdGggPSBgcGluY2hncmFiLyR7d29ya3NwYWNlfS8ke3JlbFBhdGh9YDtcbiAgY29uc29sZS5sb2coTE9HLCAnc2F2ZURvd25sb2FkIHN0YXJ0Jywge2Z1bGxQYXRoLCBtaW1lOiBibG9iLnR5cGUsIHNpemU6IGJsb2Iuc2l6ZX0pO1xuICBjb25zdCBxdWlldCA9IGF3YWl0IGJlZ2luUXVpZXQoKTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgc2F2ZURvd25sb2FkSW5uZXIoYmxvYiwgd29ya3NwYWNlLCByZWxQYXRoLCBmdWxsUGF0aCk7XG4gIH0gZmluYWxseSB7XG4gICAgaWYgKHF1aWV0KSBlbmRRdWlldCgpO1xuICB9XG59O1xuXG5jb25zdCBzYXZlRG93bmxvYWRJbm5lciA9IGFzeW5jIChcbiAgYmxvYjogQmxvYixcbiAgd29ya3NwYWNlOiBzdHJpbmcsXG4gIHJlbFBhdGg6IHN0cmluZyxcbiAgZnVsbFBhdGg6IHN0cmluZyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IHVybCA9IGF3YWl0IGJsb2JUb0RhdGFVcmwoYmxvYik7XG4gIGNvbnN0IGRvd25sb2FkSWQgPSBhd2FpdCBuZXcgUHJvbWlzZTxudW1iZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkKFxuICAgICAge3VybCwgZmlsZW5hbWU6IGZ1bGxQYXRoLCBjb25mbGljdEFjdGlvbjogJ292ZXJ3cml0ZSd9LFxuICAgICAgKGlkKSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgbGFzdEVycm9yOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSA/PyAnZG93bmxvYWQgZmFpbGVkJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCByZXR1cm5lZCBubyBpZCcpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2Rvd25sb2FkIHJldHVybmVkIG5vIGlkJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGlkKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgYWNjZXB0ZWQnLCB7aWQ6IGRvd25sb2FkSWQsIGZ1bGxQYXRofSk7XG4gIC8vIFJlc29sdmUgdGhlIE9TLWFic29sdXRlIHBhdGggYW5kIGRvIG5vdCByZXBvcnQgc3VjY2VzcyB1bnRpbCBDaHJvbWUgc2F5c1xuICAvLyB0aGUgZG93bmxvYWQgY29tcGxldGVkLiBgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZGAgb25seSBtZWFucyBcImFjY2VwdGVkXCI7XG4gIC8vIGRpc2stZnVsbCwgcGVybWlzc2lvbiwgb3IgaW50ZXJydXB0ZWQgd3JpdGVzIHN1cmZhY2UgbGF0ZXIgdGhyb3VnaFxuICAvLyBkb3dubG9hZHMuc2VhcmNoLlxuICBsZXQgYWJzUGF0aCA9IGAke3dvcmtzcGFjZX0vJHtyZWxQYXRofWA7XG4gIGxldCBkb3dubG9hZFN0YXRlOiBjaHJvbWUuZG93bmxvYWRzLkRvd25sb2FkSXRlbVsnc3RhdGUnXSB8IHVuZGVmaW5lZDtcbiAgbGV0IGludGVycnVwdGVkRXJyb3IgPSAnJztcbiAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCAxMDA7IGF0dGVtcHQrKykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IGNocm9tZS5kb3dubG9hZHMuc2VhcmNoKHtpZDogZG93bmxvYWRJZH0pO1xuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zPy5bMF07XG4gICAgICBpZiAoaXRlbT8uZmlsZW5hbWUpIGFic1BhdGggPSBpdGVtLmZpbGVuYW1lO1xuICAgICAgZG93bmxvYWRTdGF0ZSA9IGl0ZW0/LnN0YXRlO1xuICAgICAgaWYgKGl0ZW0/LnN0YXRlID09PSAnaW50ZXJydXB0ZWQnKSB7XG4gICAgICAgIGludGVycnVwdGVkRXJyb3IgPSBgZG93bmxvYWQgaW50ZXJydXB0ZWQke2l0ZW0uZXJyb3IgPyBgOiAke2l0ZW0uZXJyb3J9YCA6ICcnfWA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0/LnN0YXRlID09PSAnY29tcGxldGUnICYmIGl0ZW0uZmlsZW5hbWUpIGJyZWFrO1xuICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy5zZWFyY2ggdGhyZXc6JywgZSk7IH1cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAxMDApKTtcbiAgfVxuICBpZiAoaW50ZXJydXB0ZWRFcnJvcikgdGhyb3cgbmV3IEVycm9yKGludGVycnVwdGVkRXJyb3IpO1xuICBpZiAoZG93bmxvYWRTdGF0ZSAhPT0gJ2NvbXBsZXRlJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgZG93bmxvYWQgZGlkIG5vdCBjb21wbGV0ZSR7ZG93bmxvYWRTdGF0ZSA/IGAgKHN0YXRlOiAke2Rvd25sb2FkU3RhdGV9KWAgOiAnJ31gKTtcbiAgfVxuICBjb25zdCB0ZW1wUGF0aCA9IGlzUGxheXdyaWdodEFydGlmYWN0UGF0aChhYnNQYXRoKTtcbiAgLy8gUGxheXdyaWdodCByZXdyaXRlcyBDaHJvbWUgZG93bmxvYWRzIHRvIGV4dGVuc2lvbmxlc3MgVVVJRCBmaWxlcyB1bmRlclxuICAvLyAvdG1wL3BsYXl3cmlnaHQtYXJ0aWZhY3RzLSo7IGNvcHlpbmcgdGhhdCB0byB0aGUgdXNlciBpcyBjb25mdXNpbmcgYW5kXG4gIC8vIG9mdGVuIHN0YWxlLiBLZWVwIGl0IGluIGFic1BhdGggZm9yIHRlc3RzL2RlYnVnZ2luZywgYnV0IGV4cG9zZSB0aGVcbiAgLy8gaW50ZW5kZWQgYnJvd3NlciBkb3dubG9hZCB0YXJnZXQgZm9yIHRoZSBzaWRlIHBhbmVsJ3MgY2xpcGJvYXJkIGFjdGlvbi5cbiAgY29uc3QgY29weVBhdGggPSB0ZW1wUGF0aCA/IGB+L0Rvd25sb2Fkcy8ke2Z1bGxQYXRofWAgOiBhYnNQYXRoO1xuICBjb25zb2xlLmxvZyhMT0csICdzYXZlRG93bmxvYWQgcmV0dXJuaW5nJywge3JlbFBhdGgsIGFic1BhdGgsIGNvcHlQYXRoLCB0ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZX0pO1xuICByZXR1cm4ge3JlbFBhdGg6IGAke3dvcmtzcGFjZX0vJHtyZWxQYXRofWAsIGFic1BhdGgsIGNvcHlQYXRoLCB0ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZX07XG59O1xuXG5jb25zdCBzYXZlVGV4dERvd25sb2FkID0gYXN5bmMgKFxuICB0ZXh0OiBzdHJpbmcsXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBtaW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdleHBvcnRzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHt0eXBlOiBtaW1lfSk7XG4gIHJldHVybiBzYXZlRG93bmxvYWQoYmxvYiwgd29ya3NwYWNlLCBmaWxlbmFtZSwgc3ViZGlyKTtcbn07XG5cbmNvbnN0IHNhdmVCeXRlc0Rvd25sb2FkID0gYXN5bmMgKFxuICBieXRlczogVWludDhBcnJheSxcbiAgd29ya3NwYWNlOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIG1pbWU6IHN0cmluZyxcbiAgc3ViZGlyID0gJ2V4cG9ydHMnLFxuKTogUHJvbWlzZTxTYXZlZEZpbGU+ID0+IHtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtieXRlcyBhcyB1bmtub3duIGFzIEJsb2JQYXJ0XSwge3R5cGU6IG1pbWV9KTtcbiAgcmV0dXJuIHNhdmVEb3dubG9hZChibG9iLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBzdWJkaXIpO1xufTtcblxuLy8g4pSA4pSA4pSAIFNlcnZpY2UgcmVxdWVzdHMgKyByZWxheSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnOiBQZ0VudmVsb3BlPEFueU1lc3NhZ2U+IHwgYW55LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChtc2cua2luZCA9PT0gJ2NhcHR1cmUtc2NyZWVuc2hvdCcpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gbXNnLnRhYklkID8gW2F3YWl0IGNocm9tZS50YWJzLmdldChtc2cudGFiSWQpXVxuICAgICAgICAgIDogYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBjb25zdCB0YWIgPSB0YWJzWzBdO1xuICAgICAgICBpZiAoIXRhYj8ud2luZG93SWQpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIodGFiLndpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe2RhdGFVcmx9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pOyB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnLmtpbmQgPT09ICdzd2l0Y2gtdG8tdGFiJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7dXJsOiBtc2cudXJsfSk7XG4gICAgICAgIGlmICh0YWJzLmxlbmd0aCAmJiB0YWJzWzBdPy5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMudXBkYXRlKHRhYnNbMF0uaWQsIHthY3RpdmU6IHRydWV9KTtcbiAgICAgICAgICBpZiAodGFic1swXS53aW5kb3dJZCAhPSBudWxsKSBhd2FpdCBjaHJvbWUud2luZG93cy51cGRhdGUodGFic1swXS53aW5kb3dJZCwge2ZvY3VzZWQ6IHRydWV9KTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiB0cnVlfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm9wZW5JZk1pc3NpbmcpIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHt1cmw6IG1zZy51cmwsIGFjdGl2ZTogdHJ1ZX0pO1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7Zm91bmQ6IGZhbHNlLCBvcGVuZWQ6IHQuaWR9KTtcbiAgICAgICAgfSBlbHNlIHNlbmRSZXNwb25zZSh7Zm91bmQ6IGZhbHNlfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZy5raW5kID09PSAnbGlzdC1vcGVuLXRhYnMnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHt0YWJzOiB0YWJzLmZpbHRlcigodCkgPT4gdC51cmwpLm1hcCgodCkgPT4gKHtpZDogdC5pZCwgdXJsOiB0LnVybCwgdGl0bGU6IHQudGl0bGV9KSl9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSwgdGFiczogW119KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAobXNnLmtpbmQgPT09ICdzaG90LWVsZW1lbnQnIHx8IG1zZy5raW5kID09PSAnc2hvdC1ncm91cCcgfHwgbXNnLmtpbmQgPT09ICdzaG90LXBhZ2UnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFiSWQgPSBtc2cudGFiSWQgPz8gc2VuZGVyLnRhYj8uaWQ7XG4gICAgICAgIGxldCByZXNvbHZlZFRhYklkID0gdGFiSWQ7XG4gICAgICAgIGxldCB3aW5kb3dJZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAocmVzb2x2ZWRUYWJJZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgICByZXNvbHZlZFRhYklkID0gdGFic1swXT8uaWQ7XG4gICAgICAgICAgd2luZG93SWQgPSB0YWJzWzBdPy53aW5kb3dJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHJlc29sdmVkVGFiSWQpO1xuICAgICAgICAgIHdpbmRvd0lkID0gdD8ud2luZG93SWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCB8fCB3aW5kb3dJZCA9PSBudWxsKSB7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnbm8gYWN0aXZlIHRhYid9IHNhdGlzZmllcyBTaG90UmVwbHkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YWJJZEZpbmFsID0gcmVzb2x2ZWRUYWJJZDtcbiAgICAgICAgY29uc3Qgd2luZG93SWRGaW5hbCA9IHdpbmRvd0lkO1xuICAgICAgICBhd2FpdCBlbnF1ZXVlKHRhYklkRmluYWwsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBydW5TaG90KG1zZywgdGFiSWRGaW5hbCwgd2luZG93SWRGaW5hbCk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UocmVwbHkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gc2F0aXNmaWVzIFNob3RSZXBseSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBzYXRpc2ZpZXMgU2hvdFJlcGx5KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gRnVsbC1wYWdlIHNuYXBzaG90IGZvciB0aGUgcGFnZS1zbmFwc2hvdCBmZWF0dXJlLiBSZXVzZXMgdGhlIHNhbWVcbiAgLy8gaGlkZS1vdmVybGF5cyDihpIgc3RpdGNoIOKGkiByZXN0b3JlIHBhdGggYXMgc2hvdC1wYWdlLCBidXQgcmV0dXJucyB0aGUgUE5HXG4gIC8vIGFzIGEgZGF0YSBVUkwgaW5zdGVhZCBvZiB3cml0aW5nIGEgZmlsZS4gU2VyaWFsaXplZCBwZXIgdGFiIHRocm91Z2ggdGhlXG4gIC8vIHNhbWUgcXVldWUgc28gaXQgY2FuJ3QgcmFjZSBhIGNvbmN1cnJlbnQgZWxlbWVudC9ncm91cCBjYXB0dXJlLlxuICBpZiAobXNnLmtpbmQgPT09ICdwYWdlLXNuYXBzaG90LXNob3QnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFiSWQgPSBtc2cudGFiSWQgPz8gc2VuZGVyLnRhYj8uaWQ7XG4gICAgICAgIGxldCByZXNvbHZlZFRhYklkID0gdGFiSWQ7XG4gICAgICAgIGxldCB3aW5kb3dJZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAocmVzb2x2ZWRUYWJJZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgICByZXNvbHZlZFRhYklkID0gdGFic1swXT8uaWQ7XG4gICAgICAgICAgd2luZG93SWQgPSB0YWJzWzBdPy53aW5kb3dJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHJlc29sdmVkVGFiSWQpO1xuICAgICAgICAgIHdpbmRvd0lkID0gdD8ud2luZG93SWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCB8fCB3aW5kb3dJZCA9PSBudWxsKSB7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnbm8gYWN0aXZlIHRhYid9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFiSWRGaW5hbCA9IHJlc29sdmVkVGFiSWQ7XG4gICAgICAgIGNvbnN0IHdpbmRvd0lkRmluYWwgPSB3aW5kb3dJZDtcbiAgICAgICAgYXdhaXQgZW5xdWV1ZSh0YWJJZEZpbmFsLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RQYWdlQ29tbW9uKHRhYklkRmluYWwsIHdpbmRvd0lkRmluYWwpO1xuICAgICAgICAgICAgaWYgKCFnb3QpIHsgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfSk7IHJldHVybjsgfVxuICAgICAgICAgICAgY29uc3Qgc2NyZWVuc2hvdCA9IGF3YWl0IGJsb2JUb0Z1bGxEYXRhVXJsKGdvdC5ibG9iKTtcbiAgICAgICAgICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgICAgICAgICAgLy8gYHRydW5jYXRlZGAgaGVyZSBtZWFucyB0aGUgc3RpdGNoIHN0b3BwZWQgZWFybHkgKGNodW5rL3BpeGVsXG4gICAgICAgICAgICAvLyBjYXApIOKAlCB0aGUgUE5HIGNvdmVycyBvbmx5IHBhcnQgb2YgdGhlIGRvY3VtZW50LCB3aGljaCBpc1xuICAgICAgICAgICAgLy8gZXhhY3RseSB0aGUgYHBhcnRpYWxgIHNpZ25hbCB0aGUgUGFnZVNuYXBzaG90IGNvbnRyYWN0IHdhbnRzLlxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogdHJ1ZSwgc2NyZWVuc2hvdCwgcGFydGlhbDogZ290LnRydW5jYXRlZH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBQYW5lbC10cmlnZ2VyZWQgY29udGVudC1zY3JpcHQgKHJlKWluamVjdGlvbiDigJQgdGhlIHJlY292ZXJ5IHBhdGggZm9yXG4gIC8vIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIChleHRlbnNpb24gcmVsb2FkIG9ycGhhbmVkIHRoZSBwYWdlJ3Mgc2NyaXB0KS5cbiAgaWYgKG1zZy5raW5kID09PSAncGctcmVpbmplY3QnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHRhYklkOiBudW1iZXIgfCB1bmRlZmluZWQgPSBtc2cudGFiSWQ7XG4gICAgICAgIGlmICh0YWJJZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgICB0YWJJZCA9IHRhYnNbMF0/LmlkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWJJZCA9PSBudWxsKSB7IHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICAgICAgICBpZiAodGFiLnVybCAmJiAhL15odHRwcz86Ly50ZXN0KHRhYi51cmwpKSB7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBgY2Fubm90IGF0dGFjaCB0byAke3RhYi51cmx9YH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe3RhcmdldDoge3RhYklkLCBhbGxGcmFtZXM6IGZhbHNlfSwgZmlsZXM6IFsnY29udGVudC1zY3JpcHQuanMnXSwgaW5qZWN0SW1tZWRpYXRlbHk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgdHJhY2tBY3RpdmVUYWIodGFiSWQpO1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiB0cnVlLCB0YWJJZH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKG1zZy5raW5kID09PSAnc2F2ZS10ZXh0JyB8fCBtc2cua2luZCA9PT0gJ3NhdmUtYnl0ZXMnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHN0b3JlZDogU2F2ZWRGaWxlO1xuICAgICAgICBjb25zdCB3b3Jrc3BhY2UgPSBTdHJpbmcobXNnLndvcmtzcGFjZSA/PyAnZGVmYXVsdCcpO1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IFN0cmluZyhtc2cuZmlsZW5hbWUgPz8gJ2V4cG9ydC5iaW4nKTtcbiAgICAgICAgY29uc3QgbWltZSA9IFN0cmluZyhtc2cubWltZSA/PyAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyk7XG4gICAgICAgIGNvbnN0IHN1YmRpciA9IFN0cmluZyhtc2cuc3ViZGlyID8/ICdleHBvcnRzJyk7XG4gICAgICAgIGlmIChtc2cua2luZCA9PT0gJ3NhdmUtdGV4dCcpIHtcbiAgICAgICAgICBzdG9yZWQgPSBhd2FpdCBzYXZlVGV4dERvd25sb2FkKFN0cmluZyhtc2cudGV4dCA/PyAnJyksIHdvcmtzcGFjZSwgZmlsZW5hbWUsIG1pbWUsIHN1YmRpcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRGVmZW5zaXZlIGRlY29kZTogY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UgY2FuIGRlbGl2ZXIgYnl0ZXNcbiAgICAgICAgICAvLyBhcyBhIFVpbnQ4QXJyYXksIGEgbnVtYmVyW10sIG9yIGEgZ2VuZXJpYyBpbmRleGVkIG9iamVjdFxuICAgICAgICAgIC8vIChkZXBlbmRpbmcgb24gQ2hyb21lIHZlcnNpb24gKyBjYWxsZXIpLiBBY2NlcHQgYWxsIHNoYXBlcy5cbiAgICAgICAgICBjb25zdCByYXc6IGFueSA9IG1zZy5ieXRlcztcbiAgICAgICAgICBsZXQgYnl0ZXM6IFVpbnQ4QXJyYXk7XG4gICAgICAgICAgaWYgKHJhdyBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIGJ5dGVzID0gcmF3O1xuICAgICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgYnl0ZXMgPSBVaW50OEFycmF5LmZyb20ocmF3KTtcbiAgICAgICAgICBlbHNlIGlmIChyYXcgJiYgdHlwZW9mIHJhdyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHJhdykgYXMgbnVtYmVyW107XG4gICAgICAgICAgICBieXRlcyA9IFVpbnQ4QXJyYXkuZnJvbSh2YWxzKTtcbiAgICAgICAgICB9IGVsc2UgYnl0ZXMgPSBuZXcgVWludDhBcnJheSgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmUtYnl0ZXMgZGVjb2RlZCcsIHtieXRlczogYnl0ZXMubGVuZ3RoLCByYXdUeXBlOiB0eXBlb2YgcmF3LCBpc0FycmF5OiBBcnJheS5pc0FycmF5KHJhdyksIGlzVTg6IHJhdyBpbnN0YW5jZW9mIFVpbnQ4QXJyYXl9KTtcbiAgICAgICAgICBzdG9yZWQgPSBhd2FpdCBzYXZlQnl0ZXNEb3dubG9hZChieXRlcywgd29ya3NwYWNlLCBmaWxlbmFtZSwgbWltZSwgc3ViZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIEF1dG8tb3BlbiB0aGUgc2lkZSBwYW5lbCBvbiBmaXJzdCBjYXB0dXJlL3N0YWdpbmcuIENocm9tZSAxMTYrIHByb3BhZ2F0ZXNcbiAgLy8gdGhlIHVzZXIgYWN0aXZhdGlvbiB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIHNvIHRoaXMgZG9lc24ndFxuICAvLyB0aHJvdyDigJQgdGhlIGNsaWNrIHRoYXQgdHJpZ2dlcmVkIHRoZSBjYXB0dXJlIGluIHRoZSBjb250ZW50IHNjcmlwdCBpc1xuICAvLyBzdGlsbCBjb25zaWRlcmVkIFwibGl2ZVwiIGhlcmUgaW4gdGhlIHdvcmtlci5cbiAgLy9cbiAgLy8gSU5WRVNUSUdBVEUtMSAoZmlyc3QtY2FwdHVyZSByYWNlKTogb24gdGhlIFZFUlkgRklSU1QgQWx0K0NsaWNrIHRoZSBwYW5lbFxuICAvLyBkb2N1bWVudCBkb2Vzbid0IGV4aXN0IHlldCwgc28gaXRzIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZSBsaXN0ZW5lciBpc24ndFxuICAvLyByZWdpc3RlcmVkLiBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBvbmx5IHJlYWNoZXMgbGlzdGVuZXJzIHRoYXQgYXJlXG4gIC8vIGFscmVhZHkgbGl2ZSwgc28gdGhpcyBmaXJzdCBjYXB0dXJlIGlzIGRyb3BwZWQg4oCUIHRoZSB1c2VyIGhhcyB0byBjbGljayBhXG4gIC8vIHNlY29uZCB0aW1lIChwYW5lbCBub3cgbGlzdGVuaW5nKSB0byBzZWUgaXQuIFRoZSByb2J1c3QgZml4IGlzIGEgcGFuZWzihpJiZ1xuICAvLyBcInBhbmVsLXJlYWR5LCBzZW5kIG1lIGFueXRoaW5nIHBlbmRpbmdcIiBoYW5kc2hha2UsIGJ1dCB0aGF0IG5lZWRzIGFcbiAgLy8gc2lkZXBhbmVsLnRzIGNoYW5nZSAocmVwb3J0ZWQgc2VwYXJhdGVseSkuIEFzIGEgYmFja2dyb3VuZC1vbmx5LCBsb3ctcmlza1xuICAvLyBtaXRpZ2F0aW9uIHdlIHJlLWJyb2FkY2FzdCB0aGUgZmlyc3QgY2FwdHVyZShzKSBhIGZldyB0aW1lcyBvdmVyIGEgc2hvcnRcbiAgLy8gd2luZG93IEFGVEVSIG9wZW5pbmcgdGhlIHBhbmVsLiBUaGUgcGFuZWwgcmVnaXN0ZXJzIGl0cyBvbk1lc3NhZ2UgbGlzdGVuZXJcbiAgLy8gc3luY2hyb25vdXNseSBhdCBzY3JpcHQtZXZhbCAoYmVmb3JlIGl0cyBhc3luYyBsb2FkQWxsKSwgYW5kIGl0IGFscmVhZHlcbiAgLy8gYnVmZmVycyBtZXNzYWdlcyB1bnRpbCByZWFkeSBBTkQgZGVkdXBlcyBieSBfX21pZCDigJQgc28gYSByZXBsYXkgdGhhdCBsYW5kc1xuICAvLyBhZnRlciB0aGUgbGlzdGVuZXIgZXhpc3RzIGlzIHByb2Nlc3NlZCBleGFjdGx5IG9uY2UsIGFuZCByZXBsYXlzIHRoYXQgbG9zZVxuICAvLyB0aGUgcmFjZSBhcmUgaGFybWxlc3Mgbm8tb3BzLlxuICAvL1xuICAvLyBXZSBndWFyZCBvbiBgc2VuZGVyLnRhYj8uaWQgIT0gbnVsbGAgc28gb3VyIE9XTiByZXBsYXlzICh3aGljaCBoYXZlIG5vXG4gIC8vIHNlbmRlci50YWIpIG5ldmVyIHJlLWVudGVyIHRoaXMgYnJhbmNoIOKAlCBubyBvcGVuL3JlcGxheSBsb29wLlxuICBpZiAoKG1zZy5raW5kID09PSAnY2FwdHVyZScgfHwgbXNnLmtpbmQgPT09ICdwZW5kaW5nLWFkZCcpICYmIHNlbmRlci50YWI/LmlkICE9IG51bGwpIHtcbiAgICBjaHJvbWUuc2lkZVBhbmVsLm9wZW4oe3RhYklkOiBzZW5kZXIudGFiLmlkfSkuY2F0Y2goKCkgPT4geyAvKiBhbHJlYWR5IG9wZW4gKi8gfSk7XG4gICAgLy8gQWx3YXlzIHJlcGxheSDigJQgd2UgY2FuJ3QgcmVsaWFibHkgdGVsbCBmcm9tIGhlcmUgd2hldGhlciB0aGUgcGFuZWwgd2FzXG4gICAgLy8gYWxyZWFkeSBsaXN0ZW5pbmcgKHNpZGVQYW5lbCBoYXMgbm8gXCJpcy1vcGVuXCIgQVBJLCBhbmQgb3BlbigpIHJlc29sdmluZ1xuICAgIC8vIHZzIHJlamVjdGluZyBpcyBub3QgYSBjbGVhbiBzaWduYWwgYWNyb3NzIENocm9tZSB2ZXJzaW9ucyAvIGdlc3R1cmVcbiAgICAvLyBzdGF0ZXMpLiBPdmVyLXJlcGxheWluZyB3aGVuIHRoZSBwYW5lbCBpcyBhbHJlYWR5IHVwIGlzIGhhcm1sZXNzOiB0aGVcbiAgICAvLyBwYW5lbCBkZWR1cGVzIGJ5IF9fbWlkLCBzbyB0aGUgcmVkdW5kYW50IGJyb2FkY2FzdHMgY29sbGFwc2UgdG8gbm90aGluZy5cbiAgICAvLyBVbmRlci1yZXBsYXlpbmcgd291bGQgcmVzdXJyZWN0IHRoZSBkcm9wcGVkLWZpcnN0LWNhcHR1cmUgYnVnLCBzbyB3ZSBlcnJcbiAgICAvLyB0b3dhcmQgYWx3YXlzIHJlcGxheWluZy4gVGhlIHdpbmRvdyBpcyBzaG9ydCBhbmQgYm91bmRlZCAoMyBzZW5kcykuXG4gICAgcmVwbGF5Rmlyc3RDYXB0dXJlKG1zZyBhcyBQZ0VudmVsb3BlPEFueU1lc3NhZ2U+KTtcbiAgfVxuXG4gIC8vIE5vIHBvcnQgcmVsYXk6IHRoZSBzaWRlIHBhbmVsIGxpc3RlbnMgZGlyZWN0bHkgb24gY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLFxuICAvLyB3aGljaCBhbHJlYWR5IHJlY2VpdmVzIGJyb2FkY2FzdHMgZnJvbSBjb250ZW50IHNjcmlwdHMuIFJlbGF5aW5nIHRocm91Z2hcbiAgLy8gYSBwb3J0IGNhdXNlcyBldmVyeSBtZXNzYWdlIHRvIGJlIGRlbGl2ZXJlZCB0d2ljZSDigJQgdGhhdCBzdXJmYWNlZCBhc1xuICAvLyBkdXBsaWNhdGVkIG11bHRpLXNlbGVjdCBlbnRyaWVzIGluIHByb2R1Y3Rpb24uXG4gIHJldHVybiBmYWxzZTtcbn0pO1xuXG4vLyBSZS1icm9hZGNhc3QgYSBjYXB0dXJlL3BlbmRpbmctYWRkIGVudmVsb3BlIGEgZmV3IHRpbWVzIG92ZXIgYSBzaG9ydCB3aW5kb3dcbi8vIHNvIGEgZnJlc2hseS1vcGVuZWQgc2lkZSBwYW5lbCAod2hvc2UgbGlzdGVuZXIgcmVnaXN0ZXJzIGEgZmV3IG1zIGFmdGVyIHRoZVxuLy8gZG9jdW1lbnQgc3RhcnRzIGxvYWRpbmcpIGNhdGNoZXMgaXQuIFNhbWUgX19taWQgZWFjaCB0aW1lIOKGkiB0aGUgcGFuZWwnc1xuLy8gcmVjZW50TWlkcyByaW5nIGRlZHVwZXMgdG8gYSBzaW5nbGUgcHJvY2Vzc2VkIG1lc3NhZ2UuIEJvdW5kZWQgKG5vIGxvb3ApOlxuLy8gdGhyZWUgYXR0ZW1wdHMgaW5zaWRlIH40NTBtcywgdGhlbiB3ZSBzdG9wLiBSZXNlbmRpbmcgdGhlIFNBTUUgZW52ZWxvcGUgaXNcbi8vIGltcG9ydGFudCDigJQgYSBuZXcgX19taWQgd291bGQgZGVmZWF0IHRoZSBkZWR1cCBhbmQgZG91YmxlLWluc2VydC5cbmNvbnN0IFJFUExBWV9ERUxBWVNfTVMgPSBbNjAsIDE4MCwgNDUwXTtcbmNvbnN0IHJlcGxheUZpcnN0Q2FwdHVyZSA9IChlbnZlbG9wZTogUGdFbnZlbG9wZTxBbnlNZXNzYWdlPik6IHZvaWQgPT4ge1xuICBmb3IgKGNvbnN0IGRlbGF5IG9mIFJFUExBWV9ERUxBWVNfTVMpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIHNlbmRNZXNzYWdlIHdpdGggbm8gY2FsbGJhY2s7IHRoZSBwYW5lbCBjb25zdW1lcyBpdC4gV3JhcHBlZCBzbyBhXG4gICAgICAvLyBcInJlY2VpdmluZyBlbmQgZG9lcyBub3QgZXhpc3RcIiByZWplY3Rpb24gKHBhbmVsIHN0aWxsIG5vdCB1cCBvbiB0aGVcbiAgICAgIC8vIGVhcmxpZXN0IGF0dGVtcHQpIGlzIHN3YWxsb3dlZCByYXRoZXIgdGhhbiBsb2dnZWQgYXMgYW4gZXJyb3IuXG4gICAgICB0cnkgeyB2b2lkIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGVudmVsb3BlKS5jYXRjaD8uKCgpID0+IHsgLyogbm90IHVwIHlldCAqLyB9KTsgfVxuICAgICAgY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0sIGRlbGF5KTtcbiAgfVxufTtcblxuLy8gRW5jb2RlIGEgUE5HIGJsb2IgaW50byBhIGJhc2U2NCBkYXRhIFVSTCB1c2luZyB0aGUgc2FtZSBjaHVua2VkLWJ0b2Fcbi8vIHBhdGggc2F2ZURvd25sb2FkIHVzZXMuIFRoZSByZXN1bHQgaXMgdHdvIHB1cnBvc2VzLWluLW9uZTogdGhlXG4vLyBkb3duc2NhbGVkIHRodW1ibmFpbCBnb2VzIGJhY2sgdG8gdGhlIHNpZGUgcGFuZWwncyBwcmV2aWV3IHRpbGUgKHNtYWxsLFxuLy8gfjUtMTUgS0IpLCB3aGlsZSB0aGUgRlVMTCBwbmcgYWxzbyByaWRlcyBiYWNrIHNvIHRoZSBwYW5lbCBjYW4gc3Rhc2ggaXRcbi8vIGluIGBzaG90c0Z1bGxgIGFuZCBidW5kbGUgaXQgaW50byB0aGUgd29ya3NwYWNlIC50YXIuenN0IGV4cG9ydCBsYXRlci5cbmNvbnN0IGJsb2JUb0Z1bGxEYXRhVXJsID0gYXN5bmMgKGJsb2I6IEJsb2IpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICBjb25zdCBidWYgPSBhd2FpdCBibG9iLmFycmF5QnVmZmVyKCk7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgbGV0IGJpbmFyeSA9ICcnO1xuICBjb25zdCBjaHVuayA9IDB4ODBfMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IGNodW5rKSB7XG4gICAgYmluYXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgQXJyYXkuZnJvbShieXRlcy5zdWJhcnJheShpLCBpICsgY2h1bmspKSk7XG4gIH1cbiAgcmV0dXJuIGBkYXRhOmltYWdlL3BuZztiYXNlNjQsJHtidG9hKGJpbmFyeSl9YDtcbn07XG5cbmNvbnN0IHJ1blNob3QgPSBhc3luYyAobXNnOiBhbnksIHRhYklkOiBudW1iZXIsIHdpbmRvd0lkOiBudW1iZXIpOiBQcm9taXNlPFNob3RSZXBseT4gPT4ge1xuICBjb25zdCB0cyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgY29uc3QgcGFkZGluZyA9IHR5cGVvZiBtc2cucGFkZGluZyA9PT0gJ251bWJlcicgPyBtc2cucGFkZGluZyA6IDI0O1xuICBpZiAobXNnLmtpbmQgPT09ICdzaG90LWVsZW1lbnQnKSB7XG4gICAgY29uc3QgZ290ID0gYXdhaXQgc2hvdEVsZW1lbnRDb21tb24odGFiSWQsIHdpbmRvd0lkLCBbbXNnLnNlbGVjdG9yXSwgcGFkZGluZyk7XG4gICAgaWYgKCFnb3QpIHJldHVybiB7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ307XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEZpbGVuYW1lKCdlbGVtZW50JywgdHMsIG1zZy5uLCBnb3QudGFiVXJsKTtcbiAgICBjb25zdCBzdG9yZWQgPSBhd2FpdCBzYXZlRG93bmxvYWQoZ290LmJsb2IsIG1zZy53b3Jrc3BhY2UsIGZpbGVuYW1lKTtcbiAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgbWFrZVRodW1ibmFpbChnb3QuYml0bWFwKTtcbiAgICBjb25zdCBmdWxsRGF0YVVybCA9IGF3YWl0IGJsb2JUb0Z1bGxEYXRhVXJsKGdvdC5ibG9iKTtcbiAgICBnb3QuYml0bWFwLmNsb3NlPy4oKTtcbiAgICByZXR1cm4ge1xuICAgICAgb2s6IHRydWUsIGZpbGVuYW1lOiBzdG9yZWQucmVsUGF0aCwgYWJzUGF0aDogc3RvcmVkLmFic1BhdGgsXG4gICAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICAgIGRhdGFVcmwsIGZ1bGxEYXRhVXJsLFxuICAgICAgY3JvcDogZ290LmNyb3BNZXRhLFxuICAgIH07XG4gIH1cbiAgaWYgKG1zZy5raW5kID09PSAnc2hvdC1ncm91cCcpIHtcbiAgICBjb25zdCBnb3QgPSBhd2FpdCBzaG90RWxlbWVudENvbW1vbih0YWJJZCwgd2luZG93SWQsIG1zZy5zZWxlY3RvcnMsIHBhZGRpbmcpO1xuICAgIGlmICghZ290KSByZXR1cm4ge29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9O1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRGaWxlbmFtZSgnZ3JvdXAnLCB0cywgbXNnLm4sIGdvdC50YWJVcmwsIHtjb3VudDogbXNnLnNlbGVjdG9ycy5sZW5ndGh9KTtcbiAgICBjb25zdCBzdG9yZWQgPSBhd2FpdCBzYXZlRG93bmxvYWQoZ290LmJsb2IsIG1zZy53b3Jrc3BhY2UsIGZpbGVuYW1lKTtcbiAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgbWFrZVRodW1ibmFpbChnb3QuYml0bWFwKTtcbiAgICBjb25zdCBmdWxsRGF0YVVybCA9IGF3YWl0IGJsb2JUb0Z1bGxEYXRhVXJsKGdvdC5ibG9iKTtcbiAgICBnb3QuYml0bWFwLmNsb3NlPy4oKTtcbiAgICByZXR1cm4ge1xuICAgICAgb2s6IHRydWUsIGZpbGVuYW1lOiBzdG9yZWQucmVsUGF0aCwgYWJzUGF0aDogc3RvcmVkLmFic1BhdGgsXG4gICAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICAgIGRhdGFVcmwsIGZ1bGxEYXRhVXJsLFxuICAgICAgY3JvcDogZ290LmNyb3BNZXRhLFxuICAgIH07XG4gIH1cbiAgLy8gcGFnZVxuICBjb25zdCBnb3QgPSBhd2FpdCBzaG90UGFnZUNvbW1vbih0YWJJZCwgd2luZG93SWQpO1xuICBpZiAoIWdvdCkgcmV0dXJuIHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfTtcbiAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEZpbGVuYW1lKCdwYWdlJywgdHMsIG1zZy5uLCBnb3QudGFiVXJsLCB7dHJ1bmNhdGVkOiBnb3QudHJ1bmNhdGVkfSk7XG4gIGNvbnN0IHN0b3JlZCA9IGF3YWl0IHNhdmVEb3dubG9hZChnb3QuYmxvYiwgbXNnLndvcmtzcGFjZSwgZmlsZW5hbWUpO1xuICBjb25zdCBkYXRhVXJsID0gYXdhaXQgbWFrZVRodW1ibmFpbChnb3QuYml0bWFwKTtcbiAgY29uc3QgZnVsbERhdGFVcmwgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICByZXR1cm4ge1xuICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgIGRhdGFVcmwsIGZ1bGxEYXRhVXJsLCB0cnVuY2F0ZWQ6IGdvdC50cnVuY2F0ZWQsXG4gIH07XG59O1xuXG4vLyAoc2F2ZS10ZXh0IC8gc2F2ZS1ieXRlcyBhcmUgZm9sZGVkIGludG8gdGhlIHNpbmdsZSBsaXN0ZW5lciBhYm92ZS4pXG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvb0JBLElBQUksY0FBYztBQUFBLEVBQ2xCLElBQU0sU0FBUyxNQUFjO0FBQUEsSUFDM0IsTUFBTSxTQUFTLEdBQUcsS0FB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QUk7QUFBQSxRQUFNLFVBQVUsUUFBTztBQUFBLFFBQVMsU0FBUyxRQUFPO0FBQUEsUUFDcEQsVUFBVSxRQUFPO0FBQUEsUUFBVSxVQUFVLFFBQU87QUFBQSxRQUFVLGVBQWUsUUFBTztBQUFBLFFBQzVFO0FBQUEsUUFBUztBQUFBLFFBQ1QsTUFBTSxLQUFJO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE1BQU0sTUFBTSxNQUFNLGVBQWUsT0FBTyxRQUFRO0FBQUEsSUFDaEQsSUFBSSxDQUFDO0FBQUEsTUFBSyxPQUFPLEVBQUMsSUFBSSxPQUFPLE9BQU8saUJBQWdCO0FBQUEsSUFDcEQsTUFBTSxXQUFXLGNBQWMsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBQyxXQUFXLElBQUksVUFBUyxDQUFDO0FBQUEsSUFDeEYsTUFBTSxTQUFTLE1BQU0sYUFBYSxJQUFJLE1BQU0sSUFBSSxXQUFXLFFBQVE7QUFBQSxJQUNuRSxNQUFNLFVBQVUsTUFBTSxjQUFjLElBQUksTUFBTTtBQUFBLElBQzlDLE1BQU0sY0FBYyxNQUFNLGtCQUFrQixJQUFJLElBQUk7QUFBQSxJQUNwRCxJQUFJLE9BQU8sUUFBUTtBQUFBLElBQ25CLE9BQU87QUFBQSxNQUNMLElBQUk7QUFBQSxNQUFNLFVBQVUsT0FBTztBQUFBLE1BQVMsU0FBUyxPQUFPO0FBQUEsTUFDcEQsVUFBVSxPQUFPO0FBQUEsTUFBVSxVQUFVLE9BQU87QUFBQSxNQUFVLGVBQWUsT0FBTztBQUFBLE1BQzVFO0FBQUEsTUFBUztBQUFBLE1BQWEsV0FBVyxJQUFJO0FBQUEsSUFDdkM7QUFBQTsiLAogICJkZWJ1Z0lkIjogIjQwNEU1ODRDMzFERjM5OUY2NDc1NkUyMTY0NzU2RTIxIiwKICAibmFtZXMiOiBbXQp9
