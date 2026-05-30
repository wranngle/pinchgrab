(() => {
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
    let fallbackIdCounter = 0;
    const secureToken = (bytes = 12) => {
      try {
        const raw = new Uint8Array(bytes);
        globalThis.crypto.getRandomValues(raw);
        return Array.from(raw).map((b) => b.toString(16).padStart(2, "0")).join("");
      } catch {
        return `${Date.now().toString(36)}_${(++fallbackIdCounter).toString(36)}`;
      }
    };
    const msgId = () => {
      try {
        if (globalThis.crypto.randomUUID)
          return globalThis.crypto.randomUUID();
      } catch {}
      return `id_${secureToken(16)}`;
    };
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
    const appendJsonHighlight = (root, text) => {
      root.textContent = "";
      let m;
      let last = 0;
      JSON_TOKEN_RE.lastIndex = 0;
      while ((m = JSON_TOKEN_RE.exec(text)) !== null) {
        if (m.index > last)
          root.append(document.createTextNode(text.slice(last, m.index)));
        last = JSON_TOKEN_RE.lastIndex;
        const [, ws, str, lit, num, punct] = m;
        if (ws) {
          root.append(document.createTextNode(ws));
          continue;
        }
        if (str) {
          let k = JSON_TOKEN_RE.lastIndex;
          while (k < text.length && (text[k] === " " || text[k] === "\t" || text[k] === `
`))
            k++;
          const span2 = document.createElement("span");
          if (text[k] === ":") {
            let key;
            try {
              key = JSON.parse(str);
            } catch {
              key = str.slice(1, -1);
            }
            span2.className = "k";
            span2.style.color = colorForKey(key);
          } else {
            span2.className = "s";
          }
          span2.textContent = str;
          root.append(span2);
          continue;
        }
        const span = document.createElement("span");
        if (lit)
          span.className = "b";
        else if (num)
          span.className = "n";
        else if (punct)
          span.className = "p";
        span.textContent = lit ?? num ?? punct ?? "";
        root.append(span);
      }
      if (last < text.length)
        root.append(document.createTextNode(text.slice(last)));
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
        const reqId = `req_${secureToken(12)}`;
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
    const centerElementInList = (el) => {
      const listRect = list.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const target = list.scrollTop + elRect.top - listRect.top - list.clientHeight / 2 + elRect.height / 2;
      list.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    };
    const scrollMessageIntoView = (id) => {
      const el = list.querySelector(`[data-id="${id}"]`);
      if (!el)
        return;
      centerElementInList(el);
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
        btn.setAttribute("aria-label", "Insert capture or comment here");
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
      cancel.setAttribute("aria-label", "Cancel inline comment");
      cancel.innerHTML = PG_ICONS.svgString("x", 20);
      cancel.addEventListener("click", () => onCancel?.());
      const send = document.createElement("button");
      send.type = "button";
      send.className = "iconbtn primary";
      send.dataset.tip = "Save · Enter";
      send.setAttribute("aria-label", "Save inline comment");
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
        empty.innerHTML = `<div class="empty-icon">\uD83E\uDD0F</div>
        <div class="empty-title">Start with the page you want to critique.</div>
        <div class="empty-body">Open a page, then capture an element. Comments stay paired with the thing you grabbed.</div>
        <div class="empty-keys">Alt+Click to capture</div>`;
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
      cancel.setAttribute("aria-label", "Cancel pending group");
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
        appendJsonHighlight(body, text);
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
      b.setAttribute("aria-label", "Delete capture");
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
        yes.setAttribute("aria-label", "Confirm delete");
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
        no.setAttribute("aria-label", "Cancel delete");
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
            centerElementInList(firstHit);
            const mk = firstHit.querySelector("mark");
            if (mk)
              centerElementInList(mk);
          } else {
            const firstMatch = list.querySelector(".msg mark");
            if (firstMatch)
              centerElementInList(firstMatch);
          }
        });
      }
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
    const markdownOverview = (content, kind, usingTemplate) => {
      const lines = content.trim() ? content.split(`
`).length : 0;
      const bytes = new Blob([content]).size;
      const headings = content.split(`
`).map((line) => /^#{1,3}\s+(.+)$/.exec(line.trim())?.[1]?.trim()).filter((heading) => Boolean(heading)).slice(0, 4);
      const label = kind === "design" ? "Visual source" : "Triage guide";
      const source = usingTemplate ? "Template fallback" : "Custom";
      const sections = headings.length ? headings.join(" / ") : "No section headings found";
      return `${label}
${source} · ${lines.toLocaleString()} lines · ${(bytes / 1024).toFixed(1)} KB
Sections: ${sections}`;
    };
    const renderMdPreview = async (kind) => {
      const previewEl = document.querySelector(`[data-md-preview="${kind}"]`);
      if (!previewEl)
        return;
      const content = kind === "design" ? await resolveDesignContent() : await resolveSkillContent();
      const usingTemplate = kind === "design" ? isUsingTemplateDesign() : isUsingTemplateSkill();
      previewEl.textContent = markdownOverview(content, kind, usingTemplate);
    };
    const openMdModal = async (kind) => {
      const overlay = document.querySelector("[data-md-modal]");
      if (!overlay)
        return;
      const titleEl = overlay.querySelector("[data-md-modal-title]");
      const taEl = overlay.querySelector("[data-md-modal-textarea]");
      const statsEl2 = overlay.querySelector("[data-md-modal-stats]");
      const bannerEl = overlay.querySelector("[data-md-modal-banner]");
      const summaryEl = overlay.querySelector("[data-md-modal-summary]");
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
        summaryEl.textContent = markdownOverview(text, kind, usingTemplate);
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
          del.setAttribute("aria-label", `Delete workspace ${w.name}`);
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
    window.addEventListener("scroll", hideTip, true);
    document.addEventListener("pointerdown", hideTip, true);
    const tipGuard = new MutationObserver(() => {
      if (tipFor && !tipFor.isConnected)
        hideTip();
    });
    tipGuard.observe(document.body, { childList: true, subtree: true });
    const appendHeading = (root, text) => {
      const h = document.createElement("h5");
      h.textContent = text;
      root.append(h);
    };
    const appendBold = (root, text) => {
      const b = document.createElement("b");
      b.textContent = text;
      root.append(b);
    };
    const appendCode = (root, text) => {
      const code = document.createElement("code");
      code.textContent = text;
      root.append(code);
    };
    const buildDrilldown = (kind) => {
      const frag = document.createDocumentFragment();
      if (kind === "selectors") {
        appendHeading(frag, "Selectors by quality");
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
        const ul = document.createElement("ul");
        for (const [value, label] of [
          [buckets.testid, " data-testid"],
          [buckets.id, " stable id"],
          [buckets.class, " class-based"],
          [buckets.nth, " nth-of-type"],
          [buckets.tag, " tag-only"]
        ]) {
          const li = document.createElement("li");
          appendBold(li, String(value));
          li.append(label);
          ul.append(li);
        }
        frag.append(ul);
      } else if (kind === "stale") {
        appendHeading(frag, "Stale captures");
        const ul = document.createElement("ul");
        const stale = messages.filter((m) => m.type === "selector" && selectorValidity.get(m.entry.selector) === false);
        if (!stale.length) {
          const li = document.createElement("li");
          li.textContent = "None - everything resolves.";
          ul.append(li);
        } else
          for (const m of stale) {
            const li = document.createElement("li");
            appendBold(li, `#${m.entry.n}`);
            li.append(" ");
            appendCode(li, (m.entry.selector ?? "").slice(0, 50));
            ul.append(li);
          }
        frag.append(ul);
      } else if (kind === "comments") {
        appendHeading(frag, "Comments");
        const ul = document.createElement("ul");
        const fbs = messages.filter((m) => m.type === "feedback");
        const total = document.createElement("li");
        total.append("Total words: ");
        appendBold(total, String(fbs.reduce((s, m) => s + wordCount(m.text), 0)));
        ul.append(total);
        const avg = document.createElement("li");
        avg.append("Average length: ");
        appendBold(avg, String(fbs.length ? Math.round(fbs.reduce((s, m) => s + m.text.length, 0) / fbs.length) : 0));
        avg.append(" chars");
        ul.append(avg);
        frag.append(ul);
      } else if (kind === "pages") {
        appendHeading(frag, "Pages");
        const ul = document.createElement("ul");
        const seen = new Map;
        for (const m of messages)
          if (m.type === "selector")
            seen.set(m.entry.url, (seen.get(m.entry.url) ?? 0) + 1);
        for (const [url, n] of seen) {
          const li = document.createElement("li");
          appendBold(li, String(n));
          li.append(` selector${n === 1 ? "" : "s"} · `);
          appendCode(li, pathOf(url));
          ul.append(li);
        }
        frag.append(ul);
      }
      return frag;
    };
    const showDrilldown = (target) => {
      const kind = target.getAttribute("data-stat");
      if (!kind)
        return;
      drilldownEl.replaceChildren(buildDrilldown(kind));
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

//# debugId=51F61508065267BB64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvc2lkZXBhbmVsLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIi8vIFNoYXJlZCB0eXBlcyAmIG1lc3NhZ2UgcHJvdG9jb2wgYmV0d2VlbiBjb250ZW50IHNjcmlwdCwgc2lkZSBwYW5lbCwgYW5kXG4vLyBiYWNrZ3JvdW5kIHNlcnZpY2Ugd29ya2VyLlxuXG5leHBvcnQgdHlwZSBSZWN0ID0ge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG5leHBvcnQgdHlwZSBWaWV3cG9ydCA9IHtcbiAgdzogbnVtYmVyOyBoOiBudW1iZXI7IGRwcjogbnVtYmVyO1xuICAvLyBVc2VyLXByZWZlcmVuY2UgbWVkaWEtcXVlcnkgc3RhdGUgYXQgY2FwdHVyZSB0aW1lLiBMZXRzIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhc29uIGFib3V0IHdoeSBjYXB0dXJlZCBhcHBlYXJhbmNlIGRpZmZlcnMgYmV0d2VlbiBzZXNzaW9uc1xuICAvLyAoZS5nLiBkYXJrLW1vZGUgdnMgbGlnaHQtbW9kZSBvZiB0aGUgc2FtZSBjb21wb25lbnQpLlxuICBjb2xvclNjaGVtZT86ICdkYXJrJyB8ICdsaWdodCc7XG4gIHJlZHVjZWRNb3Rpb24/OiBib29sZWFuO1xuICAvLyBEb2N1bWVudCBkaXJlY3Rpb24gKGBsdHJgIC8gYHJ0bGApIOKAlCBkaWZmZXJlbnQgZnJvbSB2aWV3cG9ydCBzaXplLFxuICAvLyBjaGFuZ2VzIHRoZSBtZWFuaW5nIG9mIGBzdGFydGAvYGVuZGAgaW4gQ1NTIGFuZCB0aGUgc2Vuc2Ugb2ZcbiAgLy8gYHJlY3QueGAuIENhcHR1cmVkIHBlciBwYWdlIGhlYWRlciBzbyBSVEwgY2FwdHVyZXMgZG9uJ3QgZ2V0XG4gIC8vIHNpbGVudGx5IG1peGVkIHdpdGggTFRSIG9uZXMuXG4gIGRpcmVjdGlvbj86ICdsdHInIHwgJ3J0bCc7XG4gIC8vIEJyb3dzZXIgem9vbSBsZXZlbC4gYHZpc3VhbFZpZXdwb3J0LnNjYWxlYCByZXBvcnRzIHRoZSBwaW5jaC16b29tXG4gIC8vIGZhY3RvcjsgdmFsdWVzICE9IDEgbWVhbiB0aGUgdXNlciBoYXMgem9vbWVkIGluL291dCBhbmQgYW55IGxheW91dFxuICAvLyBidWcgdGhleSdyZSBjYXB0dXJpbmcgbWF5IG5vdCByZXBybyBhdCBkZWZhdWx0IHpvb20uXG4gIHpvb20/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGcmFtZXdvcmtJbmZvID0ge1xuICBmcmFtZXdvcms6ICdyZWFjdCcgfCAndnVlJyB8ICdsaXQnIHwgJ3N0ZW5jaWwnIHwgJ3N2ZWx0ZScgfCAnd2ViLWNvbXBvbmVudCc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuICBzb3VyY2U/OiB7ZmlsZT86IHN0cmluZyB8IG51bGw7IGxpbmU/OiBudW1iZXIgfCBudWxsfTtcbiAgLy8gVXAtdHJlZSBjb21wb25lbnQgYW5jZXN0cnkgKGlubmVybW9zdCBmaXJzdCkuIEZvciBSZWFjdCwgd2Fsa2VkIHZpYVxuICAvLyBmaWJlciBgcmV0dXJuYCBjaGFpbjsgZm9yIFZ1ZSwgdmlhIGBfX3Z1ZVBhcmVudENvbXBvbmVudC5wYXJlbnRgLlxuICAvLyBUaGUgY29tcG9uZW50IG5hbWUgYWxvbmUgZG9lc24ndCB0ZWxsIGFuIGFnZW50IHdoaWNoIGZpbGUgb3ducyB0aGVcbiAgLy8gcmVuZGVyaW5nIOKAlCB0aGUgY2hhaW4gaGVscHMgaXQgZ3JlcCB1cHdhcmQgdG8gZmluZCB0aGUgcm91dGVcbiAgLy8gY29tcG9uZW50LCB0aGVuIGRyaWxsIGludG8gdGhlIG93bmluZyBmaWxlLlxuICBjaGFpbj86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgQW5jZXN0b3IgPSB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBNYXRjaGVkUnVsZSA9IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgZGVjbGFyYXRpb25zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWVkaWE/OiBzdHJpbmc7XG4gIC8vIFdhcyB0aGUgQG1lZGlhIHF1ZXJ5IHRoYXQgd3JhcHMgdGhpcyBydWxlIGFjdHVhbGx5IG1hdGNoZWQgYXRcbiAgLy8gY2FwdHVyZSB0aW1lPyBgdHJ1ZWAgPSBhY3RpdmUsXG4gIC8vIGBmYWxzZWAgPSBtYXRjaGVkIHRoZSBzZWxlY3RvciBidXQgaW5hY3RpdmUgKGUuZy4gbW9iaWxlIHJ1bGVzXG4gIC8vIGNhcHR1cmVkIG9uIGEgZGVza3RvcCB2aWV3cG9ydCksIGB1bmRlZmluZWRgID0gbWF0Y2hNZWRpYSB0aHJldy5cbiAgbWVkaWFBY3RpdmU/OiBib29sZWFuO1xufTtcblxuLy8gU3ludGhldGljIGhpbnRzIFBpbmNoR3JhYiBhZGRzIHRvIGVudHJpZXMg4oCUIGtlcHQgZGlzdGluY3QgZnJvbSBgYXR0cnNgXG4vLyAocmVhbCBET00gYXR0cmlidXRlcykgc28gY29uc3VtZXJzIGNhbiB0ZWxsIHdoYXQgY2FtZSBmcm9tIHRoZSBwYWdlIHZzXG4vLyB3aGF0IHRoZSBjYXB0dXJlIHBpcGVsaW5lIGluamVjdGVkLlxuZXhwb3J0IHR5cGUgRW50cnlIaW50cyA9IHtcbiAgZm9ybWF0Pzogc3RyaW5nOyAgICAgLy8gaW5wdXQgZm9ybWF0IGhpbnQgKGUuZy4gJ1lZWVktTU0tREQnKVxuICB2YWx1ZU1hc2tlZD86IGJvb2xlYW47IC8vIHBhc3N3b3JkIHZhbHVlIHdhcyBtYXNrZWQgYXQgY2FwdHVyZSB0aW1lXG59O1xuXG5leHBvcnQgdHlwZSBFbnRyeSA9IHtcbiAgLy8gU3RhYmxlIHBlci1lbnRyeSB1dWlkLiBHZW5lcmF0ZWQgYXQgY2FwdHVyZSB0aW1lLiBEaXN0aW5jdCBmcm9tIGBuYFxuICAvLyAoZGlzcGxheSBzZXF1ZW5jZSkgYW5kIGZyb20gYGlkYCAoRE9NIGh0bWwgaWQgYXR0cmlidXRlKS4gRm9yZWlnbi1rZXlcbiAgLy8gdGFyZ2V0IGZvciBGZWVkYmFja01lc3NhZ2UucGFyZW50SWQuXG4gIHVpZDogc3RyaW5nO1xuICAvLyBGb3JlaWduIGtleSBpbnRvIHRoZSBzZXNzaW9uIHJvdyAoUGFnZU1lc3NhZ2Uuc2Vzc2lvbklkKS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIGxpbmsgY2FwdHVyZXMgYmFjayB0byBcIndoaWNoIHBhZ2UtbG9hZCBjb250ZXh0IGRpZCB0aGV5XG4gIC8vIGNvbWUgZnJvbT9cIiB3aXRob3V0IGRlcGVuZGluZyBvbiBVUkwgc3RyaW5nIGVxdWFsaXR5LCB3aGljaCBicmVha3NcbiAgLy8gb24gaGFzaCBuYXZpZ2F0aW9uLCBxdWVyeS1wYXJhbSBzd2FwcywgYW5kIFNQQSByb3V0aW5nLiBTZXQgYnkgdGhlXG4gIC8vIHNpZGUgcGFuZWwgYXQgbWVzc2FnZS1yZWNlaXZlIHRpbWUsIG5vdCBvbiB0aGUgcGFnZSBzaWRlLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG4gIG46IG51bWJlcjtcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBvdXRlckhUTUw/OiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIC8vIFRoZSB2aXN1YWxseS1yZW5kZXJlZCBmb3JtIHdoZW4gQ1NTIGB0ZXh0LXRyYW5zZm9ybWAgaXMgc2V0LiBDYXB0dXJlZFxuICAvLyBhbG9uZ3NpZGUgYHRleHRgICh3aGljaCBpcyB0aGUgc291cmNlLXRydXRoIGB0ZXh0Q29udGVudGApIHNvIGFuIExMTVxuICAvLyBjYW4gZGlzYW1iaWd1YXRlIGJldHdlZW4gZS5nLiBzb3VyY2UgYFJlZnJlc2hgIGFuZCByZW5kZXJlZCBgUkVGUkVTSGBcbiAgLy8gd2l0aG91dCBmYWxzZS1ncmVwcGluZyBhZ2FpbnN0IGVpdGhlci5cbiAgcmVuZGVyZWRUZXh0Pzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICBhY2Nlc3NpYmxlTmFtZT86IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7ICAgICAgICAgICAgLy8gdGhlIERPTSBodG1sIGlkIGF0dHJpYnV0ZSAodW5jaGFuZ2VkKVxuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbiAgYXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyByZWFsIERPTSBhdHRyaWJ1dGVzIG9ubHlcbiAgaGludHM/OiBFbnRyeUhpbnRzOyAgICAgLy8gc3ludGhldGljIGNhcHR1cmUtdGltZSBoaW50c1xuICByZWN0OiBSZWN0O1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIGluU2hhZG93RE9NPzogYm9vbGVhbjtcbiAgLy8gQ1NTIHNlbGVjdG9yIGZvciB0aGUgc2hhZG93IGhvc3Qgd2hlbiBgaW5TaGFkb3dET01gIGlzIHRydWUuIExldHMgYVxuICAvLyBjb25zdW1lciAob3IgdGhlIHBhbmVsJ3MgcmUtdmFsaWRhdGlvbiBwYXNzKSBmaW5kIHRoZSBob3N0IGVsZW1lbnRcbiAgLy8gc2luY2UgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGRvZXNuJ3QgcGllcmNlIHNoYWRvdyByb290cy5cbiAgc2hhZG93SG9zdD86IHN0cmluZztcbiAgY29tcG9uZW50Um9vdD86IHN0cmluZztcbiAgYW5jZXN0b3JzPzogQW5jZXN0b3JbXTtcbiAgY29tcG9uZW50PzogRnJhbWV3b3JrSW5mbztcbiAgLy8gUmVhY3QgZXZlbnQgaGFuZGxlciBuYW1lcyBwcm9iZWQgZnJvbSBgX19yZWFjdFByb3BzJDxrZXk+YCDigJQgYW5zd2Vyc1xuICAvLyBcIndoaWNoIGhhbmRsZXIgZmlyZXMgd2hlbiB0aGlzIGlzIGNsaWNrZWQ/XCIgd2l0aG91dCBhbiBMTE0gaGF2aW5nIHRvXG4gIC8vIGdyZXAgdGhlIGNvZGViYXNlLiBJbiBkZXYgYnVpbGRzIHRoZXNlIGFyZSByZWFsIGZ1bmN0aW9uIG5hbWVzOyBpblxuICAvLyBwcm9kIHRoZXkncmUgbWluaWZpZWQgYnV0IHN0aWxsIGFuY2hvci1hYmxlLlxuICBldmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBodG14IC8gU3RpbXVsdXMgLyBBbHBpbmUgLyBUdXJibyB3aXJpbmcgb24gdGhlIGVsZW1lbnQuIFNlcnZlci1cbiAgLy8gcmVuZGVyZWQgYXBwcyBkb24ndCBoYXZlIFJlYWN0IGZpYmVycyDigJQgZm9yIHRoZW0sIHRoaXMgSVMgdGhlXG4gIC8vIGNvbXBvbmVudCBzaGFwZS5cbiAgYmVoYXZpb3JBdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIFRydWUgd2hlbiBgZWwuZ2V0QW5pbWF0aW9ucygpYCByZXBvcnRlZCBhbiBhY3RpdmVseS1wbGF5aW5nXG4gIC8vIGFuaW1hdGlvbiBhdCBjYXB0dXJlIHRpbWUuIFRlbGxzIHRoZSBjb25zdW1lciB0aGF0IGNhcHR1cmVkIHJlY3QgL1xuICAvLyB0cmFuc2Zvcm0gLyBvcGFjaXR5IG1heSBiZSBhdCBhbiBpbnRlcnBvbGF0ZWQgbWlkLWFuaW1hdGlvbiB2YWx1ZS5cbiAgaXNBbmltYXRpbmc/OiBib29sZWFuO1xuICAvLyBGb3IgZWxlbWVudHMgcmVuZGVyZWQgaW50byBhIGA8Y2FudmFzPmAsIHRoZSBET00gZ2l2ZXMgdXMgZXNzZW50aWFsbHlcbiAgLy8gbm90aGluZyBhYm91dCB3aGF0IHdhcyBjbGlja2VkIOKAlCB0aGUgY2FudmFzIGhhcyBubyBjaGlsZHJlbiwgbm9cbiAgLy8gdGV4dCwgbm8gbWVhbmluZ2Z1bCBzZWxlY3RvcnMgYmVsb3cgdGhlIGNhbnZhcyBpdHNlbGYuIENhcHR1cmUgdGhlXG4gIC8vIGNsaWNrIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjYW52YXMncyBib3VuZGluZyBib3ggc28gYSBkb3duc3RyZWFtXG4gIC8vIGNvbnN1bWVyIGNhbiBjb3JyZWxhdGUgKGUuZy4gYWdhaW5zdCBhIERhdGFkb2cgLyBUYWJsZWF1IC8gY2hhcnRpbmdcbiAgLy8gbGlicmFyeSB0aGF0IGV4cG9zZXMgZGF0YS1wb2ludCBjb29yZGluYXRlcykuIENvb3JkaW5hdGVzIGFyZSBDU1NcbiAgLy8gcGl4ZWxzOyBtdWx0aXBseSBieSBgdmlld3BvcnQuZHByYCB0byBnZXQgZGV2aWNlIHBpeGVscy5cbiAgY2FudmFzQ2xpY2s/OiB7XG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIG9mZnNldFk6IG51bWJlcjtcbiAgICBjYW52YXNXOiBudW1iZXI7XG4gICAgY2FudmFzSDogbnVtYmVyO1xuICAgIGNhbnZhc1NlbGVjdG9yOiBzdHJpbmc7XG4gIH07XG4gIC8vIENvbnRlbnRlZGl0YWJsZSByaWNoLXRleHQgZWRpdG9yIGNvbnRleHQuIFBvcHVsYXRlZCB3aGVuIHRoZSBjYXB0dXJlZFxuICAvLyBub2RlIGlzLCBvciBsaXZlcyBpbnNpZGUsIGEgYFtjb250ZW50ZWRpdGFibGU9dHJ1ZV1gIGFuY2VzdG9yLiBMZXRzXG4gIC8vIGFuIExMTSByZWFzb25pbmcgYWJvdXQgYSBcImNvcHkgaXMgd3JvbmdcIiAvIFwidGhlIGVkaXRvciBicmVha3Mgd2hlbiBYXCJcbiAgLy8gY2FwdHVyZSBrbm93IHdoaWNoIGVkaXRvciBsaWJyYXJ5IHRvIGxvb2sgYXQg4oCUIHNlbGVjdG9ycyBnZW5lcmF0ZWRcbiAgLy8gYnkgUHJvc2VNaXJyb3IgLyBMZXhpY2FsIC8gZXRjIGFyZSBydW50aW1lLWludGVybmFsIGFuZCB3b24ndCBncmVwXG4gIC8vIGFnYWluc3QgdXNlciBjb2RlLCBidXQgdGhlIExJQlJBUlkgcG9pbnRlciByb3V0ZXMgdGhlIExMTSB0byB0aGVcbiAgLy8gcmlnaHQgd3JhcHBlciBjb21wb25lbnQuXG4gIGVkaXRvcj86IHtcbiAgICBraW5kOiAncHJvc2VtaXJyb3InIHwgJ2xleGljYWwnIHwgJ3NsYXRlJyB8ICdxdWlsbCcgfCAndGlwdGFwJyB8ICduYXRpdmUnO1xuICAgIHJvb3RTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbiAgfTtcbiAgLy8gTGFzdCBmZXcgRE9NIG11dGF0aW9ucyBCRUZPUkUgdGhlIGNsaWNrLiBSZXBybyBjb250ZXh0IGZvciBidWdzIGxpa2VcbiAgLy8gXCJJIGNsaWNrZWQgdGhlIHdyb25nIGRyb3Bkb3duIG9wdGlvblwiIG9yIFwidGhlIHZhbHVlIGZsaWNrZXJlZCBiZWZvcmVcbiAgLy8gSSBjbGlja2VkIGl0XCIg4oCUIHdpdGhvdXQgdGhpcywgdGhlIEpTT04gc25hcHNob3RzIG9ubHkgdGhlIHBvc3QtXG4gIC8vIG11dGF0aW9uIHN0YXRlLCBsZWF2aW5nIHRoZSBMTE0gYmxpbmQgdG8gd2hhdCB0cmlnZ2VyZWQgdGhlXG4gIC8vIGFwcGVhcmFuY2UgdGhlIHVzZXIgY29tcGxhaW5lZCBhYm91dC4gUGluY2hncmFiIGtlZXBzIGFuIDgtc2Vjb25kXG4gIC8vIHJpbmcgYnVmZmVyIG9mIG11dGF0aW9uIHJlY29yZHM7IGNhcHR1cmUgYXR0YWNoZXMgdGhlIG1vc3QgcmVjZW50XG4gIC8vIDMgYXMgYSBzbmFwc2hvdC5cbiAgZG9tTXV0YXRpb25zPzogRG9tTXV0YXRpb25bXTtcbiAgc3RhdGVzPzogc3RyaW5nW107ICAgICAgLy8gYWN0aXZlIHBzZXVkby1jbGFzc2VzICh3YXMgUmVjb3JkPHN0cmluZywgdHJ1ZT4gaW4gdjEpXG4gIC8vIExvY2F0b3IgcXVhbGl0eTogaG93IG1hbnkgZWxlbWVudHMgYHNlbGVjdG9yYCByZXNvbHZlcyB0byBpbiBpdHNcbiAgLy8gc2NvcGUgKDEgPSB1bmlxdWUpLiBIaWdoZXIgbWVhbnMgdGhlIHNlbGVjdG9yIGlzIGFtYmlndW91cy5cbiAgc2VsZWN0b3JNYXRjaENvdW50PzogbnVtYmVyO1xuICAvLyBEaXNhbWJpZ3VhdGVkIG9yZGVyaW5nIGZpZWxkcy5cbiAgLy8gYG5gIGlzIHByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdCAoaXQncyB0aGUgY2FwdHVyZS1zZXF1ZW5jZVxuICAvLyBkaXNwbGF5IGxhYmVsIGluIHRoZSBzaWRlYmFyKS4gVGhlIG5ldyBmaWVsZHMgYXJlIGVtaXQtdGltZSBvbmx5OlxuICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHNhbWUgYXMgYG5gIChjYXB0dXJlIHNlcXVlbmNlIHdpdGhpbiBzZXNzaW9uKVxuICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgcmFuayB3aXRoaW4gdGhlIHBhZ2VcbiAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCBodW1hbi1mYWNpbmcgbGFiZWwgKG1pcnJvcnMgYG5gIHRvZGF5KVxuICBjYXB0dXJlSW5kZXg/OiBudW1iZXI7XG4gIGV2ZW50SW5kZXg/OiBudW1iZXI7XG4gIHZpc3VhbE9yZGVyPzogbnVtYmVyO1xuICBkaXNwbGF5TGFiZWw/OiBzdHJpbmc7XG4gIC8vIEdyb3VwIGZsYXR0ZW5pbmcgZmllbGRzLlxuICAvLyBUaGUgZ3JvdXAgaGVhZCBjYXJyaWVzIGBncm91cE1lbWJlclVpZHNgIChqdXN0IHRoZSBJRHMpOyBlYWNoXG4gIC8vIG1lbWJlciBlbWl0cyBhcyBpdHMgb3duIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nXG4gIC8vIGJhY2sgYXQgdGhlIGhlYWQuXG4gIGdyb3VwTWVtYmVyVWlkcz86IHN0cmluZ1tdO1xuICBncm91cFVpZD86IHN0cmluZztcbiAgLy8gTGlnaHR3ZWlnaHQgYTExeSBhdWRpdCBjYXB0dXJlZCBhdCBjbGljayB0aW1lLiBIZWF2aWVyIGNoZWNrc1xuICAvLyAoZm9jdXMtdmlzaWJsZSBzY3JlZW5zaG90cywgYXhlIHZpb2xhdGlvbnMpIGFyZSBub3QgeWV0IHdpcmVkLlxuICBhMTF5Pzoge1xuICAgIGNvbnRyYXN0UmF0aW8/OiBudW1iZXI7XG4gICAgY29udHJhc3RQYXNzZXM/OiAnQUEnIHwgJ0FBQScgfCAnZmFpbCc7XG4gICAgdGFiYmFibGU/OiBib29sZWFuO1xuICAgIGZvY3VzVmlzaWJsZT86IGJvb2xlYW47XG4gIH07XG4gIC8vIFBhcmVudCBsYXlvdXQgY29udGV4dCDigJQgZmxleC9ncmlkL292ZXJmbG93L3Njcm9sbC9zdGFja2luZ1xuICAvLyBhbmNlc3RvcnMgdGhhdCBzaGFwZSB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGFwcGVhcmFuY2UuXG4gIGxheW91dENvbnRleHQ/OiBBcnJheTx7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgZGlzcGxheT86IHN0cmluZztcbiAgICBwb3NpdGlvbj86IHN0cmluZztcbiAgICBvdmVyZmxvdz86IHN0cmluZztcbiAgICB6SW5kZXg/OiBzdHJpbmc7XG4gICAgdHJhbnNmb3JtPzogc3RyaW5nO1xuICAgIHdpbGxDaGFuZ2U/OiBzdHJpbmc7XG4gICAgaXNTY3JvbGxDb250YWluZXI/OiBib29sZWFuO1xuICAgIHNjcm9sbExlZnQ/OiBudW1iZXI7XG4gICAgc2Nyb2xsVG9wPzogbnVtYmVyO1xuICAgIGZsZXg/OiB7ZGlyZWN0aW9uPzogc3RyaW5nOyB3cmFwPzogc3RyaW5nOyBhbGlnbkl0ZW1zPzogc3RyaW5nOyBqdXN0aWZ5Q29udGVudD86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgICBncmlkPzoge3RlbXBsYXRlQ29sdW1ucz86IHN0cmluZzsgdGVtcGxhdGVSb3dzPzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICB9PjtcbiAgLy8gQXNzZXQgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIGNhcHR1cmVkIHN1YnRyZWUgKGltZyBzcmMsIDx1c2UgaHJlZj4sXG4gIC8vIGJhY2tncm91bmQtaW1hZ2UgdXJsKS4gV2hlbiBhIGNvbXBsYWludCBpcyBhYm91dCBhIGxvZ28gLyBpY29uIC9cbiAgLy8gYXJ0d29yaywgYW4gYWdlbnQgd2l0aG91dCB0aGVzZSByZWZlcmVuY2VzIHdvdWxkIGJlIGxlZnQgZ3Vlc3NpbmcuXG4gIGFzc2V0cz86IEFycmF5PHtcbiAgICBzcmM6IHN0cmluZztcbiAgICBuYXR1cmFsVz86IG51bWJlcjsgbmF0dXJhbEg/OiBudW1iZXI7XG4gICAgcmVuZGVyZWRXPzogbnVtYmVyOyByZW5kZXJlZEg/OiBudW1iZXI7XG4gICAgYWx0Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gIH0+O1xuICBzdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtYXRjaGVkUnVsZXM/OiBNYXRjaGVkUnVsZVtdO1xuICBwc2V1ZG9FbGVtZW50cz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICAvLyBUcnVuY2F0aW9uIG1hcmtlcnMg4oCUIHByZXNlbnQgd2hlbiBjYXB0dXJlIGhhZCB0byBlbGlkZSBjb250ZW50LiBMZXRzXG4gIC8vIGEgY29uc3VtZXIgZGV0ZWN0IFwidGhpcyBlbnRyeSB3YXMgY3V0IGRvd25cIiBhbmQgcmVmZXRjaCBmcm9tIHRoZVxuICAvLyBsaXZlIHBhZ2UgaWYgaXQgbmVlZHMgdGhlIGZ1bGwgdmVyc2lvbi5cbiAgLy8gICBvdXRlckhUTUwg4oCUIG9yaWdpbmFsIGh0bWwgbGVuZ3RoIGJlZm9yZSB0aGUgc2l6ZS1jYXAga2lja2VkIGluLlxuICAvLyAgIGNoaWxkcmVuICDigJQgbnVtYmVyIG9mIGRlc2NlbmRhbnQgc3VidHJlZXMgcmVwbGFjZWQgYnkgZGVwdGgtY2FwXG4gIC8vICAgICAgICAgICAgICAgZWxpc2lvbiBtYXJrZXJzIChgPCEtLSBOIGNoaWxkcmVuIGVsaWRlZCAtLT5gKS5cbiAgdHJ1bmNhdGVkPzoge291dGVySFRNTD86IG51bWJlcjsgY2hpbGRyZW4/OiBudW1iZXI7IHRleHQ/OiBudW1iZXJ9O1xuICAvLyBHcm91cCBvZiBhZGRpdGlvbmFsIGNhcHR1cmVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudHJ5IChBbHQrU2hpZnQrQ2xpY2tcbiAgLy8gLyBBbHQrZHJhZyBzZWxlY3Rpb25zIGNvbGxhcHNlIGhlcmUpLlxuICBncm91cD86IEVudHJ5W107XG4gIC8vIE9wdGlvbmFsIHNjcmVlbnNob3QgYnVuZGxlOiBlYWNoIGZpZWxkIGlzIGEgcmVsYXRpdmUgcGF0aCB1bmRlciB0aGVcbiAgLy8gdXNlcidzIERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+LyByb290LiBUaGUgY2FwdHVyZWRBdCBzdGFtcCBpc1xuICAvLyB0aGUgSVNPIHRpbWVzdGFtcCB3aGVuIHRoZSBzaG90IHdhcyB0YWtlbi5cbiAgc2NyZWVuc2hvdD86IHtcbiAgICBlbGVtZW50Pzogc3RyaW5nO1xuICAgIGdyb3VwPzogc3RyaW5nO1xuICAgIHBhZ2U/OiBzdHJpbmc7XG4gICAgY2FwdHVyZWRBdD86IHN0cmluZztcbiAgICAvLyBBbiBlbXB0eSBgc2NyZWVuc2hvdGAgZmllbGQgY291bGQgbWVhbiBcIm5vdCB5ZXQgc2hvdFwiLCBcImZhaWxlZFwiLFxuICAgIC8vIG9yIFwic2tpcHBlZCBvbiBwdXJwb3NlXCIuIFdoZW4gdGhlIHBpcGVsaW5lIGRlY2xpbmVzIG9yIGZhaWxzLFxuICAgIC8vIHNldCB0aGlzIHNvIHJlY2VpdmVycyBrbm93IGl0J3Mgbm90IGEgcmV0cnkgY2FuZGlkYXRlLlxuICAgIHVuYXZhaWxhYmxlUmVhc29uPzogJ2F1dG9TY3JlZW5zaG90T2ZmJyB8ICdza2lwU2NyZWVuc2hvdEhvc3RzJyB8ICdjYXB0dXJlRmFpbGVkJyB8ICdwZXJtaXNzaW9uRGVuaWVkJyB8IHN0cmluZztcbiAgICAvLyBDcm9wIG1ldGFkYXRhIGRlc2NyaWJpbmcgd2hlcmUgdGhlIGNyb3BwZWQgUE5HIGZpdHMgaW4gdGhlXG4gICAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICBjcm9wPzoge1xuICAgICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZHByOiBudW1iZXI7XG4gICAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICAgIH07XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0NzID1cbiAgfCB7a2luZDogJ291dGxpbmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBnb2xkPzogYm9vbGVhbjsgZGFzaGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ291dGxpbmUtY2xlYXInfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ31cbiAgfCB7a2luZDogJ3Njcm9sbC10byc7IHNlbGVjdG9yOiBzdHJpbmc7IHN0aWNreT86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdzdGlja3ktY2xlYXInfVxuICAvLyBPbmUtc2hvdCBsb2NhdG9yIGFuaW1hdGlvbjogc2Nyb2xsIGludG8gdmlldyArIHRocmVlIHB1bHNpbmcgcmluZ3MuXG4gIC8vIERpc3RpbmN0IGZyb20gYG91dGxpbmVgIChzdWJ0bGUgaG92ZXIgcmluZykgYW5kIGBzY3JvbGwtdG9gIChzaWxlbnRcbiAgLy8gcmVjZW50ZXIpIHNvIHRoZSBzaWRlIHBhbmVsIExvY2F0ZSBidXR0b24gY2FuIHJlcXVlc3Qgc29tZXRoaW5nIHVzZXJzXG4gIC8vIGNhbiBhY3R1YWxseSBmaW5kIG9uIGEgYnVzeSBwYWdlLlxuICB8IHtraW5kOiAnbG9jYXRlLWZsYXNoJzsgc2VsZWN0b3I6IHN0cmluZ31cbiAgfCB7a2luZDogJ3ZhbGlkYXRlJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ2xvZy1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ3JlY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgLy8gT3V0bGluZSB0aGUgTnRoIGFuY2VzdG9yIG9mIGBzZWxlY3RvcmAgd2l0aG91dCBjYXB0dXJpbmcgaXQg4oCUIHVzZWQgYnlcbiAgLy8gaG92ZXIgb24gYW5jZXN0b3IgYnJlYWRjcnVtYiBjaGlwcyBpbiB0aGUgc2lkZSBwYW5lbCBzbyB0aGUgdXNlclxuICAvLyBwcmV2aWV3cyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNsaWNraW5nLlxuICB8IHtraW5kOiAnb3V0bGluZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbHQtc3RhdGUnOyBvbjogYm9vbGVhbn1cbiAgfCB7a2luZDogJ21hbnVhbC1jYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24nOyBzZWxlY3Rvcjogc3RyaW5nOyBwYXlsb2FkOiBBbm5vdGF0aW9uUGF5bG9hZCB8IG51bGx9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY2FuY2VsJ31cbiAgfCB7a2luZDogJ3BlbmRpbmctY29tbWl0J31cbiAgfCB7a2luZDogJ2NvbnRleHQtY2FwdHVyZSd9XG4gIHwge2tpbmQ6ICdzZXQtY2FwdHVyZWQnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnc2V0LWNzLXByZWZzJzsgc3BhY2luZ092ZXJsYXk/OiBib29sZWFuOyBob3ZlclNuYXA/OiBib29sZWFufVxuICAvLyBTY3JlZW5zaG90LXRpbWUgb3ZlcmxheSB0b2dnbGVzLiBUaGUgYmFja2dyb3VuZCBhc2tzIHRoZSBjb250ZW50IHNjcmlwdFxuICAvLyB0byBoaWRlIGl0cyBzaGFkb3ctcm9vdCBjaHJvbWUgKHJpbmdzLCBydWJiZXItYmFuZCwgYW5ub3RhdGlvbikgYmVmb3JlXG4gIC8vIGNhcHR1cmVWaXNpYmxlVGFiIGZpcmVzLCB0aGVuIHJlc3RvcmVzIHZpc2liaWxpdHkgb25jZSB0aGUgUE5HIGlzIGJhY2suXG4gIHwge2tpbmQ6ICdoaWRlLW92ZXJsYXlzJ31cbiAgfCB7a2luZDogJ3Nob3ctb3ZlcmxheXMnfTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblBheWxvYWQgPSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICAvLyBUaGUgY2FwdHVyZWQgZW50cnkncyBzdGFibGUgdWlkLiBUaGUgY29udGVudCBzY3JpcHQgbmVlZHMgdGhpcyBzb1xuICAvLyBpdHMgb24tcGFnZSBjb21tZW50IGJveCBjYW4gcm91dGUgdGhlIGNvbW1lbnQgdG8gdGhlICpzcGVjaWZpYypcbiAgLy8gY2FwdHVyZSByYXRoZXIgdGhhbiB0byBcImFueSBzZWxlY3RvciB0aGF0IG1hdGNoZXMuXCIgUHJldmVudHNcbiAgLy8gY3Jvc3MtY29udGFtaW5hdGlvbiB3aGVuIHR3byBjYXB0dXJlcyBzaGFyZSBhIHNlbGVjdG9yIGFjcm9zc1xuICAvLyBwYWdlcyBvciB0d28gc2libGluZyBlbGVtZW50cyBzaGFyZSBhIHRlc3RJZC5cbiAgdWlkPzogc3RyaW5nO1xuICBuPzogbnVtYmVyO1xuICBjYXB0dXJlZD86IGJvb2xlYW47XG4gIGZlZWRiYWNrPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQmcgPVxuICB8IHtraW5kOiAnY2FwdHVyZS1zY3JlZW5zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJzsgdXJsOiBzdHJpbmc7IG9wZW5JZk1pc3Npbmc/OiBib29sZWFufVxuICB8IHtraW5kOiAnbGlzdC1vcGVuLXRhYnMnfVxuICB8IHtraW5kOiAnc2hvdC1lbGVtZW50Jzsgc2VsZWN0b3I6IHN0cmluZzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LWdyb3VwJzsgc2VsZWN0b3JzOiBzdHJpbmdbXTsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgcGFkZGluZz86IG51bWJlcjsgdGFiSWQ/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdzaG90LXBhZ2UnOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFNhdmVSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aFxuICBhYnNQYXRoPzogc3RyaW5nOyAgLy8gT1MtYWJzb2x1dGUgcGF0aFxuICBjb3B5UGF0aD86IHN0cmluZzsgLy8gVUktZmFjaW5nIHBhdGhcbiAgdGVtcFBhdGg/OiBib29sZWFuO1xuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEJnUmVwbHkgPVxuICB8IHtkYXRhVXJsOiBzdHJpbmd9XG4gIHwge2ZvdW5kOiBib29sZWFuOyBvcGVuZWQ/OiBudW1iZXJ9XG4gIHwge3RhYnM6IEFycmF5PHtpZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ30+fVxuICB8IHtlcnJvcjogc3RyaW5nfVxuICB8IFNob3RSZXBseVxuICB8IFNhdmVSZXBseTtcblxuLy8g4pSA4pSA4pSAIEV4cG9ydCBzaGFwZXMgKHYyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIE1hbmlmZXN0IGxpbmUgZW1pdHRlZCBhcyB0aGUgdmVyeSBmaXJzdCBKU09OTCBsaW5lLiBDYXJyaWVzIHRoZSBtZXRhZGF0YVxuLy8gbmVjZXNzYXJ5IHRvIHJlc3luYyBhIGRvd25sb2FkZWQgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgKyB0b29saW5nLlxuZXhwb3J0IHR5cGUgRXhwb3J0TWFuaWZlc3QgPSB7XG4gIHY6IDI7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHRzOiBzdHJpbmc7ICAgICAgIC8vIElTTyBvZiB3aGVuIHRoZSBleHBvcnQgd2FzIGdlbmVyYXRlZFxuICBnZW5lcmF0ZWQ6IG51bWJlcjsgLy8gZXBvY2ggbXMgKG1pcnJvciBvZiB0cyBpbiBtYWNoaW5lLXJlYWRhYmxlIGZvcm0pXG4gIHRvb2w6ICdwaW5jaGdyYWInO1xuICB3b3Jrc3BhY2U6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgZm9ybWF0OiAnanNvbmwnIHwgJ21hcmtkb3duJyB8ICd0YXIuenN0JztcbiAgaG9zdHM6IHN0cmluZ1tdO1xuICAvLyBBbWJpZ3VvdXMgdG90YWxzLiBUaGUgcHJldmlvdXMgYHNlbGVjdG9ycyAvIGZlZWRiYWNrIC8gcGFnZXNgXG4gIC8vIHRyaXBsZSBkaWRuJ3Qgc2F5IHdoZXRoZXIgbmVzdGVkXG4gIC8vIGdyb3VwIG1lbWJlcnMgd2VyZSBjb3VudGVkLCB3aGV0aGVyIGZlZWRiYWNrLWJlYXJpbmcgcGFyZW50cyB3ZXJlXG4gIC8vIGEgc3Vic2V0LCBvciBob3cgc2NyZWVuc2hvdHMgd2VyZSB0YWxsaWVkLiBUaGUgZXhwYW5kZWQgc2hhcGVcbiAgLy8gYmVsb3cgbmFtZXMgZXZlcnkgY2F0ZWdvcnkgZXhwbGljaXRseSBzbyBhIGRvd25zdHJlYW0gYWdlbnQgY2FuXG4gIC8vIHRlbGwgZXhhY3RseSB3aGF0J3MgaW4gdGhlIGJ1bmRsZS5cbiAgY291bnRzOiB7XG4gICAgLy8gVG9wLWxldmVsIHNlbGVjdG9yIHJvd3MgaW4gdGhlIEpTT05MIHN0cmVhbSAoZXhjbHVkZXMgbmVzdGVkXG4gICAgLy8gZ3JvdXAgbWVtYmVycywgYnV0IHRoZSBgZ3JvdXBNZW1iZXJzYCBmaWVsZCBjb3VudHMgdGhvc2UpLlxuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGZlZWRiYWNrOiBudW1iZXI7XG4gICAgcGFnZXM6IG51bWJlcjtcbiAgICAvLyBOdW1iZXIgb2Ygc2VsZWN0b3Igcm93cyB0aGF0IGhhdmUgYXQgbGVhc3Qgb25lIGZlZWRiYWNrIGNoaWxkLlxuICAgIC8vIFVzZWZ1bCBmb3IgXCJzaG93IG1lIG9ubHkgdGhlIGl0ZW1zIHdpdGggY29tbWVudHNcIi5cbiAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3JzIHRoYXQgc2hpcCB1bmRlciBhIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgIGFycmF5XG4gICAgLy8gcmF0aGVyIHRoYW4gYXMgdGhlaXIgb3duIHRvcC1sZXZlbCByb3cuXG4gICAgZ3JvdXBNZW1iZXJzPzogbnVtYmVyO1xuICAgIC8vIFNjcmVlbnNob3QgaW52ZW50b3J5IChjb3VudGVkIGJ5IGZpbGUsIGRlZHVwZWQpLlxuICAgIHNjcmVlbnNob3RzRWxlbWVudD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c0dyb3VwPzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzUGFnZT86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvciByb3dzIHRoYXQgc2hvdWxkIGhhdmUgYW4gZWxlbWVudCBzY3JlZW5zaG90IGJ1dCBkb24ndFxuICAgIC8vIChwb3N0LWJ1Zy0jMiBmb3JjZWQgc2hvb3QgbWF5IHN0aWxsIGZhaWwpLiBSZXBhaXIgYWdlbnRzIGNhblxuICAgIC8vIHNraXAgdGhlc2Ugb3IgcmVxdWVzdCBhIHJlLWNhcHR1cmUuXG4gICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q/OiBudW1iZXI7XG4gICAgLy8gRmVlZGJhY2sgcm93cyB3aG9zZSBwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlIHRvIGFueSBzZWxlY3RvclxuICAgIC8vIGluIHRoaXMgYXJjaGl2ZS4gU2hvdWxkIGFsd2F5cyBiZSAwOyBub24temVybyBtZWFucyB0aGUgZXhwb3J0XG4gICAgLy8gZ290IHRydW5jYXRlZCBvciBhIHBhcmVudCB3YXMgZGVsZXRlZCBiZXR3ZWVuIGNhcHR1cmUgKyBlbWl0LlxuICAgIG9ycGhhbmVkRmVlZGJhY2s/OiBudW1iZXI7XG4gIH07XG4gIC8vIFJlc29sdXRpb24gcm9vdCBmb3IgZXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkwgc3RyZWFtLlxuICAvLyAgIOKAoiAnYXJjaGl2ZScgICDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBleHRyYWN0ZWQgYXJjaGl2ZSByb290XG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciB0YXIuenN0IGV4cG9ydHMpLlxuICAvLyAgIOKAoiAnd29ya3NwYWNlJyDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB3b3Jrc3BhY2UgZGlyIG9uIGRpc2ssXG4gIC8vICAgICAgICAgICAgICAgICAgIGkuZS4gYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2BcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHBsYWluIEpTT05MIGV4cG9ydHMpLlxuICAvLyBSZWNlaXZlcnMgcHJlcGVuZCB0aGUgYXBwcm9wcmlhdGUgcm9vdCB0byByZXNvbHZlIGFueSBwYXRoIGZpZWxkLlxuICBwYXRoUm9vdD86ICdhcmNoaXZlJyB8ICd3b3Jrc3BhY2UnO1xuICAvLyBJbmRpcmVjdGlvbiBwb2ludGVyIHRvIHRoZSBVSSBza2lsbCB0aGF0IGtub3dzIGhvdyB0byB0cmlhZ2UgdGhlc2VcbiAgLy8gY2FwdHVyZXMuIFdoZW4gYGlubGluZTogdHJ1ZWAsIHRoZSBza2lsbCBjb250ZW50IGxpdmVzIGF0XG4gIC8vIGBhcmNoaXZlUGF0aGAgaW5zaWRlIHRoZSB0YXIgKGRlZmF1bHQ6IGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgKS5cbiAgLy9cbiAgLy8gYGN1c3RvbWl6ZWRgIGFuZCBgdGVtcGxhdGVgIGFyZSBtdXR1YWxseS1leGNsdXNpdmUgY29uZmlkZW5jZSBmbGFnczpcbiAgLy8gICDigKIgY3VzdG9taXplZDogdHJ1ZSDihpIgdXNlciB1cGxvYWRlZCAvIHBhc3RlZCB0aGVpciBvd24gY29udGVudC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IHRoZSBmaWxlIGFzIGF1dGhvcml0YXRpdmUuXG4gIC8vICAg4oCiIHRlbXBsYXRlOiB0cnVlICAg4oaSIHVzZXIgaXMgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgZGVmYXVsdC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IGFzIGdlbmVyaWMgYm9pbGVycGxhdGU7IHZlcmlmeSBiZWZvcmVcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIGFwcGx5aW5nLlxuICAvLyAoVGhlIHByZXZpb3VzIGB0ZW1wbGF0ZWAgZmxhZyBhbG9uZSB3YXMgYW1iaWd1b3VzIGJlY2F1c2UgdGhlXG4gIC8vIGJ1bmRsZWQgbG9jYWwgdGVtcGxhdGUgc3RpbGwgbG9va3MgcHJvamVjdC1zcGVjaWZpYy4pXG4gIHNraWxsPzoge25hbWU6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFBvaW50ZXIgdG8gdGhlIHByb2plY3QncyBERVNJR04ubWQuIFNhbWUgcnVsZXM6IGBjdXN0b21pemVkOiB0cnVlYFxuICAvLyBtZWFucyB0aGUgdXNlciBzdXBwbGllZCB0aGlzIGNvbnRlbnQ7IGB0ZW1wbGF0ZTogdHJ1ZWAgbWVhbnMgaXQnc1xuICAvLyBQaW5jaEdyYWIncyBidW5kbGVkIGRlZmF1bHQuXG4gIGRlc2lnbj86IHtwYXRoPzogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFNlbGYtcm9hc3Qgc2VjdGlvbi4gVGhlIGV4cG9ydCBzdXJmYWNlcyBpdHMgb3duIGdhcHMgc28gYVxuICAvLyBkb3duc3RyZWFtIExMTSBkb2Vzbid0IGhhdmUgdG8gZGlzY292ZXJcbiAgLy8gdGhlbS4gRW1wdHkgYXJyYXkgPSBjbGVhbiBleHBvcnQuIEVhY2ggZGlhZ25vc3RpYyBoYXMgYSBzdGFibGVcbiAgLy8gYGNvZGVgIHNvIHJlY2VpdmVycyBjYW4gZGlzcGF0Y2ggb24gaXQgcHJvZ3JhbW1hdGljYWxseS5cbiAgZXhwb3J0RGlhZ25vc3RpY3M/OiBFeHBvcnREaWFnbm9zdGljW107XG4gIC8vIEFyY2hpdmUgaW50ZWdyaXR5LiBSZWNlaXZlcnMgY2FuIGRldGVjdCBwYXJ0aWFsIGV4dHJhY3Rpb24gL1xuICAvLyBjb3JydXB0aW9uIHdpdGggYSBzaW5nbGUgY2hlY2suXG4gIGFyY2hpdmVJbnRlZ3JpdHk/OiB7XG4gICAgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+O1xuICB9O1xuICAvLyBCdWlsZC9zb3VyY2UgaWRlbnRpdHkuIENhcHR1cmVkIGZyb20gYVxuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluIGRpcnR5OnRydWVcIj5gXG4gIC8vIHRhZyB0aGUgdXNlcidzIGFwcCBpbmplY3RzLCBwbHVzIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB0ZWxsIGlmIHRoZSBleHBvcnQgaXMgc3RhbGUgcmVsYXRpdmUgdG8gdGhlIHJlcG8uXG4gIC8vIE9taXR0ZWQgZW50aXJlbHkgd2hlbiBubyBidWlsZCBpbmZvIGlzIGF2YWlsYWJsZS5cbiAgYnVpbGQ/OiB7XG4gICAgZXh0ZW5zaW9uVmVyc2lvbj86IHN0cmluZztcbiAgICBjb21taXQ/OiBzdHJpbmc7XG4gICAgYnJhbmNoPzogc3RyaW5nO1xuICAgIGRpcnR5PzogYm9vbGVhbjtcbiAgICBkZXBsb3lCdWlsZD86IHN0cmluZztcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIEV4cG9ydERpYWdub3N0aWMgPSB7XG4gIHNldmVyaXR5OiAnZXJyb3InIHwgJ3dhcm4nIHwgJ2luZm8nO1xuICBjb2RlOiBzdHJpbmc7XG4gIGRldGFpbD86IHN0cmluZztcbiAgdWlkPzogc3RyaW5nO1xufTtcblxuLy8gRW52ZWxvcGUgbWFya2VyIHVzZWQgb24gZXZlcnkgUGluY2hHcmFiIG1lc3NhZ2UgKHNvIG90aGVyIGV4dGVuc2lvblxuLy8gbWVzc2FnZXMgdHJhdmVsaW5nIHRocm91Z2ggdGhlIHNhbWUgY2hhbm5lbCBhcmUgaWdub3JlZCkuIF9fbWlkIGlzIGFcbi8vIHBlci1kaXNwYXRjaCB1bmlxdWUgc3RhbXAgc28gcmVjZWl2ZXJzIGNhbiBkZWR1cGUgYSBtZXNzYWdlIHRoYXQgYXJyaXZlc1xuLy8gdGhyb3VnaCBtb3JlIHRoYW4gb25lIGNoYW5uZWwgKGUuZy4gcnVudGltZS5vbk1lc3NhZ2UgKyBhIHBvcnQgcmVsYXkpLlxuZXhwb3J0IHR5cGUgUGdFbnZlbG9wZTxUPiA9IFQgJiB7X19wZzogdHJ1ZTsgX19taWQ6IHN0cmluZ307XG5cbmV4cG9ydCB0eXBlIEFueU1lc3NhZ2UgPSBDc1RvUGFuZWwgfCBQYW5lbFRvQ3MgfCBQYW5lbFRvQmc7XG5cbmxldCBfbWlkQ291bnRlciA9IDA7XG5jb25zdCBuZXdNaWQgPSAoKTogc3RyaW5nID0+IHtcbiAgY29uc3QgcHJlZml4ID0gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7KCsrX21pZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICB0cnkge1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke0FycmF5LmZyb20oYnl0ZXMpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyl9YDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxufTtcblxuLy8gSGVscGVyOiBzdGFtcCBhIHBheWxvYWQgd2l0aCB0aGUgZW52ZWxvcGUgbWFya2VyICsgdW5pcXVlIG1lc3NhZ2UgaWQuXG5leHBvcnQgY29uc3QgcGcgPSA8VCBleHRlbmRzIHtraW5kOiBzdHJpbmd9PihwYXlsb2FkOiBUKTogUGdFbnZlbG9wZTxUPiA9PlxuICAoe19fcGc6IHRydWUsIF9fbWlkOiBuZXdNaWQoKSwgLi4ucGF5bG9hZH0pIGFzIFBnRW52ZWxvcGU8VD47XG4iLAogICAgIi8vIFN1YnNldCBvZiBsdWNpZGUuZGV2IGljb25zIGlubGluZWQgYXMgU1ZHIGlubmVyLW1hcmt1cC5cbi8vIEVhY2ggZW50cnkgaXMgdGhlIGJvZHkgb2YgPHN2ZyAuLi4gPiAuLi4gPC9zdmc+OyBzdmdTdHJpbmcoKSB3cmFwcyBpdC5cbi8vIFNpemVzIGRlZmF1bHQgdG8gMTY7IG92ZXJyaWRlIHdpdGggdGhlIHNpemUgYXJndW1lbnQuXG4vL1xuLy8gTUlUIOKAlCBodHRwczovL2dpdGh1Yi5jb20vbHVjaWRlLWljb25zL2x1Y2lkZVxuXG5jb25zdCBJQ09OUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2NoZXZyb24tcmlnaHQnOiAnPHBhdGggZD1cIm05IDE4IDYtNi02LTZcIi8+JyxcbiAgJ2NoZXZyb24tZG93bic6ICc8cGF0aCBkPVwibTYgOSA2IDYgNi02XCIvPicsXG4gIGNvcHk6ICc8cmVjdCB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB4PVwiOFwiIHk9XCI4XCIgcng9XCIyXCIgcnk9XCIyXCIvPjxwYXRoIGQ9XCJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyXCIvPicsXG4gIHBlbmNpbDogJzxwYXRoIGQ9XCJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3elwiLz48cGF0aCBkPVwibTE1IDUgNCA0XCIvPicsXG4gICd0cmFzaC0yJzogJzxwYXRoIGQ9XCJNMyA2aDE4XCIvPjxwYXRoIGQ9XCJNMTkgNnYxNGMwIDEtMSAyLTIgMkg3Yy0xIDAtMi0xLTItMlY2XCIvPjxwYXRoIGQ9XCJNOCA2VjRjMC0xIDEtMiAyLTJoNGMxIDAgMiAxIDIgMnYyXCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjEwXCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxNFwiIHgyPVwiMTRcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz4nLFxuICBwbHVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPjxwYXRoIGQ9XCJNMTIgNXYxNFwiLz4nLFxuICB4OiAnPHBhdGggZD1cIk0xOCA2IDYgMThcIi8+PHBhdGggZD1cIm02IDYgMTIgMTJcIi8+JyxcbiAgbWludXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+JyxcbiAgc2VhcmNoOiAnPGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI4XCIvPjxwYXRoIGQ9XCJtMjEgMjEtNC4zLTQuM1wiLz4nLFxuICBkb3dubG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiNyAxMCAxMiAxNSAxNyAxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMTVcIiB5Mj1cIjNcIi8+JyxcbiAgdXBsb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNyA4IDEyIDMgNyA4XCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIzXCIgeTI9XCIxNVwiLz4nLFxuICBnaXRodWI6ICc8cGF0aCBkPVwiTTE1IDIydi00YTQuOCA0LjggMCAwIDAtMS0zLjVjMyAwIDYtMiA2LTUuNS4wOC0xLjI1LS4yNy0yLjQ4LTEtMy41LjI4LTEuMTUuMjgtMi4zNSAwLTMuNSAwIDAtMSAwLTMgMS41LTIuNjQtLjUtNS4zNi0uNS04IDBDNiAyIDUgMiA1IDJjLS4zIDEuMTUtLjMgMi4zNSAwIDMuNUE1LjQgNS40IDAgMCAwIDQgOWMwIDMuNSAzIDUuNSA2IDUuNS0uMzkuNDktLjY4IDEuMDUtLjg1IDEuNjUtLjE3LjYtLjIyIDEuMjMtLjE1IDEuODV2NFwiLz48cGF0aCBkPVwiTTkgMThjLTQuNTEgMi01LTItNy0yXCIvPicsXG4gIHN0YXI6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIvPicsXG4gICdjaXJjbGUtZG90JzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBjcm9zc2hhaXI6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMjJcIiB4Mj1cIjE4XCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCI2XCIgeDI9XCIyXCIgeTE9XCIxMlwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjZcIiB5Mj1cIjJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjIyXCIgeTI9XCIxOFwiLz4nLFxuICB0YXJnZXQ6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNlwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjJcIi8+JyxcbiAgJ3BhbmVsLWxlZnQtY2xvc2UnOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiLz48cGF0aCBkPVwiTTkgM3YxOFwiLz48cGF0aCBkPVwibTE2IDE1LTMtMyAzLTNcIi8+JyxcbiAgJ2V4dGVybmFsLWxpbmsnOiAnPHBhdGggZD1cIk0xNSAzaDZ2NlwiLz48cGF0aCBkPVwiTTEwIDE0IDIxIDNcIi8+PHBhdGggZD1cIk0xOCAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmg2XCIvPicsXG4gICdtZXNzYWdlLXNxdWFyZS1wbHVzJzogJzxwYXRoIGQ9XCJNMjEgMTVhMiAyIDAgMCAxLTIgMkg3bC00IDRWNWEyIDIgMCAwIDEgMi0yaDE0YTIgMiAwIDAgMSAyIDJ6XCIvPjxsaW5lIHgxPVwiOVwiIHgyPVwiMTVcIiB5MT1cIjEwXCIgeTI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiN1wiIHkyPVwiMTNcIi8+JyxcbiAgJ2FsZXJ0LWNpcmNsZSc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI4XCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMi4wMVwiIHkxPVwiMTZcIiB5Mj1cIjE2XCIvPicsXG4gICdyZWZyZXNoLWN3JzogJzxwYXRoIGQ9XCJNMyAxMmE5IDkgMCAwIDEgMTUtNi43TDIxIDhcIi8+PHBhdGggZD1cIk0yMSAzdjVoLTVcIi8+PHBhdGggZD1cIk0yMSAxMmE5IDkgMCAwIDEtMTUgNi43TDMgMTZcIi8+PHBhdGggZD1cIk0zIDIxdi01aDVcIi8+JyxcbiAgJ2ZpbGUtdGV4dCc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjEzXCIgeTI9XCIxM1wiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxN1wiIHkyPVwiMTdcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiOFwiIHkxPVwiOVwiIHkyPVwiOVwiLz4nLFxuICAnZmlsZS1jb2RlJzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PHBhdGggZD1cIm0xMCAxMy0yIDIgMiAyXCIvPjxwYXRoIGQ9XCJtMTQgMTcgMi0yLTItMlwiLz4nLFxuICBpbWFnZTogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIiByeT1cIjJcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjlcIiByPVwiMlwiLz48cGF0aCBkPVwibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjFcIi8+JyxcbiAgLy8gU3R5bGlzZWQgXCJwaW5jaFwiIOKAlCB0d28gb3Bwb3NpbmcgY3VydmVzIG1lZXRpbmcgYXQgYSBjZW50ZXIgZG90LlxuICBwaW5jaDogJzxwYXRoIGQ9XCJNNSA1YzMgMiA1IDQgNyA3LTIgMy00IDUtNyA3XCIvPjxwYXRoIGQ9XCJNMTkgNWMtMyAyLTUgNC03IDcgMiAzIDQgNSA3IDdcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxLjVcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gICdzdGFyLWZpbGxlZCc6ICc8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICBwaW46ICc8cGF0aCBkPVwiTTEyIDE3djVcIi8+PHBhdGggZD1cIk05IDEwLjc2YTIgMiAwIDAgMS0xLjExIDEuNzlsLTEuNzguOUEyIDIgMCAwIDAgNSAxNS4yNFYxNmExIDEgMCAwIDAgMSAxaDEyYTEgMSAwIDAgMCAxLTF2LS43NmEyIDIgMCAwIDAtMS4xMS0xLjc5bC0xLjc4LS45QTIgMiAwIDAgMSAxNSAxMC43NlY3YTEgMSAwIDAgMSAxLTEgMiAyIDAgMCAwIDAtNEg4YTIgMiAwIDAgMCAwIDQgMSAxIDAgMCAxIDEgMXpcIi8+JyxcbiAgdW5kbzogJzxwYXRoIGQ9XCJNMyA3djZoNlwiLz48cGF0aCBkPVwiTTIxIDE3YTkgOSAwIDAgMC0xNS02LjdMMyAxM1wiLz4nLFxuICByZWRvOiAnPHBhdGggZD1cIk0yMSA3djZoLTZcIi8+PHBhdGggZD1cIk0zIDE3YTkgOSAwIDAgMSAxNS02LjdMMjEgMTNcIi8+JyxcbiAgZm9sZGVyOiAnPHBhdGggZD1cIk0yMCAyMGEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMmgtNy45M2EyIDIgMCAwIDEtMS42Ni0uOWwtLjgyLTEuMkEyIDIgMCAwIDAgNy45MyAzSDRhMiAyIDAgMCAwLTIgMnYxM2EyIDIgMCAwIDAgMiAyWlwiLz4nLFxuICBjaGVjazogJzxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiLz4nLFxuICAnY2lyY2xlLWNoZWNrJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIi8+JyxcbiAgZ3JpcDogJzxjaXJjbGUgY3g9XCI5XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCI1XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxOVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTlcIiByPVwiMVwiLz4nLFxuICBzZXR0aW5nczogJzxwYXRoIGQ9XCJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiLz4nLFxuICBpbmZvOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTEyIDE2di00XCIvPjxwYXRoIGQ9XCJNMTIgOGguMDFcIi8+JyxcbiAgLy8gVHJlZS1vZi1yb3dzIOKAlCB1c2VkIGZvciBcIlNwbGl0IGdyb3VwXCIgYWN0aW9uIChkZW5vdGVzIG9uZSBub2RlIGZhbm5pbmdcbiAgLy8gb3V0IGludG8gc2libGluZ3MpLiBMdWNpZGUncyBgbGlzdC10cmVlYC5cbiAgJ2xpc3QtdHJlZSc6ICc8cGF0aCBkPVwiTTIxIDEyaC04XCIvPjxwYXRoIGQ9XCJNMjEgNkg4XCIvPjxwYXRoIGQ9XCJNMjEgMThoLThcIi8+PHBhdGggZD1cIk0zIDZ2NGMwIDEuMS45IDIgMiAyaDNcIi8+PHBhdGggZD1cIk0zIDEwdjZjMCAxLjEuOSAyIDIgMmgzXCIvPicsXG4gIC8vIEdlbmVyaWMgc3BsaXQgaWNvbiBhcyBhIGZhbGxiYWNrIG9wdGlvbi5cbiAgc3BsaXQ6ICc8cGF0aCBkPVwiTTE2IDNoNXY1XCIvPjxwYXRoIGQ9XCJNOCAzSDN2NVwiLz48cGF0aCBkPVwibTIxIDMtNy40NiA3LjQ2YTIgMiAwIDAgMCAwIDIuODNMMjEgMjFcIi8+PHBhdGggZD1cIk0zIDNsNy40NiA3LjQ2YTIgMiAwIDAgMSAwIDIuODNMMyAyMVwiLz4nLFxuICAvLyBDYXJkYm9hcmQtc3R5bGUgYm94IHVzZWQgZm9yIFwiRXhwb3J0IHdvcmtzcGFjZSBhcyBaSVBcIi5cbiAgcGFja2FnZTogJzxwYXRoIGQ9XCJtNy41IDQuMjcgOSA1LjE1XCIvPjxwYXRoIGQ9XCJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaXCIvPjxwYXRoIGQ9XCJNMy4zIDcgMTIgMTJsOC43LTVcIi8+PHBhdGggZD1cIk0xMiAyMlYxMlwiLz4nLFxuICAvLyBUd28gaW50ZXJsb2NraW5nIGxpbmtzIOKAlCB1c2VkIGZvciBcIkNvcHkgYXMgcGF0aFwiLlxuICBsaW5rOiAnPHBhdGggZD1cIk0xMCAxM2E1IDUgMCAwIDAgNy41NC41NGwzLTNhNSA1IDAgMCAwLTcuMDctNy4wN2wtMS43MiAxLjcxXCIvPjxwYXRoIGQ9XCJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzFcIi8+JyxcbiAgLy8gRGF0YWJhc2UvZHVjayBpY29uIGZvciB0aGUgRHVja0RCIHBhbGV0dGUgY29tbWFuZC5cbiAgZGF0YWJhc2U6ICc8ZWxsaXBzZSBjeD1cIjEyXCIgY3k9XCI1XCIgcng9XCI5XCIgcnk9XCIzXCIvPjxwYXRoIGQ9XCJNMyA1VjE5QTkgMyAwIDAgMCAyMSAxOVY1XCIvPjxwYXRoIGQ9XCJNMyAxMkE5IDMgMCAwIDAgMjEgMTJcIi8+Jyxcbn07XG5cbmNvbnN0IHdyYXAgPSAoYm9keTogc3RyaW5nLCBzaXplOiBudW1iZXIpOiBzdHJpbmcgPT5cbiAgYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiJHtzaXplfVwiIGhlaWdodD1cIiR7c2l6ZX1cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+JHtib2R5fTwvc3ZnPmA7XG5cbmV4cG9ydCBjb25zdCBQR19JQ09OUyA9IHtcbiAgaGFzOiAobmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiBuYW1lIGluIElDT05TLFxuICBzdmdTdHJpbmc6IChuYW1lOiBzdHJpbmcsIHNpemUgPSAxNik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYm9keSA9IElDT05TW25hbWVdO1xuICAgIGlmICghYm9keSkge1xuICAgICAgY29uc29sZS53YXJuKCdbbHVjaWRlXSBtaXNzaW5nIGljb24nLCBuYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAoYm9keSwgc2l6ZSk7XG4gIH0sXG4gIG1vdW50OiAoZWw6IEVsZW1lbnQgfCBudWxsLCBuYW1lOiBzdHJpbmcsIHNpemU/OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoZWwpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgfSxcbn07XG5cbi8vIFNpZGUtZWZmZWN0IGZvciBsZWdhY3kgc2NyaXB0LXRhZyBpbmNsdXNpb24gKHNpZGVwYW5lbC5odG1sIHN0aWxsIDxzY3JpcHRcbi8vIHNyYz1cImx1Y2lkZS5qc1wiPiDigJQgcHJlLWJ1bmRsZSkuIFJlLWV4cG9zZXMgdGhlIHJlZ2lzdHJ5IG9uIGdsb2JhbFRoaXMuXG5pZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gIChnbG9iYWxUaGlzIGFzIGFueSkuUEdfSUNPTlMgPSBQR19JQ09OUztcbn1cbiIsCiAgICAiLy8gVVNUQVItZm9ybWF0IHRhciBlbmNvZGVyLiBFYWNoIGVudHJ5IGlzIGEgNTEyLWJ5dGUgaGVhZGVyIGZvbGxvd2VkIGJ5XG4vLyBjb250ZW50IGJ5dGVzIHBhZGRlZCB1cCB0byB0aGUgbmV4dCA1MTItYnl0ZSBib3VuZGFyeS4gVGhlIGFyY2hpdmUgZW5kc1xuLy8gd2l0aCB0d28gemVyby1maWxsZWQgNTEyLWJ5dGUgYmxvY2tzLiB+ODAgbGluZXMsIG5vIGRlcGVuZGVuY2llcy5cbi8vXG4vLyBXZSBwaWNrIHRhciAocmF0aGVyIHRoYW4gemlwKSBiZWNhdXNlIHpzdGQgaXMgdGhlIHdpcmUgZm9ybWF0IHdlIHdhbnQgdG9cbi8vIHBhaXIgaXQgd2l0aCBhbmQgdGFyLnpzdCBpcyB0aGUgc3RhbmRhcmQgY29tYm8gKHppcCBpcyBpdHMgb3duXG4vLyBjb21wcmVzc2lvbiBjb250YWluZXIpLiBGb3IgZmlsZXMgd2l0aCBwYXRocyBsb25nZXIgdGhhbiAxMDAgY2hhcnMgd2Vcbi8vIHRocm93IHJhdGhlciB0aGFuIGltcGxlbWVudCB0aGUgR05VL1BBWCBsb25nLW5hbWUgZXh0ZW5zaW9ucyDigJQgdGhlXG4vLyBQaW5jaEdyYWIgYXJjaGl2ZSBsYXlvdXQgdXNlcyBzaG9ydCBwYXRocyBvbmx5LlxuXG5jb25zdCBlbmMgPSBuZXcgVGV4dEVuY29kZXIoKTtcblxuY29uc3Qgd3JpdGVPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAvLyB0YXIgZmllbGRzIGFyZSB6ZXJvLXBhZGRlZCBudWxsLXRlcm1pbmF0ZWQgb2N0YWwgc3RyaW5ncy5cbiAgbGV0IHMgPSB2YWx1ZS50b1N0cmluZyg4KTtcbiAgcyA9IHMucGFkU3RhcnQobGVuZ3RoIC0gMSwgJzAnKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggLSAxOyBpKyspIGJ1ZltvZmZzZXQgKyBpXSA9IHMuY2hhckNvZGVBdChpKTtcbiAgYnVmW29mZnNldCArIGxlbmd0aCAtIDFdID0gMDtcbn07XG5cbmNvbnN0IHdyaXRlQXNjaWkgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgc3RyOiBzdHJpbmcsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIGNvbnN0IGJ5dGVzID0gZW5jLmVuY29kZShzdHIpO1xuICBjb25zdCBsZW4gPSBNYXRoLm1pbihieXRlcy5sZW5ndGgsIGxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVzW2ldITtcbn07XG5cbmNvbnN0IGhlYWRlckNoZWNrc3VtID0gKGhlYWRlcjogVWludDhBcnJheSk6IG51bWJlciA9PiB7XG4gIC8vIFRoZSBjaGVja3N1bSBmaWVsZCAoOCBieXRlcyBhdCBvZmZzZXQgMTQ4KSBpcyB0cmVhdGVkIGFzIEFTQ0lJIHNwYWNlc1xuICAvLyBkdXJpbmcgY29tcHV0YXRpb24sIHRoZW4gdGhlIGFjdHVhbCBjaGVja3N1bSBpcyB3cml0dGVuIGludG8gaXQuXG4gIGxldCBzdW0gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7XG4gICAgaWYgKGkgPj0gMTQ4ICYmIGkgPCAxNTYpIHN1bSArPSAweDIwO1xuICAgIGVsc2Ugc3VtICs9IGhlYWRlcltpXSA/PyAwO1xuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG5leHBvcnQgdHlwZSBUYXJFbnRyeSA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICBkYXRhOiBVaW50OEFycmF5IHwgc3RyaW5nO1xuICBtdGltZT86IG51bWJlcjsgLy8gdW5peCBlcG9jaCBzZWNvbmRzOyBkZWZhdWx0cyB0byBub3dcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZFRhciA9IChlbnRyaWVzOiBUYXJFbnRyeVtdKTogVWludDhBcnJheSA9PiB7XG4gIGNvbnN0IGJsb2NrczogVWludDhBcnJheVtdID0gW107XG4gIGNvbnN0IG5vd1NlYyA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCBkYXRhID0gdHlwZW9mIGVudHJ5LmRhdGEgPT09ICdzdHJpbmcnID8gZW5jLmVuY29kZShlbnRyeS5kYXRhKSA6IGVudHJ5LmRhdGE7XG4gICAgY29uc3QgbmFtZSA9IGVudHJ5Lm5hbWU7XG4gICAgaWYgKG5hbWUubGVuZ3RoID4gMTAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHRhcjogZmlsZW5hbWUgdG9vIGxvbmcgKCR7bmFtZS5sZW5ndGh9ID4gMTAwIGNoYXJzKTogJHtuYW1lfWApO1xuICAgIH1cbiAgICBjb25zdCBoZWFkZXIgPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAwLCBuYW1lLCAxMDApO1xuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMDAsIDBvNjQ0LCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW9kZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMDgsIDAsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdWlkXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDExNiwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnaWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTI0LCBkYXRhLmxlbmd0aCwgMTIpOyAgICAgICAgICAgICAgICAgIC8vIHNpemVcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTM2LCBlbnRyeS5tdGltZSA/PyBub3dTZWMsIDEyKTsgICAgICAgIC8vIG10aW1lXG4gICAgZm9yIChsZXQgaSA9IDE0ODsgaSA8IDE1NjsgaSsrKSBoZWFkZXJbaV0gPSAweDIwOyAgICAgICAgICAvLyBjaGVja3N1bSBwbGFjZWhvbGRlclxuICAgIGhlYWRlclsxNTZdID0gMHgzMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHlwZWZsYWcgJzAnID0gcmVndWxhciBmaWxlXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI1NywgJ3VzdGFyJywgNik7ICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWdpY1xuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAyNjMsICcwMCcsIDIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmVyc2lvblxuICAgIC8vIHVuYW1lL2duYW1lL2Rldm1ham9yL2Rldm1pbm9yL3ByZWZpeCBhbGwgbGVmdCB6ZXJvLlxuXG4gICAgY29uc3QgY2hlY2tzdW0gPSBoZWFkZXJDaGVja3N1bShoZWFkZXIpO1xuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxNDgsIGNoZWNrc3VtLCA4KTtcblxuICAgIGJsb2Nrcy5wdXNoKGhlYWRlcik7XG4gICAgYmxvY2tzLnB1c2goZGF0YSk7XG4gICAgY29uc3QgcGFkID0gKDUxMiAtIChkYXRhLmxlbmd0aCAlIDUxMikpICUgNTEyO1xuICAgIGlmIChwYWQpIGJsb2Nrcy5wdXNoKG5ldyBVaW50OEFycmF5KHBhZCkpO1xuICB9XG4gIC8vIFRyYWlsZXI6IHR3byBjb25zZWN1dGl2ZSA1MTItYnl0ZSB6ZXJvIGJsb2Nrcy5cbiAgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkoMTAyNCkpO1xuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHRvdGFsICs9IGIubGVuZ3RoO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheSh0b3RhbCk7XG4gIGxldCBvZmZzZXQgPSAwO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2Zmc2V0KTsgb2Zmc2V0ICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgWnN0ZCByYXctYmxvY2sgZnJhbWUgd3JpdGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy9cbi8vIENvbXByZXNzaW9uU3RyZWFtKCd6c3RkJykgaXNuJ3Qgc2hpcHBlZCBpbiBjdXJyZW50IENocm9taXVtICh2ZXJpZmllZCB2aWFcbi8vIHJ1bnRpbWUgcHJvYmUpLCBzbyB3ZSB3cml0ZSBhIHZhbGlkIHpzdGQgZnJhbWUgY29udGFpbmluZyBvbmUgb3IgbW9yZVxuLy8gcmF3ICh1bmNvbXByZXNzZWQpIGJsb2Nrcy4gVGhlIG91dHB1dCBpcyBzdHJ1Y3R1cmFsbHkgYSByZWFsIGAudGFyLnpzdGBcbi8vIGZpbGU6IGB6c3RkIC1kYCBhY2NlcHRzIGl0LCA3LVppcCBhY2NlcHRzIGl0LCBsaWJ6c3RkIGFjY2VwdHMgaXQuIEl0XG4vLyBqdXN0IGRvZXNuJ3QgYWN0dWFsbHkgY29tcHJlc3Mg4oCUIGZvciBvdXIgcGF5bG9hZCwgd2hpY2ggaXMgbW9zdGx5IFBOR1xuLy8gKGFscmVhZHkgY29tcHJlc3NlZCkgcGx1cyBhIGZldyBLQiBvZiBKU09OTC9NYXJrZG93biwgdGhlIGxvc3MgdnMuIHJlYWxcbi8vIERFRkxBVEUgaXMgc2luZ2xlLWRpZ2l0IHBlcmNlbnQuXG4vL1xuLy8gRnJhbWUgbGF5b3V0IChwZXIgUkZDIDg4NzggKyBac3RhbmRhcmQgZm9ybWF0IHNwZWMpOlxuLy8gICBtYWdpY19udW1iZXIgICAgICAgNCBieXRlcyAgMHgyOCAweEI1IDB4MkYgMHhGRCAoTEU6IDB4RkQyRkI1MjgpXG4vLyAgIEZIRCAgICAgICAgICAgICAgICAxIGJ5dGUgICBGQ1Nfc2l6ZT0yICg0LWJ5dGUgRkNTKSwgU2luZ2xlX1NlZ21lbnQ9MVxuLy8gICBGQ1MgICAgICAgICAgICAgICAgNCBieXRlcyAgdW5jb21wcmVzc2VkIHBheWxvYWQgc2l6ZSAodTMyIExFKVxuLy8gICBibG9ja3MgICAgICAgICAgICAgTiBibG9ja3MgZWFjaDogMy1ieXRlIGhlYWRlciArIHBheWxvYWRcbi8vXG4vLyBCbG9jayBoZWFkZXIgKDMgYnl0ZXMgTEUpOlxuLy8gICBiaXQgMCAgICAgICBMYXN0X0Jsb2NrIGZsYWdcbi8vICAgYml0cyAxLi4yICAgQmxvY2tfVHlwZSAoMDAgPSBSYXcsIDAxID0gUkxFLCAxMCA9IENvbXByZXNzZWQsIDExID0gUmVzZXJ2ZWQpXG4vLyAgIGJpdHMgMy4uMjMgIEJsb2NrX1NpemUgKG1heCAxMjggS2lCIGZvciByYXcgLyBSTEUpXG4vL1xuLy8gV2UgY2h1bmsgaW50byAxMjggS2lCIHJhdyBibG9ja3MgdG8gcmVzcGVjdCB0aGUgcGVyLWJsb2NrIHNpemUgbGltaXQuXG5cbmNvbnN0IFpTVERfUkFXX0JMT0NLX01BWCA9IDEyOCAqIDEwMjQ7XG5cbmV4cG9ydCBjb25zdCB3cmFwWnN0ZCA9IChkYXRhOiBVaW50OEFycmF5KTogVWludDhBcnJheSA9PiB7XG4gIGNvbnN0IGJsb2NrczogVWludDhBcnJheVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zIDwgZGF0YS5sZW5ndGggfHwgZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCByZW1haW5pbmcgPSBkYXRhLmxlbmd0aCAtIHBvcztcbiAgICBjb25zdCBibG9ja1NpemUgPSBNYXRoLm1pbihyZW1haW5pbmcsIFpTVERfUkFXX0JMT0NLX01BWCk7XG4gICAgY29uc3QgaXNMYXN0ID0gcG9zICsgYmxvY2tTaXplID49IGRhdGEubGVuZ3RoID8gMSA6IDA7XG4gICAgY29uc3QgaGVhZGVySW50ID0gaXNMYXN0IHwgKDAgPDwgMSkgfCAoYmxvY2tTaXplIDw8IDMpOyAvLyB0eXBlPXJhdz0wXG4gICAgY29uc3QgYmxvY2tIZWFkZXIgPSBuZXcgVWludDhBcnJheShbXG4gICAgICBoZWFkZXJJbnQgJiAweGZmLFxuICAgICAgKGhlYWRlckludCA+Pj4gOCkgJiAweGZmLFxuICAgICAgKGhlYWRlckludCA+Pj4gMTYpICYgMHhmZixcbiAgICBdKTtcbiAgICBibG9ja3MucHVzaChibG9ja0hlYWRlcik7XG4gICAgaWYgKGJsb2NrU2l6ZSA+IDApIGJsb2Nrcy5wdXNoKGRhdGEuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpKTtcbiAgICBwb3MgKz0gYmxvY2tTaXplO1xuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkgYnJlYWs7XG4gIH1cbiAgY29uc3QgZmNzID0gZGF0YS5sZW5ndGg7XG4gIGNvbnN0IGZoZCA9IDBiMTAxMF8wMDAwOyAvLyBGQ1Nfc2l6ZT0xMCAoNCBieXRlcykgfCBTaW5nbGVfU2VnbWVudD0xXG4gIGNvbnN0IGhlYWQgPSBuZXcgVWludDhBcnJheShbXG4gICAgMHgyOCwgMHhiNSwgMHgyZiwgMHhmZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWdpY1xuICAgIGZoZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRkhEXG4gICAgZmNzICYgMHhmZiwgKGZjcyA+Pj4gOCkgJiAweGZmLCAoZmNzID4+PiAxNikgJiAweGZmLCAoZmNzID4+PiAyNCkgJiAweGZmLFxuICBdKTtcbiAgbGV0IHRvdGFsID0gaGVhZC5sZW5ndGg7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHRvdGFsICs9IGIubGVuZ3RoO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheSh0b3RhbCk7XG4gIGxldCBvZmYgPSAwO1xuICBvdXQuc2V0KGhlYWQsIG9mZik7IG9mZiArPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgeyBvdXQuc2V0KGIsIG9mZik7IG9mZiArPSBiLmxlbmd0aDsgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gQ29tcGFuaW9uIGRlY29kZXIgZm9yIG91ciBvd24gd3JpdGVyIOKAlCB1c2VkIGJ5IHRlc3RzLiBBY2NlcHRzIGFueSB6c3RkXG4vLyBmcmFtZSB3cml0dGVuIGJ5IGB3cmFwWnN0ZGAgKHNpbmdsZSBSYXdfQmxvY2sgc3RyZWFtLCA0LWJ5dGUgRkNTLFxuLy8gc2luZ2xlLXNlZ21lbnQsIG5vIGNoZWNrc3VtLCBubyBkaWN0KS4gVGhyb3dzIG9uIGFueXRoaW5nIGVsc2Ugc28gdGVzdHNcbi8vIGZhaWwgbG91ZGx5IHJhdGhlciB0aGFuIHNpbGVudGx5IG1pcy1wYXJzZS5cbmV4cG9ydCBjb25zdCB1bndyYXBac3RkID0gKGZyYW1lOiBVaW50OEFycmF5KTogVWludDhBcnJheSA9PiB7XG4gIGlmIChmcmFtZS5sZW5ndGggPCA5KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGZyYW1lIHRvbyBzaG9ydCcpO1xuICBpZiAoZnJhbWVbMF0gIT09IDB4MjggfHwgZnJhbWVbMV0gIT09IDB4YjUgfHwgZnJhbWVbMl0gIT09IDB4MmYgfHwgZnJhbWVbM10gIT09IDB4ZmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGJhZCBtYWdpYyBudW1iZXInKTtcbiAgfVxuICBjb25zdCBmaGQgPSBmcmFtZVs0XSE7XG4gIGNvbnN0IGZjc1NpemVGbGFnID0gKGZoZCA+Pj4gNikgJiAwYjExO1xuICBjb25zdCBzaW5nbGVTZWdtZW50ID0gKChmaGQgPj4+IDUpICYgMSkgPT09IDE7XG4gIGNvbnN0IGNoZWNrc3VtID0gKChmaGQgPj4+IDIpICYgMSkgPT09IDE7XG4gIGNvbnN0IGRpY3RJZCA9IGZoZCAmIDBiMTE7XG4gIGlmICghc2luZ2xlU2VnbWVudCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBvbmx5IFNpbmdsZV9TZWdtZW50IGZyYW1lcyBzdXBwb3J0ZWQnKTtcbiAgaWYgKGNoZWNrc3VtKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGNvbnRlbnQgY2hlY2tzdW0gbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoZGljdElkKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGRpY3Rpb25hcmllcyBub3Qgc3VwcG9ydGVkJyk7XG4gIGxldCBwb3MgPSA1O1xuICBsZXQgZmNzID0gMDtcbiAgaWYgKGZjc1NpemVGbGFnID09PSAwYjAwKSB7IGZjcyA9IGZyYW1lW3Bvc10hOyBwb3MgKz0gMTsgfVxuICBlbHNlIGlmIChmY3NTaXplRmxhZyA9PT0gMGIwMSkgeyBmY3MgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCk7IGZjcyArPSAyNTY7IHBvcyArPSAyOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjEwKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KSB8IChmcmFtZVtwb3MgKyAyXSEgPDwgMTYpIHwgKGZyYW1lW3BvcyArIDNdISAqIDB4MTAwMDAwMCk7IHBvcyArPSA0OyB9XG4gIGVsc2UgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiA4LWJ5dGUgRkNTIHVuc3VwcG9ydGVkJyk7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KGZjcyk7XG4gIGxldCBvdXRQb3MgPSAwO1xuICBmb3IgKDs7KSB7XG4gICAgaWYgKHBvcyArIDMgPiBmcmFtZS5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignenN0ZDogdHJ1bmNhdGVkIGJsb2NrIGhlYWRlcicpO1xuICAgIGNvbnN0IGhlYWRlckludCA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KSB8IChmcmFtZVtwb3MgKyAyXSEgPDwgMTYpO1xuICAgIHBvcyArPSAzO1xuICAgIGNvbnN0IGlzTGFzdCA9IChoZWFkZXJJbnQgJiAxKSA9PT0gMTtcbiAgICBjb25zdCBibG9ja1R5cGUgPSAoaGVhZGVySW50ID4+PiAxKSAmIDBiMTE7XG4gICAgY29uc3QgYmxvY2tTaXplID0gKGhlYWRlckludCA+Pj4gMykgJiAweDFmX2ZmX2ZmO1xuICAgIGlmIChibG9ja1R5cGUgIT09IDApIHRocm93IG5ldyBFcnJvcihgenN0ZDogb25seSBSYXdfQmxvY2sgKDApIHN1cHBvcnRlZCwgZ290ICR7YmxvY2tUeXBlfWApO1xuICAgIGlmIChwb3MgKyBibG9ja1NpemUgPiBmcmFtZS5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignenN0ZDogdHJ1bmNhdGVkIGJsb2NrIHBheWxvYWQnKTtcbiAgICBvdXQuc2V0KGZyYW1lLnN1YmFycmF5KHBvcywgcG9zICsgYmxvY2tTaXplKSwgb3V0UG9zKTtcbiAgICBvdXRQb3MgKz0gYmxvY2tTaXplO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGlzTGFzdCkgYnJlYWs7XG4gIH1cbiAgaWYgKG91dFBvcyAhPT0gZmNzKSB0aHJvdyBuZXcgRXJyb3IoYHpzdGQ6IEZDUyBtaXNtYXRjaCAoZ290ICR7b3V0UG9zfSwgZXhwZWN0ZWQgJHtmY3N9KWApO1xuICByZXR1cm4gb3V0O1xufTtcblxuLy8g4pSA4pSA4pSAIFRhciBsaXN0aW5nIGRlY29kZXIgKHRlc3Qtb25seSkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBXYWxrcyBhIHRhciBieXRlIGJ1ZmZlciwgcmV0dXJuaW5nIHtuYW1lLCBkYXRhfSBmb3IgZWFjaCBlbnRyeS4gU3RvcHMgYXRcbi8vIHRoZSB0cmFpbGVyICh0d28gemVybyBibG9ja3MpLiBPbmx5IHJlYWRzIHRoZSBmaWVsZHMgUGluY2hHcmFiIHdyaXRlcy5cblxuZXhwb3J0IHR5cGUgUGFyc2VkVGFyRW50cnkgPSB7bmFtZTogc3RyaW5nOyBkYXRhOiBVaW50OEFycmF5OyBzaXplOiBudW1iZXJ9O1xuXG5jb25zdCBkZWMgPSBuZXcgVGV4dERlY29kZXIoKTtcblxuY29uc3QgcmVhZE51bGxTdHIgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICBsZXQgZW5kID0gb2Zmc2V0ICsgbGVuZ3RoO1xuICBmb3IgKGxldCBpID0gb2Zmc2V0OyBpIDwgb2Zmc2V0ICsgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldID09PSAwKSB7IGVuZCA9IGk7IGJyZWFrOyB9XG4gIH1cbiAgcmV0dXJuIGRlYy5kZWNvZGUoYnVmLnN1YmFycmF5KG9mZnNldCwgZW5kKSk7XG59O1xuXG5jb25zdCByZWFkT2N0YWwgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICBjb25zdCBzID0gcmVhZE51bGxTdHIoYnVmLCBvZmZzZXQsIGxlbmd0aCkudHJpbSgpO1xuICByZXR1cm4gcyA/IHBhcnNlSW50KHMsIDgpIDogMDtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVRhciA9IChidWY6IFVpbnQ4QXJyYXkpOiBQYXJzZWRUYXJFbnRyeVtdID0+IHtcbiAgY29uc3QgZW50cmllczogUGFyc2VkVGFyRW50cnlbXSA9IFtdO1xuICBsZXQgcG9zID0gMDtcbiAgd2hpbGUgKHBvcyArIDUxMiA8PSBidWYubGVuZ3RoKSB7XG4gICAgY29uc3QgaGVhZGVyID0gYnVmLnN1YmFycmF5KHBvcywgcG9zICsgNTEyKTtcbiAgICBsZXQgYWxsWmVybyA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MTI7IGkrKykgeyBpZiAoaGVhZGVyW2ldICE9PSAwKSB7IGFsbFplcm8gPSBmYWxzZTsgYnJlYWs7IH0gfVxuICAgIGlmIChhbGxaZXJvKSBicmVhazsgLy8gdHJhaWxlclxuICAgIGNvbnN0IG5hbWUgPSByZWFkTnVsbFN0cihoZWFkZXIsIDAsIDEwMCk7XG4gICAgY29uc3Qgc2l6ZSA9IHJlYWRPY3RhbChoZWFkZXIsIDEyNCwgMTIpO1xuICAgIHBvcyArPSA1MTI7XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWUsIHNpemUsIGRhdGE6IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIHNpemUpfSk7XG4gICAgICBwb3MgKz0gc2l6ZTtcbiAgICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoc2l6ZSAlIDUxMikpICUgNTEyO1xuICAgICAgcG9zICs9IHBhZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVudHJpZXM7XG59O1xuIiwKICAgICIvLyBBdXRvLWdlbmVyYXRlZCBieSBzY3JpcHRzL2J1aWxkLWV4dGVuc2lvbi50cyDigJQgZG8gbm90IGVkaXQuXG4vLyBUZWxscyB0aGUgc2lkZXBhbmVsIHdoaWNoIHRlbXBsYXRlIHJlc291cmNlcyBleGlzdCBpbiB0aGlzIGJ1aWxkLlxuLy8gQWN0dWFsIGNvbnRlbnQgbGl2ZXMgYXMgLm1kIGZpbGVzIHVuZGVyIGV4dGVuc2lvbi90ZW1wbGF0ZXMvLCBsb2FkZWRcbi8vIGxhemlseSB2aWEgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMIOKAlCBzZWUgbG9hZFRlbXBsYXRlKCkgaW4gc2lkZXBhbmVsLnRzLlxuZXhwb3J0IGNvbnN0IFRFTVBMQVRFU19QUkVTRU5UID0ge1wiZGVzaWduVGVtcGxhdGVcIjp0cnVlLFwic2tpbGxUZW1wbGF0ZVwiOnRydWUsXCJsb2NhbERlc2lnblwiOnRydWUsXCJsb2NhbFNraWxsXCI6dHJ1ZX0gYXMgY29uc3Q7XG4iLAogICAgIi8vIFBpbmNoR3JhYiBzaWRlLXBhbmVsIFVJLiBSZWNlaXZlcyBjYXB0dXJlcyArIGhvdmVycyBmcm9tIHRoZSBjb250ZW50XG4vLyBzY3JpcHQ7IHJlbmRlcnMgdGhlIGNoYXQtYnViYmxlIHRpbWVsaW5lLCBleHBvcnRzLCB2YWxpZGF0ZXMsIGV0Yy5cbi8vXG4vLyBEZWNvbXBvc2VkIGludG8gc21hbGwgZmlsZXMgZm9yIGNsYXJpdHk6XG4vLyAgIOKAoiB0eXBlcy50cyAgICAgIOKAlCBzaGFyZWQgdHlwZXMsIG1lc3NhZ2UgcHJvdG9jb2xcbi8vICAg4oCiIGx1Y2lkZS50cyAgICAg4oCUIGljb24gcmVnaXN0cnlcbi8vICAg4oCiIHRoaXMgZmlsZSAgICAg4oCUIHdpcmUtdXAgLyByZW5kZXJpbmcgLyBleHBvcnQgYnVpbGRlcnNcbi8vXG4vLyBMb2FkZWQgYXMgdGhlIHNpZGUgcGFuZWwgcGFnZTogY2hyb21lLnNpZGVQYW5lbCBkZWZhdWx0X3BhdGguXG5cbmltcG9ydCB0eXBlIHtcbiAgQW5ub3RhdGlvblBheWxvYWQsIENzVG9QYW5lbCwgRW50cnksIEV4cG9ydERpYWdub3N0aWMsIEV4cG9ydE1hbmlmZXN0LCBGZWVkYmFja01lc3NhZ2UsIFBhZ2VNZXNzYWdlLFxuICBQYW5lbE1lc3NhZ2UsIFBhbmVsVG9CZywgUGFuZWxUb0NzLCBQZ0VudmVsb3BlLCBTYXZlUmVwbHksIFNlbGVjdG9yTWVzc2FnZSwgU2hvdFJlcGx5LCBWaWV3cG9ydCxcbn0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge3BnfSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7UEdfSUNPTlN9IGZyb20gJy4vbHVjaWRlLnRzJztcbmltcG9ydCB7YnVpbGRUYXIsIHdyYXBac3RkLCB0eXBlIFRhckVudHJ5fSBmcm9tICcuL3Rhci50cyc7XG5pbXBvcnQge1RFTVBMQVRFU19QUkVTRU5UfSBmcm9tICcuL3RlbXBsYXRlcy5nZW4udHMnO1xuXG4oKCkgPT4ge1xuICBjb25zdCBMT0cgPSAnW1BpbmNoR3JhYi9zcF0nO1xuICBjb25zdCBQUkVGU19TVE9SQUdFX05BTUUgPSAncGluY2hncmFiLnByZWZzLnYyJztcbiAgY29uc3QgV09SS1NQQUNFU19LRVkgPSAncGluY2hncmFiLndvcmtzcGFjZXMudjEnO1xuICBjb25zdCBpbkV4dGVuc2lvbiA9IHR5cGVvZiBjaHJvbWUgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4oY2hyb21lLnJ1bnRpbWU/LmlkKTtcblxuICAvLyDilIDilIDilIAgVGVtcGxhdGUgcmVzb3VyY2UgbG9hZGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBFYXJsaWVyIHRoZSB0ZW1wbGF0ZXMgd2VyZSBiYWtlZCBhcyBzdHJpbmcgY29uc3RhbnRzIGludG8gdGhpcyBJSUZFXG4gIC8vICh+MzYwS0IgYWNyb3NzIERFU0lHTiArIFNLSUxMKS4gVGhhdCBibG9hdGVkIHRoZSBzaWRlcGFuZWwgYnVuZGxlIHRvXG4gIC8vIH4xLjk1TUIgYW5kIHNsb3dlZCBmaXJzdC1vcGVuIHBhcnNlIHRpbWUgbm90aWNlYWJseS4gVGhleSBub3cgc2hpcCBhc1xuICAvLyBzZXBhcmF0ZSBgLm1kYCBmaWxlcyB1bmRlciBgZXh0ZW5zaW9uL3RlbXBsYXRlcy9gIGFuZCBsb2FkIG9uIGRlbWFuZFxuICAvLyB2aWEgZmV0Y2gg4oCUIHdoZW4gdGhlIHVzZXIgb3BlbnMgdGhlIGVkaXRvciBtb2RhbCwgb3Igd2hlbiB0aGUgZXhwb3J0XG4gIC8vIHBpcGVsaW5lIG5lZWRzIHRvIGJ1bmRsZSBhIGZhbGxiYWNrLlxuICAvL1xuICAvLyBDYWNoZSByZXN1bHRzIGluLXByb2Nlc3Mgc28gcmVwZWF0IHJlYWRzIChtb2RhbCBvcGVuIOKGkiBjbG9zZSDihpIgcmVvcGVuLFxuICAvLyBvciBzZXF1ZW50aWFsIGV4cG9ydHMpIGRvbid0IHJlLWZldGNoLlxuICBjb25zdCB0ZW1wbGF0ZUNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgVEVNUExBVEVfRklMRVMgPSB7XG4gICAgZGVzaWduVGVtcGxhdGU6ICdERVNJR04udGVtcGxhdGUubWQnLFxuICAgIHNraWxsVGVtcGxhdGU6ICdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLFxuICAgIGxvY2FsRGVzaWduOiAnbG9jYWwuREVTSUdOLm1kJyxcbiAgICBsb2NhbFNraWxsOiAnbG9jYWwuU0tJTEwubWQnLFxuICB9IGFzIGNvbnN0O1xuICB0eXBlIFRlbXBsYXRlS2V5ID0ga2V5b2YgdHlwZW9mIFRFTVBMQVRFX0ZJTEVTO1xuICBjb25zdCB0ZW1wbGF0ZVVybCA9IChmaWxlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIC8vIEluc2lkZSB0aGUgZXh0ZW5zaW9uLCB0aGUgc2lkZXBhbmVsIHJ1bnMgZnJvbVxuICAgIC8vIGNocm9tZS1leHRlbnNpb246Ly88aWQ+L3NpZGVwYW5lbC5odG1sLCBzbyByZXNvdXJjZXMgcmVzb2x2ZSB2aWFcbiAgICAvLyBjaHJvbWUucnVudGltZS5nZXRVUkwuIFRoZSBQbGF5d3JpZ2h0IHN0YXRpYy1zZXJ2ZXIgdGVzdHMgc2VydmVcbiAgICAvLyBgL3RlbXBsYXRlcy88ZmlsZT5gIGZyb20gdGhlIGV4dGVuc2lvbiByb290IGRpcmVjdGx5LCBzbyBhXG4gICAgLy8gcmVsYXRpdmUgVVJMIHdvcmtzIHRoZXJlIGFzIGEgZmFsbGJhY2suXG4gICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRVUkwpIHtcbiAgICAgIHJldHVybiBjaHJvbWUucnVudGltZS5nZXRVUkwoYHRlbXBsYXRlcy8ke2ZpbGV9YCk7XG4gICAgfVxuICAgIHJldHVybiBgdGVtcGxhdGVzLyR7ZmlsZX1gO1xuICB9O1xuICBjb25zdCBsb2FkVGVtcGxhdGUgPSBhc3luYyAoa2V5OiBUZW1wbGF0ZUtleSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKCFURU1QTEFURVNfUFJFU0VOVFtrZXldKSByZXR1cm4gJyc7XG4gICAgY29uc3QgZmlsZSA9IFRFTVBMQVRFX0ZJTEVTW2tleV07XG4gICAgY29uc3QgY2FjaGVkID0gdGVtcGxhdGVDYWNoZS5nZXQoZmlsZSk7XG4gICAgaWYgKGNhY2hlZCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gY2FjaGVkO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh0ZW1wbGF0ZVVybChmaWxlKSk7XG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKGBzdGF0dXMgJHtyZXMuc3RhdHVzfWApO1xuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlcy50ZXh0KCk7XG4gICAgICB0ZW1wbGF0ZUNhY2hlLnNldChmaWxlLCB0ZXh0KTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgYHRlbXBsYXRlIGZldGNoIGZhaWxlZDogJHtmaWxlfWAsIGVycik7XG4gICAgICB0ZW1wbGF0ZUNhY2hlLnNldChmaWxlLCAnJyk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9O1xuICAvLyBFZmZlY3RpdmUgY29udGVudCB1c2VkIGJ5IHRoZSBleHBvcnQgcGlwZWxpbmUgYW5kIHRoZSBtb2RhbC4gV2hlbiB0aGVcbiAgLy8gdXNlciBoYXMgY3VzdG9taXplZCB2aWEgdGhlIHRleHRhcmVhL3VwbG9hZCwgdGhhdCB3aW5zOyBvdGhlcndpc2Ugd2VcbiAgLy8gZmFsbCBiYWNrIHRvIGxvY2FsLiogKHRoZSBkZXZlbG9wZXIncyBwcmUtYmFrZWQgb3ZlcnJpZGUpIHRoZW4gdG9cbiAgLy8gdGhlIGdlbmVyaWMgdGVtcGxhdGUuXG4gIGNvbnN0IHJlc29sdmVEZXNpZ25Db250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLmRlc2lnbk1kICYmIHByZWZzLmRlc2lnbk1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLmRlc2lnbk1kO1xuICAgIHJldHVybiAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbERlc2lnbicpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdkZXNpZ25UZW1wbGF0ZScpKTtcbiAgfTtcbiAgY29uc3QgcmVzb2x2ZVNraWxsQ29udGVudCA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmIChwcmVmcy5za2lsbE1kICYmIHByZWZzLnNraWxsTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuc2tpbGxNZDtcbiAgICByZXR1cm4gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxTa2lsbCcpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJykpO1xuICB9O1xuICAvLyBUcnVlIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oaSIHByZWZzLntkZXNpZ25NZHxza2lsbE1kfSBpc1xuICAvLyBlbXB0eSBhbmQgd2UncmUgZmFsbGluZyBiYWNrIHRvIGEgYnVuZGxlZCB0ZW1wbGF0ZS9sb2NhbCByZXNvdXJjZS5cbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlRGVzaWduID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLmRlc2lnbk1kIHx8ICFwcmVmcy5kZXNpZ25NZC50cmltKCk7XG4gIGNvbnN0IGlzVXNpbmdUZW1wbGF0ZVNraWxsID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLnNraWxsTWQgfHwgIXByZWZzLnNraWxsTWQudHJpbSgpO1xuXG4gIC8vIOKUgOKUgOKUgCBTdG9yYWdlIGFkYXB0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IFN0b3JlID0ge1xuICAgIGFzeW5jIGdldDxUPihrZXk6IHN0cmluZywgZmFsbGJhY2s6IFQpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgY29uc3QgbyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXkpOyByZXR1cm4gKG9ba2V5XSBhcyBUKSA/PyBmYWxsYmFjazsgfVxuICAgICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgICAgfVxuICAgICAgdHJ5IHsgY29uc3QgciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7IHJldHVybiByID09PSBudWxsID8gZmFsbGJhY2sgOiAoSlNPTi5wYXJzZShyKSBhcyBUKTsgfVxuICAgICAgY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbiAgICB9LFxuICAgIGFzeW5jIHNldChrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtba2V5XTogdmFsdWV9KTsgcmV0dXJuOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIH1cbiAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSxcbiAgfTtcblxuICAvLyDilIDilIDilIAgRE9NIHJlZnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0ICQgPSA8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oczogc3RyaW5nKTogVCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHMpIGFzIFQ7XG4gIGNvbnN0IGxpc3QgPSAkKCdbZGF0YS1saXN0XScpO1xuICBjb25zdCBjb21wb3NlciA9ICQ8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLWNvbXBvc2VyXScpO1xuICBjb25zdCBzdGF0dXMgPSAkKCdbZGF0YS1zdGF0dXNdJyk7XG4gIGNvbnN0IHNlYXJjaCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNlYXJjaF0nKTtcbiAgLy8gVXBkYXRlIHRoZSBvdmVybGFpZCBrYmQgcGlsbCB0byB1c2UgdGhlIHJpZ2h0IG1vZGlmaWVyIHBlciBwbGF0Zm9ybS5cbiAgY29uc3QgaXNNYWMgPSAvTWFjfGlQaG9uZXxpUGFkL2kudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0gfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJyk7XG4gIGlmICghaXNNYWMpIHtcbiAgICBjb25zdCBrYmRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zZWFyY2gta2JkXSBrYmQnKTtcbiAgICBpZiAoa2JkRWwpIGtiZEVsLnRleHRDb250ZW50ID0gJ0N0cmwrSyc7XG4gIH1cbiAgY29uc3QgaW1wb3J0RmlsZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJyNpbXBvcnQtZmlsZScpO1xuICBjb25zdCBzdGF0c0VsID0gJCgnW2RhdGEtc3RhdHNdJyk7XG4gIGNvbnN0IHN0YXJzRWwgPSAkKCdbZGF0YS1zdGFyc10nKTtcbiAgY29uc3QgdG9vbHRpcEVsID0gJCgnW2RhdGEtdG9vbHRpcF0nKTtcbiAgY29uc3QgZHJpbGxkb3duRWwgPSAkKCdbZGF0YS1kcmlsbGRvd25dJyk7XG4gIGNvbnN0IGRyYXdlciA9ICQoJ1tkYXRhLWRyYXdlcl0nKTtcbiAgY29uc3QgcGFsZXR0ZSA9ICQoJ1tkYXRhLXBhbGV0dGVdJyk7XG4gIGNvbnN0IHBhbGV0dGVJbnB1dCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXBhbGV0dGUtaW5wdXRdJyk7XG4gIGNvbnN0IHBhbGV0dGVMaXN0ID0gJCgnW2RhdGEtcGFsZXR0ZS1saXN0XScpO1xuICBjb25zdCBjb21wV29yZHMgPSAkKCdbZGF0YS1jb21wLXdvcmRzXScpO1xuICBjb25zdCBjb21wVG9rZW5zID0gJCgnW2RhdGEtY29tcC10b2tlbnNdJyk7XG4gIGNvbnN0IHN0YXRUb2tlbnMgPSAkKCdbZGF0YS1zdGF0LXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFdvcmRzID0gJCgnW2RhdGEtc3RhdC13b3Jkc10nKTtcbiAgY29uc3Qgd3NTZWxlY3QgPSAkPEhUTUxTZWxlY3RFbGVtZW50PignW2RhdGEtd29ya3NwYWNlXScpO1xuICBjb25zdCB3c0xpc3QgPSAkKCdbZGF0YS13cy1saXN0XScpO1xuICBjb25zdCB3c05hbWUgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS13cy1uYW1lXScpO1xuXG4gIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdDogUGFyZW50Tm9kZSA9IGRvY3VtZW50KTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBlbCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1pY29uXScpKSB7XG4gICAgICBjb25zdCBuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWljb24nKTtcbiAgICAgIGNvbnN0IHNpemUgPSBOdW1iZXIoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNpemUnKSA/PyAxNik7XG4gICAgICBpZiAobmFtZSAmJiBQR19JQ09OUy5oYXMobmFtZSkpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgICB9XG4gIH07XG4gIG1vdW50SWNvbnMoKTtcblxuICAvLyDilIDilIDilIAgU3RhdGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgUHJlZnMgPSB7XG4gICAgaW5jbHVkZU91dGVySFRNTDogYm9vbGVhbjtcbiAgICBpbmNsdWRlTWF0Y2hlZFJ1bGVzOiBib29sZWFuO1xuICAgIGluY2x1ZGVTdHlsZXM6IGJvb2xlYW47XG4gICAgbWluaWZ5OiBib29sZWFuO1xuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IGJvb2xlYW47XG4gICAgdXNlU2NyZWVuc2hvdHM6IGJvb2xlYW47XG4gICAgc3BhY2luZ092ZXJsYXk6IGJvb2xlYW47XG4gICAgaG92ZXJTbmFwOiBib29sZWFuO1xuICAgIGF1dG9TY3JlZW5zaG90OiBib29sZWFuO1xuICAgIC8vIENvbW1hLXNlcGFyYXRlZCBob3N0IHBhdHRlcm5zIChzdWJzdHJpbmcgbWF0Y2gpLiBIb3N0cyBpbiB0aGlzIGxpc3RcbiAgICAvLyBza2lwIHRoZSBlbnRpcmUgc2NyZWVuc2hvdCBwaXBlbGluZSDigJQgdXNlZnVsIGZvciBzZW5zaXRpdmUgcGFnZXNcbiAgICAvLyAoYmFua2luZywgaW50ZXJuYWwgYWRtaW4pIHdoZXJlIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCBQTkdzIGxhbmRpbmdcbiAgICAvLyBvbiBkaXNrLlxuICAgIHNraXBTY3JlZW5zaG90SG9zdHM6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgREVTSUdOLm1kIGNvbnRlbnQgdGhlIHVzZXIgcGFzdGVkIG9yIHVwbG9hZGVkIHZpYSB0aGUgc2lkZVxuICAgIC8vIHBhbmVsIHNldHRpbmdzLiBEZWZhdWx0cyB0byBhIHRlbXBsYXRlZCBwbGFjZWhvbGRlciBzbyBvdXQtb2YtdGhlLVxuICAgIC8vIGJveCBleHBvcnRzIGFsd2F5cyBpbmNsdWRlIGEgREVTSUdOLm1kIOKAlCB0aGUgY29uc3VtZXIgTExNIGNhblxuICAgIC8vIGVpdGhlciB3b3JrIGZyb20gdGhlIHBsYWNlaG9sZGVyIChhbmQgYXNrIGZvciB0aGUgcmVhbCBvbmUpIG9yXG4gICAgLy8gZnJvbSBhIHVzZXItY3VzdG9taXplZCBjb3B5LiBUaGUgc2V0dGluZ3MgVUkgZmxhZ3MgdGhpcyBiYW5uZXItXG4gICAgLy8gc3R5bGUgd2hlbiB0aGUgdmFsdWUgc3RpbGwgbWF0Y2hlcyB0aGUgdGVtcGxhdGUgc28gdGhlIHVzZXJcbiAgICAvLyBrbm93cyB0byBmaWxsIGl0IGluLlxuICAgIGRlc2lnbk1kOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCB0aGUgcmVjZWl2ZXIgc2hvdWxkIHJlYWQgREVTSUdOLm1kIGZyb20uIERlZmF1bHRzXG4gICAgLy8gdG8gYH4vLmFnZW50cy9ERVNJR04ubWRgOyB1c2VyIGNhbiBvdmVycmlkZSBwZXItbWFjaGluZS5cbiAgICBkZXNpZ25QYXRoOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCBvZiB0aGUgUGluY2hHcmFiIFVJIHNraWxsIG9uIHRoZSByZWNlaXZlcidzXG4gICAgLy8gZmlsZXN5c3RlbS4gVGhlIHNraWxsIGNvbnRlbnQgaXRzZWxmIGlzIGJ1bmRsZWQgaW5saW5lIGludG8gdGhlXG4gICAgLy8gYXJjaGl2ZSAoc2VlIGBza2lsbE1kYCksIHNvIHRoaXMgaXMgYSBoaW50IGZvciByZWNlaXZlcnMgdGhhdFxuICAgIC8vIHdhbnQgdG8gcGVyc2lzdCB0aGUgc2tpbGwgYXQgYSBjYW5vbmljYWwgbG9jYXRpb24uXG4gICAgc2tpbGxQYXRoOiBzdHJpbmc7XG4gICAgLy8gSW5saW5lIFVJLXNraWxsIGNvbnRlbnQuIERlZmF1bHQgaXMgdGhlIGJ1bmRsZWQgUGluY2hHcmFiIHRyaWFnZVxuICAgIC8vIHNraWxsIHRlbXBsYXRlOyB1c2VyIGNhbiBjdXN0b21pemUgdmlhIHNldHRpbmdzIHBhc3RlL3VwbG9hZC5cbiAgICAvLyBCdW5kbGVkIGludG8gdGhlIGFyY2hpdmUgYXQgYC4vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYC5cbiAgICBza2lsbE1kOiBzdHJpbmc7XG4gICAgLy8gV2hlbiB0cnVlLCBmaXJlIGEgZnJlc2ggcGFnZSBzY3JlZW5zaG90IG9uIEVWRVJZIGNhcHR1cmUgcmF0aGVyXG4gICAgLy8gdGhhbiBvbmNlIHBlciAod29ya3NwYWNlLCB1cmwpIHR1cGxlLiBVc2VmdWwgZm9yIGNhcHR1cmluZyBhXG4gICAgLy8gbXVsdGktc3RlcCBmbG93IHdoZXJlIHRoZSBwYWdlIHN0YXRlIGNoYW5nZXMgYmV0d2VlbiBjYXB0dXJlcy5cbiAgICAvLyBEZWZhdWx0IGZhbHNlIOKAlCBtb3N0IHVzZXJzIHdhbnQgdGhlIGRlZmF1bHQgZmlyc3Qtb25seSBiZWhhdmlvclxuICAgIC8vIHNpbmNlIHBhZ2Ugc2NyZWVuc2hvdHMgYXJlIGxhcmdlIGFuZCB0aGUgZmlyc3Qgb25lIGFscmVhZHkgZ2l2ZXNcbiAgICAvLyBhIHNlc3Npb24tbGV2ZWwgcmVmZXJlbmNlLlxuICAgIHBhZ2VTaG90UGVyQ2FwdHVyZTogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgREVGQVVMVF9QUkVGUzogUHJlZnMgPSB7XG4gICAgaW5jbHVkZU91dGVySFRNTDogdHJ1ZSxcbiAgICBpbmNsdWRlTWF0Y2hlZFJ1bGVzOiB0cnVlLFxuICAgIGluY2x1ZGVTdHlsZXM6IHRydWUsXG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICBhdXRvU2Nyb2xsVG9Ib3ZlcmVkOiB0cnVlLFxuICAgIHVzZVNjcmVlbnNob3RzOiB0cnVlLFxuICAgIHNwYWNpbmdPdmVybGF5OiBmYWxzZSxcbiAgICBob3ZlclNuYXA6IHRydWUsXG4gICAgYXV0b1NjcmVlbnNob3Q6IHRydWUsXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogJycsXG4gICAgLy8gZGVzaWduTWQgLyBza2lsbE1kIGRlZmF1bHQgdG8gJycgd2hpY2ggdGhlIHJlc29sdmVyIHRyZWF0cyBhc1xuICAgIC8vIFwiZmFsbCBiYWNrIHRvIHRoZSBidW5kbGVkIHRlbXBsYXRlIGF0IGV4cG9ydCB0aW1lXCIuIFN0b3JpbmcgdGhlXG4gICAgLy8gZW1wdHkgc3RyaW5nIGtlZXBzIGNocm9tZS5zdG9yYWdlIHNtYWxsIGFuZCBsZXRzIGBpc1VzaW5nVGVtcGxhdGUqYFxuICAgIC8vIGJlIGEgY2hlYXAgc3luY2hyb25vdXMgY2hlY2suXG4gICAgZGVzaWduTWQ6ICcnLFxuICAgIGRlc2lnblBhdGg6ICd+Ly5hZ2VudHMvREVTSUdOLm1kJyxcbiAgICBza2lsbFBhdGg6ICd+Ly5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCcsXG4gICAgc2tpbGxNZDogJycsXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBmYWxzZSxcbiAgfTtcblxuICAvLyBSZXdyaXRlIHRoZSBgbmFtZTpgIGZpZWxkIGluIGEgU0tJTEwubWQncyBZQU1MIGZyb250bWF0dGVyLiBUaGVcbiAgLy8gdXNlcidzIHNvdXJjZS1vZi10cnV0aCBTS0lMTC5tZCBpcyBjYXRhbG9ndWVkIHVuZGVyIHdoYXRldmVyIG5hbWVcbiAgLy8gdGhlaXIgd2lkZXIgYC5hZ2VudHMvc2tpbGxzL2AgdHJlZSB1c2VzIChvZnRlbiBgdWlgKTsgdGhlIGJ1bmRsZWRcbiAgLy8gYXJjaGl2ZSBjb3B5IHNob3VsZCBhbHdheXMgaWRlbnRpZnkgYXMgYFBpbmNoR3JhYmAgc28gYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFkaW5nIHRoZSBtYW5pZmVzdCBkb2Vzbid0IGdldCBjb25mdXNlZCBhYm91dCB3aGljaCBza2lsbFxuICAvLyBmaWxlIGFwcGxpZXMuIE9ubHkgdGhlIEZJUlNUIHRvcC1vZi1maWxlIGBuYW1lOmAgbGluZSB3aXRoaW4gdGhlXG4gIC8vIGxlYWRpbmcgYC0tLWAgYmxvY2sgaXMgdG91Y2hlZC5cbiAgY29uc3QgcmVicmFuZFNraWxsTmFtZSA9IChtZDogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIC8vIFRoZSBmcm9udG1hdHRlciBibG9jaywgaWYgcHJlc2VudCwgaXMgYmV0d2VlbiBsZWFkaW5nIGAtLS1cXG5gXG4gICAgLy8gYW5kIHRoZSBuZXh0IGBcXG4tLS1cXG5gLiBBbnl0aGluZyBlbHNlIChubyBmcm9udG1hdHRlciwgbmFtZSBub3RcbiAgICAvLyBvbiBhIHNpbmdsZSBsaW5lLCBldGMuKSByZXR1cm5zIHVuY2hhbmdlZCDigJQgYmV0dGVyIHRvIHNoaXAgdGhlXG4gICAgLy8gb3JpZ2luYWwgdGhhbiByaXNrIGNvcnJ1cHRpbmcgdGhlIGZpbGUuXG4gICAgY29uc3QgbSA9IG1kLm1hdGNoKC9eLS0tXFxyP1xcbihbXFxzXFxTXSo/KVxccj9cXG4tLS1cXHI/XFxuLyk7XG4gICAgaWYgKCFtKSByZXR1cm4gbWQ7XG4gICAgY29uc3QgZm0gPSBtWzFdITtcbiAgICBjb25zdCByZWJyYW5kZWRGbSA9IGZtLnJlcGxhY2UoL15uYW1lOlxccyouKyQvbSwgYG5hbWU6ICR7bmV3TmFtZX1gKTtcbiAgICBpZiAocmVicmFuZGVkRm0gPT09IGZtKSByZXR1cm4gbWQ7IC8vIG5vIGBuYW1lOmAgZmllbGQ7IG5vdGhpbmcgdG8gZG9cbiAgICByZXR1cm4gbWQucmVwbGFjZShtWzBdLCBgLS0tXFxuJHtyZWJyYW5kZWRGbX1cXG4tLS1cXG5gKTtcbiAgfTtcbiAgdHlwZSBXb3Jrc3BhY2UgPSB7bmFtZTogc3RyaW5nOyBjcmVhdGVkQXQ6IHN0cmluZ307XG5cbiAgbGV0IG1lc3NhZ2VzOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICBsZXQgbGl2ZVRhYlVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsaXZlVGFiUGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHNlbGVjdG9yVmFsaWRpdHkgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbiB8ICdkaWZmLXBhZ2UnPigpO1xuICBjb25zdCBzZWxlY3RvckVycm9ycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGluc2VydEJlZm9yZToge2N1cnJlbnQ6IHN0cmluZyB8IG51bGw7IGNvbW1lbnQ6IGJvb2xlYW59ID0ge2N1cnJlbnQ6IG51bGwsIGNvbW1lbnQ6IGZhbHNlfTtcbiAgbGV0IHNlYXJjaFF1ZXJ5ID0gJyc7XG4gIGxldCBsYXN0QWN0aXZlU2VsZWN0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgc3RpY2t5VGltZXIgPSAwO1xuICBsZXQgU1RJQ0tZX1RUTF9NUyA9IDVfMDAwO1xuICBsZXQgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gIGxldCBwaGFudG9tVGFyZ2V0OiB7c2VsZWN0b3I6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgdGFnPzogc3RyaW5nOyByZWN0PzogRE9NUmVjdH0gfCBudWxsID0gbnVsbDtcbiAgbGV0IHBlbmRpbmdNdWx0aTogRW50cnlbXSA9IFtdO1xuICBjb25zdCBzaG90cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCBwZXIgc2VsZWN0b3IuIE5PVCBwZXJzaXN0ZWQgdG9cbiAgLy8gY2hyb21lLnN0b3JhZ2UgKGNhcCBwcmVzc3VyZSDigJQgMTAwIGNhcHR1cmVzIMOXIDgwIEtCIGVhY2ggPSA4IE1CKSwgc29cbiAgLy8gaXQncyBvbmx5IGF2YWlsYWJsZSBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbidzIGFyY2hpdmUgZXhwb3J0LiBDbGVhcmVkXG4gIC8vIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGNvbnN0IHNob3RzRnVsbCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIFRyYWNrIHdoaWNoICh3b3Jrc3BhY2UsIHBhZ2UtdXJsKSB0dXBsZXMgYWxyZWFkeSBmaXJlZCBhIHBhZ2Ugc2hvdCBzbyB3ZVxuICAvLyBkb24ndCByZS1zaG9vdCB0aGUgZW50aXJlIHBhZ2Ugb24gZXZlcnkgY2FwdHVyZS4gUmVzZXQgb24gd29ya3NwYWNlXG4gIC8vIHN3aXRjaCDigJQgbm8gZGF5IGtleSwgdGhlIGRlZHVwZSBpcyBwZXItc2Vzc2lvbi5cbiAgY29uc3QgcGFnZVNob3RzRmlyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcGFnZVNob3RLZXkgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4gYCR7YWN0aXZlV3N9OiR7dXJsfWA7XG4gIC8vIExhc3Qgc3VjY2Vzc2Z1bCBleHBvcnQg4oCUIGJvdGggdGhlIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChzaG93biB0byB0aGVcbiAgLy8gdXNlcikgYW5kIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIChjb3BpZWQgYnkgdGhlIFwiQ29weSBhcyBwYXRoXCIgYnV0dG9uKS5cbiAgLy8gVXBkYXRlZCBvbiBKU09OTC9NRC9aSVAvc2NyZWVuc2hvdCBzYXZlcy5cbiAgY29uc3QgbGFzdEV4cG9ydDoge3JlbFBhdGg6IHN0cmluZyB8IG51bGw7IGFic1BhdGg6IHN0cmluZyB8IG51bGw7IGNvcHlQYXRoOiBzdHJpbmcgfCBudWxsOyB0ZW1wUGF0aDogYm9vbGVhbjsga2luZDogc3RyaW5nIHwgbnVsbH0gPSB7XG4gICAgcmVsUGF0aDogbnVsbCwgYWJzUGF0aDogbnVsbCwgY29weVBhdGg6IG51bGwsIHRlbXBQYXRoOiBmYWxzZSwga2luZDogbnVsbCxcbiAgfTtcbiAgbGV0IHdvcmtzcGFjZXM6IFdvcmtzcGFjZVtdID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gIGxldCBhY3RpdmVXcyA9ICdkZWZhdWx0JztcbiAgLy8gU2Vzc2lvbiB1dWlkIOKAlCBnZW5lcmF0ZWQgb25jZSBwZXIgd29ya3NwYWNlIGJvb3QuIEdvZXMgb250byBldmVyeVxuICAvLyBwYWdlIHJvdyBhbmQgZXZlcnkgc2VsZWN0b3IgZW50cnkgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlc1xuICAvLyB0byBcIndoaWNoIHNlc3Npb24/XCIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuIFN0YWJsZSBhY3Jvc3MgYVxuICAvLyBzaW5nbGUgd29ya3NwYWNlIGxvYWQ7IHJlc2V0cyBvbiB3b3Jrc3BhY2Ugc3dpdGNoLlxuICBsZXQgc2Vzc2lvbklkOiBzdHJpbmcgPSAnJztcbiAgY29uc3Qgd3NNc2dLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5tZXNzYWdlcy52MWA7XG4gIGNvbnN0IHdzU2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90cy52MWA7XG4gIGNvbnN0IHdzU2hvdHNGdWxsS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0uc2hvdHNGdWxsLnYxYDtcbiAgLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgaGFzIGEgMTAgTUIgZGVmYXVsdCBxdW90YTsgd2UgYnVkZ2V0IGhhbGYgb2ZcbiAgLy8gdGhhdCBmb3IgZnVsbC1yZXNvbHV0aW9uIFBOR3MgKHRoZSByZXN0IGlzIG1lc3NhZ2VzLCBwcmVmcywgdGh1bWJzKS5cbiAgLy8gV2hlbiB0aGUgYnVkZ2V0IGlzIHJlYWNoZWQgd2UgRklGTy1ldmljdCB0aGUgb2xkZXN0IGVudHJpZXMgKE1hcFxuICAvLyBwcmVzZXJ2ZXMgaW5zZXJ0aW9uIG9yZGVyKS4gRXN0aW1hdGUgZGF0YVVSTCBzaXplID0gc3RyaW5nIGxlbmd0aC5cbiAgY29uc3QgU0hPVFNfRlVMTF9CVURHRVRfQllURVMgPSA1ICogMTAyNCAqIDEwMjQ7XG4gIGNvbnN0IHVuZG9TdGFjazogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgcmVkb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBVTkRPX0NBUCA9IDMwO1xuICBsZXQgc3VzcGVuZFNuYXBzaG90cyA9IGZhbHNlO1xuICBsZXQgcHJlZnM6IFByZWZzID0gey4uLkRFRkFVTFRfUFJFRlN9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0dXMgaGVscGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgc3RhdHVzVGltZXIgPSAwO1xuICBjb25zdCBzZXRTdGF0dXMgPSAobXNnOiBzdHJpbmcsIG9wdHM6IHtraW5kPzogJ3dhcm4nIHwgJ2luZm8nIHwgJ29rJ30gPSB7fSk6IHZvaWQgPT4ge1xuICAgIHN0YXR1cy50ZXh0Q29udGVudCA9IG1zZyB8fCAnJztcbiAgICBjbGVhclRpbWVvdXQoc3RhdHVzVGltZXIpO1xuICAgIGlmIChtc2cpIHtcbiAgICAgIHN0YXR1cy5zdHlsZS5jb2xvciA9IG9wdHMua2luZCA9PT0gJ3dhcm4nID8gJ3ZhcigtLXJlZCknIDpcbiAgICAgICAgb3B0cy5raW5kID09PSAnaW5mbycgPyAndmFyKC0tdGV4dC0zKScgOiAndmFyKC0tZ3JlZW4pJztcbiAgICAgIHN0YXR1c1RpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyBzdGF0dXMudGV4dENvbnRlbnQgPSAnJzsgfSwgMjIwMCk7XG4gICAgfVxuICB9O1xuICBsZXQgdG9hc3RUaW1lciA9IDA7XG4gIGNvbnN0IHNob3dUb2FzdCA9ICh0aXRsZTogc3RyaW5nLCBkZXRhaWwgPSAnJywga2luZDogJ29rJyB8ICd3YXJuJyA9ICdvaycpOiB2b2lkID0+IHtcbiAgICBsZXQgdG9hc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtY29weS10b2FzdF0nKTtcbiAgICBpZiAoIXRvYXN0KSB7XG4gICAgICB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdG9hc3QuY2xhc3NOYW1lID0gJ2NvcHktdG9hc3QnO1xuICAgICAgdG9hc3QuZGF0YXNldC5jb3B5VG9hc3QgPSAndHJ1ZSc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0b2FzdCk7XG4gICAgfVxuICAgIHRvYXN0LmNsYXNzTGlzdC50b2dnbGUoJ3dhcm4nLCBraW5kID09PSAnd2FybicpO1xuICAgIHRvYXN0LmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cImNvcHktdG9hc3QtaWNvblwiPiR7UEdfSUNPTlMuc3ZnU3RyaW5nKGtpbmQgPT09ICd3YXJuJyA/ICdhbGVydC1jaXJjbGUnIDogJ2NpcmNsZS1jaGVjaycsIDIyKX08L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNvcHktdG9hc3QtdGV4dFwiPjxiPiR7ZXNjYXBlSHRtbCh0aXRsZSl9PC9iPiR7ZGV0YWlsID8gYDxzbWFsbD4ke2VzY2FwZUh0bWwoZGV0YWlsKX08L3NtYWxsPmAgOiAnJ308L3NwYW4+YDtcbiAgICB0b2FzdC5oaWRkZW4gPSBmYWxzZTtcbiAgICB0b2FzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgdm9pZCB0b2FzdC5vZmZzZXRXaWR0aDtcbiAgICB0b2FzdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgY2xlYXJUaW1lb3V0KHRvYXN0VGltZXIpO1xuICAgIHRvYXN0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0b2FzdD8uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyBpZiAodG9hc3QpIHRvYXN0LmhpZGRlbiA9IHRydWU7IH0sIDE4MCk7XG4gICAgfSwgMTQ1MCk7XG4gIH07XG4gIGNvbnN0IHNob3dDb3BpZWQgPSAobGFiZWw6IHN0cmluZywgZGV0YWlsID0gJycpOiB2b2lkID0+IHNob3dUb2FzdChsYWJlbCwgZGV0YWlsLCAnb2snKTtcbiAgY29uc3Qgc2hvd0Rvd25sb2FkRXJyb3IgPSAobGFiZWw6IHN0cmluZywgZGV0YWlsOiBzdHJpbmcpOiB2b2lkID0+IHNob3dUb2FzdChsYWJlbCwgZGV0YWlsLCAnd2FybicpO1xuXG4gIC8vIOKUgOKUgOKUgCBVdGlsaXRpZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBmYWxsYmFja0lkQ291bnRlciA9IDA7XG4gIGNvbnN0IHNlY3VyZVRva2VuID0gKGJ5dGVzID0gMTIpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG4gICAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMocmF3KTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHJhdykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX1fJHsoKytmYWxsYmFja0lkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gICAgfVxuICB9O1xuICBjb25zdCBtc2dJZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7IGlmIChnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKSByZXR1cm4gZ2xvYmFsVGhpcy5jcnlwdG8ucmFuZG9tVVVJRCgpOyB9IGNhdGNoIHsgLyogZmFsbCB0aHJvdWdoICovIH1cbiAgICByZXR1cm4gYGlkXyR7c2VjdXJlVG9rZW4oMTYpfWA7XG4gIH07XG4gIGNvbnN0IGVzY2FwZUh0bWwgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgU3RyaW5nKHMpLnJlcGxhY2VBbGwoJyYnLCAnJmFtcDsnKS5yZXBsYWNlQWxsKCc8JywgJyZsdDsnKS5yZXBsYWNlQWxsKCc+JywgJyZndDsnKTtcbiAgY29uc3QgZXNjYXBlUmUgPSAoczogc3RyaW5nKTogc3RyaW5nID0+IHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbiAgY29uc3QgaGlnaGxpZ2h0TWF0Y2ggPSAodGV4dDogc3RyaW5nLCBxOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCk7XG4gICAgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKGAoJHtlc2NhcGVSZShxKX0pYCwgJ2dpJyksICc8bWFyaz4kMTwvbWFyaz4nKTtcbiAgfTtcbiAgLy8gV2FsayB0ZXh0IG5vZGVzIGluc2lkZSBgcm9vdGAsIHdyYXBwaW5nIGNhc2UtaW5zZW5zaXRpdmUgbWF0Y2hlcyBvZiBgcWBcbiAgLy8gaW4gPG1hcms+IGVsZW1lbnRzLiBEb2Vzbid0IHRvdWNoIGF0dHJpYnV0ZSBzdHJpbmdzIG9yIGlubmVyLXRhZyBIVE1MIHNvXG4gIC8vIGl0J3Mgc2FmZSB0byBydW4gb24gYWxyZWFkeS1oaWdobGlnaHRlZCBKU09OIG91dHB1dC5cbiAgY29uc3Qgd3JhcFNlYXJjaEhpdHNJblRleHROb2RlcyA9IChyb290OiBIVE1MRWxlbWVudCwgcTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm47XG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKGVzY2FwZVJlKHEpLCAnZ2knKTtcbiAgICBjb25zdCB3YWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKHJvb3QsIE5vZGVGaWx0ZXIuU0hPV19URVhUKTtcbiAgICBjb25zdCB0YXJnZXRzOiBUZXh0W10gPSBbXTtcbiAgICBsZXQgbm9kZTogTm9kZSB8IG51bGw7XG4gICAgd2hpbGUgKChub2RlID0gd2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICBpZiAocmUudGVzdChub2RlLm5vZGVWYWx1ZSA/PyAnJykpIHRhcmdldHMucHVzaChub2RlIGFzIFRleHQpO1xuICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9XG4gICAgZm9yIChjb25zdCB0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdC5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgbGV0IGxhc3QgPSAwO1xuICAgICAgZm9yIChjb25zdCBtIG9mIHZhbHVlLm1hdGNoQWxsKHJlKSkge1xuICAgICAgICBjb25zdCBpID0gbS5pbmRleCA/PyAwO1xuICAgICAgICBpZiAoaSA+IGxhc3QpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QsIGkpKTtcbiAgICAgICAgY29uc3QgbWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYXJrJyk7XG4gICAgICAgIG1rLnRleHRDb250ZW50ID0gbVswXTtcbiAgICAgICAgZnJhZy5hcHBlbmQobWspO1xuICAgICAgICBsYXN0ID0gaSArIG1bMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGxhc3QgPCB2YWx1ZS5sZW5ndGgpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QpKTtcbiAgICAgIHQucmVwbGFjZVdpdGgoZnJhZyk7XG4gICAgfVxuICB9O1xuICBjb25zdCB3b3JkQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IChzLm1hdGNoKC9cXFMrL2cpID8/IFtdKS5sZW5ndGg7XG4gIGNvbnN0IHRva2VuQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IE1hdGguY2VpbChzLmxlbmd0aCAvIDQpO1xuICBjb25zdCBwYXRoT2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkucGF0aG5hbWU7IH0gY2F0Y2ggeyByZXR1cm4gdTsgfSB9O1xuICBjb25zdCBob3N0T2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkuaG9zdDsgfSBjYXRjaCB7IHJldHVybiAnJzsgfSB9O1xuICAvLyBGaWxlbmFtZS1zYWZlIGhvc3Qgc2x1ZzogZG90cyDihpIgdW5kZXJzY29yZXMgcGVyIHByb2plY3QgY29udmVudGlvbi5cbiAgLy8gTWlycm9ycyBiYWNrZ3JvdW5kLnRzIGhvc3RTbHVnIGZvciBzeW1tZXRyeSBhY3Jvc3Mgc2NyZWVuc2hvdCArIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMuXG4gIGNvbnN0IGhvc3RTbHVnID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBoID0gaG9zdE9mKHVybCk7XG4gICAgaWYgKCFoKSByZXR1cm4gJ3Vua25vd24nO1xuICAgIHJldHVybiBoLnJlcGxhY2UoL1xcLi9nLCAnXycpLnJlcGxhY2UoL1teXFx3LV0vZywgJ18nKS5zbGljZSgwLCA0MCkgfHwgJ3Vua25vd24nO1xuICB9O1xuICAvLyBQaWNrIHRoZSBtb3N0LWZyZXF1ZW50IGhvc3QgYWNyb3NzIGFsbCBzZWxlY3RvciBjYXB0dXJlcyAoZm9yIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMpLiBXaGVuIHRoZSB3b3Jrc3BhY2Ugc3BhbnMgbXVsdGlwbGUgaG9zdHMsIHJldHVybiAnbXVsdGknLlxuICBjb25zdCBkb21pbmFudEhvc3RTbHVnID0gKCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgY291bnRzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RTbHVnKG0uZW50cnkudXJsKTtcbiAgICAgIGNvdW50cy5zZXQoaCwgKGNvdW50cy5nZXQoaCkgPz8gMCkgKyAxKTtcbiAgICB9XG4gICAgaWYgKCFjb3VudHMuc2l6ZSkgcmV0dXJuICdlbXB0eSc7XG4gICAgbGV0IGJlc3QgPSAnJztcbiAgICBsZXQgYmVzdE4gPSAwO1xuICAgIGZvciAoY29uc3QgW2gsIG5dIG9mIGNvdW50cykge1xuICAgICAgaWYgKG4gPiBiZXN0TikgeyBiZXN0ID0gaDsgYmVzdE4gPSBuOyB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudHMuc2l6ZSA+IDEgPyAnbXVsdGknIDogYmVzdDtcbiAgfTtcbiAgLy8gRGlzdGluY3QgaG9zdHMgcHJlc2VudCBpbiB0aGlzIHdvcmtzcGFjZSAoYWxwaGFiZXRpY2FsLCBjYXBwZWQpLiBVc2VkIGluXG4gIC8vIHRoZSBleHBvcnQgbWFuaWZlc3QncyBgaG9zdHNgIGZpZWxkLlxuICBjb25zdCBkaXN0aW5jdEhvc3RzID0gKCk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBzZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RPZihtLmVudHJ5LnVybCk7XG4gICAgICBpZiAoaCkgc2V0LmFkZChoKTtcbiAgICB9XG4gICAgcmV0dXJuIFsuLi5zZXRdLnNvcnQoKS5zbGljZSgwLCAyMCk7XG4gIH07XG4gIC8vIEJ1aWxkIGEgZmlsZW5hbWUgb2YgdGhlIHNoYXBlIGBwaW5jaGdyYWItPHdvcmtzcGFjZT4tPGhvc3Q+LTxlcG9jaD4uPGV4dD5gLlxuICBjb25zdCBidWlsZEV4cG9ydEZpbGVuYW1lID0gKGV4dDogJ2pzb25sJyB8ICdtZCcgfCAndGFyLnpzdCcpOiBzdHJpbmcgPT5cbiAgICBgcGluY2hncmFiLSR7YWN0aXZlV3N9LSR7ZG9taW5hbnRIb3N0U2x1ZygpfS0ke0RhdGUubm93KCl9LiR7ZXh0fWA7XG4gIC8vIFNraXAtbGlzdCBtYXRjaDogc3Vic3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSBtYXRjaCBhZ2FpbnN0IHRoZSBVUkwnc1xuICAvLyBob3N0LiBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBVUkwgcGFyc2luZyBvbiB0aGUgcGF0dGVybnMgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHdyaXRlIGB3cmFubmdsZS5jb21gIGFuZCBoYXZlIGl0IG1hdGNoIGBhcHAud3Jhbm5nbGUuY29tYCB0b28uXG4gIGNvbnN0IHNob3VsZFNraXBTY3JlZW5zaG90ID0gKHVybDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgbGlzdCA9IChwcmVmcy5za2lwU2NyZWVuc2hvdEhvc3RzID8/ICcnKS5zcGxpdCgnLCcpLm1hcCgocykgPT4gcy50cmltKCkudG9Mb3dlckNhc2UoKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0ID0gaG9zdE9mKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGlzdC5zb21lKChwYXQpID0+IGhvc3QuaW5jbHVkZXMocGF0KSk7XG4gIH07XG5cbiAgLy8gSlNPTiBzeW50YXggaGlnaGxpZ2h0IChwZXIta2V5IGNvbG9yIGlzIGhhc2hlZCBmb3IgdmlzdWFsIHZhcmlldHkpLlxuICBjb25zdCBLRVlfUEFMRVRURSA9IFsnI2ZmN2U3OCcsICcjZmZiNDU0JywgJyNmZmUwNjYnLCAnIzdiZDk3YScsICcjNWZkMWZmJywgJyM5YjhjZmYnLCAnI2ZmODVjMScsICcjZmY1ZjAwJywgJyMxMGI5ODEnLCAnI2Y1OWUwYicsICcjYTc4YmZhJywgJyMzNGQzOTknXTtcbiAgY29uc3QgY29sb3JGb3JLZXkgPSAoazogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgaCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIGsuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gICAgcmV0dXJuIEtFWV9QQUxFVFRFW2ggJSBLRVlfUEFMRVRURS5sZW5ndGhdITtcbiAgfTtcbiAgY29uc3QgSlNPTl9UT0tFTl9SRSA9IC8oXFxzKyl8KFwiKD86W15cIlxcXFxdfFxcXFwuKSpcIil8KHRydWV8ZmFsc2V8bnVsbCl8KC0/XFxkKyg/OlxcLlxcZCspPyg/OltlRV1bKy1dP1xcZCspPyl8KFt7fVtcXF0sOl0pL2c7XG4gIGNvbnN0IGFwcGVuZEpzb25IaWdobGlnaHQgPSAocm9vdDogSFRNTEVsZW1lbnQsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHJvb3QudGV4dENvbnRlbnQgPSAnJztcbiAgICBsZXQgbTogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcbiAgICBsZXQgbGFzdCA9IDA7XG4gICAgSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IEpTT05fVE9LRU5fUkUuZXhlYyh0ZXh0KSkgIT09IG51bGwpIHtcbiAgICAgIGlmIChtLmluZGV4ID4gbGFzdCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0LCBtLmluZGV4KSkpO1xuICAgICAgbGFzdCA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgY29uc3QgWywgd3MsIHN0ciwgbGl0LCBudW0sIHB1bmN0XSA9IG07XG4gICAgICBpZiAod3MpIHsgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUod3MpKTsgY29udGludWU7IH1cbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgbGV0IGsgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgICAgd2hpbGUgKGsgPCB0ZXh0Lmxlbmd0aCAmJiAodGV4dFtrXSA9PT0gJyAnIHx8IHRleHRba10gPT09ICdcXHQnIHx8IHRleHRba10gPT09ICdcXG4nKSkgaysrO1xuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBpZiAodGV4dFtrXSA9PT0gJzonKSB7XG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuICAgICAgICAgIHRyeSB7IGtleSA9IEpTT04ucGFyc2Uoc3RyKSBhcyBzdHJpbmc7IH0gY2F0Y2ggeyBrZXkgPSBzdHIuc2xpY2UoMSwgLTEpOyB9XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAnayc7XG4gICAgICAgICAgc3Bhbi5zdHlsZS5jb2xvciA9IGNvbG9yRm9yS2V5KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAncyc7XG4gICAgICAgIH1cbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHN0cjtcbiAgICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGlmIChsaXQpIHNwYW4uY2xhc3NOYW1lID0gJ2InO1xuICAgICAgZWxzZSBpZiAobnVtKSBzcGFuLmNsYXNzTmFtZSA9ICduJztcbiAgICAgIGVsc2UgaWYgKHB1bmN0KSBzcGFuLmNsYXNzTmFtZSA9ICdwJztcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBsaXQgPz8gbnVtID8/IHB1bmN0ID8/ICcnO1xuICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgfVxuICAgIGlmIChsYXN0IDwgdGV4dC5sZW5ndGgpIHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCkpKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUGVyc2lzdGVuY2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGxvYWRBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd29ya3NwYWNlcyA9IChhd2FpdCBTdG9yZS5nZXQ8V29ya3NwYWNlW10+KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKSkgfHwgd29ya3NwYWNlcztcbiAgICBpZiAoIXdvcmtzcGFjZXMubGVuZ3RoKSB3b3Jrc3BhY2VzID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gICAgYWN0aXZlV3MgPSAoYXdhaXQgU3RvcmUuZ2V0PHN0cmluZz4oJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCAnZGVmYXVsdCcpKSB8fCAnZGVmYXVsdCc7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gYWN0aXZlV3MpKSBhY3RpdmVXcyA9IHdvcmtzcGFjZXNbMF0hLm5hbWU7XG4gICAgcHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGUywgLi4uKGF3YWl0IFN0b3JlLmdldDxQYXJ0aWFsPFByZWZzPj4oUFJFRlNfU1RPUkFHRV9OQU1FLCB7fSkpfTtcbiAgICAvLyBQYXRoIG1pZ3JhdGlvbjogcHJpb3IgdmVyc2lvbnMgZGVmYXVsdGVkIHNraWxsUGF0aCB0b1xuICAgIC8vIGB+Ly5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYCwgYW5kIHNvbWUgdXNlcnMgaGFkIGl0IHN0b3JlZCBhc1xuICAgIC8vIGB+Ly5kb3RmaWxlcy8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAuIFRoZSBza2lsbCB3YXMgcmVuYW1lZFxuICAgIC8vIHRvIGBQaW5jaEdyYWJgOyBhbnkgYH4vLmRvdGZpbGVzL2AgcHJlZml4IGlzIHN0cmlwcGVkIGZyb21cbiAgICAvLyBleHBvc2VkIGRlZmF1bHRzIChkb3RmaWxlcyBpcyBhIHBlcnNvbmFsIGNvbmZpZyBzb3VyY2Ug4oCUIGV4cG9ydHNcbiAgICAvLyBzaG91bGRuJ3QgbGVhayB0aGF0IHBhdGgpLlxuICAgIGNvbnN0IHVwZ3JhZGVQYXRoID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCwgZnJlc2g6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICBpZiAoIXApIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmluY2x1ZGVzKCcuZG90ZmlsZXMnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuZW5kc1dpdGgoJ3NraWxscy91aS9TS0lMTC5tZCcpKSByZXR1cm4gZnJlc2g7XG4gICAgICByZXR1cm4gcDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnblBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5kZXNpZ25QYXRoLCBERUZBVUxUX1BSRUZTLmRlc2lnblBhdGgpO1xuICAgIHByZWZzLnNraWxsUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLnNraWxsUGF0aCwgREVGQVVMVF9QUkVGUy5za2lsbFBhdGgpO1xuICAgIC8vIENvbnRlbnQgbWlncmF0aW9uOiBwcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgdGhlIGVudGlyZSB0ZW1wbGF0ZVxuICAgIC8vIHRleHQgaW5zaWRlIGBwcmVmcy5kZXNpZ25NZGAgLyBgcHJlZnMuc2tpbGxNZGAgYXMgZGVmYXVsdHMuIFRoYXRcbiAgICAvLyBhdGUgfjM2MEtCIG9mIGNocm9tZS5zdG9yYWdlIHF1b3RhIGZvciBubyBiZW5lZml0LiBEZXRlY3Qgd2hlblxuICAgIC8vIHRoZSBzdG9yZWQgdmFsdWUgbWF0Y2hlcyBvbmUgb2YgdGhlIGJ1bmRsZWQgdGVtcGxhdGVzIGFuZCBjbGVhclxuICAgIC8vIGl0IOKAlCB0aGUgcmVzb2x2ZXIgZmFsbHMgYmFjayB0byB0aGUgYnVuZGxlZCBmaWxlIG9uIHRoZSBmbHkuXG4gICAgLy8gQWxzbyBzY3J1YiBhbnkgbGVha2VkIGB+Ly5kb3RmaWxlcy9gIHN1YnN0cmluZy5cbiAgICBjb25zdCBzY3J1YkRvdGZpbGVzID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgICAgcy5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8uYWdlbnRzLycsICd+Ly5hZ2VudHMvJylcbiAgICAgICAucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvJywgJ34vLmFnZW50cy8nKTtcbiAgICBjb25zdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlID0gYXN5bmMgKGN1cnJlbnQ6IHN0cmluZywga2V5czogVGVtcGxhdGVLZXlbXSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICBpZiAoIWN1cnJlbnQgfHwgIWN1cnJlbnQudHJpbSgpKSByZXR1cm4gJyc7XG4gICAgICBjb25zdCB0cmltbWVkID0gY3VycmVudC50cmltKCk7XG4gICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xuICAgICAgICBjb25zdCB0cGwgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKGspKS50cmltKCk7XG4gICAgICAgIGlmICh0cGwgJiYgdHBsID09PSB0cmltbWVkKSByZXR1cm4gJyc7IC8vIG1hdGNoZXMgYSBidW5kbGVkIHRlbXBsYXRlIOKAlCBjb2xsYXBzZSB0byBlbXB0eVxuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnJlbnQuaW5jbHVkZXMoJy5kb3RmaWxlcycpID8gc2NydWJEb3RmaWxlcyhjdXJyZW50KSA6IGN1cnJlbnQ7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25NZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuZGVzaWduTWQgPz8gJycsIFsnbG9jYWxEZXNpZ24nLCAnZGVzaWduVGVtcGxhdGUnXSk7XG4gICAgcHJlZnMuc2tpbGxNZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuc2tpbGxNZCA/PyAnJywgWydsb2NhbFNraWxsJywgJ3NraWxsVGVtcGxhdGUnXSk7XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZShhY3RpdmVXcyk7XG4gIH07XG4gIGNvbnN0IGxvYWRXb3Jrc3BhY2UgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYWN0aXZlV3MgPSBuYW1lO1xuICAgIHZvaWQgU3RvcmUuc2V0KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgbmFtZSk7XG4gICAgLy8gTWludCBhIG5ldyBzZXNzaW9uSWQgcGVyIHdvcmtzcGFjZSBsb2FkLiBTYW1lIHdvcmtzcGFjZSByZS1vcGVuZWRcbiAgICAvLyA9IG5ldyBzZXNzaW9uOiBkaXN0aW5jdCB1dWlkIHNvIGEgY29uc3VtZXIgY2FuIHRlbGwgdHdvIGJvb3RzXG4gICAgLy8gYXBhcnQgZXZlbiB3aGVuIHRoZSBjYXB0dXJlcyBsYW5kIGluIHRoZSBzYW1lIG9uLWRpc2sgZmlsZS5cbiAgICBzZXNzaW9uSWQgPSBtc2dJZCgpO1xuICAgIG1lc3NhZ2VzID0gKGF3YWl0IFN0b3JlLmdldDxQYW5lbE1lc3NhZ2VbXT4od3NNc2dLZXkobmFtZSksIFtdKSkgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkgbWVzc2FnZXMgPSBbXTtcbiAgICAvLyBNaWdyYXRlIGxlZ2FjeSBlbnRyaWVzIChubyB1aWQsIHN0YXRlcy1hcy1yZWNvcmQsIGF0dHJzLmZvcm1hdCkgYW5kXG4gICAgLy8gcGVyc2lzdCBpZiBhbnl0aGluZyBjaGFuZ2VkIHNvIHdlIGRvbid0IHBheSB0aGUgbWlncmF0aW9uIGNvc3QgYWdhaW5cbiAgICAvLyBuZXh0IGxvYWQuXG4gICAgaWYgKG1pZ3JhdGVMb2FkZWRNZXNzYWdlcygpKSB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShuYW1lKSwgbWVzc2FnZXMpO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGFnZVNob3RzRmlyZWQuY2xlYXIoKTtcbiAgICBjb25zdCBzdG9yZWQgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIC8vIFJlc3RvcmUgdGhlIGZ1bGwtcmVzb2x1dGlvbiBQTkcgY2FjaGUgc28gYSB3b3Jrc3BhY2UgYXJjaGl2ZVxuICAgIC8vIGV4cG9ydGVkIEFGVEVSIGEgcGFuZWwgcmVsb2FkIHN0aWxsIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZnJvbVxuICAgIC8vIGVhcmxpZXIgY2FwdHVyZXMuIEZJRk8gb3JkZXIgaXMgcHJlc2VydmVkIGJ5IE9iamVjdCBrZXkgb3JkZXIuXG4gICAgY29uc3Qgc3RvcmVkRnVsbCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0Z1bGxLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkRnVsbCkpIHNob3RzRnVsbC5zZXQoaywgdik7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIHNlbGVjdG9yRXJyb3JzLmNsZWFyKCk7XG4gICAgdW5kb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IG51bGw7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdCA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShhY3RpdmVXcyksIG1lc3NhZ2VzKTtcbiAgICAvLyBQdXNoIGNhcHR1cmVkLXNlbGVjdG9yIHNldCBzbyB0aGUgY29udGVudCBzY3JpcHQncyBob3ZlciB3YWxrZXIgY2FuXG4gICAgLy8gcmVzb2x2ZSBkZXNjZW5kYW50cyDihpIgY2FwdHVyZWQgYW5jZXN0b3IuXG4gICAgY29uc3Qgc2VsZWN0b3JzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIHNlbmRUb0NTKHtraW5kOiAnc2V0LWNhcHR1cmVkJywgc2VsZWN0b3JzfSk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RQcmVmcyA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldChQUkVGU19TVE9SQUdFX05BTUUsIHByZWZzKTtcbiAgICAvLyBQdXNoIHRoZSBzdWJzZXQgb2YgcHJlZnMgdGhlIGNvbnRlbnQgc2NyaXB0IGNhcmVzIGFib3V0IHNvIGl0c1xuICAgIC8vIG92ZXJsYXkgKHNwYWNpbmcgdmlzdWFsaXplciwgaG92ZXIgc25hcCwgZXRjLikgcmVmbGVjdHMgdGhlIGxhdGVzdC5cbiAgICB2b2lkIHNlbmRUb0NTKHtcbiAgICAgIGtpbmQ6ICdzZXQtY3MtcHJlZnMnLFxuICAgICAgc3BhY2luZ092ZXJsYXk6IHByZWZzLnNwYWNpbmdPdmVybGF5LFxuICAgICAgaG92ZXJTbmFwOiBwcmVmcy5ob3ZlclNuYXAsXG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90cyA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90cykgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBwZXJzaXN0ZW5jZSB3aXRoIEZJRk8gZXZpY3Rpb24uIGRhdGFVUkwgc3RyaW5nc1xuICAvLyBjYW4gcnVuIDUwLTUwMCBLQiBlYWNoOyB0aGUgZGVmYXVsdCBxdW90YSBnZXRzIGV4aGF1c3RlZCBpbiB0ZW5zIG9mXG4gIC8vIGNhcHR1cmVzIHdpdGhvdXQgYSBidWRnZXQuIE1hcCBpbnNlcnRpb24gb3JkZXIgPSBGSUZPIG9yZGVyLCBzb1xuICAvLyB3ZSBldmljdCBmcm9tIHRoZSBmcm9udCB1bnRpbCB1bmRlciBidWRnZXQgYmVmb3JlIHBlcnNpc3RpbmcuXG4gIGNvbnN0IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQgPSAoKTogbnVtYmVyID0+IHtcbiAgICBsZXQgdG90YWwgPSAwO1xuICAgIGZvciAoY29uc3QgdiBvZiBzaG90c0Z1bGwudmFsdWVzKCkpIHRvdGFsICs9IHYubGVuZ3RoO1xuICAgIGxldCBldmljdGVkID0gMDtcbiAgICB3aGlsZSAodG90YWwgPiBTSE9UU19GVUxMX0JVREdFVF9CWVRFUykge1xuICAgICAgY29uc3QgZmlyc3RLZXkgPSBzaG90c0Z1bGwua2V5cygpLm5leHQoKS52YWx1ZTtcbiAgICAgIGlmIChmaXJzdEtleSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIGNvbnN0IHJlbW92ZWQgPSBzaG90c0Z1bGwuZ2V0KGZpcnN0S2V5KTtcbiAgICAgIGlmIChyZW1vdmVkID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgc2hvdHNGdWxsLmRlbGV0ZShmaXJzdEtleSk7XG4gICAgICB0b3RhbCAtPSByZW1vdmVkLmxlbmd0aDtcbiAgICAgIGV2aWN0ZWQrKztcbiAgICB9XG4gICAgcmV0dXJuIGV2aWN0ZWQ7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90c0Z1bGwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXZpY3RlZCA9IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQoKTtcbiAgICBpZiAoZXZpY3RlZCA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgYHNob3RzRnVsbCBGSUZPLWV2aWN0ZWQgJHtldmljdGVkfSBvbGRlc3QgZW50cmllcyB0byBmaXQgJHtTSE9UU19GVUxMX0JVREdFVF9CWVRFUyAvIDEwMjQgLyAxMDI0fU1CIGJ1ZGdldGApO1xuICAgIH1cbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90c0Z1bGwpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0Z1bGxLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V29ya3NwYWNlcyA9ICgpOiB2b2lkID0+IHsgdm9pZCBTdG9yZS5zZXQoV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpOyB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTbmFwc2hvdCAvIHVuZG8gLyByZWRvIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzbmFwc2hvdCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoc3VzcGVuZFNuYXBzaG90cykgcmV0dXJuO1xuICAgIGlmICh1bmRvU3RhY2subGVuZ3RoID49IFVORE9fQ0FQKSB1bmRvU3RhY2suc2hpZnQoKTtcbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlc3RvcmUgPSAoanNvbjogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IHRydWU7XG4gICAgdHJ5IHsgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGpzb24pIGFzIFBhbmVsTWVzc2FnZVtdOyB9IGNhdGNoIHsgbWVzc2FnZXMgPSBbXTsgfVxuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSBmYWxzZTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG4gIGNvbnN0IHVuZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCF1bmRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byB1bmRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICByZWRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUodW5kb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdVbmRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZWRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcmVkb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gcmVkbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHJlZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnUmVkb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlVW5kb0J1dHRvbnMgPSAoKTogdm9pZCA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwidW5kb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHVuZG9TdGFjay5sZW5ndGggPT09IDApO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInJlZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCByZWRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlQ29weVBhdGhCdXR0b24gPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWFjdGlvbj1cImNvcHktcGF0aFwiXScpO1xuICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgY29uc3QgaGFzID0gQm9vbGVhbihsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCk7XG4gICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgIWhhcyk7XG4gICAgYnRuLmRhdGFzZXQudGlwID0gaGFzXG4gICAgICA/IGBDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuXFxuJHtsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCA/PyAnJ31gXG4gICAgICA6ICdDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuIFJ1biBhbiBleHBvcnQgZmlyc3QuJztcbiAgfTtcbiAgY29uc3Qgb25Db3B5UGF0aCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwYXRoVG9Db3B5ID0gbGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGg7XG4gICAgaWYgKCFwYXRoVG9Db3B5KSB7XG4gICAgICBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIHJ1biBhIGRvd25sb2FkIGZpcnN0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocGF0aFRvQ29weSk7XG4gICAgICAvLyBTaG93IG9ubHkgdGhlIGxlYWYgZmlsZW5hbWUgaW4gdGhlIHN0YXR1cyDigJQgdGhlIGZ1bGwgV2luZG93cy1zdHlsZVxuICAgICAgLy8gYWJzb2x1dGUgcGF0aCB3b3VsZCBiZSAxMDArIGNoYXJzIGFuZCB3YXMgZGlzcnVwdGluZyB0aGUgc2lkZWJhclxuICAgICAgLy8gbGF5b3V0IGZvciB0aGUgMi1zZWNvbmQgc3RhdHVzIFRUTC5cbiAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICBzZXRTdGF0dXMoYENvcGllZCBwYXRoIMK3ICR7bGVhZn1gKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBwYXRoJywgbGVhZik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgd3JpdGUgZmFpbGVkOiAnICsgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB0byBhY3RpdmUgdGFiIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZW5kVG9DUyA9IGFzeW5jIChwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBtc2cgPSBwZyhwYXlsb2FkKTtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgIGlmICh0YWJzWzBdPy5pZCAhPSBudWxsKSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCBtc2cpLmNhdGNoKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7IHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLWNzJywge2RldGFpbDogbXNnfSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHNlbmRUb0NTQW5kV2FpdCA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPFIgfCBudWxsPiA9PiBuZXcgUHJvbWlzZTxSIHwgbnVsbD4oKHJlc29sdmUpID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zdCByZXFJZCA9IGByZXFfJHtzZWN1cmVUb2tlbigxMil9YDtcbiAgICAgIGNvbnN0IG9uUmVzcCA9IChlOiBFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSAoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsO1xuICAgICAgICBpZiAoZGV0YWlsPy5fX3JlcUlkID09PSByZXFJZCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgICAgIHJlc29sdmUoZGV0YWlsLnJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiB7X19yZXFJZDogcmVxSWQsIC4uLnBnKHBheWxvYWQpfX0pKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTsgcmVzb2x2ZShudWxsKTsgfSwgMTAwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9LCAodGFicykgPT4ge1xuICAgICAgaWYgKCF0YWJzWzBdPy5pZCkgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHBnKHBheWxvYWQpLCAocjogUikgPT4gcmVzb2x2ZShyKSk7XG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBzZW5kVG9CZyA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQmcpOiBQcm9taXNlPFIgfCBudWxsPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHsgcmV0dXJuIChhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShwZyhwYXlsb2FkKSkpIGFzIFI7IH1cbiAgICBjYXRjaCAoZSkgeyByZXR1cm4ge2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBhcyB1bmtub3duIGFzIFI7IH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgUmVjZWl2aW5nIGZyb20gY29udGVudCBzY3JpcHQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIERlZmVuc2l2ZSByaW5nLWJ1ZmZlciBkZWR1cGU6IGV2ZW4gdGhvdWdoIHdlIG5vdyB1c2Ugb25seSBvbmUgY2hhbm5lbCxcbiAgLy8gYW55IG1lc3NhZ2UgdGhhdCBzb21laG93IGFycml2ZXMgdHdpY2Ugd2l0aGluIH4yIHNlY29uZHMgaXMgaWdub3JlZC5cbiAgY29uc3QgcmVjZW50TWlkczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgUkVDRU5UX01JRF9DQVAgPSA2NDtcbiAgY29uc3Qgb25Dc01lc3NhZ2UgPSAobXNnOiBQZ0VudmVsb3BlPENzVG9QYW5lbD4pOiB2b2lkID0+IHtcbiAgICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuO1xuICAgIGlmIChtc2cuX19taWQpIHtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmluY2x1ZGVzKG1zZy5fX21pZCkpIHJldHVybjtcbiAgICAgIHJlY2VudE1pZHMucHVzaChtc2cuX19taWQpO1xuICAgICAgaWYgKHJlY2VudE1pZHMubGVuZ3RoID4gUkVDRU5UX01JRF9DQVApIHJlY2VudE1pZHMuc2hpZnQoKTtcbiAgICB9XG4gICAgc3dpdGNoIChtc2cua2luZCkge1xuICAgICAgY2FzZSAnY2FwdHVyZSc6IG9uQ2FwdHVyZShtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlcic6IG9uSG92ZXIobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXItZW5kJzogb25Ib3ZlckVuZCgpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWFkZCc6IG9uUGVuZGluZ0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWNsZWFyJzogb25QZW5kaW5nQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZmVlZGJhY2stYWRkJzogb25GZWVkYmFja0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwcmVmZXJlbmNlLWNoYW5nZSc6IG9uUHJlZmVyZW5jZUNoYW5nZShtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnfT4pOyByZXR1cm47XG4gICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUHJlZmVyZW5jZUNoYW5nZSA9ICh7cmVhc29uLCBwYWdlfToge3JlYXNvbjogc3RyaW5nOyBwYWdlOiBhbnl9KTogdm9pZCA9PiB7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2U/LnVybCA/PyBsaXZlVGFiVXJsO1xuICAgIGxpdmVUYWJQYXRoID0gbGl2ZVRhYlVybCA/IHBhdGhPZihsaXZlVGFiVXJsKSA6IGxpdmVUYWJQYXRoO1xuICAgIC8vIFBhZ2Ugcm93cyBhcmUgY2FwdHVyZSBoZWFkZXJzLCBub3QgYSB0YWIvcGFnZSB0ZWxlbWV0cnkgZmVlZC4gVGhlIG5leHRcbiAgICAvLyBzZWxlY3RvciBjYXB0dXJlIGZyb20gdGhpcyBwYWdlIHdpbGwgY2FycnkgdGhlIG5ldyB2aWV3cG9ydC9zdGF0ZSBhbmRcbiAgICAvLyBpbnNlcnQgYSBwYWdlIGhlYWRlciBvbmx5IGlmIG5lZWRlZC5cbiAgICBzZXRTdGF0dXMoYCR7cmVhc29ufSBjaGFuZ2VkYCwge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuXG4gIGNvbnN0IG9uRmVlZGJhY2tBZGQgPSAoe3NlbGVjdG9yLCB0ZXh0LCB1cmwsIHBhcmVudFVpZH06IHtzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfSk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAvLyAgIDEuIHBhcmVudFVpZCDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IHN1cHBsaWVkIGEgc3RhYmxlIHVpZCAodGhlXG4gICAgLy8gICAgICBzdHJvbmdlc3QgbWF0Y2g7IHN1cnZpdmVzIHNlbGVjdG9yIGNoYW5nZXMsIHNpYmxpbmdcbiAgICAvLyAgICAgIGNvbGxpc2lvbnMsIG11bHRpcGxlIGNhcHR1cmVzIG9mIHRoZSBzYW1lIGVsZW1lbnQpLlxuICAgIC8vICAgMi4gc2VsZWN0b3IgKyB1cmwg4oCUIGNvbXBvc2l0ZSBrZXk7IHByZXZlbnRzIGNyb3NzLXBhZ2VcbiAgICAvLyAgICAgIGNvbnRhbWluYXRpb24gd2hlbiB0aGUgc2FtZSBzZWxlY3RvciBleGlzdHMgb24gbXVsdGlwbGUgVVJMcy5cbiAgICAvLyAgIDMuIHNlbGVjdG9yICsgbGl2ZVRhYlVybCDigJQgZmFsbGJhY2sgd2hlbiB0aGUgbWVzc2FnZSBkaWRuJ3RcbiAgICAvLyAgICAgIGNhcnJ5IGFuIGV4cGxpY2l0IHVybCAob2xkZXIgY29udGVudC1zY3JpcHQgbWVzc2FnZXMpLlxuICAgIGxldCBpZHggPSAtMTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnVpZCA9PT0gcGFyZW50VWlkKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnN0IHdhbnRVcmwgPSB1cmwgPz8gbGl2ZVRhYlVybCA/PyBudWxsO1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PlxuICAgICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcidcbiAgICAgICAgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3JcbiAgICAgICAgJiYgKCF3YW50VXJsIHx8IG0uZW50cnkudXJsID09PSB3YW50VXJsKSk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnb25GZWVkYmFja0FkZDogbm8gcGFyZW50IGZvdW5kJywge3NlbGVjdG9yLCB1cmwsIHBhcmVudFVpZH0pO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGxvc3QgaXRzIHBhcmVudCDigJQgY2hlY2sgdGhlIGFjdGl2ZSBjYXB0dXJlJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHBhcmVudE1zZyA9IG1lc3NhZ2VzW2lkeF0gYXMgU2VsZWN0b3JNZXNzYWdlO1xuICAgIGxldCBpbnNlcnRBdCA9IGlkeCArIDE7XG4gICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIG5ldyBmZWVkYmFjayByb3cgc28gdGhlIGV4cG9ydCBjYXJyaWVzXG4gICAgLy8gdGhlIEZLIGxpbmsgZXhwbGljaXRseSAobm90IGp1c3QgYnkgY2FwdHVyZS1hZGphY2VuY3kpLlxuICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICBwYXJlbnRVaWQ6IHBhcmVudE1zZy5lbnRyeS51aWQsXG4gICAgfSk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnQ29tbWVudCBhZGRlZCBmcm9tIHBhZ2UnKTtcbiAgICAvLyBFdmVyeSBmZWVkYmFjayBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LiBJZiB0aGUgcGFyZW50XG4gICAgLy8gY2FwdHVyZSBkaWRuJ3QgZ2V0IG9uZSAoYXV0b1NjcmVlbnNob3Qgb2ZmLCBza2lwU2NyZWVuc2hvdEhvc3RzXG4gICAgLy8gaGl0LCBuZXR3b3JrIGdsaXRjaCksIHJlLWZpcmUgbm93LlxuICAgIGlmICghcGFyZW50TXNnLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudE1zZyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUGVuZGluZ0FkZCA9ICh7ZW50cnl9OiB7ZW50cnk6IEVudHJ5fSk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkucHVzaChlbnRyeSk7IHJlbmRlcigpOyB9O1xuICBjb25zdCBvblBlbmRpbmdDbGVhciA9ICgpOiB2b2lkID0+IHsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyB9O1xuXG4gIGNvbnN0IGZpbmREdXBsaWNhdGUgPSAoc2VsZWN0b3I6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT5cbiAgICBtZXNzYWdlcy5maW5kKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT5cbiAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvciAmJiAoIXVybCB8fCBtLmVudHJ5LnVybCA9PT0gdXJsKSk7XG5cbiAgLy8gRmluZCBhbiBleGlzdGluZyBjYXB0dXJlIGZvciB0aGUgYWN0aXZlIHRhYiArIHNlbGVjdG9yLiBDcm9zcy1wYWdlXG4gIC8vIGNvbnRhbWluYXRpb24gcHJldmVudGlvbiAoc2VlIHR5cGVzLnRzIGZlZWRiYWNrLWFkZCBkb2NzdHJpbmcpOlxuICAvLyBhIHNlbGVjdG9yIGFsb25lIGlzIE5PVCBhIHN0YWJsZSBpZGVudGl0eSDigJQgYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gXG4gIC8vIGV4aXN0cyBvbiBldmVyeSBwYWdlOyBgYnV0dG9uYCBpcyBldmVyeXdoZXJlLiBTdHJvbmcgaWRlbnRpdHkgaXNcbiAgLy8gKHNlbGVjdG9yICsgdXJsKS4gUmV0dXJucyB0aGUgbW9zdCByZWNlbnQgbWF0Y2ggc28gcmUtaG92ZXJpbmcgYW5cbiAgLy8gYWxyZWFkeS1jYXB0dXJlZCBlbGVtZW50IHJlc29sdmVzIGNvbnNpc3RlbnRseS5cbiAgY29uc3QgZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZSA9IChzZWxlY3Rvcjogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBjb25zdCB1cmwgPSBsaXZlVGFiVXJsO1xuICAgIC8vIFdhbGsgYmFja3dhcmRzIHNvIHRoZSBtb3N0IHJlY2VudCBtYXRjaGluZyBjYXB0dXJlIHdpbnMgd2hlbiBhXG4gICAgLy8gc2VsZWN0b3IgbGVnaXRpbWF0ZWx5IGhhcyBtdWx0aXBsZSBjYXB0dXJlcyBvbiB0aGUgc2FtZSBwYWdlXG4gICAgLy8gKGUuZy4sIHRoZSB1c2VyIHJlLWNhcHR1cmVkIHRoZSBzYW1lIGVsZW1lbnQgYWZ0ZXIgZWRpdHMpLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSBjb250aW51ZTtcbiAgICAgIGlmICh1cmwgJiYgbS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBjYW5vbmljYWxFbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgdGFnOiBlLnRhZywgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHRleHQ6IGUudGV4dCwgcm9sZTogZS5yb2xlLFxuICAgIGF0dHJzOiBlLmF0dHJzLCBjbGFzc2VzOiBlLmNsYXNzZXMsXG4gICAgcmVjdDogZS5yZWN0LCBvdXRlckhUTUw6IGUub3V0ZXJIVE1MLFxuICAgIHN0eWxlczogZS5zdHlsZXMsIG1hdGNoZWRSdWxlczogZS5tYXRjaGVkUnVsZXMsXG4gIH0pO1xuXG4gIGNvbnN0IG9uQ2FwdHVyZSA9ICh7ZW50cnksIHBhZ2UsIGdyb3VwZWR9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdjYXB0dXJlJ30+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFlbnRyeSB8fCAhcGFnZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2UudXJsO1xuICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKHBhZ2UudXJsKTtcbiAgICBpZiAoZ3JvdXBlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgICAgZ3JvdXAucHVzaChlbnRyeSk7XG4gICAgICAgICAgbS5lbnRyeS5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7IGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgICAgLy8gRmlyZSBhIGdyb3VwIHNob3QgdXNpbmcgdGhlIGhlYWQgKyBtZW1iZXJzLiBUaGUgaGVhZCdzIHNlbGVjdG9yXG4gICAgICAgICAgLy8gaXMgbS5lbnRyeS5zZWxlY3RvcjsgbWVtYmVycycgc2VsZWN0b3JzIGFyZSBpbiB0aGUgZnJlc2hseVxuICAgICAgICAgIC8vIG11dGF0ZWQgZ3JvdXAgYXJyYXkuXG4gICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW20uZW50cnkuc2VsZWN0b3IsIC4uLihtLmVudHJ5Lmdyb3VwID8/IFtdKS5tYXAoKGcpID0+IGcuc2VsZWN0b3IpXTtcbiAgICAgICAgICB2b2lkIGZpcmVHcm91cFNob3QobSwgc2VsZWN0b3JzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRHVwZSBkZXRlY3Rpb24uIENyb3NzLWNvbnRhbWluYXRpb24gZml4OiBhIChzZWxlY3RvciwgdXJsKSBtYXRjaFxuICAgIC8vIGlzIE5FQ0VTU0FSWSBidXQgbm90IFNVRkZJQ0lFTlQg4oCUIHR3byBzaWJsaW5nIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgLy8gc2FtZSB0ZXN0SWQgLyBzYW1lIHJvbGUvYXJpYSBzZWxlY3RvciBsaXZlIG9uIHRoZSBzYW1lIFVSTCBidXRcbiAgICAvLyBhcmUgZGlmZmVyZW50IGNhcHR1cmVzLiBDb21wYXJlIHRoZSBjYW5vbmljYWwtZW50cnkgaGFzaCAod2hpY2hcbiAgICAvLyBpbmNsdWRlcyByZWN0LCB0ZXh0LCBvdXRlckhUTUwsIGV0Yy4pIGJlZm9yZSB0cmVhdGluZyB0aGUgbmV3XG4gICAgLy8gY2FwdHVyZSBhcyBhIHJlZnJlc2ggb2YgdGhlIG9sZCBvbmUuIFdoZW4gdGhlIGhhc2ggZGlmZmVycywgd2VcbiAgICAvLyBrZWVwIEJPVEggY2FwdHVyZXMgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcuXG4gICAgY29uc3QgZHVwZSA9IGZpbmREdXBsaWNhdGUoZW50cnkuc2VsZWN0b3IsIGVudHJ5LnVybCk7XG4gICAgaWYgKGR1cGUpIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IGNhbm9uaWNhbEVudHJ5KGR1cGUuZW50cnkpO1xuICAgICAgY29uc3QgYWZ0ZXIgPSBjYW5vbmljYWxFbnRyeShlbnRyeSk7XG4gICAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBIYXNoZXMgZGlmZmVyLiBUd28gY2FzZXM6XG4gICAgICAvLyAgIChhKSBTYW1lIGVsZW1lbnQgcmUtY2FwdHVyZWQgYWZ0ZXIgY29udGVudCBjaGFuZ2Ug4oCUIHRoZSByZWN0XG4gICAgICAvLyAgICAgICBzdGF5cyBwdXQgKHdpdGhpbiBhIGZldyBweCksIGJ1dCB0ZXh0L291dGVySFRNTCBtb3ZlZC5cbiAgICAgIC8vICAgICAgIFRyZWF0IGFzIGEgcmVmcmVzaC5cbiAgICAgIC8vICAgKGIpIERpZmZlcmVudCBlbGVtZW50IHRoYXQgaGFwcGVucyB0byBzaGFyZSBhIHNlbGVjdG9yIOKAlCB0aGVcbiAgICAgIC8vICAgICAgIHJlY3QgaXMgaW4gYSBkaWZmZXJlbnQgcG9zaXRpb24uIFRyZWF0IGFzIGEgbmV3IGNhcHR1cmUuXG4gICAgICAvLyBXZSBkaXNjcmltaW5hdGUgYnkgcmVjdCBvdmVybGFwOiBpZiBib3RoIHJlY3RzIGV4aXN0IGFuZCB0aGVpclxuICAgICAgLy8gY2VudGVycyBhcmUgd2l0aGluIDhweCBvbiBib3RoIGF4ZXMsIHJlZnJlc2g7IG90aGVyd2lzZSBrZWVwXG4gICAgICAvLyBib3RoLlxuICAgICAgY29uc3QgcjEgPSBkdXBlLmVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCByMiA9IGVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCBzYW1lRWxlbWVudCA9IHIxICYmIHIyXG4gICAgICAgICYmIE1hdGguYWJzKChyMS54ICsgcjEudyAvIDIpIC0gKHIyLnggKyByMi53IC8gMikpIDw9IDhcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnkgKyByMS5oIC8gMikgLSAocjIueSArIHIyLmggLyAyKSkgPD0gODtcbiAgICAgIGlmIChzYW1lRWxlbWVudCkge1xuICAgICAgICBkZWxldGUgZHVwZS5kdXBlUGVuZGluZztcbiAgICAgICAgZHVwZS5lbnRyeSA9IGVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFVwZGF0ZWQgIyR7ZHVwZS5lbnRyeS5ufWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlmZmVyZW50IGVsZW1lbnQgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciDihpIgZmFsbCB0aHJvdWdoIGFuZFxuICAgICAgLy8gZW1pdCBhcyBhIG5ldyBjYXB0dXJlLiBUaGUgYWdlbnQgcmVhZGluZyB0aGUgZXhwb3J0IHNlZXMgYm90aFxuICAgICAgLy8gcm93cyB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIGJ1dCBkaWZmZXJlbnQgdWlkcyArIHJlY3RzLlxuICAgIH1cbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCB0aGUgc2Vzc2lvbiBGSyBzbyB0aGUgY29uc3VtZXIgY2FuIGpvaW4gZW50cmllcyB0byB0aGVpclxuICAgIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLlxuICAgIGlmIChzZXNzaW9uSWQpIGVudHJ5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICBjb25zdCBuZXdNc2c6IFNlbGVjdG9yTWVzc2FnZSA9IHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzLCBlbnRyeX07XG4gICAgLy8gUGFnZSByb3dzIGV4aXN0IG9ubHkgYXMgaGVhZGVycyBmb3IgY2FwdHVyZWQgc2VsZWN0b3JzLiBEbyBub3QgY3JlYXRlXG4gICAgLy8gdGhlbSBmcm9tIHRhYiBhY3RpdmF0aW9uLCB2YWxpZGF0aW9uLCBvciBwcmVmZXJlbmNlIGNoYW5nZXM7IGluc2VydCBvbmVcbiAgICAvLyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGZpcnN0IHNlbGVjdG9yIG9mIGEgbmV3IHBhZ2UgYmxvY2suXG4gICAgbGV0IHByZXZpb3VzUGFnZTogUGFnZU1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gcG9zaXRpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJykgeyBwcmV2aW91c1BhZ2UgPSBtOyBicmVhazsgfVxuICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzUGFnZSB8fCBwcmV2aW91c1BhZ2UudXJsICE9PSBwYWdlLnVybCkge1xuICAgICAgY29uc3QgcGFnZU1zZzogUGFnZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHVybDogcGFnZS51cmwsIHRpdGxlOiBwYWdlLnRpdGxlLCB2aWV3cG9ydDogcGFnZS52aWV3cG9ydCwgdG9rZW5zOiBwYWdlLnRva2VucyxcbiAgICAgICAgdXNlckFnZW50OiBwYWdlLnVzZXJBZ2VudCwgbGFuZzogcGFnZS5sYW5nLFxuICAgICAgICBnaXRDb250ZXh0OiAocGFnZSBhcyBhbnkpLmdpdENvbnRleHQsXG4gICAgICAgIHJvdXRlOiAocGFnZSBhcyBhbnkpLnJvdXRlLFxuICAgICAgICBzdGF0ZTogKHBhZ2UgYXMgYW55KS5zdGF0ZSxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgfTtcbiAgICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgcGFnZU1zZyk7XG4gICAgICBwb3NpdGlvbisrO1xuICAgIH1cbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIG5ld01zZyk7XG4gICAgcGVyc2lzdCgpO1xuICAgIC8vIEludGVudGlvbmFsbHkgTk8gc2V0TGFzdEFjdGl2ZShlbnRyeS5zZWxlY3RvcikgaGVyZSDigJQgdGhlIHVzZXIgYXNrZWRcbiAgICAvLyBmb3IgZnJlc2ggY2FwdHVyZXMgdG8gc3RheSB1bi1oaWdobGlnaHRlZCBpbiB0aGUgc2lkZWJhci4gVGhlIHN0aWNreVxuICAgIC8vIHJpbmcgKyBsYXN0LWFjdGl2ZSBvdXRsaW5lIG5vdyBvbmx5IGdldCBhcHBsaWVkIG9uIGV4cGxpY2l0XG4gICAgLy8gaG92ZXIvY2xpY2sgb2YgdGhlIHNpZGViYXIgYnViYmxlIChhbmQgdGhlIHBhZ2Utc2lkZSBmbGFzaCBmcm9tXG4gICAgLy8gY2FwdHVyZUVudHJ5IHN0aWxsIGNvbmZpcm1zIHRoZSBjYXB0dXJlIHZpc3VhbGx5IG9uIHRoZSBwYWdlKS5cbiAgICByZW5kZXIoKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KG5ld01zZyk7XG4gICAgdm9pZCBmaXJlUGFnZVNob3RJZk5lZWRlZChuZXdNc2cpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTY3JlZW5zaG90IHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRmlyZSB0aGUgcGVyLWVsZW1lbnQgc2hvdCwgYXR0YWNoIHRoZSByZXR1cm5lZCBmaWxlbmFtZSArIGRhdGFVcmwgb250b1xuICAvLyB0aGUgZW50cnksIGFuZCBwZXJzaXN0LiBzaG91bGRTa2lwU2NyZWVuc2hvdCBiYWlscyBvbiBob3N0cyBpbiB0aGVcbiAgLy8gdXNlcidzIHNraXAgbGlzdDsgYXV0b1NjcmVlbnNob3Q9ZmFsc2UgYmFpbHMgZ2xvYmFsbHkuXG4gIGNvbnN0IGZpcmVFbGVtZW50U2hvdCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCBza2lwcGVkOiBhdXRvU2NyZWVuc2hvdD1mYWxzZScpO1xuICAgICAgLy8gQnVnICMyOiB0ZWxsIHRoZSBleHBvcnQgd2h5IHRoZSBzaG90IGlzIG1pc3NpbmcuXG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ2F1dG9TY3JlZW5zaG90T2ZmJ307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGhvc3Qgb24gc2tpcCBsaXN0JywgbXNnLmVudHJ5LnVybCk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ3NraXBTY3JlZW5zaG90SG9zdHMnfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IOKGkicsIG1zZy5lbnRyeS5zZWxlY3Rvcik7XG4gICAgLy8gU1cgY29sZC1zdGFydCByYWNlOiB0aGUgRklSU1QgY2FwdHVyZSBpbiBhIHNlc3Npb24gb2Z0ZW4gbG9zZXMgaXRzXG4gICAgLy8gZmlyc3QgbWVzc2FnZSBiZWNhdXNlIHRoZSBiZyB3b3JrZXIgaXMgc3RpbGwgc3RhcnRpbmcuIFJldHJ5IG9uY2VcbiAgICAvLyBhZnRlciBhIHNob3J0IGRlbGF5IGlmIHRoZSBmaXJzdCBjYWxsIGNvbWVzIGJhY2sgbnVsbC9lbXB0eS5cbiAgICBsZXQgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5IHx8ICghcmVwbHkub2sgJiYgIXJlcGx5LmVycm9yKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyc3Qgc2NyZWVuc2hvdCByZXBseSB3YXMgZW1wdHk7IHJldHJ5aW5nIGFmdGVyIDIwMG1zIChTVyBjb2xkLXN0YXJ0KScpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMjAwKSk7XG4gICAgICByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHJlcGx5OicsIHJlcGx5KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHtcbiAgICAgIHNldFN0YXR1cyhgU2NyZWVuc2hvdCBmYWlsZWQ6ICR7cmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICB1bmF2YWlsYWJsZVJlYXNvbjogcmVwbHk/LmVycm9yID8/ICdjYXB0dXJlRmFpbGVkJyxcbiAgICAgIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFN1Y2Nlc3NmdWwgcmV0cnkg4oCUIHN0cmlwIGFueSBwcmlvciB1bmF2YWlsYWJsZVJlYXNvbiBzaW5jZSB3ZSBub3dcbiAgICAvLyBoYXZlIGEgcmVhbCBzaG90LlxuICAgIGRlbGV0ZSBtc2cuZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZWxlbWVudDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAuLi4ocmVwbHkuY3JvcCA/IHtjcm9wOiByZXBseS5jcm9wfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaXJlIHRoZSBncm91cCBzaG90ICh1bmlvbiBiYm94IG9mIGhlYWQgKyBhbGwgbWVtYmVycykgYW5kIHN0YXNoIHRoZVxuICAvLyBmaWxlbmFtZSBvbiB0aGUgaGVhZC1vZi1ncm91cCBlbnRyeS5cbiAgY29uc3QgZmlyZUdyb3VwU2hvdCA9IGFzeW5jIChoZWFkOiBTZWxlY3Rvck1lc3NhZ2UsIHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KGhlYWQuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1ncm91cCcsIHNlbGVjdG9ycywgbjogaGVhZC5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIGhlYWQuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihoZWFkLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZ3JvdXA6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkgeyBzaG90c0Z1bGwuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTsgcGVyc2lzdFNob3RzRnVsbCgpOyB9XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIFBhZ2UtbGV2ZWwgc2hvdCBvbmNlIHBlciAod29ya3NwYWNlLCBwYWdlLXVybCwgZGF5KS4gU3Vic2VxdWVudCBjYXB0dXJlc1xuICAvLyBvbiB0aGUgc2FtZSBwYWdlIHJldXNlIHRoZSBzYW1lIG9uLWRpc2sgZmlsZSBwYXRoLlxuICBjb25zdCBmaXJlUGFnZVNob3RJZk5lZWRlZCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICAvLyBQZXItY2FwdHVyZSBwYWdlLXNob3QgbW9kZSAowqc0LjUpOiB3aGVuIGVuYWJsZWQsIHNraXAgdGhlXG4gICAgLy8gcGVyLSh3b3Jrc3BhY2UsIHVybCkgZGVkdXBlIGFuZCBmaXJlIGEgZnJlc2ggcGFnZSBzaG90IGV2ZXJ5IHRpbWUuXG4gICAgLy8gVXNlZnVsIHdoZW4gdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzIChtb2RhbCBvcGVucyxcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3csIGV0Yy4pIGFuZCB0aGUgdXNlciB3YW50cyB0byBzZWUgdGhlIHdob2xlIHBhZ2UgYXRcbiAgICAvLyBlYWNoIHN0ZXAuIENvc3RzIG9uZSBmdWxsLXBhZ2UgUE5HIHBlciBjYXB0dXJlLCBzbyBkZWZhdWx0IG9mZi5cbiAgICBpZiAoIXByZWZzLnBhZ2VTaG90UGVyQ2FwdHVyZSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFnZVNob3RLZXkobXNnLmVudHJ5LnVybCk7XG4gICAgICBpZiAocGFnZVNob3RzRmlyZWQuaGFzKGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kRXhpc3RpbmdQYWdlU2hvdChtc2cuZW50cnkudXJsKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICAgICAgcGFnZTogZXhpc3RpbmcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGFnZVNob3RzRmlyZWQuYWRkKGtleSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1wYWdlJywgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgLy8gQXBwbHkgdG8gVEhJUyBlbnRyeSBhbmQgdG8gYW55IG90aGVyIGVudHJpZXMgYWxyZWFkeSBjYXB0dXJlZCBvbiB0aGVcbiAgICAvLyBzYW1lIFVSTCB0b2RheSAoc28gdGhlIHBhZ2Utc2hvdCBhcHBlYXJzIHVuaWZvcm1seSkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gbXNnLmVudHJ5LnVybCkgY29udGludWU7XG4gICAgICBtLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICBwYWdlOiByZXBseS5maWxlbmFtZSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFN0YXNoIHRoZSBmdWxsIFBORyBzbyB0aGUgd29ya3NwYWNlIGFyY2hpdmUgY2FuIGJ1bmRsZSBpdC4gS2V5ZWRcbiAgICAvLyBieSBVUkwgc2luY2UgcGFnZSBzaG90cyBhcmUgcGFnZS1zY29wZWQsIG5vdCBzZWxlY3Rvci1zY29wZWQuXG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KCdwYWdlOjonICsgbXNnLmVudHJ5LnVybCwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmluZCBhbnkgc2VsZWN0b3IgZW50cnkgb24gdGhpcyBVUkwgdGhhdCBhbHJlYWR5IGhhcyBhIGBwYWdlYCBzaG90XG4gIC8vIHJlY29yZGVkIOKAlCB1c2VkIHNvIHRoYXQgcmV0cm9hY3RpdmUgY2FwdHVyZXMgaW5oZXJpdCB0aGUgZXhpc3RpbmcgUE5HXG4gIC8vIHBhdGggaW5zdGVhZCBvZiByZWZpcmluZy5cbiAgY29uc3QgZmluZEV4aXN0aW5nUGFnZVNob3QgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgcmV0dXJuIG0uZW50cnkuc2NyZWVuc2hvdC5wYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBvbkhvdmVyID0gKHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTogdm9pZCA9PiB7XG4gICAgc2V0U3RhdHVzKGBBbHQtaG92ZXIgwrcgJHtsYWJlbH1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgLy8gSWRlbnRpdHkgaXMgKHNlbGVjdG9yLCB1cmwpLiBTYW1lIHNlbGVjdG9yIG9uIHR3byBkaWZmZXJlbnQgVVJMc1xuICAgIC8vIGlzIHR3byBkaWZmZXJlbnQgY2FwdHVyZXM7IHRoZSBwcmV2aW91cyBzZWxlY3Rvci1vbmx5IGxvb2t1cFxuICAgIC8vIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi4gUHJlZmVyIHNhbWUtVVJMICtcbiAgICAvLyBzYW1lLXNlbGVjdG9yIGFzIHRoZSBzdHJvbmdlc3QgbWF0Y2guXG4gICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSBzY3JvbGxNZXNzYWdlSW50b1ZpZXcoZXhpc3RpbmcuaWQpO1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihleGlzdGluZy5pZCk7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7dWlkOiBleGlzdGluZy5lbnRyeS51aWQsIG46IGV4aXN0aW5nLmVudHJ5Lm4sIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFja319KTtcbiAgICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXIoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBTFdBWVMgc2hvdyB0aGUgY29tbWVudCBib3gsIGV2ZW4gZm9yIHVuY2FwdHVyZWQgZWxlbWVudHMuIE9uIHN1Ym1pdFxuICAgICAgLy8gdGhlIGNvbnRlbnQgc2NyaXB0IHdpbGwgY2FwdHVyZSB0aGUgZWxlbWVudCBmaXJzdCwgdGhlbiBhdHRhY2ggdGhlXG4gICAgICAvLyBjb21tZW50IOKAlCB0dXJuaW5nIGhvdmVyLWNvbW1lbnQgaW50byBhIGNhcHR1cmUrY29tbWVudCBzaG9ydGN1dC5cbiAgICAgIHBoYW50b21UYXJnZXQgPSB7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3Q6IHJlY3QgYXMgdW5rbm93biBhcyBET01SZWN0fTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHtjYXB0dXJlZDogZmFsc2UsIGZlZWRiYWNrOiBbXX19KTtcbiAgICAgIHJlbmRlclBoYW50b20oKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudD8uc3RhcnRzV2l0aCgnQWx0LWhvdmVyJykpIHN0YXR1cy50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXJQaGFudG9tKCk7IH1cbiAgICAvLyBObyBhbm5vdGF0aW9uLWNsZWFyIGhlcmUg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBrZWVwcyB0aGUgYm94IG9wZW4gc28gdGhlXG4gICAgLy8gdXNlciBjYW4gbW91c2UgdG8gaXQgYW5kIHR5cGUuIE91dHNpZGUtY2xpY2sgLyBFc2MgZGlzbWlzcyBpdC5cbiAgfTtcblxuICBjb25zdCBjb2xsZWN0RmVlZGJhY2tBZnRlciA9IChzZWxlY3RvcklkOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKCFmb3VuZCkgeyBpZiAobS5pZCA9PT0gc2VsZWN0b3JJZCkgZm91bmQgPSB0cnVlOyBjb250aW51ZTsgfVxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyB8fCBtLnR5cGUgPT09ICdwYWdlJykgYnJlYWs7XG4gICAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSBvdXQucHVzaChtLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IGNlbnRlckVsZW1lbnRJbkxpc3QgPSAoZWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgbGlzdFJlY3QgPSBsaXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRhcmdldCA9IGxpc3Quc2Nyb2xsVG9wICsgZWxSZWN0LnRvcCAtIGxpc3RSZWN0LnRvcCAtIChsaXN0LmNsaWVudEhlaWdodCAvIDIpICsgKGVsUmVjdC5oZWlnaHQgLyAyKTtcbiAgICBsaXN0LnNjcm9sbFRvKHt0b3A6IE1hdGgubWF4KDAsIHRhcmdldCksIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICB9O1xuXG4gIGNvbnN0IHNjcm9sbE1lc3NhZ2VJbnRvVmlldyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGNlbnRlckVsZW1lbnRJbkxpc3QoZWwpO1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoLWludG8tdmlldycpO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gtaW50by12aWV3Jyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0aWNreSBoaWdobGlnaHQgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2V0TGFzdEFjdGl2ZSA9IChzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhcm1TdGlja3lFeHBpcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBzdGlja3lUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcGFuZWxIb3ZlcmVkKSB7XG4gICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yLmxhc3QtYWN0aXZlJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtYWN0aXZlJyk7XG4gICAgICB9IGVsc2UgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSwgU1RJQ0tZX1RUTF9NUyk7XG4gIH07XG5cbiAgLy8gRmFzdCBzdGlja3ktY2xlYXI6IHdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBwYW5lbCwgZmlyZVxuICAvLyBzdGlja3ktY2xlYXIgYWZ0ZXIgYSAzMDAgbXMgZ3JhY2Ugd2luZG93LiBQcmlvciBiZWhhdmlvciB3YWl0ZWQgdGhlXG4gIC8vIGZ1bGwgU1RJQ0tZX1RUTF9NUyAofjUgcykgd2hpY2ggZmVsdCBsaWtlIHRoZSBwYWdlLXNpZGUgaGlnaGxpZ2h0XG4gIC8vIFwiZG9lc24ndCBnbyBhd2F5IGV2ZW4gYWZ0ZXIgSSB1bmhvdmVyXCIuIDMwMCBtcyBpcyBzaG9ydCBlbm91Z2ggdG9cbiAgLy8gZmVlbCByZXNwb25zaXZlIGJ1dCBsb25nIGVub3VnaCB0aGF0IGEgcXVpY2sgcmVwb3NpdGlvbiAoZS5nLlxuICAvLyBhY2NpZGVudGFsbHkgY3Jvc3NpbmcgdGhlIHNlYW0pIGRvZXNuJ3Qga2lsbCB0aGUgcmluZyBtaWQtZmxpZ2h0LlxuICBsZXQgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSB0cnVlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSB7IGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTsgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7IH1cbiAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgfSk7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpO1xuICAgIHN0aWNreUNsZWFyR3JhY2UgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgLy8gQWxzbyBkcm9wIG91ciBvd24gZnJvbS1wYW5lbCArIG11bHRpIHJpbmdzIGluIGNhc2UgdGhleSBsZWFrZWQuXG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGVpciBtb3VzZSBpbnRvIHRoZSBwYW5lbCwgc3VwcHJlc3MgcGFnZS1zaWRlXG4gICAgLy8gYWx0LWhvdmVyIHN0YXRlIHNvIHRoZSBvcmFuZ2UgcmluZyBkb2Vzbid0IGtlZXAgZm9sbG93aW5nIHRoZSBjdXJzb3IuXG4gICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgUmVuZGVyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBORUFSX0JPVFRPTV9QWCA9IDgwO1xuICBjb25zdCB3YXNOZWFyQm90dG9tID0gKCk6IGJvb2xlYW4gPT5cbiAgICBsaXN0LnNjcm9sbEhlaWdodCAtIGxpc3Quc2Nyb2xsVG9wIC0gbGlzdC5jbGllbnRIZWlnaHQgPD0gTkVBUl9CT1RUT01fUFg7XG5cbiAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9IChtOiBQYW5lbE1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAvLyBNYXRjaCBhZ2FpbnN0IHRoZSBXSE9MRSBlbnRyeSAoc2VsZWN0b3IsIHRleHQsIGNsYXNzZXMsIGF0dHJzLFxuICAgICAgLy8gb3V0ZXJIVE1MLCBzdHlsZXMsIGV0Yy4pIHNvIHNlYXJjaCBoaXRzIGFueXRoaW5nIHZpc2libGUgaW4gdGhlXG4gICAgICAvLyBib2R5LWpzb24uIFN0cmluZ2lmeWluZyBvbmNlIGlzIGZpbmUg4oCUIHRoZSBjb3N0IGlzIHRpbnkgdnMgcmVuZGVyLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgfVxuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIChtLnVybCArICcgJyArIChtLnRpdGxlID8/ICcnKSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSBidWJibGUncyBib2R5LWpzb24gKG9yIG91dGVySFRNTCkgY29udGFpbnMgdGhlIHNlYXJjaCDigJRcbiAgLy8gdGVsbHMgcmVuZGVyU2VsZWN0b3IgdG8gYXV0by1leHBhbmQgc28gdGhlIHVzZXIgc2VlcyB0aGUgaGlnaGxpZ2h0ZWQgaGl0LlxuICBjb25zdCBib2R5TWF0Y2hlc1NlYXJjaCA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG0uZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0UmFpbCA9IChiZWZvcmVJZDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnaW5zZXJ0LXJhaWwnO1xuICAgIGRpdi5kYXRhc2V0LmJlZm9yZUlkID0gYmVmb3JlSWQ7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50ID09PSBiZWZvcmVJZCkge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICBkaXYuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTsgcmVuZGVyKCk7IH0sXG4gICAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4gc2VuZElubGluZSh0ZXh0KSxcbiAgICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidG4uY2xhc3NOYW1lID0gJ2FkZC1idG4nO1xuICAgICAgYnRuLmRhdGFzZXQudGlwID0gJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZSc7XG4gICAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZScpO1xuICAgICAgYnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygncGx1cycsIDEyKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBiZWZvcmVJZDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlOyByZW5kZXIoKTsgfSk7XG4gICAgICBkaXYuYXBwZW5kKGJ0bik7XG4gICAgfVxuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgdHlwZSBJbmxpbmVDb21tZW50T3B0cyA9IHtcbiAgICBpbml0aWFsPzogc3RyaW5nO1xuICAgIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDtcbiAgICBvblN1Ym1pdD86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgYXV0b2ZvY3VzPzogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgYnVpbGRJbmxpbmVDb21tZW50ID0gKHtpbml0aWFsID0gJycsIG9uQ2FuY2VsLCBvblN1Ym1pdCwgYXV0b2ZvY3VzfTogSW5saW5lQ29tbWVudE9wdHMpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXAuY2xhc3NOYW1lID0gJ2lubGluZS1jb21tZW50JztcbiAgICBjb25zdCB0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgdGEudmFsdWUgPSBpbml0aWFsO1xuICAgIHRhLnJvd3MgPSAyO1xuICAgIHRhLnBsYWNlaG9sZGVyID0gJ0luc2VydCBhIGNvbW1lbnQgaGVyZSwgb3IgQWx0K0NsaWNrIHRvIGluc2VydCBhIGNhcHR1cmUnO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncm93JztcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIG1ldGEudGV4dENvbnRlbnQgPSAnMHcgwrcgMHQnO1xuICAgIC8vIEJvdGggU2F2ZSAvIENhbmNlbCBhcmUgdW5pZm9ybSBpY29uIGJ1dHRvbnMgKC5pY29uYnRuKS4gU2F2ZSB1c2VzIHRoZVxuICAgIC8vIHByaW1hcnkgYWNjZW50IHZhcmlhbnQgdmlhIC5wcmltYXJ5IHNvIGl0IHN0aWxsIHBvcHMsIGJ1dCBpdHMgd2lkdGhcbiAgICAvLyBtYXRjaGVzIENhbmNlbCBleGFjdGx5LlxuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIMK3IEVzYyc7XG4gICAgY2FuY2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgaW5saW5lIGNvbW1lbnQnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMjApO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uQ2FuY2VsPy4oKSk7XG4gICAgY29uc3Qgc2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbmQudHlwZSA9ICdidXR0b24nO1xuICAgIHNlbmQuY2xhc3NOYW1lID0gJ2ljb25idG4gcHJpbWFyeSc7XG4gICAgc2VuZC5kYXRhc2V0LnRpcCA9ICdTYXZlIMK3IEVudGVyJztcbiAgICBzZW5kLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdTYXZlIGlubGluZSBjb21tZW50Jyk7XG4gICAgc2VuZC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMjApO1xuICAgIGNvbnN0IHN1Ym1pdCA9ICgpOiB2b2lkID0+IG9uU3VibWl0Py4odGEudmFsdWUpO1xuICAgIHNlbmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXQpO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4geyBtZXRhLnRleHRDb250ZW50ID0gYCR7d29yZENvdW50KHRhLnZhbHVlKX13IMK3ICR7dG9rZW5Db3VudCh0YS52YWx1ZSl9dGA7IH0pO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBvbkNhbmNlbD8uKCk7XG4gICAgfSk7XG4gICAgcm93LmFwcGVuZChtZXRhLCBjYW5jZWwsIHNlbmQpO1xuICAgIHdyYXAuYXBwZW5kKHRhLCByb3cpO1xuICAgIGlmIChhdXRvZm9jdXMpIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0YS5mb2N1cygpKTtcbiAgICByZXR1cm4gd3JhcDtcbiAgfTtcblxuICBjb25zdCBzZW5kSW5saW5lID0gKHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRleHQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgIGlmICghdGV4dCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IGJlZm9yZUlkID0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQ7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGV0IHBvcyA9IGJlZm9yZUlkID8gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBiZWZvcmVJZCkgOiBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKHBvcyA8IDApIHBvcyA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAvLyBwYXJlbnRVaWQgcmVzb2x1dGlvbjogd2FsayBiYWNrIGZyb20gdGhlIGluc2VydCBwb3NpdGlvbiB0byB0aGVcbiAgICAvLyBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3Rvci4gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgdGhlIEZLLlxuICAgIGxldCBwSWR4ID0gcG9zIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfTtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zLCAwLCBmYik7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnSW5zZXJ0ZWQnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQaGFudG9tID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBoYW50b20nKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwaGFudG9tVGFyZ2V0KSByZXR1cm47XG4gICAgY29uc3QgcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwaC5jbGFzc05hbWUgPSAncGhhbnRvbSB2aXNpYmxlJztcbiAgICBwaC5pbm5lckhUTUwgPSBgPGNvZGU+JHtlc2NhcGVIdG1sKHBoYW50b21UYXJnZXQubGFiZWwpfTwvY29kZT5gO1xuICAgIGxpc3QuYXBwZW5kKHBoKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICAvLyBSZW9yZGVyIGEgZmxhdCBtZXNzYWdlIGxpc3Qgc28gc2VsZWN0b3JzIHdpdGhpbiBlYWNoIHBhZ2UtZGVsaW1pdGVkXG4gIC8vIGJsb2NrIGFyZSBzb3J0ZWQgYnkgdGhlaXIgdmlzdWFsIHJlY3QgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KS5cbiAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciAoY2FwdHVyZVxuICAvLyBhZGphY2VuY3kpIHNvIGVkaXRpbmcvdGhyZWFkaW5nIGJlaGF2aW9yIHN1cnZpdmVzIHRoZSBzb3J0LlxuICAvL1xuICAvLyBVc2VkIE9OTFkgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSAoYGJ1aWxkU2xpbWApLCBub3QgdGhlIHNpZGViYXJcbiAgLy8gcmVuZGVyLiBUaGUgc2lkZWJhciBrZWVwcyBtZXNzYWdlcyBpbiBpbnNlcnRpb24vY2FwdHVyZSBvcmRlciBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZW0gd2hlcmUgdGhleSBleHBlY3Q7IHRoZSBleHBvcnQgZ2V0cyB0aGUgYWdlbnQtXG4gIC8vIGZyaWVuZGx5IHJlYWRpbmctb3JkZXIgdHJlYXRtZW50LlxuICBjb25zdCByZW9yZGVyRm9yRXhwb3J0ID0gKG1zZ3M6IFBhbmVsTWVzc2FnZVtdKTogUGFuZWxNZXNzYWdlW10gPT4ge1xuICAgIHR5cGUgR3JvdXAgPSB7a2luZDogJ2dyb3VwJzsgc2VsOiBTZWxlY3Rvck1lc3NhZ2U7IHRyYWlsaW5nOiBGZWVkYmFja01lc3NhZ2VbXX07XG4gICAgdHlwZSBMb29zZSA9IHtraW5kOiAnbG9vc2UnOyBtOiBGZWVkYmFja01lc3NhZ2V9O1xuICAgIHR5cGUgU2xvdCA9IEdyb3VwIHwgTG9vc2UgfCB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX07XG4gICAgY29uc3Qgc2xvdHM6IFNsb3RbXSA9IFtdO1xuICAgIGxldCBjdXJHcm91cDogR3JvdXAgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBmbHVzaEdyb3VwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKGN1ckdyb3VwKSB7IHNsb3RzLnB1c2goY3VyR3JvdXApOyBjdXJHcm91cCA9IG51bGw7IH1cbiAgICB9O1xuICAgIGZvciAoY29uc3QgbSBvZiBtc2dzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBzbG90cy5wdXNoKHtraW5kOiAncGFnZScsIG19KTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgY3VyR3JvdXAgPSB7a2luZDogJ2dyb3VwJywgc2VsOiBtLCB0cmFpbGluZzogW119O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGN1ckdyb3VwKSBjdXJHcm91cC50cmFpbGluZy5wdXNoKG0pO1xuICAgICAgICBlbHNlIHNsb3RzLnB1c2goe2tpbmQ6ICdsb29zZScsIG19KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hHcm91cCgpO1xuICAgIGNvbnN0IG91dDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBsZXQgcnVuU3RhcnQgPSAwO1xuICAgIGNvbnN0IGZsdXNoUnVuID0gKGVuZDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXBSZWN0czogQXJyYXk8e2lkeDogbnVtYmVyOyB5OiBudW1iZXI7IHg6IG51bWJlcn0+ID0gW107XG4gICAgICBmb3IgKGxldCBpID0gcnVuU3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgciA9IHMuc2VsLmVudHJ5LnJlY3Q7XG4gICAgICAgICAgZ3JvdXBSZWN0cy5wdXNoKHtpZHg6IGksIHk6IHI/LnkgPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCB4OiByPy54ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWX0pO1xuICAgICAgICB9XG4gICAgICAgIGluZGljZXMucHVzaChpKTtcbiAgICAgIH1cbiAgICAgIGdyb3VwUmVjdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS55ICE9PSBiLnkpIHJldHVybiBhLnkgLSBiLnk7XG4gICAgICAgIHJldHVybiBhLnggLSBiLng7XG4gICAgICB9KTtcbiAgICAgIGxldCBnaSA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRJZHggPSBncm91cFJlY3RzW2dpKytdIS5pZHg7XG4gICAgICAgICAgY29uc3QgciA9IHNsb3RzW3JlcGxhY2VtZW50SWR4XSEgYXMgR3JvdXA7XG4gICAgICAgICAgb3V0LnB1c2goci5zZWwpO1xuICAgICAgICAgIGZvciAoY29uc3QgZiBvZiByLnRyYWlsaW5nKSBvdXQucHVzaChmKTtcbiAgICAgICAgfSBlbHNlIGlmIChzLmtpbmQgPT09ICdsb29zZScpIHtcbiAgICAgICAgICBvdXQucHVzaChzLm0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2xvdHNbaV0hLmtpbmQgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaFJ1bihpKTtcbiAgICAgICAgb3V0LnB1c2goKHNsb3RzW2ldIGFzIHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfSkubSk7XG4gICAgICAgIHJ1blN0YXJ0ID0gaSArIDE7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoUnVuKHNsb3RzLmxlbmd0aCk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBjb25zdCByZW5kZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc3RpY2tUb0JvdHRvbSA9IGxpc3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwIHx8IHdhc05lYXJCb3R0b20oKTtcbiAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgLy8gU3RhdHMgbnVtYmVyc1xuICAgIGxldCB0b3RhbFNlbGVjdG9ycyA9IDA7XG4gICAgbGV0IHRvdGFsQ29tbWVudHMgPSAwO1xuICAgIGxldCB0b3RhbFN0YWxlID0gMDtcbiAgICBjb25zdCBkaXN0aW5jdFBhZ2VzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIHRvdGFsU2VsZWN0b3JzKys7XG4gICAgICAgIGlmIChzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKSA9PT0gZmFsc2UpIHRvdGFsU3RhbGUrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB0b3RhbENvbW1lbnRzKys7XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBpZiAobWVzc2FnZXMuc29tZSgoeCkgPT4geC50eXBlID09PSAnc2VsZWN0b3InICYmIHguZW50cnkudXJsID09PSBtLnVybCkpIGRpc3RpbmN0UGFnZXMuYWRkKG0udXJsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInNlbGVjdG9yc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTZWxlY3RvcnMpO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJjb21tZW50c1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxDb21tZW50cyk7XG4gICAgY29uc3Qgc3RhbGVOdW0gPSBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic3RhbGVcIl0gLnN0YXQtbnVtJykhO1xuICAgIHN0YWxlTnVtLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU3RhbGUpO1xuICAgIHN0YWxlTnVtLmRhdGFzZXQuemVybyA9IHRvdGFsU3RhbGUgPT09IDAgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJwYWdlc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcoZGlzdGluY3RQYWdlcy5zaXplKTtcbiAgICBjb25zdCBleHBvcnRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIHN0YXRUb2tlbnMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHRva2VuQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuICAgIHN0YXRXb3Jkcy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcod29yZENvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcblxuICAgIC8vIE1pbmlmeSByZWR1Y3Rpb24gc3RhdHNcbiAgICBsZXQgZnVsbFQgPSAwLCBjdXJUID0gMCwgZnVsbFcgPSAwLCBjdXJXID0gMCwgcGN0ID0gMDtcbiAgICBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgY29uc3Qgd2FzTWluID0gcHJlZnMubWluaWZ5O1xuICAgICAgcHJlZnMubWluaWZ5ID0gdHJ1ZTsgY29uc3QgbWluVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IGZhbHNlOyBjb25zdCBmdWxsVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHdhc01pbjtcbiAgICAgIGZ1bGxUID0gdG9rZW5Db3VudChmdWxsVGV4dCk7IGN1clQgPSB0b2tlbkNvdW50KG1pblRleHQpO1xuICAgICAgZnVsbFcgPSB3b3JkQ291bnQoZnVsbFRleHQpOyBjdXJXID0gd29yZENvdW50KG1pblRleHQpO1xuICAgICAgcGN0ID0gZnVsbFQgPiAwID8gTWF0aC5yb3VuZCgoMSAtIGN1clQgLyBmdWxsVCkgKiAxMDApIDogMDtcbiAgICB9XG4gICAgY29uc3QgbWluaWZ5U3RhdHNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1taW5pZnktc3RhdHNdJyk7XG4gICAgaWYgKG1pbmlmeVN0YXRzRWwpIHtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYCR7ZnVsbFQudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVC50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtmdWxsVy50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJXLnRvTG9jYWxlU3RyaW5nKCl9IHdvcmRzIMK3ICR7cGN0fSUgcmVkdWN0aW9uYDtcbiAgICAgIH0gZWxzZSBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYFdvdWxkIHNhdmUgJHsoZnVsbFQgLSBjdXJUKS50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtwY3R9JSBpZiBlbmFibGVkYDtcbiAgICAgIH0gZWxzZSBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxuXG4gICAgLy8gUGVyLWNoZWNrYm94IGNvbnRyaWJ1dGlvbiBzdGF0czogaG93IG1hbnkgdG9rZW5zL3dvcmRzIGVhY2ggdG9nZ2xlXG4gICAgLy8gYWRkcyB0byB0aGUgY3VycmVudCBleHBvcnQuIENvbXB1dGVkIGJ5IHRvZ2dsaW5nIHRoYXQgc2luZ2xlIHByZWZcbiAgICAvLyBhbmQgZGlmZmluZyB0aGUgZXhwb3J0IOKAlCBnaXZlcyBhbiBob25lc3QgYW5zd2VyIHRoYXQgcmVmbGVjdHMgdGhlXG4gICAgLy8gY3VycmVudCBtaW5pZnkgc3RhdGUgYW5kIHRoZSByZXN0IG9mIHRoZSB0b2dnbGVzLlxuICAgIGNvbnN0IGNvbnRyaWJLZXlzOiBBcnJheTxrZXlvZiBQcmVmcz4gPSBbJ2luY2x1ZGVPdXRlckhUTUwnLCAnaW5jbHVkZU1hdGNoZWRSdWxlcycsICdpbmNsdWRlU3R5bGVzJ107XG4gICAgaWYgKGV4cG9ydFRleHQgJiYgbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBiYXNlVCA9IHRva2VuQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBjb25zdCBiYXNlVyA9IHdvcmRDb3VudChleHBvcnRUZXh0KTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKCFlbCkgY29udGludWU7XG4gICAgICAgIGNvbnN0IHdhc09uID0gcHJlZnNba2V5XSBhcyBib29sZWFuO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gIXdhc09uO1xuICAgICAgICBjb25zdCBhbHRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFQgPSB0b2tlbkNvdW50KGFsdFRleHQpO1xuICAgICAgICBjb25zdCBhbHRXID0gd29yZENvdW50KGFsdFRleHQpO1xuICAgICAgICAvLyB3YXNPbj10cnVlIOKGkiBjdXJyZW50bHkgaW5jbHVkZWQ7IGNvc3QgPSBiYXNlIC0gYWx0ICh0dXJuaW5nIE9GRiBzYXZlcyB0aGlzKS5cbiAgICAgICAgLy8gd2FzT249ZmFsc2Ug4oaSIGN1cnJlbnRseSBleGNsdWRlZDsgZ2FpbiA9IGFsdCAtIGJhc2UgKHR1cm5pbmcgT04gYWRkcyB0aGlzKS5cbiAgICAgICAgY29uc3QgZFQgPSB3YXNPbiA/IGJhc2VUIC0gYWx0VCA6IGFsdFQgLSBiYXNlVDtcbiAgICAgICAgY29uc3QgZFcgPSB3YXNPbiA/IGJhc2VXIC0gYWx0VyA6IGFsdFcgLSBiYXNlVztcbiAgICAgICAgY29uc3Qgc2lnbiA9IHdhc09uID8gJycgOiAnKyc7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gd2FzT25cbiAgICAgICAgICA/IGDCtyAke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGluIGV4cG9ydCR7cHJlZnMubWluaWZ5ID8gJyAobWluaWZpZWQpJyA6ICcnfWBcbiAgICAgICAgICA6IGDCtyAke3NpZ259JHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7c2lnbn0ke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaWYgZW5hYmxlZGA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsKSBlbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRvb2xiYXIgZXhwb3J0IHN0YXRzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy5zdGF0LmV4cG9ydC1zdGF0cycpLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICAgIGNvbnN0IG51bSA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LW51bScpO1xuICAgICAgY29uc3QgbGFiID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbGFiZWwnKTtcbiAgICAgIGlmIChudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCEucmVwbGFjZSgvXFwqJC8sICcnKTtcbiAgICAgIGlmIChsYWIpIGxhYi50ZXh0Q29udGVudCA9IGxhYi50ZXh0Q29udGVudCEucmVwbGFjZSgvXlxcKi8sICcnKTtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgbnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQgKyAnKic7XG4gICAgICBjb25zdCBpc1Rva2VuID0gaSA9PT0gMDtcbiAgICAgIGNvbnN0IGZ1bGxWID0gaXNUb2tlbiA/IGZ1bGxUIDogZnVsbFc7XG4gICAgICBjb25zdCBjdXJWID0gaXNUb2tlbiA/IGN1clQgOiBjdXJXO1xuICAgICAgY29uc3Qgd2hpY2ggPSBpc1Rva2VuID8gJ3Rva2VucycgOiAnd29yZHMnO1xuICAgICAgcy5kYXRhc2V0LnRpcCA9IHByZWZzLm1pbmlmeVxuICAgICAgICA/IGBNSU5JRklFRCDCtyAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH1cXG5GdWxsIHdvdWxkIGJlICR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWBcbiAgICAgICAgOiBgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofSDCtyBmdWxsIGV4cG9ydFxcbk1pbmlmaWVkIHdvdWxkIGJlICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYDtcbiAgICB9KTtcblxuICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJlbXB0eS1pY29uXCI+8J+kjzwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktdGl0bGVcIj5TdGFydCB3aXRoIHRoZSBwYWdlIHlvdSB3YW50IHRvIGNyaXRpcXVlLjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktYm9keVwiPk9wZW4gYSBwYWdlLCB0aGVuIGNhcHR1cmUgYW4gZWxlbWVudC4gQ29tbWVudHMgc3RheSBwYWlyZWQgd2l0aCB0aGUgdGhpbmcgeW91IGdyYWJiZWQuPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1rZXlzXCI+QWx0K0NsaWNrIHRvIGNhcHR1cmU8L2Rpdj5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RvclVybHMgPSBuZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnVybCkpO1xuICAgIGNvbnN0IHZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlICE9PSAncGFnZScgfHwgc2VsZWN0b3JVcmxzLmhhcyhtLnVybCkpO1xuICAgIGNvbnN0IHBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgQm9vbGVhbihtLnBpbm5lZCkpO1xuICAgIGNvbnN0IHVucGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSkgPT4gIXBpbm5lZC5pbmNsdWRlcyhtIGFzIFNlbGVjdG9yTWVzc2FnZSkpO1xuICAgIC8vIFNpZGViYXIgc2hvd3MgY2FwdHVyZXMgaW4gSU5TRVJUSU9OIG9yZGVyIChtb3N0IHJlY2VudCBhdCB0aGVcbiAgICAvLyBib3R0b20pLiBWaXN1YWwtcG9zaXRpb24gcmVvcmRlcmluZyBoYXBwZW5zIE9OTFkgYXQgZXhwb3J0IHRpbWVcbiAgICAvLyBzbyB0aGUgc2lkZWJhciBzdGF5cyBwcmVkaWN0YWJsZSB3aGlsZSB0aGUgYWdlbnQtZmFjaW5nIGV4cG9ydFxuICAgIC8vIGdldHMgcmVhZGluZy1vcmRlciBjb252ZW5pZW5jZS4gKFByaW9yIGltcGxlbWVudGF0aW9uIHNvcnRlZCBpblxuICAgIC8vIGJvdGggcGxhY2VzOyB1c2VyIGZlZWRiYWNrIHdhcyB0aGF0IHNpZGViYXIgc2h1ZmZsaW5nIHdhc1xuICAgIC8vIGRpc29yaWVudGluZy4pXG4gICAgY29uc3Qgb3JkZXJlZCA9IFsuLi5waW5uZWQsIC4uLnVucGlubmVkXTtcblxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwobWVzc2FnZXNbMF0hLmlkKSk7XG4gICAgbGV0IGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJlbmRlcmVkQW55ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmRlcmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gb3JkZXJlZFtpXSE7XG4gICAgICBpZiAoIW1hdGNoZXNTZWFyY2gobSkpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgbm9kZSA9IHJlbmRlck1lc3NhZ2UobSwgbGFzdFNlbGVjdG9yU2VsKTtcbiAgICAgIGxpc3QuYXBwZW5kKG5vZGUpO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgbGFzdFNlbGVjdG9yU2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGlmIChpIDwgb3JkZXJlZC5sZW5ndGggLSAxKSBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG9yZGVyZWRbaSArIDFdIS5pZCkpO1xuICAgICAgcmVuZGVyZWRBbnkgPSB0cnVlO1xuICAgIH1cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKCdfX2VuZF9fJykpO1xuICAgIGlmICghcmVuZGVyZWRBbnkgJiYgc2VhcmNoUXVlcnkpIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSBgTm8gbWF0Y2hlcyBmb3IgXCIke3NlYXJjaFF1ZXJ5fVwiLmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgfVxuXG4gICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgcmVuZGVyUGhhbnRvbSgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhd05vb2RsZXMpO1xuICAgIGlmIChzdGlja1RvQm90dG9tKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQZW5kaW5nQmF5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBlbmRpbmctYmF5Jyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJheS5jbGFzc05hbWUgPSAncGVuZGluZy1iYXknO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgUGVuZGluZyBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9IGVsZW1lbnQke3BlbmRpbmdNdWx0aS5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gO1xuICAgIGJheS5hcHBlbmQoaGVhZCk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNhcmQuY2xhc3NOYW1lID0gJ3BlbmRpbmctY2FyZCc7XG4gICAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7aSArIDF9YDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSAoZS50ZXh0ICYmIGUudGV4dC5sZW5ndGggPD0gNjAgPyBlLnRleHQgOiAoZS5jb21wb25lbnRSb290ID8/IGUuc2VsZWN0b3IgPz8gZS50YWcpKTtcbiAgICAgIGNhcmQuYXBwZW5kKHNlcSwgbGFiZWwpO1xuICAgICAgYmF5LmFwcGVuZChjYXJkKTtcbiAgICB9KTtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3BlbmRpbmctcm93JztcbiAgICBjb25zdCBjb21taXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb21taXQudHlwZSA9ICdidXR0b24nO1xuICAgIGNvbW1pdC5jbGFzc05hbWUgPSAncHJpbWFyeSBwZW5kaW5nLWNvbW1pdCc7XG4gICAgY29tbWl0LnRleHRDb250ZW50ID0gYENvbW1pdCBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9YDtcbiAgICBjb21taXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY29tbWl0J30pKTtcbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwZW5kaW5nLWNhbmNlbCc7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJztcbiAgICBjYW5jZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJyk7XG4gICAgY2FuY2VsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDEzKTtcbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY2FuY2VsJ30pKTtcbiAgICByb3cuYXBwZW5kKGNvbW1pdCwgY2FuY2VsKTtcbiAgICBiYXkuYXBwZW5kKHJvdyk7XG4gICAgY29uc3QgaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhpbnQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGludCc7XG4gICAgaGludC50ZXh0Q29udGVudCA9ICdBbHQrU2hpZnQrQ2xpY2sgbW9yZSDCtyBDb21taXQgdG8gZmluYWxpemUgwrcgRXNjIHRvIGNhbmNlbCc7XG4gICAgYmF5LmFwcGVuZChoaW50KTtcbiAgICBsaXN0LmFwcGVuZChiYXkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBOb29kbGVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBjbGVhck5vb2RsZXMgPSAoKTogdm9pZCA9PiB7IGZvciAoY29uc3QgbiBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmVlLW5vb2RsZScpKSBuLnJlbW92ZSgpOyB9O1xuXG4gIC8vIENyb3NzLXNlYW0gcGFuZWzihpRjYW52YXMgbm9vZGxlcyB3ZXJlIHJlbW92ZWQ6IGFsaWduaW5nIHR3byBTVkcgaGFsdmVzXG4gIC8vIGFjcm9zcyB0aGUgcGFuZWwvcGFnZSBib3VuZGFyeSBkZXBlbmRlZCBvbiBpbm5lckhlaWdodCBwYXJpdHkgd2hpY2hcbiAgLy8gYnJlYWtzIHVuZGVyIERldlRvb2xzIGRvY2sgYW5kIHpvb20sIGFuZCB0aGUgdmlzdWFsIGJlbmVmaXQgZGlkbid0XG4gIC8vIGp1c3RpZnkgdGhlIG1haW50ZW5hbmNlIGNvc3QuIFRoZSBpbi1wYW5lbCBmZWVkYmFjay10cmVlIG5vb2RsZXNcbiAgLy8gKGRyYXdOb29kbGUgLyByZWRyYXdOb29kbGVzIGJlbG93KSBhcmUgdW5hZmZlY3RlZC5cbiAgY29uc3QgY2xlYXJCdWJibGVOb29kbGUgPSAoKTogdm9pZCA9PiB7IC8qIG5vLW9wICovIH07XG4gIGNvbnN0IHJlZHJhd05vb2RsZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJOb29kbGVzKCk7XG4gICAgbGV0IGxhc3RTZWxlY3RvckVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBbLi4ubGlzdC5jaGlsZHJlbl0gYXMgSFRNTEVsZW1lbnRbXSkge1xuICAgICAgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtc2cnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0b3InKSkgbGFzdFNlbGVjdG9yRWwgPSBub2RlO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWVkYmFjaycpICYmIGxhc3RTZWxlY3RvckVsKSBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCBub2RlKTtcbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtcmFpbCcpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5pbmxpbmUtY29tbWVudCcpID8/IG5vZGU7XG4gICAgICAgIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIHRhcmdldCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRpdmlkZXInKSB8fCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZ3JvdXAtaGVhZCcpKSB7XG4gICAgICAgIGxhc3RTZWxlY3RvckVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGRyYXdOb29kbGUgPSAoc2VsZWN0b3JFbDogSFRNTEVsZW1lbnQsIGZlZWRiYWNrRWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc1IgPSBzZWxlY3RvckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGZSID0gZmVlZGJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBsUiA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgeDEgPSBzUi5sZWZ0IC0gbFIubGVmdCArIDEyO1xuICAgIGNvbnN0IHkxID0gc1IuYm90dG9tIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3A7XG4gICAgY29uc3QgeDIgPSBmUi5sZWZ0IC0gbFIubGVmdDtcbiAgICBjb25zdCB5MiA9IGZSLnRvcCAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wICsgMTQ7XG4gICAgY29uc3QgdyA9IE1hdGgubWF4KDIwLCB4MiAtIHgxICsgNCk7XG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDIwLCB5MiAtIHkxKTtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RyZWUtbm9vZGxlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcodykpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFN0cmluZyhoKSk7XG4gICAgc3ZnLnN0eWxlLmxlZnQgPSBgJHt4MSAtIDJ9cHhgO1xuICAgIHN2Zy5zdHlsZS50b3AgPSBgJHt5MX1weGA7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIGNvbnN0IHN4ID0gMiwgc3kgPSAwLCBleCA9IHcgLSAyLCBleSA9IGg7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBgTSAke3N4fSAke3N5fSBDICR7c3h9ICR7c3kgKyBoICogMC41NX0sICR7ZXggLSB3ICogMC40fSAke2V5fSwgJHtleH0gJHtleX1gKTtcbiAgICBzdmcuYXBwZW5kKHBhdGgpO1xuICAgIGxpc3QuYXBwZW5kKHN2Zyk7XG4gIH07XG4gIGxldCBzY3JvbGxSYWYgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmFmKSByZXR1cm47XG4gICAgc2Nyb2xsUmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgc2Nyb2xsUmFmID0gMDsgcmVkcmF3Tm9vZGxlcygpOyB9KTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZWRyYXdOb29kbGVzKTtcblxuICAvLyDilIDilIDilIAgUGVyLW1lc3NhZ2UgcmVuZGVyZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCByZW5kZXJNZXNzYWdlID0gKG06IFBhbmVsTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIHJlbmRlclBhZ2UobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHJlbmRlclNlbGVjdG9yKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiByZW5kZXJGZWVkYmFjayhtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQYWdlID0gKG06IFBhZ2VNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkLmNsYXNzTmFtZSA9ICdwYWdlLWRpdmlkZXInO1xuICAgIGQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgY29uc3QgdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdHMuY2xhc3NOYW1lID0gJ3RhYi1zdGF0dXMnO1xuICAgIHRzLmRhdGFzZXQudXJsID0gbS51cmw7XG4gICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB0cy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgZC5hcHBlbmQodHMpO1xuICAgIGNvbnN0IHUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdS5jbGFzc05hbWUgPSAndXJsJztcbiAgICB1LnRleHRDb250ZW50ID0gbS51cmw7XG4gICAgdS5kYXRhc2V0LnRpcCA9IGAke20udGl0bGUgPz8gJyd9IMK3ICR7bS51cmx9YDtcbiAgICBkLmFwcGVuZCh1KTtcbiAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBvbiB0aGlzIHBhZ2UgaW4gdGhlIGFjdGl2ZSB0YWIsIGNsaWNraW5nIHRoZSBVUkxcbiAgICAgIC8vIHNob3VsZG4ndCByZWxvYWQgb3Igc3RlYWwgZm9jdXMg4oCUIGl0IHNob3VsZCBqdXN0IGJlIGEgbm8tb3BcbiAgICAgIC8vIHZpc3VhbGx5ICh0aGUgcm93IGFscmVhZHkgaW5kaWNhdGVzIFwib3BlblwiIHZpYSAudGFiLXN0YXR1cykuIFRoZVxuICAgICAgLy8gdXNlciBjb21wbGFpbmVkIGFib3V0IGdldHRpbmcgZm9yY2VkIGludG8gYSBuYXZpZ2F0aW9uIHdoZW4gdGhleVxuICAgICAgLy8gd2VyZSBqdXN0IHRyeWluZyB0byByZWFkIHRoZSByb3cuXG4gICAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHtcbiAgICAgICAgc2V0U3RhdHVzKCdBbHJlYWR5IG9uIHRoaXMgcGFnZScsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgciA9IGF3YWl0IHNlbmRUb0JnPHtmb3VuZD86IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcjsgZXJyb3I/OiBzdHJpbmd9Pih7a2luZDogJ3N3aXRjaC10by10YWInLCB1cmw6IG0udXJsLCBvcGVuSWZNaXNzaW5nOiB0cnVlfSk7XG4gICAgICBpZiAocj8uZm91bmQpIHNldFN0YXR1cygnU3dpdGNoZWQgdG8gdGFiJyk7XG4gICAgICBlbHNlIGlmIChyPy5vcGVuZWQpIHNldFN0YXR1cygnT3BlbmVkIGluIG5ldyB0YWInKTtcbiAgICAgIGVsc2Ugc2V0U3RhdHVzKFwiQ291bGRuJ3Qgb3BlbiB0YWJcIiwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pO1xuICAgIHJldHVybiBkO1xuICB9O1xuXG4gIGNvbnN0IHRpdGxlRnJvbUVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXN0SWQpIHJldHVybiBgW3Rlc3RJZD0ke2UudGVzdElkfV1gO1xuICAgIGlmIChlLmlkKSByZXR1cm4gYCMke2UuaWR9YDtcbiAgICBpZiAoZS5jbGFzc2VzPy5sZW5ndGgpIHJldHVybiBgJHtlLnRhZ30uJHtlLmNsYXNzZXMuc2xpY2UoMCwgMikuam9pbignLicpfWA7XG4gICAgcmV0dXJuIGUuc2VsZWN0b3IgfHwgZS50YWcgfHwgJyh1bmtub3duKSc7XG4gIH07XG5cbiAgLy8gUGljayB0aGUgbW9zdCBcImh1bWFubHkgcmVhZGFibGVcIiBsYWJlbCBmb3IgdGhlIGJ1YmJsZSBwcmV2aWV3LiBQcmVmZXJzXG4gIC8vIHZpc2libGUtdG8tdXNlciB0ZXh0IGluIHRoaXMgcHJpb3JpdHk6XG4gIC8vICAgMS4gaW5uZXJUZXh0IC8gdGV4dENvbnRlbnQgKGBlbnRyeS50ZXh0YCkg4oCUIHdoYXQgdGhlIHVzZXIgcmVhZHMgb24gc2NyZWVuXG4gIC8vICAgMi4gYWNjZXNzaWJsZU5hbWUgKGFyaWEtbGFiZWwgLyB0aXRsZSAvIGFsdCBmYWxsYmFjayBjaGFpbilcbiAgLy8gICAzLiBpbnB1dCB2YWx1ZSAoc2tpcHBlZCBpZiBpdCdzIHRoZSBtYXNrZWQgcGFzc3dvcmQgcGxhY2Vob2xkZXIpXG4gIC8vICAgNC4gaW5wdXQgcGxhY2Vob2xkZXJcbiAgLy8gICA1LiBpbWcgYWx0XG4gIC8vICAgNi4gY29tcG9uZW50Um9vdCAoZS5nLiBcImJ1dHRvbiNjdGFcIilcbiAgLy8gICA3LiB0aXRsZUZyb21FbnRyeSDigJQgbGFzdC1yZXNvcnQgdGFnL2NsYXNzL2lkIGZhbGxiYWNrXG4gIC8vIENTUyBoYW5kbGVzIHZpc3VhbCB0cnVuY2F0aW9uIHZpYSB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3ZSBzaGlwIHRoZVxuICAvLyBmdWxsIHN0cmluZyBzbyB0aGUgdG9vbHRpcCBvbiBob3ZlciBjYW4gc2hvdyB0aGUgY29tcGxldGUgdmFsdWUuXG4gIGNvbnN0IG5pY2VMYWJlbCA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGV4dCkgcmV0dXJuIGUudGV4dDtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSkgcmV0dXJuIGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgY29uc3QgdiA9IGUuYXR0cnM/LnZhbHVlO1xuICAgIGlmICh2ICYmIHYgIT09ICfigKLigKLigKLigKInKSByZXR1cm4gdjtcbiAgICBpZiAoZS5hdHRycz8ucGxhY2Vob2xkZXIpIHJldHVybiBlLmF0dHJzLnBsYWNlaG9sZGVyO1xuICAgIGlmIChlLmF0dHJzPy5hbHQpIHJldHVybiBlLmF0dHJzLmFsdDtcbiAgICBpZiAoZS5jb21wb25lbnRSb290KSByZXR1cm4gZS5jb21wb25lbnRSb290O1xuICAgIHJldHVybiB0aXRsZUZyb21FbnRyeShlKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTZWxlY3RvciA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgdmFsaWQgPSBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzYW1lUGF0aCA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJykgPT09IGxpdmVUYWJQYXRoO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIHNlbGVjdG9yJztcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlICYmIHNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhbGUnKTtcbiAgICBlbHNlIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgIXNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnZGlmZi1wYWdlJyk7XG4gICAgaWYgKG0ucGlubmVkKSBkaXYuY2xhc3NMaXN0LmFkZCgncGlubmVkJyk7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2hhcy1ncm91cCcpO1xuICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yID09PSBsYXN0QWN0aXZlU2VsZWN0b3IpIGRpdi5jbGFzc0xpc3QuYWRkKCdsYXN0LWFjdGl2ZScpO1xuICAgIC8vIEF1dG8tZXhwYW5kIG9uIHNlYXJjaCBoaXQgc28gdGhlIHVzZXIgc2VlcyB3aGVyZSB0aGUgbWF0Y2ggbGFuZGVkLlxuICAgIGNvbnN0IG1hdGNoZWRCb2R5ID0gYm9keU1hdGNoZXNTZWFyY2gobSk7XG4gICAgaWYgKG1hdGNoZWRCb2R5KSBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnLCAnc2VhcmNoLWhpdCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuZGF0YXNldC5zZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgLy8gRHJhZy10by1yZXBhcmVudDogZXZlcnkgc2VsZWN0b3IgYnViYmxlIGlzIGEgdmFsaWQgZHJvcCB0YXJnZXQgZm9yXG4gICAgLy8gYSBjb21tZW50IGJlaW5nIGRyYWdnZWQgZnJvbSBlbHNld2hlcmUgaW4gdGhlIHNpZGViYXIuXG4gICAgd2lyZVNlbGVjdG9yRHJvcFRhcmdldChkaXYsIG0pO1xuXG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ2hlYWQnO1xuICAgIGNvbnN0IGNhcmV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNhcmV0LmNsYXNzTmFtZSA9ICdjYXJldCc7XG4gICAgY2FyZXQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGV2cm9uLXJpZ2h0JywgMTIpO1xuICAgIGhlYWQuYXBwZW5kKGNhcmV0KTtcbiAgICBjb25zdCBwaW5NYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcGluTWFya2VyLmNsYXNzTmFtZSA9ICdwaW4tbWFya2VyJztcbiAgICBwaW5NYXJrZXIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdzdGFyLWZpbGxlZCcsIDExKTtcbiAgICBoZWFkLmFwcGVuZChwaW5NYXJrZXIpO1xuICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgc2VxLnRleHRDb250ZW50ID0gYCMke20uZW50cnkubn1gO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIHNlcS50ZXh0Q29udGVudCArPSBgKyR7bS5lbnRyeS5ncm91cC5sZW5ndGh9YDtcbiAgICBoZWFkLmFwcGVuZChzZXEpO1xuICAgIGNvbnN0IGNvbXBhY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29tcGFjdC5jbGFzc05hbWUgPSAnY29tcGFjdCc7XG4gICAgY29uc3QgY29tcGFjdFN0ciA9IG5pY2VMYWJlbChtLmVudHJ5KTtcbiAgICBjb21wYWN0LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGNvbXBhY3RTdHIsIHNlYXJjaFF1ZXJ5KTtcbiAgICAvLyBTaG93IHRoZSBmdWxsIGxhYmVsIG9uIGhvdmVyIGV2ZW4gd2hlbiBDU1MgZWxsaXBzaXMgdHJ1bmNhdGVzIHRoZVxuICAgIC8vIHZpc2libGUgcG9ydGlvbiDigJQgdXNlZnVsIHdoZW4gdGhlIHZpc2libGUgdGV4dC9wbGFjZWhvbGRlciBpcyBsb25nLlxuICAgIGlmIChjb21wYWN0U3RyLmxlbmd0aCA+IDI0KSBjb21wYWN0LmRhdGFzZXQudGlwID0gY29tcGFjdFN0cjtcbiAgICBoZWFkLmFwcGVuZChjb21wYWN0KTtcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9IHIgPyBgJHtyLnd9w5cke3IuaH1gIDogKG0uZW50cnkudGFnID8/ICcnKTtcbiAgICBoZWFkLmFwcGVuZChtZXRhKTtcbiAgICBkaXYuYXBwZW5kKGhlYWQpO1xuXG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzdW1tYXJ5LmNsYXNzTmFtZSA9ICdwZWVrLXN1bW1hcnknO1xuICAgIHN1bW1hcnkuaW5uZXJIVE1MID0gYDxzcGFuIGRhdGEtaWNvbj1cImFsZXJ0LWNpcmNsZVwiIGRhdGEtc2l6ZT1cIjExXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ0XCI+JHtkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWZmLXBhZ2UnKSA/ICdkaWZmZXJlbnQgcGFnZScgOiAnc3RhbGUnfTwvc3Bhbj5gO1xuICAgIGhlYWQuYXBwZW5kKHN1bW1hcnkpO1xuICAgIG1vdW50SWNvbnMoc3VtbWFyeSk7XG5cbiAgICBjb25zdCBlcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnIuY2xhc3NOYW1lID0gJ3BlZWstZXJyb3InO1xuICAgIGNvbnN0IHJlYXNvbiA9IHNlbGVjdG9yRXJyb3JzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBwYXRoRnJvbUVudHJ5ID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKTtcbiAgICBlcnIuaW5uZXJIVE1MID0gc2FtZVBhdGhcbiAgICAgID8gYDxiPlN0YWxlPC9iPiDCtyAke2VzY2FwZUh0bWwocmVhc29uID8/ICdubyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcy4nKX08YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gXG4gICAgICA6IGBDYXB0dXJlZCBvbiA8Y29kZT4ke2VzY2FwZUh0bWwocGF0aEZyb21FbnRyeSl9PC9jb2RlPiDigJQgY3VycmVudCB0YWIgaXMgPGNvZGU+JHtlc2NhcGVIdG1sKGxpdmVUYWJQYXRoID8/ICcnKX08L2NvZGU+LiBTd2l0Y2ggdGFicyB0byB2YWxpZGF0ZS48YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gO1xuICAgIGRpdi5hcHBlbmQoZXJyKTtcblxuICAgIC8vIEFuY2VzdG9yIGJyZWFkY3J1bWIg4oCUIFBsYXNtaWMtc3R5bGUgZXNjYWxhdG9yLiBDaGlwcyBmb3IgZWFjaCBlbnRyeSBpblxuICAgIC8vIGVudHJ5LmFuY2VzdG9ycyAoY2xvc2VzdCBmaXJzdCkuIENsaWNrIGEgY2hpcCB0byBjYXB0dXJlIHRoYXRcbiAgICAvLyBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIChkZXB0aCA9IGNoaXAgaW5kZXggKyAxIHNpbmNlIHRoZSBlbnRyeSdzXG4gICAgLy8gb3duIHNlbGVjdG9yIGlzIGRlcHRoIDApLiBCcmlnaHRuZXNzIGdyYWRpZW50IGRhcmtlbnMgZGVlcGVyIGNoaXBzLlxuICAgIGlmIChtLmVudHJ5LmFuY2VzdG9ycz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjcnVtYnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNydW1icy5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY3J1bWJzJztcbiAgICAgIGNydW1icy5kYXRhc2V0LnRpcCA9ICdDbGljayBhIGNydW1iIHRvIGVzY2FsYXRlIHRoZSBjYXB0dXJlIHRvIGFuIGFuY2VzdG9yIGVsZW1lbnQnO1xuICAgICAgbS5lbnRyeS5hbmNlc3RvcnMuZm9yRWFjaCgoYW5jLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2hpcC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGNoaXAuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNoaXAnO1xuICAgICAgICAvLyBCcmlnaHRuZXNzIGdyYWRpZW50OiBkZWVwZXIgY2hpcHMgZ2V0IHByb2dyZXNzaXZlbHkgZGltbWVyLlxuICAgICAgICBjaGlwLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7KDEgLSBpICogMC4wOCkudG9GaXhlZCgyKX0pYDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBhbmMudGVzdElkID8gYFske2FuYy50ZXN0SWR9XWBcbiAgICAgICAgICA6IGFuYy5pZCA/IGAjJHthbmMuaWR9YFxuICAgICAgICAgIDogYW5jLmNsYXNzZXM/Lmxlbmd0aCA/IGAke2FuYy50YWd9LiR7YW5jLmNsYXNzZXNbMF19YFxuICAgICAgICAgIDogYW5jLnRhZztcbiAgICAgICAgY2hpcC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjaGlwLmRhdGFzZXQudGlwID0gYENhcHR1cmUgdGhlIGFuY2VzdG9yICR7aSArIDF9IGxldmVsJHtpID8gJ3MnIDogJyd9IHVwIMK3ICR7YW5jLnRhZ30ke2FuYy5pZCA/ICcjJyArIGFuYy5pZCA6ICcnfWA7XG4gICAgICAgIC8vIEhvdmVyLXByZXZpZXcgdGhlIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2Ugc28gdGhlIHVzZXIgY2FuIHNlZVxuICAgICAgICAvLyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNvbW1pdHRpbmcuIE1pcnJvcnMgaG93XG4gICAgICAgIC8vIGhvdmVyaW5nIGEgc2VsZWN0b3IgYnViYmxlIHBhaW50cyBpdHMgcmluZy4gQ2xlYXJpbmcgb25cbiAgICAgICAgLy8gbW91c2VsZWF2ZSBzd2FwcyBiYWNrIHRvIHRoZSBidWJibGUncyBvd24gb3V0bGluZSAodGhlIGJ1YmJsZSdzXG4gICAgICAgIC8vIG1vdXNlZW50ZXIgaGFuZGxlciBwYWludGVkIGl0OyBsZWF2aW5nIHRoZSBjaGlwIGp1c3QgcmVtb3Zlc1xuICAgICAgICAvLyB0aGUgb3ZlcnJpZGUpLlxuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gUmUtcGFpbnQgdGhlIGJ1YmJsZSdzIG93biByaW5nIHJhdGhlciB0aGFuIGNsZWFyaW5nIGVudGlyZWx5XG4gICAgICAgICAgLy8gc28gdGhlIHVzZXIgZG9lc24ndCBzZWUgYSBmbGlja2VyIG9mIFwibm90aGluZ1wiIGJldHdlZW4gY2hpcHMuXG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7XG4gICAgICAgICAgICBraW5kOiAnY2FwdHVyZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDEsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKGBDYXB0dXJlZCBhbmNlc3RvciAke2FuYy50YWd9YCk7XG4gICAgICAgICAgZWxzZSBzZXRTdGF0dXMoJ0NvdWxkIG5vdCBjYXB0dXJlIGFuY2VzdG9yJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICB9KTtcbiAgICAgICAgY3J1bWJzLmFwcGVuZChjaGlwKTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFwcGVuZChjcnVtYnMpO1xuICAgIH1cblxuICAgIC8vIFByZXZpZXcgdGlsZSDigJQgb25seSB3aGVuIHdlIGhhdmUgYSB0aHVtYm5haWwgZGF0YVVybCBpbiB0aGUgaW4tbWVtb3J5XG4gICAgLy8gc2hvdHMgbWFwLiBUaGUgZnVsbCBQTkcgbGl2ZXMgb24gZGlzayB1bmRlciAucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvO1xuICAgIC8vIHRoZSBkYXRhVXJsIGlzIGp1c3QgYSBzaWRlLXBhbmVsLWZyaWVuZGx5IGRvd25zY2FsZSAo4omkMzIwcHggd2lkZSkuXG4gICAgY29uc3Qgc2hvdERhdGFVcmwgPSBzaG90cy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgaWYgKHNob3REYXRhVXJsKSB7XG4gICAgICBjb25zdCBwcmV2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBwcmV2aWV3LmNsYXNzTmFtZSA9ICdwcmV2aWV3JztcbiAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgaW1nLmNsYXNzTmFtZSA9ICdzaG90JztcbiAgICAgIGltZy5zcmMgPSBzaG90RGF0YVVybDtcbiAgICAgIGltZy5hbHQgPSBgU2NyZWVuc2hvdCBvZiAjJHttLmVudHJ5Lm59YDtcbiAgICAgIHByZXZpZXcuYXBwZW5kKGltZyk7XG4gICAgICBkaXYuYXBwZW5kKHByZXZpZXcpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3RhdHMuY2xhc3NOYW1lID0gJ2VudC1zdGF0cyc7XG4gICAgY29uc3QgZmIgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihtLmlkKTtcbiAgICBjb25zdCBteVRva2VucyA9IHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkobS5lbnRyeSkpO1xuICAgIGNvbnN0IHRvdGFsVG9rZW5zID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG1tKTogbW0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG1tLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAucmVkdWNlKChzLCBtbSkgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkobW0uZW50cnkpKSwgMCk7XG4gICAgY29uc3Qgc2hhcmVQY3QgPSB0b3RhbFRva2VucyA+IDAgPyBNYXRoLnJvdW5kKChteVRva2VucyAvIHRvdGFsVG9rZW5zKSAqIDEwMCkgOiAwO1xuICAgIGNvbnN0IGdyb3VwQ291bnQgPSBtLmVudHJ5Lmdyb3VwPy5sZW5ndGggPz8gMDtcbiAgICBjb25zdCBncm91cFRva2VucyA9IChtLmVudHJ5Lmdyb3VwID8/IFtdKS5yZWR1Y2UoKHMsIGcpID0+IHMgKyB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KGcpKSwgMCk7XG4gICAgdHlwZSBTdGF0Q2VsbCA9IHtsYWJlbDogc3RyaW5nOyB2YWx1ZTogc3RyaW5nOyB0aXA6IHN0cmluZ307XG4gICAgY29uc3QgY2VsbHM6IFN0YXRDZWxsW10gPSBbXG4gICAgICB7bGFiZWw6ICdIVE1MJywgdmFsdWU6IGAke20uZW50cnkub3V0ZXJIVE1MPy5sZW5ndGggPz8gMH1gLCB0aXA6ICdPdXRlciBIVE1MIGNoYXIgbGVuZ3RoJ30sXG4gICAgICB7bGFiZWw6ICdUb2tlbnMnLCB2YWx1ZTogYCR7bXlUb2tlbnN9YCwgdGlwOiAnQXBwcm94IExMTSB0b2tlbnMgZm9yIHRoaXMgZW50cnknfSxcbiAgICAgIHtsYWJlbDogJ1NoYXJlJywgdmFsdWU6IGAke3NoYXJlUGN0fSVgLCB0aXA6ICdUb2tlbiBzaGFyZSBvZiBhbGwgc2VsZWN0b3JzJ30sXG4gICAgICB7bGFiZWw6ICdDb21tZW50cycsIHZhbHVlOiBgJHtmYi5sZW5ndGh9YCwgdGlwOiAnSW5saW5lIGNvbW1lbnRzIHRocmVhZGVkIHVuZGVyIHRoaXMgZW50cnknfSxcbiAgICAgIHtsYWJlbDogJ1J1bGVzJywgdmFsdWU6IGAke20uZW50cnkubWF0Y2hlZFJ1bGVzPy5sZW5ndGggPz8gMH1gLCB0aXA6ICdNYXRjaGVkIENTUyBydWxlcyd9LFxuICAgICAge2xhYmVsOiAnU3R5bGVzJywgdmFsdWU6IGAke09iamVjdC5rZXlzKG0uZW50cnkuc3R5bGVzID8/IHt9KS5sZW5ndGh9YCwgdGlwOiAnQ29tcHV0ZWQtc3R5bGUgZmllbGRzIGtlcHQnfSxcbiAgICBdO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwJywgdmFsdWU6IGAke2dyb3VwQ291bnR9YCwgdGlwOiAnTWVtYmVycyBmb2xkZWQgaW50byB0aGlzIGdyb3VwJ30pO1xuICAgICAgY2VsbHMucHVzaCh7bGFiZWw6ICdHcm91cCBUJywgdmFsdWU6IGAke2dyb3VwVG9rZW5zfWAsIHRpcDogJ1Rva2VucyBjb250cmlidXRlZCBieSBncm91cCBtZW1iZXJzJ30pO1xuICAgIH1cbiAgICBzdGF0cy5pbm5lckhUTUwgPSBjZWxscy5tYXAoKGMpID0+XG4gICAgICBgPHNwYW4gY2xhc3M9XCJlbnQtc3RhdFwiIGRhdGEtdGlwPVwiJHtlc2NhcGVIdG1sKGMudGlwKX1cIj48c3BhbiBjbGFzcz1cImxibFwiPiR7Yy5sYWJlbH08L3NwYW4+PHNwYW4gY2xhc3M9XCJ2YWxcIj4ke2MudmFsdWV9PC9zcGFuPjwvc3Bhbj5gLFxuICAgICkuam9pbignJyk7XG4gICAgZGl2LmFwcGVuZChzdGF0cyk7XG5cbiAgICAvLyDilIDilIAgSlNPTiBwYW5lIHdpdGggdG9vbGJhciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvLyBUb29sYmFyIGFib3ZlIHRoZSBKU09OIGJvZHk6IGxlZnQgPSBsaW5lLXdyYXAgdG9nZ2xlLCByaWdodCA9IGNvcHkuXG4gICAgLy8gVGhlIEpTT04gaXRzZWxmIHJlZmxlY3RzIHRoZSBnbG9iYWwgYG1pbmlmeWAgc2V0dGluZyBzbyB0aGUgdXNlciBzZWVzXG4gICAgLy8gdGhlIHNhbWUgc2hhcGUgdGhhdCB3aWxsIGVuZCB1cCBpbiB0aGUgZXhwb3J0LlxuICAgIGNvbnN0IGpzb25XcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAganNvbldyYXAuY2xhc3NOYW1lID0gJ2JvZHktanNvbi13cmFwJztcbiAgICBjb25zdCBqc29uQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAganNvbkJhci5jbGFzc05hbWUgPSAnYm9keS1qc29uLWJhcic7XG5cbiAgICAvLyBMaW5lLXdyYXAgY2hlY2tib3ggKHBlci1idWJibGUgbG9jYWwgc3RhdGUsIGRlZmF1bHQgT04pLlxuICAgIGNvbnN0IHdyYXBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgd3JhcExhYmVsLmNsYXNzTmFtZSA9ICdqc29uLXdyYXAtdG9nZ2xlJztcbiAgICB3cmFwTGFiZWwuZGF0YXNldC50aXAgPSAnV3JhcCBsb25nIGxpbmVzIGluc3RlYWQgb2YgaG9yaXpvbnRhbCBzY3JvbGwnO1xuICAgIGNvbnN0IHdyYXBDaGVjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgd3JhcENoZWNrLnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIHdyYXBDaGVjay5jaGVja2VkID0gdHJ1ZTtcbiAgICB3cmFwTGFiZWwuYXBwZW5kKHdyYXBDaGVjaywgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBXcmFwJykpO1xuICAgIGpzb25CYXIuYXBwZW5kKHdyYXBMYWJlbCk7XG5cbiAgICAvLyBDb3B5IGJ1dHRvbiAobWlycm9ycyB0aGUgXCJDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OXCIgYWN0aW9uIGJlbG93LFxuICAgIC8vIHN1cmZhY2VkIGF0IHRoZSB0b3Agc28gdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIHNjcm9sbCBwYXN0IHRoZSBKU09OXG4gICAgLy8gdG8gZmluZCBpdCkuXG4gICAgY29uc3QgY29weUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvcHlCdG4udHlwZSA9ICdidXR0b24nO1xuICAgIGNvcHlCdG4uY2xhc3NOYW1lID0gJ2ljb25idG4ganNvbi1jb3B5JztcbiAgICBjb3B5QnRuLmRhdGFzZXQudGlwID0gJ0NvcHkgdGhpcyBjYXB0dXJlIGFzIEpTT04nO1xuICAgIGNvcHlCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NvcHkgY2FwdHVyZSBhcyBKU09OJyk7XG4gICAgY29weUJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NvcHknLCAxMyk7XG4gICAgY29weUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgLy8gSG9ub3IgdGhlIHNhbWUgc2hhcGUgdGhlIEpTT04gYmVsb3cgc2hvd3MuXG4gICAgICBjb25zdCBwYXlsb2FkID0gcHJlZnMubWluaWZ5ID8gc2xpbUVudHJ5KG0uZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWV9KSA6IG0uZW50cnk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChKU09OLnN0cmluZ2lmeShwYXlsb2FkLCBudWxsLCBwcmVmcy5taW5pZnkgPyAwIDogMikpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgSlNPTicpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIEpTT04nLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgIH0pO1xuICAgIGpzb25CYXIuYXBwZW5kKGNvcHlCdG4pO1xuICAgIGpzb25XcmFwLmFwcGVuZChqc29uQmFyKTtcblxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBib2R5LmNsYXNzTmFtZSA9ICdib2R5LWpzb24gd3JhcC1vbic7XG4gICAgLy8gUmVmbGVjdCB0aGUgbWluaWZ5IHByZWY6IHdoZW4gbWluaWZpZWQsIHNob3cgdGhlIHNsaW1FbnRyeS1zaGFwZWRcbiAgICAvLyBleHBvcnQgZm9ybSAoY29tcGFjdCwgc2luZ2xlLWxpbmUpLiBPdGhlcndpc2UgcHJldHR5LXByaW50IHRoZSBmdWxsXG4gICAgLy8gZW50cnkgc28gaXQncyByZWFkYWJsZS5cbiAgICBjb25zdCByZW5kZXJKc29uID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHByZWZzLm1pbmlmeSA/IHNsaW1FbnRyeShtLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlfSkgOiBtLmVudHJ5O1xuICAgICAgY29uc3QgdGV4dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIHByZWZzLm1pbmlmeSA/IDAgOiAyKTtcbiAgICAgIGFwcGVuZEpzb25IaWdobGlnaHQoYm9keSwgdGV4dCk7XG4gICAgICBpZiAoc2VhcmNoUXVlcnkpIHdyYXBTZWFyY2hIaXRzSW5UZXh0Tm9kZXMoYm9keSwgc2VhcmNoUXVlcnkpO1xuICAgIH07XG4gICAgcmVuZGVySnNvbigpO1xuICAgIHdyYXBDaGVjay5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb24nLCB3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb2ZmJywgIXdyYXBDaGVjay5jaGVja2VkKTtcbiAgICB9KTtcbiAgICAvLyBTdG9wIHRoZSBjbGljayBvbiB0aGUgdG9vbGJhciBmcm9tIGNvbGxhcHNpbmcgdGhlIGJ1YmJsZSDigJQgdGhlIGhlYWQnc1xuICAgIC8vIGNsaWNrIGhhbmRsZXIgdG9nZ2xlcyBgLmV4cGFuZGVkYCBvbiBjbGljaywgYW5kIHRoZSBiYXIgbGl2ZXMgaW5zaWRlXG4gICAgLy8gdGhlIGJ1YmJsZS5cbiAgICBqc29uQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGpzb25XcmFwLmFwcGVuZChib2R5KTtcbiAgICBkaXYuYXBwZW5kKGpzb25XcmFwKTtcblxuICAgIGhlYWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwYW5kZWQnKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXdOb29kbGVzKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGdvbGQ6IHRydWV9KTtcbiAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgaWYgKGxhc3RBY3RpdmVTZWxlY3Rvcikgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBsYXN0QWN0aXZlU2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFjdGlvbnMuY2xhc3NOYW1lID0gJ2FjdGlvbnMnO1xuICAgIC8vIE5vdGU6IE5PIGFjdGlvbnMtcm93IG1vdXNlZW50ZXIvbW91c2VsZWF2ZS4gVGhlIGJ1YmJsZSdzIG93blxuICAgIC8vIG1vdXNlZW50ZXIvbW91c2VsZWF2ZSBhbHJlYWR5IHBhaW50cyB0aGUgcGFnZS1zaWRlIG91dGxpbmUgd2hpbGVcbiAgICAvLyB0aGUgY3Vyc29yIGlzIGFueXdoZXJlIGluc2lkZSB0aGUgYnViYmxlIOKAlCBpbmNsdWRpbmcgb3ZlciBhY3Rpb25cbiAgICAvLyBidXR0b25zLiBBZGRpbmcgaGFuZGxlcnMgSEVSRSB1c2VkIHRvIGNsZWFyIHRoZSBvdXRsaW5lIHdoZW5ldmVyXG4gICAgLy8gdGhlIGN1cnNvciBtb3ZlZCBmcm9tIC5hY3Rpb25zIGJhY2sgdG8gdGhlIGJ1YmJsZSBib2R5IChiZWNhdXNlXG4gICAgLy8gLm1vdXNlbGVhdmUgZmlyZXMgb24gdGhlIHBhcmVudCBwYXRoIGV2ZW4gdGhvdWdoIC5tb3VzZWVudGVyIG9uXG4gICAgLy8gdGhlIGJ1YmJsZSBkb2Vzbid0IHJlZmlyZSksIHdoaWNoIHJlYWQgYXMgXCJ0aGUgaGlnaGxpZ2h0IGZsaWNrZXJzXG4gICAgLy8gb2ZmIG1pZC1ob3ZlclwiLlxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bihtLnBpbm5lZCA/ICdzdGFyLWZpbGxlZCcgOiAnc3RhcicsIG0ucGlubmVkID8gJ1VucGluIGZyb20gdG9wJyA6ICdQaW4gdG8gdG9wJywgKCkgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG0ucGlubmVkID0gIW0ucGlubmVkO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3RvZ2dsZWQ6IG0ucGlubmVkfSkpO1xuICAgIC8vIExvY2F0ZSBpcyBhIG9uZS1zaG90OiBzY3JvbGwgdGhlIHBhZ2UgdG8gdGhlIGVsZW1lbnQgYW5kIHJ1biB0aGVcbiAgICAvLyAzLXB1bHNlIGN5YW4gcmluZyBhbmltYXRpb24uIEl0IHVzZWQgdG8gc2hhcmUgYGxhc3RBY3RpdmVTZWxlY3RvcmBcbiAgICAvLyB3aXRoIHRoZSBob3Zlci1zdGlja3kgcGF0aCwgd2hpY2ggbWFkZSB0aGUgYnV0dG9uIGFwcGVhciB0b2dnbGVkXG4gICAgLy8gYW55IHRpbWUgdGhlIHVzZXIgbWVyZWx5IGhvdmVyZWQgdGhlIGJ1YmJsZS4gTm93IGl0IGhhcyBub1xuICAgIC8vIHBlcnNpc3RlbnQgc3RhdGUg4oCUIHByZXNzaW5nIGl0IGFsd2F5cyBwbGF5cyB0aGUgc2FtZSBmbGFzaC5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2Nyb3NzaGFpcicsICdMb2NhdGUgdGhpcyBlbGVtZW50IG9uIHRoZSBwYWdlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2xvY2F0ZS1mbGFzaCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICBzZXRTdGF0dXMoJ0xvY2F0aW5n4oCmJyk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbWVzc2FnZS1zcXVhcmUtcGx1cycsICdBZGQgYSBjb21tZW50IGFmdGVyIHRoaXMgY2FwdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGNvbnN0IGJlZm9yZUlkID0gaWR4ID49IDAgJiYgaWR4IDwgbWVzc2FnZXMubGVuZ3RoIC0gMSA/IG1lc3NhZ2VzW2lkeCArIDFdIS5pZCA6ICdfX2VuZF9fJztcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7XG4gICAgICByZW5kZXIoKTtcbiAgICB9LCB7c2l6ZTogMTV9KSk7XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIC8vIFNwbGl0LWdyb3VwIGFjdGlvbjogcHJvbW90ZSBlYWNoIGdyb3VwIG1lbWJlciBiYWNrIHRvIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzZWxlY3RvciBlbnRyeSwgdGhlbiBmaXJlIGEgZnJlc2ggZWxlbWVudCBzY3JlZW5zaG90XG4gICAgICAvLyBmb3IgZWFjaCBwcm9tb3RlZCBtZW1iZXIuIEdyb3VwIGNhcHR1cmVzIHNoYXJlIGEgc2luZ2xlIHVuaW9uLVxuICAgICAgLy8gYmJveCBzY3JlZW5zaG90IGtleWVkIG9uIHRoZSBoZWFkOyB0aGUgbWVtYmVycyBuZXZlciBnZXQgdGhlaXJcbiAgICAgIC8vIG93biBlbGVtZW50IHNob3RzIHVudGlsIHNwbGl0LiBBZnRlciB0aGlzLCBlYWNoIGNoaWxkIGhhcyBpdHNcbiAgICAgIC8vIG93biByaW5nICsgdGh1bWJuYWlsLlxuICAgICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdsaXN0LXRyZWUnLCBgU3BsaXQgdGhpcyBncm91cCBvZiAke2dyb3VwQ291bnR9IGludG8gaW5kaXZpZHVhbCBlbnRyaWVzYCwgKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICAgIGlmIChpZHggPCAwKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBtLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgICBkZWxldGUgbS5lbnRyeS5ncm91cDtcbiAgICAgICAgY29uc3QgZnJlc2g6IFNlbGVjdG9yTWVzc2FnZVtdID0gbWVtYmVycy5tYXAoKGVudHJ5KSA9PiAoe1xuICAgICAgICAgIHR5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogZW50cnkudHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeSxcbiAgICAgICAgfSkpO1xuICAgICAgICBtZXNzYWdlcy5zcGxpY2UoaWR4ICsgMSwgMCwgLi4uZnJlc2gpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGdyb3VwIG9mICR7bWVtYmVycy5sZW5ndGh9IMK3IGNhcHR1cmluZyBzY3JlZW5zaG90c+KApmApO1xuICAgICAgICAvLyBGaXJlIHBlci1tZW1iZXIgZWxlbWVudCBzaG90cyDigJQgc2VxdWVudGlhbGx5IHNvIHRoZXkgZG9uJ3RcbiAgICAgICAgLy8gcmFjZSBjYXB0dXJlVmlzaWJsZVRhYi4gRmFpbHVyZXMgKHNlbGVjdG9yIG5vIGxvbmdlciBtYXRjaGVzLFxuICAgICAgICAvLyBob3N0IG9uIHNraXAtbGlzdCkgbGVhdmUgdGhlIG1lbWJlciB3aXRob3V0IGEgdGh1bWJuYWlsIGJ1dFxuICAgICAgICAvLyBkb24ndCBibG9jayB0aGUgb3RoZXJzLlxuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGNhcHR1cmVkID0gMDtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGZyZXNoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCBmaXJlRWxlbWVudFNob3QoY2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoY2hpbGQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgY2FwdHVyZWQrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ3NwbGl0LWdyb3VwIHNob3QgZmFpbGVkIGZvcicsIGNoaWxkLmVudHJ5LnNlbGVjdG9yLCBlKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGRvbmUgwrcgJHtjYXB0dXJlZH0vJHttZW1iZXJzLmxlbmd0aH0gc2NyZWVuc2hvdHNgKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdleHRlcm5hbC1saW5rJywgJ0xvZyB0aGUgZWxlbWVudCBhbmQgY29weSBhIGNvbnNvbGUgc25pcHBldCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtzbmlwcGV0Pzogc3RyaW5nfT4oe2tpbmQ6ICdsb2ctZWxlbWVudCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGNvbnN0IHNuaXBwZXQgPSByZXBseT8uc25pcHBldCA/PyBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignJHttLmVudHJ5LnNlbGVjdG9yfScpYDtcbiAgICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNuaXBwZXQpOyBzZXRTdGF0dXMoJ0xvZ2dlZCArIGNvcGllZCBjb25zb2xlIHNuaXBwZXQnKTsgc2hvd0NvcGllZCgnQ29waWVkIHNuaXBwZXQnKTsgfVxuICAgICAgY2F0Y2ggeyBzZXRTdGF0dXMoJ0xvZ2dlZCB0byBjb25zb2xlJyk7IH1cbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdyZWZyZXNoLWN3JywgJ1JlLWNhcHR1cmUgdGhpcyBlbGVtZW50IGZyb20gdGhlIGxpdmUgcGFnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtraW5kOiAncmVjYXB0dXJlJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIG46IG0uZW50cnkubn0pO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5lbnRyeSkge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLmVudHJ5ID0gcmVwbHkuZW50cnk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cygnUmUtY2FwdHVyZWQnKTtcblxuICAgICAgfSBlbHNlIHNldFN0YXR1cygnUmUtY2FwdHVyZSBmYWlsZWQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoSlNPTi5zdHJpbmdpZnkobS5lbnRyeSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgZW50cnknKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBlbnRyeScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckZlZWRiYWNrID0gKG06IEZlZWRiYWNrTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIGZlZWRiYWNrJztcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSBkaXYuY2xhc3NMaXN0LmFkZCgndGhyZWFkZWQnKTtcbiAgICBkaXYuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgZGl2LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKG0udGV4dCwgc2VhcmNoUXVlcnkpO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIHtcbiAgICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBzZWxlY3RvciDigJQgcHJlZmVyIHBhcmVudFVpZCAodGhlIHBlcnNpc3RlZCBGSylcbiAgICAgIC8vIG92ZXIgY2FwdHVyZS1hZGphY2VuY3ksIHNpbmNlIGRyYWctdG8tcmVwYXJlbnQgbW92ZXMgdGhlIGNoaXAgYnV0XG4gICAgICAvLyB0aGUgdHJhaWxpbmctc2VsZWN0b3IgaGV1cmlzdGljIGdpdmVzIHN0YWxlIHJlc3VsdHMgdW50aWwgcmVuZGVyXG4gICAgICAvLyBzZXR0bGVzLiBUaGUgYW5ub3RhdGlvbiBvdmVybGF5IG5lZWRzIHRoZSBwYXJlbnQncyBzZWxlY3RvciB0b1xuICAgICAgLy8gYW5jaG9yIHRoZSBvbi1wYWdlIHRvb2x0aXAuXG4gICAgICBjb25zdCB7cGFyZW50U2VsLCBwYXJlbnRVaWR9ID0gKCgpID0+IHtcbiAgICAgICAgaWYgKG0ucGFyZW50VWlkKSB7XG4gICAgICAgICAgY29uc3QgcCA9IG1lc3NhZ2VzLmZpbmQoXG4gICAgICAgICAgICAobW0pID0+IG1tLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKG1tIGFzIFNlbGVjdG9yTWVzc2FnZSkuZW50cnkudWlkID09PSBtLnBhcmVudFVpZCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChwICYmIHAudHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHtwYXJlbnRTZWw6IHAuZW50cnkuc2VsZWN0b3IsIHBhcmVudFVpZDogcC5lbnRyeS51aWR9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7cGFyZW50U2VsOiBsYXN0U2VsZWN0b3JTZWwsIHBhcmVudFVpZDogdW5kZWZpbmVkIGFzIHN0cmluZyB8IHVuZGVmaW5lZH07XG4gICAgICB9KSgpO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgLy8gU2Nyb2xsIHRoZSBwYXJlbnQgZWxlbWVudCBpbnRvIHZpZXcgKyBzaG93IHRoZSBvbi1wYWdlXG4gICAgICAgIC8vIGFubm90YXRpb24gdG9vbHRpcCByZW5kZXJpbmcgVEhJUyBjb21tZW50J3MgdGV4dC4gUGFzcyB0aGVcbiAgICAgICAgLy8gcGFyZW50J3MgdWlkIHNvIGEgc2FtZS1zZWxlY3RvciBzaWJsaW5nIGNhcHR1cmUgZG9lc24ndCBnZXRcbiAgICAgICAgLy8gbWlzdGFrZW5seSBpZGVudGlmaWVkIGFzIFwidGhlIHNhbWUgdGFyZ2V0XCIgYnkgdGhlIGNvbnRlbnRcbiAgICAgICAgLy8gc2NyaXB0J3MgYW5ub3RhdGlvbiBvdmVybGF5LlxuICAgICAgICBpZiAocHJlZnMuYXV0b1Njcm9sbFRvSG92ZXJlZCkge1xuICAgICAgICAgIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgc3RpY2t5OiB0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZFRvQ1Moe1xuICAgICAgICAgIGtpbmQ6ICdhbm5vdGF0aW9uJyxcbiAgICAgICAgICBzZWxlY3RvcjogcGFyZW50U2VsLFxuICAgICAgICAgIHBheWxvYWQ6IHtzZWxlY3RvcjogcGFyZW50U2VsLCB1aWQ6IHBhcmVudFVpZCwgY2FwdHVyZWQ6IHRydWUsIGZlZWRiYWNrOiBbbS50ZXh0XX0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZGl2LmRhdGFzZXQuY29tbWVudElkID0gbS5pZDtcbiAgICBjb25zdCBiZWdpbkNvbW1lbnREcmFnID0gKGU6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcsIG0uaWQpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ3RleHQvcGxhaW4nLCBtLnRleHQpO1xuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgIH07XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFjdGlvbnMuY2xhc3NOYW1lID0gJ2FjdGlvbnMnO1xuICAgIGNvbnN0IGRyYWdIYW5kbGUgPSBhY3Rpb25CdG4oJ2dyaXAnLCAnRHJhZyB0aGlzIGhhbmRsZSBvbnRvIGEgc2VsZWN0b3IgdG8gcmVwYXJlbnQnLCAoKSA9PiB7IC8qIGRyYWcgaGFuZGxlIG9ubHkgKi8gfSk7XG4gICAgZHJhZ0hhbmRsZS5jbGFzc0xpc3QuYWRkKCdkcmFnLWhhbmRsZScpO1xuICAgIGRyYWdIYW5kbGUuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGJlZ2luQ29tbWVudERyYWcpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRyYWdIYW5kbGUpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IGNvbW1lbnQgdGV4dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KG0udGV4dCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY29tbWVudCcpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3BlbmNpbCcsICdFZGl0IGNvbW1lbnQnLCAoKSA9PiBlbnRlckZlZWRiYWNrRWRpdChkaXYsIG0pLCB7c2l6ZTogMTV9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgLy8gRHJvcCBoYW5kbGVyIHNoYXJlZCBieSBldmVyeSBzZWxlY3RvciBidWJibGUuIEFjY2VwdHMgYSBkcmFnZ2VkXG4gIC8vIGNvbW1lbnQgSUQgdmlhIHRoZSBgYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudGAgTUlNRSwgdXBkYXRlc1xuICAvLyBwYXJlbnRVaWQgKyBhZGphY2VuY3ksIHBlcnNpc3RzLCByZS1yZW5kZXJzLlxuICBjb25zdCB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IFNlbGVjdG9yTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICBjb25zdCB0eXBlcyA9IGUuZGF0YVRyYW5zZmVyPy50eXBlcztcbiAgICAgIGlmICghdHlwZXMgfHwgIUFycmF5LmZyb20odHlwZXMpLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JykpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcm9wLXRhcmdldCcpO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZSkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyPy5nZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50Jyk7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBzcmNJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gaWQpO1xuICAgICAgaWYgKHNyY0lkeCA8IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHNyYyA9IG1lc3NhZ2VzW3NyY0lkeF0hIGFzIEZlZWRiYWNrTWVzc2FnZTtcbiAgICAgIGlmIChzcmMudHlwZSAhPT0gJ2ZlZWRiYWNrJykgcmV0dXJuO1xuICAgICAgY29uc3QgZHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgaWYgKGRzdElkeCA8IDApIHJldHVybjtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICAvLyBVcGRhdGUgdGhlIEZLIHBvaW50ZXIgZmlyc3Qg4oCUIHRoYXQncyB0aGUgc291cmNlIG9mIHRydXRoIGluXG4gICAgICAvLyBleHBvcnRzLiBBZGphY2VuY3kgaXMganVzdCBhIHJlbmRlciBjb252ZW5pZW5jZS5cbiAgICAgIHNyYy5wYXJlbnRVaWQgPSBtLmVudHJ5LnVpZDtcbiAgICAgIC8vIFNwbGljZSBzcmMgb3V0IG9mIGl0cyBjdXJyZW50IHNsb3QgYW5kIHJlLWluc2VydCByaWdodCBhZnRlciB0aGVcbiAgICAgIC8vIG5ldyBwYXJlbnQgKGFuZCBhbnkgZmVlZGJhY2sgYWxyZWFkeSB0cmFpbGluZyBpdCwgc28gdGhlIG1vc3QtXG4gICAgICAvLyByZWNlbnQgZmVlZGJhY2sgZW5kcyB1cCBuZWFyZXN0IHRoZSBwYXJlbnQgdmlzdWFsbHkpLlxuICAgICAgbWVzc2FnZXMuc3BsaWNlKHNyY0lkeCwgMSk7XG4gICAgICBjb25zdCBuZXdEc3RJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBsZXQgaW5zZXJ0QXQgPSBuZXdEc3RJZHggKyAxO1xuICAgICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XSEudHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwgc3JjKTtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IHJlcGFyZW50ZWQnKTtcbiAgICB9KTtcbiAgfTtcblxuICB0eXBlIEFjdGlvbkJ0bk9wdHMgPSB7d2Fybj86IGJvb2xlYW47IHRvZ2dsZWQ/OiBib29sZWFuOyBzaXplPzogbnVtYmVyfTtcbiAgY29uc3QgYWN0aW9uQnRuID0gKGljb246IHN0cmluZywgdGl0bGU6IHN0cmluZywgZm46ICgpID0+IHZvaWQsIG9wdHM6IEFjdGlvbkJ0bk9wdHMgPSB7fSk6IEhUTUxCdXR0b25FbGVtZW50ID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYi50eXBlID0gJ2J1dHRvbic7XG4gICAgYi5kYXRhc2V0LnRpcCA9IHRpdGxlO1xuICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGl0bGUpO1xuICAgIGlmIChvcHRzLndhcm4pIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGlmIChvcHRzLnRvZ2dsZWQpIGIuY2xhc3NMaXN0LmFkZCgndG9nZ2xlZCcpO1xuICAgIC8vIERlZmF1bHQgaWNvbiBzaXplIDEzIHJlYWRzIHNsaWdodGx5IHNtYWxsIGluIGEgMjLDlzIyIGJ1dHRvbiDigJQgZmluZVxuICAgIC8vIGZvciBpY29ucyB3aXRoIHNpbXBsZSBzaGFwZXMgKGNyb3NzaGFpciwgbGlzdC10cmVlLCB1bmRvKSBidXQgdmlzaWJseVxuICAgIC8vIHNxdWVlemVkIGZvciBgbWVzc2FnZS1zcXVhcmUtcGx1c2AgYW5kIGBwZW5jaWxgLCB3aGVyZSB0aGVcbiAgICAvLyBpbnRlcmlvciBzdHJva2VzIHZhbmlzaCBpbnRvIGhhaXJsaW5lIGJsdXIuIENhbGxlcnMgY2FuIGJ1bXAgd2l0aFxuICAgIC8vIGBzaXplOiAxNWAgZm9yIHRob3NlLlxuICAgIGIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKGljb24sIG9wdHMuc2l6ZSA/PyAxMyk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGZuKCk7IH0pO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUJ0biA9IChvbkNvbmZpcm06ICgpID0+IHZvaWQpOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGIuZGF0YXNldC50aXAgPSAnRGVsZXRlJztcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdEZWxldGUgY2FwdHVyZScpO1xuICAgIGIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgIGxldCBwYXJlbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJldmVydFRpbWVyID0gMDtcbiAgICBjb25zdCByZXZlcnQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBhcmVudCkgcmV0dXJuO1xuICAgICAgZm9yIChjb25zdCBuIG9mIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29uZmlybS15ZXMsIC5jb25maXJtLW5vJykpIG4ucmVtb3ZlKCk7XG4gICAgICBpZiAoIWIucGFyZW50RWxlbWVudCkgcGFyZW50LmFwcGVuZChiKTtcbiAgICAgIGNsZWFyVGltZW91dChyZXZlcnRUaW1lcik7XG4gICAgfTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBwYXJlbnQgPSBiLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCB5ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIHllcy50eXBlID0gJ2J1dHRvbic7XG4gICAgICB5ZXMuY2xhc3NOYW1lID0gJ2NvbmZpcm0teWVzJztcbiAgICAgIHllcy5kYXRhc2V0LnRpcCA9ICdDb25maXJtIGRlbGV0ZSc7XG4gICAgICB5ZXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NvbmZpcm0gZGVsZXRlJyk7XG4gICAgICB5ZXMuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGVjaycsIDEzKTtcbiAgICAgIHllcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4geyBldi5zdG9wUHJvcGFnYXRpb24oKTsgcmV2ZXJ0KCk7IG9uQ29uZmlybSgpOyB9KTtcbiAgICAgIGNvbnN0IG5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBuby50eXBlID0gJ2J1dHRvbic7XG4gICAgICBuby5jbGFzc05hbWUgPSAnY29uZmlybS1ubyc7XG4gICAgICBuby5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgZGVsZXRlJztcbiAgICAgIG5vLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgZGVsZXRlJyk7XG4gICAgICBuby5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAxMyk7XG4gICAgICBuby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4geyBldi5zdG9wUHJvcGFnYXRpb24oKTsgcmV2ZXJ0KCk7IH0pO1xuICAgICAgYi5yZXBsYWNlV2l0aCh5ZXMpO1xuICAgICAgeWVzLmFmdGVyKG5vKTtcbiAgICAgIHJldmVydFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQocmV2ZXJ0LCA4MDAwKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBlbnRlckZlZWRiYWNrRWRpdCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBGZWVkYmFja01lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmV4dC5jbGFzc05hbWUgPSAnbXNnIGZlZWRiYWNrIGVkaXRpbmcnO1xuICAgIGlmIChkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aHJlYWRlZCcpKSBuZXh0LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgbmV4dC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBuZXh0LmFwcGVuZChidWlsZElubGluZUNvbW1lbnQoe1xuICAgICAgaW5pdGlhbDogbS50ZXh0LFxuICAgICAgb25DYW5jZWw6ICgpID0+IHsgZGl2LnJlcGxhY2VXaXRoKGRpdi5jbG9uZU5vZGUodHJ1ZSkpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4ge1xuICAgICAgICBjb25zdCB0cmltbWVkID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRyaW1tZWQgPT09IG0udGV4dCkgeyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG0udGV4dCA9IHRyaW1tZWQ7XG4gICAgICAgIC8vIFNldmVyaXR5IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgVUkuIFN0cmlwIGFueSBsZWdhY3kgdmFsdWVcbiAgICAgICAgLy8gdGhhdCBjYW1lIGJhY2sgZnJvbSBhbiBvbGRlciBKU09OTCBpbXBvcnQgc28gc2F2ZXMgZG9uJ3Qga2VlcFxuICAgICAgICAvLyByZS1lbWl0dGluZyBpdC5cbiAgICAgICAgZGVsZXRlIChtIGFzIGFueSkuc2V2ZXJpdHk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgIH0pKTtcbiAgICBkaXYucmVwbGFjZVdpdGgobmV4dCk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlTWVzc2FnZSA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgY29uc3QgZmluaXNoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmlkICE9PSBpZCk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnRGVsZXRlZCcpO1xuICAgIH07XG4gICAgaWYgKCFlbCkgeyBmaW5pc2goKTsgcmV0dXJuOyB9XG4gICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICB2b2lkIGVsLm9mZnNldFdpZHRoO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3JlbW92aW5nJyk7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBjbGVhbnVwID0gKCk6IHZvaWQgPT4geyBpZiAoZG9uZSkgcmV0dXJuOyBkb25lID0gdHJ1ZTsgZmluaXNoKCk7IH07XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGNsZWFudXAsIHtvbmNlOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dChjbGVhbnVwLCAzODApO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBDb21wb3NlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZEZlZWRiYWNrID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBjb21wb3Nlci52YWx1ZS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIGluLW1lbW9yeSBtZXNzYWdlIGF0IGNyZWF0aW9uIHRpbWUgc28gdGhlXG4gICAgLy8gRksgaXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGguIFRoZSBzbGltIGVtaXQgbm8gbG9uZ2VyIGhhcyB0b1xuICAgIC8vIGluZmVyIHRoZSBwYXJlbnQgZnJvbSBjYXB0dXJlLWFkamFjZW5jeSwgYW5kIGBtYW5pZmVzdC5jb3VudHNgXG4gICAgLy8gYWNjdXJhdGVseSByZWZsZWN0cyBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycy5cbiAgICAvLyBXYWxrIGJhY2sgdG8gdGhlIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yIGJlZm9yZSBzcGxpY2UuXG4gICAgbGV0IHBJZHggPSBwb3NpdGlvbiAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9KTtcbiAgICBjb21wb3Nlci52YWx1ZSA9ICcnO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICBpZiAoc2VhcmNoUXVlcnkpIHsgc2VhcmNoUXVlcnkgPSAnJzsgc2VhcmNoLnZhbHVlID0gJyc7IH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdTZW50Jyk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAvLyBCdWcgIzI6IGZlZWRiYWNrJ3MgcGFyZW50IHNob3VsZCBoYXZlIGEgc2NyZWVuc2hvdC5cbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InICYmICFwYXJlbnQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgdm9pZCBmaXJlRWxlbWVudFNob3QocGFyZW50IGFzIFNlbGVjdG9yTWVzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyAoZSkgPT4ge1xuICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYW5kbGVkID0gYXdhaXQgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlcigpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBzZW5kRmVlZGJhY2soKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyAmJiBpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgc2V0U3RhdHVzKCdJbnNlcnQgbW9kZSBjYW5jZWxsZWQnKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCB1cGRhdGVDb21wb3Nlck1ldGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHQgPSBjb21wb3Nlci52YWx1ZTtcbiAgICBjb21wV29yZHMudGV4dENvbnRlbnQgPSBTdHJpbmcod29yZENvdW50KHQpKTtcbiAgICBjb21wVG9rZW5zLnRleHRDb250ZW50ID0gU3RyaW5nKHRva2VuQ291bnQodCkpO1xuICAgIGNvbXBvc2VyLmNsYXNzTGlzdC50b2dnbGUoJ2NtZC1tb2RlJywgL14+Ly50ZXN0KHQudHJpbSgpKSk7XG4gIH07XG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdXBkYXRlQ29tcG9zZXJNZXRlcik7XG5cbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIHNlYXJjaFF1ZXJ5ID0gc2VhcmNoLnZhbHVlLnRyaW0oKTtcbiAgICByZW5kZXIoKTtcbiAgICAvLyBCcmluZyB0aGUgZmlyc3QgbWF0Y2hlZCBidWJibGUgKyBpdHMgZmlyc3QgPG1hcms+IGludG8gdmlldywgc28gdGhlXG4gICAgLy8gdXNlciBzZWVzIHdoZXJlIHRoZSBoaXQgaXMgd2l0aG91dCBzY3JvbGxpbmcgbWFudWFsbHkuXG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaXJzdEhpdCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cuc2VsZWN0b3Iuc2VhcmNoLWhpdCcpO1xuICAgICAgICBpZiAoZmlyc3RIaXQpIHtcbiAgICAgICAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGZpcnN0SGl0KTtcbiAgICAgICAgICBjb25zdCBtayA9IGZpcnN0SGl0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdtYXJrJyk7XG4gICAgICAgICAgaWYgKG1rKSBjZW50ZXJFbGVtZW50SW5MaXN0KG1rKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBmaXJzdE1hdGNoID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZyBtYXJrJyk7XG4gICAgICAgICAgaWYgKGZpcnN0TWF0Y2gpIGNlbnRlckVsZW1lbnRJbkxpc3QoZmlyc3RNYXRjaCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gICQoJ1tkYXRhLXNlYXJjaC1jbGVhcl0nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgc2VhcmNoLnZhbHVlID0gJyc7IHNlYXJjaFF1ZXJ5ID0gJyc7IHJlbmRlcigpOyB9KTtcblxuICBjb25zdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IG0gPSAvXj5cXHMqKC4rKSQvLmV4ZWMoY29tcG9zZXIudmFsdWUudHJpbSgpKTtcbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBzZWwgPSBtWzFdIS50cmltKCk7XG4gICAgaWYgKCFzZWwpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW59Pih7a2luZDogJ21hbnVhbC1jYXB0dXJlJywgc2VsZWN0b3I6IHNlbH0pO1xuICAgIGlmIChyZXBseT8ub2spIHsgY29tcG9zZXIudmFsdWUgPSAnJzsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyBzZXRTdGF0dXMoJ0NhcHR1cmVkICcgKyBzZWwpOyB9XG4gICAgZWxzZSBzZXRTdGF0dXMoJ1NlbGVjdG9yIGRpZCBub3QgbWF0Y2g6ICcgKyBzZWwsIHtraW5kOiAnd2Fybid9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0IGJ1aWxkZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyB2MiBleHBvcnQgc2hhcGU6IHRvcCBsZXZlbCBrZWVwcyB1c2VyLWZhY2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHNcbiAgLy8gKHVpZCwgbiwgc2VsZWN0b3IsIHRleHQsIHJvbGUsIGF0dHJzLCBoaW50cywgY2xhc3Nlcywgc3R5bGVzLCBjb21wb25lbnQsXG4gIC8vIHN0YXRlcywgc2NyZWVuc2hvdCwgZ3JvdXApLiBEaWFnbm9zdGljIC8gZGV0ZWN0aW9uIG1ldGFkYXRhIG1vdmVzIHVuZGVyXG4gIC8vIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBpblNoYWRvd0RPTSxcbiAgLy8gcHNldWRvRWxlbWVudHMsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBUaGUgdmVyc2lvbiBtYXJrZXIgaXMgZW1pdHRlZFxuICAvLyBhcyBgdjogMmAuIEltcG9ydGVycyBkZXRlY3QgZWl0aGVyIHYxIChmbGF0KSBvciB2MiBhbmQgZGVub3JtYWxpemUuXG4gIC8vXG4gIC8vIEFnZ3Jlc3NpdmUgbWluaWZ5IGFkZGl0aW9uYWxseSBkcm9wcyBmaWVsZHMgdGhlIHNlbGVjdG9yIGFscmVhZHlcbiAgLy8gaW1wbGllczogYW5jZXN0b3JzLCB2aWV3cG9ydCAob25lIHBlciBwYWdlKSwgY29tcG9uZW50Um9vdCB3aGVuXG4gIC8vIHJlZHVuZGFudCB3aXRoIHRoZSBzZWxlY3RvciwgYW5kIHBzZXVkb0VsZW1lbnRzLlxuICBjb25zdCBzbGltRW50cnkgPSAoZTogRW50cnksIG9wdHM6IHtpbmNsdWRlR3JvdXA/OiBib29sZWFuOyBldmVudEluZGV4PzogbnVtYmVyOyB2aXN1YWxPcmRlcj86IG51bWJlcjsgZ3JvdXBVaWQ/OiBzdHJpbmd9ID0ge30pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0+IHtcbiAgICBjb25zdCBpbmNsdWRlT3V0ZXIgPSBwcmVmcy5pbmNsdWRlT3V0ZXJIVE1MO1xuICAgIGNvbnN0IGluY2x1ZGVNYXRjaGVkID0gcHJlZnMuaW5jbHVkZU1hdGNoZWRSdWxlcztcbiAgICBjb25zdCBpbmNsdWRlU3R5bGVzID0gcHJlZnMuaW5jbHVkZVN0eWxlcztcbiAgICBjb25zdCBtaW5pZnkgPSBwcmVmcy5taW5pZnk7XG5cbiAgICAvLyBUb3AtbGV2ZWwgdXNlci1mYWNpbmcgZmllbGRzLiBPcmRlciBtYXR0ZXJzIGZvciBvdXRwdXQgcmVhZGFiaWxpdHkg4oCUXG4gICAgLy8gd2Ugd2FudCBgdiAvIHR5cGUgLyB1aWQgLyBuIC8gc2VsZWN0b3JgIGZpcnN0IHNvIEpTT05MIGlzIGdyZXBwYWJsZS5cbiAgICAvL1xuICAgIC8vIGBuYCBzdGF5cyBhcyB0aGUgY2FwdHVyZS1zZXF1ZW5jZSBkaXNwbGF5IGxhYmVsIGZvciBiYWNrd2FyZHNcbiAgICAvLyBjb21wYXRpYmlsaXR5IHdpdGggdjEvdjIgcmVhZGVycyAoYW5kIHRoZSBzaWRlYmFyJ3MgXCIjM1wiIGNoaXBzKS5cbiAgICAvLyBUaGUgZGlzYW1iaWd1YXRlZCBjb3VzaW5zIChgY2FwdHVyZUluZGV4YCwgYGV2ZW50SW5kZXhgLFxuICAgIC8vIGB2aXN1YWxPcmRlcmAsIGBkaXNwbGF5TGFiZWxgKSBsaXZlIG9uIHRoZSByb3cgc28gYSBkb3duc3RyZWFtXG4gICAgLy8gYWdlbnQgY2FuIHBpY2sgd2hpY2hldmVyIG9yZGVyaW5nIGlzIG1lYW5pbmdmdWwg4oCUIGJ1ZyAjMTAuXG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgdjogMixcbiAgICAgIHR5cGU6ICdzZWxlY3RvcicsXG4gICAgICB1aWQ6IGUudWlkLFxuICAgICAgbjogZS5uLFxuICAgICAgdHM6IGUudHMsXG4gICAgICB1cmw6IGUudXJsLFxuICAgICAgdGFnOiBlLnRhZyxcbiAgICAgIHNlbGVjdG9yOiBlLnNlbGVjdG9yLFxuICAgICAgY2FwdHVyZUluZGV4OiBlLm4sXG4gICAgICBkaXNwbGF5TGFiZWw6IFN0cmluZyhlLm4pLFxuICAgIH07XG4gICAgaWYgKG9wdHMuZXZlbnRJbmRleCAhPT0gdW5kZWZpbmVkKSBvdXQuZXZlbnRJbmRleCA9IG9wdHMuZXZlbnRJbmRleDtcbiAgICBpZiAob3B0cy52aXN1YWxPcmRlciAhPT0gdW5kZWZpbmVkKSBvdXQudmlzdWFsT3JkZXIgPSBvcHRzLnZpc3VhbE9yZGVyO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLnRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnRleHQgPSBtaW5pZnkgPyBlLnRleHQucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUudGV4dDtcbiAgICBpZiAoZS5yb2xlICE9PSB1bmRlZmluZWQpIG91dC5yb2xlID0gZS5yb2xlO1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IG1pbmlmeSA/IGUuYWNjZXNzaWJsZU5hbWUucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgaWYgKGUuaWQgIT09IHVuZGVmaW5lZCkgb3V0LmlkID0gZS5pZDtcbiAgICBpZiAoZS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgb3V0LnRlc3RJZCA9IGUudGVzdElkO1xuICAgIGlmIChlLmNsYXNzZXMgJiYgZS5jbGFzc2VzLmxlbmd0aCkge1xuICAgICAgb3V0LmNsYXNzZXMgPSAobWluaWZ5ICYmIGUuY2xhc3Nlcy5sZW5ndGggPiA4KSA/IGUuY2xhc3Nlcy5zbGljZSgwLCA4KSA6IGUuY2xhc3NlcztcbiAgICB9XG4gICAgaWYgKGUuYXR0cnMgJiYgT2JqZWN0LmtleXMoZS5hdHRycykubGVuZ3RoKSBvdXQuYXR0cnMgPSBlLmF0dHJzO1xuICAgIGlmIChlLmhpbnRzICYmIE9iamVjdC5rZXlzKGUuaGludHMpLmxlbmd0aCkgb3V0LmhpbnRzID0gZS5oaW50cztcbiAgICBpZiAoZS5yZWN0KSBvdXQucmVjdCA9IGUucmVjdDtcbiAgICBpZiAoZS5zdGF0ZXMgJiYgZS5zdGF0ZXMubGVuZ3RoKSBvdXQuc3RhdGVzID0gZS5zdGF0ZXM7XG4gICAgaWYgKGUuY29tcG9uZW50KSBvdXQuY29tcG9uZW50ID0gZS5jb21wb25lbnQ7XG4gICAgLy8gTG9jYXRvci1xdWFsaXR5IGZpZWxkLiBQcm9tb3RlIGV2ZW4gd2hlbiBtaW5pZmllZCDigJQgaXQncyBhIHNpbmdsZVxuICAgIC8vIHNtYWxsIGludCBhbmQgYSBkb3duc3RyZWFtIGFnZW50IHVzZXMgaXQgdG8gZGVjaWRlIHdoZXRoZXIgdG9cbiAgICAvLyB0cnVzdCB0aGUgc2VsZWN0b3IuXG4gICAgaWYgKGUuc2VsZWN0b3JNYXRjaENvdW50ICE9PSB1bmRlZmluZWQpIG91dC5zZWxlY3Rvck1hdGNoQ291bnQgPSBlLnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgICBpZiAoZS5hMTF5KSBvdXQuYTExeSA9IGUuYTExeTtcbiAgICBpZiAoZS5hc3NldHMgJiYgZS5hc3NldHMubGVuZ3RoKSBvdXQuYXNzZXRzID0gZS5hc3NldHM7XG4gICAgaWYgKGUubGF5b3V0Q29udGV4dCAmJiBlLmxheW91dENvbnRleHQubGVuZ3RoKSBvdXQubGF5b3V0Q29udGV4dCA9IGUubGF5b3V0Q29udGV4dDtcbiAgICBpZiAoaW5jbHVkZU91dGVyICYmIGUub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG91dC5vdXRlckhUTUwgPSBtaW5pZnkgPyBlLm91dGVySFRNTC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5vdXRlckhUTUw7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlU3R5bGVzICYmIGUuc3R5bGVzICYmIE9iamVjdC5rZXlzKGUuc3R5bGVzKS5sZW5ndGgpIG91dC5zdHlsZXMgPSBlLnN0eWxlcztcbiAgICBpZiAoZS5zY3JlZW5zaG90KSB7XG4gICAgICAvLyBQYXRoIG5vcm1hbGl6YXRpb246IHRoZSBsaXZlIGBlbnRyeS5zY3JlZW5zaG90LmVsZW1lbnRgIGNhcnJpZXMgYVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeGVkIHBhdGggKGUuZy4gYGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZ2ApXG4gICAgICAvLyBiZWNhdXNlIHRoZSBiYWNrZ3JvdW5kJ3MgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBBUEkgc3RhbXBzXG4gICAgICAvLyB0aGUgd29ya3NwYWNlIGludG8gdGhlIG9uLWRpc2sgcGF0aC4gQnV0IHRoZSAudGFyLnpzdCBhcmNoaXZlXG4gICAgICAvLyBidW5kbGVzIHNjcmVlbnNob3RzIGZsYXQgYXQgYHNjcmVlbnNob3RzL2Zvby5wbmdgLCBzbyB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXggd291bGQgcmVzb2x2ZSB0byBub3RoaW5nIGZvciBhbiBhZ2VudCB0aGF0XG4gICAgICAvLyBleHRyYWN0ZWQgdGhlIGFyY2hpdmUuIFN0cmlwIHRoZSB3b3Jrc3BhY2UgcHJlZml4IG9uIGVtaXQgc29cbiAgICAgIC8vIGV2ZXJ5IHBhdGggaXMgdmFsaWQgcmVsYXRpdmUgdG8gdGhlIG1hbmlmZXN0J3MgZGVjbGFyZWRcbiAgICAgIC8vIGBwYXRoUm9vdGAgKGFyY2hpdmUgcm9vdCBmb3IgdGFyLnpzdDsgd29ya3NwYWNlIHJvb3QgZm9yIHBsYWluXG4gICAgICAvLyBKU09OTCDigJQgaS5lLiwgYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgY29uc3Qgc3RyaXBXcyA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBpZiAoIXApIHJldHVybiBwO1xuICAgICAgICAvLyBTdHJpcCBleGFjdGx5IG9uZSBsZWFkaW5nIGA8d29ya3NwYWNlPi9gIHNlZ21lbnQgaWYgcHJlc2VudC5cbiAgICAgICAgY29uc3Qgd3NQcmVmaXggPSBgJHthY3RpdmVXc30vYDtcbiAgICAgICAgcmV0dXJuIHAuc3RhcnRzV2l0aCh3c1ByZWZpeCkgPyBwLnNsaWNlKHdzUHJlZml4Lmxlbmd0aCkgOiBwO1xuICAgICAgfTtcbiAgICAgIG91dC5zY3JlZW5zaG90ID0gey4uLmUuc2NyZWVuc2hvdH07XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZWxlbWVudCkgb3V0LnNjcmVlbnNob3QuZWxlbWVudCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZWxlbWVudCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZ3JvdXApIG91dC5zY3JlZW5zaG90Lmdyb3VwID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5ncm91cCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QucGFnZSkgb3V0LnNjcmVlbnNob3QucGFnZSA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QucGFnZSk7XG4gICAgfVxuICAgIC8vIFByb21vdGUgcnVudGltZS9iZWhhdmlvciBzaWduYWxzIHRvIHRvcC1sZXZlbC4gVGhlc2UgYXJlIHByaW1hcnlcbiAgICAvLyBzaWduYWwgZm9yIHRyaWFnZSAoZXZlbnRzIHRlbGxzIFwid2hpY2ggaGFuZGxlciByYW5cIiwgYmVoYXZpb3JBdHRyc1xuICAgIC8vIHRlbGxzIFwid2hhdCBzZXJ2ZXItcmVuZGVyZWQgYmluZGluZyBkb2VzIHRoaXMgZmlyZVwiLCBjYW52YXNDbGlja1xuICAgIC8vIHRlbGxzIFwid2hlcmUgb24gdGhlIGNoYXJ0IHdhcyBjbGlja2VkXCIsIGVkaXRvciB0ZWxscyBcIndoaWNoXG4gICAgLy8gcmljaC10ZXh0IGxpYnJhcnkgd3JhcHMgdGhpc1wiLCBkb21NdXRhdGlvbnMgdGVsbHMgXCJ3aGF0IGNoYW5nZWRcbiAgICAvLyBiZWZvcmUgdGhlIGNsaWNrXCIsIGlzQW5pbWF0aW5nIHdhcm5zIGFib3V0IHRyYW5zaWVudCBzdGF0ZSkuXG4gICAgaWYgKGUuZXZlbnRzICYmIE9iamVjdC5rZXlzKGUuZXZlbnRzKS5sZW5ndGgpIG91dC5ldmVudHMgPSBlLmV2ZW50cztcbiAgICBpZiAoZS5iZWhhdmlvckF0dHJzICYmIE9iamVjdC5rZXlzKGUuYmVoYXZpb3JBdHRycykubGVuZ3RoKSBvdXQuYmVoYXZpb3JBdHRycyA9IGUuYmVoYXZpb3JBdHRycztcbiAgICBpZiAoZS5jYW52YXNDbGljaykgb3V0LmNhbnZhc0NsaWNrID0gZS5jYW52YXNDbGljaztcbiAgICBpZiAoZS5lZGl0b3IpIG91dC5lZGl0b3IgPSBlLmVkaXRvcjtcbiAgICBpZiAoZS5pc0FuaW1hdGluZykgb3V0LmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICBpZiAoZS5zaGFkb3dIb3N0KSBvdXQuc2hhZG93SG9zdCA9IGUuc2hhZG93SG9zdDtcbiAgICBpZiAoZS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnJlbmRlcmVkVGV4dCA9IGUucmVuZGVyZWRUZXh0O1xuICAgIGlmIChlLnRydW5jYXRlZCAmJiBPYmplY3Qua2V5cyhlLnRydW5jYXRlZCkubGVuZ3RoKSBvdXQudHJ1bmNhdGVkID0gZS50cnVuY2F0ZWQ7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUuZG9tTXV0YXRpb25zICYmIGUuZG9tTXV0YXRpb25zLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGUuZG9tTXV0YXRpb25zO1xuXG4gICAgLy8gX2F1ZGl0OiBkZXRlY3Rpb24gY2hhaW4gJiBkaWFnbm9zdGljIHNoYXBlLlxuICAgIC8vIFJFQURNRSBjbGFpbWVkIGBfYXVkaXQuYW5jZXN0b3JzYCBhbmQgYF9hdWRpdC5jb21wb25lbnRSb290YCB3ZXJlXG4gICAgLy8gYWx3YXlzIHByZXNlbnQsIGJ1dCB0aGUgc2xpbSBlbWl0IGRyb3BwZWQgdGhlbSB3aGVuZXZlclxuICAgIC8vIGBtaW5pZnk6IHRydWVgLiBUaGUgZml4OiBlbWl0IGV2ZXJ5IGRlY2xhcmVkIGBfYXVkaXRgIGZpZWxkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHNvdXJjZSBkYXRhIGV4aXN0cywgYW5kIGxldFxuICAgIC8vIGBtaW5pZnlgIHNsaW0gT05MWSB0aGUgaGlnaC12b2x1bWUgYmxvY2tzIChtYXRjaGVkUnVsZXMsXG4gICAgLy8gcHNldWRvRWxlbWVudHMpLiBTbWFsbCBzdHJ1Y3R1cmFsIG1ldGFkYXRhIChhbmNlc3RvcnMsXG4gICAgLy8gY29tcG9uZW50Um9vdCwgdmlld3BvcnQpIHN1cnZpdmVzIG1pbmlmeSBzbyB0aGUgc2NoZW1hIGNsYWltc1xuICAgIC8vIHN0YXkgaG9uZXN0LlxuICAgIGNvbnN0IGF1ZGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGUuYW5jZXN0b3JzICYmIGUuYW5jZXN0b3JzLmxlbmd0aCkgYXVkaXQuYW5jZXN0b3JzID0gZS5hbmNlc3RvcnM7XG4gICAgaWYgKGUuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBhdWRpdC5jb21wb25lbnRSb290ID0gZS5jb21wb25lbnRSb290O1xuICAgIGlmIChlLmluU2hhZG93RE9NKSBhdWRpdC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgaWYgKGUucHNldWRvRWxlbWVudHMgJiYgT2JqZWN0LmtleXMoZS5wc2V1ZG9FbGVtZW50cykubGVuZ3RoICYmICFtaW5pZnkpIGF1ZGl0LnBzZXVkb0VsZW1lbnRzID0gZS5wc2V1ZG9FbGVtZW50cztcbiAgICBpZiAoaW5jbHVkZU1hdGNoZWQgJiYgZS5tYXRjaGVkUnVsZXMgJiYgZS5tYXRjaGVkUnVsZXMubGVuZ3RoKSB7XG4gICAgICBhdWRpdC5tYXRjaGVkUnVsZXMgPSBtaW5pZnlcbiAgICAgICAgPyBlLm1hdGNoZWRSdWxlcy5tYXAoKHIpID0+IHtcbiAgICAgICAgICBjb25zdCByMjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtzZWxlY3Rvcjogci5zZWxlY3Rvcn07XG4gICAgICAgICAgaWYgKHIuZGVjbGFyYXRpb25zICYmIE9iamVjdC5rZXlzKHIuZGVjbGFyYXRpb25zKS5sZW5ndGgpIHIyLmRlY2xhcmF0aW9ucyA9IHIuZGVjbGFyYXRpb25zO1xuICAgICAgICAgIGlmIChyLm1lZGlhKSByMi5tZWRpYSA9IHIubWVkaWE7XG4gICAgICAgICAgcmV0dXJuIHIyO1xuICAgICAgICB9KVxuICAgICAgICA6IGUubWF0Y2hlZFJ1bGVzO1xuICAgIH1cbiAgICBpZiAoZS52aWV3cG9ydCkgYXVkaXQudmlld3BvcnQgPSBlLnZpZXdwb3J0O1xuICAgIGlmIChPYmplY3Qua2V5cyhhdWRpdCkubGVuZ3RoKSBvdXQuX2F1ZGl0ID0gYXVkaXQ7XG5cbiAgICAvLyBHcm91cCBoZWFkIGxpbmthZ2UuIFByZXZpb3VzbHkgdGhlIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgXG4gICAgLy8gY2FycmllZCBmdWxsIG5lc3RlZCBlbnRyeSBvYmplY3RzLlxuICAgIC8vIFRoYXQgbWFkZSBEdWNrREIgam9pbnMgdWdseSBhbmQgYnJva2UgdGhlIHJ1bGUgdGhhdCBldmVyeVxuICAgIC8vIHNlbGVjdG9yIHNob3VsZCBiZSBhIHRvcC1sZXZlbCByb3cuIFdlIG5vdyBlbWl0OlxuICAgIC8vICAg4oCiIG9uIHRoZSBncm91cCBoZWFkOiBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlkLCB1aWQsIC4uLl1gIChqdXN0IElEcylcbiAgICAvLyAgIOKAoiBlYWNoIG1lbWJlciBhcyBpdHMgb3duIHRvcC1sZXZlbCBzbGltIHJvdyB3aXRoIGBncm91cFVpZGBcbiAgICAvLyAgICAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZCAoaGFuZGxlZCBpbiBgYnVpbGRTbGltYCBmbHVzaCBsb2dpYykuXG4gICAgaWYgKG9wdHMuaW5jbHVkZUdyb3VwICYmIGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgIG91dC5ncm91cE1lbWJlclVpZHMgPSBlLmdyb3VwLm1hcCgoZykgPT4gZy51aWQpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG4gICAgaWYgKG9wdHMuZ3JvdXBVaWQpIG91dC5ncm91cFVpZCA9IG9wdHMuZ3JvdXBVaWQ7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICAvLyDilIDilIDilIAgU2hhcmVkIFwic2xpbSBkYXRhXCIgcGlwZWxpbmUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEpTT05MIHJlbmRlcnMgb2ZmIHRoaXMgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uLiAoTWFya2Rvd24gdXNlZCB0b1xuICAvLyBzaGFyZSBpdDsgdGhlIE1hcmtkb3duIGV4cG9ydCB3YXMgcmV0aXJlZCBpbiBmYXZvciBvZiBKU09OTC1vbmx5LilcbiAgLy9cbiAgLy8gdjIgZGlmZmVyZW5jZXMgdnMgdjE6XG4gIC8vICAg4oCiIFNlbGVjdG9yIGxpbmVzIGhhdmUgZXhwbGljaXQgYHR5cGU6ICdzZWxlY3RvcidgIGFuZCBgdjogMmAuXG4gIC8vICAg4oCiIF9hdWRpdCBuZXN0cyBkZXRlY3Rpb24gLyBkZWJ1ZyBmaWVsZHMgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwg4oCmKS5cbiAgLy8gICDigKIgRmVlZGJhY2sgZW1pdHMgYXMgc3RhbmRhbG9uZSBge3R5cGU6J2ZlZWRiYWNrJywgcGFyZW50VWlkLCDigKZ9YCBsaW5lc1xuICAvLyAgICAgUExVUyBidW5kbGVkIGBmZWVkYmFja2AgYXJyYXlzIG9uIHNlbGVjdG9ycyAoc28gb2xkIHNpbmdsZS1saW5lXG4gIC8vICAgICByZWFkZXJzIHN0aWxsIHNlZSB0aGVtIGFkamFjZW50KS5cbiAgLy8gICDigKIgQSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgY2FycmllcyB3b3Jrc3BhY2UgKyBjb3VudHMgKyBmaWxlbmFtZS5cbiAgdHlwZSBTbGltUGFnZSA9IHt2OiAyOyB0eXBlOiAncGFnZSc7IHRzOiBzdHJpbmc7IHVybDogc3RyaW5nOyB0aXRsZT86IHN0cmluZzsgdmlld3BvcnQ/OiBWaWV3cG9ydDsgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgdXNlckFnZW50Pzogc3RyaW5nOyBsYW5nPzogc3RyaW5nOyBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307IHJvdXRlPzogYW55OyBzdGF0ZT86IGFueTsgc2Vzc2lvbklkPzogc3RyaW5nfTtcbiAgLy8gU2V2ZXJpdHkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgKDIwMjYtMDUpLiBUb2xlcmFudCByZWFkZXJzIG1heSBzdGlsbFxuICAvLyBzZWUgYHNldmVyaXR5YCBvbiBsZWdhY3kgSlNPTkwg4oCUIGRlbm9ybWFsaXplRW50cnkgcHJlc2VydmVzIGl0IG9uXG4gIC8vIEZlZWRiYWNrTWVzc2FnZSBzbyByZS1leHBvcnQgcm91bmQtdHJpcHMsIGJ1dCBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0XG4gIC8vIGl0IGFuZCB3ZSBkb24ndCBlbWl0IGl0IGhlcmUuIEtlZXAgdGhlIGZpZWxkIG9mZiBTbGltRmVlZGJhY2sgc28gbmV3XG4gIC8vIGV4cG9ydHMgc3RheSBjbGVhbi5cbiAgLy8gYHRhZ3NgIGlzIGFsd2F5cyBlbWl0dGVkIChkZWZhdWx0IGVtcHR5IGFycmF5KSBzbyBEdWNrREIgc2NoZW1hXG4gIC8vIGluZmVyZW5jZSBhbHdheXMgc2VlcyB0aGUgY29sdW1uLlxuICB0eXBlIFNsaW1GZWVkYmFjayA9IHt2OiAyOyB0eXBlOiAnZmVlZGJhY2snOyB1aWQ6IHN0cmluZzsgdHM6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmc7IHRhZ3M6IHN0cmluZ1tdOyBpc1Rlc3REYXRhPzogYm9vbGVhbn07XG4gIC8vIENoZWFwIHRlc3QtZGF0YSBzbmlmZjogbWF0Y2hlcyBzdHJpbmdzIHRoZSB1c2VyIHR5cGVzIHdoaWxlIHNtb2tlLVxuICAvLyB0ZXN0aW5nIHRoZSBleHRlbnNpb24gKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIiwgXCJsb3JlbSBpcHN1bVwiLFxuICAvLyBcInBsYWNlaG9sZGVyXCIsIG9yIGFueSBwaHJhc2Ugb2J2aW91c2x5IHN0dWJiZWQtb3V0KS4gRmFsc2UgcG9zaXRpdmVzXG4gIC8vIGhlcmUgYXJlIHJlY292ZXJhYmxlIOKAlCB0aGUgY29uc3VtZXIgY2FuIGlnbm9yZSB0aGUgZmxhZyDigJQgYnV0XG4gIC8vIGV4Y2x1ZGluZyByZWFsIGZlZWRiYWNrIHdvdWxkIG5vdCBiZSwgc28gd2Uga2VlcCB0aGUgcmVnZXggbmFycm93LlxuICBjb25zdCBURVNUX0RBVEFfUkUgPSAvXih0ZXN0fGFzZGZ8cXdlcnxmb298YmFyfGJhenxsb3JlbXxwbGFjZWhvbGRlcnx0b2RvfHh7Myx9fGhlbGxvIHdvcmxkfHNhbXBsZXxkdW1teXxzb21ldGhpbmd8YW55dGhpbmd8aWdub3JlIG1lfHdpcHx0YmR8blxcL2F8aGkpXFxiL2k7XG4gIGNvbnN0IGxvb2tzTGlrZVRlc3REYXRhID0gKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRyaW0oKTtcbiAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoVEVTVF9EQVRBX1JFLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIGlmICgvdGVzdCBmZWVkYmFjay9pLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgdHlwZSBTbGltU2VsZWN0b3IgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+ICYge3Y6IDI7IHR5cGU6ICdzZWxlY3Rvcic7IG46IG51bWJlcjsgc2VsZWN0b3I6IHN0cmluZzsgZmVlZGJhY2s/OiBzdHJpbmdbXX07XG4gIHR5cGUgU2xpbUxpbmUgPSBTbGltUGFnZSB8IFNsaW1GZWVkYmFjayB8IFNsaW1TZWxlY3RvcjtcbiAgY29uc3QgYnVpbGRTbGltID0gKCk6IFNsaW1MaW5lW10gPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBTbGltTGluZVtdID0gW107XG4gICAgLy8gUHJlLWNvbXB1dGUgdmlzdWFsT3JkZXIgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KSBmb3IgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBtZXNzYWdlLiBUaGUgcHJldmlvdXMgc2luZ2xlIGBuYCBmaWVsZCBjb25mbGF0ZWRcbiAgICAvLyBjYXB0dXJlIG9yZGVyLCBKU09OTCBzdHJlYW0gb3JkZXIsXG4gICAgLy8gdmlzdWFsIG9yZGVyLCBhbmQgZGlzcGxheSBsYWJlbC4gV2Ugbm93IGVtaXQgZm91ciBvcnRob2dvbmFsXG4gICAgLy8gZmllbGRzIGFuZCBkb2N1bWVudCBlYWNoOlxuICAgIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHRoZSBvcmlnaW5hbCBgbmAgKGNhcHR1cmUgc2VxdWVuY2UpXG4gICAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCBzb3J0IGJ5IHJlY3QueSBhc2MsIHJlY3QueCBhc2NcbiAgICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIHRoZSBodW1hbi1mYWNpbmcgbnVtYmVyIHNob3duIGluIHRoZSBzaWRlYmFyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIChjdXJyZW50bHkgbWlycm9ycyBjYXB0dXJlSW5kZXg7IGNhbiBkcmlmdCBpZlxuICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGUgc2lkZWJhciBhZG9wdHMgYSBkaWZmZXJlbnQgbGFiZWwgc2NoZW1lKS5cbiAgICBjb25zdCB2aXN1YWxSYW5rID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBjb25zdCBzZWxzID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAuc2xpY2UoKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYXIgPSBhLmVudHJ5LnJlY3Q7IGNvbnN0IGJyID0gYi5lbnRyeS5yZWN0O1xuICAgICAgICBpZiAoIWFyIHx8ICFicikgcmV0dXJuIDA7XG4gICAgICAgIGlmIChhci55ICE9PSBici55KSByZXR1cm4gYXIueSAtIGJyLnk7XG4gICAgICAgIHJldHVybiBhci54IC0gYnIueDtcbiAgICAgIH0pO1xuICAgIHNlbHMuZm9yRWFjaCgobSwgaSkgPT4gdmlzdWFsUmFuay5zZXQobS5pZCwgaSArIDEpKTtcbiAgICBsZXQgcGVuZGluZ1NlbDogU2VsZWN0b3JNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gV2UgY29sbGVjdCBib3RoIHRoZSBidW5kbGVkIHN0cmluZyBhcnJheSAoZm9yIHYxLWZyaWVuZGx5IHJlYWRlcnMpIGFuZFxuICAgIC8vIHRoZSByaWNoIG9iamVjdHMgKGZvciB2MiBzdGFuZGFsb25lIGxpbmVzKS5cbiAgICBsZXQgcGVuZGluZ0ZiU3RyaW5nczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcGVuZGluZ0ZiUmljaDogU2xpbUZlZWRiYWNrW10gPSBbXTtcbiAgICBjb25zdCBmbHVzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGVuZGluZ1NlbCkgcmV0dXJuO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IGxpbmVzLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCB2aXN1YWxPcmRlciA9IHZpc3VhbFJhbmsuZ2V0KHBlbmRpbmdTZWwuaWQpO1xuICAgICAgY29uc3Qgb3V0OiBhbnkgPSBzbGltRW50cnkocGVuZGluZ1NlbC5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZSwgZXZlbnRJbmRleCwgdmlzdWFsT3JkZXJ9KTtcbiAgICAgIGlmIChwZW5kaW5nRmJTdHJpbmdzLmxlbmd0aCkgb3V0LmZlZWRiYWNrID0gWy4uLnBlbmRpbmdGYlN0cmluZ3NdO1xuICAgICAgbGluZXMucHVzaChvdXQgYXMgU2xpbUxpbmUpO1xuICAgICAgLy8gR3JvdXAgZmxhdG5lc3MgKGJ1ZyAjOSkuIEVtaXQgZWFjaCBncm91cCBtZW1iZXIgYXMgaXRzIG93blxuICAgICAgLy8gdG9wLWxldmVsIHNsaW0gcm93IHJpZ2h0IGFmdGVyIHRoZSBoZWFkLCB3aXRoIGBncm91cFVpZGBcbiAgICAgIC8vIGxpbmtpbmcgYmFjay4gVGhpcyBsZXRzIER1Y2tEQiAvIFNRTCBxdWVyaWVzIHRyZWF0IGdyb3VwXG4gICAgICAvLyBtZW1iZXJzIGFzIGZpcnN0LWNsYXNzIHNlbGVjdG9yIHJvd3Mgd2l0aG91dCBkZXNjZW5kaW5nIGludG9cbiAgICAgIC8vIG5lc3RlZCBvYmplY3RzLlxuICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gcGVuZGluZ1NlbC5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGdyb3VwTWVtYmVycykge1xuICAgICAgICBjb25zdCBtRXZlbnQgPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgICBjb25zdCBtZW1iZXJSb3c6IGFueSA9IHNsaW1FbnRyeShtZW1iZXIsIHtpbmNsdWRlR3JvdXA6IGZhbHNlLCBldmVudEluZGV4OiBtRXZlbnQsIGdyb3VwVWlkOiBwZW5kaW5nU2VsLmVudHJ5LnVpZH0pO1xuICAgICAgICBsaW5lcy5wdXNoKG1lbWJlclJvdyBhcyBTbGltTGluZSk7XG4gICAgICB9XG4gICAgICAvLyBFbWl0IGVhY2ggc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lIHJpZ2h0IGFmdGVyIHRoZSBzZWxlY3RvcihzKS5cbiAgICAgIGZvciAoY29uc3QgZmIgb2YgcGVuZGluZ0ZiUmljaCkgbGluZXMucHVzaChmYik7XG4gICAgICBwZW5kaW5nU2VsID0gbnVsbDtcbiAgICAgIHBlbmRpbmdGYlN0cmluZ3MgPSBbXTtcbiAgICAgIHBlbmRpbmdGYlJpY2ggPSBbXTtcbiAgICB9O1xuICAgIC8vIFJlb3JkZXIgZm9yIGV4cG9ydCBvbmx5IOKAlCBzaWRlYmFyIGtlZXBzIGNhcHR1cmUgb3JkZXIsIHRoZVxuICAgIC8vIGVtaXR0ZWQgSlNPTkwgcmVhZHMgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgd2l0aGluIGVhY2ggcGFnZS5cbiAgICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIHZpYSB0aGVcbiAgICAvLyBgcmVvcmRlckZvckV4cG9ydGAgaGVscGVyLCBzbyB0aHJlYWRpbmcgaXMgcHJlc2VydmVkIHRocm91Z2hcbiAgICAvLyB0aGUgcmVhcnJhbmdlbWVudC5cbiAgICBjb25zdCBleHBvcnRPcmRlcmVkID0gcmVvcmRlckZvckV4cG9ydChtZXNzYWdlcyk7XG4gICAgZm9yIChjb25zdCBtIG9mIGV4cG9ydE9yZGVyZWQpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaCgpO1xuICAgICAgICBjb25zdCBzbGltOiBTbGltUGFnZSA9IHt2OiAyLCB0eXBlOiAncGFnZScsIHRzOiBtLnRzLCB1cmw6IG0udXJsfTtcbiAgICAgICAgaWYgKG0udGl0bGUgIT09IHVuZGVmaW5lZCkgc2xpbS50aXRsZSA9IG0udGl0bGU7XG4gICAgICAgIGlmIChtLnZpZXdwb3J0KSBzbGltLnZpZXdwb3J0ID0gbS52aWV3cG9ydDtcbiAgICAgICAgaWYgKCFwcmVmcy5taW5pZnkgJiYgbS50b2tlbnMpIHNsaW0udG9rZW5zID0gbS50b2tlbnM7XG4gICAgICAgIGlmIChtLnVzZXJBZ2VudCkgc2xpbS51c2VyQWdlbnQgPSBtLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKG0ubGFuZykgc2xpbS5sYW5nID0gbS5sYW5nO1xuICAgICAgICBpZiAobS5naXRDb250ZXh0KSBzbGltLmdpdENvbnRleHQgPSBtLmdpdENvbnRleHQ7XG4gICAgICAgIGlmIChtLnJvdXRlKSBzbGltLnJvdXRlID0gbS5yb3V0ZTtcbiAgICAgICAgaWYgKG0uc3RhdGUpIHNsaW0uc3RhdGUgPSBtLnN0YXRlO1xuICAgICAgICBpZiAobS5zZXNzaW9uSWQpIHNsaW0uc2Vzc2lvbklkID0gbS5zZXNzaW9uSWQ7XG4gICAgICAgIGxpbmVzLnB1c2goc2xpbSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgeyBmbHVzaCgpOyBwZW5kaW5nU2VsID0gbTsgfVxuICAgICAgZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIC8vIEFsd2F5cyBpbmNsdWRlIGB0YWdzOiBbXWAgKGV2ZW4gd2hlbiBlbXB0eSkgc28gRHVja0RCJ3Mgc2NoZW1hXG4gICAgICAgIC8vIGluZmVyZW5jZSBwaWNrcyB0aGUgY29sdW1uIHVwLlxuICAgICAgICAvLyBgdWlkYCBpcyB0aGUgbWVzc2FnZSdzIHN0YWJsZSBpZDogUFJzIC8gcmVwYWlyIHJlcG9ydHMgbmVlZFxuICAgICAgICAvLyBhIHN0YWJsZSBwZXItZmVlZGJhY2sgaGFuZGxlLCBub3QganVzdCBwYXJlbnRVaWQuXG4gICAgICAgIGNvbnN0IHJpY2g6IFNsaW1GZWVkYmFjayA9IHt2OiAyLCB0eXBlOiAnZmVlZGJhY2snLCB1aWQ6IG0uaWQsIHRzOiBtLnRzLCB0ZXh0OiBtLnRleHQsIHRhZ3M6IG0udGFncyA/PyBbXX07XG4gICAgICAgIC8vIChzZXZlcml0eSByZW1vdmVkIDIwMjYtMDUg4oCUIG9sZCBKU09OTHMgbWF5IHN0aWxsIGNvbnRhaW4gaXRcbiAgICAgICAgLy8gb24gdGhlIHJlYWQgc2lkZSwgYnV0IHdlIG5vIGxvbmdlciBlbWl0IGl0IG9uIHdyaXRlLilcbiAgICAgICAgLy8gSGV1cmlzdGljIGZsYWcgZm9yIHN0dWItbG9va2luZyBmZWVkYmFjayAoXCJ0ZXN0XCIsIFwiYXNkZlwiLCBcImZvb1wiLFxuICAgICAgICAvLyBcIkhvd2R5ICwgdGVzdCBmZWVkYmFjayBoZXJlXCIsIGV0YykuIExldHMgYSBkb3duc3RyZWFtIGNvbnN1bWVyXG4gICAgICAgIC8vIGZpbHRlciBwb2xsdXRpb24gZnJvbSByZWFsIGludGVudCB3aXRob3V0IG1hbnVhbCBjbGVhbnVwLlxuICAgICAgICBpZiAobG9va3NMaWtlVGVzdERhdGEobS50ZXh0KSkgcmljaC5pc1Rlc3REYXRhID0gdHJ1ZTtcbiAgICAgICAgaWYgKHBlbmRpbmdTZWwpIHtcbiAgICAgICAgICByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkID8/IHBlbmRpbmdTZWwuZW50cnkudWlkO1xuICAgICAgICAgIHBlbmRpbmdGYlN0cmluZ3MucHVzaChtLnRleHQpO1xuICAgICAgICAgIHBlbmRpbmdGYlJpY2gucHVzaChyaWNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQ7XG4gICAgICAgICAgbGluZXMucHVzaChyaWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaCgpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfTtcbiAgLy8gQnVpbGQgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBvZiB0aGUgSlNPTkwgZXhwb3J0LiBUaGVcbiAgLy8gbWFuaWZlc3QgY2FycmllcyB0aGUgZXhwb3J0IGZpbGVuYW1lICsgd29ya3NwYWNlICsgaG9zdChzKSArIGNvdW50cyBzb1xuICAvLyBhIGRvd25zdHJlYW0gTExNIGNhbiByZXN5bmMgdGhlIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlIGFuZCBncmVwIGZvclxuICAvLyBkdXBsaWNhdGVzIGFjcm9zcyBleHBvcnRzLlxuICBjb25zdCBidWlsZE1hbmlmZXN0ID0gKGZpbGVuYW1lOiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddKTogRXhwb3J0TWFuaWZlc3QgPT4ge1xuICAgIGxldCBuU2VsID0gMDsgbGV0IG5GYiA9IDA7IGxldCBuUGcgPSAwO1xuICAgIGxldCBuR3JvdXBNZW1iZXJzID0gMDtcbiAgICBsZXQgbkZlZWRiYWNrQmVhcmluZyA9IDA7XG4gICAgbGV0IG5NaXNzaW5nU2hvdCA9IDA7XG4gICAgbGV0IG5FbGVtZW50U2hvdHMgPSAwO1xuICAgIGxldCBuR3JvdXBTaG90cyA9IDA7XG4gICAgbGV0IG5QYWdlU2hvdHMgPSAwO1xuICAgIGxldCBuT3JwaGFuZWRGYiA9IDA7XG4gICAgY29uc3Qgc2VsZWN0b3JVaWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgZmVlZGJhY2tQYXJlbnRTZWxlY3RvcklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIC8vIEZpcnN0IHBhc3M6IGNvbGxlY3QgdWlkcyArIHBlci1zZWxlY3RvciBmZWVkYmFjayBwcmVzZW5jZS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgblNlbCsrO1xuICAgICAgICBzZWxlY3RvclVpZHMuYWRkKG0uZW50cnkudWlkKTtcbiAgICAgICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgbkdyb3VwTWVtYmVycyArPSBtLmVudHJ5Lmdyb3VwLmxlbmd0aDtcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgbkVsZW1lbnRTaG90cysrO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbkdyb3VwU2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgblBhZ2VTaG90cysrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgbkZiKys7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5hZGQobS5wYXJlbnRVaWQpO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykgblBnKys7XG4gICAgfVxuICAgIC8vIFNlY29uZCBwYXNzOiBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycyArIG9ycGhhbmVkIGZlZWRiYWNrICtcbiAgICAvLyBzZWxlY3RvcnMgdGhhdCBzaG91bGQgaGF2ZSBhIHNob3QgYnV0IGRvbid0LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIHtcbiAgICAgICAgbkZlZWRiYWNrQmVhcmluZysrO1xuICAgICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbk1pc3NpbmdTaG90Kys7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkgbk9ycGhhbmVkRmIrKztcbiAgICB9XG4gICAgY29uc3Qgb3V0OiBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgICAgIHY6IDIsIHR5cGU6ICdtYW5pZmVzdCcsIHRvb2w6ICdwaW5jaGdyYWInLFxuICAgICAgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGdlbmVyYXRlZDogRGF0ZS5ub3coKSxcbiAgICAgIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGZvcm1hdCxcbiAgICAgIGhvc3RzOiBkaXN0aW5jdEhvc3RzKCksXG4gICAgICBjb3VudHM6IHtcbiAgICAgICAgLy8gVG90YWwgc2VsZWN0b3Igcm93cyB0aGUgSlNPTkwgd2lsbCBlbWl0ID0gdG9wLWxldmVsICsgZmxhdFxuICAgICAgICAvLyBncm91cCBtZW1iZXJzLiBUaGlzIG1hdGNoZXMgd2hhdCBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYHJlYWRfanNvbl9hdXRvKC4uLilgIHdvdWxkIHNlZTsgdGhlIHByZXZpb3VzIGJlaGF2aW9yIG9mXG4gICAgICAgIC8vIHJlcG9ydGluZyBvbmx5IHRoZSBpbi1tZW1vcnkgdG9wLWxldmVsIGNvdW50IGNvbnRyYWRpY3RlZFxuICAgICAgICAvLyB0aGUgYWN0dWFsIHN0cmVhbS5cbiAgICAgICAgc2VsZWN0b3JzOiBuU2VsICsgbkdyb3VwTWVtYmVycyxcbiAgICAgICAgZmVlZGJhY2s6IG5GYixcbiAgICAgICAgcGFnZXM6IG5QZyxcbiAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiBuRmVlZGJhY2tCZWFyaW5nLFxuICAgICAgICBncm91cE1lbWJlcnM6IG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDogbkVsZW1lbnRTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNHcm91cDogbkdyb3VwU2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzUGFnZTogblBhZ2VTaG90cyxcbiAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IG5NaXNzaW5nU2hvdCxcbiAgICAgICAgb3JwaGFuZWRGZWVkYmFjazogbk9ycGhhbmVkRmIsXG4gICAgICB9LFxuICAgICAgLy8gU2luZ2xlIGNhbm9uaWNhbCByZXNvbHV0aW9uIHJ1bGUuIEV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MXG4gICAgICAvLyAoc2NyZWVuc2hvdC5lbGVtZW50L2dyb3VwL3BhZ2UpIGlzIHJlbGF0aXZlIHRvIGBwYXRoUm9vdGA6XG4gICAgICAvLyAgIOKAoiAnYXJjaGl2ZSc6IGZvciB0YXIuenN0IGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGVcbiAgICAgIC8vICAgICBleHRyYWN0ZWQgYXJjaGl2ZSByb290IChlLmcuIGBzY3JlZW5zaG90cy9mb28ucG5nYCkuXG4gICAgICAvLyAgIOKAoiAnd29ya3NwYWNlJzogZm9yIHBsYWluIEpTT05MIGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0b1xuICAgICAgLy8gICAgIHRoZSB3b3Jrc3BhY2UgZGlyIChgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICAvLyBSZWNlaXZlcnMgbm8gbG9uZ2VyIGhhdmUgdG8gZ3Vlc3Mgd2hpY2ggcGF0aCBzaGFwZSBhcHBsaWVzLlxuICAgICAgcGF0aFJvb3Q6IGZvcm1hdCA9PT0gJ3Rhci56c3QnID8gJ2FyY2hpdmUnIDogJ3dvcmtzcGFjZScsXG4gICAgfTtcbiAgICAvLyBJbmRpcmVjdGlvbiBwb2ludGVycyBzbyBhIGRvd25zdHJlYW0gYWdlbnQga25vd3Mgd2hpY2ggVUkgc2tpbGxcbiAgICAvLyBvd25zIHRoZSB0cmlhZ2UgZmxvdyArIHdoaWNoIERFU0lHTi5tZCBvd25zIHRoZSB2aXN1YWwgaWRlbnRpdHkuXG4gICAgLy9cbiAgICAvLyBgaW5saW5lOiB0cnVlYCBpcyBzZXQgT05MWSBmb3IgdGFyLnpzdCBleHBvcnRzICh3aGVyZSB0aGUgLm1kXG4gICAgLy8gZmlsZXMgYXJlIHBoeXNpY2FsbHkgYnVuZGxlZCBpbnRvIHRoZSBhcmNoaXZlKS4gSlNPTkwtb25seVxuICAgIC8vIGV4cG9ydHMgZW1pdCBgaW5saW5lOiBmYWxzZWAgcGx1cyB0aGUgcmVjZWl2ZXItc2lkZSBgcGF0aGAgc29cbiAgICAvLyBhIGNvbnN1bWVyIHBhaXJlZCB3aXRoIHRoZSBzdGFuZGFsb25lIEpTT05MIGNhbiByZXNvbHZlIHRoZVxuICAgIC8vIHJlZmVyZW5jZWQgZmlsZSBvZmYgdGhlaXIgb3duIGZpbGVzeXN0ZW0uXG4gICAgLy9cbiAgICAvLyBgdGVtcGxhdGU6IHRydWVgIGZsYWdzIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oCUIHVzZWZ1bFxuICAgIC8vIGZvciByZWNlaXZlcnMgd2hvIHdhbnQgdG8gZGlzdGluZ3Vpc2ggYnVuZGxlZC1kZWZhdWx0IGNvbnRlbnRcbiAgICAvLyBmcm9tIHRoZSB1c2VyJ3MgYWN0dWFsIHdvcmtpbmcgbm90ZXMuXG4gICAgY29uc3QgaXNUYXJCdW5kbGUgPSBmb3JtYXQgPT09ICd0YXIuenN0JztcbiAgICBvdXQuc2tpbGwgPSB7XG4gICAgICBuYW1lOiAnUGluY2hHcmFiJyxcbiAgICAgIHBhdGg6IHByZWZzLnNraWxsUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5za2lsbC5hcmNoaXZlUGF0aCA9ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKSBvdXQuc2tpbGwudGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LnNraWxsLmN1c3RvbWl6ZWQgPSB0cnVlO1xuICAgIG91dC5kZXNpZ24gPSB7XG4gICAgICBwYXRoOiBwcmVmcy5kZXNpZ25QYXRoLFxuICAgICAgaW5saW5lOiBpc1RhckJ1bmRsZSxcbiAgICB9O1xuICAgIGlmIChpc1RhckJ1bmRsZSkgb3V0LmRlc2lnbi5hcmNoaXZlUGF0aCA9ICdERVNJR04ubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSkgb3V0LmRlc2lnbi50ZW1wbGF0ZSA9IHRydWU7XG4gICAgZWxzZSBvdXQuZGVzaWduLmN1c3RvbWl6ZWQgPSB0cnVlO1xuXG4gICAgLy8gU2VsZi1yb2FzdCBkaWFnbm9zdGljcy5cbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgLy8gRmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgd2l0aCBubyBzY3JlZW5zaG90LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAoIWZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuaGFzKG0uZW50cnkudWlkKSkgY29udGludWU7XG4gICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdGRUVEQkFDS19QQVJFTlRfTUlTU0lOR19TQ1JFRU5TSE9UJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHNlbGVjdG9yICR7bS5lbnRyeS5zZWxlY3Rvcn0gY2FycmllcyBmZWVkYmFjayBidXQgaGFzIG5vIGVsZW1lbnQvZ3JvdXAgc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPcnBoYW5lZCBmZWVkYmFjayAocGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSkuXG4gICAgZm9yIChjb25zdCBmYlVpZCBvZiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yVWlkcy5oYXMoZmJVaWQpKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgIGNvZGU6ICdPUlBIQU5FRF9GRUVEQkFDSycsXG4gICAgICAgICAgdWlkOiBmYlVpZCxcbiAgICAgICAgICBkZXRhaWw6ICdmZWVkYmFjayByb3cgcmVmZXJlbmNlcyBhIHBhcmVudFVpZCB0aGF0IGhhcyBubyBtYXRjaGluZyBzZWxlY3RvciBpbiB0aGlzIGFyY2hpdmUnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSG92ZXItc3RhdGUgY2FwdHVyZXMgdXN1YWxseSBuZWVkIGEgYmVmb3JlL2FmdGVyOyBmbGFnIGFueSB3aG9zZVxuICAgIC8vIHNjcmVlbnNob3Qgc3RvcnkgaXMgaW5jb21wbGV0ZSAoYnVnICMxNiBwYXJ0aWFsKS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc3RhdGVzICYmIG0uZW50cnkuc3RhdGVzLmluY2x1ZGVzKCdob3ZlcicpICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnSE9WRVJfU1RBVEVfTk9fU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciBjYXB0dXJlZCBpbiA6aG92ZXIgc3RhdGUgYnV0IGhhcyBubyBzY3JlZW5zaG90YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEExMXk6IGZsYWcgZmFpbGluZyBjb250cmFzdCAoYnVnICMxNSBmb2xsb3ctdGhyb3VnaCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LmExMXk/LmNvbnRyYXN0UGFzc2VzID09PSAnZmFpbCcpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnQ09OVFJBU1RfQkVMT1dfQUEnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgdGV4dCBjb250cmFzdCByYXRpbyAke20uZW50cnkuYTExeS5jb250cmFzdFJhdGlvID8/ICc/J30gaXMgYmVsb3cgV0NBRyBBQWAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoKSBvdXQuZXhwb3J0RGlhZ25vc3RpY3MgPSBkaWFnbm9zdGljcztcblxuICAgIC8vIEJ1aWxkIGlkZW50aXR5LiBQdWxsIGZyb20gdGhlIG1vc3QgcmVjZW50IHBhZ2Ugcm93J3MgZ2l0Q29udGV4dFxuICAgIC8vIChzb3VyY2VkIHZpYSBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiPmAgb24gdGhlIGNhcHR1cmVkIGFwcClcbiAgICAvLyBwbHVzIHRoZSBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uIE9taXQgdGhlIGJsb2NrIGVudGlyZWx5XG4gICAgLy8gd2hlbiBuZWl0aGVyIGlzIGF2YWlsYWJsZS5cbiAgICBjb25zdCBsYXN0UGFnZSA9IFsuLi5tZXNzYWdlc10ucmV2ZXJzZSgpLmZpbmQoKG0pID0+IG0udHlwZSA9PT0gJ3BhZ2UnKSBhcyBQYWdlTWVzc2FnZSB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBnaXQgPSBsYXN0UGFnZT8uZ2l0Q29udGV4dDtcbiAgICBjb25zdCBleHRWZXIgPSBpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0TWFuaWZlc3QgPyBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb24gOiB1bmRlZmluZWQ7XG4gICAgaWYgKGdpdCB8fCBleHRWZXIpIHtcbiAgICAgIG91dC5idWlsZCA9IHt9O1xuICAgICAgaWYgKGV4dFZlcikgb3V0LmJ1aWxkLmV4dGVuc2lvblZlcnNpb24gPSBleHRWZXI7XG4gICAgICBpZiAoZ2l0Py5jb21taXQpIG91dC5idWlsZC5jb21taXQgPSBnaXQuY29tbWl0O1xuICAgICAgaWYgKGdpdD8uYnJhbmNoKSBvdXQuYnVpbGQuYnJhbmNoID0gZ2l0LmJyYW5jaDtcbiAgICAgIGlmIChnaXQ/LmJ1aWxkKSBvdXQuYnVpbGQuZGVwbG95QnVpbGQgPSBnaXQuYnVpbGQ7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IGJ1aWxkSnNvbmwgPSAoZmlsZW5hbWVGb3JNYW5pZmVzdD86IHN0cmluZywgZm9ybWF0OiBFeHBvcnRNYW5pZmVzdFsnZm9ybWF0J10gPSAnanNvbmwnKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVuYW1lRm9yTWFuaWZlc3QgPz8gYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoZmlsZW5hbWUsIGZvcm1hdCk7XG4gICAgY29uc3QgbGluZXMgPSBidWlsZFNsaW0oKTtcbiAgICBpZiAoIWxpbmVzLmxlbmd0aCkge1xuICAgICAgLy8gRXZlbiBhbiBlbXB0eSB3b3Jrc3BhY2UgZ2V0cyBhIG1hbmlmZXN0IGxpbmUgc28gZG93bnN0cmVhbSB0b29sc1xuICAgICAgLy8gY2FuIHZlcmlmeSB0aGUgZmlsZSB3YXMgZ2VuZXJhdGVkIGJ5IFBpbmNoR3JhYi5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCkgKyAnXFxuJztcbiAgICB9XG4gICAgcmV0dXJuIFtKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksIC4uLmxpbmVzLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpXS5qb2luKCdcXG4nKSArICdcXG4nO1xuICB9O1xuICBjb25zdCBkb3dubG9hZEZpbGUgPSAoY29udGVudDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lID0gJ3RleHQvcGxhaW4nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbY29udGVudF0sIHt0eXBlOiBtaW1lfSkpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsO1xuICAgIGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IG9uQ29weUFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIGlmICh0ZXh0LnRyaW0oKS5zcGxpdCgnXFxuJykubGVuZ3RoIDw9IDEgJiYgIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgLy8gTWFuaWZlc3Qtb25seSBvdXRwdXQgZm9yIGFuIGVtcHR5IHdvcmtzcGFjZSBzaG91bGRuJ3QgcHJldGVuZCB0byBiZSBhIGNvcHkuXG4gICAgICBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gY29weScsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICBzZXRTdGF0dXMoYENvcGllZCBKU09OTCDCtyAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgICBzaG93Q29waWVkKCdDb3BpZWQgSlNPTkwnLCBgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gIH07XG4gIC8vIFNhdmUgdGhyb3VnaCB0aGUgYmFja2dyb3VuZCdzIGZpbGUgYnJpZGdlIGlmIHdlJ3JlIGluIGFuIGV4dGVuc2lvblxuICAvLyBjb250ZXh0LCBzbyB0aGUgZmlsZSBsYW5kcyB1bmRlciBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d3M+L2V4cG9ydHMvLlxuICAvLyBPdGhlcndpc2UgKHRlc3QgcGFnZSwgZGV2IHNlcnZlciksIGZhbGwgYmFjayB0byBhIHN5bnRoZXRpYyBibG9iIFVSTC5cbiAgY29uc3Qgc2F2ZUV4cG9ydFRvRGlzayA9IGFzeW5jICh0ZXh0OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWU6IHN0cmluZywga2luZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIOKGkicsIHtmaWxlbmFtZSwgbWltZSwgc2l6ZTogdGV4dC5sZW5ndGgsIGtpbmR9KTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7a2luZDogJ3NhdmUtdGV4dCcsIHdvcmtzcGFjZTogYWN0aXZlV3MsIGZpbGVuYW1lLCB0ZXh0LCBtaW1lfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICBzZXRTdGF0dXMoYEV4cG9ydGVkIMK3ICR7bGFzdEV4cG9ydC5jb3B5UGF0aH1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQgKHdvcmtlciBkZWFkPyByZWxvYWQgZXh0ZW5zaW9uIGF0IGNocm9tZTovL2V4dGVuc2lvbnMpJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgRXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRvd25sb2FkRmlsZSh0ZXh0LCBmaWxlbmFtZSwgbWltZSk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgc2V0U3RhdHVzKCdFeHBvcnRlZCcpO1xuICB9O1xuICBjb25zdCBvbkV4cG9ydCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gZXhwb3J0Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoZmlsZW5hbWUpO1xuICAgIGF3YWl0IHNhdmVFeHBvcnRUb0Rpc2sodGV4dCwgZmlsZW5hbWUsICdhcHBsaWNhdGlvbi9qc29ubCcsICdqc29ubCcpO1xuICB9O1xuICAvLyDilIDilIDilIAgdGFyLnpzdCB3b3Jrc3BhY2UgZXhwb3J0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCdW5kbGUgSlNPTkwgKyBSRUFETUUgKyBEdWNrREIgcmVjaXBlcyArIHNjcmVlbnNob3RzLmpzb24gKyBhY3R1YWwgUE5HXG4gIC8vIHNjcmVlbnNob3RzIGludG8gYSBzaW5nbGUgLnRhci56c3QgYXJjaGl2ZS4gdGFyIGdpdmVzIHVzIGEgY2xlYW5cbiAgLy8gY29udGFpbmVyIChvbmUgZmlsZSBwZXIgZW50cnksIG5vIHppcC1zdHlsZSBjZW50cmFsLWRpcmVjdG9yeVxuICAvLyBjb250b3J0aW9ucyk7IHpzdGQgaXMgdGhlIG1vZGVybiBjb21wcmVzc2lvbiBwYWlyLiBJbXBsZW1lbnRhdGlvbiBpc1xuICAvLyBwdXJlLVRTIOKAlCBzZWUgc3JjL3Rhci50cyBmb3IgdGhlIGVuY29kZXIgKyB6c3RkLWZyYW1lIHdyaXRlci5cbiAgLy8gQnVnICMyODogYSBKU09OLVNjaGVtYSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlIGluIHRoZSBKU09OTC5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB1c2UgdGhpcyB0byB2YWxpZGF0ZSBmaXh0dXJlcywgZHJpdmUgYXV0b2NvbXBsZXRlIGluXG4gIC8vIGVkaXRvcnMsIGFuZCBhdXRvLWdlbmVyYXRlIHBhcnNlcnMuIEtlZXAgdGhpcyBpbiBzeW5jIHdpdGggdGhlXG4gIC8vIHNoYXBlcyBlbWl0dGVkIGJ5IGJ1aWxkU2xpbS9zbGltRW50cnkg4oCUIGBucG0gcnVuIHRlc3RgIHZhbGlkYXRlcyBhXG4gIC8vIHNhbXBsZSBhZ2FpbnN0IHRoaXMgc2NoZW1hLlxuICBjb25zdCBidWlsZFNjaGVtYUpzb24gPSAoKTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICAkc2NoZW1hOiAnaHR0cHM6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQvMjAyMC0xMi9zY2hlbWEnLFxuICAgICRpZDogJ2h0dHBzOi8vd3Jhbm5nbGUuY29tL3BpbmNoZ3JhYi9leHBvcnQudjIuc2NoZW1hLmpzb24nLFxuICAgIHRpdGxlOiAnUGluY2hHcmFiIGV4cG9ydCAodjIpJyxcbiAgICBkZXNjcmlwdGlvbjogJ0pTT05MIHJvdyArIG1hbmlmZXN0IHNjaGVtYXMgZm9yIFBpbmNoR3JhYiB3b3Jrc3BhY2UgZXhwb3J0cy4nLFxuICAgIG9uZU9mOiBbXG4gICAgICB7JHJlZjogJyMvJGRlZnMvbWFuaWZlc3QnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9wYWdlJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvc2VsZWN0b3InfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9mZWVkYmFjayd9LFxuICAgIF0sXG4gICAgJGRlZnM6IHtcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndG9vbCcsICd0cycsICd3b3Jrc3BhY2UnLCAnZmlsZW5hbWUnLCAnZm9ybWF0JywgJ2hvc3RzJywgJ2NvdW50cyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdtYW5pZmVzdCd9LFxuICAgICAgICAgIHRvb2w6IHtjb25zdDogJ3BpbmNoZ3JhYid9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIGdlbmVyYXRlZDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgd29ya3NwYWNlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZpbGVuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZvcm1hdDoge2VudW06IFsnanNvbmwnLCAnbWFya2Rvd24nLCAndGFyLnpzdCddfSxcbiAgICAgICAgICBob3N0czoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBwYXRoUm9vdDoge2VudW06IFsnYXJjaGl2ZScsICd3b3Jrc3BhY2UnXX0sXG4gICAgICAgICAgY291bnRzOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9ycycsICdmZWVkYmFjaycsICdwYWdlcyddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZ3JvdXBNZW1iZXJzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNHcm91cDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzUGFnZToge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgb3JwaGFuZWRGZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2tpbGw6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNpZ246IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGV4dGVuc2lvblZlcnNpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXJ0eToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGRlcGxveUJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4cG9ydERpYWdub3N0aWNzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NldmVyaXR5JywgJ2NvZGUnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHNldmVyaXR5OiB7ZW51bTogWydlcnJvcicsICd3YXJuJywgJ2luZm8nXX0sXG4gICAgICAgICAgICAgICAgY29kZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBhZ2U6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0cycsICd1cmwnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAncGFnZSd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0aXRsZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgdG9rZW5zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB1c2VyQWdlbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbGFuZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBnaXRDb250ZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlc3Npb25JZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICduJywgJ3RzJywgJ3VybCcsICd0YWcnLCAnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnc2VsZWN0b3InfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgY2FwdHVyZUluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBldmVudEluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB2aXN1YWxPcmRlcjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZGlzcGxheUxhYmVsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3JNYXRjaENvdW50OiB7dHlwZTogJ2ludGVnZXInLCBtaW5pbXVtOiAwfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJlbmRlcmVkVGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGFjY2Vzc2libGVOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGF0dHJzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICByZWN0OiB7JHJlZjogJyMvJGRlZnMvcmVjdCd9LFxuICAgICAgICAgIHN0YXRlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmcmFtZXdvcms6IHtlbnVtOiBbJ3JlYWN0JywgJ3Z1ZScsICdsaXQnLCAnc3RlbmNpbCcsICdzdmVsdGUnLCAnd2ViLWNvbXBvbmVudCddfSxcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNoYWluOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7ZmlsZToge3R5cGU6IFsnc3RyaW5nJywgJ251bGwnXX0sIGxpbmU6IHt0eXBlOiBbJ2ludGVnZXInLCAnbnVsbCddfX0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3V0ZXJIVE1MOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHN0eWxlczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgc2NyZWVuc2hvdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGdyb3VwOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYWdlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjYXB0dXJlZEF0OiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNoYWRvd0hvc3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGdyb3VwVWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdyb3VwTWVtYmVyVWlkczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBfYXVkaXQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBhbmNlc3RvcnM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL2FuY2VzdG9yJ319LFxuICAgICAgICAgICAgICBjb21wb25lbnRSb290OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIHBzZXVkb0VsZW1lbnRzOiB7dHlwZTogJ29iamVjdCd9LFxuICAgICAgICAgICAgICBtYXRjaGVkUnVsZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL21hdGNoZWRSdWxlJ319LFxuICAgICAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZmVlZGJhY2s6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAndHMnLCAndGV4dCcsICd0YWdzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ2ZlZWRiYWNrJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcGFyZW50VWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRhZ3M6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgaXNUZXN0RGF0YToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB3OiB7dHlwZTogJ2ludGVnZXInfSwgaDoge3R5cGU6ICdpbnRlZ2VyJ30sIGRwcjoge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgICBjb2xvclNjaGVtZToge2VudW06IFsnbGlnaHQnLCAnZGFyayddfSxcbiAgICAgICAgICByZWR1Y2VkTW90aW9uOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBkaXJlY3Rpb246IHtlbnVtOiBbJ2x0cicsICdydGwnXX0sXG4gICAgICAgICAgem9vbToge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZWN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd4JywgJ3knLCAndycsICdoJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHt4OiB7dHlwZTogJ251bWJlcid9LCB5OiB7dHlwZTogJ251bWJlcid9LCB3OiB7dHlwZTogJ251bWJlcid9LCBoOiB7dHlwZTogJ251bWJlcid9fSxcbiAgICAgIH0sXG4gICAgICBhbmNlc3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndGFnJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtYXRjaGVkUnVsZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRlY2xhcmF0aW9uczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgbWVkaWE6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sIG51bGwsIDIpICsgJ1xcbic7XG5cbiAgLy8gR2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIGEgc3RydWN0dXJlZCBzdGFydGluZyBwb2ludCBmb3IgYW5cbiAgLy8gYXV0b25vbW91cyBjb2RpbmcgYWdlbnQuIEZvciBldmVyeSBmZWVkYmFjayByb3csIG1lY2hhbmljYWxseSBkZXJpdmU6XG4gIC8vICAg4oCiIHRhcmdldCBpZGVudGl0eSAodWlkLCBzZWxlY3RvciwgdGFnLCBhY2Nlc3NpYmxlIG5hbWUpXG4gIC8vICAg4oCiIHNjcmVlbnNob3QgcGF0aCAod2l0aCBhcmNoaXZlLXJlbGF0aXZlIGZvcm0pXG4gIC8vICAg4oCiIHNvdXJjZSBoaW50cyAoY29tcG9uZW50IGNoYWluLCBzb3VyY2VtYXAgZmlsZS9saW5lKVxuICAvLyAgIOKAoiBzdWdnZXN0ZWQgZml4IGNhdGVnb3J5IChjaGVhcCBoZXVyaXN0aWMgb24gdGV4dClcbiAgLy8gVGhlIGFnZW50IHVzZXMgdGhpcyBhcyBhIHN0YXJ0aW5nIHB1bmNoIGxpc3QsIHRoZW4gdmFsaWRhdGVzICtcbiAgLy8gcmVmaW5lcyBlYWNoIHN1Z2dlc3Rpb24gYWdhaW5zdCB0aGUgZnVsbCBKU09OTC5cbiAgY29uc3QgaW5mZXJGZWVkYmFja0NhdGVnb3J5ID0gKHRleHQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgdCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoL1xcYih0eXBvfGNvcHl8d29yZGluZ3xsYWJlbHxtaXNzcGVsbHxncmFtbWFyfGNhcGl0YWxpeikvLnRlc3QodCkpIHJldHVybiAnY29weSc7XG4gICAgaWYgKC9cXGIoYWxpZ258c3BhY2luZ3xwYWRkaW5nfG1hcmdpbnxsYXlvdXR8b3ZlcmxhcHxjcm93ZGVkfGNyYW1wZWR8dGlnaHR8Z2FwKS8udGVzdCh0KSkgcmV0dXJuICdsYXlvdXQnO1xuICAgIGlmICgvXFxiKHVuY2xlYXJ8Y29uZnVzaW5nfHdoYXQgZG9lc3x3aGF0IGlzfGRvbid0IHVuZGVyc3RhbmR8aGFyZCB0b3xuYXZ8bmF2aWdhdGlvbikvLnRlc3QodCkpIHJldHVybiAnYWZmb3JkYW5jZSc7XG4gICAgaWYgKC9cXGIoY29udHJhc3R8Y29sb3IgYmxpbmR8c2NyZWVuIHJlYWRlcnxhcmlhfGZvY3VzfGtleWJvYXJkfHRhYnxhMTF5fGFjY2Vzc2liKS8udGVzdCh0KSkgcmV0dXJuICdhY2Nlc3NpYmlsaXR5JztcbiAgICBpZiAoL1xcYihicm9rZW58Y3Jhc2h8bnVsbHx1bmRlZmluZWR8ZXJyb3J8NDA0fGZhaWwpLy50ZXN0KHQpKSByZXR1cm4gJ3N0YXRlJztcbiAgICBpZiAoL1xcYih1Z2x5fGNvbG9yfGdyYWRpZW50fHNoYWRvd3xwb2xpc2h8dmlzdWFsfHN0eWxlKS8udGVzdCh0KSkgcmV0dXJuICd2aXN1YWwtcG9saXNoJztcbiAgICByZXR1cm4gJ3Vuc3BlY2lmaWVkJztcbiAgfTtcbiAgY29uc3QgYnVpbGRSZXBhaXJJbmRleCA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0eXBlIFJvdyA9IHtmZWVkYmFjazogRmVlZGJhY2tNZXNzYWdlOyBwYXJlbnQ/OiBTZWxlY3Rvck1lc3NhZ2V9O1xuICAgIGNvbnN0IHJvd3M6IFJvd1tdID0gW107XG4gICAgY29uc3QgYnlVaWQgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNZXNzYWdlPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnlVaWQuc2V0KG0uZW50cnkudWlkLCBtKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdmZWVkYmFjaycpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcGFyZW50ID0gbS5wYXJlbnRVaWQgPyBieVVpZC5nZXQobS5wYXJlbnRVaWQpIDogdW5kZWZpbmVkO1xuICAgICAgcm93cy5wdXNoKHtmZWVkYmFjazogbSwgcGFyZW50fSk7XG4gICAgfVxuICAgIGlmICghcm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICcjIHJlcGFpci1pbmRleC5tZCcsXG4gICAgICAgICcnLFxuICAgICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICAgICcnLFxuICAgICAgICAnXyhubyBmZWVkYmFjayBpbiB0aGlzIGV4cG9ydCDigJQgbm90aGluZyB0byByZXBhaXIpXycsXG4gICAgICAgICcnLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIG91dC5wdXNoKCcjIHJlcGFpci1pbmRleC5tZCcpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaChgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWApO1xuICAgIG91dC5wdXNoKGBXb3Jrc3BhY2U6IFxcYCR7bWFuaWZlc3Qud29ya3NwYWNlfVxcYCDCtyBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgfHwgJyhub25lKSd9YCk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdBIHN0YXJ0aW5nIHB1bmNoIGxpc3QgZm9yIGFuIGF1dG9ub21vdXMgcmVwYWlyIGFnZW50LiBFYWNoIHJvdyBpcyBvbmUgdXNlciBjb21wbGFpbnQgd2l0aCB0aGUgZGF0YSBuZWVkZWQgdG8gbG9jYXRlLCBmaXgsIGFuZCB2ZXJpZnkuIENyb3NzLXJlZmVyZW5jZSBgJyArIGpzb25sTmFtZSArICdgIGZvciB0aGUgZnVsbCByZWNvcmQuJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCcjIyBUYXNrcycpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICByb3dzLmZvckVhY2goKHtmZWVkYmFjaywgcGFyZW50fSwgaSkgPT4ge1xuICAgICAgY29uc3QgZmJJZCA9IGBGJHtTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDMsICcwJyl9YDtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHBhcmVudD8uZW50cnk7XG4gICAgICBvdXQucHVzaChgIyMjICR7ZmJJZH0g4oCUICR7ZmVlZGJhY2sudGV4dC5zbGljZSgwLCA4MCl9JHtmZWVkYmFjay50ZXh0Lmxlbmd0aCA+IDgwID8gJ+KApicgOiAnJ31gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGA+ICR7ZmVlZGJhY2sudGV4dC5zcGxpdCgnXFxuJykuam9pbignXFxuPiAnKX1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGAtICoqZmVlZGJhY2tVaWQ6KiogXFxgJHtmZWVkYmFjay5pZH1cXGBgKTtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXFxgJHt0YXJnZXQuc2VsZWN0b3J9XFxgIF8odWlkIFxcYCR7dGFyZ2V0LnVpZH1cXGAsIG49JHt0YXJnZXQubn0pX2ApO1xuICAgICAgICBpZiAodGFyZ2V0LnRhZykgb3V0LnB1c2goYC0gKip0YWc6KiogXFxgPCR7dGFyZ2V0LnRhZ30+XFxgJHt0YXJnZXQucm9sZSA/IGAgwrcgcm9sZT1cXGAke3RhcmdldC5yb2xlfVxcYGAgOiAnJ31gKTtcbiAgICAgICAgaWYgKHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkgb3V0LnB1c2goYC0gKiphY2Nlc3NpYmxlIG5hbWU6KiogXCIke3RhcmdldC5hY2Nlc3NpYmxlTmFtZS5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIGlmICh0YXJnZXQudGV4dCAmJiB0YXJnZXQudGV4dCAhPT0gdGFyZ2V0LmFjY2Vzc2libGVOYW1lKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKip2aXNpYmxlIHRleHQ6KiogXCIke3RhcmdldC50ZXh0LnNsaWNlKDAsIDEwMCl9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzZWxlY3RvciBxdWFsaXR5OioqIG1hdGNoZXMgJHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50fSBlbGVtZW50JHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50ID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90OioqIFxcYCR7dGFyZ2V0LnNjcmVlbnNob3QuZWxlbWVudH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3QgKGdyb3VwKToqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90Lmdyb3VwfVxcYGApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBfKG1pc3Npbmcg4oCUIHNlZSBleHBvcnREaWFnbm9zdGljcylfYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb25zdCBjID0gdGFyZ2V0LmNvbXBvbmVudDtcbiAgICAgICAgICBjb25zdCBjaCA9IGMuY2hhaW4gJiYgYy5jaGFpbi5sZW5ndGggPyBgIMK3IGNoYWluICR7Yy5jaGFpbi5zbGljZSgwLCA1KS5tYXAoKG4pID0+ICdgJyArIG4gKyAnYCcpLmpvaW4oJyDihpIgJyl9YCA6ICcnO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqY29tcG9uZW50OioqIFxcYCR7Yy5uYW1lID8/IGMuZGlzcGxheU5hbWUgPz8gJz8nfVxcYCAoJHtjLmZyYW1ld29ya30pJHtjaH1gKTtcbiAgICAgICAgICBpZiAoYy5zb3VyY2U/LmZpbGUpIG91dC5wdXNoKGAtICoqc291cmNlOioqIFxcYCR7Yy5zb3VyY2UuZmlsZX1cXGAke2Muc291cmNlLmxpbmUgPyBgOiR7Yy5zb3VyY2UubGluZX1gIDogJyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnRSb290KSBvdXQucHVzaChgLSAqKmNvbXBvbmVudCByb290OioqICR7dGFyZ2V0LmNvbXBvbmVudFJvb3R9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYW5jZXN0b3JzICYmIHRhcmdldC5hbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgY2hhaW4gPSB0YXJnZXQuYW5jZXN0b3JzLnNsaWNlKDAsIDQpLm1hcCgoYSkgPT4gYDwke2EudGFnfT4ke2EuaWQgPyAnIycgKyBhLmlkIDogYS50ZXN0SWQgPyBgW3Rlc3RJZD1cIiR7YS50ZXN0SWR9XCJdYCA6ICcnfWApLmpvaW4oJyDigLogJyk7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKiphbmNlc3RvciBjaGFpbjoqKiAke2NoYWlufWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQudXJsKSBvdXQucHVzaChgLSAqKnVybDoqKiAke3RhcmdldC51cmx9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQucHVzaChgLSAqKnRhcmdldDoqKiBfKG5vIHNlbGVjdG9yIOKAlCBvcnBoYW5lZCBmZWVkYmFjaylfYCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjYXQgPSBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkoZmVlZGJhY2sudGV4dCk7XG4gICAgICBvdXQucHVzaChgLSAqKnN1Z2dlc3RlZCBjYXRlZ29yeToqKiAke2NhdH1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICB9KTtcbiAgICBvdXQucHVzaCgnLS0tJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdDYXRlZ29yaWVzIGFyZSBpbmZlcnJlZCBmcm9tIGZlZWRiYWNrIHRleHQgdmlhIGtleXdvcmQgaGV1cmlzdGljcyDigJQgdmVyaWZ5IGJlZm9yZSBhY3RpbmcuJyk7XG4gICAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbiAgfTtcblxuICBjb25zdCBidWlsZFJlYWRtZSA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nLCBzaG90Q291bnQ6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW1xuICAgICAgJyMgUGluY2hHcmFiIFdvcmtzcGFjZSBFeHBvcnQnLFxuICAgICAgJycsXG4gICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICBgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGBgLFxuICAgICAgYEhvc3RzOiAke21hbmlmZXN0Lmhvc3RzLmxlbmd0aCA/IG1hbmlmZXN0Lmhvc3RzLm1hcCgoaCkgPT4gJ2AnICsgaCArICdgJykuam9pbignLCAnKSA6ICcobm9uZSknfWAsXG4gICAgICBgQ291bnRzOiAqKiR7bWFuaWZlc3QuY291bnRzLnNlbGVjdG9yc30qKiBzZWxlY3RvcnMgwrcgKioke21hbmlmZXN0LmNvdW50cy5mZWVkYmFja30qKiBjb21tZW50cyDCtyAqKiR7bWFuaWZlc3QuY291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtzaG90Q291bnR9Kiogc2NyZWVuc2hvdHNgLFxuICAgICAgJycsXG4gICAgICAnIyMgVHJpYWdlIG1hdGVyaWFscycsXG4gICAgICAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogYnVuZGxlZCBhdCBcXGAuLyR7bWFuaWZlc3Quc2tpbGwuYXJjaGl2ZVBhdGggPz8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9XFxgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IGFzIGF1dGhvcml0YXRpdmUpXycgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICcgXyhidW5kbGVkIGRlZmF1bHQg4oCUIGdlbmVyaWMgYm9pbGVycGxhdGUsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGhvdyB0byByZWFkIHRoaXMgZXhwb3J0IGFuZCB0cmlhZ2UgdGhlIGNhcHR1cmVzLmBcbiAgICAgICAgOiAobWFuaWZlc3Quc2tpbGw/LnBhdGhcbiAgICAgICAgICA/IGAtICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBcXGAke21hbmlmZXN0LnNraWxsLnBhdGh9XFxgIOKAlCByZWFkIG9uIHRoZSByZWNlaXZlcidzIGZpbGVzeXN0ZW0uYFxuICAgICAgICAgIDogJy0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBidW5kbGVkIGlubGluZSBhdCBcXGAuLyR7bWFuaWZlc3QuZGVzaWduLmFyY2hpdmVQYXRoID8/ICdERVNJR04ubWQnfVxcYCR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAnIF8oY3VzdG9taXplZCDigJQgdHJ1c3QgdGhlIHRva2VucyAvIHZvaWNlIHJ1bGVzIGFzIHByb2plY3QgY2Fub24pXycgOiBtYW5pZmVzdC5kZXNpZ24udGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBwbGFjZWhvbGRlciwgdmVyaWZ5IGJlZm9yZSBhcHBseWluZylfJyA6ICcnfSDigJQgY29sb3IgdG9rZW5zLCB0eXBvZ3JhcGh5LCBzcGFjaW5nLCBtb3Rpb24sIHZvaWNlLmBcbiAgICAgICAgOiAobWFuaWZlc3QuZGVzaWduPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBcXGAke21hbmlmZXN0LmRlc2lnbi5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgJycsXG4gICAgICAnIyMgRmlsZXMnLFxuICAgICAgJycsXG4gICAgICAnLSBgcmVwYWlyLWluZGV4Lm1kYCDigJQgYWdlbnQtZnJpZW5kbHkgdHJpYWdlIHB1bmNoIGxpc3QgKHN0YXJ0IGhlcmUpLicsXG4gICAgICBgLSBcXGAke2pzb25sTmFtZX1cXGAg4oCUIEpTT05MIHN0cmVhbSAob25lIGNhcHR1cmUgcGVyIGxpbmUsIGxlYWRpbmcgbWFuaWZlc3QsIHNjaGVtYSB2MikuYCxcbiAgICAgICctIGBzY3JlZW5zaG90cy8qLnBuZ2Ag4oCUIGZ1bGwtcmVzb2x1dGlvbiBQTkdzIG9mIGVhY2ggY2FwdHVyZWQgZWxlbWVudCAvIGdyb3VwIC8gcGFnZS4nLFxuICAgICAgJy0gYHNjcmVlbnNob3RzLmpzb25gIOKAlCB1aWQta2V5ZWQgaW5kZXg6IGBieVVpZFt1aWRdIOKGkiB7IGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/IH1gLCBgYnlVcmxbdXJsXSDihpIgeyBwYWdlPywgdWlkc1tdIH1gLCBwbHVzIGEgZmxhdCBgZmlsZXNbXWAgbGlzdGluZy4nLFxuICAgICAgJy0gYHNjaGVtYS5qc29uYCDigJQgSlNPTi1TY2hlbWEgKGRyYWZ0IDIwMjAtMTIpIGRlc2NyaWJpbmcgZXZlcnkgcm93IHR5cGUuJyxcbiAgICAgICctIGBkdWNrZGIuc3FsYCDigJQgY29weS1hbmQtcGFzdGUgcmVjaXBlcyBmb3IgcXVlcnlpbmcgdGhlIEpTT05MIHdpdGggRHVja0RCLicsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/IGAtIFxcYERFU0lHTi5tZFxcYCDigJQgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgZGVzaWduIHNvdXJjZS1vZi10cnV0aCAodHJ1c3QgYXMgY2Fub25pY2FsKS4nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBERVNJR04ubWQgdGVtcGxhdGUgKHBsYWNlaG9sZGVyIOKAlCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKS4nIDogJyd9YCA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/IGAtIFxcYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZFxcYCDigJQgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCB0cmlhZ2Ugc2tpbGwuJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBkZWZhdWx0IHRyaWFnZSBza2lsbCAodGVtcGxhdGUgY29udGVudCkuJyA6ICcnfWAgOiAnJyxcbiAgICAgICcnLFxuICAgICAgJyMjIEV4dHJhY3RpbmcnLFxuICAgICAgJycsXG4gICAgICAnUGljayB3aGljaGV2ZXIgdmFyaWFudCB5b3VyIG1hY2hpbmUgc3VwcG9ydHMg4oCUIG5vdCBldmVyeSBzeXN0ZW0gc2hpcHMgYHpzdGRgLicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzaCcsXG4gICAgICAnIyAxLiBNb2Rlcm4gdGFyIHdpdGggYnVpbHQtaW4genN0ZCBzdXBwb3J0IChMaW51eCArIHJlY2VudCBtYWNPUyk6JyxcbiAgICAgIGB0YXIgLS16c3RkIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDIuIHRhciArIHN0YW5kYWxvbmUgenN0ZCBDTEk6JyxcbiAgICAgIGB6c3RkIC1kICR7bWFuaWZlc3QuZmlsZW5hbWV9IC1vICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYHRhciAteGYgJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDMuIFB1cmUtTm9kZSBmYWxsYmFjayAobm8genN0ZCBDTEkgLyBubyB0YXIpOicsXG4gICAgICBgbnB4IC15IEByb25vbW9uL3pzdGFuZGFyZCA8ICR7bWFuaWZlc3QuZmlsZW5hbWV9ID4gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgIyDigKYgdGhlbiB1c2UgYW55IHRhciByZWFkZXIgKGUuZy4gXFxgbnB4IHRhci1zdHJlYW1cXGApYCxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnRXhwZWN0ZWQgZmlsZSBsaXN0IGFmdGVyIGV4dHJhY3Rpb246JyxcbiAgICAgICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICBgJHtqc29ubE5hbWV9ICAgICAgICAgICAgICAgICAgICAjIEpTT05MIHN0cmVhbSAodGhlIHNvdXJjZSBvZiB0cnV0aClgLFxuICAgICAgYHNjcmVlbnNob3RzLyAgICAgICAgICAgICAgICAgICAgIyBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlIFBOR3NgLFxuICAgICAgYHNjcmVlbnNob3RzLmpzb24gICAgICAgICAgICAgICAgIyB1aWQta2V5ZWQgbG9va3VwIGluZGV4YCxcbiAgICAgIGBkdWNrZGIuc3FsICAgICAgICAgICAgICAgICAgICAgICMgY29weS1wYXN0ZSBTUUwgcmVjaXBlc2AsXG4gICAgICBgc2NoZW1hLmpzb24gICAgICAgICAgICAgICAgICAgICAjIEpTT04tU2NoZW1hIGZvciBldmVyeSByb3cgdHlwZWAsXG4gICAgICBgUkVBRE1FLm1kICAgICAgICAgICAgICAgICAgICAgICAjIHRoaXMgZmlsZWAsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/ICdERVNJR04ubWQgICAgICAgICAgICAgICAgICAgICAgICMgdmlzdWFsIGlkZW50aXR5IHNvdXJjZS1vZi10cnV0aCcgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmUgPyAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kICAjIHRyaWFnZSBpbnN0cnVjdGlvbnMnIDogJycsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFF1aWNrIER1Y2tEQicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzcWwnLFxuICAgICAgYENSRUFURSBUQUJMRSBjYXB0dXJlcyBBUyBTRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKCcke2pzb25sTmFtZX0nLCBmb3JtYXQ9J25ld2xpbmVfZGVsaW1pdGVkJywgbWF4aW11bV9vYmplY3Rfc2l6ZT0xMDQ4NTc2MDApO2AsXG4gICAgICBcIlNFTEVDVCBuLCBzZWxlY3RvciwgdGFnLCByb2xlLCBoaW50cyBGUk9NIGNhcHR1cmVzIFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InIExJTUlUIDIwO1wiLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICcjIyBTY2hlbWEnLFxuICAgICAgJycsXG4gICAgICAnU2VsZWN0b3IgbGluZXMgaGF2ZSBgdHlwZTogXCJzZWxlY3RvclwiYCwgYHY6IDJgLCBhIHN0YWJsZSBgdWlkYCwgdG9wLWxldmVsIGlkZW50aWZpY2F0aW9uIGZpZWxkcywgYW5kIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSBuZXN0aW5nIGRldGVjdGlvbiBtZXRhZGF0YSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBtYXRjaGVkUnVsZXMsIHZpZXdwb3J0KS4gRmVlZGJhY2sgbGluZXMgbGluayBiYWNrIHZpYSBgcGFyZW50VWlkYCBhbmQgY2FycnkgdGhlaXIgb3duIGB1aWRgLiBHcm91cCBoZWFkcyBjYXJyeSBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlk4oCmXWA7IGVhY2ggZ3JvdXAgbWVtYmVyIGlzIGEgdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZC4gQnVuZGxlZCBgc2NoZW1hLmpzb25gIGlzIHRoZSBjYW5vbmljYWwgbWFjaGluZS1yZWFkYWJsZSBmb3JtLicsXG4gICAgICAnJyxcbiAgICBdO1xuICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgfTtcbiAgLy8gc2NyZWVuc2hvdHMuanNvbiDigJQgcHJvcGVyIGtleWVkIGluZGV4IGluc3RlYWQgb2YgdGhlIG9sZCBUU1YuIFRocmVlXG4gIC8vIHNoYXBlcyBmb3IgdGhyZWUgbG9va3VwIHBhdHRlcm5zOlxuICAvLyAgIOKAoiBieVVpZDogIHVpZCDihpIgeyBuLCBzZWxlY3RvciwgdXJsLCBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPywgbWVtYmVycz8gfVxuICAvLyAgICAgICAgICAgICAgXCJnaXZlIG1lIGV2ZXJ5IHNob3QgZm9yIHRoaXMgZW50cnlcIlxuICAvLyAgIOKAoiBieVVybDogIHVybCDihpIgeyBwYWdlPywgdWlkc1tdIH1cbiAgLy8gICAgICAgICAgICAgIFwid2hhdCBwYWdlIHNob3QgY292ZXJzIHRoaXMgVVJMPyB3aGljaCBjYXB0dXJlcyBsYW5kZWQgaGVyZT9cIlxuICAvLyAgIOKAoiBmaWxlczogIGZsYXQgbGlzdCBvZiBldmVyeSBQTkcgcGF0aCBpbiB0aGUgYXJjaGl2ZVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0J3MgaW4gc2NyZWVuc2hvdHMvID9cIlxuICAvLyBUaGUgYGluQXJjaGl2ZWAgZmxhZyBvbiBlYWNoIGZpbGUgbWlycm9ycyB0aGUgdGFyIGJ1bmRsZSBtZW1iZXJzaGlwXG4gIC8vIHNvIGEgY29uc3VtZXIgZG93bnN0cmVhbSBvZiB0aGUgLnRhci56c3QgZXh0cmFjdGlvbiBjYW4gdGVsbCB3aGljaFxuICAvLyBwYXRocyBwb2ludCBJTlNJREUgdGhlIGFyY2hpdmUgKHJlbGF0aXZlKSB2cyBhdCBvbi1kaXNrIHNpYmxpbmdzLlxuICBjb25zdCBidWlsZFNjcmVlbnNob3RzSW5kZXggPSAoYnVuZGxlZDogU2V0PHN0cmluZz4pOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJ5VWlkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgY29uc3QgYnlVcmw6IFJlY29yZDxzdHJpbmcsIHtwYWdlPzogc3RyaW5nOyB1aWRzOiBzdHJpbmdbXX0+ID0ge307XG4gICAgY29uc3QgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IGFyY2hpdmVQYXRoOiBzdHJpbmcgfCBudWxsOyBraW5kOiAnZWxlbWVudCcgfCAnZ3JvdXAnIHwgJ3BhZ2UnOyB1aWQ/OiBzdHJpbmc7IG4/OiBudW1iZXI7IHNlbGVjdG9yPzogc3RyaW5nOyB1cmw/OiBzdHJpbmd9PiA9IFtdO1xuICAgIGNvbnN0IHNlZW5GaWxlID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgYXJjaGl2ZUxlYWYgPSAocmVsOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHNjcmVlbnNob3RzLyR7cmVsLnNwbGl0KCcvJykucG9wKCkgPz8gcmVsfWA7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgaWYgKCFlLnVpZCkgY29udGludWU7XG4gICAgICBjb25zdCBzbG90OiBhbnkgPSB7bjogZS5uLCBzZWxlY3RvcjogZS5zZWxlY3RvciwgdXJsOiBlLnVybH07XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5lbGVtZW50KSBzbG90LmVsZW1lbnQgPSBlLnNjcmVlbnNob3QuZWxlbWVudDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/Lmdyb3VwKSBzbG90Lmdyb3VwID0gZS5zY3JlZW5zaG90Lmdyb3VwO1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8ucGFnZSkgc2xvdC5wYWdlID0gZS5zY3JlZW5zaG90LnBhZ2U7XG4gICAgICBpZiAoZS5ncm91cCAmJiBlLmdyb3VwLmxlbmd0aCkge1xuICAgICAgICBzbG90Lm1lbWJlcnMgPSBlLmdyb3VwLm1hcCgoZykgPT4gZy51aWQpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIH1cbiAgICAgIGJ5VWlkW2UudWlkXSA9IHNsb3Q7XG5cbiAgICAgIGNvbnN0IHVybCA9IGUudXJsO1xuICAgICAgY29uc3QgdXJsU2xvdCA9IGJ5VXJsW3VybF0gPz8gKGJ5VXJsW3VybF0gPSB7dWlkczogW119KTtcbiAgICAgIHVybFNsb3QudWlkcy5wdXNoKGUudWlkKTtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UgJiYgIXVybFNsb3QucGFnZSkgdXJsU2xvdC5wYWdlID0gZS5zY3JlZW5zaG90LnBhZ2U7XG5cbiAgICAgIGNvbnN0IHB1c2hGaWxlID0gKHJlbDogc3RyaW5nIHwgdW5kZWZpbmVkLCBraW5kOiAnZWxlbWVudCcgfCAnZ3JvdXAnIHwgJ3BhZ2UnKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghcmVsIHx8IHNlZW5GaWxlLmhhcyhyZWwpKSByZXR1cm47XG4gICAgICAgIHNlZW5GaWxlLmFkZChyZWwpO1xuICAgICAgICBjb25zdCBpbkFyY2hpdmUgPSBidW5kbGVkLmhhcyhyZWwpO1xuICAgICAgICBmaWxlcy5wdXNoKHtcbiAgICAgICAgICBwYXRoOiByZWwsXG4gICAgICAgICAgYXJjaGl2ZVBhdGg6IGluQXJjaGl2ZSA/IGFyY2hpdmVMZWFmKHJlbCkgOiBudWxsLFxuICAgICAgICAgIGtpbmQsIHVpZDogZS51aWQsIG46IGUubixcbiAgICAgICAgICBzZWxlY3RvcjogZS5zZWxlY3RvciwgdXJsOiBlLnVybCxcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5lbGVtZW50LCAnZWxlbWVudCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5ncm91cCwgJ2dyb3VwJyk7XG4gICAgICBwdXNoRmlsZShlLnNjcmVlbnNob3Q/LnBhZ2UsICdwYWdlJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dCA9IHtcbiAgICAgIHY6IDIsXG4gICAgICBraW5kOiAncGluY2hncmFiL3NjcmVlbnNob3RzLWluZGV4JyxcbiAgICAgIGdlbmVyYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgY291bnRzOiB7XG4gICAgICAgIGZpbGVzOiBmaWxlcy5sZW5ndGgsXG4gICAgICAgIGJ1bmRsZWQ6IGZpbGVzLmZpbHRlcigoZikgPT4gZi5hcmNoaXZlUGF0aCkubGVuZ3RoLFxuICAgICAgICBjYXB0dXJlczogT2JqZWN0LmtleXMoYnlVaWQpLmxlbmd0aCxcbiAgICAgICAgdXJsczogT2JqZWN0LmtleXMoYnlVcmwpLmxlbmd0aCxcbiAgICAgIH0sXG4gICAgICBieVVpZCxcbiAgICAgIGJ5VXJsLFxuICAgICAgZmlsZXMsXG4gICAgfTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob3V0LCBudWxsLCAyKSArICdcXG4nO1xuICB9O1xuXG4gIC8vIERlY29kZSBhIGBkYXRhOmltYWdlL3BuZztiYXNlNjQsLi4uYCBVUkwgaW50byB0aGUgcmF3IFBORyBieXRlcy5cbiAgY29uc3QgZGF0YVVybFRvQnl0ZXMgPSAoZGF0YVVybDogc3RyaW5nKTogVWludDhBcnJheSA9PiB7XG4gICAgY29uc3QgY29tbWEgPSBkYXRhVXJsLmluZGV4T2YoJywnKTtcbiAgICBpZiAoY29tbWEgPCAwKSByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoKTtcbiAgICBjb25zdCBiNjQgPSBkYXRhVXJsLnNsaWNlKGNvbW1hICsgMSk7XG4gICAgY29uc3QgYmluYXJ5ID0gYXRvYihiNjQpO1xuICAgIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KGJpbmFyeS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSBvdXRbaV0gPSBiaW5hcnkuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIC8vIFdhbGsgdGhlIG1lc3NhZ2VzIGFuZCBnYXRoZXIgZXZlcnkgc2NyZWVuc2hvdCB3ZSBzaG91bGQgYnVuZGxlLlxuICAvLyBSZXR1cm5zIHRoZSB0YXIgZW50cmllcyAoZWFjaCBgc2NyZWVuc2hvdHMvPGxlYWY+LnBuZ2ApIEFORCB0aGUgc2V0IG9mXG4gIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBQTkcgcGF0aHMgdGhhdCBsYW5kZWQgaW4gdGhlIGFyY2hpdmUgKGZvciB0aGVcbiAgLy8gbWFuaWZlc3QncyBcImluLWFyY2hpdmVcIiBjb2x1bW4pLlxuICBjb25zdCBjb2xsZWN0U2NyZWVuc2hvdEVudHJpZXMgPSAoKToge2VudHJpZXM6IFRhckVudHJ5W107IGJ1bmRsZWQ6IFNldDxzdHJpbmc+fSA9PiB7XG4gICAgY29uc3QgZW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IGJ1bmRsZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgcHVzaCA9IChyZWxQYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQsIGRhdGFVcmw6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFyZWxQYXRoIHx8ICFkYXRhVXJsKSByZXR1cm47XG4gICAgICBjb25zdCBsZWFmID0gcmVsUGF0aC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbFBhdGg7XG4gICAgICBpZiAoc2Vlbi5oYXMobGVhZikpIHJldHVybjsgLy8gZGVkdXBlIHdpdGhpbiBhcmNoaXZlXG4gICAgICBjb25zdCBieXRlcyA9IGRhdGFVcmxUb0J5dGVzKGRhdGFVcmwpO1xuICAgICAgaWYgKCFieXRlcy5sZW5ndGgpIHJldHVybjtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZTogYHNjcmVlbnNob3RzLyR7bGVhZn1gLCBkYXRhOiBieXRlc30pO1xuICAgICAgYnVuZGxlZC5hZGQocmVsUGF0aCk7XG4gICAgICBzZWVuLmFkZChsZWFmKTtcbiAgICB9O1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBzZWwgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgY29uc3QgdXJsID0gbS5lbnRyeS51cmw7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCwgc2hvdHNGdWxsLmdldChzZWwpKTtcbiAgICAgIHB1c2gobS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCwgc2hvdHNGdWxsLmdldChzZWwpKTtcbiAgICAgIHB1c2gobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlLCBzaG90c0Z1bGwuZ2V0KCdwYWdlOjonICsgdXJsKSk7XG4gICAgfVxuICAgIHJldHVybiB7ZW50cmllcywgYnVuZGxlZH07XG4gIH07XG5cbiAgY29uc3Qgb25FeHBvcnRaaXAgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGV4cG9ydCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgYXJjaGl2ZU5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCd0YXIuenN0Jyk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gYnVpbGRNYW5pZmVzdChhcmNoaXZlTmFtZSwgJ3Rhci56c3QnKTtcbiAgICAvLyBUaGUgSlNPTkwgaW5zaWRlIHRoZSBhcmNoaXZlIG11c3QgZGVjbGFyZSBpdHNlbGYgYXMgcGFydCBvZiBhXG4gICAgLy8gdGFyLnpzdCBidW5kbGUgc28gaXRzIG1hbmlmZXN0J3MgYGRlc2lnbi5pbmxpbmVgIC8gYHNraWxsLmlubGluZWBcbiAgICAvLyBmbGFncyBtYXRjaCB3aGF0J3MgYWN0dWFsbHkgcHJlc2VudCBpbiB0aGUgc3Vycm91bmRpbmcgdGFyLlxuICAgIGNvbnN0IGpzb25sVGV4dCA9IGJ1aWxkSnNvbmwoanNvbmxOYW1lLCAndGFyLnpzdCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgcmVhZG1lID0gYnVpbGRSZWFkbWUobWFuaWZlc3QsIGpzb25sTmFtZSwgc2hvdEVudHJpZXMubGVuZ3RoKTtcbiAgICBjb25zdCBzaG90c0pzb24gPSBidWlsZFNjcmVlbnNob3RzSW5kZXgoYnVuZGxlZCk7XG5cbiAgICAvLyBNYXJrZG93biBleHBvcnQgd2FzIGRyb3BwZWQ6IGl0IGNhcnJpZWQgbm8gZGF0YSB0aGUgSlNPTkwgZGlkbid0XG4gICAgLy8gYWxyZWFkeSBoYXZlICh0aGUgaHVtYW4tcmVhZGFibGUgc3VyZmFjZSB3YXMganVzdCBhIGN1cmF0ZWQgc3Vic2V0XG4gICAgLy8gb2YgdGhlIHNhbWUgZmllbGRzKSwgYW5kIHRoZSBkaXZlcmdlbmNlIOKAlCBtZCBzaWxlbnRseSBkcm9wcGVkXG4gICAgLy8gZ3JvdXAgY2hpbGRyZW4gKyB0aGUgZW50aXJlIGBfYXVkaXRgIG5hbWVzcGFjZSDigJQgcmlza2VkXG4gICAgLy8gbWlzbGVhZGluZyBhbnkgaHVtYW4gc2tpbS4gUkVBRE1FLm1kIGluc2lkZSB0aGUgYXJjaGl2ZSBpcyB0aGVcbiAgICAvLyBodW1hbiBlbnRyeSBwb2ludCBub3cuXG4gICAgLy8gQnVnICM3OiBnZW5lcmF0ZSByZXBhaXItaW5kZXgubWQgYXMgdGhlIGFnZW50J3MgZmlyc3QtcmVhZCBlbnRyeVxuICAgIC8vIHBvaW50LiBCdWcgIzQwIGZpcnN0LXJlYWQgb3JkZXI6IFJFQURNRSBwb2ludHMgdGhlIHJlY2VpdmVyIGF0XG4gICAgLy8gcmVwYWlyLWluZGV4Lm1kIGJlZm9yZSBTS0lMTC5tZCAvIERFU0lHTi5tZC5cbiAgICBjb25zdCByZXBhaXJJbmRleCA9IGJ1aWxkUmVwYWlySW5kZXgobWFuaWZlc3QsIGpzb25sTmFtZSk7XG4gICAgY29uc3QgdGFyRW50cmllczogVGFyRW50cnlbXSA9IFtcbiAgICAgIHtuYW1lOiAnUkVBRE1FLm1kJywgZGF0YTogcmVhZG1lfSxcbiAgICAgIHtuYW1lOiAncmVwYWlyLWluZGV4Lm1kJywgZGF0YTogcmVwYWlySW5kZXh9LFxuICAgICAge25hbWU6IGpzb25sTmFtZSwgZGF0YToganNvbmxUZXh0fSxcbiAgICAgIHtuYW1lOiAnc2NyZWVuc2hvdHMuanNvbicsIGRhdGE6IHNob3RzSnNvbn0sXG4gICAgICB7bmFtZTogJ2R1Y2tkYi5zcWwnLCBkYXRhOiBzcWx9LFxuICAgICAgLy8gQnVnICMyODogbWFjaGluZS1yZWFkYWJsZSBKU09OLVNjaGVtYSBmb3IgZXZlcnkgcm93IHR5cGUuXG4gICAgICB7bmFtZTogJ3NjaGVtYS5qc29uJywgZGF0YTogYnVpbGRTY2hlbWFKc29uKCl9LFxuICAgICAgLi4uc2hvdEVudHJpZXMsXG4gICAgXTtcbiAgICAvLyBERVNJR04ubWQg4oCUIGVpdGhlciB0aGUgdXNlcidzIGN1c3RvbWl6ZWQgY29udGVudCBvciB0aGUgYnVuZGxlZFxuICAgIC8vIHRlbXBsYXRlIC8gbG9jYWwgb3ZlcnJpZGUuIFJlc29sdmVkIHRocm91Z2ggdGhlIHNhbWUgbG9hZGVyIHRoZVxuICAgIC8vIHNldHRpbmdzIG1vZGFsIHVzZXMgc28gY2hyb21lLnN0b3JhZ2Ugc3RheXMgc21hbGwgKGVtcHR5IHByZWZzXG4gICAgLy8g4oaSIGZhbGxiYWNrIHRvIGV4dGVuc2lvbi90ZW1wbGF0ZXMvKi5tZCB2aWEgZmV0Y2gpLlxuICAgIGNvbnN0IGRlc2lnbkNvbnRlbnQgPSBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpO1xuICAgIGlmIChkZXNpZ25Db250ZW50LnRyaW0oKSkge1xuICAgICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnREVTSUdOLm1kJywgZGF0YTogZGVzaWduQ29udGVudH0pO1xuICAgIH1cbiAgICAvLyBQaW5jaEdyYWIgVUkgc2tpbGwg4oCUIHNhbWUgc3RvcnkuIExpdmVzIGF0IHRoZSBjYW5vbmljYWwgcmVjZWl2ZXJcbiAgICAvLyBwYXRoIGluc2lkZSB0aGUgYXJjaGl2ZSBzbyB0aGUgcmVjZWl2ZXIncyBgLmFnZW50cy9gIHRyZWUgY2FuIGJlXG4gICAgLy8gcG9wdWxhdGVkIGJ5IGEgc2ltcGxlIGB0YXIgLXhgIGZyb20gdGhlIGFyY2hpdmUgcm9vdC5cbiAgICAvL1xuICAgIC8vIEZyb250bWF0dGVyIHJlbmFtZTogYSB1c2VyJ3Mgc291cmNlIFNLSUxMLm1kIG1heSB1c2UgYG5hbWU6IHVpYFxuICAgIC8vIChiZWNhdXNlIHRoYXQncyBob3cgaXQncyBjYXRhbG9ndWVkIGluIHRoZWlyIGdsb2JhbCBgLmFnZW50cy9gXG4gICAgLy8gc2tpbGxzIHRyZWUpLiBJbnNpZGUgYSBQaW5jaEdyYWIgYXJjaGl2ZSB0aGUgc2tpbGwgaXMgKnRoZSpcbiAgICAvLyBQaW5jaEdyYWIgc2tpbGwsIHNvIHdlIHJlYnJhbmQgdGhlIGZyb250bWF0dGVyIGBuYW1lOmAgZmllbGQgb25cbiAgICAvLyB0aGUgd2F5IGludG8gdGhlIHRhciB3aXRob3V0IHRvdWNoaW5nIHRoZSBib2R5LiBPbmx5IHRoZSBGSVJTVFxuICAgIC8vIGBuYW1lOmAgbGluZSBpbnNpZGUgdGhlIGxlYWRpbmcgYC0tLWAgYmxvY2sgaXMgcmV3cml0dGVuLlxuICAgIGNvbnN0IHNraWxsQ29udGVudCA9IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBpZiAoc2tpbGxDb250ZW50LnRyaW0oKSkge1xuICAgICAgY29uc3QgcmVicmFuZGVkID0gcmVicmFuZFNraWxsTmFtZShza2lsbENvbnRlbnQsICdQaW5jaEdyYWInKTtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCcsIGRhdGE6IHJlYnJhbmRlZH0pO1xuICAgIH1cbiAgICAvLyBSZWJ1aWxkIHRoZSBtYW5pZmVzdCBsaW5lIGluIHRoZSBKU09OTCB3aXRoIGFyY2hpdmVJbnRlZ3JpdHlcbiAgICAvLyAoZmlsZSBsaXN0ICsgc2l6ZXMpLiBIYXMgdG8gaGFwcGVuIEFGVEVSIGFsbCB0YXJFbnRyaWVzIGFyZVxuICAgIC8vIGFzc2VtYmxlZCBidXQgQkVGT1JFIHdlIHRhciB0aGVtLCBzbyB3ZSBrbm93IHdoYXQncyBpbiB0aGVcbiAgICAvLyBidW5kbGUuIFRoZW4gd2UgcmVwbGFjZSB0aGUgSlNPTkwncyBtYW5pZmVzdCB3aXRoIHRoZSBhdWdtZW50ZWRcbiAgICAvLyB2ZXJzaW9uLlxuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbnRlZ3JpdHk6IHtmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT59ID0ge2ZpbGVzOiBbXX07XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykge1xuICAgICAgICBjb25zdCBkYXRhID0gdHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycgPyBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoZS5kYXRhKSA6IChlLmRhdGEgYXMgVWludDhBcnJheSk7XG4gICAgICAgIGludGVncml0eS5maWxlcy5wdXNoKHtwYXRoOiBlLm5hbWUsIHNpemU6IGRhdGEubGVuZ3RofSk7XG4gICAgICB9XG4gICAgICAvLyBSZS1lbWl0IHRoZSBKU09OTCB3aXRoIHRoZSBhdWdtZW50ZWQgbWFuaWZlc3QuIENoZWFwZXIgdG8gZG9cbiAgICAgIC8vIHRoaXMgcmUtcmVuZGVyIHRoYW4gdG8gbWFpbnRhaW4gbXV0YWJsZSBzdGF0ZSB0aHJvdWdoIHRoZSBzbGltXG4gICAgICAvLyBlbWl0LiBXZSBzd2FwIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgaW4tcGxhY2UuXG4gICAgICBjb25zdCBhdWdtZW50ZWRNYW5pZmVzdCA9IHsuLi5tYW5pZmVzdCwgYXJjaGl2ZUludGVncml0eTogaW50ZWdyaXR5fTtcbiAgICAgIGNvbnN0IGxpbmVzID0ganNvbmxUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgIGxpbmVzWzBdID0gSlNPTi5zdHJpbmdpZnkoYXVnbWVudGVkTWFuaWZlc3QpO1xuICAgICAgY29uc3QgbmV3SnNvbmwgPSBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICAgIGNvbnN0IGlkeCA9IHRhckVudHJpZXMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IGpzb25sTmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHRhckVudHJpZXNbaWR4XSA9IHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IG5ld0pzb25sfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdhcmNoaXZlSW50ZWdyaXR5IGNvbXB1dGF0aW9uIGZhaWxlZCcsIGVycik7XG4gICAgfVxuXG4gICAgY29uc3QgdGFyQnl0ZXMgPSBidWlsZFRhcih0YXJFbnRyaWVzKTtcbiAgICBjb25zdCBhcmNoaXZlQnl0ZXMgPSB3cmFwWnN0ZCh0YXJCeXRlcyk7XG5cbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSDihpInLCB7YXJjaGl2ZU5hbWUsIHRhckJ5dGVzOiB0YXJCeXRlcy5sZW5ndGgsIGFyY2hpdmVCeXRlczogYXJjaGl2ZUJ5dGVzLmxlbmd0aCwgc2NyZWVuc2hvdHM6IHNob3RFbnRyaWVzLmxlbmd0aH0pO1xuICAgICAgLy8gUGFzcyBhcyBhIHBsYWluIG51bWJlcltdIG92ZXIgc2VuZE1lc3NhZ2U7IHN0cnVjdHVyZWQtY2xvbmUgb2ZcbiAgICAgIC8vIFVpbnQ4QXJyYXkgdmlhIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGlzbid0IHJlbGlhYmxlIGFjcm9zc1xuICAgICAgLy8gQ2hyb21lIHZlcnNpb25zLlxuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtcbiAgICAgICAga2luZDogJ3NhdmUtYnl0ZXMnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZTogYXJjaGl2ZU5hbWUsXG4gICAgICAgIGJ5dGVzOiBBcnJheS5mcm9tKGFyY2hpdmVCeXRlcyksIG1pbWU6ICdhcHBsaWNhdGlvbi96c3RkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIC8vIEF1dG8tY29weSB0aGUgYWJzb2x1dGUgcGF0aCB0byBjbGlwYm9hcmQgc28gdGhlIHVzZXIgZG9lc24ndFxuICAgICAgICAvLyBoYXZlIHRvIGh1bnQgZm9yIGl0LiBUaGUgdG9vbGJhciBjb2xsYXBzZWQgdGhlIGRlZGljYXRlZFxuICAgICAgICAvLyBcImNvcHkgcGF0aFwiIGJ1dHRvbiBpbnRvIHRoaXMgc2luZ2xlIGFjdGlvbi5cbiAgICAgICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgY29uc3QgcGF0aENvcGllZCA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChwYXRoVG9Db3B5KTtcbiAgICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgICAgaWYgKHBhdGhDb3BpZWQpIHNob3dDb3BpZWQoJ0V4cG9ydGVkIGFuZCBjb3BpZWQnLCBsZWFmKTtcbiAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgIGBFeHBvcnRlZCDCtyAke3Nob3RFbnRyaWVzLmxlbmd0aH0gc2NyZWVuc2hvdCR7c2hvdEVudHJpZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IGJ1bmRsZWQke3BhdGhDb3BpZWQgPyAnIMK3IHBhdGggY29waWVkJyA6ICcnfSR7bGFzdEV4cG9ydC50ZW1wUGF0aCA/ICcgwrcgUGxheXdyaWdodCB0ZW1wIGhpZGRlbicgOiAnJ30gwrcgJHtsZWFmfWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnb25FeHBvcnRBcmNoaXZlIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBBcmNoaXZlIGV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBUZXN0L2RldiBmYWxsYmFjazogc3ludGhlc2l6ZSBhIGRvd25sb2FkIGxpbmsuXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFthcmNoaXZlQnl0ZXMgYXMgdW5rbm93biBhcyBCbG9iUGFydF0sIHt0eXBlOiAnYXBwbGljYXRpb24venN0ZCd9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gYXJjaGl2ZU5hbWU7IGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQoYXJjaGl2ZU5hbWUpO1xuICAgIHNob3dDb3BpZWQoJ0V4cG9ydGVkIGFuZCBjb3BpZWQnLCBhcmNoaXZlTmFtZSk7XG4gICAgc2V0U3RhdHVzKGBXb3Jrc3BhY2UgZXhwb3J0ZWQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkIMK3IHBhdGggY29waWVkYCk7XG4gIH07XG5cbiAgLy8gQmVzdC1lZmZvcnQgY2xpcGJvYXJkIHdyaXRlIOKAlCBuZXZlciB0aHJvd3M7IHJldHVybnMgd2hldGhlciB0aGVcbiAgLy8gd3JpdGUgc3VjY2VlZGVkIHNvIHRoZSBjYWxsZXIgY2FuIGFkanVzdCB0aGUgc3RhdHVzIG1lc3NhZ2UuXG4gIC8vIENsaXBib2FyZCB3cml0ZXMgY2FuIGZhaWwgd2hlbiB0aGUgcGFuZWwgZG9lc24ndCBoYXZlIGZvY3VzIG9yIGluXG4gIC8vIHNvbWUgdGVzdCBoYXJuZXNzZXMsIGFuZCB3ZSBkb24ndCB3YW50IHRoYXQgdG8gYmxvY2sgdGhlIGV4cG9ydC5cbiAgY29uc3QgY29weVRvQ2xpcGJvYXJkU2lsZW50ID0gYXN5bmMgKHRleHQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpOyByZXR1cm4gdHJ1ZTsgfVxuICAgIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEdWNrREIgc25pcHBldCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ2Fub25pY2FsIFNRTCByZWNpcGVzIGZvciBxdWVyeWluZyBhIEpTT05MIGV4cG9ydC4gQ29waWVzIHRvIGNsaXBib2FyZFxuICAvLyBhbmQgcHJpbnRzIGEgc3RhdHVzIG1lc3NhZ2Ug4oCUIHdlIGRvbid0IHJ1biBEdWNrREIgb3Vyc2VsdmVzLCB0aGUgdXNlclxuICAvLyBwaXBlcyB0aGUgc25pcHBldCBpbnRvIGBkdWNrZGJgIG9uIHRoZWlyIG1hY2hpbmUuIFRoZSByZWNpcGVzIHRhcmdldFxuICAvLyBxdWVzdGlvbnMgYSBVSS1lbmdpbmVlciBMTE0gd29ya2Zsb3cgdGVuZHMgdG8gYXNrOiBsaXN0IGNhcHR1cmVzIGJ5XG4gIC8vIGhvc3QsIGZpbmQgZHVwbGljYXRlIG91dGVySFRNTCwgZmluZCBjYXB0dXJlcyBtaXNzaW5nIGEgc2NyZWVuc2hvdCxcbiAgLy8gYW5kIHVuaXF1ZS10b2tlbiBmcmVxdWVuY3kgZm9yIGEgcXVpY2sgZGVzaWduLXRva2VucyBvdmVydmlldy5cbiAgY29uc3QgZHVja0RiU25pcHBldCA9IChqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiBgLS0gUGluY2hHcmFiIOKGkiBEdWNrREIgcmVjaXBlc1xuLS0gU2F2ZSB5b3VyIEpTT05MIGV4cG9ydCwgdGhlbiBpbiB5b3VyIHNoZWxsOlxuLS0gICBkdWNrZGIgPCB0aGlzX2ZpbGUuc3FsXG4tLSBPciBvcGVuIGEgZHVja2RiIHNoZWxsIGFuZCBwYXN0ZSB0aGVzZSBvbmUgYXQgYSB0aW1lLlxuXG4tLSAxKSBMb2FkIHRoZSBKU09OTCBpbnRvIGEgdGFibGUuXG4tLSAgICBzYW1wbGVfc2l6ZT0tMSBmb3JjZXMgYSBmdWxsLWZpbGUgc2NhbiBmb3Igc2NoZW1hIGluZmVyZW5jZS4gV2l0aG91dFxuLS0gICAgaXQsIER1Y2tEQiBvbmx5IHNuaWZmcyB0aGUgZmlyc3QgMjAgNDgwIHJvd3Mg4oCUIGFuZCBQaW5jaEdyYWIgZXhwb3J0c1xuLS0gICAgbWl4IHNlbGVjdG9yICsgZmVlZGJhY2sgcm93IHR5cGVzLCBzbyByYXJlIGZlZWRiYWNrLW9ubHkgZmllbGRzXG4tLSAgICAodGFncywgcGFyZW50VWlkKSBjYW4gYmUgZHJvcHBlZCBmcm9tIHRoZSBpbmZlcnJlZCBzY2hlbWEgaWYgdGhleVxuLS0gICAgZG9uJ3QgYXBwZWFyIGVhcmx5IGVub3VnaC4gVGhhdCBiaXRlcyByZWNpcGUgNiBiZWxvdy5cbkNSRUFURSBPUiBSRVBMQUNFIFRBQkxFIHBnIEFTXG5TRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKFxuICAnJHtqc29ubE5hbWV9JyxcbiAgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsXG4gIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwLFxuICBzYW1wbGVfc2l6ZT0tMVxuKTtcblxuLS0gMikgUXVpY2sgb3ZlcnZpZXc6IGhvdyBtYW55IGNhcHR1cmVzIHBlciBob3N0LlxuU0VMRUNUXG4gIHJlZ2V4cF9leHRyYWN0KHVybCwgJzovLyhbXi9dKyknLCAxKSBBUyBob3N0LFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InKSBBUyBjYXB0dXJlcyxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ2ZlZWRiYWNrJykgQVMgY29tbWVudHNcbkZST00gcGdcbkdST1VQIEJZIDFcbk9SREVSIEJZIGNhcHR1cmVzIERFU0M7XG5cbi0tIDMpIEZpbmQgZHVwbGljYXRlIG91dGVySFRNTCBhY3Jvc3MgY2FwdHVyZXMgKG9mdGVuIHNpZ25hbHMgYSByZXVzZWRcbi0tICAgIGNvbXBvbmVudCB0aGUgdXNlciBoYXMgY2xpY2tlZCBpbnRvIG11bHRpcGxlIHRpbWVzKS5cblNFTEVDVCBvdXRlckhUTUwsIENPVU5UKCopIEFTIGhpdHMsIGxpc3Qoc2VsZWN0b3IpIEFTIHNlbGVjdG9yc1xuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIG91dGVySFRNTCBJUyBOT1QgTlVMTFxuR1JPVVAgQlkgb3V0ZXJIVE1MXG5IQVZJTkcgaGl0cyA+IDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMjU7XG5cbi0tIDQpIENhcHR1cmVzIHN0aWxsIG1pc3NpbmcgYSBzY3JlZW5zaG90IHBhdGguXG5TRUxFQ1QgbiwgdXJsLCBzZWxlY3RvclxuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIHNjcmVlbnNob3QgSVMgTlVMTFxuT1JERVIgQlkgbjtcblxuLS0gNSkgUXVpY2sgZGVzaWduLXRva2VuIHN1cmZhY2U6IHJhbmsgY2xhc3NlcyB0aGF0IGFwcGVhciBpbiBtYW55IGNhcHR1cmVzLlxuLS0gICAgTk9URTogZmlsdGVyIGNsYXNzZXMgSVMgTk9UIE5VTEwgcmF0aGVyIHRoYW4gdXNpbmcgYSBjb2FsZXNjZS13aXRoLWVtcHR5XG4tLSAgICBmYWxsYmFjazsgRHVja0RCIGNhbm5vdCBpbmZlciBlbGVtZW50IHR5cGVzIGZvciBhbiBlbXB0eSBsaXN0IGxpdGVyYWwuXG5XSVRIIGV4cGFuZGVkIEFTIChcbiAgU0VMRUNUIHVubmVzdChjbGFzc2VzKSBBUyBjXG4gIEZST00gcGdcbiAgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIGNsYXNzZXMgSVMgTk9UIE5VTExcbilcblNFTEVDVCBjLCBDT1VOVCgqKSBBUyBoaXRzXG5GUk9NIGV4cGFuZGVkXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDMwO1xuXG4tLSA2KSBDb21tZW50cyBqb2luZWQgdG8gdGhlaXIgcGFyZW50IHNlbGVjdG9yIHZpYSBwYXJlbnRVaWQuIFRoZVxuLS0gICAgcy50eXBlIGZpbHRlciBwcmV2ZW50cyBhbiBhY2NpZGVudGFsIGZlZWRiYWNr4oaUZmVlZGJhY2sgam9pbiBpbiBjYXNlXG4tLSAgICB0d28gcm93cyBldmVyIHNoYXJlIGEgdWlkIGJ5IGNvaW5jaWRlbmNlLlxuU0VMRUNUIHMubiwgcy5zZWxlY3RvciwgZi50ZXh0LCBmLnRhZ3NcbkZST00gcGcgZlxuSk9JTiBwZyBzXG4gIE9OIHMudWlkID0gZi5wYXJlbnRVaWRcbiBBTkQgcy50eXBlID0gJ3NlbGVjdG9yJ1xuV0hFUkUgZi50eXBlID0gJ2ZlZWRiYWNrJ1xuT1JERVIgQlkgcy5uO1xuYDtcbiAgY29uc3Qgb25EdWNrRGJTbmlwcGV0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIFByZWZlciB0aGUgSlNPTkwgZmlsZW5hbWUgb2YgdGhlIG1vc3QgcmVjZW50IGV4cG9ydCBzbyB0aGUgdXNlciBjYW5cbiAgICAvLyBwYXN0ZSB0aGlzIGRpcmVjdGx5IHdpdGhvdXQgZWRpdGluZyB0aGUgcmVhZF9qc29uX2F1dG8gcGF0aC4gRmFsbFxuICAgIC8vIGJhY2sgdG8gYSBmcmVzaCBlcG9jaC1iYXNlZCBuYW1lIGlmIG5vdGhpbmcgaGFzIGJlZW4gZXhwb3J0ZWQgeWV0LlxuICAgIGNvbnN0IGxhc3QgPSBsYXN0RXhwb3J0LnJlbFBhdGg7XG4gICAgY29uc3QganNvbmxOYW1lID0gKGxhc3QgJiYgL1xcLmpzb25sJC8udGVzdChsYXN0KSlcbiAgICAgID8gbGFzdC5zcGxpdCgnLycpLnBvcCgpISAgLy8gc3RyaXAgd29ya3NwYWNlL2V4cG9ydHMvIHByZWZpeFxuICAgICAgOiBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3FsKTtcbiAgICAgIHNldFN0YXR1cyhgRHVja0RCIHJlY2lwZXMgY29waWVkIMK3IHBhc3RlIGludG8gXFxgZHVja2RiXFxgIHNoZWxsIMK3IHJlZmVyZW5jZXMgJHtqc29ubE5hbWV9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgRHVja0RCIFNRTCcsIGpzb25sTmFtZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCBmYWlsZWQg4oCUIG9wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCAnT3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnKTtcbiAgICB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTY2hlbWEgbWlncmF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDb252ZXJ0IGEgdjEtc2hhcGVkIEVudHJ5LW9yLWV4cG9ydC1saW5lIGludG8gb3VyIGludGVybmFsIEVudHJ5LiBJZGVtcG90ZW50LlxuICAvLyBTdXBwb3J0czpcbiAgLy8gICDigKIgZmxhdCB2MSBlbnRyeSAobm8gYF9hdWRpdGAsIG5vIGB2YCBmaWVsZClcbiAgLy8gICDigKIgdjIgZXhwb3J0IGVudHJ5IChoYXMgYF9hdWRpdGAsIGB2OiAyYCwgYHR5cGU6ICdzZWxlY3RvcidgKVxuICAvLyAgIOKAoiBtaXhlZCAoc29tZSBmaWVsZHMgbmVzdGVkLCBzb21lIGZsYXQg4oCUIGxhc3Qgd2lucyBmb3Igc2FmZXR5KVxuICAvLyBQdXJlOiBuZXZlciBtdXRhdGVzIGByYXdgIG9yIGFueSBvZiBpdHMgbmVzdGVkIG9iamVjdHMuIFJldHVybnMgYSBuZXdcbiAgLy8gZW50cnkgd2l0aCBhbGwgbWlncmF0aW9ucyBhcHBsaWVkLiBUb3VjaGVkIHN1Ym9iamVjdHMgKGF0dHJzLCBoaW50cyxcbiAgLy8gZ3JvdXAgbWVtYmVycykgYXJlIGNsb25lZCBiZWZvcmUgZWRpdDsgdW50b3VjaGVkIG9uZXMgc2hhcmUgcmVmcyB3aXRoXG4gIC8vIHJhdywgd2hpY2ggaXMgZmluZSBzaW5jZSB3ZSBuZXZlciB3cml0ZSB0byB0aGVtLlxuICBjb25zdCBkZW5vcm1hbGl6ZUVudHJ5ID0gKHJhdzogYW55KTogRW50cnkgPT4ge1xuICAgIGNvbnN0IG91dDogYW55ID0gey4uLnJhd307XG4gICAgZGVsZXRlIG91dC52O1xuICAgIGRlbGV0ZSBvdXQudHlwZTtcbiAgICBkZWxldGUgb3V0LmZlZWRiYWNrO1xuICAgIGlmIChvdXQuX2F1ZGl0ICYmIHR5cGVvZiBvdXQuX2F1ZGl0ID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgYSA9IG91dC5fYXVkaXQ7XG4gICAgICBpZiAoYS5hbmNlc3RvcnMgIT09IHVuZGVmaW5lZCkgb3V0LmFuY2VzdG9ycyA9IGEuYW5jZXN0b3JzO1xuICAgICAgaWYgKGEuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBvdXQuY29tcG9uZW50Um9vdCA9IGEuY29tcG9uZW50Um9vdDtcbiAgICAgIGlmIChhLmluU2hhZG93RE9NICE9PSB1bmRlZmluZWQpIG91dC5pblNoYWRvd0RPTSA9IGEuaW5TaGFkb3dET007XG4gICAgICBpZiAoYS5wc2V1ZG9FbGVtZW50cyAhPT0gdW5kZWZpbmVkKSBvdXQucHNldWRvRWxlbWVudHMgPSBhLnBzZXVkb0VsZW1lbnRzO1xuICAgICAgaWYgKGEubWF0Y2hlZFJ1bGVzICE9PSB1bmRlZmluZWQpIG91dC5tYXRjaGVkUnVsZXMgPSBhLm1hdGNoZWRSdWxlcztcbiAgICAgIGlmIChhLnZpZXdwb3J0ICE9PSB1bmRlZmluZWQpIG91dC52aWV3cG9ydCA9IGEudmlld3BvcnQ7XG4gICAgICBkZWxldGUgb3V0Ll9hdWRpdDtcbiAgICB9XG4gICAgLy8gc3RhdGVzOiB2MSB1c2VkIFJlY29yZDxzdHJpbmcsIHRydWU+OyB2MiB1c2VzIHN0cmluZ1tdLiBOb3JtYWxpemUgYm90aC5cbiAgICBpZiAob3V0LnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShvdXQuc3RhdGVzKSAmJiB0eXBlb2Ygb3V0LnN0YXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG91dC5zdGF0ZXMgPSBPYmplY3Qua2V5cyhvdXQuc3RhdGVzKS5maWx0ZXIoKGspID0+IEJvb2xlYW4oKG91dC5zdGF0ZXMgYXMgYW55KVtrXSkpO1xuICAgIH1cbiAgICAvLyBhdHRycy5mb3JtYXQg4oaSIGhpbnRzLmZvcm1hdC4gQ2xvbmUgYXR0cnMgZmlyc3Qgc28gd2UgZG9uJ3QgbXV0YXRlIHRoZVxuICAgIC8vIGNhbGxlcidzIG5lc3RlZCBvYmplY3QuIFNhbWUgZm9yIGhpbnRzICh3ZSBtYXkgbWVyZ2UgaW50byBpdCkuXG4gICAgaWYgKG91dC5hdHRycyAmJiB0eXBlb2Ygb3V0LmF0dHJzID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3V0LmF0dHJzLmZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGZtdCA9IG91dC5hdHRycy5mb3JtYXQ7XG4gICAgICBjb25zdCB7Zm9ybWF0OiBfZHJvcCwgLi4ucmVzdEF0dHJzfSA9IG91dC5hdHRycztcbiAgICAgIG91dC5hdHRycyA9IHJlc3RBdHRycztcbiAgICAgIG91dC5oaW50cyA9IHsuLi4ob3V0LmhpbnRzID8/IHt9KSwgZm9ybWF0OiBmbXR9O1xuICAgIH1cbiAgICBpZiAoIW91dC51aWQpIG91dC51aWQgPSBtc2dJZCgpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG91dC5ncm91cCkpIG91dC5ncm91cCA9IG91dC5ncm91cC5tYXAoZGVub3JtYWxpemVFbnRyeSk7XG4gICAgcmV0dXJuIG91dCBhcyBFbnRyeTtcbiAgfTtcbiAgLy8gV2FsayBhbGwgbG9hZGVkIG1lc3NhZ2VzIGFuZCBtaWdyYXRlIGFueSBsZWdhY3kgZW50cmllcy4gUmV0dXJucyB0cnVlIGlmXG4gIC8vIGFueXRoaW5nIG11dGF0ZWQgc28gdGhlIGNhbGxlciBjYW4gcGVyc2lzdC5cbiAgY29uc3QgbWlncmF0ZUxvYWRlZE1lc3NhZ2VzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGxldCBtdXRhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IG0uZW50cnk7XG4gICAgICAvLyBDaGVhcCBwcmUtY2hlY2s6IGlmIHVpZCBleGlzdHMgQU5EIHN0YXRlcyBpcyBhbiBhcnJheSBBTkQgbm8gX2F1ZGl0XG4gICAgICAvLyBBTkQgbm8gYXR0cnMuZm9ybWF0IOKGkiBub3RoaW5nIHRvIGRvLCBza2lwIHRoZSB3b3JrLlxuICAgICAgY29uc3QgbmVlZHNXb3JrID1cbiAgICAgICAgIWJlZm9yZS51aWQgfHxcbiAgICAgICAgKGJlZm9yZS5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkoYmVmb3JlLnN0YXRlcykpIHx8XG4gICAgICAgIChiZWZvcmUgYXMgYW55KS5fYXVkaXQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAoYmVmb3JlLmF0dHJzICYmIHR5cGVvZiAoYmVmb3JlLmF0dHJzIGFzIGFueSkuZm9ybWF0ID09PSAnc3RyaW5nJyk7XG4gICAgICBpZiAoIW5lZWRzV29yaykgY29udGludWU7XG4gICAgICBtLmVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShiZWZvcmUpO1xuICAgICAgbXV0YXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtdXRhdGVkO1xuICB9O1xuICBjb25zdCBvbkltcG9ydCA9ICgpOiB2b2lkID0+IGltcG9ydEZpbGUuY2xpY2soKTtcbiAgaW1wb3J0RmlsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM/LlswXTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICBjb25zdCBpbXBvcnRlZDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgdGV4dC5zcGxpdCgvXFxyP1xcbi8pKSB7XG4gICAgICBpZiAoIWxpbmUudHJpbSgpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKGxpbmUpO1xuICAgICAgICBpZiAoby50eXBlID09PSAnbWFuaWZlc3QnKSB7XG4gICAgICAgICAgLy8gTWFuaWZlc3QgbGluZSDigJQgaW5mb3JtYXRpb25hbCBvbmx5IG9uIGltcG9ydC4gU2tpcC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoby50eXBlID09PSAncGFnZScpIGltcG9ydGVkLnB1c2goe3R5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdXJsOiBvLnVybCwgdGl0bGU6IG8udGl0bGUsIHZpZXdwb3J0OiBvLnZpZXdwb3J0LCB0b2tlbnM6IG8udG9rZW5zLCB1c2VyQWdlbnQ6IG8udXNlckFnZW50LCBsYW5nOiBvLmxhbmd9KTtcbiAgICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0OiBvLnRleHQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoby5wYXJlbnRVaWQpIGZiLnBhcmVudFVpZCA9IG8ucGFyZW50VWlkO1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG8udGFncykgJiYgby50YWdzLmxlbmd0aCkgZmIudGFncyA9IG8udGFncztcbiAgICAgICAgICBpZiAoby5zZXZlcml0eSkgZmIuc2V2ZXJpdHkgPSBvLnNldmVyaXR5O1xuICAgICAgICAgIGltcG9ydGVkLnB1c2goZmIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHNlbGVjdG9yIGxpbmUg4oCUIGNvdWxkIGJlIHYxIChmbGF0KSBvciB2MiAod2l0aCBfYXVkaXQpLiBUaGVcbiAgICAgICAgICAvLyBidW5kbGVkIGZlZWRiYWNrIGFycmF5IG11c3QgYmUgc3BsaXQgb3V0IGludG8gc2VwYXJhdGUgZmVlZGJhY2tcbiAgICAgICAgICAvLyBtZXNzYWdlcyBmb3Igcm91bmQtdHJpcCB3aXRoIHYxIHJlYWRlcnMg4oCUIGJ1dCBpbiB2MiB3ZSBhbHJlYWR5XG4gICAgICAgICAgLy8gZW1pdCBzdGFuZGFsb25lIGZlZWRiYWNrIGxpbmVzLCBzbyBkcm9wcGluZyB0aGUgYnVuZGxlZCBsaXN0IGlzXG4gICAgICAgICAgLy8gc2FmZSB0byBhdm9pZCBkb3VibGUtY291bnRpbmcuXG4gICAgICAgICAgY29uc3QgZmIgPSBBcnJheS5pc0FycmF5KG8uZmVlZGJhY2spID8gby5mZWVkYmFjayA6IG51bGw7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSBkZW5vcm1hbGl6ZUVudHJ5KG8pO1xuICAgICAgICAgIGltcG9ydGVkLnB1c2goe3R5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIGVudHJ5fSk7XG4gICAgICAgICAgLy8gT25seSBpbmZsYXRlIGJ1bmRsZWQgZmVlZGJhY2sgaWYgdGhlIGZpbGUgaXMgdjEgKG5vIHZlcnNpb25cbiAgICAgICAgICAvLyBtYXJrZXIgb24gdGhlIHNlbGVjdG9yIGxpbmVzKS4gdjIgaGFzIGl0cyBvd24gc3RhbmRhbG9uZVxuICAgICAgICAgIC8vIGZlZWRiYWNrIGxpbmVzIHRoYXQgYXJyaXZlIHNlcGFyYXRlbHkuXG4gICAgICAgICAgaWYgKGZiICYmIG8udiAhPT0gMikge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0IG9mIGZiKSBpbXBvcnRlZC5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksXG4gICAgICAgICAgICAgIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgdGV4dDogdHlwZW9mIHQgPT09ICdzdHJpbmcnID8gdCA6IHQ/LnRleHQgPz8gJycsXG4gICAgICAgICAgICAgIHBhcmVudFVpZDogZW50cnkudWlkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHsgLyogc2tpcCBiYWQgbGluZSAqLyB9XG4gICAgfVxuICAgIG1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCAuLi5pbXBvcnRlZF07XG4gICAgcGVyc2lzdCgpO1xuICAgIGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoYEltcG9ydGVkICR7aW1wb3J0ZWQubGVuZ3RofSBtZXNzYWdlJHtpbXBvcnRlZC5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gKTtcbiAgICBpbXBvcnRGaWxlLnZhbHVlID0gJyc7XG4gIH0pO1xuICBjb25zdCBvbkNsZWFyID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghY29uZmlybSgnQ2xlYXIgYWxsIGNhcHR1cmVzIGFuZCBjb21tZW50cz8nKSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBbXTtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0NsZWFyZWQnKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgVmFsaWRhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgcnVuVmFsaWRhdGlvbiA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBbLi4ubmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3RvcikpXTtcbiAgICBpZiAoIXNlbGVjdG9ycy5sZW5ndGggfHwgIWluRXh0ZW5zaW9uKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICBpZiAoIXRhYnNbMF0pIHJldHVybjtcbiAgICAgIGxpdmVUYWJVcmwgPSB0YWJzWzBdLnVybCA/PyBsaXZlVGFiVXJsO1xuICAgICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YobGl2ZVRhYlVybCA/PyAnJyk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQhLCBwZyh7a2luZDogJ3ZhbGlkYXRlJywgc2VsZWN0b3JzfSkpIGFzIHt2YWxpZD86IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+fTtcbiAgICAgIGlmIChyZXBseT8udmFsaWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBbc2VsLCBva10gb2YgT2JqZWN0LmVudHJpZXMocmVwbHkudmFsaWQpKSB7XG4gICAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgICAgaWYgKCFvaykgc2VsZWN0b3JFcnJvcnMuc2V0KHNlbCwgJ05vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzIHRoaXMgc2VsZWN0b3IuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIHRhYiBub3QgcmVhZHkgKi8gfVxuICB9O1xuICBjb25zdCBvblZhbGlkYXRlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHNldFN0YXR1cygnUmUtY2hlY2tpbmfigKYnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHNldFN0YXR1cygnVmFsaWRhdGVkJyk7XG4gIH07XG5cbiAgLy8gKFNjcmVlbnNob3QgbWFjaGluZXJ5IHJlbW92ZWQgYWxvbmdzaWRlIHRoZSAucHJldmlldyB0aWxlLilcblxuICAvLyDilIDilIDilIAgR2l0SHViIHN0YXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBmZXRjaFN0YXJzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGNhY2hlS2V5ID0gJ3BpbmNoZ3JhYi5naC5zdGFycyc7XG4gICAgY29uc3QgY2FjaGVkID0gYXdhaXQgU3RvcmUuZ2V0PHtjb3VudDogbnVtYmVyOyB0czogbnVtYmVyfSB8IG51bGw+KGNhY2hlS2V5LCBudWxsKTtcbiAgICBpZiAoY2FjaGVkICYmIERhdGUubm93KCkgLSBjYWNoZWQudHMgPCAzXzYwMF8wMDApIHtcbiAgICAgIHN0YXJzRWwudGV4dENvbnRlbnQgPSBTdHJpbmcoY2FjaGVkLmNvdW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy93cmFubmdsZS9waW5jaGdyYWInLCB7Y2FjaGU6ICduby1zdG9yZSd9KTtcbiAgICAgIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKCdzdGF0dXMgJyArIHIuc3RhdHVzKTtcbiAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKSBhcyB7c3RhcmdhemVyc19jb3VudD86IG51bWJlcn07XG4gICAgICBjb25zdCBjb3VudCA9IGouc3RhcmdhemVyc19jb3VudCA/PyAwO1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudCk7XG4gICAgICB2b2lkIFN0b3JlLnNldChjYWNoZUtleSwge2NvdW50LCB0czogRGF0ZS5ub3coKX0pO1xuICAgIH0gY2F0Y2ggeyBzdGFyc0VsLnRleHRDb250ZW50ID0gJ8K3JzsgfVxuICB9O1xuICBjb25zdCBvbkdpdGh1YiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3dyYW5uZ2xlL3BpbmNoZ3JhYic7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUudGFicy5jcmVhdGUoe3VybH0pO1xuICAgIGVsc2Ugd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJ25vb3BlbmVyJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNldHRpbmdzIGRyYXdlciAvIHdvcmtzcGFjZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFwcGx5UHJlZnNUb1VJID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W2RhdGEtcHJlZl0nKSkge1xuICAgICAgZWwuY2hlY2tlZCA9IEJvb2xlYW4ocHJlZnNbZWwuZGF0YXNldC5wcmVmIGFzIGtleW9mIFByZWZzXSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTFRleHRBcmVhRWxlbWVudD4oJ3RleHRhcmVhW2RhdGEtcHJlZi10ZXh0XScpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyhwcmVmc1tlbC5kYXRhc2V0LnByZWZUZXh0IGFzIGtleW9mIFByZWZzXSA/PyAnJyk7XG4gICAgfVxuICAgIC8vIFBsYWluLXRleHQgaW5wdXRzIChkZXNpZ25QYXRoLCBza2lsbFBhdGgpIGFsc28gdXNlIGRhdGEtcHJlZi10ZXh0LlxuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW2RhdGEtcHJlZi10ZXh0XScpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyhwcmVmc1tlbC5kYXRhc2V0LnByZWZUZXh0IGFzIGtleW9mIFByZWZzXSA/PyAnJyk7XG4gICAgfVxuICAgIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCk7XG4gIH07XG4gIC8vIFJlbmRlciB0aGUgZGVzaWduLW1kIC8gc2tpbGwtbWQgc3RhdHVzIGxhYmVscyBhbmQgdGhlIHRlbXBsYXRlLWJhbm5lclxuICAvLyBzbyB0aGUgdXNlciBzZWVzIGF0IGEgZ2xhbmNlIHdoZXRoZXIgdGhleSdyZSBzaGlwcGluZyBhIGN1c3RvbWl6ZWRcbiAgLy8gZmlsZSB2cy4gZmFsbGluZyBiYWNrIHRvIHRoZSBidW5kbGVkIHRlbXBsYXRlLiBBc3luYyBiZWNhdXNlIHdlXG4gIC8vIG5lZWQgdG8gcmVhZCB0aGUgYnVuZGxlZCBmaWxlJ3Mgc2l6ZSB0byBkaXNwbGF5IFwidGVtcGxhdGUgwrcgTiBsaW5lc1wiXG4gIC8vIGV2ZW4gd2hlbiBwcmVmcyBpcyBlbXB0eS5cbiAgY29uc3QgdXBkYXRlTWRTdGF0dXNlcyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBkZXNpZ25FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kZXNpZ24tbWQtc3RhdHVzXScpO1xuICAgIGNvbnN0IHNraWxsRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc2tpbGwtbWQtc3RhdHVzXScpO1xuICAgIGNvbnN0IGRlc2lnbkJhbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS10ZW1wbGF0ZS1iYW5uZXI9XCJkZXNpZ25cIl0nKTtcbiAgICBjb25zdCBza2lsbEJhbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS10ZW1wbGF0ZS1iYW5uZXI9XCJza2lsbFwiXScpO1xuICAgIGNvbnN0IHRhZyA9IChtZDogc3RyaW5nLCBpc1RwbDogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICBjb25zdCBsaW5lcyA9IG1kLnNwbGl0KCdcXG4nKS5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFttZF0pLnNpemU7XG4gICAgICByZXR1cm4gYCR7aXNUcGwgPyAndGVtcGxhdGUnIDogJ2N1c3RvbSd9IMK3ICR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgIH07XG4gICAgaWYgKGRlc2lnbkVsKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICAgIGRlc2lnbkVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIDogJyhlbXB0eSknO1xuICAgICAgZGVzaWduRWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLWNvbnRlbnQnLCAhaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpO1xuICAgIH1cbiAgICBpZiAoc2tpbGxFbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICAgIHNraWxsRWwudGV4dENvbnRlbnQgPSBjb250ZW50LnRyaW0oKSA/IHRhZyhjb250ZW50LCBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKSA6ICcoZW1wdHkpJztcbiAgICAgIHNraWxsRWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLWNvbnRlbnQnLCAhaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSk7XG4gICAgfVxuICAgIGlmIChkZXNpZ25CYW5uZXIpIGRlc2lnbkJhbm5lci5oaWRkZW4gPSAhaXNVc2luZ1RlbXBsYXRlRGVzaWduKCk7XG4gICAgaWYgKHNraWxsQmFubmVyKSBza2lsbEJhbm5lci5oaWRkZW4gPSAhaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICAvLyBBbHNvIHJlZnJlc2ggdGhlIGNvbXBhY3QgcHJldmlldyB0ZXh0IG9uIHRoZSBlZGl0b3Itcm93IGJ1dHRvbi5cbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ2Rlc2lnbicpO1xuICAgIGF3YWl0IHJlbmRlck1kUHJldmlldygnc2tpbGwnKTtcbiAgfTtcbiAgLy8gQmFjay1jb21wYXQgYWxpYXMg4oCUIGVhcmxpZXIgY29kZSBwYXRocyBjYWxsZWQgdXBkYXRlRGVzaWduTWRTdGF0dXMoKS5cbiAgY29uc3QgdXBkYXRlRGVzaWduTWRTdGF0dXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgdXBkYXRlTWRTdGF0dXNlcygpOyB9O1xuXG4gIC8vIOKUgOKUgOKUgCBDb21wYWN0IHByZXZpZXcgKyBtb2RhbCBlZGl0b3IgZm9yIERFU0lHTi5tZCAvIFNLSUxMLm1kIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBSZXBsYWNlcyB0aGUgZ2lhbnQgaW5saW5lIHRleHRhcmVhcyB3aXRoIHNtYWxsIGRvY3VtZW50IHN1bW1hcmllcy5cbiAgdHlwZSBNZEtpbmQgPSAnZGVzaWduJyB8ICdza2lsbCc7XG4gIGNvbnN0IG1hcmtkb3duT3ZlcnZpZXcgPSAoY29udGVudDogc3RyaW5nLCBraW5kOiBNZEtpbmQsIHVzaW5nVGVtcGxhdGU6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC50cmltKCkgPyBjb250ZW50LnNwbGl0KCdcXG4nKS5sZW5ndGggOiAwO1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IEJsb2IoW2NvbnRlbnRdKS5zaXplO1xuICAgIGNvbnN0IGhlYWRpbmdzID0gY29udGVudFxuICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgLm1hcCgobGluZSkgPT4gL14jezEsM31cXHMrKC4rKSQvLmV4ZWMobGluZS50cmltKCkpPy5bMV0/LnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoKGhlYWRpbmcpOiBoZWFkaW5nIGlzIHN0cmluZyA9PiBCb29sZWFuKGhlYWRpbmcpKVxuICAgICAgLnNsaWNlKDAsIDQpO1xuICAgIGNvbnN0IGxhYmVsID0ga2luZCA9PT0gJ2Rlc2lnbicgPyAnVmlzdWFsIHNvdXJjZScgOiAnVHJpYWdlIGd1aWRlJztcbiAgICBjb25zdCBzb3VyY2UgPSB1c2luZ1RlbXBsYXRlID8gJ1RlbXBsYXRlIGZhbGxiYWNrJyA6ICdDdXN0b20nO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gaGVhZGluZ3MubGVuZ3RoID8gaGVhZGluZ3Muam9pbignIC8gJykgOiAnTm8gc2VjdGlvbiBoZWFkaW5ncyBmb3VuZCc7XG4gICAgcmV0dXJuIGAke2xhYmVsfVxcbiR7c291cmNlfSDCtyAke2xpbmVzLnRvTG9jYWxlU3RyaW5nKCl9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JcXG5TZWN0aW9uczogJHtzZWN0aW9uc31gO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1kUHJldmlldyA9IGFzeW5jIChraW5kOiAnZGVzaWduJyB8ICdza2lsbCcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwcmV2aWV3RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtbWQtcHJldmlldz1cIiR7a2luZH1cIl1gKTtcbiAgICBpZiAoIXByZXZpZXdFbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBraW5kID09PSAnZGVzaWduJyA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGtpbmQgPT09ICdkZXNpZ24nID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHByZXZpZXdFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcoY29udGVudCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk1kTW9kYWwgPSBhc3luYyAoa2luZDogTWRLaW5kKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgICBjb25zdCB0aXRsZUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGl0bGVdJykhO1xuICAgIGNvbnN0IHRhRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRleHRhcmVhXScpITtcbiAgICBjb25zdCBzdGF0c0VsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3RhdHNdJykhO1xuICAgIGNvbnN0IGJhbm5lckVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtYmFubmVyXScpITtcbiAgICBjb25zdCBzdW1tYXJ5RWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdW1tYXJ5XScpITtcbiAgICBjb25zdCBzYXZlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc2F2ZV0nKSE7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1yZXNldF0nKSE7XG4gICAgY29uc3QgdXBsb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdXBsb2FkXScpITtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWRvd25sb2FkXScpITtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWNsb3NlXScpITtcblxuICAgIGNvbnN0IGlzRGVzaWduID0ga2luZCA9PT0gJ2Rlc2lnbic7XG4gICAgY29uc3QgaW5pdGlhbCA9IGlzRGVzaWduID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0gaXNEZXNpZ24gPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGlzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnUGluY2hHcmFiIFNLSUxMLm1kJztcbiAgICB0YUVsLnZhbHVlID0gaW5pdGlhbDtcbiAgICBvdmVybGF5LmRhdGFzZXQua2luZCA9IGtpbmQ7XG5cbiAgICBjb25zdCByZWZyZXNoU3RhdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICBzdGF0c0VsLnRleHRDb250ZW50ID0gYCR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgICAgc3VtbWFyeUVsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyh0ZXh0LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmIV0gPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHQuZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSAodCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIH1cbiAgfSk7XG4gIC8vIFRleHRhcmVhIGlucHV0cyBhbHNvIGZpcmUgYGlucHV0YCBldmVudHMgYXMgdGhlIHVzZXIgdHlwZXMg4oCUIHdlIHdhbnQgdG9cbiAgLy8gc2F2ZSB0aG9zZSBpbmNyZW1lbnRhbGx5IHNvIGEgcGFuZWwgcmVsb2FkIGRvZXNuJ3QgbG9zZSBoYWxmLXR5cGVkXG4gIC8vIGVudHJpZXMuIGBjaGFuZ2VgIG9ubHkgZmlyZXMgb24gYmx1ciBmb3IgdGV4dGFyZWFzLlxuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICBpZiAodD8uZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSB0LnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb3BlbkRyYXdlciA9ICgpOiB2b2lkID0+IHsgZHJhd2VyLmhpZGRlbiA9IGZhbHNlOyByZW5kZXJXc0NvbnRyb2xzKCk7IH07XG4gIGNvbnN0IGNsb3NlRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gdHJ1ZTsgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICBpZiAoIXdzTGlzdCkgcmV0dXJuO1xuICAgIHdzTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIGxpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgbGkuZGF0YXNldC50aXAgPSB3Lm5hbWUgPT09IGFjdGl2ZVdzXG4gICAgICAgID8gYEFjdGl2ZSB3b3Jrc3BhY2U6ICR7dy5uYW1lfWBcbiAgICAgICAgOiBgU3dpdGNoIHRvIHdvcmtzcGFjZSBcIiR7dy5uYW1lfVwiYDtcbiAgICAgIC8vIFdob2xlIHJvdyBpcyB0aGUgc3dpdGNoIHRyaWdnZXIg4oCUIG5vIGRlZGljYXRlZCBjaGVjayBidXR0b24uXG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgIC8vIElnbm9yZSBjbGlja3Mgb24gaW5uZXIgY29udHJvbHMgKHRoZSBkZWxldGUgYnV0dG9uIGJlbG93KS5cbiAgICAgICAgaWYgKChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnYnV0dG9uJykpIHJldHVybjtcbiAgICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIHJldHVybjtcbiAgICAgICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh3Lm5hbWUpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG5hbWUuY2xhc3NOYW1lID0gJ3dzLW5hbWUnO1xuICAgICAgbmFtZS50ZXh0Q29udGVudCA9IHcubmFtZTtcbiAgICAgIGxpLmFwcGVuZChuYW1lKTtcbiAgICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBtZXRhLmNsYXNzTmFtZSA9ICd3cy1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBuZXcgRGF0ZSh3LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgICBsaS5hcHBlbmQobWV0YSk7XG4gICAgICBpZiAod29ya3NwYWNlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBkZWwudHlwZSA9ICdidXR0b24nO1xuICAgICAgICBkZWwuY2xhc3NOYW1lID0gJ2Rhbmdlcic7XG4gICAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyB3b3Jrc3BhY2UgYW5kIGV2ZXJ5dGhpbmcgaW4gaXQnO1xuICAgICAgICBkZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYERlbGV0ZSB3b3Jrc3BhY2UgJHt3Lm5hbWV9YCk7XG4gICAgICAgIGRlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMyk7XG4gICAgICAgIGRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBpZiAoIWNvbmZpcm0oYERlbGV0ZSB3b3Jrc3BhY2UgXCIke3cubmFtZX1cIiBhbmQgYWxsIGl0cyBjYXB0dXJlcz9gKSkgcmV0dXJuO1xuICAgICAgICAgIHdvcmtzcGFjZXMgPSB3b3Jrc3BhY2VzLmZpbHRlcigoeCkgPT4geC5uYW1lICE9PSB3Lm5hbWUpO1xuICAgICAgICAgIHBlcnNpc3RXb3Jrc3BhY2VzKCk7XG4gICAgICAgICAgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoW3dzTXNnS2V5KHcubmFtZSksIHdzU2hvdHNLZXkody5uYW1lKSwgd3NTaG90c0Z1bGxLZXkody5uYW1lKV0pLmNhdGNoKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgICAgICAgIGlmIChhY3RpdmVXcyA9PT0gdy5uYW1lKSBhd2FpdCBsb2FkV29ya3NwYWNlKHdvcmtzcGFjZXNbMF0hLm5hbWUpO1xuICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGkuYXBwZW5kKGRlbCk7XG4gICAgICB9XG4gICAgICB3c0xpc3QuYXBwZW5kKGxpKTtcbiAgICB9XG4gIH07XG4gIHdzU2VsZWN0Py5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UoKGUudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZSk7XG4gICAgcmVuZGVyKCk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBDb21tYW5kIHBhbGV0dGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgQ29tbWFuZCA9IHtpZDogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyBydW46ICgpID0+IHZvaWR9O1xuICBjb25zdCBDT01NQU5EUzogQ29tbWFuZFtdID0gW1xuICAgIHtpZDogJ2NvcHktYWxsJywgbGFiZWw6ICdDb3B5IGFsbCBhcyBKU09OTCcsIHJ1bjogKCkgPT4gdm9pZCBvbkNvcHlBbGwoKX0sXG4gICAge2lkOiAnZXhwb3J0JywgbGFiZWw6ICdEb3dubG9hZCBKU09OTCBmaWxlJywgcnVuOiAoKSA9PiB2b2lkIG9uRXhwb3J0KCl9LFxuICAgIHtpZDogJ2V4cG9ydC16aXAnLCBsYWJlbDogJ0V4cG9ydCB3b3Jrc3BhY2UgYXMgLnRhci56c3QgKEpTT05MICsgc2NyZWVuc2hvdHMgKyBEdWNrREIgKyBSRUFETUUpJywgcnVuOiAoKSA9PiB2b2lkIG9uRXhwb3J0WmlwKCl9LFxuICAgIHtpZDogJ2NvcHktcGF0aCcsIGxhYmVsOiAnQ29weSBwYXRoIG9mIGxhc3QgZXhwb3J0JywgcnVuOiAoKSA9PiB2b2lkIG9uQ29weVBhdGgoKX0sXG4gICAge2lkOiAnZHVja2RiJywgbGFiZWw6ICdHZW5lcmF0ZSBEdWNrREIgcXVlcnkgc25pcHBldCAoU1FMIHJlY2lwZXMpJywgcnVuOiAoKSA9PiB2b2lkIG9uRHVja0RiU25pcHBldCgpfSxcbiAgICB7aWQ6ICdpbXBvcnQnLCBsYWJlbDogJ0ltcG9ydCBKU09OTCBmaWxlJywgcnVuOiBvbkltcG9ydH0sXG4gICAge2lkOiAndmFsaWRhdGUnLCBsYWJlbDogJ1JlLWNoZWNrIHNlbGVjdG9ycycsIHJ1bjogKCkgPT4gdm9pZCBvblZhbGlkYXRlKCl9LFxuICAgIHtpZDogJ2NsZWFyJywgbGFiZWw6ICdDbGVhciBhbGwgY2FwdHVyZXMnLCBydW46IG9uQ2xlYXJ9LFxuICAgIHtpZDogJ3NldHRpbmdzJywgbGFiZWw6ICdPcGVuIHNldHRpbmdzJywgcnVuOiBvcGVuRHJhd2VyfSxcbiAgICB7aWQ6ICdnaXRodWInLCBsYWJlbDogJ09wZW4gR2l0SHViIHJlcG8nLCBydW46IG9uR2l0aHVifSxcbiAgICB7aWQ6ICdtYW51YWwnLCBsYWJlbDogJ01hbnVhbCBjYXB0dXJlIChzdGFydCBjb21wb3NlciB3aXRoIGA+IHNlbGVjdG9yYCknLCBydW46ICgpID0+IHsgY29tcG9zZXIudmFsdWUgPSAnPiAnOyBjb21wb3Nlci5mb2N1cygpOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IH19LFxuICAgIHtpZDogJ3VuZG8nLCBsYWJlbDogJ1VuZG8nLCBydW46IHVuZG99LFxuICAgIHtpZDogJ3JlZG8nLCBsYWJlbDogJ1JlZG8nLCBydW46IHJlZG99LFxuICBdO1xuICBjb25zdCByZW5kZXJQYWxldHRlID0gKHEgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGVMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnN0IHFsID0gcS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uQ09NTUFORFMuZmlsdGVyKChjKSA9PiAhcWwgfHwgYy5sYWJlbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSlcbiAgICAgICAgLm1hcCgoYykgPT4gKHtsYWJlbDogYy5sYWJlbCwgcHJldmlldzogJ2NvbW1hbmQnLCBydW46IGMucnVufSkpLFxuICAgICAgLi4ubWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmICghcWwgfHxcbiAgICAgICAgKG0uZW50cnkuc2VsZWN0b3IgKyAnICcgKyAobS5lbnRyeS50ZXh0ID8/ICcnKSArICcgJyArIChtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gJycpKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSkpXG4gICAgICAgIC5zbGljZSgwLCAzMClcbiAgICAgICAgLm1hcCgobSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgICAgICAgY29uc3QgcHJldmlldyA9IChtLmVudHJ5LnRleHQgPz8gZmJbMF0gPz8gbS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDgwKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGFiZWw6IGAjJHttLmVudHJ5Lm59ICR7bS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3J9YCxcbiAgICAgICAgICAgIHByZXZpZXcsXG4gICAgICAgICAgICBydW46ICgpID0+IHtcbiAgICAgICAgICAgICAgY2xvc2VQYWxldHRlKCk7XG4gICAgICAgICAgICAgIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhtLmlkKTtcbiAgICAgICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgIF07XG4gICAgaXRlbXMuZm9yRWFjaCgoaXQsIGkpID0+IHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IGxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxibC5jbGFzc05hbWUgPSAnbGFiZWwnO1xuICAgICAgbGJsLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LmxhYmVsLCBxKTtcbiAgICAgIGxpLmFwcGVuZChsYmwpO1xuICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHAuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgcC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5wcmV2aWV3ID8/ICcnLCBxKTtcbiAgICAgIGxpLmFwcGVuZChwKTtcbiAgICAgIGNvbnN0IGtiZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGtiZC5jbGFzc05hbWUgPSAna2JkJztcbiAgICAgIGtiZC50ZXh0Q29udGVudCA9ICfihrUnO1xuICAgICAgbGkuYXBwZW5kKGtiZCk7XG4gICAgICBpZiAoaSA9PT0gMCkgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaXQucnVuKCk7IH0pO1xuICAgICAgcGFsZXR0ZUxpc3QuYXBwZW5kKGxpKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb3BlblBhbGV0dGUgPSAocHJlc2V0ID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlLmhpZGRlbiA9IGZhbHNlO1xuICAgIHBhbGV0dGVJbnB1dC52YWx1ZSA9IHByZXNldDtcbiAgICByZW5kZXJQYWxldHRlKHByZXNldCk7XG4gICAgcGFsZXR0ZUlucHV0LmZvY3VzKCk7XG4gICAgcGFsZXR0ZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKHByZXNldC5sZW5ndGgsIHByZXNldC5sZW5ndGgpO1xuICB9O1xuICBjb25zdCBjbG9zZVBhbGV0dGUgPSAoKTogdm9pZCA9PiB7IHBhbGV0dGUuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gcmVuZGVyUGFsZXR0ZShwYWxldHRlSW5wdXQudmFsdWUpKTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gWy4uLnBhbGV0dGVMaXN0LmNoaWxkcmVuXTtcbiAgICBsZXQgYWN0aXZlID0gaXRlbXMuZmluZEluZGV4KChsaSkgPT4gbGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSk7XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1pbihpdGVtcy5sZW5ndGggLSAxLCBhY3RpdmUgKyAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1heCgwLCBhY3RpdmUgLSAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyAoaXRlbXNbYWN0aXZlXSBhcyBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCk/LmNsaWNrKCk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBjbG9zZVBhbGV0dGUoKTtcbiAgfSk7XG4gIHBhbGV0dGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IHBhbGV0dGUpIGNsb3NlUGFsZXR0ZSgpOyB9KTtcblxuICAvLyDilIDilIDilIAgQ3VzdG9tIHRvb2x0aXAg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCB0aXBGb3I6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHNob3dUaXAgPSAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHRleHQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRpcCcpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHRvb2x0aXBFbC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgdG9vbHRpcEVsLmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IHIgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGlwUiA9IHRvb2x0aXBFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgdG9wID0gci5ib3R0b20gKyA0O1xuICAgIGxldCBsZWZ0ID0gci5sZWZ0ICsgci53aWR0aCAvIDIgLSB0aXBSLndpZHRoIC8gMjtcbiAgICBpZiAodG9wICsgdGlwUi5oZWlnaHQgKyA0ID4gd2luZG93LmlubmVySGVpZ2h0KSB0b3AgPSByLnRvcCAtIHRpcFIuaGVpZ2h0IC0gNDtcbiAgICBpZiAobGVmdCA8IDQpIGxlZnQgPSA0O1xuICAgIGlmIChsZWZ0ICsgdGlwUi53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNCkgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gdGlwUi53aWR0aCAtIDQ7XG4gICAgdG9vbHRpcEVsLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7dG9wfXB4O2xlZnQ6JHtsZWZ0fXB4O2A7XG4gICAgdG9vbHRpcEVsLmRhdGFzZXQuc2hvd24gPSAndHJ1ZSc7XG4gIH07XG4gIGNvbnN0IGhpZGVUaXAgPSAoKTogdm9pZCA9PiB7XG4gICAgdG9vbHRpcEVsLmRhdGFzZXQuc2hvd24gPSAnZmFsc2UnO1xuICAgIHRpcEZvciA9IG51bGw7XG4gICAgdG9vbHRpcEVsLmhpZGRlbiA9IHRydWU7XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoIXQgfHwgdCA9PT0gdGlwRm9yKSByZXR1cm47XG4gICAgdGlwRm9yID0gdDtcbiAgICBzaG93VGlwKHQpO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHQgJiYgdCA9PT0gdGlwRm9yICYmICF0LmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZVRpcCgpO1xuICB9KTtcbiAgLy8gVGhlIHBhbmVsIHJlLXJlbmRlcnMgYWdncmVzc2l2ZWx5IChyZW5kZXIoKSByZXNldHMgbGlzdC5pbm5lckhUTUwsIGNvbmZpcm1cbiAgLy8gYnV0dG9ucyByZXBsYWNlV2l0aCwgZGVsZXRlLWNvbmZpcm0gcmV2ZXJ0cyBvbiBhIHRpbWVyKSBhbmQgdGhlIGxpc3RcbiAgLy8gc2Nyb2xscyDigJQgaW4gYWxsIG9mIHRob3NlIHRoZSBhbmNob3JlZCBub2RlIGxlYXZlcyB0aGUgRE9NIG9yIG1vdmVzXG4gIC8vIHdpdGhvdXQgZXZlciBmaXJpbmcgbW91c2VvdXQsIHdoaWNoIHVzZWQgdG8gc3RyYW5kIHRoZSB0b29sdGlwIG9uIHNjcmVlblxuICAvLyAoY292ZXJpbmcgb3RoZXIgZWxlbWVudHMsIG5ldmVyIGRpc21pc3NpbmcpLiBEaXNtaXNzIG9uIGFueSBzdWNoIHNpZ25hbC5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGhpZGVUaXAsIHRydWUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIGhpZGVUaXAsIHRydWUpO1xuICBjb25zdCB0aXBHdWFyZCA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICBpZiAodGlwRm9yICYmICF0aXBGb3IuaXNDb25uZWN0ZWQpIGhpZGVUaXAoKTtcbiAgfSk7XG4gIHRpcEd1YXJkLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge2NoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZX0pO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0IGRyaWxsZG93bnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFwcGVuZEhlYWRpbmcgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g1Jyk7XG4gICAgaC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoaCk7XG4gIH07XG4gIGNvbnN0IGFwcGVuZEJvbGQgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKTtcbiAgICBiLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChiKTtcbiAgfTtcbiAgY29uc3QgYXBwZW5kQ29kZSA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29kZScpO1xuICAgIGNvZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGNvZGUpO1xuICB9O1xuICBjb25zdCBidWlsZERyaWxsZG93biA9IChraW5kOiBzdHJpbmcpOiBEb2N1bWVudEZyYWdtZW50ID0+IHtcbiAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGlmIChraW5kID09PSAnc2VsZWN0b3JzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnU2VsZWN0b3JzIGJ5IHF1YWxpdHknKTtcbiAgICAgIGNvbnN0IGJ1Y2tldHMgPSB7aWQ6IDAsIHRlc3RpZDogMCwgY2xhc3M6IDAsIG50aDogMCwgdGFnOiAwfTtcbiAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAgIGlmIChlLnRlc3RJZCkgYnVja2V0cy50ZXN0aWQrKztcbiAgICAgICAgZWxzZSBpZiAoZS5pZCB8fCAvXiNbXFx3LV0rJC8udGVzdChlLnNlbGVjdG9yKSkgYnVja2V0cy5pZCsrO1xuICAgICAgICBlbHNlIGlmICgoZS5zZWxlY3RvciA/PyAnJykuaW5jbHVkZXMoJzpudGgtb2YtdHlwZScpKSBidWNrZXRzLm50aCsrO1xuICAgICAgICBlbHNlIGlmICgvXFwuLy50ZXN0KGUuc2VsZWN0b3IgPz8gJycpKSBidWNrZXRzLmNsYXNzKys7XG4gICAgICAgIGVsc2UgYnVja2V0cy50YWcrKztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGZvciAoY29uc3QgW3ZhbHVlLCBsYWJlbF0gb2YgW1xuICAgICAgICBbYnVja2V0cy50ZXN0aWQsICcgZGF0YS10ZXN0aWQnXSxcbiAgICAgICAgW2J1Y2tldHMuaWQsICcgc3RhYmxlIGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmNsYXNzLCAnIGNsYXNzLWJhc2VkJ10sXG4gICAgICAgIFtidWNrZXRzLm50aCwgJyBudGgtb2YtdHlwZSddLFxuICAgICAgICBbYnVja2V0cy50YWcsICcgdGFnLW9ubHknXSxcbiAgICAgIF0gYXMgY29uc3QpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgbGkuYXBwZW5kKGxhYmVsKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdzdGFsZScpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1N0YWxlIGNhcHR1cmVzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBzdGFsZSA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKSA9PT0gZmFsc2UpO1xuICAgICAgaWYgKCFzdGFsZS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaS50ZXh0Q29udGVudCA9ICdOb25lIC0gZXZlcnl0aGluZyByZXNvbHZlcy4nO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfSBlbHNlIGZvciAoY29uc3QgbSBvZiBzdGFsZSkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgICAgIGxpLmFwcGVuZCgnICcpO1xuICAgICAgICBhcHBlbmRDb2RlKGxpLCAobS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgNTApKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdjb21tZW50cycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ0NvbW1lbnRzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBmYnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIEZlZWRiYWNrTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpO1xuICAgICAgY29uc3QgdG90YWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgdG90YWwuYXBwZW5kKCdUb3RhbCB3b3JkczogJyk7XG4gICAgICBhcHBlbmRCb2xkKHRvdGFsLCBTdHJpbmcoZmJzLnJlZHVjZSgocywgbSkgPT4gcyArIHdvcmRDb3VudChtLnRleHQpLCAwKSkpO1xuICAgICAgdWwuYXBwZW5kKHRvdGFsKTtcbiAgICAgIGNvbnN0IGF2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBhdmcuYXBwZW5kKCdBdmVyYWdlIGxlbmd0aDogJyk7XG4gICAgICBhcHBlbmRCb2xkKGF2ZywgU3RyaW5nKGZicy5sZW5ndGggPyBNYXRoLnJvdW5kKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyBtLnRleHQubGVuZ3RoLCAwKSAvIGZicy5sZW5ndGgpIDogMCkpO1xuICAgICAgYXZnLmFwcGVuZCgnIGNoYXJzJyk7XG4gICAgICB1bC5hcHBlbmQoYXZnKTtcbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdwYWdlcycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1BhZ2VzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBzZWVuID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2Vlbi5zZXQobS5lbnRyeS51cmwsIChzZWVuLmdldChtLmVudHJ5LnVybCkgPz8gMCkgKyAxKTtcbiAgICAgIGZvciAoY29uc3QgW3VybCwgbl0gb2Ygc2Vlbikge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIFN0cmluZyhuKSk7XG4gICAgICAgIGxpLmFwcGVuZChgIHNlbGVjdG9yJHtuID09PSAxID8gJycgOiAncyd9IMK3IGApO1xuICAgICAgICBhcHBlbmRDb2RlKGxpLCBwYXRoT2YodXJsKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfVxuICAgIHJldHVybiBmcmFnO1xuICB9O1xuICBjb25zdCBzaG93RHJpbGxkb3duID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBraW5kID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zdGF0Jyk7XG4gICAgaWYgKCFraW5kKSByZXR1cm47XG4gICAgZHJpbGxkb3duRWwucmVwbGFjZUNoaWxkcmVuKGJ1aWxkRHJpbGxkb3duKGtpbmQpKTtcbiAgICBkcmlsbGRvd25FbC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGRSID0gZHJpbGxkb3duRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHRvcCA9IHIuYm90dG9tICsgNjtcbiAgICBsZXQgbGVmdCA9IHIubGVmdCArIHIud2lkdGggLyAyIC0gZFIud2lkdGggLyAyO1xuICAgIGlmICh0b3AgKyBkUi5oZWlnaHQgKyA0ID4gd2luZG93LmlubmVySGVpZ2h0KSB0b3AgPSByLnRvcCAtIGRSLmhlaWdodCAtIDY7XG4gICAgaWYgKGxlZnQgPCA2KSBsZWZ0ID0gNjtcbiAgICBpZiAobGVmdCArIGRSLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggLSA2KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSBkUi53aWR0aCAtIDY7XG4gICAgZHJpbGxkb3duRWwuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHt0b3B9cHg7bGVmdDoke2xlZnR9cHg7YDtcbiAgfTtcbiAgY29uc3QgaGlkZURyaWxsZG93biA9ICgpOiB2b2lkID0+IHsgZHJpbGxkb3duRWwuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJy5zdGF0W2RhdGEtc3RhdF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHQpIHNob3dEcmlsbGRvd24odCk7XG4gIH0pO1xuICBzdGF0c0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICBpZiAoIXN0YXRzRWwuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlRHJpbGxkb3duKCk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBFeHBvcnQtYnV0dG9uIGhvdmVyIOKGkiBvdXRsaW5lLW11bHRpIG9uIHBhZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGZvciAoY29uc3QgYnRuIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWV4cG9ydC1ob3Zlcl0nKSkge1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0b3JzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpO1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtbXVsdGknLCBzZWxlY3RvcnN9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yJykpIGVsLmNsYXNzTGlzdC5hZGQoJ2V4cG9ydC1ob3ZlcicpO1xuICAgIH0pO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBDbGljayBkZWxlZ2F0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgdHJpZ2dlciA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtYWN0aW9uXScpO1xuICAgIGlmICghdHJpZ2dlcikgcmV0dXJuO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1hY3Rpb24nKTtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSAnc2VuZCc6IHNlbmRGZWVkYmFjaygpOyByZXR1cm47XG4gICAgICBjYXNlICdjb3B5LWFsbCc6IHZvaWQgb25Db3B5QWxsKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydCc6IHZvaWQgb25FeHBvcnQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZXhwb3J0LXppcCc6IHZvaWQgb25FeHBvcnRaaXAoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1wYXRoJzogdm9pZCBvbkNvcHlQYXRoKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2ltcG9ydCc6IG9uSW1wb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3ZhbGlkYXRlJzogdm9pZCBvblZhbGlkYXRlKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NsZWFyJzogb25DbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdnaXRodWInOiBvbkdpdGh1YigpOyByZXR1cm47XG4gICAgICBjYXNlICdzZXR0aW5ncyc6IG9wZW5EcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY2xvc2UtZHJhd2VyJzogY2xvc2VEcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndW5kbyc6IHVuZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVkbyc6IHJlZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZGVzaWduLWVkaXQnOiB7IHZvaWQgb3Blbk1kTW9kYWwoJ2Rlc2lnbicpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ3NraWxsLWVkaXQnOiAgeyB2b2lkIG9wZW5NZE1vZGFsKCdza2lsbCcpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi10ZW1wbGF0ZS1kb3dubG9hZCc6IHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIFByZWZlciB0aGUgdXNlcidzIGxvY2FsIG92ZXJyaWRlIGlmIHByZXNlbnQgKHNvIGEgZm9yaydzXG4gICAgICAgICAgLy8gXCJEb3dubG9hZCB0ZW1wbGF0ZVwiIHByb2R1Y2VzIHRoZSBzYW1lIGNvbnRlbnQgdGhlIGZvcmsgc2hpcHMpXG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBnZW5lcmljIHRlbXBsYXRlLlxuICAgICAgICAgIGNvbnN0IHRleHQgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbERlc2lnbicpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdkZXNpZ25UZW1wbGF0ZScpKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnREVTSUdOLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdERVNJR04ubWQgdGVtcGxhdGUgZG93bmxvYWRlZCDigJQgZmlsbCBpbiBhbmQgcmUtdXBsb2FkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuZGVzaWduTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbGwtbWQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxTa2lsbCcpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJykpO1xuICAgICAgICAgIGlmICghdGV4dCkgeyBzZXRTdGF0dXMoJ1RlbXBsYXRlIG5vdCBmb3VuZCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgZG93bmxvYWRUZXh0KCdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLCB0ZXh0KTtcbiAgICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQnKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLnNraWxsTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgcmVzZXQg4oCUIGV4cG9ydHMgd2lsbCBidW5kbGUgdGhlIHRlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3dzLWNyZWF0ZSc6IHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICh3c05hbWUudmFsdWUgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG4gICAgICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gbmFtZSkpIHsgc2V0U3RhdHVzKCdBbHJlYWR5IGV4aXN0cycsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZSwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICAgICAgd3NOYW1lLnZhbHVlID0gJyc7XG4gICAgICAgIHZvaWQgbG9hZFdvcmtzcGFjZShuYW1lKS50aGVuKHJlbmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyDilIDilIDilIAgR2xvYmFsIGtleWJvYXJkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQgPSAodGFyZ2V0OiBFdmVudFRhcmdldCB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBlbCA9IHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID8gdGFyZ2V0IDogbnVsbDtcbiAgICByZXR1cm4gQm9vbGVhbihlbD8uY2xvc2VzdCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIFtjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdLCBbY29udGVudGVkaXRhYmxlPVwiXCJdJykpO1xuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGVkaXRhYmxlVGFyZ2V0ID0gaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0KGUudGFyZ2V0KTtcbiAgICBpZiAoZWRpdGFibGVUYXJnZXQgJiYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIFsnYScsICd6JywgJ3knXS5pbmNsdWRlcyhlLmtleS50b0xvd2VyQ2FzZSgpKSkgcmV0dXJuO1xuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2snKSB7IGUucHJldmVudERlZmF1bHQoKTsgcGFsZXR0ZS5oaWRkZW4gPyBvcGVuUGFsZXR0ZSgpIDogY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgdW5kbygpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIChlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneScgfHwgKGUuc2hpZnRLZXkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onKSkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyByZWRvKCk7IHJldHVybjsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGNvbnN0IG1kTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgICBpZiAobWRNb2RhbCAmJiAhbWRNb2RhbC5oaWRkZW4pIHsgY2xvc2VNZE1vZGFsKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFwYWxldHRlLmhpZGRlbikgeyBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIWRyYXdlci5oaWRkZW4pIHsgY2xvc2VEcmF3ZXIoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgeyB2b2lkIHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSk7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdQZW5kaW5nIGdyb3VwIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChzZWFyY2hRdWVyeSkgeyBzZWFyY2gudmFsdWUgPSAnJzsgc2VhcmNoUXVlcnkgPSAnJzsgcmVuZGVyKCk7IH1cbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnQWx0JyB8fCBlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiB0cnVlfSk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgaWYgKCFlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBhbmVsUmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgcGVuZGluZ1BhbmVsTWVzc2FnZXM6IGFueVtdID0gW107XG4gIGNvbnN0IHJlY2VpdmVQYW5lbE1lc3NhZ2UgPSAobTogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYW5lbFJlYWR5KSB7XG4gICAgICBwZW5kaW5nUGFuZWxNZXNzYWdlcy5wdXNoKG0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbkNzTWVzc2FnZShtKTtcbiAgfTtcbiAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgLy8gU2luZ2xlIGNoYW5uZWw6IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS4gVGhlIGJhY2tncm91bmQgdXNlZCB0byByZWxheVxuICAgIC8vIHRocm91Z2ggYSBwb3J0IHRvbywgYnV0IGNvbnRlbnQtc2NyaXB0IGJyb2FkY2FzdHMgYWxyZWFkeSByZWFjaCB0aGVcbiAgICAvLyBzaWRlIHBhbmVsIGRpcmVjdGx5IOKAlCByZWxheWluZyBwcm9kdWNlZCBkdXBsaWNhdGUgZGlzcGF0Y2hlcy5cbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG06IGFueSkgPT4gcmVjZWl2ZVBhbmVsTWVzc2FnZShtKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uQWN0aXZhdGVkPy5hZGRMaXN0ZW5lcigoKSA9PiB2b2lkIHJ1blZhbGlkYXRpb24oKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uVXBkYXRlZD8uYWRkTGlzdGVuZXIoKF9pZCwgaW5mbykgPT4geyBpZiAoaW5mbz8uc3RhdHVzID09PSAnY29tcGxldGUnKSB2b2lkIHJ1blZhbGlkYXRpb24oKTsgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIChlKSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWwpKTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBUZXN0IEFQSSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaW5zdGFsbFRlc3RBcGkgPSAoKTogdm9pZCA9PiB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLl9fcGluY2hncmFiX3BhbmVsID0ge1xuICAgICAgcHVzaE1lc3NhZ2U6IChtOiBQYW5lbE1lc3NhZ2UpID0+IHsgbWVzc2FnZXMucHVzaChtKTsgcGVyc2lzdCgpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uQ2FwdHVyZSwgb25Ib3Zlciwgb25Ib3ZlckVuZCxcbiAgICAgIGdldE1lc3NhZ2VzOiAoKSA9PiBbLi4ubWVzc2FnZXNdLFxuICAgICAgZ2V0UHJlZnM6ICgpID0+ICh7Li4ucHJlZnN9KSxcbiAgICAgIHNldFByZWZzOiAocDogUGFydGlhbDxQcmVmcz4pID0+IHsgcHJlZnMgPSB7Li4ucHJlZnMsIC4uLnB9OyBwZXJzaXN0UHJlZnMoKTsgYXBwbHlQcmVmc1RvVUkoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBidWlsZEpzb25sLFxuICAgICAgYnVpbGRFeHBvcnRGaWxlbmFtZSwgYnVpbGRNYW5pZmVzdCwgZG9taW5hbnRIb3N0U2x1ZywgZGlzdGluY3RIb3N0cyxcbiAgICAgIGR1Y2tEYlNuaXBwZXQsIG9uRXhwb3J0WmlwLCBvbkV4cG9ydCwgb25Db3B5UGF0aCxcbiAgICAgIGRlbm9ybWFsaXplRW50cnksXG4gICAgICBnZXRMYXN0RXhwb3J0OiAoKSA9PiAoey4uLmxhc3RFeHBvcnR9KSxcbiAgICAgIC8vIFRlc3QgaGF0Y2g6IHNlZWQgZXZlcnkgc2VsZWN0b3IgY2FwdHVyZSB3aXRoIHRoZSBzYW1lIGZ1bGwgUE5HIGRhdGFVUkxcbiAgICAgIC8vIHNvIHRoZSBhcmNoaXZlIGV4cG9ydCBoYXMgc29tZXRoaW5nIHRvIGJ1bmRsZS4gUmVhbCBjYXB0dXJlcyBwb3B1bGF0ZVxuICAgICAgLy8gc2hvdHNGdWxsIGZyb20gdGhlIGJnIGBydW5TaG90YCByZXBseTsgdGVzdHMgY2FuJ3QgZWFzaWx5IHJ1biBhXG4gICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiwgc28gdGhpcyBsZXRzIHVzIHByb3ZlIHRoZSBQTkcgYnVuZGxpbmcgcGF0aC5cbiAgICAgIF9fc2VlZFNob3RzRnVsbDogKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzaG90c0Z1bGwuc2V0KG0uZW50cnkuc2VsZWN0b3IsIGRhdGFVcmwpO1xuICAgICAgICB9XG4gICAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICAgIH0sXG4gICAgICBfX2dldFNob3RzRnVsbDogKCkgPT4gc2hvdHNGdWxsLFxuICAgICAgc2V0U2VhcmNoOiAocTogc3RyaW5nKSA9PiB7IHNlYXJjaFF1ZXJ5ID0gcTsgc2VhcmNoLnZhbHVlID0gcTsgcmVuZGVyKCk7IH0sXG4gICAgICBzZXRWYWxpZGl0eTogKHNlbDogc3RyaW5nLCBvazogYm9vbGVhbiB8ICdkaWZmLXBhZ2UnLCByZWFzb24/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChyZWFzb24pIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsIHJlYXNvbik7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyOiAoKSA9PiB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgICAgICBsaXZlVGFiUGF0aCA9IG51bGw7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgICAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgICAgIHNob3RzLmNsZWFyKCk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb3BlblBhbGV0dGUsIGNsb3NlUGFsZXR0ZSwgb3BlbkRyYXdlciwgY2xvc2VEcmF3ZXIsXG4gICAgICBzZW5kRmVlZGJhY2ssIHVuZG8sIHJlZG8sXG4gICAgICBsaXN0V29ya3NwYWNlczogKCkgPT4gWy4uLndvcmtzcGFjZXNdLFxuICAgICAgYWN0aXZlV29ya3NwYWNlOiAoKSA9PiBhY3RpdmVXcyxcbiAgICAgIHNldFN0aWNreVRUTDogKG1zOiBudW1iZXIpID0+IHsgU1RJQ0tZX1RUTF9NUyA9IG1zOyB9LFxuICAgICAgZm9yY2VTdGlja3lFeHBpcmU6ICgpID0+IHsgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTsgcGFuZWxIb3ZlcmVkID0gZmFsc2U7IGFybVN0aWNreUV4cGlyeSgpOyB9LFxuICAgICAgc2V0TGFzdEFjdGl2ZSxcbiAgICAgIGNyZWF0ZVdvcmtzcGFjZTogKG46IHN0cmluZykgPT4geyB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IG4sIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IHJldHVybiBsb2FkV29ya3NwYWNlKG4pLnRoZW4ocmVuZGVyKTsgfSxcbiAgICAgIHN3aXRjaFdvcmtzcGFjZTogKG46IHN0cmluZykgPT4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlciksXG4gICAgfTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQm9vdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGxvYWRBbGwoKTtcbiAgICBwYW5lbFJlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgcGVuZGluZ1BhbmVsTWVzc2FnZXMuc3BsaWNlKDApKSBvbkNzTWVzc2FnZShtKTtcbiAgICByZW5kZXIoKTtcbiAgICBpbnN0YWxsVGVzdEFwaSgpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHZvaWQgZmV0Y2hTdGFycygpO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9uLCB3czogYWN0aXZlV3MsIG1lc3NhZ2VzOiBtZXNzYWdlcy5sZW5ndGh9KTtcbiAgfSkoKTtcbn0pKCk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQWtrQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0Ys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YSxXQUFXO0FBQUEsVUFBRyxlQUFlO0FBQUEsVUFBTyxnQkFBZ0I7QUFBQTtBQUFBLFFBQzVGO0FBQUEsUUFDQSxpQkFBaUIsQ0FBQyxNQUFjO0FBQUEsVUFBRSxXQUFXLEtBQUssRUFBQyxNQUFNLEdBQUcsV0FBVyxJQUFJLEtBQUssRUFBRSxZQUFZLEVBQUMsQ0FBQztBQUFBLFVBQUcsa0JBQWtCO0FBQUEsVUFBRyxPQUFPLGNBQWMsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUFBO0FBQUEsUUFDM0osaUJBQWlCLENBQUMsTUFBYyxjQUFjLENBQUMsRUFBRSxLQUFLLE1BQU07QUFBQSxNQUM5RDtBQUFBO0FBQUEsS0FJSSxZQUFZO0FBQUEsTUFDaEIsTUFBTSxRQUFRO0FBQUEsTUFDZCxhQUFhO0FBQUEsTUFDYixXQUFXLEtBQUsscUJBQXFCLE9BQU8sQ0FBQztBQUFBLFFBQUcsWUFBWSxDQUFDO0FBQUEsTUFDN0QsT0FBTztBQUFBLE1BQ1AsZUFBZTtBQUFBLE1BQ1YsY0FBYztBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ2hCLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLFFBQVEsSUFBSSxLQUFLLFNBQVMsRUFBQyxhQUFhLElBQUksVUFBVSxVQUFVLFNBQVMsT0FBTSxDQUFDO0FBQUEsT0FDL0U7QUFBQSxLQUNGOyIsCiAgImRlYnVnSWQiOiAiNTFGNjE1MDgwNjUyNjdCQjY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
