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
  var quietDownloadsUi = () => {
    try {
      chrome.downloads.setUiOptions?.({ enabled: false }, () => {
        if (chrome.runtime.lastError)
          console.log(LOG, "setUiOptions:", chrome.runtime.lastError.message);
      });
    } catch (e) {
      console.log(LOG, "setUiOptions threw", e);
    }
    try {
      chrome.downloads.setShelfEnabled?.(false);
    } catch {}
  };
  chrome.runtime.onInstalled.addListener(async () => {
    try {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } catch (e) {
      console.warn(LOG, "setPanelBehavior", e);
    }
    try {
      chrome.contextMenus.create({ id: "pg-capture", title: "PinchGrab — capture this element", contexts: ["all"] });
    } catch {}
    quietDownloadsUi();
    injectIntoOpenTabs();
    setEmojiIcon();
  });
  chrome.runtime.onStartup?.addListener(() => {
    quietDownloadsUi();
    injectIntoOpenTabs();
    setEmojiIcon();
  });
  quietDownloadsUi();
  async function injectIntoOpenTabs() {
    try {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (!tab.id || !tab.url || !/^https?:/.test(tab.url))
          continue;
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: false },
            files: ["content-script.js"],
            injectImmediately: true
          });
        } catch {}
      }
    } catch (e) {
      console.warn(LOG, "injectIntoOpenTabs", e);
    }
  }
  chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (!tab?.url || !/^https?:/.test(tab.url))
        return;
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content-script.js"],
        injectImmediately: true
      }).catch(() => {});
    } catch {}
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
    const bbox = await computeAndScroll(tabId, selectors, padding);
    if (!bbox)
      return null;
    await yieldRaf(tabId);
    await tellCs(tabId, { kind: "hide-overlays" });
    let dataUrl;
    try {
      dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: "png" });
    } catch (e) {
      await tellCs(tabId, { kind: "show-overlays" });
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
  var saveDownload = async (blob, workspace, filename, subdir = "screenshots") => {
    const relPath = subdir ? `${subdir}/${filename}` : filename;
    const fullPath = `pinchgrab/${workspace}/${relPath}`;
    console.log(LOG, "saveDownload start", { fullPath, mime: blob.type, size: blob.size });
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
    }
    return false;
  });
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

