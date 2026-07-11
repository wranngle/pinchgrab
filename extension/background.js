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
      const minXAbs = Math.min(...rectsBefore.map((r) => r.left)) + window.scrollX;
      const minYAbs = Math.min(...rectsBefore.map((r) => r.top)) + window.scrollY;
      const maxXAbs = Math.max(...rectsBefore.map((r) => r.right)) + window.scrollX;
      const maxYAbs = Math.max(...rectsBefore.map((r) => r.bottom)) + window.scrollY;
      const cx = (minXAbs + maxXAbs) / 2;
      const cy = (minYAbs + maxYAbs) / 2;
      const targetX = Math.max(0, cx - window.innerWidth / 2);
      const targetY = Math.max(0, cy - window.innerHeight / 2);
      window.scrollTo({ left: targetX, top: targetY, behavior: "instant" });
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

//# debugId=CA5FCC5FBB56C85A64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9iYWNrZ3JvdW5kLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIFNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2wgYmV0d2VlbiBjb250ZW50IHNjcmlwdCwgc2lkZSBwYW5lbCwgYW5kXG4vLyBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyLlxuXG5leHBvcnQgdHlwZSBSZWN0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG5leHBvcnQgdHlwZSBWaWV3cG9ydCA9IHtcbiAgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyO1xuICAvLyBVc2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgYXQgY2FwdHVyZSB0aW1lLiBMZXRzIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhc29uIGFib3V0IHdoeSBjYXB0dXJlZCBhcHBlYXJhbmNlIGRpZmZlcnMgYmV0d2VlbiBzZXNzaW9uc1xuICAvLyAoZS5nLiBkYXJrLW1vZGUgdnMgbGlnaHQtbW9kZSBvZiB0aGUgc2FtZSBjb21wb25lbnQpLlxuICBjb2xvclNjaGVtZT86ICdkYXJrJyB8ICdsaWdodCc7XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICAvLyBEb2N1bWVudCBkaXJlY3Rpb24gKGBsdHJgIC8gYHJ0bGApIOKAlCBkaWZmZXJlbnQgZnJvbSB2aWV3cG9ydCBzaXplLFxuICAvLyBjaGFuZ2VzIHRoZSBtZWFuaW5nIG9mIGBzdGFydGAvYGVuZGAgaW4gQ1NTIGFuZCB0aGUgc2Vuc2Ugb2ZcbiAgLy8gYHJlY3QueGAuIENhcHR1cmVkIHBlciBwYWdlIGhlYWRlciBzbyBSVEwgY2FwdHVyZXMgZG9uJ3QgZ2V0XG4gIC8vIHNpbGVudGx5IG1peGVkIHdpdGggTFRSIG9uZXMuXG4gIGRpcmVjdGlvbj86ICdsdHInIHwgJ3J0bCc7XG4gIC8vIEJyb3dzZXIgem9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCByZXBvcnRzIHRoZSBwaW5jaC16b29tXG4gIC8vIGZhY3RvcjsgdmFsdWVzICE9IDEgbWVhbiB0aGUgdXNlciBoYXMgem9vbWVkIGluL291dCBhbmQgYW55IGxheW91dFxuICAvLyBidWcgdGhleSdyZSBjYXB0dXJpbmcgbWF5IG5vdCByZXBybyBhdCBkZWZhdWx0IHpvb20uXG4gIHpvb20/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGcmFtZXdvcmtJbmZvID0ge1xuICBmcmFtZXdvcms6ICdyZWFjdCcgfCAndnVlJyB8ICdsaXQnIHwgJ3N0ZW5jaWwnIHwgJ3N2ZWx0ZScgfCAnd2ViLWNvbXBvbmVudCc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuICBzb3VyY2U/OiB7ZmlsZT86IHN0cmluZyB8IG51bGw7IGxpbmU/OiBudW1iZXIgfCBudWxsfTtcbiAgLy8gVXAtdHJlZSBjb21wb25lbnQgYW5jZXN0cnkgKGlubmVybW9zdCBmaXJzdCkuIEZvciBSZWFjdCwgd2Fsa2VkIHZpYVxuICAvLyBmaWJlciBgcmV0dXJuYCBjaGFpbjsgZm9yIFZ1ZSwgdmlhIGBfX3Z1ZVBhcmVudENvbXBvbmVudC5wYXJlbnRgLlxuICAvLyBUaGUgY29tcG9uZW50IG5hbWUgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoaWNoIGZpbGUgb3ducyB0aGVcbiAgLy8gcmVuZGVyaW5nIOKAlCB0aGUgY2hhaW4gaGVscHMgaXQgZ3JlcCB1cHdhcmQgdG8gZmluZCB0aGUgcm91dGVcbiAgLy8gY29tcG9uZW50LCB0aGVuIGRyaWxsIGludG8gdGhlIG93bmluZyBmaWxlLlxuICBjaGFpbj86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5jZXN0b3IgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBNYXRjaGVkUnVsZSA9IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgZGVjbGFyYXRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWVkaWE/OiBzdHJpbmc7XG4gIC8vIFdhcyB0aGUgQG1lZGlhIHF1ZXJ5IHRoYXQgd3JhcHMgdGhpcyBydWxlIGFjdHVhbGx5IG1hdGNoZWQgYXRcbiAgLy8gY2FwdHVyZSB0aW1lPyBgdHJ1ZWAgPSBhY3RpdmUsXG4gIC8vIGBmYWxzZWAgPSBtYXRjaGVkIHRoZSBzZWxlY3RvciBidXQgaW5hY3RpdmUgKGUuZy4gbW9iaWxlIHJ1bGVzXG4gIC8vIGNhcHR1cmVkIG9uIGEgZGVza3RvcCB2aWV3cG9ydCksIGB1bmRlZmluZWRgID0gbWF0Y2hNZWRpYSB0aHJldy5cbiAgbWVkaWFBY3RpdmU/OiBib29sZWFuO1xufTtcblxuLy8gU3ludGhldGljIGhpbnRzIFBpbmNoR3JhYiBhZGRzIHRvIGVudHJpZXMg4oCUIGtlcHQgZGlzdGluY3QgZnJvbSBgYXR0cnNgXG4vLyAocmVhbCBET00gYXR0cmlidXRlcykgc28gY29uc3VtZXJzIGNhbiB0ZWxsIHdoYXQgY2FtZSBmcm9tIHRoZSBwYWdlIHZzXG4vLyB3aGF0IHRoZSBjYXB0dXJlIHBpcGVsaW5lIGluamVjdGVkLlxuZXhwb3J0IHR5cGUgRW50cnlIaW50cyA9IHtcbiAgZm9ybWF0Pzogc3RyaW5nOyAgICAgLy8gaW5wdXQgZm9ybWF0IGhpbnQgKGUuZy4gJ1lZWVktTU0tREQnKVxuICB2YWx1ZU1hc2tlZD86IGJvb2xlYW47IC8vIHBhc3N3b3JkIHZhbHVlIHdhcyBtYXNrZWQgYXQgY2FwdHVyZSB0aW1lXG59O1xuXG5leHBvcnQgdHlwZSBFbnRyeSA9IHtcbiAgLy8gU3RhYmxlIHBlci1lbnRyeSB1dWlkLiBHZW5lcmF0ZWQgYXQgY2FwdHVyZSB0aW1lLiBEaXN0aW5jdCBmcm9tIGBuYFxuICAvLyAoZGlzcGxheSBzZXF1ZW5jZSkgYW5kIGZyb20gYGlkYCAoRE9NIGh0bWwgaWQgYXR0cmlidXRlKS4gRm9yZWlnbi1rZXlcbiAgLy8gdGFyZ2V0IGZvciBGZWVkYmFja01lc3NhZ2UucGFyZW50SWQuXG4gIHVpZDogc3RyaW5nO1xuICAvLyBGb3JlaWduIGtleSBpbnRvIHRoZSBzZXNzaW9uIHJvdyAoUGFnZU1lc3NhZ2Uuc2Vzc2lvbklkKS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIGxpbmsgY2FwdHVyZXMgYmFjayB0byBcIndoaWNoIHBhZ2UtbG9hZCBjb250ZXh0IGRpZCB0aGV5XG4gIC8vIGNvbWUgZnJvbT9cIiB3aXRob3V0IGRlcGVuZGluZyBvbiBVUkwgc3RyaW5nIGVxdWFsaXR5LCB3aGljaCBicmVha3NcbiAgLy8gb24gaGFzaCBuYXZpZ2F0aW9uLCBxdWVyeS1wYXJhbSBzd2FwcywgYW5kIFNQQSByb3V0aW5nLiBTZXQgYnkgdGhlXG4gIC8vIHNpZGUgcGFuZWwgYXQgbWVzc2FnZS1yZWNlaXZlIHRpbWUsIG5vdCBvbiB0aGUgcGFnZSBzaWRlLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG4gIG46IG51bWJlcjtcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBvdXRlckhUTUw/OiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIC8vIFRoZSB2aXN1YWxseS1yZW5kZXJlZCBmb3JtIHdoZW4gQ1NTIGB0ZXh0LXRyYW5zZm9ybWAgaXMgc2V0LiBDYXB0dXJlZFxuICAvLyBhbG9uZ3NpZGUgYHRleHRgICh3aGljaCBpcyB0aGUgc291cmNlLXRydXRoIGB0ZXh0Q29udGVudGApIHNvIGFuIExMTVxuICAvLyBjYW4gZGlzYW1iaWd1YXRlIGJldHdlZW4gZS5nLiBzb3VyY2UgYFJlZnJlc2hgIGFuZCByZW5kZXJlZCBgUkVGUkVTSGBcbiAgLy8gd2l0aG91dCBmYWxzZS1ncmVwcGluZyBhZ2FpbnN0IGVpdGhlci5cbiAgcmVuZGVyZWRUZXh0Pzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICBhY2Nlc3NpYmxlTmFtZT86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7ICAgICAgICAgICAgLy8gdGhlIERPTSBodG1sIGlkIGF0dHJpYnV0ZSAodW5jaGFuZ2VkKVxuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbiAgYXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyByZWFsIERPTSBhdHRyaWJ1dGVzIG9ubHlcbiAgaGludHM/OiBFbnRyeUhpbnRzOyAgICAgLy8gc3ludGhldGljIGNhcHR1cmUtdGltZSBoaW50c1xuICByZWN0OiBSZWN0O1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIGluU2hhZG93RE9NPzogYm9vbGVhbjtcbiAgLy8gQ1NTIHNlbGVjdG9yIGZvciB0aGUgc2hhZG93IGhvc3Qgd2hlbiBgaW5TaGFkb3dET01gIGlzIHRydWUuIExldHMgYVxuICAvLyBjb25zdW1lciAob3IgdGhlIHBhbmVsJ3MgcmUtdmFsaWRhdGlvbiBwYXNzKSBmaW5kIHRoZSBob3N0IGVsZW1lbnRcbiAgLy8gc2luY2UgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyByb290cy5cbiAgc2hhZG93SG9zdD86IHN0cmluZztcbiAgY29tcG9uZW50Um9vdD86IHN0cmluZztcbiAgYW5jZXN0b3JzPzogQW5jZXN0b3JbXTtcbiAgY29tcG9uZW50PzogRnJhbWV3b3JrSW5mbztcbiAgLy8gUmVhY3QgZXZlbnQgaGFuZGxlciBuYW1lcyBwcm9iZWQgZnJvbSBgX19yZWFjdFByb3BzJDxrZXk+YCDigJQgYW5zd2Vyc1xuICAvLyBcIndoaWNoIGhhbmRsZXIgZmlyZXMgd2hlbiB0aGlzIGlzIGNsaWNrZWQ/XCIgd2l0aG91dCBhbiBMTE0gaGF2aW5nIHRvXG4gIC8vIGdyZXAgdGhlIGNvZGViYXNlLiBJbiBkZXYgYnVpbGRzIHRoZXNlIGFyZSByZWFsIGZ1bmN0aW9uIG5hbWVzOyBpblxuICAvLyBwcm9kIHRoZXkncmUgbWluaWZpZWQgYnV0IHN0aWxsIGFuY2hvci1hYmxlLlxuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBodG14IC8gU3RpbXVsdXMgLyBBbHBpbmUgLyBUdXJibyB3aXJpbmcgb24gdGhlIGVsZW1lbnQuIFNlcnZlci1cbiAgLy8gcmVuZGVyZWQgYXBwcyBkb24ndCBoYXZlIFJlYWN0IGZpYmVycyDigJQgZm9yIHRoZW0sIHRoaXMgSVMgdGhlXG4gIC8vIGNvbXBvbmVudCBzaGFwZS5cbiAgYmVoYXZpb3JBdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIFRydWUgd2hlbiBgZWwuZ2V0QW5pbWF0aW9ucygpYCByZXBvcnRlZCBhbiBhY3RpdmVseS1wbGF5aW5nXG4gIC8vIGFuaW1hdGlvbiBhdCBjYXB0dXJlIHRpbWUuIFRlbGxzIHRoZSBjb25zdW1lciB0aGF0IGNhcHR1cmVkIHJlY3QgL1xuICAvLyB0cmFuc2Zvcm0gLyBvcGFjaXR5IG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZS5cbiAgaXNBbmltYXRpbmc/OiBib29sZWFuO1xuICAvLyBGb3IgZWxlbWVudHMgcmVuZGVyZWQgaW50byBhIGA8Y2FudmFzPmAsIHRoZSBET00gZ2l2ZXMgdXMgZXNzZW50aWFsbHlcbiAgLy8gbm90aGluZyBhYm91dCB3aGF0IHdhcyBjbGlja2VkIOKAlCB0aGUgY2FudmFzIGhhcyBubyBjaGlsZHJlbiwgbm9cbiAgLy8gdGV4dCwgbm8gbWVhbmluZ2Z1bCBzZWxlY3RvcnMgYmVsb3cgdGhlIGNhbnZhcyBpdHNlbGYuIENhcHR1cmUgdGhlXG4gIC8vIGNsaWNrIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMncyBib3VuZGluZyBib3ggc28gYSBkb3duc3RyZWFtXG4gIC8vIGNvbnN1bWVyIGNhbiBjb3JyZWxhdGUgKGUuZy4gYWdhaW5zdCBhIERhdGFkb2cgLyBUYWJsZWF1IC8gY2hhcnRpbmdcbiAgLy8gbGlicmFyeSB0aGF0IGV4cG9zZXMgZGF0YS1wb2ludCBjb29yZGluYXRlcykuIENvb3JkaW5hdGVzIGFyZSBDU1NcbiAgLy8gcGl4ZWxzOyBtdWx0aXBseSBieSBgdmlld3BvcnQuZHByYCB0byBnZXQgZGV2aWNlIHBpeGVscy5cbiAgY2FudmFzQ2xpY2s/OiB7XG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIG9mZnNldFk6IG51bWJlcjtcbiAgICBjYW52YXNXOiBudW1iZXI7XG4gICAgY2FudmFzSDogbnVtYmVyO1xuICAgIGNhbnZhc1NlbGVjdG9yOiBzdHJpbmc7XG4gIH07XG4gIC8vIENvbnRlbnRlZGl0YWJsZSByaWNoLXRleHQgZWRpdG9yIGNvbnRleHQuIFBvcHVsYXRlZCB3aGVuIHRoZSBjYXB0dXJlZFxuICAvLyBub2RlIGlzLCBvciBsaXZlcyBpbnNpZGUsIGEgYFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1gIGFuY2VzdG9yLiBMZXRzXG4gIC8vIGFuIExMTSByZWFzb25pbmcgYWJvdXQgYSBcImNvcHkgaXMgd3JvbmdcIiAvIFwidGhlIGVkaXRvciBicmVha3Mgd2hlbiBYXCJcbiAgLy8gY2FwdHVyZSBrbm93IHdoaWNoIGVkaXRvciBsaWJyYXJ5IHRvIGxvb2sgYXQg4oCUIHNlbGVjdG9ycyBnZW5lcmF0ZWRcbiAgLy8gYnkgUHJvc2VNaXJyb3IgLyBMZXhpY2FsIC8gZXRjIGFyZSBydW50aW1lLWludGVybmFsIGFuZCB3b24ndCBncmVwXG4gIC8vIGFnYWluc3QgdXNlciBjb2RlLCBidXQgdGhlIExJQlJBUlkgcG9pbnRlciByb3V0ZXMgdGhlIExMTSB0byB0aGVcbiAgLy8gcmlnaHQgd3JhcHBlciBjb21wb25lbnQuXG4gIGVkaXRvcj86IHtcbiAgICBraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnO1xuICAgIHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbiAgfTtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBCRUZPUkUgdGhlIGNsaWNrLiBSZXBybyBjb250ZXh0IGZvciBidWdzIGxpa2VcbiAgLy8gXCJJIGNsaWNrZWQgdGhlIHdyb25nIGRyb3Bkb3duIG9wdGlvblwiIG9yIFwidGhlIHZhbHVlIGZsaWNrZXJlZCBiZWZvcmVcbiAgLy8gSSBjbGlja2VkIGl0XCIg4oCUIHdpdGhvdXQgdGhpcywgdGhlIEpTT04gc25hcHNob3RzIG9ubHkgdGhlIHBvc3QtXG4gIC8vIG11dGF0aW9uIHN0YXRlLCBsZWF2aW5nIHRoZSBMTE0gYmxpbmQgdG8gd2hhdCB0cmlnZ2VyZWQgdGhlXG4gIC8vIGFwcGVhcmFuY2UgdGhlIHVzZXIgY29tcGxhaW5lZCBhYm91dC4gUGluY2hncmFiIGtlZXBzIGFuIDgtc2Vjb25kXG4gIC8vIHJpbmcgYnVmZmVyIG9mIG11dGF0aW9uIHJlY29yZHM7IGNhcHR1cmUgYXR0YWNoZXMgdGhlIG1vc3QgcmVjZW50XG4gIC8vIDMgYXMgYSBzbmFwc2hvdC5cbiAgZG9tTXV0YXRpb25zPzogRG9tTXV0YXRpb25bXTtcbiAgc3RhdGVzPzogc3RyaW5nW107ICAgICAgLy8gYWN0aXZlIHBzZXVkby1jbGFzc2VzICh3YXMgUmVjb3JkPHN0cmluZywgdHJ1ZT4gaW4gdjEpXG4gIC8vIExvY2F0b3IgcXVhbGl0eTogaG93IG1hbnkgZWxlbWVudHMgYHNlbGVjdG9yYCByZXNvbHZlcyB0byBpbiBpdHNcbiAgLy8gc2NvcGUgKDEgPSB1bmlxdWUpLiBIaWdoZXIgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91cy5cbiAgc2VsZWN0b3JNYXRjaENvdW50PzogbnVtYmVyO1xuICAvLyBEaXNhbWJpZ3VhdGVkIG9yZGVyaW5nIGZpZWxkcy5cbiAgLy8gYG5gIGlzIHByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdCAoaXQncyB0aGUgY2FwdHVyZS1zZXF1ZW5jZVxuICAvLyBkaXNwbGF5IGxhYmVsIGluIHRoZSBzaWRlYmFyKS4gVGhlIG5ldyBmaWVsZHMgYXJlIGVtaXQtdGltZSBvbmx5OlxuICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHNhbWUgYXMgYG5gIChjYXB0dXJlIHNlcXVlbmNlIHdpdGhpbiBzZXNzaW9uKVxuICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgcmFuayB3aXRoaW4gdGhlIHBhZ2VcbiAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCBodW1hbi1mYWNpbmcgbGFiZWwgKG1pcnJvcnMgYG5gIHRvZGF5KVxuICBjYXB0dXJlSW5kZXg/OiBudW1iZXI7XG4gIGV2ZW50SW5kZXg/OiBudW1iZXI7XG4gIHZpc3VhbE9yZGVyPzogbnVtYmVyO1xuICBkaXNwbGF5TGFiZWw/OiBzdHJpbmc7XG4gIC8vIEdyb3VwIGZsYXR0ZW5pbmcgZmllbGRzLlxuICAvLyBUaGUgZ3JvdXAgaGVhZCBjYXJyaWVzIGBncm91cE1lbWJlclVpZHNgIChqdXN0IHRoZSBJRHMpOyBlYWNoXG4gIC8vIG1lbWJlciBlbWl0cyBhcyBpdHMgb3duIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nXG4gIC8vIGJhY2sgYXQgdGhlIGhlYWQuXG4gIGdyb3VwTWVtYmVyVWlkcz86IHN0cmluZ1tdO1xuICBncm91cFVpZD86IHN0cmluZztcbiAgLy8gTGlnaHR3ZWlnaHQgYTExeSBhdWRpdCBjYXB0dXJlZCBhdCBjbGljayB0aW1lLiBIZWF2aWVyIGNoZWNrc1xuICAvLyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90cywgYXhlIHZpb2xhdGlvbnMpIGFyZSBub3QgeWV0IHdpcmVkLlxuICBhMTF5Pzoge1xuICAgIGNvbnRyYXN0UmF0aW8/OiBudW1iZXI7XG4gICAgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7XG4gICAgdGFiYmFibGU/OiBib29sZWFuO1xuICAgIGZvY3VzVmlzaWJsZT86IGJvb2xlYW47XG4gIH07XG4gIC8vIFBhcmVudCBsYXlvdXQgY29udGV4dCDigJQgZmxleC9ncmlkL292ZXJmbG93L3Njcm9sbC9zdGFja2luZ1xuICAvLyBhbmNlc3RvcnMgdGhhdCBzaGFwZSB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGFwcGVhcmFuY2UuXG4gIGxheW91dENvbnRleHQ/OiBBcnJheTx7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgZGlzcGxheT86IHN0cmluZztcbiAgICBwb3NpdGlvbj86IHN0cmluZztcbiAgICBvdmVyZmxvdz86IHN0cmluZztcbiAgICB6SW5kZXg/OiBzdHJpbmc7XG4gICAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICAgIHdpbGxDaGFuZ2U/OiBzdHJpbmc7XG4gICAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICAgIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gICAgc2Nyb2xsVG9wPzogbnVtYmVyO1xuICAgIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICB9PjtcbiAgLy8gQXNzZXQgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIGNhcHR1cmVkIHN1YnRyZWUgKGltZyBzcmMsIDx1c2UgaHJlZj4sXG4gIC8vIGJhY2tncm91bmQtaW1hZ2UgdXJsKS4gV2hlbiBhIGNvbXBsYWludCBpcyBhYm91dCBhIGxvZ28gLyBpY29uIC9cbiAgLy8gYXJ0d29yaywgYW4gYWdlbnQgd2l0aG91dCB0aGVzZSByZWZlcmVuY2VzIHdvdWxkIGJlIGxlZnQgZ3Vlc3NpbmcuXG4gIGFzc2V0cz86IEFycmF5PHtcbiAgICBzcmM6IHN0cmluZztcbiAgICBuYXR1cmFsVz86IG51bWJlcjsgbmF0dXJhbEg/OiBudW1iZXI7XG4gICAgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7XG4gICAgYWx0Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gIH0+O1xuICBzdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtYXRjaGVkUnVsZXM/OiBNYXRjaGVkUnVsZVtdO1xuICBwc2V1ZG9FbGVtZW50cz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICAvLyBUcnVuY2F0aW9uIG1hcmtlcnMg4oCUIHByZXNlbnQgd2hlbiBjYXB0dXJlIGhhZCB0byBlbGlkZSBjb250ZW50LiBMZXRzXG4gIC8vIGEgY29uc3VtZXIgZGV0ZWN0IFwidGhpcyBlbnRyeSB3YXMgY3V0IGRvd25cIiBhbmQgcmVmZXRjaCBmcm9tIHRoZVxuICAvLyBsaXZlIHBhZ2UgaWYgaXQgbmVlZHMgdGhlIGZ1bGwgdmVyc2lvbi5cbiAgLy8gICBvdXRlckhUTUwg4oCUIG9yaWdpbmFsIGh0bWwgbGVuZ3RoIGJlZm9yZSB0aGUgc2l6ZS1jYXAga2lja2VkIGluLlxuICAvLyAgIGNoaWxkcmVuICDigJQgbnVtYmVyIG9mIGRlc2NlbmRhbnQgc3VidHJlZXMgcmVwbGFjZWQgYnkgZGVwdGgtY2FwXG4gIC8vICAgICAgICAgICAgICAgZWxpc2lvbiBtYXJrZXJzIChgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gKS5cbiAgdHJ1bmNhdGVkPzoge291dGVySFRNTD86IG51bWJlcjsgY2hpbGRyZW4/OiBudW1iZXI7IHRleHQ/OiBudW1iZXJ9O1xuICAvLyBHcm91cCBvZiBhZGRpdGlvbmFsIGNhcHR1cmVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudHJ5IChBbHQrU2hpZnQrQ2xpY2tcbiAgLy8gLyBBbHQrZHJhZyBzZWxlY3Rpb25zIGNvbGxhcHNlIGhlcmUpLlxuICBncm91cD86IEVudHJ5W107XG4gIC8vIE9wdGlvbmFsIHNjcmVlbnNob3QgYnVuZGxlOiBlYWNoIGZpZWxkIGlzIGEgcmVsYXRpdmUgcGF0aCB1bmRlciB0aGVcbiAgLy8gdXNlcidzIERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+LyByb290LiBUaGUgY2FwdHVyZWRBdCBzdGFtcCBpc1xuICAvLyB0aGUgSVNPIHRpbWVzdGFtcCB3aGVuIHRoZSBzaG90IHdhcyB0YWtlbi5cbiAgc2NyZWVuc2hvdD86IHtcbiAgICBlbGVtZW50Pzogc3RyaW5nO1xuICAgIGdyb3VwPzogc3RyaW5nO1xuICAgIHBhZ2U/OiBzdHJpbmc7XG4gICAgY2FwdHVyZWRBdD86IHN0cmluZztcbiAgICAvLyBBbiBlbXB0eSBgc2NyZWVuc2hvdGAgZmllbGQgY291bGQgbWVhbiBcIm5vdCB5ZXQgc2hvdFwiLCBcImZhaWxlZFwiLFxuICAgIC8vIG9yIFwic2tpcHBlZCBvbiBwdXJwb3NlXCIuIFdoZW4gdGhlIHBpcGVsaW5lIGRlY2xpbmVzIG9yIGZhaWxzLFxuICAgIC8vIHNldCB0aGlzIHNvIHJlY2VpdmVycyBrbm93IGl0J3Mgbm90IGEgcmV0cnkgY2FuZGlkYXRlLlxuICAgIHVuYXZhaWxhYmxlUmVhc29uPzogJ2F1dG9TY3JlZW5zaG90T2ZmJyB8ICdza2lwU2NyZWVuc2hvdEhvc3RzJyB8ICdjYXB0dXJlRmFpbGVkJyB8ICdwZXJtaXNzaW9uRGVuaWVkJyB8IHN0cmluZztcbiAgICAvLyBDcm9wIG1ldGFkYXRhIGRlc2NyaWJpbmcgd2hlcmUgdGhlIGNyb3BwZWQgUE5HIGZpdHMgaW4gdGhlXG4gICAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICBjcm9wPzoge1xuICAgICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZHByOiBudW1iZXI7XG4gICAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59O1xuXG4vLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIHBhZ2UgbWV0YWRhdGEsIGVtaXR0ZWQgb25jZSBwZXIgZGlzdGluY3QgcGFnZSBVUkxcbi8vIGludm9sdmVkIGluIGNhcHR1cmVzIChkZWR1cGVkIGJ5IFVSTCkuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTC5cbi8vIGBwYXJ0aWFsYCBpcyBzZXQgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCBjb3VsZCBiZSBjYXB0dXJlZCAoZnVsbC1wYWdlIHN0aXRjaFxuLy8gdW5hdmFpbGFibGUpIOKAlCBzZWUgYmFja2dyb3VuZC50cyBzdGl0Y2hQYWdlIGxpbWl0YXRpb25zLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90ID0geyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZzsgY2FwdHVyZWRBdDogc3RyaW5nOyB2aWV3cG9ydDoge3dpZHRoOiBudW1iZXI7aGVpZ2h0OiBudW1iZXJ9OyBzY3JvbGxXaWR0aDogbnVtYmVyOyBzY3JvbGxIZWlnaHQ6IG51bWJlcjsgZGV2aWNlUGl4ZWxSYXRpbzogbnVtYmVyOyBsYW5nOiBzdHJpbmc7IHNjcmVlbnNob3Q6IHN0cmluZzsgcGFydGlhbD86IGJvb2xlYW4gfTtcblxuZXhwb3J0IHR5cGUgRG9tTXV0YXRpb24gPSB7XG4gIHR5cGU6ICdjaGlsZExpc3QnIHwgJ2F0dHJpYnV0ZXMnIHwgJ2NoYXJhY3RlckRhdGEnO1xuICB0czogc3RyaW5nOyAgICAgICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBtdXRhdGlvbiBmaXJlZFxuICB0YXJnZXQ6IHN0cmluZzsgICAgICAgIC8vIGNvbXBhY3QgZGVzY3JpcHRvciBvZiB0aGUgbXV0YXRpb24ncyB0YXJnZXQgKGB0YWcjaWQuY2xzYClcbiAgYXR0cmlidXRlTmFtZT86IHN0cmluZztcbiAgb2xkVmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBuZXdWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIGFkZGVkPzogbnVtYmVyOyAgICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiBhZGRlZCBub2Rlc1xuICByZW1vdmVkPzogbnVtYmVyOyAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgcmVtb3ZlZCBub2Rlc1xuICBzdW1tYXJ5Pzogc3RyaW5nOyAgICAgIC8vIG9uZS1saW5lIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uXG59O1xuXG5leHBvcnQgdHlwZSBQYWdlQ29udGV4dCA9IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgdG9rZW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBCcm93c2VyICsgbG9jYWxlIGZpbmdlcnByaW50IGZvciBzZXNzaW9uLWxldmVsIGNvbnRleHQuIExldHMgYVxuICAvLyBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJyb3dzZXIgcHJvZHVjZWQgdGhpcyBjYXB0dXJlP1wiIG9yXG4gIC8vIFwid2FzIHRoZSBjYXB0dXJlZCBhcHAgcmVuZGVyZWQgaW4gYW4gUlRMIGxvY2FsZT9cIiB3aXRob3V0IHJlcnVubmluZy5cbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICAvLyBHaXQgYnVpbGQgaWRlbnRpdHksIHdoZW4gdGhlIGNhcHR1cmVkIGFwcCBleHBvc2VzXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW5cIj5gLlxuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFdoYXRldmVyIGVsZW1lbnQgaGFkIGZvY3VzIGF0IGNhcHR1cmUgdGltZSwgcGx1cyBhIGhpbnQgYXMgdG9cbiAgLy8gd2hldGhlciB0aGUgdXNlciBuYXZpZ2F0ZWQgdGhlcmUgd2l0aCB0aGUga2V5Ym9hcmQgKFRhYiAvIFNoaWZ0K1RhYlxuICAvLyBwcmVzc2VkIGluIHRoZSBsYXN0IHNlY29uZCkuIFVzZWZ1bCBmb3IgYWNjZXNzaWJpbGl0eS1idWcgY2FwdHVyZXM6XG4gIC8vIFwidGhpcyBlbGVtZW50IGxvb2tzIHdyb25nIG9ubHkgd2hlbiBrZXlib2FyZC1mb2N1c2VkXCIuXG4gIGFjdGl2ZUZvY3VzPzoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59O1xufTtcblxuLy8gLS0tLS0tLS0tLSBTaWRlLXBhbmVsIFwibWVzc2FnZXNcIiAoVUkgcm93cykgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBTZWxlY3Rvck1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdzZWxlY3Rvcic7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIGVudHJ5OiBFbnRyeTtcbiAgcGlubmVkPzogYm9vbGVhbjtcbiAgLy8gTGVnYWN5IGZpZWxkIGtlcHQgYXJvdW5kIGJlY2F1c2Ugb2xkIHdvcmtzcGFjZXMgbWF5IHN0aWxsIGhhdmUgaXQ7IHdlXG4gIC8vIHN0cmlwIGl0IG9uIGNhcHR1cmUsIGJ1dCBkb24ndCByZWplY3QgaXQgb24gaW1wb3J0LlxuICBkdXBlUGVuZGluZz86IHVua25vd247XG59O1xuXG5leHBvcnQgdHlwZSBGZWVkYmFja01lc3NhZ2UgPSB7XG4gIHR5cGU6ICdmZWVkYmFjayc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgLy8gT3B0aW9uYWwgZm9yZWlnbiBrZXkgaW50byBFbnRyeS51aWQuIEFkamFjZW5jeSB0byBhIHByZWNlZGluZyBzZWxlY3RvclxuICAvLyBpcyB0aGUgaGlzdG9yaWNhbCBsaW5rOyBwYXJlbnRJZCBtYWtlcyBpdCBleHBsaWNpdCBhbmQgc3Vydml2ZXNcbiAgLy8gcmUtb3JkZXJpbmcgLyBzcGxpdC1ncm91cCAvIGltcG9ydC1leHBvcnQgcm91bmQtdHJpcHMuXG4gIHBhcmVudFVpZD86IHN0cmluZztcbiAgLy8gVXNlciBleHBsaWNpdGx5IGRldGFjaGVkIHRoaXMgY29tbWVudCBmcm9tIGFueSBzZWxlY3Rvci4gV2l0aG91dCB0aGVcbiAgLy8gZmxhZywgYWRqYWNlbmN5IHRvIHRoZSBwcmVjZWRpbmcgc2VsZWN0b3Igd291bGQgc2lsZW50bHkgcmUtYWRvcHQgdGhlXG4gIC8vIGNvbW1lbnQgYXQgcmVuZGVyL2V4cG9ydCB0aW1lLlxuICBkZXRhY2hlZD86IGJvb2xlYW47XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9XG4gIC8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgbWV0YWRhdGEgZm9yIG9uZSBkaXN0aW5jdCBwYWdlIChVUkwpLiBFbWl0dGVkIGF0XG4gIC8vIG1vc3Qgb25jZSBwZXIgVVJMICh0aGUgY29udGVudCBzY3JpcHQgZGVkdXBlcykuIFRoZSBwYW5lbCBjYW4gc3Rhc2ggdGhlc2VcbiAgLy8gYXMgcGFnZS1sZXZlbCBjb250ZXh0IC8gZXhwb3J0IHRoZW0gYWxvbmdzaWRlIGVsZW1lbnQgc2hvdHMuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90JzsgcGF5bG9hZDogUGFnZVNuYXBzaG90fTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0NzID1cbiAgfCB7a2luZDogJ291dGxpbmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBnb2xkPzogYm9vbGVhbjsgZGFzaGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ291dGxpbmUtY2xlYXInfVxuICAvLyBFeHBvcnQtdGltZSByZXF1ZXN0IGZvciB0aGUgZnVsbCBzZXJpYWxpemVkIHBhZ2UgKG9wdC1pbiBwcmVmXG4gIC8vIGluY2x1ZGVQYWdlSFRNTCkuIFJlcGxpZWQgd2l0aCB7b2ssIHVybCwgdGl0bGUsIGh0bWx9OyBuZXZlciBwZXJzaXN0ZWRcbiAgLy8gdG8gY2hyb21lLnN0b3JhZ2Ug4oCUIHRoZSBwYXlsb2FkIGdvZXMgc3RyYWlnaHQgaW50byB0aGUgdGFyLlxuICB8IHtraW5kOiAncGFnZS1odG1sJ31cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGknOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9XG4gIHwge2tpbmQ6ICdzY3JvbGwtdG8nOyBzZWxlY3Rvcjogc3RyaW5nOyBzdGlja3k/OiBib29sZWFufVxuICB8IHtraW5kOiAnc3RpY2t5LWNsZWFyJ31cbiAgLy8gT25lLXNob3QgbG9jYXRvciBhbmltYXRpb246IHNjcm9sbCBpbnRvIHZpZXcgKyB0aHJlZSBwdWxzaW5nIHJpbmdzLlxuICAvLyBEaXN0aW5jdCBmcm9tIGBvdXRsaW5lYCAoc3VidGxlIGhvdmVyIHJpbmcpIGFuZCBgc2Nyb2xsLXRvYCAoc2lsZW50XG4gIC8vIHJlY2VudGVyKSBzbyB0aGUgc2lkZSBwYW5lbCBMb2NhdGUgYnV0dG9uIGNhbiByZXF1ZXN0IHNvbWV0aGluZyB1c2Vyc1xuICAvLyBjYW4gYWN0dWFsbHkgZmluZCBvbiBhIGJ1c3kgcGFnZS5cbiAgfCB7a2luZDogJ2xvY2F0ZS1mbGFzaCc7IHNlbGVjdG9yOiBzdHJpbmd9XG4gIHwge2tpbmQ6ICd2YWxpZGF0ZSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdsb2ctZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdyZWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnY2FwdHVyZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIC8vIE91dGxpbmUgdGhlIE50aCBhbmNlc3RvciBvZiBgc2VsZWN0b3JgIHdpdGhvdXQgY2FwdHVyaW5nIGl0IOKAlCB1c2VkIGJ5XG4gIC8vIGhvdmVyIG9uIGFuY2VzdG9yIGJyZWFkY3J1bWIgY2hpcHMgaW4gdGhlIHNpZGUgcGFuZWwgc28gdGhlIHVzZXJcbiAgLy8gcHJldmlld3Mgd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjbGlja2luZy5cbiAgfCB7a2luZDogJ291dGxpbmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICB8IHtraW5kOiAnYWx0LXN0YXRlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdtYW51YWwtY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uJzsgc2VsZWN0b3I6IHN0cmluZzsgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9XG4gIHwge2tpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfVxuICB8IHtraW5kOiAnc2V0LWNhcHR1cmVkJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ3NldC1jcy1wcmVmcyc7IHNwYWNpbmdPdmVybGF5PzogYm9vbGVhbjsgaG92ZXJTbmFwPzogYm9vbGVhbn1cbiAgLy8gU2NyZWVuc2hvdC10aW1lIG92ZXJsYXkgdG9nZ2xlcy4gVGhlIGJhY2tncm91bmQgYXNrcyB0aGUgY29udGVudCBzY3JpcHRcbiAgLy8gdG8gaGlkZSBpdHMgc2hhZG93LXJvb3QgY2hyb21lIChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIGJlZm9yZVxuICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlcywgdGhlbiByZXN0b3JlcyB2aXNpYmlsaXR5IG9uY2UgdGhlIFBORyBpcyBiYWNrLlxuICB8IHtraW5kOiAnaGlkZS1vdmVybGF5cyd9XG4gIHwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ307XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25QYXlsb2FkID0ge1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLy8gVGhlIGNhcHR1cmVkIGVudHJ5J3Mgc3RhYmxlIHVpZC4gVGhlIGNvbnRlbnQgc2NyaXB0IG5lZWRzIHRoaXMgc29cbiAgLy8gaXRzIG9uLXBhZ2UgY29tbWVudCBib3ggY2FuIHJvdXRlIHRoZSBjb21tZW50IHRvIHRoZSAqc3BlY2lmaWMqXG4gIC8vIGNhcHR1cmUgcmF0aGVyIHRoYW4gdG8gXCJhbnkgc2VsZWN0b3IgdGhhdCBtYXRjaGVzLlwiIFByZXZlbnRzXG4gIC8vIGNyb3NzLWNvbnRhbWluYXRpb24gd2hlbiB0d28gY2FwdHVyZXMgc2hhcmUgYSBzZWxlY3RvciBhY3Jvc3NcbiAgLy8gcGFnZXMgb3IgdHdvIHNpYmxpbmcgZWxlbWVudHMgc2hhcmUgYSB0ZXN0SWQuXG4gIHVpZD86IHN0cmluZztcbiAgbj86IG51bWJlcjtcbiAgY2FwdHVyZWQ/OiBib29sZWFuO1xuICBmZWVkYmFjaz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0JnID1cbiAgfCB7a2luZDogJ2NhcHR1cmUtc2NyZWVuc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc3dpdGNoLXRvLXRhYic7IHVybDogc3RyaW5nOyBvcGVuSWZNaXNzaW5nPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2xpc3Qtb3Blbi10YWJzJ31cbiAgfCB7a2luZDogJ3Nob3QtZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1ncm91cCc7IHNlbGVjdG9yczogc3RyaW5nW107IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1wYWdlJzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIEZ1bGwtcGFnZSAoYmVzdC1lZmZvcnQpIHNjcmVlbnNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFVubGlrZVxuICAvLyBzaG90LXBhZ2UgdGhpcyBkb2VzIE5PVCB3cml0ZSBhIGZpbGUgb3IgYnVpbGQgYSB0aHVtYm5haWwg4oCUIGl0IGp1c3RcbiAgLy8gcmV0dXJucyB0aGUgc3RpdGNoZWQgUE5HIGFzIGEgZGF0YSBVUkwgc28gdGhlIGNhbGxlciAoY29udGVudCBzY3JpcHQpIGNhblxuICAvLyBhdHRhY2ggaXQgdG8gYSBQYWdlU25hcHNob3QuIGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnRcbiAgLy8gY291bGQgYmUgY2FwdHVyZWQuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBQYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIChyZSlpbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IOKAlCB0aGUgZml4XG4gIC8vIGZvciBcIkFsdCBzdG9wcGVkIHdvcmtpbmdcIiBhZnRlciBhbiBleHRlbnNpb24gcmVsb2FkIG9ycGhhbnMgdGhlIHBhZ2Unc1xuICAvLyBjb250ZW50IHNjcmlwdC4gRGVmYXVsdHMgdG8gdGhlIGFjdGl2ZSB0YWIuXG4gIHwge2tpbmQ6ICdwZy1yZWluamVjdCc7IHRhYklkPzogbnVtYmVyfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbi8vIFJlcGx5IHRvIGEgYHBhZ2Utc25hcHNob3Qtc2hvdGAgcmVxdWVzdC4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMIG9mXG4vLyB0aGUgKGJlc3QtZWZmb3J0KSBmdWxsIHBhZ2U7IGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnQgd2FzXG4vLyBjYXB0dXJlZC4gYG9rOmZhbHNlYCBjYXJyaWVzIGFuIGVycm9yIHN0cmluZy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgc2NyZWVuc2hvdD86IHN0cmluZztcbiAgcGFydGlhbD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5XG4gIHwgUGFnZVNuYXBzaG90UmVwbHk7XG5cbi8vIOKUgOKUgOKUgCBFeHBvcnQgc2hhcGVzICh2Mikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBNYW5pZmVzdCBsaW5lIGVtaXR0ZWQgYXMgdGhlIHZlcnkgZmlyc3QgSlNPTkwgbGluZS4gQ2FycmllcyB0aGUgbWV0YWRhdGFcbi8vIG5lY2Vzc2FyeSB0byByZXN5bmMgYSBkb3dubG9hZGVkIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlICsgdG9vbGluZy5cbmV4cG9ydCB0eXBlIEV4cG9ydE1hbmlmZXN0ID0ge1xuICB2OiAyO1xuICB0eXBlOiAnbWFuaWZlc3QnO1xuICB0czogc3RyaW5nOyAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgZXhwb3J0IHdhcyBnZW5lcmF0ZWRcbiAgZ2VuZXJhdGVkOiBudW1iZXI7IC8vIGVwb2NoIG1zIChtaXJyb3Igb2YgdHMgaW4gbWFjaGluZS1yZWFkYWJsZSBmb3JtKVxuICB0b29sOiAncGluY2hncmFiJztcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGZvcm1hdDogJ2pzb25sJyB8ICdtYXJrZG93bicgfCAndGFyLnpzdCc7XG4gIC8vIENvbnRlbnQtZGVyaXZlZCBpZGVudGl0eTogZmlyc3QgMTYgaGV4IGNoYXJzIG9mIGEgU0hBLTI1NiBvdmVyIHRoZVxuICAvLyBzbGltIHJvd3MgKyBzY3JlZW5zaG90IG5hbWVzLiBTdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMgb2YgdGhlIHNhbWVcbiAgLy8gY29udGVudCwgc28gZG93bnN0cmVhbSBzdGF0ZSAoZS5nLiB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8qL2J1bmRsZXMvKVxuICAvLyBrZXlzIG9uIGl0IHdpdGhvdXQgZHVwbGljYXRpbmcgd29yay5cbiAgYnVuZGxlSWQ/OiBzdHJpbmc7XG4gIGhvc3RzOiBzdHJpbmdbXTtcbiAgLy8gQW1iaWd1b3VzIHRvdGFscy4gVGhlIHByZXZpb3VzIGBzZWxlY3RvcnMgLyBmZWVkYmFjayAvIHBhZ2VzYFxuICAvLyB0cmlwbGUgZGlkbid0IHNheSB3aGV0aGVyIG5lc3RlZFxuICAvLyBncm91cCBtZW1iZXJzIHdlcmUgY291bnRlZCwgd2hldGhlciBmZWVkYmFjay1iZWFyaW5nIHBhcmVudHMgd2VyZVxuICAvLyBhIHN1YnNldCwgb3IgaG93IHNjcmVlbnNob3RzIHdlcmUgdGFsbGllZC4gVGhlIGV4cGFuZGVkIHNoYXBlXG4gIC8vIGJlbG93IG5hbWVzIGV2ZXJ5IGNhdGVnb3J5IGV4cGxpY2l0bHkgc28gYSBkb3duc3RyZWFtIGFnZW50IGNhblxuICAvLyB0ZWxsIGV4YWN0bHkgd2hhdCdzIGluIHRoZSBidW5kbGUuXG4gIGNvdW50czoge1xuICAgIC8vIFRvcC1sZXZlbCBzZWxlY3RvciByb3dzIGluIHRoZSBKU09OTCBzdHJlYW0gKGV4Y2x1ZGVzIG5lc3RlZFxuICAgIC8vIGdyb3VwIG1lbWJlcnMsIGJ1dCB0aGUgYGdyb3VwTWVtYmVyc2AgZmllbGQgY291bnRzIHRob3NlKS5cbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBmZWVkYmFjazogbnVtYmVyO1xuICAgIHBhZ2VzOiBudW1iZXI7XG4gICAgLy8gTnVtYmVyIG9mIHNlbGVjdG9yIHJvd3MgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBjaGlsZC5cbiAgICAvLyBVc2VmdWwgZm9yIFwic2hvdyBtZSBvbmx5IHRoZSBpdGVtcyB3aXRoIGNvbW1lbnRzXCIuXG4gICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9ycyB0aGF0IHNoaXAgdW5kZXIgYSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYCBhcnJheVxuICAgIC8vIHJhdGhlciB0aGFuIGFzIHRoZWlyIG93biB0b3AtbGV2ZWwgcm93LlxuICAgIGdyb3VwTWVtYmVycz86IG51bWJlcjtcbiAgICAvLyBTY3JlZW5zaG90IGludmVudG9yeSAoY291bnRlZCBieSBmaWxlLCBkZWR1cGVkKS5cbiAgICBzY3JlZW5zaG90c0VsZW1lbnQ/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNHcm91cD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c1BhZ2U/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3Igcm93cyB0aGF0IHNob3VsZCBoYXZlIGFuIGVsZW1lbnQgc2NyZWVuc2hvdCBidXQgZG9uJ3RcbiAgICAvLyAocG9zdC1idWctIzIgZm9yY2VkIHNob290IG1heSBzdGlsbCBmYWlsKS4gUmVwYWlyIGFnZW50cyBjYW5cbiAgICAvLyBza2lwIHRoZXNlIG9yIHJlcXVlc3QgYSByZS1jYXB0dXJlLlxuICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90PzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2hvc2UgcGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbnkgc2VsZWN0b3JcbiAgICAvLyBpbiB0aGlzIGFyY2hpdmUuIFNob3VsZCBhbHdheXMgYmUgMDsgbm9uLXplcm8gbWVhbnMgdGhlIGV4cG9ydFxuICAgIC8vIGdvdCB0cnVuY2F0ZWQgb3IgYSBwYXJlbnQgd2FzIGRlbGV0ZWQgYmV0d2VlbiBjYXB0dXJlICsgZW1pdC5cbiAgICBvcnBoYW5lZEZlZWRiYWNrPzogbnVtYmVyO1xuICAgIC8vIEZ1bGwtcGFnZSBIVE1MIGRvY3VtZW50cyBidW5kbGVkIHVuZGVyIHBhZ2VzLyAob3B0LWluIHByZWYpLlxuICAgIHBhZ2VzSHRtbD86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gV2hlcmUgdGhlIGFnZW50IGRvY3RyaW5lIGxpdmVzIGluc2lkZSB0aGUgYXJjaGl2ZSAoU2VuZC10by1BZ2VudFxuICAvLyBwcm90b2NvbCkuIEFic2VudCBvbiBwbGFpbiBKU09OTCBleHBvcnRzLlxuICBhZ2VudFByb3RvY29sPzoge2FyY2hpdmVQYXRoOiBzdHJpbmd9O1xuICAvLyBWZW5kb3JlZCBza2lsbCBkb2N1bWVudHMgYnVuZGxlZCBpbnRvIHRoaXMgYXJjaGl2ZSAoc3Vic2V0IG9mIHRoZVxuICAvLyByaWNoZXIgc2tpbGxzLWluZGV4Lmpzb24gYXQgdGhlIGFyY2hpdmUgcm9vdCkuIGBpbnZvY2F0aW9uYCBjYXJyaWVzIGFcbiAgLy8gcGx1Z2luLWNvbW1hbmQgZm9ybSBmb3IgaGFybmVzc2VzIHRoYXQgc3VwcG9ydCBpdC5cbiAgYnVuZGxlZFNraWxscz86IEFycmF5PHtpZDogc3RyaW5nOyBraW5kOiAnc2tpbGwnIHwgJ3JlZmVyZW5jZSc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGludm9jYXRpb24/OiBzdHJpbmd9PjtcbiAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gIHBhZ2VzSHRtbD86IEFycmF5PHt1cmw6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn0+O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBQaW5jaEdyYWIg4oCUIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIgKE1WMylcbi8vXG4vLyDigKIgT3BlbiB0aGUgc2lkZSBwYW5lbCBvbiBhY3Rpb24gY2xpY2tcbi8vIOKAoiBJbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gYWxyZWFkeS1vcGVuIHRhYnMgKG5vIHJlZnJlc2ggbmVlZGVkKVxuLy8g4oCiIFJpZ2h0LWNsaWNrIFwiUGluY2hHcmFiIGNhcHR1cmVcIiBjb250ZXh0IG1lbnVcbi8vIOKAoiBDYXB0dXJlIHZpc2libGUtdGFiIHNjcmVlbnNob3RzIG9uIHNpZGUtcGFuZWwgcmVxdWVzdFxuLy8g4oCiIEF1dG8tb3BlbiB0aGUgc2lkZSBwYW5lbCBvbiBmaXJzdCBjYXB0dXJlICh1c2VzIENocm9tZSAxMTYrIHVzZXItZ2VzdHVyZVxuLy8gICBwcm9wYWdhdGlvbiB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKVxuLy8g4oCiIFJlbGF5IGNvbnRlbnQtc2NyaXB0IG1lc3NhZ2VzIHRvIHNpZGUtcGFuZWwgcG9ydHNcbi8vIOKAoiBTY3JlZW5zaG90IHdvcmtlcjogc2hvdC1lbGVtZW50IC8gc2hvdC1ncm91cCAvIHNob3QtcGFnZSBraW5kcy4gRWFjaFxuLy8gICBjYXB0dXJlcyB2aWEgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIsIG9wdGlvbmFsbHkgY3JvcHMvc3RpdGNoZXNcbi8vICAgaW4gYW4gT2Zmc2NyZWVuQ2FudmFzLCBhbmQgd3JpdGVzIHRoZSBQTkcgaW50byB0aGUgdXNlcidzIERvd25sb2Fkc1xuLy8gICB1bmRlciAucGluY2hncmFiLzx3b3Jrc3BhY2U+L3NjcmVlbnNob3RzLy5cblxuaW1wb3J0IHR5cGUge0FueU1lc3NhZ2UsIFBnRW52ZWxvcGUsIFNob3RSZXBseX0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge3BnfSBmcm9tICcuL3R5cGVzLnRzJztcblxuY29uc3QgTE9HID0gJ1tQaW5jaEdyYWIvYmddJztcblxuLy8g4pSA4pSA4pSAIFRvb2xiYXIgaWNvbjogcmVuZGVyIHRoZSDwn6SPIGVtb2ppIGludG8gSW1hZ2VEYXRhIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gV2UgZG9uJ3Qgc2hpcCBzdGF0aWMgUE5HIGljb25zOyB3ZSBkcmF3IHRoZW0gYXQgc3RhcnR1cCBzbyB0aGUgT1MncyBvd25cbi8vIHBpbmNoIGdseXBoIGlzIHVzZWQgKGNvbnNpc3RlbnQgd2l0aCB0aGUgYnJhbmQgaW4gdGhlIHNpZGUgcGFuZWwpLlxuYXN5bmMgZnVuY3Rpb24gc2V0RW1vamlJY29uKCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNpemVzID0gWzE2LCAzMiwgNDgsIDEyOF07XG4gICAgY29uc3QgaW1hZ2VEYXRhOiBSZWNvcmQ8bnVtYmVyLCBJbWFnZURhdGE+ID0ge307XG4gICAgZm9yIChjb25zdCBzaXplIG9mIHNpemVzKSB7XG4gICAgICBjb25zdCBjID0gbmV3IE9mZnNjcmVlbkNhbnZhcyhzaXplLCBzaXplKTtcbiAgICAgIGNvbnN0IGN0eCA9IGMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHNpemUsIHNpemUpO1xuICAgICAgY3R4LmZvbnQgPSBgJHtNYXRoLmZsb29yKHNpemUgKiAwLjgyKX1weCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsXCJTZWdvZSBVSSBFbW9qaVwiLFwiTm90byBDb2xvciBFbW9qaVwiLHNlcmlmYDtcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGN0eC5maWxsVGV4dCgn8J+kjycsIHNpemUgLyAyLCBzaXplIC8gMiArIHNpemUgKiAwLjA0KTtcbiAgICAgIGltYWdlRGF0YVtzaXplXSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgc2l6ZSwgc2l6ZSk7XG4gICAgfVxuICAgIGF3YWl0IGNocm9tZS5hY3Rpb24uc2V0SWNvbih7aW1hZ2VEYXRhfSk7XG4gIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ3NldEVtb2ppSWNvbicsIGUpOyB9XG59XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgdHJ5IHsgY2hyb21lLmNvbnRleHRNZW51cy5jcmVhdGUoe2lkOiAncGctY2FwdHVyZScsIHRpdGxlOiAnUGluY2hHcmFiIOKAlCBjYXB0dXJlIHRoaXMgZWxlbWVudCcsIGNvbnRleHRzOiBbJ2FsbCddfSk7IH1cbiAgY2F0Y2ggeyAvKiBtYXkgYWxyZWFkeSBleGlzdCAqLyB9XG4gIHZvaWQgc2V0RW1vamlJY29uKCk7XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwPy5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gIHZvaWQgc2V0RW1vamlJY29uKCk7XG59KTtcblxuLy8gRW5zdXJlIHRoZSB0b29sYmFyIGNsaWNrIGZpcmVzIE9VUiBhY3Rpb24ub25DbGlja2VkIChub3QgQ2hyb21lJ3MgcGFuZWxcbi8vIGF1dG8tb3Blbikgb24gRVZFUlkgc2VydmljZS13b3JrZXIgc3RhcnQg4oCUIG9uSW5zdGFsbGVkIGFsb25lIGlzIHVucmVsaWFibGVcbi8vIGFjcm9zcyByZWxvYWRzLCBhbmQgYSBzdGFsZSBvcGVuUGFuZWxPbkFjdGlvbkNsaWNrOnRydWUgc2lsZW50bHkgc3dhbGxvd3MgdGhlXG4vLyBjbGljayBzbyB0aGUgY29udGVudCBzY3JpcHQgbmV2ZXIgaW5qZWN0cyAoQWx0K0NsaWNrIGNhcHR1cmUgZ29lcyBkZWFkKS5cbi8vIElkZW1wb3RlbnQgYW5kIGNoZWFwLiAoIzE4KVxudm9pZCBjaHJvbWUuc2lkZVBhbmVsLnNldFBhbmVsQmVoYXZpb3Ioe29wZW5QYW5lbE9uQWN0aW9uQ2xpY2s6IGZhbHNlfSlcbiAgLmNhdGNoKChlKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnc2V0UGFuZWxCZWhhdmlvciAoc3RhcnR1cCknLCBlKSk7XG5cbi8vIOKUgOKUgOKUgCBBY3RpdmF0aW9uICgjMTgpOiB0b29sYmFyIGNsaWNrIGF0dGFjaGVzIFBpbmNoR3JhYiB0byBUSElTIHRhYiDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFBpbmNoR3JhYiBubyBsb25nZXIgYXV0by1pbmplY3RzIGludG8gZXZlcnkgcGFnZSDigJQgdGhlIDxhbGxfdXJscz5cbi8vIGNvbnRlbnRfc2NyaXB0cyBlbnRyeSBhbmQgaG9zdF9wZXJtaXNzaW9ucyBhcmUgZ29uZS4gQ2xpY2tpbmcgdGhlIHRvb2xiYXJcbi8vIGFjdGlvbiBncmFudHMgYWN0aXZlVGFiIGZvciB0aGUgY2xpY2tlZCB0YWI7IHdlIGluamVjdCB0aGUgY2FwdHVyZSBzY3JpcHRcbi8vIHRoZXJlIGFuZCBvcGVuIHRoZSBzaWRlIHBhbmVsLiBFYWNoIGFjdGl2YXRlZCB0YWIgYmVjb21lcyBpdHMgb3duIHdvcmtzcGFjZSxcbi8vIHRyYWNrZWQgcGFuZWwtc2lkZSB2aWEgdGhlIHBnLXRhYi1hY3RpdmF0ZWQgbWVzc2FnZSBiZWxvdy5cbi8vIOKUgOKUgOKUgCBBY3RpdmF0ZWQtdGFiIHRyYWNraW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gVGFicyBQaW5jaEdyYWIgaXMgYXR0YWNoZWQgdG8gKHRvb2xiYXIgY2xpY2sgb3IgcGFuZWwgcmUtYXR0YWNoKS4gU2Vzc2lvblxuLy8gc3RvcmFnZSBzdXJ2aXZlcyBzZXJ2aWNlLXdvcmtlciByZXN0YXJ0cyBhbmQgY2xlYXJzIG9uIGJyb3dzZXIgZXhpdCDigJQgdGhlXG4vLyBzYW1lIGxpZmV0aW1lIGFzIHRoZSBhY3RpdmVUYWIgZ3JhbnQgY2hhaW4gdGhlIHJlLWluamVjdCBwYXRoIHJlbGllcyBvbi5cbmNvbnN0IEFDVElWRV9UQUJTX0tFWSA9ICdwZy5hY3RpdmVUYWJzJztcbmNvbnN0IHJlYWRBY3RpdmVUYWJzID0gYXN5bmMgKCk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgYm9vbGVhbj4+ID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5nZXQoQUNUSVZFX1RBQlNfS0VZKTtcbiAgICByZXR1cm4gKG9bQUNUSVZFX1RBQlNfS0VZXSBhcyBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiB8IHVuZGVmaW5lZCkgPz8ge307XG4gIH0gY2F0Y2ggeyByZXR1cm4ge307IH1cbn07XG5jb25zdCB0cmFja0FjdGl2ZVRhYiA9IGFzeW5jICh0YWJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IGN1ciA9IGF3YWl0IHJlYWRBY3RpdmVUYWJzKCk7XG4gIGN1cltTdHJpbmcodGFiSWQpXSA9IHRydWU7XG4gIHRyeSB7IGF3YWl0IGNocm9tZS5zdG9yYWdlLnNlc3Npb24uc2V0KHtbQUNUSVZFX1RBQlNfS0VZXTogY3VyfSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxufTtcbmNvbnN0IHVudHJhY2tBY3RpdmVUYWIgPSBhc3luYyAodGFiSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCBjdXIgPSBhd2FpdCByZWFkQWN0aXZlVGFicygpO1xuICBpZiAoIShTdHJpbmcodGFiSWQpIGluIGN1cikpIHJldHVybjtcbiAgZGVsZXRlIGN1cltTdHJpbmcodGFiSWQpXTtcbiAgdHJ5IHsgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5zZXQoe1tBQ1RJVkVfVEFCU19LRVldOiBjdXJ9KTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG59O1xuXG5jaHJvbWUudGFicy5vblJlbW92ZWQuYWRkTGlzdGVuZXIoKHRhYklkKSA9PiB2b2lkIHVudHJhY2tBY3RpdmVUYWIodGFiSWQpKTtcblxuLy8gUmUtaW5qZWN0IGFmdGVyIGEgcmVmcmVzaCAvIHNhbWUtdGFiIG5hdmlnYXRpb24gb2YgYW4gYXR0YWNoZWQgdGFiLCBzb1xuLy8gQWx0K0NsaWNrIHN1cnZpdmVzIHJlbG9hZHMgd2l0aG91dCBhbm90aGVyIHRvb2xiYXIgY2xpY2suIFRoZSBhY3RpdmVUYWJcbi8vIGdyYW50IHBlcnNpc3RzIGFjcm9zcyByZWxvYWRzIG9mIHRoZSBncmFudGVkIHRhYjsgd2hlbiBDaHJvbWUgcmV2b2tlcyBpdFxuLy8gKGUuZy4gY3Jvc3Mtb3JpZ2luIG5hdmlnYXRpb24pIGV4ZWN1dGVTY3JpcHQgcmVqZWN0cyBhbmQgd2UgdW50cmFjayDigJRcbi8vIHRoZSBwYW5lbCdzIHJlLWF0dGFjaCBhZmZvcmRhbmNlIGNvdmVycyB0aGF0IGNhc2UuXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCBpbmZvLCB0YWIpID0+IHtcbiAgaWYgKGluZm8uc3RhdHVzICE9PSAnY29tcGxldGUnKSByZXR1cm47XG4gIGlmICghdGFiLnVybCB8fCAhL15odHRwcz86Ly50ZXN0KHRhYi51cmwpKSByZXR1cm47XG4gIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0cmFja2VkID0gYXdhaXQgcmVhZEFjdGl2ZVRhYnMoKTtcbiAgICBpZiAoIXRyYWNrZWRbU3RyaW5nKHRhYklkKV0pIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHt0YXJnZXQ6IHt0YWJJZCwgYWxsRnJhbWVzOiBmYWxzZX0sIGZpbGVzOiBbJ2NvbnRlbnQtc2NyaXB0LmpzJ10sIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdyZWluamVjdGVkIGFmdGVyIG5hdmlnYXRpb24nLCB0YWJJZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ3JlaW5qZWN0IGFmdGVyIG5hdmlnYXRpb24gZmFpbGVkIChncmFudCByZXZva2VkPyknLCB0YWJJZCwgZSk7XG4gICAgICBhd2FpdCB1bnRyYWNrQWN0aXZlVGFiKHRhYklkKTtcbiAgICB9XG4gIH0pKCk7XG59KTtcblxuY2hyb21lLmFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKHRhYikgPT4ge1xuICBpZiAoIXRhYj8uaWQpIHJldHVybjtcbiAgY29uc3QgdGFiSWQgPSB0YWIuaWQ7XG4gIGNvbnNvbGUubG9nKExPRywgJ2FjdGlvbiBjbGljayDihpIgYWN0aXZhdGUgdGFiJywgdGFiSWQsIHRhYi51cmwgPz8gJyhubyB1cmwpJyk7XG4gIC8vIEluamVjdCB0aGUgY2FwdHVyZSBzY3JpcHQgRklSU1QsIHdoaWxlIHRoZSBjbGljaydzIGFjdGl2ZVRhYiBncmFudCBpc1xuICAvLyBmcmVzaGVzdDsgYXR0ZW1wdCBvbiBodHRwKHMpIHBhZ2VzIChhbmQgd2hlbiB0aGUgVVJMIGlzIHVua25vd24pLCBhbmQgc2tpcFxuICAvLyByZXN0cmljdGVkIHNjaGVtZXMgd2hlcmUgaW5qZWN0aW9uIHdvdWxkIG9ubHkgZXJyb3IuXG4gIGlmICghdGFiLnVybCB8fCAvXmh0dHBzPzovLnRlc3QodGFiLnVybCkpIHtcbiAgICBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWQsIGFsbEZyYW1lczogZmFsc2V9LFxuICAgICAgZmlsZXM6IFsnY29udGVudC1zY3JpcHQuanMnXSxcbiAgICAgIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlLFxuICAgIH0pLmNhdGNoKChlKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnYWN0aXZhdGUgaW5qZWN0IEZBSUxFRCcsIGUpKTtcbiAgICB2b2lkIHRyYWNrQWN0aXZlVGFiKHRhYklkKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnYWN0aXZhdGU6IGNhbm5vdCBpbmplY3QgaW50bycsIHRhYi51cmwpO1xuICB9XG4gIC8vIFRoZW4gb3BlbiB0aGUgc2lkZSBwYW5lbCAoYWxzbyBhIHVzZXItZ2VzdHVyZSBjYWxsKS5cbiAgY2hyb21lLnNpZGVQYW5lbC5vcGVuKHt0YWJJZH0pLmNhdGNoKChlKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnc2lkZVBhbmVsLm9wZW4nLCBlKSk7XG4gIC8vIEJpbmQgdGhpcyB0YWIgdG8gYSB3b3Jrc3BhY2UgcGFuZWwtc2lkZS4gVGhlIHBhbmVsIG1heSBoYXZlIGp1c3Qgb3BlbmVkIGFuZFxuICAvLyBub3QgYmUgbGlzdGVuaW5nIHlldCwgc28gcmVwbGF5IGEgZmV3IHRpbWVzOyB0aGUgcGFuZWwgZGVkdXBzIGJ5IHRhYklkLlxuICBjb25zdCBtZXRhID0ge19fcGc6IHRydWUsIGtpbmQ6ICdwZy10YWItYWN0aXZhdGVkJywgdGFiSWQsIHVybDogdGFiLnVybCA/PyAnJywgdGl0bGU6IHRhYi50aXRsZSA/PyAnJ307XG4gIGNvbnN0IGFubm91bmNlID0gKCk6IHZvaWQgPT4geyB0cnkgeyB2b2lkIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1ldGEpLmNhdGNoPy4oKCkgPT4geyAvKiBub3QgdXAgeWV0ICovIH0pOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfTtcbiAgYW5ub3VuY2UoKTtcbiAgc2V0VGltZW91dChhbm5vdW5jZSwgMTUwKTtcbiAgc2V0VGltZW91dChhbm5vdW5jZSwgNTAwKTtcbn0pO1xuXG5jaHJvbWUuY29udGV4dE1lbnVzPy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKGluZm8sIHRhYikgPT4ge1xuICBpZiAoaW5mby5tZW51SXRlbUlkICE9PSAncGctY2FwdHVyZScgfHwgIXRhYj8uaWQpIHJldHVybjtcbiAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7X19wZzogdHJ1ZSwga2luZDogJ2NvbnRleHQtY2FwdHVyZSd9KS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbn0pO1xuXG4vLyDilIDilIDilIAgU2NyZWVuc2hvdCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyBGaWxlbmFtZSB0aW1lc3RhbXAgaXMgZXBvY2ggbWlsbGlzZWNvbmRzLiBTb3J0aW5nIGJ5IG5hbWUgPSBzb3J0aW5nIGJ5XG4vLyB0aW1lIHdpdGhpbiBhIGhvc3QgYnVja2V0LiBXZSBhY2NlcHQgYW4gb3B0aW9uYWwgSVNPIHN0cmluZyBmb3IgdGVzdHMgYnV0XG4vLyBub3JtYWxpemUgdG8gZXBvY2ggbXMgc28gdGhlIG91dHB1dCBpcyB1bmlmb3JtLlxuZXhwb3J0IGNvbnN0IHRzRm9yRmlsZW5hbWUgPSAoaXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFpc28pIHJldHVybiBTdHJpbmcoRGF0ZS5ub3coKSk7XG4gIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUodCkgPyBTdHJpbmcodCkgOiBTdHJpbmcoRGF0ZS5ub3coKSk7XG59O1xuXG4vLyBob3N0LXNsdWc6IHJlcGxhY2UgYC5gIHdpdGggYF9gIChwZXIgcHJvamVjdCBjb252ZW50aW9uIHNvIGZpbGVuYW1lcyBhcmVcbi8vIHNoZWxsLWZyaWVuZGx5IGFuZCBkb24ndCBsb29rIGxpa2UgbXVsdGktZXh0ZW5zaW9uIHBhdGhzIGxpa2UgYGFwcC5waW5jaFxuLy8gZ3JhYi5jb20tLi4uYCksIHN0cmlwIGFueSBvdGhlciBub24td29yZC9oeXBoZW4gY2hhcmFjdGVycywgY2FwIGF0IDQwXG4vLyBjaGFycy4gYGxvY2FsaG9zdDozMDAwYCDihpIgYGxvY2FsaG9zdF8zMDAwYC5cbmV4cG9ydCBjb25zdCBob3N0U2x1ZyA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGxldCBob3N0OiBzdHJpbmc7XG4gIHRyeSB7IGhvc3QgPSBuZXcgVVJMKHVybCkuaG9zdDsgfSBjYXRjaCB7IGhvc3QgPSAndW5rbm93bic7IH1cbiAgcmV0dXJuIGhvc3QucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG59O1xuXG4vLyBGaWxlbmFtZSBsYXlvdXQ6IGA8aG9zdF91bmRlcnNjb3JlZD4tbjxOPi08a2luZD5bLTxleHRyYT5dLTxlcG9jaD4ucG5nYC5cbi8vIEhvc3QgZmlyc3QgbWVhbnMgc2NyZWVuc2hvdHMgaW4gRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy9cbi8vIGdyb3VwIG5hdHVyYWxseSBwZXIgc2l0ZTsgZXBvY2ggYXMgYSB0YWlsIGtleSBnaXZlcyBjaHJvbm9sb2dpY2FsIG9yZGVyXG4vLyBpbnNpZGUgZWFjaCBidWNrZXQuXG5leHBvcnQgY29uc3QgYnVpbGRGaWxlbmFtZSA9IChcbiAga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyxcbiAgdHM6IHN0cmluZyxcbiAgbjogbnVtYmVyLFxuICB1cmw6IHN0cmluZyxcbiAgb3B0czoge2NvdW50PzogbnVtYmVyOyB0cnVuY2F0ZWQ/OiBib29sZWFufSA9IHt9LFxuKTogc3RyaW5nID0+IHtcbiAgY29uc3Qgc3RhbXAgPSB0c0ZvckZpbGVuYW1lKHRzKTtcbiAgY29uc3Qgc2x1ZyA9IGhvc3RTbHVnKHVybCk7XG4gIGlmIChraW5kID09PSAnZWxlbWVudCcpIHJldHVybiBgJHtzbHVnfS1uJHtufS1lbGVtZW50LSR7c3RhbXB9LnBuZ2A7XG4gIGlmIChraW5kID09PSAnZ3JvdXAnKSByZXR1cm4gYCR7c2x1Z30tbiR7bn0tZ3JvdXAke29wdHMuY291bnQgPz8gMH0tJHtzdGFtcH0ucG5nYDtcbiAgLy8gcGFnZVxuICBjb25zdCBzdWZmaXggPSBvcHRzLnRydW5jYXRlZCA/ICdwYWdlLXRydW5jJyA6ICdwYWdlJztcbiAgcmV0dXJuIGAke3NsdWd9LW4ke259LSR7c3VmZml4fS0ke3N0YW1wfS5wbmdgO1xufTtcblxuLy8gZGF0YVVSTCDihpIgQmxvYiB3aXRob3V0IGdvaW5nIHRocm91Z2ggZmV0Y2gvYXRvYiByb3VuZHRyaXBzIHRoYXQgYnJvd3NlcnNcbi8vIGluIHNlcnZpY2Utd29ya2VyIGNvbnRleHQgc29tZXRpbWVzIGJhbGsgYXQuIFBORyBvbmx5LlxuY29uc3QgZGF0YVVybFRvQmxvYiA9IGFzeW5jIChkYXRhVXJsOiBzdHJpbmcpOiBQcm9taXNlPEJsb2I+ID0+IHtcbiAgY29uc3QgciA9IGF3YWl0IGZldGNoKGRhdGFVcmwpO1xuICByZXR1cm4gci5ibG9iKCk7XG59O1xuXG4vLyBEZWNvZGUgYSBQTkcgZGF0YVVSTCBpbnRvIGFuIEltYWdlQml0bWFwIHVzYWJsZSBieSBPZmZzY3JlZW5DYW52YXMuIFdlXG4vLyBjYW4ndCBgbmV3IEltYWdlKClgIGluIGEgc2VydmljZSB3b3JrZXIg4oCUIEltYWdlIGlzIGEgRE9NLW9ubHkgY29uc3RydWN0b3IuXG5jb25zdCBkYXRhVXJsVG9CaXRtYXAgPSBhc3luYyAoZGF0YVVybDogc3RyaW5nKTogUHJvbWlzZTxJbWFnZUJpdG1hcD4gPT4ge1xuICBjb25zdCBibG9iID0gYXdhaXQgZGF0YVVybFRvQmxvYihkYXRhVXJsKTtcbiAgcmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xufTtcblxuLy8gRW5jb2RlIGFuIE9mZnNjcmVlbkNhbnZhcyB0byBhIFBORyBibG9iLlxuY29uc3QgY2FudmFzVG9CbG9iID0gYXN5bmMgKGNhbnZhczogT2Zmc2NyZWVuQ2FudmFzKTogUHJvbWlzZTxCbG9iPiA9PlxuICBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcblxuLy8gRG93bnNjYWxlIGEgYml0bWFwIGludG8gYSBQTkcgZGF0YVVSTCB3aXRoIG1heCB3aWR0aCBjYXBwZWQuIFRoZSB0aHVtYm5haWxcbi8vIGlzIHdoYXQgdGhlIHNpZGUgcGFuZWwgcGFpbnRzIGludG8gdGhlIC5wcmV2aWV3IHRpbGUg4oCUIHRoZSBvcmlnaW5hbCBsaXZlc1xuLy8gb25seSBvbiBkaXNrLiBXZSB1c2UgRmlsZVJlYWRlciAod29ya3MgaW4gTVYzIFNXcykgc2luY2UgdGhlIGRhdGFVUkwgaXNcbi8vIHBhc3NlZCBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugd2hlcmUgc2l6ZSBtYXR0ZXJzIGxlc3MuXG5jb25zdCBtYWtlVGh1bWJuYWlsID0gYXN5bmMgKGJpdG1hcDogSW1hZ2VCaXRtYXAsIG1heFdpZHRoID0gMzIwKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgcmF0aW8gPSBiaXRtYXAud2lkdGggPD0gbWF4V2lkdGggPyAxIDogbWF4V2lkdGggLyBiaXRtYXAud2lkdGg7XG4gIGNvbnN0IHcgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC53aWR0aCAqIHJhdGlvKSk7XG4gIGNvbnN0IGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC5oZWlnaHQgKiByYXRpbykpO1xuICBjb25zdCBjYW52YXMgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHcsIGgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICBjdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gJ2hpZ2gnO1xuICBjdHguZHJhd0ltYWdlKGJpdG1hcCwgMCwgMCwgdywgaCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcbiAgLy8gYXJyYXlCdWZmZXIgKyBidG9hIGF2b2lkcyBhbnkgRmlsZVJlYWRlci1hdmFpbGFiaWxpdHkgY29uY2Vybi5cbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG4vLyBQZXItdGFiIHNlcmlhbGl6YXRpb246IGF0IG1vc3Qgb25lIGNhcHR1cmUgaW4gZmxpZ2h0IGF0IGEgdGltZS4gV2l0aG91dCBhXG4vLyBxdWV1ZSwgdGhlIHRocm90dGxpbmcgb24gY2FwdHVyZVZpc2libGVUYWIgKH4yIGNhbGxzL3NlYykgc2hvd3MgdXAgYXNcbi8vIG1pc3Npbmcgc2NyZWVuc2hvdHMgd2hlbiB0aGUgdXNlciBmaXJlcyBzZXZlcmFsIGNhcHR1cmVzIGJhY2stdG8tYmFjay5cbnR5cGUgUXVldWVUYXNrID0gKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmNvbnN0IHRhYlF1ZXVlcyA9IG5ldyBNYXA8bnVtYmVyLCBQcm9taXNlPHZvaWQ+PigpO1xuY29uc3QgZW5xdWV1ZSA9ICh0YWJJZDogbnVtYmVyLCB0YXNrOiBRdWV1ZVRhc2spOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgcHJldiA9IHRhYlF1ZXVlcy5nZXQodGFiSWQpID8/IFByb21pc2UucmVzb2x2ZSgpO1xuICBjb25zdCBuZXh0ID0gcHJldi50aGVuKCgpID0+IHRhc2soKSkuY2F0Y2goKGUpID0+IHsgY29uc29sZS53YXJuKExPRywgJ3F1ZXVlIHRhc2sgZmFpbGVkJywgZSk7IH0pO1xuICB0YWJRdWV1ZXMuc2V0KHRhYklkLCBuZXh0KTtcbiAgcmV0dXJuIG5leHQ7XG59O1xuXG4vLyBPbmUtc2hvdCBDUyByb3VuZC10cmlwOiBhc2sgdGhlIGNvbnRlbnQgc2NyaXB0IHRvIGhpZGUgaXRzIG92ZXJsYXkgdGhlblxuLy8gd2FpdCBmb3IgYWNrLiBXZSB1c2Ugc2VuZE1lc3NhZ2Ugd2l0aCBhIHRpbWVvdXQgc28gYSBDUyB0aGF0J3Mgc3R1Y2sgb3Jcbi8vIG5vdCBsb2FkZWQgY2FuJ3Qgd2VkZ2UgdGhlIHF1ZXVlLlxuY29uc3QgdGVsbENzID0gYXN5bmMgPFQgPSB1bmtub3duPih0YWJJZDogbnVtYmVyLCBwYXlsb2FkOiBhbnksIHRpbWVvdXRNcyA9IDYwMCk6IFByb21pc2U8VCB8IG51bGw+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFQgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgZmluaXNoID0gKHY6IFQgfCBudWxsKTogdm9pZCA9PiB7IGlmICghZG9uZSkgeyBkb25lID0gdHJ1ZTsgcmVzb2x2ZSh2KTsgfSB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gZmluaXNoKG51bGwpLCB0aW1lb3V0TXMpO1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgcGcocGF5bG9hZCksIChyZXBseSkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7IGZpbmlzaChudWxsKTsgcmV0dXJuOyB9XG4gICAgICAgIGZpbmlzaCgocmVwbHkgPz8gbnVsbCkgYXMgVCB8IG51bGwpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7IGZpbmlzaChudWxsKTsgfVxuICB9KTtcbn07XG5cbi8vIFJ1biBhIGZ1bmN0aW9uIGluc2lkZSB0aGUgcGFnZSdzIG1haW4gd29ybGQgKG9yIGlzb2xhdGVkLCBkb2Vzbid0IG1hdHRlclxuLy8gaGVyZSBiZWNhdXNlIHdlIG9ubHkgcmVhZCBsYXlvdXQgbnVtYmVycykuIGFyZ3MgaXMgcGFzc2VkIHBvc2l0aW9uYWxseS5cbmNvbnN0IHJ1bkluUGFnZSA9IGFzeW5jIDxUPihcbiAgdGFiSWQ6IG51bWJlcixcbiAgZnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBULFxuICBhcmdzOiBhbnlbXSA9IFtdLFxuKTogUHJvbWlzZTxUIHwgbnVsbD4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWR9LFxuICAgICAgZnVuYzogZnVuYyBhcyBhbnksXG4gICAgICBhcmdzLFxuICAgIH0pO1xuICAgIHJldHVybiAocmVzdWx0cz8uWzBdPy5yZXN1bHQgPz8gbnVsbCkgYXMgVCB8IG51bGw7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAncnVuSW5QYWdlJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbi8vIENvbXB1dGUgdW5pb24gYmJveCBvZiBzZWxlY3RvcnMgSU5TSURFIHRoZSBwYWdlLCBzY3JvbGwgaXQgaW50byB2aWV3LCBhbmRcbi8vIHJldHVybiB0aGUgYmJveCArIGRwciBmb3IgY3JvcHBpbmcuIHBhZGRpbmcgaXMgYXBwbGllZCBzeW1tZXRyaWNhbGx5LlxudHlwZSBCYm94UmVzdWx0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7IHZ3OiBudW1iZXI7IHZoOiBudW1iZXJ9O1xuY29uc3QgY29tcHV0ZUFuZFNjcm9sbCA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgc2VsZWN0b3JzOiBzdHJpbmdbXSxcbiAgcGFkZGluZzogbnVtYmVyLFxuKTogUHJvbWlzZTxCYm94UmVzdWx0IHwgbnVsbD4gPT4ge1xuICByZXR1cm4gcnVuSW5QYWdlPEJib3hSZXN1bHQgfCBudWxsPih0YWJJZCwgKHNlbHM6IHN0cmluZ1tdLCBwYWQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGVscyA9IHNlbHMubWFwKChzKSA9PiB7XG4gICAgICB0cnkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKTsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gICAgfSkuZmlsdGVyKChlKTogZSBpcyBFbGVtZW50ID0+IEJvb2xlYW4oZSkpO1xuICAgIGlmICghZWxzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgLy8gU2Nyb2xsIHVuaW9uIG1pZHBvaW50IGludG8gdmlldyBmaXJzdDsgc29tZSBwYWdlcyBoYXZlIGxhenkgaW1hZ2VzXG4gICAgLy8gdGhhdCB3b24ndCBwYWludCB1bnRpbCB0aGV5J3JlIG5lYXIgdGhlIHZpZXdwb3J0LlxuICAgIGNvbnN0IHJlY3RzQmVmb3JlID0gZWxzLm1hcCgoZSkgPT4gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgY29uc3QgbWluWEFicyA9IE1hdGgubWluKC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5sZWZ0KSkgKyB3aW5kb3cuc2Nyb2xsWDtcbiAgICBjb25zdCBtaW5ZQWJzID0gTWF0aC5taW4oLi4ucmVjdHNCZWZvcmUubWFwKChyKSA9PiByLnRvcCkpICsgd2luZG93LnNjcm9sbFk7XG4gICAgY29uc3QgbWF4WEFicyA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5yaWdodCkpICsgd2luZG93LnNjcm9sbFg7XG4gICAgY29uc3QgbWF4WUFicyA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5ib3R0b20pKSArIHdpbmRvdy5zY3JvbGxZO1xuICAgIGNvbnN0IGN4ID0gKG1pblhBYnMgKyBtYXhYQWJzKSAvIDI7XG4gICAgY29uc3QgY3kgPSAobWluWUFicyArIG1heFlBYnMpIC8gMjtcbiAgICBjb25zdCB0YXJnZXRYID0gTWF0aC5tYXgoMCwgY3ggLSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIpO1xuICAgIGNvbnN0IHRhcmdldFkgPSBNYXRoLm1heCgwLCBjeSAtIHdpbmRvdy5pbm5lckhlaWdodCAvIDIpO1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogdGFyZ2V0WCwgdG9wOiB0YXJnZXRZLCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG5cbiAgICAvLyBSZWNvbXB1dGUgYmJveGVzIGFmdGVyIHNjcm9sbC5cbiAgICBjb25zdCByZWN0cyA9IGVscy5tYXAoKGUpID0+IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIubGVmdCkpIC0gcGFkO1xuICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIudG9wKSkgLSBwYWQ7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcCgocikgPT4gci5yaWdodCkpICsgcGFkO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoKHIpID0+IHIuYm90dG9tKSkgKyBwYWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1pblgsXG4gICAgICB5OiBtaW5ZLFxuICAgICAgdzogbWF4WCAtIG1pblgsXG4gICAgICBoOiBtYXhZIC0gbWluWSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHZ3OiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHZoOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgfTtcbiAgfSwgW3NlbGVjdG9ycywgcGFkZGluZ10pO1xufTtcblxuLy8gT25lLWZyYW1lIHlpZWxkIGluc2lkZSB0aGUgcGFnZSBzbyBhbnkgcG9zdC1zY3JvbGwgbGF5b3V0IHNldHRsZXMuIFdlIHBpblxuLy8gdG8gdHdvIHJBRnMgdG8gYmUgY29uc2VydmF0aXZlIOKAlCBwYWdlcyB3aXRoIHN0aWNreSBoZWFkZXJzIHNvbWV0aW1lcyBuZWVkXG4vLyB0aGUgc2Vjb25kIGZyYW1lIHRvIHJlcGFpbnQgdGhlIGhlYWRlciBhdCBpdHMgbmV3IG9mZnNldC5cbmNvbnN0IHlpZWxkUmFmID0gYXN5bmMgKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoKSA9PlxuICAgIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXNvbHZlKCkpKSksXG4gICk7XG59O1xuXG4vLyBSZXN0b3JlIHRoZSBwYWdlIHNjcm9sbCBwb3NpdGlvbiBhZnRlciBzdGl0Y2hpbmcuIFRoZSBvcmlnaW5hbCBwb3NpdGlvbnNcbi8vIGFyZSBwYXNzZWQgYmFjayBmcm9tIHRoZSBzdGl0Y2ggbG9vcC5cbmNvbnN0IHJlc3RvcmVTY3JvbGwgPSBhc3luYyAodGFiSWQ6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoc3g6IG51bWJlciwgc3k6IG51bWJlcikgPT4ge1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogc3gsIHRvcDogc3ksIGJlaGF2aW9yOiAnaW5zdGFudCcgYXMgU2Nyb2xsQmVoYXZpb3J9KTtcbiAgfSwgW3gsIHldKTtcbn07XG5cbmNvbnN0IFBBR0VfQ0hVTktfTElNSVQgPSA4O1xuY29uc3QgQ0FOVkFTX1BJWEVMX0xJTUlUID0gMTYzODQ7IC8vIE9mZnNjcmVlbkNhbnZhcyBzYWZldHkgY2FwXG5cbi8vIFBhZ2UgKGZ1bGwtZG9jdW1lbnQpIHNob3QuIExvb3BzIGNhcHR1cmVWaXNpYmxlVGFiIHdoaWxlIHNjcm9sbGluZyBieVxuLy8gdmlld3BvcnQtaGVpZ2h0IGNodW5rczsgc3RvcHMgYXQgY2h1bmsgY291bnQsIHBpeGVsIGNhcCwgb3Igc2Nyb2xsSGVpZ2h0LlxuY29uc3Qgc3RpdGNoUGFnZSA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsPiA9PiB7XG4gIC8vIFNuYXBzaG90IHNjcm9sbCBnZW9tZXRyeSB1cCBmcm9udC5cbiAgY29uc3QgZ2VvbSA9IGF3YWl0IHJ1bkluUGFnZTx7dnc6IG51bWJlcjsgdmg6IG51bWJlcjsgc3c6IG51bWJlcjsgc2g6IG51bWJlcjsgZHByOiBudW1iZXI7IHN4OiBudW1iZXI7IHN5OiBudW1iZXJ9PihcbiAgICB0YWJJZCxcbiAgICAoKSA9PiAoe1xuICAgICAgdnc6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgdmg6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIHN3OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGgsIGRvY3VtZW50LmJvZHk/LnNjcm9sbFdpZHRoID8/IDApLFxuICAgICAgc2g6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmJvZHk/LnNjcm9sbEhlaWdodCA/PyAwKSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHN4OiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgIHN5OiB3aW5kb3cuc2Nyb2xsWSxcbiAgICB9KSxcbiAgKTtcbiAgaWYgKCFnZW9tKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkcHIgPSBnZW9tLmRwcjtcbiAgY29uc3QgdG90YWxIID0gZ2VvbS5zaDtcbiAgY29uc3QgdG90YWxIcHggPSBNYXRoLnJvdW5kKHRvdGFsSCAqIGRwcik7XG4gIGNvbnN0IHdpZHRoUHggPSBNYXRoLnJvdW5kKGdlb20udncgKiBkcHIpO1xuXG4gIC8vIElmIHRoZSBwYWdlIGlzIHNob3J0IGVub3VnaCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LCBzaW5nbGUgc2hvdC5cbiAgbGV0IGNodW5rcyA9IDA7XG4gIGxldCB5ID0gMDtcbiAgbGV0IHN0aXRjaGVkSHB4ID0gMDtcbiAgbGV0IHRydW5jYXRlZCA9IGZhbHNlO1xuXG4gIC8vIEFsbG9jYXRlIHRoZSBjYW52YXMgYXQgdGhlIGNvbnNlcnZhdGl2ZSBmaW5hbCBzaXplOyB3ZSdsbCB0cmltIGxhdGVyIGlmXG4gIC8vIHdlIHN0b3AgZWFybHkuIHdpZHRoIGlzIGZpeGVkOyBoZWlnaHQgZ3Jvd3MgdXAgdG8gbWluKHRvdGFsSHB4LCBjYXApLlxuICBjb25zdCB0YXJnZXRIcHggPSBNYXRoLm1pbih0b3RhbEhweCwgQ0FOVkFTX1BJWEVMX0xJTUlUKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aFB4LCB0YXJnZXRIcHgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cbiAgd2hpbGUgKHkgPCB0b3RhbEgpIHtcbiAgICBpZiAoY2h1bmtzID49IFBBR0VfQ0hVTktfTElNSVQpIHsgdHJ1bmNhdGVkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICBpZiAoc3RpdGNoZWRIcHggPj0gQ0FOVkFTX1BJWEVMX0xJTUlUKSB7IHRydW5jYXRlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoeXk6IG51bWJlcikgPT4ge1xuICAgICAgd2luZG93LnNjcm9sbFRvKHtsZWZ0OiAwLCB0b3A6IHl5LCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG4gICAgfSwgW3ldKTtcbiAgICBhd2FpdCB5aWVsZFJhZih0YWJJZCk7XG4gICAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgICB0cnkge1xuICAgICAgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdjYXB0dXJlVmlzaWJsZVRhYiBwYWdlIGNodW5rIGZhaWxlZCcsIGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IGJtID0gYXdhaXQgZGF0YVVybFRvQml0bWFwKGRhdGFVcmwpO1xuICAgIC8vIERldGVybWluZSBob3cgbXVjaCBvZiBUSElTIGNodW5rIHRvIGRyYXcuIFRoZSBsYXN0IGNodW5rIHVzdWFsbHlcbiAgICAvLyBvdmVybGFwcyB0aGUgcHJldmlvdXMgb25lIChiZWNhdXNlIHRvdGFsSCBpcyBub3QgYSB2aWV3cG9ydCBtdWx0aXBsZSk7XG4gICAgLy8gZHJhd2luZyB0aGUgZnVsbCBiaXRtYXAgd291bGQgZHVwbGljYXRlIHBpeGVscy4gU28gd2UgY3JvcCBieSB0aGVcbiAgICAvLyByZW1haW5kZXIgb2YgdGhlIHBhZ2UgaGVpZ2h0IHdoZW4gb24gdGhlIHRhaWwuXG4gICAgY29uc3QgcmVtYWluaW5nUHggPSBNYXRoLnJvdW5kKCh0b3RhbEggLSB5KSAqIGRwcik7XG4gICAgY29uc3QgZHJhd1NyY0ggPSBNYXRoLm1pbihibS5oZWlnaHQsIHJlbWFpbmluZ1B4KTtcbiAgICBjb25zdCBkcmF3RGVzdEggPSBNYXRoLm1pbih0YXJnZXRIcHggLSBzdGl0Y2hlZEhweCwgZHJhd1NyY0gpO1xuICAgIGlmIChkcmF3RGVzdEggPD0gMCkgeyB0cnVuY2F0ZWQgPSB0cnVlOyBicmVhazsgfVxuICAgIGN0eC5kcmF3SW1hZ2UoYm0sIDAsIDAsIGJtLndpZHRoLCBkcmF3RGVzdEgsIDAsIHN0aXRjaGVkSHB4LCBibS53aWR0aCwgZHJhd0Rlc3RIKTtcbiAgICBzdGl0Y2hlZEhweCArPSBkcmF3RGVzdEg7XG4gICAgY2h1bmtzKys7XG4gICAgeSArPSBnZW9tLnZoO1xuICAgIGJtLmNsb3NlPy4oKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgc2Nyb2xsLlxuICBhd2FpdCByZXN0b3JlU2Nyb2xsKHRhYklkLCBnZW9tLnN4LCBnZW9tLnN5KTtcblxuICAvLyBUcmltIGNhbnZhcyB0byBhY3R1YWwgc3RpdGNoZWQgaGVpZ2h0IGlmIHdlIHN0b3BwZWQgYmVmb3JlIHRhcmdldEhweC5cbiAgbGV0IG91dENhbnZhcyA9IGNhbnZhcztcbiAgaWYgKHN0aXRjaGVkSHB4IDwgdGFyZ2V0SHB4KSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGhQeCwgTWF0aC5tYXgoMSwgc3RpdGNoZWRIcHgpKTtcbiAgICBjb25zdCB0Y3R4ID0gdHJpbW1lZC5nZXRDb250ZXh0KCcyZCcpITtcbiAgICB0Y3R4LmRyYXdJbWFnZShjYW52YXMsIDAsIDApO1xuICAgIG91dENhbnZhcyA9IHRyaW1tZWQ7XG4gIH1cbiAgY29uc3QgYmxvYiA9IGF3YWl0IGNhbnZhc1RvQmxvYihvdXRDYW52YXMpO1xuICBjb25zdCBiaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChibG9iKTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRydW5jYXRlZH07XG59O1xuXG4vLyBFbGVtZW50L2dyb3VwIHNob3Q6IGhpZGUgb3ZlcmxheXMsIGNhcHR1cmUgdmlld3BvcnQsIGNyb3AgaW4gY2FudmFzLlxuY29uc3Qgc2hvdEVsZW1lbnRDb21tb24gPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4gIHNlbGVjdG9yczogc3RyaW5nW10sXG4gIHBhZGRpbmc6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ119IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgLy8gSXRlbSAxNyAoZmxhc2hpbmcpOiBoaWRlICsgZnJlZXplIG92ZXJsYXlzIEJFRk9SRSB3ZSBzY3JvbGwgdGhlIHBhZ2UgdG9cbiAgLy8gZnJhbWUgdGhlIGNhcHR1cmUuIFRoZSBvbGQgb3JkZXIgc2Nyb2xsZWQgZmlyc3QsIHNvIHRoZSBjb250ZW50IHNjcmlwdCdzXG4gIC8vIHJpbmcgckFGIGxvb3BzIGNoYXNlZCB0aGUgbmV3IHNjcm9sbCBvZmZzZXQgKGEgdmlzaWJsZSBqdW1wKSBiZWZvcmUgdGhleVxuICAvLyB3ZXJlIGhpZGRlbiwgYW5kIGEgZ3JvdXBlZCBjYXB0dXJlJ3MgbWFueSByaW5ncyBhbXBsaWZpZWQgdGhlIGZsaWNrZXIuXG4gIC8vIEhpZGluZyBmaXJzdCBtZWFucyB0aGUgd2hvbGUgc2Nyb2xs4oaSeWllbGTihpJjYXB0dXJl4oaScmVzdG9yZSB3aW5kb3cgaGFwcGVuc1xuICAvLyB3aXRoIHRoZSBvdmVybGF5IGZyb3plbiBhbmQgb3V0IG9mIGxheW91dCDigJQgbm8gb24tc2NyZWVuIGZsYXNoLlxuICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnaGlkZS1vdmVybGF5cyd9KTtcbiAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgbGV0IGJib3g6IEJib3hSZXN1bHQgfCBudWxsID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBiYm94ID0gYXdhaXQgY29tcHV0ZUFuZFNjcm9sbCh0YWJJZCwgc2VsZWN0b3JzLCBwYWRkaW5nKTtcbiAgICBpZiAoIWJib3gpIHJldHVybiBudWxsO1xuICAgIGF3YWl0IHlpZWxkUmFmKHRhYklkKTtcbiAgICBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIod2luZG93SWQsIHtmb3JtYXQ6ICdwbmcnfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnY2FwdHVyZVZpc2libGVUYWIgZmFpbGVkJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfSk7XG4gIH1cblxuICBjb25zdCBibSA9IGF3YWl0IGRhdGFVcmxUb0JpdG1hcChkYXRhVXJsKTtcbiAgLy8gQ29udmVydCBDU1MtcGl4ZWwgYmJveCDihpIgZGV2aWNlLXBpeGVsIGJib3g7IGNsYW1wIHRvIGJpdG1hcCBib3VuZHMgc29cbiAgLy8gYSBwYXJ0aWFsbHkgb2ZmLXNjcmVlbiBlbGVtZW50IGRvZXNuJ3QgY3Jhc2ggZHJhd0ltYWdlLlxuICBjb25zdCBzeCA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoYmJveC54ICogYmJveC5kcHIpKTtcbiAgY29uc3Qgc3kgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGJib3gueSAqIGJib3guZHByKSk7XG4gIGNvbnN0IHN3ID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oYm0ud2lkdGggLSBzeCwgTWF0aC5yb3VuZChiYm94LncgKiBiYm94LmRwcikpKTtcbiAgY29uc3Qgc2ggPSBNYXRoLm1heCgxLCBNYXRoLm1pbihibS5oZWlnaHQgLSBzeSwgTWF0aC5yb3VuZChiYm94LmggKiBiYm94LmRwcikpKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyhzdywgc2gpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5kcmF3SW1hZ2UoYm0sIHN4LCBzeSwgc3csIHNoLCAwLCAwLCBzdywgc2gpO1xuICBibS5jbG9zZT8uKCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXNUb0Jsb2IoY2FudmFzKTtcbiAgY29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XG4gIC8vIEJ1ZyAjMyBmcm9tIHRoZSBleHBvcnQgcm9hc3Q6IHN1cmZhY2UgY3JvcCBtZXRhZGF0YSBzbyByZWNlaXZlcnNcbiAgLy8gY2FuIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZCB0aGUgb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlcy5cbiAgLy8gY3NzUmVjdCA9IHByZS1EUFIgQ1NTIHBpeGVsIHJlY3Qgb2YgdGhlIGNhcHR1cmVkIHJlZ2lvbi5cbiAgLy8gZGV2aWNlUHhSZWN0ID0gcG9zdC1EUFIgcGl4ZWwgcmVjdCBpbnNpZGUgdGhlIHNvdXJjZSBiaXRtYXAuXG4gIC8vIGltYWdlU2l6ZSA9IGRpbWVuc2lvbnMgb2YgdGhlIHByb2R1Y2VkIFBORy5cbiAgLy8gZHByID0gdGhlIGNvbnZlcnNpb24gZmFjdG9yLlxuICBjb25zdCBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ10gPSB7XG4gICAgY3NzUmVjdDoge3g6IGJib3gueCwgeTogYmJveC55LCB3OiBiYm94LncsIGg6IGJib3guaH0sXG4gICAgZGV2aWNlUHhSZWN0OiB7eDogc3gsIHk6IHN5LCB3OiBzdywgaDogc2h9LFxuICAgIGltYWdlU2l6ZToge3c6IHN3LCBoOiBzaH0sXG4gICAgZHByOiBiYm94LmRwcixcbiAgICBwYWRkaW5nLFxuICAgIHNlbGVjdG9ycyxcbiAgfTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRhYlVybCwgY3JvcE1ldGF9O1xufTtcblxuLy8gUGFnZS1vbmx5IHBhdGguIEhpZGVzIG92ZXJsYXlzLCBzdGl0Y2hlcywgcmVzdG9yZXMuXG5jb25zdCBzaG90UGFnZUNvbW1vbiA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfSk7XG4gIGxldCBzdGl0Y2hlZDoge2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBzdGl0Y2hlZCA9IGF3YWl0IHN0aXRjaFBhZ2UodGFiSWQsIHdpbmRvd0lkKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnc2hvdy1vdmVybGF5cyd9KTtcbiAgfVxuICBpZiAoIXN0aXRjaGVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsuLi5zdGl0Y2hlZCwgdGFiVXJsfTtcbn07XG5cbi8vIFNhdmUgdGhlIGJsb2IgYXMgYSBkb3dubG9hZCB1bmRlciAucGluY2hncmFiLzx3b3Jrc3BhY2U+LzxzdWJkaXI+Ly5cbi8vXG4vLyBNVjMgc2VydmljZSB3b3JrZXJzIERPIE5PVCBoYXZlIFVSTC5jcmVhdGVPYmplY3RVUkwg4oCUIGNhbGxpbmcgaXQgdGhyb3dzXG4vLyBcIlVSTC5jcmVhdGVPYmplY3RVUkwgaXMgbm90IGEgZnVuY3Rpb25cIiAodmVyaWZpZWQgbGl2ZSBpbiBleHRlbnNpb24uc3BlYykuXG4vLyBXZSBiYXNlNjQtZW5jb2RlIHRoZSBibG9iIGludG8gYSBkYXRhIFVSTCBpbnN0ZWFkLiBUcmFkZW9mZjogdGhlIGRhdGFcbi8vIFVSTCBpcyB+MzMlIGxhcmdlciB0aGFuIHJhdyBieXRlcywgYW5kIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgaGFzIGFcbi8vIGRhdGEtVVJMIHNpemUgbGltaXQgc29tZXdoZXJlIGFyb3VuZCAzMiBNQjsgZm9yIHR5cGljYWwgd29ya3NwYWNlXG4vLyBleHBvcnRzIChzdWItTUIgSlNPTkwgKyBsb3ctTUIgWklQcykgdGhpcyBpcyB3ZWxsIHVuZGVyIHRoZSBsaW1pdC5cbnR5cGUgU2F2ZWRGaWxlID0ge1xuICByZWxQYXRoOiBzdHJpbmc7XG4gIGFic1BhdGg6IHN0cmluZztcbiAgY29weVBhdGg6IHN0cmluZztcbiAgdGVtcFBhdGg6IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiBjaHJvbWUuZG93bmxvYWRzLkRvd25sb2FkSXRlbVsnc3RhdGUnXTtcbn07XG5cbmNvbnN0IGlzUGxheXdyaWdodEFydGlmYWN0UGF0aCA9IChwYXRoOiBzdHJpbmcpOiBib29sZWFuID0+XG4gIC8oPzpefFtcXFxcL10pKD86cGxheXdyaWdodC1hcnRpZmFjdHN8cGluY2hncmFiLWRsKS1bXlxcXFwvXStbXFxcXC9dWzAtOWEtZi1dezh9LVswLTlhLWYtXXs0fS1bMC05YS1mLV17NH0tWzAtOWEtZi1dezR9LVswLTlhLWYtXXsxMn0kL2kudGVzdChwYXRoKTtcblxuY29uc3QgYmxvYlRvRGF0YVVybCA9IGFzeW5jIChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIC8vIEJ1aWxkIGJhc2U2NCBpbiAzMiBLaUIgY2h1bmtzIHNvIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkgZG9lc24ndFxuICAvLyBvdmVyZmxvdyB0aGUgY2FsbCBzdGFjayBvbiBsYXJnZSBpbnB1dHMuXG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIGNvbnN0IG1pbWUgPSBibG9iLnR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIHJldHVybiBgZGF0YToke21pbWV9O2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuLy8g4pSA4pSA4pSAIFF1aWV0IHNhdmVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gV2l0aCB0aGUgb3B0aW9uYWwgYGRvd25sb2Fkcy51aWAgcGVybWlzc2lvbiBncmFudGVkIGFuZCB0aGUgcXVpZXRTYXZlc1xuLy8gcHJlZiBvbiwgQ2hyb21lJ3MgZG93bmxvYWQgYnViYmxlIGlzIHN1cHByZXNzZWQgd2hpbGUgUGluY2hHcmFiIHdyaXRlcyBpdHNcbi8vIG93biBmaWxlcywgdGhlbiByZXN0b3JlZCBhZnRlciBhIHNob3J0IGRlYm91bmNlIHNvIGJhY2stdG8tYmFjayBjYXB0dXJlc1xuLy8gZG9uJ3QgZmxhcCB0aGUgVUkgYW5kIHRoZSB1c2VyJ3Mgb3RoZXIgZG93bmxvYWRzIGtlZXAgdGhlaXIgc3VyZmFjZS5cbi8vIERlcHRoLWNvdW50ZWQ6IGNvbmN1cnJlbnQgc2F2ZXMgc2hhcmUgb25lIHN1cHByZXNzaW9uIHdpbmRvdy5cbmNvbnN0IFFVSUVUX1JFU1RPUkVfTVMgPSAxNTAwO1xubGV0IHF1aWV0RGVwdGggPSAwO1xubGV0IHF1aWV0UmVzdG9yZVRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IHVuZGVmaW5lZDtcbmNvbnN0IHNldERvd25sb2FkVWkgPSAoZW5hYmxlZDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGFwaSA9IChjaHJvbWUuZG93bmxvYWRzIGFzIHVua25vd24gYXMge3NldFVpT3B0aW9ucz86IChvOiB7ZW5hYmxlZDogYm9vbGVhbn0pID0+IFByb21pc2U8dm9pZD59KS5zZXRVaU9wdGlvbnM7XG4gICAgaWYgKGFwaSkgdm9pZCBhcGkuY2FsbChjaHJvbWUuZG93bmxvYWRzLCB7ZW5hYmxlZH0pLmNhdGNoKChlOiB1bmtub3duKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnc2V0VWlPcHRpb25zJywgZSkpO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzZXRVaU9wdGlvbnMgdGhyZXcnLCBlKTsgfVxufTtcbmNvbnN0IHF1aWV0U2F2ZXNBY3RpdmUgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3RvcmUgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3BpbmNoZ3JhYi5wcmVmcy52MicpO1xuICAgIGNvbnN0IHByZWZzID0gc3RvcmVbJ3BpbmNoZ3JhYi5wcmVmcy52MiddIGFzIHtxdWlldFNhdmVzPzogYm9vbGVhbn0gfCB1bmRlZmluZWQ7XG4gICAgaWYgKCFwcmVmcz8ucXVpZXRTYXZlcykgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMuY29udGFpbnMoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7XG4gIH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbn07XG5jb25zdCBiZWdpblF1aWV0ID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICBpZiAoIShhd2FpdCBxdWlldFNhdmVzQWN0aXZlKCkpKSByZXR1cm4gZmFsc2U7XG4gIHF1aWV0RGVwdGgrKztcbiAgaWYgKHF1aWV0UmVzdG9yZVRpbWVyKSB7IGNsZWFyVGltZW91dChxdWlldFJlc3RvcmVUaW1lcik7IHF1aWV0UmVzdG9yZVRpbWVyID0gdW5kZWZpbmVkOyB9XG4gIHNldERvd25sb2FkVWkoZmFsc2UpO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5jb25zdCBlbmRRdWlldCA9ICgpOiB2b2lkID0+IHtcbiAgaWYgKHF1aWV0RGVwdGggPiAwKSBxdWlldERlcHRoLS07XG4gIGlmIChxdWlldERlcHRoID09PSAwKSB7XG4gICAgaWYgKHF1aWV0UmVzdG9yZVRpbWVyKSBjbGVhclRpbWVvdXQocXVpZXRSZXN0b3JlVGltZXIpO1xuICAgIHF1aWV0UmVzdG9yZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7IHF1aWV0UmVzdG9yZVRpbWVyID0gdW5kZWZpbmVkOyBzZXREb3dubG9hZFVpKHRydWUpOyB9LCBRVUlFVF9SRVNUT1JFX01TKTtcbiAgfVxufTtcbi8vIFdvcmtlci1zdGFydCByZXN0b3JlIGd1YXJkOiBpZiBhIHByZXZpb3VzIHdvcmtlciBkaWVkIG1pZC1zdXBwcmVzc2lvbiB0aGVcbi8vIGJ1YmJsZSB3b3VsZCBzdGF5IGhpZGRlbiBmb3IgZXZlcnkgZG93bmxvYWQgaW4gdGhlIGJyb3dzZXIuIHNldFVpT3B0aW9uc1xuLy8gc3RhdGUgb3V0bGl2ZXMgdGhlIHdvcmtlciwgc28gcmUtZW5hYmxlIG9uIGV2ZXJ5IHN0YXJ0IChwZXJtaXNzaW9uLWdhdGVkLFxuLy8gbm8tb3Agb3RoZXJ3aXNlKS5cbnZvaWQgY2hyb21lLnBlcm1pc3Npb25zPy5jb250YWlucyh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KVxuICAudGhlbigoZ3JhbnRlZCkgPT4geyBpZiAoZ3JhbnRlZCkgc2V0RG93bmxvYWRVaSh0cnVlKTsgfSlcbiAgLmNhdGNoKCgpID0+IHsgLyogcGVybWlzc2lvbnMgQVBJIHVuYXZhaWxhYmxlIGluIHNvbWUgaGFybmVzc2VzICovIH0pO1xuXG5jb25zdCBzYXZlRG93bmxvYWQgPSBhc3luYyAoXG4gIGJsb2I6IEJsb2IsXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBzdWJkaXIgPSAnc2NyZWVuc2hvdHMnLFxuKTogUHJvbWlzZTxTYXZlZEZpbGU+ID0+IHtcbiAgY29uc3QgcmVsUGF0aCA9IHN1YmRpciA/IGAke3N1YmRpcn0vJHtmaWxlbmFtZX1gIDogZmlsZW5hbWU7XG4gIGNvbnN0IGZ1bGxQYXRoID0gYHBpbmNoZ3JhYi8ke3dvcmtzcGFjZX0vJHtyZWxQYXRofWA7XG4gIGNvbnNvbGUubG9nKExPRywgJ3NhdmVEb3dubG9hZCBzdGFydCcsIHtmdWxsUGF0aCwgbWltZTogYmxvYi50eXBlLCBzaXplOiBibG9iLnNpemV9KTtcbiAgY29uc3QgcXVpZXQgPSBhd2FpdCBiZWdpblF1aWV0KCk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHNhdmVEb3dubG9hZElubmVyKGJsb2IsIHdvcmtzcGFjZSwgcmVsUGF0aCwgZnVsbFBhdGgpO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChxdWlldCkgZW5kUXVpZXQoKTtcbiAgfVxufTtcblxuY29uc3Qgc2F2ZURvd25sb2FkSW5uZXIgPSBhc3luYyAoXG4gIGJsb2I6IEJsb2IsXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICByZWxQYXRoOiBzdHJpbmcsXG4gIGZ1bGxQYXRoOiBzdHJpbmcsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCB1cmwgPSBhd2FpdCBibG9iVG9EYXRhVXJsKGJsb2IpO1xuICBjb25zdCBkb3dubG9hZElkID0gYXdhaXQgbmV3IFByb21pc2U8bnVtYmVyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZChcbiAgICAgIHt1cmwsIGZpbGVuYW1lOiBmdWxsUGF0aCwgY29uZmxpY3RBY3Rpb246ICdvdmVyd3JpdGUnfSxcbiAgICAgIChpZCkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihMT0csICdjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGxhc3RFcnJvcjonLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPz8gJ2Rvd25sb2FkIGZhaWxlZCcpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgcmV0dXJuZWQgbm8gaWQnKTtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdkb3dubG9hZCByZXR1cm5lZCBubyBpZCcpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShpZCk7XG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuICBjb25zb2xlLmxvZyhMT0csICdjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGFjY2VwdGVkJywge2lkOiBkb3dubG9hZElkLCBmdWxsUGF0aH0pO1xuICAvLyBSZXNvbHZlIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIGFuZCBkbyBub3QgcmVwb3J0IHN1Y2Nlc3MgdW50aWwgQ2hyb21lIHNheXNcbiAgLy8gdGhlIGRvd25sb2FkIGNvbXBsZXRlZC4gYGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWRgIG9ubHkgbWVhbnMgXCJhY2NlcHRlZFwiO1xuICAvLyBkaXNrLWZ1bGwsIHBlcm1pc3Npb24sIG9yIGludGVycnVwdGVkIHdyaXRlcyBzdXJmYWNlIGxhdGVyIHRocm91Z2hcbiAgLy8gZG93bmxvYWRzLnNlYXJjaC5cbiAgbGV0IGFic1BhdGggPSBgJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gO1xuICBsZXQgZG93bmxvYWRTdGF0ZTogY2hyb21lLmRvd25sb2Fkcy5Eb3dubG9hZEl0ZW1bJ3N0YXRlJ10gfCB1bmRlZmluZWQ7XG4gIGxldCBpbnRlcnJ1cHRlZEVycm9yID0gJyc7XG4gIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgMTAwOyBhdHRlbXB0KyspIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBjaHJvbWUuZG93bmxvYWRzLnNlYXJjaCh7aWQ6IGRvd25sb2FkSWR9KTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtcz8uWzBdO1xuICAgICAgaWYgKGl0ZW0/LmZpbGVuYW1lKSBhYnNQYXRoID0gaXRlbS5maWxlbmFtZTtcbiAgICAgIGRvd25sb2FkU3RhdGUgPSBpdGVtPy5zdGF0ZTtcbiAgICAgIGlmIChpdGVtPy5zdGF0ZSA9PT0gJ2ludGVycnVwdGVkJykge1xuICAgICAgICBpbnRlcnJ1cHRlZEVycm9yID0gYGRvd25sb2FkIGludGVycnVwdGVkJHtpdGVtLmVycm9yID8gYDogJHtpdGVtLmVycm9yfWAgOiAnJ31gO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtPy5zdGF0ZSA9PT0gJ2NvbXBsZXRlJyAmJiBpdGVtLmZpbGVuYW1lKSBicmVhaztcbiAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMuc2VhcmNoIHRocmV3OicsIGUpOyB9XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMTAwKSk7XG4gIH1cbiAgaWYgKGludGVycnVwdGVkRXJyb3IpIHRocm93IG5ldyBFcnJvcihpbnRlcnJ1cHRlZEVycm9yKTtcbiAgaWYgKGRvd25sb2FkU3RhdGUgIT09ICdjb21wbGV0ZScpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGRvd25sb2FkIGRpZCBub3QgY29tcGxldGUke2Rvd25sb2FkU3RhdGUgPyBgIChzdGF0ZTogJHtkb3dubG9hZFN0YXRlfSlgIDogJyd9YCk7XG4gIH1cbiAgY29uc3QgdGVtcFBhdGggPSBpc1BsYXl3cmlnaHRBcnRpZmFjdFBhdGgoYWJzUGF0aCk7XG4gIC8vIFBsYXl3cmlnaHQgcmV3cml0ZXMgQ2hyb21lIGRvd25sb2FkcyB0byBleHRlbnNpb25sZXNzIFVVSUQgZmlsZXMgdW5kZXJcbiAgLy8gL3RtcC9wbGF5d3JpZ2h0LWFydGlmYWN0cy0qOyBjb3B5aW5nIHRoYXQgdG8gdGhlIHVzZXIgaXMgY29uZnVzaW5nIGFuZFxuICAvLyBvZnRlbiBzdGFsZS4gS2VlcCBpdCBpbiBhYnNQYXRoIGZvciB0ZXN0cy9kZWJ1Z2dpbmcsIGJ1dCBleHBvc2UgdGhlXG4gIC8vIGludGVuZGVkIGJyb3dzZXIgZG93bmxvYWQgdGFyZ2V0IGZvciB0aGUgc2lkZSBwYW5lbCdzIGNsaXBib2FyZCBhY3Rpb24uXG4gIGNvbnN0IGNvcHlQYXRoID0gdGVtcFBhdGggPyBgfi9Eb3dubG9hZHMvJHtmdWxsUGF0aH1gIDogYWJzUGF0aDtcbiAgY29uc29sZS5sb2coTE9HLCAnc2F2ZURvd25sb2FkIHJldHVybmluZycsIHtyZWxQYXRoLCBhYnNQYXRoLCBjb3B5UGF0aCwgdGVtcFBhdGgsIGRvd25sb2FkU3RhdGV9KTtcbiAgcmV0dXJuIHtyZWxQYXRoOiBgJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gLCBhYnNQYXRoLCBjb3B5UGF0aCwgdGVtcFBhdGgsIGRvd25sb2FkU3RhdGV9O1xufTtcblxuY29uc3Qgc2F2ZVRleHREb3dubG9hZCA9IGFzeW5jIChcbiAgdGV4dDogc3RyaW5nLFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgbWltZTogc3RyaW5nLFxuICBzdWJkaXIgPSAnZXhwb3J0cycsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICByZXR1cm4gc2F2ZURvd25sb2FkKGJsb2IsIHdvcmtzcGFjZSwgZmlsZW5hbWUsIHN1YmRpcik7XG59O1xuXG5jb25zdCBzYXZlQnl0ZXNEb3dubG9hZCA9IGFzeW5jIChcbiAgYnl0ZXM6IFVpbnQ4QXJyYXksXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBtaW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdleHBvcnRzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYnl0ZXMgYXMgdW5rbm93biBhcyBCbG9iUGFydF0sIHt0eXBlOiBtaW1lfSk7XG4gIHJldHVybiBzYXZlRG93bmxvYWQoYmxvYiwgd29ya3NwYWNlLCBmaWxlbmFtZSwgc3ViZGlyKTtcbn07XG5cbi8vIOKUgOKUgOKUgCBTZXJ2aWNlIHJlcXVlc3RzICsgcmVsYXkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZzogUGdFbnZlbG9wZTxBbnlNZXNzYWdlPiB8IGFueSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKCFtc2cgfHwgbXNnLl9fcGcgIT09IHRydWUpIHJldHVybiBmYWxzZTtcblxuICBpZiAobXNnLmtpbmQgPT09ICdjYXB0dXJlLXNjcmVlbnNob3QnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IG1zZy50YWJJZCA/IFthd2FpdCBjaHJvbWUudGFicy5nZXQobXNnLnRhYklkKV1cbiAgICAgICAgICA6IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgY29uc3QgdGFiID0gdGFic1swXTtcbiAgICAgICAgaWYgKCF0YWI/LndpbmRvd0lkKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6ICdubyBhY3RpdmUgdGFiJ30pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHRhYi53aW5kb3dJZCwge2Zvcm1hdDogJ3BuZyd9KTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtkYXRhVXJsfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZy5raW5kID09PSAnc3dpdGNoLXRvLXRhYicpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe3VybDogbXNnLnVybH0pO1xuICAgICAgICBpZiAodGFicy5sZW5ndGggJiYgdGFic1swXT8uaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGF3YWl0IGNocm9tZS50YWJzLnVwZGF0ZSh0YWJzWzBdLmlkLCB7YWN0aXZlOiB0cnVlfSk7XG4gICAgICAgICAgaWYgKHRhYnNbMF0ud2luZG93SWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLndpbmRvd3MudXBkYXRlKHRhYnNbMF0ud2luZG93SWQsIHtmb2N1c2VkOiB0cnVlfSk7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtmb3VuZDogdHJ1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5vcGVuSWZNaXNzaW5nKSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsOiBtc2cudXJsLCBhY3RpdmU6IHRydWV9KTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiBmYWxzZSwgb3BlbmVkOiB0LmlkfSk7XG4gICAgICAgIH0gZWxzZSBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiBmYWxzZX0pO1xuICAgICAgfSBjYXRjaCAoZSkgeyBzZW5kUmVzcG9uc2Uoe2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7IH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2cua2luZCA9PT0gJ2xpc3Qtb3Blbi10YWJzJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7dGFiczogdGFicy5maWx0ZXIoKHQpID0+IHQudXJsKS5tYXAoKHQpID0+ICh7aWQ6IHQuaWQsIHVybDogdC51cmwsIHRpdGxlOiB0LnRpdGxlfSkpfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHRhYnM6IFtdfSk7IH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKG1zZy5raW5kID09PSAnc2hvdC1lbGVtZW50JyB8fCBtc2cua2luZCA9PT0gJ3Nob3QtZ3JvdXAnIHx8IG1zZy5raW5kID09PSAnc2hvdC1wYWdlJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYklkID0gbXNnLnRhYklkID8/IHNlbmRlci50YWI/LmlkO1xuICAgICAgICBsZXQgcmVzb2x2ZWRUYWJJZCA9IHRhYklkO1xuICAgICAgICBsZXQgd2luZG93SWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgICAgcmVzb2x2ZWRUYWJJZCA9IHRhYnNbMF0/LmlkO1xuICAgICAgICAgIHdpbmRvd0lkID0gdGFic1swXT8ud2luZG93SWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmdldChyZXNvbHZlZFRhYklkKTtcbiAgICAgICAgICB3aW5kb3dJZCA9IHQ/LndpbmRvd0lkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNvbHZlZFRhYklkID09IG51bGwgfHwgd2luZG93SWQgPT0gbnVsbCkge1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSBzYXRpc2ZpZXMgU2hvdFJlcGx5KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFiSWRGaW5hbCA9IHJlc29sdmVkVGFiSWQ7XG4gICAgICAgIGNvbnN0IHdpbmRvd0lkRmluYWwgPSB3aW5kb3dJZDtcbiAgICAgICAgYXdhaXQgZW5xdWV1ZSh0YWJJZEZpbmFsLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgcnVuU2hvdChtc2csIHRhYklkRmluYWwsIHdpbmRvd0lkRmluYWwpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHJlcGx5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IHNhdGlzZmllcyBTaG90UmVwbHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gc2F0aXNmaWVzIFNob3RSZXBseSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIEZ1bGwtcGFnZSBzbmFwc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gUmV1c2VzIHRoZSBzYW1lXG4gIC8vIGhpZGUtb3ZlcmxheXMg4oaSIHN0aXRjaCDihpIgcmVzdG9yZSBwYXRoIGFzIHNob3QtcGFnZSwgYnV0IHJldHVybnMgdGhlIFBOR1xuICAvLyBhcyBhIGRhdGEgVVJMIGluc3RlYWQgb2Ygd3JpdGluZyBhIGZpbGUuIFNlcmlhbGl6ZWQgcGVyIHRhYiB0aHJvdWdoIHRoZVxuICAvLyBzYW1lIHF1ZXVlIHNvIGl0IGNhbid0IHJhY2UgYSBjb25jdXJyZW50IGVsZW1lbnQvZ3JvdXAgY2FwdHVyZS5cbiAgaWYgKG1zZy5raW5kID09PSAncGFnZS1zbmFwc2hvdC1zaG90Jykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYklkID0gbXNnLnRhYklkID8/IHNlbmRlci50YWI/LmlkO1xuICAgICAgICBsZXQgcmVzb2x2ZWRUYWJJZCA9IHRhYklkO1xuICAgICAgICBsZXQgd2luZG93SWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgICAgcmVzb2x2ZWRUYWJJZCA9IHRhYnNbMF0/LmlkO1xuICAgICAgICAgIHdpbmRvd0lkID0gdGFic1swXT8ud2luZG93SWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmdldChyZXNvbHZlZFRhYklkKTtcbiAgICAgICAgICB3aW5kb3dJZCA9IHQ/LndpbmRvd0lkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNvbHZlZFRhYklkID09IG51bGwgfHwgd2luZG93SWQgPT0gbnVsbCkge1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRhYklkRmluYWwgPSByZXNvbHZlZFRhYklkO1xuICAgICAgICBjb25zdCB3aW5kb3dJZEZpbmFsID0gd2luZG93SWQ7XG4gICAgICAgIGF3YWl0IGVucXVldWUodGFiSWRGaW5hbCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBnb3QgPSBhd2FpdCBzaG90UGFnZUNvbW1vbih0YWJJZEZpbmFsLCB3aW5kb3dJZEZpbmFsKTtcbiAgICAgICAgICAgIGlmICghZ290KSB7IHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ30pOyByZXR1cm47IH1cbiAgICAgICAgICAgIGNvbnN0IHNjcmVlbnNob3QgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgICAgICAgICBnb3QuYml0bWFwLmNsb3NlPy4oKTtcbiAgICAgICAgICAgIC8vIGB0cnVuY2F0ZWRgIGhlcmUgbWVhbnMgdGhlIHN0aXRjaCBzdG9wcGVkIGVhcmx5IChjaHVuay9waXhlbFxuICAgICAgICAgICAgLy8gY2FwKSDigJQgdGhlIFBORyBjb3ZlcnMgb25seSBwYXJ0IG9mIHRoZSBkb2N1bWVudCwgd2hpY2ggaXNcbiAgICAgICAgICAgIC8vIGV4YWN0bHkgdGhlIGBwYXJ0aWFsYCBzaWduYWwgdGhlIFBhZ2VTbmFwc2hvdCBjb250cmFjdCB3YW50cy5cbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IHRydWUsIHNjcmVlbnNob3QsIHBhcnRpYWw6IGdvdC50cnVuY2F0ZWR9KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gUGFuZWwtdHJpZ2dlcmVkIGNvbnRlbnQtc2NyaXB0IChyZSlpbmplY3Rpb24g4oCUIHRoZSByZWNvdmVyeSBwYXRoIGZvclxuICAvLyBcIkFsdCBzdG9wcGVkIHdvcmtpbmdcIiAoZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5lZCB0aGUgcGFnZSdzIHNjcmlwdCkuXG4gIGlmIChtc2cua2luZCA9PT0gJ3BnLXJlaW5qZWN0Jykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCB0YWJJZDogbnVtYmVyIHwgdW5kZWZpbmVkID0gbXNnLnRhYklkO1xuICAgICAgICBpZiAodGFiSWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgICAgdGFiSWQgPSB0YWJzWzBdPy5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFiSWQgPT0gbnVsbCkgeyBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6ICdubyBhY3RpdmUgdGFiJ30pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgdGFiID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHRhYklkKTtcbiAgICAgICAgaWYgKHRhYi51cmwgJiYgIS9eaHR0cHM/Oi8udGVzdCh0YWIudXJsKSkge1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogYGNhbm5vdCBhdHRhY2ggdG8gJHt0YWIudXJsfWB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHt0YXJnZXQ6IHt0YWJJZCwgYWxsRnJhbWVzOiBmYWxzZX0sIGZpbGVzOiBbJ2NvbnRlbnQtc2NyaXB0LmpzJ10sIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IHRyYWNrQWN0aXZlVGFiKHRhYklkKTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogdHJ1ZSwgdGFiSWR9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChtc2cua2luZCA9PT0gJ3NhdmUtdGV4dCcgfHwgbXNnLmtpbmQgPT09ICdzYXZlLWJ5dGVzJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBzdG9yZWQ6IFNhdmVkRmlsZTtcbiAgICAgICAgY29uc3Qgd29ya3NwYWNlID0gU3RyaW5nKG1zZy53b3Jrc3BhY2UgPz8gJ2RlZmF1bHQnKTtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBTdHJpbmcobXNnLmZpbGVuYW1lID8/ICdleHBvcnQuYmluJyk7XG4gICAgICAgIGNvbnN0IG1pbWUgPSBTdHJpbmcobXNnLm1pbWUgPz8gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpO1xuICAgICAgICBjb25zdCBzdWJkaXIgPSBTdHJpbmcobXNnLnN1YmRpciA/PyAnZXhwb3J0cycpO1xuICAgICAgICBpZiAobXNnLmtpbmQgPT09ICdzYXZlLXRleHQnKSB7XG4gICAgICAgICAgc3RvcmVkID0gYXdhaXQgc2F2ZVRleHREb3dubG9hZChTdHJpbmcobXNnLnRleHQgPz8gJycpLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBtaW1lLCBzdWJkaXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERlZmVuc2l2ZSBkZWNvZGU6IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGNhbiBkZWxpdmVyIGJ5dGVzXG4gICAgICAgICAgLy8gYXMgYSBVaW50OEFycmF5LCBhIG51bWJlcltdLCBvciBhIGdlbmVyaWMgaW5kZXhlZCBvYmplY3RcbiAgICAgICAgICAvLyAoZGVwZW5kaW5nIG9uIENocm9tZSB2ZXJzaW9uICsgY2FsbGVyKS4gQWNjZXB0IGFsbCBzaGFwZXMuXG4gICAgICAgICAgY29uc3QgcmF3OiBhbnkgPSBtc2cuYnl0ZXM7XG4gICAgICAgICAgbGV0IGJ5dGVzOiBVaW50OEFycmF5O1xuICAgICAgICAgIGlmIChyYXcgaW5zdGFuY2VvZiBVaW50OEFycmF5KSBieXRlcyA9IHJhdztcbiAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJhdykpIGJ5dGVzID0gVWludDhBcnJheS5mcm9tKHJhdyk7XG4gICAgICAgICAgZWxzZSBpZiAocmF3ICYmIHR5cGVvZiByYXcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyhyYXcpIGFzIG51bWJlcltdO1xuICAgICAgICAgICAgYnl0ZXMgPSBVaW50OEFycmF5LmZyb20odmFscyk7XG4gICAgICAgICAgfSBlbHNlIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlLWJ5dGVzIGRlY29kZWQnLCB7Ynl0ZXM6IGJ5dGVzLmxlbmd0aCwgcmF3VHlwZTogdHlwZW9mIHJhdywgaXNBcnJheTogQXJyYXkuaXNBcnJheShyYXcpLCBpc1U4OiByYXcgaW5zdGFuY2VvZiBVaW50OEFycmF5fSk7XG4gICAgICAgICAgc3RvcmVkID0gYXdhaXQgc2F2ZUJ5dGVzRG93bmxvYWQoYnl0ZXMsIHdvcmtzcGFjZSwgZmlsZW5hbWUsIG1pbWUsIHN1YmRpcik7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgICAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBBdXRvLW9wZW4gdGhlIHNpZGUgcGFuZWwgb24gZmlyc3QgY2FwdHVyZS9zdGFnaW5nLiBDaHJvbWUgMTE2KyBwcm9wYWdhdGVzXG4gIC8vIHRoZSB1c2VyIGFjdGl2YXRpb24gdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBzbyB0aGlzIGRvZXNuJ3RcbiAgLy8gdGhyb3cg4oCUIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgY2FwdHVyZSBpbiB0aGUgY29udGVudCBzY3JpcHQgaXNcbiAgLy8gc3RpbGwgY29uc2lkZXJlZCBcImxpdmVcIiBoZXJlIGluIHRoZSB3b3JrZXIuXG4gIC8vXG4gIC8vIElOVkVTVElHQVRFLTEgKGZpcnN0LWNhcHR1cmUgcmFjZSk6IG9uIHRoZSBWRVJZIEZJUlNUIEFsdCtDbGljayB0aGUgcGFuZWxcbiAgLy8gZG9jdW1lbnQgZG9lc24ndCBleGlzdCB5ZXQsIHNvIGl0cyBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UgbGlzdGVuZXIgaXNuJ3RcbiAgLy8gcmVnaXN0ZXJlZC4gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugb25seSByZWFjaGVzIGxpc3RlbmVycyB0aGF0IGFyZVxuICAvLyBhbHJlYWR5IGxpdmUsIHNvIHRoaXMgZmlyc3QgY2FwdHVyZSBpcyBkcm9wcGVkIOKAlCB0aGUgdXNlciBoYXMgdG8gY2xpY2sgYVxuICAvLyBzZWNvbmQgdGltZSAocGFuZWwgbm93IGxpc3RlbmluZykgdG8gc2VlIGl0LiBUaGUgcm9idXN0IGZpeCBpcyBhIHBhbmVs4oaSYmdcbiAgLy8gXCJwYW5lbC1yZWFkeSwgc2VuZCBtZSBhbnl0aGluZyBwZW5kaW5nXCIgaGFuZHNoYWtlLCBidXQgdGhhdCBuZWVkcyBhXG4gIC8vIHNpZGVwYW5lbC50cyBjaGFuZ2UgKHJlcG9ydGVkIHNlcGFyYXRlbHkpLiBBcyBhIGJhY2tncm91bmQtb25seSwgbG93LXJpc2tcbiAgLy8gbWl0aWdhdGlvbiB3ZSByZS1icm9hZGNhc3QgdGhlIGZpcnN0IGNhcHR1cmUocykgYSBmZXcgdGltZXMgb3ZlciBhIHNob3J0XG4gIC8vIHdpbmRvdyBBRlRFUiBvcGVuaW5nIHRoZSBwYW5lbC4gVGhlIHBhbmVsIHJlZ2lzdGVycyBpdHMgb25NZXNzYWdlIGxpc3RlbmVyXG4gIC8vIHN5bmNocm9ub3VzbHkgYXQgc2NyaXB0LWV2YWwgKGJlZm9yZSBpdHMgYXN5bmMgbG9hZEFsbCksIGFuZCBpdCBhbHJlYWR5XG4gIC8vIGJ1ZmZlcnMgbWVzc2FnZXMgdW50aWwgcmVhZHkgQU5EIGRlZHVwZXMgYnkgX19taWQg4oCUIHNvIGEgcmVwbGF5IHRoYXQgbGFuZHNcbiAgLy8gYWZ0ZXIgdGhlIGxpc3RlbmVyIGV4aXN0cyBpcyBwcm9jZXNzZWQgZXhhY3RseSBvbmNlLCBhbmQgcmVwbGF5cyB0aGF0IGxvc2VcbiAgLy8gdGhlIHJhY2UgYXJlIGhhcm1sZXNzIG5vLW9wcy5cbiAgLy9cbiAgLy8gV2UgZ3VhcmQgb24gYHNlbmRlci50YWI/LmlkICE9IG51bGxgIHNvIG91ciBPV04gcmVwbGF5cyAod2hpY2ggaGF2ZSBub1xuICAvLyBzZW5kZXIudGFiKSBuZXZlciByZS1lbnRlciB0aGlzIGJyYW5jaCDigJQgbm8gb3Blbi9yZXBsYXkgbG9vcC5cbiAgaWYgKChtc2cua2luZCA9PT0gJ2NhcHR1cmUnIHx8IG1zZy5raW5kID09PSAncGVuZGluZy1hZGQnKSAmJiBzZW5kZXIudGFiPy5pZCAhPSBudWxsKSB7XG4gICAgY2hyb21lLnNpZGVQYW5lbC5vcGVuKHt0YWJJZDogc2VuZGVyLnRhYi5pZH0pLmNhdGNoKCgpID0+IHsgLyogYWxyZWFkeSBvcGVuICovIH0pO1xuICAgIC8vIEFsd2F5cyByZXBsYXkg4oCUIHdlIGNhbid0IHJlbGlhYmx5IHRlbGwgZnJvbSBoZXJlIHdoZXRoZXIgdGhlIHBhbmVsIHdhc1xuICAgIC8vIGFscmVhZHkgbGlzdGVuaW5nIChzaWRlUGFuZWwgaGFzIG5vIFwiaXMtb3BlblwiIEFQSSwgYW5kIG9wZW4oKSByZXNvbHZpbmdcbiAgICAvLyB2cyByZWplY3RpbmcgaXMgbm90IGEgY2xlYW4gc2lnbmFsIGFjcm9zcyBDaHJvbWUgdmVyc2lvbnMgLyBnZXN0dXJlXG4gICAgLy8gc3RhdGVzKS4gT3Zlci1yZXBsYXlpbmcgd2hlbiB0aGUgcGFuZWwgaXMgYWxyZWFkeSB1cCBpcyBoYXJtbGVzczogdGhlXG4gICAgLy8gcGFuZWwgZGVkdXBlcyBieSBfX21pZCwgc28gdGhlIHJlZHVuZGFudCBicm9hZGNhc3RzIGNvbGxhcHNlIHRvIG5vdGhpbmcuXG4gICAgLy8gVW5kZXItcmVwbGF5aW5nIHdvdWxkIHJlc3VycmVjdCB0aGUgZHJvcHBlZC1maXJzdC1jYXB0dXJlIGJ1Zywgc28gd2UgZXJyXG4gICAgLy8gdG93YXJkIGFsd2F5cyByZXBsYXlpbmcuIFRoZSB3aW5kb3cgaXMgc2hvcnQgYW5kIGJvdW5kZWQgKDMgc2VuZHMpLlxuICAgIHJlcGxheUZpcnN0Q2FwdHVyZShtc2cgYXMgUGdFbnZlbG9wZTxBbnlNZXNzYWdlPik7XG4gIH1cblxuICAvLyBObyBwb3J0IHJlbGF5OiB0aGUgc2lkZSBwYW5lbCBsaXN0ZW5zIGRpcmVjdGx5IG9uIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZSxcbiAgLy8gd2hpY2ggYWxyZWFkeSByZWNlaXZlcyBicm9hZGNhc3RzIGZyb20gY29udGVudCBzY3JpcHRzLiBSZWxheWluZyB0aHJvdWdoXG4gIC8vIGEgcG9ydCBjYXVzZXMgZXZlcnkgbWVzc2FnZSB0byBiZSBkZWxpdmVyZWQgdHdpY2Ug4oCUIHRoYXQgc3VyZmFjZWQgYXNcbiAgLy8gZHVwbGljYXRlZCBtdWx0aS1zZWxlY3QgZW50cmllcyBpbiBwcm9kdWN0aW9uLlxuICByZXR1cm4gZmFsc2U7XG59KTtcblxuLy8gUmUtYnJvYWRjYXN0IGEgY2FwdHVyZS9wZW5kaW5nLWFkZCBlbnZlbG9wZSBhIGZldyB0aW1lcyBvdmVyIGEgc2hvcnQgd2luZG93XG4vLyBzbyBhIGZyZXNobHktb3BlbmVkIHNpZGUgcGFuZWwgKHdob3NlIGxpc3RlbmVyIHJlZ2lzdGVycyBhIGZldyBtcyBhZnRlciB0aGVcbi8vIGRvY3VtZW50IHN0YXJ0cyBsb2FkaW5nKSBjYXRjaGVzIGl0LiBTYW1lIF9fbWlkIGVhY2ggdGltZSDihpIgdGhlIHBhbmVsJ3Ncbi8vIHJlY2VudE1pZHMgcmluZyBkZWR1cGVzIHRvIGEgc2luZ2xlIHByb2Nlc3NlZCBtZXNzYWdlLiBCb3VuZGVkIChubyBsb29wKTpcbi8vIHRocmVlIGF0dGVtcHRzIGluc2lkZSB+NDUwbXMsIHRoZW4gd2Ugc3RvcC4gUmVzZW5kaW5nIHRoZSBTQU1FIGVudmVsb3BlIGlzXG4vLyBpbXBvcnRhbnQg4oCUIGEgbmV3IF9fbWlkIHdvdWxkIGRlZmVhdCB0aGUgZGVkdXAgYW5kIGRvdWJsZS1pbnNlcnQuXG5jb25zdCBSRVBMQVlfREVMQVlTX01TID0gWzYwLCAxODAsIDQ1MF07XG5jb25zdCByZXBsYXlGaXJzdENhcHR1cmUgPSAoZW52ZWxvcGU6IFBnRW52ZWxvcGU8QW55TWVzc2FnZT4pOiB2b2lkID0+IHtcbiAgZm9yIChjb25zdCBkZWxheSBvZiBSRVBMQVlfREVMQVlTX01TKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBzZW5kTWVzc2FnZSB3aXRoIG5vIGNhbGxiYWNrOyB0aGUgcGFuZWwgY29uc3VtZXMgaXQuIFdyYXBwZWQgc28gYVxuICAgICAgLy8gXCJyZWNlaXZpbmcgZW5kIGRvZXMgbm90IGV4aXN0XCIgcmVqZWN0aW9uIChwYW5lbCBzdGlsbCBub3QgdXAgb24gdGhlXG4gICAgICAvLyBlYXJsaWVzdCBhdHRlbXB0KSBpcyBzd2FsbG93ZWQgcmF0aGVyIHRoYW4gbG9nZ2VkIGFzIGFuIGVycm9yLlxuICAgICAgdHJ5IHsgdm9pZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShlbnZlbG9wZSkuY2F0Y2g/LigoKSA9PiB7IC8qIG5vdCB1cCB5ZXQgKi8gfSk7IH1cbiAgICAgIGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LCBkZWxheSk7XG4gIH1cbn07XG5cbi8vIEVuY29kZSBhIFBORyBibG9iIGludG8gYSBiYXNlNjQgZGF0YSBVUkwgdXNpbmcgdGhlIHNhbWUgY2h1bmtlZC1idG9hXG4vLyBwYXRoIHNhdmVEb3dubG9hZCB1c2VzLiBUaGUgcmVzdWx0IGlzIHR3byBwdXJwb3Nlcy1pbi1vbmU6IHRoZVxuLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgZ29lcyBiYWNrIHRvIHRoZSBzaWRlIHBhbmVsJ3MgcHJldmlldyB0aWxlIChzbWFsbCxcbi8vIH41LTE1IEtCKSwgd2hpbGUgdGhlIEZVTEwgcG5nIGFsc28gcmlkZXMgYmFjayBzbyB0aGUgcGFuZWwgY2FuIHN0YXNoIGl0XG4vLyBpbiBgc2hvdHNGdWxsYCBhbmQgYnVuZGxlIGl0IGludG8gdGhlIHdvcmtzcGFjZSAudGFyLnpzdCBleHBvcnQgbGF0ZXIuXG5jb25zdCBibG9iVG9GdWxsRGF0YVVybCA9IGFzeW5jIChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG5jb25zdCBydW5TaG90ID0gYXN5bmMgKG1zZzogYW55LCB0YWJJZDogbnVtYmVyLCB3aW5kb3dJZDogbnVtYmVyKTogUHJvbWlzZTxTaG90UmVwbHk+ID0+IHtcbiAgY29uc3QgdHMgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIGNvbnN0IHBhZGRpbmcgPSB0eXBlb2YgbXNnLnBhZGRpbmcgPT09ICdudW1iZXInID8gbXNnLnBhZGRpbmcgOiAyNDtcbiAgaWYgKG1zZy5raW5kID09PSAnc2hvdC1lbGVtZW50Jykge1xuICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RFbGVtZW50Q29tbW9uKHRhYklkLCB3aW5kb3dJZCwgW21zZy5zZWxlY3Rvcl0sIHBhZGRpbmcpO1xuICAgIGlmICghZ290KSByZXR1cm4ge29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9O1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRGaWxlbmFtZSgnZWxlbWVudCcsIHRzLCBtc2cubiwgZ290LnRhYlVybCk7XG4gICAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gICAgY29uc3QgZnVsbERhdGFVcmwgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCxcbiAgICAgIGNyb3A6IGdvdC5jcm9wTWV0YSxcbiAgICB9O1xuICB9XG4gIGlmIChtc2cua2luZCA9PT0gJ3Nob3QtZ3JvdXAnKSB7XG4gICAgY29uc3QgZ290ID0gYXdhaXQgc2hvdEVsZW1lbnRDb21tb24odGFiSWQsIHdpbmRvd0lkLCBtc2cuc2VsZWN0b3JzLCBwYWRkaW5nKTtcbiAgICBpZiAoIWdvdCkgcmV0dXJuIHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ2dyb3VwJywgdHMsIG1zZy5uLCBnb3QudGFiVXJsLCB7Y291bnQ6IG1zZy5zZWxlY3RvcnMubGVuZ3RofSk7XG4gICAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gICAgY29uc3QgZnVsbERhdGFVcmwgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCxcbiAgICAgIGNyb3A6IGdvdC5jcm9wTWV0YSxcbiAgICB9O1xuICB9XG4gIC8vIHBhZ2VcbiAgY29uc3QgZ290ID0gYXdhaXQgc2hvdFBhZ2VDb21tb24odGFiSWQsIHdpbmRvd0lkKTtcbiAgaWYgKCFnb3QpIHJldHVybiB7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ307XG4gIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRGaWxlbmFtZSgncGFnZScsIHRzLCBtc2cubiwgZ290LnRhYlVybCwge3RydW5jYXRlZDogZ290LnRydW5jYXRlZH0pO1xuICBjb25zdCBzdG9yZWQgPSBhd2FpdCBzYXZlRG93bmxvYWQoZ290LmJsb2IsIG1zZy53b3Jrc3BhY2UsIGZpbGVuYW1lKTtcbiAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICBnb3QuYml0bWFwLmNsb3NlPy4oKTtcbiAgcmV0dXJuIHtcbiAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCwgdHJ1bmNhdGVkOiBnb3QudHJ1bmNhdGVkLFxuICB9O1xufTtcblxuLy8gKHNhdmUtdGV4dCAvIHNhdmUtYnl0ZXMgYXJlIGZvbGRlZCBpbnRvIHRoZSBzaW5nbGUgbGlzdGVuZXIgYWJvdmUuKVxuIgogIF0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBeW5CQSxJQUFJLGNBQWM7QUFBQSxFQUNsQixJQUFNLFNBQVMsTUFBYztBQUFBLElBQzNCLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsYUFBYSxTQUFTLEVBQUU7QUFBQSxJQUN4RSxJQUFJO0FBQUEsTUFDRixNQUFNLFFBQVEsSUFBSSxXQUFXLENBQUM7QUFBQSxNQUM5QixXQUFXLE9BQU8sZ0JBQWdCLEtBQUs7QUFBQSxNQUN2QyxPQUFPLEdBQUcsVUFBVSxNQUFNLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUFBLE1BQ3pGLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBO0FBQUEsRUFLSixJQUFNLEtBQUssQ0FBMkIsYUFDMUMsRUFBQyxNQUFNLE1BQU0sT0FBTyxPQUFPLE1BQU0sUUFBTzs7O0VDdG5CM0MsSUFBTSxNQUFNO0FBQUEsRUFLWixlQUFlLFlBQVksR0FBa0I7QUFBQSxJQUMzQyxJQUFJO0FBQUEsTUFDRixNQUFNLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHO0FBQUEsTUFDOUIsTUFBTSxZQUF1QyxDQUFDO0FBQUEsTUFDOUMsV0FBVyxRQUFRLE9BQU87QUFBQSxRQUN4QixNQUFNLElBQUksSUFBSSxnQkFBZ0IsTUFBTSxJQUFJO0FBQUEsUUFDeEMsTUFBTSxNQUFNLEVBQUUsV0FB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
