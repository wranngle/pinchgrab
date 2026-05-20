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

//# debugId=26B3035B798A60B164756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjXFx0eXBlcy50cyIsICJzcmNcXGx1Y2lkZS50cyIsICJzcmNcXHRhci50cyIsICJzcmNcXHRlbXBsYXRlcy5nZW4udHMiLCAic3JjXFxzaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gU3Vic2V0IG9mIGx1Y2lkZS5kZXYgaWNvbnMgaW5saW5lZCBhcyBTVkcgaW5uZXItbWFya3VwLlxuLy8gRWFjaCBlbnRyeSBpcyB0aGUgYm9keSBvZiA8c3ZnIC4uLiA+IC4uLiA8L3N2Zz47IHN2Z1N0cmluZygpIHdyYXBzIGl0LlxuLy8gU2l6ZXMgZGVmYXVsdCB0byAxNjsgb3ZlcnJpZGUgd2l0aCB0aGUgc2l6ZSBhcmd1bWVudC5cbi8vXG4vLyBNSVQg4oCUIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWNpZGUtaWNvbnMvbHVjaWRlXG5cbmNvbnN0IElDT05TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2hldnJvbi1yaWdodCc6ICc8cGF0aCBkPVwibTkgMTggNi02LTYtNlwiLz4nLFxuICAnY2hldnJvbi1kb3duJzogJzxwYXRoIGQ9XCJtNiA5IDYgNiA2LTZcIi8+JyxcbiAgY29weTogJzxyZWN0IHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjhcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk00IDE2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDJcIi8+JyxcbiAgcGVuY2lsOiAnPHBhdGggZD1cIk0yMS4xNzQgNi44MTJhMSAxIDAgMCAwLTMuOTg2LTMuOTg3TDMuODQyIDE2LjE3NGEyIDIgMCAwIDAtLjUuODNsLTEuMzIxIDQuMzUyYS41LjUgMCAwIDAgLjYyMy42MjJsNC4zNTMtMS4zMmEyIDIgMCAwIDAgLjgzLS40OTd6XCIvPjxwYXRoIGQ9XCJtMTUgNSA0IDRcIi8+JyxcbiAgJ3RyYXNoLTInOiAnPHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjZcIi8+PHBhdGggZD1cIk04IDZWNGMwLTEgMS0yIDItMmg0YzEgMCAyIDEgMiAydjJcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiMTBcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjE0XCIgeDI9XCIxNFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPicsXG4gIHBsdXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+PHBhdGggZD1cIk0xMiA1djE0XCIvPicsXG4gIHg6ICc8cGF0aCBkPVwiTTE4IDYgNiAxOFwiLz48cGF0aCBkPVwibTYgNiAxMiAxMlwiLz4nLFxuICBtaW51czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz4nLFxuICBzZWFyY2g6ICc8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjhcIi8+PHBhdGggZD1cIm0yMSAyMS00LjMtNC4zXCIvPicsXG4gIGRvd25sb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCI3IDEwIDEyIDE1IDE3IDEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIxNVwiIHkyPVwiM1wiLz4nLFxuICB1cGxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE3IDggMTIgMyA3IDhcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjNcIiB5Mj1cIjE1XCIvPicsXG4gIGdpdGh1YjogJzxwYXRoIGQ9XCJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNCA1LjQgMCAwIDAgNCA5YzAgMy41IDMgNS41IDYgNS41LS4zOS40OS0uNjggMS4wNS0uODUgMS42NS0uMTcuNi0uMjIgMS4yMy0uMTUgMS44NXY0XCIvPjxwYXRoIGQ9XCJNOSAxOGMtNC41MSAyLTUtMi03LTJcIi8+JyxcbiAgc3RhcjogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIi8+JyxcbiAgJ2NpcmNsZS1kb3QnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIGNyb3NzaGFpcjogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIyMlwiIHgyPVwiMThcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjZcIiB4Mj1cIjJcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiNlwiIHkyPVwiMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMjJcIiB5Mj1cIjE4XCIvPicsXG4gIHRhcmdldDogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI2XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMlwiLz4nLFxuICAncGFuZWwtbGVmdC1jbG9zZSc6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIvPjxwYXRoIGQ9XCJNOSAzdjE4XCIvPjxwYXRoIGQ9XCJtMTYgMTUtMy0zIDMtM1wiLz4nLFxuICAnZXh0ZXJuYWwtbGluayc6ICc8cGF0aCBkPVwiTTE1IDNoNnY2XCIvPjxwYXRoIGQ9XCJNMTAgMTQgMjEgM1wiLz48cGF0aCBkPVwiTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDZcIi8+JyxcbiAgJ21lc3NhZ2Utc3F1YXJlLXBsdXMnOiAnPHBhdGggZD1cIk0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnpcIi8+PGxpbmUgeDE9XCI5XCIgeDI9XCIxNVwiIHkxPVwiMTBcIiB5Mj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI3XCIgeTI9XCIxM1wiLz4nLFxuICAnYWxlcnQtY2lyY2xlJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjhcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyLjAxXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgJ3JlZnJlc2gtY3cnOiAnPHBhdGggZD1cIk0zIDEyYTkgOSAwIDAgMSAxNS02LjdMMjEgOFwiLz48cGF0aCBkPVwiTTIxIDN2NWgtNVwiLz48cGF0aCBkPVwiTTIxIDEyYTkgOSAwIDAgMS0xNSA2LjdMMyAxNlwiLz48cGF0aCBkPVwiTTMgMjF2LTVoNVwiLz4nLFxuICAnZmlsZS10ZXh0JzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTNcIiB5Mj1cIjEzXCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjE3XCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjEwXCIgeDI9XCI4XCIgeTE9XCI5XCIgeTI9XCI5XCIvPicsXG4gICdmaWxlLWNvZGUnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48cGF0aCBkPVwibTEwIDEzLTIgMiAyIDJcIi8+PHBhdGggZD1cIm0xNCAxNyAyLTItMi0yXCIvPicsXG4gIGltYWdlOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiOVwiIHI9XCIyXCIvPjxwYXRoIGQ9XCJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMVwiLz4nLFxuICAvLyBTdHlsaXNlZCBcInBpbmNoXCIg4oCUIHR3byBvcHBvc2luZyBjdXJ2ZXMgbWVldGluZyBhdCBhIGNlbnRlciBkb3QuXG4gIHBpbmNoOiAnPHBhdGggZD1cIk01IDVjMyAyIDUgNCA3IDctMiAzLTQgNS03IDdcIi8+PHBhdGggZD1cIk0xOSA1Yy0zIDItNSA0LTcgNyAyIDMgNCA1IDcgN1wiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEuNVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgJ3N0YXItZmlsbGVkJzogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIHBpbjogJzxwYXRoIGQ9XCJNMTIgMTd2NVwiLz48cGF0aCBkPVwiTTkgMTAuNzZhMiAyIDAgMCAxLTEuMTEgMS43OWwtMS43OC45QTIgMiAwIDAgMCA1IDE1LjI0VjE2YTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtLjc2YTIgMiAwIDAgMC0xLjExLTEuNzlsLTEuNzgtLjlBMiAyIDAgMCAxIDE1IDEwLjc2VjdhMSAxIDAgMCAxIDEtMSAyIDIgMCAwIDAgMC00SDhhMiAyIDAgMCAwIDAgNCAxIDEgMCAwIDEgMSAxelwiLz4nLFxuICB1bmRvOiAnPHBhdGggZD1cIk0zIDd2Nmg2XCIvPjxwYXRoIGQ9XCJNMjEgMTdhOSA5IDAgMCAwLTE1LTYuN0wzIDEzXCIvPicsXG4gIHJlZG86ICc8cGF0aCBkPVwiTTIxIDd2NmgtNlwiLz48cGF0aCBkPVwiTTMgMTdhOSA5IDAgMCAxIDE1LTYuN0wyMSAxM1wiLz4nLFxuICBmb2xkZXI6ICc8cGF0aCBkPVwiTTIwIDIwYTIgMiAwIDAgMCAyLTJWOGEyIDIgMCAwIDAtMi0yaC03LjkzYTIgMiAwIDAgMS0xLjY2LS45bC0uODItMS4yQTIgMiAwIDAgMCA3LjkzIDNINGEyIDIgMCAwIDAtMiAydjEzYTIgMiAwIDAgMCAyIDJaXCIvPicsXG4gIGNoZWNrOiAnPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIvPicsXG4gICdjaXJjbGUtY2hlY2snOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiLz4nLFxuICBncmlwOiAnPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjE5XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxOVwiIHI9XCIxXCIvPicsXG4gIHNldHRpbmdzOiAnPHBhdGggZD1cIk0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIvPicsXG4gIGluZm86ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJNMTIgMTZ2LTRcIi8+PHBhdGggZD1cIk0xMiA4aC4wMVwiLz4nLFxuICAvLyBUcmVlLW9mLXJvd3Mg4oCUIHVzZWQgZm9yIFwiU3BsaXQgZ3JvdXBcIiBhY3Rpb24gKGRlbm90ZXMgb25lIG5vZGUgZmFubmluZ1xuICAvLyBvdXQgaW50byBzaWJsaW5ncykuIEx1Y2lkZSdzIGBsaXN0LXRyZWVgLlxuICAnbGlzdC10cmVlJzogJzxwYXRoIGQ9XCJNMjEgMTJoLThcIi8+PHBhdGggZD1cIk0yMSA2SDhcIi8+PHBhdGggZD1cIk0yMSAxOGgtOFwiLz48cGF0aCBkPVwiTTMgNnY0YzAgMS4xLjkgMiAyIDJoM1wiLz48cGF0aCBkPVwiTTMgMTB2NmMwIDEuMS45IDIgMiAyaDNcIi8+JyxcbiAgLy8gR2VuZXJpYyBzcGxpdCBpY29uIGFzIGEgZmFsbGJhY2sgb3B0aW9uLlxuICBzcGxpdDogJzxwYXRoIGQ9XCJNMTYgM2g1djVcIi8+PHBhdGggZD1cIk04IDNIM3Y1XCIvPjxwYXRoIGQ9XCJtMjEgMy03LjQ2IDcuNDZhMiAyIDAgMCAwIDAgMi44M0wyMSAyMVwiLz48cGF0aCBkPVwiTTMgM2w3LjQ2IDcuNDZhMiAyIDAgMCAxIDAgMi44M0wzIDIxXCIvPicsXG4gIC8vIENhcmRib2FyZC1zdHlsZSBib3ggdXNlZCBmb3IgXCJFeHBvcnQgd29ya3NwYWNlIGFzIFpJUFwiLlxuICBwYWNrYWdlOiAnPHBhdGggZD1cIm03LjUgNC4yNyA5IDUuMTVcIi8+PHBhdGggZD1cIk0yMSA4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNlpcIi8+PHBhdGggZD1cIk0zLjMgNyAxMiAxMmw4LjctNVwiLz48cGF0aCBkPVwiTTEyIDIyVjEyXCIvPicsXG4gIC8vIFR3byBpbnRlcmxvY2tpbmcgbGlua3Mg4oCUIHVzZWQgZm9yIFwiQ29weSBhcyBwYXRoXCIuXG4gIGxpbms6ICc8cGF0aCBkPVwiTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIk0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MVwiLz4nLFxuICAvLyBEYXRhYmFzZS9kdWNrIGljb24gZm9yIHRoZSBEdWNrREIgcGFsZXR0ZSBjb21tYW5kLlxuICBkYXRhYmFzZTogJzxlbGxpcHNlIGN4PVwiMTJcIiBjeT1cIjVcIiByeD1cIjlcIiByeT1cIjNcIi8+PHBhdGggZD1cIk0zIDVWMTlBOSAzIDAgMCAwIDIxIDE5VjVcIi8+PHBhdGggZD1cIk0zIDEyQTkgMyAwIDAgMCAyMSAxMlwiLz4nLFxufTtcblxuY29uc3Qgd3JhcCA9IChib2R5OiBzdHJpbmcsIHNpemU6IG51bWJlcik6IHN0cmluZyA9PlxuICBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj4ke2JvZHl9PC9zdmc+YDtcblxuZXhwb3J0IGNvbnN0IFBHX0lDT05TID0ge1xuICBoYXM6IChuYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IG5hbWUgaW4gSUNPTlMsXG4gIHN2Z1N0cmluZzogKG5hbWU6IHN0cmluZywgc2l6ZSA9IDE2KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBib2R5ID0gSUNPTlNbbmFtZV07XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tsdWNpZGVdIG1pc3NpbmcgaWNvbicsIG5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChib2R5LCBzaXplKTtcbiAgfSxcbiAgbW91bnQ6IChlbDogRWxlbWVudCB8IG51bGwsIG5hbWU6IHN0cmluZywgc2l6ZT86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChlbCkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICB9LFxufTtcblxuLy8gU2lkZS1lZmZlY3QgZm9yIGxlZ2FjeSBzY3JpcHQtdGFnIGluY2x1c2lvbiAoc2lkZXBhbmVsLmh0bWwgc3RpbGwgPHNjcmlwdFxuLy8gc3JjPVwibHVjaWRlLmpzXCI+IOKAlCBwcmUtYnVuZGxlKS4gUmUtZXhwb3NlcyB0aGUgcmVnaXN0cnkgb24gZ2xvYmFsVGhpcy5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5QR19JQ09OUyA9IFBHX0lDT05TO1xufVxuIiwKICAgICIvLyBVU1RBUi1mb3JtYXQgdGFyIGVuY29kZXIuIEVhY2ggZW50cnkgaXMgYSA1MTItYnl0ZSBoZWFkZXIgZm9sbG93ZWQgYnlcbi8vIGNvbnRlbnQgYnl0ZXMgcGFkZGVkIHVwIHRvIHRoZSBuZXh0IDUxMi1ieXRlIGJvdW5kYXJ5LiBUaGUgYXJjaGl2ZSBlbmRzXG4vLyB3aXRoIHR3byB6ZXJvLWZpbGxlZCA1MTItYnl0ZSBibG9ja3MuIH44MCBsaW5lcywgbm8gZGVwZW5kZW5jaWVzLlxuLy9cbi8vIFdlIHBpY2sgdGFyIChyYXRoZXIgdGhhbiB6aXApIGJlY2F1c2UgenN0ZCBpcyB0aGUgd2lyZSBmb3JtYXQgd2Ugd2FudCB0b1xuLy8gcGFpciBpdCB3aXRoIGFuZCB0YXIuenN0IGlzIHRoZSBzdGFuZGFyZCBjb21ibyAoemlwIGlzIGl0cyBvd25cbi8vIGNvbXByZXNzaW9uIGNvbnRhaW5lcikuIEZvciBmaWxlcyB3aXRoIHBhdGhzIGxvbmdlciB0aGFuIDEwMCBjaGFycyB3ZVxuLy8gdGhyb3cgcmF0aGVyIHRoYW4gaW1wbGVtZW50IHRoZSBHTlUvUEFYIGxvbmctbmFtZSBleHRlbnNpb25zIOKAlCB0aGVcbi8vIFBpbmNoR3JhYiBhcmNoaXZlIGxheW91dCB1c2VzIHNob3J0IHBhdGhzIG9ubHkuXG5cbmNvbnN0IGVuYyA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG5jb25zdCB3cml0ZU9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIC8vIHRhciBmaWVsZHMgYXJlIHplcm8tcGFkZGVkIG51bGwtdGVybWluYXRlZCBvY3RhbCBzdHJpbmdzLlxuICBsZXQgcyA9IHZhbHVlLnRvU3RyaW5nKDgpO1xuICBzID0gcy5wYWRTdGFydChsZW5ndGggLSAxLCAnMCcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDE7IGkrKykgYnVmW29mZnNldCArIGldID0gcy5jaGFyQ29kZUF0KGkpO1xuICBidWZbb2Zmc2V0ICsgbGVuZ3RoIC0gMV0gPSAwO1xufTtcblxuY29uc3Qgd3JpdGVBc2NpaSA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBzdHI6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3QgYnl0ZXMgPSBlbmMuZW5jb2RlKHN0cik7XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKGJ5dGVzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV0hO1xufTtcblxuY29uc3QgaGVhZGVyQ2hlY2tzdW0gPSAoaGVhZGVyOiBVaW50OEFycmF5KTogbnVtYmVyID0+IHtcbiAgLy8gVGhlIGNoZWNrc3VtIGZpZWxkICg4IGJ5dGVzIGF0IG9mZnNldCAxNDgpIGlzIHRyZWF0ZWQgYXMgQVNDSUkgc3BhY2VzXG4gIC8vIGR1cmluZyBjb21wdXRhdGlvbiwgdGhlbiB0aGUgYWN0dWFsIGNoZWNrc3VtIGlzIHdyaXR0ZW4gaW50byBpdC5cbiAgbGV0IHN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICBpZiAoaSA+PSAxNDggJiYgaSA8IDE1Nikgc3VtICs9IDB4MjA7XG4gICAgZWxzZSBzdW0gKz0gaGVhZGVyW2ldID8/IDA7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbmV4cG9ydCB0eXBlIFRhckVudHJ5ID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRhdGE6IFVpbnQ4QXJyYXkgfCBzdHJpbmc7XG4gIG10aW1lPzogbnVtYmVyOyAvLyB1bml4IGVwb2NoIHNlY29uZHM7IGRlZmF1bHRzIHRvIG5vd1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVGFyID0gKGVudHJpZXM6IFRhckVudHJ5W10pOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgY29uc3Qgbm93U2VjID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZW50cnkuZGF0YSA9PT0gJ3N0cmluZycgPyBlbmMuZW5jb2RlKGVudHJ5LmRhdGEpIDogZW50cnkuZGF0YTtcbiAgICBjb25zdCBuYW1lID0gZW50cnkubmFtZTtcbiAgICBpZiAobmFtZS5sZW5ndGggPiAxMDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdGFyOiBmaWxlbmFtZSB0b28gbG9uZyAoJHtuYW1lLmxlbmd0aH0gPiAxMDAgY2hhcnMpOiAke25hbWV9YCk7XG4gICAgfVxuICAgIGNvbnN0IGhlYWRlciA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDAsIG5hbWUsIDEwMCk7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwMCwgMG82NDQsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RlXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwOCwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1aWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTE2LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMjQsIGRhdGEubGVuZ3RoLCAxMik7ICAgICAgICAgICAgICAgICAgLy8gc2l6ZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMzYsIGVudHJ5Lm10aW1lID8/IG5vd1NlYywgMTIpOyAgICAgICAgLy8gbXRpbWVcbiAgICBmb3IgKGxldCBpID0gMTQ4OyBpIDwgMTU2OyBpKyspIGhlYWRlcltpXSA9IDB4MjA7ICAgICAgICAgIC8vIGNoZWNrc3VtIHBsYWNlaG9sZGVyXG4gICAgaGVhZGVyWzE1Nl0gPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0eXBlZmxhZyAnMCcgPSByZWd1bGFyIGZpbGVcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjU3LCAndXN0YXInLCA2KTsgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI2MywgJzAwJywgMik7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2ZXJzaW9uXG4gICAgLy8gdW5hbWUvZ25hbWUvZGV2bWFqb3IvZGV2bWlub3IvcHJlZml4IGFsbCBsZWZ0IHplcm8uXG5cbiAgICBjb25zdCBjaGVja3N1bSA9IGhlYWRlckNoZWNrc3VtKGhlYWRlcik7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDE0OCwgY2hlY2tzdW0sIDgpO1xuXG4gICAgYmxvY2tzLnB1c2goaGVhZGVyKTtcbiAgICBibG9ja3MucHVzaChkYXRhKTtcbiAgICBjb25zdCBwYWQgPSAoNTEyIC0gKGRhdGEubGVuZ3RoICUgNTEyKSkgJSA1MTI7XG4gICAgaWYgKHBhZCkgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkocGFkKSk7XG4gIH1cbiAgLy8gVHJhaWxlcjogdHdvIGNvbnNlY3V0aXZlIDUxMi1ieXRlIHplcm8gYmxvY2tzLlxuICBibG9ja3MucHVzaChuZXcgVWludDhBcnJheSgxMDI0KSk7XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmZzZXQpOyBvZmZzZXQgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBac3RkIHJhdy1ibG9jayBmcmFtZSB3cml0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gQ29tcHJlc3Npb25TdHJlYW0oJ3pzdGQnKSBpc24ndCBzaGlwcGVkIGluIGN1cnJlbnQgQ2hyb21pdW0gKHZlcmlmaWVkIHZpYVxuLy8gcnVudGltZSBwcm9iZSksIHNvIHdlIHdyaXRlIGEgdmFsaWQgenN0ZCBmcmFtZSBjb250YWluaW5nIG9uZSBvciBtb3JlXG4vLyByYXcgKHVuY29tcHJlc3NlZCkgYmxvY2tzLiBUaGUgb3V0cHV0IGlzIHN0cnVjdHVyYWxseSBhIHJlYWwgYC50YXIuenN0YFxuLy8gZmlsZTogYHpzdGQgLWRgIGFjY2VwdHMgaXQsIDctWmlwIGFjY2VwdHMgaXQsIGxpYnpzdGQgYWNjZXB0cyBpdC4gSXRcbi8vIGp1c3QgZG9lc24ndCBhY3R1YWxseSBjb21wcmVzcyDigJQgZm9yIG91ciBwYXlsb2FkLCB3aGljaCBpcyBtb3N0bHkgUE5HXG4vLyAoYWxyZWFkeSBjb21wcmVzc2VkKSBwbHVzIGEgZmV3IEtCIG9mIEpTT05ML01hcmtkb3duLCB0aGUgbG9zcyB2cy4gcmVhbFxuLy8gREVGTEFURSBpcyBzaW5nbGUtZGlnaXQgcGVyY2VudC5cbi8vXG4vLyBGcmFtZSBsYXlvdXQgKHBlciBSRkMgODg3OCArIFpzdGFuZGFyZCBmb3JtYXQgc3BlYyk6XG4vLyAgIG1hZ2ljX251bWJlciAgICAgICA0IGJ5dGVzICAweDI4IDB4QjUgMHgyRiAweEZEIChMRTogMHhGRDJGQjUyOClcbi8vICAgRkhEICAgICAgICAgICAgICAgIDEgYnl0ZSAgIEZDU19zaXplPTIgKDQtYnl0ZSBGQ1MpLCBTaW5nbGVfU2VnbWVudD0xXG4vLyAgIEZDUyAgICAgICAgICAgICAgICA0IGJ5dGVzICB1bmNvbXByZXNzZWQgcGF5bG9hZCBzaXplICh1MzIgTEUpXG4vLyAgIGJsb2NrcyAgICAgICAgICAgICBOIGJsb2NrcyBlYWNoOiAzLWJ5dGUgaGVhZGVyICsgcGF5bG9hZFxuLy9cbi8vIEJsb2NrIGhlYWRlciAoMyBieXRlcyBMRSk6XG4vLyAgIGJpdCAwICAgICAgIExhc3RfQmxvY2sgZmxhZ1xuLy8gICBiaXRzIDEuLjIgICBCbG9ja19UeXBlICgwMCA9IFJhdywgMDEgPSBSTEUsIDEwID0gQ29tcHJlc3NlZCwgMTEgPSBSZXNlcnZlZClcbi8vICAgYml0cyAzLi4yMyAgQmxvY2tfU2l6ZSAobWF4IDEyOCBLaUIgZm9yIHJhdyAvIFJMRSlcbi8vXG4vLyBXZSBjaHVuayBpbnRvIDEyOCBLaUIgcmF3IGJsb2NrcyB0byByZXNwZWN0IHRoZSBwZXItYmxvY2sgc2l6ZSBsaW1pdC5cblxuY29uc3QgWlNURF9SQVdfQkxPQ0tfTUFYID0gMTI4ICogMTAyNDtcblxuZXhwb3J0IGNvbnN0IHdyYXBac3RkID0gKGRhdGE6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgPCBkYXRhLmxlbmd0aCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGRhdGEubGVuZ3RoIC0gcG9zO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IE1hdGgubWluKHJlbWFpbmluZywgWlNURF9SQVdfQkxPQ0tfTUFYKTtcbiAgICBjb25zdCBpc0xhc3QgPSBwb3MgKyBibG9ja1NpemUgPj0gZGF0YS5sZW5ndGggPyAxIDogMDtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBpc0xhc3QgfCAoMCA8PCAxKSB8IChibG9ja1NpemUgPDwgMyk7IC8vIHR5cGU9cmF3PTBcbiAgICBjb25zdCBibG9ja0hlYWRlciA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIGhlYWRlckludCAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiA4KSAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiAxNikgJiAweGZmLFxuICAgIF0pO1xuICAgIGJsb2Nrcy5wdXNoKGJsb2NrSGVhZGVyKTtcbiAgICBpZiAoYmxvY2tTaXplID4gMCkgYmxvY2tzLnB1c2goZGF0YS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSkpO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSBicmVhaztcbiAgfVxuICBjb25zdCBmY3MgPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgZmhkID0gMGIxMDEwXzAwMDA7IC8vIEZDU19zaXplPTEwICg0IGJ5dGVzKSB8IFNpbmdsZV9TZWdtZW50PTFcbiAgY29uc3QgaGVhZCA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAweDI4LCAweGI1LCAweDJmLCAweGZkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgZmhkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGSERcbiAgICBmY3MgJiAweGZmLCAoZmNzID4+PiA4KSAmIDB4ZmYsIChmY3MgPj4+IDE2KSAmIDB4ZmYsIChmY3MgPj4+IDI0KSAmIDB4ZmYsXG4gIF0pO1xuICBsZXQgdG90YWwgPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZiA9IDA7XG4gIG91dC5zZXQoaGVhZCwgb2ZmKTsgb2ZmICs9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2ZmKTsgb2ZmICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb21wYW5pb24gZGVjb2RlciBmb3Igb3VyIG93biB3cml0ZXIg4oCUIHVzZWQgYnkgdGVzdHMuIEFjY2VwdHMgYW55IHpzdGRcbi8vIGZyYW1lIHdyaXR0ZW4gYnkgYHdyYXBac3RkYCAoc2luZ2xlIFJhd19CbG9jayBzdHJlYW0sIDQtYnl0ZSBGQ1MsXG4vLyBzaW5nbGUtc2VnbWVudCwgbm8gY2hlY2tzdW0sIG5vIGRpY3QpLiBUaHJvd3Mgb24gYW55dGhpbmcgZWxzZSBzbyB0ZXN0c1xuLy8gZmFpbCBsb3VkbHkgcmF0aGVyIHRoYW4gc2lsZW50bHkgbWlzLXBhcnNlLlxuZXhwb3J0IGNvbnN0IHVud3JhcFpzdGQgPSAoZnJhbWU6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgaWYgKGZyYW1lLmxlbmd0aCA8IDkpIHRocm93IG5ldyBFcnJvcignenN0ZDogZnJhbWUgdG9vIHNob3J0Jyk7XG4gIGlmIChmcmFtZVswXSAhPT0gMHgyOCB8fCBmcmFtZVsxXSAhPT0gMHhiNSB8fCBmcmFtZVsyXSAhPT0gMHgyZiB8fCBmcmFtZVszXSAhPT0gMHhmZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignenN0ZDogYmFkIG1hZ2ljIG51bWJlcicpO1xuICB9XG4gIGNvbnN0IGZoZCA9IGZyYW1lWzRdITtcbiAgY29uc3QgZmNzU2l6ZUZsYWcgPSAoZmhkID4+PiA2KSAmIDBiMTE7XG4gIGNvbnN0IHNpbmdsZVNlZ21lbnQgPSAoKGZoZCA+Pj4gNSkgJiAxKSA9PT0gMTtcbiAgY29uc3QgY2hlY2tzdW0gPSAoKGZoZCA+Pj4gMikgJiAxKSA9PT0gMTtcbiAgY29uc3QgZGljdElkID0gZmhkICYgMGIxMTtcbiAgaWYgKCFzaW5nbGVTZWdtZW50KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IG9ubHkgU2luZ2xlX1NlZ21lbnQgZnJhbWVzIHN1cHBvcnRlZCcpO1xuICBpZiAoY2hlY2tzdW0pIHRocm93IG5ldyBFcnJvcignenN0ZDogY29udGVudCBjaGVja3N1bSBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmIChkaWN0SWQpIHRocm93IG5ldyBFcnJvcignenN0ZDogZGljdGlvbmFyaWVzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgbGV0IHBvcyA9IDU7XG4gIGxldCBmY3MgPSAwO1xuICBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDApIHsgZmNzID0gZnJhbWVbcG9zXSE7IHBvcyArPSAxOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjAxKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KTsgZmNzICs9IDI1NjsgcG9zICs9IDI7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMTApIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNikgfCAoZnJhbWVbcG9zICsgM10hICogMHgxMDAwMDAwKTsgcG9zICs9IDQ7IH1cbiAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IDgtYnl0ZSBGQ1MgdW5zdXBwb3J0ZWQnKTtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoZmNzKTtcbiAgbGV0IG91dFBvcyA9IDA7XG4gIGZvciAoOzspIHtcbiAgICBpZiAocG9zICsgMyA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgaGVhZGVyJyk7XG4gICAgY29uc3QgaGVhZGVySW50ID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNik7XG4gICAgcG9zICs9IDM7XG4gICAgY29uc3QgaXNMYXN0ID0gKGhlYWRlckludCAmIDEpID09PSAxO1xuICAgIGNvbnN0IGJsb2NrVHlwZSA9IChoZWFkZXJJbnQgPj4+IDEpICYgMGIxMTtcbiAgICBjb25zdCBibG9ja1NpemUgPSAoaGVhZGVySW50ID4+PiAzKSAmIDB4MWZfZmZfZmY7XG4gICAgaWYgKGJsb2NrVHlwZSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBvbmx5IFJhd19CbG9jayAoMCkgc3VwcG9ydGVkLCBnb3QgJHtibG9ja1R5cGV9YCk7XG4gICAgaWYgKHBvcyArIGJsb2NrU2l6ZSA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgcGF5bG9hZCcpO1xuICAgIG91dC5zZXQoZnJhbWUuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpLCBvdXRQb3MpO1xuICAgIG91dFBvcyArPSBibG9ja1NpemU7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoaXNMYXN0KSBicmVhaztcbiAgfVxuICBpZiAob3V0UG9zICE9PSBmY3MpIHRocm93IG5ldyBFcnJvcihgenN0ZDogRkNTIG1pc21hdGNoIChnb3QgJHtvdXRQb3N9LCBleHBlY3RlZCAke2Zjc30pYCk7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgVGFyIGxpc3RpbmcgZGVjb2RlciAodGVzdC1vbmx5KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdhbGtzIGEgdGFyIGJ5dGUgYnVmZmVyLCByZXR1cm5pbmcge25hbWUsIGRhdGF9IGZvciBlYWNoIGVudHJ5LiBTdG9wcyBhdFxuLy8gdGhlIHRyYWlsZXIgKHR3byB6ZXJvIGJsb2NrcykuIE9ubHkgcmVhZHMgdGhlIGZpZWxkcyBQaW5jaEdyYWIgd3JpdGVzLlxuXG5leHBvcnQgdHlwZSBQYXJzZWRUYXJFbnRyeSA9IHtuYW1lOiBzdHJpbmc7IGRhdGE6IFVpbnQ4QXJyYXk7IHNpemU6IG51bWJlcn07XG5cbmNvbnN0IGRlYyA9IG5ldyBUZXh0RGVjb2RlcigpO1xuXG5jb25zdCByZWFkTnVsbFN0ciA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGxldCBlbmQgPSBvZmZzZXQgKyBsZW5ndGg7XG4gIGZvciAobGV0IGkgPSBvZmZzZXQ7IGkgPCBvZmZzZXQgKyBsZW5ndGg7IGkrKykge1xuICAgIGlmIChidWZbaV0gPT09IDApIHsgZW5kID0gaTsgYnJlYWs7IH1cbiAgfVxuICByZXR1cm4gZGVjLmRlY29kZShidWYuc3ViYXJyYXkob2Zmc2V0LCBlbmQpKTtcbn07XG5cbmNvbnN0IHJlYWRPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gIGNvbnN0IHMgPSByZWFkTnVsbFN0cihidWYsIG9mZnNldCwgbGVuZ3RoKS50cmltKCk7XG4gIHJldHVybiBzID8gcGFyc2VJbnQocywgOCkgOiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGFyID0gKGJ1ZjogVWludDhBcnJheSk6IFBhcnNlZFRhckVudHJ5W10gPT4ge1xuICBjb25zdCBlbnRyaWVzOiBQYXJzZWRUYXJFbnRyeVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zICsgNTEyIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyA1MTIpO1xuICAgIGxldCBhbGxaZXJvID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7IGlmIChoZWFkZXJbaV0gIT09IDApIHsgYWxsWmVybyA9IGZhbHNlOyBicmVhazsgfSB9XG4gICAgaWYgKGFsbFplcm8pIGJyZWFrOyAvLyB0cmFpbGVyXG4gICAgY29uc3QgbmFtZSA9IHJlYWROdWxsU3RyKGhlYWRlciwgMCwgMTAwKTtcbiAgICBjb25zdCBzaXplID0gcmVhZE9jdGFsKGhlYWRlciwgMTI0LCAxMik7XG4gICAgcG9zICs9IDUxMjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZSwgc2l6ZSwgZGF0YTogYnVmLnN1YmFycmF5KHBvcywgcG9zICsgc2l6ZSl9KTtcbiAgICAgIHBvcyArPSBzaXplO1xuICAgICAgY29uc3QgcGFkID0gKDUxMiAtIChzaXplICUgNTEyKSkgJSA1MTI7XG4gICAgICBwb3MgKz0gcGFkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZW50cmllcztcbn07XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIFRlbGxzIHRoZSBzaWRlcGFuZWwgd2hpY2ggdGVtcGxhdGUgcmVzb3VyY2VzIGV4aXN0IGluIHRoaXMgYnVpbGQuXG4vLyBBY3R1YWwgY29udGVudCBsaXZlcyBhcyAubWQgZmlsZXMgdW5kZXIgZXh0ZW5zaW9uL3RlbXBsYXRlcy8sIGxvYWRlZFxuLy8gbGF6aWx5IHZpYSBjaHJvbWUucnVudGltZS5nZXRVUkwg4oCUIHNlZSBsb2FkVGVtcGxhdGUoKSBpbiBzaWRlcGFuZWwudHMuXG5leHBvcnQgY29uc3QgVEVNUExBVEVTX1BSRVNFTlQgPSB7XCJkZXNpZ25UZW1wbGF0ZVwiOnRydWUsXCJza2lsbFRlbXBsYXRlXCI6dHJ1ZSxcImxvY2FsRGVzaWduXCI6dHJ1ZSxcImxvY2FsU2tpbGxcIjp0cnVlfSBhcyBjb25zdDtcbiIsCiAgICAiLy8gUGluY2hHcmFiIHNpZGUtcGFuZWwgVUkuIFJlY2VpdmVzIGNhcHR1cmVzICsgaG92ZXJzIGZyb20gdGhlIGNvbnRlbnRcbi8vIHNjcmlwdDsgcmVuZGVycyB0aGUgY2hhdC1idWJibGUgdGltZWxpbmUsIGV4cG9ydHMsIHZhbGlkYXRlcywgZXRjLlxuLy9cbi8vIERlY29tcG9zZWQgaW50byBzbWFsbCBmaWxlcyBmb3IgY2xhcml0eTpcbi8vICAg4oCiIHR5cGVzLnRzICAgICAg4oCUIHNoYXJlZCB0eXBlcywgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgbHVjaWRlLnRzICAgICDigJQgaWNvbiByZWdpc3RyeVxuLy8gICDigKIgdGhpcyBmaWxlICAgICDigJQgd2lyZS11cCAvIHJlbmRlcmluZyAvIGV4cG9ydCBidWlsZGVyc1xuLy9cbi8vIExvYWRlZCBhcyB0aGUgc2lkZSBwYW5lbCBwYWdlOiBjaHJvbWUuc2lkZVBhbmVsIGRlZmF1bHRfcGF0aC5cblxuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCwgQ3NUb1BhbmVsLCBFbnRyeSwgRXhwb3J0RGlhZ25vc3RpYywgRXhwb3J0TWFuaWZlc3QsIEZlZWRiYWNrTWVzc2FnZSwgUGFnZU1lc3NhZ2UsXG4gIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5cbigoKSA9PiB7XG4gIGNvbnN0IExPRyA9ICdbUGluY2hHcmFiL3NwXSc7XG4gIGNvbnN0IFBSRUZTX1NUT1JBR0VfTkFNRSA9ICdwaW5jaGdyYWIucHJlZnMudjInO1xuICBjb25zdCBXT1JLU1BBQ0VTX0tFWSA9ICdwaW5jaGdyYWIud29ya3NwYWNlcy52MSc7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuXG4gIC8vIOKUgOKUgOKUgCBUZW1wbGF0ZSByZXNvdXJjZSBsb2FkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEVhcmxpZXIgdGhlIHRlbXBsYXRlcyB3ZXJlIGJha2VkIGFzIHN0cmluZyBjb25zdGFudHMgaW50byB0aGlzIElJRkVcbiAgLy8gKH4zNjBLQiBhY3Jvc3MgREVTSUdOICsgU0tJTEwpLiBUaGF0IGJsb2F0ZWQgdGhlIHNpZGVwYW5lbCBidW5kbGUgdG9cbiAgLy8gfjEuOTVNQiBhbmQgc2xvd2VkIGZpcnN0LW9wZW4gcGFyc2UgdGltZSBub3RpY2VhYmx5LiBUaGV5IG5vdyBzaGlwIGFzXG4gIC8vIHNlcGFyYXRlIGAubWRgIGZpbGVzIHVuZGVyIGBleHRlbnNpb24vdGVtcGxhdGVzL2AgYW5kIGxvYWQgb24gZGVtYW5kXG4gIC8vIHZpYSBmZXRjaCDigJQgd2hlbiB0aGUgdXNlciBvcGVucyB0aGUgZWRpdG9yIG1vZGFsLCBvciB3aGVuIHRoZSBleHBvcnRcbiAgLy8gcGlwZWxpbmUgbmVlZHMgdG8gYnVuZGxlIGEgZmFsbGJhY2suXG4gIC8vXG4gIC8vIENhY2hlIHJlc3VsdHMgaW4tcHJvY2VzcyBzbyByZXBlYXQgcmVhZHMgKG1vZGFsIG9wZW4g4oaSIGNsb3NlIOKGkiByZW9wZW4sXG4gIC8vIG9yIHNlcXVlbnRpYWwgZXhwb3J0cykgZG9uJ3QgcmUtZmV0Y2guXG4gIGNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBURU1QTEFURV9GSUxFUyA9IHtcbiAgICBkZXNpZ25UZW1wbGF0ZTogJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsXG4gICAgc2tpbGxUZW1wbGF0ZTogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsXG4gICAgbG9jYWxEZXNpZ246ICdsb2NhbC5ERVNJR04ubWQnLFxuICAgIGxvY2FsU2tpbGw6ICdsb2NhbC5TS0lMTC5tZCcsXG4gIH0gYXMgY29uc3Q7XG4gIHR5cGUgVGVtcGxhdGVLZXkgPSBrZXlvZiB0eXBlb2YgVEVNUExBVEVfRklMRVM7XG4gIGNvbnN0IHRlbXBsYXRlVXJsID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gSW5zaWRlIHRoZSBleHRlbnNpb24sIHRoZSBzaWRlcGFuZWwgcnVucyBmcm9tXG4gICAgLy8gY2hyb21lLWV4dGVuc2lvbjovLzxpZD4vc2lkZXBhbmVsLmh0bWwsIHNvIHJlc291cmNlcyByZXNvbHZlIHZpYVxuICAgIC8vIGNocm9tZS5ydW50aW1lLmdldFVSTC4gVGhlIFBsYXl3cmlnaHQgc3RhdGljLXNlcnZlciB0ZXN0cyBzZXJ2ZVxuICAgIC8vIGAvdGVtcGxhdGVzLzxmaWxlPmAgZnJvbSB0aGUgZXh0ZW5zaW9uIHJvb3QgZGlyZWN0bHksIHNvIGFcbiAgICAvLyByZWxhdGl2ZSBVUkwgd29ya3MgdGhlcmUgYXMgYSBmYWxsYmFjay5cbiAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCkge1xuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChgdGVtcGxhdGVzLyR7ZmlsZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZXMvJHtmaWxlfWA7XG4gIH07XG4gIGNvbnN0IGxvYWRUZW1wbGF0ZSA9IGFzeW5jIChrZXk6IFRlbXBsYXRlS2V5KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAoIVRFTVBMQVRFU19QUkVTRU5UW2tleV0pIHJldHVybiAnJztcbiAgICBjb25zdCBmaWxlID0gVEVNUExBVEVfRklMRVNba2V5XTtcbiAgICBjb25zdCBjYWNoZWQgPSB0ZW1wbGF0ZUNhY2hlLmdldChmaWxlKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRlbXBsYXRlVXJsKGZpbGUpKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgdGVtcGxhdGUgZmV0Y2ggZmFpbGVkOiAke2ZpbGV9YCwgZXJyKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG4gIC8vIEVmZmVjdGl2ZSBjb250ZW50IHVzZWQgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSBhbmQgdGhlIG1vZGFsLiBXaGVuIHRoZVxuICAvLyB1c2VyIGhhcyBjdXN0b21pemVkIHZpYSB0aGUgdGV4dGFyZWEvdXBsb2FkLCB0aGF0IHdpbnM7IG90aGVyd2lzZSB3ZVxuICAvLyBmYWxsIGJhY2sgdG8gbG9jYWwuKiAodGhlIGRldmVsb3BlcidzIHByZS1iYWtlZCBvdmVycmlkZSkgdGhlbiB0b1xuICAvLyB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgY29uc3QgcmVzb2x2ZURlc2lnbkNvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuZGVzaWduTWQgJiYgcHJlZnMuZGVzaWduTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuZGVzaWduTWQ7XG4gICAgcmV0dXJuIChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsRGVzaWduJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJykpO1xuICB9O1xuICBjb25zdCByZXNvbHZlU2tpbGxDb250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLnNraWxsTWQgJiYgcHJlZnMuc2tpbGxNZC50cmltKCkpIHJldHVybiBwcmVmcy5za2lsbE1kO1xuICAgIHJldHVybiAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbFNraWxsJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKSk7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDihpIgcHJlZnMue2Rlc2lnbk1kfHNraWxsTWR9IGlzXG4gIC8vIGVtcHR5IGFuZCB3ZSdyZSBmYWxsaW5nIGJhY2sgdG8gYSBidW5kbGVkIHRlbXBsYXRlL2xvY2FsIHJlc291cmNlLlxuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24gPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuZGVzaWduTWQgfHwgIXByZWZzLmRlc2lnbk1kLnRyaW0oKTtcbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlU2tpbGwgPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuc2tpbGxNZCB8fCAhcHJlZnMuc2tpbGxNZC50cmltKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0b3JhZ2UgYWRhcHRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgU3RvcmUgPSB7XG4gICAgYXN5bmMgZ2V0PFQ+KGtleTogc3RyaW5nLCBmYWxsYmFjazogVCk6IFByb21pc2U8VD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7IHJldHVybiAob1trZXldIGFzIFQpID8/IGZhbGxiYWNrOyB9XG4gICAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBjb25zdCByID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTsgcmV0dXJuIHIgPT09IG51bGwgPyBmYWxsYmFjayA6IChKU09OLnBhcnNlKHIpIGFzIFQpOyB9XG4gICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgIH0sXG4gICAgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1trZXldOiB2YWx1ZX0pOyByZXR1cm47IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgfVxuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LFxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBET00gcmVmcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgJCA9IDxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50PihzOiBzdHJpbmcpOiBUID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocykgYXMgVDtcbiAgY29uc3QgbGlzdCA9ICQoJ1tkYXRhLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBvc2VyID0gJDxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtY29tcG9zZXJdJyk7XG4gIGNvbnN0IHN0YXR1cyA9ICQoJ1tkYXRhLXN0YXR1c10nKTtcbiAgY29uc3Qgc2VhcmNoID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtc2VhcmNoXScpO1xuICAvLyBVcGRhdGUgdGhlIG92ZXJsYWlkIGtiZCBwaWxsIHRvIHVzZSB0aGUgcmlnaHQgbW9kaWZpZXIgcGVyIHBsYXRmb3JtLlxuICBjb25zdCBpc01hYyA9IC9NYWN8aVBob25lfGlQYWQvaS50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSB8fCBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnKTtcbiAgaWYgKCFpc01hYykge1xuICAgIGNvbnN0IGtiZEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNlYXJjaC1rYmRdIGtiZCcpO1xuICAgIGlmIChrYmRFbCkga2JkRWwudGV4dENvbnRlbnQgPSAnQ3RybCtLJztcbiAgfVxuICBjb25zdCBpbXBvcnRGaWxlID0gJDxIVE1MSW5wdXRFbGVtZW50PignI2ltcG9ydC1maWxlJyk7XG4gIGNvbnN0IHN0YXRzRWwgPSAkKCdbZGF0YS1zdGF0c10nKTtcbiAgY29uc3Qgc3RhcnNFbCA9ICQoJ1tkYXRhLXN0YXJzXScpO1xuICBjb25zdCB0b29sdGlwRWwgPSAkKCdbZGF0YS10b29sdGlwXScpO1xuICBjb25zdCBkcmlsbGRvd25FbCA9ICQoJ1tkYXRhLWRyaWxsZG93bl0nKTtcbiAgY29uc3QgZHJhd2VyID0gJCgnW2RhdGEtZHJhd2VyXScpO1xuICBjb25zdCBwYWxldHRlID0gJCgnW2RhdGEtcGFsZXR0ZV0nKTtcbiAgY29uc3QgcGFsZXR0ZUlucHV0ID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcGFsZXR0ZS1pbnB1dF0nKTtcbiAgY29uc3QgcGFsZXR0ZUxpc3QgPSAkKCdbZGF0YS1wYWxldHRlLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBXb3JkcyA9ICQoJ1tkYXRhLWNvbXAtd29yZHNdJyk7XG4gIGNvbnN0IGNvbXBUb2tlbnMgPSAkKCdbZGF0YS1jb21wLXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFRva2VucyA9ICQoJ1tkYXRhLXN0YXQtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0V29yZHMgPSAkKCdbZGF0YS1zdGF0LXdvcmRzXScpO1xuICBjb25zdCB3c1NlbGVjdCA9ICQ8SFRNTFNlbGVjdEVsZW1lbnQ+KCdbZGF0YS13b3Jrc3BhY2VdJyk7XG4gIGNvbnN0IHdzTGlzdCA9ICQoJ1tkYXRhLXdzLWxpc3RdJyk7XG4gIGNvbnN0IHdzTmFtZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXdzLW5hbWVdJyk7XG5cbiAgY29uc3QgbW91bnRJY29ucyA9IChyb290OiBQYXJlbnROb2RlID0gZG9jdW1lbnQpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWljb25dJykpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbicpO1xuICAgICAgY29uc3Qgc2l6ZSA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScpID8/IDE2KTtcbiAgICAgIGlmIChuYW1lICYmIFBHX0lDT05TLmhhcyhuYW1lKSkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICAgIH1cbiAgfTtcbiAgbW91bnRJY29ucygpO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiBib29sZWFuO1xuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IGJvb2xlYW47XG4gICAgaW5jbHVkZVN0eWxlczogYm9vbGVhbjtcbiAgICBtaW5pZnk6IGJvb2xlYW47XG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogYm9vbGVhbjtcbiAgICB1c2VTY3JlZW5zaG90czogYm9vbGVhbjtcbiAgICBzcGFjaW5nT3ZlcmxheTogYm9vbGVhbjtcbiAgICBob3ZlclNuYXA6IGJvb2xlYW47XG4gICAgYXV0b1NjcmVlbnNob3Q6IGJvb2xlYW47XG4gICAgLy8gQ29tbWEtc2VwYXJhdGVkIGhvc3QgcGF0dGVybnMgKHN1YnN0cmluZyBtYXRjaCkuIEhvc3RzIGluIHRoaXMgbGlzdFxuICAgIC8vIHNraXAgdGhlIGVudGlyZSBzY3JlZW5zaG90IHBpcGVsaW5lIOKAlCB1c2VmdWwgZm9yIHNlbnNpdGl2ZSBwYWdlc1xuICAgIC8vIChiYW5raW5nLCBpbnRlcm5hbCBhZG1pbikgd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IFBOR3MgbGFuZGluZ1xuICAgIC8vIG9uIGRpc2suXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogc3RyaW5nO1xuICAgIC8vIElubGluZSBERVNJR04ubWQgY29udGVudCB0aGUgdXNlciBwYXN0ZWQgb3IgdXBsb2FkZWQgdmlhIHRoZSBzaWRlXG4gICAgLy8gcGFuZWwgc2V0dGluZ3MuIERlZmF1bHRzIHRvIGEgdGVtcGxhdGVkIHBsYWNlaG9sZGVyIHNvIG91dC1vZi10aGUtXG4gICAgLy8gYm94IGV4cG9ydHMgYWx3YXlzIGluY2x1ZGUgYSBERVNJR04ubWQg4oCUIHRoZSBjb25zdW1lciBMTE0gY2FuXG4gICAgLy8gZWl0aGVyIHdvcmsgZnJvbSB0aGUgcGxhY2Vob2xkZXIgKGFuZCBhc2sgZm9yIHRoZSByZWFsIG9uZSkgb3JcbiAgICAvLyBmcm9tIGEgdXNlci1jdXN0b21pemVkIGNvcHkuIFRoZSBzZXR0aW5ncyBVSSBmbGFncyB0aGlzIGJhbm5lci1cbiAgICAvLyBzdHlsZSB3aGVuIHRoZSB2YWx1ZSBzdGlsbCBtYXRjaGVzIHRoZSB0ZW1wbGF0ZSBzbyB0aGUgdXNlclxuICAgIC8vIGtub3dzIHRvIGZpbGwgaXQgaW4uXG4gICAgZGVzaWduTWQ6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIHRoZSByZWNlaXZlciBzaG91bGQgcmVhZCBERVNJR04ubWQgZnJvbS4gRGVmYXVsdHNcbiAgICAvLyB0byBgfi8uYWdlbnRzL0RFU0lHTi5tZGA7IHVzZXIgY2FuIG92ZXJyaWRlIHBlci1tYWNoaW5lLlxuICAgIGRlc2lnblBhdGg6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIG9mIHRoZSBQaW5jaEdyYWIgVUkgc2tpbGwgb24gdGhlIHJlY2VpdmVyJ3NcbiAgICAvLyBmaWxlc3lzdGVtLiBUaGUgc2tpbGwgY29udGVudCBpdHNlbGYgaXMgYnVuZGxlZCBpbmxpbmUgaW50byB0aGVcbiAgICAvLyBhcmNoaXZlIChzZWUgYHNraWxsTWRgKSwgc28gdGhpcyBpcyBhIGhpbnQgZm9yIHJlY2VpdmVycyB0aGF0XG4gICAgLy8gd2FudCB0byBwZXJzaXN0IHRoZSBza2lsbCBhdCBhIGNhbm9uaWNhbCBsb2NhdGlvbi5cbiAgICBza2lsbFBhdGg6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgVUktc2tpbGwgY29udGVudC4gRGVmYXVsdCBpcyB0aGUgYnVuZGxlZCBQaW5jaEdyYWIgdHJpYWdlXG4gICAgLy8gc2tpbGwgdGVtcGxhdGU7IHVzZXIgY2FuIGN1c3RvbWl6ZSB2aWEgc2V0dGluZ3MgcGFzdGUvdXBsb2FkLlxuICAgIC8vIEJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSBhdCBgLi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgLlxuICAgIHNraWxsTWQ6IHN0cmluZztcbiAgICAvLyBXaGVuIHRydWUsIGZpcmUgYSBmcmVzaCBwYWdlIHNjcmVlbnNob3Qgb24gRVZFUlkgY2FwdHVyZSByYXRoZXJcbiAgICAvLyB0aGFuIG9uY2UgcGVyICh3b3Jrc3BhY2UsIHVybCkgdHVwbGUuIFVzZWZ1bCBmb3IgY2FwdHVyaW5nIGFcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3cgd2hlcmUgdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzLlxuICAgIC8vIERlZmF1bHQgZmFsc2Ug4oCUIG1vc3QgdXNlcnMgd2FudCB0aGUgZGVmYXVsdCBmaXJzdC1vbmx5IGJlaGF2aW9yXG4gICAgLy8gc2luY2UgcGFnZSBzY3JlZW5zaG90cyBhcmUgbGFyZ2UgYW5kIHRoZSBmaXJzdCBvbmUgYWxyZWFkeSBnaXZlc1xuICAgIC8vIGEgc2Vzc2lvbi1sZXZlbCByZWZlcmVuY2UuXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBib29sZWFuO1xuICB9O1xuICBjb25zdCBERUZBVUxUX1BSRUZTOiBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiB0cnVlLFxuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IHRydWUsXG4gICAgaW5jbHVkZVN0eWxlczogdHJ1ZSxcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IHRydWUsXG4gICAgdXNlU2NyZWVuc2hvdHM6IHRydWUsXG4gICAgc3BhY2luZ092ZXJsYXk6IGZhbHNlLFxuICAgIGhvdmVyU25hcDogdHJ1ZSxcbiAgICBhdXRvU2NyZWVuc2hvdDogdHJ1ZSxcbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiAnJyxcbiAgICAvLyBkZXNpZ25NZCAvIHNraWxsTWQgZGVmYXVsdCB0byAnJyB3aGljaCB0aGUgcmVzb2x2ZXIgdHJlYXRzIGFzXG4gICAgLy8gXCJmYWxsIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUgYXQgZXhwb3J0IHRpbWVcIi4gU3RvcmluZyB0aGVcbiAgICAvLyBlbXB0eSBzdHJpbmcga2VlcHMgY2hyb21lLnN0b3JhZ2Ugc21hbGwgYW5kIGxldHMgYGlzVXNpbmdUZW1wbGF0ZSpgXG4gICAgLy8gYmUgYSBjaGVhcCBzeW5jaHJvbm91cyBjaGVjay5cbiAgICBkZXNpZ25NZDogJycsXG4gICAgZGVzaWduUGF0aDogJ34vLmFnZW50cy9ERVNJR04ubWQnLFxuICAgIHNraWxsUGF0aDogJ34vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICBza2lsbE1kOiAnJyxcbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGZhbHNlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nfTtcblxuICBsZXQgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gIGxldCBsaXZlVGFiVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxpdmVUYWJQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2VsZWN0b3JWYWxpZGl0eSA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuIHwgJ2RpZmYtcGFnZSc+KCk7XG4gIGNvbnN0IHNlbGVjdG9yRXJyb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgaW5zZXJ0QmVmb3JlOiB7Y3VycmVudDogc3RyaW5nIHwgbnVsbDsgY29tbWVudDogYm9vbGVhbn0gPSB7Y3VycmVudDogbnVsbCwgY29tbWVudDogZmFsc2V9O1xuICBsZXQgc2VhcmNoUXVlcnkgPSAnJztcbiAgbGV0IGxhc3RBY3RpdmVTZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdGlja3lUaW1lciA9IDA7XG4gIGxldCBTVElDS1lfVFRMX01TID0gNV8wMDA7XG4gIGxldCBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgbGV0IHBoYW50b21UYXJnZXQ6IHtzZWxlY3Rvcjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyB0YWc/OiBzdHJpbmc7IHJlY3Q/OiBET01SZWN0fSB8IG51bGwgPSBudWxsO1xuICBsZXQgcGVuZGluZ011bHRpOiBFbnRyeVtdID0gW107XG4gIGNvbnN0IHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIHBlciBzZWxlY3Rvci4gTk9UIHBlcnNpc3RlZCB0b1xuICAvLyBjaHJvbWUuc3RvcmFnZSAoY2FwIHByZXNzdXJlIOKAlCAxMDAgY2FwdHVyZXMgw5cgODAgS0IgZWFjaCA9IDggTUIpLCBzb1xuICAvLyBpdCdzIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBzZXNzaW9uJ3MgYXJjaGl2ZSBleHBvcnQuIENsZWFyZWRcbiAgLy8gb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgY29uc3Qgc2hvdHNGdWxsID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gVHJhY2sgd2hpY2ggKHdvcmtzcGFjZSwgcGFnZS11cmwpIHR1cGxlcyBhbHJlYWR5IGZpcmVkIGEgcGFnZSBzaG90IHNvIHdlXG4gIC8vIGRvbid0IHJlLXNob290IHRoZSBlbnRpcmUgcGFnZSBvbiBldmVyeSBjYXB0dXJlLiBSZXNldCBvbiB3b3Jrc3BhY2VcbiAgLy8gc3dpdGNoIOKAlCBubyBkYXkga2V5LCB0aGUgZGVkdXBlIGlzIHBlci1zZXNzaW9uLlxuICBjb25zdCBwYWdlU2hvdHNGaXJlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBwYWdlU2hvdEtleSA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiBgJHthY3RpdmVXc306JHt1cmx9YDtcbiAgLy8gTGFzdCBzdWNjZXNzZnVsIGV4cG9ydCDigJQgYm90aCB0aGUgd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKHNob3duIHRvIHRoZVxuICAvLyB1c2VyKSBhbmQgdGhlIE9TLWFic29sdXRlIHBhdGggKGNvcGllZCBieSB0aGUgXCJDb3B5IGFzIHBhdGhcIiBidXR0b24pLlxuICAvLyBVcGRhdGVkIG9uIEpTT05ML01EL1pJUC9zY3JlZW5zaG90IHNhdmVzLlxuICBjb25zdCBsYXN0RXhwb3J0OiB7cmVsUGF0aDogc3RyaW5nIHwgbnVsbDsgYWJzUGF0aDogc3RyaW5nIHwgbnVsbDsgY29weVBhdGg6IHN0cmluZyB8IG51bGw7IHRlbXBQYXRoOiBib29sZWFuOyBraW5kOiBzdHJpbmcgfCBudWxsfSA9IHtcbiAgICByZWxQYXRoOiBudWxsLCBhYnNQYXRoOiBudWxsLCBjb3B5UGF0aDogbnVsbCwgdGVtcFBhdGg6IGZhbHNlLCBraW5kOiBudWxsLFxuICB9O1xuICBsZXQgd29ya3NwYWNlczogV29ya3NwYWNlW10gPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgbGV0IGFjdGl2ZVdzID0gJ2RlZmF1bHQnO1xuICAvLyBTZXNzaW9uIHV1aWQg4oCUIGdlbmVyYXRlZCBvbmNlIHBlciB3b3Jrc3BhY2UgYm9vdC4gR29lcyBvbnRvIGV2ZXJ5XG4gIC8vIHBhZ2Ugcm93IGFuZCBldmVyeSBzZWxlY3RvciBlbnRyeSBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzXG4gIC8vIHRvIFwid2hpY2ggc2Vzc2lvbj9cIiB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS4gU3RhYmxlIGFjcm9zcyBhXG4gIC8vIHNpbmdsZSB3b3Jrc3BhY2UgbG9hZDsgcmVzZXRzIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGxldCBzZXNzaW9uSWQ6IHN0cmluZyA9ICcnO1xuICBjb25zdCB3c01zZ0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259Lm1lc3NhZ2VzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0Z1bGxLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90c0Z1bGwudjFgO1xuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBoYXMgYSAxMCBNQiBkZWZhdWx0IHF1b3RhOyB3ZSBidWRnZXQgaGFsZiBvZlxuICAvLyB0aGF0IGZvciBmdWxsLXJlc29sdXRpb24gUE5HcyAodGhlIHJlc3QgaXMgbWVzc2FnZXMsIHByZWZzLCB0aHVtYnMpLlxuICAvLyBXaGVuIHRoZSBidWRnZXQgaXMgcmVhY2hlZCB3ZSBGSUZPLWV2aWN0IHRoZSBvbGRlc3QgZW50cmllcyAoTWFwXG4gIC8vIHByZXNlcnZlcyBpbnNlcnRpb24gb3JkZXIpLiBFc3RpbWF0ZSBkYXRhVVJMIHNpemUgPSBzdHJpbmcgbGVuZ3RoLlxuICBjb25zdCBTSE9UU19GVUxMX0JVREdFVF9CWVRFUyA9IDUgKiAxMDI0ICogMTAyNDtcbiAgY29uc3QgdW5kb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCByZWRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFVORE9fQ0FQID0gMzA7XG4gIGxldCBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gIGxldCBwcmVmczogUHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGU307XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXR1cyBoZWxwZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzdGF0dXNUaW1lciA9IDA7XG4gIGNvbnN0IHNldFN0YXR1cyA9IChtc2c6IHN0cmluZywgb3B0czoge2tpbmQ/OiAnd2FybicgfCAnaW5mbycgfCAnb2snfSA9IHt9KTogdm9pZCA9PiB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gbXNnIHx8ICcnO1xuICAgIGNsZWFyVGltZW91dChzdGF0dXNUaW1lcik7XG4gICAgaWYgKG1zZykge1xuICAgICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gb3B0cy5raW5kID09PSAnd2FybicgPyAndmFyKC0tcmVkKScgOlxuICAgICAgICBvcHRzLmtpbmQgPT09ICdpbmZvJyA/ICd2YXIoLS10ZXh0LTMpJyA6ICd2YXIoLS1ncmVlbiknO1xuICAgICAgc3RhdHVzVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHN0YXR1cy50ZXh0Q29udGVudCA9ICcnOyB9LCAyMjAwKTtcbiAgICB9XG4gIH07XG4gIGxldCB0b2FzdFRpbWVyID0gMDtcbiAgY29uc3Qgc2hvd1RvYXN0ID0gKHRpdGxlOiBzdHJpbmcsIGRldGFpbCA9ICcnLCBraW5kOiAnb2snIHwgJ3dhcm4nID0gJ29rJyk6IHZvaWQgPT4ge1xuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1jb3B5LXRvYXN0XScpO1xuICAgIGlmICghdG9hc3QpIHtcbiAgICAgIHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAnY29weS10b2FzdCc7XG4gICAgICB0b2FzdC5kYXRhc2V0LmNvcHlUb2FzdCA9ICd0cnVlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRvYXN0KTtcbiAgICB9XG4gICAgdG9hc3QuY2xhc3NMaXN0LnRvZ2dsZSgnd2FybicsIGtpbmQgPT09ICd3YXJuJyk7XG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC1pY29uXCI+JHtQR19JQ09OUy5zdmdTdHJpbmcoa2luZCA9PT0gJ3dhcm4nID8gJ2FsZXJ0LWNpcmNsZScgOiAnY2lyY2xlLWNoZWNrJywgMjIpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC10ZXh0XCI+PGI+JHtlc2NhcGVIdG1sKHRpdGxlKX08L2I+JHtkZXRhaWwgPyBgPHNtYWxsPiR7ZXNjYXBlSHRtbChkZXRhaWwpfTwvc21hbGw+YCA6ICcnfTwvc3Bhbj5gO1xuICAgIHRvYXN0LmhpZGRlbiA9IGZhbHNlO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB2b2lkIHRvYXN0Lm9mZnNldFdpZHRoO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcik7XG4gICAgdG9hc3RUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRvYXN0Py5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IGlmICh0b2FzdCkgdG9hc3QuaGlkZGVuID0gdHJ1ZTsgfSwgMTgwKTtcbiAgICB9LCAxNDUwKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0NvcGllZCA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWwgPSAnJyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICdvaycpO1xuICBjb25zdCBzaG93RG93bmxvYWRFcnJvciA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWw6IHN0cmluZyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICd3YXJuJyk7XG5cbiAgLy8g4pSA4pSA4pSAIFV0aWxpdGllcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGZhbGxiYWNrSWRDb3VudGVyID0gMDtcbiAgY29uc3Qgc2VjdXJlVG9rZW4gPSAoYnl0ZXMgPSAxMik6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBVaW50OEFycmF5KGJ5dGVzKTtcbiAgICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYXcpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocmF3KS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfV8keygrK2ZhbGxiYWNrSWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG1zZ0lkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgaWYgKGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQpIHJldHVybiBnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKCk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggKi8gfVxuICAgIHJldHVybiBgaWRfJHtzZWN1cmVUb2tlbigxNil9YDtcbiAgfTtcbiAgY29uc3QgZXNjYXBlSHRtbCA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBTdHJpbmcocykucmVwbGFjZUFsbCgnJicsICcmYW1wOycpLnJlcGxhY2VBbGwoJzwnLCAnJmx0OycpLnJlcGxhY2VBbGwoJz4nLCAnJmd0OycpO1xuICBjb25zdCBlc2NhcGVSZSA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xuICBjb25zdCBoaWdobGlnaHRNYXRjaCA9ICh0ZXh0OiBzdHJpbmcsIHE6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KTtcbiAgICByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoYCgke2VzY2FwZVJlKHEpfSlgLCAnZ2knKSwgJzxtYXJrPiQxPC9tYXJrPicpO1xuICB9O1xuICAvLyBXYWxrIHRleHQgbm9kZXMgaW5zaWRlIGByb290YCwgd3JhcHBpbmcgY2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGVzIG9mIGBxYFxuICAvLyBpbiA8bWFyaz4gZWxlbWVudHMuIERvZXNuJ3QgdG91Y2ggYXR0cmlidXRlIHN0cmluZ3Mgb3IgaW5uZXItdGFnIEhUTUwgc29cbiAgLy8gaXQncyBzYWZlIHRvIHJ1biBvbiBhbHJlYWR5LWhpZ2hsaWdodGVkIEpTT04gb3V0cHV0LlxuICBjb25zdCB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzID0gKHJvb3Q6IEhUTUxFbGVtZW50LCBxOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoIXEpIHJldHVybjtcbiAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmUocSksICdnaScpO1xuICAgIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIocm9vdCwgTm9kZUZpbHRlci5TSE9XX1RFWFQpO1xuICAgIGNvbnN0IHRhcmdldHM6IFRleHRbXSA9IFtdO1xuICAgIGxldCBub2RlOiBOb2RlIHwgbnVsbDtcbiAgICB3aGlsZSAoKG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgIGlmIChyZS50ZXN0KG5vZGUubm9kZVZhbHVlID8/ICcnKSkgdGFyZ2V0cy5wdXNoKG5vZGUgYXMgVGV4dCk7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFyZ2V0cykge1xuICAgICAgY29uc3QgdmFsdWUgPSB0Lm5vZGVWYWx1ZSA/PyAnJztcbiAgICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBsZXQgbGFzdCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgdmFsdWUubWF0Y2hBbGwocmUpKSB7XG4gICAgICAgIGNvbnN0IGkgPSBtLmluZGV4ID8/IDA7XG4gICAgICAgIGlmIChpID4gbGFzdCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCwgaSkpO1xuICAgICAgICBjb25zdCBtayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21hcmsnKTtcbiAgICAgICAgbWsudGV4dENvbnRlbnQgPSBtWzBdO1xuICAgICAgICBmcmFnLmFwcGVuZChtayk7XG4gICAgICAgIGxhc3QgPSBpICsgbVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICBpZiAobGFzdCA8IHZhbHVlLmxlbmd0aCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCkpO1xuICAgICAgdC5yZXBsYWNlV2l0aChmcmFnKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHdvcmRDb3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gKHMubWF0Y2goL1xcUysvZykgPz8gW10pLmxlbmd0aDtcbiAgY29uc3QgdG9rZW5Db3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gTWF0aC5jZWlsKHMubGVuZ3RoIC8gNCk7XG4gIGNvbnN0IHBhdGhPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5wYXRobmFtZTsgfSBjYXRjaCB7IHJldHVybiB1OyB9IH07XG4gIGNvbnN0IGhvc3RPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5ob3N0OyB9IGNhdGNoIHsgcmV0dXJuICcnOyB9IH07XG4gIC8vIEZpbGVuYW1lLXNhZmUgaG9zdCBzbHVnOiBkb3RzIOKGkiB1bmRlcnNjb3JlcyBwZXIgcHJvamVjdCBjb252ZW50aW9uLlxuICAvLyBNaXJyb3JzIGJhY2tncm91bmQudHMgaG9zdFNsdWcgZm9yIHN5bW1ldHJ5IGFjcm9zcyBzY3JlZW5zaG90ICsgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcy5cbiAgY29uc3QgaG9zdFNsdWcgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGggPSBob3N0T2YodXJsKTtcbiAgICBpZiAoIWgpIHJldHVybiAndW5rbm93bic7XG4gICAgcmV0dXJuIGgucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG4gIH07XG4gIC8vIFBpY2sgdGhlIG1vc3QtZnJlcXVlbnQgaG9zdCBhY3Jvc3MgYWxsIHNlbGVjdG9yIGNhcHR1cmVzIChmb3IgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcykuIFdoZW4gdGhlIHdvcmtzcGFjZSBzcGFucyBtdWx0aXBsZSBob3N0cywgcmV0dXJuICdtdWx0aScuXG4gIGNvbnN0IGRvbWluYW50SG9zdFNsdWcgPSAoKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdFNsdWcobS5lbnRyeS51cmwpO1xuICAgICAgY291bnRzLnNldChoLCAoY291bnRzLmdldChoKSA/PyAwKSArIDEpO1xuICAgIH1cbiAgICBpZiAoIWNvdW50cy5zaXplKSByZXR1cm4gJ2VtcHR5JztcbiAgICBsZXQgYmVzdCA9ICcnO1xuICAgIGxldCBiZXN0TiA9IDA7XG4gICAgZm9yIChjb25zdCBbaCwgbl0gb2YgY291bnRzKSB7XG4gICAgICBpZiAobiA+IGJlc3ROKSB7IGJlc3QgPSBoOyBiZXN0TiA9IG47IH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50cy5zaXplID4gMSA/ICdtdWx0aScgOiBiZXN0O1xuICB9O1xuICAvLyBEaXN0aW5jdCBob3N0cyBwcmVzZW50IGluIHRoaXMgd29ya3NwYWNlIChhbHBoYWJldGljYWwsIGNhcHBlZCkuIFVzZWQgaW5cbiAgLy8gdGhlIGV4cG9ydCBtYW5pZmVzdCdzIGBob3N0c2AgZmllbGQuXG4gIGNvbnN0IGRpc3RpbmN0SG9zdHMgPSAoKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IHNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdE9mKG0uZW50cnkudXJsKTtcbiAgICAgIGlmIChoKSBzZXQuYWRkKGgpO1xuICAgIH1cbiAgICByZXR1cm4gWy4uLnNldF0uc29ydCgpLnNsaWNlKDAsIDIwKTtcbiAgfTtcbiAgLy8gQnVpbGQgYSBmaWxlbmFtZSBvZiB0aGUgc2hhcGUgYHBpbmNoZ3JhYi08d29ya3NwYWNlPi08aG9zdD4tPGVwb2NoPi48ZXh0PmAuXG4gIGNvbnN0IGJ1aWxkRXhwb3J0RmlsZW5hbWUgPSAoZXh0OiAnanNvbmwnIHwgJ21kJyB8ICd0YXIuenN0Jyk6IHN0cmluZyA9PlxuICAgIGBwaW5jaGdyYWItJHthY3RpdmVXc30tJHtkb21pbmFudEhvc3RTbHVnKCl9LSR7RGF0ZS5ub3coKX0uJHtleHR9YDtcbiAgLy8gU2tpcC1saXN0IG1hdGNoOiBzdWJzdHJpbmcgKGNhc2UtaW5zZW5zaXRpdmUpIG1hdGNoIGFnYWluc3QgdGhlIFVSTCdzXG4gIC8vIGhvc3QuIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIFVSTCBwYXJzaW5nIG9uIHRoZSBwYXR0ZXJucyBzbyB0aGUgdXNlclxuICAvLyBjYW4gd3JpdGUgYHdyYW5uZ2xlLmNvbWAgYW5kIGhhdmUgaXQgbWF0Y2ggYGFwcC53cmFubmdsZS5jb21gIHRvby5cbiAgY29uc3Qgc2hvdWxkU2tpcFNjcmVlbnNob3QgPSAodXJsOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBsaXN0ID0gKHByZWZzLnNraXBTY3JlZW5zaG90SG9zdHMgPz8gJycpLnNwbGl0KCcsJykubWFwKChzKSA9PiBzLnRyaW0oKS50b0xvd2VyQ2FzZSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGhvc3QgPSBob3N0T2YodXJsKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBsaXN0LnNvbWUoKHBhdCkgPT4gaG9zdC5pbmNsdWRlcyhwYXQpKTtcbiAgfTtcblxuICAvLyBKU09OIHN5bnRheCBoaWdobGlnaHQgKHBlci1rZXkgY29sb3IgaXMgaGFzaGVkIGZvciB2aXN1YWwgdmFyaWV0eSkuXG4gIGNvbnN0IEtFWV9QQUxFVFRFID0gWycjZmY3ZTc4JywgJyNmZmI0NTQnLCAnI2ZmZTA2NicsICcjN2JkOTdhJywgJyM1ZmQxZmYnLCAnIzliOGNmZicsICcjZmY4NWMxJywgJyNmZjVmMDAnLCAnIzEwYjk4MScsICcjZjU5ZTBiJywgJyNhNzhiZmEnLCAnIzM0ZDM5OSddO1xuICBjb25zdCBjb2xvckZvcktleSA9IChrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgay5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgICByZXR1cm4gS0VZX1BBTEVUVEVbaCAlIEtFWV9QQUxFVFRFLmxlbmd0aF0hO1xuICB9O1xuICBjb25zdCBKU09OX1RPS0VOX1JFID0gLyhcXHMrKXwoXCIoPzpbXlwiXFxcXF18XFxcXC4pKlwiKXwodHJ1ZXxmYWxzZXxudWxsKXwoLT9cXGQrKD86XFwuXFxkKyk/KD86W2VFXVsrLV0/XFxkKyk/KXwoW3t9W1xcXSw6XSkvZztcbiAgY29uc3QgYXBwZW5kSnNvbkhpZ2hsaWdodCA9IChyb290OiBIVE1MRWxlbWVudCwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgcm9vdC50ZXh0Q29udGVudCA9ICcnO1xuICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICAgIGxldCBsYXN0ID0gMDtcbiAgICBKU09OX1RPS0VOX1JFLmxhc3RJbmRleCA9IDA7XG4gICAgd2hpbGUgKChtID0gSlNPTl9UT0tFTl9SRS5leGVjKHRleHQpKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKG0uaW5kZXggPiBsYXN0KSByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKGxhc3QsIG0uaW5kZXgpKSk7XG4gICAgICBsYXN0ID0gSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXg7XG4gICAgICBjb25zdCBbLCB3cywgc3RyLCBsaXQsIG51bSwgcHVuY3RdID0gbTtcbiAgICAgIGlmICh3cykgeyByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh3cykpOyBjb250aW51ZTsgfVxuICAgICAgaWYgKHN0cikge1xuICAgICAgICBsZXQgayA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgICB3aGlsZSAoayA8IHRleHQubGVuZ3RoICYmICh0ZXh0W2tdID09PSAnICcgfHwgdGV4dFtrXSA9PT0gJ1xcdCcgfHwgdGV4dFtrXSA9PT0gJ1xcbicpKSBrKys7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGlmICh0ZXh0W2tdID09PSAnOicpIHtcbiAgICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG4gICAgICAgICAgdHJ5IHsga2V5ID0gSlNPTi5wYXJzZShzdHIpIGFzIHN0cmluZzsgfSBjYXRjaCB7IGtleSA9IHN0ci5zbGljZSgxLCAtMSk7IH1cbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdrJztcbiAgICAgICAgICBzcGFuLnN0eWxlLmNvbG9yID0gY29sb3JGb3JLZXkoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdzJztcbiAgICAgICAgfVxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gc3RyO1xuICAgICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgaWYgKGxpdCkgc3Bhbi5jbGFzc05hbWUgPSAnYic7XG4gICAgICBlbHNlIGlmIChudW0pIHNwYW4uY2xhc3NOYW1lID0gJ24nO1xuICAgICAgZWxzZSBpZiAocHVuY3QpIHNwYW4uY2xhc3NOYW1lID0gJ3AnO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGxpdCA/PyBudW0gPz8gcHVuY3QgPz8gJyc7XG4gICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICB9XG4gICAgaWYgKGxhc3QgPCB0ZXh0Lmxlbmd0aCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0KSkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBQZXJzaXN0ZW5jZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgbG9hZEFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICB3b3Jrc3BhY2VzID0gKGF3YWl0IFN0b3JlLmdldDxXb3Jrc3BhY2VbXT4oV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpKSB8fCB3b3Jrc3BhY2VzO1xuICAgIGlmICghd29ya3NwYWNlcy5sZW5ndGgpIHdvcmtzcGFjZXMgPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgICBhY3RpdmVXcyA9IChhd2FpdCBTdG9yZS5nZXQ8c3RyaW5nPigncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsICdkZWZhdWx0JykpIHx8ICdkZWZhdWx0JztcbiAgICBpZiAoIXdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBhY3RpdmVXcykpIGFjdGl2ZVdzID0gd29ya3NwYWNlc1swXSEubmFtZTtcbiAgICBwcmVmcyA9IHsuLi5ERUZBVUxUX1BSRUZTLCAuLi4oYXdhaXQgU3RvcmUuZ2V0PFBhcnRpYWw8UHJlZnM+PihQUkVGU19TVE9SQUdFX05BTUUsIHt9KSl9O1xuICAgIC8vIFBhdGggbWlncmF0aW9uOiBwcmlvciB2ZXJzaW9ucyBkZWZhdWx0ZWQgc2tpbGxQYXRoIHRvXG4gICAgLy8gYH4vLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLCBhbmQgc29tZSB1c2VycyBoYWQgaXQgc3RvcmVkIGFzXG4gICAgLy8gYH4vLmRvdGZpbGVzLy5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYC4gVGhlIHNraWxsIHdhcyByZW5hbWVkXG4gICAgLy8gdG8gYFBpbmNoR3JhYmA7IGFueSBgfi8uZG90ZmlsZXMvYCBwcmVmaXggaXMgc3RyaXBwZWQgZnJvbVxuICAgIC8vIGV4cG9zZWQgZGVmYXVsdHMgKGRvdGZpbGVzIGlzIGEgcGVyc29uYWwgY29uZmlnIHNvdXJjZSDigJQgZXhwb3J0c1xuICAgIC8vIHNob3VsZG4ndCBsZWFrIHRoYXQgcGF0aCkuXG4gICAgY29uc3QgdXBncmFkZVBhdGggPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkLCBmcmVzaDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgIGlmICghcCkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuaW5jbHVkZXMoJy5kb3RmaWxlcycpKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5lbmRzV2l0aCgnc2tpbGxzL3VpL1NLSUxMLm1kJykpIHJldHVybiBmcmVzaDtcbiAgICAgIHJldHVybiBwO1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLmRlc2lnblBhdGgsIERFRkFVTFRfUFJFRlMuZGVzaWduUGF0aCk7XG4gICAgcHJlZnMuc2tpbGxQYXRoID0gdXBncmFkZVBhdGgocHJlZnMuc2tpbGxQYXRoLCBERUZBVUxUX1BSRUZTLnNraWxsUGF0aCk7XG4gICAgLy8gQ29udGVudCBtaWdyYXRpb246IHByZXZpb3VzIHZlcnNpb25zIHN0b3JlZCB0aGUgZW50aXJlIHRlbXBsYXRlXG4gICAgLy8gdGV4dCBpbnNpZGUgYHByZWZzLmRlc2lnbk1kYCAvIGBwcmVmcy5za2lsbE1kYCBhcyBkZWZhdWx0cy4gVGhhdFxuICAgIC8vIGF0ZSB+MzYwS0Igb2YgY2hyb21lLnN0b3JhZ2UgcXVvdGEgZm9yIG5vIGJlbmVmaXQuIERldGVjdCB3aGVuXG4gICAgLy8gdGhlIHN0b3JlZCB2YWx1ZSBtYXRjaGVzIG9uZSBvZiB0aGUgYnVuZGxlZCB0ZW1wbGF0ZXMgYW5kIGNsZWFyXG4gICAgLy8gaXQg4oCUIHRoZSByZXNvbHZlciBmYWxscyBiYWNrIHRvIHRoZSBidW5kbGVkIGZpbGUgb24gdGhlIGZseS5cbiAgICAvLyBBbHNvIHNjcnViIGFueSBsZWFrZWQgYH4vLmRvdGZpbGVzL2Agc3Vic3RyaW5nLlxuICAgIGNvbnN0IHNjcnViRG90ZmlsZXMgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgICBzLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLy5hZ2VudHMvJywgJ34vLmFnZW50cy8nKVxuICAgICAgIC5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8nLCAnfi8uYWdlbnRzLycpO1xuICAgIGNvbnN0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUgPSBhc3luYyAoY3VycmVudDogc3RyaW5nLCBrZXlzOiBUZW1wbGF0ZUtleVtdKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgIGlmICghY3VycmVudCB8fCAhY3VycmVudC50cmltKCkpIHJldHVybiAnJztcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSBjdXJyZW50LnRyaW0oKTtcbiAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IHRwbCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoaykpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRwbCAmJiB0cGwgPT09IHRyaW1tZWQpIHJldHVybiAnJzsgLy8gbWF0Y2hlcyBhIGJ1bmRsZWQgdGVtcGxhdGUg4oCUIGNvbGxhcHNlIHRvIGVtcHR5XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycmVudC5pbmNsdWRlcygnLmRvdGZpbGVzJykgPyBzY3J1YkRvdGZpbGVzKGN1cnJlbnQpIDogY3VycmVudDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnbk1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5kZXNpZ25NZCA/PyAnJywgWydsb2NhbERlc2lnbicsICdkZXNpZ25UZW1wbGF0ZSddKTtcbiAgICBwcmVmcy5za2lsbE1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5za2lsbE1kID8/ICcnLCBbJ2xvY2FsU2tpbGwnLCAnc2tpbGxUZW1wbGF0ZSddKTtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKGFjdGl2ZVdzKTtcbiAgfTtcbiAgY29uc3QgbG9hZFdvcmtzcGFjZSA9IGFzeW5jIChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhY3RpdmVXcyA9IG5hbWU7XG4gICAgdm9pZCBTdG9yZS5zZXQoJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCBuYW1lKTtcbiAgICAvLyBNaW50IGEgbmV3IHNlc3Npb25JZCBwZXIgd29ya3NwYWNlIGxvYWQuIFNhbWUgd29ya3NwYWNlIHJlLW9wZW5lZFxuICAgIC8vID0gbmV3IHNlc3Npb246IGRpc3RpbmN0IHV1aWQgc28gYSBjb25zdW1lciBjYW4gdGVsbCB0d28gYm9vdHNcbiAgICAvLyBhcGFydCBldmVuIHdoZW4gdGhlIGNhcHR1cmVzIGxhbmQgaW4gdGhlIHNhbWUgb24tZGlzayBmaWxlLlxuICAgIHNlc3Npb25JZCA9IG1zZ0lkKCk7XG4gICAgbWVzc2FnZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFBhbmVsTWVzc2FnZVtdPih3c01zZ0tleShuYW1lKSwgW10pKSB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSBtZXNzYWdlcyA9IFtdO1xuICAgIC8vIE1pZ3JhdGUgbGVnYWN5IGVudHJpZXMgKG5vIHVpZCwgc3RhdGVzLWFzLXJlY29yZCwgYXR0cnMuZm9ybWF0KSBhbmRcbiAgICAvLyBwZXJzaXN0IGlmIGFueXRoaW5nIGNoYW5nZWQgc28gd2UgZG9uJ3QgcGF5IHRoZSBtaWdyYXRpb24gY29zdCBhZ2FpblxuICAgIC8vIG5leHQgbG9hZC5cbiAgICBpZiAobWlncmF0ZUxvYWRlZE1lc3NhZ2VzKCkpIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KG5hbWUpLCBtZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwYWdlU2hvdHNGaXJlZC5jbGVhcigpO1xuICAgIGNvbnN0IHN0b3JlZCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0tleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWQpKSBzaG90cy5zZXQoaywgdik7XG4gICAgLy8gUmVzdG9yZSB0aGUgZnVsbC1yZXNvbHV0aW9uIFBORyBjYWNoZSBzbyBhIHdvcmtzcGFjZSBhcmNoaXZlXG4gICAgLy8gZXhwb3J0ZWQgQUZURVIgYSBwYW5lbCByZWxvYWQgc3RpbGwgYnVuZGxlcyBzY3JlZW5zaG90cyBmcm9tXG4gICAgLy8gZWFybGllciBjYXB0dXJlcy4gRklGTyBvcmRlciBpcyBwcmVzZXJ2ZWQgYnkgT2JqZWN0IGtleSBvcmRlci5cbiAgICBjb25zdCBzdG9yZWRGdWxsID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzRnVsbEtleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWRGdWxsKSkgc2hvdHNGdWxsLnNldChrLCB2KTtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgc2VsZWN0b3JFcnJvcnMuY2xlYXIoKTtcbiAgICB1bmRvU3RhY2subGVuZ3RoID0gMDtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gbnVsbDtcbiAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICB9O1xuICBjb25zdCBwZXJzaXN0ID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KGFjdGl2ZVdzKSwgbWVzc2FnZXMpO1xuICAgIC8vIFB1c2ggY2FwdHVyZWQtc2VsZWN0b3Igc2V0IHNvIHRoZSBjb250ZW50IHNjcmlwdCdzIGhvdmVyIHdhbGtlciBjYW5cbiAgICAvLyByZXNvbHZlIGRlc2NlbmRhbnRzIOKGkiBjYXB0dXJlZCBhbmNlc3Rvci5cbiAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgc2VuZFRvQ1Moe2tpbmQ6ICdzZXQtY2FwdHVyZWQnLCBzZWxlY3RvcnN9KTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFByZWZzID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KFBSRUZTX1NUT1JBR0VfTkFNRSwgcHJlZnMpO1xuICAgIC8vIFB1c2ggdGhlIHN1YnNldCBvZiBwcmVmcyB0aGUgY29udGVudCBzY3JpcHQgY2FyZXMgYWJvdXQgc28gaXRzXG4gICAgLy8gb3ZlcmxheSAoc3BhY2luZyB2aXN1YWxpemVyLCBob3ZlciBzbmFwLCBldGMuKSByZWZsZWN0cyB0aGUgbGF0ZXN0LlxuICAgIHZvaWQgc2VuZFRvQ1Moe1xuICAgICAga2luZDogJ3NldC1jcy1wcmVmcycsXG4gICAgICBzcGFjaW5nT3ZlcmxheTogcHJlZnMuc3BhY2luZ092ZXJsYXksXG4gICAgICBob3ZlclNuYXA6IHByZWZzLmhvdmVyU25hcCxcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICAvLyBGdWxsLXJlc29sdXRpb24gUE5HIHBlcnNpc3RlbmNlIHdpdGggRklGTyBldmljdGlvbi4gZGF0YVVSTCBzdHJpbmdzXG4gIC8vIGNhbiBydW4gNTAtNTAwIEtCIGVhY2g7IHRoZSBkZWZhdWx0IHF1b3RhIGdldHMgZXhoYXVzdGVkIGluIHRlbnMgb2ZcbiAgLy8gY2FwdHVyZXMgd2l0aG91dCBhIGJ1ZGdldC4gTWFwIGluc2VydGlvbiBvcmRlciA9IEZJRk8gb3JkZXIsIHNvXG4gIC8vIHdlIGV2aWN0IGZyb20gdGhlIGZyb250IHVudGlsIHVuZGVyIGJ1ZGdldCBiZWZvcmUgcGVyc2lzdGluZy5cbiAgY29uc3QgZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgZm9yIChjb25zdCB2IG9mIHNob3RzRnVsbC52YWx1ZXMoKSkgdG90YWwgKz0gdi5sZW5ndGg7XG4gICAgbGV0IGV2aWN0ZWQgPSAwO1xuICAgIHdoaWxlICh0b3RhbCA+IFNIT1RTX0ZVTExfQlVER0VUX0JZVEVTKSB7XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHNob3RzRnVsbC5rZXlzKCkubmV4dCgpLnZhbHVlO1xuICAgICAgaWYgKGZpcnN0S2V5ID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgY29uc3QgcmVtb3ZlZCA9IHNob3RzRnVsbC5nZXQoZmlyc3RLZXkpO1xuICAgICAgaWYgKHJlbW92ZWQgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBzaG90c0Z1bGwuZGVsZXRlKGZpcnN0S2V5KTtcbiAgICAgIHRvdGFsIC09IHJlbW92ZWQubGVuZ3RoO1xuICAgICAgZXZpY3RlZCsrO1xuICAgIH1cbiAgICByZXR1cm4gZXZpY3RlZDtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzRnVsbCA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBldmljdGVkID0gZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCgpO1xuICAgIGlmIChldmljdGVkID4gMCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCBgc2hvdHNGdWxsIEZJRk8tZXZpY3RlZCAke2V2aWN0ZWR9IG9sZGVzdCBlbnRyaWVzIHRvIGZpdCAke1NIT1RTX0ZVTExfQlVER0VUX0JZVEVTIC8gMTAyNCAvIDEwMjR9TUIgYnVkZ2V0YCk7XG4gICAgfVxuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzRnVsbCkgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzRnVsbEtleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RXb3Jrc3BhY2VzID0gKCk6IHZvaWQgPT4geyB2b2lkIFN0b3JlLnNldChXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcyk7IH07XG5cbiAgLy8g4pSA4pSA4pSAIFNuYXBzaG90IC8gdW5kbyAvIHJlZG8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNuYXBzaG90ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdXNwZW5kU25hcHNob3RzKSByZXR1cm47XG4gICAgaWYgKHVuZG9TdGFjay5sZW5ndGggPj0gVU5ET19DQVApIHVuZG9TdGFjay5zaGlmdCgpO1xuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVzdG9yZSA9IChqc29uOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBzdXNwZW5kU25hcHNob3RzID0gdHJ1ZTtcbiAgICB0cnkgeyBtZXNzYWdlcyA9IEpTT04ucGFyc2UoanNvbikgYXMgUGFuZWxNZXNzYWdlW107IH0gY2F0Y2ggeyBtZXNzYWdlcyA9IFtdOyB9XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IGZhbHNlO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcbiAgY29uc3QgdW5kbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXVuZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHVuZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHJlZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZSh1bmRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1VuZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFyZWRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byByZWRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUocmVkb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdSZWRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCB1cGRhdGVVbmRvQnV0dG9ucyA9ICgpOiB2b2lkID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJ1bmRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgdW5kb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwicmVkb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHJlZG9TdGFjay5sZW5ndGggPT09IDApO1xuICB9O1xuICBjb25zdCB1cGRhdGVDb3B5UGF0aEJ1dHRvbiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtYWN0aW9uPVwiY29weS1wYXRoXCJdJyk7XG4gICAgaWYgKCFidG4pIHJldHVybjtcbiAgICBjb25zdCBoYXMgPSBCb29sZWFuKGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoKTtcbiAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCAhaGFzKTtcbiAgICBidG4uZGF0YXNldC50aXAgPSBoYXNcbiAgICAgID8gYENvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC5cXG4ke2xhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoID8/ICcnfWBcbiAgICAgIDogJ0NvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC4gUnVuIGFuIGV4cG9ydCBmaXJzdC4nO1xuICB9O1xuICBjb25zdCBvbkNvcHlQYXRoID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aDtcbiAgICBpZiAoIXBhdGhUb0NvcHkpIHtcbiAgICAgIHNldFN0YXR1cygnTm8gZXhwb3J0IHlldCDigJQgcnVuIGEgZG93bmxvYWQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwYXRoVG9Db3B5KTtcbiAgICAgIC8vIFNob3cgb25seSB0aGUgbGVhZiBmaWxlbmFtZSBpbiB0aGUgc3RhdHVzIOKAlCB0aGUgZnVsbCBXaW5kb3dzLXN0eWxlXG4gICAgICAvLyBhYnNvbHV0ZSBwYXRoIHdvdWxkIGJlIDEwMCsgY2hhcnMgYW5kIHdhcyBkaXNydXB0aW5nIHRoZSBzaWRlYmFyXG4gICAgICAvLyBsYXlvdXQgZm9yIHRoZSAyLXNlY29uZCBzdGF0dXMgVFRMLlxuICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgIHNldFN0YXR1cyhgQ29waWVkIHBhdGggwrcgJHtsZWFmfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIHBhdGgnLCBsZWFmKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCB3cml0ZSBmYWlsZWQ6ICcgKyBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignQ2xpcGJvYXJkIGZhaWxlZCcsIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSkpO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHRvIGFjdGl2ZSB0YWIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRUb0NTID0gYXN5bmMgKHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG1zZyA9IHBnKHBheWxvYWQpO1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgaWYgKHRhYnNbMF0/LmlkICE9IG51bGwpIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIG1zZykuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHsgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiBtc2d9KSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2VuZFRvQ1NBbmRXYWl0ID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8UiB8IG51bGw+ID0+IG5ldyBQcm9taXNlPFIgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnN0IHJlcUlkID0gYHJlcV8ke3NlY3VyZVRva2VuKDEyKX1gO1xuICAgICAgY29uc3Qgb25SZXNwID0gKGU6IEV2ZW50KTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGRldGFpbCA9IChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWw7XG4gICAgICAgIGlmIChkZXRhaWw/Ll9fcmVxSWQgPT09IHJlcUlkKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICAgICAgcmVzb2x2ZShkZXRhaWwucmVwbHkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IHtfX3JlcUlkOiByZXFJZCwgLi4ucGcocGF5bG9hZCl9fSkpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApOyByZXNvbHZlKG51bGwpOyB9LCAxMDAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sICh0YWJzKSA9PiB7XG4gICAgICBpZiAoIXRhYnNbMF0/LmlkKSB7IHJlc29sdmUobnVsbCk7IHJldHVybjsgfVxuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgcGcocGF5bG9hZCksIChyOiBSKSA9PiByZXNvbHZlKHIpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGNvbnN0IHNlbmRUb0JnID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9CZyk6IFByb21pc2U8UiB8IG51bGw+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm4gbnVsbDtcbiAgICB0cnkgeyByZXR1cm4gKGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHBnKHBheWxvYWQpKSkgYXMgUjsgfVxuICAgIGNhdGNoIChlKSB7IHJldHVybiB7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IGFzIHVua25vd24gYXMgUjsgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBSZWNlaXZpbmcgZnJvbSBjb250ZW50IHNjcmlwdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRGVmZW5zaXZlIHJpbmctYnVmZmVyIGRlZHVwZTogZXZlbiB0aG91Z2ggd2Ugbm93IHVzZSBvbmx5IG9uZSBjaGFubmVsLFxuICAvLyBhbnkgbWVzc2FnZSB0aGF0IHNvbWVob3cgYXJyaXZlcyB0d2ljZSB3aXRoaW4gfjIgc2Vjb25kcyBpcyBpZ25vcmVkLlxuICBjb25zdCByZWNlbnRNaWRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBSRUNFTlRfTUlEX0NBUCA9IDY0O1xuICBjb25zdCBvbkNzTWVzc2FnZSA9IChtc2c6IFBnRW52ZWxvcGU8Q3NUb1BhbmVsPik6IHZvaWQgPT4ge1xuICAgIGlmICghbXNnIHx8IG1zZy5fX3BnICE9PSB0cnVlKSByZXR1cm47XG4gICAgaWYgKG1zZy5fX21pZCkge1xuICAgICAgaWYgKHJlY2VudE1pZHMuaW5jbHVkZXMobXNnLl9fbWlkKSkgcmV0dXJuO1xuICAgICAgcmVjZW50TWlkcy5wdXNoKG1zZy5fX21pZCk7XG4gICAgICBpZiAocmVjZW50TWlkcy5sZW5ndGggPiBSRUNFTlRfTUlEX0NBUCkgcmVjZW50TWlkcy5zaGlmdCgpO1xuICAgIH1cbiAgICBzd2l0Y2ggKG1zZy5raW5kKSB7XG4gICAgICBjYXNlICdjYXB0dXJlJzogb25DYXB0dXJlKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2hvdmVyJzogb25Ib3Zlcihtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnaG92ZXInfT4pOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlci1lbmQnOiBvbkhvdmVyRW5kKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BlbmRpbmctYWRkJzogb25QZW5kaW5nQWRkKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BlbmRpbmctY2xlYXInOiBvblBlbmRpbmdDbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdmZWVkYmFjay1hZGQnOiBvbkZlZWRiYWNrQWRkKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3ByZWZlcmVuY2UtY2hhbmdlJzogb25QcmVmZXJlbmNlQ2hhbmdlKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSd9Pik7IHJldHVybjtcbiAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25QcmVmZXJlbmNlQ2hhbmdlID0gKHtyZWFzb24sIHBhZ2V9OiB7cmVhc29uOiBzdHJpbmc7IHBhZ2U6IGFueX0pOiB2b2lkID0+IHtcbiAgICBsaXZlVGFiVXJsID0gcGFnZT8udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgbGl2ZVRhYlBhdGggPSBsaXZlVGFiVXJsID8gcGF0aE9mKGxpdmVUYWJVcmwpIDogbGl2ZVRhYlBhdGg7XG4gICAgLy8gUGFnZSByb3dzIGFyZSBjYXB0dXJlIGhlYWRlcnMsIG5vdCBhIHRhYi9wYWdlIHRlbGVtZXRyeSBmZWVkLiBUaGUgbmV4dFxuICAgIC8vIHNlbGVjdG9yIGNhcHR1cmUgZnJvbSB0aGlzIHBhZ2Ugd2lsbCBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0L3N0YXRlIGFuZFxuICAgIC8vIGluc2VydCBhIHBhZ2UgaGVhZGVyIG9ubHkgaWYgbmVlZGVkLlxuICAgIHNldFN0YXR1cyhgJHtyZWFzb259IGNoYW5nZWRgLCB7a2luZDogJ2luZm8nfSk7XG4gIH07XG5cbiAgY29uc3Qgb25GZWVkYmFja0FkZCA9ICh7c2VsZWN0b3IsIHRleHQsIHVybCwgcGFyZW50VWlkfToge3NlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9KTogdm9pZCA9PiB7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IGluIHByaW9yaXR5IG9yZGVyOlxuICAgIC8vICAgMS4gcGFyZW50VWlkIOKAlCB0aGUgY29udGVudCBzY3JpcHQgc3VwcGxpZWQgYSBzdGFibGUgdWlkICh0aGVcbiAgICAvLyAgICAgIHN0cm9uZ2VzdCBtYXRjaDsgc3Vydml2ZXMgc2VsZWN0b3IgY2hhbmdlcywgc2libGluZ1xuICAgIC8vICAgICAgY29sbGlzaW9ucywgbXVsdGlwbGUgY2FwdHVyZXMgb2YgdGhlIHNhbWUgZWxlbWVudCkuXG4gICAgLy8gICAyLiBzZWxlY3RvciArIHVybCDigJQgY29tcG9zaXRlIGtleTsgcHJldmVudHMgY3Jvc3MtcGFnZVxuICAgIC8vICAgICAgY29udGFtaW5hdGlvbiB3aGVuIHRoZSBzYW1lIHNlbGVjdG9yIGV4aXN0cyBvbiBtdWx0aXBsZSBVUkxzLlxuICAgIC8vICAgMy4gc2VsZWN0b3IgKyBsaXZlVGFiVXJsIOKAlCBmYWxsYmFjayB3aGVuIHRoZSBtZXNzYWdlIGRpZG4ndFxuICAgIC8vICAgICAgY2FycnkgYW4gZXhwbGljaXQgdXJsIChvbGRlciBjb250ZW50LXNjcmlwdCBtZXNzYWdlcykuXG4gICAgbGV0IGlkeCA9IC0xO1xuICAgIGlmIChwYXJlbnRVaWQpIHtcbiAgICAgIGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIG0uZW50cnkudWlkID09PSBwYXJlbnRVaWQpO1xuICAgIH1cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgY29uc3Qgd2FudFVybCA9IHVybCA/PyBsaXZlVGFiVXJsID8/IG51bGw7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+XG4gICAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJ1xuICAgICAgICAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvclxuICAgICAgICAmJiAoIXdhbnRVcmwgfHwgbS5lbnRyeS51cmwgPT09IHdhbnRVcmwpKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdvbkZlZWRiYWNrQWRkOiBubyBwYXJlbnQgZm91bmQnLCB7c2VsZWN0b3IsIHVybCwgcGFyZW50VWlkfSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgbG9zdCBpdHMgcGFyZW50IOKAlCBjaGVjayB0aGUgYWN0aXZlIGNhcHR1cmUnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgcGFyZW50TXNnID0gbWVzc2FnZXNbaWR4XSBhcyBTZWxlY3Rvck1lc3NhZ2U7XG4gICAgbGV0IGluc2VydEF0ID0gaWR4ICsgMTtcbiAgICB3aGlsZSAoaW5zZXJ0QXQgPCBtZXNzYWdlcy5sZW5ndGggJiYgbWVzc2FnZXNbaW5zZXJ0QXRdPy50eXBlID09PSAnZmVlZGJhY2snKSBpbnNlcnRBdCsrO1xuICAgIC8vIFN0YW1wIHBhcmVudFVpZCBvbiB0aGUgbmV3IGZlZWRiYWNrIHJvdyBzbyB0aGUgZXhwb3J0IGNhcnJpZXNcbiAgICAvLyB0aGUgRksgbGluayBleHBsaWNpdGx5IChub3QganVzdCBieSBjYXB0dXJlLWFkamFjZW5jeSkuXG4gICAgbWVzc2FnZXMuc3BsaWNlKGluc2VydEF0LCAwLCB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIHBhcmVudFVpZDogcGFyZW50TXNnLmVudHJ5LnVpZCxcbiAgICB9KTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdDb21tZW50IGFkZGVkIGZyb20gcGFnZScpO1xuICAgIC8vIEV2ZXJ5IGZlZWRiYWNrIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuIElmIHRoZSBwYXJlbnRcbiAgICAvLyBjYXB0dXJlIGRpZG4ndCBnZXQgb25lIChhdXRvU2NyZWVuc2hvdCBvZmYsIHNraXBTY3JlZW5zaG90SG9zdHNcbiAgICAvLyBoaXQsIG5ldHdvcmsgZ2xpdGNoKSwgcmUtZmlyZSBub3cuXG4gICAgaWYgKCFwYXJlbnRNc2cuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgdm9pZCBmaXJlRWxlbWVudFNob3QocGFyZW50TXNnKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25QZW5kaW5nQWRkID0gKHtlbnRyeX06IHtlbnRyeTogRW50cnl9KTogdm9pZCA9PiB7IHBlbmRpbmdNdWx0aS5wdXNoKGVudHJ5KTsgcmVuZGVyKCk7IH07XG4gIGNvbnN0IG9uUGVuZGluZ0NsZWFyID0gKCk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkgPSBbXTsgcmVuZGVyKCk7IH07XG5cbiAgY29uc3QgZmluZER1cGxpY2F0ZSA9IChzZWxlY3Rvcjogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFNlbGVjdG9yTWVzc2FnZSB8IHVuZGVmaW5lZCA9PlxuICAgIG1lc3NhZ2VzLmZpbmQoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PlxuICAgICAgbS50eXBlID09PSAnc2VsZWN0b3InICYmIG0uZW50cnkuc2VsZWN0b3IgPT09IHNlbGVjdG9yICYmICghdXJsIHx8IG0uZW50cnkudXJsID09PSB1cmwpKTtcblxuICAvLyBGaW5kIGFuIGV4aXN0aW5nIGNhcHR1cmUgZm9yIHRoZSBhY3RpdmUgdGFiICsgc2VsZWN0b3IuIENyb3NzLXBhZ2VcbiAgLy8gY29udGFtaW5hdGlvbiBwcmV2ZW50aW9uIChzZWUgdHlwZXMudHMgZmVlZGJhY2stYWRkIGRvY3N0cmluZyk6XG4gIC8vIGEgc2VsZWN0b3IgYWxvbmUgaXMgTk9UIGEgc3RhYmxlIGlkZW50aXR5IOKAlCBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWBcbiAgLy8gZXhpc3RzIG9uIGV2ZXJ5IHBhZ2U7IGBidXR0b25gIGlzIGV2ZXJ5d2hlcmUuIFN0cm9uZyBpZGVudGl0eSBpc1xuICAvLyAoc2VsZWN0b3IgKyB1cmwpLiBSZXR1cm5zIHRoZSBtb3N0IHJlY2VudCBtYXRjaCBzbyByZS1ob3ZlcmluZyBhblxuICAvLyBhbHJlYWR5LWNhcHR1cmVkIGVsZW1lbnQgcmVzb2x2ZXMgY29uc2lzdGVudGx5LlxuICBjb25zdCBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlID0gKHNlbGVjdG9yOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IGxpdmVUYWJVcmw7XG4gICAgLy8gV2FsayBiYWNrd2FyZHMgc28gdGhlIG1vc3QgcmVjZW50IG1hdGNoaW5nIGNhcHR1cmUgd2lucyB3aGVuIGFcbiAgICAvLyBzZWxlY3RvciBsZWdpdGltYXRlbHkgaGFzIG11bHRpcGxlIGNhcHR1cmVzIG9uIHRoZSBzYW1lIHBhZ2VcbiAgICAvLyAoZS5nLiwgdGhlIHVzZXIgcmUtY2FwdHVyZWQgdGhlIHNhbWUgZWxlbWVudCBhZnRlciBlZGl0cykuXG4gICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zZWxlY3RvciAhPT0gc2VsZWN0b3IpIGNvbnRpbnVlO1xuICAgICAgaWYgKHVybCAmJiBtLmVudHJ5LnVybCAhPT0gdXJsKSBjb250aW51ZTtcbiAgICAgIHJldHVybiBtO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIGNvbnN0IGNhbm9uaWNhbEVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICB0YWc6IGUudGFnLCBzZWxlY3RvcjogZS5zZWxlY3RvciwgdGV4dDogZS50ZXh0LCByb2xlOiBlLnJvbGUsXG4gICAgYXR0cnM6IGUuYXR0cnMsIGNsYXNzZXM6IGUuY2xhc3NlcyxcbiAgICByZWN0OiBlLnJlY3QsIG91dGVySFRNTDogZS5vdXRlckhUTUwsXG4gICAgc3R5bGVzOiBlLnN0eWxlcywgbWF0Y2hlZFJ1bGVzOiBlLm1hdGNoZWRSdWxlcyxcbiAgfSk7XG5cbiAgY29uc3Qgb25DYXB0dXJlID0gKHtlbnRyeSwgcGFnZSwgZ3JvdXBlZH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2NhcHR1cmUnfT4pOiB2b2lkID0+IHtcbiAgICBpZiAoIWVudHJ5IHx8ICFwYWdlKSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBsaXZlVGFiVXJsID0gcGFnZS51cmw7XG4gICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YocGFnZS51cmwpO1xuICAgIGlmIChncm91cGVkKSB7XG4gICAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgICBpZiAobT8udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgICBncm91cC5wdXNoKGVudHJ5KTtcbiAgICAgICAgICBtLmVudHJ5Lmdyb3VwID0gZ3JvdXA7XG4gICAgICAgICAgcGVyc2lzdCgpOyByZW5kZXIoKTsgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgICAvLyBGaXJlIGEgZ3JvdXAgc2hvdCB1c2luZyB0aGUgaGVhZCArIG1lbWJlcnMuIFRoZSBoZWFkJ3Mgc2VsZWN0b3JcbiAgICAgICAgICAvLyBpcyBtLmVudHJ5LnNlbGVjdG9yOyBtZW1iZXJzJyBzZWxlY3RvcnMgYXJlIGluIHRoZSBmcmVzaGx5XG4gICAgICAgICAgLy8gbXV0YXRlZCBncm91cCBhcnJheS5cbiAgICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbbS5lbnRyeS5zZWxlY3RvciwgLi4uKG0uZW50cnkuZ3JvdXAgPz8gW10pLm1hcCgoZykgPT4gZy5zZWxlY3RvcildO1xuICAgICAgICAgIHZvaWQgZmlyZUdyb3VwU2hvdChtLCBzZWxlY3RvcnMpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBEdXBlIGRldGVjdGlvbi4gQ3Jvc3MtY29udGFtaW5hdGlvbiBmaXg6IGEgKHNlbGVjdG9yLCB1cmwpIG1hdGNoXG4gICAgLy8gaXMgTkVDRVNTQVJZIGJ1dCBub3QgU1VGRklDSUVOVCDigJQgdHdvIHNpYmxpbmcgZWxlbWVudHMgd2l0aCB0aGVcbiAgICAvLyBzYW1lIHRlc3RJZCAvIHNhbWUgcm9sZS9hcmlhIHNlbGVjdG9yIGxpdmUgb24gdGhlIHNhbWUgVVJMIGJ1dFxuICAgIC8vIGFyZSBkaWZmZXJlbnQgY2FwdHVyZXMuIENvbXBhcmUgdGhlIGNhbm9uaWNhbC1lbnRyeSBoYXNoICh3aGljaFxuICAgIC8vIGluY2x1ZGVzIHJlY3QsIHRleHQsIG91dGVySFRNTCwgZXRjLikgYmVmb3JlIHRyZWF0aW5nIHRoZSBuZXdcbiAgICAvLyBjYXB0dXJlIGFzIGEgcmVmcmVzaCBvZiB0aGUgb2xkIG9uZS4gV2hlbiB0aGUgaGFzaCBkaWZmZXJzLCB3ZVxuICAgIC8vIGtlZXAgQk9USCBjYXB0dXJlcyByYXRoZXIgdGhhbiBvdmVyd3JpdGluZy5cbiAgICBjb25zdCBkdXBlID0gZmluZER1cGxpY2F0ZShlbnRyeS5zZWxlY3RvciwgZW50cnkudXJsKTtcbiAgICBpZiAoZHVwZSkge1xuICAgICAgY29uc3QgYmVmb3JlID0gY2Fub25pY2FsRW50cnkoZHVwZS5lbnRyeSk7XG4gICAgICBjb25zdCBhZnRlciA9IGNhbm9uaWNhbEVudHJ5KGVudHJ5KTtcbiAgICAgIGlmIChiZWZvcmUgPT09IGFmdGVyKSB7XG4gICAgICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIEhhc2hlcyBkaWZmZXIuIFR3byBjYXNlczpcbiAgICAgIC8vICAgKGEpIFNhbWUgZWxlbWVudCByZS1jYXB0dXJlZCBhZnRlciBjb250ZW50IGNoYW5nZSDigJQgdGhlIHJlY3RcbiAgICAgIC8vICAgICAgIHN0YXlzIHB1dCAod2l0aGluIGEgZmV3IHB4KSwgYnV0IHRleHQvb3V0ZXJIVE1MIG1vdmVkLlxuICAgICAgLy8gICAgICAgVHJlYXQgYXMgYSByZWZyZXNoLlxuICAgICAgLy8gICAoYikgRGlmZmVyZW50IGVsZW1lbnQgdGhhdCBoYXBwZW5zIHRvIHNoYXJlIGEgc2VsZWN0b3Ig4oCUIHRoZVxuICAgICAgLy8gICAgICAgcmVjdCBpcyBpbiBhIGRpZmZlcmVudCBwb3NpdGlvbi4gVHJlYXQgYXMgYSBuZXcgY2FwdHVyZS5cbiAgICAgIC8vIFdlIGRpc2NyaW1pbmF0ZSBieSByZWN0IG92ZXJsYXA6IGlmIGJvdGggcmVjdHMgZXhpc3QgYW5kIHRoZWlyXG4gICAgICAvLyBjZW50ZXJzIGFyZSB3aXRoaW4gOHB4IG9uIGJvdGggYXhlcywgcmVmcmVzaDsgb3RoZXJ3aXNlIGtlZXBcbiAgICAgIC8vIGJvdGguXG4gICAgICBjb25zdCByMSA9IGR1cGUuZW50cnkucmVjdDtcbiAgICAgIGNvbnN0IHIyID0gZW50cnkucmVjdDtcbiAgICAgIGNvbnN0IHNhbWVFbGVtZW50ID0gcjEgJiYgcjJcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnggKyByMS53IC8gMikgLSAocjIueCArIHIyLncgLyAyKSkgPD0gOFxuICAgICAgICAmJiBNYXRoLmFicygocjEueSArIHIxLmggLyAyKSAtIChyMi55ICsgcjIuaCAvIDIpKSA8PSA4O1xuICAgICAgaWYgKHNhbWVFbGVtZW50KSB7XG4gICAgICAgIGRlbGV0ZSBkdXBlLmR1cGVQZW5kaW5nO1xuICAgICAgICBkdXBlLmVudHJ5ID0gZW50cnk7XG4gICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cyhgVXBkYXRlZCAjJHtkdXBlLmVudHJ5Lm59YCwge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBEaWZmZXJlbnQgZWxlbWVudCB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIOKGkiBmYWxsIHRocm91Z2ggYW5kXG4gICAgICAvLyBlbWl0IGFzIGEgbmV3IGNhcHR1cmUuIFRoZSBhZ2VudCByZWFkaW5nIHRoZSBleHBvcnQgc2VlcyBib3RoXG4gICAgICAvLyByb3dzIHdpdGggdGhlIHNhbWUgc2VsZWN0b3IgYnV0IGRpZmZlcmVudCB1aWRzICsgcmVjdHMuXG4gICAgfVxuICAgIGxldCBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIHBvc2l0aW9uID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBpbnNlcnRCZWZvcmUuY3VycmVudCk7XG4gICAgICBpZiAocG9zaXRpb24gPCAwKSBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFN0YW1wIHRoZSBzZXNzaW9uIEZLIHNvIHRoZSBjb25zdW1lciBjYW4gam9pbiBlbnRyaWVzIHRvIHRoZWlyXG4gICAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuXG4gICAgaWYgKHNlc3Npb25JZCkgZW50cnkuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgIGNvbnN0IG5ld01zZzogU2VsZWN0b3JNZXNzYWdlID0ge3R5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogZW50cnkudHMsIGVudHJ5fTtcbiAgICAvLyBQYWdlIHJvd3MgZXhpc3Qgb25seSBhcyBoZWFkZXJzIGZvciBjYXB0dXJlZCBzZWxlY3RvcnMuIERvIG5vdCBjcmVhdGVcbiAgICAvLyB0aGVtIGZyb20gdGFiIGFjdGl2YXRpb24sIHZhbGlkYXRpb24sIG9yIHByZWZlcmVuY2UgY2hhbmdlczsgaW5zZXJ0IG9uZVxuICAgIC8vIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZmlyc3Qgc2VsZWN0b3Igb2YgYSBuZXcgcGFnZSBibG9jay5cbiAgICBsZXQgcHJldmlvdXNQYWdlOiBQYWdlTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSBwb3NpdGlvbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3BhZ2UnKSB7IHByZXZpb3VzUGFnZSA9IG07IGJyZWFrOyB9XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnJlYWs7XG4gICAgfVxuICAgIGlmICghcHJldmlvdXNQYWdlIHx8IHByZXZpb3VzUGFnZS51cmwgIT09IHBhZ2UudXJsKSB7XG4gICAgICBjb25zdCBwYWdlTXNnOiBQYWdlTWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ3BhZ2UnLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgdXJsOiBwYWdlLnVybCwgdGl0bGU6IHBhZ2UudGl0bGUsIHZpZXdwb3J0OiBwYWdlLnZpZXdwb3J0LCB0b2tlbnM6IHBhZ2UudG9rZW5zLFxuICAgICAgICB1c2VyQWdlbnQ6IHBhZ2UudXNlckFnZW50LCBsYW5nOiBwYWdlLmxhbmcsXG4gICAgICAgIGdpdENvbnRleHQ6IChwYWdlIGFzIGFueSkuZ2l0Q29udGV4dCxcbiAgICAgICAgcm91dGU6IChwYWdlIGFzIGFueSkucm91dGUsXG4gICAgICAgIHN0YXRlOiAocGFnZSBhcyBhbnkpLnN0YXRlLFxuICAgICAgICBzZXNzaW9uSWQsXG4gICAgICB9O1xuICAgICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBwYWdlTXNnKTtcbiAgICAgIHBvc2l0aW9uKys7XG4gICAgfVxuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgbmV3TXNnKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgLy8gSW50ZW50aW9uYWxseSBOTyBzZXRMYXN0QWN0aXZlKGVudHJ5LnNlbGVjdG9yKSBoZXJlIOKAlCB0aGUgdXNlciBhc2tlZFxuICAgIC8vIGZvciBmcmVzaCBjYXB0dXJlcyB0byBzdGF5IHVuLWhpZ2hsaWdodGVkIGluIHRoZSBzaWRlYmFyLiBUaGUgc3RpY2t5XG4gICAgLy8gcmluZyArIGxhc3QtYWN0aXZlIG91dGxpbmUgbm93IG9ubHkgZ2V0IGFwcGxpZWQgb24gZXhwbGljaXRcbiAgICAvLyBob3Zlci9jbGljayBvZiB0aGUgc2lkZWJhciBidWJibGUgKGFuZCB0aGUgcGFnZS1zaWRlIGZsYXNoIGZyb21cbiAgICAvLyBjYXB0dXJlRW50cnkgc3RpbGwgY29uZmlybXMgdGhlIGNhcHR1cmUgdmlzdWFsbHkgb24gdGhlIHBhZ2UpLlxuICAgIHJlbmRlcigpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgdm9pZCBmaXJlRWxlbWVudFNob3QobmV3TXNnKTtcbiAgICB2b2lkIGZpcmVQYWdlU2hvdElmTmVlZGVkKG5ld01zZyk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNjcmVlbnNob3Qgd2lyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBGaXJlIHRoZSBwZXItZWxlbWVudCBzaG90LCBhdHRhY2ggdGhlIHJldHVybmVkIGZpbGVuYW1lICsgZGF0YVVybCBvbnRvXG4gIC8vIHRoZSBlbnRyeSwgYW5kIHBlcnNpc3QuIHNob3VsZFNraXBTY3JlZW5zaG90IGJhaWxzIG9uIGhvc3RzIGluIHRoZVxuICAvLyB1c2VyJ3Mgc2tpcCBsaXN0OyBhdXRvU2NyZWVuc2hvdD1mYWxzZSBiYWlscyBnbG9iYWxseS5cbiAgY29uc3QgZmlyZUVsZW1lbnRTaG90ID0gYXN5bmMgKG1zZzogU2VsZWN0b3JNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGF1dG9TY3JlZW5zaG90PWZhbHNlJyk7XG4gICAgICAvLyBCdWcgIzI6IHRlbGwgdGhlIGV4cG9ydCB3aHkgdGhlIHNob3QgaXMgbWlzc2luZy5cbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnYXV0b1NjcmVlbnNob3RPZmYnfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogaG9zdCBvbiBza2lwIGxpc3QnLCBtc2cuZW50cnkudXJsKTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnc2tpcFNjcmVlbnNob3RIb3N0cyd9O1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qg4oaSJywgbXNnLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAvLyBTVyBjb2xkLXN0YXJ0IHJhY2U6IHRoZSBGSVJTVCBjYXB0dXJlIGluIGEgc2Vzc2lvbiBvZnRlbiBsb3NlcyBpdHNcbiAgICAvLyBmaXJzdCBtZXNzYWdlIGJlY2F1c2UgdGhlIGJnIHdvcmtlciBpcyBzdGlsbCBzdGFydGluZy4gUmV0cnkgb25jZVxuICAgIC8vIGFmdGVyIGEgc2hvcnQgZGVsYXkgaWYgdGhlIGZpcnN0IGNhbGwgY29tZXMgYmFjayBudWxsL2VtcHR5LlxuICAgIGxldCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHkgfHwgKCFyZXBseS5vayAmJiAhcmVwbHkuZXJyb3IpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJzdCBzY3JlZW5zaG90IHJlcGx5IHdhcyBlbXB0eTsgcmV0cnlpbmcgYWZ0ZXIgMjAwbXMgKFNXIGNvbGQtc3RhcnQpJyk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAyMDApKTtcbiAgICAgIHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3QgcmVwbHk6JywgcmVwbHkpO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkge1xuICAgICAgc2V0U3RhdHVzKGBTY3JlZW5zaG90IGZhaWxlZDogJHtyZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCd9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgIHVuYXZhaWxhYmxlUmVhc29uOiByZXBseT8uZXJyb3IgPz8gJ2NhcHR1cmVGYWlsZWQnLFxuICAgICAgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gU3VjY2Vzc2Z1bCByZXRyeSDigJQgc3RyaXAgYW55IHByaW9yIHVuYXZhaWxhYmxlUmVhc29uIHNpbmNlIHdlIG5vd1xuICAgIC8vIGhhdmUgYSByZWFsIHNob3QuXG4gICAgZGVsZXRlIG1zZy5lbnRyeS5zY3JlZW5zaG90Py51bmF2YWlsYWJsZVJlYXNvbjtcbiAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICBlbGVtZW50OiByZXBseS5maWxlbmFtZSxcbiAgICAgIGNhcHR1cmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIC4uLihyZXBseS5jcm9wID8ge2Nyb3A6IHJlcGx5LmNyb3B9IDoge30pLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChtc2cuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmRhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzKCk7XG4gICAgfVxuICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkge1xuICAgICAgc2hvdHNGdWxsLnNldChtc2cuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIEZpcmUgdGhlIGdyb3VwIHNob3QgKHVuaW9uIGJib3ggb2YgaGVhZCArIGFsbCBtZW1iZXJzKSBhbmQgc3Rhc2ggdGhlXG4gIC8vIGZpbGVuYW1lIG9uIHRoZSBoZWFkLW9mLWdyb3VwIGVudHJ5LlxuICBjb25zdCBmaXJlR3JvdXBTaG90ID0gYXN5bmMgKGhlYWQ6IFNlbGVjdG9yTWVzc2FnZSwgc2VsZWN0b3JzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QoaGVhZC5lbnRyeS51cmwpKSByZXR1cm47XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWdyb3VwJywgc2VsZWN0b3JzLCBuOiBoZWFkLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgaGVhZC5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgLi4uKGhlYWQuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICBncm91cDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfTtcbiAgICBpZiAocmVwbHkuZGF0YVVybCkge1xuICAgICAgc2hvdHMuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmRhdGFVcmwpO1xuICAgICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7IHNob3RzRnVsbC5zZXQoaGVhZC5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZnVsbERhdGFVcmwpOyBwZXJzaXN0U2hvdHNGdWxsKCk7IH1cbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gUGFnZS1sZXZlbCBzaG90IG9uY2UgcGVyICh3b3Jrc3BhY2UsIHBhZ2UtdXJsLCBkYXkpLiBTdWJzZXF1ZW50IGNhcHR1cmVzXG4gIC8vIG9uIHRoZSBzYW1lIHBhZ2UgcmV1c2UgdGhlIHNhbWUgb24tZGlzayBmaWxlIHBhdGguXG4gIGNvbnN0IGZpcmVQYWdlU2hvdElmTmVlZGVkID0gYXN5bmMgKG1zZzogU2VsZWN0b3JNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkgcmV0dXJuO1xuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIC8vIFBlci1jYXB0dXJlIHBhZ2Utc2hvdCBtb2RlICjCpzQuNSk6IHdoZW4gZW5hYmxlZCwgc2tpcCB0aGVcbiAgICAvLyBwZXItKHdvcmtzcGFjZSwgdXJsKSBkZWR1cGUgYW5kIGZpcmUgYSBmcmVzaCBwYWdlIHNob3QgZXZlcnkgdGltZS5cbiAgICAvLyBVc2VmdWwgd2hlbiB0aGUgcGFnZSBzdGF0ZSBjaGFuZ2VzIGJldHdlZW4gY2FwdHVyZXMgKG1vZGFsIG9wZW5zLFxuICAgIC8vIG11bHRpLXN0ZXAgZmxvdywgZXRjLikgYW5kIHRoZSB1c2VyIHdhbnRzIHRvIHNlZSB0aGUgd2hvbGUgcGFnZSBhdFxuICAgIC8vIGVhY2ggc3RlcC4gQ29zdHMgb25lIGZ1bGwtcGFnZSBQTkcgcGVyIGNhcHR1cmUsIHNvIGRlZmF1bHQgb2ZmLlxuICAgIGlmICghcHJlZnMucGFnZVNob3RQZXJDYXB0dXJlKSB7XG4gICAgICBjb25zdCBrZXkgPSBwYWdlU2hvdEtleShtc2cuZW50cnkudXJsKTtcbiAgICAgIGlmIChwYWdlU2hvdHNGaXJlZC5oYXMoa2V5KSkge1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IGZpbmRFeGlzdGluZ1BhZ2VTaG90KG1zZy5lbnRyeS51cmwpO1xuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgICAgICBwYWdlOiBleGlzdGluZyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwYWdlU2hvdHNGaXJlZC5hZGQoa2V5KTtcbiAgICB9XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LXBhZ2UnLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHJldHVybjtcbiAgICAvLyBBcHBseSB0byBUSElTIGVudHJ5IGFuZCB0byBhbnkgb3RoZXIgZW50cmllcyBhbHJlYWR5IGNhcHR1cmVkIG9uIHRoZVxuICAgIC8vIHNhbWUgVVJMIHRvZGF5IChzbyB0aGUgcGFnZS1zaG90IGFwcGVhcnMgdW5pZm9ybWx5KS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSBtc2cuZW50cnkudXJsKSBjb250aW51ZTtcbiAgICAgIG0uZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgLi4uKG0uZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgIHBhZ2U6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gU3Rhc2ggdGhlIGZ1bGwgUE5HIHNvIHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBjYW4gYnVuZGxlIGl0LiBLZXllZFxuICAgIC8vIGJ5IFVSTCBzaW5jZSBwYWdlIHNob3RzIGFyZSBwYWdlLXNjb3BlZCwgbm90IHNlbGVjdG9yLXNjb3BlZC5cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQoJ3BhZ2U6OicgKyBtc2cuZW50cnkudXJsLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaW5kIGFueSBzZWxlY3RvciBlbnRyeSBvbiB0aGlzIFVSTCB0aGF0IGFscmVhZHkgaGFzIGEgYHBhZ2VgIHNob3RcbiAgLy8gcmVjb3JkZWQg4oCUIHVzZWQgc28gdGhhdCByZXRyb2FjdGl2ZSBjYXB0dXJlcyBpbmhlcml0IHRoZSBleGlzdGluZyBQTkdcbiAgLy8gcGF0aCBpbnN0ZWFkIG9mIHJlZmlyaW5nLlxuICBjb25zdCBmaW5kRXhpc3RpbmdQYWdlU2hvdCA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlKSByZXR1cm4gbS5lbnRyeS5zY3JlZW5zaG90LnBhZ2U7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGNvbnN0IG9uSG92ZXIgPSAoe3NlbGVjdG9yLCBsYWJlbCwgdGFnLCByZWN0fTogRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnaG92ZXInfT4pOiB2b2lkID0+IHtcbiAgICBzZXRTdGF0dXMoYEFsdC1ob3ZlciDCtyAke2xhYmVsfWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAvLyBJZGVudGl0eSBpcyAoc2VsZWN0b3IsIHVybCkuIFNhbWUgc2VsZWN0b3Igb24gdHdvIGRpZmZlcmVudCBVUkxzXG4gICAgLy8gaXMgdHdvIGRpZmZlcmVudCBjYXB0dXJlczsgdGhlIHByZXZpb3VzIHNlbGVjdG9yLW9ubHkgbG9va3VwXG4gICAgLy8gY2F1c2VkIGNyb3NzLXBhZ2UgY29tbWVudCBjb250YW1pbmF0aW9uLiBQcmVmZXIgc2FtZS1VUkwgK1xuICAgIC8vIHNhbWUtc2VsZWN0b3IgYXMgdGhlIHN0cm9uZ2VzdCBtYXRjaC5cbiAgICBjb25zdCBleGlzdGluZyA9IGZpbmRDYXB0dXJlRm9yQ3VycmVudFBhZ2Uoc2VsZWN0b3IpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhleGlzdGluZy5pZCk7XG4gICAgICBjb25zdCBmZWVkYmFjayA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKGV4aXN0aW5nLmlkKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHt1aWQ6IGV4aXN0aW5nLmVudHJ5LnVpZCwgbjogZXhpc3RpbmcuZW50cnkubiwgY2FwdHVyZWQ6IHRydWUsIGZlZWRiYWNrfX0pO1xuICAgICAgaWYgKHBoYW50b21UYXJnZXQpIHsgcGhhbnRvbVRhcmdldCA9IG51bGw7IHJlbmRlcigpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFMV0FZUyBzaG93IHRoZSBjb21tZW50IGJveCwgZXZlbiBmb3IgdW5jYXB0dXJlZCBlbGVtZW50cy4gT24gc3VibWl0XG4gICAgICAvLyB0aGUgY29udGVudCBzY3JpcHQgd2lsbCBjYXB0dXJlIHRoZSBlbGVtZW50IGZpcnN0LCB0aGVuIGF0dGFjaCB0aGVcbiAgICAgIC8vIGNvbW1lbnQg4oCUIHR1cm5pbmcgaG92ZXItY29tbWVudCBpbnRvIGEgY2FwdHVyZStjb21tZW50IHNob3J0Y3V0LlxuICAgICAgcGhhbnRvbVRhcmdldCA9IHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdDogcmVjdCBhcyB1bmtub3duIGFzIERPTVJlY3R9O1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24nLCBzZWxlY3RvciwgcGF5bG9hZDoge2NhcHR1cmVkOiBmYWxzZSwgZmVlZGJhY2s6IFtdfX0pO1xuICAgICAgcmVuZGVyUGhhbnRvbSgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25Ib3ZlckVuZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoc3RhdHVzLnRleHRDb250ZW50Py5zdGFydHNXaXRoKCdBbHQtaG92ZXInKSkgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7XG4gICAgaWYgKHBoYW50b21UYXJnZXQpIHsgcGhhbnRvbVRhcmdldCA9IG51bGw7IHJlbmRlclBoYW50b20oKTsgfVxuICAgIC8vIE5vIGFubm90YXRpb24tY2xlYXIgaGVyZSDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IGtlZXBzIHRoZSBib3ggb3BlbiBzbyB0aGVcbiAgICAvLyB1c2VyIGNhbiBtb3VzZSB0byBpdCBhbmQgdHlwZS4gT3V0c2lkZS1jbGljayAvIEVzYyBkaXNtaXNzIGl0LlxuICB9O1xuXG4gIGNvbnN0IGNvbGxlY3RGZWVkYmFja0FmdGVyID0gKHNlbGVjdG9ySWQ6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAoIWZvdW5kKSB7IGlmIChtLmlkID09PSBzZWxlY3RvcklkKSBmb3VuZCA9IHRydWU7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InIHx8IG0udHlwZSA9PT0gJ3BhZ2UnKSBicmVhaztcbiAgICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIG91dC5wdXNoKG0udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgY29uc3Qgc2Nyb2xsTWVzc2FnZUludG9WaWV3ID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBlbCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgZWwuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInfSk7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gtaW50by12aWV3Jyk7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdmbGFzaC1pbnRvLXZpZXcnKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RpY2t5IGhpZ2hsaWdodCBtYW5hZ2VtZW50IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZXRMYXN0QWN0aXZlID0gKHNlbGVjdG9yOiBzdHJpbmcgfCBudWxsKTogdm9pZCA9PiB7XG4gICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3Rvciwgc3RpY2t5OiB0cnVlfSk7XG4gICAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGFybVN0aWNreUV4cGlyeSA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhclRpbWVvdXQoc3RpY2t5VGltZXIpO1xuICAgIHN0aWNreVRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCFwYW5lbEhvdmVyZWQpIHtcbiAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICAgICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3IubGFzdC1hY3RpdmUnKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnbGFzdC1hY3RpdmUnKTtcbiAgICAgIH0gZWxzZSBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9LCBTVElDS1lfVFRMX01TKTtcbiAgfTtcblxuICAvLyBGYXN0IHN0aWNreS1jbGVhcjogd2hlbiB0aGUgdXNlcidzIGN1cnNvciBsZWF2ZXMgdGhlIHBhbmVsLCBmaXJlXG4gIC8vIHN0aWNreS1jbGVhciBhZnRlciBhIDMwMCBtcyBncmFjZSB3aW5kb3cuIFByaW9yIGJlaGF2aW9yIHdhaXRlZCB0aGVcbiAgLy8gZnVsbCBTVElDS1lfVFRMX01TICh+NSBzKSB3aGljaCBmZWx0IGxpa2UgdGhlIHBhZ2Utc2lkZSBoaWdobGlnaHRcbiAgLy8gXCJkb2Vzbid0IGdvIGF3YXkgZXZlbiBhZnRlciBJIHVuaG92ZXJcIi4gMzAwIG1zIGlzIHNob3J0IGVub3VnaCB0b1xuICAvLyBmZWVsIHJlc3BvbnNpdmUgYnV0IGxvbmcgZW5vdWdoIHRoYXQgYSBxdWljayByZXBvc2l0aW9uIChlLmcuXG4gIC8vIGFjY2lkZW50YWxseSBjcm9zc2luZyB0aGUgc2VhbSkgZG9lc24ndCBraWxsIHRoZSByaW5nIG1pZC1mbGlnaHQuXG4gIGxldCBzdGlja3lDbGVhckdyYWNlID0gMDtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIHBhbmVsSG92ZXJlZCA9IHRydWU7XG4gICAgaWYgKHN0aWNreUNsZWFyR3JhY2UpIHsgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpOyBzdGlja3lDbGVhckdyYWNlID0gMDsgfVxuICAgIGFybVN0aWNreUV4cGlyeSgpO1xuICB9KTtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgIHBhbmVsSG92ZXJlZCA9IGZhbHNlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSBjbGVhclRpbWVvdXQoc3RpY2t5Q2xlYXJHcmFjZSk7XG4gICAgc3RpY2t5Q2xlYXJHcmFjZSA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAvLyBBbHNvIGRyb3Agb3VyIG93biBmcm9tLXBhbmVsICsgbXVsdGkgcmluZ3MgaW4gY2FzZSB0aGV5IGxlYWtlZC5cbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gICAgfSwgMzAwKTtcbiAgfSk7XG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAvLyBXaGVuIHRoZSB1c2VyIG1vdmVzIHRoZWlyIG1vdXNlIGludG8gdGhlIHBhbmVsLCBzdXBwcmVzcyBwYWdlLXNpZGVcbiAgICAvLyBhbHQtaG92ZXIgc3RhdGUgc28gdGhlIG9yYW5nZSByaW5nIGRvZXNuJ3Qga2VlcCBmb2xsb3dpbmcgdGhlIGN1cnNvci5cbiAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IGZhbHNlfSk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBSZW5kZXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IE5FQVJfQk9UVE9NX1BYID0gODA7XG4gIGNvbnN0IHdhc05lYXJCb3R0b20gPSAoKTogYm9vbGVhbiA9PlxuICAgIGxpc3Quc2Nyb2xsSGVpZ2h0IC0gbGlzdC5zY3JvbGxUb3AgLSBsaXN0LmNsaWVudEhlaWdodCA8PSBORUFSX0JPVFRPTV9QWDtcblxuICBjb25zdCBtYXRjaGVzU2VhcmNoID0gKG06IFBhbmVsTWVzc2FnZSk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHEgPSBzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiBtLnRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIC8vIE1hdGNoIGFnYWluc3QgdGhlIFdIT0xFIGVudHJ5IChzZWxlY3RvciwgdGV4dCwgY2xhc3NlcywgYXR0cnMsXG4gICAgICAvLyBvdXRlckhUTUwsIHN0eWxlcywgZXRjLikgc28gc2VhcmNoIGhpdHMgYW55dGhpbmcgdmlzaWJsZSBpbiB0aGVcbiAgICAgIC8vIGJvZHktanNvbi4gU3RyaW5naWZ5aW5nIG9uY2UgaXMgZmluZSDigJQgdGhlIGNvc3QgaXMgdGlueSB2cyByZW5kZXIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICB9XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gKG0udXJsICsgJyAnICsgKG0udGl0bGUgPz8gJycpKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICAvLyBUcnVlIHdoZW4gdGhlIGJ1YmJsZSdzIGJvZHktanNvbiAob3Igb3V0ZXJIVE1MKSBjb250YWlucyB0aGUgc2VhcmNoIOKAlFxuICAvLyB0ZWxscyByZW5kZXJTZWxlY3RvciB0byBhdXRvLWV4cGFuZCBzbyB0aGUgdXNlciBzZWVzIHRoZSBoaWdobGlnaHRlZCBoaXQuXG4gIGNvbnN0IGJvZHlNYXRjaGVzU2VhcmNoID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobS5lbnRyeSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgfTtcblxuICBjb25zdCBpbnNlcnRSYWlsID0gKGJlZm9yZUlkOiBzdHJpbmcpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdpbnNlcnQtcmFpbCc7XG4gICAgZGl2LmRhdGFzZXQuYmVmb3JlSWQgPSBiZWZvcmVJZDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPT09IGJlZm9yZUlkKSB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcbiAgICAgIGRpdi5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlOyByZW5kZXIoKTsgfSxcbiAgICAgICAgb25TdWJtaXQ6ICh0ZXh0KSA9PiBzZW5kSW5saW5lKHRleHQpLFxuICAgICAgICBhdXRvZm9jdXM6IHRydWUsXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgYnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGJ0bi5jbGFzc05hbWUgPSAnYWRkLWJ0bic7XG4gICAgICBidG4uZGF0YXNldC50aXAgPSAnSW5zZXJ0IGNhcHR1cmUgb3IgY29tbWVudCBoZXJlJztcbiAgICAgIGJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3BsdXMnLCAxMik7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7IGluc2VydEJlZm9yZS5jb21tZW50ID0gdHJ1ZTsgcmVuZGVyKCk7IH0pO1xuICAgICAgZGl2LmFwcGVuZChidG4pO1xuICAgIH1cbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIHR5cGUgSW5saW5lQ29tbWVudE9wdHMgPSB7XG4gICAgaW5pdGlhbD86IHN0cmluZztcbiAgICBvbkNhbmNlbD86ICgpID0+IHZvaWQ7XG4gICAgb25TdWJtaXQ/OiAodGV4dDogc3RyaW5nKSA9PiB2b2lkO1xuICAgIGF1dG9mb2N1cz86IGJvb2xlYW47XG4gIH07XG4gIGNvbnN0IGJ1aWxkSW5saW5lQ29tbWVudCA9ICh7aW5pdGlhbCA9ICcnLCBvbkNhbmNlbCwgb25TdWJtaXQsIGF1dG9mb2N1c306IElubGluZUNvbW1lbnRPcHRzKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLmNsYXNzTmFtZSA9ICdpbmxpbmUtY29tbWVudCc7XG4gICAgY29uc3QgdGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIHRhLnZhbHVlID0gaW5pdGlhbDtcbiAgICB0YS5yb3dzID0gMjtcbiAgICB0YS5wbGFjZWhvbGRlciA9ICdJbnNlcnQgYSBjb21tZW50IGhlcmUsIG9yIEFsdCtDbGljayB0byBpbnNlcnQgYSBjYXB0dXJlJztcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3Jvdyc7XG4gICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBtZXRhLmNsYXNzTmFtZSA9ICdtZXRhJztcbiAgICBtZXRhLnRleHRDb250ZW50ID0gJzB3IMK3IDB0JztcbiAgICAvLyBCb3RoIFNhdmUgLyBDYW5jZWwgYXJlIHVuaWZvcm0gaWNvbiBidXR0b25zICguaWNvbmJ0bikuIFNhdmUgdXNlcyB0aGVcbiAgICAvLyBwcmltYXJ5IGFjY2VudCB2YXJpYW50IHZpYSAucHJpbWFyeSBzbyBpdCBzdGlsbCBwb3BzLCBidXQgaXRzIHdpZHRoXG4gICAgLy8gbWF0Y2hlcyBDYW5jZWwgZXhhY3RseS5cbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0bic7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCDCtyBFc2MnO1xuICAgIGNhbmNlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAyMCk7XG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gb25DYW5jZWw/LigpKTtcbiAgICBjb25zdCBzZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2VuZC50eXBlID0gJ2J1dHRvbic7XG4gICAgc2VuZC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwcmltYXJ5JztcbiAgICBzZW5kLmRhdGFzZXQudGlwID0gJ1NhdmUgwrcgRW50ZXInO1xuICAgIHNlbmQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGVjaycsIDIwKTtcbiAgICBjb25zdCBzdWJtaXQgPSAoKTogdm9pZCA9PiBvblN1Ym1pdD8uKHRhLnZhbHVlKTtcbiAgICBzZW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3VibWl0KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHsgbWV0YS50ZXh0Q29udGVudCA9IGAke3dvcmRDb3VudCh0YS52YWx1ZSl9dyDCtyAke3Rva2VuQ291bnQodGEudmFsdWUpfXRgOyB9KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXQoKTsgfVxuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgb25DYW5jZWw/LigpO1xuICAgIH0pO1xuICAgIHJvdy5hcHBlbmQobWV0YSwgY2FuY2VsLCBzZW5kKTtcbiAgICB3cmFwLmFwcGVuZCh0YSwgcm93KTtcbiAgICBpZiAoYXV0b2ZvY3VzKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGEuZm9jdXMoKSk7XG4gICAgcmV0dXJuIHdyYXA7XG4gIH07XG5cbiAgY29uc3Qgc2VuZElubGluZSA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB0ZXh0ID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCBiZWZvcmVJZCA9IGluc2VydEJlZm9yZS5jdXJyZW50O1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxldCBwb3MgPSBiZWZvcmVJZCA/IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gYmVmb3JlSWQpIDogbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChwb3MgPCAwKSBwb3MgPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgLy8gcGFyZW50VWlkIHJlc29sdXRpb246IHdhbGsgYmFjayBmcm9tIHRoZSBpbnNlcnQgcG9zaXRpb24gdG8gdGhlXG4gICAgLy8gbmVhcmVzdCBwcmVjZWRpbmcgc2VsZWN0b3IuIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHRoZSBGSy5cbiAgICBsZXQgcElkeCA9IHBvcyAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgLi4uKHBhcmVudFVpZCA/IHtwYXJlbnRVaWR9IDoge30pLFxuICAgIH07XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvcywgMCwgZmIpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0luc2VydGVkJyk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGhhbnRvbSA9ICgpOiB2b2lkID0+IHtcbiAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoJy5waGFudG9tJyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGhhbnRvbVRhcmdldCkgcmV0dXJuO1xuICAgIGNvbnN0IHBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGguY2xhc3NOYW1lID0gJ3BoYW50b20gdmlzaWJsZSc7XG4gICAgcGguaW5uZXJIVE1MID0gYDxjb2RlPiR7ZXNjYXBlSHRtbChwaGFudG9tVGFyZ2V0LmxhYmVsKX08L2NvZGU+YDtcbiAgICBsaXN0LmFwcGVuZChwaCk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgbGlzdC5zY3JvbGxUb3AgPSBsaXN0LnNjcm9sbEhlaWdodDsgfSk7XG4gIH07XG5cbiAgLy8gUmVvcmRlciBhIGZsYXQgbWVzc2FnZSBsaXN0IHNvIHNlbGVjdG9ycyB3aXRoaW4gZWFjaCBwYWdlLWRlbGltaXRlZFxuICAvLyBibG9jayBhcmUgc29ydGVkIGJ5IHRoZWlyIHZpc3VhbCByZWN0ICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkuXG4gIC8vIEZlZWRiYWNrIHJvd3Mgc3RheSBhdHRhY2hlZCB0byB0aGVpciBwcmVjZWRpbmcgc2VsZWN0b3IgKGNhcHR1cmVcbiAgLy8gYWRqYWNlbmN5KSBzbyBlZGl0aW5nL3RocmVhZGluZyBiZWhhdmlvciBzdXJ2aXZlcyB0aGUgc29ydC5cbiAgLy9cbiAgLy8gVXNlZCBPTkxZIGJ5IHRoZSBleHBvcnQgcGlwZWxpbmUgKGBidWlsZFNsaW1gKSwgbm90IHRoZSBzaWRlYmFyXG4gIC8vIHJlbmRlci4gVGhlIHNpZGViYXIga2VlcHMgbWVzc2FnZXMgaW4gaW5zZXJ0aW9uL2NhcHR1cmUgb3JkZXIgc29cbiAgLy8gdGhlIHVzZXIgc2VlcyB0aGVtIHdoZXJlIHRoZXkgZXhwZWN0OyB0aGUgZXhwb3J0IGdldHMgdGhlIGFnZW50LVxuICAvLyBmcmllbmRseSByZWFkaW5nLW9yZGVyIHRyZWF0bWVudC5cbiAgY29uc3QgcmVvcmRlckZvckV4cG9ydCA9IChtc2dzOiBQYW5lbE1lc3NhZ2VbXSk6IFBhbmVsTWVzc2FnZVtdID0+IHtcbiAgICB0eXBlIEdyb3VwID0ge2tpbmQ6ICdncm91cCc7IHNlbDogU2VsZWN0b3JNZXNzYWdlOyB0cmFpbGluZzogRmVlZGJhY2tNZXNzYWdlW119O1xuICAgIHR5cGUgTG9vc2UgPSB7a2luZDogJ2xvb3NlJzsgbTogRmVlZGJhY2tNZXNzYWdlfTtcbiAgICB0eXBlIFNsb3QgPSBHcm91cCB8IExvb3NlIHwge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9O1xuICAgIGNvbnN0IHNsb3RzOiBTbG90W10gPSBbXTtcbiAgICBsZXQgY3VyR3JvdXA6IEdyb3VwIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgZmx1c2hHcm91cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmIChjdXJHcm91cCkgeyBzbG90cy5wdXNoKGN1ckdyb3VwKTsgY3VyR3JvdXAgPSBudWxsOyB9XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbXNncykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgc2xvdHMucHVzaCh7a2luZDogJ3BhZ2UnLCBtfSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIGN1ckdyb3VwID0ge2tpbmQ6ICdncm91cCcsIHNlbDogbSwgdHJhaWxpbmc6IFtdfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjdXJHcm91cCkgY3VyR3JvdXAudHJhaWxpbmcucHVzaChtKTtcbiAgICAgICAgZWxzZSBzbG90cy5wdXNoKHtraW5kOiAnbG9vc2UnLCBtfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoR3JvdXAoKTtcbiAgICBjb25zdCBvdXQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgbGV0IHJ1blN0YXJ0ID0gMDtcbiAgICBjb25zdCBmbHVzaFJ1biA9IChlbmQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwUmVjdHM6IEFycmF5PHtpZHg6IG51bWJlcjsgeTogbnVtYmVyOyB4OiBudW1iZXJ9PiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IHJ1blN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHIgPSBzLnNlbC5lbnRyeS5yZWN0O1xuICAgICAgICAgIGdyb3VwUmVjdHMucHVzaCh7aWR4OiBpLCB5OiByPy55ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgeDogcj8ueCA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9KTtcbiAgICAgICAgfVxuICAgICAgICBpbmRpY2VzLnB1c2goaSk7XG4gICAgICB9XG4gICAgICBncm91cFJlY3RzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGEueSAhPT0gYi55KSByZXR1cm4gYS55IC0gYi55O1xuICAgICAgICByZXR1cm4gYS54IC0gYi54O1xuICAgICAgfSk7XG4gICAgICBsZXQgZ2kgPSAwO1xuICAgICAgZm9yIChjb25zdCBpIG9mIGluZGljZXMpIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50SWR4ID0gZ3JvdXBSZWN0c1tnaSsrXSEuaWR4O1xuICAgICAgICAgIGNvbnN0IHIgPSBzbG90c1tyZXBsYWNlbWVudElkeF0hIGFzIEdyb3VwO1xuICAgICAgICAgIG91dC5wdXNoKHIuc2VsKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGYgb2Ygci50cmFpbGluZykgb3V0LnB1c2goZik7XG4gICAgICAgIH0gZWxzZSBpZiAocy5raW5kID09PSAnbG9vc2UnKSB7XG4gICAgICAgICAgb3V0LnB1c2gocy5tKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNsb3RzW2ldIS5raW5kID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hSdW4oaSk7XG4gICAgICAgIG91dC5wdXNoKChzbG90c1tpXSBhcyB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX0pLm0pO1xuICAgICAgICBydW5TdGFydCA9IGkgKyAxO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaFJ1bihzbG90cy5sZW5ndGgpO1xuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHN0aWNrVG9Cb3R0b20gPSBsaXN0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCB3YXNOZWFyQm90dG9tKCk7XG4gICAgbGlzdC5pbm5lckhUTUwgPSAnJztcblxuICAgIC8vIFN0YXRzIG51bWJlcnNcbiAgICBsZXQgdG90YWxTZWxlY3RvcnMgPSAwO1xuICAgIGxldCB0b3RhbENvbW1lbnRzID0gMDtcbiAgICBsZXQgdG90YWxTdGFsZSA9IDA7XG4gICAgY29uc3QgZGlzdGluY3RQYWdlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICB0b3RhbFNlbGVjdG9ycysrO1xuICAgICAgICBpZiAoc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKSB0b3RhbFN0YWxlKys7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgdG90YWxDb21tZW50cysrO1xuICAgICAgZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLnNvbWUoKHgpID0+IHgudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiB4LmVudHJ5LnVybCA9PT0gbS51cmwpKSBkaXN0aW5jdFBhZ2VzLmFkZChtLnVybCk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzZWxlY3RvcnNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU2VsZWN0b3JzKTtcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwiY29tbWVudHNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsQ29tbWVudHMpO1xuICAgIGNvbnN0IHN0YWxlTnVtID0gc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInN0YWxlXCJdIC5zdGF0LW51bScpITtcbiAgICBzdGFsZU51bS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFN0YWxlKTtcbiAgICBzdGFsZU51bS5kYXRhc2V0Lnplcm8gPSB0b3RhbFN0YWxlID09PSAwID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwicGFnZXNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKGRpc3RpbmN0UGFnZXMuc2l6ZSk7XG4gICAgY29uc3QgZXhwb3J0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBzdGF0VG9rZW5zLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh0b2tlbkNvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcbiAgICBzdGF0V29yZHMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHdvcmRDb3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG5cbiAgICAvLyBNaW5pZnkgcmVkdWN0aW9uIHN0YXRzXG4gICAgbGV0IGZ1bGxUID0gMCwgY3VyVCA9IDAsIGZ1bGxXID0gMCwgY3VyVyA9IDAsIHBjdCA9IDA7XG4gICAgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgIGNvbnN0IHdhc01pbiA9IHByZWZzLm1pbmlmeTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHRydWU7IGNvbnN0IG1pblRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSBmYWxzZTsgY29uc3QgZnVsbFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB3YXNNaW47XG4gICAgICBmdWxsVCA9IHRva2VuQ291bnQoZnVsbFRleHQpOyBjdXJUID0gdG9rZW5Db3VudChtaW5UZXh0KTtcbiAgICAgIGZ1bGxXID0gd29yZENvdW50KGZ1bGxUZXh0KTsgY3VyVyA9IHdvcmRDb3VudChtaW5UZXh0KTtcbiAgICAgIHBjdCA9IGZ1bGxUID4gMCA/IE1hdGgucm91bmQoKDEgLSBjdXJUIC8gZnVsbFQpICogMTAwKSA6IDA7XG4gICAgfVxuICAgIGNvbnN0IG1pbmlmeVN0YXRzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWluaWZ5LXN0YXRzXScpO1xuICAgIGlmIChtaW5pZnlTdGF0c0VsKSB7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGAke2Z1bGxULnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clQudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7ZnVsbFcudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVy50b0xvY2FsZVN0cmluZygpfSB3b3JkcyDCtyAke3BjdH0lIHJlZHVjdGlvbmA7XG4gICAgICB9IGVsc2UgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGBXb3VsZCBzYXZlICR7KGZ1bGxUIC0gY3VyVCkudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7cGN0fSUgaWYgZW5hYmxlZGA7XG4gICAgICB9IGVsc2UgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIC8vIFBlci1jaGVja2JveCBjb250cmlidXRpb24gc3RhdHM6IGhvdyBtYW55IHRva2Vucy93b3JkcyBlYWNoIHRvZ2dsZVxuICAgIC8vIGFkZHMgdG8gdGhlIGN1cnJlbnQgZXhwb3J0LiBDb21wdXRlZCBieSB0b2dnbGluZyB0aGF0IHNpbmdsZSBwcmVmXG4gICAgLy8gYW5kIGRpZmZpbmcgdGhlIGV4cG9ydCDigJQgZ2l2ZXMgYW4gaG9uZXN0IGFuc3dlciB0aGF0IHJlZmxlY3RzIHRoZVxuICAgIC8vIGN1cnJlbnQgbWluaWZ5IHN0YXRlIGFuZCB0aGUgcmVzdCBvZiB0aGUgdG9nZ2xlcy5cbiAgICBjb25zdCBjb250cmliS2V5czogQXJyYXk8a2V5b2YgUHJlZnM+ID0gWydpbmNsdWRlT3V0ZXJIVE1MJywgJ2luY2x1ZGVNYXRjaGVkUnVsZXMnLCAnaW5jbHVkZVN0eWxlcyddO1xuICAgIGlmIChleHBvcnRUZXh0ICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYmFzZVQgPSB0b2tlbkNvdW50KGV4cG9ydFRleHQpO1xuICAgICAgY29uc3QgYmFzZVcgPSB3b3JkQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmICghZWwpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCB3YXNPbiA9IHByZWZzW2tleV0gYXMgYm9vbGVhbjtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9ICF3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IHdhc09uO1xuICAgICAgICBjb25zdCBhbHRUID0gdG9rZW5Db3VudChhbHRUZXh0KTtcbiAgICAgICAgY29uc3QgYWx0VyA9IHdvcmRDb3VudChhbHRUZXh0KTtcbiAgICAgICAgLy8gd2FzT249dHJ1ZSDihpIgY3VycmVudGx5IGluY2x1ZGVkOyBjb3N0ID0gYmFzZSAtIGFsdCAodHVybmluZyBPRkYgc2F2ZXMgdGhpcykuXG4gICAgICAgIC8vIHdhc09uPWZhbHNlIOKGkiBjdXJyZW50bHkgZXhjbHVkZWQ7IGdhaW4gPSBhbHQgLSBiYXNlICh0dXJuaW5nIE9OIGFkZHMgdGhpcykuXG4gICAgICAgIGNvbnN0IGRUID0gd2FzT24gPyBiYXNlVCAtIGFsdFQgOiBhbHRUIC0gYmFzZVQ7XG4gICAgICAgIGNvbnN0IGRXID0gd2FzT24gPyBiYXNlVyAtIGFsdFcgOiBhbHRXIC0gYmFzZVc7XG4gICAgICAgIGNvbnN0IHNpZ24gPSB3YXNPbiA/ICcnIDogJysnO1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHdhc09uXG4gICAgICAgICAgPyBgwrcgJHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpbiBleHBvcnQke3ByZWZzLm1pbmlmeSA/ICcgKG1pbmlmaWVkKScgOiAnJ31gXG4gICAgICAgICAgOiBgwrcgJHtzaWdufSR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke3NpZ259JHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGlmIGVuYWJsZWRgO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmIChlbCkgZWwudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUb29sYmFyIGV4cG9ydCBzdGF0c1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcuc3RhdC5leHBvcnQtc3RhdHMnKS5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICBjb25zdCBudW0gPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1udW0nKTtcbiAgICAgIGNvbnN0IGxhYiA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LWxhYmVsJyk7XG4gICAgICBpZiAobnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQhLnJlcGxhY2UoL1xcKiQvLCAnJyk7XG4gICAgICBpZiAobGFiKSBsYWIudGV4dENvbnRlbnQgPSBsYWIudGV4dENvbnRlbnQhLnJlcGxhY2UoL15cXCovLCAnJyk7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50ICsgJyonO1xuICAgICAgY29uc3QgaXNUb2tlbiA9IGkgPT09IDA7XG4gICAgICBjb25zdCBmdWxsViA9IGlzVG9rZW4gPyBmdWxsVCA6IGZ1bGxXO1xuICAgICAgY29uc3QgY3VyViA9IGlzVG9rZW4gPyBjdXJUIDogY3VyVztcbiAgICAgIGNvbnN0IHdoaWNoID0gaXNUb2tlbiA/ICd0b2tlbnMnIDogJ3dvcmRzJztcbiAgICAgIHMuZGF0YXNldC50aXAgPSBwcmVmcy5taW5pZnlcbiAgICAgICAgPyBgTUlOSUZJRUQgwrcgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9XFxuRnVsbCB3b3VsZCBiZSAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgXG4gICAgICAgIDogYCR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH0gwrcgZnVsbCBleHBvcnRcXG5NaW5pZmllZCB3b3VsZCBiZSAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWA7XG4gICAgfSk7XG5cbiAgICBpZiAobWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZW1wdHkuY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgICAgIGVtcHR5LmlubmVySFRNTCA9IGA8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbTo4cHg7Zm9udC1zaXplOjMycHhcIj7wn6SPPC9kaXY+XG4gICAgICAgIE9wZW4gYW55IHBhZ2UgYW5kIDxiPkFsdCtDbGljazwvYj4gYW4gZWxlbWVudC4gQ2FwdHVyZXMgbGFuZCBoZXJlIG9uIHRoZSBsZWZ0Ozxicj5cbiAgICAgICAgdHlwZSBjb21tZW50cyBiZWxvdyDigJQgdGhleSBhcHBlYXIgb24gdGhlIHJpZ2h0LmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdG9yVXJscyA9IG5ldyBTZXQobWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkudXJsKSk7XG4gICAgY29uc3QgdmlzaWJsZU1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgIT09ICdwYWdlJyB8fCBzZWxlY3RvclVybHMuaGFzKG0udXJsKSk7XG4gICAgY29uc3QgcGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBCb29sZWFuKG0ucGlubmVkKSk7XG4gICAgY29uc3QgdW5waW5uZWQgPSB2aXNpYmxlTWVzc2FnZXMuZmlsdGVyKChtKSA9PiAhcGlubmVkLmluY2x1ZGVzKG0gYXMgU2VsZWN0b3JNZXNzYWdlKSk7XG4gICAgLy8gU2lkZWJhciBzaG93cyBjYXB0dXJlcyBpbiBJTlNFUlRJT04gb3JkZXIgKG1vc3QgcmVjZW50IGF0IHRoZVxuICAgIC8vIGJvdHRvbSkuIFZpc3VhbC1wb3NpdGlvbiByZW9yZGVyaW5nIGhhcHBlbnMgT05MWSBhdCBleHBvcnQgdGltZVxuICAgIC8vIHNvIHRoZSBzaWRlYmFyIHN0YXlzIHByZWRpY3RhYmxlIHdoaWxlIHRoZSBhZ2VudC1mYWNpbmcgZXhwb3J0XG4gICAgLy8gZ2V0cyByZWFkaW5nLW9yZGVyIGNvbnZlbmllbmNlLiAoUHJpb3IgaW1wbGVtZW50YXRpb24gc29ydGVkIGluXG4gICAgLy8gYm90aCBwbGFjZXM7IHVzZXIgZmVlZGJhY2sgd2FzIHRoYXQgc2lkZWJhciBzaHVmZmxpbmcgd2FzXG4gICAgLy8gZGlzb3JpZW50aW5nLilcbiAgICBjb25zdCBvcmRlcmVkID0gWy4uLnBpbm5lZCwgLi4udW5waW5uZWRdO1xuXG4gICAgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbChtZXNzYWdlc1swXSEuaWQpKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmVuZGVyZWRBbnkgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZGVyZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSBvcmRlcmVkW2ldITtcbiAgICAgIGlmICghbWF0Y2hlc1NlYXJjaChtKSkgY29udGludWU7XG4gICAgICBjb25zdCBub2RlID0gcmVuZGVyTWVzc2FnZShtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgICAgbGlzdC5hcHBlbmQobm9kZSk7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBsYXN0U2VsZWN0b3JTZWwgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgaWYgKGkgPCBvcmRlcmVkLmxlbmd0aCAtIDEpIGxpc3QuYXBwZW5kKGluc2VydFJhaWwob3JkZXJlZFtpICsgMV0hLmlkKSk7XG4gICAgICByZW5kZXJlZEFueSA9IHRydWU7XG4gICAgfVxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwoJ19fZW5kX18nKSk7XG4gICAgaWYgKCFyZW5kZXJlZEFueSAmJiBzZWFyY2hRdWVyeSkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS50ZXh0Q29udGVudCA9IGBObyBtYXRjaGVzIGZvciBcIiR7c2VhcmNoUXVlcnl9XCIuYDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSByZW5kZXJQaGFudG9tKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgaWYgKHN0aWNrVG9Cb3R0b20pIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBlbmRpbmdCYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGVuZGluZy1iYXknKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwZW5kaW5nTXVsdGkubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgYmF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYmF5LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWJheSc7XG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGVhZCc7XG4gICAgaGVhZC50ZXh0Q29udGVudCA9IGBQZW5kaW5nIGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH0gZWxlbWVudCR7cGVuZGluZ011bHRpLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWA7XG4gICAgYmF5LmFwcGVuZChoZWFkKTtcbiAgICBwZW5kaW5nTXVsdGkuZm9yRWFjaCgoZSwgaSkgPT4ge1xuICAgICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2FyZC5jbGFzc05hbWUgPSAncGVuZGluZy1jYXJkJztcbiAgICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICAgIHNlcS50ZXh0Q29udGVudCA9IGAjJHtpICsgMX1gO1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IChlLnRleHQgJiYgZS50ZXh0Lmxlbmd0aCA8PSA2MCA/IGUudGV4dCA6IChlLmNvbXBvbmVudFJvb3QgPz8gZS5zZWxlY3RvciA/PyBlLnRhZykpO1xuICAgICAgY2FyZC5hcHBlbmQoc2VxLCBsYWJlbCk7XG4gICAgICBiYXkuYXBwZW5kKGNhcmQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncGVuZGluZy1yb3cnO1xuICAgIGNvbnN0IGNvbW1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbW1pdC50eXBlID0gJ2J1dHRvbic7XG4gICAgY29tbWl0LmNsYXNzTmFtZSA9ICdwcmltYXJ5IHBlbmRpbmctY29tbWl0JztcbiAgICBjb21taXQudGV4dENvbnRlbnQgPSBgQ29tbWl0IGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH1gO1xuICAgIGNvbW1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jb21taXQnfSkpO1xuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuIHBlbmRpbmctY2FuY2VsJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnO1xuICAgIGNhbmNlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAxMyk7XG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9KSk7XG4gICAgcm93LmFwcGVuZChjb21taXQsIGNhbmNlbCk7XG4gICAgYmF5LmFwcGVuZChyb3cpO1xuICAgIGNvbnN0IGhpbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoaW50LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhpbnQnO1xuICAgIGhpbnQudGV4dENvbnRlbnQgPSAnQWx0K1NoaWZ0K0NsaWNrIG1vcmUgwrcgQ29tbWl0IHRvIGZpbmFsaXplIMK3IEVzYyB0byBjYW5jZWwnO1xuICAgIGJheS5hcHBlbmQoaGludCk7XG4gICAgbGlzdC5hcHBlbmQoYmF5KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgTm9vZGxlcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgY2xlYXJOb29kbGVzID0gKCk6IHZvaWQgPT4geyBmb3IgKGNvbnN0IG4gb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcudHJlZS1ub29kbGUnKSkgbi5yZW1vdmUoKTsgfTtcblxuICAvLyBDcm9zcy1zZWFtIHBhbmVs4oaUY2FudmFzIG5vb2RsZXMgd2VyZSByZW1vdmVkOiBhbGlnbmluZyB0d28gU1ZHIGhhbHZlc1xuICAvLyBhY3Jvc3MgdGhlIHBhbmVsL3BhZ2UgYm91bmRhcnkgZGVwZW5kZWQgb24gaW5uZXJIZWlnaHQgcGFyaXR5IHdoaWNoXG4gIC8vIGJyZWFrcyB1bmRlciBEZXZUb29scyBkb2NrIGFuZCB6b29tLCBhbmQgdGhlIHZpc3VhbCBiZW5lZml0IGRpZG4ndFxuICAvLyBqdXN0aWZ5IHRoZSBtYWludGVuYW5jZSBjb3N0LiBUaGUgaW4tcGFuZWwgZmVlZGJhY2stdHJlZSBub29kbGVzXG4gIC8vIChkcmF3Tm9vZGxlIC8gcmVkcmF3Tm9vZGxlcyBiZWxvdykgYXJlIHVuYWZmZWN0ZWQuXG4gIGNvbnN0IGNsZWFyQnViYmxlTm9vZGxlID0gKCk6IHZvaWQgPT4geyAvKiBuby1vcCAqLyB9O1xuICBjb25zdCByZWRyYXdOb29kbGVzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNsZWFyTm9vZGxlcygpO1xuICAgIGxldCBsYXN0U2VsZWN0b3JFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgWy4uLmxpc3QuY2hpbGRyZW5dIGFzIEhUTUxFbGVtZW50W10pIHtcbiAgICAgIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdG9yJykpIGxhc3RTZWxlY3RvckVsID0gbm9kZTtcbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtc2cnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZmVlZGJhY2snKSAmJiBsYXN0U2VsZWN0b3JFbCkgZHJhd05vb2RsZShsYXN0U2VsZWN0b3JFbCwgbm9kZSk7XG4gICAgICBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnaW5zZXJ0LXJhaWwnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZXhwYW5kZWQnKSAmJiBsYXN0U2VsZWN0b3JFbCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBub2RlLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuaW5saW5lLWNvbW1lbnQnKSA/PyBub2RlO1xuICAgICAgICBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCB0YXJnZXQpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1kaXZpZGVyJykgfHwgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2dyb3VwLWhlYWQnKSkge1xuICAgICAgICBsYXN0U2VsZWN0b3JFbCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBkcmF3Tm9vZGxlID0gKHNlbGVjdG9yRWw6IEhUTUxFbGVtZW50LCBmZWVkYmFja0VsOiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNSID0gc2VsZWN0b3JFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBmUiA9IGZlZWRiYWNrRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbFIgPSBsaXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHgxID0gc1IubGVmdCAtIGxSLmxlZnQgKyAxMjtcbiAgICBjb25zdCB5MSA9IHNSLmJvdHRvbSAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wO1xuICAgIGNvbnN0IHgyID0gZlIubGVmdCAtIGxSLmxlZnQ7XG4gICAgY29uc3QgeTIgPSBmUi50b3AgLSBsUi50b3AgKyBsaXN0LnNjcm9sbFRvcCArIDE0O1xuICAgIGNvbnN0IHcgPSBNYXRoLm1heCgyMCwgeDIgLSB4MSArIDQpO1xuICAgIGNvbnN0IGggPSBNYXRoLm1heCgyMCwgeTIgLSB5MSk7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0cmVlLW5vb2RsZScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgU3RyaW5nKHcpKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBTdHJpbmcoaCkpO1xuICAgIHN2Zy5zdHlsZS5sZWZ0ID0gYCR7eDEgLSAyfXB4YDtcbiAgICBzdmcuc3R5bGUudG9wID0gYCR7eTF9cHhgO1xuICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICBjb25zdCBzeCA9IDIsIHN5ID0gMCwgZXggPSB3IC0gMiwgZXkgPSBoO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgYE0gJHtzeH0gJHtzeX0gQyAke3N4fSAke3N5ICsgaCAqIDAuNTV9LCAke2V4IC0gdyAqIDAuNH0gJHtleX0sICR7ZXh9ICR7ZXl9YCk7XG4gICAgc3ZnLmFwcGVuZChwYXRoKTtcbiAgICBsaXN0LmFwcGVuZChzdmcpO1xuICB9O1xuICBsZXQgc2Nyb2xsUmFmID0gMDtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgaWYgKHNjcm9sbFJhZikgcmV0dXJuO1xuICAgIHNjcm9sbFJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IHNjcm9sbFJhZiA9IDA7IHJlZHJhd05vb2RsZXMoKTsgfSk7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVkcmF3Tm9vZGxlcyk7XG5cbiAgLy8g4pSA4pSA4pSAIFBlci1tZXNzYWdlIHJlbmRlcmVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgcmVuZGVyTWVzc2FnZSA9IChtOiBQYW5lbE1lc3NhZ2UsIGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBpZiAobS50eXBlID09PSAncGFnZScpIHJldHVybiByZW5kZXJQYWdlKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHJldHVybiByZW5kZXJTZWxlY3RvcihtKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gcmVuZGVyRmVlZGJhY2sobSwgbGFzdFNlbGVjdG9yU2VsKTtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGFnZSA9IChtOiBQYWdlTWVzc2FnZSk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZC5jbGFzc05hbWUgPSAncGFnZS1kaXZpZGVyJztcbiAgICBkLmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGNvbnN0IHRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRzLmNsYXNzTmFtZSA9ICd0YWItc3RhdHVzJztcbiAgICB0cy5kYXRhc2V0LnVybCA9IG0udXJsO1xuICAgIGlmIChtLnVybCA9PT0gbGl2ZVRhYlVybCkgdHMuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuICAgIGQuYXBwZW5kKHRzKTtcbiAgICBjb25zdCB1ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHUuY2xhc3NOYW1lID0gJ3VybCc7XG4gICAgdS50ZXh0Q29udGVudCA9IG0udXJsO1xuICAgIHUuZGF0YXNldC50aXAgPSBgJHttLnRpdGxlID8/ICcnfSDCtyAke20udXJsfWA7XG4gICAgZC5hcHBlbmQodSk7XG4gICAgZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIElmIHdlJ3JlIGFscmVhZHkgb24gdGhpcyBwYWdlIGluIHRoZSBhY3RpdmUgdGFiLCBjbGlja2luZyB0aGUgVVJMXG4gICAgICAvLyBzaG91bGRuJ3QgcmVsb2FkIG9yIHN0ZWFsIGZvY3VzIOKAlCBpdCBzaG91bGQganVzdCBiZSBhIG5vLW9wXG4gICAgICAvLyB2aXN1YWxseSAodGhlIHJvdyBhbHJlYWR5IGluZGljYXRlcyBcIm9wZW5cIiB2aWEgLnRhYi1zdGF0dXMpLiBUaGVcbiAgICAgIC8vIHVzZXIgY29tcGxhaW5lZCBhYm91dCBnZXR0aW5nIGZvcmNlZCBpbnRvIGEgbmF2aWdhdGlvbiB3aGVuIHRoZXlcbiAgICAgIC8vIHdlcmUganVzdCB0cnlpbmcgdG8gcmVhZCB0aGUgcm93LlxuICAgICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB7XG4gICAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBvbiB0aGlzIHBhZ2UnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBzZW5kVG9CZzx7Zm91bmQ/OiBib29sZWFuOyBvcGVuZWQ/OiBudW1iZXI7IGVycm9yPzogc3RyaW5nfT4oe2tpbmQ6ICdzd2l0Y2gtdG8tdGFiJywgdXJsOiBtLnVybCwgb3BlbklmTWlzc2luZzogdHJ1ZX0pO1xuICAgICAgaWYgKHI/LmZvdW5kKSBzZXRTdGF0dXMoJ1N3aXRjaGVkIHRvIHRhYicpO1xuICAgICAgZWxzZSBpZiAocj8ub3BlbmVkKSBzZXRTdGF0dXMoJ09wZW5lZCBpbiBuZXcgdGFiJyk7XG4gICAgICBlbHNlIHNldFN0YXR1cyhcIkNvdWxkbid0IG9wZW4gdGFiXCIsIHtraW5kOiAnd2Fybid9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZDtcbiAgfTtcblxuICBjb25zdCB0aXRsZUZyb21FbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGVzdElkKSByZXR1cm4gYFt0ZXN0SWQ9JHtlLnRlc3RJZH1dYDtcbiAgICBpZiAoZS5pZCkgcmV0dXJuIGAjJHtlLmlkfWA7XG4gICAgaWYgKGUuY2xhc3Nlcz8ubGVuZ3RoKSByZXR1cm4gYCR7ZS50YWd9LiR7ZS5jbGFzc2VzLnNsaWNlKDAsIDIpLmpvaW4oJy4nKX1gO1xuICAgIHJldHVybiBlLnNlbGVjdG9yIHx8IGUudGFnIHx8ICcodW5rbm93biknO1xuICB9O1xuXG4gIC8vIFBpY2sgdGhlIG1vc3QgXCJodW1hbmx5IHJlYWRhYmxlXCIgbGFiZWwgZm9yIHRoZSBidWJibGUgcHJldmlldy4gUHJlZmVyc1xuICAvLyB2aXNpYmxlLXRvLXVzZXIgdGV4dCBpbiB0aGlzIHByaW9yaXR5OlxuICAvLyAgIDEuIGlubmVyVGV4dCAvIHRleHRDb250ZW50IChgZW50cnkudGV4dGApIOKAlCB3aGF0IHRoZSB1c2VyIHJlYWRzIG9uIHNjcmVlblxuICAvLyAgIDIuIGFjY2Vzc2libGVOYW1lIChhcmlhLWxhYmVsIC8gdGl0bGUgLyBhbHQgZmFsbGJhY2sgY2hhaW4pXG4gIC8vICAgMy4gaW5wdXQgdmFsdWUgKHNraXBwZWQgaWYgaXQncyB0aGUgbWFza2VkIHBhc3N3b3JkIHBsYWNlaG9sZGVyKVxuICAvLyAgIDQuIGlucHV0IHBsYWNlaG9sZGVyXG4gIC8vICAgNS4gaW1nIGFsdFxuICAvLyAgIDYuIGNvbXBvbmVudFJvb3QgKGUuZy4gXCJidXR0b24jY3RhXCIpXG4gIC8vICAgNy4gdGl0bGVGcm9tRW50cnkg4oCUIGxhc3QtcmVzb3J0IHRhZy9jbGFzcy9pZCBmYWxsYmFja1xuICAvLyBDU1MgaGFuZGxlcyB2aXN1YWwgdHJ1bmNhdGlvbiB2aWEgdGV4dC1vdmVyZmxvdzplbGxpcHNpczsgd2Ugc2hpcCB0aGVcbiAgLy8gZnVsbCBzdHJpbmcgc28gdGhlIHRvb2x0aXAgb24gaG92ZXIgY2FuIHNob3cgdGhlIGNvbXBsZXRlIHZhbHVlLlxuICBjb25zdCBuaWNlTGFiZWwgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChlLnRleHQpIHJldHVybiBlLnRleHQ7XG4gICAgaWYgKGUuYWNjZXNzaWJsZU5hbWUpIHJldHVybiBlLmFjY2Vzc2libGVOYW1lO1xuICAgIGNvbnN0IHYgPSBlLmF0dHJzPy52YWx1ZTtcbiAgICBpZiAodiAmJiB2ICE9PSAn4oCi4oCi4oCi4oCiJykgcmV0dXJuIHY7XG4gICAgaWYgKGUuYXR0cnM/LnBsYWNlaG9sZGVyKSByZXR1cm4gZS5hdHRycy5wbGFjZWhvbGRlcjtcbiAgICBpZiAoZS5hdHRycz8uYWx0KSByZXR1cm4gZS5hdHRycy5hbHQ7XG4gICAgaWYgKGUuY29tcG9uZW50Um9vdCkgcmV0dXJuIGUuY29tcG9uZW50Um9vdDtcbiAgICByZXR1cm4gdGl0bGVGcm9tRW50cnkoZSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyU2VsZWN0b3IgPSAobTogU2VsZWN0b3JNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHZhbGlkID0gc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3Qgc2FtZVBhdGggPSBwYXRoT2YobS5lbnRyeS51cmwgPz8gJycpID09PSBsaXZlVGFiUGF0aDtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ21zZyBzZWxlY3Rvcic7XG4gICAgaWYgKHZhbGlkID09PSBmYWxzZSAmJiBzYW1lUGF0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3N0YWxlJyk7XG4gICAgZWxzZSBpZiAodmFsaWQgPT09IGZhbHNlICYmICFzYW1lUGF0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2RpZmYtcGFnZScpO1xuICAgIGlmIChtLnBpbm5lZCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3Bpbm5lZCcpO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdoYXMtZ3JvdXAnKTtcbiAgICBpZiAobS5lbnRyeS5zZWxlY3RvciA9PT0gbGFzdEFjdGl2ZVNlbGVjdG9yKSBkaXYuY2xhc3NMaXN0LmFkZCgnbGFzdC1hY3RpdmUnKTtcbiAgICAvLyBBdXRvLWV4cGFuZCBvbiBzZWFyY2ggaGl0IHNvIHRoZSB1c2VyIHNlZXMgd2hlcmUgdGhlIG1hdGNoIGxhbmRlZC5cbiAgICBjb25zdCBtYXRjaGVkQm9keSA9IGJvZHlNYXRjaGVzU2VhcmNoKG0pO1xuICAgIGlmIChtYXRjaGVkQm9keSkgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJywgJ3NlYXJjaC1oaXQnKTtcbiAgICBkaXYuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgZGl2LmRhdGFzZXQuc2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgIC8vIERyYWctdG8tcmVwYXJlbnQ6IGV2ZXJ5IHNlbGVjdG9yIGJ1YmJsZSBpcyBhIHZhbGlkIGRyb3AgdGFyZ2V0IGZvclxuICAgIC8vIGEgY29tbWVudCBiZWluZyBkcmFnZ2VkIGZyb20gZWxzZXdoZXJlIGluIHRoZSBzaWRlYmFyLlxuICAgIHdpcmVTZWxlY3RvckRyb3BUYXJnZXQoZGl2LCBtKTtcblxuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdoZWFkJztcbiAgICBjb25zdCBjYXJldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjYXJldC5jbGFzc05hbWUgPSAnY2FyZXQnO1xuICAgIGNhcmV0LmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hldnJvbi1yaWdodCcsIDEyKTtcbiAgICBoZWFkLmFwcGVuZChjYXJldCk7XG4gICAgY29uc3QgcGluTWFya2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHBpbk1hcmtlci5jbGFzc05hbWUgPSAncGluLW1hcmtlcic7XG4gICAgcGluTWFya2VyLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnc3Rhci1maWxsZWQnLCAxMSk7XG4gICAgaGVhZC5hcHBlbmQocGluTWFya2VyKTtcbiAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc2VxLmNsYXNzTmFtZSA9ICdzZXEnO1xuICAgIHNlcS50ZXh0Q29udGVudCA9IGAjJHttLmVudHJ5Lm59YDtcbiAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBzZXEudGV4dENvbnRlbnQgKz0gYCske20uZW50cnkuZ3JvdXAubGVuZ3RofWA7XG4gICAgaGVhZC5hcHBlbmQoc2VxKTtcbiAgICBjb25zdCBjb21wYWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbXBhY3QuY2xhc3NOYW1lID0gJ2NvbXBhY3QnO1xuICAgIGNvbnN0IGNvbXBhY3RTdHIgPSBuaWNlTGFiZWwobS5lbnRyeSk7XG4gICAgY29tcGFjdC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChjb21wYWN0U3RyLCBzZWFyY2hRdWVyeSk7XG4gICAgLy8gU2hvdyB0aGUgZnVsbCBsYWJlbCBvbiBob3ZlciBldmVuIHdoZW4gQ1NTIGVsbGlwc2lzIHRydW5jYXRlcyB0aGVcbiAgICAvLyB2aXNpYmxlIHBvcnRpb24g4oCUIHVzZWZ1bCB3aGVuIHRoZSB2aXNpYmxlIHRleHQvcGxhY2Vob2xkZXIgaXMgbG9uZy5cbiAgICBpZiAoY29tcGFjdFN0ci5sZW5ndGggPiAyNCkgY29tcGFjdC5kYXRhc2V0LnRpcCA9IGNvbXBhY3RTdHI7XG4gICAgaGVhZC5hcHBlbmQoY29tcGFjdCk7XG4gICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBtZXRhLmNsYXNzTmFtZSA9ICdtZXRhJztcbiAgICBjb25zdCByID0gbS5lbnRyeS5yZWN0O1xuICAgIG1ldGEudGV4dENvbnRlbnQgPSByID8gYCR7ci53fcOXJHtyLmh9YCA6IChtLmVudHJ5LnRhZyA/PyAnJyk7XG4gICAgaGVhZC5hcHBlbmQobWV0YSk7XG4gICAgZGl2LmFwcGVuZChoZWFkKTtcblxuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc3VtbWFyeS5jbGFzc05hbWUgPSAncGVlay1zdW1tYXJ5JztcbiAgICBzdW1tYXJ5LmlubmVySFRNTCA9IGA8c3BhbiBkYXRhLWljb249XCJhbGVydC1jaXJjbGVcIiBkYXRhLXNpemU9XCIxMVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidFwiPiR7ZGl2LmNsYXNzTGlzdC5jb250YWlucygnZGlmZi1wYWdlJykgPyAnZGlmZmVyZW50IHBhZ2UnIDogJ3N0YWxlJ308L3NwYW4+YDtcbiAgICBoZWFkLmFwcGVuZChzdW1tYXJ5KTtcbiAgICBtb3VudEljb25zKHN1bW1hcnkpO1xuXG4gICAgY29uc3QgZXJyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZXJyLmNsYXNzTmFtZSA9ICdwZWVrLWVycm9yJztcbiAgICBjb25zdCByZWFzb24gPSBzZWxlY3RvckVycm9ycy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3QgcGF0aEZyb21FbnRyeSA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJyk7XG4gICAgZXJyLmlubmVySFRNTCA9IHNhbWVQYXRoXG4gICAgICA/IGA8Yj5TdGFsZTwvYj4gwrcgJHtlc2NhcGVIdG1sKHJlYXNvbiA/PyAnbm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMuJyl9PGJyPjxjb2RlPiR7ZXNjYXBlSHRtbChtLmVudHJ5LnNlbGVjdG9yKX08L2NvZGU+YFxuICAgICAgOiBgQ2FwdHVyZWQgb24gPGNvZGU+JHtlc2NhcGVIdG1sKHBhdGhGcm9tRW50cnkpfTwvY29kZT4g4oCUIGN1cnJlbnQgdGFiIGlzIDxjb2RlPiR7ZXNjYXBlSHRtbChsaXZlVGFiUGF0aCA/PyAnJyl9PC9jb2RlPi4gU3dpdGNoIHRhYnMgdG8gdmFsaWRhdGUuPGJyPjxjb2RlPiR7ZXNjYXBlSHRtbChtLmVudHJ5LnNlbGVjdG9yKX08L2NvZGU+YDtcbiAgICBkaXYuYXBwZW5kKGVycik7XG5cbiAgICAvLyBBbmNlc3RvciBicmVhZGNydW1iIOKAlCBQbGFzbWljLXN0eWxlIGVzY2FsYXRvci4gQ2hpcHMgZm9yIGVhY2ggZW50cnkgaW5cbiAgICAvLyBlbnRyeS5hbmNlc3RvcnMgKGNsb3Nlc3QgZmlyc3QpLiBDbGljayBhIGNoaXAgdG8gY2FwdHVyZSB0aGF0XG4gICAgLy8gYW5jZXN0b3Igb24gdGhlIGxpdmUgcGFnZSAoZGVwdGggPSBjaGlwIGluZGV4ICsgMSBzaW5jZSB0aGUgZW50cnknc1xuICAgIC8vIG93biBzZWxlY3RvciBpcyBkZXB0aCAwKS4gQnJpZ2h0bmVzcyBncmFkaWVudCBkYXJrZW5zIGRlZXBlciBjaGlwcy5cbiAgICBpZiAobS5lbnRyeS5hbmNlc3RvcnM/Lmxlbmd0aCkge1xuICAgICAgY29uc3QgY3J1bWJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjcnVtYnMuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNydW1icyc7XG4gICAgICBjcnVtYnMuZGF0YXNldC50aXAgPSAnQ2xpY2sgYSBjcnVtYiB0byBlc2NhbGF0ZSB0aGUgY2FwdHVyZSB0byBhbiBhbmNlc3RvciBlbGVtZW50JztcbiAgICAgIG0uZW50cnkuYW5jZXN0b3JzLmZvckVhY2goKGFuYywgaSkgPT4ge1xuICAgICAgICBjb25zdCBjaGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGNoaXAudHlwZSA9ICdidXR0b24nO1xuICAgICAgICBjaGlwLmNsYXNzTmFtZSA9ICdhbmNlc3Rvci1jaGlwJztcbiAgICAgICAgLy8gQnJpZ2h0bmVzcyBncmFkaWVudDogZGVlcGVyIGNoaXBzIGdldCBwcm9ncmVzc2l2ZWx5IGRpbW1lci5cbiAgICAgICAgY2hpcC5zdHlsZS5maWx0ZXIgPSBgYnJpZ2h0bmVzcygkeygxIC0gaSAqIDAuMDgpLnRvRml4ZWQoMil9KWA7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gYW5jLnRlc3RJZCA/IGBbJHthbmMudGVzdElkfV1gXG4gICAgICAgICAgOiBhbmMuaWQgPyBgIyR7YW5jLmlkfWBcbiAgICAgICAgICA6IGFuYy5jbGFzc2VzPy5sZW5ndGggPyBgJHthbmMudGFnfS4ke2FuYy5jbGFzc2VzWzBdfWBcbiAgICAgICAgICA6IGFuYy50YWc7XG4gICAgICAgIGNoaXAudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY2hpcC5kYXRhc2V0LnRpcCA9IGBDYXB0dXJlIHRoZSBhbmNlc3RvciAke2kgKyAxfSBsZXZlbCR7aSA/ICdzJyA6ICcnfSB1cCDCtyAke2FuYy50YWd9JHthbmMuaWQgPyAnIycgKyBhbmMuaWQgOiAnJ31gO1xuICAgICAgICAvLyBIb3Zlci1wcmV2aWV3IHRoZSBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIHNvIHRoZSB1c2VyIGNhbiBzZWVcbiAgICAgICAgLy8gd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjb21taXR0aW5nLiBNaXJyb3JzIGhvd1xuICAgICAgICAvLyBob3ZlcmluZyBhIHNlbGVjdG9yIGJ1YmJsZSBwYWludHMgaXRzIHJpbmcuIENsZWFyaW5nIG9uXG4gICAgICAgIC8vIG1vdXNlbGVhdmUgc3dhcHMgYmFjayB0byB0aGUgYnViYmxlJ3Mgb3duIG91dGxpbmUgKHRoZSBidWJibGUnc1xuICAgICAgICAvLyBtb3VzZWVudGVyIGhhbmRsZXIgcGFpbnRlZCBpdDsgbGVhdmluZyB0aGUgY2hpcCBqdXN0IHJlbW92ZXNcbiAgICAgICAgLy8gdGhlIG92ZXJyaWRlKS5cbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGRlcHRoOiBpICsgMX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAgIC8vIFJlLXBhaW50IHRoZSBidWJibGUncyBvd24gcmluZyByYXRoZXIgdGhhbiBjbGVhcmluZyBlbnRpcmVseVxuICAgICAgICAgIC8vIHNvIHRoZSB1c2VyIGRvZXNuJ3Qgc2VlIGEgZmxpY2tlciBvZiBcIm5vdGhpbmdcIiBiZXR3ZWVuIGNoaXBzLlxuICAgICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e29rOiBib29sZWFuOyBlbnRyeT86IEVudHJ5fT4oe1xuICAgICAgICAgICAga2luZDogJ2NhcHR1cmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChyZXBseT8ub2spIHNldFN0YXR1cyhgQ2FwdHVyZWQgYW5jZXN0b3IgJHthbmMudGFnfWApO1xuICAgICAgICAgIGVsc2Ugc2V0U3RhdHVzKCdDb3VsZCBub3QgY2FwdHVyZSBhbmNlc3RvcicsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNydW1icy5hcHBlbmQoY2hpcCk7XG4gICAgICB9KTtcbiAgICAgIGRpdi5hcHBlbmQoY3J1bWJzKTtcbiAgICB9XG5cbiAgICAvLyBQcmV2aWV3IHRpbGUg4oCUIG9ubHkgd2hlbiB3ZSBoYXZlIGEgdGh1bWJuYWlsIGRhdGFVcmwgaW4gdGhlIGluLW1lbW9yeVxuICAgIC8vIHNob3RzIG1hcC4gVGhlIGZ1bGwgUE5HIGxpdmVzIG9uIGRpc2sgdW5kZXIgLnBpbmNoZ3JhYi88d3M+L3NjcmVlbnNob3RzLztcbiAgICAvLyB0aGUgZGF0YVVybCBpcyBqdXN0IGEgc2lkZS1wYW5lbC1mcmllbmRseSBkb3duc2NhbGUgKOKJpDMyMHB4IHdpZGUpLlxuICAgIGNvbnN0IHNob3REYXRhVXJsID0gc2hvdHMuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGlmIChzaG90RGF0YVVybCkge1xuICAgICAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJldmlldy5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgIGltZy5jbGFzc05hbWUgPSAnc2hvdCc7XG4gICAgICBpbWcuc3JjID0gc2hvdERhdGFVcmw7XG4gICAgICBpbWcuYWx0ID0gYFNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWA7XG4gICAgICBwcmV2aWV3LmFwcGVuZChpbWcpO1xuICAgICAgZGl2LmFwcGVuZChwcmV2aWV3KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0YXRzLmNsYXNzTmFtZSA9ICdlbnQtc3RhdHMnO1xuICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgY29uc3QgbXlUb2tlbnMgPSB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG0uZW50cnkpKTtcbiAgICBjb25zdCB0b3RhbFRva2VucyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtbSk6IG1tIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnJlZHVjZSgocywgbW0pID0+IHMgKyB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG1tLmVudHJ5KSksIDApO1xuICAgIGNvbnN0IHNoYXJlUGN0ID0gdG90YWxUb2tlbnMgPiAwID8gTWF0aC5yb3VuZCgobXlUb2tlbnMgLyB0b3RhbFRva2VucykgKiAxMDApIDogMDtcbiAgICBjb25zdCBncm91cENvdW50ID0gbS5lbnRyeS5ncm91cD8ubGVuZ3RoID8/IDA7XG4gICAgY29uc3QgZ3JvdXBUb2tlbnMgPSAobS5lbnRyeS5ncm91cCA/PyBbXSkucmVkdWNlKChzLCBnKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShnKSksIDApO1xuICAgIHR5cGUgU3RhdENlbGwgPSB7bGFiZWw6IHN0cmluZzsgdmFsdWU6IHN0cmluZzsgdGlwOiBzdHJpbmd9O1xuICAgIGNvbnN0IGNlbGxzOiBTdGF0Q2VsbFtdID0gW1xuICAgICAge2xhYmVsOiAnSFRNTCcsIHZhbHVlOiBgJHttLmVudHJ5Lm91dGVySFRNTD8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnT3V0ZXIgSFRNTCBjaGFyIGxlbmd0aCd9LFxuICAgICAge2xhYmVsOiAnVG9rZW5zJywgdmFsdWU6IGAke215VG9rZW5zfWAsIHRpcDogJ0FwcHJveCBMTE0gdG9rZW5zIGZvciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdTaGFyZScsIHZhbHVlOiBgJHtzaGFyZVBjdH0lYCwgdGlwOiAnVG9rZW4gc2hhcmUgb2YgYWxsIHNlbGVjdG9ycyd9LFxuICAgICAge2xhYmVsOiAnQ29tbWVudHMnLCB2YWx1ZTogYCR7ZmIubGVuZ3RofWAsIHRpcDogJ0lubGluZSBjb21tZW50cyB0aHJlYWRlZCB1bmRlciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdSdWxlcycsIHZhbHVlOiBgJHttLmVudHJ5Lm1hdGNoZWRSdWxlcz8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnTWF0Y2hlZCBDU1MgcnVsZXMnfSxcbiAgICAgIHtsYWJlbDogJ1N0eWxlcycsIHZhbHVlOiBgJHtPYmplY3Qua2V5cyhtLmVudHJ5LnN0eWxlcyA/PyB7fSkubGVuZ3RofWAsIHRpcDogJ0NvbXB1dGVkLXN0eWxlIGZpZWxkcyBrZXB0J30sXG4gICAgXTtcbiAgICBpZiAoZ3JvdXBDb3VudCkge1xuICAgICAgY2VsbHMucHVzaCh7bGFiZWw6ICdHcm91cCcsIHZhbHVlOiBgJHtncm91cENvdW50fWAsIHRpcDogJ01lbWJlcnMgZm9sZGVkIGludG8gdGhpcyBncm91cCd9KTtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAgVCcsIHZhbHVlOiBgJHtncm91cFRva2Vuc31gLCB0aXA6ICdUb2tlbnMgY29udHJpYnV0ZWQgYnkgZ3JvdXAgbWVtYmVycyd9KTtcbiAgICB9XG4gICAgc3RhdHMuaW5uZXJIVE1MID0gY2VsbHMubWFwKChjKSA9PlxuICAgICAgYDxzcGFuIGNsYXNzPVwiZW50LXN0YXRcIiBkYXRhLXRpcD1cIiR7ZXNjYXBlSHRtbChjLnRpcCl9XCI+PHNwYW4gY2xhc3M9XCJsYmxcIj4ke2MubGFiZWx9PC9zcGFuPjxzcGFuIGNsYXNzPVwidmFsXCI+JHtjLnZhbHVlfTwvc3Bhbj48L3NwYW4+YCxcbiAgICApLmpvaW4oJycpO1xuICAgIGRpdi5hcHBlbmQoc3RhdHMpO1xuXG4gICAgLy8g4pSA4pSAIEpTT04gcGFuZSB3aXRoIHRvb2xiYXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy8gVG9vbGJhciBhYm92ZSB0aGUgSlNPTiBib2R5OiBsZWZ0ID0gbGluZS13cmFwIHRvZ2dsZSwgcmlnaHQgPSBjb3B5LlxuICAgIC8vIFRoZSBKU09OIGl0c2VsZiByZWZsZWN0cyB0aGUgZ2xvYmFsIGBtaW5pZnlgIHNldHRpbmcgc28gdGhlIHVzZXIgc2Vlc1xuICAgIC8vIHRoZSBzYW1lIHNoYXBlIHRoYXQgd2lsbCBlbmQgdXAgaW4gdGhlIGV4cG9ydC5cbiAgICBjb25zdCBqc29uV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25XcmFwLmNsYXNzTmFtZSA9ICdib2R5LWpzb24td3JhcCc7XG4gICAgY29uc3QganNvbkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25CYXIuY2xhc3NOYW1lID0gJ2JvZHktanNvbi1iYXInO1xuXG4gICAgLy8gTGluZS13cmFwIGNoZWNrYm94IChwZXItYnViYmxlIGxvY2FsIHN0YXRlLCBkZWZhdWx0IE9OKS5cbiAgICBjb25zdCB3cmFwTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHdyYXBMYWJlbC5jbGFzc05hbWUgPSAnanNvbi13cmFwLXRvZ2dsZSc7XG4gICAgd3JhcExhYmVsLmRhdGFzZXQudGlwID0gJ1dyYXAgbG9uZyBsaW5lcyBpbnN0ZWFkIG9mIGhvcml6b250YWwgc2Nyb2xsJztcbiAgICBjb25zdCB3cmFwQ2hlY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHdyYXBDaGVjay50eXBlID0gJ2NoZWNrYm94JztcbiAgICB3cmFwQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgd3JhcExhYmVsLmFwcGVuZCh3cmFwQ2hlY2ssIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgV3JhcCcpKTtcbiAgICBqc29uQmFyLmFwcGVuZCh3cmFwTGFiZWwpO1xuXG4gICAgLy8gQ29weSBidXR0b24gKG1pcnJvcnMgdGhlIFwiQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTlwiIGFjdGlvbiBiZWxvdyxcbiAgICAvLyBzdXJmYWNlZCBhdCB0aGUgdG9wIHNvIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBzY3JvbGwgcGFzdCB0aGUgSlNPTlxuICAgIC8vIHRvIGZpbmQgaXQpLlxuICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb3B5QnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb3B5QnRuLmNsYXNzTmFtZSA9ICdpY29uYnRuIGpzb24tY29weSc7XG4gICAgY29weUJ0bi5kYXRhc2V0LnRpcCA9ICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJztcbiAgICBjb3B5QnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb3B5IGNhcHR1cmUgYXMgSlNPTicpO1xuICAgIGNvcHlCdG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjb3B5JywgMTMpO1xuICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIC8vIEhvbm9yIHRoZSBzYW1lIHNoYXBlIHRoZSBKU09OIGJlbG93IHNob3dzLlxuICAgICAgY29uc3QgcGF5bG9hZCA9IHByZWZzLm1pbmlmeSA/IHNsaW1FbnRyeShtLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlfSkgOiBtLmVudHJ5O1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgcHJlZnMubWluaWZ5ID8gMCA6IDIpKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIEpTT04nKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBKU09OJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KTtcbiAgICBqc29uQmFyLmFwcGVuZChjb3B5QnRuKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoanNvbkJhcik7XG5cbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9keS5jbGFzc05hbWUgPSAnYm9keS1qc29uIHdyYXAtb24nO1xuICAgIC8vIFJlZmxlY3QgdGhlIG1pbmlmeSBwcmVmOiB3aGVuIG1pbmlmaWVkLCBzaG93IHRoZSBzbGltRW50cnktc2hhcGVkXG4gICAgLy8gZXhwb3J0IGZvcm0gKGNvbXBhY3QsIHNpbmdsZS1saW5lKS4gT3RoZXJ3aXNlIHByZXR0eS1wcmludCB0aGUgZnVsbFxuICAgIC8vIGVudHJ5IHNvIGl0J3MgcmVhZGFibGUuXG4gICAgY29uc3QgcmVuZGVySnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBwcmVmcy5taW5pZnkgPyBzbGltRW50cnkobS5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZX0pIDogbS5lbnRyeTtcbiAgICAgIGNvbnN0IHRleHQgPSBKU09OLnN0cmluZ2lmeShwYXlsb2FkLCBudWxsLCBwcmVmcy5taW5pZnkgPyAwIDogMik7XG4gICAgICBhcHBlbmRKc29uSGlnaGxpZ2h0KGJvZHksIHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG5cbiAgICAgIH0gZWxzZSBzZXRTdGF0dXMoJ1JlLWNhcHR1cmUgZmFpbGVkJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTicsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KEpTT04uc3RyaW5naWZ5KG0uZW50cnkpKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGVudHJ5Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgZW50cnknLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJGZWVkYmFjayA9IChtOiBGZWVkYmFja01lc3NhZ2UsIGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayc7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChtLnRleHQsIHNlYXJjaFF1ZXJ5KTtcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSB7XG4gICAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgc2VsZWN0b3Ig4oCUIHByZWZlciBwYXJlbnRVaWQgKHRoZSBwZXJzaXN0ZWQgRkspXG4gICAgICAvLyBvdmVyIGNhcHR1cmUtYWRqYWNlbmN5LCBzaW5jZSBkcmFnLXRvLXJlcGFyZW50IG1vdmVzIHRoZSBjaGlwIGJ1dFxuICAgICAgLy8gdGhlIHRyYWlsaW5nLXNlbGVjdG9yIGhldXJpc3RpYyBnaXZlcyBzdGFsZSByZXN1bHRzIHVudGlsIHJlbmRlclxuICAgICAgLy8gc2V0dGxlcy4gVGhlIGFubm90YXRpb24gb3ZlcmxheSBuZWVkcyB0aGUgcGFyZW50J3Mgc2VsZWN0b3IgdG9cbiAgICAgIC8vIGFuY2hvciB0aGUgb24tcGFnZSB0b29sdGlwLlxuICAgICAgY29uc3Qge3BhcmVudFNlbCwgcGFyZW50VWlkfSA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkge1xuICAgICAgICAgIGNvbnN0IHAgPSBtZXNzYWdlcy5maW5kKFxuICAgICAgICAgICAgKG1tKSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InICYmIChtbSBhcyBTZWxlY3Rvck1lc3NhZ2UpLmVudHJ5LnVpZCA9PT0gbS5wYXJlbnRVaWQsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAocCAmJiBwLnR5cGUgPT09ICdzZWxlY3RvcicpIHJldHVybiB7cGFyZW50U2VsOiBwLmVudHJ5LnNlbGVjdG9yLCBwYXJlbnRVaWQ6IHAuZW50cnkudWlkfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3BhcmVudFNlbDogbGFzdFNlbGVjdG9yU2VsLCBwYXJlbnRVaWQ6IHVuZGVmaW5lZCBhcyBzdHJpbmcgfCB1bmRlZmluZWR9O1xuICAgICAgfSkoKTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogcGFyZW50U2VsLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIC8vIFNjcm9sbCB0aGUgcGFyZW50IGVsZW1lbnQgaW50byB2aWV3ICsgc2hvdyB0aGUgb24tcGFnZVxuICAgICAgICAvLyBhbm5vdGF0aW9uIHRvb2x0aXAgcmVuZGVyaW5nIFRISVMgY29tbWVudCdzIHRleHQuIFBhc3MgdGhlXG4gICAgICAgIC8vIHBhcmVudCdzIHVpZCBzbyBhIHNhbWUtc2VsZWN0b3Igc2libGluZyBjYXB0dXJlIGRvZXNuJ3QgZ2V0XG4gICAgICAgIC8vIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBcInRoZSBzYW1lIHRhcmdldFwiIGJ5IHRoZSBjb250ZW50XG4gICAgICAgIC8vIHNjcmlwdCdzIGFubm90YXRpb24gb3ZlcmxheS5cbiAgICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHtcbiAgICAgICAgICBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRUb0NTKHtcbiAgICAgICAgICBraW5kOiAnYW5ub3RhdGlvbicsXG4gICAgICAgICAgc2VsZWN0b3I6IHBhcmVudFNlbCxcbiAgICAgICAgICBwYXlsb2FkOiB7c2VsZWN0b3I6IHBhcmVudFNlbCwgdWlkOiBwYXJlbnRVaWQsIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFjazogW20udGV4dF19LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ30pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGRpdi5kYXRhc2V0LmNvbW1lbnRJZCA9IG0uaWQ7XG4gICAgY29uc3QgYmVnaW5Db21tZW50RHJhZyA9IChlOiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnLCBtLmlkKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCd0ZXh0L3BsYWluJywgbS50ZXh0KTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICB9O1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICBjb25zdCBkcmFnSGFuZGxlID0gYWN0aW9uQnRuKCdncmlwJywgJ0RyYWcgdGhpcyBoYW5kbGUgb250byBhIHNlbGVjdG9yIHRvIHJlcGFyZW50JywgKCkgPT4geyAvKiBkcmFnIGhhbmRsZSBvbmx5ICovIH0pO1xuICAgIGRyYWdIYW5kbGUuY2xhc3NMaXN0LmFkZCgnZHJhZy1oYW5kbGUnKTtcbiAgICBkcmFnSGFuZGxlLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBiZWdpbkNvbW1lbnREcmFnKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkcmFnSGFuZGxlKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSBjb21tZW50IHRleHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChtLnRleHQpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY29tbWVudCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNvbW1lbnQnKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdwZW5jaWwnLCAnRWRpdCBjb21tZW50JywgKCkgPT4gZW50ZXJGZWVkYmFja0VkaXQoZGl2LCBtKSwge3NpemU6IDE1fSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIC8vIERyb3AgaGFuZGxlciBzaGFyZWQgYnkgZXZlcnkgc2VsZWN0b3IgYnViYmxlLiBBY2NlcHRzIGEgZHJhZ2dlZFxuICAvLyBjb21tZW50IElEIHZpYSB0aGUgYGFwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnRgIE1JTUUsIHVwZGF0ZXNcbiAgLy8gcGFyZW50VWlkICsgYWRqYWNlbmN5LCBwZXJzaXN0cywgcmUtcmVuZGVycy5cbiAgY29uc3Qgd2lyZVNlbGVjdG9yRHJvcFRhcmdldCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBTZWxlY3Rvck1lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgICAgY29uc3QgdHlwZXMgPSBlLmRhdGFUcmFuc2Zlcj8udHlwZXM7XG4gICAgICBpZiAoIXR5cGVzIHx8ICFBcnJheS5mcm9tKHR5cGVzKS5pbmNsdWRlcygnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJvcC10YXJnZXQnKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0JykpO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpO1xuICAgICAgY29uc3QgaWQgPSBlLmRhdGFUcmFuc2Zlcj8uZ2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpO1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3JjSWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IGlkKTtcbiAgICAgIGlmIChzcmNJZHggPCAwKSByZXR1cm47XG4gICAgICBjb25zdCBzcmMgPSBtZXNzYWdlc1tzcmNJZHhdISBhcyBGZWVkYmFja01lc3NhZ2U7XG4gICAgICBpZiAoc3JjLnR5cGUgIT09ICdmZWVkYmFjaycpIHJldHVybjtcbiAgICAgIGNvbnN0IGRzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGlmIChkc3RJZHggPCAwKSByZXR1cm47XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgLy8gVXBkYXRlIHRoZSBGSyBwb2ludGVyIGZpcnN0IOKAlCB0aGF0J3MgdGhlIHNvdXJjZSBvZiB0cnV0aCBpblxuICAgICAgLy8gZXhwb3J0cy4gQWRqYWNlbmN5IGlzIGp1c3QgYSByZW5kZXIgY29udmVuaWVuY2UuXG4gICAgICBzcmMucGFyZW50VWlkID0gbS5lbnRyeS51aWQ7XG4gICAgICAvLyBTcGxpY2Ugc3JjIG91dCBvZiBpdHMgY3VycmVudCBzbG90IGFuZCByZS1pbnNlcnQgcmlnaHQgYWZ0ZXIgdGhlXG4gICAgICAvLyBuZXcgcGFyZW50IChhbmQgYW55IGZlZWRiYWNrIGFscmVhZHkgdHJhaWxpbmcgaXQsIHNvIHRoZSBtb3N0LVxuICAgICAgLy8gcmVjZW50IGZlZWRiYWNrIGVuZHMgdXAgbmVhcmVzdCB0aGUgcGFyZW50IHZpc3VhbGx5KS5cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShzcmNJZHgsIDEpO1xuICAgICAgY29uc3QgbmV3RHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgbGV0IGluc2VydEF0ID0gbmV3RHN0SWR4ICsgMTtcbiAgICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0hLnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHNyYyk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCByZXBhcmVudGVkJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdHlwZSBBY3Rpb25CdG5PcHRzID0ge3dhcm4/OiBib29sZWFuOyB0b2dnbGVkPzogYm9vbGVhbjsgc2l6ZT86IG51bWJlcn07XG4gIGNvbnN0IGFjdGlvbkJ0biA9IChpY29uOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGZuOiAoKSA9PiB2b2lkLCBvcHRzOiBBY3Rpb25CdG5PcHRzID0ge30pOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuZGF0YXNldC50aXAgPSB0aXRsZTtcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRpdGxlKTtcbiAgICBpZiAob3B0cy53YXJuKSBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBpZiAob3B0cy50b2dnbGVkKSBiLmNsYXNzTGlzdC5hZGQoJ3RvZ2dsZWQnKTtcbiAgICAvLyBEZWZhdWx0IGljb24gc2l6ZSAxMyByZWFkcyBzbGlnaHRseSBzbWFsbCBpbiBhIDIyw5cyMiBidXR0b24g4oCUIGZpbmVcbiAgICAvLyBmb3IgaWNvbnMgd2l0aCBzaW1wbGUgc2hhcGVzIChjcm9zc2hhaXIsIGxpc3QtdHJlZSwgdW5kbykgYnV0IHZpc2libHlcbiAgICAvLyBzcXVlZXplZCBmb3IgYG1lc3NhZ2Utc3F1YXJlLXBsdXNgIGFuZCBgcGVuY2lsYCwgd2hlcmUgdGhlXG4gICAgLy8gaW50ZXJpb3Igc3Ryb2tlcyB2YW5pc2ggaW50byBoYWlybGluZSBibHVyLiBDYWxsZXJzIGNhbiBidW1wIHdpdGhcbiAgICAvLyBgc2l6ZTogMTVgIGZvciB0aG9zZS5cbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhpY29uLCBvcHRzLnNpemUgPz8gMTMpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBmbigpOyB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBkZWxldGVCdG4gPSAob25Db25maXJtOiAoKSA9PiB2b2lkKTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBiLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSc7XG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMyk7XG4gICAgbGV0IHBhcmVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmV2ZXJ0VGltZXIgPSAwO1xuICAgIGNvbnN0IHJldmVydCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGFyZW50KSByZXR1cm47XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb25maXJtLXllcywgLmNvbmZpcm0tbm8nKSkgbi5yZW1vdmUoKTtcbiAgICAgIGlmICghYi5wYXJlbnRFbGVtZW50KSBwYXJlbnQuYXBwZW5kKGIpO1xuICAgICAgY2xlYXJUaW1lb3V0KHJldmVydFRpbWVyKTtcbiAgICB9O1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHBhcmVudCA9IGIucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgeWVzLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIHllcy5jbGFzc05hbWUgPSAnY29uZmlybS15ZXMnO1xuICAgICAgeWVzLmRhdGFzZXQudGlwID0gJ0NvbmZpcm0gZGVsZXRlJztcbiAgICAgIHllcy5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMTMpO1xuICAgICAgeWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgb25Db25maXJtKCk7IH0pO1xuICAgICAgY29uc3Qgbm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIG5vLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIG5vLmNsYXNzTmFtZSA9ICdjb25maXJtLW5vJztcbiAgICAgIG5vLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBkZWxldGUnO1xuICAgICAgbm8uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgICAgbm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyB9KTtcbiAgICAgIGIucmVwbGFjZVdpdGgoeWVzKTtcbiAgICAgIHllcy5hZnRlcihubyk7XG4gICAgICByZXZlcnRUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHJldmVydCwgODAwMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZW50ZXJGZWVkYmFja0VkaXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogRmVlZGJhY2tNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5leHQuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayBlZGl0aW5nJztcbiAgICBpZiAoZGl2LmNsYXNzTGlzdC5jb250YWlucygndGhyZWFkZWQnKSkgbmV4dC5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIG5leHQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgbmV4dC5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgIGluaXRpYWw6IG0udGV4dCxcbiAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGRpdi5yZXBsYWNlV2l0aChkaXYuY2xvbmVOb2RlKHRydWUpKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvblN1Ym1pdDogKHRleHQpID0+IHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkID09PSBtLnRleHQpIHsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLnRleHQgPSB0cmltbWVkO1xuICAgICAgICAvLyBTZXZlcml0eSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFVJLiBTdHJpcCBhbnkgbGVnYWN5IHZhbHVlXG4gICAgICAgIC8vIHRoYXQgY2FtZSBiYWNrIGZyb20gYW4gb2xkZXIgSlNPTkwgaW1wb3J0IHNvIHNhdmVzIGRvbid0IGtlZXBcbiAgICAgICAgLy8gcmUtZW1pdHRpbmcgaXQuXG4gICAgICAgIGRlbGV0ZSAobSBhcyBhbnkpLnNldmVyaXR5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICB9KSk7XG4gICAgZGl2LnJlcGxhY2VXaXRoKG5leHQpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZU1lc3NhZ2UgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5pZCAhPT0gaWQpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0RlbGV0ZWQnKTtcbiAgICB9O1xuICAgIGlmICghZWwpIHsgZmluaXNoKCk7IHJldHVybjsgfVxuICAgIGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdyZW1vdmluZycpO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpOiB2b2lkID0+IHsgaWYgKGRvbmUpIHJldHVybjsgZG9uZSA9IHRydWU7IGZpbmlzaCgpOyB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBjbGVhbnVwLCB7b25jZTogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoY2xlYW51cCwgMzgwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQ29tcG9zZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRGZWVkYmFjayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gY29tcG9zZXIudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBpbi1tZW1vcnkgbWVzc2FnZSBhdCBjcmVhdGlvbiB0aW1lIHNvIHRoZVxuICAgIC8vIEZLIGlzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoLiBUaGUgc2xpbSBlbWl0IG5vIGxvbmdlciBoYXMgdG9cbiAgICAvLyBpbmZlciB0aGUgcGFyZW50IGZyb20gY2FwdHVyZS1hZGphY2VuY3ksIGFuZCBgbWFuaWZlc3QuY291bnRzYFxuICAgIC8vIGFjY3VyYXRlbHkgcmVmbGVjdHMgZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMuXG4gICAgLy8gV2FsayBiYWNrIHRvIHRoZSBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3RvciBiZWZvcmUgc3BsaWNlLlxuICAgIGxldCBwSWR4ID0gcG9zaXRpb24gLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfSk7XG4gICAgY29tcG9zZXIudmFsdWUgPSAnJztcbiAgICB1cGRhdGVDb21wb3Nlck1ldGVyKCk7XG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7IHNlYXJjaFF1ZXJ5ID0gJyc7IHNlYXJjaC52YWx1ZSA9ICcnOyB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnU2VudCcpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgLy8gQnVnICMyOiBmZWVkYmFjaydzIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAhcGFyZW50LmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudCBhcyBTZWxlY3Rvck1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgKGUpID0+IHtcbiAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIoKTtcbiAgICAgIGlmICghaGFuZGxlZCkgc2VuZEZlZWRiYWNrKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlQ29tcG9zZXJNZXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ID0gY29tcG9zZXIudmFsdWU7XG4gICAgY29tcFdvcmRzLnRleHRDb250ZW50ID0gU3RyaW5nKHdvcmRDb3VudCh0KSk7XG4gICAgY29tcFRva2Vucy50ZXh0Q29udGVudCA9IFN0cmluZyh0b2tlbkNvdW50KHQpKTtcbiAgICBjb21wb3Nlci5jbGFzc0xpc3QudG9nZ2xlKCdjbWQtbW9kZScsIC9ePi8udGVzdCh0LnRyaW0oKSkpO1xuICB9O1xuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHVwZGF0ZUNvbXBvc2VyTWV0ZXIpO1xuXG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcbiAgICBzZWFyY2hRdWVyeSA9IHNlYXJjaC52YWx1ZS50cmltKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgLy8gQnJpbmcgdGhlIGZpcnN0IG1hdGNoZWQgYnViYmxlICsgaXRzIGZpcnN0IDxtYXJrPiBpbnRvIHZpZXcsIHNvIHRoZVxuICAgIC8vIHVzZXIgc2VlcyB3aGVyZSB0aGUgaGl0IGlzIHdpdGhvdXQgc2Nyb2xsaW5nIG1hbnVhbGx5LlxuICAgIGlmIChzZWFyY2hRdWVyeSkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlyc3RIaXQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnLnNlbGVjdG9yLnNlYXJjaC1oaXQnKTtcbiAgICAgICAgaWYgKGZpcnN0SGl0KSB7XG4gICAgICAgICAgZmlyc3RIaXQuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInfSk7XG4gICAgICAgICAgY29uc3QgbWsgPSBmaXJzdEhpdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignbWFyaycpO1xuICAgICAgICAgIG1rPy5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcid9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBmaXJzdE1hdGNoID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZyBtYXJrJyk7XG4gICAgICAgICAgZmlyc3RNYXRjaD8uc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHsgaWYgKHBhbGV0dGUuaGlkZGVuKSBvcGVuUGFsZXR0ZShzZWFyY2gudmFsdWUgfHwgJycpOyB9KTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpZiAocGFsZXR0ZS5oaWRkZW4pIG9wZW5QYWxldHRlKHNlYXJjaC52YWx1ZSB8fCAnJyk7IH0pO1xuICAkKCdbZGF0YS1zZWFyY2gtY2xlYXJdJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IHNlYXJjaC52YWx1ZSA9ICcnOyBzZWFyY2hRdWVyeSA9ICcnOyByZW5kZXIoKTsgfSk7XG5cbiAgY29uc3QgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlciA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICBjb25zdCBtID0gL14+XFxzKiguKykkLy5leGVjKGNvbXBvc2VyLnZhbHVlLnRyaW0oKSk7XG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3Qgc2VsID0gbVsxXSEudHJpbSgpO1xuICAgIGlmICghc2VsKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e29rOiBib29sZWFufT4oe2tpbmQ6ICdtYW51YWwtY2FwdHVyZScsIHNlbGVjdG9yOiBzZWx9KTtcbiAgICBpZiAocmVwbHk/Lm9rKSB7IGNvbXBvc2VyLnZhbHVlID0gJyc7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgc2V0U3RhdHVzKCdDYXB0dXJlZCAnICsgc2VsKTsgfVxuICAgIGVsc2Ugc2V0U3RhdHVzKCdTZWxlY3RvciBkaWQgbm90IG1hdGNoOiAnICsgc2VsLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydCBidWlsZGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gdjIgZXhwb3J0IHNoYXBlOiB0b3AgbGV2ZWwga2VlcHMgdXNlci1mYWNpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzXG4gIC8vICh1aWQsIG4sIHNlbGVjdG9yLCB0ZXh0LCByb2xlLCBhdHRycywgaGludHMsIGNsYXNzZXMsIHN0eWxlcywgY29tcG9uZW50LFxuICAvLyBzdGF0ZXMsIHNjcmVlbnNob3QsIGdyb3VwKS4gRGlhZ25vc3RpYyAvIGRldGVjdGlvbiBtZXRhZGF0YSBtb3ZlcyB1bmRlclxuICAvLyBhbiBgX2F1ZGl0YCBuYW1lc3BhY2UgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwgaW5TaGFkb3dET00sXG4gIC8vIHBzZXVkb0VsZW1lbnRzLCBtYXRjaGVkUnVsZXMsIHZpZXdwb3J0KS4gVGhlIHZlcnNpb24gbWFya2VyIGlzIGVtaXR0ZWRcbiAgLy8gYXMgYHY6IDJgLiBJbXBvcnRlcnMgZGV0ZWN0IGVpdGhlciB2MSAoZmxhdCkgb3IgdjIgYW5kIGRlbm9ybWFsaXplLlxuICAvL1xuICAvLyBBZ2dyZXNzaXZlIG1pbmlmeSBhZGRpdGlvbmFsbHkgZHJvcHMgZmllbGRzIHRoZSBzZWxlY3RvciBhbHJlYWR5XG4gIC8vIGltcGxpZXM6IGFuY2VzdG9ycywgdmlld3BvcnQgKG9uZSBwZXIgcGFnZSksIGNvbXBvbmVudFJvb3Qgd2hlblxuICAvLyByZWR1bmRhbnQgd2l0aCB0aGUgc2VsZWN0b3IsIGFuZCBwc2V1ZG9FbGVtZW50cy5cbiAgY29uc3Qgc2xpbUVudHJ5ID0gKGU6IEVudHJ5LCBvcHRzOiB7aW5jbHVkZUdyb3VwPzogYm9vbGVhbjsgZXZlbnRJbmRleD86IG51bWJlcjsgdmlzdWFsT3JkZXI/OiBudW1iZXI7IGdyb3VwVWlkPzogc3RyaW5nfSA9IHt9KTogUmVjb3JkPHN0cmluZywgYW55PiA9PiB7XG4gICAgY29uc3QgaW5jbHVkZU91dGVyID0gcHJlZnMuaW5jbHVkZU91dGVySFRNTDtcbiAgICBjb25zdCBpbmNsdWRlTWF0Y2hlZCA9IHByZWZzLmluY2x1ZGVNYXRjaGVkUnVsZXM7XG4gICAgY29uc3QgaW5jbHVkZVN0eWxlcyA9IHByZWZzLmluY2x1ZGVTdHlsZXM7XG4gICAgY29uc3QgbWluaWZ5ID0gcHJlZnMubWluaWZ5O1xuXG4gICAgLy8gVG9wLWxldmVsIHVzZXItZmFjaW5nIGZpZWxkcy4gT3JkZXIgbWF0dGVycyBmb3Igb3V0cHV0IHJlYWRhYmlsaXR5IOKAlFxuICAgIC8vIHdlIHdhbnQgYHYgLyB0eXBlIC8gdWlkIC8gbiAvIHNlbGVjdG9yYCBmaXJzdCBzbyBKU09OTCBpcyBncmVwcGFibGUuXG4gICAgLy9cbiAgICAvLyBgbmAgc3RheXMgYXMgdGhlIGNhcHR1cmUtc2VxdWVuY2UgZGlzcGxheSBsYWJlbCBmb3IgYmFja3dhcmRzXG4gICAgLy8gY29tcGF0aWJpbGl0eSB3aXRoIHYxL3YyIHJlYWRlcnMgKGFuZCB0aGUgc2lkZWJhcidzIFwiIzNcIiBjaGlwcykuXG4gICAgLy8gVGhlIGRpc2FtYmlndWF0ZWQgY291c2lucyAoYGNhcHR1cmVJbmRleGAsIGBldmVudEluZGV4YCxcbiAgICAvLyBgdmlzdWFsT3JkZXJgLCBgZGlzcGxheUxhYmVsYCkgbGl2ZSBvbiB0aGUgcm93IHNvIGEgZG93bnN0cmVhbVxuICAgIC8vIGFnZW50IGNhbiBwaWNrIHdoaWNoZXZlciBvcmRlcmluZyBpcyBtZWFuaW5nZnVsIOKAlCBidWcgIzEwLlxuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHY6IDIsXG4gICAgICB0eXBlOiAnc2VsZWN0b3InLFxuICAgICAgdWlkOiBlLnVpZCxcbiAgICAgIG46IGUubixcbiAgICAgIHRzOiBlLnRzLFxuICAgICAgdXJsOiBlLnVybCxcbiAgICAgIHRhZzogZS50YWcsXG4gICAgICBzZWxlY3RvcjogZS5zZWxlY3RvcixcbiAgICAgIGNhcHR1cmVJbmRleDogZS5uLFxuICAgICAgZGlzcGxheUxhYmVsOiBTdHJpbmcoZS5uKSxcbiAgICB9O1xuICAgIGlmIChvcHRzLmV2ZW50SW5kZXggIT09IHVuZGVmaW5lZCkgb3V0LmV2ZW50SW5kZXggPSBvcHRzLmV2ZW50SW5kZXg7XG4gICAgaWYgKG9wdHMudmlzdWFsT3JkZXIgIT09IHVuZGVmaW5lZCkgb3V0LnZpc3VhbE9yZGVyID0gb3B0cy52aXN1YWxPcmRlcjtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS50ZXh0ICE9PSB1bmRlZmluZWQpIG91dC50ZXh0ID0gbWluaWZ5ID8gZS50ZXh0LnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLnRleHQ7XG4gICAgaWYgKGUucm9sZSAhPT0gdW5kZWZpbmVkKSBvdXQucm9sZSA9IGUucm9sZTtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSAhPT0gdW5kZWZpbmVkKSBvdXQuYWNjZXNzaWJsZU5hbWUgPSBtaW5pZnkgPyBlLmFjY2Vzc2libGVOYW1lLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLmFjY2Vzc2libGVOYW1lO1xuICAgIGlmIChlLmlkICE9PSB1bmRlZmluZWQpIG91dC5pZCA9IGUuaWQ7XG4gICAgaWYgKGUudGVzdElkICE9PSB1bmRlZmluZWQpIG91dC50ZXN0SWQgPSBlLnRlc3RJZDtcbiAgICBpZiAoZS5jbGFzc2VzICYmIGUuY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIG91dC5jbGFzc2VzID0gKG1pbmlmeSAmJiBlLmNsYXNzZXMubGVuZ3RoID4gOCkgPyBlLmNsYXNzZXMuc2xpY2UoMCwgOCkgOiBlLmNsYXNzZXM7XG4gICAgfVxuICAgIGlmIChlLmF0dHJzICYmIE9iamVjdC5rZXlzKGUuYXR0cnMpLmxlbmd0aCkgb3V0LmF0dHJzID0gZS5hdHRycztcbiAgICBpZiAoZS5oaW50cyAmJiBPYmplY3Qua2V5cyhlLmhpbnRzKS5sZW5ndGgpIG91dC5oaW50cyA9IGUuaGludHM7XG4gICAgaWYgKGUucmVjdCkgb3V0LnJlY3QgPSBlLnJlY3Q7XG4gICAgaWYgKGUuc3RhdGVzICYmIGUuc3RhdGVzLmxlbmd0aCkgb3V0LnN0YXRlcyA9IGUuc3RhdGVzO1xuICAgIGlmIChlLmNvbXBvbmVudCkgb3V0LmNvbXBvbmVudCA9IGUuY29tcG9uZW50O1xuICAgIC8vIExvY2F0b3ItcXVhbGl0eSBmaWVsZC4gUHJvbW90ZSBldmVuIHdoZW4gbWluaWZpZWQg4oCUIGl0J3MgYSBzaW5nbGVcbiAgICAvLyBzbWFsbCBpbnQgYW5kIGEgZG93bnN0cmVhbSBhZ2VudCB1c2VzIGl0IHRvIGRlY2lkZSB3aGV0aGVyIHRvXG4gICAgLy8gdHJ1c3QgdGhlIHNlbGVjdG9yLlxuICAgIGlmIChlLnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSBvdXQuc2VsZWN0b3JNYXRjaENvdW50ID0gZS5zZWxlY3Rvck1hdGNoQ291bnQ7XG4gICAgaWYgKGUuYTExeSkgb3V0LmExMXkgPSBlLmExMXk7XG4gICAgaWYgKGUuYXNzZXRzICYmIGUuYXNzZXRzLmxlbmd0aCkgb3V0LmFzc2V0cyA9IGUuYXNzZXRzO1xuICAgIGlmIChlLmxheW91dENvbnRleHQgJiYgZS5sYXlvdXRDb250ZXh0Lmxlbmd0aCkgb3V0LmxheW91dENvbnRleHQgPSBlLmxheW91dENvbnRleHQ7XG4gICAgaWYgKGluY2x1ZGVPdXRlciAmJiBlLm91dGVySFRNTCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXQub3V0ZXJIVE1MID0gbWluaWZ5ID8gZS5vdXRlckhUTUwucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUub3V0ZXJIVE1MO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZVN0eWxlcyAmJiBlLnN0eWxlcyAmJiBPYmplY3Qua2V5cyhlLnN0eWxlcykubGVuZ3RoKSBvdXQuc3R5bGVzID0gZS5zdHlsZXM7XG4gICAgaWYgKGUuc2NyZWVuc2hvdCkge1xuICAgICAgLy8gUGF0aCBub3JtYWxpemF0aW9uOiB0aGUgbGl2ZSBgZW50cnkuc2NyZWVuc2hvdC5lbGVtZW50YCBjYXJyaWVzIGFcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXhlZCBwYXRoIChlLmcuIGBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmdgKVxuICAgICAgLy8gYmVjYXVzZSB0aGUgYmFja2dyb3VuZCdzIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgQVBJIHN0YW1wc1xuICAgICAgLy8gdGhlIHdvcmtzcGFjZSBpbnRvIHRoZSBvbi1kaXNrIHBhdGguIEJ1dCB0aGUgLnRhci56c3QgYXJjaGl2ZVxuICAgICAgLy8gYnVuZGxlcyBzY3JlZW5zaG90cyBmbGF0IGF0IGBzY3JlZW5zaG90cy9mb28ucG5nYCwgc28gdGhlXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4IHdvdWxkIHJlc29sdmUgdG8gbm90aGluZyBmb3IgYW4gYWdlbnQgdGhhdFxuICAgICAgLy8gZXh0cmFjdGVkIHRoZSBhcmNoaXZlLiBTdHJpcCB0aGUgd29ya3NwYWNlIHByZWZpeCBvbiBlbWl0IHNvXG4gICAgICAvLyBldmVyeSBwYXRoIGlzIHZhbGlkIHJlbGF0aXZlIHRvIHRoZSBtYW5pZmVzdCdzIGRlY2xhcmVkXG4gICAgICAvLyBgcGF0aFJvb3RgIChhcmNoaXZlIHJvb3QgZm9yIHRhci56c3Q7IHdvcmtzcGFjZSByb290IGZvciBwbGFpblxuICAgICAgLy8gSlNPTkwg4oCUIGkuZS4sIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gKS5cbiAgICAgIGNvbnN0IHN0cmlwV3MgPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgaWYgKCFwKSByZXR1cm4gcDtcbiAgICAgICAgLy8gU3RyaXAgZXhhY3RseSBvbmUgbGVhZGluZyBgPHdvcmtzcGFjZT4vYCBzZWdtZW50IGlmIHByZXNlbnQuXG4gICAgICAgIGNvbnN0IHdzUHJlZml4ID0gYCR7YWN0aXZlV3N9L2A7XG4gICAgICAgIHJldHVybiBwLnN0YXJ0c1dpdGgod3NQcmVmaXgpID8gcC5zbGljZSh3c1ByZWZpeC5sZW5ndGgpIDogcDtcbiAgICAgIH07XG4gICAgICBvdXQuc2NyZWVuc2hvdCA9IHsuLi5lLnNjcmVlbnNob3R9O1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpIG91dC5zY3JlZW5zaG90LmVsZW1lbnQgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90Lmdyb3VwKSBvdXQuc2NyZWVuc2hvdC5ncm91cCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZ3JvdXApO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LnBhZ2UpIG91dC5zY3JlZW5zaG90LnBhZ2UgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LnBhZ2UpO1xuICAgIH1cbiAgICAvLyBQcm9tb3RlIHJ1bnRpbWUvYmVoYXZpb3Igc2lnbmFscyB0byB0b3AtbGV2ZWwuIFRoZXNlIGFyZSBwcmltYXJ5XG4gICAgLy8gc2lnbmFsIGZvciB0cmlhZ2UgKGV2ZW50cyB0ZWxscyBcIndoaWNoIGhhbmRsZXIgcmFuXCIsIGJlaGF2aW9yQXR0cnNcbiAgICAvLyB0ZWxscyBcIndoYXQgc2VydmVyLXJlbmRlcmVkIGJpbmRpbmcgZG9lcyB0aGlzIGZpcmVcIiwgY2FudmFzQ2xpY2tcbiAgICAvLyB0ZWxscyBcIndoZXJlIG9uIHRoZSBjaGFydCB3YXMgY2xpY2tlZFwiLCBlZGl0b3IgdGVsbHMgXCJ3aGljaFxuICAgIC8vIHJpY2gtdGV4dCBsaWJyYXJ5IHdyYXBzIHRoaXNcIiwgZG9tTXV0YXRpb25zIHRlbGxzIFwid2hhdCBjaGFuZ2VkXG4gICAgLy8gYmVmb3JlIHRoZSBjbGlja1wiLCBpc0FuaW1hdGluZyB3YXJucyBhYm91dCB0cmFuc2llbnQgc3RhdGUpLlxuICAgIGlmIChlLmV2ZW50cyAmJiBPYmplY3Qua2V5cyhlLmV2ZW50cykubGVuZ3RoKSBvdXQuZXZlbnRzID0gZS5ldmVudHM7XG4gICAgaWYgKGUuYmVoYXZpb3JBdHRycyAmJiBPYmplY3Qua2V5cyhlLmJlaGF2aW9yQXR0cnMpLmxlbmd0aCkgb3V0LmJlaGF2aW9yQXR0cnMgPSBlLmJlaGF2aW9yQXR0cnM7XG4gICAgaWYgKGUuY2FudmFzQ2xpY2spIG91dC5jYW52YXNDbGljayA9IGUuY2FudmFzQ2xpY2s7XG4gICAgaWYgKGUuZWRpdG9yKSBvdXQuZWRpdG9yID0gZS5lZGl0b3I7XG4gICAgaWYgKGUuaXNBbmltYXRpbmcpIG91dC5pc0FuaW1hdGluZyA9IHRydWU7XG4gICAgaWYgKGUuc2hhZG93SG9zdCkgb3V0LnNoYWRvd0hvc3QgPSBlLnNoYWRvd0hvc3Q7XG4gICAgaWYgKGUucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIG91dC5yZW5kZXJlZFRleHQgPSBlLnJlbmRlcmVkVGV4dDtcbiAgICBpZiAoZS50cnVuY2F0ZWQgJiYgT2JqZWN0LmtleXMoZS50cnVuY2F0ZWQpLmxlbmd0aCkgb3V0LnRydW5jYXRlZCA9IGUudHJ1bmNhdGVkO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLmRvbU11dGF0aW9ucyAmJiBlLmRvbU11dGF0aW9ucy5sZW5ndGgpIG91dC5kb21NdXRhdGlvbnMgPSBlLmRvbU11dGF0aW9ucztcblxuICAgIC8vIF9hdWRpdDogZGV0ZWN0aW9uIGNoYWluICYgZGlhZ25vc3RpYyBzaGFwZS5cbiAgICAvLyBSRUFETUUgY2xhaW1lZCBgX2F1ZGl0LmFuY2VzdG9yc2AgYW5kIGBfYXVkaXQuY29tcG9uZW50Um9vdGAgd2VyZVxuICAgIC8vIGFsd2F5cyBwcmVzZW50LCBidXQgdGhlIHNsaW0gZW1pdCBkcm9wcGVkIHRoZW0gd2hlbmV2ZXJcbiAgICAvLyBgbWluaWZ5OiB0cnVlYC4gVGhlIGZpeDogZW1pdCBldmVyeSBkZWNsYXJlZCBgX2F1ZGl0YCBmaWVsZFxuICAgIC8vIHdoZW5ldmVyIHRoZSBzb3VyY2UgZGF0YSBleGlzdHMsIGFuZCBsZXRcbiAgICAvLyBgbWluaWZ5YCBzbGltIE9OTFkgdGhlIGhpZ2gtdm9sdW1lIGJsb2NrcyAobWF0Y2hlZFJ1bGVzLFxuICAgIC8vIHBzZXVkb0VsZW1lbnRzKS4gU21hbGwgc3RydWN0dXJhbCBtZXRhZGF0YSAoYW5jZXN0b3JzLFxuICAgIC8vIGNvbXBvbmVudFJvb3QsIHZpZXdwb3J0KSBzdXJ2aXZlcyBtaW5pZnkgc28gdGhlIHNjaGVtYSBjbGFpbXNcbiAgICAvLyBzdGF5IGhvbmVzdC5cbiAgICBjb25zdCBhdWRpdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChlLmFuY2VzdG9ycyAmJiBlLmFuY2VzdG9ycy5sZW5ndGgpIGF1ZGl0LmFuY2VzdG9ycyA9IGUuYW5jZXN0b3JzO1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgYXVkaXQuY29tcG9uZW50Um9vdCA9IGUuY29tcG9uZW50Um9vdDtcbiAgICBpZiAoZS5pblNoYWRvd0RPTSkgYXVkaXQuaW5TaGFkb3dET00gPSB0cnVlO1xuICAgIGlmIChlLnBzZXVkb0VsZW1lbnRzICYmIE9iamVjdC5rZXlzKGUucHNldWRvRWxlbWVudHMpLmxlbmd0aCAmJiAhbWluaWZ5KSBhdWRpdC5wc2V1ZG9FbGVtZW50cyA9IGUucHNldWRvRWxlbWVudHM7XG4gICAgaWYgKGluY2x1ZGVNYXRjaGVkICYmIGUubWF0Y2hlZFJ1bGVzICYmIGUubWF0Y2hlZFJ1bGVzLmxlbmd0aCkge1xuICAgICAgYXVkaXQubWF0Y2hlZFJ1bGVzID0gbWluaWZ5XG4gICAgICAgID8gZS5tYXRjaGVkUnVsZXMubWFwKChyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcjI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7c2VsZWN0b3I6IHIuc2VsZWN0b3J9O1xuICAgICAgICAgIGlmIChyLmRlY2xhcmF0aW9ucyAmJiBPYmplY3Qua2V5cyhyLmRlY2xhcmF0aW9ucykubGVuZ3RoKSByMi5kZWNsYXJhdGlvbnMgPSByLmRlY2xhcmF0aW9ucztcbiAgICAgICAgICBpZiAoci5tZWRpYSkgcjIubWVkaWEgPSByLm1lZGlhO1xuICAgICAgICAgIHJldHVybiByMjtcbiAgICAgICAgfSlcbiAgICAgICAgOiBlLm1hdGNoZWRSdWxlcztcbiAgICB9XG4gICAgaWYgKGUudmlld3BvcnQpIGF1ZGl0LnZpZXdwb3J0ID0gZS52aWV3cG9ydDtcbiAgICBpZiAoT2JqZWN0LmtleXMoYXVkaXQpLmxlbmd0aCkgb3V0Ll9hdWRpdCA9IGF1ZGl0O1xuXG4gICAgLy8gR3JvdXAgaGVhZCBsaW5rYWdlLiBQcmV2aW91c2x5IHRoZSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYFxuICAgIC8vIGNhcnJpZWQgZnVsbCBuZXN0ZWQgZW50cnkgb2JqZWN0cy5cbiAgICAvLyBUaGF0IG1hZGUgRHVja0RCIGpvaW5zIHVnbHkgYW5kIGJyb2tlIHRoZSBydWxlIHRoYXQgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBzaG91bGQgYmUgYSB0b3AtbGV2ZWwgcm93LiBXZSBub3cgZW1pdDpcbiAgICAvLyAgIOKAoiBvbiB0aGUgZ3JvdXAgaGVhZDogYGdyb3VwTWVtYmVyVWlkczogW3VpZCwgdWlkLCAuLi5dYCAoanVzdCBJRHMpXG4gICAgLy8gICDigKIgZWFjaCBtZW1iZXIgYXMgaXRzIG93biB0b3AtbGV2ZWwgc2xpbSByb3cgd2l0aCBgZ3JvdXBVaWRgXG4gICAgLy8gICAgIHBvaW50aW5nIGJhY2sgYXQgdGhlIGhlYWQgKGhhbmRsZWQgaW4gYGJ1aWxkU2xpbWAgZmx1c2ggbG9naWMpLlxuICAgIGlmIChvcHRzLmluY2x1ZGVHcm91cCAmJiBlLmdyb3VwICYmIGUuZ3JvdXAubGVuZ3RoKSB7XG4gICAgICBvdXQuZ3JvdXBNZW1iZXJVaWRzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuICAgIGlmIChvcHRzLmdyb3VwVWlkKSBvdXQuZ3JvdXBVaWQgPSBvcHRzLmdyb3VwVWlkO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIFNoYXJlZCBcInNsaW0gZGF0YVwiIHBpcGVsaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBKU09OTCByZW5kZXJzIG9mZiB0aGlzIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvbi4gKE1hcmtkb3duIHVzZWQgdG9cbiAgLy8gc2hhcmUgaXQ7IHRoZSBNYXJrZG93biBleHBvcnQgd2FzIHJldGlyZWQgaW4gZmF2b3Igb2YgSlNPTkwtb25seS4pXG4gIC8vXG4gIC8vIHYyIGRpZmZlcmVuY2VzIHZzIHYxOlxuICAvLyAgIOKAoiBTZWxlY3RvciBsaW5lcyBoYXZlIGV4cGxpY2l0IGB0eXBlOiAnc2VsZWN0b3InYCBhbmQgYHY6IDJgLlxuICAvLyAgIOKAoiBfYXVkaXQgbmVzdHMgZGV0ZWN0aW9uIC8gZGVidWcgZmllbGRzIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIOKApikuXG4gIC8vICAg4oCiIEZlZWRiYWNrIGVtaXRzIGFzIHN0YW5kYWxvbmUgYHt0eXBlOidmZWVkYmFjaycsIHBhcmVudFVpZCwg4oCmfWAgbGluZXNcbiAgLy8gICAgIFBMVVMgYnVuZGxlZCBgZmVlZGJhY2tgIGFycmF5cyBvbiBzZWxlY3RvcnMgKHNvIG9sZCBzaW5nbGUtbGluZVxuICAvLyAgICAgcmVhZGVycyBzdGlsbCBzZWUgdGhlbSBhZGphY2VudCkuXG4gIC8vICAg4oCiIEEgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGNhcnJpZXMgd29ya3NwYWNlICsgY291bnRzICsgZmlsZW5hbWUuXG4gIHR5cGUgU2xpbVBhZ2UgPSB7djogMjsgdHlwZTogJ3BhZ2UnOyB0czogc3RyaW5nOyB1cmw6IHN0cmluZzsgdGl0bGU/OiBzdHJpbmc7IHZpZXdwb3J0PzogVmlld3BvcnQ7IHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IHVzZXJBZ2VudD86IHN0cmluZzsgbGFuZz86IHN0cmluZzsgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9OyByb3V0ZT86IGFueTsgc3RhdGU/OiBhbnk7IHNlc3Npb25JZD86IHN0cmluZ307XG4gIC8vIFNldmVyaXR5IHdhcyByZW1vdmVkIGZyb20gdGhlIFVJICgyMDI2LTA1KS4gVG9sZXJhbnQgcmVhZGVycyBtYXkgc3RpbGxcbiAgLy8gc2VlIGBzZXZlcml0eWAgb24gbGVnYWN5IEpTT05MIOKAlCBkZW5vcm1hbGl6ZUVudHJ5IHByZXNlcnZlcyBpdCBvblxuICAvLyBGZWVkYmFja01lc3NhZ2Ugc28gcmUtZXhwb3J0IHJvdW5kLXRyaXBzLCBidXQgbmV3IHNlc3Npb25zIG5ldmVyIHNldFxuICAvLyBpdCBhbmQgd2UgZG9uJ3QgZW1pdCBpdCBoZXJlLiBLZWVwIHRoZSBmaWVsZCBvZmYgU2xpbUZlZWRiYWNrIHNvIG5ld1xuICAvLyBleHBvcnRzIHN0YXkgY2xlYW4uXG4gIC8vIGB0YWdzYCBpcyBhbHdheXMgZW1pdHRlZCAoZGVmYXVsdCBlbXB0eSBhcnJheSkgc28gRHVja0RCIHNjaGVtYVxuICAvLyBpbmZlcmVuY2UgYWx3YXlzIHNlZXMgdGhlIGNvbHVtbi5cbiAgdHlwZSBTbGltRmVlZGJhY2sgPSB7djogMjsgdHlwZTogJ2ZlZWRiYWNrJzsgdWlkOiBzdHJpbmc7IHRzOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nOyB0YWdzOiBzdHJpbmdbXTsgaXNUZXN0RGF0YT86IGJvb2xlYW59O1xuICAvLyBDaGVhcCB0ZXN0LWRhdGEgc25pZmY6IG1hdGNoZXMgc3RyaW5ncyB0aGUgdXNlciB0eXBlcyB3aGlsZSBzbW9rZS1cbiAgLy8gdGVzdGluZyB0aGUgZXh0ZW5zaW9uIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsIFwibG9yZW0gaXBzdW1cIixcbiAgLy8gXCJwbGFjZWhvbGRlclwiLCBvciBhbnkgcGhyYXNlIG9idmlvdXNseSBzdHViYmVkLW91dCkuIEZhbHNlIHBvc2l0aXZlc1xuICAvLyBoZXJlIGFyZSByZWNvdmVyYWJsZSDigJQgdGhlIGNvbnN1bWVyIGNhbiBpZ25vcmUgdGhlIGZsYWcg4oCUIGJ1dFxuICAvLyBleGNsdWRpbmcgcmVhbCBmZWVkYmFjayB3b3VsZCBub3QgYmUsIHNvIHdlIGtlZXAgdGhlIHJlZ2V4IG5hcnJvdy5cbiAgY29uc3QgVEVTVF9EQVRBX1JFID0gL14odGVzdHxhc2RmfHF3ZXJ8Zm9vfGJhcnxiYXp8bG9yZW18cGxhY2Vob2xkZXJ8dG9kb3x4ezMsfXxoZWxsbyB3b3JsZHxzYW1wbGV8ZHVtbXl8c29tZXRoaW5nfGFueXRoaW5nfGlnbm9yZSBtZXx3aXB8dGJkfG5cXC9hfGhpKVxcYi9pO1xuICBjb25zdCBsb29rc0xpa2VUZXN0RGF0YSA9ICh0ZXh0OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50cmltKCk7XG4gICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKFRFU1RfREFUQV9SRS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoL3Rlc3QgZmVlZGJhY2svaS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHR5cGUgU2xpbVNlbGVjdG9yID0gUmVjb3JkPHN0cmluZywgYW55PiAmIHt2OiAyOyB0eXBlOiAnc2VsZWN0b3InOyBuOiBudW1iZXI7IHNlbGVjdG9yOiBzdHJpbmc7IGZlZWRiYWNrPzogc3RyaW5nW119O1xuICB0eXBlIFNsaW1MaW5lID0gU2xpbVBhZ2UgfCBTbGltRmVlZGJhY2sgfCBTbGltU2VsZWN0b3I7XG4gIGNvbnN0IGJ1aWxkU2xpbSA9ICgpOiBTbGltTGluZVtdID0+IHtcbiAgICBjb25zdCBsaW5lczogU2xpbUxpbmVbXSA9IFtdO1xuICAgIC8vIFByZS1jb21wdXRlIHZpc3VhbE9yZGVyICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkgZm9yIGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3IgbWVzc2FnZS4gVGhlIHByZXZpb3VzIHNpbmdsZSBgbmAgZmllbGQgY29uZmxhdGVkXG4gICAgLy8gY2FwdHVyZSBvcmRlciwgSlNPTkwgc3RyZWFtIG9yZGVyLFxuICAgIC8vIHZpc3VhbCBvcmRlciwgYW5kIGRpc3BsYXkgbGFiZWwuIFdlIG5vdyBlbWl0IGZvdXIgb3J0aG9nb25hbFxuICAgIC8vIGZpZWxkcyBhbmQgZG9jdW1lbnQgZWFjaDpcbiAgICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gICAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCB0aGUgb3JpZ2luYWwgYG5gIChjYXB0dXJlIHNlcXVlbmNlKVxuICAgIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgc29ydCBieSByZWN0LnkgYXNjLCByZWN0LnggYXNjXG4gICAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCB0aGUgaHVtYW4tZmFjaW5nIG51bWJlciBzaG93biBpbiB0aGUgc2lkZWJhclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAoY3VycmVudGx5IG1pcnJvcnMgY2FwdHVyZUluZGV4OyBjYW4gZHJpZnQgaWZcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhlIHNpZGViYXIgYWRvcHRzIGEgZGlmZmVyZW50IGxhYmVsIHNjaGVtZSkuXG4gICAgY29uc3QgdmlzdWFsUmFuayA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgY29uc3Qgc2VscyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFyID0gYS5lbnRyeS5yZWN0OyBjb25zdCBiciA9IGIuZW50cnkucmVjdDtcbiAgICAgICAgaWYgKCFhciB8fCAhYnIpIHJldHVybiAwO1xuICAgICAgICBpZiAoYXIueSAhPT0gYnIueSkgcmV0dXJuIGFyLnkgLSBici55O1xuICAgICAgICByZXR1cm4gYXIueCAtIGJyLng7XG4gICAgICB9KTtcbiAgICBzZWxzLmZvckVhY2goKG0sIGkpID0+IHZpc3VhbFJhbmsuc2V0KG0uaWQsIGkgKyAxKSk7XG4gICAgbGV0IHBlbmRpbmdTZWw6IFNlbGVjdG9yTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIC8vIFdlIGNvbGxlY3QgYm90aCB0aGUgYnVuZGxlZCBzdHJpbmcgYXJyYXkgKGZvciB2MS1mcmllbmRseSByZWFkZXJzKSBhbmRcbiAgICAvLyB0aGUgcmljaCBvYmplY3RzIChmb3IgdjIgc3RhbmRhbG9uZSBsaW5lcykuXG4gICAgbGV0IHBlbmRpbmdGYlN0cmluZ3M6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHBlbmRpbmdGYlJpY2g6IFNsaW1GZWVkYmFja1tdID0gW107XG4gICAgY29uc3QgZmx1c2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBlbmRpbmdTZWwpIHJldHVybjtcbiAgICAgIGNvbnN0IGV2ZW50SW5kZXggPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgY29uc3QgdmlzdWFsT3JkZXIgPSB2aXN1YWxSYW5rLmdldChwZW5kaW5nU2VsLmlkKTtcbiAgICAgIGNvbnN0IG91dDogYW55ID0gc2xpbUVudHJ5KHBlbmRpbmdTZWwuZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWUsIGV2ZW50SW5kZXgsIHZpc3VhbE9yZGVyfSk7XG4gICAgICBpZiAocGVuZGluZ0ZiU3RyaW5ncy5sZW5ndGgpIG91dC5mZWVkYmFjayA9IFsuLi5wZW5kaW5nRmJTdHJpbmdzXTtcbiAgICAgIGxpbmVzLnB1c2gob3V0IGFzIFNsaW1MaW5lKTtcbiAgICAgIC8vIEdyb3VwIGZsYXRuZXNzIChidWcgIzkpLiBFbWl0IGVhY2ggZ3JvdXAgbWVtYmVyIGFzIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzbGltIHJvdyByaWdodCBhZnRlciB0aGUgaGVhZCwgd2l0aCBgZ3JvdXBVaWRgXG4gICAgICAvLyBsaW5raW5nIGJhY2suIFRoaXMgbGV0cyBEdWNrREIgLyBTUUwgcXVlcmllcyB0cmVhdCBncm91cFxuICAgICAgLy8gbWVtYmVycyBhcyBmaXJzdC1jbGFzcyBzZWxlY3RvciByb3dzIHdpdGhvdXQgZGVzY2VuZGluZyBpbnRvXG4gICAgICAvLyBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgIGNvbnN0IGdyb3VwTWVtYmVycyA9IHBlbmRpbmdTZWwuZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBncm91cE1lbWJlcnMpIHtcbiAgICAgICAgY29uc3QgbUV2ZW50ID0gbGluZXMubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3QgbWVtYmVyUm93OiBhbnkgPSBzbGltRW50cnkobWVtYmVyLCB7aW5jbHVkZUdyb3VwOiBmYWxzZSwgZXZlbnRJbmRleDogbUV2ZW50LCBncm91cFVpZDogcGVuZGluZ1NlbC5lbnRyeS51aWR9KTtcbiAgICAgICAgbGluZXMucHVzaChtZW1iZXJSb3cgYXMgU2xpbUxpbmUpO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBlYWNoIHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZSByaWdodCBhZnRlciB0aGUgc2VsZWN0b3IocykuXG4gICAgICBmb3IgKGNvbnN0IGZiIG9mIHBlbmRpbmdGYlJpY2gpIGxpbmVzLnB1c2goZmIpO1xuICAgICAgcGVuZGluZ1NlbCA9IG51bGw7XG4gICAgICBwZW5kaW5nRmJTdHJpbmdzID0gW107XG4gICAgICBwZW5kaW5nRmJSaWNoID0gW107XG4gICAgfTtcbiAgICAvLyBSZW9yZGVyIGZvciBleHBvcnQgb25seSDigJQgc2lkZWJhciBrZWVwcyBjYXB0dXJlIG9yZGVyLCB0aGVcbiAgICAvLyBlbWl0dGVkIEpTT05MIHJlYWRzIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHdpdGhpbiBlYWNoIHBhZ2UuXG4gICAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciB2aWEgdGhlXG4gICAgLy8gYHJlb3JkZXJGb3JFeHBvcnRgIGhlbHBlciwgc28gdGhyZWFkaW5nIGlzIHByZXNlcnZlZCB0aHJvdWdoXG4gICAgLy8gdGhlIHJlYXJyYW5nZW1lbnQuXG4gICAgY29uc3QgZXhwb3J0T3JkZXJlZCA9IHJlb3JkZXJGb3JFeHBvcnQobWVzc2FnZXMpO1xuICAgIGZvciAoY29uc3QgbSBvZiBleHBvcnRPcmRlcmVkKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2goKTtcbiAgICAgICAgY29uc3Qgc2xpbTogU2xpbVBhZ2UgPSB7djogMiwgdHlwZTogJ3BhZ2UnLCB0czogbS50cywgdXJsOiBtLnVybH07XG4gICAgICAgIGlmIChtLnRpdGxlICE9PSB1bmRlZmluZWQpIHNsaW0udGl0bGUgPSBtLnRpdGxlO1xuICAgICAgICBpZiAobS52aWV3cG9ydCkgc2xpbS52aWV3cG9ydCA9IG0udmlld3BvcnQ7XG4gICAgICAgIGlmICghcHJlZnMubWluaWZ5ICYmIG0udG9rZW5zKSBzbGltLnRva2VucyA9IG0udG9rZW5zO1xuICAgICAgICBpZiAobS51c2VyQWdlbnQpIHNsaW0udXNlckFnZW50ID0gbS51c2VyQWdlbnQ7XG4gICAgICAgIGlmIChtLmxhbmcpIHNsaW0ubGFuZyA9IG0ubGFuZztcbiAgICAgICAgaWYgKG0uZ2l0Q29udGV4dCkgc2xpbS5naXRDb250ZXh0ID0gbS5naXRDb250ZXh0O1xuICAgICAgICBpZiAobS5yb3V0ZSkgc2xpbS5yb3V0ZSA9IG0ucm91dGU7XG4gICAgICAgIGlmIChtLnN0YXRlKSBzbGltLnN0YXRlID0gbS5zdGF0ZTtcbiAgICAgICAgaWYgKG0uc2Vzc2lvbklkKSBzbGltLnNlc3Npb25JZCA9IG0uc2Vzc2lvbklkO1xuICAgICAgICBsaW5lcy5wdXNoKHNsaW0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHsgZmx1c2goKTsgcGVuZGluZ1NlbCA9IG07IH1cbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAvLyBBbHdheXMgaW5jbHVkZSBgdGFnczogW11gIChldmVuIHdoZW4gZW1wdHkpIHNvIER1Y2tEQidzIHNjaGVtYVxuICAgICAgICAvLyBpbmZlcmVuY2UgcGlja3MgdGhlIGNvbHVtbiB1cC5cbiAgICAgICAgLy8gYHVpZGAgaXMgdGhlIG1lc3NhZ2UncyBzdGFibGUgaWQ6IFBScyAvIHJlcGFpciByZXBvcnRzIG5lZWRcbiAgICAgICAgLy8gYSBzdGFibGUgcGVyLWZlZWRiYWNrIGhhbmRsZSwgbm90IGp1c3QgcGFyZW50VWlkLlxuICAgICAgICBjb25zdCByaWNoOiBTbGltRmVlZGJhY2sgPSB7djogMiwgdHlwZTogJ2ZlZWRiYWNrJywgdWlkOiBtLmlkLCB0czogbS50cywgdGV4dDogbS50ZXh0LCB0YWdzOiBtLnRhZ3MgPz8gW119O1xuICAgICAgICAvLyAoc2V2ZXJpdHkgcmVtb3ZlZCAyMDI2LTA1IOKAlCBvbGQgSlNPTkxzIG1heSBzdGlsbCBjb250YWluIGl0XG4gICAgICAgIC8vIG9uIHRoZSByZWFkIHNpZGUsIGJ1dCB3ZSBubyBsb25nZXIgZW1pdCBpdCBvbiB3cml0ZS4pXG4gICAgICAgIC8vIEhldXJpc3RpYyBmbGFnIGZvciBzdHViLWxvb2tpbmcgZmVlZGJhY2sgKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIixcbiAgICAgICAgLy8gXCJIb3dkeSAsIHRlc3QgZmVlZGJhY2sgaGVyZVwiLCBldGMpLiBMZXRzIGEgZG93bnN0cmVhbSBjb25zdW1lclxuICAgICAgICAvLyBmaWx0ZXIgcG9sbHV0aW9uIGZyb20gcmVhbCBpbnRlbnQgd2l0aG91dCBtYW51YWwgY2xlYW51cC5cbiAgICAgICAgaWYgKGxvb2tzTGlrZVRlc3REYXRhKG0udGV4dCkpIHJpY2guaXNUZXN0RGF0YSA9IHRydWU7XG4gICAgICAgIGlmIChwZW5kaW5nU2VsKSB7XG4gICAgICAgICAgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZCA/PyBwZW5kaW5nU2VsLmVudHJ5LnVpZDtcbiAgICAgICAgICBwZW5kaW5nRmJTdHJpbmdzLnB1c2gobS50ZXh0KTtcbiAgICAgICAgICBwZW5kaW5nRmJSaWNoLnB1c2gocmljaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG0ucGFyZW50VWlkKSByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkO1xuICAgICAgICAgIGxpbmVzLnB1c2gocmljaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2goKTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH07XG4gIC8vIEJ1aWxkIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgb2YgdGhlIEpTT05MIGV4cG9ydC4gVGhlXG4gIC8vIG1hbmlmZXN0IGNhcnJpZXMgdGhlIGV4cG9ydCBmaWxlbmFtZSArIHdvcmtzcGFjZSArIGhvc3QocykgKyBjb3VudHMgc29cbiAgLy8gYSBkb3duc3RyZWFtIExMTSBjYW4gcmVzeW5jIHRoZSBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSBhbmQgZ3JlcCBmb3JcbiAgLy8gZHVwbGljYXRlcyBhY3Jvc3MgZXhwb3J0cy5cbiAgY29uc3QgYnVpbGRNYW5pZmVzdCA9IChmaWxlbmFtZTogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSk6IEV4cG9ydE1hbmlmZXN0ID0+IHtcbiAgICBsZXQgblNlbCA9IDA7IGxldCBuRmIgPSAwOyBsZXQgblBnID0gMDtcbiAgICBsZXQgbkdyb3VwTWVtYmVycyA9IDA7XG4gICAgbGV0IG5GZWVkYmFja0JlYXJpbmcgPSAwO1xuICAgIGxldCBuTWlzc2luZ1Nob3QgPSAwO1xuICAgIGxldCBuRWxlbWVudFNob3RzID0gMDtcbiAgICBsZXQgbkdyb3VwU2hvdHMgPSAwO1xuICAgIGxldCBuUGFnZVNob3RzID0gMDtcbiAgICBsZXQgbk9ycGhhbmVkRmIgPSAwO1xuICAgIGNvbnN0IHNlbGVjdG9yVWlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAvLyBGaXJzdCBwYXNzOiBjb2xsZWN0IHVpZHMgKyBwZXItc2VsZWN0b3IgZmVlZGJhY2sgcHJlc2VuY2UuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIG5TZWwrKztcbiAgICAgICAgc2VsZWN0b3JVaWRzLmFkZChtLmVudHJ5LnVpZCk7XG4gICAgICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIG5Hcm91cE1lbWJlcnMgKz0gbS5lbnRyeS5ncm91cC5sZW5ndGg7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIG5FbGVtZW50U2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5Hcm91cFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIG5QYWdlU2hvdHMrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIG5GYisrO1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuYWRkKG0ucGFyZW50VWlkKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIG5QZysrO1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzczogZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgKyBvcnBoYW5lZCBmZWVkYmFjayArXG4gICAgLy8gc2VsZWN0b3JzIHRoYXQgc2hvdWxkIGhhdmUgYSBzaG90IGJ1dCBkb24ndC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSB7XG4gICAgICAgIG5GZWVkYmFja0JlYXJpbmcrKztcbiAgICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5NaXNzaW5nU2hvdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIG5PcnBoYW5lZEZiKys7XG4gICAgfVxuICAgIGNvbnN0IG91dDogRXhwb3J0TWFuaWZlc3QgPSB7XG4gICAgICB2OiAyLCB0eXBlOiAnbWFuaWZlc3QnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICAgIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICBnZW5lcmF0ZWQ6IERhdGUubm93KCksXG4gICAgICB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBmb3JtYXQsXG4gICAgICBob3N0czogZGlzdGluY3RIb3N0cygpLFxuICAgICAgY291bnRzOiB7XG4gICAgICAgIC8vIFRvdGFsIHNlbGVjdG9yIHJvd3MgdGhlIEpTT05MIHdpbGwgZW1pdCA9IHRvcC1sZXZlbCArIGZsYXRcbiAgICAgICAgLy8gZ3JvdXAgbWVtYmVycy4gVGhpcyBtYXRjaGVzIHdoYXQgYSBkb3duc3RyZWFtXG4gICAgICAgIC8vIGByZWFkX2pzb25fYXV0byguLi4pYCB3b3VsZCBzZWU7IHRoZSBwcmV2aW91cyBiZWhhdmlvciBvZlxuICAgICAgICAvLyByZXBvcnRpbmcgb25seSB0aGUgaW4tbWVtb3J5IHRvcC1sZXZlbCBjb3VudCBjb250cmFkaWN0ZWRcbiAgICAgICAgLy8gdGhlIGFjdHVhbCBzdHJlYW0uXG4gICAgICAgIHNlbGVjdG9yczogblNlbCArIG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIGZlZWRiYWNrOiBuRmIsXG4gICAgICAgIHBhZ2VzOiBuUGcsXG4gICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczogbkZlZWRiYWNrQmVhcmluZyxcbiAgICAgICAgZ3JvdXBNZW1iZXJzOiBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IG5FbGVtZW50U2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IG5Hcm91cFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IG5QYWdlU2hvdHMsXG4gICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiBuTWlzc2luZ1Nob3QsXG4gICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IG5PcnBoYW5lZEZiLFxuICAgICAgfSxcbiAgICAgIC8vIFNpbmdsZSBjYW5vbmljYWwgcmVzb2x1dGlvbiBydWxlLiBFdmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTFxuICAgICAgLy8gKHNjcmVlbnNob3QuZWxlbWVudC9ncm91cC9wYWdlKSBpcyByZWxhdGl2ZSB0byBgcGF0aFJvb3RgOlxuICAgICAgLy8gICDigKIgJ2FyY2hpdmUnOiBmb3IgdGFyLnpzdCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlXG4gICAgICAvLyAgICAgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdCAoZS5nLiBgc2NyZWVuc2hvdHMvZm9vLnBuZ2ApLlxuICAgICAgLy8gICDigKIgJ3dvcmtzcGFjZSc6IGZvciBwbGFpbiBKU09OTCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG9cbiAgICAgIC8vICAgICB0aGUgd29ya3NwYWNlIGRpciAoYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgLy8gUmVjZWl2ZXJzIG5vIGxvbmdlciBoYXZlIHRvIGd1ZXNzIHdoaWNoIHBhdGggc2hhcGUgYXBwbGllcy5cbiAgICAgIHBhdGhSb290OiBmb3JtYXQgPT09ICd0YXIuenN0JyA/ICdhcmNoaXZlJyA6ICd3b3Jrc3BhY2UnLFxuICAgIH07XG4gICAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlcnMgc28gYSBkb3duc3RyZWFtIGFnZW50IGtub3dzIHdoaWNoIFVJIHNraWxsXG4gICAgLy8gb3ducyB0aGUgdHJpYWdlIGZsb3cgKyB3aGljaCBERVNJR04ubWQgb3ducyB0aGUgdmlzdWFsIGlkZW50aXR5LlxuICAgIC8vXG4gICAgLy8gYGlubGluZTogdHJ1ZWAgaXMgc2V0IE9OTFkgZm9yIHRhci56c3QgZXhwb3J0cyAod2hlcmUgdGhlIC5tZFxuICAgIC8vIGZpbGVzIGFyZSBwaHlzaWNhbGx5IGJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSkuIEpTT05MLW9ubHlcbiAgICAvLyBleHBvcnRzIGVtaXQgYGlubGluZTogZmFsc2VgIHBsdXMgdGhlIHJlY2VpdmVyLXNpZGUgYHBhdGhgIHNvXG4gICAgLy8gYSBjb25zdW1lciBwYWlyZWQgd2l0aCB0aGUgc3RhbmRhbG9uZSBKU09OTCBjYW4gcmVzb2x2ZSB0aGVcbiAgICAvLyByZWZlcmVuY2VkIGZpbGUgb2ZmIHRoZWlyIG93biBmaWxlc3lzdGVtLlxuICAgIC8vXG4gICAgLy8gYHRlbXBsYXRlOiB0cnVlYCBmbGFncyB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKAlCB1c2VmdWxcbiAgICAvLyBmb3IgcmVjZWl2ZXJzIHdobyB3YW50IHRvIGRpc3Rpbmd1aXNoIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50XG4gICAgLy8gZnJvbSB0aGUgdXNlcidzIGFjdHVhbCB3b3JraW5nIG5vdGVzLlxuICAgIGNvbnN0IGlzVGFyQnVuZGxlID0gZm9ybWF0ID09PSAndGFyLnpzdCc7XG4gICAgb3V0LnNraWxsID0ge1xuICAgICAgbmFtZTogJ1BpbmNoR3JhYicsXG4gICAgICBwYXRoOiBwcmVmcy5za2lsbFBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuc2tpbGwuYXJjaGl2ZVBhdGggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgb3V0LnNraWxsLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5za2lsbC5jdXN0b21pemVkID0gdHJ1ZTtcbiAgICBvdXQuZGVzaWduID0ge1xuICAgICAgcGF0aDogcHJlZnMuZGVzaWduUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5kZXNpZ24uYXJjaGl2ZVBhdGggPSAnREVTSUdOLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIG91dC5kZXNpZ24udGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LmRlc2lnbi5jdXN0b21pemVkID0gdHJ1ZTtcblxuICAgIC8vIFNlbGYtcm9hc3QgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IEV4cG9ydERpYWdub3N0aWNbXSA9IFtdO1xuICAgIC8vIEZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzIHdpdGggbm8gc2NyZWVuc2hvdC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnRkVFREJBQ0tfUEFSRU5UX01JU1NJTkdfU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciAke20uZW50cnkuc2VsZWN0b3J9IGNhcnJpZXMgZmVlZGJhY2sgYnV0IGhhcyBubyBlbGVtZW50L2dyb3VwIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3JwaGFuZWQgZmVlZGJhY2sgKHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUpLlxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICBjb2RlOiAnT1JQSEFORURfRkVFREJBQ0snLFxuICAgICAgICAgIHVpZDogZmJVaWQsXG4gICAgICAgICAgZGV0YWlsOiAnZmVlZGJhY2sgcm93IHJlZmVyZW5jZXMgYSBwYXJlbnRVaWQgdGhhdCBoYXMgbm8gbWF0Y2hpbmcgc2VsZWN0b3IgaW4gdGhpcyBhcmNoaXZlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEhvdmVyLXN0YXRlIGNhcHR1cmVzIHVzdWFsbHkgbmVlZCBhIGJlZm9yZS9hZnRlcjsgZmxhZyBhbnkgd2hvc2VcbiAgICAvLyBzY3JlZW5zaG90IHN0b3J5IGlzIGluY29tcGxldGUgKGJ1ZyAjMTYgcGFydGlhbCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnN0YXRlcyAmJiBtLmVudHJ5LnN0YXRlcy5pbmNsdWRlcygnaG92ZXInKSAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0hPVkVSX1NUQVRFX05PX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgY2FwdHVyZWQgaW4gOmhvdmVyIHN0YXRlIGJ1dCBoYXMgbm8gc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBMTF5OiBmbGFnIGZhaWxpbmcgY29udHJhc3QgKGJ1ZyAjMTUgZm9sbG93LXRocm91Z2gpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5hMTF5Py5jb250cmFzdFBhc3NlcyA9PT0gJ2ZhaWwnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0NPTlRSQVNUX0JFTE9XX0FBJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHRleHQgY29udHJhc3QgcmF0aW8gJHttLmVudHJ5LmExMXkuY29udHJhc3RSYXRpbyA/PyAnPyd9IGlzIGJlbG93IFdDQUcgQUFgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aCkgb3V0LmV4cG9ydERpYWdub3N0aWNzID0gZGlhZ25vc3RpY3M7XG5cbiAgICAvLyBCdWlsZCBpZGVudGl0eS4gUHVsbCBmcm9tIHRoZSBtb3N0IHJlY2VudCBwYWdlIHJvdydzIGdpdENvbnRleHRcbiAgICAvLyAoc291cmNlZCB2aWEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIj5gIG9uIHRoZSBjYXB0dXJlZCBhcHApXG4gICAgLy8gcGx1cyB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLiBPbWl0IHRoZSBibG9jayBlbnRpcmVseVxuICAgIC8vIHdoZW4gbmVpdGhlciBpcyBhdmFpbGFibGUuXG4gICAgY29uc3QgbGFzdFBhZ2UgPSBbLi4ubWVzc2FnZXNdLnJldmVyc2UoKS5maW5kKChtKSA9PiBtLnR5cGUgPT09ICdwYWdlJykgYXMgUGFnZU1lc3NhZ2UgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgZ2l0ID0gbGFzdFBhZ2U/LmdpdENvbnRleHQ7XG4gICAgY29uc3QgZXh0VmVyID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldE1hbmlmZXN0ID8gY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIGlmIChnaXQgfHwgZXh0VmVyKSB7XG4gICAgICBvdXQuYnVpbGQgPSB7fTtcbiAgICAgIGlmIChleHRWZXIpIG91dC5idWlsZC5leHRlbnNpb25WZXJzaW9uID0gZXh0VmVyO1xuICAgICAgaWYgKGdpdD8uY29tbWl0KSBvdXQuYnVpbGQuY29tbWl0ID0gZ2l0LmNvbW1pdDtcbiAgICAgIGlmIChnaXQ/LmJyYW5jaCkgb3V0LmJ1aWxkLmJyYW5jaCA9IGdpdC5icmFuY2g7XG4gICAgICBpZiAoZ2l0Py5idWlsZCkgb3V0LmJ1aWxkLmRlcGxveUJ1aWxkID0gZ2l0LmJ1aWxkO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCBidWlsZEpzb25sID0gKGZpbGVuYW1lRm9yTWFuaWZlc3Q/OiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddID0gJ2pzb25sJyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlbmFtZUZvck1hbmlmZXN0ID8/IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSBidWlsZE1hbmlmZXN0KGZpbGVuYW1lLCBmb3JtYXQpO1xuICAgIGNvbnN0IGxpbmVzID0gYnVpbGRTbGltKCk7XG4gICAgaWYgKCFsaW5lcy5sZW5ndGgpIHtcbiAgICAgIC8vIEV2ZW4gYW4gZW1wdHkgd29ya3NwYWNlIGdldHMgYSBtYW5pZmVzdCBsaW5lIHNvIGRvd25zdHJlYW0gdG9vbHNcbiAgICAgIC8vIGNhbiB2ZXJpZnkgdGhlIGZpbGUgd2FzIGdlbmVyYXRlZCBieSBQaW5jaEdyYWIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpICsgJ1xcbic7XG4gICAgfVxuICAgIHJldHVybiBbSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLCAuLi5saW5lcy5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKV0uam9pbignXFxuJykgKyAnXFxuJztcbiAgfTtcbiAgY29uc3QgZG93bmxvYWRGaWxlID0gKGNvbnRlbnQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZSA9ICd0ZXh0L3BsYWluJyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2NvbnRlbnRdLCB7dHlwZTogbWltZX0pKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCBvbkNvcHlBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBpZiAodGV4dC50cmltKCkuc3BsaXQoJ1xcbicpLmxlbmd0aCA8PSAxICYmICFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIC8vIE1hbmlmZXN0LW9ubHkgb3V0cHV0IGZvciBhbiBlbXB0eSB3b3Jrc3BhY2Ugc2hvdWxkbid0IHByZXRlbmQgdG8gYmUgYSBjb3B5LlxuICAgICAgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGNvcHknLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgc2V0U3RhdHVzKGBDb3BpZWQgSlNPTkwgwrcgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gICAgc2hvd0NvcGllZCgnQ29waWVkIEpTT05MJywgYCR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICB9O1xuICAvLyBTYXZlIHRocm91Z2ggdGhlIGJhY2tncm91bmQncyBmaWxlIGJyaWRnZSBpZiB3ZSdyZSBpbiBhbiBleHRlbnNpb25cbiAgLy8gY29udGV4dCwgc28gdGhlIGZpbGUgbGFuZHMgdW5kZXIgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9leHBvcnRzLy5cbiAgLy8gT3RoZXJ3aXNlICh0ZXN0IHBhZ2UsIGRldiBzZXJ2ZXIpLCBmYWxsIGJhY2sgdG8gYSBzeW50aGV0aWMgYmxvYiBVUkwuXG4gIGNvbnN0IHNhdmVFeHBvcnRUb0Rpc2sgPSBhc3luYyAodGV4dDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lOiBzdHJpbmcsIGtpbmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayDihpInLCB7ZmlsZW5hbWUsIG1pbWUsIHNpemU6IHRleHQubGVuZ3RoLCBraW5kfSk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe2tpbmQ6ICdzYXZlLXRleHQnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZSwgdGV4dCwgbWltZX0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgc2V0U3RhdHVzKGBFeHBvcnRlZCDCtyAke2xhc3RFeHBvcnQuY29weVBhdGh9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kICh3b3JrZXIgZGVhZD8gcmVsb2FkIGV4dGVuc2lvbiBhdCBjaHJvbWU6Ly9leHRlbnNpb25zKSc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkb3dubG9hZEZpbGUodGV4dCwgZmlsZW5hbWUsIG1pbWUpO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIHNldFN0YXR1cygnRXhwb3J0ZWQnKTtcbiAgfTtcbiAgY29uc3Qgb25FeHBvcnQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGV4cG9ydCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKGZpbGVuYW1lKTtcbiAgICBhd2FpdCBzYXZlRXhwb3J0VG9EaXNrKHRleHQsIGZpbGVuYW1lLCAnYXBwbGljYXRpb24vanNvbmwnLCAnanNvbmwnKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIHRhci56c3Qgd29ya3NwYWNlIGV4cG9ydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQnVuZGxlIEpTT05MICsgUkVBRE1FICsgRHVja0RCIHJlY2lwZXMgKyBzY3JlZW5zaG90cy5qc29uICsgYWN0dWFsIFBOR1xuICAvLyBzY3JlZW5zaG90cyBpbnRvIGEgc2luZ2xlIC50YXIuenN0IGFyY2hpdmUuIHRhciBnaXZlcyB1cyBhIGNsZWFuXG4gIC8vIGNvbnRhaW5lciAob25lIGZpbGUgcGVyIGVudHJ5LCBubyB6aXAtc3R5bGUgY2VudHJhbC1kaXJlY3RvcnlcbiAgLy8gY29udG9ydGlvbnMpOyB6c3RkIGlzIHRoZSBtb2Rlcm4gY29tcHJlc3Npb24gcGFpci4gSW1wbGVtZW50YXRpb24gaXNcbiAgLy8gcHVyZS1UUyDigJQgc2VlIHNyYy90YXIudHMgZm9yIHRoZSBlbmNvZGVyICsgenN0ZC1mcmFtZSB3cml0ZXIuXG4gIC8vIEJ1ZyAjMjg6IGEgSlNPTi1TY2hlbWEgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZSBpbiB0aGUgSlNPTkwuXG4gIC8vIFJlY2VpdmVycyBjYW4gdXNlIHRoaXMgdG8gdmFsaWRhdGUgZml4dHVyZXMsIGRyaXZlIGF1dG9jb21wbGV0ZSBpblxuICAvLyBlZGl0b3JzLCBhbmQgYXV0by1nZW5lcmF0ZSBwYXJzZXJzLiBLZWVwIHRoaXMgaW4gc3luYyB3aXRoIHRoZVxuICAvLyBzaGFwZXMgZW1pdHRlZCBieSBidWlsZFNsaW0vc2xpbUVudHJ5IOKAlCBgbnBtIHJ1biB0ZXN0YCB2YWxpZGF0ZXMgYVxuICAvLyBzYW1wbGUgYWdhaW5zdCB0aGlzIHNjaGVtYS5cbiAgY29uc3QgYnVpbGRTY2hlbWFKc29uID0gKCk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LzIwMjAtMTIvc2NoZW1hJyxcbiAgICAkaWQ6ICdodHRwczovL3dyYW5uZ2xlLmNvbS9waW5jaGdyYWIvZXhwb3J0LnYyLnNjaGVtYS5qc29uJyxcbiAgICB0aXRsZTogJ1BpbmNoR3JhYiBleHBvcnQgKHYyKScsXG4gICAgZGVzY3JpcHRpb246ICdKU09OTCByb3cgKyBtYW5pZmVzdCBzY2hlbWFzIGZvciBQaW5jaEdyYWIgd29ya3NwYWNlIGV4cG9ydHMuJyxcbiAgICBvbmVPZjogW1xuICAgICAgeyRyZWY6ICcjLyRkZWZzL21hbmlmZXN0J30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvcGFnZSd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3NlbGVjdG9yJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvZmVlZGJhY2snfSxcbiAgICBdLFxuICAgICRkZWZzOiB7XG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3Rvb2wnLCAndHMnLCAnd29ya3NwYWNlJywgJ2ZpbGVuYW1lJywgJ2Zvcm1hdCcsICdob3N0cycsICdjb3VudHMnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnbWFuaWZlc3QnfSxcbiAgICAgICAgICB0b29sOiB7Y29uc3Q6ICdwaW5jaGdyYWInfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHdvcmtzcGFjZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmaWxlbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmb3JtYXQ6IHtlbnVtOiBbJ2pzb25sJywgJ21hcmtkb3duJywgJ3Rhci56c3QnXX0sXG4gICAgICAgICAgaG9zdHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcGF0aFJvb3Q6IHtlbnVtOiBbJ2FyY2hpdmUnLCAnd29ya3NwYWNlJ119LFxuICAgICAgICAgIGNvdW50czoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvcnMnLCAnZmVlZGJhY2snLCAncGFnZXMnXSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgc2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBwYWdlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGdyb3VwTWVtYmVyczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNraWxsOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzaWduOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBleHRlbnNpb25WZXJzaW9uOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlydHk6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBkZXBsb3lCdWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHBvcnREaWFnbm9zdGljczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWydzZXZlcml0eScsICdjb2RlJ10sXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eToge2VudW06IFsnZXJyb3InLCAnd2FybicsICdpbmZvJ119LFxuICAgICAgICAgICAgICAgIGNvZGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwYWdlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndHMnLCAndXJsJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3BhZ2UnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGl0bGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgIHRva2Vuczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgdXNlckFnZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGxhbmc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ2l0Q29udGV4dDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBidWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXNzaW9uSWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAnbicsICd0cycsICd1cmwnLCAndGFnJywgJ3NlbGVjdG9yJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3NlbGVjdG9yJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIG46IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGNhcHR1cmVJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZXZlbnRJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgdmlzdWFsT3JkZXI6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGRpc3BsYXlMYWJlbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGFnOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yTWF0Y2hDb3VudDoge3R5cGU6ICdpbnRlZ2VyJywgbWluaW11bTogMH0sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByZW5kZXJlZFRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBhY2Nlc3NpYmxlTmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBhdHRyczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcmVjdDogeyRyZWY6ICcjLyRkZWZzL3JlY3QnfSxcbiAgICAgICAgICBzdGF0ZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZnJhbWV3b3JrOiB7ZW51bTogWydyZWFjdCcsICd2dWUnLCAnbGl0JywgJ3N0ZW5jaWwnLCAnc3ZlbHRlJywgJ3dlYi1jb21wb25lbnQnXX0sXG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjaGFpbjoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge2ZpbGU6IHt0eXBlOiBbJ3N0cmluZycsICdudWxsJ119LCBsaW5lOiB7dHlwZTogWydpbnRlZ2VyJywgJ251bGwnXX19LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG91dGVySFRNTDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzdHlsZXM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHNjcmVlbnNob3Q6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBncm91cDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGFnZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2FwdHVyZWRBdDoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaGFkb3dIb3N0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBncm91cFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBncm91cE1lbWJlclVpZHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgX2F1ZGl0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYW5jZXN0b3JzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9hbmNlc3Rvcid9fSxcbiAgICAgICAgICAgICAgY29tcG9uZW50Um9vdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBwc2V1ZG9FbGVtZW50czoge3R5cGU6ICdvYmplY3QnfSxcbiAgICAgICAgICAgICAgbWF0Y2hlZFJ1bGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9tYXRjaGVkUnVsZSd9fSxcbiAgICAgICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGZlZWRiYWNrOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ3RzJywgJ3RleHQnLCAndGFncyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdmZWVkYmFjayd9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHBhcmVudFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWdzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGlzVGVzdERhdGE6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHZpZXdwb3J0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdzoge3R5cGU6ICdpbnRlZ2VyJ30sIGg6IHt0eXBlOiAnaW50ZWdlcid9LCBkcHI6IHt0eXBlOiAnbnVtYmVyJ30sXG4gICAgICAgICAgY29sb3JTY2hlbWU6IHtlbnVtOiBbJ2xpZ2h0JywgJ2RhcmsnXX0sXG4gICAgICAgICAgcmVkdWNlZE1vdGlvbjoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgZGlyZWN0aW9uOiB7ZW51bTogWydsdHInLCAncnRsJ119LFxuICAgICAgICAgIHpvb206IHt0eXBlOiAnbnVtYmVyJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVjdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsneCcsICd5JywgJ3cnLCAnaCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7eDoge3R5cGU6ICdudW1iZXInfSwgeToge3R5cGU6ICdudW1iZXInfSwgdzoge3R5cGU6ICdudW1iZXInfSwgaDoge3R5cGU6ICdudW1iZXInfX0sXG4gICAgICB9LFxuICAgICAgYW5jZXN0b3I6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3RhZyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdGFnOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJvbGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGVzdElkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGNsYXNzZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbWF0Y2hlZFJ1bGU6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9yJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzZWxlY3Rvcjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBkZWNsYXJhdGlvbnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIG1lZGlhOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LCBudWxsLCAyKSArICdcXG4nO1xuXG4gIC8vIEdlbmVyYXRlIHJlcGFpci1pbmRleC5tZCBhcyBhIHN0cnVjdHVyZWQgc3RhcnRpbmcgcG9pbnQgZm9yIGFuXG4gIC8vIGF1dG9ub21vdXMgY29kaW5nIGFnZW50LiBGb3IgZXZlcnkgZmVlZGJhY2sgcm93LCBtZWNoYW5pY2FsbHkgZGVyaXZlOlxuICAvLyAgIOKAoiB0YXJnZXQgaWRlbnRpdHkgKHVpZCwgc2VsZWN0b3IsIHRhZywgYWNjZXNzaWJsZSBuYW1lKVxuICAvLyAgIOKAoiBzY3JlZW5zaG90IHBhdGggKHdpdGggYXJjaGl2ZS1yZWxhdGl2ZSBmb3JtKVxuICAvLyAgIOKAoiBzb3VyY2UgaGludHMgKGNvbXBvbmVudCBjaGFpbiwgc291cmNlbWFwIGZpbGUvbGluZSlcbiAgLy8gICDigKIgc3VnZ2VzdGVkIGZpeCBjYXRlZ29yeSAoY2hlYXAgaGV1cmlzdGljIG9uIHRleHQpXG4gIC8vIFRoZSBhZ2VudCB1c2VzIHRoaXMgYXMgYSBzdGFydGluZyBwdW5jaCBsaXN0LCB0aGVuIHZhbGlkYXRlcyArXG4gIC8vIHJlZmluZXMgZWFjaCBzdWdnZXN0aW9uIGFnYWluc3QgdGhlIGZ1bGwgSlNPTkwuXG4gIGNvbnN0IGluZmVyRmVlZGJhY2tDYXRlZ29yeSA9ICh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKC9cXGIodHlwb3xjb3B5fHdvcmRpbmd8bGFiZWx8bWlzc3BlbGx8Z3JhbW1hcnxjYXBpdGFsaXopLy50ZXN0KHQpKSByZXR1cm4gJ2NvcHknO1xuICAgIGlmICgvXFxiKGFsaWdufHNwYWNpbmd8cGFkZGluZ3xtYXJnaW58bGF5b3V0fG92ZXJsYXB8Y3Jvd2RlZHxjcmFtcGVkfHRpZ2h0fGdhcCkvLnRlc3QodCkpIHJldHVybiAnbGF5b3V0JztcbiAgICBpZiAoL1xcYih1bmNsZWFyfGNvbmZ1c2luZ3x3aGF0IGRvZXN8d2hhdCBpc3xkb24ndCB1bmRlcnN0YW5kfGhhcmQgdG98bmF2fG5hdmlnYXRpb24pLy50ZXN0KHQpKSByZXR1cm4gJ2FmZm9yZGFuY2UnO1xuICAgIGlmICgvXFxiKGNvbnRyYXN0fGNvbG9yIGJsaW5kfHNjcmVlbiByZWFkZXJ8YXJpYXxmb2N1c3xrZXlib2FyZHx0YWJ8YTExeXxhY2Nlc3NpYikvLnRlc3QodCkpIHJldHVybiAnYWNjZXNzaWJpbGl0eSc7XG4gICAgaWYgKC9cXGIoYnJva2VufGNyYXNofG51bGx8dW5kZWZpbmVkfGVycm9yfDQwNHxmYWlsKS8udGVzdCh0KSkgcmV0dXJuICdzdGF0ZSc7XG4gICAgaWYgKC9cXGIodWdseXxjb2xvcnxncmFkaWVudHxzaGFkb3d8cG9saXNofHZpc3VhbHxzdHlsZSkvLnRlc3QodCkpIHJldHVybiAndmlzdWFsLXBvbGlzaCc7XG4gICAgcmV0dXJuICd1bnNwZWNpZmllZCc7XG4gIH07XG4gIGNvbnN0IGJ1aWxkUmVwYWlySW5kZXggPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHlwZSBSb3cgPSB7ZmVlZGJhY2s6IEZlZWRiYWNrTWVzc2FnZTsgcGFyZW50PzogU2VsZWN0b3JNZXNzYWdlfTtcbiAgICBjb25zdCByb3dzOiBSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGJ5VWlkID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWVzc2FnZT4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGJ5VWlkLnNldChtLmVudHJ5LnVpZCwgbSk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnZmVlZGJhY2snKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG0ucGFyZW50VWlkID8gYnlVaWQuZ2V0KG0ucGFyZW50VWlkKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJvd3MucHVzaCh7ZmVlZGJhY2s6IG0sIHBhcmVudH0pO1xuICAgIH1cbiAgICBpZiAoIXJvd3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnIyByZXBhaXItaW5kZXgubWQnLFxuICAgICAgICAnJyxcbiAgICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgICAnJyxcbiAgICAgICAgJ18obm8gZmVlZGJhY2sgaW4gdGhpcyBleHBvcnQg4oCUIG5vdGhpbmcgdG8gcmVwYWlyKV8nLFxuICAgICAgICAnJyxcbiAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBvdXQucHVzaCgnIyByZXBhaXItaW5kZXgubWQnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gKTtcbiAgICBvdXQucHVzaChgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGAgwrcgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIHx8ICcobm9uZSknfWApO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQSBzdGFydGluZyBwdW5jaCBsaXN0IGZvciBhbiBhdXRvbm9tb3VzIHJlcGFpciBhZ2VudC4gRWFjaCByb3cgaXMgb25lIHVzZXIgY29tcGxhaW50IHdpdGggdGhlIGRhdGEgbmVlZGVkIHRvIGxvY2F0ZSwgZml4LCBhbmQgdmVyaWZ5LiBDcm9zcy1yZWZlcmVuY2UgYCcgKyBqc29ubE5hbWUgKyAnYCBmb3IgdGhlIGZ1bGwgcmVjb3JkLicpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnIyMgVGFza3MnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgcm93cy5mb3JFYWNoKCh7ZmVlZGJhY2ssIHBhcmVudH0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGZiSWQgPSBgRiR7U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgzLCAnMCcpfWA7XG4gICAgICBjb25zdCB0YXJnZXQgPSBwYXJlbnQ/LmVudHJ5O1xuICAgICAgb3V0LnB1c2goYCMjIyAke2ZiSWR9IOKAlCAke2ZlZWRiYWNrLnRleHQuc2xpY2UoMCwgODApfSR7ZmVlZGJhY2sudGV4dC5sZW5ndGggPiA4MCA/ICfigKYnIDogJyd9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgPiAke2ZlZWRiYWNrLnRleHQuc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbj4gJyl9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgLSAqKmZlZWRiYWNrVWlkOioqIFxcYCR7ZmVlZGJhY2suaWR9XFxgYCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIFxcYCR7dGFyZ2V0LnNlbGVjdG9yfVxcYCBfKHVpZCBcXGAke3RhcmdldC51aWR9XFxgLCBuPSR7dGFyZ2V0Lm59KV9gKTtcbiAgICAgICAgaWYgKHRhcmdldC50YWcpIG91dC5wdXNoKGAtICoqdGFnOioqIFxcYDwke3RhcmdldC50YWd9PlxcYCR7dGFyZ2V0LnJvbGUgPyBgIMK3IHJvbGU9XFxgJHt0YXJnZXQucm9sZX1cXGBgIDogJyd9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIG91dC5wdXNoKGAtICoqYWNjZXNzaWJsZSBuYW1lOioqIFwiJHt0YXJnZXQuYWNjZXNzaWJsZU5hbWUuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICBpZiAodGFyZ2V0LnRleHQgJiYgdGFyZ2V0LnRleHQgIT09IHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqdmlzaWJsZSB0ZXh0OioqIFwiJHt0YXJnZXQudGV4dC5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2VsZWN0b3IgcXVhbGl0eToqKiBtYXRjaGVzICR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudH0gZWxlbWVudCR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90LmVsZW1lbnR9XFxgYCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90IChncm91cCk6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5ncm91cH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXyhtaXNzaW5nIOKAlCBzZWUgZXhwb3J0RGlhZ25vc3RpY3MpX2ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50KSB7XG4gICAgICAgICAgY29uc3QgYyA9IHRhcmdldC5jb21wb25lbnQ7XG4gICAgICAgICAgY29uc3QgY2ggPSBjLmNoYWluICYmIGMuY2hhaW4ubGVuZ3RoID8gYCDCtyBjaGFpbiAke2MuY2hhaW4uc2xpY2UoMCwgNSkubWFwKChuKSA9PiAnYCcgKyBuICsgJ2AnKS5qb2luKCcg4oaSICcpfWAgOiAnJztcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmNvbXBvbmVudDoqKiBcXGAke2MubmFtZSA/PyBjLmRpc3BsYXlOYW1lID8/ICc/J31cXGAgKCR7Yy5mcmFtZXdvcmt9KSR7Y2h9YCk7XG4gICAgICAgICAgaWYgKGMuc291cmNlPy5maWxlKSBvdXQucHVzaChgLSAqKnNvdXJjZToqKiBcXGAke2Muc291cmNlLmZpbGV9XFxgJHtjLnNvdXJjZS5saW5lID8gYDoke2Muc291cmNlLmxpbmV9YCA6ICcnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50Um9vdCkgb3V0LnB1c2goYC0gKipjb21wb25lbnQgcm9vdDoqKiAke3RhcmdldC5jb21wb25lbnRSb290fWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFuY2VzdG9ycyAmJiB0YXJnZXQuYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gdGFyZ2V0LmFuY2VzdG9ycy5zbGljZSgwLCA0KS5tYXAoKGEpID0+IGA8JHthLnRhZ30+JHthLmlkID8gJyMnICsgYS5pZCA6IGEudGVzdElkID8gYFt0ZXN0SWQ9XCIke2EudGVzdElkfVwiXWAgOiAnJ31gKS5qb2luKCcg4oC6ICcpO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqYW5jZXN0b3IgY2hhaW46KiogJHtjaGFpbn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnVybCkgb3V0LnB1c2goYC0gKip1cmw6KiogJHt0YXJnZXQudXJsfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXyhubyBzZWxlY3RvciDigJQgb3JwaGFuZWQgZmVlZGJhY2spX2ApO1xuICAgICAgfVxuICAgICAgY29uc3QgY2F0ID0gaW5mZXJGZWVkYmFja0NhdGVnb3J5KGZlZWRiYWNrLnRleHQpO1xuICAgICAgb3V0LnB1c2goYC0gKipzdWdnZXN0ZWQgY2F0ZWdvcnk6KiogJHtjYXR9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgfSk7XG4gICAgb3V0LnB1c2goJy0tLScpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQ2F0ZWdvcmllcyBhcmUgaW5mZXJyZWQgZnJvbSBmZWVkYmFjayB0ZXh0IHZpYSBrZXl3b3JkIGhldXJpc3RpY3Mg4oCUIHZlcmlmeSBiZWZvcmUgYWN0aW5nLicpO1xuICAgIHJldHVybiBvdXQuam9pbignXFxuJyk7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRSZWFkbWUgPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZywgc2hvdENvdW50OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICcjIFBpbmNoR3JhYiBXb3Jrc3BhY2UgRXhwb3J0JyxcbiAgICAgICcnLFxuICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgYCxcbiAgICAgIGBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5sZW5ndGggPyBtYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgOiAnKG5vbmUpJ31gLFxuICAgICAgYENvdW50czogKioke21hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnN9Kiogc2VsZWN0b3JzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMuZmVlZGJhY2t9KiogY29tbWVudHMgwrcgKioke21hbmlmZXN0LmNvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7c2hvdENvdW50fSoqIHNjcmVlbnNob3RzYCxcbiAgICAgICcnLFxuICAgICAgJyMjIFRyaWFnZSBtYXRlcmlhbHMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lXG4gICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIGJ1bmRsZWQgYXQgXFxgLi8ke21hbmlmZXN0LnNraWxsLmFyY2hpdmVQYXRoID8/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfVxcYCR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCBhcyBhdXRob3JpdGF0aXZlKV8nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBnZW5lcmljIGJvaWxlcnBsYXRlLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBob3cgdG8gcmVhZCB0aGlzIGV4cG9ydCBhbmQgdHJpYWdlIHRoZSBjYXB0dXJlcy5gXG4gICAgICAgIDogKG1hbmlmZXN0LnNraWxsPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogXFxgJHttYW5pZmVzdC5za2lsbC5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lXG4gICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogYnVuZGxlZCBpbmxpbmUgYXQgXFxgLi8ke21hbmlmZXN0LmRlc2lnbi5hcmNoaXZlUGF0aCA/PyAnREVTSUdOLm1kJ31cXGAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IHRoZSB0b2tlbnMgLyB2b2ljZSBydWxlcyBhcyBwcm9qZWN0IGNhbm9uKV8nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgcGxhY2Vob2xkZXIsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGNvbG9yIHRva2VucywgdHlwb2dyYXBoeSwgc3BhY2luZywgbW90aW9uLCB2b2ljZS5gXG4gICAgICAgIDogKG1hbmlmZXN0LmRlc2lnbj8ucGF0aFxuICAgICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogXFxgJHttYW5pZmVzdC5kZXNpZ24ucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgICcnLFxuICAgICAgJyMjIEZpbGVzJyxcbiAgICAgICcnLFxuICAgICAgJy0gYHJlcGFpci1pbmRleC5tZGAg4oCUIGFnZW50LWZyaWVuZGx5IHRyaWFnZSBwdW5jaCBsaXN0IChzdGFydCBoZXJlKS4nLFxuICAgICAgYC0gXFxgJHtqc29ubE5hbWV9XFxgIOKAlCBKU09OTCBzdHJlYW0gKG9uZSBjYXB0dXJlIHBlciBsaW5lLCBsZWFkaW5nIG1hbmlmZXN0LCBzY2hlbWEgdjIpLmAsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMvKi5wbmdgIOKAlCBmdWxsLXJlc29sdXRpb24gUE5HcyBvZiBlYWNoIGNhcHR1cmVkIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UuJyxcbiAgICAgICctIGBzY3JlZW5zaG90cy5qc29uYCDigJQgdWlkLWtleWVkIGluZGV4OiBgYnlVaWRbdWlkXSDihpIgeyBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPyB9YCwgYGJ5VXJsW3VybF0g4oaSIHsgcGFnZT8sIHVpZHNbXSB9YCwgcGx1cyBhIGZsYXQgYGZpbGVzW11gIGxpc3RpbmcuJyxcbiAgICAgICctIGBzY2hlbWEuanNvbmAg4oCUIEpTT04tU2NoZW1hIChkcmFmdCAyMDIwLTEyKSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlLicsXG4gICAgICAnLSBgZHVja2RiLnNxbGAg4oCUIGNvcHktYW5kLXBhc3RlIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIHRoZSBKU09OTCB3aXRoIER1Y2tEQi4nLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmUgPyBgLSBcXGBERVNJR04ubWRcXGAg4oCUICR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAncHJvamVjdC1jdXN0b21pemVkIGRlc2lnbiBzb3VyY2Utb2YtdHJ1dGggKHRydXN0IGFzIGNhbm9uaWNhbCkuJyA6IG1hbmlmZXN0LmRlc2lnbi50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgREVTSUdOLm1kIHRlbXBsYXRlIChwbGFjZWhvbGRlciDigJQgdmVyaWZ5IGJlZm9yZSBhcHBseWluZykuJyA6ICcnfWAgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmUgPyBgLSBcXGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRcXGAg4oCUICR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgdHJpYWdlIHNraWxsLicgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgZGVmYXVsdCB0cmlhZ2Ugc2tpbGwgKHRlbXBsYXRlIGNvbnRlbnQpLicgOiAnJ31gIDogJycsXG4gICAgICAnJyxcbiAgICAgICcjIyBFeHRyYWN0aW5nJyxcbiAgICAgICcnLFxuICAgICAgJ1BpY2sgd2hpY2hldmVyIHZhcmlhbnQgeW91ciBtYWNoaW5lIHN1cHBvcnRzIOKAlCBub3QgZXZlcnkgc3lzdGVtIHNoaXBzIGB6c3RkYC4nLFxuICAgICAgJycsXG4gICAgICAnYGBgc2gnLFxuICAgICAgJyMgMS4gTW9kZXJuIHRhciB3aXRoIGJ1aWx0LWluIHpzdGQgc3VwcG9ydCAoTGludXggKyByZWNlbnQgbWFjT1MpOicsXG4gICAgICBgdGFyIC0tenN0ZCAteGYgJHttYW5pZmVzdC5maWxlbmFtZX1gLFxuICAgICAgJycsXG4gICAgICAnIyAyLiB0YXIgKyBzdGFuZGFsb25lIHpzdGQgQ0xJOicsXG4gICAgICBgenN0ZCAtZCAke21hbmlmZXN0LmZpbGVuYW1lfSAtbyAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgIGB0YXIgLXhmICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgJycsXG4gICAgICAnIyAzLiBQdXJlLU5vZGUgZmFsbGJhY2sgKG5vIHpzdGQgQ0xJIC8gbm8gdGFyKTonLFxuICAgICAgYG5weCAteSBAcm9ub21vbi96c3RhbmRhcmQgPCAke21hbmlmZXN0LmZpbGVuYW1lfSA+ICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYCMg4oCmIHRoZW4gdXNlIGFueSB0YXIgcmVhZGVyIChlLmcuIFxcYG5weCB0YXItc3RyZWFtXFxgKWAsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJ0V4cGVjdGVkIGZpbGUgbGlzdCBhZnRlciBleHRyYWN0aW9uOicsXG4gICAgICAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgYCR7anNvbmxOYW1lfSAgICAgICAgICAgICAgICAgICAgIyBKU09OTCBzdHJlYW0gKHRoZSBzb3VyY2Ugb2YgdHJ1dGgpYCxcbiAgICAgIGBzY3JlZW5zaG90cy8gICAgICAgICAgICAgICAgICAgICMgZWxlbWVudCAvIGdyb3VwIC8gcGFnZSBQTkdzYCxcbiAgICAgIGBzY3JlZW5zaG90cy5qc29uICAgICAgICAgICAgICAgICMgdWlkLWtleWVkIGxvb2t1cCBpbmRleGAsXG4gICAgICBgZHVja2RiLnNxbCAgICAgICAgICAgICAgICAgICAgICAjIGNvcHktcGFzdGUgU1FMIHJlY2lwZXNgLFxuICAgICAgYHNjaGVtYS5qc29uICAgICAgICAgICAgICAgICAgICAgIyBKU09OLVNjaGVtYSBmb3IgZXZlcnkgcm93IHR5cGVgLFxuICAgICAgYFJFQURNRS5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB0aGlzIGZpbGVgLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmUgPyAnREVTSUdOLm1kICAgICAgICAgICAgICAgICAgICAgICAjIHZpc3VhbCBpZGVudGl0eSBzb3VyY2Utb2YtdHJ1dGgnIDogJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lID8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCAgIyB0cmlhZ2UgaW5zdHJ1Y3Rpb25zJyA6ICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICcjIyBRdWljayBEdWNrREInLFxuICAgICAgJycsXG4gICAgICAnYGBgc3FsJyxcbiAgICAgIGBDUkVBVEUgVEFCTEUgY2FwdHVyZXMgQVMgU0VMRUNUICogRlJPTSByZWFkX2pzb25fYXV0bygnJHtqc29ubE5hbWV9JywgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwKTtgLFxuICAgICAgXCJTRUxFQ1Qgbiwgc2VsZWN0b3IsIHRhZywgcm9sZSwgaGludHMgRlJPTSBjYXB0dXJlcyBXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBMSU1JVCAyMDtcIixcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgU2NoZW1hJyxcbiAgICAgICcnLFxuICAgICAgJ1NlbGVjdG9yIGxpbmVzIGhhdmUgYHR5cGU6IFwic2VsZWN0b3JcImAsIGB2OiAyYCwgYSBzdGFibGUgYHVpZGAsIHRvcC1sZXZlbCBpZGVudGlmaWNhdGlvbiBmaWVsZHMsIGFuZCBhbiBgX2F1ZGl0YCBuYW1lc3BhY2UgbmVzdGluZyBkZXRlY3Rpb24gbWV0YWRhdGEgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwgbWF0Y2hlZFJ1bGVzLCB2aWV3cG9ydCkuIEZlZWRiYWNrIGxpbmVzIGxpbmsgYmFjayB2aWEgYHBhcmVudFVpZGAgYW5kIGNhcnJ5IHRoZWlyIG93biBgdWlkYC4gR3JvdXAgaGVhZHMgY2FycnkgYGdyb3VwTWVtYmVyVWlkczogW3VpZOKApl1gOyBlYWNoIGdyb3VwIG1lbWJlciBpcyBhIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nIGJhY2sgYXQgdGhlIGhlYWQuIEJ1bmRsZWQgYHNjaGVtYS5qc29uYCBpcyB0aGUgY2Fub25pY2FsIG1hY2hpbmUtcmVhZGFibGUgZm9ybS4nLFxuICAgICAgJycsXG4gICAgXTtcbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gIH07XG4gIC8vIHNjcmVlbnNob3RzLmpzb24g4oCUIHByb3BlciBrZXllZCBpbmRleCBpbnN0ZWFkIG9mIHRoZSBvbGQgVFNWLiBUaHJlZVxuICAvLyBzaGFwZXMgZm9yIHRocmVlIGxvb2t1cCBwYXR0ZXJuczpcbiAgLy8gICDigKIgYnlVaWQ6ICB1aWQg4oaSIHsgbiwgc2VsZWN0b3IsIHVybCwgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8sIG1lbWJlcnM/IH1cbiAgLy8gICAgICAgICAgICAgIFwiZ2l2ZSBtZSBldmVyeSBzaG90IGZvciB0aGlzIGVudHJ5XCJcbiAgLy8gICDigKIgYnlVcmw6ICB1cmwg4oaSIHsgcGFnZT8sIHVpZHNbXSB9XG4gIC8vICAgICAgICAgICAgICBcIndoYXQgcGFnZSBzaG90IGNvdmVycyB0aGlzIFVSTD8gd2hpY2ggY2FwdHVyZXMgbGFuZGVkIGhlcmU/XCJcbiAgLy8gICDigKIgZmlsZXM6ICBmbGF0IGxpc3Qgb2YgZXZlcnkgUE5HIHBhdGggaW4gdGhlIGFyY2hpdmVcbiAgLy8gICAgICAgICAgICAgIFwid2hhdCdzIGluIHNjcmVlbnNob3RzLyA/XCJcbiAgLy8gVGhlIGBpbkFyY2hpdmVgIGZsYWcgb24gZWFjaCBmaWxlIG1pcnJvcnMgdGhlIHRhciBidW5kbGUgbWVtYmVyc2hpcFxuICAvLyBzbyBhIGNvbnN1bWVyIGRvd25zdHJlYW0gb2YgdGhlIC50YXIuenN0IGV4dHJhY3Rpb24gY2FuIHRlbGwgd2hpY2hcbiAgLy8gcGF0aHMgcG9pbnQgSU5TSURFIHRoZSBhcmNoaXZlIChyZWxhdGl2ZSkgdnMgYXQgb24tZGlzayBzaWJsaW5ncy5cbiAgY29uc3QgYnVpbGRTY3JlZW5zaG90c0luZGV4ID0gKGJ1bmRsZWQ6IFNldDxzdHJpbmc+KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IGFyY2hpdmVOYW1lID0gYnVpbGRFeHBvcnRGaWxlbmFtZSgndGFyLnpzdCcpO1xuICAgIGNvbnN0IHN0ZW0gPSBhcmNoaXZlTmFtZS5yZXBsYWNlKC9cXC50YXJcXC56c3QkLywgJycpO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IGAke3N0ZW19Lmpzb25sYDtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0Jyk7XG4gICAgLy8gVGhlIEpTT05MIGluc2lkZSB0aGUgYXJjaGl2ZSBtdXN0IGRlY2xhcmUgaXRzZWxmIGFzIHBhcnQgb2YgYVxuICAgIC8vIHRhci56c3QgYnVuZGxlIHNvIGl0cyBtYW5pZmVzdCdzIGBkZXNpZ24uaW5saW5lYCAvIGBza2lsbC5pbmxpbmVgXG4gICAgLy8gZmxhZ3MgbWF0Y2ggd2hhdCdzIGFjdHVhbGx5IHByZXNlbnQgaW4gdGhlIHN1cnJvdW5kaW5nIHRhci5cbiAgICBjb25zdCBqc29ubFRleHQgPSBidWlsZEpzb25sKGpzb25sTmFtZSwgJ3Rhci56c3QnKTtcbiAgICBjb25zdCBzcWwgPSBkdWNrRGJTbmlwcGV0KGpzb25sTmFtZSk7XG4gICAgY29uc3Qge2VudHJpZXM6IHNob3RFbnRyaWVzLCBidW5kbGVkfSA9IGNvbGxlY3RTY3JlZW5zaG90RW50cmllcygpO1xuICAgIGNvbnN0IHJlYWRtZSA9IGJ1aWxkUmVhZG1lKG1hbmlmZXN0LCBqc29ubE5hbWUsIHNob3RFbnRyaWVzLmxlbmd0aCk7XG4gICAgY29uc3Qgc2hvdHNKc29uID0gYnVpbGRTY3JlZW5zaG90c0luZGV4KGJ1bmRsZWQpO1xuXG4gICAgLy8gTWFya2Rvd24gZXhwb3J0IHdhcyBkcm9wcGVkOiBpdCBjYXJyaWVkIG5vIGRhdGEgdGhlIEpTT05MIGRpZG4ndFxuICAgIC8vIGFscmVhZHkgaGF2ZSAodGhlIGh1bWFuLXJlYWRhYmxlIHN1cmZhY2Ugd2FzIGp1c3QgYSBjdXJhdGVkIHN1YnNldFxuICAgIC8vIG9mIHRoZSBzYW1lIGZpZWxkcyksIGFuZCB0aGUgZGl2ZXJnZW5jZSDigJQgbWQgc2lsZW50bHkgZHJvcHBlZFxuICAgIC8vIGdyb3VwIGNoaWxkcmVuICsgdGhlIGVudGlyZSBgX2F1ZGl0YCBuYW1lc3BhY2Ug4oCUIHJpc2tlZFxuICAgIC8vIG1pc2xlYWRpbmcgYW55IGh1bWFuIHNraW0uIFJFQURNRS5tZCBpbnNpZGUgdGhlIGFyY2hpdmUgaXMgdGhlXG4gICAgLy8gaHVtYW4gZW50cnkgcG9pbnQgbm93LlxuICAgIC8vIEJ1ZyAjNzogZ2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIHRoZSBhZ2VudCdzIGZpcnN0LXJlYWQgZW50cnlcbiAgICAvLyBwb2ludC4gQnVnICM0MCBmaXJzdC1yZWFkIG9yZGVyOiBSRUFETUUgcG9pbnRzIHRoZSByZWNlaXZlciBhdFxuICAgIC8vIHJlcGFpci1pbmRleC5tZCBiZWZvcmUgU0tJTEwubWQgLyBERVNJR04ubWQuXG4gICAgY29uc3QgcmVwYWlySW5kZXggPSBidWlsZFJlcGFpckluZGV4KG1hbmlmZXN0LCBqc29ubE5hbWUpO1xuICAgIGNvbnN0IHRhckVudHJpZXM6IFRhckVudHJ5W10gPSBbXG4gICAgICB7bmFtZTogJ1JFQURNRS5tZCcsIGRhdGE6IHJlYWRtZX0sXG4gICAgICB7bmFtZTogJ3JlcGFpci1pbmRleC5tZCcsIGRhdGE6IHJlcGFpckluZGV4fSxcbiAgICAgIHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IGpzb25sVGV4dH0sXG4gICAgICB7bmFtZTogJ3NjcmVlbnNob3RzLmpzb24nLCBkYXRhOiBzaG90c0pzb259LFxuICAgICAge25hbWU6ICdkdWNrZGIuc3FsJywgZGF0YTogc3FsfSxcbiAgICAgIC8vIEJ1ZyAjMjg6IG1hY2hpbmUtcmVhZGFibGUgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlLlxuICAgICAge25hbWU6ICdzY2hlbWEuanNvbicsIGRhdGE6IGJ1aWxkU2NoZW1hSnNvbigpfSxcbiAgICAgIC4uLnNob3RFbnRyaWVzLFxuICAgIF07XG4gICAgLy8gREVTSUdOLm1kIOKAlCBlaXRoZXIgdGhlIHVzZXIncyBjdXN0b21pemVkIGNvbnRlbnQgb3IgdGhlIGJ1bmRsZWRcbiAgICAvLyB0ZW1wbGF0ZSAvIGxvY2FsIG92ZXJyaWRlLiBSZXNvbHZlZCB0aHJvdWdoIHRoZSBzYW1lIGxvYWRlciB0aGVcbiAgICAvLyBzZXR0aW5ncyBtb2RhbCB1c2VzIHNvIGNocm9tZS5zdG9yYWdlIHN0YXlzIHNtYWxsIChlbXB0eSBwcmVmc1xuICAgIC8vIOKGkiBmYWxsYmFjayB0byBleHRlbnNpb24vdGVtcGxhdGVzLyoubWQgdmlhIGZldGNoKS5cbiAgICBjb25zdCBkZXNpZ25Db250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICBpZiAoZGVzaWduQ29udGVudC50cmltKCkpIHtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0RFU0lHTi5tZCcsIGRhdGE6IGRlc2lnbkNvbnRlbnR9KTtcbiAgICB9XG4gICAgLy8gUGluY2hHcmFiIFVJIHNraWxsIOKAlCBzYW1lIHN0b3J5LiBMaXZlcyBhdCB0aGUgY2Fub25pY2FsIHJlY2VpdmVyXG4gICAgLy8gcGF0aCBpbnNpZGUgdGhlIGFyY2hpdmUgc28gdGhlIHJlY2VpdmVyJ3MgYC5hZ2VudHMvYCB0cmVlIGNhbiBiZVxuICAgIC8vIHBvcHVsYXRlZCBieSBhIHNpbXBsZSBgdGFyIC14YCBmcm9tIHRoZSBhcmNoaXZlIHJvb3QuXG4gICAgLy9cbiAgICAvLyBGcm9udG1hdHRlciByZW5hbWU6IGEgdXNlcidzIHNvdXJjZSBTS0lMTC5tZCBtYXkgdXNlIGBuYW1lOiB1aWBcbiAgICAvLyAoYmVjYXVzZSB0aGF0J3MgaG93IGl0J3MgY2F0YWxvZ3VlZCBpbiB0aGVpciBnbG9iYWwgYC5hZ2VudHMvYFxuICAgIC8vIHNraWxscyB0cmVlKS4gSW5zaWRlIGEgUGluY2hHcmFiIGFyY2hpdmUgdGhlIHNraWxsIGlzICp0aGUqXG4gICAgLy8gUGluY2hHcmFiIHNraWxsLCBzbyB3ZSByZWJyYW5kIHRoZSBmcm9udG1hdHRlciBgbmFtZTpgIGZpZWxkIG9uXG4gICAgLy8gdGhlIHdheSBpbnRvIHRoZSB0YXIgd2l0aG91dCB0b3VjaGluZyB0aGUgYm9keS4gT25seSB0aGUgRklSU1RcbiAgICAvLyBgbmFtZTpgIGxpbmUgaW5zaWRlIHRoZSBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHJld3JpdHRlbi5cbiAgICBjb25zdCBza2lsbENvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgaWYgKHNraWxsQ29udGVudC50cmltKCkpIHtcbiAgICAgIGNvbnN0IHJlYnJhbmRlZCA9IHJlYnJhbmRTa2lsbE5hbWUoc2tpbGxDb250ZW50LCAnUGluY2hHcmFiJyk7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLCBkYXRhOiByZWJyYW5kZWR9KTtcbiAgICB9XG4gICAgLy8gUmVidWlsZCB0aGUgbWFuaWZlc3QgbGluZSBpbiB0aGUgSlNPTkwgd2l0aCBhcmNoaXZlSW50ZWdyaXR5XG4gICAgLy8gKGZpbGUgbGlzdCArIHNpemVzKS4gSGFzIHRvIGhhcHBlbiBBRlRFUiBhbGwgdGFyRW50cmllcyBhcmVcbiAgICAvLyBhc3NlbWJsZWQgYnV0IEJFRk9SRSB3ZSB0YXIgdGhlbSwgc28gd2Uga25vdyB3aGF0J3MgaW4gdGhlXG4gICAgLy8gYnVuZGxlLiBUaGVuIHdlIHJlcGxhY2UgdGhlIEpTT05MJ3MgbWFuaWZlc3Qgd2l0aCB0aGUgYXVnbWVudGVkXG4gICAgLy8gdmVyc2lvbi5cbiAgICB0cnkge1xuICAgICAgY29uc3QgaW50ZWdyaXR5OiB7ZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+fSA9IHtmaWxlczogW119O1xuICAgICAgZm9yIChjb25zdCBlIG9mIHRhckVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGUuZGF0YSkgOiAoZS5kYXRhIGFzIFVpbnQ4QXJyYXkpO1xuICAgICAgICBpbnRlZ3JpdHkuZmlsZXMucHVzaCh7cGF0aDogZS5uYW1lLCBzaXplOiBkYXRhLmxlbmd0aH0pO1xuICAgICAgfVxuICAgICAgLy8gUmUtZW1pdCB0aGUgSlNPTkwgd2l0aCB0aGUgYXVnbWVudGVkIG1hbmlmZXN0LiBDaGVhcGVyIHRvIGRvXG4gICAgICAvLyB0aGlzIHJlLXJlbmRlciB0aGFuIHRvIG1haW50YWluIG11dGFibGUgc3RhdGUgdGhyb3VnaCB0aGUgc2xpbVxuICAgICAgLy8gZW1pdC4gV2Ugc3dhcCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGluLXBsYWNlLlxuICAgICAgY29uc3QgYXVnbWVudGVkTWFuaWZlc3QgPSB7Li4ubWFuaWZlc3QsIGFyY2hpdmVJbnRlZ3JpdHk6IGludGVncml0eX07XG4gICAgICBjb25zdCBsaW5lcyA9IGpzb25sVGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICBsaW5lc1swXSA9IEpTT04uc3RyaW5naWZ5KGF1Z21lbnRlZE1hbmlmZXN0KTtcbiAgICAgIGNvbnN0IG5ld0pzb25sID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICBjb25zdCBpZHggPSB0YXJFbnRyaWVzLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBqc29ubE5hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB0YXJFbnRyaWVzW2lkeF0gPSB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBuZXdKc29ubH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnYXJjaGl2ZUludGVncml0eSBjb21wdXRhdGlvbiBmYWlsZWQnLCBlcnIpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhckJ5dGVzID0gYnVpbGRUYXIodGFyRW50cmllcyk7XG4gICAgY29uc3QgYXJjaGl2ZUJ5dGVzID0gd3JhcFpzdGQodGFyQnl0ZXMpO1xuXG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdvbkV4cG9ydEFyY2hpdmUg4oaSJywge2FyY2hpdmVOYW1lLCB0YXJCeXRlczogdGFyQnl0ZXMubGVuZ3RoLCBhcmNoaXZlQnl0ZXM6IGFyY2hpdmVCeXRlcy5sZW5ndGgsIHNjcmVlbnNob3RzOiBzaG90RW50cmllcy5sZW5ndGh9KTtcbiAgICAgIC8vIFBhc3MgYXMgYSBwbGFpbiBudW1iZXJbXSBvdmVyIHNlbmRNZXNzYWdlOyBzdHJ1Y3R1cmVkLWNsb25lIG9mXG4gICAgICAvLyBVaW50OEFycmF5IHZpYSBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBpc24ndCByZWxpYWJsZSBhY3Jvc3NcbiAgICAgIC8vIENocm9tZSB2ZXJzaW9ucy5cbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzYXZlLWJ5dGVzJywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWU6IGFyY2hpdmVOYW1lLFxuICAgICAgICBieXRlczogQXJyYXkuZnJvbShhcmNoaXZlQnl0ZXMpLCBtaW1lOiAnYXBwbGljYXRpb24venN0ZCcsXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICAvLyBBdXRvLWNvcHkgdGhlIGFic29sdXRlIHBhdGggdG8gY2xpcGJvYXJkIHNvIHRoZSB1c2VyIGRvZXNuJ3RcbiAgICAgICAgLy8gaGF2ZSB0byBodW50IGZvciBpdC4gVGhlIHRvb2xiYXIgY29sbGFwc2VkIHRoZSBkZWRpY2F0ZWRcbiAgICAgICAgLy8gXCJjb3B5IHBhdGhcIiBidXR0b24gaW50byB0aGlzIHNpbmdsZSBhY3Rpb24uXG4gICAgICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGNvbnN0IHBhdGhDb3BpZWQgPSBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQocGF0aFRvQ29weSk7XG4gICAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICAgIGlmIChwYXRoQ29waWVkKSBzaG93Q29waWVkKCdFeHBvcnRlZCBhbmQgY29waWVkJywgbGVhZik7XG4gICAgICAgIHNldFN0YXR1cyhcbiAgICAgICAgICBgRXhwb3J0ZWQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkJHtwYXRoQ29waWVkID8gJyDCtyBwYXRoIGNvcGllZCcgOiAnJ30ke2xhc3RFeHBvcnQudGVtcFBhdGggPyAnIMK3IFBsYXl3cmlnaHQgdGVtcCBoaWRkZW4nIDogJyd9IMK3ICR7bGVhZn1gLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ29uRXhwb3J0QXJjaGl2ZSBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgQXJjaGl2ZSBleHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gVGVzdC9kZXYgZmFsbGJhY2s6IHN5bnRoZXNpemUgYSBkb3dubG9hZCBsaW5rLlxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYXJjaGl2ZUJ5dGVzIGFzIHVua25vd24gYXMgQmxvYlBhcnRdLCB7dHlwZTogJ2FwcGxpY2F0aW9uL3pzdGQnfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDsgYS5kb3dubG9hZCA9IGFyY2hpdmVOYW1lOyBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGFyY2hpdmVOYW1lKTtcbiAgICBzaG93Q29waWVkKCdFeHBvcnRlZCBhbmQgY29waWVkJywgYXJjaGl2ZU5hbWUpO1xuICAgIHNldFN0YXR1cyhgV29ya3NwYWNlIGV4cG9ydGVkIMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCDCtyBwYXRoIGNvcGllZGApO1xuICB9O1xuXG4gIC8vIEJlc3QtZWZmb3J0IGNsaXBib2FyZCB3cml0ZSDigJQgbmV2ZXIgdGhyb3dzOyByZXR1cm5zIHdoZXRoZXIgdGhlXG4gIC8vIHdyaXRlIHN1Y2NlZWRlZCBzbyB0aGUgY2FsbGVyIGNhbiBhZGp1c3QgdGhlIHN0YXR1cyBtZXNzYWdlLlxuICAvLyBDbGlwYm9hcmQgd3JpdGVzIGNhbiBmYWlsIHdoZW4gdGhlIHBhbmVsIGRvZXNuJ3QgaGF2ZSBmb2N1cyBvciBpblxuICAvLyBzb21lIHRlc3QgaGFybmVzc2VzLCBhbmQgd2UgZG9uJ3Qgd2FudCB0aGF0IHRvIGJsb2NrIHRoZSBleHBvcnQuXG4gIGNvbnN0IGNvcHlUb0NsaXBib2FyZFNpbGVudCA9IGFzeW5jICh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTsgcmV0dXJuIHRydWU7IH1cbiAgICBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9O1xuICAvLyDilIDilIDilIAgRHVja0RCIHNuaXBwZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENhbm9uaWNhbCBTUUwgcmVjaXBlcyBmb3IgcXVlcnlpbmcgYSBKU09OTCBleHBvcnQuIENvcGllcyB0byBjbGlwYm9hcmRcbiAgLy8gYW5kIHByaW50cyBhIHN0YXR1cyBtZXNzYWdlIOKAlCB3ZSBkb24ndCBydW4gRHVja0RCIG91cnNlbHZlcywgdGhlIHVzZXJcbiAgLy8gcGlwZXMgdGhlIHNuaXBwZXQgaW50byBgZHVja2RiYCBvbiB0aGVpciBtYWNoaW5lLiBUaGUgcmVjaXBlcyB0YXJnZXRcbiAgLy8gcXVlc3Rpb25zIGEgVUktZW5naW5lZXIgTExNIHdvcmtmbG93IHRlbmRzIHRvIGFzazogbGlzdCBjYXB0dXJlcyBieVxuICAvLyBob3N0LCBmaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwsIGZpbmQgY2FwdHVyZXMgbWlzc2luZyBhIHNjcmVlbnNob3QsXG4gIC8vIGFuZCB1bmlxdWUtdG9rZW4gZnJlcXVlbmN5IGZvciBhIHF1aWNrIGRlc2lnbi10b2tlbnMgb3ZlcnZpZXcuXG4gIGNvbnN0IGR1Y2tEYlNuaXBwZXQgPSAoanNvbmxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4gYC0tIFBpbmNoR3JhYiDihpIgRHVja0RCIHJlY2lwZXNcbi0tIFNhdmUgeW91ciBKU09OTCBleHBvcnQsIHRoZW4gaW4geW91ciBzaGVsbDpcbi0tICAgZHVja2RiIDwgdGhpc19maWxlLnNxbFxuLS0gT3Igb3BlbiBhIGR1Y2tkYiBzaGVsbCBhbmQgcGFzdGUgdGhlc2Ugb25lIGF0IGEgdGltZS5cblxuLS0gMSkgTG9hZCB0aGUgSlNPTkwgaW50byBhIHRhYmxlLlxuLS0gICAgc2FtcGxlX3NpemU9LTEgZm9yY2VzIGEgZnVsbC1maWxlIHNjYW4gZm9yIHNjaGVtYSBpbmZlcmVuY2UuIFdpdGhvdXRcbi0tICAgIGl0LCBEdWNrREIgb25seSBzbmlmZnMgdGhlIGZpcnN0IDIwIDQ4MCByb3dzIOKAlCBhbmQgUGluY2hHcmFiIGV4cG9ydHNcbi0tICAgIG1peCBzZWxlY3RvciArIGZlZWRiYWNrIHJvdyB0eXBlcywgc28gcmFyZSBmZWVkYmFjay1vbmx5IGZpZWxkc1xuLS0gICAgKHRhZ3MsIHBhcmVudFVpZCkgY2FuIGJlIGRyb3BwZWQgZnJvbSB0aGUgaW5mZXJyZWQgc2NoZW1hIGlmIHRoZXlcbi0tICAgIGRvbid0IGFwcGVhciBlYXJseSBlbm91Z2guIFRoYXQgYml0ZXMgcmVjaXBlIDYgYmVsb3cuXG5DUkVBVEUgT1IgUkVQTEFDRSBUQUJMRSBwZyBBU1xuU0VMRUNUICogRlJPTSByZWFkX2pzb25fYXV0byhcbiAgJyR7anNvbmxOYW1lfScsXG4gIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLFxuICBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCxcbiAgc2FtcGxlX3NpemU9LTFcbik7XG5cbi0tIDIpIFF1aWNrIG92ZXJ2aWV3OiBob3cgbWFueSBjYXB0dXJlcyBwZXIgaG9zdC5cblNFTEVDVFxuICByZWdleHBfZXh0cmFjdCh1cmwsICc6Ly8oW14vXSspJywgMSkgQVMgaG9zdCxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJykgQVMgY2FwdHVyZXMsXG4gIENPVU5UKCopIEZJTFRFUiAoV0hFUkUgdHlwZSA9ICdmZWVkYmFjaycpIEFTIGNvbW1lbnRzXG5GUk9NIHBnXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBjYXB0dXJlcyBERVNDO1xuXG4tLSAzKSBGaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwgYWNyb3NzIGNhcHR1cmVzIChvZnRlbiBzaWduYWxzIGEgcmV1c2VkXG4tLSAgICBjb21wb25lbnQgdGhlIHVzZXIgaGFzIGNsaWNrZWQgaW50byBtdWx0aXBsZSB0aW1lcykuXG5TRUxFQ1Qgb3V0ZXJIVE1MLCBDT1VOVCgqKSBBUyBoaXRzLCBsaXN0KHNlbGVjdG9yKSBBUyBzZWxlY3RvcnNcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBvdXRlckhUTUwgSVMgTk9UIE5VTExcbkdST1VQIEJZIG91dGVySFRNTFxuSEFWSU5HIGhpdHMgPiAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDI1O1xuXG4tLSA0KSBDYXB0dXJlcyBzdGlsbCBtaXNzaW5nIGEgc2NyZWVuc2hvdCBwYXRoLlxuU0VMRUNUIG4sIHVybCwgc2VsZWN0b3JcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBzY3JlZW5zaG90IElTIE5VTExcbk9SREVSIEJZIG47XG5cbi0tIDUpIFF1aWNrIGRlc2lnbi10b2tlbiBzdXJmYWNlOiByYW5rIGNsYXNzZXMgdGhhdCBhcHBlYXIgaW4gbWFueSBjYXB0dXJlcy5cbi0tICAgIE5PVEU6IGZpbHRlciBjbGFzc2VzIElTIE5PVCBOVUxMIHJhdGhlciB0aGFuIHVzaW5nIGEgY29hbGVzY2Utd2l0aC1lbXB0eVxuLS0gICAgZmFsbGJhY2s7IER1Y2tEQiBjYW5ub3QgaW5mZXIgZWxlbWVudCB0eXBlcyBmb3IgYW4gZW1wdHkgbGlzdCBsaXRlcmFsLlxuV0lUSCBleHBhbmRlZCBBUyAoXG4gIFNFTEVDVCB1bm5lc3QoY2xhc3NlcykgQVMgY1xuICBGUk9NIHBnXG4gIFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBjbGFzc2VzIElTIE5PVCBOVUxMXG4pXG5TRUxFQ1QgYywgQ09VTlQoKikgQVMgaGl0c1xuRlJPTSBleHBhbmRlZFxuR1JPVVAgQlkgMVxuT1JERVIgQlkgaGl0cyBERVNDXG5MSU1JVCAzMDtcblxuLS0gNikgQ29tbWVudHMgam9pbmVkIHRvIHRoZWlyIHBhcmVudCBzZWxlY3RvciB2aWEgcGFyZW50VWlkLiBUaGVcbi0tICAgIHMudHlwZSBmaWx0ZXIgcHJldmVudHMgYW4gYWNjaWRlbnRhbCBmZWVkYmFja+KGlGZlZWRiYWNrIGpvaW4gaW4gY2FzZVxuLS0gICAgdHdvIHJvd3MgZXZlciBzaGFyZSBhIHVpZCBieSBjb2luY2lkZW5jZS5cblNFTEVDVCBzLm4sIHMuc2VsZWN0b3IsIGYudGV4dCwgZi50YWdzXG5GUk9NIHBnIGZcbkpPSU4gcGcgc1xuICBPTiBzLnVpZCA9IGYucGFyZW50VWlkXG4gQU5EIHMudHlwZSA9ICdzZWxlY3RvcidcbldIRVJFIGYudHlwZSA9ICdmZWVkYmFjaydcbk9SREVSIEJZIHMubjtcbmA7XG4gIGNvbnN0IG9uRHVja0RiU25pcHBldCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBQcmVmZXIgdGhlIEpTT05MIGZpbGVuYW1lIG9mIHRoZSBtb3N0IHJlY2VudCBleHBvcnQgc28gdGhlIHVzZXIgY2FuXG4gICAgLy8gcGFzdGUgdGhpcyBkaXJlY3RseSB3aXRob3V0IGVkaXRpbmcgdGhlIHJlYWRfanNvbl9hdXRvIHBhdGguIEZhbGxcbiAgICAvLyBiYWNrIHRvIGEgZnJlc2ggZXBvY2gtYmFzZWQgbmFtZSBpZiBub3RoaW5nIGhhcyBiZWVuIGV4cG9ydGVkIHlldC5cbiAgICBjb25zdCBsYXN0ID0gbGFzdEV4cG9ydC5yZWxQYXRoO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IChsYXN0ICYmIC9cXC5qc29ubCQvLnRlc3QobGFzdCkpXG4gICAgICA/IGxhc3Quc3BsaXQoJy8nKS5wb3AoKSEgIC8vIHN0cmlwIHdvcmtzcGFjZS9leHBvcnRzLyBwcmVmaXhcbiAgICAgIDogYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBzcWwgPSBkdWNrRGJTbmlwcGV0KGpzb25sTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNxbCk7XG4gICAgICBzZXRTdGF0dXMoYER1Y2tEQiByZWNpcGVzIGNvcGllZCDCtyBwYXN0ZSBpbnRvIFxcYGR1Y2tkYlxcYCBzaGVsbCDCtyByZWZlcmVuY2VzICR7anNvbmxOYW1lfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIER1Y2tEQiBTUUwnLCBqc29ubE5hbWUpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgZmFpbGVkIOKAlCBvcGVuIHRoZSBwYW5lbCBpbiBhbiBleHRlbnNpb24gY29udGV4dCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgJ09wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jyk7XG4gICAgfVxuICB9O1xuICAvLyDilIDilIDilIAgU2NoZW1hIG1pZ3JhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ29udmVydCBhIHYxLXNoYXBlZCBFbnRyeS1vci1leHBvcnQtbGluZSBpbnRvIG91ciBpbnRlcm5hbCBFbnRyeS4gSWRlbXBvdGVudC5cbiAgLy8gU3VwcG9ydHM6XG4gIC8vICAg4oCiIGZsYXQgdjEgZW50cnkgKG5vIGBfYXVkaXRgLCBubyBgdmAgZmllbGQpXG4gIC8vICAg4oCiIHYyIGV4cG9ydCBlbnRyeSAoaGFzIGBfYXVkaXRgLCBgdjogMmAsIGB0eXBlOiAnc2VsZWN0b3InYClcbiAgLy8gICDigKIgbWl4ZWQgKHNvbWUgZmllbGRzIG5lc3RlZCwgc29tZSBmbGF0IOKAlCBsYXN0IHdpbnMgZm9yIHNhZmV0eSlcbiAgLy8gUHVyZTogbmV2ZXIgbXV0YXRlcyBgcmF3YCBvciBhbnkgb2YgaXRzIG5lc3RlZCBvYmplY3RzLiBSZXR1cm5zIGEgbmV3XG4gIC8vIGVudHJ5IHdpdGggYWxsIG1pZ3JhdGlvbnMgYXBwbGllZC4gVG91Y2hlZCBzdWJvYmplY3RzIChhdHRycywgaGludHMsXG4gIC8vIGdyb3VwIG1lbWJlcnMpIGFyZSBjbG9uZWQgYmVmb3JlIGVkaXQ7IHVudG91Y2hlZCBvbmVzIHNoYXJlIHJlZnMgd2l0aFxuICAvLyByYXcsIHdoaWNoIGlzIGZpbmUgc2luY2Ugd2UgbmV2ZXIgd3JpdGUgdG8gdGhlbS5cbiAgY29uc3QgZGVub3JtYWxpemVFbnRyeSA9IChyYXc6IGFueSk6IEVudHJ5ID0+IHtcbiAgICBjb25zdCBvdXQ6IGFueSA9IHsuLi5yYXd9O1xuICAgIGRlbGV0ZSBvdXQudjtcbiAgICBkZWxldGUgb3V0LnR5cGU7XG4gICAgZGVsZXRlIG91dC5mZWVkYmFjaztcbiAgICBpZiAob3V0Ll9hdWRpdCAmJiB0eXBlb2Ygb3V0Ll9hdWRpdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IGEgPSBvdXQuX2F1ZGl0O1xuICAgICAgaWYgKGEuYW5jZXN0b3JzICE9PSB1bmRlZmluZWQpIG91dC5hbmNlc3RvcnMgPSBhLmFuY2VzdG9ycztcbiAgICAgIGlmIChhLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgb3V0LmNvbXBvbmVudFJvb3QgPSBhLmNvbXBvbmVudFJvb3Q7XG4gICAgICBpZiAoYS5pblNoYWRvd0RPTSAhPT0gdW5kZWZpbmVkKSBvdXQuaW5TaGFkb3dET00gPSBhLmluU2hhZG93RE9NO1xuICAgICAgaWYgKGEucHNldWRvRWxlbWVudHMgIT09IHVuZGVmaW5lZCkgb3V0LnBzZXVkb0VsZW1lbnRzID0gYS5wc2V1ZG9FbGVtZW50cztcbiAgICAgIGlmIChhLm1hdGNoZWRSdWxlcyAhPT0gdW5kZWZpbmVkKSBvdXQubWF0Y2hlZFJ1bGVzID0gYS5tYXRjaGVkUnVsZXM7XG4gICAgICBpZiAoYS52aWV3cG9ydCAhPT0gdW5kZWZpbmVkKSBvdXQudmlld3BvcnQgPSBhLnZpZXdwb3J0O1xuICAgICAgZGVsZXRlIG91dC5fYXVkaXQ7XG4gICAgfVxuICAgIC8vIHN0YXRlczogdjEgdXNlZCBSZWNvcmQ8c3RyaW5nLCB0cnVlPjsgdjIgdXNlcyBzdHJpbmdbXS4gTm9ybWFsaXplIGJvdGguXG4gICAgaWYgKG91dC5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkob3V0LnN0YXRlcykgJiYgdHlwZW9mIG91dC5zdGF0ZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICBvdXQuc3RhdGVzID0gT2JqZWN0LmtleXMob3V0LnN0YXRlcykuZmlsdGVyKChrKSA9PiBCb29sZWFuKChvdXQuc3RhdGVzIGFzIGFueSlba10pKTtcbiAgICB9XG4gICAgLy8gYXR0cnMuZm9ybWF0IOKGkiBoaW50cy5mb3JtYXQuIENsb25lIGF0dHJzIGZpcnN0IHNvIHdlIGRvbid0IG11dGF0ZSB0aGVcbiAgICAvLyBjYWxsZXIncyBuZXN0ZWQgb2JqZWN0LiBTYW1lIGZvciBoaW50cyAod2UgbWF5IG1lcmdlIGludG8gaXQpLlxuICAgIGlmIChvdXQuYXR0cnMgJiYgdHlwZW9mIG91dC5hdHRycyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG91dC5hdHRycy5mb3JtYXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBmbXQgPSBvdXQuYXR0cnMuZm9ybWF0O1xuICAgICAgY29uc3Qge2Zvcm1hdDogX2Ryb3AsIC4uLnJlc3RBdHRyc30gPSBvdXQuYXR0cnM7XG4gICAgICBvdXQuYXR0cnMgPSByZXN0QXR0cnM7XG4gICAgICBvdXQuaGludHMgPSB7Li4uKG91dC5oaW50cyA/PyB7fSksIGZvcm1hdDogZm10fTtcbiAgICB9XG4gICAgaWYgKCFvdXQudWlkKSBvdXQudWlkID0gbXNnSWQoKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvdXQuZ3JvdXApKSBvdXQuZ3JvdXAgPSBvdXQuZ3JvdXAubWFwKGRlbm9ybWFsaXplRW50cnkpO1xuICAgIHJldHVybiBvdXQgYXMgRW50cnk7XG4gIH07XG4gIC8vIFdhbGsgYWxsIGxvYWRlZCBtZXNzYWdlcyBhbmQgbWlncmF0ZSBhbnkgbGVnYWN5IGVudHJpZXMuIFJldHVybnMgdHJ1ZSBpZlxuICAvLyBhbnl0aGluZyBtdXRhdGVkIHNvIHRoZSBjYWxsZXIgY2FuIHBlcnNpc3QuXG4gIGNvbnN0IG1pZ3JhdGVMb2FkZWRNZXNzYWdlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICBsZXQgbXV0YXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBiZWZvcmUgPSBtLmVudHJ5O1xuICAgICAgLy8gQ2hlYXAgcHJlLWNoZWNrOiBpZiB1aWQgZXhpc3RzIEFORCBzdGF0ZXMgaXMgYW4gYXJyYXkgQU5EIG5vIF9hdWRpdFxuICAgICAgLy8gQU5EIG5vIGF0dHJzLmZvcm1hdCDihpIgbm90aGluZyB0byBkbywgc2tpcCB0aGUgd29yay5cbiAgICAgIGNvbnN0IG5lZWRzV29yayA9XG4gICAgICAgICFiZWZvcmUudWlkIHx8XG4gICAgICAgIChiZWZvcmUuc3RhdGVzICYmICFBcnJheS5pc0FycmF5KGJlZm9yZS5zdGF0ZXMpKSB8fFxuICAgICAgICAoYmVmb3JlIGFzIGFueSkuX2F1ZGl0ICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgKGJlZm9yZS5hdHRycyAmJiB0eXBlb2YgKGJlZm9yZS5hdHRycyBhcyBhbnkpLmZvcm1hdCA9PT0gJ3N0cmluZycpO1xuICAgICAgaWYgKCFuZWVkc1dvcmspIGNvbnRpbnVlO1xuICAgICAgbS5lbnRyeSA9IGRlbm9ybWFsaXplRW50cnkoYmVmb3JlKTtcbiAgICAgIG11dGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gbXV0YXRlZDtcbiAgfTtcbiAgY29uc3Qgb25JbXBvcnQgPSAoKTogdm9pZCA9PiBpbXBvcnRGaWxlLmNsaWNrKCk7XG4gIGltcG9ydEZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKGUpID0+IHtcbiAgICBjb25zdCBmaWxlID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzPy5bMF07XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgY29uc3QgaW1wb3J0ZWQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgZm9yIChjb25zdCBsaW5lIG9mIHRleHQuc3BsaXQoL1xccj9cXG4vKSkge1xuICAgICAgaWYgKCFsaW5lLnRyaW0oKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBvID0gSlNPTi5wYXJzZShsaW5lKTtcbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ21hbmlmZXN0Jykge1xuICAgICAgICAgIC8vIE1hbmlmZXN0IGxpbmUg4oCUIGluZm9ybWF0aW9uYWwgb25seSBvbiBpbXBvcnQuIFNraXAuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ3BhZ2UnKSBpbXBvcnRlZC5wdXNoKHt0eXBlOiAncGFnZScsIGlkOiBtc2dJZCgpLCB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHVybDogby51cmwsIHRpdGxlOiBvLnRpdGxlLCB2aWV3cG9ydDogby52aWV3cG9ydCwgdG9rZW5zOiBvLnRva2VucywgdXNlckFnZW50OiBvLnVzZXJBZ2VudCwgbGFuZzogby5sYW5nfSk7XG4gICAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dDogby50ZXh0LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKG8ucGFyZW50VWlkKSBmYi5wYXJlbnRVaWQgPSBvLnBhcmVudFVpZDtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvLnRhZ3MpICYmIG8udGFncy5sZW5ndGgpIGZiLnRhZ3MgPSBvLnRhZ3M7XG4gICAgICAgICAgaWYgKG8uc2V2ZXJpdHkpIGZiLnNldmVyaXR5ID0gby5zZXZlcml0eTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKGZiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzZWxlY3RvciBsaW5lIOKAlCBjb3VsZCBiZSB2MSAoZmxhdCkgb3IgdjIgKHdpdGggX2F1ZGl0KS4gVGhlXG4gICAgICAgICAgLy8gYnVuZGxlZCBmZWVkYmFjayBhcnJheSBtdXN0IGJlIHNwbGl0IG91dCBpbnRvIHNlcGFyYXRlIGZlZWRiYWNrXG4gICAgICAgICAgLy8gbWVzc2FnZXMgZm9yIHJvdW5kLXRyaXAgd2l0aCB2MSByZWFkZXJzIOKAlCBidXQgaW4gdjIgd2UgYWxyZWFkeVxuICAgICAgICAgIC8vIGVtaXQgc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lcywgc28gZHJvcHBpbmcgdGhlIGJ1bmRsZWQgbGlzdCBpc1xuICAgICAgICAgIC8vIHNhZmUgdG8gYXZvaWQgZG91YmxlLWNvdW50aW5nLlxuICAgICAgICAgIGNvbnN0IGZiID0gQXJyYXkuaXNBcnJheShvLmZlZWRiYWNrKSA/IG8uZmVlZGJhY2sgOiBudWxsO1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShvKTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeX0pO1xuICAgICAgICAgIC8vIE9ubHkgaW5mbGF0ZSBidW5kbGVkIGZlZWRiYWNrIGlmIHRoZSBmaWxlIGlzIHYxIChubyB2ZXJzaW9uXG4gICAgICAgICAgLy8gbWFya2VyIG9uIHRoZSBzZWxlY3RvciBsaW5lcykuIHYyIGhhcyBpdHMgb3duIHN0YW5kYWxvbmVcbiAgICAgICAgICAvLyBmZWVkYmFjayBsaW5lcyB0aGF0IGFycml2ZSBzZXBhcmF0ZWx5LlxuICAgICAgICAgIGlmIChmYiAmJiBvLnYgIT09IDIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBmYikgaW1wb3J0ZWQucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgIHRleHQ6IHR5cGVvZiB0ID09PSAnc3RyaW5nJyA/IHQgOiB0Py50ZXh0ID8/ICcnLFxuICAgICAgICAgICAgICBwYXJlbnRVaWQ6IGVudHJ5LnVpZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7IC8qIHNraXAgYmFkIGxpbmUgKi8gfVxuICAgIH1cbiAgICBtZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgLi4uaW1wb3J0ZWRdO1xuICAgIHBlcnNpc3QoKTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKGBJbXBvcnRlZCAke2ltcG9ydGVkLmxlbmd0aH0gbWVzc2FnZSR7aW1wb3J0ZWQubGVuZ3RoID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgaW1wb3J0RmlsZS52YWx1ZSA9ICcnO1xuICB9KTtcbiAgY29uc3Qgb25DbGVhciA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWNvbmZpcm0oJ0NsZWFyIGFsbCBjYXB0dXJlcyBhbmQgY29tbWVudHM/JykpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIG1lc3NhZ2VzID0gW107XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBlcnNpc3RTaG90cygpO1xuICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdDbGVhcmVkJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFZhbGlkYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJ1blZhbGlkYXRpb24gPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgc2VsZWN0b3JzID0gWy4uLm5ldyBTZXQobWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpKV07XG4gICAgaWYgKCFzZWxlY3RvcnMubGVuZ3RoIHx8ICFpbkV4dGVuc2lvbikgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgaWYgKCF0YWJzWzBdKSByZXR1cm47XG4gICAgICBsaXZlVGFiVXJsID0gdGFic1swXS51cmwgPz8gbGl2ZVRhYlVybDtcbiAgICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKGxpdmVUYWJVcmwgPz8gJycpO1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkISwgcGcoe2tpbmQ6ICd2YWxpZGF0ZScsIHNlbGVjdG9yc30pKSBhcyB7dmFsaWQ/OiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPn07XG4gICAgICBpZiAocmVwbHk/LnZhbGlkKSB7XG4gICAgICAgIGZvciAoY29uc3QgW3NlbCwgb2tdIG9mIE9iamVjdC5lbnRyaWVzKHJlcGx5LnZhbGlkKSkge1xuICAgICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICAgIGlmICghb2spIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsICdObyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcyB0aGlzIHNlbGVjdG9yLicpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiB0YWIgbm90IHJlYWR5ICovIH1cbiAgfTtcbiAgY29uc3Qgb25WYWxpZGF0ZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBzZXRTdGF0dXMoJ1JlLWNoZWNraW5n4oCmJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgIGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICBzZXRTdGF0dXMoJ1ZhbGlkYXRlZCcpO1xuICB9O1xuXG4gIC8vIChTY3JlZW5zaG90IG1hY2hpbmVyeSByZW1vdmVkIGFsb25nc2lkZSB0aGUgLnByZXZpZXcgdGlsZS4pXG5cbiAgLy8g4pSA4pSA4pSAIEdpdEh1YiBzdGFycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgZmV0Y2hTdGFycyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBjYWNoZUtleSA9ICdwaW5jaGdyYWIuZ2guc3RhcnMnO1xuICAgIGNvbnN0IGNhY2hlZCA9IGF3YWl0IFN0b3JlLmdldDx7Y291bnQ6IG51bWJlcjsgdHM6IG51bWJlcn0gfCBudWxsPihjYWNoZUtleSwgbnVsbCk7XG4gICAgaWYgKGNhY2hlZCAmJiBEYXRlLm5vdygpIC0gY2FjaGVkLnRzIDwgM182MDBfMDAwKSB7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNhY2hlZC5jb3VudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mvd3Jhbm5nbGUvcGluY2hncmFiJywge2NhY2hlOiAnbm8tc3RvcmUnfSk7XG4gICAgICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcignc3RhdHVzICcgKyByLnN0YXR1cyk7XG4gICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCkgYXMge3N0YXJnYXplcnNfY291bnQ/OiBudW1iZXJ9O1xuICAgICAgY29uc3QgY291bnQgPSBqLnN0YXJnYXplcnNfY291bnQgPz8gMDtcbiAgICAgIHN0YXJzRWwudGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnQpO1xuICAgICAgdm9pZCBTdG9yZS5zZXQoY2FjaGVLZXksIHtjb3VudCwgdHM6IERhdGUubm93KCl9KTtcbiAgICB9IGNhdGNoIHsgc3RhcnNFbC50ZXh0Q29udGVudCA9ICfCtyc7IH1cbiAgfTtcbiAgY29uc3Qgb25HaXRodWIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS93cmFubmdsZS9waW5jaGdyYWInO1xuICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnRhYnMuY3JlYXRlKHt1cmx9KTtcbiAgICBlbHNlIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICdub29wZW5lcicpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBhIHNtYWxsIHByZXZpZXcgcm93IHNob3dpbmdcbiAgLy8gdGhlIGZpcnN0IH42IGxpbmVzIHBsdXMgYSBcIkVkaXQgLyBVcGxvYWQgLyDigKZcIiBidXR0b24uIENsaWNraW5nIG9wZW5zXG4gIC8vIGEgcG9wb3V0IG1vZGFsIHdpdGggdGhlIGZ1bGwgZWRpdG9yIOKAlCBrZWVwcyB0aGUgc2V0dGluZ3MgZHJhd2VyXG4gIC8vIHNjYW5uYWJsZSB3aGVuIHNoaXBwaW5nIGEgNTAwMC1saW5lIERFU0lHTi5tZC5cbiAgY29uc3QgcmVuZGVyTWRQcmV2aWV3ID0gYXN5bmMgKGtpbmQ6ICdkZXNpZ24nIHwgJ3NraWxsJyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHByZXZpZXdFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1tZC1wcmV2aWV3PVwiJHtraW5kfVwiXWApO1xuICAgIGlmICghcHJldmlld0VsKSByZXR1cm47XG4gICAgY29uc3QgY29udGVudCA9IGtpbmQgPT09ICdkZXNpZ24nID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IGhlYWQgPSBsaW5lcy5zbGljZSgwLCA2KS5tYXAoKGwpID0+IGwubGVuZ3RoID4gODAgPyBsLnNsaWNlKDAsIDgwKSArICfigKYnIDogbCkuam9pbignXFxuJyk7XG4gICAgcHJldmlld0VsLnRleHRDb250ZW50ID0gaGVhZCArIChsaW5lcy5sZW5ndGggPiA2ID8gYFxcblxcbuKApiAoKyR7bGluZXMubGVuZ3RoIC0gNn0gbW9yZSBsaW5lcylgIDogJycpO1xuICB9O1xuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBvcGVuTWRNb2RhbCA9IGFzeW5jIChraW5kOiBNZEtpbmQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgIGlmICghb3ZlcmxheSkgcmV0dXJuO1xuICAgIGNvbnN0IHRpdGxlRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC10aXRsZV0nKSE7XG4gICAgY29uc3QgdGFFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGV4dGFyZWFdJykhO1xuICAgIGNvbnN0IHN0YXRzRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdGF0c10nKSE7XG4gICAgY29uc3QgYmFubmVyRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1iYW5uZXJdJykhO1xuICAgIGNvbnN0IHNhdmVCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zYXZlXScpITtcbiAgICBjb25zdCByZXNldEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXJlc2V0XScpITtcbiAgICBjb25zdCB1cGxvYWRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC11cGxvYWRdJykhO1xuICAgIGNvbnN0IGRvd25sb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtZG93bmxvYWRdJykhO1xuICAgIGNvbnN0IGNsb3NlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtY2xvc2VdJykhO1xuXG4gICAgY29uc3QgaXNEZXNpZ24gPSBraW5kID09PSAnZGVzaWduJztcbiAgICBjb25zdCBpbml0aWFsID0gaXNEZXNpZ24gPyBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpIDogYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGNvbnN0IHVzaW5nVGVtcGxhdGUgPSBpc0Rlc2lnbiA/IGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpIDogaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gaXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdQaW5jaEdyYWIgU0tJTEwubWQnO1xuICAgIHRhRWwudmFsdWUgPSBpbml0aWFsO1xuICAgIG92ZXJsYXkuZGF0YXNldC5raW5kID0ga2luZDtcblxuICAgIGNvbnN0IHJlZnJlc2hTdGF0cyA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSB0YUVsLnZhbHVlO1xuICAgICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKS5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFt0ZXh0XSkuc2l6ZTtcbiAgICAgIHN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtsaW5lc30gbGluZXMgwrcgJHsoYnl0ZXMgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gICAgfTtcbiAgICByZWZyZXNoU3RhdHMoKTtcbiAgICBiYW5uZXJFbC5oaWRkZW4gPSAhdXNpbmdUZW1wbGF0ZTtcbiAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9IHVzaW5nVGVtcGxhdGVcbiAgICAgID8gYOKaoCBDdXJyZW50bHkgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgJHtpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1NLSUxMLm1kJ30gdGVtcGxhdGUg4oCUIGVkaXRzIGhlcmUgYmVjb21lIHlvdXIgY3VzdG9taXplZCB2ZXJzaW9uLmBcbiAgICAgIDogJyc7XG4gICAgdGFFbC5vbmlucHV0ID0gcmVmcmVzaFN0YXRzO1xuXG4gICAgY29uc3Qgb25TYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhRWwudmFsdWU7XG4gICAgICAvLyBTYXZlIGVtcHR5IHN0cmluZyDihpIgcmV2ZXJ0IHRvIHRlbXBsYXRlIGZhbGxiYWNrLiBBbnl0aGluZyBub24tZW1wdHlcbiAgICAgIC8vIOKGkiB1c2VyIGN1c3RvbWl6YXRpb24gKHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZSkuXG4gICAgICBpZiAoaXNEZXNpZ24pIHByZWZzLmRlc2lnbk1kID0gdGV4dDtcbiAgICAgIGVsc2UgcHJlZnMuc2tpbGxNZCA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHZvaWQgdXBkYXRlTWRTdGF0dXNlcygpO1xuICAgICAgc2V0U3RhdHVzKGAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSBzYXZlZGApO1xuICAgICAgY2xvc2VNZE1vZGFsKCk7XG4gICAgfTtcbiAgICBjb25zdCBvblJlc2V0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGFFbC52YWx1ZSA9ICcnOyAvLyBlbXB0eSA9IGZhbGxiYWNrIHRvIGJ1bmRsZWQgdGVtcGxhdGVcbiAgICAgIHJlZnJlc2hTdGF0cygpO1xuICAgICAgYmFubmVyRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9ICdDbGVhcmVkIOKAlCBTYXZlIHRvIHJldmVydCB0byBidW5kbGVkIHRlbXBsYXRlLCBvciBwYXN0ZSBuZXcgY29udGVudC4nO1xuICAgIH07XG4gICAgY29uc3Qgb25VcGxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbnB1dElkID0gaXNEZXNpZ24gPyAnZGVzaWduLW1kLWZpbGUnIDogJ3NraWxsLW1kLWZpbGUnO1xuICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uRG93bmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gaXNEZXNpZ24gPyAnREVTSUdOLnRlbXBsYXRlLm1kJyA6ICdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnO1xuICAgICAgZG93bmxvYWRUZXh0KG5hbWUsIHRhRWwudmFsdWUpO1xuICAgIH07XG5cbiAgICBzYXZlQnRuLm9uY2xpY2sgPSBvblNhdmU7XG4gICAgcmVzZXRCdG4ub25jbGljayA9IG9uUmVzZXQ7XG4gICAgdXBsb2FkQnRuLm9uY2xpY2sgPSBvblVwbG9hZDtcbiAgICBkb3dubG9hZEJ0bi5vbmNsaWNrID0gb25Eb3dubG9hZDtcbiAgICBjbG9zZUJ0bi5vbmNsaWNrID0gY2xvc2VNZE1vZGFsO1xuICAgIG92ZXJsYXkuaGlkZGVuID0gZmFsc2U7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhRWwuZm9jdXMoKSk7XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNZE1vZGFsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgaWYgKG92ZXJsYXkpIG92ZXJsYXkuaGlkZGVuID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBkb3dubG9hZFRleHQgPSAoZmlsZW5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nLCBtaW1lID0gJ3RleHQvbWFya2Rvd24nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge3R5cGU6IG1pbWV9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTsgYS5jbGljaygpOyBhLnJlbW92ZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCB3aXJlTWRGaWxlSW5wdXQgPSAoaWQ6IHN0cmluZywgcHJlZktleTogJ2Rlc2lnbk1kJyB8ICdza2lsbE1kJywgbGFiZWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcbiAgICBmaWxlSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBmaWxlSW5wdXQuZmlsZXM/LlswXTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IDUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHRvbyBsYXJnZSAoJHsoZmlsZS5zaXplIC8gMTAyNCAvIDEwMjQpLnRvRml4ZWQoMSl9IE1CID4gNSBNQiBjYXApYCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICBmaWxlSW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgKHByZWZzIGFzIGFueSlbcHJlZktleV0gPSB0ZXh0O1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgc2V0U3RhdHVzKGAke2xhYmVsfSB1cGxvYWRlZCDCtyAke2ZpbGUubmFtZX0gwrcgJHsoZmlsZS5zaXplIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgKTtcbiAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgIH0pO1xuICB9O1xuICB3aXJlTWRGaWxlSW5wdXQoJ2Rlc2lnbi1tZC1maWxlJywgJ2Rlc2lnbk1kJywgJ0RFU0lHTi5tZCcpO1xuICB3aXJlTWRGaWxlSW5wdXQoJ3NraWxsLW1kLWZpbGUnLCAnc2tpbGxNZCcsICdTS0lMTC5tZCcpO1xuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICgodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5kYXRhc2V0Py5wcmVmKSB7XG4gICAgICAocHJlZnMgYXMgYW55KVt0LmRhdGFzZXQucHJlZiFdID0gQm9vbGVhbigodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkKTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0LmRhdGFzZXQ/LnByZWZUZXh0KSB7XG4gICAgICAocHJlZnMgYXMgYW55KVt0LmRhdGFzZXQucHJlZlRleHRdID0gKHQgYXMgSFRNTFRleHRBcmVhRWxlbWVudCkudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICAvLyBUZXh0YXJlYSBpbnB1dHMgYWxzbyBmaXJlIGBpbnB1dGAgZXZlbnRzIGFzIHRoZSB1c2VyIHR5cGVzIOKAlCB3ZSB3YW50IHRvXG4gIC8vIHNhdmUgdGhvc2UgaW5jcmVtZW50YWxseSBzbyBhIHBhbmVsIHJlbG9hZCBkb2Vzbid0IGxvc2UgaGFsZi10eXBlZFxuICAvLyBlbnRyaWVzLiBgY2hhbmdlYCBvbmx5IGZpcmVzIG9uIGJsdXIgZm9yIHRleHRhcmVhcy5cbiAgZHJhd2VyPy5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKHQ/LmRhdGFzZXQ/LnByZWZUZXh0KSB7XG4gICAgICAocHJlZnMgYXMgYW55KVt0LmRhdGFzZXQucHJlZlRleHRdID0gdC52YWx1ZTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IG9wZW5EcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSBmYWxzZTsgcmVuZGVyV3NDb250cm9scygpOyB9O1xuICBjb25zdCBjbG9zZURyYXdlciA9ICgpOiB2b2lkID0+IHsgZHJhd2VyLmhpZGRlbiA9IHRydWU7IH07XG5cbiAgY29uc3QgcmVuZGVyV3NDb250cm9scyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXdzU2VsZWN0KSByZXR1cm47XG4gICAgd3NTZWxlY3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gdy5uYW1lO1xuICAgICAgb3B0LnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIG9wdC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB3c1NlbGVjdC5hcHBlbmQob3B0KTtcbiAgICB9XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICAgICAgZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGlmICghY29uZmlybShgRGVsZXRlIHdvcmtzcGFjZSBcIiR7dy5uYW1lfVwiIGFuZCBhbGwgaXRzIGNhcHR1cmVzP2ApKSByZXR1cm47XG4gICAgICAgICAgd29ya3NwYWNlcyA9IHdvcmtzcGFjZXMuZmlsdGVyKCh4KSA9PiB4Lm5hbWUgIT09IHcubmFtZSk7XG4gICAgICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICAgICAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShbd3NNc2dLZXkody5uYW1lKSwgd3NTaG90c0tleSh3Lm5hbWUpLCB3c1Nob3RzRnVsbEtleSh3Lm5hbWUpXSkuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICAgICAgaWYgKGFjdGl2ZVdzID09PSB3Lm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod29ya3NwYWNlc1swXSEubmFtZSk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIH1cbiAgICAgIHdzTGlzdC5hcHBlbmQobGkpO1xuICAgIH1cbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSgoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlKTtcbiAgICByZW5kZXIoKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIENvbW1hbmQgcGFsZXR0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBDb21tYW5kID0ge2lkOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJ1bjogKCkgPT4gdm9pZH07XG4gIGNvbnN0IENPTU1BTkRTOiBDb21tYW5kW10gPSBbXG4gICAge2lkOiAnY29weS1hbGwnLCBsYWJlbDogJ0NvcHkgYWxsIGFzIEpTT05MJywgcnVuOiAoKSA9PiB2b2lkIG9uQ29weUFsbCgpfSxcbiAgICB7aWQ6ICdleHBvcnQnLCBsYWJlbDogJ0Rvd25sb2FkIEpTT05MIGZpbGUnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnQoKX0sXG4gICAge2lkOiAnZXhwb3J0LXppcCcsIGxhYmVsOiAnRXhwb3J0IHdvcmtzcGFjZSBhcyAudGFyLnpzdCAoSlNPTkwgKyBzY3JlZW5zaG90cyArIER1Y2tEQiArIFJFQURNRSknLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdkdWNrZGInLCBsYWJlbDogJ0dlbmVyYXRlIER1Y2tEQiBxdWVyeSBzbmlwcGV0IChTUUwgcmVjaXBlcyknLCBydW46ICgpID0+IHZvaWQgb25EdWNrRGJTbmlwcGV0KCl9LFxuICAgIHtpZDogJ2ltcG9ydCcsIGxhYmVsOiAnSW1wb3J0IEpTT05MIGZpbGUnLCBydW46IG9uSW1wb3J0fSxcbiAgICB7aWQ6ICd2YWxpZGF0ZScsIGxhYmVsOiAnUmUtY2hlY2sgc2VsZWN0b3JzJywgcnVuOiAoKSA9PiB2b2lkIG9uVmFsaWRhdGUoKX0sXG4gICAge2lkOiAnY2xlYXInLCBsYWJlbDogJ0NsZWFyIGFsbCBjYXB0dXJlcycsIHJ1bjogb25DbGVhcn0sXG4gICAge2lkOiAnc2V0dGluZ3MnLCBsYWJlbDogJ09wZW4gc2V0dGluZ3MnLCBydW46IG9wZW5EcmF3ZXJ9LFxuICAgIHtpZDogJ2dpdGh1YicsIGxhYmVsOiAnT3BlbiBHaXRIdWIgcmVwbycsIHJ1bjogb25HaXRodWJ9LFxuICAgIHtpZDogJ21hbnVhbCcsIGxhYmVsOiAnTWFudWFsIGNhcHR1cmUgKHN0YXJ0IGNvbXBvc2VyIHdpdGggYD4gc2VsZWN0b3JgKScsIHJ1bjogKCkgPT4geyBjb21wb3Nlci52YWx1ZSA9ICc+ICc7IGNvbXBvc2VyLmZvY3VzKCk7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgfX0sXG4gICAge2lkOiAndW5kbycsIGxhYmVsOiAnVW5kbycsIHJ1bjogdW5kb30sXG4gICAge2lkOiAncmVkbycsIGxhYmVsOiAnUmVkbycsIHJ1bjogcmVkb30sXG4gIF07XG4gIGNvbnN0IHJlbmRlclBhbGV0dGUgPSAocSA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgY29uc3QgcWwgPSBxLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAuLi5DT01NQU5EUy5maWx0ZXIoKGMpID0+ICFxbCB8fCBjLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKVxuICAgICAgICAubWFwKChjKSA9PiAoe2xhYmVsOiBjLmxhYmVsLCBwcmV2aWV3OiAnY29tbWFuZCcsIHJ1bjogYy5ydW59KSksXG4gICAgICAuLi5tZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKCFxbCB8fFxuICAgICAgICAobS5lbnRyeS5zZWxlY3RvciArICcgJyArIChtLmVudHJ5LnRleHQgPz8gJycpICsgJyAnICsgKG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyAnJykpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocWwpKSlcbiAgICAgICAgLnNsaWNlKDAsIDMwKVxuICAgICAgICAubWFwKChtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmIgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihtLmlkKTtcbiAgICAgICAgICBjb25zdCBwcmV2aWV3ID0gKG0uZW50cnkudGV4dCA/PyBmYlswXSA/PyBtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgODApO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYWJlbDogYCMke20uZW50cnkubn0gJHttLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gbS5lbnRyeS5zZWxlY3Rvcn1gLFxuICAgICAgICAgICAgcHJldmlldyxcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9zZVBhbGV0dGUoKTtcbiAgICAgICAgICAgICAgc2Nyb2xsTWVzc2FnZUludG9WaWV3KG0uaWQpO1xuICAgICAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3J9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdCwgaSkgPT4ge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGJsLmNsYXNzTmFtZSA9ICdsYWJlbCc7XG4gICAgICBsYmwuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQubGFiZWwsIHEpO1xuICAgICAgbGkuYXBwZW5kKGxibCk7XG4gICAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcC5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICBwLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LnByZXZpZXcgPz8gJycsIHEpO1xuICAgICAgbGkuYXBwZW5kKHApO1xuICAgICAgY29uc3Qga2JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAga2JkLmNsYXNzTmFtZSA9ICdrYmQnO1xuICAgICAga2JkLnRleHRDb250ZW50ID0gJ+KGtSc7XG4gICAgICBsaS5hcHBlbmQoa2JkKTtcbiAgICAgIGlmIChpID09PSAwKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpdC5ydW4oKTsgfSk7XG4gICAgICBwYWxldHRlTGlzdC5hcHBlbmQobGkpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvcGVuUGFsZXR0ZSA9IChwcmVzZXQgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGUuaGlkZGVuID0gZmFsc2U7XG4gICAgcGFsZXR0ZUlucHV0LnZhbHVlID0gcHJlc2V0O1xuICAgIHJlbmRlclBhbGV0dGUocHJlc2V0KTtcbiAgICBwYWxldHRlSW5wdXQuZm9jdXMoKTtcbiAgICBwYWxldHRlSW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UocHJlc2V0Lmxlbmd0aCwgcHJlc2V0Lmxlbmd0aCk7XG4gIH07XG4gIGNvbnN0IGNsb3NlUGFsZXR0ZSA9ICgpOiB2b2lkID0+IHsgcGFsZXR0ZS5oaWRkZW4gPSB0cnVlOyB9O1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiByZW5kZXJQYWxldHRlKHBhbGV0dGVJbnB1dC52YWx1ZSkpO1xuICBwYWxldHRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4ucGFsZXR0ZUxpc3QuY2hpbGRyZW5dO1xuICAgIGxldCBhY3RpdmUgPSBpdGVtcy5maW5kSW5kZXgoKGxpKSA9PiBsaS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKTtcbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWluKGl0ZW1zLmxlbmd0aCAtIDEsIGFjdGl2ZSArIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgZm9yIChjb25zdCBsaSBvZiBpdGVtcykgbGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IGFjdGl2ZSA9IE1hdGgubWF4KDAsIGFjdGl2ZSAtIDEpOyBpdGVtc1thY3RpdmVdPy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IChpdGVtc1thY3RpdmVdIGFzIEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkKT8uY2xpY2soKTsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIGNsb3NlUGFsZXR0ZSgpO1xuICB9KTtcbiAgcGFsZXR0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGlmIChlLnRhcmdldCA9PT0gcGFsZXR0ZSkgY2xvc2VQYWxldHRlKCk7IH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBDdXN0b20gdG9vbHRpcCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHRpcEZvcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2hvd1RpcCA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlwJyk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgdG9vbHRpcEVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB0b29sdGlwRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0aXBSID0gdG9vbHRpcEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDQ7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIHRpcFIud2lkdGggLyAyO1xuICAgIGlmICh0b3AgKyB0aXBSLmhlaWdodCArIDQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHRvcCA9IHIudG9wIC0gdGlwUi5oZWlnaHQgLSA0O1xuICAgIGlmIChsZWZ0IDwgNCkgbGVmdCA9IDQ7XG4gICAgaWYgKGxlZnQgKyB0aXBSLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggLSA0KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSB0aXBSLndpZHRoIC0gNDtcbiAgICB0b29sdGlwRWwuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHt0b3B9cHg7bGVmdDoke2xlZnR9cHg7YDtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICd0cnVlJztcbiAgfTtcbiAgY29uc3QgaGlkZVRpcCA9ICgpOiB2b2lkID0+IHtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7XG4gICAgdGlwRm9yID0gbnVsbDtcbiAgICB0b29sdGlwRWwuaGlkZGVuID0gdHJ1ZTtcbiAgfTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICghdCB8fCB0ID09PSB0aXBGb3IpIHJldHVybjtcbiAgICB0aXBGb3IgPSB0O1xuICAgIHNob3dUaXAodCk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCAmJiB0ID09PSB0aXBGb3IgJiYgIXQuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlVGlwKCk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0IGRyaWxsZG93bnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFwcGVuZEhlYWRpbmcgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g1Jyk7XG4gICAgaC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoaCk7XG4gIH07XG4gIGNvbnN0IGFwcGVuZEJvbGQgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKTtcbiAgICBiLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChiKTtcbiAgfTtcbiAgY29uc3QgYXBwZW5kQ29kZSA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29kZScpO1xuICAgIGNvZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGNvZGUpO1xuICB9O1xuICBjb25zdCBidWlsZERyaWxsZG93biA9IChraW5kOiBzdHJpbmcpOiBEb2N1bWVudEZyYWdtZW50ID0+IHtcbiAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGlmIChraW5kID09PSAnc2VsZWN0b3JzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnU2VsZWN0b3JzIGJ5IHF1YWxpdHknKTtcbiAgICAgIGNvbnN0IGJ1Y2tldHMgPSB7aWQ6IDAsIHRlc3RpZDogMCwgY2xhc3M6IDAsIG50aDogMCwgdGFnOiAwfTtcbiAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAgIGlmIChlLnRlc3RJZCkgYnVja2V0cy50ZXN0aWQrKztcbiAgICAgICAgZWxzZSBpZiAoZS5pZCB8fCAvXiNbXFx3LV0rJC8udGVzdChlLnNlbGVjdG9yKSkgYnVja2V0cy5pZCsrO1xuICAgICAgICBlbHNlIGlmICgoZS5zZWxlY3RvciA/PyAnJykuaW5jbHVkZXMoJzpudGgtb2YtdHlwZScpKSBidWNrZXRzLm50aCsrO1xuICAgICAgICBlbHNlIGlmICgvXFwuLy50ZXN0KGUuc2VsZWN0b3IgPz8gJycpKSBidWNrZXRzLmNsYXNzKys7XG4gICAgICAgIGVsc2UgYnVja2V0cy50YWcrKztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGZvciAoY29uc3QgW3ZhbHVlLCBsYWJlbF0gb2YgW1xuICAgICAgICBbYnVja2V0cy50ZXN0aWQsICcgZGF0YS10ZXN0aWQnXSxcbiAgICAgICAgW2J1Y2tldHMuaWQsICcgc3RhYmxlIGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmNsYXNzLCAnIGNsYXNzLWJhc2VkJ10sXG4gICAgICAgIFtidWNrZXRzLm50aCwgJyBudGgtb2YtdHlwZSddLFxuICAgICAgICBbYnVja2V0cy50YWcsICcgdGFnLW9ubHknXSxcbiAgICAgIF0gYXMgY29uc3QpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgbGkuYXBwZW5kKGxhYmVsKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdzdGFsZScpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1N0YWxlIGNhcHR1cmVzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBzdGFsZSA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKSA9PT0gZmFsc2UpO1xuICAgICAgaWYgKCFzdGFsZS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaS50ZXh0Q29udGVudCA9ICdOb25lIC0gZXZlcnl0aGluZyByZXNvbHZlcy4nO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfSBlbHNlIGZvciAoY29uc3QgbSBvZiBzdGFsZSkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgICAgIGxpLmFwcGVuZCgnICcpO1xuICAgICAgICBhcHBlbmRDb2RlKGxpLCAobS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgNTApKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdjb21tZW50cycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ0NvbW1lbnRzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBmYnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIEZlZWRiYWNrTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpO1xuICAgICAgY29uc3QgdG90YWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgdG90YWwuYXBwZW5kKCdUb3RhbCB3b3JkczogJyk7XG4gICAgICBhcHBlbmRCb2xkKHRvdGFsLCBTdHJpbmcoZmJzLnJlZHVjZSgocywgbSkgPT4gcyArIHdvcmRDb3VudChtLnRleHQpLCAwKSkpO1xuICAgICAgdWwuYXBwZW5kKHRvdGFsKTtcbiAgICAgIGNvbnN0IGF2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBhdmcuYXBwZW5kKCdBdmVyYWdlIGxlbmd0aDogJyk7XG4gICAgICBhcHBlbmRCb2xkKGF2ZywgU3RyaW5nKGZicy5sZW5ndGggPyBNYXRoLnJvdW5kKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyBtLnRleHQubGVuZ3RoLCAwKSAvIGZicy5sZW5ndGgpIDogMCkpO1xuICAgICAgYXZnLmFwcGVuZCgnIGNoYXJzJyk7XG4gICAgICB1bC5hcHBlbmQoYXZnKTtcbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdwYWdlcycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1BhZ2VzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBzZWVuID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2Vlbi5zZXQobS5lbnRyeS51cmwsIChzZWVuLmdldChtLmVudHJ5LnVybCkgPz8gMCkgKyAxKTtcbiAgICAgIGZvciAoY29uc3QgW3VybCwgbl0gb2Ygc2Vlbikge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIFN0cmluZyhuKSk7XG4gICAgICAgIGxpLmFwcGVuZChgIHNlbGVjdG9yJHtuID09PSAxID8gJycgOiAncyd9IMK3IGApO1xuICAgICAgICBhcHBlbmRDb2RlKGxpLCBwYXRoT2YodXJsKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfVxuICAgIHJldHVybiBmcmFnO1xuICB9O1xuICBjb25zdCBzaG93RHJpbGxkb3duID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBraW5kID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zdGF0Jyk7XG4gICAgaWYgKCFraW5kKSByZXR1cm47XG4gICAgZHJpbGxkb3duRWwucmVwbGFjZUNoaWxkcmVuKGJ1aWxkRHJpbGxkb3duKGtpbmQpKTtcbiAgICBkcmlsbGRvd25FbC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGRSID0gZHJpbGxkb3duRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHRvcCA9IHIuYm90dG9tICsgNjtcbiAgICBsZXQgbGVmdCA9IHIubGVmdCArIHIud2lkdGggLyAyIC0gZFIud2lkdGggLyAyO1xuICAgIGlmICh0b3AgKyBkUi5oZWlnaHQgKyA0ID4gd2luZG93LmlubmVySGVpZ2h0KSB0b3AgPSByLnRvcCAtIGRSLmhlaWdodCAtIDY7XG4gICAgaWYgKGxlZnQgPCA2KSBsZWZ0ID0gNjtcbiAgICBpZiAobGVmdCArIGRSLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggLSA2KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSBkUi53aWR0aCAtIDY7XG4gICAgZHJpbGxkb3duRWwuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHt0b3B9cHg7bGVmdDoke2xlZnR9cHg7YDtcbiAgfTtcbiAgY29uc3QgaGlkZURyaWxsZG93biA9ICgpOiB2b2lkID0+IHsgZHJpbGxkb3duRWwuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJy5zdGF0W2RhdGEtc3RhdF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHQpIHNob3dEcmlsbGRvd24odCk7XG4gIH0pO1xuICBzdGF0c0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICBpZiAoIXN0YXRzRWwuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlRHJpbGxkb3duKCk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBFeHBvcnQtYnV0dG9uIGhvdmVyIOKGkiBvdXRsaW5lLW11bHRpIG9uIHBhZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGZvciAoY29uc3QgYnRuIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWV4cG9ydC1ob3Zlcl0nKSkge1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0b3JzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpO1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtbXVsdGknLCBzZWxlY3RvcnN9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yJykpIGVsLmNsYXNzTGlzdC5hZGQoJ2V4cG9ydC1ob3ZlcicpO1xuICAgIH0pO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBDbGljayBkZWxlZ2F0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgdHJpZ2dlciA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtYWN0aW9uXScpO1xuICAgIGlmICghdHJpZ2dlcikgcmV0dXJuO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1hY3Rpb24nKTtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSAnc2VuZCc6IHNlbmRGZWVkYmFjaygpOyByZXR1cm47XG4gICAgICBjYXNlICdjb3B5LWFsbCc6IHZvaWQgb25Db3B5QWxsKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydCc6IHZvaWQgb25FeHBvcnQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZXhwb3J0LXppcCc6IHZvaWQgb25FeHBvcnRaaXAoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1wYXRoJzogdm9pZCBvbkNvcHlQYXRoKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2ltcG9ydCc6IG9uSW1wb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3ZhbGlkYXRlJzogdm9pZCBvblZhbGlkYXRlKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NsZWFyJzogb25DbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdnaXRodWInOiBvbkdpdGh1YigpOyByZXR1cm47XG4gICAgICBjYXNlICdzZXR0aW5ncyc6IG9wZW5EcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY2xvc2UtZHJhd2VyJzogY2xvc2VEcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndW5kbyc6IHVuZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVkbyc6IHJlZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZGVzaWduLWVkaXQnOiB7IHZvaWQgb3Blbk1kTW9kYWwoJ2Rlc2lnbicpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ3NraWxsLWVkaXQnOiAgeyB2b2lkIG9wZW5NZE1vZGFsKCdza2lsbCcpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi10ZW1wbGF0ZS1kb3dubG9hZCc6IHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIFByZWZlciB0aGUgdXNlcidzIGxvY2FsIG92ZXJyaWRlIGlmIHByZXNlbnQgKHNvIGEgZm9yaydzXG4gICAgICAgICAgLy8gXCJEb3dubG9hZCB0ZW1wbGF0ZVwiIHByb2R1Y2VzIHRoZSBzYW1lIGNvbnRlbnQgdGhlIGZvcmsgc2hpcHMpXG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBnZW5lcmljIHRlbXBsYXRlLlxuICAgICAgICAgIGNvbnN0IHRleHQgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbERlc2lnbicpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdkZXNpZ25UZW1wbGF0ZScpKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnREVTSUdOLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdERVNJR04ubWQgdGVtcGxhdGUgZG93bmxvYWRlZCDigJQgZmlsbCBpbiBhbmQgcmUtdXBsb2FkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuZGVzaWduTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbGwtbWQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxTa2lsbCcpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJykpO1xuICAgICAgICAgIGlmICghdGV4dCkgeyBzZXRTdGF0dXMoJ1RlbXBsYXRlIG5vdCBmb3VuZCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgZG93bmxvYWRUZXh0KCdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLCB0ZXh0KTtcbiAgICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQnKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLnNraWxsTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgcmVzZXQg4oCUIGV4cG9ydHMgd2lsbCBidW5kbGUgdGhlIHRlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3dzLWNyZWF0ZSc6IHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICh3c05hbWUudmFsdWUgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG4gICAgICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gbmFtZSkpIHsgc2V0U3RhdHVzKCdBbHJlYWR5IGV4aXN0cycsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZSwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICAgICAgd3NOYW1lLnZhbHVlID0gJyc7XG4gICAgICAgIHZvaWQgbG9hZFdvcmtzcGFjZShuYW1lKS50aGVuKHJlbmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyDilIDilIDilIAgR2xvYmFsIGtleWJvYXJkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQgPSAodGFyZ2V0OiBFdmVudFRhcmdldCB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBlbCA9IHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID8gdGFyZ2V0IDogbnVsbDtcbiAgICByZXR1cm4gQm9vbGVhbihlbD8uY2xvc2VzdCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIFtjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdLCBbY29udGVudGVkaXRhYmxlPVwiXCJdJykpO1xuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGVkaXRhYmxlVGFyZ2V0ID0gaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0KGUudGFyZ2V0KTtcbiAgICBpZiAoZWRpdGFibGVUYXJnZXQgJiYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIFsnYScsICd6JywgJ3knXS5pbmNsdWRlcyhlLmtleS50b0xvd2VyQ2FzZSgpKSkgcmV0dXJuO1xuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2snKSB7IGUucHJldmVudERlZmF1bHQoKTsgcGFsZXR0ZS5oaWRkZW4gPyBvcGVuUGFsZXR0ZSgpIDogY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgdW5kbygpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIChlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneScgfHwgKGUuc2hpZnRLZXkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onKSkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyByZWRvKCk7IHJldHVybjsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGNvbnN0IG1kTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgICBpZiAobWRNb2RhbCAmJiAhbWRNb2RhbC5oaWRkZW4pIHsgY2xvc2VNZE1vZGFsKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFwYWxldHRlLmhpZGRlbikgeyBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIWRyYXdlci5oaWRkZW4pIHsgY2xvc2VEcmF3ZXIoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgeyB2b2lkIHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSk7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdQZW5kaW5nIGdyb3VwIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChzZWFyY2hRdWVyeSkgeyBzZWFyY2gudmFsdWUgPSAnJzsgc2VhcmNoUXVlcnkgPSAnJzsgcmVuZGVyKCk7IH1cbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnQWx0JyB8fCBlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiB0cnVlfSk7XG4gIH0pO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgaWYgKCFlLmFsdEtleSkgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHBhbmVsUmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgcGVuZGluZ1BhbmVsTWVzc2FnZXM6IGFueVtdID0gW107XG4gIGNvbnN0IHJlY2VpdmVQYW5lbE1lc3NhZ2UgPSAobTogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYW5lbFJlYWR5KSB7XG4gICAgICBwZW5kaW5nUGFuZWxNZXNzYWdlcy5wdXNoKG0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbkNzTWVzc2FnZShtKTtcbiAgfTtcbiAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgLy8gU2luZ2xlIGNoYW5uZWw6IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS4gVGhlIGJhY2tncm91bmQgdXNlZCB0byByZWxheVxuICAgIC8vIHRocm91Z2ggYSBwb3J0IHRvbywgYnV0IGNvbnRlbnQtc2NyaXB0IGJyb2FkY2FzdHMgYWxyZWFkeSByZWFjaCB0aGVcbiAgICAvLyBzaWRlIHBhbmVsIGRpcmVjdGx5IOKAlCByZWxheWluZyBwcm9kdWNlZCBkdXBsaWNhdGUgZGlzcGF0Y2hlcy5cbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG06IGFueSkgPT4gcmVjZWl2ZVBhbmVsTWVzc2FnZShtKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uQWN0aXZhdGVkPy5hZGRMaXN0ZW5lcigoKSA9PiB2b2lkIHJ1blZhbGlkYXRpb24oKSk7XG4gICAgY2hyb21lLnRhYnM/Lm9uVXBkYXRlZD8uYWRkTGlzdGVuZXIoKF9pZCwgaW5mbykgPT4geyBpZiAoaW5mbz8uc3RhdHVzID09PSAnY29tcGxldGUnKSB2b2lkIHJ1blZhbGlkYXRpb24oKTsgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIChlKSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWwpKTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBUZXN0IEFQSSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaW5zdGFsbFRlc3RBcGkgPSAoKTogdm9pZCA9PiB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLl9fcGluY2hncmFiX3BhbmVsID0ge1xuICAgICAgcHVzaE1lc3NhZ2U6IChtOiBQYW5lbE1lc3NhZ2UpID0+IHsgbWVzc2FnZXMucHVzaChtKTsgcGVyc2lzdCgpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uQ2FwdHVyZSwgb25Ib3Zlciwgb25Ib3ZlckVuZCxcbiAgICAgIGdldE1lc3NhZ2VzOiAoKSA9PiBbLi4ubWVzc2FnZXNdLFxuICAgICAgZ2V0UHJlZnM6ICgpID0+ICh7Li4ucHJlZnN9KSxcbiAgICAgIHNldFByZWZzOiAocDogUGFydGlhbDxQcmVmcz4pID0+IHsgcHJlZnMgPSB7Li4ucHJlZnMsIC4uLnB9OyBwZXJzaXN0UHJlZnMoKTsgYXBwbHlQcmVmc1RvVUkoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBidWlsZEpzb25sLFxuICAgICAgYnVpbGRFeHBvcnRGaWxlbmFtZSwgYnVpbGRNYW5pZmVzdCwgZG9taW5hbnRIb3N0U2x1ZywgZGlzdGluY3RIb3N0cyxcbiAgICAgIGR1Y2tEYlNuaXBwZXQsIG9uRXhwb3J0WmlwLCBvbkV4cG9ydCwgb25Db3B5UGF0aCxcbiAgICAgIGRlbm9ybWFsaXplRW50cnksXG4gICAgICBnZXRMYXN0RXhwb3J0OiAoKSA9PiAoey4uLmxhc3RFeHBvcnR9KSxcbiAgICAgIC8vIFRlc3QgaGF0Y2g6IHNlZWQgZXZlcnkgc2VsZWN0b3IgY2FwdHVyZSB3aXRoIHRoZSBzYW1lIGZ1bGwgUE5HIGRhdGFVUkxcbiAgICAgIC8vIHNvIHRoZSBhcmNoaXZlIGV4cG9ydCBoYXMgc29tZXRoaW5nIHRvIGJ1bmRsZS4gUmVhbCBjYXB0dXJlcyBwb3B1bGF0ZVxuICAgICAgLy8gc2hvdHNGdWxsIGZyb20gdGhlIGJnIGBydW5TaG90YCByZXBseTsgdGVzdHMgY2FuJ3QgZWFzaWx5IHJ1biBhXG4gICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiwgc28gdGhpcyBsZXRzIHVzIHByb3ZlIHRoZSBQTkcgYnVuZGxpbmcgcGF0aC5cbiAgICAgIF9fc2VlZFNob3RzRnVsbDogKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzaG90c0Z1bGwuc2V0KG0uZW50cnkuc2VsZWN0b3IsIGRhdGFVcmwpO1xuICAgICAgICB9XG4gICAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICAgIH0sXG4gICAgICBfX2dldFNob3RzRnVsbDogKCkgPT4gc2hvdHNGdWxsLFxuICAgICAgc2V0U2VhcmNoOiAocTogc3RyaW5nKSA9PiB7IHNlYXJjaFF1ZXJ5ID0gcTsgc2VhcmNoLnZhbHVlID0gcTsgcmVuZGVyKCk7IH0sXG4gICAgICBzZXRWYWxpZGl0eTogKHNlbDogc3RyaW5nLCBvazogYm9vbGVhbiB8ICdkaWZmLXBhZ2UnLCByZWFzb24/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChyZWFzb24pIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsIHJlYXNvbik7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyOiAoKSA9PiB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgICAgICBsaXZlVGFiUGF0aCA9IG51bGw7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgICAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgICAgIHNob3RzLmNsZWFyKCk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb3BlblBhbGV0dGUsIGNsb3NlUGFsZXR0ZSwgb3BlbkRyYXdlciwgY2xvc2VEcmF3ZXIsXG4gICAgICBzZW5kRmVlZGJhY2ssIHVuZG8sIHJlZG8sXG4gICAgICBsaXN0V29ya3NwYWNlczogKCkgPT4gWy4uLndvcmtzcGFjZXNdLFxuICAgICAgYWN0aXZlV29ya3NwYWNlOiAoKSA9PiBhY3RpdmVXcyxcbiAgICAgIHNldFN0aWNreVRUTDogKG1zOiBudW1iZXIpID0+IHsgU1RJQ0tZX1RUTF9NUyA9IG1zOyB9LFxuICAgICAgZm9yY2VTdGlja3lFeHBpcmU6ICgpID0+IHsgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTsgcGFuZWxIb3ZlcmVkID0gZmFsc2U7IGFybVN0aWNreUV4cGlyeSgpOyB9LFxuICAgICAgc2V0TGFzdEFjdGl2ZSxcbiAgICAgIGNyZWF0ZVdvcmtzcGFjZTogKG46IHN0cmluZykgPT4geyB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IG4sIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IHJldHVybiBsb2FkV29ya3NwYWNlKG4pLnRoZW4ocmVuZGVyKTsgfSxcbiAgICAgIHN3aXRjaFdvcmtzcGFjZTogKG46IHN0cmluZykgPT4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlciksXG4gICAgfTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQm9vdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGxvYWRBbGwoKTtcbiAgICBwYW5lbFJlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgcGVuZGluZ1BhbmVsTWVzc2FnZXMuc3BsaWNlKDApKSBvbkNzTWVzc2FnZShtKTtcbiAgICByZW5kZXIoKTtcbiAgICBpbnN0YWxsVGVzdEFwaSgpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHZvaWQgZmV0Y2hTdGFycygpO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9uLCB3czogYWN0aXZlV3MsIG1lc3NhZ2VzOiBtZXNzYWdlcy5sZW5ndGh9KTtcbiAgfSkoKTtcbn0pKCk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQWtrQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxN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QSxRQUVuQixnQkFBZ0IsTUFBTTtBQUFBLFFBQ3RCLFdBQVcsQ0FBQyxNQUFjO0FBQUEsVUFBRSxjQUFjO0FBQUEsVUFBRyxPQUFPLFFBQVE7QUFBQSxVQUFHLE9BQU87QUFBQTtBQUFBLFFBQ3RFLGFBQWEsQ0FBQyxLQUFhLElBQTJCLFdBQW9CO0FBQUEsVUFDeEUsaUJBQWlCLElBQUksS0FBSyxFQUFFO0FBQUEsVUFDNUIsSUFBSTtBQUFBLFlBQVEsZUFBZSxJQUFJLEtBQUssTUFBTTtBQUFBLFVBQzFDLE9BQU87QUFBQTtBQUFBLFFBRVQsT0FBTyxNQUFNO0FBQUEsVUFDWCxTQUFTO0FBQUEsVUFDVCxXQUFXLENBQUM7QUFBQSxVQUNaLGFBQWE7QUFBQSxVQUNiLGNBQWM7QUFBQSxVQUNkLHFCQUFxQjtBQUFBLFVBQ3JCLGVBQWUsQ0FBQztBQUFBLFVBQ2hCLGlCQUFpQixNQUFNO0FBQUEsVUFDdkIsTUFBTSxNQUFNO0FBQUEsVUFDWixRQUFRO0FBQUEsVUFDUixPQUFPO0FBQUE7QUFBQSxRQUVUO0FBQUEsUUFBYTtBQUFBLFFBQWM7QUFBQSxRQUFZO0FBQUEsUUFDdkM7QUFBQSxRQUFjO0FBQUEsUUFBTTtBQUFBLFFBQ3BCLGdCQUFnQixNQUFNLENBQUMsR0FBRyxVQUFVO0FBQUEsUUFDcEMsaUJBQWlCLE1BQU07QUFBQSxRQUN2QixjQUFjLENBQUMsT0FBZTtBQUFBLFVBQUUsZ0JBQWdCO0FBQUE7QUFBQSxRQUNoRCxtQkFBbUIsTUFBTTtBQUFBLFVBQUUsYUFBYSxXQUFXO0FBQUEsVUFBRyxlQUFlO0FBQUEsVUFBTyxnQkFBZ0I7QUFBQTtBQUFBLFFBQzVGO0FBQUEsUUFDQSxpQkFBaUIsQ0FBQyxNQUFjO0FBQUEsVUFBRSxXQUFXLEtBQUssRUFBQyxNQUFNLEdBQUcsV0FBVyxJQUFJLEtBQUssRUFBRSxZQUFZLEVBQUMsQ0FBQztBQUFBLFVBQUcsa0JBQWtCO0FBQUEsVUFBRyxPQUFPLGNBQWMsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUFBO0FBQUEsUUFDM0osaUJBQWlCLENBQUMsTUFBYyxjQUFjLENBQUMsRUFBRSxLQUFLLE1BQU07QUFBQSxNQUM5RDtBQUFBO0FBQUEsS0FJSSxZQUFZO0FBQUEsTUFDaEIsTUFBTSxRQUFRO0FBQUEsTUFDZCxhQUFhO0FBQUEsTUFDYixXQUFXLEtBQUsscUJBQXFCLE9BQU8sQ0FBQztBQUFBLFFBQUcsWUFBWSxDQUFDO0FBQUEsTUFDN0QsT0FBTztBQUFBLE1BQ1AsZUFBZTtBQUFBLE1BQ1YsY0FBYztBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ2hCLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLFFBQVEsSUFBSSxLQUFLLFNBQVMsRUFBQyxhQUFhLElBQUksVUFBVSxVQUFVLFNBQVMsT0FBTSxDQUFDO0FBQUEsT0FDL0U7QUFBQSxLQUNGOyIsCiAgImRlYnVnSWQiOiAiMjZCMzAzNUI3OThBNjBCMTY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