//# debugId=6AFE2AF391DBD67264756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9iYWNrZ3JvdW5kLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIFNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2wgYmV0d2VlbiBjb250ZW50IHNjcmlwdCwgc2lkZSBwYW5lbCwgYW5kXG4vLyBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyLlxuXG5leHBvcnQgdHlwZSBSZWN0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG5leHBvcnQgdHlwZSBWaWV3cG9ydCA9IHtcbiAgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyO1xuICAvLyBVc2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgYXQgY2FwdHVyZSB0aW1lLiBMZXRzIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhc29uIGFib3V0IHdoeSBjYXB0dXJlZCBhcHBlYXJhbmNlIGRpZmZlcnMgYmV0d2VlbiBzZXNzaW9uc1xuICAvLyAoZS5nLiBkYXJrLW1vZGUgdnMgbGlnaHQtbW9kZSBvZiB0aGUgc2FtZSBjb21wb25lbnQpLlxuICBjb2xvclNjaGVtZT86ICdkYXJrJyB8ICdsaWdodCc7XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICAvLyBEb2N1bWVudCBkaXJlY3Rpb24gKGBsdHJgIC8gYHJ0bGApIOKAlCBkaWZmZXJlbnQgZnJvbSB2aWV3cG9ydCBzaXplLFxuICAvLyBjaGFuZ2VzIHRoZSBtZWFuaW5nIG9mIGBzdGFydGAvYGVuZGAgaW4gQ1NTIGFuZCB0aGUgc2Vuc2Ugb2ZcbiAgLy8gYHJlY3QueGAuIENhcHR1cmVkIHBlciBwYWdlIGhlYWRlciBzbyBSVEwgY2FwdHVyZXMgZG9uJ3QgZ2V0XG4gIC8vIHNpbGVudGx5IG1peGVkIHdpdGggTFRSIG9uZXMuXG4gIGRpcmVjdGlvbj86ICdsdHInIHwgJ3J0bCc7XG4gIC8vIEJyb3dzZXIgem9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCByZXBvcnRzIHRoZSBwaW5jaC16b29tXG4gIC8vIGZhY3RvcjsgdmFsdWVzICE9IDEgbWVhbiB0aGUgdXNlciBoYXMgem9vbWVkIGluL291dCBhbmQgYW55IGxheW91dFxuICAvLyBidWcgdGhleSdyZSBjYXB0dXJpbmcgbWF5IG5vdCByZXBybyBhdCBkZWZhdWx0IHpvb20uXG4gIHpvb20/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGcmFtZXdvcmtJbmZvID0ge1xuICBmcmFtZXdvcms6ICdyZWFjdCcgfCAndnVlJyB8ICdsaXQnIHwgJ3N0ZW5jaWwnIHwgJ3N2ZWx0ZScgfCAnd2ViLWNvbXBvbmVudCc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuICBzb3VyY2U/OiB7ZmlsZT86IHN0cmluZyB8IG51bGw7IGxpbmU/OiBudW1iZXIgfCBudWxsfTtcbiAgLy8gVXAtdHJlZSBjb21wb25lbnQgYW5jZXN0cnkgKGlubmVybW9zdCBmaXJzdCkuIEZvciBSZWFjdCwgd2Fsa2VkIHZpYVxuICAvLyBmaWJlciBgcmV0dXJuYCBjaGFpbjsgZm9yIFZ1ZSwgdmlhIGBfX3Z1ZVBhcmVudENvbXBvbmVudC5wYXJlbnRgLlxuICAvLyBUaGUgY29tcG9uZW50IG5hbWUgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoaWNoIGZpbGUgb3ducyB0aGVcbiAgLy8gcmVuZGVyaW5nIOKAlCB0aGUgY2hhaW4gaGVscHMgaXQgZ3JlcCB1cHdhcmQgdG8gZmluZCB0aGUgcm91dGVcbiAgLy8gY29tcG9uZW50LCB0aGVuIGRyaWxsIGludG8gdGhlIG93bmluZyBmaWxlLlxuICBjaGFpbj86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5jZXN0b3IgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBNYXRjaGVkUnVsZSA9IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgZGVjbGFyYXRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWVkaWE/OiBzdHJpbmc7XG4gIC8vIFdhcyB0aGUgQG1lZGlhIHF1ZXJ5IHRoYXQgd3JhcHMgdGhpcyBydWxlIGFjdHVhbGx5IG1hdGNoZWQgYXRcbiAgLy8gY2FwdHVyZSB0aW1lPyBgdHJ1ZWAgPSBhY3RpdmUsXG4gIC8vIGBmYWxzZWAgPSBtYXRjaGVkIHRoZSBzZWxlY3RvciBidXQgaW5hY3RpdmUgKGUuZy4gbW9iaWxlIHJ1bGVzXG4gIC8vIGNhcHR1cmVkIG9uIGEgZGVza3RvcCB2aWV3cG9ydCksIGB1bmRlZmluZWRgID0gbWF0Y2hNZWRpYSB0aHJldy5cbiAgbWVkaWFBY3RpdmU/OiBib29sZWFuO1xufTtcblxuLy8gU3ludGhldGljIGhpbnRzIFBpbmNoR3JhYiBhZGRzIHRvIGVudHJpZXMg4oCUIGtlcHQgZGlzdGluY3QgZnJvbSBgYXR0cnNgXG4vLyAocmVhbCBET00gYXR0cmlidXRlcykgc28gY29uc3VtZXJzIGNhbiB0ZWxsIHdoYXQgY2FtZSBmcm9tIHRoZSBwYWdlIHZzXG4vLyB3aGF0IHRoZSBjYXB0dXJlIHBpcGVsaW5lIGluamVjdGVkLlxuZXhwb3J0IHR5cGUgRW50cnlIaW50cyA9IHtcbiAgZm9ybWF0Pzogc3RyaW5nOyAgICAgLy8gaW5wdXQgZm9ybWF0IGhpbnQgKGUuZy4gJ1lZWVktTU0tREQnKVxuICB2YWx1ZU1hc2tlZD86IGJvb2xlYW47IC8vIHBhc3N3b3JkIHZhbHVlIHdhcyBtYXNrZWQgYXQgY2FwdHVyZSB0aW1lXG59O1xuXG5leHBvcnQgdHlwZSBFbnRyeSA9IHtcbiAgLy8gU3RhYmxlIHBlci1lbnRyeSB1dWlkLiBHZW5lcmF0ZWQgYXQgY2FwdHVyZSB0aW1lLiBEaXN0aW5jdCBmcm9tIGBuYFxuICAvLyAoZGlzcGxheSBzZXF1ZW5jZSkgYW5kIGZyb20gYGlkYCAoRE9NIGh0bWwgaWQgYXR0cmlidXRlKS4gRm9yZWlnbi1rZXlcbiAgLy8gdGFyZ2V0IGZvciBGZWVkYmFja01lc3NhZ2UucGFyZW50SWQuXG4gIHVpZDogc3RyaW5nO1xuICAvLyBGb3JlaWduIGtleSBpbnRvIHRoZSBzZXNzaW9uIHJvdyAoUGFnZU1lc3NhZ2Uuc2Vzc2lvbklkKS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIGxpbmsgY2FwdHVyZXMgYmFjayB0byBcIndoaWNoIHBhZ2UtbG9hZCBjb250ZXh0IGRpZCB0aGV5XG4gIC8vIGNvbWUgZnJvbT9cIiB3aXRob3V0IGRlcGVuZGluZyBvbiBVUkwgc3RyaW5nIGVxdWFsaXR5LCB3aGljaCBicmVha3NcbiAgLy8gb24gaGFzaCBuYXZpZ2F0aW9uLCBxdWVyeS1wYXJhbSBzd2FwcywgYW5kIFNQQSByb3V0aW5nLiBTZXQgYnkgdGhlXG4gIC8vIHNpZGUgcGFuZWwgYXQgbWVzc2FnZS1yZWNlaXZlIHRpbWUsIG5vdCBvbiB0aGUgcGFnZSBzaWRlLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG4gIG46IG51bWJlcjtcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBvdXRlckhUTUw/OiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIC8vIFRoZSB2aXN1YWxseS1yZW5kZXJlZCBmb3JtIHdoZW4gQ1NTIGB0ZXh0LXRyYW5zZm9ybWAgaXMgc2V0LiBDYXB0dXJlZFxuICAvLyBhbG9uZ3NpZGUgYHRleHRgICh3aGljaCBpcyB0aGUgc291cmNlLXRydXRoIGB0ZXh0Q29udGVudGApIHNvIGFuIExMTVxuICAvLyBjYW4gZGlzYW1iaWd1YXRlIGJldHdlZW4gZS5nLiBzb3VyY2UgYFJlZnJlc2hgIGFuZCByZW5kZXJlZCBgUkVGUkVTSGBcbiAgLy8gd2l0aG91dCBmYWxzZS1ncmVwcGluZyBhZ2FpbnN0IGVpdGhlci5cbiAgcmVuZGVyZWRUZXh0Pzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICBhY2Nlc3NpYmxlTmFtZT86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7ICAgICAgICAgICAgLy8gdGhlIERPTSBodG1sIGlkIGF0dHJpYnV0ZSAodW5jaGFuZ2VkKVxuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbiAgYXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyByZWFsIERPTSBhdHRyaWJ1dGVzIG9ubHlcbiAgaGludHM/OiBFbnRyeUhpbnRzOyAgICAgLy8gc3ludGhldGljIGNhcHR1cmUtdGltZSBoaW50c1xuICByZWN0OiBSZWN0O1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIGluU2hhZG93RE9NPzogYm9vbGVhbjtcbiAgLy8gQ1NTIHNlbGVjdG9yIGZvciB0aGUgc2hhZG93IGhvc3Qgd2hlbiBgaW5TaGFkb3dET01gIGlzIHRydWUuIExldHMgYVxuICAvLyBjb25zdW1lciAob3IgdGhlIHBhbmVsJ3MgcmUtdmFsaWRhdGlvbiBwYXNzKSBmaW5kIHRoZSBob3N0IGVsZW1lbnRcbiAgLy8gc2luY2UgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyByb290cy5cbiAgc2hhZG93SG9zdD86IHN0cmluZztcbiAgY29tcG9uZW50Um9vdD86IHN0cmluZztcbiAgYW5jZXN0b3JzPzogQW5jZXN0b3JbXTtcbiAgY29tcG9uZW50PzogRnJhbWV3b3JrSW5mbztcbiAgLy8gUmVhY3QgZXZlbnQgaGFuZGxlciBuYW1lcyBwcm9iZWQgZnJvbSBgX19yZWFjdFByb3BzJDxrZXk+YCDigJQgYW5zd2Vyc1xuICAvLyBcIndoaWNoIGhhbmRsZXIgZmlyZXMgd2hlbiB0aGlzIGlzIGNsaWNrZWQ/XCIgd2l0aG91dCBhbiBMTE0gaGF2aW5nIHRvXG4gIC8vIGdyZXAgdGhlIGNvZGViYXNlLiBJbiBkZXYgYnVpbGRzIHRoZXNlIGFyZSByZWFsIGZ1bmN0aW9uIG5hbWVzOyBpblxuICAvLyBwcm9kIHRoZXkncmUgbWluaWZpZWQgYnV0IHN0aWxsIGFuY2hvci1hYmxlLlxuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBodG14IC8gU3RpbXVsdXMgLyBBbHBpbmUgLyBUdXJibyB3aXJpbmcgb24gdGhlIGVsZW1lbnQuIFNlcnZlci1cbiAgLy8gcmVuZGVyZWQgYXBwcyBkb24ndCBoYXZlIFJlYWN0IGZpYmVycyDigJQgZm9yIHRoZW0sIHRoaXMgSVMgdGhlXG4gIC8vIGNvbXBvbmVudCBzaGFwZS5cbiAgYmVoYXZpb3JBdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIFRydWUgd2hlbiBgZWwuZ2V0QW5pbWF0aW9ucygpYCByZXBvcnRlZCBhbiBhY3RpdmVseS1wbGF5aW5nXG4gIC8vIGFuaW1hdGlvbiBhdCBjYXB0dXJlIHRpbWUuIFRlbGxzIHRoZSBjb25zdW1lciB0aGF0IGNhcHR1cmVkIHJlY3QgL1xuICAvLyB0cmFuc2Zvcm0gLyBvcGFjaXR5IG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZS5cbiAgaXNBbmltYXRpbmc/OiBib29sZWFuO1xuICAvLyBGb3IgZWxlbWVudHMgcmVuZGVyZWQgaW50byBhIGA8Y2FudmFzPmAsIHRoZSBET00gZ2l2ZXMgdXMgZXNzZW50aWFsbHlcbiAgLy8gbm90aGluZyBhYm91dCB3aGF0IHdhcyBjbGlja2VkIOKAlCB0aGUgY2FudmFzIGhhcyBubyBjaGlsZHJlbiwgbm9cbiAgLy8gdGV4dCwgbm8gbWVhbmluZ2Z1bCBzZWxlY3RvcnMgYmVsb3cgdGhlIGNhbnZhcyBpdHNlbGYuIENhcHR1cmUgdGhlXG4gIC8vIGNsaWNrIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMncyBib3VuZGluZyBib3ggc28gYSBkb3duc3RyZWFtXG4gIC8vIGNvbnN1bWVyIGNhbiBjb3JyZWxhdGUgKGUuZy4gYWdhaW5zdCBhIERhdGFkb2cgLyBUYWJsZWF1IC8gY2hhcnRpbmdcbiAgLy8gbGlicmFyeSB0aGF0IGV4cG9zZXMgZGF0YS1wb2ludCBjb29yZGluYXRlcykuIENvb3JkaW5hdGVzIGFyZSBDU1NcbiAgLy8gcGl4ZWxzOyBtdWx0aXBseSBieSBgdmlld3BvcnQuZHByYCB0byBnZXQgZGV2aWNlIHBpeGVscy5cbiAgY2FudmFzQ2xpY2s/OiB7XG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIG9mZnNldFk6IG51bWJlcjtcbiAgICBjYW52YXNXOiBudW1iZXI7XG4gICAgY2FudmFzSDogbnVtYmVyO1xuICAgIGNhbnZhc1NlbGVjdG9yOiBzdHJpbmc7XG4gIH07XG4gIC8vIENvbnRlbnRlZGl0YWJsZSByaWNoLXRleHQgZWRpdG9yIGNvbnRleHQuIFBvcHVsYXRlZCB3aGVuIHRoZSBjYXB0dXJlZFxuICAvLyBub2RlIGlzLCBvciBsaXZlcyBpbnNpZGUsIGEgYFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1gIGFuY2VzdG9yLiBMZXRzXG4gIC8vIGFuIExMTSByZWFzb25pbmcgYWJvdXQgYSBcImNvcHkgaXMgd3JvbmdcIiAvIFwidGhlIGVkaXRvciBicmVha3Mgd2hlbiBYXCJcbiAgLy8gY2FwdHVyZSBrbm93IHdoaWNoIGVkaXRvciBsaWJyYXJ5IHRvIGxvb2sgYXQg4oCUIHNlbGVjdG9ycyBnZW5lcmF0ZWRcbiAgLy8gYnkgUHJvc2VNaXJyb3IgLyBMZXhpY2FsIC8gZXRjIGFyZSBydW50aW1lLWludGVybmFsIGFuZCB3b24ndCBncmVwXG4gIC8vIGFnYWluc3QgdXNlciBjb2RlLCBidXQgdGhlIExJQlJBUlkgcG9pbnRlciByb3V0ZXMgdGhlIExMTSB0byB0aGVcbiAgLy8gcmlnaHQgd3JhcHBlciBjb21wb25lbnQuXG4gIGVkaXRvcj86IHtcbiAgICBraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnO1xuICAgIHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbiAgfTtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBCRUZPUkUgdGhlIGNsaWNrLiBSZXBybyBjb250ZXh0IGZvciBidWdzIGxpa2VcbiAgLy8gXCJJIGNsaWNrZWQgdGhlIHdyb25nIGRyb3Bkb3duIG9wdGlvblwiIG9yIFwidGhlIHZhbHVlIGZsaWNrZXJlZCBiZWZvcmVcbiAgLy8gSSBjbGlja2VkIGl0XCIg4oCUIHdpdGhvdXQgdGhpcywgdGhlIEpTT04gc25hcHNob3RzIG9ubHkgdGhlIHBvc3QtXG4gIC8vIG11dGF0aW9uIHN0YXRlLCBsZWF2aW5nIHRoZSBMTE0gYmxpbmQgdG8gd2hhdCB0cmlnZ2VyZWQgdGhlXG4gIC8vIGFwcGVhcmFuY2UgdGhlIHVzZXIgY29tcGxhaW5lZCBhYm91dC4gUGluY2hncmFiIGtlZXBzIGFuIDgtc2Vjb25kXG4gIC8vIHJpbmcgYnVmZmVyIG9mIG11dGF0aW9uIHJlY29yZHM7IGNhcHR1cmUgYXR0YWNoZXMgdGhlIG1vc3QgcmVjZW50XG4gIC8vIDMgYXMgYSBzbmFwc2hvdC5cbiAgZG9tTXV0YXRpb25zPzogRG9tTXV0YXRpb25bXTtcbiAgc3RhdGVzPzogc3RyaW5nW107ICAgICAgLy8gYWN0aXZlIHBzZXVkby1jbGFzc2VzICh3YXMgUmVjb3JkPHN0cmluZywgdHJ1ZT4gaW4gdjEpXG4gIC8vIExvY2F0b3IgcXVhbGl0eTogaG93IG1hbnkgZWxlbWVudHMgYHNlbGVjdG9yYCByZXNvbHZlcyB0byBpbiBpdHNcbiAgLy8gc2NvcGUgKDEgPSB1bmlxdWUpLiBIaWdoZXIgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91cy5cbiAgc2VsZWN0b3JNYXRjaENvdW50PzogbnVtYmVyO1xuICAvLyBEaXNhbWJpZ3VhdGVkIG9yZGVyaW5nIGZpZWxkcy5cbiAgLy8gYG5gIGlzIHByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdCAoaXQncyB0aGUgY2FwdHVyZS1zZXF1ZW5jZVxuICAvLyBkaXNwbGF5IGxhYmVsIGluIHRoZSBzaWRlYmFyKS4gVGhlIG5ldyBmaWVsZHMgYXJlIGVtaXQtdGltZSBvbmx5OlxuICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHNhbWUgYXMgYG5gIChjYXB0dXJlIHNlcXVlbmNlIHdpdGhpbiBzZXNzaW9uKVxuICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgcmFuayB3aXRoaW4gdGhlIHBhZ2VcbiAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCBodW1hbi1mYWNpbmcgbGFiZWwgKG1pcnJvcnMgYG5gIHRvZGF5KVxuICBjYXB0dXJlSW5kZXg/OiBudW1iZXI7XG4gIGV2ZW50SW5kZXg/OiBudW1iZXI7XG4gIHZpc3VhbE9yZGVyPzogbnVtYmVyO1xuICBkaXNwbGF5TGFiZWw/OiBzdHJpbmc7XG4gIC8vIEdyb3VwIGZsYXR0ZW5pbmcgZmllbGRzLlxuICAvLyBUaGUgZ3JvdXAgaGVhZCBjYXJyaWVzIGBncm91cE1lbWJlclVpZHNgIChqdXN0IHRoZSBJRHMpOyBlYWNoXG4gIC8vIG1lbWJlciBlbWl0cyBhcyBpdHMgb3duIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nXG4gIC8vIGJhY2sgYXQgdGhlIGhlYWQuXG4gIGdyb3VwTWVtYmVyVWlkcz86IHN0cmluZ1tdO1xuICBncm91cFVpZD86IHN0cmluZztcbiAgLy8gTGlnaHR3ZWlnaHQgYTExeSBhdWRpdCBjYXB0dXJlZCBhdCBjbGljayB0aW1lLiBIZWF2aWVyIGNoZWNrc1xuICAvLyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90cywgYXhlIHZpb2xhdGlvbnMpIGFyZSBub3QgeWV0IHdpcmVkLlxuICBhMTF5Pzoge1xuICAgIGNvbnRyYXN0UmF0aW8/OiBudW1iZXI7XG4gICAgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7XG4gICAgdGFiYmFibGU/OiBib29sZWFuO1xuICAgIGZvY3VzVmlzaWJsZT86IGJvb2xlYW47XG4gIH07XG4gIC8vIFBhcmVudCBsYXlvdXQgY29udGV4dCDigJQgZmxleC9ncmlkL292ZXJmbG93L3Njcm9sbC9zdGFja2luZ1xuICAvLyBhbmNlc3RvcnMgdGhhdCBzaGFwZSB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGFwcGVhcmFuY2UuXG4gIGxheW91dENvbnRleHQ/OiBBcnJheTx7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgZGlzcGxheT86IHN0cmluZztcbiAgICBwb3NpdGlvbj86IHN0cmluZztcbiAgICBvdmVyZmxvdz86IHN0cmluZztcbiAgICB6SW5kZXg/OiBzdHJpbmc7XG4gICAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICAgIHdpbGxDaGFuZ2U/OiBzdHJpbmc7XG4gICAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICAgIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gICAgc2Nyb2xsVG9wPzogbnVtYmVyO1xuICAgIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICB9PjtcbiAgLy8gQXNzZXQgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIGNhcHR1cmVkIHN1YnRyZWUgKGltZyBzcmMsIDx1c2UgaHJlZj4sXG4gIC8vIGJhY2tncm91bmQtaW1hZ2UgdXJsKS4gV2hlbiBhIGNvbXBsYWludCBpcyBhYm91dCBhIGxvZ28gLyBpY29uIC9cbiAgLy8gYXJ0d29yaywgYW4gYWdlbnQgd2l0aG91dCB0aGVzZSByZWZlcmVuY2VzIHdvdWxkIGJlIGxlZnQgZ3Vlc3NpbmcuXG4gIGFzc2V0cz86IEFycmF5PHtcbiAgICBzcmM6IHN0cmluZztcbiAgICBuYXR1cmFsVz86IG51bWJlcjsgbmF0dXJhbEg/OiBudW1iZXI7XG4gICAgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7XG4gICAgYWx0Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gIH0+O1xuICBzdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtYXRjaGVkUnVsZXM/OiBNYXRjaGVkUnVsZVtdO1xuICBwc2V1ZG9FbGVtZW50cz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICAvLyBUcnVuY2F0aW9uIG1hcmtlcnMg4oCUIHByZXNlbnQgd2hlbiBjYXB0dXJlIGhhZCB0byBlbGlkZSBjb250ZW50LiBMZXRzXG4gIC8vIGEgY29uc3VtZXIgZGV0ZWN0IFwidGhpcyBlbnRyeSB3YXMgY3V0IGRvd25cIiBhbmQgcmVmZXRjaCBmcm9tIHRoZVxuICAvLyBsaXZlIHBhZ2UgaWYgaXQgbmVlZHMgdGhlIGZ1bGwgdmVyc2lvbi5cbiAgLy8gICBvdXRlckhUTUwg4oCUIG9yaWdpbmFsIGh0bWwgbGVuZ3RoIGJlZm9yZSB0aGUgc2l6ZS1jYXAga2lja2VkIGluLlxuICAvLyAgIGNoaWxkcmVuICDigJQgbnVtYmVyIG9mIGRlc2NlbmRhbnQgc3VidHJlZXMgcmVwbGFjZWQgYnkgZGVwdGgtY2FwXG4gIC8vICAgICAgICAgICAgICAgZWxpc2lvbiBtYXJrZXJzIChgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gKS5cbiAgdHJ1bmNhdGVkPzoge291dGVySFRNTD86IG51bWJlcjsgY2hpbGRyZW4/OiBudW1iZXI7IHRleHQ/OiBudW1iZXJ9O1xuICAvLyBHcm91cCBvZiBhZGRpdGlvbmFsIGNhcHR1cmVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudHJ5IChBbHQrU2hpZnQrQ2xpY2tcbiAgLy8gLyBBbHQrZHJhZyBzZWxlY3Rpb25zIGNvbGxhcHNlIGhlcmUpLlxuICBncm91cD86IEVudHJ5W107XG4gIC8vIE9wdGlvbmFsIHNjcmVlbnNob3QgYnVuZGxlOiBlYWNoIGZpZWxkIGlzIGEgcmVsYXRpdmUgcGF0aCB1bmRlciB0aGVcbiAgLy8gdXNlcidzIERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+LyByb290LiBUaGUgY2FwdHVyZWRBdCBzdGFtcCBpc1xuICAvLyB0aGUgSVNPIHRpbWVzdGFtcCB3aGVuIHRoZSBzaG90IHdhcyB0YWtlbi5cbiAgc2NyZWVuc2hvdD86IHtcbiAgICBlbGVtZW50Pzogc3RyaW5nO1xuICAgIGdyb3VwPzogc3RyaW5nO1xuICAgIHBhZ2U/OiBzdHJpbmc7XG4gICAgY2FwdHVyZWRBdD86IHN0cmluZztcbiAgICAvLyBBbiBlbXB0eSBgc2NyZWVuc2hvdGAgZmllbGQgY291bGQgbWVhbiBcIm5vdCB5ZXQgc2hvdFwiLCBcImZhaWxlZFwiLFxuICAgIC8vIG9yIFwic2tpcHBlZCBvbiBwdXJwb3NlXCIuIFdoZW4gdGhlIHBpcGVsaW5lIGRlY2xpbmVzIG9yIGZhaWxzLFxuICAgIC8vIHNldCB0aGlzIHNvIHJlY2VpdmVycyBrbm93IGl0J3Mgbm90IGEgcmV0cnkgY2FuZGlkYXRlLlxuICAgIHVuYXZhaWxhYmxlUmVhc29uPzogJ2F1dG9TY3JlZW5zaG90T2ZmJyB8ICdza2lwU2NyZWVuc2hvdEhvc3RzJyB8ICdjYXB0dXJlRmFpbGVkJyB8ICdwZXJtaXNzaW9uRGVuaWVkJyB8IHN0cmluZztcbiAgICAvLyBDcm9wIG1ldGFkYXRhIGRlc2NyaWJpbmcgd2hlcmUgdGhlIGNyb3BwZWQgUE5HIGZpdHMgaW4gdGhlXG4gICAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICBjcm9wPzoge1xuICAgICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZHByOiBudW1iZXI7XG4gICAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0NzID1cbiAgfCB7a2luZDogJ291dGxpbmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBnb2xkPzogYm9vbGVhbjsgZGFzaGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ291dGxpbmUtY2xlYXInfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFNhdmVSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aFxuICBhYnNQYXRoPzogc3RyaW5nOyAgLy8gT1MtYWJzb2x1dGUgcGF0aFxuICBjb3B5UGF0aD86IHN0cmluZzsgLy8gVUktZmFjaW5nIHBhdGhcbiAgdGVtcFBhdGg/OiBib29sZWFuO1xuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEJnUmVwbHkgPVxuICB8IHtkYXRhVXJsOiBzdHJpbmd9XG4gIHwge2ZvdW5kOiBib29sZWFuOyBvcGVuZWQ/OiBudW1iZXJ9XG4gIHwge3RhYnM6IEFycmF5PHtpZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ30+fVxuICB8IHtlcnJvcjogc3RyaW5nfVxuICB8IFNob3RSZXBseVxuICB8IFNhdmVSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gIH07XG4gIC8vIFJlc29sdXRpb24gcm9vdCBmb3IgZXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkwgc3RyZWFtLlxuICAvLyAgIOKAoiAnYXJjaGl2ZScgICDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBleHRyYWN0ZWQgYXJjaGl2ZSByb290XG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciB0YXIuenN0IGV4cG9ydHMpLlxuICAvLyAgIOKAoiAnd29ya3NwYWNlJyDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB3b3Jrc3BhY2UgZGlyIG9uIGRpc2ssXG4gIC8vICAgICAgICAgICAgICAgICAgIGkuZS4gYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2BcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHBsYWluIEpTT05MIGV4cG9ydHMpLlxuICAvLyBSZWNlaXZlcnMgcHJlcGVuZCB0aGUgYXBwcm9wcmlhdGUgcm9vdCB0byByZXNvbHZlIGFueSBwYXRoIGZpZWxkLlxuICBwYXRoUm9vdD86ICdhcmNoaXZlJyB8ICd3b3Jrc3BhY2UnO1xuICAvLyBJbmRpcmVjdGlvbiBwb2ludGVyIHRvIHRoZSBVSSBza2lsbCB0aGF0IGtub3dzIGhvdyB0byB0cmlhZ2UgdGhlc2VcbiAgLy8gY2FwdHVyZXMuIFdoZW4gYGlubGluZTogdHJ1ZWAsIHRoZSBza2lsbCBjb250ZW50IGxpdmVzIGF0XG4gIC8vIGBhcmNoaXZlUGF0aGAgaW5zaWRlIHRoZSB0YXIgKGRlZmF1bHQ6IGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgKS5cbiAgLy9cbiAgLy8gYGN1c3RvbWl6ZWRgIGFuZCBgdGVtcGxhdGVgIGFyZSBtdXR1YWxseS1leGNsdXNpdmUgY29uZmlkZW5jZSBmbGFnczpcbiAgLy8gICDigKIgY3VzdG9taXplZDogdHJ1ZSDihpIgdXNlciB1cGxvYWRlZCAvIHBhc3RlZCB0aGVpciBvd24gY29udGVudC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IHRoZSBmaWxlIGFzIGF1dGhvcml0YXRpdmUuXG4gIC8vICAg4oCiIHRlbXBsYXRlOiB0cnVlICAg4oaSIHVzZXIgaXMgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgZGVmYXVsdC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IGFzIGdlbmVyaWMgYm9pbGVycGxhdGU7IHZlcmlmeSBiZWZvcmVcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIGFwcGx5aW5nLlxuICAvLyAoVGhlIHByZXZpb3VzIGB0ZW1wbGF0ZWAgZmxhZyBhbG9uZSB3YXMgYW1iaWd1b3VzIGJlY2F1c2UgdGhlXG4gIC8vIGJ1bmRsZWQgbG9jYWwgdGVtcGxhdGUgc3RpbGwgbG9va3MgcHJvamVjdC1zcGVjaWZpYy4pXG4gIHNraWxsPzoge25hbWU6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFBvaW50ZXIgdG8gdGhlIHByb2plY3QncyBERVNJR04ubWQuIFNhbWUgcnVsZXM6IGBjdXN0b21pemVkOiB0cnVlYFxuICAvLyBtZWFucyB0aGUgdXNlciBzdXBwbGllZCB0aGlzIGNvbnRlbnQ7IGB0ZW1wbGF0ZTogdHJ1ZWAgbWVhbnMgaXQnc1xuICAvLyBQaW5jaEdyYWIncyBidW5kbGVkIGRlZmF1bHQuXG4gIGRlc2lnbj86IHtwYXRoPzogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFNlbGYtcm9hc3Qgc2VjdGlvbi4gVGhlIGV4cG9ydCBzdXJmYWNlcyBpdHMgb3duIGdhcHMgc28gYVxuICAvLyBkb3duc3RyZWFtIExMTSBkb2Vzbid0IGhhdmUgdG8gZGlzY292ZXJcbiAgLy8gdGhlbS4gRW1wdHkgYXJyYXkgPSBjbGVhbiBleHBvcnQuIEVhY2ggZGlhZ25vc3RpYyBoYXMgYSBzdGFibGVcbiAgLy8gYGNvZGVgIHNvIHJlY2VpdmVycyBjYW4gZGlzcGF0Y2ggb24gaXQgcHJvZ3JhbW1hdGljYWxseS5cbiAgZXhwb3J0RGlhZ25vc3RpY3M/OiBFeHBvcnREaWFnbm9zdGljW107XG4gIC8vIEFyY2hpdmUgaW50ZWdyaXR5LiBSZWNlaXZlcnMgY2FuIGRldGVjdCBwYXJ0aWFsIGV4dHJhY3Rpb24gL1xuICAvLyBjb3JydXB0aW9uIHdpdGggYSBzaW5nbGUgY2hlY2suXG4gIGFyY2hpdmVJbnRlZ3JpdHk/OiB7XG4gICAgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+O1xuICB9O1xuICAvLyBCdWlsZC9zb3VyY2UgaWRlbnRpdHkuIENhcHR1cmVkIGZyb20gYVxuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluIGRpcnR5OnRydWVcIj5gXG4gIC8vIHRhZyB0aGUgdXNlcidzIGFwcCBpbmplY3RzLCBwbHVzIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB0ZWxsIGlmIHRoZSBleHBvcnQgaXMgc3RhbGUgcmVsYXRpdmUgdG8gdGhlIHJlcG8uXG4gIC8vIE9taXR0ZWQgZW50aXJlbHkgd2hlbiBubyBidWlsZCBpbmZvIGlzIGF2YWlsYWJsZS5cbiAgYnVpbGQ/OiB7XG4gICAgZXh0ZW5zaW9uVmVyc2lvbj86IHN0cmluZztcbiAgICBjb21taXQ/OiBzdHJpbmc7XG4gICAgYnJhbmNoPzogc3RyaW5nO1xuICAgIGRpcnR5PzogYm9vbGVhbjtcbiAgICBkZXBsb3lCdWlsZD86IHN0cmluZztcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIEV4cG9ydERpYWdub3N0aWMgPSB7XG4gIHNldmVyaXR5OiAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nO1xuICBjb2RlOiBzdHJpbmc7XG4gIGRldGFpbD86IHN0cmluZztcbiAgdWlkPzogc3RyaW5nO1xufTtcblxuLy8gRW52ZWxvcGUgbWFya2VyIHVzZWQgb24gZXZlcnkgUGluY2hHcmFiIG1lc3NhZ2UgKHNvIG90aGVyIGV4dGVuc2lvblxuLy8gbWVzc2FnZXMgdHJhdmVsaW5nIHRocm91Z2ggdGhlIHNhbWUgY2hhbm5lbCBhcmUgaWdub3JlZCkuIF9fbWlkIGlzIGFcbi8vIHBlci1kaXNwYXRjaCB1bmlxdWUgc3RhbXAgc28gcmVjZWl2ZXJzIGNhbiBkZWR1cGUgYSBtZXNzYWdlIHRoYXQgYXJyaXZlc1xuLy8gdGhyb3VnaCBtb3JlIHRoYW4gb25lIGNoYW5uZWwgKGUuZy4gcnVudGltZS5vbk1lc3NhZ2UgKyBhIHBvcnQgcmVsYXkpLlxuZXhwb3J0IHR5cGUgUGdFbnZlbG9wZTxUPiA9IFQgJiB7X19wZzogdHJ1ZTsgX19taWQ6IHN0cmluZ307XG5cbmV4cG9ydCB0eXBlIEFueU1lc3NhZ2UgPSBDc1RvUGFuZWwgfCBQYW5lbFRvQ3MgfCBQYW5lbFRvQmc7XG5cbmxldCBfbWlkQ291bnRlciA9IDA7XG5jb25zdCBuZXdNaWQgPSAoKTogc3RyaW5nID0+IHtcbiAgY29uc3QgcHJlZml4ID0gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7KCsrX21pZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB0cnkge1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke0FycmF5LmZyb20oYnl0ZXMpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxufTtcblxuLy8gSGVscGVyOiBzdGFtcCBhIHBheWxvYWQgd2l0aCB0aGUgZW52ZWxvcGUgbWFya2VyICsgdW5pcXVlIG1lc3NhZ2UgaWQuXG5leHBvcnQgY29uc3QgcGcgPSA8VCBleHRlbmRzIHtraW5kOiBzdHJpbmd9PihwYXlsb2FkOiBUKTogUGdFbnZlbG9wZTxUPiA9PlxuICAoe19fcGc6IHRydWUsIF9fbWlkOiBuZXdNaWQoKSwgLi4ucGF5bG9hZH0pIGFzIFBnRW52ZWxvcGU8VD47XG4iLAogICAgIi8vIFBpbmNoR3JhYiDigJQgYmFja2dyb3VuZCBzZXJ2aWNlIHdvcmtlciAoTVYzKVxuLy9cbi8vIOKAoiBPcGVuIHRoZSBzaWRlIHBhbmVsIG9uIGFjdGlvbiBjbGlja1xuLy8g4oCiIEluamVjdCB0aGUgY29udGVudCBzY3JpcHQgaW50byBhbHJlYWR5LW9wZW4gdGFicyAobm8gcmVmcmVzaCBuZWVkZWQpXG4vLyDigKIgUmlnaHQtY2xpY2sgXCJQaW5jaEdyYWIgY2FwdHVyZVwiIGNvbnRleHQgbWVudVxuLy8g4oCiIENhcHR1cmUgdmlzaWJsZS10YWIgc2NyZWVuc2hvdHMgb24gc2lkZS1wYW5lbCByZXF1ZXN0XG4vLyDigKIgQXV0by1vcGVuIHRoZSBzaWRlIHBhbmVsIG9uIGZpcnN0IGNhcHR1cmUgKHVzZXMgQ2hyb21lIDExNisgdXNlci1nZXN0dXJlXG4vLyAgIHByb3BhZ2F0aW9uIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UpXG4vLyDigKIgUmVsYXkgY29udGVudC1zY3JpcHQgbWVzc2FnZXMgdG8gc2lkZS1wYW5lbCBwb3J0c1xuLy8g4oCiIFNjcmVlbnNob3Qgd29ya2VyOiBzaG90LWVsZW1lbnQgLyBzaG90LWdyb3VwIC8gc2hvdC1wYWdlIGtpbmRzLiBFYWNoXG4vLyAgIGNhcHR1cmVzIHZpYSBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYiwgb3B0aW9uYWxseSBjcm9wcy9zdGl0Y2hlc1xuLy8gICBpbiBhbiBPZmZzY3JlZW5DYW52YXMsIGFuZCB3cml0ZXMgdGhlIFBORyBpbnRvIHRoZSB1c2VyJ3MgRG93bmxvYWRzXG4vLyAgIHVuZGVyIC5waW5jaGdyYWIvPHdvcmtzcGFjZT4vc2NyZWVuc2hvdHMvLlxuXG5pbXBvcnQgdHlwZSB7QW55TWVzc2FnZSwgUGdFbnZlbG9wZSwgU2hvdFJlcGx5fSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuXG5jb25zdCBMT0cgPSAnW1BpbmNoR3JhYi9iZ10nO1xuXG4vLyDilIDilIDilIAgVG9vbGJhciBpY29uOiByZW5kZXIgdGhlIPCfpI8gZW1vamkgaW50byBJbWFnZURhdGEg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBXZSBkb24ndCBzaGlwIHN0YXRpYyBQTkcgaWNvbnM7IHdlIGRyYXcgdGhlbSBhdCBzdGFydHVwIHNvIHRoZSBPUydzIG93blxuLy8gcGluY2ggZ2x5cGggaXMgdXNlZCAoY29uc2lzdGVudCB3aXRoIHRoZSBicmFuZCBpbiB0aGUgc2lkZSBwYW5lbCkuXG5hc3luYyBmdW5jdGlvbiBzZXRFbW9qaUljb24oKTogUHJvbWlzZTx2b2lkPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2l6ZXMgPSBbMTYsIDMyLCA0OCwgMTI4XTtcbiAgICBjb25zdCBpbWFnZURhdGE6IFJlY29yZDxudW1iZXIsIEltYWdlRGF0YT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHNpemUgb2Ygc2l6ZXMpIHtcbiAgICAgIGNvbnN0IGMgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHNpemUsIHNpemUpO1xuICAgICAgY29uc3QgY3R4ID0gYy5nZXRDb250ZXh0KCcyZCcpITtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSk7XG4gICAgICBjdHguZm9udCA9IGAke01hdGguZmxvb3Ioc2l6ZSAqIDAuODIpfXB4IFwiQXBwbGUgQ29sb3IgRW1vamlcIixcIlNlZ29lIFVJIEVtb2ppXCIsXCJOb3RvIENvbG9yIEVtb2ppXCIsc2VyaWZgO1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgY3R4LmZpbGxUZXh0KCfwn6SPJywgc2l6ZSAvIDIsIHNpemUgLyAyICsgc2l6ZSAqIDAuMDQpO1xuICAgICAgaW1hZ2VEYXRhW3NpemVdID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBzaXplLCBzaXplKTtcbiAgICB9XG4gICAgYXdhaXQgY2hyb21lLmFjdGlvbi5zZXRJY29uKHtpbWFnZURhdGF9KTtcbiAgfSBjYXRjaCAoZSkgeyBjb25zb2xlLndhcm4oTE9HLCAnc2V0RW1vamlJY29uJywgZSk7IH1cbn1cblxuLy8gU3VwcHJlc3MgdGhlIGdsb2JhbCBDaHJvbWUgZG93bmxvYWRzIFVJIChcImRvd25sb2FkcyBidWJibGVcIiAvIHNoZWxmKSBzb1xuLy8gcGVyLWNhcHR1cmUgc2NyZWVuc2hvdCBzYXZlcyBkb24ndCBwb3AgdGhlIHBhbmVsIG9uIGV2ZXJ5IGFsdC1jbGljay5cbi8vIFRoZSB1c2VyJ3MgY29tcGxhaW50OiBcInNlbGVjdGluZyBlbGVtZW50cyBpcyBkb3dubG9hZGluZyBldmVyeSBzY3JlZW5zaG90XG4vLyBsaWtlIHNob3dpbmcgbXkgZG93bmxvYWRzIHBhbmUgb3BlblwiLiBDaHJvbWUgb2ZmZXJzIHR3byBBUElzIGRlcGVuZGluZyBvblxuLy8gdmVyc2lvbiDigJQgd2UgdHJ5IGJvdGggKGVhY2ggcmVxdWlyZXMgaXRzIG93biBwZXJtaXNzaW9uKSBhbmQgaWdub3JlXG4vLyBmYWlsdXJlcyBzbyB0aGUgZXh0ZW5zaW9uIHN0aWxsIHdvcmtzIHdpdGhvdXQgdGhlIHBlcm1pc3Npb25zLlxuLy9cbi8vIFRyYWRlb2ZmOiB0aGlzIGRpc2FibGVzIHRoZSBzaGVsZiBmb3IgQUxMIGRvd25sb2FkcyB3aGlsZSBwaW5jaGdyYWIgaXNcbi8vIHJ1bm5pbmcuIEEgZnV0dXJlIFwic2V0dGluZ3Mg4oaSIHF1aWV0IGRvd25sb2Fkc1wiIHRvZ2dsZSBjYW4gbWFrZSB0aGlzXG4vLyBvcHQtb3V0LlxuY29uc3QgcXVpZXREb3dubG9hZHNVaSA9ICgpOiB2b2lkID0+IHtcbiAgLy8gTmV3ZXIgQVBJIChDaHJvbWUgOTYrIHZpYSBkb3dubG9hZHMudWkgcGVybWlzc2lvbikuXG4gIHRyeSB7XG4gICAgKGNocm9tZS5kb3dubG9hZHMgYXMgYW55KS5zZXRVaU9wdGlvbnM/Lih7ZW5hYmxlZDogZmFsc2V9LCAoKSA9PiB7XG4gICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSBjb25zb2xlLmxvZyhMT0csICdzZXRVaU9wdGlvbnM6JywgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUubG9nKExPRywgJ3NldFVpT3B0aW9ucyB0aHJldycsIGUpOyB9XG4gIC8vIE9sZGVyIEFQSSAoc3RpbGwgcHJlc2VudCB0aHJvdWdoIENocm9tZSAxMTNpc2ggdmlhIGRvd25sb2Fkcy5zaGVsZikuXG4gIHRyeSB7IChjaHJvbWUuZG93bmxvYWRzIGFzIGFueSkuc2V0U2hlbGZFbmFibGVkPy4oZmFsc2UpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbn07XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgdHJ5IHsgYXdhaXQgY2hyb21lLnNpZGVQYW5lbC5zZXRQYW5lbEJlaGF2aW9yKHtvcGVuUGFuZWxPbkFjdGlvbkNsaWNrOiB0cnVlfSk7IH1cbiAgY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ3NldFBhbmVsQmVoYXZpb3InLCBlKTsgfVxuICB0cnkgeyBjaHJvbWUuY29udGV4dE1lbnVzLmNyZWF0ZSh7aWQ6ICdwZy1jYXB0dXJlJywgdGl0bGU6ICdQaW5jaEdyYWIg4oCUIGNhcHR1cmUgdGhpcyBlbGVtZW50JywgY29udGV4dHM6IFsnYWxsJ119KTsgfVxuICBjYXRjaCB7IC8qIG1heSBhbHJlYWR5IGV4aXN0ICovIH1cbiAgcXVpZXREb3dubG9hZHNVaSgpO1xuICB2b2lkIGluamVjdEludG9PcGVuVGFicygpO1xuICB2b2lkIHNldEVtb2ppSWNvbigpO1xufSk7XG5cbmNocm9tZS5ydW50aW1lLm9uU3RhcnR1cD8uYWRkTGlzdGVuZXIoKCkgPT4ge1xuICBxdWlldERvd25sb2Fkc1VpKCk7XG4gIHZvaWQgaW5qZWN0SW50b09wZW5UYWJzKCk7XG4gIHZvaWQgc2V0RW1vamlJY29uKCk7XG59KTtcblxuLy8gUmUtcXVpZXQgb24gZWFjaCBjb2xkIHN0YXJ0IG9mIHRoZSBTVyDigJQgdGhlIHNldHRpbmcgY2FuIGJlIHJlc2V0IGJ5IHRoZVxuLy8gdXNlciBvciBvdGhlciBleHRlbnNpb25zLCBhbmQgU1dzIGdvIGlkbGUgYWdncmVzc2l2ZWx5LlxucXVpZXREb3dubG9hZHNVaSgpO1xuXG5hc3luYyBmdW5jdGlvbiBpbmplY3RJbnRvT3BlblRhYnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KTtcbiAgICBmb3IgKGNvbnN0IHRhYiBvZiB0YWJzKSB7XG4gICAgICBpZiAoIXRhYi5pZCB8fCAhdGFiLnVybCB8fCAhL15odHRwcz86Ly50ZXN0KHRhYi51cmwpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICAgICAgdGFyZ2V0OiB7dGFiSWQ6IHRhYi5pZCwgYWxsRnJhbWVzOiBmYWxzZX0sXG4gICAgICAgICAgZmlsZXM6IFsnY29udGVudC1zY3JpcHQuanMnXSxcbiAgICAgICAgICBpbmplY3RJbW1lZGlhdGVseTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHsgLyogcHJvdGVjdGVkIHBhZ2U7IGlnbm9yZSAqLyB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdpbmplY3RJbnRvT3BlblRhYnMnLCBlKTsgfVxufVxuXG5jaHJvbWUudGFicy5vbkFjdGl2YXRlZC5hZGRMaXN0ZW5lcihhc3luYyAoe3RhYklkfSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRhYiA9IGF3YWl0IGNocm9tZS50YWJzLmdldCh0YWJJZCk7XG4gICAgaWYgKCF0YWI/LnVybCB8fCAhL15odHRwcz86Ly50ZXN0KHRhYi51cmwpKSByZXR1cm47XG4gICAgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDoge3RhYklkfSxcbiAgICAgIGZpbGVzOiBbJ2NvbnRlbnQtc2NyaXB0LmpzJ10sXG4gICAgICBpbmplY3RJbW1lZGlhdGVseTogdHJ1ZSxcbiAgICB9KS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG59KTtcblxuY2hyb21lLmNvbnRleHRNZW51cz8ub25DbGlja2VkLmFkZExpc3RlbmVyKChpbmZvLCB0YWIpID0+IHtcbiAgaWYgKGluZm8ubWVudUl0ZW1JZCAhPT0gJ3BnLWNhcHR1cmUnIHx8ICF0YWI/LmlkKSByZXR1cm47XG4gIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge19fcGc6IHRydWUsIGtpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfSkuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG59KTtcblxuLy8g4pSA4pSA4pSAIFNjcmVlbnNob3QgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gRmlsZW5hbWUgdGltZXN0YW1wIGlzIGVwb2NoIG1pbGxpc2Vjb25kcy4gU29ydGluZyBieSBuYW1lID0gc29ydGluZyBieVxuLy8gdGltZSB3aXRoaW4gYSBob3N0IGJ1Y2tldC4gV2UgYWNjZXB0IGFuIG9wdGlvbmFsIElTTyBzdHJpbmcgZm9yIHRlc3RzIGJ1dFxuLy8gbm9ybWFsaXplIHRvIGVwb2NoIG1zIHNvIHRoZSBvdXRwdXQgaXMgdW5pZm9ybS5cbmV4cG9ydCBjb25zdCB0c0ZvckZpbGVuYW1lID0gKGlzbz86IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGlmICghaXNvKSByZXR1cm4gU3RyaW5nKERhdGUubm93KCkpO1xuICBjb25zdCB0ID0gRGF0ZS5wYXJzZShpc28pO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKHQpID8gU3RyaW5nKHQpIDogU3RyaW5nKERhdGUubm93KCkpO1xufTtcblxuLy8gaG9zdC1zbHVnOiByZXBsYWNlIGAuYCB3aXRoIGBfYCAocGVyIHByb2plY3QgY29udmVudGlvbiBzbyBmaWxlbmFtZXMgYXJlXG4vLyBzaGVsbC1mcmllbmRseSBhbmQgZG9uJ3QgbG9vayBsaWtlIG11bHRpLWV4dGVuc2lvbiBwYXRocyBsaWtlIGBhcHAucGluY2hcbi8vIGdyYWIuY29tLS4uLmApLCBzdHJpcCBhbnkgb3RoZXIgbm9uLXdvcmQvaHlwaGVuIGNoYXJhY3RlcnMsIGNhcCBhdCA0MFxuLy8gY2hhcnMuIGBsb2NhbGhvc3Q6MzAwMGAg4oaSIGBsb2NhbGhvc3RfMzAwMGAuXG5leHBvcnQgY29uc3QgaG9zdFNsdWcgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBsZXQgaG9zdDogc3RyaW5nO1xuICB0cnkgeyBob3N0ID0gbmV3IFVSTCh1cmwpLmhvc3Q7IH0gY2F0Y2ggeyBob3N0ID0gJ3Vua25vd24nOyB9XG4gIHJldHVybiBob3N0LnJlcGxhY2UoL1xcLi9nLCAnXycpLnJlcGxhY2UoL1teXFx3LV0vZywgJ18nKS5zbGljZSgwLCA0MCkgfHwgJ3Vua25vd24nO1xufTtcblxuLy8gRmlsZW5hbWUgbGF5b3V0OiBgPGhvc3RfdW5kZXJzY29yZWQ+LW48Tj4tPGtpbmQ+Wy08ZXh0cmE+XS08ZXBvY2g+LnBuZ2AuXG4vLyBIb3N0IGZpcnN0IG1lYW5zIHNjcmVlbnNob3RzIGluIERvd25sb2Fkcy8ucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvXG4vLyBncm91cCBuYXR1cmFsbHkgcGVyIHNpdGU7IGVwb2NoIGFzIGEgdGFpbCBrZXkgZ2l2ZXMgY2hyb25vbG9naWNhbCBvcmRlclxuLy8gaW5zaWRlIGVhY2ggYnVja2V0LlxuZXhwb3J0IGNvbnN0IGJ1aWxkRmlsZW5hbWUgPSAoXG4gIGtpbmQ6ICdlbGVtZW50JyB8ICdncm91cCcgfCAncGFnZScsXG4gIHRzOiBzdHJpbmcsXG4gIG46IG51bWJlcixcbiAgdXJsOiBzdHJpbmcsXG4gIG9wdHM6IHtjb3VudD86IG51bWJlcjsgdHJ1bmNhdGVkPzogYm9vbGVhbn0gPSB7fSxcbik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHN0YW1wID0gdHNGb3JGaWxlbmFtZSh0cyk7XG4gIGNvbnN0IHNsdWcgPSBob3N0U2x1Zyh1cmwpO1xuICBpZiAoa2luZCA9PT0gJ2VsZW1lbnQnKSByZXR1cm4gYCR7c2x1Z30tbiR7bn0tZWxlbWVudC0ke3N0YW1wfS5wbmdgO1xuICBpZiAoa2luZCA9PT0gJ2dyb3VwJykgcmV0dXJuIGAke3NsdWd9LW4ke259LWdyb3VwJHtvcHRzLmNvdW50ID8/IDB9LSR7c3RhbXB9LnBuZ2A7XG4gIC8vIHBhZ2VcbiAgY29uc3Qgc3VmZml4ID0gb3B0cy50cnVuY2F0ZWQgPyAncGFnZS10cnVuYycgOiAncGFnZSc7XG4gIHJldHVybiBgJHtzbHVnfS1uJHtufS0ke3N1ZmZpeH0tJHtzdGFtcH0ucG5nYDtcbn07XG5cbi8vIGRhdGFVUkwg4oaSIEJsb2Igd2l0aG91dCBnb2luZyB0aHJvdWdoIGZldGNoL2F0b2Igcm91bmR0cmlwcyB0aGF0IGJyb3dzZXJzXG4vLyBpbiBzZXJ2aWNlLXdvcmtlciBjb250ZXh0IHNvbWV0aW1lcyBiYWxrIGF0LiBQTkcgb25seS5cbmNvbnN0IGRhdGFVcmxUb0Jsb2IgPSBhc3luYyAoZGF0YVVybDogc3RyaW5nKTogUHJvbWlzZTxCbG9iPiA9PiB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChkYXRhVXJsKTtcbiAgcmV0dXJuIHIuYmxvYigpO1xufTtcblxuLy8gRGVjb2RlIGEgUE5HIGRhdGFVUkwgaW50byBhbiBJbWFnZUJpdG1hcCB1c2FibGUgYnkgT2Zmc2NyZWVuQ2FudmFzLiBXZVxuLy8gY2FuJ3QgYG5ldyBJbWFnZSgpYCBpbiBhIHNlcnZpY2Ugd29ya2VyIOKAlCBJbWFnZSBpcyBhIERPTS1vbmx5IGNvbnN0cnVjdG9yLlxuY29uc3QgZGF0YVVybFRvQml0bWFwID0gYXN5bmMgKGRhdGFVcmw6IHN0cmluZyk6IFByb21pc2U8SW1hZ2VCaXRtYXA+ID0+IHtcbiAgY29uc3QgYmxvYiA9IGF3YWl0IGRhdGFVcmxUb0Jsb2IoZGF0YVVybCk7XG4gIHJldHVybiBjcmVhdGVJbWFnZUJpdG1hcChibG9iKTtcbn07XG5cbi8vIEVuY29kZSBhbiBPZmZzY3JlZW5DYW52YXMgdG8gYSBQTkcgYmxvYi5cbmNvbnN0IGNhbnZhc1RvQmxvYiA9IGFzeW5jIChjYW52YXM6IE9mZnNjcmVlbkNhbnZhcyk6IFByb21pc2U8QmxvYj4gPT5cbiAgY2FudmFzLmNvbnZlcnRUb0Jsb2Ioe3R5cGU6ICdpbWFnZS9wbmcnfSk7XG5cbi8vIERvd25zY2FsZSBhIGJpdG1hcCBpbnRvIGEgUE5HIGRhdGFVUkwgd2l0aCBtYXggd2lkdGggY2FwcGVkLiBUaGUgdGh1bWJuYWlsXG4vLyBpcyB3aGF0IHRoZSBzaWRlIHBhbmVsIHBhaW50cyBpbnRvIHRoZSAucHJldmlldyB0aWxlIOKAlCB0aGUgb3JpZ2luYWwgbGl2ZXNcbi8vIG9ubHkgb24gZGlzay4gV2UgdXNlIEZpbGVSZWFkZXIgKHdvcmtzIGluIE1WMyBTV3MpIHNpbmNlIHRoZSBkYXRhVVJMIGlzXG4vLyBwYXNzZWQgYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIHdoZXJlIHNpemUgbWF0dGVycyBsZXNzLlxuY29uc3QgbWFrZVRodW1ibmFpbCA9IGFzeW5jIChiaXRtYXA6IEltYWdlQml0bWFwLCBtYXhXaWR0aCA9IDMyMCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IHJhdGlvID0gYml0bWFwLndpZHRoIDw9IG1heFdpZHRoID8gMSA6IG1heFdpZHRoIC8gYml0bWFwLndpZHRoO1xuICBjb25zdCB3ID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChiaXRtYXAud2lkdGggKiByYXRpbykpO1xuICBjb25zdCBoID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChiaXRtYXAuaGVpZ2h0ICogcmF0aW8pKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3LCBoKTtcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuICBjdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9ICdoaWdoJztcbiAgY3R4LmRyYXdJbWFnZShiaXRtYXAsIDAsIDAsIHcsIGgpO1xuICBjb25zdCBibG9iID0gYXdhaXQgY2FudmFzLmNvbnZlcnRUb0Jsb2Ioe3R5cGU6ICdpbWFnZS9wbmcnfSk7XG4gIC8vIGFycmF5QnVmZmVyICsgYnRvYSBhdm9pZHMgYW55IEZpbGVSZWFkZXItYXZhaWxhYmlsaXR5IGNvbmNlcm4uXG4gIGNvbnN0IGJ1ZiA9IGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWYpO1xuICBsZXQgYmluYXJ5ID0gJyc7XG4gIGNvbnN0IGNodW5rID0gMHg4MF8wMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gY2h1bmspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBBcnJheS5mcm9tKGJ5dGVzLnN1YmFycmF5KGksIGkgKyBjaHVuaykpKTtcbiAgfVxuICByZXR1cm4gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuLy8gUGVyLXRhYiBzZXJpYWxpemF0aW9uOiBhdCBtb3N0IG9uZSBjYXB0dXJlIGluIGZsaWdodCBhdCBhIHRpbWUuIFdpdGhvdXQgYVxuLy8gcXVldWUsIHRoZSB0aHJvdHRsaW5nIG9uIGNhcHR1cmVWaXNpYmxlVGFiICh+MiBjYWxscy9zZWMpIHNob3dzIHVwIGFzXG4vLyBtaXNzaW5nIHNjcmVlbnNob3RzIHdoZW4gdGhlIHVzZXIgZmlyZXMgc2V2ZXJhbCBjYXB0dXJlcyBiYWNrLXRvLWJhY2suXG50eXBlIFF1ZXVlVGFzayA9ICgpID0+IFByb21pc2U8dm9pZD47XG5jb25zdCB0YWJRdWV1ZXMgPSBuZXcgTWFwPG51bWJlciwgUHJvbWlzZTx2b2lkPj4oKTtcbmNvbnN0IGVucXVldWUgPSAodGFiSWQ6IG51bWJlciwgdGFzazogUXVldWVUYXNrKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IHByZXYgPSB0YWJRdWV1ZXMuZ2V0KHRhYklkKSA/PyBQcm9taXNlLnJlc29sdmUoKTtcbiAgY29uc3QgbmV4dCA9IHByZXYudGhlbigoKSA9PiB0YXNrKCkpLmNhdGNoKChlKSA9PiB7IGNvbnNvbGUud2FybihMT0csICdxdWV1ZSB0YXNrIGZhaWxlZCcsIGUpOyB9KTtcbiAgdGFiUXVldWVzLnNldCh0YWJJZCwgbmV4dCk7XG4gIHJldHVybiBuZXh0O1xufTtcblxuLy8gT25lLXNob3QgQ1Mgcm91bmQtdHJpcDogYXNrIHRoZSBjb250ZW50IHNjcmlwdCB0byBoaWRlIGl0cyBvdmVybGF5IHRoZW5cbi8vIHdhaXQgZm9yIGFjay4gV2UgdXNlIHNlbmRNZXNzYWdlIHdpdGggYSB0aW1lb3V0IHNvIGEgQ1MgdGhhdCdzIHN0dWNrIG9yXG4vLyBub3QgbG9hZGVkIGNhbid0IHdlZGdlIHRoZSBxdWV1ZS5cbmNvbnN0IHRlbGxDcyA9IGFzeW5jIDxUID0gdW5rbm93bj4odGFiSWQ6IG51bWJlciwgcGF5bG9hZDogYW55LCB0aW1lb3V0TXMgPSA2MDApOiBQcm9taXNlPFQgfCBudWxsPiA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxUIHwgbnVsbD4oKHJlc29sdmUpID0+IHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IGZpbmlzaCA9ICh2OiBUIHwgbnVsbCk6IHZvaWQgPT4geyBpZiAoIWRvbmUpIHsgZG9uZSA9IHRydWU7IHJlc29sdmUodik7IH0gfTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGZpbmlzaChudWxsKSwgdGltZW91dE1zKTtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIHBnKHBheWxvYWQpLCAocmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikgeyBmaW5pc2gobnVsbCk7IHJldHVybjsgfVxuICAgICAgICBmaW5pc2goKHJlcGx5ID8/IG51bGwpIGFzIFQgfCBudWxsKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggeyBmaW5pc2gobnVsbCk7IH1cbiAgfSk7XG59O1xuXG4vLyBSdW4gYSBmdW5jdGlvbiBpbnNpZGUgdGhlIHBhZ2UncyBtYWluIHdvcmxkIChvciBpc29sYXRlZCwgZG9lc24ndCBtYXR0ZXJcbi8vIGhlcmUgYmVjYXVzZSB3ZSBvbmx5IHJlYWQgbGF5b3V0IG51bWJlcnMpLiBhcmdzIGlzIHBhc3NlZCBwb3NpdGlvbmFsbHkuXG5jb25zdCBydW5JblBhZ2UgPSBhc3luYyA8VD4oXG4gIHRhYklkOiBudW1iZXIsXG4gIGZ1bmM6ICguLi5hcmdzOiBhbnlbXSkgPT4gVCxcbiAgYXJnczogYW55W10gPSBbXSxcbik6IFByb21pc2U8VCB8IG51bGw+ID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDoge3RhYklkfSxcbiAgICAgIGZ1bmM6IGZ1bmMgYXMgYW55LFxuICAgICAgYXJncyxcbiAgICB9KTtcbiAgICByZXR1cm4gKHJlc3VsdHM/LlswXT8ucmVzdWx0ID8/IG51bGwpIGFzIFQgfCBudWxsO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKExPRywgJ3J1bkluUGFnZScsIGUpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuXG4vLyBDb21wdXRlIHVuaW9uIGJib3ggb2Ygc2VsZWN0b3JzIElOU0lERSB0aGUgcGFnZSwgc2Nyb2xsIGl0IGludG8gdmlldywgYW5kXG4vLyByZXR1cm4gdGhlIGJib3ggKyBkcHIgZm9yIGNyb3BwaW5nLiBwYWRkaW5nIGlzIGFwcGxpZWQgc3ltbWV0cmljYWxseS5cbnR5cGUgQmJveFJlc3VsdCA9IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyOyB2dzogbnVtYmVyOyB2aDogbnVtYmVyfTtcbmNvbnN0IGNvbXB1dGVBbmRTY3JvbGwgPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHNlbGVjdG9yczogc3RyaW5nW10sXG4gIHBhZGRpbmc6IG51bWJlcixcbik6IFByb21pc2U8QmJveFJlc3VsdCB8IG51bGw+ID0+IHtcbiAgcmV0dXJuIHJ1bkluUGFnZTxCYm94UmVzdWx0IHwgbnVsbD4odGFiSWQsIChzZWxzOiBzdHJpbmdbXSwgcGFkOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBlbHMgPSBzZWxzLm1hcCgocykgPT4ge1xuICAgICAgdHJ5IHsgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iocyk7IH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxuICAgIH0pLmZpbHRlcigoZSk6IGUgaXMgRWxlbWVudCA9PiBCb29sZWFuKGUpKTtcbiAgICBpZiAoIWVscy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIC8vIFNjcm9sbCB1bmlvbiBtaWRwb2ludCBpbnRvIHZpZXcgZmlyc3Q7IHNvbWUgcGFnZXMgaGF2ZSBsYXp5IGltYWdlc1xuICAgIC8vIHRoYXQgd29uJ3QgcGFpbnQgdW50aWwgdGhleSdyZSBuZWFyIHRoZSB2aWV3cG9ydC5cbiAgICBjb25zdCByZWN0c0JlZm9yZSA9IGVscy5tYXAoKGUpID0+IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IG1pblhBYnMgPSBNYXRoLm1pbiguLi5yZWN0c0JlZm9yZS5tYXAoKHIpID0+IHIubGVmdCkpICsgd2luZG93LnNjcm9sbFg7XG4gICAgY29uc3QgbWluWUFicyA9IE1hdGgubWluKC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci50b3ApKSArIHdpbmRvdy5zY3JvbGxZO1xuICAgIGNvbnN0IG1heFhBYnMgPSBNYXRoLm1heCguLi5yZWN0c0JlZm9yZS5tYXAoKHIpID0+IHIucmlnaHQpKSArIHdpbmRvdy5zY3JvbGxYO1xuICAgIGNvbnN0IG1heFlBYnMgPSBNYXRoLm1heCguLi5yZWN0c0JlZm9yZS5tYXAoKHIpID0+IHIuYm90dG9tKSkgKyB3aW5kb3cuc2Nyb2xsWTtcbiAgICBjb25zdCBjeCA9IChtaW5YQWJzICsgbWF4WEFicykgLyAyO1xuICAgIGNvbnN0IGN5ID0gKG1pbllBYnMgKyBtYXhZQWJzKSAvIDI7XG4gICAgY29uc3QgdGFyZ2V0WCA9IE1hdGgubWF4KDAsIGN4IC0gd2luZG93LmlubmVyV2lkdGggLyAyKTtcbiAgICBjb25zdCB0YXJnZXRZID0gTWF0aC5tYXgoMCwgY3kgLSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oe2xlZnQ6IHRhcmdldFgsIHRvcDogdGFyZ2V0WSwgYmVoYXZpb3I6ICdpbnN0YW50JyBhcyBTY3JvbGxCZWhhdmlvcn0pO1xuXG4gICAgLy8gUmVjb21wdXRlIGJib3hlcyBhZnRlciBzY3JvbGwuXG4gICAgY29uc3QgcmVjdHMgPSBlbHMubWFwKChlKSA9PiBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBjb25zdCBtaW5YID0gTWF0aC5taW4oLi4ucmVjdHMubWFwKChyKSA9PiByLmxlZnQpKSAtIHBhZDtcbiAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oLi4ucmVjdHMubWFwKChyKSA9PiByLnRvcCkpIC0gcGFkO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoKHIpID0+IHIucmlnaHQpKSArIHBhZDtcbiAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4ucmVjdHMubWFwKChyKSA9PiByLmJvdHRvbSkpICsgcGFkO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBtaW5YLFxuICAgICAgeTogbWluWSxcbiAgICAgIHc6IG1heFggLSBtaW5YLFxuICAgICAgaDogbWF4WSAtIG1pblksXG4gICAgICBkcHI6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgICB2dzogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICB2aDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgIH07XG4gIH0sIFtzZWxlY3RvcnMsIHBhZGRpbmddKTtcbn07XG5cbi8vIE9uZS1mcmFtZSB5aWVsZCBpbnNpZGUgdGhlIHBhZ2Ugc28gYW55IHBvc3Qtc2Nyb2xsIGxheW91dCBzZXR0bGVzLiBXZSBwaW5cbi8vIHRvIHR3byByQUZzIHRvIGJlIGNvbnNlcnZhdGl2ZSDigJQgcGFnZXMgd2l0aCBzdGlja3kgaGVhZGVycyBzb21ldGltZXMgbmVlZFxuLy8gdGhlIHNlY29uZCBmcmFtZSB0byByZXBhaW50IHRoZSBoZWFkZXIgYXQgaXRzIG5ldyBvZmZzZXQuXG5jb25zdCB5aWVsZFJhZiA9IGFzeW5jICh0YWJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGF3YWl0IHJ1bkluUGFnZTx2b2lkPih0YWJJZCwgKCkgPT5cbiAgICBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVzb2x2ZSgpKSkpLFxuICApO1xufTtcblxuLy8gUmVzdG9yZSB0aGUgcGFnZSBzY3JvbGwgcG9zaXRpb24gYWZ0ZXIgc3RpdGNoaW5nLiBUaGUgb3JpZ2luYWwgcG9zaXRpb25zXG4vLyBhcmUgcGFzc2VkIGJhY2sgZnJvbSB0aGUgc3RpdGNoIGxvb3AuXG5jb25zdCByZXN0b3JlU2Nyb2xsID0gYXN5bmMgKHRhYklkOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGF3YWl0IHJ1bkluUGFnZTx2b2lkPih0YWJJZCwgKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpID0+IHtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oe2xlZnQ6IHN4LCB0b3A6IHN5LCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG4gIH0sIFt4LCB5XSk7XG59O1xuXG5jb25zdCBQQUdFX0NIVU5LX0xJTUlUID0gODtcbmNvbnN0IENBTlZBU19QSVhFTF9MSU1JVCA9IDE2Mzg0OyAvLyBPZmZzY3JlZW5DYW52YXMgc2FmZXR5IGNhcFxuXG4vLyBQYWdlIChmdWxsLWRvY3VtZW50KSBzaG90LiBMb29wcyBjYXB0dXJlVmlzaWJsZVRhYiB3aGlsZSBzY3JvbGxpbmcgYnlcbi8vIHZpZXdwb3J0LWhlaWdodCBjaHVua3M7IHN0b3BzIGF0IGNodW5rIGNvdW50LCBwaXhlbCBjYXAsIG9yIHNjcm9sbEhlaWdodC5cbmNvbnN0IHN0aXRjaFBhZ2UgPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4pOiBQcm9taXNlPHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbD4gPT4ge1xuICAvLyBTbmFwc2hvdCBzY3JvbGwgZ2VvbWV0cnkgdXAgZnJvbnQuXG4gIGNvbnN0IGdlb20gPSBhd2FpdCBydW5JblBhZ2U8e3Z3OiBudW1iZXI7IHZoOiBudW1iZXI7IHN3OiBudW1iZXI7IHNoOiBudW1iZXI7IGRwcjogbnVtYmVyOyBzeDogbnVtYmVyOyBzeTogbnVtYmVyfT4oXG4gICAgdGFiSWQsXG4gICAgKCkgPT4gKHtcbiAgICAgIHZ3OiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHZoOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICBzdzogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoLCBkb2N1bWVudC5ib2R5Py5zY3JvbGxXaWR0aCA/PyAwKSxcbiAgICAgIHNoOiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0LCBkb2N1bWVudC5ib2R5Py5zY3JvbGxIZWlnaHQgPz8gMCksXG4gICAgICBkcHI6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgICBzeDogd2luZG93LnNjcm9sbFgsXG4gICAgICBzeTogd2luZG93LnNjcm9sbFksXG4gICAgfSksXG4gICk7XG4gIGlmICghZ2VvbSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZHByID0gZ2VvbS5kcHI7XG4gIGNvbnN0IHRvdGFsSCA9IGdlb20uc2g7XG4gIGNvbnN0IHRvdGFsSHB4ID0gTWF0aC5yb3VuZCh0b3RhbEggKiBkcHIpO1xuICBjb25zdCB3aWR0aFB4ID0gTWF0aC5yb3VuZChnZW9tLnZ3ICogZHByKTtcblxuICAvLyBJZiB0aGUgcGFnZSBpcyBzaG9ydCBlbm91Z2ggdG8gZml0IGluIHRoZSB2aWV3cG9ydCwgc2luZ2xlIHNob3QuXG4gIGxldCBjaHVua3MgPSAwO1xuICBsZXQgeSA9IDA7XG4gIGxldCBzdGl0Y2hlZEhweCA9IDA7XG4gIGxldCB0cnVuY2F0ZWQgPSBmYWxzZTtcblxuICAvLyBBbGxvY2F0ZSB0aGUgY2FudmFzIGF0IHRoZSBjb25zZXJ2YXRpdmUgZmluYWwgc2l6ZTsgd2UnbGwgdHJpbSBsYXRlciBpZlxuICAvLyB3ZSBzdG9wIGVhcmx5LiB3aWR0aCBpcyBmaXhlZDsgaGVpZ2h0IGdyb3dzIHVwIHRvIG1pbih0b3RhbEhweCwgY2FwKS5cbiAgY29uc3QgdGFyZ2V0SHB4ID0gTWF0aC5taW4odG90YWxIcHgsIENBTlZBU19QSVhFTF9MSU1JVCk7XG4gIGNvbnN0IGNhbnZhcyA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGhQeCwgdGFyZ2V0SHB4KTtcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuXG4gIHdoaWxlICh5IDwgdG90YWxIKSB7XG4gICAgaWYgKGNodW5rcyA+PSBQQUdFX0NIVU5LX0xJTUlUKSB7IHRydW5jYXRlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgaWYgKHN0aXRjaGVkSHB4ID49IENBTlZBU19QSVhFTF9MSU1JVCkgeyB0cnVuY2F0ZWQgPSB0cnVlOyBicmVhazsgfVxuICAgIGF3YWl0IHJ1bkluUGFnZTx2b2lkPih0YWJJZCwgKHl5OiBudW1iZXIpID0+IHtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogMCwgdG9wOiB5eSwgYmVoYXZpb3I6ICdpbnN0YW50JyBhcyBTY3JvbGxCZWhhdmlvcn0pO1xuICAgIH0sIFt5XSk7XG4gICAgYXdhaXQgeWllbGRSYWYodGFiSWQpO1xuICAgIGxldCBkYXRhVXJsOiBzdHJpbmc7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGFVcmwgPSBhd2FpdCBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih3aW5kb3dJZCwge2Zvcm1hdDogJ3BuZyd9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnY2FwdHVyZVZpc2libGVUYWIgcGFnZSBjaHVuayBmYWlsZWQnLCBlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBibSA9IGF3YWl0IGRhdGFVcmxUb0JpdG1hcChkYXRhVXJsKTtcbiAgICAvLyBEZXRlcm1pbmUgaG93IG11Y2ggb2YgVEhJUyBjaHVuayB0byBkcmF3LiBUaGUgbGFzdCBjaHVuayB1c3VhbGx5XG4gICAgLy8gb3ZlcmxhcHMgdGhlIHByZXZpb3VzIG9uZSAoYmVjYXVzZSB0b3RhbEggaXMgbm90IGEgdmlld3BvcnQgbXVsdGlwbGUpO1xuICAgIC8vIGRyYXdpbmcgdGhlIGZ1bGwgYml0bWFwIHdvdWxkIGR1cGxpY2F0ZSBwaXhlbHMuIFNvIHdlIGNyb3AgYnkgdGhlXG4gICAgLy8gcmVtYWluZGVyIG9mIHRoZSBwYWdlIGhlaWdodCB3aGVuIG9uIHRoZSB0YWlsLlxuICAgIGNvbnN0IHJlbWFpbmluZ1B4ID0gTWF0aC5yb3VuZCgodG90YWxIIC0geSkgKiBkcHIpO1xuICAgIGNvbnN0IGRyYXdTcmNIID0gTWF0aC5taW4oYm0uaGVpZ2h0LCByZW1haW5pbmdQeCk7XG4gICAgY29uc3QgZHJhd0Rlc3RIID0gTWF0aC5taW4odGFyZ2V0SHB4IC0gc3RpdGNoZWRIcHgsIGRyYXdTcmNIKTtcbiAgICBpZiAoZHJhd0Rlc3RIIDw9IDApIHsgdHJ1bmNhdGVkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICBjdHguZHJhd0ltYWdlKGJtLCAwLCAwLCBibS53aWR0aCwgZHJhd0Rlc3RILCAwLCBzdGl0Y2hlZEhweCwgYm0ud2lkdGgsIGRyYXdEZXN0SCk7XG4gICAgc3RpdGNoZWRIcHggKz0gZHJhd0Rlc3RIO1xuICAgIGNodW5rcysrO1xuICAgIHkgKz0gZ2VvbS52aDtcbiAgICBibS5jbG9zZT8uKCk7XG4gIH1cblxuICAvLyBSZXN0b3JlIHNjcm9sbC5cbiAgYXdhaXQgcmVzdG9yZVNjcm9sbCh0YWJJZCwgZ2VvbS5zeCwgZ2VvbS5zeSk7XG5cbiAgLy8gVHJpbSBjYW52YXMgdG8gYWN0dWFsIHN0aXRjaGVkIGhlaWdodCBpZiB3ZSBzdG9wcGVkIGJlZm9yZSB0YXJnZXRIcHguXG4gIGxldCBvdXRDYW52YXMgPSBjYW52YXM7XG4gIGlmIChzdGl0Y2hlZEhweCA8IHRhcmdldEhweCkge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoUHgsIE1hdGgubWF4KDEsIHN0aXRjaGVkSHB4KSk7XG4gICAgY29uc3QgdGN0eCA9IHRyaW1tZWQuZ2V0Q29udGV4dCgnMmQnKSE7XG4gICAgdGN0eC5kcmF3SW1hZ2UoY2FudmFzLCAwLCAwKTtcbiAgICBvdXRDYW52YXMgPSB0cmltbWVkO1xuICB9XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXNUb0Jsb2Iob3V0Q2FudmFzKTtcbiAgY29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XG4gIHJldHVybiB7YmxvYiwgYml0bWFwLCB0cnVuY2F0ZWR9O1xufTtcblxuLy8gRWxlbWVudC9ncm91cCBzaG90OiBoaWRlIG92ZXJsYXlzLCBjYXB0dXJlIHZpZXdwb3J0LCBjcm9wIGluIGNhbnZhcy5cbmNvbnN0IHNob3RFbGVtZW50Q29tbW9uID0gYXN5bmMgKFxuICB0YWJJZDogbnVtYmVyLFxuICB3aW5kb3dJZDogbnVtYmVyLFxuICBzZWxlY3RvcnM6IHN0cmluZ1tdLFxuICBwYWRkaW5nOiBudW1iZXIsXG4pOiBQcm9taXNlPHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0YWJVcmw6IHN0cmluZzsgY3JvcE1ldGE6IFNob3RSZXBseVsnY3JvcCddfSB8IG51bGw+ID0+IHtcbiAgY29uc3QgdGFiID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHRhYklkKTtcbiAgY29uc3QgdGFiVXJsID0gdGFiPy51cmwgPz8gJyc7XG4gIGNvbnN0IGJib3ggPSBhd2FpdCBjb21wdXRlQW5kU2Nyb2xsKHRhYklkLCBzZWxlY3RvcnMsIHBhZGRpbmcpO1xuICBpZiAoIWJib3gpIHJldHVybiBudWxsO1xuICBhd2FpdCB5aWVsZFJhZih0YWJJZCk7XG5cbiAgLy8gSGlkZSBvdmVybGF5cyArIGFjay5cbiAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfSk7XG4gIGxldCBkYXRhVXJsOiBzdHJpbmc7XG4gIHRyeSB7XG4gICAgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfSk7XG4gICAgY29uc29sZS53YXJuKExPRywgJ2NhcHR1cmVWaXNpYmxlVGFiIGZhaWxlZCcsIGUpO1xuICAgIHJldHVybiBudWxsO1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHRlbGxDcyh0YWJJZCwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ30pO1xuICB9XG5cbiAgY29uc3QgYm0gPSBhd2FpdCBkYXRhVXJsVG9CaXRtYXAoZGF0YVVybCk7XG4gIC8vIENvbnZlcnQgQ1NTLXBpeGVsIGJib3gg4oaSIGRldmljZS1waXhlbCBiYm94OyBjbGFtcCB0byBiaXRtYXAgYm91bmRzIHNvXG4gIC8vIGEgcGFydGlhbGx5IG9mZi1zY3JlZW4gZWxlbWVudCBkb2Vzbid0IGNyYXNoIGRyYXdJbWFnZS5cbiAgY29uc3Qgc3ggPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGJib3gueCAqIGJib3guZHByKSk7XG4gIGNvbnN0IHN5ID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChiYm94LnkgKiBiYm94LmRwcikpO1xuICBjb25zdCBzdyA9IE1hdGgubWF4KDEsIE1hdGgubWluKGJtLndpZHRoIC0gc3gsIE1hdGgucm91bmQoYmJveC53ICogYmJveC5kcHIpKSk7XG4gIGNvbnN0IHNoID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oYm0uaGVpZ2h0IC0gc3ksIE1hdGgucm91bmQoYmJveC5oICogYmJveC5kcHIpKSk7XG4gIGNvbnN0IGNhbnZhcyA9IG5ldyBPZmZzY3JlZW5DYW52YXMoc3csIHNoKTtcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuICBjdHguZHJhd0ltYWdlKGJtLCBzeCwgc3ksIHN3LCBzaCwgMCwgMCwgc3csIHNoKTtcbiAgYm0uY2xvc2U/LigpO1xuICBjb25zdCBibG9iID0gYXdhaXQgY2FudmFzVG9CbG9iKGNhbnZhcyk7XG4gIGNvbnN0IGJpdG1hcCA9IGF3YWl0IGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xuICAvLyBCdWcgIzMgZnJvbSB0aGUgZXhwb3J0IHJvYXN0OiBzdXJmYWNlIGNyb3AgbWV0YWRhdGEgc28gcmVjZWl2ZXJzXG4gIC8vIGNhbiBtYXAgYmV0d2VlbiB0aGUgc3RvcmVkIFBORyBhbmQgdGhlIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMuXG4gIC8vIGNzc1JlY3QgPSBwcmUtRFBSIENTUyBwaXhlbCByZWN0IG9mIHRoZSBjYXB0dXJlZCByZWdpb24uXG4gIC8vIGRldmljZVB4UmVjdCA9IHBvc3QtRFBSIHBpeGVsIHJlY3QgaW5zaWRlIHRoZSBzb3VyY2UgYml0bWFwLlxuICAvLyBpbWFnZVNpemUgPSBkaW1lbnNpb25zIG9mIHRoZSBwcm9kdWNlZCBQTkcuXG4gIC8vIGRwciA9IHRoZSBjb252ZXJzaW9uIGZhY3Rvci5cbiAgY29uc3QgY3JvcE1ldGE6IFNob3RSZXBseVsnY3JvcCddID0ge1xuICAgIGNzc1JlY3Q6IHt4OiBiYm94LngsIHk6IGJib3gueSwgdzogYmJveC53LCBoOiBiYm94Lmh9LFxuICAgIGRldmljZVB4UmVjdDoge3g6IHN4LCB5OiBzeSwgdzogc3csIGg6IHNofSxcbiAgICBpbWFnZVNpemU6IHt3OiBzdywgaDogc2h9LFxuICAgIGRwcjogYmJveC5kcHIsXG4gICAgcGFkZGluZyxcbiAgICBzZWxlY3RvcnMsXG4gIH07XG4gIHJldHVybiB7YmxvYiwgYml0bWFwLCB0YWJVcmwsIGNyb3BNZXRhfTtcbn07XG5cbi8vIFBhZ2Utb25seSBwYXRoLiBIaWRlcyBvdmVybGF5cywgc3RpdGNoZXMsIHJlc3RvcmVzLlxuY29uc3Qgc2hvdFBhZ2VDb21tb24gPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4pOiBQcm9taXNlPHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0YWJVcmw6IHN0cmluZzsgdHJ1bmNhdGVkOiBib29sZWFufSB8IG51bGw+ID0+IHtcbiAgY29uc3QgdGFiID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHRhYklkKTtcbiAgY29uc3QgdGFiVXJsID0gdGFiPy51cmwgPz8gJyc7XG4gIGF3YWl0IHRlbGxDcyh0YWJJZCwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ30pO1xuICBsZXQgc3RpdGNoZWQ6IHtibG9iOiBCbG9iOyBiaXRtYXA6IEltYWdlQml0bWFwOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbCA9IG51bGw7XG4gIHRyeSB7XG4gICAgc3RpdGNoZWQgPSBhd2FpdCBzdGl0Y2hQYWdlKHRhYklkLCB3aW5kb3dJZCk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfSk7XG4gIH1cbiAgaWYgKCFzdGl0Y2hlZCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7Li4uc3RpdGNoZWQsIHRhYlVybH07XG59O1xuXG4vLyBTYXZlIHRoZSBibG9iIGFzIGEgZG93bmxvYWQgdW5kZXIgLnBpbmNoZ3JhYi88d29ya3NwYWNlPi88c3ViZGlyPi8uXG4vL1xuLy8gTVYzIHNlcnZpY2Ugd29ya2VycyBETyBOT1QgaGF2ZSBVUkwuY3JlYXRlT2JqZWN0VVJMIOKAlCBjYWxsaW5nIGl0IHRocm93c1xuLy8gXCJVUkwuY3JlYXRlT2JqZWN0VVJMIGlzIG5vdCBhIGZ1bmN0aW9uXCIgKHZlcmlmaWVkIGxpdmUgaW4gZXh0ZW5zaW9uLnNwZWMpLlxuLy8gV2UgYmFzZTY0LWVuY29kZSB0aGUgYmxvYiBpbnRvIGEgZGF0YSBVUkwgaW5zdGVhZC4gVHJhZGVvZmY6IHRoZSBkYXRhXG4vLyBVUkwgaXMgfjMzJSBsYXJnZXIgdGhhbiByYXcgYnl0ZXMsIGFuZCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGhhcyBhXG4vLyBkYXRhLVVSTCBzaXplIGxpbWl0IHNvbWV3aGVyZSBhcm91bmQgMzIgTUI7IGZvciB0eXBpY2FsIHdvcmtzcGFjZVxuLy8gZXhwb3J0cyAoc3ViLU1CIEpTT05MICsgbG93LU1CIFpJUHMpIHRoaXMgaXMgd2VsbCB1bmRlciB0aGUgbGltaXQuXG50eXBlIFNhdmVkRmlsZSA9IHtcbiAgcmVsUGF0aDogc3RyaW5nO1xuICBhYnNQYXRoOiBzdHJpbmc7XG4gIGNvcHlQYXRoOiBzdHJpbmc7XG4gIHRlbXBQYXRoOiBib29sZWFuO1xuICBkb3dubG9hZFN0YXRlPzogY2hyb21lLmRvd25sb2Fkcy5Eb3dubG9hZEl0ZW1bJ3N0YXRlJ107XG59O1xuXG5jb25zdCBpc1BsYXl3cmlnaHRBcnRpZmFjdFBhdGggPSAocGF0aDogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAvKD86XnxbXFxcXC9dKSg/OnBsYXl3cmlnaHQtYXJ0aWZhY3RzfHBpbmNoZ3JhYi1kbCktW15cXFxcL10rW1xcXFwvXVswLTlhLWYtXXs4fS1bMC05YS1mLV17NH0tWzAtOWEtZi1dezR9LVswLTlhLWYtXXs0fS1bMC05YS1mLV17MTJ9JC9pLnRlc3QocGF0aCk7XG5cbmNvbnN0IGJsb2JUb0RhdGFVcmwgPSBhc3luYyAoYmxvYjogQmxvYik6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IGJ1ZiA9IGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAvLyBCdWlsZCBiYXNlNjQgaW4gMzIgS2lCIGNodW5rcyBzbyBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5IGRvZXNuJ3RcbiAgLy8gb3ZlcmZsb3cgdGhlIGNhbGwgc3RhY2sgb24gbGFyZ2UgaW5wdXRzLlxuICBsZXQgYmluYXJ5ID0gJyc7XG4gIGNvbnN0IGNodW5rID0gMHg4MF8wMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gY2h1bmspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBBcnJheS5mcm9tKGJ5dGVzLnN1YmFycmF5KGksIGkgKyBjaHVuaykpKTtcbiAgfVxuICBjb25zdCBtaW1lID0gYmxvYi50eXBlIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICByZXR1cm4gYGRhdGE6JHttaW1lfTtiYXNlNjQsJHtidG9hKGJpbmFyeSl9YDtcbn07XG5cbmNvbnN0IHNhdmVEb3dubG9hZCA9IGFzeW5jIChcbiAgYmxvYjogQmxvYixcbiAgd29ya3NwYWNlOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdzY3JlZW5zaG90cycsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCByZWxQYXRoID0gc3ViZGlyID8gYCR7c3ViZGlyfS8ke2ZpbGVuYW1lfWAgOiBmaWxlbmFtZTtcbiAgY29uc3QgZnVsbFBhdGggPSBgcGluY2hncmFiLyR7d29ya3NwYWNlfS8ke3JlbFBhdGh9YDtcbiAgY29uc29sZS5sb2coTE9HLCAnc2F2ZURvd25sb2FkIHN0YXJ0Jywge2Z1bGxQYXRoLCBtaW1lOiBibG9iLnR5cGUsIHNpemU6IGJsb2Iuc2l6ZX0pO1xuICBjb25zdCB1cmwgPSBhd2FpdCBibG9iVG9EYXRhVXJsKGJsb2IpO1xuICBjb25zdCBkb3dubG9hZElkID0gYXdhaXQgbmV3IFByb21pc2U8bnVtYmVyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZChcbiAgICAgIHt1cmwsIGZpbGVuYW1lOiBmdWxsUGF0aCwgY29uZmxpY3RBY3Rpb246ICdvdmVyd3JpdGUnfSxcbiAgICAgIChpZCkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihMT0csICdjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGxhc3RFcnJvcjonLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPz8gJ2Rvd25sb2FkIGZhaWxlZCcpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgcmV0dXJuZWQgbm8gaWQnKTtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdkb3dubG9hZCByZXR1cm5lZCBubyBpZCcpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShpZCk7XG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuICBjb25zb2xlLmxvZyhMT0csICdjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGFjY2VwdGVkJywge2lkOiBkb3dubG9hZElkLCBmdWxsUGF0aH0pO1xuICAvLyBSZXNvbHZlIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIGFuZCBkbyBub3QgcmVwb3J0IHN1Y2Nlc3MgdW50aWwgQ2hyb21lIHNheXNcbiAgLy8gdGhlIGRvd25sb2FkIGNvbXBsZXRlZC4gYGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWRgIG9ubHkgbWVhbnMgXCJhY2NlcHRlZFwiO1xuICAvLyBkaXNrLWZ1bGwsIHBlcm1pc3Npb24sIG9yIGludGVycnVwdGVkIHdyaXRlcyBzdXJmYWNlIGxhdGVyIHRocm91Z2hcbiAgLy8gZG93bmxvYWRzLnNlYXJjaC5cbiAgbGV0IGFic1BhdGggPSBgJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gO1xuICBsZXQgZG93bmxvYWRTdGF0ZTogY2hyb21lLmRvd25sb2Fkcy5Eb3dubG9hZEl0ZW1bJ3N0YXRlJ10gfCB1bmRlZmluZWQ7XG4gIGxldCBpbnRlcnJ1cHRlZEVycm9yID0gJyc7XG4gIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgMTAwOyBhdHRlbXB0KyspIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBjaHJvbWUuZG93bmxvYWRzLnNlYXJjaCh7aWQ6IGRvd25sb2FkSWR9KTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtcz8uWzBdO1xuICAgICAgaWYgKGl0ZW0/LmZpbGVuYW1lKSBhYnNQYXRoID0gaXRlbS5maWxlbmFtZTtcbiAgICAgIGRvd25sb2FkU3RhdGUgPSBpdGVtPy5zdGF0ZTtcbiAgICAgIGlmIChpdGVtPy5zdGF0ZSA9PT0gJ2ludGVycnVwdGVkJykge1xuICAgICAgICBpbnRlcnJ1cHRlZEVycm9yID0gYGRvd25sb2FkIGludGVycnVwdGVkJHtpdGVtLmVycm9yID8gYDogJHtpdGVtLmVycm9yfWAgOiAnJ31gO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtPy5zdGF0ZSA9PT0gJ2NvbXBsZXRlJyAmJiBpdGVtLmZpbGVuYW1lKSBicmVhaztcbiAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMuc2VhcmNoIHRocmV3OicsIGUpOyB9XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMTAwKSk7XG4gIH1cbiAgaWYgKGludGVycnVwdGVkRXJyb3IpIHRocm93IG5ldyBFcnJvcihpbnRlcnJ1cHRlZEVycm9yKTtcbiAgaWYgKGRvd25sb2FkU3RhdGUgIT09ICdjb21wbGV0ZScpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGRvd25sb2FkIGRpZCBub3QgY29tcGxldGUke2Rvd25sb2FkU3RhdGUgPyBgIChzdGF0ZTogJHtkb3dubG9hZFN0YXRlfSlgIDogJyd9YCk7XG4gIH1cbiAgY29uc3QgdGVtcFBhdGggPSBpc1BsYXl3cmlnaHRBcnRpZmFjdFBhdGgoYWJzUGF0aCk7XG4gIC8vIFBsYXl3cmlnaHQgcmV3cml0ZXMgQ2hyb21lIGRvd25sb2FkcyB0byBleHRlbnNpb25sZXNzIFVVSUQgZmlsZXMgdW5kZXJcbiAgLy8gL3RtcC9wbGF5d3JpZ2h0LWFydGlmYWN0cy0qOyBjb3B5aW5nIHRoYXQgdG8gdGhlIHVzZXIgaXMgY29uZnVzaW5nIGFuZFxuICAvLyBvZnRlbiBzdGFsZS4gS2VlcCBpdCBpbiBhYnNQYXRoIGZvciB0ZXN0cy9kZWJ1Z2dpbmcsIGJ1dCBleHBvc2UgdGhlXG4gIC8vIGludGVuZGVkIGJyb3dzZXIgZG93bmxvYWQgdGFyZ2V0IGZvciB0aGUgc2lkZSBwYW5lbCdzIGNsaXBib2FyZCBhY3Rpb24uXG4gIGNvbnN0IGNvcHlQYXRoID0gdGVtcFBhdGggPyBgfi9Eb3dubG9hZHMvJHtmdWxsUGF0aH1gIDogYWJzUGF0aDtcbiAgY29uc29sZS5sb2coTE9HLCAnc2F2ZURvd25sb2FkIHJldHVybmluZycsIHtyZWxQYXRoLCBhYnNQYXRoLCBjb3B5UGF0aCwgdGVtcFBhdGgsIGRvd25sb2FkU3RhdGV9KTtcbiAgcmV0dXJuIHtyZWxQYXRoOiBgJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gLCBhYnNQYXRoLCBjb3B5UGF0aCwgdGVtcFBhdGgsIGRvd25sb2FkU3RhdGV9O1xufTtcblxuY29uc3Qgc2F2ZVRleHREb3dubG9hZCA9IGFzeW5jIChcbiAgdGV4dDogc3RyaW5nLFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgbWltZTogc3RyaW5nLFxuICBzdWJkaXIgPSAnZXhwb3J0cycsXG4pOiBQcm9taXNlPFNhdmVkRmlsZT4gPT4ge1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICByZXR1cm4gc2F2ZURvd25sb2FkKGJsb2IsIHdvcmtzcGFjZSwgZmlsZW5hbWUsIHN1YmRpcik7XG59O1xuXG5jb25zdCBzYXZlQnl0ZXNEb3dubG9hZCA9IGFzeW5jIChcbiAgYnl0ZXM6IFVpbnQ4QXJyYXksXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBtaW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdleHBvcnRzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYnl0ZXMgYXMgdW5rbm93biBhcyBCbG9iUGFydF0sIHt0eXBlOiBtaW1lfSk7XG4gIHJldHVybiBzYXZlRG93bmxvYWQoYmxvYiwgd29ya3NwYWNlLCBmaWxlbmFtZSwgc3ViZGlyKTtcbn07XG5cbi8vIOKUgOKUgOKUgCBTZXJ2aWNlIHJlcXVlc3RzICsgcmVsYXkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZzogUGdFbnZlbG9wZTxBbnlNZXNzYWdlPiB8IGFueSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKCFtc2cgfHwgbXNnLl9fcGcgIT09IHRydWUpIHJldHVybiBmYWxzZTtcblxuICBpZiAobXNnLmtpbmQgPT09ICdjYXB0dXJlLXNjcmVlbnNob3QnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IG1zZy50YWJJZCA/IFthd2FpdCBjaHJvbWUudGFicy5nZXQobXNnLnRhYklkKV1cbiAgICAgICAgICA6IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgY29uc3QgdGFiID0gdGFic1swXTtcbiAgICAgICAgaWYgKCF0YWI/LndpbmRvd0lkKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6ICdubyBhY3RpdmUgdGFiJ30pOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHRhYi53aW5kb3dJZCwge2Zvcm1hdDogJ3BuZyd9KTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtkYXRhVXJsfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZy5raW5kID09PSAnc3dpdGNoLXRvLXRhYicpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe3VybDogbXNnLnVybH0pO1xuICAgICAgICBpZiAodGFicy5sZW5ndGggJiYgdGFic1swXT8uaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGF3YWl0IGNocm9tZS50YWJzLnVwZGF0ZSh0YWJzWzBdLmlkLCB7YWN0aXZlOiB0cnVlfSk7XG4gICAgICAgICAgaWYgKHRhYnNbMF0ud2luZG93SWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLndpbmRvd3MudXBkYXRlKHRhYnNbMF0ud2luZG93SWQsIHtmb2N1c2VkOiB0cnVlfSk7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtmb3VuZDogdHJ1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5vcGVuSWZNaXNzaW5nKSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsOiBtc2cudXJsLCBhY3RpdmU6IHRydWV9KTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiBmYWxzZSwgb3BlbmVkOiB0LmlkfSk7XG4gICAgICAgIH0gZWxzZSBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiBmYWxzZX0pO1xuICAgICAgfSBjYXRjaCAoZSkgeyBzZW5kUmVzcG9uc2Uoe2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7IH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2cua2luZCA9PT0gJ2xpc3Qtb3Blbi10YWJzJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7dGFiczogdGFicy5maWx0ZXIoKHQpID0+IHQudXJsKS5tYXAoKHQpID0+ICh7aWQ6IHQuaWQsIHVybDogdC51cmwsIHRpdGxlOiB0LnRpdGxlfSkpfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHRhYnM6IFtdfSk7IH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKG1zZy5raW5kID09PSAnc2hvdC1lbGVtZW50JyB8fCBtc2cua2luZCA9PT0gJ3Nob3QtZ3JvdXAnIHx8IG1zZy5raW5kID09PSAnc2hvdC1wYWdlJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYklkID0gbXNnLnRhYklkID8/IHNlbmRlci50YWI/LmlkO1xuICAgICAgICBsZXQgcmVzb2x2ZWRUYWJJZCA9IHRhYklkO1xuICAgICAgICBsZXQgd2luZG93SWQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgICAgcmVzb2x2ZWRUYWJJZCA9IHRhYnNbMF0/LmlkO1xuICAgICAgICAgIHdpbmRvd0lkID0gdGFic1swXT8ud2luZG93SWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdCA9IGF3YWl0IGNocm9tZS50YWJzLmdldChyZXNvbHZlZFRhYklkKTtcbiAgICAgICAgICB3aW5kb3dJZCA9IHQ/LndpbmRvd0lkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNvbHZlZFRhYklkID09IG51bGwgfHwgd2luZG93SWQgPT0gbnVsbCkge1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSBzYXRpc2ZpZXMgU2hvdFJlcGx5KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFiSWRGaW5hbCA9IHJlc29sdmVkVGFiSWQ7XG4gICAgICAgIGNvbnN0IHdpbmRvd0lkRmluYWwgPSB3aW5kb3dJZDtcbiAgICAgICAgYXdhaXQgZW5xdWV1ZSh0YWJJZEZpbmFsLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgcnVuU2hvdChtc2csIHRhYklkRmluYWwsIHdpbmRvd0lkRmluYWwpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHJlcGx5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IHNhdGlzZmllcyBTaG90UmVwbHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gc2F0aXNmaWVzIFNob3RSZXBseSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChtc2cua2luZCA9PT0gJ3NhdmUtdGV4dCcgfHwgbXNnLmtpbmQgPT09ICdzYXZlLWJ5dGVzJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBzdG9yZWQ6IFNhdmVkRmlsZTtcbiAgICAgICAgY29uc3Qgd29ya3NwYWNlID0gU3RyaW5nKG1zZy53b3Jrc3BhY2UgPz8gJ2RlZmF1bHQnKTtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBTdHJpbmcobXNnLmZpbGVuYW1lID8/ICdleHBvcnQuYmluJyk7XG4gICAgICAgIGNvbnN0IG1pbWUgPSBTdHJpbmcobXNnLm1pbWUgPz8gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpO1xuICAgICAgICBjb25zdCBzdWJkaXIgPSBTdHJpbmcobXNnLnN1YmRpciA/PyAnZXhwb3J0cycpO1xuICAgICAgICBpZiAobXNnLmtpbmQgPT09ICdzYXZlLXRleHQnKSB7XG4gICAgICAgICAgc3RvcmVkID0gYXdhaXQgc2F2ZVRleHREb3dubG9hZChTdHJpbmcobXNnLnRleHQgPz8gJycpLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBtaW1lLCBzdWJkaXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERlZmVuc2l2ZSBkZWNvZGU6IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGNhbiBkZWxpdmVyIGJ5dGVzXG4gICAgICAgICAgLy8gYXMgYSBVaW50OEFycmF5LCBhIG51bWJlcltdLCBvciBhIGdlbmVyaWMgaW5kZXhlZCBvYmplY3RcbiAgICAgICAgICAvLyAoZGVwZW5kaW5nIG9uIENocm9tZSB2ZXJzaW9uICsgY2FsbGVyKS4gQWNjZXB0IGFsbCBzaGFwZXMuXG4gICAgICAgICAgY29uc3QgcmF3OiBhbnkgPSBtc2cuYnl0ZXM7XG4gICAgICAgICAgbGV0IGJ5dGVzOiBVaW50OEFycmF5O1xuICAgICAgICAgIGlmIChyYXcgaW5zdGFuY2VvZiBVaW50OEFycmF5KSBieXRlcyA9IHJhdztcbiAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJhdykpIGJ5dGVzID0gVWludDhBcnJheS5mcm9tKHJhdyk7XG4gICAgICAgICAgZWxzZSBpZiAocmF3ICYmIHR5cGVvZiByYXcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyhyYXcpIGFzIG51bWJlcltdO1xuICAgICAgICAgICAgYnl0ZXMgPSBVaW50OEFycmF5LmZyb20odmFscyk7XG4gICAgICAgICAgfSBlbHNlIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlLWJ5dGVzIGRlY29kZWQnLCB7Ynl0ZXM6IGJ5dGVzLmxlbmd0aCwgcmF3VHlwZTogdHlwZW9mIHJhdywgaXNBcnJheTogQXJyYXkuaXNBcnJheShyYXcpLCBpc1U4OiByYXcgaW5zdGFuY2VvZiBVaW50OEFycmF5fSk7XG4gICAgICAgICAgc3RvcmVkID0gYXdhaXQgc2F2ZUJ5dGVzRG93bmxvYWQoYnl0ZXMsIHdvcmtzcGFjZSwgZmlsZW5hbWUsIG1pbWUsIHN1YmRpcik7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgICAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBBdXRvLW9wZW4gdGhlIHNpZGUgcGFuZWwgb24gZmlyc3QgY2FwdHVyZS9zdGFnaW5nLiBDaHJvbWUgMTE2KyBwcm9wYWdhdGVzXG4gIC8vIHRoZSB1c2VyIGFjdGl2YXRpb24gdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBzbyB0aGlzIGRvZXNuJ3RcbiAgLy8gdGhyb3cg4oCUIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgY2FwdHVyZSBpbiB0aGUgY29udGVudCBzY3JpcHQgaXNcbiAgLy8gc3RpbGwgY29uc2lkZXJlZCBcImxpdmVcIiBoZXJlIGluIHRoZSB3b3JrZXIuXG4gIGlmICgobXNnLmtpbmQgPT09ICdjYXB0dXJlJyB8fCBtc2cua2luZCA9PT0gJ3BlbmRpbmctYWRkJykgJiYgc2VuZGVyLnRhYj8uaWQgIT0gbnVsbCkge1xuICAgIGNocm9tZS5zaWRlUGFuZWwub3Blbih7dGFiSWQ6IHNlbmRlci50YWIuaWR9KS5jYXRjaCgoKSA9PiB7IC8qIGFscmVhZHkgb3BlbiAqLyB9KTtcbiAgfVxuXG4gIC8vIE5vIHBvcnQgcmVsYXk6IHRoZSBzaWRlIHBhbmVsIGxpc3RlbnMgZGlyZWN0bHkgb24gY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLFxuICAvLyB3aGljaCBhbHJlYWR5IHJlY2VpdmVzIGJyb2FkY2FzdHMgZnJvbSBjb250ZW50IHNjcmlwdHMuIFJlbGF5aW5nIHRocm91Z2hcbiAgLy8gYSBwb3J0IGNhdXNlcyBldmVyeSBtZXNzYWdlIHRvIGJlIGRlbGl2ZXJlZCB0d2ljZSDigJQgdGhhdCBzdXJmYWNlZCBhc1xuICAvLyBkdXBsaWNhdGVkIG11bHRpLXNlbGVjdCBlbnRyaWVzIGluIHByb2R1Y3Rpb24uXG4gIHJldHVybiBmYWxzZTtcbn0pO1xuXG4vLyBFbmNvZGUgYSBQTkcgYmxvYiBpbnRvIGEgYmFzZTY0IGRhdGEgVVJMIHVzaW5nIHRoZSBzYW1lIGNodW5rZWQtYnRvYVxuLy8gcGF0aCBzYXZlRG93bmxvYWQgdXNlcy4gVGhlIHJlc3VsdCBpcyB0d28gcHVycG9zZXMtaW4tb25lOiB0aGVcbi8vIGRvd25zY2FsZWQgdGh1bWJuYWlsIGdvZXMgYmFjayB0byB0aGUgc2lkZSBwYW5lbCdzIHByZXZpZXcgdGlsZSAoc21hbGwsXG4vLyB+NS0xNSBLQiksIHdoaWxlIHRoZSBGVUxMIHBuZyBhbHNvIHJpZGVzIGJhY2sgc28gdGhlIHBhbmVsIGNhbiBzdGFzaCBpdFxuLy8gaW4gYHNob3RzRnVsbGAgYW5kIGJ1bmRsZSBpdCBpbnRvIHRoZSB3b3Jrc3BhY2UgLnRhci56c3QgZXhwb3J0IGxhdGVyLlxuY29uc3QgYmxvYlRvRnVsbERhdGFVcmwgPSBhc3luYyAoYmxvYjogQmxvYik6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IGJ1ZiA9IGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWYpO1xuICBsZXQgYmluYXJ5ID0gJyc7XG4gIGNvbnN0IGNodW5rID0gMHg4MF8wMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gY2h1bmspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBBcnJheS5mcm9tKGJ5dGVzLnN1YmFycmF5KGksIGkgKyBjaHVuaykpKTtcbiAgfVxuICByZXR1cm4gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuY29uc3QgcnVuU2hvdCA9IGFzeW5jIChtc2c6IGFueSwgdGFiSWQ6IG51bWJlciwgd2luZG93SWQ6IG51bWJlcik6IFByb21pc2U8U2hvdFJlcGx5PiA9PiB7XG4gIGNvbnN0IHRzID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICBjb25zdCBwYWRkaW5nID0gdHlwZW9mIG1zZy5wYWRkaW5nID09PSAnbnVtYmVyJyA/IG1zZy5wYWRkaW5nIDogMjQ7XG4gIGlmIChtc2cua2luZCA9PT0gJ3Nob3QtZWxlbWVudCcpIHtcbiAgICBjb25zdCBnb3QgPSBhd2FpdCBzaG90RWxlbWVudENvbW1vbih0YWJJZCwgd2luZG93SWQsIFttc2cuc2VsZWN0b3JdLCBwYWRkaW5nKTtcbiAgICBpZiAoIWdvdCkgcmV0dXJuIHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ2VsZW1lbnQnLCB0cywgbXNnLm4sIGdvdC50YWJVcmwpO1xuICAgIGNvbnN0IHN0b3JlZCA9IGF3YWl0IHNhdmVEb3dubG9hZChnb3QuYmxvYiwgbXNnLndvcmtzcGFjZSwgZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICAgIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgZGF0YVVybCwgZnVsbERhdGFVcmwsXG4gICAgICBjcm9wOiBnb3QuY3JvcE1ldGEsXG4gICAgfTtcbiAgfVxuICBpZiAobXNnLmtpbmQgPT09ICdzaG90LWdyb3VwJykge1xuICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RFbGVtZW50Q29tbW9uKHRhYklkLCB3aW5kb3dJZCwgbXNnLnNlbGVjdG9ycywgcGFkZGluZyk7XG4gICAgaWYgKCFnb3QpIHJldHVybiB7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ307XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEZpbGVuYW1lKCdncm91cCcsIHRzLCBtc2cubiwgZ290LnRhYlVybCwge2NvdW50OiBtc2cuc2VsZWN0b3JzLmxlbmd0aH0pO1xuICAgIGNvbnN0IHN0b3JlZCA9IGF3YWl0IHNhdmVEb3dubG9hZChnb3QuYmxvYiwgbXNnLndvcmtzcGFjZSwgZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICAgIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgZGF0YVVybCwgZnVsbERhdGFVcmwsXG4gICAgICBjcm9wOiBnb3QuY3JvcE1ldGEsXG4gICAgfTtcbiAgfVxuICAvLyBwYWdlXG4gIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RQYWdlQ29tbW9uKHRhYklkLCB3aW5kb3dJZCk7XG4gIGlmICghZ290KSByZXR1cm4ge29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9O1xuICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ3BhZ2UnLCB0cywgbXNnLm4sIGdvdC50YWJVcmwsIHt0cnVuY2F0ZWQ6IGdvdC50cnVuY2F0ZWR9KTtcbiAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICBjb25zdCBmdWxsRGF0YVVybCA9IGF3YWl0IGJsb2JUb0Z1bGxEYXRhVXJsKGdvdC5ibG9iKTtcbiAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gIHJldHVybiB7XG4gICAgb2s6IHRydWUsIGZpbGVuYW1lOiBzdG9yZWQucmVsUGF0aCwgYWJzUGF0aDogc3RvcmVkLmFic1BhdGgsXG4gICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgZGF0YVVybCwgZnVsbERhdGFVcmwsIHRydW5jYXRlZDogZ290LnRydW5jYXRlZCxcbiAgfTtcbn07XG5cbi8vIChzYXZlLXRleHQgLyBzYXZlLWJ5dGVzIGFyZSBmb2xkZWQgaW50byB0aGUgc2luZ2xlIGxpc3RlbmVyIGFib3ZlLilc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
