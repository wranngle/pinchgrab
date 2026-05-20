(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
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

//# debugId=2409E6C3F929BAF364756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjXFx0eXBlcy50cyIsICJzcmNcXGJhY2tncm91bmQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gUGluY2hHcmFiIOKAlCBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyIChNVjMpXG4vL1xuLy8g4oCiIE9wZW4gdGhlIHNpZGUgcGFuZWwgb24gYWN0aW9uIGNsaWNrXG4vLyDigKIgSW5qZWN0IHRoZSBjb250ZW50IHNjcmlwdCBpbnRvIGFscmVhZHktb3BlbiB0YWJzIChubyByZWZyZXNoIG5lZWRlZClcbi8vIOKAoiBSaWdodC1jbGljayBcIlBpbmNoR3JhYiBjYXB0dXJlXCIgY29udGV4dCBtZW51XG4vLyDigKIgQ2FwdHVyZSB2aXNpYmxlLXRhYiBzY3JlZW5zaG90cyBvbiBzaWRlLXBhbmVsIHJlcXVlc3Rcbi8vIOKAoiBBdXRvLW9wZW4gdGhlIHNpZGUgcGFuZWwgb24gZmlyc3QgY2FwdHVyZSAodXNlcyBDaHJvbWUgMTE2KyB1c2VyLWdlc3R1cmVcbi8vICAgcHJvcGFnYXRpb24gdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSlcbi8vIOKAoiBSZWxheSBjb250ZW50LXNjcmlwdCBtZXNzYWdlcyB0byBzaWRlLXBhbmVsIHBvcnRzXG4vLyDigKIgU2NyZWVuc2hvdCB3b3JrZXI6IHNob3QtZWxlbWVudCAvIHNob3QtZ3JvdXAgLyBzaG90LXBhZ2Uga2luZHMuIEVhY2hcbi8vICAgY2FwdHVyZXMgdmlhIGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiLCBvcHRpb25hbGx5IGNyb3BzL3N0aXRjaGVzXG4vLyAgIGluIGFuIE9mZnNjcmVlbkNhbnZhcywgYW5kIHdyaXRlcyB0aGUgUE5HIGludG8gdGhlIHVzZXIncyBEb3dubG9hZHNcbi8vICAgdW5kZXIgLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9zY3JlZW5zaG90cy8uXG5cbmltcG9ydCB0eXBlIHtBbnlNZXNzYWdlLCBQZ0VudmVsb3BlLCBTaG90UmVwbHl9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5cbmNvbnN0IExPRyA9ICdbUGluY2hHcmFiL2JnXSc7XG5cbi8vIOKUgOKUgOKUgCBUb29sYmFyIGljb246IHJlbmRlciB0aGUg8J+kjyBlbW9qaSBpbnRvIEltYWdlRGF0YSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdlIGRvbid0IHNoaXAgc3RhdGljIFBORyBpY29uczsgd2UgZHJhdyB0aGVtIGF0IHN0YXJ0dXAgc28gdGhlIE9TJ3Mgb3duXG4vLyBwaW5jaCBnbHlwaCBpcyB1c2VkIChjb25zaXN0ZW50IHdpdGggdGhlIGJyYW5kIGluIHRoZSBzaWRlIHBhbmVsKS5cbmFzeW5jIGZ1bmN0aW9uIHNldEVtb2ppSWNvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzaXplcyA9IFsxNiwgMzIsIDQ4LCAxMjhdO1xuICAgIGNvbnN0IGltYWdlRGF0YTogUmVjb3JkPG51bWJlciwgSW1hZ2VEYXRhPiA9IHt9O1xuICAgIGZvciAoY29uc3Qgc2l6ZSBvZiBzaXplcykge1xuICAgICAgY29uc3QgYyA9IG5ldyBPZmZzY3JlZW5DYW52YXMoc2l6ZSwgc2l6ZSk7XG4gICAgICBjb25zdCBjdHggPSBjLmdldENvbnRleHQoJzJkJykhO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICAgIGN0eC5mb250ID0gYCR7TWF0aC5mbG9vcihzaXplICogMC44Mil9cHggXCJBcHBsZSBDb2xvciBFbW9qaVwiLFwiU2Vnb2UgVUkgRW1vamlcIixcIk5vdG8gQ29sb3IgRW1vamlcIixzZXJpZmA7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICBjdHguZmlsbFRleHQoJ/CfpI8nLCBzaXplIC8gMiwgc2l6ZSAvIDIgKyBzaXplICogMC4wNCk7XG4gICAgICBpbWFnZURhdGFbc2l6ZV0gPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHNpemUsIHNpemUpO1xuICAgIH1cbiAgICBhd2FpdCBjaHJvbWUuYWN0aW9uLnNldEljb24oe2ltYWdlRGF0YX0pO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzZXRFbW9qaUljb24nLCBlKTsgfVxufVxuXG4vLyBTdXBwcmVzcyB0aGUgZ2xvYmFsIENocm9tZSBkb3dubG9hZHMgVUkgKFwiZG93bmxvYWRzIGJ1YmJsZVwiIC8gc2hlbGYpIHNvXG4vLyBwZXItY2FwdHVyZSBzY3JlZW5zaG90IHNhdmVzIGRvbid0IHBvcCB0aGUgcGFuZWwgb24gZXZlcnkgYWx0LWNsaWNrLlxuLy8gVGhlIHVzZXIncyBjb21wbGFpbnQ6IFwic2VsZWN0aW5nIGVsZW1lbnRzIGlzIGRvd25sb2FkaW5nIGV2ZXJ5IHNjcmVlbnNob3Rcbi8vIGxpa2Ugc2hvd2luZyBteSBkb3dubG9hZHMgcGFuZSBvcGVuXCIuIENocm9tZSBvZmZlcnMgdHdvIEFQSXMgZGVwZW5kaW5nIG9uXG4vLyB2ZXJzaW9uIOKAlCB3ZSB0cnkgYm90aCAoZWFjaCByZXF1aXJlcyBpdHMgb3duIHBlcm1pc3Npb24pIGFuZCBpZ25vcmVcbi8vIGZhaWx1cmVzIHNvIHRoZSBleHRlbnNpb24gc3RpbGwgd29ya3Mgd2l0aG91dCB0aGUgcGVybWlzc2lvbnMuXG4vL1xuLy8gVHJhZGVvZmY6IHRoaXMgZGlzYWJsZXMgdGhlIHNoZWxmIGZvciBBTEwgZG93bmxvYWRzIHdoaWxlIHBpbmNoZ3JhYiBpc1xuLy8gcnVubmluZy4gQSBmdXR1cmUgXCJzZXR0aW5ncyDihpIgcXVpZXQgZG93bmxvYWRzXCIgdG9nZ2xlIGNhbiBtYWtlIHRoaXNcbi8vIG9wdC1vdXQuXG5jb25zdCBxdWlldERvd25sb2Fkc1VpID0gKCk6IHZvaWQgPT4ge1xuICAvLyBOZXdlciBBUEkgKENocm9tZSA5NisgdmlhIGRvd25sb2Fkcy51aSBwZXJtaXNzaW9uKS5cbiAgdHJ5IHtcbiAgICAoY2hyb21lLmRvd25sb2FkcyBhcyBhbnkpLnNldFVpT3B0aW9ucz8uKHtlbmFibGVkOiBmYWxzZX0sICgpID0+IHtcbiAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIGNvbnNvbGUubG9nKExPRywgJ3NldFVpT3B0aW9uczonLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHsgY29uc29sZS5sb2coTE9HLCAnc2V0VWlPcHRpb25zIHRocmV3JywgZSk7IH1cbiAgLy8gT2xkZXIgQVBJIChzdGlsbCBwcmVzZW50IHRocm91Z2ggQ2hyb21lIDExM2lzaCB2aWEgZG93bmxvYWRzLnNoZWxmKS5cbiAgdHJ5IHsgKGNocm9tZS5kb3dubG9hZHMgYXMgYW55KS5zZXRTaGVsZkVuYWJsZWQ/LihmYWxzZSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxufTtcblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICB0cnkgeyBhd2FpdCBjaHJvbWUuc2lkZVBhbmVsLnNldFBhbmVsQmVoYXZpb3Ioe29wZW5QYW5lbE9uQWN0aW9uQ2xpY2s6IHRydWV9KTsgfVxuICBjYXRjaCAoZSkgeyBjb25zb2xlLndhcm4oTE9HLCAnc2V0UGFuZWxCZWhhdmlvcicsIGUpOyB9XG4gIHRyeSB7IGNocm9tZS5jb250ZXh0TWVudXMuY3JlYXRlKHtpZDogJ3BnLWNhcHR1cmUnLCB0aXRsZTogJ1BpbmNoR3JhYiDigJQgY2FwdHVyZSB0aGlzIGVsZW1lbnQnLCBjb250ZXh0czogWydhbGwnXX0pOyB9XG4gIGNhdGNoIHsgLyogbWF5IGFscmVhZHkgZXhpc3QgKi8gfVxuICBxdWlldERvd25sb2Fkc1VpKCk7XG4gIHZvaWQgaW5qZWN0SW50b09wZW5UYWJzKCk7XG4gIHZvaWQgc2V0RW1vamlJY29uKCk7XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwPy5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gIHF1aWV0RG93bmxvYWRzVWkoKTtcbiAgdm9pZCBpbmplY3RJbnRvT3BlblRhYnMoKTtcbiAgdm9pZCBzZXRFbW9qaUljb24oKTtcbn0pO1xuXG4vLyBSZS1xdWlldCBvbiBlYWNoIGNvbGQgc3RhcnQgb2YgdGhlIFNXIOKAlCB0aGUgc2V0dGluZyBjYW4gYmUgcmVzZXQgYnkgdGhlXG4vLyB1c2VyIG9yIG90aGVyIGV4dGVuc2lvbnMsIGFuZCBTV3MgZ28gaWRsZSBhZ2dyZXNzaXZlbHkuXG5xdWlldERvd25sb2Fkc1VpKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGluamVjdEludG9PcGVuVGFicygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe30pO1xuICAgIGZvciAoY29uc3QgdGFiIG9mIHRhYnMpIHtcbiAgICAgIGlmICghdGFiLmlkIHx8ICF0YWIudXJsIHx8ICEvXmh0dHBzPzovLnRlc3QodGFiLnVybCkpIGNvbnRpbnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgICAgICB0YXJnZXQ6IHt0YWJJZDogdGFiLmlkLCBhbGxGcmFtZXM6IGZhbHNlfSxcbiAgICAgICAgICBmaWxlczogWydjb250ZW50LXNjcmlwdC5qcyddLFxuICAgICAgICAgIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggeyAvKiBwcm90ZWN0ZWQgcGFnZTsgaWdub3JlICovIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ2luamVjdEludG9PcGVuVGFicycsIGUpOyB9XG59XG5cbmNocm9tZS50YWJzLm9uQWN0aXZhdGVkLmFkZExpc3RlbmVyKGFzeW5jICh7dGFiSWR9KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFiID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHRhYklkKTtcbiAgICBpZiAoIXRhYj8udXJsIHx8ICEvXmh0dHBzPzovLnRlc3QodGFiLnVybCkpIHJldHVybjtcbiAgICBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWR9LFxuICAgICAgZmlsZXM6IFsnY29udGVudC1zY3JpcHQuanMnXSxcbiAgICAgIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlLFxuICAgIH0pLmNhdGNoKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbn0pO1xuXG5jaHJvbWUuY29udGV4dE1lbnVzPy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKGluZm8sIHRhYikgPT4ge1xuICBpZiAoaW5mby5tZW51SXRlbUlkICE9PSAncGctY2FwdHVyZScgfHwgIXRhYj8uaWQpIHJldHVybjtcbiAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7X19wZzogdHJ1ZSwga2luZDogJ2NvbnRleHQtY2FwdHVyZSd9KS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbn0pO1xuXG4vLyDilIDilIDilIAgU2NyZWVuc2hvdCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyBGaWxlbmFtZSB0aW1lc3RhbXAgaXMgZXBvY2ggbWlsbGlzZWNvbmRzLiBTb3J0aW5nIGJ5IG5hbWUgPSBzb3J0aW5nIGJ5XG4vLyB0aW1lIHdpdGhpbiBhIGhvc3QgYnVja2V0LiBXZSBhY2NlcHQgYW4gb3B0aW9uYWwgSVNPIHN0cmluZyBmb3IgdGVzdHMgYnV0XG4vLyBub3JtYWxpemUgdG8gZXBvY2ggbXMgc28gdGhlIG91dHB1dCBpcyB1bmlmb3JtLlxuZXhwb3J0IGNvbnN0IHRzRm9yRmlsZW5hbWUgPSAoaXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFpc28pIHJldHVybiBTdHJpbmcoRGF0ZS5ub3coKSk7XG4gIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUodCkgPyBTdHJpbmcodCkgOiBTdHJpbmcoRGF0ZS5ub3coKSk7XG59O1xuXG4vLyBob3N0LXNsdWc6IHJlcGxhY2UgYC5gIHdpdGggYF9gIChwZXIgcHJvamVjdCBjb252ZW50aW9uIHNvIGZpbGVuYW1lcyBhcmVcbi8vIHNoZWxsLWZyaWVuZGx5IGFuZCBkb24ndCBsb29rIGxpa2UgbXVsdGktZXh0ZW5zaW9uIHBhdGhzIGxpa2UgYGFwcC5waW5jaFxuLy8gZ3JhYi5jb20tLi4uYCksIHN0cmlwIGFueSBvdGhlciBub24td29yZC9oeXBoZW4gY2hhcmFjdGVycywgY2FwIGF0IDQwXG4vLyBjaGFycy4gYGxvY2FsaG9zdDozMDAwYCDihpIgYGxvY2FsaG9zdF8zMDAwYC5cbmV4cG9ydCBjb25zdCBob3N0U2x1ZyA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGxldCBob3N0OiBzdHJpbmc7XG4gIHRyeSB7IGhvc3QgPSBuZXcgVVJMKHVybCkuaG9zdDsgfSBjYXRjaCB7IGhvc3QgPSAndW5rbm93bic7IH1cbiAgcmV0dXJuIGhvc3QucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG59O1xuXG4vLyBGaWxlbmFtZSBsYXlvdXQ6IGA8aG9zdF91bmRlcnNjb3JlZD4tbjxOPi08a2luZD5bLTxleHRyYT5dLTxlcG9jaD4ucG5nYC5cbi8vIEhvc3QgZmlyc3QgbWVhbnMgc2NyZWVuc2hvdHMgaW4gRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy9cbi8vIGdyb3VwIG5hdHVyYWxseSBwZXIgc2l0ZTsgZXBvY2ggYXMgYSB0YWlsIGtleSBnaXZlcyBjaHJvbm9sb2dpY2FsIG9yZGVyXG4vLyBpbnNpZGUgZWFjaCBidWNrZXQuXG5leHBvcnQgY29uc3QgYnVpbGRGaWxlbmFtZSA9IChcbiAga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyxcbiAgdHM6IHN0cmluZyxcbiAgbjogbnVtYmVyLFxuICB1cmw6IHN0cmluZyxcbiAgb3B0czoge2NvdW50PzogbnVtYmVyOyB0cnVuY2F0ZWQ/OiBib29sZWFufSA9IHt9LFxuKTogc3RyaW5nID0+IHtcbiAgY29uc3Qgc3RhbXAgPSB0c0ZvckZpbGVuYW1lKHRzKTtcbiAgY29uc3Qgc2x1ZyA9IGhvc3RTbHVnKHVybCk7XG4gIGlmIChraW5kID09PSAnZWxlbWVudCcpIHJldHVybiBgJHtzbHVnfS1uJHtufS1lbGVtZW50LSR7c3RhbXB9LnBuZ2A7XG4gIGlmIChraW5kID09PSAnZ3JvdXAnKSByZXR1cm4gYCR7c2x1Z30tbiR7bn0tZ3JvdXAke29wdHMuY291bnQgPz8gMH0tJHtzdGFtcH0ucG5nYDtcbiAgLy8gcGFnZVxuICBjb25zdCBzdWZmaXggPSBvcHRzLnRydW5jYXRlZCA/ICdwYWdlLXRydW5jJyA6ICdwYWdlJztcbiAgcmV0dXJuIGAke3NsdWd9LW4ke259LSR7c3VmZml4fS0ke3N0YW1wfS5wbmdgO1xufTtcblxuLy8gZGF0YVVSTCDihpIgQmxvYiB3aXRob3V0IGdvaW5nIHRocm91Z2ggZmV0Y2gvYXRvYiByb3VuZHRyaXBzIHRoYXQgYnJvd3NlcnNcbi8vIGluIHNlcnZpY2Utd29ya2VyIGNvbnRleHQgc29tZXRpbWVzIGJhbGsgYXQuIFBORyBvbmx5LlxuY29uc3QgZGF0YVVybFRvQmxvYiA9IGFzeW5jIChkYXRhVXJsOiBzdHJpbmcpOiBQcm9taXNlPEJsb2I+ID0+IHtcbiAgY29uc3QgciA9IGF3YWl0IGZldGNoKGRhdGFVcmwpO1xuICByZXR1cm4gci5ibG9iKCk7XG59O1xuXG4vLyBEZWNvZGUgYSBQTkcgZGF0YVVSTCBpbnRvIGFuIEltYWdlQml0bWFwIHVzYWJsZSBieSBPZmZzY3JlZW5DYW52YXMuIFdlXG4vLyBjYW4ndCBgbmV3IEltYWdlKClgIGluIGEgc2VydmljZSB3b3JrZXIg4oCUIEltYWdlIGlzIGEgRE9NLW9ubHkgY29uc3RydWN0b3IuXG5jb25zdCBkYXRhVXJsVG9CaXRtYXAgPSBhc3luYyAoZGF0YVVybDogc3RyaW5nKTogUHJvbWlzZTxJbWFnZUJpdG1hcD4gPT4ge1xuICBjb25zdCBibG9iID0gYXdhaXQgZGF0YVVybFRvQmxvYihkYXRhVXJsKTtcbiAgcmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xufTtcblxuLy8gRW5jb2RlIGFuIE9mZnNjcmVlbkNhbnZhcyB0byBhIFBORyBibG9iLlxuY29uc3QgY2FudmFzVG9CbG9iID0gYXN5bmMgKGNhbnZhczogT2Zmc2NyZWVuQ2FudmFzKTogUHJvbWlzZTxCbG9iPiA9PlxuICBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcblxuLy8gRG93bnNjYWxlIGEgYml0bWFwIGludG8gYSBQTkcgZGF0YVVSTCB3aXRoIG1heCB3aWR0aCBjYXBwZWQuIFRoZSB0aHVtYm5haWxcbi8vIGlzIHdoYXQgdGhlIHNpZGUgcGFuZWwgcGFpbnRzIGludG8gdGhlIC5wcmV2aWV3IHRpbGUg4oCUIHRoZSBvcmlnaW5hbCBsaXZlc1xuLy8gb25seSBvbiBkaXNrLiBXZSB1c2UgRmlsZVJlYWRlciAod29ya3MgaW4gTVYzIFNXcykgc2luY2UgdGhlIGRhdGFVUkwgaXNcbi8vIHBhc3NlZCBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugd2hlcmUgc2l6ZSBtYXR0ZXJzIGxlc3MuXG5jb25zdCBtYWtlVGh1bWJuYWlsID0gYXN5bmMgKGJpdG1hcDogSW1hZ2VCaXRtYXAsIG1heFdpZHRoID0gMzIwKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgcmF0aW8gPSBiaXRtYXAud2lkdGggPD0gbWF4V2lkdGggPyAxIDogbWF4V2lkdGggLyBiaXRtYXAud2lkdGg7XG4gIGNvbnN0IHcgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC53aWR0aCAqIHJhdGlvKSk7XG4gIGNvbnN0IGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC5oZWlnaHQgKiByYXRpbykpO1xuICBjb25zdCBjYW52YXMgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHcsIGgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICBjdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gJ2hpZ2gnO1xuICBjdHguZHJhd0ltYWdlKGJpdG1hcCwgMCwgMCwgdywgaCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcbiAgLy8gYXJyYXlCdWZmZXIgKyBidG9hIGF2b2lkcyBhbnkgRmlsZVJlYWRlci1hdmFpbGFiaWxpdHkgY29uY2Vybi5cbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG4vLyBQZXItdGFiIHNlcmlhbGl6YXRpb246IGF0IG1vc3Qgb25lIGNhcHR1cmUgaW4gZmxpZ2h0IGF0IGEgdGltZS4gV2l0aG91dCBhXG4vLyBxdWV1ZSwgdGhlIHRocm90dGxpbmcgb24gY2FwdHVyZVZpc2libGVUYWIgKH4yIGNhbGxzL3NlYykgc2hvd3MgdXAgYXNcbi8vIG1pc3Npbmcgc2NyZWVuc2hvdHMgd2hlbiB0aGUgdXNlciBmaXJlcyBzZXZlcmFsIGNhcHR1cmVzIGJhY2stdG8tYmFjay5cbnR5cGUgUXVldWVUYXNrID0gKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmNvbnN0IHRhYlF1ZXVlcyA9IG5ldyBNYXA8bnVtYmVyLCBQcm9taXNlPHZvaWQ+PigpO1xuY29uc3QgZW5xdWV1ZSA9ICh0YWJJZDogbnVtYmVyLCB0YXNrOiBRdWV1ZVRhc2spOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgcHJldiA9IHRhYlF1ZXVlcy5nZXQodGFiSWQpID8/IFByb21pc2UucmVzb2x2ZSgpO1xuICBjb25zdCBuZXh0ID0gcHJldi50aGVuKCgpID0+IHRhc2soKSkuY2F0Y2goKGUpID0+IHsgY29uc29sZS53YXJuKExPRywgJ3F1ZXVlIHRhc2sgZmFpbGVkJywgZSk7IH0pO1xuICB0YWJRdWV1ZXMuc2V0KHRhYklkLCBuZXh0KTtcbiAgcmV0dXJuIG5leHQ7XG59O1xuXG4vLyBPbmUtc2hvdCBDUyByb3VuZC10cmlwOiBhc2sgdGhlIGNvbnRlbnQgc2NyaXB0IHRvIGhpZGUgaXRzIG92ZXJsYXkgdGhlblxuLy8gd2FpdCBmb3IgYWNrLiBXZSB1c2Ugc2VuZE1lc3NhZ2Ugd2l0aCBhIHRpbWVvdXQgc28gYSBDUyB0aGF0J3Mgc3R1Y2sgb3Jcbi8vIG5vdCBsb2FkZWQgY2FuJ3Qgd2VkZ2UgdGhlIHF1ZXVlLlxuY29uc3QgdGVsbENzID0gYXN5bmMgPFQgPSB1bmtub3duPih0YWJJZDogbnVtYmVyLCBwYXlsb2FkOiBhbnksIHRpbWVvdXRNcyA9IDYwMCk6IFByb21pc2U8VCB8IG51bGw+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFQgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgZmluaXNoID0gKHY6IFQgfCBudWxsKTogdm9pZCA9PiB7IGlmICghZG9uZSkgeyBkb25lID0gdHJ1ZTsgcmVzb2x2ZSh2KTsgfSB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gZmluaXNoKG51bGwpLCB0aW1lb3V0TXMpO1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgcGcocGF5bG9hZCksIChyZXBseSkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7IGZpbmlzaChudWxsKTsgcmV0dXJuOyB9XG4gICAgICAgIGZpbmlzaCgocmVwbHkgPz8gbnVsbCkgYXMgVCB8IG51bGwpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7IGZpbmlzaChudWxsKTsgfVxuICB9KTtcbn07XG5cbi8vIFJ1biBhIGZ1bmN0aW9uIGluc2lkZSB0aGUgcGFnZSdzIG1haW4gd29ybGQgKG9yIGlzb2xhdGVkLCBkb2Vzbid0IG1hdHRlclxuLy8gaGVyZSBiZWNhdXNlIHdlIG9ubHkgcmVhZCBsYXlvdXQgbnVtYmVycykuIGFyZ3MgaXMgcGFzc2VkIHBvc2l0aW9uYWxseS5cbmNvbnN0IHJ1bkluUGFnZSA9IGFzeW5jIDxUPihcbiAgdGFiSWQ6IG51bWJlcixcbiAgZnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBULFxuICBhcmdzOiBhbnlbXSA9IFtdLFxuKTogUHJvbWlzZTxUIHwgbnVsbD4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWR9LFxuICAgICAgZnVuYzogZnVuYyBhcyBhbnksXG4gICAgICBhcmdzLFxuICAgIH0pO1xuICAgIHJldHVybiAocmVzdWx0cz8uWzBdPy5yZXN1bHQgPz8gbnVsbCkgYXMgVCB8IG51bGw7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAncnVuSW5QYWdlJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbi8vIENvbXB1dGUgdW5pb24gYmJveCBvZiBzZWxlY3RvcnMgSU5TSURFIHRoZSBwYWdlLCBzY3JvbGwgaXQgaW50byB2aWV3LCBhbmRcbi8vIHJldHVybiB0aGUgYmJveCArIGRwciBmb3IgY3JvcHBpbmcuIHBhZGRpbmcgaXMgYXBwbGllZCBzeW1tZXRyaWNhbGx5LlxudHlwZSBCYm94UmVzdWx0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7IHZ3OiBudW1iZXI7IHZoOiBudW1iZXJ9O1xuY29uc3QgY29tcHV0ZUFuZFNjcm9sbCA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgc2VsZWN0b3JzOiBzdHJpbmdbXSxcbiAgcGFkZGluZzogbnVtYmVyLFxuKTogUHJvbWlzZTxCYm94UmVzdWx0IHwgbnVsbD4gPT4ge1xuICByZXR1cm4gcnVuSW5QYWdlPEJib3hSZXN1bHQgfCBudWxsPih0YWJJZCwgKHNlbHM6IHN0cmluZ1tdLCBwYWQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGVscyA9IHNlbHMubWFwKChzKSA9PiB7XG4gICAgICB0cnkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKTsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gICAgfSkuZmlsdGVyKChlKTogZSBpcyBFbGVtZW50ID0+IEJvb2xlYW4oZSkpO1xuICAgIGlmICghZWxzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgLy8gU2Nyb2xsIHVuaW9uIG1pZHBvaW50IGludG8gdmlldyBmaXJzdDsgc29tZSBwYWdlcyBoYXZlIGxhenkgaW1hZ2VzXG4gICAgLy8gdGhhdCB3b24ndCBwYWludCB1bnRpbCB0aGV5J3JlIG5lYXIgdGhlIHZpZXdwb3J0LlxuICAgIGNvbnN0IHJlY3RzQmVmb3JlID0gZWxzLm1hcCgoZSkgPT4gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgY29uc3QgbWluWEFicyA9IE1hdGgubWluKC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5sZWZ0KSkgKyB3aW5kb3cuc2Nyb2xsWDtcbiAgICBjb25zdCBtaW5ZQWJzID0gTWF0aC5taW4oLi4ucmVjdHNCZWZvcmUubWFwKChyKSA9PiByLnRvcCkpICsgd2luZG93LnNjcm9sbFk7XG4gICAgY29uc3QgbWF4WEFicyA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5yaWdodCkpICsgd2luZG93LnNjcm9sbFg7XG4gICAgY29uc3QgbWF4WUFicyA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5ib3R0b20pKSArIHdpbmRvdy5zY3JvbGxZO1xuICAgIGNvbnN0IGN4ID0gKG1pblhBYnMgKyBtYXhYQWJzKSAvIDI7XG4gICAgY29uc3QgY3kgPSAobWluWUFicyArIG1heFlBYnMpIC8gMjtcbiAgICBjb25zdCB0YXJnZXRYID0gTWF0aC5tYXgoMCwgY3ggLSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIpO1xuICAgIGNvbnN0IHRhcmdldFkgPSBNYXRoLm1heCgwLCBjeSAtIHdpbmRvdy5pbm5lckhlaWdodCAvIDIpO1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogdGFyZ2V0WCwgdG9wOiB0YXJnZXRZLCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG5cbiAgICAvLyBSZWNvbXB1dGUgYmJveGVzIGFmdGVyIHNjcm9sbC5cbiAgICBjb25zdCByZWN0cyA9IGVscy5tYXAoKGUpID0+IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIubGVmdCkpIC0gcGFkO1xuICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIudG9wKSkgLSBwYWQ7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcCgocikgPT4gci5yaWdodCkpICsgcGFkO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoKHIpID0+IHIuYm90dG9tKSkgKyBwYWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1pblgsXG4gICAgICB5OiBtaW5ZLFxuICAgICAgdzogbWF4WCAtIG1pblgsXG4gICAgICBoOiBtYXhZIC0gbWluWSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHZ3OiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHZoOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgfTtcbiAgfSwgW3NlbGVjdG9ycywgcGFkZGluZ10pO1xufTtcblxuLy8gT25lLWZyYW1lIHlpZWxkIGluc2lkZSB0aGUgcGFnZSBzbyBhbnkgcG9zdC1zY3JvbGwgbGF5b3V0IHNldHRsZXMuIFdlIHBpblxuLy8gdG8gdHdvIHJBRnMgdG8gYmUgY29uc2VydmF0aXZlIOKAlCBwYWdlcyB3aXRoIHN0aWNreSBoZWFkZXJzIHNvbWV0aW1lcyBuZWVkXG4vLyB0aGUgc2Vjb25kIGZyYW1lIHRvIHJlcGFpbnQgdGhlIGhlYWRlciBhdCBpdHMgbmV3IG9mZnNldC5cbmNvbnN0IHlpZWxkUmFmID0gYXN5bmMgKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoKSA9PlxuICAgIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXNvbHZlKCkpKSksXG4gICk7XG59O1xuXG4vLyBSZXN0b3JlIHRoZSBwYWdlIHNjcm9sbCBwb3NpdGlvbiBhZnRlciBzdGl0Y2hpbmcuIFRoZSBvcmlnaW5hbCBwb3NpdGlvbnNcbi8vIGFyZSBwYXNzZWQgYmFjayBmcm9tIHRoZSBzdGl0Y2ggbG9vcC5cbmNvbnN0IHJlc3RvcmVTY3JvbGwgPSBhc3luYyAodGFiSWQ6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoc3g6IG51bWJlciwgc3k6IG51bWJlcikgPT4ge1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogc3gsIHRvcDogc3ksIGJlaGF2aW9yOiAnaW5zdGFudCcgYXMgU2Nyb2xsQmVoYXZpb3J9KTtcbiAgfSwgW3gsIHldKTtcbn07XG5cbmNvbnN0IFBBR0VfQ0hVTktfTElNSVQgPSA4O1xuY29uc3QgQ0FOVkFTX1BJWEVMX0xJTUlUID0gMTYzODQ7IC8vIE9mZnNjcmVlbkNhbnZhcyBzYWZldHkgY2FwXG5cbi8vIFBhZ2UgKGZ1bGwtZG9jdW1lbnQpIHNob3QuIExvb3BzIGNhcHR1cmVWaXNpYmxlVGFiIHdoaWxlIHNjcm9sbGluZyBieVxuLy8gdmlld3BvcnQtaGVpZ2h0IGNodW5rczsgc3RvcHMgYXQgY2h1bmsgY291bnQsIHBpeGVsIGNhcCwgb3Igc2Nyb2xsSGVpZ2h0LlxuY29uc3Qgc3RpdGNoUGFnZSA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsPiA9PiB7XG4gIC8vIFNuYXBzaG90IHNjcm9sbCBnZW9tZXRyeSB1cCBmcm9udC5cbiAgY29uc3QgZ2VvbSA9IGF3YWl0IHJ1bkluUGFnZTx7dnc6IG51bWJlcjsgdmg6IG51bWJlcjsgc3c6IG51bWJlcjsgc2g6IG51bWJlcjsgZHByOiBudW1iZXI7IHN4OiBudW1iZXI7IHN5OiBudW1iZXJ9PihcbiAgICB0YWJJZCxcbiAgICAoKSA9PiAoe1xuICAgICAgdnc6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgdmg6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIHN3OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGgsIGRvY3VtZW50LmJvZHk/LnNjcm9sbFdpZHRoID8/IDApLFxuICAgICAgc2g6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmJvZHk/LnNjcm9sbEhlaWdodCA/PyAwKSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHN4OiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgIHN5OiB3aW5kb3cuc2Nyb2xsWSxcbiAgICB9KSxcbiAgKTtcbiAgaWYgKCFnZW9tKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkcHIgPSBnZW9tLmRwcjtcbiAgY29uc3QgdG90YWxIID0gZ2VvbS5zaDtcbiAgY29uc3QgdG90YWxIcHggPSBNYXRoLnJvdW5kKHRvdGFsSCAqIGRwcik7XG4gIGNvbnN0IHdpZHRoUHggPSBNYXRoLnJvdW5kKGdlb20udncgKiBkcHIpO1xuXG4gIC8vIElmIHRoZSBwYWdlIGlzIHNob3J0IGVub3VnaCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LCBzaW5nbGUgc2hvdC5cbiAgbGV0IGNodW5rcyA9IDA7XG4gIGxldCB5ID0gMDtcbiAgbGV0IHN0aXRjaGVkSHB4ID0gMDtcbiAgbGV0IHRydW5jYXRlZCA9IGZhbHNlO1xuXG4gIC8vIEFsbG9jYXRlIHRoZSBjYW52YXMgYXQgdGhlIGNvbnNlcnZhdGl2ZSBmaW5hbCBzaXplOyB3ZSdsbCB0cmltIGxhdGVyIGlmXG4gIC8vIHdlIHN0b3AgZWFybHkuIHdpZHRoIGlzIGZpeGVkOyBoZWlnaHQgZ3Jvd3MgdXAgdG8gbWluKHRvdGFsSHB4LCBjYXApLlxuICBjb25zdCB0YXJnZXRIcHggPSBNYXRoLm1pbih0b3RhbEhweCwgQ0FOVkFTX1BJWEVMX0xJTUlUKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aFB4LCB0YXJnZXRIcHgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cbiAgd2hpbGUgKHkgPCB0b3RhbEgpIHtcbiAgICBpZiAoY2h1bmtzID49IFBBR0VfQ0hVTktfTElNSVQpIHsgdHJ1bmNhdGVkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICBpZiAoc3RpdGNoZWRIcHggPj0gQ0FOVkFTX1BJWEVMX0xJTUlUKSB7IHRydW5jYXRlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoeXk6IG51bWJlcikgPT4ge1xuICAgICAgd2luZG93LnNjcm9sbFRvKHtsZWZ0OiAwLCB0b3A6IHl5LCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG4gICAgfSwgW3ldKTtcbiAgICBhd2FpdCB5aWVsZFJhZih0YWJJZCk7XG4gICAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgICB0cnkge1xuICAgICAgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdjYXB0dXJlVmlzaWJsZVRhYiBwYWdlIGNodW5rIGZhaWxlZCcsIGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IGJtID0gYXdhaXQgZGF0YVVybFRvQml0bWFwKGRhdGFVcmwpO1xuICAgIC8vIERldGVybWluZSBob3cgbXVjaCBvZiBUSElTIGNodW5rIHRvIGRyYXcuIFRoZSBsYXN0IGNodW5rIHVzdWFsbHlcbiAgICAvLyBvdmVybGFwcyB0aGUgcHJldmlvdXMgb25lIChiZWNhdXNlIHRvdGFsSCBpcyBub3QgYSB2aWV3cG9ydCBtdWx0aXBsZSk7XG4gICAgLy8gZHJhd2luZyB0aGUgZnVsbCBiaXRtYXAgd291bGQgZHVwbGljYXRlIHBpeGVscy4gU28gd2UgY3JvcCBieSB0aGVcbiAgICAvLyByZW1haW5kZXIgb2YgdGhlIHBhZ2UgaGVpZ2h0IHdoZW4gb24gdGhlIHRhaWwuXG4gICAgY29uc3QgcmVtYWluaW5nUHggPSBNYXRoLnJvdW5kKCh0b3RhbEggLSB5KSAqIGRwcik7XG4gICAgY29uc3QgZHJhd1NyY0ggPSBNYXRoLm1pbihibS5oZWlnaHQsIHJlbWFpbmluZ1B4KTtcbiAgICBjb25zdCBkcmF3RGVzdEggPSBNYXRoLm1pbih0YXJnZXRIcHggLSBzdGl0Y2hlZEhweCwgZHJhd1NyY0gpO1xuICAgIGlmIChkcmF3RGVzdEggPD0gMCkgeyB0cnVuY2F0ZWQgPSB0cnVlOyBicmVhazsgfVxuICAgIGN0eC5kcmF3SW1hZ2UoYm0sIDAsIDAsIGJtLndpZHRoLCBkcmF3RGVzdEgsIDAsIHN0aXRjaGVkSHB4LCBibS53aWR0aCwgZHJhd0Rlc3RIKTtcbiAgICBzdGl0Y2hlZEhweCArPSBkcmF3RGVzdEg7XG4gICAgY2h1bmtzKys7XG4gICAgeSArPSBnZW9tLnZoO1xuICAgIGJtLmNsb3NlPy4oKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgc2Nyb2xsLlxuICBhd2FpdCByZXN0b3JlU2Nyb2xsKHRhYklkLCBnZW9tLnN4LCBnZW9tLnN5KTtcblxuICAvLyBUcmltIGNhbnZhcyB0byBhY3R1YWwgc3RpdGNoZWQgaGVpZ2h0IGlmIHdlIHN0b3BwZWQgYmVmb3JlIHRhcmdldEhweC5cbiAgbGV0IG91dENhbnZhcyA9IGNhbnZhcztcbiAgaWYgKHN0aXRjaGVkSHB4IDwgdGFyZ2V0SHB4KSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGhQeCwgTWF0aC5tYXgoMSwgc3RpdGNoZWRIcHgpKTtcbiAgICBjb25zdCB0Y3R4ID0gdHJpbW1lZC5nZXRDb250ZXh0KCcyZCcpITtcbiAgICB0Y3R4LmRyYXdJbWFnZShjYW52YXMsIDAsIDApO1xuICAgIG91dENhbnZhcyA9IHRyaW1tZWQ7XG4gIH1cbiAgY29uc3QgYmxvYiA9IGF3YWl0IGNhbnZhc1RvQmxvYihvdXRDYW52YXMpO1xuICBjb25zdCBiaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChibG9iKTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRydW5jYXRlZH07XG59O1xuXG4vLyBFbGVtZW50L2dyb3VwIHNob3Q6IGhpZGUgb3ZlcmxheXMsIGNhcHR1cmUgdmlld3BvcnQsIGNyb3AgaW4gY2FudmFzLlxuY29uc3Qgc2hvdEVsZW1lbnRDb21tb24gPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4gIHNlbGVjdG9yczogc3RyaW5nW10sXG4gIHBhZGRpbmc6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ119IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgY29uc3QgYmJveCA9IGF3YWl0IGNvbXB1dGVBbmRTY3JvbGwodGFiSWQsIHNlbGVjdG9ycywgcGFkZGluZyk7XG4gIGlmICghYmJveCkgcmV0dXJuIG51bGw7XG4gIGF3YWl0IHlpZWxkUmFmKHRhYklkKTtcblxuICAvLyBIaWRlIG92ZXJsYXlzICsgYWNrLlxuICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnaGlkZS1vdmVybGF5cyd9KTtcbiAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgdHJ5IHtcbiAgICBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIod2luZG93SWQsIHtmb3JtYXQ6ICdwbmcnfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnc2hvdy1vdmVybGF5cyd9KTtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnY2FwdHVyZVZpc2libGVUYWIgZmFpbGVkJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfSk7XG4gIH1cblxuICBjb25zdCBibSA9IGF3YWl0IGRhdGFVcmxUb0JpdG1hcChkYXRhVXJsKTtcbiAgLy8gQ29udmVydCBDU1MtcGl4ZWwgYmJveCDihpIgZGV2aWNlLXBpeGVsIGJib3g7IGNsYW1wIHRvIGJpdG1hcCBib3VuZHMgc29cbiAgLy8gYSBwYXJ0aWFsbHkgb2ZmLXNjcmVlbiBlbGVtZW50IGRvZXNuJ3QgY3Jhc2ggZHJhd0ltYWdlLlxuICBjb25zdCBzeCA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoYmJveC54ICogYmJveC5kcHIpKTtcbiAgY29uc3Qgc3kgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGJib3gueSAqIGJib3guZHByKSk7XG4gIGNvbnN0IHN3ID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oYm0ud2lkdGggLSBzeCwgTWF0aC5yb3VuZChiYm94LncgKiBiYm94LmRwcikpKTtcbiAgY29uc3Qgc2ggPSBNYXRoLm1heCgxLCBNYXRoLm1pbihibS5oZWlnaHQgLSBzeSwgTWF0aC5yb3VuZChiYm94LmggKiBiYm94LmRwcikpKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyhzdywgc2gpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5kcmF3SW1hZ2UoYm0sIHN4LCBzeSwgc3csIHNoLCAwLCAwLCBzdywgc2gpO1xuICBibS5jbG9zZT8uKCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXNUb0Jsb2IoY2FudmFzKTtcbiAgY29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XG4gIC8vIEJ1ZyAjMyBmcm9tIHRoZSBleHBvcnQgcm9hc3Q6IHN1cmZhY2UgY3JvcCBtZXRhZGF0YSBzbyByZWNlaXZlcnNcbiAgLy8gY2FuIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZCB0aGUgb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlcy5cbiAgLy8gY3NzUmVjdCA9IHByZS1EUFIgQ1NTIHBpeGVsIHJlY3Qgb2YgdGhlIGNhcHR1cmVkIHJlZ2lvbi5cbiAgLy8gZGV2aWNlUHhSZWN0ID0gcG9zdC1EUFIgcGl4ZWwgcmVjdCBpbnNpZGUgdGhlIHNvdXJjZSBiaXRtYXAuXG4gIC8vIGltYWdlU2l6ZSA9IGRpbWVuc2lvbnMgb2YgdGhlIHByb2R1Y2VkIFBORy5cbiAgLy8gZHByID0gdGhlIGNvbnZlcnNpb24gZmFjdG9yLlxuICBjb25zdCBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ10gPSB7XG4gICAgY3NzUmVjdDoge3g6IGJib3gueCwgeTogYmJveC55LCB3OiBiYm94LncsIGg6IGJib3guaH0sXG4gICAgZGV2aWNlUHhSZWN0OiB7eDogc3gsIHk6IHN5LCB3OiBzdywgaDogc2h9LFxuICAgIGltYWdlU2l6ZToge3c6IHN3LCBoOiBzaH0sXG4gICAgZHByOiBiYm94LmRwcixcbiAgICBwYWRkaW5nLFxuICAgIHNlbGVjdG9ycyxcbiAgfTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRhYlVybCwgY3JvcE1ldGF9O1xufTtcblxuLy8gUGFnZS1vbmx5IHBhdGguIEhpZGVzIG92ZXJsYXlzLCBzdGl0Y2hlcywgcmVzdG9yZXMuXG5jb25zdCBzaG90UGFnZUNvbW1vbiA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfSk7XG4gIGxldCBzdGl0Y2hlZDoge2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBzdGl0Y2hlZCA9IGF3YWl0IHN0aXRjaFBhZ2UodGFiSWQsIHdpbmRvd0lkKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnc2hvdy1vdmVybGF5cyd9KTtcbiAgfVxuICBpZiAoIXN0aXRjaGVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsuLi5zdGl0Y2hlZCwgdGFiVXJsfTtcbn07XG5cbi8vIFNhdmUgdGhlIGJsb2IgYXMgYSBkb3dubG9hZCB1bmRlciAucGluY2hncmFiLzx3b3Jrc3BhY2U+LzxzdWJkaXI+Ly5cbi8vXG4vLyBNVjMgc2VydmljZSB3b3JrZXJzIERPIE5PVCBoYXZlIFVSTC5jcmVhdGVPYmplY3RVUkwg4oCUIGNhbGxpbmcgaXQgdGhyb3dzXG4vLyBcIlVSTC5jcmVhdGVPYmplY3RVUkwgaXMgbm90IGEgZnVuY3Rpb25cIiAodmVyaWZpZWQgbGl2ZSBpbiBleHRlbnNpb24uc3BlYykuXG4vLyBXZSBiYXNlNjQtZW5jb2RlIHRoZSBibG9iIGludG8gYSBkYXRhIFVSTCBpbnN0ZWFkLiBUcmFkZW9mZjogdGhlIGRhdGFcbi8vIFVSTCBpcyB+MzMlIGxhcmdlciB0aGFuIHJhdyBieXRlcywgYW5kIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgaGFzIGFcbi8vIGRhdGEtVVJMIHNpemUgbGltaXQgc29tZXdoZXJlIGFyb3VuZCAzMiBNQjsgZm9yIHR5cGljYWwgd29ya3NwYWNlXG4vLyBleHBvcnRzIChzdWItTUIgSlNPTkwgKyBsb3ctTUIgWklQcykgdGhpcyBpcyB3ZWxsIHVuZGVyIHRoZSBsaW1pdC5cbnR5cGUgU2F2ZWRGaWxlID0ge1xuICByZWxQYXRoOiBzdHJpbmc7XG4gIGFic1BhdGg6IHN0cmluZztcbiAgY29weVBhdGg6IHN0cmluZztcbiAgdGVtcFBhdGg6IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiBjaHJvbWUuZG93bmxvYWRzLkRvd25sb2FkSXRlbVsnc3RhdGUnXTtcbn07XG5cbmNvbnN0IGlzUGxheXdyaWdodEFydGlmYWN0UGF0aCA9IChwYXRoOiBzdHJpbmcpOiBib29sZWFuID0+XG4gIC8oPzpefFtcXFxcL10pKD86cGxheXdyaWdodC1hcnRpZmFjdHN8cGluY2hncmFiLWRsKS1bXlxcXFwvXStbXFxcXC9dWzAtOWEtZi1dezh9LVswLTlhLWYtXXs0fS1bMC05YS1mLV17NH0tWzAtOWEtZi1dezR9LVswLTlhLWYtXXsxMn0kL2kudGVzdChwYXRoKTtcblxuY29uc3QgYmxvYlRvRGF0YVVybCA9IGFzeW5jIChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIC8vIEJ1aWxkIGJhc2U2NCBpbiAzMiBLaUIgY2h1bmtzIHNvIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkgZG9lc24ndFxuICAvLyBvdmVyZmxvdyB0aGUgY2FsbCBzdGFjayBvbiBsYXJnZSBpbnB1dHMuXG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIGNvbnN0IG1pbWUgPSBibG9iLnR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIHJldHVybiBgZGF0YToke21pbWV9O2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuY29uc3Qgc2F2ZURvd25sb2FkID0gYXN5bmMgKFxuICBibG9iOiBCbG9iLFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgc3ViZGlyID0gJ3NjcmVlbnNob3RzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IHJlbFBhdGggPSBzdWJkaXIgPyBgJHtzdWJkaXJ9LyR7ZmlsZW5hbWV9YCA6IGZpbGVuYW1lO1xuICBjb25zdCBmdWxsUGF0aCA9IGBwaW5jaGdyYWIvJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gO1xuICBjb25zb2xlLmxvZyhMT0csICdzYXZlRG93bmxvYWQgc3RhcnQnLCB7ZnVsbFBhdGgsIG1pbWU6IGJsb2IudHlwZSwgc2l6ZTogYmxvYi5zaXplfSk7XG4gIGNvbnN0IHVybCA9IGF3YWl0IGJsb2JUb0RhdGFVcmwoYmxvYik7XG4gIGNvbnN0IGRvd25sb2FkSWQgPSBhd2FpdCBuZXcgUHJvbWlzZTxudW1iZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkKFxuICAgICAge3VybCwgZmlsZW5hbWU6IGZ1bGxQYXRoLCBjb25mbGljdEFjdGlvbjogJ292ZXJ3cml0ZSd9LFxuICAgICAgKGlkKSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgbGFzdEVycm9yOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSA/PyAnZG93bmxvYWQgZmFpbGVkJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCByZXR1cm5lZCBubyBpZCcpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2Rvd25sb2FkIHJldHVybmVkIG5vIGlkJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGlkKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgYWNjZXB0ZWQnLCB7aWQ6IGRvd25sb2FkSWQsIGZ1bGxQYXRofSk7XG4gIC8vIFJlc29sdmUgdGhlIE9TLWFic29sdXRlIHBhdGggYW5kIGRvIG5vdCByZXBvcnQgc3VjY2VzcyB1bnRpbCBDaHJvbWUgc2F5c1xuICAvLyB0aGUgZG93bmxvYWQgY29tcGxldGVkLiBgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZGAgb25seSBtZWFucyBcImFjY2VwdGVkXCI7XG4gIC8vIGRpc2stZnVsbCwgcGVybWlzc2lvbiwgb3IgaW50ZXJydXB0ZWQgd3JpdGVzIHN1cmZhY2UgbGF0ZXIgdGhyb3VnaFxuICAvLyBkb3dubG9hZHMuc2VhcmNoLlxuICBsZXQgYWJzUGF0aCA9IGAke3dvcmtzcGFjZX0vJHtyZWxQYXRofWA7XG4gIGxldCBkb3dubG9hZFN0YXRlOiBjaHJvbWUuZG93bmxvYWRzLkRvd25sb2FkSXRlbVsnc3RhdGUnXSB8IHVuZGVmaW5lZDtcbiAgbGV0IGludGVycnVwdGVkRXJyb3IgPSAnJztcbiAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCAxMDA7IGF0dGVtcHQrKykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IGNocm9tZS5kb3dubG9hZHMuc2VhcmNoKHtpZDogZG93bmxvYWRJZH0pO1xuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zPy5bMF07XG4gICAgICBpZiAoaXRlbT8uZmlsZW5hbWUpIGFic1BhdGggPSBpdGVtLmZpbGVuYW1lO1xuICAgICAgZG93bmxvYWRTdGF0ZSA9IGl0ZW0/LnN0YXRlO1xuICAgICAgaWYgKGl0ZW0/LnN0YXRlID09PSAnaW50ZXJydXB0ZWQnKSB7XG4gICAgICAgIGludGVycnVwdGVkRXJyb3IgPSBgZG93bmxvYWQgaW50ZXJydXB0ZWQke2l0ZW0uZXJyb3IgPyBgOiAke2l0ZW0uZXJyb3J9YCA6ICcnfWA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0/LnN0YXRlID09PSAnY29tcGxldGUnICYmIGl0ZW0uZmlsZW5hbWUpIGJyZWFrO1xuICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy5zZWFyY2ggdGhyZXc6JywgZSk7IH1cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAxMDApKTtcbiAgfVxuICBpZiAoaW50ZXJydXB0ZWRFcnJvcikgdGhyb3cgbmV3IEVycm9yKGludGVycnVwdGVkRXJyb3IpO1xuICBpZiAoZG93bmxvYWRTdGF0ZSAhPT0gJ2NvbXBsZXRlJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgZG93bmxvYWQgZGlkIG5vdCBjb21wbGV0ZSR7ZG93bmxvYWRTdGF0ZSA/IGAgKHN0YXRlOiAke2Rvd25sb2FkU3RhdGV9KWAgOiAnJ31gKTtcbiAgfVxuICBjb25zdCB0ZW1wUGF0aCA9IGlzUGxheXdyaWdodEFydGlmYWN0UGF0aChhYnNQYXRoKTtcbiAgLy8gUGxheXdyaWdodCByZXdyaXRlcyBDaHJvbWUgZG93bmxvYWRzIHRvIGV4dGVuc2lvbmxlc3MgVVVJRCBmaWxlcyB1bmRlclxuICAvLyAvdG1wL3BsYXl3cmlnaHQtYXJ0aWZhY3RzLSo7IGNvcHlpbmcgdGhhdCB0byB0aGUgdXNlciBpcyBjb25mdXNpbmcgYW5kXG4gIC8vIG9mdGVuIHN0YWxlLiBLZWVwIGl0IGluIGFic1BhdGggZm9yIHRlc3RzL2RlYnVnZ2luZywgYnV0IGV4cG9zZSB0aGVcbiAgLy8gaW50ZW5kZWQgYnJvd3NlciBkb3dubG9hZCB0YXJnZXQgZm9yIHRoZSBzaWRlIHBhbmVsJ3MgY2xpcGJvYXJkIGFjdGlvbi5cbiAgY29uc3QgY29weVBhdGggPSB0ZW1wUGF0aCA/IGB+L0Rvd25sb2Fkcy8ke2Z1bGxQYXRofWAgOiBhYnNQYXRoO1xuICBjb25zb2xlLmxvZyhMT0csICdzYXZlRG93bmxvYWQgcmV0dXJuaW5nJywge3JlbFBhdGgsIGFic1BhdGgsIGNvcHlQYXRoLCB0ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZX0pO1xuICByZXR1cm4ge3JlbFBhdGg6IGAke3dvcmtzcGFjZX0vJHtyZWxQYXRofWAsIGFic1BhdGgsIGNvcHlQYXRoLCB0ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZX07XG59O1xuXG5jb25zdCBzYXZlVGV4dERvd25sb2FkID0gYXN5bmMgKFxuICB0ZXh0OiBzdHJpbmcsXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBtaW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdleHBvcnRzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHt0eXBlOiBtaW1lfSk7XG4gIHJldHVybiBzYXZlRG93bmxvYWQoYmxvYiwgd29ya3NwYWNlLCBmaWxlbmFtZSwgc3ViZGlyKTtcbn07XG5cbmNvbnN0IHNhdmVCeXRlc0Rvd25sb2FkID0gYXN5bmMgKFxuICBieXRlczogVWludDhBcnJheSxcbiAgd29ya3NwYWNlOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIG1pbWU6IHN0cmluZyxcbiAgc3ViZGlyID0gJ2V4cG9ydHMnLFxuKTogUHJvbWlzZTxTYXZlZEZpbGU+ID0+IHtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtieXRlcyBhcyB1bmtub3duIGFzIEJsb2JQYXJ0XSwge3R5cGU6IG1pbWV9KTtcbiAgcmV0dXJuIHNhdmVEb3dubG9hZChibG9iLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBzdWJkaXIpO1xufTtcblxuLy8g4pSA4pSA4pSAIFNlcnZpY2UgcmVxdWVzdHMgKyByZWxheSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnOiBQZ0VudmVsb3BlPEFueU1lc3NhZ2U+IHwgYW55LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChtc2cua2luZCA9PT0gJ2NhcHR1cmUtc2NyZWVuc2hvdCcpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gbXNnLnRhYklkID8gW2F3YWl0IGNocm9tZS50YWJzLmdldChtc2cudGFiSWQpXVxuICAgICAgICAgIDogYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBjb25zdCB0YWIgPSB0YWJzWzBdO1xuICAgICAgICBpZiAoIXRhYj8ud2luZG93SWQpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIodGFiLndpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe2RhdGFVcmx9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pOyB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnLmtpbmQgPT09ICdzd2l0Y2gtdG8tdGFiJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7dXJsOiBtc2cudXJsfSk7XG4gICAgICAgIGlmICh0YWJzLmxlbmd0aCAmJiB0YWJzWzBdPy5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMudXBkYXRlKHRhYnNbMF0uaWQsIHthY3RpdmU6IHRydWV9KTtcbiAgICAgICAgICBpZiAodGFic1swXS53aW5kb3dJZCAhPSBudWxsKSBhd2FpdCBjaHJvbWUud2luZG93cy51cGRhdGUodGFic1swXS53aW5kb3dJZCwge2ZvY3VzZWQ6IHRydWV9KTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiB0cnVlfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm9wZW5JZk1pc3NpbmcpIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHt1cmw6IG1zZy51cmwsIGFjdGl2ZTogdHJ1ZX0pO1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7Zm91bmQ6IGZhbHNlLCBvcGVuZWQ6IHQuaWR9KTtcbiAgICAgICAgfSBlbHNlIHNlbmRSZXNwb25zZSh7Zm91bmQ6IGZhbHNlfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZy5raW5kID09PSAnbGlzdC1vcGVuLXRhYnMnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHt0YWJzOiB0YWJzLmZpbHRlcigodCkgPT4gdC51cmwpLm1hcCgodCkgPT4gKHtpZDogdC5pZCwgdXJsOiB0LnVybCwgdGl0bGU6IHQudGl0bGV9KSl9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSwgdGFiczogW119KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAobXNnLmtpbmQgPT09ICdzaG90LWVsZW1lbnQnIHx8IG1zZy5raW5kID09PSAnc2hvdC1ncm91cCcgfHwgbXNnLmtpbmQgPT09ICdzaG90LXBhZ2UnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFiSWQgPSBtc2cudGFiSWQgPz8gc2VuZGVyLnRhYj8uaWQ7XG4gICAgICAgIGxldCByZXNvbHZlZFRhYklkID0gdGFiSWQ7XG4gICAgICAgIGxldCB3aW5kb3dJZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAocmVzb2x2ZWRUYWJJZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgICByZXNvbHZlZFRhYklkID0gdGFic1swXT8uaWQ7XG4gICAgICAgICAgd2luZG93SWQgPSB0YWJzWzBdPy53aW5kb3dJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHJlc29sdmVkVGFiSWQpO1xuICAgICAgICAgIHdpbmRvd0lkID0gdD8ud2luZG93SWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCB8fCB3aW5kb3dJZCA9PSBudWxsKSB7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnbm8gYWN0aXZlIHRhYid9IHNhdGlzZmllcyBTaG90UmVwbHkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YWJJZEZpbmFsID0gcmVzb2x2ZWRUYWJJZDtcbiAgICAgICAgY29uc3Qgd2luZG93SWRGaW5hbCA9IHdpbmRvd0lkO1xuICAgICAgICBhd2FpdCBlbnF1ZXVlKHRhYklkRmluYWwsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBydW5TaG90KG1zZywgdGFiSWRGaW5hbCwgd2luZG93SWRGaW5hbCk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UocmVwbHkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gc2F0aXNmaWVzIFNob3RSZXBseSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBzYXRpc2ZpZXMgU2hvdFJlcGx5KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKG1zZy5raW5kID09PSAnc2F2ZS10ZXh0JyB8fCBtc2cua2luZCA9PT0gJ3NhdmUtYnl0ZXMnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHN0b3JlZDogU2F2ZWRGaWxlO1xuICAgICAgICBjb25zdCB3b3Jrc3BhY2UgPSBTdHJpbmcobXNnLndvcmtzcGFjZSA/PyAnZGVmYXVsdCcpO1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IFN0cmluZyhtc2cuZmlsZW5hbWUgPz8gJ2V4cG9ydC5iaW4nKTtcbiAgICAgICAgY29uc3QgbWltZSA9IFN0cmluZyhtc2cubWltZSA/PyAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyk7XG4gICAgICAgIGNvbnN0IHN1YmRpciA9IFN0cmluZyhtc2cuc3ViZGlyID8/ICdleHBvcnRzJyk7XG4gICAgICAgIGlmIChtc2cua2luZCA9PT0gJ3NhdmUtdGV4dCcpIHtcbiAgICAgICAgICBzdG9yZWQgPSBhd2FpdCBzYXZlVGV4dERvd25sb2FkKFN0cmluZyhtc2cudGV4dCA/PyAnJyksIHdvcmtzcGFjZSwgZmlsZW5hbWUsIG1pbWUsIHN1YmRpcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRGVmZW5zaXZlIGRlY29kZTogY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UgY2FuIGRlbGl2ZXIgYnl0ZXNcbiAgICAgICAgICAvLyBhcyBhIFVpbnQ4QXJyYXksIGEgbnVtYmVyW10sIG9yIGEgZ2VuZXJpYyBpbmRleGVkIG9iamVjdFxuICAgICAgICAgIC8vIChkZXBlbmRpbmcgb24gQ2hyb21lIHZlcnNpb24gKyBjYWxsZXIpLiBBY2NlcHQgYWxsIHNoYXBlcy5cbiAgICAgICAgICBjb25zdCByYXc6IGFueSA9IG1zZy5ieXRlcztcbiAgICAgICAgICBsZXQgYnl0ZXM6IFVpbnQ4QXJyYXk7XG4gICAgICAgICAgaWYgKHJhdyBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIGJ5dGVzID0gcmF3O1xuICAgICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgYnl0ZXMgPSBVaW50OEFycmF5LmZyb20ocmF3KTtcbiAgICAgICAgICBlbHNlIGlmIChyYXcgJiYgdHlwZW9mIHJhdyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHJhdykgYXMgbnVtYmVyW107XG4gICAgICAgICAgICBieXRlcyA9IFVpbnQ4QXJyYXkuZnJvbSh2YWxzKTtcbiAgICAgICAgICB9IGVsc2UgYnl0ZXMgPSBuZXcgVWludDhBcnJheSgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmUtYnl0ZXMgZGVjb2RlZCcsIHtieXRlczogYnl0ZXMubGVuZ3RoLCByYXdUeXBlOiB0eXBlb2YgcmF3LCBpc0FycmF5OiBBcnJheS5pc0FycmF5KHJhdyksIGlzVTg6IHJhdyBpbnN0YW5jZW9mIFVpbnQ4QXJyYXl9KTtcbiAgICAgICAgICBzdG9yZWQgPSBhd2FpdCBzYXZlQnl0ZXNEb3dubG9hZChieXRlcywgd29ya3NwYWNlLCBmaWxlbmFtZSwgbWltZSwgc3ViZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSk7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIEF1dG8tb3BlbiB0aGUgc2lkZSBwYW5lbCBvbiBmaXJzdCBjYXB0dXJlL3N0YWdpbmcuIENocm9tZSAxMTYrIHByb3BhZ2F0ZXNcbiAgLy8gdGhlIHVzZXIgYWN0aXZhdGlvbiB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIHNvIHRoaXMgZG9lc24ndFxuICAvLyB0aHJvdyDigJQgdGhlIGNsaWNrIHRoYXQgdHJpZ2dlcmVkIHRoZSBjYXB0dXJlIGluIHRoZSBjb250ZW50IHNjcmlwdCBpc1xuICAvLyBzdGlsbCBjb25zaWRlcmVkIFwibGl2ZVwiIGhlcmUgaW4gdGhlIHdvcmtlci5cbiAgaWYgKChtc2cua2luZCA9PT0gJ2NhcHR1cmUnIHx8IG1zZy5raW5kID09PSAncGVuZGluZy1hZGQnKSAmJiBzZW5kZXIudGFiPy5pZCAhPSBudWxsKSB7XG4gICAgY2hyb21lLnNpZGVQYW5lbC5vcGVuKHt0YWJJZDogc2VuZGVyLnRhYi5pZH0pLmNhdGNoKCgpID0+IHsgLyogYWxyZWFkeSBvcGVuICovIH0pO1xuICB9XG5cbiAgLy8gTm8gcG9ydCByZWxheTogdGhlIHNpZGUgcGFuZWwgbGlzdGVucyBkaXJlY3RseSBvbiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UsXG4gIC8vIHdoaWNoIGFscmVhZHkgcmVjZWl2ZXMgYnJvYWRjYXN0cyBmcm9tIGNvbnRlbnQgc2NyaXB0cy4gUmVsYXlpbmcgdGhyb3VnaFxuICAvLyBhIHBvcnQgY2F1c2VzIGV2ZXJ5IG1lc3NhZ2UgdG8gYmUgZGVsaXZlcmVkIHR3aWNlIOKAlCB0aGF0IHN1cmZhY2VkIGFzXG4gIC8vIGR1cGxpY2F0ZWQgbXVsdGktc2VsZWN0IGVudHJpZXMgaW4gcHJvZHVjdGlvbi5cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbi8vIEVuY29kZSBhIFBORyBibG9iIGludG8gYSBiYXNlNjQgZGF0YSBVUkwgdXNpbmcgdGhlIHNhbWUgY2h1bmtlZC1idG9hXG4vLyBwYXRoIHNhdmVEb3dubG9hZCB1c2VzLiBUaGUgcmVzdWx0IGlzIHR3byBwdXJwb3Nlcy1pbi1vbmU6IHRoZVxuLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgZ29lcyBiYWNrIHRvIHRoZSBzaWRlIHBhbmVsJ3MgcHJldmlldyB0aWxlIChzbWFsbCxcbi8vIH41LTE1IEtCKSwgd2hpbGUgdGhlIEZVTEwgcG5nIGFsc28gcmlkZXMgYmFjayBzbyB0aGUgcGFuZWwgY2FuIHN0YXNoIGl0XG4vLyBpbiBgc2hvdHNGdWxsYCBhbmQgYnVuZGxlIGl0IGludG8gdGhlIHdvcmtzcGFjZSAudGFyLnpzdCBleHBvcnQgbGF0ZXIuXG5jb25zdCBibG9iVG9GdWxsRGF0YVVybCA9IGFzeW5jIChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG5jb25zdCBydW5TaG90ID0gYXN5bmMgKG1zZzogYW55LCB0YWJJZDogbnVtYmVyLCB3aW5kb3dJZDogbnVtYmVyKTogUHJvbWlzZTxTaG90UmVwbHk+ID0+IHtcbiAgY29uc3QgdHMgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIGNvbnN0IHBhZGRpbmcgPSB0eXBlb2YgbXNnLnBhZGRpbmcgPT09ICdudW1iZXInID8gbXNnLnBhZGRpbmcgOiAyNDtcbiAgaWYgKG1zZy5raW5kID09PSAnc2hvdC1lbGVtZW50Jykge1xuICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RFbGVtZW50Q29tbW9uKHRhYklkLCB3aW5kb3dJZCwgW21zZy5zZWxlY3Rvcl0sIHBhZGRpbmcpO1xuICAgIGlmICghZ290KSByZXR1cm4ge29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9O1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRGaWxlbmFtZSgnZWxlbWVudCcsIHRzLCBtc2cubiwgZ290LnRhYlVybCk7XG4gICAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gICAgY29uc3QgZnVsbERhdGFVcmwgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCxcbiAgICAgIGNyb3A6IGdvdC5jcm9wTWV0YSxcbiAgICB9O1xuICB9XG4gIGlmIChtc2cua2luZCA9PT0gJ3Nob3QtZ3JvdXAnKSB7XG4gICAgY29uc3QgZ290ID0gYXdhaXQgc2hvdEVsZW1lbnRDb21tb24odGFiSWQsIHdpbmRvd0lkLCBtc2cuc2VsZWN0b3JzLCBwYWRkaW5nKTtcbiAgICBpZiAoIWdvdCkgcmV0dXJuIHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ2dyb3VwJywgdHMsIG1zZy5uLCBnb3QudGFiVXJsLCB7Y291bnQ6IG1zZy5zZWxlY3RvcnMubGVuZ3RofSk7XG4gICAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gICAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gICAgY29uc3QgZnVsbERhdGFVcmwgPSBhd2FpdCBibG9iVG9GdWxsRGF0YVVybChnb3QuYmxvYik7XG4gICAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiB0cnVlLCBmaWxlbmFtZTogc3RvcmVkLnJlbFBhdGgsIGFic1BhdGg6IHN0b3JlZC5hYnNQYXRoLFxuICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCxcbiAgICAgIGNyb3A6IGdvdC5jcm9wTWV0YSxcbiAgICB9O1xuICB9XG4gIC8vIHBhZ2VcbiAgY29uc3QgZ290ID0gYXdhaXQgc2hvdFBhZ2VDb21tb24odGFiSWQsIHdpbmRvd0lkKTtcbiAgaWYgKCFnb3QpIHJldHVybiB7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ307XG4gIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRGaWxlbmFtZSgncGFnZScsIHRzLCBtc2cubiwgZ290LnRhYlVybCwge3RydW5jYXRlZDogZ290LnRydW5jYXRlZH0pO1xuICBjb25zdCBzdG9yZWQgPSBhd2FpdCBzYXZlRG93bmxvYWQoZ290LmJsb2IsIG1zZy53b3Jrc3BhY2UsIGZpbGVuYW1lKTtcbiAgY29uc3QgZGF0YVVybCA9IGF3YWl0IG1ha2VUaHVtYm5haWwoZ290LmJpdG1hcCk7XG4gIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICBnb3QuYml0bWFwLmNsb3NlPy4oKTtcbiAgcmV0dXJuIHtcbiAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICBjb3B5UGF0aDogc3RvcmVkLmNvcHlQYXRoLCB0ZW1wUGF0aDogc3RvcmVkLnRlbXBQYXRoLCBkb3dubG9hZFN0YXRlOiBzdG9yZWQuZG93bmxvYWRTdGF0ZSxcbiAgICBkYXRhVXJsLCBmdWxsRGF0YVVybCwgdHJ1bmNhdGVkOiBnb3QudHJ1bmNhdGVkLFxuICB9O1xufTtcblxuLy8gKHNhdmUtdGV4dCAvIHNhdmUtYnl0ZXMgYXJlIGZvbGRlZCBpbnRvIHRoZSBzaW5nbGUgbGlzdGVuZXIgYWJvdmUu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
