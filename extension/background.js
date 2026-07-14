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
  chrome.runtime.onInstalled.addListener(async () => {
    try {
      chrome.contextMenus.create({ id: "pg-capture", title: "PinchGrab — capture this element", contexts: ["all"] });
    } catch {}
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

//# debugId=32D6416C0452947E64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9iYWNrZ3JvdW5kLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIFNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2wgYmV0d2VlbiBjb250ZW50IHNjcmlwdCwgc2lkZSBwYW5lbCwgYW5kXG4vLyBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyLlxuXG5leHBvcnQgdHlwZSBSZWN0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG5leHBvcnQgdHlwZSBWaWV3cG9ydCA9IHtcbiAgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyO1xuICAvLyBVc2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgYXQgY2FwdHVyZSB0aW1lLiBMZXRzIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhc29uIGFib3V0IHdoeSBjYXB0dXJlZCBhcHBlYXJhbmNlIGRpZmZlcnMgYmV0d2VlbiBzZXNzaW9uc1xuICAvLyAoZS5nLiBkYXJrLW1vZGUgdnMgbGlnaHQtbW9kZSBvZiB0aGUgc2FtZSBjb21wb25lbnQpLlxuICBjb2xvclNjaGVtZT86ICdkYXJrJyB8ICdsaWdodCc7XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICAvLyBEb2N1bWVudCBkaXJlY3Rpb24gKGBsdHJgIC8gYHJ0bGApIOKAlCBkaWZmZXJlbnQgZnJvbSB2aWV3cG9ydCBzaXplLFxuICAvLyBjaGFuZ2VzIHRoZSBtZWFuaW5nIG9mIGBzdGFydGAvYGVuZGAgaW4gQ1NTIGFuZCB0aGUgc2Vuc2Ugb2ZcbiAgLy8gYHJlY3QueGAuIENhcHR1cmVkIHBlciBwYWdlIGhlYWRlciBzbyBSVEwgY2FwdHVyZXMgZG9uJ3QgZ2V0XG4gIC8vIHNpbGVudGx5IG1peGVkIHdpdGggTFRSIG9uZXMuXG4gIGRpcmVjdGlvbj86ICdsdHInIHwgJ3J0bCc7XG4gIC8vIEJyb3dzZXIgem9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCByZXBvcnRzIHRoZSBwaW5jaC16b29tXG4gIC8vIGZhY3RvcjsgdmFsdWVzICE9IDEgbWVhbiB0aGUgdXNlciBoYXMgem9vbWVkIGluL291dCBhbmQgYW55IGxheW91dFxuICAvLyBidWcgdGhleSdyZSBjYXB0dXJpbmcgbWF5IG5vdCByZXBybyBhdCBkZWZhdWx0IHpvb20uXG4gIHpvb20/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGcmFtZXdvcmtJbmZvID0ge1xuICBmcmFtZXdvcms6ICdyZWFjdCcgfCAndnVlJyB8ICdsaXQnIHwgJ3N0ZW5jaWwnIHwgJ3N2ZWx0ZScgfCAnd2ViLWNvbXBvbmVudCc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuICBzb3VyY2U/OiB7ZmlsZT86IHN0cmluZyB8IG51bGw7IGxpbmU/OiBudW1iZXIgfCBudWxsfTtcbiAgLy8gVXAtdHJlZSBjb21wb25lbnQgYW5jZXN0cnkgKGlubmVybW9zdCBmaXJzdCkuIEZvciBSZWFjdCwgd2Fsa2VkIHZpYVxuICAvLyBmaWJlciBgcmV0dXJuYCBjaGFpbjsgZm9yIFZ1ZSwgdmlhIGBfX3Z1ZVBhcmVudENvbXBvbmVudC5wYXJlbnRgLlxuICAvLyBUaGUgY29tcG9uZW50IG5hbWUgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoaWNoIGZpbGUgb3ducyB0aGVcbiAgLy8gcmVuZGVyaW5nIOKAlCB0aGUgY2hhaW4gaGVscHMgaXQgZ3JlcCB1cHdhcmQgdG8gZmluZCB0aGUgcm91dGVcbiAgLy8gY29tcG9uZW50LCB0aGVuIGRyaWxsIGludG8gdGhlIG93bmluZyBmaWxlLlxuICBjaGFpbj86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5jZXN0b3IgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBNYXRjaGVkUnVsZSA9IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgZGVjbGFyYXRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWVkaWE/OiBzdHJpbmc7XG4gIC8vIFdhcyB0aGUgQG1lZGlhIHF1ZXJ5IHRoYXQgd3JhcHMgdGhpcyBydWxlIGFjdHVhbGx5IG1hdGNoZWQgYXRcbiAgLy8gY2FwdHVyZSB0aW1lPyBgdHJ1ZWAgPSBhY3RpdmUsXG4gIC8vIGBmYWxzZWAgPSBtYXRjaGVkIHRoZSBzZWxlY3RvciBidXQgaW5hY3RpdmUgKGUuZy4gbW9iaWxlIHJ1bGVzXG4gIC8vIGNhcHR1cmVkIG9uIGEgZGVza3RvcCB2aWV3cG9ydCksIGB1bmRlZmluZWRgID0gbWF0Y2hNZWRpYSB0aHJldy5cbiAgbWVkaWFBY3RpdmU/OiBib29sZWFuO1xufTtcblxuLy8gU3ludGhldGljIGhpbnRzIFBpbmNoR3JhYiBhZGRzIHRvIGVudHJpZXMg4oCUIGtlcHQgZGlzdGluY3QgZnJvbSBgYXR0cnNgXG4vLyAocmVhbCBET00gYXR0cmlidXRlcykgc28gY29uc3VtZXJzIGNhbiB0ZWxsIHdoYXQgY2FtZSBmcm9tIHRoZSBwYWdlIHZzXG4vLyB3aGF0IHRoZSBjYXB0dXJlIHBpcGVsaW5lIGluamVjdGVkLlxuZXhwb3J0IHR5cGUgRW50cnlIaW50cyA9IHtcbiAgZm9ybWF0Pzogc3RyaW5nOyAgICAgLy8gaW5wdXQgZm9ybWF0IGhpbnQgKGUuZy4gJ1lZWVktTU0tREQnKVxuICB2YWx1ZU1hc2tlZD86IGJvb2xlYW47IC8vIHBhc3N3b3JkIHZhbHVlIHdhcyBtYXNrZWQgYXQgY2FwdHVyZSB0aW1lXG59O1xuXG5leHBvcnQgdHlwZSBFbnRyeSA9IHtcbiAgLy8gU3RhYmxlIHBlci1lbnRyeSB1dWlkLiBHZW5lcmF0ZWQgYXQgY2FwdHVyZSB0aW1lLiBEaXN0aW5jdCBmcm9tIGBuYFxuICAvLyAoZGlzcGxheSBzZXF1ZW5jZSkgYW5kIGZyb20gYGlkYCAoRE9NIGh0bWwgaWQgYXR0cmlidXRlKS4gRm9yZWlnbi1rZXlcbiAgLy8gdGFyZ2V0IGZvciBGZWVkYmFja01lc3NhZ2UucGFyZW50SWQuXG4gIHVpZDogc3RyaW5nO1xuICAvLyBGb3JlaWduIGtleSBpbnRvIHRoZSBzZXNzaW9uIHJvdyAoUGFnZU1lc3NhZ2Uuc2Vzc2lvbklkKS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIGxpbmsgY2FwdHVyZXMgYmFjayB0byBcIndoaWNoIHBhZ2UtbG9hZCBjb250ZXh0IGRpZCB0aGV5XG4gIC8vIGNvbWUgZnJvbT9cIiB3aXRob3V0IGRlcGVuZGluZyBvbiBVUkwgc3RyaW5nIGVxdWFsaXR5LCB3aGljaCBicmVha3NcbiAgLy8gb24gaGFzaCBuYXZpZ2F0aW9uLCBxdWVyeS1wYXJhbSBzd2FwcywgYW5kIFNQQSByb3V0aW5nLiBTZXQgYnkgdGhlXG4gIC8vIHNpZGUgcGFuZWwgYXQgbWVzc2FnZS1yZWNlaXZlIHRpbWUsIG5vdCBvbiB0aGUgcGFnZSBzaWRlLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG4gIG46IG51bWJlcjtcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBvdXRlckhUTUw/OiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIC8vIFRoZSB2aXN1YWxseS1yZW5kZXJlZCBmb3JtIHdoZW4gQ1NTIGB0ZXh0LXRyYW5zZm9ybWAgaXMgc2V0LiBDYXB0dXJlZFxuICAvLyBhbG9uZ3NpZGUgYHRleHRgICh3aGljaCBpcyB0aGUgc291cmNlLXRydXRoIGB0ZXh0Q29udGVudGApIHNvIGFuIExMTVxuICAvLyBjYW4gZGlzYW1iaWd1YXRlIGJldHdlZW4gZS5nLiBzb3VyY2UgYFJlZnJlc2hgIGFuZCByZW5kZXJlZCBgUkVGUkVTSGBcbiAgLy8gd2l0aG91dCBmYWxzZS1ncmVwcGluZyBhZ2FpbnN0IGVpdGhlci5cbiAgcmVuZGVyZWRUZXh0Pzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICBhY2Nlc3NpYmxlTmFtZT86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7ICAgICAgICAgICAgLy8gdGhlIERPTSBodG1sIGlkIGF0dHJpYnV0ZSAodW5jaGFuZ2VkKVxuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbiAgYXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyByZWFsIERPTSBhdHRyaWJ1dGVzIG9ubHlcbiAgaGludHM/OiBFbnRyeUhpbnRzOyAgICAgLy8gc3ludGhldGljIGNhcHR1cmUtdGltZSBoaW50c1xuICByZWN0OiBSZWN0O1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIGluU2hhZG93RE9NPzogYm9vbGVhbjtcbiAgLy8gQ1NTIHNlbGVjdG9yIGZvciB0aGUgc2hhZG93IGhvc3Qgd2hlbiBgaW5TaGFkb3dET01gIGlzIHRydWUuIExldHMgYVxuICAvLyBjb25zdW1lciAob3IgdGhlIHBhbmVsJ3MgcmUtdmFsaWRhdGlvbiBwYXNzKSBmaW5kIHRoZSBob3N0IGVsZW1lbnRcbiAgLy8gc2luY2UgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyByb290cy5cbiAgc2hhZG93SG9zdD86IHN0cmluZztcbiAgY29tcG9uZW50Um9vdD86IHN0cmluZztcbiAgYW5jZXN0b3JzPzogQW5jZXN0b3JbXTtcbiAgY29tcG9uZW50PzogRnJhbWV3b3JrSW5mbztcbiAgLy8gUmVhY3QgZXZlbnQgaGFuZGxlciBuYW1lcyBwcm9iZWQgZnJvbSBgX19yZWFjdFByb3BzJDxrZXk+YCDigJQgYW5zd2Vyc1xuICAvLyBcIndoaWNoIGhhbmRsZXIgZmlyZXMgd2hlbiB0aGlzIGlzIGNsaWNrZWQ/XCIgd2l0aG91dCBhbiBMTE0gaGF2aW5nIHRvXG4gIC8vIGdyZXAgdGhlIGNvZGViYXNlLiBJbiBkZXYgYnVpbGRzIHRoZXNlIGFyZSByZWFsIGZ1bmN0aW9uIG5hbWVzOyBpblxuICAvLyBwcm9kIHRoZXkncmUgbWluaWZpZWQgYnV0IHN0aWxsIGFuY2hvci1hYmxlLlxuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBodG14IC8gU3RpbXVsdXMgLyBBbHBpbmUgLyBUdXJibyB3aXJpbmcgb24gdGhlIGVsZW1lbnQuIFNlcnZlci1cbiAgLy8gcmVuZGVyZWQgYXBwcyBkb24ndCBoYXZlIFJlYWN0IGZpYmVycyDigJQgZm9yIHRoZW0sIHRoaXMgSVMgdGhlXG4gIC8vIGNvbXBvbmVudCBzaGFwZS5cbiAgYmVoYXZpb3JBdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIFRydWUgd2hlbiBgZWwuZ2V0QW5pbWF0aW9ucygpYCByZXBvcnRlZCBhbiBhY3RpdmVseS1wbGF5aW5nXG4gIC8vIGFuaW1hdGlvbiBhdCBjYXB0dXJlIHRpbWUuIFRlbGxzIHRoZSBjb25zdW1lciB0aGF0IGNhcHR1cmVkIHJlY3QgL1xuICAvLyB0cmFuc2Zvcm0gLyBvcGFjaXR5IG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZS5cbiAgaXNBbmltYXRpbmc/OiBib29sZWFuO1xuICAvLyBGb3IgZWxlbWVudHMgcmVuZGVyZWQgaW50byBhIGA8Y2FudmFzPmAsIHRoZSBET00gZ2l2ZXMgdXMgZXNzZW50aWFsbHlcbiAgLy8gbm90aGluZyBhYm91dCB3aGF0IHdhcyBjbGlja2VkIOKAlCB0aGUgY2FudmFzIGhhcyBubyBjaGlsZHJlbiwgbm9cbiAgLy8gdGV4dCwgbm8gbWVhbmluZ2Z1bCBzZWxlY3RvcnMgYmVsb3cgdGhlIGNhbnZhcyBpdHNlbGYuIENhcHR1cmUgdGhlXG4gIC8vIGNsaWNrIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMncyBib3VuZGluZyBib3ggc28gYSBkb3duc3RyZWFtXG4gIC8vIGNvbnN1bWVyIGNhbiBjb3JyZWxhdGUgKGUuZy4gYWdhaW5zdCBhIERhdGFkb2cgLyBUYWJsZWF1IC8gY2hhcnRpbmdcbiAgLy8gbGlicmFyeSB0aGF0IGV4cG9zZXMgZGF0YS1wb2ludCBjb29yZGluYXRlcykuIENvb3JkaW5hdGVzIGFyZSBDU1NcbiAgLy8gcGl4ZWxzOyBtdWx0aXBseSBieSBgdmlld3BvcnQuZHByYCB0byBnZXQgZGV2aWNlIHBpeGVscy5cbiAgY2FudmFzQ2xpY2s/OiB7XG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIG9mZnNldFk6IG51bWJlcjtcbiAgICBjYW52YXNXOiBudW1iZXI7XG4gICAgY2FudmFzSDogbnVtYmVyO1xuICAgIGNhbnZhc1NlbGVjdG9yOiBzdHJpbmc7XG4gIH07XG4gIC8vIENvbnRlbnRlZGl0YWJsZSByaWNoLXRleHQgZWRpdG9yIGNvbnRleHQuIFBvcHVsYXRlZCB3aGVuIHRoZSBjYXB0dXJlZFxuICAvLyBub2RlIGlzLCBvciBsaXZlcyBpbnNpZGUsIGEgYFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1gIGFuY2VzdG9yLiBMZXRzXG4gIC8vIGFuIExMTSByZWFzb25pbmcgYWJvdXQgYSBcImNvcHkgaXMgd3JvbmdcIiAvIFwidGhlIGVkaXRvciBicmVha3Mgd2hlbiBYXCJcbiAgLy8gY2FwdHVyZSBrbm93IHdoaWNoIGVkaXRvciBsaWJyYXJ5IHRvIGxvb2sgYXQg4oCUIHNlbGVjdG9ycyBnZW5lcmF0ZWRcbiAgLy8gYnkgUHJvc2VNaXJyb3IgLyBMZXhpY2FsIC8gZXRjIGFyZSBydW50aW1lLWludGVybmFsIGFuZCB3b24ndCBncmVwXG4gIC8vIGFnYWluc3QgdXNlciBjb2RlLCBidXQgdGhlIExJQlJBUlkgcG9pbnRlciByb3V0ZXMgdGhlIExMTSB0byB0aGVcbiAgLy8gcmlnaHQgd3JhcHBlciBjb21wb25lbnQuXG4gIGVkaXRvcj86IHtcbiAgICBraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnO1xuICAgIHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbiAgfTtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBCRUZPUkUgdGhlIGNsaWNrLiBSZXBybyBjb250ZXh0IGZvciBidWdzIGxpa2VcbiAgLy8gXCJJIGNsaWNrZWQgdGhlIHdyb25nIGRyb3Bkb3duIG9wdGlvblwiIG9yIFwidGhlIHZhbHVlIGZsaWNrZXJlZCBiZWZvcmVcbiAgLy8gSSBjbGlja2VkIGl0XCIg4oCUIHdpdGhvdXQgdGhpcywgdGhlIEpTT04gc25hcHNob3RzIG9ubHkgdGhlIHBvc3QtXG4gIC8vIG11dGF0aW9uIHN0YXRlLCBsZWF2aW5nIHRoZSBMTE0gYmxpbmQgdG8gd2hhdCB0cmlnZ2VyZWQgdGhlXG4gIC8vIGFwcGVhcmFuY2UgdGhlIHVzZXIgY29tcGxhaW5lZCBhYm91dC4gUGluY2hncmFiIGtlZXBzIGFuIDgtc2Vjb25kXG4gIC8vIHJpbmcgYnVmZmVyIG9mIG11dGF0aW9uIHJlY29yZHM7IGNhcHR1cmUgYXR0YWNoZXMgdGhlIG1vc3QgcmVjZW50XG4gIC8vIDMgYXMgYSBzbmFwc2hvdC5cbiAgZG9tTXV0YXRpb25zPzogRG9tTXV0YXRpb25bXTtcbiAgc3RhdGVzPzogc3RyaW5nW107ICAgICAgLy8gYWN0aXZlIHBzZXVkby1jbGFzc2VzICh3YXMgUmVjb3JkPHN0cmluZywgdHJ1ZT4gaW4gdjEpXG4gIC8vIExvY2F0b3IgcXVhbGl0eTogaG93IG1hbnkgZWxlbWVudHMgYHNlbGVjdG9yYCByZXNvbHZlcyB0byBpbiBpdHNcbiAgLy8gc2NvcGUgKDEgPSB1bmlxdWUpLiBIaWdoZXIgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91cy5cbiAgc2VsZWN0b3JNYXRjaENvdW50PzogbnVtYmVyO1xuICAvLyBEaXNhbWJpZ3VhdGVkIG9yZGVyaW5nIGZpZWxkcy5cbiAgLy8gYG5gIGlzIHByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdCAoaXQncyB0aGUgY2FwdHVyZS1zZXF1ZW5jZVxuICAvLyBkaXNwbGF5IGxhYmVsIGluIHRoZSBzaWRlYmFyKS4gVGhlIG5ldyBmaWVsZHMgYXJlIGVtaXQtdGltZSBvbmx5OlxuICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHNhbWUgYXMgYG5gIChjYXB0dXJlIHNlcXVlbmNlIHdpdGhpbiBzZXNzaW9uKVxuICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgcmFuayB3aXRoaW4gdGhlIHBhZ2VcbiAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCBndWFyYW50ZWVkLXVuaXF1ZSBodW1hbiBsYWJlbDogbWlycm9ycyBgbmAgd2hlblxuICAvLyAgICAgdW5pcXVlLCBlbHNlIGBuLmtgICh0aGUgY2FwdHVyZSBjb3VudGVyIHJlc3RhcnRzIHBlciBzZXNzaW9uKVxuICBjYXB0dXJlSW5kZXg/OiBudW1iZXI7XG4gIGV2ZW50SW5kZXg/OiBudW1iZXI7XG4gIHZpc3VhbE9yZGVyPzogbnVtYmVyO1xuICBkaXNwbGF5TGFiZWw/OiBzdHJpbmc7XG4gIC8vIEdyb3VwIGZsYXR0ZW5pbmcgZmllbGRzLlxuICAvLyBUaGUgZ3JvdXAgaGVhZCBjYXJyaWVzIGBncm91cE1lbWJlclVpZHNgIChqdXN0IHRoZSBJRHMpOyBlYWNoXG4gIC8vIG1lbWJlciBlbWl0cyBhcyBpdHMgb3duIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nXG4gIC8vIGJhY2sgYXQgdGhlIGhlYWQuXG4gIGdyb3VwTWVtYmVyVWlkcz86IHN0cmluZ1tdO1xuICBncm91cFVpZD86IHN0cmluZztcbiAgLy8gTGlnaHR3ZWlnaHQgYTExeSBhdWRpdCBjYXB0dXJlZCBhdCBjbGljayB0aW1lLiBIZWF2aWVyIGNoZWNrc1xuICAvLyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90cywgYXhlIHZpb2xhdGlvbnMpIGFyZSBub3QgeWV0IHdpcmVkLlxuICBhMTF5Pzoge1xuICAgIGNvbnRyYXN0UmF0aW8/OiBudW1iZXI7XG4gICAgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7XG4gICAgdGFiYmFibGU/OiBib29sZWFuO1xuICAgIGZvY3VzVmlzaWJsZT86IGJvb2xlYW47XG4gIH07XG4gIC8vIFBhcmVudCBsYXlvdXQgY29udGV4dCDigJQgZmxleC9ncmlkL292ZXJmbG93L3Njcm9sbC9zdGFja2luZ1xuICAvLyBhbmNlc3RvcnMgdGhhdCBzaGFwZSB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGFwcGVhcmFuY2UuXG4gIGxheW91dENvbnRleHQ/OiBBcnJheTx7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgZGlzcGxheT86IHN0cmluZztcbiAgICBwb3NpdGlvbj86IHN0cmluZztcbiAgICBvdmVyZmxvdz86IHN0cmluZztcbiAgICB6SW5kZXg/OiBzdHJpbmc7XG4gICAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICAgIHdpbGxDaGFuZ2U/OiBzdHJpbmc7XG4gICAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICAgIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gICAgc2Nyb2xsVG9wPzogbnVtYmVyO1xuICAgIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICB9PjtcbiAgLy8gQXNzZXQgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIGNhcHR1cmVkIHN1YnRyZWUgKGltZyBzcmMsIDx1c2UgaHJlZj4sXG4gIC8vIGJhY2tncm91bmQtaW1hZ2UgdXJsKS4gV2hlbiBhIGNvbXBsYWludCBpcyBhYm91dCBhIGxvZ28gLyBpY29uIC9cbiAgLy8gYXJ0d29yaywgYW4gYWdlbnQgd2l0aG91dCB0aGVzZSByZWZlcmVuY2VzIHdvdWxkIGJlIGxlZnQgZ3Vlc3NpbmcuXG4gIGFzc2V0cz86IEFycmF5PHtcbiAgICBzcmM6IHN0cmluZztcbiAgICBuYXR1cmFsVz86IG51bWJlcjsgbmF0dXJhbEg/OiBudW1iZXI7XG4gICAgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7XG4gICAgYWx0Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gIH0+O1xuICBzdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtYXRjaGVkUnVsZXM/OiBNYXRjaGVkUnVsZVtdO1xuICBwc2V1ZG9FbGVtZW50cz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICAvLyBUcnVuY2F0aW9uIG1hcmtlcnMg4oCUIHByZXNlbnQgd2hlbiBjYXB0dXJlIGhhZCB0byBlbGlkZSBjb250ZW50LiBMZXRzXG4gIC8vIGEgY29uc3VtZXIgZGV0ZWN0IFwidGhpcyBlbnRyeSB3YXMgY3V0IGRvd25cIiBhbmQgcmVmZXRjaCBmcm9tIHRoZVxuICAvLyBsaXZlIHBhZ2UgaWYgaXQgbmVlZHMgdGhlIGZ1bGwgdmVyc2lvbi5cbiAgLy8gICBvdXRlckhUTUwg4oCUIG9yaWdpbmFsIGh0bWwgbGVuZ3RoIGJlZm9yZSB0aGUgc2l6ZS1jYXAga2lja2VkIGluLlxuICAvLyAgIGNoaWxkcmVuICDigJQgbnVtYmVyIG9mIGRlc2NlbmRhbnQgc3VidHJlZXMgcmVwbGFjZWQgYnkgZGVwdGgtY2FwXG4gIC8vICAgICAgICAgICAgICAgZWxpc2lvbiBtYXJrZXJzIChgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gKS5cbiAgdHJ1bmNhdGVkPzoge291dGVySFRNTD86IG51bWJlcjsgY2hpbGRyZW4/OiBudW1iZXI7IHRleHQ/OiBudW1iZXJ9O1xuICAvLyBHcm91cCBvZiBhZGRpdGlvbmFsIGNhcHR1cmVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudHJ5IChBbHQrU2hpZnQrQ2xpY2tcbiAgLy8gLyBBbHQrZHJhZyBzZWxlY3Rpb25zIGNvbGxhcHNlIGhlcmUpLlxuICBncm91cD86IEVudHJ5W107XG4gIC8vIE9wdGlvbmFsIHNjcmVlbnNob3QgYnVuZGxlOiBlYWNoIGZpZWxkIGlzIGEgcmVsYXRpdmUgcGF0aCB1bmRlciB0aGVcbiAgLy8gdXNlcidzIERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+LyByb290LiBUaGUgY2FwdHVyZWRBdCBzdGFtcCBpc1xuICAvLyB0aGUgSVNPIHRpbWVzdGFtcCB3aGVuIHRoZSBzaG90IHdhcyB0YWtlbi5cbiAgc2NyZWVuc2hvdD86IHtcbiAgICBlbGVtZW50Pzogc3RyaW5nO1xuICAgIGdyb3VwPzogc3RyaW5nO1xuICAgIHBhZ2U/OiBzdHJpbmc7XG4gICAgY2FwdHVyZWRBdD86IHN0cmluZztcbiAgICAvLyBBbiBlbXB0eSBgc2NyZWVuc2hvdGAgZmllbGQgY291bGQgbWVhbiBcIm5vdCB5ZXQgc2hvdFwiLCBcImZhaWxlZFwiLFxuICAgIC8vIG9yIFwic2tpcHBlZCBvbiBwdXJwb3NlXCIuIFdoZW4gdGhlIHBpcGVsaW5lIGRlY2xpbmVzIG9yIGZhaWxzLFxuICAgIC8vIHNldCB0aGlzIHNvIHJlY2VpdmVycyBrbm93IGl0J3Mgbm90IGEgcmV0cnkgY2FuZGlkYXRlLlxuICAgIHVuYXZhaWxhYmxlUmVhc29uPzogJ2F1dG9TY3JlZW5zaG90T2ZmJyB8ICdza2lwU2NyZWVuc2hvdEhvc3RzJyB8ICdjYXB0dXJlRmFpbGVkJyB8ICdwZXJtaXNzaW9uRGVuaWVkJyB8IHN0cmluZztcbiAgICAvLyBDcm9wIG1ldGFkYXRhIGRlc2NyaWJpbmcgd2hlcmUgdGhlIGNyb3BwZWQgUE5HIGZpdHMgaW4gdGhlXG4gICAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICBjcm9wPzoge1xuICAgICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZHByOiBudW1iZXI7XG4gICAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59O1xuXG4vLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIHBhZ2UgbWV0YWRhdGEsIGVtaXR0ZWQgb25jZSBwZXIgZGlzdGluY3QgcGFnZSBVUkxcbi8vIGludm9sdmVkIGluIGNhcHR1cmVzIChkZWR1cGVkIGJ5IFVSTCkuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTC5cbi8vIGBwYXJ0aWFsYCBpcyBzZXQgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCBjb3VsZCBiZSBjYXB0dXJlZCAoZnVsbC1wYWdlIHN0aXRjaFxuLy8gdW5hdmFpbGFibGUpIOKAlCBzZWUgYmFja2dyb3VuZC50cyBzdGl0Y2hQYWdlIGxpbWl0YXRpb25zLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90ID0geyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZzsgY2FwdHVyZWRBdDogc3RyaW5nOyB2aWV3cG9ydDoge3dpZHRoOiBudW1iZXI7aGVpZ2h0OiBudW1iZXJ9OyBzY3JvbGxXaWR0aDogbnVtYmVyOyBzY3JvbGxIZWlnaHQ6IG51bWJlcjsgZGV2aWNlUGl4ZWxSYXRpbzogbnVtYmVyOyBsYW5nOiBzdHJpbmc7IHNjcmVlbnNob3Q6IHN0cmluZzsgcGFydGlhbD86IGJvb2xlYW4gfTtcblxuZXhwb3J0IHR5cGUgRG9tTXV0YXRpb24gPSB7XG4gIHR5cGU6ICdjaGlsZExpc3QnIHwgJ2F0dHJpYnV0ZXMnIHwgJ2NoYXJhY3RlckRhdGEnO1xuICB0czogc3RyaW5nOyAgICAgICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBtdXRhdGlvbiBmaXJlZFxuICB0YXJnZXQ6IHN0cmluZzsgICAgICAgIC8vIGNvbXBhY3QgZGVzY3JpcHRvciBvZiB0aGUgbXV0YXRpb24ncyB0YXJnZXQgKGB0YWcjaWQuY2xzYClcbiAgYXR0cmlidXRlTmFtZT86IHN0cmluZztcbiAgb2xkVmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBuZXdWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIGFkZGVkPzogbnVtYmVyOyAgICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiBhZGRlZCBub2Rlc1xuICByZW1vdmVkPzogbnVtYmVyOyAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgcmVtb3ZlZCBub2Rlc1xuICBzdW1tYXJ5Pzogc3RyaW5nOyAgICAgIC8vIG9uZS1saW5lIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uXG59O1xuXG5leHBvcnQgdHlwZSBQYWdlQ29udGV4dCA9IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgdG9rZW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBCcm93c2VyICsgbG9jYWxlIGZpbmdlcnByaW50IGZvciBzZXNzaW9uLWxldmVsIGNvbnRleHQuIExldHMgYVxuICAvLyBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJyb3dzZXIgcHJvZHVjZWQgdGhpcyBjYXB0dXJlP1wiIG9yXG4gIC8vIFwid2FzIHRoZSBjYXB0dXJlZCBhcHAgcmVuZGVyZWQgaW4gYW4gUlRMIGxvY2FsZT9cIiB3aXRob3V0IHJlcnVubmluZy5cbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICAvLyBHaXQgYnVpbGQgaWRlbnRpdHksIHdoZW4gdGhlIGNhcHR1cmVkIGFwcCBleHBvc2VzXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW5cIj5gLlxuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFdoYXRldmVyIGVsZW1lbnQgaGFkIGZvY3VzIGF0IGNhcHR1cmUgdGltZSwgcGx1cyBhIGhpbnQgYXMgdG9cbiAgLy8gd2hldGhlciB0aGUgdXNlciBuYXZpZ2F0ZWQgdGhlcmUgd2l0aCB0aGUga2V5Ym9hcmQgKFRhYiAvIFNoaWZ0K1RhYlxuICAvLyBwcmVzc2VkIGluIHRoZSBsYXN0IHNlY29uZCkuIFVzZWZ1bCBmb3IgYWNjZXNzaWJpbGl0eS1idWcgY2FwdHVyZXM6XG4gIC8vIFwidGhpcyBlbGVtZW50IGxvb2tzIHdyb25nIG9ubHkgd2hlbiBrZXlib2FyZC1mb2N1c2VkXCIuXG4gIGFjdGl2ZUZvY3VzPzoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59O1xufTtcblxuLy8gLS0tLS0tLS0tLSBTaWRlLXBhbmVsIFwibWVzc2FnZXNcIiAoVUkgcm93cykgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBTZWxlY3Rvck1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdzZWxlY3Rvcic7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIGVudHJ5OiBFbnRyeTtcbiAgcGlubmVkPzogYm9vbGVhbjtcbiAgLy8gTGVnYWN5IGZpZWxkIGtlcHQgYXJvdW5kIGJlY2F1c2Ugb2xkIHdvcmtzcGFjZXMgbWF5IHN0aWxsIGhhdmUgaXQ7IHdlXG4gIC8vIHN0cmlwIGl0IG9uIGNhcHR1cmUsIGJ1dCBkb24ndCByZWplY3QgaXQgb24gaW1wb3J0LlxuICBkdXBlUGVuZGluZz86IHVua25vd247XG59O1xuXG5leHBvcnQgdHlwZSBGZWVkYmFja01lc3NhZ2UgPSB7XG4gIHR5cGU6ICdmZWVkYmFjayc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgLy8gT3B0aW9uYWwgZm9yZWlnbiBrZXkgaW50byBFbnRyeS51aWQuIEFkamFjZW5jeSB0byBhIHByZWNlZGluZyBzZWxlY3RvclxuICAvLyBpcyB0aGUgaGlzdG9yaWNhbCBsaW5rOyBwYXJlbnRJZCBtYWtlcyBpdCBleHBsaWNpdCBhbmQgc3Vydml2ZXNcbiAgLy8gcmUtb3JkZXJpbmcgLyBzcGxpdC1ncm91cCAvIGltcG9ydC1leHBvcnQgcm91bmQtdHJpcHMuXG4gIHBhcmVudFVpZD86IHN0cmluZztcbiAgLy8gVXNlciBleHBsaWNpdGx5IGRldGFjaGVkIHRoaXMgY29tbWVudCBmcm9tIGFueSBzZWxlY3Rvci4gV2l0aG91dCB0aGVcbiAgLy8gZmxhZywgYWRqYWNlbmN5IHRvIHRoZSBwcmVjZWRpbmcgc2VsZWN0b3Igd291bGQgc2lsZW50bHkgcmUtYWRvcHQgdGhlXG4gIC8vIGNvbW1lbnQgYXQgcmVuZGVyL2V4cG9ydCB0aW1lLlxuICBkZXRhY2hlZD86IGJvb2xlYW47XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIC8vIFBhZ2UgcmVwb3J0cyBpdHMgc3RpY2t5IHBpbmNoLW1vZGUgc3RhdGUgKGUuZy4gdGhlIHVzZXIgcHJlc3NlZCBFc2Mgb25cbiAgLy8gdGhlIHBhZ2UgdG8gZXhpdCkgc28gdGhlIHBhbmVsIHRvZ2dsZSBzdGF5cyBpbiBzeW5jLlxuICB8IHtraW5kOiAnc2VsZWN0LW1vZGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIC8vIFN0aWNreSBcInBpbmNoIG1vZGVcIjogd2hpbGUgb24sIHBsYWluIGhvdmVyL2NsaWNrIGNhcHR1cmVzIHdpdGhvdXQgdGhlXG4gIC8vIEFsdCBtb2RpZmllciwgYW5kIHRoZSBwYWdlIHNob3dzIGEgbW9kZSBpbmRpY2F0b3IuIEVzYyBleGl0cy5cbiAgfCB7a2luZDogJ3NlbGVjdC1tb2RlJzsgb246IGJvb2xlYW59XG4gIC8vIEV4cG9ydC10aW1lIHJlcXVlc3QgZm9yIHRoZSBmdWxsIHNlcmlhbGl6ZWQgcGFnZSAob3B0LWluIHByZWZcbiAgLy8gaW5jbHVkZVBhZ2VIVE1MKS4gUmVwbGllZCB3aXRoIHtvaywgdXJsLCB0aXRsZSwgaHRtbH07IG5ldmVyIHBlcnNpc3RlZFxuICAvLyB0byBjaHJvbWUuc3RvcmFnZSDigJQgdGhlIHBheWxvYWQgZ29lcyBzdHJhaWdodCBpbnRvIHRoZSB0YXIuXG4gIHwge2tpbmQ6ICdwYWdlLWh0bWwnfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gRnVsbC1wYWdlIChiZXN0LWVmZm9ydCkgc2NyZWVuc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gVW5saWtlXG4gIC8vIHNob3QtcGFnZSB0aGlzIGRvZXMgTk9UIHdyaXRlIGEgZmlsZSBvciBidWlsZCBhIHRodW1ibmFpbCDigJQgaXQganVzdFxuICAvLyByZXR1cm5zIHRoZSBzdGl0Y2hlZCBQTkcgYXMgYSBkYXRhIFVSTCBzbyB0aGUgY2FsbGVyIChjb250ZW50IHNjcmlwdCkgY2FuXG4gIC8vIGF0dGFjaCBpdCB0byBhIFBhZ2VTbmFwc2hvdC4gYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydFxuICAvLyBjb3VsZCBiZSBjYXB0dXJlZC5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gKHJlKWluamVjdCB0aGUgY29udGVudCBzY3JpcHQg4oCUIHRoZSBmaXhcbiAgLy8gZm9yIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIGNvbnRlbnQgc2NyaXB0LiBEZWZhdWx0cyB0byB0aGUgYWN0aXZlIHRhYi5cbiAgfCB7a2luZDogJ3BnLXJlaW5qZWN0JzsgdGFiSWQ/OiBudW1iZXJ9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuLy8gUmVwbHkgdG8gYSBgcGFnZS1zbmFwc2hvdC1zaG90YCByZXF1ZXN0LiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwgb2Zcbi8vIHRoZSAoYmVzdC1lZmZvcnQpIGZ1bGwgcGFnZTsgYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCB3YXNcbi8vIGNhcHR1cmVkLiBgb2s6ZmFsc2VgIGNhcnJpZXMgYW4gZXJyb3Igc3RyaW5nLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBzY3JlZW5zaG90Pzogc3RyaW5nO1xuICBwYXJ0aWFsPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBTYXZlUmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGhcbiAgYWJzUGF0aD86IHN0cmluZzsgIC8vIE9TLWFic29sdXRlIHBhdGhcbiAgY29weVBhdGg/OiBzdHJpbmc7IC8vIFVJLWZhY2luZyBwYXRoXG4gIHRlbXBQYXRoPzogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBCZ1JlcGx5ID1cbiAgfCB7ZGF0YVVybDogc3RyaW5nfVxuICB8IHtmb3VuZDogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyfVxuICB8IHt0YWJzOiBBcnJheTx7aWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9Pn1cbiAgfCB7ZXJyb3I6IHN0cmluZ31cbiAgfCBTaG90UmVwbHlcbiAgfCBTYXZlUmVwbHlcbiAgfCBQYWdlU25hcHNob3RSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5OiBmaXJzdCAxNiBoZXggY2hhcnMgb2YgYSBTSEEtMjU2IG92ZXIgdGhlXG4gIC8vIHNsaW0gcm93cyArIHNjcmVlbnNob3QgbmFtZXMuIFN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cyBvZiB0aGUgc2FtZVxuICAvLyBjb250ZW50LCBzbyBkb3duc3RyZWFtIHN0YXRlIChlLmcuIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyovYnVuZGxlcy8pXG4gIC8vIGtleXMgb24gaXQgd2l0aG91dCBkdXBsaWNhdGluZyB3b3JrLlxuICBidW5kbGVJZD86IHN0cmluZztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aXRoIG5vIHBhcmVudFVpZCBhdCBhbGwg4oCUIGludGVudGlvbmFsbHkgcGFnZS1sZXZlbFxuICAgIC8vIGNvbW1lbnRzLCBub3QgcGlubmVkIHRvIGFuIGVsZW1lbnQuIERpc3RpbmN0IGZyb20gb3JwaGFuZWRGZWVkYmFja1xuICAgIC8vIChhIGRhbmdsaW5nIHBhcmVudFVpZCkuIFNvOiBmZWVkYmFjayA9IHBpbm5lZCArIHBhZ2VMZXZlbCArIG9ycGhhbmVkLlxuICAgIHBhZ2VMZXZlbEZlZWRiYWNrPzogbnVtYmVyO1xuICAgIC8vIEZ1bGwtcGFnZSBIVE1MIGRvY3VtZW50cyBidW5kbGVkIHVuZGVyIHBhZ2VzLyAob3B0LWluIHByZWYpLlxuICAgIHBhZ2VzSHRtbD86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gV2hlcmUgdGhlIGFnZW50IGRvY3RyaW5lIGxpdmVzIGluc2lkZSB0aGUgYXJjaGl2ZSAoU2VuZC10by1BZ2VudFxuICAvLyBwcm90b2NvbCkuIEFic2VudCBvbiBwbGFpbiBKU09OTCBleHBvcnRzLlxuICBhZ2VudFByb3RvY29sPzoge2FyY2hpdmVQYXRoOiBzdHJpbmd9O1xuICAvLyBCdW5kbGUgdG9rZW4gYnVkZ2V0OiBgc2lnbmFsKmAgaXMgdGhlIHVwLWZyb250IHJlYWQgKEFHRU5ULVBST1RPQ09MLFxuICAvLyBSRUFETUUsIHJlcGFpci1pbmRleCwgdGhlIEpTT05MLCBERVNJR04sIHRoZSB0d28gU0tJTExzLCBza2lsbHMtaW5kZXgpO1xuICAvLyBgdG90YWwqYCBpcyB0aGUgd2hvbGUgYXJjaGl2ZS4gVGhlIGxhenkgcmVtYWluZGVyIGlzIGVudW1lcmF0ZWQgaW4gdGhlXG4gIC8vIGJ1bmRsZSBmaWxlIG5hbWVkIGJ5IGBpZ25vcmVgLiBFc3RpbWF0b3IgaGV1cmlzdGljOiBieXRlcyAvIDQuXG4gIHRva2Vucz86IHtzaWduYWxCeXRlczogbnVtYmVyOyB0b3RhbEJ5dGVzOiBudW1iZXI7IHNpZ25hbFRva2VuczogbnVtYmVyOyB0b3RhbFRva2VuczogbnVtYmVyOyBpZ25vcmU6IHN0cmluZ307XG4gIC8vIFZlbmRvcmVkIHNraWxsIGRvY3VtZW50cyBidW5kbGVkIGludG8gdGhpcyBhcmNoaXZlIChzdWJzZXQgb2YgdGhlXG4gIC8vIHJpY2hlciBza2lsbHMtaW5kZXguanNvbiBhdCB0aGUgYXJjaGl2ZSByb290KS4gYGludm9jYXRpb25gIGNhcnJpZXMgYVxuICAvLyBwbHVnaW4tY29tbWFuZCBmb3JtIGZvciBoYXJuZXNzZXMgdGhhdCBzdXBwb3J0IGl0LlxuICBidW5kbGVkU2tpbGxzPzogQXJyYXk8e2lkOiBzdHJpbmc7IGtpbmQ6ICdza2lsbCcgfCAncmVmZXJlbmNlJzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgaW52b2NhdGlvbj86IHN0cmluZ30+O1xuICAvLyBGdWxsLXBhZ2UgSFRNTCBkb2N1bWVudHMgYnVuZGxlZCB1bmRlciBwYWdlcy8gKG9wdC1pbiBwcmVmKS5cbiAgcGFnZXNIdG1sPzogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47XG4gIC8vIFBJSSByZWRhY3Rpb24gcmVjZWlwdCAob3B0LWluKS4gYHZhbHVlc2AgY291bnRzIGNhcHR1cmVkIHN0cmluZ3MgdGhlXG4gIC8vIHRleHQgbGF5ZXIgc2NydWJiZWQ7IGBsYXllcmAgbmFtZXMgd2hpY2ggbGF5ZXIgcmFuLlxuICByZWRhY3Rpb24/OiB7bGF5ZXI6ICd0ZXh0JzsgdmFsdWVzOiBudW1iZXJ9O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBQaW5jaEdyYWIg4oCUIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIgKE1WMylcbi8vXG4vLyDigKIgT3BlbiB0aGUgc2lkZSBwYW5lbCBvbiBhY3Rpb24gY2xpY2tcbi8vIOKAoiBJbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gYWxyZWFkeS1vcGVuIHRhYnMgKG5vIHJlZnJlc2ggbmVlZGVkKVxuLy8g4oCiIFJpZ2h0LWNsaWNrIFwiUGluY2hHcmFiIGNhcHR1cmVcIiBjb250ZXh0IG1lbnVcbi8vIOKAoiBDYXB0dXJlIHZpc2libGUtdGFiIHNjcmVlbnNob3RzIG9uIHNpZGUtcGFuZWwgcmVxdWVzdFxuLy8g4oCiIEF1dG8tb3BlbiB0aGUgc2lkZSBwYW5lbCBvbiBmaXJzdCBjYXB0dXJlICh1c2VzIENocm9tZSAxMTYrIHVzZXItZ2VzdHVyZVxuLy8gICBwcm9wYWdhdGlvbiB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKVxuLy8g4oCiIFJlbGF5IGNvbnRlbnQtc2NyaXB0IG1lc3NhZ2VzIHRvIHNpZGUtcGFuZWwgcG9ydHNcbi8vIOKAoiBTY3JlZW5zaG90IHdvcmtlcjogc2hvdC1lbGVtZW50IC8gc2hvdC1ncm91cCAvIHNob3QtcGFnZSBraW5kcy4gRWFjaFxuLy8gICBjYXB0dXJlcyB2aWEgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIsIG9wdGlvbmFsbHkgY3JvcHMvc3RpdGNoZXNcbi8vICAgaW4gYW4gT2Zmc2NyZWVuQ2FudmFzLCBhbmQgd3JpdGVzIHRoZSBQTkcgaW50byB0aGUgdXNlcidzIERvd25sb2Fkc1xuLy8gICB1bmRlciAucGluY2hncmFiLzx3b3Jrc3BhY2U+L3NjcmVlbnNob3RzLy5cblxuaW1wb3J0IHR5cGUge0FueU1lc3NhZ2UsIFBnRW52ZWxvcGUsIFNob3RSZXBseX0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge3BnfSBmcm9tICcuL3R5cGVzLnRzJztcblxuY29uc3QgTE9HID0gJ1tQaW5jaEdyYWIvYmddJztcblxuLy8gVG9vbGJhciBpY29uOiB0aGUgbWFuaWZlc3QncyBjb21taXR0ZWQgUE5HIGljb25zIChzcmMvaWNvbnMvaWNvbioucG5nKSBBUkVcbi8vIHRoZSBjYW5vbmljYWwgU2Vnb2UgcGluY2gsIHNvIHdlIG5vIGxvbmdlciBkcmF3IHRoZSBlbW9qaSBpbnRvIEltYWdlRGF0YSBhdFxuLy8gc3RhcnR1cC4gVGhlIG9sZCBjYW52YXMgcmVuZGVyIHBpY2tlZCB3aGF0ZXZlciBlbW9qaSBmb250IHRoZSBPUyBoYWQsIHdoaWNoXG4vLyBkaXNhZ3JlZWQgd2l0aCB0aGUgY29tbWl0dGVkIGJyYW5kIG1hcmsgb24gbm9uLVdpbmRvd3Mgc3lzdGVtcyDigJQgZHJvcHBpbmcgaXRcbi8vIG1ha2VzIHRoZSB0b29sYmFyIGljb24gbWF0Y2ggdGhlIHBhbmVsICsgd29yZG1hcmsgZXZlcnl3aGVyZS5cblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICB0cnkgeyBjaHJvbWUuY29udGV4dE1lbnVzLmNyZWF0ZSh7aWQ6ICdwZy1jYXB0dXJlJywgdGl0bGU6ICdQaW5jaEdyYWIg4oCUIGNhcHR1cmUgdGhpcyBlbGVtZW50JywgY29udGV4dHM6IFsnYWxsJ119KTsgfVxuICBjYXRjaCB7IC8qIG1heSBhbHJlYWR5IGV4aXN0ICovIH1cbn0pO1xuXG4vLyBFbnN1cmUgdGhlIHRvb2xiYXIgY2xpY2sgZmlyZXMgT1VSIGFjdGlvbi5vbkNsaWNrZWQgKG5vdCBDaHJvbWUncyBwYW5lbFxuLy8gYXV0by1vcGVuKSBvbiBFVkVSWSBzZXJ2aWNlLXdvcmtlciBzdGFydCDigJQgb25JbnN0YWxsZWQgYWxvbmUgaXMgdW5yZWxpYWJsZVxuLy8gYWNyb3NzIHJlbG9hZHMsIGFuZCBhIHN0YWxlIG9wZW5QYW5lbE9uQWN0aW9uQ2xpY2s6dHJ1ZSBzaWxlbnRseSBzd2FsbG93cyB0aGVcbi8vIGNsaWNrIHNvIHRoZSBjb250ZW50IHNjcmlwdCBuZXZlciBpbmplY3RzIChBbHQrQ2xpY2sgY2FwdHVyZSBnb2VzIGRlYWQpLlxuLy8gSWRlbXBvdGVudCBhbmQgY2hlYXAuICgjMTgpXG52b2lkIGNocm9tZS5zaWRlUGFuZWwuc2V0UGFuZWxCZWhhdmlvcih7b3BlblBhbmVsT25BY3Rpb25DbGljazogZmFsc2V9KVxuICAuY2F0Y2goKGUpID0+IGNvbnNvbGUud2FybihMT0csICdzZXRQYW5lbEJlaGF2aW9yIChzdGFydHVwKScsIGUpKTtcblxuLy8g4pSA4pSA4pSAIEFjdGl2YXRpb24gKCMxOCk6IHRvb2xiYXIgY2xpY2sgYXR0YWNoZXMgUGluY2hHcmFiIHRvIFRISVMgdGFiIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUGluY2hHcmFiIG5vIGxvbmdlciBhdXRvLWluamVjdHMgaW50byBldmVyeSBwYWdlIOKAlCB0aGUgPGFsbF91cmxzPlxuLy8gY29udGVudF9zY3JpcHRzIGVudHJ5IGFuZCBob3N0X3Blcm1pc3Npb25zIGFyZSBnb25lLiBDbGlja2luZyB0aGUgdG9vbGJhclxuLy8gYWN0aW9uIGdyYW50cyBhY3RpdmVUYWIgZm9yIHRoZSBjbGlja2VkIHRhYjsgd2UgaW5qZWN0IHRoZSBjYXB0dXJlIHNjcmlwdFxuLy8gdGhlcmUgYW5kIG9wZW4gdGhlIHNpZGUgcGFuZWwuIEVhY2ggYWN0aXZhdGVkIHRhYiBiZWNvbWVzIGl0cyBvd24gd29ya3NwYWNlLFxuLy8gdHJhY2tlZCBwYW5lbC1zaWRlIHZpYSB0aGUgcGctdGFiLWFjdGl2YXRlZCBtZXNzYWdlIGJlbG93LlxuLy8g4pSA4pSA4pSAIEFjdGl2YXRlZC10YWIgdHJhY2tpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBUYWJzIFBpbmNoR3JhYiBpcyBhdHRhY2hlZCB0byAodG9vbGJhciBjbGljayBvciBwYW5lbCByZS1hdHRhY2gpLiBTZXNzaW9uXG4vLyBzdG9yYWdlIHN1cnZpdmVzIHNlcnZpY2Utd29ya2VyIHJlc3RhcnRzIGFuZCBjbGVhcnMgb24gYnJvd3NlciBleGl0IOKAlCB0aGVcbi8vIHNhbWUgbGlmZXRpbWUgYXMgdGhlIGFjdGl2ZVRhYiBncmFudCBjaGFpbiB0aGUgcmUtaW5qZWN0IHBhdGggcmVsaWVzIG9uLlxuY29uc3QgQUNUSVZFX1RBQlNfS0VZID0gJ3BnLmFjdGl2ZVRhYnMnO1xuY29uc3QgcmVhZEFjdGl2ZVRhYnMgPSBhc3luYyAoKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCBib29sZWFuPj4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG8gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLmdldChBQ1RJVkVfVEFCU19LRVkpO1xuICAgIHJldHVybiAob1tBQ1RJVkVfVEFCU19LRVldIGFzIFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+IHwgdW5kZWZpbmVkKSA/PyB7fTtcbiAgfSBjYXRjaCB7IHJldHVybiB7fTsgfVxufTtcbmNvbnN0IHRyYWNrQWN0aXZlVGFiID0gYXN5bmMgKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgY3VyID0gYXdhaXQgcmVhZEFjdGl2ZVRhYnMoKTtcbiAgY3VyW1N0cmluZyh0YWJJZCldID0gdHJ1ZTtcbiAgdHJ5IHsgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5zZXQoe1tBQ1RJVkVfVEFCU19LRVldOiBjdXJ9KTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG59O1xuY29uc3QgdW50cmFja0FjdGl2ZVRhYiA9IGFzeW5jICh0YWJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IGN1ciA9IGF3YWl0IHJlYWRBY3RpdmVUYWJzKCk7XG4gIGlmICghKFN0cmluZyh0YWJJZCkgaW4gY3VyKSkgcmV0dXJuO1xuICBkZWxldGUgY3VyW1N0cmluZyh0YWJJZCldO1xuICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLnNldCh7W0FDVElWRV9UQUJTX0tFWV06IGN1cn0pOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbn07XG5cbmNocm9tZS50YWJzLm9uUmVtb3ZlZC5hZGRMaXN0ZW5lcigodGFiSWQpID0+IHZvaWQgdW50cmFja0FjdGl2ZVRhYih0YWJJZCkpO1xuXG4vLyBSZS1pbmplY3QgYWZ0ZXIgYSByZWZyZXNoIC8gc2FtZS10YWIgbmF2aWdhdGlvbiBvZiBhbiBhdHRhY2hlZCB0YWIsIHNvXG4vLyBBbHQrQ2xpY2sgc3Vydml2ZXMgcmVsb2FkcyB3aXRob3V0IGFub3RoZXIgdG9vbGJhciBjbGljay4gVGhlIGFjdGl2ZVRhYlxuLy8gZ3JhbnQgcGVyc2lzdHMgYWNyb3NzIHJlbG9hZHMgb2YgdGhlIGdyYW50ZWQgdGFiOyB3aGVuIENocm9tZSByZXZva2VzIGl0XG4vLyAoZS5nLiBjcm9zcy1vcmlnaW4gbmF2aWdhdGlvbikgZXhlY3V0ZVNjcmlwdCByZWplY3RzIGFuZCB3ZSB1bnRyYWNrIOKAlFxuLy8gdGhlIHBhbmVsJ3MgcmUtYXR0YWNoIGFmZm9yZGFuY2UgY292ZXJzIHRoYXQgY2FzZS5cbmNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIGluZm8sIHRhYikgPT4ge1xuICBpZiAoaW5mby5zdGF0dXMgIT09ICdjb21wbGV0ZScpIHJldHVybjtcbiAgaWYgKCF0YWIudXJsIHx8ICEvXmh0dHBzPzovLnRlc3QodGFiLnVybCkpIHJldHVybjtcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRyYWNrZWQgPSBhd2FpdCByZWFkQWN0aXZlVGFicygpO1xuICAgIGlmICghdHJhY2tlZFtTdHJpbmcodGFiSWQpXSkgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe3RhcmdldDoge3RhYklkLCBhbGxGcmFtZXM6IGZhbHNlfSwgZmlsZXM6IFsnY29udGVudC1zY3JpcHQuanMnXSwgaW5qZWN0SW1tZWRpYXRlbHk6IHRydWV9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3JlaW5qZWN0ZWQgYWZ0ZXIgbmF2aWdhdGlvbicsIHRhYklkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAncmVpbmplY3QgYWZ0ZXIgbmF2aWdhdGlvbiBmYWlsZWQgKGdyYW50IHJldm9rZWQ/KScsIHRhYklkLCBlKTtcbiAgICAgIGF3YWl0IHVudHJhY2tBY3RpdmVUYWIodGFiSWQpO1xuICAgIH1cbiAgfSkoKTtcbn0pO1xuXG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XG4gIGlmICghdGFiPy5pZCkgcmV0dXJuO1xuICBjb25zdCB0YWJJZCA9IHRhYi5pZDtcbiAgY29uc29sZS5sb2coTE9HLCAnYWN0aW9uIGNsaWNrIOKGkiBhY3RpdmF0ZSB0YWInLCB0YWJJZCwgdGFiLnVybCA/PyAnKG5vIHVybCknKTtcbiAgLy8gSW5qZWN0IHRoZSBjYXB0dXJlIHNjcmlwdCBGSVJTVCwgd2hpbGUgdGhlIGNsaWNrJ3MgYWN0aXZlVGFiIGdyYW50IGlzXG4gIC8vIGZyZXNoZXN0OyBhdHRlbXB0IG9uIGh0dHAocykgcGFnZXMgKGFuZCB3aGVuIHRoZSBVUkwgaXMgdW5rbm93biksIGFuZCBza2lwXG4gIC8vIHJlc3RyaWN0ZWQgc2NoZW1lcyB3aGVyZSBpbmplY3Rpb24gd291bGQgb25seSBlcnJvci5cbiAgaWYgKCF0YWIudXJsIHx8IC9eaHR0cHM/Oi8udGVzdCh0YWIudXJsKSkge1xuICAgIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHt0YWJJZCwgYWxsRnJhbWVzOiBmYWxzZX0sXG4gICAgICBmaWxlczogWydjb250ZW50LXNjcmlwdC5qcyddLFxuICAgICAgaW5qZWN0SW1tZWRpYXRlbHk6IHRydWUsXG4gICAgfSkuY2F0Y2goKGUpID0+IGNvbnNvbGUud2FybihMT0csICdhY3RpdmF0ZSBpbmplY3QgRkFJTEVEJywgZSkpO1xuICAgIHZvaWQgdHJhY2tBY3RpdmVUYWIodGFiSWQpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2FybihMT0csICdhY3RpdmF0ZTogY2Fubm90IGluamVjdCBpbnRvJywgdGFiLnVybCk7XG4gIH1cbiAgLy8gVGhlbiBvcGVuIHRoZSBzaWRlIHBhbmVsIChhbHNvIGEgdXNlci1nZXN0dXJlIGNhbGwpLlxuICBjaHJvbWUuc2lkZVBhbmVsLm9wZW4oe3RhYklkfSkuY2F0Y2goKGUpID0+IGNvbnNvbGUud2FybihMT0csICdzaWRlUGFuZWwub3BlbicsIGUpKTtcbiAgLy8gQmluZCB0aGlzIHRhYiB0byBhIHdvcmtzcGFjZSBwYW5lbC1zaWRlLiBUaGUgcGFuZWwgbWF5IGhhdmUganVzdCBvcGVuZWQgYW5kXG4gIC8vIG5vdCBiZSBsaXN0ZW5pbmcgeWV0LCBzbyByZXBsYXkgYSBmZXcgdGltZXM7IHRoZSBwYW5lbCBkZWR1cHMgYnkgdGFiSWQuXG4gIGNvbnN0IG1ldGEgPSB7X19wZzogdHJ1ZSwga2luZDogJ3BnLXRhYi1hY3RpdmF0ZWQnLCB0YWJJZCwgdXJsOiB0YWIudXJsID8/ICcnLCB0aXRsZTogdGFiLnRpdGxlID8/ICcnfTtcbiAgY29uc3QgYW5ub3VuY2UgPSAoKTogdm9pZCA9PiB7IHRyeSB7IHZvaWQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWV0YSkuY2F0Y2g/LigoKSA9PiB7IC8qIG5vdCB1cCB5ZXQgKi8gfSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfSB9O1xuICBhbm5vdW5jZSgpO1xuICBzZXRUaW1lb3V0KGFubm91bmNlLCAxNTApO1xuICBzZXRUaW1lb3V0KGFubm91bmNlLCA1MDApO1xufSk7XG5cbmNocm9tZS5jb250ZXh0TWVudXM/Lm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigoaW5mbywgdGFiKSA9PiB7XG4gIGlmIChpbmZvLm1lbnVJdGVtSWQgIT09ICdwZy1jYXB0dXJlJyB8fCAhdGFiPy5pZCkgcmV0dXJuO1xuICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHtfX3BnOiB0cnVlLCBraW5kOiAnY29udGV4dC1jYXB0dXJlJ30pLmNhdGNoKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xufSk7XG5cbi8vIOKUgOKUgOKUgCBTY3JlZW5zaG90IGhlbHBlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEZpbGVuYW1lIHRpbWVzdGFtcCBpcyBlcG9jaCBtaWxsaXNlY29uZHMuIFNvcnRpbmcgYnkgbmFtZSA9IHNvcnRpbmcgYnlcbi8vIHRpbWUgd2l0aGluIGEgaG9zdCBidWNrZXQuIFdlIGFjY2VwdCBhbiBvcHRpb25hbCBJU08gc3RyaW5nIGZvciB0ZXN0cyBidXRcbi8vIG5vcm1hbGl6ZSB0byBlcG9jaCBtcyBzbyB0aGUgb3V0cHV0IGlzIHVuaWZvcm0uXG5leHBvcnQgY29uc3QgdHNGb3JGaWxlbmFtZSA9IChpc28/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBpZiAoIWlzbykgcmV0dXJuIFN0cmluZyhEYXRlLm5vdygpKTtcbiAgY29uc3QgdCA9IERhdGUucGFyc2UoaXNvKTtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSh0KSA/IFN0cmluZyh0KSA6IFN0cmluZyhEYXRlLm5vdygpKTtcbn07XG5cbi8vIGhvc3Qtc2x1ZzogcmVwbGFjZSBgLmAgd2l0aCBgX2AgKHBlciBwcm9qZWN0IGNvbnZlbnRpb24gc28gZmlsZW5hbWVzIGFyZVxuLy8gc2hlbGwtZnJpZW5kbHkgYW5kIGRvbid0IGxvb2sgbGlrZSBtdWx0aS1leHRlbnNpb24gcGF0aHMgbGlrZSBgYXBwLnBpbmNoXG4vLyBncmFiLmNvbS0uLi5gKSwgc3RyaXAgYW55IG90aGVyIG5vbi13b3JkL2h5cGhlbiBjaGFyYWN0ZXJzLCBjYXAgYXQgNDBcbi8vIGNoYXJzLiBgbG9jYWxob3N0OjMwMDBgIOKGkiBgbG9jYWxob3N0XzMwMDBgLlxuZXhwb3J0IGNvbnN0IGhvc3RTbHVnID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgbGV0IGhvc3Q6IHN0cmluZztcbiAgdHJ5IHsgaG9zdCA9IG5ldyBVUkwodXJsKS5ob3N0OyB9IGNhdGNoIHsgaG9zdCA9ICd1bmtub3duJzsgfVxuICByZXR1cm4gaG9zdC5yZXBsYWNlKC9cXC4vZywgJ18nKS5yZXBsYWNlKC9bXlxcdy1dL2csICdfJykuc2xpY2UoMCwgNDApIHx8ICd1bmtub3duJztcbn07XG5cbi8vIEZpbGVuYW1lIGxheW91dDogYDxob3N0X3VuZGVyc2NvcmVkPi1uPE4+LTxraW5kPlstPGV4dHJhPl0tPGVwb2NoPi5wbmdgLlxuLy8gSG9zdCBmaXJzdCBtZWFucyBzY3JlZW5zaG90cyBpbiBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d3M+L3NjcmVlbnNob3RzL1xuLy8gZ3JvdXAgbmF0dXJhbGx5IHBlciBzaXRlOyBlcG9jaCBhcyBhIHRhaWwga2V5IGdpdmVzIGNocm9ub2xvZ2ljYWwgb3JkZXJcbi8vIGluc2lkZSBlYWNoIGJ1Y2tldC5cbmV4cG9ydCBjb25zdCBidWlsZEZpbGVuYW1lID0gKFxuICBraW5kOiAnZWxlbWVudCcgfCAnZ3JvdXAnIHwgJ3BhZ2UnLFxuICB0czogc3RyaW5nLFxuICBuOiBudW1iZXIsXG4gIHVybDogc3RyaW5nLFxuICBvcHRzOiB7Y291bnQ/OiBudW1iZXI7IHRydW5jYXRlZD86IGJvb2xlYW59ID0ge30sXG4pOiBzdHJpbmcgPT4ge1xuICBjb25zdCBzdGFtcCA9IHRzRm9yRmlsZW5hbWUodHMpO1xuICBjb25zdCBzbHVnID0gaG9zdFNsdWcodXJsKTtcbiAgaWYgKGtpbmQgPT09ICdlbGVtZW50JykgcmV0dXJuIGAke3NsdWd9LW4ke259LWVsZW1lbnQtJHtzdGFtcH0ucG5nYDtcbiAgaWYgKGtpbmQgPT09ICdncm91cCcpIHJldHVybiBgJHtzbHVnfS1uJHtufS1ncm91cCR7b3B0cy5jb3VudCA/PyAwfS0ke3N0YW1wfS5wbmdgO1xuICAvLyBwYWdlXG4gIGNvbnN0IHN1ZmZpeCA9IG9wdHMudHJ1bmNhdGVkID8gJ3BhZ2UtdHJ1bmMnIDogJ3BhZ2UnO1xuICByZXR1cm4gYCR7c2x1Z30tbiR7bn0tJHtzdWZmaXh9LSR7c3RhbXB9LnBuZ2A7XG59O1xuXG4vLyBkYXRhVVJMIOKGkiBCbG9iIHdpdGhvdXQgZ29pbmcgdGhyb3VnaCBmZXRjaC9hdG9iIHJvdW5kdHJpcHMgdGhhdCBicm93c2Vyc1xuLy8gaW4gc2VydmljZS13b3JrZXIgY29udGV4dCBzb21ldGltZXMgYmFsayBhdC4gUE5HIG9ubHkuXG5jb25zdCBkYXRhVXJsVG9CbG9iID0gYXN5bmMgKGRhdGFVcmw6IHN0cmluZyk6IFByb21pc2U8QmxvYj4gPT4ge1xuICBjb25zdCByID0gYXdhaXQgZmV0Y2goZGF0YVVybCk7XG4gIHJldHVybiByLmJsb2IoKTtcbn07XG5cbi8vIERlY29kZSBhIFBORyBkYXRhVVJMIGludG8gYW4gSW1hZ2VCaXRtYXAgdXNhYmxlIGJ5IE9mZnNjcmVlbkNhbnZhcy4gV2Vcbi8vIGNhbid0IGBuZXcgSW1hZ2UoKWAgaW4gYSBzZXJ2aWNlIHdvcmtlciDigJQgSW1hZ2UgaXMgYSBET00tb25seSBjb25zdHJ1Y3Rvci5cbmNvbnN0IGRhdGFVcmxUb0JpdG1hcCA9IGFzeW5jIChkYXRhVXJsOiBzdHJpbmcpOiBQcm9taXNlPEltYWdlQml0bWFwPiA9PiB7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBkYXRhVXJsVG9CbG9iKGRhdGFVcmwpO1xuICByZXR1cm4gY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XG59O1xuXG4vLyBFbmNvZGUgYW4gT2Zmc2NyZWVuQ2FudmFzIHRvIGEgUE5HIGJsb2IuXG5jb25zdCBjYW52YXNUb0Jsb2IgPSBhc3luYyAoY2FudmFzOiBPZmZzY3JlZW5DYW52YXMpOiBQcm9taXNlPEJsb2I+ID0+XG4gIGNhbnZhcy5jb252ZXJ0VG9CbG9iKHt0eXBlOiAnaW1hZ2UvcG5nJ30pO1xuXG4vLyBEb3duc2NhbGUgYSBiaXRtYXAgaW50byBhIFBORyBkYXRhVVJMIHdpdGggbWF4IHdpZHRoIGNhcHBlZC4gVGhlIHRodW1ibmFpbFxuLy8gaXMgd2hhdCB0aGUgc2lkZSBwYW5lbCBwYWludHMgaW50byB0aGUgLnByZXZpZXcgdGlsZSDigJQgdGhlIG9yaWdpbmFsIGxpdmVzXG4vLyBvbmx5IG9uIGRpc2suIFdlIHVzZSBGaWxlUmVhZGVyICh3b3JrcyBpbiBNVjMgU1dzKSBzaW5jZSB0aGUgZGF0YVVSTCBpc1xuLy8gcGFzc2VkIGJhY2sgdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSB3aGVyZSBzaXplIG1hdHRlcnMgbGVzcy5cbmNvbnN0IG1ha2VUaHVtYm5haWwgPSBhc3luYyAoYml0bWFwOiBJbWFnZUJpdG1hcCwgbWF4V2lkdGggPSAzMjApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICBjb25zdCByYXRpbyA9IGJpdG1hcC53aWR0aCA8PSBtYXhXaWR0aCA/IDEgOiBtYXhXaWR0aCAvIGJpdG1hcC53aWR0aDtcbiAgY29uc3QgdyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoYml0bWFwLndpZHRoICogcmF0aW8pKTtcbiAgY29uc3QgaCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoYml0bWFwLmhlaWdodCAqIHJhdGlvKSk7XG4gIGNvbnN0IGNhbnZhcyA9IG5ldyBPZmZzY3JlZW5DYW52YXModywgaCk7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcbiAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XG4gIGN0eC5pbWFnZVNtb290aGluZ1F1YWxpdHkgPSAnaGlnaCc7XG4gIGN0eC5kcmF3SW1hZ2UoYml0bWFwLCAwLCAwLCB3LCBoKTtcbiAgY29uc3QgYmxvYiA9IGF3YWl0IGNhbnZhcy5jb252ZXJ0VG9CbG9iKHt0eXBlOiAnaW1hZ2UvcG5nJ30pO1xuICAvLyBhcnJheUJ1ZmZlciArIGJ0b2EgYXZvaWRzIGFueSBGaWxlUmVhZGVyLWF2YWlsYWJpbGl0eSBjb25jZXJuLlxuICBjb25zdCBidWYgPSBhd2FpdCBibG9iLmFycmF5QnVmZmVyKCk7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgbGV0IGJpbmFyeSA9ICcnO1xuICBjb25zdCBjaHVuayA9IDB4ODBfMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IGNodW5rKSB7XG4gICAgYmluYXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgQXJyYXkuZnJvbShieXRlcy5zdWJhcnJheShpLCBpICsgY2h1bmspKSk7XG4gIH1cbiAgcmV0dXJuIGBkYXRhOmltYWdlL3BuZztiYXNlNjQsJHtidG9hKGJpbmFyeSl9YDtcbn07XG5cbi8vIFBlci10YWIgc2VyaWFsaXphdGlvbjogYXQgbW9zdCBvbmUgY2FwdHVyZSBpbiBmbGlnaHQgYXQgYSB0aW1lLiBXaXRob3V0IGFcbi8vIHF1ZXVlLCB0aGUgdGhyb3R0bGluZyBvbiBjYXB0dXJlVmlzaWJsZVRhYiAofjIgY2FsbHMvc2VjKSBzaG93cyB1cCBhc1xuLy8gbWlzc2luZyBzY3JlZW5zaG90cyB3aGVuIHRoZSB1c2VyIGZpcmVzIHNldmVyYWwgY2FwdHVyZXMgYmFjay10by1iYWNrLlxudHlwZSBRdWV1ZVRhc2sgPSAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuY29uc3QgdGFiUXVldWVzID0gbmV3IE1hcDxudW1iZXIsIFByb21pc2U8dm9pZD4+KCk7XG5jb25zdCBlbnF1ZXVlID0gKHRhYklkOiBudW1iZXIsIHRhc2s6IFF1ZXVlVGFzayk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCBwcmV2ID0gdGFiUXVldWVzLmdldCh0YWJJZCkgPz8gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGNvbnN0IG5leHQgPSBwcmV2LnRoZW4oKCkgPT4gdGFzaygpKS5jYXRjaCgoZSkgPT4geyBjb25zb2xlLndhcm4oTE9HLCAncXVldWUgdGFzayBmYWlsZWQnLCBlKTsgfSk7XG4gIHRhYlF1ZXVlcy5zZXQodGFiSWQsIG5leHQpO1xuICByZXR1cm4gbmV4dDtcbn07XG5cbi8vIE9uZS1zaG90IENTIHJvdW5kLXRyaXA6IGFzayB0aGUgY29udGVudCBzY3JpcHQgdG8gaGlkZSBpdHMgb3ZlcmxheSB0aGVuXG4vLyB3YWl0IGZvciBhY2suIFdlIHVzZSBzZW5kTWVzc2FnZSB3aXRoIGEgdGltZW91dCBzbyBhIENTIHRoYXQncyBzdHVjayBvclxuLy8gbm90IGxvYWRlZCBjYW4ndCB3ZWRnZSB0aGUgcXVldWUuXG5jb25zdCB0ZWxsQ3MgPSBhc3luYyA8VCA9IHVua25vd24+KHRhYklkOiBudW1iZXIsIHBheWxvYWQ6IGFueSwgdGltZW91dE1zID0gNjAwKTogUHJvbWlzZTxUIHwgbnVsbD4gPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8VCB8IG51bGw+KChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBmaW5pc2ggPSAodjogVCB8IG51bGwpOiB2b2lkID0+IHsgaWYgKCFkb25lKSB7IGRvbmUgPSB0cnVlOyByZXNvbHZlKHYpOyB9IH07XG4gICAgc2V0VGltZW91dCgoKSA9PiBmaW5pc2gobnVsbCksIHRpbWVvdXRNcyk7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCBwZyhwYXlsb2FkKSwgKHJlcGx5KSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHsgZmluaXNoKG51bGwpOyByZXR1cm47IH1cbiAgICAgICAgZmluaXNoKChyZXBseSA/PyBudWxsKSBhcyBUIHwgbnVsbCk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHsgZmluaXNoKG51bGwpOyB9XG4gIH0pO1xufTtcblxuLy8gUnVuIGEgZnVuY3Rpb24gaW5zaWRlIHRoZSBwYWdlJ3MgbWFpbiB3b3JsZCAob3IgaXNvbGF0ZWQsIGRvZXNuJ3QgbWF0dGVyXG4vLyBoZXJlIGJlY2F1c2Ugd2Ugb25seSByZWFkIGxheW91dCBudW1iZXJzKS4gYXJncyBpcyBwYXNzZWQgcG9zaXRpb25hbGx5LlxuY29uc3QgcnVuSW5QYWdlID0gYXN5bmMgPFQ+KFxuICB0YWJJZDogbnVtYmVyLFxuICBmdW5jOiAoLi4uYXJnczogYW55W10pID0+IFQsXG4gIGFyZ3M6IGFueVtdID0gW10sXG4pOiBQcm9taXNlPFQgfCBudWxsPiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHt0YWJJZH0sXG4gICAgICBmdW5jOiBmdW5jIGFzIGFueSxcbiAgICAgIGFyZ3MsXG4gICAgfSk7XG4gICAgcmV0dXJuIChyZXN1bHRzPy5bMF0/LnJlc3VsdCA/PyBudWxsKSBhcyBUIHwgbnVsbDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihMT0csICdydW5JblBhZ2UnLCBlKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxuLy8gQ29tcHV0ZSB1bmlvbiBiYm94IG9mIHNlbGVjdG9ycyBJTlNJREUgdGhlIHBhZ2UsIHNjcm9sbCBpdCBpbnRvIHZpZXcsIGFuZFxuLy8gcmV0dXJuIHRoZSBiYm94ICsgZHByIGZvciBjcm9wcGluZy4gcGFkZGluZyBpcyBhcHBsaWVkIHN5bW1ldHJpY2FsbHkuXG50eXBlIEJib3hSZXN1bHQgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyOyBkcHI6IG51bWJlcjsgdnc6IG51bWJlcjsgdmg6IG51bWJlcn07XG5jb25zdCBjb21wdXRlQW5kU2Nyb2xsID0gYXN5bmMgKFxuICB0YWJJZDogbnVtYmVyLFxuICBzZWxlY3RvcnM6IHN0cmluZ1tdLFxuICBwYWRkaW5nOiBudW1iZXIsXG4pOiBQcm9taXNlPEJib3hSZXN1bHQgfCBudWxsPiA9PiB7XG4gIHJldHVybiBydW5JblBhZ2U8QmJveFJlc3VsdCB8IG51bGw+KHRhYklkLCAoc2Vsczogc3RyaW5nW10sIHBhZDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgZWxzID0gc2Vscy5tYXAoKHMpID0+IHtcbiAgICAgIHRyeSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHMpOyB9IGNhdGNoIHsgcmV0dXJuIG51bGw7IH1cbiAgICB9KS5maWx0ZXIoKGUpOiBlIGlzIEVsZW1lbnQgPT4gQm9vbGVhbihlKSk7XG4gICAgaWYgKCFlbHMubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCByZWN0c0JlZm9yZSA9IGVscy5tYXAoKGUpID0+IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IHVNaW5YID0gTWF0aC5taW4oLi4ucmVjdHNCZWZvcmUubWFwKChyKSA9PiByLmxlZnQpKTtcbiAgICBjb25zdCB1TWluWSA9IE1hdGgubWluKC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci50b3ApKTtcbiAgICBjb25zdCB1TWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5yaWdodCkpO1xuICAgIGNvbnN0IHVNYXhZID0gTWF0aC5tYXgoLi4ucmVjdHNCZWZvcmUubWFwKChyKSA9PiByLmJvdHRvbSkpO1xuICAgIC8vIERPTidUIHNjcm9sbCB3aGVuIHRoZSB0YXJnZXQgaXMgYWxyZWFkeSBvbiBzY3JlZW4g4oCUIHNjcm9sbGluZyBhIHZpc2libGVcbiAgICAvLyBlbGVtZW50IHRvIGNlbnRlciBpcyB0aGUgamFycmluZyBqdW1wIHRoZSBvcGVyYXRvciBmbGFnZ2VkLCBhbmQgaXQnc1xuICAgIC8vIHRoZSBjb21tb24gY2FzZSAoeW91IGNhcHR1cmUgd2hhdCB5b3UgY2FuIHNlZSkuIE9ubHkgc2Nyb2xsIHdoZW4gdGhlXG4gICAgLy8gZWxlbWVudCBpcyBvZmYtc2NyZWVuIG9yIGNsaXBwZWQgKGxhenkgaW1hZ2VzIGJlbG93IHRoZSBmb2xkIG5lZWQgaXQpLlxuICAgIGNvbnN0IGZ1bGx5VmlzaWJsZSA9IHVNaW5YID49IDAgJiYgdU1pblkgPj0gMCAmJiB1TWF4WCA8PSB3aW5kb3cuaW5uZXJXaWR0aCAmJiB1TWF4WSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgaWYgKCFmdWxseVZpc2libGUpIHtcbiAgICAgIGNvbnN0IGN4ID0gKHVNaW5YICsgdU1heFgpIC8gMiArIHdpbmRvdy5zY3JvbGxYO1xuICAgICAgY29uc3QgY3kgPSAodU1pblkgKyB1TWF4WSkgLyAyICsgd2luZG93LnNjcm9sbFk7XG4gICAgICBjb25zdCB0YXJnZXRYID0gTWF0aC5tYXgoMCwgY3ggLSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIpO1xuICAgICAgY29uc3QgdGFyZ2V0WSA9IE1hdGgubWF4KDAsIGN5IC0gd2luZG93LmlubmVySGVpZ2h0IC8gMik7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oe2xlZnQ6IHRhcmdldFgsIHRvcDogdGFyZ2V0WSwgYmVoYXZpb3I6ICdpbnN0YW50JyBhcyBTY3JvbGxCZWhhdmlvcn0pO1xuICAgIH1cblxuICAgIC8vIFJlY29tcHV0ZSBiYm94ZXMgYWZ0ZXIgc2Nyb2xsLlxuICAgIGNvbnN0IHJlY3RzID0gZWxzLm1hcCgoZSkgPT4gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgY29uc3QgbWluWCA9IE1hdGgubWluKC4uLnJlY3RzLm1hcCgocikgPT4gci5sZWZ0KSkgLSBwYWQ7XG4gICAgY29uc3QgbWluWSA9IE1hdGgubWluKC4uLnJlY3RzLm1hcCgocikgPT4gci50b3ApKSAtIHBhZDtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKChyKSA9PiByLnJpZ2h0KSkgKyBwYWQ7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcCgocikgPT4gci5ib3R0b20pKSArIHBhZDtcbiAgICByZXR1cm4ge1xuICAgICAgeDogbWluWCxcbiAgICAgIHk6IG1pblksXG4gICAgICB3OiBtYXhYIC0gbWluWCxcbiAgICAgIGg6IG1heFkgLSBtaW5ZLFxuICAgICAgZHByOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuICAgICAgdnc6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgdmg6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICB9O1xuICB9LCBbc2VsZWN0b3JzLCBwYWRkaW5nXSk7XG59O1xuXG4vLyBPbmUtZnJhbWUgeWllbGQgaW5zaWRlIHRoZSBwYWdlIHNvIGFueSBwb3N0LXNjcm9sbCBsYXlvdXQgc2V0dGxlcy4gV2UgcGluXG4vLyB0byB0d28gckFGcyB0byBiZSBjb25zZXJ2YXRpdmUg4oCUIHBhZ2VzIHdpdGggc3RpY2t5IGhlYWRlcnMgc29tZXRpbWVzIG5lZWRcbi8vIHRoZSBzZWNvbmQgZnJhbWUgdG8gcmVwYWludCB0aGUgaGVhZGVyIGF0IGl0cyBuZXcgb2Zmc2V0LlxuY29uc3QgeWllbGRSYWYgPSBhc3luYyAodGFiSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICBhd2FpdCBydW5JblBhZ2U8dm9pZD4odGFiSWQsICgpID0+XG4gICAgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlc29sdmUoKSkpKSxcbiAgKTtcbn07XG5cbi8vIFJlc3RvcmUgdGhlIHBhZ2Ugc2Nyb2xsIHBvc2l0aW9uIGFmdGVyIHN0aXRjaGluZy4gVGhlIG9yaWdpbmFsIHBvc2l0aW9uc1xuLy8gYXJlIHBhc3NlZCBiYWNrIGZyb20gdGhlIHN0aXRjaCBsb29wLlxuY29uc3QgcmVzdG9yZVNjcm9sbCA9IGFzeW5jICh0YWJJZDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICBhd2FpdCBydW5JblBhZ2U8dm9pZD4odGFiSWQsIChzeDogbnVtYmVyLCBzeTogbnVtYmVyKSA9PiB7XG4gICAgd2luZG93LnNjcm9sbFRvKHtsZWZ0OiBzeCwgdG9wOiBzeSwgYmVoYXZpb3I6ICdpbnN0YW50JyBhcyBTY3JvbGxCZWhhdmlvcn0pO1xuICB9LCBbeCwgeV0pO1xufTtcblxuY29uc3QgUEFHRV9DSFVOS19MSU1JVCA9IDg7XG5jb25zdCBDQU5WQVNfUElYRUxfTElNSVQgPSAxNjM4NDsgLy8gT2Zmc2NyZWVuQ2FudmFzIHNhZmV0eSBjYXBcblxuLy8gUGFnZSAoZnVsbC1kb2N1bWVudCkgc2hvdC4gTG9vcHMgY2FwdHVyZVZpc2libGVUYWIgd2hpbGUgc2Nyb2xsaW5nIGJ5XG4vLyB2aWV3cG9ydC1oZWlnaHQgY2h1bmtzOyBzdG9wcyBhdCBjaHVuayBjb3VudCwgcGl4ZWwgY2FwLCBvciBzY3JvbGxIZWlnaHQuXG5jb25zdCBzdGl0Y2hQYWdlID0gYXN5bmMgKFxuICB0YWJJZDogbnVtYmVyLFxuICB3aW5kb3dJZDogbnVtYmVyLFxuKTogUHJvbWlzZTx7YmxvYjogQmxvYjsgYml0bWFwOiBJbWFnZUJpdG1hcDsgdHJ1bmNhdGVkOiBib29sZWFufSB8IG51bGw+ID0+IHtcbiAgLy8gU25hcHNob3Qgc2Nyb2xsIGdlb21ldHJ5IHVwIGZyb250LlxuICBjb25zdCBnZW9tID0gYXdhaXQgcnVuSW5QYWdlPHt2dzogbnVtYmVyOyB2aDogbnVtYmVyOyBzdzogbnVtYmVyOyBzaDogbnVtYmVyOyBkcHI6IG51bWJlcjsgc3g6IG51bWJlcjsgc3k6IG51bWJlcn0+KFxuICAgIHRhYklkLFxuICAgICgpID0+ICh7XG4gICAgICB2dzogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICB2aDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgc3c6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCwgZG9jdW1lbnQuYm9keT8uc2Nyb2xsV2lkdGggPz8gMCksXG4gICAgICBzaDogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuYm9keT8uc2Nyb2xsSGVpZ2h0ID8/IDApLFxuICAgICAgZHByOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuICAgICAgc3g6IHdpbmRvdy5zY3JvbGxYLFxuICAgICAgc3k6IHdpbmRvdy5zY3JvbGxZLFxuICAgIH0pLFxuICApO1xuICBpZiAoIWdlb20pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGRwciA9IGdlb20uZHByO1xuICBjb25zdCB0b3RhbEggPSBnZW9tLnNoO1xuICBjb25zdCB0b3RhbEhweCA9IE1hdGgucm91bmQodG90YWxIICogZHByKTtcbiAgY29uc3Qgd2lkdGhQeCA9IE1hdGgucm91bmQoZ2VvbS52dyAqIGRwcik7XG5cbiAgLy8gSWYgdGhlIHBhZ2UgaXMgc2hvcnQgZW5vdWdoIHRvIGZpdCBpbiB0aGUgdmlld3BvcnQsIHNpbmdsZSBzaG90LlxuICBsZXQgY2h1bmtzID0gMDtcbiAgbGV0IHkgPSAwO1xuICBsZXQgc3RpdGNoZWRIcHggPSAwO1xuICBsZXQgdHJ1bmNhdGVkID0gZmFsc2U7XG5cbiAgLy8gQWxsb2NhdGUgdGhlIGNhbnZhcyBhdCB0aGUgY29uc2VydmF0aXZlIGZpbmFsIHNpemU7IHdlJ2xsIHRyaW0gbGF0ZXIgaWZcbiAgLy8gd2Ugc3RvcCBlYXJseS4gd2lkdGggaXMgZml4ZWQ7IGhlaWdodCBncm93cyB1cCB0byBtaW4odG90YWxIcHgsIGNhcCkuXG4gIGNvbnN0IHRhcmdldEhweCA9IE1hdGgubWluKHRvdGFsSHB4LCBDQU5WQVNfUElYRUxfTElNSVQpO1xuICBjb25zdCBjYW52YXMgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoUHgsIHRhcmdldEhweCk7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcblxuICB3aGlsZSAoeSA8IHRvdGFsSCkge1xuICAgIGlmIChjaHVua3MgPj0gUEFHRV9DSFVOS19MSU1JVCkgeyB0cnVuY2F0ZWQgPSB0cnVlOyBicmVhazsgfVxuICAgIGlmIChzdGl0Y2hlZEhweCA+PSBDQU5WQVNfUElYRUxfTElNSVQpIHsgdHJ1bmNhdGVkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICBhd2FpdCBydW5JblBhZ2U8dm9pZD4odGFiSWQsICh5eTogbnVtYmVyKSA9PiB7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oe2xlZnQ6IDAsIHRvcDogeXksIGJlaGF2aW9yOiAnaW5zdGFudCcgYXMgU2Nyb2xsQmVoYXZpb3J9KTtcbiAgICB9LCBbeV0pO1xuICAgIGF3YWl0IHlpZWxkUmFmKHRhYklkKTtcbiAgICBsZXQgZGF0YVVybDogc3RyaW5nO1xuICAgIHRyeSB7XG4gICAgICBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIod2luZG93SWQsIHtmb3JtYXQ6ICdwbmcnfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ2NhcHR1cmVWaXNpYmxlVGFiIHBhZ2UgY2h1bmsgZmFpbGVkJywgZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc3QgYm0gPSBhd2FpdCBkYXRhVXJsVG9CaXRtYXAoZGF0YVVybCk7XG4gICAgLy8gRGV0ZXJtaW5lIGhvdyBtdWNoIG9mIFRISVMgY2h1bmsgdG8gZHJhdy4gVGhlIGxhc3QgY2h1bmsgdXN1YWxseVxuICAgIC8vIG92ZXJsYXBzIHRoZSBwcmV2aW91cyBvbmUgKGJlY2F1c2UgdG90YWxIIGlzIG5vdCBhIHZpZXdwb3J0IG11bHRpcGxlKTtcbiAgICAvLyBkcmF3aW5nIHRoZSBmdWxsIGJpdG1hcCB3b3VsZCBkdXBsaWNhdGUgcGl4ZWxzLiBTbyB3ZSBjcm9wIGJ5IHRoZVxuICAgIC8vIHJlbWFpbmRlciBvZiB0aGUgcGFnZSBoZWlnaHQgd2hlbiBvbiB0aGUgdGFpbC5cbiAgICBjb25zdCByZW1haW5pbmdQeCA9IE1hdGgucm91bmQoKHRvdGFsSCAtIHkpICogZHByKTtcbiAgICBjb25zdCBkcmF3U3JjSCA9IE1hdGgubWluKGJtLmhlaWdodCwgcmVtYWluaW5nUHgpO1xuICAgIGNvbnN0IGRyYXdEZXN0SCA9IE1hdGgubWluKHRhcmdldEhweCAtIHN0aXRjaGVkSHB4LCBkcmF3U3JjSCk7XG4gICAgaWYgKGRyYXdEZXN0SCA8PSAwKSB7IHRydW5jYXRlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgY3R4LmRyYXdJbWFnZShibSwgMCwgMCwgYm0ud2lkdGgsIGRyYXdEZXN0SCwgMCwgc3RpdGNoZWRIcHgsIGJtLndpZHRoLCBkcmF3RGVzdEgpO1xuICAgIHN0aXRjaGVkSHB4ICs9IGRyYXdEZXN0SDtcbiAgICBjaHVua3MrKztcbiAgICB5ICs9IGdlb20udmg7XG4gICAgYm0uY2xvc2U/LigpO1xuICB9XG5cbiAgLy8gUmVzdG9yZSBzY3JvbGwuXG4gIGF3YWl0IHJlc3RvcmVTY3JvbGwodGFiSWQsIGdlb20uc3gsIGdlb20uc3kpO1xuXG4gIC8vIFRyaW0gY2FudmFzIHRvIGFjdHVhbCBzdGl0Y2hlZCBoZWlnaHQgaWYgd2Ugc3RvcHBlZCBiZWZvcmUgdGFyZ2V0SHB4LlxuICBsZXQgb3V0Q2FudmFzID0gY2FudmFzO1xuICBpZiAoc3RpdGNoZWRIcHggPCB0YXJnZXRIcHgpIHtcbiAgICBjb25zdCB0cmltbWVkID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aFB4LCBNYXRoLm1heCgxLCBzdGl0Y2hlZEhweCkpO1xuICAgIGNvbnN0IHRjdHggPSB0cmltbWVkLmdldENvbnRleHQoJzJkJykhO1xuICAgIHRjdHguZHJhd0ltYWdlKGNhbnZhcywgMCwgMCk7XG4gICAgb3V0Q2FudmFzID0gdHJpbW1lZDtcbiAgfVxuICBjb25zdCBibG9iID0gYXdhaXQgY2FudmFzVG9CbG9iKG91dENhbnZhcyk7XG4gIGNvbnN0IGJpdG1hcCA9IGF3YWl0IGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xuICByZXR1cm4ge2Jsb2IsIGJpdG1hcCwgdHJ1bmNhdGVkfTtcbn07XG5cbi8vIEVsZW1lbnQvZ3JvdXAgc2hvdDogaGlkZSBvdmVybGF5cywgY2FwdHVyZSB2aWV3cG9ydCwgY3JvcCBpbiBjYW52YXMuXG5jb25zdCBzaG90RWxlbWVudENvbW1vbiA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbiAgc2VsZWN0b3JzOiBzdHJpbmdbXSxcbiAgcGFkZGluZzogbnVtYmVyLFxuKTogUHJvbWlzZTx7YmxvYjogQmxvYjsgYml0bWFwOiBJbWFnZUJpdG1hcDsgdGFiVXJsOiBzdHJpbmc7IGNyb3BNZXRhOiBTaG90UmVwbHlbJ2Nyb3AnXX0gfCBudWxsPiA9PiB7XG4gIGNvbnN0IHRhYiA9IGF3YWl0IGNocm9tZS50YWJzLmdldCh0YWJJZCk7XG4gIGNvbnN0IHRhYlVybCA9IHRhYj8udXJsID8/ICcnO1xuICAvLyBJdGVtIDE3IChmbGFzaGluZyk6IGhpZGUgKyBmcmVlemUgb3ZlcmxheXMgQkVGT1JFIHdlIHNjcm9sbCB0aGUgcGFnZSB0b1xuICAvLyBmcmFtZSB0aGUgY2FwdHVyZS4gVGhlIG9sZCBvcmRlciBzY3JvbGxlZCBmaXJzdCwgc28gdGhlIGNvbnRlbnQgc2NyaXB0J3NcbiAgLy8gcmluZyByQUYgbG9vcHMgY2hhc2VkIHRoZSBuZXcgc2Nyb2xsIG9mZnNldCAoYSB2aXNpYmxlIGp1bXApIGJlZm9yZSB0aGV5XG4gIC8vIHdlcmUgaGlkZGVuLCBhbmQgYSBncm91cGVkIGNhcHR1cmUncyBtYW55IHJpbmdzIGFtcGxpZmllZCB0aGUgZmxpY2tlci5cbiAgLy8gSGlkaW5nIGZpcnN0IG1lYW5zIHRoZSB3aG9sZSBzY3JvbGzihpJ5aWVsZOKGkmNhcHR1cmXihpJyZXN0b3JlIHdpbmRvdyBoYXBwZW5zXG4gIC8vIHdpdGggdGhlIG92ZXJsYXkgZnJvemVuIGFuZCBvdXQgb2YgbGF5b3V0IOKAlCBubyBvbi1zY3JlZW4gZmxhc2guXG4gIGF3YWl0IHRlbGxDcyh0YWJJZCwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ30pO1xuICAvLyBSZW1lbWJlciB0aGUgb3BlcmF0b3IncyBzY3JvbGwgc28gYSBjYXB0dXJlIG5ldmVyIGxlYXZlcyB0aGUgcGFnZSBtb3ZlZC5cbiAgLy8gY29tcHV0ZUFuZFNjcm9sbCBvbmx5IHNjcm9sbHMgd2hlbiB0aGUgdGFyZ2V0IGlzIG9mZi1zY3JlZW4gKGEgZ3JvdXBcbiAgLy8gdGhhdCBzbmFwcGVkIHBhc3QgdGhlIGZvbGQpOyB3ZSBhbHdheXMgcmVzdG9yZSBhZnRlcndhcmQgcmVnYXJkbGVzcy5cbiAgY29uc3Qgb3JpZ1Njcm9sbCA9IGF3YWl0IHJ1bkluUGFnZTx7eDogbnVtYmVyOyB5OiBudW1iZXJ9Pih0YWJJZCwgKCkgPT4gKHt4OiB3aW5kb3cuc2Nyb2xsWCwgeTogd2luZG93LnNjcm9sbFl9KSkgPz8ge3g6IDAsIHk6IDB9O1xuICBsZXQgZGF0YVVybDogc3RyaW5nO1xuICBsZXQgYmJveDogQmJveFJlc3VsdCB8IG51bGwgPSBudWxsO1xuICB0cnkge1xuICAgIGJib3ggPSBhd2FpdCBjb21wdXRlQW5kU2Nyb2xsKHRhYklkLCBzZWxlY3RvcnMsIHBhZGRpbmcpO1xuICAgIGlmICghYmJveCkgcmV0dXJuIG51bGw7XG4gICAgYXdhaXQgeWllbGRSYWYodGFiSWQpO1xuICAgIGRhdGFVcmwgPSBhd2FpdCBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih3aW5kb3dJZCwge2Zvcm1hdDogJ3BuZyd9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihMT0csICdjYXB0dXJlVmlzaWJsZVRhYiBmYWlsZWQnLCBlKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCByZXN0b3JlU2Nyb2xsKHRhYklkLCBvcmlnU2Nyb2xsLngsIG9yaWdTY3JvbGwueSk7XG4gICAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfSk7XG4gIH1cblxuICBjb25zdCBibSA9IGF3YWl0IGRhdGFVcmxUb0JpdG1hcChkYXRhVXJsKTtcbiAgLy8gQ29udmVydCBDU1MtcGl4ZWwgYmJveCDihpIgZGV2aWNlLXBpeGVsIGJib3g7IGNsYW1wIHRvIGJpdG1hcCBib3VuZHMgc29cbiAgLy8gYSBwYXJ0aWFsbHkgb2ZmLXNjcmVlbiBlbGVtZW50IGRvZXNuJ3QgY3Jhc2ggZHJhd0ltYWdlLlxuICBjb25zdCBzeCA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoYmJveC54ICogYmJveC5kcHIpKTtcbiAgY29uc3Qgc3kgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGJib3gueSAqIGJib3guZHByKSk7XG4gIGNvbnN0IHN3ID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oYm0ud2lkdGggLSBzeCwgTWF0aC5yb3VuZChiYm94LncgKiBiYm94LmRwcikpKTtcbiAgY29uc3Qgc2ggPSBNYXRoLm1heCgxLCBNYXRoLm1pbihibS5oZWlnaHQgLSBzeSwgTWF0aC5yb3VuZChiYm94LmggKiBiYm94LmRwcikpKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyhzdywgc2gpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5kcmF3SW1hZ2UoYm0sIHN4LCBzeSwgc3csIHNoLCAwLCAwLCBzdywgc2gpO1xuICBibS5jbG9zZT8uKCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXNUb0Jsb2IoY2FudmFzKTtcbiAgY29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XG4gIC8vIEJ1ZyAjMyBmcm9tIHRoZSBleHBvcnQgcm9hc3Q6IHN1cmZhY2UgY3JvcCBtZXRhZGF0YSBzbyByZWNlaXZlcnNcbiAgLy8gY2FuIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZCB0aGUgb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlcy5cbiAgLy8gY3NzUmVjdCA9IHByZS1EUFIgQ1NTIHBpeGVsIHJlY3Qgb2YgdGhlIGNhcHR1cmVkIHJlZ2lvbi5cbiAgLy8gZGV2aWNlUHhSZWN0ID0gcG9zdC1EUFIgcGl4ZWwgcmVjdCBpbnNpZGUgdGhlIHNvdXJjZSBiaXRtYXAuXG4gIC8vIGltYWdlU2l6ZSA9IGRpbWVuc2lvbnMgb2YgdGhlIHByb2R1Y2VkIFBORy5cbiAgLy8gZHByID0gdGhlIGNvbnZlcnNpb24gZmFjdG9yLlxuICBjb25zdCBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ10gPSB7XG4gICAgY3NzUmVjdDoge3g6IGJib3gueCwgeTogYmJveC55LCB3OiBiYm94LncsIGg6IGJib3guaH0sXG4gICAgZGV2aWNlUHhSZWN0OiB7eDogc3gsIHk6IHN5LCB3OiBzdywgaDogc2h9LFxuICAgIGltYWdlU2l6ZToge3c6IHN3LCBoOiBzaH0sXG4gICAgZHByOiBiYm94LmRwcixcbiAgICBwYWRkaW5nLFxuICAgIHNlbGVjdG9ycyxcbiAgfTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRhYlVybCwgY3JvcE1ldGF9O1xufTtcblxuLy8gUGFnZS1vbmx5IHBhdGguIEhpZGVzIG92ZXJsYXlzLCBzdGl0Y2hlcywgcmVzdG9yZXMuXG5jb25zdCBzaG90UGFnZUNvbW1vbiA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfSk7XG4gIGxldCBzdGl0Y2hlZDoge2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBzdGl0Y2hlZCA9IGF3YWl0IHN0aXRjaFBhZ2UodGFiSWQsIHdpbmRvd0lkKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnc2hvdy1vdmVybGF5cyd9KTtcbiAgfVxuICBpZiAoIXN0aXRjaGVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsuLi5zdGl0Y2hlZCwgdGFiVXJsfTtcbn07XG5cbi8vIFNhdmUgdGhlIGJsb2IgYXMgYSBkb3dubG9hZCB1bmRlciAucGluY2hncmFiLzx3b3Jrc3BhY2U+LzxzdWJkaXI+Ly5cbi8vXG4vLyBNVjMgc2VydmljZSB3b3JrZXJzIERPIE5PVCBoYXZlIFVSTC5jcmVhdGVPYmplY3RVUkwg4oCUIGNhbGxpbmcgaXQgdGhyb3dzXG4vLyBcIlVSTC5jcmVhdGVPYmplY3RVUkwgaXMgbm90IGEgZnVuY3Rpb25cIiAodmVyaWZpZWQgbGl2ZSBpbiBleHRlbnNpb24uc3BlYykuXG4vLyBXZSBiYXNlNjQtZW5jb2RlIHRoZSBibG9iIGludG8gYSBkYXRhIFVSTCBpbnN0ZWFkLiBUcmFkZW9mZjogdGhlIGRhdGFcbi8vIFVSTCBpcyB+MzMlIGxhcmdlciB0aGFuIHJhdyBieXRlcywgYW5kIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgaGFzIGFcbi8vIGRhdGEtVVJMIHNpemUgbGltaXQgc29tZXdoZXJlIGFyb3VuZCAzMiBNQjsgZm9yIHR5cGljYWwgd29ya3NwYWNlXG4vLyBleHBvcnRzIChzdWItTUIgSlNPTkwgKyBsb3ctTUIgWklQcykgdGhpcyBpcyB3ZWxsIHVuZGVyIHRoZSBsaW1pdC5cbnR5cGUgU2F2ZWRGaWxlID0ge1xuICByZWxQYXRoOiBzdHJpbmc7XG4gIGFic1BhdGg6IHN0cmluZztcbiAgY29weVBhdGg6IHN0cmluZztcbiAgdGVtcFBhdGg6IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiBjaHJvbWUuZG93bmxvYWRzLkRvd25sb2FkSXRlbVsnc3RhdGUnXTtcbn07XG5cbmNvbnN0IGlzUGxheXdyaWdodEFydGlmYWN0UGF0aCA9IChwYXRoOiBzdHJpbmcpOiBib29sZWFuID0+XG4gIC8oPzpefFtcXFxcL10pKD86cGxheXdyaWdodC1hcnRpZmFjdHN8cGluY2hncmFiLWRsKS1bXlxcXFwvXStbXFxcXC9dWzAtOWEtZi1dezh9LVswLTlhLWYtXXs0fS1bMC05YS1mLV17NH0tWzAtOWEtZi1dezR9LVswLTlhLWYtXXsxMn0kL2kudGVzdChwYXRoKTtcblxuY29uc3QgYmxvYlRvRGF0YVVybCA9IGFzeW5jIChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIC8vIEJ1aWxkIGJhc2U2NCBpbiAzMiBLaUIgY2h1bmtzIHNvIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkgZG9lc24ndFxuICAvLyBvdmVyZmxvdyB0aGUgY2FsbCBzdGFjayBvbiBsYXJnZSBpbnB1dHMuXG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIGNvbnN0IG1pbWUgPSBibG9iLnR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIHJldHVybiBgZGF0YToke21pbWV9O2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuLy8g4pSA4pSA4pSAIFF1aWV0IHNhdmVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gV2l0aCB0aGUgb3B0aW9uYWwgYGRvd25sb2Fkcy51aWAgcGVybWlzc2lvbiBncmFudGVkIGFuZCB0aGUgcXVpZXRTYXZlc1xuLy8gcHJlZiBvbiwgQ2hyb21lJ3MgZG93bmxvYWQgYnViYmxlIGlzIHN1cHByZXNzZWQgd2hpbGUgUGluY2hHcmFiIHdyaXRlcyBpdHNcbi8vIG93biBmaWxlcywgdGhlbiByZXN0b3JlZCBhZnRlciBhIHNob3J0IGRlYm91bmNlIHNvIGJhY2stdG8tYmFjayBjYXB0dXJlc1xuLy8gZG9uJ3QgZmxhcCB0aGUgVUkgYW5kIHRoZSB1c2VyJ3Mgb3RoZXIgZG93bmxvYWRzIGtlZXAgdGhlaXIgc3VyZmFjZS5cbi8vIERlcHRoLWNvdW50ZWQ6IGNvbmN1cnJlbnQgc2F2ZXMgc2hhcmUgb25lIHN1cHByZXNzaW9uIHdpbmRvdy5cbmNvbnN0IFFVSUVUX1JFU1RPUkVfTVMgPSAxNTAwO1xubGV0IHF1aWV0RGVwdGggPSAwO1xubGV0IHF1aWV0UmVzdG9yZVRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IHVuZGVmaW5lZDtcbmNvbnN0IHNldERvd25sb2FkVWkgPSAoZW5hYmxlZDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGFwaSA9IChjaHJvbWUuZG93bmxvYWRzIGFzIHVua25vd24gYXMge3NldFVpT3B0aW9ucz86IChvOiB7ZW5hYmxlZDogYm9vbGVhbn0pID0+IFByb21pc2U8dm9pZD59KS5zZXRVaU9wdGlvbnM7XG4gICAgaWYgKGFwaSkgdm9pZCBhcGkuY2FsbChjaHJvbWUuZG93bmxvYWRzLCB7ZW5hYmxlZH0pLmNhdGNoKChlOiB1bmtub3duKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnc2V0VWlPcHRpb25zJywgZSkpO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzZXRVaU9wdGlvbnMgdGhyZXcnLCBlKTsgfVxufTtcbmNvbnN0IHF1aWV0U2F2ZXNBY3RpdmUgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3RvcmUgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3BpbmNoZ3JhYi5wcmVmcy52MicpO1xuICAgIGNvbnN0IHByZWZzID0gc3RvcmVbJ3BpbmNoZ3JhYi5wcmVmcy52MiddIGFzIHtxdWlldFNhdmVzPzogYm9vbGVhbn0gfCB1bmRlZmluZWQ7XG4gICAgaWYgKCFwcmVmcz8ucXVpZXRTYXZlcykgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMuY29udGFpbnMoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7XG4gIH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbn07XG5jb25zdCBiZWdpblF1aWV0ID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICBpZiAoIShhd2FpdCBxdWlldFNhdmVzQWN0aXZlKCkpKSByZXR1cm4gZmFsc2U7XG4gIHF1aWV0RGVwdGgrKztcbiAgaWYgKHF1aWV0UmVzdG9yZVRpbWVyKSB7IGNsZWFyVGltZW91dChxdWlldFJlc3RvcmVUaW1lcik7IHF1aWV0UmVzdG9yZVRpbWVyID0gdW5kZWZpbmVkOyB9XG4gIHNldERvd25sb2FkVWkoZmFsc2UpO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5jb25zdCBlbmRRdWlldCA9ICgpOiB2b2lkID0+IHtcbiAgaWYgKHF1aWV0RGVwdGggPiAwKSBxdWlldERlcHRoLS07XG4gIGlmIChxdWlldERlcHRoID09PSAwKSB7XG4gICAgaWYgKHF1aWV0UmVzdG9yZVRpbWVyKSBjbGVhclRpbWVvdXQocXVpZXRSZXN0b3JlVGltZXIpO1xuICAgIHF1aWV0UmVzdG9yZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7IHF1aWV0UmVzdG9yZVRpbWVyID0gdW5kZWZpbmVkOyBzZXREb3dubG9hZFVpKHRydWUpOyB9LCBRVUlFVF9SRVNUT1JFX01TKTtcbiAgfVxufTtcbi8vIFdvcmtlci1zdGFydCByZXN0b3JlIGd1YXJkOiBpZiBhIHByZXZpb3VzIHdvcmtlciBkaWVkIG1pZC1zdXBwcmVzc2lvbiB0aGVcbi8vIGJ1YmJsZSB3b3VsZCBzdGF5IGhpZGRlbiBmb3IgZXZlcnkgZG93bmxvYWQgaW4gdGhlIGJyb3dzZXIuIHNldFVpT3B0aW9uc1xuLy8gc3RhdGUgb3V0bGl2ZXMgdGhlIHdvcmtlciwgc28gcmUtZW5hYmxlIG9uIGV2ZXJ5IHN0YXJ0IChwZXJtaXNzaW9uLWdhdGVkLFxuLy8gbm8tb3Agb3RoZXJ3aXNlKS5cbnZvaWQgY2hyb21lLnBlcm1pc3Npb25zPy5jb250YWlucyh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KVxuICAudGhlbigoZ3JhbnRlZCkgPT4geyBpZiAoZ3JhbnRlZCkgc2V0RG93bmxvYWRVaSh0cnVlKTsgfSlcbiAgLmNhdGNoKCgpID0+IHsgLyogcGVybWlzc2lvbnMgQVBJIHVuYXZhaWxhYmxlIGluIHNvbWUgaGFybmVzc2VzICovIH0pO1xuXG5jb25zdCBzYXZlRG93bmxvYWQgPSBhc3luYyAoXG4gIGJsb2I6IEJsb2IsXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBzdWJkaXIgPSAnc2NyZWVuc2hvdHMnLFxuKTogUHJvbWlzZTxTYXZlZEZpbGU+ID0+IHtcbiAgY29uc3QgcmVsUGF0aCA9IHN1YmRpciA/IGAke3N1YmRpcn0vJHtmaWxlbmFtZX1gIDogZmlsZW5hbWU7XG4gIGNvbnN0IGZ1bGxQYXRoID0gYHBpbmNoZ3JhYi8ke3dvcmtzcGFjZX0vJHtyZWxQYXRofWA7XG4gIGNvbnNvbGUubG9nKExPRywgJ3NhdmVEb3dubG9hZCBzdGFydCcsIHtmdWxsUGF0aCwgbWltZTogYmxvYi50eXBlLCBzaXplOiBibG9iLnNpemV9KTtcbiAgY29uc3QgcXVpZXQgPSBhd2FpdCBiZWdpblF1aWV0KCk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHNhdmVEb3dubG9hZElubmVyKGJsb2IsIHdvcmtzcGFjZSwgcmVsUGF0aCwgZnVsbFBhdGgpO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChxdWlldCkgZW5kUXVpZXQoKTtcbiAgfVxufTtcblxuY29uc3Qgc2F2ZURvd25sb2FkSW5uZXIgPSBhc3luYyAoXG4gIGJsb2I6IEJsb2IsXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICByZWxQYXRoOiBzdHJpbmcsXG4gIGZ1bGxQYXRoOiBzdHJpbmcsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCB1cmwgPSBhd2FpdCBibG9iVG9EYXRhVXJsKGJsb2IpO1xuICBjb25zdCBkb3dubG9hZElkID0gYXdhaXQgbmV3IFByb21pc2U8bnVtYmVyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZChcbiAgICAgIHt1cmwsIGZpbGVuYW1lOiBmdWxsUGF0aCwgY29uZmxpY3RBY3Rpb246ICdvdmVyd3JpdGUnfSxcbiAgICAgIChpZCkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihMT0csICdjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGxhc3RFcnJvcjonLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPz8gJ2Rvd25sb2FkIGZhaWxlZCcpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgcmV0dXJuZWQgbm8gaWQnKTtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdkb3dubG9hZCByZXR1cm5lZCBubyBpZCcpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShpZCk7XG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuICBjb25zb2xlLmxvZyhMT0csICdjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGFjY2VwdGVkJywge2lkOiBkb3dubG9hZElkLCBmdWxsUGF0aH0pO1xuICAvLyBSZXNvbHZlIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIGFuZCBkbyBub3QgcmVwb3J0IHN1Y2Nlc3MgdW50aWwgQ2hyb21lIHNheXNcbiAgLy8gdGhlIGRvd25sb2FkIGNvbXBsZXRlZC4gYGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWRgIG9ubHkgbWVhbnMgXCJhY2NlcHRlZFwiO1xuICAvLyBkaXNrLWZ1bGwsIHBlcm1pc3Npb24sIG9yIGludGVycnVwdGVkIHdyaXRlcyBzdXJmYWNlIGxhdGVyIHRocm91Z2hcbiAgLy8gZG93bmxvYWRzLnNlYXJjaC5cbiAgbGV0IGFic1BhdGggPSBgJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gO1xuICBsZXQgZG93bmxvYWRTdGF0ZTogY2hyb21lLmRvd25sb2Fkcy5Eb3dubG9hZEl0ZW1bJ3N0YXRlJ10gfCB1bmRlZmluZWQ7XG4gIGxldCBpbnRlcnJ1cHRlZEVycm9yID0gJyc7XG4gIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgMTAwOyBhdHRlbXB0KyspIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBjaHJvbWUuZG93bmxvYWRzLnNlYXJjaCh7aWQ6IGRvd25sb2FkSWR9KTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtcz8uWzBdO1xuICAgICAgaWYgKGl0ZW0/LmZpbGVuYW1lKSBhYnNQYXRoID0gaXRlbS5maWxlbmFtZTtcbiAgICAgIGRvd25sb2FkU3RhdGUgPSBpdGVtPy5zdGF0ZTtcbiAgICAgIGlmIChpdGVtPy5zdGF0ZSA9PT0gJ2ludGVycnVwdGVkJykge1xuICAgICAgICBpbnRlcnJ1cHRlZEVycm9yID0gYGRvd25sb2FkIGludGVycnVwdGVkJHtpdGVtLmVycm9yID8gYDogJHtpdGVtLmVycm9yfWAgOiAnJ31gO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtPy5zdGF0ZSA9PT0gJ2NvbXBsZXRlJyAmJiBpdGVtLmZpbGVuYW1lKSBicmVhaztcbiAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMuc2VhcmNoIHRocmV3OicsIGUpOyB9XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMTAwKSk7XG4gIH1cbiAgaWYgKGludGVycnVwdGVkRXJyb3IpIHRocm93IG5ldyBFcnJvcihpbnRlcnJ1cHRlZEVycm9yKTtcbiAgaWYgKGRvd25sb2FkU3RhdGUgIT09ICdjb21wbGV0ZScpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGRvd25sb2FkIGRpZCBub3QgY29tcGxldGUke2Rvd25sb2FkU3RhdGUgPyBgIChzdGF0ZTogJHtkb3dubG9hZFN0YXRlfSlgIDogJyd9YCk7XG4gIH1cbiAgY29uc3QgdGVtcFBhdGggPSBpc1BsYXl3cmlnaHRBcnRpZmFjdFBhdGgoYWJzUGF0aCk7XG4gIC8vIFBsYXl3cmlnaHQgcmV3cml0ZXMgQ2hyb21lIGRvd25sb2FkcyB0byBleHRlbnNpb25sZXNzIFVVSUQgZmlsZXMgdW5kZXJcbiAgLy8gL3RtcC9wbGF5d3JpZ2h0LWFydGlmYWN0cy0qOyBjb3B5aW5nIHRoYXQgdG8gdGhlIHVzZXIgaXMgY29uZnVzaW5nIGFuZFxuICAvLyBvZnRlbiBzdGFsZS4gS2VlcCBpdCBpbiBhYnNQYXRoIGZvciB0ZXN0cy9kZWJ1Z2dpbmcsIGJ1dCBleHBvc2UgdGhlXG4gIC8vIGludGVuZGVkIGJyb3dzZXIgZG93bmxvYWQgdGFyZ2V0IGZvciB0aGUgc2lkZSBwYW5lbCdzIGNsaXBib2FyZCBhY3Rpb24uXG4gIGNvbnN0IGNvcHlQYXRoID0gdGVtcFBhdGggPyBgfi9Eb3dubG9hZHMvJHtmdWxsUGF0aH1gIDogYWJzUGF0aDtcbiAgY29uc29sZS5sb2coTE9HLCAnc2F2ZURvd25sb2FkIHJldHVybmluZycsIHtyZWxQYXRoLCBhYnNQYXRoLCBjb3B5UGF0aCwgdGVtcFBhdGgsIGRvd25sb2FkU3RhdGV9KTtcbiAgcmV0dXJuIHtyZWxQYXRoOiBgJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gLCBhYnNQYXRoLCBjb3B5UGF0aCwgdGVtcFBhdGgsIGRvd25sb2FkU3RhdGV9O1xufTtcblxuY29uc3Qgc2F2ZVRleHREb3dubG9hZCA9IGFzeW5jIChcbiAgdGV4dDogc3RyaW5nLFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgbWltZTogc3RyaW5nLFxuICBzdWJkaXIgPSAnZXhwb3J0cycsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICByZXR1cm4gc2F2ZURvd25sb2FkKGJsb2IsIHdvcmtzcGFjZSwgZmlsZW5hbWUsIHN1YmRpcik7XG59O1xuXG5jb25zdCBzYXZlQnl0ZXNEb3dubG9hZCA9IGFzeW5jIChcbiAgYnl0ZXM6IFVpbnQ4QXJyYXksXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBtaW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdleHBvcnRzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYnl0ZXMgYXMgdW5rbm93biBhcyBCbG9iUGFydF0sIHt0eXBlOiBtaW1lfSk7XG4gIHJldHVybiBzYXZlRG93bmxvYWQoYmxvYiwgd29ya3NwYWNlLCBmaWxlbmFtZSwgc3ViZGlyKTtcbn07XG5cbi8vIOKUgOKUgOKUgCBTZXJ2aWNlIHJlcXVlc3RzICsgcmVsYXkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZzogUGdFbnZlbG9wZTxBbnlNZXNzYWdlPiB8IGFueSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKCFtc2cgfHwgbXNnLl9fcGcgIT09IHRydWUpIHJldHVybiBmYWxzZTtcblxuICBpZiAobXNnLmtpbmQgPT09ICdjYXB0dXJlLXNjcmVlbnNob3QnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IG1zZy50YWJJZCA/IFthd2FpdCBjaHJvbWUudGFicy5nZXQobXNnLnRhYklkKV1cbiAgICAgICAgICA6IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgY29uc3QgdGFiID0gdGFic1swXTtcbiAgICAgICAgaWYgKCF0YWI/LndpbmRvd0lkKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6ICdubyBhY3RpdmUgdGFiJ30pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHRhYi53aW5kb3dJZCwge2Zvcm1hdDogJ3BuZyd9KTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtkYXRhVXJsfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZy5raW5kID09PSAnc3dpdGNoLXRvLXRhYicpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe3VybDogbXNnLnVybH0pO1xuICAgICAgICBpZiAodGFicy5sZW5ndGggJiYgdGFic1swXT8uaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGF3YWl0IGNocm9tZS50YWJzLnVwZGF0ZSh0YWJzWzBdLmlkLCB7YWN0aXZlOiB0cnVlfSk7XG4gICAgICAgICAgaWYgKHRhYnNbMF0ud2luZG93SWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLndpbmRvd3MudXBkYXRlKHRhYnNbMF0ud2luZG93SWQsIHtmb2N1c2VkOiB0cnVlfSk7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtmb3VuZDogdHJ1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5vcGVuSWZNaXNzaW5nKSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsOiBtc2cudXJsLCBhY3RpdmU6IHRydWV9KTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiBmYWxzZSwgb3BlbmVkOiB0LmlkfSk7XG4gICAgICAgIH0gZWxzZSBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiBmYWxzZX0pO1xuICAgICAgfSBjYXRjaCAoZSkgeyBzZW5kUmVzcG9uc2Uoe2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7IH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2cua2luZCA9PT0gJ2xpc3Qtb3Blbi10YWJzJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7dGFiczogdGFicy5maWx0ZXIoKHQpID0+IHQudXJsKS5tYXAoKHQpID0+ICh7aWQ6IHQuaWQsIHVybDogdC51cmwsIHRpdGxlOiB0LnRpdGxlfSkpfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHRhYnM6IFtdfSk7IH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKG1zZy5raW5kID09PSAnc2hvdC1lbGVtZW50JyB8fCBtc2cua2luZCA9PT0gJ3Nob3QtZ3JvdXAnIHx8IG1zZy5raW5kID09PSAnc2hvdC1wYWdlJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYklkID0gbXNnLnRhYklkID8/IHNlbmRlci50YWI/LmlkO1xuICAgICAgICBsZXQgcmVzb2x2ZWRUYWJJZCA9IHRhYklkO1xuICAgICAgICBsZXQgd2luZG93SWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgICAgcmVzb2x2ZWRUYWJJZCA9IHRhYnNbMF0/LmlkO1xuICAgICAgICAgIHdpbmRvd0lkID0gdGFic1swXT8ud2luZG93SWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmdldChyZXNvbHZlZFRhYklkKTtcbiAgICAgICAgICB3aW5kb3dJZCA9IHQ/LndpbmRvd0lkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNvbHZlZFRhYklkID09IG51bGwgfHwgd2luZG93SWQgPT0gbnVsbCkge1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSBzYXRpc2ZpZXMgU2hvdFJlcGx5KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFiSWRGaW5hbCA9IHJlc29sdmVkVGFiSWQ7XG4gICAgICAgIGNvbnN0IHdpbmRvd0lkRmluYWwgPSB3aW5kb3dJZDtcbiAgICAgICAgYXdhaXQgZW5xdWV1ZSh0YWJJZEZpbmFsLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgcnVuU2hvdChtc2csIHRhYklkRmluYWwsIHdpbmRvd0lkRmluYWwpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHJlcGx5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IHNhdGlzZmllcyBTaG90UmVwbHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gc2F0aXNmaWVzIFNob3RSZXBseSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIEZ1bGwtcGFnZSBzbmFwc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gUmV1c2VzIHRoZSBzYW1lXG4gIC8vIGhpZGUtb3ZlcmxheXMg4oaSIHN0aXRjaCDihpIgcmVzdG9yZSBwYXRoIGFzIHNob3QtcGFnZSwgYnV0IHJldHVybnMgdGhlIFBOR1xuICAvLyBhcyBhIGRhdGEgVVJMIGluc3RlYWQgb2Ygd3JpdGluZyBhIGZpbGUuIFNlcmlhbGl6ZWQgcGVyIHRhYiB0aHJvdWdoIHRoZVxuICAvLyBzYW1lIHF1ZXVlIHNvIGl0IGNhbid0IHJhY2UgYSBjb25jdXJyZW50IGVsZW1lbnQvZ3JvdXAgY2FwdHVyZS5cbiAgaWYgKG1zZy5raW5kID09PSAncGFnZS1zbmFwc2hvdC1zaG90Jykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYklkID0gbXNnLnRhYklkID8/IHNlbmRlci50YWI/LmlkO1xuICAgICAgICBsZXQgcmVzb2x2ZWRUYWJJZCA9IHRhYklkO1xuICAgICAgICBsZXQgd2luZG93SWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgICAgcmVzb2x2ZWRUYWJJZCA9IHRhYnNbMF0/LmlkO1xuICAgICAgICAgIHdpbmRvd0lkID0gdGFic1swXT8ud2luZG93SWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmdldChyZXNvbHZlZFRhYklkKTtcbiAgICAgICAgICB3aW5kb3dJZCA9IHQ/LndpbmRvd0lkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNvbHZlZFRhYklkID09IG51bGwgfHwgd2luZG93SWQgPT0gbnVsbCkge1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRhYklkRmluYWwgPSByZXNvbHZlZFRhYklkO1xuICAgICAgICBjb25zdCB3aW5kb3dJZEZpbmFsID0gd2luZG93SWQ7XG4gICAgICAgIGF3YWl0IGVucXVldWUodGFiSWRGaW5hbCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBnb3QgPSBhd2FpdCBzaG90UGFnZUNvbW1vbih0YWJJZEZpbmFsLCB3aW5kb3dJZEZpbmFsKTtcbiAgICAgICAgICAgIGlmICghZ290KSB7IHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ30pOyByZXR1cm47IH1cbiAgICAgICAgICAgIGNvbnN0IHNjcmVlbnNob3QgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgICAgICAgICBnb3QuYml0bWFwLmNsb3NlPy4oKTtcbiAgICAgICAgICAgIC8vIGB0cnVuY2F0ZWRgIGhlcmUgbWVhbnMgdGhlIHN0aXRjaCBzdG9wcGVkIGVhcmx5IChjaHVuay9waXhlbFxuICAgICAgICAgICAgLy8gY2FwKSDigJQgdGhlIFBORyBjb3ZlcnMgb25seSBwYXJ0IG9mIHRoZSBkb2N1bWVudCwgd2hpY2ggaXNcbiAgICAgICAgICAgIC8vIGV4YWN0bHkgdGhlIGBwYXJ0aWFsYCBzaWduYWwgdGhlIFBhZ2VTbmFwc2hvdCBjb250cmFjdCB3YW50cy5cbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IHRydWUsIHNjcmVlbnNob3QsIHBhcnRpYWw6IGdvdC50cnVuY2F0ZWR9KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gUGFuZWwtdHJpZ2dlcmVkIGNvbnRlbnQtc2NyaXB0IChyZSlpbmplY3Rpb24g4oCUIHRoZSByZWNvdmVyeSBwYXRoIGZvclxuICAvLyBcIkFsdCBzdG9wcGVkIHdvcmtpbmdcIiAoZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5lZCB0aGUgcGFnZSdzIHNjcmlwdCkuXG4gIGlmIChtc2cua2luZCA9PT0gJ3BnLXJlaW5qZWN0Jykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCB0YWJJZDogbnVtYmVyIHwgdW5kZWZpbmVkID0gbXNnLnRhYklkO1xuICAgICAgICBpZiAodGFiSWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgICAgdGFiSWQgPSB0YWJzWzBdPy5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFiSWQgPT0gbnVsbCkgeyBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6ICdubyBhY3RpdmUgdGFiJ30pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgdGFiID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHRhYklkKTtcbiAgICAgICAgaWYgKHRhYi51cmwgJiYgIS9eaHR0cHM/Oi8udGVzdCh0YWIudXJsKSkge1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogYGNhbm5vdCBhdHRhY2ggdG8gJHt0YWIudXJsfWB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHt0YXJnZXQ6IHt0YWJJZCwgYWxsRnJhbWVzOiBmYWxzZX0sIGZpbGVzOiBbJ2NvbnRlbnQtc2NyaXB0LmpzJ10sIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IHRyYWNrQWN0aXZlVGFiKHRhYklkKTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogdHJ1ZSwgdGFiSWR9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChtc2cua2luZCA9PT0gJ3NhdmUtdGV4dCcgfHwgbXNnLmtpbmQgPT09ICdzYXZlLWJ5dGVzJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBzdG9yZWQ6IFNhdmVkRmlsZTtcbiAgICAgICAgY29uc3Qgd29ya3NwYWNlID0gU3RyaW5nKG1zZy53b3Jrc3BhY2UgPz8gJ2RlZmF1bHQnKTtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBTdHJpbmcobXNnLmZpbGVuYW1lID8/ICdleHBvcnQuYmluJyk7XG4gICAgICAgIGNvbnN0IG1pbWUgPSBTdHJpbmcobXNnLm1pbWUgPz8gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpO1xuICAgICAgICBjb25zdCBzdWJkaXIgPSBTdHJpbmcobXNnLnN1YmRpciA/PyAnZXhwb3J0cycpO1xuICAgICAgICBpZiAobXNnLmtpbmQgPT09ICdzYXZlLXRleHQnKSB7XG4gICAgICAgICAgc3RvcmVkID0gYXdhaXQgc2F2ZVRleHREb3dubG9hZChTdHJpbmcobXNnLnRleHQgPz8gJycpLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBtaW1lLCBzdWJkaXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERlZmVuc2l2ZSBkZWNvZGU6IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGNhbiBkZWxpdmVyIGJ5dGVzXG4gICAgICAgICAgLy8gYXMgYSBVaW50OEFycmF5LCBhIG51bWJlcltdLCBvciBhIGdlbmVyaWMgaW5kZXhlZCBvYmplY3RcbiAgICAgICAgICAvLyAoZGVwZW5kaW5nIG9uIENocm9tZSB2ZXJzaW9uICsgY2FsbGVyKS4gQWNjZXB0IGFsbCBzaGFwZXMuXG4gICAgICAgICAgY29uc3QgcmF3OiBhbnkgPSBtc2cuYnl0ZXM7XG4gICAgICAgICAgbGV0IGJ5dGVzOiBVaW50OEFycmF5O1xuICAgICAgICAgIGlmIChyYXcgaW5zdGFuY2VvZiBVaW50OEFycmF5KSBieXRlcyA9IHJhdztcbiAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJhdykpIGJ5dGVzID0gVWludDhBcnJheS5mcm9tKHJhdyk7XG4gICAgICAgICAgZWxzZSBpZiAocmF3ICYmIHR5cGVvZiByYXcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyhyYXcpIGFzIG51bWJlcltdO1xuICAgICAgICAgICAgYnl0ZXMgPSBVaW50OEFycmF5LmZyb20odmFscyk7XG4gICAgICAgICAgfSBlbHNlIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlLWJ5dGVzIGRlY29kZWQnLCB7Ynl0ZXM6IGJ5dGVzLmxlbmd0aCwgcmF3VHlwZTogdHlwZW9mIHJhdywgaXNBcnJheTogQXJyYXkuaXNBcnJheShyYXcpLCBpc1U4OiByYXcgaW5zdGFuY2VvZiBVaW50OEFycmF5fSk7XG4gICAgICAgICAgc3RvcmVkID0gYXdhaXQgc2F2ZUJ5dGVzRG93bmxvYWQoYnl0ZXMsIHdvcmtzcGFjZSwgZmlsZW5hbWUsIG1pbWUsIHN1YmRpcik7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgICAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBBdXRvLW9wZW4gdGhlIHNpZGUgcGFuZWwgb24gZmlyc3QgY2FwdHVyZS9zdGFnaW5nLiBDaHJvbWUgMTE2KyBwcm9wYWdhdGVzXG4gIC8vIHRoZSB1c2VyIGFjdGl2YXRpb24gdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBzbyB0aGlzIGRvZXNuJ3RcbiAgLy8gdGhyb3cg4oCUIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgY2FwdHVyZSBpbiB0aGUgY29udGVudCBzY3JpcHQgaXNcbiAgLy8gc3RpbGwgY29uc2lkZXJlZCBcImxpdmVcIiBoZXJlIGluIHRoZSB3b3JrZXIuXG4gIC8vXG4gIC8vIElOVkVTVElHQVRFLTEgKGZpcnN0LWNhcHR1cmUgcmFjZSk6IG9uIHRoZSBWRVJZIEZJUlNUIEFsdCtDbGljayB0aGUgcGFuZWxcbiAgLy8gZG9jdW1lbnQgZG9lc24ndCBleGlzdCB5ZXQsIHNvIGl0cyBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UgbGlzdGVuZXIgaXNuJ3RcbiAgLy8gcmVnaXN0ZXJlZC4gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugb25seSByZWFjaGVzIGxpc3RlbmVycyB0aGF0IGFyZVxuICAvLyBhbHJlYWR5IGxpdmUsIHNvIHRoaXMgZmlyc3QgY2FwdHVyZSBpcyBkcm9wcGVkIOKAlCB0aGUgdXNlciBoYXMgdG8gY2xpY2sgYVxuICAvLyBzZWNvbmQgdGltZSAocGFuZWwgbm93IGxpc3RlbmluZykgdG8gc2VlIGl0LiBUaGUgcm9idXN0IGZpeCBpcyBhIHBhbmVs4oaSYmdcbiAgLy8gXCJwYW5lbC1yZWFkeSwgc2VuZCBtZSBhbnl0aGluZyBwZW5kaW5nXCIgaGFuZHNoYWtlLCBidXQgdGhhdCBuZWVkcyBhXG4gIC8vIHNpZGVwYW5lbC50cyBjaGFuZ2UgKHJlcG9ydGVkIHNlcGFyYXRlbHkpLiBBcyBhIGJhY2tncm91bmQtb25seSwgbG93LXJpc2tcbiAgLy8gbWl0aWdhdGlvbiB3ZSByZS1icm9hZGNhc3QgdGhlIGZpcnN0IGNhcHR1cmUocykgYSBmZXcgdGltZXMgb3ZlciBhIHNob3J0XG4gIC8vIHdpbmRvdyBBRlRFUiBvcGVuaW5nIHRoZSBwYW5lbC4gVGhlIHBhbmVsIHJlZ2lzdGVycyBpdHMgb25NZXNzYWdlIGxpc3RlbmVyXG4gIC8vIHN5bmNocm9ub3VzbHkgYXQgc2NyaXB0LWV2YWwgKGJlZm9yZSBpdHMgYXN5bmMgbG9hZEFsbCksIGFuZCBpdCBhbHJlYWR5XG4gIC8vIGJ1ZmZlcnMgbWVzc2FnZXMgdW50aWwgcmVhZHkgQU5EIGRlZHVwZXMgYnkgX19taWQg4oCUIHNvIGEgcmVwbGF5IHRoYXQgbGFuZHNcbiAgLy8gYWZ0ZXIgdGhlIGxpc3RlbmVyIGV4aXN0cyBpcyBwcm9jZXNzZWQgZXhhY3RseSBvbmNlLCBhbmQgcmVwbGF5cyB0aGF0IGxvc2VcbiAgLy8gdGhlIHJhY2UgYXJlIGhhcm1sZXNzIG5vLW9wcy5cbiAgLy9cbiAgLy8gV2UgZ3VhcmQgb24gYHNlbmRlci50YWI/LmlkICE9IG51bGxgIHNvIG91ciBPV04gcmVwbGF5cyAod2hpY2ggaGF2ZSBub1xuICAvLyBzZW5kZXIudGFiKSBuZXZlciByZS1lbnRlciB0aGlzIGJyYW5jaCDigJQgbm8gb3Blbi9yZXBsYXkgbG9vcC5cbiAgaWYgKChtc2cua2luZCA9PT0gJ2NhcHR1cmUnIHx8IG1zZy5raW5kID09PSAncGVuZGluZy1hZGQnKSAmJiBzZW5kZXIudGFiPy5pZCAhPSBudWxsKSB7XG4gICAgY2hyb21lLnNpZGVQYW5lbC5vcGVuKHt0YWJJZDogc2VuZGVyLnRhYi5pZH0pLmNhdGNoKCgpID0+IHsgLyogYWxyZWFkeSBvcGVuICovIH0pO1xuICAgIC8vIEFsd2F5cyByZXBsYXkg4oCUIHdlIGNhbid0IHJlbGlhYmx5IHRlbGwgZnJvbSBoZXJlIHdoZXRoZXIgdGhlIHBhbmVsIHdhc1xuICAgIC8vIGFscmVhZHkgbGlzdGVuaW5nIChzaWRlUGFuZWwgaGFzIG5vIFwiaXMtb3BlblwiIEFQSSwgYW5kIG9wZW4oKSByZXNvbHZpbmdcbiAgICAvLyB2cyByZWplY3RpbmcgaXMgbm90IGEgY2xlYW4gc2lnbmFsIGFjcm9zcyBDaHJvbWUgdmVyc2lvbnMgLyBnZXN0dXJlXG4gICAgLy8gc3RhdGVzKS4gT3Zlci1yZXBsYXlpbmcgd2hlbiB0aGUgcGFuZWwgaXMgYWxyZWFkeSB1cCBpcyBoYXJtbGVzczogdGhlXG4gICAgLy8gcGFuZWwgZGVkdXBlcyBieSBfX21pZCwgc28gdGhlIHJlZHVuZGFudCBicm9hZGNhc3RzIGNvbGxhcHNlIHRvIG5vdGhpbmcuXG4gICAgLy8gVW5kZXItcmVwbGF5aW5nIHdvdWxkIHJlc3VycmVjdCB0aGUgZHJvcHBlZC1maXJzdC1jYXB0dXJlIGJ1Zywgc28gd2UgZXJyXG4gICAgLy8gdG93YXJkIGFsd2F5cyByZXBsYXlpbmcuIFRoZSB3aW5kb3cgaXMgc2hvcnQgYW5kIGJvdW5kZWQgKDMgc2VuZHMpLlxuICAgIHJlcGxheUZpcnN0Q2FwdHVyZShtc2cgYXMgUGdFbnZlbG9wZTxBbnlNZXNzYWdlPik7XG4gIH1cblxuICAvLyBObyBwb3J0IHJlbGF5OiB0aGUgc2lkZSBwYW5lbCBsaXN0ZW5zIGRpcmVjdGx5IG9uIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZSxcbiAgLy8gd2hpY2ggYWxyZWFkeSByZWNlaXZlcyBicm9hZGNhc3RzIGZyb20gY29udGVudCBzY3JpcHRzLiBSZWxheWluZyB0aHJvdWdoXG4gIC8vIGEgcG9ydCBjYXVzZXMgZXZlcnkgbWVzc2FnZSB0byBiZSBkZWxpdmVyZWQgdHdpY2Ug4oCUIHRoYXQgc3VyZmFjZWQgYXNcbiAgLy8gZHVwbGljYXRlZCBtdWx0aS1zZWxlY3QgZW50cmllcyBpbiBwcm9kdWN0aW9uLlxuICByZXR1cm4gZmFsc2U7XG59KTtcblxuLy8gUmUtYnJvYWRjYXN0IGEgY2FwdHVyZS9wZW5kaW5nLWFkZCBlbnZlbG9wZSBhIGZldyB0aW1lcyBvdmVyIGEgc2hvcnQgd2luZG93XG4vLyBzbyBhIGZyZXNobHktb3BlbmVkIHNpZGUgcGFuZWwgKHdob3NlIGxpc3RlbmVyIHJlZ2lzdGVycyBhIGZldyBtcyBhZnRlciB0aGVcbi8vIGRvY3VtZW50IHN0YXJ0cyBsb2FkaW5nKSBjYXRjaGVzIGl0LiBTYW1lIF9fbWlkIGVhY2ggdGltZSDihpIgdGhlIHBhbmVsJ3Ncbi8vIHJlY2VudE1pZHMgcmluZyBkZWR1cGVzIHRvIGEgc2luZ2xlIHByb2Nlc3NlZCBtZXNzYWdlLiBCb3VuZGVkIChubyBsb29wKTpcbi8vIHRocmVlIGF0dGVtcHRzIGluc2lkZSB+NDUwbXMsIHRoZW4gd2Ugc3RvcC4gUmVzZW5kaW5nIHRoZSBTQU1FIGVudmVsb3BlIGlzXG4vLyBpbXBvcnRhbnQg4oCUIGEgbmV3IF9fbWlkIHdvdWxkIGRlZmVhdCB0aGUgZGVkdXAgYW5kIGRvdWJsZS1pbnNlcnQuXG5jb25zdCBSRVBMQVlfREVMQVlTX01TID0gWzYwLCAxODAsIDQ1MF07XG5jb25zdCByZXBsYXlGaXJzdENhcHR1cmUgPSAoZW52ZWxvcGU6IFBnRW52ZWxvcGU8QW55TWVzc2FnZT4pOiB2b2lkID0+IHtcbiAgZm9yIChjb25zdCBkZWxheSBvZiBSRVBMQVlfREVMQVlTX01TKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBzZW5kTWVzc2FnZSB3aXRoIG5vIGNhbGxiYWNrOyB0aGUgcGFuZWwgY29uc3VtZXMgaXQuIFdyYXBwZWQgc28gYVxuICAgICAgLy8gXCJyZWNlaXZpbmcgZW5kIGRvZXMgbm90IGV4aXN0XCIgcmVqZWN0aW9uIChwYW5lbCBzdGlsbCBub3QgdXAgb24gdGhlXG4gICAgICAvLyBlYXJsaWVzdCBhdHRlbXB0KSBpcyBzd2FsbG93ZWQgcmF0aGVyIHRoYW4gbG9nZ2VkIGFzIGFuIGVycm9yLlxuICAgICAgdHJ5IHsgdm9pZCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShlbnZlbG9wZSkuY2F0Y2g/LigoKSA9PiB7IC8qIG5vdCB1cCB5ZXQgKi8gfSk7IH1cbiAgICAgIGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LCBkZWxheSk7XG4gIH1cbn07XG5cbi8vIEVuY29kZSBhIFBORyBibG9iIGludG8gYSBiYXNlNjQgZGF0YSBVUkwgdXNpbmcgdGhlIHNhbWUgY2h1bmtlZC1idG9hXG4vLyBwYXRoIHNhdmVEb3dubG9hZCB1c2VzLiBUaGUgcmVzdWx0IGlzIHR3byBwdXJwb3Nlcy1pbi1vbmU6IHRoZVxuLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgZ29lcyBiYWNrIHRvIHRoZSBzaWRlIHBhbmVsJ3MgcHJldmlldyB0aWxlIChzbWFsbCxcbi8vIH41LTE1IEtCKSwgd2hpbGUgdGhlIEZVTEwgcG5nIGFsc28gcmlkZXMgYmFjayBzbyB0aGUgcGFuZWwgY2FuIHN0YXNoIGl0XG4vLyBpbiBgc2hvdHNGdWxsYCBhbmQgYnVuZGxlIGl0IGludG8gdGhlIHdvcmtzcGFjZSAudGFyLnpzdCBleHBvcnQgbGF0ZXIuXG5jb25zdCBibG9iVG9GdWxsRGF0YVVybCA9IGFzeW5jIChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG5jb25zdCBydW5TaG90ID0gYXN5bmMgKG1zZzogYW55LCB0YWJJZDogbnVtYmVyLCB3aW5kb3dJZDogbnVtYmVyKTogUHJvbWlzZTxTaG90UmVwbHk+ID0+IHtcbiAgY29uc3QgdHMgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIGNvbnN0IHBhZGRpbmcgPSB0eXBlb2YgbXNnLnBhZGRpbmcgPT09ICdudW1iZXInID8gbXNnLnBhZGRpbmcgOiAyNDtcbiAgaWYgKG1zZy5raW5kID09PSAnc2hvdC1lbGVtZW50Jykge1xuICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RFbGVtZW50Q29tbW9uKHRhYklkLCB3aW5kb3dJZCwgW21zZy5zZWxlY3Rvcl0sIHBhZGRpbmcpO1xuICAgIGlmICghZ290KSByZXR1cm4ge29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9O1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRGaWxlbmFtZSgnZWxlbWVudCcsIHRzLCBtc2cubiwgZ290LnRhYlVybCk7XG4gICAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gICAgY29uc3QgZnVsbERhdGFVcmwgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCxcbiAgICAgIGNyb3A6IGdvdC5jcm9wTWV0YSxcbiAgICB9O1xuICB9XG4gIGlmIChtc2cua2luZCA9PT0gJ3Nob3QtZ3JvdXAnKSB7XG4gICAgY29uc3QgZ290ID0gYXdhaXQgc2hvdEVsZW1lbnRDb21tb24odGFiSWQsIHdpbmRvd0lkLCBtc2cuc2VsZWN0b3JzLCBwYWRkaW5nKTtcbiAgICBpZiAoIWdvdCkgcmV0dXJuIHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ2dyb3VwJywgdHMsIG1zZy5uLCBnb3QudGFiVXJsLCB7Y291bnQ6IG1zZy5zZWxlY3RvcnMubGVuZ3RofSk7XG4gICAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gICAgY29uc3QgZnVsbERhdGFVcmwgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCxcbiAgICAgIGNyb3A6IGdvdC5jcm9wTWV0YSxcbiAgICB9O1xuICB9XG4gIC8vIHBhZ2VcbiAgY29uc3QgZ290ID0gYXdhaXQgc2hvdFBhZ2VDb21tb24odGFiSWQsIHdpbmRvd0lkKTtcbiAgaWYgKCFnb3QpIHJldHVybiB7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ307XG4gIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRGaWxlbmFtZSgncGFnZScsIHRzLCBtc2cubiwgZ290LnRhYlVybCwge3RydW5jYXRlZDogZ290LnRydW5jYXRlZH0pO1xuICBjb25zdCBzdG9yZWQgPSBhd2FpdCBzYXZlRG93bmxvYWQoZ290LmJsb2IsIG1zZy53b3Jrc3BhY2UsIGZpbGVuYW1lKTtcbiAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICBnb3QuYml0bWFwLmNsb3NlPy4oKTtcbiAgcmV0dXJuIHtcbiAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCwgdHJ1bmNhdGVkOiBnb3QudHJ1bmNhdGVkLFxuICB9O1xufTtcblxuLy8gKHNhdmUtdGV4dCAvIHNhdmUtYnl0ZXMgYXJlIGZvbGRlZCBpbnRvIHRoZSBzaW5nbGUgbGlzdGVuZXIgYWJvdmUuKVxuIgogIF0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNG9CQSxJQUFJLGNBQWM7QUFBQSxFQUNsQixJQUFNLFNBQVMsTUFBYztBQUFBLElBQzNCLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsYUFBYSxTQUFTLEVBQUU7QUFBQSxJQUN4RSxJQUFJO0FBQUEsTUFDRixNQUFNLFFBQVEsSUFBSSxXQUFXLENBQUM7QUFBQSxNQUM5QixXQUFXLE9BQU8sZ0JBQWdCLEtBQUs7QUFBQSxNQUN2QyxPQUFPLEdBQUcsVUFBVSxNQUFNLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxF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
