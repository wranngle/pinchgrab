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
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
    } catch (e) {
      console.warn(LOG, "setPanelBehavior", e);
    }
    try {
      chrome.contextMenus.create({ id: "pg-capture", title: "PinchGrab — capture this element", contexts: ["all"] });
    } catch {}
    quietDownloadsUi();
    setEmojiIcon();
  });
  chrome.runtime.onStartup?.addListener(() => {
    quietDownloadsUi();
    setEmojiIcon();
  });
  quietDownloadsUi();
  chrome.action.onClicked.addListener((tab) => {
    if (!tab?.id)
      return;
    const tabId = tab.id;
    chrome.sidePanel.open({ tabId }).catch((e) => console.warn(LOG, "sidePanel.open", e));
    if (tab.url && /^https?:/.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        files: ["content-script.js"],
        injectImmediately: true
      }).catch((e) => console.warn(LOG, "activate inject", e));
    }
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

//# debugId=019126DC75BFD0A164756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9iYWNrZ3JvdW5kLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIFNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2wgYmV0d2VlbiBjb250ZW50IHNjcmlwdCwgc2lkZSBwYW5lbCwgYW5kXG4vLyBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyLlxuXG5leHBvcnQgdHlwZSBSZWN0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG5leHBvcnQgdHlwZSBWaWV3cG9ydCA9IHtcbiAgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyO1xuICAvLyBVc2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgYXQgY2FwdHVyZSB0aW1lLiBMZXRzIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhc29uIGFib3V0IHdoeSBjYXB0dXJlZCBhcHBlYXJhbmNlIGRpZmZlcnMgYmV0d2VlbiBzZXNzaW9uc1xuICAvLyAoZS5nLiBkYXJrLW1vZGUgdnMgbGlnaHQtbW9kZSBvZiB0aGUgc2FtZSBjb21wb25lbnQpLlxuICBjb2xvclNjaGVtZT86ICdkYXJrJyB8ICdsaWdodCc7XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICAvLyBEb2N1bWVudCBkaXJlY3Rpb24gKGBsdHJgIC8gYHJ0bGApIOKAlCBkaWZmZXJlbnQgZnJvbSB2aWV3cG9ydCBzaXplLFxuICAvLyBjaGFuZ2VzIHRoZSBtZWFuaW5nIG9mIGBzdGFydGAvYGVuZGAgaW4gQ1NTIGFuZCB0aGUgc2Vuc2Ugb2ZcbiAgLy8gYHJlY3QueGAuIENhcHR1cmVkIHBlciBwYWdlIGhlYWRlciBzbyBSVEwgY2FwdHVyZXMgZG9uJ3QgZ2V0XG4gIC8vIHNpbGVudGx5IG1peGVkIHdpdGggTFRSIG9uZXMuXG4gIGRpcmVjdGlvbj86ICdsdHInIHwgJ3J0bCc7XG4gIC8vIEJyb3dzZXIgem9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCByZXBvcnRzIHRoZSBwaW5jaC16b29tXG4gIC8vIGZhY3RvcjsgdmFsdWVzICE9IDEgbWVhbiB0aGUgdXNlciBoYXMgem9vbWVkIGluL291dCBhbmQgYW55IGxheW91dFxuICAvLyBidWcgdGhleSdyZSBjYXB0dXJpbmcgbWF5IG5vdCByZXBybyBhdCBkZWZhdWx0IHpvb20uXG4gIHpvb20/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGcmFtZXdvcmtJbmZvID0ge1xuICBmcmFtZXdvcms6ICdyZWFjdCcgfCAndnVlJyB8ICdsaXQnIHwgJ3N0ZW5jaWwnIHwgJ3N2ZWx0ZScgfCAnd2ViLWNvbXBvbmVudCc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuICBzb3VyY2U/OiB7ZmlsZT86IHN0cmluZyB8IG51bGw7IGxpbmU/OiBudW1iZXIgfCBudWxsfTtcbiAgLy8gVXAtdHJlZSBjb21wb25lbnQgYW5jZXN0cnkgKGlubmVybW9zdCBmaXJzdCkuIEZvciBSZWFjdCwgd2Fsa2VkIHZpYVxuICAvLyBmaWJlciBgcmV0dXJuYCBjaGFpbjsgZm9yIFZ1ZSwgdmlhIGBfX3Z1ZVBhcmVudENvbXBvbmVudC5wYXJlbnRgLlxuICAvLyBUaGUgY29tcG9uZW50IG5hbWUgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoaWNoIGZpbGUgb3ducyB0aGVcbiAgLy8gcmVuZGVyaW5nIOKAlCB0aGUgY2hhaW4gaGVscHMgaXQgZ3JlcCB1cHdhcmQgdG8gZmluZCB0aGUgcm91dGVcbiAgLy8gY29tcG9uZW50LCB0aGVuIGRyaWxsIGludG8gdGhlIG93bmluZyBmaWxlLlxuICBjaGFpbj86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5jZXN0b3IgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBNYXRjaGVkUnVsZSA9IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgZGVjbGFyYXRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWVkaWE/OiBzdHJpbmc7XG4gIC8vIFdhcyB0aGUgQG1lZGlhIHF1ZXJ5IHRoYXQgd3JhcHMgdGhpcyBydWxlIGFjdHVhbGx5IG1hdGNoZWQgYXRcbiAgLy8gY2FwdHVyZSB0aW1lPyBgdHJ1ZWAgPSBhY3RpdmUsXG4gIC8vIGBmYWxzZWAgPSBtYXRjaGVkIHRoZSBzZWxlY3RvciBidXQgaW5hY3RpdmUgKGUuZy4gbW9iaWxlIHJ1bGVzXG4gIC8vIGNhcHR1cmVkIG9uIGEgZGVza3RvcCB2aWV3cG9ydCksIGB1bmRlZmluZWRgID0gbWF0Y2hNZWRpYSB0aHJldy5cbiAgbWVkaWFBY3RpdmU/OiBib29sZWFuO1xufTtcblxuLy8gU3ludGhldGljIGhpbnRzIFBpbmNoR3JhYiBhZGRzIHRvIGVudHJpZXMg4oCUIGtlcHQgZGlzdGluY3QgZnJvbSBgYXR0cnNgXG4vLyAocmVhbCBET00gYXR0cmlidXRlcykgc28gY29uc3VtZXJzIGNhbiB0ZWxsIHdoYXQgY2FtZSBmcm9tIHRoZSBwYWdlIHZzXG4vLyB3aGF0IHRoZSBjYXB0dXJlIHBpcGVsaW5lIGluamVjdGVkLlxuZXhwb3J0IHR5cGUgRW50cnlIaW50cyA9IHtcbiAgZm9ybWF0Pzogc3RyaW5nOyAgICAgLy8gaW5wdXQgZm9ybWF0IGhpbnQgKGUuZy4gJ1lZWVktTU0tREQnKVxuICB2YWx1ZU1hc2tlZD86IGJvb2xlYW47IC8vIHBhc3N3b3JkIHZhbHVlIHdhcyBtYXNrZWQgYXQgY2FwdHVyZSB0aW1lXG59O1xuXG5leHBvcnQgdHlwZSBFbnRyeSA9IHtcbiAgLy8gU3RhYmxlIHBlci1lbnRyeSB1dWlkLiBHZW5lcmF0ZWQgYXQgY2FwdHVyZSB0aW1lLiBEaXN0aW5jdCBmcm9tIGBuYFxuICAvLyAoZGlzcGxheSBzZXF1ZW5jZSkgYW5kIGZyb20gYGlkYCAoRE9NIGh0bWwgaWQgYXR0cmlidXRlKS4gRm9yZWlnbi1rZXlcbiAgLy8gdGFyZ2V0IGZvciBGZWVkYmFja01lc3NhZ2UucGFyZW50SWQuXG4gIHVpZDogc3RyaW5nO1xuICAvLyBGb3JlaWduIGtleSBpbnRvIHRoZSBzZXNzaW9uIHJvdyAoUGFnZU1lc3NhZ2Uuc2Vzc2lvbklkKS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIGxpbmsgY2FwdHVyZXMgYmFjayB0byBcIndoaWNoIHBhZ2UtbG9hZCBjb250ZXh0IGRpZCB0aGV5XG4gIC8vIGNvbWUgZnJvbT9cIiB3aXRob3V0IGRlcGVuZGluZyBvbiBVUkwgc3RyaW5nIGVxdWFsaXR5LCB3aGljaCBicmVha3NcbiAgLy8gb24gaGFzaCBuYXZpZ2F0aW9uLCBxdWVyeS1wYXJhbSBzd2FwcywgYW5kIFNQQSByb3V0aW5nLiBTZXQgYnkgdGhlXG4gIC8vIHNpZGUgcGFuZWwgYXQgbWVzc2FnZS1yZWNlaXZlIHRpbWUsIG5vdCBvbiB0aGUgcGFnZSBzaWRlLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG4gIG46IG51bWJlcjtcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBvdXRlckhUTUw/OiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIC8vIFRoZSB2aXN1YWxseS1yZW5kZXJlZCBmb3JtIHdoZW4gQ1NTIGB0ZXh0LXRyYW5zZm9ybWAgaXMgc2V0LiBDYXB0dXJlZFxuICAvLyBhbG9uZ3NpZGUgYHRleHRgICh3aGljaCBpcyB0aGUgc291cmNlLXRydXRoIGB0ZXh0Q29udGVudGApIHNvIGFuIExMTVxuICAvLyBjYW4gZGlzYW1iaWd1YXRlIGJldHdlZW4gZS5nLiBzb3VyY2UgYFJlZnJlc2hgIGFuZCByZW5kZXJlZCBgUkVGUkVTSGBcbiAgLy8gd2l0aG91dCBmYWxzZS1ncmVwcGluZyBhZ2FpbnN0IGVpdGhlci5cbiAgcmVuZGVyZWRUZXh0Pzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICBhY2Nlc3NpYmxlTmFtZT86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7ICAgICAgICAgICAgLy8gdGhlIERPTSBodG1sIGlkIGF0dHJpYnV0ZSAodW5jaGFuZ2VkKVxuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbiAgYXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyByZWFsIERPTSBhdHRyaWJ1dGVzIG9ubHlcbiAgaGludHM/OiBFbnRyeUhpbnRzOyAgICAgLy8gc3ludGhldGljIGNhcHR1cmUtdGltZSBoaW50c1xuICByZWN0OiBSZWN0O1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIGluU2hhZG93RE9NPzogYm9vbGVhbjtcbiAgLy8gQ1NTIHNlbGVjdG9yIGZvciB0aGUgc2hhZG93IGhvc3Qgd2hlbiBgaW5TaGFkb3dET01gIGlzIHRydWUuIExldHMgYVxuICAvLyBjb25zdW1lciAob3IgdGhlIHBhbmVsJ3MgcmUtdmFsaWRhdGlvbiBwYXNzKSBmaW5kIHRoZSBob3N0IGVsZW1lbnRcbiAgLy8gc2luY2UgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyByb290cy5cbiAgc2hhZG93SG9zdD86IHN0cmluZztcbiAgY29tcG9uZW50Um9vdD86IHN0cmluZztcbiAgYW5jZXN0b3JzPzogQW5jZXN0b3JbXTtcbiAgY29tcG9uZW50PzogRnJhbWV3b3JrSW5mbztcbiAgLy8gUmVhY3QgZXZlbnQgaGFuZGxlciBuYW1lcyBwcm9iZWQgZnJvbSBgX19yZWFjdFByb3BzJDxrZXk+YCDigJQgYW5zd2Vyc1xuICAvLyBcIndoaWNoIGhhbmRsZXIgZmlyZXMgd2hlbiB0aGlzIGlzIGNsaWNrZWQ/XCIgd2l0aG91dCBhbiBMTE0gaGF2aW5nIHRvXG4gIC8vIGdyZXAgdGhlIGNvZGViYXNlLiBJbiBkZXYgYnVpbGRzIHRoZXNlIGFyZSByZWFsIGZ1bmN0aW9uIG5hbWVzOyBpblxuICAvLyBwcm9kIHRoZXkncmUgbWluaWZpZWQgYnV0IHN0aWxsIGFuY2hvci1hYmxlLlxuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBodG14IC8gU3RpbXVsdXMgLyBBbHBpbmUgLyBUdXJibyB3aXJpbmcgb24gdGhlIGVsZW1lbnQuIFNlcnZlci1cbiAgLy8gcmVuZGVyZWQgYXBwcyBkb24ndCBoYXZlIFJlYWN0IGZpYmVycyDigJQgZm9yIHRoZW0sIHRoaXMgSVMgdGhlXG4gIC8vIGNvbXBvbmVudCBzaGFwZS5cbiAgYmVoYXZpb3JBdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIFRydWUgd2hlbiBgZWwuZ2V0QW5pbWF0aW9ucygpYCByZXBvcnRlZCBhbiBhY3RpdmVseS1wbGF5aW5nXG4gIC8vIGFuaW1hdGlvbiBhdCBjYXB0dXJlIHRpbWUuIFRlbGxzIHRoZSBjb25zdW1lciB0aGF0IGNhcHR1cmVkIHJlY3QgL1xuICAvLyB0cmFuc2Zvcm0gLyBvcGFjaXR5IG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZS5cbiAgaXNBbmltYXRpbmc/OiBib29sZWFuO1xuICAvLyBGb3IgZWxlbWVudHMgcmVuZGVyZWQgaW50byBhIGA8Y2FudmFzPmAsIHRoZSBET00gZ2l2ZXMgdXMgZXNzZW50aWFsbHlcbiAgLy8gbm90aGluZyBhYm91dCB3aGF0IHdhcyBjbGlja2VkIOKAlCB0aGUgY2FudmFzIGhhcyBubyBjaGlsZHJlbiwgbm9cbiAgLy8gdGV4dCwgbm8gbWVhbmluZ2Z1bCBzZWxlY3RvcnMgYmVsb3cgdGhlIGNhbnZhcyBpdHNlbGYuIENhcHR1cmUgdGhlXG4gIC8vIGNsaWNrIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMncyBib3VuZGluZyBib3ggc28gYSBkb3duc3RyZWFtXG4gIC8vIGNvbnN1bWVyIGNhbiBjb3JyZWxhdGUgKGUuZy4gYWdhaW5zdCBhIERhdGFkb2cgLyBUYWJsZWF1IC8gY2hhcnRpbmdcbiAgLy8gbGlicmFyeSB0aGF0IGV4cG9zZXMgZGF0YS1wb2ludCBjb29yZGluYXRlcykuIENvb3JkaW5hdGVzIGFyZSBDU1NcbiAgLy8gcGl4ZWxzOyBtdWx0aXBseSBieSBgdmlld3BvcnQuZHByYCB0byBnZXQgZGV2aWNlIHBpeGVscy5cbiAgY2FudmFzQ2xpY2s/OiB7XG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIG9mZnNldFk6IG51bWJlcjtcbiAgICBjYW52YXNXOiBudW1iZXI7XG4gICAgY2FudmFzSDogbnVtYmVyO1xuICAgIGNhbnZhc1NlbGVjdG9yOiBzdHJpbmc7XG4gIH07XG4gIC8vIENvbnRlbnRlZGl0YWJsZSByaWNoLXRleHQgZWRpdG9yIGNvbnRleHQuIFBvcHVsYXRlZCB3aGVuIHRoZSBjYXB0dXJlZFxuICAvLyBub2RlIGlzLCBvciBsaXZlcyBpbnNpZGUsIGEgYFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1gIGFuY2VzdG9yLiBMZXRzXG4gIC8vIGFuIExMTSByZWFzb25pbmcgYWJvdXQgYSBcImNvcHkgaXMgd3JvbmdcIiAvIFwidGhlIGVkaXRvciBicmVha3Mgd2hlbiBYXCJcbiAgLy8gY2FwdHVyZSBrbm93IHdoaWNoIGVkaXRvciBsaWJyYXJ5IHRvIGxvb2sgYXQg4oCUIHNlbGVjdG9ycyBnZW5lcmF0ZWRcbiAgLy8gYnkgUHJvc2VNaXJyb3IgLyBMZXhpY2FsIC8gZXRjIGFyZSBydW50aW1lLWludGVybmFsIGFuZCB3b24ndCBncmVwXG4gIC8vIGFnYWluc3QgdXNlciBjb2RlLCBidXQgdGhlIExJQlJBUlkgcG9pbnRlciByb3V0ZXMgdGhlIExMTSB0byB0aGVcbiAgLy8gcmlnaHQgd3JhcHBlciBjb21wb25lbnQuXG4gIGVkaXRvcj86IHtcbiAgICBraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnO1xuICAgIHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbiAgfTtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBCRUZPUkUgdGhlIGNsaWNrLiBSZXBybyBjb250ZXh0IGZvciBidWdzIGxpa2VcbiAgLy8gXCJJIGNsaWNrZWQgdGhlIHdyb25nIGRyb3Bkb3duIG9wdGlvblwiIG9yIFwidGhlIHZhbHVlIGZsaWNrZXJlZCBiZWZvcmVcbiAgLy8gSSBjbGlja2VkIGl0XCIg4oCUIHdpdGhvdXQgdGhpcywgdGhlIEpTT04gc25hcHNob3RzIG9ubHkgdGhlIHBvc3QtXG4gIC8vIG11dGF0aW9uIHN0YXRlLCBsZWF2aW5nIHRoZSBMTE0gYmxpbmQgdG8gd2hhdCB0cmlnZ2VyZWQgdGhlXG4gIC8vIGFwcGVhcmFuY2UgdGhlIHVzZXIgY29tcGxhaW5lZCBhYm91dC4gUGluY2hncmFiIGtlZXBzIGFuIDgtc2Vjb25kXG4gIC8vIHJpbmcgYnVmZmVyIG9mIG11dGF0aW9uIHJlY29yZHM7IGNhcHR1cmUgYXR0YWNoZXMgdGhlIG1vc3QgcmVjZW50XG4gIC8vIDMgYXMgYSBzbmFwc2hvdC5cbiAgZG9tTXV0YXRpb25zPzogRG9tTXV0YXRpb25bXTtcbiAgc3RhdGVzPzogc3RyaW5nW107ICAgICAgLy8gYWN0aXZlIHBzZXVkby1jbGFzc2VzICh3YXMgUmVjb3JkPHN0cmluZywgdHJ1ZT4gaW4gdjEpXG4gIC8vIExvY2F0b3IgcXVhbGl0eTogaG93IG1hbnkgZWxlbWVudHMgYHNlbGVjdG9yYCByZXNvbHZlcyB0byBpbiBpdHNcbiAgLy8gc2NvcGUgKDEgPSB1bmlxdWUpLiBIaWdoZXIgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91cy5cbiAgc2VsZWN0b3JNYXRjaENvdW50PzogbnVtYmVyO1xuICAvLyBEaXNhbWJpZ3VhdGVkIG9yZGVyaW5nIGZpZWxkcy5cbiAgLy8gYG5gIGlzIHByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdCAoaXQncyB0aGUgY2FwdHVyZS1zZXF1ZW5jZVxuICAvLyBkaXNwbGF5IGxhYmVsIGluIHRoZSBzaWRlYmFyKS4gVGhlIG5ldyBmaWVsZHMgYXJlIGVtaXQtdGltZSBvbmx5OlxuICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHNhbWUgYXMgYG5gIChjYXB0dXJlIHNlcXVlbmNlIHdpdGhpbiBzZXNzaW9uKVxuICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgcmFuayB3aXRoaW4gdGhlIHBhZ2VcbiAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCBodW1hbi1mYWNpbmcgbGFiZWwgKG1pcnJvcnMgYG5gIHRvZGF5KVxuICBjYXB0dXJlSW5kZXg/OiBudW1iZXI7XG4gIGV2ZW50SW5kZXg/OiBudW1iZXI7XG4gIHZpc3VhbE9yZGVyPzogbnVtYmVyO1xuICBkaXNwbGF5TGFiZWw/OiBzdHJpbmc7XG4gIC8vIEdyb3VwIGZsYXR0ZW5pbmcgZmllbGRzLlxuICAvLyBUaGUgZ3JvdXAgaGVhZCBjYXJyaWVzIGBncm91cE1lbWJlclVpZHNgIChqdXN0IHRoZSBJRHMpOyBlYWNoXG4gIC8vIG1lbWJlciBlbWl0cyBhcyBpdHMgb3duIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nXG4gIC8vIGJhY2sgYXQgdGhlIGhlYWQuXG4gIGdyb3VwTWVtYmVyVWlkcz86IHN0cmluZ1tdO1xuICBncm91cFVpZD86IHN0cmluZztcbiAgLy8gTGlnaHR3ZWlnaHQgYTExeSBhdWRpdCBjYXB0dXJlZCBhdCBjbGljayB0aW1lLiBIZWF2aWVyIGNoZWNrc1xuICAvLyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90cywgYXhlIHZpb2xhdGlvbnMpIGFyZSBub3QgeWV0IHdpcmVkLlxuICBhMTF5Pzoge1xuICAgIGNvbnRyYXN0UmF0aW8/OiBudW1iZXI7XG4gICAgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7XG4gICAgdGFiYmFibGU/OiBib29sZWFuO1xuICAgIGZvY3VzVmlzaWJsZT86IGJvb2xlYW47XG4gIH07XG4gIC8vIFBhcmVudCBsYXlvdXQgY29udGV4dCDigJQgZmxleC9ncmlkL292ZXJmbG93L3Njcm9sbC9zdGFja2luZ1xuICAvLyBhbmNlc3RvcnMgdGhhdCBzaGFwZSB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGFwcGVhcmFuY2UuXG4gIGxheW91dENvbnRleHQ/OiBBcnJheTx7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgZGlzcGxheT86IHN0cmluZztcbiAgICBwb3NpdGlvbj86IHN0cmluZztcbiAgICBvdmVyZmxvdz86IHN0cmluZztcbiAgICB6SW5kZXg/OiBzdHJpbmc7XG4gICAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICAgIHdpbGxDaGFuZ2U/OiBzdHJpbmc7XG4gICAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICAgIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gICAgc2Nyb2xsVG9wPzogbnVtYmVyO1xuICAgIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICB9PjtcbiAgLy8gQXNzZXQgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIGNhcHR1cmVkIHN1YnRyZWUgKGltZyBzcmMsIDx1c2UgaHJlZj4sXG4gIC8vIGJhY2tncm91bmQtaW1hZ2UgdXJsKS4gV2hlbiBhIGNvbXBsYWludCBpcyBhYm91dCBhIGxvZ28gLyBpY29uIC9cbiAgLy8gYXJ0d29yaywgYW4gYWdlbnQgd2l0aG91dCB0aGVzZSByZWZlcmVuY2VzIHdvdWxkIGJlIGxlZnQgZ3Vlc3NpbmcuXG4gIGFzc2V0cz86IEFycmF5PHtcbiAgICBzcmM6IHN0cmluZztcbiAgICBuYXR1cmFsVz86IG51bWJlcjsgbmF0dXJhbEg/OiBudW1iZXI7XG4gICAgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7XG4gICAgYWx0Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gIH0+O1xuICBzdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtYXRjaGVkUnVsZXM/OiBNYXRjaGVkUnVsZVtdO1xuICBwc2V1ZG9FbGVtZW50cz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICAvLyBUcnVuY2F0aW9uIG1hcmtlcnMg4oCUIHByZXNlbnQgd2hlbiBjYXB0dXJlIGhhZCB0byBlbGlkZSBjb250ZW50LiBMZXRzXG4gIC8vIGEgY29uc3VtZXIgZGV0ZWN0IFwidGhpcyBlbnRyeSB3YXMgY3V0IGRvd25cIiBhbmQgcmVmZXRjaCBmcm9tIHRoZVxuICAvLyBsaXZlIHBhZ2UgaWYgaXQgbmVlZHMgdGhlIGZ1bGwgdmVyc2lvbi5cbiAgLy8gICBvdXRlckhUTUwg4oCUIG9yaWdpbmFsIGh0bWwgbGVuZ3RoIGJlZm9yZSB0aGUgc2l6ZS1jYXAga2lja2VkIGluLlxuICAvLyAgIGNoaWxkcmVuICDigJQgbnVtYmVyIG9mIGRlc2NlbmRhbnQgc3VidHJlZXMgcmVwbGFjZWQgYnkgZGVwdGgtY2FwXG4gIC8vICAgICAgICAgICAgICAgZWxpc2lvbiBtYXJrZXJzIChgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gKS5cbiAgdHJ1bmNhdGVkPzoge291dGVySFRNTD86IG51bWJlcjsgY2hpbGRyZW4/OiBudW1iZXI7IHRleHQ/OiBudW1iZXJ9O1xuICAvLyBHcm91cCBvZiBhZGRpdGlvbmFsIGNhcHR1cmVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudHJ5IChBbHQrU2hpZnQrQ2xpY2tcbiAgLy8gLyBBbHQrZHJhZyBzZWxlY3Rpb25zIGNvbGxhcHNlIGhlcmUpLlxuICBncm91cD86IEVudHJ5W107XG4gIC8vIE9wdGlvbmFsIHNjcmVlbnNob3QgYnVuZGxlOiBlYWNoIGZpZWxkIGlzIGEgcmVsYXRpdmUgcGF0aCB1bmRlciB0aGVcbiAgLy8gdXNlcidzIERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+LyByb290LiBUaGUgY2FwdHVyZWRBdCBzdGFtcCBpc1xuICAvLyB0aGUgSVNPIHRpbWVzdGFtcCB3aGVuIHRoZSBzaG90IHdhcyB0YWtlbi5cbiAgc2NyZWVuc2hvdD86IHtcbiAgICBlbGVtZW50Pzogc3RyaW5nO1xuICAgIGdyb3VwPzogc3RyaW5nO1xuICAgIHBhZ2U/OiBzdHJpbmc7XG4gICAgY2FwdHVyZWRBdD86IHN0cmluZztcbiAgICAvLyBBbiBlbXB0eSBgc2NyZWVuc2hvdGAgZmllbGQgY291bGQgbWVhbiBcIm5vdCB5ZXQgc2hvdFwiLCBcImZhaWxlZFwiLFxuICAgIC8vIG9yIFwic2tpcHBlZCBvbiBwdXJwb3NlXCIuIFdoZW4gdGhlIHBpcGVsaW5lIGRlY2xpbmVzIG9yIGZhaWxzLFxuICAgIC8vIHNldCB0aGlzIHNvIHJlY2VpdmVycyBrbm93IGl0J3Mgbm90IGEgcmV0cnkgY2FuZGlkYXRlLlxuICAgIHVuYXZhaWxhYmxlUmVhc29uPzogJ2F1dG9TY3JlZW5zaG90T2ZmJyB8ICdza2lwU2NyZWVuc2hvdEhvc3RzJyB8ICdjYXB0dXJlRmFpbGVkJyB8ICdwZXJtaXNzaW9uRGVuaWVkJyB8IHN0cmluZztcbiAgICAvLyBDcm9wIG1ldGFkYXRhIGRlc2NyaWJpbmcgd2hlcmUgdGhlIGNyb3BwZWQgUE5HIGZpdHMgaW4gdGhlXG4gICAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICBjcm9wPzoge1xuICAgICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZHByOiBudW1iZXI7XG4gICAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59O1xuXG4vLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIHBhZ2UgbWV0YWRhdGEsIGVtaXR0ZWQgb25jZSBwZXIgZGlzdGluY3QgcGFnZSBVUkxcbi8vIGludm9sdmVkIGluIGNhcHR1cmVzIChkZWR1cGVkIGJ5IFVSTCkuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTC5cbi8vIGBwYXJ0aWFsYCBpcyBzZXQgd2hlbiBvbmx5IHRoZSB2aWV3cG9ydCBjb3VsZCBiZSBjYXB0dXJlZCAoZnVsbC1wYWdlIHN0aXRjaFxuLy8gdW5hdmFpbGFibGUpIOKAlCBzZWUgYmFja2dyb3VuZC50cyBzdGl0Y2hQYWdlIGxpbWl0YXRpb25zLlxuZXhwb3J0IHR5cGUgUGFnZVNuYXBzaG90ID0geyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZzsgY2FwdHVyZWRBdDogc3RyaW5nOyB2aWV3cG9ydDoge3dpZHRoOiBudW1iZXI7aGVpZ2h0OiBudW1iZXJ9OyBzY3JvbGxXaWR0aDogbnVtYmVyOyBzY3JvbGxIZWlnaHQ6IG51bWJlcjsgZGV2aWNlUGl4ZWxSYXRpbzogbnVtYmVyOyBsYW5nOiBzdHJpbmc7IHNjcmVlbnNob3Q6IHN0cmluZzsgcGFydGlhbD86IGJvb2xlYW4gfTtcblxuZXhwb3J0IHR5cGUgRG9tTXV0YXRpb24gPSB7XG4gIHR5cGU6ICdjaGlsZExpc3QnIHwgJ2F0dHJpYnV0ZXMnIHwgJ2NoYXJhY3RlckRhdGEnO1xuICB0czogc3RyaW5nOyAgICAgICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBtdXRhdGlvbiBmaXJlZFxuICB0YXJnZXQ6IHN0cmluZzsgICAgICAgIC8vIGNvbXBhY3QgZGVzY3JpcHRvciBvZiB0aGUgbXV0YXRpb24ncyB0YXJnZXQgKGB0YWcjaWQuY2xzYClcbiAgYXR0cmlidXRlTmFtZT86IHN0cmluZztcbiAgb2xkVmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBuZXdWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIGFkZGVkPzogbnVtYmVyOyAgICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiBhZGRlZCBub2Rlc1xuICByZW1vdmVkPzogbnVtYmVyOyAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgcmVtb3ZlZCBub2Rlc1xuICBzdW1tYXJ5Pzogc3RyaW5nOyAgICAgIC8vIG9uZS1saW5lIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uXG59O1xuXG5leHBvcnQgdHlwZSBQYWdlQ29udGV4dCA9IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgdG9rZW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBCcm93c2VyICsgbG9jYWxlIGZpbmdlcnByaW50IGZvciBzZXNzaW9uLWxldmVsIGNvbnRleHQuIExldHMgYVxuICAvLyBkb3duc3RyZWFtIGNvbnN1bWVyIGFuc3dlciBcIndoaWNoIGJyb3dzZXIgcHJvZHVjZWQgdGhpcyBjYXB0dXJlP1wiIG9yXG4gIC8vIFwid2FzIHRoZSBjYXB0dXJlZCBhcHAgcmVuZGVyZWQgaW4gYW4gUlRMIGxvY2FsZT9cIiB3aXRob3V0IHJlcnVubmluZy5cbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICAvLyBHaXQgYnVpbGQgaWRlbnRpdHksIHdoZW4gdGhlIGNhcHR1cmVkIGFwcCBleHBvc2VzXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW5cIj5gLlxuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFdoYXRldmVyIGVsZW1lbnQgaGFkIGZvY3VzIGF0IGNhcHR1cmUgdGltZSwgcGx1cyBhIGhpbnQgYXMgdG9cbiAgLy8gd2hldGhlciB0aGUgdXNlciBuYXZpZ2F0ZWQgdGhlcmUgd2l0aCB0aGUga2V5Ym9hcmQgKFRhYiAvIFNoaWZ0K1RhYlxuICAvLyBwcmVzc2VkIGluIHRoZSBsYXN0IHNlY29uZCkuIFVzZWZ1bCBmb3IgYWNjZXNzaWJpbGl0eS1idWcgY2FwdHVyZXM6XG4gIC8vIFwidGhpcyBlbGVtZW50IGxvb2tzIHdyb25nIG9ubHkgd2hlbiBrZXlib2FyZC1mb2N1c2VkXCIuXG4gIGFjdGl2ZUZvY3VzPzoge3NlbGVjdG9yPzogc3RyaW5nOyByZWNlbnRseVRhYmJlZD86IGJvb2xlYW59O1xufTtcblxuLy8gLS0tLS0tLS0tLSBTaWRlLXBhbmVsIFwibWVzc2FnZXNcIiAoVUkgcm93cykgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBTZWxlY3Rvck1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdzZWxlY3Rvcic7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIGVudHJ5OiBFbnRyeTtcbiAgcGlubmVkPzogYm9vbGVhbjtcbiAgLy8gTGVnYWN5IGZpZWxkIGtlcHQgYXJvdW5kIGJlY2F1c2Ugb2xkIHdvcmtzcGFjZXMgbWF5IHN0aWxsIGhhdmUgaXQ7IHdlXG4gIC8vIHN0cmlwIGl0IG9uIGNhcHR1cmUsIGJ1dCBkb24ndCByZWplY3QgaXQgb24gaW1wb3J0LlxuICBkdXBlUGVuZGluZz86IHVua25vd247XG59O1xuXG5leHBvcnQgdHlwZSBGZWVkYmFja01lc3NhZ2UgPSB7XG4gIHR5cGU6ICdmZWVkYmFjayc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgLy8gT3B0aW9uYWwgZm9yZWlnbiBrZXkgaW50byBFbnRyeS51aWQuIEFkamFjZW5jeSB0byBhIHByZWNlZGluZyBzZWxlY3RvclxuICAvLyBpcyB0aGUgaGlzdG9yaWNhbCBsaW5rOyBwYXJlbnRJZCBtYWtlcyBpdCBleHBsaWNpdCBhbmQgc3Vydml2ZXNcbiAgLy8gcmUtb3JkZXJpbmcgLyBzcGxpdC1ncm91cCAvIGltcG9ydC1leHBvcnQgcm91bmQtdHJpcHMuXG4gIHBhcmVudFVpZD86IHN0cmluZztcbiAgdGFncz86IHN0cmluZ1tdO1xuICAvLyBTZXZlcml0eSAoYG5vdGVgIC8gYGZpeGAgLyBgYmxvY2tgKSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSBpblxuICAvLyAyMDI2LTA1LiBUaGUgZmllbGQgaXMgcmV0YWluZWQgb24gdGhlIHR5cGUgYXMgYHVua25vd25gIHNvXG4gIC8vIHRvbGVyYW50IHJlYWRlcnMgKGBkZW5vcm1hbGl6ZUVudHJ5YCkgZG9uJ3QgZHJvcCB0aGUgdmFsdWUgZnJvbVxuICAvLyBsZWdhY3kgSlNPTkwgZXhwb3J0czsgbmV3IHNlc3Npb25zIG5ldmVyIHNldCBpdC5cbiAgc2V2ZXJpdHk/OiAnbm90ZScgfCAnZml4JyB8ICdibG9jayc7XG59O1xuXG5leHBvcnQgdHlwZSBQYWdlTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3BhZ2UnO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHZpZXdwb3J0PzogVmlld3BvcnQ7XG4gIHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBSb3V0ZSBpZGVudGl0eSBiZXlvbmQgdGhlIFVSTC4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIG9mIHBhdGhuYW1lXG4gIC8vIC8gcXVlcnkgLyBoYXNoICsgYSBndWVzcyBhdCB0aGVcbiAgLy8gYWN0aXZlIHJvdXRlTmFtZSAoYD9yb3V0ZT1zZXR0aW5nc2Agb3IgYCMvdXNlcnMvNDJgIHN0eWxlKS5cbiAgcm91dGU/OiB7XG4gICAgcGF0aG5hbWU/OiBzdHJpbmc7XG4gICAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGhhc2g/OiBzdHJpbmc7XG4gICAgcm91dGVOYW1lPzogc3RyaW5nO1xuICAgIHJvdXRlUGFyYW0/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFJlZGFjdGVkIHN0YXRlIHNuYXBzaG90LiBTdXJmYWNlcyB0aGUgU0hBUEUgb2Ygc3RhdGUgdGhhdCBwcm9kdWNlZFxuICAvLyB0aGUgcGFnZSAoc3RvcmFnZSBrZXlzLCBjb29raWUgbmFtZXMsIGZlYXR1cmUgZmxhZ3MpIHdpdGhvdXRcbiAgLy8gbGVha2luZyB2YWx1ZXMuIExldHMgYSBkb3duc3RyZWFtIGFnZW50IHJlcHJvZHVjZSBieSBzZXR0aW5nIHVwIHRoZVxuICAvLyBzYW1lIGtleXMgd2l0aCB0aGVpciBvd24gZGF0YS5cbiAgc3RhdGU/OiB7XG4gICAgc3RvcmFnZUtleXM/OiBzdHJpbmdbXTtcbiAgICBzZXNzaW9uS2V5cz86IHN0cmluZ1tdO1xuICAgIGNvb2tpZU5hbWVzPzogc3RyaW5nW107XG4gICAgZmVhdHVyZUZsYWdzPzogc3RyaW5nO1xuICB9O1xuICAvLyBTZXNzaW9uIHV1aWQuIFN0YWJsZSBwZXIgd29ya3NwYWNlLWJvb3Qg4oCUIHNlbGVjdG9yIGVudHJpZXMgcmVmZXJlbmNlXG4gIC8vIGl0IHZpYSBgRW50cnkuc2Vzc2lvbklkYCBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzIHRvIHRoZWlyXG4gIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJpc29uLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbE1lc3NhZ2UgPSBTZWxlY3Rvck1lc3NhZ2UgfCBGZWVkYmFja01lc3NhZ2UgfCBQYWdlTWVzc2FnZTtcblxuLy8gLS0tLS0tLS0tLSBJUEMgcGF5bG9hZHMgKENTIOKGlCBQYW5lbCDihpQgQmFja2dyb3VuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIENzVG9QYW5lbCA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlJzsgZW50cnk6IEVudHJ5OyBwYWdlOiBQYWdlQ29udGV4dDsgZ3JvdXBlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdob3Zlcic7IHNlbGVjdG9yOiBzdHJpbmc7IHRhZzogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByZWN0OiBSZWN0fVxuICB8IHtraW5kOiAnaG92ZXItZW5kJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctYWRkJzsgZW50cnk6IEVudHJ5fVxuICB8IHtraW5kOiAncGVuZGluZy1jbGVhcid9XG4gIC8vIEFkZCBhIGZlZWRiYWNrIHJvdyBhdHRhY2hlZCB0byBhIHNlbGVjdG9yLiBUaGUgbG9va3VwIGlzIGJ5XG4gIC8vIGNvbXBvc2l0ZSBrZXkg4oCUIHNlbGVjdG9yICsgdXJsICsgcGFyZW50VWlkIOKAlCBzbyBhIGNvbW1lbnQgb25cbiAgLy8gYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gIG9uIHBhZ2UgQSBkb2Vzbid0IGJsZWVkIGludG8gYVxuICAvLyBjYXB0dXJlIHdpdGggdGhlIHNhbWUgc2VsZWN0b3Igb24gcGFnZSBCLiBwYXJlbnRVaWQgKHdoZW4gdGhlXG4gIC8vIGNvbnRlbnQgc2NyaXB0IGNhbiBzdXBwbHkgaXQgZnJvbSB0aGUgYW5ub3RhdGlvbiBvdmVybGF5J3NcbiAgLy8gYXNzb2NpYXRlZCBjYXB0dXJlKSBpcyB0aGUgc3Ryb25nZXN0IGRpc2FtYmlndWF0b3I7IHVybCBpcyB0aGVcbiAgLy8gZmFsbGJhY2sgd2hlbiBvbmx5IHRoZSBvbi1wYWdlIGNvbW1lbnQgYm94IGlzIGluIHBsYXkuXG4gIHwge2tpbmQ6ICdmZWVkYmFjay1hZGQnOyBzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfVxuICAvLyBGaXJlZCB3aGVuIGEgc2Vzc2lvbi1sZXZlbCBwcmVmZXJlbmNlIGZsaXBzIChkYXJrLW1vZGUgdG9nZ2xlLCBPU1xuICAvLyBtb3Rpb24tcHJlZiBjaGFuZ2UpLiBUaGUgcGFuZWwgYXBwZW5kcyBhIGZyZXNoIHBhZ2Ugcm93IHNvIHRoZVxuICAvLyBleHBvcnQncyBjaHJvbm9sb2d5IHJlZmxlY3RzIHRoZSB0b2dnbGUgYW5kIHBvc3QtY2hhbmdlIGNhcHR1cmVzXG4gIC8vIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQgc3RhdGUuXG4gIHwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSc7IHJlYXNvbjogJ2NvbG9yLXNjaGVtZScgfCAncmVkdWNlZC1tb3Rpb24nOyBwYWdlOiBQYWdlQ29udGV4dH1cbiAgLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBtZXRhZGF0YSBmb3Igb25lIGRpc3RpbmN0IHBhZ2UgKFVSTCkuIEVtaXR0ZWQgYXRcbiAgLy8gbW9zdCBvbmNlIHBlciBVUkwgKHRoZSBjb250ZW50IHNjcmlwdCBkZWR1cGVzKS4gVGhlIHBhbmVsIGNhbiBzdGFzaCB0aGVzZVxuICAvLyBhcyBwYWdlLWxldmVsIGNvbnRleHQgLyBleHBvcnQgdGhlbSBhbG9uZ3NpZGUgZWxlbWVudCBzaG90cy5cbiAgfCB7a2luZDogJ3BhZ2Utc25hcHNob3QnOyBwYXlsb2FkOiBQYWdlU25hcHNob3R9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBGdWxsLXBhZ2UgKGJlc3QtZWZmb3J0KSBzY3JlZW5zaG90IGZvciB0aGUgcGFnZS1zbmFwc2hvdCBmZWF0dXJlLiBVbmxpa2VcbiAgLy8gc2hvdC1wYWdlIHRoaXMgZG9lcyBOT1Qgd3JpdGUgYSBmaWxlIG9yIGJ1aWxkIGEgdGh1bWJuYWlsIOKAlCBpdCBqdXN0XG4gIC8vIHJldHVybnMgdGhlIHN0aXRjaGVkIFBORyBhcyBhIGRhdGEgVVJMIHNvIHRoZSBjYWxsZXIgKGNvbnRlbnQgc2NyaXB0KSBjYW5cbiAgLy8gYXR0YWNoIGl0IHRvIGEgUGFnZVNuYXBzaG90LiBgcGFydGlhbGAgaXMgdHJ1ZSB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0XG4gIC8vIGNvdWxkIGJlIGNhcHR1cmVkLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdC1zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIFNpZGUgcGFuZWwgYXNrcyB0aGUgYmFja2dyb3VuZCB0byB3cml0ZSBhIFVURi04IHN0cmluZyAoSlNPTkwsIE1hcmtkb3duLFxuICAvLyBSRUFETUUpIHRvIGRpc2suIGBzdWJkaXJgIGlzIHJlbGF0aXZlIHRvIC5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIOKAlCB3ZVxuICAvLyBkZWZhdWx0IHRvICdleHBvcnRzJyBzbyBKU09OTC9NRCBsaXZlIHNlcGFyYXRlIGZyb20gc2NyZWVuc2hvdHMuXG4gIHwge2tpbmQ6ICdzYXZlLXRleHQnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBtaW1lOiBzdHJpbmc7IHN1YmRpcj86IHN0cmluZ31cbiAgLy8gU2FtZSBhcyBzYXZlLXRleHQgYnV0IGZvciBiaW5hcnkgYmxvYnMgKHdvcmtzcGFjZSBaSVApLiBjaHJvbWUucnVudGltZVxuICAvLyAuc2VuZE1lc3NhZ2UgdXNlcyBzdHJ1Y3R1cmVkIGNsb25pbmcsIHdoaWNoIHByZXNlcnZlcyBVaW50OEFycmF5LCBzbyB3ZVxuICAvLyBwYXNzIHRoZSB0eXBlZCBhcnJheSBkaXJlY3RseS4gbnVtYmVyW10gaXMgYWNjZXB0ZWQgYXMgYSBmYWxsYmFjayBmb3JcbiAgLy8gb2xkZXIgY2FsbGVycyBhbmQgdGVzdHMgdGhhdCBwcmUtc2VyaWFsaXplLlxuICB8IHtraW5kOiAnc2F2ZS1ieXRlcyc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyBieXRlczogVWludDhBcnJheSB8IG51bWJlcltdOyBtaW1lOiBzdHJpbmc7IHN1YmRpcj86IHN0cmluZ307XG5cbmV4cG9ydCB0eXBlIFNob3RSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAgICAgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKGUuZy4gZGVmYXVsdC9zY3JlZW5zaG90cy9mb28ucG5nKVxuICBhYnNQYXRoPzogc3RyaW5nOyAgICAgIC8vIE9TLWFic29sdXRlIHBhdGggZm9yIFwiQ29weSBhcyBwYXRoXCJcbiAgY29weVBhdGg/OiBzdHJpbmc7ICAgICAvLyBVSS1mYWNpbmcgcGF0aDsgYXZvaWRzIFBsYXl3cmlnaHQgdGVtcCBhcnRpZmFjdCBuYW1lc1xuICB0ZW1wUGF0aD86IGJvb2xlYW47ICAgIC8vIHRydWUgd2hlbiBhYnNQYXRoIGlzIGEgYnJvd3Nlci90ZXN0LWhhcm5lc3MgYXJ0aWZhY3QgcGF0aFxuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBkYXRhVXJsPzogc3RyaW5nOyAgICAgIC8vIGRvd25zY2FsZWQgdGh1bWJuYWlsICjiiaQzMjBweCB3aWRlKSBmb3IgdGhlIHNpZGUtcGFuZWwgcHJldmlld1xuICBmdWxsRGF0YVVybD86IHN0cmluZzsgIC8vIGZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCDigJQgdXNlZCBieSB0aGUgd29ya3NwYWNlIGFyY2hpdmUgZXhwb3J0XG4gIGVycm9yPzogc3RyaW5nO1xuICB0cnVuY2F0ZWQ/OiBib29sZWFuO1xuICAvLyBDcm9wIG1ldGFkYXRhLiBMZXRzIHJlY2VpdmVycyBtYXAgYmV0d2VlbiB0aGUgc3RvcmVkIFBORyBhbmRcbiAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlcyBzbyB0aGV5IGNhblxuICAvLyBkcmF3IHRoZWlyIG93biBvdmVybGF5IG9yIHJlcHJvZHVjZSB0aGUgY3JvcCBvbiBhIGZyZXNoIGNhcHR1cmUuXG4gIGNyb3A/OiB7XG4gICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgZGV2aWNlUHhSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgZHByOiBudW1iZXI7XG4gICAgcGFkZGluZzogbnVtYmVyO1xuICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gIH07XG59O1xuXG4vLyBSZXBseSB0byBhIGBwYWdlLXNuYXBzaG90LXNob3RgIHJlcXVlc3QuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTCBvZlxuLy8gdGhlIChiZXN0LWVmZm9ydCkgZnVsbCBwYWdlOyBgcGFydGlhbGAgaXMgdHJ1ZSB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IHdhc1xuLy8gY2FwdHVyZWQuIGBvazpmYWxzZWAgY2FycmllcyBhbiBlcnJvciBzdHJpbmcuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3RSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIHNjcmVlbnNob3Q/OiBzdHJpbmc7XG4gIHBhcnRpYWw/OiBib29sZWFuO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFNhdmVSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aFxuICBhYnNQYXRoPzogc3RyaW5nOyAgLy8gT1MtYWJzb2x1dGUgcGF0aFxuICBjb3B5UGF0aD86IHN0cmluZzsgLy8gVUktZmFjaW5nIHBhdGhcbiAgdGVtcFBhdGg/OiBib29sZWFuO1xuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEJnUmVwbHkgPVxuICB8IHtkYXRhVXJsOiBzdHJpbmd9XG4gIHwge2ZvdW5kOiBib29sZWFuOyBvcGVuZWQ/OiBudW1iZXJ9XG4gIHwge3RhYnM6IEFycmF5PHtpZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ30+fVxuICB8IHtlcnJvcjogc3RyaW5nfVxuICB8IFNob3RSZXBseVxuICB8IFNhdmVSZXBseVxuICB8IFBhZ2VTbmFwc2hvdFJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gUGluY2hHcmFiIOKAlCBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyIChNVjMpXG4vL1xuLy8g4oCiIE9wZW4gdGhlIHNpZGUgcGFuZWwgb24gYWN0aW9uIGNsaWNrXG4vLyDigKIgSW5qZWN0IHRoZSBjb250ZW50IHNjcmlwdCBpbnRvIGFscmVhZHktb3BlbiB0YWJzIChubyByZWZyZXNoIG5lZWRlZClcbi8vIOKAoiBSaWdodC1jbGljayBcIlBpbmNoR3JhYiBjYXB0dXJlXCIgY29udGV4dCBtZW51XG4vLyDigKIgQ2FwdHVyZSB2aXNpYmxlLXRhYiBzY3JlZW5zaG90cyBvbiBzaWRlLXBhbmVsIHJlcXVlc3Rcbi8vIOKAoiBBdXRvLW9wZW4gdGhlIHNpZGUgcGFuZWwgb24gZmlyc3QgY2FwdHVyZSAodXNlcyBDaHJvbWUgMTE2KyB1c2VyLWdlc3R1cmVcbi8vICAgcHJvcGFnYXRpb24gdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSlcbi8vIOKAoiBSZWxheSBjb250ZW50LXNjcmlwdCBtZXNzYWdlcyB0byBzaWRlLXBhbmVsIHBvcnRzXG4vLyDigKIgU2NyZWVuc2hvdCB3b3JrZXI6IHNob3QtZWxlbWVudCAvIHNob3QtZ3JvdXAgLyBzaG90LXBhZ2Uga2luZHMuIEVhY2hcbi8vICAgY2FwdHVyZXMgdmlhIGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiLCBvcHRpb25hbGx5IGNyb3BzL3N0aXRjaGVzXG4vLyAgIGluIGFuIE9mZnNjcmVlbkNhbnZhcywgYW5kIHdyaXRlcyB0aGUgUE5HIGludG8gdGhlIHVzZXIncyBEb3dubG9hZHNcbi8vICAgdW5kZXIgLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9zY3JlZW5zaG90cy8uXG5cbmltcG9ydCB0eXBlIHtBbnlNZXNzYWdlLCBQZ0VudmVsb3BlLCBTaG90UmVwbHl9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5cbmNvbnN0IExPRyA9ICdbUGluY2hHcmFiL2JnXSc7XG5cbi8vIOKUgOKUgOKUgCBUb29sYmFyIGljb246IHJlbmRlciB0aGUg8J+kjyBlbW9qaSBpbnRvIEltYWdlRGF0YSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdlIGRvbid0IHNoaXAgc3RhdGljIFBORyBpY29uczsgd2UgZHJhdyB0aGVtIGF0IHN0YXJ0dXAgc28gdGhlIE9TJ3Mgb3duXG4vLyBwaW5jaCBnbHlwaCBpcyB1c2VkIChjb25zaXN0ZW50IHdpdGggdGhlIGJyYW5kIGluIHRoZSBzaWRlIHBhbmVsKS5cbmFzeW5jIGZ1bmN0aW9uIHNldEVtb2ppSWNvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzaXplcyA9IFsxNiwgMzIsIDQ4LCAxMjhdO1xuICAgIGNvbnN0IGltYWdlRGF0YTogUmVjb3JkPG51bWJlciwgSW1hZ2VEYXRhPiA9IHt9O1xuICAgIGZvciAoY29uc3Qgc2l6ZSBvZiBzaXplcykge1xuICAgICAgY29uc3QgYyA9IG5ldyBPZmZzY3JlZW5DYW52YXMoc2l6ZSwgc2l6ZSk7XG4gICAgICBjb25zdCBjdHggPSBjLmdldENvbnRleHQoJzJkJykhO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICAgIGN0eC5mb250ID0gYCR7TWF0aC5mbG9vcihzaXplICogMC44Mil9cHggXCJBcHBsZSBDb2xvciBFbW9qaVwiLFwiU2Vnb2UgVUkgRW1vamlcIixcIk5vdG8gQ29sb3IgRW1vamlcIixzZXJpZmA7XG4gICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICBjdHguZmlsbFRleHQoJ/CfpI8nLCBzaXplIC8gMiwgc2l6ZSAvIDIgKyBzaXplICogMC4wNCk7XG4gICAgICBpbWFnZURhdGFbc2l6ZV0gPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHNpemUsIHNpemUpO1xuICAgIH1cbiAgICBhd2FpdCBjaHJvbWUuYWN0aW9uLnNldEljb24oe2ltYWdlRGF0YX0pO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzZXRFbW9qaUljb24nLCBlKTsgfVxufVxuXG4vLyBTdXBwcmVzcyB0aGUgZ2xvYmFsIENocm9tZSBkb3dubG9hZHMgVUkgKFwiZG93bmxvYWRzIGJ1YmJsZVwiIC8gc2hlbGYpIHNvXG4vLyBwZXItY2FwdHVyZSBzY3JlZW5zaG90IHNhdmVzIGRvbid0IHBvcCB0aGUgcGFuZWwgb24gZXZlcnkgYWx0LWNsaWNrLlxuLy8gVGhlIHVzZXIncyBjb21wbGFpbnQ6IFwic2VsZWN0aW5nIGVsZW1lbnRzIGlzIGRvd25sb2FkaW5nIGV2ZXJ5IHNjcmVlbnNob3Rcbi8vIGxpa2Ugc2hvd2luZyBteSBkb3dubG9hZHMgcGFuZSBvcGVuXCIuIENocm9tZSBvZmZlcnMgdHdvIEFQSXMgZGVwZW5kaW5nIG9uXG4vLyB2ZXJzaW9uIOKAlCB3ZSB0cnkgYm90aCAoZWFjaCByZXF1aXJlcyBpdHMgb3duIHBlcm1pc3Npb24pIGFuZCBpZ25vcmVcbi8vIGZhaWx1cmVzIHNvIHRoZSBleHRlbnNpb24gc3RpbGwgd29ya3Mgd2l0aG91dCB0aGUgcGVybWlzc2lvbnMuXG4vL1xuLy8gVHJhZGVvZmY6IHRoaXMgZGlzYWJsZXMgdGhlIHNoZWxmIGZvciBBTEwgZG93bmxvYWRzIHdoaWxlIHBpbmNoZ3JhYiBpc1xuLy8gcnVubmluZy4gQSBmdXR1cmUgXCJzZXR0aW5ncyDihpIgcXVpZXQgZG93bmxvYWRzXCIgdG9nZ2xlIGNhbiBtYWtlIHRoaXNcbi8vIG9wdC1vdXQuXG5jb25zdCBxdWlldERvd25sb2Fkc1VpID0gKCk6IHZvaWQgPT4ge1xuICAvLyBOZXdlciBBUEkgKENocm9tZSA5NisgdmlhIGRvd25sb2Fkcy51aSBwZXJtaXNzaW9uKS5cbiAgdHJ5IHtcbiAgICAoY2hyb21lLmRvd25sb2FkcyBhcyBhbnkpLnNldFVpT3B0aW9ucz8uKHtlbmFibGVkOiBmYWxzZX0sICgpID0+IHtcbiAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIGNvbnNvbGUubG9nKExPRywgJ3NldFVpT3B0aW9uczonLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHsgY29uc29sZS5sb2coTE9HLCAnc2V0VWlPcHRpb25zIHRocmV3JywgZSk7IH1cbiAgLy8gT2xkZXIgQVBJIChzdGlsbCBwcmVzZW50IHRocm91Z2ggQ2hyb21lIDExM2lzaCB2aWEgZG93bmxvYWRzLnNoZWxmKS5cbiAgdHJ5IHsgKGNocm9tZS5kb3dubG9hZHMgYXMgYW55KS5zZXRTaGVsZkVuYWJsZWQ/LihmYWxzZSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxufTtcblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICAvLyBvcGVuUGFuZWxPbkFjdGlvbkNsaWNrOmZhbHNlIHNvIE9VUiBhY3Rpb24ub25DbGlja2VkIGhhbmRsZXIgcnVucyBpbnN0ZWFkIOKAlFxuICAvLyBpdCBvcGVucyB0aGUgcGFuZWwgQU5EIGluamVjdHMgdGhlIGNhcHR1cmUgc2NyaXB0IGludG8gdGhlIGNsaWNrZWQgdGFiIHZpYVxuICAvLyB0aGUgYWN0aXZlVGFiIGdyYW50IGZyb20gdGhlIGNsaWNrIGdlc3R1cmUgKG5vIDxhbGxfdXJscz4gbmVlZGVkKS4gU2VlICMxOC5cbiAgdHJ5IHsgYXdhaXQgY2hyb21lLnNpZGVQYW5lbC5zZXRQYW5lbEJlaGF2aW9yKHtvcGVuUGFuZWxPbkFjdGlvbkNsaWNrOiBmYWxzZX0pOyB9XG4gIGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzZXRQYW5lbEJlaGF2aW9yJywgZSk7IH1cbiAgdHJ5IHsgY2hyb21lLmNvbnRleHRNZW51cy5jcmVhdGUoe2lkOiAncGctY2FwdHVyZScsIHRpdGxlOiAnUGluY2hHcmFiIOKAlCBjYXB0dXJlIHRoaXMgZWxlbWVudCcsIGNvbnRleHRzOiBbJ2FsbCddfSk7IH1cbiAgY2F0Y2ggeyAvKiBtYXkgYWxyZWFkeSBleGlzdCAqLyB9XG4gIHF1aWV0RG93bmxvYWRzVWkoKTtcbiAgdm9pZCBzZXRFbW9qaUljb24oKTtcbn0pO1xuXG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXA/LmFkZExpc3RlbmVyKCgpID0+IHtcbiAgcXVpZXREb3dubG9hZHNVaSgpO1xuICB2b2lkIHNldEVtb2ppSWNvbigpO1xufSk7XG5cbi8vIFJlLXF1aWV0IG9uIGVhY2ggY29sZCBzdGFydCBvZiB0aGUgU1cg4oCUIHRoZSBzZXR0aW5nIGNhbiBiZSByZXNldCBieSB0aGVcbi8vIHVzZXIgb3Igb3RoZXIgZXh0ZW5zaW9ucywgYW5kIFNXcyBnbyBpZGxlIGFnZ3Jlc3NpdmVseS5cbnF1aWV0RG93bmxvYWRzVWkoKTtcblxuLy8g4pSA4pSA4pSAIEFjdGl2YXRpb24gKCMxOCk6IHRvb2xiYXIgY2xpY2sgYXR0YWNoZXMgUGluY2hHcmFiIHRvIFRISVMgdGFiIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUGluY2hHcmFiIG5vIGxvbmdlciBhdXRvLWluamVjdHMgaW50byBldmVyeSBwYWdlIOKAlCB0aGUgPGFsbF91cmxzPlxuLy8gY29udGVudF9zY3JpcHRzIGVudHJ5IGFuZCBob3N0X3Blcm1pc3Npb25zIGFyZSBnb25lLiBDbGlja2luZyB0aGUgdG9vbGJhclxuLy8gYWN0aW9uIGdyYW50cyBhY3RpdmVUYWIgZm9yIHRoZSBjbGlja2VkIHRhYjsgd2UgaW5qZWN0IHRoZSBjYXB0dXJlIHNjcmlwdFxuLy8gdGhlcmUgYW5kIG9wZW4gdGhlIHNpZGUgcGFuZWwuIEVhY2ggYWN0aXZhdGVkIHRhYiBiZWNvbWVzIGl0cyBvd24gd29ya3NwYWNlLFxuLy8gdHJhY2tlZCBwYW5lbC1zaWRlIHZpYSB0aGUgcGctdGFiLWFjdGl2YXRlZCBtZXNzYWdlIGJlbG93LlxuY2hyb21lLmFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKHRhYikgPT4ge1xuICBpZiAoIXRhYj8uaWQpIHJldHVybjtcbiAgY29uc3QgdGFiSWQgPSB0YWIuaWQ7XG4gIC8vIEJvdGggc2lkZVBhbmVsLm9wZW4oKSBhbmQgZXhlY3V0ZVNjcmlwdCgpIGNvbnN1bWUgdGhlIGNsaWNrJ3MgdXNlciBnZXN0dXJlLFxuICAvLyBzbyBmaXJlIHRoZW0gc3luY2hyb25vdXNseSBhdCB0aGUgdG9wIG9mIHRoZSBoYW5kbGVyIGJlZm9yZSBhbnkgYXdhaXQuXG4gIGNocm9tZS5zaWRlUGFuZWwub3Blbih7dGFiSWR9KS5jYXRjaCgoZSkgPT4gY29uc29sZS53YXJuKExPRywgJ3NpZGVQYW5lbC5vcGVuJywgZSkpO1xuICBpZiAodGFiLnVybCAmJiAvXmh0dHBzPzovLnRlc3QodGFiLnVybCkpIHtcbiAgICBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWQsIGFsbEZyYW1lczogZmFsc2V9LFxuICAgICAgZmlsZXM6IFsnY29udGVudC1zY3JpcHQuanMnXSxcbiAgICAgIGluamVjdEltbWVkaWF0ZWx5OiB0cnVlLFxuICAgIH0pLmNhdGNoKChlKSA9PiBjb25zb2xlLndhcm4oTE9HLCAnYWN0aXZhdGUgaW5qZWN0JywgZSkpO1xuICB9XG4gIC8vIEJpbmQgdGhpcyB0YWIgdG8gYSB3b3Jrc3BhY2UgcGFuZWwtc2lkZS4gVGhlIHBhbmVsIG1heSBoYXZlIGp1c3Qgb3BlbmVkIGFuZFxuICAvLyBub3QgYmUgbGlzdGVuaW5nIHlldCwgc28gcmVwbGF5IGEgZmV3IHRpbWVzOyB0aGUgcGFuZWwgZGVkdXBzIGJ5IHRhYklkLlxuICBjb25zdCBtZXRhID0ge19fcGc6IHRydWUsIGtpbmQ6ICdwZy10YWItYWN0aXZhdGVkJywgdGFiSWQsIHVybDogdGFiLnVybCA/PyAnJywgdGl0bGU6IHRhYi50aXRsZSA/PyAnJ307XG4gIGNvbnN0IGFubm91bmNlID0gKCk6IHZvaWQgPT4geyB0cnkgeyB2b2lkIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1ldGEpLmNhdGNoPy4oKCkgPT4geyAvKiBub3QgdXAgeWV0ICovIH0pOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfTtcbiAgYW5ub3VuY2UoKTtcbiAgc2V0VGltZW91dChhbm5vdW5jZSwgMTUwKTtcbiAgc2V0VGltZW91dChhbm5vdW5jZSwgNTAwKTtcbn0pO1xuXG5jaHJvbWUuY29udGV4dE1lbnVzPy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKGluZm8sIHRhYikgPT4ge1xuICBpZiAoaW5mby5tZW51SXRlbUlkICE9PSAncGctY2FwdHVyZScgfHwgIXRhYj8uaWQpIHJldHVybjtcbiAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7X19wZzogdHJ1ZSwga2luZDogJ2NvbnRleHQtY2FwdHVyZSd9KS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbn0pO1xuXG4vLyDilIDilIDilIAgU2NyZWVuc2hvdCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyBGaWxlbmFtZSB0aW1lc3RhbXAgaXMgZXBvY2ggbWlsbGlzZWNvbmRzLiBTb3J0aW5nIGJ5IG5hbWUgPSBzb3J0aW5nIGJ5XG4vLyB0aW1lIHdpdGhpbiBhIGhvc3QgYnVja2V0LiBXZSBhY2NlcHQgYW4gb3B0aW9uYWwgSVNPIHN0cmluZyBmb3IgdGVzdHMgYnV0XG4vLyBub3JtYWxpemUgdG8gZXBvY2ggbXMgc28gdGhlIG91dHB1dCBpcyB1bmlmb3JtLlxuZXhwb3J0IGNvbnN0IHRzRm9yRmlsZW5hbWUgPSAoaXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgaWYgKCFpc28pIHJldHVybiBTdHJpbmcoRGF0ZS5ub3coKSk7XG4gIGNvbnN0IHQgPSBEYXRlLnBhcnNlKGlzbyk7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUodCkgPyBTdHJpbmcodCkgOiBTdHJpbmcoRGF0ZS5ub3coKSk7XG59O1xuXG4vLyBob3N0LXNsdWc6IHJlcGxhY2UgYC5gIHdpdGggYF9gIChwZXIgcHJvamVjdCBjb252ZW50aW9uIHNvIGZpbGVuYW1lcyBhcmVcbi8vIHNoZWxsLWZyaWVuZGx5IGFuZCBkb24ndCBsb29rIGxpa2UgbXVsdGktZXh0ZW5zaW9uIHBhdGhzIGxpa2UgYGFwcC5waW5jaFxuLy8gZ3JhYi5jb20tLi4uYCksIHN0cmlwIGFueSBvdGhlciBub24td29yZC9oeXBoZW4gY2hhcmFjdGVycywgY2FwIGF0IDQwXG4vLyBjaGFycy4gYGxvY2FsaG9zdDozMDAwYCDihpIgYGxvY2FsaG9zdF8zMDAwYC5cbmV4cG9ydCBjb25zdCBob3N0U2x1ZyA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGxldCBob3N0OiBzdHJpbmc7XG4gIHRyeSB7IGhvc3QgPSBuZXcgVVJMKHVybCkuaG9zdDsgfSBjYXRjaCB7IGhvc3QgPSAndW5rbm93bic7IH1cbiAgcmV0dXJuIGhvc3QucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG59O1xuXG4vLyBGaWxlbmFtZSBsYXlvdXQ6IGA8aG9zdF91bmRlcnNjb3JlZD4tbjxOPi08a2luZD5bLTxleHRyYT5dLTxlcG9jaD4ucG5nYC5cbi8vIEhvc3QgZmlyc3QgbWVhbnMgc2NyZWVuc2hvdHMgaW4gRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy9cbi8vIGdyb3VwIG5hdHVyYWxseSBwZXIgc2l0ZTsgZXBvY2ggYXMgYSB0YWlsIGtleSBnaXZlcyBjaHJvbm9sb2dpY2FsIG9yZGVyXG4vLyBpbnNpZGUgZWFjaCBidWNrZXQuXG5leHBvcnQgY29uc3QgYnVpbGRGaWxlbmFtZSA9IChcbiAga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyxcbiAgdHM6IHN0cmluZyxcbiAgbjogbnVtYmVyLFxuICB1cmw6IHN0cmluZyxcbiAgb3B0czoge2NvdW50PzogbnVtYmVyOyB0cnVuY2F0ZWQ/OiBib29sZWFufSA9IHt9LFxuKTogc3RyaW5nID0+IHtcbiAgY29uc3Qgc3RhbXAgPSB0c0ZvckZpbGVuYW1lKHRzKTtcbiAgY29uc3Qgc2x1ZyA9IGhvc3RTbHVnKHVybCk7XG4gIGlmIChraW5kID09PSAnZWxlbWVudCcpIHJldHVybiBgJHtzbHVnfS1uJHtufS1lbGVtZW50LSR7c3RhbXB9LnBuZ2A7XG4gIGlmIChraW5kID09PSAnZ3JvdXAnKSByZXR1cm4gYCR7c2x1Z30tbiR7bn0tZ3JvdXAke29wdHMuY291bnQgPz8gMH0tJHtzdGFtcH0ucG5nYDtcbiAgLy8gcGFnZVxuICBjb25zdCBzdWZmaXggPSBvcHRzLnRydW5jYXRlZCA/ICdwYWdlLXRydW5jJyA6ICdwYWdlJztcbiAgcmV0dXJuIGAke3NsdWd9LW4ke259LSR7c3VmZml4fS0ke3N0YW1wfS5wbmdgO1xufTtcblxuLy8gZGF0YVVSTCDihpIgQmxvYiB3aXRob3V0IGdvaW5nIHRocm91Z2ggZmV0Y2gvYXRvYiByb3VuZHRyaXBzIHRoYXQgYnJvd3NlcnNcbi8vIGluIHNlcnZpY2Utd29ya2VyIGNvbnRleHQgc29tZXRpbWVzIGJhbGsgYXQuIFBORyBvbmx5LlxuY29uc3QgZGF0YVVybFRvQmxvYiA9IGFzeW5jIChkYXRhVXJsOiBzdHJpbmcpOiBQcm9taXNlPEJsb2I+ID0+IHtcbiAgY29uc3QgciA9IGF3YWl0IGZldGNoKGRhdGFVcmwpO1xuICByZXR1cm4gci5ibG9iKCk7XG59O1xuXG4vLyBEZWNvZGUgYSBQTkcgZGF0YVVSTCBpbnRvIGFuIEltYWdlQml0bWFwIHVzYWJsZSBieSBPZmZzY3JlZW5DYW52YXMuIFdlXG4vLyBjYW4ndCBgbmV3IEltYWdlKClgIGluIGEgc2VydmljZSB3b3JrZXIg4oCUIEltYWdlIGlzIGEgRE9NLW9ubHkgY29uc3RydWN0b3IuXG5jb25zdCBkYXRhVXJsVG9CaXRtYXAgPSBhc3luYyAoZGF0YVVybDogc3RyaW5nKTogUHJvbWlzZTxJbWFnZUJpdG1hcD4gPT4ge1xuICBjb25zdCBibG9iID0gYXdhaXQgZGF0YVVybFRvQmxvYihkYXRhVXJsKTtcbiAgcmV0dXJuIGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xufTtcblxuLy8gRW5jb2RlIGFuIE9mZnNjcmVlbkNhbnZhcyB0byBhIFBORyBibG9iLlxuY29uc3QgY2FudmFzVG9CbG9iID0gYXN5bmMgKGNhbnZhczogT2Zmc2NyZWVuQ2FudmFzKTogUHJvbWlzZTxCbG9iPiA9PlxuICBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcblxuLy8gRG93bnNjYWxlIGEgYml0bWFwIGludG8gYSBQTkcgZGF0YVVSTCB3aXRoIG1heCB3aWR0aCBjYXBwZWQuIFRoZSB0aHVtYm5haWxcbi8vIGlzIHdoYXQgdGhlIHNpZGUgcGFuZWwgcGFpbnRzIGludG8gdGhlIC5wcmV2aWV3IHRpbGUg4oCUIHRoZSBvcmlnaW5hbCBsaXZlc1xuLy8gb25seSBvbiBkaXNrLiBXZSB1c2UgRmlsZVJlYWRlciAod29ya3MgaW4gTVYzIFNXcykgc2luY2UgdGhlIGRhdGFVUkwgaXNcbi8vIHBhc3NlZCBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugd2hlcmUgc2l6ZSBtYXR0ZXJzIGxlc3MuXG5jb25zdCBtYWtlVGh1bWJuYWlsID0gYXN5bmMgKGJpdG1hcDogSW1hZ2VCaXRtYXAsIG1heFdpZHRoID0gMzIwKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgcmF0aW8gPSBiaXRtYXAud2lkdGggPD0gbWF4V2lkdGggPyAxIDogbWF4V2lkdGggLyBiaXRtYXAud2lkdGg7XG4gIGNvbnN0IHcgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC53aWR0aCAqIHJhdGlvKSk7XG4gIGNvbnN0IGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGJpdG1hcC5oZWlnaHQgKiByYXRpbykpO1xuICBjb25zdCBjYW52YXMgPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHcsIGgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICBjdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gJ2hpZ2gnO1xuICBjdHguZHJhd0ltYWdlKGJpdG1hcCwgMCwgMCwgdywgaCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXMuY29udmVydFRvQmxvYih7dHlwZTogJ2ltYWdlL3BuZyd9KTtcbiAgLy8gYXJyYXlCdWZmZXIgKyBidG9hIGF2b2lkcyBhbnkgRmlsZVJlYWRlci1hdmFpbGFiaWxpdHkgY29uY2Vybi5cbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIHJldHVybiBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7YnRvYShiaW5hcnkpfWA7XG59O1xuXG4vLyBQZXItdGFiIHNlcmlhbGl6YXRpb246IGF0IG1vc3Qgb25lIGNhcHR1cmUgaW4gZmxpZ2h0IGF0IGEgdGltZS4gV2l0aG91dCBhXG4vLyBxdWV1ZSwgdGhlIHRocm90dGxpbmcgb24gY2FwdHVyZVZpc2libGVUYWIgKH4yIGNhbGxzL3NlYykgc2hvd3MgdXAgYXNcbi8vIG1pc3Npbmcgc2NyZWVuc2hvdHMgd2hlbiB0aGUgdXNlciBmaXJlcyBzZXZlcmFsIGNhcHR1cmVzIGJhY2stdG8tYmFjay5cbnR5cGUgUXVldWVUYXNrID0gKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmNvbnN0IHRhYlF1ZXVlcyA9IG5ldyBNYXA8bnVtYmVyLCBQcm9taXNlPHZvaWQ+PigpO1xuY29uc3QgZW5xdWV1ZSA9ICh0YWJJZDogbnVtYmVyLCB0YXNrOiBRdWV1ZVRhc2spOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgcHJldiA9IHRhYlF1ZXVlcy5nZXQodGFiSWQpID8/IFByb21pc2UucmVzb2x2ZSgpO1xuICBjb25zdCBuZXh0ID0gcHJldi50aGVuKCgpID0+IHRhc2soKSkuY2F0Y2goKGUpID0+IHsgY29uc29sZS53YXJuKExPRywgJ3F1ZXVlIHRhc2sgZmFpbGVkJywgZSk7IH0pO1xuICB0YWJRdWV1ZXMuc2V0KHRhYklkLCBuZXh0KTtcbiAgcmV0dXJuIG5leHQ7XG59O1xuXG4vLyBPbmUtc2hvdCBDUyByb3VuZC10cmlwOiBhc2sgdGhlIGNvbnRlbnQgc2NyaXB0IHRvIGhpZGUgaXRzIG92ZXJsYXkgdGhlblxuLy8gd2FpdCBmb3IgYWNrLiBXZSB1c2Ugc2VuZE1lc3NhZ2Ugd2l0aCBhIHRpbWVvdXQgc28gYSBDUyB0aGF0J3Mgc3R1Y2sgb3Jcbi8vIG5vdCBsb2FkZWQgY2FuJ3Qgd2VkZ2UgdGhlIHF1ZXVlLlxuY29uc3QgdGVsbENzID0gYXN5bmMgPFQgPSB1bmtub3duPih0YWJJZDogbnVtYmVyLCBwYXlsb2FkOiBhbnksIHRpbWVvdXRNcyA9IDYwMCk6IFByb21pc2U8VCB8IG51bGw+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFQgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgZmluaXNoID0gKHY6IFQgfCBudWxsKTogdm9pZCA9PiB7IGlmICghZG9uZSkgeyBkb25lID0gdHJ1ZTsgcmVzb2x2ZSh2KTsgfSB9O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gZmluaXNoKG51bGwpLCB0aW1lb3V0TXMpO1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgcGcocGF5bG9hZCksIChyZXBseSkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7IGZpbmlzaChudWxsKTsgcmV0dXJuOyB9XG4gICAgICAgIGZpbmlzaCgocmVwbHkgPz8gbnVsbCkgYXMgVCB8IG51bGwpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7IGZpbmlzaChudWxsKTsgfVxuICB9KTtcbn07XG5cbi8vIFJ1biBhIGZ1bmN0aW9uIGluc2lkZSB0aGUgcGFnZSdzIG1haW4gd29ybGQgKG9yIGlzb2xhdGVkLCBkb2Vzbid0IG1hdHRlclxuLy8gaGVyZSBiZWNhdXNlIHdlIG9ubHkgcmVhZCBsYXlvdXQgbnVtYmVycykuIGFyZ3MgaXMgcGFzc2VkIHBvc2l0aW9uYWxseS5cbmNvbnN0IHJ1bkluUGFnZSA9IGFzeW5jIDxUPihcbiAgdGFiSWQ6IG51bWJlcixcbiAgZnVuYzogKC4uLmFyZ3M6IGFueVtdKSA9PiBULFxuICBhcmdzOiBhbnlbXSA9IFtdLFxuKTogUHJvbWlzZTxUIHwgbnVsbD4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7dGFiSWR9LFxuICAgICAgZnVuYzogZnVuYyBhcyBhbnksXG4gICAgICBhcmdzLFxuICAgIH0pO1xuICAgIHJldHVybiAocmVzdWx0cz8uWzBdPy5yZXN1bHQgPz8gbnVsbCkgYXMgVCB8IG51bGw7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAncnVuSW5QYWdlJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbi8vIENvbXB1dGUgdW5pb24gYmJveCBvZiBzZWxlY3RvcnMgSU5TSURFIHRoZSBwYWdlLCBzY3JvbGwgaXQgaW50byB2aWV3LCBhbmRcbi8vIHJldHVybiB0aGUgYmJveCArIGRwciBmb3IgY3JvcHBpbmcuIHBhZGRpbmcgaXMgYXBwbGllZCBzeW1tZXRyaWNhbGx5LlxudHlwZSBCYm94UmVzdWx0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7IHZ3OiBudW1iZXI7IHZoOiBudW1iZXJ9O1xuY29uc3QgY29tcHV0ZUFuZFNjcm9sbCA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgc2VsZWN0b3JzOiBzdHJpbmdbXSxcbiAgcGFkZGluZzogbnVtYmVyLFxuKTogUHJvbWlzZTxCYm94UmVzdWx0IHwgbnVsbD4gPT4ge1xuICByZXR1cm4gcnVuSW5QYWdlPEJib3hSZXN1bHQgfCBudWxsPih0YWJJZCwgKHNlbHM6IHN0cmluZ1tdLCBwYWQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGVscyA9IHNlbHMubWFwKChzKSA9PiB7XG4gICAgICB0cnkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKTsgfSBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gICAgfSkuZmlsdGVyKChlKTogZSBpcyBFbGVtZW50ID0+IEJvb2xlYW4oZSkpO1xuICAgIGlmICghZWxzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgLy8gU2Nyb2xsIHVuaW9uIG1pZHBvaW50IGludG8gdmlldyBmaXJzdDsgc29tZSBwYWdlcyBoYXZlIGxhenkgaW1hZ2VzXG4gICAgLy8gdGhhdCB3b24ndCBwYWludCB1bnRpbCB0aGV5J3JlIG5lYXIgdGhlIHZpZXdwb3J0LlxuICAgIGNvbnN0IHJlY3RzQmVmb3JlID0gZWxzLm1hcCgoZSkgPT4gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgY29uc3QgbWluWEFicyA9IE1hdGgubWluKC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5sZWZ0KSkgKyB3aW5kb3cuc2Nyb2xsWDtcbiAgICBjb25zdCBtaW5ZQWJzID0gTWF0aC5taW4oLi4ucmVjdHNCZWZvcmUubWFwKChyKSA9PiByLnRvcCkpICsgd2luZG93LnNjcm9sbFk7XG4gICAgY29uc3QgbWF4WEFicyA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5yaWdodCkpICsgd2luZG93LnNjcm9sbFg7XG4gICAgY29uc3QgbWF4WUFicyA9IE1hdGgubWF4KC4uLnJlY3RzQmVmb3JlLm1hcCgocikgPT4gci5ib3R0b20pKSArIHdpbmRvdy5zY3JvbGxZO1xuICAgIGNvbnN0IGN4ID0gKG1pblhBYnMgKyBtYXhYQWJzKSAvIDI7XG4gICAgY29uc3QgY3kgPSAobWluWUFicyArIG1heFlBYnMpIC8gMjtcbiAgICBjb25zdCB0YXJnZXRYID0gTWF0aC5tYXgoMCwgY3ggLSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIpO1xuICAgIGNvbnN0IHRhcmdldFkgPSBNYXRoLm1heCgwLCBjeSAtIHdpbmRvdy5pbm5lckhlaWdodCAvIDIpO1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogdGFyZ2V0WCwgdG9wOiB0YXJnZXRZLCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG5cbiAgICAvLyBSZWNvbXB1dGUgYmJveGVzIGFmdGVyIHNjcm9sbC5cbiAgICBjb25zdCByZWN0cyA9IGVscy5tYXAoKGUpID0+IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIubGVmdCkpIC0gcGFkO1xuICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbiguLi5yZWN0cy5tYXAoKHIpID0+IHIudG9wKSkgLSBwYWQ7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLnJlY3RzLm1hcCgocikgPT4gci5yaWdodCkpICsgcGFkO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5yZWN0cy5tYXAoKHIpID0+IHIuYm90dG9tKSkgKyBwYWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1pblgsXG4gICAgICB5OiBtaW5ZLFxuICAgICAgdzogbWF4WCAtIG1pblgsXG4gICAgICBoOiBtYXhZIC0gbWluWSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHZ3OiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHZoOiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgfTtcbiAgfSwgW3NlbGVjdG9ycywgcGFkZGluZ10pO1xufTtcblxuLy8gT25lLWZyYW1lIHlpZWxkIGluc2lkZSB0aGUgcGFnZSBzbyBhbnkgcG9zdC1zY3JvbGwgbGF5b3V0IHNldHRsZXMuIFdlIHBpblxuLy8gdG8gdHdvIHJBRnMgdG8gYmUgY29uc2VydmF0aXZlIOKAlCBwYWdlcyB3aXRoIHN0aWNreSBoZWFkZXJzIHNvbWV0aW1lcyBuZWVkXG4vLyB0aGUgc2Vjb25kIGZyYW1lIHRvIHJlcGFpbnQgdGhlIGhlYWRlciBhdCBpdHMgbmV3IG9mZnNldC5cbmNvbnN0IHlpZWxkUmFmID0gYXN5bmMgKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoKSA9PlxuICAgIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXNvbHZlKCkpKSksXG4gICk7XG59O1xuXG4vLyBSZXN0b3JlIHRoZSBwYWdlIHNjcm9sbCBwb3NpdGlvbiBhZnRlciBzdGl0Y2hpbmcuIFRoZSBvcmlnaW5hbCBwb3NpdGlvbnNcbi8vIGFyZSBwYXNzZWQgYmFjayBmcm9tIHRoZSBzdGl0Y2ggbG9vcC5cbmNvbnN0IHJlc3RvcmVTY3JvbGwgPSBhc3luYyAodGFiSWQ6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoc3g6IG51bWJlciwgc3k6IG51bWJlcikgPT4ge1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7bGVmdDogc3gsIHRvcDogc3ksIGJlaGF2aW9yOiAnaW5zdGFudCcgYXMgU2Nyb2xsQmVoYXZpb3J9KTtcbiAgfSwgW3gsIHldKTtcbn07XG5cbmNvbnN0IFBBR0VfQ0hVTktfTElNSVQgPSA4O1xuY29uc3QgQ0FOVkFTX1BJWEVMX0xJTUlUID0gMTYzODQ7IC8vIE9mZnNjcmVlbkNhbnZhcyBzYWZldHkgY2FwXG5cbi8vIFBhZ2UgKGZ1bGwtZG9jdW1lbnQpIHNob3QuIExvb3BzIGNhcHR1cmVWaXNpYmxlVGFiIHdoaWxlIHNjcm9sbGluZyBieVxuLy8gdmlld3BvcnQtaGVpZ2h0IGNodW5rczsgc3RvcHMgYXQgY2h1bmsgY291bnQsIHBpeGVsIGNhcCwgb3Igc2Nyb2xsSGVpZ2h0LlxuY29uc3Qgc3RpdGNoUGFnZSA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsPiA9PiB7XG4gIC8vIFNuYXBzaG90IHNjcm9sbCBnZW9tZXRyeSB1cCBmcm9udC5cbiAgY29uc3QgZ2VvbSA9IGF3YWl0IHJ1bkluUGFnZTx7dnc6IG51bWJlcjsgdmg6IG51bWJlcjsgc3c6IG51bWJlcjsgc2g6IG51bWJlcjsgZHByOiBudW1iZXI7IHN4OiBudW1iZXI7IHN5OiBudW1iZXJ9PihcbiAgICB0YWJJZCxcbiAgICAoKSA9PiAoe1xuICAgICAgdnc6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgdmg6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIHN3OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGgsIGRvY3VtZW50LmJvZHk/LnNjcm9sbFdpZHRoID8/IDApLFxuICAgICAgc2g6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmJvZHk/LnNjcm9sbEhlaWdodCA/PyAwKSxcbiAgICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICAgIHN4OiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgIHN5OiB3aW5kb3cuc2Nyb2xsWSxcbiAgICB9KSxcbiAgKTtcbiAgaWYgKCFnZW9tKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkcHIgPSBnZW9tLmRwcjtcbiAgY29uc3QgdG90YWxIID0gZ2VvbS5zaDtcbiAgY29uc3QgdG90YWxIcHggPSBNYXRoLnJvdW5kKHRvdGFsSCAqIGRwcik7XG4gIGNvbnN0IHdpZHRoUHggPSBNYXRoLnJvdW5kKGdlb20udncgKiBkcHIpO1xuXG4gIC8vIElmIHRoZSBwYWdlIGlzIHNob3J0IGVub3VnaCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LCBzaW5nbGUgc2hvdC5cbiAgbGV0IGNodW5rcyA9IDA7XG4gIGxldCB5ID0gMDtcbiAgbGV0IHN0aXRjaGVkSHB4ID0gMDtcbiAgbGV0IHRydW5jYXRlZCA9IGZhbHNlO1xuXG4gIC8vIEFsbG9jYXRlIHRoZSBjYW52YXMgYXQgdGhlIGNvbnNlcnZhdGl2ZSBmaW5hbCBzaXplOyB3ZSdsbCB0cmltIGxhdGVyIGlmXG4gIC8vIHdlIHN0b3AgZWFybHkuIHdpZHRoIGlzIGZpeGVkOyBoZWlnaHQgZ3Jvd3MgdXAgdG8gbWluKHRvdGFsSHB4LCBjYXApLlxuICBjb25zdCB0YXJnZXRIcHggPSBNYXRoLm1pbih0b3RhbEhweCwgQ0FOVkFTX1BJWEVMX0xJTUlUKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aFB4LCB0YXJnZXRIcHgpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG5cbiAgd2hpbGUgKHkgPCB0b3RhbEgpIHtcbiAgICBpZiAoY2h1bmtzID49IFBBR0VfQ0hVTktfTElNSVQpIHsgdHJ1bmNhdGVkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICBpZiAoc3RpdGNoZWRIcHggPj0gQ0FOVkFTX1BJWEVMX0xJTUlUKSB7IHRydW5jYXRlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgYXdhaXQgcnVuSW5QYWdlPHZvaWQ+KHRhYklkLCAoeXk6IG51bWJlcikgPT4ge1xuICAgICAgd2luZG93LnNjcm9sbFRvKHtsZWZ0OiAwLCB0b3A6IHl5LCBiZWhhdmlvcjogJ2luc3RhbnQnIGFzIFNjcm9sbEJlaGF2aW9yfSk7XG4gICAgfSwgW3ldKTtcbiAgICBhd2FpdCB5aWVsZFJhZih0YWJJZCk7XG4gICAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgICB0cnkge1xuICAgICAgZGF0YVVybCA9IGF3YWl0IGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdjYXB0dXJlVmlzaWJsZVRhYiBwYWdlIGNodW5rIGZhaWxlZCcsIGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IGJtID0gYXdhaXQgZGF0YVVybFRvQml0bWFwKGRhdGFVcmwpO1xuICAgIC8vIERldGVybWluZSBob3cgbXVjaCBvZiBUSElTIGNodW5rIHRvIGRyYXcuIFRoZSBsYXN0IGNodW5rIHVzdWFsbHlcbiAgICAvLyBvdmVybGFwcyB0aGUgcHJldmlvdXMgb25lIChiZWNhdXNlIHRvdGFsSCBpcyBub3QgYSB2aWV3cG9ydCBtdWx0aXBsZSk7XG4gICAgLy8gZHJhd2luZyB0aGUgZnVsbCBiaXRtYXAgd291bGQgZHVwbGljYXRlIHBpeGVscy4gU28gd2UgY3JvcCBieSB0aGVcbiAgICAvLyByZW1haW5kZXIgb2YgdGhlIHBhZ2UgaGVpZ2h0IHdoZW4gb24gdGhlIHRhaWwuXG4gICAgY29uc3QgcmVtYWluaW5nUHggPSBNYXRoLnJvdW5kKCh0b3RhbEggLSB5KSAqIGRwcik7XG4gICAgY29uc3QgZHJhd1NyY0ggPSBNYXRoLm1pbihibS5oZWlnaHQsIHJlbWFpbmluZ1B4KTtcbiAgICBjb25zdCBkcmF3RGVzdEggPSBNYXRoLm1pbih0YXJnZXRIcHggLSBzdGl0Y2hlZEhweCwgZHJhd1NyY0gpO1xuICAgIGlmIChkcmF3RGVzdEggPD0gMCkgeyB0cnVuY2F0ZWQgPSB0cnVlOyBicmVhazsgfVxuICAgIGN0eC5kcmF3SW1hZ2UoYm0sIDAsIDAsIGJtLndpZHRoLCBkcmF3RGVzdEgsIDAsIHN0aXRjaGVkSHB4LCBibS53aWR0aCwgZHJhd0Rlc3RIKTtcbiAgICBzdGl0Y2hlZEhweCArPSBkcmF3RGVzdEg7XG4gICAgY2h1bmtzKys7XG4gICAgeSArPSBnZW9tLnZoO1xuICAgIGJtLmNsb3NlPy4oKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgc2Nyb2xsLlxuICBhd2FpdCByZXN0b3JlU2Nyb2xsKHRhYklkLCBnZW9tLnN4LCBnZW9tLnN5KTtcblxuICAvLyBUcmltIGNhbnZhcyB0byBhY3R1YWwgc3RpdGNoZWQgaGVpZ2h0IGlmIHdlIHN0b3BwZWQgYmVmb3JlIHRhcmdldEhweC5cbiAgbGV0IG91dENhbnZhcyA9IGNhbnZhcztcbiAgaWYgKHN0aXRjaGVkSHB4IDwgdGFyZ2V0SHB4KSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGhQeCwgTWF0aC5tYXgoMSwgc3RpdGNoZWRIcHgpKTtcbiAgICBjb25zdCB0Y3R4ID0gdHJpbW1lZC5nZXRDb250ZXh0KCcyZCcpITtcbiAgICB0Y3R4LmRyYXdJbWFnZShjYW52YXMsIDAsIDApO1xuICAgIG91dENhbnZhcyA9IHRyaW1tZWQ7XG4gIH1cbiAgY29uc3QgYmxvYiA9IGF3YWl0IGNhbnZhc1RvQmxvYihvdXRDYW52YXMpO1xuICBjb25zdCBiaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChibG9iKTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRydW5jYXRlZH07XG59O1xuXG4vLyBFbGVtZW50L2dyb3VwIHNob3Q6IGhpZGUgb3ZlcmxheXMsIGNhcHR1cmUgdmlld3BvcnQsIGNyb3AgaW4gY2FudmFzLlxuY29uc3Qgc2hvdEVsZW1lbnRDb21tb24gPSBhc3luYyAoXG4gIHRhYklkOiBudW1iZXIsXG4gIHdpbmRvd0lkOiBudW1iZXIsXG4gIHNlbGVjdG9yczogc3RyaW5nW10sXG4gIHBhZGRpbmc6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ119IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgLy8gSXRlbSAxNyAoZmxhc2hpbmcpOiBoaWRlICsgZnJlZXplIG92ZXJsYXlzIEJFRk9SRSB3ZSBzY3JvbGwgdGhlIHBhZ2UgdG9cbiAgLy8gZnJhbWUgdGhlIGNhcHR1cmUuIFRoZSBvbGQgb3JkZXIgc2Nyb2xsZWQgZmlyc3QsIHNvIHRoZSBjb250ZW50IHNjcmlwdCdzXG4gIC8vIHJpbmcgckFGIGxvb3BzIGNoYXNlZCB0aGUgbmV3IHNjcm9sbCBvZmZzZXQgKGEgdmlzaWJsZSBqdW1wKSBiZWZvcmUgdGhleVxuICAvLyB3ZXJlIGhpZGRlbiwgYW5kIGEgZ3JvdXBlZCBjYXB0dXJlJ3MgbWFueSByaW5ncyBhbXBsaWZpZWQgdGhlIGZsaWNrZXIuXG4gIC8vIEhpZGluZyBmaXJzdCBtZWFucyB0aGUgd2hvbGUgc2Nyb2xs4oaSeWllbGTihpJjYXB0dXJl4oaScmVzdG9yZSB3aW5kb3cgaGFwcGVuc1xuICAvLyB3aXRoIHRoZSBvdmVybGF5IGZyb3plbiBhbmQgb3V0IG9mIGxheW91dCDigJQgbm8gb24tc2NyZWVuIGZsYXNoLlxuICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnaGlkZS1vdmVybGF5cyd9KTtcbiAgbGV0IGRhdGFVcmw6IHN0cmluZztcbiAgbGV0IGJib3g6IEJib3hSZXN1bHQgfCBudWxsID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBiYm94ID0gYXdhaXQgY29tcHV0ZUFuZFNjcm9sbCh0YWJJZCwgc2VsZWN0b3JzLCBwYWRkaW5nKTtcbiAgICBpZiAoIWJib3gpIHJldHVybiBudWxsO1xuICAgIGF3YWl0IHlpZWxkUmFmKHRhYklkKTtcbiAgICBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIod2luZG93SWQsIHtmb3JtYXQ6ICdwbmcnfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oTE9HLCAnY2FwdHVyZVZpc2libGVUYWIgZmFpbGVkJywgZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfSk7XG4gIH1cblxuICBjb25zdCBibSA9IGF3YWl0IGRhdGFVcmxUb0JpdG1hcChkYXRhVXJsKTtcbiAgLy8gQ29udmVydCBDU1MtcGl4ZWwgYmJveCDihpIgZGV2aWNlLXBpeGVsIGJib3g7IGNsYW1wIHRvIGJpdG1hcCBib3VuZHMgc29cbiAgLy8gYSBwYXJ0aWFsbHkgb2ZmLXNjcmVlbiBlbGVtZW50IGRvZXNuJ3QgY3Jhc2ggZHJhd0ltYWdlLlxuICBjb25zdCBzeCA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoYmJveC54ICogYmJveC5kcHIpKTtcbiAgY29uc3Qgc3kgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGJib3gueSAqIGJib3guZHByKSk7XG4gIGNvbnN0IHN3ID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oYm0ud2lkdGggLSBzeCwgTWF0aC5yb3VuZChiYm94LncgKiBiYm94LmRwcikpKTtcbiAgY29uc3Qgc2ggPSBNYXRoLm1heCgxLCBNYXRoLm1pbihibS5oZWlnaHQgLSBzeSwgTWF0aC5yb3VuZChiYm94LmggKiBiYm94LmRwcikpKTtcbiAgY29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyhzdywgc2gpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gIGN0eC5kcmF3SW1hZ2UoYm0sIHN4LCBzeSwgc3csIHNoLCAwLCAwLCBzdywgc2gpO1xuICBibS5jbG9zZT8uKCk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCBjYW52YXNUb0Jsb2IoY2FudmFzKTtcbiAgY29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XG4gIC8vIEJ1ZyAjMyBmcm9tIHRoZSBleHBvcnQgcm9hc3Q6IHN1cmZhY2UgY3JvcCBtZXRhZGF0YSBzbyByZWNlaXZlcnNcbiAgLy8gY2FuIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZCB0aGUgb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlcy5cbiAgLy8gY3NzUmVjdCA9IHByZS1EUFIgQ1NTIHBpeGVsIHJlY3Qgb2YgdGhlIGNhcHR1cmVkIHJlZ2lvbi5cbiAgLy8gZGV2aWNlUHhSZWN0ID0gcG9zdC1EUFIgcGl4ZWwgcmVjdCBpbnNpZGUgdGhlIHNvdXJjZSBiaXRtYXAuXG4gIC8vIGltYWdlU2l6ZSA9IGRpbWVuc2lvbnMgb2YgdGhlIHByb2R1Y2VkIFBORy5cbiAgLy8gZHByID0gdGhlIGNvbnZlcnNpb24gZmFjdG9yLlxuICBjb25zdCBjcm9wTWV0YTogU2hvdFJlcGx5Wydjcm9wJ10gPSB7XG4gICAgY3NzUmVjdDoge3g6IGJib3gueCwgeTogYmJveC55LCB3OiBiYm94LncsIGg6IGJib3guaH0sXG4gICAgZGV2aWNlUHhSZWN0OiB7eDogc3gsIHk6IHN5LCB3OiBzdywgaDogc2h9LFxuICAgIGltYWdlU2l6ZToge3c6IHN3LCBoOiBzaH0sXG4gICAgZHByOiBiYm94LmRwcixcbiAgICBwYWRkaW5nLFxuICAgIHNlbGVjdG9ycyxcbiAgfTtcbiAgcmV0dXJuIHtibG9iLCBiaXRtYXAsIHRhYlVybCwgY3JvcE1ldGF9O1xufTtcblxuLy8gUGFnZS1vbmx5IHBhdGguIEhpZGVzIG92ZXJsYXlzLCBzdGl0Y2hlcywgcmVzdG9yZXMuXG5jb25zdCBzaG90UGFnZUNvbW1vbiA9IGFzeW5jIChcbiAgdGFiSWQ6IG51bWJlcixcbiAgd2luZG93SWQ6IG51bWJlcixcbik6IFByb21pc2U8e2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRhYlVybDogc3RyaW5nOyB0cnVuY2F0ZWQ6IGJvb2xlYW59IHwgbnVsbD4gPT4ge1xuICBjb25zdCB0YWIgPSBhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpO1xuICBjb25zdCB0YWJVcmwgPSB0YWI/LnVybCA/PyAnJztcbiAgYXdhaXQgdGVsbENzKHRhYklkLCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfSk7XG4gIGxldCBzdGl0Y2hlZDoge2Jsb2I6IEJsb2I7IGJpdG1hcDogSW1hZ2VCaXRtYXA7IHRydW5jYXRlZDogYm9vbGVhbn0gfCBudWxsID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBzdGl0Y2hlZCA9IGF3YWl0IHN0aXRjaFBhZ2UodGFiSWQsIHdpbmRvd0lkKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCB0ZWxsQ3ModGFiSWQsIHtraW5kOiAnc2hvdy1vdmVybGF5cyd9KTtcbiAgfVxuICBpZiAoIXN0aXRjaGVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsuLi5zdGl0Y2hlZCwgdGFiVXJsfTtcbn07XG5cbi8vIFNhdmUgdGhlIGJsb2IgYXMgYSBkb3dubG9hZCB1bmRlciAucGluY2hncmFiLzx3b3Jrc3BhY2U+LzxzdWJkaXI+Ly5cbi8vXG4vLyBNVjMgc2VydmljZSB3b3JrZXJzIERPIE5PVCBoYXZlIFVSTC5jcmVhdGVPYmplY3RVUkwg4oCUIGNhbGxpbmcgaXQgdGhyb3dzXG4vLyBcIlVSTC5jcmVhdGVPYmplY3RVUkwgaXMgbm90IGEgZnVuY3Rpb25cIiAodmVyaWZpZWQgbGl2ZSBpbiBleHRlbnNpb24uc3BlYykuXG4vLyBXZSBiYXNlNjQtZW5jb2RlIHRoZSBibG9iIGludG8gYSBkYXRhIFVSTCBpbnN0ZWFkLiBUcmFkZW9mZjogdGhlIGRhdGFcbi8vIFVSTCBpcyB+MzMlIGxhcmdlciB0aGFuIHJhdyBieXRlcywgYW5kIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgaGFzIGFcbi8vIGRhdGEtVVJMIHNpemUgbGltaXQgc29tZXdoZXJlIGFyb3VuZCAzMiBNQjsgZm9yIHR5cGljYWwgd29ya3NwYWNlXG4vLyBleHBvcnRzIChzdWItTUIgSlNPTkwgKyBsb3ctTUIgWklQcykgdGhpcyBpcyB3ZWxsIHVuZGVyIHRoZSBsaW1pdC5cbnR5cGUgU2F2ZWRGaWxlID0ge1xuICByZWxQYXRoOiBzdHJpbmc7XG4gIGFic1BhdGg6IHN0cmluZztcbiAgY29weVBhdGg6IHN0cmluZztcbiAgdGVtcFBhdGg6IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiBjaHJvbWUuZG93bmxvYWRzLkRvd25sb2FkSXRlbVsnc3RhdGUnXTtcbn07XG5cbmNvbnN0IGlzUGxheXdyaWdodEFydGlmYWN0UGF0aCA9IChwYXRoOiBzdHJpbmcpOiBib29sZWFuID0+XG4gIC8oPzpefFtcXFxcL10pKD86cGxheXdyaWdodC1hcnRpZmFjdHN8cGluY2hncmFiLWRsKS1bXlxcXFwvXStbXFxcXC9dWzAtOWEtZi1dezh9LVswLTlhLWYtXXs0fS1bMC05YS1mLV17NH0tWzAtOWEtZi1dezR9LVswLTlhLWYtXXsxMn0kL2kudGVzdChwYXRoKTtcblxuY29uc3QgYmxvYlRvRGF0YVVybCA9IGFzeW5jIChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgYnVmID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gIC8vIEJ1aWxkIGJhc2U2NCBpbiAzMiBLaUIgY2h1bmtzIHNvIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkgZG9lc24ndFxuICAvLyBvdmVyZmxvdyB0aGUgY2FsbCBzdGFjayBvbiBsYXJnZSBpbnB1dHMuXG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgY2h1bmsgPSAweDgwXzAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSBjaHVuaykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LmZyb20oYnl0ZXMuc3ViYXJyYXkoaSwgaSArIGNodW5rKSkpO1xuICB9XG4gIGNvbnN0IG1pbWUgPSBibG9iLnR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIHJldHVybiBgZGF0YToke21pbWV9O2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuY29uc3Qgc2F2ZURvd25sb2FkID0gYXN5bmMgKFxuICBibG9iOiBCbG9iLFxuICB3b3Jrc3BhY2U6IHN0cmluZyxcbiAgZmlsZW5hbWU6IHN0cmluZyxcbiAgc3ViZGlyID0gJ3NjcmVlbnNob3RzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IHJlbFBhdGggPSBzdWJkaXIgPyBgJHtzdWJkaXJ9LyR7ZmlsZW5hbWV9YCA6IGZpbGVuYW1lO1xuICBjb25zdCBmdWxsUGF0aCA9IGBwaW5jaGdyYWIvJHt3b3Jrc3BhY2V9LyR7cmVsUGF0aH1gO1xuICBjb25zb2xlLmxvZyhMT0csICdzYXZlRG93bmxvYWQgc3RhcnQnLCB7ZnVsbFBhdGgsIG1pbWU6IGJsb2IudHlwZSwgc2l6ZTogYmxvYi5zaXplfSk7XG4gIGNvbnN0IHVybCA9IGF3YWl0IGJsb2JUb0RhdGFVcmwoYmxvYik7XG4gIGNvbnN0IGRvd25sb2FkSWQgPSBhd2FpdCBuZXcgUHJvbWlzZTxudW1iZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkKFxuICAgICAge3VybCwgZmlsZW5hbWU6IGZ1bGxQYXRoLCBjb25mbGljdEFjdGlvbjogJ292ZXJ3cml0ZSd9LFxuICAgICAgKGlkKSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgbGFzdEVycm9yOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSA/PyAnZG93bmxvYWQgZmFpbGVkJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCByZXR1cm5lZCBubyBpZCcpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2Rvd25sb2FkIHJldHVybmVkIG5vIGlkJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGlkKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKExPRywgJ2Nocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgYWNjZXB0ZWQnLCB7aWQ6IGRvd25sb2FkSWQsIGZ1bGxQYXRofSk7XG4gIC8vIFJlc29sdmUgdGhlIE9TLWFic29sdXRlIHBhdGggYW5kIGRvIG5vdCByZXBvcnQgc3VjY2VzcyB1bnRpbCBDaHJvbWUgc2F5c1xuICAvLyB0aGUgZG93bmxvYWQgY29tcGxldGVkLiBgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZGAgb25seSBtZWFucyBcImFjY2VwdGVkXCI7XG4gIC8vIGRpc2stZnVsbCwgcGVybWlzc2lvbiwgb3IgaW50ZXJydXB0ZWQgd3JpdGVzIHN1cmZhY2UgbGF0ZXIgdGhyb3VnaFxuICAvLyBkb3dubG9hZHMuc2VhcmNoLlxuICBsZXQgYWJzUGF0aCA9IGAke3dvcmtzcGFjZX0vJHtyZWxQYXRofWA7XG4gIGxldCBkb3dubG9hZFN0YXRlOiBjaHJvbWUuZG93bmxvYWRzLkRvd25sb2FkSXRlbVsnc3RhdGUnXSB8IHVuZGVmaW5lZDtcbiAgbGV0IGludGVycnVwdGVkRXJyb3IgPSAnJztcbiAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCAxMDA7IGF0dGVtcHQrKykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IGNocm9tZS5kb3dubG9hZHMuc2VhcmNoKHtpZDogZG93bmxvYWRJZH0pO1xuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zPy5bMF07XG4gICAgICBpZiAoaXRlbT8uZmlsZW5hbWUpIGFic1BhdGggPSBpdGVtLmZpbGVuYW1lO1xuICAgICAgZG93bmxvYWRTdGF0ZSA9IGl0ZW0/LnN0YXRlO1xuICAgICAgaWYgKGl0ZW0/LnN0YXRlID09PSAnaW50ZXJydXB0ZWQnKSB7XG4gICAgICAgIGludGVycnVwdGVkRXJyb3IgPSBgZG93bmxvYWQgaW50ZXJydXB0ZWQke2l0ZW0uZXJyb3IgPyBgOiAke2l0ZW0uZXJyb3J9YCA6ICcnfWA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0/LnN0YXRlID09PSAnY29tcGxldGUnICYmIGl0ZW0uZmlsZW5hbWUpIGJyZWFrO1xuICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy5zZWFyY2ggdGhyZXc6JywgZSk7IH1cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAxMDApKTtcbiAgfVxuICBpZiAoaW50ZXJydXB0ZWRFcnJvcikgdGhyb3cgbmV3IEVycm9yKGludGVycnVwdGVkRXJyb3IpO1xuICBpZiAoZG93bmxvYWRTdGF0ZSAhPT0gJ2NvbXBsZXRlJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgZG93bmxvYWQgZGlkIG5vdCBjb21wbGV0ZSR7ZG93bmxvYWRTdGF0ZSA/IGAgKHN0YXRlOiAke2Rvd25sb2FkU3RhdGV9KWAgOiAnJ31gKTtcbiAgfVxuICBjb25zdCB0ZW1wUGF0aCA9IGlzUGxheXdyaWdodEFydGlmYWN0UGF0aChhYnNQYXRoKTtcbiAgLy8gUGxheXdyaWdodCByZXdyaXRlcyBDaHJvbWUgZG93bmxvYWRzIHRvIGV4dGVuc2lvbmxlc3MgVVVJRCBmaWxlcyB1bmRlclxuICAvLyAvdG1wL3BsYXl3cmlnaHQtYXJ0aWZhY3RzLSo7IGNvcHlpbmcgdGhhdCB0byB0aGUgdXNlciBpcyBjb25mdXNpbmcgYW5kXG4gIC8vIG9mdGVuIHN0YWxlLiBLZWVwIGl0IGluIGFic1BhdGggZm9yIHRlc3RzL2RlYnVnZ2luZywgYnV0IGV4cG9zZSB0aGVcbiAgLy8gaW50ZW5kZWQgYnJvd3NlciBkb3dubG9hZCB0YXJnZXQgZm9yIHRoZSBzaWRlIHBhbmVsJ3MgY2xpcGJvYXJkIGFjdGlvbi5cbiAgY29uc3QgY29weVBhdGggPSB0ZW1wUGF0aCA/IGB+L0Rvd25sb2Fkcy8ke2Z1bGxQYXRofWAgOiBhYnNQYXRoO1xuICBjb25zb2xlLmxvZyhMT0csICdzYXZlRG93bmxvYWQgcmV0dXJuaW5nJywge3JlbFBhdGgsIGFic1BhdGgsIGNvcHlQYXRoLCB0ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZX0pO1xuICByZXR1cm4ge3JlbFBhdGg6IGAke3dvcmtzcGFjZX0vJHtyZWxQYXRofWAsIGFic1BhdGgsIGNvcHlQYXRoLCB0ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZX07XG59O1xuXG5jb25zdCBzYXZlVGV4dERvd25sb2FkID0gYXN5bmMgKFxuICB0ZXh0OiBzdHJpbmcsXG4gIHdvcmtzcGFjZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuICBtaW1lOiBzdHJpbmcsXG4gIHN1YmRpciA9ICdleHBvcnRzJyxcbik6IFByb21pc2U8U2F2ZWRGaWxlPiA9PiB7XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHt0eXBlOiBtaW1lfSk7XG4gIHJldHVybiBzYXZlRG93bmxvYWQoYmxvYiwgd29ya3NwYWNlLCBmaWxlbmFtZSwgc3ViZGlyKTtcbn07XG5cbmNvbnN0IHNhdmVCeXRlc0Rvd25sb2FkID0gYXN5bmMgKFxuICBieXRlczogVWludDhBcnJheSxcbiAgd29ya3NwYWNlOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIG1pbWU6IHN0cmluZyxcbiAgc3ViZGlyID0gJ2V4cG9ydHMnLFxuKTogUHJvbWlzZTxTYXZlZEZpbGU+ID0+IHtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtieXRlcyBhcyB1bmtub3duIGFzIEJsb2JQYXJ0XSwge3R5cGU6IG1pbWV9KTtcbiAgcmV0dXJuIHNhdmVEb3dubG9hZChibG9iLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBzdWJkaXIpO1xufTtcblxuLy8g4pSA4pSA4pSAIFNlcnZpY2UgcmVxdWVzdHMgKyByZWxheSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnOiBQZ0VudmVsb3BlPEFueU1lc3NhZ2U+IHwgYW55LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChtc2cua2luZCA9PT0gJ2NhcHR1cmUtc2NyZWVuc2hvdCcpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gbXNnLnRhYklkID8gW2F3YWl0IGNocm9tZS50YWJzLmdldChtc2cudGFiSWQpXVxuICAgICAgICAgIDogYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBjb25zdCB0YWIgPSB0YWJzWzBdO1xuICAgICAgICBpZiAoIXRhYj8ud2luZG93SWQpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogJ25vIGFjdGl2ZSB0YWInfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIodGFiLndpbmRvd0lkLCB7Zm9ybWF0OiAncG5nJ30pO1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe2RhdGFVcmx9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pOyB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnLmtpbmQgPT09ICdzd2l0Y2gtdG8tdGFiJykge1xuICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7dXJsOiBtc2cudXJsfSk7XG4gICAgICAgIGlmICh0YWJzLmxlbmd0aCAmJiB0YWJzWzBdPy5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMudXBkYXRlKHRhYnNbMF0uaWQsIHthY3RpdmU6IHRydWV9KTtcbiAgICAgICAgICBpZiAodGFic1swXS53aW5kb3dJZCAhPSBudWxsKSBhd2FpdCBjaHJvbWUud2luZG93cy51cGRhdGUodGFic1swXS53aW5kb3dJZCwge2ZvY3VzZWQ6IHRydWV9KTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe2ZvdW5kOiB0cnVlfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm9wZW5JZk1pc3NpbmcpIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHt1cmw6IG1zZy51cmwsIGFjdGl2ZTogdHJ1ZX0pO1xuICAgICAgICAgIHNlbmRSZXNwb25zZSh7Zm91bmQ6IGZhbHNlLCBvcGVuZWQ6IHQuaWR9KTtcbiAgICAgICAgfSBlbHNlIHNlbmRSZXNwb25zZSh7Zm91bmQ6IGZhbHNlfSk7XG4gICAgICB9IGNhdGNoIChlKSB7IHNlbmRSZXNwb25zZSh7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZy5raW5kID09PSAnbGlzdC1vcGVuLXRhYnMnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHt0YWJzOiB0YWJzLmZpbHRlcigodCkgPT4gdC51cmwpLm1hcCgodCkgPT4gKHtpZDogdC5pZCwgdXJsOiB0LnVybCwgdGl0bGU6IHQudGl0bGV9KSl9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgc2VuZFJlc3BvbnNlKHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSwgdGFiczogW119KTsgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAobXNnLmtpbmQgPT09ICdzaG90LWVsZW1lbnQnIHx8IG1zZy5raW5kID09PSAnc2hvdC1ncm91cCcgfHwgbXNnLmtpbmQgPT09ICdzaG90LXBhZ2UnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFiSWQgPSBtc2cudGFiSWQgPz8gc2VuZGVyLnRhYj8uaWQ7XG4gICAgICAgIGxldCByZXNvbHZlZFRhYklkID0gdGFiSWQ7XG4gICAgICAgIGxldCB3aW5kb3dJZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAocmVzb2x2ZWRUYWJJZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgICByZXNvbHZlZFRhYklkID0gdGFic1swXT8uaWQ7XG4gICAgICAgICAgd2luZG93SWQgPSB0YWJzWzBdPy53aW5kb3dJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHJlc29sdmVkVGFiSWQpO1xuICAgICAgICAgIHdpbmRvd0lkID0gdD8ud2luZG93SWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCB8fCB3aW5kb3dJZCA9PSBudWxsKSB7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnbm8gYWN0aXZlIHRhYid9IHNhdGlzZmllcyBTaG90UmVwbHkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YWJJZEZpbmFsID0gcmVzb2x2ZWRUYWJJZDtcbiAgICAgICAgY29uc3Qgd2luZG93SWRGaW5hbCA9IHdpbmRvd0lkO1xuICAgICAgICBhd2FpdCBlbnF1ZXVlKHRhYklkRmluYWwsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBydW5TaG90KG1zZywgdGFiSWRGaW5hbCwgd2luZG93SWRGaW5hbCk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UocmVwbHkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gc2F0aXNmaWVzIFNob3RSZXBseSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBzYXRpc2ZpZXMgU2hvdFJlcGx5KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gRnVsbC1wYWdlIHNuYXBzaG90IGZvciB0aGUgcGFnZS1zbmFwc2hvdCBmZWF0dXJlLiBSZXVzZXMgdGhlIHNhbWVcbiAgLy8gaGlkZS1vdmVybGF5cyDihpIgc3RpdGNoIOKGkiByZXN0b3JlIHBhdGggYXMgc2hvdC1wYWdlLCBidXQgcmV0dXJucyB0aGUgUE5HXG4gIC8vIGFzIGEgZGF0YSBVUkwgaW5zdGVhZCBvZiB3cml0aW5nIGEgZmlsZS4gU2VyaWFsaXplZCBwZXIgdGFiIHRocm91Z2ggdGhlXG4gIC8vIHNhbWUgcXVldWUgc28gaXQgY2FuJ3QgcmFjZSBhIGNvbmN1cnJlbnQgZWxlbWVudC9ncm91cCBjYXB0dXJlLlxuICBpZiAobXNnLmtpbmQgPT09ICdwYWdlLXNuYXBzaG90LXNob3QnKSB7XG4gICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFiSWQgPSBtc2cudGFiSWQgPz8gc2VuZGVyLnRhYj8uaWQ7XG4gICAgICAgIGxldCByZXNvbHZlZFRhYklkID0gdGFiSWQ7XG4gICAgICAgIGxldCB3aW5kb3dJZDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAocmVzb2x2ZWRUYWJJZCA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgICByZXNvbHZlZFRhYklkID0gdGFic1swXT8uaWQ7XG4gICAgICAgICAgd2luZG93SWQgPSB0YWJzWzBdPy53aW5kb3dJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0ID0gYXdhaXQgY2hyb21lLnRhYnMuZ2V0KHJlc29sdmVkVGFiSWQpO1xuICAgICAgICAgIHdpbmRvd0lkID0gdD8ud2luZG93SWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc29sdmVkVGFiSWQgPT0gbnVsbCB8fCB3aW5kb3dJZCA9PSBudWxsKSB7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnbm8gYWN0aXZlIHRhYid9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFiSWRGaW5hbCA9IHJlc29sdmVkVGFiSWQ7XG4gICAgICAgIGNvbnN0IHdpbmRvd0lkRmluYWwgPSB3aW5kb3dJZDtcbiAgICAgICAgYXdhaXQgZW5xdWV1ZSh0YWJJZEZpbmFsLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RQYWdlQ29tbW9uKHRhYklkRmluYWwsIHdpbmRvd0lkRmluYWwpO1xuICAgICAgICAgICAgaWYgKCFnb3QpIHsgc2VuZFJlc3BvbnNlKHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfSk7IHJldHVybjsgfVxuICAgICAgICAgICAgY29uc3Qgc2NyZWVuc2hvdCA9IGF3YWl0IGJsb2JUb0Z1bGxEYXRhVXJsKGdvdC5ibG9iKTtcbiAgICAgICAgICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgICAgICAgICAgLy8gYHRydW5jYXRlZGAgaGVyZSBtZWFucyB0aGUgc3RpdGNoIHN0b3BwZWQgZWFybHkgKGNodW5rL3BpeGVsXG4gICAgICAgICAgICAvLyBjYXApIOKAlCB0aGUgUE5HIGNvdmVycyBvbmx5IHBhcnQgb2YgdGhlIGRvY3VtZW50LCB3aGljaCBpc1xuICAgICAgICAgICAgLy8gZXhhY3RseSB0aGUgYHBhcnRpYWxgIHNpZ25hbCB0aGUgUGFnZVNuYXBzaG90IGNvbnRyYWN0IHdhbnRzLlxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtvazogdHJ1ZSwgc2NyZWVuc2hvdCwgcGFydGlhbDogZ290LnRydW5jYXRlZH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7b2s6IGZhbHNlLCBlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0pO1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAobXNnLmtpbmQgPT09ICdzYXZlLXRleHQnIHx8IG1zZy5raW5kID09PSAnc2F2ZS1ieXRlcycpIHtcbiAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgc3RvcmVkOiBTYXZlZEZpbGU7XG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZSA9IFN0cmluZyhtc2cud29ya3NwYWNlID8/ICdkZWZhdWx0Jyk7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gU3RyaW5nKG1zZy5maWxlbmFtZSA/PyAnZXhwb3J0LmJpbicpO1xuICAgICAgICBjb25zdCBtaW1lID0gU3RyaW5nKG1zZy5taW1lID8/ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nKTtcbiAgICAgICAgY29uc3Qgc3ViZGlyID0gU3RyaW5nKG1zZy5zdWJkaXIgPz8gJ2V4cG9ydHMnKTtcbiAgICAgICAgaWYgKG1zZy5raW5kID09PSAnc2F2ZS10ZXh0Jykge1xuICAgICAgICAgIHN0b3JlZCA9IGF3YWl0IHNhdmVUZXh0RG93bmxvYWQoU3RyaW5nKG1zZy50ZXh0ID8/ICcnKSwgd29ya3NwYWNlLCBmaWxlbmFtZSwgbWltZSwgc3ViZGlyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBEZWZlbnNpdmUgZGVjb2RlOiBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBjYW4gZGVsaXZlciBieXRlc1xuICAgICAgICAgIC8vIGFzIGEgVWludDhBcnJheSwgYSBudW1iZXJbXSwgb3IgYSBnZW5lcmljIGluZGV4ZWQgb2JqZWN0XG4gICAgICAgICAgLy8gKGRlcGVuZGluZyBvbiBDaHJvbWUgdmVyc2lvbiArIGNhbGxlcikuIEFjY2VwdCBhbGwgc2hhcGVzLlxuICAgICAgICAgIGNvbnN0IHJhdzogYW55ID0gbXNnLmJ5dGVzO1xuICAgICAgICAgIGxldCBieXRlczogVWludDhBcnJheTtcbiAgICAgICAgICBpZiAocmF3IGluc3RhbmNlb2YgVWludDhBcnJheSkgYnl0ZXMgPSByYXc7XG4gICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSBieXRlcyA9IFVpbnQ4QXJyYXkuZnJvbShyYXcpO1xuICAgICAgICAgIGVsc2UgaWYgKHJhdyAmJiB0eXBlb2YgcmF3ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3QgdmFscyA9IE9iamVjdC52YWx1ZXMocmF3KSBhcyBudW1iZXJbXTtcbiAgICAgICAgICAgIGJ5dGVzID0gVWludDhBcnJheS5mcm9tKHZhbHMpO1xuICAgICAgICAgIH0gZWxzZSBieXRlcyA9IG5ldyBVaW50OEFycmF5KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZS1ieXRlcyBkZWNvZGVkJywge2J5dGVzOiBieXRlcy5sZW5ndGgsIHJhd1R5cGU6IHR5cGVvZiByYXcsIGlzQXJyYXk6IEFycmF5LmlzQXJyYXkocmF3KSwgaXNVODogcmF3IGluc3RhbmNlb2YgVWludDhBcnJheX0pO1xuICAgICAgICAgIHN0b3JlZCA9IGF3YWl0IHNhdmVCeXRlc0Rvd25sb2FkKGJ5dGVzLCB3b3Jrc3BhY2UsIGZpbGVuYW1lLCBtaW1lLCBzdWJkaXIpO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgb2s6IHRydWUsIGZpbGVuYW1lOiBzdG9yZWQucmVsUGF0aCwgYWJzUGF0aDogc3RvcmVkLmFic1BhdGgsXG4gICAgICAgICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe29rOiBmYWxzZSwgZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9KTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gQXV0by1vcGVuIHRoZSBzaWRlIHBhbmVsIG9uIGZpcnN0IGNhcHR1cmUvc3RhZ2luZy4gQ2hyb21lIDExNisgcHJvcGFnYXRlc1xuICAvLyB0aGUgdXNlciBhY3RpdmF0aW9uIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Ugc28gdGhpcyBkb2Vzbid0XG4gIC8vIHRocm93IOKAlCB0aGUgY2xpY2sgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhcHR1cmUgaW4gdGhlIGNvbnRlbnQgc2NyaXB0IGlzXG4gIC8vIHN0aWxsIGNvbnNpZGVyZWQgXCJsaXZlXCIgaGVyZSBpbiB0aGUgd29ya2VyLlxuICAvL1xuICAvLyBJTlZFU1RJR0FURS0xIChmaXJzdC1jYXB0dXJlIHJhY2UpOiBvbiB0aGUgVkVSWSBGSVJTVCBBbHQrQ2xpY2sgdGhlIHBhbmVsXG4gIC8vIGRvY3VtZW50IGRvZXNuJ3QgZXhpc3QgeWV0LCBzbyBpdHMgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlIGxpc3RlbmVyIGlzbid0XG4gIC8vIHJlZ2lzdGVyZWQuIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIG9ubHkgcmVhY2hlcyBsaXN0ZW5lcnMgdGhhdCBhcmVcbiAgLy8gYWxyZWFkeSBsaXZlLCBzbyB0aGlzIGZpcnN0IGNhcHR1cmUgaXMgZHJvcHBlZCDigJQgdGhlIHVzZXIgaGFzIHRvIGNsaWNrIGFcbiAgLy8gc2Vjb25kIHRpbWUgKHBhbmVsIG5vdyBsaXN0ZW5pbmcpIHRvIHNlZSBpdC4gVGhlIHJvYnVzdCBmaXggaXMgYSBwYW5lbOKGkmJnXG4gIC8vIFwicGFuZWwtcmVhZHksIHNlbmQgbWUgYW55dGhpbmcgcGVuZGluZ1wiIGhhbmRzaGFrZSwgYnV0IHRoYXQgbmVlZHMgYVxuICAvLyBzaWRlcGFuZWwudHMgY2hhbmdlIChyZXBvcnRlZCBzZXBhcmF0ZWx5KS4gQXMgYSBiYWNrZ3JvdW5kLW9ubHksIGxvdy1yaXNrXG4gIC8vIG1pdGlnYXRpb24gd2UgcmUtYnJvYWRjYXN0IHRoZSBmaXJzdCBjYXB0dXJlKHMpIGEgZmV3IHRpbWVzIG92ZXIgYSBzaG9ydFxuICAvLyB3aW5kb3cgQUZURVIgb3BlbmluZyB0aGUgcGFuZWwuIFRoZSBwYW5lbCByZWdpc3RlcnMgaXRzIG9uTWVzc2FnZSBsaXN0ZW5lclxuICAvLyBzeW5jaHJvbm91c2x5IGF0IHNjcmlwdC1ldmFsIChiZWZvcmUgaXRzIGFzeW5jIGxvYWRBbGwpLCBhbmQgaXQgYWxyZWFkeVxuICAvLyBidWZmZXJzIG1lc3NhZ2VzIHVudGlsIHJlYWR5IEFORCBkZWR1cGVzIGJ5IF9fbWlkIOKAlCBzbyBhIHJlcGxheSB0aGF0IGxhbmRzXG4gIC8vIGFmdGVyIHRoZSBsaXN0ZW5lciBleGlzdHMgaXMgcHJvY2Vzc2VkIGV4YWN0bHkgb25jZSwgYW5kIHJlcGxheXMgdGhhdCBsb3NlXG4gIC8vIHRoZSByYWNlIGFyZSBoYXJtbGVzcyBuby1vcHMuXG4gIC8vXG4gIC8vIFdlIGd1YXJkIG9uIGBzZW5kZXIudGFiPy5pZCAhPSBudWxsYCBzbyBvdXIgT1dOIHJlcGxheXMgKHdoaWNoIGhhdmUgbm9cbiAgLy8gc2VuZGVyLnRhYikgbmV2ZXIgcmUtZW50ZXIgdGhpcyBicmFuY2gg4oCUIG5vIG9wZW4vcmVwbGF5IGxvb3AuXG4gIGlmICgobXNnLmtpbmQgPT09ICdjYXB0dXJlJyB8fCBtc2cua2luZCA9PT0gJ3BlbmRpbmctYWRkJykgJiYgc2VuZGVyLnRhYj8uaWQgIT0gbnVsbCkge1xuICAgIGNocm9tZS5zaWRlUGFuZWwub3Blbih7dGFiSWQ6IHNlbmRlci50YWIuaWR9KS5jYXRjaCgoKSA9PiB7IC8qIGFscmVhZHkgb3BlbiAqLyB9KTtcbiAgICAvLyBBbHdheXMgcmVwbGF5IOKAlCB3ZSBjYW4ndCByZWxpYWJseSB0ZWxsIGZyb20gaGVyZSB3aGV0aGVyIHRoZSBwYW5lbCB3YXNcbiAgICAvLyBhbHJlYWR5IGxpc3RlbmluZyAoc2lkZVBhbmVsIGhhcyBubyBcImlzLW9wZW5cIiBBUEksIGFuZCBvcGVuKCkgcmVzb2x2aW5nXG4gICAgLy8gdnMgcmVqZWN0aW5nIGlzIG5vdCBhIGNsZWFuIHNpZ25hbCBhY3Jvc3MgQ2hyb21lIHZlcnNpb25zIC8gZ2VzdHVyZVxuICAgIC8vIHN0YXRlcykuIE92ZXItcmVwbGF5aW5nIHdoZW4gdGhlIHBhbmVsIGlzIGFscmVhZHkgdXAgaXMgaGFybWxlc3M6IHRoZVxuICAgIC8vIHBhbmVsIGRlZHVwZXMgYnkgX19taWQsIHNvIHRoZSByZWR1bmRhbnQgYnJvYWRjYXN0cyBjb2xsYXBzZSB0byBub3RoaW5nLlxuICAgIC8vIFVuZGVyLXJlcGxheWluZyB3b3VsZCByZXN1cnJlY3QgdGhlIGRyb3BwZWQtZmlyc3QtY2FwdHVyZSBidWcsIHNvIHdlIGVyclxuICAgIC8vIHRvd2FyZCBhbHdheXMgcmVwbGF5aW5nLiBUaGUgd2luZG93IGlzIHNob3J0IGFuZCBib3VuZGVkICgzIHNlbmRzKS5cbiAgICByZXBsYXlGaXJzdENhcHR1cmUobXNnIGFzIFBnRW52ZWxvcGU8QW55TWVzc2FnZT4pO1xuICB9XG5cbiAgLy8gTm8gcG9ydCByZWxheTogdGhlIHNpZGUgcGFuZWwgbGlzdGVucyBkaXJlY3RseSBvbiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UsXG4gIC8vIHdoaWNoIGFscmVhZHkgcmVjZWl2ZXMgYnJvYWRjYXN0cyBmcm9tIGNvbnRlbnQgc2NyaXB0cy4gUmVsYXlpbmcgdGhyb3VnaFxuICAvLyBhIHBvcnQgY2F1c2VzIGV2ZXJ5IG1lc3NhZ2UgdG8gYmUgZGVsaXZlcmVkIHR3aWNlIOKAlCB0aGF0IHN1cmZhY2VkIGFzXG4gIC8vIGR1cGxpY2F0ZWQgbXVsdGktc2VsZWN0IGVudHJpZXMgaW4gcHJvZHVjdGlvbi5cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbi8vIFJlLWJyb2FkY2FzdCBhIGNhcHR1cmUvcGVuZGluZy1hZGQgZW52ZWxvcGUgYSBmZXcgdGltZXMgb3ZlciBhIHNob3J0IHdpbmRvd1xuLy8gc28gYSBmcmVzaGx5LW9wZW5lZCBzaWRlIHBhbmVsICh3aG9zZSBsaXN0ZW5lciByZWdpc3RlcnMgYSBmZXcgbXMgYWZ0ZXIgdGhlXG4vLyBkb2N1bWVudCBzdGFydHMgbG9hZGluZykgY2F0Y2hlcyBpdC4gU2FtZSBfX21pZCBlYWNoIHRpbWUg4oaSIHRoZSBwYW5lbCdzXG4vLyByZWNlbnRNaWRzIHJpbmcgZGVkdXBlcyB0byBhIHNpbmdsZSBwcm9jZXNzZWQgbWVzc2FnZS4gQm91bmRlZCAobm8gbG9vcCk6XG4vLyB0aHJlZSBhdHRlbXB0cyBpbnNpZGUgfjQ1MG1zLCB0aGVuIHdlIHN0b3AuIFJlc2VuZGluZyB0aGUgU0FNRSBlbnZlbG9wZSBpc1xuLy8gaW1wb3J0YW50IOKAlCBhIG5ldyBfX21pZCB3b3VsZCBkZWZlYXQgdGhlIGRlZHVwIGFuZCBkb3VibGUtaW5zZXJ0LlxuY29uc3QgUkVQTEFZX0RFTEFZU19NUyA9IFs2MCwgMTgwLCA0NTBdO1xuY29uc3QgcmVwbGF5Rmlyc3RDYXB0dXJlID0gKGVudmVsb3BlOiBQZ0VudmVsb3BlPEFueU1lc3NhZ2U+KTogdm9pZCA9PiB7XG4gIGZvciAoY29uc3QgZGVsYXkgb2YgUkVQTEFZX0RFTEFZU19NUykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gc2VuZE1lc3NhZ2Ugd2l0aCBubyBjYWxsYmFjazsgdGhlIHBhbmVsIGNvbnN1bWVzIGl0LiBXcmFwcGVkIHNvIGFcbiAgICAgIC8vIFwicmVjZWl2aW5nIGVuZCBkb2VzIG5vdCBleGlzdFwiIHJlamVjdGlvbiAocGFuZWwgc3RpbGwgbm90IHVwIG9uIHRoZVxuICAgICAgLy8gZWFybGllc3QgYXR0ZW1wdCkgaXMgc3dhbGxvd2VkIHJhdGhlciB0aGFuIGxvZ2dlZCBhcyBhbiBlcnJvci5cbiAgICAgIHRyeSB7IHZvaWQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoZW52ZWxvcGUpLmNhdGNoPy4oKCkgPT4geyAvKiBub3QgdXAgeWV0ICovIH0pOyB9XG4gICAgICBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSwgZGVsYXkpO1xuICB9XG59O1xuXG4vLyBFbmNvZGUgYSBQTkcgYmxvYiBpbnRvIGEgYmFzZTY0IGRhdGEgVVJMIHVzaW5nIHRoZSBzYW1lIGNodW5rZWQtYnRvYVxuLy8gcGF0aCBzYXZlRG93bmxvYWQgdXNlcy4gVGhlIHJlc3VsdCBpcyB0d28gcHVycG9zZXMtaW4tb25lOiB0aGVcbi8vIGRvd25zY2FsZWQgdGh1bWJuYWlsIGdvZXMgYmFjayB0byB0aGUgc2lkZSBwYW5lbCdzIHByZXZpZXcgdGlsZSAoc21hbGwsXG4vLyB+NS0xNSBLQiksIHdoaWxlIHRoZSBGVUxMIHBuZyBhbHNvIHJpZGVzIGJhY2sgc28gdGhlIHBhbmVsIGNhbiBzdGFzaCBpdFxuLy8gaW4gYHNob3RzRnVsbGAgYW5kIGJ1bmRsZSBpdCBpbnRvIHRoZSB3b3Jrc3BhY2UgLnRhci56c3QgZXhwb3J0IGxhdGVyLlxuY29uc3QgYmxvYlRvRnVsbERhdGFVcmwgPSBhc3luYyAoYmxvYjogQmxvYik6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IGJ1ZiA9IGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWYpO1xuICBsZXQgYmluYXJ5ID0gJyc7XG4gIGNvbnN0IGNodW5rID0gMHg4MF8wMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gY2h1bmspIHtcbiAgICBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBBcnJheS5mcm9tKGJ5dGVzLnN1YmFycmF5KGksIGkgKyBjaHVuaykpKTtcbiAgfVxuICByZXR1cm4gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke2J0b2EoYmluYXJ5KX1gO1xufTtcblxuY29uc3QgcnVuU2hvdCA9IGFzeW5jIChtc2c6IGFueSwgdGFiSWQ6IG51bWJlciwgd2luZG93SWQ6IG51bWJlcik6IFByb21pc2U8U2hvdFJlcGx5PiA9PiB7XG4gIGNvbnN0IHRzID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICBjb25zdCBwYWRkaW5nID0gdHlwZW9mIG1zZy5wYWRkaW5nID09PSAnbnVtYmVyJyA/IG1zZy5wYWRkaW5nIDogMjQ7XG4gIGlmIChtc2cua2luZCA9PT0gJ3Nob3QtZWxlbWVudCcpIHtcbiAgICBjb25zdCBnb3QgPSBhd2FpdCBzaG90RWxlbWVudENvbW1vbih0YWJJZCwgd2luZG93SWQsIFttc2cuc2VsZWN0b3JdLCBwYWRkaW5nKTtcbiAgICBpZiAoIWdvdCkgcmV0dXJuIHtvazogZmFsc2UsIGVycm9yOiAnY2FwdHVyZSBmYWlsZWQnfTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ2VsZW1lbnQnLCB0cywgbXNnLm4sIGdvdC50YWJVcmwpO1xuICAgIGNvbnN0IHN0b3JlZCA9IGF3YWl0IHNhdmVEb3dubG9hZChnb3QuYmxvYiwgbXNnLndvcmtzcGFjZSwgZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICAgIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgZGF0YVVybCwgZnVsbERhdGFVcmwsXG4gICAgICBjcm9wOiBnb3QuY3JvcE1ldGEsXG4gICAgfTtcbiAgfVxuICBpZiAobXNnLmtpbmQgPT09ICdzaG90LWdyb3VwJykge1xuICAgIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RFbGVtZW50Q29tbW9uKHRhYklkLCB3aW5kb3dJZCwgbXNnLnNlbGVjdG9ycywgcGFkZGluZyk7XG4gICAgaWYgKCFnb3QpIHJldHVybiB7b2s6IGZhbHNlLCBlcnJvcjogJ2NhcHR1cmUgZmFpbGVkJ307XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEZpbGVuYW1lKCdncm91cCcsIHRzLCBtc2cubiwgZ290LnRhYlVybCwge2NvdW50OiBtc2cuc2VsZWN0b3JzLmxlbmd0aH0pO1xuICAgIGNvbnN0IHN0b3JlZCA9IGF3YWl0IHNhdmVEb3dubG9hZChnb3QuYmxvYiwgbXNnLndvcmtzcGFjZSwgZmlsZW5hbWUpO1xuICAgIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICAgIGNvbnN0IGZ1bGxEYXRhVXJsID0gYXdhaXQgYmxvYlRvRnVsbERhdGFVcmwoZ290LmJsb2IpO1xuICAgIGdvdC5iaXRtYXAuY2xvc2U/LigpO1xuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSwgZmlsZW5hbWU6IHN0b3JlZC5yZWxQYXRoLCBhYnNQYXRoOiBzdG9yZWQuYWJzUGF0aCxcbiAgICAgIGNvcHlQYXRoOiBzdG9yZWQuY29weVBhdGgsIHRlbXBQYXRoOiBzdG9yZWQudGVtcFBhdGgsIGRvd25sb2FkU3RhdGU6IHN0b3JlZC5kb3dubG9hZFN0YXRlLFxuICAgICAgZGF0YVVybCwgZnVsbERhdGFVcmwsXG4gICAgICBjcm9wOiBnb3QuY3JvcE1ldGEsXG4gICAgfTtcbiAgfVxuICAvLyBwYWdlXG4gIGNvbnN0IGdvdCA9IGF3YWl0IHNob3RQYWdlQ29tbW9uKHRhYklkLCB3aW5kb3dJZCk7XG4gIGlmICghZ290KSByZXR1cm4ge29rOiBmYWxzZSwgZXJyb3I6ICdjYXB0dXJlIGZhaWxlZCd9O1xuICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRmlsZW5hbWUoJ3BhZ2UnLCB0cywgbXNnLm4sIGdvdC50YWJVcmwsIHt0cnVuY2F0ZWQ6IGdvdC50cnVuY2F0ZWR9KTtcbiAgY29uc3Qgc3RvcmVkID0gYXdhaXQgc2F2ZURvd25sb2FkKGdvdC5ibG9iLCBtc2cud29ya3NwYWNlLCBmaWxlbmFtZSk7XG4gIGNvbnN0IGRhdGFVcmwgPSBhd2FpdCBtYWtlVGh1bWJuYWlsKGdvdC5iaXRtYXApO1xuICBjb25zdCBmdWxsRGF0YVVybCA9IGF3YWl0IGJsb2JUb0Z1bGxEYXRhVXJsKGdvdC5ibG9iKTtcbiAgZ290LmJpdG1hcC5jbG9zZT8uKCk7XG4gIHJldHVybiB7XG4gICAgb2s6IHRydWUsIGZpbGVuYW1lOiBzdG9yZWQucmVsUGF0aCwgYWJzUGF0aDogc3RvcmVkLmFic1BhdGgsXG4gICAgY29weVBhdGg6IHN0b3JlZC5jb3B5UGF0aCwgdGVtcFBhdGg6IHN0b3JlZC50ZW1wUGF0aCwgZG93bmxvYWRTdGF0ZTogc3RvcmVkLmRvd25sb2FkU3RhdGUsXG4gICAgZGF0YVVybCwgZnVsbERhdGFVcmwsIHRydW5jYXRlZDogZ290LnRydW5jYXRlZCxcbiAgfTtcbn07XG5cbi8vIChzYXZlLXRleHQgLyBzYXZlLWJ5dGVzIGFyZSBmb2xkZWQgaW50byB0aGUgc2luZ2xlIGxpc3RlbmVyIGFib3ZlLilcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZsQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUN6RixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBLEVBS0osSUFBTSxLQUFLLENBQTJCLGFBQzFDLEVBQUMsTUFBTSxNQUFNLE9BQU8sT0FBTyxNQUFNLFFBQU87OztFQzFsQjNDLElBQU0sTUFBTTtBQUFBLEVBS1osZUFBZSxZQUFZLEdBQWtCO0FBQUEsSUFDM0MsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRztBQUFBLE1BQzlCLE1BQU0sWUFBdUMsQ0FBQztBQUFBLE1BQzlDLFdBQVcsUUFBUSxPQUFPO0FBQUEsUUFDeEIsTUFBTSxJQUFJLElBQUksZ0JBQWdCLE1BQU0sSUFBSTtBQUFBLFFBQ3hDLE1BQU0sTUFBTSxFQUFFLFdBQVcsSUFBSTtBQUFBLFFBQzdCLElBQUksVUFBVSxHQUFHLEdBQUcsTUFBTSxJQUFJO0FBQUEsUUFDOUIsSUFBSSxPQUFPLEdBQUcsS0FBSyxNQUFNLE9BQU8sSUFBSTtBQUFBLFFBQ3BDLElBQUksWUFBWTtBQUFBLFFBQ2hCLElBQUksZUFBZTtBQUFBLFFBQ25CLElBQUksU0FBUyxnQkFBSyxPQUFPLEdBQUcsT0FBTyxJQUFJLE9BQU8sSUFBSTtBQUFBLFFBQ2xELFVBQVUsUUFBUSxJQUFJLGFBQWEsR0FBRyxHQUFHLE1BQU0sSUFBSTtBQUFBLE1BQ3JEO0FBQUEsTUFDQSxNQUFNLE9BQU8sT0FBTyxRQUFRLEVBQUMsVUFBUyxDQUFDO0FBQUEsTUFDdkMsT0FBTyxHQUFHO0FBQUEsTUFBRSxRQUFRLEtBQUssS0FBSyxnQkFBZ0IsQ0FBQztBQUFBO0FBQUE7QUFBQSxFQWFuRCxJQUFNLG1CQUFtQixNQUFZO0FBQUEsSUFFbkMsSUFBSTtBQUFBLE1BQ0QsT0FBTyxVQUFrQixlQUFlLEVBQUMsU0FBUyxNQUFLLEdBQUcsTUFBTTtBQUFBLFFBQy9ELElBQUksT0FBTyxRQUFRO0FBQUEsVUFBVyxRQUFRLElBQUksS0FBSyxpQkFBaUIsT0FBTyxRQUFRLFVBQVUsT0FBTztBQUFBLE9BQ2pHO0FBQUEsTUFDRCxPQUFPLEdBQUc7QUFBQSxNQUFFLFFBQVEsSUFBSSxLQUFLLHNCQUFzQixDQUFDO0FBQUE7QUFBQSxJQUV0RCxJQUFJO0FBQUEsTUFBRyxPQUFPLFVBQWtCLGtCQUFrQixLQUFLO0FBQUEsTUFBSyxNQUFNO0FBQUE7QUFBQSxFQUdwRSxPQUFPLFFBQVEsWUFBWSxZQUFZLFlBQVk7QUFBQSxJQUlqRCxJQUFJO0FBQUEsTUFBRSxNQUFNLE9BQU8sVUFBVSxpQkFBaUIsRUFBQyx3QkFBd0IsTUFBSyxDQUFDO0FBQUEsTUFDN0UsT0FBTyxHQUFHO0FBQUEsTUFBRSxRQUFRLEtBQUssS0FBSyxvQkFBb0IsQ0FBQztBQUFBO0FBQUEsSUFDbkQsSUFBSTtBQUFBLE1BQUUsT0FBTyxhQUFhLE9BQU8sRUFBQyxJQUFJLGNBQWMsT0FBTyxvQ0FBbUMsVUFBVSxDQUFDLEtBQUssRUFBQyxDQUFDO0FBQUEsTUFDaEgsTUFBTTtBQUFBLElBQ04saUJBQWlCO0FBQUEsSUFDWixhQUFhO0FBQUEsR0FDbkI7QUFBQSxFQUVELE9BQU8sUUFBUSxXQUFXLFlBQVksTUFBTTtBQUFBLElBQzFDLGlCQUFpQjtBQUFBLElBQ1osYUFBYTtBQUFBLEdBQ25CO0FBQUEsRUFJRCxpQkFBaUI7QUFBQSxFQVFqQixPQUFPLE9BQU8sVUFBVSxZQUFZLENBQUMsUUFBUTtBQUFBLElBQzNDLElBQUksQ0FBQyxLQUFLO0FBQUEsTUFBSTtBQUFBLElBQ2QsTUFBTSxRQUFRLElBQUk7QUFBQSxJQUdsQixPQUFPLFVBQVUsS0FBSyxFQUFDLE1BQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFLLGtCQUFrQixDQUFDLENBQUM7QUFBQSxJQUNsRixJQUFJLElBQUksT0FBTyxXQUFXLEtBQUssSUFBSSxHQUFHLEdBQUc7QUFBQSxNQUN2QyxPQUFPLFVBQVUsY0FBYztBQUFBLFFBQzdCLFFBQVEsRUFBQyxPQUFPLFdBQVcsTUFBSztBQUFBLFFBQ2hDLE9BQU8sQ0FBQyxtQkFBbUI7QUFBQSxRQUMzQixtQkFBbUI7QUFBQSxNQUNyQixDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sUUFBUSxLQUFLLEtBQUssbUJBQW1CLENBQUMsQ0FBQztBQUFBLElBQ3pEO0FBQUEsSUFHQSxNQUFNLE9BQU8sRUFBQyxNQUFNLE1BQU0sTUFBTSxvQkFBb0IsT0FBTyxLQUFLLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxTQUFTLEdBQUU7QUFBQSxJQUNyRyxNQUFNLFdBQVcsTUFBWTtBQUFBLE1BQUUsSUFBSTtBQUFBLFFBQU8sT0FBTyxRQUFRLFlBQVksSUFBSSxFQUFFLFFBQVEsTUFBTSxFQUFvQjtBQUFBLFFBQUssTUFBTTtBQUFBO0FBQUEsSUFDeEgsU0FBUztBQUFBLElBQ1QsV0FBVyxVQUFVLEdBQUc7QUFBQSxJQUN4QixXQUFXLFVBQVUsR0FBRztBQUFBLEdBQ3pCO0FBQUEsRUFFRCxPQUFPLGNBQWMsVUFBVSxZQUFZLENBQUMsTUFBTSxRQUFRO0FBQUEsSUFDeEQsSUFBSSxLQUFLLGVBQWUsZ0JBQWdCLENBQUMsS0FBSztBQUFBLE1BQUk7QUFBQSxJQUNsRCxPQUFPLEtBQUssWUFBWSxJQUFJLElBQUksRUFBQyxNQUFNLE1BQU0sTUFBTSxrQkFBaUIsQ0FBQyxFQUFFLE1BQU0sTUFBTSxFQUFnQjtBQUFBLEdBQ3BHO0FBQUEsRUFPTSxJQUFNLGdCQUFnQixDQUFDLFFBQXlCO0FBQUEsSUFDckQsSUFBSSxDQUFDO0FBQUEsTUFBSyxPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUM7QUFBQSxJQUNsQyxNQUFNLElBQUksS0FBSyxNQUFNLEdBQUc7QUFBQSxJQUN4QixPQUFPLE9BQU8sU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQztBQUFBO0FBQUEsRUFPcEQsSUFBTSxXQUFXLENBQUMsUUFBd0I7QUFBQSxJQUMvQyxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsTUFBRSxPQUFPLElBQUksSUFBSSxHQUFHLEVBQUU7QUFBQSxNQUFRLE1BQU07QUFBQSxNQUFFLE9BQU87QUFBQTtBQUFBLElBQ2pELE9BQU8sS0FBSyxRQUFRLE9BQU8sR0FBRyxFQUFFLFFBQVEsV0FBVyxHQUFHLEVBQUUsTUFBTSxHQUFHLEVBQUUsS0FBSztBQUFBO0FBQUEsRUFPbkUsSUFBTSxnQkFBZ0IsQ0FDM0IsTUFDQSxJQUNBLEdBQ0EsS0FDQSxPQUE4QyxDQUFDLE1BQ3BDO0FBQUEsSUFDWCxNQUFNLFFBQVEsY0FBYyxFQUFFO0FBQUEsSUFDOUIsTUFBTSxPQUFPLFNBQVMsR0FBRztBQUFBLElBQ3pCLElBQUksU0FBUztBQUFBLE1BQVcsT0FBTyxHQUFHLFNBQVMsYUFBYTtBQUFBLElBQ3hELElBQUksU0FBUztBQUFBLE1BQVMsT0FBTyxHQUFHLFNBQVMsVUFBVSxLQUFLLFNBQVMsS0FBSztBQUFBLElBRXRFLE1BQU0sU0FBUyxLQUFLLFlBQVksZUFBZTtBQUFBLElBQy9DLE9BQU8sR0FBRyxTQUFTLEtBQUssVUFBVTtBQUFBO0FBQUEsRUFLcEMsSUFBTSxnQkFBZ0IsT0FBTyxZQUFtQztBQUFBLElBQzlELE1BQU0sSUFBSSxNQUFNLE1BQU0sT0FBTztBQUFBLElBQzdCLE9BQU8sRUFBRSxLQUFLO0FBQUE7QUFBQSxFQUtoQixJQUFNLGtCQUFrQixPQUFPLFlBQTBDO0FBQUEsSUFDdkUsTUFBTSxPQUFPLE1BQU0sY0FBYyxPQUFPO0FBQUEsSUFDeEMsT0FBTyxrQkFBa0IsSUFBSTtBQUFBO0FBQUEsRUFJL0IsSUFBTSxlQUFlLE9BQU8sV0FDMUIsT0FBTyxjQUFjLEVBQUMsTUFBTSxZQUFXLENBQUM7QUFBQSxFQU0xQyxJQUFNLGdCQUFnQixPQUFPLFFBQXFCLFdBQVcsUUFBeUI7QUFBQSxJQUNwRixNQUFNLFFBQVEsT0FBTyxTQUFTLFdBQVcsSUFBSSxXQUFXLE9BQU87QUFBQSxJQUMvRCxNQUFNLElBQUksS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLE9BQU8sUUFBUSxLQUFLLENBQUM7QUFBQSxJQUN0RCxNQUFNLElBQUksS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLE9BQU8sU0FBUyxLQUFLLENBQUM7QUFBQSxJQUN2RCxNQUFNLFNBQVMsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDO0FBQUEsSUFDdkMsTUFBTSxNQUFNLE9BQU8sV0FBVyxJQUFJO0FBQUEsSUFDbEMsSUFBSSx3QkFBd0I7QUFBQSxJQUM1QixJQUFJLHdCQUF3QjtBQUFBLElBQzVCLElBQUksVUFBVSxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFBQSxJQUNoQyxNQUFNLE9BQU8sTUFBTSxPQUFPLGNBQWMsRUFBQyxNQUFNLFlBQVcsQ0FBQztBQUFBLElBRTNELE1BQU0sTUFBTSxNQUFNLEtBQUssWUFBWTtBQUFBLElBQ25DLE1BQU0sUUFBUSxJQUFJLFdBQVcsR0FBRztBQUFBLElBQ2hDLElBQUksU0FBUztBQUFBLElBQ2IsTUFBTSxRQUFRO0FBQUEsSUFDZCxTQUFTLElBQUksRUFBRyxJQUFJLE1BQU0sUUFBUSxLQUFLLE9BQU87QUFBQSxNQUM1QyxVQUFVLE9BQU8sYUFBYSxNQUFNLE1BQU0sTUFBTSxLQUFLLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7QUFBQSxJQUNwRjtBQUFBLElBQ0EsT0FBTyx5QkFBeUIsS0FBSyxNQUFNO0FBQUE7QUFBQSxFQU83QyxJQUFNLFlBQVksSUFBSTtBQUFBLEVBQ3RCLElBQU0sVUFBVSxDQUFDLE9BQWUsU0FBbUM7QUFBQSxJQUNqRSxNQUFNLE9BQU8sVUFBVSxJQUFJLEtBQUssS0FBSyxRQUFRLFFBQVE7QUFBQSxJQUNyRCxNQUFNLE9BQU8sS0FBSyxLQUFLLE1BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU07QUFBQSxNQUFFLFFBQVEsS0FBSyxLQUFLLHFCQUFxQixDQUFDO0FBQUEsS0FBSTtBQUFBLElBQ2hHLFVBQVUsSUFBSSxPQUFPLElBQUk7QUFBQSxJQUN6QixPQUFPO0FBQUE7QUFBQSxFQU1ULElBQU0sU0FBUyxPQUFvQixPQUFlLFNBQWMsWUFBWSxRQUEyQjtBQUFBLElBQ3JHLE9BQU8sSUFBSSxRQUFrQixDQUFDLFlBQVk7QUFBQSxNQUN4QyxJQUFJLE9BQU87QUFBQSxNQUNYLE1BQU0sU0FBUyxDQUFDLE1BQXNCO0FBQUEsUUFBRSxJQUFJLENBQUMsTUFBTTtBQUFBLFVBQUUsT0FBTztBQUFBLFVBQU0sUUFBUSxDQUFDO0FBQUEsUUFBRztBQUFBO0FBQUEsTUFDOUUsV0FBVyxNQUFNLE9BQU8sSUFBSSxHQUFHLFNBQVM7QUFBQSxNQUN4QyxJQUFJO0FBQUEsUUFDRixPQUFPLEtBQUssWUFBWSxPQUFPLEdBQUcsT0FBTyxHQUFHLENBQUMsVUFBVTtBQUFBLFVBQ3JELElBQUksT0FBTyxRQUFRLFdBQVc7QUFBQSxZQUFFLE9BQU8sSUFBSTtBQUFBLFlBQUc7QUFBQSxVQUFRO0FBQUEsVUFDdEQsT0FBUSxTQUFTLElBQWlCO0FBQUEsU0FDbkM7QUFBQSxRQUNELE1BQU07QUFBQSxRQUFFLE9BQU8sSUFBSTtBQUFBO0FBQUEsS0FDdEI7QUFBQTtBQUFBLEVBS0gsSUFBTSxZQUFZLE9BQ2hCLE9BQ0EsTUFDQSxPQUFjLENBQUMsTUFDTztBQUFBLElBQ3RCLElBQUk7QUFBQSxNQUNGLE1BQU0sVUFBVSxNQUFNLE9BQU8sVUFBVSxjQUFjO0FBQUEsUUFDbkQsUUFBUSxFQUFDLE1BQUs7QUFBQSxRQUNkO0FBQUEsUUFDQTtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsT0FBUSxVQUFVLElBQUksVUFBVTtBQUFBLE1BQ2hDLE9BQU8sR0FBRztBQUFBLE1BQ1YsUUFBUSxLQUFLLEtBQUssYUFBYSxDQUFDO0FBQUEsTUFDaEMsT0FBTztBQUFBO0FBQUE7QUFBQSxFQU9YLElBQU0sbUJBQW1CLE9BQ3ZCLE9BQ0EsV0FDQSxZQUMrQjtBQUFBLElBQy9CLE9BQU8sVUFBNkIsT0FBTyxDQUFDLE1BQWdCLFFBQWdCO0FBQUEsTUFDMUUsTUFBTSxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU07QUFBQSxRQUMxQixJQUFJO0FBQUEsVUFBRSxPQUFPLFNBQVMsY0FBYyxDQUFDO0FBQUEsVUFBSyxNQUFNO0FBQUEsVUFBRSxPQUFPO0FBQUE7QUFBQSxPQUMxRCxFQUFFLE9BQU8sQ0FBQyxNQUFvQixRQUFRLENBQUMsQ0FBQztBQUFBLE1BQ3pDLElBQUksQ0FBQyxJQUFJO0FBQUEsUUFBUSxPQUFPO0FBQUEsTUFHeEIsTUFBTSxjQUFjLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQztBQUFBLE1BQzVELE1BQU0sVUFBVSxLQUFLLElBQUksR0FBRyxZQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksT0FBTztBQUFBLE1BQ3JFLE1BQU0sVUFBVSxLQUFLLElBQUksR0FBRyxZQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksT0FBTztBQUFBLE1BQ3BFLE1BQU0sVUFBVSxLQUFLLElBQUksR0FBRyxZQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksT0FBTztBQUFBLE1BQ3RFLE1BQU0sVUFBVSxLQUFLLElBQUksR0FBRyxZQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksT0FBTztBQUFBLE1BQ3ZFLE1BQU0sTUFBTSxVQUFVLFdBQVc7QUFBQSxNQUNqQyxNQUFNLE1BQU0sVUFBVSxXQUFXO0FBQUEsTUFDakMsTUFBTSxVQUFVLEtBQUssSUFBSSxHQUFHLEtBQUssT0FBTyxhQUFhLENBQUM7QUFBQSxNQUN0RCxNQUFNLFVBQVUsS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFPLGNBQWMsQ0FBQztBQUFBLE1BQ3ZELE9BQU8sU0FBUyxFQUFDLE1BQU0sU0FBUyxLQUFLLFNBQVMsVUFBVSxVQUEyQixDQUFDO0FBQUEsTUFHcEYsTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQztBQUFBLE1BQ3RELE1BQU0sT0FBTyxLQUFLLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFBQSxNQUNyRCxNQUFNLE9BQU8sS0FBSyxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJO0FBQUEsTUFDcEQsTUFBTSxPQUFPLEtBQUssSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSTtBQUFBLE1BQ3RELE1BQU0sT0FBTyxLQUFLLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUk7QUFBQSxNQUN2RCxPQUFPO0FBQUEsUUFDTCxHQUFHO0FBQUEsUUFDSCxHQUFHO0FBQUEsUUFDSCxHQUFHLE9BQU87QUFBQSxRQUNWLEdBQUcsT0FBTztBQUFBLFFBQ1YsS0FBSyxPQUFPLG9CQUFvQjtBQUFBLFFBQ2hDLElBQUksT0FBTztBQUFBLFFBQ1gsSUFBSSxPQUFPO0FBQUEsTUFDYjtBQUFBLE9BQ0MsQ0FBQyxXQUFXLE9BQU8sQ0FBQztBQUFBO0FBQUEsRUFNekIsSUFBTSxXQUFXLE9BQU8sVUFBaUM7QUFBQSxJQUN2RCxNQUFNLFVBQWdCLE9BQU8sTUFDM0IsSUFBSSxRQUFjLENBQUMsWUFDakIsc0JBQXNCLE1BQU0sc0JBQXNCLE1BQU0sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUN2RTtBQUFBO0FBQUEsRUFLRixJQUFNLGdCQUFnQixPQUFPLE9BQWUsR0FBVyxNQUE2QjtBQUFBLElBQ2xGLE1BQU0sVUFBZ0IsT0FBTyxDQUFDLElBQVksT0FBZTtBQUFBLE1BQ3ZELE9BQU8sU0FBUyxFQUFDLE1BQU0sSUFBSSxLQUFLLElBQUksVUFBVSxVQUEyQixDQUFDO0FBQUEsT0FDekUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUFBO0FBQUEsRUFHWCxJQUFNLG1CQUFtQjtBQUFBLEVBQ3pCLElBQU0scUJBQXFCO0FBQUEsRUFJM0IsSUFBTSxhQUFhLE9BQ2pCLE9BQ0EsYUFDMEU7QUFBQSxJQUUxRSxNQUFNLE9BQU8sTUFBTSxVQUNqQixPQUNBLE9BQU87QUFBQSxNQUNMLElBQUksT0FBTztBQUFBLE1BQ1gsSUFBSSxPQUFPO0FBQUEsTUFDWCxJQUFJLEtBQUssSUFBSSxTQUFTLGdCQUFnQixhQUFhLFNBQVMsTUFBTSxlQUFlLENBQUM7QUFBQSxNQUNsRixJQUFJLEtBQUssSUFBSSxTQUFTLGdCQUFnQixjQUFjLFNBQVMsTUFBTSxnQkFBZ0IsQ0FBQztBQUFBLE1BQ3BGLEtBQUssT0FBTyxvQkFBb0I7QUFBQSxNQUNoQyxJQUFJLE9BQU87QUFBQSxNQUNYLElBQUksT0FBTztBQUFBLElBQ2IsRUFDRjtBQUFBLElBQ0EsSUFBSSxDQUFDO0FBQUEsTUFBTSxPQUFPO0FBQUEsSUFFbEIsTUFBTSxNQUFNLEtBQUs7QUFBQSxJQUNqQixNQUFNLFNBQVMsS0FBSztBQUFBLElBQ3BCLE1BQU0sV0FBVyxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQUEsSUFDeEMsTUFBTSxVQUFVLEtBQUssTUFBTSxLQUFLLEtBQUssR0FBRztBQUFBLElBR3hDLElBQUksU0FBUztBQUFBLElBQ2IsSUFBSSxJQUFJO0FBQUEsSUFDUixJQUFJLGNBQWM7QUFBQSxJQUNsQixJQUFJLFlBQVk7QUFBQSxJQUloQixNQUFNLFlBQVksS0FBSyxJQUFJLFVBQVUsa0JBQWtCO0FBQUEsSUFDdkQsTUFBTSxTQUFTLElBQUksZ0JBQWdCLFNBQVMsU0FBUztBQUFBLElBQ3JELE1BQU0sTUFBTSxPQUFPLFdBQVcsSUFBSTtBQUFBLElBRWxDLE9BQU8sSUFBSSxRQUFRO0FBQUEsTUFDakIsSUFBSSxVQUFVLGtCQUFrQjtBQUFBLFFBQUUsWUFBWTtBQUFBLFFBQU07QUFBQSxNQUFPO0FBQUEsTUFDM0QsSUFBSSxlQUFlLG9CQUFvQjtBQUFBLFFBQUUsWUFBWTtBQUFBLFFBQU07QUFBQSxNQUFPO0FBQUEsTUFDbEUsTUFBTSxVQUFnQixPQUFPLENBQUMsT0FBZTtBQUFBLFFBQzNDLE9BQU8sU0FBUyxFQUFDLE1BQU0sR0FBRyxLQUFLLElBQUksVUFBVSxVQUEyQixDQUFDO0FBQUEsU0FDeEUsQ0FBQyxDQUFDLENBQUM7QUFBQSxNQUNOLE1BQU0sU0FBUyxLQUFLO0FBQUEsTUFDcEIsSUFBSTtBQUFBLE1BQ0osSUFBSTtBQUFBLFFBQ0YsVUFBVSxNQUFNLE9BQU8sS0FBSyxrQkFBa0IsVUFBVSxFQUFDLFFBQVEsTUFBSyxDQUFDO0FBQUEsUUFDdkUsT0FBTyxHQUFHO0FBQUEsUUFDVixRQUFRLEtBQUssS0FBSyx1Q0FBdUMsQ0FBQztBQUFBLFFBQzFEO0FBQUE7QUFBQSxNQUVGLE1BQU0sS0FBSyxNQUFNLGdCQUFnQixPQUFPO0FBQUEsTUFLeEMsTUFBTSxjQUFjLEtBQUssT0FBTyxTQUFTLEtBQUssR0FBRztBQUFBLE1BQ2pELE1BQU0sV0FBVyxLQUFLLElBQUksR0FBRyxRQUFRLFdBQVc7QUFBQSxNQUNoRCxNQUFNLFlBQVksS0FBSyxJQUFJLFlBQVksYUFBYSxRQUFRO0FBQUEsTUFDNUQsSUFBSSxhQUFhLEdBQUc7QUFBQSxRQUFFLFlBQVk7QUFBQSxRQUFNO0FBQUEsTUFBTztBQUFBLE1BQy9DLElBQUksVUFBVSxJQUFJLEdBQUcsR0FBRyxHQUFHLE9BQU8sV0FBVyxHQUFHLGFBQWEsR0FBRyxPQUFPLFNBQVM7QUFBQSxNQUNoRixlQUFlO0FBQUEsTUFDZjtBQUFBLE1BQ0EsS0FBSyxLQUFLO0FBQUEsTUFDVixHQUFHLFFBQVE7QUFBQSxJQUNiO0FBQUEsSUFHQSxNQUFNLGNBQWMsT0FBTyxLQUFLLElBQUksS0FBSyxFQUFFO0FBQUEsSUFHM0MsSUFBSSxZQUFZO0FBQUEsSUFDaEIsSUFBSSxjQUFjLFdBQVc7QUFBQSxNQUMzQixNQUFNLFVBQVUsSUFBSSxnQkFBZ0IsU0FBUyxLQUFLLElBQUksR0FBRyxXQUFXLENBQUM7QUFBQSxNQUNyRSxNQUFNLE9BQU8sUUFBUSxXQUFXLElBQUk7QUFBQSxNQUNwQyxLQUFLLFVBQVUsUUFBUSxHQUFHLENBQUM7QUFBQSxNQUMzQixZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0EsTUFBTSxPQUFPLE1BQU0sYUFBYSxTQUFTO0FBQUEsSUFDekMsTUFBTSxTQUFTLE1BQU0sa0JBQWtCLElBQUk7QUFBQSxJQUMzQyxPQUFPLEVBQUMsTUFBTSxRQUFRLFVBQVM7QUFBQTtBQUFBLEVBSWpDLElBQU0sb0JBQW9CLE9BQ3hCLE9BQ0EsVUFDQSxXQUNBLFlBQ21HO0FBQUEsSUFDbkcsTUFBTSxNQUFNLE1BQU0sT0FBTyxLQUFLLElBQUksS0FBSztBQUFBLElBQ3ZDLE1BQU0sU0FBUyxLQUFLLE9BQU87QUFBQSxJQU8zQixNQUFNLE9BQU8sT0FBTyxFQUFDLE1BQU0sZ0JBQWUsQ0FBQztBQUFBLElBQzNDLElBQUk7QUFBQSxJQUNKLElBQUksT0FBMEI7QUFBQSxJQUM5QixJQUFJO0FBQUEsTUFDRixPQUFPLE1BQU0saUJBQWlCLE9BQU8sV0FBVyxPQUFPO0FBQUEsTUFDdkQsSUFBSSxDQUFDO0FBQUEsUUFBTSxPQUFPO0FBQUEsTUFDbEIsTUFBTSxTQUFTLEtBQUs7QUFBQSxNQUNwQixVQUFVLE1BQU0sT0FBTyxLQUFLLGtCQUFrQixVQUFVLEVBQUMsUUFBUSxNQUFLLENBQUM7QUFBQSxNQUN2RSxPQUFPLEdBQUc7QUFBQSxNQUNWLFFBQVEsS0FBSyxLQUFLLDRCQUE0QixDQUFDO0FBQUEsTUFDL0MsT0FBTztBQUFBLGNBQ1A7QUFBQSxNQUNBLE1BQU0sT0FBTyxPQUFPLEVBQUMsTUFBTSxnQkFBZSxDQUFDO0FBQUE7QUFBQSxJQUc3QyxNQUFNLEtBQUssTUFBTSxnQkFBZ0IsT0FBTztBQUFBLElBR3hDLE1BQU0sS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDO0FBQUEsSUFDcEQsTUFBTSxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUM7QUFBQSxJQUNwRCxNQUFNLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxJQUFJLEdBQUcsUUFBUSxJQUFJLEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUFBLElBQzdFLE1BQU0sS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLElBQUksR0FBRyxTQUFTLElBQUksS0FBSyxNQUFNLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQUEsSUFDOUUsTUFBTSxTQUFTLElBQUksZ0JBQWdCLElBQUksRUFBRTtBQUFBLElBQ3pDLE1BQU0sTUFBTSxPQUFPLFdBQVcsSUFBSTtBQUFBLElBQ2xDLElBQUksVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksRUFBRTtBQUFBLElBQzlDLEdBQUcsUUFBUTtBQUFBLElBQ1gsTUFBTSxPQUFPLE1BQU0sYUFBYSxNQUFNO0FBQUEsSUFDdEMsTUFBTSxTQUFTLE1BQU0sa0JBQWtCLElBQUk7QUFBQSxJQU8zQyxNQUFNLFdBQThCO0FBQUEsTUFDbEMsU0FBUyxFQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsS0FBSyxFQUFDO0FBQUEsTUFDcEQsY0FBYyxFQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRTtBQUFBLE1BQ3pDLFdBQVcsRUFBQyxHQUFHLElBQUksR0FBRyxHQUFFO0FBQUEsTUFDeEIsS0FBSyxLQUFLO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPLEVBQUMsTUFBTSxRQUFRLFFBQVEsU0FBUTtBQUFBO0FBQUEsRUFJeEMsSUFBTSxpQkFBaUIsT0FDckIsT0FDQSxhQUMwRjtBQUFBLElBQzFGLE1BQU0sTUFBTSxNQUFNLE9BQU8sS0FBSyxJQUFJLEtBQUs7QUFBQSxJQUN2QyxNQUFNLFNBQVMsS0FBSyxPQUFPO0FBQUEsSUFDM0IsTUFBTSxPQUFPLE9BQU8sRUFBQyxNQUFNLGdCQUFlLENBQUM7QUFBQSxJQUMzQyxJQUFJLFdBQXlFO0FBQUEsSUFDN0UsSUFBSTtBQUFBLE1BQ0YsV0FBVyxNQUFNLFdBQVcsT0FBTyxRQUFRO0FBQUEsY0FDM0M7QUFBQSxNQUNBLE1BQU0sT0FBTyxPQUFPLEVBQUMsTUFBTSxnQkFBZSxDQUFDO0FBQUE7QUFBQSxJQUU3QyxJQUFJLENBQUM7QUFBQSxNQUFVLE9BQU87QUFBQSxJQUN0QixPQUFPLEtBQUksVUFBVSxPQUFNO0FBQUE7QUFBQSxFQW1CN0IsSUFBTSwyQkFBMkIsQ0FBQyxTQUNoQyxtSUFBbUksS0FBSyxJQUFJO0FBQUEsRUFFOUksSUFBTSxnQkFBZ0IsT0FBTyxTQUFnQztBQUFBLElBQzNELE1BQU0sTUFBTSxNQUFNLEtBQUssWUFBWTtBQUFBLElBQ25DLE1BQU0sUUFBUSxJQUFJLFdBQVcsR0FBRztBQUFBLElBR2hDLElBQUksU0FBUztBQUFBLElBQ2IsTUFBTSxRQUFRO0FBQUEsSUFDZCxTQUFTLElBQUksRUFBRyxJQUFJLE1BQU0sUUFBUSxLQUFLLE9BQU87QUFBQSxNQUM1QyxVQUFVLE9BQU8sYUFBYSxNQUFNLE1BQU0sTUFBTSxLQUFLLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7QUFBQSxJQUNwRjtBQUFBLElBQ0EsTUFBTSxPQUFPLEtBQUssUUFBUTtBQUFBLElBQzFCLE9BQU8sUUFBUSxlQUFlLEtBQUssTUFBTTtBQUFBO0FBQUEsRUFHM0MsSUFBTSxlQUFlLE9BQ25CLE1BQ0EsV0FDQSxVQUNBLFNBQVMsa0JBQ2M7QUFBQSxJQUN2QixNQUFNLFVBQVUsU0FBUyxHQUFHLFVBQVUsYUFBYTtBQUFBLElBQ25ELE1BQU0sV0FBVyxhQUFhLGFBQWE7QUFBQSxJQUMzQyxRQUFRLElBQUksS0FBSyxzQkFBc0IsRUFBQyxVQUFVLE1BQU0sS0FBSyxNQUFNLE1BQU0sS0FBSyxLQUFJLENBQUM7QUFBQSxJQUNuRixNQUFNLE1BQU0sTUFBTSxjQUFjLElBQUk7QUFBQSxJQUNwQyxNQUFNLGFBQWEsTUFBTSxJQUFJLFFBQWdCLENBQUMsU0FBUyxXQUFXO0FBQUEsTUFDaEUsT0FBTyxVQUFVLFNBQ2YsRUFBQyxLQUFLLFVBQVUsVUFBVSxnQkFBZ0IsWUFBVyxHQUNyRCxDQUFDLE9BQU87QUFBQSxRQUNOLElBQUksT0FBTyxRQUFRLFdBQVc7QUFBQSxVQUM1QixRQUFRLE1BQU0sS0FBSyx3Q0FBd0MsT0FBTyxRQUFRLFNBQVM7QUFBQSxVQUNuRixPQUFPLElBQUksTUFBTSxPQUFPLFFBQVEsVUFBVSxXQUFXLGlCQUFpQixDQUFDO0FBQUEsVUFDdkU7QUFBQSxRQUNGO0FBQUEsUUFDQSxJQUFJLE1BQU0sTUFBTTtBQUFBLFVBQ2QsUUFBUSxNQUFNLEtBQUssMENBQTBDO0FBQUEsVUFDN0QsT0FBTyxJQUFJLE1BQU0seUJBQXlCLENBQUM7QUFBQSxVQUMzQztBQUFBLFFBQ0Y7QUFBQSxRQUNBLFFBQVEsRUFBRTtBQUFBLE9BRWQ7QUFBQSxLQUNEO0FBQUEsSUFDRCxRQUFRLElBQUksS0FBSyxzQ0FBc0MsRUFBQyxJQUFJLFlBQVksU0FBUSxDQUFDO0FBQUEsSUFLakYsSUFBSSxVQUFVLEdBQUcsYUFBYTtBQUFBLElBQzlCLElBQUk7QUFBQSxJQUNKLElBQUksbUJBQW1CO0FBQUEsSUFDdkIsU0FBUyxVQUFVLEVBQUcsVUFBVSxLQUFLLFdBQVc7QUFBQSxNQUM5QyxJQUFJO0FBQUEsUUFDRixNQUFNLFFBQVEsTUFBTSxPQUFPLFVBQVUsT0FBTyxFQUFDLElBQUksV0FBVSxDQUFDO0FBQUEsUUFDNUQsTUFBTSxPQUFPLFFBQVE7QUFBQSxRQUNyQixJQUFJLE1BQU07QUFBQSxVQUFVLFVBQVUsS0FBSztBQUFBLFFBQ25DLGdCQUFnQixNQUFNO0FBQUEsUUFDdEIsSUFBSSxNQUFNLFVBQVUsZUFBZTtBQUFBLFVBQ2pDLG1CQUFtQix1QkFBdUIsS0FBSyxRQUFRLEtBQUssS0FBSyxVQUFVO0FBQUEsVUFDM0U7QUFBQSxRQUNGO0FBQUEsUUFDQSxJQUFJLE1BQU0sVUFBVSxjQUFjLEtBQUs7QUFBQSxVQUFVO0FBQUEsUUFDakQsT0FBTyxHQUFHO0FBQUEsUUFBRSxRQUFRLEtBQUssS0FBSywyQkFBMkIsQ0FBQztBQUFBO0FBQUEsTUFDNUQsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFBQSxJQUM3QztBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQWtCLE1BQU0sSUFBSSxNQUFNLGdCQUFnQjtBQUFBLElBQ3RELElBQUksa0JBQWtCLFlBQVk7QUFBQSxNQUNoQyxNQUFNLElBQUksTUFBTSw0QkFBNEIsZ0JBQWdCLFlBQVksbUJBQW1CLElBQUk7QUFBQSxJQUNqRztBQUFBLElBQ0EsTUFBTSxXQUFXLHlCQUF5QixPQUFPO0FBQUEsSUFLakQsTUFBTSxXQUFXLFdBQVcsZUFBZSxhQUFhO0FBQUEsSUFDeEQsUUFBUSxJQUFJLEtBQUssMEJBQTBCLEVBQUMsU0FBUyxTQUFTLFVBQVUsVUFBVSxjQUFhLENBQUM7QUFBQSxJQUNoRyxPQUFPLEVBQUMsU0FBUyxHQUFHLGFBQWEsV0FBVyxTQUFTLFVBQVUsVUFBVSxjQUFhO0FBQUE7QUFBQSxFQUd4RixJQUFNLG1CQUFtQixPQUN2QixNQUNBLFdBQ0EsVUFDQSxNQUNBLFNBQVMsY0FDYztBQUFBLElBQ3ZCLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBQyxNQUFNLEtBQUksQ0FBQztBQUFBLElBQzFDLE9BQU8sYUFBYSxNQUFNLFdBQVcsVUFBVSxNQUFNO0FBQUE7QUFBQSxFQUd2RCxJQUFNLG9CQUFvQixPQUN4QixPQUNBLFdBQ0EsVUFDQSxNQUNBLFNBQVMsY0FDYztBQUFBLElBQ3ZCLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxLQUE0QixHQUFHLEVBQUMsTUFBTSxLQUFJLENBQUM7QUFBQSxJQUNsRSxPQUFPLGFBQWEsTUFBTSxXQUFXLFVBQVUsTUFBTTtBQUFBO0FBQUEsRUFJdkQsT0FBTyxRQUFRLFVBQVUsWUFBWSxDQUFDLEtBQW1DLFFBQVEsaUJBQWlCO0FBQUEsSUFDaEcsSUFBSSxDQUFDLE9BQU8sSUFBSSxTQUFTO0FBQUEsTUFBTSxPQUFPO0FBQUEsSUFFdEMsSUFBSSxJQUFJLFNBQVMsc0JBQXNCO0FBQUEsT0FDL0IsWUFBWTtBQUFBLFFBQ2hCLElBQUk7QUFBQSxVQUNGLE1BQU0sT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLE9BQU8sS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLElBQ3RELE1BQU0sT0FBTyxLQUFLLE1BQU0sRUFBQyxRQUFRLE1BQU0sZUFBZSxLQUFJLENBQUM7QUFBQSxVQUMvRCxNQUFNLE1BQU0sS0FBSztBQUFBLFVBQ2pCLElBQUksQ0FBQyxLQUFLLFVBQVU7QUFBQSxZQUFFLGFBQWEsRUFBQyxPQUFPLGdCQUFlLENBQUM7QUFBQSxZQUFHO0FBQUEsVUFBUTtBQUFBLFVBQ3RFLE1BQU0sVUFBVSxNQUFNLE9BQU8sS0FBSyxrQkFBa0IsSUFBSSxVQUFVLEVBQUMsUUFBUSxNQUFLLENBQUM7QUFBQSxVQUNqRixhQUFhLEVBQUMsUUFBTyxDQUFDO0FBQUEsVUFDdEIsT0FBTyxHQUFHO0FBQUEsVUFBRSxhQUFhLEVBQUMsT0FBTyxPQUFRLEdBQWEsV0FBVyxDQUFDLEVBQUMsQ0FBQztBQUFBO0FBQUEsU0FDckU7QUFBQSxNQUNILE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQSxJQUFJLElBQUksU0FBUyxpQkFBaUI7QUFBQSxPQUMxQixZQUFZO0FBQUEsUUFDaEIsSUFBSTtBQUFBLFVBQ0YsTUFBTSxPQUFPLE1BQU0sT0FBTyxLQUFLLE1BQU0sRUFBQyxLQUFLLElBQUksSUFBRyxDQUFDO0FBQUEsVUFDbkQsSUFBSSxLQUFLLFVBQVUsS0FBSyxJQUFJLE1BQU0sTUFBTTtBQUFBLFlBQ3RDLE1BQU0sT0FBTyxLQUFLLE9BQU8sS0FBSyxHQUFHLElBQUksRUFBQyxRQUFRLEtBQUksQ0FBQztBQUFBLFlBQ25ELElBQUksS0FBSyxHQUFHLFlBQVk7QUFBQSxjQUFNLE1BQU0sT0FBTyxRQUFRLE9BQU8sS0FBSyxHQUFHLFVBQVUsRUFBQyxTQUFTLEtBQUksQ0FBQztBQUFBLFlBQzNGLGFBQWEsRUFBQyxPQUFPLEtBQUksQ0FBQztBQUFBLFVBQzVCLEVBQU8sU0FBSSxJQUFJLGVBQWU7QUFBQSxZQUM1QixNQUFNLElBQUksTUFBTSxPQUFPLEtBQUssT0FBTyxFQUFDLEtBQUssSUFBSSxLQUFLLFFBQVEsS0FBSSxDQUFDO0FBQUEsWUFDL0QsYUFBYSxFQUFDLE9BQU8sT0FBTyxRQUFRLEVBQUUsR0FBRSxDQUFDO0FBQUEsVUFDM0MsRUFBTztBQUFBLHlCQUFhLEVBQUMsT0FBTyxNQUFLLENBQUM7QUFBQSxVQUNsQyxPQUFPLEdBQUc7QUFBQSxVQUFFLGFBQWEsRUFBQyxPQUFPLE9BQVEsR0FBYSxXQUFXLENBQUMsRUFBQyxDQUFDO0FBQUE7QUFBQSxTQUNyRTtBQUFBLE1BQ0gsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLElBQUksSUFBSSxTQUFTLGtCQUFrQjtBQUFBLE9BQzNCLFlBQVk7QUFBQSxRQUNoQixJQUFJO0FBQUEsVUFDRixNQUFNLE9BQU8sTUFBTSxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUM7QUFBQSxVQUN2QyxhQUFhLEVBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxFQUFFLEtBQUssT0FBTyxFQUFFLE1BQUssRUFBRSxFQUFDLENBQUM7QUFBQSxVQUNuRyxPQUFPLEdBQUc7QUFBQSxVQUFFLGFBQWEsRUFBQyxPQUFPLE9BQVEsR0FBYSxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBQyxDQUFDO0FBQUE7QUFBQSxTQUMvRTtBQUFBLE1BQ0gsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUVBLElBQUksSUFBSSxTQUFTLGtCQUFrQixJQUFJLFNBQVMsZ0JBQWdCLElBQUksU0FBUyxhQUFhO0FBQUEsT0FDbEYsWUFBWTtBQUFBLFFBQ2hCLElBQUk7QUFBQSxVQUNGLE1BQU0sUUFBUSxJQUFJLFNBQVMsT0FBTyxLQUFLO0FBQUEsVUFDdkMsSUFBSSxnQkFBZ0I7QUFBQSxVQUNwQixJQUFJO0FBQUEsVUFDSixJQUFJLGlCQUFpQixNQUFNO0FBQUEsWUFDekIsTUFBTSxPQUFPLE1BQU0sT0FBTyxLQUFLLE1BQU0sRUFBQyxRQUFRLE1BQU0sZUFBZSxLQUFJLENBQUM7QUFBQSxZQUN4RSxnQkFBZ0IsS0FBSyxJQUFJO0FBQUEsWUFDekIsV0FBVyxLQUFLLElBQUk7QUFBQSxVQUN0QixFQUFPO0FBQUEsWUFDTCxNQUFNLElBQUksTUFBTSxPQUFPLEtBQUssSUFBSSxhQUFhO0FBQUEsWUFDN0MsV0FBVyxHQUFHO0FBQUE7QUFBQSxVQUVoQixJQUFJLGlCQUFpQixRQUFRLFlBQVksTUFBTTtBQUFBLFlBQzdDLGFBQWEsRUFBQyxJQUFJLE9BQU8sT0FBTyxnQkFBZSxDQUFxQjtBQUFBLFlBQ3BFO0FBQUEsVUFDRjtBQUFBLFVBQ0EsTUFBTSxhQUFhO0FBQUEsVUFDbkIsTUFBTSxnQkFBZ0I7QUFBQSxVQUN0QixNQUFNLFFBQVEsWUFBWSxZQUFZO0FBQUEsWUFDcEMsSUFBSTtBQUFBLGNBQ0YsTUFBTSxRQUFRLE1BQU0sUUFBUSxLQUFLLFlBQVksYUFBYTtBQUFBLGNBQzFELGFBQWEsS0FBSztBQUFBLGNBQ2xCLE9BQU8sR0FBRztBQUFBLGNBQ1YsYUFBYSxFQUFDLElBQUksT0FBTyxPQUFPLE9BQVEsR0FBYSxXQUFXLENBQUMsRUFBQyxDQUFxQjtBQUFBO0FBQUEsV0FFMUY7QUFBQSxVQUNELE9BQU8sR0FBRztBQUFBLFVBQ1YsYUFBYSxFQUFDLElBQUksT0FBTyxPQUFPLE9BQVEsR0FBYSxXQUFXLENBQUMsRUFBQyxDQUFxQjtBQUFBO0FBQUEsU0FFeEY7QUFBQSxNQUNILE9BQU87QUFBQSxJQUNUO0FBQUEsSUFNQSxJQUFJLElBQUksU0FBUyxzQkFBc0I7QUFBQSxPQUMvQixZQUFZO0FBQUEsUUFDaEIsSUFBSTtBQUFBLFVBQ0YsTUFBTSxRQUFRLElBQUksU0FBUyxPQUFPLEtBQUs7QUFBQSxVQUN2QyxJQUFJLGdCQUFnQjtBQUFBLFVBQ3BCLElBQUk7QUFBQSxVQUNKLElBQUksaUJBQWlCLE1BQU07QUFBQSxZQUN6QixNQUFNLE9BQU8sTUFBTSxPQUFPLEtBQUssTUFBTSxFQUFDLFFBQVEsTUFBTSxlQUFlLEtBQUksQ0FBQztBQUFBLFlBQ3hFLGdCQUFnQixLQUFLLElBQUk7QUFBQSxZQUN6QixXQUFXLEtBQUssSUFBSTtBQUFBLFVBQ3RCLEVBQU87QUFBQSxZQUNMLE1BQU0sSUFBSSxNQUFNLE9BQU8sS0FBSyxJQUFJLGFBQWE7QUFBQSxZQUM3QyxXQUFXLEdBQUc7QUFBQTtBQUFBLFVBRWhCLElBQUksaUJBQWlCLFFBQVEsWUFBWSxNQUFNO0FBQUEsWUFDN0MsYUFBYSxFQUFDLElBQUksT0FBTyxPQUFPLGdCQUFlLENBQUM7QUFBQSxZQUNoRDtBQUFBLFVBQ0Y7QUFBQSxVQUNBLE1BQU0sYUFBYTtBQUFBLFVBQ25CLE1BQU0sZ0JBQWdCO0FBQUEsVUFDdEIsTUFBTSxRQUFRLFlBQVksWUFBWTtBQUFBLFlBQ3BDLElBQUk7QUFBQSxjQUNGLE1BQU0sTUFBTSxNQUFNLGVBQWUsWUFBWSxhQUFhO0FBQUEsY0FDMUQsSUFBSSxDQUFDLEtBQUs7QUFBQSxnQkFBRSxhQUFhLEVBQUMsSUFBSSxPQUFPLE9BQU8saUJBQWdCLENBQUM7QUFBQSxnQkFBRztBQUFBLGNBQVE7QUFBQSxjQUN4RSxNQUFNLGFBQWEsTUFBTSxrQkFBa0IsSUFBSSxJQUFJO0FBQUEsY0FDbkQsSUFBSSxPQUFPLFFBQVE7QUFBQSxjQUluQixhQUFhLEVBQUMsSUFBSSxNQUFNLFlBQVksU0FBUyxJQUFJLFVBQVMsQ0FBQztBQUFBLGNBQzNELE9BQU8sR0FBRztBQUFBLGNBQ1YsYUFBYSxFQUFDLElBQUksT0FBTyxPQUFPLE9BQVEsR0FBYSxXQUFXLENBQUMsRUFBQyxDQUFDO0FBQUE7QUFBQSxXQUV0RTtBQUFBLFVBQ0QsT0FBTyxHQUFHO0FBQUEsVUFDVixhQUFhLEVBQUMsSUFBSSxPQUFPLE9BQU8sT0FBUSxHQUFhLFdBQVcsQ0FBQyxFQUFDLENBQUM7QUFBQTtBQUFBLFNBRXBFO0FBQUEsTUFDSCxPQUFPO0FBQUEsSUFDVDtBQUFBLElBRUEsSUFBSSxJQUFJLFNBQVMsZUFBZSxJQUFJLFNBQVMsY0FBYztBQUFBLE9BQ25ELFlBQVk7QUFBQSxRQUNoQixJQUFJO0FBQUEsVUFDRixJQUFJO0FBQUEsVUFDSixNQUFNLFlBQVksT0FBTyxJQUFJLGFBQWEsU0FBUztBQUFBLFVBQ25ELE1BQU0sV0FBVyxPQUFPLElBQUksWUFBWSxZQUFZO0FBQUEsVUFDcEQsTUFBTSxPQUFPLE9BQU8sSUFBSSxRQUFRLDBCQUEwQjtBQUFBLFVBQzFELE1BQU0sU0FBUyxPQUFPLElBQUksVUFBVSxTQUFTO0FBQUEsVUFDN0MsSUFBSSxJQUFJLFNBQVMsYUFBYTtBQUFBLFlBQzVCLFNBQVMsTUFBTSxpQkFBaUIsT0FBTyxJQUFJLFFBQVEsRUFBRSxHQUFHLFdBQVcsVUFBVSxNQUFNLE1BQU07QUFBQSxVQUMzRixFQUFPO0FBQUEsWUFJTCxNQUFNLE1BQVcsSUFBSTtBQUFBLFlBQ3JCLElBQUk7QUFBQSxZQUNKLElBQUksZUFBZTtBQUFBLGNBQVksUUFBUTtBQUFBLFlBQ2xDLFNBQUksTUFBTSxRQUFRLEdBQUc7QUFBQSxjQUFHLFFBQVEsV0FBVyxLQUFLLEdBQUc7QUFBQSxZQUNuRCxTQUFJLE9BQU8sT0FBTyxRQUFRLFVBQVU7QUFBQSxjQUN2QyxNQUFNLE9BQU8sT0FBTyxPQUFPLEdBQUc7QUFBQSxjQUM5QixRQUFRLFdBQVcsS0FBSyxJQUFJO0FBQUEsWUFDOUIsRUFBTztBQUFBLHNCQUFRLElBQUk7QUFBQSxZQUNuQixRQUFRLElBQUksS0FBSyxzQkFBc0IsRUFBQyxPQUFPLE1BQU0sUUFBUSxTQUFTLE9BQU8sS0FBSyxTQUFTLE1BQU0sUUFBUSxHQUFHLEdBQUcsTUFBTSxlQUFlLFdBQVUsQ0FBQztBQUFBLFlBQy9JLFNBQVMsTUFBTSxrQkFBa0IsT0FBTyxXQUFXLFVBQVUsTUFBTSxNQUFNO0FBQUE7QUFBQSxVQUUzRSxhQUFhO0FBQUEsWUFDWCxJQUFJO0FBQUEsWUFBTSxVQUFVLE9BQU87QUFBQSxZQUFTLFNBQVMsT0FBTztBQUFBLFlBQ3BELFVBQVUsT0FBTztBQUFBLFlBQVUsVUFBVSxPQUFPO0FBQUEsWUFBVSxlQUFlLE9BQU87QUFBQSxVQUM5RSxDQUFDO0FBQUEsVUFDRCxPQUFPLEdBQUc7QUFBQSxVQUNWLGFBQWEsRUFBQyxJQUFJLE9BQU8sT0FBTyxPQUFRLEdBQWEsV0FBVyxDQUFDLEVBQUMsQ0FBQztBQUFBO0FBQUEsU0FFcEU7QUFBQSxNQUNILE9BQU87QUFBQSxJQUNUO0FBQUEsSUF1QkEsS0FBSyxJQUFJLFNBQVMsYUFBYSxJQUFJLFNBQVMsa0JBQWtCLE9BQU8sS0FBSyxNQUFNLE1BQU07QUFBQSxNQUNwRixPQUFPLFVBQVUsS0FBSyxFQUFDLE9BQU8sT0FBTyxJQUFJLEdBQUUsQ0FBQyxFQUFFLE1BQU0sTUFBTSxFQUFzQjtBQUFBLE1BUWhGLG1CQUFtQixHQUE2QjtBQUFBLElBQ2xEO0FBQUEsSUFNQSxPQUFPO0FBQUEsR0FDUjtBQUFBLEVBUUQsSUFBTSxtQkFBbUIsQ0FBQyxJQUFJLEtBQUssR0FBRztBQUFBLEVBQ3RDLElBQU0scUJBQXFCLENBQUMsYUFBMkM7QUFBQSxJQUNyRSxXQUFXLFNBQVMsa0JBQWtCO0FBQUEsTUFDcEMsV0FBVyxNQUFNO0FBQUEsUUFJZixJQUFJO0FBQUEsVUFBTyxPQUFPLFFBQVEsWUFBWSxRQUFRLEVBQUUsUUFBUSxNQUFNLEVBQW9CO0FBQUEsVUFDbEYsTUFBTTtBQUFBLFNBQ0wsS0FBSztBQUFBLElBQ1Y7QUFBQTtBQUFBLEVBUUYsSUFBTSxvQkFBb0IsT0FBTyxTQUFnQztBQUFBLElBQy9ELE1BQU0sTUFBTSxNQUFNLEtBQUssWUFBWTtBQUFBLElBQ25DLE1BQU0sUUFBUSxJQUFJLFdBQVcsR0FBRztBQUFBLElBQ2hDLElBQUksU0FBUztBQUFBLElBQ2IsTUFBTSxRQUFRO0FBQUEsSUFDZCxTQUFTLElBQUksRUFBRyxJQUFJLE1BQU0sUUFBUSxLQUFLLE9BQU87QUFBQSxNQUM1QyxVQUFVLE9BQU8sYUFBYSxNQUFNLE1BQU0sTUFBTSxLQUFLLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7QUFBQSxJQUNwRjtBQUFBLElBQ0EsT0FBTyx5QkFBeUIsS0FBSyxNQUFNO0FBQUE7QUFBQSxFQUc3QyxJQUFNLFVBQVUsT0FBTyxLQUFVLE9BQWUsYUFBeUM7QUFBQSxJQUN2RixNQUFNLEtBQUssSUFBSSxLQUFLLEVBQUUsWUFBWTtBQUFBLElBQ2xDLE1BQU0sVUFBVSxPQUFPLElBQUksWUFBWSxXQUFXLElBQUksVUFBVTtBQUFBLElBQ2hFLElBQUksSUFBSSxTQUFTLGdCQUFnQjtBQUFBLE1BQy9CLE1BQU0sT0FBTSxNQUFNLGtCQUFrQixPQUFPLFVBQVUsQ0FBQyxJQUFJLFFBQVEsR0FBRyxPQUFPO0FBQUEsTUFDNUUsSUFBSSxDQUFDO0FBQUEsUUFBSyxPQUFPLEVBQUMsSUFBSSxPQUFPLE9BQU8saUJBQWdCO0FBQUEsTUFDcEQsTUFBTSxZQUFXLGNBQWMsV0FBVyxJQUFJLElBQUksR0FBRyxLQUFJLE1BQU07QUFBQSxNQUMvRCxNQUFNLFVBQVMsTUFBTSxhQUFhLEtBQUksTUFBTSxJQUFJLFdBQVcsU0FBUTtBQUFBLE1BQ25FLE1BQU0sV0FBVSxNQUFNLGNBQWMsS0FBSSxNQUFNO0FBQUEsTUFDOUMsTUFBTSxlQUFjLE1BQU0sa0JBQWtCLEtBQUksSUFBSTtBQUFBLE1BQ3BELEtBQUksT0FBTyxRQUFRO0FBQUEsTUFDbkIsT0FBTztBQUFBLFFBQ0wsSUFBSTtBQUFBLFFBQU0sVUFBVSxRQUFPO0FBQUEsUUFBUyxTQUFTLFFBQU87QUFBQSxRQUNwRCxVQUFVLFFBQU87QUFBQSxRQUFVLFVBQVUsUUFBTztBQUFBLFFBQVUsZUFBZSxRQUFPO0FBQUEsUUFDNUU7QUFBQSxRQUFTO0FBQUEsUUFDVCxNQUFNLEtBQUk7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsSUFBSSxJQUFJLFNBQVMsY0FBYztBQUFBLE1BQzdCLE1BQU0sT0FBTSxNQUFNLGtCQUFrQixPQUFPLFVBQVUsSUFBSSxXQUFXLE9BQU87QUFBQSxNQUMzRSxJQUFJLENBQUM7QUFBQSxRQUFLLE9BQU8sRUFBQyxJQUFJLE9BQU8sT0FBTyxpQkFBZ0I7QUFBQSxNQUNwRCxNQUFNLFlBQVcsY0FBYyxTQUFTLElBQUksSUFBSSxHQUFHLEtBQUksUUFBUSxFQUFDLE9BQU8sSUFBSSxVQUFVLE9BQU0sQ0FBQztBQUFBLE1BQzVGLE1BQU0sVUFBUyxNQUFNLGFBQWEsS0FBSSxNQUFNLElBQUksV0FBVyxTQUFRO0FBQUEsTUFDbkUsTUFBTSxXQUFVLE1BQU0sY0FBYyxLQUFJLE1BQU07QUFBQSxNQUM5QyxNQUFNLGVBQWMsTUFBTSxrQkFBa0IsS0FBSSxJQUFJO0FBQUEsTUFDcEQsS0FBSSxPQUFPLFFBQVE7QUFBQSxNQUNuQixPQUFPO0FBQUEsUUFDTCxJQUFJO0FBQUEsUUFBTSxVQUFVLFFBQU87QUFBQSxRQUFTLFNBQVMsUUFBTztBQUFBLFFBQ3BELFVBQVUsUUFBTztBQUFBLFFBQVUsVUFBVSxRQUFPO0FBQUEsUUFBVSxlQUFlLFFBQU87QUFBQSxRQUM1RTtBQUFBLFFBQVM7QUFBQSxRQUNULE1BQU0sS0FBSTtBQUFBLE1BQ1o7QUFBQSxJQUNGO0FBQUEsSUFFQSxNQUFNLE1BQU0sTUFBTSxlQUFlLE9BQU8sUUFBUTtBQUFBLElBQ2hELElBQUksQ0FBQztBQUFBLE1BQUssT0FBTyxFQUFDLElBQUksT0FBTyxPQUFPLGlCQUFnQjtBQUFBLElBQ3BELE1BQU0sV0FBVyxjQUFjLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUMsV0FBVyxJQUFJLFVBQVMsQ0FBQztBQUFBLElBQ3hGLE1BQU0sU0FBUyxNQUFNLGFBQWEsSUFBSSxNQUFNLElBQUksV0FBVyxRQUFRO0FBQUEsSUFDbkUsTUFBTSxVQUFVLE1BQU0sY0FBYyxJQUFJLE1BQU07QUFBQSxJQUM5QyxNQUFNLGNBQWMsTUFBTSxrQkFBa0IsSUFBSSxJQUFJO0FBQUEsSUFDcEQsSUFBSSxPQUFPLFFBQVE7QUFBQSxJQUNuQixPQUFPO0FBQUEsTUFDTCxJQUFJO0FBQUEsTUFBTSxVQUFVLE9BQU87QUFBQSxNQUFTLFNBQVMsT0FBTztBQUFBLE1BQ3BELFVBQVUsT0FBTztBQUFBLE1BQVUsVUFBVSxPQUFPO0FBQUEsTUFBVSxlQUFlLE9BQU87QUFBQSxNQUM1RTtBQUFBLE1BQVM7QUFBQSxNQUFhLFdBQVcsSUFBSTtBQUFBLElBQ3ZDO0FBQUE7IiwKICAiZGVidWdJZCI6ICIwMTkxMjZEQzc1QkZEMEExNjQ3NTZFMjE2NDc1NkUyMSIsCiAgIm5hbWVzIjogW10KfQ==
