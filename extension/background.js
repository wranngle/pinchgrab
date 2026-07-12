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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9iYWNrZ3JvdW5kLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIFNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2wgYmV0d2VlbiBjb250ZW50IHNjcmlwdCwgc2lkZSBwYW5lbCwgYW5kXG4vLyBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyLlxuXG5leHBvcnQgdHlwZSBSZWN0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG5leHBvcnQgdHlwZSBWaWV3cG9ydCA9IHtcbiAgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyO1xuICAvLyBVc2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgYXQgY2FwdHVyZSB0aW1lLiBMZXRzIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhc29uIGFib3V0IHdoeSBjYXB0dXJlZCBhcHBlYXJhbmNlIGRpZmZlcnMgYmV0d2VlbiBzZXNzaW9uc1xuICAvLyAoZS5nLiBkYXJrLW1vZGUgdnMgbGlnaHQtbW9kZSBvZiB0aGUgc2FtZSBjb21wb25lbnQpLlxuICBjb2xvclNjaGVtZT86ICdkYXJrJyB8ICdsaWdodCc7XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICAvLyBEb2N1bWVudCBkaXJlY3Rpb24gKGBsdHJgIC8gYHJ0bGApIOKAlCBkaWZmZXJlbnQgZnJvbSB2aWV3cG9ydCBzaXplLFxuICAvLyBjaGFuZ2VzIHRoZSBtZWFuaW5nIG9mIGBzdGFydGAvYGVuZGAgaW4gQ1NTIGFuZCB0aGUgc2Vuc2Ugb2ZcbiAgLy8gYHJlY3QueGAuIENhcHR1cmVkIHBlciBwYWdlIGhlYWRlciBzbyBSVEwgY2FwdHVyZXMgZG9uJ3QgZ2V0XG4gIC8vIHNpbGVudGx5IG1peGVkIHdpdGggTFRSIG9uZXMuXG4gIGRpcmVjdGlvbj86ICdsdHInIHwgJ3J0bCc7XG4gIC8vIEJyb3dzZXIgem9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCByZXBvcnRzIHRoZSBwaW5jaC16b29tXG4gIC8vIGZhY3RvcjsgdmFsdWVzICE9IDEgbWVhbiB0aGUgdXNlciBoYXMgem9vbWVkIGluL291dCBhbmQgYW55IGxheW91dFxuICAvLyBidWcgdGhleSdyZSBjYXB0dXJpbmcgbWF5IG5vdCByZXBybyBhdCBkZWZhdWx0IHpvb20uXG4gIHpvb20/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGcmFtZXdvcmtJbmZvID0ge1xuICBmcmFtZXdvcms6ICdyZWFjdCcgfCAndnVlJyB8ICdsaXQnIHwgJ3N0ZW5jaWwnIHwgJ3N2ZWx0ZScgfCAnd2ViLWNvbXBvbmVudCc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuICBzb3VyY2U/OiB7ZmlsZT86IHN0cmluZyB8IG51bGw7IGxpbmU/OiBudW1iZXIgfCBudWxsfTtcbiAgLy8gVXAtdHJlZSBjb21wb25lbnQgYW5jZXN0cnkgKGlubmVybW9zdCBmaXJzdCkuIEZvciBSZWFjdCwgd2Fsa2VkIHZpYVxuICAvLyBmaWJlciBgcmV0dXJuYCBjaGFpbjsgZm9yIFZ1ZSwgdmlhIGBfX3Z1ZVBhcmVudENvbXBvbmVudC5wYXJlbnRgLlxuICAvLyBUaGUgY29tcG9uZW50IG5hbWUgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoaWNoIGZpbGUgb3ducyB0aGVcbiAgLy8gcmVuZGVyaW5nIOKAlCB0aGUgY2hhaW4gaGVscHMgaXQgZ3JlcCB1cHdhcmQgdG8gZmluZCB0aGUgcm91dGVcbiAgLy8gY29tcG9uZW50LCB0aGVuIGRyaWxsIGludG8gdGhlIG93bmluZyBmaWxlLlxuICBjaGFpbj86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5jZXN0b3IgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBNYXRjaGVkUnVsZSA9IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgZGVjbGFyYXRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWVkaWE/OiBzdHJpbmc7XG4gIC8vIFdhcyB0aGUgQG1lZGlhIHF1ZXJ5IHRoYXQgd3JhcHMgdGhpcyBydWxlIGFjdHVhbGx5IG1hdGNoZWQgYXRcbiAgLy8gY2FwdHVyZSB0aW1lPyBgdHJ1ZWAgPSBhY3RpdmUsXG4gIC8vIGBmYWxzZWAgPSBtYXRjaGVkIHRoZSBzZWxlY3RvciBidXQgaW5hY3RpdmUgKGUuZy4gbW9iaWxlIHJ1bGVzXG4gIC8vIGNhcHR1cmVkIG9uIGEgZGVza3RvcCB2aWV3cG9ydCksIGB1bmRlZmluZWRgID0gbWF0Y2hNZWRpYSB0aHJldy5cbiAgbWVkaWFBY3RpdmU/OiBib29sZWFuO1xufTtcblxuLy8gU3ludGhldGljIGhpbnRzIFBpbmNoR3JhYiBhZGRzIHRvIGVudHJpZXMg4oCUIGtlcHQgZGlzdGluY3QgZnJvbSBgYXR0cnNgXG4vLyAocmVhbCBET00gYXR0cmlidXRlcykgc28gY29uc3VtZXJzIGNhbiB0ZWxsIHdoYXQgY2FtZSBmcm9tIHRoZSBwYWdlIHZzXG4vLyB3aGF0IHRoZSBjYXB0dXJlIHBpcGVsaW5lIGluamVjdGVkLlxuZXhwb3J0IHR5cGUgRW50cnlIaW50cyA9IHtcbiAgZm9ybWF0Pzogc3RyaW5nOyAgICAgLy8gaW5wdXQgZm9ybWF0IGhpbnQgKGUuZy4gJ1lZWVktTU0tREQnKVxuICB2YWx1ZU1hc2tlZD86IGJvb2xlYW47IC8vIHBhc3N3b3JkIHZhbHVlIHdhcyBtYXNrZWQgYXQgY2FwdHVyZSB0aW1lXG59O1xuXG5leHBvcnQgdHlwZSBFbnRyeSA9IHtcbiAgLy8gU3RhYmxlIHBlci1lbnRyeSB1dWlkLiBHZW5lcmF0ZWQgYXQgY2FwdHVyZSB0aW1lLiBEaXN0aW5jdCBmcm9tIGBuYFxuICAvLyAoZGlzcGxheSBzZXF1ZW5jZSkgYW5kIGZyb20gYGlkYCAoRE9NIGh0bWwgaWQgYXR0cmlidXRlKS4gRm9yZWlnbi1rZXlcbiAgLy8gdGFyZ2V0IGZvciBGZWVkYmFja01lc3NhZ2UucGFyZW50SWQuXG4gIHVpZDogc3RyaW5nO1xuICAvLyBGb3JlaWduIGtleSBpbnRvIHRoZSBzZXNzaW9uIHJvdyAoUGFnZU1lc3NhZ2Uuc2Vzc2lvbklkKS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIGxpbmsgY2FwdHVyZXMgYmFjayB0byBcIndoaWNoIHBhZ2UtbG9hZCBjb250ZXh0IGRpZCB0aGV5XG4gIC8vIGNvbWUgZnJvbT9cIiB3aXRob3V0IGRlcGVuZGluZyBvbiBVUkwgc3RyaW5nIGVxdWFsaXR5LCB3aGljaCBicmVha3NcbiAgLy8gb24gaGFzaCBuYXZpZ2F0aW9uLCBxdWVyeS1wYXJhbSBzd2FwcywgYW5kIFNQQSByb3V0aW5nLiBTZXQgYnkgdGhlXG4gIC8vIHNpZGUgcGFuZWwgYXQgbWVzc2FnZS1yZWNlaXZlIHRpbWUsIG5vdCBvbiB0aGUgcGFnZSBzaWRlLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG4gIG46IG51bWJlcjtcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBvdXRlckhUTUw/OiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIC8vIFRoZSB2aXN1YWxseS1yZW5kZXJlZCBmb3JtIHdoZW4gQ1NTIGB0ZXh0LXRyYW5zZm9ybWAgaXMgc2V0LiBDYXB0dXJlZFxuICAvLyBhbG9uZ3NpZGUgYHRleHRgICh3aGljaCBpcyB0aGUgc291cmNlLXRydXRoIGB0ZXh0Q29udGVudGApIHNvIGFuIExMTVxuICAvLyBjYW4gZGlzYW1iaWd1YXRlIGJldHdlZW4gZS5nLiBzb3VyY2UgYFJlZnJlc2hgIGFuZCByZW5kZXJlZCBgUkVGUkVTSGBcbiAgLy8gd2l0aG91dCBmYWxzZS1ncmVwcGluZyBhZ2FpbnN0IGVpdGhlci5cbiAgcmVuZGVyZWRUZXh0Pzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICBhY2Nlc3NpYmxlTmFtZT86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7ICAgICAgICAgICAgLy8gdGhlIERPTSBodG1sIGlkIGF0dHJpYnV0ZSAodW5jaGFuZ2VkKVxuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbiAgYXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyByZWFsIERPTSBhdHRyaWJ1dGVzIG9ubHlcbiAgaGludHM/OiBFbnRyeUhpbnRzOyAgICAgLy8gc3ludGhldGljIGNhcHR1cmUtdGltZSBoaW50c1xuICByZWN0OiBSZWN0O1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIGluU2hhZG93RE9NPzogYm9vbGVhbjtcbiAgLy8gQ1NTIHNlbGVjdG9yIGZvciB0aGUgc2hhZG93IGhvc3Qgd2hlbiBgaW5TaGFkb3dET01gIGlzIHRydWUuIExldHMgYVxuICAvLyBjb25zdW1lciAob3IgdGhlIHBhbmVsJ3MgcmUtdmFsaWRhdGlvbiBwYXNzKSBmaW5kIHRoZSBob3N0IGVsZW1lbnRcbiAgLy8gc2luY2UgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyByb290cy5cbiAgc2hhZG93SG9zdD86IHN0cmluZztcbiAgY29tcG9uZW50Um9vdD86IHN0cmluZztcbiAgYW5jZXN0b3JzPzogQW5jZXN0b3JbXTtcbiAgY29tcG9uZW50PzogRnJhbWV3b3JrSW5mbztcbiAgLy8gUmVhY3QgZXZlbnQgaGFuZGxlciBuYW1lcyBwcm9iZWQgZnJvbSBgX19yZWFjdFByb3BzJDxrZXk+YCDigJQgYW5zd2Vyc1xuICAvLyBcIndoaWNoIGhhbmRsZXIgZmlyZXMgd2hlbiB0aGlzIGlzIGNsaWNrZWQ/XCIgd2l0aG91dCBhbiBMTE0gaGF2aW5nIHRvXG4gIC8vIGdyZXAgdGhlIGNvZGViYXNlLiBJbiBkZXYgYnVpbGRzIHRoZXNlIGFyZSByZWFsIGZ1bmN0aW9uIG5hbWVzOyBpblxuICAvLyBwcm9kIHRoZXkncmUgbWluaWZpZWQgYnV0IHN0aWxsIGFuY2hvci1hYmxlLlxuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBodG14IC8gU3RpbXVsdXMgLyBBbHBpbmUgLyBUdXJibyB3aXJpbmcgb24gdGhlIGVsZW1lbnQuIFNlcnZlci1cbiAgLy8gcmVuZGVyZWQgYXBwcyBkb24ndCBoYXZlIFJlYWN0IGZpYmVycyDigJQgZm9yIHRoZW0sIHRoaXMgSVMgdGhlXG4gIC8vIGNvbXBvbmVudCBzaGFwZS5cbiAgYmVoYXZpb3JBdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIFRydWUgd2hlbiBgZWwuZ2V0QW5pbWF0aW9ucygpYCByZXBvcnRlZCBhbiBhY3RpdmVseS1wbGF5aW5nXG4gIC8vIGFuaW1hdGlvbiBhdCBjYXB0dXJlIHRpbWUuIFRlbGxzIHRoZSBjb25zdW1lciB0aGF0IGNhcHR1cmVkIHJlY3QgL1xuICAvLyB0cmFuc2Zvcm0gLyBvcGFjaXR5IG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZS5cbiAgaXNBbmltYXRpbmc/OiBib29sZWFuO1xuICAvLyBGb3IgZWxlbWVudHMgcmVuZGVyZWQgaW50byBhIGA8Y2FudmFzPmAsIHRoZSBET00gZ2l2ZXMgdXMgZXNzZW50aWFsbHlcbiAgLy8gbm90aGluZyBhYm91dCB3aGF0IHdhcyBjbGlja2VkIOKAlCB0aGUgY2FudmFzIGhhcyBubyBjaGlsZHJlbiwgbm9cbiAgLy8gdGV4dCwgbm8gbWVhbmluZ2Z1bCBzZWxlY3RvcnMgYmVsb3cgdGhlIGNhbnZhcyBpdHNlbGYuIENhcHR1cmUgdGhlXG4gIC8vIGNsaWNrIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMncyBib3VuZGluZyBib3ggc28gYSBkb3duc3RyZWFtXG4gIC8vIGNvbnN1bWVyIGNhbiBjb3JyZWxhdGUgKGUuZy4gYWdhaW5zdCBhIERhdGFkb2cgLyBUYWJsZWF1IC8gY2hhcnRpbmdcbiAgLy8gbGlicmFyeSB0aGF0IGV4cG9zZXMgZGF0YS1wb2ludCBjb29yZGluYXRlcykuIENvb3JkaW5hdGVzIGFyZSBDU1NcbiAgLy8gcGl4ZWxzOyBtdWx0aXBseSBieSBgdmlld3BvcnQuZHByYCB0byBnZXQgZGV2aWNlIHBpeGVscy5cbiAgY2FudmFzQ2xpY2s/OiB7XG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIG9mZnNldFk6IG51bWJlcjtcbiAgICBjYW52YXNXOiBudW1iZXI7XG4gICAgY2FudmFzSDogbnVtYmVyO1xuICAgIGNhbnZhc1NlbGVjdG9yOiBzdHJpbmc7XG4gIH07XG4gIC8vIENvbnRlbnRlZGl0YWJsZSByaWNoLXRleHQgZWRpdG9yIGNvbnRleHQuIFBvcHVsYXRlZCB3aGVuIHRoZSBjYXB0dXJlZFxuICAvLyBub2RlIGlzLCBvciBsaXZlcyBpbnNpZGUsIGEgYFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1gIGFuY2VzdG9yLiBMZXRzXG4gIC8vIGFuIExMTSByZWFzb25pbmcgYWJvdXQgYSBcImNvcHkgaXMgd3JvbmdcIiAvIFwidGhlIGVkaXRvciBicmVha3Mgd2hlbiBYXCJcbiAgLy8gY2FwdHVyZSBrbm93IHdoaWNoIGVkaXRvciBsaWJyYXJ5IHRvIGxvb2sgYXQg4oCUIHNlbGVjdG9ycyBnZW5lcmF0ZWRcbiAgLy8gYnkgUHJvc2VNaXJyb3IgLyBMZXhpY2FsIC8gZXRjIGFyZSBydW50aW1lLWludGVybmFsIGFuZCB3b24ndCBncmVwXG4gIC8vIGFnYWluc3QgdXNlciBjb2RlLCBidXQgdGhlIExJQlJBUlkgcG9pbnRlciByb3V0ZXMgdGhlIExMTSB0byB0aGVcbiAgLy8gcmlnaHQgd3JhcHBlciBjb21wb25lbnQuXG4gIGVkaXRvcj86IHtcbiAgICBraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnO1xuICAgIHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbiAgfTtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBCRUZPUkUgdGhlIGNsaWNrLiBSZXBybyBjb250ZXh0IGZvciBidWdzIGxpa2VcbiAgLy8gXCJJIGNsaWNrZWQgdGhlIHdyb25nIGRyb3Bkb3duIG9wdGlvblwiIG9yIFwidGhlIHZhbHVlIGZsaWNrZXJlZCBiZWZvcmVcbiAgLy8gSSBjbGlja2VkIGl0XCIg4oCUIHdpdGhvdXQgdGhpcywgdGhlIEpTT04gc25hcHNob3RzIG9ubHkgdGhlIHBvc3QtXG4gIC8vIG11dGF0aW9uIHN0YXRlLCBsZWF2aW5nIHRoZSBMTE0gYmxpbmQgdG8gd2hhdCB0cmlnZ2VyZWQgdGhlXG4gIC8vIGFwcGVhcmFuY2UgdGhlIHVzZXIgY29tcGxhaW5lZCBhYm91dC4gUGluY2hncmFiIGtlZXBzIGFuIDgtc2Vjb25kXG4gIC8vIHJpbmcgYnVmZmVyIG9mIG11dGF0aW9uIHJlY29yZHM7IGNhcHR1cmUgYXR0YWNoZXMgdGhlIG1vc3QgcmVjZW50XG4gIC8vIDMgYXMgYSBzbmFwc2hvdC5cbiAgZG9tTXV0YXRpb25zPzogRG9tTXV0YXRpb25bXTtcbiAgc3RhdGVzPzogc3RyaW5nW107ICAgICAgLy8gYWN0aXZlIHBzZXVkby1jbGFzc2VzICh3YXMgUmVjb3JkPHN0cmluZywgdHJ1ZT4gaW4gdjEpXG4gIC8vIExvY2F0b3IgcXVhbGl0eTogaG93IG1hbnkgZWxlbWVudHMgYHNlbGVjdG9yYCByZXNvbHZlcyB0byBpbiBpdHNcbiAgLy8gc2NvcGUgKDEgPSB1bmlxdWUpLiBIaWdoZXIgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91cy5cbiAgc2VsZWN0b3JNYXRjaENvdW50PzogbnVtYmVyO1xuICAvLyBEaXNhbWJpZ3VhdGVkIG9yZGVyaW5nIGZpZWxkcy5cbiAgLy8gYG5gIGlzIHByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdCAoaXQncyB0aGUgY2FwdHVyZS1zZXF1ZW5jZVxuICAvLyBkaXNwbGF5IGxhYmVsIGluIHRoZSBzaWRlYmFyKS4gVGhlIG5ldyBmaWVsZHMgYXJlIGVtaXQtdGltZSBvbmx5OlxuICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHNhbWUgYXMgYG5gIChjYXB0dXJlIHNlcXVlbmNlIHdpdGhpbiBzZXNzaW9uKVxuICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgcmFuayB3aXRoaW4gdGhlIHBhZ2VcbiAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCBodW1hbi1mYWNpbmcgbGFiZWwgKG1pcnJvcnMgYG5gIHRvZGF5KVxuICBjYXB0dXJlSW5kZXg/OiBudW1iZXI7XG4gIGV2ZW50SW5kZXg/OiBudW1iZXI7XG4gIHZpc3VhbE9yZGVyPzogbnVtYmVyO1xuICBkaXNwbGF5TGFiZWw/OiBzdHJpbmc7XG4gIC8vIEdyb3VwIGZsYXR0ZW5pbmcgZmllbGRzLlxuICAvLyBUaGUgZ3JvdXAgaGVhZCBjYXJyaWVzIGBncm91cE1lbWJlclVpZHNgIChqdXN0IHRoZSBJRHMpOyBlYWNoXG4gIC8vIG1lbWJlciBlbWl0cyBhcyBpdHMgb3duIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nXG4gIC8vIGJhY2sgYXQgdGhlIGhlYWQuXG4gIGdyb3VwTWVtYmVyVWlkcz86IHN0cmluZ1tdO1xuICBncm91cFVpZD86IHN0cmluZztcbiAgLy8gTGlnaHR3ZWlnaHQgYTExeSBhdWRpdCBjYXB0dXJlZCBhdCBjbGljayB0aW1lLiBIZWF2aWVyIGNoZWNrc1xuICAvLyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90cywgYXhlIHZpb2xhdGlvbnMpIGFyZSBub3QgeWV0IHdpcmVkLlxuICBhMTF5Pzoge1xuICAgIGNvbnRyYXN0UmF0aW8/OiBudW1iZXI7XG4gICAgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7XG4gICAgdGFiYmFibGU/OiBib29sZWFuO1xuICAgIGZvY3VzVmlzaWJsZT86IGJvb2xlYW47XG4gIH07XG4gIC8vIFBhcmVudCBsYXlvdXQgY29udGV4dCDigJQgZmxleC9ncmlkL292ZXJmbG93L3Njcm9sbC9zdGFja2luZ1xuICAvLyBhbmNlc3RvcnMgdGhhdCBzaGFwZSB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGFwcGVhcmFuY2UuXG4gIGxheW91dENvbnRleHQ/OiBBcnJheTx7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgZGlzcGxheT86IHN0cmluZztcbiAgICBwb3NpdGlvbj86IHN0cmluZztcbiAgICBvdmVyZmxvdz86IHN0cmluZztcbiAgICB6SW5kZXg/OiBzdHJpbmc7XG4gICAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICAgIHdpbGxDaGFuZ2U/OiBzdHJpbmc7XG4gICAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICAgIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gICAgc2Nyb2xsVG9wPzogbnVtYmVyO1xuICAgIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICB9PjtcbiAgLy8gQXNzZXQgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIGNhcHR1cmVkIHN1YnRyZWUgKGltZyBzcmMsIDx1c2UgaHJlZj4sXG4gIC8vIGJhY2tncm91bmQtaW1hZ2UgdXJsKS4gV2hlbiBhIGNvbXBsYWludCBpcyBhYm91dCBhIGxvZ28gLyBpY29uIC9cbiAgLy8gYXJ0d29yaywgYW4gYWdlbnQgd2l0aG91dCB0aGVzZSByZWZlcmVuY2VzIHdvdWxkIGJlIGxlZnQgZ3Vlc3NpbmcuXG4gIGFzc2V0cz86IEFycmF5PHtcbiAgICBzcmM6IHN0cmluZztcbiAgICBuYXR1cmFsVz86IG51bWJlcjsgbmF0dXJhbEg/OiBudW1iZXI7XG4gICAgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7XG4gICAgYWx0Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gIH0+O1xuICBzdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtYXRjaGVkUnVsZXM/OiBNYXRjaGVkUnVsZVtdO1xuICBwc2V1ZG9FbGVtZW50cz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICAvLyBUcnVuY2F0aW9uIG1hcmtlcnMg4oCUIHByZXNlbnQgd2hlbiBjYXB0dXJlIGhhZCB0byBlbGlkZSBjb250ZW50LiBMZXRzXG4gIC8vIGEgY29uc3VtZXIgZGV0ZWN0IFwidGhpcyBlbnRyeSB3YXMgY3V0IGRvd25cIiBhbmQgcmVmZXRjaCBmcm9tIHRoZVxuICAvLyBsaXZlIHBhZ2UgaWYgaXQgbmVlZHMgdGhlIGZ1bGwgdmVyc2lvbi5cbiAgLy8gICBvdXRlckhUTUwg4oCUIG9yaWdpbmFsIGh0bWwgbGVuZ3RoIGJlZm9yZSB0aGUgc2l6ZS1jYXAga2lja2VkIGluLlxuICAvLyAgIGNoaWxkcmVuICDigJQgbnVtYmVyIG9mIGRlc2NlbmRhbnQgc3VidHJlZXMgcmVwbGFjZWQgYnkgZGVwdGgtY2FwXG4gIC8vICAgICAgICAgICAgICAgZWxpc2lvbiBtYXJrZXJzIChgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gKS5cbiAgdHJ1bmNhdGVkPzoge291dGVySFRNTD86IG51bWJlcjsgY2hpbGRyZW4/OiBudW1iZXI7IHRleHQ/OiBudW1iZXJ9O1xuICAvLyBHcm91cCBvZiBhZGRpdGlvbmFsIGNhcHR1cmVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudHJ5IChBbHQrU2hpZnQrQ2xpY2tcbiAgLy8gLyBBbHQrZHJhZyBzZWxlY3Rpb25zIGNvbGxhcHNlIGhlcmUpLlxuICBncm91cD86IEVudHJ5W107XG4gIC8vIE9wdGlvbmFsIHNjcmVlbnNob3QgYnVuZGxlOiBlYWNoIGZpZWxkIGlzIGEgcmVsYXRpdmUgcGF0aCB1bmRlciB0aGVcbiAgLy8gdXNlcidzIERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+LyByb290LiBUaGUgY2FwdHVyZWRBdCBzdGFtcCBpc1xuICAvLyB0aGUgSVNPIHRpbWVzdGFtcCB3aGVuIHRoZSBzaG90IHdhcyB0YWtlbi5cbiAgc2NyZWVuc2hvdD86IHtcbiAgICBlbGVtZW50Pzogc3RyaW5nO1xuICAgIGdyb3VwPzogc3RyaW5nO1xuICAgIHBhZ2U/OiBzdHJpbmc7XG4gICAgY2FwdHVyZWRBdD86IHN0cmluZztcbiAgICAvLyBBbiBlbXB0eSBgc2NyZWVuc2hvdGAgZmllbGQgY291bGQgbWVhbiBcIm5vdCB5ZXQgc2hvdFwiLCBcImZhaWxlZFwiLFxuICAgIC8vIG9yIFwic2tpcHBlZCBvbiBwdXJwb3NlXCIuIFdoZW4gdGhlIHBpcGVsaW5lIGRlY2xpbmVzIG9yIGZhaWxzLFxuICAgIC8vIHNldCB0aGlzIHNvIHJlY2VpdmVycyBrbm93IGl0J3Mgbm90IGEgcmV0cnkgY2FuZGlkYXRlLlxuICAgIHVuYXZhaWxhYmxlUmVhc29uPzogJ2F1dG9TY3JlZW5zaG90T2ZmJyB8ICdza2lwU2NyZWVuc2hvdEhvc3RzJyB8ICdjYXB0dXJlRmFpbGVkJyB8ICdwZXJtaXNzaW9uRGVuaWVkJyB8IHN0cmluZztcbiAgICAvLyBDcm9wIG1ldGFkYXRhIGRlc2NyaWJpbmcgd2hlcmUgdGhlIGNyb3BwZWQgUE5HIGZpdHMgaW4gdGhlXG4gICAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICBjcm9wPzoge1xuICAgICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZHByOiBudW1iZXI7XG4gICAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59O1xuXG4vLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIHBhZ2UgbWV0YWRhdGEsIGVtaXR0ZWQgb25jZSBwZXIgZGlzdGluY3QgcGFnZSBVUkxcbi8vIGludm9sdmVkIGluIGNhcHR1cmVzIChkZWR1cGVkIGJ5IFVSTCkuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTC5cbi8vIGBwYXJ0aWFsYCBpcyBzZXQgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCBjb3VsZCBiZSBjYXB0dXJlZCAoZnVsbC1wYWdlIHN0aXRjaFxuLy8gdW5hdmFpbGFibGUpIOKAlCBzZWUgYmFja2dyb3VuZC50cyBzdGl0Y2hQYWdlIGxpbWl0YXRpb25zLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90ID0geyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZzsgY2FwdHVyZWRBdDogc3RyaW5nOyB2aWV3cG9ydDoge3dpZHRoOiBudW1iZXI7aGVpZ2h0OiBudW1iZXJ9OyBzY3JvbGxXaWR0aDogbnVtYmVyOyBzY3JvbGxIZWlnaHQ6IG51bWJlcjsgZGV2aWNlUGl4ZWxSYXRpbzogbnVtYmVyOyBsYW5nOiBzdHJpbmc7IHNjcmVlbnNob3Q6IHN0cmluZzsgcGFydGlhbD86IGJvb2xlYW4gfTtcblxuZXhwb3J0IHR5cGUgRG9tTXV0YXRpb24gPSB7XG4gIHR5cGU6ICdjaGlsZExpc3QnIHwgJ2F0dHJpYnV0ZXMnIHwgJ2NoYXJhY3RlckRhdGEnO1xuICB0czogc3RyaW5nOyAgICAgICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBtdXRhdGlvbiBmaXJlZFxuICB0YXJnZXQ6IHN0cmluZzsgICAgICAgIC8vIGNvbXBhY3QgZGVzY3JpcHRvciBvZiB0aGUgbXV0YXRpb24ncyB0YXJnZXQgKGB0YWcjaWQuY2xzYClcbiAgYXR0cmlidXRlTmFtZT86IHN0cmluZztcbiAgb2xkVmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBuZXdWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIGFkZGVkPzogbnVtYmVyOyAgICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiBhZGRlZCBub2Rlc1xuICByZW1vdmVkPzogbnVtYmVyOyAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgcmVtb3ZlZCBub2Rlc1xuICBzdW1tYXJ5Pzogc3RyaW5nOyAgICAgIC8vIG9uZS1saW5lIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uXG59O1xuXG5leHBvcnQgdHlwZSBQYWdlQ29udGV4dCA9IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgdG9rZW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBCcm93c2VyICsgbG9jYWxlIGZpbmdlcnByaW50IGZvciBzZXNzaW9uLWxldmVsIGNvbnRleHQuIExldHMgYVxuICAvLyBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJyb3dzZXIgcHJvZHVjZWQgdGhpcyBjYXB0dXJlP1wiIG9yXG4gIC8vIFwid2FzIHRoZSBjYXB0dXJlZCBhcHAgcmVuZGVyZWQgaW4gYW4gUlRMIGxvY2FsZT9cIiB3aXRob3V0IHJlcnVubmluZy5cbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICAvLyBHaXQgYnVpbGQgaWRlbnRpdHksIHdoZW4gdGhlIGNhcHR1cmVkIGFwcCBleHBvc2VzXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW5cIj5gLlxuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFdoYXRldmVyIGVsZW1lbnQgaGFkIGZvY3VzIGF0IGNhcHR1cmUgdGltZSwgcGx1cyBhIGhpbnQgYXMgdG9cbiAgLy8gd2hldGhlciB0aGUgdXNlciBuYXZpZ2F0ZWQgdGhlcmUgd2l0aCB0aGUga2V5Ym9hcmQgKFRhYiAvIFNoaWZ0K1RhYlxuICAvLyBwcmVzc2VkIGluIHRoZSBsYXN0IHNlY29uZCkuIFVzZWZ1bCBmb3IgYWNjZXNzaWJpbGl0eS1idWcgY2FwdHVyZXM6XG4gIC8vIFwidGhpcyBlbGVtZW50IGxvb2tzIHdyb25nIG9ubHkgd2hlbiBrZXlib2FyZC1mb2N1c2VkXCIuXG4gIGFjdGl2ZUZvY3VzPzoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59O1xufTtcblxuLy8gLS0tLS0tLS0tLSBTaWRlLXBhbmVsIFwibWVzc2FnZXNcIiAoVUkgcm93cykgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBTZWxlY3Rvck1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdzZWxlY3Rvcic7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIGVudHJ5OiBFbnRyeTtcbiAgcGlubmVkPzogYm9vbGVhbjtcbiAgLy8gTGVnYWN5IGZpZWxkIGtlcHQgYXJvdW5kIGJlY2F1c2Ugb2xkIHdvcmtzcGFjZXMgbWF5IHN0aWxsIGhhdmUgaXQ7IHdlXG4gIC8vIHN0cmlwIGl0IG9uIGNhcHR1cmUsIGJ1dCBkb24ndCByZWplY3QgaXQgb24gaW1wb3J0LlxuICBkdXBlUGVuZGluZz86IHVua25vd247XG59O1xuXG5leHBvcnQgdHlwZSBGZWVkYmFja01lc3NhZ2UgPSB7XG4gIHR5cGU6ICdmZWVkYmFjayc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgLy8gT3B0aW9uYWwgZm9yZWlnbiBrZXkgaW50byBFbnRyeS51aWQuIEFkamFjZW5jeSB0byBhIHByZWNlZGluZyBzZWxlY3RvclxuICAvLyBpcyB0aGUgaGlzdG9yaWNhbCBsaW5rOyBwYXJlbnRJZCBtYWtlcyBpdCBleHBsaWNpdCBhbmQgc3Vydml2ZXNcbiAgLy8gcmUtb3JkZXJpbmcgLyBzcGxpdC1ncm91cCAvIGltcG9ydC1leHBvcnQgcm91bmQtdHJpcHMuXG4gIHBhcmVudFVpZD86IHN0cmluZztcbiAgLy8gVXNlciBleHBsaWNpdGx5IGRldGFjaGVkIHRoaXMgY29tbWVudCBmcm9tIGFueSBzZWxlY3Rvci4gV2l0aG91dCB0aGVcbiAgLy8gZmxhZywgYWRqYWNlbmN5IHRvIHRoZSBwcmVjZWRpbmcgc2VsZWN0b3Igd291bGQgc2lsZW50bHkgcmUtYWRvcHQgdGhlXG4gIC8vIGNvbW1lbnQgYXQgcmVuZGVyL2V4cG9ydCB0aW1lLlxuICBkZXRhY2hlZD86IGJvb2xlYW47XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIC8vIFBhZ2UgcmVwb3J0cyBpdHMgc3RpY2t5IHBpbmNoLW1vZGUgc3RhdGUgKGUuZy4gdGhlIHVzZXIgcHJlc3NlZCBFc2Mgb25cbiAgLy8gdGhlIHBhZ2UgdG8gZXhpdCkgc28gdGhlIHBhbmVsIHRvZ2dsZSBzdGF5cyBpbiBzeW5jLlxuICB8IHtraW5kOiAnc2VsZWN0LW1vZGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIC8vIFN0aWNreSBcInBpbmNoIG1vZGVcIjogd2hpbGUgb24sIHBsYWluIGhvdmVyL2NsaWNrIGNhcHR1cmVzIHdpdGhvdXQgdGhlXG4gIC8vIEFsdCBtb2RpZmllciwgYW5kIHRoZSBwYWdlIHNob3dzIGEgbW9kZSBpbmRpY2F0b3IuIEVzYyBleGl0cy5cbiAgfCB7a2luZDogJ3NlbGVjdC1tb2RlJzsgb246IGJvb2xlYW59XG4gIC8vIEV4cG9ydC10aW1lIHJlcXVlc3QgZm9yIHRoZSBmdWxsIHNlcmlhbGl6ZWQgcGFnZSAob3B0LWluIHByZWZcbiAgLy8gaW5jbHVkZVBhZ2VIVE1MKS4gUmVwbGllZCB3aXRoIHtvaywgdXJsLCB0aXRsZSwgaHRtbH07IG5ldmVyIHBlcnNpc3RlZFxuICAvLyB0byBjaHJvbWUuc3RvcmFnZSDigJQgdGhlIHBheWxvYWQgZ29lcyBzdHJhaWdodCBpbnRvIHRoZSB0YXIuXG4gIHwge2tpbmQ6ICdwYWdlLWh0bWwnfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gRnVsbC1wYWdlIChiZXN0LWVmZm9ydCkgc2NyZWVuc2hvdCBmb3IgdGhlIHBhZ2Utc25hcHNob3QgZmVhdHVyZS4gVW5saWtlXG4gIC8vIHNob3QtcGFnZSB0aGlzIGRvZXMgTk9UIHdyaXRlIGEgZmlsZSBvciBidWlsZCBhIHRodW1ibmFpbCDigJQgaXQganVzdFxuICAvLyByZXR1cm5zIHRoZSBzdGl0Y2hlZCBQTkcgYXMgYSBkYXRhIFVSTCBzbyB0aGUgY2FsbGVyIChjb250ZW50IHNjcmlwdCkgY2FuXG4gIC8vIGF0dGFjaCBpdCB0byBhIFBhZ2VTbmFwc2hvdC4gYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydFxuICAvLyBjb3VsZCBiZSBjYXB0dXJlZC5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3Qtc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gKHJlKWluamVjdCB0aGUgY29udGVudCBzY3JpcHQg4oCUIHRoZSBmaXhcbiAgLy8gZm9yIFwiQWx0IHN0b3BwZWQgd29ya2luZ1wiIGFmdGVyIGFuIGV4dGVuc2lvbiByZWxvYWQgb3JwaGFucyB0aGUgcGFnZSdzXG4gIC8vIGNvbnRlbnQgc2NyaXB0LiBEZWZhdWx0cyB0byB0aGUgYWN0aXZlIHRhYi5cbiAgfCB7a2luZDogJ3BnLXJlaW5qZWN0JzsgdGFiSWQ/OiBudW1iZXJ9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuLy8gUmVwbHkgdG8gYSBgcGFnZS1zbmFwc2hvdC1zaG90YCByZXF1ZXN0LiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwgb2Zcbi8vIHRoZSAoYmVzdC1lZmZvcnQpIGZ1bGwgcGFnZTsgYHBhcnRpYWxgIGlzIHRydWUgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCB3YXNcbi8vIGNhcHR1cmVkLiBgb2s6ZmFsc2VgIGNhcnJpZXMgYW4gZXJyb3Igc3RyaW5nLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBzY3JlZW5zaG90Pzogc3RyaW5nO1xuICBwYXJ0aWFsPzogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBTYXZlUmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGhcbiAgYWJzUGF0aD86IHN0cmluZzsgIC8vIE9TLWFic29sdXRlIHBhdGhcbiAgY29weVBhdGg/OiBzdHJpbmc7IC8vIFVJLWZhY2luZyBwYXRoXG4gIHRlbXBQYXRoPzogYm9vbGVhbjtcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZXJyb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBCZ1JlcGx5ID1cbiAgfCB7ZGF0YVVybDogc3RyaW5nfVxuICB8IHtmb3VuZDogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyfVxuICB8IHt0YWJzOiBBcnJheTx7aWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9Pn1cbiAgfCB7ZXJyb3I6IHN0cmluZ31cbiAgfCBTaG90UmVwbHlcbiAgfCBTYXZlUmVwbHlcbiAgfCBQYWdlU25hcHNob3RSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5OiBmaXJzdCAxNiBoZXggY2hhcnMgb2YgYSBTSEEtMjU2IG92ZXIgdGhlXG4gIC8vIHNsaW0gcm93cyArIHNjcmVlbnNob3QgbmFtZXMuIFN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cyBvZiB0aGUgc2FtZVxuICAvLyBjb250ZW50LCBzbyBkb3duc3RyZWFtIHN0YXRlIChlLmcuIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyovYnVuZGxlcy8pXG4gIC8vIGtleXMgb24gaXQgd2l0aG91dCBkdXBsaWNhdGluZyB3b3JrLlxuICBidW5kbGVJZD86IHN0cmluZztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gICAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gICAgcGFnZXNIdG1sPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBXaGVyZSB0aGUgYWdlbnQgZG9jdHJpbmUgbGl2ZXMgaW5zaWRlIHRoZSBhcmNoaXZlIChTZW5kLXRvLUFnZW50XG4gIC8vIHByb3RvY29sKS4gQWJzZW50IG9uIHBsYWluIEpTT05MIGV4cG9ydHMuXG4gIGFnZW50UHJvdG9jb2w/OiB7YXJjaGl2ZVBhdGg6IHN0cmluZ307XG4gIC8vIEJ1bmRsZSB0b2tlbiBidWRnZXQ6IGBzaWduYWwqYCBpcyB0aGUgdXAtZnJvbnQgcmVhZCAoQUdFTlQtUFJPVE9DT0wsXG4gIC8vIFJFQURNRSwgcmVwYWlyLWluZGV4LCB0aGUgSlNPTkwsIERFU0lHTiwgdGhlIHR3byBTS0lMTHMsIHNraWxscy1pbmRleCk7XG4gIC8vIGB0b3RhbCpgIGlzIHRoZSB3aG9sZSBhcmNoaXZlLiBUaGUgbGF6eSByZW1haW5kZXIgaXMgZW51bWVyYXRlZCBpbiB0aGVcbiAgLy8gYnVuZGxlIGZpbGUgbmFtZWQgYnkgYGlnbm9yZWAuIEVzdGltYXRvciBoZXVyaXN0aWM6IGJ5dGVzIC8gNC5cbiAgdG9rZW5zPzoge3NpZ25hbEJ5dGVzOiBudW1iZXI7IHRvdGFsQnl0ZXM6IG51bWJlcjsgc2lnbmFsVG9rZW5zOiBudW1iZXI7IHRvdGFsVG9rZW5zOiBudW1iZXI7IGlnbm9yZTogc3RyaW5nfTtcbiAgLy8gVmVuZG9yZWQgc2tpbGwgZG9jdW1lbnRzIGJ1bmRsZWQgaW50byB0aGlzIGFyY2hpdmUgKHN1YnNldCBvZiB0aGVcbiAgLy8gcmljaGVyIHNraWxscy1pbmRleC5qc29uIGF0IHRoZSBhcmNoaXZlIHJvb3QpLiBgaW52b2NhdGlvbmAgY2FycmllcyBhXG4gIC8vIHBsdWdpbi1jb21tYW5kIGZvcm0gZm9yIGhhcm5lc3NlcyB0aGF0IHN1cHBvcnQgaXQuXG4gIGJ1bmRsZWRTa2lsbHM/OiBBcnJheTx7aWQ6IHN0cmluZzsga2luZDogJ3NraWxsJyB8ICdyZWZlcmVuY2UnOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBpbnZvY2F0aW9uPzogc3RyaW5nfT47XG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGRvY3VtZW50cyBidW5kbGVkIHVuZGVyIHBhZ2VzLyAob3B0LWluIHByZWYpLlxuICBwYWdlc0h0bWw/OiBBcnJheTx7dXJsOiBzdHJpbmc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGJ5dGVzOiBudW1iZXJ9PjtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gUGluY2hHcmFiIOKAlCBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyIChNVjMpXG4vL1xuLy8g4oCiIE9wZW4gdGhlIHNpZGUgcGFuZWwgb24gYWN0aW9uIGNsaWNrXG4vLyDigKIgSW5qZWN0IHRoZSBjb250ZW50IHNjcmlwdCBpbnRvIGFscmVhZHktb3BlbiB0YWJzIChubyByZWZyZXNoIG5lZWRlZClcbi8vIOKAoiBSaWdodC1jbGljayBcIlBpbmNoR3JhYiBjYXB0dXJlXCIgY29udGV4dCBtZW51XG4vLyDigKIgQ2FwdHVyZSB2aXNpYmxlLXRhYiBzY3JlZW5zaG90cyBvbiBzaWRlLXBhbmVsIHJlcXVlc3Rcbi8vIOKAoiBBdXRvLW9wZW4gdGhlIHNpZGUgcGFuZWwgb24gZmlyc3QgY2FwdHVyZSAodXNlcyBDaHJvbWUgMTE2KyB1c2VyLWdlc3R1cmVcbi8vICAgcHJvcGFnYXRpb24gdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSlcbi8vIOKAoiBSZWxheSBjb250ZW50LXNjcmlwdCBtZXNzYWdlcyB0byBzaWRlLXBhbmVsIHBvcnRzXG4vLyDigKIgU2NyZWVuc2hvdCB3b3JrZXI6IHNob3QtZWxlbWVudCAvIHNob3QtZ3JvdXAgLyBzaG90LXBhZ2Uga2luZHMuIEVhY2hcbi8vICAgY2FwdHVyZXMgdmlhIGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiLCBvcHRpb25hbGx5IGNyb3BzL3N0aXRjaGVzXG4vLyAgIGluIGFuIE9mZnNjcmVlbkNhbnZhcywgYW5kIHdyaXRlcyB0aGUgUE5HIGludG8gdGhlIHVzZXIncyBEb3dubG9hZHNcbi8vICAgdW5kZXIgLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9zY3JlZW5zaG90cy8uXG5cbmltcG9ydCB0eXBlIHtBbnlNZXNzYWdlLCBQZ0VudmVsb3BlLCBTaG90UmVwbHl9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5cbmNvbnN0IExPRyA9ICdbUGluY2hHcmFiL2JnXSc7XG5cbi8vIFRvb2xiYXIgaWNvbjogdGhlIG1hbmlmZXN0J3MgY29tbWl0dGVkIFBORyBpY29ucyAoc3JjL2ljb25zL2ljb24qLnBuZykgQVJFXG4vLyB0aGUgY2Fub25pY2FsIFNlZ29lIHBpbmNoLCBzbyB3ZSBubyBsb25nZXIgZHJhdyB0aGUgZW1vamkgaW50byBJbWFnZURhdGEgYXRcbi8vIHN0YXJ0dXAuIFRoZSBvbGQgY2FudmFzIHJlbmRlciBwaWNrZWQgd2hhdGV2ZXIgZW1vamkgZm9udCB0aGUgT1MgaGFkLCB3aGljaFxuLy8gZGlzYWdyZWVkIHdpdGggdGhlIGNvbW1pdHRlZCBicmFuZCBtYXJrIG9uIG5vbi1XaW5kb3dzIHN5c3RlbXMg4oCUIGRyb3BwaW5nIGl0XG4vLyBtYWtlcyB0aGUgdG9vbGJhciBpY29uIG1hdGNoIHRoZSBwYW5lbCArIHdvcmRtYXJrIGV2ZXJ5d2hlcmUuXG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgdHJ5IHsgY2hyb21lLmNvbnRleHRNZW51cy5jcmVhdGUoe2lkOiAncGctY2FwdHVyZScsIHRpdGxlOiAnUGluY2hHcmFiIOKAlCBjYXB0dXJlIHRoaXMgZWxlbWVudCcsIGNvbnRleHRzOiBbJ2FsbCddfSk7IH1cbiAgY2F0Y2ggeyAvKiBtYXkgYWxyZWFkeSBleGlzdCAqLyB9XG59KTtcblxuLy8gRW5zdXJlIHRoZSB0b29sYmFyIGNsaWNrIGZpcmVzIE9VUiBhY3Rpb24ub25DbGlja2VkIChub3QgQ2hyb21lJ3MgcGFuZWxcbi8vIGF1dG8tb3Blbikgb24gRVZFUlkgc2VydmljZS13b3JrZXIgc3RhcnQg4oCUIG9uSW5zdGFsbGVkIGFsb25lIGlzIHVucmVsaWFibGVcbi8vIGFjcm9zcyByZWxvYWRzLCBhbmQgYSBzdGFsZSBvcGVuUGFuZWxPbkFjdGlvbkNsaWNrOnRydWUgc2lsZW50bHkgc3dhbGxvd3MgdGhlXG4vLyBjbGljayBzbyB0aGUgY29udGVudCBzY3JpcHQgbmV2ZXIgaW5qZWN0cyAoQWx0K0NsaWNrIGNhcHR1cmUgZ29lcyBkZWFkKS5cbi8vIElkZW1wb3RlbnQgYW5kIGNoZWFwLiAoIzE4KVxudm9pZCBjaHJvbWUuc2lkZVBhbmVsLnNldFBhbmVsQmVoYXZpb3Ioe29wZW5QYW5lbE9uQWN0aW9uQ2xpY2s6IGZhbHNlfSlcbiAgLmNhdGNoKChlKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnc2V0UGFuZWxCZWhhdmlvciAoc3RhcnR1cCknLCBlKSk7XG5cbi8vIOKUgOKUgOKUgCBBY3RpdmF0aW9uICgjMTgpOiB0b29sYmFyIGNsaWNrIGF0dGFjaGVzIFBpbmNoR3JhYiB0byBUSElTIHRhYiDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFBpbmNoR3JhYiBubyBsb25nZXIgYXV0by1pbmplY3RzIGludG8gZXZlcnkgcGFnZSDigJQgdGhlIDxhbGxfdXJscz5cbi8vIGNvbnRlbnRfc2NyaXB0cyBlbnRyeSBhbmQgaG9zdF9wZXJtaXNzaW9ucyBhcmUgZ29uZS4gQ2xpY2tpbmcgdGhlIHRvb2xiYXJcbi8vIGFjdGlvbiBncmFudHMgYWN0aXZlVGFiIGZvciB0aGUgY2xpY2tlZCB0YWI7IHdlIGluamVjdCB0aGUgY2FwdHVyZSBzY3JpcHRcbi8vIHRoZXJlIGFuZCBvcGVuIHRoZSBzaWRlIHBhbmVsLiBFYWNoIGFjdGl2YXRlZCB0YWIgYmVjb21lcyBpdHMgb3duIHdvcmtzcGFjZSxcbi8vIHRyYWNrZWQgcGFuZWwtc2lkZSB2aWEgdGhlIHBnLXRhYi1hY3RpdmF0ZWQgbWVzc2FnZSBiZWxvdy5cbi8vIOKUgOKUgOKUgCBBY3RpdmF0ZWQtdGFiIHRyYWNraW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gVGFicyBQaW5jaEdyYWIgaXMgYXR0YWNoZWQgdG8gKHRvb2xiYXIgY2xpY2sgb3IgcGFuZWwgcmUtYXR0YWNoKS4gU2Vzc2lvblxuLy8gc3RvcmFnZSBzdXJ2aXZlcyBzZXJ2aWNlLXdvcmtlciByZXN0YXJ0cyBhbmQgY2xlYXJzIG9uIGJyb3dzZXIgZXhpdCDigJQgdGhlXG4vLyBzYW1lIGxpZmV0aW1lIGFzIHRoZSBhY3RpdmVUYWIgZ3JhbnQgY2hhaW4gdGhlIHJlLWluamVjdCBwYXRoIHJlbGllcyBvbi5cbmNvbnN0IEFDVElWRV9UQUJTX0tFWSA9ICdwZy5hY3RpdmVUYWJzJztcbmNvbnN0IHJlYWRBY3RpdmVUYWJzID0gYXN5bmMgKCk6IFByb21pc2U8UmVjb3JkPHN0cmluZywgYm9vbGVhbj4+ID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5nZXQoQUNUSVZFX1RBQlNfS0VZKTtcbiAgICByZXR1cm4gKG9bQUNUSVZFX1RBQlNfS0VZXSBhcyBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiB8IHVuZGVmaW5lZCkgPz8ge307XG4gIH0gY2F0Y2ggeyByZXR1cm4ge307IH1cbn07XG5jb25zdCB0cmFja0FjdGl2ZVRhYiA9IGFzeW5jICh0YWJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IGN1ciA9IGF3YWl0IHJlYWRBY3RpdmVUYWJzKCk7XG4gIGN1cltTdHJpbmcodGFiSWQpXSA9IHRydWU7XG4gIHRyeSB7IGF3YWl0IGNocm9tZS5zdG9yYWdlLnNlc3Npb24uc2V0KHtbQUNUSVZFX1RBQlNfS0VZXTogY3VyfSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxufTtcbmNvbnN0IHVudHJhY2tBY3RpdmVUYWIgPSBhc3luYyAodGFiSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICBjb25zdCBjdXIgPSBhd2FpdCByZWFkQWN0aXZlVGFicygpO1xuICBpZiAoIShTdHJpbmcodGFiSWQpIGluIGN1cikpIHJldHVybjtcbiAgZGVsZXRlIGN1cltTdHJpbmcodGFiSWQpXTtcbiAgdHJ5IHsgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5zZXQoe1tBQ1RJVkVfVEFCU19LRVldOiBjdXJ9KTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG59O1xuXG5jaHJvbWUudGFicy5vblJlbW92ZWQuYWRkTGlzdGVuZXIoKHRhYklkKSA9PiB2b2lkIHVudHJhY2tBY3RpdmVUYWIodGFiSWQpKTtcblxuLy8gUmUtaW5qZWN0IGFmdGVyIGEgcmVmcmVzaCAvIHNhbWUtdGFiIG5hdmlnYXRpb24gb2YgYW4gYXR0YWNoZWQgdGFiLCBzb1xuLy8gQWx0K0NsaWNrIHN1cnZpdmVzIHJlbG9hZHMgd2l0aG91dCBhbm90aGVyIHRvb2xiYXIgY2xpY2suIFRoZSBhY3RpdmVUYWJcbi8vIGdyYW50IHBlcnNpc3RzIGFjcm9zcyByZWxvYWRzIG9mIHRoZSBncmFudGVkIHRhYjsgd2hlbiBDaHJvbWUgcmV2b2tlcyBpdFxuLy8gKGUuZy4gY3Jvc3Mtb3JpZ2luIG5hdmlnYXRpb24pIGV4ZWN1dGVTY3JpcHQgcmVqZWN0cyBhbmQgd2UgdW50cmFjayDigJRcbi8vIHRoZSBwYW5lbCdzIHJlLWF0dGFjaCBhZmZvcmRhbmNlIGNvdmVycyB0aGF0IGNhc2UuXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCBpbmZvLCB0YWIpID0+IHtcbiAgaWYgKGluZm8uc3RhdHVzICE9PSAnY29tcGxldGUnKSByZXR1cm47XG4gIGlmICghdGFiLnVybCB8fCAhL15odHRwcz86Ly50ZXN0KHRhYi51cmwpKSByZXR1cm47XG4gIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0cmFja2VkID0gYXdhaXQgcmVhZEFjdGl2ZVRhYnMoKTtcbiAgICBpZiAoIXRyYWNrZWRbU3RyaW5nKHRhYklkKV0pIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHt0YXJnZXQ6IHt0YWJJZCwgYWxsRnJhbWVzOiBmYWxzZX0sIGZpbGVzOiBbJ2NvbnRlbnQtc2NyaXB0LmpzJ10sIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdyZWluamVjdGVkIGFmdGVyIG5hdmlnYXRpb24nLCB0YWJJZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ3JlaW5qZWN0IGFmdGVyIG5hdmlnYXRpb24gZmFpbGVkIChncmFudCByZXZva2VkPyknLCB0YWJJZCwgZSk7XG4gICAgICBhd2FpdCB1bnRyYWNrQWN0aXZlVGFiKHRhYklkKTtcbiAgICB9XG4gIH0pKCk7XG59KTtcblxuY2hyb21lLmFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKHRhYikgPT4ge1xuICBpZiAoIXRhYj8uaWQpIHJldHVybjtcbiAgY29uc3QgdGFiSWQgPSB0YWIuaWQ7XG4gIGNvbnNvbGUubG9nKExPRywgJ2FjdGlvbiBjbGljayDihpIgYWN0aXZhdGUgdGFiJywgdGFiSWQsIHRhYi51cmwgPz8gJyhubyB1cmwpJyk7XG4gIC8vIEluamVjdCB0aGUgY2FwdHVyZSBzY3JpcHQgRklSU1QsIHdoaWxlIHRoZSBjbGljaydzIGFjdGl2ZVRhYiBncmFudCBpc1xuICAvLyBmcmVzaGVzdDsgYXR0ZW1wdCBvbiBodHRwKHMpIHBhZ2VzIChhbmQgd2hlbiB0aGUgVVJMIGlzIHVua25vd24pLCBhbmQgc2tpcFxuICAvLyByZXN0cmljdGVkIHNjaGVtZXMgd2hlcmUgaW5qZWN0aW9uIHdvdWxkIG9ubHkgZXJyb3IuXG4gIGlmICghdGFiLnVybCB8fCAvXmh0dHBzPzovLnRlc3QodGFiLnVybCkpIHtcbiAgICBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWQsIGFsbEZyYW1lczogZmFsc2V9LFxuICAgICAgZmlsZXM6IFsnY29udGVudC1zY3JpcHQuanMnXSxcbiAgICAgIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlLFxuICAgIH0pLmNhdGNoKChlKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnYWN0aXZhdGUgaW5qZWN0IEZBSUxFRCcsIGUpKTtcbiAgICB2b2lkIHRyYWNrQWN0aXZlVGFiKHRhYklkKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnYWN0aXZhdGU6IGNhbm5vdCBpbmplY3QgaW50bycsIHRhYi51cmwpO1xuICB9XG4gIC8vIFRoZW4gb3BlbiB0aGUgc2lkZSBwYW5lbCAoYWxzbyBhIHVzZXItZ2VzdHVyZSBjYWxsKS5cbiAgY2hyb21lLnNpZGVQYW5lbC5vcGVuKHt0YWJJZH0pLmNhdGNoKChlKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnc2lkZVBhbmVsLm9wZW4nLCBlKSk7XG4gIC8vIEJpbmQgdGhpcyB0YWIgdG8gYSB3b3Jrc3BhY2UgcGFuZWwtc2lkZS4gVGhlIHBhbmVsIG1heSBoYXZlIGp1c3Qgb3BlbmVkIGFuZFxuICAvLyBub3QgYmUgbGlzdGVuaW5nIHlldCwgc28gcmVwbGF5IGEgZmV3IHRpbWVzOyB0aGUgcGFuZWwgZGVkdXBzIGJ5IHRhYklkLlxuICBjb25zdCBtZXRhID0ge19fcGc6IHRydWUsIGtpbmQ6ICdwZy10YWItYWN0aXZhdGVkJywgdGFiSWQsIHVybDogdGFiLnVybCA/PyAnJywgdGl0bGU6IHRhYi50aXRsZSA/PyAnJ307XG4gIGNvbnN0IGFubm91bmNlID0gKCk6IHZvaWQgPT4geyB0cnkgeyB2b2lkIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1ldGEpLmNhdGNoPy4oKCkgPT4geyAvKiBub3QgdXAgeWV0ICovIH0pOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfTtcbiAgYW5ub3VuY2UoKTtcbiAgc2V0VGltZW91dChhbm5vdW5jZSwgMTUwKTtcbiAgc2V0VGltZW91dChhbm5vdW5jZSwgNTAwKTtcbn0pO1xuXG5jaHJvbWUuY29udGV4dE1lbnVzPy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKGluZm8sIHRhYikgPT4ge1xuICBpZiAoaW5mby5tZW51SXRlbUlkICE9PSAncGctY2FwdHVyZScgfHwgIXRhYj8uaWQpIHJldHVybjtcbiAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7X19wZzogdHJ1ZSwga2luZDogJ2NvbnRleHQtY2FwdHVyZSd9KS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbn0pO1xuXG4vLyDilIDilIDilIAgU2NyZWVuc2hvdCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyBGaWxlbmFtZSB0aW1lc3RhbXAgaXMgZXBvY2ggbWlsbGlzZWNvbmRzLiBTb3J0aW5nIGJ5IG5hbWUgPSBzb3J0aW5nIGJ5XG4vLyB0aW1lIHdpdGhpbiBhIGhvc3QgYnVja2V0LiBXZSBhY2NlcHQgYW4gb3B0aW9uYWwgSVNPIHN0cmluZyBmb3IgdGVzdHMgYnV0XG4vLyBub3JtYWxpemUgdG8gZXBvY2ggbXMgc28gdGhlIG91dHB1dCBpcyB1bmlmb3JtLlxuZXhwb3J0IGNvbnN0IHRzRm9yRmlsZW5hbWUgPSAoaXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFpc28pIHJldHVybiBTdHJpbmcoRGF0ZS5ub3coKSk7XG4gIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUodCkgPyBTdHJpbmcodCkgOiBTdHJpbmcoRGF0ZS5ub3coKSk7XG59O1xuXG4vLyBob3N0LXNsdWc6IHJlcGxhY2UgYC5gIHdpdGggYF9gIChwZXIgcHJvamVjdCBjb252ZW50aW9uIHNvIGZpbGVuYW1lcyBhcmVcbi8vIHNoZWxsLWZyaWVuZGx5IGFuZCBkb24ndCBsb29rIGxpa2UgbXVsdGktZXh0ZW5zaW9uIHBhdGhzIGxpa2UgYGFwcC5waW5jaFxuLy8gZ3JhYi5jb20tLi4uYCksIHN0cmlwIGFueSBvdGhlciBub24td29yZC9oeXBoZW4gY2hhcmFjdGVycywgY2FwIGF0IDQwXG4vLyBjaGFycy4gYGxvY2FsaG9zdDozMDAwYCDihpIgYGxvY2FsaG9zdF8zMDAwYC5cbmV4cG9ydCBjb25zdCBob3N0U2x1ZyA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGxldCBob3N0OiBzdHJpbmc7XG4gIHRyeSB7IGhvc3QgPSBuZXcgVVJMKHVybCkuaG9zdDsgfSBjYXRjaCB7IGhvc3QgPSAndW5rbm93bic7IH1cbiAgcmV0dXJuIGhvc3QucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG59O1xuXG4vLyBGaWxlbmFtZSBsYXlvdXQ6IGA8aG9zdF91bmRlcnNjb3JlZD4tbjxOPi08a2luZD5bLTxleHRyYT5dLTxlcG9jaD4ucG5nYC5cbi8vIEhvc3QgZmlyc3QgbWVhbnMgc2NyZWVuc2hvdHMgaW4gRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy9cbi8vIGdyb3VwIG5hdHVyYWxseSBwZXIgc2l0ZTsgZXBvY2ggYXMgYSB0YWlsIGtleSBnaXZlcyBjaHJvbm9sb2dpY2FsIG9yZGVyXG4vLyBpbnNpZGUgZWFjaCBidWNrZXQuXG5leHBvcnQgY29uc3QgYnVpbGRGaWxlbmFtZSA9IChcbiAga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyxcbiAgdHM6IHN0cmluZyxcbiAgbjogbnVtYmVyLFxuICB1cmw6IHN0cmluZyxcbiAgb3B0czoge2NvdW50PzogbnVtYmVyOyB0cnVuY2F0ZWQ/OiBib29sZWFufSA9IHt9LFxuKTogc3RyaW5nID0+IHtcbiAgY29uc3Qgc3RhbXAgPSB0c0ZvckZpbGVuYW1lKHRzKTtcbiAgY29uc3Qgc2x1ZyA9IGhvc3RTbHVnKHVybCk7XG4gIGlmIChraW5kID09PSAnZWxlbWVudCcpIHJldHVybiBgJHtzbHVnfS1uJHtufS1lbGVtZW50LSR7c3RhbXB9LnBuZ2A7XG4gIGlmIChraW5kID09PSAnZ3JvdXAnKSByZXR1cm4gYCR7c2x1Z30tbiR7bn0tZ3JvdXAke29wdHMuY291bnQgPz8gMH0tJHtzdGFtcH0ucG5nYDtcbiAgLy8gcGFnZVxuICBjb25zdCBzdWZmaXggPSBvcHRzLnRydW5jYXRlZCA/ICdwYWdlLXRydW5jJyA6ICdwYWdlJztcbiAgcmV0dXJuIGAke3NsdWd9LW4ke259LSR7c3VmZml4fS0ke3N0YW1wfS5wbmdgO1xufTtcblxuLy8gZGF0YVVSTCDihpIgQmxvYiB3aXRob3V0IGdvaW5nIHRocm91Z2ggZmV0Y2gvYXRvYiByb3VuZHRyaXBzIHRoYXQgYnJvd3NlcnNcbi8vIGluIHNlcnZpY2Utd29ya2VyIGNvbnRleHQgc29tZXRpbWVzIGJhbGsgYXQuIFBORyBvbmx5LlxuY29uc3QgZGF0YVVybFRvQmxvYiA9IGFzeW5jIChkYXRhVXJsOiBzdHJpbmcpOiBQcm9taXNlPEJsb2I+ID0+IHtcbiAgY29uc3QgciA9IGF3YWl0IGZldGNoKGRhdGFVcmwpO1xuICByZXR1cm4gci5ibG9iKCk7XG59O1xuXG4vLyBEZWNvZGUgYSBQTkcgZGF0YVVSTCBpbnRvIGFuIEltYWdlQml0bWFwIHVzYWJsZSBieSBPZmZzY3JlZW5DYW52YXMuIFdlXG4vLyBjYW4ndCBgbmV3IEltYWdlKClgIGluIGEgc2VydmljZSB3b3JrZXIg4oCUIEltYWdlIGlzIGEgRE9NLW9ubHkgY29uc3RydWN0b3IuXG5jb25zdCBkYXRhVXJsVG9CaXRtYXAgPSBhc3luYyAoZGF0YVVybDogc3RyaW5nKTogUHJvbWlzZTxJbWFnZUJpdG1hcD4gPT4ge1xuICBjb25zdCBibG9iID0gYXdhaXQgZGF0YVVybFRvQmxvYihkYXRhVXJsKTtcbiAgcmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xufTtcblxuLy8gRW5jb2RlIGFuIE9mZnNjcmVlbkNhbnZhcyB0byBhIFBORyBibG9iLlxuY29uc3QgY2FudmFzVG9CbG9iID0gYXN5bmMgKGNhbnZhczogT2Zmc2NyZWVuQ2FudmFzKTogUHJvbWlzZTxCbG9iPiA9PlxuICBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcblxuLy8gRG93bnNjYWxlIGEgYml0bWFwIGludG8gYSBQTkcgZGF0YVVSTCB3aXRoIG1heCB3aWR0aCBjYXBwZWQuIFRoZSB0aHVtYm5haWxcbi8vIGlzIHdoYXQgdGhlIHNpZGUgcGFuZWwgcGFpbnRzIGludG8gdGhlIC5wcmV2aWV3IHRpbGUg4oCUIHRoZSBvcmlnaW5hbCBsaXZlc1xuLy8gb25seSBvbiBkaXNrLiBXZSB1c2UgRmlsZVJlYWRlciAod29ya3MgaW4gTVYzIFNXcykgc2luY2UgdGhlIGRhdGFVUkwgaXNcbi8vIHBhc3NlZCBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugd2hlcmUgc2l6ZSBtYXR0ZXJzIGxlc3MuXG5jb25zdCBtYWtlVGh1bWJuYWlsID0gYXN5bmMgKGJpdG1hcDogSW1hZ2VCaXRtYXAsIG1heFdpZHRoID0gMzIwKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgcmF0aW8gPSBiaXRtYXAud2lkdGggPD0gbWF4V2lkdGggPyAxIDogbWF4V2lkdGggLyBiaXRtYXAud2lkdGg7XG4gIGNvbnN0IHcgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC53aWR0aCAqIHJhdGlvKSk7XG4gIGNvbnN0IGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC5oZWlnaHQgKiByYXRpbykpO1xuICBjb25zdCBjYW52YXMgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHcsIGgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICBjdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gJ2hpZ2gnO1xuICBjdHguZHJhd0ltYWdlKGJpdG1hcCwgMCwgMCwgdywgaCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcbiAgLy8gYXJyYXlCdWZmZXIgKyBidG9hIGF2b2lkcyBhbnkgRmlsZVJlYWRlci1hdmFpbGFiaWxpdHkgY29uY2Vybi5cbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG4vLyBQZXItdGFiIHNlcmlhbGl6YXRpb246IGF0IG1vc3Qgb25lIGNhcHR1cmUgaW4gZmxpZ2h0IGF0IGEgdGltZS4gV2l0aG91dCBhXG4vLyBxdWV1ZSwgdGhlIHRocm90dGxpbmcgb24gY2FwdHVyZVZpc2libGVUYWIgKH4yIGNhbGxzL3NlYykgc2hvd3MgdXAgYXNcbi8vIG1pc3Npbmcgc2NyZWVuc2hvdHMgd2hlbiB0aGUgdXNlciBmaXJlcyBzZXZlcmFsIGNhcHR1cmVzIGJhY2stdG8tYmFjay5cbnR5cGUgUXVldWVUYXNrID0gKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmNvbnN0IHRhYlF1ZXVlcyA9IG5ldyBNYXA8bnVtYmVyLCBQcm9taXNlPHZvaWQ+PigpO1xuY29uc3QgZW5xdWV1ZSA9ICh0YWJJZDogbnVtYmVyLCB0YXNrOiBRdWV1ZVRhc2spOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgcHJldiA9IHRhYlF1ZXVlcy5nZXQodGFiSWQpID8/IFByb21pc2UucmVzb2x2ZSgpO1xuICBjb25zdCBuZXh0ID0gcHJldi50aGVuKCgpID0+IHRhc2soKSkuY2F0Y2goKGUpID0+IHsgY29uc29sZS53YXJuKExPRywgJ3F1ZXVlIHRhc2sgZmFpbGVkJywgZSk7IH0pO1xuICB0YWJRdWV1ZXMuc2V0KHRhYklkLCBuZXh0KTtcbiAgcmV0dXJuIG5leHQ7XG59O1xuXG4vLyBPbmUtc2hvdCBDUyByb3VuZC10cmlwOiBhc2sgdGhlIGNvbnRlbnQgc2NyaXB0IHRvIGhpZGUgaXRzIG92ZXJsYXkgdGhlblxuLy8gd2FpdCBmb3IgYWNrLiBXZSB1c2Ugc2VuZE1lc3NhZ2Ugd2l0aCBhIHRpbWVvdXQgc28gYSBDUyB0aGF0J3Mgc3R1Y2sgb3Jcbi8vIG5vdCBsb2FkZWQgY2FuJ3Qgd2VkZ2UgdGhlIHF1ZXVlLlxuY29uc3QgdGVsbENzID0gYXN5bmMgPFQgPSB1bmtub3duPih0YWJJZDogbnVtYmVyLCBwYXlsb2FkOiBhbnksIHRpbWVvdXRNcyA9IDYwMCk6IFByb21pc2U8VCB8IG51bGw+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFQgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgZmluaXNoID0gKHY6IFQgfCBudWxsKTogdm9pZCA9PiB7IGlmICghZG9uZSkgeyBkb25lID0gdHJ1ZTsgcmVzb2x2ZSh2KTsgfSB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gZmluaXNoKG51bGwpLCB0aW1lb3V0TXMpO1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgcGcocGF5bG9hZCksIChyZXBseSkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7IGZpbmlzaChudWxsKTsgcmV0dXJuOyB9XG4gICAgICAgIGZpbmlzaCgocmVwbHkgPz8gbnVsbCkgYXMgVCB8IG51bGwpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7IGZpbmlzaChudWxsKTsgfVxuICB9KTtcbn07XG5cbi8vIFJ1biBhIGZ1bmN0aW9uIGluc2lkZSB0aGUgcGFnZSdzIG1haW4gd29ybGQgKG9yIGlzb2xhdGVkLCBkb2Vzbid0IG1hdHRlclxuLy8gaGVyZSBiZWNhdXNlIHdlIG9ubHkgcmVhZCBsYXlvdXQgbnVtYmVycykuIGFyZ3MgaXMgcGFzc2VkIHBvc2l0aW9uYWxseS5cbmNvbnN0IHJ1bkluUGFnZSA9IGFzeW5jIDxUPihcbiAgdGFiSWQ6IG51bWJlcixcbiAgZnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBULFxuICBhcmdzOiBhbnlbXSA9IFtdLFxuKTogUHJvbWlzZTxUIHwgbnVsbD4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWR9LFxuICAgICAgZnVuYzogZnVuYyBhcyBhbnksXG4gICAgICBhcmdzLFxuICAgIH0pO1xuICAgIHJldHVybiAocmVzdWx0cz8uWzBdPy5yZXN1bHQgPz8gbnVsbCkgYXMgVCB8IG51bGw7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAncnVuSW5QYWdlJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbi8vIENvbXB1dGUgdW5pb24gYmJveCBvZiBzZWxlY3RvcnMgSU5TSURFIHRoZSBwYWdlLCBzY3JvbGwgaXQgaW50byB2aWV3LCBhbmRcbi8vIHJldHVybiB0aGUgYmJveCArIGRwciBmb3IgY3JvcHBpbmcuIHBhZGRpbmcgaXMgYXBwbGllZCBzeW1tZXRyaWNhbGx5LlxudHlwZSBCYm94UmVzdWx0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7IHZ3OiBudW1iZXI7IHZoOiBudW1iZXJ9O1xuY29uc3QgY29tcHV0ZUFuZFNjcm9sbCA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgc2VsZWN0b3JzOiBzdHJpbmdbXSxcbiAgcGFkZGluZzogbnVtYmVyLFxuKTogUHJvbWlzZTxCYm94UmVzdWx0IHwgbnVsbD4gPT4ge1xuICByZXR1cm4gcnVuSW5QYWdlPEJib3hSZXN1bHQgfCBudWxsPih0YWJJZCwgKHNlbHM6IHN0cmluZ1tdLCBwYWQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGVscyA9IHNlbHMubWFwKChzKSA9PiB7XG4gICAgICB0cnkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKTsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gICAgfSkuZmlsdGVyKChlKTogZSBpcyBFbGVtZW50ID0+IEJvb2xlYW4oZSkpO1xuICAgIGlmICghZWxzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcmVjdHNCZWZvcmUgPSBlbHMubWFwKChlKSA9PiBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBjb25zdCB1TWluWCA9IE1hdGgubWluKC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5sZWZ0KSk7XG4gICAgY29uc3QgdU1pblkgPSBNYXRoLm1pbiguLi5yZWN0c0JlZm9yZS5tYXAoKHIpID0+IHIudG9wKSk7XG4gICAgY29uc3QgdU1heFggPSBNYXRoLm1heCguLi5yZWN0c0JlZm9yZS5tYXAoKHIpID0+IHIucmlnaHQpKTtcbiAgICBjb25zdCB1TWF4WSA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5ib3R0b20pKTtcbiAgICAvLyBET04nVCBzY3JvbGwgd2hlbiB0aGUgdGFyZ2V0IGlzIGFscmVhZHkgb24gc2NyZWVuIOKAlCBzY3JvbGxpbmcgYSB2aXNpYmxlXG4gICAgLy8gZWxlbWVudCB0byBjZW50ZXIgaXMgdGhlIGphcnJpbmcganVtcCB0aGUgb3BlcmF0b3IgZmxhZ2dlZCwgYW5kIGl0J3NcbiAgICAvLyB0aGUgY29tbW9uIGNhc2UgKHlvdSBjYXB0dXJlIHdoYXQgeW91IGNhbiBzZWUpLiBPbmx5IHNjcm9sbCB3aGVuIHRoZVxuICAgIC8vIGVsZW1lbnQgaXMgb2ZmLXNjcmVlbiBvciBjbGlwcGVkIChsYXp5IGltYWdlcyBiZWxvdyB0aGUgZm9sZCBuZWVkIGl0KS5cbiAgICBjb25zdCBmdWxseVZpc2libGUgPSB1TWluWCA+PSAwICYmIHVNaW5ZID49IDAgJiYgdU1heFggPD0gd2luZG93LmlubmVyV2lkdGggJiYgdU1heFkgPD0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGlmICghZnVsbHlWaXNpYmxlKSB7XG4gICAgICBjb25zdCBjeCA9ICh1TWluWCArIHVNYXhYKSAvIDIgKyB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgIGNvbnN0IGN5ID0gKHVNaW5ZICsgdU1heFkpIC8gMiArIHdpbmRvdy5zY3JvbGxZO1xuICAgICAgY29uc3QgdGFyZ2V0WCA9IE1hdGgubWF4KDAsIGN4IC0gd2luZG93LmlubmVyV2lkdGggLyAyKTtcbiAgICAgIGNvbnN0IHRhcmdldFkgPSBNYXRoLm1heCgwLCBjeSAtIHdpbmRvdy5pbm5lckhlaWdodCAvIDIpO1xuICAgICAgd2luZG93LnNjcm9sbFRvKHtsZWZ0OiB0YXJnZXRYLCB0b3A6IHRhcmdldFksIGJlaGF2aW9yOiAnaW5zdGFudCcgYXMgU2Nyb2xsQmVoYXZpb3J9KTtcbiAgICB9XG5cbiAgICAvLyBSZWNvbXB1dGUgYmJveGVzIGFmdGVyIHNjcm9sbC5cbiAgICBjb25zdCByZWN0cyA9IGVscy5tYXAoKGUpID0+IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIubGVmdCkpIC0gcGFkO1xuICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIudG9wKSkgLSBwYWQ7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcCgocikgPT4gci5yaWdodCkpICsgcGFkO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoKHIpID0+IHIuYm90dG9tKSkgKyBwYWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1pblgsXG4gICAgICB5OiBtaW5ZLFxuICAgICAgdzogbWF4WCAtIG1pblgsXG4gICAgICBoOiBtYXhZIC0gbWluWSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHZ3OiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHZoOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgfTtcbiAgfSwgW3NlbGVjdG9ycywgcGFkZGluZ10pO1xufTtcblxuLy8gT25lLWZyYW1lIHlpZWxkIGluc2lkZSB0aGUgcGFnZSBzbyBhbnkgcG9zdC1zY3JvbGwgbGF5b3V0IHNldHRsZXMuIFdlIHBpblxuLy8gdG8gdHdvIHJBRnMgdG8gYmUgY29uc2VydmF0aXZlIOKAlCBwYWdlcyB3aXRoIHN0aWNreSBoZWFkZXJzIHNvbWV0aW1lcyBuZWVkXG4vLyB0aGUgc2Vjb25kIGZyYW1lIHRvIHJlcGFpbnQgdGhlIGhlYWRlciBhdCBpdHMgbmV3IG9mZnNldC5cbmNvbnN0IHlpZWxkUmFmID0gYXN5bmMgKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoKSA9PlxuICAgIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXNvbHZlKCkpKSksXG4gICk7XG59O1xuXG4vLyBSZXN0b3JlIHRoZSBwYWdlIHNjcm9sbCBwb3NpdGlvbiBhZnRlciBzdGl0Y2hpbmcuIFRoZSBvcmlnaW5hbCBwb3NpdGlvbnNcbi8vIGFyZSBwYXNzZWQgYmFjayBmcm9tIHRoZSBzdGl0Y2ggbG9vcC5cbmNvbnN0IHJlc3RvcmVTY3JvbGwgPSBhc3luYyAodGFiSWQ6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoc3g6IG51bWJlciwgc3k6IG51bWJlcikgPT4ge1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogc3gsIHRvcDogc3ksIGJlaGF2aW9yOiAnaW5zdGFudCcgYXMgU2Nyb2xsQmVoYXZpb3J9KTtcbiAgfSwgW3gsIHldKTtcbn07XG5cbmNvbnN0IFBBR0VfQ0hVTktfTElNSVQgPSA4O1xuY29uc3QgQ0FOVkFTX1BJWEVMX0xJTUlUID0gMTYzODQ7IC8vIE9mZnNjcmVlbkNhbnZhcyBzYWZldHkgY2FwXG5cbi8vIFBhZ2UgKGZ1bGwtZG9jdW1lbnQpIHNob3QuIExvb3BzIGNhcHR1cmVWaXNpYmxlVGFiIHdoaWxlIHNjcm9sbGluZyBieVxuLy8gdmlld3BvcnQtaGVpZ2h0IGNodW5rczsgc3RvcHMgYXQgY2h1bmsgY291bnQsIHBpeGVsIGNhcCwgb3Igc2Nyb2xsSGVpZ2h0LlxuY29uc3Qgc3RpdGNoUGFnZSA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsPiA9PiB7XG4gIC8vIFNuYXBzaG90IHNjcm9sbCBnZW9tZXRyeSB1cCBmcm9udC5cbiAgY29uc3QgZ2VvbSA9IGF3YWl0IHJ1bkluUGFnZTx7dnc6IG51bWJlcjsgdmg6IG51bWJlcjsgc3c6IG51bWJlcjsgc2g6IG51bWJlcjsgZHByOiBudW1iZXI7IHN4OiBudW1iZXI7IHN5OiBudW1iZXJ9PihcbiAgICB0YWJJZCxcbiAgICAoKSA9PiAoe1xuICAgICAgdnc6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgdmg6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIHN3OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGgsIGRvY3VtZW50LmJvZHk/LnNjcm9sbFdpZHRoID8/IDApLFxuICAgICAgc2g6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmJvZHk/LnNjcm9sbEhlaWdodCA/PyAwKSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHN4OiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgIHN5OiB3aW5kb3cuc2Nyb2xsWSxcbiAgICB9KSxcbiAgKTtcbiAgaWYgKCFnZW9tKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkcHIgPSBnZW9tLmRwcjtcbiAgY29uc3QgdG90YWxIID0gZ2VvbS5zaDtcbiAgY29uc3QgdG90YWxIcHggPSBNYXRoLnJvdW5kKHRvdGFsSCAqIGRwcik7XG4gIGNvbnN0IHdpZHRoUHggPSBNYXRoLnJvdW5kKGdlb20udncgKiBkcHIpO1xuXG4gIC8vIElmIHRoZSBwYWdlIGlzIHNob3J0IGVub3VnaCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LCBzaW5nbGUgc2hvdC5cbiAgbGV0IGNodW5rcyA9IDA7XG4gIGxldCB5ID0gMDtcbiAgbGV0IHN0aXRjaGVkSHB4ID0gMDtcbiAgbGV0IHRydW5jYXRlZCA9IGZhbHNlO1xuXG4gIC8vIEFsbG9jYXRlIHRoZSBjYW52YXMgYXQgdGhlIGNvbnNlcnZhdGl2ZSBmaW5hbCBzaXplOyB3ZSdsbCB0cmltIGxhdGVyIGlmXG4gIC8vIHdlIHN0b3AgZWFybHkuIHdpZHRoIGlzIGZpeGVkOyBoZWlnaHQgZ3Jvd3MgdXAgdG8gbWluKHRvdGFsSHB4LCBjYXApLlxuICBjb25zdCB0YXJnZXRIcHggPSBNYXRoLm1pbih0b3RhbEhweCwgQ0FOVkFTX1BJWEVMX0xJTUlUKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aFB4LCB0YXJnZXRIcHgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cbiAgd2hpbGUgKHkgPCB0b3RhbEgpIHtcbiAgICBpZiAoY2h1bmtzID49IFBBR0VfQ0hVTktfTElNSVQpIHsgdHJ1bmNhdGVkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICBpZiAoc3RpdGNoZWRIcHggPj0gQ0FOVkFTX1BJWEVMX0xJTUlUKSB7IHRydW5jYXRlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoeXk6IG51bWJlcikgPT4ge1xuICAgICAgd2luZG93LnNjcm9sbFRvKHtsZWZ0OiAwLCB0b3A6IHl5LCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG4gICAgfSwgW3ldKTtcbiAgICBhd2FpdCB5aWVsZFJhZih0YWJJZCk7XG4gICAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgICB0cnkge1xuICAgICAgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdjYXB0dXJlVmlzaWJsZVRhYiBwYWdlIGNodW5rIGZhaWxlZCcsIGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IGJtID0gYXdhaXQgZGF0YVVybFRvQml0bWFwKGRhdGFVcmwpO1xuICAgIC8vIERldGVybWluZSBob3cgbXVjaCBvZiBUSElTIGNodW5rIHRvIGRyYXcuIFRoZSBsYXN0IGNodW5rIHVzdWFsbHlcbiAgICAvLyBvdmVybGFwcyB0aGUgcHJldmlvdXMgb25lIChiZWNhdXNlIHRvdGFsSCBpcyBub3QgYSB2aWV3cG9ydCBtdWx0aXBsZSk7XG4gICAgLy8gZHJhd2luZyB0aGUgZnVsbCBiaXRtYXAgd291bGQgZHVwbGljYXRlIHBpeGVscy4gU28gd2UgY3JvcCBieSB0aGVcbiAgICAvLyByZW1haW5kZXIgb2YgdGhlIHBhZ2UgaGVpZ2h0IHdoZW4gb24gdGhlIHRhaWwuXG4gICAgY29uc3QgcmVtYWluaW5nUHggPSBNYXRoLnJvdW5kKCh0b3RhbEggLSB5KSAqIGRwcik7XG4gICAgY29uc3QgZHJhd1NyY0ggPSBNYXRoLm1pbihibS5oZWlnaHQsIHJlbWFpbmluZ1B4KTtcbiAgICBjb25zdCBkcmF3RGVzdEggPSBNYXRoLm1pbih0YXJnZXRIcHggLSBzdGl0Y2hlZEhweCwgZHJhd1NyY0gpO1xuICAgIGlmIChkcmF3RGVzdEggPD0gMCkgeyB0cnVuY2F0ZWQgPSB0cnVlOyBicmVhazsgfVxuICAgIGN0eC5kcmF3SW1hZ2UoYm0sIDAsIDAsIGJtLndpZHRoLCBkcmF3RGVzdEgsIDAsIHN0aXRjaGVkSHB4LCBibS53aWR0aCwgZHJhd0Rlc3RIKTtcbiAgICBzdGl0Y2hlZEhweCArPSBkcmF3RGVzdEg7XG4gICAgY2h1bmtzKys7XG4gICAgeSArPSBnZW9tLnZoO1xuICAgIGJtLmNsb3NlPy4oKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgc2Nyb2xsLlxuICBhd2FpdCByZXN0b3JlU2Nyb2xsKHRhYklkLCBnZW9tLnN4LCBnZW9tLnN5KTtcblxuICAvLyBUcmltIGNhbnZhcyB0byBhY3R1YWwgc3RpdGNoZWQgaGVpZ2h0IGlmIHdlIHN0b3BwZWQgYmVmb3JlIHRhcmdldEhweC5cbiAgbGV0IG91dENhbnZhcyA9IGNhbnZhcztcbiAgaWYgKHN0aXRjaGVkSHB4IDwgdGFyZ2V0SHB4KSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGhQeCwgTWF0aC5tYXgoMSwgc3RpdGNoZWRIcHgpKTtcbiAgICBjb25zdCB0Y3R4ID0gdHJpbW1lZC5nZXRDb250ZXh0KCcyZCcpITtcbiAgICB0Y3R4LmRyYXdJbWFnZShjYW52YXMsIDAsIDApO1xuICAgIG91dENhbnZhcyA9IHRyaW1tZWQ7XG4gIH1cbiAgY29uc3QgYmxvYiA9IGF3YWl0IGNhbnZhc1RvQmxvYihvdXRDYW52YXMpO1xuICBjb25zdCBiaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChibG9iKTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRydW5jYXRlZH07XG59O1xuXG4vLyBFbGVtZW50L2dyb3VwIHNob3Q6IGhpZGUgb3ZlcmxheXMsIGNhcHR1cmUgdmlld3BvcnQsIGNyb3AgaW4gY2FudmFzLlxuY29uc3Qgc2hvdEVsZW1lbnRDb21tb24gPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4gIHNlbGVjdG9yczogc3RyaW5nW10sXG4gIHBhZGRpbmc6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ119IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgLy8gSXRlbSAxNyAoZmxhc2hpbmcpOiBoaWRlICsgZnJlZXplIG92ZXJsYXlzIEJFRk9SRSB3ZSBzY3JvbGwgdGhlIHBhZ2UgdG9cbiAgLy8gZnJhbWUgdGhlIGNhcHR1cmUuIFRoZSBvbGQgb3JkZXIgc2Nyb2xsZWQgZmlyc3QsIHNvIHRoZSBjb250ZW50IHNjcmlwdCdzXG4gIC8vIHJpbmcgckFGIGxvb3BzIGNoYXNlZCB0aGUgbmV3IHNjcm9sbCBvZmZzZXQgKGEgdmlzaWJsZSBqdW1wKSBiZWZvcmUgdGhleVxuICAvLyB3ZXJlIGhpZGRlbiwgYW5kIGEgZ3JvdXBlZCBjYXB0dXJlJ3MgbWFueSByaW5ncyBhbXBsaWZpZWQgdGhlIGZsaWNrZXIuXG4gIC8vIEhpZGluZyBmaXJzdCBtZWFucyB0aGUgd2hvbGUgc2Nyb2xs4oaSeWllbGTihpJjYXB0dXJl4oaScmVzdG9yZSB3aW5kb3cgaGFwcGVuc1xuICAvLyB3aXRoIHRoZSBvdmVybGF5IGZyb3plbiBhbmQgb3V0IG9mIGxheW91dCDigJQgbm8gb24tc2NyZWVuIGZsYXNoLlxuICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnaGlkZS1vdmVybGF5cyd9KTtcbiAgLy8gUmVtZW1iZXIgdGhlIG9wZXJhdG9yJ3Mgc2Nyb2xsIHNvIGEgY2FwdHVyZSBuZXZlciBsZWF2ZXMgdGhlIHBhZ2UgbW92ZWQuXG4gIC8vIGNvbXB1dGVBbmRTY3JvbGwgb25seSBzY3JvbGxzIHdoZW4gdGhlIHRhcmdldCBpcyBvZmYtc2NyZWVuIChhIGdyb3VwXG4gIC8vIHRoYXQgc25hcHBlZCBwYXN0IHRoZSBmb2xkKTsgd2UgYWx3YXlzIHJlc3RvcmUgYWZ0ZXJ3YXJkIHJlZ2FyZGxlc3MuXG4gIGNvbnN0IG9yaWdTY3JvbGwgPSBhd2FpdCBydW5JblBhZ2U8e3g6IG51bWJlcjsgeTogbnVtYmVyfT4odGFiSWQsICgpID0+ICh7eDogd2luZG93LnNjcm9sbFgsIHk6IHdpbmRvdy5zY3JvbGxZfSkpID8/IHt4OiAwLCB5OiAwfTtcbiAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgbGV0IGJib3g6IEJib3hSZXN1bHQgfCBudWxsID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBiYm94ID0gYXdhaXQgY29tcHV0ZUFuZFNjcm9sbCh0YWJJZCwgc2VsZWN0b3JzLCBwYWRkaW5nKTtcbiAgICBpZiAoIWJib3gpIHJldHVybiBudWxsO1xuICAgIGF3YWl0IHlpZWxkUmFmKHRhYklkKTtcbiAgICBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIod2luZG93SWQsIHtmb3JtYXQ6ICdwbmcnfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnY2FwdHVyZVZpc2libGVUYWIgZmFpbGVkJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgcmVzdG9yZVNjcm9sbCh0YWJJZCwgb3JpZ1Njcm9sbC54LCBvcmlnU2Nyb2xsLnkpO1xuICAgIGF3YWl0IHRlbGxDcyh0YWJJZCwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ30pO1xuICB9XG5cbiAgY29uc3QgYm0gPSBhd2FpdCBkYXRhVXJsVG9CaXRtYXAoZGF0YVVybCk7XG4gIC8vIENvbnZlcnQgQ1NTLXBpeGVsIGJib3gg4oaSIGRldmljZS1waXhlbCBiYm94OyBjbGFtcCB0byBiaXRtYXAgYm91bmRzIHNvXG4gIC8vIGEgcGFydGlhbGx5IG9mZi1zY3JlZW4gZWxlbWVudCBkb2Vzbid0IGNyYXNoIGRyYXdJbWFnZS5cbiAgY29uc3Qgc3ggPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGJib3gueCAqIGJib3guZHByKSk7XG4gIGNvbnN0IHN5ID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChiYm94LnkgKiBiYm94LmRwcikpO1xuICBjb25zdCBzdyA9IE1hdGgubWF4KDEsIE1hdGgubWluKGJtLndpZHRoIC0gc3gsIE1hdGgucm91bmQoYmJveC53ICogYmJveC5kcHIpKSk7XG4gIGNvbnN0IHNoID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oYm0uaGVpZ2h0IC0gc3ksIE1hdGgucm91bmQoYmJveC5oICogYmJveC5kcHIpKSk7XG4gIGNvbnN0IGNhbnZhcyA9IG5ldyBPZmZzY3JlZW5DYW52YXMoc3csIHNoKTtcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuICBjdHguZHJhd0ltYWdlKGJtLCBzeCwgc3ksIHN3LCBzaCwgMCwgMCwgc3csIHNoKTtcbiAgYm0uY2xvc2U/LigpO1xuICBjb25zdCBibG9iID0gYXdhaXQgY2FudmFzVG9CbG9iKGNhbnZhcyk7XG4gIGNvbnN0IGJpdG1hcCA9IGF3YWl0IGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xuICAvLyBCdWcgIzMgZnJvbSB0aGUgZXhwb3J0IHJvYXN0OiBzdXJmYWNlIGNyb3AgbWV0YWRhdGEgc28gcmVjZWl2ZXJzXG4gIC8vIGNhbiBtYXAgYmV0d2VlbiB0aGUgc3RvcmVkIFBORyBhbmQgdGhlIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMuXG4gIC8vIGNzc1JlY3QgPSBwcmUtRFBSIENTUyBwaXhlbCByZWN0IG9mIHRoZSBjYXB0dXJlZCByZWdpb24uXG4gIC8vIGRldmljZVB4UmVjdCA9IHBvc3QtRFBSIHBpeGVsIHJlY3QgaW5zaWRlIHRoZSBzb3VyY2UgYml0bWFwLlxuICAvLyBpbWFnZVNpemUgPSBkaW1lbnNpb25zIG9mIHRoZSBwcm9kdWNlZCBQTkcuXG4gIC8vIGRwciA9IHRoZSBjb252ZXJzaW9uIGZhY3Rvci5cbiAgY29uc3QgY3JvcE1ldGE6IFNob3RSZXBseVsnY3JvcCddID0ge1xuICAgIGNzc1JlY3Q6IHt4OiBiYm94LngsIHk6IGJib3gueSwgdzogYmJveC53LCBoOiBiYm94Lmh9LFxuICAgIGRldmljZVB4UmVjdDoge3g6IHN4LCB5OiBzeSwgdzogc3csIGg6IHNofSxcbiAgICBpbWFnZVNpemU6IHt3OiBzdywgaDogc2h9LFxuICAgIGRwcjogYmJveC5kcHIsXG4gICAgcGFkZGluZyxcbiAgICBzZWxlY3RvcnMsXG4gIH07XG4gIHJldHVybiB7YmxvYiwgYml0bWFwLCB0YWJVcmwsIGNyb3BNZXRhfTtcbn07XG5cbi8vIFBhZ2Utb25seSBwYXRoLiBIaWRlcyBvdmVybGF5cywgc3RpdGNoZXMsIHJlc3RvcmVzLlxuY29uc3Qgc2hvdFBhZ2VDb21tb24gPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4pOiBQcm9taXNlPHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0YWJVcmw6IHN0cmluZzsgdHJ1bmNhdGVkOiBib29sZWFufSB8IG51bGw+ID0+IHtcbiAgY29uc3QgdGFiID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHRhYklkKTtcbiAgY29uc3QgdGFiVXJsID0gdGFiPy51cmwgPz8gJyc7XG4gIGF3YWl0IHRlbGxDcyh0YWJJZCwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ30pO1xuICBsZXQgc3RpdGNoZWQ6IHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbCA9IG51bGw7XG4gIHRyeSB7XG4gICAgc3RpdGNoZWQgPSBhd2FpdCBzdGl0Y2hQYWdlKHRhYklkLCB3aW5kb3dJZCk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfSk7XG4gIH1cbiAgaWYgKCFzdGl0Y2hlZCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7Li4uc3RpdGNoZWQsIHRhYlVybH07XG59O1xuXG4vLyBTYXZlIHRoZSBibG9iIGFzIGEgZG93bmxvYWQgdW5kZXIgLnBpbmNoZ3JhYi88d29ya3NwYWNlPi88c3ViZGlyPi8uXG4vL1xuLy8gTVYzIHNlcnZpY2Ugd29ya2VycyBETyBOT1QgaGF2ZSBVUkwuY3JlYXRlT2JqZWN0VVJMIOKAlCBjYWxsaW5nIGl0IHRocm93c1xuLy8gXCJVUkwuY3JlYXRlT2JqZWN0VVJMIGlzIG5vdCBhIGZ1bmN0aW9uXCIgKHZlcmlmaWVkIGxpdmUgaW4gZXh0ZW5zaW9uLnNwZWMpLlxuLy8gV2UgYmFzZTY0LWVuY29kZSB0aGUgYmxvYiBpbnRvIGEgZGF0YSBVUkwgaW5zdGVhZC4gVHJhZGVvZmY6IHRoZSBkYXRhXG4vLyBVUkwgaXMgfjMzJSBsYXJnZXIgdGhhbiByYXcgYnl0ZXMsIGFuZCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGhhcyBhXG4vLyBkYXRhLVVSTCBzaXplIGxpbWl0IHNvbWV3aGVyZSBhcm91bmQgMzIgTUI7IGZvciB0eXBpY2FsIHdvcmtzcGFjZVxuLy8gZXhwb3J0cyAoc3ViLU1CIEpTT05MICsgbG93LU1CIFpJUHMpIHRoaXMgaXMgd2VsbCB1bmRlciB0aGUgbGltaXQuXG50eXBlIFNhdmVkRmlsZSA9IHtcbiAgcmVsUGF0aDogc3RyaW5nO1xuICBhYnNQYXRoOiBzdHJpbmc7XG4gIGNvcHlQYXRoOiBzdHJpbmc7XG4gIHRlbXBQYXRoOiBib29sZWFuO1xuICBkb3dubG9hZFN0YXRlPzogY2hyb21lLmRvd25sb2Fkcy5Eb3dubG9hZEl0ZW1bJ3N0YXRlJ107XG59O1xuXG5jb25zdCBpc1BsYXl3cmlnaHRBcnRpZmFjdFBhdGggPSAocGF0aDogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAvKD86XnxbXFxcXC9dKSg/OnBsYXl3cmlnaHQtYXJ0aWZhY3RzfHBpbmNoZ3JhYi1kbCktW15cXFxcL10rW1xcXFwvXVswLTlhLWYtXXs4fS1bMC05YS1mLV17NH0tWzAtOWEtZi1dezR9LVswLTlhLWYtXXs0fS1bMC05YS1mLV17MTJ9JC9pLnRlc3QocGF0aCk7XG5cbmNvbnN0IGJsb2JUb0RhdGFVcmwgPSBhc3luYyAoYmxvYjogQmxvYik6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IGJ1ZiA9IGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAvLyBCdWlsZCBiYXNlNjQgaW4gMzIgS2lCIGNodW5rcyBzbyBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5IGRvZXNuJ3RcbiAgLy8gb3ZlcmZsb3cgdGhlIGNhbGwgc3RhY2sgb24gbGFyZ2UgaW5wdXRzLlxuICBsZXQgYmluYXJ5ID0gJyc7XG4gIGNvbnN0IGNodW5rID0gMHg4MF8wMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gY2h1bmspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBBcnJheS5mcm9tKGJ5dGVzLnN1YmFycmF5KGksIGkgKyBjaHVuaykpKTtcbiAgfVxuICBjb25zdCBtaW1lID0gYmxvYi50eXBlIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICByZXR1cm4gYGRhdGE6JHttaW1lfTtiYXNlNjQsJHtidG9hKGJpbmFyeSl9YDtcbn07XG5cbi8vIOKUgOKUgOKUgCBRdWlldCBzYXZlcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdpdGggdGhlIG9wdGlvbmFsIGBkb3dubG9hZHMudWlgIHBlcm1pc3Npb24gZ3JhbnRlZCBhbmQgdGhlIHF1aWV0U2F2ZXNcbi8vIHByZWYgb24sIENocm9tZSdzIGRvd25sb2FkIGJ1YmJsZSBpcyBzdXBwcmVzc2VkIHdoaWxlIFBpbmNoR3JhYiB3cml0ZXMgaXRzXG4vLyBvd24gZmlsZXMsIHRoZW4gcmVzdG9yZWQgYWZ0ZXIgYSBzaG9ydCBkZWJvdW5jZSBzbyBiYWNrLXRvLWJhY2sgY2FwdHVyZXNcbi8vIGRvbid0IGZsYXAgdGhlIFVJIGFuZCB0aGUgdXNlcidzIG90aGVyIGRvd25sb2FkcyBrZWVwIHRoZWlyIHN1cmZhY2UuXG4vLyBEZXB0aC1jb3VudGVkOiBjb25jdXJyZW50IHNhdmVzIHNoYXJlIG9uZSBzdXBwcmVzc2lvbiB3aW5kb3cuXG5jb25zdCBRVUlFVF9SRVNUT1JFX01TID0gMTUwMDtcbmxldCBxdWlldERlcHRoID0gMDtcbmxldCBxdWlldFJlc3RvcmVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG5jb25zdCBzZXREb3dubG9hZFVpID0gKGVuYWJsZWQ6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBhcGkgPSAoY2hyb21lLmRvd25sb2FkcyBhcyB1bmtub3duIGFzIHtzZXRVaU9wdGlvbnM/OiAobzoge2VuYWJsZWQ6IGJvb2xlYW59KSA9PiBQcm9taXNlPHZvaWQ+fSkuc2V0VWlPcHRpb25zO1xuICAgIGlmIChhcGkpIHZvaWQgYXBpLmNhbGwoY2hyb21lLmRvd25sb2Fkcywge2VuYWJsZWR9KS5jYXRjaCgoZTogdW5rbm93bikgPT4gY29uc29sZS53YXJuKExPRywgJ3NldFVpT3B0aW9ucycsIGUpKTtcbiAgfSBjYXRjaCAoZSkgeyBjb25zb2xlLndhcm4oTE9HLCAnc2V0VWlPcHRpb25zIHRocmV3JywgZSk7IH1cbn07XG5jb25zdCBxdWlldFNhdmVzQWN0aXZlID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHN0b3JlID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdwaW5jaGdyYWIucHJlZnMudjInKTtcbiAgICBjb25zdCBwcmVmcyA9IHN0b3JlWydwaW5jaGdyYWIucHJlZnMudjInXSBhcyB7cXVpZXRTYXZlcz86IGJvb2xlYW59IHwgdW5kZWZpbmVkO1xuICAgIGlmICghcHJlZnM/LnF1aWV0U2F2ZXMpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pO1xuICB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG59O1xuY29uc3QgYmVnaW5RdWlldCA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgaWYgKCEoYXdhaXQgcXVpZXRTYXZlc0FjdGl2ZSgpKSkgcmV0dXJuIGZhbHNlO1xuICBxdWlldERlcHRoKys7XG4gIGlmIChxdWlldFJlc3RvcmVUaW1lcikgeyBjbGVhclRpbWVvdXQocXVpZXRSZXN0b3JlVGltZXIpOyBxdWlldFJlc3RvcmVUaW1lciA9IHVuZGVmaW5lZDsgfVxuICBzZXREb3dubG9hZFVpKGZhbHNlKTtcbiAgcmV0dXJuIHRydWU7XG59O1xuY29uc3QgZW5kUXVpZXQgPSAoKTogdm9pZCA9PiB7XG4gIGlmIChxdWlldERlcHRoID4gMCkgcXVpZXREZXB0aC0tO1xuICBpZiAocXVpZXREZXB0aCA9PT0gMCkge1xuICAgIGlmIChxdWlldFJlc3RvcmVUaW1lcikgY2xlYXJUaW1lb3V0KHF1aWV0UmVzdG9yZVRpbWVyKTtcbiAgICBxdWlldFJlc3RvcmVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4geyBxdWlldFJlc3RvcmVUaW1lciA9IHVuZGVmaW5lZDsgc2V0RG93bmxvYWRVaSh0cnVlKTsgfSwgUVVJRVRfUkVTVE9SRV9NUyk7XG4gIH1cbn07XG4vLyBXb3JrZXItc3RhcnQgcmVzdG9yZSBndWFyZDogaWYgYSBwcmV2aW91cyB3b3JrZXIgZGllZCBtaWQtc3VwcHJlc3Npb24gdGhlXG4vLyBidWJibGUgd291bGQgc3RheSBoaWRkZW4gZm9yIGV2ZXJ5IGRvd25sb2FkIGluIHRoZSBicm93c2VyLiBzZXRVaU9wdGlvbnNcbi8vIHN0YXRlIG91dGxpdmVzIHRoZSB3b3JrZXIsIHNvIHJlLWVuYWJsZSBvbiBldmVyeSBzdGFydCAocGVybWlzc2lvbi1nYXRlZCxcbi8vIG5vLW9wIG90aGVyd2lzZSkuXG52b2lkIGNocm9tZS5wZXJtaXNzaW9ucz8uY29udGFpbnMoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSlcbiAgLnRoZW4oKGdyYW50ZWQpID0+IHsgaWYgKGdyYW50ZWQpIHNldERvd25sb2FkVWkodHJ1ZSk7IH0pXG4gIC5jYXRjaCgoKSA9PiB7IC8qIHBlcm1pc3Npb25zIEFQSSB1bmF2YWlsYWJsZSBpbiBzb21lIGhhcm5lc3NlcyAqLyB9KTtcblxuY29uc3Qgc2F2ZURvd25sb2FkID0gYXN5bmMgKFxuICBibG9iOiBCbG9iLFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgc3ViZGlyID0gJ3NjcmVlbnNob3RzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IHJlbFBhdGggPSBzdWJkaXIgPyBgJHtzdWJkaXJ9LyR7ZmlsZW5hbWV9YCA6IGZpbGVuYW1lO1xuICBjb25zdCBmdWxsUGF0aCA9IGBwaW5jaGdyYWIvJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gO1xuICBjb25zb2xlLmxvZyhMT0csICdzYXZlRG93bmxvYWQgc3RhcnQnLCB7ZnVsbFBhdGgsIG1pbWU6IGJsb2IudHlwZSwgc2l6ZTogYmxvYi5zaXplfSk7XG4gIGNvbnN0IHF1aWV0ID0gYXdhaXQgYmVnaW5RdWlldCgpO1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBzYXZlRG93bmxvYWRJbm5lcihibG9iLCB3b3Jrc3BhY2UsIHJlbFBhdGgsIGZ1bGxQYXRoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAocXVpZXQpIGVuZFF1aWV0KCk7XG4gIH1cbn07XG5cbmNvbnN0IHNhdmVEb3dubG9hZElubmVyID0gYXN5bmMgKFxuICBibG9iOiBCbG9iLFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgcmVsUGF0aDogc3RyaW5nLFxuICBmdWxsUGF0aDogc3RyaW5nLFxuKTogUHJvbWlzZTxTYXZlZEZpbGU+ID0+IHtcbiAgY29uc3QgdXJsID0gYXdhaXQgYmxvYlRvRGF0YVVybChibG9iKTtcbiAgY29uc3QgZG93bmxvYWRJZCA9IGF3YWl0IG5ldyBQcm9taXNlPG51bWJlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQoXG4gICAgICB7dXJsLCBmaWxlbmFtZTogZnVsbFBhdGgsIGNvbmZsaWN0QWN0aW9uOiAnb3ZlcndyaXRlJ30sXG4gICAgICAoaWQpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBsYXN0RXJyb3I6JywgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKTtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlID8/ICdkb3dubG9hZCBmYWlsZWQnKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihMT0csICdjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIHJldHVybmVkIG5vIGlkJyk7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZG93bmxvYWQgcmV0dXJuZWQgbm8gaWQnKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoaWQpO1xuICAgICAgfSxcbiAgICApO1xuICB9KTtcbiAgY29uc29sZS5sb2coTE9HLCAnY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBhY2NlcHRlZCcsIHtpZDogZG93bmxvYWRJZCwgZnVsbFBhdGh9KTtcbiAgLy8gUmVzb2x2ZSB0aGUgT1MtYWJzb2x1dGUgcGF0aCBhbmQgZG8gbm90IHJlcG9ydCBzdWNjZXNzIHVudGlsIENocm9tZSBzYXlzXG4gIC8vIHRoZSBkb3dubG9hZCBjb21wbGV0ZWQuIGBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkYCBvbmx5IG1lYW5zIFwiYWNjZXB0ZWRcIjtcbiAgLy8gZGlzay1mdWxsLCBwZXJtaXNzaW9uLCBvciBpbnRlcnJ1cHRlZCB3cml0ZXMgc3VyZmFjZSBsYXRlciB0aHJvdWdoXG4gIC8vIGRvd25sb2Fkcy5zZWFyY2guXG4gIGxldCBhYnNQYXRoID0gYCR7d29ya3NwYWNlfS8ke3JlbFBhdGh9YDtcbiAgbGV0IGRvd25sb2FkU3RhdGU6IGNocm9tZS5kb3dubG9hZHMuRG93bmxvYWRJdGVtWydzdGF0ZSddIHwgdW5kZWZpbmVkO1xuICBsZXQgaW50ZXJydXB0ZWRFcnJvciA9ICcnO1xuICBmb3IgKGxldCBhdHRlbXB0ID0gMDsgYXR0ZW1wdCA8IDEwMDsgYXR0ZW1wdCsrKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgY2hyb21lLmRvd25sb2Fkcy5zZWFyY2goe2lkOiBkb3dubG9hZElkfSk7XG4gICAgICBjb25zdCBpdGVtID0gaXRlbXM/LlswXTtcbiAgICAgIGlmIChpdGVtPy5maWxlbmFtZSkgYWJzUGF0aCA9IGl0ZW0uZmlsZW5hbWU7XG4gICAgICBkb3dubG9hZFN0YXRlID0gaXRlbT8uc3RhdGU7XG4gICAgICBpZiAoaXRlbT8uc3RhdGUgPT09ICdpbnRlcnJ1cHRlZCcpIHtcbiAgICAgICAgaW50ZXJydXB0ZWRFcnJvciA9IGBkb3dubG9hZCBpbnRlcnJ1cHRlZCR7aXRlbS5lcnJvciA/IGA6ICR7aXRlbS5lcnJvcn1gIDogJyd9YDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbT8uc3RhdGUgPT09ICdjb21wbGV0ZScgJiYgaXRlbS5maWxlbmFtZSkgYnJlYWs7XG4gICAgfSBjYXRjaCAoZSkgeyBjb25zb2xlLndhcm4oTE9HLCAnZG93bmxvYWRzLnNlYXJjaCB0aHJldzonLCBlKTsgfVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIDEwMCkpO1xuICB9XG4gIGlmIChpbnRlcnJ1cHRlZEVycm9yKSB0aHJvdyBuZXcgRXJyb3IoaW50ZXJydXB0ZWRFcnJvcik7XG4gIGlmIChkb3dubG9hZFN0YXRlICE9PSAnY29tcGxldGUnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBkb3dubG9hZCBkaWQgbm90IGNvbXBsZXRlJHtkb3dubG9hZFN0YXRlID8gYCAoc3RhdGU6ICR7ZG93bmxvYWRTdGF0ZX0pYCA6ICcnfWApO1xuICB9XG4gIGNvbnN0IHRlbXBQYXRoID0gaXNQbGF5d3JpZ2h0QXJ0aWZhY3RQYXRoKGFic1BhdGgpO1xuICAvLyBQbGF5d3JpZ2h0IHJld3JpdGVzIENocm9tZSBkb3dubG9hZHMgdG8gZXh0ZW5zaW9ubGVzcyBVVUlEIGZpbGVzIHVuZGVyXG4gIC8vIC90bXAvcGxheXdyaWdodC1hcnRpZmFjdHMtKjsgY29weWluZyB0aGF0IHRvIHRoZSB1c2VyIGlzIGNvbmZ1c2luZyBhbmRcbiAgLy8gb2Z0ZW4gc3RhbGUuIEtlZXAgaXQgaW4gYWJzUGF0aCBmb3IgdGVzdHMvZGVidWdnaW5nLCBidXQgZXhwb3NlIHRoZVxuICAvLyBpbnRlbmRlZCBicm93c2VyIGRvd25sb2FkIHRhcmdldCBmb3IgdGhlIHNpZGUgcGFuZWwncyBjbGlwYm9hcmQgYWN0aW9uLlxuICBjb25zdCBjb3B5UGF0aCA9IHRlbXBQYXRoID8gYH4vRG93bmxvYWRzLyR7ZnVsbFBhdGh9YCA6IGFic1BhdGg7XG4gIGNvbnNvbGUubG9nKExPRywgJ3NhdmVEb3dubG9hZCByZXR1cm5pbmcnLCB7cmVsUGF0aCwgYWJzUGF0aCwgY29weVBhdGgsIHRlbXBQYXRoLCBkb3dubG9hZFN0YXRlfSk7XG4gIHJldHVybiB7cmVsUGF0aDogYCR7d29ya3NwYWNlfS8ke3JlbFBhdGh9YCwgYWJzUGF0aCwgY29weVBhdGgsIHRlbXBQYXRoLCBkb3dubG9hZFN0YXRlfTtcbn07XG5cbmNvbnN0IHNhdmVUZXh0RG93bmxvYWQgPSBhc3luYyAoXG4gIHRleHQ6IHN0cmluZyxcbiAgd29ya3NwYWNlOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIG1pbWU6IHN0cmluZyxcbiAgc3ViZGlyID0gJ2V4cG9ydHMnLFxuKTogUHJvbWlzZTxTYXZlZEZpbGU+ID0+IHtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge3R5cGU6IG1pbWV9KTtcbiAgcmV0dXJuIHNhdmVEb3dubG9hZChibG9iLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBzdWJkaXIpO1xufTtcblxuY29uc3Qgc2F2ZUJ5dGVzRG93bmxvYWQgPSBhc3luYyAoXG4gIGJ5dGVzOiBVaW50OEFycmF5LFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgbWltZTogc3RyaW5nLFxuICBzdWJkaXIgPSAnZXhwb3J0cycsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2J5dGVzIGFzIHVua25vd24gYXMgQmxvYlBhcnRdLCB7dHlwZTogbWltZX0pO1xuICByZXR1cm4gc2F2ZURvd25sb2FkKGJsb2IsIHdvcmtzcGFjZSwgZmlsZW5hbWUsIHN1YmRpcik7XG59O1xuXG4vLyDilIDilIDilIAgU2VydmljZSByZXF1ZXN0cyArIHJlbGF5IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2c6IFBnRW52ZWxvcGU8QW55TWVzc2FnZT4gfCBhbnksIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmICghbXNnIHx8IG1zZy5fX3BnICE9PSB0cnVlKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKG1zZy5raW5kID09PSAnY2FwdHVyZS1zY3JlZW5zaG90Jykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBtc2cudGFiSWQgPyBbYXdhaXQgY2hyb21lLnRhYnMuZ2V0KG1zZy50YWJJZCldXG4gICAgICAgICAgOiBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgIGNvbnN0IHRhYiA9IHRhYnNbMF07XG4gICAgICAgIGlmICghdGFiPy53aW5kb3dJZCkgeyBzZW5kUmVzcG9uc2Uoe2Vycm9yOiAnbm8gYWN0aXZlIHRhYid9KTsgcmV0dXJuOyB9XG4gICAgICAgIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih0YWIud2luZG93SWQsIHtmb3JtYXQ6ICdwbmcnfSk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7ZGF0YVVybH0pO1xuICAgICAgfSBjYXRjaCAoZSkgeyBzZW5kUmVzcG9uc2Uoe2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7IH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2cua2luZCA9PT0gJ3N3aXRjaC10by10YWInKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt1cmw6IG1zZy51cmx9KTtcbiAgICAgICAgaWYgKHRhYnMubGVuZ3RoICYmIHRhYnNbMF0/LmlkICE9IG51bGwpIHtcbiAgICAgICAgICBhd2FpdCBjaHJvbWUudGFicy51cGRhdGUodGFic1swXS5pZCwge2FjdGl2ZTogdHJ1ZX0pO1xuICAgICAgICAgIGlmICh0YWJzWzBdLndpbmRvd0lkICE9IG51bGwpIGF3YWl0IGNocm9tZS53aW5kb3dzLnVwZGF0ZSh0YWJzWzBdLndpbmRvd0lkLCB7Zm9jdXNlZDogdHJ1ZX0pO1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7Zm91bmQ6IHRydWV9KTtcbiAgICAgICAgfSBlbHNlIGlmIChtc2cub3BlbklmTWlzc2luZykge1xuICAgICAgICAgIGNvbnN0IHQgPSBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoe3VybDogbXNnLnVybCwgYWN0aXZlOiB0cnVlfSk7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtmb3VuZDogZmFsc2UsIG9wZW5lZDogdC5pZH0pO1xuICAgICAgICB9IGVsc2Ugc2VuZFJlc3BvbnNlKHtmb3VuZDogZmFsc2V9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pOyB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnLmtpbmQgPT09ICdsaXN0LW9wZW4tdGFicycpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe30pO1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe3RhYnM6IHRhYnMuZmlsdGVyKCh0KSA9PiB0LnVybCkubWFwKCh0KSA9PiAoe2lkOiB0LmlkLCB1cmw6IHQudXJsLCB0aXRsZTogdC50aXRsZX0pKX0pO1xuICAgICAgfSBjYXRjaCAoZSkgeyBzZW5kUmVzcG9uc2Uoe2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpLCB0YWJzOiBbXX0pOyB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChtc2cua2luZCA9PT0gJ3Nob3QtZWxlbWVudCcgfHwgbXNnLmtpbmQgPT09ICdzaG90LWdyb3VwJyB8fCBtc2cua2luZCA9PT0gJ3Nob3QtcGFnZScpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJJZCA9IG1zZy50YWJJZCA/PyBzZW5kZXIudGFiPy5pZDtcbiAgICAgICAgbGV0IHJlc29sdmVkVGFiSWQgPSB0YWJJZDtcbiAgICAgICAgbGV0IHdpbmRvd0lkOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChyZXNvbHZlZFRhYklkID09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICAgIHJlc29sdmVkVGFiSWQgPSB0YWJzWzBdPy5pZDtcbiAgICAgICAgICB3aW5kb3dJZCA9IHRhYnNbMF0/LndpbmRvd0lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHQgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQocmVzb2x2ZWRUYWJJZCk7XG4gICAgICAgICAgd2luZG93SWQgPSB0Py53aW5kb3dJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzb2x2ZWRUYWJJZCA9PSBudWxsIHx8IHdpbmRvd0lkID09IG51bGwpIHtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6ICdubyBhY3RpdmUgdGFiJ30gc2F0aXNmaWVzIFNob3RSZXBseSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRhYklkRmluYWwgPSByZXNvbHZlZFRhYklkO1xuICAgICAgICBjb25zdCB3aW5kb3dJZEZpbmFsID0gd2luZG93SWQ7XG4gICAgICAgIGF3YWl0IGVucXVldWUodGFiSWRGaW5hbCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IHJ1blNob3QobXNnLCB0YWJJZEZpbmFsLCB3aW5kb3dJZEZpbmFsKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZShyZXBseSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBzYXRpc2ZpZXMgU2hvdFJlcGx5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IHNhdGlzZmllcyBTaG90UmVwbHkpO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBGdWxsLXBhZ2Ugc25hcHNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFJldXNlcyB0aGUgc2FtZVxuICAvLyBoaWRlLW92ZXJsYXlzIOKGkiBzdGl0Y2gg4oaSIHJlc3RvcmUgcGF0aCBhcyBzaG90LXBhZ2UsIGJ1dCByZXR1cm5zIHRoZSBQTkdcbiAgLy8gYXMgYSBkYXRhIFVSTCBpbnN0ZWFkIG9mIHdyaXRpbmcgYSBmaWxlLiBTZXJpYWxpemVkIHBlciB0YWIgdGhyb3VnaCB0aGVcbiAgLy8gc2FtZSBxdWV1ZSBzbyBpdCBjYW4ndCByYWNlIGEgY29uY3VycmVudCBlbGVtZW50L2dyb3VwIGNhcHR1cmUuXG4gIGlmIChtc2cua2luZCA9PT0gJ3BhZ2Utc25hcHNob3Qtc2hvdCcpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJJZCA9IG1zZy50YWJJZCA/PyBzZW5kZXIudGFiPy5pZDtcbiAgICAgICAgbGV0IHJlc29sdmVkVGFiSWQgPSB0YWJJZDtcbiAgICAgICAgbGV0IHdpbmRvd0lkOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChyZXNvbHZlZFRhYklkID09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICAgIHJlc29sdmVkVGFiSWQgPSB0YWJzWzBdPy5pZDtcbiAgICAgICAgICB3aW5kb3dJZCA9IHRhYnNbMF0/LndpbmRvd0lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHQgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQocmVzb2x2ZWRUYWJJZCk7XG4gICAgICAgICAgd2luZG93SWQgPSB0Py53aW5kb3dJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzb2x2ZWRUYWJJZCA9PSBudWxsIHx8IHdpbmRvd0lkID09IG51bGwpIHtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6ICdubyBhY3RpdmUgdGFiJ30pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YWJJZEZpbmFsID0gcmVzb2x2ZWRUYWJJZDtcbiAgICAgICAgY29uc3Qgd2luZG93SWRGaW5hbCA9IHdpbmRvd0lkO1xuICAgICAgICBhd2FpdCBlbnF1ZXVlKHRhYklkRmluYWwsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZ290ID0gYXdhaXQgc2hvdFBhZ2VDb21tb24odGFiSWRGaW5hbCwgd2luZG93SWRGaW5hbCk7XG4gICAgICAgICAgICBpZiAoIWdvdCkgeyBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgICBjb25zdCBzY3JlZW5zaG90ID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICAgICAgICAgICAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gICAgICAgICAgICAvLyBgdHJ1bmNhdGVkYCBoZXJlIG1lYW5zIHRoZSBzdGl0Y2ggc3RvcHBlZCBlYXJseSAoY2h1bmsvcGl4ZWxcbiAgICAgICAgICAgIC8vIGNhcCkg4oCUIHRoZSBQTkcgY292ZXJzIG9ubHkgcGFydCBvZiB0aGUgZG9jdW1lbnQsIHdoaWNoIGlzXG4gICAgICAgICAgICAvLyBleGFjdGx5IHRoZSBgcGFydGlhbGAgc2lnbmFsIHRoZSBQYWdlU25hcHNob3QgY29udHJhY3Qgd2FudHMuXG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiB0cnVlLCBzY3JlZW5zaG90LCBwYXJ0aWFsOiBnb3QudHJ1bmNhdGVkfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFBhbmVsLXRyaWdnZXJlZCBjb250ZW50LXNjcmlwdCAocmUpaW5qZWN0aW9uIOKAlCB0aGUgcmVjb3ZlcnkgcGF0aCBmb3JcbiAgLy8gXCJBbHQgc3RvcHBlZCB3b3JraW5nXCIgKGV4dGVuc2lvbiByZWxvYWQgb3JwaGFuZWQgdGhlIHBhZ2UncyBzY3JpcHQpLlxuICBpZiAobXNnLmtpbmQgPT09ICdwZy1yZWluamVjdCcpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgdGFiSWQ6IG51bWJlciB8IHVuZGVmaW5lZCA9IG1zZy50YWJJZDtcbiAgICAgICAgaWYgKHRhYklkID09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICAgIHRhYklkID0gdGFic1swXT8uaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhYklkID09IG51bGwpIHsgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnbm8gYWN0aXZlIHRhYid9KTsgcmV0dXJuOyB9XG4gICAgICAgIGNvbnN0IHRhYiA9IGF3YWl0IGNocm9tZS50YWJzLmdldCh0YWJJZCk7XG4gICAgICAgIGlmICh0YWIudXJsICYmICEvXmh0dHBzPzovLnRlc3QodGFiLnVybCkpIHtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IGBjYW5ub3QgYXR0YWNoIHRvICR7dGFiLnVybH1gfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7dGFyZ2V0OiB7dGFiSWQsIGFsbEZyYW1lczogZmFsc2V9LCBmaWxlczogWydjb250ZW50LXNjcmlwdC5qcyddLCBpbmplY3RJbW1lZGlhdGVseTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCB0cmFja0FjdGl2ZVRhYih0YWJJZCk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IHRydWUsIHRhYklkfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAobXNnLmtpbmQgPT09ICdzYXZlLXRleHQnIHx8IG1zZy5raW5kID09PSAnc2F2ZS1ieXRlcycpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgc3RvcmVkOiBTYXZlZEZpbGU7XG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZSA9IFN0cmluZyhtc2cud29ya3NwYWNlID8/ICdkZWZhdWx0Jyk7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gU3RyaW5nKG1zZy5maWxlbmFtZSA/PyAnZXhwb3J0LmJpbicpO1xuICAgICAgICBjb25zdCBtaW1lID0gU3RyaW5nKG1zZy5taW1lID8/ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nKTtcbiAgICAgICAgY29uc3Qgc3ViZGlyID0gU3RyaW5nKG1zZy5zdWJkaXIgPz8gJ2V4cG9ydHMnKTtcbiAgICAgICAgaWYgKG1zZy5raW5kID09PSAnc2F2ZS10ZXh0Jykge1xuICAgICAgICAgIHN0b3JlZCA9IGF3YWl0IHNhdmVUZXh0RG93bmxvYWQoU3RyaW5nKG1zZy50ZXh0ID8/ICcnKSwgd29ya3NwYWNlLCBmaWxlbmFtZSwgbWltZSwgc3ViZGlyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBEZWZlbnNpdmUgZGVjb2RlOiBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBjYW4gZGVsaXZlciBieXRlc1xuICAgICAgICAgIC8vIGFzIGEgVWludDhBcnJheSwgYSBudW1iZXJbXSwgb3IgYSBnZW5lcmljIGluZGV4ZWQgb2JqZWN0XG4gICAgICAgICAgLy8gKGRlcGVuZGluZyBvbiBDaHJvbWUgdmVyc2lvbiArIGNhbGxlcikuIEFjY2VwdCBhbGwgc2hhcGVzLlxuICAgICAgICAgIGNvbnN0IHJhdzogYW55ID0gbXNnLmJ5dGVzO1xuICAgICAgICAgIGxldCBieXRlczogVWludDhBcnJheTtcbiAgICAgICAgICBpZiAocmF3IGluc3RhbmNlb2YgVWludDhBcnJheSkgYnl0ZXMgPSByYXc7XG4gICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSBieXRlcyA9IFVpbnQ4QXJyYXkuZnJvbShyYXcpO1xuICAgICAgICAgIGVsc2UgaWYgKHJhdyAmJiB0eXBlb2YgcmF3ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3QgdmFscyA9IE9iamVjdC52YWx1ZXMocmF3KSBhcyBudW1iZXJbXTtcbiAgICAgICAgICAgIGJ5dGVzID0gVWludDhBcnJheS5mcm9tKHZhbHMpO1xuICAgICAgICAgIH0gZWxzZSBieXRlcyA9IG5ldyBVaW50OEFycmF5KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZS1ieXRlcyBkZWNvZGVkJywge2J5dGVzOiBieXRlcy5sZW5ndGgsIHJhd1R5cGU6IHR5cGVvZiByYXcsIGlzQXJyYXk6IEFycmF5LmlzQXJyYXkocmF3KSwgaXNVODogcmF3IGluc3RhbmNlb2YgVWludDhBcnJheX0pO1xuICAgICAgICAgIHN0b3JlZCA9IGF3YWl0IHNhdmVCeXRlc0Rvd25sb2FkKGJ5dGVzLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBtaW1lLCBzdWJkaXIpO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgb2s6IHRydWUsIGZpbGVuYW1lOiBzdG9yZWQucmVsUGF0aCwgYWJzUGF0aDogc3RvcmVkLmFic1BhdGgsXG4gICAgICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gQXV0by1vcGVuIHRoZSBzaWRlIHBhbmVsIG9uIGZpcnN0IGNhcHR1cmUvc3RhZ2luZy4gQ2hyb21lIDExNisgcHJvcGFnYXRlc1xuICAvLyB0aGUgdXNlciBhY3RpdmF0aW9uIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugc28gdGhpcyBkb2Vzbid0XG4gIC8vIHRocm93IOKAlCB0aGUgY2xpY2sgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhcHR1cmUgaW4gdGhlIGNvbnRlbnQgc2NyaXB0IGlzXG4gIC8vIHN0aWxsIGNvbnNpZGVyZWQgXCJsaXZlXCIgaGVyZSBpbiB0aGUgd29ya2VyLlxuICAvL1xuICAvLyBJTlZFU1RJR0FURS0xIChmaXJzdC1jYXB0dXJlIHJhY2UpOiBvbiB0aGUgVkVSWSBGSVJTVCBBbHQrQ2xpY2sgdGhlIHBhbmVsXG4gIC8vIGRvY3VtZW50IGRvZXNuJ3QgZXhpc3QgeWV0LCBzbyBpdHMgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlIGxpc3RlbmVyIGlzbid0XG4gIC8vIHJlZ2lzdGVyZWQuIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIG9ubHkgcmVhY2hlcyBsaXN0ZW5lcnMgdGhhdCBhcmVcbiAgLy8gYWxyZWFkeSBsaXZlLCBzbyB0aGlzIGZpcnN0IGNhcHR1cmUgaXMgZHJvcHBlZCDigJQgdGhlIHVzZXIgaGFzIHRvIGNsaWNrIGFcbiAgLy8gc2Vjb25kIHRpbWUgKHBhbmVsIG5vdyBsaXN0ZW5pbmcpIHRvIHNlZSBpdC4gVGhlIHJvYnVzdCBmaXggaXMgYSBwYW5lbOKGkmJnXG4gIC8vIFwicGFuZWwtcmVhZHksIHNlbmQgbWUgYW55dGhpbmcgcGVuZGluZ1wiIGhhbmRzaGFrZSwgYnV0IHRoYXQgbmVlZHMgYVxuICAvLyBzaWRlcGFuZWwudHMgY2hhbmdlIChyZXBvcnRlZCBzZXBhcmF0ZWx5KS4gQXMgYSBiYWNrZ3JvdW5kLW9ubHksIGxvdy1yaXNrXG4gIC8vIG1pdGlnYXRpb24gd2UgcmUtYnJvYWRjYXN0IHRoZSBmaXJzdCBjYXB0dXJlKHMpIGEgZmV3IHRpbWVzIG92ZXIgYSBzaG9ydFxuICAvLyB3aW5kb3cgQUZURVIgb3BlbmluZyB0aGUgcGFuZWwuIFRoZSBwYW5lbCByZWdpc3RlcnMgaXRzIG9uTWVzc2FnZSBsaXN0ZW5lclxuICAvLyBzeW5jaHJvbm91c2x5IGF0IHNjcmlwdC1ldmFsIChiZWZvcmUgaXRzIGFzeW5jIGxvYWRBbGwpLCBhbmQgaXQgYWxyZWFkeVxuICAvLyBidWZmZXJzIG1lc3NhZ2VzIHVudGlsIHJlYWR5IEFORCBkZWR1cGVzIGJ5IF9fbWlkIOKAlCBzbyBhIHJlcGxheSB0aGF0IGxhbmRzXG4gIC8vIGFmdGVyIHRoZSBsaXN0ZW5lciBleGlzdHMgaXMgcHJvY2Vzc2VkIGV4YWN0bHkgb25jZSwgYW5kIHJlcGxheXMgdGhhdCBsb3NlXG4gIC8vIHRoZSByYWNlIGFyZSBoYXJtbGVzcyBuby1vcHMuXG4gIC8vXG4gIC8vIFdlIGd1YXJkIG9uIGBzZW5kZXIudGFiPy5pZCAhPSBudWxsYCBzbyBvdXIgT1dOIHJlcGxheXMgKHdoaWNoIGhhdmUgbm9cbiAgLy8gc2VuZGVyLnRhYikgbmV2ZXIgcmUtZW50ZXIgdGhpcyBicmFuY2gg4oCUIG5vIG9wZW4vcmVwbGF5IGxvb3AuXG4gIGlmICgobXNnLmtpbmQgPT09ICdjYXB0dXJlJyB8fCBtc2cua2luZCA9PT0gJ3BlbmRpbmctYWRkJykgJiYgc2VuZGVyLnRhYj8uaWQgIT0gbnVsbCkge1xuICAgIGNocm9tZS5zaWRlUGFuZWwub3Blbih7dGFiSWQ6IHNlbmRlci50YWIuaWR9KS5jYXRjaCgoKSA9PiB7IC8qIGFscmVhZHkgb3BlbiAqLyB9KTtcbiAgICAvLyBBbHdheXMgcmVwbGF5IOKAlCB3ZSBjYW4ndCByZWxpYWJseSB0ZWxsIGZyb20gaGVyZSB3aGV0aGVyIHRoZSBwYW5lbCB3YXNcbiAgICAvLyBhbHJlYWR5IGxpc3RlbmluZyAoc2lkZVBhbmVsIGhhcyBubyBcImlzLW9wZW5cIiBBUEksIGFuZCBvcGVuKCkgcmVzb2x2aW5nXG4gICAgLy8gdnMgcmVqZWN0aW5nIGlzIG5vdCBhIGNsZWFuIHNpZ25hbCBhY3Jvc3MgQ2hyb21lIHZlcnNpb25zIC8gZ2VzdHVyZVxuICAgIC8vIHN0YXRlcykuIE92ZXItcmVwbGF5aW5nIHdoZW4gdGhlIHBhbmVsIGlzIGFscmVhZHkgdXAgaXMgaGFybWxlc3M6IHRoZVxuICAgIC8vIHBhbmVsIGRlZHVwZXMgYnkgX19taWQsIHNvIHRoZSByZWR1bmRhbnQgYnJvYWRjYXN0cyBjb2xsYXBzZSB0byBub3RoaW5nLlxuICAgIC8vIFVuZGVyLXJlcGxheWluZyB3b3VsZCByZXN1cnJlY3QgdGhlIGRyb3BwZWQtZmlyc3QtY2FwdHVyZSBidWcsIHNvIHdlIGVyclxuICAgIC8vIHRvd2FyZCBhbHdheXMgcmVwbGF5aW5nLiBUaGUgd2luZG93IGlzIHNob3J0IGFuZCBib3VuZGVkICgzIHNlbmRzKS5cbiAgICByZXBsYXlGaXJzdENhcHR1cmUobXNnIGFzIFBnRW52ZWxvcGU8QW55TWVzc2FnZT4pO1xuICB9XG5cbiAgLy8gTm8gcG9ydCByZWxheTogdGhlIHNpZGUgcGFuZWwgbGlzdGVucyBkaXJlY3RseSBvbiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UsXG4gIC8vIHdoaWNoIGFscmVhZHkgcmVjZWl2ZXMgYnJvYWRjYXN0cyBmcm9tIGNvbnRlbnQgc2NyaXB0cy4gUmVsYXlpbmcgdGhyb3VnaFxuICAvLyBhIHBvcnQgY2F1c2VzIGV2ZXJ5IG1lc3NhZ2UgdG8gYmUgZGVsaXZlcmVkIHR3aWNlIOKAlCB0aGF0IHN1cmZhY2VkIGFzXG4gIC8vIGR1cGxpY2F0ZWQgbXVsdGktc2VsZWN0IGVudHJpZXMgaW4gcHJvZHVjdGlvbi5cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbi8vIFJlLWJyb2FkY2FzdCBhIGNhcHR1cmUvcGVuZGluZy1hZGQgZW52ZWxvcGUgYSBmZXcgdGltZXMgb3ZlciBhIHNob3J0IHdpbmRvd1xuLy8gc28gYSBmcmVzaGx5LW9wZW5lZCBzaWRlIHBhbmVsICh3aG9zZSBsaXN0ZW5lciByZWdpc3RlcnMgYSBmZXcgbXMgYWZ0ZXIgdGhlXG4vLyBkb2N1bWVudCBzdGFydHMgbG9hZGluZykgY2F0Y2hlcyBpdC4gU2FtZSBfX21pZCBlYWNoIHRpbWUg4oaSIHRoZSBwYW5lbCdzXG4vLyByZWNlbnRNaWRzIHJpbmcgZGVkdXBlcyB0byBhIHNpbmdsZSBwcm9jZXNzZWQgbWVzc2FnZS4gQm91bmRlZCAobm8gbG9vcCk6XG4vLyB0aHJlZSBhdHRlbXB0cyBpbnNpZGUgfjQ1MG1zLCB0aGVuIHdlIHN0b3AuIFJlc2VuZGluZyB0aGUgU0FNRSBlbnZlbG9wZSBpc1xuLy8gaW1wb3J0YW50IOKAlCBhIG5ldyBfX21pZCB3b3VsZCBkZWZlYXQgdGhlIGRlZHVwIGFuZCBkb3VibGUtaW5zZXJ0LlxuY29uc3QgUkVQTEFZX0RFTEFZU19NUyA9IFs2MCwgMTgwLCA0NTBdO1xuY29uc3QgcmVwbGF5Rmlyc3RDYXB0dXJlID0gKGVudmVsb3BlOiBQZ0VudmVsb3BlPEFueU1lc3NhZ2U+KTogdm9pZCA9PiB7XG4gIGZvciAoY29uc3QgZGVsYXkgb2YgUkVQTEFZX0RFTEFZU19NUykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gc2VuZE1lc3NhZ2Ugd2l0aCBubyBjYWxsYmFjazsgdGhlIHBhbmVsIGNvbnN1bWVzIGl0LiBXcmFwcGVkIHNvIGFcbiAgICAgIC8vIFwicmVjZWl2aW5nIGVuZCBkb2VzIG5vdCBleGlzdFwiIHJlamVjdGlvbiAocGFuZWwgc3RpbGwgbm90IHVwIG9uIHRoZVxuICAgICAgLy8gZWFybGllc3QgYXR0ZW1wdCkgaXMgc3dhbGxvd2VkIHJhdGhlciB0aGFuIGxvZ2dlZCBhcyBhbiBlcnJvci5cbiAgICAgIHRyeSB7IHZvaWQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoZW52ZWxvcGUpLmNhdGNoPy4oKCkgPT4geyAvKiBub3QgdXAgeWV0ICovIH0pOyB9XG4gICAgICBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSwgZGVsYXkpO1xuICB9XG59O1xuXG4vLyBFbmNvZGUgYSBQTkcgYmxvYiBpbnRvIGEgYmFzZTY0IGRhdGEgVVJMIHVzaW5nIHRoZSBzYW1lIGNodW5rZWQtYnRvYVxuLy8gcGF0aCBzYXZlRG93bmxvYWQgdXNlcy4gVGhlIHJlc3VsdCBpcyB0d28gcHVycG9zZXMtaW4tb25lOiB0aGVcbi8vIGRvd25zY2FsZWQgdGh1bWJuYWlsIGdvZXMgYmFjayB0byB0aGUgc2lkZSBwYW5lbCdzIHByZXZpZXcgdGlsZSAoc21hbGwsXG4vLyB+NS0xNSBLQiksIHdoaWxlIHRoZSBGVUxMIHBuZyBhbHNvIHJpZGVzIGJhY2sgc28gdGhlIHBhbmVsIGNhbiBzdGFzaCBpdFxuLy8gaW4gYHNob3RzRnVsbGAgYW5kIGJ1bmRsZSBpdCBpbnRvIHRoZSB3b3Jrc3BhY2UgLnRhci56c3QgZXhwb3J0IGxhdGVyLlxuY29uc3QgYmxvYlRvRnVsbERhdGFVcmwgPSBhc3luYyAoYmxvYjogQmxvYik6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IGJ1ZiA9IGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWYpO1xuICBsZXQgYmluYXJ5ID0gJyc7XG4gIGNvbnN0IGNodW5rID0gMHg4MF8wMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gY2h1bmspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBBcnJheS5mcm9tKGJ5dGVzLnN1YmFycmF5KGksIGkgKyBjaHVuaykpKTtcbiAgfVxuICByZXR1cm4gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuY29uc3QgcnVuU2hvdCA9IGFzeW5jIChtc2c6IGFueSwgdGFiSWQ6IG51bWJlciwgd2luZG93SWQ6IG51bWJlcik6IFByb21pc2U8U2hvdFJlcGx5PiA9PiB7XG4gIGNvbnN0IHRzID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICBjb25zdCBwYWRkaW5nID0gdHlwZW9mIG1zZy5wYWRkaW5nID09PSAnbnVtYmVyJyA/IG1zZy5wYWRkaW5nIDogMjQ7XG4gIGlmIChtc2cua2luZCA9PT0gJ3Nob3QtZWxlbWVudCcpIHtcbiAgICBjb25zdCBnb3QgPSBhd2FpdCBzaG90RWxlbWVudENvbW1vbih0YWJJZCwgd2luZG93SWQsIFttc2cuc2VsZWN0b3JdLCBwYWRkaW5nKTtcbiAgICBpZiAoIWdvdCkgcmV0dXJuIHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ2VsZW1lbnQnLCB0cywgbXNnLm4sIGdvdC50YWJVcmwpO1xuICAgIGNvbnN0IHN0b3JlZCA9IGF3YWl0IHNhdmVEb3dubG9hZChnb3QuYmxvYiwgbXNnLndvcmtzcGFjZSwgZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICAgIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgZGF0YVVybCwgZnVsbERhdGFVcmwsXG4gICAgICBjcm9wOiBnb3QuY3JvcE1ldGEsXG4gICAgfTtcbiAgfVxuICBpZiAobXNnLmtpbmQgPT09ICdzaG90LWdyb3VwJykge1xuICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RFbGVtZW50Q29tbW9uKHRhYklkLCB3aW5kb3dJZCwgbXNnLnNlbGVjdG9ycywgcGFkZGluZyk7XG4gICAgaWYgKCFnb3QpIHJldHVybiB7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ307XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEZpbGVuYW1lKCdncm91cCcsIHRzLCBtc2cubiwgZ290LnRhYlVybCwge2NvdW50OiBtc2cuc2VsZWN0b3JzLmxlbmd0aH0pO1xuICAgIGNvbnN0IHN0b3JlZCA9IGF3YWl0IHNhdmVEb3dubG9hZChnb3QuYmxvYiwgbXNnLndvcmtzcGFjZSwgZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICAgIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgZGF0YVVybCwgZnVsbERhdGFVcmwsXG4gICAgICBjcm9wOiBnb3QuY3JvcE1ldGEsXG4gICAgfTtcbiAgfVxuICAvLyBwYWdlXG4gIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RQYWdlQ29tbW9uKHRhYklkLCB3aW5kb3dJZCk7XG4gIGlmICghZ290KSByZXR1cm4ge29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9O1xuICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ3BhZ2UnLCB0cywgbXNnLm4sIGdvdC50YWJVcmwsIHt0cnVuY2F0ZWQ6IGdvdC50cnVuY2F0ZWR9KTtcbiAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICBjb25zdCBmdWxsRGF0YVVybCA9IGF3YWl0IGJsb2JUb0Z1bGxEYXRhVXJsKGdvdC5ibG9iKTtcbiAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gIHJldHVybiB7XG4gICAgb2s6IHRydWUsIGZpbGVuYW1lOiBzdG9yZWQucmVsUGF0aCwgYWJzUGF0aDogc3RvcmVkLmFic1BhdGgsXG4gICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgZGF0YVVybCwgZnVsbERhdGFVcmwsIHRydW5jYXRlZDogZ290LnRydW5jYXRlZCxcbiAgfTtcbn07XG5cbi8vIChzYXZlLXRleHQgLyBzYXZlLWJ5dGVzIGFyZSBmb2xkZWQgaW50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QUksU0FBUyxjQUFjO0FBQUEsTUFDN0IsTUFBTSxPQUFNLE1BQU0sa0JBQWtCLE9BQU8sVUFBVSxJQUFJLFdBQVcsT0FBTztBQUFBLE1BQzNFLElBQUksQ0FBQztBQUFBLFFBQUssT0FBTyxFQUFDLElBQUksT0FBTyxPQUFPLGlCQUFnQjtBQUFBLE1BQ3BELE1BQU0sWUFBVyxjQUFjLFNBQVMsSUFBSSxJQUFJLEdBQUcsS0FBSSxRQUFRLEVBQUMsT0FBTyxJQUFJLFVBQVUsT0FBTSxDQUFDO0FBQUEsTUFDNUYsTUFBTSxVQUFTLE1BQU0sYUFBYSxLQUFJLE1BQU0sSUFBSSxXQUFXLFNBQVE7QUFBQSxNQUNuRSxNQUFNLFdBQVUsTUFBTSxjQUFjLEtBQUksTUFBTTtBQUFBLE1BQzlDLE1BQU0sZUFBYyxNQUFNLGtCQUFrQixLQUFJLElBQUk7QUFBQSxNQUNwRCxLQUFJLE9BQU8sUUFBUTtBQUFBLE1BQ25CLE9BQU87QUFBQSxRQUNMLElBQUk7QUFBQSxRQUFNLFVBQVUsUUFBTztBQUFBLFFBQVMsU0FBUyxRQUFPO0FBQUEsUUFDcEQsVUFBVSxRQUFPO0FBQUEsUUFBVSxVQUFVLFFBQU87QUFBQSxRQUFVLGVBQWUsUUFBTztBQUFBLFFBQzVFO0FBQUEsUUFBUztBQUFBLFFBQ1QsTUFBTSxLQUFJO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE1BQU0sTUFBTSxNQUFNLGVBQWUsT0FBTyxRQUFRO0FBQUEsSUFDaEQsSUFBSSxDQUFDO0FBQUEsTUFBSyxPQUFPLEVBQUMsSUFBSSxPQUFPLE9BQU8saUJBQWdCO0FBQUEsSUFDcEQsTUFBTSxXQUFXLGNBQWMsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBQyxXQUFXLElBQUksVUFBUyxDQUFDO0FBQUEsSUFDeEYsTUFBTSxTQUFTLE1BQU0sYUFBYSxJQUFJLE1BQU0sSUFBSSxXQUFXLFFBQVE7QUFBQSxJQUNuRSxNQUFNLFVBQVUsTUFBTSxjQUFjLElBQUksTUFBTTtBQUFBLElBQzlDLE1BQU0sY0FBYyxNQUFNLGtCQUFrQixJQUFJLElBQUk7QUFBQSxJQUNwRCxJQUFJLE9BQU8sUUFBUTtBQUFBLElBQ25CLE9BQU87QUFBQSxNQUNMLElBQUk7QUFBQSxNQUFNLFVBQVUsT0FBTztBQUFBLE1BQVMsU0FBUyxPQUFPO0FBQUEsTUFDcEQsVUFBVSxPQUFPO0FBQUEsTUFBVSxVQUFVLE9BQU87QUFBQSxNQUFVLGVBQWUsT0FBTztBQUFBLE1BQzVFO0FBQUEsTUFBUztBQUFBLE1BQWEsV0FBVyxJQUFJO0FBQUEsSUFDdkM7QUFBQTsiLAogICJkZWJ1Z0lkIjogIjMyRDY0MTZDMDQ1Mjk0N0U2NDc1NkUyMTY0NzU2RTIxIiwKICAibmFtZXMiOiBbXQp9
