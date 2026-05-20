(() => {
  // src/types.ts
  var _midCounter = 0;
  var newMid = () => `${Date.now().toString(36)}-${(++_midCounter).toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  var pg = (payload) => ({ __pg: true, __mid: newMid(), ...payload });

  // src/lucide.ts
  var ICONS = {
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    "trash-2": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    minus: '<path d="M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    "circle-dot": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
    crosshair: '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "panel-left-close": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    "message-square-plus": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" x2="15" y1="10" y2="10"/><line x1="12" x2="12" y1="7" y2="13"/>',
    "alert-circle": '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    "refresh-cw": '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    "file-text": '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
    "file-code": '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    pinch: '<path d="M5 5c3 2 5 4 7 7-2 3-4 5-7 7"/><path d="M19 5c-3 2-5 4-7 7 2 3 4 5 7 7"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
    "star-filled": '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>',
    pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
    redo: '<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 15-6.7L21 13"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    "circle-check": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    grip: '<circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    "list-tree": '<path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/>',
    split: '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="m21 3-7.46 7.46a2 2 0 0 0 0 2.83L21 21"/><path d="M3 3l7.46 7.46a2 2 0 0 1 0 2.83L3 21"/>',
    package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>'
  };
  var wrap = (body, size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  var PG_ICONS = {
    has: (name) => (name in ICONS),
    svgString: (name, size = 16) => {
      const body = ICONS[name];
      if (!body) {
        console.warn("[lucide] missing icon", name);
        return "";
      }
      return wrap(body, size);
    },
    mount: (el, name, size) => {
      if (el)
        el.innerHTML = PG_ICONS.svgString(name, size);
    }
  };
  if (typeof globalThis !== "undefined") {
    globalThis.PG_ICONS = PG_ICONS;
  }

  // src/tar.ts
  var enc = new TextEncoder;
  var writeOctal = (buf, offset, value, length) => {
    let s = value.toString(8);
    s = s.padStart(length - 1, "0");
    for (let i = 0;i < length - 1; i++)
      buf[offset + i] = s.charCodeAt(i);
    buf[offset + length - 1] = 0;
  };
  var writeAscii = (buf, offset, str, length) => {
    const bytes = enc.encode(str);
    const len = Math.min(bytes.length, length);
    for (let i = 0;i < len; i++)
      buf[offset + i] = bytes[i];
  };
  var headerChecksum = (header) => {
    let sum = 0;
    for (let i = 0;i < 512; i++) {
      if (i >= 148 && i < 156)
        sum += 32;
      else
        sum += header[i] ?? 0;
    }
    return sum;
  };
  var buildTar = (entries) => {
    const blocks = [];
    const nowSec = Math.floor(Date.now() / 1000);
    for (const entry of entries) {
      const data = typeof entry.data === "string" ? enc.encode(entry.data) : entry.data;
      const name = entry.name;
      if (name.length > 100) {
        throw new Error(`tar: filename too long (${name.length} > 100 chars): ${name}`);
      }
      const header = new Uint8Array(512);
      writeAscii(header, 0, name, 100);
      writeOctal(header, 100, 420, 8);
      writeOctal(header, 108, 0, 8);
      writeOctal(header, 116, 0, 8);
      writeOctal(header, 124, data.length, 12);
      writeOctal(header, 136, entry.mtime ?? nowSec, 12);
      for (let i = 148;i < 156; i++)
        header[i] = 32;
      header[156] = 48;
      writeAscii(header, 257, "ustar", 6);
      writeAscii(header, 263, "00", 2);
      const checksum = headerChecksum(header);
      writeOctal(header, 148, checksum, 8);
      blocks.push(header);
      blocks.push(data);
      const pad = (512 - data.length % 512) % 512;
      if (pad)
        blocks.push(new Uint8Array(pad));
    }
    blocks.push(new Uint8Array(1024));
    let total = 0;
    for (const b of blocks)
      total += b.length;
    const out = new Uint8Array(total);
    let offset = 0;
    for (const b of blocks) {
      out.set(b, offset);
      offset += b.length;
    }
    return out;
  };
  var ZSTD_RAW_BLOCK_MAX = 128 * 1024;
  var wrapZstd = (data) => {
    const blocks = [];
    let pos = 0;
    while (pos < data.length || data.length === 0) {
      const remaining = data.length - pos;
      const blockSize = Math.min(remaining, ZSTD_RAW_BLOCK_MAX);
      const isLast = pos + blockSize >= data.length ? 1 : 0;
      const headerInt = isLast | 0 << 1 | blockSize << 3;
      const blockHeader = new Uint8Array([
        headerInt & 255,
        headerInt >>> 8 & 255,
        headerInt >>> 16 & 255
      ]);
      blocks.push(blockHeader);
      if (blockSize > 0)
        blocks.push(data.subarray(pos, pos + blockSize));
      pos += blockSize;
      if (data.length === 0)
        break;
    }
    const fcs = data.length;
    const fhd = 160;
    const head = new Uint8Array([
      40,
      181,
      47,
      253,
      fhd,
      fcs & 255,
      fcs >>> 8 & 255,
      fcs >>> 16 & 255,
      fcs >>> 24 & 255
    ]);
    let total = head.length;
    for (const b of blocks)
      total += b.length;
    const out = new Uint8Array(total);
    let off = 0;
    out.set(head, off);
    off += head.length;
    for (const b of blocks) {
      out.set(b, off);
      off += b.length;
    }
    return out;
  };
  var dec = new TextDecoder;

  // src/templates.gen.ts
  var TEMPLATES_PRESENT = { designTemplate: true, skillTemplate: true, localDesign: true, localSkill: true };

  // src/sidepanel.ts
  (() => {
    const LOG = "[PinchGrab/sp]";
    const PREFS_STORAGE_NAME = "pinchgrab.prefs.v2";
    const WORKSPACES_KEY = "pinchgrab.workspaces.v1";
    const inExtension = typeof chrome !== "undefined" && Boolean(chrome.runtime?.id);
    const templateCache = new Map;
    const TEMPLATE_FILES = {
      designTemplate: "DESIGN.template.md",
      skillTemplate: "PinchGrab.SKILL.template.md",
      localDesign: "local.DESIGN.md",
      localSkill: "local.SKILL.md"
    };
    const templateUrl = (file) => {
      if (inExtension && chrome.runtime?.getURL) {
        return chrome.runtime.getURL(`templates/${file}`);
      }
      return `templates/${file}`;
    };
    const loadTemplate = async (key) => {
      if (!TEMPLATES_PRESENT[key])
        return "";
      const file = TEMPLATE_FILES[key];
      const cached = templateCache.get(file);
      if (cached !== undefined)
        return cached;
      try {
        const res = await fetch(templateUrl(file));
        if (!res.ok)
          throw new Error(`status ${res.status}`);
        const text = await res.text();
        templateCache.set(file, text);
        return text;
      } catch (err) {
        console.warn(LOG, `template fetch failed: ${file}`, err);
        templateCache.set(file, "");
        return "";
      }
    };
    const resolveDesignContent = async () => {
      if (prefs.designMd && prefs.designMd.trim())
        return prefs.designMd;
      return await loadTemplate("localDesign") || await loadTemplate("designTemplate");
    };
    const resolveSkillContent = async () => {
      if (prefs.skillMd && prefs.skillMd.trim())
        return prefs.skillMd;
      return await loadTemplate("localSkill") || await loadTemplate("skillTemplate");
    };
    const isUsingTemplateDesign = () => !prefs.designMd || !prefs.designMd.trim();
    const isUsingTemplateSkill = () => !prefs.skillMd || !prefs.skillMd.trim();
    const Store = {
      async get(key, fallback) {
        if (inExtension && chrome.storage?.local) {
          try {
            const o = await chrome.storage.local.get(key);
            return o[key] ?? fallback;
          } catch {
            return fallback;
          }
        }
        try {
          const r = localStorage.getItem(key);
          return r === null ? fallback : JSON.parse(r);
        } catch {
          return fallback;
        }
      },
      async set(key, value) {
        if (inExtension && chrome.storage?.local) {
          try {
            await chrome.storage.local.set({ [key]: value });
            return;
          } catch {}
        }
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {}
      }
    };
    const $ = (s) => document.querySelector(s);
    const list = $("[data-list]");
    const composer = $("[data-composer]");
    const status = $("[data-status]");
    const search = $("[data-search]");
    const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || "");
    if (!isMac) {
      const kbdEl = document.querySelector("[data-search-kbd] kbd");
      if (kbdEl)
        kbdEl.textContent = "Ctrl+K";
    }
    const importFile = $("#import-file");
    const statsEl = $("[data-stats]");
    const starsEl = $("[data-stars]");
    const tooltipEl = $("[data-tooltip]");
    const drilldownEl = $("[data-drilldown]");
    const drawer = $("[data-drawer]");
    const palette = $("[data-palette]");
    const paletteInput = $("[data-palette-input]");
    const paletteList = $("[data-palette-list]");
    const compWords = $("[data-comp-words]");
    const compTokens = $("[data-comp-tokens]");
    const statTokens = $("[data-stat-tokens]");
    const statWords = $("[data-stat-words]");
    const wsSelect = $("[data-workspace]");
    const wsList = $("[data-ws-list]");
    const wsName = $("[data-ws-name]");
    const mountIcons = (root = document) => {
      for (const el of root.querySelectorAll("[data-icon]")) {
        const name = el.getAttribute("data-icon");
        const size = Number(el.getAttribute("data-size") ?? 16);
        if (name && PG_ICONS.has(name))
          el.innerHTML = PG_ICONS.svgString(name, size);
      }
    };
    mountIcons();
    const DEFAULT_PREFS = {
      includeOuterHTML: true,
      includeMatchedRules: true,
      includeStyles: true,
      minify: false,
      autoScrollToHovered: true,
      useScreenshots: true,
      spacingOverlay: false,
      hoverSnap: true,
      autoScreenshot: true,
      skipScreenshotHosts: "",
      designMd: "",
      designPath: "~/.agents/DESIGN.md",
      skillPath: "~/.agents/skills/PinchGrab/SKILL.md",
      skillMd: "",
      pageShotPerCapture: false
    };
    const rebrandSkillName = (md, newName) => {
      const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      if (!m)
        return md;
      const fm = m[1];
      const rebrandedFm = fm.replace(/^name:\s*.+$/m, `name: ${newName}`);
      if (rebrandedFm === fm)
        return md;
      return md.replace(m[0], `---
${rebrandedFm}
---
`);
    };
    let messages = [];
    let liveTabUrl = null;
    let liveTabPath = null;
    const selectorValidity = new Map;
    const selectorErrors = new Map;
    const insertBefore = { current: null, comment: false };
    let searchQuery = "";
    let lastActiveSelector = null;
    let stickyTimer = 0;
    let STICKY_TTL_MS = 5000;
    let panelHovered = false;
    let phantomTarget = null;
    let pendingMulti = [];
    const shots = new Map;
    const shotsFull = new Map;
    const pageShotsFired = new Set;
    const pageShotKey = (url) => `${activeWs}:${url}`;
    const lastExport = {
      relPath: null,
      absPath: null,
      copyPath: null,
      tempPath: false,
      kind: null
    };
    let workspaces = [{ name: "default", createdAt: new Date().toISOString() }];
    let activeWs = "default";
    let sessionId = "";
    const wsMsgKey = (n) => `pinchgrab.ws.${n}.messages.v1`;
    const wsShotsKey = (n) => `pinchgrab.ws.${n}.shots.v1`;
    const wsShotsFullKey = (n) => `pinchgrab.ws.${n}.shotsFull.v1`;
    const SHOTS_FULL_BUDGET_BYTES = 5 * 1024 * 1024;
    const undoStack = [];
    const redoStack = [];
    const UNDO_CAP = 30;
    let suspendSnapshots = false;
    let prefs = { ...DEFAULT_PREFS };
    let statusTimer = 0;
    const setStatus = (msg, opts = {}) => {
      status.textContent = msg || "";
      clearTimeout(statusTimer);
      if (msg) {
        status.style.color = opts.kind === "warn" ? "var(--red)" : opts.kind === "info" ? "var(--text-3)" : "var(--green)";
        statusTimer = window.setTimeout(() => {
          status.textContent = "";
        }, 2200);
      }
    };
    let toastTimer = 0;
    const showToast = (title, detail = "", kind = "ok") => {
      let toast = document.querySelector("[data-copy-toast]");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "copy-toast";
        toast.dataset.copyToast = "true";
        document.body.append(toast);
      }
      toast.classList.toggle("warn", kind === "warn");
      toast.innerHTML = `<span class="copy-toast-icon">${PG_ICONS.svgString(kind === "warn" ? "alert-circle" : "circle-check", 22)}</span>
      <span class="copy-toast-text"><b>${escapeHtml(title)}</b>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}</span>`;
      toast.hidden = false;
      toast.classList.remove("show");
      toast.offsetWidth;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toast?.classList.remove("show");
        window.setTimeout(() => {
          if (toast)
            toast.hidden = true;
        }, 180);
      }, 1450);
    };
    const showCopied = (label, detail = "") => showToast(label, detail, "ok");
    const showDownloadError = (label, detail) => showToast(label, detail, "warn");
    const msgId = () => crypto?.randomUUID ? crypto.randomUUID() : "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    const escapeHtml = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const highlightMatch = (text, q) => {
      if (!q)
        return escapeHtml(text);
      return escapeHtml(text).replace(new RegExp(`(${escapeRe(q)})`, "gi"), "<mark>$1</mark>");
    };
    const wrapSearchHitsInTextNodes = (root, q) => {
      if (!q)
        return;
      const re = new RegExp(escapeRe(q), "gi");
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const targets = [];
      let node;
      while (node = walker.nextNode()) {
        if (re.test(node.nodeValue ?? ""))
          targets.push(node);
        re.lastIndex = 0;
      }
      for (const t of targets) {
        const value = t.nodeValue ?? "";
        const frag = document.createDocumentFragment();
        let last = 0;
        for (const m of value.matchAll(re)) {
          const i = m.index ?? 0;
          if (i > last)
            frag.append(value.slice(last, i));
          const mk = document.createElement("mark");
          mk.textContent = m[0];
          frag.append(mk);
          last = i + m[0].length;
        }
        if (last < value.length)
          frag.append(value.slice(last));
        t.replaceWith(frag);
      }
    };
    const wordCount = (s) => (s.match(/\S+/g) ?? []).length;
    const tokenCount = (s) => Math.ceil(s.length / 4);
    const pathOf = (u) => {
      try {
        return new URL(u).pathname;
      } catch {
        return u;
      }
    };
    const hostOf = (u) => {
      try {
        return new URL(u).host;
      } catch {
        return "";
      }
    };
    const hostSlug = (url) => {
      const h = hostOf(url);
      if (!h)
        return "unknown";
      return h.replace(/\./g, "_").replace(/[^\w-]/g, "_").slice(0, 40) || "unknown";
    };
    const dominantHostSlug = () => {
      const counts = new Map;
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        const h = hostSlug(m.entry.url);
        counts.set(h, (counts.get(h) ?? 0) + 1);
      }
      if (!counts.size)
        return "empty";
      let best = "";
      let bestN = 0;
      for (const [h, n] of counts) {
        if (n > bestN) {
          best = h;
          bestN = n;
        }
      }
      return counts.size > 1 ? "multi" : best;
    };
    const distinctHosts = () => {
      const set = new Set;
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        const h = hostOf(m.entry.url);
        if (h)
          set.add(h);
      }
      return [...set].sort().slice(0, 20);
    };
    const buildExportFilename = (ext) => `pinchgrab-${activeWs}-${dominantHostSlug()}-${Date.now()}.${ext}`;
    const shouldSkipScreenshot = (url) => {
      const list2 = (prefs.skipScreenshotHosts ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (!list2.length)
        return false;
      const host = hostOf(url).toLowerCase();
      return list2.some((pat) => host.includes(pat));
    };
    const KEY_PALETTE = ["#ff7e78", "#ffb454", "#ffe066", "#7bd97a", "#5fd1ff", "#9b8cff", "#ff85c1", "#ff5f00", "#10b981", "#f59e0b", "#a78bfa", "#34d399"];
    const colorForKey = (k) => {
      let h = 0;
      for (let i = 0;i < k.length; i++)
        h = h * 31 + k.charCodeAt(i) >>> 0;
      return KEY_PALETTE[h % KEY_PALETTE.length];
    };
    const JSON_TOKEN_RE = /(\s+)|("(?:[^"\\]|\\.)*")|(true|false|null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g;
    const highlightJson = (text) => {
      let out = "";
      let m;
      JSON_TOKEN_RE.lastIndex = 0;
      while ((m = JSON_TOKEN_RE.exec(text)) !== null) {
        const [, ws, str, lit, num, punct] = m;
        if (ws) {
          out += escapeHtml(ws);
          continue;
        }
        if (str) {
          let k = JSON_TOKEN_RE.lastIndex;
          while (k < text.length && (text[k] === " " || text[k] === "\t" || text[k] === `
`))
            k++;
          if (text[k] === ":") {
            let key;
            try {
              key = JSON.parse(str);
            } catch {
              key = str.slice(1, -1);
            }
            out += `<span class="k" style="color:${colorForKey(key)}">${escapeHtml(str)}</span>`;
          } else {
            out += `<span class="s">${escapeHtml(str)}</span>`;
          }
          continue;
        }
        if (lit) {
          out += `<span class="b">${lit}</span>`;
          continue;
        }
        if (num) {
          out += `<span class="n">${num}</span>`;
          continue;
        }
        if (punct) {
          out += `<span class="p">${escapeHtml(punct)}</span>`;
          continue;
        }
      }
      return out;
    };
    const loadAll = async () => {
      workspaces = await Store.get(WORKSPACES_KEY, workspaces) || workspaces;
      if (!workspaces.length)
        workspaces = [{ name: "default", createdAt: new Date().toISOString() }];
      activeWs = await Store.get("pinchgrab.activeWorkspace", "default") || "default";
      if (!workspaces.find((w) => w.name === activeWs))
        activeWs = workspaces[0].name;
      prefs = { ...DEFAULT_PREFS, ...await Store.get(PREFS_STORAGE_NAME, {}) };
      const upgradePath = (p, fresh) => {
        if (!p)
          return fresh;
        if (p.includes(".dotfiles"))
          return fresh;
        if (p.endsWith("skills/ui/SKILL.md"))
          return fresh;
        return p;
      };
      prefs.designPath = upgradePath(prefs.designPath, DEFAULT_PREFS.designPath);
      prefs.skillPath = upgradePath(prefs.skillPath, DEFAULT_PREFS.skillPath);
      const scrubDotfiles = (s) => s.replaceAll("~/.dotfiles/.agents/", "~/.agents/").replaceAll("~/.dotfiles/", "~/.agents/");
      const collapseIfMatchesTemplate = async (current, keys) => {
        if (!current || !current.trim())
          return "";
        const trimmed = current.trim();
        for (const k of keys) {
          const tpl = (await loadTemplate(k)).trim();
          if (tpl && tpl === trimmed)
            return "";
        }
        return current.includes(".dotfiles") ? scrubDotfiles(current) : current;
      };
      prefs.designMd = await collapseIfMatchesTemplate(prefs.designMd ?? "", ["localDesign", "designTemplate"]);
      prefs.skillMd = await collapseIfMatchesTemplate(prefs.skillMd ?? "", ["localSkill", "skillTemplate"]);
      await loadWorkspace(activeWs);
    };
    const loadWorkspace = async (name) => {
      activeWs = name;
      Store.set("pinchgrab.activeWorkspace", name);
      sessionId = msgId();
      messages = await Store.get(wsMsgKey(name), []) || [];
      if (!Array.isArray(messages))
        messages = [];
      if (migrateLoadedMessages())
        Store.set(wsMsgKey(name), messages);
      shots.clear();
      shotsFull.clear();
      pageShotsFired.clear();
      const stored = await Store.get(wsShotsKey(name), {}) || {};
      for (const [k, v] of Object.entries(stored))
        shots.set(k, v);
      const storedFull = await Store.get(wsShotsFullKey(name), {}) || {};
      for (const [k, v] of Object.entries(storedFull))
        shotsFull.set(k, v);
      selectorValidity.clear();
      selectorErrors.clear();
      undoStack.length = 0;
      redoStack.length = 0;
      liveTabUrl = null;
      lastActiveSelector = null;
      insertBefore.current = null;
      insertBefore.comment = false;
      lastExport.relPath = null;
      lastExport.absPath = null;
      lastExport.copyPath = null;
      lastExport.tempPath = false;
      lastExport.kind = null;
      applyPrefsToUI();
      renderWsControls();
      updateCopyPathButton();
    };
    const persist = () => {
      Store.set(wsMsgKey(activeWs), messages);
      const selectors = messages.filter((m) => m.type === "selector").map((m) => m.entry.selector);
      sendToCS({ kind: "set-captured", selectors });
    };
    const persistPrefs = () => {
      Store.set(PREFS_STORAGE_NAME, prefs);
      sendToCS({
        kind: "set-cs-prefs",
        spacingOverlay: prefs.spacingOverlay,
        hoverSnap: prefs.hoverSnap
      });
    };
    const persistShots = () => {
      const obj = {};
      for (const [k, v] of shots)
        obj[k] = v;
      Store.set(wsShotsKey(activeWs), obj);
    };
    const evictShotsFullToBudget = () => {
      let total = 0;
      for (const v of shotsFull.values())
        total += v.length;
      let evicted = 0;
      while (total > SHOTS_FULL_BUDGET_BYTES) {
        const firstKey = shotsFull.keys().next().value;
        if (firstKey === undefined)
          break;
        const removed = shotsFull.get(firstKey);
        if (removed === undefined)
          break;
        shotsFull.delete(firstKey);
        total -= removed.length;
        evicted++;
      }
      return evicted;
    };
    const persistShotsFull = () => {
      const evicted = evictShotsFullToBudget();
      if (evicted > 0) {
        console.log(LOG, `shotsFull FIFO-evicted ${evicted} oldest entries to fit ${SHOTS_FULL_BUDGET_BYTES / 1024 / 1024}MB budget`);
      }
      const obj = {};
      for (const [k, v] of shotsFull)
        obj[k] = v;
      Store.set(wsShotsFullKey(activeWs), obj);
    };
    const persistWorkspaces = () => {
      Store.set(WORKSPACES_KEY, workspaces);
    };
    const snapshot = () => {
      if (suspendSnapshots)
        return;
      if (undoStack.length >= UNDO_CAP)
        undoStack.shift();
      undoStack.push(JSON.stringify(messages));
      redoStack.length = 0;
      updateUndoButtons();
    };
    const restore = (json) => {
      suspendSnapshots = true;
      try {
        messages = JSON.parse(json);
      } catch {
        messages = [];
      }
      suspendSnapshots = false;
      persist();
      render();
    };
    const undo = () => {
      if (!undoStack.length) {
        setStatus("Nothing to undo", { kind: "info" });
        return;
      }
      redoStack.push(JSON.stringify(messages));
      restore(undoStack.pop());
      setStatus("Undone");
      updateUndoButtons();
    };
    const redo = () => {
      if (!redoStack.length) {
        setStatus("Nothing to redo", { kind: "info" });
        return;
      }
      undoStack.push(JSON.stringify(messages));
      restore(redoStack.pop());
      setStatus("Redone");
      updateUndoButtons();
    };
    const updateUndoButtons = () => {
      document.querySelector('[data-action="undo"]')?.classList.toggle("disabled", undoStack.length === 0);
      document.querySelector('[data-action="redo"]')?.classList.toggle("disabled", redoStack.length === 0);
    };
    const updateCopyPathButton = () => {
      const btn = document.querySelector('[data-action="copy-path"]');
      if (!btn)
        return;
      const has = Boolean(lastExport.copyPath ?? lastExport.absPath);
      btn.classList.toggle("disabled", !has);
      btn.dataset.tip = has ? `Copy the path of your last export.
${lastExport.copyPath ?? lastExport.absPath ?? ""}` : "Copy the path of your last export. Run an export first.";
    };
    const onCopyPath = async () => {
      const pathToCopy = lastExport.copyPath ?? lastExport.absPath;
      if (!pathToCopy) {
        setStatus("No export yet — run a download first", { kind: "warn" });
        return;
      }
      try {
        await navigator.clipboard.writeText(pathToCopy);
        const leaf = pathToCopy.replace(/[\\/]+$/, "").split(/[\\/]/).pop() ?? pathToCopy;
        setStatus(`Copied path · ${leaf}`);
        showCopied("Copied path", leaf);
      } catch (e) {
        setStatus("Clipboard write failed: " + String(e?.message ?? e), { kind: "warn" });
        showDownloadError("Clipboard failed", String(e?.message ?? e));
      }
    };
    const sendToCS = async (payload) => {
      const msg = pg(payload);
      if (inExtension) {
        try {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]?.id != null)
            await chrome.tabs.sendMessage(tabs[0].id, msg).catch(() => {});
        } catch {}
      } else {
        try {
          window.dispatchEvent(new CustomEvent("pinchgrab:to-cs", { detail: msg }));
        } catch {}
      }
    };
    const sendToCSAndWait = async (payload) => new Promise((resolve) => {
      if (!inExtension) {
        const reqId = "req_" + Math.random().toString(36).slice(2);
        const onResp = (e) => {
          const detail = e.detail;
          if (detail?.__reqId === reqId) {
            window.removeEventListener("pinchgrab:cs-response", onResp);
            resolve(detail.reply);
          }
        };
        window.addEventListener("pinchgrab:cs-response", onResp);
        window.dispatchEvent(new CustomEvent("pinchgrab:to-cs", { detail: { __reqId: reqId, ...pg(payload) } }));
        setTimeout(() => {
          window.removeEventListener("pinchgrab:cs-response", onResp);
          resolve(null);
        }, 1000);
        return;
      }
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          resolve(null);
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, pg(payload), (r) => resolve(r));
      });
    });
    const sendToBg = async (payload) => {
      if (!inExtension)
        return null;
      try {
        return await chrome.runtime.sendMessage(pg(payload));
      } catch (e) {
        return { error: String(e?.message ?? e) };
      }
    };
    const recentMids = [];
    const RECENT_MID_CAP = 64;
    const onCsMessage = (msg) => {
      if (!msg || msg.__pg !== true)
        return;
      if (msg.__mid) {
        if (recentMids.includes(msg.__mid))
          return;
        recentMids.push(msg.__mid);
        if (recentMids.length > RECENT_MID_CAP)
          recentMids.shift();
      }
      switch (msg.kind) {
        case "capture":
          onCapture(msg);
          return;
        case "hover":
          onHover(msg);
          return;
        case "hover-end":
          onHoverEnd();
          return;
        case "pending-add":
          onPendingAdd(msg);
          return;
        case "pending-clear":
          onPendingClear();
          return;
        case "feedback-add":
          onFeedbackAdd(msg);
          return;
        case "preference-change":
          onPreferenceChange(msg);
          return;
        default:
          return;
      }
    };
    const onPreferenceChange = ({ reason, page }) => {
      liveTabUrl = page?.url ?? liveTabUrl;
      liveTabPath = liveTabUrl ? pathOf(liveTabUrl) : liveTabPath;
      setStatus(`${reason} changed`, { kind: "info" });
    };
    const onFeedbackAdd = ({ selector, text, url, parentUid }) => {
      if (!text)
        return;
      let idx = -1;
      if (parentUid) {
        idx = messages.findIndex((m) => m.type === "selector" && m.entry.uid === parentUid);
      }
      if (idx < 0) {
        const wantUrl = url ?? liveTabUrl ?? null;
        idx = messages.findIndex((m) => m.type === "selector" && m.entry.selector === selector && (!wantUrl || m.entry.url === wantUrl));
      }
      if (idx < 0) {
        console.warn(LOG, "onFeedbackAdd: no parent found", { selector, url, parentUid });
        setStatus("Comment lost its parent — check the active capture", { kind: "warn" });
        return;
      }
      snapshot();
      const parentMsg = messages[idx];
      let insertAt = idx + 1;
      while (insertAt < messages.length && messages[insertAt]?.type === "feedback")
        insertAt++;
      messages.splice(insertAt, 0, {
        type: "feedback",
        id: msgId(),
        ts: new Date().toISOString(),
        text,
        parentUid: parentMsg.entry.uid
      });
      persist();
      render();
      setStatus("Comment added from page");
      if (!parentMsg.entry.screenshot?.element) {
        fireElementShot(parentMsg);
      }
    };
    const onPendingAdd = ({ entry }) => {
      pendingMulti.push(entry);
      render();
    };
    const onPendingClear = () => {
      pendingMulti = [];
      render();
    };
    const findDuplicate = (selector, url) => messages.find((m) => m.type === "selector" && m.entry.selector === selector && (!url || m.entry.url === url));
    const findCaptureForCurrentPage = (selector) => {
      const url = liveTabUrl;
      for (let i = messages.length - 1;i >= 0; i--) {
        const m = messages[i];
        if (m?.type !== "selector")
          continue;
        if (m.entry.selector !== selector)
          continue;
        if (url && m.entry.url !== url)
          continue;
        return m;
      }
      return;
    };
    const canonicalEntry = (e) => JSON.stringify({
      tag: e.tag,
      selector: e.selector,
      text: e.text,
      role: e.role,
      attrs: e.attrs,
      classes: e.classes,
      rect: e.rect,
      outerHTML: e.outerHTML,
      styles: e.styles,
      matchedRules: e.matchedRules
    });
    const onCapture = ({ entry, page, grouped }) => {
      if (!entry || !page)
        return;
      snapshot();
      liveTabUrl = page.url;
      liveTabPath = pathOf(page.url);
      if (grouped) {
        for (let i = messages.length - 1;i >= 0; i--) {
          const m = messages[i];
          if (m?.type === "selector") {
            const group = m.entry.group ?? [];
            group.push(entry);
            m.entry.group = group;
            persist();
            render();
            composer.focus();
            const selectors = [m.entry.selector, ...(m.entry.group ?? []).map((g) => g.selector)];
            fireGroupShot(m, selectors);
            return;
          }
        }
      }
      const dupe = findDuplicate(entry.selector, entry.url);
      if (dupe) {
        const before = canonicalEntry(dupe.entry);
        const after = canonicalEntry(entry);
        if (before === after) {
          composer.focus();
          return;
        }
        const r1 = dupe.entry.rect;
        const r2 = entry.rect;
        const sameElement = r1 && r2 && Math.abs(r1.x + r1.w / 2 - (r2.x + r2.w / 2)) <= 8 && Math.abs(r1.y + r1.h / 2 - (r2.y + r2.h / 2)) <= 8;
        if (sameElement) {
          delete dupe.dupePending;
          dupe.entry = entry;
          persist();
          render();
          setStatus(`Updated #${dupe.entry.n}`, { kind: "info" });
          composer.focus();
          return;
        }
      }
      let position = messages.length;
      if (insertBefore.current) {
        position = messages.findIndex((m) => m.id === insertBefore.current);
        if (position < 0)
          position = messages.length;
        insertBefore.current = null;
        insertBefore.comment = false;
      }
      if (sessionId)
        entry.sessionId = sessionId;
      const newMsg = { type: "selector", id: msgId(), ts: entry.ts, entry };
      let previousPage = null;
      for (let i = position - 1;i >= 0; i--) {
        const m = messages[i];
        if (m?.type === "page") {
          previousPage = m;
          break;
        }
        if (m?.type === "selector")
          break;
      }
      if (!previousPage || previousPage.url !== page.url) {
        const pageMsg = {
          type: "page",
          id: msgId(),
          ts: new Date().toISOString(),
          url: page.url,
          title: page.title,
          viewport: page.viewport,
          tokens: page.tokens,
          userAgent: page.userAgent,
          lang: page.lang,
          gitContext: page.gitContext,
          route: page.route,
          state: page.state,
          sessionId
        };
        messages.splice(position, 0, pageMsg);
        position++;
      }
      messages.splice(position, 0, newMsg);
      persist();
      render();
      composer.focus();
      fireElementShot(newMsg);
      firePageShotIfNeeded(newMsg);
      runValidation();
    };
    const fireElementShot = async (msg) => {
      if (!prefs.autoScreenshot) {
        console.log(LOG, "fireElementShot skipped: autoScreenshot=false");
        msg.entry.screenshot = { ...msg.entry.screenshot ?? {}, unavailableReason: "autoScreenshotOff" };
        return;
      }
      if (shouldSkipScreenshot(msg.entry.url)) {
        console.log(LOG, "fireElementShot skipped: host on skip list", msg.entry.url);
        msg.entry.screenshot = { ...msg.entry.screenshot ?? {}, unavailableReason: "skipScreenshotHosts" };
        return;
      }
      console.log(LOG, "fireElementShot →", msg.entry.selector);
      let reply = await sendToBg({
        kind: "shot-element",
        selector: msg.entry.selector,
        n: msg.entry.n,
        workspace: activeWs
      });
      if (!reply || !reply.ok && !reply.error) {
        console.log(LOG, "first screenshot reply was empty; retrying after 200ms (SW cold-start)");
        await new Promise((r) => setTimeout(r, 200));
        reply = await sendToBg({
          kind: "shot-element",
          selector: msg.entry.selector,
          n: msg.entry.n,
          workspace: activeWs
        });
      }
      console.log(LOG, "fireElementShot reply:", reply);
      if (!reply?.ok || !reply.filename) {
        setStatus(`Screenshot failed: ${reply?.error ?? "no reply from background"}`, { kind: "warn" });
        msg.entry.screenshot = {
          ...msg.entry.screenshot ?? {},
          unavailableReason: reply?.error ?? "captureFailed"
        };
        return;
      }
      delete msg.entry.screenshot?.unavailableReason;
      msg.entry.screenshot = {
        ...msg.entry.screenshot ?? {},
        element: reply.filename,
        capturedAt: new Date().toISOString(),
        ...reply.crop ? { crop: reply.crop } : {}
      };
      if (reply.dataUrl) {
        shots.set(msg.entry.selector, reply.dataUrl);
        persistShots();
      }
      if (reply.fullDataUrl) {
        shotsFull.set(msg.entry.selector, reply.fullDataUrl);
        persistShotsFull();
      }
      persist();
      render();
    };
    const fireGroupShot = async (head, selectors) => {
      if (!prefs.autoScreenshot)
        return;
      if (shouldSkipScreenshot(head.entry.url))
        return;
      const reply = await sendToBg({
        kind: "shot-group",
        selectors,
        n: head.entry.n,
        workspace: activeWs
      });
      if (!reply?.ok || !reply.filename)
        return;
      head.entry.screenshot = {
        ...head.entry.screenshot ?? {},
        group: reply.filename,
        capturedAt: new Date().toISOString()
      };
      if (reply.dataUrl) {
        shots.set(head.entry.selector, reply.dataUrl);
        if (reply.fullDataUrl) {
          shotsFull.set(head.entry.selector, reply.fullDataUrl);
          persistShotsFull();
        }
        persistShots();
      }
      persist();
      render();
    };
    const firePageShotIfNeeded = async (msg) => {
      if (!prefs.autoScreenshot)
        return;
      if (shouldSkipScreenshot(msg.entry.url))
        return;
      if (!prefs.pageShotPerCapture) {
        const key = pageShotKey(msg.entry.url);
        if (pageShotsFired.has(key)) {
          const existing = findExistingPageShot(msg.entry.url);
          if (existing) {
            msg.entry.screenshot = {
              ...msg.entry.screenshot ?? {},
              page: existing
            };
            persist();
            render();
          }
          return;
        }
        pageShotsFired.add(key);
      }
      const reply = await sendToBg({
        kind: "shot-page",
        n: msg.entry.n,
        workspace: activeWs
      });
      if (!reply?.ok || !reply.filename)
        return;
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        if (m.entry.url !== msg.entry.url)
          continue;
        m.entry.screenshot = {
          ...m.entry.screenshot ?? {},
          page: reply.filename
        };
      }
      if (reply.fullDataUrl) {
        shotsFull.set("page::" + msg.entry.url, reply.fullDataUrl);
        persistShotsFull();
      }
      persist();
      render();
    };
    const findExistingPageShot = (url) => {
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        if (m.entry.url !== url)
          continue;
        if (m.entry.screenshot?.page)
          return m.entry.screenshot.page;
      }
      return null;
    };
    const onHover = ({ selector, label, tag, rect }) => {
      setStatus(`Alt-hover · ${label}`, { kind: "info" });
      const existing = findCaptureForCurrentPage(selector);
      if (existing) {
        if (prefs.autoScrollToHovered)
          scrollMessageIntoView(existing.id);
        const feedback = collectFeedbackAfter(existing.id);
        sendToCS({ kind: "annotation", selector, payload: { uid: existing.entry.uid, n: existing.entry.n, captured: true, feedback } });
        if (phantomTarget) {
          phantomTarget = null;
          render();
        }
      } else {
        phantomTarget = { selector, label, tag, rect };
        sendToCS({ kind: "annotation", selector, payload: { captured: false, feedback: [] } });
        renderPhantom();
      }
    };
    const onHoverEnd = () => {
      if (status.textContent?.startsWith("Alt-hover"))
        status.textContent = "";
      if (phantomTarget) {
        phantomTarget = null;
        renderPhantom();
      }
    };
    const collectFeedbackAfter = (selectorId) => {
      const out = [];
      let found = false;
      for (const m of messages) {
        if (!found) {
          if (m.id === selectorId)
            found = true;
          continue;
        }
        if (m.type === "selector" || m.type === "page")
          break;
        if (m.type === "feedback")
          out.push(m.text);
      }
      return out;
    };
    const scrollMessageIntoView = (id) => {
      const el = list.querySelector(`[data-id="${id}"]`);
      if (!el)
        return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("flash-into-view");
      el.offsetWidth;
      el.classList.add("flash-into-view");
    };
    const setLastActive = (selector) => {
      lastActiveSelector = selector;
      clearTimeout(stickyTimer);
      if (selector) {
        sendToCS({ kind: "scroll-to", selector, sticky: true });
        armStickyExpiry();
      } else {
        sendToCS({ kind: "sticky-clear" });
      }
    };
    const armStickyExpiry = () => {
      clearTimeout(stickyTimer);
      stickyTimer = window.setTimeout(() => {
        if (!panelHovered) {
          sendToCS({ kind: "sticky-clear" });
          lastActiveSelector = null;
          for (const el of list.querySelectorAll(".msg.selector.last-active"))
            el.classList.remove("last-active");
        } else
          armStickyExpiry();
      }, STICKY_TTL_MS);
    };
    let stickyClearGrace = 0;
    list.addEventListener("mouseenter", () => {
      panelHovered = true;
      if (stickyClearGrace) {
        clearTimeout(stickyClearGrace);
        stickyClearGrace = 0;
      }
      armStickyExpiry();
    });
    list.addEventListener("mouseleave", () => {
      panelHovered = false;
      if (stickyClearGrace)
        clearTimeout(stickyClearGrace);
      stickyClearGrace = window.setTimeout(() => {
        sendToCS({ kind: "sticky-clear" });
        sendToCS({ kind: "outline-clear" });
        stickyClearGrace = 0;
      }, 300);
    });
    document.body.addEventListener("mouseenter", () => {
      sendToCS({ kind: "alt-state", on: false });
    });
    const NEAR_BOTTOM_PX = 80;
    const wasNearBottom = () => list.scrollHeight - list.scrollTop - list.clientHeight <= NEAR_BOTTOM_PX;
    const matchesSearch = (m) => {
      if (!searchQuery)
        return true;
      const q = searchQuery.toLowerCase();
      if (m.type === "feedback")
        return m.text.toLowerCase().includes(q);
      if (m.type === "selector") {
        const e = m.entry;
        return JSON.stringify(e).toLowerCase().includes(q);
      }
      if (m.type === "page")
        return (m.url + " " + (m.title ?? "")).toLowerCase().includes(q);
      return true;
    };
    const bodyMatchesSearch = (m) => {
      if (!searchQuery)
        return false;
      const q = searchQuery.toLowerCase();
      return JSON.stringify(m.entry).toLowerCase().includes(q);
    };
    const insertRail = (beforeId) => {
      const div = document.createElement("div");
      div.className = "insert-rail";
      div.dataset.beforeId = beforeId;
      if (insertBefore.current === beforeId) {
        div.classList.add("expanded");
        div.append(buildInlineComment({
          onCancel: () => {
            insertBefore.current = null;
            insertBefore.comment = false;
            render();
          },
          onSubmit: (text) => sendInline(text),
          autofocus: true
        }));
      } else {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "add-btn";
        btn.dataset.tip = "Insert capture or comment here";
        btn.innerHTML = PG_ICONS.svgString("plus", 12);
        btn.addEventListener("click", () => {
          insertBefore.current = beforeId;
          insertBefore.comment = true;
          render();
        });
        div.append(btn);
      }
      return div;
    };
    const buildInlineComment = ({ initial = "", onCancel, onSubmit, autofocus }) => {
      const wrap2 = document.createElement("div");
      wrap2.className = "inline-comment";
      const ta = document.createElement("textarea");
      ta.value = initial;
      ta.rows = 2;
      ta.placeholder = "Insert a comment here, or Alt+Click to insert a capture";
      const row = document.createElement("div");
      row.className = "row";
      const meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = "0w · 0t";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "iconbtn";
      cancel.dataset.tip = "Cancel · Esc";
      cancel.innerHTML = PG_ICONS.svgString("x", 20);
      cancel.addEventListener("click", () => onCancel?.());
      const send = document.createElement("button");
      send.type = "button";
      send.className = "iconbtn primary";
      send.dataset.tip = "Save · Enter";
      send.innerHTML = PG_ICONS.svgString("check", 20);
      const submit = () => onSubmit?.(ta.value);
      send.addEventListener("click", submit);
      ta.addEventListener("input", () => {
        meta.textContent = `${wordCount(ta.value)}w · ${tokenCount(ta.value)}t`;
      });
      ta.addEventListener("keydown", (e) => {
        if (e.isComposing || e.keyCode === 229)
          return;
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submit();
        }
        if (e.key === "Escape")
          onCancel?.();
      });
      row.append(meta, cancel, send);
      wrap2.append(ta, row);
      if (autofocus)
        requestAnimationFrame(() => ta.focus());
      return wrap2;
    };
    const sendInline = (text) => {
      text = (text ?? "").trim();
      if (!text) {
        insertBefore.current = null;
        render();
        return;
      }
      snapshot();
      const beforeId = insertBefore.current;
      insertBefore.current = null;
      insertBefore.comment = false;
      let pos = beforeId ? messages.findIndex((m) => m.id === beforeId) : messages.length;
      if (pos < 0)
        pos = messages.length;
      let pIdx = pos - 1;
      while (pIdx >= 0 && messages[pIdx]?.type === "feedback")
        pIdx--;
      const parent = pIdx >= 0 ? messages[pIdx] : undefined;
      const parentUid = parent && parent.type === "selector" ? parent.entry.uid : undefined;
      const fb = {
        type: "feedback",
        id: msgId(),
        ts: new Date().toISOString(),
        text,
        ...parentUid ? { parentUid } : {}
      };
      messages.splice(pos, 0, fb);
      persist();
      render();
      setStatus("Inserted");
    };
    const renderPhantom = () => {
      list.querySelector(".phantom")?.remove();
      if (!phantomTarget)
        return;
      const ph = document.createElement("div");
      ph.className = "phantom visible";
      ph.innerHTML = `<code>${escapeHtml(phantomTarget.label)}</code>`;
      list.append(ph);
      requestAnimationFrame(() => {
        list.scrollTop = list.scrollHeight;
      });
    };
    const reorderForExport = (msgs) => {
      const slots = [];
      let curGroup = null;
      const flushGroup = () => {
        if (curGroup) {
          slots.push(curGroup);
          curGroup = null;
        }
      };
      for (const m of msgs) {
        if (m.type === "page") {
          flushGroup();
          slots.push({ kind: "page", m });
        } else if (m.type === "selector") {
          flushGroup();
          curGroup = { kind: "group", sel: m, trailing: [] };
        } else {
          if (curGroup)
            curGroup.trailing.push(m);
          else
            slots.push({ kind: "loose", m });
        }
      }
      flushGroup();
      const out = [];
      let runStart = 0;
      const flushRun = (end) => {
        const indices = [];
        const groupRects = [];
        for (let i = runStart;i < end; i++) {
          const s = slots[i];
          if (s.kind === "group") {
            const r = s.sel.entry.rect;
            groupRects.push({ idx: i, y: r?.y ?? Number.POSITIVE_INFINITY, x: r?.x ?? Number.POSITIVE_INFINITY });
          }
          indices.push(i);
        }
        groupRects.sort((a, b) => {
          if (a.y !== b.y)
            return a.y - b.y;
          return a.x - b.x;
        });
        let gi = 0;
        for (const i of indices) {
          const s = slots[i];
          if (s.kind === "group") {
            const replacementIdx = groupRects[gi++].idx;
            const r = slots[replacementIdx];
            out.push(r.sel);
            for (const f of r.trailing)
              out.push(f);
          } else if (s.kind === "loose") {
            out.push(s.m);
          }
        }
      };
      for (let i = 0;i < slots.length; i++) {
        if (slots[i].kind === "page") {
          flushRun(i);
          out.push(slots[i].m);
          runStart = i + 1;
        }
      }
      flushRun(slots.length);
      return out;
    };
    const render = () => {
      const stickToBottom = list.children.length === 0 || wasNearBottom();
      list.innerHTML = "";
      let totalSelectors = 0;
      let totalComments = 0;
      let totalStale = 0;
      const distinctPages = new Set;
      for (const m of messages) {
        if (m.type === "selector") {
          totalSelectors++;
          if (selectorValidity.get(m.entry.selector) === false)
            totalStale++;
        } else if (m.type === "feedback")
          totalComments++;
        else if (m.type === "page") {
          if (messages.some((x) => x.type === "selector" && x.entry.url === m.url))
            distinctPages.add(m.url);
        }
      }
      statsEl.querySelector('[data-stat="selectors"] .stat-num').textContent = String(totalSelectors);
      statsEl.querySelector('[data-stat="comments"] .stat-num').textContent = String(totalComments);
      const staleNum = statsEl.querySelector('[data-stat="stale"] .stat-num');
      staleNum.textContent = String(totalStale);
      staleNum.dataset.zero = totalStale === 0 ? "true" : "false";
      statsEl.querySelector('[data-stat="pages"] .stat-num').textContent = String(distinctPages.size);
      const exportText = buildJsonl();
      statTokens.textContent = exportText ? String(tokenCount(exportText)) : "0";
      statWords.textContent = exportText ? String(wordCount(exportText)) : "0";
      let fullT = 0, curT = 0, fullW = 0, curW = 0, pct = 0;
      if (exportText) {
        const wasMin = prefs.minify;
        prefs.minify = true;
        const minText = buildJsonl();
        prefs.minify = false;
        const fullText = buildJsonl();
        prefs.minify = wasMin;
        fullT = tokenCount(fullText);
        curT = tokenCount(minText);
        fullW = wordCount(fullText);
        curW = wordCount(minText);
        pct = fullT > 0 ? Math.round((1 - curT / fullT) * 100) : 0;
      }
      const minifyStatsEl = document.querySelector("[data-minify-stats]");
      if (minifyStatsEl) {
        if (prefs.minify && exportText) {
          minifyStatsEl.textContent = `${fullT.toLocaleString()} → ${curT.toLocaleString()} tokens · ${fullW.toLocaleString()} → ${curW.toLocaleString()} words · ${pct}% reduction`;
        } else if (exportText) {
          minifyStatsEl.textContent = `Would save ${(fullT - curT).toLocaleString()} tokens · ${pct}% if enabled`;
        } else
          minifyStatsEl.textContent = "";
      }
      const contribKeys = ["includeOuterHTML", "includeMatchedRules", "includeStyles"];
      if (exportText && messages.length) {
        const baseT = tokenCount(exportText);
        const baseW = wordCount(exportText);
        for (const key of contribKeys) {
          const el = document.querySelector(`[data-contrib="${key}"]`);
          if (!el)
            continue;
          const wasOn = prefs[key];
          prefs[key] = !wasOn;
          const altText = buildJsonl();
          prefs[key] = wasOn;
          const altT = tokenCount(altText);
          const altW = wordCount(altText);
          const dT = wasOn ? baseT - altT : altT - baseT;
          const dW = wasOn ? baseW - altW : altW - baseW;
          const sign = wasOn ? "" : "+";
          el.textContent = wasOn ? `· ${dT.toLocaleString()} t · ${dW.toLocaleString()} w in export${prefs.minify ? " (minified)" : ""}` : `· ${sign}${dT.toLocaleString()} t · ${sign}${dW.toLocaleString()} w if enabled`;
        }
      } else {
        for (const key of contribKeys) {
          const el = document.querySelector(`[data-contrib="${key}"]`);
          if (el)
            el.textContent = "";
        }
      }
      document.querySelectorAll(".stat.export-stats").forEach((s, i) => {
        const num = s.querySelector(".stat-num");
        const lab = s.querySelector(".stat-label");
        if (num)
          num.textContent = num.textContent.replace(/\*$/, "");
        if (lab)
          lab.textContent = lab.textContent.replace(/^\*/, "");
        if (prefs.minify && num)
          num.textContent = num.textContent + "*";
        const isToken = i === 0;
        const fullV = isToken ? fullT : fullW;
        const curV = isToken ? curT : curW;
        const which = isToken ? "tokens" : "words";
        s.dataset.tip = prefs.minify ? `MINIFIED · ${curV.toLocaleString()} ${which}
Full would be ${fullV.toLocaleString()} · saves ${pct}%` : `${fullV.toLocaleString()} ${which} · full export
Minified would be ${curV.toLocaleString()} · saves ${pct}%`;
      });
      if (messages.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.innerHTML = `<div style="margin-bottom:8px;font-size:32px">\uD83E\uDD0F</div>
        Open any page and <b>Alt+Click</b> an element. Captures land here on the left;<br>
        type comments below — they appear on the right.`;
        list.append(empty);
        if (pendingMulti.length)
          renderPendingBay();
        return;
      }
      const selectorUrls = new Set(messages.filter((m) => m.type === "selector").map((m) => m.entry.url));
      const visibleMessages = messages.filter((m) => m.type !== "page" || selectorUrls.has(m.url));
      const pinned = visibleMessages.filter((m) => m.type === "selector" && Boolean(m.pinned));
      const unpinned = visibleMessages.filter((m) => !pinned.includes(m));
      const ordered = [...pinned, ...unpinned];
      list.append(insertRail(messages[0].id));
      let lastSelectorSel = null;
      let renderedAny = false;
      for (let i = 0;i < ordered.length; i++) {
        const m = ordered[i];
        if (!matchesSearch(m))
          continue;
        const node = renderMessage(m, lastSelectorSel);
        list.append(node);
        if (m.type === "selector")
          lastSelectorSel = m.entry.selector;
        if (i < ordered.length - 1)
          list.append(insertRail(ordered[i + 1].id));
        renderedAny = true;
      }
      list.append(insertRail("__end__"));
      if (!renderedAny && searchQuery) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = `No matches for "${searchQuery}".`;
        list.append(empty);
      }
      if (pendingMulti.length)
        renderPendingBay();
      if (phantomTarget)
        renderPhantom();
      requestAnimationFrame(redrawNoodles);
      if (stickToBottom)
        requestAnimationFrame(() => {
          list.scrollTop = list.scrollHeight;
        });
    };
    const renderPendingBay = () => {
      list.querySelector(".pending-bay")?.remove();
      if (!pendingMulti.length)
        return;
      const bay = document.createElement("div");
      bay.className = "pending-bay";
      const head = document.createElement("div");
      head.className = "pending-head";
      head.textContent = `Pending group · ${pendingMulti.length} element${pendingMulti.length === 1 ? "" : "s"}`;
      bay.append(head);
      pendingMulti.forEach((e, i) => {
        const card = document.createElement("div");
        card.className = "pending-card";
        const seq = document.createElement("span");
        seq.className = "seq";
        seq.textContent = `#${i + 1}`;
        const label = document.createElement("span");
        label.textContent = e.text && e.text.length <= 60 ? e.text : e.componentRoot ?? e.selector ?? e.tag;
        card.append(seq, label);
        bay.append(card);
      });
      const row = document.createElement("div");
      row.className = "pending-row";
      const commit = document.createElement("button");
      commit.type = "button";
      commit.className = "primary pending-commit";
      commit.textContent = `Commit group · ${pendingMulti.length}`;
      commit.addEventListener("click", () => sendToCS({ kind: "pending-commit" }));
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "iconbtn pending-cancel";
      cancel.dataset.tip = "Cancel pending group";
      cancel.innerHTML = PG_ICONS.svgString("x", 13);
      cancel.addEventListener("click", () => sendToCS({ kind: "pending-cancel" }));
      row.append(commit, cancel);
      bay.append(row);
      const hint = document.createElement("div");
      hint.className = "pending-hint";
      hint.textContent = "Alt+Shift+Click more · Commit to finalize · Esc to cancel";
      bay.append(hint);
      list.append(bay);
    };
    const clearNoodles = () => {
      for (const n of list.querySelectorAll(".tree-noodle"))
        n.remove();
    };
    const clearBubbleNoodle = () => {};
    const redrawNoodles = () => {
      clearNoodles();
      let lastSelectorEl = null;
      for (const node of [...list.children]) {
        if (node.classList.contains("msg") && node.classList.contains("selector"))
          lastSelectorEl = node;
        else if (node.classList.contains("msg") && node.classList.contains("feedback") && lastSelectorEl)
          drawNoodle(lastSelectorEl, node);
        else if (node.classList.contains("insert-rail") && node.classList.contains("expanded") && lastSelectorEl) {
          const target = node.querySelector(".inline-comment") ?? node;
          drawNoodle(lastSelectorEl, target);
        } else if (node.classList.contains("page-divider") || node.classList.contains("group-head")) {
          lastSelectorEl = null;
        }
      }
    };
    const drawNoodle = (selectorEl, feedbackEl) => {
      const sR = selectorEl.getBoundingClientRect();
      const fR = feedbackEl.getBoundingClientRect();
      const lR = list.getBoundingClientRect();
      const x1 = sR.left - lR.left + 12;
      const y1 = sR.bottom - lR.top + list.scrollTop;
      const x2 = fR.left - lR.left;
      const y2 = fR.top - lR.top + list.scrollTop + 14;
      const w = Math.max(20, x2 - x1 + 4);
      const h = Math.max(20, y2 - y1);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "tree-noodle");
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.style.left = `${x1 - 2}px`;
      svg.style.top = `${y1}px`;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const sx = 2, sy = 0, ex = w - 2, ey = h;
      path.setAttribute("d", `M ${sx} ${sy} C ${sx} ${sy + h * 0.55}, ${ex - w * 0.4} ${ey}, ${ex} ${ey}`);
      svg.append(path);
      list.append(svg);
    };
    let scrollRaf = 0;
    list.addEventListener("scroll", () => {
      if (scrollRaf)
        return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        redrawNoodles();
      });
    });
    window.addEventListener("resize", redrawNoodles);
    const renderMessage = (m, lastSelectorSel) => {
      if (m.type === "page")
        return renderPage(m);
      if (m.type === "selector")
        return renderSelector(m);
      if (m.type === "feedback")
        return renderFeedback(m, lastSelectorSel);
      return document.createElement("div");
    };
    const renderPage = (m) => {
      const d = document.createElement("div");
      d.className = "page-divider";
      d.dataset.id = m.id;
      const ts = document.createElement("span");
      ts.className = "tab-status";
      ts.dataset.url = m.url;
      if (m.url === liveTabUrl)
        ts.classList.add("open");
      d.append(ts);
      const u = document.createElement("span");
      u.className = "url";
      u.textContent = m.url;
      u.dataset.tip = `${m.title ?? ""} · ${m.url}`;
      d.append(u);
      d.addEventListener("click", async () => {
        if (m.url === liveTabUrl) {
          setStatus("Already on this page", { kind: "info" });
          return;
        }
        const r = await sendToBg({ kind: "switch-to-tab", url: m.url, openIfMissing: true });
        if (r?.found)
          setStatus("Switched to tab");
        else if (r?.opened)
          setStatus("Opened in new tab");
        else
          setStatus("Couldn't open tab", { kind: "warn" });
      });
      return d;
    };
    const titleFromEntry = (e) => {
      if (e.testId)
        return `[testId=${e.testId}]`;
      if (e.id)
        return `#${e.id}`;
      if (e.classes?.length)
        return `${e.tag}.${e.classes.slice(0, 2).join(".")}`;
      return e.selector || e.tag || "(unknown)";
    };
    const niceLabel = (e) => {
      if (e.text)
        return e.text;
      if (e.accessibleName)
        return e.accessibleName;
      const v = e.attrs?.value;
      if (v && v !== "••••")
        return v;
      if (e.attrs?.placeholder)
        return e.attrs.placeholder;
      if (e.attrs?.alt)
        return e.attrs.alt;
      if (e.componentRoot)
        return e.componentRoot;
      return titleFromEntry(e);
    };
    const renderSelector = (m) => {
      const valid = selectorValidity.get(m.entry.selector);
      const samePath = pathOf(m.entry.url ?? "") === liveTabPath;
      const div = document.createElement("div");
      div.className = "msg selector";
      if (valid === false && samePath)
        div.classList.add("stale");
      else if (valid === false && !samePath)
        div.classList.add("diff-page");
      if (m.pinned)
        div.classList.add("pinned");
      if (m.entry.group?.length)
        div.classList.add("has-group");
      if (m.entry.selector === lastActiveSelector)
        div.classList.add("last-active");
      const matchedBody = bodyMatchesSearch(m);
      if (matchedBody)
        div.classList.add("expanded", "search-hit");
      div.dataset.id = m.id;
      div.dataset.selector = m.entry.selector;
      wireSelectorDropTarget(div, m);
      const head = document.createElement("div");
      head.className = "head";
      const caret = document.createElement("span");
      caret.className = "caret";
      caret.innerHTML = PG_ICONS.svgString("chevron-right", 12);
      head.append(caret);
      const pinMarker = document.createElement("span");
      pinMarker.className = "pin-marker";
      pinMarker.innerHTML = PG_ICONS.svgString("star-filled", 11);
      head.append(pinMarker);
      const seq = document.createElement("span");
      seq.className = "seq";
      seq.textContent = `#${m.entry.n}`;
      if (m.entry.group?.length)
        seq.textContent += `+${m.entry.group.length}`;
      head.append(seq);
      const compact = document.createElement("span");
      compact.className = "compact";
      const compactStr = niceLabel(m.entry);
      compact.innerHTML = highlightMatch(compactStr, searchQuery);
      if (compactStr.length > 24)
        compact.dataset.tip = compactStr;
      head.append(compact);
      const meta = document.createElement("span");
      meta.className = "meta";
      const r = m.entry.rect;
      meta.textContent = r ? `${r.w}×${r.h}` : m.entry.tag ?? "";
      head.append(meta);
      div.append(head);
      const summary = document.createElement("span");
      summary.className = "peek-summary";
      summary.innerHTML = `<span data-icon="alert-circle" data-size="11"></span>
      <span class="t">${div.classList.contains("diff-page") ? "different page" : "stale"}</span>`;
      head.append(summary);
      mountIcons(summary);
      const err = document.createElement("div");
      err.className = "peek-error";
      const reason = selectorErrors.get(m.entry.selector);
      const pathFromEntry = pathOf(m.entry.url ?? "");
      err.innerHTML = samePath ? `<b>Stale</b> · ${escapeHtml(reason ?? "no element on the live page matches.")}<br><code>${escapeHtml(m.entry.selector)}</code>` : `Captured on <code>${escapeHtml(pathFromEntry)}</code> — current tab is <code>${escapeHtml(liveTabPath ?? "")}</code>. Switch tabs to validate.<br><code>${escapeHtml(m.entry.selector)}</code>`;
      div.append(err);
      if (m.entry.ancestors?.length) {
        const crumbs = document.createElement("div");
        crumbs.className = "ancestor-crumbs";
        crumbs.dataset.tip = "Click a crumb to escalate the capture to an ancestor element";
        m.entry.ancestors.forEach((anc, i) => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "ancestor-chip";
          chip.style.filter = `brightness(${(1 - i * 0.08).toFixed(2)})`;
          const label = anc.testId ? `[${anc.testId}]` : anc.id ? `#${anc.id}` : anc.classes?.length ? `${anc.tag}.${anc.classes[0]}` : anc.tag;
          chip.textContent = label;
          chip.dataset.tip = `Capture the ancestor ${i + 1} level${i ? "s" : ""} up · ${anc.tag}${anc.id ? "#" + anc.id : ""}`;
          chip.addEventListener("mouseenter", () => {
            sendToCS({ kind: "outline-ancestor", selector: m.entry.selector, depth: i + 1 });
          });
          chip.addEventListener("mouseleave", () => {
            sendToCS({ kind: "outline", selector: m.entry.selector, gold: true });
          });
          chip.addEventListener("click", async (e) => {
            e.stopPropagation();
            const reply = await sendToCSAndWait({
              kind: "capture-ancestor",
              selector: m.entry.selector,
              depth: i + 1
            });
            if (reply?.ok)
              setStatus(`Captured ancestor ${anc.tag}`);
            else
              setStatus("Could not capture ancestor", { kind: "warn" });
          });
          crumbs.append(chip);
        });
        div.append(crumbs);
      }
      const shotDataUrl = shots.get(m.entry.selector);
      if (shotDataUrl) {
        const preview = document.createElement("div");
        preview.className = "preview";
        const img = document.createElement("img");
        img.className = "shot";
        img.src = shotDataUrl;
        img.alt = `Screenshot of #${m.entry.n}`;
        preview.append(img);
        div.append(preview);
      }
      const stats = document.createElement("div");
      stats.className = "ent-stats";
      const fb = collectFeedbackAfter(m.id);
      const myTokens = tokenCount(JSON.stringify(m.entry));
      const totalTokens = messages.filter((mm) => mm.type === "selector").reduce((s, mm) => s + tokenCount(JSON.stringify(mm.entry)), 0);
      const sharePct = totalTokens > 0 ? Math.round(myTokens / totalTokens * 100) : 0;
      const groupCount = m.entry.group?.length ?? 0;
      const groupTokens = (m.entry.group ?? []).reduce((s, g) => s + tokenCount(JSON.stringify(g)), 0);
      const cells = [
        { label: "HTML", value: `${m.entry.outerHTML?.length ?? 0}`, tip: "Outer HTML char length" },
        { label: "Tokens", value: `${myTokens}`, tip: "Approx LLM tokens for this entry" },
        { label: "Share", value: `${sharePct}%`, tip: "Token share of all selectors" },
        { label: "Comments", value: `${fb.length}`, tip: "Inline comments threaded under this entry" },
        { label: "Rules", value: `${m.entry.matchedRules?.length ?? 0}`, tip: "Matched CSS rules" },
        { label: "Styles", value: `${Object.keys(m.entry.styles ?? {}).length}`, tip: "Computed-style fields kept" }
      ];
      if (groupCount) {
        cells.push({ label: "Group", value: `${groupCount}`, tip: "Members folded into this group" });
        cells.push({ label: "Group T", value: `${groupTokens}`, tip: "Tokens contributed by group members" });
      }
      stats.innerHTML = cells.map((c) => `<span class="ent-stat" data-tip="${escapeHtml(c.tip)}"><span class="lbl">${c.label}</span><span class="val">${c.value}</span></span>`).join("");
      div.append(stats);
      const jsonWrap = document.createElement("div");
      jsonWrap.className = "body-json-wrap";
      const jsonBar = document.createElement("div");
      jsonBar.className = "body-json-bar";
      const wrapLabel = document.createElement("label");
      wrapLabel.className = "json-wrap-toggle";
      wrapLabel.dataset.tip = "Wrap long lines instead of horizontal scroll";
      const wrapCheck = document.createElement("input");
      wrapCheck.type = "checkbox";
      wrapCheck.checked = true;
      wrapLabel.append(wrapCheck, document.createTextNode(" Wrap"));
      jsonBar.append(wrapLabel);
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "iconbtn json-copy";
      copyBtn.dataset.tip = "Copy this capture as JSON";
      copyBtn.setAttribute("aria-label", "Copy capture as JSON");
      copyBtn.innerHTML = PG_ICONS.svgString("copy", 13);
      copyBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const payload = prefs.minify ? slimEntry(m.entry, { includeGroup: true }) : m.entry;
        await navigator.clipboard.writeText(JSON.stringify(payload, null, prefs.minify ? 0 : 2));
        setStatus("Copied JSON");
        showCopied("Copied JSON", `#${m.entry.n}`);
      });
      jsonBar.append(copyBtn);
      jsonWrap.append(jsonBar);
      const body = document.createElement("div");
      body.className = "body-json wrap-on";
      const renderJson = () => {
        const payload = prefs.minify ? slimEntry(m.entry, { includeGroup: true }) : m.entry;
        const text = JSON.stringify(payload, null, prefs.minify ? 0 : 2);
        body.innerHTML = highlightJson(text);
        if (searchQuery)
          wrapSearchHitsInTextNodes(body, searchQuery);
      };
      renderJson();
      wrapCheck.addEventListener("change", () => {
        body.classList.toggle("wrap-on", wrapCheck.checked);
        body.classList.toggle("wrap-off", !wrapCheck.checked);
      });
      jsonBar.addEventListener("click", (e) => e.stopPropagation());
      jsonWrap.append(body);
      div.append(jsonWrap);
      head.addEventListener("click", () => {
        div.classList.toggle("expanded");
        requestAnimationFrame(redrawNoodles);
      });
      div.addEventListener("mouseenter", () => {
        sendToCS({ kind: "outline", selector: m.entry.selector, gold: true });
        lastActiveSelector = m.entry.selector;
        armStickyExpiry();
      });
      div.addEventListener("mouseleave", () => {
        sendToCS({ kind: "outline-clear" });
        if (lastActiveSelector)
          sendToCS({ kind: "scroll-to", selector: lastActiveSelector, sticky: true });
      });
      const actions = document.createElement("div");
      actions.className = "actions";
      actions.append(actionBtn(m.pinned ? "star-filled" : "star", m.pinned ? "Unpin from top" : "Pin to top", () => {
        snapshot();
        m.pinned = !m.pinned;
        persist();
        render();
      }, { toggled: m.pinned }));
      actions.append(actionBtn("crosshair", "Locate this element on the page", () => {
        sendToCS({ kind: "locate-flash", selector: m.entry.selector });
        setStatus("Locating…");
      }));
      actions.append(actionBtn("message-square-plus", "Add a comment after this capture", () => {
        const idx = messages.findIndex((mm) => mm.id === m.id);
        const beforeId = idx >= 0 && idx < messages.length - 1 ? messages[idx + 1].id : "__end__";
        insertBefore.current = beforeId;
        insertBefore.comment = true;
        render();
      }, { size: 15 }));
      if (groupCount) {
        actions.append(actionBtn("list-tree", `Split this group of ${groupCount} into individual entries`, () => {
          snapshot();
          const idx = messages.findIndex((mm) => mm.id === m.id);
          if (idx < 0)
            return;
          const members = m.entry.group ?? [];
          delete m.entry.group;
          const fresh = members.map((entry) => ({
            type: "selector",
            id: msgId(),
            ts: entry.ts ?? new Date().toISOString(),
            entry
          }));
          messages.splice(idx + 1, 0, ...fresh);
          persist();
          render();
          setStatus(`Split group of ${members.length} · capturing screenshots…`);
          (async () => {
            let captured = 0;
            for (const child of fresh) {
              try {
                await fireElementShot(child);
                if (child.entry.screenshot?.element)
                  captured++;
              } catch (e) {
                console.warn(LOG, "split-group shot failed for", child.entry.selector, e);
              }
            }
            setStatus(`Split done · ${captured}/${members.length} screenshots`);
          })();
        }));
      }
      actions.append(actionBtn("external-link", "Log the element and copy a console snippet", async () => {
        const reply = await sendToCSAndWait({ kind: "log-element", selector: m.entry.selector, n: m.entry.n });
        const snippet = reply?.snippet ?? `document.querySelector('${m.entry.selector}')`;
        try {
          await navigator.clipboard.writeText(snippet);
          setStatus("Logged + copied console snippet");
          showCopied("Copied snippet");
        } catch {
          setStatus("Logged to console");
        }
      }));
      actions.append(actionBtn("refresh-cw", "Re-capture this element from the live page", async () => {
        const reply = await sendToCSAndWait({ kind: "recapture", selector: m.entry.selector, n: m.entry.n });
        if (reply?.ok && reply.entry) {
          snapshot();
          m.entry = reply.entry;
          persist();
          render();
          setStatus("Re-captured");
        } else
          setStatus("Re-capture failed", { kind: "warn" });
      }));
      actions.append(actionBtn("copy", "Copy this capture as JSON", async () => {
        await navigator.clipboard.writeText(JSON.stringify(m.entry));
        setStatus("Copied entry");
        showCopied("Copied entry", `#${m.entry.n}`);
      }));
      actions.append(deleteBtn(() => removeMessage(m.id)));
      div.append(actions);
      return div;
    };
    const renderFeedback = (m, lastSelectorSel) => {
      const div = document.createElement("div");
      div.className = "msg feedback";
      if (lastSelectorSel)
        div.classList.add("threaded");
      div.dataset.id = m.id;
      div.innerHTML = highlightMatch(m.text, searchQuery);
      if (lastSelectorSel) {
        const { parentSel, parentUid } = (() => {
          if (m.parentUid) {
            const p = messages.find((mm) => mm.type === "selector" && mm.entry.uid === m.parentUid);
            if (p && p.type === "selector")
              return { parentSel: p.entry.selector, parentUid: p.entry.uid };
          }
          return { parentSel: lastSelectorSel, parentUid: undefined };
        })();
        div.addEventListener("mouseenter", () => {
          sendToCS({ kind: "outline", selector: parentSel, gold: true });
          if (prefs.autoScrollToHovered) {
            sendToCS({ kind: "scroll-to", selector: parentSel, sticky: true });
          }
          sendToCS({
            kind: "annotation",
            selector: parentSel,
            payload: { selector: parentSel, uid: parentUid, captured: true, feedback: [m.text] }
          });
        });
        div.addEventListener("mouseleave", () => {
          sendToCS({ kind: "outline-clear" });
          sendToCS({ kind: "annotation-clear" });
        });
      }
      div.dataset.commentId = m.id;
      const beginCommentDrag = (e) => {
        div.classList.add("dragging");
        e.dataTransfer?.setData("application/x-pinchgrab-comment", m.id);
        e.dataTransfer?.setData("text/plain", m.text);
        if (e.dataTransfer)
          e.dataTransfer.effectAllowed = "move";
      };
      div.addEventListener("dragend", () => div.classList.remove("dragging"));
      const actions = document.createElement("div");
      actions.className = "actions";
      const dragHandle = actionBtn("grip", "Drag this handle onto a selector to reparent", () => {});
      dragHandle.classList.add("drag-handle");
      dragHandle.draggable = true;
      dragHandle.addEventListener("dragstart", beginCommentDrag);
      dragHandle.addEventListener("dragend", () => div.classList.remove("dragging"));
      dragHandle.addEventListener("click", (e) => e.stopPropagation());
      actions.append(dragHandle);
      actions.append(actionBtn("copy", "Copy comment text", async () => {
        await navigator.clipboard.writeText(m.text);
        setStatus("Copied comment");
        showCopied("Copied comment");
      }));
      actions.append(actionBtn("pencil", "Edit comment", () => enterFeedbackEdit(div, m), { size: 15 }));
      actions.append(deleteBtn(() => removeMessage(m.id)));
      div.append(actions);
      return div;
    };
    const wireSelectorDropTarget = (div, m) => {
      div.addEventListener("dragover", (e) => {
        const types = e.dataTransfer?.types;
        if (!types || !Array.from(types).includes("application/x-pinchgrab-comment"))
          return;
        e.preventDefault();
        if (e.dataTransfer)
          e.dataTransfer.dropEffect = "move";
        div.classList.add("drop-target");
      });
      div.addEventListener("dragleave", () => div.classList.remove("drop-target"));
      div.addEventListener("drop", (e) => {
        div.classList.remove("drop-target");
        const id = e.dataTransfer?.getData("application/x-pinchgrab-comment");
        if (!id)
          return;
        e.preventDefault();
        const srcIdx = messages.findIndex((mm) => mm.id === id);
        if (srcIdx < 0)
          return;
        const src = messages[srcIdx];
        if (src.type !== "feedback")
          return;
        const dstIdx = messages.findIndex((mm) => mm.id === m.id);
        if (dstIdx < 0)
          return;
        snapshot();
        src.parentUid = m.entry.uid;
        messages.splice(srcIdx, 1);
        const newDstIdx = messages.findIndex((mm) => mm.id === m.id);
        let insertAt = newDstIdx + 1;
        while (insertAt < messages.length && messages[insertAt].type === "feedback")
          insertAt++;
        messages.splice(insertAt, 0, src);
        persist();
        render();
        setStatus("Comment reparented");
      });
    };
    const actionBtn = (icon, title, fn, opts = {}) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.tip = title;
      b.setAttribute("aria-label", title);
      if (opts.warn)
        b.className = "warn";
      if (opts.toggled)
        b.classList.add("toggled");
      b.innerHTML = PG_ICONS.svgString(icon, opts.size ?? 13);
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        fn();
      });
      return b;
    };
    const deleteBtn = (onConfirm) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "warn";
      b.dataset.tip = "Delete";
      b.innerHTML = PG_ICONS.svgString("trash-2", 13);
      let parent = null;
      let revertTimer = 0;
      const revert = () => {
        if (!parent)
          return;
        for (const n of parent.querySelectorAll(".confirm-yes, .confirm-no"))
          n.remove();
        if (!b.parentElement)
          parent.append(b);
        clearTimeout(revertTimer);
      };
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        parent = b.parentElement;
        const yes = document.createElement("button");
        yes.type = "button";
        yes.className = "confirm-yes";
        yes.dataset.tip = "Confirm delete";
        yes.innerHTML = PG_ICONS.svgString("check", 13);
        yes.addEventListener("click", (ev) => {
          ev.stopPropagation();
          revert();
          onConfirm();
        });
        const no = document.createElement("button");
        no.type = "button";
        no.className = "confirm-no";
        no.dataset.tip = "Cancel delete";
        no.innerHTML = PG_ICONS.svgString("x", 13);
        no.addEventListener("click", (ev) => {
          ev.stopPropagation();
          revert();
        });
        b.replaceWith(yes);
        yes.after(no);
        revertTimer = window.setTimeout(revert, 8000);
      });
      return b;
    };
    const enterFeedbackEdit = (div, m) => {
      const next = document.createElement("div");
      next.className = "msg feedback editing";
      if (div.classList.contains("threaded"))
        next.classList.add("threaded");
      next.dataset.id = m.id;
      next.append(buildInlineComment({
        initial: m.text,
        onCancel: () => {
          div.replaceWith(div.cloneNode(true));
          render();
        },
        onSubmit: (text) => {
          const trimmed = (text ?? "").trim();
          if (trimmed === m.text) {
            render();
            return;
          }
          snapshot();
          m.text = trimmed;
          delete m.severity;
          persist();
          render();
        },
        autofocus: true
      }));
      div.replaceWith(next);
    };
    const removeMessage = (id) => {
      const el = list.querySelector(`[data-id="${id}"]`);
      const finish = () => {
        snapshot();
        messages = messages.filter((m) => m.id !== id);
        persist();
        render();
        setStatus("Deleted");
      };
      if (!el) {
        finish();
        return;
      }
      el.style.maxHeight = el.scrollHeight + "px";
      el.offsetWidth;
      el.classList.add("removing");
      let done = false;
      const cleanup = () => {
        if (done)
          return;
        done = true;
        finish();
      };
      el.addEventListener("transitionend", cleanup, { once: true });
      setTimeout(cleanup, 380);
    };
    const sendFeedback = () => {
      const text = composer.value.trim();
      if (!text)
        return;
      snapshot();
      let position = messages.length;
      if (insertBefore.current) {
        position = messages.findIndex((m) => m.id === insertBefore.current);
        if (position < 0)
          position = messages.length;
        insertBefore.current = null;
        insertBefore.comment = false;
      }
      let pIdx = position - 1;
      while (pIdx >= 0 && messages[pIdx]?.type === "feedback")
        pIdx--;
      const parent = pIdx >= 0 ? messages[pIdx] : undefined;
      const parentUid = parent && parent.type === "selector" ? parent.entry.uid : undefined;
      messages.splice(position, 0, {
        type: "feedback",
        id: msgId(),
        ts: new Date().toISOString(),
        text,
        ...parentUid ? { parentUid } : {}
      });
      composer.value = "";
      updateComposerMeter();
      if (searchQuery) {
        searchQuery = "";
        search.value = "";
      }
      persist();
      render();
      setStatus("Sent");
      composer.focus();
      if (parent && parent.type === "selector" && !parent.entry.screenshot?.element) {
        fireElementShot(parent);
      }
    };
    composer.addEventListener("keydown", async (e) => {
      if (e.isComposing || e.keyCode === 229)
        return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const handled = await tryManualCaptureFromComposer();
        if (!handled)
          sendFeedback();
      }
      if (e.key === "Escape" && insertBefore.current) {
        insertBefore.current = null;
        setStatus("Insert mode cancelled");
      }
    });
    const updateComposerMeter = () => {
      const t = composer.value;
      compWords.textContent = String(wordCount(t));
      compTokens.textContent = String(tokenCount(t));
      composer.classList.toggle("cmd-mode", /^>/.test(t.trim()));
    };
    composer.addEventListener("input", updateComposerMeter);
    search.addEventListener("input", () => {
      searchQuery = search.value.trim();
      render();
      if (searchQuery) {
        requestAnimationFrame(() => {
          const firstHit = list.querySelector(".msg.selector.search-hit");
          if (firstHit) {
            firstHit.scrollIntoView({ behavior: "smooth", block: "center" });
            const mk = firstHit.querySelector("mark");
            mk?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            const firstMatch = list.querySelector(".msg mark");
            firstMatch?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }
    });
    search.addEventListener("focus", () => {
      if (palette.hidden)
        openPalette(search.value || "");
    });
    search.addEventListener("click", () => {
      if (palette.hidden)
        openPalette(search.value || "");
    });
    $("[data-search-clear]").addEventListener("click", () => {
      search.value = "";
      searchQuery = "";
      render();
    });
    const tryManualCaptureFromComposer = async () => {
      const m = /^>\s*(.+)$/.exec(composer.value.trim());
      if (!m)
        return false;
      const sel = m[1].trim();
      if (!sel)
        return false;
      const reply = await sendToCSAndWait({ kind: "manual-capture", selector: sel });
      if (reply?.ok) {
        composer.value = "";
        updateComposerMeter();
        setStatus("Captured " + sel);
      } else
        setStatus("Selector did not match: " + sel, { kind: "warn" });
      return true;
    };
    const slimEntry = (e, opts = {}) => {
      const includeOuter = prefs.includeOuterHTML;
      const includeMatched = prefs.includeMatchedRules;
      const includeStyles = prefs.includeStyles;
      const minify = prefs.minify;
      const out = {
        v: 2,
        type: "selector",
        uid: e.uid,
        n: e.n,
        ts: e.ts,
        url: e.url,
        tag: e.tag,
        selector: e.selector,
        captureIndex: e.n,
        displayLabel: String(e.n)
      };
      if (opts.eventIndex !== undefined)
        out.eventIndex = opts.eventIndex;
      if (opts.visualOrder !== undefined)
        out.visualOrder = opts.visualOrder;
      if (e.sessionId)
        out.sessionId = e.sessionId;
      if (e.text !== undefined)
        out.text = minify ? e.text.replaceAll(/\s+/g, " ").trim() : e.text;
      if (e.role !== undefined)
        out.role = e.role;
      if (e.accessibleName !== undefined)
        out.accessibleName = minify ? e.accessibleName.replaceAll(/\s+/g, " ").trim() : e.accessibleName;
      if (e.id !== undefined)
        out.id = e.id;
      if (e.testId !== undefined)
        out.testId = e.testId;
      if (e.classes && e.classes.length) {
        out.classes = minify && e.classes.length > 8 ? e.classes.slice(0, 8) : e.classes;
      }
      if (e.attrs && Object.keys(e.attrs).length)
        out.attrs = e.attrs;
      if (e.hints && Object.keys(e.hints).length)
        out.hints = e.hints;
      if (e.rect)
        out.rect = e.rect;
      if (e.states && e.states.length)
        out.states = e.states;
      if (e.component)
        out.component = e.component;
      if (e.selectorMatchCount !== undefined)
        out.selectorMatchCount = e.selectorMatchCount;
      if (e.a11y)
        out.a11y = e.a11y;
      if (e.assets && e.assets.length)
        out.assets = e.assets;
      if (e.layoutContext && e.layoutContext.length)
        out.layoutContext = e.layoutContext;
      if (includeOuter && e.outerHTML !== undefined) {
        out.outerHTML = minify ? e.outerHTML.replaceAll(/\s+/g, " ").trim() : e.outerHTML;
      }
      if (includeStyles && e.styles && Object.keys(e.styles).length)
        out.styles = e.styles;
      if (e.screenshot) {
        const stripWs = (p) => {
          if (!p)
            return p;
          const wsPrefix = `${activeWs}/`;
          return p.startsWith(wsPrefix) ? p.slice(wsPrefix.length) : p;
        };
        out.screenshot = { ...e.screenshot };
        if (out.screenshot.element)
          out.screenshot.element = stripWs(out.screenshot.element);
        if (out.screenshot.group)
          out.screenshot.group = stripWs(out.screenshot.group);
        if (out.screenshot.page)
          out.screenshot.page = stripWs(out.screenshot.page);
      }
      if (e.events && Object.keys(e.events).length)
        out.events = e.events;
      if (e.behaviorAttrs && Object.keys(e.behaviorAttrs).length)
        out.behaviorAttrs = e.behaviorAttrs;
      if (e.canvasClick)
        out.canvasClick = e.canvasClick;
      if (e.editor)
        out.editor = e.editor;
      if (e.isAnimating)
        out.isAnimating = true;
      if (e.shadowHost)
        out.shadowHost = e.shadowHost;
      if (e.renderedText !== undefined)
        out.renderedText = e.renderedText;
      if (e.truncated && Object.keys(e.truncated).length)
        out.truncated = e.truncated;
      if (e.sessionId)
        out.sessionId = e.sessionId;
      if (e.domMutations && e.domMutations.length)
        out.domMutations = e.domMutations;
      const audit = {};
      if (e.ancestors && e.ancestors.length)
        audit.ancestors = e.ancestors;
      if (e.componentRoot !== undefined)
        audit.componentRoot = e.componentRoot;
      if (e.inShadowDOM)
        audit.inShadowDOM = true;
      if (e.pseudoElements && Object.keys(e.pseudoElements).length && !minify)
        audit.pseudoElements = e.pseudoElements;
      if (includeMatched && e.matchedRules && e.matchedRules.length) {
        audit.matchedRules = minify ? e.matchedRules.map((r) => {
          const r2 = { selector: r.selector };
          if (r.declarations && Object.keys(r.declarations).length)
            r2.declarations = r.declarations;
          if (r.media)
            r2.media = r.media;
          return r2;
        }) : e.matchedRules;
      }
      if (e.viewport)
        audit.viewport = e.viewport;
      if (Object.keys(audit).length)
        out._audit = audit;
      if (opts.includeGroup && e.group && e.group.length) {
        out.groupMemberUids = e.group.map((g) => g.uid).filter(Boolean);
      }
      if (opts.groupUid)
        out.groupUid = opts.groupUid;
      return out;
    };
    const TEST_DATA_RE = /^(test|asdf|qwer|foo|bar|baz|lorem|placeholder|todo|x{3,}|hello world|sample|dummy|something|anything|ignore me|wip|tbd|n\/a|hi)\b/i;
    const looksLikeTestData = (text) => {
      const t = text.trim();
      if (!t)
        return false;
      if (TEST_DATA_RE.test(t))
        return true;
      if (/test feedback/i.test(t))
        return true;
      return false;
    };
    const buildSlim = () => {
      const lines = [];
      const visualRank = new Map;
      const sels = messages.filter((m) => m.type === "selector").slice().sort((a, b) => {
        const ar = a.entry.rect;
        const br = b.entry.rect;
        if (!ar || !br)
          return 0;
        if (ar.y !== br.y)
          return ar.y - br.y;
        return ar.x - br.x;
      });
      sels.forEach((m, i) => visualRank.set(m.id, i + 1));
      let pendingSel = null;
      let pendingFbStrings = [];
      let pendingFbRich = [];
      const flush = () => {
        if (!pendingSel)
          return;
        const eventIndex = lines.length + 1;
        const visualOrder = visualRank.get(pendingSel.id);
        const out = slimEntry(pendingSel.entry, { includeGroup: true, eventIndex, visualOrder });
        if (pendingFbStrings.length)
          out.feedback = [...pendingFbStrings];
        lines.push(out);
        const groupMembers = pendingSel.entry.group ?? [];
        for (const member of groupMembers) {
          const mEvent = lines.length + 1;
          const memberRow = slimEntry(member, { includeGroup: false, eventIndex: mEvent, groupUid: pendingSel.entry.uid });
          lines.push(memberRow);
        }
        for (const fb of pendingFbRich)
          lines.push(fb);
        pendingSel = null;
        pendingFbStrings = [];
        pendingFbRich = [];
      };
      const exportOrdered = reorderForExport(messages);
      for (const m of exportOrdered) {
        if (m.type === "page") {
          flush();
          const slim = { v: 2, type: "page", ts: m.ts, url: m.url };
          if (m.title !== undefined)
            slim.title = m.title;
          if (m.viewport)
            slim.viewport = m.viewport;
          if (!prefs.minify && m.tokens)
            slim.tokens = m.tokens;
          if (m.userAgent)
            slim.userAgent = m.userAgent;
          if (m.lang)
            slim.lang = m.lang;
          if (m.gitContext)
            slim.gitContext = m.gitContext;
          if (m.route)
            slim.route = m.route;
          if (m.state)
            slim.state = m.state;
          if (m.sessionId)
            slim.sessionId = m.sessionId;
          lines.push(slim);
        } else if (m.type === "selector") {
          flush();
          pendingSel = m;
        } else if (m.type === "feedback") {
          const rich = { v: 2, type: "feedback", uid: m.id, ts: m.ts, text: m.text, tags: m.tags ?? [] };
          if (looksLikeTestData(m.text))
            rich.isTestData = true;
          if (pendingSel) {
            rich.parentUid = m.parentUid ?? pendingSel.entry.uid;
            pendingFbStrings.push(m.text);
            pendingFbRich.push(rich);
          } else {
            if (m.parentUid)
              rich.parentUid = m.parentUid;
            lines.push(rich);
          }
        }
      }
      flush();
      return lines;
    };
    const buildManifest = (filename, format) => {
      let nSel = 0;
      let nFb = 0;
      let nPg = 0;
      let nGroupMembers = 0;
      let nFeedbackBearing = 0;
      let nMissingShot = 0;
      let nElementShots = 0;
      let nGroupShots = 0;
      let nPageShots = 0;
      let nOrphanedFb = 0;
      const selectorUids = new Set;
      const feedbackParentSelectorIds = new Set;
      for (const m of messages) {
        if (m.type === "selector") {
          nSel++;
          selectorUids.add(m.entry.uid);
          if (m.entry.group?.length)
            nGroupMembers += m.entry.group.length;
          if (m.entry.screenshot?.element)
            nElementShots++;
          if (m.entry.screenshot?.group)
            nGroupShots++;
          if (m.entry.screenshot?.page)
            nPageShots++;
        } else if (m.type === "feedback") {
          nFb++;
          if (m.parentUid)
            feedbackParentSelectorIds.add(m.parentUid);
        } else if (m.type === "page")
          nPg++;
      }
      for (const m of messages) {
        if (m.type === "selector" && feedbackParentSelectorIds.has(m.entry.uid)) {
          nFeedbackBearing++;
          if (!m.entry.screenshot?.element && !m.entry.screenshot?.group)
            nMissingShot++;
        }
      }
      for (const fbUid of feedbackParentSelectorIds) {
        if (!selectorUids.has(fbUid))
          nOrphanedFb++;
      }
      const out = {
        v: 2,
        type: "manifest",
        tool: "pinchgrab",
        ts: new Date().toISOString(),
        generated: Date.now(),
        workspace: activeWs,
        filename,
        format,
        hosts: distinctHosts(),
        counts: {
          selectors: nSel + nGroupMembers,
          feedback: nFb,
          pages: nPg,
          feedbackBearingSelectors: nFeedbackBearing,
          groupMembers: nGroupMembers,
          screenshotsElement: nElementShots,
          screenshotsGroup: nGroupShots,
          screenshotsPage: nPageShots,
          selectorsMissingScreenshot: nMissingShot,
          orphanedFeedback: nOrphanedFb
        },
        pathRoot: format === "tar.zst" ? "archive" : "workspace"
      };
      const isTarBundle = format === "tar.zst";
      out.skill = {
        name: "PinchGrab",
        path: prefs.skillPath,
        inline: isTarBundle
      };
      if (isTarBundle)
        out.skill.archivePath = ".agents/skills/PinchGrab/SKILL.md";
      if (isUsingTemplateSkill())
        out.skill.template = true;
      else
        out.skill.customized = true;
      out.design = {
        path: prefs.designPath,
        inline: isTarBundle
      };
      if (isTarBundle)
        out.design.archivePath = "DESIGN.md";
      if (isUsingTemplateDesign())
        out.design.template = true;
      else
        out.design.customized = true;
      const diagnostics = [];
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        if (!feedbackParentSelectorIds.has(m.entry.uid))
          continue;
        if (!m.entry.screenshot?.element && !m.entry.screenshot?.group) {
          diagnostics.push({
            severity: "warn",
            code: "FEEDBACK_PARENT_MISSING_SCREENSHOT",
            uid: m.entry.uid,
            detail: `selector ${m.entry.selector} carries feedback but has no element/group screenshot`
          });
        }
      }
      for (const fbUid of feedbackParentSelectorIds) {
        if (!selectorUids.has(fbUid)) {
          diagnostics.push({
            severity: "error",
            code: "ORPHANED_FEEDBACK",
            uid: fbUid,
            detail: "feedback row references a parentUid that has no matching selector in this archive"
          });
        }
      }
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        if (m.entry.states && m.entry.states.includes("hover") && !m.entry.screenshot?.element) {
          diagnostics.push({
            severity: "warn",
            code: "HOVER_STATE_NO_SCREENSHOT",
            uid: m.entry.uid,
            detail: `selector captured in :hover state but has no screenshot`
          });
        }
      }
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        if (m.entry.a11y?.contrastPasses === "fail") {
          diagnostics.push({
            severity: "warn",
            code: "CONTRAST_BELOW_AA",
            uid: m.entry.uid,
            detail: `text contrast ratio ${m.entry.a11y.contrastRatio ?? "?"} is below WCAG AA`
          });
        }
      }
      if (diagnostics.length)
        out.exportDiagnostics = diagnostics;
      const lastPage = [...messages].reverse().find((m) => m.type === "page");
      const git = lastPage?.gitContext;
      const extVer = inExtension && chrome.runtime?.getManifest ? chrome.runtime.getManifest().version : undefined;
      if (git || extVer) {
        out.build = {};
        if (extVer)
          out.build.extensionVersion = extVer;
        if (git?.commit)
          out.build.commit = git.commit;
        if (git?.branch)
          out.build.branch = git.branch;
        if (git?.build)
          out.build.deployBuild = git.build;
      }
      return out;
    };
    const buildJsonl = (filenameForManifest, format = "jsonl") => {
      const filename = filenameForManifest ?? buildExportFilename("jsonl");
      const manifest = buildManifest(filename, format);
      const lines = buildSlim();
      if (!lines.length) {
        return JSON.stringify(manifest) + `
`;
      }
      return [JSON.stringify(manifest), ...lines.map((l) => JSON.stringify(l))].join(`
`) + `
`;
    };
    const downloadFile = (content, filename, mime = "text/plain") => {
      const url = URL.createObjectURL(new Blob([content], { type: mime }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    const onCopyAll = async () => {
      const text = buildJsonl();
      if (text.trim().split(`
`).length <= 1 && !messages.length) {
        setStatus("Nothing to copy", { kind: "warn" });
        return;
      }
      await navigator.clipboard.writeText(text);
      setStatus(`Copied JSONL · ${tokenCount(text)} tokens · ${wordCount(text)} words`);
      showCopied("Copied JSONL", `${tokenCount(text)} tokens · ${wordCount(text)} words`);
    };
    const saveExportToDisk = async (text, filename, mime, kind) => {
      if (inExtension) {
        console.log(LOG, "saveExportToDisk →", { filename, mime, size: text.length, kind });
        const reply = await sendToBg({ kind: "save-text", workspace: activeWs, filename, text, mime });
        console.log(LOG, "saveExportToDisk reply:", reply);
        if (reply?.ok && reply.absPath) {
          lastExport.relPath = reply.filename ?? null;
          lastExport.absPath = reply.absPath;
          lastExport.copyPath = reply.copyPath ?? reply.absPath;
          lastExport.tempPath = Boolean(reply.tempPath);
          lastExport.kind = kind;
          updateCopyPathButton();
          setStatus(`Exported · ${lastExport.copyPath}`);
          return;
        }
        const err = reply?.error ?? "no reply from background (worker dead? reload extension at chrome://extensions)";
        console.error(LOG, "saveExportToDisk failed:", err);
        setStatus(`Export failed: ${err}`, { kind: "warn" });
        showDownloadError("Export failed", String(err));
        return;
      }
      downloadFile(text, filename, mime);
      lastExport.relPath = filename;
      lastExport.absPath = filename;
      lastExport.copyPath = filename;
      lastExport.tempPath = false;
      lastExport.kind = kind;
      updateCopyPathButton();
      setStatus("Exported");
    };
    const onExport = async () => {
      if (!messages.length) {
        setStatus("Nothing to export", { kind: "warn" });
        return;
      }
      const filename = buildExportFilename("jsonl");
      const text = buildJsonl(filename);
      await saveExportToDisk(text, filename, "application/jsonl", "jsonl");
    };
    const buildSchemaJson = () => JSON.stringify({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://wranngle.com/pinchgrab/export.v2.schema.json",
      title: "PinchGrab export (v2)",
      description: "JSONL row + manifest schemas for PinchGrab workspace exports.",
      oneOf: [
        { $ref: "#/$defs/manifest" },
        { $ref: "#/$defs/page" },
        { $ref: "#/$defs/selector" },
        { $ref: "#/$defs/feedback" }
      ],
      $defs: {
        manifest: {
          type: "object",
          required: ["v", "type", "tool", "ts", "workspace", "filename", "format", "hosts", "counts"],
          properties: {
            v: { const: 2 },
            type: { const: "manifest" },
            tool: { const: "pinchgrab" },
            ts: { type: "string", format: "date-time" },
            generated: { type: "integer" },
            workspace: { type: "string" },
            filename: { type: "string" },
            format: { enum: ["jsonl", "markdown", "tar.zst"] },
            hosts: { type: "array", items: { type: "string" } },
            pathRoot: { enum: ["archive", "workspace"] },
            counts: {
              type: "object",
              required: ["selectors", "feedback", "pages"],
              properties: {
                selectors: { type: "integer" },
                feedback: { type: "integer" },
                pages: { type: "integer" },
                feedbackBearingSelectors: { type: "integer" },
                groupMembers: { type: "integer" },
                screenshotsElement: { type: "integer" },
                screenshotsGroup: { type: "integer" },
                screenshotsPage: { type: "integer" },
                selectorsMissingScreenshot: { type: "integer" },
                orphanedFeedback: { type: "integer" }
              }
            },
            skill: {
              type: "object",
              properties: {
                name: { type: "string" },
                path: { type: "string" },
                inline: { type: "boolean" },
                archivePath: { type: "string" },
                template: { type: "boolean" },
                customized: { type: "boolean" }
              }
            },
            design: {
              type: "object",
              properties: {
                path: { type: "string" },
                inline: { type: "boolean" },
                archivePath: { type: "string" },
                template: { type: "boolean" },
                customized: { type: "boolean" }
              }
            },
            build: {
              type: "object",
              properties: {
                extensionVersion: { type: "string" },
                commit: { type: "string" },
                branch: { type: "string" },
                dirty: { type: "boolean" },
                deployBuild: { type: "string" }
              }
            },
            exportDiagnostics: {
              type: "array",
              items: {
                type: "object",
                required: ["severity", "code"],
                properties: {
                  severity: { enum: ["error", "warn", "info"] },
                  code: { type: "string" },
                  detail: { type: "string" },
                  uid: { type: "string" }
                }
              }
            }
          }
        },
        page: {
          type: "object",
          required: ["v", "type", "ts", "url"],
          properties: {
            v: { const: 2 },
            type: { const: "page" },
            ts: { type: "string", format: "date-time" },
            url: { type: "string" },
            title: { type: "string" },
            viewport: { $ref: "#/$defs/viewport" },
            tokens: { type: "object", additionalProperties: { type: "string" } },
            userAgent: { type: "string" },
            lang: { type: "string" },
            gitContext: {
              type: "object",
              properties: {
                commit: { type: "string" },
                branch: { type: "string" },
                build: { type: "string" }
              }
            },
            sessionId: { type: "string" }
          }
        },
        selector: {
          type: "object",
          required: ["v", "type", "uid", "n", "ts", "url", "tag", "selector"],
          properties: {
            v: { const: 2 },
            type: { const: "selector" },
            uid: { type: "string" },
            n: { type: "integer" },
            captureIndex: { type: "integer" },
            eventIndex: { type: "integer" },
            visualOrder: { type: "integer" },
            displayLabel: { type: "string" },
            ts: { type: "string", format: "date-time" },
            url: { type: "string" },
            tag: { type: "string" },
            selector: { type: "string" },
            selectorMatchCount: { type: "integer", minimum: 0 },
            text: { type: "string" },
            renderedText: { type: "string" },
            role: { type: "string" },
            accessibleName: { type: "string" },
            id: { type: "string" },
            testId: { type: "string" },
            classes: { type: "array", items: { type: "string" } },
            attrs: { type: "object", additionalProperties: { type: "string" } },
            rect: { $ref: "#/$defs/rect" },
            states: { type: "array", items: { type: "string" } },
            component: {
              type: "object",
              properties: {
                framework: { enum: ["react", "vue", "lit", "stencil", "svelte", "web-component"] },
                name: { type: "string" },
                displayName: { type: "string" },
                chain: { type: "array", items: { type: "string" } },
                source: {
                  type: "object",
                  properties: { file: { type: ["string", "null"] }, line: { type: ["integer", "null"] } }
                }
              }
            },
            outerHTML: { type: "string" },
            styles: { type: "object", additionalProperties: { type: "string" } },
            screenshot: {
              type: "object",
              properties: {
                element: { type: "string" },
                group: { type: "string" },
                page: { type: "string" },
                capturedAt: { type: "string", format: "date-time" }
              }
            },
            shadowHost: { type: "string" },
            inShadowDOM: { type: "boolean" },
            groupUid: { type: "string" },
            groupMemberUids: { type: "array", items: { type: "string" } },
            feedback: { type: "array", items: { type: "string" } },
            _audit: {
              type: "object",
              properties: {
                ancestors: { type: "array", items: { $ref: "#/$defs/ancestor" } },
                componentRoot: { type: "string" },
                inShadowDOM: { type: "boolean" },
                pseudoElements: { type: "object" },
                matchedRules: { type: "array", items: { $ref: "#/$defs/matchedRule" } },
                viewport: { $ref: "#/$defs/viewport" }
              }
            }
          }
        },
        feedback: {
          type: "object",
          required: ["v", "type", "uid", "ts", "text", "tags"],
          properties: {
            v: { const: 2 },
            type: { const: "feedback" },
            uid: { type: "string" },
            ts: { type: "string", format: "date-time" },
            text: { type: "string" },
            parentUid: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            isTestData: { type: "boolean" }
          }
        },
        viewport: {
          type: "object",
          properties: {
            w: { type: "integer" },
            h: { type: "integer" },
            dpr: { type: "number" },
            colorScheme: { enum: ["light", "dark"] },
            reducedMotion: { type: "boolean" },
            direction: { enum: ["ltr", "rtl"] },
            zoom: { type: "number" }
          }
        },
        rect: {
          type: "object",
          required: ["x", "y", "w", "h"],
          properties: { x: { type: "number" }, y: { type: "number" }, w: { type: "number" }, h: { type: "number" } }
        },
        ancestor: {
          type: "object",
          required: ["tag"],
          properties: {
            tag: { type: "string" },
            id: { type: "string" },
            role: { type: "string" },
            testId: { type: "string" },
            classes: { type: "array", items: { type: "string" } }
          }
        },
        matchedRule: {
          type: "object",
          required: ["selector"],
          properties: {
            selector: { type: "string" },
            declarations: { type: "object", additionalProperties: { type: "string" } },
            media: { type: "string" }
          }
        }
      }
    }, null, 2) + `
`;
    const inferFeedbackCategory = (text) => {
      const t = text.toLowerCase();
      if (/\b(typo|copy|wording|label|misspell|grammar|capitaliz)/.test(t))
        return "copy";
      if (/\b(align|spacing|padding|margin|layout|overlap|crowded|cramped|tight|gap)/.test(t))
        return "layout";
      if (/\b(unclear|confusing|what does|what is|don't understand|hard to|nav|navigation)/.test(t))
        return "affordance";
      if (/\b(contrast|color blind|screen reader|aria|focus|keyboard|tab|a11y|accessib)/.test(t))
        return "accessibility";
      if (/\b(broken|crash|null|undefined|error|404|fail)/.test(t))
        return "state";
      if (/\b(ugly|color|gradient|shadow|polish|visual|style)/.test(t))
        return "visual-polish";
      return "unspecified";
    };
    const buildRepairIndex = (manifest, jsonlName) => {
      const rows = [];
      const byUid = new Map;
      for (const m of messages)
        if (m.type === "selector")
          byUid.set(m.entry.uid, m);
      for (const m of messages) {
        if (m.type !== "feedback")
          continue;
        const parent = m.parentUid ? byUid.get(m.parentUid) : undefined;
        rows.push({ feedback: m, parent });
      }
      if (!rows.length) {
        return [
          "# repair-index.md",
          "",
          `Generated: ${manifest.ts}`,
          "",
          "_(no feedback in this export — nothing to repair)_",
          ""
        ].join(`
`);
      }
      const out = [];
      out.push("# repair-index.md");
      out.push("");
      out.push(`Generated: ${manifest.ts}`);
      out.push(`Workspace: \`${manifest.workspace}\` · Hosts: ${manifest.hosts.map((h) => "`" + h + "`").join(", ") || "(none)"}`);
      out.push("");
      out.push("A starting punch list for an autonomous repair agent. Each row is one user complaint with the data needed to locate, fix, and verify. Cross-reference `" + jsonlName + "` for the full record.");
      out.push("");
      out.push("## Tasks");
      out.push("");
      rows.forEach(({ feedback, parent }, i) => {
        const fbId = `F${String(i + 1).padStart(3, "0")}`;
        const target = parent?.entry;
        out.push(`### ${fbId} — ${feedback.text.slice(0, 80)}${feedback.text.length > 80 ? "…" : ""}`);
        out.push("");
        out.push(`> ${feedback.text.split(`
`).join(`
> `)}`);
        out.push("");
        out.push(`- **feedbackUid:** \`${feedback.id}\``);
        if (target) {
          out.push(`- **target:** \`${target.selector}\` _(uid \`${target.uid}\`, n=${target.n})_`);
          if (target.tag)
            out.push(`- **tag:** \`<${target.tag}>\`${target.role ? ` · role=\`${target.role}\`` : ""}`);
          if (target.accessibleName)
            out.push(`- **accessible name:** "${target.accessibleName.slice(0, 100)}"`);
          if (target.text && target.text !== target.accessibleName) {
            out.push(`- **visible text:** "${target.text.slice(0, 100)}"`);
          }
          if (target.selectorMatchCount !== undefined) {
            out.push(`- **selector quality:** matches ${target.selectorMatchCount} element${target.selectorMatchCount === 1 ? "" : "s"}`);
          }
          if (target.screenshot?.element) {
            out.push(`- **screenshot:** \`${target.screenshot.element}\``);
          } else if (target.screenshot?.group) {
            out.push(`- **screenshot (group):** \`${target.screenshot.group}\``);
          } else {
            out.push(`- **screenshot:** _(missing — see exportDiagnostics)_`);
          }
          if (target.component) {
            const c = target.component;
            const ch = c.chain && c.chain.length ? ` · chain ${c.chain.slice(0, 5).map((n) => "`" + n + "`").join(" → ")}` : "";
            out.push(`- **component:** \`${c.name ?? c.displayName ?? "?"}\` (${c.framework})${ch}`);
            if (c.source?.file)
              out.push(`- **source:** \`${c.source.file}\`${c.source.line ? `:${c.source.line}` : ""}`);
          }
          if (target.componentRoot)
            out.push(`- **component root:** ${target.componentRoot}`);
          if (target.ancestors && target.ancestors.length) {
            const chain = target.ancestors.slice(0, 4).map((a) => `<${a.tag}>${a.id ? "#" + a.id : a.testId ? `[testId="${a.testId}"]` : ""}`).join(" › ");
            out.push(`- **ancestor chain:** ${chain}`);
          }
          if (target.url)
            out.push(`- **url:** ${target.url}`);
        } else {
          out.push(`- **target:** _(no selector — orphaned feedback)_`);
        }
        const cat = inferFeedbackCategory(feedback.text);
        out.push(`- **suggested category:** ${cat}`);
        out.push("");
      });
      out.push("---");
      out.push("");
      out.push("Categories are inferred from feedback text via keyword heuristics — verify before acting.");
      return out.join(`
`);
    };
    const buildReadme = (manifest, jsonlName, shotCount) => {
      const lines = [
        "# PinchGrab Workspace Export",
        "",
        `Generated: ${manifest.ts}`,
        `Workspace: \`${manifest.workspace}\``,
        `Hosts: ${manifest.hosts.length ? manifest.hosts.map((h) => "`" + h + "`").join(", ") : "(none)"}`,
        `Counts: **${manifest.counts.selectors}** selectors · **${manifest.counts.feedback}** comments · **${manifest.counts.pages}** pages · **${shotCount}** screenshots`,
        "",
        "## Triage materials",
        "",
        manifest.skill?.inline ? `- **UI skill (mechanic):** bundled at \`./${manifest.skill.archivePath ?? ".agents/skills/PinchGrab/SKILL.md"}\`${manifest.skill.customized ? " _(customized — trust as authoritative)_" : manifest.skill.template ? " _(bundled default — generic boilerplate, verify before applying)_" : ""} — how to read this export and triage the captures.` : manifest.skill?.path ? `- **UI skill (mechanic):** \`${manifest.skill.path}\` — read on the receiver's filesystem.` : "- **UI skill (mechanic):** not configured.",
        manifest.design?.inline ? `- **DESIGN.md (visual identity):** bundled inline at \`./${manifest.design.archivePath ?? "DESIGN.md"}\`${manifest.design.customized ? " _(customized — trust the tokens / voice rules as project canon)_" : manifest.design.template ? " _(bundled default — placeholder, verify before applying)_" : ""} — color tokens, typography, spacing, motion, voice.` : manifest.design?.path ? `- **DESIGN.md (visual identity):** \`${manifest.design.path}\` — read on the receiver's filesystem.` : "- **DESIGN.md (visual identity):** not configured.",
        "",
        "## Files",
        "",
        "- `repair-index.md` — agent-friendly triage punch list (start here).",
        `- \`${jsonlName}\` — JSONL stream (one capture per line, leading manifest, schema v2).`,
        "- `screenshots/*.png` — full-resolution PNGs of each captured element / group / page.",
        "- `screenshots.json` — uid-keyed index: `byUid[uid] → { element?, group?, page? }`, `byUrl[url] → { page?, uids[] }`, plus a flat `files[]` listing.",
        "- `schema.json` — JSON-Schema (draft 2020-12) describing every row type.",
        "- `duckdb.sql` — copy-and-paste recipes for querying the JSONL with DuckDB.",
        manifest.design?.inline ? `- \`DESIGN.md\` — ${manifest.design.customized ? "project-customized design source-of-truth (trust as canonical)." : manifest.design.template ? "PinchGrab's bundled DESIGN.md template (placeholder — verify before applying)." : ""}` : "",
        manifest.skill?.inline ? `- \`.agents/skills/PinchGrab/SKILL.md\` — ${manifest.skill.customized ? "project-customized triage skill." : manifest.skill.template ? "PinchGrab's bundled default triage skill (template content)." : ""}` : "",
        "",
        "## Extracting",
        "",
        "Pick whichever variant your machine supports — not every system ships `zstd`.",
        "",
        "```sh",
        "# 1. Modern tar with built-in zstd support (Linux + recent macOS):",
        `tar --zstd -xf ${manifest.filename}`,
        "",
        "# 2. tar + standalone zstd CLI:",
        `zstd -d ${manifest.filename} -o ${manifest.filename.replace(/\.zst$/, "")}`,
        `tar -xf ${manifest.filename.replace(/\.zst$/, "")}`,
        "",
        "# 3. Pure-Node fallback (no zstd CLI / no tar):",
        `npx -y @ronomon/zstandard < ${manifest.filename} > ${manifest.filename.replace(/\.zst$/, "")}`,
        `# … then use any tar reader (e.g. \`npx tar-stream\`)`,
        "```",
        "",
        "Expected file list after extraction:",
        "",
        "```",
        `${jsonlName}                    # JSONL stream (the source of truth)`,
        `screenshots/                    # element / group / page PNGs`,
        `screenshots.json                # uid-keyed lookup index`,
        `duckdb.sql                      # copy-paste SQL recipes`,
        `schema.json                     # JSON-Schema for every row type`,
        `README.md                       # this file`,
        manifest.design?.inline ? "DESIGN.md                       # visual identity source-of-truth" : "",
        manifest.skill?.inline ? ".agents/skills/PinchGrab/SKILL.md  # triage instructions" : "",
        "```",
        "",
        "## Quick DuckDB",
        "",
        "```sql",
        `CREATE TABLE captures AS SELECT * FROM read_json_auto('${jsonlName}', format='newline_delimited', maximum_object_size=104857600);`,
        "SELECT n, selector, tag, role, hints FROM captures WHERE type = 'selector' LIMIT 20;",
        "```",
        "",
        "## Schema",
        "",
        'Selector lines have `type: "selector"`, `v: 2`, a stable `uid`, top-level identification fields, and an `_audit` namespace nesting detection metadata (ancestors, componentRoot, matchedRules, viewport). Feedback lines link back via `parentUid` and carry their own `uid`. Group heads carry `groupMemberUids: [uid…]`; each group member is a top-level row with `groupUid` pointing back at the head. Bundled `schema.json` is the canonical machine-readable form.',
        ""
      ];
      return lines.join(`
`);
    };
    const buildScreenshotsIndex = (bundled) => {
      const byUid = {};
      const byUrl = {};
      const files = [];
      const seenFile = new Set;
      const archiveLeaf = (rel) => `screenshots/${rel.split("/").pop() ?? rel}`;
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        const e = m.entry;
        if (!e.uid)
          continue;
        const slot = { n: e.n, selector: e.selector, url: e.url };
        if (e.screenshot?.element)
          slot.element = e.screenshot.element;
        if (e.screenshot?.group)
          slot.group = e.screenshot.group;
        if (e.screenshot?.page)
          slot.page = e.screenshot.page;
        if (e.group && e.group.length) {
          slot.members = e.group.map((g) => g.uid).filter(Boolean);
        }
        byUid[e.uid] = slot;
        const url = e.url;
        const urlSlot = byUrl[url] ?? (byUrl[url] = { uids: [] });
        urlSlot.uids.push(e.uid);
        if (e.screenshot?.page && !urlSlot.page)
          urlSlot.page = e.screenshot.page;
        const pushFile = (rel, kind) => {
          if (!rel || seenFile.has(rel))
            return;
          seenFile.add(rel);
          const inArchive = bundled.has(rel);
          files.push({
            path: rel,
            archivePath: inArchive ? archiveLeaf(rel) : null,
            kind,
            uid: e.uid,
            n: e.n,
            selector: e.selector,
            url: e.url
          });
        };
        pushFile(e.screenshot?.element, "element");
        pushFile(e.screenshot?.group, "group");
        pushFile(e.screenshot?.page, "page");
      }
      const out = {
        v: 2,
        kind: "pinchgrab/screenshots-index",
        generated: new Date().toISOString(),
        counts: {
          files: files.length,
          bundled: files.filter((f) => f.archivePath).length,
          captures: Object.keys(byUid).length,
          urls: Object.keys(byUrl).length
        },
        byUid,
        byUrl,
        files
      };
      return JSON.stringify(out, null, 2) + `
`;
    };
    const dataUrlToBytes = (dataUrl) => {
      const comma = dataUrl.indexOf(",");
      if (comma < 0)
        return new Uint8Array;
      const b64 = dataUrl.slice(comma + 1);
      const binary = atob(b64);
      const out = new Uint8Array(binary.length);
      for (let i = 0;i < binary.length; i++)
        out[i] = binary.charCodeAt(i);
      return out;
    };
    const collectScreenshotEntries = () => {
      const entries = [];
      const bundled = new Set;
      const seen = new Set;
      const push = (relPath, dataUrl) => {
        if (!relPath || !dataUrl)
          return;
        const leaf = relPath.split("/").pop() ?? relPath;
        if (seen.has(leaf))
          return;
        const bytes = dataUrlToBytes(dataUrl);
        if (!bytes.length)
          return;
        entries.push({ name: `screenshots/${leaf}`, data: bytes });
        bundled.add(relPath);
        seen.add(leaf);
      };
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        const sel = m.entry.selector;
        const url = m.entry.url;
        push(m.entry.screenshot?.element, shotsFull.get(sel));
        push(m.entry.screenshot?.group, shotsFull.get(sel));
        push(m.entry.screenshot?.page, shotsFull.get("page::" + url));
      }
      return { entries, bundled };
    };
    const onExportZip = async () => {
      if (!messages.length) {
        setStatus("Nothing to export", { kind: "warn" });
        return;
      }
      const archiveName = buildExportFilename("tar.zst");
      const stem = archiveName.replace(/\.tar\.zst$/, "");
      const jsonlName = `${stem}.jsonl`;
      const manifest = buildManifest(archiveName, "tar.zst");
      const jsonlText = buildJsonl(jsonlName, "tar.zst");
      const sql = duckDbSnippet(jsonlName);
      const { entries: shotEntries, bundled } = collectScreenshotEntries();
      const readme = buildReadme(manifest, jsonlName, shotEntries.length);
      const shotsJson = buildScreenshotsIndex(bundled);
      const repairIndex = buildRepairIndex(manifest, jsonlName);
      const tarEntries = [
        { name: "README.md", data: readme },
        { name: "repair-index.md", data: repairIndex },
        { name: jsonlName, data: jsonlText },
        { name: "screenshots.json", data: shotsJson },
        { name: "duckdb.sql", data: sql },
        { name: "schema.json", data: buildSchemaJson() },
        ...shotEntries
      ];
      const designContent = await resolveDesignContent();
      if (designContent.trim()) {
        tarEntries.push({ name: "DESIGN.md", data: designContent });
      }
      const skillContent = await resolveSkillContent();
      if (skillContent.trim()) {
        const rebranded = rebrandSkillName(skillContent, "PinchGrab");
        tarEntries.push({ name: ".agents/skills/PinchGrab/SKILL.md", data: rebranded });
      }
      try {
        const integrity = { files: [] };
        for (const e of tarEntries) {
          const data = typeof e.data === "string" ? new TextEncoder().encode(e.data) : e.data;
          integrity.files.push({ path: e.name, size: data.length });
        }
        const augmentedManifest = { ...manifest, archiveIntegrity: integrity };
        const lines = jsonlText.split(`
`);
        lines[0] = JSON.stringify(augmentedManifest);
        const newJsonl = lines.join(`
`);
        const idx = tarEntries.findIndex((e) => e.name === jsonlName);
        if (idx >= 0)
          tarEntries[idx] = { name: jsonlName, data: newJsonl };
      } catch (err) {
        console.warn(LOG, "archiveIntegrity computation failed", err);
      }
      const tarBytes = buildTar(tarEntries);
      const archiveBytes = wrapZstd(tarBytes);
      if (inExtension) {
        console.log(LOG, "onExportArchive →", { archiveName, tarBytes: tarBytes.length, archiveBytes: archiveBytes.length, screenshots: shotEntries.length });
        const reply = await sendToBg({
          kind: "save-bytes",
          workspace: activeWs,
          filename: archiveName,
          bytes: Array.from(archiveBytes),
          mime: "application/zstd"
        });
        console.log(LOG, "onExportArchive reply:", reply);
        if (reply?.ok && reply.absPath) {
          lastExport.relPath = reply.filename ?? null;
          lastExport.absPath = reply.absPath;
          lastExport.copyPath = reply.copyPath ?? reply.absPath;
          lastExport.tempPath = Boolean(reply.tempPath);
          lastExport.kind = "tar.zst";
          updateCopyPathButton();
          const pathToCopy = lastExport.copyPath ?? reply.absPath;
          const pathCopied = await copyToClipboardSilent(pathToCopy);
          const leaf = pathToCopy.replace(/[\\/]+$/, "").split(/[\\/]/).pop() ?? pathToCopy;
          if (pathCopied)
            showCopied("Exported and copied", leaf);
          setStatus(`Exported · ${shotEntries.length} screenshot${shotEntries.length === 1 ? "" : "s"} bundled${pathCopied ? " · path copied" : ""}${lastExport.tempPath ? " · Playwright temp hidden" : ""} · ${leaf}`);
          return;
        }
        const err = reply?.error ?? "no reply from background";
        console.error(LOG, "onExportArchive failed:", err);
        setStatus(`Archive export failed: ${err}`, { kind: "warn" });
        showDownloadError("Export failed", String(err));
        return;
      }
      const blob = new Blob([archiveBytes], { type: "application/zstd" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = archiveName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      lastExport.relPath = archiveName;
      lastExport.absPath = archiveName;
      lastExport.copyPath = archiveName;
      lastExport.tempPath = false;
      lastExport.kind = "tar.zst";
      updateCopyPathButton();
      await copyToClipboardSilent(archiveName);
      showCopied("Exported and copied", archiveName);
      setStatus(`Workspace exported · ${shotEntries.length} screenshot${shotEntries.length === 1 ? "" : "s"} bundled · path copied`);
    };
    const copyToClipboardSilent = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return false;
      }
    };
    const duckDbSnippet = (jsonlName) => `-- PinchGrab → DuckDB recipes
-- Save your JSONL export, then in your shell:
--   duckdb < this_file.sql
-- Or open a duckdb shell and paste these one at a time.

-- 1) Load the JSONL into a table.
--    sample_size=-1 forces a full-file scan for schema inference. Without
--    it, DuckDB only sniffs the first 20 480 rows — and PinchGrab exports
--    mix selector + feedback row types, so rare feedback-only fields
--    (tags, parentUid) can be dropped from the inferred schema if they
--    don't appear early enough. That bites recipe 6 below.
CREATE OR REPLACE TABLE pg AS
SELECT * FROM read_json_auto(
  '${jsonlName}',
  format='newline_delimited',
  maximum_object_size=104857600,
  sample_size=-1
);

-- 2) Quick overview: how many captures per host.
SELECT
  regexp_extract(url, '://([^/]+)', 1) AS host,
  COUNT(*) FILTER (WHERE type = 'selector') AS captures,
  COUNT(*) FILTER (WHERE type = 'feedback') AS comments
FROM pg
GROUP BY 1
ORDER BY captures DESC;

-- 3) Find duplicate outerHTML across captures (often signals a reused
--    component the user has clicked into multiple times).
SELECT outerHTML, COUNT(*) AS hits, list(selector) AS selectors
FROM pg
WHERE type = 'selector' AND outerHTML IS NOT NULL
GROUP BY outerHTML
HAVING hits > 1
ORDER BY hits DESC
LIMIT 25;

-- 4) Captures still missing a screenshot path.
SELECT n, url, selector
FROM pg
WHERE type = 'selector' AND screenshot IS NULL
ORDER BY n;

-- 5) Quick design-token surface: rank classes that appear in many captures.
--    NOTE: filter classes IS NOT NULL rather than using a coalesce-with-empty
--    fallback; DuckDB cannot infer element types for an empty list literal.
WITH expanded AS (
  SELECT unnest(classes) AS c
  FROM pg
  WHERE type = 'selector' AND classes IS NOT NULL
)
SELECT c, COUNT(*) AS hits
FROM expanded
GROUP BY 1
ORDER BY hits DESC
LIMIT 30;

-- 6) Comments joined to their parent selector via parentUid. The
--    s.type filter prevents an accidental feedback↔feedback join in case
--    two rows ever share a uid by coincidence.
SELECT s.n, s.selector, f.text, f.tags
FROM pg f
JOIN pg s
  ON s.uid = f.parentUid
 AND s.type = 'selector'
WHERE f.type = 'feedback'
ORDER BY s.n;
`;
    const onDuckDbSnippet = async () => {
      const last = lastExport.relPath;
      const jsonlName = last && /\.jsonl$/.test(last) ? last.split("/").pop() : buildExportFilename("jsonl");
      const sql = duckDbSnippet(jsonlName);
      try {
        await navigator.clipboard.writeText(sql);
        setStatus(`DuckDB recipes copied · paste into \`duckdb\` shell · references ${jsonlName}`);
        showCopied("Copied DuckDB SQL", jsonlName);
      } catch {
        setStatus("Clipboard failed — open the panel in an extension context", { kind: "warn" });
        showDownloadError("Clipboard failed", "Open the panel in an extension context");
      }
    };
    const denormalizeEntry = (raw) => {
      const out = { ...raw };
      delete out.v;
      delete out.type;
      delete out.feedback;
      if (out._audit && typeof out._audit === "object") {
        const a = out._audit;
        if (a.ancestors !== undefined)
          out.ancestors = a.ancestors;
        if (a.componentRoot !== undefined)
          out.componentRoot = a.componentRoot;
        if (a.inShadowDOM !== undefined)
          out.inShadowDOM = a.inShadowDOM;
        if (a.pseudoElements !== undefined)
          out.pseudoElements = a.pseudoElements;
        if (a.matchedRules !== undefined)
          out.matchedRules = a.matchedRules;
        if (a.viewport !== undefined)
          out.viewport = a.viewport;
        delete out._audit;
      }
      if (out.states && !Array.isArray(out.states) && typeof out.states === "object") {
        out.states = Object.keys(out.states).filter((k) => Boolean(out.states[k]));
      }
      if (out.attrs && typeof out.attrs === "object" && typeof out.attrs.format === "string") {
        const fmt = out.attrs.format;
        const { format: _drop, ...restAttrs } = out.attrs;
        out.attrs = restAttrs;
        out.hints = { ...out.hints ?? {}, format: fmt };
      }
      if (!out.uid)
        out.uid = msgId();
      if (Array.isArray(out.group))
        out.group = out.group.map(denormalizeEntry);
      return out;
    };
    const migrateLoadedMessages = () => {
      let mutated = false;
      for (const m of messages) {
        if (m.type !== "selector")
          continue;
        const before = m.entry;
        const needsWork = !before.uid || before.states && !Array.isArray(before.states) || before._audit !== undefined || before.attrs && typeof before.attrs.format === "string";
        if (!needsWork)
          continue;
        m.entry = denormalizeEntry(before);
        mutated = true;
      }
      return mutated;
    };
    const onImport = () => importFile.click();
    importFile.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file)
        return;
      snapshot();
      const text = await file.text();
      const imported = [];
      for (const line of text.split(/\r?\n/)) {
        if (!line.trim())
          continue;
        try {
          const o = JSON.parse(line);
          if (o.type === "manifest") {
            continue;
          }
          if (o.type === "page")
            imported.push({ type: "page", id: msgId(), ts: o.ts ?? new Date().toISOString(), url: o.url, title: o.title, viewport: o.viewport, tokens: o.tokens, userAgent: o.userAgent, lang: o.lang });
          else if (o.type === "feedback") {
            const fb = {
              type: "feedback",
              id: msgId(),
              ts: o.ts ?? new Date().toISOString(),
              text: o.text
            };
            if (o.parentUid)
              fb.parentUid = o.parentUid;
            if (Array.isArray(o.tags) && o.tags.length)
              fb.tags = o.tags;
            if (o.severity)
              fb.severity = o.severity;
            imported.push(fb);
          } else {
            const fb = Array.isArray(o.feedback) ? o.feedback : null;
            const entry = denormalizeEntry(o);
            imported.push({ type: "selector", id: msgId(), ts: o.ts ?? new Date().toISOString(), entry });
            if (fb && o.v !== 2) {
              for (const t of fb)
                imported.push({
                  type: "feedback",
                  id: msgId(),
                  ts: o.ts ?? new Date().toISOString(),
                  text: typeof t === "string" ? t : t?.text ?? "",
                  parentUid: entry.uid
                });
            }
          }
        } catch {}
      }
      messages = [...messages, ...imported];
      persist();
      await runValidation();
      render();
      setStatus(`Imported ${imported.length} message${imported.length === 1 ? "" : "s"}`);
      importFile.value = "";
    });
    const onClear = () => {
      if (!confirm("Clear all captures and comments?"))
        return;
      snapshot();
      messages = [];
      liveTabUrl = null;
      selectorValidity.clear();
      insertBefore.current = null;
      shots.clear();
      shotsFull.clear();
      persistShots();
      persistShotsFull();
      persist();
      render();
      setStatus("Cleared");
    };
    const runValidation = async () => {
      const selectors = [...new Set(messages.filter((m) => m.type === "selector").map((m) => m.entry.selector))];
      if (!selectors.length || !inExtension)
        return;
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0])
          return;
        liveTabUrl = tabs[0].url ?? liveTabUrl;
        liveTabPath = pathOf(liveTabUrl ?? "");
        const reply = await chrome.tabs.sendMessage(tabs[0].id, pg({ kind: "validate", selectors }));
        if (reply?.valid) {
          for (const [sel, ok] of Object.entries(reply.valid)) {
            selectorValidity.set(sel, ok);
            if (!ok)
              selectorErrors.set(sel, "No element on the live page matches this selector.");
          }
          render();
        }
      } catch {}
    };
    const onValidate = async () => {
      setStatus("Re-checking…", { kind: "info" });
      await runValidation();
      setStatus("Validated");
    };
    const fetchStars = async () => {
      const cacheKey = "pinchgrab.gh.stars";
      const cached = await Store.get(cacheKey, null);
      if (cached && Date.now() - cached.ts < 3600000) {
        starsEl.textContent = String(cached.count);
        return;
      }
      try {
        const r = await fetch("https://api.github.com/repos/wranngle/pinchgrab", { cache: "no-store" });
        if (!r.ok)
          throw new Error("status " + r.status);
        const j = await r.json();
        const count = j.stargazers_count ?? 0;
        starsEl.textContent = String(count);
        Store.set(cacheKey, { count, ts: Date.now() });
      } catch {
        starsEl.textContent = "·";
      }
    };
    const onGithub = () => {
      const url = "https://github.com/wranngle/pinchgrab";
      if (inExtension)
        chrome.tabs.create({ url });
      else
        window.open(url, "_blank", "noopener");
    };
    const applyPrefsToUI = () => {
      for (const el of drawer.querySelectorAll("input[data-pref]")) {
        el.checked = Boolean(prefs[el.dataset.pref]);
      }
      for (const el of drawer.querySelectorAll("textarea[data-pref-text]")) {
        el.value = String(prefs[el.dataset.prefText] ?? "");
      }
      for (const el of drawer.querySelectorAll('input[type="text"][data-pref-text]')) {
        el.value = String(prefs[el.dataset.prefText] ?? "");
      }
      updateDesignMdStatus();
    };
    const updateMdStatuses = async () => {
      const designEl = document.querySelector("[data-design-md-status]");
      const skillEl = document.querySelector("[data-skill-md-status]");
      const designBanner = document.querySelector('[data-template-banner="design"]');
      const skillBanner = document.querySelector('[data-template-banner="skill"]');
      const tag = (md, isTpl) => {
        const lines = md.split(`
`).length;
        const bytes = new Blob([md]).size;
        return `${isTpl ? "template" : "custom"} · ${lines} lines · ${(bytes / 1024).toFixed(1)} KB`;
      };
      if (designEl) {
        const content = await resolveDesignContent();
        designEl.textContent = content.trim() ? tag(content, isUsingTemplateDesign()) : "(empty)";
        designEl.classList.toggle("has-content", !isUsingTemplateDesign());
      }
      if (skillEl) {
        const content = await resolveSkillContent();
        skillEl.textContent = content.trim() ? tag(content, isUsingTemplateSkill()) : "(empty)";
        skillEl.classList.toggle("has-content", !isUsingTemplateSkill());
      }
      if (designBanner)
        designBanner.hidden = !isUsingTemplateDesign();
      if (skillBanner)
        skillBanner.hidden = !isUsingTemplateSkill();
      await renderMdPreview("design");
      await renderMdPreview("skill");
    };
    const updateDesignMdStatus = () => {
      updateMdStatuses();
    };
    const renderMdPreview = async (kind) => {
      const previewEl = document.querySelector(`[data-md-preview="${kind}"]`);
      if (!previewEl)
        return;
      const content = kind === "design" ? await resolveDesignContent() : await resolveSkillContent();
      const lines = content.split(`
`);
      const head = lines.slice(0, 6).map((l) => l.length > 80 ? l.slice(0, 80) + "…" : l).join(`
`);
      previewEl.textContent = head + (lines.length > 6 ? `

… (+${lines.length - 6} more lines)` : "");
    };
    const openMdModal = async (kind) => {
      const overlay = document.querySelector("[data-md-modal]");
      if (!overlay)
        return;
      const titleEl = overlay.querySelector("[data-md-modal-title]");
      const taEl = overlay.querySelector("[data-md-modal-textarea]");
      const statsEl2 = overlay.querySelector("[data-md-modal-stats]");
      const bannerEl = overlay.querySelector("[data-md-modal-banner]");
      const saveBtn = overlay.querySelector("[data-md-modal-save]");
      const resetBtn = overlay.querySelector("[data-md-modal-reset]");
      const uploadBtn = overlay.querySelector("[data-md-modal-upload]");
      const downloadBtn = overlay.querySelector("[data-md-modal-download]");
      const closeBtn = overlay.querySelector("[data-md-modal-close]");
      const isDesign = kind === "design";
      const initial = isDesign ? await resolveDesignContent() : await resolveSkillContent();
      const usingTemplate = isDesign ? isUsingTemplateDesign() : isUsingTemplateSkill();
      titleEl.textContent = isDesign ? "DESIGN.md" : "PinchGrab SKILL.md";
      taEl.value = initial;
      overlay.dataset.kind = kind;
      const refreshStats = () => {
        const text = taEl.value;
        const lines = text.split(`
`).length;
        const bytes = new Blob([text]).size;
        statsEl2.textContent = `${lines} lines · ${(bytes / 1024).toFixed(1)} KB`;
      };
      refreshStats();
      bannerEl.hidden = !usingTemplate;
      bannerEl.textContent = usingTemplate ? `⚠ Currently shipping the bundled ${isDesign ? "DESIGN.md" : "SKILL.md"} template — edits here become your customized version.` : "";
      taEl.oninput = refreshStats;
      const onSave = () => {
        const text = taEl.value;
        if (isDesign)
          prefs.designMd = text;
        else
          prefs.skillMd = text;
        persistPrefs();
        updateMdStatuses();
        setStatus(`${isDesign ? "DESIGN.md" : "SKILL.md"} saved`);
        closeMdModal();
      };
      const onReset = () => {
        taEl.value = "";
        refreshStats();
        bannerEl.hidden = false;
        bannerEl.textContent = "Cleared — Save to revert to bundled template, or paste new content.";
      };
      const onUpload = () => {
        const inputId = isDesign ? "design-md-file" : "skill-md-file";
        document.getElementById(inputId)?.click();
      };
      const onDownload = () => {
        const name = isDesign ? "DESIGN.template.md" : "PinchGrab.SKILL.template.md";
        downloadText(name, taEl.value);
      };
      saveBtn.onclick = onSave;
      resetBtn.onclick = onReset;
      uploadBtn.onclick = onUpload;
      downloadBtn.onclick = onDownload;
      closeBtn.onclick = closeMdModal;
      overlay.hidden = false;
      requestAnimationFrame(() => taEl.focus());
    };
    const closeMdModal = () => {
      const overlay = document.querySelector("[data-md-modal]");
      if (overlay)
        overlay.hidden = true;
    };
    const downloadText = (filename, text, mime = "text/markdown") => {
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    const wireMdFileInput = (id, prefKey, label) => {
      const fileInput = document.getElementById(id);
      fileInput?.addEventListener("change", async () => {
        const file = fileInput.files?.[0];
        if (!file)
          return;
        if (file.size > 5 * 1024 * 1024) {
          setStatus(`${label} too large (${(file.size / 1024 / 1024).toFixed(1)} MB > 5 MB cap)`, { kind: "warn" });
          fileInput.value = "";
          return;
        }
        const text = await file.text();
        prefs[prefKey] = text;
        persistPrefs();
        applyPrefsToUI();
        setStatus(`${label} uploaded · ${file.name} · ${(file.size / 1024).toFixed(1)} KB`);
        fileInput.value = "";
      });
    };
    wireMdFileInput("design-md-file", "designMd", "DESIGN.md");
    wireMdFileInput("skill-md-file", "skillMd", "SKILL.md");
    drawer?.addEventListener("change", (e) => {
      const t = e.target;
      if (t.dataset?.pref) {
        prefs[t.dataset.pref] = Boolean(t.checked);
        persistPrefs();
        render();
        return;
      }
      if (t.dataset?.prefText) {
        prefs[t.dataset.prefText] = t.value;
        persistPrefs();
      }
    });
    drawer?.addEventListener("input", (e) => {
      const t = e.target;
      if (t?.dataset?.prefText) {
        prefs[t.dataset.prefText] = t.value;
        persistPrefs();
      }
    });
    const openDrawer = () => {
      drawer.hidden = false;
      renderWsControls();
    };
    const closeDrawer = () => {
      drawer.hidden = true;
    };
    const renderWsControls = () => {
      if (!wsSelect)
        return;
      wsSelect.innerHTML = "";
      for (const w of workspaces) {
        const opt = document.createElement("option");
        opt.value = w.name;
        opt.textContent = w.name;
        if (w.name === activeWs)
          opt.selected = true;
        wsSelect.append(opt);
      }
      if (!wsList)
        return;
      wsList.innerHTML = "";
      for (const w of workspaces) {
        const li = document.createElement("li");
        if (w.name === activeWs)
          li.classList.add("active");
        li.dataset.tip = w.name === activeWs ? `Active workspace: ${w.name}` : `Switch to workspace "${w.name}"`;
        li.addEventListener("click", async (e) => {
          if (e.target.closest("button"))
            return;
          if (w.name === activeWs)
            return;
          await loadWorkspace(w.name);
          render();
        });
        const name = document.createElement("span");
        name.className = "ws-name";
        name.textContent = w.name;
        li.append(name);
        const meta = document.createElement("span");
        meta.className = "ws-meta";
        meta.textContent = new Date(w.createdAt).toLocaleDateString();
        li.append(meta);
        if (workspaces.length > 1) {
          const del = document.createElement("button");
          del.type = "button";
          del.className = "danger";
          del.dataset.tip = "Delete this workspace and everything in it";
          del.innerHTML = PG_ICONS.svgString("trash-2", 13);
          del.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (!confirm(`Delete workspace "${w.name}" and all its captures?`))
              return;
            workspaces = workspaces.filter((x) => x.name !== w.name);
            persistWorkspaces();
            if (inExtension)
              chrome.storage.local.remove([wsMsgKey(w.name), wsShotsKey(w.name), wsShotsFullKey(w.name)]).catch(() => {});
            if (activeWs === w.name)
              await loadWorkspace(workspaces[0].name);
            render();
          });
          li.append(del);
        }
        wsList.append(li);
      }
    };
    wsSelect?.addEventListener("change", async (e) => {
      await loadWorkspace(e.target.value);
      render();
    });
    const COMMANDS = [
      { id: "copy-all", label: "Copy all as JSONL", run: () => void onCopyAll() },
      { id: "export", label: "Download JSONL file", run: () => void onExport() },
      { id: "export-zip", label: "Export workspace as .tar.zst (JSONL + screenshots + DuckDB + README)", run: () => void onExportZip() },
      { id: "copy-path", label: "Copy path of last export", run: () => void onCopyPath() },
      { id: "duckdb", label: "Generate DuckDB query snippet (SQL recipes)", run: () => void onDuckDbSnippet() },
      { id: "import", label: "Import JSONL file", run: onImport },
      { id: "validate", label: "Re-check selectors", run: () => void onValidate() },
      { id: "clear", label: "Clear all captures", run: onClear },
      { id: "settings", label: "Open settings", run: openDrawer },
      { id: "github", label: "Open GitHub repo", run: onGithub },
      { id: "manual", label: "Manual capture (start composer with `> selector`)", run: () => {
        composer.value = "> ";
        composer.focus();
        updateComposerMeter();
      } },
      { id: "undo", label: "Undo", run: undo },
      { id: "redo", label: "Redo", run: redo }
    ];
    const renderPalette = (q = "") => {
      paletteList.innerHTML = "";
      const ql = q.toLowerCase();
      const items = [
        ...COMMANDS.filter((c) => !ql || c.label.toLowerCase().includes(ql)).map((c) => ({ label: c.label, preview: "command", run: c.run })),
        ...messages.filter((m) => m.type === "selector" && (!ql || (m.entry.selector + " " + (m.entry.text ?? "") + " " + (m.entry.componentRoot ?? "")).toLowerCase().includes(ql))).slice(0, 30).map((m) => {
          const fb = collectFeedbackAfter(m.id);
          const preview = (m.entry.text ?? fb[0] ?? m.entry.componentRoot ?? m.entry.selector ?? "").slice(0, 80);
          return {
            label: `#${m.entry.n} ${m.entry.componentRoot ?? m.entry.selector}`,
            preview,
            run: () => {
              closePalette();
              scrollMessageIntoView(m.id);
              sendToCS({ kind: "scroll-to", selector: m.entry.selector });
            }
          };
        })
      ];
      items.forEach((it, i) => {
        const li = document.createElement("li");
        const lbl = document.createElement("span");
        lbl.className = "label";
        lbl.innerHTML = highlightMatch(it.label, q);
        li.append(lbl);
        const p = document.createElement("span");
        p.className = "preview";
        p.innerHTML = highlightMatch(it.preview ?? "", q);
        li.append(p);
        const kbd = document.createElement("span");
        kbd.className = "kbd";
        kbd.textContent = "↵";
        li.append(kbd);
        if (i === 0)
          li.classList.add("active");
        li.addEventListener("click", () => {
          it.run();
        });
        paletteList.append(li);
      });
    };
    const openPalette = (preset = "") => {
      palette.hidden = false;
      paletteInput.value = preset;
      renderPalette(preset);
      paletteInput.focus();
      paletteInput.setSelectionRange(preset.length, preset.length);
    };
    const closePalette = () => {
      palette.hidden = true;
    };
    paletteInput.addEventListener("input", () => renderPalette(paletteInput.value));
    paletteInput.addEventListener("keydown", (e) => {
      const items = [...paletteList.children];
      let active = items.findIndex((li) => li.classList.contains("active"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        for (const li of items)
          li.classList.remove("active");
        active = Math.min(items.length - 1, active + 1);
        items[active]?.classList.add("active");
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        for (const li of items)
          li.classList.remove("active");
        active = Math.max(0, active - 1);
        items[active]?.classList.add("active");
      }
      if (e.key === "Enter") {
        e.preventDefault();
        items[active]?.click();
      }
      if (e.key === "Escape")
        closePalette();
    });
    palette.addEventListener("click", (e) => {
      if (e.target === palette)
        closePalette();
    });
    let tipFor = null;
    const showTip = (target) => {
      const text = target.getAttribute("data-tip");
      if (!text)
        return;
      tooltipEl.textContent = text;
      tooltipEl.hidden = false;
      const r = target.getBoundingClientRect();
      const tipR = tooltipEl.getBoundingClientRect();
      let top = r.bottom + 4;
      let left = r.left + r.width / 2 - tipR.width / 2;
      if (top + tipR.height + 4 > window.innerHeight)
        top = r.top - tipR.height - 4;
      if (left < 4)
        left = 4;
      if (left + tipR.width > window.innerWidth - 4)
        left = window.innerWidth - tipR.width - 4;
      tooltipEl.style.cssText = `top:${top}px;left:${left}px;`;
      tooltipEl.dataset.shown = "true";
    };
    const hideTip = () => {
      tooltipEl.dataset.shown = "false";
      tipFor = null;
      tooltipEl.hidden = true;
    };
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-tip]");
      if (!t || t === tipFor)
        return;
      tipFor = t;
      showTip(t);
    });
    document.addEventListener("mouseout", (e) => {
      const t = e.target.closest("[data-tip]");
      if (t && t === tipFor && !t.contains(e.relatedTarget))
        hideTip();
    });
    const buildDrilldown = (kind) => {
      const lines = [];
      if (kind === "selectors") {
        lines.push("<h5>Selectors by quality</h5>");
        const buckets = { id: 0, testid: 0, class: 0, nth: 0, tag: 0 };
        for (const m of messages) {
          if (m.type !== "selector")
            continue;
          const e = m.entry;
          if (e.testId)
            buckets.testid++;
          else if (e.id || /^#[\w-]+$/.test(e.selector))
            buckets.id++;
          else if ((e.selector ?? "").includes(":nth-of-type"))
            buckets.nth++;
          else if (/\./.test(e.selector ?? ""))
            buckets.class++;
          else
            buckets.tag++;
        }
        lines.push(`<ul>
        <li><b>${buckets.testid}</b> data-testid</li>
        <li><b>${buckets.id}</b> stable id</li>
        <li><b>${buckets.class}</b> class-based</li>
        <li><b>${buckets.nth}</b> nth-of-type</li>
        <li><b>${buckets.tag}</b> tag-only</li>
      </ul>`);
      } else if (kind === "stale") {
        lines.push("<h5>Stale captures</h5><ul>");
        const stale = messages.filter((m) => m.type === "selector" && selectorValidity.get(m.entry.selector) === false);
        if (!stale.length)
          lines.push("<li>None — everything resolves.</li>");
        else
          for (const m of stale)
            lines.push(`<li><b>#${m.entry.n}</b> <code>${escapeHtml((m.entry.selector ?? "").slice(0, 50))}</code></li>`);
        lines.push("</ul>");
      } else if (kind === "comments") {
        lines.push("<h5>Comments</h5><ul>");
        const fbs = messages.filter((m) => m.type === "feedback");
        lines.push(`<li>Total words: <b>${fbs.reduce((s, m) => s + wordCount(m.text), 0)}</b></li>`);
        lines.push(`<li>Average length: <b>${fbs.length ? Math.round(fbs.reduce((s, m) => s + m.text.length, 0) / fbs.length) : 0}</b> chars</li>`);
        lines.push("</ul>");
      } else if (kind === "pages") {
        lines.push("<h5>Pages</h5><ul>");
        const seen = new Map;
        for (const m of messages)
          if (m.type === "selector")
            seen.set(m.entry.url, (seen.get(m.entry.url) ?? 0) + 1);
        for (const [url, n] of seen)
          lines.push(`<li><b>${n}</b> selector${n === 1 ? "" : "s"} · <code>${escapeHtml(pathOf(url))}</code></li>`);
        lines.push("</ul>");
      }
      return lines.join("");
    };
    const showDrilldown = (target) => {
      const kind = target.getAttribute("data-stat");
      if (!kind)
        return;
      drilldownEl.innerHTML = buildDrilldown(kind);
      drilldownEl.hidden = false;
      const r = target.getBoundingClientRect();
      const dR = drilldownEl.getBoundingClientRect();
      let top = r.bottom + 6;
      let left = r.left + r.width / 2 - dR.width / 2;
      if (top + dR.height + 4 > window.innerHeight)
        top = r.top - dR.height - 6;
      if (left < 6)
        left = 6;
      if (left + dR.width > window.innerWidth - 6)
        left = window.innerWidth - dR.width - 6;
      drilldownEl.style.cssText = `top:${top}px;left:${left}px;`;
    };
    const hideDrilldown = () => {
      drilldownEl.hidden = true;
    };
    statsEl.addEventListener("mouseover", (e) => {
      const t = e.target.closest(".stat[data-stat]");
      if (t)
        showDrilldown(t);
    });
    statsEl.addEventListener("mouseout", (e) => {
      if (!statsEl.contains(e.relatedTarget))
        hideDrilldown();
    });
    for (const btn of document.querySelectorAll("[data-export-hover]")) {
      btn.addEventListener("mouseenter", () => {
        const selectors = messages.filter((m) => m.type === "selector").map((m) => m.entry.selector);
        sendToCS({ kind: "outline-multi", selectors });
        for (const el of list.querySelectorAll(".msg.selector"))
          el.classList.add("export-hover");
      });
      btn.addEventListener("mouseleave", () => {
        sendToCS({ kind: "outline-multi-clear" });
        for (const el of list.querySelectorAll(".msg.selector"))
          el.classList.remove("export-hover");
      });
    }
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-action]");
      if (!trigger)
        return;
      e.preventDefault();
      const action = trigger.getAttribute("data-action");
      switch (action) {
        case "send":
          sendFeedback();
          return;
        case "copy-all":
          onCopyAll();
          return;
        case "export":
          onExport();
          return;
        case "export-zip":
          onExportZip();
          return;
        case "copy-path":
          onCopyPath();
          return;
        case "import":
          onImport();
          return;
        case "validate":
          onValidate();
          return;
        case "clear":
          onClear();
          return;
        case "github":
          onGithub();
          return;
        case "settings":
          openDrawer();
          return;
        case "close-drawer":
          closeDrawer();
          return;
        case "undo":
          undo();
          return;
        case "redo":
          redo();
          return;
        case "design-edit": {
          openMdModal("design");
          return;
        }
        case "skill-edit": {
          openMdModal("skill");
          return;
        }
        case "design-upload": {
          document.getElementById("design-md-file")?.click();
          return;
        }
        case "design-template-download": {
          (async () => {
            const text = await loadTemplate("localDesign") || await loadTemplate("designTemplate");
            if (!text) {
              setStatus("Template not found", { kind: "warn" });
              return;
            }
            downloadText("DESIGN.template.md", text);
            setStatus("DESIGN.md template downloaded — fill in and re-upload");
          })();
          return;
        }
        case "design-reset-template": {
          prefs.designMd = "";
          persistPrefs();
          applyPrefsToUI();
          setStatus("DESIGN.md reset — exports will bundle the template");
          return;
        }
        case "skill-upload": {
          document.getElementById("skill-md-file")?.click();
          return;
        }
        case "skill-template-download": {
          (async () => {
            const text = await loadTemplate("localSkill") || await loadTemplate("skillTemplate");
            if (!text) {
              setStatus("Template not found", { kind: "warn" });
              return;
            }
            downloadText("PinchGrab.SKILL.template.md", text);
            setStatus("SKILL.md template downloaded");
          })();
          return;
        }
        case "skill-reset-template": {
          prefs.skillMd = "";
          persistPrefs();
          applyPrefsToUI();
          setStatus("SKILL.md reset — exports will bundle the template");
          return;
        }
        case "ws-create": {
          const name = (wsName.value ?? "").trim();
          if (!name)
            return;
          if (workspaces.find((w) => w.name === name)) {
            setStatus("Already exists", { kind: "warn" });
            return;
          }
          workspaces.push({ name, createdAt: new Date().toISOString() });
          persistWorkspaces();
          wsName.value = "";
          loadWorkspace(name).then(render);
        }
      }
    });
    const isEditableKeyboardTarget = (target) => {
      const el = target instanceof HTMLElement ? target : null;
      return Boolean(el?.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]'));
    };
    document.addEventListener("keydown", (e) => {
      const editableTarget = isEditableKeyboardTarget(e.target);
      if (editableTarget && (e.metaKey || e.ctrlKey) && ["a", "z", "y"].includes(e.key.toLowerCase()))
        return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        palette.hidden ? openPalette() : closePalette();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "y" || e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        redo();
        return;
      }
      if (e.key === "Escape") {
        const mdModal = document.querySelector("[data-md-modal]");
        if (mdModal && !mdModal.hidden) {
          closeMdModal();
          return;
        }
        if (!palette.hidden) {
          closePalette();
          return;
        }
        if (!drawer.hidden) {
          closeDrawer();
          return;
        }
        if (pendingMulti.length) {
          sendToCS({ kind: "pending-cancel" });
          pendingMulti = [];
          render();
          setStatus("Pending group cancelled");
          return;
        }
        if (insertBefore.current) {
          insertBefore.current = null;
          render();
          setStatus("Insert mode cancelled");
          return;
        }
        if (searchQuery) {
          search.value = "";
          searchQuery = "";
          render();
        }
      }
      if (e.key === "Alt" || e.altKey)
        sendToCS({ kind: "alt-state", on: true });
    });
    document.addEventListener("keyup", (e) => {
      if (!e.altKey)
        sendToCS({ kind: "alt-state", on: false });
    });
    let panelReady = false;
    const pendingPanelMessages = [];
    const receivePanelMessage = (m) => {
      if (!panelReady) {
        pendingPanelMessages.push(m);
        return;
      }
      onCsMessage(m);
    };
    if (inExtension) {
      chrome.runtime.onMessage.addListener((m) => receivePanelMessage(m));
      chrome.tabs?.onActivated?.addListener(() => void runValidation());
      chrome.tabs?.onUpdated?.addListener((_id, info) => {
        if (info?.status === "complete")
          runValidation();
      });
    } else {
      window.addEventListener("pinchgrab:to-panel", (e) => receivePanelMessage(e.detail));
    }
    const installTestApi = () => {
      window.__pinchgrab_panel = {
        pushMessage: (m) => {
          messages.push(m);
          persist();
          render();
        },
        onCapture,
        onHover,
        onHoverEnd,
        getMessages: () => [...messages],
        getPrefs: () => ({ ...prefs }),
        setPrefs: (p) => {
          prefs = { ...prefs, ...p };
          persistPrefs();
          applyPrefsToUI();
          render();
        },
        buildJsonl,
        buildExportFilename,
        buildManifest,
        dominantHostSlug,
        distinctHosts,
        duckDbSnippet,
        onExportZip,
        onExport,
        onCopyPath,
        denormalizeEntry,
        getLastExport: () => ({ ...lastExport }),
        __seedShotsFull: (dataUrl) => {
          for (const m of messages) {
            if (m.type === "selector")
              shotsFull.set(m.entry.selector, dataUrl);
          }
          persistShotsFull();
        },
        __getShotsFull: () => shotsFull,
        setSearch: (q) => {
          searchQuery = q;
          search.value = q;
          render();
        },
        setValidity: (sel, ok, reason) => {
          selectorValidity.set(sel, ok);
          if (reason)
            selectorErrors.set(sel, reason);
          render();
        },
        clear: () => {
          snapshot();
          messages = [];
          liveTabUrl = null;
          liveTabPath = null;
          lastActiveSelector = null;
          pendingMulti = [];
          selectorValidity.clear();
          shots.clear();
          persist();
          render();
        },
        openPalette,
        closePalette,
        openDrawer,
        closeDrawer,
        sendFeedback,
        undo,
        redo,
        listWorkspaces: () => [...workspaces],
        activeWorkspace: () => activeWs,
        setStickyTTL: (ms) => {
          STICKY_TTL_MS = ms;
        },
        forceStickyExpire: () => {
          clearTimeout(stickyTimer);
          panelHovered = false;
          armStickyExpiry();
        },
        setLastActive,
        createWorkspace: (n) => {
          workspaces.push({ name: n, createdAt: new Date().toISOString() });
          persistWorkspaces();
          return loadWorkspace(n).then(render);
        },
        switchWorkspace: (n) => loadWorkspace(n).then(render)
      };
    };
    (async () => {
      await loadAll();
      panelReady = true;
      for (const m of pendingPanelMessages.splice(0))
        onCsMessage(m);
      render();
      installTestApi();
      runValidation();
      fetchStars();
      updateComposerMeter();
      updateUndoButtons();
      console.log(LOG, "ready", { inExtension, ws: activeWs, messages: messages.length });
    })();
  })();
})();

//# debugId=3B9B4B6A28CA567764756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjXFx0eXBlcy50cyIsICJzcmNcXGx1Y2lkZS50cyIsICJzcmNcXHRhci50cyIsICJzcmNcXHRlbXBsYXRlcy5nZW4udHMiLCAic3JjXFxzaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT5cbiAgYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7KCsrX21pZENvdW50ZXIpLnRvU3RyaW5nKDM2KX0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA4KX1gO1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gU3Vic2V0IG9mIGx1Y2lkZS5kZXYgaWNvbnMgaW5saW5lZCBhcyBTVkcgaW5uZXItbWFya3VwLlxuLy8gRWFjaCBlbnRyeSBpcyB0aGUgYm9keSBvZiA8c3ZnIC4uLiA+IC4uLiA8L3N2Zz47IHN2Z1N0cmluZygpIHdyYXBzIGl0LlxuLy8gU2l6ZXMgZGVmYXVsdCB0byAxNjsgb3ZlcnJpZGUgd2l0aCB0aGUgc2l6ZSBhcmd1bWVudC5cbi8vXG4vLyBNSVQg4oCUIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWNpZGUtaWNvbnMvbHVjaWRlXG5cbmNvbnN0IElDT05TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2hldnJvbi1yaWdodCc6ICc8cGF0aCBkPVwibTkgMTggNi02LTYtNlwiLz4nLFxuICAnY2hldnJvbi1kb3duJzogJzxwYXRoIGQ9XCJtNiA5IDYgNiA2LTZcIi8+JyxcbiAgY29weTogJzxyZWN0IHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjhcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk00IDE2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDJcIi8+JyxcbiAgcGVuY2lsOiAnPHBhdGggZD1cIk0yMS4xNzQgNi44MTJhMSAxIDAgMCAwLTMuOTg2LTMuOTg3TDMuODQyIDE2LjE3NGEyIDIgMCAwIDAtLjUuODNsLTEuMzIxIDQuMzUyYS41LjUgMCAwIDAgLjYyMy42MjJsNC4zNTMtMS4zMmEyIDIgMCAwIDAgLjgzLS40OTd6XCIvPjxwYXRoIGQ9XCJtMTUgNSA0IDRcIi8+JyxcbiAgJ3RyYXNoLTInOiAnPHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjZcIi8+PHBhdGggZD1cIk04IDZWNGMwLTEgMS0yIDItMmg0YzEgMCAyIDEgMiAydjJcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiMTBcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjE0XCIgeDI9XCIxNFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPicsXG4gIHBsdXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+PHBhdGggZD1cIk0xMiA1djE0XCIvPicsXG4gIHg6ICc8cGF0aCBkPVwiTTE4IDYgNiAxOFwiLz48cGF0aCBkPVwibTYgNiAxMiAxMlwiLz4nLFxuICBtaW51czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz4nLFxuICBzZWFyY2g6ICc8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjhcIi8+PHBhdGggZD1cIm0yMSAyMS00LjMtNC4zXCIvPicsXG4gIGRvd25sb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCI3IDEwIDEyIDE1IDE3IDEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIxNVwiIHkyPVwiM1wiLz4nLFxuICB1cGxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE3IDggMTIgMyA3IDhcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjNcIiB5Mj1cIjE1XCIvPicsXG4gIGdpdGh1YjogJzxwYXRoIGQ9XCJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNCA1LjQgMCAwIDAgNCA5YzAgMy41IDMgNS41IDYgNS41LS4zOS40OS0uNjggMS4wNS0uODUgMS42NS0uMTcuNi0uMjIgMS4yMy0uMTUgMS44NXY0XCIvPjxwYXRoIGQ9XCJNOSAxOGMtNC41MSAyLTUtMi03LTJcIi8+JyxcbiAgc3RhcjogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIi8+JyxcbiAgJ2NpcmNsZS1kb3QnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIGNyb3NzaGFpcjogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIyMlwiIHgyPVwiMThcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjZcIiB4Mj1cIjJcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiNlwiIHkyPVwiMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMjJcIiB5Mj1cIjE4XCIvPicsXG4gIHRhcmdldDogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI2XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMlwiLz4nLFxuICAncGFuZWwtbGVmdC1jbG9zZSc6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIvPjxwYXRoIGQ9XCJNOSAzdjE4XCIvPjxwYXRoIGQ9XCJtMTYgMTUtMy0zIDMtM1wiLz4nLFxuICAnZXh0ZXJuYWwtbGluayc6ICc8cGF0aCBkPVwiTTE1IDNoNnY2XCIvPjxwYXRoIGQ9XCJNMTAgMTQgMjEgM1wiLz48cGF0aCBkPVwiTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDZcIi8+JyxcbiAgJ21lc3NhZ2Utc3F1YXJlLXBsdXMnOiAnPHBhdGggZD1cIk0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnpcIi8+PGxpbmUgeDE9XCI5XCIgeDI9XCIxNVwiIHkxPVwiMTBcIiB5Mj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI3XCIgeTI9XCIxM1wiLz4nLFxuICAnYWxlcnQtY2lyY2xlJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjhcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyLjAxXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgJ3JlZnJlc2gtY3cnOiAnPHBhdGggZD1cIk0zIDEyYTkgOSAwIDAgMSAxNS02LjdMMjEgOFwiLz48cGF0aCBkPVwiTTIxIDN2NWgtNVwiLz48cGF0aCBkPVwiTTIxIDEyYTkgOSAwIDAgMS0xNSA2LjdMMyAxNlwiLz48cGF0aCBkPVwiTTMgMjF2LTVoNVwiLz4nLFxuICAnZmlsZS10ZXh0JzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTNcIiB5Mj1cIjEzXCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjE3XCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjEwXCIgeDI9XCI4XCIgeTE9XCI5XCIgeTI9XCI5XCIvPicsXG4gICdmaWxlLWNvZGUnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48cGF0aCBkPVwibTEwIDEzLTIgMiAyIDJcIi8+PHBhdGggZD1cIm0xNCAxNyAyLTItMi0yXCIvPicsXG4gIGltYWdlOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiOVwiIHI9XCIyXCIvPjxwYXRoIGQ9XCJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMVwiLz4nLFxuICAvLyBTdHlsaXNlZCBcInBpbmNoXCIg4oCUIHR3byBvcHBvc2luZyBjdXJ2ZXMgbWVldGluZyBhdCBhIGNlbnRlciBkb3QuXG4gIHBpbmNoOiAnPHBhdGggZD1cIk01IDVjMyAyIDUgNCA3IDctMiAzLTQgNS03IDdcIi8+PHBhdGggZD1cIk0xOSA1Yy0zIDItNSA0LTcgNyAyIDMgNCA1IDcgN1wiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEuNVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgJ3N0YXItZmlsbGVkJzogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIHBpbjogJzxwYXRoIGQ9XCJNMTIgMTd2NVwiLz48cGF0aCBkPVwiTTkgMTAuNzZhMiAyIDAgMCAxLTEuMTEgMS43OWwtMS43OC45QTIgMiAwIDAgMCA1IDE1LjI0VjE2YTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtLjc2YTIgMiAwIDAgMC0xLjExLTEuNzlsLTEuNzgtLjlBMiAyIDAgMCAxIDE1IDEwLjc2VjdhMSAxIDAgMCAxIDEtMSAyIDIgMCAwIDAgMC00SDhhMiAyIDAgMCAwIDAgNCAxIDEgMCAwIDEgMSAxelwiLz4nLFxuICB1bmRvOiAnPHBhdGggZD1cIk0zIDd2Nmg2XCIvPjxwYXRoIGQ9XCJNMjEgMTdhOSA5IDAgMCAwLTE1LTYuN0wzIDEzXCIvPicsXG4gIHJlZG86ICc8cGF0aCBkPVwiTTIxIDd2NmgtNlwiLz48cGF0aCBkPVwiTTMgMTdhOSA5IDAgMCAxIDE1LTYuN0wyMSAxM1wiLz4nLFxuICBmb2xkZXI6ICc8cGF0aCBkPVwiTTIwIDIwYTIgMiAwIDAgMCAyLTJWOGEyIDIgMCAwIDAtMi0yaC03LjkzYTIgMiAwIDAgMS0xLjY2LS45bC0uODItMS4yQTIgMiAwIDAgMCA3LjkzIDNINGEyIDIgMCAwIDAtMiAydjEzYTIgMiAwIDAgMCAyIDJaXCIvPicsXG4gIGNoZWNrOiAnPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIvPicsXG4gICdjaXJjbGUtY2hlY2snOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiLz4nLFxuICBncmlwOiAnPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjE5XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxOVwiIHI9XCIxXCIvPicsXG4gIHNldHRpbmdzOiAnPHBhdGggZD1cIk0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIvPicsXG4gIGluZm86ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJNMTIgMTZ2LTRcIi8+PHBhdGggZD1cIk0xMiA4aC4wMVwiLz4nLFxuICAvLyBUcmVlLW9mLXJvd3Mg4oCUIHVzZWQgZm9yIFwiU3BsaXQgZ3JvdXBcIiBhY3Rpb24gKGRlbm90ZXMgb25lIG5vZGUgZmFubmluZ1xuICAvLyBvdXQgaW50byBzaWJsaW5ncykuIEx1Y2lkZSdzIGBsaXN0LXRyZWVgLlxuICAnbGlzdC10cmVlJzogJzxwYXRoIGQ9XCJNMjEgMTJoLThcIi8+PHBhdGggZD1cIk0yMSA2SDhcIi8+PHBhdGggZD1cIk0yMSAxOGgtOFwiLz48cGF0aCBkPVwiTTMgNnY0YzAgMS4xLjkgMiAyIDJoM1wiLz48cGF0aCBkPVwiTTMgMTB2NmMwIDEuMS45IDIgMiAyaDNcIi8+JyxcbiAgLy8gR2VuZXJpYyBzcGxpdCBpY29uIGFzIGEgZmFsbGJhY2sgb3B0aW9uLlxuICBzcGxpdDogJzxwYXRoIGQ9XCJNMTYgM2g1djVcIi8+PHBhdGggZD1cIk04IDNIM3Y1XCIvPjxwYXRoIGQ9XCJtMjEgMy03LjQ2IDcuNDZhMiAyIDAgMCAwIDAgMi44M0wyMSAyMVwiLz48cGF0aCBkPVwiTTMgM2w3LjQ2IDcuNDZhMiAyIDAgMCAxIDAgMi44M0wzIDIxXCIvPicsXG4gIC8vIENhcmRib2FyZC1zdHlsZSBib3ggdXNlZCBmb3IgXCJFeHBvcnQgd29ya3NwYWNlIGFzIFpJUFwiLlxuICBwYWNrYWdlOiAnPHBhdGggZD1cIm03LjUgNC4yNyA5IDUuMTVcIi8+PHBhdGggZD1cIk0yMSA4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNlpcIi8+PHBhdGggZD1cIk0zLjMgNyAxMiAxMmw4LjctNVwiLz48cGF0aCBkPVwiTTEyIDIyVjEyXCIvPicsXG4gIC8vIFR3byBpbnRlcmxvY2tpbmcgbGlua3Mg4oCUIHVzZWQgZm9yIFwiQ29weSBhcyBwYXRoXCIuXG4gIGxpbms6ICc8cGF0aCBkPVwiTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIk0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MVwiLz4nLFxuICAvLyBEYXRhYmFzZS9kdWNrIGljb24gZm9yIHRoZSBEdWNrREIgcGFsZXR0ZSBjb21tYW5kLlxuICBkYXRhYmFzZTogJzxlbGxpcHNlIGN4PVwiMTJcIiBjeT1cIjVcIiByeD1cIjlcIiByeT1cIjNcIi8+PHBhdGggZD1cIk0zIDVWMTlBOSAzIDAgMCAwIDIxIDE5VjVcIi8+PHBhdGggZD1cIk0zIDEyQTkgMyAwIDAgMCAyMSAxMlwiLz4nLFxufTtcblxuY29uc3Qgd3JhcCA9IChib2R5OiBzdHJpbmcsIHNpemU6IG51bWJlcik6IHN0cmluZyA9PlxuICBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj4ke2JvZHl9PC9zdmc+YDtcblxuZXhwb3J0IGNvbnN0IFBHX0lDT05TID0ge1xuICBoYXM6IChuYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IG5hbWUgaW4gSUNPTlMsXG4gIHN2Z1N0cmluZzogKG5hbWU6IHN0cmluZywgc2l6ZSA9IDE2KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBib2R5ID0gSUNPTlNbbmFtZV07XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tsdWNpZGVdIG1pc3NpbmcgaWNvbicsIG5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChib2R5LCBzaXplKTtcbiAgfSxcbiAgbW91bnQ6IChlbDogRWxlbWVudCB8IG51bGwsIG5hbWU6IHN0cmluZywgc2l6ZT86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChlbCkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICB9LFxufTtcblxuLy8gU2lkZS1lZmZlY3QgZm9yIGxlZ2FjeSBzY3JpcHQtdGFnIGluY2x1c2lvbiAoc2lkZXBhbmVsLmh0bWwgc3RpbGwgPHNjcmlwdFxuLy8gc3JjPVwibHVjaWRlLmpzXCI+IOKAlCBwcmUtYnVuZGxlKS4gUmUtZXhwb3NlcyB0aGUgcmVnaXN0cnkgb24gZ2xvYmFsVGhpcy5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5QR19JQ09OUyA9IFBHX0lDT05TO1xufVxuIiwKICAgICIvLyBVU1RBUi1mb3JtYXQgdGFyIGVuY29kZXIuIEVhY2ggZW50cnkgaXMgYSA1MTItYnl0ZSBoZWFkZXIgZm9sbG93ZWQgYnlcbi8vIGNvbnRlbnQgYnl0ZXMgcGFkZGVkIHVwIHRvIHRoZSBuZXh0IDUxMi1ieXRlIGJvdW5kYXJ5LiBUaGUgYXJjaGl2ZSBlbmRzXG4vLyB3aXRoIHR3byB6ZXJvLWZpbGxlZCA1MTItYnl0ZSBibG9ja3MuIH44MCBsaW5lcywgbm8gZGVwZW5kZW5jaWVzLlxuLy9cbi8vIFdlIHBpY2sgdGFyIChyYXRoZXIgdGhhbiB6aXApIGJlY2F1c2UgenN0ZCBpcyB0aGUgd2lyZSBmb3JtYXQgd2Ugd2FudCB0b1xuLy8gcGFpciBpdCB3aXRoIGFuZCB0YXIuenN0IGlzIHRoZSBzdGFuZGFyZCBjb21ibyAoemlwIGlzIGl0cyBvd25cbi8vIGNvbXByZXNzaW9uIGNvbnRhaW5lcikuIEZvciBmaWxlcyB3aXRoIHBhdGhzIGxvbmdlciB0aGFuIDEwMCBjaGFycyB3ZVxuLy8gdGhyb3cgcmF0aGVyIHRoYW4gaW1wbGVtZW50IHRoZSBHTlUvUEFYIGxvbmctbmFtZSBleHRlbnNpb25zIOKAlCB0aGVcbi8vIFBpbmNoR3JhYiBhcmNoaXZlIGxheW91dCB1c2VzIHNob3J0IHBhdGhzIG9ubHkuXG5cbmNvbnN0IGVuYyA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG5jb25zdCB3cml0ZU9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIC8vIHRhciBmaWVsZHMgYXJlIHplcm8tcGFkZGVkIG51bGwtdGVybWluYXRlZCBvY3RhbCBzdHJpbmdzLlxuICBsZXQgcyA9IHZhbHVlLnRvU3RyaW5nKDgpO1xuICBzID0gcy5wYWRTdGFydChsZW5ndGggLSAxLCAnMCcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDE7IGkrKykgYnVmW29mZnNldCArIGldID0gcy5jaGFyQ29kZUF0KGkpO1xuICBidWZbb2Zmc2V0ICsgbGVuZ3RoIC0gMV0gPSAwO1xufTtcblxuY29uc3Qgd3JpdGVBc2NpaSA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBzdHI6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3QgYnl0ZXMgPSBlbmMuZW5jb2RlKHN0cik7XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKGJ5dGVzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV0hO1xufTtcblxuY29uc3QgaGVhZGVyQ2hlY2tzdW0gPSAoaGVhZGVyOiBVaW50OEFycmF5KTogbnVtYmVyID0+IHtcbiAgLy8gVGhlIGNoZWNrc3VtIGZpZWxkICg4IGJ5dGVzIGF0IG9mZnNldCAxNDgpIGlzIHRyZWF0ZWQgYXMgQVNDSUkgc3BhY2VzXG4gIC8vIGR1cmluZyBjb21wdXRhdGlvbiwgdGhlbiB0aGUgYWN0dWFsIGNoZWNrc3VtIGlzIHdyaXR0ZW4gaW50byBpdC5cbiAgbGV0IHN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICBpZiAoaSA+PSAxNDggJiYgaSA8IDE1Nikgc3VtICs9IDB4MjA7XG4gICAgZWxzZSBzdW0gKz0gaGVhZGVyW2ldID8/IDA7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbmV4cG9ydCB0eXBlIFRhckVudHJ5ID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRhdGE6IFVpbnQ4QXJyYXkgfCBzdHJpbmc7XG4gIG10aW1lPzogbnVtYmVyOyAvLyB1bml4IGVwb2NoIHNlY29uZHM7IGRlZmF1bHRzIHRvIG5vd1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVGFyID0gKGVudHJpZXM6IFRhckVudHJ5W10pOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgY29uc3Qgbm93U2VjID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZW50cnkuZGF0YSA9PT0gJ3N0cmluZycgPyBlbmMuZW5jb2RlKGVudHJ5LmRhdGEpIDogZW50cnkuZGF0YTtcbiAgICBjb25zdCBuYW1lID0gZW50cnkubmFtZTtcbiAgICBpZiAobmFtZS5sZW5ndGggPiAxMDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdGFyOiBmaWxlbmFtZSB0b28gbG9uZyAoJHtuYW1lLmxlbmd0aH0gPiAxMDAgY2hhcnMpOiAke25hbWV9YCk7XG4gICAgfVxuICAgIGNvbnN0IGhlYWRlciA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDAsIG5hbWUsIDEwMCk7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwMCwgMG82NDQsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RlXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwOCwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1aWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTE2LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMjQsIGRhdGEubGVuZ3RoLCAxMik7ICAgICAgICAgICAgICAgICAgLy8gc2l6ZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMzYsIGVudHJ5Lm10aW1lID8/IG5vd1NlYywgMTIpOyAgICAgICAgLy8gbXRpbWVcbiAgICBmb3IgKGxldCBpID0gMTQ4OyBpIDwgMTU2OyBpKyspIGhlYWRlcltpXSA9IDB4MjA7ICAgICAgICAgIC8vIGNoZWNrc3VtIHBsYWNlaG9sZGVyXG4gICAgaGVhZGVyWzE1Nl0gPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0eXBlZmxhZyAnMCcgPSByZWd1bGFyIGZpbGVcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjU3LCAndXN0YXInLCA2KTsgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI2MywgJzAwJywgMik7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2ZXJzaW9uXG4gICAgLy8gdW5hbWUvZ25hbWUvZGV2bWFqb3IvZGV2bWlub3IvcHJlZml4IGFsbCBsZWZ0IHplcm8uXG5cbiAgICBjb25zdCBjaGVja3N1bSA9IGhlYWRlckNoZWNrc3VtKGhlYWRlcik7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDE0OCwgY2hlY2tzdW0sIDgpO1xuXG4gICAgYmxvY2tzLnB1c2goaGVhZGVyKTtcbiAgICBibG9ja3MucHVzaChkYXRhKTtcbiAgICBjb25zdCBwYWQgPSAoNTEyIC0gKGRhdGEubGVuZ3RoICUgNTEyKSkgJSA1MTI7XG4gICAgaWYgKHBhZCkgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkocGFkKSk7XG4gIH1cbiAgLy8gVHJhaWxlcjogdHdvIGNvbnNlY3V0aXZlIDUxMi1ieXRlIHplcm8gYmxvY2tzLlxuICBibG9ja3MucHVzaChuZXcgVWludDhBcnJheSgxMDI0KSk7XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmZzZXQpOyBvZmZzZXQgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBac3RkIHJhdy1ibG9jayBmcmFtZSB3cml0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gQ29tcHJlc3Npb25TdHJlYW0oJ3pzdGQnKSBpc24ndCBzaGlwcGVkIGluIGN1cnJlbnQgQ2hyb21pdW0gKHZlcmlmaWVkIHZpYVxuLy8gcnVudGltZSBwcm9iZSksIHNvIHdlIHdyaXRlIGEgdmFsaWQgenN0ZCBmcmFtZSBjb250YWluaW5nIG9uZSBvciBtb3JlXG4vLyByYXcgKHVuY29tcHJlc3NlZCkgYmxvY2tzLiBUaGUgb3V0cHV0IGlzIHN0cnVjdHVyYWxseSBhIHJlYWwgYC50YXIuenN0YFxuLy8gZmlsZTogYHpzdGQgLWRgIGFjY2VwdHMgaXQsIDctWmlwIGFjY2VwdHMgaXQsIGxpYnpzdGQgYWNjZXB0cyBpdC4gSXRcbi8vIGp1c3QgZG9lc24ndCBhY3R1YWxseSBjb21wcmVzcyDigJQgZm9yIG91ciBwYXlsb2FkLCB3aGljaCBpcyBtb3N0bHkgUE5HXG4vLyAoYWxyZWFkeSBjb21wcmVzc2VkKSBwbHVzIGEgZmV3IEtCIG9mIEpTT05ML01hcmtkb3duLCB0aGUgbG9zcyB2cy4gcmVhbFxuLy8gREVGTEFURSBpcyBzaW5nbGUtZGlnaXQgcGVyY2VudC5cbi8vXG4vLyBGcmFtZSBsYXlvdXQgKHBlciBSRkMgODg3OCArIFpzdGFuZGFyZCBmb3JtYXQgc3BlYyk6XG4vLyAgIG1hZ2ljX251bWJlciAgICAgICA0IGJ5dGVzICAweDI4IDB4QjUgMHgyRiAweEZEIChMRTogMHhGRDJGQjUyOClcbi8vICAgRkhEICAgICAgICAgICAgICAgIDEgYnl0ZSAgIEZDU19zaXplPTIgKDQtYnl0ZSBGQ1MpLCBTaW5nbGVfU2VnbWVudD0xXG4vLyAgIEZDUyAgICAgICAgICAgICAgICA0IGJ5dGVzICB1bmNvbXByZXNzZWQgcGF5bG9hZCBzaXplICh1MzIgTEUpXG4vLyAgIGJsb2NrcyAgICAgICAgICAgICBOIGJsb2NrcyBlYWNoOiAzLWJ5dGUgaGVhZGVyICsgcGF5bG9hZFxuLy9cbi8vIEJsb2NrIGhlYWRlciAoMyBieXRlcyBMRSk6XG4vLyAgIGJpdCAwICAgICAgIExhc3RfQmxvY2sgZmxhZ1xuLy8gICBiaXRzIDEuLjIgICBCbG9ja19UeXBlICgwMCA9IFJhdywgMDEgPSBSTEUsIDEwID0gQ29tcHJlc3NlZCwgMTEgPSBSZXNlcnZlZClcbi8vICAgYml0cyAzLi4yMyAgQmxvY2tfU2l6ZSAobWF4IDEyOCBLaUIgZm9yIHJhdyAvIFJMRSlcbi8vXG4vLyBXZSBjaHVuayBpbnRvIDEyOCBLaUIgcmF3IGJsb2NrcyB0byByZXNwZWN0IHRoZSBwZXItYmxvY2sgc2l6ZSBsaW1pdC5cblxuY29uc3QgWlNURF9SQVdfQkxPQ0tfTUFYID0gMTI4ICogMTAyNDtcblxuZXhwb3J0IGNvbnN0IHdyYXBac3RkID0gKGRhdGE6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgPCBkYXRhLmxlbmd0aCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGRhdGEubGVuZ3RoIC0gcG9zO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IE1hdGgubWluKHJlbWFpbmluZywgWlNURF9SQVdfQkxPQ0tfTUFYKTtcbiAgICBjb25zdCBpc0xhc3QgPSBwb3MgKyBibG9ja1NpemUgPj0gZGF0YS5sZW5ndGggPyAxIDogMDtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBpc0xhc3QgfCAoMCA8PCAxKSB8IChibG9ja1NpemUgPDwgMyk7IC8vIHR5cGU9cmF3PTBcbiAgICBjb25zdCBibG9ja0hlYWRlciA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIGhlYWRlckludCAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiA4KSAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiAxNikgJiAweGZmLFxuICAgIF0pO1xuICAgIGJsb2Nrcy5wdXNoKGJsb2NrSGVhZGVyKTtcbiAgICBpZiAoYmxvY2tTaXplID4gMCkgYmxvY2tzLnB1c2goZGF0YS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSkpO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSBicmVhaztcbiAgfVxuICBjb25zdCBmY3MgPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgZmhkID0gMGIxMDEwXzAwMDA7IC8vIEZDU19zaXplPTEwICg0IGJ5dGVzKSB8IFNpbmdsZV9TZWdtZW50PTFcbiAgY29uc3QgaGVhZCA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAweDI4LCAweGI1LCAweDJmLCAweGZkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgZmhkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGSERcbiAgICBmY3MgJiAweGZmLCAoZmNzID4+PiA4KSAmIDB4ZmYsIChmY3MgPj4+IDE2KSAmIDB4ZmYsIChmY3MgPj4+IDI0KSAmIDB4ZmYsXG4gIF0pO1xuICBsZXQgdG90YWwgPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZiA9IDA7XG4gIG91dC5zZXQoaGVhZCwgb2ZmKTsgb2ZmICs9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2ZmKTsgb2ZmICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb21wYW5pb24gZGVjb2RlciBmb3Igb3VyIG93biB3cml0ZXIg4oCUIHVzZWQgYnkgdGVzdHMuIEFjY2VwdHMgYW55IHpzdGRcbi8vIGZyYW1lIHdyaXR0ZW4gYnkgYHdyYXBac3RkYCAoc2luZ2xlIFJhd19CbG9jayBzdHJlYW0sIDQtYnl0ZSBGQ1MsXG4vLyBzaW5nbGUtc2VnbWVudCwgbm8gY2hlY2tzdW0sIG5vIGRpY3QpLiBUaHJvd3Mgb24gYW55dGhpbmcgZWxzZSBzbyB0ZXN0c1xuLy8gZmFpbCBsb3VkbHkgcmF0aGVyIHRoYW4gc2lsZW50bHkgbWlzLXBhcnNlLlxuZXhwb3J0IGNvbnN0IHVud3JhcFpzdGQgPSAoZnJhbWU6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgaWYgKGZyYW1lLmxlbmd0aCA8IDkpIHRocm93IG5ldyBFcnJvcignenN0ZDogZnJhbWUgdG9vIHNob3J0Jyk7XG4gIGlmIChmcmFtZVswXSAhPT0gMHgyOCB8fCBmcmFtZVsxXSAhPT0gMHhiNSB8fCBmcmFtZVsyXSAhPT0gMHgyZiB8fCBmcmFtZVszXSAhPT0gMHhmZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignenN0ZDogYmFkIG1hZ2ljIG51bWJlcicpO1xuICB9XG4gIGNvbnN0IGZoZCA9IGZyYW1lWzRdITtcbiAgY29uc3QgZmNzU2l6ZUZsYWcgPSAoZmhkID4+PiA2KSAmIDBiMTE7XG4gIGNvbnN0IHNpbmdsZVNlZ21lbnQgPSAoKGZoZCA+Pj4gNSkgJiAxKSA9PT0gMTtcbiAgY29uc3QgY2hlY2tzdW0gPSAoKGZoZCA+Pj4gMikgJiAxKSA9PT0gMTtcbiAgY29uc3QgZGljdElkID0gZmhkICYgMGIxMTtcbiAgaWYgKCFzaW5nbGVTZWdtZW50KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IG9ubHkgU2luZ2xlX1NlZ21lbnQgZnJhbWVzIHN1cHBvcnRlZCcpO1xuICBpZiAoY2hlY2tzdW0pIHRocm93IG5ldyBFcnJvcignenN0ZDogY29udGVudCBjaGVja3N1bSBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmIChkaWN0SWQpIHRocm93IG5ldyBFcnJvcignenN0ZDogZGljdGlvbmFyaWVzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgbGV0IHBvcyA9IDU7XG4gIGxldCBmY3MgPSAwO1xuICBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDApIHsgZmNzID0gZnJhbWVbcG9zXSE7IHBvcyArPSAxOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjAxKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KTsgZmNzICs9IDI1NjsgcG9zICs9IDI7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMTApIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNikgfCAoZnJhbWVbcG9zICsgM10hICogMHgxMDAwMDAwKTsgcG9zICs9IDQ7IH1cbiAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IDgtYnl0ZSBGQ1MgdW5zdXBwb3J0ZWQnKTtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoZmNzKTtcbiAgbGV0IG91dFBvcyA9IDA7XG4gIGZvciAoOzspIHtcbiAgICBpZiAocG9zICsgMyA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgaGVhZGVyJyk7XG4gICAgY29uc3QgaGVhZGVySW50ID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNik7XG4gICAgcG9zICs9IDM7XG4gICAgY29uc3QgaXNMYXN0ID0gKGhlYWRlckludCAmIDEpID09PSAxO1xuICAgIGNvbnN0IGJsb2NrVHlwZSA9IChoZWFkZXJJbnQgPj4+IDEpICYgMGIxMTtcbiAgICBjb25zdCBibG9ja1NpemUgPSAoaGVhZGVySW50ID4+PiAzKSAmIDB4MWZfZmZfZmY7XG4gICAgaWYgKGJsb2NrVHlwZSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBvbmx5IFJhd19CbG9jayAoMCkgc3VwcG9ydGVkLCBnb3QgJHtibG9ja1R5cGV9YCk7XG4gICAgaWYgKHBvcyArIGJsb2NrU2l6ZSA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgcGF5bG9hZCcpO1xuICAgIG91dC5zZXQoZnJhbWUuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpLCBvdXRQb3MpO1xuICAgIG91dFBvcyArPSBibG9ja1NpemU7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoaXNMYXN0KSBicmVhaztcbiAgfVxuICBpZiAob3V0UG9zICE9PSBmY3MpIHRocm93IG5ldyBFcnJvcihgenN0ZDogRkNTIG1pc21hdGNoIChnb3QgJHtvdXRQb3N9LCBleHBlY3RlZCAke2Zjc30pYCk7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgVGFyIGxpc3RpbmcgZGVjb2RlciAodGVzdC1vbmx5KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdhbGtzIGEgdGFyIGJ5dGUgYnVmZmVyLCByZXR1cm5pbmcge25hbWUsIGRhdGF9IGZvciBlYWNoIGVudHJ5LiBTdG9wcyBhdFxuLy8gdGhlIHRyYWlsZXIgKHR3byB6ZXJvIGJsb2NrcykuIE9ubHkgcmVhZHMgdGhlIGZpZWxkcyBQaW5jaEdyYWIgd3JpdGVzLlxuXG5leHBvcnQgdHlwZSBQYXJzZWRUYXJFbnRyeSA9IHtuYW1lOiBzdHJpbmc7IGRhdGE6IFVpbnQ4QXJyYXk7IHNpemU6IG51bWJlcn07XG5cbmNvbnN0IGRlYyA9IG5ldyBUZXh0RGVjb2RlcigpO1xuXG5jb25zdCByZWFkTnVsbFN0ciA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGxldCBlbmQgPSBvZmZzZXQgKyBsZW5ndGg7XG4gIGZvciAobGV0IGkgPSBvZmZzZXQ7IGkgPCBvZmZzZXQgKyBsZW5ndGg7IGkrKykge1xuICAgIGlmIChidWZbaV0gPT09IDApIHsgZW5kID0gaTsgYnJlYWs7IH1cbiAgfVxuICByZXR1cm4gZGVjLmRlY29kZShidWYuc3ViYXJyYXkob2Zmc2V0LCBlbmQpKTtcbn07XG5cbmNvbnN0IHJlYWRPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gIGNvbnN0IHMgPSByZWFkTnVsbFN0cihidWYsIG9mZnNldCwgbGVuZ3RoKS50cmltKCk7XG4gIHJldHVybiBzID8gcGFyc2VJbnQocywgOCkgOiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGFyID0gKGJ1ZjogVWludDhBcnJheSk6IFBhcnNlZFRhckVudHJ5W10gPT4ge1xuICBjb25zdCBlbnRyaWVzOiBQYXJzZWRUYXJFbnRyeVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zICsgNTEyIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyA1MTIpO1xuICAgIGxldCBhbGxaZXJvID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7IGlmIChoZWFkZXJbaV0gIT09IDApIHsgYWxsWmVybyA9IGZhbHNlOyBicmVhazsgfSB9XG4gICAgaWYgKGFsbFplcm8pIGJyZWFrOyAvLyB0cmFpbGVyXG4gICAgY29uc3QgbmFtZSA9IHJlYWROdWxsU3RyKGhlYWRlciwgMCwgMTAwKTtcbiAgICBjb25zdCBzaXplID0gcmVhZE9jdGFsKGhlYWRlciwgMTI0LCAxMik7XG4gICAgcG9zICs9IDUxMjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZSwgc2l6ZSwgZGF0YTogYnVmLnN1YmFycmF5KHBvcywgcG9zICsgc2l6ZSl9KTtcbiAgICAgIHBvcyArPSBzaXplO1xuICAgICAgY29uc3QgcGFkID0gKDUxMiAtIChzaXplICUgNTEyKSkgJSA1MTI7XG4gICAgICBwb3MgKz0gcGFkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZW50cmllcztcbn07XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIFRlbGxzIHRoZSBzaWRlcGFuZWwgd2hpY2ggdGVtcGxhdGUgcmVzb3VyY2VzIGV4aXN0IGluIHRoaXMgYnVpbGQuXG4vLyBBY3R1YWwgY29udGVudCBsaXZlcyBhcyAubWQgZmlsZXMgdW5kZXIgZXh0ZW5zaW9uL3RlbXBsYXRlcy8sIGxvYWRlZFxuLy8gbGF6aWx5IHZpYSBjaHJvbWUucnVudGltZS5nZXRVUkwg4oCUIHNlZSBsb2FkVGVtcGxhdGUoKSBpbiBzaWRlcGFuZWwudHMuXG5leHBvcnQgY29uc3QgVEVNUExBVEVTX1BSRVNFTlQgPSB7XCJkZXNpZ25UZW1wbGF0ZVwiOnRydWUsXCJza2lsbFRlbXBsYXRlXCI6dHJ1ZSxcImxvY2FsRGVzaWduXCI6dHJ1ZSxcImxvY2FsU2tpbGxcIjp0cnVlfSBhcyBjb25zdDtcbiIsCiAgICAiLy8gUGluY2hHcmFiIHNpZGUtcGFuZWwgVUkuIFJlY2VpdmVzIGNhcHR1cmVzICsgaG92ZXJzIGZyb20gdGhlIGNvbnRlbnRcbi8vIHNjcmlwdDsgcmVuZGVycyB0aGUgY2hhdC1idWJibGUgdGltZWxpbmUsIGV4cG9ydHMsIHZhbGlkYXRlcywgZXRjLlxuLy9cbi8vIERlY29tcG9zZWQgaW50byBzbWFsbCBmaWxlcyBmb3IgY2xhcml0eTpcbi8vICAg4oCiIHR5cGVzLnRzICAgICAg4oCUIHNoYXJlZCB0eXBlcywgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgbHVjaWRlLnRzICAgICDigJQgaWNvbiByZWdpc3RyeVxuLy8gICDigKIgdGhpcyBmaWxlICAgICDigJQgd2lyZS11cCAvIHJlbmRlcmluZyAvIGV4cG9ydCBidWlsZGVyc1xuLy9cbi8vIExvYWRlZCBhcyB0aGUgc2lkZSBwYW5lbCBwYWdlOiBjaHJvbWUuc2lkZVBhbmVsIGRlZmF1bHRfcGF0aC5cblxuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCwgQ3NUb1BhbmVsLCBFbnRyeSwgRXhwb3J0RGlhZ25vc3RpYywgRXhwb3J0TWFuaWZlc3QsIEZlZWRiYWNrTWVzc2FnZSwgUGFnZU1lc3NhZ2UsXG4gIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5cbigoKSA9PiB7XG4gIGNvbnN0IExPRyA9ICdbUGluY2hHcmFiL3NwXSc7XG4gIGNvbnN0IFBSRUZTX1NUT1JBR0VfTkFNRSA9ICdwaW5jaGdyYWIucHJlZnMudjInO1xuICBjb25zdCBXT1JLU1BBQ0VTX0tFWSA9ICdwaW5jaGdyYWIud29ya3NwYWNlcy52MSc7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuXG4gIC8vIOKUgOKUgOKUgCBUZW1wbGF0ZSByZXNvdXJjZSBsb2FkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEVhcmxpZXIgdGhlIHRlbXBsYXRlcyB3ZXJlIGJha2VkIGFzIHN0cmluZyBjb25zdGFudHMgaW50byB0aGlzIElJRkVcbiAgLy8gKH4zNjBLQiBhY3Jvc3MgREVTSUdOICsgU0tJTEwpLiBUaGF0IGJsb2F0ZWQgdGhlIHNpZGVwYW5lbCBidW5kbGUgdG9cbiAgLy8gfjEuOTVNQiBhbmQgc2xvd2VkIGZpcnN0LW9wZW4gcGFyc2UgdGltZSBub3RpY2VhYmx5LiBUaGV5IG5vdyBzaGlwIGFzXG4gIC8vIHNlcGFyYXRlIGAubWRgIGZpbGVzIHVuZGVyIGBleHRlbnNpb24vdGVtcGxhdGVzL2AgYW5kIGxvYWQgb24gZGVtYW5kXG4gIC8vIHZpYSBmZXRjaCDigJQgd2hlbiB0aGUgdXNlciBvcGVucyB0aGUgZWRpdG9yIG1vZGFsLCBvciB3aGVuIHRoZSBleHBvcnRcbiAgLy8gcGlwZWxpbmUgbmVlZHMgdG8gYnVuZGxlIGEgZmFsbGJhY2suXG4gIC8vXG4gIC8vIENhY2hlIHJlc3VsdHMgaW4tcHJvY2VzcyBzbyByZXBlYXQgcmVhZHMgKG1vZGFsIG9wZW4g4oaSIGNsb3NlIOKGkiByZW9wZW4sXG4gIC8vIG9yIHNlcXVlbnRpYWwgZXhwb3J0cykgZG9uJ3QgcmUtZmV0Y2guXG4gIGNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBURU1QTEFURV9GSUxFUyA9IHtcbiAgICBkZXNpZ25UZW1wbGF0ZTogJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsXG4gICAgc2tpbGxUZW1wbGF0ZTogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsXG4gICAgbG9jYWxEZXNpZ246ICdsb2NhbC5ERVNJR04ubWQnLFxuICAgIGxvY2FsU2tpbGw6ICdsb2NhbC5TS0lMTC5tZCcsXG4gIH0gYXMgY29uc3Q7XG4gIHR5cGUgVGVtcGxhdGVLZXkgPSBrZXlvZiB0eXBlb2YgVEVNUExBVEVfRklMRVM7XG4gIGNvbnN0IHRlbXBsYXRlVXJsID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gSW5zaWRlIHRoZSBleHRlbnNpb24sIHRoZSBzaWRlcGFuZWwgcnVucyBmcm9tXG4gICAgLy8gY2hyb21lLWV4dGVuc2lvbjovLzxpZD4vc2lkZXBhbmVsLmh0bWwsIHNvIHJlc291cmNlcyByZXNvbHZlIHZpYVxuICAgIC8vIGNocm9tZS5ydW50aW1lLmdldFVSTC4gVGhlIFBsYXl3cmlnaHQgc3RhdGljLXNlcnZlciB0ZXN0cyBzZXJ2ZVxuICAgIC8vIGAvdGVtcGxhdGVzLzxmaWxlPmAgZnJvbSB0aGUgZXh0ZW5zaW9uIHJvb3QgZGlyZWN0bHksIHNvIGFcbiAgICAvLyByZWxhdGl2ZSBVUkwgd29ya3MgdGhlcmUgYXMgYSBmYWxsYmFjay5cbiAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCkge1xuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChgdGVtcGxhdGVzLyR7ZmlsZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZXMvJHtmaWxlfWA7XG4gIH07XG4gIGNvbnN0IGxvYWRUZW1wbGF0ZSA9IGFzeW5jIChrZXk6IFRlbXBsYXRlS2V5KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAoIVRFTVBMQVRFU19QUkVTRU5UW2tleV0pIHJldHVybiAnJztcbiAgICBjb25zdCBmaWxlID0gVEVNUExBVEVfRklMRVNba2V5XTtcbiAgICBjb25zdCBjYWNoZWQgPSB0ZW1wbGF0ZUNhY2hlLmdldChmaWxlKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRlbXBsYXRlVXJsKGZpbGUpKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgdGVtcGxhdGUgZmV0Y2ggZmFpbGVkOiAke2ZpbGV9YCwgZXJyKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG4gIC8vIEVmZmVjdGl2ZSBjb250ZW50IHVzZWQgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSBhbmQgdGhlIG1vZGFsLiBXaGVuIHRoZVxuICAvLyB1c2VyIGhhcyBjdXN0b21pemVkIHZpYSB0aGUgdGV4dGFyZWEvdXBsb2FkLCB0aGF0IHdpbnM7IG90aGVyd2lzZSB3ZVxuICAvLyBmYWxsIGJhY2sgdG8gbG9jYWwuKiAodGhlIGRldmVsb3BlcidzIHByZS1iYWtlZCBvdmVycmlkZSkgdGhlbiB0b1xuICAvLyB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgY29uc3QgcmVzb2x2ZURlc2lnbkNvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuZGVzaWduTWQgJiYgcHJlZnMuZGVzaWduTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuZGVzaWduTWQ7XG4gICAgcmV0dXJuIChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsRGVzaWduJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJykpO1xuICB9O1xuICBjb25zdCByZXNvbHZlU2tpbGxDb250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLnNraWxsTWQgJiYgcHJlZnMuc2tpbGxNZC50cmltKCkpIHJldHVybiBwcmVmcy5za2lsbE1kO1xuICAgIHJldHVybiAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbFNraWxsJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKSk7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDihpIgcHJlZnMue2Rlc2lnbk1kfHNraWxsTWR9IGlzXG4gIC8vIGVtcHR5IGFuZCB3ZSdyZSBmYWxsaW5nIGJhY2sgdG8gYSBidW5kbGVkIHRlbXBsYXRlL2xvY2FsIHJlc291cmNlLlxuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24gPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuZGVzaWduTWQgfHwgIXByZWZzLmRlc2lnbk1kLnRyaW0oKTtcbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlU2tpbGwgPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuc2tpbGxNZCB8fCAhcHJlZnMuc2tpbGxNZC50cmltKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0b3JhZ2UgYWRhcHRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgU3RvcmUgPSB7XG4gICAgYXN5bmMgZ2V0PFQ+KGtleTogc3RyaW5nLCBmYWxsYmFjazogVCk6IFByb21pc2U8VD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7IHJldHVybiAob1trZXldIGFzIFQpID8/IGZhbGxiYWNrOyB9XG4gICAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBjb25zdCByID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTsgcmV0dXJuIHIgPT09IG51bGwgPyBmYWxsYmFjayA6IChKU09OLnBhcnNlKHIpIGFzIFQpOyB9XG4gICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgIH0sXG4gICAgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1trZXldOiB2YWx1ZX0pOyByZXR1cm47IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgfVxuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LFxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBET00gcmVmcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgJCA9IDxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50PihzOiBzdHJpbmcpOiBUID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocykgYXMgVDtcbiAgY29uc3QgbGlzdCA9ICQoJ1tkYXRhLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBvc2VyID0gJDxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtY29tcG9zZXJdJyk7XG4gIGNvbnN0IHN0YXR1cyA9ICQoJ1tkYXRhLXN0YXR1c10nKTtcbiAgY29uc3Qgc2VhcmNoID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtc2VhcmNoXScpO1xuICAvLyBVcGRhdGUgdGhlIG92ZXJsYWlkIGtiZCBwaWxsIHRvIHVzZSB0aGUgcmlnaHQgbW9kaWZpZXIgcGVyIHBsYXRmb3JtLlxuICBjb25zdCBpc01hYyA9IC9NYWN8aVBob25lfGlQYWQvaS50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSB8fCBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnKTtcbiAgaWYgKCFpc01hYykge1xuICAgIGNvbnN0IGtiZEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNlYXJjaC1rYmRdIGtiZCcpO1xuICAgIGlmIChrYmRFbCkga2JkRWwudGV4dENvbnRlbnQgPSAnQ3RybCtLJztcbiAgfVxuICBjb25zdCBpbXBvcnRGaWxlID0gJDxIVE1MSW5wdXRFbGVtZW50PignI2ltcG9ydC1maWxlJyk7XG4gIGNvbnN0IHN0YXRzRWwgPSAkKCdbZGF0YS1zdGF0c10nKTtcbiAgY29uc3Qgc3RhcnNFbCA9ICQoJ1tkYXRhLXN0YXJzXScpO1xuICBjb25zdCB0b29sdGlwRWwgPSAkKCdbZGF0YS10b29sdGlwXScpO1xuICBjb25zdCBkcmlsbGRvd25FbCA9ICQoJ1tkYXRhLWRyaWxsZG93bl0nKTtcbiAgY29uc3QgZHJhd2VyID0gJCgnW2RhdGEtZHJhd2VyXScpO1xuICBjb25zdCBwYWxldHRlID0gJCgnW2RhdGEtcGFsZXR0ZV0nKTtcbiAgY29uc3QgcGFsZXR0ZUlucHV0ID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcGFsZXR0ZS1pbnB1dF0nKTtcbiAgY29uc3QgcGFsZXR0ZUxpc3QgPSAkKCdbZGF0YS1wYWxldHRlLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBXb3JkcyA9ICQoJ1tkYXRhLWNvbXAtd29yZHNdJyk7XG4gIGNvbnN0IGNvbXBUb2tlbnMgPSAkKCdbZGF0YS1jb21wLXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFRva2VucyA9ICQoJ1tkYXRhLXN0YXQtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0V29yZHMgPSAkKCdbZGF0YS1zdGF0LXdvcmRzXScpO1xuICBjb25zdCB3c1NlbGVjdCA9ICQ8SFRNTFNlbGVjdEVsZW1lbnQ+KCdbZGF0YS13b3Jrc3BhY2VdJyk7XG4gIGNvbnN0IHdzTGlzdCA9ICQoJ1tkYXRhLXdzLWxpc3RdJyk7XG4gIGNvbnN0IHdzTmFtZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXdzLW5hbWVdJyk7XG5cbiAgY29uc3QgbW91bnRJY29ucyA9IChyb290OiBQYXJlbnROb2RlID0gZG9jdW1lbnQpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWljb25dJykpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbicpO1xuICAgICAgY29uc3Qgc2l6ZSA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScpID8/IDE2KTtcbiAgICAgIGlmIChuYW1lICYmIFBHX0lDT05TLmhhcyhuYW1lKSkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICAgIH1cbiAgfTtcbiAgbW91bnRJY29ucygpO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiBib29sZWFuO1xuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IGJvb2xlYW47XG4gICAgaW5jbHVkZVN0eWxlczogYm9vbGVhbjtcbiAgICBtaW5pZnk6IGJvb2xlYW47XG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogYm9vbGVhbjtcbiAgICB1c2VTY3JlZW5zaG90czogYm9vbGVhbjtcbiAgICBzcGFjaW5nT3ZlcmxheTogYm9vbGVhbjtcbiAgICBob3ZlclNuYXA6IGJvb2xlYW47XG4gICAgYXV0b1NjcmVlbnNob3Q6IGJvb2xlYW47XG4gICAgLy8gQ29tbWEtc2VwYXJhdGVkIGhvc3QgcGF0dGVybnMgKHN1YnN0cmluZyBtYXRjaCkuIEhvc3RzIGluIHRoaXMgbGlzdFxuICAgIC8vIHNraXAgdGhlIGVudGlyZSBzY3JlZW5zaG90IHBpcGVsaW5lIOKAlCB1c2VmdWwgZm9yIHNlbnNpdGl2ZSBwYWdlc1xuICAgIC8vIChiYW5raW5nLCBpbnRlcm5hbCBhZG1pbikgd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IFBOR3MgbGFuZGluZ1xuICAgIC8vIG9uIGRpc2suXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogc3RyaW5nO1xuICAgIC8vIElubGluZSBERVNJR04ubWQgY29udGVudCB0aGUgdXNlciBwYXN0ZWQgb3IgdXBsb2FkZWQgdmlhIHRoZSBzaWRlXG4gICAgLy8gcGFuZWwgc2V0dGluZ3MuIERlZmF1bHRzIHRvIGEgdGVtcGxhdGVkIHBsYWNlaG9sZGVyIHNvIG91dC1vZi10aGUtXG4gICAgLy8gYm94IGV4cG9ydHMgYWx3YXlzIGluY2x1ZGUgYSBERVNJR04ubWQg4oCUIHRoZSBjb25zdW1lciBMTE0gY2FuXG4gICAgLy8gZWl0aGVyIHdvcmsgZnJvbSB0aGUgcGxhY2Vob2xkZXIgKGFuZCBhc2sgZm9yIHRoZSByZWFsIG9uZSkgb3JcbiAgICAvLyBmcm9tIGEgdXNlci1jdXN0b21pemVkIGNvcHkuIFRoZSBzZXR0aW5ncyBVSSBmbGFncyB0aGlzIGJhbm5lci1cbiAgICAvLyBzdHlsZSB3aGVuIHRoZSB2YWx1ZSBzdGlsbCBtYXRjaGVzIHRoZSB0ZW1wbGF0ZSBzbyB0aGUgdXNlclxuICAgIC8vIGtub3dzIHRvIGZpbGwgaXQgaW4uXG4gICAgZGVzaWduTWQ6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIHRoZSByZWNlaXZlciBzaG91bGQgcmVhZCBERVNJR04ubWQgZnJvbS4gRGVmYXVsdHNcbiAgICAvLyB0byBgfi8uYWdlbnRzL0RFU0lHTi5tZGA7IHVzZXIgY2FuIG92ZXJyaWRlIHBlci1tYWNoaW5lLlxuICAgIGRlc2lnblBhdGg6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIG9mIHRoZSBQaW5jaEdyYWIgVUkgc2tpbGwgb24gdGhlIHJlY2VpdmVyJ3NcbiAgICAvLyBmaWxlc3lzdGVtLiBUaGUgc2tpbGwgY29udGVudCBpdHNlbGYgaXMgYnVuZGxlZCBpbmxpbmUgaW50byB0aGVcbiAgICAvLyBhcmNoaXZlIChzZWUgYHNraWxsTWRgKSwgc28gdGhpcyBpcyBhIGhpbnQgZm9yIHJlY2VpdmVycyB0aGF0XG4gICAgLy8gd2FudCB0byBwZXJzaXN0IHRoZSBza2lsbCBhdCBhIGNhbm9uaWNhbCBsb2NhdGlvbi5cbiAgICBza2lsbFBhdGg6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgVUktc2tpbGwgY29udGVudC4gRGVmYXVsdCBpcyB0aGUgYnVuZGxlZCBQaW5jaEdyYWIgdHJpYWdlXG4gICAgLy8gc2tpbGwgdGVtcGxhdGU7IHVzZXIgY2FuIGN1c3RvbWl6ZSB2aWEgc2V0dGluZ3MgcGFzdGUvdXBsb2FkLlxuICAgIC8vIEJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSBhdCBgLi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgLlxuICAgIHNraWxsTWQ6IHN0cmluZztcbiAgICAvLyBXaGVuIHRydWUsIGZpcmUgYSBmcmVzaCBwYWdlIHNjcmVlbnNob3Qgb24gRVZFUlkgY2FwdHVyZSByYXRoZXJcbiAgICAvLyB0aGFuIG9uY2UgcGVyICh3b3Jrc3BhY2UsIHVybCkgdHVwbGUuIFVzZWZ1bCBmb3IgY2FwdHVyaW5nIGFcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3cgd2hlcmUgdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzLlxuICAgIC8vIERlZmF1bHQgZmFsc2Ug4oCUIG1vc3QgdXNlcnMgd2FudCB0aGUgZGVmYXVsdCBmaXJzdC1vbmx5IGJlaGF2aW9yXG4gICAgLy8gc2luY2UgcGFnZSBzY3JlZW5zaG90cyBhcmUgbGFyZ2UgYW5kIHRoZSBmaXJzdCBvbmUgYWxyZWFkeSBnaXZlc1xuICAgIC8vIGEgc2Vzc2lvbi1sZXZlbCByZWZlcmVuY2UuXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBib29sZWFuO1xuICB9O1xuICBjb25zdCBERUZBVUxUX1BSRUZTOiBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiB0cnVlLFxuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IHRydWUsXG4gICAgaW5jbHVkZVN0eWxlczogdHJ1ZSxcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IHRydWUsXG4gICAgdXNlU2NyZWVuc2hvdHM6IHRydWUsXG4gICAgc3BhY2luZ092ZXJsYXk6IGZhbHNlLFxuICAgIGhvdmVyU25hcDogdHJ1ZSxcbiAgICBhdXRvU2NyZWVuc2hvdDogdHJ1ZSxcbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiAnJyxcbiAgICAvLyBkZXNpZ25NZCAvIHNraWxsTWQgZGVmYXVsdCB0byAnJyB3aGljaCB0aGUgcmVzb2x2ZXIgdHJlYXRzIGFzXG4gICAgLy8gXCJmYWxsIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUgYXQgZXhwb3J0IHRpbWVcIi4gU3RvcmluZyB0aGVcbiAgICAvLyBlbXB0eSBzdHJpbmcga2VlcHMgY2hyb21lLnN0b3JhZ2Ugc21hbGwgYW5kIGxldHMgYGlzVXNpbmdUZW1wbGF0ZSpgXG4gICAgLy8gYmUgYSBjaGVhcCBzeW5jaHJvbm91cyBjaGVjay5cbiAgICBkZXNpZ25NZDogJycsXG4gICAgZGVzaWduUGF0aDogJ34vLmFnZW50cy9ERVNJR04ubWQnLFxuICAgIHNraWxsUGF0aDogJ34vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICBza2lsbE1kOiAnJyxcbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGZhbHNlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nfTtcblxuICBsZXQgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gIGxldCBsaXZlVGFiVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxpdmVUYWJQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2VsZWN0b3JWYWxpZGl0eSA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuIHwgJ2RpZmYtcGFnZSc+KCk7XG4gIGNvbnN0IHNlbGVjdG9yRXJyb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgaW5zZXJ0QmVmb3JlOiB7Y3VycmVudDogc3RyaW5nIHwgbnVsbDsgY29tbWVudDogYm9vbGVhbn0gPSB7Y3VycmVudDogbnVsbCwgY29tbWVudDogZmFsc2V9O1xuICBsZXQgc2VhcmNoUXVlcnkgPSAnJztcbiAgbGV0IGxhc3RBY3RpdmVTZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdGlja3lUaW1lciA9IDA7XG4gIGxldCBTVElDS1lfVFRMX01TID0gNV8wMDA7XG4gIGxldCBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgbGV0IHBoYW50b21UYXJnZXQ6IHtzZWxlY3Rvcjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyB0YWc/OiBzdHJpbmc7IHJlY3Q/OiBET01SZWN0fSB8IG51bGwgPSBudWxsO1xuICBsZXQgcGVuZGluZ011bHRpOiBFbnRyeVtdID0gW107XG4gIGNvbnN0IHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIHBlciBzZWxlY3Rvci4gTk9UIHBlcnNpc3RlZCB0b1xuICAvLyBjaHJvbWUuc3RvcmFnZSAoY2FwIHByZXNzdXJlIOKAlCAxMDAgY2FwdHVyZXMgw5cgODAgS0IgZWFjaCA9IDggTUIpLCBzb1xuICAvLyBpdCdzIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBzZXNzaW9uJ3MgYXJjaGl2ZSBleHBvcnQuIENsZWFyZWRcbiAgLy8gb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgY29uc3Qgc2hvdHNGdWxsID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gVHJhY2sgd2hpY2ggKHdvcmtzcGFjZSwgcGFnZS11cmwpIHR1cGxlcyBhbHJlYWR5IGZpcmVkIGEgcGFnZSBzaG90IHNvIHdlXG4gIC8vIGRvbid0IHJlLXNob290IHRoZSBlbnRpcmUgcGFnZSBvbiBldmVyeSBjYXB0dXJlLiBSZXNldCBvbiB3b3Jrc3BhY2VcbiAgLy8gc3dpdGNoIOKAlCBubyBkYXkga2V5LCB0aGUgZGVkdXBlIGlzIHBlci1zZXNzaW9uLlxuICBjb25zdCBwYWdlU2hvdHNGaXJlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBwYWdlU2hvdEtleSA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiBgJHthY3RpdmVXc306JHt1cmx9YDtcbiAgLy8gTGFzdCBzdWNjZXNzZnVsIGV4cG9ydCDigJQgYm90aCB0aGUgd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKHNob3duIHRvIHRoZVxuICAvLyB1c2VyKSBhbmQgdGhlIE9TLWFic29sdXRlIHBhdGggKGNvcGllZCBieSB0aGUgXCJDb3B5IGFzIHBhdGhcIiBidXR0b24pLlxuICAvLyBVcGRhdGVkIG9uIEpTT05ML01EL1pJUC9zY3JlZW5zaG90IHNhdmVzLlxuICBjb25zdCBsYXN0RXhwb3J0OiB7cmVsUGF0aDogc3RyaW5nIHwgbnVsbDsgYWJzUGF0aDogc3RyaW5nIHwgbnVsbDsgY29weVBhdGg6IHN0cmluZyB8IG51bGw7IHRlbXBQYXRoOiBib29sZWFuOyBraW5kOiBzdHJpbmcgfCBudWxsfSA9IHtcbiAgICByZWxQYXRoOiBudWxsLCBhYnNQYXRoOiBudWxsLCBjb3B5UGF0aDogbnVsbCwgdGVtcFBhdGg6IGZhbHNlLCBraW5kOiBudWxsLFxuICB9O1xuICBsZXQgd29ya3NwYWNlczogV29ya3NwYWNlW10gPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgbGV0IGFjdGl2ZVdzID0gJ2RlZmF1bHQnO1xuICAvLyBTZXNzaW9uIHV1aWQg4oCUIGdlbmVyYXRlZCBvbmNlIHBlciB3b3Jrc3BhY2UgYm9vdC4gR29lcyBvbnRvIGV2ZXJ5XG4gIC8vIHBhZ2Ugcm93IGFuZCBldmVyeSBzZWxlY3RvciBlbnRyeSBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzXG4gIC8vIHRvIFwid2hpY2ggc2Vzc2lvbj9cIiB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS4gU3RhYmxlIGFjcm9zcyBhXG4gIC8vIHNpbmdsZSB3b3Jrc3BhY2UgbG9hZDsgcmVzZXRzIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGxldCBzZXNzaW9uSWQ6IHN0cmluZyA9ICcnO1xuICBjb25zdCB3c01zZ0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259Lm1lc3NhZ2VzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0Z1bGxLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90c0Z1bGwudjFgO1xuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBoYXMgYSAxMCBNQiBkZWZhdWx0IHF1b3RhOyB3ZSBidWRnZXQgaGFsZiBvZlxuICAvLyB0aGF0IGZvciBmdWxsLXJlc29sdXRpb24gUE5HcyAodGhlIHJlc3QgaXMgbWVzc2FnZXMsIHByZWZzLCB0aHVtYnMpLlxuICAvLyBXaGVuIHRoZSBidWRnZXQgaXMgcmVhY2hlZCB3ZSBGSUZPLWV2aWN0IHRoZSBvbGRlc3QgZW50cmllcyAoTWFwXG4gIC8vIHByZXNlcnZlcyBpbnNlcnRpb24gb3JkZXIpLiBFc3RpbWF0ZSBkYXRhVVJMIHNpemUgPSBzdHJpbmcgbGVuZ3RoLlxuICBjb25zdCBTSE9UU19GVUxMX0JVREdFVF9CWVRFUyA9IDUgKiAxMDI0ICogMTAyNDtcbiAgY29uc3QgdW5kb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCByZWRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFVORE9fQ0FQID0gMzA7XG4gIGxldCBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gIGxldCBwcmVmczogUHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGU307XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXR1cyBoZWxwZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzdGF0dXNUaW1lciA9IDA7XG4gIGNvbnN0IHNldFN0YXR1cyA9IChtc2c6IHN0cmluZywgb3B0czoge2tpbmQ/OiAnd2FybicgfCAnaW5mbycgfCAnb2snfSA9IHt9KTogdm9pZCA9PiB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gbXNnIHx8ICcnO1xuICAgIGNsZWFyVGltZW91dChzdGF0dXNUaW1lcik7XG4gICAgaWYgKG1zZykge1xuICAgICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gb3B0cy5raW5kID09PSAnd2FybicgPyAndmFyKC0tcmVkKScgOlxuICAgICAgICBvcHRzLmtpbmQgPT09ICdpbmZvJyA/ICd2YXIoLS10ZXh0LTMpJyA6ICd2YXIoLS1ncmVlbiknO1xuICAgICAgc3RhdHVzVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHN0YXR1cy50ZXh0Q29udGVudCA9ICcnOyB9LCAyMjAwKTtcbiAgICB9XG4gIH07XG4gIGxldCB0b2FzdFRpbWVyID0gMDtcbiAgY29uc3Qgc2hvd1RvYXN0ID0gKHRpdGxlOiBzdHJpbmcsIGRldGFpbCA9ICcnLCBraW5kOiAnb2snIHwgJ3dhcm4nID0gJ29rJyk6IHZvaWQgPT4ge1xuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1jb3B5LXRvYXN0XScpO1xuICAgIGlmICghdG9hc3QpIHtcbiAgICAgIHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAnY29weS10b2FzdCc7XG4gICAgICB0b2FzdC5kYXRhc2V0LmNvcHlUb2FzdCA9ICd0cnVlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRvYXN0KTtcbiAgICB9XG4gICAgdG9hc3QuY2xhc3NMaXN0LnRvZ2dsZSgnd2FybicsIGtpbmQgPT09ICd3YXJuJyk7XG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC1pY29uXCI+JHtQR19JQ09OUy5zdmdTdHJpbmcoa2luZCA9PT0gJ3dhcm4nID8gJ2FsZXJ0LWNpcmNsZScgOiAnY2lyY2xlLWNoZWNrJywgMjIpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC10ZXh0XCI+PGI+JHtlc2NhcGVIdG1sKHRpdGxlKX08L2I+JHtkZXRhaWwgPyBgPHNtYWxsPiR7ZXNjYXBlSHRtbChkZXRhaWwpfTwvc21hbGw+YCA6ICcnfTwvc3Bhbj5gO1xuICAgIHRvYXN0LmhpZGRlbiA9IGZhbHNlO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB2b2lkIHRvYXN0Lm9mZnNldFdpZHRoO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcik7XG4gICAgdG9hc3RUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRvYXN0Py5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IGlmICh0b2FzdCkgdG9hc3QuaGlkZGVuID0gdHJ1ZTsgfSwgMTgwKTtcbiAgICB9LCAxNDUwKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0NvcGllZCA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWwgPSAnJyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICdvaycpO1xuICBjb25zdCBzaG93RG93bmxvYWRFcnJvciA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWw6IHN0cmluZyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICd3YXJuJyk7XG5cbiAgLy8g4pSA4pSA4pSAIFV0aWxpdGllcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgbXNnSWQgPSAoKTogc3RyaW5nID0+XG4gICAgY3J5cHRvPy5yYW5kb21VVUlEID8gY3J5cHRvLnJhbmRvbVVVSUQoKSA6XG4gICAgICAnaWRfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpICsgRGF0ZS5ub3coKS50b1N0cmluZygzNik7XG4gIGNvbnN0IGVzY2FwZUh0bWwgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgU3RyaW5nKHMpLnJlcGxhY2VBbGwoJyYnLCAnJmFtcDsnKS5yZXBsYWNlQWxsKCc8JywgJyZsdDsnKS5yZXBsYWNlQWxsKCc+JywgJyZndDsnKTtcbiAgY29uc3QgZXNjYXBlUmUgPSAoczogc3RyaW5nKTogc3RyaW5nID0+IHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbiAgY29uc3QgaGlnaGxpZ2h0TWF0Y2ggPSAodGV4dDogc3RyaW5nLCBxOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCk7XG4gICAgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKGAoJHtlc2NhcGVSZShxKX0pYCwgJ2dpJyksICc8bWFyaz4kMTwvbWFyaz4nKTtcbiAgfTtcbiAgLy8gV2FsayB0ZXh0IG5vZGVzIGluc2lkZSBgcm9vdGAsIHdyYXBwaW5nIGNhc2UtaW5zZW5zaXRpdmUgbWF0Y2hlcyBvZiBgcWBcbiAgLy8gaW4gPG1hcms+IGVsZW1lbnRzLiBEb2Vzbid0IHRvdWNoIGF0dHJpYnV0ZSBzdHJpbmdzIG9yIGlubmVyLXRhZyBIVE1MIHNvXG4gIC8vIGl0J3Mgc2FmZSB0byBydW4gb24gYWxyZWFkeS1oaWdobGlnaHRlZCBKU09OIG91dHB1dC5cbiAgY29uc3Qgd3JhcFNlYXJjaEhpdHNJblRleHROb2RlcyA9IChyb290OiBIVE1MRWxlbWVudCwgcTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm47XG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKGVzY2FwZVJlKHEpLCAnZ2knKTtcbiAgICBjb25zdCB3YWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKHJvb3QsIE5vZGVGaWx0ZXIuU0hPV19URVhUKTtcbiAgICBjb25zdCB0YXJnZXRzOiBUZXh0W10gPSBbXTtcbiAgICBsZXQgbm9kZTogTm9kZSB8IG51bGw7XG4gICAgd2hpbGUgKChub2RlID0gd2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICBpZiAocmUudGVzdChub2RlLm5vZGVWYWx1ZSA/PyAnJykpIHRhcmdldHMucHVzaChub2RlIGFzIFRleHQpO1xuICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9XG4gICAgZm9yIChjb25zdCB0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdC5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgbGV0IGxhc3QgPSAwO1xuICAgICAgZm9yIChjb25zdCBtIG9mIHZhbHVlLm1hdGNoQWxsKHJlKSkge1xuICAgICAgICBjb25zdCBpID0gbS5pbmRleCA/PyAwO1xuICAgICAgICBpZiAoaSA+IGxhc3QpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QsIGkpKTtcbiAgICAgICAgY29uc3QgbWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYXJrJyk7XG4gICAgICAgIG1rLnRleHRDb250ZW50ID0gbVswXTtcbiAgICAgICAgZnJhZy5hcHBlbmQobWspO1xuICAgICAgICBsYXN0ID0gaSArIG1bMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGxhc3QgPCB2YWx1ZS5sZW5ndGgpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QpKTtcbiAgICAgIHQucmVwbGFjZVdpdGgoZnJhZyk7XG4gICAgfVxuICB9O1xuICBjb25zdCB3b3JkQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IChzLm1hdGNoKC9cXFMrL2cpID8/IFtdKS5sZW5ndGg7XG4gIGNvbnN0IHRva2VuQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IE1hdGguY2VpbChzLmxlbmd0aCAvIDQpO1xuICBjb25zdCBwYXRoT2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkucGF0aG5hbWU7IH0gY2F0Y2ggeyByZXR1cm4gdTsgfSB9O1xuICBjb25zdCBob3N0T2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkuaG9zdDsgfSBjYXRjaCB7IHJldHVybiAnJzsgfSB9O1xuICAvLyBGaWxlbmFtZS1zYWZlIGhvc3Qgc2x1ZzogZG90cyDihpIgdW5kZXJzY29yZXMgcGVyIHByb2plY3QgY29udmVudGlvbi5cbiAgLy8gTWlycm9ycyBiYWNrZ3JvdW5kLnRzIGhvc3RTbHVnIGZvciBzeW1tZXRyeSBhY3Jvc3Mgc2NyZWVuc2hvdCArIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMuXG4gIGNvbnN0IGhvc3RTbHVnID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBoID0gaG9zdE9mKHVybCk7XG4gICAgaWYgKCFoKSByZXR1cm4gJ3Vua25vd24nO1xuICAgIHJldHVybiBoLnJlcGxhY2UoL1xcLi9nLCAnXycpLnJlcGxhY2UoL1teXFx3LV0vZywgJ18nKS5zbGljZSgwLCA0MCkgfHwgJ3Vua25vd24nO1xuICB9O1xuICAvLyBQaWNrIHRoZSBtb3N0LWZyZXF1ZW50IGhvc3QgYWNyb3NzIGFsbCBzZWxlY3RvciBjYXB0dXJlcyAoZm9yIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMpLiBXaGVuIHRoZSB3b3Jrc3BhY2Ugc3BhbnMgbXVsdGlwbGUgaG9zdHMsIHJldHVybiAnbXVsdGknLlxuICBjb25zdCBkb21pbmFudEhvc3RTbHVnID0gKCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgY291bnRzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RTbHVnKG0uZW50cnkudXJsKTtcbiAgICAgIGNvdW50cy5zZXQoaCwgKGNvdW50cy5nZXQoaCkgPz8gMCkgKyAxKTtcbiAgICB9XG4gICAgaWYgKCFjb3VudHMuc2l6ZSkgcmV0dXJuICdlbXB0eSc7XG4gICAgbGV0IGJlc3QgPSAnJztcbiAgICBsZXQgYmVzdE4gPSAwO1xuICAgIGZvciAoY29uc3QgW2gsIG5dIG9mIGNvdW50cykge1xuICAgICAgaWYgKG4gPiBiZXN0TikgeyBiZXN0ID0gaDsgYmVzdE4gPSBuOyB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudHMuc2l6ZSA+IDEgPyAnbXVsdGknIDogYmVzdDtcbiAgfTtcbiAgLy8gRGlzdGluY3QgaG9zdHMgcHJlc2VudCBpbiB0aGlzIHdvcmtzcGFjZSAoYWxwaGFiZXRpY2FsLCBjYXBwZWQpLiBVc2VkIGluXG4gIC8vIHRoZSBleHBvcnQgbWFuaWZlc3QncyBgaG9zdHNgIGZpZWxkLlxuICBjb25zdCBkaXN0aW5jdEhvc3RzID0gKCk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBzZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RPZihtLmVudHJ5LnVybCk7XG4gICAgICBpZiAoaCkgc2V0LmFkZChoKTtcbiAgICB9XG4gICAgcmV0dXJuIFsuLi5zZXRdLnNvcnQoKS5zbGljZSgwLCAyMCk7XG4gIH07XG4gIC8vIEJ1aWxkIGEgZmlsZW5hbWUgb2YgdGhlIHNoYXBlIGBwaW5jaGdyYWItPHdvcmtzcGFjZT4tPGhvc3Q+LTxlcG9jaD4uPGV4dD5gLlxuICBjb25zdCBidWlsZEV4cG9ydEZpbGVuYW1lID0gKGV4dDogJ2pzb25sJyB8ICdtZCcgfCAndGFyLnpzdCcpOiBzdHJpbmcgPT5cbiAgICBgcGluY2hncmFiLSR7YWN0aXZlV3N9LSR7ZG9taW5hbnRIb3N0U2x1ZygpfS0ke0RhdGUubm93KCl9LiR7ZXh0fWA7XG4gIC8vIFNraXAtbGlzdCBtYXRjaDogc3Vic3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSBtYXRjaCBhZ2FpbnN0IHRoZSBVUkwnc1xuICAvLyBob3N0LiBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBVUkwgcGFyc2luZyBvbiB0aGUgcGF0dGVybnMgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHdyaXRlIGB3cmFubmdsZS5jb21gIGFuZCBoYXZlIGl0IG1hdGNoIGBhcHAud3Jhbm5nbGUuY29tYCB0b28uXG4gIGNvbnN0IHNob3VsZFNraXBTY3JlZW5zaG90ID0gKHVybDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgbGlzdCA9IChwcmVmcy5za2lwU2NyZWVuc2hvdEhvc3RzID8/ICcnKS5zcGxpdCgnLCcpLm1hcCgocykgPT4gcy50cmltKCkudG9Mb3dlckNhc2UoKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0ID0gaG9zdE9mKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGlzdC5zb21lKChwYXQpID0+IGhvc3QuaW5jbHVkZXMocGF0KSk7XG4gIH07XG5cbiAgLy8gSlNPTiBzeW50YXggaGlnaGxpZ2h0IChwZXIta2V5IGNvbG9yIGlzIGhhc2hlZCBmb3IgdmlzdWFsIHZhcmlldHkpLlxuICBjb25zdCBLRVlfUEFMRVRURSA9IFsnI2ZmN2U3OCcsICcjZmZiNDU0JywgJyNmZmUwNjYnLCAnIzdiZDk3YScsICcjNWZkMWZmJywgJyM5YjhjZmYnLCAnI2ZmODVjMScsICcjZmY1ZjAwJywgJyMxMGI5ODEnLCAnI2Y1OWUwYicsICcjYTc4YmZhJywgJyMzNGQzOTknXTtcbiAgY29uc3QgY29sb3JGb3JLZXkgPSAoazogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgaCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIGsuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gICAgcmV0dXJuIEtFWV9QQUxFVFRFW2ggJSBLRVlfUEFMRVRURS5sZW5ndGhdITtcbiAgfTtcbiAgY29uc3QgSlNPTl9UT0tFTl9SRSA9IC8oXFxzKyl8KFwiKD86W15cIlxcXFxdfFxcXFwuKSpcIil8KHRydWV8ZmFsc2V8bnVsbCl8KC0/XFxkKyg/OlxcLlxcZCspPyg/OltlRV1bKy1dP1xcZCspPyl8KFt7fVtcXF0sOl0pL2c7XG4gIGNvbnN0IGhpZ2hsaWdodEpzb24gPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgb3V0ID0gJyc7XG4gICAgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gICAgSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IEpTT05fVE9LRU5fUkUuZXhlYyh0ZXh0KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IFssIHdzLCBzdHIsIGxpdCwgbnVtLCBwdW5jdF0gPSBtO1xuICAgICAgaWYgKHdzKSB7IG91dCArPSBlc2NhcGVIdG1sKHdzKTsgY29udGludWU7IH1cbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgbGV0IGsgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgICAgd2hpbGUgKGsgPCB0ZXh0Lmxlbmd0aCAmJiAodGV4dFtrXSA9PT0gJyAnIHx8IHRleHRba10gPT09ICdcXHQnIHx8IHRleHRba10gPT09ICdcXG4nKSkgaysrO1xuICAgICAgICBpZiAodGV4dFtrXSA9PT0gJzonKSB7XG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuICAgICAgICAgIHRyeSB7IGtleSA9IEpTT04ucGFyc2Uoc3RyKSBhcyBzdHJpbmc7IH0gY2F0Y2ggeyBrZXkgPSBzdHIuc2xpY2UoMSwgLTEpOyB9XG4gICAgICAgICAgb3V0ICs9IGA8c3BhbiBjbGFzcz1cImtcIiBzdHlsZT1cImNvbG9yOiR7Y29sb3JGb3JLZXkoa2V5KX1cIj4ke2VzY2FwZUh0bWwoc3RyKX08L3NwYW4+YDtcbiAgICAgICAgfSBlbHNlIHsgb3V0ICs9IGA8c3BhbiBjbGFzcz1cInNcIj4ke2VzY2FwZUh0bWwoc3RyKX08L3NwYW4+YDsgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsaXQpIHsgb3V0ICs9IGA8c3BhbiBjbGFzcz1cImJcIj4ke2xpdH08L3NwYW4+YDsgY29udGludWU7IH1cbiAgICAgIGlmIChudW0pIHsgb3V0ICs9IGA8c3BhbiBjbGFzcz1cIm5cIj4ke251bX08L3NwYW4+YDsgY29udGludWU7IH1cbiAgICAgIGlmIChwdW5jdCkgeyBvdXQgKz0gYDxzcGFuIGNsYXNzPVwicFwiPiR7ZXNjYXBlSHRtbChwdW5jdCl9PC9zcGFuPmA7IGNvbnRpbnVlOyB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlcnNpc3RlbmNlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBsb2FkQWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHdvcmtzcGFjZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVtdPihXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcykpIHx8IHdvcmtzcGFjZXM7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmxlbmd0aCkgd29ya3NwYWNlcyA9IFt7bmFtZTogJ2RlZmF1bHQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dO1xuICAgIGFjdGl2ZVdzID0gKGF3YWl0IFN0b3JlLmdldDxzdHJpbmc+KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgJ2RlZmF1bHQnKSkgfHwgJ2RlZmF1bHQnO1xuICAgIGlmICghd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IGFjdGl2ZVdzKSkgYWN0aXZlV3MgPSB3b3Jrc3BhY2VzWzBdIS5uYW1lO1xuICAgIHByZWZzID0gey4uLkRFRkFVTFRfUFJFRlMsIC4uLihhd2FpdCBTdG9yZS5nZXQ8UGFydGlhbDxQcmVmcz4+KFBSRUZTX1NUT1JBR0VfTkFNRSwge30pKX07XG4gICAgLy8gUGF0aCBtaWdyYXRpb246IHByaW9yIHZlcnNpb25zIGRlZmF1bHRlZCBza2lsbFBhdGggdG9cbiAgICAvLyBgfi8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAsIGFuZCBzb21lIHVzZXJzIGhhZCBpdCBzdG9yZWQgYXNcbiAgICAvLyBgfi8uZG90ZmlsZXMvLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLiBUaGUgc2tpbGwgd2FzIHJlbmFtZWRcbiAgICAvLyB0byBgUGluY2hHcmFiYDsgYW55IGB+Ly5kb3RmaWxlcy9gIHByZWZpeCBpcyBzdHJpcHBlZCBmcm9tXG4gICAgLy8gZXhwb3NlZCBkZWZhdWx0cyAoZG90ZmlsZXMgaXMgYSBwZXJzb25hbCBjb25maWcgc291cmNlIOKAlCBleHBvcnRzXG4gICAgLy8gc2hvdWxkbid0IGxlYWsgdGhhdCBwYXRoKS5cbiAgICBjb25zdCB1cGdyYWRlUGF0aCA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQsIGZyZXNoOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgaWYgKCFwKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5pbmNsdWRlcygnLmRvdGZpbGVzJykpIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmVuZHNXaXRoKCdza2lsbHMvdWkvU0tJTEwubWQnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25QYXRoID0gdXBncmFkZVBhdGgocHJlZnMuZGVzaWduUGF0aCwgREVGQVVMVF9QUkVGUy5kZXNpZ25QYXRoKTtcbiAgICBwcmVmcy5za2lsbFBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5za2lsbFBhdGgsIERFRkFVTFRfUFJFRlMuc2tpbGxQYXRoKTtcbiAgICAvLyBDb250ZW50IG1pZ3JhdGlvbjogcHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHRoZSBlbnRpcmUgdGVtcGxhdGVcbiAgICAvLyB0ZXh0IGluc2lkZSBgcHJlZnMuZGVzaWduTWRgIC8gYHByZWZzLnNraWxsTWRgIGFzIGRlZmF1bHRzLiBUaGF0XG4gICAgLy8gYXRlIH4zNjBLQiBvZiBjaHJvbWUuc3RvcmFnZSBxdW90YSBmb3Igbm8gYmVuZWZpdC4gRGV0ZWN0IHdoZW5cbiAgICAvLyB0aGUgc3RvcmVkIHZhbHVlIG1hdGNoZXMgb25lIG9mIHRoZSBidW5kbGVkIHRlbXBsYXRlcyBhbmQgY2xlYXJcbiAgICAvLyBpdCDigJQgdGhlIHJlc29sdmVyIGZhbGxzIGJhY2sgdG8gdGhlIGJ1bmRsZWQgZmlsZSBvbiB0aGUgZmx5LlxuICAgIC8vIEFsc28gc2NydWIgYW55IGxlYWtlZCBgfi8uZG90ZmlsZXMvYCBzdWJzdHJpbmcuXG4gICAgY29uc3Qgc2NydWJEb3RmaWxlcyA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgIHMucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvLmFnZW50cy8nLCAnfi8uYWdlbnRzLycpXG4gICAgICAgLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLycsICd+Ly5hZ2VudHMvJyk7XG4gICAgY29uc3QgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZSA9IGFzeW5jIChjdXJyZW50OiBzdHJpbmcsIGtleXM6IFRlbXBsYXRlS2V5W10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgaWYgKCFjdXJyZW50IHx8ICFjdXJyZW50LnRyaW0oKSkgcmV0dXJuICcnO1xuICAgICAgY29uc3QgdHJpbW1lZCA9IGN1cnJlbnQudHJpbSgpO1xuICAgICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgdHBsID0gKGF3YWl0IGxvYWRUZW1wbGF0ZShrKSkudHJpbSgpO1xuICAgICAgICBpZiAodHBsICYmIHRwbCA9PT0gdHJpbW1lZCkgcmV0dXJuICcnOyAvLyBtYXRjaGVzIGEgYnVuZGxlZCB0ZW1wbGF0ZSDigJQgY29sbGFwc2UgdG8gZW1wdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJyZW50LmluY2x1ZGVzKCcuZG90ZmlsZXMnKSA/IHNjcnViRG90ZmlsZXMoY3VycmVudCkgOiBjdXJyZW50O1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLmRlc2lnbk1kID8/ICcnLCBbJ2xvY2FsRGVzaWduJywgJ2Rlc2lnblRlbXBsYXRlJ10pO1xuICAgIHByZWZzLnNraWxsTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLnNraWxsTWQgPz8gJycsIFsnbG9jYWxTa2lsbCcsICdza2lsbFRlbXBsYXRlJ10pO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UoYWN0aXZlV3MpO1xuICB9O1xuICBjb25zdCBsb2FkV29ya3NwYWNlID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGFjdGl2ZVdzID0gbmFtZTtcbiAgICB2b2lkIFN0b3JlLnNldCgncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsIG5hbWUpO1xuICAgIC8vIE1pbnQgYSBuZXcgc2Vzc2lvbklkIHBlciB3b3Jrc3BhY2UgbG9hZC4gU2FtZSB3b3Jrc3BhY2UgcmUtb3BlbmVkXG4gICAgLy8gPSBuZXcgc2Vzc2lvbjogZGlzdGluY3QgdXVpZCBzbyBhIGNvbnN1bWVyIGNhbiB0ZWxsIHR3byBib290c1xuICAgIC8vIGFwYXJ0IGV2ZW4gd2hlbiB0aGUgY2FwdHVyZXMgbGFuZCBpbiB0aGUgc2FtZSBvbi1kaXNrIGZpbGUuXG4gICAgc2Vzc2lvbklkID0gbXNnSWQoKTtcbiAgICBtZXNzYWdlcyA9IChhd2FpdCBTdG9yZS5nZXQ8UGFuZWxNZXNzYWdlW10+KHdzTXNnS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIG1lc3NhZ2VzID0gW107XG4gICAgLy8gTWlncmF0ZSBsZWdhY3kgZW50cmllcyAobm8gdWlkLCBzdGF0ZXMtYXMtcmVjb3JkLCBhdHRycy5mb3JtYXQpIGFuZFxuICAgIC8vIHBlcnNpc3QgaWYgYW55dGhpbmcgY2hhbmdlZCBzbyB3ZSBkb24ndCBwYXkgdGhlIG1pZ3JhdGlvbiBjb3N0IGFnYWluXG4gICAgLy8gbmV4dCBsb2FkLlxuICAgIGlmIChtaWdyYXRlTG9hZGVkTWVzc2FnZXMoKSkgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkobmFtZSksIG1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBhZ2VTaG90c0ZpcmVkLmNsZWFyKCk7XG4gICAgY29uc3Qgc3RvcmVkID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZCkpIHNob3RzLnNldChrLCB2KTtcbiAgICAvLyBSZXN0b3JlIHRoZSBmdWxsLXJlc29sdXRpb24gUE5HIGNhY2hlIHNvIGEgd29ya3NwYWNlIGFyY2hpdmVcbiAgICAvLyBleHBvcnRlZCBBRlRFUiBhIHBhbmVsIHJlbG9hZCBzdGlsbCBidW5kbGVzIHNjcmVlbnNob3RzIGZyb21cbiAgICAvLyBlYXJsaWVyIGNhcHR1cmVzLiBGSUZPIG9yZGVyIGlzIHByZXNlcnZlZCBieSBPYmplY3Qga2V5IG9yZGVyLlxuICAgIGNvbnN0IHN0b3JlZEZ1bGwgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNGdWxsS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZEZ1bGwpKSBzaG90c0Z1bGwuc2V0KGssIHYpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBzZWxlY3RvckVycm9ycy5jbGVhcigpO1xuICAgIHVuZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBudWxsO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3QgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkoYWN0aXZlV3MpLCBtZXNzYWdlcyk7XG4gICAgLy8gUHVzaCBjYXB0dXJlZC1zZWxlY3RvciBzZXQgc28gdGhlIGNvbnRlbnQgc2NyaXB0J3MgaG92ZXIgd2Fsa2VyIGNhblxuICAgIC8vIHJlc29sdmUgZGVzY2VuZGFudHMg4oaSIGNhcHR1cmVkIGFuY2VzdG9yLlxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBzZW5kVG9DUyh7a2luZDogJ3NldC1jYXB0dXJlZCcsIHNlbGVjdG9yc30pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0UHJlZnMgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQoUFJFRlNfU1RPUkFHRV9OQU1FLCBwcmVmcyk7XG4gICAgLy8gUHVzaCB0aGUgc3Vic2V0IG9mIHByZWZzIHRoZSBjb250ZW50IHNjcmlwdCBjYXJlcyBhYm91dCBzbyBpdHNcbiAgICAvLyBvdmVybGF5IChzcGFjaW5nIHZpc3VhbGl6ZXIsIGhvdmVyIHNuYXAsIGV0Yy4pIHJlZmxlY3RzIHRoZSBsYXRlc3QuXG4gICAgdm9pZCBzZW5kVG9DUyh7XG4gICAgICBraW5kOiAnc2V0LWNzLXByZWZzJyxcbiAgICAgIHNwYWNpbmdPdmVybGF5OiBwcmVmcy5zcGFjaW5nT3ZlcmxheSxcbiAgICAgIGhvdmVyU25hcDogcHJlZnMuaG92ZXJTbmFwLFxuICAgIH0pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHMpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0tleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgcGVyc2lzdGVuY2Ugd2l0aCBGSUZPIGV2aWN0aW9uLiBkYXRhVVJMIHN0cmluZ3NcbiAgLy8gY2FuIHJ1biA1MC01MDAgS0IgZWFjaDsgdGhlIGRlZmF1bHQgcXVvdGEgZ2V0cyBleGhhdXN0ZWQgaW4gdGVucyBvZlxuICAvLyBjYXB0dXJlcyB3aXRob3V0IGEgYnVkZ2V0LiBNYXAgaW5zZXJ0aW9uIG9yZGVyID0gRklGTyBvcmRlciwgc29cbiAgLy8gd2UgZXZpY3QgZnJvbSB0aGUgZnJvbnQgdW50aWwgdW5kZXIgYnVkZ2V0IGJlZm9yZSBwZXJzaXN0aW5nLlxuICBjb25zdCBldmljdFNob3RzRnVsbFRvQnVkZ2V0ID0gKCk6IG51bWJlciA9PiB7XG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2hvdHNGdWxsLnZhbHVlcygpKSB0b3RhbCArPSB2Lmxlbmd0aDtcbiAgICBsZXQgZXZpY3RlZCA9IDA7XG4gICAgd2hpbGUgKHRvdGFsID4gU0hPVFNfRlVMTF9CVURHRVRfQllURVMpIHtcbiAgICAgIGNvbnN0IGZpcnN0S2V5ID0gc2hvdHNGdWxsLmtleXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICBpZiAoZmlyc3RLZXkgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBjb25zdCByZW1vdmVkID0gc2hvdHNGdWxsLmdldChmaXJzdEtleSk7XG4gICAgICBpZiAocmVtb3ZlZCA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIHNob3RzRnVsbC5kZWxldGUoZmlyc3RLZXkpO1xuICAgICAgdG90YWwgLT0gcmVtb3ZlZC5sZW5ndGg7XG4gICAgICBldmljdGVkKys7XG4gICAgfVxuICAgIHJldHVybiBldmljdGVkO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHNGdWxsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGV2aWN0ZWQgPSBldmljdFNob3RzRnVsbFRvQnVkZ2V0KCk7XG4gICAgaWYgKGV2aWN0ZWQgPiAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csIGBzaG90c0Z1bGwgRklGTy1ldmljdGVkICR7ZXZpY3RlZH0gb2xkZXN0IGVudHJpZXMgdG8gZml0ICR7U0hPVFNfRlVMTF9CVURHRVRfQllURVMgLyAxMDI0IC8gMTAyNH1NQiBidWRnZXRgKTtcbiAgICB9XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHNGdWxsKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNGdWxsS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFdvcmtzcGFjZXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKTsgfTtcblxuICAvLyDilIDilIDilIAgU25hcHNob3QgLyB1bmRvIC8gcmVkbyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc25hcHNob3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN1c3BlbmRTbmFwc2hvdHMpIHJldHVybjtcbiAgICBpZiAodW5kb1N0YWNrLmxlbmd0aCA+PSBVTkRPX0NBUCkgdW5kb1N0YWNrLnNoaWZ0KCk7XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZXN0b3JlID0gKGpzb246IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSB0cnVlO1xuICAgIHRyeSB7IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShqc29uKSBhcyBQYW5lbE1lc3NhZ2VbXTsgfSBjYXRjaCB7IG1lc3NhZ2VzID0gW107IH1cbiAgICBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICBjb25zdCB1bmRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghdW5kb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gdW5kbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgcmVkb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHVuZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnVW5kb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVkbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXJlZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHJlZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZShyZWRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1JlZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVVuZG9CdXR0b25zID0gKCk6IHZvaWQgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInVuZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCB1bmRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJyZWRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgcmVkb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUNvcHlQYXRoQnV0dG9uID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1hY3Rpb249XCJjb3B5LXBhdGhcIl0nKTtcbiAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgIGNvbnN0IGhhcyA9IEJvb2xlYW4obGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGgpO1xuICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsICFoYXMpO1xuICAgIGJ0bi5kYXRhc2V0LnRpcCA9IGhhc1xuICAgICAgPyBgQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LlxcbiR7bGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGggPz8gJyd9YFxuICAgICAgOiAnQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LiBSdW4gYW4gZXhwb3J0IGZpcnN0Lic7XG4gIH07XG4gIGNvbnN0IG9uQ29weVBhdGggPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoO1xuICAgIGlmICghcGF0aFRvQ29weSkge1xuICAgICAgc2V0U3RhdHVzKCdObyBleHBvcnQgeWV0IOKAlCBydW4gYSBkb3dubG9hZCBmaXJzdCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHBhdGhUb0NvcHkpO1xuICAgICAgLy8gU2hvdyBvbmx5IHRoZSBsZWFmIGZpbGVuYW1lIGluIHRoZSBzdGF0dXMg4oCUIHRoZSBmdWxsIFdpbmRvd3Mtc3R5bGVcbiAgICAgIC8vIGFic29sdXRlIHBhdGggd291bGQgYmUgMTAwKyBjaGFycyBhbmQgd2FzIGRpc3J1cHRpbmcgdGhlIHNpZGViYXJcbiAgICAgIC8vIGxheW91dCBmb3IgdGhlIDItc2Vjb25kIHN0YXR1cyBUVEwuXG4gICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgc2V0U3RhdHVzKGBDb3BpZWQgcGF0aCDCtyAke2xlYWZ9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgcGF0aCcsIGxlYWYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIHdyaXRlIGZhaWxlZDogJyArIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2UgdG8gYWN0aXZlIHRhYiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZFRvQ1MgPSBhc3luYyAocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgbXNnID0gcGcocGF5bG9hZCk7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBpZiAodGFic1swXT8uaWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgbXNnKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IG1zZ30pKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZW5kVG9DU0FuZFdhaXQgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4gbmV3IFByb21pc2U8UiB8IG51bGw+KChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikge1xuICAgICAgY29uc3QgcmVxSWQgPSAncmVxXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTtcbiAgICAgIGNvbnN0IG9uUmVzcCA9IChlOiBFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSAoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsO1xuICAgICAgICBpZiAoZGV0YWlsPy5fX3JlcUlkID09PSByZXFJZCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgICAgIHJlc29sdmUoZGV0YWlsLnJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiB7X19yZXFJZDogcmVxSWQsIC4uLnBnKHBheWxvYWQpfX0pKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTsgcmVzb2x2ZShudWxsKTsgfSwgMTAwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9LCAodGFicykgPT4ge1xuICAgICAgaWYgKCF0YWJzWzBdPy5pZCkgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHBnKHBheWxvYWQpLCAocjogUikgPT4gcmVzb2x2ZShyKSk7XG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBzZW5kVG9CZyA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQmcpOiBQcm9taXNlPFIgfCBudWxsPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHsgcmV0dXJuIChhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShwZyhwYXlsb2FkKSkpIGFzIFI7IH1cbiAgICBjYXRjaCAoZSkgeyByZXR1cm4ge2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBhcyB1bmtub3duIGFzIFI7IH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgUmVjZWl2aW5nIGZyb20gY29udGVudCBzY3JpcHQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIERlZmVuc2l2ZSByaW5nLWJ1ZmZlciBkZWR1cGU6IGV2ZW4gdGhvdWdoIHdlIG5vdyB1c2Ugb25seSBvbmUgY2hhbm5lbCxcbiAgLy8gYW55IG1lc3NhZ2UgdGhhdCBzb21laG93IGFycml2ZXMgdHdpY2Ugd2l0aGluIH4yIHNlY29uZHMgaXMgaWdub3JlZC5cbiAgY29uc3QgcmVjZW50TWlkczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgUkVDRU5UX01JRF9DQVAgPSA2NDtcbiAgY29uc3Qgb25Dc01lc3NhZ2UgPSAobXNnOiBQZ0VudmVsb3BlPENzVG9QYW5lbD4pOiB2b2lkID0+IHtcbiAgICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuO1xuICAgIGlmIChtc2cuX19taWQpIHtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmluY2x1ZGVzKG1zZy5fX21pZCkpIHJldHVybjtcbiAgICAgIHJlY2VudE1pZHMucHVzaChtc2cuX19taWQpO1xuICAgICAgaWYgKHJlY2VudE1pZHMubGVuZ3RoID4gUkVDRU5UX01JRF9DQVApIHJlY2VudE1pZHMuc2hpZnQoKTtcbiAgICB9XG4gICAgc3dpdGNoIChtc2cua2luZCkge1xuICAgICAgY2FzZSAnY2FwdHVyZSc6IG9uQ2FwdHVyZShtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlcic6IG9uSG92ZXIobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXItZW5kJzogb25Ib3ZlckVuZCgpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWFkZCc6IG9uUGVuZGluZ0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWNsZWFyJzogb25QZW5kaW5nQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZmVlZGJhY2stYWRkJzogb25GZWVkYmFja0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwcmVmZXJlbmNlLWNoYW5nZSc6IG9uUHJlZmVyZW5jZUNoYW5nZShtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnfT4pOyByZXR1cm47XG4gICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUHJlZmVyZW5jZUNoYW5nZSA9ICh7cmVhc29uLCBwYWdlfToge3JlYXNvbjogc3RyaW5nOyBwYWdlOiBhbnl9KTogdm9pZCA9PiB7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2U/LnVybCA/PyBsaXZlVGFiVXJsO1xuICAgIGxpdmVUYWJQYXRoID0gbGl2ZVRhYlVybCA/IHBhdGhPZihsaXZlVGFiVXJsKSA6IGxpdmVUYWJQYXRoO1xuICAgIC8vIFBhZ2Ugcm93cyBhcmUgY2FwdHVyZSBoZWFkZXJzLCBub3QgYSB0YWIvcGFnZSB0ZWxlbWV0cnkgZmVlZC4gVGhlIG5leHRcbiAgICAvLyBzZWxlY3RvciBjYXB0dXJlIGZyb20gdGhpcyBwYWdlIHdpbGwgY2FycnkgdGhlIG5ldyB2aWV3cG9ydC9zdGF0ZSBhbmRcbiAgICAvLyBpbnNlcnQgYSBwYWdlIGhlYWRlciBvbmx5IGlmIG5lZWRlZC5cbiAgICBzZXRTdGF0dXMoYCR7cmVhc29ufSBjaGFuZ2VkYCwge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuXG4gIGNvbnN0IG9uRmVlZGJhY2tBZGQgPSAoe3NlbGVjdG9yLCB0ZXh0LCB1cmwsIHBhcmVudFVpZH06IHtzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfSk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAvLyAgIDEuIHBhcmVudFVpZCDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IHN1cHBsaWVkIGEgc3RhYmxlIHVpZCAodGhlXG4gICAgLy8gICAgICBzdHJvbmdlc3QgbWF0Y2g7IHN1cnZpdmVzIHNlbGVjdG9yIGNoYW5nZXMsIHNpYmxpbmdcbiAgICAvLyAgICAgIGNvbGxpc2lvbnMsIG11bHRpcGxlIGNhcHR1cmVzIG9mIHRoZSBzYW1lIGVsZW1lbnQpLlxuICAgIC8vICAgMi4gc2VsZWN0b3IgKyB1cmwg4oCUIGNvbXBvc2l0ZSBrZXk7IHByZXZlbnRzIGNyb3NzLXBhZ2VcbiAgICAvLyAgICAgIGNvbnRhbWluYXRpb24gd2hlbiB0aGUgc2FtZSBzZWxlY3RvciBleGlzdHMgb24gbXVsdGlwbGUgVVJMcy5cbiAgICAvLyAgIDMuIHNlbGVjdG9yICsgbGl2ZVRhYlVybCDigJQgZmFsbGJhY2sgd2hlbiB0aGUgbWVzc2FnZSBkaWRuJ3RcbiAgICAvLyAgICAgIGNhcnJ5IGFuIGV4cGxpY2l0IHVybCAob2xkZXIgY29udGVudC1zY3JpcHQgbWVzc2FnZXMpLlxuICAgIGxldCBpZHggPSAtMTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnVpZCA9PT0gcGFyZW50VWlkKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnN0IHdhbnRVcmwgPSB1cmwgPz8gbGl2ZVRhYlVybCA/PyBudWxsO1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PlxuICAgICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcidcbiAgICAgICAgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3JcbiAgICAgICAgJiYgKCF3YW50VXJsIHx8IG0uZW50cnkudXJsID09PSB3YW50VXJsKSk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnb25GZWVkYmFja0FkZDogbm8gcGFyZW50IGZvdW5kJywge3NlbGVjdG9yLCB1cmwsIHBhcmVudFVpZH0pO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGxvc3QgaXRzIHBhcmVudCDigJQgY2hlY2sgdGhlIGFjdGl2ZSBjYXB0dXJlJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHBhcmVudE1zZyA9IG1lc3NhZ2VzW2lkeF0gYXMgU2VsZWN0b3JNZXNzYWdlO1xuICAgIGxldCBpbnNlcnRBdCA9IGlkeCArIDE7XG4gICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIG5ldyBmZWVkYmFjayByb3cgc28gdGhlIGV4cG9ydCBjYXJyaWVzXG4gICAgLy8gdGhlIEZLIGxpbmsgZXhwbGljaXRseSAobm90IGp1c3QgYnkgY2FwdHVyZS1hZGphY2VuY3kpLlxuICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICBwYXJlbnRVaWQ6IHBhcmVudE1zZy5lbnRyeS51aWQsXG4gICAgfSk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnQ29tbWVudCBhZGRlZCBmcm9tIHBhZ2UnKTtcbiAgICAvLyBFdmVyeSBmZWVkYmFjayBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LiBJZiB0aGUgcGFyZW50XG4gICAgLy8gY2FwdHVyZSBkaWRuJ3QgZ2V0IG9uZSAoYXV0b1NjcmVlbnNob3Qgb2ZmLCBza2lwU2NyZWVuc2hvdEhvc3RzXG4gICAgLy8gaGl0LCBuZXR3b3JrIGdsaXRjaCksIHJlLWZpcmUgbm93LlxuICAgIGlmICghcGFyZW50TXNnLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudE1zZyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUGVuZGluZ0FkZCA9ICh7ZW50cnl9OiB7ZW50cnk6IEVudHJ5fSk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkucHVzaChlbnRyeSk7IHJlbmRlcigpOyB9O1xuICBjb25zdCBvblBlbmRpbmdDbGVhciA9ICgpOiB2b2lkID0+IHsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyB9O1xuXG4gIGNvbnN0IGZpbmREdXBsaWNhdGUgPSAoc2VsZWN0b3I6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT5cbiAgICBtZXNzYWdlcy5maW5kKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT5cbiAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvciAmJiAoIXVybCB8fCBtLmVudHJ5LnVybCA9PT0gdXJsKSk7XG5cbiAgLy8gRmluZCBhbiBleGlzdGluZyBjYXB0dXJlIGZvciB0aGUgYWN0aXZlIHRhYiArIHNlbGVjdG9yLiBDcm9zcy1wYWdlXG4gIC8vIGNvbnRhbWluYXRpb24gcHJldmVudGlvbiAoc2VlIHR5cGVzLnRzIGZlZWRiYWNrLWFkZCBkb2NzdHJpbmcpOlxuICAvLyBhIHNlbGVjdG9yIGFsb25lIGlzIE5PVCBhIHN0YWJsZSBpZGVudGl0eSDigJQgYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gXG4gIC8vIGV4aXN0cyBvbiBldmVyeSBwYWdlOyBgYnV0dG9uYCBpcyBldmVyeXdoZXJlLiBTdHJvbmcgaWRlbnRpdHkgaXNcbiAgLy8gKHNlbGVjdG9yICsgdXJsKS4gUmV0dXJucyB0aGUgbW9zdCByZWNlbnQgbWF0Y2ggc28gcmUtaG92ZXJpbmcgYW5cbiAgLy8gYWxyZWFkeS1jYXB0dXJlZCBlbGVtZW50IHJlc29sdmVzIGNvbnNpc3RlbnRseS5cbiAgY29uc3QgZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZSA9IChzZWxlY3Rvcjogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBjb25zdCB1cmwgPSBsaXZlVGFiVXJsO1xuICAgIC8vIFdhbGsgYmFja3dhcmRzIHNvIHRoZSBtb3N0IHJlY2VudCBtYXRjaGluZyBjYXB0dXJlIHdpbnMgd2hlbiBhXG4gICAgLy8gc2VsZWN0b3IgbGVnaXRpbWF0ZWx5IGhhcyBtdWx0aXBsZSBjYXB0dXJlcyBvbiB0aGUgc2FtZSBwYWdlXG4gICAgLy8gKGUuZy4sIHRoZSB1c2VyIHJlLWNhcHR1cmVkIHRoZSBzYW1lIGVsZW1lbnQgYWZ0ZXIgZWRpdHMpLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSBjb250aW51ZTtcbiAgICAgIGlmICh1cmwgJiYgbS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBjYW5vbmljYWxFbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgdGFnOiBlLnRhZywgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHRleHQ6IGUudGV4dCwgcm9sZTogZS5yb2xlLFxuICAgIGF0dHJzOiBlLmF0dHJzLCBjbGFzc2VzOiBlLmNsYXNzZXMsXG4gICAgcmVjdDogZS5yZWN0LCBvdXRlckhUTUw6IGUub3V0ZXJIVE1MLFxuICAgIHN0eWxlczogZS5zdHlsZXMsIG1hdGNoZWRSdWxlczogZS5tYXRjaGVkUnVsZXMsXG4gIH0pO1xuXG4gIGNvbnN0IG9uQ2FwdHVyZSA9ICh7ZW50cnksIHBhZ2UsIGdyb3VwZWR9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdjYXB0dXJlJ30+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFlbnRyeSB8fCAhcGFnZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2UudXJsO1xuICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKHBhZ2UudXJsKTtcbiAgICBpZiAoZ3JvdXBlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgICAgZ3JvdXAucHVzaChlbnRyeSk7XG4gICAgICAgICAgbS5lbnRyeS5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7IGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgICAgLy8gRmlyZSBhIGdyb3VwIHNob3QgdXNpbmcgdGhlIGhlYWQgKyBtZW1iZXJzLiBUaGUgaGVhZCdzIHNlbGVjdG9yXG4gICAgICAgICAgLy8gaXMgbS5lbnRyeS5zZWxlY3RvcjsgbWVtYmVycycgc2VsZWN0b3JzIGFyZSBpbiB0aGUgZnJlc2hseVxuICAgICAgICAgIC8vIG11dGF0ZWQgZ3JvdXAgYXJyYXkuXG4gICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW20uZW50cnkuc2VsZWN0b3IsIC4uLihtLmVudHJ5Lmdyb3VwID8/IFtdKS5tYXAoKGcpID0+IGcuc2VsZWN0b3IpXTtcbiAgICAgICAgICB2b2lkIGZpcmVHcm91cFNob3QobSwgc2VsZWN0b3JzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRHVwZSBkZXRlY3Rpb24uIENyb3NzLWNvbnRhbWluYXRpb24gZml4OiBhIChzZWxlY3RvciwgdXJsKSBtYXRjaFxuICAgIC8vIGlzIE5FQ0VTU0FSWSBidXQgbm90IFNVRkZJQ0lFTlQg4oCUIHR3byBzaWJsaW5nIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgLy8gc2FtZSB0ZXN0SWQgLyBzYW1lIHJvbGUvYXJpYSBzZWxlY3RvciBsaXZlIG9uIHRoZSBzYW1lIFVSTCBidXRcbiAgICAvLyBhcmUgZGlmZmVyZW50IGNhcHR1cmVzLiBDb21wYXJlIHRoZSBjYW5vbmljYWwtZW50cnkgaGFzaCAod2hpY2hcbiAgICAvLyBpbmNsdWRlcyByZWN0LCB0ZXh0LCBvdXRlckhUTUwsIGV0Yy4pIGJlZm9yZSB0cmVhdGluZyB0aGUgbmV3XG4gICAgLy8gY2FwdHVyZSBhcyBhIHJlZnJlc2ggb2YgdGhlIG9sZCBvbmUuIFdoZW4gdGhlIGhhc2ggZGlmZmVycywgd2VcbiAgICAvLyBrZWVwIEJPVEggY2FwdHVyZXMgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcuXG4gICAgY29uc3QgZHVwZSA9IGZpbmREdXBsaWNhdGUoZW50cnkuc2VsZWN0b3IsIGVudHJ5LnVybCk7XG4gICAgaWYgKGR1cGUpIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IGNhbm9uaWNhbEVudHJ5KGR1cGUuZW50cnkpO1xuICAgICAgY29uc3QgYWZ0ZXIgPSBjYW5vbmljYWxFbnRyeShlbnRyeSk7XG4gICAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBIYXNoZXMgZGlmZmVyLiBUd28gY2FzZXM6XG4gICAgICAvLyAgIChhKSBTYW1lIGVsZW1lbnQgcmUtY2FwdHVyZWQgYWZ0ZXIgY29udGVudCBjaGFuZ2Ug4oCUIHRoZSByZWN0XG4gICAgICAvLyAgICAgICBzdGF5cyBwdXQgKHdpdGhpbiBhIGZldyBweCksIGJ1dCB0ZXh0L291dGVySFRNTCBtb3ZlZC5cbiAgICAgIC8vICAgICAgIFRyZWF0IGFzIGEgcmVmcmVzaC5cbiAgICAgIC8vICAgKGIpIERpZmZlcmVudCBlbGVtZW50IHRoYXQgaGFwcGVucyB0byBzaGFyZSBhIHNlbGVjdG9yIOKAlCB0aGVcbiAgICAgIC8vICAgICAgIHJlY3QgaXMgaW4gYSBkaWZmZXJlbnQgcG9zaXRpb24uIFRyZWF0IGFzIGEgbmV3IGNhcHR1cmUuXG4gICAgICAvLyBXZSBkaXNjcmltaW5hdGUgYnkgcmVjdCBvdmVybGFwOiBpZiBib3RoIHJlY3RzIGV4aXN0IGFuZCB0aGVpclxuICAgICAgLy8gY2VudGVycyBhcmUgd2l0aGluIDhweCBvbiBib3RoIGF4ZXMsIHJlZnJlc2g7IG90aGVyd2lzZSBrZWVwXG4gICAgICAvLyBib3RoLlxuICAgICAgY29uc3QgcjEgPSBkdXBlLmVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCByMiA9IGVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCBzYW1lRWxlbWVudCA9IHIxICYmIHIyXG4gICAgICAgICYmIE1hdGguYWJzKChyMS54ICsgcjEudyAvIDIpIC0gKHIyLnggKyByMi53IC8gMikpIDw9IDhcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnkgKyByMS5oIC8gMikgLSAocjIueSArIHIyLmggLyAyKSkgPD0gODtcbiAgICAgIGlmIChzYW1lRWxlbWVudCkge1xuICAgICAgICBkZWxldGUgZHVwZS5kdXBlUGVuZGluZztcbiAgICAgICAgZHVwZS5lbnRyeSA9IGVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFVwZGF0ZWQgIyR7ZHVwZS5lbnRyeS5ufWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlmZmVyZW50IGVsZW1lbnQgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciDihpIgZmFsbCB0aHJvdWdoIGFuZFxuICAgICAgLy8gZW1pdCBhcyBhIG5ldyBjYXB0dXJlLiBUaGUgYWdlbnQgcmVhZGluZyB0aGUgZXhwb3J0IHNlZXMgYm90aFxuICAgICAgLy8gcm93cyB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIGJ1dCBkaWZmZXJlbnQgdWlkcyArIHJlY3RzLlxuICAgIH1cbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCB0aGUgc2Vzc2lvbiBGSyBzbyB0aGUgY29uc3VtZXIgY2FuIGpvaW4gZW50cmllcyB0byB0aGVpclxuICAgIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLlxuICAgIGlmIChzZXNzaW9uSWQpIGVudHJ5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICBjb25zdCBuZXdNc2c6IFNlbGVjdG9yTWVzc2FnZSA9IHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzLCBlbnRyeX07XG4gICAgLy8gUGFnZSByb3dzIGV4aXN0IG9ubHkgYXMgaGVhZGVycyBmb3IgY2FwdHVyZWQgc2VsZWN0b3JzLiBEbyBub3QgY3JlYXRlXG4gICAgLy8gdGhlbSBmcm9tIHRhYiBhY3RpdmF0aW9uLCB2YWxpZGF0aW9uLCBvciBwcmVmZXJlbmNlIGNoYW5nZXM7IGluc2VydCBvbmVcbiAgICAvLyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGZpcnN0IHNlbGVjdG9yIG9mIGEgbmV3IHBhZ2UgYmxvY2suXG4gICAgbGV0IHByZXZpb3VzUGFnZTogUGFnZU1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gcG9zaXRpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJykgeyBwcmV2aW91c1BhZ2UgPSBtOyBicmVhazsgfVxuICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzUGFnZSB8fCBwcmV2aW91c1BhZ2UudXJsICE9PSBwYWdlLnVybCkge1xuICAgICAgY29uc3QgcGFnZU1zZzogUGFnZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHVybDogcGFnZS51cmwsIHRpdGxlOiBwYWdlLnRpdGxlLCB2aWV3cG9ydDogcGFnZS52aWV3cG9ydCwgdG9rZW5zOiBwYWdlLnRva2VucyxcbiAgICAgICAgdXNlckFnZW50OiBwYWdlLnVzZXJBZ2VudCwgbGFuZzogcGFnZS5sYW5nLFxuICAgICAgICBnaXRDb250ZXh0OiAocGFnZSBhcyBhbnkpLmdpdENvbnRleHQsXG4gICAgICAgIHJvdXRlOiAocGFnZSBhcyBhbnkpLnJvdXRlLFxuICAgICAgICBzdGF0ZTogKHBhZ2UgYXMgYW55KS5zdGF0ZSxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgfTtcbiAgICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgcGFnZU1zZyk7XG4gICAgICBwb3NpdGlvbisrO1xuICAgIH1cbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIG5ld01zZyk7XG4gICAgcGVyc2lzdCgpO1xuICAgIC8vIEludGVudGlvbmFsbHkgTk8gc2V0TGFzdEFjdGl2ZShlbnRyeS5zZWxlY3RvcikgaGVyZSDigJQgdGhlIHVzZXIgYXNrZWRcbiAgICAvLyBmb3IgZnJlc2ggY2FwdHVyZXMgdG8gc3RheSB1bi1oaWdobGlnaHRlZCBpbiB0aGUgc2lkZWJhci4gVGhlIHN0aWNreVxuICAgIC8vIHJpbmcgKyBsYXN0LWFjdGl2ZSBvdXRsaW5lIG5vdyBvbmx5IGdldCBhcHBsaWVkIG9uIGV4cGxpY2l0XG4gICAgLy8gaG92ZXIvY2xpY2sgb2YgdGhlIHNpZGViYXIgYnViYmxlIChhbmQgdGhlIHBhZ2Utc2lkZSBmbGFzaCBmcm9tXG4gICAgLy8gY2FwdHVyZUVudHJ5IHN0aWxsIGNvbmZpcm1zIHRoZSBjYXB0dXJlIHZpc3VhbGx5IG9uIHRoZSBwYWdlKS5cbiAgICByZW5kZXIoKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KG5ld01zZyk7XG4gICAgdm9pZCBmaXJlUGFnZVNob3RJZk5lZWRlZChuZXdNc2cpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTY3JlZW5zaG90IHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRmlyZSB0aGUgcGVyLWVsZW1lbnQgc2hvdCwgYXR0YWNoIHRoZSByZXR1cm5lZCBmaWxlbmFtZSArIGRhdGFVcmwgb250b1xuICAvLyB0aGUgZW50cnksIGFuZCBwZXJzaXN0LiBzaG91bGRTa2lwU2NyZWVuc2hvdCBiYWlscyBvbiBob3N0cyBpbiB0aGVcbiAgLy8gdXNlcidzIHNraXAgbGlzdDsgYXV0b1NjcmVlbnNob3Q9ZmFsc2UgYmFpbHMgZ2xvYmFsbHkuXG4gIGNvbnN0IGZpcmVFbGVtZW50U2hvdCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCBza2lwcGVkOiBhdXRvU2NyZWVuc2hvdD1mYWxzZScpO1xuICAgICAgLy8gQnVnICMyOiB0ZWxsIHRoZSBleHBvcnQgd2h5IHRoZSBzaG90IGlzIG1pc3NpbmcuXG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ2F1dG9TY3JlZW5zaG90T2ZmJ307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGhvc3Qgb24gc2tpcCBsaXN0JywgbXNnLmVudHJ5LnVybCk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ3NraXBTY3JlZW5zaG90SG9zdHMnfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IOKGkicsIG1zZy5lbnRyeS5zZWxlY3Rvcik7XG4gICAgLy8gU1cgY29sZC1zdGFydCByYWNlOiB0aGUgRklSU1QgY2FwdHVyZSBpbiBhIHNlc3Npb24gb2Z0ZW4gbG9zZXMgaXRzXG4gICAgLy8gZmlyc3QgbWVzc2FnZSBiZWNhdXNlIHRoZSBiZyB3b3JrZXIgaXMgc3RpbGwgc3RhcnRpbmcuIFJldHJ5IG9uY2VcbiAgICAvLyBhZnRlciBhIHNob3J0IGRlbGF5IGlmIHRoZSBmaXJzdCBjYWxsIGNvbWVzIGJhY2sgbnVsbC9lbXB0eS5cbiAgICBsZXQgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5IHx8ICghcmVwbHkub2sgJiYgIXJlcGx5LmVycm9yKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyc3Qgc2NyZWVuc2hvdCByZXBseSB3YXMgZW1wdHk7IHJldHJ5aW5nIGFmdGVyIDIwMG1zIChTVyBjb2xkLXN0YXJ0KScpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMjAwKSk7XG4gICAgICByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHJlcGx5OicsIHJlcGx5KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHtcbiAgICAgIHNldFN0YXR1cyhgU2NyZWVuc2hvdCBmYWlsZWQ6ICR7cmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICB1bmF2YWlsYWJsZVJlYXNvbjogcmVwbHk/LmVycm9yID8/ICdjYXB0dXJlRmFpbGVkJyxcbiAgICAgIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFN1Y2Nlc3NmdWwgcmV0cnkg4oCUIHN0cmlwIGFueSBwcmlvciB1bmF2YWlsYWJsZVJlYXNvbiBzaW5jZSB3ZSBub3dcbiAgICAvLyBoYXZlIGEgcmVhbCBzaG90LlxuICAgIGRlbGV0ZSBtc2cuZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZWxlbWVudDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAuLi4ocmVwbHkuY3JvcCA/IHtjcm9wOiByZXBseS5jcm9wfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaXJlIHRoZSBncm91cCBzaG90ICh1bmlvbiBiYm94IG9mIGhlYWQgKyBhbGwgbWVtYmVycykgYW5kIHN0YXNoIHRoZVxuICAvLyBmaWxlbmFtZSBvbiB0aGUgaGVhZC1vZi1ncm91cCBlbnRyeS5cbiAgY29uc3QgZmlyZUdyb3VwU2hvdCA9IGFzeW5jIChoZWFkOiBTZWxlY3Rvck1lc3NhZ2UsIHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KGhlYWQuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1ncm91cCcsIHNlbGVjdG9ycywgbjogaGVhZC5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIGhlYWQuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihoZWFkLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZ3JvdXA6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkgeyBzaG90c0Z1bGwuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTsgcGVyc2lzdFNob3RzRnVsbCgpOyB9XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIFBhZ2UtbGV2ZWwgc2hvdCBvbmNlIHBlciAod29ya3NwYWNlLCBwYWdlLXVybCwgZGF5KS4gU3Vic2VxdWVudCBjYXB0dXJlc1xuICAvLyBvbiB0aGUgc2FtZSBwYWdlIHJldXNlIHRoZSBzYW1lIG9uLWRpc2sgZmlsZSBwYXRoLlxuICBjb25zdCBmaXJlUGFnZVNob3RJZk5lZWRlZCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICAvLyBQZXItY2FwdHVyZSBwYWdlLXNob3QgbW9kZSAowqc0LjUpOiB3aGVuIGVuYWJsZWQsIHNraXAgdGhlXG4gICAgLy8gcGVyLSh3b3Jrc3BhY2UsIHVybCkgZGVkdXBlIGFuZCBmaXJlIGEgZnJlc2ggcGFnZSBzaG90IGV2ZXJ5IHRpbWUuXG4gICAgLy8gVXNlZnVsIHdoZW4gdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzIChtb2RhbCBvcGVucyxcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3csIGV0Yy4pIGFuZCB0aGUgdXNlciB3YW50cyB0byBzZWUgdGhlIHdob2xlIHBhZ2UgYXRcbiAgICAvLyBlYWNoIHN0ZXAuIENvc3RzIG9uZSBmdWxsLXBhZ2UgUE5HIHBlciBjYXB0dXJlLCBzbyBkZWZhdWx0IG9mZi5cbiAgICBpZiAoIXByZWZzLnBhZ2VTaG90UGVyQ2FwdHVyZSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFnZVNob3RLZXkobXNnLmVudHJ5LnVybCk7XG4gICAgICBpZiAocGFnZVNob3RzRmlyZWQuaGFzKGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kRXhpc3RpbmdQYWdlU2hvdChtc2cuZW50cnkudXJsKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICAgICAgcGFnZTogZXhpc3RpbmcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGFnZVNob3RzRmlyZWQuYWRkKGtleSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1wYWdlJywgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgLy8gQXBwbHkgdG8gVEhJUyBlbnRyeSBhbmQgdG8gYW55IG90aGVyIGVudHJpZXMgYWxyZWFkeSBjYXB0dXJlZCBvbiB0aGVcbiAgICAvLyBzYW1lIFVSTCB0b2RheSAoc28gdGhlIHBhZ2Utc2hvdCBhcHBlYXJzIHVuaWZvcm1seSkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gbXNnLmVudHJ5LnVybCkgY29udGludWU7XG4gICAgICBtLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICBwYWdlOiByZXBseS5maWxlbmFtZSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFN0YXNoIHRoZSBmdWxsIFBORyBzbyB0aGUgd29ya3NwYWNlIGFyY2hpdmUgY2FuIGJ1bmRsZSBpdC4gS2V5ZWRcbiAgICAvLyBieSBVUkwgc2luY2UgcGFnZSBzaG90cyBhcmUgcGFnZS1zY29wZWQsIG5vdCBzZWxlY3Rvci1zY29wZWQuXG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KCdwYWdlOjonICsgbXNnLmVudHJ5LnVybCwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmluZCBhbnkgc2VsZWN0b3IgZW50cnkgb24gdGhpcyBVUkwgdGhhdCBhbHJlYWR5IGhhcyBhIGBwYWdlYCBzaG90XG4gIC8vIHJlY29yZGVkIOKAlCB1c2VkIHNvIHRoYXQgcmV0cm9hY3RpdmUgY2FwdHVyZXMgaW5oZXJpdCB0aGUgZXhpc3RpbmcgUE5HXG4gIC8vIHBhdGggaW5zdGVhZCBvZiByZWZpcmluZy5cbiAgY29uc3QgZmluZEV4aXN0aW5nUGFnZVNob3QgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgcmV0dXJuIG0uZW50cnkuc2NyZWVuc2hvdC5wYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBvbkhvdmVyID0gKHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTogdm9pZCA9PiB7XG4gICAgc2V0U3RhdHVzKGBBbHQtaG92ZXIgwrcgJHtsYWJlbH1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgLy8gSWRlbnRpdHkgaXMgKHNlbGVjdG9yLCB1cmwpLiBTYW1lIHNlbGVjdG9yIG9uIHR3byBkaWZmZXJlbnQgVVJMc1xuICAgIC8vIGlzIHR3byBkaWZmZXJlbnQgY2FwdHVyZXM7IHRoZSBwcmV2aW91cyBzZWxlY3Rvci1vbmx5IGxvb2t1cFxuICAgIC8vIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi4gUHJlZmVyIHNhbWUtVVJMICtcbiAgICAvLyBzYW1lLXNlbGVjdG9yIGFzIHRoZSBzdHJvbmdlc3QgbWF0Y2guXG4gICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSBzY3JvbGxNZXNzYWdlSW50b1ZpZXcoZXhpc3RpbmcuaWQpO1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihleGlzdGluZy5pZCk7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7dWlkOiBleGlzdGluZy5lbnRyeS51aWQsIG46IGV4aXN0aW5nLmVudHJ5Lm4sIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFja319KTtcbiAgICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXIoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBTFdBWVMgc2hvdyB0aGUgY29tbWVudCBib3gsIGV2ZW4gZm9yIHVuY2FwdHVyZWQgZWxlbWVudHMuIE9uIHN1Ym1pdFxuICAgICAgLy8gdGhlIGNvbnRlbnQgc2NyaXB0IHdpbGwgY2FwdHVyZSB0aGUgZWxlbWVudCBmaXJzdCwgdGhlbiBhdHRhY2ggdGhlXG4gICAgICAvLyBjb21tZW50IOKAlCB0dXJuaW5nIGhvdmVyLWNvbW1lbnQgaW50byBhIGNhcHR1cmUrY29tbWVudCBzaG9ydGN1dC5cbiAgICAgIHBoYW50b21UYXJnZXQgPSB7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3Q6IHJlY3QgYXMgdW5rbm93biBhcyBET01SZWN0fTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHtjYXB0dXJlZDogZmFsc2UsIGZlZWRiYWNrOiBbXX19KTtcbiAgICAgIHJlbmRlclBoYW50b20oKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudD8uc3RhcnRzV2l0aCgnQWx0LWhvdmVyJykpIHN0YXR1cy50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXJQaGFudG9tKCk7IH1cbiAgICAvLyBObyBhbm5vdGF0aW9uLWNsZWFyIGhlcmUg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBrZWVwcyB0aGUgYm94IG9wZW4gc28gdGhlXG4gICAgLy8gdXNlciBjYW4gbW91c2UgdG8gaXQgYW5kIHR5cGUuIE91dHNpZGUtY2xpY2sgLyBFc2MgZGlzbWlzcyBpdC5cbiAgfTtcblxuICBjb25zdCBjb2xsZWN0RmVlZGJhY2tBZnRlciA9IChzZWxlY3RvcklkOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKCFmb3VuZCkgeyBpZiAobS5pZCA9PT0gc2VsZWN0b3JJZCkgZm91bmQgPSB0cnVlOyBjb250aW51ZTsgfVxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyB8fCBtLnR5cGUgPT09ICdwYWdlJykgYnJlYWs7XG4gICAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSBvdXQucHVzaChtLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IHNjcm9sbE1lc3NhZ2VJbnRvVmlldyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGVsLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJ30pO1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoLWludG8tdmlldycpO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gtaW50by12aWV3Jyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0aWNreSBoaWdobGlnaHQgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2V0TGFzdEFjdGl2ZSA9IChzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhcm1TdGlja3lFeHBpcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBzdGlja3lUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcGFuZWxIb3ZlcmVkKSB7XG4gICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yLmxhc3QtYWN0aXZlJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtYWN0aXZlJyk7XG4gICAgICB9IGVsc2UgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSwgU1RJQ0tZX1RUTF9NUyk7XG4gIH07XG5cbiAgLy8gRmFzdCBzdGlja3ktY2xlYXI6IHdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBwYW5lbCwgZmlyZVxuICAvLyBzdGlja3ktY2xlYXIgYWZ0ZXIgYSAzMDAgbXMgZ3JhY2Ugd2luZG93LiBQcmlvciBiZWhhdmlvciB3YWl0ZWQgdGhlXG4gIC8vIGZ1bGwgU1RJQ0tZX1RUTF9NUyAofjUgcykgd2hpY2ggZmVsdCBsaWtlIHRoZSBwYWdlLXNpZGUgaGlnaGxpZ2h0XG4gIC8vIFwiZG9lc24ndCBnbyBhd2F5IGV2ZW4gYWZ0ZXIgSSB1bmhvdmVyXCIuIDMwMCBtcyBpcyBzaG9ydCBlbm91Z2ggdG9cbiAgLy8gZmVlbCByZXNwb25zaXZlIGJ1dCBsb25nIGVub3VnaCB0aGF0IGEgcXVpY2sgcmVwb3NpdGlvbiAoZS5nLlxuICAvLyBhY2NpZGVudGFsbHkgY3Jvc3NpbmcgdGhlIHNlYW0pIGRvZXNuJ3Qga2lsbCB0aGUgcmluZyBtaWQtZmxpZ2h0LlxuICBsZXQgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSB0cnVlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSB7IGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTsgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7IH1cbiAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgfSk7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpO1xuICAgIHN0aWNreUNsZWFyR3JhY2UgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgLy8gQWxzbyBkcm9wIG91ciBvd24gZnJvbS1wYW5lbCArIG11bHRpIHJpbmdzIGluIGNhc2UgdGhleSBsZWFrZWQuXG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGVpciBtb3VzZSBpbnRvIHRoZSBwYW5lbCwgc3VwcHJlc3MgcGFnZS1zaWRlXG4gICAgLy8gYWx0LWhvdmVyIHN0YXRlIHNvIHRoZSBvcmFuZ2UgcmluZyBkb2Vzbid0IGtlZXAgZm9sbG93aW5nIHRoZSBjdXJzb3IuXG4gICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgUmVuZGVyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBORUFSX0JPVFRPTV9QWCA9IDgwO1xuICBjb25zdCB3YXNOZWFyQm90dG9tID0gKCk6IGJvb2xlYW4gPT5cbiAgICBsaXN0LnNjcm9sbEhlaWdodCAtIGxpc3Quc2Nyb2xsVG9wIC0gbGlzdC5jbGllbnRIZWlnaHQgPD0gTkVBUl9CT1RUT01fUFg7XG5cbiAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9IChtOiBQYW5lbE1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAvLyBNYXRjaCBhZ2FpbnN0IHRoZSBXSE9MRSBlbnRyeSAoc2VsZWN0b3IsIHRleHQsIGNsYXNzZXMsIGF0dHJzLFxuICAgICAgLy8gb3V0ZXJIVE1MLCBzdHlsZXMsIGV0Yy4pIHNvIHNlYXJjaCBoaXRzIGFueXRoaW5nIHZpc2libGUgaW4gdGhlXG4gICAgICAvLyBib2R5LWpzb24uIFN0cmluZ2lmeWluZyBvbmNlIGlzIGZpbmUg4oCUIHRoZSBjb3N0IGlzIHRpbnkgdnMgcmVuZGVyLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgfVxuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIChtLnVybCArICcgJyArIChtLnRpdGxlID8/ICcnKSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSBidWJibGUncyBib2R5LWpzb24gKG9yIG91dGVySFRNTCkgY29udGFpbnMgdGhlIHNlYXJjaCDigJRcbiAgLy8gdGVsbHMgcmVuZGVyU2VsZWN0b3IgdG8gYXV0by1leHBhbmQgc28gdGhlIHVzZXIgc2VlcyB0aGUgaGlnaGxpZ2h0ZWQgaGl0LlxuICBjb25zdCBib2R5TWF0Y2hlc1NlYXJjaCA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG0uZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0UmFpbCA9IChiZWZvcmVJZDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnaW5zZXJ0LXJhaWwnO1xuICAgIGRpdi5kYXRhc2V0LmJlZm9yZUlkID0gYmVmb3JlSWQ7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50ID09PSBiZWZvcmVJZCkge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICBkaXYuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTsgcmVuZGVyKCk7IH0sXG4gICAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4gc2VuZElubGluZSh0ZXh0KSxcbiAgICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidG4uY2xhc3NOYW1lID0gJ2FkZC1idG4nO1xuICAgICAgYnRuLmRhdGFzZXQudGlwID0gJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZSc7XG4gICAgICBidG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdwbHVzJywgMTIpO1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkOyBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7IHJlbmRlcigpOyB9KTtcbiAgICAgIGRpdi5hcHBlbmQoYnRuKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICB0eXBlIElubGluZUNvbW1lbnRPcHRzID0ge1xuICAgIGluaXRpYWw/OiBzdHJpbmc7XG4gICAgb25DYW5jZWw/OiAoKSA9PiB2b2lkO1xuICAgIG9uU3VibWl0PzogKHRleHQ6IHN0cmluZykgPT4gdm9pZDtcbiAgICBhdXRvZm9jdXM/OiBib29sZWFuO1xuICB9O1xuICBjb25zdCBidWlsZElubGluZUNvbW1lbnQgPSAoe2luaXRpYWwgPSAnJywgb25DYW5jZWwsIG9uU3VibWl0LCBhdXRvZm9jdXN9OiBJbmxpbmVDb21tZW50T3B0cyk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcC5jbGFzc05hbWUgPSAnaW5saW5lLWNvbW1lbnQnO1xuICAgIGNvbnN0IHRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB0YS52YWx1ZSA9IGluaXRpYWw7XG4gICAgdGEucm93cyA9IDI7XG4gICAgdGEucGxhY2Vob2xkZXIgPSAnSW5zZXJ0IGEgY29tbWVudCBoZXJlLCBvciBBbHQrQ2xpY2sgdG8gaW5zZXJ0IGEgY2FwdHVyZSc7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcm93LmNsYXNzTmFtZSA9ICdyb3cnO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9ICcwdyDCtyAwdCc7XG4gICAgLy8gQm90aCBTYXZlIC8gQ2FuY2VsIGFyZSB1bmlmb3JtIGljb24gYnV0dG9ucyAoLmljb25idG4pLiBTYXZlIHVzZXMgdGhlXG4gICAgLy8gcHJpbWFyeSBhY2NlbnQgdmFyaWFudCB2aWEgLnByaW1hcnkgc28gaXQgc3RpbGwgcG9wcywgYnV0IGl0cyB3aWR0aFxuICAgIC8vIG1hdGNoZXMgQ2FuY2VsIGV4YWN0bHkuXG4gICAgY29uc3QgY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjYW5jZWwuY2xhc3NOYW1lID0gJ2ljb25idG4nO1xuICAgIGNhbmNlbC5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgwrcgRXNjJztcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMjApO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uQ2FuY2VsPy4oKSk7XG4gICAgY29uc3Qgc2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbmQudHlwZSA9ICdidXR0b24nO1xuICAgIHNlbmQuY2xhc3NOYW1lID0gJ2ljb25idG4gcHJpbWFyeSc7XG4gICAgc2VuZC5kYXRhc2V0LnRpcCA9ICdTYXZlIMK3IEVudGVyJztcbiAgICBzZW5kLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAyMCk7XG4gICAgY29uc3Qgc3VibWl0ID0gKCk6IHZvaWQgPT4gb25TdWJtaXQ/Lih0YS52YWx1ZSk7XG4gICAgc2VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdCk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7IG1ldGEudGV4dENvbnRlbnQgPSBgJHt3b3JkQ291bnQodGEudmFsdWUpfXcgwrcgJHt0b2tlbkNvdW50KHRhLnZhbHVlKX10YDsgfSk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0KCk7IH1cbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIG9uQ2FuY2VsPy4oKTtcbiAgICB9KTtcbiAgICByb3cuYXBwZW5kKG1ldGEsIGNhbmNlbCwgc2VuZCk7XG4gICAgd3JhcC5hcHBlbmQodGEsIHJvdyk7XG4gICAgaWYgKGF1dG9mb2N1cykgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhLmZvY3VzKCkpO1xuICAgIHJldHVybiB3cmFwO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRJbmxpbmUgPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGV4dCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgYmVmb3JlSWQgPSBpbnNlcnRCZWZvcmUuY3VycmVudDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsZXQgcG9zID0gYmVmb3JlSWQgPyBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGJlZm9yZUlkKSA6IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAocG9zIDwgMCkgcG9zID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIC8vIHBhcmVudFVpZCByZXNvbHV0aW9uOiB3YWxrIGJhY2sgZnJvbSB0aGUgaW5zZXJ0IHBvc2l0aW9uIHRvIHRoZVxuICAgIC8vIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yLiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciB0aGUgRksuXG4gICAgbGV0IHBJZHggPSBwb3MgLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9O1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3MsIDAsIGZiKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdJbnNlcnRlZCcpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBoYW50b20gPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGhhbnRvbScpPy5yZW1vdmUoKTtcbiAgICBpZiAoIXBoYW50b21UYXJnZXQpIHJldHVybjtcbiAgICBjb25zdCBwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBoLmNsYXNzTmFtZSA9ICdwaGFudG9tIHZpc2libGUnO1xuICAgIHBoLmlubmVySFRNTCA9IGA8Y29kZT4ke2VzY2FwZUh0bWwocGhhbnRvbVRhcmdldC5sYWJlbCl9PC9jb2RlPmA7XG4gICAgbGlzdC5hcHBlbmQocGgpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIC8vIFJlb3JkZXIgYSBmbGF0IG1lc3NhZ2UgbGlzdCBzbyBzZWxlY3RvcnMgd2l0aGluIGVhY2ggcGFnZS1kZWxpbWl0ZWRcbiAgLy8gYmxvY2sgYXJlIHNvcnRlZCBieSB0aGVpciB2aXN1YWwgcmVjdCAodG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQpLlxuICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIChjYXB0dXJlXG4gIC8vIGFkamFjZW5jeSkgc28gZWRpdGluZy90aHJlYWRpbmcgYmVoYXZpb3Igc3Vydml2ZXMgdGhlIHNvcnQuXG4gIC8vXG4gIC8vIFVzZWQgT05MWSBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIChgYnVpbGRTbGltYCksIG5vdCB0aGUgc2lkZWJhclxuICAvLyByZW5kZXIuIFRoZSBzaWRlYmFyIGtlZXBzIG1lc3NhZ2VzIGluIGluc2VydGlvbi9jYXB0dXJlIG9yZGVyIHNvXG4gIC8vIHRoZSB1c2VyIHNlZXMgdGhlbSB3aGVyZSB0aGV5IGV4cGVjdDsgdGhlIGV4cG9ydCBnZXRzIHRoZSBhZ2VudC1cbiAgLy8gZnJpZW5kbHkgcmVhZGluZy1vcmRlciB0cmVhdG1lbnQuXG4gIGNvbnN0IHJlb3JkZXJGb3JFeHBvcnQgPSAobXNnczogUGFuZWxNZXNzYWdlW10pOiBQYW5lbE1lc3NhZ2VbXSA9PiB7XG4gICAgdHlwZSBHcm91cCA9IHtraW5kOiAnZ3JvdXAnOyBzZWw6IFNlbGVjdG9yTWVzc2FnZTsgdHJhaWxpbmc6IEZlZWRiYWNrTWVzc2FnZVtdfTtcbiAgICB0eXBlIExvb3NlID0ge2tpbmQ6ICdsb29zZSc7IG06IEZlZWRiYWNrTWVzc2FnZX07XG4gICAgdHlwZSBTbG90ID0gR3JvdXAgfCBMb29zZSB8IHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfTtcbiAgICBjb25zdCBzbG90czogU2xvdFtdID0gW107XG4gICAgbGV0IGN1ckdyb3VwOiBHcm91cCB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGZsdXNoR3JvdXAgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoY3VyR3JvdXApIHsgc2xvdHMucHVzaChjdXJHcm91cCk7IGN1ckdyb3VwID0gbnVsbDsgfVxuICAgIH07XG4gICAgZm9yIChjb25zdCBtIG9mIG1zZ3MpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIHNsb3RzLnB1c2goe2tpbmQ6ICdwYWdlJywgbX0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBjdXJHcm91cCA9IHtraW5kOiAnZ3JvdXAnLCBzZWw6IG0sIHRyYWlsaW5nOiBbXX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY3VyR3JvdXApIGN1ckdyb3VwLnRyYWlsaW5nLnB1c2gobSk7XG4gICAgICAgIGVsc2Ugc2xvdHMucHVzaCh7a2luZDogJ2xvb3NlJywgbX0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaEdyb3VwKCk7XG4gICAgY29uc3Qgb3V0OiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGxldCBydW5TdGFydCA9IDA7XG4gICAgY29uc3QgZmx1c2hSdW4gPSAoZW5kOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgICBjb25zdCBncm91cFJlY3RzOiBBcnJheTx7aWR4OiBudW1iZXI7IHk6IG51bWJlcjsgeDogbnVtYmVyfT4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSBydW5TdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByID0gcy5zZWwuZW50cnkucmVjdDtcbiAgICAgICAgICBncm91cFJlY3RzLnB1c2goe2lkeDogaSwgeTogcj8ueSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIHg6IHI/LnggPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kaWNlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgZ3JvdXBSZWN0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnkgIT09IGIueSkgcmV0dXJuIGEueSAtIGIueTtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICAgIH0pO1xuICAgICAgbGV0IGdpID0gMDtcbiAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByZXBsYWNlbWVudElkeCA9IGdyb3VwUmVjdHNbZ2krK10hLmlkeDtcbiAgICAgICAgICBjb25zdCByID0gc2xvdHNbcmVwbGFjZW1lbnRJZHhdISBhcyBHcm91cDtcbiAgICAgICAgICBvdXQucHVzaChyLnNlbCk7XG4gICAgICAgICAgZm9yIChjb25zdCBmIG9mIHIudHJhaWxpbmcpIG91dC5wdXNoKGYpO1xuICAgICAgICB9IGVsc2UgaWYgKHMua2luZCA9PT0gJ2xvb3NlJykge1xuICAgICAgICAgIG91dC5wdXNoKHMubSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzbG90c1tpXSEua2luZCA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoUnVuKGkpO1xuICAgICAgICBvdXQucHVzaCgoc2xvdHNbaV0gYXMge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9KS5tKTtcbiAgICAgICAgcnVuU3RhcnQgPSBpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hSdW4oc2xvdHMubGVuZ3RoKTtcbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdGlja1RvQm90dG9tID0gbGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDAgfHwgd2FzTmVhckJvdHRvbSgpO1xuICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAvLyBTdGF0cyBudW1iZXJzXG4gICAgbGV0IHRvdGFsU2VsZWN0b3JzID0gMDtcbiAgICBsZXQgdG90YWxDb21tZW50cyA9IDA7XG4gICAgbGV0IHRvdGFsU3RhbGUgPSAwO1xuICAgIGNvbnN0IGRpc3RpbmN0UGFnZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgdG90YWxTZWxlY3RvcnMrKztcbiAgICAgICAgaWYgKHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSkgdG90YWxTdGFsZSsrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHRvdGFsQ29tbWVudHMrKztcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtZXNzYWdlcy5zb21lKCh4KSA9PiB4LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgeC5lbnRyeS51cmwgPT09IG0udXJsKSkgZGlzdGluY3RQYWdlcy5hZGQobS51cmwpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic2VsZWN0b3JzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFNlbGVjdG9ycyk7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cImNvbW1lbnRzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbENvbW1lbnRzKTtcbiAgICBjb25zdCBzdGFsZU51bSA9IHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzdGFsZVwiXSAuc3RhdC1udW0nKSE7XG4gICAgc3RhbGVOdW0udGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTdGFsZSk7XG4gICAgc3RhbGVOdW0uZGF0YXNldC56ZXJvID0gdG90YWxTdGFsZSA9PT0gMCA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInBhZ2VzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyhkaXN0aW5jdFBhZ2VzLnNpemUpO1xuICAgIGNvbnN0IGV4cG9ydFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgc3RhdFRva2Vucy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcodG9rZW5Db3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG4gICAgc3RhdFdvcmRzLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh3b3JkQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuXG4gICAgLy8gTWluaWZ5IHJlZHVjdGlvbiBzdGF0c1xuICAgIGxldCBmdWxsVCA9IDAsIGN1clQgPSAwLCBmdWxsVyA9IDAsIGN1clcgPSAwLCBwY3QgPSAwO1xuICAgIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICBjb25zdCB3YXNNaW4gPSBwcmVmcy5taW5pZnk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB0cnVlOyBjb25zdCBtaW5UZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gZmFsc2U7IGNvbnN0IGZ1bGxUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gd2FzTWluO1xuICAgICAgZnVsbFQgPSB0b2tlbkNvdW50KGZ1bGxUZXh0KTsgY3VyVCA9IHRva2VuQ291bnQobWluVGV4dCk7XG4gICAgICBmdWxsVyA9IHdvcmRDb3VudChmdWxsVGV4dCk7IGN1clcgPSB3b3JkQ291bnQobWluVGV4dCk7XG4gICAgICBwY3QgPSBmdWxsVCA+IDAgPyBNYXRoLnJvdW5kKCgxIC0gY3VyVCAvIGZ1bGxUKSAqIDEwMCkgOiAwO1xuICAgIH1cbiAgICBjb25zdCBtaW5pZnlTdGF0c0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1pbmlmeS1zdGF0c10nKTtcbiAgICBpZiAobWluaWZ5U3RhdHNFbCkge1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtmdWxsVC50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJULnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke2Z1bGxXLnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clcudG9Mb2NhbGVTdHJpbmcoKX0gd29yZHMgwrcgJHtwY3R9JSByZWR1Y3Rpb25gO1xuICAgICAgfSBlbHNlIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgV291bGQgc2F2ZSAkeyhmdWxsVCAtIGN1clQpLnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke3BjdH0lIGlmIGVuYWJsZWRgO1xuICAgICAgfSBlbHNlIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG5cbiAgICAvLyBQZXItY2hlY2tib3ggY29udHJpYnV0aW9uIHN0YXRzOiBob3cgbWFueSB0b2tlbnMvd29yZHMgZWFjaCB0b2dnbGVcbiAgICAvLyBhZGRzIHRvIHRoZSBjdXJyZW50IGV4cG9ydC4gQ29tcHV0ZWQgYnkgdG9nZ2xpbmcgdGhhdCBzaW5nbGUgcHJlZlxuICAgIC8vIGFuZCBkaWZmaW5nIHRoZSBleHBvcnQg4oCUIGdpdmVzIGFuIGhvbmVzdCBhbnN3ZXIgdGhhdCByZWZsZWN0cyB0aGVcbiAgICAvLyBjdXJyZW50IG1pbmlmeSBzdGF0ZSBhbmQgdGhlIHJlc3Qgb2YgdGhlIHRvZ2dsZXMuXG4gICAgY29uc3QgY29udHJpYktleXM6IEFycmF5PGtleW9mIFByZWZzPiA9IFsnaW5jbHVkZU91dGVySFRNTCcsICdpbmNsdWRlTWF0Y2hlZFJ1bGVzJywgJ2luY2x1ZGVTdHlsZXMnXTtcbiAgICBpZiAoZXhwb3J0VGV4dCAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJhc2VUID0gdG9rZW5Db3VudChleHBvcnRUZXh0KTtcbiAgICAgIGNvbnN0IGJhc2VXID0gd29yZENvdW50KGV4cG9ydFRleHQpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoIWVsKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qgd2FzT24gPSBwcmVmc1trZXldIGFzIGJvb2xlYW47XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSAhd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSB3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VCA9IHRva2VuQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIGNvbnN0IGFsdFcgPSB3b3JkQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIC8vIHdhc09uPXRydWUg4oaSIGN1cnJlbnRseSBpbmNsdWRlZDsgY29zdCA9IGJhc2UgLSBhbHQgKHR1cm5pbmcgT0ZGIHNhdmVzIHRoaXMpLlxuICAgICAgICAvLyB3YXNPbj1mYWxzZSDihpIgY3VycmVudGx5IGV4Y2x1ZGVkOyBnYWluID0gYWx0IC0gYmFzZSAodHVybmluZyBPTiBhZGRzIHRoaXMpLlxuICAgICAgICBjb25zdCBkVCA9IHdhc09uID8gYmFzZVQgLSBhbHRUIDogYWx0VCAtIGJhc2VUO1xuICAgICAgICBjb25zdCBkVyA9IHdhc09uID8gYmFzZVcgLSBhbHRXIDogYWx0VyAtIGJhc2VXO1xuICAgICAgICBjb25zdCBzaWduID0gd2FzT24gPyAnJyA6ICcrJztcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB3YXNPblxuICAgICAgICAgID8gYMK3ICR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaW4gZXhwb3J0JHtwcmVmcy5taW5pZnkgPyAnIChtaW5pZmllZCknIDogJyd9YFxuICAgICAgICAgIDogYMK3ICR7c2lnbn0ke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtzaWdufSR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpZiBlbmFibGVkYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoZWwpIGVsLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9vbGJhciBleHBvcnQgc3RhdHNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignLnN0YXQuZXhwb3J0LXN0YXRzJykuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgY29uc3QgbnVtID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbnVtJyk7XG4gICAgICBjb25zdCBsYWIgPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1sYWJlbCcpO1xuICAgICAgaWYgKG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50IS5yZXBsYWNlKC9cXCokLywgJycpO1xuICAgICAgaWYgKGxhYikgbGFiLnRleHRDb250ZW50ID0gbGFiLnRleHRDb250ZW50IS5yZXBsYWNlKC9eXFwqLywgJycpO1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCArICcqJztcbiAgICAgIGNvbnN0IGlzVG9rZW4gPSBpID09PSAwO1xuICAgICAgY29uc3QgZnVsbFYgPSBpc1Rva2VuID8gZnVsbFQgOiBmdWxsVztcbiAgICAgIGNvbnN0IGN1clYgPSBpc1Rva2VuID8gY3VyVCA6IGN1clc7XG4gICAgICBjb25zdCB3aGljaCA9IGlzVG9rZW4gPyAndG9rZW5zJyA6ICd3b3Jkcyc7XG4gICAgICBzLmRhdGFzZXQudGlwID0gcHJlZnMubWluaWZ5XG4gICAgICAgID8gYE1JTklGSUVEIMK3ICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofVxcbkZ1bGwgd291bGQgYmUgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYFxuICAgICAgICA6IGAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9IMK3IGZ1bGwgZXhwb3J0XFxuTWluaWZpZWQgd291bGQgYmUgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgO1xuICAgIH0pO1xuXG4gICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS5pbm5lckhUTUwgPSBgPGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206OHB4O2ZvbnQtc2l6ZTozMnB4XCI+8J+kjzwvZGl2PlxuICAgICAgICBPcGVuIGFueSBwYWdlIGFuZCA8Yj5BbHQrQ2xpY2s8L2I+IGFuIGVsZW1lbnQuIENhcHR1cmVzIGxhbmQgaGVyZSBvbiB0aGUgbGVmdDs8YnI+XG4gICAgICAgIHR5cGUgY29tbWVudHMgYmVsb3cg4oCUIHRoZXkgYXBwZWFyIG9uIHRoZSByaWdodC5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RvclVybHMgPSBuZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnVybCkpO1xuICAgIGNvbnN0IHZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlICE9PSAncGFnZScgfHwgc2VsZWN0b3JVcmxzLmhhcyhtLnVybCkpO1xuICAgIGNvbnN0IHBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgQm9vbGVhbihtLnBpbm5lZCkpO1xuICAgIGNvbnN0IHVucGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSkgPT4gIXBpbm5lZC5pbmNsdWRlcyhtIGFzIFNlbGVjdG9yTWVzc2FnZSkpO1xuICAgIC8vIFNpZGViYXIgc2hvd3MgY2FwdHVyZXMgaW4gSU5TRVJUSU9OIG9yZGVyIChtb3N0IHJlY2VudCBhdCB0aGVcbiAgICAvLyBib3R0b20pLiBWaXN1YWwtcG9zaXRpb24gcmVvcmRlcmluZyBoYXBwZW5zIE9OTFkgYXQgZXhwb3J0IHRpbWVcbiAgICAvLyBzbyB0aGUgc2lkZWJhciBzdGF5cyBwcmVkaWN0YWJsZSB3aGlsZSB0aGUgYWdlbnQtZmFjaW5nIGV4cG9ydFxuICAgIC8vIGdldHMgcmVhZGluZy1vcmRlciBjb252ZW5pZW5jZS4gKFByaW9yIGltcGxlbWVudGF0aW9uIHNvcnRlZCBpblxuICAgIC8vIGJvdGggcGxhY2VzOyB1c2VyIGZlZWRiYWNrIHdhcyB0aGF0IHNpZGViYXIgc2h1ZmZsaW5nIHdhc1xuICAgIC8vIGRpc29yaWVudGluZy4pXG4gICAgY29uc3Qgb3JkZXJlZCA9IFsuLi5waW5uZWQsIC4uLnVucGlubmVkXTtcblxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwobWVzc2FnZXNbMF0hLmlkKSk7XG4gICAgbGV0IGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJlbmRlcmVkQW55ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmRlcmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gb3JkZXJlZFtpXSE7XG4gICAgICBpZiAoIW1hdGNoZXNTZWFyY2gobSkpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgbm9kZSA9IHJlbmRlck1lc3NhZ2UobSwgbGFzdFNlbGVjdG9yU2VsKTtcbiAgICAgIGxpc3QuYXBwZW5kKG5vZGUpO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgbGFzdFNlbGVjdG9yU2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGlmIChpIDwgb3JkZXJlZC5sZW5ndGggLSAxKSBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG9yZGVyZWRbaSArIDFdIS5pZCkpO1xuICAgICAgcmVuZGVyZWRBbnkgPSB0cnVlO1xuICAgIH1cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKCdfX2VuZF9fJykpO1xuICAgIGlmICghcmVuZGVyZWRBbnkgJiYgc2VhcmNoUXVlcnkpIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSBgTm8gbWF0Y2hlcyBmb3IgXCIke3NlYXJjaFF1ZXJ5fVwiLmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgfVxuXG4gICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgcmVuZGVyUGhhbnRvbSgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhd05vb2RsZXMpO1xuICAgIGlmIChzdGlja1RvQm90dG9tKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQZW5kaW5nQmF5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBlbmRpbmctYmF5Jyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJheS5jbGFzc05hbWUgPSAncGVuZGluZy1iYXknO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgUGVuZGluZyBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9IGVsZW1lbnQke3BlbmRpbmdNdWx0aS5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gO1xuICAgIGJheS5hcHBlbmQoaGVhZCk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNhcmQuY2xhc3NOYW1lID0gJ3BlbmRpbmctY2FyZCc7XG4gICAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7aSArIDF9YDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSAoZS50ZXh0ICYmIGUudGV4dC5sZW5ndGggPD0gNjAgPyBlLnRleHQgOiAoZS5jb21wb25lbnRSb290ID8/IGUuc2VsZWN0b3IgPz8gZS50YWcpKTtcbiAgICAgIGNhcmQuYXBwZW5kKHNlcSwgbGFiZWwpO1xuICAgICAgYmF5LmFwcGVuZChjYXJkKTtcbiAgICB9KTtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3BlbmRpbmctcm93JztcbiAgICBjb25zdCBjb21taXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb21taXQudHlwZSA9ICdidXR0b24nO1xuICAgIGNvbW1pdC5jbGFzc05hbWUgPSAncHJpbWFyeSBwZW5kaW5nLWNvbW1pdCc7XG4gICAgY29tbWl0LnRleHRDb250ZW50ID0gYENvbW1pdCBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9YDtcbiAgICBjb21taXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY29tbWl0J30pKTtcbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwZW5kaW5nLWNhbmNlbCc7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJztcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSkpO1xuICAgIHJvdy5hcHBlbmQoY29tbWl0LCBjYW5jZWwpO1xuICAgIGJheS5hcHBlbmQocm93KTtcbiAgICBjb25zdCBoaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGludC5jbGFzc05hbWUgPSAncGVuZGluZy1oaW50JztcbiAgICBoaW50LnRleHRDb250ZW50ID0gJ0FsdCtTaGlmdCtDbGljayBtb3JlIMK3IENvbW1pdCB0byBmaW5hbGl6ZSDCtyBFc2MgdG8gY2FuY2VsJztcbiAgICBiYXkuYXBwZW5kKGhpbnQpO1xuICAgIGxpc3QuYXBwZW5kKGJheSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGNsZWFyTm9vZGxlcyA9ICgpOiB2b2lkID0+IHsgZm9yIChjb25zdCBuIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLnRyZWUtbm9vZGxlJykpIG4ucmVtb3ZlKCk7IH07XG5cbiAgLy8gQ3Jvc3Mtc2VhbSBwYW5lbOKGlGNhbnZhcyBub29kbGVzIHdlcmUgcmVtb3ZlZDogYWxpZ25pbmcgdHdvIFNWRyBoYWx2ZXNcbiAgLy8gYWNyb3NzIHRoZSBwYW5lbC9wYWdlIGJvdW5kYXJ5IGRlcGVuZGVkIG9uIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaFxuICAvLyBicmVha3MgdW5kZXIgRGV2VG9vbHMgZG9jayBhbmQgem9vbSwgYW5kIHRoZSB2aXN1YWwgYmVuZWZpdCBkaWRuJ3RcbiAgLy8ganVzdGlmeSB0aGUgbWFpbnRlbmFuY2UgY29zdC4gVGhlIGluLXBhbmVsIGZlZWRiYWNrLXRyZWUgbm9vZGxlc1xuICAvLyAoZHJhd05vb2RsZSAvIHJlZHJhd05vb2RsZXMgYmVsb3cpIGFyZSB1bmFmZmVjdGVkLlxuICBjb25zdCBjbGVhckJ1YmJsZU5vb2RsZSA9ICgpOiB2b2lkID0+IHsgLyogbm8tb3AgKi8gfTtcbiAgY29uc3QgcmVkcmF3Tm9vZGxlcyA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhck5vb2RsZXMoKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIFsuLi5saXN0LmNoaWxkcmVuXSBhcyBIVE1MRWxlbWVudFtdKSB7XG4gICAgICBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RvcicpKSBsYXN0U2VsZWN0b3JFbCA9IG5vZGU7XG4gICAgICBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlZWRiYWNrJykgJiYgbGFzdFNlbGVjdG9yRWwpIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIG5vZGUpO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1yYWlsJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2V4cGFuZGVkJykgJiYgbGFzdFNlbGVjdG9yRWwpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gbm9kZS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmlubGluZS1jb21tZW50JykgPz8gbm9kZTtcbiAgICAgICAgZHJhd05vb2RsZShsYXN0U2VsZWN0b3JFbCwgdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZGl2aWRlcicpIHx8IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncm91cC1oZWFkJykpIHtcbiAgICAgICAgbGFzdFNlbGVjdG9yRWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgZHJhd05vb2RsZSA9IChzZWxlY3RvckVsOiBIVE1MRWxlbWVudCwgZmVlZGJhY2tFbDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzUiA9IHNlbGVjdG9yRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZlIgPSBmZWVkYmFja0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxSID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4MSA9IHNSLmxlZnQgLSBsUi5sZWZ0ICsgMTI7XG4gICAgY29uc3QgeTEgPSBzUi5ib3R0b20gLSBsUi50b3AgKyBsaXN0LnNjcm9sbFRvcDtcbiAgICBjb25zdCB4MiA9IGZSLmxlZnQgLSBsUi5sZWZ0O1xuICAgIGNvbnN0IHkyID0gZlIudG9wIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3AgKyAxNDtcbiAgICBjb25zdCB3ID0gTWF0aC5tYXgoMjAsIHgyIC0geDEgKyA0KTtcbiAgICBjb25zdCBoID0gTWF0aC5tYXgoMjAsIHkyIC0geTEpO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndHJlZS1ub29kbGUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyh3KSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKGgpKTtcbiAgICBzdmcuc3R5bGUubGVmdCA9IGAke3gxIC0gMn1weGA7XG4gICAgc3ZnLnN0eWxlLnRvcCA9IGAke3kxfXB4YDtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgY29uc3Qgc3ggPSAyLCBzeSA9IDAsIGV4ID0gdyAtIDIsIGV5ID0gaDtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIGBNICR7c3h9ICR7c3l9IEMgJHtzeH0gJHtzeSArIGggKiAwLjU1fSwgJHtleCAtIHcgKiAwLjR9ICR7ZXl9LCAke2V4fSAke2V5fWApO1xuICAgIHN2Zy5hcHBlbmQocGF0aCk7XG4gICAgbGlzdC5hcHBlbmQoc3ZnKTtcbiAgfTtcbiAgbGV0IHNjcm9sbFJhZiA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgIGlmIChzY3JvbGxSYWYpIHJldHVybjtcbiAgICBzY3JvbGxSYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBzY3JvbGxSYWYgPSAwOyByZWRyYXdOb29kbGVzKCk7IH0pO1xuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlZHJhd05vb2RsZXMpO1xuXG4gIC8vIOKUgOKUgOKUgCBQZXItbWVzc2FnZSByZW5kZXJlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJlbmRlck1lc3NhZ2UgPSAobTogUGFuZWxNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gcmVuZGVyUGFnZShtKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4gcmVuZGVyU2VsZWN0b3IobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIHJlbmRlckZlZWRiYWNrKG0sIGxhc3RTZWxlY3RvclNlbCk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBhZ2UgPSAobTogUGFnZU1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGQuY2xhc3NOYW1lID0gJ3BhZ2UtZGl2aWRlcic7XG4gICAgZC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBjb25zdCB0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0cy5jbGFzc05hbWUgPSAndGFiLXN0YXR1cyc7XG4gICAgdHMuZGF0YXNldC51cmwgPSBtLnVybDtcbiAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHRzLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICBkLmFwcGVuZCh0cyk7XG4gICAgY29uc3QgdSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB1LmNsYXNzTmFtZSA9ICd1cmwnO1xuICAgIHUudGV4dENvbnRlbnQgPSBtLnVybDtcbiAgICB1LmRhdGFzZXQudGlwID0gYCR7bS50aXRsZSA/PyAnJ30gwrcgJHttLnVybH1gO1xuICAgIGQuYXBwZW5kKHUpO1xuICAgIGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IG9uIHRoaXMgcGFnZSBpbiB0aGUgYWN0aXZlIHRhYiwgY2xpY2tpbmcgdGhlIFVSTFxuICAgICAgLy8gc2hvdWxkbid0IHJlbG9hZCBvciBzdGVhbCBmb2N1cyDigJQgaXQgc2hvdWxkIGp1c3QgYmUgYSBuby1vcFxuICAgICAgLy8gdmlzdWFsbHkgKHRoZSByb3cgYWxyZWFkeSBpbmRpY2F0ZXMgXCJvcGVuXCIgdmlhIC50YWItc3RhdHVzKS4gVGhlXG4gICAgICAvLyB1c2VyIGNvbXBsYWluZWQgYWJvdXQgZ2V0dGluZyBmb3JjZWQgaW50byBhIG5hdmlnYXRpb24gd2hlbiB0aGV5XG4gICAgICAvLyB3ZXJlIGp1c3QgdHJ5aW5nIHRvIHJlYWQgdGhlIHJvdy5cbiAgICAgIGlmIChtLnVybCA9PT0gbGl2ZVRhYlVybCkge1xuICAgICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgb24gdGhpcyBwYWdlJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByID0gYXdhaXQgc2VuZFRvQmc8e2ZvdW5kPzogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAnc3dpdGNoLXRvLXRhYicsIHVybDogbS51cmwsIG9wZW5JZk1pc3Npbmc6IHRydWV9KTtcbiAgICAgIGlmIChyPy5mb3VuZCkgc2V0U3RhdHVzKCdTd2l0Y2hlZCB0byB0YWInKTtcbiAgICAgIGVsc2UgaWYgKHI/Lm9wZW5lZCkgc2V0U3RhdHVzKCdPcGVuZWQgaW4gbmV3IHRhYicpO1xuICAgICAgZWxzZSBzZXRTdGF0dXMoXCJDb3VsZG4ndCBvcGVuIHRhYlwiLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGQ7XG4gIH07XG5cbiAgY29uc3QgdGl0bGVGcm9tRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChlLnRlc3RJZCkgcmV0dXJuIGBbdGVzdElkPSR7ZS50ZXN0SWR9XWA7XG4gICAgaWYgKGUuaWQpIHJldHVybiBgIyR7ZS5pZH1gO1xuICAgIGlmIChlLmNsYXNzZXM/Lmxlbmd0aCkgcmV0dXJuIGAke2UudGFnfS4ke2UuY2xhc3Nlcy5zbGljZSgwLCAyKS5qb2luKCcuJyl9YDtcbiAgICByZXR1cm4gZS5zZWxlY3RvciB8fCBlLnRhZyB8fCAnKHVua25vd24pJztcbiAgfTtcblxuICAvLyBQaWNrIHRoZSBtb3N0IFwiaHVtYW5seSByZWFkYWJsZVwiIGxhYmVsIGZvciB0aGUgYnViYmxlIHByZXZpZXcuIFByZWZlcnNcbiAgLy8gdmlzaWJsZS10by11c2VyIHRleHQgaW4gdGhpcyBwcmlvcml0eTpcbiAgLy8gICAxLiBpbm5lclRleHQgLyB0ZXh0Q29udGVudCAoYGVudHJ5LnRleHRgKSDigJQgd2hhdCB0aGUgdXNlciByZWFkcyBvbiBzY3JlZW5cbiAgLy8gICAyLiBhY2Nlc3NpYmxlTmFtZSAoYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZhbGxiYWNrIGNoYWluKVxuICAvLyAgIDMuIGlucHV0IHZhbHVlIChza2lwcGVkIGlmIGl0J3MgdGhlIG1hc2tlZCBwYXNzd29yZCBwbGFjZWhvbGRlcilcbiAgLy8gICA0LiBpbnB1dCBwbGFjZWhvbGRlclxuICAvLyAgIDUuIGltZyBhbHRcbiAgLy8gICA2LiBjb21wb25lbnRSb290IChlLmcuIFwiYnV0dG9uI2N0YVwiKVxuICAvLyAgIDcuIHRpdGxlRnJvbUVudHJ5IOKAlCBsYXN0LXJlc29ydCB0YWcvY2xhc3MvaWQgZmFsbGJhY2tcbiAgLy8gQ1NTIGhhbmRsZXMgdmlzdWFsIHRydW5jYXRpb24gdmlhIHRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7IHdlIHNoaXAgdGhlXG4gIC8vIGZ1bGwgc3RyaW5nIHNvIHRoZSB0b29sdGlwIG9uIGhvdmVyIGNhbiBzaG93IHRoZSBjb21wbGV0ZSB2YWx1ZS5cbiAgY29uc3QgbmljZUxhYmVsID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXh0KSByZXR1cm4gZS50ZXh0O1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lKSByZXR1cm4gZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBjb25zdCB2ID0gZS5hdHRycz8udmFsdWU7XG4gICAgaWYgKHYgJiYgdiAhPT0gJ+KAouKAouKAouKAoicpIHJldHVybiB2O1xuICAgIGlmIChlLmF0dHJzPy5wbGFjZWhvbGRlcikgcmV0dXJuIGUuYXR0cnMucGxhY2Vob2xkZXI7XG4gICAgaWYgKGUuYXR0cnM/LmFsdCkgcmV0dXJuIGUuYXR0cnMuYWx0O1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QpIHJldHVybiBlLmNvbXBvbmVudFJvb3Q7XG4gICAgcmV0dXJuIHRpdGxlRnJvbUVudHJ5KGUpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclNlbGVjdG9yID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCB2YWxpZCA9IHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHNhbWVQYXRoID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKSA9PT0gbGl2ZVRhYlBhdGg7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgc2VsZWN0b3InO1xuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdzdGFsZScpO1xuICAgIGVsc2UgaWYgKHZhbGlkID09PSBmYWxzZSAmJiAhc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdkaWZmLXBhZ2UnKTtcbiAgICBpZiAobS5waW5uZWQpIGRpdi5jbGFzc0xpc3QuYWRkKCdwaW5uZWQnKTtcbiAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBkaXYuY2xhc3NMaXN0LmFkZCgnaGFzLWdyb3VwJyk7XG4gICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgPT09IGxhc3RBY3RpdmVTZWxlY3RvcikgZGl2LmNsYXNzTGlzdC5hZGQoJ2xhc3QtYWN0aXZlJyk7XG4gICAgLy8gQXV0by1leHBhbmQgb24gc2VhcmNoIGhpdCBzbyB0aGUgdXNlciBzZWVzIHdoZXJlIHRoZSBtYXRjaCBsYW5kZWQuXG4gICAgY29uc3QgbWF0Y2hlZEJvZHkgPSBib2R5TWF0Y2hlc1NlYXJjaChtKTtcbiAgICBpZiAobWF0Y2hlZEJvZHkpIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcsICdzZWFyY2gtaGl0Jyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5kYXRhc2V0LnNlbGVjdG9yID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAvLyBEcmFnLXRvLXJlcGFyZW50OiBldmVyeSBzZWxlY3RvciBidWJibGUgaXMgYSB2YWxpZCBkcm9wIHRhcmdldCBmb3JcbiAgICAvLyBhIGNvbW1lbnQgYmVpbmcgZHJhZ2dlZCBmcm9tIGVsc2V3aGVyZSBpbiB0aGUgc2lkZWJhci5cbiAgICB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0KGRpdiwgbSk7XG5cbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnaGVhZCc7XG4gICAgY29uc3QgY2FyZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY2FyZXQuY2xhc3NOYW1lID0gJ2NhcmV0JztcbiAgICBjYXJldC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZXZyb24tcmlnaHQnLCAxMik7XG4gICAgaGVhZC5hcHBlbmQoY2FyZXQpO1xuICAgIGNvbnN0IHBpbk1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBwaW5NYXJrZXIuY2xhc3NOYW1lID0gJ3Bpbi1tYXJrZXInO1xuICAgIHBpbk1hcmtlci5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3N0YXItZmlsbGVkJywgMTEpO1xuICAgIGhlYWQuYXBwZW5kKHBpbk1hcmtlcik7XG4gICAgY29uc3Qgc2VxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7bS5lbnRyeS5ufWA7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgc2VxLnRleHRDb250ZW50ICs9IGArJHttLmVudHJ5Lmdyb3VwLmxlbmd0aH1gO1xuICAgIGhlYWQuYXBwZW5kKHNlcSk7XG4gICAgY29uc3QgY29tcGFjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb21wYWN0LmNsYXNzTmFtZSA9ICdjb21wYWN0JztcbiAgICBjb25zdCBjb21wYWN0U3RyID0gbmljZUxhYmVsKG0uZW50cnkpO1xuICAgIGNvbXBhY3QuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goY29tcGFjdFN0ciwgc2VhcmNoUXVlcnkpO1xuICAgIC8vIFNob3cgdGhlIGZ1bGwgbGFiZWwgb24gaG92ZXIgZXZlbiB3aGVuIENTUyBlbGxpcHNpcyB0cnVuY2F0ZXMgdGhlXG4gICAgLy8gdmlzaWJsZSBwb3J0aW9uIOKAlCB1c2VmdWwgd2hlbiB0aGUgdmlzaWJsZSB0ZXh0L3BsYWNlaG9sZGVyIGlzIGxvbmcuXG4gICAgaWYgKGNvbXBhY3RTdHIubGVuZ3RoID4gMjQpIGNvbXBhY3QuZGF0YXNldC50aXAgPSBjb21wYWN0U3RyO1xuICAgIGhlYWQuYXBwZW5kKGNvbXBhY3QpO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgY29uc3QgciA9IG0uZW50cnkucmVjdDtcbiAgICBtZXRhLnRleHRDb250ZW50ID0gciA/IGAke3Iud33DlyR7ci5ofWAgOiAobS5lbnRyeS50YWcgPz8gJycpO1xuICAgIGhlYWQuYXBwZW5kKG1ldGEpO1xuICAgIGRpdi5hcHBlbmQoaGVhZCk7XG5cbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHN1bW1hcnkuY2xhc3NOYW1lID0gJ3BlZWstc3VtbWFyeSc7XG4gICAgc3VtbWFyeS5pbm5lckhUTUwgPSBgPHNwYW4gZGF0YS1pY29uPVwiYWxlcnQtY2lyY2xlXCIgZGF0YS1zaXplPVwiMTFcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInRcIj4ke2Rpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2RpZmYtcGFnZScpID8gJ2RpZmZlcmVudCBwYWdlJyA6ICdzdGFsZSd9PC9zcGFuPmA7XG4gICAgaGVhZC5hcHBlbmQoc3VtbWFyeSk7XG4gICAgbW91bnRJY29ucyhzdW1tYXJ5KTtcblxuICAgIGNvbnN0IGVyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVyci5jbGFzc05hbWUgPSAncGVlay1lcnJvcic7XG4gICAgY29uc3QgcmVhc29uID0gc2VsZWN0b3JFcnJvcnMuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHBhdGhGcm9tRW50cnkgPSBwYXRoT2YobS5lbnRyeS51cmwgPz8gJycpO1xuICAgIGVyci5pbm5lckhUTUwgPSBzYW1lUGF0aFxuICAgICAgPyBgPGI+U3RhbGU8L2I+IMK3ICR7ZXNjYXBlSHRtbChyZWFzb24gPz8gJ25vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzLicpfTxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmBcbiAgICAgIDogYENhcHR1cmVkIG9uIDxjb2RlPiR7ZXNjYXBlSHRtbChwYXRoRnJvbUVudHJ5KX08L2NvZGU+IOKAlCBjdXJyZW50IHRhYiBpcyA8Y29kZT4ke2VzY2FwZUh0bWwobGl2ZVRhYlBhdGggPz8gJycpfTwvY29kZT4uIFN3aXRjaCB0YWJzIHRvIHZhbGlkYXRlLjxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmA7XG4gICAgZGl2LmFwcGVuZChlcnIpO1xuXG4gICAgLy8gQW5jZXN0b3IgYnJlYWRjcnVtYiDigJQgUGxhc21pYy1zdHlsZSBlc2NhbGF0b3IuIENoaXBzIGZvciBlYWNoIGVudHJ5IGluXG4gICAgLy8gZW50cnkuYW5jZXN0b3JzIChjbG9zZXN0IGZpcnN0KS4gQ2xpY2sgYSBjaGlwIHRvIGNhcHR1cmUgdGhhdFxuICAgIC8vIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2UgKGRlcHRoID0gY2hpcCBpbmRleCArIDEgc2luY2UgdGhlIGVudHJ5J3NcbiAgICAvLyBvd24gc2VsZWN0b3IgaXMgZGVwdGggMCkuIEJyaWdodG5lc3MgZ3JhZGllbnQgZGFya2VucyBkZWVwZXIgY2hpcHMuXG4gICAgaWYgKG0uZW50cnkuYW5jZXN0b3JzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNydW1icyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY3J1bWJzLmNsYXNzTmFtZSA9ICdhbmNlc3Rvci1jcnVtYnMnO1xuICAgICAgY3J1bWJzLmRhdGFzZXQudGlwID0gJ0NsaWNrIGEgY3J1bWIgdG8gZXNjYWxhdGUgdGhlIGNhcHR1cmUgdG8gYW4gYW5jZXN0b3IgZWxlbWVudCc7XG4gICAgICBtLmVudHJ5LmFuY2VzdG9ycy5mb3JFYWNoKChhbmMsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBjaGlwLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgY2hpcC5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY2hpcCc7XG4gICAgICAgIC8vIEJyaWdodG5lc3MgZ3JhZGllbnQ6IGRlZXBlciBjaGlwcyBnZXQgcHJvZ3Jlc3NpdmVseSBkaW1tZXIuXG4gICAgICAgIGNoaXAuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHsoMSAtIGkgKiAwLjA4KS50b0ZpeGVkKDIpfSlgO1xuICAgICAgICBjb25zdCBsYWJlbCA9IGFuYy50ZXN0SWQgPyBgWyR7YW5jLnRlc3RJZH1dYFxuICAgICAgICAgIDogYW5jLmlkID8gYCMke2FuYy5pZH1gXG4gICAgICAgICAgOiBhbmMuY2xhc3Nlcz8ubGVuZ3RoID8gYCR7YW5jLnRhZ30uJHthbmMuY2xhc3Nlc1swXX1gXG4gICAgICAgICAgOiBhbmMudGFnO1xuICAgICAgICBjaGlwLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNoaXAuZGF0YXNldC50aXAgPSBgQ2FwdHVyZSB0aGUgYW5jZXN0b3IgJHtpICsgMX0gbGV2ZWwke2kgPyAncycgOiAnJ30gdXAgwrcgJHthbmMudGFnfSR7YW5jLmlkID8gJyMnICsgYW5jLmlkIDogJyd9YDtcbiAgICAgICAgLy8gSG92ZXItcHJldmlldyB0aGUgYW5jZXN0b3Igb24gdGhlIGxpdmUgcGFnZSBzbyB0aGUgdXNlciBjYW4gc2VlXG4gICAgICAgIC8vIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY29tbWl0dGluZy4gTWlycm9ycyBob3dcbiAgICAgICAgLy8gaG92ZXJpbmcgYSBzZWxlY3RvciBidWJibGUgcGFpbnRzIGl0cyByaW5nLiBDbGVhcmluZyBvblxuICAgICAgICAvLyBtb3VzZWxlYXZlIHN3YXBzIGJhY2sgdG8gdGhlIGJ1YmJsZSdzIG93biBvdXRsaW5lICh0aGUgYnViYmxlJ3NcbiAgICAgICAgLy8gbW91c2VlbnRlciBoYW5kbGVyIHBhaW50ZWQgaXQ7IGxlYXZpbmcgdGhlIGNoaXAganVzdCByZW1vdmVzXG4gICAgICAgIC8vIHRoZSBvdmVycmlkZSkuXG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDF9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAvLyBSZS1wYWludCB0aGUgYnViYmxlJ3Mgb3duIHJpbmcgcmF0aGVyIHRoYW4gY2xlYXJpbmcgZW50aXJlbHlcbiAgICAgICAgICAvLyBzbyB0aGUgdXNlciBkb2Vzbid0IHNlZSBhIGZsaWNrZXIgb2YgXCJub3RoaW5nXCIgYmV0d2VlbiBjaGlwcy5cbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtcbiAgICAgICAgICAgIGtpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGRlcHRoOiBpICsgMSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAocmVwbHk/Lm9rKSBzZXRTdGF0dXMoYENhcHR1cmVkIGFuY2VzdG9yICR7YW5jLnRhZ31gKTtcbiAgICAgICAgICBlbHNlIHNldFN0YXR1cygnQ291bGQgbm90IGNhcHR1cmUgYW5jZXN0b3InLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjcnVtYnMuYXBwZW5kKGNoaXApO1xuICAgICAgfSk7XG4gICAgICBkaXYuYXBwZW5kKGNydW1icyk7XG4gICAgfVxuXG4gICAgLy8gUHJldmlldyB0aWxlIOKAlCBvbmx5IHdoZW4gd2UgaGF2ZSBhIHRodW1ibmFpbCBkYXRhVXJsIGluIHRoZSBpbi1tZW1vcnlcbiAgICAvLyBzaG90cyBtYXAuIFRoZSBmdWxsIFBORyBsaXZlcyBvbiBkaXNrIHVuZGVyIC5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy87XG4gICAgLy8gdGhlIGRhdGFVcmwgaXMganVzdCBhIHNpZGUtcGFuZWwtZnJpZW5kbHkgZG93bnNjYWxlICjiiaQzMjBweCB3aWRlKS5cbiAgICBjb25zdCBzaG90RGF0YVVybCA9IHNob3RzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBpZiAoc2hvdERhdGFVcmwpIHtcbiAgICAgIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXcuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBpbWcuY2xhc3NOYW1lID0gJ3Nob3QnO1xuICAgICAgaW1nLnNyYyA9IHNob3REYXRhVXJsO1xuICAgICAgaW1nLmFsdCA9IGBTY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gO1xuICAgICAgcHJldmlldy5hcHBlbmQoaW1nKTtcbiAgICAgIGRpdi5hcHBlbmQocHJldmlldyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0cy5jbGFzc05hbWUgPSAnZW50LXN0YXRzJztcbiAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgIGNvbnN0IG15VG9rZW5zID0gdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtLmVudHJ5KSk7XG4gICAgY29uc3QgdG90YWxUb2tlbnMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobW0pOiBtbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5yZWR1Y2UoKHMsIG1tKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtbS5lbnRyeSkpLCAwKTtcbiAgICBjb25zdCBzaGFyZVBjdCA9IHRvdGFsVG9rZW5zID4gMCA/IE1hdGgucm91bmQoKG15VG9rZW5zIC8gdG90YWxUb2tlbnMpICogMTAwKSA6IDA7XG4gICAgY29uc3QgZ3JvdXBDb3VudCA9IG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGdyb3VwVG9rZW5zID0gKG0uZW50cnkuZ3JvdXAgPz8gW10pLnJlZHVjZSgocywgZykgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkoZykpLCAwKTtcbiAgICB0eXBlIFN0YXRDZWxsID0ge2xhYmVsOiBzdHJpbmc7IHZhbHVlOiBzdHJpbmc7IHRpcDogc3RyaW5nfTtcbiAgICBjb25zdCBjZWxsczogU3RhdENlbGxbXSA9IFtcbiAgICAgIHtsYWJlbDogJ0hUTUwnLCB2YWx1ZTogYCR7bS5lbnRyeS5vdXRlckhUTUw/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ091dGVyIEhUTUwgY2hhciBsZW5ndGgnfSxcbiAgICAgIHtsYWJlbDogJ1Rva2VucycsIHZhbHVlOiBgJHtteVRva2Vuc31gLCB0aXA6ICdBcHByb3ggTExNIHRva2VucyBmb3IgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnU2hhcmUnLCB2YWx1ZTogYCR7c2hhcmVQY3R9JWAsIHRpcDogJ1Rva2VuIHNoYXJlIG9mIGFsbCBzZWxlY3RvcnMnfSxcbiAgICAgIHtsYWJlbDogJ0NvbW1lbnRzJywgdmFsdWU6IGAke2ZiLmxlbmd0aH1gLCB0aXA6ICdJbmxpbmUgY29tbWVudHMgdGhyZWFkZWQgdW5kZXIgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnUnVsZXMnLCB2YWx1ZTogYCR7bS5lbnRyeS5tYXRjaGVkUnVsZXM/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ01hdGNoZWQgQ1NTIHJ1bGVzJ30sXG4gICAgICB7bGFiZWw6ICdTdHlsZXMnLCB2YWx1ZTogYCR7T2JqZWN0LmtleXMobS5lbnRyeS5zdHlsZXMgPz8ge30pLmxlbmd0aH1gLCB0aXA6ICdDb21wdXRlZC1zdHlsZSBmaWVsZHMga2VwdCd9LFxuICAgIF07XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAnLCB2YWx1ZTogYCR7Z3JvdXBDb3VudH1gLCB0aXA6ICdNZW1iZXJzIGZvbGRlZCBpbnRvIHRoaXMgZ3JvdXAnfSk7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwIFQnLCB2YWx1ZTogYCR7Z3JvdXBUb2tlbnN9YCwgdGlwOiAnVG9rZW5zIGNvbnRyaWJ1dGVkIGJ5IGdyb3VwIG1lbWJlcnMnfSk7XG4gICAgfVxuICAgIHN0YXRzLmlubmVySFRNTCA9IGNlbGxzLm1hcCgoYykgPT5cbiAgICAgIGA8c3BhbiBjbGFzcz1cImVudC1zdGF0XCIgZGF0YS10aXA9XCIke2VzY2FwZUh0bWwoYy50aXApfVwiPjxzcGFuIGNsYXNzPVwibGJsXCI+JHtjLmxhYmVsfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbFwiPiR7Yy52YWx1ZX08L3NwYW4+PC9zcGFuPmAsXG4gICAgKS5qb2luKCcnKTtcbiAgICBkaXYuYXBwZW5kKHN0YXRzKTtcblxuICAgIC8vIOKUgOKUgCBKU09OIHBhbmUgd2l0aCB0b29sYmFyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vIFRvb2xiYXIgYWJvdmUgdGhlIEpTT04gYm9keTogbGVmdCA9IGxpbmUtd3JhcCB0b2dnbGUsIHJpZ2h0ID0gY29weS5cbiAgICAvLyBUaGUgSlNPTiBpdHNlbGYgcmVmbGVjdHMgdGhlIGdsb2JhbCBgbWluaWZ5YCBzZXR0aW5nIHNvIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgc2FtZSBzaGFwZSB0aGF0IHdpbGwgZW5kIHVwIGluIHRoZSBleHBvcnQuXG4gICAgY29uc3QganNvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uV3JhcC5jbGFzc05hbWUgPSAnYm9keS1qc29uLXdyYXAnO1xuICAgIGNvbnN0IGpzb25CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uQmFyLmNsYXNzTmFtZSA9ICdib2R5LWpzb24tYmFyJztcblxuICAgIC8vIExpbmUtd3JhcCBjaGVja2JveCAocGVyLWJ1YmJsZSBsb2NhbCBzdGF0ZSwgZGVmYXVsdCBPTikuXG4gICAgY29uc3Qgd3JhcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB3cmFwTGFiZWwuY2xhc3NOYW1lID0gJ2pzb24td3JhcC10b2dnbGUnO1xuICAgIHdyYXBMYWJlbC5kYXRhc2V0LnRpcCA9ICdXcmFwIGxvbmcgbGluZXMgaW5zdGVhZCBvZiBob3Jpem9udGFsIHNjcm9sbCc7XG4gICAgY29uc3Qgd3JhcENoZWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB3cmFwQ2hlY2sudHlwZSA9ICdjaGVja2JveCc7XG4gICAgd3JhcENoZWNrLmNoZWNrZWQgPSB0cnVlO1xuICAgIHdyYXBMYWJlbC5hcHBlbmQod3JhcENoZWNrLCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIFdyYXAnKSk7XG4gICAganNvbkJhci5hcHBlbmQod3JhcExhYmVsKTtcblxuICAgIC8vIENvcHkgYnV0dG9uIChtaXJyb3JzIHRoZSBcIkNvcHkgdGhpcyBjYXB0dXJlIGFzIEpTT05cIiBhY3Rpb24gYmVsb3csXG4gICAgLy8gc3VyZmFjZWQgYXQgdGhlIHRvcCBzbyB0aGUgdXNlciBkb2Vzbid0IGhhdmUgdG8gc2Nyb2xsIHBhc3QgdGhlIEpTT05cbiAgICAvLyB0byBmaW5kIGl0KS5cbiAgICBjb25zdCBjb3B5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29weUJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgY29weUJ0bi5jbGFzc05hbWUgPSAnaWNvbmJ0biBqc29uLWNvcHknO1xuICAgIGNvcHlCdG4uZGF0YXNldC50aXAgPSAnQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTic7XG4gICAgY29weUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ29weSBjYXB0dXJlIGFzIEpTT04nKTtcbiAgICBjb3B5QnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY29weScsIDEzKTtcbiAgICBjb3B5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAvLyBIb25vciB0aGUgc2FtZSBzaGFwZSB0aGUgSlNPTiBiZWxvdyBzaG93cy5cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBwcmVmcy5taW5pZnkgPyBzbGltRW50cnkobS5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZX0pIDogbS5lbnRyeTtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIHByZWZzLm1pbmlmeSA/IDAgOiAyKSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBKU09OJyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgSlNPTicsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSk7XG4gICAganNvbkJhci5hcHBlbmQoY29weUJ0bik7XG4gICAganNvbldyYXAuYXBwZW5kKGpzb25CYXIpO1xuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvZHkuY2xhc3NOYW1lID0gJ2JvZHktanNvbiB3cmFwLW9uJztcbiAgICAvLyBSZWZsZWN0IHRoZSBtaW5pZnkgcHJlZjogd2hlbiBtaW5pZmllZCwgc2hvdyB0aGUgc2xpbUVudHJ5LXNoYXBlZFxuICAgIC8vIGV4cG9ydCBmb3JtIChjb21wYWN0LCBzaW5nbGUtbGluZSkuIE90aGVyd2lzZSBwcmV0dHktcHJpbnQgdGhlIGZ1bGxcbiAgICAvLyBlbnRyeSBzbyBpdCdzIHJlYWRhYmxlLlxuICAgIGNvbnN0IHJlbmRlckpzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0gcHJlZnMubWluaWZ5ID8gc2xpbUVudHJ5KG0uZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWV9KSA6IG0uZW50cnk7XG4gICAgICBjb25zdCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgcHJlZnMubWluaWZ5ID8gMCA6IDIpO1xuICAgICAgYm9keS5pbm5lckhUTUwgPSBoaWdobGlnaHRKc29uKHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG5cbiAgICAgIH0gZWxzZSBzZXRTdGF0dXMoJ1JlLWNhcHR1cmUgZmFpbGVkJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTicsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KEpTT04uc3RyaW5naWZ5KG0uZW50cnkpKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGVudHJ5Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgZW50cnknLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJGZWVkYmFjayA9IChtOiBGZWVkYmFja01lc3NhZ2UsIGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayc7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChtLnRleHQsIHNlYXJjaFF1ZXJ5KTtcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSB7XG4gICAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgc2VsZWN0b3Ig4oCUIHByZWZlciBwYXJlbnRVaWQgKHRoZSBwZXJzaXN0ZWQgRkspXG4gICAgICAvLyBvdmVyIGNhcHR1cmUtYWRqYWNlbmN5LCBzaW5jZSBkcmFnLXRvLXJlcGFyZW50IG1vdmVzIHRoZSBjaGlwIGJ1dFxuICAgICAgLy8gdGhlIHRyYWlsaW5nLXNlbGVjdG9yIGhldXJpc3RpYyBnaXZlcyBzdGFsZSByZXN1bHRzIHVudGlsIHJlbmRlclxuICAgICAgLy8gc2V0dGxlcy4gVGhlIGFubm90YXRpb24gb3ZlcmxheSBuZWVkcyB0aGUgcGFyZW50J3Mgc2VsZWN0b3IgdG9cbiAgICAgIC8vIGFuY2hvciB0aGUgb24tcGFnZSB0b29sdGlwLlxuICAgICAgY29uc3Qge3BhcmVudFNlbCwgcGFyZW50VWlkfSA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkge1xuICAgICAgICAgIGNvbnN0IHAgPSBtZXNzYWdlcy5maW5kKFxuICAgICAgICAgICAgKG1tKSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InICYmIChtbSBhcyBTZWxlY3Rvck1lc3NhZ2UpLmVudHJ5LnVpZCA9PT0gbS5wYXJlbnRVaWQsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAocCAmJiBwLnR5cGUgPT09ICdzZWxlY3RvcicpIHJldHVybiB7cGFyZW50U2VsOiBwLmVudHJ5LnNlbGVjdG9yLCBwYXJlbnRVaWQ6IHAuZW50cnkudWlkfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3BhcmVudFNlbDogbGFzdFNlbGVjdG9yU2VsLCBwYXJlbnRVaWQ6IHVuZGVmaW5lZCBhcyBzdHJpbmcgfCB1bmRlZmluZWR9O1xuICAgICAgfSkoKTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogcGFyZW50U2VsLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIC8vIFNjcm9sbCB0aGUgcGFyZW50IGVsZW1lbnQgaW50byB2aWV3ICsgc2hvdyB0aGUgb24tcGFnZVxuICAgICAgICAvLyBhbm5vdGF0aW9uIHRvb2x0aXAgcmVuZGVyaW5nIFRISVMgY29tbWVudCdzIHRleHQuIFBhc3MgdGhlXG4gICAgICAgIC8vIHBhcmVudCdzIHVpZCBzbyBhIHNhbWUtc2VsZWN0b3Igc2libGluZyBjYXB0dXJlIGRvZXNuJ3QgZ2V0XG4gICAgICAgIC8vIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBcInRoZSBzYW1lIHRhcmdldFwiIGJ5IHRoZSBjb250ZW50XG4gICAgICAgIC8vIHNjcmlwdCdzIGFubm90YXRpb24gb3ZlcmxheS5cbiAgICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHtcbiAgICAgICAgICBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRUb0NTKHtcbiAgICAgICAgICBraW5kOiAnYW5ub3RhdGlvbicsXG4gICAgICAgICAgc2VsZWN0b3I6IHBhcmVudFNlbCxcbiAgICAgICAgICBwYXlsb2FkOiB7c2VsZWN0b3I6IHBhcmVudFNlbCwgdWlkOiBwYXJlbnRVaWQsIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFjazogW20udGV4dF19LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ30pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGRpdi5kYXRhc2V0LmNvbW1lbnRJZCA9IG0uaWQ7XG4gICAgY29uc3QgYmVnaW5Db21tZW50RHJhZyA9IChlOiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnLCBtLmlkKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCd0ZXh0L3BsYWluJywgbS50ZXh0KTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICB9O1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICBjb25zdCBkcmFnSGFuZGxlID0gYWN0aW9uQnRuKCdncmlwJywgJ0RyYWcgdGhpcyBoYW5kbGUgb250byBhIHNlbGVjdG9yIHRvIHJlcGFyZW50JywgKCkgPT4geyAvKiBkcmFnIGhhbmRsZSBvbmx5ICovIH0pO1xuICAgIGRyYWdIYW5kbGUuY2xhc3NMaXN0LmFkZCgnZHJhZy1oYW5kbGUnKTtcbiAgICBkcmFnSGFuZGxlLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBiZWdpbkNvbW1lbnREcmFnKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkcmFnSGFuZGxlKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSBjb21tZW50IHRleHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChtLnRleHQpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY29tbWVudCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNvbW1lbnQnKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdwZW5jaWwnLCAnRWRpdCBjb21tZW50JywgKCkgPT4gZW50ZXJGZWVkYmFja0VkaXQoZGl2LCBtKSwge3NpemU6IDE1fSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIC8vIERyb3AgaGFuZGxlciBzaGFyZWQgYnkgZXZlcnkgc2VsZWN0b3IgYnViYmxlLiBBY2NlcHRzIGEgZHJhZ2dlZFxuICAvLyBjb21tZW50IElEIHZpYSB0aGUgYGFwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnRgIE1JTUUsIHVwZGF0ZXNcbiAgLy8gcGFyZW50VWlkICsgYWRqYWNlbmN5LCBwZXJzaXN0cywgcmUtcmVuZGVycy5cbiAgY29uc3Qgd2lyZVNlbGVjdG9yRHJvcFRhcmdldCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBTZWxlY3Rvck1lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgICAgY29uc3QgdHlwZXMgPSBlLmRhdGFUcmFuc2Zlcj8udHlwZXM7XG4gICAgICBpZiAoIXR5cGVzIHx8ICFBcnJheS5mcm9tKHR5cGVzKS5pbmNsdWRlcygnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJvcC10YXJnZXQnKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0JykpO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpO1xuICAgICAgY29uc3QgaWQgPSBlLmRhdGFUcmFuc2Zlcj8uZ2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpO1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3JjSWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IGlkKTtcbiAgICAgIGlmIChzcmNJZHggPCAwKSByZXR1cm47XG4gICAgICBjb25zdCBzcmMgPSBtZXNzYWdlc1tzcmNJZHhdISBhcyBGZWVkYmFja01lc3NhZ2U7XG4gICAgICBpZiAoc3JjLnR5cGUgIT09ICdmZWVkYmFjaycpIHJldHVybjtcbiAgICAgIGNvbnN0IGRzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGlmIChkc3RJZHggPCAwKSByZXR1cm47XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgLy8gVXBkYXRlIHRoZSBGSyBwb2ludGVyIGZpcnN0IOKAlCB0aGF0J3MgdGhlIHNvdXJjZSBvZiB0cnV0aCBpblxuICAgICAgLy8gZXhwb3J0cy4gQWRqYWNlbmN5IGlzIGp1c3QgYSByZW5kZXIgY29udmVuaWVuY2UuXG4gICAgICBzcmMucGFyZW50VWlkID0gbS5lbnRyeS51aWQ7XG4gICAgICAvLyBTcGxpY2Ugc3JjIG91dCBvZiBpdHMgY3VycmVudCBzbG90IGFuZCByZS1pbnNlcnQgcmlnaHQgYWZ0ZXIgdGhlXG4gICAgICAvLyBuZXcgcGFyZW50IChhbmQgYW55IGZlZWRiYWNrIGFscmVhZHkgdHJhaWxpbmcgaXQsIHNvIHRoZSBtb3N0LVxuICAgICAgLy8gcmVjZW50IGZlZWRiYWNrIGVuZHMgdXAgbmVhcmVzdCB0aGUgcGFyZW50IHZpc3VhbGx5KS5cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShzcmNJZHgsIDEpO1xuICAgICAgY29uc3QgbmV3RHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgbGV0IGluc2VydEF0ID0gbmV3RHN0SWR4ICsgMTtcbiAgICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0hLnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHNyYyk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCByZXBhcmVudGVkJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdHlwZSBBY3Rpb25CdG5PcHRzID0ge3dhcm4/OiBib29sZWFuOyB0b2dnbGVkPzogYm9vbGVhbjsgc2l6ZT86IG51bWJlcn07XG4gIGNvbnN0IGFjdGlvbkJ0biA9IChpY29uOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGZuOiAoKSA9PiB2b2lkLCBvcHRzOiBBY3Rpb25CdG5PcHRzID0ge30pOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuZGF0YXNldC50aXAgPSB0aXRsZTtcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRpdGxlKTtcbiAgICBpZiAob3B0cy53YXJuKSBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBpZiAob3B0cy50b2dnbGVkKSBiLmNsYXNzTGlzdC5hZGQoJ3RvZ2dsZWQnKTtcbiAgICAvLyBEZWZhdWx0IGljb24gc2l6ZSAxMyByZWFkcyBzbGlnaHRseSBzbWFsbCBpbiBhIDIyw5cyMiBidXR0b24g4oCUIGZpbmVcbiAgICAvLyBmb3IgaWNvbnMgd2l0aCBzaW1wbGUgc2hhcGVzIChjcm9zc2hhaXIsIGxpc3QtdHJlZSwgdW5kbykgYnV0IHZpc2libHlcbiAgICAvLyBzcXVlZXplZCBmb3IgYG1lc3NhZ2Utc3F1YXJlLXBsdXNgIGFuZCBgcGVuY2lsYCwgd2hlcmUgdGhlXG4gICAgLy8gaW50ZXJpb3Igc3Ryb2tlcyB2YW5pc2ggaW50byBoYWlybGluZSBibHVyLiBDYWxsZXJzIGNhbiBidW1wIHdpdGhcbiAgICAvLyBgc2l6ZTogMTVgIGZvciB0aG9zZS5cbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhpY29uLCBvcHRzLnNpemUgPz8gMTMpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBmbigpOyB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBkZWxldGVCdG4gPSAob25Db25maXJtOiAoKSA9PiB2b2lkKTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBiLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSc7XG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMyk7XG4gICAgbGV0IHBhcmVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmV2ZXJ0VGltZXIgPSAwO1xuICAgIGNvbnN0IHJldmVydCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGFyZW50KSByZXR1cm47XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb25maXJtLXllcywgLmNvbmZpcm0tbm8nKSkgbi5yZW1vdmUoKTtcbiAgICAgIGlmICghYi5wYXJlbnRFbGVtZW50KSBwYXJlbnQuYXBwZW5kKGIpO1xuICAgICAgY2xlYXJUaW1lb3V0KHJldmVydFRpbWVyKTtcbiAgICB9O1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHBhcmVudCA9IGIucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgeWVzLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIHllcy5jbGFzc05hbWUgPSAnY29uZmlybS15ZXMnO1xuICAgICAgeWVzLmRhdGFzZXQudGlwID0gJ0NvbmZpcm0gZGVsZXRlJztcbiAgICAgIHllcy5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMTMpO1xuICAgICAgeWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgb25Db25maXJtKCk7IH0pO1xuICAgICAgY29uc3Qgbm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIG5vLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIG5vLmNsYXNzTmFtZSA9ICdjb25maXJtLW5vJztcbiAgICAgIG5vLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBkZWxldGUnO1xuICAgICAgbm8uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgICAgbm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyB9KTtcbiAgICAgIGIucmVwbGFjZVdpdGgoeWVzKTtcbiAgICAgIHllcy5hZnRlcihubyk7XG4gICAgICByZXZlcnRUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHJldmVydCwgODAwMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZW50ZXJGZWVkYmFja0VkaXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogRmVlZGJhY2tNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5leHQuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayBlZGl0aW5nJztcbiAgICBpZiAoZGl2LmNsYXNzTGlzdC5jb250YWlucygndGhyZWFkZWQnKSkgbmV4dC5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIG5leHQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgbmV4dC5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgIGluaXRpYWw6IG0udGV4dCxcbiAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGRpdi5yZXBsYWNlV2l0aChkaXYuY2xvbmVOb2RlKHRydWUpKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvblN1Ym1pdDogKHRleHQpID0+IHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkID09PSBtLnRleHQpIHsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLnRleHQgPSB0cmltbWVkO1xuICAgICAgICAvLyBTZXZlcml0eSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFVJLiBTdHJpcCBhbnkgbGVnYWN5IHZhbHVlXG4gICAgICAgIC8vIHRoYXQgY2FtZSBiYWNrIGZyb20gYW4gb2xkZXIgSlNPTkwgaW1wb3J0IHNvIHNhdmVzIGRvbid0IGtlZXBcbiAgICAgICAgLy8gcmUtZW1pdHRpbmcgaXQuXG4gICAgICAgIGRlbGV0ZSAobSBhcyBhbnkpLnNldmVyaXR5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICB9KSk7XG4gICAgZGl2LnJlcGxhY2VXaXRoKG5leHQpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZU1lc3NhZ2UgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5pZCAhPT0gaWQpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0RlbGV0ZWQnKTtcbiAgICB9O1xuICAgIGlmICghZWwpIHsgZmluaXNoKCk7IHJldHVybjsgfVxuICAgIGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdyZW1vdmluZycpO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpOiB2b2lkID0+IHsgaWYgKGRvbmUpIHJldHVybjsgZG9uZSA9IHRydWU7IGZpbmlzaCgpOyB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBjbGVhbnVwLCB7b25jZTogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoY2xlYW51cCwgMzgwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQ29tcG9zZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRGZWVkYmFjayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gY29tcG9zZXIudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBpbi1tZW1vcnkgbWVzc2FnZSBhdCBjcmVhdGlvbiB0aW1lIHNvIHRoZVxuICAgIC8vIEZLIGlzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoLiBUaGUgc2xpbSBlbWl0IG5vIGxvbmdlciBoYXMgdG9cbiAgICAvLyBpbmZlciB0aGUgcGFyZW50IGZyb20gY2FwdHVyZS1hZGphY2VuY3ksIGFuZCBgbWFuaWZlc3QuY291bnRzYFxuICAgIC8vIGFjY3VyYXRlbHkgcmVmbGVjdHMgZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMuXG4gICAgLy8gV2FsayBiYWNrIHRvIHRoZSBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3RvciBiZWZvcmUgc3BsaWNlLlxuICAgIGxldCBwSWR4ID0gcG9zaXRpb24gLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfSk7XG4gICAgY29tcG9zZXIudmFsdWUgPSAnJztcbiAgICB1cGRhdGVDb21wb3Nlck1ldGVyKCk7XG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7IHNlYXJjaFF1ZXJ5ID0gJyc7IHNlYXJjaC52YWx1ZSA9ICcnOyB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnU2VudCcpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgLy8gQnVnICMyOiBmZWVkYmFjaydzIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAhcGFyZW50LmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudCBhcyBTZWxlY3Rvck1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgKGUpID0+IHtcbiAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIoKTtcbiAgICAgIGlmICghaGFuZGxlZCkgc2VuZEZlZWRiYWNrKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlQ29tcG9zZXJNZXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ID0gY29tcG9zZXIudmFsdWU7XG4gICAgY29tcFdvcmRzLnRleHRDb250ZW50ID0gU3RyaW5nKHdvcmRDb3VudCh0KSk7XG4gICAgY29tcFRva2Vucy50ZXh0Q29udGVudCA9IFN0cmluZyh0b2tlbkNvdW50KHQpKTtcbiAgICBjb21wb3Nlci5jbGFzc0xpc3QudG9nZ2xlKCdjbWQtbW9kZScsIC9ePi8udGVzdCh0LnRyaW0oKSkpO1xuICB9O1xuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHVwZGF0ZUNvbXBvc2VyTWV0ZXIpO1xuXG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcbiAgICBzZWFyY2hRdWVyeSA9IHNlYXJjaC52YWx1ZS50cmltKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgLy8gQnJpbmcgdGhlIGZpcnN0IG1hdGNoZWQgYnViYmxlICsgaXRzIGZpcnN0IDxtYXJrPiBpbnRvIHZpZXcsIHNvIHRoZVxuICAgIC8vIHVzZXIgc2VlcyB3aGVyZSB0aGUgaGl0IGlzIHdpdGhvdXQgc2Nyb2xsaW5nIG1hbnVhbGx5LlxuICAgIGlmIChzZWFyY2hRdWVyeSkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlyc3RIaXQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnLnNlbGVjdG9yLnNlYXJjaC1oaXQnKTtcbiAgICAgICAgaWYgKGZpcnN0SGl0KSB7XG4gICAgICAgICAgZmlyc3RIaXQuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInfSk7XG4gICAgICAgICAgY29uc3QgbWsgPSBmaXJzdEhpdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignbWFyaycpO1xuICAgICAgICAgIG1rPy5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcid9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBmaXJzdE1hdGNoID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZyBtYXJrJyk7XG4gICAgICAgICAgZmlyc3RNYXRjaD8uc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHsgaWYgKHBhbGV0dGUuaGlkZGVuKSBvcGVuUGFsZXR0ZShzZWFyY2gudmFsdWUgfHwgJycpOyB9KTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpZiAocGFsZXR0ZS5oaWRkZW4pIG9wZW5QYWxldHRlKHNlYXJjaC52YWx1ZSB8fCAnJyk7IH0pO1xuICAkKCdbZGF0YS1zZWFyY2gtY2xlYXJdJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IHNlYXJjaC52YWx1ZSA9ICcnOyBzZWFyY2hRdWVyeSA9ICcnOyByZW5kZXIoKTsgfSk7XG5cbiAgY29uc3QgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlciA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICBjb25zdCBtID0gL14+XFxzKiguKykkLy5leGVjKGNvbXBvc2VyLnZhbHVlLnRyaW0oKSk7XG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3Qgc2VsID0gbVsxXSEudHJpbSgpO1xuICAgIGlmICghc2VsKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e29rOiBib29sZWFufT4oe2tpbmQ6ICdtYW51YWwtY2FwdHVyZScsIHNlbGVjdG9yOiBzZWx9KTtcbiAgICBpZiAocmVwbHk/Lm9rKSB7IGNvbXBvc2VyLnZhbHVlID0gJyc7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgc2V0U3RhdHVzKCdDYXB0dXJlZCAnICsgc2VsKTsgfVxuICAgIGVsc2Ugc2V0U3RhdHVzKCdTZWxlY3RvciBkaWQgbm90IG1hdGNoOiAnICsgc2VsLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydCBidWlsZGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gdjIgZXhwb3J0IHNoYXBlOiB0b3AgbGV2ZWwga2VlcHMgdXNlci1mYWNpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzXG4gIC8vICh1aWQsIG4sIHNlbGVjdG9yLCB0ZXh0LCByb2xlLCBhdHRycywgaGludHMsIGNsYXNzZXMsIHN0eWxlcywgY29tcG9uZW50LFxuICAvLyBzdGF0ZXMsIHNjcmVlbnNob3QsIGdyb3VwKS4gRGlhZ25vc3RpYyAvIGRldGVjdGlvbiBtZXRhZGF0YSBtb3ZlcyB1bmRlclxuICAvLyBhbiBgX2F1ZGl0YCBuYW1lc3BhY2UgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwgaW5TaGFkb3dET00sXG4gIC8vIHBzZXVkb0VsZW1lbnRzLCBtYXRjaGVkUnVsZXMsIHZpZXdwb3J0KS4gVGhlIHZlcnNpb24gbWFya2VyIGlzIGVtaXR0ZWRcbiAgLy8gYXMgYHY6IDJgLiBJbXBvcnRlcnMgZGV0ZWN0IGVpdGhlciB2MSAoZmxhdCkgb3IgdjIgYW5kIGRlbm9ybWFsaXplLlxuICAvL1xuICAvLyBBZ2dyZXNzaXZlIG1pbmlmeSBhZGRpdGlvbmFsbHkgZHJvcHMgZmllbGRzIHRoZSBzZWxlY3RvciBhbHJlYWR5XG4gIC8vIGltcGxpZXM6IGFuY2VzdG9ycywgdmlld3BvcnQgKG9uZSBwZXIgcGFnZSksIGNvbXBvbmVudFJvb3Qgd2hlblxuICAvLyByZWR1bmRhbnQgd2l0aCB0aGUgc2VsZWN0b3IsIGFuZCBwc2V1ZG9FbGVtZW50cy5cbiAgY29uc3Qgc2xpbUVudHJ5ID0gKGU6IEVudHJ5LCBvcHRzOiB7aW5jbHVkZUdyb3VwPzogYm9vbGVhbjsgZXZlbnRJbmRleD86IG51bWJlcjsgdmlzdWFsT3JkZXI/OiBudW1iZXI7IGdyb3VwVWlkPzogc3RyaW5nfSA9IHt9KTogUmVjb3JkPHN0cmluZywgYW55PiA9PiB7XG4gICAgY29uc3QgaW5jbHVkZU91dGVyID0gcHJlZnMuaW5jbHVkZU91dGVySFRNTDtcbiAgICBjb25zdCBpbmNsdWRlTWF0Y2hlZCA9IHByZWZzLmluY2x1ZGVNYXRjaGVkUnVsZXM7XG4gICAgY29uc3QgaW5jbHVkZVN0eWxlcyA9IHByZWZzLmluY2x1ZGVTdHlsZXM7XG4gICAgY29uc3QgbWluaWZ5ID0gcHJlZnMubWluaWZ5O1xuXG4gICAgLy8gVG9wLWxldmVsIHVzZXItZmFjaW5nIGZpZWxkcy4gT3JkZXIgbWF0dGVycyBmb3Igb3V0cHV0IHJlYWRhYmlsaXR5IOKAlFxuICAgIC8vIHdlIHdhbnQgYHYgLyB0eXBlIC8gdWlkIC8gbiAvIHNlbGVjdG9yYCBmaXJzdCBzbyBKU09OTCBpcyBncmVwcGFibGUuXG4gICAgLy9cbiAgICAvLyBgbmAgc3RheXMgYXMgdGhlIGNhcHR1cmUtc2VxdWVuY2UgZGlzcGxheSBsYWJlbCBmb3IgYmFja3dhcmRzXG4gICAgLy8gY29tcGF0aWJpbGl0eSB3aXRoIHYxL3YyIHJlYWRlcnMgKGFuZCB0aGUgc2lkZWJhcidzIFwiIzNcIiBjaGlwcykuXG4gICAgLy8gVGhlIGRpc2FtYmlndWF0ZWQgY291c2lucyAoYGNhcHR1cmVJbmRleGAsIGBldmVudEluZGV4YCxcbiAgICAvLyBgdmlzdWFsT3JkZXJgLCBgZGlzcGxheUxhYmVsYCkgbGl2ZSBvbiB0aGUgcm93IHNvIGEgZG93bnN0cmVhbVxuICAgIC8vIGFnZW50IGNhbiBwaWNrIHdoaWNoZXZlciBvcmRlcmluZyBpcyBtZWFuaW5nZnVsIOKAlCBidWcgIzEwLlxuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHY6IDIsXG4gICAgICB0eXBlOiAnc2VsZWN0b3InLFxuICAgICAgdWlkOiBlLnVpZCxcbiAgICAgIG46IGUubixcbiAgICAgIHRzOiBlLnRzLFxuICAgICAgdXJsOiBlLnVybCxcbiAgICAgIHRhZzogZS50YWcsXG4gICAgICBzZWxlY3RvcjogZS5zZWxlY3RvcixcbiAgICAgIGNhcHR1cmVJbmRleDogZS5uLFxuICAgICAgZGlzcGxheUxhYmVsOiBTdHJpbmcoZS5uKSxcbiAgICB9O1xuICAgIGlmIChvcHRzLmV2ZW50SW5kZXggIT09IHVuZGVmaW5lZCkgb3V0LmV2ZW50SW5kZXggPSBvcHRzLmV2ZW50SW5kZXg7XG4gICAgaWYgKG9wdHMudmlzdWFsT3JkZXIgIT09IHVuZGVmaW5lZCkgb3V0LnZpc3VhbE9yZGVyID0gb3B0cy52aXN1YWxPcmRlcjtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS50ZXh0ICE9PSB1bmRlZmluZWQpIG91dC50ZXh0ID0gbWluaWZ5ID8gZS50ZXh0LnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLnRleHQ7XG4gICAgaWYgKGUucm9sZSAhPT0gdW5kZWZpbmVkKSBvdXQucm9sZSA9IGUucm9sZTtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSAhPT0gdW5kZWZpbmVkKSBvdXQuYWNjZXNzaWJsZU5hbWUgPSBtaW5pZnkgPyBlLmFjY2Vzc2libGVOYW1lLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLmFjY2Vzc2libGVOYW1lO1xuICAgIGlmIChlLmlkICE9PSB1bmRlZmluZWQpIG91dC5pZCA9IGUuaWQ7XG4gICAgaWYgKGUudGVzdElkICE9PSB1bmRlZmluZWQpIG91dC50ZXN0SWQgPSBlLnRlc3RJZDtcbiAgICBpZiAoZS5jbGFzc2VzICYmIGUuY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIG91dC5jbGFzc2VzID0gKG1pbmlmeSAmJiBlLmNsYXNzZXMubGVuZ3RoID4gOCkgPyBlLmNsYXNzZXMuc2xpY2UoMCwgOCkgOiBlLmNsYXNzZXM7XG4gICAgfVxuICAgIGlmIChlLmF0dHJzICYmIE9iamVjdC5rZXlzKGUuYXR0cnMpLmxlbmd0aCkgb3V0LmF0dHJzID0gZS5hdHRycztcbiAgICBpZiAoZS5oaW50cyAmJiBPYmplY3Qua2V5cyhlLmhpbnRzKS5sZW5ndGgpIG91dC5oaW50cyA9IGUuaGludHM7XG4gICAgaWYgKGUucmVjdCkgb3V0LnJlY3QgPSBlLnJlY3Q7XG4gICAgaWYgKGUuc3RhdGVzICYmIGUuc3RhdGVzLmxlbmd0aCkgb3V0LnN0YXRlcyA9IGUuc3RhdGVzO1xuICAgIGlmIChlLmNvbXBvbmVudCkgb3V0LmNvbXBvbmVudCA9IGUuY29tcG9uZW50O1xuICAgIC8vIExvY2F0b3ItcXVhbGl0eSBmaWVsZC4gUHJvbW90ZSBldmVuIHdoZW4gbWluaWZpZWQg4oCUIGl0J3MgYSBzaW5nbGVcbiAgICAvLyBzbWFsbCBpbnQgYW5kIGEgZG93bnN0cmVhbSBhZ2VudCB1c2VzIGl0IHRvIGRlY2lkZSB3aGV0aGVyIHRvXG4gICAgLy8gdHJ1c3QgdGhlIHNlbGVjdG9yLlxuICAgIGlmIChlLnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSBvdXQuc2VsZWN0b3JNYXRjaENvdW50ID0gZS5zZWxlY3Rvck1hdGNoQ291bnQ7XG4gICAgaWYgKGUuYTExeSkgb3V0LmExMXkgPSBlLmExMXk7XG4gICAgaWYgKGUuYXNzZXRzICYmIGUuYXNzZXRzLmxlbmd0aCkgb3V0LmFzc2V0cyA9IGUuYXNzZXRzO1xuICAgIGlmIChlLmxheW91dENvbnRleHQgJiYgZS5sYXlvdXRDb250ZXh0Lmxlbmd0aCkgb3V0LmxheW91dENvbnRleHQgPSBlLmxheW91dENvbnRleHQ7XG4gICAgaWYgKGluY2x1ZGVPdXRlciAmJiBlLm91dGVySFRNTCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXQub3V0ZXJIVE1MID0gbWluaWZ5ID8gZS5vdXRlckhUTUwucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUub3V0ZXJIVE1MO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZVN0eWxlcyAmJiBlLnN0eWxlcyAmJiBPYmplY3Qua2V5cyhlLnN0eWxlcykubGVuZ3RoKSBvdXQuc3R5bGVzID0gZS5zdHlsZXM7XG4gICAgaWYgKGUuc2NyZWVuc2hvdCkge1xuICAgICAgLy8gUGF0aCBub3JtYWxpemF0aW9uOiB0aGUgbGl2ZSBgZW50cnkuc2NyZWVuc2hvdC5lbGVtZW50YCBjYXJyaWVzIGFcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXhlZCBwYXRoIChlLmcuIGBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmdgKVxuICAgICAgLy8gYmVjYXVzZSB0aGUgYmFja2dyb3VuZCdzIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgQVBJIHN0YW1wc1xuICAgICAgLy8gdGhlIHdvcmtzcGFjZSBpbnRvIHRoZSBvbi1kaXNrIHBhdGguIEJ1dCB0aGUgLnRhci56c3QgYXJjaGl2ZVxuICAgICAgLy8gYnVuZGxlcyBzY3JlZW5zaG90cyBmbGF0IGF0IGBzY3JlZW5zaG90cy9mb28ucG5nYCwgc28gdGhlXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4IHdvdWxkIHJlc29sdmUgdG8gbm90aGluZyBmb3IgYW4gYWdlbnQgdGhhdFxuICAgICAgLy8gZXh0cmFjdGVkIHRoZSBhcmNoaXZlLiBTdHJpcCB0aGUgd29ya3NwYWNlIHByZWZpeCBvbiBlbWl0IHNvXG4gICAgICAvLyBldmVyeSBwYXRoIGlzIHZhbGlkIHJlbGF0aXZlIHRvIHRoZSBtYW5pZmVzdCdzIGRlY2xhcmVkXG4gICAgICAvLyBgcGF0aFJvb3RgIChhcmNoaXZlIHJvb3QgZm9yIHRhci56c3Q7IHdvcmtzcGFjZSByb290IGZvciBwbGFpblxuICAgICAgLy8gSlNPTkwg4oCUIGkuZS4sIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gKS5cbiAgICAgIGNvbnN0IHN0cmlwV3MgPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgaWYgKCFwKSByZXR1cm4gcDtcbiAgICAgICAgLy8gU3RyaXAgZXhhY3RseSBvbmUgbGVhZGluZyBgPHdvcmtzcGFjZT4vYCBzZWdtZW50IGlmIHByZXNlbnQuXG4gICAgICAgIGNvbnN0IHdzUHJlZml4ID0gYCR7YWN0aXZlV3N9L2A7XG4gICAgICAgIHJldHVybiBwLnN0YXJ0c1dpdGgod3NQcmVmaXgpID8gcC5zbGljZSh3c1ByZWZpeC5sZW5ndGgpIDogcDtcbiAgICAgIH07XG4gICAgICBvdXQuc2NyZWVuc2hvdCA9IHsuLi5lLnNjcmVlbnNob3R9O1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpIG91dC5zY3JlZW5zaG90LmVsZW1lbnQgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90Lmdyb3VwKSBvdXQuc2NyZWVuc2hvdC5ncm91cCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZ3JvdXApO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LnBhZ2UpIG91dC5zY3JlZW5zaG90LnBhZ2UgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LnBhZ2UpO1xuICAgIH1cbiAgICAvLyBQcm9tb3RlIHJ1bnRpbWUvYmVoYXZpb3Igc2lnbmFscyB0byB0b3AtbGV2ZWwuIFRoZXNlIGFyZSBwcmltYXJ5XG4gICAgLy8gc2lnbmFsIGZvciB0cmlhZ2UgKGV2ZW50cyB0ZWxscyBcIndoaWNoIGhhbmRsZXIgcmFuXCIsIGJlaGF2aW9yQXR0cnNcbiAgICAvLyB0ZWxscyBcIndoYXQgc2VydmVyLXJlbmRlcmVkIGJpbmRpbmcgZG9lcyB0aGlzIGZpcmVcIiwgY2FudmFzQ2xpY2tcbiAgICAvLyB0ZWxscyBcIndoZXJlIG9uIHRoZSBjaGFydCB3YXMgY2xpY2tlZFwiLCBlZGl0b3IgdGVsbHMgXCJ3aGljaFxuICAgIC8vIHJpY2gtdGV4dCBsaWJyYXJ5IHdyYXBzIHRoaXNcIiwgZG9tTXV0YXRpb25zIHRlbGxzIFwid2hhdCBjaGFuZ2VkXG4gICAgLy8gYmVmb3JlIHRoZSBjbGlja1wiLCBpc0FuaW1hdGluZyB3YXJucyBhYm91dCB0cmFuc2llbnQgc3RhdGUpLlxuICAgIGlmIChlLmV2ZW50cyAmJiBPYmplY3Qua2V5cyhlLmV2ZW50cykubGVuZ3RoKSBvdXQuZXZlbnRzID0gZS5ldmVudHM7XG4gICAgaWYgKGUuYmVoYXZpb3JBdHRycyAmJiBPYmplY3Qua2V5cyhlLmJlaGF2aW9yQXR0cnMpLmxlbmd0aCkgb3V0LmJlaGF2aW9yQXR0cnMgPSBlLmJlaGF2aW9yQXR0cnM7XG4gICAgaWYgKGUuY2FudmFzQ2xpY2spIG91dC5jYW52YXNDbGljayA9IGUuY2FudmFzQ2xpY2s7XG4gICAgaWYgKGUuZWRpdG9yKSBvdXQuZWRpdG9yID0gZS5lZGl0b3I7XG4gICAgaWYgKGUuaXNBbmltYXRpbmcpIG91dC5pc0FuaW1hdGluZyA9IHRydWU7XG4gICAgaWYgKGUuc2hhZG93SG9zdCkgb3V0LnNoYWRvd0hvc3QgPSBlLnNoYWRvd0hvc3Q7XG4gICAgaWYgKGUucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIG91dC5yZW5kZXJlZFRleHQgPSBlLnJlbmRlcmVkVGV4dDtcbiAgICBpZiAoZS50cnVuY2F0ZWQgJiYgT2JqZWN0LmtleXMoZS50cnVuY2F0ZWQpLmxlbmd0aCkgb3V0LnRydW5jYXRlZCA9IGUudHJ1bmNhdGVkO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLmRvbU11dGF0aW9ucyAmJiBlLmRvbU11dGF0aW9ucy5sZW5ndGgpIG91dC5kb21NdXRhdGlvbnMgPSBlLmRvbU11dGF0aW9ucztcblxuICAgIC8vIF9hdWRpdDogZGV0ZWN0aW9uIGNoYWluICYgZGlhZ25vc3RpYyBzaGFwZS5cbiAgICAvLyBSRUFETUUgY2xhaW1lZCBgX2F1ZGl0LmFuY2VzdG9yc2AgYW5kIGBfYXVkaXQuY29tcG9uZW50Um9vdGAgd2VyZVxuICAgIC8vIGFsd2F5cyBwcmVzZW50LCBidXQgdGhlIHNsaW0gZW1pdCBkcm9wcGVkIHRoZW0gd2hlbmV2ZXJcbiAgICAvLyBgbWluaWZ5OiB0cnVlYC4gVGhlIGZpeDogZW1pdCBldmVyeSBkZWNsYXJlZCBgX2F1ZGl0YCBmaWVsZFxuICAgIC8vIHdoZW5ldmVyIHRoZSBzb3VyY2UgZGF0YSBleGlzdHMsIGFuZCBsZXRcbiAgICAvLyBgbWluaWZ5YCBzbGltIE9OTFkgdGhlIGhpZ2gtdm9sdW1lIGJsb2NrcyAobWF0Y2hlZFJ1bGVzLFxuICAgIC8vIHBzZXVkb0VsZW1lbnRzKS4gU21hbGwgc3RydWN0dXJhbCBtZXRhZGF0YSAoYW5jZXN0b3JzLFxuICAgIC8vIGNvbXBvbmVudFJvb3QsIHZpZXdwb3J0KSBzdXJ2aXZlcyBtaW5pZnkgc28gdGhlIHNjaGVtYSBjbGFpbXNcbiAgICAvLyBzdGF5IGhvbmVzdC5cbiAgICBjb25zdCBhdWRpdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChlLmFuY2VzdG9ycyAmJiBlLmFuY2VzdG9ycy5sZW5ndGgpIGF1ZGl0LmFuY2VzdG9ycyA9IGUuYW5jZXN0b3JzO1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgYXVkaXQuY29tcG9uZW50Um9vdCA9IGUuY29tcG9uZW50Um9vdDtcbiAgICBpZiAoZS5pblNoYWRvd0RPTSkgYXVkaXQuaW5TaGFkb3dET00gPSB0cnVlO1xuICAgIGlmIChlLnBzZXVkb0VsZW1lbnRzICYmIE9iamVjdC5rZXlzKGUucHNldWRvRWxlbWVudHMpLmxlbmd0aCAmJiAhbWluaWZ5KSBhdWRpdC5wc2V1ZG9FbGVtZW50cyA9IGUucHNldWRvRWxlbWVudHM7XG4gICAgaWYgKGluY2x1ZGVNYXRjaGVkICYmIGUubWF0Y2hlZFJ1bGVzICYmIGUubWF0Y2hlZFJ1bGVzLmxlbmd0aCkge1xuICAgICAgYXVkaXQubWF0Y2hlZFJ1bGVzID0gbWluaWZ5XG4gICAgICAgID8gZS5tYXRjaGVkUnVsZXMubWFwKChyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcjI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7c2VsZWN0b3I6IHIuc2VsZWN0b3J9O1xuICAgICAgICAgIGlmIChyLmRlY2xhcmF0aW9ucyAmJiBPYmplY3Qua2V5cyhyLmRlY2xhcmF0aW9ucykubGVuZ3RoKSByMi5kZWNsYXJhdGlvbnMgPSByLmRlY2xhcmF0aW9ucztcbiAgICAgICAgICBpZiAoci5tZWRpYSkgcjIubWVkaWEgPSByLm1lZGlhO1xuICAgICAgICAgIHJldHVybiByMjtcbiAgICAgICAgfSlcbiAgICAgICAgOiBlLm1hdGNoZWRSdWxlcztcbiAgICB9XG4gICAgaWYgKGUudmlld3BvcnQpIGF1ZGl0LnZpZXdwb3J0ID0gZS52aWV3cG9ydDtcbiAgICBpZiAoT2JqZWN0LmtleXMoYXVkaXQpLmxlbmd0aCkgb3V0Ll9hdWRpdCA9IGF1ZGl0O1xuXG4gICAgLy8gR3JvdXAgaGVhZCBsaW5rYWdlLiBQcmV2aW91c2x5IHRoZSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYFxuICAgIC8vIGNhcnJpZWQgZnVsbCBuZXN0ZWQgZW50cnkgb2JqZWN0cy5cbiAgICAvLyBUaGF0IG1hZGUgRHVja0RCIGpvaW5zIHVnbHkgYW5kIGJyb2tlIHRoZSBydWxlIHRoYXQgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBzaG91bGQgYmUgYSB0b3AtbGV2ZWwgcm93LiBXZSBub3cgZW1pdDpcbiAgICAvLyAgIOKAoiBvbiB0aGUgZ3JvdXAgaGVhZDogYGdyb3VwTWVtYmVyVWlkczogW3VpZCwgdWlkLCAuLi5dYCAoanVzdCBJRHMpXG4gICAgLy8gICDigKIgZWFjaCBtZW1iZXIgYXMgaXRzIG93biB0b3AtbGV2ZWwgc2xpbSByb3cgd2l0aCBgZ3JvdXBVaWRgXG4gICAgLy8gICAgIHBvaW50aW5nIGJhY2sgYXQgdGhlIGhlYWQgKGhhbmRsZWQgaW4gYGJ1aWxkU2xpbWAgZmx1c2ggbG9naWMpLlxuICAgIGlmIChvcHRzLmluY2x1ZGVHcm91cCAmJiBlLmdyb3VwICYmIGUuZ3JvdXAubGVuZ3RoKSB7XG4gICAgICBvdXQuZ3JvdXBNZW1iZXJVaWRzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuICAgIGlmIChvcHRzLmdyb3VwVWlkKSBvdXQuZ3JvdXBVaWQgPSBvcHRzLmdyb3VwVWlkO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIFNoYXJlZCBcInNsaW0gZGF0YVwiIHBpcGVsaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBKU09OTCByZW5kZXJzIG9mZiB0aGlzIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvbi4gKE1hcmtkb3duIHVzZWQgdG9cbiAgLy8gc2hhcmUgaXQ7IHRoZSBNYXJrZG93biBleHBvcnQgd2FzIHJldGlyZWQgaW4gZmF2b3Igb2YgSlNPTkwtb25seS4pXG4gIC8vXG4gIC8vIHYyIGRpZmZlcmVuY2VzIHZzIHYxOlxuICAvLyAgIOKAoiBTZWxlY3RvciBsaW5lcyBoYXZlIGV4cGxpY2l0IGB0eXBlOiAnc2VsZWN0b3InYCBhbmQgYHY6IDJgLlxuICAvLyAgIOKAoiBfYXVkaXQgbmVzdHMgZGV0ZWN0aW9uIC8gZGVidWcgZmllbGRzIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIOKApikuXG4gIC8vICAg4oCiIEZlZWRiYWNrIGVtaXRzIGFzIHN0YW5kYWxvbmUgYHt0eXBlOidmZWVkYmFjaycsIHBhcmVudFVpZCwg4oCmfWAgbGluZXNcbiAgLy8gICAgIFBMVVMgYnVuZGxlZCBgZmVlZGJhY2tgIGFycmF5cyBvbiBzZWxlY3RvcnMgKHNvIG9sZCBzaW5nbGUtbGluZVxuICAvLyAgICAgcmVhZGVycyBzdGlsbCBzZWUgdGhlbSBhZGphY2VudCkuXG4gIC8vICAg4oCiIEEgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGNhcnJpZXMgd29ya3NwYWNlICsgY291bnRzICsgZmlsZW5hbWUuXG4gIHR5cGUgU2xpbVBhZ2UgPSB7djogMjsgdHlwZTogJ3BhZ2UnOyB0czogc3RyaW5nOyB1cmw6IHN0cmluZzsgdGl0bGU/OiBzdHJpbmc7IHZpZXdwb3J0PzogVmlld3BvcnQ7IHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IHVzZXJBZ2VudD86IHN0cmluZzsgbGFuZz86IHN0cmluZzsgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9OyByb3V0ZT86IGFueTsgc3RhdGU/OiBhbnk7IHNlc3Npb25JZD86IHN0cmluZ307XG4gIC8vIFNldmVyaXR5IHdhcyByZW1vdmVkIGZyb20gdGhlIFVJICgyMDI2LTA1KS4gVG9sZXJhbnQgcmVhZGVycyBtYXkgc3RpbGxcbiAgLy8gc2VlIGBzZXZlcml0eWAgb24gbGVnYWN5IEpTT05MIOKAlCBkZW5vcm1hbGl6ZUVudHJ5IHByZXNlcnZlcyBpdCBvblxuICAvLyBGZWVkYmFja01lc3NhZ2Ugc28gcmUtZXhwb3J0IHJvdW5kLXRyaXBzLCBidXQgbmV3IHNlc3Npb25zIG5ldmVyIHNldFxuICAvLyBpdCBhbmQgd2UgZG9uJ3QgZW1pdCBpdCBoZXJlLiBLZWVwIHRoZSBmaWVsZCBvZmYgU2xpbUZlZWRiYWNrIHNvIG5ld1xuICAvLyBleHBvcnRzIHN0YXkgY2xlYW4uXG4gIC8vIGB0YWdzYCBpcyBhbHdheXMgZW1pdHRlZCAoZGVmYXVsdCBlbXB0eSBhcnJheSkgc28gRHVja0RCIHNjaGVtYVxuICAvLyBpbmZlcmVuY2UgYWx3YXlzIHNlZXMgdGhlIGNvbHVtbi5cbiAgdHlwZSBTbGltRmVlZGJhY2sgPSB7djogMjsgdHlwZTogJ2ZlZWRiYWNrJzsgdWlkOiBzdHJpbmc7IHRzOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nOyB0YWdzOiBzdHJpbmdbXTsgaXNUZXN0RGF0YT86IGJvb2xlYW59O1xuICAvLyBDaGVhcCB0ZXN0LWRhdGEgc25pZmY6IG1hdGNoZXMgc3RyaW5ncyB0aGUgdXNlciB0eXBlcyB3aGlsZSBzbW9rZS1cbiAgLy8gdGVzdGluZyB0aGUgZXh0ZW5zaW9uIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsIFwibG9yZW0gaXBzdW1cIixcbiAgLy8gXCJwbGFjZWhvbGRlclwiLCBvciBhbnkgcGhyYXNlIG9idmlvdXNseSBzdHViYmVkLW91dCkuIEZhbHNlIHBvc2l0aXZlc1xuICAvLyBoZXJlIGFyZSByZWNvdmVyYWJsZSDigJQgdGhlIGNvbnN1bWVyIGNhbiBpZ25vcmUgdGhlIGZsYWcg4oCUIGJ1dFxuICAvLyBleGNsdWRpbmcgcmVhbCBmZWVkYmFjayB3b3VsZCBub3QgYmUsIHNvIHdlIGtlZXAgdGhlIHJlZ2V4IG5hcnJvdy5cbiAgY29uc3QgVEVTVF9EQVRBX1JFID0gL14odGVzdHxhc2RmfHF3ZXJ8Zm9vfGJhcnxiYXp8bG9yZW18cGxhY2Vob2xkZXJ8dG9kb3x4ezMsfXxoZWxsbyB3b3JsZHxzYW1wbGV8ZHVtbXl8c29tZXRoaW5nfGFueXRoaW5nfGlnbm9yZSBtZXx3aXB8dGJkfG5cXC9hfGhpKVxcYi9pO1xuICBjb25zdCBsb29rc0xpa2VUZXN0RGF0YSA9ICh0ZXh0OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50cmltKCk7XG4gICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKFRFU1RfREFUQV9SRS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoL3Rlc3QgZmVlZGJhY2svaS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHR5cGUgU2xpbVNlbGVjdG9yID0gUmVjb3JkPHN0cmluZywgYW55PiAmIHt2OiAyOyB0eXBlOiAnc2VsZWN0b3InOyBuOiBudW1iZXI7IHNlbGVjdG9yOiBzdHJpbmc7IGZlZWRiYWNrPzogc3RyaW5nW119O1xuICB0eXBlIFNsaW1MaW5lID0gU2xpbVBhZ2UgfCBTbGltRmVlZGJhY2sgfCBTbGltU2VsZWN0b3I7XG4gIGNvbnN0IGJ1aWxkU2xpbSA9ICgpOiBTbGltTGluZVtdID0+IHtcbiAgICBjb25zdCBsaW5lczogU2xpbUxpbmVbXSA9IFtdO1xuICAgIC8vIFByZS1jb21wdXRlIHZpc3VhbE9yZGVyICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkgZm9yIGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3IgbWVzc2FnZS4gVGhlIHByZXZpb3VzIHNpbmdsZSBgbmAgZmllbGQgY29uZmxhdGVkXG4gICAgLy8gY2FwdHVyZSBvcmRlciwgSlNPTkwgc3RyZWFtIG9yZGVyLFxuICAgIC8vIHZpc3VhbCBvcmRlciwgYW5kIGRpc3BsYXkgbGFiZWwuIFdlIG5vdyBlbWl0IGZvdXIgb3J0aG9nb25hbFxuICAgIC8vIGZpZWxkcyBhbmQgZG9jdW1lbnQgZWFjaDpcbiAgICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gICAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCB0aGUgb3JpZ2luYWwgYG5gIChjYXB0dXJlIHNlcXVlbmNlKVxuICAgIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgc29ydCBieSByZWN0LnkgYXNjLCByZWN0LnggYXNjXG4gICAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCB0aGUgaHVtYW4tZmFjaW5nIG51bWJlciBzaG93biBpbiB0aGUgc2lkZWJhclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAoY3VycmVudGx5IG1pcnJvcnMgY2FwdHVyZUluZGV4OyBjYW4gZHJpZnQgaWZcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhlIHNpZGViYXIgYWRvcHRzIGEgZGlmZmVyZW50IGxhYmVsIHNjaGVtZSkuXG4gICAgY29uc3QgdmlzdWFsUmFuayA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgY29uc3Qgc2VscyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFyID0gYS5lbnRyeS5yZWN0OyBjb25zdCBiciA9IGIuZW50cnkucmVjdDtcbiAgICAgICAgaWYgKCFhciB8fCAhYnIpIHJldHVybiAwO1xuICAgICAgICBpZiAoYXIueSAhPT0gYnIueSkgcmV0dXJuIGFyLnkgLSBici55O1xuICAgICAgICByZXR1cm4gYXIueCAtIGJyLng7XG4gICAgICB9KTtcbiAgICBzZWxzLmZvckVhY2goKG0sIGkpID0+IHZpc3VhbFJhbmsuc2V0KG0uaWQsIGkgKyAxKSk7XG4gICAgbGV0IHBlbmRpbmdTZWw6IFNlbGVjdG9yTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIC8vIFdlIGNvbGxlY3QgYm90aCB0aGUgYnVuZGxlZCBzdHJpbmcgYXJyYXkgKGZvciB2MS1mcmllbmRseSByZWFkZXJzKSBhbmRcbiAgICAvLyB0aGUgcmljaCBvYmplY3RzIChmb3IgdjIgc3RhbmRhbG9uZSBsaW5lcykuXG4gICAgbGV0IHBlbmRpbmdGYlN0cmluZ3M6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHBlbmRpbmdGYlJpY2g6IFNsaW1GZWVkYmFja1tdID0gW107XG4gICAgY29uc3QgZmx1c2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBlbmRpbmdTZWwpIHJldHVybjtcbiAgICAgIGNvbnN0IGV2ZW50SW5kZXggPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgY29uc3QgdmlzdWFsT3JkZXIgPSB2aXN1YWxSYW5rLmdldChwZW5kaW5nU2VsLmlkKTtcbiAgICAgIGNvbnN0IG91dDogYW55ID0gc2xpbUVudHJ5KHBlbmRpbmdTZWwuZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWUsIGV2ZW50SW5kZXgsIHZpc3VhbE9yZGVyfSk7XG4gICAgICBpZiAocGVuZGluZ0ZiU3RyaW5ncy5sZW5ndGgpIG91dC5mZWVkYmFjayA9IFsuLi5wZW5kaW5nRmJTdHJpbmdzXTtcbiAgICAgIGxpbmVzLnB1c2gob3V0IGFzIFNsaW1MaW5lKTtcbiAgICAgIC8vIEdyb3VwIGZsYXRuZXNzIChidWcgIzkpLiBFbWl0IGVhY2ggZ3JvdXAgbWVtYmVyIGFzIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzbGltIHJvdyByaWdodCBhZnRlciB0aGUgaGVhZCwgd2l0aCBgZ3JvdXBVaWRgXG4gICAgICAvLyBsaW5raW5nIGJhY2suIFRoaXMgbGV0cyBEdWNrREIgLyBTUUwgcXVlcmllcyB0cmVhdCBncm91cFxuICAgICAgLy8gbWVtYmVycyBhcyBmaXJzdC1jbGFzcyBzZWxlY3RvciByb3dzIHdpdGhvdXQgZGVzY2VuZGluZyBpbnRvXG4gICAgICAvLyBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgIGNvbnN0IGdyb3VwTWVtYmVycyA9IHBlbmRpbmdTZWwuZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBncm91cE1lbWJlcnMpIHtcbiAgICAgICAgY29uc3QgbUV2ZW50ID0gbGluZXMubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3QgbWVtYmVyUm93OiBhbnkgPSBzbGltRW50cnkobWVtYmVyLCB7aW5jbHVkZUdyb3VwOiBmYWxzZSwgZXZlbnRJbmRleDogbUV2ZW50LCBncm91cFVpZDogcGVuZGluZ1NlbC5lbnRyeS51aWR9KTtcbiAgICAgICAgbGluZXMucHVzaChtZW1iZXJSb3cgYXMgU2xpbUxpbmUpO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBlYWNoIHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZSByaWdodCBhZnRlciB0aGUgc2VsZWN0b3IocykuXG4gICAgICBmb3IgKGNvbnN0IGZiIG9mIHBlbmRpbmdGYlJpY2gpIGxpbmVzLnB1c2goZmIpO1xuICAgICAgcGVuZGluZ1NlbCA9IG51bGw7XG4gICAgICBwZW5kaW5nRmJTdHJpbmdzID0gW107XG4gICAgICBwZW5kaW5nRmJSaWNoID0gW107XG4gICAgfTtcbiAgICAvLyBSZW9yZGVyIGZvciBleHBvcnQgb25seSDigJQgc2lkZWJhciBrZWVwcyBjYXB0dXJlIG9yZGVyLCB0aGVcbiAgICAvLyBlbWl0dGVkIEpTT05MIHJlYWRzIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHdpdGhpbiBlYWNoIHBhZ2UuXG4gICAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciB2aWEgdGhlXG4gICAgLy8gYHJlb3JkZXJGb3JFeHBvcnRgIGhlbHBlciwgc28gdGhyZWFkaW5nIGlzIHByZXNlcnZlZCB0aHJvdWdoXG4gICAgLy8gdGhlIHJlYXJyYW5nZW1lbnQuXG4gICAgY29uc3QgZXhwb3J0T3JkZXJlZCA9IHJlb3JkZXJGb3JFeHBvcnQobWVzc2FnZXMpO1xuICAgIGZvciAoY29uc3QgbSBvZiBleHBvcnRPcmRlcmVkKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2goKTtcbiAgICAgICAgY29uc3Qgc2xpbTogU2xpbVBhZ2UgPSB7djogMiwgdHlwZTogJ3BhZ2UnLCB0czogbS50cywgdXJsOiBtLnVybH07XG4gICAgICAgIGlmIChtLnRpdGxlICE9PSB1bmRlZmluZWQpIHNsaW0udGl0bGUgPSBtLnRpdGxlO1xuICAgICAgICBpZiAobS52aWV3cG9ydCkgc2xpbS52aWV3cG9ydCA9IG0udmlld3BvcnQ7XG4gICAgICAgIGlmICghcHJlZnMubWluaWZ5ICYmIG0udG9rZW5zKSBzbGltLnRva2VucyA9IG0udG9rZW5zO1xuICAgICAgICBpZiAobS51c2VyQWdlbnQpIHNsaW0udXNlckFnZW50ID0gbS51c2VyQWdlbnQ7XG4gICAgICAgIGlmIChtLmxhbmcpIHNsaW0ubGFuZyA9IG0ubGFuZztcbiAgICAgICAgaWYgKG0uZ2l0Q29udGV4dCkgc2xpbS5naXRDb250ZXh0ID0gbS5naXRDb250ZXh0O1xuICAgICAgICBpZiAobS5yb3V0ZSkgc2xpbS5yb3V0ZSA9IG0ucm91dGU7XG4gICAgICAgIGlmIChtLnN0YXRlKSBzbGltLnN0YXRlID0gbS5zdGF0ZTtcbiAgICAgICAgaWYgKG0uc2Vzc2lvbklkKSBzbGltLnNlc3Npb25JZCA9IG0uc2Vzc2lvbklkO1xuICAgICAgICBsaW5lcy5wdXNoKHNsaW0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHsgZmx1c2goKTsgcGVuZGluZ1NlbCA9IG07IH1cbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAvLyBBbHdheXMgaW5jbHVkZSBgdGFnczogW11gIChldmVuIHdoZW4gZW1wdHkpIHNvIER1Y2tEQidzIHNjaGVtYVxuICAgICAgICAvLyBpbmZlcmVuY2UgcGlja3MgdGhlIGNvbHVtbiB1cC5cbiAgICAgICAgLy8gYHVpZGAgaXMgdGhlIG1lc3NhZ2UncyBzdGFibGUgaWQ6IFBScyAvIHJlcGFpciByZXBvcnRzIG5lZWRcbiAgICAgICAgLy8gYSBzdGFibGUgcGVyLWZlZWRiYWNrIGhhbmRsZSwgbm90IGp1c3QgcGFyZW50VWlkLlxuICAgICAgICBjb25zdCByaWNoOiBTbGltRmVlZGJhY2sgPSB7djogMiwgdHlwZTogJ2ZlZWRiYWNrJywgdWlkOiBtLmlkLCB0czogbS50cywgdGV4dDogbS50ZXh0LCB0YWdzOiBtLnRhZ3MgPz8gW119O1xuICAgICAgICAvLyAoc2V2ZXJpdHkgcmVtb3ZlZCAyMDI2LTA1IOKAlCBvbGQgSlNPTkxzIG1heSBzdGlsbCBjb250YWluIGl0XG4gICAgICAgIC8vIG9uIHRoZSByZWFkIHNpZGUsIGJ1dCB3ZSBubyBsb25nZXIgZW1pdCBpdCBvbiB3cml0ZS4pXG4gICAgICAgIC8vIEhldXJpc3RpYyBmbGFnIGZvciBzdHViLWxvb2tpbmcgZmVlZGJhY2sgKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIixcbiAgICAgICAgLy8gXCJIb3dkeSAsIHRlc3QgZmVlZGJhY2sgaGVyZVwiLCBldGMpLiBMZXRzIGEgZG93bnN0cmVhbSBjb25zdW1lclxuICAgICAgICAvLyBmaWx0ZXIgcG9sbHV0aW9uIGZyb20gcmVhbCBpbnRlbnQgd2l0aG91dCBtYW51YWwgY2xlYW51cC5cbiAgICAgICAgaWYgKGxvb2tzTGlrZVRlc3REYXRhKG0udGV4dCkpIHJpY2guaXNUZXN0RGF0YSA9IHRydWU7XG4gICAgICAgIGlmIChwZW5kaW5nU2VsKSB7XG4gICAgICAgICAgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZCA/PyBwZW5kaW5nU2VsLmVudHJ5LnVpZDtcbiAgICAgICAgICBwZW5kaW5nRmJTdHJpbmdzLnB1c2gobS50ZXh0KTtcbiAgICAgICAgICBwZW5kaW5nRmJSaWNoLnB1c2gocmljaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG0ucGFyZW50VWlkKSByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkO1xuICAgICAgICAgIGxpbmVzLnB1c2gocmljaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2goKTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH07XG4gIC8vIEJ1aWxkIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgb2YgdGhlIEpTT05MIGV4cG9ydC4gVGhlXG4gIC8vIG1hbmlmZXN0IGNhcnJpZXMgdGhlIGV4cG9ydCBmaWxlbmFtZSArIHdvcmtzcGFjZSArIGhvc3QocykgKyBjb3VudHMgc29cbiAgLy8gYSBkb3duc3RyZWFtIExMTSBjYW4gcmVzeW5jIHRoZSBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSBhbmQgZ3JlcCBmb3JcbiAgLy8gZHVwbGljYXRlcyBhY3Jvc3MgZXhwb3J0cy5cbiAgY29uc3QgYnVpbGRNYW5pZmVzdCA9IChmaWxlbmFtZTogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSk6IEV4cG9ydE1hbmlmZXN0ID0+IHtcbiAgICBsZXQgblNlbCA9IDA7IGxldCBuRmIgPSAwOyBsZXQgblBnID0gMDtcbiAgICBsZXQgbkdyb3VwTWVtYmVycyA9IDA7XG4gICAgbGV0IG5GZWVkYmFja0JlYXJpbmcgPSAwO1xuICAgIGxldCBuTWlzc2luZ1Nob3QgPSAwO1xuICAgIGxldCBuRWxlbWVudFNob3RzID0gMDtcbiAgICBsZXQgbkdyb3VwU2hvdHMgPSAwO1xuICAgIGxldCBuUGFnZVNob3RzID0gMDtcbiAgICBsZXQgbk9ycGhhbmVkRmIgPSAwO1xuICAgIGNvbnN0IHNlbGVjdG9yVWlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAvLyBGaXJzdCBwYXNzOiBjb2xsZWN0IHVpZHMgKyBwZXItc2VsZWN0b3IgZmVlZGJhY2sgcHJlc2VuY2UuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIG5TZWwrKztcbiAgICAgICAgc2VsZWN0b3JVaWRzLmFkZChtLmVudHJ5LnVpZCk7XG4gICAgICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIG5Hcm91cE1lbWJlcnMgKz0gbS5lbnRyeS5ncm91cC5sZW5ndGg7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIG5FbGVtZW50U2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5Hcm91cFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIG5QYWdlU2hvdHMrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIG5GYisrO1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuYWRkKG0ucGFyZW50VWlkKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIG5QZysrO1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzczogZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgKyBvcnBoYW5lZCBmZWVkYmFjayArXG4gICAgLy8gc2VsZWN0b3JzIHRoYXQgc2hvdWxkIGhhdmUgYSBzaG90IGJ1dCBkb24ndC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSB7XG4gICAgICAgIG5GZWVkYmFja0JlYXJpbmcrKztcbiAgICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5NaXNzaW5nU2hvdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIG5PcnBoYW5lZEZiKys7XG4gICAgfVxuICAgIGNvbnN0IG91dDogRXhwb3J0TWFuaWZlc3QgPSB7XG4gICAgICB2OiAyLCB0eXBlOiAnbWFuaWZlc3QnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICAgIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICBnZW5lcmF0ZWQ6IERhdGUubm93KCksXG4gICAgICB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBmb3JtYXQsXG4gICAgICBob3N0czogZGlzdGluY3RIb3N0cygpLFxuICAgICAgY291bnRzOiB7XG4gICAgICAgIC8vIFRvdGFsIHNlbGVjdG9yIHJvd3MgdGhlIEpTT05MIHdpbGwgZW1pdCA9IHRvcC1sZXZlbCArIGZsYXRcbiAgICAgICAgLy8gZ3JvdXAgbWVtYmVycy4gVGhpcyBtYXRjaGVzIHdoYXQgYSBkb3duc3RyZWFtXG4gICAgICAgIC8vIGByZWFkX2pzb25fYXV0byguLi4pYCB3b3VsZCBzZWU7IHRoZSBwcmV2aW91cyBiZWhhdmlvciBvZlxuICAgICAgICAvLyByZXBvcnRpbmcgb25seSB0aGUgaW4tbWVtb3J5IHRvcC1sZXZlbCBjb3VudCBjb250cmFkaWN0ZWRcbiAgICAgICAgLy8gdGhlIGFjdHVhbCBzdHJlYW0uXG4gICAgICAgIHNlbGVjdG9yczogblNlbCArIG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIGZlZWRiYWNrOiBuRmIsXG4gICAgICAgIHBhZ2VzOiBuUGcsXG4gICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczogbkZlZWRiYWNrQmVhcmluZyxcbiAgICAgICAgZ3JvdXBNZW1iZXJzOiBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IG5FbGVtZW50U2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IG5Hcm91cFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IG5QYWdlU2hvdHMsXG4gICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiBuTWlzc2luZ1Nob3QsXG4gICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IG5PcnBoYW5lZEZiLFxuICAgICAgfSxcbiAgICAgIC8vIFNpbmdsZSBjYW5vbmljYWwgcmVzb2x1dGlvbiBydWxlLiBFdmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTFxuICAgICAgLy8gKHNjcmVlbnNob3QuZWxlbWVudC9ncm91cC9wYWdlKSBpcyByZWxhdGl2ZSB0byBgcGF0aFJvb3RgOlxuICAgICAgLy8gICDigKIgJ2FyY2hpdmUnOiBmb3IgdGFyLnpzdCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlXG4gICAgICAvLyAgICAgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdCAoZS5nLiBgc2NyZWVuc2hvdHMvZm9vLnBuZ2ApLlxuICAgICAgLy8gICDigKIgJ3dvcmtzcGFjZSc6IGZvciBwbGFpbiBKU09OTCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG9cbiAgICAgIC8vICAgICB0aGUgd29ya3NwYWNlIGRpciAoYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgLy8gUmVjZWl2ZXJzIG5vIGxvbmdlciBoYXZlIHRvIGd1ZXNzIHdoaWNoIHBhdGggc2hhcGUgYXBwbGllcy5cbiAgICAgIHBhdGhSb290OiBmb3JtYXQgPT09ICd0YXIuenN0JyA/ICdhcmNoaXZlJyA6ICd3b3Jrc3BhY2UnLFxuICAgIH07XG4gICAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlcnMgc28gYSBkb3duc3RyZWFtIGFnZW50IGtub3dzIHdoaWNoIFVJIHNraWxsXG4gICAgLy8gb3ducyB0aGUgdHJpYWdlIGZsb3cgKyB3aGljaCBERVNJR04ubWQgb3ducyB0aGUgdmlzdWFsIGlkZW50aXR5LlxuICAgIC8vXG4gICAgLy8gYGlubGluZTogdHJ1ZWAgaXMgc2V0IE9OTFkgZm9yIHRhci56c3QgZXhwb3J0cyAod2hlcmUgdGhlIC5tZFxuICAgIC8vIGZpbGVzIGFyZSBwaHlzaWNhbGx5IGJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSkuIEpTT05MLW9ubHlcbiAgICAvLyBleHBvcnRzIGVtaXQgYGlubGluZTogZmFsc2VgIHBsdXMgdGhlIHJlY2VpdmVyLXNpZGUgYHBhdGhgIHNvXG4gICAgLy8gYSBjb25zdW1lciBwYWlyZWQgd2l0aCB0aGUgc3RhbmRhbG9uZSBKU09OTCBjYW4gcmVzb2x2ZSB0aGVcbiAgICAvLyByZWZlcmVuY2VkIGZpbGUgb2ZmIHRoZWlyIG93biBmaWxlc3lzdGVtLlxuICAgIC8vXG4gICAgLy8gYHRlbXBsYXRlOiB0cnVlYCBmbGFncyB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKAlCB1c2VmdWxcbiAgICAvLyBmb3IgcmVjZWl2ZXJzIHdobyB3YW50IHRvIGRpc3Rpbmd1aXNoIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50XG4gICAgLy8gZnJvbSB0aGUgdXNlcidzIGFjdHVhbCB3b3JraW5nIG5vdGVzLlxuICAgIGNvbnN0IGlzVGFyQnVuZGxlID0gZm9ybWF0ID09PSAndGFyLnpzdCc7XG4gICAgb3V0LnNraWxsID0ge1xuICAgICAgbmFtZTogJ1BpbmNoR3JhYicsXG4gICAgICBwYXRoOiBwcmVmcy5za2lsbFBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuc2tpbGwuYXJjaGl2ZVBhdGggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgb3V0LnNraWxsLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5za2lsbC5jdXN0b21pemVkID0gdHJ1ZTtcbiAgICBvdXQuZGVzaWduID0ge1xuICAgICAgcGF0aDogcHJlZnMuZGVzaWduUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5kZXNpZ24uYXJjaGl2ZVBhdGggPSAnREVTSUdOLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIG91dC5kZXNpZ24udGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LmRlc2lnbi5jdXN0b21pemVkID0gdHJ1ZTtcblxuICAgIC8vIFNlbGYtcm9hc3QgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IEV4cG9ydERpYWdub3N0aWNbXSA9IFtdO1xuICAgIC8vIEZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzIHdpdGggbm8gc2NyZWVuc2hvdC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnRkVFREJBQ0tfUEFSRU5UX01JU1NJTkdfU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciAke20uZW50cnkuc2VsZWN0b3J9IGNhcnJpZXMgZmVlZGJhY2sgYnV0IGhhcyBubyBlbGVtZW50L2dyb3VwIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3JwaGFuZWQgZmVlZGJhY2sgKHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUpLlxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICBjb2RlOiAnT1JQSEFORURfRkVFREJBQ0snLFxuICAgICAgICAgIHVpZDogZmJVaWQsXG4gICAgICAgICAgZGV0YWlsOiAnZmVlZGJhY2sgcm93IHJlZmVyZW5jZXMgYSBwYXJlbnRVaWQgdGhhdCBoYXMgbm8gbWF0Y2hpbmcgc2VsZWN0b3IgaW4gdGhpcyBhcmNoaXZlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEhvdmVyLXN0YXRlIGNhcHR1cmVzIHVzdWFsbHkgbmVlZCBhIGJlZm9yZS9hZnRlcjsgZmxhZyBhbnkgd2hvc2VcbiAgICAvLyBzY3JlZW5zaG90IHN0b3J5IGlzIGluY29tcGxldGUgKGJ1ZyAjMTYgcGFydGlhbCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnN0YXRlcyAmJiBtLmVudHJ5LnN0YXRlcy5pbmNsdWRlcygnaG92ZXInKSAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0hPVkVSX1NUQVRFX05PX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgY2FwdHVyZWQgaW4gOmhvdmVyIHN0YXRlIGJ1dCBoYXMgbm8gc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBMTF5OiBmbGFnIGZhaWxpbmcgY29udHJhc3QgKGJ1ZyAjMTUgZm9sbG93LXRocm91Z2gpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5hMTF5Py5jb250cmFzdFBhc3NlcyA9PT0gJ2ZhaWwnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0NPTlRSQVNUX0JFTE9XX0FBJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHRleHQgY29udHJhc3QgcmF0aW8gJHttLmVudHJ5LmExMXkuY29udHJhc3RSYXRpbyA/PyAnPyd9IGlzIGJlbG93IFdDQUcgQUFgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aCkgb3V0LmV4cG9ydERpYWdub3N0aWNzID0gZGlhZ25vc3RpY3M7XG5cbiAgICAvLyBCdWlsZCBpZGVudGl0eS4gUHVsbCBmcm9tIHRoZSBtb3N0IHJlY2VudCBwYWdlIHJvdydzIGdpdENvbnRleHRcbiAgICAvLyAoc291cmNlZCB2aWEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIj5gIG9uIHRoZSBjYXB0dXJlZCBhcHApXG4gICAgLy8gcGx1cyB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLiBPbWl0IHRoZSBibG9jayBlbnRpcmVseVxuICAgIC8vIHdoZW4gbmVpdGhlciBpcyBhdmFpbGFibGUuXG4gICAgY29uc3QgbGFzdFBhZ2UgPSBbLi4ubWVzc2FnZXNdLnJldmVyc2UoKS5maW5kKChtKSA9PiBtLnR5cGUgPT09ICdwYWdlJykgYXMgUGFnZU1lc3NhZ2UgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgZ2l0ID0gbGFzdFBhZ2U/LmdpdENvbnRleHQ7XG4gICAgY29uc3QgZXh0VmVyID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldE1hbmlmZXN0ID8gY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIGlmIChnaXQgfHwgZXh0VmVyKSB7XG4gICAgICBvdXQuYnVpbGQgPSB7fTtcbiAgICAgIGlmIChleHRWZXIpIG91dC5idWlsZC5leHRlbnNpb25WZXJzaW9uID0gZXh0VmVyO1xuICAgICAgaWYgKGdpdD8uY29tbWl0KSBvdXQuYnVpbGQuY29tbWl0ID0gZ2l0LmNvbW1pdDtcbiAgICAgIGlmIChnaXQ/LmJyYW5jaCkgb3V0LmJ1aWxkLmJyYW5jaCA9IGdpdC5icmFuY2g7XG4gICAgICBpZiAoZ2l0Py5idWlsZCkgb3V0LmJ1aWxkLmRlcGxveUJ1aWxkID0gZ2l0LmJ1aWxkO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCBidWlsZEpzb25sID0gKGZpbGVuYW1lRm9yTWFuaWZlc3Q/OiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddID0gJ2pzb25sJyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlbmFtZUZvck1hbmlmZXN0ID8/IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSBidWlsZE1hbmlmZXN0KGZpbGVuYW1lLCBmb3JtYXQpO1xuICAgIGNvbnN0IGxpbmVzID0gYnVpbGRTbGltKCk7XG4gICAgaWYgKCFsaW5lcy5sZW5ndGgpIHtcbiAgICAgIC8vIEV2ZW4gYW4gZW1wdHkgd29ya3NwYWNlIGdldHMgYSBtYW5pZmVzdCBsaW5lIHNvIGRvd25zdHJlYW0gdG9vbHNcbiAgICAgIC8vIGNhbiB2ZXJpZnkgdGhlIGZpbGUgd2FzIGdlbmVyYXRlZCBieSBQaW5jaEdyYWIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpICsgJ1xcbic7XG4gICAgfVxuICAgIHJldHVybiBbSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLCAuLi5saW5lcy5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKV0uam9pbignXFxuJykgKyAnXFxuJztcbiAgfTtcbiAgY29uc3QgZG93bmxvYWRGaWxlID0gKGNvbnRlbnQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZSA9ICd0ZXh0L3BsYWluJyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2NvbnRlbnRdLCB7dHlwZTogbWltZX0pKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCBvbkNvcHlBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBpZiAodGV4dC50cmltKCkuc3BsaXQoJ1xcbicpLmxlbmd0aCA8PSAxICYmICFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIC8vIE1hbmlmZXN0LW9ubHkgb3V0cHV0IGZvciBhbiBlbXB0eSB3b3Jrc3BhY2Ugc2hvdWxkbid0IHByZXRlbmQgdG8gYmUgYSBjb3B5LlxuICAgICAgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGNvcHknLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgc2V0U3RhdHVzKGBDb3BpZWQgSlNPTkwgwrcgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gICAgc2hvd0NvcGllZCgnQ29waWVkIEpTT05MJywgYCR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICB9O1xuICAvLyBTYXZlIHRocm91Z2ggdGhlIGJhY2tncm91bmQncyBmaWxlIGJyaWRnZSBpZiB3ZSdyZSBpbiBhbiBleHRlbnNpb25cbiAgLy8gY29udGV4dCwgc28gdGhlIGZpbGUgbGFuZHMgdW5kZXIgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9leHBvcnRzLy5cbiAgLy8gT3RoZXJ3aXNlICh0ZXN0IHBhZ2UsIGRldiBzZXJ2ZXIpLCBmYWxsIGJhY2sgdG8gYSBzeW50aGV0aWMgYmxvYiBVUkwuXG4gIGNvbnN0IHNhdmVFeHBvcnRUb0Rpc2sgPSBhc3luYyAodGV4dDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lOiBzdHJpbmcsIGtpbmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayDihpInLCB7ZmlsZW5hbWUsIG1pbWUsIHNpemU6IHRleHQubGVuZ3RoLCBraW5kfSk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe2tpbmQ6ICdzYXZlLXRleHQnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZSwgdGV4dCwgbWltZX0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgc2V0U3RhdHVzKGBFeHBvcnRlZCDCtyAke2xhc3RFeHBvcnQuY29weVBhdGh9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kICh3b3JrZXIgZGVhZD8gcmVsb2FkIGV4dGVuc2lvbiBhdCBjaHJvbWU6Ly9leHRlbnNpb25zKSc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkb3dubG9hZEZpbGUodGV4dCwgZmlsZW5hbWUsIG1pbWUpO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIHNldFN0YXR1cygnRXhwb3J0ZWQnKTtcbiAgfTtcbiAgY29uc3Qgb25FeHBvcnQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGV4cG9ydCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKGZpbGVuYW1lKTtcbiAgICBhd2FpdCBzYXZlRXhwb3J0VG9EaXNrKHRleHQsIGZpbGVuYW1lLCAnYXBwbGljYXRpb24vanNvbmwnLCAnanNvbmwnKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIHRhci56c3Qgd29ya3NwYWNlIGV4cG9ydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQnVuZGxlIEpTT05MICsgUkVBRE1FICsgRHVja0RCIHJlY2lwZXMgKyBzY3JlZW5zaG90cy5qc29uICsgYWN0dWFsIFBOR1xuICAvLyBzY3JlZW5zaG90cyBpbnRvIGEgc2luZ2xlIC50YXIuenN0IGFyY2hpdmUuIHRhciBnaXZlcyB1cyBhIGNsZWFuXG4gIC8vIGNvbnRhaW5lciAob25lIGZpbGUgcGVyIGVudHJ5LCBubyB6aXAtc3R5bGUgY2VudHJhbC1kaXJlY3RvcnlcbiAgLy8gY29udG9ydGlvbnMpOyB6c3RkIGlzIHRoZSBtb2Rlcm4gY29tcHJlc3Npb24gcGFpci4gSW1wbGVtZW50YXRpb24gaXNcbiAgLy8gcHVyZS1UUyDigJQgc2VlIHNyYy90YXIudHMgZm9yIHRoZSBlbmNvZGVyICsgenN0ZC1mcmFtZSB3cml0ZXIuXG4gIC8vIEJ1ZyAjMjg6IGEgSlNPTi1TY2hlbWEgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZSBpbiB0aGUgSlNPTkwuXG4gIC8vIFJlY2VpdmVycyBjYW4gdXNlIHRoaXMgdG8gdmFsaWRhdGUgZml4dHVyZXMsIGRyaXZlIGF1dG9jb21wbGV0ZSBpblxuICAvLyBlZGl0b3JzLCBhbmQgYXV0by1nZW5lcmF0ZSBwYXJzZXJzLiBLZWVwIHRoaXMgaW4gc3luYyB3aXRoIHRoZVxuICAvLyBzaGFwZXMgZW1pdHRlZCBieSBidWlsZFNsaW0vc2xpbUVudHJ5IOKAlCBgbnBtIHJ1biB0ZXN0YCB2YWxpZGF0ZXMgYVxuICAvLyBzYW1wbGUgYWdhaW5zdCB0aGlzIHNjaGVtYS5cbiAgY29uc3QgYnVpbGRTY2hlbWFKc29uID0gKCk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LzIwMjAtMTIvc2NoZW1hJyxcbiAgICAkaWQ6ICdodHRwczovL3dyYW5uZ2xlLmNvbS9waW5jaGdyYWIvZXhwb3J0LnYyLnNjaGVtYS5qc29uJyxcbiAgICB0aXRsZTogJ1BpbmNoR3JhYiBleHBvcnQgKHYyKScsXG4gICAgZGVzY3JpcHRpb246ICdKU09OTCByb3cgKyBtYW5pZmVzdCBzY2hlbWFzIGZvciBQaW5jaEdyYWIgd29ya3NwYWNlIGV4cG9ydHMuJyxcbiAgICBvbmVPZjogW1xuICAgICAgeyRyZWY6ICcjLyRkZWZzL21hbmlmZXN0J30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvcGFnZSd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3NlbGVjdG9yJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvZmVlZGJhY2snfSxcbiAgICBdLFxuICAgICRkZWZzOiB7XG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3Rvb2wnLCAndHMnLCAnd29ya3NwYWNlJywgJ2ZpbGVuYW1lJywgJ2Zvcm1hdCcsICdob3N0cycsICdjb3VudHMnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnbWFuaWZlc3QnfSxcbiAgICAgICAgICB0b29sOiB7Y29uc3Q6ICdwaW5jaGdyYWInfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHdvcmtzcGFjZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmaWxlbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmb3JtYXQ6IHtlbnVtOiBbJ2pzb25sJywgJ21hcmtkb3duJywgJ3Rhci56c3QnXX0sXG4gICAgICAgICAgaG9zdHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcGF0aFJvb3Q6IHtlbnVtOiBbJ2FyY2hpdmUnLCAnd29ya3NwYWNlJ119LFxuICAgICAgICAgIGNvdW50czoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvcnMnLCAnZmVlZGJhY2snLCAncGFnZXMnXSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgc2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBwYWdlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGdyb3VwTWVtYmVyczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNraWxsOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzaWduOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBleHRlbnNpb25WZXJzaW9uOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlydHk6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBkZXBsb3lCdWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHBvcnREaWFnbm9zdGljczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWydzZXZlcml0eScsICdjb2RlJ10sXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eToge2VudW06IFsnZXJyb3InLCAnd2FybicsICdpbmZvJ119LFxuICAgICAgICAgICAgICAgIGNvZGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwYWdlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndHMnLCAndXJsJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3BhZ2UnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGl0bGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgIHRva2Vuczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgdXNlckFnZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGxhbmc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ2l0Q29udGV4dDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBidWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXNzaW9uSWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAnbicsICd0cycsICd1cmwnLCAndGFnJywgJ3NlbGVjdG9yJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3NlbGVjdG9yJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIG46IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGNhcHR1cmVJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZXZlbnRJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgdmlzdWFsT3JkZXI6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGRpc3BsYXlMYWJlbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGFnOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yTWF0Y2hDb3VudDoge3R5cGU6ICdpbnRlZ2VyJywgbWluaW11bTogMH0sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByZW5kZXJlZFRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBhY2Nlc3NpYmxlTmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBhdHRyczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcmVjdDogeyRyZWY6ICcjLyRkZWZzL3JlY3QnfSxcbiAgICAgICAgICBzdGF0ZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZnJhbWV3b3JrOiB7ZW51bTogWydyZWFjdCcsICd2dWUnLCAnbGl0JywgJ3N0ZW5jaWwnLCAnc3ZlbHRlJywgJ3dlYi1jb21wb25lbnQnXX0sXG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjaGFpbjoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge2ZpbGU6IHt0eXBlOiBbJ3N0cmluZycsICdudWxsJ119LCBsaW5lOiB7dHlwZTogWydpbnRlZ2VyJywgJ251bGwnXX19LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG91dGVySFRNTDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzdHlsZXM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHNjcmVlbnNob3Q6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBncm91cDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGFnZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2FwdHVyZWRBdDoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaGFkb3dIb3N0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBncm91cFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBncm91cE1lbWJlclVpZHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgX2F1ZGl0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYW5jZXN0b3JzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9hbmNlc3Rvcid9fSxcbiAgICAgICAgICAgICAgY29tcG9uZW50Um9vdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBwc2V1ZG9FbGVtZW50czoge3R5cGU6ICdvYmplY3QnfSxcbiAgICAgICAgICAgICAgbWF0Y2hlZFJ1bGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9tYXRjaGVkUnVsZSd9fSxcbiAgICAgICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGZlZWRiYWNrOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ3RzJywgJ3RleHQnLCAndGFncyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdmZWVkYmFjayd9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHBhcmVudFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWdzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGlzVGVzdERhdGE6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHZpZXdwb3J0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdzoge3R5cGU6ICdpbnRlZ2VyJ30sIGg6IHt0eXBlOiAnaW50ZWdlcid9LCBkcHI6IHt0eXBlOiAnbnVtYmVyJ30sXG4gICAgICAgICAgY29sb3JTY2hlbWU6IHtlbnVtOiBbJ2xpZ2h0JywgJ2RhcmsnXX0sXG4gICAgICAgICAgcmVkdWNlZE1vdGlvbjoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgZGlyZWN0aW9uOiB7ZW51bTogWydsdHInLCAncnRsJ119LFxuICAgICAgICAgIHpvb206IHt0eXBlOiAnbnVtYmVyJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVjdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsneCcsICd5JywgJ3cnLCAnaCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7eDoge3R5cGU6ICdudW1iZXInfSwgeToge3R5cGU6ICdudW1iZXInfSwgdzoge3R5cGU6ICdudW1iZXInfSwgaDoge3R5cGU6ICdudW1iZXInfX0sXG4gICAgICB9LFxuICAgICAgYW5jZXN0b3I6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3RhZyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdGFnOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJvbGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGVzdElkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGNsYXNzZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbWF0Y2hlZFJ1bGU6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9yJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzZWxlY3Rvcjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBkZWNsYXJhdGlvbnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIG1lZGlhOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LCBudWxsLCAyKSArICdcXG4nO1xuXG4gIC8vIEdlbmVyYXRlIHJlcGFpci1pbmRleC5tZCBhcyBhIHN0cnVjdHVyZWQgc3RhcnRpbmcgcG9pbnQgZm9yIGFuXG4gIC8vIGF1dG9ub21vdXMgY29kaW5nIGFnZW50LiBGb3IgZXZlcnkgZmVlZGJhY2sgcm93LCBtZWNoYW5pY2FsbHkgZGVyaXZlOlxuICAvLyAgIOKAoiB0YXJnZXQgaWRlbnRpdHkgKHVpZCwgc2VsZWN0b3IsIHRhZywgYWNjZXNzaWJsZSBuYW1lKVxuICAvLyAgIOKAoiBzY3JlZW5zaG90IHBhdGggKHdpdGggYXJjaGl2ZS1yZWxhdGl2ZSBmb3JtKVxuICAvLyAgIOKAoiBzb3VyY2UgaGludHMgKGNvbXBvbmVudCBjaGFpbiwgc291cmNlbWFwIGZpbGUvbGluZSlcbiAgLy8gICDigKIgc3VnZ2VzdGVkIGZpeCBjYXRlZ29yeSAoY2hlYXAgaGV1cmlzdGljIG9uIHRleHQpXG4gIC8vIFRoZSBhZ2VudCB1c2VzIHRoaXMgYXMgYSBzdGFydGluZyBwdW5jaCBsaXN0LCB0aGVuIHZhbGlkYXRlcyArXG4gIC8vIHJlZmluZXMgZWFjaCBzdWdnZXN0aW9uIGFnYWluc3QgdGhlIGZ1bGwgSlNPTkwuXG4gIGNvbnN0IGluZmVyRmVlZGJhY2tDYXRlZ29yeSA9ICh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKC9cXGIodHlwb3xjb3B5fHdvcmRpbmd8bGFiZWx8bWlzc3BlbGx8Z3JhbW1hcnxjYXBpdGFsaXopLy50ZXN0KHQpKSByZXR1cm4gJ2NvcHknO1xuICAgIGlmICgvXFxiKGFsaWdufHNwYWNpbmd8cGFkZGluZ3xtYXJnaW58bGF5b3V0fG92ZXJsYXB8Y3Jvd2RlZHxjcmFtcGVkfHRpZ2h0fGdhcCkvLnRlc3QodCkpIHJldHVybiAnbGF5b3V0JztcbiAgICBpZiAoL1xcYih1bmNsZWFyfGNvbmZ1c2luZ3x3aGF0IGRvZXN8d2hhdCBpc3xkb24ndCB1bmRlcnN0YW5kfGhhcmQgdG98bmF2fG5hdmlnYXRpb24pLy50ZXN0KHQpKSByZXR1cm4gJ2FmZm9yZGFuY2UnO1xuICAgIGlmICgvXFxiKGNvbnRyYXN0fGNvbG9yIGJsaW5kfHNjcmVlbiByZWFkZXJ8YXJpYXxmb2N1c3xrZXlib2FyZHx0YWJ8YTExeXxhY2Nlc3NpYikvLnRlc3QodCkpIHJldHVybiAnYWNjZXNzaWJpbGl0eSc7XG4gICAgaWYgKC9cXGIoYnJva2VufGNyYXNofG51bGx8dW5kZWZpbmVkfGVycm9yfDQwNHxmYWlsKS8udGVzdCh0KSkgcmV0dXJuICdzdGF0ZSc7XG4gICAgaWYgKC9cXGIodWdseXxjb2xvcnxncmFkaWVudHxzaGFkb3d8cG9saXNofHZpc3VhbHxzdHlsZSkvLnRlc3QodCkpIHJldHVybiAndmlzdWFsLXBvbGlzaCc7XG4gICAgcmV0dXJuICd1bnNwZWNpZmllZCc7XG4gIH07XG4gIGNvbnN0IGJ1aWxkUmVwYWlySW5kZXggPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHlwZSBSb3cgPSB7ZmVlZGJhY2s6IEZlZWRiYWNrTWVzc2FnZTsgcGFyZW50PzogU2VsZWN0b3JNZXNzYWdlfTtcbiAgICBjb25zdCByb3dzOiBSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGJ5VWlkID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWVzc2FnZT4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGJ5VWlkLnNldChtLmVudHJ5LnVpZCwgbSk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnZmVlZGJhY2snKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG0ucGFyZW50VWlkID8gYnlVaWQuZ2V0KG0ucGFyZW50VWlkKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJvd3MucHVzaCh7ZmVlZGJhY2s6IG0sIHBhcmVudH0pO1xuICAgIH1cbiAgICBpZiAoIXJvd3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnIyByZXBhaXItaW5kZXgubWQnLFxuICAgICAgICAnJyxcbiAgICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgICAnJyxcbiAgICAgICAgJ18obm8gZmVlZGJhY2sgaW4gdGhpcyBleHBvcnQg4oCUIG5vdGhpbmcgdG8gcmVwYWlyKV8nLFxuICAgICAgICAnJyxcbiAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBvdXQucHVzaCgnIyByZXBhaXItaW5kZXgubWQnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gKTtcbiAgICBvdXQucHVzaChgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGAgwrcgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIHx8ICcobm9uZSknfWApO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQSBzdGFydGluZyBwdW5jaCBsaXN0IGZvciBhbiBhdXRvbm9tb3VzIHJlcGFpciBhZ2VudC4gRWFjaCByb3cgaXMgb25lIHVzZXIgY29tcGxhaW50IHdpdGggdGhlIGRhdGEgbmVlZGVkIHRvIGxvY2F0ZSwgZml4LCBhbmQgdmVyaWZ5LiBDcm9zcy1yZWZlcmVuY2UgYCcgKyBqc29ubE5hbWUgKyAnYCBmb3IgdGhlIGZ1bGwgcmVjb3JkLicpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnIyMgVGFza3MnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgcm93cy5mb3JFYWNoKCh7ZmVlZGJhY2ssIHBhcmVudH0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGZiSWQgPSBgRiR7U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgzLCAnMCcpfWA7XG4gICAgICBjb25zdCB0YXJnZXQgPSBwYXJlbnQ/LmVudHJ5O1xuICAgICAgb3V0LnB1c2goYCMjIyAke2ZiSWR9IOKAlCAke2ZlZWRiYWNrLnRleHQuc2xpY2UoMCwgODApfSR7ZmVlZGJhY2sudGV4dC5sZW5ndGggPiA4MCA/ICfigKYnIDogJyd9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgPiAke2ZlZWRiYWNrLnRleHQuc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbj4gJyl9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgLSAqKmZlZWRiYWNrVWlkOioqIFxcYCR7ZmVlZGJhY2suaWR9XFxgYCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIFxcYCR7dGFyZ2V0LnNlbGVjdG9yfVxcYCBfKHVpZCBcXGAke3RhcmdldC51aWR9XFxgLCBuPSR7dGFyZ2V0Lm59KV9gKTtcbiAgICAgICAgaWYgKHRhcmdldC50YWcpIG91dC5wdXNoKGAtICoqdGFnOioqIFxcYDwke3RhcmdldC50YWd9PlxcYCR7dGFyZ2V0LnJvbGUgPyBgIMK3IHJvbGU9XFxgJHt0YXJnZXQucm9sZX1cXGBgIDogJyd9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIG91dC5wdXNoKGAtICoqYWNjZXNzaWJsZSBuYW1lOioqIFwiJHt0YXJnZXQuYWNjZXNzaWJsZU5hbWUuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICBpZiAodGFyZ2V0LnRleHQgJiYgdGFyZ2V0LnRleHQgIT09IHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqdmlzaWJsZSB0ZXh0OioqIFwiJHt0YXJnZXQudGV4dC5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2VsZWN0b3IgcXVhbGl0eToqKiBtYXRjaGVzICR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudH0gZWxlbWVudCR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90LmVsZW1lbnR9XFxgYCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90IChncm91cCk6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5ncm91cH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXyhtaXNzaW5nIOKAlCBzZWUgZXhwb3J0RGlhZ25vc3RpY3MpX2ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50KSB7XG4gICAgICAgICAgY29uc3QgYyA9IHRhcmdldC5jb21wb25lbnQ7XG4gICAgICAgICAgY29uc3QgY2ggPSBjLmNoYWluICYmIGMuY2hhaW4ubGVuZ3RoID8gYCDCtyBjaGFpbiAke2MuY2hhaW4uc2xpY2UoMCwgNSkubWFwKChuKSA9PiAnYCcgKyBuICsgJ2AnKS5qb2luKCcg4oaSICcpfWAgOiAnJztcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmNvbXBvbmVudDoqKiBcXGAke2MubmFtZSA/PyBjLmRpc3BsYXlOYW1lID8/ICc/J31cXGAgKCR7Yy5mcmFtZXdvcmt9KSR7Y2h9YCk7XG4gICAgICAgICAgaWYgKGMuc291cmNlPy5maWxlKSBvdXQucHVzaChgLSAqKnNvdXJjZToqKiBcXGAke2Muc291cmNlLmZpbGV9XFxgJHtjLnNvdXJjZS5saW5lID8gYDoke2Muc291cmNlLmxpbmV9YCA6ICcnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50Um9vdCkgb3V0LnB1c2goYC0gKipjb21wb25lbnQgcm9vdDoqKiAke3RhcmdldC5jb21wb25lbnRSb290fWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFuY2VzdG9ycyAmJiB0YXJnZXQuYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gdGFyZ2V0LmFuY2VzdG9ycy5zbGljZSgwLCA0KS5tYXAoKGEpID0+IGA8JHthLnRhZ30+JHthLmlkID8gJyMnICsgYS5pZCA6IGEudGVzdElkID8gYFt0ZXN0SWQ9XCIke2EudGVzdElkfVwiXWAgOiAnJ31gKS5qb2luKCcg4oC6ICcpO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqYW5jZXN0b3IgY2hhaW46KiogJHtjaGFpbn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnVybCkgb3V0LnB1c2goYC0gKip1cmw6KiogJHt0YXJnZXQudXJsfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXyhubyBzZWxlY3RvciDigJQgb3JwaGFuZWQgZmVlZGJhY2spX2ApO1xuICAgICAgfVxuICAgICAgY29uc3QgY2F0ID0gaW5mZXJGZWVkYmFja0NhdGVnb3J5KGZlZWRiYWNrLnRleHQpO1xuICAgICAgb3V0LnB1c2goYC0gKipzdWdnZXN0ZWQgY2F0ZWdvcnk6KiogJHtjYXR9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgfSk7XG4gICAgb3V0LnB1c2goJy0tLScpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQ2F0ZWdvcmllcyBhcmUgaW5mZXJyZWQgZnJvbSBmZWVkYmFjayB0ZXh0IHZpYSBrZXl3b3JkIGhldXJpc3RpY3Mg4oCUIHZlcmlmeSBiZWZvcmUgYWN0aW5nLicpO1xuICAgIHJldHVybiBvdXQuam9pbignXFxuJyk7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRSZWFkbWUgPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZywgc2hvdENvdW50OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICcjIFBpbmNoR3JhYiBXb3Jrc3BhY2UgRXhwb3J0JyxcbiAgICAgICcnLFxuICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgYCxcbiAgICAgIGBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5sZW5ndGggPyBtYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgOiAnKG5vbmUpJ31gLFxuICAgICAgYENvdW50czogKioke21hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnN9Kiogc2VsZWN0b3JzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMuZmVlZGJhY2t9KiogY29tbWVudHMgwrcgKioke21hbmlmZXN0LmNvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7c2hvdENvdW50fSoqIHNjcmVlbnNob3RzYCxcbiAgICAgICcnLFxuICAgICAgJyMjIFRyaWFnZSBtYXRlcmlhbHMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lXG4gICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIGJ1bmRsZWQgYXQgXFxgLi8ke21hbmlmZXN0LnNraWxsLmFyY2hpdmVQYXRoID8/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfVxcYCR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCBhcyBhdXRob3JpdGF0aXZlKV8nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBnZW5lcmljIGJvaWxlcnBsYXRlLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBob3cgdG8gcmVhZCB0aGlzIGV4cG9ydCBhbmQgdHJpYWdlIHRoZSBjYXB0dXJlcy5gXG4gICAgICAgIDogKG1hbmlmZXN0LnNraWxsPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogXFxgJHttYW5pZmVzdC5za2lsbC5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lXG4gICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogYnVuZGxlZCBpbmxpbmUgYXQgXFxgLi8ke21hbmlmZXN0LmRlc2lnbi5hcmNoaXZlUGF0aCA/PyAnREVTSUdOLm1kJ31cXGAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IHRoZSB0b2tlbnMgLyB2b2ljZSBydWxlcyBhcyBwcm9qZWN0IGNhbm9uKV8nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgcGxhY2Vob2xkZXIsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGNvbG9yIHRva2VucywgdHlwb2dyYXBoeSwgc3BhY2luZywgbW90aW9uLCB2b2ljZS5gXG4gICAgICAgIDogKG1hbmlmZXN0LmRlc2lnbj8ucGF0aFxuICAgICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogXFxgJHttYW5pZmVzdC5kZXNpZ24ucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgICcnLFxuICAgICAgJyMjIEZpbGVzJyxcbiAgICAgICcnLFxuICAgICAgJy0gYHJlcGFpci1pbmRleC5tZGAg4oCUIGFnZW50LWZyaWVuZGx5IHRyaWFnZSBwdW5jaCBsaXN0IChzdGFydCBoZXJlKS4nLFxuICAgICAgYC0gXFxgJHtqc29ubE5hbWV9XFxgIOKAlCBKU09OTCBzdHJlYW0gKG9uZSBjYXB0dXJlIHBlciBsaW5lLCBsZWFkaW5nIG1hbmlmZXN0LCBzY2hlbWEgdjIpLmAsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMvKi5wbmdgIOKAlCBmdWxsLXJlc29sdXRpb24gUE5HcyBvZiBlYWNoIGNhcHR1cmVkIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UuJyxcbiAgICAgICctIGBzY3JlZW5zaG90cy5qc29uYCDigJQgdWlkLWtleWVkIGluZGV4OiBgYnlVaWRbdWlkXSDihpIgeyBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPyB9YCwgYGJ5VXJsW3VybF0g4oaSIHsgcGFnZT8sIHVpZHNbXSB9YCwgcGx1cyBhIGZsYXQgYGZpbGVzW11gIGxpc3RpbmcuJyxcbiAgICAgICctIGBzY2hlbWEuanNvbmAg4oCUIEpTT04tU2NoZW1hIChkcmFmdCAyMDIwLTEyKSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlLicsXG4gICAgICAnLSBgZHVja2RiLnNxbGAg4oCUIGNvcHktYW5kLXBhc3RlIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIHRoZSBKU09OTCB3aXRoIER1Y2tEQi4nLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmUgPyBgLSBcXGBERVNJR04ubWRcXGAg4oCUICR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAncHJvamVjdC1jdXN0b21pemVkIGRlc2lnbiBzb3VyY2Utb2YtdHJ1dGggKHRydXN0IGFzIGNhbm9uaWNhbCkuJyA6IG1hbmlmZXN0LmRlc2lnbi50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgREVTSUdOLm1kIHRlbXBsYXRlIChwbGFjZWhvbGRlciDigJQgdmVyaWZ5IGJlZm9yZSBhcHBseWluZykuJyA6ICcnfWAgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmUgPyBgLSBcXGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRcXGAg4oCUICR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgdHJpYWdlIHNraWxsLicgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgZGVmYXVsdCB0cmlhZ2Ugc2tpbGwgKHRlbXBsYXRlIGNvbnRlbnQpLicgOiAnJ31gIDogJycsXG4gICAgICAnJyxcbiAgICAgICcjIyBFeHRyYWN0aW5nJyxcbiAgICAgICcnLFxuICAgICAgJ1BpY2sgd2hpY2hldmVyIHZhcmlhbnQgeW91ciBtYWNoaW5lIHN1cHBvcnRzIOKAlCBub3QgZXZlcnkgc3lzdGVtIHNoaXBzIGB6c3RkYC4nLFxuICAgICAgJycsXG4gICAgICAnYGBgc2gnLFxuICAgICAgJyMgMS4gTW9kZXJuIHRhciB3aXRoIGJ1aWx0LWluIHpzdGQgc3VwcG9ydCAoTGludXggKyByZWNlbnQgbWFjT1MpOicsXG4gICAgICBgdGFyIC0tenN0ZCAteGYgJHttYW5pZmVzdC5maWxlbmFtZX1gLFxuICAgICAgJycsXG4gICAgICAnIyAyLiB0YXIgKyBzdGFuZGFsb25lIHpzdGQgQ0xJOicsXG4gICAgICBgenN0ZCAtZCAke21hbmlmZXN0LmZpbGVuYW1lfSAtbyAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgIGB0YXIgLXhmICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgJycsXG4gICAgICAnIyAzLiBQdXJlLU5vZGUgZmFsbGJhY2sgKG5vIHpzdGQgQ0xJIC8gbm8gdGFyKTonLFxuICAgICAgYG5weCAteSBAcm9ub21vbi96c3RhbmRhcmQgPCAke21hbmlmZXN0LmZpbGVuYW1lfSA+ICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYCMg4oCmIHRoZW4gdXNlIGFueSB0YXIgcmVhZGVyIChlLmcuIFxcYG5weCB0YXItc3RyZWFtXFxgKWAsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJ0V4cGVjdGVkIGZpbGUgbGlzdCBhZnRlciBleHRyYWN0aW9uOicsXG4gICAgICAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgYCR7anNvbmxOYW1lfSAgICAgICAgICAgICAgICAgICAgIyBKU09OTCBzdHJlYW0gKHRoZSBzb3VyY2Ugb2YgdHJ1dGgpYCxcbiAgICAgIGBzY3JlZW5zaG90cy8gICAgICAgICAgICAgICAgICAgICMgZWxlbWVudCAvIGdyb3VwIC8gcGFnZSBQTkdzYCxcbiAgICAgIGBzY3JlZW5zaG90cy5qc29uICAgICAgICAgICAgICAgICMgdWlkLWtleWVkIGxvb2t1cCBpbmRleGAsXG4gICAgICBgZHVja2RiLnNxbCAgICAgICAgICAgICAgICAgICAgICAjIGNvcHktcGFzdGUgU1FMIHJlY2lwZXNgLFxuICAgICAgYHNjaGVtYS5qc29uICAgICAgICAgICAgICAgICAgICAgIyBKU09OLVNjaGVtYSBmb3IgZXZlcnkgcm93IHR5cGVgLFxuICAgICAgYFJFQURNRS5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB0aGlzIGZpbGVgLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmUgPyAnREVTSUdOLm1kICAgICAgICAgICAgICAgICAgICAgICAjIHZpc3VhbCBpZGVudGl0eSBzb3VyY2Utb2YtdHJ1dGgnIDogJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lID8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCAgIyB0cmlhZ2UgaW5zdHJ1Y3Rpb25zJyA6ICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICcjIyBRdWljayBEdWNrREInLFxuICAgICAgJycsXG4gICAgICAnYGBgc3FsJyxcbiAgICAgIGBDUkVBVEUgVEFCTEUgY2FwdHVyZXMgQVMgU0VMRUNUICogRlJPTSByZWFkX2pzb25fYXV0bygnJHtqc29ubE5hbWV9JywgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwKTtgLFxuICAgICAgXCJTRUxFQ1Qgbiwgc2VsZWN0b3IsIHRhZywgcm9sZSwgaGludHMgRlJPTSBjYXB0dXJlcyBXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBMSU1JVCAyMDtcIixcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgU2NoZW1hJyxcbiAgICAgICcnLFxuICAgICAgJ1NlbGVjdG9yIGxpbmVzIGhhdmUgYHR5cGU6IFwic2VsZWN0b3JcImAsIGB2OiAyYCwgYSBzdGFibGUgYHVpZGAsIHRvcC1sZXZlbCBpZGVudGlmaWNhdGlvbiBmaWVsZHMsIGFuZCBhbiBgX2F1ZGl0YCBuYW1lc3BhY2UgbmVzdGluZyBkZXRlY3Rpb24gbWV0YWRhdGEgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwgbWF0Y2hlZFJ1bGVzLCB2aWV3cG9ydCkuIEZlZWRiYWNrIGxpbmVzIGxpbmsgYmFjayB2aWEgYHBhcmVudFVpZGAgYW5kIGNhcnJ5IHRoZWlyIG93biBgdWlkYC4gR3JvdXAgaGVhZHMgY2FycnkgYGdyb3VwTWVtYmVyVWlkczogW3VpZOKApl1gOyBlYWNoIGdyb3VwIG1lbWJlciBpcyBhIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nIGJhY2sgYXQgdGhlIGhlYWQuIEJ1bmRsZWQgYHNjaGVtYS5qc29uYCBpcyB0aGUgY2Fub25pY2FsIG1hY2hpbmUtcmVhZGFibGUgZm9ybS4nLFxuICAgICAgJycsXG4gICAgXTtcbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gIH07XG4gIC8vIHNjcmVlbnNob3RzLmpzb24g4oCUIHByb3BlciBrZXllZCBpbmRleCBpbnN0ZWFkIG9mIHRoZSBvbGQgVFNWLiBUaHJlZVxuICAvLyBzaGFwZXMgZm9yIHRocmVlIGxvb2t1cCBwYXR0ZXJuczpcbiAgLy8gICDigKIgYnlVaWQ6ICB1aWQg4oaSIHsgbiwgc2VsZWN0b3IsIHVybCwgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8sIG1lbWJlcnM/IH1cbiAgLy8gICAgICAgICAgICAgIFwiZ2l2ZSBtZSBldmVyeSBzaG90IGZvciB0aGlzIGVudHJ5XCJcbiAgLy8gICDigKIgYnlVcmw6ICB1cmwg4oaSIHsgcGFnZT8sIHVpZHNbXSB9XG4gIC8vICAgICAgICAgICAgICBcIndoYXQgcGFnZSBzaG90IGNvdmVycyB0aGlzIFVSTD8gd2hpY2ggY2FwdHVyZXMgbGFuZGVkIGhlcmU/XCJcbiAgLy8gICDigKIgZmlsZXM6ICBmbGF0IGxpc3Qgb2YgZXZlcnkgUE5HIHBhdGggaW4gdGhlIGFyY2hpdmVcbiAgLy8gICAgICAgICAgICAgIFwid2hhdCdzIGluIHNjcmVlbnNob3RzLyA/XCJcbiAgLy8gVGhlIGBpbkFyY2hpdmVgIGZsYWcgb24gZWFjaCBmaWxlIG1pcnJvcnMgdGhlIHRhciBidW5kbGUgbWVtYmVyc2hpcFxuICAvLyBzbyBhIGNvbnN1bWVyIGRvd25zdHJlYW0gb2YgdGhlIC50YXIuenN0IGV4dHJhY3Rpb24gY2FuIHRlbGwgd2hpY2hcbiAgLy8gcGF0aHMgcG9pbnQgSU5TSURFIHRoZSBhcmNoaXZlIChyZWxhdGl2ZSkgdnMgYXQgb24tZGlzayBzaWJsaW5ncy5cbiAgY29uc3QgYnVpbGRTY3JlZW5zaG90c0luZGV4ID0gKGJ1bmRsZWQ6IFNldDxzdHJpbmc+KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IGFyY2hpdmVOYW1lID0gYnVpbGRFeHBvcnRGaWxlbmFtZSgndGFyLnpzdCcpO1xuICAgIGNvbnN0IHN0ZW0gPSBhcmNoaXZlTmFtZS5yZXBsYWNlKC9cXC50YXJcXC56c3QkLywgJycpO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IGAke3N0ZW19Lmpzb25sYDtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0Jyk7XG4gICAgLy8gVGhlIEpTT05MIGluc2lkZSB0aGUgYXJjaGl2ZSBtdXN0IGRlY2xhcmUgaXRzZWxmIGFzIHBhcnQgb2YgYVxuICAgIC8vIHRhci56c3QgYnVuZGxlIHNvIGl0cyBtYW5pZmVzdCdzIGBkZXNpZ24uaW5saW5lYCAvIGBza2lsbC5pbmxpbmVgXG4gICAgLy8gZmxhZ3MgbWF0Y2ggd2hhdCdzIGFjdHVhbGx5IHByZXNlbnQgaW4gdGhlIHN1cnJvdW5kaW5nIHRhci5cbiAgICBjb25zdCBqc29ubFRleHQgPSBidWlsZEpzb25sKGpzb25sTmFtZSwgJ3Rhci56c3QnKTtcbiAgICBjb25zdCBzcWwgPSBkdWNrRGJTbmlwcGV0KGpzb25sTmFtZSk7XG4gICAgY29uc3Qge2VudHJpZXM6IHNob3RFbnRyaWVzLCBidW5kbGVkfSA9IGNvbGxlY3RTY3JlZW5zaG90RW50cmllcygpO1xuICAgIGNvbnN0IHJlYWRtZSA9IGJ1aWxkUmVhZG1lKG1hbmlmZXN0LCBqc29ubE5hbWUsIHNob3RFbnRyaWVzLmxlbmd0aCk7XG4gICAgY29uc3Qgc2hvdHNKc29uID0gYnVpbGRTY3JlZW5zaG90c0luZGV4KGJ1bmRsZWQpO1xuXG4gICAgLy8gTWFya2Rvd24gZXhwb3J0IHdhcyBkcm9wcGVkOiBpdCBjYXJyaWVkIG5vIGRhdGEgdGhlIEpTT05MIGRpZG4ndFxuICAgIC8vIGFscmVhZHkgaGF2ZSAodGhlIGh1bWFuLXJlYWRhYmxlIHN1cmZhY2Ugd2FzIGp1c3QgYSBjdXJhdGVkIHN1YnNldFxuICAgIC8vIG9mIHRoZSBzYW1lIGZpZWxkcyksIGFuZCB0aGUgZGl2ZXJnZW5jZSDigJQgbWQgc2lsZW50bHkgZHJvcHBlZFxuICAgIC8vIGdyb3VwIGNoaWxkcmVuICsgdGhlIGVudGlyZSBgX2F1ZGl0YCBuYW1lc3BhY2Ug4oCUIHJpc2tlZFxuICAgIC8vIG1pc2xlYWRpbmcgYW55IGh1bWFuIHNraW0uIFJFQURNRS5tZCBpbnNpZGUgdGhlIGFyY2hpdmUgaXMgdGhlXG4gICAgLy8gaHVtYW4gZW50cnkgcG9pbnQgbm93LlxuICAgIC8vIEJ1ZyAjNzogZ2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIHRoZSBhZ2VudCdzIGZpcnN0LXJlYWQgZW50cnlcbiAgICAvLyBwb2ludC4gQnVnICM0MCBmaXJzdC1yZWFkIG9yZGVyOiBSRUFETUUgcG9pbnRzIHRoZSByZWNlaXZlciBhdFxuICAgIC8vIHJlcGFpci1pbmRleC5tZCBiZWZvcmUgU0tJTEwubWQgLyBERVNJR04ubWQuXG4gICAgY29uc3QgcmVwYWlySW5kZXggPSBidWlsZFJlcGFpckluZGV4KG1hbmlmZXN0LCBqc29ubE5hbWUpO1xuICAgIGNvbnN0IHRhckVudHJpZXM6IFRhckVudHJ5W10gPSBbXG4gICAgICB7bmFtZTogJ1JFQURNRS5tZCcsIGRhdGE6IHJlYWRtZX0sXG4gICAgICB7bmFtZTogJ3JlcGFpci1pbmRleC5tZCcsIGRhdGE6IHJlcGFpckluZGV4fSxcbiAgICAgIHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IGpzb25sVGV4dH0sXG4gICAgICB7bmFtZTogJ3NjcmVlbnNob3RzLmpzb24nLCBkYXRhOiBzaG90c0pzb259LFxuICAgICAge25hbWU6ICdkdWNrZGIuc3FsJywgZGF0YTogc3FsfSxcbiAgICAgIC8vIEJ1ZyAjMjg6IG1hY2hpbmUtcmVhZGFibGUgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlLlxuICAgICAge25hbWU6ICdzY2hlbWEuanNvbicsIGRhdGE6IGJ1aWxkU2NoZW1hSnNvbigpfSxcbiAgICAgIC4uLnNob3RFbnRyaWVzLFxuICAgIF07XG4gICAgLy8gREVTSUdOLm1kIOKAlCBlaXRoZXIgdGhlIHVzZXIncyBjdXN0b21pemVkIGNvbnRlbnQgb3IgdGhlIGJ1bmRsZWRcbiAgICAvLyB0ZW1wbGF0ZSAvIGxvY2FsIG92ZXJyaWRlLiBSZXNvbHZlZCB0aHJvdWdoIHRoZSBzYW1lIGxvYWRlciB0aGVcbiAgICAvLyBzZXR0aW5ncyBtb2RhbCB1c2VzIHNvIGNocm9tZS5zdG9yYWdlIHN0YXlzIHNtYWxsIChlbXB0eSBwcmVmc1xuICAgIC8vIOKGkiBmYWxsYmFjayB0byBleHRlbnNpb24vdGVtcGxhdGVzLyoubWQgdmlhIGZldGNoKS5cbiAgICBjb25zdCBkZXNpZ25Db250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICBpZiAoZGVzaWduQ29udGVudC50cmltKCkpIHtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0RFU0lHTi5tZCcsIGRhdGE6IGRlc2lnbkNvbnRlbnR9KTtcbiAgICB9XG4gICAgLy8gUGluY2hHcmFiIFVJIHNraWxsIOKAlCBzYW1lIHN0b3J5LiBMaXZlcyBhdCB0aGUgY2Fub25pY2FsIHJlY2VpdmVyXG4gICAgLy8gcGF0aCBpbnNpZGUgdGhlIGFyY2hpdmUgc28gdGhlIHJlY2VpdmVyJ3MgYC5hZ2VudHMvYCB0cmVlIGNhbiBiZVxuICAgIC8vIHBvcHVsYXRlZCBieSBhIHNpbXBsZSBgdGFyIC14YCBmcm9tIHRoZSBhcmNoaXZlIHJvb3QuXG4gICAgLy9cbiAgICAvLyBGcm9udG1hdHRlciByZW5hbWU6IGEgdXNlcidzIHNvdXJjZSBTS0lMTC5tZCBtYXkgdXNlIGBuYW1lOiB1aWBcbiAgICAvLyAoYmVjYXVzZSB0aGF0J3MgaG93IGl0J3MgY2F0YWxvZ3VlZCBpbiB0aGVpciBnbG9iYWwgYC5hZ2VudHMvYFxuICAgIC8vIHNraWxscyB0cmVlKS4gSW5zaWRlIGEgUGluY2hHcmFiIGFyY2hpdmUgdGhlIHNraWxsIGlzICp0aGUqXG4gICAgLy8gUGluY2hHcmFiIHNraWxsLCBzbyB3ZSByZWJyYW5kIHRoZSBmcm9udG1hdHRlciBgbmFtZTpgIGZpZWxkIG9uXG4gICAgLy8gdGhlIHdheSBpbnRvIHRoZSB0YXIgd2l0aG91dCB0b3VjaGluZyB0aGUgYm9keS4gT25seSB0aGUgRklSU1RcbiAgICAvLyBgbmFtZTpgIGxpbmUgaW5zaWRlIHRoZSBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHJld3JpdHRlbi5cbiAgICBjb25zdCBza2lsbENvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgaWYgKHNraWxsQ29udGVudC50cmltKCkpIHtcbiAgICAgIGNvbnN0IHJlYnJhbmRlZCA9IHJlYnJhbmRTa2lsbE5hbWUoc2tpbGxDb250ZW50LCAnUGluY2hHcmFiJyk7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLCBkYXRhOiByZWJyYW5kZWR9KTtcbiAgICB9XG4gICAgLy8gUmVidWlsZCB0aGUgbWFuaWZlc3QgbGluZSBpbiB0aGUgSlNPTkwgd2l0aCBhcmNoaXZlSW50ZWdyaXR5XG4gICAgLy8gKGZpbGUgbGlzdCArIHNpemVzKS4gSGFzIHRvIGhhcHBlbiBBRlRFUiBhbGwgdGFyRW50cmllcyBhcmVcbiAgICAvLyBhc3NlbWJsZWQgYnV0IEJFRk9SRSB3ZSB0YXIgdGhlbSwgc28gd2Uga25vdyB3aGF0J3MgaW4gdGhlXG4gICAgLy8gYnVuZGxlLiBUaGVuIHdlIHJlcGxhY2UgdGhlIEpTT05MJ3MgbWFuaWZlc3Qgd2l0aCB0aGUgYXVnbWVudGVkXG4gICAgLy8gdmVyc2lvbi5cbiAgICB0cnkge1xuICAgICAgY29uc3QgaW50ZWdyaXR5OiB7ZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+fSA9IHtmaWxlczogW119O1xuICAgICAgZm9yIChjb25zdCBlIG9mIHRhckVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGUuZGF0YSkgOiAoZS5kYXRhIGFzIFVpbnQ4QXJyYXkpO1xuICAgICAgICBpbnRlZ3JpdHkuZmlsZXMucHVzaCh7cGF0aDogZS5uYW1lLCBzaXplOiBkYXRhLmxlbmd0aH0pO1xuICAgICAgfVxuICAgICAgLy8gUmUtZW1pdCB0aGUgSlNPTkwgd2l0aCB0aGUgYXVnbWVudGVkIG1hbmlmZXN0LiBDaGVhcGVyIHRvIGRvXG4gICAgICAvLyB0aGlzIHJlLXJlbmRlciB0aGFuIHRvIG1haW50YWluIG11dGFibGUgc3RhdGUgdGhyb3VnaCB0aGUgc2xpbVxuICAgICAgLy8gZW1pdC4gV2Ugc3dhcCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGluLXBsYWNlLlxuICAgICAgY29uc3QgYXVnbWVudGVkTWFuaWZlc3QgPSB7Li4ubWFuaWZlc3QsIGFyY2hpdmVJbnRlZ3JpdHk6IGludGVncml0eX07XG4gICAgICBjb25zdCBsaW5lcyA9IGpzb25sVGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICBsaW5lc1swXSA9IEpTT04uc3RyaW5naWZ5KGF1Z21lbnRlZE1hbmlmZXN0KTtcbiAgICAgIGNvbnN0IG5ld0pzb25sID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICBjb25zdCBpZHggPSB0YXJFbnRyaWVzLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBqc29ubE5hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB0YXJFbnRyaWVzW2lkeF0gPSB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBuZXdKc29ubH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnYXJjaGl2ZUludGVncml0eSBjb21wdXRhdGlvbiBmYWlsZWQnLCBlcnIpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhckJ5dGVzID0gYnVpbGRUYXIodGFyRW50cmllcyk7XG4gICAgY29uc3QgYXJjaGl2ZUJ5dGVzID0gd3JhcFpzdGQodGFyQnl0ZXMpO1xuXG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdvbkV4cG9ydEFyY2hpdmUg4oaSJywge2FyY2hpdmVOYW1lLCB0YXJCeXRlczogdGFyQnl0ZXMubGVuZ3RoLCBhcmNoaXZlQnl0ZXM6IGFyY2hpdmVCeXRlcy5sZW5ndGgsIHNjcmVlbnNob3RzOiBzaG90RW50cmllcy5sZW5ndGh9KTtcbiAgICAgIC8vIFBhc3MgYXMgYSBwbGFpbiBudW1iZXJbXSBvdmVyIHNlbmRNZXNzYWdlOyBzdHJ1Y3R1cmVkLWNsb25lIG9mXG4gICAgICAvLyBVaW50OEFycmF5IHZpYSBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBpc24ndCByZWxpYWJsZSBhY3Jvc3NcbiAgICAgIC8vIENocm9tZSB2ZXJzaW9ucy5cbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzYXZlLWJ5dGVzJywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWU6IGFyY2hpdmVOYW1lLFxuICAgICAgICBieXRlczogQXJyYXkuZnJvbShhcmNoaXZlQnl0ZXMpLCBtaW1lOiAnYXBwbGljYXRpb24venN0ZCcsXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICAvLyBBdXRvLWNvcHkgdGhlIGFic29sdXRlIHBhdGggdG8gY2xpcGJvYXJkIHNvIHRoZSB1c2VyIGRvZXNuJ3RcbiAgICAgICAgLy8gaGF2ZSB0byBodW50IGZvciBpdC4gVGhlIHRvb2xiYXIgY29sbGFwc2VkIHRoZSBkZWRpY2F0ZWRcbiAgICAgICAgLy8gXCJjb3B5IHBhdGhcIiBidXR0b24gaW50byB0aGlzIHNpbmdsZSBhY3Rpb24uXG4gICAgICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGNvbnN0IHBhdGhDb3BpZWQgPSBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQocGF0aFRvQ29weSk7XG4gICAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICAgIGlmIChwYXRoQ29waWVkKSBzaG93Q29waWVkKCdFeHBvcnRlZCBhbmQgY29waWVkJywgbGVhZik7XG4gICAgICAgIHNldFN0YXR1cyhcbiAgICAgICAgICBgRXhwb3J0ZWQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkJHtwYXRoQ29waWVkID8gJyDCtyBwYXRoIGNvcGllZCcgOiAnJ30ke2xhc3RFeHBvcnQudGVtcFBhdGggPyAnIMK3IFBsYXl3cmlnaHQgdGVtcCBoaWRkZW4nIDogJyd9IMK3ICR7bGVhZn1gLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ29uRXhwb3J0QXJjaGl2ZSBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgQXJjaGl2ZSBleHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gVGVzdC9kZXYgZmFsbGJhY2s6IHN5bnRoZXNpemUgYSBkb3dubG9hZCBsaW5rLlxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYXJjaGl2ZUJ5dGVzIGFzIHVua25vd24gYXMgQmxvYlBhcnRdLCB7dHlwZTogJ2FwcGxpY2F0aW9uL3pzdGQnfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDsgYS5kb3dubG9hZCA9IGFyY2hpdmVOYW1lOyBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGFyY2hpdmVOYW1lKTtcbiAgICBzaG93Q29waWVkKCdFeHBvcnRlZCBhbmQgY29waWVkJywgYXJjaGl2ZU5hbWUpO1xuICAgIHNldFN0YXR1cyhgV29ya3NwYWNlIGV4cG9ydGVkIMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCDCtyBwYXRoIGNvcGllZGApO1xuICB9O1xuXG4gIC8vIEJlc3QtZWZmb3J0IGNsaXBib2FyZCB3cml0ZSDigJQgbmV2ZXIgdGhyb3dzOyByZXR1cm5zIHdoZXRoZXIgdGhlXG4gIC8vIHdyaXRlIHN1Y2NlZWRlZCBzbyB0aGUgY2FsbGVyIGNhbiBhZGp1c3QgdGhlIHN0YXR1cyBtZXNzYWdlLlxuICAvLyBDbGlwYm9hcmQgd3JpdGVzIGNhbiBmYWlsIHdoZW4gdGhlIHBhbmVsIGRvZXNuJ3QgaGF2ZSBmb2N1cyBvciBpblxuICAvLyBzb21lIHRlc3QgaGFybmVzc2VzLCBhbmQgd2UgZG9uJ3Qgd2FudCB0aGF0IHRvIGJsb2NrIHRoZSBleHBvcnQuXG4gIGNvbnN0IGNvcHlUb0NsaXBib2FyZFNpbGVudCA9IGFzeW5jICh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTsgcmV0dXJuIHRydWU7IH1cbiAgICBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9O1xuICAvLyDilIDilIDilIAgRHVja0RCIHNuaXBwZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENhbm9uaWNhbCBTUUwgcmVjaXBlcyBmb3IgcXVlcnlpbmcgYSBKU09OTCBleHBvcnQuIENvcGllcyB0byBjbGlwYm9hcmRcbiAgLy8gYW5kIHByaW50cyBhIHN0YXR1cyBtZXNzYWdlIOKAlCB3ZSBkb24ndCBydW4gRHVja0RCIG91cnNlbHZlcywgdGhlIHVzZXJcbiAgLy8gcGlwZXMgdGhlIHNuaXBwZXQgaW50byBgZHVja2RiYCBvbiB0aGVpciBtYWNoaW5lLiBUaGUgcmVjaXBlcyB0YXJnZXRcbiAgLy8gcXVlc3Rpb25zIGEgVUktZW5naW5lZXIgTExNIHdvcmtmbG93IHRlbmRzIHRvIGFzazogbGlzdCBjYXB0dXJlcyBieVxuICAvLyBob3N0LCBmaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwsIGZpbmQgY2FwdHVyZXMgbWlzc2luZyBhIHNjcmVlbnNob3QsXG4gIC8vIGFuZCB1bmlxdWUtdG9rZW4gZnJlcXVlbmN5IGZvciBhIHF1aWNrIGRlc2lnbi10b2tlbnMgb3ZlcnZpZXcuXG4gIGNvbnN0IGR1Y2tEYlNuaXBwZXQgPSAoanNvbmxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4gYC0tIFBpbmNoR3JhYiDihpIgRHVja0RCIHJlY2lwZXNcbi0tIFNhdmUgeW91ciBKU09OTCBleHBvcnQsIHRoZW4gaW4geW91ciBzaGVsbDpcbi0tICAgZHVja2RiIDwgdGhpc19maWxlLnNxbFxuLS0gT3Igb3BlbiBhIGR1Y2tkYiBzaGVsbCBhbmQgcGFzdGUgdGhlc2Ugb25lIGF0IGEgdGltZS5cblxuLS0gMSkgTG9hZCB0aGUgSlNPTkwgaW50byBhIHRhYmxlLlxuLS0gICAgc2FtcGxlX3NpemU9LTEgZm9yY2VzIGEgZnVsbC1maWxlIHNjYW4gZm9yIHNjaGVtYSBpbmZlcmVuY2UuIFdpdGhvdXRcbi0tICAgIGl0LCBEdWNrREIgb25seSBzbmlmZnMgdGhlIGZpcnN0IDIwIDQ4MCByb3dzIOKAlCBhbmQgUGluY2hHcmFiIGV4cG9ydHNcbi0tICAgIG1peCBzZWxlY3RvciArIGZlZWRiYWNrIHJvdyB0eXBlcywgc28gcmFyZSBmZWVkYmFjay1vbmx5IGZpZWxkc1xuLS0gICAgKHRhZ3MsIHBhcmVudFVpZCkgY2FuIGJlIGRyb3BwZWQgZnJvbSB0aGUgaW5mZXJyZWQgc2NoZW1hIGlmIHRoZXlcbi0tICAgIGRvbid0IGFwcGVhciBlYXJseSBlbm91Z2guIFRoYXQgYml0ZXMgcmVjaXBlIDYgYmVsb3cuXG5DUkVBVEUgT1IgUkVQTEFDRSBUQUJMRSBwZyBBU1xuU0VMRUNUICogRlJPTSByZWFkX2pzb25fYXV0byhcbiAgJyR7anNvbmxOYW1lfScsXG4gIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLFxuICBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCxcbiAgc2FtcGxlX3NpemU9LTFcbik7XG5cbi0tIDIpIFF1aWNrIG92ZXJ2aWV3OiBob3cgbWFueSBjYXB0dXJlcyBwZXIgaG9zdC5cblNFTEVDVFxuICByZWdleHBfZXh0cmFjdCh1cmwsICc6Ly8oW14vXSspJywgMSkgQVMgaG9zdCxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJykgQVMgY2FwdHVyZXMsXG4gIENPVU5UKCopIEZJTFRFUiAoV0hFUkUgdHlwZSA9ICdmZWVkYmFjaycpIEFTIGNvbW1lbnRzXG5GUk9NIHBnXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBjYXB0dXJlcyBERVNDO1xuXG4tLSAzKSBGaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwgYWNyb3NzIGNhcHR1cmVzIChvZnRlbiBzaWduYWxzIGEgcmV1c2VkXG4tLSAgICBjb21wb25lbnQgdGhlIHVzZXIgaGFzIGNsaWNrZWQgaW50byBtdWx0aXBsZSB0aW1lcykuXG5TRUxFQ1Qgb3V0ZXJIVE1MLCBDT1VOVCgqKSBBUyBoaXRzLCBsaXN0KHNlbGVjdG9yKSBBUyBzZWxlY3RvcnNcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBvdXRlckhUTUwgSVMgTk9UIE5VTExcbkdST1VQIEJZIG91dGVySFRNTFxuSEFWSU5HIGhpdHMgPiAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDI1O1xuXG4tLSA0KSBDYXB0dXJlcyBzdGlsbCBtaXNzaW5nIGEgc2NyZWVuc2hvdCBwYXRoLlxuU0VMRUNUIG4sIHVybCwgc2VsZWN0b3JcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBzY3JlZW5zaG90IElTIE5VTExcbk9SREVSIEJZIG47XG5cbi0tIDUpIFF1aWNrIGRlc2lnbi10b2tlbiBzdXJmYWNlOiByYW5rIGNsYXNzZXMgdGhhdCBhcHBlYXIgaW4gbWFueSBjYXB0dXJlcy5cbi0tICAgIE5PVEU6IGZpbHRlciBjbGFzc2VzIElTIE5PVCBOVUxMIHJhdGhlciB0aGFuIHVzaW5nIGEgY29hbGVzY2Utd2l0aC1lbXB0eVxuLS0gICAgZmFsbGJhY2s7IER1Y2tEQiBjYW5ub3QgaW5mZXIgZWxlbWVudCB0eXBlcyBmb3IgYW4gZW1wdHkgbGlzdCBsaXRlcmFsLlxuV0lUSCBleHBhbmRlZCBBUyAoXG4gIFNFTEVDVCB1bm5lc3QoY2xhc3NlcykgQVMgY1xuICBGUk9NIHBnXG4gIFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBjbGFzc2VzIElTIE5PVCBOVUxMXG4pXG5TRUxFQ1QgYywgQ09VTlQoKikgQVMgaGl0c1xuRlJPTSBleHBhbmRlZFxuR1JPVVAgQlkgMVxuT1JERVIgQlkgaGl0cyBERVNDXG5MSU1JVCAzMDtcblxuLS0gNikgQ29tbWVudHMgam9pbmVkIHRvIHRoZWlyIHBhcmVudCBzZWxlY3RvciB2aWEgcGFyZW50VWlkLiBUaGVcbi0tICAgIHMudHlwZSBmaWx0ZXIgcHJldmVudHMgYW4gYWNjaWRlbnRhbCBmZWVkYmFja+KGlGZlZWRiYWNrIGpvaW4gaW4gY2FzZVxuLS0gICAgdHdvIHJvd3MgZXZlciBzaGFyZSBhIHVpZCBieSBjb2luY2lkZW5jZS5cblNFTEVDVCBzLm4sIHMuc2VsZWN0b3IsIGYudGV4dCwgZi50YWdzXG5GUk9NIHBnIGZcbkpPSU4gcGcgc1xuICBPTiBzLnVpZCA9IGYucGFyZW50VWlkXG4gQU5EIHMudHlwZSA9ICdzZWxlY3RvcidcbldIRVJFIGYudHlwZSA9ICdmZWVkYmFjaydcbk9SREVSIEJZIHMubjtcbmA7XG4gIGNvbnN0IG9uRHVja0RiU25pcHBldCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBQcmVmZXIgdGhlIEpTT05MIGZpbGVuYW1lIG9mIHRoZSBtb3N0IHJlY2VudCBleHBvcnQgc28gdGhlIHVzZXIgY2FuXG4gICAgLy8gcGFzdGUgdGhpcyBkaXJlY3RseSB3aXRob3V0IGVkaXRpbmcgdGhlIHJlYWRfanNvbl9hdXRvIHBhdGguIEZhbGxcbiAgICAvLyBiYWNrIHRvIGEgZnJlc2ggZXBvY2gtYmFzZWQgbmFtZSBpZiBub3RoaW5nIGhhcyBiZWVuIGV4cG9ydGVkIHlldC5cbiAgICBjb25zdCBsYXN0ID0gbGFzdEV4cG9ydC5yZWxQYXRoO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IChsYXN0ICYmIC9cXC5qc29ubCQvLnRlc3QobGFzdCkpXG4gICAgICA/IGxhc3Quc3BsaXQoJy8nKS5wb3AoKSEgIC8vIHN0cmlwIHdvcmtzcGFjZS9leHBvcnRzLyBwcmVmaXhcbiAgICAgIDogYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBzcWwgPSBkdWNrRGJTbmlwcGV0KGpzb25sTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNxbCk7XG4gICAgICBzZXRTdGF0dXMoYER1Y2tEQiByZWNpcGVzIGNvcGllZCDCtyBwYXN0ZSBpbnRvIFxcYGR1Y2tkYlxcYCBzaGVsbCDCtyByZWZlcmVuY2VzICR7anNvbmxOYW1lfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIER1Y2tEQiBTUUwnLCBqc29ubE5hbWUpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgZmFpbGVkIOKAlCBvcGVuIHRoZSBwYW5lbCBpbiBhbiBleHRlbnNpb24gY29udGV4dCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgJ09wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jyk7XG4gICAgfVxuICB9O1xuICAvLyDilIDilIDilIAgU2NoZW1hIG1pZ3JhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ29udmVydCBhIHYxLXNoYXBlZCBFbnRyeS1vci1leHBvcnQtbGluZSBpbnRvIG91ciBpbnRlcm5hbCBFbnRyeS4gSWRlbXBvdGVudC5cbiAgLy8gU3VwcG9ydHM6XG4gIC8vICAg4oCiIGZsYXQgdjEgZW50cnkgKG5vIGBfYXVkaXRgLCBubyBgdmAgZmllbGQpXG4gIC8vICAg4oCiIHYyIGV4cG9ydCBlbnRyeSAoaGFzIGBfYXVkaXRgLCBgdjogMmAsIGB0eXBlOiAnc2VsZWN0b3InYClcbiAgLy8gICDigKIgbWl4ZWQgKHNvbWUgZmllbGRzIG5lc3RlZCwgc29tZSBmbGF0IOKAlCBsYXN0IHdpbnMgZm9yIHNhZmV0eSlcbiAgLy8gUHVyZTogbmV2ZXIgbXV0YXRlcyBgcmF3YCBvciBhbnkgb2YgaXRzIG5lc3RlZCBvYmplY3RzLiBSZXR1cm5zIGEgbmV3XG4gIC8vIGVudHJ5IHdpdGggYWxsIG1pZ3JhdGlvbnMgYXBwbGllZC4gVG91Y2hlZCBzdWJvYmplY3RzIChhdHRycywgaGludHMsXG4gIC8vIGdyb3VwIG1lbWJlcnMpIGFyZSBjbG9uZWQgYmVmb3JlIGVkaXQ7IHVudG91Y2hlZCBvbmVzIHNoYXJlIHJlZnMgd2l0aFxuICAvLyByYXcsIHdoaWNoIGlzIGZpbmUgc2luY2Ugd2UgbmV2ZXIgd3JpdGUgdG8gdGhlbS5cbiAgY29uc3QgZGVub3JtYWxpemVFbnRyeSA9IChyYXc6IGFueSk6IEVudHJ5ID0+IHtcbiAgICBjb25zdCBvdXQ6IGFueSA9IHsuLi5yYXd9O1xuICAgIGRlbGV0ZSBvdXQudjtcbiAgICBkZWxldGUgb3V0LnR5cGU7XG4gICAgZGVsZXRlIG91dC5mZWVkYmFjaztcbiAgICBpZiAob3V0Ll9hdWRpdCAmJiB0eXBlb2Ygb3V0Ll9hdWRpdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IGEgPSBvdXQuX2F1ZGl0O1xuICAgICAgaWYgKGEuYW5jZXN0b3JzICE9PSB1bmRlZmluZWQpIG91dC5hbmNlc3RvcnMgPSBhLmFuY2VzdG9ycztcbiAgICAgIGlmIChhLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgb3V0LmNvbXBvbmVudFJvb3QgPSBhLmNvbXBvbmVudFJvb3Q7XG4gICAgICBpZiAoYS5pblNoYWRvd0RPTSAhPT0gdW5kZWZpbmVkKSBvdXQuaW5TaGFkb3dET00gPSBhLmluU2hhZG93RE9NO1xuICAgICAgaWYgKGEucHNldWRvRWxlbWVudHMgIT09IHVuZGVmaW5lZCkgb3V0LnBzZXVkb0VsZW1lbnRzID0gYS5wc2V1ZG9FbGVtZW50cztcbiAgICAgIGlmIChhLm1hdGNoZWRSdWxlcyAhPT0gdW5kZWZpbmVkKSBvdXQubWF0Y2hlZFJ1bGVzID0gYS5tYXRjaGVkUnVsZXM7XG4gICAgICBpZiAoYS52aWV3cG9ydCAhPT0gdW5kZWZpbmVkKSBvdXQudmlld3BvcnQgPSBhLnZpZXdwb3J0O1xuICAgICAgZGVsZXRlIG91dC5fYXVkaXQ7XG4gICAgfVxuICAgIC8vIHN0YXRlczogdjEgdXNlZCBSZWNvcmQ8c3RyaW5nLCB0cnVlPjsgdjIgdXNlcyBzdHJpbmdbXS4gTm9ybWFsaXplIGJvdGguXG4gICAgaWYgKG91dC5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkob3V0LnN0YXRlcykgJiYgdHlwZW9mIG91dC5zdGF0ZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICBvdXQuc3RhdGVzID0gT2JqZWN0LmtleXMob3V0LnN0YXRlcykuZmlsdGVyKChrKSA9PiBCb29sZWFuKChvdXQuc3RhdGVzIGFzIGFueSlba10pKTtcbiAgICB9XG4gICAgLy8gYXR0cnMuZm9ybWF0IOKGkiBoaW50cy5mb3JtYXQuIENsb25lIGF0dHJzIGZpcnN0IHNvIHdlIGRvbid0IG11dGF0ZSB0aGVcbiAgICAvLyBjYWxsZXIncyBuZXN0ZWQgb2JqZWN0LiBTYW1lIGZvciBoaW50cyAod2UgbWF5IG1lcmdlIGludG8gaXQpLlxuICAgIGlmIChvdXQuYXR0cnMgJiYgdHlwZW9mIG91dC5hdHRycyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG91dC5hdHRycy5mb3JtYXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBmbXQgPSBvdXQuYXR0cnMuZm9ybWF0O1xuICAgICAgY29uc3Qge2Zvcm1hdDogX2Ryb3AsIC4uLnJlc3RBdHRyc30gPSBvdXQuYXR0cnM7XG4gICAgICBvdXQuYXR0cnMgPSByZXN0QXR0cnM7XG4gICAgICBvdXQuaGludHMgPSB7Li4uKG91dC5oaW50cyA/PyB7fSksIGZvcm1hdDogZm10fTtcbiAgICB9XG4gICAgaWYgKCFvdXQudWlkKSBvdXQudWlkID0gbXNnSWQoKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvdXQuZ3JvdXApKSBvdXQuZ3JvdXAgPSBvdXQuZ3JvdXAubWFwKGRlbm9ybWFsaXplRW50cnkpO1xuICAgIHJldHVybiBvdXQgYXMgRW50cnk7XG4gIH07XG4gIC8vIFdhbGsgYWxsIGxvYWRlZCBtZXNzYWdlcyBhbmQgbWlncmF0ZSBhbnkgbGVnYWN5IGVudHJpZXMuIFJldHVybnMgdHJ1ZSBpZlxuICAvLyBhbnl0aGluZyBtdXRhdGVkIHNvIHRoZSBjYWxsZXIgY2FuIHBlcnNpc3QuXG4gIGNvbnN0IG1pZ3JhdGVMb2FkZWRNZXNzYWdlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICBsZXQgbXV0YXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBiZWZvcmUgPSBtLmVudHJ5O1xuICAgICAgLy8gQ2hlYXAgcHJlLWNoZWNrOiBpZiB1aWQgZXhpc3RzIEFORCBzdGF0ZXMgaXMgYW4gYXJyYXkgQU5EIG5vIF9hdWRpdFxuICAgICAgLy8gQU5EIG5vIGF0dHJzLmZvcm1hdCDihpIgbm90aGluZyB0byBkbywgc2tpcCB0aGUgd29yay5cbiAgICAgIGNvbnN0IG5lZWRzV29yayA9XG4gICAgICAgICFiZWZvcmUudWlkIHx8XG4gICAgICAgIChiZWZvcmUuc3RhdGVzICYmICFBcnJheS5pc0FycmF5KGJlZm9yZS5zdGF0ZXMpKSB8fFxuICAgICAgICAoYmVmb3JlIGFzIGFueSkuX2F1ZGl0ICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgKGJlZm9yZS5hdHRycyAmJiB0eXBlb2YgKGJlZm9yZS5hdHRycyBhcyBhbnkpLmZvcm1hdCA9PT0gJ3N0cmluZycpO1xuICAgICAgaWYgKCFuZWVkc1dvcmspIGNvbnRpbnVlO1xuICAgICAgbS5lbnRyeSA9IGRlbm9ybWFsaXplRW50cnkoYmVmb3JlKTtcbiAgICAgIG11dGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gbXV0YXRlZDtcbiAgfTtcbiAgY29uc3Qgb25JbXBvcnQgPSAoKTogdm9pZCA9PiBpbXBvcnRGaWxlLmNsaWNrKCk7XG4gIGltcG9ydEZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKGUpID0+IHtcbiAgICBjb25zdCBmaWxlID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzPy5bMF07XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgY29uc3QgaW1wb3J0ZWQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgZm9yIChjb25zdCBsaW5lIG9mIHRleHQuc3BsaXQoL1xccj9cXG4vKSkge1xuICAgICAgaWYgKCFsaW5lLnRyaW0oKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBvID0gSlNPTi5wYXJzZShsaW5lKTtcbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ21hbmlmZXN0Jykge1xuICAgICAgICAgIC8vIE1hbmlmZXN0IGxpbmUg4oCUIGluZm9ybWF0aW9uYWwgb25seSBvbiBpbXBvcnQuIFNraXAuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ3BhZ2UnKSBpbXBvcnRlZC5wdXNoKHt0eXBlOiAncGFnZScsIGlkOiBtc2dJZCgpLCB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHVybDogby51cmwsIHRpdGxlOiBvLnRpdGxlLCB2aWV3cG9ydDogby52aWV3cG9ydCwgdG9rZW5zOiBvLnRva2VucywgdXNlckFnZW50OiBvLnVzZXJBZ2VudCwgbGFuZzogby5sYW5nfSk7XG4gICAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dDogby50ZXh0LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKG8ucGFyZW50VWlkKSBmYi5wYXJlbnRVaWQgPSBvLnBhcmVudFVpZDtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvLnRhZ3MpICYmIG8udGFncy5sZW5ndGgpIGZiLnRhZ3MgPSBvLnRhZ3M7XG4gICAgICAgICAgaWYgKG8uc2V2ZXJpdHkpIGZiLnNldmVyaXR5ID0gby5zZXZlcml0eTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKGZiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzZWxlY3RvciBsaW5lIOKAlCBjb3VsZCBiZSB2MSAoZmxhdCkgb3IgdjIgKHdpdGggX2F1ZGl0KS4gVGhlXG4gICAgICAgICAgLy8gYnVuZGxlZCBmZWVkYmFjayBhcnJheSBtdXN0IGJlIHNwbGl0IG91dCBpbnRvIHNlcGFyYXRlIGZlZWRiYWNrXG4gICAgICAgICAgLy8gbWVzc2FnZXMgZm9yIHJvdW5kLXRyaXAgd2l0aCB2MSByZWFkZXJzIOKAlCBidXQgaW4gdjIgd2UgYWxyZWFkeVxuICAgICAgICAgIC8vIGVtaXQgc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lcywgc28gZHJvcHBpbmcgdGhlIGJ1bmRsZWQgbGlzdCBpc1xuICAgICAgICAgIC8vIHNhZmUgdG8gYXZvaWQgZG91YmxlLWNvdW50aW5nLlxuICAgICAgICAgIGNvbnN0IGZiID0gQXJyYXkuaXNBcnJheShvLmZlZWRiYWNrKSA/IG8uZmVlZGJhY2sgOiBudWxsO1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShvKTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeX0pO1xuICAgICAgICAgIC8vIE9ubHkgaW5mbGF0ZSBidW5kbGVkIGZlZWRiYWNrIGlmIHRoZSBmaWxlIGlzIHYxIChubyB2ZXJzaW9uXG4gICAgICAgICAgLy8gbWFya2VyIG9uIHRoZSBzZWxlY3RvciBsaW5lcykuIHYyIGhhcyBpdHMgb3duIHN0YW5kYWxvbmVcbiAgICAgICAgICAvLyBmZWVkYmFjayBsaW5lcyB0aGF0IGFycml2ZSBzZXBhcmF0ZWx5LlxuICAgICAgICAgIGlmIChmYiAmJiBvLnYgIT09IDIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBmYikgaW1wb3J0ZWQucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgIHRleHQ6IHR5cGVvZiB0ID09PSAnc3RyaW5nJyA/IHQgOiB0Py50ZXh0ID8/ICcnLFxuICAgICAgICAgICAgICBwYXJlbnRVaWQ6IGVudHJ5LnVpZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7IC8qIHNraXAgYmFkIGxpbmUgKi8gfVxuICAgIH1cbiAgICBtZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgLi4uaW1wb3J0ZWRdO1xuICAgIHBlcnNpc3QoKTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKGBJbXBvcnRlZCAke2ltcG9ydGVkLmxlbmd0aH0gbWVzc2FnZSR7aW1wb3J0ZWQubGVuZ3RoID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgaW1wb3J0RmlsZS52YWx1ZSA9ICcnO1xuICB9KTtcbiAgY29uc3Qgb25DbGVhciA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWNvbmZpcm0oJ0NsZWFyIGFsbCBjYXB0dXJlcyBhbmQgY29tbWVudHM/JykpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIG1lc3NhZ2VzID0gW107XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBlcnNpc3RTaG90cygpO1xuICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdDbGVhcmVkJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFZhbGlkYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJ1blZhbGlkYXRpb24gPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgc2VsZWN0b3JzID0gWy4uLm5ldyBTZXQobWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpKV07XG4gICAgaWYgKCFzZWxlY3RvcnMubGVuZ3RoIHx8ICFpbkV4dGVuc2lvbikgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgaWYgKCF0YWJzWzBdKSByZXR1cm47XG4gICAgICBsaXZlVGFiVXJsID0gdGFic1swXS51cmwgPz8gbGl2ZVRhYlVybDtcbiAgICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKGxpdmVUYWJVcmwgPz8gJycpO1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkISwgcGcoe2tpbmQ6ICd2YWxpZGF0ZScsIHNlbGVjdG9yc30pKSBhcyB7dmFsaWQ/OiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPn07XG4gICAgICBpZiAocmVwbHk/LnZhbGlkKSB7XG4gICAgICAgIGZvciAoY29uc3QgW3NlbCwgb2tdIG9mIE9iamVjdC5lbnRyaWVzKHJlcGx5LnZhbGlkKSkge1xuICAgICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICAgIGlmICghb2spIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsICdObyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcyB0aGlzIHNlbGVjdG9yLicpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiB0YWIgbm90IHJlYWR5ICovIH1cbiAgfTtcbiAgY29uc3Qgb25WYWxpZGF0ZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBzZXRTdGF0dXMoJ1JlLWNoZWNraW5n4oCmJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgIGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICBzZXRTdGF0dXMoJ1ZhbGlkYXRlZCcpO1xuICB9O1xuXG4gIC8vIChTY3JlZW5zaG90IG1hY2hpbmVyeSByZW1vdmVkIGFsb25nc2lkZSB0aGUgLnByZXZpZXcgdGlsZS4pXG5cbiAgLy8g4pSA4pSA4pSAIEdpdEh1YiBzdGFycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgZmV0Y2hTdGFycyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBjYWNoZUtleSA9ICdwaW5jaGdyYWIuZ2guc3RhcnMnO1xuICAgIGNvbnN0IGNhY2hlZCA9IGF3YWl0IFN0b3JlLmdldDx7Y291bnQ6IG51bWJlcjsgdHM6IG51bWJlcn0gfCBudWxsPihjYWNoZUtleSwgbnVsbCk7XG4gICAgaWYgKGNhY2hlZCAmJiBEYXRlLm5vdygpIC0gY2FjaGVkLnRzIDwgM182MDBfMDAwKSB7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNhY2hlZC5jb3VudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mvd3Jhbm5nbGUvcGluY2hncmFiJywge2NhY2hlOiAnbm8tc3RvcmUnfSk7XG4gICAgICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcignc3RhdHVzICcgKyByLnN0YXR1cyk7XG4gICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCkgYXMge3N0YXJnYXplcnNfY291bnQ/OiBudW1iZXJ9O1xuICAgICAgY29uc3QgY291bnQgPSBqLnN0YXJnYXplcnNfY291bnQgPz8gMDtcbiAgICAgIHN0YXJzRWwudGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnQpO1xuICAgICAgdm9pZCBTdG9yZS5zZXQoY2FjaGVLZXksIHtjb3VudCwgdHM6IERhdGUubm93KCl9KTtcbiAgICB9IGNhdGNoIHsgc3RhcnNFbC50ZXh0Q29udGVudCA9ICfCtyc7IH1cbiAgfTtcbiAgY29uc3Qgb25HaXRodWIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS93cmFubmdsZS9waW5jaGdyYWInO1xuICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnRhYnMuY3JlYXRlKHt1cmx9KTtcbiAgICBlbHNlIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICdub29wZW5lcicpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBhIHNtYWxsIHByZXZpZXcgcm93IHNob3dpbmdcbiAgLy8gdGhlIGZpcnN0IH42IGxpbmVzIHBsdXMgYSBcIkVkaXQgLyBVcGxvYWQgLyDigKZcIiBidXR0b24uIENsaWNraW5nIG9wZW5zXG4gIC8vIGEgcG9wb3V0IG1vZGFsIHdpdGggdGhlIGZ1bGwgZWRpdG9yIOKAlCBrZWVwcyB0aGUgc2V0dGluZ3MgZHJhd2VyXG4gIC8vIHNjYW5uYWJsZSB3aGVuIHNoaXBwaW5nIGEgNTAwMC1saW5lIERFU0lHTi5tZC5cbiAgY29uc3QgcmVuZGVyTWRQcmV2aWV3ID0gYXN5bmMgKGtpbmQ6ICdkZXNpZ24nIHwgJ3NraWxsJyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHByZXZpZXdFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1tZC1wcmV2aWV3PVwiJHtraW5kfVwiXWApO1xuICAgIGlmICghcHJldmlld0VsKSByZXR1cm47XG4gICAgY29uc3QgY29udGVudCA9IGtpbmQgPT09ICdkZXNpZ24nID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IGhlYWQgPSBsaW5lcy5zbGljZSgwLCA2KS5tYXAoKGwpID0+IGwubGVuZ3RoID4gODAgPyBsLnNsaWNlKDAsIDgwKSArICfigKYnIDogbCkuam9pbignXFxuJyk7XG4gICAgcHJldmlld0VsLnRleHRDb250ZW50ID0gaGVhZCArIChsaW5lcy5sZW5ndGggPiA2ID8gYFxcblxcbuKApiAoKyR7bGluZXMubGVuZ3RoIC0gNn0gbW9yZSBsaW5lcylgIDogJycpO1xuICB9O1xuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBvcGVuTWRNb2RhbCA9IGFzeW5jIChraW5kOiBNZEtpbmQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgIGlmICghb3ZlcmxheSkgcmV0dXJuO1xuICAgIGNvbnN0IHRpdGxlRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC10aXRsZV0nKSE7XG4gICAgY29uc3QgdGFFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGV4dGFyZWFdJykhO1xuICAgIGNvbnN0IHN0YXRzRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdGF0c10nKSE7XG4gICAgY29uc3QgYmFubmVyRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1iYW5uZXJdJykhO1xuICAgIGNvbnN0IHNhdmVCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zYXZlXScpITtcbiAgICBjb25zdCByZXNldEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXJlc2V0XScpITtcbiAgICBjb25zdCB1cGxvYWRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC11cGxvYWRdJykhO1xuICAgIGNvbnN0IGRvd25sb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtZG93bmxvYWRdJykhO1xuICAgIGNvbnN0IGNsb3NlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtY2xvc2VdJykhO1xuXG4gICAgY29uc3QgaXNEZXNpZ24gPSBraW5kID09PSAnZGVzaWduJztcbiAgICBjb25zdCBpbml0aWFsID0gaXNEZXNpZ24gPyBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpIDogYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGNvbnN0IHVzaW5nVGVtcGxhdGUgPSBpc0Rlc2lnbiA/IGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpIDogaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gaXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdQaW5jaEdyYWIgU0tJTEwubWQnO1xuICAgIHRhRWwudmFsdWUgPSBpbml0aWFsO1xuICAgIG92ZXJsYXkuZGF0YXNldC5raW5kID0ga2luZDtcblxuICAgIGNvbnN0IHJlZnJlc2hTdGF0cyA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSB0YUVsLnZhbHVlO1xuICAgICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKS5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFt0ZXh0XSkuc2l6ZTtcbiAgICAgIHN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtsaW5lc30gbGluZXMgwrcgJHsoYnl0ZXMgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gICAgfTtcbiAgICByZWZyZXNoU3RhdHMoKTtcbiAgICBiYW5uZXJFbC5oaWRkZW4gPSAhdXNpbmdUZW1wbGF0ZTtcbiAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9IHVzaW5nVGVtcGxhdGVcbiAgICAgID8gYOKaoCBDdXJyZW50bHkgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgJHtpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1NLSUxMLm1kJ30gdGVtcGxhdGUg4oCUIGVkaXRzIGhlcmUgYmVjb21lIHlvdXIgY3VzdG9taXplZCB2ZXJzaW9uLmBcbiAgICAgIDogJyc7XG4gICAgdGFFbC5vbmlucHV0ID0gcmVmcmVzaFN0YXRzO1xuXG4gICAgY29uc3Qgb25TYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhRWwudmFsdWU7XG4gICAgICAvLyBTYXZlIGVtcHR5IHN0cmluZyDihpIgcmV2ZXJ0IHRvIHRlbXBsYXRlIGZhbGxiYWNrLiBBbnl0aGluZyBub24tZW1wdHlcbiAgICAgIC8vIOKGkiB1c2VyIGN1c3RvbWl6YXRpb24gKHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZSkuXG4gICAgICBpZiAoaXNEZXNpZ24pIHByZWZzLmRlc2lnbk1kID0gdGV4dDtcbiAgICAgIGVsc2UgcHJlZnMuc2tpbGxNZCA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHZvaWQgdXBkYXRlTWRTdGF0dXNlcygpO1xuICAgICAgc2V0U3RhdHVzKGAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSBzYXZlZGApO1xuICAgICAgY2xvc2VNZE1vZGFsKCk7XG4gICAgfTtcbiAgICBjb25zdCBvblJlc2V0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGFFbC52YWx1ZSA9ICcnOyAvLyBlbXB0eSA9IGZhbGxiYWNrIHRvIGJ1bmRsZWQgdGVtcGxhdGVcbiAgICAgIHJlZnJlc2hTdGF0cygpO1xuICAgICAgYmFubmVyRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9ICdDbGVhcmVkIOKAlCBTYXZlIHRvIHJldmVydCB0byBidW5kbGVkIHRlbXBsYXRlLCBvciBwYXN0ZSBuZXcgY29udGVudC4nO1xuICAgIH07XG4gICAgY29uc3Qgb25VcGxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbnB1dElkID0gaXNEZXNpZ24gPyAnZGVzaWduLW1kLWZpbGUnIDogJ3NraWxsLW1kLWZpbGUnO1xuICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uRG93bmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gaXNEZXNpZ24gPyAnREVTSUdOLnRlbXBsYXRlLm1kJyA6ICdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnO1xuICAgICAgZG93bmxvYWRUZXh0KG5hbWUsIHRhRWwudmFsdWUpO1xuICAgIH07XG5cbiAgICBzYXZlQnRuLm9uY2xpY2sgPSBvblNhdmU7XG4gICAgcmVzZXRCdG4ub25jbGljayA9IG9uUmVzZXQ7XG4gICAgdXBsb2FkQnRuLm9uY2xpY2sgPSBvblVwbG9hZDtcbiAgICBkb3dubG9hZEJ0bi5vbmNsaWNrID0gb25Eb3dubG9hZDtcbiAgICBjbG9zZUJ0bi5vbmNsaWNrID0gY2xvc2VNZE1vZGFsO1xuICAgIG92ZXJsYXkuaGlkZGVuID0gZmFsc2U7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhRWwuZm9jdXMoKSk7XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNZE1vZGFsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgaWYgKG92ZXJsYXkpIG92ZXJsYXkuaGlkZGVuID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBkb3dubG9hZFRleHQgPSAoZmlsZW5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nLCBtaW1lID0gJ3RleHQvbWFya2Rvd24nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge3R5cGU6IG1pbWV9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTsgYS5jbGljaygpOyBhLnJlbW92ZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCB3aXJlTWRGaWxlSW5wdXQgPSAoaWQ6IHN0cmluZywgcHJlZktleTogJ2Rlc2lnbk1kJyB8ICdza2lsbE1kJywgbGFiZWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcbiAgICBmaWxlSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBmaWxlSW5wdXQuZmlsZXM/LlswXTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IDUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHRvbyBsYXJnZSAoJHsoZmlsZS5zaXplIC8gMTAyNCAvIDEwMjQpLnRvRml4ZWQoMSl9IE1CID4gNSBNQiBjYXApYCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICBmaWxlSW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgKHByZWZzIGFzIGFueSlbcHJlZktleV0gPSB0ZXh0O1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgc2V0U3RhdHVzKGAke2xhYmVsfSB1cGxvYWRlZCDCtyAke2ZpbGUubmFtZX0gwrcgJHsoZmlsZS5zaXplIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgKTtcbiAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgIH0pO1xuICB9O1xuICB3aXJlTWRGaWxlSW5wdXQoJ2Rlc2lnbi1tZC1maWxlJywgJ2Rlc2lnbk1kJywgJ0RFU0lHTi5tZCcpO1xuICB3aXJlTWRGaWxlSW5wdXQoJ3NraWxsLW1kLWZpbGUnLCAnc2tpbGxNZCcsICdTS0lMTC5tZCcpO1xuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICgodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5kYXRhc2V0Py5wcmVmKSB7XG4gICAgICAocHJlZnMgYXMgYW55KVt0LmRhdGFzZXQucHJlZiFdID0gQm9vbGVhbigodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkKTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0LmRhdGFzZXQ/LnByZWZUZXh0KSB7XG4gICAgICAocHJlZnMgYXMgYW55KVt0LmRhdGFzZXQucHJlZlRleHRdID0gKHQgYXMgSFRNTFRleHRBcmVhRWxlbWVudCkudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICAvLyBUZXh0YXJlYSBpbnB1dHMgYWxzbyBmaXJlIGBpbnB1dGAgZXZlbnRzIGFzIHRoZSB1c2VyIHR5cGVzIOKAlCB3ZSB3YW50IHRvXG4gIC8vIHNhdmUgdGhvc2UgaW5jcmVtZW50YWxseSBzbyBhIHBhbmVsIHJlbG9hZCBkb2Vzbid0IGxvc2UgaGFsZi10eXBlZFxuICAvLyBlbnRyaWVzLiBgY2hhbmdlYCBvbmx5IGZpcmVzIG9uIGJsdXIgZm9yIHRleHRhcmVhcy5cbiAgZHJhd2VyPy5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKHQ/LmRhdGFzZXQ/LnByZWZUZXh0KSB7XG4gICAgICAocHJlZnMgYXMgYW55KVt0LmRhdGFzZXQucHJlZlRleHRdID0gdC52YWx1ZTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IG9wZW5EcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSBmYWxzZTsgcmVuZGVyV3NDb250cm9scygpOyB9O1xuICBjb25zdCBjbG9zZURyYXdlciA9ICgpOiB2b2lkID0+IHsgZHJhd2VyLmhpZGRlbiA9IHRydWU7IH07XG5cbiAgY29uc3QgcmVuZGVyV3NDb250cm9scyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXdzU2VsZWN0KSByZXR1cm47XG4gICAgd3NTZWxlY3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gdy5uYW1lO1xuICAgICAgb3B0LnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIG9wdC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB3c1NlbGVjdC5hcHBlbmQob3B0KTtcbiAgICB9XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICAgICAgZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGlmICghY29uZmlybShgRGVsZXRlIHdvcmtzcGFjZSBcIiR7dy5uYW1lfVwiIGFuZCBhbGwgaXRzIGNhcHR1cmVzP2ApKSByZXR1cm47XG4gICAgICAgICAgd29ya3NwYWNlcyA9IHdvcmtzcGFjZXMuZmlsdGVyKCh4KSA9PiB4Lm5hbWUgIT09IHcubmFtZSk7XG4gICAgICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICAgICAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShbd3NNc2dLZXkody5uYW1lKSwgd3NTaG90c0tleSh3Lm5hbWUpLCB3c1Nob3RzRnVsbEtleSh3Lm5hbWUpXSkuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICAgICAgaWYgKGFjdGl2ZVdzID09PSB3Lm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod29ya3NwYWNlc1swXSEubmFtZSk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIH1cbiAgICAgIHdzTGlzdC5hcHBlbmQobGkpO1xuICAgIH1cbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSgoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlKTtcbiAgICByZW5kZXIoKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIENvbW1hbmQgcGFsZXR0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBDb21tYW5kID0ge2lkOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJ1bjogKCkgPT4gdm9pZH07XG4gIGNvbnN0IENPTU1BTkRTOiBDb21tYW5kW10gPSBbXG4gICAge2lkOiAnY29weS1hbGwnLCBsYWJlbDogJ0NvcHkgYWxsIGFzIEpTT05MJywgcnVuOiAoKSA9PiB2b2lkIG9uQ29weUFsbCgpfSxcbiAgICB7aWQ6ICdleHBvcnQnLCBsYWJlbDogJ0Rvd25sb2FkIEpTT05MIGZpbGUnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnQoKX0sXG4gICAge2lkOiAnZXhwb3J0LXppcCcsIGxhYmVsOiAnRXhwb3J0IHdvcmtzcGFjZSBhcyAudGFyLnpzdCAoSlNPTkwgKyBzY3JlZW5zaG90cyArIER1Y2tEQiArIFJFQURNRSknLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdkdWNrZGInLCBsYWJlbDogJ0dlbmVyYXRlIER1Y2tEQiBxdWVyeSBzbmlwcGV0IChTUUwgcmVjaXBlcyknLCBydW46ICgpID0+IHZvaWQgb25EdWNrRGJTbmlwcGV0KCl9LFxuICAgIHtpZDogJ2ltcG9ydCcsIGxhYmVsOiAnSW1wb3J0IEpTT05MIGZpbGUnLCBydW46IG9uSW1wb3J0fSxcbiAgICB7aWQ6ICd2YWxpZGF0ZScsIGxhYmVsOiAnUmUtY2hlY2sgc2VsZWN0b3JzJywgcnVuOiAoKSA9PiB2b2lkIG9uVmFsaWRhdGUoKX0sXG4gICAge2lkOiAnY2xlYXInLCBsYWJlbDogJ0NsZWFyIGFsbCBjYXB0dXJlcycsIHJ1bjogb25DbGVhcn0sXG4gICAge2lkOiAnc2V0dGluZ3MnLCBsYWJlbDogJ09wZW4gc2V0dGluZ3MnLCBydW46IG9wZW5EcmF3ZXJ9LFxuICAgIHtpZDogJ2dpdGh1YicsIGxhYmVsOiAnT3BlbiBHaXRIdWIgcmVwbycsIHJ1bjogb25HaXRodWJ9LFxuICAgIHtpZDogJ21hbnVhbCcsIGxhYmVsOiAnTWFudWFsIGNhcHR1cmUgKHN0YXJ0IGNvbXBvc2VyIHdpdGggYD4gc2VsZWN0b3JgKScsIHJ1bjogKCkgPT4geyBjb21wb3Nlci52YWx1ZSA9ICc+ICc7IGNvbXBvc2VyLmZvY3VzKCk7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgfX0sXG4gICAge2lkOiAndW5kbycsIGxhYmVsOiAnVW5kbycsIHJ1bjogdW5kb30sXG4gICAge2lkOiAncmVkbycsIGxhYmVsOiAnUmVkbycsIHJ1bjogcmVkb30sXG4gIF07XG4gIGNvbnN0IHJlbmRlclBhbGV0dGUgPSAocSA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgY29uc3QgcWwgPSBxLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAuLi5DT01NQU5EUy5maWx0ZXIoKGMpID0+ICFxbCB8fCBjLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKVxuICAgICAgICAubWFwKChjKSA9PiAoe2xhYmVsOiBjLmxhYmVsLCBwcmV2aWV3OiAnY29tbWFuZCcsIHJ1bjogYy5ydW59KSksXG4gICAgICAuLi5tZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKCFxbCB8fFxuICAgICAgICAobS5lbnRyeS5zZWxlY3RvciArICcgJyArIChtLmVudHJ5LnRleHQgPz8gJycpICsgJyAnICsgKG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyAnJykpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKSlcbiAgICAgICAgLnNsaWNlKDAsIDMwKVxuICAgICAgICAubWFwKChtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmIgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihtLmlkKTtcbiAgICAgICAgICBjb25zdCBwcmV2aWV3ID0gKG0uZW50cnkudGV4dCA/PyBmYlswXSA/PyBtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgODApO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYWJlbDogYCMke20uZW50cnkubn0gJHttLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3Rvcn1gLFxuICAgICAgICAgICAgcHJldmlldyxcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9zZVBhbGV0dGUoKTtcbiAgICAgICAgICAgICAgc2Nyb2xsTWVzc2FnZUludG9WaWV3KG0uaWQpO1xuICAgICAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3J9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdCwgaSkgPT4ge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGJsLmNsYXNzTmFtZSA9ICdsYWJlbCc7XG4gICAgICBsYmwuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQubGFiZWwsIHEpO1xuICAgICAgbGkuYXBwZW5kKGxibCk7XG4gICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcC5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICBwLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LnByZXZpZXcgPz8gJycsIHEpO1xuICAgICAgbGkuYXBwZW5kKHApO1xuICAgICAgY29uc3Qga2JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAga2JkLmNsYXNzTmFtZSA9ICdrYmQnO1xuICAgICAga2JkLnRleHRDb250ZW50ID0gJ+KGtSc7XG4gICAgICBsaS5hcHBlbmQoa2JkKTtcbiAgICAgIGlmIChpID09PSAwKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpdC5ydW4oKTsgfSk7XG4gICAgICBwYWxldHRlTGlzdC5hcHBlbmQobGkpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvcGVuUGFsZXR0ZSA9IChwcmVzZXQgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGUuaGlkZGVuID0gZmFsc2U7XG4gICAgcGFsZXR0ZUlucHV0LnZhbHVlID0gcHJlc2V0O1xuICAgIHJlbmRlclBhbGV0dGUocHJlc2V0KTtcbiAgICBwYWxldHRlSW5wdXQuZm9jdXMoKTtcbiAgICBwYWxldHRlSW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UocHJlc2V0Lmxlbmd0aCwgcHJlc2V0Lmxlbmd0aCk7XG4gIH07XG4gIGNvbnN0IGNsb3NlUGFsZXR0ZSA9ICgpOiB2b2lkID0+IHsgcGFsZXR0ZS5oaWRkZW4gPSB0cnVlOyB9O1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiByZW5kZXJQYWxldHRlKHBhbGV0dGVJbnB1dC52YWx1ZSkpO1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4ucGFsZXR0ZUxpc3QuY2hpbGRyZW5dO1xuICAgIGxldCBhY3RpdmUgPSBpdGVtcy5maW5kSW5kZXgoKGxpKSA9PiBsaS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKTtcbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWluKGl0ZW1zLmxlbmd0aCAtIDEsIGFjdGl2ZSArIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWF4KDAsIGFjdGl2ZSAtIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IChpdGVtc1thY3RpdmVdIGFzIEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkKT8uY2xpY2soKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIGNsb3NlUGFsZXR0ZSgpO1xuICB9KTtcbiAgcGFsZXR0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGlmIChlLnRhcmdldCA9PT0gcGFsZXR0ZSkgY2xvc2VQYWxldHRlKCk7IH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBDdXN0b20gdG9vbHRpcCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHRpcEZvcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2hvd1RpcCA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlwJyk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgdG9vbHRpcEVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB0b29sdGlwRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aXBSID0gdG9vbHRpcEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDQ7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIHRpcFIud2lkdGggLyAyO1xuICAgIGlmICh0b3AgKyB0aXBSLmhlaWdodCArIDQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHRvcCA9IHIudG9wIC0gdGlwUi5oZWlnaHQgLSA0O1xuICAgIGlmIChsZWZ0IDwgNCkgbGVmdCA9IDQ7XG4gICAgaWYgKGxlZnQgKyB0aXBSLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggLSA0KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0aXBSLndpZHRoIC0gNDtcbiAgICB0b29sdGlwRWwuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHt0b3B9cHg7bGVmdDoke2xlZnR9cHg7YDtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICd0cnVlJztcbiAgfTtcbiAgY29uc3QgaGlkZVRpcCA9ICgpOiB2b2lkID0+IHtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7XG4gICAgdGlwRm9yID0gbnVsbDtcbiAgICB0b29sdGlwRWwuaGlkZGVuID0gdHJ1ZTtcbiAgfTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICghdCB8fCB0ID09PSB0aXBGb3IpIHJldHVybjtcbiAgICB0aXBGb3IgPSB0O1xuICAgIHNob3dUaXAodCk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCAmJiB0ID09PSB0aXBGb3IgJiYgIXQuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlVGlwKCk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0IGRyaWxsZG93bnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGJ1aWxkRHJpbGxkb3duID0gKGtpbmQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgaWYgKGtpbmQgPT09ICdzZWxlY3RvcnMnKSB7XG4gICAgICBsaW5lcy5wdXNoKCc8aDU+U2VsZWN0b3JzIGJ5IHF1YWxpdHk8L2g1PicpO1xuICAgICAgY29uc3QgYnVja2V0cyA9IHtpZDogMCwgdGVzdGlkOiAwLCBjbGFzczogMCwgbnRoOiAwLCB0YWc6IDB9O1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgICAgaWYgKGUudGVzdElkKSBidWNrZXRzLnRlc3RpZCsrO1xuICAgICAgICBlbHNlIGlmIChlLmlkIHx8IC9eI1tcXHctXSskLy50ZXN0KGUuc2VsZWN0b3IpKSBidWNrZXRzLmlkKys7XG4gICAgICAgIGVsc2UgaWYgKChlLnNlbGVjdG9yID8/ICcnKS5pbmNsdWRlcygnOm50aC1vZi10eXBlJykpIGJ1Y2tldHMubnRoKys7XG4gICAgICAgIGVsc2UgaWYgKC9cXC4vLnRlc3QoZS5zZWxlY3RvciA/PyAnJykpIGJ1Y2tldHMuY2xhc3MrKztcbiAgICAgICAgZWxzZSBidWNrZXRzLnRhZysrO1xuICAgICAgfVxuICAgICAgbGluZXMucHVzaChgPHVsPlxuICAgICAgICA8bGk+PGI+JHtidWNrZXRzLnRlc3RpZH08L2I+IGRhdGEtdGVzdGlkPC9saT5cbiAgICAgICAgPGxpPjxiPiR7YnVja2V0cy5pZH08L2I+IHN0YWJsZSBpZDwvbGk+XG4gICAgICAgIDxsaT48Yj4ke2J1Y2tldHMuY2xhc3N9PC9iPiBjbGFzcy1iYXNlZDwvbGk+XG4gICAgICAgIDxsaT48Yj4ke2J1Y2tldHMubnRofTwvYj4gbnRoLW9mLXR5cGU8L2xpPlxuICAgICAgICA8bGk+PGI+JHtidWNrZXRzLnRhZ308L2I+IHRhZy1vbmx5PC9saT5cbiAgICAgIDwvdWw+YCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnc3RhbGUnKSB7XG4gICAgICBsaW5lcy5wdXNoKCc8aDU+U3RhbGUgY2FwdHVyZXM8L2g1Pjx1bD4nKTtcbiAgICAgIGNvbnN0IHN0YWxlID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSk7XG4gICAgICBpZiAoIXN0YWxlLmxlbmd0aCkgbGluZXMucHVzaCgnPGxpPk5vbmUg4oCUIGV2ZXJ5dGhpbmcgcmVzb2x2ZXMuPC9saT4nKTtcbiAgICAgIGVsc2UgZm9yIChjb25zdCBtIG9mIHN0YWxlKSBsaW5lcy5wdXNoKGA8bGk+PGI+IyR7bS5lbnRyeS5ufTwvYj4gPGNvZGU+JHtlc2NhcGVIdG1sKChtLmVudHJ5LnNlbGVjdG9yID8/ICcnKS5zbGljZSgwLCA1MCkpfTwvY29kZT48L2xpPmApO1xuICAgICAgbGluZXMucHVzaCgnPC91bD4nKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdjb21tZW50cycpIHtcbiAgICAgIGxpbmVzLnB1c2goJzxoNT5Db21tZW50czwvaDU+PHVsPicpO1xuICAgICAgY29uc3QgZmJzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBGZWVkYmFja01lc3NhZ2UgPT4gbS50eXBlID09PSAnZmVlZGJhY2snKTtcbiAgICAgIGxpbmVzLnB1c2goYDxsaT5Ub3RhbCB3b3JkczogPGI+JHtmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgd29yZENvdW50KG0udGV4dCksIDApfTwvYj48L2xpPmApO1xuICAgICAgbGluZXMucHVzaChgPGxpPkF2ZXJhZ2UgbGVuZ3RoOiA8Yj4ke2Zicy5sZW5ndGggPyBNYXRoLnJvdW5kKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyBtLnRleHQubGVuZ3RoLCAwKSAvIGZicy5sZW5ndGgpIDogMH08L2I+IGNoYXJzPC9saT5gKTtcbiAgICAgIGxpbmVzLnB1c2goJzwvdWw+Jyk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAncGFnZXMnKSB7XG4gICAgICBsaW5lcy5wdXNoKCc8aDU+UGFnZXM8L2g1Pjx1bD4nKTtcbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzZWVuLnNldChtLmVudHJ5LnVybCwgKHNlZW4uZ2V0KG0uZW50cnkudXJsKSA/PyAwKSArIDEpO1xuICAgICAgZm9yIChjb25zdCBbdXJsLCBuXSBvZiBzZWVuKSBsaW5lcy5wdXNoKGA8bGk+PGI+JHtufTwvYj4gc2VsZWN0b3Ike24gPT09IDEgPyAnJyA6ICdzJ30gwrcgPGNvZGU+JHtlc2NhcGVIdG1sKHBhdGhPZih1cmwpKX08L2NvZGU+PC9saT5gKTtcbiAgICAgIGxpbmVzLnB1c2goJzwvdWw+Jyk7XG4gICAgfVxuICAgIHJldHVybiBsaW5lcy5qb2luKCcnKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0RyaWxsZG93biA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qga2luZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdCcpO1xuICAgIGlmICgha2luZCkgcmV0dXJuO1xuICAgIGRyaWxsZG93bkVsLmlubmVySFRNTCA9IGJ1aWxkRHJpbGxkb3duKGtpbmQpO1xuICAgIGRyaWxsZG93bkVsLmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IHIgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZFIgPSBkcmlsbGRvd25FbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgdG9wID0gci5ib3R0b20gKyA2O1xuICAgIGxldCBsZWZ0ID0gci5sZWZ0ICsgci53aWR0aCAvIDIgLSBkUi53aWR0aCAvIDI7XG4gICAgaWYgKHRvcCArIGRSLmhlaWdodCArIDQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHRvcCA9IHIudG9wIC0gZFIuaGVpZ2h0IC0gNjtcbiAgICBpZiAobGVmdCA8IDYpIGxlZnQgPSA2O1xuICAgIGlmIChsZWZ0ICsgZFIud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDYpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGRSLndpZHRoIC0gNjtcbiAgICBkcmlsbGRvd25FbC5zdHlsZS5jc3NUZXh0ID0gYHRvcDoke3RvcH1weDtsZWZ0OiR7bGVmdH1weDtgO1xuICB9O1xuICBjb25zdCBoaWRlRHJpbGxkb3duID0gKCk6IHZvaWQgPT4geyBkcmlsbGRvd25FbC5oaWRkZW4gPSB0cnVlOyB9O1xuICBzdGF0c0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnLnN0YXRbZGF0YS1zdGF0XScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCkgc2hvd0RyaWxsZG93bih0KTtcbiAgfSk7XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGlmICghc3RhdHNFbC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVEcmlsbGRvd24oKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydC1idXR0b24gaG92ZXIg4oaSIG91dGxpbmUtbXVsdGkgb24gcGFnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZm9yIChjb25zdCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZXhwb3J0LWhvdmVyXScpKSB7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aScsIHNlbGVjdG9yc30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LmFkZCgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2V4cG9ydC1ob3ZlcicpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIENsaWNrIGRlbGVnYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCB0cmlnZ2VyID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgaWYgKCF0cmlnZ2VyKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWFjdGlvbicpO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdzZW5kJzogc2VuZEZlZWRiYWNrKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktYWxsJzogdm9pZCBvbkNvcHlBbGwoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZXhwb3J0Jzogdm9pZCBvbkV4cG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQtemlwJzogdm9pZCBvbkV4cG9ydFppcCgpOyByZXR1cm47XG4gICAgICBjYXNlICdjb3B5LXBhdGgnOiB2b2lkIG9uQ29weVBhdGgoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaW1wb3J0Jzogb25JbXBvcnQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndmFsaWRhdGUnOiB2b2lkIG9uVmFsaWRhdGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY2xlYXInOiBvbkNsZWFyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2dpdGh1Yic6IG9uR2l0aHViKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3NldHRpbmdzJzogb3BlbkRyYXdlcigpOyByZXR1cm47XG4gICAgICBjYXNlICdjbG9zZS1kcmF3ZXInOiBjbG9zZURyYXdlcigpOyByZXR1cm47XG4gICAgICBjYXNlICd1bmRvJzogdW5kbygpOyByZXR1cm47XG4gICAgICBjYXNlICdyZWRvJzogcmVkbygpOyByZXR1cm47XG4gICAgICBjYXNlICdkZXNpZ24tZWRpdCc6IHsgdm9pZCBvcGVuTWRNb2RhbCgnZGVzaWduJyk7IHJldHVybjsgfVxuICAgICAgY2FzZSAnc2tpbGwtZWRpdCc6ICB7IHZvaWQgb3Blbk1kTW9kYWwoJ3NraWxsJyk7IHJldHVybjsgfVxuICAgICAgY2FzZSAnZGVzaWduLXVwbG9hZCc6IHtcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ24tbWQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnZGVzaWduLXRlbXBsYXRlLWRvd25sb2FkJzoge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgLy8gUHJlZmVyIHRoZSB1c2VyJ3MgbG9jYWwgb3ZlcnJpZGUgaWYgcHJlc2VudCAoc28gYSBmb3JrJ3NcbiAgICAgICAgICAvLyBcIkRvd25sb2FkIHRlbXBsYXRlXCIgcHJvZHVjZXMgdGhlIHNhbWUgY29udGVudCB0aGUgZm9yayBzaGlwcylcbiAgICAgICAgICAvLyBvdGhlcndpc2UgdGhlIGdlbmVyaWMgdGVtcGxhdGUuXG4gICAgICAgICAgY29uc3QgdGV4dCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsRGVzaWduJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJykpO1xuICAgICAgICAgIGlmICghdGV4dCkgeyBzZXRTdGF0dXMoJ1RlbXBsYXRlIG5vdCBmb3VuZCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgZG93bmxvYWRUZXh0KCdERVNJR04udGVtcGxhdGUubWQnLCB0ZXh0KTtcbiAgICAgICAgICBzZXRTdGF0dXMoJ0RFU0lHTi5tZCB0ZW1wbGF0ZSBkb3dubG9hZGVkIOKAlCBmaWxsIGluIGFuZCByZS11cGxvYWQnKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnZGVzaWduLXJlc2V0LXRlbXBsYXRlJzoge1xuICAgICAgICBwcmVmcy5kZXNpZ25NZCA9ICcnO1xuICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdERVNJR04ubWQgcmVzZXQg4oCUIGV4cG9ydHMgd2lsbCBidW5kbGUgdGhlIHRlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXVwbG9hZCc6IHtcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2lsbC1tZC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC10ZW1wbGF0ZS1kb3dubG9hZCc6IHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRleHQgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbFNraWxsJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKSk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgdGVtcGxhdGUgZG93bmxvYWRlZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuc2tpbGxNZCA9ICcnO1xuICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdTS0lMTC5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnd3MtY3JlYXRlJzoge1xuICAgICAgICBjb25zdCBuYW1lID0gKHdzTmFtZS52YWx1ZSA/PyAnJykudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcbiAgICAgICAgaWYgKHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBuYW1lKSkgeyBzZXRTdGF0dXMoJ0FscmVhZHkgZXhpc3RzJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgd29ya3NwYWNlcy5wdXNoKHtuYW1lLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0pO1xuICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICB3c05hbWUudmFsdWUgPSAnJztcbiAgICAgICAgdm9pZCBsb2FkV29ya3NwYWNlKG5hbWUpLnRoZW4ocmVuZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBHbG9iYWwga2V5Ym9hcmQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldCA9ICh0YXJnZXQ6IEV2ZW50VGFyZ2V0IHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGVsID0gdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyB0YXJnZXQgOiBudWxsO1xuICAgIHJldHVybiBCb29sZWFuKGVsPy5jbG9zZXN0KCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCwgW2NvbnRlbnRlZGl0YWJsZT1cInRydWVcIl0sIFtjb250ZW50ZWRpdGFibGU9XCJcIl0nKSk7XG4gIH07XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgZWRpdGFibGVUYXJnZXQgPSBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQoZS50YXJnZXQpO1xuICAgIGlmIChlZGl0YWJsZVRhcmdldCAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgWydhJywgJ3onLCAneSddLmluY2x1ZGVzKGUua2V5LnRvTG93ZXJDYXNlKCkpKSByZXR1cm47XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnaycpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBwYWxldHRlLmhpZGRlbiA/IG9wZW5QYWxldHRlKCkgOiBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB1bmRvKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgKGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd5JyB8fCAoZS5zaGlmdEtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicpKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHJlZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgY29uc3QgbWRNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICAgIGlmIChtZE1vZGFsICYmICFtZE1vZGFsLmhpZGRlbikgeyBjbG9zZU1kTW9kYWwoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSB7IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAgIGlmICghZHJhd2VyLmhpZGRlbikgeyBjbG9zZURyYXdlcigpOyByZXR1cm47IH1cbiAgICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSB7IHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9KTsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyBzZXRTdGF0dXMoJ1BlbmRpbmcgZ3JvdXAgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7IHJldHVybjsgfVxuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB7IHNlYXJjaC52YWx1ZSA9ICcnOyBzZWFyY2hRdWVyeSA9ICcnOyByZW5kZXIoKTsgfVxuICAgIH1cbiAgICBpZiAoZS5rZXkgPT09ICdBbHQnIHx8IGUuYWx0S2V5KSB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IHRydWV9KTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICBpZiAoIWUuYWx0S2V5KSB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IGZhbHNlfSk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2Ugd2lyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgcGFuZWxSZWFkeSA9IGZhbHNlO1xuICBjb25zdCBwZW5kaW5nUGFuZWxNZXNzYWdlczogYW55W10gPSBbXTtcbiAgY29uc3QgcmVjZWl2ZVBhbmVsTWVzc2FnZSA9IChtOiBhbnkpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBhbmVsUmVhZHkpIHtcbiAgICAgIHBlbmRpbmdQYW5lbE1lc3NhZ2VzLnB1c2gobSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uQ3NNZXNzYWdlKG0pO1xuICB9O1xuICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAvLyBTaW5nbGUgY2hhbm5lbDogY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLiBUaGUgYmFja2dyb3VuZCB1c2VkIHRvIHJlbGF5XG4gICAgLy8gdGhyb3VnaCBhIHBvcnQgdG9vLCBidXQgY29udGVudC1zY3JpcHQgYnJvYWRjYXN0cyBhbHJlYWR5IHJlYWNoIHRoZVxuICAgIC8vIHNpZGUgcGFuZWwgZGlyZWN0bHkg4oCUIHJlbGF5aW5nIHByb2R1Y2VkIGR1cGxpY2F0ZSBkaXNwYXRjaGVzLlxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobTogYW55KSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKG0pKTtcbiAgICBjaHJvbWUudGFicz8ub25BY3RpdmF0ZWQ/LmFkZExpc3RlbmVyKCgpID0+IHZvaWQgcnVuVmFsaWRhdGlvbigpKTtcbiAgICBjaHJvbWUudGFicz8ub25VcGRhdGVkPy5hZGRMaXN0ZW5lcigoX2lkLCBpbmZvKSA9PiB7IGlmIChpbmZvPy5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHZvaWQgcnVuVmFsaWRhdGlvbigpOyB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOnRvLXBhbmVsJywgKGUpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UoKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbCkpO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFRlc3QgQVBJIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpbnN0YWxsVGVzdEFwaSA9ICgpOiB2b2lkID0+IHtcbiAgICAod2luZG93IGFzIGFueSkuX19waW5jaGdyYWJfcGFuZWwgPSB7XG4gICAgICBwdXNoTWVzc2FnZTogKG06IFBhbmVsTWVzc2FnZSkgPT4geyBtZXNzYWdlcy5wdXNoKG0pOyBwZXJzaXN0KCk7IHJlbmRlcigpOyB9LFxuICAgICAgb25DYXB0dXJlLCBvbkhvdmVyLCBvbkhvdmVyRW5kLFxuICAgICAgZ2V0TWVzc2FnZXM6ICgpID0+IFsuLi5tZXNzYWdlc10sXG4gICAgICBnZXRQcmVmczogKCkgPT4gKHsuLi5wcmVmc30pLFxuICAgICAgc2V0UHJlZnM6IChwOiBQYXJ0aWFsPFByZWZzPikgPT4geyBwcmVmcyA9IHsuLi5wcmVmcywgLi4ucH07IHBlcnNpc3RQcmVmcygpOyBhcHBseVByZWZzVG9VSSgpOyByZW5kZXIoKTsgfSxcbiAgICAgIGJ1aWxkSnNvbmwsXG4gICAgICBidWlsZEV4cG9ydEZpbGVuYW1lLCBidWlsZE1hbmlmZXN0LCBkb21pbmFudEhvc3RTbHVnLCBkaXN0aW5jdEhvc3RzLFxuICAgICAgZHVja0RiU25pcHBldCwgb25FeHBvcnRaaXAsIG9uRXhwb3J0LCBvbkNvcHlQYXRoLFxuICAgICAgZGVub3JtYWxpemVFbnRyeSxcbiAgICAgIGdldExhc3RFeHBvcnQ6ICgpID0+ICh7Li4ubGFzdEV4cG9ydH0pLFxuICAgICAgLy8gVGVzdCBoYXRjaDogc2VlZCBldmVyeSBzZWxlY3RvciBjYXB0dXJlIHdpdGggdGhlIHNhbWUgZnVsbCBQTkcgZGF0YVVSTFxuICAgICAgLy8gc28gdGhlIGFyY2hpdmUgZXhwb3J0IGhhcyBzb21ldGhpbmcgdG8gYnVuZGxlLiBSZWFsIGNhcHR1cmVzIHBvcHVsYXRlXG4gICAgICAvLyBzaG90c0Z1bGwgZnJvbSB0aGUgYmcgYHJ1blNob3RgIHJlcGx5OyB0ZXN0cyBjYW4ndCBlYXNpbHkgcnVuIGFcbiAgICAgIC8vIGNhcHR1cmVWaXNpYmxlVGFiLCBzbyB0aGlzIGxldHMgdXMgcHJvdmUgdGhlIFBORyBidW5kbGluZyBwYXRoLlxuICAgICAgX19zZWVkU2hvdHNGdWxsOiAoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNob3RzRnVsbC5zZXQobS5lbnRyeS5zZWxlY3RvciwgZGF0YVVybCk7XG4gICAgICAgIH1cbiAgICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgICAgfSxcbiAgICAgIF9fZ2V0U2hvdHNGdWxsOiAoKSA9PiBzaG90c0Z1bGwsXG4gICAgICBzZXRTZWFyY2g6IChxOiBzdHJpbmcpID0+IHsgc2VhcmNoUXVlcnkgPSBxOyBzZWFyY2gudmFsdWUgPSBxOyByZW5kZXIoKTsgfSxcbiAgICAgIHNldFZhbGlkaXR5OiAoc2VsOiBzdHJpbmcsIG9rOiBib29sZWFuIHwgJ2RpZmYtcGFnZScsIHJlYXNvbj86IHN0cmluZykgPT4ge1xuICAgICAgICBzZWxlY3RvclZhbGlkaXR5LnNldChzZWwsIG9rKTtcbiAgICAgICAgaWYgKHJlYXNvbikgc2VsZWN0b3JFcnJvcnMuc2V0KHNlbCwgcmVhc29uKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgY2xlYXI6ICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgICAgIGxpdmVUYWJQYXRoID0gbnVsbDtcbiAgICAgICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgcGVuZGluZ011bHRpID0gW107XG4gICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICAgICAgc2hvdHMuY2xlYXIoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBvcGVuUGFsZXR0ZSwgY2xvc2VQYWxldHRlLCBvcGVuRHJhd2VyLCBjbG9zZURyYXdlcixcbiAgICAgIHNlbmRGZWVkYmFjaywgdW5kbywgcmVkbyxcbiAgICAgIGxpc3RXb3Jrc3BhY2VzOiAoKSA9PiBbLi4ud29ya3NwYWNlc10sXG4gICAgICBhY3RpdmVXb3Jrc3BhY2U6ICgpID0+IGFjdGl2ZVdzLFxuICAgICAgc2V0U3RpY2t5VFRMOiAobXM6IG51bWJlcikgPT4geyBTVElDS1lfVFRMX01TID0gbXM7IH0sXG4gICAgICBmb3JjZVN0aWNreUV4cGlyZTogKCkgPT4geyBjbGVhclRpbWVvdXQoc3RpY2t5VGltZXIpOyBwYW5lbEhvdmVyZWQgPSBmYWxzZTsgYXJtU3RpY2t5RXhwaXJ5KCk7IH0sXG4gICAgICBzZXRMYXN0QWN0aXZlLFxuICAgICAgY3JlYXRlV29ya3NwYWNlOiAobjogc3RyaW5nKSA9PiB7IHdvcmtzcGFjZXMucHVzaCh7bmFtZTogbiwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTsgcGVyc2lzdFdvcmtzcGFjZXMoKTsgcmV0dXJuIGxvYWRXb3Jrc3BhY2UobikudGhlbihyZW5kZXIpOyB9LFxuICAgICAgc3dpdGNoV29ya3NwYWNlOiAobjogc3RyaW5nKSA9PiBsb2FkV29ya3NwYWNlKG4pLnRoZW4ocmVuZGVyKSxcbiAgICB9O1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCb290IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9hZEFsbCgpO1xuICAgIHBhbmVsUmVhZHkgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgbSBvZiBwZW5kaW5nUGFuZWxNZXNzYWdlcy5zcGxpY2UoMCkpIG9uQ3NNZXNzYWdlKG0pO1xuICAgIHJlbmRlcigpO1xuICAgIGluc3RhbGxUZXN0QXBpKCk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gICAgdm9pZCBmZXRjaFN0YXJzKCk7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAncmVhZHknLCB7aW5FeHRlbnNpb24sIHdzOiBhY3RpdmVX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QUFHLGtCQUFrQjtBQUFBLFVBQUcsT0FBTyxjQUFjLENBQUMsRUFBRSxLQUFLLE1BQU07QUFBQTtBQUFBLFFBQzNKLGlCQUFpQixDQUFDLE1BQWMsY0FBYyxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQUEsTUFDOUQ7QUFBQTtBQUFBLEtBSUksWUFBWTtBQUFBLE1BQ2hCLE1BQU0sUUFBUTtBQUFBLE1BQ2QsYUFBYTtBQUFBLE1BQ2IsV0FBVyxLQUFLLHFCQUFxQixPQUFPLENBQUM7QUFBQSxRQUFHLFlBQVksQ0FBQztBQUFBLE1BQzdELE9BQU87QUFBQSxNQUNQLGVBQWU7QUFBQSxNQUNWLGNBQWM7QUFBQSxNQUNkLFdBQVc7QUFBQSxNQUNoQixvQkFBb0I7QUFBQSxNQUNwQixrQkFBa0I7QUFBQSxNQUNsQixRQUFRLElBQUksS0FBSyxTQUFTLEVBQUMsYUFBYSxJQUFJLFVBQVUsVUFBVSxTQUFTLE9BQU0sQ0FBQztBQUFBLE9BQy9FO0FBQUEsS0FDRjsiLAogICJkZWJ1Z0lkIjogIjNCOUI0QjZBMjhDQTU2Nzc2NDc1NkUyMTY0NzU2RTIxIiwKICAibmFtZXMiOiBbXQp9
