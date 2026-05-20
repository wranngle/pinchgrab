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
    const PREFS_KEY = "pinchgrab.prefs.v2";
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
      prefs = { ...DEFAULT_PREFS, ...await Store.get(PREFS_KEY, {}) };
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
      Store.set(PREFS_KEY, prefs);
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

//# debugId=96BF18CC83CEF48964756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjXFx0eXBlcy50cyIsICJzcmNcXGx1Y2lkZS50cyIsICJzcmNcXHRhci50cyIsICJzcmNcXHRlbXBsYXRlcy5nZW4udHMiLCAic3JjXFxzaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIHRhZ3M/OiBzdHJpbmdbXTtcbiAgLy8gU2V2ZXJpdHkgKGBub3RlYCAvIGBmaXhgIC8gYGJsb2NrYCkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgaW5cbiAgLy8gMjAyNi0wNS4gVGhlIGZpZWxkIGlzIHJldGFpbmVkIG9uIHRoZSB0eXBlIGFzIGB1bmtub3duYCBzb1xuICAvLyB0b2xlcmFudCByZWFkZXJzIChgZGVub3JtYWxpemVFbnRyeWApIGRvbid0IGRyb3AgdGhlIHZhbHVlIGZyb21cbiAgLy8gbGVnYWN5IEpTT05MIGV4cG9ydHM7IG5ldyBzZXNzaW9ucyBuZXZlciBzZXQgaXQuXG4gIHNldmVyaXR5PzogJ25vdGUnIHwgJ2ZpeCcgfCAnYmxvY2snO1xufTtcblxuZXhwb3J0IHR5cGUgUGFnZU1lc3NhZ2UgPSB7XG4gIHR5cGU6ICdwYWdlJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB2aWV3cG9ydD86IFZpZXdwb3J0O1xuICB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gUm91dGUgaWRlbnRpdHkgYmV5b25kIHRoZSBVUkwuIEJlc3QtZWZmb3J0IGJyZWFrZG93biBvZiBwYXRobmFtZVxuICAvLyAvIHF1ZXJ5IC8gaGFzaCArIGEgZ3Vlc3MgYXQgdGhlXG4gIC8vIGFjdGl2ZSByb3V0ZU5hbWUgKGA/cm91dGU9c2V0dGluZ3NgIG9yIGAjL3VzZXJzLzQyYCBzdHlsZSkuXG4gIHJvdXRlPzoge1xuICAgIHBhdGhuYW1lPzogc3RyaW5nO1xuICAgIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBoYXNoPzogc3RyaW5nO1xuICAgIHJvdXRlTmFtZT86IHN0cmluZztcbiAgICByb3V0ZVBhcmFtPzogc3RyaW5nO1xuICB9O1xuICAvLyBSZWRhY3RlZCBzdGF0ZSBzbmFwc2hvdC4gU3VyZmFjZXMgdGhlIFNIQVBFIG9mIHN0YXRlIHRoYXQgcHJvZHVjZWRcbiAgLy8gdGhlIHBhZ2UgKHN0b3JhZ2Uga2V5cywgY29va2llIG5hbWVzLCBmZWF0dXJlIGZsYWdzKSB3aXRob3V0XG4gIC8vIGxlYWtpbmcgdmFsdWVzLiBMZXRzIGEgZG93bnN0cmVhbSBhZ2VudCByZXByb2R1Y2UgYnkgc2V0dGluZyB1cCB0aGVcbiAgLy8gc2FtZSBrZXlzIHdpdGggdGhlaXIgb3duIGRhdGEuXG4gIHN0YXRlPzoge1xuICAgIHN0b3JhZ2VLZXlzPzogc3RyaW5nW107XG4gICAgc2Vzc2lvbktleXM/OiBzdHJpbmdbXTtcbiAgICBjb29raWVOYW1lcz86IHN0cmluZ1tdO1xuICAgIGZlYXR1cmVGbGFncz86IHN0cmluZztcbiAgfTtcbiAgLy8gU2Vzc2lvbiB1dWlkLiBTdGFibGUgcGVyIHdvcmtzcGFjZS1ib290IOKAlCBzZWxlY3RvciBlbnRyaWVzIHJlZmVyZW5jZVxuICAvLyBpdCB2aWEgYEVudHJ5LnNlc3Npb25JZGAgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlcyB0byB0aGVpclxuICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyaXNvbi5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxNZXNzYWdlID0gU2VsZWN0b3JNZXNzYWdlIHwgRmVlZGJhY2tNZXNzYWdlIHwgUGFnZU1lc3NhZ2U7XG5cbi8vIC0tLS0tLS0tLS0gSVBDIHBheWxvYWRzIChDUyDihpQgUGFuZWwg4oaUIEJhY2tncm91bmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgdHlwZSBDc1RvUGFuZWwgPVxuICB8IHtraW5kOiAnY2FwdHVyZSc7IGVudHJ5OiBFbnRyeTsgcGFnZTogUGFnZUNvbnRleHQ7IGdyb3VwZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnaG92ZXInOyBzZWxlY3Rvcjogc3RyaW5nOyB0YWc6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcmVjdDogUmVjdH1cbiAgfCB7a2luZDogJ2hvdmVyLWVuZCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWFkZCc7IGVudHJ5OiBFbnRyeX1cbiAgfCB7a2luZDogJ3BlbmRpbmctY2xlYXInfVxuICAvLyBBZGQgYSBmZWVkYmFjayByb3cgYXR0YWNoZWQgdG8gYSBzZWxlY3Rvci4gVGhlIGxvb2t1cCBpcyBieVxuICAvLyBjb21wb3NpdGUga2V5IOKAlCBzZWxlY3RvciArIHVybCArIHBhcmVudFVpZCDigJQgc28gYSBjb21tZW50IG9uXG4gIC8vIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYCBvbiBwYWdlIEEgZG9lc24ndCBibGVlZCBpbnRvIGFcbiAgLy8gY2FwdHVyZSB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIG9uIHBhZ2UgQi4gcGFyZW50VWlkICh3aGVuIHRoZVxuICAvLyBjb250ZW50IHNjcmlwdCBjYW4gc3VwcGx5IGl0IGZyb20gdGhlIGFubm90YXRpb24gb3ZlcmxheSdzXG4gIC8vIGFzc29jaWF0ZWQgY2FwdHVyZSkgaXMgdGhlIHN0cm9uZ2VzdCBkaXNhbWJpZ3VhdG9yOyB1cmwgaXMgdGhlXG4gIC8vIGZhbGxiYWNrIHdoZW4gb25seSB0aGUgb24tcGFnZSBjb21tZW50IGJveCBpcyBpbiBwbGF5LlxuICB8IHtraW5kOiAnZmVlZGJhY2stYWRkJzsgc2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ31cbiAgLy8gRmlyZWQgd2hlbiBhIHNlc3Npb24tbGV2ZWwgcHJlZmVyZW5jZSBmbGlwcyAoZGFyay1tb2RlIHRvZ2dsZSwgT1NcbiAgLy8gbW90aW9uLXByZWYgY2hhbmdlKS4gVGhlIHBhbmVsIGFwcGVuZHMgYSBmcmVzaCBwYWdlIHJvdyBzbyB0aGVcbiAgLy8gZXhwb3J0J3MgY2hyb25vbG9neSByZWZsZWN0cyB0aGUgdG9nZ2xlIGFuZCBwb3N0LWNoYW5nZSBjYXB0dXJlc1xuICAvLyBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0IHN0YXRlLlxuICB8IHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnOyByZWFzb246ICdjb2xvci1zY2hlbWUnIHwgJ3JlZHVjZWQtbW90aW9uJzsgcGFnZTogUGFnZUNvbnRleHR9O1xuXG5leHBvcnQgdHlwZSBQYW5lbFRvQ3MgPVxuICB8IHtraW5kOiAnb3V0bGluZSc7IHNlbGVjdG9yOiBzdHJpbmc7IGdvbGQ/OiBib29sZWFuOyBkYXNoZWQ/OiBib29sZWFufVxuICB8IHtraW5kOiAnb3V0bGluZS1jbGVhcid9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBTaWRlIHBhbmVsIGFza3MgdGhlIGJhY2tncm91bmQgdG8gd3JpdGUgYSBVVEYtOCBzdHJpbmcgKEpTT05MLCBNYXJrZG93bixcbiAgLy8gUkVBRE1FKSB0byBkaXNrLiBgc3ViZGlyYCBpcyByZWxhdGl2ZSB0byAucGluY2hncmFiLzx3b3Jrc3BhY2U+LyDigJQgd2VcbiAgLy8gZGVmYXVsdCB0byAnZXhwb3J0cycgc28gSlNPTkwvTUQgbGl2ZSBzZXBhcmF0ZSBmcm9tIHNjcmVlbnNob3RzLlxuICB8IHtraW5kOiAnc2F2ZS10ZXh0Jzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9XG4gIC8vIFNhbWUgYXMgc2F2ZS10ZXh0IGJ1dCBmb3IgYmluYXJ5IGJsb2JzICh3b3Jrc3BhY2UgWklQKS4gY2hyb21lLnJ1bnRpbWVcbiAgLy8gLnNlbmRNZXNzYWdlIHVzZXMgc3RydWN0dXJlZCBjbG9uaW5nLCB3aGljaCBwcmVzZXJ2ZXMgVWludDhBcnJheSwgc28gd2VcbiAgLy8gcGFzcyB0aGUgdHlwZWQgYXJyYXkgZGlyZWN0bHkuIG51bWJlcltdIGlzIGFjY2VwdGVkIGFzIGEgZmFsbGJhY2sgZm9yXG4gIC8vIG9sZGVyIGNhbGxlcnMgYW5kIHRlc3RzIHRoYXQgcHJlLXNlcmlhbGl6ZS5cbiAgfCB7a2luZDogJ3NhdmUtYnl0ZXMnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgYnl0ZXM6IFVpbnQ4QXJyYXkgfCBudW1iZXJbXTsgbWltZTogc3RyaW5nOyBzdWJkaXI/OiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBTaG90UmVwbHkgPSB7XG4gIG9rOiBib29sZWFuO1xuICBmaWxlbmFtZT86IHN0cmluZzsgICAgIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChlLmcuIGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZylcbiAgYWJzUGF0aD86IHN0cmluZzsgICAgICAvLyBPUy1hYnNvbHV0ZSBwYXRoIGZvciBcIkNvcHkgYXMgcGF0aFwiXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAgICAgLy8gVUktZmFjaW5nIHBhdGg7IGF2b2lkcyBQbGF5d3JpZ2h0IHRlbXAgYXJ0aWZhY3QgbmFtZXNcbiAgdGVtcFBhdGg/OiBib29sZWFuOyAgICAvLyB0cnVlIHdoZW4gYWJzUGF0aCBpcyBhIGJyb3dzZXIvdGVzdC1oYXJuZXNzIGFydGlmYWN0IHBhdGhcbiAgZG93bmxvYWRTdGF0ZT86ICdpbl9wcm9ncmVzcycgfCAnaW50ZXJydXB0ZWQnIHwgJ2NvbXBsZXRlJztcbiAgZGF0YVVybD86IHN0cmluZzsgICAgICAvLyBkb3duc2NhbGVkIHRodW1ibmFpbCAo4omkMzIwcHggd2lkZSkgZm9yIHRoZSBzaWRlLXBhbmVsIHByZXZpZXdcbiAgZnVsbERhdGFVcmw/OiBzdHJpbmc7ICAvLyBmdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwg4oCUIHVzZWQgYnkgdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGV4cG9ydFxuICBlcnJvcj86IHN0cmluZztcbiAgdHJ1bmNhdGVkPzogYm9vbGVhbjtcbiAgLy8gQ3JvcCBtZXRhZGF0YS4gTGV0cyByZWNlaXZlcnMgbWFwIGJldHdlZW4gdGhlIHN0b3JlZCBQTkcgYW5kXG4gIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZXMgc28gdGhleSBjYW5cbiAgLy8gZHJhdyB0aGVpciBvd24gb3ZlcmxheSBvciByZXByb2R1Y2UgdGhlIGNyb3Agb24gYSBmcmVzaCBjYXB0dXJlLlxuICBjcm9wPzoge1xuICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgaW1hZ2VTaXplOiB7dzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGRwcjogbnVtYmVyO1xuICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICBzZWxlY3RvcnM6IHN0cmluZ1tdO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgfTtcbiAgLy8gUmVzb2x1dGlvbiByb290IGZvciBldmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTCBzdHJlYW0uXG4gIC8vICAg4oCiICdhcmNoaXZlJyAgIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3RcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHRhci56c3QgZXhwb3J0cykuXG4gIC8vICAg4oCiICd3b3Jrc3BhY2UnIOKAlCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlIHdvcmtzcGFjZSBkaXIgb24gZGlzayxcbiAgLy8gICAgICAgICAgICAgICAgICAgaS5lLiBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cykuXG4gIC8vIFJlY2VpdmVycyBwcmVwZW5kIHRoZSBhcHByb3ByaWF0ZSByb290IHRvIHJlc29sdmUgYW55IHBhdGggZmllbGQuXG4gIHBhdGhSb290PzogJ2FyY2hpdmUnIHwgJ3dvcmtzcGFjZSc7XG4gIC8vIEluZGlyZWN0aW9uIHBvaW50ZXIgdG8gdGhlIFVJIHNraWxsIHRoYXQga25vd3MgaG93IHRvIHRyaWFnZSB0aGVzZVxuICAvLyBjYXB0dXJlcy4gV2hlbiBgaW5saW5lOiB0cnVlYCwgdGhlIHNraWxsIGNvbnRlbnQgbGl2ZXMgYXRcbiAgLy8gYGFyY2hpdmVQYXRoYCBpbnNpZGUgdGhlIHRhciAoZGVmYXVsdDogYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGApLlxuICAvL1xuICAvLyBgY3VzdG9taXplZGAgYW5kIGB0ZW1wbGF0ZWAgYXJlIG11dHVhbGx5LWV4Y2x1c2l2ZSBjb25maWRlbmNlIGZsYWdzOlxuICAvLyAgIOKAoiBjdXN0b21pemVkOiB0cnVlIOKGkiB1c2VyIHVwbG9hZGVkIC8gcGFzdGVkIHRoZWlyIG93biBjb250ZW50LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgdGhlIGZpbGUgYXMgYXV0aG9yaXRhdGl2ZS5cbiAgLy8gICDigKIgdGVtcGxhdGU6IHRydWUgICDihpIgdXNlciBpcyBzaGlwcGluZyB0aGUgYnVuZGxlZCBkZWZhdWx0LlxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgVHJlYXQgYXMgZ2VuZXJpYyBib2lsZXJwbGF0ZTsgdmVyaWZ5IGJlZm9yZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlpbmcuXG4gIC8vIChUaGUgcHJldmlvdXMgYHRlbXBsYXRlYCBmbGFnIGFsb25lIHdhcyBhbWJpZ3VvdXMgYmVjYXVzZSB0aGVcbiAgLy8gYnVuZGxlZCBsb2NhbCB0ZW1wbGF0ZSBzdGlsbCBsb29rcyBwcm9qZWN0LXNwZWNpZmljLilcbiAgc2tpbGw/OiB7bmFtZTogc3RyaW5nOyBwYXRoOiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gUG9pbnRlciB0byB0aGUgcHJvamVjdCdzIERFU0lHTi5tZC4gU2FtZSBydWxlczogYGN1c3RvbWl6ZWQ6IHRydWVgXG4gIC8vIG1lYW5zIHRoZSB1c2VyIHN1cHBsaWVkIHRoaXMgY29udGVudDsgYHRlbXBsYXRlOiB0cnVlYCBtZWFucyBpdCdzXG4gIC8vIFBpbmNoR3JhYidzIGJ1bmRsZWQgZGVmYXVsdC5cbiAgZGVzaWduPzoge3BhdGg/OiBzdHJpbmc7IGlubGluZT86IGJvb2xlYW47IGFyY2hpdmVQYXRoPzogc3RyaW5nOyB0ZW1wbGF0ZT86IGJvb2xlYW47IGN1c3RvbWl6ZWQ/OiBib29sZWFufTtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT5cbiAgYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7KCsrX21pZENvdW50ZXIpLnRvU3RyaW5nKDM2KX0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA4KX1gO1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gU3Vic2V0IG9mIGx1Y2lkZS5kZXYgaWNvbnMgaW5saW5lZCBhcyBTVkcgaW5uZXItbWFya3VwLlxuLy8gRWFjaCBlbnRyeSBpcyB0aGUgYm9keSBvZiA8c3ZnIC4uLiA+IC4uLiA8L3N2Zz47IHN2Z1N0cmluZygpIHdyYXBzIGl0LlxuLy8gU2l6ZXMgZGVmYXVsdCB0byAxNjsgb3ZlcnJpZGUgd2l0aCB0aGUgc2l6ZSBhcmd1bWVudC5cbi8vXG4vLyBNSVQg4oCUIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWNpZGUtaWNvbnMvbHVjaWRlXG5cbmNvbnN0IElDT05TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2hldnJvbi1yaWdodCc6ICc8cGF0aCBkPVwibTkgMTggNi02LTYtNlwiLz4nLFxuICAnY2hldnJvbi1kb3duJzogJzxwYXRoIGQ9XCJtNiA5IDYgNiA2LTZcIi8+JyxcbiAgY29weTogJzxyZWN0IHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjhcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk00IDE2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDJcIi8+JyxcbiAgcGVuY2lsOiAnPHBhdGggZD1cIk0yMS4xNzQgNi44MTJhMSAxIDAgMCAwLTMuOTg2LTMuOTg3TDMuODQyIDE2LjE3NGEyIDIgMCAwIDAtLjUuODNsLTEuMzIxIDQuMzUyYS41LjUgMCAwIDAgLjYyMy42MjJsNC4zNTMtMS4zMmEyIDIgMCAwIDAgLjgzLS40OTd6XCIvPjxwYXRoIGQ9XCJtMTUgNSA0IDRcIi8+JyxcbiAgJ3RyYXNoLTInOiAnPHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjZcIi8+PHBhdGggZD1cIk04IDZWNGMwLTEgMS0yIDItMmg0YzEgMCAyIDEgMiAydjJcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiMTBcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjE0XCIgeDI9XCIxNFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPicsXG4gIHBsdXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+PHBhdGggZD1cIk0xMiA1djE0XCIvPicsXG4gIHg6ICc8cGF0aCBkPVwiTTE4IDYgNiAxOFwiLz48cGF0aCBkPVwibTYgNiAxMiAxMlwiLz4nLFxuICBtaW51czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz4nLFxuICBzZWFyY2g6ICc8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjhcIi8+PHBhdGggZD1cIm0yMSAyMS00LjMtNC4zXCIvPicsXG4gIGRvd25sb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCI3IDEwIDEyIDE1IDE3IDEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIxNVwiIHkyPVwiM1wiLz4nLFxuICB1cGxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE3IDggMTIgMyA3IDhcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjNcIiB5Mj1cIjE1XCIvPicsXG4gIGdpdGh1YjogJzxwYXRoIGQ9XCJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNCA1LjQgMCAwIDAgNCA5YzAgMy41IDMgNS41IDYgNS41LS4zOS40OS0uNjggMS4wNS0uODUgMS42NS0uMTcuNi0uMjIgMS4yMy0uMTUgMS44NXY0XCIvPjxwYXRoIGQ9XCJNOSAxOGMtNC41MSAyLTUtMi03LTJcIi8+JyxcbiAgc3RhcjogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIi8+JyxcbiAgJ2NpcmNsZS1kb3QnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIGNyb3NzaGFpcjogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIyMlwiIHgyPVwiMThcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjZcIiB4Mj1cIjJcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiNlwiIHkyPVwiMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMjJcIiB5Mj1cIjE4XCIvPicsXG4gIHRhcmdldDogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI2XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMlwiLz4nLFxuICAncGFuZWwtbGVmdC1jbG9zZSc6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIvPjxwYXRoIGQ9XCJNOSAzdjE4XCIvPjxwYXRoIGQ9XCJtMTYgMTUtMy0zIDMtM1wiLz4nLFxuICAnZXh0ZXJuYWwtbGluayc6ICc8cGF0aCBkPVwiTTE1IDNoNnY2XCIvPjxwYXRoIGQ9XCJNMTAgMTQgMjEgM1wiLz48cGF0aCBkPVwiTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDZcIi8+JyxcbiAgJ21lc3NhZ2Utc3F1YXJlLXBsdXMnOiAnPHBhdGggZD1cIk0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnpcIi8+PGxpbmUgeDE9XCI5XCIgeDI9XCIxNVwiIHkxPVwiMTBcIiB5Mj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI3XCIgeTI9XCIxM1wiLz4nLFxuICAnYWxlcnQtY2lyY2xlJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjhcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyLjAxXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgJ3JlZnJlc2gtY3cnOiAnPHBhdGggZD1cIk0zIDEyYTkgOSAwIDAgMSAxNS02LjdMMjEgOFwiLz48cGF0aCBkPVwiTTIxIDN2NWgtNVwiLz48cGF0aCBkPVwiTTIxIDEyYTkgOSAwIDAgMS0xNSA2LjdMMyAxNlwiLz48cGF0aCBkPVwiTTMgMjF2LTVoNVwiLz4nLFxuICAnZmlsZS10ZXh0JzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTNcIiB5Mj1cIjEzXCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjE3XCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjEwXCIgeDI9XCI4XCIgeTE9XCI5XCIgeTI9XCI5XCIvPicsXG4gICdmaWxlLWNvZGUnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48cGF0aCBkPVwibTEwIDEzLTIgMiAyIDJcIi8+PHBhdGggZD1cIm0xNCAxNyAyLTItMi0yXCIvPicsXG4gIGltYWdlOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiOVwiIHI9XCIyXCIvPjxwYXRoIGQ9XCJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMVwiLz4nLFxuICAvLyBTdHlsaXNlZCBcInBpbmNoXCIg4oCUIHR3byBvcHBvc2luZyBjdXJ2ZXMgbWVldGluZyBhdCBhIGNlbnRlciBkb3QuXG4gIHBpbmNoOiAnPHBhdGggZD1cIk01IDVjMyAyIDUgNCA3IDctMiAzLTQgNS03IDdcIi8+PHBhdGggZD1cIk0xOSA1Yy0zIDItNSA0LTcgNyAyIDMgNCA1IDcgN1wiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEuNVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgJ3N0YXItZmlsbGVkJzogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIHBpbjogJzxwYXRoIGQ9XCJNMTIgMTd2NVwiLz48cGF0aCBkPVwiTTkgMTAuNzZhMiAyIDAgMCAxLTEuMTEgMS43OWwtMS43OC45QTIgMiAwIDAgMCA1IDE1LjI0VjE2YTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtLjc2YTIgMiAwIDAgMC0xLjExLTEuNzlsLTEuNzgtLjlBMiAyIDAgMCAxIDE1IDEwLjc2VjdhMSAxIDAgMCAxIDEtMSAyIDIgMCAwIDAgMC00SDhhMiAyIDAgMCAwIDAgNCAxIDEgMCAwIDEgMSAxelwiLz4nLFxuICB1bmRvOiAnPHBhdGggZD1cIk0zIDd2Nmg2XCIvPjxwYXRoIGQ9XCJNMjEgMTdhOSA5IDAgMCAwLTE1LTYuN0wzIDEzXCIvPicsXG4gIHJlZG86ICc8cGF0aCBkPVwiTTIxIDd2NmgtNlwiLz48cGF0aCBkPVwiTTMgMTdhOSA5IDAgMCAxIDE1LTYuN0wyMSAxM1wiLz4nLFxuICBmb2xkZXI6ICc8cGF0aCBkPVwiTTIwIDIwYTIgMiAwIDAgMCAyLTJWOGEyIDIgMCAwIDAtMi0yaC03LjkzYTIgMiAwIDAgMS0xLjY2LS45bC0uODItMS4yQTIgMiAwIDAgMCA3LjkzIDNINGEyIDIgMCAwIDAtMiAydjEzYTIgMiAwIDAgMCAyIDJaXCIvPicsXG4gIGNoZWNrOiAnPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIvPicsXG4gICdjaXJjbGUtY2hlY2snOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiLz4nLFxuICBncmlwOiAnPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjE5XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxOVwiIHI9XCIxXCIvPicsXG4gIHNldHRpbmdzOiAnPHBhdGggZD1cIk0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIvPicsXG4gIGluZm86ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJNMTIgMTZ2LTRcIi8+PHBhdGggZD1cIk0xMiA4aC4wMVwiLz4nLFxuICAvLyBUcmVlLW9mLXJvd3Mg4oCUIHVzZWQgZm9yIFwiU3BsaXQgZ3JvdXBcIiBhY3Rpb24gKGRlbm90ZXMgb25lIG5vZGUgZmFubmluZ1xuICAvLyBvdXQgaW50byBzaWJsaW5ncykuIEx1Y2lkZSdzIGBsaXN0LXRyZWVgLlxuICAnbGlzdC10cmVlJzogJzxwYXRoIGQ9XCJNMjEgMTJoLThcIi8+PHBhdGggZD1cIk0yMSA2SDhcIi8+PHBhdGggZD1cIk0yMSAxOGgtOFwiLz48cGF0aCBkPVwiTTMgNnY0YzAgMS4xLjkgMiAyIDJoM1wiLz48cGF0aCBkPVwiTTMgMTB2NmMwIDEuMS45IDIgMiAyaDNcIi8+JyxcbiAgLy8gR2VuZXJpYyBzcGxpdCBpY29uIGFzIGEgZmFsbGJhY2sgb3B0aW9uLlxuICBzcGxpdDogJzxwYXRoIGQ9XCJNMTYgM2g1djVcIi8+PHBhdGggZD1cIk04IDNIM3Y1XCIvPjxwYXRoIGQ9XCJtMjEgMy03LjQ2IDcuNDZhMiAyIDAgMCAwIDAgMi44M0wyMSAyMVwiLz48cGF0aCBkPVwiTTMgM2w3LjQ2IDcuNDZhMiAyIDAgMCAxIDAgMi44M0wzIDIxXCIvPicsXG4gIC8vIENhcmRib2FyZC1zdHlsZSBib3ggdXNlZCBmb3IgXCJFeHBvcnQgd29ya3NwYWNlIGFzIFpJUFwiLlxuICBwYWNrYWdlOiAnPHBhdGggZD1cIm03LjUgNC4yNyA5IDUuMTVcIi8+PHBhdGggZD1cIk0yMSA4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNlpcIi8+PHBhdGggZD1cIk0zLjMgNyAxMiAxMmw4LjctNVwiLz48cGF0aCBkPVwiTTEyIDIyVjEyXCIvPicsXG4gIC8vIFR3byBpbnRlcmxvY2tpbmcgbGlua3Mg4oCUIHVzZWQgZm9yIFwiQ29weSBhcyBwYXRoXCIuXG4gIGxpbms6ICc8cGF0aCBkPVwiTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIk0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MVwiLz4nLFxuICAvLyBEYXRhYmFzZS9kdWNrIGljb24gZm9yIHRoZSBEdWNrREIgcGFsZXR0ZSBjb21tYW5kLlxuICBkYXRhYmFzZTogJzxlbGxpcHNlIGN4PVwiMTJcIiBjeT1cIjVcIiByeD1cIjlcIiByeT1cIjNcIi8+PHBhdGggZD1cIk0zIDVWMTlBOSAzIDAgMCAwIDIxIDE5VjVcIi8+PHBhdGggZD1cIk0zIDEyQTkgMyAwIDAgMCAyMSAxMlwiLz4nLFxufTtcblxuY29uc3Qgd3JhcCA9IChib2R5OiBzdHJpbmcsIHNpemU6IG51bWJlcik6IHN0cmluZyA9PlxuICBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj4ke2JvZHl9PC9zdmc+YDtcblxuZXhwb3J0IGNvbnN0IFBHX0lDT05TID0ge1xuICBoYXM6IChuYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IG5hbWUgaW4gSUNPTlMsXG4gIHN2Z1N0cmluZzogKG5hbWU6IHN0cmluZywgc2l6ZSA9IDE2KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBib2R5ID0gSUNPTlNbbmFtZV07XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tsdWNpZGVdIG1pc3NpbmcgaWNvbicsIG5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChib2R5LCBzaXplKTtcbiAgfSxcbiAgbW91bnQ6IChlbDogRWxlbWVudCB8IG51bGwsIG5hbWU6IHN0cmluZywgc2l6ZT86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChlbCkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICB9LFxufTtcblxuLy8gU2lkZS1lZmZlY3QgZm9yIGxlZ2FjeSBzY3JpcHQtdGFnIGluY2x1c2lvbiAoc2lkZXBhbmVsLmh0bWwgc3RpbGwgPHNjcmlwdFxuLy8gc3JjPVwibHVjaWRlLmpzXCI+IOKAlCBwcmUtYnVuZGxlKS4gUmUtZXhwb3NlcyB0aGUgcmVnaXN0cnkgb24gZ2xvYmFsVGhpcy5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5QR19JQ09OUyA9IFBHX0lDT05TO1xufVxuIiwKICAgICIvLyBVU1RBUi1mb3JtYXQgdGFyIGVuY29kZXIuIEVhY2ggZW50cnkgaXMgYSA1MTItYnl0ZSBoZWFkZXIgZm9sbG93ZWQgYnlcbi8vIGNvbnRlbnQgYnl0ZXMgcGFkZGVkIHVwIHRvIHRoZSBuZXh0IDUxMi1ieXRlIGJvdW5kYXJ5LiBUaGUgYXJjaGl2ZSBlbmRzXG4vLyB3aXRoIHR3byB6ZXJvLWZpbGxlZCA1MTItYnl0ZSBibG9ja3MuIH44MCBsaW5lcywgbm8gZGVwZW5kZW5jaWVzLlxuLy9cbi8vIFdlIHBpY2sgdGFyIChyYXRoZXIgdGhhbiB6aXApIGJlY2F1c2UgenN0ZCBpcyB0aGUgd2lyZSBmb3JtYXQgd2Ugd2FudCB0b1xuLy8gcGFpciBpdCB3aXRoIGFuZCB0YXIuenN0IGlzIHRoZSBzdGFuZGFyZCBjb21ibyAoemlwIGlzIGl0cyBvd25cbi8vIGNvbXByZXNzaW9uIGNvbnRhaW5lcikuIEZvciBmaWxlcyB3aXRoIHBhdGhzIGxvbmdlciB0aGFuIDEwMCBjaGFycyB3ZVxuLy8gdGhyb3cgcmF0aGVyIHRoYW4gaW1wbGVtZW50IHRoZSBHTlUvUEFYIGxvbmctbmFtZSBleHRlbnNpb25zIOKAlCB0aGVcbi8vIFBpbmNoR3JhYiBhcmNoaXZlIGxheW91dCB1c2VzIHNob3J0IHBhdGhzIG9ubHkuXG5cbmNvbnN0IGVuYyA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG5jb25zdCB3cml0ZU9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIC8vIHRhciBmaWVsZHMgYXJlIHplcm8tcGFkZGVkIG51bGwtdGVybWluYXRlZCBvY3RhbCBzdHJpbmdzLlxuICBsZXQgcyA9IHZhbHVlLnRvU3RyaW5nKDgpO1xuICBzID0gcy5wYWRTdGFydChsZW5ndGggLSAxLCAnMCcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDE7IGkrKykgYnVmW29mZnNldCArIGldID0gcy5jaGFyQ29kZUF0KGkpO1xuICBidWZbb2Zmc2V0ICsgbGVuZ3RoIC0gMV0gPSAwO1xufTtcblxuY29uc3Qgd3JpdGVBc2NpaSA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBzdHI6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgY29uc3QgYnl0ZXMgPSBlbmMuZW5jb2RlKHN0cik7XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKGJ5dGVzLmxlbmd0aCwgbGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV0hO1xufTtcblxuY29uc3QgaGVhZGVyQ2hlY2tzdW0gPSAoaGVhZGVyOiBVaW50OEFycmF5KTogbnVtYmVyID0+IHtcbiAgLy8gVGhlIGNoZWNrc3VtIGZpZWxkICg4IGJ5dGVzIGF0IG9mZnNldCAxNDgpIGlzIHRyZWF0ZWQgYXMgQVNDSUkgc3BhY2VzXG4gIC8vIGR1cmluZyBjb21wdXRhdGlvbiwgdGhlbiB0aGUgYWN0dWFsIGNoZWNrc3VtIGlzIHdyaXR0ZW4gaW50byBpdC5cbiAgbGV0IHN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHtcbiAgICBpZiAoaSA+PSAxNDggJiYgaSA8IDE1Nikgc3VtICs9IDB4MjA7XG4gICAgZWxzZSBzdW0gKz0gaGVhZGVyW2ldID8/IDA7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbmV4cG9ydCB0eXBlIFRhckVudHJ5ID0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRhdGE6IFVpbnQ4QXJyYXkgfCBzdHJpbmc7XG4gIG10aW1lPzogbnVtYmVyOyAvLyB1bml4IGVwb2NoIHNlY29uZHM7IGRlZmF1bHRzIHRvIG5vd1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVGFyID0gKGVudHJpZXM6IFRhckVudHJ5W10pOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgY29uc3Qgbm93U2VjID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZW50cnkuZGF0YSA9PT0gJ3N0cmluZycgPyBlbmMuZW5jb2RlKGVudHJ5LmRhdGEpIDogZW50cnkuZGF0YTtcbiAgICBjb25zdCBuYW1lID0gZW50cnkubmFtZTtcbiAgICBpZiAobmFtZS5sZW5ndGggPiAxMDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdGFyOiBmaWxlbmFtZSB0b28gbG9uZyAoJHtuYW1lLmxlbmd0aH0gPiAxMDAgY2hhcnMpOiAke25hbWV9YCk7XG4gICAgfVxuICAgIGNvbnN0IGhlYWRlciA9IG5ldyBVaW50OEFycmF5KDUxMik7XG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDAsIG5hbWUsIDEwMCk7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwMCwgMG82NDQsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RlXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEwOCwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1aWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTE2LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMjQsIGRhdGEubGVuZ3RoLCAxMik7ICAgICAgICAgICAgICAgICAgLy8gc2l6ZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMzYsIGVudHJ5Lm10aW1lID8/IG5vd1NlYywgMTIpOyAgICAgICAgLy8gbXRpbWVcbiAgICBmb3IgKGxldCBpID0gMTQ4OyBpIDwgMTU2OyBpKyspIGhlYWRlcltpXSA9IDB4MjA7ICAgICAgICAgIC8vIGNoZWNrc3VtIHBsYWNlaG9sZGVyXG4gICAgaGVhZGVyWzE1Nl0gPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0eXBlZmxhZyAnMCcgPSByZWd1bGFyIGZpbGVcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjU3LCAndXN0YXInLCA2KTsgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI2MywgJzAwJywgMik7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2ZXJzaW9uXG4gICAgLy8gdW5hbWUvZ25hbWUvZGV2bWFqb3IvZGV2bWlub3IvcHJlZml4IGFsbCBsZWZ0IHplcm8uXG5cbiAgICBjb25zdCBjaGVja3N1bSA9IGhlYWRlckNoZWNrc3VtKGhlYWRlcik7XG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDE0OCwgY2hlY2tzdW0sIDgpO1xuXG4gICAgYmxvY2tzLnB1c2goaGVhZGVyKTtcbiAgICBibG9ja3MucHVzaChkYXRhKTtcbiAgICBjb25zdCBwYWQgPSAoNTEyIC0gKGRhdGEubGVuZ3RoICUgNTEyKSkgJSA1MTI7XG4gICAgaWYgKHBhZCkgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkocGFkKSk7XG4gIH1cbiAgLy8gVHJhaWxlcjogdHdvIGNvbnNlY3V0aXZlIDUxMi1ieXRlIHplcm8gYmxvY2tzLlxuICBibG9ja3MucHVzaChuZXcgVWludDhBcnJheSgxMDI0KSk7XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmZzZXQpOyBvZmZzZXQgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBac3RkIHJhdy1ibG9jayBmcmFtZSB3cml0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gQ29tcHJlc3Npb25TdHJlYW0oJ3pzdGQnKSBpc24ndCBzaGlwcGVkIGluIGN1cnJlbnQgQ2hyb21pdW0gKHZlcmlmaWVkIHZpYVxuLy8gcnVudGltZSBwcm9iZSksIHNvIHdlIHdyaXRlIGEgdmFsaWQgenN0ZCBmcmFtZSBjb250YWluaW5nIG9uZSBvciBtb3JlXG4vLyByYXcgKHVuY29tcHJlc3NlZCkgYmxvY2tzLiBUaGUgb3V0cHV0IGlzIHN0cnVjdHVyYWxseSBhIHJlYWwgYC50YXIuenN0YFxuLy8gZmlsZTogYHpzdGQgLWRgIGFjY2VwdHMgaXQsIDctWmlwIGFjY2VwdHMgaXQsIGxpYnpzdGQgYWNjZXB0cyBpdC4gSXRcbi8vIGp1c3QgZG9lc24ndCBhY3R1YWxseSBjb21wcmVzcyDigJQgZm9yIG91ciBwYXlsb2FkLCB3aGljaCBpcyBtb3N0bHkgUE5HXG4vLyAoYWxyZWFkeSBjb21wcmVzc2VkKSBwbHVzIGEgZmV3IEtCIG9mIEpTT05ML01hcmtkb3duLCB0aGUgbG9zcyB2cy4gcmVhbFxuLy8gREVGTEFURSBpcyBzaW5nbGUtZGlnaXQgcGVyY2VudC5cbi8vXG4vLyBGcmFtZSBsYXlvdXQgKHBlciBSRkMgODg3OCArIFpzdGFuZGFyZCBmb3JtYXQgc3BlYyk6XG4vLyAgIG1hZ2ljX251bWJlciAgICAgICA0IGJ5dGVzICAweDI4IDB4QjUgMHgyRiAweEZEIChMRTogMHhGRDJGQjUyOClcbi8vICAgRkhEICAgICAgICAgICAgICAgIDEgYnl0ZSAgIEZDU19zaXplPTIgKDQtYnl0ZSBGQ1MpLCBTaW5nbGVfU2VnbWVudD0xXG4vLyAgIEZDUyAgICAgICAgICAgICAgICA0IGJ5dGVzICB1bmNvbXByZXNzZWQgcGF5bG9hZCBzaXplICh1MzIgTEUpXG4vLyAgIGJsb2NrcyAgICAgICAgICAgICBOIGJsb2NrcyBlYWNoOiAzLWJ5dGUgaGVhZGVyICsgcGF5bG9hZFxuLy9cbi8vIEJsb2NrIGhlYWRlciAoMyBieXRlcyBMRSk6XG4vLyAgIGJpdCAwICAgICAgIExhc3RfQmxvY2sgZmxhZ1xuLy8gICBiaXRzIDEuLjIgICBCbG9ja19UeXBlICgwMCA9IFJhdywgMDEgPSBSTEUsIDEwID0gQ29tcHJlc3NlZCwgMTEgPSBSZXNlcnZlZClcbi8vICAgYml0cyAzLi4yMyAgQmxvY2tfU2l6ZSAobWF4IDEyOCBLaUIgZm9yIHJhdyAvIFJMRSlcbi8vXG4vLyBXZSBjaHVuayBpbnRvIDEyOCBLaUIgcmF3IGJsb2NrcyB0byByZXNwZWN0IHRoZSBwZXItYmxvY2sgc2l6ZSBsaW1pdC5cblxuY29uc3QgWlNURF9SQVdfQkxPQ0tfTUFYID0gMTI4ICogMTAyNDtcblxuZXhwb3J0IGNvbnN0IHdyYXBac3RkID0gKGRhdGE6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgPCBkYXRhLmxlbmd0aCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGRhdGEubGVuZ3RoIC0gcG9zO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IE1hdGgubWluKHJlbWFpbmluZywgWlNURF9SQVdfQkxPQ0tfTUFYKTtcbiAgICBjb25zdCBpc0xhc3QgPSBwb3MgKyBibG9ja1NpemUgPj0gZGF0YS5sZW5ndGggPyAxIDogMDtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBpc0xhc3QgfCAoMCA8PCAxKSB8IChibG9ja1NpemUgPDwgMyk7IC8vIHR5cGU9cmF3PTBcbiAgICBjb25zdCBibG9ja0hlYWRlciA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAgIGhlYWRlckludCAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiA4KSAmIDB4ZmYsXG4gICAgICAoaGVhZGVySW50ID4+PiAxNikgJiAweGZmLFxuICAgIF0pO1xuICAgIGJsb2Nrcy5wdXNoKGJsb2NrSGVhZGVyKTtcbiAgICBpZiAoYmxvY2tTaXplID4gMCkgYmxvY2tzLnB1c2goZGF0YS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSkpO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSBicmVhaztcbiAgfVxuICBjb25zdCBmY3MgPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgZmhkID0gMGIxMDEwXzAwMDA7IC8vIEZDU19zaXplPTEwICg0IGJ5dGVzKSB8IFNpbmdsZV9TZWdtZW50PTFcbiAgY29uc3QgaGVhZCA9IG5ldyBVaW50OEFycmF5KFtcbiAgICAweDI4LCAweGI1LCAweDJmLCAweGZkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hZ2ljXG4gICAgZmhkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGSERcbiAgICBmY3MgJiAweGZmLCAoZmNzID4+PiA4KSAmIDB4ZmYsIChmY3MgPj4+IDE2KSAmIDB4ZmYsIChmY3MgPj4+IDI0KSAmIDB4ZmYsXG4gIF0pO1xuICBsZXQgdG90YWwgPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgdG90YWwgKz0gYi5sZW5ndGg7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KHRvdGFsKTtcbiAgbGV0IG9mZiA9IDA7XG4gIG91dC5zZXQoaGVhZCwgb2ZmKTsgb2ZmICs9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2ZmKTsgb2ZmICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb21wYW5pb24gZGVjb2RlciBmb3Igb3VyIG93biB3cml0ZXIg4oCUIHVzZWQgYnkgdGVzdHMuIEFjY2VwdHMgYW55IHpzdGRcbi8vIGZyYW1lIHdyaXR0ZW4gYnkgYHdyYXBac3RkYCAoc2luZ2xlIFJhd19CbG9jayBzdHJlYW0sIDQtYnl0ZSBGQ1MsXG4vLyBzaW5nbGUtc2VnbWVudCwgbm8gY2hlY2tzdW0sIG5vIGRpY3QpLiBUaHJvd3Mgb24gYW55dGhpbmcgZWxzZSBzbyB0ZXN0c1xuLy8gZmFpbCBsb3VkbHkgcmF0aGVyIHRoYW4gc2lsZW50bHkgbWlzLXBhcnNlLlxuZXhwb3J0IGNvbnN0IHVud3JhcFpzdGQgPSAoZnJhbWU6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+IHtcbiAgaWYgKGZyYW1lLmxlbmd0aCA8IDkpIHRocm93IG5ldyBFcnJvcignenN0ZDogZnJhbWUgdG9vIHNob3J0Jyk7XG4gIGlmIChmcmFtZVswXSAhPT0gMHgyOCB8fCBmcmFtZVsxXSAhPT0gMHhiNSB8fCBmcmFtZVsyXSAhPT0gMHgyZiB8fCBmcmFtZVszXSAhPT0gMHhmZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignenN0ZDogYmFkIG1hZ2ljIG51bWJlcicpO1xuICB9XG4gIGNvbnN0IGZoZCA9IGZyYW1lWzRdITtcbiAgY29uc3QgZmNzU2l6ZUZsYWcgPSAoZmhkID4+PiA2KSAmIDBiMTE7XG4gIGNvbnN0IHNpbmdsZVNlZ21lbnQgPSAoKGZoZCA+Pj4gNSkgJiAxKSA9PT0gMTtcbiAgY29uc3QgY2hlY2tzdW0gPSAoKGZoZCA+Pj4gMikgJiAxKSA9PT0gMTtcbiAgY29uc3QgZGljdElkID0gZmhkICYgMGIxMTtcbiAgaWYgKCFzaW5nbGVTZWdtZW50KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IG9ubHkgU2luZ2xlX1NlZ21lbnQgZnJhbWVzIHN1cHBvcnRlZCcpO1xuICBpZiAoY2hlY2tzdW0pIHRocm93IG5ldyBFcnJvcignenN0ZDogY29udGVudCBjaGVja3N1bSBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmIChkaWN0SWQpIHRocm93IG5ldyBFcnJvcignenN0ZDogZGljdGlvbmFyaWVzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgbGV0IHBvcyA9IDU7XG4gIGxldCBmY3MgPSAwO1xuICBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDApIHsgZmNzID0gZnJhbWVbcG9zXSE7IHBvcyArPSAxOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjAxKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KTsgZmNzICs9IDI1NjsgcG9zICs9IDI7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMTApIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNikgfCAoZnJhbWVbcG9zICsgM10hICogMHgxMDAwMDAwKTsgcG9zICs9IDQ7IH1cbiAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IDgtYnl0ZSBGQ1MgdW5zdXBwb3J0ZWQnKTtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoZmNzKTtcbiAgbGV0IG91dFBvcyA9IDA7XG4gIGZvciAoOzspIHtcbiAgICBpZiAocG9zICsgMyA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgaGVhZGVyJyk7XG4gICAgY29uc3QgaGVhZGVySW50ID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpIHwgKGZyYW1lW3BvcyArIDJdISA8PCAxNik7XG4gICAgcG9zICs9IDM7XG4gICAgY29uc3QgaXNMYXN0ID0gKGhlYWRlckludCAmIDEpID09PSAxO1xuICAgIGNvbnN0IGJsb2NrVHlwZSA9IChoZWFkZXJJbnQgPj4+IDEpICYgMGIxMTtcbiAgICBjb25zdCBibG9ja1NpemUgPSAoaGVhZGVySW50ID4+PiAzKSAmIDB4MWZfZmZfZmY7XG4gICAgaWYgKGJsb2NrVHlwZSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBvbmx5IFJhd19CbG9jayAoMCkgc3VwcG9ydGVkLCBnb3QgJHtibG9ja1R5cGV9YCk7XG4gICAgaWYgKHBvcyArIGJsb2NrU2l6ZSA+IGZyYW1lLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiB0cnVuY2F0ZWQgYmxvY2sgcGF5bG9hZCcpO1xuICAgIG91dC5zZXQoZnJhbWUuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpLCBvdXRQb3MpO1xuICAgIG91dFBvcyArPSBibG9ja1NpemU7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoaXNMYXN0KSBicmVhaztcbiAgfVxuICBpZiAob3V0UG9zICE9PSBmY3MpIHRocm93IG5ldyBFcnJvcihgenN0ZDogRkNTIG1pc21hdGNoIChnb3QgJHtvdXRQb3N9LCBleHBlY3RlZCAke2Zjc30pYCk7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgVGFyIGxpc3RpbmcgZGVjb2RlciAodGVzdC1vbmx5KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdhbGtzIGEgdGFyIGJ5dGUgYnVmZmVyLCByZXR1cm5pbmcge25hbWUsIGRhdGF9IGZvciBlYWNoIGVudHJ5LiBTdG9wcyBhdFxuLy8gdGhlIHRyYWlsZXIgKHR3byB6ZXJvIGJsb2NrcykuIE9ubHkgcmVhZHMgdGhlIGZpZWxkcyBQaW5jaEdyYWIgd3JpdGVzLlxuXG5leHBvcnQgdHlwZSBQYXJzZWRUYXJFbnRyeSA9IHtuYW1lOiBzdHJpbmc7IGRhdGE6IFVpbnQ4QXJyYXk7IHNpemU6IG51bWJlcn07XG5cbmNvbnN0IGRlYyA9IG5ldyBUZXh0RGVjb2RlcigpO1xuXG5jb25zdCByZWFkTnVsbFN0ciA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGxldCBlbmQgPSBvZmZzZXQgKyBsZW5ndGg7XG4gIGZvciAobGV0IGkgPSBvZmZzZXQ7IGkgPCBvZmZzZXQgKyBsZW5ndGg7IGkrKykge1xuICAgIGlmIChidWZbaV0gPT09IDApIHsgZW5kID0gaTsgYnJlYWs7IH1cbiAgfVxuICByZXR1cm4gZGVjLmRlY29kZShidWYuc3ViYXJyYXkob2Zmc2V0LCBlbmQpKTtcbn07XG5cbmNvbnN0IHJlYWRPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gIGNvbnN0IHMgPSByZWFkTnVsbFN0cihidWYsIG9mZnNldCwgbGVuZ3RoKS50cmltKCk7XG4gIHJldHVybiBzID8gcGFyc2VJbnQocywgOCkgOiAwO1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlVGFyID0gKGJ1ZjogVWludDhBcnJheSk6IFBhcnNlZFRhckVudHJ5W10gPT4ge1xuICBjb25zdCBlbnRyaWVzOiBQYXJzZWRUYXJFbnRyeVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zICsgNTEyIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyA1MTIpO1xuICAgIGxldCBhbGxaZXJvID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7IGlmIChoZWFkZXJbaV0gIT09IDApIHsgYWxsWmVybyA9IGZhbHNlOyBicmVhazsgfSB9XG4gICAgaWYgKGFsbFplcm8pIGJyZWFrOyAvLyB0cmFpbGVyXG4gICAgY29uc3QgbmFtZSA9IHJlYWROdWxsU3RyKGhlYWRlciwgMCwgMTAwKTtcbiAgICBjb25zdCBzaXplID0gcmVhZE9jdGFsKGhlYWRlciwgMTI0LCAxMik7XG4gICAgcG9zICs9IDUxMjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZSwgc2l6ZSwgZGF0YTogYnVmLnN1YmFycmF5KHBvcywgcG9zICsgc2l6ZSl9KTtcbiAgICAgIHBvcyArPSBzaXplO1xuICAgICAgY29uc3QgcGFkID0gKDUxMiAtIChzaXplICUgNTEyKSkgJSA1MTI7XG4gICAgICBwb3MgKz0gcGFkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZW50cmllcztcbn07XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIFRlbGxzIHRoZSBzaWRlcGFuZWwgd2hpY2ggdGVtcGxhdGUgcmVzb3VyY2VzIGV4aXN0IGluIHRoaXMgYnVpbGQuXG4vLyBBY3R1YWwgY29udGVudCBsaXZlcyBhcyAubWQgZmlsZXMgdW5kZXIgZXh0ZW5zaW9uL3RlbXBsYXRlcy8sIGxvYWRlZFxuLy8gbGF6aWx5IHZpYSBjaHJvbWUucnVudGltZS5nZXRVUkwg4oCUIHNlZSBsb2FkVGVtcGxhdGUoKSBpbiBzaWRlcGFuZWwudHMuXG5leHBvcnQgY29uc3QgVEVNUExBVEVTX1BSRVNFTlQgPSB7XCJkZXNpZ25UZW1wbGF0ZVwiOnRydWUsXCJza2lsbFRlbXBsYXRlXCI6dHJ1ZSxcImxvY2FsRGVzaWduXCI6dHJ1ZSxcImxvY2FsU2tpbGxcIjp0cnVlfSBhcyBjb25zdDtcbiIsCiAgICAiLy8gUGluY2hHcmFiIHNpZGUtcGFuZWwgVUkuIFJlY2VpdmVzIGNhcHR1cmVzICsgaG92ZXJzIGZyb20gdGhlIGNvbnRlbnRcbi8vIHNjcmlwdDsgcmVuZGVycyB0aGUgY2hhdC1idWJibGUgdGltZWxpbmUsIGV4cG9ydHMsIHZhbGlkYXRlcywgZXRjLlxuLy9cbi8vIERlY29tcG9zZWQgaW50byBzbWFsbCBmaWxlcyBmb3IgY2xhcml0eTpcbi8vICAg4oCiIHR5cGVzLnRzICAgICAg4oCUIHNoYXJlZCB0eXBlcywgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgbHVjaWRlLnRzICAgICDigJQgaWNvbiByZWdpc3RyeVxuLy8gICDigKIgdGhpcyBmaWxlICAgICDigJQgd2lyZS11cCAvIHJlbmRlcmluZyAvIGV4cG9ydCBidWlsZGVyc1xuLy9cbi8vIExvYWRlZCBhcyB0aGUgc2lkZSBwYW5lbCBwYWdlOiBjaHJvbWUuc2lkZVBhbmVsIGRlZmF1bHRfcGF0aC5cblxuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCwgQ3NUb1BhbmVsLCBFbnRyeSwgRXhwb3J0RGlhZ25vc3RpYywgRXhwb3J0TWFuaWZlc3QsIEZlZWRiYWNrTWVzc2FnZSwgUGFnZU1lc3NhZ2UsXG4gIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5cbigoKSA9PiB7XG4gIGNvbnN0IExPRyA9ICdbUGluY2hHcmFiL3NwXSc7XG4gIGNvbnN0IFBSRUZTX0tFWSA9ICdwaW5jaGdyYWIucHJlZnMudjInO1xuICBjb25zdCBXT1JLU1BBQ0VTX0tFWSA9ICdwaW5jaGdyYWIud29ya3NwYWNlcy52MSc7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuXG4gIC8vIOKUgOKUgOKUgCBUZW1wbGF0ZSByZXNvdXJjZSBsb2FkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEVhcmxpZXIgdGhlIHRlbXBsYXRlcyB3ZXJlIGJha2VkIGFzIHN0cmluZyBjb25zdGFudHMgaW50byB0aGlzIElJRkVcbiAgLy8gKH4zNjBLQiBhY3Jvc3MgREVTSUdOICsgU0tJTEwpLiBUaGF0IGJsb2F0ZWQgdGhlIHNpZGVwYW5lbCBidW5kbGUgdG9cbiAgLy8gfjEuOTVNQiBhbmQgc2xvd2VkIGZpcnN0LW9wZW4gcGFyc2UgdGltZSBub3RpY2VhYmx5LiBUaGV5IG5vdyBzaGlwIGFzXG4gIC8vIHNlcGFyYXRlIGAubWRgIGZpbGVzIHVuZGVyIGBleHRlbnNpb24vdGVtcGxhdGVzL2AgYW5kIGxvYWQgb24gZGVtYW5kXG4gIC8vIHZpYSBmZXRjaCDigJQgd2hlbiB0aGUgdXNlciBvcGVucyB0aGUgZWRpdG9yIG1vZGFsLCBvciB3aGVuIHRoZSBleHBvcnRcbiAgLy8gcGlwZWxpbmUgbmVlZHMgdG8gYnVuZGxlIGEgZmFsbGJhY2suXG4gIC8vXG4gIC8vIENhY2hlIHJlc3VsdHMgaW4tcHJvY2VzcyBzbyByZXBlYXQgcmVhZHMgKG1vZGFsIG9wZW4g4oaSIGNsb3NlIOKGkiByZW9wZW4sXG4gIC8vIG9yIHNlcXVlbnRpYWwgZXhwb3J0cykgZG9uJ3QgcmUtZmV0Y2guXG4gIGNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBURU1QTEFURV9GSUxFUyA9IHtcbiAgICBkZXNpZ25UZW1wbGF0ZTogJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsXG4gICAgc2tpbGxUZW1wbGF0ZTogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsXG4gICAgbG9jYWxEZXNpZ246ICdsb2NhbC5ERVNJR04ubWQnLFxuICAgIGxvY2FsU2tpbGw6ICdsb2NhbC5TS0lMTC5tZCcsXG4gIH0gYXMgY29uc3Q7XG4gIHR5cGUgVGVtcGxhdGVLZXkgPSBrZXlvZiB0eXBlb2YgVEVNUExBVEVfRklMRVM7XG4gIGNvbnN0IHRlbXBsYXRlVXJsID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gSW5zaWRlIHRoZSBleHRlbnNpb24sIHRoZSBzaWRlcGFuZWwgcnVucyBmcm9tXG4gICAgLy8gY2hyb21lLWV4dGVuc2lvbjovLzxpZD4vc2lkZXBhbmVsLmh0bWwsIHNvIHJlc291cmNlcyByZXNvbHZlIHZpYVxuICAgIC8vIGNocm9tZS5ydW50aW1lLmdldFVSTC4gVGhlIFBsYXl3cmlnaHQgc3RhdGljLXNlcnZlciB0ZXN0cyBzZXJ2ZVxuICAgIC8vIGAvdGVtcGxhdGVzLzxmaWxlPmAgZnJvbSB0aGUgZXh0ZW5zaW9uIHJvb3QgZGlyZWN0bHksIHNvIGFcbiAgICAvLyByZWxhdGl2ZSBVUkwgd29ya3MgdGhlcmUgYXMgYSBmYWxsYmFjay5cbiAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCkge1xuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChgdGVtcGxhdGVzLyR7ZmlsZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZXMvJHtmaWxlfWA7XG4gIH07XG4gIGNvbnN0IGxvYWRUZW1wbGF0ZSA9IGFzeW5jIChrZXk6IFRlbXBsYXRlS2V5KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAoIVRFTVBMQVRFU19QUkVTRU5UW2tleV0pIHJldHVybiAnJztcbiAgICBjb25zdCBmaWxlID0gVEVNUExBVEVfRklMRVNba2V5XTtcbiAgICBjb25zdCBjYWNoZWQgPSB0ZW1wbGF0ZUNhY2hlLmdldChmaWxlKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRlbXBsYXRlVXJsKGZpbGUpKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgdGVtcGxhdGUgZmV0Y2ggZmFpbGVkOiAke2ZpbGV9YCwgZXJyKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG4gIC8vIEVmZmVjdGl2ZSBjb250ZW50IHVzZWQgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSBhbmQgdGhlIG1vZGFsLiBXaGVuIHRoZVxuICAvLyB1c2VyIGhhcyBjdXN0b21pemVkIHZpYSB0aGUgdGV4dGFyZWEvdXBsb2FkLCB0aGF0IHdpbnM7IG90aGVyd2lzZSB3ZVxuICAvLyBmYWxsIGJhY2sgdG8gbG9jYWwuKiAodGhlIGRldmVsb3BlcidzIHByZS1iYWtlZCBvdmVycmlkZSkgdGhlbiB0b1xuICAvLyB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgY29uc3QgcmVzb2x2ZURlc2lnbkNvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuZGVzaWduTWQgJiYgcHJlZnMuZGVzaWduTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuZGVzaWduTWQ7XG4gICAgcmV0dXJuIChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsRGVzaWduJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJykpO1xuICB9O1xuICBjb25zdCByZXNvbHZlU2tpbGxDb250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLnNraWxsTWQgJiYgcHJlZnMuc2tpbGxNZC50cmltKCkpIHJldHVybiBwcmVmcy5za2lsbE1kO1xuICAgIHJldHVybiAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbFNraWxsJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKSk7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDihpIgcHJlZnMue2Rlc2lnbk1kfHNraWxsTWR9IGlzXG4gIC8vIGVtcHR5IGFuZCB3ZSdyZSBmYWxsaW5nIGJhY2sgdG8gYSBidW5kbGVkIHRlbXBsYXRlL2xvY2FsIHJlc291cmNlLlxuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24gPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuZGVzaWduTWQgfHwgIXByZWZzLmRlc2lnbk1kLnRyaW0oKTtcbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlU2tpbGwgPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuc2tpbGxNZCB8fCAhcHJlZnMuc2tpbGxNZC50cmltKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0b3JhZ2UgYWRhcHRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgU3RvcmUgPSB7XG4gICAgYXN5bmMgZ2V0PFQ+KGtleTogc3RyaW5nLCBmYWxsYmFjazogVCk6IFByb21pc2U8VD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7IHJldHVybiAob1trZXldIGFzIFQpID8/IGZhbGxiYWNrOyB9XG4gICAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBjb25zdCByID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTsgcmV0dXJuIHIgPT09IG51bGwgPyBmYWxsYmFjayA6IChKU09OLnBhcnNlKHIpIGFzIFQpOyB9XG4gICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgIH0sXG4gICAgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1trZXldOiB2YWx1ZX0pOyByZXR1cm47IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgfVxuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LFxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBET00gcmVmcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgJCA9IDxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50PihzOiBzdHJpbmcpOiBUID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocykgYXMgVDtcbiAgY29uc3QgbGlzdCA9ICQoJ1tkYXRhLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBvc2VyID0gJDxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtY29tcG9zZXJdJyk7XG4gIGNvbnN0IHN0YXR1cyA9ICQoJ1tkYXRhLXN0YXR1c10nKTtcbiAgY29uc3Qgc2VhcmNoID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtc2VhcmNoXScpO1xuICAvLyBVcGRhdGUgdGhlIG92ZXJsYWlkIGtiZCBwaWxsIHRvIHVzZSB0aGUgcmlnaHQgbW9kaWZpZXIgcGVyIHBsYXRmb3JtLlxuICBjb25zdCBpc01hYyA9IC9NYWN8aVBob25lfGlQYWQvaS50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSB8fCBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnKTtcbiAgaWYgKCFpc01hYykge1xuICAgIGNvbnN0IGtiZEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNlYXJjaC1rYmRdIGtiZCcpO1xuICAgIGlmIChrYmRFbCkga2JkRWwudGV4dENvbnRlbnQgPSAnQ3RybCtLJztcbiAgfVxuICBjb25zdCBpbXBvcnRGaWxlID0gJDxIVE1MSW5wdXRFbGVtZW50PignI2ltcG9ydC1maWxlJyk7XG4gIGNvbnN0IHN0YXRzRWwgPSAkKCdbZGF0YS1zdGF0c10nKTtcbiAgY29uc3Qgc3RhcnNFbCA9ICQoJ1tkYXRhLXN0YXJzXScpO1xuICBjb25zdCB0b29sdGlwRWwgPSAkKCdbZGF0YS10b29sdGlwXScpO1xuICBjb25zdCBkcmlsbGRvd25FbCA9ICQoJ1tkYXRhLWRyaWxsZG93bl0nKTtcbiAgY29uc3QgZHJhd2VyID0gJCgnW2RhdGEtZHJhd2VyXScpO1xuICBjb25zdCBwYWxldHRlID0gJCgnW2RhdGEtcGFsZXR0ZV0nKTtcbiAgY29uc3QgcGFsZXR0ZUlucHV0ID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcGFsZXR0ZS1pbnB1dF0nKTtcbiAgY29uc3QgcGFsZXR0ZUxpc3QgPSAkKCdbZGF0YS1wYWxldHRlLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBXb3JkcyA9ICQoJ1tkYXRhLWNvbXAtd29yZHNdJyk7XG4gIGNvbnN0IGNvbXBUb2tlbnMgPSAkKCdbZGF0YS1jb21wLXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFRva2VucyA9ICQoJ1tkYXRhLXN0YXQtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0V29yZHMgPSAkKCdbZGF0YS1zdGF0LXdvcmRzXScpO1xuICBjb25zdCB3c1NlbGVjdCA9ICQ8SFRNTFNlbGVjdEVsZW1lbnQ+KCdbZGF0YS13b3Jrc3BhY2VdJyk7XG4gIGNvbnN0IHdzTGlzdCA9ICQoJ1tkYXRhLXdzLWxpc3RdJyk7XG4gIGNvbnN0IHdzTmFtZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXdzLW5hbWVdJyk7XG5cbiAgY29uc3QgbW91bnRJY29ucyA9IChyb290OiBQYXJlbnROb2RlID0gZG9jdW1lbnQpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWljb25dJykpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbicpO1xuICAgICAgY29uc3Qgc2l6ZSA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScpID8/IDE2KTtcbiAgICAgIGlmIChuYW1lICYmIFBHX0lDT05TLmhhcyhuYW1lKSkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICAgIH1cbiAgfTtcbiAgbW91bnRJY29ucygpO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiBib29sZWFuO1xuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IGJvb2xlYW47XG4gICAgaW5jbHVkZVN0eWxlczogYm9vbGVhbjtcbiAgICBtaW5pZnk6IGJvb2xlYW47XG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogYm9vbGVhbjtcbiAgICB1c2VTY3JlZW5zaG90czogYm9vbGVhbjtcbiAgICBzcGFjaW5nT3ZlcmxheTogYm9vbGVhbjtcbiAgICBob3ZlclNuYXA6IGJvb2xlYW47XG4gICAgYXV0b1NjcmVlbnNob3Q6IGJvb2xlYW47XG4gICAgLy8gQ29tbWEtc2VwYXJhdGVkIGhvc3QgcGF0dGVybnMgKHN1YnN0cmluZyBtYXRjaCkuIEhvc3RzIGluIHRoaXMgbGlzdFxuICAgIC8vIHNraXAgdGhlIGVudGlyZSBzY3JlZW5zaG90IHBpcGVsaW5lIOKAlCB1c2VmdWwgZm9yIHNlbnNpdGl2ZSBwYWdlc1xuICAgIC8vIChiYW5raW5nLCBpbnRlcm5hbCBhZG1pbikgd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IFBOR3MgbGFuZGluZ1xuICAgIC8vIG9uIGRpc2suXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogc3RyaW5nO1xuICAgIC8vIElubGluZSBERVNJR04ubWQgY29udGVudCB0aGUgdXNlciBwYXN0ZWQgb3IgdXBsb2FkZWQgdmlhIHRoZSBzaWRlXG4gICAgLy8gcGFuZWwgc2V0dGluZ3MuIERlZmF1bHRzIHRvIGEgdGVtcGxhdGVkIHBsYWNlaG9sZGVyIHNvIG91dC1vZi10aGUtXG4gICAgLy8gYm94IGV4cG9ydHMgYWx3YXlzIGluY2x1ZGUgYSBERVNJR04ubWQg4oCUIHRoZSBjb25zdW1lciBMTE0gY2FuXG4gICAgLy8gZWl0aGVyIHdvcmsgZnJvbSB0aGUgcGxhY2Vob2xkZXIgKGFuZCBhc2sgZm9yIHRoZSByZWFsIG9uZSkgb3JcbiAgICAvLyBmcm9tIGEgdXNlci1jdXN0b21pemVkIGNvcHkuIFRoZSBzZXR0aW5ncyBVSSBmbGFncyB0aGlzIGJhbm5lci1cbiAgICAvLyBzdHlsZSB3aGVuIHRoZSB2YWx1ZSBzdGlsbCBtYXRjaGVzIHRoZSB0ZW1wbGF0ZSBzbyB0aGUgdXNlclxuICAgIC8vIGtub3dzIHRvIGZpbGwgaXQgaW4uXG4gICAgZGVzaWduTWQ6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIHRoZSByZWNlaXZlciBzaG91bGQgcmVhZCBERVNJR04ubWQgZnJvbS4gRGVmYXVsdHNcbiAgICAvLyB0byBgfi8uYWdlbnRzL0RFU0lHTi5tZGA7IHVzZXIgY2FuIG92ZXJyaWRlIHBlci1tYWNoaW5lLlxuICAgIGRlc2lnblBhdGg6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIG9mIHRoZSBQaW5jaEdyYWIgVUkgc2tpbGwgb24gdGhlIHJlY2VpdmVyJ3NcbiAgICAvLyBmaWxlc3lzdGVtLiBUaGUgc2tpbGwgY29udGVudCBpdHNlbGYgaXMgYnVuZGxlZCBpbmxpbmUgaW50byB0aGVcbiAgICAvLyBhcmNoaXZlIChzZWUgYHNraWxsTWRgKSwgc28gdGhpcyBpcyBhIGhpbnQgZm9yIHJlY2VpdmVycyB0aGF0XG4gICAgLy8gd2FudCB0byBwZXJzaXN0IHRoZSBza2lsbCBhdCBhIGNhbm9uaWNhbCBsb2NhdGlvbi5cbiAgICBza2lsbFBhdGg6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgVUktc2tpbGwgY29udGVudC4gRGVmYXVsdCBpcyB0aGUgYnVuZGxlZCBQaW5jaEdyYWIgdHJpYWdlXG4gICAgLy8gc2tpbGwgdGVtcGxhdGU7IHVzZXIgY2FuIGN1c3RvbWl6ZSB2aWEgc2V0dGluZ3MgcGFzdGUvdXBsb2FkLlxuICAgIC8vIEJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSBhdCBgLi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgLlxuICAgIHNraWxsTWQ6IHN0cmluZztcbiAgICAvLyBXaGVuIHRydWUsIGZpcmUgYSBmcmVzaCBwYWdlIHNjcmVlbnNob3Qgb24gRVZFUlkgY2FwdHVyZSByYXRoZXJcbiAgICAvLyB0aGFuIG9uY2UgcGVyICh3b3Jrc3BhY2UsIHVybCkgdHVwbGUuIFVzZWZ1bCBmb3IgY2FwdHVyaW5nIGFcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3cgd2hlcmUgdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzLlxuICAgIC8vIERlZmF1bHQgZmFsc2Ug4oCUIG1vc3QgdXNlcnMgd2FudCB0aGUgZGVmYXVsdCBmaXJzdC1vbmx5IGJlaGF2aW9yXG4gICAgLy8gc2luY2UgcGFnZSBzY3JlZW5zaG90cyBhcmUgbGFyZ2UgYW5kIHRoZSBmaXJzdCBvbmUgYWxyZWFkeSBnaXZlc1xuICAgIC8vIGEgc2Vzc2lvbi1sZXZlbCByZWZlcmVuY2UuXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBib29sZWFuO1xuICB9O1xuICBjb25zdCBERUZBVUxUX1BSRUZTOiBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiB0cnVlLFxuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IHRydWUsXG4gICAgaW5jbHVkZVN0eWxlczogdHJ1ZSxcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IHRydWUsXG4gICAgdXNlU2NyZWVuc2hvdHM6IHRydWUsXG4gICAgc3BhY2luZ092ZXJsYXk6IGZhbHNlLFxuICAgIGhvdmVyU25hcDogdHJ1ZSxcbiAgICBhdXRvU2NyZWVuc2hvdDogdHJ1ZSxcbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiAnJyxcbiAgICAvLyBkZXNpZ25NZCAvIHNraWxsTWQgZGVmYXVsdCB0byAnJyB3aGljaCB0aGUgcmVzb2x2ZXIgdHJlYXRzIGFzXG4gICAgLy8gXCJmYWxsIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUgYXQgZXhwb3J0IHRpbWVcIi4gU3RvcmluZyB0aGVcbiAgICAvLyBlbXB0eSBzdHJpbmcga2VlcHMgY2hyb21lLnN0b3JhZ2Ugc21hbGwgYW5kIGxldHMgYGlzVXNpbmdUZW1wbGF0ZSpgXG4gICAgLy8gYmUgYSBjaGVhcCBzeW5jaHJvbm91cyBjaGVjay5cbiAgICBkZXNpZ25NZDogJycsXG4gICAgZGVzaWduUGF0aDogJ34vLmFnZW50cy9ERVNJR04ubWQnLFxuICAgIHNraWxsUGF0aDogJ34vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICBza2lsbE1kOiAnJyxcbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGZhbHNlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nfTtcblxuICBsZXQgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gIGxldCBsaXZlVGFiVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxpdmVUYWJQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2VsZWN0b3JWYWxpZGl0eSA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuIHwgJ2RpZmYtcGFnZSc+KCk7XG4gIGNvbnN0IHNlbGVjdG9yRXJyb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgaW5zZXJ0QmVmb3JlOiB7Y3VycmVudDogc3RyaW5nIHwgbnVsbDsgY29tbWVudDogYm9vbGVhbn0gPSB7Y3VycmVudDogbnVsbCwgY29tbWVudDogZmFsc2V9O1xuICBsZXQgc2VhcmNoUXVlcnkgPSAnJztcbiAgbGV0IGxhc3RBY3RpdmVTZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdGlja3lUaW1lciA9IDA7XG4gIGxldCBTVElDS1lfVFRMX01TID0gNV8wMDA7XG4gIGxldCBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgbGV0IHBoYW50b21UYXJnZXQ6IHtzZWxlY3Rvcjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyB0YWc/OiBzdHJpbmc7IHJlY3Q/OiBET01SZWN0fSB8IG51bGwgPSBudWxsO1xuICBsZXQgcGVuZGluZ011bHRpOiBFbnRyeVtdID0gW107XG4gIGNvbnN0IHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIHBlciBzZWxlY3Rvci4gTk9UIHBlcnNpc3RlZCB0b1xuICAvLyBjaHJvbWUuc3RvcmFnZSAoY2FwIHByZXNzdXJlIOKAlCAxMDAgY2FwdHVyZXMgw5cgODAgS0IgZWFjaCA9IDggTUIpLCBzb1xuICAvLyBpdCdzIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBzZXNzaW9uJ3MgYXJjaGl2ZSBleHBvcnQuIENsZWFyZWRcbiAgLy8gb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgY29uc3Qgc2hvdHNGdWxsID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gVHJhY2sgd2hpY2ggKHdvcmtzcGFjZSwgcGFnZS11cmwpIHR1cGxlcyBhbHJlYWR5IGZpcmVkIGEgcGFnZSBzaG90IHNvIHdlXG4gIC8vIGRvbid0IHJlLXNob290IHRoZSBlbnRpcmUgcGFnZSBvbiBldmVyeSBjYXB0dXJlLiBSZXNldCBvbiB3b3Jrc3BhY2VcbiAgLy8gc3dpdGNoIOKAlCBubyBkYXkga2V5LCB0aGUgZGVkdXBlIGlzIHBlci1zZXNzaW9uLlxuICBjb25zdCBwYWdlU2hvdHNGaXJlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBwYWdlU2hvdEtleSA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiBgJHthY3RpdmVXc306JHt1cmx9YDtcbiAgLy8gTGFzdCBzdWNjZXNzZnVsIGV4cG9ydCDigJQgYm90aCB0aGUgd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKHNob3duIHRvIHRoZVxuICAvLyB1c2VyKSBhbmQgdGhlIE9TLWFic29sdXRlIHBhdGggKGNvcGllZCBieSB0aGUgXCJDb3B5IGFzIHBhdGhcIiBidXR0b24pLlxuICAvLyBVcGRhdGVkIG9uIEpTT05ML01EL1pJUC9zY3JlZW5zaG90IHNhdmVzLlxuICBjb25zdCBsYXN0RXhwb3J0OiB7cmVsUGF0aDogc3RyaW5nIHwgbnVsbDsgYWJzUGF0aDogc3RyaW5nIHwgbnVsbDsgY29weVBhdGg6IHN0cmluZyB8IG51bGw7IHRlbXBQYXRoOiBib29sZWFuOyBraW5kOiBzdHJpbmcgfCBudWxsfSA9IHtcbiAgICByZWxQYXRoOiBudWxsLCBhYnNQYXRoOiBudWxsLCBjb3B5UGF0aDogbnVsbCwgdGVtcFBhdGg6IGZhbHNlLCBraW5kOiBudWxsLFxuICB9O1xuICBsZXQgd29ya3NwYWNlczogV29ya3NwYWNlW10gPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgbGV0IGFjdGl2ZVdzID0gJ2RlZmF1bHQnO1xuICAvLyBTZXNzaW9uIHV1aWQg4oCUIGdlbmVyYXRlZCBvbmNlIHBlciB3b3Jrc3BhY2UgYm9vdC4gR29lcyBvbnRvIGV2ZXJ5XG4gIC8vIHBhZ2Ugcm93IGFuZCBldmVyeSBzZWxlY3RvciBlbnRyeSBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzXG4gIC8vIHRvIFwid2hpY2ggc2Vzc2lvbj9cIiB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS4gU3RhYmxlIGFjcm9zcyBhXG4gIC8vIHNpbmdsZSB3b3Jrc3BhY2UgbG9hZDsgcmVzZXRzIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGxldCBzZXNzaW9uSWQ6IHN0cmluZyA9ICcnO1xuICBjb25zdCB3c01zZ0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259Lm1lc3NhZ2VzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0Z1bGxLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90c0Z1bGwudjFgO1xuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBoYXMgYSAxMCBNQiBkZWZhdWx0IHF1b3RhOyB3ZSBidWRnZXQgaGFsZiBvZlxuICAvLyB0aGF0IGZvciBmdWxsLXJlc29sdXRpb24gUE5HcyAodGhlIHJlc3QgaXMgbWVzc2FnZXMsIHByZWZzLCB0aHVtYnMpLlxuICAvLyBXaGVuIHRoZSBidWRnZXQgaXMgcmVhY2hlZCB3ZSBGSUZPLWV2aWN0IHRoZSBvbGRlc3QgZW50cmllcyAoTWFwXG4gIC8vIHByZXNlcnZlcyBpbnNlcnRpb24gb3JkZXIpLiBFc3RpbWF0ZSBkYXRhVVJMIHNpemUgPSBzdHJpbmcgbGVuZ3RoLlxuICBjb25zdCBTSE9UU19GVUxMX0JVREdFVF9CWVRFUyA9IDUgKiAxMDI0ICogMTAyNDtcbiAgY29uc3QgdW5kb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCByZWRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFVORE9fQ0FQID0gMzA7XG4gIGxldCBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gIGxldCBwcmVmczogUHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGU307XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXR1cyBoZWxwZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzdGF0dXNUaW1lciA9IDA7XG4gIGNvbnN0IHNldFN0YXR1cyA9IChtc2c6IHN0cmluZywgb3B0czoge2tpbmQ/OiAnd2FybicgfCAnaW5mbycgfCAnb2snfSA9IHt9KTogdm9pZCA9PiB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gbXNnIHx8ICcnO1xuICAgIGNsZWFyVGltZW91dChzdGF0dXNUaW1lcik7XG4gICAgaWYgKG1zZykge1xuICAgICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gb3B0cy5raW5kID09PSAnd2FybicgPyAndmFyKC0tcmVkKScgOlxuICAgICAgICBvcHRzLmtpbmQgPT09ICdpbmZvJyA/ICd2YXIoLS10ZXh0LTMpJyA6ICd2YXIoLS1ncmVlbiknO1xuICAgICAgc3RhdHVzVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHN0YXR1cy50ZXh0Q29udGVudCA9ICcnOyB9LCAyMjAwKTtcbiAgICB9XG4gIH07XG4gIGxldCB0b2FzdFRpbWVyID0gMDtcbiAgY29uc3Qgc2hvd1RvYXN0ID0gKHRpdGxlOiBzdHJpbmcsIGRldGFpbCA9ICcnLCBraW5kOiAnb2snIHwgJ3dhcm4nID0gJ29rJyk6IHZvaWQgPT4ge1xuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1jb3B5LXRvYXN0XScpO1xuICAgIGlmICghdG9hc3QpIHtcbiAgICAgIHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAnY29weS10b2FzdCc7XG4gICAgICB0b2FzdC5kYXRhc2V0LmNvcHlUb2FzdCA9ICd0cnVlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRvYXN0KTtcbiAgICB9XG4gICAgdG9hc3QuY2xhc3NMaXN0LnRvZ2dsZSgnd2FybicsIGtpbmQgPT09ICd3YXJuJyk7XG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC1pY29uXCI+JHtQR19JQ09OUy5zdmdTdHJpbmcoa2luZCA9PT0gJ3dhcm4nID8gJ2FsZXJ0LWNpcmNsZScgOiAnY2lyY2xlLWNoZWNrJywgMjIpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC10ZXh0XCI+PGI+JHtlc2NhcGVIdG1sKHRpdGxlKX08L2I+JHtkZXRhaWwgPyBgPHNtYWxsPiR7ZXNjYXBlSHRtbChkZXRhaWwpfTwvc21hbGw+YCA6ICcnfTwvc3Bhbj5gO1xuICAgIHRvYXN0LmhpZGRlbiA9IGZhbHNlO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB2b2lkIHRvYXN0Lm9mZnNldFdpZHRoO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcik7XG4gICAgdG9hc3RUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRvYXN0Py5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IGlmICh0b2FzdCkgdG9hc3QuaGlkZGVuID0gdHJ1ZTsgfSwgMTgwKTtcbiAgICB9LCAxNDUwKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0NvcGllZCA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWwgPSAnJyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICdvaycpO1xuICBjb25zdCBzaG93RG93bmxvYWRFcnJvciA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWw6IHN0cmluZyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICd3YXJuJyk7XG5cbiAgLy8g4pSA4pSA4pSAIFV0aWxpdGllcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgbXNnSWQgPSAoKTogc3RyaW5nID0+XG4gICAgY3J5cHRvPy5yYW5kb21VVUlEID8gY3J5cHRvLnJhbmRvbVVVSUQoKSA6XG4gICAgICAnaWRfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpICsgRGF0ZS5ub3coKS50b1N0cmluZygzNik7XG4gIGNvbnN0IGVzY2FwZUh0bWwgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgU3RyaW5nKHMpLnJlcGxhY2VBbGwoJyYnLCAnJmFtcDsnKS5yZXBsYWNlQWxsKCc8JywgJyZsdDsnKS5yZXBsYWNlQWxsKCc+JywgJyZndDsnKTtcbiAgY29uc3QgZXNjYXBlUmUgPSAoczogc3RyaW5nKTogc3RyaW5nID0+IHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbiAgY29uc3QgaGlnaGxpZ2h0TWF0Y2ggPSAodGV4dDogc3RyaW5nLCBxOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCk7XG4gICAgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKGAoJHtlc2NhcGVSZShxKX0pYCwgJ2dpJyksICc8bWFyaz4kMTwvbWFyaz4nKTtcbiAgfTtcbiAgLy8gV2FsayB0ZXh0IG5vZGVzIGluc2lkZSBgcm9vdGAsIHdyYXBwaW5nIGNhc2UtaW5zZW5zaXRpdmUgbWF0Y2hlcyBvZiBgcWBcbiAgLy8gaW4gPG1hcms+IGVsZW1lbnRzLiBEb2Vzbid0IHRvdWNoIGF0dHJpYnV0ZSBzdHJpbmdzIG9yIGlubmVyLXRhZyBIVE1MIHNvXG4gIC8vIGl0J3Mgc2FmZSB0byBydW4gb24gYWxyZWFkeS1oaWdobGlnaHRlZCBKU09OIG91dHB1dC5cbiAgY29uc3Qgd3JhcFNlYXJjaEhpdHNJblRleHROb2RlcyA9IChyb290OiBIVE1MRWxlbWVudCwgcTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm47XG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKGVzY2FwZVJlKHEpLCAnZ2knKTtcbiAgICBjb25zdCB3YWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKHJvb3QsIE5vZGVGaWx0ZXIuU0hPV19URVhUKTtcbiAgICBjb25zdCB0YXJnZXRzOiBUZXh0W10gPSBbXTtcbiAgICBsZXQgbm9kZTogTm9kZSB8IG51bGw7XG4gICAgd2hpbGUgKChub2RlID0gd2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICBpZiAocmUudGVzdChub2RlLm5vZGVWYWx1ZSA/PyAnJykpIHRhcmdldHMucHVzaChub2RlIGFzIFRleHQpO1xuICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9XG4gICAgZm9yIChjb25zdCB0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdC5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgbGV0IGxhc3QgPSAwO1xuICAgICAgZm9yIChjb25zdCBtIG9mIHZhbHVlLm1hdGNoQWxsKHJlKSkge1xuICAgICAgICBjb25zdCBpID0gbS5pbmRleCA/PyAwO1xuICAgICAgICBpZiAoaSA+IGxhc3QpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QsIGkpKTtcbiAgICAgICAgY29uc3QgbWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYXJrJyk7XG4gICAgICAgIG1rLnRleHRDb250ZW50ID0gbVswXTtcbiAgICAgICAgZnJhZy5hcHBlbmQobWspO1xuICAgICAgICBsYXN0ID0gaSArIG1bMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGxhc3QgPCB2YWx1ZS5sZW5ndGgpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QpKTtcbiAgICAgIHQucmVwbGFjZVdpdGgoZnJhZyk7XG4gICAgfVxuICB9O1xuICBjb25zdCB3b3JkQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IChzLm1hdGNoKC9cXFMrL2cpID8/IFtdKS5sZW5ndGg7XG4gIGNvbnN0IHRva2VuQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IE1hdGguY2VpbChzLmxlbmd0aCAvIDQpO1xuICBjb25zdCBwYXRoT2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkucGF0aG5hbWU7IH0gY2F0Y2ggeyByZXR1cm4gdTsgfSB9O1xuICBjb25zdCBob3N0T2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkuaG9zdDsgfSBjYXRjaCB7IHJldHVybiAnJzsgfSB9O1xuICAvLyBGaWxlbmFtZS1zYWZlIGhvc3Qgc2x1ZzogZG90cyDihpIgdW5kZXJzY29yZXMgcGVyIHByb2plY3QgY29udmVudGlvbi5cbiAgLy8gTWlycm9ycyBiYWNrZ3JvdW5kLnRzIGhvc3RTbHVnIGZvciBzeW1tZXRyeSBhY3Jvc3Mgc2NyZWVuc2hvdCArIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMuXG4gIGNvbnN0IGhvc3RTbHVnID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBoID0gaG9zdE9mKHVybCk7XG4gICAgaWYgKCFoKSByZXR1cm4gJ3Vua25vd24nO1xuICAgIHJldHVybiBoLnJlcGxhY2UoL1xcLi9nLCAnXycpLnJlcGxhY2UoL1teXFx3LV0vZywgJ18nKS5zbGljZSgwLCA0MCkgfHwgJ3Vua25vd24nO1xuICB9O1xuICAvLyBQaWNrIHRoZSBtb3N0LWZyZXF1ZW50IGhvc3QgYWNyb3NzIGFsbCBzZWxlY3RvciBjYXB0dXJlcyAoZm9yIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMpLiBXaGVuIHRoZSB3b3Jrc3BhY2Ugc3BhbnMgbXVsdGlwbGUgaG9zdHMsIHJldHVybiAnbXVsdGknLlxuICBjb25zdCBkb21pbmFudEhvc3RTbHVnID0gKCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgY291bnRzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RTbHVnKG0uZW50cnkudXJsKTtcbiAgICAgIGNvdW50cy5zZXQoaCwgKGNvdW50cy5nZXQoaCkgPz8gMCkgKyAxKTtcbiAgICB9XG4gICAgaWYgKCFjb3VudHMuc2l6ZSkgcmV0dXJuICdlbXB0eSc7XG4gICAgbGV0IGJlc3QgPSAnJztcbiAgICBsZXQgYmVzdE4gPSAwO1xuICAgIGZvciAoY29uc3QgW2gsIG5dIG9mIGNvdW50cykge1xuICAgICAgaWYgKG4gPiBiZXN0TikgeyBiZXN0ID0gaDsgYmVzdE4gPSBuOyB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudHMuc2l6ZSA+IDEgPyAnbXVsdGknIDogYmVzdDtcbiAgfTtcbiAgLy8gRGlzdGluY3QgaG9zdHMgcHJlc2VudCBpbiB0aGlzIHdvcmtzcGFjZSAoYWxwaGFiZXRpY2FsLCBjYXBwZWQpLiBVc2VkIGluXG4gIC8vIHRoZSBleHBvcnQgbWFuaWZlc3QncyBgaG9zdHNgIGZpZWxkLlxuICBjb25zdCBkaXN0aW5jdEhvc3RzID0gKCk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBzZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RPZihtLmVudHJ5LnVybCk7XG4gICAgICBpZiAoaCkgc2V0LmFkZChoKTtcbiAgICB9XG4gICAgcmV0dXJuIFsuLi5zZXRdLnNvcnQoKS5zbGljZSgwLCAyMCk7XG4gIH07XG4gIC8vIEJ1aWxkIGEgZmlsZW5hbWUgb2YgdGhlIHNoYXBlIGBwaW5jaGdyYWItPHdvcmtzcGFjZT4tPGhvc3Q+LTxlcG9jaD4uPGV4dD5gLlxuICBjb25zdCBidWlsZEV4cG9ydEZpbGVuYW1lID0gKGV4dDogJ2pzb25sJyB8ICdtZCcgfCAndGFyLnpzdCcpOiBzdHJpbmcgPT5cbiAgICBgcGluY2hncmFiLSR7YWN0aXZlV3N9LSR7ZG9taW5hbnRIb3N0U2x1ZygpfS0ke0RhdGUubm93KCl9LiR7ZXh0fWA7XG4gIC8vIFNraXAtbGlzdCBtYXRjaDogc3Vic3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSBtYXRjaCBhZ2FpbnN0IHRoZSBVUkwnc1xuICAvLyBob3N0LiBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBVUkwgcGFyc2luZyBvbiB0aGUgcGF0dGVybnMgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHdyaXRlIGB3cmFubmdsZS5jb21gIGFuZCBoYXZlIGl0IG1hdGNoIGBhcHAud3Jhbm5nbGUuY29tYCB0b28uXG4gIGNvbnN0IHNob3VsZFNraXBTY3JlZW5zaG90ID0gKHVybDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgbGlzdCA9IChwcmVmcy5za2lwU2NyZWVuc2hvdEhvc3RzID8/ICcnKS5zcGxpdCgnLCcpLm1hcCgocykgPT4gcy50cmltKCkudG9Mb3dlckNhc2UoKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0ID0gaG9zdE9mKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGlzdC5zb21lKChwYXQpID0+IGhvc3QuaW5jbHVkZXMocGF0KSk7XG4gIH07XG5cbiAgLy8gSlNPTiBzeW50YXggaGlnaGxpZ2h0IChwZXIta2V5IGNvbG9yIGlzIGhhc2hlZCBmb3IgdmlzdWFsIHZhcmlldHkpLlxuICBjb25zdCBLRVlfUEFMRVRURSA9IFsnI2ZmN2U3OCcsICcjZmZiNDU0JywgJyNmZmUwNjYnLCAnIzdiZDk3YScsICcjNWZkMWZmJywgJyM5YjhjZmYnLCAnI2ZmODVjMScsICcjZmY1ZjAwJywgJyMxMGI5ODEnLCAnI2Y1OWUwYicsICcjYTc4YmZhJywgJyMzNGQzOTknXTtcbiAgY29uc3QgY29sb3JGb3JLZXkgPSAoazogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgaCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIGsuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gICAgcmV0dXJuIEtFWV9QQUxFVFRFW2ggJSBLRVlfUEFMRVRURS5sZW5ndGhdITtcbiAgfTtcbiAgY29uc3QgSlNPTl9UT0tFTl9SRSA9IC8oXFxzKyl8KFwiKD86W15cIlxcXFxdfFxcXFwuKSpcIil8KHRydWV8ZmFsc2V8bnVsbCl8KC0/XFxkKyg/OlxcLlxcZCspPyg/OltlRV1bKy1dP1xcZCspPyl8KFt7fVtcXF0sOl0pL2c7XG4gIGNvbnN0IGhpZ2hsaWdodEpzb24gPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgb3V0ID0gJyc7XG4gICAgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gICAgSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IEpTT05fVE9LRU5fUkUuZXhlYyh0ZXh0KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IFssIHdzLCBzdHIsIGxpdCwgbnVtLCBwdW5jdF0gPSBtO1xuICAgICAgaWYgKHdzKSB7IG91dCArPSBlc2NhcGVIdG1sKHdzKTsgY29udGludWU7IH1cbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgbGV0IGsgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgICAgd2hpbGUgKGsgPCB0ZXh0Lmxlbmd0aCAmJiAodGV4dFtrXSA9PT0gJyAnIHx8IHRleHRba10gPT09ICdcXHQnIHx8IHRleHRba10gPT09ICdcXG4nKSkgaysrO1xuICAgICAgICBpZiAodGV4dFtrXSA9PT0gJzonKSB7XG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuICAgICAgICAgIHRyeSB7IGtleSA9IEpTT04ucGFyc2Uoc3RyKSBhcyBzdHJpbmc7IH0gY2F0Y2ggeyBrZXkgPSBzdHIuc2xpY2UoMSwgLTEpOyB9XG4gICAgICAgICAgb3V0ICs9IGA8c3BhbiBjbGFzcz1cImtcIiBzdHlsZT1cImNvbG9yOiR7Y29sb3JGb3JLZXkoa2V5KX1cIj4ke2VzY2FwZUh0bWwoc3RyKX08L3NwYW4+YDtcbiAgICAgICAgfSBlbHNlIHsgb3V0ICs9IGA8c3BhbiBjbGFzcz1cInNcIj4ke2VzY2FwZUh0bWwoc3RyKX08L3NwYW4+YDsgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsaXQpIHsgb3V0ICs9IGA8c3BhbiBjbGFzcz1cImJcIj4ke2xpdH08L3NwYW4+YDsgY29udGludWU7IH1cbiAgICAgIGlmIChudW0pIHsgb3V0ICs9IGA8c3BhbiBjbGFzcz1cIm5cIj4ke251bX08L3NwYW4+YDsgY29udGludWU7IH1cbiAgICAgIGlmIChwdW5jdCkgeyBvdXQgKz0gYDxzcGFuIGNsYXNzPVwicFwiPiR7ZXNjYXBlSHRtbChwdW5jdCl9PC9zcGFuPmA7IGNvbnRpbnVlOyB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlcnNpc3RlbmNlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBsb2FkQWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHdvcmtzcGFjZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVtdPihXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcykpIHx8IHdvcmtzcGFjZXM7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmxlbmd0aCkgd29ya3NwYWNlcyA9IFt7bmFtZTogJ2RlZmF1bHQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dO1xuICAgIGFjdGl2ZVdzID0gKGF3YWl0IFN0b3JlLmdldDxzdHJpbmc+KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgJ2RlZmF1bHQnKSkgfHwgJ2RlZmF1bHQnO1xuICAgIGlmICghd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IGFjdGl2ZVdzKSkgYWN0aXZlV3MgPSB3b3Jrc3BhY2VzWzBdIS5uYW1lO1xuICAgIHByZWZzID0gey4uLkRFRkFVTFRfUFJFRlMsIC4uLihhd2FpdCBTdG9yZS5nZXQ8UGFydGlhbDxQcmVmcz4+KFBSRUZTX0tFWSwge30pKX07XG4gICAgLy8gUGF0aCBtaWdyYXRpb246IHByaW9yIHZlcnNpb25zIGRlZmF1bHRlZCBza2lsbFBhdGggdG9cbiAgICAvLyBgfi8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAsIGFuZCBzb21lIHVzZXJzIGhhZCBpdCBzdG9yZWQgYXNcbiAgICAvLyBgfi8uZG90ZmlsZXMvLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLiBUaGUgc2tpbGwgd2FzIHJlbmFtZWRcbiAgICAvLyB0byBgUGluY2hHcmFiYDsgYW55IGB+Ly5kb3RmaWxlcy9gIHByZWZpeCBpcyBzdHJpcHBlZCBmcm9tXG4gICAgLy8gZXhwb3NlZCBkZWZhdWx0cyAoZG90ZmlsZXMgaXMgYSBwZXJzb25hbCBjb25maWcgc291cmNlIOKAlCBleHBvcnRzXG4gICAgLy8gc2hvdWxkbid0IGxlYWsgdGhhdCBwYXRoKS5cbiAgICBjb25zdCB1cGdyYWRlUGF0aCA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQsIGZyZXNoOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgaWYgKCFwKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5pbmNsdWRlcygnLmRvdGZpbGVzJykpIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmVuZHNXaXRoKCdza2lsbHMvdWkvU0tJTEwubWQnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25QYXRoID0gdXBncmFkZVBhdGgocHJlZnMuZGVzaWduUGF0aCwgREVGQVVMVF9QUkVGUy5kZXNpZ25QYXRoKTtcbiAgICBwcmVmcy5za2lsbFBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5za2lsbFBhdGgsIERFRkFVTFRfUFJFRlMuc2tpbGxQYXRoKTtcbiAgICAvLyBDb250ZW50IG1pZ3JhdGlvbjogcHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHRoZSBlbnRpcmUgdGVtcGxhdGVcbiAgICAvLyB0ZXh0IGluc2lkZSBgcHJlZnMuZGVzaWduTWRgIC8gYHByZWZzLnNraWxsTWRgIGFzIGRlZmF1bHRzLiBUaGF0XG4gICAgLy8gYXRlIH4zNjBLQiBvZiBjaHJvbWUuc3RvcmFnZSBxdW90YSBmb3Igbm8gYmVuZWZpdC4gRGV0ZWN0IHdoZW5cbiAgICAvLyB0aGUgc3RvcmVkIHZhbHVlIG1hdGNoZXMgb25lIG9mIHRoZSBidW5kbGVkIHRlbXBsYXRlcyBhbmQgY2xlYXJcbiAgICAvLyBpdCDigJQgdGhlIHJlc29sdmVyIGZhbGxzIGJhY2sgdG8gdGhlIGJ1bmRsZWQgZmlsZSBvbiB0aGUgZmx5LlxuICAgIC8vIEFsc28gc2NydWIgYW55IGxlYWtlZCBgfi8uZG90ZmlsZXMvYCBzdWJzdHJpbmcuXG4gICAgY29uc3Qgc2NydWJEb3RmaWxlcyA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgIHMucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvLmFnZW50cy8nLCAnfi8uYWdlbnRzLycpXG4gICAgICAgLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLycsICd+Ly5hZ2VudHMvJyk7XG4gICAgY29uc3QgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZSA9IGFzeW5jIChjdXJyZW50OiBzdHJpbmcsIGtleXM6IFRlbXBsYXRlS2V5W10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgaWYgKCFjdXJyZW50IHx8ICFjdXJyZW50LnRyaW0oKSkgcmV0dXJuICcnO1xuICAgICAgY29uc3QgdHJpbW1lZCA9IGN1cnJlbnQudHJpbSgpO1xuICAgICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgdHBsID0gKGF3YWl0IGxvYWRUZW1wbGF0ZShrKSkudHJpbSgpO1xuICAgICAgICBpZiAodHBsICYmIHRwbCA9PT0gdHJpbW1lZCkgcmV0dXJuICcnOyAvLyBtYXRjaGVzIGEgYnVuZGxlZCB0ZW1wbGF0ZSDigJQgY29sbGFwc2UgdG8gZW1wdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJyZW50LmluY2x1ZGVzKCcuZG90ZmlsZXMnKSA/IHNjcnViRG90ZmlsZXMoY3VycmVudCkgOiBjdXJyZW50O1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLmRlc2lnbk1kID8/ICcnLCBbJ2xvY2FsRGVzaWduJywgJ2Rlc2lnblRlbXBsYXRlJ10pO1xuICAgIHByZWZzLnNraWxsTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLnNraWxsTWQgPz8gJycsIFsnbG9jYWxTa2lsbCcsICdza2lsbFRlbXBsYXRlJ10pO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UoYWN0aXZlV3MpO1xuICB9O1xuICBjb25zdCBsb2FkV29ya3NwYWNlID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGFjdGl2ZVdzID0gbmFtZTtcbiAgICB2b2lkIFN0b3JlLnNldCgncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsIG5hbWUpO1xuICAgIC8vIE1pbnQgYSBuZXcgc2Vzc2lvbklkIHBlciB3b3Jrc3BhY2UgbG9hZC4gU2FtZSB3b3Jrc3BhY2UgcmUtb3BlbmVkXG4gICAgLy8gPSBuZXcgc2Vzc2lvbjogZGlzdGluY3QgdXVpZCBzbyBhIGNvbnN1bWVyIGNhbiB0ZWxsIHR3byBib290c1xuICAgIC8vIGFwYXJ0IGV2ZW4gd2hlbiB0aGUgY2FwdHVyZXMgbGFuZCBpbiB0aGUgc2FtZSBvbi1kaXNrIGZpbGUuXG4gICAgc2Vzc2lvbklkID0gbXNnSWQoKTtcbiAgICBtZXNzYWdlcyA9IChhd2FpdCBTdG9yZS5nZXQ8UGFuZWxNZXNzYWdlW10+KHdzTXNnS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIG1lc3NhZ2VzID0gW107XG4gICAgLy8gTWlncmF0ZSBsZWdhY3kgZW50cmllcyAobm8gdWlkLCBzdGF0ZXMtYXMtcmVjb3JkLCBhdHRycy5mb3JtYXQpIGFuZFxuICAgIC8vIHBlcnNpc3QgaWYgYW55dGhpbmcgY2hhbmdlZCBzbyB3ZSBkb24ndCBwYXkgdGhlIG1pZ3JhdGlvbiBjb3N0IGFnYWluXG4gICAgLy8gbmV4dCBsb2FkLlxuICAgIGlmIChtaWdyYXRlTG9hZGVkTWVzc2FnZXMoKSkgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkobmFtZSksIG1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBhZ2VTaG90c0ZpcmVkLmNsZWFyKCk7XG4gICAgY29uc3Qgc3RvcmVkID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZCkpIHNob3RzLnNldChrLCB2KTtcbiAgICAvLyBSZXN0b3JlIHRoZSBmdWxsLXJlc29sdXRpb24gUE5HIGNhY2hlIHNvIGEgd29ya3NwYWNlIGFyY2hpdmVcbiAgICAvLyBleHBvcnRlZCBBRlRFUiBhIHBhbmVsIHJlbG9hZCBzdGlsbCBidW5kbGVzIHNjcmVlbnNob3RzIGZyb21cbiAgICAvLyBlYXJsaWVyIGNhcHR1cmVzLiBGSUZPIG9yZGVyIGlzIHByZXNlcnZlZCBieSBPYmplY3Qga2V5IG9yZGVyLlxuICAgIGNvbnN0IHN0b3JlZEZ1bGwgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNGdWxsS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZEZ1bGwpKSBzaG90c0Z1bGwuc2V0KGssIHYpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBzZWxlY3RvckVycm9ycy5jbGVhcigpO1xuICAgIHVuZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBudWxsO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3QgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkoYWN0aXZlV3MpLCBtZXNzYWdlcyk7XG4gICAgLy8gUHVzaCBjYXB0dXJlZC1zZWxlY3RvciBzZXQgc28gdGhlIGNvbnRlbnQgc2NyaXB0J3MgaG92ZXIgd2Fsa2VyIGNhblxuICAgIC8vIHJlc29sdmUgZGVzY2VuZGFudHMg4oaSIGNhcHR1cmVkIGFuY2VzdG9yLlxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBzZW5kVG9DUyh7a2luZDogJ3NldC1jYXB0dXJlZCcsIHNlbGVjdG9yc30pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0UHJlZnMgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQoUFJFRlNfS0VZLCBwcmVmcyk7XG4gICAgLy8gUHVzaCB0aGUgc3Vic2V0IG9mIHByZWZzIHRoZSBjb250ZW50IHNjcmlwdCBjYXJlcyBhYm91dCBzbyBpdHNcbiAgICAvLyBvdmVybGF5IChzcGFjaW5nIHZpc3VhbGl6ZXIsIGhvdmVyIHNuYXAsIGV0Yy4pIHJlZmxlY3RzIHRoZSBsYXRlc3QuXG4gICAgdm9pZCBzZW5kVG9DUyh7XG4gICAgICBraW5kOiAnc2V0LWNzLXByZWZzJyxcbiAgICAgIHNwYWNpbmdPdmVybGF5OiBwcmVmcy5zcGFjaW5nT3ZlcmxheSxcbiAgICAgIGhvdmVyU25hcDogcHJlZnMuaG92ZXJTbmFwLFxuICAgIH0pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHMpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0tleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgcGVyc2lzdGVuY2Ugd2l0aCBGSUZPIGV2aWN0aW9uLiBkYXRhVVJMIHN0cmluZ3NcbiAgLy8gY2FuIHJ1biA1MC01MDAgS0IgZWFjaDsgdGhlIGRlZmF1bHQgcXVvdGEgZ2V0cyBleGhhdXN0ZWQgaW4gdGVucyBvZlxuICAvLyBjYXB0dXJlcyB3aXRob3V0IGEgYnVkZ2V0LiBNYXAgaW5zZXJ0aW9uIG9yZGVyID0gRklGTyBvcmRlciwgc29cbiAgLy8gd2UgZXZpY3QgZnJvbSB0aGUgZnJvbnQgdW50aWwgdW5kZXIgYnVkZ2V0IGJlZm9yZSBwZXJzaXN0aW5nLlxuICBjb25zdCBldmljdFNob3RzRnVsbFRvQnVkZ2V0ID0gKCk6IG51bWJlciA9PiB7XG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2hvdHNGdWxsLnZhbHVlcygpKSB0b3RhbCArPSB2Lmxlbmd0aDtcbiAgICBsZXQgZXZpY3RlZCA9IDA7XG4gICAgd2hpbGUgKHRvdGFsID4gU0hPVFNfRlVMTF9CVURHRVRfQllURVMpIHtcbiAgICAgIGNvbnN0IGZpcnN0S2V5ID0gc2hvdHNGdWxsLmtleXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICBpZiAoZmlyc3RLZXkgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBjb25zdCByZW1vdmVkID0gc2hvdHNGdWxsLmdldChmaXJzdEtleSk7XG4gICAgICBpZiAocmVtb3ZlZCA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIHNob3RzRnVsbC5kZWxldGUoZmlyc3RLZXkpO1xuICAgICAgdG90YWwgLT0gcmVtb3ZlZC5sZW5ndGg7XG4gICAgICBldmljdGVkKys7XG4gICAgfVxuICAgIHJldHVybiBldmljdGVkO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHNGdWxsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGV2aWN0ZWQgPSBldmljdFNob3RzRnVsbFRvQnVkZ2V0KCk7XG4gICAgaWYgKGV2aWN0ZWQgPiAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csIGBzaG90c0Z1bGwgRklGTy1ldmljdGVkICR7ZXZpY3RlZH0gb2xkZXN0IGVudHJpZXMgdG8gZml0ICR7U0hPVFNfRlVMTF9CVURHRVRfQllURVMgLyAxMDI0IC8gMTAyNH1NQiBidWRnZXRgKTtcbiAgICB9XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHNGdWxsKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNGdWxsS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFdvcmtzcGFjZXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKTsgfTtcblxuICAvLyDilIDilIDilIAgU25hcHNob3QgLyB1bmRvIC8gcmVkbyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc25hcHNob3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN1c3BlbmRTbmFwc2hvdHMpIHJldHVybjtcbiAgICBpZiAodW5kb1N0YWNrLmxlbmd0aCA+PSBVTkRPX0NBUCkgdW5kb1N0YWNrLnNoaWZ0KCk7XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZXN0b3JlID0gKGpzb246IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSB0cnVlO1xuICAgIHRyeSB7IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShqc29uKSBhcyBQYW5lbE1lc3NhZ2VbXTsgfSBjYXRjaCB7IG1lc3NhZ2VzID0gW107IH1cbiAgICBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICBjb25zdCB1bmRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghdW5kb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gdW5kbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgcmVkb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHVuZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnVW5kb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVkbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXJlZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHJlZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZShyZWRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1JlZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVVuZG9CdXR0b25zID0gKCk6IHZvaWQgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInVuZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCB1bmRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJyZWRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgcmVkb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUNvcHlQYXRoQnV0dG9uID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1hY3Rpb249XCJjb3B5LXBhdGhcIl0nKTtcbiAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgIGNvbnN0IGhhcyA9IEJvb2xlYW4obGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGgpO1xuICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsICFoYXMpO1xuICAgIGJ0bi5kYXRhc2V0LnRpcCA9IGhhc1xuICAgICAgPyBgQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LlxcbiR7bGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGggPz8gJyd9YFxuICAgICAgOiAnQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LiBSdW4gYW4gZXhwb3J0IGZpcnN0Lic7XG4gIH07XG4gIGNvbnN0IG9uQ29weVBhdGggPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoO1xuICAgIGlmICghcGF0aFRvQ29weSkge1xuICAgICAgc2V0U3RhdHVzKCdObyBleHBvcnQgeWV0IOKAlCBydW4gYSBkb3dubG9hZCBmaXJzdCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHBhdGhUb0NvcHkpO1xuICAgICAgLy8gU2hvdyBvbmx5IHRoZSBsZWFmIGZpbGVuYW1lIGluIHRoZSBzdGF0dXMg4oCUIHRoZSBmdWxsIFdpbmRvd3Mtc3R5bGVcbiAgICAgIC8vIGFic29sdXRlIHBhdGggd291bGQgYmUgMTAwKyBjaGFycyBhbmQgd2FzIGRpc3J1cHRpbmcgdGhlIHNpZGViYXJcbiAgICAgIC8vIGxheW91dCBmb3IgdGhlIDItc2Vjb25kIHN0YXR1cyBUVEwuXG4gICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgc2V0U3RhdHVzKGBDb3BpZWQgcGF0aCDCtyAke2xlYWZ9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgcGF0aCcsIGxlYWYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIHdyaXRlIGZhaWxlZDogJyArIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2UgdG8gYWN0aXZlIHRhYiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZFRvQ1MgPSBhc3luYyAocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgbXNnID0gcGcocGF5bG9hZCk7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBpZiAodGFic1swXT8uaWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgbXNnKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IG1zZ30pKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZW5kVG9DU0FuZFdhaXQgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4gbmV3IFByb21pc2U8UiB8IG51bGw+KChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikge1xuICAgICAgY29uc3QgcmVxSWQgPSAncmVxXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTtcbiAgICAgIGNvbnN0IG9uUmVzcCA9IChlOiBFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSAoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsO1xuICAgICAgICBpZiAoZGV0YWlsPy5fX3JlcUlkID09PSByZXFJZCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgICAgIHJlc29sdmUoZGV0YWlsLnJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiB7X19yZXFJZDogcmVxSWQsIC4uLnBnKHBheWxvYWQpfX0pKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTsgcmVzb2x2ZShudWxsKTsgfSwgMTAwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9LCAodGFicykgPT4ge1xuICAgICAgaWYgKCF0YWJzWzBdPy5pZCkgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHBnKHBheWxvYWQpLCAocjogUikgPT4gcmVzb2x2ZShyKSk7XG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBzZW5kVG9CZyA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQmcpOiBQcm9taXNlPFIgfCBudWxsPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHsgcmV0dXJuIChhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShwZyhwYXlsb2FkKSkpIGFzIFI7IH1cbiAgICBjYXRjaCAoZSkgeyByZXR1cm4ge2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBhcyB1bmtub3duIGFzIFI7IH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgUmVjZWl2aW5nIGZyb20gY29udGVudCBzY3JpcHQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIERlZmVuc2l2ZSByaW5nLWJ1ZmZlciBkZWR1cGU6IGV2ZW4gdGhvdWdoIHdlIG5vdyB1c2Ugb25seSBvbmUgY2hhbm5lbCxcbiAgLy8gYW55IG1lc3NhZ2UgdGhhdCBzb21laG93IGFycml2ZXMgdHdpY2Ugd2l0aGluIH4yIHNlY29uZHMgaXMgaWdub3JlZC5cbiAgY29uc3QgcmVjZW50TWlkczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgUkVDRU5UX01JRF9DQVAgPSA2NDtcbiAgY29uc3Qgb25Dc01lc3NhZ2UgPSAobXNnOiBQZ0VudmVsb3BlPENzVG9QYW5lbD4pOiB2b2lkID0+IHtcbiAgICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuO1xuICAgIGlmIChtc2cuX19taWQpIHtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmluY2x1ZGVzKG1zZy5fX21pZCkpIHJldHVybjtcbiAgICAgIHJlY2VudE1pZHMucHVzaChtc2cuX19taWQpO1xuICAgICAgaWYgKHJlY2VudE1pZHMubGVuZ3RoID4gUkVDRU5UX01JRF9DQVApIHJlY2VudE1pZHMuc2hpZnQoKTtcbiAgICB9XG4gICAgc3dpdGNoIChtc2cua2luZCkge1xuICAgICAgY2FzZSAnY2FwdHVyZSc6IG9uQ2FwdHVyZShtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlcic6IG9uSG92ZXIobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXItZW5kJzogb25Ib3ZlckVuZCgpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWFkZCc6IG9uUGVuZGluZ0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWNsZWFyJzogb25QZW5kaW5nQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZmVlZGJhY2stYWRkJzogb25GZWVkYmFja0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwcmVmZXJlbmNlLWNoYW5nZSc6IG9uUHJlZmVyZW5jZUNoYW5nZShtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnfT4pOyByZXR1cm47XG4gICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUHJlZmVyZW5jZUNoYW5nZSA9ICh7cmVhc29uLCBwYWdlfToge3JlYXNvbjogc3RyaW5nOyBwYWdlOiBhbnl9KTogdm9pZCA9PiB7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2U/LnVybCA/PyBsaXZlVGFiVXJsO1xuICAgIGxpdmVUYWJQYXRoID0gbGl2ZVRhYlVybCA/IHBhdGhPZihsaXZlVGFiVXJsKSA6IGxpdmVUYWJQYXRoO1xuICAgIC8vIFBhZ2Ugcm93cyBhcmUgY2FwdHVyZSBoZWFkZXJzLCBub3QgYSB0YWIvcGFnZSB0ZWxlbWV0cnkgZmVlZC4gVGhlIG5leHRcbiAgICAvLyBzZWxlY3RvciBjYXB0dXJlIGZyb20gdGhpcyBwYWdlIHdpbGwgY2FycnkgdGhlIG5ldyB2aWV3cG9ydC9zdGF0ZSBhbmRcbiAgICAvLyBpbnNlcnQgYSBwYWdlIGhlYWRlciBvbmx5IGlmIG5lZWRlZC5cbiAgICBzZXRTdGF0dXMoYCR7cmVhc29ufSBjaGFuZ2VkYCwge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuXG4gIGNvbnN0IG9uRmVlZGJhY2tBZGQgPSAoe3NlbGVjdG9yLCB0ZXh0LCB1cmwsIHBhcmVudFVpZH06IHtzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfSk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAvLyAgIDEuIHBhcmVudFVpZCDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IHN1cHBsaWVkIGEgc3RhYmxlIHVpZCAodGhlXG4gICAgLy8gICAgICBzdHJvbmdlc3QgbWF0Y2g7IHN1cnZpdmVzIHNlbGVjdG9yIGNoYW5nZXMsIHNpYmxpbmdcbiAgICAvLyAgICAgIGNvbGxpc2lvbnMsIG11bHRpcGxlIGNhcHR1cmVzIG9mIHRoZSBzYW1lIGVsZW1lbnQpLlxuICAgIC8vICAgMi4gc2VsZWN0b3IgKyB1cmwg4oCUIGNvbXBvc2l0ZSBrZXk7IHByZXZlbnRzIGNyb3NzLXBhZ2VcbiAgICAvLyAgICAgIGNvbnRhbWluYXRpb24gd2hlbiB0aGUgc2FtZSBzZWxlY3RvciBleGlzdHMgb24gbXVsdGlwbGUgVVJMcy5cbiAgICAvLyAgIDMuIHNlbGVjdG9yICsgbGl2ZVRhYlVybCDigJQgZmFsbGJhY2sgd2hlbiB0aGUgbWVzc2FnZSBkaWRuJ3RcbiAgICAvLyAgICAgIGNhcnJ5IGFuIGV4cGxpY2l0IHVybCAob2xkZXIgY29udGVudC1zY3JpcHQgbWVzc2FnZXMpLlxuICAgIGxldCBpZHggPSAtMTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnVpZCA9PT0gcGFyZW50VWlkKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnN0IHdhbnRVcmwgPSB1cmwgPz8gbGl2ZVRhYlVybCA/PyBudWxsO1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PlxuICAgICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcidcbiAgICAgICAgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3JcbiAgICAgICAgJiYgKCF3YW50VXJsIHx8IG0uZW50cnkudXJsID09PSB3YW50VXJsKSk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnb25GZWVkYmFja0FkZDogbm8gcGFyZW50IGZvdW5kJywge3NlbGVjdG9yLCB1cmwsIHBhcmVudFVpZH0pO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGxvc3QgaXRzIHBhcmVudCDigJQgY2hlY2sgdGhlIGFjdGl2ZSBjYXB0dXJlJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHBhcmVudE1zZyA9IG1lc3NhZ2VzW2lkeF0gYXMgU2VsZWN0b3JNZXNzYWdlO1xuICAgIGxldCBpbnNlcnRBdCA9IGlkeCArIDE7XG4gICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIG5ldyBmZWVkYmFjayByb3cgc28gdGhlIGV4cG9ydCBjYXJyaWVzXG4gICAgLy8gdGhlIEZLIGxpbmsgZXhwbGljaXRseSAobm90IGp1c3QgYnkgY2FwdHVyZS1hZGphY2VuY3kpLlxuICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICBwYXJlbnRVaWQ6IHBhcmVudE1zZy5lbnRyeS51aWQsXG4gICAgfSk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnQ29tbWVudCBhZGRlZCBmcm9tIHBhZ2UnKTtcbiAgICAvLyBFdmVyeSBmZWVkYmFjayBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LiBJZiB0aGUgcGFyZW50XG4gICAgLy8gY2FwdHVyZSBkaWRuJ3QgZ2V0IG9uZSAoYXV0b1NjcmVlbnNob3Qgb2ZmLCBza2lwU2NyZWVuc2hvdEhvc3RzXG4gICAgLy8gaGl0LCBuZXR3b3JrIGdsaXRjaCksIHJlLWZpcmUgbm93LlxuICAgIGlmICghcGFyZW50TXNnLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudE1zZyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUGVuZGluZ0FkZCA9ICh7ZW50cnl9OiB7ZW50cnk6IEVudHJ5fSk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkucHVzaChlbnRyeSk7IHJlbmRlcigpOyB9O1xuICBjb25zdCBvblBlbmRpbmdDbGVhciA9ICgpOiB2b2lkID0+IHsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyB9O1xuXG4gIGNvbnN0IGZpbmREdXBsaWNhdGUgPSAoc2VsZWN0b3I6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT5cbiAgICBtZXNzYWdlcy5maW5kKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT5cbiAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvciAmJiAoIXVybCB8fCBtLmVudHJ5LnVybCA9PT0gdXJsKSk7XG5cbiAgLy8gRmluZCBhbiBleGlzdGluZyBjYXB0dXJlIGZvciB0aGUgYWN0aXZlIHRhYiArIHNlbGVjdG9yLiBDcm9zcy1wYWdlXG4gIC8vIGNvbnRhbWluYXRpb24gcHJldmVudGlvbiAoc2VlIHR5cGVzLnRzIGZlZWRiYWNrLWFkZCBkb2NzdHJpbmcpOlxuICAvLyBhIHNlbGVjdG9yIGFsb25lIGlzIE5PVCBhIHN0YWJsZSBpZGVudGl0eSDigJQgYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gXG4gIC8vIGV4aXN0cyBvbiBldmVyeSBwYWdlOyBgYnV0dG9uYCBpcyBldmVyeXdoZXJlLiBTdHJvbmcgaWRlbnRpdHkgaXNcbiAgLy8gKHNlbGVjdG9yICsgdXJsKS4gUmV0dXJucyB0aGUgbW9zdCByZWNlbnQgbWF0Y2ggc28gcmUtaG92ZXJpbmcgYW5cbiAgLy8gYWxyZWFkeS1jYXB0dXJlZCBlbGVtZW50IHJlc29sdmVzIGNvbnNpc3RlbnRseS5cbiAgY29uc3QgZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZSA9IChzZWxlY3Rvcjogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBjb25zdCB1cmwgPSBsaXZlVGFiVXJsO1xuICAgIC8vIFdhbGsgYmFja3dhcmRzIHNvIHRoZSBtb3N0IHJlY2VudCBtYXRjaGluZyBjYXB0dXJlIHdpbnMgd2hlbiBhXG4gICAgLy8gc2VsZWN0b3IgbGVnaXRpbWF0ZWx5IGhhcyBtdWx0aXBsZSBjYXB0dXJlcyBvbiB0aGUgc2FtZSBwYWdlXG4gICAgLy8gKGUuZy4sIHRoZSB1c2VyIHJlLWNhcHR1cmVkIHRoZSBzYW1lIGVsZW1lbnQgYWZ0ZXIgZWRpdHMpLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSBjb250aW51ZTtcbiAgICAgIGlmICh1cmwgJiYgbS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBjYW5vbmljYWxFbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgdGFnOiBlLnRhZywgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHRleHQ6IGUudGV4dCwgcm9sZTogZS5yb2xlLFxuICAgIGF0dHJzOiBlLmF0dHJzLCBjbGFzc2VzOiBlLmNsYXNzZXMsXG4gICAgcmVjdDogZS5yZWN0LCBvdXRlckhUTUw6IGUub3V0ZXJIVE1MLFxuICAgIHN0eWxlczogZS5zdHlsZXMsIG1hdGNoZWRSdWxlczogZS5tYXRjaGVkUnVsZXMsXG4gIH0pO1xuXG4gIGNvbnN0IG9uQ2FwdHVyZSA9ICh7ZW50cnksIHBhZ2UsIGdyb3VwZWR9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdjYXB0dXJlJ30+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFlbnRyeSB8fCAhcGFnZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2UudXJsO1xuICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKHBhZ2UudXJsKTtcbiAgICBpZiAoZ3JvdXBlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgICAgZ3JvdXAucHVzaChlbnRyeSk7XG4gICAgICAgICAgbS5lbnRyeS5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7IGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgICAgLy8gRmlyZSBhIGdyb3VwIHNob3QgdXNpbmcgdGhlIGhlYWQgKyBtZW1iZXJzLiBUaGUgaGVhZCdzIHNlbGVjdG9yXG4gICAgICAgICAgLy8gaXMgbS5lbnRyeS5zZWxlY3RvcjsgbWVtYmVycycgc2VsZWN0b3JzIGFyZSBpbiB0aGUgZnJlc2hseVxuICAgICAgICAgIC8vIG11dGF0ZWQgZ3JvdXAgYXJyYXkuXG4gICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW20uZW50cnkuc2VsZWN0b3IsIC4uLihtLmVudHJ5Lmdyb3VwID8/IFtdKS5tYXAoKGcpID0+IGcuc2VsZWN0b3IpXTtcbiAgICAgICAgICB2b2lkIGZpcmVHcm91cFNob3QobSwgc2VsZWN0b3JzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRHVwZSBkZXRlY3Rpb24uIENyb3NzLWNvbnRhbWluYXRpb24gZml4OiBhIChzZWxlY3RvciwgdXJsKSBtYXRjaFxuICAgIC8vIGlzIE5FQ0VTU0FSWSBidXQgbm90IFNVRkZJQ0lFTlQg4oCUIHR3byBzaWJsaW5nIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgLy8gc2FtZSB0ZXN0SWQgLyBzYW1lIHJvbGUvYXJpYSBzZWxlY3RvciBsaXZlIG9uIHRoZSBzYW1lIFVSTCBidXRcbiAgICAvLyBhcmUgZGlmZmVyZW50IGNhcHR1cmVzLiBDb21wYXJlIHRoZSBjYW5vbmljYWwtZW50cnkgaGFzaCAod2hpY2hcbiAgICAvLyBpbmNsdWRlcyByZWN0LCB0ZXh0LCBvdXRlckhUTUwsIGV0Yy4pIGJlZm9yZSB0cmVhdGluZyB0aGUgbmV3XG4gICAgLy8gY2FwdHVyZSBhcyBhIHJlZnJlc2ggb2YgdGhlIG9sZCBvbmUuIFdoZW4gdGhlIGhhc2ggZGlmZmVycywgd2VcbiAgICAvLyBrZWVwIEJPVEggY2FwdHVyZXMgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcuXG4gICAgY29uc3QgZHVwZSA9IGZpbmREdXBsaWNhdGUoZW50cnkuc2VsZWN0b3IsIGVudHJ5LnVybCk7XG4gICAgaWYgKGR1cGUpIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IGNhbm9uaWNhbEVudHJ5KGR1cGUuZW50cnkpO1xuICAgICAgY29uc3QgYWZ0ZXIgPSBjYW5vbmljYWxFbnRyeShlbnRyeSk7XG4gICAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBIYXNoZXMgZGlmZmVyLiBUd28gY2FzZXM6XG4gICAgICAvLyAgIChhKSBTYW1lIGVsZW1lbnQgcmUtY2FwdHVyZWQgYWZ0ZXIgY29udGVudCBjaGFuZ2Ug4oCUIHRoZSByZWN0XG4gICAgICAvLyAgICAgICBzdGF5cyBwdXQgKHdpdGhpbiBhIGZldyBweCksIGJ1dCB0ZXh0L291dGVySFRNTCBtb3ZlZC5cbiAgICAgIC8vICAgICAgIFRyZWF0IGFzIGEgcmVmcmVzaC5cbiAgICAgIC8vICAgKGIpIERpZmZlcmVudCBlbGVtZW50IHRoYXQgaGFwcGVucyB0byBzaGFyZSBhIHNlbGVjdG9yIOKAlCB0aGVcbiAgICAgIC8vICAgICAgIHJlY3QgaXMgaW4gYSBkaWZmZXJlbnQgcG9zaXRpb24uIFRyZWF0IGFzIGEgbmV3IGNhcHR1cmUuXG4gICAgICAvLyBXZSBkaXNjcmltaW5hdGUgYnkgcmVjdCBvdmVybGFwOiBpZiBib3RoIHJlY3RzIGV4aXN0IGFuZCB0aGVpclxuICAgICAgLy8gY2VudGVycyBhcmUgd2l0aGluIDhweCBvbiBib3RoIGF4ZXMsIHJlZnJlc2g7IG90aGVyd2lzZSBrZWVwXG4gICAgICAvLyBib3RoLlxuICAgICAgY29uc3QgcjEgPSBkdXBlLmVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCByMiA9IGVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCBzYW1lRWxlbWVudCA9IHIxICYmIHIyXG4gICAgICAgICYmIE1hdGguYWJzKChyMS54ICsgcjEudyAvIDIpIC0gKHIyLnggKyByMi53IC8gMikpIDw9IDhcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnkgKyByMS5oIC8gMikgLSAocjIueSArIHIyLmggLyAyKSkgPD0gODtcbiAgICAgIGlmIChzYW1lRWxlbWVudCkge1xuICAgICAgICBkZWxldGUgZHVwZS5kdXBlUGVuZGluZztcbiAgICAgICAgZHVwZS5lbnRyeSA9IGVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFVwZGF0ZWQgIyR7ZHVwZS5lbnRyeS5ufWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlmZmVyZW50IGVsZW1lbnQgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciDihpIgZmFsbCB0aHJvdWdoIGFuZFxuICAgICAgLy8gZW1pdCBhcyBhIG5ldyBjYXB0dXJlLiBUaGUgYWdlbnQgcmVhZGluZyB0aGUgZXhwb3J0IHNlZXMgYm90aFxuICAgICAgLy8gcm93cyB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIGJ1dCBkaWZmZXJlbnQgdWlkcyArIHJlY3RzLlxuICAgIH1cbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCB0aGUgc2Vzc2lvbiBGSyBzbyB0aGUgY29uc3VtZXIgY2FuIGpvaW4gZW50cmllcyB0byB0aGVpclxuICAgIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLlxuICAgIGlmIChzZXNzaW9uSWQpIGVudHJ5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICBjb25zdCBuZXdNc2c6IFNlbGVjdG9yTWVzc2FnZSA9IHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzLCBlbnRyeX07XG4gICAgLy8gUGFnZSByb3dzIGV4aXN0IG9ubHkgYXMgaGVhZGVycyBmb3IgY2FwdHVyZWQgc2VsZWN0b3JzLiBEbyBub3QgY3JlYXRlXG4gICAgLy8gdGhlbSBmcm9tIHRhYiBhY3RpdmF0aW9uLCB2YWxpZGF0aW9uLCBvciBwcmVmZXJlbmNlIGNoYW5nZXM7IGluc2VydCBvbmVcbiAgICAvLyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGZpcnN0IHNlbGVjdG9yIG9mIGEgbmV3IHBhZ2UgYmxvY2suXG4gICAgbGV0IHByZXZpb3VzUGFnZTogUGFnZU1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gcG9zaXRpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJykgeyBwcmV2aW91c1BhZ2UgPSBtOyBicmVhazsgfVxuICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzUGFnZSB8fCBwcmV2aW91c1BhZ2UudXJsICE9PSBwYWdlLnVybCkge1xuICAgICAgY29uc3QgcGFnZU1zZzogUGFnZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHVybDogcGFnZS51cmwsIHRpdGxlOiBwYWdlLnRpdGxlLCB2aWV3cG9ydDogcGFnZS52aWV3cG9ydCwgdG9rZW5zOiBwYWdlLnRva2VucyxcbiAgICAgICAgdXNlckFnZW50OiBwYWdlLnVzZXJBZ2VudCwgbGFuZzogcGFnZS5sYW5nLFxuICAgICAgICBnaXRDb250ZXh0OiAocGFnZSBhcyBhbnkpLmdpdENvbnRleHQsXG4gICAgICAgIHJvdXRlOiAocGFnZSBhcyBhbnkpLnJvdXRlLFxuICAgICAgICBzdGF0ZTogKHBhZ2UgYXMgYW55KS5zdGF0ZSxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgfTtcbiAgICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgcGFnZU1zZyk7XG4gICAgICBwb3NpdGlvbisrO1xuICAgIH1cbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIG5ld01zZyk7XG4gICAgcGVyc2lzdCgpO1xuICAgIC8vIEludGVudGlvbmFsbHkgTk8gc2V0TGFzdEFjdGl2ZShlbnRyeS5zZWxlY3RvcikgaGVyZSDigJQgdGhlIHVzZXIgYXNrZWRcbiAgICAvLyBmb3IgZnJlc2ggY2FwdHVyZXMgdG8gc3RheSB1bi1oaWdobGlnaHRlZCBpbiB0aGUgc2lkZWJhci4gVGhlIHN0aWNreVxuICAgIC8vIHJpbmcgKyBsYXN0LWFjdGl2ZSBvdXRsaW5lIG5vdyBvbmx5IGdldCBhcHBsaWVkIG9uIGV4cGxpY2l0XG4gICAgLy8gaG92ZXIvY2xpY2sgb2YgdGhlIHNpZGViYXIgYnViYmxlIChhbmQgdGhlIHBhZ2Utc2lkZSBmbGFzaCBmcm9tXG4gICAgLy8gY2FwdHVyZUVudHJ5IHN0aWxsIGNvbmZpcm1zIHRoZSBjYXB0dXJlIHZpc3VhbGx5IG9uIHRoZSBwYWdlKS5cbiAgICByZW5kZXIoKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KG5ld01zZyk7XG4gICAgdm9pZCBmaXJlUGFnZVNob3RJZk5lZWRlZChuZXdNc2cpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTY3JlZW5zaG90IHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRmlyZSB0aGUgcGVyLWVsZW1lbnQgc2hvdCwgYXR0YWNoIHRoZSByZXR1cm5lZCBmaWxlbmFtZSArIGRhdGFVcmwgb250b1xuICAvLyB0aGUgZW50cnksIGFuZCBwZXJzaXN0LiBzaG91bGRTa2lwU2NyZWVuc2hvdCBiYWlscyBvbiBob3N0cyBpbiB0aGVcbiAgLy8gdXNlcidzIHNraXAgbGlzdDsgYXV0b1NjcmVlbnNob3Q9ZmFsc2UgYmFpbHMgZ2xvYmFsbHkuXG4gIGNvbnN0IGZpcmVFbGVtZW50U2hvdCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCBza2lwcGVkOiBhdXRvU2NyZWVuc2hvdD1mYWxzZScpO1xuICAgICAgLy8gQnVnICMyOiB0ZWxsIHRoZSBleHBvcnQgd2h5IHRoZSBzaG90IGlzIG1pc3NpbmcuXG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ2F1dG9TY3JlZW5zaG90T2ZmJ307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGhvc3Qgb24gc2tpcCBsaXN0JywgbXNnLmVudHJ5LnVybCk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ3NraXBTY3JlZW5zaG90SG9zdHMnfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IOKGkicsIG1zZy5lbnRyeS5zZWxlY3Rvcik7XG4gICAgLy8gU1cgY29sZC1zdGFydCByYWNlOiB0aGUgRklSU1QgY2FwdHVyZSBpbiBhIHNlc3Npb24gb2Z0ZW4gbG9zZXMgaXRzXG4gICAgLy8gZmlyc3QgbWVzc2FnZSBiZWNhdXNlIHRoZSBiZyB3b3JrZXIgaXMgc3RpbGwgc3RhcnRpbmcuIFJldHJ5IG9uY2VcbiAgICAvLyBhZnRlciBhIHNob3J0IGRlbGF5IGlmIHRoZSBmaXJzdCBjYWxsIGNvbWVzIGJhY2sgbnVsbC9lbXB0eS5cbiAgICBsZXQgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5IHx8ICghcmVwbHkub2sgJiYgIXJlcGx5LmVycm9yKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyc3Qgc2NyZWVuc2hvdCByZXBseSB3YXMgZW1wdHk7IHJldHJ5aW5nIGFmdGVyIDIwMG1zIChTVyBjb2xkLXN0YXJ0KScpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMjAwKSk7XG4gICAgICByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHJlcGx5OicsIHJlcGx5KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHtcbiAgICAgIHNldFN0YXR1cyhgU2NyZWVuc2hvdCBmYWlsZWQ6ICR7cmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICB1bmF2YWlsYWJsZVJlYXNvbjogcmVwbHk/LmVycm9yID8/ICdjYXB0dXJlRmFpbGVkJyxcbiAgICAgIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFN1Y2Nlc3NmdWwgcmV0cnkg4oCUIHN0cmlwIGFueSBwcmlvciB1bmF2YWlsYWJsZVJlYXNvbiBzaW5jZSB3ZSBub3dcbiAgICAvLyBoYXZlIGEgcmVhbCBzaG90LlxuICAgIGRlbGV0ZSBtc2cuZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZWxlbWVudDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAuLi4ocmVwbHkuY3JvcCA/IHtjcm9wOiByZXBseS5jcm9wfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaXJlIHRoZSBncm91cCBzaG90ICh1bmlvbiBiYm94IG9mIGhlYWQgKyBhbGwgbWVtYmVycykgYW5kIHN0YXNoIHRoZVxuICAvLyBmaWxlbmFtZSBvbiB0aGUgaGVhZC1vZi1ncm91cCBlbnRyeS5cbiAgY29uc3QgZmlyZUdyb3VwU2hvdCA9IGFzeW5jIChoZWFkOiBTZWxlY3Rvck1lc3NhZ2UsIHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KGhlYWQuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1ncm91cCcsIHNlbGVjdG9ycywgbjogaGVhZC5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIGhlYWQuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihoZWFkLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZ3JvdXA6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkgeyBzaG90c0Z1bGwuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTsgcGVyc2lzdFNob3RzRnVsbCgpOyB9XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIFBhZ2UtbGV2ZWwgc2hvdCBvbmNlIHBlciAod29ya3NwYWNlLCBwYWdlLXVybCwgZGF5KS4gU3Vic2VxdWVudCBjYXB0dXJlc1xuICAvLyBvbiB0aGUgc2FtZSBwYWdlIHJldXNlIHRoZSBzYW1lIG9uLWRpc2sgZmlsZSBwYXRoLlxuICBjb25zdCBmaXJlUGFnZVNob3RJZk5lZWRlZCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICAvLyBQZXItY2FwdHVyZSBwYWdlLXNob3QgbW9kZSAowqc0LjUpOiB3aGVuIGVuYWJsZWQsIHNraXAgdGhlXG4gICAgLy8gcGVyLSh3b3Jrc3BhY2UsIHVybCkgZGVkdXBlIGFuZCBmaXJlIGEgZnJlc2ggcGFnZSBzaG90IGV2ZXJ5IHRpbWUuXG4gICAgLy8gVXNlZnVsIHdoZW4gdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzIChtb2RhbCBvcGVucyxcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3csIGV0Yy4pIGFuZCB0aGUgdXNlciB3YW50cyB0byBzZWUgdGhlIHdob2xlIHBhZ2UgYXRcbiAgICAvLyBlYWNoIHN0ZXAuIENvc3RzIG9uZSBmdWxsLXBhZ2UgUE5HIHBlciBjYXB0dXJlLCBzbyBkZWZhdWx0IG9mZi5cbiAgICBpZiAoIXByZWZzLnBhZ2VTaG90UGVyQ2FwdHVyZSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFnZVNob3RLZXkobXNnLmVudHJ5LnVybCk7XG4gICAgICBpZiAocGFnZVNob3RzRmlyZWQuaGFzKGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kRXhpc3RpbmdQYWdlU2hvdChtc2cuZW50cnkudXJsKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICAgICAgcGFnZTogZXhpc3RpbmcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGFnZVNob3RzRmlyZWQuYWRkKGtleSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1wYWdlJywgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgLy8gQXBwbHkgdG8gVEhJUyBlbnRyeSBhbmQgdG8gYW55IG90aGVyIGVudHJpZXMgYWxyZWFkeSBjYXB0dXJlZCBvbiB0aGVcbiAgICAvLyBzYW1lIFVSTCB0b2RheSAoc28gdGhlIHBhZ2Utc2hvdCBhcHBlYXJzIHVuaWZvcm1seSkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gbXNnLmVudHJ5LnVybCkgY29udGludWU7XG4gICAgICBtLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICBwYWdlOiByZXBseS5maWxlbmFtZSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFN0YXNoIHRoZSBmdWxsIFBORyBzbyB0aGUgd29ya3NwYWNlIGFyY2hpdmUgY2FuIGJ1bmRsZSBpdC4gS2V5ZWRcbiAgICAvLyBieSBVUkwgc2luY2UgcGFnZSBzaG90cyBhcmUgcGFnZS1zY29wZWQsIG5vdCBzZWxlY3Rvci1zY29wZWQuXG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KCdwYWdlOjonICsgbXNnLmVudHJ5LnVybCwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmluZCBhbnkgc2VsZWN0b3IgZW50cnkgb24gdGhpcyBVUkwgdGhhdCBhbHJlYWR5IGhhcyBhIGBwYWdlYCBzaG90XG4gIC8vIHJlY29yZGVkIOKAlCB1c2VkIHNvIHRoYXQgcmV0cm9hY3RpdmUgY2FwdHVyZXMgaW5oZXJpdCB0aGUgZXhpc3RpbmcgUE5HXG4gIC8vIHBhdGggaW5zdGVhZCBvZiByZWZpcmluZy5cbiAgY29uc3QgZmluZEV4aXN0aW5nUGFnZVNob3QgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgcmV0dXJuIG0uZW50cnkuc2NyZWVuc2hvdC5wYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBvbkhvdmVyID0gKHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTogdm9pZCA9PiB7XG4gICAgc2V0U3RhdHVzKGBBbHQtaG92ZXIgwrcgJHtsYWJlbH1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgLy8gSWRlbnRpdHkgaXMgKHNlbGVjdG9yLCB1cmwpLiBTYW1lIHNlbGVjdG9yIG9uIHR3byBkaWZmZXJlbnQgVVJMc1xuICAgIC8vIGlzIHR3byBkaWZmZXJlbnQgY2FwdHVyZXM7IHRoZSBwcmV2aW91cyBzZWxlY3Rvci1vbmx5IGxvb2t1cFxuICAgIC8vIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi4gUHJlZmVyIHNhbWUtVVJMICtcbiAgICAvLyBzYW1lLXNlbGVjdG9yIGFzIHRoZSBzdHJvbmdlc3QgbWF0Y2guXG4gICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSBzY3JvbGxNZXNzYWdlSW50b1ZpZXcoZXhpc3RpbmcuaWQpO1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihleGlzdGluZy5pZCk7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7dWlkOiBleGlzdGluZy5lbnRyeS51aWQsIG46IGV4aXN0aW5nLmVudHJ5Lm4sIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFja319KTtcbiAgICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXIoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBTFdBWVMgc2hvdyB0aGUgY29tbWVudCBib3gsIGV2ZW4gZm9yIHVuY2FwdHVyZWQgZWxlbWVudHMuIE9uIHN1Ym1pdFxuICAgICAgLy8gdGhlIGNvbnRlbnQgc2NyaXB0IHdpbGwgY2FwdHVyZSB0aGUgZWxlbWVudCBmaXJzdCwgdGhlbiBhdHRhY2ggdGhlXG4gICAgICAvLyBjb21tZW50IOKAlCB0dXJuaW5nIGhvdmVyLWNvbW1lbnQgaW50byBhIGNhcHR1cmUrY29tbWVudCBzaG9ydGN1dC5cbiAgICAgIHBoYW50b21UYXJnZXQgPSB7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3Q6IHJlY3QgYXMgdW5rbm93biBhcyBET01SZWN0fTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHtjYXB0dXJlZDogZmFsc2UsIGZlZWRiYWNrOiBbXX19KTtcbiAgICAgIHJlbmRlclBoYW50b20oKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudD8uc3RhcnRzV2l0aCgnQWx0LWhvdmVyJykpIHN0YXR1cy50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXJQaGFudG9tKCk7IH1cbiAgICAvLyBObyBhbm5vdGF0aW9uLWNsZWFyIGhlcmUg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBrZWVwcyB0aGUgYm94IG9wZW4gc28gdGhlXG4gICAgLy8gdXNlciBjYW4gbW91c2UgdG8gaXQgYW5kIHR5cGUuIE91dHNpZGUtY2xpY2sgLyBFc2MgZGlzbWlzcyBpdC5cbiAgfTtcblxuICBjb25zdCBjb2xsZWN0RmVlZGJhY2tBZnRlciA9IChzZWxlY3RvcklkOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKCFmb3VuZCkgeyBpZiAobS5pZCA9PT0gc2VsZWN0b3JJZCkgZm91bmQgPSB0cnVlOyBjb250aW51ZTsgfVxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyB8fCBtLnR5cGUgPT09ICdwYWdlJykgYnJlYWs7XG4gICAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSBvdXQucHVzaChtLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IHNjcm9sbE1lc3NhZ2VJbnRvVmlldyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGVsLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJ30pO1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoLWludG8tdmlldycpO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gtaW50by12aWV3Jyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0aWNreSBoaWdobGlnaHQgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2V0TGFzdEFjdGl2ZSA9IChzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhcm1TdGlja3lFeHBpcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBzdGlja3lUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcGFuZWxIb3ZlcmVkKSB7XG4gICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yLmxhc3QtYWN0aXZlJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtYWN0aXZlJyk7XG4gICAgICB9IGVsc2UgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSwgU1RJQ0tZX1RUTF9NUyk7XG4gIH07XG5cbiAgLy8gRmFzdCBzdGlja3ktY2xlYXI6IHdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBwYW5lbCwgZmlyZVxuICAvLyBzdGlja3ktY2xlYXIgYWZ0ZXIgYSAzMDAgbXMgZ3JhY2Ugd2luZG93LiBQcmlvciBiZWhhdmlvciB3YWl0ZWQgdGhlXG4gIC8vIGZ1bGwgU1RJQ0tZX1RUTF9NUyAofjUgcykgd2hpY2ggZmVsdCBsaWtlIHRoZSBwYWdlLXNpZGUgaGlnaGxpZ2h0XG4gIC8vIFwiZG9lc24ndCBnbyBhd2F5IGV2ZW4gYWZ0ZXIgSSB1bmhvdmVyXCIuIDMwMCBtcyBpcyBzaG9ydCBlbm91Z2ggdG9cbiAgLy8gZmVlbCByZXNwb25zaXZlIGJ1dCBsb25nIGVub3VnaCB0aGF0IGEgcXVpY2sgcmVwb3NpdGlvbiAoZS5nLlxuICAvLyBhY2NpZGVudGFsbHkgY3Jvc3NpbmcgdGhlIHNlYW0pIGRvZXNuJ3Qga2lsbCB0aGUgcmluZyBtaWQtZmxpZ2h0LlxuICBsZXQgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSB0cnVlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSB7IGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTsgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7IH1cbiAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgfSk7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpO1xuICAgIHN0aWNreUNsZWFyR3JhY2UgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgLy8gQWxzbyBkcm9wIG91ciBvd24gZnJvbS1wYW5lbCArIG11bHRpIHJpbmdzIGluIGNhc2UgdGhleSBsZWFrZWQuXG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGVpciBtb3VzZSBpbnRvIHRoZSBwYW5lbCwgc3VwcHJlc3MgcGFnZS1zaWRlXG4gICAgLy8gYWx0LWhvdmVyIHN0YXRlIHNvIHRoZSBvcmFuZ2UgcmluZyBkb2Vzbid0IGtlZXAgZm9sbG93aW5nIHRoZSBjdXJzb3IuXG4gICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgUmVuZGVyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBORUFSX0JPVFRPTV9QWCA9IDgwO1xuICBjb25zdCB3YXNOZWFyQm90dG9tID0gKCk6IGJvb2xlYW4gPT5cbiAgICBsaXN0LnNjcm9sbEhlaWdodCAtIGxpc3Quc2Nyb2xsVG9wIC0gbGlzdC5jbGllbnRIZWlnaHQgPD0gTkVBUl9CT1RUT01fUFg7XG5cbiAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9IChtOiBQYW5lbE1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAvLyBNYXRjaCBhZ2FpbnN0IHRoZSBXSE9MRSBlbnRyeSAoc2VsZWN0b3IsIHRleHQsIGNsYXNzZXMsIGF0dHJzLFxuICAgICAgLy8gb3V0ZXJIVE1MLCBzdHlsZXMsIGV0Yy4pIHNvIHNlYXJjaCBoaXRzIGFueXRoaW5nIHZpc2libGUgaW4gdGhlXG4gICAgICAvLyBib2R5LWpzb24uIFN0cmluZ2lmeWluZyBvbmNlIGlzIGZpbmUg4oCUIHRoZSBjb3N0IGlzIHRpbnkgdnMgcmVuZGVyLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgfVxuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIChtLnVybCArICcgJyArIChtLnRpdGxlID8/ICcnKSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSBidWJibGUncyBib2R5LWpzb24gKG9yIG91dGVySFRNTCkgY29udGFpbnMgdGhlIHNlYXJjaCDigJRcbiAgLy8gdGVsbHMgcmVuZGVyU2VsZWN0b3IgdG8gYXV0by1leHBhbmQgc28gdGhlIHVzZXIgc2VlcyB0aGUgaGlnaGxpZ2h0ZWQgaGl0LlxuICBjb25zdCBib2R5TWF0Y2hlc1NlYXJjaCA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG0uZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0UmFpbCA9IChiZWZvcmVJZDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnaW5zZXJ0LXJhaWwnO1xuICAgIGRpdi5kYXRhc2V0LmJlZm9yZUlkID0gYmVmb3JlSWQ7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50ID09PSBiZWZvcmVJZCkge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICBkaXYuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTsgcmVuZGVyKCk7IH0sXG4gICAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4gc2VuZElubGluZSh0ZXh0KSxcbiAgICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidG4uY2xhc3NOYW1lID0gJ2FkZC1idG4nO1xuICAgICAgYnRuLmRhdGFzZXQudGlwID0gJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZSc7XG4gICAgICBidG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdwbHVzJywgMTIpO1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkOyBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7IHJlbmRlcigpOyB9KTtcbiAgICAgIGRpdi5hcHBlbmQoYnRuKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICB0eXBlIElubGluZUNvbW1lbnRPcHRzID0ge1xuICAgIGluaXRpYWw/OiBzdHJpbmc7XG4gICAgb25DYW5jZWw/OiAoKSA9PiB2b2lkO1xuICAgIG9uU3VibWl0PzogKHRleHQ6IHN0cmluZykgPT4gdm9pZDtcbiAgICBhdXRvZm9jdXM/OiBib29sZWFuO1xuICB9O1xuICBjb25zdCBidWlsZElubGluZUNvbW1lbnQgPSAoe2luaXRpYWwgPSAnJywgb25DYW5jZWwsIG9uU3VibWl0LCBhdXRvZm9jdXN9OiBJbmxpbmVDb21tZW50T3B0cyk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcC5jbGFzc05hbWUgPSAnaW5saW5lLWNvbW1lbnQnO1xuICAgIGNvbnN0IHRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB0YS52YWx1ZSA9IGluaXRpYWw7XG4gICAgdGEucm93cyA9IDI7XG4gICAgdGEucGxhY2Vob2xkZXIgPSAnSW5zZXJ0IGEgY29tbWVudCBoZXJlLCBvciBBbHQrQ2xpY2sgdG8gaW5zZXJ0IGEgY2FwdHVyZSc7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcm93LmNsYXNzTmFtZSA9ICdyb3cnO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9ICcwdyDCtyAwdCc7XG4gICAgLy8gQm90aCBTYXZlIC8gQ2FuY2VsIGFyZSB1bmlmb3JtIGljb24gYnV0dG9ucyAoLmljb25idG4pLiBTYXZlIHVzZXMgdGhlXG4gICAgLy8gcHJpbWFyeSBhY2NlbnQgdmFyaWFudCB2aWEgLnByaW1hcnkgc28gaXQgc3RpbGwgcG9wcywgYnV0IGl0cyB3aWR0aFxuICAgIC8vIG1hdGNoZXMgQ2FuY2VsIGV4YWN0bHkuXG4gICAgY29uc3QgY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjYW5jZWwuY2xhc3NOYW1lID0gJ2ljb25idG4nO1xuICAgIGNhbmNlbC5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgwrcgRXNjJztcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMjApO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uQ2FuY2VsPy4oKSk7XG4gICAgY29uc3Qgc2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbmQudHlwZSA9ICdidXR0b24nO1xuICAgIHNlbmQuY2xhc3NOYW1lID0gJ2ljb25idG4gcHJpbWFyeSc7XG4gICAgc2VuZC5kYXRhc2V0LnRpcCA9ICdTYXZlIMK3IEVudGVyJztcbiAgICBzZW5kLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAyMCk7XG4gICAgY29uc3Qgc3VibWl0ID0gKCk6IHZvaWQgPT4gb25TdWJtaXQ/Lih0YS52YWx1ZSk7XG4gICAgc2VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdCk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7IG1ldGEudGV4dENvbnRlbnQgPSBgJHt3b3JkQ291bnQodGEudmFsdWUpfXcgwrcgJHt0b2tlbkNvdW50KHRhLnZhbHVlKX10YDsgfSk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0KCk7IH1cbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIG9uQ2FuY2VsPy4oKTtcbiAgICB9KTtcbiAgICByb3cuYXBwZW5kKG1ldGEsIGNhbmNlbCwgc2VuZCk7XG4gICAgd3JhcC5hcHBlbmQodGEsIHJvdyk7XG4gICAgaWYgKGF1dG9mb2N1cykgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhLmZvY3VzKCkpO1xuICAgIHJldHVybiB3cmFwO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRJbmxpbmUgPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGV4dCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgYmVmb3JlSWQgPSBpbnNlcnRCZWZvcmUuY3VycmVudDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsZXQgcG9zID0gYmVmb3JlSWQgPyBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGJlZm9yZUlkKSA6IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAocG9zIDwgMCkgcG9zID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIC8vIHBhcmVudFVpZCByZXNvbHV0aW9uOiB3YWxrIGJhY2sgZnJvbSB0aGUgaW5zZXJ0IHBvc2l0aW9uIHRvIHRoZVxuICAgIC8vIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yLiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciB0aGUgRksuXG4gICAgbGV0IHBJZHggPSBwb3MgLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9O1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3MsIDAsIGZiKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdJbnNlcnRlZCcpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBoYW50b20gPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGhhbnRvbScpPy5yZW1vdmUoKTtcbiAgICBpZiAoIXBoYW50b21UYXJnZXQpIHJldHVybjtcbiAgICBjb25zdCBwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBoLmNsYXNzTmFtZSA9ICdwaGFudG9tIHZpc2libGUnO1xuICAgIHBoLmlubmVySFRNTCA9IGA8Y29kZT4ke2VzY2FwZUh0bWwocGhhbnRvbVRhcmdldC5sYWJlbCl9PC9jb2RlPmA7XG4gICAgbGlzdC5hcHBlbmQocGgpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIC8vIFJlb3JkZXIgYSBmbGF0IG1lc3NhZ2UgbGlzdCBzbyBzZWxlY3RvcnMgd2l0aGluIGVhY2ggcGFnZS1kZWxpbWl0ZWRcbiAgLy8gYmxvY2sgYXJlIHNvcnRlZCBieSB0aGVpciB2aXN1YWwgcmVjdCAodG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQpLlxuICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIChjYXB0dXJlXG4gIC8vIGFkamFjZW5jeSkgc28gZWRpdGluZy90aHJlYWRpbmcgYmVoYXZpb3Igc3Vydml2ZXMgdGhlIHNvcnQuXG4gIC8vXG4gIC8vIFVzZWQgT05MWSBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIChgYnVpbGRTbGltYCksIG5vdCB0aGUgc2lkZWJhclxuICAvLyByZW5kZXIuIFRoZSBzaWRlYmFyIGtlZXBzIG1lc3NhZ2VzIGluIGluc2VydGlvbi9jYXB0dXJlIG9yZGVyIHNvXG4gIC8vIHRoZSB1c2VyIHNlZXMgdGhlbSB3aGVyZSB0aGV5IGV4cGVjdDsgdGhlIGV4cG9ydCBnZXRzIHRoZSBhZ2VudC1cbiAgLy8gZnJpZW5kbHkgcmVhZGluZy1vcmRlciB0cmVhdG1lbnQuXG4gIGNvbnN0IHJlb3JkZXJGb3JFeHBvcnQgPSAobXNnczogUGFuZWxNZXNzYWdlW10pOiBQYW5lbE1lc3NhZ2VbXSA9PiB7XG4gICAgdHlwZSBHcm91cCA9IHtraW5kOiAnZ3JvdXAnOyBzZWw6IFNlbGVjdG9yTWVzc2FnZTsgdHJhaWxpbmc6IEZlZWRiYWNrTWVzc2FnZVtdfTtcbiAgICB0eXBlIExvb3NlID0ge2tpbmQ6ICdsb29zZSc7IG06IEZlZWRiYWNrTWVzc2FnZX07XG4gICAgdHlwZSBTbG90ID0gR3JvdXAgfCBMb29zZSB8IHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfTtcbiAgICBjb25zdCBzbG90czogU2xvdFtdID0gW107XG4gICAgbGV0IGN1ckdyb3VwOiBHcm91cCB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGZsdXNoR3JvdXAgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoY3VyR3JvdXApIHsgc2xvdHMucHVzaChjdXJHcm91cCk7IGN1ckdyb3VwID0gbnVsbDsgfVxuICAgIH07XG4gICAgZm9yIChjb25zdCBtIG9mIG1zZ3MpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIHNsb3RzLnB1c2goe2tpbmQ6ICdwYWdlJywgbX0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBjdXJHcm91cCA9IHtraW5kOiAnZ3JvdXAnLCBzZWw6IG0sIHRyYWlsaW5nOiBbXX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY3VyR3JvdXApIGN1ckdyb3VwLnRyYWlsaW5nLnB1c2gobSk7XG4gICAgICAgIGVsc2Ugc2xvdHMucHVzaCh7a2luZDogJ2xvb3NlJywgbX0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaEdyb3VwKCk7XG4gICAgY29uc3Qgb3V0OiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGxldCBydW5TdGFydCA9IDA7XG4gICAgY29uc3QgZmx1c2hSdW4gPSAoZW5kOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgICBjb25zdCBncm91cFJlY3RzOiBBcnJheTx7aWR4OiBudW1iZXI7IHk6IG51bWJlcjsgeDogbnVtYmVyfT4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSBydW5TdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByID0gcy5zZWwuZW50cnkucmVjdDtcbiAgICAgICAgICBncm91cFJlY3RzLnB1c2goe2lkeDogaSwgeTogcj8ueSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIHg6IHI/LnggPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kaWNlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgZ3JvdXBSZWN0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnkgIT09IGIueSkgcmV0dXJuIGEueSAtIGIueTtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICAgIH0pO1xuICAgICAgbGV0IGdpID0gMDtcbiAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByZXBsYWNlbWVudElkeCA9IGdyb3VwUmVjdHNbZ2krK10hLmlkeDtcbiAgICAgICAgICBjb25zdCByID0gc2xvdHNbcmVwbGFjZW1lbnRJZHhdISBhcyBHcm91cDtcbiAgICAgICAgICBvdXQucHVzaChyLnNlbCk7XG4gICAgICAgICAgZm9yIChjb25zdCBmIG9mIHIudHJhaWxpbmcpIG91dC5wdXNoKGYpO1xuICAgICAgICB9IGVsc2UgaWYgKHMua2luZCA9PT0gJ2xvb3NlJykge1xuICAgICAgICAgIG91dC5wdXNoKHMubSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzbG90c1tpXSEua2luZCA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoUnVuKGkpO1xuICAgICAgICBvdXQucHVzaCgoc2xvdHNbaV0gYXMge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9KS5tKTtcbiAgICAgICAgcnVuU3RhcnQgPSBpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hSdW4oc2xvdHMubGVuZ3RoKTtcbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdGlja1RvQm90dG9tID0gbGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDAgfHwgd2FzTmVhckJvdHRvbSgpO1xuICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAvLyBTdGF0cyBudW1iZXJzXG4gICAgbGV0IHRvdGFsU2VsZWN0b3JzID0gMDtcbiAgICBsZXQgdG90YWxDb21tZW50cyA9IDA7XG4gICAgbGV0IHRvdGFsU3RhbGUgPSAwO1xuICAgIGNvbnN0IGRpc3RpbmN0UGFnZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgdG90YWxTZWxlY3RvcnMrKztcbiAgICAgICAgaWYgKHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSkgdG90YWxTdGFsZSsrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHRvdGFsQ29tbWVudHMrKztcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtZXNzYWdlcy5zb21lKCh4KSA9PiB4LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgeC5lbnRyeS51cmwgPT09IG0udXJsKSkgZGlzdGluY3RQYWdlcy5hZGQobS51cmwpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic2VsZWN0b3JzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFNlbGVjdG9ycyk7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cImNvbW1lbnRzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbENvbW1lbnRzKTtcbiAgICBjb25zdCBzdGFsZU51bSA9IHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzdGFsZVwiXSAuc3RhdC1udW0nKSE7XG4gICAgc3RhbGVOdW0udGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTdGFsZSk7XG4gICAgc3RhbGVOdW0uZGF0YXNldC56ZXJvID0gdG90YWxTdGFsZSA9PT0gMCA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInBhZ2VzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyhkaXN0aW5jdFBhZ2VzLnNpemUpO1xuICAgIGNvbnN0IGV4cG9ydFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgc3RhdFRva2Vucy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcodG9rZW5Db3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG4gICAgc3RhdFdvcmRzLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh3b3JkQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuXG4gICAgLy8gTWluaWZ5IHJlZHVjdGlvbiBzdGF0c1xuICAgIGxldCBmdWxsVCA9IDAsIGN1clQgPSAwLCBmdWxsVyA9IDAsIGN1clcgPSAwLCBwY3QgPSAwO1xuICAgIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICBjb25zdCB3YXNNaW4gPSBwcmVmcy5taW5pZnk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB0cnVlOyBjb25zdCBtaW5UZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gZmFsc2U7IGNvbnN0IGZ1bGxUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gd2FzTWluO1xuICAgICAgZnVsbFQgPSB0b2tlbkNvdW50KGZ1bGxUZXh0KTsgY3VyVCA9IHRva2VuQ291bnQobWluVGV4dCk7XG4gICAgICBmdWxsVyA9IHdvcmRDb3VudChmdWxsVGV4dCk7IGN1clcgPSB3b3JkQ291bnQobWluVGV4dCk7XG4gICAgICBwY3QgPSBmdWxsVCA+IDAgPyBNYXRoLnJvdW5kKCgxIC0gY3VyVCAvIGZ1bGxUKSAqIDEwMCkgOiAwO1xuICAgIH1cbiAgICBjb25zdCBtaW5pZnlTdGF0c0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1pbmlmeS1zdGF0c10nKTtcbiAgICBpZiAobWluaWZ5U3RhdHNFbCkge1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtmdWxsVC50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJULnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke2Z1bGxXLnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clcudG9Mb2NhbGVTdHJpbmcoKX0gd29yZHMgwrcgJHtwY3R9JSByZWR1Y3Rpb25gO1xuICAgICAgfSBlbHNlIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgV291bGQgc2F2ZSAkeyhmdWxsVCAtIGN1clQpLnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke3BjdH0lIGlmIGVuYWJsZWRgO1xuICAgICAgfSBlbHNlIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG5cbiAgICAvLyBQZXItY2hlY2tib3ggY29udHJpYnV0aW9uIHN0YXRzOiBob3cgbWFueSB0b2tlbnMvd29yZHMgZWFjaCB0b2dnbGVcbiAgICAvLyBhZGRzIHRvIHRoZSBjdXJyZW50IGV4cG9ydC4gQ29tcHV0ZWQgYnkgdG9nZ2xpbmcgdGhhdCBzaW5nbGUgcHJlZlxuICAgIC8vIGFuZCBkaWZmaW5nIHRoZSBleHBvcnQg4oCUIGdpdmVzIGFuIGhvbmVzdCBhbnN3ZXIgdGhhdCByZWZsZWN0cyB0aGVcbiAgICAvLyBjdXJyZW50IG1pbmlmeSBzdGF0ZSBhbmQgdGhlIHJlc3Qgb2YgdGhlIHRvZ2dsZXMuXG4gICAgY29uc3QgY29udHJpYktleXM6IEFycmF5PGtleW9mIFByZWZzPiA9IFsnaW5jbHVkZU91dGVySFRNTCcsICdpbmNsdWRlTWF0Y2hlZFJ1bGVzJywgJ2luY2x1ZGVTdHlsZXMnXTtcbiAgICBpZiAoZXhwb3J0VGV4dCAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJhc2VUID0gdG9rZW5Db3VudChleHBvcnRUZXh0KTtcbiAgICAgIGNvbnN0IGJhc2VXID0gd29yZENvdW50KGV4cG9ydFRleHQpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoIWVsKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qgd2FzT24gPSBwcmVmc1trZXldIGFzIGJvb2xlYW47XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSAhd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSB3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VCA9IHRva2VuQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIGNvbnN0IGFsdFcgPSB3b3JkQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIC8vIHdhc09uPXRydWUg4oaSIGN1cnJlbnRseSBpbmNsdWRlZDsgY29zdCA9IGJhc2UgLSBhbHQgKHR1cm5pbmcgT0ZGIHNhdmVzIHRoaXMpLlxuICAgICAgICAvLyB3YXNPbj1mYWxzZSDihpIgY3VycmVudGx5IGV4Y2x1ZGVkOyBnYWluID0gYWx0IC0gYmFzZSAodHVybmluZyBPTiBhZGRzIHRoaXMpLlxuICAgICAgICBjb25zdCBkVCA9IHdhc09uID8gYmFzZVQgLSBhbHRUIDogYWx0VCAtIGJhc2VUO1xuICAgICAgICBjb25zdCBkVyA9IHdhc09uID8gYmFzZVcgLSBhbHRXIDogYWx0VyAtIGJhc2VXO1xuICAgICAgICBjb25zdCBzaWduID0gd2FzT24gPyAnJyA6ICcrJztcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB3YXNPblxuICAgICAgICAgID8gYMK3ICR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaW4gZXhwb3J0JHtwcmVmcy5taW5pZnkgPyAnIChtaW5pZmllZCknIDogJyd9YFxuICAgICAgICAgIDogYMK3ICR7c2lnbn0ke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtzaWdufSR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpZiBlbmFibGVkYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoZWwpIGVsLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9vbGJhciBleHBvcnQgc3RhdHNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignLnN0YXQuZXhwb3J0LXN0YXRzJykuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgY29uc3QgbnVtID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbnVtJyk7XG4gICAgICBjb25zdCBsYWIgPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1sYWJlbCcpO1xuICAgICAgaWYgKG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50IS5yZXBsYWNlKC9cXCokLywgJycpO1xuICAgICAgaWYgKGxhYikgbGFiLnRleHRDb250ZW50ID0gbGFiLnRleHRDb250ZW50IS5yZXBsYWNlKC9eXFwqLywgJycpO1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCArICcqJztcbiAgICAgIGNvbnN0IGlzVG9rZW4gPSBpID09PSAwO1xuICAgICAgY29uc3QgZnVsbFYgPSBpc1Rva2VuID8gZnVsbFQgOiBmdWxsVztcbiAgICAgIGNvbnN0IGN1clYgPSBpc1Rva2VuID8gY3VyVCA6IGN1clc7XG4gICAgICBjb25zdCB3aGljaCA9IGlzVG9rZW4gPyAndG9rZW5zJyA6ICd3b3Jkcyc7XG4gICAgICBzLmRhdGFzZXQudGlwID0gcHJlZnMubWluaWZ5XG4gICAgICAgID8gYE1JTklGSUVEIMK3ICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofVxcbkZ1bGwgd291bGQgYmUgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYFxuICAgICAgICA6IGAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9IMK3IGZ1bGwgZXhwb3J0XFxuTWluaWZpZWQgd291bGQgYmUgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgO1xuICAgIH0pO1xuXG4gICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS5pbm5lckhUTUwgPSBgPGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206OHB4O2ZvbnQtc2l6ZTozMnB4XCI+8J+kjzwvZGl2PlxuICAgICAgICBPcGVuIGFueSBwYWdlIGFuZCA8Yj5BbHQrQ2xpY2s8L2I+IGFuIGVsZW1lbnQuIENhcHR1cmVzIGxhbmQgaGVyZSBvbiB0aGUgbGVmdDs8YnI+XG4gICAgICAgIHR5cGUgY29tbWVudHMgYmVsb3cg4oCUIHRoZXkgYXBwZWFyIG9uIHRoZSByaWdodC5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RvclVybHMgPSBuZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnVybCkpO1xuICAgIGNvbnN0IHZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlICE9PSAncGFnZScgfHwgc2VsZWN0b3JVcmxzLmhhcyhtLnVybCkpO1xuICAgIGNvbnN0IHBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgQm9vbGVhbihtLnBpbm5lZCkpO1xuICAgIGNvbnN0IHVucGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSkgPT4gIXBpbm5lZC5pbmNsdWRlcyhtIGFzIFNlbGVjdG9yTWVzc2FnZSkpO1xuICAgIC8vIFNpZGViYXIgc2hvd3MgY2FwdHVyZXMgaW4gSU5TRVJUSU9OIG9yZGVyIChtb3N0IHJlY2VudCBhdCB0aGVcbiAgICAvLyBib3R0b20pLiBWaXN1YWwtcG9zaXRpb24gcmVvcmRlcmluZyBoYXBwZW5zIE9OTFkgYXQgZXhwb3J0IHRpbWVcbiAgICAvLyBzbyB0aGUgc2lkZWJhciBzdGF5cyBwcmVkaWN0YWJsZSB3aGlsZSB0aGUgYWdlbnQtZmFjaW5nIGV4cG9ydFxuICAgIC8vIGdldHMgcmVhZGluZy1vcmRlciBjb252ZW5pZW5jZS4gKFByaW9yIGltcGxlbWVudGF0aW9uIHNvcnRlZCBpblxuICAgIC8vIGJvdGggcGxhY2VzOyB1c2VyIGZlZWRiYWNrIHdhcyB0aGF0IHNpZGViYXIgc2h1ZmZsaW5nIHdhc1xuICAgIC8vIGRpc29yaWVudGluZy4pXG4gICAgY29uc3Qgb3JkZXJlZCA9IFsuLi5waW5uZWQsIC4uLnVucGlubmVkXTtcblxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwobWVzc2FnZXNbMF0hLmlkKSk7XG4gICAgbGV0IGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJlbmRlcmVkQW55ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmRlcmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gb3JkZXJlZFtpXSE7XG4gICAgICBpZiAoIW1hdGNoZXNTZWFyY2gobSkpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgbm9kZSA9IHJlbmRlck1lc3NhZ2UobSwgbGFzdFNlbGVjdG9yU2VsKTtcbiAgICAgIGxpc3QuYXBwZW5kKG5vZGUpO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgbGFzdFNlbGVjdG9yU2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGlmIChpIDwgb3JkZXJlZC5sZW5ndGggLSAxKSBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG9yZGVyZWRbaSArIDFdIS5pZCkpO1xuICAgICAgcmVuZGVyZWRBbnkgPSB0cnVlO1xuICAgIH1cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKCdfX2VuZF9fJykpO1xuICAgIGlmICghcmVuZGVyZWRBbnkgJiYgc2VhcmNoUXVlcnkpIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSBgTm8gbWF0Y2hlcyBmb3IgXCIke3NlYXJjaFF1ZXJ5fVwiLmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgfVxuXG4gICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgcmVuZGVyUGhhbnRvbSgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhd05vb2RsZXMpO1xuICAgIGlmIChzdGlja1RvQm90dG9tKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQZW5kaW5nQmF5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBlbmRpbmctYmF5Jyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJheS5jbGFzc05hbWUgPSAncGVuZGluZy1iYXknO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgUGVuZGluZyBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9IGVsZW1lbnQke3BlbmRpbmdNdWx0aS5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gO1xuICAgIGJheS5hcHBlbmQoaGVhZCk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNhcmQuY2xhc3NOYW1lID0gJ3BlbmRpbmctY2FyZCc7XG4gICAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7aSArIDF9YDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSAoZS50ZXh0ICYmIGUudGV4dC5sZW5ndGggPD0gNjAgPyBlLnRleHQgOiAoZS5jb21wb25lbnRSb290ID8/IGUuc2VsZWN0b3IgPz8gZS50YWcpKTtcbiAgICAgIGNhcmQuYXBwZW5kKHNlcSwgbGFiZWwpO1xuICAgICAgYmF5LmFwcGVuZChjYXJkKTtcbiAgICB9KTtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3BlbmRpbmctcm93JztcbiAgICBjb25zdCBjb21taXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb21taXQudHlwZSA9ICdidXR0b24nO1xuICAgIGNvbW1pdC5jbGFzc05hbWUgPSAncHJpbWFyeSBwZW5kaW5nLWNvbW1pdCc7XG4gICAgY29tbWl0LnRleHRDb250ZW50ID0gYENvbW1pdCBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9YDtcbiAgICBjb21taXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY29tbWl0J30pKTtcbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwZW5kaW5nLWNhbmNlbCc7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJztcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSkpO1xuICAgIHJvdy5hcHBlbmQoY29tbWl0LCBjYW5jZWwpO1xuICAgIGJheS5hcHBlbmQocm93KTtcbiAgICBjb25zdCBoaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGludC5jbGFzc05hbWUgPSAncGVuZGluZy1oaW50JztcbiAgICBoaW50LnRleHRDb250ZW50ID0gJ0FsdCtTaGlmdCtDbGljayBtb3JlIMK3IENvbW1pdCB0byBmaW5hbGl6ZSDCtyBFc2MgdG8gY2FuY2VsJztcbiAgICBiYXkuYXBwZW5kKGhpbnQpO1xuICAgIGxpc3QuYXBwZW5kKGJheSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGNsZWFyTm9vZGxlcyA9ICgpOiB2b2lkID0+IHsgZm9yIChjb25zdCBuIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLnRyZWUtbm9vZGxlJykpIG4ucmVtb3ZlKCk7IH07XG5cbiAgLy8gQ3Jvc3Mtc2VhbSBwYW5lbOKGlGNhbnZhcyBub29kbGVzIHdlcmUgcmVtb3ZlZDogYWxpZ25pbmcgdHdvIFNWRyBoYWx2ZXNcbiAgLy8gYWNyb3NzIHRoZSBwYW5lbC9wYWdlIGJvdW5kYXJ5IGRlcGVuZGVkIG9uIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaFxuICAvLyBicmVha3MgdW5kZXIgRGV2VG9vbHMgZG9jayBhbmQgem9vbSwgYW5kIHRoZSB2aXN1YWwgYmVuZWZpdCBkaWRuJ3RcbiAgLy8ganVzdGlmeSB0aGUgbWFpbnRlbmFuY2UgY29zdC4gVGhlIGluLXBhbmVsIGZlZWRiYWNrLXRyZWUgbm9vZGxlc1xuICAvLyAoZHJhd05vb2RsZSAvIHJlZHJhd05vb2RsZXMgYmVsb3cpIGFyZSB1bmFmZmVjdGVkLlxuICBjb25zdCBjbGVhckJ1YmJsZU5vb2RsZSA9ICgpOiB2b2lkID0+IHsgLyogbm8tb3AgKi8gfTtcbiAgY29uc3QgcmVkcmF3Tm9vZGxlcyA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhck5vb2RsZXMoKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIFsuLi5saXN0LmNoaWxkcmVuXSBhcyBIVE1MRWxlbWVudFtdKSB7XG4gICAgICBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RvcicpKSBsYXN0U2VsZWN0b3JFbCA9IG5vZGU7XG4gICAgICBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlZWRiYWNrJykgJiYgbGFzdFNlbGVjdG9yRWwpIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIG5vZGUpO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1yYWlsJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2V4cGFuZGVkJykgJiYgbGFzdFNlbGVjdG9yRWwpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gbm9kZS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmlubGluZS1jb21tZW50JykgPz8gbm9kZTtcbiAgICAgICAgZHJhd05vb2RsZShsYXN0U2VsZWN0b3JFbCwgdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZGl2aWRlcicpIHx8IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncm91cC1oZWFkJykpIHtcbiAgICAgICAgbGFzdFNlbGVjdG9yRWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgZHJhd05vb2RsZSA9IChzZWxlY3RvckVsOiBIVE1MRWxlbWVudCwgZmVlZGJhY2tFbDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzUiA9IHNlbGVjdG9yRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZlIgPSBmZWVkYmFja0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxSID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4MSA9IHNSLmxlZnQgLSBsUi5sZWZ0ICsgMTI7XG4gICAgY29uc3QgeTEgPSBzUi5ib3R0b20gLSBsUi50b3AgKyBsaXN0LnNjcm9sbFRvcDtcbiAgICBjb25zdCB4MiA9IGZSLmxlZnQgLSBsUi5sZWZ0O1xuICAgIGNvbnN0IHkyID0gZlIudG9wIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3AgKyAxNDtcbiAgICBjb25zdCB3ID0gTWF0aC5tYXgoMjAsIHgyIC0geDEgKyA0KTtcbiAgICBjb25zdCBoID0gTWF0aC5tYXgoMjAsIHkyIC0geTEpO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndHJlZS1ub29kbGUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyh3KSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKGgpKTtcbiAgICBzdmcuc3R5bGUubGVmdCA9IGAke3gxIC0gMn1weGA7XG4gICAgc3ZnLnN0eWxlLnRvcCA9IGAke3kxfXB4YDtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgY29uc3Qgc3ggPSAyLCBzeSA9IDAsIGV4ID0gdyAtIDIsIGV5ID0gaDtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIGBNICR7c3h9ICR7c3l9IEMgJHtzeH0gJHtzeSArIGggKiAwLjU1fSwgJHtleCAtIHcgKiAwLjR9ICR7ZXl9LCAke2V4fSAke2V5fWApO1xuICAgIHN2Zy5hcHBlbmQocGF0aCk7XG4gICAgbGlzdC5hcHBlbmQoc3ZnKTtcbiAgfTtcbiAgbGV0IHNjcm9sbFJhZiA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgIGlmIChzY3JvbGxSYWYpIHJldHVybjtcbiAgICBzY3JvbGxSYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBzY3JvbGxSYWYgPSAwOyByZWRyYXdOb29kbGVzKCk7IH0pO1xuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlZHJhd05vb2RsZXMpO1xuXG4gIC8vIOKUgOKUgOKUgCBQZXItbWVzc2FnZSByZW5kZXJlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJlbmRlck1lc3NhZ2UgPSAobTogUGFuZWxNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gcmVuZGVyUGFnZShtKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4gcmVuZGVyU2VsZWN0b3IobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIHJlbmRlckZlZWRiYWNrKG0sIGxhc3RTZWxlY3RvclNlbCk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBhZ2UgPSAobTogUGFnZU1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGQuY2xhc3NOYW1lID0gJ3BhZ2UtZGl2aWRlcic7XG4gICAgZC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBjb25zdCB0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0cy5jbGFzc05hbWUgPSAndGFiLXN0YXR1cyc7XG4gICAgdHMuZGF0YXNldC51cmwgPSBtLnVybDtcbiAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHRzLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICBkLmFwcGVuZCh0cyk7XG4gICAgY29uc3QgdSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB1LmNsYXNzTmFtZSA9ICd1cmwnO1xuICAgIHUudGV4dENvbnRlbnQgPSBtLnVybDtcbiAgICB1LmRhdGFzZXQudGlwID0gYCR7bS50aXRsZSA/PyAnJ30gwrcgJHttLnVybH1gO1xuICAgIGQuYXBwZW5kKHUpO1xuICAgIGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IG9uIHRoaXMgcGFnZSBpbiB0aGUgYWN0aXZlIHRhYiwgY2xpY2tpbmcgdGhlIFVSTFxuICAgICAgLy8gc2hvdWxkbid0IHJlbG9hZCBvciBzdGVhbCBmb2N1cyDigJQgaXQgc2hvdWxkIGp1c3QgYmUgYSBuby1vcFxuICAgICAgLy8gdmlzdWFsbHkgKHRoZSByb3cgYWxyZWFkeSBpbmRpY2F0ZXMgXCJvcGVuXCIgdmlhIC50YWItc3RhdHVzKS4gVGhlXG4gICAgICAvLyB1c2VyIGNvbXBsYWluZWQgYWJvdXQgZ2V0dGluZyBmb3JjZWQgaW50byBhIG5hdmlnYXRpb24gd2hlbiB0aGV5XG4gICAgICAvLyB3ZXJlIGp1c3QgdHJ5aW5nIHRvIHJlYWQgdGhlIHJvdy5cbiAgICAgIGlmIChtLnVybCA9PT0gbGl2ZVRhYlVybCkge1xuICAgICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgb24gdGhpcyBwYWdlJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByID0gYXdhaXQgc2VuZFRvQmc8e2ZvdW5kPzogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAnc3dpdGNoLXRvLXRhYicsIHVybDogbS51cmwsIG9wZW5JZk1pc3Npbmc6IHRydWV9KTtcbiAgICAgIGlmIChyPy5mb3VuZCkgc2V0U3RhdHVzKCdTd2l0Y2hlZCB0byB0YWInKTtcbiAgICAgIGVsc2UgaWYgKHI/Lm9wZW5lZCkgc2V0U3RhdHVzKCdPcGVuZWQgaW4gbmV3IHRhYicpO1xuICAgICAgZWxzZSBzZXRTdGF0dXMoXCJDb3VsZG4ndCBvcGVuIHRhYlwiLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGQ7XG4gIH07XG5cbiAgY29uc3QgdGl0bGVGcm9tRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChlLnRlc3RJZCkgcmV0dXJuIGBbdGVzdElkPSR7ZS50ZXN0SWR9XWA7XG4gICAgaWYgKGUuaWQpIHJldHVybiBgIyR7ZS5pZH1gO1xuICAgIGlmIChlLmNsYXNzZXM/Lmxlbmd0aCkgcmV0dXJuIGAke2UudGFnfS4ke2UuY2xhc3Nlcy5zbGljZSgwLCAyKS5qb2luKCcuJyl9YDtcbiAgICByZXR1cm4gZS5zZWxlY3RvciB8fCBlLnRhZyB8fCAnKHVua25vd24pJztcbiAgfTtcblxuICAvLyBQaWNrIHRoZSBtb3N0IFwiaHVtYW5seSByZWFkYWJsZVwiIGxhYmVsIGZvciB0aGUgYnViYmxlIHByZXZpZXcuIFByZWZlcnNcbiAgLy8gdmlzaWJsZS10by11c2VyIHRleHQgaW4gdGhpcyBwcmlvcml0eTpcbiAgLy8gICAxLiBpbm5lclRleHQgLyB0ZXh0Q29udGVudCAoYGVudHJ5LnRleHRgKSDigJQgd2hhdCB0aGUgdXNlciByZWFkcyBvbiBzY3JlZW5cbiAgLy8gICAyLiBhY2Nlc3NpYmxlTmFtZSAoYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZhbGxiYWNrIGNoYWluKVxuICAvLyAgIDMuIGlucHV0IHZhbHVlIChza2lwcGVkIGlmIGl0J3MgdGhlIG1hc2tlZCBwYXNzd29yZCBwbGFjZWhvbGRlcilcbiAgLy8gICA0LiBpbnB1dCBwbGFjZWhvbGRlclxuICAvLyAgIDUuIGltZyBhbHRcbiAgLy8gICA2LiBjb21wb25lbnRSb290IChlLmcuIFwiYnV0dG9uI2N0YVwiKVxuICAvLyAgIDcuIHRpdGxlRnJvbUVudHJ5IOKAlCBsYXN0LXJlc29ydCB0YWcvY2xhc3MvaWQgZmFsbGJhY2tcbiAgLy8gQ1NTIGhhbmRsZXMgdmlzdWFsIHRydW5jYXRpb24gdmlhIHRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7IHdlIHNoaXAgdGhlXG4gIC8vIGZ1bGwgc3RyaW5nIHNvIHRoZSB0b29sdGlwIG9uIGhvdmVyIGNhbiBzaG93IHRoZSBjb21wbGV0ZSB2YWx1ZS5cbiAgY29uc3QgbmljZUxhYmVsID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXh0KSByZXR1cm4gZS50ZXh0O1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lKSByZXR1cm4gZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBjb25zdCB2ID0gZS5hdHRycz8udmFsdWU7XG4gICAgaWYgKHYgJiYgdiAhPT0gJ+KAouKAouKAouKAoicpIHJldHVybiB2O1xuICAgIGlmIChlLmF0dHJzPy5wbGFjZWhvbGRlcikgcmV0dXJuIGUuYXR0cnMucGxhY2Vob2xkZXI7XG4gICAgaWYgKGUuYXR0cnM/LmFsdCkgcmV0dXJuIGUuYXR0cnMuYWx0O1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QpIHJldHVybiBlLmNvbXBvbmVudFJvb3Q7XG4gICAgcmV0dXJuIHRpdGxlRnJvbUVudHJ5KGUpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclNlbGVjdG9yID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCB2YWxpZCA9IHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHNhbWVQYXRoID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKSA9PT0gbGl2ZVRhYlBhdGg7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgc2VsZWN0b3InO1xuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdzdGFsZScpO1xuICAgIGVsc2UgaWYgKHZhbGlkID09PSBmYWxzZSAmJiAhc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdkaWZmLXBhZ2UnKTtcbiAgICBpZiAobS5waW5uZWQpIGRpdi5jbGFzc0xpc3QuYWRkKCdwaW5uZWQnKTtcbiAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBkaXYuY2xhc3NMaXN0LmFkZCgnaGFzLWdyb3VwJyk7XG4gICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgPT09IGxhc3RBY3RpdmVTZWxlY3RvcikgZGl2LmNsYXNzTGlzdC5hZGQoJ2xhc3QtYWN0aXZlJyk7XG4gICAgLy8gQXV0by1leHBhbmQgb24gc2VhcmNoIGhpdCBzbyB0aGUgdXNlciBzZWVzIHdoZXJlIHRoZSBtYXRjaCBsYW5kZWQuXG4gICAgY29uc3QgbWF0Y2hlZEJvZHkgPSBib2R5TWF0Y2hlc1NlYXJjaChtKTtcbiAgICBpZiAobWF0Y2hlZEJvZHkpIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcsICdzZWFyY2gtaGl0Jyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5kYXRhc2V0LnNlbGVjdG9yID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAvLyBEcmFnLXRvLXJlcGFyZW50OiBldmVyeSBzZWxlY3RvciBidWJibGUgaXMgYSB2YWxpZCBkcm9wIHRhcmdldCBmb3JcbiAgICAvLyBhIGNvbW1lbnQgYmVpbmcgZHJhZ2dlZCBmcm9tIGVsc2V3aGVyZSBpbiB0aGUgc2lkZWJhci5cbiAgICB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0KGRpdiwgbSk7XG5cbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnaGVhZCc7XG4gICAgY29uc3QgY2FyZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY2FyZXQuY2xhc3NOYW1lID0gJ2NhcmV0JztcbiAgICBjYXJldC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZXZyb24tcmlnaHQnLCAxMik7XG4gICAgaGVhZC5hcHBlbmQoY2FyZXQpO1xuICAgIGNvbnN0IHBpbk1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBwaW5NYXJrZXIuY2xhc3NOYW1lID0gJ3Bpbi1tYXJrZXInO1xuICAgIHBpbk1hcmtlci5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3N0YXItZmlsbGVkJywgMTEpO1xuICAgIGhlYWQuYXBwZW5kKHBpbk1hcmtlcik7XG4gICAgY29uc3Qgc2VxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7bS5lbnRyeS5ufWA7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgc2VxLnRleHRDb250ZW50ICs9IGArJHttLmVudHJ5Lmdyb3VwLmxlbmd0aH1gO1xuICAgIGhlYWQuYXBwZW5kKHNlcSk7XG4gICAgY29uc3QgY29tcGFjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb21wYWN0LmNsYXNzTmFtZSA9ICdjb21wYWN0JztcbiAgICBjb25zdCBjb21wYWN0U3RyID0gbmljZUxhYmVsKG0uZW50cnkpO1xuICAgIGNvbXBhY3QuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goY29tcGFjdFN0ciwgc2VhcmNoUXVlcnkpO1xuICAgIC8vIFNob3cgdGhlIGZ1bGwgbGFiZWwgb24gaG92ZXIgZXZlbiB3aGVuIENTUyBlbGxpcHNpcyB0cnVuY2F0ZXMgdGhlXG4gICAgLy8gdmlzaWJsZSBwb3J0aW9uIOKAlCB1c2VmdWwgd2hlbiB0aGUgdmlzaWJsZSB0ZXh0L3BsYWNlaG9sZGVyIGlzIGxvbmcuXG4gICAgaWYgKGNvbXBhY3RTdHIubGVuZ3RoID4gMjQpIGNvbXBhY3QuZGF0YXNldC50aXAgPSBjb21wYWN0U3RyO1xuICAgIGhlYWQuYXBwZW5kKGNvbXBhY3QpO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgY29uc3QgciA9IG0uZW50cnkucmVjdDtcbiAgICBtZXRhLnRleHRDb250ZW50ID0gciA/IGAke3Iud33DlyR7ci5ofWAgOiAobS5lbnRyeS50YWcgPz8gJycpO1xuICAgIGhlYWQuYXBwZW5kKG1ldGEpO1xuICAgIGRpdi5hcHBlbmQoaGVhZCk7XG5cbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHN1bW1hcnkuY2xhc3NOYW1lID0gJ3BlZWstc3VtbWFyeSc7XG4gICAgc3VtbWFyeS5pbm5lckhUTUwgPSBgPHNwYW4gZGF0YS1pY29uPVwiYWxlcnQtY2lyY2xlXCIgZGF0YS1zaXplPVwiMTFcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInRcIj4ke2Rpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2RpZmYtcGFnZScpID8gJ2RpZmZlcmVudCBwYWdlJyA6ICdzdGFsZSd9PC9zcGFuPmA7XG4gICAgaGVhZC5hcHBlbmQoc3VtbWFyeSk7XG4gICAgbW91bnRJY29ucyhzdW1tYXJ5KTtcblxuICAgIGNvbnN0IGVyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVyci5jbGFzc05hbWUgPSAncGVlay1lcnJvcic7XG4gICAgY29uc3QgcmVhc29uID0gc2VsZWN0b3JFcnJvcnMuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHBhdGhGcm9tRW50cnkgPSBwYXRoT2YobS5lbnRyeS51cmwgPz8gJycpO1xuICAgIGVyci5pbm5lckhUTUwgPSBzYW1lUGF0aFxuICAgICAgPyBgPGI+U3RhbGU8L2I+IMK3ICR7ZXNjYXBlSHRtbChyZWFzb24gPz8gJ25vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzLicpfTxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmBcbiAgICAgIDogYENhcHR1cmVkIG9uIDxjb2RlPiR7ZXNjYXBlSHRtbChwYXRoRnJvbUVudHJ5KX08L2NvZGU+IOKAlCBjdXJyZW50IHRhYiBpcyA8Y29kZT4ke2VzY2FwZUh0bWwobGl2ZVRhYlBhdGggPz8gJycpfTwvY29kZT4uIFN3aXRjaCB0YWJzIHRvIHZhbGlkYXRlLjxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmA7XG4gICAgZGl2LmFwcGVuZChlcnIpO1xuXG4gICAgLy8gQW5jZXN0b3IgYnJlYWRjcnVtYiDigJQgUGxhc21pYy1zdHlsZSBlc2NhbGF0b3IuIENoaXBzIGZvciBlYWNoIGVudHJ5IGluXG4gICAgLy8gZW50cnkuYW5jZXN0b3JzIChjbG9zZXN0IGZpcnN0KS4gQ2xpY2sgYSBjaGlwIHRvIGNhcHR1cmUgdGhhdFxuICAgIC8vIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2UgKGRlcHRoID0gY2hpcCBpbmRleCArIDEgc2luY2UgdGhlIGVudHJ5J3NcbiAgICAvLyBvd24gc2VsZWN0b3IgaXMgZGVwdGggMCkuIEJyaWdodG5lc3MgZ3JhZGllbnQgZGFya2VucyBkZWVwZXIgY2hpcHMuXG4gICAgaWYgKG0uZW50cnkuYW5jZXN0b3JzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNydW1icyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY3J1bWJzLmNsYXNzTmFtZSA9ICdhbmNlc3Rvci1jcnVtYnMnO1xuICAgICAgY3J1bWJzLmRhdGFzZXQudGlwID0gJ0NsaWNrIGEgY3J1bWIgdG8gZXNjYWxhdGUgdGhlIGNhcHR1cmUgdG8gYW4gYW5jZXN0b3IgZWxlbWVudCc7XG4gICAgICBtLmVudHJ5LmFuY2VzdG9ycy5mb3JFYWNoKChhbmMsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBjaGlwLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgY2hpcC5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY2hpcCc7XG4gICAgICAgIC8vIEJyaWdodG5lc3MgZ3JhZGllbnQ6IGRlZXBlciBjaGlwcyBnZXQgcHJvZ3Jlc3NpdmVseSBkaW1tZXIuXG4gICAgICAgIGNoaXAuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHsoMSAtIGkgKiAwLjA4KS50b0ZpeGVkKDIpfSlgO1xuICAgICAgICBjb25zdCBsYWJlbCA9IGFuYy50ZXN0SWQgPyBgWyR7YW5jLnRlc3RJZH1dYFxuICAgICAgICAgIDogYW5jLmlkID8gYCMke2FuYy5pZH1gXG4gICAgICAgICAgOiBhbmMuY2xhc3Nlcz8ubGVuZ3RoID8gYCR7YW5jLnRhZ30uJHthbmMuY2xhc3Nlc1swXX1gXG4gICAgICAgICAgOiBhbmMudGFnO1xuICAgICAgICBjaGlwLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNoaXAuZGF0YXNldC50aXAgPSBgQ2FwdHVyZSB0aGUgYW5jZXN0b3IgJHtpICsgMX0gbGV2ZWwke2kgPyAncycgOiAnJ30gdXAgwrcgJHthbmMudGFnfSR7YW5jLmlkID8gJyMnICsgYW5jLmlkIDogJyd9YDtcbiAgICAgICAgLy8gSG92ZXItcHJldmlldyB0aGUgYW5jZXN0b3Igb24gdGhlIGxpdmUgcGFnZSBzbyB0aGUgdXNlciBjYW4gc2VlXG4gICAgICAgIC8vIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY29tbWl0dGluZy4gTWlycm9ycyBob3dcbiAgICAgICAgLy8gaG92ZXJpbmcgYSBzZWxlY3RvciBidWJibGUgcGFpbnRzIGl0cyByaW5nLiBDbGVhcmluZyBvblxuICAgICAgICAvLyBtb3VzZWxlYXZlIHN3YXBzIGJhY2sgdG8gdGhlIGJ1YmJsZSdzIG93biBvdXRsaW5lICh0aGUgYnViYmxlJ3NcbiAgICAgICAgLy8gbW91c2VlbnRlciBoYW5kbGVyIHBhaW50ZWQgaXQ7IGxlYXZpbmcgdGhlIGNoaXAganVzdCByZW1vdmVzXG4gICAgICAgIC8vIHRoZSBvdmVycmlkZSkuXG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDF9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAvLyBSZS1wYWludCB0aGUgYnViYmxlJ3Mgb3duIHJpbmcgcmF0aGVyIHRoYW4gY2xlYXJpbmcgZW50aXJlbHlcbiAgICAgICAgICAvLyBzbyB0aGUgdXNlciBkb2Vzbid0IHNlZSBhIGZsaWNrZXIgb2YgXCJub3RoaW5nXCIgYmV0d2VlbiBjaGlwcy5cbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtcbiAgICAgICAgICAgIGtpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGRlcHRoOiBpICsgMSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAocmVwbHk/Lm9rKSBzZXRTdGF0dXMoYENhcHR1cmVkIGFuY2VzdG9yICR7YW5jLnRhZ31gKTtcbiAgICAgICAgICBlbHNlIHNldFN0YXR1cygnQ291bGQgbm90IGNhcHR1cmUgYW5jZXN0b3InLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjcnVtYnMuYXBwZW5kKGNoaXApO1xuICAgICAgfSk7XG4gICAgICBkaXYuYXBwZW5kKGNydW1icyk7XG4gICAgfVxuXG4gICAgLy8gUHJldmlldyB0aWxlIOKAlCBvbmx5IHdoZW4gd2UgaGF2ZSBhIHRodW1ibmFpbCBkYXRhVXJsIGluIHRoZSBpbi1tZW1vcnlcbiAgICAvLyBzaG90cyBtYXAuIFRoZSBmdWxsIFBORyBsaXZlcyBvbiBkaXNrIHVuZGVyIC5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy87XG4gICAgLy8gdGhlIGRhdGFVcmwgaXMganVzdCBhIHNpZGUtcGFuZWwtZnJpZW5kbHkgZG93bnNjYWxlICjiiaQzMjBweCB3aWRlKS5cbiAgICBjb25zdCBzaG90RGF0YVVybCA9IHNob3RzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBpZiAoc2hvdERhdGFVcmwpIHtcbiAgICAgIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXcuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBpbWcuY2xhc3NOYW1lID0gJ3Nob3QnO1xuICAgICAgaW1nLnNyYyA9IHNob3REYXRhVXJsO1xuICAgICAgaW1nLmFsdCA9IGBTY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gO1xuICAgICAgcHJldmlldy5hcHBlbmQoaW1nKTtcbiAgICAgIGRpdi5hcHBlbmQocHJldmlldyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0cy5jbGFzc05hbWUgPSAnZW50LXN0YXRzJztcbiAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgIGNvbnN0IG15VG9rZW5zID0gdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtLmVudHJ5KSk7XG4gICAgY29uc3QgdG90YWxUb2tlbnMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobW0pOiBtbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5yZWR1Y2UoKHMsIG1tKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtbS5lbnRyeSkpLCAwKTtcbiAgICBjb25zdCBzaGFyZVBjdCA9IHRvdGFsVG9rZW5zID4gMCA/IE1hdGgucm91bmQoKG15VG9rZW5zIC8gdG90YWxUb2tlbnMpICogMTAwKSA6IDA7XG4gICAgY29uc3QgZ3JvdXBDb3VudCA9IG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGdyb3VwVG9rZW5zID0gKG0uZW50cnkuZ3JvdXAgPz8gW10pLnJlZHVjZSgocywgZykgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkoZykpLCAwKTtcbiAgICB0eXBlIFN0YXRDZWxsID0ge2xhYmVsOiBzdHJpbmc7IHZhbHVlOiBzdHJpbmc7IHRpcDogc3RyaW5nfTtcbiAgICBjb25zdCBjZWxsczogU3RhdENlbGxbXSA9IFtcbiAgICAgIHtsYWJlbDogJ0hUTUwnLCB2YWx1ZTogYCR7bS5lbnRyeS5vdXRlckhUTUw/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ091dGVyIEhUTUwgY2hhciBsZW5ndGgnfSxcbiAgICAgIHtsYWJlbDogJ1Rva2VucycsIHZhbHVlOiBgJHtteVRva2Vuc31gLCB0aXA6ICdBcHByb3ggTExNIHRva2VucyBmb3IgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnU2hhcmUnLCB2YWx1ZTogYCR7c2hhcmVQY3R9JWAsIHRpcDogJ1Rva2VuIHNoYXJlIG9mIGFsbCBzZWxlY3RvcnMnfSxcbiAgICAgIHtsYWJlbDogJ0NvbW1lbnRzJywgdmFsdWU6IGAke2ZiLmxlbmd0aH1gLCB0aXA6ICdJbmxpbmUgY29tbWVudHMgdGhyZWFkZWQgdW5kZXIgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnUnVsZXMnLCB2YWx1ZTogYCR7bS5lbnRyeS5tYXRjaGVkUnVsZXM/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ01hdGNoZWQgQ1NTIHJ1bGVzJ30sXG4gICAgICB7bGFiZWw6ICdTdHlsZXMnLCB2YWx1ZTogYCR7T2JqZWN0LmtleXMobS5lbnRyeS5zdHlsZXMgPz8ge30pLmxlbmd0aH1gLCB0aXA6ICdDb21wdXRlZC1zdHlsZSBmaWVsZHMga2VwdCd9LFxuICAgIF07XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAnLCB2YWx1ZTogYCR7Z3JvdXBDb3VudH1gLCB0aXA6ICdNZW1iZXJzIGZvbGRlZCBpbnRvIHRoaXMgZ3JvdXAnfSk7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwIFQnLCB2YWx1ZTogYCR7Z3JvdXBUb2tlbnN9YCwgdGlwOiAnVG9rZW5zIGNvbnRyaWJ1dGVkIGJ5IGdyb3VwIG1lbWJlcnMnfSk7XG4gICAgfVxuICAgIHN0YXRzLmlubmVySFRNTCA9IGNlbGxzLm1hcCgoYykgPT5cbiAgICAgIGA8c3BhbiBjbGFzcz1cImVudC1zdGF0XCIgZGF0YS10aXA9XCIke2VzY2FwZUh0bWwoYy50aXApfVwiPjxzcGFuIGNsYXNzPVwibGJsXCI+JHtjLmxhYmVsfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbFwiPiR7Yy52YWx1ZX08L3NwYW4+PC9zcGFuPmAsXG4gICAgKS5qb2luKCcnKTtcbiAgICBkaXYuYXBwZW5kKHN0YXRzKTtcblxuICAgIC8vIOKUgOKUgCBKU09OIHBhbmUgd2l0aCB0b29sYmFyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vIFRvb2xiYXIgYWJvdmUgdGhlIEpTT04gYm9keTogbGVmdCA9IGxpbmUtd3JhcCB0b2dnbGUsIHJpZ2h0ID0gY29weS5cbiAgICAvLyBUaGUgSlNPTiBpdHNlbGYgcmVmbGVjdHMgdGhlIGdsb2JhbCBgbWluaWZ5YCBzZXR0aW5nIHNvIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgc2FtZSBzaGFwZSB0aGF0IHdpbGwgZW5kIHVwIGluIHRoZSBleHBvcnQuXG4gICAgY29uc3QganNvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uV3JhcC5jbGFzc05hbWUgPSAnYm9keS1qc29uLXdyYXAnO1xuICAgIGNvbnN0IGpzb25CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uQmFyLmNsYXNzTmFtZSA9ICdib2R5LWpzb24tYmFyJztcblxuICAgIC8vIExpbmUtd3JhcCBjaGVja2JveCAocGVyLWJ1YmJsZSBsb2NhbCBzdGF0ZSwgZGVmYXVsdCBPTikuXG4gICAgY29uc3Qgd3JhcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB3cmFwTGFiZWwuY2xhc3NOYW1lID0gJ2pzb24td3JhcC10b2dnbGUnO1xuICAgIHdyYXBMYWJlbC5kYXRhc2V0LnRpcCA9ICdXcmFwIGxvbmcgbGluZXMgaW5zdGVhZCBvZiBob3Jpem9udGFsIHNjcm9sbCc7XG4gICAgY29uc3Qgd3JhcENoZWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB3cmFwQ2hlY2sudHlwZSA9ICdjaGVja2JveCc7XG4gICAgd3JhcENoZWNrLmNoZWNrZWQgPSB0cnVlO1xuICAgIHdyYXBMYWJlbC5hcHBlbmQod3JhcENoZWNrLCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIFdyYXAnKSk7XG4gICAganNvbkJhci5hcHBlbmQod3JhcExhYmVsKTtcblxuICAgIC8vIENvcHkgYnV0dG9uIChtaXJyb3JzIHRoZSBcIkNvcHkgdGhpcyBjYXB0dXJlIGFzIEpTT05cIiBhY3Rpb24gYmVsb3csXG4gICAgLy8gc3VyZmFjZWQgYXQgdGhlIHRvcCBzbyB0aGUgdXNlciBkb2Vzbid0IGhhdmUgdG8gc2Nyb2xsIHBhc3QgdGhlIEpTT05cbiAgICAvLyB0byBmaW5kIGl0KS5cbiAgICBjb25zdCBjb3B5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29weUJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgY29weUJ0bi5jbGFzc05hbWUgPSAnaWNvbmJ0biBqc29uLWNvcHknO1xuICAgIGNvcHlCdG4uZGF0YXNldC50aXAgPSAnQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTic7XG4gICAgY29weUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ29weSBjYXB0dXJlIGFzIEpTT04nKTtcbiAgICBjb3B5QnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY29weScsIDEzKTtcbiAgICBjb3B5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAvLyBIb25vciB0aGUgc2FtZSBzaGFwZSB0aGUgSlNPTiBiZWxvdyBzaG93cy5cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBwcmVmcy5taW5pZnkgPyBzbGltRW50cnkobS5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZX0pIDogbS5lbnRyeTtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIHByZWZzLm1pbmlmeSA/IDAgOiAyKSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBKU09OJyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgSlNPTicsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSk7XG4gICAganNvbkJhci5hcHBlbmQoY29weUJ0bik7XG4gICAganNvbldyYXAuYXBwZW5kKGpzb25CYXIpO1xuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvZHkuY2xhc3NOYW1lID0gJ2JvZHktanNvbiB3cmFwLW9uJztcbiAgICAvLyBSZWZsZWN0IHRoZSBtaW5pZnkgcHJlZjogd2hlbiBtaW5pZmllZCwgc2hvdyB0aGUgc2xpbUVudHJ5LXNoYXBlZFxuICAgIC8vIGV4cG9ydCBmb3JtIChjb21wYWN0LCBzaW5nbGUtbGluZSkuIE90aGVyd2lzZSBwcmV0dHktcHJpbnQgdGhlIGZ1bGxcbiAgICAvLyBlbnRyeSBzbyBpdCdzIHJlYWRhYmxlLlxuICAgIGNvbnN0IHJlbmRlckpzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0gcHJlZnMubWluaWZ5ID8gc2xpbUVudHJ5KG0uZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWV9KSA6IG0uZW50cnk7XG4gICAgICBjb25zdCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgcHJlZnMubWluaWZ5ID8gMCA6IDIpO1xuICAgICAgYm9keS5pbm5lckhUTUwgPSBoaWdobGlnaHRKc29uKHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIHNldFN0YXR1cygnUmUtY2FwdHVyZSBmYWlsZWQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoSlNPTi5zdHJpbmdpZnkobS5lbnRyeSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgZW50cnknKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBlbnRyeScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckZlZWRiYWNrID0gKG06IEZlZWRiYWNrTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIGZlZWRiYWNrJztcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSBkaXYuY2xhc3NMaXN0LmFkZCgndGhyZWFkZWQnKTtcbiAgICBkaXYuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgZGl2LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKG0udGV4dCwgc2VhcmNoUXVlcnkpO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIHtcbiAgICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBzZWxlY3RvciDigJQgcHJlZmVyIHBhcmVudFVpZCAodGhlIHBlcnNpc3RlZCBGSylcbiAgICAgIC8vIG92ZXIgY2FwdHVyZS1hZGphY2VuY3ksIHNpbmNlIGRyYWctdG8tcmVwYXJlbnQgbW92ZXMgdGhlIGNoaXAgYnV0XG4gICAgICAvLyB0aGUgdHJhaWxpbmctc2VsZWN0b3IgaGV1cmlzdGljIGdpdmVzIHN0YWxlIHJlc3VsdHMgdW50aWwgcmVuZGVyXG4gICAgICAvLyBzZXR0bGVzLiBUaGUgYW5ub3RhdGlvbiBvdmVybGF5IG5lZWRzIHRoZSBwYXJlbnQncyBzZWxlY3RvciB0b1xuICAgICAgLy8gYW5jaG9yIHRoZSBvbi1wYWdlIHRvb2x0aXAuXG4gICAgICBjb25zdCB7cGFyZW50U2VsLCBwYXJlbnRVaWR9ID0gKCgpID0+IHtcbiAgICAgICAgaWYgKG0ucGFyZW50VWlkKSB7XG4gICAgICAgICAgY29uc3QgcCA9IG1lc3NhZ2VzLmZpbmQoXG4gICAgICAgICAgICAobW0pID0+IG1tLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgKG1tIGFzIFNlbGVjdG9yTWVzc2FnZSkuZW50cnkudWlkID09PSBtLnBhcmVudFVpZCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChwICYmIHAudHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHtwYXJlbnRTZWw6IHAuZW50cnkuc2VsZWN0b3IsIHBhcmVudFVpZDogcC5lbnRyeS51aWR9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7cGFyZW50U2VsOiBsYXN0U2VsZWN0b3JTZWwsIHBhcmVudFVpZDogdW5kZWZpbmVkIGFzIHN0cmluZyB8IHVuZGVmaW5lZH07XG4gICAgICB9KSgpO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIGdvbGQ6IHRydWV9KTtcbiAgICAgICAgLy8gU2Nyb2xsIHRoZSBwYXJlbnQgZWxlbWVudCBpbnRvIHZpZXcgKyBzaG93IHRoZSBvbi1wYWdlXG4gICAgICAgIC8vIGFubm90YXRpb24gdG9vbHRpcCByZW5kZXJpbmcgVEhJUyBjb21tZW50J3MgdGV4dC4gUGFzcyB0aGVcbiAgICAgICAgLy8gcGFyZW50J3MgdWlkIHNvIGEgc2FtZS1zZWxlY3RvciBzaWJsaW5nIGNhcHR1cmUgZG9lc24ndCBnZXRcbiAgICAgICAgLy8gbWlzdGFrZW5seSBpZGVudGlmaWVkIGFzIFwidGhlIHNhbWUgdGFyZ2V0XCIgYnkgdGhlIGNvbnRlbnRcbiAgICAgICAgLy8gc2NyaXB0J3MgYW5ub3RhdGlvbiBvdmVybGF5LlxuICAgICAgICBpZiAocHJlZnMuYXV0b1Njcm9sbFRvSG92ZXJlZCkge1xuICAgICAgICAgIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgc3RpY2t5OiB0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VuZFRvQ1Moe1xuICAgICAgICAgIGtpbmQ6ICdhbm5vdGF0aW9uJyxcbiAgICAgICAgICBzZWxlY3RvcjogcGFyZW50U2VsLFxuICAgICAgICAgIHBheWxvYWQ6IHtzZWxlY3RvcjogcGFyZW50U2VsLCB1aWQ6IHBhcmVudFVpZCwgY2FwdHVyZWQ6IHRydWUsIGZlZWRiYWNrOiBbbS50ZXh0XX0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZGl2LmRhdGFzZXQuY29tbWVudElkID0gbS5pZDtcbiAgICBjb25zdCBiZWdpbkNvbW1lbnREcmFnID0gKGU6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcsIG0uaWQpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ3RleHQvcGxhaW4nLCBtLnRleHQpO1xuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgIH07XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFjdGlvbnMuY2xhc3NOYW1lID0gJ2FjdGlvbnMnO1xuICAgIGNvbnN0IGRyYWdIYW5kbGUgPSBhY3Rpb25CdG4oJ2dyaXAnLCAnRHJhZyB0aGlzIGhhbmRsZSBvbnRvIGEgc2VsZWN0b3IgdG8gcmVwYXJlbnQnLCAoKSA9PiB7IC8qIGRyYWcgaGFuZGxlIG9ubHkgKi8gfSk7XG4gICAgZHJhZ0hhbmRsZS5jbGFzc0xpc3QuYWRkKCdkcmFnLWhhbmRsZScpO1xuICAgIGRyYWdIYW5kbGUuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGJlZ2luQ29tbWVudERyYWcpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRyYWdIYW5kbGUpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IGNvbW1lbnQgdGV4dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KG0udGV4dCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY29tbWVudCcpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3BlbmNpbCcsICdFZGl0IGNvbW1lbnQnLCAoKSA9PiBlbnRlckZlZWRiYWNrRWRpdChkaXYsIG0pLCB7c2l6ZTogMTV9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgLy8gRHJvcCBoYW5kbGVyIHNoYXJlZCBieSBldmVyeSBzZWxlY3RvciBidWJibGUuIEFjY2VwdHMgYSBkcmFnZ2VkXG4gIC8vIGNvbW1lbnQgSUQgdmlhIHRoZSBgYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudGAgTUlNRSwgdXBkYXRlc1xuICAvLyBwYXJlbnRVaWQgKyBhZGphY2VuY3ksIHBlcnNpc3RzLCByZS1yZW5kZXJzLlxuICBjb25zdCB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IFNlbGVjdG9yTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICBjb25zdCB0eXBlcyA9IGUuZGF0YVRyYW5zZmVyPy50eXBlcztcbiAgICAgIGlmICghdHlwZXMgfHwgIUFycmF5LmZyb20odHlwZXMpLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JykpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcm9wLXRhcmdldCcpO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZSkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyPy5nZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50Jyk7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBzcmNJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gaWQpO1xuICAgICAgaWYgKHNyY0lkeCA8IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHNyYyA9IG1lc3NhZ2VzW3NyY0lkeF0hIGFzIEZlZWRiYWNrTWVzc2FnZTtcbiAgICAgIGlmIChzcmMudHlwZSAhPT0gJ2ZlZWRiYWNrJykgcmV0dXJuO1xuICAgICAgY29uc3QgZHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgaWYgKGRzdElkeCA8IDApIHJldHVybjtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICAvLyBVcGRhdGUgdGhlIEZLIHBvaW50ZXIgZmlyc3Qg4oCUIHRoYXQncyB0aGUgc291cmNlIG9mIHRydXRoIGluXG4gICAgICAvLyBleHBvcnRzLiBBZGphY2VuY3kgaXMganVzdCBhIHJlbmRlciBjb252ZW5pZW5jZS5cbiAgICAgIHNyYy5wYXJlbnRVaWQgPSBtLmVudHJ5LnVpZDtcbiAgICAgIC8vIFNwbGljZSBzcmMgb3V0IG9mIGl0cyBjdXJyZW50IHNsb3QgYW5kIHJlLWluc2VydCByaWdodCBhZnRlciB0aGVcbiAgICAgIC8vIG5ldyBwYXJlbnQgKGFuZCBhbnkgZmVlZGJhY2sgYWxyZWFkeSB0cmFpbGluZyBpdCwgc28gdGhlIG1vc3QtXG4gICAgICAvLyByZWNlbnQgZmVlZGJhY2sgZW5kcyB1cCBuZWFyZXN0IHRoZSBwYXJlbnQgdmlzdWFsbHkpLlxuICAgICAgbWVzc2FnZXMuc3BsaWNlKHNyY0lkeCwgMSk7XG4gICAgICBjb25zdCBuZXdEc3RJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBsZXQgaW5zZXJ0QXQgPSBuZXdEc3RJZHggKyAxO1xuICAgICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XSEudHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwgc3JjKTtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IHJlcGFyZW50ZWQnKTtcbiAgICB9KTtcbiAgfTtcblxuICB0eXBlIEFjdGlvbkJ0bk9wdHMgPSB7d2Fybj86IGJvb2xlYW47IHRvZ2dsZWQ/OiBib29sZWFuOyBzaXplPzogbnVtYmVyfTtcbiAgY29uc3QgYWN0aW9uQnRuID0gKGljb246IHN0cmluZywgdGl0bGU6IHN0cmluZywgZm46ICgpID0+IHZvaWQsIG9wdHM6IEFjdGlvbkJ0bk9wdHMgPSB7fSk6IEhUTUxCdXR0b25FbGVtZW50ID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYi50eXBlID0gJ2J1dHRvbic7XG4gICAgYi5kYXRhc2V0LnRpcCA9IHRpdGxlO1xuICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGl0bGUpO1xuICAgIGlmIChvcHRzLndhcm4pIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGlmIChvcHRzLnRvZ2dsZWQpIGIuY2xhc3NMaXN0LmFkZCgndG9nZ2xlZCcpO1xuICAgIC8vIERlZmF1bHQgaWNvbiBzaXplIDEzIHJlYWRzIHNsaWdodGx5IHNtYWxsIGluIGEgMjLDlzIyIGJ1dHRvbiDigJQgZmluZVxuICAgIC8vIGZvciBpY29ucyB3aXRoIHNpbXBsZSBzaGFwZXMgKGNyb3NzaGFpciwgbGlzdC10cmVlLCB1bmRvKSBidXQgdmlzaWJseVxuICAgIC8vIHNxdWVlemVkIGZvciBgbWVzc2FnZS1zcXVhcmUtcGx1c2AgYW5kIGBwZW5jaWxgLCB3aGVyZSB0aGVcbiAgICAvLyBpbnRlcmlvciBzdHJva2VzIHZhbmlzaCBpbnRvIGhhaXJsaW5lIGJsdXIuIENhbGxlcnMgY2FuIGJ1bXAgd2l0aFxuICAgIC8vIGBzaXplOiAxNWAgZm9yIHRob3NlLlxuICAgIGIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKGljb24sIG9wdHMuc2l6ZSA/PyAxMyk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGZuKCk7IH0pO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUJ0biA9IChvbkNvbmZpcm06ICgpID0+IHZvaWQpOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGIuZGF0YXNldC50aXAgPSAnRGVsZXRlJztcbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZXZlcnRUaW1lciA9IDA7XG4gICAgY29uc3QgcmV2ZXJ0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbmZpcm0teWVzLCAuY29uZmlybS1ubycpKSBuLnJlbW92ZSgpO1xuICAgICAgaWYgKCFiLnBhcmVudEVsZW1lbnQpIHBhcmVudC5hcHBlbmQoYik7XG4gICAgICBjbGVhclRpbWVvdXQocmV2ZXJ0VGltZXIpO1xuICAgIH07XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcGFyZW50ID0gYi5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgeWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB5ZXMudHlwZSA9ICdidXR0b24nO1xuICAgICAgeWVzLmNsYXNzTmFtZSA9ICdjb25maXJtLXllcyc7XG4gICAgICB5ZXMuZGF0YXNldC50aXAgPSAnQ29uZmlybSBkZWxldGUnO1xuICAgICAgeWVzLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAxMyk7XG4gICAgICB5ZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyBvbkNvbmZpcm0oKTsgfSk7XG4gICAgICBjb25zdCBubyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgbm8udHlwZSA9ICdidXR0b24nO1xuICAgICAgbm8uY2xhc3NOYW1lID0gJ2NvbmZpcm0tbm8nO1xuICAgICAgbm8uZGF0YXNldC50aXAgPSAnQ2FuY2VsIGRlbGV0ZSc7XG4gICAgICBuby5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAxMyk7XG4gICAgICBuby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4geyBldi5zdG9wUHJvcGFnYXRpb24oKTsgcmV2ZXJ0KCk7IH0pO1xuICAgICAgYi5yZXBsYWNlV2l0aCh5ZXMpO1xuICAgICAgeWVzLmFmdGVyKG5vKTtcbiAgICAgIHJldmVydFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQocmV2ZXJ0LCA4MDAwKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBlbnRlckZlZWRiYWNrRWRpdCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBGZWVkYmFja01lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmV4dC5jbGFzc05hbWUgPSAnbXNnIGZlZWRiYWNrIGVkaXRpbmcnO1xuICAgIGlmIChkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aHJlYWRlZCcpKSBuZXh0LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgbmV4dC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBuZXh0LmFwcGVuZChidWlsZElubGluZUNvbW1lbnQoe1xuICAgICAgaW5pdGlhbDogbS50ZXh0LFxuICAgICAgb25DYW5jZWw6ICgpID0+IHsgZGl2LnJlcGxhY2VXaXRoKGRpdi5jbG9uZU5vZGUodHJ1ZSkpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4ge1xuICAgICAgICBjb25zdCB0cmltbWVkID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRyaW1tZWQgPT09IG0udGV4dCkgeyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG0udGV4dCA9IHRyaW1tZWQ7XG4gICAgICAgIC8vIFNldmVyaXR5IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgVUkuIFN0cmlwIGFueSBsZWdhY3kgdmFsdWVcbiAgICAgICAgLy8gdGhhdCBjYW1lIGJhY2sgZnJvbSBhbiBvbGRlciBKU09OTCBpbXBvcnQgc28gc2F2ZXMgZG9uJ3Qga2VlcFxuICAgICAgICAvLyByZS1lbWl0dGluZyBpdC5cbiAgICAgICAgZGVsZXRlIChtIGFzIGFueSkuc2V2ZXJpdHk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgIH0pKTtcbiAgICBkaXYucmVwbGFjZVdpdGgobmV4dCk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlTWVzc2FnZSA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgY29uc3QgZmluaXNoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmlkICE9PSBpZCk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnRGVsZXRlZCcpO1xuICAgIH07XG4gICAgaWYgKCFlbCkgeyBmaW5pc2goKTsgcmV0dXJuOyB9XG4gICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICB2b2lkIGVsLm9mZnNldFdpZHRoO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3JlbW92aW5nJyk7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBjbGVhbnVwID0gKCk6IHZvaWQgPT4geyBpZiAoZG9uZSkgcmV0dXJuOyBkb25lID0gdHJ1ZTsgZmluaXNoKCk7IH07XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGNsZWFudXAsIHtvbmNlOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dChjbGVhbnVwLCAzODApO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBDb21wb3NlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZEZlZWRiYWNrID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBjb21wb3Nlci52YWx1ZS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIGluLW1lbW9yeSBtZXNzYWdlIGF0IGNyZWF0aW9uIHRpbWUgc28gdGhlXG4gICAgLy8gRksgaXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGguIFRoZSBzbGltIGVtaXQgbm8gbG9uZ2VyIGhhcyB0b1xuICAgIC8vIGluZmVyIHRoZSBwYXJlbnQgZnJvbSBjYXB0dXJlLWFkamFjZW5jeSwgYW5kIGBtYW5pZmVzdC5jb3VudHNgXG4gICAgLy8gYWNjdXJhdGVseSByZWZsZWN0cyBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycy5cbiAgICAvLyBXYWxrIGJhY2sgdG8gdGhlIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yIGJlZm9yZSBzcGxpY2UuXG4gICAgbGV0IHBJZHggPSBwb3NpdGlvbiAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9KTtcbiAgICBjb21wb3Nlci52YWx1ZSA9ICcnO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICBpZiAoc2VhcmNoUXVlcnkpIHsgc2VhcmNoUXVlcnkgPSAnJzsgc2VhcmNoLnZhbHVlID0gJyc7IH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdTZW50Jyk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAvLyBCdWcgIzI6IGZlZWRiYWNrJ3MgcGFyZW50IHNob3VsZCBoYXZlIGEgc2NyZWVuc2hvdC5cbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InICYmICFwYXJlbnQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgdm9pZCBmaXJlRWxlbWVudFNob3QocGFyZW50IGFzIFNlbGVjdG9yTWVzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyAoZSkgPT4ge1xuICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYW5kbGVkID0gYXdhaXQgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlcigpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBzZW5kRmVlZGJhY2soKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyAmJiBpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgc2V0U3RhdHVzKCdJbnNlcnQgbW9kZSBjYW5jZWxsZWQnKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCB1cGRhdGVDb21wb3Nlck1ldGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHQgPSBjb21wb3Nlci52YWx1ZTtcbiAgICBjb21wV29yZHMudGV4dENvbnRlbnQgPSBTdHJpbmcod29yZENvdW50KHQpKTtcbiAgICBjb21wVG9rZW5zLnRleHRDb250ZW50ID0gU3RyaW5nKHRva2VuQ291bnQodCkpO1xuICAgIGNvbXBvc2VyLmNsYXNzTGlzdC50b2dnbGUoJ2NtZC1tb2RlJywgL14+Ly50ZXN0KHQudHJpbSgpKSk7XG4gIH07XG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdXBkYXRlQ29tcG9zZXJNZXRlcik7XG5cbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIHNlYXJjaFF1ZXJ5ID0gc2VhcmNoLnZhbHVlLnRyaW0oKTtcbiAgICByZW5kZXIoKTtcbiAgICAvLyBCcmluZyB0aGUgZmlyc3QgbWF0Y2hlZCBidWJibGUgKyBpdHMgZmlyc3QgPG1hcms+IGludG8gdmlldywgc28gdGhlXG4gICAgLy8gdXNlciBzZWVzIHdoZXJlIHRoZSBoaXQgaXMgd2l0aG91dCBzY3JvbGxpbmcgbWFudWFsbHkuXG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaXJzdEhpdCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cuc2VsZWN0b3Iuc2VhcmNoLWhpdCcpO1xuICAgICAgICBpZiAoZmlyc3RIaXQpIHtcbiAgICAgICAgICBmaXJzdEhpdC5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcid9KTtcbiAgICAgICAgICBjb25zdCBtayA9IGZpcnN0SGl0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdtYXJrJyk7XG4gICAgICAgICAgbWs/LnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJ30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGZpcnN0TWF0Y2ggPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnIG1hcmsnKTtcbiAgICAgICAgICBmaXJzdE1hdGNoPy5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcid9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4geyBpZiAocGFsZXR0ZS5oaWRkZW4pIG9wZW5QYWxldHRlKHNlYXJjaC52YWx1ZSB8fCAnJyk7IH0pO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGlmIChwYWxldHRlLmhpZGRlbikgb3BlblBhbGV0dGUoc2VhcmNoLnZhbHVlIHx8ICcnKTsgfSk7XG4gICQoJ1tkYXRhLXNlYXJjaC1jbGVhcl0nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgc2VhcmNoLnZhbHVlID0gJyc7IHNlYXJjaFF1ZXJ5ID0gJyc7IHJlbmRlcigpOyB9KTtcblxuICBjb25zdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IG0gPSAvXj5cXHMqKC4rKSQvLmV4ZWMoY29tcG9zZXIudmFsdWUudHJpbSgpKTtcbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBzZWwgPSBtWzFdIS50cmltKCk7XG4gICAgaWYgKCFzZWwpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW59Pih7a2luZDogJ21hbnVhbC1jYXB0dXJlJywgc2VsZWN0b3I6IHNlbH0pO1xuICAgIGlmIChyZXBseT8ub2spIHsgY29tcG9zZXIudmFsdWUgPSAnJzsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyBzZXRTdGF0dXMoJ0NhcHR1cmVkICcgKyBzZWwpOyB9XG4gICAgZWxzZSBzZXRTdGF0dXMoJ1NlbGVjdG9yIGRpZCBub3QgbWF0Y2g6ICcgKyBzZWwsIHtraW5kOiAnd2Fybid9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0IGJ1aWxkZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyB2MiBleHBvcnQgc2hhcGU6IHRvcCBsZXZlbCBrZWVwcyB1c2VyLWZhY2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHNcbiAgLy8gKHVpZCwgbiwgc2VsZWN0b3IsIHRleHQsIHJvbGUsIGF0dHJzLCBoaW50cywgY2xhc3Nlcywgc3R5bGVzLCBjb21wb25lbnQsXG4gIC8vIHN0YXRlcywgc2NyZWVuc2hvdCwgZ3JvdXApLiBEaWFnbm9zdGljIC8gZGV0ZWN0aW9uIG1ldGFkYXRhIG1vdmVzIHVuZGVyXG4gIC8vIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBpblNoYWRvd0RPTSxcbiAgLy8gcHNldWRvRWxlbWVudHMsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBUaGUgdmVyc2lvbiBtYXJrZXIgaXMgZW1pdHRlZFxuICAvLyBhcyBgdjogMmAuIEltcG9ydGVycyBkZXRlY3QgZWl0aGVyIHYxIChmbGF0KSBvciB2MiBhbmQgZGVub3JtYWxpemUuXG4gIC8vXG4gIC8vIEFnZ3Jlc3NpdmUgbWluaWZ5IGFkZGl0aW9uYWxseSBkcm9wcyBmaWVsZHMgdGhlIHNlbGVjdG9yIGFscmVhZHlcbiAgLy8gaW1wbGllczogYW5jZXN0b3JzLCB2aWV3cG9ydCAob25lIHBlciBwYWdlKSwgY29tcG9uZW50Um9vdCB3aGVuXG4gIC8vIHJlZHVuZGFudCB3aXRoIHRoZSBzZWxlY3RvciwgYW5kIHBzZXVkb0VsZW1lbnRzLlxuICBjb25zdCBzbGltRW50cnkgPSAoZTogRW50cnksIG9wdHM6IHtpbmNsdWRlR3JvdXA/OiBib29sZWFuOyBldmVudEluZGV4PzogbnVtYmVyOyB2aXN1YWxPcmRlcj86IG51bWJlcjsgZ3JvdXBVaWQ/OiBzdHJpbmd9ID0ge30pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0+IHtcbiAgICBjb25zdCBpbmNsdWRlT3V0ZXIgPSBwcmVmcy5pbmNsdWRlT3V0ZXJIVE1MO1xuICAgIGNvbnN0IGluY2x1ZGVNYXRjaGVkID0gcHJlZnMuaW5jbHVkZU1hdGNoZWRSdWxlcztcbiAgICBjb25zdCBpbmNsdWRlU3R5bGVzID0gcHJlZnMuaW5jbHVkZVN0eWxlcztcbiAgICBjb25zdCBtaW5pZnkgPSBwcmVmcy5taW5pZnk7XG5cbiAgICAvLyBUb3AtbGV2ZWwgdXNlci1mYWNpbmcgZmllbGRzLiBPcmRlciBtYXR0ZXJzIGZvciBvdXRwdXQgcmVhZGFiaWxpdHkg4oCUXG4gICAgLy8gd2Ugd2FudCBgdiAvIHR5cGUgLyB1aWQgLyBuIC8gc2VsZWN0b3JgIGZpcnN0IHNvIEpTT05MIGlzIGdyZXBwYWJsZS5cbiAgICAvL1xuICAgIC8vIGBuYCBzdGF5cyBhcyB0aGUgY2FwdHVyZS1zZXF1ZW5jZSBkaXNwbGF5IGxhYmVsIGZvciBiYWNrd2FyZHNcbiAgICAvLyBjb21wYXRpYmlsaXR5IHdpdGggdjEvdjIgcmVhZGVycyAoYW5kIHRoZSBzaWRlYmFyJ3MgXCIjM1wiIGNoaXBzKS5cbiAgICAvLyBUaGUgZGlzYW1iaWd1YXRlZCBjb3VzaW5zIChgY2FwdHVyZUluZGV4YCwgYGV2ZW50SW5kZXhgLFxuICAgIC8vIGB2aXN1YWxPcmRlcmAsIGBkaXNwbGF5TGFiZWxgKSBsaXZlIG9uIHRoZSByb3cgc28gYSBkb3duc3RyZWFtXG4gICAgLy8gYWdlbnQgY2FuIHBpY2sgd2hpY2hldmVyIG9yZGVyaW5nIGlzIG1lYW5pbmdmdWwg4oCUIGJ1ZyAjMTAuXG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgdjogMixcbiAgICAgIHR5cGU6ICdzZWxlY3RvcicsXG4gICAgICB1aWQ6IGUudWlkLFxuICAgICAgbjogZS5uLFxuICAgICAgdHM6IGUudHMsXG4gICAgICB1cmw6IGUudXJsLFxuICAgICAgdGFnOiBlLnRhZyxcbiAgICAgIHNlbGVjdG9yOiBlLnNlbGVjdG9yLFxuICAgICAgY2FwdHVyZUluZGV4OiBlLm4sXG4gICAgICBkaXNwbGF5TGFiZWw6IFN0cmluZyhlLm4pLFxuICAgIH07XG4gICAgaWYgKG9wdHMuZXZlbnRJbmRleCAhPT0gdW5kZWZpbmVkKSBvdXQuZXZlbnRJbmRleCA9IG9wdHMuZXZlbnRJbmRleDtcbiAgICBpZiAob3B0cy52aXN1YWxPcmRlciAhPT0gdW5kZWZpbmVkKSBvdXQudmlzdWFsT3JkZXIgPSBvcHRzLnZpc3VhbE9yZGVyO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLnRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnRleHQgPSBtaW5pZnkgPyBlLnRleHQucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUudGV4dDtcbiAgICBpZiAoZS5yb2xlICE9PSB1bmRlZmluZWQpIG91dC5yb2xlID0gZS5yb2xlO1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IG1pbmlmeSA/IGUuYWNjZXNzaWJsZU5hbWUucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgaWYgKGUuaWQgIT09IHVuZGVmaW5lZCkgb3V0LmlkID0gZS5pZDtcbiAgICBpZiAoZS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgb3V0LnRlc3RJZCA9IGUudGVzdElkO1xuICAgIGlmIChlLmNsYXNzZXMgJiYgZS5jbGFzc2VzLmxlbmd0aCkge1xuICAgICAgb3V0LmNsYXNzZXMgPSAobWluaWZ5ICYmIGUuY2xhc3Nlcy5sZW5ndGggPiA4KSA/IGUuY2xhc3Nlcy5zbGljZSgwLCA4KSA6IGUuY2xhc3NlcztcbiAgICB9XG4gICAgaWYgKGUuYXR0cnMgJiYgT2JqZWN0LmtleXMoZS5hdHRycykubGVuZ3RoKSBvdXQuYXR0cnMgPSBlLmF0dHJzO1xuICAgIGlmIChlLmhpbnRzICYmIE9iamVjdC5rZXlzKGUuaGludHMpLmxlbmd0aCkgb3V0LmhpbnRzID0gZS5oaW50cztcbiAgICBpZiAoZS5yZWN0KSBvdXQucmVjdCA9IGUucmVjdDtcbiAgICBpZiAoZS5zdGF0ZXMgJiYgZS5zdGF0ZXMubGVuZ3RoKSBvdXQuc3RhdGVzID0gZS5zdGF0ZXM7XG4gICAgaWYgKGUuY29tcG9uZW50KSBvdXQuY29tcG9uZW50ID0gZS5jb21wb25lbnQ7XG4gICAgLy8gTG9jYXRvci1xdWFsaXR5IGZpZWxkLiBQcm9tb3RlIGV2ZW4gd2hlbiBtaW5pZmllZCDigJQgaXQncyBhIHNpbmdsZVxuICAgIC8vIHNtYWxsIGludCBhbmQgYSBkb3duc3RyZWFtIGFnZW50IHVzZXMgaXQgdG8gZGVjaWRlIHdoZXRoZXIgdG9cbiAgICAvLyB0cnVzdCB0aGUgc2VsZWN0b3IuXG4gICAgaWYgKGUuc2VsZWN0b3JNYXRjaENvdW50ICE9PSB1bmRlZmluZWQpIG91dC5zZWxlY3Rvck1hdGNoQ291bnQgPSBlLnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgICBpZiAoZS5hMTF5KSBvdXQuYTExeSA9IGUuYTExeTtcbiAgICBpZiAoZS5hc3NldHMgJiYgZS5hc3NldHMubGVuZ3RoKSBvdXQuYXNzZXRzID0gZS5hc3NldHM7XG4gICAgaWYgKGUubGF5b3V0Q29udGV4dCAmJiBlLmxheW91dENvbnRleHQubGVuZ3RoKSBvdXQubGF5b3V0Q29udGV4dCA9IGUubGF5b3V0Q29udGV4dDtcbiAgICBpZiAoaW5jbHVkZU91dGVyICYmIGUub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG91dC5vdXRlckhUTUwgPSBtaW5pZnkgPyBlLm91dGVySFRNTC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5vdXRlckhUTUw7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlU3R5bGVzICYmIGUuc3R5bGVzICYmIE9iamVjdC5rZXlzKGUuc3R5bGVzKS5sZW5ndGgpIG91dC5zdHlsZXMgPSBlLnN0eWxlcztcbiAgICBpZiAoZS5zY3JlZW5zaG90KSB7XG4gICAgICAvLyBQYXRoIG5vcm1hbGl6YXRpb246IHRoZSBsaXZlIGBlbnRyeS5zY3JlZW5zaG90LmVsZW1lbnRgIGNhcnJpZXMgYVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeGVkIHBhdGggKGUuZy4gYGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZ2ApXG4gICAgICAvLyBiZWNhdXNlIHRoZSBiYWNrZ3JvdW5kJ3MgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBBUEkgc3RhbXBzXG4gICAgICAvLyB0aGUgd29ya3NwYWNlIGludG8gdGhlIG9uLWRpc2sgcGF0aC4gQnV0IHRoZSAudGFyLnpzdCBhcmNoaXZlXG4gICAgICAvLyBidW5kbGVzIHNjcmVlbnNob3RzIGZsYXQgYXQgYHNjcmVlbnNob3RzL2Zvby5wbmdgLCBzbyB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXggd291bGQgcmVzb2x2ZSB0byBub3RoaW5nIGZvciBhbiBhZ2VudCB0aGF0XG4gICAgICAvLyBleHRyYWN0ZWQgdGhlIGFyY2hpdmUuIFN0cmlwIHRoZSB3b3Jrc3BhY2UgcHJlZml4IG9uIGVtaXQgc29cbiAgICAgIC8vIGV2ZXJ5IHBhdGggaXMgdmFsaWQgcmVsYXRpdmUgdG8gdGhlIG1hbmlmZXN0J3MgZGVjbGFyZWRcbiAgICAgIC8vIGBwYXRoUm9vdGAgKGFyY2hpdmUgcm9vdCBmb3IgdGFyLnpzdDsgd29ya3NwYWNlIHJvb3QgZm9yIHBsYWluXG4gICAgICAvLyBKU09OTCDigJQgaS5lLiwgYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgY29uc3Qgc3RyaXBXcyA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBpZiAoIXApIHJldHVybiBwO1xuICAgICAgICAvLyBTdHJpcCBleGFjdGx5IG9uZSBsZWFkaW5nIGA8d29ya3NwYWNlPi9gIHNlZ21lbnQgaWYgcHJlc2VudC5cbiAgICAgICAgY29uc3Qgd3NQcmVmaXggPSBgJHthY3RpdmVXc30vYDtcbiAgICAgICAgcmV0dXJuIHAuc3RhcnRzV2l0aCh3c1ByZWZpeCkgPyBwLnNsaWNlKHdzUHJlZml4Lmxlbmd0aCkgOiBwO1xuICAgICAgfTtcbiAgICAgIG91dC5zY3JlZW5zaG90ID0gey4uLmUuc2NyZWVuc2hvdH07XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZWxlbWVudCkgb3V0LnNjcmVlbnNob3QuZWxlbWVudCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZWxlbWVudCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZ3JvdXApIG91dC5zY3JlZW5zaG90Lmdyb3VwID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5ncm91cCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QucGFnZSkgb3V0LnNjcmVlbnNob3QucGFnZSA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QucGFnZSk7XG4gICAgfVxuICAgIC8vIFByb21vdGUgcnVudGltZS9iZWhhdmlvciBzaWduYWxzIHRvIHRvcC1sZXZlbC4gVGhlc2UgYXJlIHByaW1hcnlcbiAgICAvLyBzaWduYWwgZm9yIHRyaWFnZSAoZXZlbnRzIHRlbGxzIFwid2hpY2ggaGFuZGxlciByYW5cIiwgYmVoYXZpb3JBdHRyc1xuICAgIC8vIHRlbGxzIFwid2hhdCBzZXJ2ZXItcmVuZGVyZWQgYmluZGluZyBkb2VzIHRoaXMgZmlyZVwiLCBjYW52YXNDbGlja1xuICAgIC8vIHRlbGxzIFwid2hlcmUgb24gdGhlIGNoYXJ0IHdhcyBjbGlja2VkXCIsIGVkaXRvciB0ZWxscyBcIndoaWNoXG4gICAgLy8gcmljaC10ZXh0IGxpYnJhcnkgd3JhcHMgdGhpc1wiLCBkb21NdXRhdGlvbnMgdGVsbHMgXCJ3aGF0IGNoYW5nZWRcbiAgICAvLyBiZWZvcmUgdGhlIGNsaWNrXCIsIGlzQW5pbWF0aW5nIHdhcm5zIGFib3V0IHRyYW5zaWVudCBzdGF0ZSkuXG4gICAgaWYgKGUuZXZlbnRzICYmIE9iamVjdC5rZXlzKGUuZXZlbnRzKS5sZW5ndGgpIG91dC5ldmVudHMgPSBlLmV2ZW50cztcbiAgICBpZiAoZS5iZWhhdmlvckF0dHJzICYmIE9iamVjdC5rZXlzKGUuYmVoYXZpb3JBdHRycykubGVuZ3RoKSBvdXQuYmVoYXZpb3JBdHRycyA9IGUuYmVoYXZpb3JBdHRycztcbiAgICBpZiAoZS5jYW52YXNDbGljaykgb3V0LmNhbnZhc0NsaWNrID0gZS5jYW52YXNDbGljaztcbiAgICBpZiAoZS5lZGl0b3IpIG91dC5lZGl0b3IgPSBlLmVkaXRvcjtcbiAgICBpZiAoZS5pc0FuaW1hdGluZykgb3V0LmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICBpZiAoZS5zaGFkb3dIb3N0KSBvdXQuc2hhZG93SG9zdCA9IGUuc2hhZG93SG9zdDtcbiAgICBpZiAoZS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnJlbmRlcmVkVGV4dCA9IGUucmVuZGVyZWRUZXh0O1xuICAgIGlmIChlLnRydW5jYXRlZCAmJiBPYmplY3Qua2V5cyhlLnRydW5jYXRlZCkubGVuZ3RoKSBvdXQudHJ1bmNhdGVkID0gZS50cnVuY2F0ZWQ7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUuZG9tTXV0YXRpb25zICYmIGUuZG9tTXV0YXRpb25zLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGUuZG9tTXV0YXRpb25zO1xuXG4gICAgLy8gX2F1ZGl0OiBkZXRlY3Rpb24gY2hhaW4gJiBkaWFnbm9zdGljIHNoYXBlLlxuICAgIC8vIFJFQURNRSBjbGFpbWVkIGBfYXVkaXQuYW5jZXN0b3JzYCBhbmQgYF9hdWRpdC5jb21wb25lbnRSb290YCB3ZXJlXG4gICAgLy8gYWx3YXlzIHByZXNlbnQsIGJ1dCB0aGUgc2xpbSBlbWl0IGRyb3BwZWQgdGhlbSB3aGVuZXZlclxuICAgIC8vIGBtaW5pZnk6IHRydWVgLiBUaGUgZml4OiBlbWl0IGV2ZXJ5IGRlY2xhcmVkIGBfYXVkaXRgIGZpZWxkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHNvdXJjZSBkYXRhIGV4aXN0cywgYW5kIGxldFxuICAgIC8vIGBtaW5pZnlgIHNsaW0gT05MWSB0aGUgaGlnaC12b2x1bWUgYmxvY2tzIChtYXRjaGVkUnVsZXMsXG4gICAgLy8gcHNldWRvRWxlbWVudHMpLiBTbWFsbCBzdHJ1Y3R1cmFsIG1ldGFkYXRhIChhbmNlc3RvcnMsXG4gICAgLy8gY29tcG9uZW50Um9vdCwgdmlld3BvcnQpIHN1cnZpdmVzIG1pbmlmeSBzbyB0aGUgc2NoZW1hIGNsYWltc1xuICAgIC8vIHN0YXkgaG9uZXN0LlxuICAgIGNvbnN0IGF1ZGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGUuYW5jZXN0b3JzICYmIGUuYW5jZXN0b3JzLmxlbmd0aCkgYXVkaXQuYW5jZXN0b3JzID0gZS5hbmNlc3RvcnM7XG4gICAgaWYgKGUuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBhdWRpdC5jb21wb25lbnRSb290ID0gZS5jb21wb25lbnRSb290O1xuICAgIGlmIChlLmluU2hhZG93RE9NKSBhdWRpdC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgaWYgKGUucHNldWRvRWxlbWVudHMgJiYgT2JqZWN0LmtleXMoZS5wc2V1ZG9FbGVtZW50cykubGVuZ3RoICYmICFtaW5pZnkpIGF1ZGl0LnBzZXVkb0VsZW1lbnRzID0gZS5wc2V1ZG9FbGVtZW50cztcbiAgICBpZiAoaW5jbHVkZU1hdGNoZWQgJiYgZS5tYXRjaGVkUnVsZXMgJiYgZS5tYXRjaGVkUnVsZXMubGVuZ3RoKSB7XG4gICAgICBhdWRpdC5tYXRjaGVkUnVsZXMgPSBtaW5pZnlcbiAgICAgICAgPyBlLm1hdGNoZWRSdWxlcy5tYXAoKHIpID0+IHtcbiAgICAgICAgICBjb25zdCByMjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtzZWxlY3Rvcjogci5zZWxlY3Rvcn07XG4gICAgICAgICAgaWYgKHIuZGVjbGFyYXRpb25zICYmIE9iamVjdC5rZXlzKHIuZGVjbGFyYXRpb25zKS5sZW5ndGgpIHIyLmRlY2xhcmF0aW9ucyA9IHIuZGVjbGFyYXRpb25zO1xuICAgICAgICAgIGlmIChyLm1lZGlhKSByMi5tZWRpYSA9IHIubWVkaWE7XG4gICAgICAgICAgcmV0dXJuIHIyO1xuICAgICAgICB9KVxuICAgICAgICA6IGUubWF0Y2hlZFJ1bGVzO1xuICAgIH1cbiAgICBpZiAoZS52aWV3cG9ydCkgYXVkaXQudmlld3BvcnQgPSBlLnZpZXdwb3J0O1xuICAgIGlmIChPYmplY3Qua2V5cyhhdWRpdCkubGVuZ3RoKSBvdXQuX2F1ZGl0ID0gYXVkaXQ7XG5cbiAgICAvLyBHcm91cCBoZWFkIGxpbmthZ2UuIFByZXZpb3VzbHkgdGhlIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgXG4gICAgLy8gY2FycmllZCBmdWxsIG5lc3RlZCBlbnRyeSBvYmplY3RzLlxuICAgIC8vIFRoYXQgbWFkZSBEdWNrREIgam9pbnMgdWdseSBhbmQgYnJva2UgdGhlIHJ1bGUgdGhhdCBldmVyeVxuICAgIC8vIHNlbGVjdG9yIHNob3VsZCBiZSBhIHRvcC1sZXZlbCByb3cuIFdlIG5vdyBlbWl0OlxuICAgIC8vICAg4oCiIG9uIHRoZSBncm91cCBoZWFkOiBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlkLCB1aWQsIC4uLl1gIChqdXN0IElEcylcbiAgICAvLyAgIOKAoiBlYWNoIG1lbWJlciBhcyBpdHMgb3duIHRvcC1sZXZlbCBzbGltIHJvdyB3aXRoIGBncm91cFVpZGBcbiAgICAvLyAgICAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZCAoaGFuZGxlZCBpbiBgYnVpbGRTbGltYCBmbHVzaCBsb2dpYykuXG4gICAgaWYgKG9wdHMuaW5jbHVkZUdyb3VwICYmIGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgIG91dC5ncm91cE1lbWJlclVpZHMgPSBlLmdyb3VwLm1hcCgoZykgPT4gZy51aWQpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG4gICAgaWYgKG9wdHMuZ3JvdXBVaWQpIG91dC5ncm91cFVpZCA9IG9wdHMuZ3JvdXBVaWQ7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICAvLyDilIDilIDilIAgU2hhcmVkIFwic2xpbSBkYXRhXCIgcGlwZWxpbmUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEpTT05MIHJlbmRlcnMgb2ZmIHRoaXMgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uLiAoTWFya2Rvd24gdXNlZCB0b1xuICAvLyBzaGFyZSBpdDsgdGhlIE1hcmtkb3duIGV4cG9ydCB3YXMgcmV0aXJlZCBpbiBmYXZvciBvZiBKU09OTC1vbmx5LilcbiAgLy9cbiAgLy8gdjIgZGlmZmVyZW5jZXMgdnMgdjE6XG4gIC8vICAg4oCiIFNlbGVjdG9yIGxpbmVzIGhhdmUgZXhwbGljaXQgYHR5cGU6ICdzZWxlY3RvcidgIGFuZCBgdjogMmAuXG4gIC8vICAg4oCiIF9hdWRpdCBuZXN0cyBkZXRlY3Rpb24gLyBkZWJ1ZyBmaWVsZHMgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwg4oCmKS5cbiAgLy8gICDigKIgRmVlZGJhY2sgZW1pdHMgYXMgc3RhbmRhbG9uZSBge3R5cGU6J2ZlZWRiYWNrJywgcGFyZW50VWlkLCDigKZ9YCBsaW5lc1xuICAvLyAgICAgUExVUyBidW5kbGVkIGBmZWVkYmFja2AgYXJyYXlzIG9uIHNlbGVjdG9ycyAoc28gb2xkIHNpbmdsZS1saW5lXG4gIC8vICAgICByZWFkZXJzIHN0aWxsIHNlZSB0aGVtIGFkamFjZW50KS5cbiAgLy8gICDigKIgQSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgY2FycmllcyB3b3Jrc3BhY2UgKyBjb3VudHMgKyBmaWxlbmFtZS5cbiAgdHlwZSBTbGltUGFnZSA9IHt2OiAyOyB0eXBlOiAncGFnZSc7IHRzOiBzdHJpbmc7IHVybDogc3RyaW5nOyB0aXRsZT86IHN0cmluZzsgdmlld3BvcnQ/OiBWaWV3cG9ydDsgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgdXNlckFnZW50Pzogc3RyaW5nOyBsYW5nPzogc3RyaW5nOyBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307IHJvdXRlPzogYW55OyBzdGF0ZT86IGFueTsgc2Vzc2lvbklkPzogc3RyaW5nfTtcbiAgLy8gU2V2ZXJpdHkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgKDIwMjYtMDUpLiBUb2xlcmFudCByZWFkZXJzIG1heSBzdGlsbFxuICAvLyBzZWUgYHNldmVyaXR5YCBvbiBsZWdhY3kgSlNPTkwg4oCUIGRlbm9ybWFsaXplRW50cnkgcHJlc2VydmVzIGl0IG9uXG4gIC8vIEZlZWRiYWNrTWVzc2FnZSBzbyByZS1leHBvcnQgcm91bmQtdHJpcHMsIGJ1dCBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0XG4gIC8vIGl0IGFuZCB3ZSBkb24ndCBlbWl0IGl0IGhlcmUuIEtlZXAgdGhlIGZpZWxkIG9mZiBTbGltRmVlZGJhY2sgc28gbmV3XG4gIC8vIGV4cG9ydHMgc3RheSBjbGVhbi5cbiAgLy8gYHRhZ3NgIGlzIGFsd2F5cyBlbWl0dGVkIChkZWZhdWx0IGVtcHR5IGFycmF5KSBzbyBEdWNrREIgc2NoZW1hXG4gIC8vIGluZmVyZW5jZSBhbHdheXMgc2VlcyB0aGUgY29sdW1uLlxuICB0eXBlIFNsaW1GZWVkYmFjayA9IHt2OiAyOyB0eXBlOiAnZmVlZGJhY2snOyB1aWQ6IHN0cmluZzsgdHM6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmc7IHRhZ3M6IHN0cmluZ1tdOyBpc1Rlc3REYXRhPzogYm9vbGVhbn07XG4gIC8vIENoZWFwIHRlc3QtZGF0YSBzbmlmZjogbWF0Y2hlcyBzdHJpbmdzIHRoZSB1c2VyIHR5cGVzIHdoaWxlIHNtb2tlLVxuICAvLyB0ZXN0aW5nIHRoZSBleHRlbnNpb24gKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIiwgXCJsb3JlbSBpcHN1bVwiLFxuICAvLyBcInBsYWNlaG9sZGVyXCIsIG9yIGFueSBwaHJhc2Ugb2J2aW91c2x5IHN0dWJiZWQtb3V0KS4gRmFsc2UgcG9zaXRpdmVzXG4gIC8vIGhlcmUgYXJlIHJlY292ZXJhYmxlIOKAlCB0aGUgY29uc3VtZXIgY2FuIGlnbm9yZSB0aGUgZmxhZyDigJQgYnV0XG4gIC8vIGV4Y2x1ZGluZyByZWFsIGZlZWRiYWNrIHdvdWxkIG5vdCBiZSwgc28gd2Uga2VlcCB0aGUgcmVnZXggbmFycm93LlxuICBjb25zdCBURVNUX0RBVEFfUkUgPSAvXih0ZXN0fGFzZGZ8cXdlcnxmb298YmFyfGJhenxsb3JlbXxwbGFjZWhvbGRlcnx0b2RvfHh7Myx9fGhlbGxvIHdvcmxkfHNhbXBsZXxkdW1teXxzb21ldGhpbmd8YW55dGhpbmd8aWdub3JlIG1lfHdpcHx0YmR8blxcL2F8aGkpXFxiL2k7XG4gIGNvbnN0IGxvb2tzTGlrZVRlc3REYXRhID0gKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRyaW0oKTtcbiAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoVEVTVF9EQVRBX1JFLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIGlmICgvdGVzdCBmZWVkYmFjay9pLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgdHlwZSBTbGltU2VsZWN0b3IgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+ICYge3Y6IDI7IHR5cGU6ICdzZWxlY3Rvcic7IG46IG51bWJlcjsgc2VsZWN0b3I6IHN0cmluZzsgZmVlZGJhY2s/OiBzdHJpbmdbXX07XG4gIHR5cGUgU2xpbUxpbmUgPSBTbGltUGFnZSB8IFNsaW1GZWVkYmFjayB8IFNsaW1TZWxlY3RvcjtcbiAgY29uc3QgYnVpbGRTbGltID0gKCk6IFNsaW1MaW5lW10gPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBTbGltTGluZVtdID0gW107XG4gICAgLy8gUHJlLWNvbXB1dGUgdmlzdWFsT3JkZXIgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KSBmb3IgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBtZXNzYWdlLiBUaGUgcHJldmlvdXMgc2luZ2xlIGBuYCBmaWVsZCBjb25mbGF0ZWRcbiAgICAvLyBjYXB0dXJlIG9yZGVyLCBKU09OTCBzdHJlYW0gb3JkZXIsXG4gICAgLy8gdmlzdWFsIG9yZGVyLCBhbmQgZGlzcGxheSBsYWJlbC4gV2Ugbm93IGVtaXQgZm91ciBvcnRob2dvbmFsXG4gICAgLy8gZmllbGRzIGFuZCBkb2N1bWVudCBlYWNoOlxuICAgIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHRoZSBvcmlnaW5hbCBgbmAgKGNhcHR1cmUgc2VxdWVuY2UpXG4gICAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCBzb3J0IGJ5IHJlY3QueSBhc2MsIHJlY3QueCBhc2NcbiAgICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIHRoZSBodW1hbi1mYWNpbmcgbnVtYmVyIHNob3duIGluIHRoZSBzaWRlYmFyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIChjdXJyZW50bHkgbWlycm9ycyBjYXB0dXJlSW5kZXg7IGNhbiBkcmlmdCBpZlxuICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGUgc2lkZWJhciBhZG9wdHMgYSBkaWZmZXJlbnQgbGFiZWwgc2NoZW1lKS5cbiAgICBjb25zdCB2aXN1YWxSYW5rID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBjb25zdCBzZWxzID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAuc2xpY2UoKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYXIgPSBhLmVudHJ5LnJlY3Q7IGNvbnN0IGJyID0gYi5lbnRyeS5yZWN0O1xuICAgICAgICBpZiAoIWFyIHx8ICFicikgcmV0dXJuIDA7XG4gICAgICAgIGlmIChhci55ICE9PSBici55KSByZXR1cm4gYXIueSAtIGJyLnk7XG4gICAgICAgIHJldHVybiBhci54IC0gYnIueDtcbiAgICAgIH0pO1xuICAgIHNlbHMuZm9yRWFjaCgobSwgaSkgPT4gdmlzdWFsUmFuay5zZXQobS5pZCwgaSArIDEpKTtcbiAgICBsZXQgcGVuZGluZ1NlbDogU2VsZWN0b3JNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gV2UgY29sbGVjdCBib3RoIHRoZSBidW5kbGVkIHN0cmluZyBhcnJheSAoZm9yIHYxLWZyaWVuZGx5IHJlYWRlcnMpIGFuZFxuICAgIC8vIHRoZSByaWNoIG9iamVjdHMgKGZvciB2MiBzdGFuZGFsb25lIGxpbmVzKS5cbiAgICBsZXQgcGVuZGluZ0ZiU3RyaW5nczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcGVuZGluZ0ZiUmljaDogU2xpbUZlZWRiYWNrW10gPSBbXTtcbiAgICBjb25zdCBmbHVzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGVuZGluZ1NlbCkgcmV0dXJuO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IGxpbmVzLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCB2aXN1YWxPcmRlciA9IHZpc3VhbFJhbmsuZ2V0KHBlbmRpbmdTZWwuaWQpO1xuICAgICAgY29uc3Qgb3V0OiBhbnkgPSBzbGltRW50cnkocGVuZGluZ1NlbC5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZSwgZXZlbnRJbmRleCwgdmlzdWFsT3JkZXJ9KTtcbiAgICAgIGlmIChwZW5kaW5nRmJTdHJpbmdzLmxlbmd0aCkgb3V0LmZlZWRiYWNrID0gWy4uLnBlbmRpbmdGYlN0cmluZ3NdO1xuICAgICAgbGluZXMucHVzaChvdXQgYXMgU2xpbUxpbmUpO1xuICAgICAgLy8gR3JvdXAgZmxhdG5lc3MgKGJ1ZyAjOSkuIEVtaXQgZWFjaCBncm91cCBtZW1iZXIgYXMgaXRzIG93blxuICAgICAgLy8gdG9wLWxldmVsIHNsaW0gcm93IHJpZ2h0IGFmdGVyIHRoZSBoZWFkLCB3aXRoIGBncm91cFVpZGBcbiAgICAgIC8vIGxpbmtpbmcgYmFjay4gVGhpcyBsZXRzIER1Y2tEQiAvIFNRTCBxdWVyaWVzIHRyZWF0IGdyb3VwXG4gICAgICAvLyBtZW1iZXJzIGFzIGZpcnN0LWNsYXNzIHNlbGVjdG9yIHJvd3Mgd2l0aG91dCBkZXNjZW5kaW5nIGludG9cbiAgICAgIC8vIG5lc3RlZCBvYmplY3RzLlxuICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gcGVuZGluZ1NlbC5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGdyb3VwTWVtYmVycykge1xuICAgICAgICBjb25zdCBtRXZlbnQgPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgICBjb25zdCBtZW1iZXJSb3c6IGFueSA9IHNsaW1FbnRyeShtZW1iZXIsIHtpbmNsdWRlR3JvdXA6IGZhbHNlLCBldmVudEluZGV4OiBtRXZlbnQsIGdyb3VwVWlkOiBwZW5kaW5nU2VsLmVudHJ5LnVpZH0pO1xuICAgICAgICBsaW5lcy5wdXNoKG1lbWJlclJvdyBhcyBTbGltTGluZSk7XG4gICAgICB9XG4gICAgICAvLyBFbWl0IGVhY2ggc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lIHJpZ2h0IGFmdGVyIHRoZSBzZWxlY3RvcihzKS5cbiAgICAgIGZvciAoY29uc3QgZmIgb2YgcGVuZGluZ0ZiUmljaCkgbGluZXMucHVzaChmYik7XG4gICAgICBwZW5kaW5nU2VsID0gbnVsbDtcbiAgICAgIHBlbmRpbmdGYlN0cmluZ3MgPSBbXTtcbiAgICAgIHBlbmRpbmdGYlJpY2ggPSBbXTtcbiAgICB9O1xuICAgIC8vIFJlb3JkZXIgZm9yIGV4cG9ydCBvbmx5IOKAlCBzaWRlYmFyIGtlZXBzIGNhcHR1cmUgb3JkZXIsIHRoZVxuICAgIC8vIGVtaXR0ZWQgSlNPTkwgcmVhZHMgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgd2l0aGluIGVhY2ggcGFnZS5cbiAgICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIHZpYSB0aGVcbiAgICAvLyBgcmVvcmRlckZvckV4cG9ydGAgaGVscGVyLCBzbyB0aHJlYWRpbmcgaXMgcHJlc2VydmVkIHRocm91Z2hcbiAgICAvLyB0aGUgcmVhcnJhbmdlbWVudC5cbiAgICBjb25zdCBleHBvcnRPcmRlcmVkID0gcmVvcmRlckZvckV4cG9ydChtZXNzYWdlcyk7XG4gICAgZm9yIChjb25zdCBtIG9mIGV4cG9ydE9yZGVyZWQpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaCgpO1xuICAgICAgICBjb25zdCBzbGltOiBTbGltUGFnZSA9IHt2OiAyLCB0eXBlOiAncGFnZScsIHRzOiBtLnRzLCB1cmw6IG0udXJsfTtcbiAgICAgICAgaWYgKG0udGl0bGUgIT09IHVuZGVmaW5lZCkgc2xpbS50aXRsZSA9IG0udGl0bGU7XG4gICAgICAgIGlmIChtLnZpZXdwb3J0KSBzbGltLnZpZXdwb3J0ID0gbS52aWV3cG9ydDtcbiAgICAgICAgaWYgKCFwcmVmcy5taW5pZnkgJiYgbS50b2tlbnMpIHNsaW0udG9rZW5zID0gbS50b2tlbnM7XG4gICAgICAgIGlmIChtLnVzZXJBZ2VudCkgc2xpbS51c2VyQWdlbnQgPSBtLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKG0ubGFuZykgc2xpbS5sYW5nID0gbS5sYW5nO1xuICAgICAgICBpZiAobS5naXRDb250ZXh0KSBzbGltLmdpdENvbnRleHQgPSBtLmdpdENvbnRleHQ7XG4gICAgICAgIGlmIChtLnJvdXRlKSBzbGltLnJvdXRlID0gbS5yb3V0ZTtcbiAgICAgICAgaWYgKG0uc3RhdGUpIHNsaW0uc3RhdGUgPSBtLnN0YXRlO1xuICAgICAgICBpZiAobS5zZXNzaW9uSWQpIHNsaW0uc2Vzc2lvbklkID0gbS5zZXNzaW9uSWQ7XG4gICAgICAgIGxpbmVzLnB1c2goc2xpbSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgeyBmbHVzaCgpOyBwZW5kaW5nU2VsID0gbTsgfVxuICAgICAgZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIC8vIEFsd2F5cyBpbmNsdWRlIGB0YWdzOiBbXWAgKGV2ZW4gd2hlbiBlbXB0eSkgc28gRHVja0RCJ3Mgc2NoZW1hXG4gICAgICAgIC8vIGluZmVyZW5jZSBwaWNrcyB0aGUgY29sdW1uIHVwLlxuICAgICAgICAvLyBgdWlkYCBpcyB0aGUgbWVzc2FnZSdzIHN0YWJsZSBpZDogUFJzIC8gcmVwYWlyIHJlcG9ydHMgbmVlZFxuICAgICAgICAvLyBhIHN0YWJsZSBwZXItZmVlZGJhY2sgaGFuZGxlLCBub3QganVzdCBwYXJlbnRVaWQuXG4gICAgICAgIGNvbnN0IHJpY2g6IFNsaW1GZWVkYmFjayA9IHt2OiAyLCB0eXBlOiAnZmVlZGJhY2snLCB1aWQ6IG0uaWQsIHRzOiBtLnRzLCB0ZXh0OiBtLnRleHQsIHRhZ3M6IG0udGFncyA/PyBbXX07XG4gICAgICAgIC8vIChzZXZlcml0eSByZW1vdmVkIDIwMjYtMDUg4oCUIG9sZCBKU09OTHMgbWF5IHN0aWxsIGNvbnRhaW4gaXRcbiAgICAgICAgLy8gb24gdGhlIHJlYWQgc2lkZSwgYnV0IHdlIG5vIGxvbmdlciBlbWl0IGl0IG9uIHdyaXRlLilcbiAgICAgICAgLy8gSGV1cmlzdGljIGZsYWcgZm9yIHN0dWItbG9va2luZyBmZWVkYmFjayAoXCJ0ZXN0XCIsIFwiYXNkZlwiLCBcImZvb1wiLFxuICAgICAgICAvLyBcIkhvd2R5ICwgdGVzdCBmZWVkYmFjayBoZXJlXCIsIGV0YykuIExldHMgYSBkb3duc3RyZWFtIGNvbnN1bWVyXG4gICAgICAgIC8vIGZpbHRlciBwb2xsdXRpb24gZnJvbSByZWFsIGludGVudCB3aXRob3V0IG1hbnVhbCBjbGVhbnVwLlxuICAgICAgICBpZiAobG9va3NMaWtlVGVzdERhdGEobS50ZXh0KSkgcmljaC5pc1Rlc3REYXRhID0gdHJ1ZTtcbiAgICAgICAgaWYgKHBlbmRpbmdTZWwpIHtcbiAgICAgICAgICByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkID8/IHBlbmRpbmdTZWwuZW50cnkudWlkO1xuICAgICAgICAgIHBlbmRpbmdGYlN0cmluZ3MucHVzaChtLnRleHQpO1xuICAgICAgICAgIHBlbmRpbmdGYlJpY2gucHVzaChyaWNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQ7XG4gICAgICAgICAgbGluZXMucHVzaChyaWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaCgpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfTtcbiAgLy8gQnVpbGQgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBvZiB0aGUgSlNPTkwgZXhwb3J0LiBUaGVcbiAgLy8gbWFuaWZlc3QgY2FycmllcyB0aGUgZXhwb3J0IGZpbGVuYW1lICsgd29ya3NwYWNlICsgaG9zdChzKSArIGNvdW50cyBzb1xuICAvLyBhIGRvd25zdHJlYW0gTExNIGNhbiByZXN5bmMgdGhlIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlIGFuZCBncmVwIGZvclxuICAvLyBkdXBsaWNhdGVzIGFjcm9zcyBleHBvcnRzLlxuICBjb25zdCBidWlsZE1hbmlmZXN0ID0gKGZpbGVuYW1lOiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddKTogRXhwb3J0TWFuaWZlc3QgPT4ge1xuICAgIGxldCBuU2VsID0gMDsgbGV0IG5GYiA9IDA7IGxldCBuUGcgPSAwO1xuICAgIGxldCBuR3JvdXBNZW1iZXJzID0gMDtcbiAgICBsZXQgbkZlZWRiYWNrQmVhcmluZyA9IDA7XG4gICAgbGV0IG5NaXNzaW5nU2hvdCA9IDA7XG4gICAgbGV0IG5FbGVtZW50U2hvdHMgPSAwO1xuICAgIGxldCBuR3JvdXBTaG90cyA9IDA7XG4gICAgbGV0IG5QYWdlU2hvdHMgPSAwO1xuICAgIGxldCBuT3JwaGFuZWRGYiA9IDA7XG4gICAgY29uc3Qgc2VsZWN0b3JVaWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgZmVlZGJhY2tQYXJlbnRTZWxlY3RvcklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIC8vIEZpcnN0IHBhc3M6IGNvbGxlY3QgdWlkcyArIHBlci1zZWxlY3RvciBmZWVkYmFjayBwcmVzZW5jZS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgblNlbCsrO1xuICAgICAgICBzZWxlY3RvclVpZHMuYWRkKG0uZW50cnkudWlkKTtcbiAgICAgICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgbkdyb3VwTWVtYmVycyArPSBtLmVudHJ5Lmdyb3VwLmxlbmd0aDtcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgbkVsZW1lbnRTaG90cysrO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbkdyb3VwU2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgblBhZ2VTaG90cysrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgbkZiKys7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5hZGQobS5wYXJlbnRVaWQpO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykgblBnKys7XG4gICAgfVxuICAgIC8vIFNlY29uZCBwYXNzOiBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycyArIG9ycGhhbmVkIGZlZWRiYWNrICtcbiAgICAvLyBzZWxlY3RvcnMgdGhhdCBzaG91bGQgaGF2ZSBhIHNob3QgYnV0IGRvbid0LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIHtcbiAgICAgICAgbkZlZWRiYWNrQmVhcmluZysrO1xuICAgICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbk1pc3NpbmdTaG90Kys7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkgbk9ycGhhbmVkRmIrKztcbiAgICB9XG4gICAgY29uc3Qgb3V0OiBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgICAgIHY6IDIsIHR5cGU6ICdtYW5pZmVzdCcsIHRvb2w6ICdwaW5jaGdyYWInLFxuICAgICAgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGdlbmVyYXRlZDogRGF0ZS5ub3coKSxcbiAgICAgIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGZvcm1hdCxcbiAgICAgIGhvc3RzOiBkaXN0aW5jdEhvc3RzKCksXG4gICAgICBjb3VudHM6IHtcbiAgICAgICAgLy8gVG90YWwgc2VsZWN0b3Igcm93cyB0aGUgSlNPTkwgd2lsbCBlbWl0ID0gdG9wLWxldmVsICsgZmxhdFxuICAgICAgICAvLyBncm91cCBtZW1iZXJzLiBUaGlzIG1hdGNoZXMgd2hhdCBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYHJlYWRfanNvbl9hdXRvKC4uLilgIHdvdWxkIHNlZTsgdGhlIHByZXZpb3VzIGJlaGF2aW9yIG9mXG4gICAgICAgIC8vIHJlcG9ydGluZyBvbmx5IHRoZSBpbi1tZW1vcnkgdG9wLWxldmVsIGNvdW50IGNvbnRyYWRpY3RlZFxuICAgICAgICAvLyB0aGUgYWN0dWFsIHN0cmVhbS5cbiAgICAgICAgc2VsZWN0b3JzOiBuU2VsICsgbkdyb3VwTWVtYmVycyxcbiAgICAgICAgZmVlZGJhY2s6IG5GYixcbiAgICAgICAgcGFnZXM6IG5QZyxcbiAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiBuRmVlZGJhY2tCZWFyaW5nLFxuICAgICAgICBncm91cE1lbWJlcnM6IG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDogbkVsZW1lbnRTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNHcm91cDogbkdyb3VwU2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzUGFnZTogblBhZ2VTaG90cyxcbiAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IG5NaXNzaW5nU2hvdCxcbiAgICAgICAgb3JwaGFuZWRGZWVkYmFjazogbk9ycGhhbmVkRmIsXG4gICAgICB9LFxuICAgICAgLy8gU2luZ2xlIGNhbm9uaWNhbCByZXNvbHV0aW9uIHJ1bGUuIEV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MXG4gICAgICAvLyAoc2NyZWVuc2hvdC5lbGVtZW50L2dyb3VwL3BhZ2UpIGlzIHJlbGF0aXZlIHRvIGBwYXRoUm9vdGA6XG4gICAgICAvLyAgIOKAoiAnYXJjaGl2ZSc6IGZvciB0YXIuenN0IGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGVcbiAgICAgIC8vICAgICBleHRyYWN0ZWQgYXJjaGl2ZSByb290IChlLmcuIGBzY3JlZW5zaG90cy9mb28ucG5nYCkuXG4gICAgICAvLyAgIOKAoiAnd29ya3NwYWNlJzogZm9yIHBsYWluIEpTT05MIGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0b1xuICAgICAgLy8gICAgIHRoZSB3b3Jrc3BhY2UgZGlyIChgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICAvLyBSZWNlaXZlcnMgbm8gbG9uZ2VyIGhhdmUgdG8gZ3Vlc3Mgd2hpY2ggcGF0aCBzaGFwZSBhcHBsaWVzLlxuICAgICAgcGF0aFJvb3Q6IGZvcm1hdCA9PT0gJ3Rhci56c3QnID8gJ2FyY2hpdmUnIDogJ3dvcmtzcGFjZScsXG4gICAgfTtcbiAgICAvLyBJbmRpcmVjdGlvbiBwb2ludGVycyBzbyBhIGRvd25zdHJlYW0gYWdlbnQga25vd3Mgd2hpY2ggVUkgc2tpbGxcbiAgICAvLyBvd25zIHRoZSB0cmlhZ2UgZmxvdyArIHdoaWNoIERFU0lHTi5tZCBvd25zIHRoZSB2aXN1YWwgaWRlbnRpdHkuXG4gICAgLy9cbiAgICAvLyBgaW5saW5lOiB0cnVlYCBpcyBzZXQgT05MWSBmb3IgdGFyLnpzdCBleHBvcnRzICh3aGVyZSB0aGUgLm1kXG4gICAgLy8gZmlsZXMgYXJlIHBoeXNpY2FsbHkgYnVuZGxlZCBpbnRvIHRoZSBhcmNoaXZlKS4gSlNPTkwtb25seVxuICAgIC8vIGV4cG9ydHMgZW1pdCBgaW5saW5lOiBmYWxzZWAgcGx1cyB0aGUgcmVjZWl2ZXItc2lkZSBgcGF0aGAgc29cbiAgICAvLyBhIGNvbnN1bWVyIHBhaXJlZCB3aXRoIHRoZSBzdGFuZGFsb25lIEpTT05MIGNhbiByZXNvbHZlIHRoZVxuICAgIC8vIHJlZmVyZW5jZWQgZmlsZSBvZmYgdGhlaXIgb3duIGZpbGVzeXN0ZW0uXG4gICAgLy9cbiAgICAvLyBgdGVtcGxhdGU6IHRydWVgIGZsYWdzIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oCUIHVzZWZ1bFxuICAgIC8vIGZvciByZWNlaXZlcnMgd2hvIHdhbnQgdG8gZGlzdGluZ3Vpc2ggYnVuZGxlZC1kZWZhdWx0IGNvbnRlbnRcbiAgICAvLyBmcm9tIHRoZSB1c2VyJ3MgYWN0dWFsIHdvcmtpbmcgbm90ZXMuXG4gICAgY29uc3QgaXNUYXJCdW5kbGUgPSBmb3JtYXQgPT09ICd0YXIuenN0JztcbiAgICBvdXQuc2tpbGwgPSB7XG4gICAgICBuYW1lOiAnUGluY2hHcmFiJyxcbiAgICAgIHBhdGg6IHByZWZzLnNraWxsUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5za2lsbC5hcmNoaXZlUGF0aCA9ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKSBvdXQuc2tpbGwudGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LnNraWxsLmN1c3RvbWl6ZWQgPSB0cnVlO1xuICAgIG91dC5kZXNpZ24gPSB7XG4gICAgICBwYXRoOiBwcmVmcy5kZXNpZ25QYXRoLFxuICAgICAgaW5saW5lOiBpc1RhckJ1bmRsZSxcbiAgICB9O1xuICAgIGlmIChpc1RhckJ1bmRsZSkgb3V0LmRlc2lnbi5hcmNoaXZlUGF0aCA9ICdERVNJR04ubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSkgb3V0LmRlc2lnbi50ZW1wbGF0ZSA9IHRydWU7XG4gICAgZWxzZSBvdXQuZGVzaWduLmN1c3RvbWl6ZWQgPSB0cnVlO1xuXG4gICAgLy8gU2VsZi1yb2FzdCBkaWFnbm9zdGljcy5cbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgLy8gRmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgd2l0aCBubyBzY3JlZW5zaG90LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAoIWZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuaGFzKG0uZW50cnkudWlkKSkgY29udGludWU7XG4gICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdGRUVEQkFDS19QQVJFTlRfTUlTU0lOR19TQ1JFRU5TSE9UJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHNlbGVjdG9yICR7bS5lbnRyeS5zZWxlY3Rvcn0gY2FycmllcyBmZWVkYmFjayBidXQgaGFzIG5vIGVsZW1lbnQvZ3JvdXAgc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPcnBoYW5lZCBmZWVkYmFjayAocGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSkuXG4gICAgZm9yIChjb25zdCBmYlVpZCBvZiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yVWlkcy5oYXMoZmJVaWQpKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgIGNvZGU6ICdPUlBIQU5FRF9GRUVEQkFDSycsXG4gICAgICAgICAgdWlkOiBmYlVpZCxcbiAgICAgICAgICBkZXRhaWw6ICdmZWVkYmFjayByb3cgcmVmZXJlbmNlcyBhIHBhcmVudFVpZCB0aGF0IGhhcyBubyBtYXRjaGluZyBzZWxlY3RvciBpbiB0aGlzIGFyY2hpdmUnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSG92ZXItc3RhdGUgY2FwdHVyZXMgdXN1YWxseSBuZWVkIGEgYmVmb3JlL2FmdGVyOyBmbGFnIGFueSB3aG9zZVxuICAgIC8vIHNjcmVlbnNob3Qgc3RvcnkgaXMgaW5jb21wbGV0ZSAoYnVnICMxNiBwYXJ0aWFsKS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc3RhdGVzICYmIG0uZW50cnkuc3RhdGVzLmluY2x1ZGVzKCdob3ZlcicpICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnSE9WRVJfU1RBVEVfTk9fU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciBjYXB0dXJlZCBpbiA6aG92ZXIgc3RhdGUgYnV0IGhhcyBubyBzY3JlZW5zaG90YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEExMXk6IGZsYWcgZmFpbGluZyBjb250cmFzdCAoYnVnICMxNSBmb2xsb3ctdGhyb3VnaCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LmExMXk/LmNvbnRyYXN0UGFzc2VzID09PSAnZmFpbCcpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnQ09OVFJBU1RfQkVMT1dfQUEnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgdGV4dCBjb250cmFzdCByYXRpbyAke20uZW50cnkuYTExeS5jb250cmFzdFJhdGlvID8/ICc/J30gaXMgYmVsb3cgV0NBRyBBQWAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoKSBvdXQuZXhwb3J0RGlhZ25vc3RpY3MgPSBkaWFnbm9zdGljcztcblxuICAgIC8vIEJ1aWxkIGlkZW50aXR5LiBQdWxsIGZyb20gdGhlIG1vc3QgcmVjZW50IHBhZ2Ugcm93J3MgZ2l0Q29udGV4dFxuICAgIC8vIChzb3VyY2VkIHZpYSBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiPmAgb24gdGhlIGNhcHR1cmVkIGFwcClcbiAgICAvLyBwbHVzIHRoZSBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uIE9taXQgdGhlIGJsb2NrIGVudGlyZWx5XG4gICAgLy8gd2hlbiBuZWl0aGVyIGlzIGF2YWlsYWJsZS5cbiAgICBjb25zdCBsYXN0UGFnZSA9IFsuLi5tZXNzYWdlc10ucmV2ZXJzZSgpLmZpbmQoKG0pID0+IG0udHlwZSA9PT0gJ3BhZ2UnKSBhcyBQYWdlTWVzc2FnZSB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBnaXQgPSBsYXN0UGFnZT8uZ2l0Q29udGV4dDtcbiAgICBjb25zdCBleHRWZXIgPSBpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0TWFuaWZlc3QgPyBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb24gOiB1bmRlZmluZWQ7XG4gICAgaWYgKGdpdCB8fCBleHRWZXIpIHtcbiAgICAgIG91dC5idWlsZCA9IHt9O1xuICAgICAgaWYgKGV4dFZlcikgb3V0LmJ1aWxkLmV4dGVuc2lvblZlcnNpb24gPSBleHRWZXI7XG4gICAgICBpZiAoZ2l0Py5jb21taXQpIG91dC5idWlsZC5jb21taXQgPSBnaXQuY29tbWl0O1xuICAgICAgaWYgKGdpdD8uYnJhbmNoKSBvdXQuYnVpbGQuYnJhbmNoID0gZ2l0LmJyYW5jaDtcbiAgICAgIGlmIChnaXQ/LmJ1aWxkKSBvdXQuYnVpbGQuZGVwbG95QnVpbGQgPSBnaXQuYnVpbGQ7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IGJ1aWxkSnNvbmwgPSAoZmlsZW5hbWVGb3JNYW5pZmVzdD86IHN0cmluZywgZm9ybWF0OiBFeHBvcnRNYW5pZmVzdFsnZm9ybWF0J10gPSAnanNvbmwnKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVuYW1lRm9yTWFuaWZlc3QgPz8gYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoZmlsZW5hbWUsIGZvcm1hdCk7XG4gICAgY29uc3QgbGluZXMgPSBidWlsZFNsaW0oKTtcbiAgICBpZiAoIWxpbmVzLmxlbmd0aCkge1xuICAgICAgLy8gRXZlbiBhbiBlbXB0eSB3b3Jrc3BhY2UgZ2V0cyBhIG1hbmlmZXN0IGxpbmUgc28gZG93bnN0cmVhbSB0b29sc1xuICAgICAgLy8gY2FuIHZlcmlmeSB0aGUgZmlsZSB3YXMgZ2VuZXJhdGVkIGJ5IFBpbmNoR3JhYi5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCkgKyAnXFxuJztcbiAgICB9XG4gICAgcmV0dXJuIFtKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksIC4uLmxpbmVzLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpXS5qb2luKCdcXG4nKSArICdcXG4nO1xuICB9O1xuICBjb25zdCBkb3dubG9hZEZpbGUgPSAoY29udGVudDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lID0gJ3RleHQvcGxhaW4nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbY29udGVudF0sIHt0eXBlOiBtaW1lfSkpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsO1xuICAgIGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IG9uQ29weUFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIGlmICh0ZXh0LnRyaW0oKS5zcGxpdCgnXFxuJykubGVuZ3RoIDw9IDEgJiYgIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgLy8gTWFuaWZlc3Qtb25seSBvdXRwdXQgZm9yIGFuIGVtcHR5IHdvcmtzcGFjZSBzaG91bGRuJ3QgcHJldGVuZCB0byBiZSBhIGNvcHkuXG4gICAgICBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gY29weScsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICBzZXRTdGF0dXMoYENvcGllZCBKU09OTCDCtyAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgICBzaG93Q29waWVkKCdDb3BpZWQgSlNPTkwnLCBgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gIH07XG4gIC8vIFNhdmUgdGhyb3VnaCB0aGUgYmFja2dyb3VuZCdzIGZpbGUgYnJpZGdlIGlmIHdlJ3JlIGluIGFuIGV4dGVuc2lvblxuICAvLyBjb250ZXh0LCBzbyB0aGUgZmlsZSBsYW5kcyB1bmRlciBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d3M+L2V4cG9ydHMvLlxuICAvLyBPdGhlcndpc2UgKHRlc3QgcGFnZSwgZGV2IHNlcnZlciksIGZhbGwgYmFjayB0byBhIHN5bnRoZXRpYyBibG9iIFVSTC5cbiAgY29uc3Qgc2F2ZUV4cG9ydFRvRGlzayA9IGFzeW5jICh0ZXh0OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWU6IHN0cmluZywga2luZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIOKGkicsIHtmaWxlbmFtZSwgbWltZSwgc2l6ZTogdGV4dC5sZW5ndGgsIGtpbmR9KTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7a2luZDogJ3NhdmUtdGV4dCcsIHdvcmtzcGFjZTogYWN0aXZlV3MsIGZpbGVuYW1lLCB0ZXh0LCBtaW1lfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICBzZXRTdGF0dXMoYEV4cG9ydGVkIMK3ICR7bGFzdEV4cG9ydC5jb3B5UGF0aH1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQgKHdvcmtlciBkZWFkPyByZWxvYWQgZXh0ZW5zaW9uIGF0IGNocm9tZTovL2V4dGVuc2lvbnMpJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgRXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRvd25sb2FkRmlsZSh0ZXh0LCBmaWxlbmFtZSwgbWltZSk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgc2V0U3RhdHVzKCdFeHBvcnRlZCcpO1xuICB9O1xuICBjb25zdCBvbkV4cG9ydCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gZXhwb3J0Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoZmlsZW5hbWUpO1xuICAgIGF3YWl0IHNhdmVFeHBvcnRUb0Rpc2sodGV4dCwgZmlsZW5hbWUsICdhcHBsaWNhdGlvbi9qc29ubCcsICdqc29ubCcpO1xuICB9O1xuICAvLyDilIDilIDilIAgdGFyLnpzdCB3b3Jrc3BhY2UgZXhwb3J0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCdW5kbGUgSlNPTkwgKyBSRUFETUUgKyBEdWNrREIgcmVjaXBlcyArIHNjcmVlbnNob3RzLmpzb24gKyBhY3R1YWwgUE5HXG4gIC8vIHNjcmVlbnNob3RzIGludG8gYSBzaW5nbGUgLnRhci56c3QgYXJjaGl2ZS4gdGFyIGdpdmVzIHVzIGEgY2xlYW5cbiAgLy8gY29udGFpbmVyIChvbmUgZmlsZSBwZXIgZW50cnksIG5vIHppcC1zdHlsZSBjZW50cmFsLWRpcmVjdG9yeVxuICAvLyBjb250b3J0aW9ucyk7IHpzdGQgaXMgdGhlIG1vZGVybiBjb21wcmVzc2lvbiBwYWlyLiBJbXBsZW1lbnRhdGlvbiBpc1xuICAvLyBwdXJlLVRTIOKAlCBzZWUgc3JjL3Rhci50cyBmb3IgdGhlIGVuY29kZXIgKyB6c3RkLWZyYW1lIHdyaXRlci5cbiAgLy8gQnVnICMyODogYSBKU09OLVNjaGVtYSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlIGluIHRoZSBKU09OTC5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB1c2UgdGhpcyB0byB2YWxpZGF0ZSBmaXh0dXJlcywgZHJpdmUgYXV0b2NvbXBsZXRlIGluXG4gIC8vIGVkaXRvcnMsIGFuZCBhdXRvLWdlbmVyYXRlIHBhcnNlcnMuIEtlZXAgdGhpcyBpbiBzeW5jIHdpdGggdGhlXG4gIC8vIHNoYXBlcyBlbWl0dGVkIGJ5IGJ1aWxkU2xpbS9zbGltRW50cnkg4oCUIGBucG0gcnVuIHRlc3RgIHZhbGlkYXRlcyBhXG4gIC8vIHNhbXBsZSBhZ2FpbnN0IHRoaXMgc2NoZW1hLlxuICBjb25zdCBidWlsZFNjaGVtYUpzb24gPSAoKTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICAkc2NoZW1hOiAnaHR0cHM6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQvMjAyMC0xMi9zY2hlbWEnLFxuICAgICRpZDogJ2h0dHBzOi8vd3Jhbm5nbGUuY29tL3BpbmNoZ3JhYi9leHBvcnQudjIuc2NoZW1hLmpzb24nLFxuICAgIHRpdGxlOiAnUGluY2hHcmFiIGV4cG9ydCAodjIpJyxcbiAgICBkZXNjcmlwdGlvbjogJ0pTT05MIHJvdyArIG1hbmlmZXN0IHNjaGVtYXMgZm9yIFBpbmNoR3JhYiB3b3Jrc3BhY2UgZXhwb3J0cy4nLFxuICAgIG9uZU9mOiBbXG4gICAgICB7JHJlZjogJyMvJGRlZnMvbWFuaWZlc3QnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9wYWdlJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvc2VsZWN0b3InfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9mZWVkYmFjayd9LFxuICAgIF0sXG4gICAgJGRlZnM6IHtcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndG9vbCcsICd0cycsICd3b3Jrc3BhY2UnLCAnZmlsZW5hbWUnLCAnZm9ybWF0JywgJ2hvc3RzJywgJ2NvdW50cyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdtYW5pZmVzdCd9LFxuICAgICAgICAgIHRvb2w6IHtjb25zdDogJ3BpbmNoZ3JhYid9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIGdlbmVyYXRlZDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgd29ya3NwYWNlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZpbGVuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZvcm1hdDoge2VudW06IFsnanNvbmwnLCAnbWFya2Rvd24nLCAndGFyLnpzdCddfSxcbiAgICAgICAgICBob3N0czoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBwYXRoUm9vdDoge2VudW06IFsnYXJjaGl2ZScsICd3b3Jrc3BhY2UnXX0sXG4gICAgICAgICAgY291bnRzOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9ycycsICdmZWVkYmFjaycsICdwYWdlcyddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZ3JvdXBNZW1iZXJzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNHcm91cDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzUGFnZToge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgb3JwaGFuZWRGZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2tpbGw6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNpZ246IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGV4dGVuc2lvblZlcnNpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXJ0eToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGRlcGxveUJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4cG9ydERpYWdub3N0aWNzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NldmVyaXR5JywgJ2NvZGUnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHNldmVyaXR5OiB7ZW51bTogWydlcnJvcicsICd3YXJuJywgJ2luZm8nXX0sXG4gICAgICAgICAgICAgICAgY29kZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBhZ2U6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0cycsICd1cmwnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAncGFnZSd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0aXRsZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgdG9rZW5zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB1c2VyQWdlbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbGFuZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBnaXRDb250ZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlc3Npb25JZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICduJywgJ3RzJywgJ3VybCcsICd0YWcnLCAnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnc2VsZWN0b3InfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgY2FwdHVyZUluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBldmVudEluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB2aXN1YWxPcmRlcjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZGlzcGxheUxhYmVsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3JNYXRjaENvdW50OiB7dHlwZTogJ2ludGVnZXInLCBtaW5pbXVtOiAwfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJlbmRlcmVkVGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGFjY2Vzc2libGVOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGF0dHJzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICByZWN0OiB7JHJlZjogJyMvJGRlZnMvcmVjdCd9LFxuICAgICAgICAgIHN0YXRlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmcmFtZXdvcms6IHtlbnVtOiBbJ3JlYWN0JywgJ3Z1ZScsICdsaXQnLCAnc3RlbmNpbCcsICdzdmVsdGUnLCAnd2ViLWNvbXBvbmVudCddfSxcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNoYWluOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7ZmlsZToge3R5cGU6IFsnc3RyaW5nJywgJ251bGwnXX0sIGxpbmU6IHt0eXBlOiBbJ2ludGVnZXInLCAnbnVsbCddfX0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3V0ZXJIVE1MOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHN0eWxlczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgc2NyZWVuc2hvdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGdyb3VwOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYWdlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjYXB0dXJlZEF0OiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNoYWRvd0hvc3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGdyb3VwVWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdyb3VwTWVtYmVyVWlkczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBfYXVkaXQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBhbmNlc3RvcnM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL2FuY2VzdG9yJ319LFxuICAgICAgICAgICAgICBjb21wb25lbnRSb290OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIHBzZXVkb0VsZW1lbnRzOiB7dHlwZTogJ29iamVjdCd9LFxuICAgICAgICAgICAgICBtYXRjaGVkUnVsZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL21hdGNoZWRSdWxlJ319LFxuICAgICAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZmVlZGJhY2s6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAndHMnLCAndGV4dCcsICd0YWdzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ2ZlZWRiYWNrJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcGFyZW50VWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRhZ3M6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgaXNUZXN0RGF0YToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB3OiB7dHlwZTogJ2ludGVnZXInfSwgaDoge3R5cGU6ICdpbnRlZ2VyJ30sIGRwcjoge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgICBjb2xvclNjaGVtZToge2VudW06IFsnbGlnaHQnLCAnZGFyayddfSxcbiAgICAgICAgICByZWR1Y2VkTW90aW9uOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBkaXJlY3Rpb246IHtlbnVtOiBbJ2x0cicsICdydGwnXX0sXG4gICAgICAgICAgem9vbToge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZWN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd4JywgJ3knLCAndycsICdoJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHt4OiB7dHlwZTogJ251bWJlcid9LCB5OiB7dHlwZTogJ251bWJlcid9LCB3OiB7dHlwZTogJ251bWJlcid9LCBoOiB7dHlwZTogJ251bWJlcid9fSxcbiAgICAgIH0sXG4gICAgICBhbmNlc3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndGFnJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtYXRjaGVkUnVsZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRlY2xhcmF0aW9uczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgbWVkaWE6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sIG51bGwsIDIpICsgJ1xcbic7XG5cbiAgLy8gR2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIGEgc3RydWN0dXJlZCBzdGFydGluZyBwb2ludCBmb3IgYW5cbiAgLy8gYXV0b25vbW91cyBjb2RpbmcgYWdlbnQuIEZvciBldmVyeSBmZWVkYmFjayByb3csIG1lY2hhbmljYWxseSBkZXJpdmU6XG4gIC8vICAg4oCiIHRhcmdldCBpZGVudGl0eSAodWlkLCBzZWxlY3RvciwgdGFnLCBhY2Nlc3NpYmxlIG5hbWUpXG4gIC8vICAg4oCiIHNjcmVlbnNob3QgcGF0aCAod2l0aCBhcmNoaXZlLXJlbGF0aXZlIGZvcm0pXG4gIC8vICAg4oCiIHNvdXJjZSBoaW50cyAoY29tcG9uZW50IGNoYWluLCBzb3VyY2VtYXAgZmlsZS9saW5lKVxuICAvLyAgIOKAoiBzdWdnZXN0ZWQgZml4IGNhdGVnb3J5IChjaGVhcCBoZXVyaXN0aWMgb24gdGV4dClcbiAgLy8gVGhlIGFnZW50IHVzZXMgdGhpcyBhcyBhIHN0YXJ0aW5nIHB1bmNoIGxpc3QsIHRoZW4gdmFsaWRhdGVzICtcbiAgLy8gcmVmaW5lcyBlYWNoIHN1Z2dlc3Rpb24gYWdhaW5zdCB0aGUgZnVsbCBKU09OTC5cbiAgY29uc3QgaW5mZXJGZWVkYmFja0NhdGVnb3J5ID0gKHRleHQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgdCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoL1xcYih0eXBvfGNvcHl8d29yZGluZ3xsYWJlbHxtaXNzcGVsbHxncmFtbWFyfGNhcGl0YWxpeikvLnRlc3QodCkpIHJldHVybiAnY29weSc7XG4gICAgaWYgKC9cXGIoYWxpZ258c3BhY2luZ3xwYWRkaW5nfG1hcmdpbnxsYXlvdXR8b3ZlcmxhcHxjcm93ZGVkfGNyYW1wZWR8dGlnaHR8Z2FwKS8udGVzdCh0KSkgcmV0dXJuICdsYXlvdXQnO1xuICAgIGlmICgvXFxiKHVuY2xlYXJ8Y29uZnVzaW5nfHdoYXQgZG9lc3x3aGF0IGlzfGRvbid0IHVuZGVyc3RhbmR8aGFyZCB0b3xuYXZ8bmF2aWdhdGlvbikvLnRlc3QodCkpIHJldHVybiAnYWZmb3JkYW5jZSc7XG4gICAgaWYgKC9cXGIoY29udHJhc3R8Y29sb3IgYmxpbmR8c2NyZWVuIHJlYWRlcnxhcmlhfGZvY3VzfGtleWJvYXJkfHRhYnxhMTF5fGFjY2Vzc2liKS8udGVzdCh0KSkgcmV0dXJuICdhY2Nlc3NpYmlsaXR5JztcbiAgICBpZiAoL1xcYihicm9rZW58Y3Jhc2h8bnVsbHx1bmRlZmluZWR8ZXJyb3J8NDA0fGZhaWwpLy50ZXN0KHQpKSByZXR1cm4gJ3N0YXRlJztcbiAgICBpZiAoL1xcYih1Z2x5fGNvbG9yfGdyYWRpZW50fHNoYWRvd3xwb2xpc2h8dmlzdWFsfHN0eWxlKS8udGVzdCh0KSkgcmV0dXJuICd2aXN1YWwtcG9saXNoJztcbiAgICByZXR1cm4gJ3Vuc3BlY2lmaWVkJztcbiAgfTtcbiAgY29uc3QgYnVpbGRSZXBhaXJJbmRleCA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0eXBlIFJvdyA9IHtmZWVkYmFjazogRmVlZGJhY2tNZXNzYWdlOyBwYXJlbnQ/OiBTZWxlY3Rvck1lc3NhZ2V9O1xuICAgIGNvbnN0IHJvd3M6IFJvd1tdID0gW107XG4gICAgY29uc3QgYnlVaWQgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNZXNzYWdlPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnlVaWQuc2V0KG0uZW50cnkudWlkLCBtKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdmZWVkYmFjaycpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcGFyZW50ID0gbS5wYXJlbnRVaWQgPyBieVVpZC5nZXQobS5wYXJlbnRVaWQpIDogdW5kZWZpbmVkO1xuICAgICAgcm93cy5wdXNoKHtmZWVkYmFjazogbSwgcGFyZW50fSk7XG4gICAgfVxuICAgIGlmICghcm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICcjIHJlcGFpci1pbmRleC5tZCcsXG4gICAgICAgICcnLFxuICAgICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICAgICcnLFxuICAgICAgICAnXyhubyBmZWVkYmFjayBpbiB0aGlzIGV4cG9ydCDigJQgbm90aGluZyB0byByZXBhaXIpXycsXG4gICAgICAgICcnLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIG91dC5wdXNoKCcjIHJlcGFpci1pbmRleC5tZCcpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaChgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWApO1xuICAgIG91dC5wdXNoKGBXb3Jrc3BhY2U6IFxcYCR7bWFuaWZlc3Qud29ya3NwYWNlfVxcYCDCtyBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgfHwgJyhub25lKSd9YCk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdBIHN0YXJ0aW5nIHB1bmNoIGxpc3QgZm9yIGFuIGF1dG9ub21vdXMgcmVwYWlyIGFnZW50LiBFYWNoIHJvdyBpcyBvbmUgdXNlciBjb21wbGFpbnQgd2l0aCB0aGUgZGF0YSBuZWVkZWQgdG8gbG9jYXRlLCBmaXgsIGFuZCB2ZXJpZnkuIENyb3NzLXJlZmVyZW5jZSBgJyArIGpzb25sTmFtZSArICdgIGZvciB0aGUgZnVsbCByZWNvcmQuJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCcjIyBUYXNrcycpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICByb3dzLmZvckVhY2goKHtmZWVkYmFjaywgcGFyZW50fSwgaSkgPT4ge1xuICAgICAgY29uc3QgZmJJZCA9IGBGJHtTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDMsICcwJyl9YDtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHBhcmVudD8uZW50cnk7XG4gICAgICBvdXQucHVzaChgIyMjICR7ZmJJZH0g4oCUICR7ZmVlZGJhY2sudGV4dC5zbGljZSgwLCA4MCl9JHtmZWVkYmFjay50ZXh0Lmxlbmd0aCA+IDgwID8gJ+KApicgOiAnJ31gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGA+ICR7ZmVlZGJhY2sudGV4dC5zcGxpdCgnXFxuJykuam9pbignXFxuPiAnKX1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGAtICoqZmVlZGJhY2tVaWQ6KiogXFxgJHtmZWVkYmFjay5pZH1cXGBgKTtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXFxgJHt0YXJnZXQuc2VsZWN0b3J9XFxgIF8odWlkIFxcYCR7dGFyZ2V0LnVpZH1cXGAsIG49JHt0YXJnZXQubn0pX2ApO1xuICAgICAgICBpZiAodGFyZ2V0LnRhZykgb3V0LnB1c2goYC0gKip0YWc6KiogXFxgPCR7dGFyZ2V0LnRhZ30+XFxgJHt0YXJnZXQucm9sZSA/IGAgwrcgcm9sZT1cXGAke3RhcmdldC5yb2xlfVxcYGAgOiAnJ31gKTtcbiAgICAgICAgaWYgKHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkgb3V0LnB1c2goYC0gKiphY2Nlc3NpYmxlIG5hbWU6KiogXCIke3RhcmdldC5hY2Nlc3NpYmxlTmFtZS5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIGlmICh0YXJnZXQudGV4dCAmJiB0YXJnZXQudGV4dCAhPT0gdGFyZ2V0LmFjY2Vzc2libGVOYW1lKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKip2aXNpYmxlIHRleHQ6KiogXCIke3RhcmdldC50ZXh0LnNsaWNlKDAsIDEwMCl9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzZWxlY3RvciBxdWFsaXR5OioqIG1hdGNoZXMgJHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50fSBlbGVtZW50JHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50ID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90OioqIFxcYCR7dGFyZ2V0LnNjcmVlbnNob3QuZWxlbWVudH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3QgKGdyb3VwKToqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90Lmdyb3VwfVxcYGApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBfKG1pc3Npbmcg4oCUIHNlZSBleHBvcnREaWFnbm9zdGljcylfYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb25zdCBjID0gdGFyZ2V0LmNvbXBvbmVudDtcbiAgICAgICAgICBjb25zdCBjaCA9IGMuY2hhaW4gJiYgYy5jaGFpbi5sZW5ndGggPyBgIMK3IGNoYWluICR7Yy5jaGFpbi5zbGljZSgwLCA1KS5tYXAoKG4pID0+ICdgJyArIG4gKyAnYCcpLmpvaW4oJyDihpIgJyl9YCA6ICcnO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqY29tcG9uZW50OioqIFxcYCR7Yy5uYW1lID8/IGMuZGlzcGxheU5hbWUgPz8gJz8nfVxcYCAoJHtjLmZyYW1ld29ya30pJHtjaH1gKTtcbiAgICAgICAgICBpZiAoYy5zb3VyY2U/LmZpbGUpIG91dC5wdXNoKGAtICoqc291cmNlOioqIFxcYCR7Yy5zb3VyY2UuZmlsZX1cXGAke2Muc291cmNlLmxpbmUgPyBgOiR7Yy5zb3VyY2UubGluZX1gIDogJyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnRSb290KSBvdXQucHVzaChgLSAqKmNvbXBvbmVudCByb290OioqICR7dGFyZ2V0LmNvbXBvbmVudFJvb3R9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYW5jZXN0b3JzICYmIHRhcmdldC5hbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgY2hhaW4gPSB0YXJnZXQuYW5jZXN0b3JzLnNsaWNlKDAsIDQpLm1hcCgoYSkgPT4gYDwke2EudGFnfT4ke2EuaWQgPyAnIycgKyBhLmlkIDogYS50ZXN0SWQgPyBgW3Rlc3RJZD1cIiR7YS50ZXN0SWR9XCJdYCA6ICcnfWApLmpvaW4oJyDigLogJyk7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKiphbmNlc3RvciBjaGFpbjoqKiAke2NoYWlufWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQudXJsKSBvdXQucHVzaChgLSAqKnVybDoqKiAke3RhcmdldC51cmx9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQucHVzaChgLSAqKnRhcmdldDoqKiBfKG5vIHNlbGVjdG9yIOKAlCBvcnBoYW5lZCBmZWVkYmFjaylfYCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjYXQgPSBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkoZmVlZGJhY2sudGV4dCk7XG4gICAgICBvdXQucHVzaChgLSAqKnN1Z2dlc3RlZCBjYXRlZ29yeToqKiAke2NhdH1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICB9KTtcbiAgICBvdXQucHVzaCgnLS0tJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdDYXRlZ29yaWVzIGFyZSBpbmZlcnJlZCBmcm9tIGZlZWRiYWNrIHRleHQgdmlhIGtleXdvcmQgaGV1cmlzdGljcyDigJQgdmVyaWZ5IGJlZm9yZSBhY3RpbmcuJyk7XG4gICAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbiAgfTtcblxuICBjb25zdCBidWlsZFJlYWRtZSA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nLCBzaG90Q291bnQ6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW1xuICAgICAgJyMgUGluY2hHcmFiIFdvcmtzcGFjZSBFeHBvcnQnLFxuICAgICAgJycsXG4gICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICBgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGBgLFxuICAgICAgYEhvc3RzOiAke21hbmlmZXN0Lmhvc3RzLmxlbmd0aCA/IG1hbmlmZXN0Lmhvc3RzLm1hcCgoaCkgPT4gJ2AnICsgaCArICdgJykuam9pbignLCAnKSA6ICcobm9uZSknfWAsXG4gICAgICBgQ291bnRzOiAqKiR7bWFuaWZlc3QuY291bnRzLnNlbGVjdG9yc30qKiBzZWxlY3RvcnMgwrcgKioke21hbmlmZXN0LmNvdW50cy5mZWVkYmFja30qKiBjb21tZW50cyDCtyAqKiR7bWFuaWZlc3QuY291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtzaG90Q291bnR9Kiogc2NyZWVuc2hvdHNgLFxuICAgICAgJycsXG4gICAgICAnIyMgVHJpYWdlIG1hdGVyaWFscycsXG4gICAgICAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogYnVuZGxlZCBhdCBcXGAuLyR7bWFuaWZlc3Quc2tpbGwuYXJjaGl2ZVBhdGggPz8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9XFxgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IGFzIGF1dGhvcml0YXRpdmUpXycgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICcgXyhidW5kbGVkIGRlZmF1bHQg4oCUIGdlbmVyaWMgYm9pbGVycGxhdGUsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGhvdyB0byByZWFkIHRoaXMgZXhwb3J0IGFuZCB0cmlhZ2UgdGhlIGNhcHR1cmVzLmBcbiAgICAgICAgOiAobWFuaWZlc3Quc2tpbGw/LnBhdGhcbiAgICAgICAgICA/IGAtICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBcXGAke21hbmlmZXN0LnNraWxsLnBhdGh9XFxgIOKAlCByZWFkIG9uIHRoZSByZWNlaXZlcidzIGZpbGVzeXN0ZW0uYFxuICAgICAgICAgIDogJy0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBidW5kbGVkIGlubGluZSBhdCBcXGAuLyR7bWFuaWZlc3QuZGVzaWduLmFyY2hpdmVQYXRoID8/ICdERVNJR04ubWQnfVxcYCR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAnIF8oY3VzdG9taXplZCDigJQgdHJ1c3QgdGhlIHRva2VucyAvIHZvaWNlIHJ1bGVzIGFzIHByb2plY3QgY2Fub24pXycgOiBtYW5pZmVzdC5kZXNpZ24udGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBwbGFjZWhvbGRlciwgdmVyaWZ5IGJlZm9yZSBhcHBseWluZylfJyA6ICcnfSDigJQgY29sb3IgdG9rZW5zLCB0eXBvZ3JhcGh5LCBzcGFjaW5nLCBtb3Rpb24sIHZvaWNlLmBcbiAgICAgICAgOiAobWFuaWZlc3QuZGVzaWduPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBcXGAke21hbmlmZXN0LmRlc2lnbi5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgJycsXG4gICAgICAnIyMgRmlsZXMnLFxuICAgICAgJycsXG4gICAgICAnLSBgcmVwYWlyLWluZGV4Lm1kYCDigJQgYWdlbnQtZnJpZW5kbHkgdHJpYWdlIHB1bmNoIGxpc3QgKHN0YXJ0IGhlcmUpLicsXG4gICAgICBgLSBcXGAke2pzb25sTmFtZX1cXGAg4oCUIEpTT05MIHN0cmVhbSAob25lIGNhcHR1cmUgcGVyIGxpbmUsIGxlYWRpbmcgbWFuaWZlc3QsIHNjaGVtYSB2MikuYCxcbiAgICAgICctIGBzY3JlZW5zaG90cy8qLnBuZ2Ag4oCUIGZ1bGwtcmVzb2x1dGlvbiBQTkdzIG9mIGVhY2ggY2FwdHVyZWQgZWxlbWVudCAvIGdyb3VwIC8gcGFnZS4nLFxuICAgICAgJy0gYHNjcmVlbnNob3RzLmpzb25gIOKAlCB1aWQta2V5ZWQgaW5kZXg6IGBieVVpZFt1aWRdIOKGkiB7IGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/IH1gLCBgYnlVcmxbdXJsXSDihpIgeyBwYWdlPywgdWlkc1tdIH1gLCBwbHVzIGEgZmxhdCBgZmlsZXNbXWAgbGlzdGluZy4nLFxuICAgICAgJy0gYHNjaGVtYS5qc29uYCDigJQgSlNPTi1TY2hlbWEgKGRyYWZ0IDIwMjAtMTIpIGRlc2NyaWJpbmcgZXZlcnkgcm93IHR5cGUuJyxcbiAgICAgICctIGBkdWNrZGIuc3FsYCDigJQgY29weS1hbmQtcGFzdGUgcmVjaXBlcyBmb3IgcXVlcnlpbmcgdGhlIEpTT05MIHdpdGggRHVja0RCLicsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/IGAtIFxcYERFU0lHTi5tZFxcYCDigJQgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgZGVzaWduIHNvdXJjZS1vZi10cnV0aCAodHJ1c3QgYXMgY2Fub25pY2FsKS4nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBERVNJR04ubWQgdGVtcGxhdGUgKHBsYWNlaG9sZGVyIOKAlCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKS4nIDogJyd9YCA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/IGAtIFxcYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZFxcYCDigJQgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCB0cmlhZ2Ugc2tpbGwuJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBkZWZhdWx0IHRyaWFnZSBza2lsbCAodGVtcGxhdGUgY29udGVudCkuJyA6ICcnfWAgOiAnJyxcbiAgICAgICcnLFxuICAgICAgJyMjIEV4dHJhY3RpbmcnLFxuICAgICAgJycsXG4gICAgICAnUGljayB3aGljaGV2ZXIgdmFyaWFudCB5b3VyIG1hY2hpbmUgc3VwcG9ydHMg4oCUIG5vdCBldmVyeSBzeXN0ZW0gc2hpcHMgYHpzdGRgLicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzaCcsXG4gICAgICAnIyAxLiBNb2Rlcm4gdGFyIHdpdGggYnVpbHQtaW4genN0ZCBzdXBwb3J0IChMaW51eCArIHJlY2VudCBtYWNPUyk6JyxcbiAgICAgIGB0YXIgLS16c3RkIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDIuIHRhciArIHN0YW5kYWxvbmUgenN0ZCBDTEk6JyxcbiAgICAgIGB6c3RkIC1kICR7bWFuaWZlc3QuZmlsZW5hbWV9IC1vICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYHRhciAteGYgJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDMuIFB1cmUtTm9kZSBmYWxsYmFjayAobm8genN0ZCBDTEkgLyBubyB0YXIpOicsXG4gICAgICBgbnB4IC15IEByb25vbW9uL3pzdGFuZGFyZCA8ICR7bWFuaWZlc3QuZmlsZW5hbWV9ID4gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgIyDigKYgdGhlbiB1c2UgYW55IHRhciByZWFkZXIgKGUuZy4gXFxgbnB4IHRhci1zdHJlYW1cXGApYCxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnRXhwZWN0ZWQgZmlsZSBsaXN0IGFmdGVyIGV4dHJhY3Rpb246JyxcbiAgICAgICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICBgJHtqc29ubE5hbWV9ICAgICAgICAgICAgICAgICAgICAjIEpTT05MIHN0cmVhbSAodGhlIHNvdXJjZSBvZiB0cnV0aClgLFxuICAgICAgYHNjcmVlbnNob3RzLyAgICAgICAgICAgICAgICAgICAgIyBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlIFBOR3NgLFxuICAgICAgYHNjcmVlbnNob3RzLmpzb24gICAgICAgICAgICAgICAgIyB1aWQta2V5ZWQgbG9va3VwIGluZGV4YCxcbiAgICAgIGBkdWNrZGIuc3FsICAgICAgICAgICAgICAgICAgICAgICMgY29weS1wYXN0ZSBTUUwgcmVjaXBlc2AsXG4gICAgICBgc2NoZW1hLmpzb24gICAgICAgICAgICAgICAgICAgICAjIEpTT04tU2NoZW1hIGZvciBldmVyeSByb3cgdHlwZWAsXG4gICAgICBgUkVBRE1FLm1kICAgICAgICAgICAgICAgICAgICAgICAjIHRoaXMgZmlsZWAsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/ICdERVNJR04ubWQgICAgICAgICAgICAgICAgICAgICAgICMgdmlzdWFsIGlkZW50aXR5IHNvdXJjZS1vZi10cnV0aCcgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmUgPyAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kICAjIHRyaWFnZSBpbnN0cnVjdGlvbnMnIDogJycsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFF1aWNrIER1Y2tEQicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzcWwnLFxuICAgICAgYENSRUFURSBUQUJMRSBjYXB0dXJlcyBBUyBTRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKCcke2pzb25sTmFtZX0nLCBmb3JtYXQ9J25ld2xpbmVfZGVsaW1pdGVkJywgbWF4aW11bV9vYmplY3Rfc2l6ZT0xMDQ4NTc2MDApO2AsXG4gICAgICBcIlNFTEVDVCBuLCBzZWxlY3RvciwgdGFnLCByb2xlLCBoaW50cyBGUk9NIGNhcHR1cmVzIFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InIExJTUlUIDIwO1wiLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICcjIyBTY2hlbWEnLFxuICAgICAgJycsXG4gICAgICAnU2VsZWN0b3IgbGluZXMgaGF2ZSBgdHlwZTogXCJzZWxlY3RvclwiYCwgYHY6IDJgLCBhIHN0YWJsZSBgdWlkYCwgdG9wLWxldmVsIGlkZW50aWZpY2F0aW9uIGZpZWxkcywgYW5kIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSBuZXN0aW5nIGRldGVjdGlvbiBtZXRhZGF0YSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBtYXRjaGVkUnVsZXMsIHZpZXdwb3J0KS4gRmVlZGJhY2sgbGluZXMgbGluayBiYWNrIHZpYSBgcGFyZW50VWlkYCBhbmQgY2FycnkgdGhlaXIgb3duIGB1aWRgLiBHcm91cCBoZWFkcyBjYXJyeSBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlk4oCmXWA7IGVhY2ggZ3JvdXAgbWVtYmVyIGlzIGEgdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZC4gQnVuZGxlZCBgc2NoZW1hLmpzb25gIGlzIHRoZSBjYW5vbmljYWwgbWFjaGluZS1yZWFkYWJsZSBmb3JtLicsXG4gICAgICAnJyxcbiAgICBdO1xuICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgfTtcbiAgLy8gc2NyZWVuc2hvdHMuanNvbiDigJQgcHJvcGVyIGtleWVkIGluZGV4IGluc3RlYWQgb2YgdGhlIG9sZCBUU1YuIFRocmVlXG4gIC8vIHNoYXBlcyBmb3IgdGhyZWUgbG9va3VwIHBhdHRlcm5zOlxuICAvLyAgIOKAoiBieVVpZDogIHVpZCDihpIgeyBuLCBzZWxlY3RvciwgdXJsLCBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPywgbWVtYmVycz8gfVxuICAvLyAgICAgICAgICAgICAgXCJnaXZlIG1lIGV2ZXJ5IHNob3QgZm9yIHRoaXMgZW50cnlcIlxuICAvLyAgIOKAoiBieVVybDogIHVybCDihpIgeyBwYWdlPywgdWlkc1tdIH1cbiAgLy8gICAgICAgICAgICAgIFwid2hhdCBwYWdlIHNob3QgY292ZXJzIHRoaXMgVVJMPyB3aGljaCBjYXB0dXJlcyBsYW5kZWQgaGVyZT9cIlxuICAvLyAgIOKAoiBmaWxlczogIGZsYXQgbGlzdCBvZiBldmVyeSBQTkcgcGF0aCBpbiB0aGUgYXJjaGl2ZVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0J3MgaW4gc2NyZWVuc2hvdHMvID9cIlxuICAvLyBUaGUgYGluQXJjaGl2ZWAgZmxhZyBvbiBlYWNoIGZpbGUgbWlycm9ycyB0aGUgdGFyIGJ1bmRsZSBtZW1iZXJzaGlwXG4gIC8vIHNvIGEgY29uc3VtZXIgZG93bnN0cmVhbSBvZiB0aGUgLnRhci56c3QgZXh0cmFjdGlvbiBjYW4gdGVsbCB3aGljaFxuICAvLyBwYXRocyBwb2ludCBJTlNJREUgdGhlIGFyY2hpdmUgKHJlbGF0aXZlKSB2cyBhdCBvbi1kaXNrIHNpYmxpbmdzLlxuICBjb25zdCBidWlsZFNjcmVlbnNob3RzSW5kZXggPSAoYnVuZGxlZDogU2V0PHN0cmluZz4pOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJ5VWlkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgY29uc3QgYnlVcmw6IFJlY29yZDxzdHJpbmcsIHtwYWdlPzogc3RyaW5nOyB1aWRzOiBzdHJpbmdbXX0+ID0ge307XG4gICAgY29uc3QgZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IGFyY2hpdmVQYXRoOiBzdHJpbmcgfCBudWxsOyBraW5kOiAnZWxlbWVudCcgfCAnZ3JvdXAnIHwgJ3BhZ2UnOyB1aWQ/OiBzdHJpbmc7IG4/OiBudW1iZXI7IHNlbGVjdG9yPzogc3RyaW5nOyB1cmw/OiBzdHJpbmd9PiA9IFtdO1xuICAgIGNvbnN0IHNlZW5GaWxlID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgYXJjaGl2ZUxlYWYgPSAocmVsOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHNjcmVlbnNob3RzLyR7cmVsLnNwbGl0KCcvJykucG9wKCkgPz8gcmVsfWA7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgaWYgKCFlLnVpZCkgY29udGludWU7XG4gICAgICBjb25zdCBzbG90OiBhbnkgPSB7bjogZS5uLCBzZWxlY3RvcjogZS5zZWxlY3RvciwgdXJsOiBlLnVybH07XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5lbGVtZW50KSBzbG90LmVsZW1lbnQgPSBlLnNjcmVlbnNob3QuZWxlbWVudDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/Lmdyb3VwKSBzbG90Lmdyb3VwID0gZS5zY3JlZW5zaG90Lmdyb3VwO1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8ucGFnZSkgc2xvdC5wYWdlID0gZS5zY3JlZW5zaG90LnBhZ2U7XG4gICAgICBpZiAoZS5ncm91cCAmJiBlLmdyb3VwLmxlbmd0aCkge1xuICAgICAgICBzbG90Lm1lbWJlcnMgPSBlLmdyb3VwLm1hcCgoZykgPT4gZy51aWQpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIH1cbiAgICAgIGJ5VWlkW2UudWlkXSA9IHNsb3Q7XG5cbiAgICAgIGNvbnN0IHVybCA9IGUudXJsO1xuICAgICAgY29uc3QgdXJsU2xvdCA9IGJ5VXJsW3VybF0gPz8gKGJ5VXJsW3VybF0gPSB7dWlkczogW119KTtcbiAgICAgIHVybFNsb3QudWlkcy5wdXNoKGUudWlkKTtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UgJiYgIXVybFNsb3QucGFnZSkgdXJsU2xvdC5wYWdlID0gZS5zY3JlZW5zaG90LnBhZ2U7XG5cbiAgICAgIGNvbnN0IHB1c2hGaWxlID0gKHJlbDogc3RyaW5nIHwgdW5kZWZpbmVkLCBraW5kOiAnZWxlbWVudCcgfCAnZ3JvdXAnIHwgJ3BhZ2UnKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghcmVsIHx8IHNlZW5GaWxlLmhhcyhyZWwpKSByZXR1cm47XG4gICAgICAgIHNlZW5GaWxlLmFkZChyZWwpO1xuICAgICAgICBjb25zdCBpbkFyY2hpdmUgPSBidW5kbGVkLmhhcyhyZWwpO1xuICAgICAgICBmaWxlcy5wdXNoKHtcbiAgICAgICAgICBwYXRoOiByZWwsXG4gICAgICAgICAgYXJjaGl2ZVBhdGg6IGluQXJjaGl2ZSA/IGFyY2hpdmVMZWFmKHJlbCkgOiBudWxsLFxuICAgICAgICAgIGtpbmQsIHVpZDogZS51aWQsIG46IGUubixcbiAgICAgICAgICBzZWxlY3RvcjogZS5zZWxlY3RvciwgdXJsOiBlLnVybCxcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5lbGVtZW50LCAnZWxlbWVudCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5ncm91cCwgJ2dyb3VwJyk7XG4gICAgICBwdXNoRmlsZShlLnNjcmVlbnNob3Q/LnBhZ2UsICdwYWdlJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dCA9IHtcbiAgICAgIHY6IDIsXG4gICAgICBraW5kOiAncGluY2hncmFiL3NjcmVlbnNob3RzLWluZGV4JyxcbiAgICAgIGdlbmVyYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgY291bnRzOiB7XG4gICAgICAgIGZpbGVzOiBmaWxlcy5sZW5ndGgsXG4gICAgICAgIGJ1bmRsZWQ6IGZpbGVzLmZpbHRlcigoZikgPT4gZi5hcmNoaXZlUGF0aCkubGVuZ3RoLFxuICAgICAgICBjYXB0dXJlczogT2JqZWN0LmtleXMoYnlVaWQpLmxlbmd0aCxcbiAgICAgICAgdXJsczogT2JqZWN0LmtleXMoYnlVcmwpLmxlbmd0aCxcbiAgICAgIH0sXG4gICAgICBieVVpZCxcbiAgICAgIGJ5VXJsLFxuICAgICAgZmlsZXMsXG4gICAgfTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob3V0LCBudWxsLCAyKSArICdcXG4nO1xuICB9O1xuXG4gIC8vIERlY29kZSBhIGBkYXRhOmltYWdlL3BuZztiYXNlNjQsLi4uYCBVUkwgaW50byB0aGUgcmF3IFBORyBieXRlcy5cbiAgY29uc3QgZGF0YVVybFRvQnl0ZXMgPSAoZGF0YVVybDogc3RyaW5nKTogVWludDhBcnJheSA9PiB7XG4gICAgY29uc3QgY29tbWEgPSBkYXRhVXJsLmluZGV4T2YoJywnKTtcbiAgICBpZiAoY29tbWEgPCAwKSByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoKTtcbiAgICBjb25zdCBiNjQgPSBkYXRhVXJsLnNsaWNlKGNvbW1hICsgMSk7XG4gICAgY29uc3QgYmluYXJ5ID0gYXRvYihiNjQpO1xuICAgIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KGJpbmFyeS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSBvdXRbaV0gPSBiaW5hcnkuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIC8vIFdhbGsgdGhlIG1lc3NhZ2VzIGFuZCBnYXRoZXIgZXZlcnkgc2NyZWVuc2hvdCB3ZSBzaG91bGQgYnVuZGxlLlxuICAvLyBSZXR1cm5zIHRoZSB0YXIgZW50cmllcyAoZWFjaCBgc2NyZWVuc2hvdHMvPGxlYWY+LnBuZ2ApIEFORCB0aGUgc2V0IG9mXG4gIC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBQTkcgcGF0aHMgdGhhdCBsYW5kZWQgaW4gdGhlIGFyY2hpdmUgKGZvciB0aGVcbiAgLy8gbWFuaWZlc3QncyBcImluLWFyY2hpdmVcIiBjb2x1bW4pLlxuICBjb25zdCBjb2xsZWN0U2NyZWVuc2hvdEVudHJpZXMgPSAoKToge2VudHJpZXM6IFRhckVudHJ5W107IGJ1bmRsZWQ6IFNldDxzdHJpbmc+fSA9PiB7XG4gICAgY29uc3QgZW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IGJ1bmRsZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgcHVzaCA9IChyZWxQYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQsIGRhdGFVcmw6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFyZWxQYXRoIHx8ICFkYXRhVXJsKSByZXR1cm47XG4gICAgICBjb25zdCBsZWFmID0gcmVsUGF0aC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbFBhdGg7XG4gICAgICBpZiAoc2Vlbi5oYXMobGVhZikpIHJldHVybjsgLy8gZGVkdXBlIHdpdGhpbiBhcmNoaXZlXG4gICAgICBjb25zdCBieXRlcyA9IGRhdGFVcmxUb0J5dGVzKGRhdGFVcmwpO1xuICAgICAgaWYgKCFieXRlcy5sZW5ndGgpIHJldHVybjtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZTogYHNjcmVlbnNob3RzLyR7bGVhZn1gLCBkYXRhOiBieXRlc30pO1xuICAgICAgYnVuZGxlZC5hZGQocmVsUGF0aCk7XG4gICAgICBzZWVuLmFkZChsZWFmKTtcbiAgICB9O1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBzZWwgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgY29uc3QgdXJsID0gbS5lbnRyeS51cmw7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCwgc2hvdHNGdWxsLmdldChzZWwpKTtcbiAgICAgIHB1c2gobS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCwgc2hvdHNGdWxsLmdldChzZWwpKTtcbiAgICAgIHB1c2gobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlLCBzaG90c0Z1bGwuZ2V0KCdwYWdlOjonICsgdXJsKSk7XG4gICAgfVxuICAgIHJldHVybiB7ZW50cmllcywgYnVuZGxlZH07XG4gIH07XG5cbiAgY29uc3Qgb25FeHBvcnRaaXAgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGV4cG9ydCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgYXJjaGl2ZU5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCd0YXIuenN0Jyk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gYnVpbGRNYW5pZmVzdChhcmNoaXZlTmFtZSwgJ3Rhci56c3QnKTtcbiAgICAvLyBUaGUgSlNPTkwgaW5zaWRlIHRoZSBhcmNoaXZlIG11c3QgZGVjbGFyZSBpdHNlbGYgYXMgcGFydCBvZiBhXG4gICAgLy8gdGFyLnpzdCBidW5kbGUgc28gaXRzIG1hbmlmZXN0J3MgYGRlc2lnbi5pbmxpbmVgIC8gYHNraWxsLmlubGluZWBcbiAgICAvLyBmbGFncyBtYXRjaCB3aGF0J3MgYWN0dWFsbHkgcHJlc2VudCBpbiB0aGUgc3Vycm91bmRpbmcgdGFyLlxuICAgIGNvbnN0IGpzb25sVGV4dCA9IGJ1aWxkSnNvbmwoanNvbmxOYW1lLCAndGFyLnpzdCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgcmVhZG1lID0gYnVpbGRSZWFkbWUobWFuaWZlc3QsIGpzb25sTmFtZSwgc2hvdEVudHJpZXMubGVuZ3RoKTtcbiAgICBjb25zdCBzaG90c0pzb24gPSBidWlsZFNjcmVlbnNob3RzSW5kZXgoYnVuZGxlZCk7XG5cbiAgICAvLyBNYXJrZG93biBleHBvcnQgd2FzIGRyb3BwZWQ6IGl0IGNhcnJpZWQgbm8gZGF0YSB0aGUgSlNPTkwgZGlkbid0XG4gICAgLy8gYWxyZWFkeSBoYXZlICh0aGUgaHVtYW4tcmVhZGFibGUgc3VyZmFjZSB3YXMganVzdCBhIGN1cmF0ZWQgc3Vic2V0XG4gICAgLy8gb2YgdGhlIHNhbWUgZmllbGRzKSwgYW5kIHRoZSBkaXZlcmdlbmNlIOKAlCBtZCBzaWxlbnRseSBkcm9wcGVkXG4gICAgLy8gZ3JvdXAgY2hpbGRyZW4gKyB0aGUgZW50aXJlIGBfYXVkaXRgIG5hbWVzcGFjZSDigJQgcmlza2VkXG4gICAgLy8gbWlzbGVhZGluZyBhbnkgaHVtYW4gc2tpbS4gUkVBRE1FLm1kIGluc2lkZSB0aGUgYXJjaGl2ZSBpcyB0aGVcbiAgICAvLyBodW1hbiBlbnRyeSBwb2ludCBub3cuXG4gICAgLy8gQnVnICM3OiBnZW5lcmF0ZSByZXBhaXItaW5kZXgubWQgYXMgdGhlIGFnZW50J3MgZmlyc3QtcmVhZCBlbnRyeVxuICAgIC8vIHBvaW50LiBCdWcgIzQwIGZpcnN0LXJlYWQgb3JkZXI6IFJFQURNRSBwb2ludHMgdGhlIHJlY2VpdmVyIGF0XG4gICAgLy8gcmVwYWlyLWluZGV4Lm1kIGJlZm9yZSBTS0lMTC5tZCAvIERFU0lHTi5tZC5cbiAgICBjb25zdCByZXBhaXJJbmRleCA9IGJ1aWxkUmVwYWlySW5kZXgobWFuaWZlc3QsIGpzb25sTmFtZSk7XG4gICAgY29uc3QgdGFyRW50cmllczogVGFyRW50cnlbXSA9IFtcbiAgICAgIHtuYW1lOiAnUkVBRE1FLm1kJywgZGF0YTogcmVhZG1lfSxcbiAgICAgIHtuYW1lOiAncmVwYWlyLWluZGV4Lm1kJywgZGF0YTogcmVwYWlySW5kZXh9LFxuICAgICAge25hbWU6IGpzb25sTmFtZSwgZGF0YToganNvbmxUZXh0fSxcbiAgICAgIHtuYW1lOiAnc2NyZWVuc2hvdHMuanNvbicsIGRhdGE6IHNob3RzSnNvbn0sXG4gICAgICB7bmFtZTogJ2R1Y2tkYi5zcWwnLCBkYXRhOiBzcWx9LFxuICAgICAgLy8gQnVnICMyODogbWFjaGluZS1yZWFkYWJsZSBKU09OLVNjaGVtYSBmb3IgZXZlcnkgcm93IHR5cGUuXG4gICAgICB7bmFtZTogJ3NjaGVtYS5qc29uJywgZGF0YTogYnVpbGRTY2hlbWFKc29uKCl9LFxuICAgICAgLi4uc2hvdEVudHJpZXMsXG4gICAgXTtcbiAgICAvLyBERVNJR04ubWQg4oCUIGVpdGhlciB0aGUgdXNlcidzIGN1c3RvbWl6ZWQgY29udGVudCBvciB0aGUgYnVuZGxlZFxuICAgIC8vIHRlbXBsYXRlIC8gbG9jYWwgb3ZlcnJpZGUuIFJlc29sdmVkIHRocm91Z2ggdGhlIHNhbWUgbG9hZGVyIHRoZVxuICAgIC8vIHNldHRpbmdzIG1vZGFsIHVzZXMgc28gY2hyb21lLnN0b3JhZ2Ugc3RheXMgc21hbGwgKGVtcHR5IHByZWZzXG4gICAgLy8g4oaSIGZhbGxiYWNrIHRvIGV4dGVuc2lvbi90ZW1wbGF0ZXMvKi5tZCB2aWEgZmV0Y2gpLlxuICAgIGNvbnN0IGRlc2lnbkNvbnRlbnQgPSBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpO1xuICAgIGlmIChkZXNpZ25Db250ZW50LnRyaW0oKSkge1xuICAgICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnREVTSUdOLm1kJywgZGF0YTogZGVzaWduQ29udGVudH0pO1xuICAgIH1cbiAgICAvLyBQaW5jaEdyYWIgVUkgc2tpbGwg4oCUIHNhbWUgc3RvcnkuIExpdmVzIGF0IHRoZSBjYW5vbmljYWwgcmVjZWl2ZXJcbiAgICAvLyBwYXRoIGluc2lkZSB0aGUgYXJjaGl2ZSBzbyB0aGUgcmVjZWl2ZXIncyBgLmFnZW50cy9gIHRyZWUgY2FuIGJlXG4gICAgLy8gcG9wdWxhdGVkIGJ5IGEgc2ltcGxlIGB0YXIgLXhgIGZyb20gdGhlIGFyY2hpdmUgcm9vdC5cbiAgICAvL1xuICAgIC8vIEZyb250bWF0dGVyIHJlbmFtZTogYSB1c2VyJ3Mgc291cmNlIFNLSUxMLm1kIG1heSB1c2UgYG5hbWU6IHVpYFxuICAgIC8vIChiZWNhdXNlIHRoYXQncyBob3cgaXQncyBjYXRhbG9ndWVkIGluIHRoZWlyIGdsb2JhbCBgLmFnZW50cy9gXG4gICAgLy8gc2tpbGxzIHRyZWUpLiBJbnNpZGUgYSBQaW5jaEdyYWIgYXJjaGl2ZSB0aGUgc2tpbGwgaXMgKnRoZSpcbiAgICAvLyBQaW5jaEdyYWIgc2tpbGwsIHNvIHdlIHJlYnJhbmQgdGhlIGZyb250bWF0dGVyIGBuYW1lOmAgZmllbGQgb25cbiAgICAvLyB0aGUgd2F5IGludG8gdGhlIHRhciB3aXRob3V0IHRvdWNoaW5nIHRoZSBib2R5LiBPbmx5IHRoZSBGSVJTVFxuICAgIC8vIGBuYW1lOmAgbGluZSBpbnNpZGUgdGhlIGxlYWRpbmcgYC0tLWAgYmxvY2sgaXMgcmV3cml0dGVuLlxuICAgIGNvbnN0IHNraWxsQ29udGVudCA9IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBpZiAoc2tpbGxDb250ZW50LnRyaW0oKSkge1xuICAgICAgY29uc3QgcmVicmFuZGVkID0gcmVicmFuZFNraWxsTmFtZShza2lsbENvbnRlbnQsICdQaW5jaEdyYWInKTtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCcsIGRhdGE6IHJlYnJhbmRlZH0pO1xuICAgIH1cbiAgICAvLyBSZWJ1aWxkIHRoZSBtYW5pZmVzdCBsaW5lIGluIHRoZSBKU09OTCB3aXRoIGFyY2hpdmVJbnRlZ3JpdHlcbiAgICAvLyAoZmlsZSBsaXN0ICsgc2l6ZXMpLiBIYXMgdG8gaGFwcGVuIEFGVEVSIGFsbCB0YXJFbnRyaWVzIGFyZVxuICAgIC8vIGFzc2VtYmxlZCBidXQgQkVGT1JFIHdlIHRhciB0aGVtLCBzbyB3ZSBrbm93IHdoYXQncyBpbiB0aGVcbiAgICAvLyBidW5kbGUuIFRoZW4gd2UgcmVwbGFjZSB0aGUgSlNPTkwncyBtYW5pZmVzdCB3aXRoIHRoZSBhdWdtZW50ZWRcbiAgICAvLyB2ZXJzaW9uLlxuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbnRlZ3JpdHk6IHtmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT59ID0ge2ZpbGVzOiBbXX07XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykge1xuICAgICAgICBjb25zdCBkYXRhID0gdHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycgPyBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoZS5kYXRhKSA6IChlLmRhdGEgYXMgVWludDhBcnJheSk7XG4gICAgICAgIGludGVncml0eS5maWxlcy5wdXNoKHtwYXRoOiBlLm5hbWUsIHNpemU6IGRhdGEubGVuZ3RofSk7XG4gICAgICB9XG4gICAgICAvLyBSZS1lbWl0IHRoZSBKU09OTCB3aXRoIHRoZSBhdWdtZW50ZWQgbWFuaWZlc3QuIENoZWFwZXIgdG8gZG9cbiAgICAgIC8vIHRoaXMgcmUtcmVuZGVyIHRoYW4gdG8gbWFpbnRhaW4gbXV0YWJsZSBzdGF0ZSB0aHJvdWdoIHRoZSBzbGltXG4gICAgICAvLyBlbWl0LiBXZSBzd2FwIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgaW4tcGxhY2UuXG4gICAgICBjb25zdCBhdWdtZW50ZWRNYW5pZmVzdCA9IHsuLi5tYW5pZmVzdCwgYXJjaGl2ZUludGVncml0eTogaW50ZWdyaXR5fTtcbiAgICAgIGNvbnN0IGxpbmVzID0ganNvbmxUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgIGxpbmVzWzBdID0gSlNPTi5zdHJpbmdpZnkoYXVnbWVudGVkTWFuaWZlc3QpO1xuICAgICAgY29uc3QgbmV3SnNvbmwgPSBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICAgIGNvbnN0IGlkeCA9IHRhckVudHJpZXMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IGpzb25sTmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHRhckVudHJpZXNbaWR4XSA9IHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IG5ld0pzb25sfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdhcmNoaXZlSW50ZWdyaXR5IGNvbXB1dGF0aW9uIGZhaWxlZCcsIGVycik7XG4gICAgfVxuXG4gICAgY29uc3QgdGFyQnl0ZXMgPSBidWlsZFRhcih0YXJFbnRyaWVzKTtcbiAgICBjb25zdCBhcmNoaXZlQnl0ZXMgPSB3cmFwWnN0ZCh0YXJCeXRlcyk7XG5cbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSDihpInLCB7YXJjaGl2ZU5hbWUsIHRhckJ5dGVzOiB0YXJCeXRlcy5sZW5ndGgsIGFyY2hpdmVCeXRlczogYXJjaGl2ZUJ5dGVzLmxlbmd0aCwgc2NyZWVuc2hvdHM6IHNob3RFbnRyaWVzLmxlbmd0aH0pO1xuICAgICAgLy8gUGFzcyBhcyBhIHBsYWluIG51bWJlcltdIG92ZXIgc2VuZE1lc3NhZ2U7IHN0cnVjdHVyZWQtY2xvbmUgb2ZcbiAgICAgIC8vIFVpbnQ4QXJyYXkgdmlhIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGlzbid0IHJlbGlhYmxlIGFjcm9zc1xuICAgICAgLy8gQ2hyb21lIHZlcnNpb25zLlxuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtcbiAgICAgICAga2luZDogJ3NhdmUtYnl0ZXMnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZTogYXJjaGl2ZU5hbWUsXG4gICAgICAgIGJ5dGVzOiBBcnJheS5mcm9tKGFyY2hpdmVCeXRlcyksIG1pbWU6ICdhcHBsaWNhdGlvbi96c3RkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIC8vIEF1dG8tY29weSB0aGUgYWJzb2x1dGUgcGF0aCB0byBjbGlwYm9hcmQgc28gdGhlIHVzZXIgZG9lc24ndFxuICAgICAgICAvLyBoYXZlIHRvIGh1bnQgZm9yIGl0LiBUaGUgdG9vbGJhciBjb2xsYXBzZWQgdGhlIGRlZGljYXRlZFxuICAgICAgICAvLyBcImNvcHkgcGF0aFwiIGJ1dHRvbiBpbnRvIHRoaXMgc2luZ2xlIGFjdGlvbi5cbiAgICAgICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgY29uc3QgcGF0aENvcGllZCA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChwYXRoVG9Db3B5KTtcbiAgICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgICAgaWYgKHBhdGhDb3BpZWQpIHNob3dDb3BpZWQoJ0V4cG9ydGVkIGFuZCBjb3BpZWQnLCBsZWFmKTtcbiAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgIGBFeHBvcnRlZCDCtyAke3Nob3RFbnRyaWVzLmxlbmd0aH0gc2NyZWVuc2hvdCR7c2hvdEVudHJpZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IGJ1bmRsZWQke3BhdGhDb3BpZWQgPyAnIMK3IHBhdGggY29waWVkJyA6ICcnfSR7bGFzdEV4cG9ydC50ZW1wUGF0aCA/ICcgwrcgUGxheXdyaWdodCB0ZW1wIGhpZGRlbicgOiAnJ30gwrcgJHtsZWFmfWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnb25FeHBvcnRBcmNoaXZlIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBBcmNoaXZlIGV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBUZXN0L2RldiBmYWxsYmFjazogc3ludGhlc2l6ZSBhIGRvd25sb2FkIGxpbmsuXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFthcmNoaXZlQnl0ZXMgYXMgdW5rbm93biBhcyBCbG9iUGFydF0sIHt0eXBlOiAnYXBwbGljYXRpb24venN0ZCd9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gYXJjaGl2ZU5hbWU7IGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQoYXJjaGl2ZU5hbWUpO1xuICAgIHNob3dDb3BpZWQoJ0V4cG9ydGVkIGFuZCBjb3BpZWQnLCBhcmNoaXZlTmFtZSk7XG4gICAgc2V0U3RhdHVzKGBXb3Jrc3BhY2UgZXhwb3J0ZWQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkIMK3IHBhdGggY29waWVkYCk7XG4gIH07XG5cbiAgLy8gQmVzdC1lZmZvcnQgY2xpcGJvYXJkIHdyaXRlIOKAlCBuZXZlciB0aHJvd3M7IHJldHVybnMgd2hldGhlciB0aGVcbiAgLy8gd3JpdGUgc3VjY2VlZGVkIHNvIHRoZSBjYWxsZXIgY2FuIGFkanVzdCB0aGUgc3RhdHVzIG1lc3NhZ2UuXG4gIC8vIENsaXBib2FyZCB3cml0ZXMgY2FuIGZhaWwgd2hlbiB0aGUgcGFuZWwgZG9lc24ndCBoYXZlIGZvY3VzIG9yIGluXG4gIC8vIHNvbWUgdGVzdCBoYXJuZXNzZXMsIGFuZCB3ZSBkb24ndCB3YW50IHRoYXQgdG8gYmxvY2sgdGhlIGV4cG9ydC5cbiAgY29uc3QgY29weVRvQ2xpcGJvYXJkU2lsZW50ID0gYXN5bmMgKHRleHQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpOyByZXR1cm4gdHJ1ZTsgfVxuICAgIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEdWNrREIgc25pcHBldCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ2Fub25pY2FsIFNRTCByZWNpcGVzIGZvciBxdWVyeWluZyBhIEpTT05MIGV4cG9ydC4gQ29waWVzIHRvIGNsaXBib2FyZFxuICAvLyBhbmQgcHJpbnRzIGEgc3RhdHVzIG1lc3NhZ2Ug4oCUIHdlIGRvbid0IHJ1biBEdWNrREIgb3Vyc2VsdmVzLCB0aGUgdXNlclxuICAvLyBwaXBlcyB0aGUgc25pcHBldCBpbnRvIGBkdWNrZGJgIG9uIHRoZWlyIG1hY2hpbmUuIFRoZSByZWNpcGVzIHRhcmdldFxuICAvLyBxdWVzdGlvbnMgYSBVSS1lbmdpbmVlciBMTE0gd29ya2Zsb3cgdGVuZHMgdG8gYXNrOiBsaXN0IGNhcHR1cmVzIGJ5XG4gIC8vIGhvc3QsIGZpbmQgZHVwbGljYXRlIG91dGVySFRNTCwgZmluZCBjYXB0dXJlcyBtaXNzaW5nIGEgc2NyZWVuc2hvdCxcbiAgLy8gYW5kIHVuaXF1ZS10b2tlbiBmcmVxdWVuY3kgZm9yIGEgcXVpY2sgZGVzaWduLXRva2VucyBvdmVydmlldy5cbiAgY29uc3QgZHVja0RiU25pcHBldCA9IChqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiBgLS0gUGluY2hHcmFiIOKGkiBEdWNrREIgcmVjaXBlc1xuLS0gU2F2ZSB5b3VyIEpTT05MIGV4cG9ydCwgdGhlbiBpbiB5b3VyIHNoZWxsOlxuLS0gICBkdWNrZGIgPCB0aGlzX2ZpbGUuc3FsXG4tLSBPciBvcGVuIGEgZHVja2RiIHNoZWxsIGFuZCBwYXN0ZSB0aGVzZSBvbmUgYXQgYSB0aW1lLlxuXG4tLSAxKSBMb2FkIHRoZSBKU09OTCBpbnRvIGEgdGFibGUuXG4tLSAgICBzYW1wbGVfc2l6ZT0tMSBmb3JjZXMgYSBmdWxsLWZpbGUgc2NhbiBmb3Igc2NoZW1hIGluZmVyZW5jZS4gV2l0aG91dFxuLS0gICAgaXQsIER1Y2tEQiBvbmx5IHNuaWZmcyB0aGUgZmlyc3QgMjAgNDgwIHJvd3Mg4oCUIGFuZCBQaW5jaEdyYWIgZXhwb3J0c1xuLS0gICAgbWl4IHNlbGVjdG9yICsgZmVlZGJhY2sgcm93IHR5cGVzLCBzbyByYXJlIGZlZWRiYWNrLW9ubHkgZmllbGRzXG4tLSAgICAodGFncywgcGFyZW50VWlkKSBjYW4gYmUgZHJvcHBlZCBmcm9tIHRoZSBpbmZlcnJlZCBzY2hlbWEgaWYgdGhleVxuLS0gICAgZG9uJ3QgYXBwZWFyIGVhcmx5IGVub3VnaC4gVGhhdCBiaXRlcyByZWNpcGUgNiBiZWxvdy5cbkNSRUFURSBPUiBSRVBMQUNFIFRBQkxFIHBnIEFTXG5TRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKFxuICAnJHtqc29ubE5hbWV9JyxcbiAgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsXG4gIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwLFxuICBzYW1wbGVfc2l6ZT0tMVxuKTtcblxuLS0gMikgUXVpY2sgb3ZlcnZpZXc6IGhvdyBtYW55IGNhcHR1cmVzIHBlciBob3N0LlxuU0VMRUNUXG4gIHJlZ2V4cF9leHRyYWN0KHVybCwgJzovLyhbXi9dKyknLCAxKSBBUyBob3N0LFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InKSBBUyBjYXB0dXJlcyxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ2ZlZWRiYWNrJykgQVMgY29tbWVudHNcbkZST00gcGdcbkdST1VQIEJZIDFcbk9SREVSIEJZIGNhcHR1cmVzIERFU0M7XG5cbi0tIDMpIEZpbmQgZHVwbGljYXRlIG91dGVySFRNTCBhY3Jvc3MgY2FwdHVyZXMgKG9mdGVuIHNpZ25hbHMgYSByZXVzZWRcbi0tICAgIGNvbXBvbmVudCB0aGUgdXNlciBoYXMgY2xpY2tlZCBpbnRvIG11bHRpcGxlIHRpbWVzKS5cblNFTEVDVCBvdXRlckhUTUwsIENPVU5UKCopIEFTIGhpdHMsIGxpc3Qoc2VsZWN0b3IpIEFTIHNlbGVjdG9yc1xuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIG91dGVySFRNTCBJUyBOT1QgTlVMTFxuR1JPVVAgQlkgb3V0ZXJIVE1MXG5IQVZJTkcgaGl0cyA+IDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMjU7XG5cbi0tIDQpIENhcHR1cmVzIHN0aWxsIG1pc3NpbmcgYSBzY3JlZW5zaG90IHBhdGguXG5TRUxFQ1QgbiwgdXJsLCBzZWxlY3RvclxuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIHNjcmVlbnNob3QgSVMgTlVMTFxuT1JERVIgQlkgbjtcblxuLS0gNSkgUXVpY2sgZGVzaWduLXRva2VuIHN1cmZhY2U6IHJhbmsgY2xhc3NlcyB0aGF0IGFwcGVhciBpbiBtYW55IGNhcHR1cmVzLlxuLS0gICAgTk9URTogZmlsdGVyIGNsYXNzZXMgSVMgTk9UIE5VTEwgcmF0aGVyIHRoYW4gdXNpbmcgYSBjb2FsZXNjZS13aXRoLWVtcHR5XG4tLSAgICBmYWxsYmFjazsgRHVja0RCIGNhbm5vdCBpbmZlciBlbGVtZW50IHR5cGVzIGZvciBhbiBlbXB0eSBsaXN0IGxpdGVyYWwuXG5XSVRIIGV4cGFuZGVkIEFTIChcbiAgU0VMRUNUIHVubmVzdChjbGFzc2VzKSBBUyBjXG4gIEZST00gcGdcbiAgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIGNsYXNzZXMgSVMgTk9UIE5VTExcbilcblNFTEVDVCBjLCBDT1VOVCgqKSBBUyBoaXRzXG5GUk9NIGV4cGFuZGVkXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDMwO1xuXG4tLSA2KSBDb21tZW50cyBqb2luZWQgdG8gdGhlaXIgcGFyZW50IHNlbGVjdG9yIHZpYSBwYXJlbnRVaWQuIFRoZVxuLS0gICAgcy50eXBlIGZpbHRlciBwcmV2ZW50cyBhbiBhY2NpZGVudGFsIGZlZWRiYWNr4oaUZmVlZGJhY2sgam9pbiBpbiBjYXNlXG4tLSAgICB0d28gcm93cyBldmVyIHNoYXJlIGEgdWlkIGJ5IGNvaW5jaWRlbmNlLlxuU0VMRUNUIHMubiwgcy5zZWxlY3RvciwgZi50ZXh0LCBmLnRhZ3NcbkZST00gcGcgZlxuSk9JTiBwZyBzXG4gIE9OIHMudWlkID0gZi5wYXJlbnRVaWRcbiBBTkQgcy50eXBlID0gJ3NlbGVjdG9yJ1xuV0hFUkUgZi50eXBlID0gJ2ZlZWRiYWNrJ1xuT1JERVIgQlkgcy5uO1xuYDtcbiAgY29uc3Qgb25EdWNrRGJTbmlwcGV0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIFByZWZlciB0aGUgSlNPTkwgZmlsZW5hbWUgb2YgdGhlIG1vc3QgcmVjZW50IGV4cG9ydCBzbyB0aGUgdXNlciBjYW5cbiAgICAvLyBwYXN0ZSB0aGlzIGRpcmVjdGx5IHdpdGhvdXQgZWRpdGluZyB0aGUgcmVhZF9qc29uX2F1dG8gcGF0aC4gRmFsbFxuICAgIC8vIGJhY2sgdG8gYSBmcmVzaCBlcG9jaC1iYXNlZCBuYW1lIGlmIG5vdGhpbmcgaGFzIGJlZW4gZXhwb3J0ZWQgeWV0LlxuICAgIGNvbnN0IGxhc3QgPSBsYXN0RXhwb3J0LnJlbFBhdGg7XG4gICAgY29uc3QganNvbmxOYW1lID0gKGxhc3QgJiYgL1xcLmpzb25sJC8udGVzdChsYXN0KSlcbiAgICAgID8gbGFzdC5zcGxpdCgnLycpLnBvcCgpISAgLy8gc3RyaXAgd29ya3NwYWNlL2V4cG9ydHMvIHByZWZpeFxuICAgICAgOiBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3FsKTtcbiAgICAgIHNldFN0YXR1cyhgRHVja0RCIHJlY2lwZXMgY29waWVkIMK3IHBhc3RlIGludG8gXFxgZHVja2RiXFxgIHNoZWxsIMK3IHJlZmVyZW5jZXMgJHtqc29ubE5hbWV9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgRHVja0RCIFNRTCcsIGpzb25sTmFtZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCBmYWlsZWQg4oCUIG9wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCAnT3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnKTtcbiAgICB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTY2hlbWEgbWlncmF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDb252ZXJ0IGEgdjEtc2hhcGVkIEVudHJ5LW9yLWV4cG9ydC1saW5lIGludG8gb3VyIGludGVybmFsIEVudHJ5LiBJZGVtcG90ZW50LlxuICAvLyBTdXBwb3J0czpcbiAgLy8gICDigKIgZmxhdCB2MSBlbnRyeSAobm8gYF9hdWRpdGAsIG5vIGB2YCBmaWVsZClcbiAgLy8gICDigKIgdjIgZXhwb3J0IGVudHJ5IChoYXMgYF9hdWRpdGAsIGB2OiAyYCwgYHR5cGU6ICdzZWxlY3RvcidgKVxuICAvLyAgIOKAoiBtaXhlZCAoc29tZSBmaWVsZHMgbmVzdGVkLCBzb21lIGZsYXQg4oCUIGxhc3Qgd2lucyBmb3Igc2FmZXR5KVxuICAvLyBQdXJlOiBuZXZlciBtdXRhdGVzIGByYXdgIG9yIGFueSBvZiBpdHMgbmVzdGVkIG9iamVjdHMuIFJldHVybnMgYSBuZXdcbiAgLy8gZW50cnkgd2l0aCBhbGwgbWlncmF0aW9ucyBhcHBsaWVkLiBUb3VjaGVkIHN1Ym9iamVjdHMgKGF0dHJzLCBoaW50cyxcbiAgLy8gZ3JvdXAgbWVtYmVycykgYXJlIGNsb25lZCBiZWZvcmUgZWRpdDsgdW50b3VjaGVkIG9uZXMgc2hhcmUgcmVmcyB3aXRoXG4gIC8vIHJhdywgd2hpY2ggaXMgZmluZSBzaW5jZSB3ZSBuZXZlciB3cml0ZSB0byB0aGVtLlxuICBjb25zdCBkZW5vcm1hbGl6ZUVudHJ5ID0gKHJhdzogYW55KTogRW50cnkgPT4ge1xuICAgIGNvbnN0IG91dDogYW55ID0gey4uLnJhd307XG4gICAgZGVsZXRlIG91dC52O1xuICAgIGRlbGV0ZSBvdXQudHlwZTtcbiAgICBkZWxldGUgb3V0LmZlZWRiYWNrO1xuICAgIGlmIChvdXQuX2F1ZGl0ICYmIHR5cGVvZiBvdXQuX2F1ZGl0ID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgYSA9IG91dC5fYXVkaXQ7XG4gICAgICBpZiAoYS5hbmNlc3RvcnMgIT09IHVuZGVmaW5lZCkgb3V0LmFuY2VzdG9ycyA9IGEuYW5jZXN0b3JzO1xuICAgICAgaWYgKGEuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBvdXQuY29tcG9uZW50Um9vdCA9IGEuY29tcG9uZW50Um9vdDtcbiAgICAgIGlmIChhLmluU2hhZG93RE9NICE9PSB1bmRlZmluZWQpIG91dC5pblNoYWRvd0RPTSA9IGEuaW5TaGFkb3dET007XG4gICAgICBpZiAoYS5wc2V1ZG9FbGVtZW50cyAhPT0gdW5kZWZpbmVkKSBvdXQucHNldWRvRWxlbWVudHMgPSBhLnBzZXVkb0VsZW1lbnRzO1xuICAgICAgaWYgKGEubWF0Y2hlZFJ1bGVzICE9PSB1bmRlZmluZWQpIG91dC5tYXRjaGVkUnVsZXMgPSBhLm1hdGNoZWRSdWxlcztcbiAgICAgIGlmIChhLnZpZXdwb3J0ICE9PSB1bmRlZmluZWQpIG91dC52aWV3cG9ydCA9IGEudmlld3BvcnQ7XG4gICAgICBkZWxldGUgb3V0Ll9hdWRpdDtcbiAgICB9XG4gICAgLy8gc3RhdGVzOiB2MSB1c2VkIFJlY29yZDxzdHJpbmcsIHRydWU+OyB2MiB1c2VzIHN0cmluZ1tdLiBOb3JtYWxpemUgYm90aC5cbiAgICBpZiAob3V0LnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShvdXQuc3RhdGVzKSAmJiB0eXBlb2Ygb3V0LnN0YXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG91dC5zdGF0ZXMgPSBPYmplY3Qua2V5cyhvdXQuc3RhdGVzKS5maWx0ZXIoKGspID0+IEJvb2xlYW4oKG91dC5zdGF0ZXMgYXMgYW55KVtrXSkpO1xuICAgIH1cbiAgICAvLyBhdHRycy5mb3JtYXQg4oaSIGhpbnRzLmZvcm1hdC4gQ2xvbmUgYXR0cnMgZmlyc3Qgc28gd2UgZG9uJ3QgbXV0YXRlIHRoZVxuICAgIC8vIGNhbGxlcidzIG5lc3RlZCBvYmplY3QuIFNhbWUgZm9yIGhpbnRzICh3ZSBtYXkgbWVyZ2UgaW50byBpdCkuXG4gICAgaWYgKG91dC5hdHRycyAmJiB0eXBlb2Ygb3V0LmF0dHJzID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3V0LmF0dHJzLmZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGZtdCA9IG91dC5hdHRycy5mb3JtYXQ7XG4gICAgICBjb25zdCB7Zm9ybWF0OiBfZHJvcCwgLi4ucmVzdEF0dHJzfSA9IG91dC5hdHRycztcbiAgICAgIG91dC5hdHRycyA9IHJlc3RBdHRycztcbiAgICAgIG91dC5oaW50cyA9IHsuLi4ob3V0LmhpbnRzID8/IHt9KSwgZm9ybWF0OiBmbXR9O1xuICAgIH1cbiAgICBpZiAoIW91dC51aWQpIG91dC51aWQgPSBtc2dJZCgpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG91dC5ncm91cCkpIG91dC5ncm91cCA9IG91dC5ncm91cC5tYXAoZGVub3JtYWxpemVFbnRyeSk7XG4gICAgcmV0dXJuIG91dCBhcyBFbnRyeTtcbiAgfTtcbiAgLy8gV2FsayBhbGwgbG9hZGVkIG1lc3NhZ2VzIGFuZCBtaWdyYXRlIGFueSBsZWdhY3kgZW50cmllcy4gUmV0dXJucyB0cnVlIGlmXG4gIC8vIGFueXRoaW5nIG11dGF0ZWQgc28gdGhlIGNhbGxlciBjYW4gcGVyc2lzdC5cbiAgY29uc3QgbWlncmF0ZUxvYWRlZE1lc3NhZ2VzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGxldCBtdXRhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IG0uZW50cnk7XG4gICAgICAvLyBDaGVhcCBwcmUtY2hlY2s6IGlmIHVpZCBleGlzdHMgQU5EIHN0YXRlcyBpcyBhbiBhcnJheSBBTkQgbm8gX2F1ZGl0XG4gICAgICAvLyBBTkQgbm8gYXR0cnMuZm9ybWF0IOKGkiBub3RoaW5nIHRvIGRvLCBza2lwIHRoZSB3b3JrLlxuICAgICAgY29uc3QgbmVlZHNXb3JrID1cbiAgICAgICAgIWJlZm9yZS51aWQgfHxcbiAgICAgICAgKGJlZm9yZS5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkoYmVmb3JlLnN0YXRlcykpIHx8XG4gICAgICAgIChiZWZvcmUgYXMgYW55KS5fYXVkaXQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAoYmVmb3JlLmF0dHJzICYmIHR5cGVvZiAoYmVmb3JlLmF0dHJzIGFzIGFueSkuZm9ybWF0ID09PSAnc3RyaW5nJyk7XG4gICAgICBpZiAoIW5lZWRzV29yaykgY29udGludWU7XG4gICAgICBtLmVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShiZWZvcmUpO1xuICAgICAgbXV0YXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtdXRhdGVkO1xuICB9O1xuICBjb25zdCBvbkltcG9ydCA9ICgpOiB2b2lkID0+IGltcG9ydEZpbGUuY2xpY2soKTtcbiAgaW1wb3J0RmlsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM/LlswXTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICBjb25zdCBpbXBvcnRlZDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgdGV4dC5zcGxpdCgvXFxyP1xcbi8pKSB7XG4gICAgICBpZiAoIWxpbmUudHJpbSgpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKGxpbmUpO1xuICAgICAgICBpZiAoby50eXBlID09PSAnbWFuaWZlc3QnKSB7XG4gICAgICAgICAgLy8gTWFuaWZlc3QgbGluZSDigJQgaW5mb3JtYXRpb25hbCBvbmx5IG9uIGltcG9ydC4gU2tpcC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoby50eXBlID09PSAncGFnZScpIGltcG9ydGVkLnB1c2goe3R5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdXJsOiBvLnVybCwgdGl0bGU6IG8udGl0bGUsIHZpZXdwb3J0OiBvLnZpZXdwb3J0LCB0b2tlbnM6IG8udG9rZW5zLCB1c2VyQWdlbnQ6IG8udXNlckFnZW50LCBsYW5nOiBvLmxhbmd9KTtcbiAgICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0OiBvLnRleHQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoby5wYXJlbnRVaWQpIGZiLnBhcmVudFVpZCA9IG8ucGFyZW50VWlkO1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG8udGFncykgJiYgby50YWdzLmxlbmd0aCkgZmIudGFncyA9IG8udGFncztcbiAgICAgICAgICBpZiAoby5zZXZlcml0eSkgZmIuc2V2ZXJpdHkgPSBvLnNldmVyaXR5O1xuICAgICAgICAgIGltcG9ydGVkLnB1c2goZmIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHNlbGVjdG9yIGxpbmUg4oCUIGNvdWxkIGJlIHYxIChmbGF0KSBvciB2MiAod2l0aCBfYXVkaXQpLiBUaGVcbiAgICAgICAgICAvLyBidW5kbGVkIGZlZWRiYWNrIGFycmF5IG11c3QgYmUgc3BsaXQgb3V0IGludG8gc2VwYXJhdGUgZmVlZGJhY2tcbiAgICAgICAgICAvLyBtZXNzYWdlcyBmb3Igcm91bmQtdHJpcCB3aXRoIHYxIHJlYWRlcnMg4oCUIGJ1dCBpbiB2MiB3ZSBhbHJlYWR5XG4gICAgICAgICAgLy8gZW1pdCBzdGFuZGFsb25lIGZlZWRiYWNrIGxpbmVzLCBzbyBkcm9wcGluZyB0aGUgYnVuZGxlZCBsaXN0IGlzXG4gICAgICAgICAgLy8gc2FmZSB0byBhdm9pZCBkb3VibGUtY291bnRpbmcuXG4gICAgICAgICAgY29uc3QgZmIgPSBBcnJheS5pc0FycmF5KG8uZmVlZGJhY2spID8gby5mZWVkYmFjayA6IG51bGw7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSBkZW5vcm1hbGl6ZUVudHJ5KG8pO1xuICAgICAgICAgIGltcG9ydGVkLnB1c2goe3R5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIGVudHJ5fSk7XG4gICAgICAgICAgLy8gT25seSBpbmZsYXRlIGJ1bmRsZWQgZmVlZGJhY2sgaWYgdGhlIGZpbGUgaXMgdjEgKG5vIHZlcnNpb25cbiAgICAgICAgICAvLyBtYXJrZXIgb24gdGhlIHNlbGVjdG9yIGxpbmVzKS4gdjIgaGFzIGl0cyBvd24gc3RhbmRhbG9uZVxuICAgICAgICAgIC8vIGZlZWRiYWNrIGxpbmVzIHRoYXQgYXJyaXZlIHNlcGFyYXRlbHkuXG4gICAgICAgICAgaWYgKGZiICYmIG8udiAhPT0gMikge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0IG9mIGZiKSBpbXBvcnRlZC5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksXG4gICAgICAgICAgICAgIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgdGV4dDogdHlwZW9mIHQgPT09ICdzdHJpbmcnID8gdCA6IHQ/LnRleHQgPz8gJycsXG4gICAgICAgICAgICAgIHBhcmVudFVpZDogZW50cnkudWlkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHsgLyogc2tpcCBiYWQgbGluZSAqLyB9XG4gICAgfVxuICAgIG1lc3NhZ2VzID0gWy4uLm1lc3NhZ2VzLCAuLi5pbXBvcnRlZF07XG4gICAgcGVyc2lzdCgpO1xuICAgIGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoYEltcG9ydGVkICR7aW1wb3J0ZWQubGVuZ3RofSBtZXNzYWdlJHtpbXBvcnRlZC5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gKTtcbiAgICBpbXBvcnRGaWxlLnZhbHVlID0gJyc7XG4gIH0pO1xuICBjb25zdCBvbkNsZWFyID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghY29uZmlybSgnQ2xlYXIgYWxsIGNhcHR1cmVzIGFuZCBjb21tZW50cz8nKSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBbXTtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0NsZWFyZWQnKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgVmFsaWRhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgcnVuVmFsaWRhdGlvbiA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBbLi4ubmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3RvcikpXTtcbiAgICBpZiAoIXNlbGVjdG9ycy5sZW5ndGggfHwgIWluRXh0ZW5zaW9uKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICBpZiAoIXRhYnNbMF0pIHJldHVybjtcbiAgICAgIGxpdmVUYWJVcmwgPSB0YWJzWzBdLnVybCA/PyBsaXZlVGFiVXJsO1xuICAgICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YobGl2ZVRhYlVybCA/PyAnJyk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQhLCBwZyh7a2luZDogJ3ZhbGlkYXRlJywgc2VsZWN0b3JzfSkpIGFzIHt2YWxpZD86IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+fTtcbiAgICAgIGlmIChyZXBseT8udmFsaWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBbc2VsLCBva10gb2YgT2JqZWN0LmVudHJpZXMocmVwbHkudmFsaWQpKSB7XG4gICAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgICAgaWYgKCFvaykgc2VsZWN0b3JFcnJvcnMuc2V0KHNlbCwgJ05vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzIHRoaXMgc2VsZWN0b3IuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIHRhYiBub3QgcmVhZHkgKi8gfVxuICB9O1xuICBjb25zdCBvblZhbGlkYXRlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHNldFN0YXR1cygnUmUtY2hlY2tpbmfigKYnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHNldFN0YXR1cygnVmFsaWRhdGVkJyk7XG4gIH07XG5cbiAgLy8gKFNjcmVlbnNob3QgbWFjaGluZXJ5IHJlbW92ZWQgYWxvbmdzaWRlIHRoZSAucHJldmlldyB0aWxlLilcblxuICAvLyDilIDilIDilIAgR2l0SHViIHN0YXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBmZXRjaFN0YXJzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGNhY2hlS2V5ID0gJ3BpbmNoZ3JhYi5naC5zdGFycyc7XG4gICAgY29uc3QgY2FjaGVkID0gYXdhaXQgU3RvcmUuZ2V0PHtjb3VudDogbnVtYmVyOyB0czogbnVtYmVyfSB8IG51bGw+KGNhY2hlS2V5LCBudWxsKTtcbiAgICBpZiAoY2FjaGVkICYmIERhdGUubm93KCkgLSBjYWNoZWQudHMgPCAzXzYwMF8wMDApIHtcbiAgICAgIHN0YXJzRWwudGV4dENvbnRlbnQgPSBTdHJpbmcoY2FjaGVkLmNvdW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy93cmFubmdsZS9waW5jaGdyYWInLCB7Y2FjaGU6ICduby1zdG9yZSd9KTtcbiAgICAgIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKCdzdGF0dXMgJyArIHIuc3RhdHVzKTtcbiAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKSBhcyB7c3RhcmdhemVyc19jb3VudD86IG51bWJlcn07XG4gICAgICBjb25zdCBjb3VudCA9IGouc3RhcmdhemVyc19jb3VudCA/PyAwO1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudCk7XG4gICAgICB2b2lkIFN0b3JlLnNldChjYWNoZUtleSwge2NvdW50LCB0czogRGF0ZS5ub3coKX0pO1xuICAgIH0gY2F0Y2ggeyBzdGFyc0VsLnRleHRDb250ZW50ID0gJ8K3JzsgfVxuICB9O1xuICBjb25zdCBvbkdpdGh1YiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3dyYW5uZ2xlL3BpbmNoZ3JhYic7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUudGFicy5jcmVhdGUoe3VybH0pO1xuICAgIGVsc2Ugd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJ25vb3BlbmVyJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNldHRpbmdzIGRyYXdlciAvIHdvcmtzcGFjZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFwcGx5UHJlZnNUb1VJID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W2RhdGEtcHJlZl0nKSkge1xuICAgICAgZWwuY2hlY2tlZCA9IEJvb2xlYW4ocHJlZnNbZWwuZGF0YXNldC5wcmVmIGFzIGtleW9mIFByZWZzXSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTFRleHRBcmVhRWxlbWVudD4oJ3RleHRhcmVhW2RhdGEtcHJlZi10ZXh0XScpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyhwcmVmc1tlbC5kYXRhc2V0LnByZWZUZXh0IGFzIGtleW9mIFByZWZzXSA/PyAnJyk7XG4gICAgfVxuICAgIC8vIFBsYWluLXRleHQgaW5wdXRzIChkZXNpZ25QYXRoLCBza2lsbFBhdGgpIGFsc28gdXNlIGRhdGEtcHJlZi10ZXh0LlxuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW2RhdGEtcHJlZi10ZXh0XScpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyhwcmVmc1tlbC5kYXRhc2V0LnByZWZUZXh0IGFzIGtleW9mIFByZWZzXSA/PyAnJyk7XG4gICAgfVxuICAgIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCk7XG4gIH07XG4gIC8vIFJlbmRlciB0aGUgZGVzaWduLW1kIC8gc2tpbGwtbWQgc3RhdHVzIGxhYmVscyBhbmQgdGhlIHRlbXBsYXRlLWJhbm5lclxuICAvLyBzbyB0aGUgdXNlciBzZWVzIGF0IGEgZ2xhbmNlIHdoZXRoZXIgdGhleSdyZSBzaGlwcGluZyBhIGN1c3RvbWl6ZWRcbiAgLy8gZmlsZSB2cy4gZmFsbGluZyBiYWNrIHRvIHRoZSBidW5kbGVkIHRlbXBsYXRlLiBBc3luYyBiZWNhdXNlIHdlXG4gIC8vIG5lZWQgdG8gcmVhZCB0aGUgYnVuZGxlZCBmaWxlJ3Mgc2l6ZSB0byBkaXNwbGF5IFwidGVtcGxhdGUgwrcgTiBsaW5lc1wiXG4gIC8vIGV2ZW4gd2hlbiBwcmVmcyBpcyBlbXB0eS5cbiAgY29uc3QgdXBkYXRlTWRTdGF0dXNlcyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBkZXNpZ25FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kZXNpZ24tbWQtc3RhdHVzXScpO1xuICAgIGNvbnN0IHNraWxsRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc2tpbGwtbWQtc3RhdHVzXScpO1xuICAgIGNvbnN0IGRlc2lnbkJhbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS10ZW1wbGF0ZS1iYW5uZXI9XCJkZXNpZ25cIl0nKTtcbiAgICBjb25zdCBza2lsbEJhbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS10ZW1wbGF0ZS1iYW5uZXI9XCJza2lsbFwiXScpO1xuICAgIGNvbnN0IHRhZyA9IChtZDogc3RyaW5nLCBpc1RwbDogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICBjb25zdCBsaW5lcyA9IG1kLnNwbGl0KCdcXG4nKS5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFttZF0pLnNpemU7XG4gICAgICByZXR1cm4gYCR7aXNUcGwgPyAndGVtcGxhdGUnIDogJ2N1c3RvbSd9IMK3ICR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgIH07XG4gICAgaWYgKGRlc2lnbkVsKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICAgIGRlc2lnbkVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIDogJyhlbXB0eSknO1xuICAgICAgZGVzaWduRWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLWNvbnRlbnQnLCAhaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpO1xuICAgIH1cbiAgICBpZiAoc2tpbGxFbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICAgIHNraWxsRWwudGV4dENvbnRlbnQgPSBjb250ZW50LnRyaW0oKSA/IHRhZyhjb250ZW50LCBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKSA6ICcoZW1wdHkpJztcbiAgICAgIHNraWxsRWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLWNvbnRlbnQnLCAhaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSk7XG4gICAgfVxuICAgIGlmIChkZXNpZ25CYW5uZXIpIGRlc2lnbkJhbm5lci5oaWRkZW4gPSAhaXNVc2luZ1RlbXBsYXRlRGVzaWduKCk7XG4gICAgaWYgKHNraWxsQmFubmVyKSBza2lsbEJhbm5lci5oaWRkZW4gPSAhaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICAvLyBBbHNvIHJlZnJlc2ggdGhlIGNvbXBhY3QgcHJldmlldyB0ZXh0IG9uIHRoZSBlZGl0b3Itcm93IGJ1dHRvbi5cbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ2Rlc2lnbicpO1xuICAgIGF3YWl0IHJlbmRlck1kUHJldmlldygnc2tpbGwnKTtcbiAgfTtcbiAgLy8gQmFjay1jb21wYXQgYWxpYXMg4oCUIGVhcmxpZXIgY29kZSBwYXRocyBjYWxsZWQgdXBkYXRlRGVzaWduTWRTdGF0dXMoKS5cbiAgY29uc3QgdXBkYXRlRGVzaWduTWRTdGF0dXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgdXBkYXRlTWRTdGF0dXNlcygpOyB9O1xuXG4gIC8vIOKUgOKUgOKUgCBDb21wYWN0IHByZXZpZXcgKyBtb2RhbCBlZGl0b3IgZm9yIERFU0lHTi5tZCAvIFNLSUxMLm1kIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBSZXBsYWNlcyB0aGUgZ2lhbnQgaW5saW5lIHRleHRhcmVhcyB3aXRoIGEgc21hbGwgcHJldmlldyByb3cgc2hvd2luZ1xuICAvLyB0aGUgZmlyc3QgfjYgbGluZXMgcGx1cyBhIFwiRWRpdCAvIFVwbG9hZCAvIOKAplwiIGJ1dHRvbi4gQ2xpY2tpbmcgb3BlbnNcbiAgLy8gYSBwb3BvdXQgbW9kYWwgd2l0aCB0aGUgZnVsbCBlZGl0b3Ig4oCUIGtlZXBzIHRoZSBzZXR0aW5ncyBkcmF3ZXJcbiAgLy8gc2Nhbm5hYmxlIHdoZW4gc2hpcHBpbmcgYSA1MDAwLWxpbmUgREVTSUdOLm1kLlxuICBjb25zdCByZW5kZXJNZFByZXZpZXcgPSBhc3luYyAoa2luZDogJ2Rlc2lnbicgfCAnc2tpbGwnKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcHJldmlld0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLW1kLXByZXZpZXc9XCIke2tpbmR9XCJdYCk7XG4gICAgaWYgKCFwcmV2aWV3RWwpIHJldHVybjtcbiAgICBjb25zdCBjb250ZW50ID0ga2luZCA9PT0gJ2Rlc2lnbicgPyBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpIDogYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3QgaGVhZCA9IGxpbmVzLnNsaWNlKDAsIDYpLm1hcCgobCkgPT4gbC5sZW5ndGggPiA4MCA/IGwuc2xpY2UoMCwgODApICsgJ+KApicgOiBsKS5qb2luKCdcXG4nKTtcbiAgICBwcmV2aWV3RWwudGV4dENvbnRlbnQgPSBoZWFkICsgKGxpbmVzLmxlbmd0aCA+IDYgPyBgXFxuXFxu4oCmICgrJHtsaW5lcy5sZW5ndGggLSA2fSBtb3JlIGxpbmVzKWAgOiAnJyk7XG4gIH07XG5cbiAgdHlwZSBNZEtpbmQgPSAnZGVzaWduJyB8ICdza2lsbCc7XG4gIGNvbnN0IG9wZW5NZE1vZGFsID0gYXN5bmMgKGtpbmQ6IE1kS2luZCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgaWYgKCFvdmVybGF5KSByZXR1cm47XG4gICAgY29uc3QgdGl0bGVFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRpdGxlXScpITtcbiAgICBjb25zdCB0YUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC10ZXh0YXJlYV0nKSE7XG4gICAgY29uc3Qgc3RhdHNFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXN0YXRzXScpITtcbiAgICBjb25zdCBiYW5uZXJFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWJhbm5lcl0nKSE7XG4gICAgY29uc3Qgc2F2ZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXNhdmVdJykhO1xuICAgIGNvbnN0IHJlc2V0QnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtcmVzZXRdJykhO1xuICAgIGNvbnN0IHVwbG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXVwbG9hZF0nKSE7XG4gICAgY29uc3QgZG93bmxvYWRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1kb3dubG9hZF0nKSE7XG4gICAgY29uc3QgY2xvc2VCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1jbG9zZV0nKSE7XG5cbiAgICBjb25zdCBpc0Rlc2lnbiA9IGtpbmQgPT09ICdkZXNpZ24nO1xuICAgIGNvbnN0IGluaXRpYWwgPSBpc0Rlc2lnbiA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGlzRGVzaWduID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSBpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1BpbmNoR3JhYiBTS0lMTC5tZCc7XG4gICAgdGFFbC52YWx1ZSA9IGluaXRpYWw7XG4gICAgb3ZlcmxheS5kYXRhc2V0LmtpbmQgPSBraW5kO1xuXG4gICAgY29uc3QgcmVmcmVzaFN0YXRzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhRWwudmFsdWU7XG4gICAgICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IEJsb2IoW3RleHRdKS5zaXplO1xuICAgICAgc3RhdHNFbC50ZXh0Q29udGVudCA9IGAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmIV0gPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHQuZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSAodCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIH1cbiAgfSk7XG4gIC8vIFRleHRhcmVhIGlucHV0cyBhbHNvIGZpcmUgYGlucHV0YCBldmVudHMgYXMgdGhlIHVzZXIgdHlwZXMg4oCUIHdlIHdhbnQgdG9cbiAgLy8gc2F2ZSB0aG9zZSBpbmNyZW1lbnRhbGx5IHNvIGEgcGFuZWwgcmVsb2FkIGRvZXNuJ3QgbG9zZSBoYWxmLXR5cGVkXG4gIC8vIGVudHJpZXMuIGBjaGFuZ2VgIG9ubHkgZmlyZXMgb24gYmx1ciBmb3IgdGV4dGFyZWFzLlxuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICBpZiAodD8uZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSB0LnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb3BlbkRyYXdlciA9ICgpOiB2b2lkID0+IHsgZHJhd2VyLmhpZGRlbiA9IGZhbHNlOyByZW5kZXJXc0NvbnRyb2xzKCk7IH07XG4gIGNvbnN0IGNsb3NlRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gdHJ1ZTsgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICBpZiAoIXdzTGlzdCkgcmV0dXJuO1xuICAgIHdzTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIGxpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgbGkuZGF0YXNldC50aXAgPSB3Lm5hbWUgPT09IGFjdGl2ZVdzXG4gICAgICAgID8gYEFjdGl2ZSB3b3Jrc3BhY2U6ICR7dy5uYW1lfWBcbiAgICAgICAgOiBgU3dpdGNoIHRvIHdvcmtzcGFjZSBcIiR7dy5uYW1lfVwiYDtcbiAgICAgIC8vIFdob2xlIHJvdyBpcyB0aGUgc3dpdGNoIHRyaWdnZXIg4oCUIG5vIGRlZGljYXRlZCBjaGVjayBidXR0b24uXG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgIC8vIElnbm9yZSBjbGlja3Mgb24gaW5uZXIgY29udHJvbHMgKHRoZSBkZWxldGUgYnV0dG9uIGJlbG93KS5cbiAgICAgICAgaWYgKChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnYnV0dG9uJykpIHJldHVybjtcbiAgICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIHJldHVybjtcbiAgICAgICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh3Lm5hbWUpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG5hbWUuY2xhc3NOYW1lID0gJ3dzLW5hbWUnO1xuICAgICAgbmFtZS50ZXh0Q29udGVudCA9IHcubmFtZTtcbiAgICAgIGxpLmFwcGVuZChuYW1lKTtcbiAgICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBtZXRhLmNsYXNzTmFtZSA9ICd3cy1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBuZXcgRGF0ZSh3LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgICBsaS5hcHBlbmQobWV0YSk7XG4gICAgICBpZiAod29ya3NwYWNlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBkZWwudHlwZSA9ICdidXR0b24nO1xuICAgICAgICBkZWwuY2xhc3NOYW1lID0gJ2Rhbmdlcic7XG4gICAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyB3b3Jrc3BhY2UgYW5kIGV2ZXJ5dGhpbmcgaW4gaXQnO1xuICAgICAgICBkZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgaWYgKCFjb25maXJtKGBEZWxldGUgd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCIgYW5kIGFsbCBpdHMgY2FwdHVyZXM/YCkpIHJldHVybjtcbiAgICAgICAgICB3b3Jrc3BhY2VzID0gd29ya3NwYWNlcy5maWx0ZXIoKHgpID0+IHgubmFtZSAhPT0gdy5uYW1lKTtcbiAgICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFt3c01zZ0tleSh3Lm5hbWUpLCB3c1Nob3RzS2V5KHcubmFtZSksIHdzU2hvdHNGdWxsS2V5KHcubmFtZSldKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgICAgICBpZiAoYWN0aXZlV3MgPT09IHcubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3b3Jrc3BhY2VzWzBdIS5uYW1lKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpLmFwcGVuZChkZWwpO1xuICAgICAgfVxuICAgICAgd3NMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuICB9O1xuICB3c1NlbGVjdD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKGUpID0+IHtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKChlLnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdFeHBvcnQgd29ya3NwYWNlIGFzIC50YXIuenN0IChKU09OTCArIHNjcmVlbnNob3RzICsgRHVja0RCICsgUkVBRE1FKScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydFppcCgpfSxcbiAgICB7aWQ6ICdjb3B5LXBhdGgnLCBsYWJlbDogJ0NvcHkgcGF0aCBvZiBsYXN0IGV4cG9ydCcsIHJ1bjogKCkgPT4gdm9pZCBvbkNvcHlQYXRoKCl9LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3ZhbGlkYXRlJywgbGFiZWw6ICdSZS1jaGVjayBzZWxlY3RvcnMnLCBydW46ICgpID0+IHZvaWQgb25WYWxpZGF0ZSgpfSxcbiAgICB7aWQ6ICdjbGVhcicsIGxhYmVsOiAnQ2xlYXIgYWxsIGNhcHR1cmVzJywgcnVuOiBvbkNsZWFyfSxcbiAgICB7aWQ6ICdzZXR0aW5ncycsIGxhYmVsOiAnT3BlbiBzZXR0aW5ncycsIHJ1bjogb3BlbkRyYXdlcn0sXG4gICAge2lkOiAnZ2l0aHViJywgbGFiZWw6ICdPcGVuIEdpdEh1YiByZXBvJywgcnVuOiBvbkdpdGh1Yn0sXG4gICAge2lkOiAnbWFudWFsJywgbGFiZWw6ICdNYW51YWwgY2FwdHVyZSAoc3RhcnQgY29tcG9zZXIgd2l0aCBgPiBzZWxlY3RvcmApJywgcnVuOiAoKSA9PiB7IGNvbXBvc2VyLnZhbHVlID0gJz4gJzsgY29tcG9zZXIuZm9jdXMoKTsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyB9fSxcbiAgICB7aWQ6ICd1bmRvJywgbGFiZWw6ICdVbmRvJywgcnVuOiB1bmRvfSxcbiAgICB7aWQ6ICdyZWRvJywgbGFiZWw6ICdSZWRvJywgcnVuOiByZWRvfSxcbiAgXTtcbiAgY29uc3QgcmVuZGVyUGFsZXR0ZSA9IChxID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBjb25zdCBxbCA9IHEudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIC4uLkNPTU1BTkRTLmZpbHRlcigoYykgPT4gIXFsIHx8IGMubGFiZWwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxbCkpXG4gICAgICAgIC5tYXAoKGMpID0+ICh7bGFiZWw6IGMubGFiZWwsIHByZXZpZXc6ICdjb21tYW5kJywgcnVuOiBjLnJ1bn0pKSxcbiAgICAgIC4uLm1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAoIXFsIHx8XG4gICAgICAgIChtLmVudHJ5LnNlbGVjdG9yICsgJyAnICsgKG0uZW50cnkudGV4dCA/PyAnJykgKyAnICcgKyAobS5lbnRyeS5jb21wb25lbnRSb290ID8/ICcnKSlcbiAgICAgICAgICAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxbCkpKVxuICAgICAgICAuc2xpY2UoMCwgMzApXG4gICAgICAgIC5tYXAoKG0pID0+IHtcbiAgICAgICAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgICAgICAgIGNvbnN0IHByZXZpZXcgPSAobS5lbnRyeS50ZXh0ID8/IGZiWzBdID8/IG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyBtLmVudHJ5LnNlbGVjdG9yID8/ICcnKS5zbGljZSgwLCA4MCk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhYmVsOiBgIyR7bS5lbnRyeS5ufSAke20uZW50cnkuY29tcG9uZW50Um9vdCA/PyBtLmVudHJ5LnNlbGVjdG9yfWAsXG4gICAgICAgICAgICBwcmV2aWV3LFxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGNsb3NlUGFsZXR0ZSgpO1xuICAgICAgICAgICAgICBzY3JvbGxNZXNzYWdlSW50b1ZpZXcobS5pZCk7XG4gICAgICAgICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICBdO1xuICAgIGl0ZW1zLmZvckVhY2goKGl0LCBpKSA9PiB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBsYmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYmwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICAgIGxibC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5sYWJlbCwgcSk7XG4gICAgICBsaS5hcHBlbmQobGJsKTtcbiAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBwLmNsYXNzTmFtZSA9ICdwcmV2aWV3JztcbiAgICAgIHAuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQucHJldmlldyA/PyAnJywgcSk7XG4gICAgICBsaS5hcHBlbmQocCk7XG4gICAgICBjb25zdCBrYmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBrYmQuY2xhc3NOYW1lID0gJ2tiZCc7XG4gICAgICBrYmQudGV4dENvbnRlbnQgPSAn4oa1JztcbiAgICAgIGxpLmFwcGVuZChrYmQpO1xuICAgICAgaWYgKGkgPT09IDApIGxpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGl0LnJ1bigpOyB9KTtcbiAgICAgIHBhbGV0dGVMaXN0LmFwcGVuZChsaSk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9wZW5QYWxldHRlID0gKHByZXNldCA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZS5oaWRkZW4gPSBmYWxzZTtcbiAgICBwYWxldHRlSW5wdXQudmFsdWUgPSBwcmVzZXQ7XG4gICAgcmVuZGVyUGFsZXR0ZShwcmVzZXQpO1xuICAgIHBhbGV0dGVJbnB1dC5mb2N1cygpO1xuICAgIHBhbGV0dGVJbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShwcmVzZXQubGVuZ3RoLCBwcmVzZXQubGVuZ3RoKTtcbiAgfTtcbiAgY29uc3QgY2xvc2VQYWxldHRlID0gKCk6IHZvaWQgPT4geyBwYWxldHRlLmhpZGRlbiA9IHRydWU7IH07XG4gIHBhbGV0dGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHJlbmRlclBhbGV0dGUocGFsZXR0ZUlucHV0LnZhbHVlKSk7XG4gIHBhbGV0dGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBjb25zdCBpdGVtcyA9IFsuLi5wYWxldHRlTGlzdC5jaGlsZHJlbl07XG4gICAgbGV0IGFjdGl2ZSA9IGl0ZW1zLmZpbmRJbmRleCgobGkpID0+IGxpLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpO1xuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3IgKGNvbnN0IGxpIG9mIGl0ZW1zKSBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgYWN0aXZlID0gTWF0aC5taW4oaXRlbXMubGVuZ3RoIC0gMSwgYWN0aXZlICsgMSk7IGl0ZW1zW2FjdGl2ZV0/LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dVcCcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3IgKGNvbnN0IGxpIG9mIGl0ZW1zKSBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgYWN0aXZlID0gTWF0aC5tYXgoMCwgYWN0aXZlIC0gMSk7IGl0ZW1zW2FjdGl2ZV0/LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7IGUucHJldmVudERlZmF1bHQoKTsgKGl0ZW1zW2FjdGl2ZV0gYXMgSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQpPy5jbGljaygpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgY2xvc2VQYWxldHRlKCk7XG4gIH0pO1xuICBwYWxldHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHsgaWYgKGUudGFyZ2V0ID09PSBwYWxldHRlKSBjbG9zZVBhbGV0dGUoKTsgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEN1c3RvbSB0b29sdGlwIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgdGlwRm9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBjb25zdCBzaG93VGlwID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXAnKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRvb2x0aXBFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpcFIgPSB0b29sdGlwRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHRvcCA9IHIuYm90dG9tICsgNDtcbiAgICBsZXQgbGVmdCA9IHIubGVmdCArIHIud2lkdGggLyAyIC0gdGlwUi53aWR0aCAvIDI7XG4gICAgaWYgKHRvcCArIHRpcFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSB0aXBSLmhlaWdodCAtIDQ7XG4gICAgaWYgKGxlZnQgPCA0KSBsZWZ0ID0gNDtcbiAgICBpZiAobGVmdCArIHRpcFIud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDQpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHRpcFIud2lkdGggLSA0O1xuICAgIHRvb2x0aXBFbC5zdHlsZS5jc3NUZXh0ID0gYHRvcDoke3RvcH1weDtsZWZ0OiR7bGVmdH1weDtgO1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnO1xuICB9O1xuICBjb25zdCBoaWRlVGlwID0gKCk6IHZvaWQgPT4ge1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ2ZhbHNlJztcbiAgICB0aXBGb3IgPSBudWxsO1xuICAgIHRvb2x0aXBFbC5oaWRkZW4gPSB0cnVlO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKCF0IHx8IHQgPT09IHRpcEZvcikgcmV0dXJuO1xuICAgIHRpcEZvciA9IHQ7XG4gICAgc2hvd1RpcCh0KTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0ICYmIHQgPT09IHRpcEZvciAmJiAhdC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVUaXAoKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXQgZHJpbGxkb3ducyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgYnVpbGREcmlsbGRvd24gPSAoa2luZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAoa2luZCA9PT0gJ3NlbGVjdG9ycycpIHtcbiAgICAgIGxpbmVzLnB1c2goJzxoNT5TZWxlY3RvcnMgYnkgcXVhbGl0eTwvaDU+Jyk7XG4gICAgICBjb25zdCBidWNrZXRzID0ge2lkOiAwLCB0ZXN0aWQ6IDAsIGNsYXNzOiAwLCBudGg6IDAsIHRhZzogMH07XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgICBpZiAoZS50ZXN0SWQpIGJ1Y2tldHMudGVzdGlkKys7XG4gICAgICAgIGVsc2UgaWYgKGUuaWQgfHwgL14jW1xcdy1dKyQvLnRlc3QoZS5zZWxlY3RvcikpIGJ1Y2tldHMuaWQrKztcbiAgICAgICAgZWxzZSBpZiAoKGUuc2VsZWN0b3IgPz8gJycpLmluY2x1ZGVzKCc6bnRoLW9mLXR5cGUnKSkgYnVja2V0cy5udGgrKztcbiAgICAgICAgZWxzZSBpZiAoL1xcLi8udGVzdChlLnNlbGVjdG9yID8/ICcnKSkgYnVja2V0cy5jbGFzcysrO1xuICAgICAgICBlbHNlIGJ1Y2tldHMudGFnKys7XG4gICAgICB9XG4gICAgICBsaW5lcy5wdXNoKGA8dWw+XG4gICAgICAgIDxsaT48Yj4ke2J1Y2tldHMudGVzdGlkfTwvYj4gZGF0YS10ZXN0aWQ8L2xpPlxuICAgICAgICA8bGk+PGI+JHtidWNrZXRzLmlkfTwvYj4gc3RhYmxlIGlkPC9saT5cbiAgICAgICAgPGxpPjxiPiR7YnVja2V0cy5jbGFzc308L2I+IGNsYXNzLWJhc2VkPC9saT5cbiAgICAgICAgPGxpPjxiPiR7YnVja2V0cy5udGh9PC9iPiBudGgtb2YtdHlwZTwvbGk+XG4gICAgICAgIDxsaT48Yj4ke2J1Y2tldHMudGFnfTwvYj4gdGFnLW9ubHk8L2xpPlxuICAgICAgPC91bD5gKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdzdGFsZScpIHtcbiAgICAgIGxpbmVzLnB1c2goJzxoNT5TdGFsZSBjYXB0dXJlczwvaDU+PHVsPicpO1xuICAgICAgY29uc3Qgc3RhbGUgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKTtcbiAgICAgIGlmICghc3RhbGUubGVuZ3RoKSBsaW5lcy5wdXNoKCc8bGk+Tm9uZSDigJQgZXZlcnl0aGluZyByZXNvbHZlcy48L2xpPicpO1xuICAgICAgZWxzZSBmb3IgKGNvbnN0IG0gb2Ygc3RhbGUpIGxpbmVzLnB1c2goYDxsaT48Yj4jJHttLmVudHJ5Lm59PC9iPiA8Y29kZT4ke2VzY2FwZUh0bWwoKG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDUwKSl9PC9jb2RlPjwvbGk+YCk7XG4gICAgICBsaW5lcy5wdXNoKCc8L3VsPicpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ2NvbW1lbnRzJykge1xuICAgICAgbGluZXMucHVzaCgnPGg1PkNvbW1lbnRzPC9oNT48dWw+Jyk7XG4gICAgICBjb25zdCBmYnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIEZlZWRiYWNrTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpO1xuICAgICAgbGluZXMucHVzaChgPGxpPlRvdGFsIHdvcmRzOiA8Yj4ke2Zicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyB3b3JkQ291bnQobS50ZXh0KSwgMCl9PC9iPjwvbGk+YCk7XG4gICAgICBsaW5lcy5wdXNoKGA8bGk+QXZlcmFnZSBsZW5ndGg6IDxiPiR7ZmJzLmxlbmd0aCA/IE1hdGgucm91bmQoZmJzLnJlZHVjZSgocywgbSkgPT4gcyArIG0udGV4dC5sZW5ndGgsIDApIC8gZmJzLmxlbmd0aCkgOiAwfTwvYj4gY2hhcnM8L2xpPmApO1xuICAgICAgbGluZXMucHVzaCgnPC91bD4nKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdwYWdlcycpIHtcbiAgICAgIGxpbmVzLnB1c2goJzxoNT5QYWdlczwvaDU+PHVsPicpO1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNlZW4uc2V0KG0uZW50cnkudXJsLCAoc2Vlbi5nZXQobS5lbnRyeS51cmwpID8/IDApICsgMSk7XG4gICAgICBmb3IgKGNvbnN0IFt1cmwsIG5dIG9mIHNlZW4pIGxpbmVzLnB1c2goYDxsaT48Yj4ke259PC9iPiBzZWxlY3RvciR7biA9PT0gMSA/ICcnIDogJ3MnfSDCtyA8Y29kZT4ke2VzY2FwZUh0bWwocGF0aE9mKHVybCkpfTwvY29kZT48L2xpPmApO1xuICAgICAgbGluZXMucHVzaCgnPC91bD4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJycpO1xuICB9O1xuICBjb25zdCBzaG93RHJpbGxkb3duID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBraW5kID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zdGF0Jyk7XG4gICAgaWYgKCFraW5kKSByZXR1cm47XG4gICAgZHJpbGxkb3duRWwuaW5uZXJIVE1MID0gYnVpbGREcmlsbGRvd24oa2luZCk7XG4gICAgZHJpbGxkb3duRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkUiA9IGRyaWxsZG93bkVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDY7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIGRSLndpZHRoIC8gMjtcbiAgICBpZiAodG9wICsgZFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSBkUi5oZWlnaHQgLSA2O1xuICAgIGlmIChsZWZ0IDwgNikgbGVmdCA9IDY7XG4gICAgaWYgKGxlZnQgKyBkUi53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNikgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZFIud2lkdGggLSA2O1xuICAgIGRyaWxsZG93bkVsLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7dG9wfXB4O2xlZnQ6JHtsZWZ0fXB4O2A7XG4gIH07XG4gIGNvbnN0IGhpZGVEcmlsbGRvd24gPSAoKTogdm9pZCA9PiB7IGRyaWxsZG93bkVsLmhpZGRlbiA9IHRydWU7IH07XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcuc3RhdFtkYXRhLXN0YXRdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0KSBzaG93RHJpbGxkb3duKHQpO1xuICB9KTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgaWYgKCFzdGF0c0VsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZURyaWxsZG93bigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0LWJ1dHRvbiBob3ZlciDihpIgb3V0bGluZS1tdWx0aSBvbiBwYWdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBmb3IgKGNvbnN0IGJ0biBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1leHBvcnQtaG92ZXJdJykpIHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpJywgc2VsZWN0b3JzfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QuYWRkKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgQ2xpY2sgZGVsZWdhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXIgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICBpZiAoIXRyaWdnZXIpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aW9uID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJyk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ3NlbmQnOiBzZW5kRmVlZGJhY2soKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1hbGwnOiB2b2lkIG9uQ29weUFsbCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQnOiB2b2lkIG9uRXhwb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydC16aXAnOiB2b2lkIG9uRXhwb3J0WmlwKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktcGF0aCc6IHZvaWQgb25Db3B5UGF0aCgpOyByZXR1cm47XG4gICAgICBjYXNlICdpbXBvcnQnOiBvbkltcG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHZvaWQgb25WYWxpZGF0ZSgpOyByZXR1cm47XG4gICAgICBjYXNlICdjbGVhcic6IG9uQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZ2l0aHViJzogb25HaXRodWIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOiBvcGVuRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Nsb3NlLWRyYXdlcic6IGNsb3NlRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3VuZG8nOiB1bmRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3JlZG8nOiByZWRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Rlc2lnbi1lZGl0JzogeyB2b2lkIG9wZW5NZE1vZGFsKCdkZXNpZ24nKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdza2lsbC1lZGl0JzogIHsgdm9pZCBvcGVuTWRNb2RhbCgnc2tpbGwnKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdkZXNpZ24tdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbi1tZC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyBQcmVmZXIgdGhlIHVzZXIncyBsb2NhbCBvdmVycmlkZSBpZiBwcmVzZW50IChzbyBhIGZvcmsnc1xuICAgICAgICAgIC8vIFwiRG93bmxvYWQgdGVtcGxhdGVcIiBwcm9kdWNlcyB0aGUgc2FtZSBjb250ZW50IHRoZSBmb3JrIHNoaXBzKVxuICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgICAgICAgICBjb25zdCB0ZXh0ID0gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxEZXNpZ24nKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKSk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQg4oCUIGZpbGwgaW4gYW5kIHJlLXVwbG9hZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLmRlc2lnbk1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ0RFU0lHTi5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NraWxsLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXRlbXBsYXRlLWRvd25sb2FkJzoge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsU2tpbGwnKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdTS0lMTC5tZCB0ZW1wbGF0ZSBkb3dubG9hZGVkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXJlc2V0LXRlbXBsYXRlJzoge1xuICAgICAgICBwcmVmcy5za2lsbE1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICd3cy1jcmVhdGUnOiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAod3NOYW1lLnZhbHVlID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xuICAgICAgICBpZiAod29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IG5hbWUpKSB7IHNldFN0YXR1cygnQWxyZWFkeSBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICB3b3Jrc3BhY2VzLnB1c2goe25hbWUsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7XG4gICAgICAgIHBlcnNpc3RXb3Jrc3BhY2VzKCk7XG4gICAgICAgIHdzTmFtZS52YWx1ZSA9ICcnO1xuICAgICAgICB2b2lkIGxvYWRXb3Jrc3BhY2UobmFtZSkudGhlbihyZW5kZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEdsb2JhbCBrZXlib2FyZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0ID0gKHRhcmdldDogRXZlbnRUYXJnZXQgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgZWwgPSB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/IHRhcmdldCA6IG51bGw7XG4gICAgcmV0dXJuIEJvb2xlYW4oZWw/LmNsb3Nlc3QoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBbY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXSwgW2NvbnRlbnRlZGl0YWJsZT1cIlwiXScpKTtcbiAgfTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBjb25zdCBlZGl0YWJsZVRhcmdldCA9IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldChlLnRhcmdldCk7XG4gICAgaWYgKGVkaXRhYmxlVGFyZ2V0ICYmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBbJ2EnLCAneicsICd5J10uaW5jbHVkZXMoZS5rZXkudG9Mb3dlckNhc2UoKSkpIHJldHVybjtcbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICdrJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHBhbGV0dGUuaGlkZGVuID8gb3BlblBhbGV0dGUoKSA6IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHVuZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiAoZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3knIHx8IChlLnNoaWZ0S2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd6JykpKSB7IGUucHJldmVudERlZmF1bHQoKTsgcmVkbygpOyByZXR1cm47IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBjb25zdCBtZE1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgICAgaWYgKG1kTW9kYWwgJiYgIW1kTW9kYWwuaGlkZGVuKSB7IGNsb3NlTWRNb2RhbCgpOyByZXR1cm47IH1cbiAgICAgIGlmICghcGFsZXR0ZS5oaWRkZW4pIHsgY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFkcmF3ZXIuaGlkZGVuKSB7IGNsb3NlRHJhd2VyKCk7IHJldHVybjsgfVxuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHsgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY2FuY2VsJ30pOyBwZW5kaW5nTXVsdGkgPSBbXTsgcmVuZGVyKCk7IHNldFN0YXR1cygnUGVuZGluZyBncm91cCBjYW5jZWxsZWQnKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdJbnNlcnQgbW9kZSBjYW5jZWxsZWQnKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoc2VhcmNoUXVlcnkpIHsgc2VhcmNoLnZhbHVlID0gJyc7IHNlYXJjaFF1ZXJ5ID0gJyc7IHJlbmRlcigpOyB9XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogdHJ1ZX0pO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIGlmICghZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBwYW5lbFJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHBlbmRpbmdQYW5lbE1lc3NhZ2VzOiBhbnlbXSA9IFtdO1xuICBjb25zdCByZWNlaXZlUGFuZWxNZXNzYWdlID0gKG06IGFueSk6IHZvaWQgPT4ge1xuICAgIGlmICghcGFuZWxSZWFkeSkge1xuICAgICAgcGVuZGluZ1BhbmVsTWVzc2FnZXMucHVzaChtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25Dc01lc3NhZ2UobSk7XG4gIH07XG4gIGlmIChpbkV4dGVuc2lvbikge1xuICAgIC8vIFNpbmdsZSBjaGFubmVsOiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuIFRoZSBiYWNrZ3JvdW5kIHVzZWQgdG8gcmVsYXlcbiAgICAvLyB0aHJvdWdoIGEgcG9ydCB0b28sIGJ1dCBjb250ZW50LXNjcmlwdCBicm9hZGNhc3RzIGFscmVhZHkgcmVhY2ggdGhlXG4gICAgLy8gc2lkZSBwYW5lbCBkaXJlY3RseSDigJQgcmVsYXlpbmcgcHJvZHVjZWQgZHVwbGljYXRlIGRpc3BhdGNoZXMuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtOiBhbnkpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UobSkpO1xuICAgIGNocm9tZS50YWJzPy5vbkFjdGl2YXRlZD8uYWRkTGlzdGVuZXIoKCkgPT4gdm9pZCBydW5WYWxpZGF0aW9uKCkpO1xuICAgIGNocm9tZS50YWJzPy5vblVwZGF0ZWQ/LmFkZExpc3RlbmVyKChfaWQsIGluZm8pID0+IHsgaWYgKGluZm8/LnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykgdm9pZCBydW5WYWxpZGF0aW9uKCk7IH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6dG8tcGFuZWwnLCAoZSkgPT4gcmVjZWl2ZVBhbmVsTWVzc2FnZSgoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsKSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgVGVzdCBBUEkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGluc3RhbGxUZXN0QXBpID0gKCk6IHZvaWQgPT4ge1xuICAgICh3aW5kb3cgYXMgYW55KS5fX3BpbmNoZ3JhYl9wYW5lbCA9IHtcbiAgICAgIHB1c2hNZXNzYWdlOiAobTogUGFuZWxNZXNzYWdlKSA9PiB7IG1lc3NhZ2VzLnB1c2gobSk7IHBlcnNpc3QoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvbkNhcHR1cmUsIG9uSG92ZXIsIG9uSG92ZXJFbmQsXG4gICAgICBnZXRNZXNzYWdlczogKCkgPT4gWy4uLm1lc3NhZ2VzXSxcbiAgICAgIGdldFByZWZzOiAoKSA9PiAoey4uLnByZWZzfSksXG4gICAgICBzZXRQcmVmczogKHA6IFBhcnRpYWw8UHJlZnM+KSA9PiB7IHByZWZzID0gey4uLnByZWZzLCAuLi5wfTsgcGVyc2lzdFByZWZzKCk7IGFwcGx5UHJlZnNUb1VJKCk7IHJlbmRlcigpOyB9LFxuICAgICAgYnVpbGRKc29ubCxcbiAgICAgIGJ1aWxkRXhwb3J0RmlsZW5hbWUsIGJ1aWxkTWFuaWZlc3QsIGRvbWluYW50SG9zdFNsdWcsIGRpc3RpbmN0SG9zdHMsXG4gICAgICBkdWNrRGJTbmlwcGV0LCBvbkV4cG9ydFppcCwgb25FeHBvcnQsIG9uQ29weVBhdGgsXG4gICAgICBkZW5vcm1hbGl6ZUVudHJ5LFxuICAgICAgZ2V0TGFzdEV4cG9ydDogKCkgPT4gKHsuLi5sYXN0RXhwb3J0fSksXG4gICAgICAvLyBUZXN0IGhhdGNoOiBzZWVkIGV2ZXJ5IHNlbGVjdG9yIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBmdWxsIFBORyBkYXRhVVJMXG4gICAgICAvLyBzbyB0aGUgYXJjaGl2ZSBleHBvcnQgaGFzIHNvbWV0aGluZyB0byBidW5kbGUuIFJlYWwgY2FwdHVyZXMgcG9wdWxhdGVcbiAgICAgIC8vIHNob3RzRnVsbCBmcm9tIHRoZSBiZyBgcnVuU2hvdGAgcmVwbHk7IHRlc3RzIGNhbid0IGVhc2lseSBydW4gYVxuICAgICAgLy8gY2FwdHVyZVZpc2libGVUYWIsIHNvIHRoaXMgbGV0cyB1cyBwcm92ZSB0aGUgUE5HIGJ1bmRsaW5nIHBhdGguXG4gICAgICBfX3NlZWRTaG90c0Z1bGw6IChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2hvdHNGdWxsLnNldChtLmVudHJ5LnNlbGVjdG9yLCBkYXRhVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgICB9LFxuICAgICAgX19nZXRTaG90c0Z1bGw6ICgpID0+IHNob3RzRnVsbCxcbiAgICAgIHNldFNlYXJjaDogKHE6IHN0cmluZykgPT4geyBzZWFyY2hRdWVyeSA9IHE7IHNlYXJjaC52YWx1ZSA9IHE7IHJlbmRlcigpOyB9LFxuICAgICAgc2V0VmFsaWRpdHk6IChzZWw6IHN0cmluZywgb2s6IGJvb2xlYW4gfCAnZGlmZi1wYWdlJywgcmVhc29uPzogc3RyaW5nKSA9PiB7XG4gICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICBpZiAocmVhc29uKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCByZWFzb24pO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICAgICAgbGl2ZVRhYlBhdGggPSBudWxsO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgICAgICBzaG90cy5jbGVhcigpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9wZW5QYWxldHRlLCBjbG9zZVBhbGV0dGUsIG9wZW5EcmF3ZXIsIGNsb3NlRHJhd2VyLFxuICAgICAgc2VuZEZlZWRiYWNrLCB1bmRvLCByZWRvLFxuICAgICAgbGlzdFdvcmtzcGFjZXM6ICgpID0+IFsuLi53b3Jrc3BhY2VzXSxcbiAgICAgIGFjdGl2ZVdvcmtzcGFjZTogKCkgPT4gYWN0aXZlV3MsXG4gICAgICBzZXRTdGlja3lUVEw6IChtczogbnVtYmVyKSA9PiB7IFNUSUNLWV9UVExfTVMgPSBtczsgfSxcbiAgICAgIGZvcmNlU3RpY2t5RXhwaXJlOiAoKSA9PiB7IGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7IHBhbmVsSG92ZXJlZCA9IGZhbHNlOyBhcm1TdGlja3lFeHBpcnkoKTsgfSxcbiAgICAgIHNldExhc3RBY3RpdmUsXG4gICAgICBjcmVhdGVXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IHsgd29ya3NwYWNlcy5wdXNoKHtuYW1lOiBuLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0pOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZXR1cm4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlcik7IH0sXG4gICAgICBzd2l0Y2hXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IGxvYWRXb3Jrc3BhY2UobikudGhlbihyZW5kZXIpLFxuICAgIH07XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEJvb3Qg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBsb2FkQWxsKCk7XG4gICAgcGFuZWxSZWFkeSA9IHRydWU7XG4gICAgZm9yIChjb25zdCBtIG9mIHBlbmRpbmdQYW5lbE1lc3NhZ2VzLnNwbGljZSgwKSkgb25Dc01lc3NhZ2UobSk7XG4gICAgcmVuZGVyKCk7XG4gICAgaW5zdGFsbFRlc3RBcGkoKTtcbiAgICB2b2lkIHJ1blZhbGlkYXRpb24oKTtcbiAgICB2b2lkIGZldGNoU3RhcnMoKTtcbiAgICB1cGRhdGVDb21wb3Nlck1ldGVyKCk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgICBjb25zb2xlLmxvZyhMT0csICdyZWFkeScsIHtpbkV4dGVuc2lvbiwgd3M6IGFjdGl2ZVdzLCBtZXNzYWdlczogbWVzc2Fn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LGNBQWMsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUFBO0FBQUEsUUFDM0osaUJBQWlCLENBQUMsTUFBYyxjQUFjLENBQUMsRUFBRSxLQUFLLE1BQU07QUFBQSxNQUM5RDtBQUFBO0FBQUEsS0FJSSxZQUFZO0FBQUEsTUFDaEIsTUFBTSxRQUFRO0FBQUEsTUFDZCxhQUFhO0FBQUEsTUFDYixXQUFXLEtBQUsscUJBQXFCLE9BQU8sQ0FBQztBQUFBLFFBQUcsWUFBWSxDQUFDO0FBQUEsTUFDN0QsT0FBTztBQUFBLE1BQ1AsZUFBZTtBQUFBLE1BQ1YsY0FBYztBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ2hCLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLFFBQVEsSUFBSSxLQUFLLFNBQVMsRUFBQyxhQUFhLElBQUksVUFBVSxVQUFVLFNBQVMsT0FBTSxDQUFDO0FBQUEsT0FDL0U7QUFBQSxLQUNGOyIsCiAgImRlYnVnSWQiOiAiOTZCRjE4Q0M4M0NFRjQ4OTY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
