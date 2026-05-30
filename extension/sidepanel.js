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

  // src/export-capture.mjs
  var normalizeCapture = (capture) => {
    if (!capture || typeof capture !== "object") {
      throw new Error("serializeCaptureFull: capture must be an object");
    }
    const entry = capture.entry ?? capture;
    if (!entry || typeof entry !== "object") {
      throw new Error("serializeCaptureFull: capture has no entry");
    }
    const feedback = Array.isArray(capture.feedback) ? capture.feedback : [];
    const members = Array.isArray(capture.members) ? capture.members : Array.isArray(entry.group) ? entry.group : [];
    return { entry, feedback, members };
  };
  var slimComment = (fb) => {
    const out = { text: typeof fb.text === "string" ? fb.text : "" };
    if (fb.ts)
      out.ts = fb.ts;
    if (fb.uid)
      out.uid = fb.uid;
    if (fb.parentUid)
      out.parentUid = fb.parentUid;
    if (Array.isArray(fb.tags) && fb.tags.length)
      out.tags = fb.tags;
    return out;
  };
  var collectPaths = (entry) => {
    const paths = {};
    if (entry.selector)
      paths.css = entry.selector;
    const sel = entry.selectors;
    if (sel && typeof sel === "object") {
      if (sel.css && sel.css !== paths.css)
        paths.cssFull = sel.css;
      if (sel.compact)
        paths.compact = sel.compact;
      if (sel.xpath)
        paths.xpath = sel.xpath;
      if (sel.dataIds)
        paths.dataIds = sel.dataIds;
    }
    if (entry.componentRoot)
      paths.componentRoot = entry.componentRoot;
    if (entry.shadowHost)
      paths.shadowHost = entry.shadowHost;
    if (entry.id)
      paths.domId = entry.id;
    if (entry.testId)
      paths.testId = entry.testId;
    if (typeof entry.selectorMatchCount === "number") {
      paths.matchCount = entry.selectorMatchCount;
    }
    return paths;
  };
  var serializeCaptureFull = (capture, opts = {}) => {
    const { entry, feedback, members } = normalizeCapture(capture);
    const out = {
      kind: "pinchgrab/capture-full",
      v: 1
    };
    if (entry.uid)
      out.uid = entry.uid;
    if (entry.n !== undefined)
      out.n = entry.n;
    if (entry.ts)
      out.ts = entry.ts;
    if (entry.url)
      out.url = entry.url;
    if (entry.tag)
      out.tag = entry.tag;
    const identity = {};
    if (entry.role !== undefined)
      identity.role = entry.role;
    if (entry.accessibleName !== undefined)
      identity.accessibleName = entry.accessibleName;
    if (entry.testId !== undefined)
      identity.testId = entry.testId;
    if (entry.id !== undefined)
      identity.id = entry.id;
    if (Array.isArray(entry.classes) && entry.classes.length)
      identity.classes = entry.classes;
    if (Object.keys(identity).length)
      out.identity = identity;
    const paths = collectPaths(entry);
    if (Object.keys(paths).length)
      out.paths = paths;
    const content = {};
    if (entry.text !== undefined)
      content.text = entry.text;
    if (entry.renderedText !== undefined)
      content.renderedText = entry.renderedText;
    if (entry.value !== undefined)
      content.value = entry.value;
    if (entry.placeholder !== undefined)
      content.placeholder = entry.placeholder;
    if (entry.outerHTML !== undefined)
      content.outerHTML = entry.outerHTML;
    if (Object.keys(content).length)
      out.content = content;
    if (feedback.length)
      out.comments = feedback.map(slimComment);
    const meta = {};
    const passthrough = [
      "rect",
      "viewport",
      "states",
      "attrs",
      "hints",
      "component",
      "events",
      "behaviorAttrs",
      "a11y",
      "assets",
      "layoutContext",
      "styles",
      "matchedRules",
      "ancestors",
      "screenshot",
      "truncated",
      "sessionId",
      "canvasClick",
      "editor",
      "domMutations",
      "isAnimating"
    ];
    for (const key of passthrough) {
      if (entry[key] !== undefined)
        meta[key] = entry[key];
    }
    if (Object.keys(meta).length)
      out.meta = meta;
    if (members.length) {
      out.members = members.map((m) => serializeCaptureFull(m, opts));
    }
    return out;
  };
  var serializeCaptureJson = (capture, opts = {}) => JSON.stringify(serializeCaptureFull(capture, opts), null, 2) + `
`;

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
    const findBar = document.querySelector("[data-find-bar]");
    const findInput = document.querySelector("[data-find]");
    const findCount = document.querySelector("[data-find-count]");
    const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || "");
    if (!isMac) {
      for (const el of document.querySelectorAll("kbd[data-mod-k], kbd[data-mod-z], kbd[data-mod-shift-z]")) {
        el.textContent = (el.textContent ?? "").replace(/^Cmd\b/, "Ctrl");
      }
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
      minify: true,
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
    const wsSnapshotsKey = (n) => `pinchgrab.ws.${n}.snapshots.v1`;
    const WS_SNAPSHOT_CAP = 10;
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
      await loadWsSnapshots(name);
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
        case "page-snapshot":
          onPageSnapshot(msg.payload);
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
    const pendingSnapshots = new Map;
    const applySnapshotToPage = (snap) => {
      for (let i = messages.length - 1;i >= 0; i--) {
        const m = messages[i];
        if (m?.type === "page" && m.url === snap.url) {
          m.snapshot = snap;
          return true;
        }
      }
      return false;
    };
    const onPageSnapshot = (payload) => {
      if (!payload?.url)
        return;
      if (applySnapshotToPage(payload)) {
        persist();
        render();
      } else {
        pendingSnapshots.set(payload.url, payload);
      }
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
        const pending = pendingSnapshots.get(page.url);
        if (pending) {
          pageMsg.snapshot = pending;
          pendingSnapshots.delete(page.url);
        }
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
        render();
        return;
      }
      if (shouldSkipScreenshot(msg.entry.url)) {
        console.log(LOG, "fireElementShot skipped: host on skip list", msg.entry.url);
        msg.entry.screenshot = { ...msg.entry.screenshot ?? {}, unavailableReason: "skipScreenshotHosts" };
        render();
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
        render();
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
      let lastRenderedPageUrl = null;
      let renderedAny = false;
      for (let i = 0;i < ordered.length; i++) {
        const m = ordered[i];
        if (!matchesSearch(m))
          continue;
        if (m.type === "page") {
          if (m.url === lastRenderedPageUrl)
            continue;
          lastRenderedPageUrl = m.url;
        }
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
      const shotExpected = prefs.autoScreenshot && !shouldSkipScreenshot(m.entry.url ?? "") && !m.entry.screenshot?.unavailableReason;
      if (shotDataUrl || shotExpected) {
        const preview = document.createElement("div");
        preview.className = "preview";
        const r2 = m.entry.rect;
        if (r2 && r2.w > 0 && r2.h > 0) {
          const ratio = Math.min(Math.max(r2.h / r2.w, 0.12), 2.2);
          preview.style.setProperty("--shot-ratio", String(ratio));
          preview.classList.add("reserved");
        }
        if (shotDataUrl) {
          const img = document.createElement("img");
          img.className = "shot";
          img.alt = `Screenshot of #${m.entry.n}`;
          img.addEventListener("load", () => preview.classList.add("loaded"));
          img.src = shotDataUrl;
          if (img.complete)
            preview.classList.add("loaded");
          preview.append(img);
        } else {
          preview.classList.add("loading");
          const skel = document.createElement("div");
          skel.className = "shot-skeleton";
          skel.setAttribute("aria-label", `Loading screenshot of #${m.entry.n}`);
          preview.append(skel);
        }
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
      wrapLabel.dataset.tip = "Flatten to a single soft-wrapping line instead of horizontal scroll";
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
        const feedback = messages.flatMap((x) => x.type === "feedback" && x.parentUid === m.entry.uid ? [{ text: x.text, ts: x.ts, uid: x.id, parentUid: x.parentUid }] : []);
        await navigator.clipboard.writeText(serializeCaptureJson({ entry: m.entry, feedback }));
        setStatus("Copied capture export");
        showCopied("Copied capture", `#${m.entry.n}`);
      });
      jsonBar.append(copyBtn);
      jsonWrap.append(jsonBar);
      const body = document.createElement("div");
      body.className = "body-json wrap-on";
      const renderJson = () => {
        body.textContent = "";
        const wrapped = wrapCheck.checked;
        const payload = wrapped || prefs.minify ? slimEntry(m.entry, { includeGroup: true }) : m.entry;
        const indent = wrapped || prefs.minify ? 0 : 2;
        const text = JSON.stringify(payload, null, indent);
        appendJsonHighlight(body, text);
        if (searchQuery)
          wrapSearchHitsInTextNodes(body, searchQuery);
      };
      renderJson();
      wrapCheck.addEventListener("change", () => {
        body.classList.toggle("wrap-on", wrapCheck.checked);
        body.classList.toggle("wrap-off", !wrapCheck.checked);
        renderJson();
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
      actions.append(actionBtn("copy", "Copy this capture as a full export (paths, text, comments)", async () => {
        const feedback = messages.flatMap((x) => x.type === "feedback" && x.parentUid === m.entry.uid ? [{ text: x.text, ts: x.ts, uid: x.id, parentUid: x.parentUid }] : []);
        await navigator.clipboard.writeText(serializeCaptureJson({ entry: m.entry, feedback }));
        setStatus("Copied capture export");
        showCopied("Copied capture", `#${m.entry.n}`);
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
      if (searchQuery)
        closeFind();
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
    const triggerPaletteFromSearch = () => {
      if (!palette.hidden)
        return;
      openPalette();
      search.blur();
    };
    search.addEventListener("focus", triggerPaletteFromSearch);
    search.addEventListener("click", triggerPaletteFromSearch);
    search.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerPaletteFromSearch();
      }
    });
    const scrollFirstFindHitIntoView = () => {
      if (!searchQuery)
        return;
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
    };
    const updateFindCount = () => {
      if (!findCount)
        return;
      findCount.textContent = searchQuery ? `${list.querySelectorAll(".msg").length} match` : "";
    };
    const applyFind = (value) => {
      searchQuery = value.trim();
      render();
      updateFindCount();
      scrollFirstFindHitIntoView();
    };
    const openFind = () => {
      if (!findBar || !findInput)
        return;
      findBar.hidden = false;
      document.querySelector(".panel")?.classList.add("find-open");
      findInput.focus();
      findInput.select();
    };
    const closeFind = () => {
      if (findBar)
        findBar.hidden = true;
      document.querySelector(".panel")?.classList.remove("find-open");
      if (findInput)
        findInput.value = "";
      if (searchQuery) {
        searchQuery = "";
        render();
      }
      updateFindCount();
    };
    findInput?.addEventListener("input", () => applyFind(findInput.value));
    findInput?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeFind();
      }
    });
    document.querySelector("[data-find-clear]")?.addEventListener("click", closeFind);
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
          const snap = m.snapshot;
          if (snap)
            slim.snapshot = snap;
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
    let wsSnapshots = [];
    const loadWsSnapshots = async (name) => {
      wsSnapshots = await Store.get(wsSnapshotsKey(name), []) || [];
    };
    const persistWsSnapshots = () => {
      Store.set(wsSnapshotsKey(activeWs), wsSnapshots);
    };
    const archiveWorkspaceSnapshot = () => {
      if (!messages.length)
        return null;
      const snap = {
        id: secureToken(8),
        ts: new Date().toISOString(),
        messages: structuredClone(messages),
        shots: Object.fromEntries(shots),
        selectors: messages.filter((m) => m.type === "selector").length,
        comments: messages.filter((m) => m.type === "feedback").length
      };
      wsSnapshots.unshift(snap);
      if (wsSnapshots.length > WS_SNAPSHOT_CAP)
        wsSnapshots = wsSnapshots.slice(0, WS_SNAPSHOT_CAP);
      persistWsSnapshots();
      return snap;
    };
    const restoreWorkspaceSnapshot = (id) => {
      const snap = wsSnapshots.find((s) => s.id === id);
      if (!snap)
        return false;
      snapshot();
      messages = structuredClone(snap.messages);
      shots.clear();
      for (const [k, v] of Object.entries(snap.shots))
        shots.set(k, v);
      shotsFull.clear();
      selectorValidity.clear();
      insertBefore.current = null;
      persistShots();
      persistShotsFull();
      persist();
      render();
      renderWsControls();
      setStatus(`Restored snapshot · ${snap.selectors} selectors`);
      return true;
    };
    const deleteWorkspaceSnapshot = (id) => {
      wsSnapshots = wsSnapshots.filter((s) => s.id !== id);
      persistWsSnapshots();
      renderWsControls();
    };
    const onClear = () => {
      if (!confirm("Clear all captures and comments?"))
        return;
      archiveWorkspaceSnapshot();
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
      renderWsControls();
      setStatus("Cleared · snapshot saved");
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
      const label = kind === "design" ? "Teaches your agent to build UI in your brand" : "Advanced: how your agent should read PinchGrab exports";
      const source = usingTemplate ? kind === "design" ? "Starter template — make it yours" : "Bundled template" : "Customized";
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
    const createWorkspaceFlow = async (name) => {
      const trimmed = name.trim();
      if (!trimmed)
        return false;
      if (workspaces.find((w) => w.name === trimmed)) {
        setStatus("Already exists", { kind: "warn" });
        return false;
      }
      workspaces.push({ name: trimmed, createdAt: new Date().toISOString() });
      persistWorkspaces();
      await loadWorkspace(trimmed);
      render();
      renderWsControls();
      setStatus(`Created workspace "${trimmed}"`);
      return true;
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
      const newOpt = document.createElement("option");
      newOpt.value = "__new_workspace__";
      newOpt.textContent = "+ New workspace";
      wsSelect.append(newOpt);
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
              chrome.storage.local.remove([wsMsgKey(w.name), wsShotsKey(w.name), wsShotsFullKey(w.name), wsSnapshotsKey(w.name)]).catch(() => {});
            if (activeWs === w.name)
              await loadWorkspace(workspaces[0].name);
            render();
          });
          li.append(del);
        }
        wsList.append(li);
      }
      renderWsSnapshotHistory();
    };
    const renderWsSnapshotHistory = () => {
      const host = document.querySelector("[data-ws-snapshots]");
      if (!host)
        return;
      host.innerHTML = "";
      if (!wsSnapshots.length) {
        host.hidden = true;
        return;
      }
      host.hidden = false;
      const head = document.createElement("div");
      head.className = "ws-snap-head";
      head.textContent = `Snapshot history · ${wsSnapshots.length}`;
      head.dataset.tip = "Restorable snapshots saved before each Clear-all";
      host.append(head);
      const ul = document.createElement("ul");
      ul.className = "ws-snap-list";
      for (const snap of wsSnapshots) {
        const li = document.createElement("li");
        const meta = document.createElement("span");
        meta.className = "ws-snap-meta";
        meta.textContent = `${new Date(snap.ts).toLocaleString()} · ${snap.selectors} sel · ${snap.comments} cmt`;
        li.append(meta);
        const restore2 = document.createElement("button");
        restore2.type = "button";
        restore2.className = "ws-snap-restore";
        restore2.textContent = "Restore";
        restore2.dataset.tip = "Restore this snapshot into the current workspace (current state is kept on the undo stack)";
        restore2.addEventListener("click", (e) => {
          e.stopPropagation();
          if (messages.length && !confirm("Restore this snapshot? The current captures will be replaced (undoable)."))
            return;
          restoreWorkspaceSnapshot(snap.id);
        });
        li.append(restore2);
        const del = document.createElement("button");
        del.type = "button";
        del.className = "danger ws-snap-del";
        del.dataset.tip = "Delete this snapshot";
        del.setAttribute("aria-label", "Delete snapshot");
        del.innerHTML = PG_ICONS.svgString("trash-2", 12);
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteWorkspaceSnapshot(snap.id);
        });
        li.append(del);
        ul.append(li);
      }
      host.append(ul);
    };
    wsSelect?.addEventListener("change", async (e) => {
      const value = e.target.value;
      if (value === "__new_workspace__") {
        renderWsControls();
        const name = (window.prompt("New workspace name") ?? "").trim();
        if (name)
          await createWorkspaceFlow(name);
        return;
      }
      await loadWorkspace(value);
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
          createWorkspaceFlow(name).then((ok) => {
            if (ok)
              wsName.value = "";
          });
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        openFind();
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
        if (findBar && !findBar.hidden) {
          closeFind();
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
        if (searchQuery)
          closeFind();
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
        onPageSnapshot,
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
          if (q) {
            openFind();
            if (findInput)
              findInput.value = q;
            applyFind(q);
          } else
            closeFind();
        },
        openFind,
        closeFind,
        isFindOpen: () => Boolean(findBar && !findBar.hidden),
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
        switchWorkspace: (n) => loadWorkspace(n).then(render),
        clearAll: onClear,
        listSnapshots: () => wsSnapshots.map((s) => ({ id: s.id, ts: s.ts, selectors: s.selectors, comments: s.comments })),
        restoreSnapshot: (id) => restoreWorkspaceSnapshot(id)
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

//# debugId=7BDFAFFDB14D4B8464756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fVxuICAvLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIG1ldGFkYXRhIGZvciBvbmUgZGlzdGluY3QgcGFnZSAoVVJMKS4gRW1pdHRlZCBhdFxuICAvLyBtb3N0IG9uY2UgcGVyIFVSTCAodGhlIGNvbnRlbnQgc2NyaXB0IGRlZHVwZXMpLiBUaGUgcGFuZWwgY2FuIHN0YXNoIHRoZXNlXG4gIC8vIGFzIHBhZ2UtbGV2ZWwgY29udGV4dCAvIGV4cG9ydCB0aGVtIGFsb25nc2lkZSBlbGVtZW50IHNob3RzLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdCc7IHBheWxvYWQ6IFBhZ2VTbmFwc2hvdH07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9DcyA9XG4gIHwge2tpbmQ6ICdvdXRsaW5lJzsgc2VsZWN0b3I6IHN0cmluZzsgZ29sZD86IGJvb2xlYW47IGRhc2hlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ31cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGknOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9XG4gIHwge2tpbmQ6ICdzY3JvbGwtdG8nOyBzZWxlY3Rvcjogc3RyaW5nOyBzdGlja3k/OiBib29sZWFufVxuICB8IHtraW5kOiAnc3RpY2t5LWNsZWFyJ31cbiAgLy8gT25lLXNob3QgbG9jYXRvciBhbmltYXRpb246IHNjcm9sbCBpbnRvIHZpZXcgKyB0aHJlZSBwdWxzaW5nIHJpbmdzLlxuICAvLyBEaXN0aW5jdCBmcm9tIGBvdXRsaW5lYCAoc3VidGxlIGhvdmVyIHJpbmcpIGFuZCBgc2Nyb2xsLXRvYCAoc2lsZW50XG4gIC8vIHJlY2VudGVyKSBzbyB0aGUgc2lkZSBwYW5lbCBMb2NhdGUgYnV0dG9uIGNhbiByZXF1ZXN0IHNvbWV0aGluZyB1c2Vyc1xuICAvLyBjYW4gYWN0dWFsbHkgZmluZCBvbiBhIGJ1c3kgcGFnZS5cbiAgfCB7a2luZDogJ2xvY2F0ZS1mbGFzaCc7IHNlbGVjdG9yOiBzdHJpbmd9XG4gIHwge2tpbmQ6ICd2YWxpZGF0ZSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdsb2ctZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdyZWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnY2FwdHVyZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIC8vIE91dGxpbmUgdGhlIE50aCBhbmNlc3RvciBvZiBgc2VsZWN0b3JgIHdpdGhvdXQgY2FwdHVyaW5nIGl0IOKAlCB1c2VkIGJ5XG4gIC8vIGhvdmVyIG9uIGFuY2VzdG9yIGJyZWFkY3J1bWIgY2hpcHMgaW4gdGhlIHNpZGUgcGFuZWwgc28gdGhlIHVzZXJcbiAgLy8gcHJldmlld3Mgd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjbGlja2luZy5cbiAgfCB7a2luZDogJ291dGxpbmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICB8IHtraW5kOiAnYWx0LXN0YXRlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdtYW51YWwtY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uJzsgc2VsZWN0b3I6IHN0cmluZzsgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9XG4gIHwge2tpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfVxuICB8IHtraW5kOiAnc2V0LWNhcHR1cmVkJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ3NldC1jcy1wcmVmcyc7IHNwYWNpbmdPdmVybGF5PzogYm9vbGVhbjsgaG92ZXJTbmFwPzogYm9vbGVhbn1cbiAgLy8gU2NyZWVuc2hvdC10aW1lIG92ZXJsYXkgdG9nZ2xlcy4gVGhlIGJhY2tncm91bmQgYXNrcyB0aGUgY29udGVudCBzY3JpcHRcbiAgLy8gdG8gaGlkZSBpdHMgc2hhZG93LXJvb3QgY2hyb21lIChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIGJlZm9yZVxuICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlcywgdGhlbiByZXN0b3JlcyB2aXNpYmlsaXR5IG9uY2UgdGhlIFBORyBpcyBiYWNrLlxuICB8IHtraW5kOiAnaGlkZS1vdmVybGF5cyd9XG4gIHwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ307XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25QYXlsb2FkID0ge1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLy8gVGhlIGNhcHR1cmVkIGVudHJ5J3Mgc3RhYmxlIHVpZC4gVGhlIGNvbnRlbnQgc2NyaXB0IG5lZWRzIHRoaXMgc29cbiAgLy8gaXRzIG9uLXBhZ2UgY29tbWVudCBib3ggY2FuIHJvdXRlIHRoZSBjb21tZW50IHRvIHRoZSAqc3BlY2lmaWMqXG4gIC8vIGNhcHR1cmUgcmF0aGVyIHRoYW4gdG8gXCJhbnkgc2VsZWN0b3IgdGhhdCBtYXRjaGVzLlwiIFByZXZlbnRzXG4gIC8vIGNyb3NzLWNvbnRhbWluYXRpb24gd2hlbiB0d28gY2FwdHVyZXMgc2hhcmUgYSBzZWxlY3RvciBhY3Jvc3NcbiAgLy8gcGFnZXMgb3IgdHdvIHNpYmxpbmcgZWxlbWVudHMgc2hhcmUgYSB0ZXN0SWQuXG4gIHVpZD86IHN0cmluZztcbiAgbj86IG51bWJlcjtcbiAgY2FwdHVyZWQ/OiBib29sZWFuO1xuICBmZWVkYmFjaz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0JnID1cbiAgfCB7a2luZDogJ2NhcHR1cmUtc2NyZWVuc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc3dpdGNoLXRvLXRhYic7IHVybDogc3RyaW5nOyBvcGVuSWZNaXNzaW5nPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2xpc3Qtb3Blbi10YWJzJ31cbiAgfCB7a2luZDogJ3Nob3QtZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1ncm91cCc7IHNlbGVjdG9yczogc3RyaW5nW107IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1wYWdlJzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIEZ1bGwtcGFnZSAoYmVzdC1lZmZvcnQpIHNjcmVlbnNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFVubGlrZVxuICAvLyBzaG90LXBhZ2UgdGhpcyBkb2VzIE5PVCB3cml0ZSBhIGZpbGUgb3IgYnVpbGQgYSB0aHVtYm5haWwg4oCUIGl0IGp1c3RcbiAgLy8gcmV0dXJucyB0aGUgc3RpdGNoZWQgUE5HIGFzIGEgZGF0YSBVUkwgc28gdGhlIGNhbGxlciAoY29udGVudCBzY3JpcHQpIGNhblxuICAvLyBhdHRhY2ggaXQgdG8gYSBQYWdlU25hcHNob3QuIGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnRcbiAgLy8gY291bGQgYmUgY2FwdHVyZWQuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbi8vIFJlcGx5IHRvIGEgYHBhZ2Utc25hcHNob3Qtc2hvdGAgcmVxdWVzdC4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMIG9mXG4vLyB0aGUgKGJlc3QtZWZmb3J0KSBmdWxsIHBhZ2U7IGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnQgd2FzXG4vLyBjYXB0dXJlZC4gYG9rOmZhbHNlYCBjYXJyaWVzIGFuIGVycm9yIHN0cmluZy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgc2NyZWVuc2hvdD86IHN0cmluZztcbiAgcGFydGlhbD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5XG4gIHwgUGFnZVNuYXBzaG90UmVwbHk7XG5cbi8vIOKUgOKUgOKUgCBFeHBvcnQgc2hhcGVzICh2Mikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBNYW5pZmVzdCBsaW5lIGVtaXR0ZWQgYXMgdGhlIHZlcnkgZmlyc3QgSlNPTkwgbGluZS4gQ2FycmllcyB0aGUgbWV0YWRhdGFcbi8vIG5lY2Vzc2FyeSB0byByZXN5bmMgYSBkb3dubG9hZGVkIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlICsgdG9vbGluZy5cbmV4cG9ydCB0eXBlIEV4cG9ydE1hbmlmZXN0ID0ge1xuICB2OiAyO1xuICB0eXBlOiAnbWFuaWZlc3QnO1xuICB0czogc3RyaW5nOyAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgZXhwb3J0IHdhcyBnZW5lcmF0ZWRcbiAgZ2VuZXJhdGVkOiBudW1iZXI7IC8vIGVwb2NoIG1zIChtaXJyb3Igb2YgdHMgaW4gbWFjaGluZS1yZWFkYWJsZSBmb3JtKVxuICB0b29sOiAncGluY2hncmFiJztcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGZvcm1hdDogJ2pzb25sJyB8ICdtYXJrZG93bicgfCAndGFyLnpzdCc7XG4gIGhvc3RzOiBzdHJpbmdbXTtcbiAgLy8gQW1iaWd1b3VzIHRvdGFscy4gVGhlIHByZXZpb3VzIGBzZWxlY3RvcnMgLyBmZWVkYmFjayAvIHBhZ2VzYFxuICAvLyB0cmlwbGUgZGlkbid0IHNheSB3aGV0aGVyIG5lc3RlZFxuICAvLyBncm91cCBtZW1iZXJzIHdlcmUgY291bnRlZCwgd2hldGhlciBmZWVkYmFjay1iZWFyaW5nIHBhcmVudHMgd2VyZVxuICAvLyBhIHN1YnNldCwgb3IgaG93IHNjcmVlbnNob3RzIHdlcmUgdGFsbGllZC4gVGhlIGV4cGFuZGVkIHNoYXBlXG4gIC8vIGJlbG93IG5hbWVzIGV2ZXJ5IGNhdGVnb3J5IGV4cGxpY2l0bHkgc28gYSBkb3duc3RyZWFtIGFnZW50IGNhblxuICAvLyB0ZWxsIGV4YWN0bHkgd2hhdCdzIGluIHRoZSBidW5kbGUuXG4gIGNvdW50czoge1xuICAgIC8vIFRvcC1sZXZlbCBzZWxlY3RvciByb3dzIGluIHRoZSBKU09OTCBzdHJlYW0gKGV4Y2x1ZGVzIG5lc3RlZFxuICAgIC8vIGdyb3VwIG1lbWJlcnMsIGJ1dCB0aGUgYGdyb3VwTWVtYmVyc2AgZmllbGQgY291bnRzIHRob3NlKS5cbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBmZWVkYmFjazogbnVtYmVyO1xuICAgIHBhZ2VzOiBudW1iZXI7XG4gICAgLy8gTnVtYmVyIG9mIHNlbGVjdG9yIHJvd3MgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBjaGlsZC5cbiAgICAvLyBVc2VmdWwgZm9yIFwic2hvdyBtZSBvbmx5IHRoZSBpdGVtcyB3aXRoIGNvbW1lbnRzXCIuXG4gICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9ycyB0aGF0IHNoaXAgdW5kZXIgYSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYCBhcnJheVxuICAgIC8vIHJhdGhlciB0aGFuIGFzIHRoZWlyIG93biB0b3AtbGV2ZWwgcm93LlxuICAgIGdyb3VwTWVtYmVycz86IG51bWJlcjtcbiAgICAvLyBTY3JlZW5zaG90IGludmVudG9yeSAoY291bnRlZCBieSBmaWxlLCBkZWR1cGVkKS5cbiAgICBzY3JlZW5zaG90c0VsZW1lbnQ/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNHcm91cD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c1BhZ2U/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3Igcm93cyB0aGF0IHNob3VsZCBoYXZlIGFuIGVsZW1lbnQgc2NyZWVuc2hvdCBidXQgZG9uJ3RcbiAgICAvLyAocG9zdC1idWctIzIgZm9yY2VkIHNob290IG1heSBzdGlsbCBmYWlsKS4gUmVwYWlyIGFnZW50cyBjYW5cbiAgICAvLyBza2lwIHRoZXNlIG9yIHJlcXVlc3QgYSByZS1jYXB0dXJlLlxuICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90PzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2hvc2UgcGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbnkgc2VsZWN0b3JcbiAgICAvLyBpbiB0aGlzIGFyY2hpdmUuIFNob3VsZCBhbHdheXMgYmUgMDsgbm9uLXplcm8gbWVhbnMgdGhlIGV4cG9ydFxuICAgIC8vIGdvdCB0cnVuY2F0ZWQgb3IgYSBwYXJlbnQgd2FzIGRlbGV0ZWQgYmV0d2VlbiBjYXB0dXJlICsgZW1pdC5cbiAgICBvcnBoYW5lZEZlZWRiYWNrPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBTdWJzZXQgb2YgbHVjaWRlLmRldiBpY29ucyBpbmxpbmVkIGFzIFNWRyBpbm5lci1tYXJrdXAuXG4vLyBFYWNoIGVudHJ5IGlzIHRoZSBib2R5IG9mIDxzdmcgLi4uID4gLi4uIDwvc3ZnPjsgc3ZnU3RyaW5nKCkgd3JhcHMgaXQuXG4vLyBTaXplcyBkZWZhdWx0IHRvIDE2OyBvdmVycmlkZSB3aXRoIHRoZSBzaXplIGFyZ3VtZW50LlxuLy9cbi8vIE1JVCDigJQgaHR0cHM6Ly9naXRodWIuY29tL2x1Y2lkZS1pY29ucy9sdWNpZGVcblxuY29uc3QgSUNPTlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjaGV2cm9uLXJpZ2h0JzogJzxwYXRoIGQ9XCJtOSAxOCA2LTYtNi02XCIvPicsXG4gICdjaGV2cm9uLWRvd24nOiAnPHBhdGggZD1cIm02IDkgNiA2IDYtNlwiLz4nLFxuICBjb3B5OiAnPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgeD1cIjhcIiB5PVwiOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTQgMTZjLTEuMSAwLTItLjktMi0yVjRjMC0xLjEuOS0yIDItMmgxMGMxLjEgMCAyIC45IDIgMlwiLz4nLFxuICBwZW5jaWw6ICc8cGF0aCBkPVwiTTIxLjE3NCA2LjgxMmExIDEgMCAwIDAtMy45ODYtMy45ODdMMy44NDIgMTYuMTc0YTIgMiAwIDAgMC0uNS44M2wtMS4zMjEgNC4zNTJhLjUuNSAwIDAgMCAuNjIzLjYyMmw0LjM1My0xLjMyYTIgMiAwIDAgMCAuODMtLjQ5N3pcIi8+PHBhdGggZD1cIm0xNSA1IDQgNFwiLz4nLFxuICAndHJhc2gtMic6ICc8cGF0aCBkPVwiTTMgNmgxOFwiLz48cGF0aCBkPVwiTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNlwiLz48cGF0aCBkPVwiTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeDI9XCIxMFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB4Mj1cIjE0XCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+JyxcbiAgcGx1czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz48cGF0aCBkPVwiTTEyIDV2MTRcIi8+JyxcbiAgeDogJzxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPicsXG4gIG1pbnVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPicsXG4gIHNlYXJjaDogJzxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiLz48cGF0aCBkPVwibTIxIDIxLTQuMy00LjNcIi8+JyxcbiAgZG93bmxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjcgMTAgMTIgMTUgMTcgMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjE1XCIgeTI9XCIzXCIvPicsXG4gIHVwbG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTcgOCAxMiAzIDcgOFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiM1wiIHkyPVwiMTVcIi8+JyxcbiAgZ2l0aHViOiAnPHBhdGggZD1cIk0xNSAyMnYtNGE0LjggNC44IDAgMCAwLTEtMy41YzMgMCA2LTIgNi01LjUuMDgtMS4yNS0uMjctMi40OC0xLTMuNS4yOC0xLjE1LjI4LTIuMzUgMC0zLjUgMCAwLTEgMC0zIDEuNS0yLjY0LS41LTUuMzYtLjUtOCAwQzYgMiA1IDIgNSAyYy0uMyAxLjE1LS4zIDIuMzUgMCAzLjVBNS40IDUuNCAwIDAgMCA0IDljMCAzLjUgMyA1LjUgNiA1LjUtLjM5LjQ5LS42OCAxLjA1LS44NSAxLjY1LS4xNy42LS4yMiAxLjIzLS4xNSAxLjg1djRcIi8+PHBhdGggZD1cIk05IDE4Yy00LjUxIDItNS0yLTctMlwiLz4nLFxuICBzdGFyOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiLz4nLFxuICAnY2lyY2xlLWRvdCc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgY3Jvc3NoYWlyOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjIyXCIgeDI9XCIxOFwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiNlwiIHgyPVwiMlwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI2XCIgeTI9XCIyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIyMlwiIHkyPVwiMThcIi8+JyxcbiAgdGFyZ2V0OiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjZcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIyXCIvPicsXG4gICdwYW5lbC1sZWZ0LWNsb3NlJzogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIi8+PHBhdGggZD1cIk05IDN2MThcIi8+PHBhdGggZD1cIm0xNiAxNS0zLTMgMy0zXCIvPicsXG4gICdleHRlcm5hbC1saW5rJzogJzxwYXRoIGQ9XCJNMTUgM2g2djZcIi8+PHBhdGggZD1cIk0xMCAxNCAyMSAzXCIvPjxwYXRoIGQ9XCJNMTggMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNlwiLz4nLFxuICAnbWVzc2FnZS1zcXVhcmUtcGx1cyc6ICc8cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48bGluZSB4MT1cIjlcIiB4Mj1cIjE1XCIgeTE9XCIxMFwiIHkyPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjdcIiB5Mj1cIjEzXCIvPicsXG4gICdhbGVydC1jaXJjbGUnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiOFwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTIuMDFcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICAncmVmcmVzaC1jdyc6ICc8cGF0aCBkPVwiTTMgMTJhOSA5IDAgMCAxIDE1LTYuN0wyMSA4XCIvPjxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPjxwYXRoIGQ9XCJNMjEgMTJhOSA5IDAgMCAxLTE1IDYuN0wzIDE2XCIvPjxwYXRoIGQ9XCJNMyAyMXYtNWg1XCIvPicsXG4gICdmaWxlLXRleHQnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxM1wiIHkyPVwiMTNcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTdcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjhcIiB5MT1cIjlcIiB5Mj1cIjlcIi8+JyxcbiAgJ2ZpbGUtY29kZSc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxwYXRoIGQ9XCJtMTAgMTMtMiAyIDIgMlwiLz48cGF0aCBkPVwibTE0IDE3IDItMi0yLTJcIi8+JyxcbiAgaW1hZ2U6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCI5XCIgcj1cIjJcIi8+PHBhdGggZD1cIm0yMSAxNS0zLjA4Ni0zLjA4NmEyIDIgMCAwIDAtMi44MjggMEw2IDIxXCIvPicsXG4gIC8vIFN0eWxpc2VkIFwicGluY2hcIiDigJQgdHdvIG9wcG9zaW5nIGN1cnZlcyBtZWV0aW5nIGF0IGEgY2VudGVyIGRvdC5cbiAgcGluY2g6ICc8cGF0aCBkPVwiTTUgNWMzIDIgNSA0IDcgNy0yIDMtNCA1LTcgN1wiLz48cGF0aCBkPVwiTTE5IDVjLTMgMi01IDQtNyA3IDIgMyA0IDUgNyA3XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMS41XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICAnc3Rhci1maWxsZWQnOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgcGluOiAnPHBhdGggZD1cIk0xMiAxN3Y1XCIvPjxwYXRoIGQ9XCJNOSAxMC43NmEyIDIgMCAwIDEtMS4xMSAxLjc5bC0xLjc4LjlBMiAyIDAgMCAwIDUgMTUuMjRWMTZhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xdi0uNzZhMiAyIDAgMCAwLTEuMTEtMS43OWwtMS43OC0uOUEyIDIgMCAwIDEgMTUgMTAuNzZWN2ExIDEgMCAwIDEgMS0xIDIgMiAwIDAgMCAwLTRIOGEyIDIgMCAwIDAgMCA0IDEgMSAwIDAgMSAxIDF6XCIvPicsXG4gIHVuZG86ICc8cGF0aCBkPVwiTTMgN3Y2aDZcIi8+PHBhdGggZD1cIk0yMSAxN2E5IDkgMCAwIDAtMTUtNi43TDMgMTNcIi8+JyxcbiAgcmVkbzogJzxwYXRoIGQ9XCJNMjEgN3Y2aC02XCIvPjxwYXRoIGQ9XCJNMyAxN2E5IDkgMCAwIDEgMTUtNi43TDIxIDEzXCIvPicsXG4gIGZvbGRlcjogJzxwYXRoIGQ9XCJNMjAgMjBhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJoLTcuOTNhMiAyIDAgMCAxLTEuNjYtLjlsLS44Mi0xLjJBMiAyIDAgMCAwIDcuOTMgM0g0YTIgMiAwIDAgMC0yIDJ2MTNhMiAyIDAgMCAwIDIgMlpcIi8+JyxcbiAgY2hlY2s6ICc8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIi8+JyxcbiAgJ2NpcmNsZS1jaGVjayc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtOSAxMiAyIDIgNC00XCIvPicsXG4gIGdyaXA6ICc8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTlcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjE5XCIgcj1cIjFcIi8+JyxcbiAgc2V0dGluZ3M6ICc8cGF0aCBkPVwiTTEyLjIyIDJoLS40NGEyIDIgMCAwIDAtMiAydi4xOGEyIDIgMCAwIDEtMSAxLjczbC0uNDMuMjVhMiAyIDAgMCAxLTIgMGwtLjE1LS4wOGEyIDIgMCAwIDAtMi43My43M2wtLjIyLjM4YTIgMiAwIDAgMCAuNzMgMi43M2wuMTUuMWEyIDIgMCAwIDEgMSAxLjcydi41MWEyIDIgMCAwIDEtMSAxLjc0bC0uMTUuMDlhMiAyIDAgMCAwLS43MyAyLjczbC4yMi4zOGEyIDIgMCAwIDAgMi43My43M2wuMTUtLjA4YTIgMiAwIDAgMSAyIDBsLjQzLjI1YTIgMiAwIDAgMSAxIDEuNzNWMjBhMiAyIDAgMCAwIDIgMmguNDRhMiAyIDAgMCAwIDItMnYtLjE4YTIgMiAwIDAgMSAxLTEuNzNsLjQzLS4yNWEyIDIgMCAwIDEgMiAwbC4xNS4wOGEyIDIgMCAwIDAgMi43My0uNzNsLjIyLS4zOWEyIDIgMCAwIDAtLjczLTIuNzNsLS4xNS0uMDhhMiAyIDAgMCAxLTEtMS43NHYtLjVhMiAyIDAgMCAxIDEtMS43NGwuMTUtLjA5YTIgMiAwIDAgMCAuNzMtMi43M2wtLjIyLS4zOGEyIDIgMCAwIDAtMi43My0uNzNsLS4xNS4wOGEyIDIgMCAwIDEtMiAwbC0uNDMtLjI1YTIgMiAwIDAgMS0xLTEuNzNWNGEyIDIgMCAwIDAtMi0yelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+JyxcbiAgaW5mbzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xMiAxNnYtNFwiLz48cGF0aCBkPVwiTTEyIDhoLjAxXCIvPicsXG4gIC8vIFRyZWUtb2Ytcm93cyDigJQgdXNlZCBmb3IgXCJTcGxpdCBncm91cFwiIGFjdGlvbiAoZGVub3RlcyBvbmUgbm9kZSBmYW5uaW5nXG4gIC8vIG91dCBpbnRvIHNpYmxpbmdzKS4gTHVjaWRlJ3MgYGxpc3QtdHJlZWAuXG4gICdsaXN0LXRyZWUnOiAnPHBhdGggZD1cIk0yMSAxMmgtOFwiLz48cGF0aCBkPVwiTTIxIDZIOFwiLz48cGF0aCBkPVwiTTIxIDE4aC04XCIvPjxwYXRoIGQ9XCJNMyA2djRjMCAxLjEuOSAyIDIgMmgzXCIvPjxwYXRoIGQ9XCJNMyAxMHY2YzAgMS4xLjkgMiAyIDJoM1wiLz4nLFxuICAvLyBHZW5lcmljIHNwbGl0IGljb24gYXMgYSBmYWxsYmFjayBvcHRpb24uXG4gIHNwbGl0OiAnPHBhdGggZD1cIk0xNiAzaDV2NVwiLz48cGF0aCBkPVwiTTggM0gzdjVcIi8+PHBhdGggZD1cIm0yMSAzLTcuNDYgNy40NmEyIDIgMCAwIDAgMCAyLjgzTDIxIDIxXCIvPjxwYXRoIGQ9XCJNMyAzbDcuNDYgNy40NmEyIDIgMCAwIDEgMCAyLjgzTDMgMjFcIi8+JyxcbiAgLy8gQ2FyZGJvYXJkLXN0eWxlIGJveCB1c2VkIGZvciBcIkV4cG9ydCB3b3Jrc3BhY2UgYXMgWklQXCIuXG4gIHBhY2thZ2U6ICc8cGF0aCBkPVwibTcuNSA0LjI3IDkgNS4xNVwiLz48cGF0aCBkPVwiTTIxIDhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2WlwiLz48cGF0aCBkPVwiTTMuMyA3IDEyIDEybDguNy01XCIvPjxwYXRoIGQ9XCJNMTIgMjJWMTJcIi8+JyxcbiAgLy8gVHdvIGludGVybG9ja2luZyBsaW5rcyDigJQgdXNlZCBmb3IgXCJDb3B5IGFzIHBhdGhcIi5cbiAgbGluazogJzxwYXRoIGQ9XCJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwiTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxXCIvPicsXG4gIC8vIERhdGFiYXNlL2R1Y2sgaWNvbiBmb3IgdGhlIER1Y2tEQiBwYWxldHRlIGNvbW1hbmQuXG4gIGRhdGFiYXNlOiAnPGVsbGlwc2UgY3g9XCIxMlwiIGN5PVwiNVwiIHJ4PVwiOVwiIHJ5PVwiM1wiLz48cGF0aCBkPVwiTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNVwiLz48cGF0aCBkPVwiTTMgMTJBOSAzIDAgMCAwIDIxIDEyXCIvPicsXG59O1xuXG5jb25zdCB3cmFwID0gKGJvZHk6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPiR7Ym9keX08L3N2Zz5gO1xuXG5leHBvcnQgY29uc3QgUEdfSUNPTlMgPSB7XG4gIGhhczogKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4gbmFtZSBpbiBJQ09OUyxcbiAgc3ZnU3RyaW5nOiAobmFtZTogc3RyaW5nLCBzaXplID0gMTYpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBJQ09OU1tuYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2x1Y2lkZV0gbWlzc2luZyBpY29uJywgbmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiB3cmFwKGJvZHksIHNpemUpO1xuICB9LFxuICBtb3VudDogKGVsOiBFbGVtZW50IHwgbnVsbCwgbmFtZTogc3RyaW5nLCBzaXplPzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKGVsKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gIH0sXG59O1xuXG4vLyBTaWRlLWVmZmVjdCBmb3IgbGVnYWN5IHNjcmlwdC10YWcgaW5jbHVzaW9uIChzaWRlcGFuZWwuaHRtbCBzdGlsbCA8c2NyaXB0XG4vLyBzcmM9XCJsdWNpZGUuanNcIj4g4oCUIHByZS1idW5kbGUpLiBSZS1leHBvc2VzIHRoZSByZWdpc3RyeSBvbiBnbG9iYWxUaGlzLlxuaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBHX0lDT05TID0gUEdfSUNPTlM7XG59XG4iLAogICAgIi8vIFVTVEFSLWZvcm1hdCB0YXIgZW5jb2Rlci4gRWFjaCBlbnRyeSBpcyBhIDUxMi1ieXRlIGhlYWRlciBmb2xsb3dlZCBieVxuLy8gY29udGVudCBieXRlcyBwYWRkZWQgdXAgdG8gdGhlIG5leHQgNTEyLWJ5dGUgYm91bmRhcnkuIFRoZSBhcmNoaXZlIGVuZHNcbi8vIHdpdGggdHdvIHplcm8tZmlsbGVkIDUxMi1ieXRlIGJsb2Nrcy4gfjgwIGxpbmVzLCBubyBkZXBlbmRlbmNpZXMuXG4vL1xuLy8gV2UgcGljayB0YXIgKHJhdGhlciB0aGFuIHppcCkgYmVjYXVzZSB6c3RkIGlzIHRoZSB3aXJlIGZvcm1hdCB3ZSB3YW50IHRvXG4vLyBwYWlyIGl0IHdpdGggYW5kIHRhci56c3QgaXMgdGhlIHN0YW5kYXJkIGNvbWJvICh6aXAgaXMgaXRzIG93blxuLy8gY29tcHJlc3Npb24gY29udGFpbmVyKS4gRm9yIGZpbGVzIHdpdGggcGF0aHMgbG9uZ2VyIHRoYW4gMTAwIGNoYXJzIHdlXG4vLyB0aHJvdyByYXRoZXIgdGhhbiBpbXBsZW1lbnQgdGhlIEdOVS9QQVggbG9uZy1uYW1lIGV4dGVuc2lvbnMg4oCUIHRoZVxuLy8gUGluY2hHcmFiIGFyY2hpdmUgbGF5b3V0IHVzZXMgc2hvcnQgcGF0aHMgb25seS5cblxuY29uc3QgZW5jID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmNvbnN0IHdyaXRlT2N0YWwgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgLy8gdGFyIGZpZWxkcyBhcmUgemVyby1wYWRkZWQgbnVsbC10ZXJtaW5hdGVkIG9jdGFsIHN0cmluZ3MuXG4gIGxldCBzID0gdmFsdWUudG9TdHJpbmcoOCk7XG4gIHMgPSBzLnBhZFN0YXJ0KGxlbmd0aCAtIDEsICcwJyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIC0gMTsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBzLmNoYXJDb2RlQXQoaSk7XG4gIGJ1ZltvZmZzZXQgKyBsZW5ndGggLSAxXSA9IDA7XG59O1xuXG5jb25zdCB3cml0ZUFzY2lpID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHN0cjogc3RyaW5nLCBsZW5ndGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICBjb25zdCBieXRlcyA9IGVuYy5lbmNvZGUoc3RyKTtcbiAgY29uc3QgbGVuID0gTWF0aC5taW4oYnl0ZXMubGVuZ3RoLCBsZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXSE7XG59O1xuXG5jb25zdCBoZWFkZXJDaGVja3N1bSA9IChoZWFkZXI6IFVpbnQ4QXJyYXkpOiBudW1iZXIgPT4ge1xuICAvLyBUaGUgY2hlY2tzdW0gZmllbGQgKDggYnl0ZXMgYXQgb2Zmc2V0IDE0OCkgaXMgdHJlYXRlZCBhcyBBU0NJSSBzcGFjZXNcbiAgLy8gZHVyaW5nIGNvbXB1dGF0aW9uLCB0aGVuIHRoZSBhY3R1YWwgY2hlY2tzdW0gaXMgd3JpdHRlbiBpbnRvIGl0LlxuICBsZXQgc3VtID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MTI7IGkrKykge1xuICAgIGlmIChpID49IDE0OCAmJiBpIDwgMTU2KSBzdW0gKz0gMHgyMDtcbiAgICBlbHNlIHN1bSArPSBoZWFkZXJbaV0gPz8gMDtcbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuZXhwb3J0IHR5cGUgVGFyRW50cnkgPSB7XG4gIG5hbWU6IHN0cmluZztcbiAgZGF0YTogVWludDhBcnJheSB8IHN0cmluZztcbiAgbXRpbWU/OiBudW1iZXI7IC8vIHVuaXggZXBvY2ggc2Vjb25kczsgZGVmYXVsdHMgdG8gbm93XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRUYXIgPSAoZW50cmllczogVGFyRW50cnlbXSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBjb25zdCBub3dTZWMgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlbnRyeS5kYXRhID09PSAnc3RyaW5nJyA/IGVuYy5lbmNvZGUoZW50cnkuZGF0YSkgOiBlbnRyeS5kYXRhO1xuICAgIGNvbnN0IG5hbWUgPSBlbnRyeS5uYW1lO1xuICAgIGlmIChuYW1lLmxlbmd0aCA+IDEwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0YXI6IGZpbGVuYW1lIHRvbyBsb25nICgke25hbWUubGVuZ3RofSA+IDEwMCBjaGFycyk6ICR7bmFtZX1gKTtcbiAgICB9XG4gICAgY29uc3QgaGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMCwgbmFtZSwgMTAwKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTAwLCAwbzY0NCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vZGVcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTA4LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMTYsIDAsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2lkXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEyNCwgZGF0YS5sZW5ndGgsIDEyKTsgICAgICAgICAgICAgICAgICAvLyBzaXplXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEzNiwgZW50cnkubXRpbWUgPz8gbm93U2VjLCAxMik7ICAgICAgICAvLyBtdGltZVxuICAgIGZvciAobGV0IGkgPSAxNDg7IGkgPCAxNTY7IGkrKykgaGVhZGVyW2ldID0gMHgyMDsgICAgICAgICAgLy8gY2hlY2tzdW0gcGxhY2Vob2xkZXJcbiAgICBoZWFkZXJbMTU2XSA9IDB4MzA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHR5cGVmbGFnICcwJyA9IHJlZ3VsYXIgZmlsZVxuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAyNTcsICd1c3RhcicsIDYpOyAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjYzLCAnMDAnLCAyKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZlcnNpb25cbiAgICAvLyB1bmFtZS9nbmFtZS9kZXZtYWpvci9kZXZtaW5vci9wcmVmaXggYWxsIGxlZnQgemVyby5cblxuICAgIGNvbnN0IGNoZWNrc3VtID0gaGVhZGVyQ2hlY2tzdW0oaGVhZGVyKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTQ4LCBjaGVja3N1bSwgOCk7XG5cbiAgICBibG9ja3MucHVzaChoZWFkZXIpO1xuICAgIGJsb2Nrcy5wdXNoKGRhdGEpO1xuICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoZGF0YS5sZW5ndGggJSA1MTIpKSAlIDUxMjtcbiAgICBpZiAocGFkKSBibG9ja3MucHVzaChuZXcgVWludDhBcnJheShwYWQpKTtcbiAgfVxuICAvLyBUcmFpbGVyOiB0d28gY29uc2VjdXRpdmUgNTEyLWJ5dGUgemVybyBibG9ja3MuXG4gIGJsb2Nrcy5wdXNoKG5ldyBVaW50OEFycmF5KDEwMjQpKTtcblxuICBsZXQgdG90YWwgPSAwO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgeyBvdXQuc2V0KGIsIG9mZnNldCk7IG9mZnNldCArPSBiLmxlbmd0aDsgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8g4pSA4pSA4pSAIFpzdGQgcmF3LWJsb2NrIGZyYW1lIHdyaXRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vXG4vLyBDb21wcmVzc2lvblN0cmVhbSgnenN0ZCcpIGlzbid0IHNoaXBwZWQgaW4gY3VycmVudCBDaHJvbWl1bSAodmVyaWZpZWQgdmlhXG4vLyBydW50aW1lIHByb2JlKSwgc28gd2Ugd3JpdGUgYSB2YWxpZCB6c3RkIGZyYW1lIGNvbnRhaW5pbmcgb25lIG9yIG1vcmVcbi8vIHJhdyAodW5jb21wcmVzc2VkKSBibG9ja3MuIFRoZSBvdXRwdXQgaXMgc3RydWN0dXJhbGx5IGEgcmVhbCBgLnRhci56c3RgXG4vLyBmaWxlOiBgenN0ZCAtZGAgYWNjZXB0cyBpdCwgNy1aaXAgYWNjZXB0cyBpdCwgbGlienN0ZCBhY2NlcHRzIGl0LiBJdFxuLy8ganVzdCBkb2Vzbid0IGFjdHVhbGx5IGNvbXByZXNzIOKAlCBmb3Igb3VyIHBheWxvYWQsIHdoaWNoIGlzIG1vc3RseSBQTkdcbi8vIChhbHJlYWR5IGNvbXByZXNzZWQpIHBsdXMgYSBmZXcgS0Igb2YgSlNPTkwvTWFya2Rvd24sIHRoZSBsb3NzIHZzLiByZWFsXG4vLyBERUZMQVRFIGlzIHNpbmdsZS1kaWdpdCBwZXJjZW50LlxuLy9cbi8vIEZyYW1lIGxheW91dCAocGVyIFJGQyA4ODc4ICsgWnN0YW5kYXJkIGZvcm1hdCBzcGVjKTpcbi8vICAgbWFnaWNfbnVtYmVyICAgICAgIDQgYnl0ZXMgIDB4MjggMHhCNSAweDJGIDB4RkQgKExFOiAweEZEMkZCNTI4KVxuLy8gICBGSEQgICAgICAgICAgICAgICAgMSBieXRlICAgRkNTX3NpemU9MiAoNC1ieXRlIEZDUyksIFNpbmdsZV9TZWdtZW50PTFcbi8vICAgRkNTICAgICAgICAgICAgICAgIDQgYnl0ZXMgIHVuY29tcHJlc3NlZCBwYXlsb2FkIHNpemUgKHUzMiBMRSlcbi8vICAgYmxvY2tzICAgICAgICAgICAgIE4gYmxvY2tzIGVhY2g6IDMtYnl0ZSBoZWFkZXIgKyBwYXlsb2FkXG4vL1xuLy8gQmxvY2sgaGVhZGVyICgzIGJ5dGVzIExFKTpcbi8vICAgYml0IDAgICAgICAgTGFzdF9CbG9jayBmbGFnXG4vLyAgIGJpdHMgMS4uMiAgIEJsb2NrX1R5cGUgKDAwID0gUmF3LCAwMSA9IFJMRSwgMTAgPSBDb21wcmVzc2VkLCAxMSA9IFJlc2VydmVkKVxuLy8gICBiaXRzIDMuLjIzICBCbG9ja19TaXplIChtYXggMTI4IEtpQiBmb3IgcmF3IC8gUkxFKVxuLy9cbi8vIFdlIGNodW5rIGludG8gMTI4IEtpQiByYXcgYmxvY2tzIHRvIHJlc3BlY3QgdGhlIHBlci1ibG9jayBzaXplIGxpbWl0LlxuXG5jb25zdCBaU1REX1JBV19CTE9DS19NQVggPSAxMjggKiAxMDI0O1xuXG5leHBvcnQgY29uc3Qgd3JhcFpzdGQgPSAoZGF0YTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBsZXQgcG9zID0gMDtcbiAgd2hpbGUgKHBvcyA8IGRhdGEubGVuZ3RoIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc3QgcmVtYWluaW5nID0gZGF0YS5sZW5ndGggLSBwb3M7XG4gICAgY29uc3QgYmxvY2tTaXplID0gTWF0aC5taW4ocmVtYWluaW5nLCBaU1REX1JBV19CTE9DS19NQVgpO1xuICAgIGNvbnN0IGlzTGFzdCA9IHBvcyArIGJsb2NrU2l6ZSA+PSBkYXRhLmxlbmd0aCA/IDEgOiAwO1xuICAgIGNvbnN0IGhlYWRlckludCA9IGlzTGFzdCB8ICgwIDw8IDEpIHwgKGJsb2NrU2l6ZSA8PCAzKTsgLy8gdHlwZT1yYXc9MFxuICAgIGNvbnN0IGJsb2NrSGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgaGVhZGVySW50ICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDgpICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDE2KSAmIDB4ZmYsXG4gICAgXSk7XG4gICAgYmxvY2tzLnB1c2goYmxvY2tIZWFkZXIpO1xuICAgIGlmIChibG9ja1NpemUgPiAwKSBibG9ja3MucHVzaChkYXRhLnN1YmFycmF5KHBvcywgcG9zICsgYmxvY2tTaXplKSk7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIGJyZWFrO1xuICB9XG4gIGNvbnN0IGZjcyA9IGRhdGEubGVuZ3RoO1xuICBjb25zdCBmaGQgPSAwYjEwMTBfMDAwMDsgLy8gRkNTX3NpemU9MTAgKDQgYnl0ZXMpIHwgU2luZ2xlX1NlZ21lbnQ9MVxuICBjb25zdCBoZWFkID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgIDB4MjgsIDB4YjUsIDB4MmYsIDB4ZmQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICBmaGQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZIRFxuICAgIGZjcyAmIDB4ZmYsIChmY3MgPj4+IDgpICYgMHhmZiwgKGZjcyA+Pj4gMTYpICYgMHhmZiwgKGZjcyA+Pj4gMjQpICYgMHhmZixcbiAgXSk7XG4gIGxldCB0b3RhbCA9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2ZmID0gMDtcbiAgb3V0LnNldChoZWFkLCBvZmYpOyBvZmYgKz0gaGVhZC5sZW5ndGg7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmYpOyBvZmYgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIENvbXBhbmlvbiBkZWNvZGVyIGZvciBvdXIgb3duIHdyaXRlciDigJQgdXNlZCBieSB0ZXN0cy4gQWNjZXB0cyBhbnkgenN0ZFxuLy8gZnJhbWUgd3JpdHRlbiBieSBgd3JhcFpzdGRgIChzaW5nbGUgUmF3X0Jsb2NrIHN0cmVhbSwgNC1ieXRlIEZDUyxcbi8vIHNpbmdsZS1zZWdtZW50LCBubyBjaGVja3N1bSwgbm8gZGljdCkuIFRocm93cyBvbiBhbnl0aGluZyBlbHNlIHNvIHRlc3RzXG4vLyBmYWlsIGxvdWRseSByYXRoZXIgdGhhbiBzaWxlbnRseSBtaXMtcGFyc2UuXG5leHBvcnQgY29uc3QgdW53cmFwWnN0ZCA9IChmcmFtZTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBpZiAoZnJhbWUubGVuZ3RoIDwgOSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBmcmFtZSB0b28gc2hvcnQnKTtcbiAgaWYgKGZyYW1lWzBdICE9PSAweDI4IHx8IGZyYW1lWzFdICE9PSAweGI1IHx8IGZyYW1lWzJdICE9PSAweDJmIHx8IGZyYW1lWzNdICE9PSAweGZkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBiYWQgbWFnaWMgbnVtYmVyJyk7XG4gIH1cbiAgY29uc3QgZmhkID0gZnJhbWVbNF0hO1xuICBjb25zdCBmY3NTaXplRmxhZyA9IChmaGQgPj4+IDYpICYgMGIxMTtcbiAgY29uc3Qgc2luZ2xlU2VnbWVudCA9ICgoZmhkID4+PiA1KSAmIDEpID09PSAxO1xuICBjb25zdCBjaGVja3N1bSA9ICgoZmhkID4+PiAyKSAmIDEpID09PSAxO1xuICBjb25zdCBkaWN0SWQgPSBmaGQgJiAwYjExO1xuICBpZiAoIXNpbmdsZVNlZ21lbnQpIHRocm93IG5ldyBFcnJvcignenN0ZDogb25seSBTaW5nbGVfU2VnbWVudCBmcmFtZXMgc3VwcG9ydGVkJyk7XG4gIGlmIChjaGVja3N1bSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBjb250ZW50IGNoZWNrc3VtIG5vdCBzdXBwb3J0ZWQnKTtcbiAgaWYgKGRpY3RJZCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBkaWN0aW9uYXJpZXMgbm90IHN1cHBvcnRlZCcpO1xuICBsZXQgcG9zID0gNTtcbiAgbGV0IGZjcyA9IDA7XG4gIGlmIChmY3NTaXplRmxhZyA9PT0gMGIwMCkgeyBmY3MgPSBmcmFtZVtwb3NdITsgcG9zICs9IDE7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDEpIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpOyBmY3MgKz0gMjU2OyBwb3MgKz0gMjsgfVxuICBlbHNlIGlmIChmY3NTaXplRmxhZyA9PT0gMGIxMCkgeyBmY3MgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KSB8IChmcmFtZVtwb3MgKyAzXSEgKiAweDEwMDAwMDApOyBwb3MgKz0gNDsgfVxuICBlbHNlIHRocm93IG5ldyBFcnJvcignenN0ZDogOC1ieXRlIEZDUyB1bnN1cHBvcnRlZCcpO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShmY3MpO1xuICBsZXQgb3V0UG9zID0gMDtcbiAgZm9yICg7Oykge1xuICAgIGlmIChwb3MgKyAzID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBoZWFkZXInKTtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KTtcbiAgICBwb3MgKz0gMztcbiAgICBjb25zdCBpc0xhc3QgPSAoaGVhZGVySW50ICYgMSkgPT09IDE7XG4gICAgY29uc3QgYmxvY2tUeXBlID0gKGhlYWRlckludCA+Pj4gMSkgJiAwYjExO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IChoZWFkZXJJbnQgPj4+IDMpICYgMHgxZl9mZl9mZjtcbiAgICBpZiAoYmxvY2tUeXBlICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoYHpzdGQ6IG9ubHkgUmF3X0Jsb2NrICgwKSBzdXBwb3J0ZWQsIGdvdCAke2Jsb2NrVHlwZX1gKTtcbiAgICBpZiAocG9zICsgYmxvY2tTaXplID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBwYXlsb2FkJyk7XG4gICAgb3V0LnNldChmcmFtZS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSksIG91dFBvcyk7XG4gICAgb3V0UG9zICs9IGJsb2NrU2l6ZTtcbiAgICBwb3MgKz0gYmxvY2tTaXplO1xuICAgIGlmIChpc0xhc3QpIGJyZWFrO1xuICB9XG4gIGlmIChvdXRQb3MgIT09IGZjcykgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBGQ1MgbWlzbWF0Y2ggKGdvdCAke291dFBvc30sIGV4cGVjdGVkICR7ZmNzfSlgKTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBUYXIgbGlzdGluZyBkZWNvZGVyICh0ZXN0LW9ubHkpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gV2Fsa3MgYSB0YXIgYnl0ZSBidWZmZXIsIHJldHVybmluZyB7bmFtZSwgZGF0YX0gZm9yIGVhY2ggZW50cnkuIFN0b3BzIGF0XG4vLyB0aGUgdHJhaWxlciAodHdvIHplcm8gYmxvY2tzKS4gT25seSByZWFkcyB0aGUgZmllbGRzIFBpbmNoR3JhYiB3cml0ZXMuXG5cbmV4cG9ydCB0eXBlIFBhcnNlZFRhckVudHJ5ID0ge25hbWU6IHN0cmluZzsgZGF0YTogVWludDhBcnJheTsgc2l6ZTogbnVtYmVyfTtcblxuY29uc3QgZGVjID0gbmV3IFRleHREZWNvZGVyKCk7XG5cbmNvbnN0IHJlYWROdWxsU3RyID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgbGV0IGVuZCA9IG9mZnNldCArIGxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IG9mZnNldDsgaSA8IG9mZnNldCArIGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA9PT0gMCkgeyBlbmQgPSBpOyBicmVhazsgfVxuICB9XG4gIHJldHVybiBkZWMuZGVjb2RlKGJ1Zi5zdWJhcnJheShvZmZzZXQsIGVuZCkpO1xufTtcblxuY29uc3QgcmVhZE9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgY29uc3QgcyA9IHJlYWROdWxsU3RyKGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpLnRyaW0oKTtcbiAgcmV0dXJuIHMgPyBwYXJzZUludChzLCA4KSA6IDA7XG59O1xuXG5leHBvcnQgY29uc3QgcGFyc2VUYXIgPSAoYnVmOiBVaW50OEFycmF5KTogUGFyc2VkVGFyRW50cnlbXSA9PiB7XG4gIGNvbnN0IGVudHJpZXM6IFBhcnNlZFRhckVudHJ5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgKyA1MTIgPD0gYnVmLmxlbmd0aCkge1xuICAgIGNvbnN0IGhlYWRlciA9IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIDUxMik7XG4gICAgbGV0IGFsbFplcm8gPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHsgaWYgKGhlYWRlcltpXSAhPT0gMCkgeyBhbGxaZXJvID0gZmFsc2U7IGJyZWFrOyB9IH1cbiAgICBpZiAoYWxsWmVybykgYnJlYWs7IC8vIHRyYWlsZXJcbiAgICBjb25zdCBuYW1lID0gcmVhZE51bGxTdHIoaGVhZGVyLCAwLCAxMDApO1xuICAgIGNvbnN0IHNpemUgPSByZWFkT2N0YWwoaGVhZGVyLCAxMjQsIDEyKTtcbiAgICBwb3MgKz0gNTEyO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgZW50cmllcy5wdXNoKHtuYW1lLCBzaXplLCBkYXRhOiBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyBzaXplKX0pO1xuICAgICAgcG9zICs9IHNpemU7XG4gICAgICBjb25zdCBwYWQgPSAoNTEyIC0gKHNpemUgJSA1MTIpKSAlIDUxMjtcbiAgICAgIHBvcyArPSBwYWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBlbnRyaWVzO1xufTtcbiIsCiAgICAiLy8gQXV0by1nZW5lcmF0ZWQgYnkgc2NyaXB0cy9idWlsZC1leHRlbnNpb24udHMg4oCUIGRvIG5vdCBlZGl0LlxuLy8gVGVsbHMgdGhlIHNpZGVwYW5lbCB3aGljaCB0ZW1wbGF0ZSByZXNvdXJjZXMgZXhpc3QgaW4gdGhpcyBidWlsZC5cbi8vIEFjdHVhbCBjb250ZW50IGxpdmVzIGFzIC5tZCBmaWxlcyB1bmRlciBleHRlbnNpb24vdGVtcGxhdGVzLywgbG9hZGVkXG4vLyBsYXppbHkgdmlhIGNocm9tZS5ydW50aW1lLmdldFVSTCDigJQgc2VlIGxvYWRUZW1wbGF0ZSgpIGluIHNpZGVwYW5lbC50cy5cbmV4cG9ydCBjb25zdCBURU1QTEFURVNfUFJFU0VOVCA9IHtcImRlc2lnblRlbXBsYXRlXCI6dHJ1ZSxcInNraWxsVGVtcGxhdGVcIjp0cnVlLFwibG9jYWxEZXNpZ25cIjp0cnVlLFwibG9jYWxTa2lsbFwiOnRydWV9IGFzIGNvbnN0O1xuIiwKICAgICIvLyBTaW5nbGUtY2FwdHVyZSBmdWxsIGV4cG9ydC5cbi8vXG4vLyBcIkNvcHkgY2FwdHVyZSBhcyBKU09OXCIgd2FudHMgYSBDT01QTEVURSwgc2VsZi1jb250YWluZWQgdGV4dHVhbCBleHBvcnQgb2Zcbi8vIE9ORSBjYXB0dXJlOiBpdHMgc2VsZWN0b3JzL3BhdGhzLCBlbGVtZW50IHRleHQvY29udGVudCwgb3V0ZXJIVE1MLFxuLy8gbWV0YWRhdGEsIEFORCBldmVyeSBub3RlL2NvbW1lbnQgYXR0YWNoZWQgdG8gaXQg4oCUIGV2ZXJ5dGhpbmcgYSBmdWxsXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IGNhcnJpZXMsIGJ1dCBzY29wZWQgdG8gYSBzaW5nbGUgZWxlbWVudC5cbi8vXG4vLyBUaGUgcGFuZWwgbW9kZWxzIGEgY2FwdHVyZSBhcyBhbiBgRW50cnlgIChzcmMvdHlwZXMudHMpIHBsdXMgemVybyBvciBtb3JlXG4vLyBgRmVlZGJhY2tNZXNzYWdlYCByb3dzIGxpbmtlZCBiYWNrIHZpYSBgcGFyZW50VWlkIOKGkiBFbnRyeS51aWRgLiBCZWNhdXNlXG4vLyBub3RlcyBsaXZlIG9uIHNlcGFyYXRlIHJvd3MsIHRoZSBzZXJpYWxpemVyIHRha2VzIHRoZSBjYXB0dXJlIGVudHJ5IGFuZFxuLy8gaXRzIGZlZWRiYWNrIHJvd3MgdG9nZXRoZXIgc28gdGhlIEpTT04gaXMgZ2VudWluZWx5IHNlbGYtY29udGFpbmVkIOKAlCBhXG4vLyBjYWxsZXIgY2FuIGhhbmQgdGhlIG91dHB1dCB0byBhbiBhZ2VudCBhbmQgbm90aGluZyBkYW5nbGVzLlxuLy9cbi8vIEdyb3VwIGhlYWRzIChBbHQrU2hpZnQrQ2xpY2sgc2VsZWN0aW9ucykgY2FycnkgY2hpbGQgY2FwdHVyZXMgdW5kZXJcbi8vIGBlbnRyeS5ncm91cGA7IHdlIGlubGluZSB0aG9zZSBjaGlsZHJlbiAod2l0aCB0aGVpciBvd24gZmVlZGJhY2spIHNvIGFcbi8vIGdyb3VwZWQgY2FwdHVyZSBleHBvcnRzIGFzIG9uZSBjb21wbGV0ZSBvYmplY3QgdG9vLlxuLy9cbi8vIFR3byBvdXRwdXQgZm9ybXMsIG1pcnJvcmluZyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIEpTT04gKyBlbmdsaXNoIHNwbGl0OlxuLy8gICBzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSAgICAg4oaSIG9iamVjdCAgKHN0cnVjdHVyZWQsIGNvbXBsZXRlKVxuLy8gICBzZXJpYWxpemVDYXB0dXJlSnNvbihjYXB0dXJlLCBvcHRzKSAgICAgIOKGkiBzdHJpbmcgIChwcmV0dHkgSlNPTiArIG5ld2xpbmUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVUZXh0KGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKG1hcmtkb3duLCBodW1hbi9MTE0pXG4vL1xuLy8gYGNhcHR1cmVgIGFjY2VwdHMgZWl0aGVyOlxuLy8gICDigKIgeyBlbnRyeSwgZmVlZGJhY2s/LCBtZW1iZXJzPyB9ICDigJQgZXhwbGljaXQgc2hhcGUsIE9SXG4vLyAgIOKAoiBhIGJhcmUgYEVudHJ5YCAgICAgICAgICAgICAgICAgIOKAlCBmZWVkYmFjayBkZWZhdWx0cyB0byBbXVxuLy9cbi8vIE91dHB1dCBpcyBkZXRlcm1pbmlzdGljOiBpZGVudGljYWwgaW5wdXQg4oaSIGJ5dGUtaWRlbnRpY2FsIG91dHB1dC4gTm9cbi8vIHRpbWVzdGFtcHMgYXJlIGluamVjdGVkOyBvbmx5IHRoZSBjYXB0dXJlJ3Mgb3duIGB0c2AgZmllbGRzIGFwcGVhci5cblxuLy8g4pSA4pSA4pSAIElucHV0IG5vcm1hbGl6YXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEFjY2VwdCBhIGJhcmUgRW50cnkgb3IgYSB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3cmFwcGVyIGFuZCByZXR1cm4gYVxuLy8gbm9ybWFsaXplZCB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3aXRoIGFycmF5cyBhbHdheXMgcHJlc2VudC5cbmNvbnN0IG5vcm1hbGl6ZUNhcHR1cmUgPSAoY2FwdHVyZSkgPT4ge1xuICBpZiAoIWNhcHR1cmUgfHwgdHlwZW9mIGNhcHR1cmUgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICAvLyBCYXJlIEVudHJ5OiBpdCBoYXMgYSBgc2VsZWN0b3JgIC8gYHVpZGAgYnV0IG5vIG5lc3RlZCBgZW50cnlgLlxuICBjb25zdCBlbnRyeSA9IGNhcHR1cmUuZW50cnkgPz8gY2FwdHVyZTtcbiAgaWYgKCFlbnRyeSB8fCB0eXBlb2YgZW50cnkgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBoYXMgbm8gZW50cnlcIik7XG4gIH1cbiAgY29uc3QgZmVlZGJhY2sgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUuZmVlZGJhY2spID8gY2FwdHVyZS5mZWVkYmFjayA6IFtdO1xuICAvLyBHcm91cCBtZW1iZXJzIG1heSBiZSBzdXBwbGllZCBleHBsaWNpdGx5LCBlbHNlIGZhbGwgYmFjayB0byB0aGUgZW50cnknc1xuICAvLyBvd24gYGdyb3VwYCBhcnJheSAodGhlIHBhbmVsIHN0b3JlcyBjaGlsZCBjYXB0dXJlcyB0aGVyZSkuXG4gIGNvbnN0IG1lbWJlcnMgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUubWVtYmVycylcbiAgICA/IGNhcHR1cmUubWVtYmVyc1xuICAgIDogQXJyYXkuaXNBcnJheShlbnRyeS5ncm91cClcbiAgICAgID8gZW50cnkuZ3JvdXBcbiAgICAgIDogW107XG4gIHJldHVybiB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9O1xufTtcblxuLy8gQSBmZWVkYmFjayByb3cgc2NvcGVkIHRvIGEgc2luZ2xlIGNhcHR1cmUuIFN0cmlwcyByb3V0aW5nL1VJIGNydWZ0XG4vLyAoaWQsIHR5cGUpIGFuZCBrZWVwcyBvbmx5IHdoYXQgYSByZXZpZXdlciBuZWVkczogdGhlIHRleHQsIHdoZW4gaXQgd2FzXG4vLyB3cml0dGVuLCBhbnkgdGFncywgYW5kIHRoZSBwYXJlbnQgbGluayBmb3IgdHJhY2VhYmlsaXR5LlxuY29uc3Qgc2xpbUNvbW1lbnQgPSAoZmIpID0+IHtcbiAgY29uc3Qgb3V0ID0geyB0ZXh0OiB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiIH07XG4gIGlmIChmYi50cykgb3V0LnRzID0gZmIudHM7XG4gIGlmIChmYi51aWQpIG91dC51aWQgPSBmYi51aWQ7XG4gIGlmIChmYi5wYXJlbnRVaWQpIG91dC5wYXJlbnRVaWQgPSBmYi5wYXJlbnRVaWQ7XG4gIGlmIChBcnJheS5pc0FycmF5KGZiLnRhZ3MpICYmIGZiLnRhZ3MubGVuZ3RoKSBvdXQudGFncyA9IGZiLnRhZ3M7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb2xsZWN0IHRoZSBwYXRocy9zZWxlY3RvcnMgZm9yIGEgY2FwdHVyZSBpbnRvIG9uZSBibG9jayBzbyBldmVyeSB3YXkgb2Zcbi8vIGxvY2F0aW5nIHRoZSBlbGVtZW50IGlzIGluIGEgc2luZ2xlLCBvYnZpb3VzIHBsYWNlLiBUb2xlcmFudCBvZiBib3RoIHRoZVxuLy8gcGFuZWwgYEVudHJ5YCBzaGFwZSAoZmxhdCBgc2VsZWN0b3JgICsgYGlkYC9gdGVzdElkYCkgYW5kIHRoZSByaWNoZXJcbi8vIGBzZWxlY3RvcnNgIHN1Yi1vYmplY3Qgc29tZSBjYXB0dXJlIHBpcGVsaW5lcyBlbWl0LlxuY29uc3QgY29sbGVjdFBhdGhzID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IHBhdGhzID0ge307XG4gIGlmIChlbnRyeS5zZWxlY3RvcikgcGF0aHMuY3NzID0gZW50cnkuc2VsZWN0b3I7XG4gIGNvbnN0IHNlbCA9IGVudHJ5LnNlbGVjdG9ycztcbiAgaWYgKHNlbCAmJiB0eXBlb2Ygc2VsID09PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKHNlbC5jc3MgJiYgc2VsLmNzcyAhPT0gcGF0aHMuY3NzKSBwYXRocy5jc3NGdWxsID0gc2VsLmNzcztcbiAgICBpZiAoc2VsLmNvbXBhY3QpIHBhdGhzLmNvbXBhY3QgPSBzZWwuY29tcGFjdDtcbiAgICBpZiAoc2VsLnhwYXRoKSBwYXRocy54cGF0aCA9IHNlbC54cGF0aDtcbiAgICBpZiAoc2VsLmRhdGFJZHMpIHBhdGhzLmRhdGFJZHMgPSBzZWwuZGF0YUlkcztcbiAgfVxuICBpZiAoZW50cnkuY29tcG9uZW50Um9vdCkgcGF0aHMuY29tcG9uZW50Um9vdCA9IGVudHJ5LmNvbXBvbmVudFJvb3Q7XG4gIGlmIChlbnRyeS5zaGFkb3dIb3N0KSBwYXRocy5zaGFkb3dIb3N0ID0gZW50cnkuc2hhZG93SG9zdDtcbiAgaWYgKGVudHJ5LmlkKSBwYXRocy5kb21JZCA9IGVudHJ5LmlkO1xuICBpZiAoZW50cnkudGVzdElkKSBwYXRocy50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmICh0eXBlb2YgZW50cnkuc2VsZWN0b3JNYXRjaENvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgcGF0aHMubWF0Y2hDb3VudCA9IGVudHJ5LnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgfVxuICByZXR1cm4gcGF0aHM7XG59O1xuXG4vLyDilIDilIDilIAgRnVsbCBzdHJ1Y3R1cmVkIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEJ1aWxkIHRoZSBjb21wbGV0ZSBvYmplY3QgZm9yIE9ORSBjYXB0dXJlLiBFdmVyeXRoaW5nIHRleHR1YWwgdGhlXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IHdvdWxkIGNhcnJ5IGZvciB0aGlzIGVsZW1lbnQsIHdpdGggbm90ZXMvY29tbWVudHNcbi8vIGlubGluZWQuIEdyb3VwIG1lbWJlcnMgcmVjdXJzZSBzbyBhIGdyb3VwZWQgY2FwdHVyZSBpcyBzZWxmLWNvbnRhaW5lZC5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVDYXB0dXJlRnVsbCA9IChjYXB0dXJlLCBvcHRzID0ge30pID0+IHtcbiAgY29uc3QgeyBlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnMgfSA9IG5vcm1hbGl6ZUNhcHR1cmUoY2FwdHVyZSk7XG5cbiAgY29uc3Qgb3V0ID0ge1xuICAgIGtpbmQ6IFwicGluY2hncmFiL2NhcHR1cmUtZnVsbFwiLFxuICAgIHY6IDEsXG4gIH07XG4gIGlmIChlbnRyeS51aWQpIG91dC51aWQgPSBlbnRyeS51aWQ7XG4gIGlmIChlbnRyeS5uICE9PSB1bmRlZmluZWQpIG91dC5uID0gZW50cnkubjtcbiAgaWYgKGVudHJ5LnRzKSBvdXQudHMgPSBlbnRyeS50cztcbiAgaWYgKGVudHJ5LnVybCkgb3V0LnVybCA9IGVudHJ5LnVybDtcbiAgaWYgKGVudHJ5LnRhZykgb3V0LnRhZyA9IGVudHJ5LnRhZztcblxuICAvLyBJZGVudGl0eSAvIGExMXkgbmFtaW5nLlxuICBjb25zdCBpZGVudGl0eSA9IHt9O1xuICBpZiAoZW50cnkucm9sZSAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5yb2xlID0gZW50cnkucm9sZTtcbiAgaWYgKGVudHJ5LmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LmFjY2Vzc2libGVOYW1lID0gZW50cnkuYWNjZXNzaWJsZU5hbWU7XG4gIGlmIChlbnRyeS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkudGVzdElkID0gZW50cnkudGVzdElkO1xuICBpZiAoZW50cnkuaWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuaWQgPSBlbnRyeS5pZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkuY2xhc3NlcykgJiYgZW50cnkuY2xhc3Nlcy5sZW5ndGgpIGlkZW50aXR5LmNsYXNzZXMgPSBlbnRyeS5jbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoaWRlbnRpdHkpLmxlbmd0aCkgb3V0LmlkZW50aXR5ID0gaWRlbnRpdHk7XG5cbiAgLy8gUGF0aHMg4oCUIGV2ZXJ5IHdheSB0byBsb2NhdGUgdGhlIGVsZW1lbnQuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIG91dC5wYXRocyA9IHBhdGhzO1xuXG4gIC8vIFRleHQgLyBjb250ZW50LiBXZSBrZWVwIGFsbCB0ZXh0dWFsIHN1cmZhY2VzIHNvIG5vdGhpbmcgdGhlIHVzZXIgY2FuXG4gIC8vIHNlZSBpcyBsb3N0OiBzb3VyY2UgdGV4dCwgdGhlIENTUy1yZW5kZXJlZCBmb3JtLCBhbmQgdGhlIG1hcmt1cC5cbiAgY29uc3QgY29udGVudCA9IHt9O1xuICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnRleHQgPSBlbnRyeS50ZXh0O1xuICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQucmVuZGVyZWRUZXh0ID0gZW50cnkucmVuZGVyZWRUZXh0O1xuICBpZiAoZW50cnkudmFsdWUgIT09IHVuZGVmaW5lZCkgY29udGVudC52YWx1ZSA9IGVudHJ5LnZhbHVlO1xuICBpZiAoZW50cnkucGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCkgY29udGVudC5wbGFjZWhvbGRlciA9IGVudHJ5LnBsYWNlaG9sZGVyO1xuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIGNvbnRlbnQub3V0ZXJIVE1MID0gZW50cnkub3V0ZXJIVE1MO1xuICBpZiAoT2JqZWN0LmtleXMoY29udGVudCkubGVuZ3RoKSBvdXQuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgLy8gTm90ZXMgLyBjb21tZW50cyBhdHRhY2hlZCB0byB0aGlzIGNhcHR1cmUuXG4gIGlmIChmZWVkYmFjay5sZW5ndGgpIG91dC5jb21tZW50cyA9IGZlZWRiYWNrLm1hcChzbGltQ29tbWVudCk7XG5cbiAgLy8gUmVtYWluaW5nIHN0cnVjdHVyZWQgbWV0YWRhdGEgYW4gYWdlbnQgbWF5IHdhbnQg4oCUIGNvcGllZCB0aHJvdWdoXG4gIC8vIHZlcmJhdGltIHNvIHRoaXMgZXhwb3J0IGlzIGFzIGNvbXBsZXRlIGFzIHRoZSBKU09OTCByb3cuIFdlIGFsbG93LWxpc3RcbiAgLy8gdGhlIGhlYXZ5L3N0cnVjdHVyZWQgZmllbGRzIHJhdGhlciB0aGFuIGR1bXBpbmcgdGhlIHdob2xlIEVudHJ5IHNvIHRoZVxuICAvLyBvdXRwdXQgb3JkZXJpbmcgc3RheXMgc3RhYmxlIGFuZCBvYnZpb3VzLlxuICBjb25zdCBtZXRhID0ge307XG4gIGNvbnN0IHBhc3N0aHJvdWdoID0gW1xuICAgIFwicmVjdFwiLCBcInZpZXdwb3J0XCIsIFwic3RhdGVzXCIsIFwiYXR0cnNcIiwgXCJoaW50c1wiLCBcImNvbXBvbmVudFwiLCBcImV2ZW50c1wiLFxuICAgIFwiYmVoYXZpb3JBdHRyc1wiLCBcImExMXlcIiwgXCJhc3NldHNcIiwgXCJsYXlvdXRDb250ZXh0XCIsIFwic3R5bGVzXCIsXG4gICAgXCJtYXRjaGVkUnVsZXNcIiwgXCJhbmNlc3RvcnNcIiwgXCJzY3JlZW5zaG90XCIsIFwidHJ1bmNhdGVkXCIsIFwic2Vzc2lvbklkXCIsXG4gICAgXCJjYW52YXNDbGlja1wiLCBcImVkaXRvclwiLCBcImRvbU11dGF0aW9uc1wiLCBcImlzQW5pbWF0aW5nXCIsXG4gIF07XG4gIGZvciAoY29uc3Qga2V5IG9mIHBhc3N0aHJvdWdoKSB7XG4gICAgaWYgKGVudHJ5W2tleV0gIT09IHVuZGVmaW5lZCkgbWV0YVtrZXldID0gZW50cnlba2V5XTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMobWV0YSkubGVuZ3RoKSBvdXQubWV0YSA9IG1ldGE7XG5cbiAgLy8gR3JvdXAgbWVtYmVyczogcmVjdXJzZSBzbyBlYWNoIGNoaWxkIGNhcHR1cmUgaXMgZnVsbHkgc2VyaWFsaXplZCB0b28uXG4gIC8vIEEgbWVtYmVyIG1heSBjYXJyeSBpdHMgb3duIGZlZWRiYWNrIHdoZW4gdGhlIGNhbGxlciBzdXBwbGllcyBhXG4gIC8vIHtlbnRyeSwgZmVlZGJhY2t9IHBhaXI7IGJhcmUgY2hpbGQgRW50cmllcyBzZXJpYWxpemUgd2l0aCBubyBjb21tZW50cy5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgb3V0Lm1lbWJlcnMgPSBtZW1iZXJzLm1hcCgobSkgPT4gc2VyaWFsaXplQ2FwdHVyZUZ1bGwobSwgb3B0cykpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFByZXR0eSBKU09OIHN0cmluZyBmb3IgdGhlIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiBidXR0b24uIFRyYWlsaW5nXG4vLyBuZXdsaW5lIHNvIGl0IHJvdW5kLXRyaXBzIGNsZWFubHkgdGhyb3VnaCBlZGl0b3JzIC8gYHBicGFzdGVgLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVKc29uID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT5cbiAgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXplQ2FwdHVyZUZ1bGwoY2FwdHVyZSwgb3B0cyksIG51bGwsIDIpICsgXCJcXG5cIjtcblxuLy8g4pSA4pSA4pSAIFNpbmdsZS1jYXB0dXJlIG1hcmtkb3duIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gTWF0Y2hlcyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIGVuZ2xpc2gvbWFya2Rvd24gc3VyZmFjZSBidXQgc2NvcGVkIHRvIG9uZVxuLy8gY2FwdHVyZS4gVXNlZnVsIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gcGFzdGUgYSBodW1hbi1yZWFkYWJsZSBjYXJkIHJhdGhlclxuLy8gdGhhbiByYXcgSlNPTi5cblxuY29uc3QgaGVhZGluZyA9IChlbnRyeSkgPT4ge1xuICBjb25zdCBuYW1lID1cbiAgICBlbnRyeS5hY2Nlc3NpYmxlTmFtZSB8fFxuICAgIGVudHJ5LnRlc3RJZCB8fFxuICAgIGVudHJ5LmlkIHx8XG4gICAgZW50cnkuc2VsZWN0b3IgfHxcbiAgICBlbnRyeS50YWcgfHxcbiAgICBcImNhcHR1cmVcIjtcbiAgY29uc3QgbGFiZWwgPSBlbnRyeS5uICE9PSB1bmRlZmluZWQgPyBgQ2FwdHVyZSAjJHtlbnRyeS5ufWAgOiBcIkNhcHR1cmVcIjtcbiAgcmV0dXJuIGAke2xhYmVsfTogJHtuYW1lfWA7XG59O1xuXG5jb25zdCByZW5kZXJQYXRocyA9IChwYXRocykgPT4ge1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhwYXRocykpIHtcbiAgICBsaW5lcy5wdXNoKGAtICoqJHtrfToqKiBcXGAke3Z9XFxgYCk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVUZXh0ID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgbGluZXMucHVzaChgIyAke2hlYWRpbmcoZW50cnkpfWAsIFwiXCIpO1xuICBpZiAoZW50cnkudXJsKSBsaW5lcy5wdXNoKGBQYWdlOiA8JHtlbnRyeS51cmx9PmAsIFwiXCIpO1xuICBpZiAoZW50cnkudGFnKSBsaW5lcy5wdXNoKGBFbGVtZW50OiBcXGA8JHtlbnRyeS50YWd9PlxcYGAsIFwiXCIpO1xuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgUGF0aHNcIiwgXCJcIiwgLi4ucmVuZGVyUGF0aHMocGF0aHMpKTtcbiAgfVxuXG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQgfHwgZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgVGV4dFwiLCBcIlwiKTtcbiAgICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBsaW5lcy5wdXNoKGBTb3VyY2U6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkudGV4dCl9YCk7XG4gICAgaWYgKGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkICYmIGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gZW50cnkudGV4dCkge1xuICAgICAgbGluZXMucHVzaChgUmVuZGVyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkucmVuZGVyZWRUZXh0KX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgTWFya3VwXCIsIFwiXCIsIFwiYGBgaHRtbFwiLCBlbnRyeS5vdXRlckhUTUwsIFwiYGBgXCIpO1xuICB9XG5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBOb3RlcyAmIGNvbW1lbnRzXCIsIFwiXCIpO1xuICAgIGZvciAoY29uc3QgZmIgb2YgZmVlZGJhY2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiO1xuICAgICAgY29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGggPyBgIF8oJHtmYi50YWdzLmpvaW4oXCIsIFwiKX0pX2AgOiBcIlwiO1xuICAgICAgbGluZXMucHVzaChgLSAke3RleHR9JHt0YWdzfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtZW1iZXJzLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBHcm91cGVkIHdpdGhcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lbWJlcnMpIHtcbiAgICAgIGNvbnN0IG1lID0gbm9ybWFsaXplQ2FwdHVyZShtKS5lbnRyeTtcbiAgICAgIGxpbmVzLnB1c2goYC0gJHtoZWFkaW5nKG1lKX0g4oCUIFxcYCR7bWUuc2VsZWN0b3IgPz8gbWUudGFnID8/IFwiP1wifVxcYGApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKFwiXFxuXCIpICsgXCJcXG5cIjtcbn07XG4iLAogICAgIi8vIFBpbmNoR3JhYiBzaWRlLXBhbmVsIFVJLiBSZWNlaXZlcyBjYXB0dXJlcyArIGhvdmVycyBmcm9tIHRoZSBjb250ZW50XG4vLyBzY3JpcHQ7IHJlbmRlcnMgdGhlIGNoYXQtYnViYmxlIHRpbWVsaW5lLCBleHBvcnRzLCB2YWxpZGF0ZXMsIGV0Yy5cbi8vXG4vLyBEZWNvbXBvc2VkIGludG8gc21hbGwgZmlsZXMgZm9yIGNsYXJpdHk6XG4vLyAgIOKAoiB0eXBlcy50cyAgICAgIOKAlCBzaGFyZWQgdHlwZXMsIG1lc3NhZ2UgcHJvdG9jb2xcbi8vICAg4oCiIGx1Y2lkZS50cyAgICAg4oCUIGljb24gcmVnaXN0cnlcbi8vICAg4oCiIHRoaXMgZmlsZSAgICAg4oCUIHdpcmUtdXAgLyByZW5kZXJpbmcgLyBleHBvcnQgYnVpbGRlcnNcbi8vXG4vLyBMb2FkZWQgYXMgdGhlIHNpZGUgcGFuZWwgcGFnZTogY2hyb21lLnNpZGVQYW5lbCBkZWZhdWx0X3BhdGguXG5cbmltcG9ydCB0eXBlIHtcbiAgQW5ub3RhdGlvblBheWxvYWQsIENzVG9QYW5lbCwgRW50cnksIEV4cG9ydERpYWdub3N0aWMsIEV4cG9ydE1hbmlmZXN0LCBGZWVkYmFja01lc3NhZ2UsIFBhZ2VNZXNzYWdlLFxuICBQYWdlU25hcHNob3QsIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5pbXBvcnQge3NlcmlhbGl6ZUNhcHR1cmVKc29ufSBmcm9tICcuL2V4cG9ydC1jYXB0dXJlLm1qcyc7XG5cbigoKSA9PiB7XG4gIGNvbnN0IExPRyA9ICdbUGluY2hHcmFiL3NwXSc7XG4gIGNvbnN0IFBSRUZTX1NUT1JBR0VfTkFNRSA9ICdwaW5jaGdyYWIucHJlZnMudjInO1xuICBjb25zdCBXT1JLU1BBQ0VTX0tFWSA9ICdwaW5jaGdyYWIud29ya3NwYWNlcy52MSc7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuXG4gIC8vIOKUgOKUgOKUgCBUZW1wbGF0ZSByZXNvdXJjZSBsb2FkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEVhcmxpZXIgdGhlIHRlbXBsYXRlcyB3ZXJlIGJha2VkIGFzIHN0cmluZyBjb25zdGFudHMgaW50byB0aGlzIElJRkVcbiAgLy8gKH4zNjBLQiBhY3Jvc3MgREVTSUdOICsgU0tJTEwpLiBUaGF0IGJsb2F0ZWQgdGhlIHNpZGVwYW5lbCBidW5kbGUgdG9cbiAgLy8gfjEuOTVNQiBhbmQgc2xvd2VkIGZpcnN0LW9wZW4gcGFyc2UgdGltZSBub3RpY2VhYmx5LiBUaGV5IG5vdyBzaGlwIGFzXG4gIC8vIHNlcGFyYXRlIGAubWRgIGZpbGVzIHVuZGVyIGBleHRlbnNpb24vdGVtcGxhdGVzL2AgYW5kIGxvYWQgb24gZGVtYW5kXG4gIC8vIHZpYSBmZXRjaCDigJQgd2hlbiB0aGUgdXNlciBvcGVucyB0aGUgZWRpdG9yIG1vZGFsLCBvciB3aGVuIHRoZSBleHBvcnRcbiAgLy8gcGlwZWxpbmUgbmVlZHMgdG8gYnVuZGxlIGEgZmFsbGJhY2suXG4gIC8vXG4gIC8vIENhY2hlIHJlc3VsdHMgaW4tcHJvY2VzcyBzbyByZXBlYXQgcmVhZHMgKG1vZGFsIG9wZW4g4oaSIGNsb3NlIOKGkiByZW9wZW4sXG4gIC8vIG9yIHNlcXVlbnRpYWwgZXhwb3J0cykgZG9uJ3QgcmUtZmV0Y2guXG4gIGNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBURU1QTEFURV9GSUxFUyA9IHtcbiAgICBkZXNpZ25UZW1wbGF0ZTogJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsXG4gICAgc2tpbGxUZW1wbGF0ZTogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsXG4gICAgbG9jYWxEZXNpZ246ICdsb2NhbC5ERVNJR04ubWQnLFxuICAgIGxvY2FsU2tpbGw6ICdsb2NhbC5TS0lMTC5tZCcsXG4gIH0gYXMgY29uc3Q7XG4gIHR5cGUgVGVtcGxhdGVLZXkgPSBrZXlvZiB0eXBlb2YgVEVNUExBVEVfRklMRVM7XG4gIGNvbnN0IHRlbXBsYXRlVXJsID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gSW5zaWRlIHRoZSBleHRlbnNpb24sIHRoZSBzaWRlcGFuZWwgcnVucyBmcm9tXG4gICAgLy8gY2hyb21lLWV4dGVuc2lvbjovLzxpZD4vc2lkZXBhbmVsLmh0bWwsIHNvIHJlc291cmNlcyByZXNvbHZlIHZpYVxuICAgIC8vIGNocm9tZS5ydW50aW1lLmdldFVSTC4gVGhlIFBsYXl3cmlnaHQgc3RhdGljLXNlcnZlciB0ZXN0cyBzZXJ2ZVxuICAgIC8vIGAvdGVtcGxhdGVzLzxmaWxlPmAgZnJvbSB0aGUgZXh0ZW5zaW9uIHJvb3QgZGlyZWN0bHksIHNvIGFcbiAgICAvLyByZWxhdGl2ZSBVUkwgd29ya3MgdGhlcmUgYXMgYSBmYWxsYmFjay5cbiAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCkge1xuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChgdGVtcGxhdGVzLyR7ZmlsZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZXMvJHtmaWxlfWA7XG4gIH07XG4gIGNvbnN0IGxvYWRUZW1wbGF0ZSA9IGFzeW5jIChrZXk6IFRlbXBsYXRlS2V5KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAoIVRFTVBMQVRFU19QUkVTRU5UW2tleV0pIHJldHVybiAnJztcbiAgICBjb25zdCBmaWxlID0gVEVNUExBVEVfRklMRVNba2V5XTtcbiAgICBjb25zdCBjYWNoZWQgPSB0ZW1wbGF0ZUNhY2hlLmdldChmaWxlKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRlbXBsYXRlVXJsKGZpbGUpKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgdGVtcGxhdGUgZmV0Y2ggZmFpbGVkOiAke2ZpbGV9YCwgZXJyKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG4gIC8vIEVmZmVjdGl2ZSBjb250ZW50IHVzZWQgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSBhbmQgdGhlIG1vZGFsLiBXaGVuIHRoZVxuICAvLyB1c2VyIGhhcyBjdXN0b21pemVkIHZpYSB0aGUgdGV4dGFyZWEvdXBsb2FkLCB0aGF0IHdpbnM7IG90aGVyd2lzZSB3ZVxuICAvLyBmYWxsIGJhY2sgdG8gbG9jYWwuKiAodGhlIGRldmVsb3BlcidzIHByZS1iYWtlZCBvdmVycmlkZSkgdGhlbiB0b1xuICAvLyB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgY29uc3QgcmVzb2x2ZURlc2lnbkNvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuZGVzaWduTWQgJiYgcHJlZnMuZGVzaWduTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuZGVzaWduTWQ7XG4gICAgcmV0dXJuIChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsRGVzaWduJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJykpO1xuICB9O1xuICBjb25zdCByZXNvbHZlU2tpbGxDb250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLnNraWxsTWQgJiYgcHJlZnMuc2tpbGxNZC50cmltKCkpIHJldHVybiBwcmVmcy5za2lsbE1kO1xuICAgIHJldHVybiAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbFNraWxsJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKSk7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDihpIgcHJlZnMue2Rlc2lnbk1kfHNraWxsTWR9IGlzXG4gIC8vIGVtcHR5IGFuZCB3ZSdyZSBmYWxsaW5nIGJhY2sgdG8gYSBidW5kbGVkIHRlbXBsYXRlL2xvY2FsIHJlc291cmNlLlxuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24gPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuZGVzaWduTWQgfHwgIXByZWZzLmRlc2lnbk1kLnRyaW0oKTtcbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlU2tpbGwgPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuc2tpbGxNZCB8fCAhcHJlZnMuc2tpbGxNZC50cmltKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0b3JhZ2UgYWRhcHRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgU3RvcmUgPSB7XG4gICAgYXN5bmMgZ2V0PFQ+KGtleTogc3RyaW5nLCBmYWxsYmFjazogVCk6IFByb21pc2U8VD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7IHJldHVybiAob1trZXldIGFzIFQpID8/IGZhbGxiYWNrOyB9XG4gICAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBjb25zdCByID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTsgcmV0dXJuIHIgPT09IG51bGwgPyBmYWxsYmFjayA6IChKU09OLnBhcnNlKHIpIGFzIFQpOyB9XG4gICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgIH0sXG4gICAgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1trZXldOiB2YWx1ZX0pOyByZXR1cm47IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgfVxuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LFxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBET00gcmVmcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgJCA9IDxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50PihzOiBzdHJpbmcpOiBUID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocykgYXMgVDtcbiAgY29uc3QgbGlzdCA9ICQoJ1tkYXRhLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBvc2VyID0gJDxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtY29tcG9zZXJdJyk7XG4gIGNvbnN0IHN0YXR1cyA9ICQoJ1tkYXRhLXN0YXR1c10nKTtcbiAgY29uc3Qgc2VhcmNoID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtc2VhcmNoXScpO1xuICAvLyBDdHJsK0YgdmlzdWFsLWZpbmQgYmFyIChkaXN0aW5jdCBmcm9tIHRoZSBoZWFkZXIgc2VhcmNoLCB3aGljaCBvcGVucyB0aGVcbiAgLy8gY29tbWFuZCBwYWxldHRlKS4gTWF5IGJlIGFic2VudCBpbiB2ZXJ5IG9sZCBjYWNoZWQgbWFya3VwLCBzbyBjb25zdW1lcnNcbiAgLy8gbnVsbC1ndWFyZC5cbiAgY29uc3QgZmluZEJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1maW5kLWJhcl0nKTtcbiAgY29uc3QgZmluZElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtZmluZF0nKTtcbiAgY29uc3QgZmluZENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWZpbmQtY291bnRdJyk7XG4gIC8vIENhbm9uaWNhbGl6ZSBrZXlib2FyZC1zaG9ydGN1dCBwaWxscyBwZXIgcGxhdGZvcm0uIEV2ZXJ5IHNob3J0Y3V0IHBpbGxcbiAgLy8gaXMgYXV0aG9yZWQgaW4gdGhlIGNhbm9uaWNhbCBDbWQtZm9ybSAoZWFjaCB0b2tlbiBjYXBpdGFsaXplZCwgam9pbmVkXG4gIC8vIHdpdGggJysnOiBBbHQrQ2xpY2ssIENtZCtLLCBDbWQrU2hpZnQrWik7IG9uIG5vbi1NYWMgd2Ugc3dhcCB0aGUgbGVhZGluZ1xuICAvLyBDbWQgbW9kaWZpZXIgZm9yIEN0cmwuIFBpbGxzIG9wdCBpbiB2aWEgZGF0YS1tb2QtKiBzbyBhIHN0cmluZyBsaWtlIHRoZVxuICAvLyAnQWx0K+KApicgcGlsbHMgKHdoaWNoIG5ldmVyIGNhcnJ5IENtZCkgYXJlIGxlZnQgdW50b3VjaGVkLlxuICBjb25zdCBpc01hYyA9IC9NYWN8aVBob25lfGlQYWQvaS50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSB8fCBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnKTtcbiAgaWYgKCFpc01hYykge1xuICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ2tiZFtkYXRhLW1vZC1rXSwga2JkW2RhdGEtbW9kLXpdLCBrYmRbZGF0YS1tb2Qtc2hpZnQtel0nKSkge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSAoZWwudGV4dENvbnRlbnQgPz8gJycpLnJlcGxhY2UoL15DbWRcXGIvLCAnQ3RybCcpO1xuICAgIH1cbiAgfVxuICBjb25zdCBpbXBvcnRGaWxlID0gJDxIVE1MSW5wdXRFbGVtZW50PignI2ltcG9ydC1maWxlJyk7XG4gIGNvbnN0IHN0YXRzRWwgPSAkKCdbZGF0YS1zdGF0c10nKTtcbiAgY29uc3Qgc3RhcnNFbCA9ICQoJ1tkYXRhLXN0YXJzXScpO1xuICBjb25zdCB0b29sdGlwRWwgPSAkKCdbZGF0YS10b29sdGlwXScpO1xuICBjb25zdCBkcmlsbGRvd25FbCA9ICQoJ1tkYXRhLWRyaWxsZG93bl0nKTtcbiAgY29uc3QgZHJhd2VyID0gJCgnW2RhdGEtZHJhd2VyXScpO1xuICBjb25zdCBwYWxldHRlID0gJCgnW2RhdGEtcGFsZXR0ZV0nKTtcbiAgY29uc3QgcGFsZXR0ZUlucHV0ID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcGFsZXR0ZS1pbnB1dF0nKTtcbiAgY29uc3QgcGFsZXR0ZUxpc3QgPSAkKCdbZGF0YS1wYWxldHRlLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBXb3JkcyA9ICQoJ1tkYXRhLWNvbXAtd29yZHNdJyk7XG4gIGNvbnN0IGNvbXBUb2tlbnMgPSAkKCdbZGF0YS1jb21wLXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFRva2VucyA9ICQoJ1tkYXRhLXN0YXQtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0V29yZHMgPSAkKCdbZGF0YS1zdGF0LXdvcmRzXScpO1xuICBjb25zdCB3c1NlbGVjdCA9ICQ8SFRNTFNlbGVjdEVsZW1lbnQ+KCdbZGF0YS13b3Jrc3BhY2VdJyk7XG4gIGNvbnN0IHdzTGlzdCA9ICQoJ1tkYXRhLXdzLWxpc3RdJyk7XG4gIGNvbnN0IHdzTmFtZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXdzLW5hbWVdJyk7XG5cbiAgY29uc3QgbW91bnRJY29ucyA9IChyb290OiBQYXJlbnROb2RlID0gZG9jdW1lbnQpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWljb25dJykpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbicpO1xuICAgICAgY29uc3Qgc2l6ZSA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScpID8/IDE2KTtcbiAgICAgIGlmIChuYW1lICYmIFBHX0lDT05TLmhhcyhuYW1lKSkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICAgIH1cbiAgfTtcbiAgbW91bnRJY29ucygpO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiBib29sZWFuO1xuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IGJvb2xlYW47XG4gICAgaW5jbHVkZVN0eWxlczogYm9vbGVhbjtcbiAgICBtaW5pZnk6IGJvb2xlYW47XG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogYm9vbGVhbjtcbiAgICB1c2VTY3JlZW5zaG90czogYm9vbGVhbjtcbiAgICBzcGFjaW5nT3ZlcmxheTogYm9vbGVhbjtcbiAgICBob3ZlclNuYXA6IGJvb2xlYW47XG4gICAgYXV0b1NjcmVlbnNob3Q6IGJvb2xlYW47XG4gICAgLy8gQ29tbWEtc2VwYXJhdGVkIGhvc3QgcGF0dGVybnMgKHN1YnN0cmluZyBtYXRjaCkuIEhvc3RzIGluIHRoaXMgbGlzdFxuICAgIC8vIHNraXAgdGhlIGVudGlyZSBzY3JlZW5zaG90IHBpcGVsaW5lIOKAlCB1c2VmdWwgZm9yIHNlbnNpdGl2ZSBwYWdlc1xuICAgIC8vIChiYW5raW5nLCBpbnRlcm5hbCBhZG1pbikgd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IFBOR3MgbGFuZGluZ1xuICAgIC8vIG9uIGRpc2suXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogc3RyaW5nO1xuICAgIC8vIElubGluZSBERVNJR04ubWQgY29udGVudCB0aGUgdXNlciBwYXN0ZWQgb3IgdXBsb2FkZWQgdmlhIHRoZSBzaWRlXG4gICAgLy8gcGFuZWwgc2V0dGluZ3MuIERlZmF1bHRzIHRvIGEgdGVtcGxhdGVkIHBsYWNlaG9sZGVyIHNvIG91dC1vZi10aGUtXG4gICAgLy8gYm94IGV4cG9ydHMgYWx3YXlzIGluY2x1ZGUgYSBERVNJR04ubWQg4oCUIHRoZSBjb25zdW1lciBMTE0gY2FuXG4gICAgLy8gZWl0aGVyIHdvcmsgZnJvbSB0aGUgcGxhY2Vob2xkZXIgKGFuZCBhc2sgZm9yIHRoZSByZWFsIG9uZSkgb3JcbiAgICAvLyBmcm9tIGEgdXNlci1jdXN0b21pemVkIGNvcHkuIFRoZSBzZXR0aW5ncyBVSSBmbGFncyB0aGlzIGJhbm5lci1cbiAgICAvLyBzdHlsZSB3aGVuIHRoZSB2YWx1ZSBzdGlsbCBtYXRjaGVzIHRoZSB0ZW1wbGF0ZSBzbyB0aGUgdXNlclxuICAgIC8vIGtub3dzIHRvIGZpbGwgaXQgaW4uXG4gICAgZGVzaWduTWQ6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIHRoZSByZWNlaXZlciBzaG91bGQgcmVhZCBERVNJR04ubWQgZnJvbS4gRGVmYXVsdHNcbiAgICAvLyB0byBgfi8uYWdlbnRzL0RFU0lHTi5tZGA7IHVzZXIgY2FuIG92ZXJyaWRlIHBlci1tYWNoaW5lLlxuICAgIGRlc2lnblBhdGg6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIG9mIHRoZSBQaW5jaEdyYWIgVUkgc2tpbGwgb24gdGhlIHJlY2VpdmVyJ3NcbiAgICAvLyBmaWxlc3lzdGVtLiBUaGUgc2tpbGwgY29udGVudCBpdHNlbGYgaXMgYnVuZGxlZCBpbmxpbmUgaW50byB0aGVcbiAgICAvLyBhcmNoaXZlIChzZWUgYHNraWxsTWRgKSwgc28gdGhpcyBpcyBhIGhpbnQgZm9yIHJlY2VpdmVycyB0aGF0XG4gICAgLy8gd2FudCB0byBwZXJzaXN0IHRoZSBza2lsbCBhdCBhIGNhbm9uaWNhbCBsb2NhdGlvbi5cbiAgICBza2lsbFBhdGg6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgVUktc2tpbGwgY29udGVudC4gRGVmYXVsdCBpcyB0aGUgYnVuZGxlZCBQaW5jaEdyYWIgdHJpYWdlXG4gICAgLy8gc2tpbGwgdGVtcGxhdGU7IHVzZXIgY2FuIGN1c3RvbWl6ZSB2aWEgc2V0dGluZ3MgcGFzdGUvdXBsb2FkLlxuICAgIC8vIEJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSBhdCBgLi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgLlxuICAgIHNraWxsTWQ6IHN0cmluZztcbiAgICAvLyBXaGVuIHRydWUsIGZpcmUgYSBmcmVzaCBwYWdlIHNjcmVlbnNob3Qgb24gRVZFUlkgY2FwdHVyZSByYXRoZXJcbiAgICAvLyB0aGFuIG9uY2UgcGVyICh3b3Jrc3BhY2UsIHVybCkgdHVwbGUuIFVzZWZ1bCBmb3IgY2FwdHVyaW5nIGFcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3cgd2hlcmUgdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzLlxuICAgIC8vIERlZmF1bHQgZmFsc2Ug4oCUIG1vc3QgdXNlcnMgd2FudCB0aGUgZGVmYXVsdCBmaXJzdC1vbmx5IGJlaGF2aW9yXG4gICAgLy8gc2luY2UgcGFnZSBzY3JlZW5zaG90cyBhcmUgbGFyZ2UgYW5kIHRoZSBmaXJzdCBvbmUgYWxyZWFkeSBnaXZlc1xuICAgIC8vIGEgc2Vzc2lvbi1sZXZlbCByZWZlcmVuY2UuXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBib29sZWFuO1xuICB9O1xuICBjb25zdCBERUZBVUxUX1BSRUZTOiBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiB0cnVlLFxuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IHRydWUsXG4gICAgaW5jbHVkZVN0eWxlczogdHJ1ZSxcbiAgICAvLyBEZWZhdWx0IHRvIG1pbmlmaWVkIGV4cG9ydHMg4oCUIG1vc3QgYWdlbnRzIHdhbnQgdGhlIHNtYWxsZXN0XG4gICAgLy8gdG9rZW4tZm9vdHByaW50IHBheWxvYWQuIEV4aXN0aW5nIHVzZXJzJyBzYXZlZCBwcmVmcyBhcmUgbWVyZ2VkIG92ZXJcbiAgICAvLyB0aGlzIGRlZmF1bHQgaW4gbG9hZEFsbCgpLCBzbyBvbmx5IE5FVy91bnNldCBpbnN0YWxscyBzZWUgdGhlIGZsaXAuXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IHRydWUsXG4gICAgdXNlU2NyZWVuc2hvdHM6IHRydWUsXG4gICAgc3BhY2luZ092ZXJsYXk6IGZhbHNlLFxuICAgIGhvdmVyU25hcDogdHJ1ZSxcbiAgICBhdXRvU2NyZWVuc2hvdDogdHJ1ZSxcbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiAnJyxcbiAgICAvLyBkZXNpZ25NZCAvIHNraWxsTWQgZGVmYXVsdCB0byAnJyB3aGljaCB0aGUgcmVzb2x2ZXIgdHJlYXRzIGFzXG4gICAgLy8gXCJmYWxsIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUgYXQgZXhwb3J0IHRpbWVcIi4gU3RvcmluZyB0aGVcbiAgICAvLyBlbXB0eSBzdHJpbmcga2VlcHMgY2hyb21lLnN0b3JhZ2Ugc21hbGwgYW5kIGxldHMgYGlzVXNpbmdUZW1wbGF0ZSpgXG4gICAgLy8gYmUgYSBjaGVhcCBzeW5jaHJvbm91cyBjaGVjay5cbiAgICBkZXNpZ25NZDogJycsXG4gICAgZGVzaWduUGF0aDogJ34vLmFnZW50cy9ERVNJR04ubWQnLFxuICAgIHNraWxsUGF0aDogJ34vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICBza2lsbE1kOiAnJyxcbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGZhbHNlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nfTtcbiAgLy8gT25lIGFyY2hpdmVkIHN0YXRlIG9mIGEgd29ya3NwYWNlIChjYXB0dXJlZCBqdXN0IGJlZm9yZSBhIENsZWFyLWFsbCkuXG4gIC8vIGBzaG90c2AgaXMgdGhlIHRodW1ibmFpbCBtYXAgKGZ1bGwtcmVzIFBOR3MgYXJlIHNlc3Npb24tb25seSBhbmQgbm90XG4gIC8vIGFyY2hpdmVkKS4gUmVzdG9yYWJsZSBmcm9tIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzLlxuICB0eXBlIFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgdHM6IHN0cmluZztcbiAgICBtZXNzYWdlczogUGFuZWxNZXNzYWdlW107XG4gICAgc2hvdHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgY29tbWVudHM6IG51bWJlcjtcbiAgfTtcblxuICBsZXQgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gIGxldCBsaXZlVGFiVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxpdmVUYWJQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2VsZWN0b3JWYWxpZGl0eSA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuIHwgJ2RpZmYtcGFnZSc+KCk7XG4gIGNvbnN0IHNlbGVjdG9yRXJyb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgaW5zZXJ0QmVmb3JlOiB7Y3VycmVudDogc3RyaW5nIHwgbnVsbDsgY29tbWVudDogYm9vbGVhbn0gPSB7Y3VycmVudDogbnVsbCwgY29tbWVudDogZmFsc2V9O1xuICBsZXQgc2VhcmNoUXVlcnkgPSAnJztcbiAgbGV0IGxhc3RBY3RpdmVTZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdGlja3lUaW1lciA9IDA7XG4gIGxldCBTVElDS1lfVFRMX01TID0gNV8wMDA7XG4gIGxldCBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgbGV0IHBoYW50b21UYXJnZXQ6IHtzZWxlY3Rvcjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyB0YWc/OiBzdHJpbmc7IHJlY3Q/OiBET01SZWN0fSB8IG51bGwgPSBudWxsO1xuICBsZXQgcGVuZGluZ011bHRpOiBFbnRyeVtdID0gW107XG4gIGNvbnN0IHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIHBlciBzZWxlY3Rvci4gTk9UIHBlcnNpc3RlZCB0b1xuICAvLyBjaHJvbWUuc3RvcmFnZSAoY2FwIHByZXNzdXJlIOKAlCAxMDAgY2FwdHVyZXMgw5cgODAgS0IgZWFjaCA9IDggTUIpLCBzb1xuICAvLyBpdCdzIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBzZXNzaW9uJ3MgYXJjaGl2ZSBleHBvcnQuIENsZWFyZWRcbiAgLy8gb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgY29uc3Qgc2hvdHNGdWxsID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gVHJhY2sgd2hpY2ggKHdvcmtzcGFjZSwgcGFnZS11cmwpIHR1cGxlcyBhbHJlYWR5IGZpcmVkIGEgcGFnZSBzaG90IHNvIHdlXG4gIC8vIGRvbid0IHJlLXNob290IHRoZSBlbnRpcmUgcGFnZSBvbiBldmVyeSBjYXB0dXJlLiBSZXNldCBvbiB3b3Jrc3BhY2VcbiAgLy8gc3dpdGNoIOKAlCBubyBkYXkga2V5LCB0aGUgZGVkdXBlIGlzIHBlci1zZXNzaW9uLlxuICBjb25zdCBwYWdlU2hvdHNGaXJlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBwYWdlU2hvdEtleSA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiBgJHthY3RpdmVXc306JHt1cmx9YDtcbiAgLy8gTGFzdCBzdWNjZXNzZnVsIGV4cG9ydCDigJQgYm90aCB0aGUgd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKHNob3duIHRvIHRoZVxuICAvLyB1c2VyKSBhbmQgdGhlIE9TLWFic29sdXRlIHBhdGggKGNvcGllZCBieSB0aGUgXCJDb3B5IGFzIHBhdGhcIiBidXR0b24pLlxuICAvLyBVcGRhdGVkIG9uIEpTT05ML01EL1pJUC9zY3JlZW5zaG90IHNhdmVzLlxuICBjb25zdCBsYXN0RXhwb3J0OiB7cmVsUGF0aDogc3RyaW5nIHwgbnVsbDsgYWJzUGF0aDogc3RyaW5nIHwgbnVsbDsgY29weVBhdGg6IHN0cmluZyB8IG51bGw7IHRlbXBQYXRoOiBib29sZWFuOyBraW5kOiBzdHJpbmcgfCBudWxsfSA9IHtcbiAgICByZWxQYXRoOiBudWxsLCBhYnNQYXRoOiBudWxsLCBjb3B5UGF0aDogbnVsbCwgdGVtcFBhdGg6IGZhbHNlLCBraW5kOiBudWxsLFxuICB9O1xuICBsZXQgd29ya3NwYWNlczogV29ya3NwYWNlW10gPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgbGV0IGFjdGl2ZVdzID0gJ2RlZmF1bHQnO1xuICAvLyBTZXNzaW9uIHV1aWQg4oCUIGdlbmVyYXRlZCBvbmNlIHBlciB3b3Jrc3BhY2UgYm9vdC4gR29lcyBvbnRvIGV2ZXJ5XG4gIC8vIHBhZ2Ugcm93IGFuZCBldmVyeSBzZWxlY3RvciBlbnRyeSBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzXG4gIC8vIHRvIFwid2hpY2ggc2Vzc2lvbj9cIiB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS4gU3RhYmxlIGFjcm9zcyBhXG4gIC8vIHNpbmdsZSB3b3Jrc3BhY2UgbG9hZDsgcmVzZXRzIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGxldCBzZXNzaW9uSWQ6IHN0cmluZyA9ICcnO1xuICBjb25zdCB3c01zZ0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259Lm1lc3NhZ2VzLnYxYDtcbiAgY29uc3Qgd3NTaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzLnYxYDtcbiAgLy8gUGVyc2lzdGVudCBzbmFwc2hvdCBoaXN0b3J5IHBlciB3b3Jrc3BhY2Ug4oCUIGEgQ2xlYXItYWxsIGFyY2hpdmVzIHRoZSB3aXBlZFxuICAvLyBjYXB0dXJlcytjb21tZW50cyt0aHVtYm5haWxzIGhlcmUgc28gdGhleSBjYW4gYmUgcmVzdG9yZWQgbGF0ZXIgZnJvbVxuICAvLyBTZXR0aW5ncyDihpIgV29ya3NwYWNlcy4gTGl2ZXMgaW4gdGhlIHNhbWUgY2hyb21lLnN0b3JhZ2UgbGF5ZXIgYXMgdGhlIHJlc3RcbiAgLy8gb2YgdGhlIHdvcmtzcGFjZSBkYXRhLlxuICBjb25zdCB3c1NuYXBzaG90c0tleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNuYXBzaG90cy52MWA7XG4gIC8vIENhcCBzbyB0aGUgaGlzdG9yeSBjYW4ndCBiYWxsb29uIHN0b3JhZ2U7IG9sZGVzdCBzbmFwc2hvdHMgZHJvcCBvZmYuXG4gIGNvbnN0IFdTX1NOQVBTSE9UX0NBUCA9IDEwO1xuICBjb25zdCB3c1Nob3RzRnVsbEtleSA9IChuOiBzdHJpbmcpOiBzdHJpbmcgPT4gYHBpbmNoZ3JhYi53cy4ke259LnNob3RzRnVsbC52MWA7XG4gIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGhhcyBhIDEwIE1CIGRlZmF1bHQgcXVvdGE7IHdlIGJ1ZGdldCBoYWxmIG9mXG4gIC8vIHRoYXQgZm9yIGZ1bGwtcmVzb2x1dGlvbiBQTkdzICh0aGUgcmVzdCBpcyBtZXNzYWdlcywgcHJlZnMsIHRodW1icykuXG4gIC8vIFdoZW4gdGhlIGJ1ZGdldCBpcyByZWFjaGVkIHdlIEZJRk8tZXZpY3QgdGhlIG9sZGVzdCBlbnRyaWVzIChNYXBcbiAgLy8gcHJlc2VydmVzIGluc2VydGlvbiBvcmRlcikuIEVzdGltYXRlIGRhdGFVUkwgc2l6ZSA9IHN0cmluZyBsZW5ndGguXG4gIGNvbnN0IFNIT1RTX0ZVTExfQlVER0VUX0JZVEVTID0gNSAqIDEwMjQgKiAxMDI0O1xuICBjb25zdCB1bmRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHJlZG9TdGFjazogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgVU5ET19DQVAgPSAzMDtcbiAgbGV0IHN1c3BlbmRTbmFwc2hvdHMgPSBmYWxzZTtcbiAgbGV0IHByZWZzOiBQcmVmcyA9IHsuLi5ERUZBVUxUX1BSRUZTfTtcblxuICAvLyDilIDilIDilIAgU3RhdHVzIGhlbHBlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IHN0YXR1c1RpbWVyID0gMDtcbiAgY29uc3Qgc2V0U3RhdHVzID0gKG1zZzogc3RyaW5nLCBvcHRzOiB7a2luZD86ICd3YXJuJyB8ICdpbmZvJyB8ICdvayd9ID0ge30pOiB2b2lkID0+IHtcbiAgICBzdGF0dXMudGV4dENvbnRlbnQgPSBtc2cgfHwgJyc7XG4gICAgY2xlYXJUaW1lb3V0KHN0YXR1c1RpbWVyKTtcbiAgICBpZiAobXNnKSB7XG4gICAgICBzdGF0dXMuc3R5bGUuY29sb3IgPSBvcHRzLmtpbmQgPT09ICd3YXJuJyA/ICd2YXIoLS1yZWQpJyA6XG4gICAgICAgIG9wdHMua2luZCA9PT0gJ2luZm8nID8gJ3ZhcigtLXRleHQtMyknIDogJ3ZhcigtLWdyZWVuKSc7XG4gICAgICBzdGF0dXNUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7IH0sIDIyMDApO1xuICAgIH1cbiAgfTtcbiAgbGV0IHRvYXN0VGltZXIgPSAwO1xuICBjb25zdCBzaG93VG9hc3QgPSAodGl0bGU6IHN0cmluZywgZGV0YWlsID0gJycsIGtpbmQ6ICdvaycgfCAnd2FybicgPSAnb2snKTogdm9pZCA9PiB7XG4gICAgbGV0IHRvYXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWNvcHktdG9hc3RdJyk7XG4gICAgaWYgKCF0b2FzdCkge1xuICAgICAgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRvYXN0LmNsYXNzTmFtZSA9ICdjb3B5LXRvYXN0JztcbiAgICAgIHRvYXN0LmRhdGFzZXQuY29weVRvYXN0ID0gJ3RydWUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodG9hc3QpO1xuICAgIH1cbiAgICB0b2FzdC5jbGFzc0xpc3QudG9nZ2xlKCd3YXJuJywga2luZCA9PT0gJ3dhcm4nKTtcbiAgICB0b2FzdC5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJjb3B5LXRvYXN0LWljb25cIj4ke1BHX0lDT05TLnN2Z1N0cmluZyhraW5kID09PSAnd2FybicgPyAnYWxlcnQtY2lyY2xlJyA6ICdjaXJjbGUtY2hlY2snLCAyMil9PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjb3B5LXRvYXN0LXRleHRcIj48Yj4ke2VzY2FwZUh0bWwodGl0bGUpfTwvYj4ke2RldGFpbCA/IGA8c21hbGw+JHtlc2NhcGVIdG1sKGRldGFpbCl9PC9zbWFsbD5gIDogJyd9PC9zcGFuPmA7XG4gICAgdG9hc3QuaGlkZGVuID0gZmFsc2U7XG4gICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIHZvaWQgdG9hc3Qub2Zmc2V0V2lkdGg7XG4gICAgdG9hc3QuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIGNsZWFyVGltZW91dCh0b2FzdFRpbWVyKTtcbiAgICB0b2FzdFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdG9hc3Q/LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgaWYgKHRvYXN0KSB0b2FzdC5oaWRkZW4gPSB0cnVlOyB9LCAxODApO1xuICAgIH0sIDE0NTApO1xuICB9O1xuICBjb25zdCBzaG93Q29waWVkID0gKGxhYmVsOiBzdHJpbmcsIGRldGFpbCA9ICcnKTogdm9pZCA9PiBzaG93VG9hc3QobGFiZWwsIGRldGFpbCwgJ29rJyk7XG4gIGNvbnN0IHNob3dEb3dubG9hZEVycm9yID0gKGxhYmVsOiBzdHJpbmcsIGRldGFpbDogc3RyaW5nKTogdm9pZCA9PiBzaG93VG9hc3QobGFiZWwsIGRldGFpbCwgJ3dhcm4nKTtcblxuICAvLyDilIDilIDilIAgVXRpbGl0aWVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgZmFsbGJhY2tJZENvdW50ZXIgPSAwO1xuICBjb25zdCBzZWN1cmVUb2tlbiA9IChieXRlcyA9IDEyKTogc3RyaW5nID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmF3ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMpO1xuICAgICAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJhdyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShyYXcpLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9XyR7KCsrZmFsbGJhY2tJZENvdW50ZXIpLnRvU3RyaW5nKDM2KX1gO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgbXNnSWQgPSAoKTogc3RyaW5nID0+IHtcbiAgICB0cnkgeyBpZiAoZ2xvYmFsVGhpcy5jcnlwdG8ucmFuZG9tVVVJRCkgcmV0dXJuIGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQoKTsgfSBjYXRjaCB7IC8qIGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgcmV0dXJuIGBpZF8ke3NlY3VyZVRva2VuKDE2KX1gO1xuICB9O1xuICBjb25zdCBlc2NhcGVIdG1sID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgIFN0cmluZyhzKS5yZXBsYWNlQWxsKCcmJywgJyZhbXA7JykucmVwbGFjZUFsbCgnPCcsICcmbHQ7JykucmVwbGFjZUFsbCgnPicsICcmZ3Q7Jyk7XG4gIGNvbnN0IGVzY2FwZVJlID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IGhpZ2hsaWdodE1hdGNoID0gKHRleHQ6IHN0cmluZywgcTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIXEpIHJldHVybiBlc2NhcGVIdG1sKHRleHQpO1xuICAgIHJldHVybiBlc2NhcGVIdG1sKHRleHQpLnJlcGxhY2UobmV3IFJlZ0V4cChgKCR7ZXNjYXBlUmUocSl9KWAsICdnaScpLCAnPG1hcms+JDE8L21hcms+Jyk7XG4gIH07XG4gIC8vIFdhbGsgdGV4dCBub2RlcyBpbnNpZGUgYHJvb3RgLCB3cmFwcGluZyBjYXNlLWluc2Vuc2l0aXZlIG1hdGNoZXMgb2YgYHFgXG4gIC8vIGluIDxtYXJrPiBlbGVtZW50cy4gRG9lc24ndCB0b3VjaCBhdHRyaWJ1dGUgc3RyaW5ncyBvciBpbm5lci10YWcgSFRNTCBzb1xuICAvLyBpdCdzIHNhZmUgdG8gcnVuIG9uIGFscmVhZHktaGlnaGxpZ2h0ZWQgSlNPTiBvdXRwdXQuXG4gIGNvbnN0IHdyYXBTZWFyY2hIaXRzSW5UZXh0Tm9kZXMgPSAocm9vdDogSFRNTEVsZW1lbnQsIHE6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChlc2NhcGVSZShxKSwgJ2dpJyk7XG4gICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihyb290LCBOb2RlRmlsdGVyLlNIT1dfVEVYVCk7XG4gICAgY29uc3QgdGFyZ2V0czogVGV4dFtdID0gW107XG4gICAgbGV0IG5vZGU6IE5vZGUgfCBudWxsO1xuICAgIHdoaWxlICgobm9kZSA9IHdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgICAgaWYgKHJlLnRlc3Qobm9kZS5ub2RlVmFsdWUgPz8gJycpKSB0YXJnZXRzLnB1c2gobm9kZSBhcyBUZXh0KTtcbiAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgfVxuICAgIGZvciAoY29uc3QgdCBvZiB0YXJnZXRzKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHQubm9kZVZhbHVlID8/ICcnO1xuICAgICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGxldCBsYXN0ID0gMDtcbiAgICAgIGZvciAoY29uc3QgbSBvZiB2YWx1ZS5tYXRjaEFsbChyZSkpIHtcbiAgICAgICAgY29uc3QgaSA9IG0uaW5kZXggPz8gMDtcbiAgICAgICAgaWYgKGkgPiBsYXN0KSBmcmFnLmFwcGVuZCh2YWx1ZS5zbGljZShsYXN0LCBpKSk7XG4gICAgICAgIGNvbnN0IG1rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWFyaycpO1xuICAgICAgICBtay50ZXh0Q29udGVudCA9IG1bMF07XG4gICAgICAgIGZyYWcuYXBwZW5kKG1rKTtcbiAgICAgICAgbGFzdCA9IGkgKyBtWzBdLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0IDwgdmFsdWUubGVuZ3RoKSBmcmFnLmFwcGVuZCh2YWx1ZS5zbGljZShsYXN0KSk7XG4gICAgICB0LnJlcGxhY2VXaXRoKGZyYWcpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgd29yZENvdW50ID0gKHM6IHN0cmluZyk6IG51bWJlciA9PiAocy5tYXRjaCgvXFxTKy9nKSA/PyBbXSkubGVuZ3RoO1xuICBjb25zdCB0b2tlbkNvdW50ID0gKHM6IHN0cmluZyk6IG51bWJlciA9PiBNYXRoLmNlaWwocy5sZW5ndGggLyA0KTtcbiAgY29uc3QgcGF0aE9mID0gKHU6IHN0cmluZyk6IHN0cmluZyA9PiB7IHRyeSB7IHJldHVybiBuZXcgVVJMKHUpLnBhdGhuYW1lOyB9IGNhdGNoIHsgcmV0dXJuIHU7IH0gfTtcbiAgY29uc3QgaG9zdE9mID0gKHU6IHN0cmluZyk6IHN0cmluZyA9PiB7IHRyeSB7IHJldHVybiBuZXcgVVJMKHUpLmhvc3Q7IH0gY2F0Y2ggeyByZXR1cm4gJyc7IH0gfTtcbiAgLy8gRmlsZW5hbWUtc2FmZSBob3N0IHNsdWc6IGRvdHMg4oaSIHVuZGVyc2NvcmVzIHBlciBwcm9qZWN0IGNvbnZlbnRpb24uXG4gIC8vIE1pcnJvcnMgYmFja2dyb3VuZC50cyBob3N0U2x1ZyBmb3Igc3ltbWV0cnkgYWNyb3NzIHNjcmVlbnNob3QgKyBleHBvcnRcbiAgLy8gZmlsZW5hbWVzLlxuICBjb25zdCBob3N0U2x1ZyA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgaCA9IGhvc3RPZih1cmwpO1xuICAgIGlmICghaCkgcmV0dXJuICd1bmtub3duJztcbiAgICByZXR1cm4gaC5yZXBsYWNlKC9cXC4vZywgJ18nKS5yZXBsYWNlKC9bXlxcdy1dL2csICdfJykuc2xpY2UoMCwgNDApIHx8ICd1bmtub3duJztcbiAgfTtcbiAgLy8gUGljayB0aGUgbW9zdC1mcmVxdWVudCBob3N0IGFjcm9zcyBhbGwgc2VsZWN0b3IgY2FwdHVyZXMgKGZvciBleHBvcnRcbiAgLy8gZmlsZW5hbWVzKS4gV2hlbiB0aGUgd29ya3NwYWNlIHNwYW5zIG11bHRpcGxlIGhvc3RzLCByZXR1cm4gJ211bHRpJy5cbiAgY29uc3QgZG9taW5hbnRIb3N0U2x1ZyA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGNvdW50cyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGggPSBob3N0U2x1ZyhtLmVudHJ5LnVybCk7XG4gICAgICBjb3VudHMuc2V0KGgsIChjb3VudHMuZ2V0KGgpID8/IDApICsgMSk7XG4gICAgfVxuICAgIGlmICghY291bnRzLnNpemUpIHJldHVybiAnZW1wdHknO1xuICAgIGxldCBiZXN0ID0gJyc7XG4gICAgbGV0IGJlc3ROID0gMDtcbiAgICBmb3IgKGNvbnN0IFtoLCBuXSBvZiBjb3VudHMpIHtcbiAgICAgIGlmIChuID4gYmVzdE4pIHsgYmVzdCA9IGg7IGJlc3ROID0gbjsgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnRzLnNpemUgPiAxID8gJ211bHRpJyA6IGJlc3Q7XG4gIH07XG4gIC8vIERpc3RpbmN0IGhvc3RzIHByZXNlbnQgaW4gdGhpcyB3b3Jrc3BhY2UgKGFscGhhYmV0aWNhbCwgY2FwcGVkKS4gVXNlZCBpblxuICAvLyB0aGUgZXhwb3J0IG1hbmlmZXN0J3MgYGhvc3RzYCBmaWVsZC5cbiAgY29uc3QgZGlzdGluY3RIb3N0cyA9ICgpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgc2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGggPSBob3N0T2YobS5lbnRyeS51cmwpO1xuICAgICAgaWYgKGgpIHNldC5hZGQoaCk7XG4gICAgfVxuICAgIHJldHVybiBbLi4uc2V0XS5zb3J0KCkuc2xpY2UoMCwgMjApO1xuICB9O1xuICAvLyBCdWlsZCBhIGZpbGVuYW1lIG9mIHRoZSBzaGFwZSBgcGluY2hncmFiLTx3b3Jrc3BhY2U+LTxob3N0Pi08ZXBvY2g+LjxleHQ+YC5cbiAgY29uc3QgYnVpbGRFeHBvcnRGaWxlbmFtZSA9IChleHQ6ICdqc29ubCcgfCAnbWQnIHwgJ3Rhci56c3QnKTogc3RyaW5nID0+XG4gICAgYHBpbmNoZ3JhYi0ke2FjdGl2ZVdzfS0ke2RvbWluYW50SG9zdFNsdWcoKX0tJHtEYXRlLm5vdygpfS4ke2V4dH1gO1xuICAvLyBTa2lwLWxpc3QgbWF0Y2g6IHN1YnN0cmluZyAoY2FzZS1pbnNlbnNpdGl2ZSkgbWF0Y2ggYWdhaW5zdCB0aGUgVVJMJ3NcbiAgLy8gaG9zdC4gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgVVJMIHBhcnNpbmcgb24gdGhlIHBhdHRlcm5zIHNvIHRoZSB1c2VyXG4gIC8vIGNhbiB3cml0ZSBgd3Jhbm5nbGUuY29tYCBhbmQgaGF2ZSBpdCBtYXRjaCBgYXBwLndyYW5uZ2xlLmNvbWAgdG9vLlxuICBjb25zdCBzaG91bGRTa2lwU2NyZWVuc2hvdCA9ICh1cmw6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGxpc3QgPSAocHJlZnMuc2tpcFNjcmVlbnNob3RIb3N0cyA/PyAnJykuc3BsaXQoJywnKS5tYXAoKHMpID0+IHMudHJpbSgpLnRvTG93ZXJDYXNlKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaG9zdCA9IGhvc3RPZih1cmwpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGxpc3Quc29tZSgocGF0KSA9PiBob3N0LmluY2x1ZGVzKHBhdCkpO1xuICB9O1xuXG4gIC8vIEpTT04gc3ludGF4IGhpZ2hsaWdodCAocGVyLWtleSBjb2xvciBpcyBoYXNoZWQgZm9yIHZpc3VhbCB2YXJpZXR5KS5cbiAgY29uc3QgS0VZX1BBTEVUVEUgPSBbJyNmZjdlNzgnLCAnI2ZmYjQ1NCcsICcjZmZlMDY2JywgJyM3YmQ5N2EnLCAnIzVmZDFmZicsICcjOWI4Y2ZmJywgJyNmZjg1YzEnLCAnI2ZmNWYwMCcsICcjMTBiOTgxJywgJyNmNTllMGInLCAnI2E3OGJmYScsICcjMzRkMzk5J107XG4gIGNvbnN0IGNvbG9yRm9yS2V5ID0gKGs6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgbGV0IGggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgay5sZW5ndGg7IGkrKykgaCA9IChoICogMzEgKyBrLmNoYXJDb2RlQXQoaSkpID4+PiAwO1xuICAgIHJldHVybiBLRVlfUEFMRVRURVtoICUgS0VZX1BBTEVUVEUubGVuZ3RoXSE7XG4gIH07XG4gIGNvbnN0IEpTT05fVE9LRU5fUkUgPSAvKFxccyspfChcIig/OlteXCJcXFxcXXxcXFxcLikqXCIpfCh0cnVlfGZhbHNlfG51bGwpfCgtP1xcZCsoPzpcXC5cXGQrKT8oPzpbZUVdWystXT9cXGQrKT8pfChbe31bXFxdLDpdKS9nO1xuICBjb25zdCBhcHBlbmRKc29uSGlnaGxpZ2h0ID0gKHJvb3Q6IEhUTUxFbGVtZW50LCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICByb290LnRleHRDb250ZW50ID0gJyc7XG4gICAgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIEpTT05fVE9LRU5fUkUubGFzdEluZGV4ID0gMDtcbiAgICB3aGlsZSAoKG0gPSBKU09OX1RPS0VOX1JFLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBpZiAobS5pbmRleCA+IGxhc3QpIHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCwgbS5pbmRleCkpKTtcbiAgICAgIGxhc3QgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgIGNvbnN0IFssIHdzLCBzdHIsIGxpdCwgbnVtLCBwdW5jdF0gPSBtO1xuICAgICAgaWYgKHdzKSB7IHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHdzKSk7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoc3RyKSB7XG4gICAgICAgIGxldCBrID0gSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXg7XG4gICAgICAgIHdoaWxlIChrIDwgdGV4dC5sZW5ndGggJiYgKHRleHRba10gPT09ICcgJyB8fCB0ZXh0W2tdID09PSAnXFx0JyB8fCB0ZXh0W2tdID09PSAnXFxuJykpIGsrKztcbiAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgaWYgKHRleHRba10gPT09ICc6Jykge1xuICAgICAgICAgIGxldCBrZXk6IHN0cmluZztcbiAgICAgICAgICB0cnkgeyBrZXkgPSBKU09OLnBhcnNlKHN0cikgYXMgc3RyaW5nOyB9IGNhdGNoIHsga2V5ID0gc3RyLnNsaWNlKDEsIC0xKTsgfVxuICAgICAgICAgIHNwYW4uY2xhc3NOYW1lID0gJ2snO1xuICAgICAgICAgIHNwYW4uc3R5bGUuY29sb3IgPSBjb2xvckZvcktleShrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW4uY2xhc3NOYW1lID0gJ3MnO1xuICAgICAgICB9XG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBzdHI7XG4gICAgICAgIHJvb3QuYXBwZW5kKHNwYW4pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBpZiAobGl0KSBzcGFuLmNsYXNzTmFtZSA9ICdiJztcbiAgICAgIGVsc2UgaWYgKG51bSkgc3Bhbi5jbGFzc05hbWUgPSAnbic7XG4gICAgICBlbHNlIGlmIChwdW5jdCkgc3Bhbi5jbGFzc05hbWUgPSAncCc7XG4gICAgICBzcGFuLnRleHRDb250ZW50ID0gbGl0ID8/IG51bSA/PyBwdW5jdCA/PyAnJztcbiAgICAgIHJvb3QuYXBwZW5kKHNwYW4pO1xuICAgIH1cbiAgICBpZiAobGFzdCA8IHRleHQubGVuZ3RoKSByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKGxhc3QpKSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlcnNpc3RlbmNlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBsb2FkQWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHdvcmtzcGFjZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVtdPihXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcykpIHx8IHdvcmtzcGFjZXM7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmxlbmd0aCkgd29ya3NwYWNlcyA9IFt7bmFtZTogJ2RlZmF1bHQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dO1xuICAgIGFjdGl2ZVdzID0gKGF3YWl0IFN0b3JlLmdldDxzdHJpbmc+KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgJ2RlZmF1bHQnKSkgfHwgJ2RlZmF1bHQnO1xuICAgIGlmICghd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IGFjdGl2ZVdzKSkgYWN0aXZlV3MgPSB3b3Jrc3BhY2VzWzBdIS5uYW1lO1xuICAgIHByZWZzID0gey4uLkRFRkFVTFRfUFJFRlMsIC4uLihhd2FpdCBTdG9yZS5nZXQ8UGFydGlhbDxQcmVmcz4+KFBSRUZTX1NUT1JBR0VfTkFNRSwge30pKX07XG4gICAgLy8gUGF0aCBtaWdyYXRpb246IHByaW9yIHZlcnNpb25zIGRlZmF1bHRlZCBza2lsbFBhdGggdG9cbiAgICAvLyBgfi8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAsIGFuZCBzb21lIHVzZXJzIGhhZCBpdCBzdG9yZWQgYXNcbiAgICAvLyBgfi8uZG90ZmlsZXMvLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLiBUaGUgc2tpbGwgd2FzIHJlbmFtZWRcbiAgICAvLyB0byBgUGluY2hHcmFiYDsgYW55IGB+Ly5kb3RmaWxlcy9gIHByZWZpeCBpcyBzdHJpcHBlZCBmcm9tXG4gICAgLy8gZXhwb3NlZCBkZWZhdWx0cyAoZG90ZmlsZXMgaXMgYSBwZXJzb25hbCBjb25maWcgc291cmNlIOKAlCBleHBvcnRzXG4gICAgLy8gc2hvdWxkbid0IGxlYWsgdGhhdCBwYXRoKS5cbiAgICBjb25zdCB1cGdyYWRlUGF0aCA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQsIGZyZXNoOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgaWYgKCFwKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5pbmNsdWRlcygnLmRvdGZpbGVzJykpIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmVuZHNXaXRoKCdza2lsbHMvdWkvU0tJTEwubWQnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25QYXRoID0gdXBncmFkZVBhdGgocHJlZnMuZGVzaWduUGF0aCwgREVGQVVMVF9QUkVGUy5kZXNpZ25QYXRoKTtcbiAgICBwcmVmcy5za2lsbFBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5za2lsbFBhdGgsIERFRkFVTFRfUFJFRlMuc2tpbGxQYXRoKTtcbiAgICAvLyBDb250ZW50IG1pZ3JhdGlvbjogcHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHRoZSBlbnRpcmUgdGVtcGxhdGVcbiAgICAvLyB0ZXh0IGluc2lkZSBgcHJlZnMuZGVzaWduTWRgIC8gYHByZWZzLnNraWxsTWRgIGFzIGRlZmF1bHRzLiBUaGF0XG4gICAgLy8gYXRlIH4zNjBLQiBvZiBjaHJvbWUuc3RvcmFnZSBxdW90YSBmb3Igbm8gYmVuZWZpdC4gRGV0ZWN0IHdoZW5cbiAgICAvLyB0aGUgc3RvcmVkIHZhbHVlIG1hdGNoZXMgb25lIG9mIHRoZSBidW5kbGVkIHRlbXBsYXRlcyBhbmQgY2xlYXJcbiAgICAvLyBpdCDigJQgdGhlIHJlc29sdmVyIGZhbGxzIGJhY2sgdG8gdGhlIGJ1bmRsZWQgZmlsZSBvbiB0aGUgZmx5LlxuICAgIC8vIEFsc28gc2NydWIgYW55IGxlYWtlZCBgfi8uZG90ZmlsZXMvYCBzdWJzdHJpbmcuXG4gICAgY29uc3Qgc2NydWJEb3RmaWxlcyA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgIHMucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvLmFnZW50cy8nLCAnfi8uYWdlbnRzLycpXG4gICAgICAgLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLycsICd+Ly5hZ2VudHMvJyk7XG4gICAgY29uc3QgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZSA9IGFzeW5jIChjdXJyZW50OiBzdHJpbmcsIGtleXM6IFRlbXBsYXRlS2V5W10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgaWYgKCFjdXJyZW50IHx8ICFjdXJyZW50LnRyaW0oKSkgcmV0dXJuICcnO1xuICAgICAgY29uc3QgdHJpbW1lZCA9IGN1cnJlbnQudHJpbSgpO1xuICAgICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgdHBsID0gKGF3YWl0IGxvYWRUZW1wbGF0ZShrKSkudHJpbSgpO1xuICAgICAgICBpZiAodHBsICYmIHRwbCA9PT0gdHJpbW1lZCkgcmV0dXJuICcnOyAvLyBtYXRjaGVzIGEgYnVuZGxlZCB0ZW1wbGF0ZSDigJQgY29sbGFwc2UgdG8gZW1wdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJyZW50LmluY2x1ZGVzKCcuZG90ZmlsZXMnKSA/IHNjcnViRG90ZmlsZXMoY3VycmVudCkgOiBjdXJyZW50O1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLmRlc2lnbk1kID8/ICcnLCBbJ2xvY2FsRGVzaWduJywgJ2Rlc2lnblRlbXBsYXRlJ10pO1xuICAgIHByZWZzLnNraWxsTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLnNraWxsTWQgPz8gJycsIFsnbG9jYWxTa2lsbCcsICdza2lsbFRlbXBsYXRlJ10pO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UoYWN0aXZlV3MpO1xuICB9O1xuICBjb25zdCBsb2FkV29ya3NwYWNlID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGFjdGl2ZVdzID0gbmFtZTtcbiAgICB2b2lkIFN0b3JlLnNldCgncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsIG5hbWUpO1xuICAgIC8vIE1pbnQgYSBuZXcgc2Vzc2lvbklkIHBlciB3b3Jrc3BhY2UgbG9hZC4gU2FtZSB3b3Jrc3BhY2UgcmUtb3BlbmVkXG4gICAgLy8gPSBuZXcgc2Vzc2lvbjogZGlzdGluY3QgdXVpZCBzbyBhIGNvbnN1bWVyIGNhbiB0ZWxsIHR3byBib290c1xuICAgIC8vIGFwYXJ0IGV2ZW4gd2hlbiB0aGUgY2FwdHVyZXMgbGFuZCBpbiB0aGUgc2FtZSBvbi1kaXNrIGZpbGUuXG4gICAgc2Vzc2lvbklkID0gbXNnSWQoKTtcbiAgICBtZXNzYWdlcyA9IChhd2FpdCBTdG9yZS5nZXQ8UGFuZWxNZXNzYWdlW10+KHdzTXNnS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIG1lc3NhZ2VzID0gW107XG4gICAgLy8gTWlncmF0ZSBsZWdhY3kgZW50cmllcyAobm8gdWlkLCBzdGF0ZXMtYXMtcmVjb3JkLCBhdHRycy5mb3JtYXQpIGFuZFxuICAgIC8vIHBlcnNpc3QgaWYgYW55dGhpbmcgY2hhbmdlZCBzbyB3ZSBkb24ndCBwYXkgdGhlIG1pZ3JhdGlvbiBjb3N0IGFnYWluXG4gICAgLy8gbmV4dCBsb2FkLlxuICAgIGlmIChtaWdyYXRlTG9hZGVkTWVzc2FnZXMoKSkgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkobmFtZSksIG1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBhZ2VTaG90c0ZpcmVkLmNsZWFyKCk7XG4gICAgY29uc3Qgc3RvcmVkID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZCkpIHNob3RzLnNldChrLCB2KTtcbiAgICAvLyBSZXN0b3JlIHRoZSBmdWxsLXJlc29sdXRpb24gUE5HIGNhY2hlIHNvIGEgd29ya3NwYWNlIGFyY2hpdmVcbiAgICAvLyBleHBvcnRlZCBBRlRFUiBhIHBhbmVsIHJlbG9hZCBzdGlsbCBidW5kbGVzIHNjcmVlbnNob3RzIGZyb21cbiAgICAvLyBlYXJsaWVyIGNhcHR1cmVzLiBGSUZPIG9yZGVyIGlzIHByZXNlcnZlZCBieSBPYmplY3Qga2V5IG9yZGVyLlxuICAgIGNvbnN0IHN0b3JlZEZ1bGwgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNGdWxsS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZEZ1bGwpKSBzaG90c0Z1bGwuc2V0KGssIHYpO1xuICAgIC8vIExvYWQgdGhpcyB3b3Jrc3BhY2UncyBwZXJzaXN0ZW50IHNuYXBzaG90IGhpc3RvcnkgKENsZWFyLWFsbCBhcmNoaXZlcykuXG4gICAgYXdhaXQgbG9hZFdzU25hcHNob3RzKG5hbWUpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBzZWxlY3RvckVycm9ycy5jbGVhcigpO1xuICAgIHVuZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBudWxsO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3QgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkoYWN0aXZlV3MpLCBtZXNzYWdlcyk7XG4gICAgLy8gUHVzaCBjYXB0dXJlZC1zZWxlY3RvciBzZXQgc28gdGhlIGNvbnRlbnQgc2NyaXB0J3MgaG92ZXIgd2Fsa2VyIGNhblxuICAgIC8vIHJlc29sdmUgZGVzY2VuZGFudHMg4oaSIGNhcHR1cmVkIGFuY2VzdG9yLlxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBzZW5kVG9DUyh7a2luZDogJ3NldC1jYXB0dXJlZCcsIHNlbGVjdG9yc30pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0UHJlZnMgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQoUFJFRlNfU1RPUkFHRV9OQU1FLCBwcmVmcyk7XG4gICAgLy8gUHVzaCB0aGUgc3Vic2V0IG9mIHByZWZzIHRoZSBjb250ZW50IHNjcmlwdCBjYXJlcyBhYm91dCBzbyBpdHNcbiAgICAvLyBvdmVybGF5IChzcGFjaW5nIHZpc3VhbGl6ZXIsIGhvdmVyIHNuYXAsIGV0Yy4pIHJlZmxlY3RzIHRoZSBsYXRlc3QuXG4gICAgdm9pZCBzZW5kVG9DUyh7XG4gICAgICBraW5kOiAnc2V0LWNzLXByZWZzJyxcbiAgICAgIHNwYWNpbmdPdmVybGF5OiBwcmVmcy5zcGFjaW5nT3ZlcmxheSxcbiAgICAgIGhvdmVyU25hcDogcHJlZnMuaG92ZXJTbmFwLFxuICAgIH0pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHMpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0tleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgcGVyc2lzdGVuY2Ugd2l0aCBGSUZPIGV2aWN0aW9uLiBkYXRhVVJMIHN0cmluZ3NcbiAgLy8gY2FuIHJ1biA1MC01MDAgS0IgZWFjaDsgdGhlIGRlZmF1bHQgcXVvdGEgZ2V0cyBleGhhdXN0ZWQgaW4gdGVucyBvZlxuICAvLyBjYXB0dXJlcyB3aXRob3V0IGEgYnVkZ2V0LiBNYXAgaW5zZXJ0aW9uIG9yZGVyID0gRklGTyBvcmRlciwgc29cbiAgLy8gd2UgZXZpY3QgZnJvbSB0aGUgZnJvbnQgdW50aWwgdW5kZXIgYnVkZ2V0IGJlZm9yZSBwZXJzaXN0aW5nLlxuICBjb25zdCBldmljdFNob3RzRnVsbFRvQnVkZ2V0ID0gKCk6IG51bWJlciA9PiB7XG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2hvdHNGdWxsLnZhbHVlcygpKSB0b3RhbCArPSB2Lmxlbmd0aDtcbiAgICBsZXQgZXZpY3RlZCA9IDA7XG4gICAgd2hpbGUgKHRvdGFsID4gU0hPVFNfRlVMTF9CVURHRVRfQllURVMpIHtcbiAgICAgIGNvbnN0IGZpcnN0S2V5ID0gc2hvdHNGdWxsLmtleXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICBpZiAoZmlyc3RLZXkgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBjb25zdCByZW1vdmVkID0gc2hvdHNGdWxsLmdldChmaXJzdEtleSk7XG4gICAgICBpZiAocmVtb3ZlZCA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIHNob3RzRnVsbC5kZWxldGUoZmlyc3RLZXkpO1xuICAgICAgdG90YWwgLT0gcmVtb3ZlZC5sZW5ndGg7XG4gICAgICBldmljdGVkKys7XG4gICAgfVxuICAgIHJldHVybiBldmljdGVkO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHNGdWxsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGV2aWN0ZWQgPSBldmljdFNob3RzRnVsbFRvQnVkZ2V0KCk7XG4gICAgaWYgKGV2aWN0ZWQgPiAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csIGBzaG90c0Z1bGwgRklGTy1ldmljdGVkICR7ZXZpY3RlZH0gb2xkZXN0IGVudHJpZXMgdG8gZml0ICR7U0hPVFNfRlVMTF9CVURHRVRfQllURVMgLyAxMDI0IC8gMTAyNH1NQiBidWRnZXRgKTtcbiAgICB9XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHNGdWxsKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNGdWxsS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFdvcmtzcGFjZXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKTsgfTtcblxuICAvLyDilIDilIDilIAgU25hcHNob3QgLyB1bmRvIC8gcmVkbyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc25hcHNob3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN1c3BlbmRTbmFwc2hvdHMpIHJldHVybjtcbiAgICBpZiAodW5kb1N0YWNrLmxlbmd0aCA+PSBVTkRPX0NBUCkgdW5kb1N0YWNrLnNoaWZ0KCk7XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZXN0b3JlID0gKGpzb246IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSB0cnVlO1xuICAgIHRyeSB7IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShqc29uKSBhcyBQYW5lbE1lc3NhZ2VbXTsgfSBjYXRjaCB7IG1lc3NhZ2VzID0gW107IH1cbiAgICBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICBjb25zdCB1bmRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghdW5kb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gdW5kbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgcmVkb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHVuZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnVW5kb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVkbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXJlZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHJlZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZShyZWRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1JlZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVVuZG9CdXR0b25zID0gKCk6IHZvaWQgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInVuZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCB1bmRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJyZWRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgcmVkb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUNvcHlQYXRoQnV0dG9uID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1hY3Rpb249XCJjb3B5LXBhdGhcIl0nKTtcbiAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgIGNvbnN0IGhhcyA9IEJvb2xlYW4obGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGgpO1xuICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsICFoYXMpO1xuICAgIGJ0bi5kYXRhc2V0LnRpcCA9IGhhc1xuICAgICAgPyBgQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LlxcbiR7bGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGggPz8gJyd9YFxuICAgICAgOiAnQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LiBSdW4gYW4gZXhwb3J0IGZpcnN0Lic7XG4gIH07XG4gIGNvbnN0IG9uQ29weVBhdGggPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoO1xuICAgIGlmICghcGF0aFRvQ29weSkge1xuICAgICAgc2V0U3RhdHVzKCdObyBleHBvcnQgeWV0IOKAlCBydW4gYSBkb3dubG9hZCBmaXJzdCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHBhdGhUb0NvcHkpO1xuICAgICAgLy8gU2hvdyBvbmx5IHRoZSBsZWFmIGZpbGVuYW1lIGluIHRoZSBzdGF0dXMg4oCUIHRoZSBmdWxsIFdpbmRvd3Mtc3R5bGVcbiAgICAgIC8vIGFic29sdXRlIHBhdGggd291bGQgYmUgMTAwKyBjaGFycyBhbmQgd2FzIGRpc3J1cHRpbmcgdGhlIHNpZGViYXJcbiAgICAgIC8vIGxheW91dCBmb3IgdGhlIDItc2Vjb25kIHN0YXR1cyBUVEwuXG4gICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgc2V0U3RhdHVzKGBDb3BpZWQgcGF0aCDCtyAke2xlYWZ9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgcGF0aCcsIGxlYWYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIHdyaXRlIGZhaWxlZDogJyArIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2UgdG8gYWN0aXZlIHRhYiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZFRvQ1MgPSBhc3luYyAocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgbXNnID0gcGcocGF5bG9hZCk7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBpZiAodGFic1swXT8uaWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgbXNnKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IG1zZ30pKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZW5kVG9DU0FuZFdhaXQgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4gbmV3IFByb21pc2U8UiB8IG51bGw+KChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikge1xuICAgICAgY29uc3QgcmVxSWQgPSBgcmVxXyR7c2VjdXJlVG9rZW4oMTIpfWA7XG4gICAgICBjb25zdCBvblJlc3AgPSAoZTogRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3QgZGV0YWlsID0gKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbDtcbiAgICAgICAgaWYgKGRldGFpbD8uX19yZXFJZCA9PT0gcmVxSWQpIHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTtcbiAgICAgICAgICByZXNvbHZlKGRldGFpbC5yZXBseSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLWNzJywge2RldGFpbDoge19fcmVxSWQ6IHJlcUlkLCAuLi5wZyhwYXlsb2FkKX19KSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7IHJlc29sdmUobnVsbCk7IH0sIDEwMDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgKHRhYnMpID0+IHtcbiAgICAgIGlmICghdGFic1swXT8uaWQpIHsgcmVzb2x2ZShudWxsKTsgcmV0dXJuOyB9XG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCBwZyhwYXlsb2FkKSwgKHI6IFIpID0+IHJlc29sdmUocikpO1xuICAgIH0pO1xuICB9KTtcbiAgY29uc3Qgc2VuZFRvQmcgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0JnKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHJldHVybiBudWxsO1xuICAgIHRyeSB7IHJldHVybiAoYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UocGcocGF5bG9hZCkpKSBhcyBSOyB9XG4gICAgY2F0Y2ggKGUpIHsgcmV0dXJuIHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gYXMgdW5rbm93biBhcyBSOyB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFJlY2VpdmluZyBmcm9tIGNvbnRlbnQgc2NyaXB0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBEZWZlbnNpdmUgcmluZy1idWZmZXIgZGVkdXBlOiBldmVuIHRob3VnaCB3ZSBub3cgdXNlIG9ubHkgb25lIGNoYW5uZWwsXG4gIC8vIGFueSBtZXNzYWdlIHRoYXQgc29tZWhvdyBhcnJpdmVzIHR3aWNlIHdpdGhpbiB+MiBzZWNvbmRzIGlzIGlnbm9yZWQuXG4gIGNvbnN0IHJlY2VudE1pZHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFJFQ0VOVF9NSURfQ0FQID0gNjQ7XG4gIGNvbnN0IG9uQ3NNZXNzYWdlID0gKG1zZzogUGdFbnZlbG9wZTxDc1RvUGFuZWw+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFtc2cgfHwgbXNnLl9fcGcgIT09IHRydWUpIHJldHVybjtcbiAgICBpZiAobXNnLl9fbWlkKSB7XG4gICAgICBpZiAocmVjZW50TWlkcy5pbmNsdWRlcyhtc2cuX19taWQpKSByZXR1cm47XG4gICAgICByZWNlbnRNaWRzLnB1c2gobXNnLl9fbWlkKTtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmxlbmd0aCA+IFJFQ0VOVF9NSURfQ0FQKSByZWNlbnRNaWRzLnNoaWZ0KCk7XG4gICAgfVxuICAgIHN3aXRjaCAobXNnLmtpbmQpIHtcbiAgICAgIGNhc2UgJ2NhcHR1cmUnOiBvbkNhcHR1cmUobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXInOiBvbkhvdmVyKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdob3Zlcid9Pik7IHJldHVybjtcbiAgICAgIGNhc2UgJ2hvdmVyLWVuZCc6IG9uSG92ZXJFbmQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1hZGQnOiBvblBlbmRpbmdBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1jbGVhcic6IG9uUGVuZGluZ0NsZWFyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2ZlZWRiYWNrLWFkZCc6IG9uRmVlZGJhY2tBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncHJlZmVyZW5jZS1jaGFuZ2UnOiBvblByZWZlcmVuY2VDaGFuZ2UobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGFnZS1zbmFwc2hvdCc6IG9uUGFnZVNuYXBzaG90KChtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncGFnZS1zbmFwc2hvdCd9PikucGF5bG9hZCk7IHJldHVybjtcbiAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25QcmVmZXJlbmNlQ2hhbmdlID0gKHtyZWFzb24sIHBhZ2V9OiB7cmVhc29uOiBzdHJpbmc7IHBhZ2U6IGFueX0pOiB2b2lkID0+IHtcbiAgICBsaXZlVGFiVXJsID0gcGFnZT8udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgbGl2ZVRhYlBhdGggPSBsaXZlVGFiVXJsID8gcGF0aE9mKGxpdmVUYWJVcmwpIDogbGl2ZVRhYlBhdGg7XG4gICAgLy8gUGFnZSByb3dzIGFyZSBjYXB0dXJlIGhlYWRlcnMsIG5vdCBhIHRhYi9wYWdlIHRlbGVtZXRyeSBmZWVkLiBUaGUgbmV4dFxuICAgIC8vIHNlbGVjdG9yIGNhcHR1cmUgZnJvbSB0aGlzIHBhZ2Ugd2lsbCBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0L3N0YXRlIGFuZFxuICAgIC8vIGluc2VydCBhIHBhZ2UgaGVhZGVyIG9ubHkgaWYgbmVlZGVkLlxuICAgIHNldFN0YXR1cyhgJHtyZWFzb259IGNoYW5nZWRgLCB7a2luZDogJ2luZm8nfSk7XG4gIH07XG5cbiAgLy8gUGFnZS1ncm91cCByZWNvcmRzIG1heSBjYXJyeSBhIGZ1bGwtcGFnZSBzbmFwc2hvdCAodmlld3BvcnQsIHNjcm9sbFxuICAvLyBleHRlbnRzLCBkcHIsIGxhbmcsIGZ1bGwtcGFnZSBzY3JlZW5zaG90KS4gUGFnZU1lc3NhZ2UgaW4gdHlwZXMudHMgZG9lc24ndFxuICAvLyB5ZXQgZGVjbGFyZSB0aGUgZmllbGQsIHNvIHdlIHdpZGVuIGl0IGxvY2FsbHkg4oCUIHRoZSB2YWx1ZSBwZXJzaXN0cyB3aXRoXG4gIC8vIHRoZSByZXN0IG9mIHRoZSBtZXNzYWdlIEpTT04gYW5kIHJvdW5kLXRyaXBzIHRocm91Z2ggZXhwb3J0LlxuICB0eXBlIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90ID0gUGFnZU1lc3NhZ2UgJiB7c25hcHNob3Q/OiBQYWdlU25hcHNob3R9O1xuICAvLyBTbmFwc2hvdHMgdGhhdCBhcnJpdmVkIGJlZm9yZSBhIHBhZ2UtZ3JvdXAgcmVjb3JkIGV4aXN0cyBmb3IgdGhlaXIgVVJMLlxuICAvLyBBcHBsaWVkIHdoZW4gdGhlIHBhZ2UgaGVhZGVyIGlzIGxhdGVyIGNyZWF0ZWQgKHNlZSBvbkNhcHR1cmUpLlxuICBjb25zdCBwZW5kaW5nU25hcHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIFBhZ2VTbmFwc2hvdD4oKTtcbiAgY29uc3QgYXBwbHlTbmFwc2hvdFRvUGFnZSA9IChzbmFwOiBQYWdlU25hcHNob3QpOiBib29sZWFuID0+IHtcbiAgICAvLyBBdHRhY2ggdG8gdGhlIG1vc3QgcmVjZW50IHBhZ2UtZ3JvdXAgcmVjb3JkIGZvciB0aGlzIFVSTC5cbiAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlID09PSAncGFnZScgJiYgbS51cmwgPT09IHNuYXAudXJsKSB7XG4gICAgICAgIChtIGFzIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90KS5zbmFwc2hvdCA9IHNuYXA7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IG9uUGFnZVNuYXBzaG90ID0gKHBheWxvYWQ6IFBhZ2VTbmFwc2hvdCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGF5bG9hZD8udXJsKSByZXR1cm47XG4gICAgaWYgKGFwcGx5U25hcHNob3RUb1BhZ2UocGF5bG9hZCkpIHtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwYWdlIHJlY29yZCB5ZXQg4oCUIHN0YXNoIGZvciB0aGUgbmV4dCBjYXB0dXJlIG9uIHRoaXMgVVJMLlxuICAgICAgcGVuZGluZ1NuYXBzaG90cy5zZXQocGF5bG9hZC51cmwsIHBheWxvYWQpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvbkZlZWRiYWNrQWRkID0gKHtzZWxlY3RvciwgdGV4dCwgdXJsLCBwYXJlbnRVaWR9OiB7c2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ30pOiB2b2lkID0+IHtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgaW4gcHJpb3JpdHkgb3JkZXI6XG4gICAgLy8gICAxLiBwYXJlbnRVaWQg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBzdXBwbGllZCBhIHN0YWJsZSB1aWQgKHRoZVxuICAgIC8vICAgICAgc3Ryb25nZXN0IG1hdGNoOyBzdXJ2aXZlcyBzZWxlY3RvciBjaGFuZ2VzLCBzaWJsaW5nXG4gICAgLy8gICAgICBjb2xsaXNpb25zLCBtdWx0aXBsZSBjYXB0dXJlcyBvZiB0aGUgc2FtZSBlbGVtZW50KS5cbiAgICAvLyAgIDIuIHNlbGVjdG9yICsgdXJsIOKAlCBjb21wb3NpdGUga2V5OyBwcmV2ZW50cyBjcm9zcy1wYWdlXG4gICAgLy8gICAgICBjb250YW1pbmF0aW9uIHdoZW4gdGhlIHNhbWUgc2VsZWN0b3IgZXhpc3RzIG9uIG11bHRpcGxlIFVSTHMuXG4gICAgLy8gICAzLiBzZWxlY3RvciArIGxpdmVUYWJVcmwg4oCUIGZhbGxiYWNrIHdoZW4gdGhlIG1lc3NhZ2UgZGlkbid0XG4gICAgLy8gICAgICBjYXJyeSBhbiBleHBsaWNpdCB1cmwgKG9sZGVyIGNvbnRlbnQtc2NyaXB0IG1lc3NhZ2VzKS5cbiAgICBsZXQgaWR4ID0gLTE7XG4gICAgaWYgKHBhcmVudFVpZCkge1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51aWQgPT09IHBhcmVudFVpZCk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zdCB3YW50VXJsID0gdXJsID8/IGxpdmVUYWJVcmwgPz8gbnVsbDtcbiAgICAgIGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT5cbiAgICAgICAgbS50eXBlID09PSAnc2VsZWN0b3InXG4gICAgICAgICYmIG0uZW50cnkuc2VsZWN0b3IgPT09IHNlbGVjdG9yXG4gICAgICAgICYmICghd2FudFVybCB8fCBtLmVudHJ5LnVybCA9PT0gd2FudFVybCkpO1xuICAgIH1cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ29uRmVlZGJhY2tBZGQ6IG5vIHBhcmVudCBmb3VuZCcsIHtzZWxlY3RvciwgdXJsLCBwYXJlbnRVaWR9KTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCBsb3N0IGl0cyBwYXJlbnQg4oCUIGNoZWNrIHRoZSBhY3RpdmUgY2FwdHVyZScsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCBwYXJlbnRNc2cgPSBtZXNzYWdlc1tpZHhdIGFzIFNlbGVjdG9yTWVzc2FnZTtcbiAgICBsZXQgaW5zZXJ0QXQgPSBpZHggKyAxO1xuICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBuZXcgZmVlZGJhY2sgcm93IHNvIHRoZSBleHBvcnQgY2Fycmllc1xuICAgIC8vIHRoZSBGSyBsaW5rIGV4cGxpY2l0bHkgKG5vdCBqdXN0IGJ5IGNhcHR1cmUtYWRqYWNlbmN5KS5cbiAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgcGFyZW50VWlkOiBwYXJlbnRNc2cuZW50cnkudWlkLFxuICAgIH0pO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgYWRkZWQgZnJvbSBwYWdlJyk7XG4gICAgLy8gRXZlcnkgZmVlZGJhY2sgcGFyZW50IHNob3VsZCBoYXZlIGEgc2NyZWVuc2hvdC4gSWYgdGhlIHBhcmVudFxuICAgIC8vIGNhcHR1cmUgZGlkbid0IGdldCBvbmUgKGF1dG9TY3JlZW5zaG90IG9mZiwgc2tpcFNjcmVlbnNob3RIb3N0c1xuICAgIC8vIGhpdCwgbmV0d29yayBnbGl0Y2gpLCByZS1maXJlIG5vdy5cbiAgICBpZiAoIXBhcmVudE1zZy5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChwYXJlbnRNc2cpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvblBlbmRpbmdBZGQgPSAoe2VudHJ5fToge2VudHJ5OiBFbnRyeX0pOiB2b2lkID0+IHsgcGVuZGluZ011bHRpLnB1c2goZW50cnkpOyByZW5kZXIoKTsgfTtcbiAgY29uc3Qgb25QZW5kaW5nQ2xlYXIgPSAoKTogdm9pZCA9PiB7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgfTtcblxuICBjb25zdCBmaW5kRHVwbGljYXRlID0gKHNlbGVjdG9yOiBzdHJpbmcsIHVybDogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+XG4gICAgbWVzc2FnZXMuZmluZCgobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+XG4gICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3IgJiYgKCF1cmwgfHwgbS5lbnRyeS51cmwgPT09IHVybCkpO1xuXG4gIC8vIEZpbmQgYW4gZXhpc3RpbmcgY2FwdHVyZSBmb3IgdGhlIGFjdGl2ZSB0YWIgKyBzZWxlY3Rvci4gQ3Jvc3MtcGFnZVxuICAvLyBjb250YW1pbmF0aW9uIHByZXZlbnRpb24gKHNlZSB0eXBlcy50cyBmZWVkYmFjay1hZGQgZG9jc3RyaW5nKTpcbiAgLy8gYSBzZWxlY3RvciBhbG9uZSBpcyBOT1QgYSBzdGFibGUgaWRlbnRpdHkg4oCUIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYFxuICAvLyBleGlzdHMgb24gZXZlcnkgcGFnZTsgYGJ1dHRvbmAgaXMgZXZlcnl3aGVyZS4gU3Ryb25nIGlkZW50aXR5IGlzXG4gIC8vIChzZWxlY3RvciArIHVybCkuIFJldHVybnMgdGhlIG1vc3QgcmVjZW50IG1hdGNoIHNvIHJlLWhvdmVyaW5nIGFuXG4gIC8vIGFscmVhZHktY2FwdHVyZWQgZWxlbWVudCByZXNvbHZlcyBjb25zaXN0ZW50bHkuXG4gIGNvbnN0IGZpbmRDYXB0dXJlRm9yQ3VycmVudFBhZ2UgPSAoc2VsZWN0b3I6IHN0cmluZyk6IFNlbGVjdG9yTWVzc2FnZSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgY29uc3QgdXJsID0gbGl2ZVRhYlVybDtcbiAgICAvLyBXYWxrIGJhY2t3YXJkcyBzbyB0aGUgbW9zdCByZWNlbnQgbWF0Y2hpbmcgY2FwdHVyZSB3aW5zIHdoZW4gYVxuICAgIC8vIHNlbGVjdG9yIGxlZ2l0aW1hdGVseSBoYXMgbXVsdGlwbGUgY2FwdHVyZXMgb24gdGhlIHNhbWUgcGFnZVxuICAgIC8vIChlLmcuLCB0aGUgdXNlciByZS1jYXB0dXJlZCB0aGUgc2FtZSBlbGVtZW50IGFmdGVyIGVkaXRzKS5cbiAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yICE9PSBzZWxlY3RvcikgY29udGludWU7XG4gICAgICBpZiAodXJsICYmIG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgcmV0dXJuIG07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgY29uc3QgY2Fub25pY2FsRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4gSlNPTi5zdHJpbmdpZnkoe1xuICAgIHRhZzogZS50YWcsIHNlbGVjdG9yOiBlLnNlbGVjdG9yLCB0ZXh0OiBlLnRleHQsIHJvbGU6IGUucm9sZSxcbiAgICBhdHRyczogZS5hdHRycywgY2xhc3NlczogZS5jbGFzc2VzLFxuICAgIHJlY3Q6IGUucmVjdCwgb3V0ZXJIVE1MOiBlLm91dGVySFRNTCxcbiAgICBzdHlsZXM6IGUuc3R5bGVzLCBtYXRjaGVkUnVsZXM6IGUubWF0Y2hlZFJ1bGVzLFxuICB9KTtcblxuICBjb25zdCBvbkNhcHR1cmUgPSAoe2VudHJ5LCBwYWdlLCBncm91cGVkfTogRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnY2FwdHVyZSd9Pik6IHZvaWQgPT4ge1xuICAgIGlmICghZW50cnkgfHwgIXBhZ2UpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGxpdmVUYWJVcmwgPSBwYWdlLnVybDtcbiAgICBsaXZlVGFiUGF0aCA9IHBhdGhPZihwYWdlLnVybCk7XG4gICAgaWYgKGdyb3VwZWQpIHtcbiAgICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICAgIGlmIChtPy50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSBtLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgICAgIGdyb3VwLnB1c2goZW50cnkpO1xuICAgICAgICAgIG0uZW50cnkuZ3JvdXAgPSBncm91cDtcbiAgICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpOyBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICAgIC8vIEZpcmUgYSBncm91cCBzaG90IHVzaW5nIHRoZSBoZWFkICsgbWVtYmVycy4gVGhlIGhlYWQncyBzZWxlY3RvclxuICAgICAgICAgIC8vIGlzIG0uZW50cnkuc2VsZWN0b3I7IG1lbWJlcnMnIHNlbGVjdG9ycyBhcmUgaW4gdGhlIGZyZXNobHlcbiAgICAgICAgICAvLyBtdXRhdGVkIGdyb3VwIGFycmF5LlxuICAgICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFttLmVudHJ5LnNlbGVjdG9yLCAuLi4obS5lbnRyeS5ncm91cCA/PyBbXSkubWFwKChnKSA9PiBnLnNlbGVjdG9yKV07XG4gICAgICAgICAgdm9pZCBmaXJlR3JvdXBTaG90KG0sIHNlbGVjdG9ycyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIER1cGUgZGV0ZWN0aW9uLiBDcm9zcy1jb250YW1pbmF0aW9uIGZpeDogYSAoc2VsZWN0b3IsIHVybCkgbWF0Y2hcbiAgICAvLyBpcyBORUNFU1NBUlkgYnV0IG5vdCBTVUZGSUNJRU5UIOKAlCB0d28gc2libGluZyBlbGVtZW50cyB3aXRoIHRoZVxuICAgIC8vIHNhbWUgdGVzdElkIC8gc2FtZSByb2xlL2FyaWEgc2VsZWN0b3IgbGl2ZSBvbiB0aGUgc2FtZSBVUkwgYnV0XG4gICAgLy8gYXJlIGRpZmZlcmVudCBjYXB0dXJlcy4gQ29tcGFyZSB0aGUgY2Fub25pY2FsLWVudHJ5IGhhc2ggKHdoaWNoXG4gICAgLy8gaW5jbHVkZXMgcmVjdCwgdGV4dCwgb3V0ZXJIVE1MLCBldGMuKSBiZWZvcmUgdHJlYXRpbmcgdGhlIG5ld1xuICAgIC8vIGNhcHR1cmUgYXMgYSByZWZyZXNoIG9mIHRoZSBvbGQgb25lLiBXaGVuIHRoZSBoYXNoIGRpZmZlcnMsIHdlXG4gICAgLy8ga2VlcCBCT1RIIGNhcHR1cmVzIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nLlxuICAgIGNvbnN0IGR1cGUgPSBmaW5kRHVwbGljYXRlKGVudHJ5LnNlbGVjdG9yLCBlbnRyeS51cmwpO1xuICAgIGlmIChkdXBlKSB7XG4gICAgICBjb25zdCBiZWZvcmUgPSBjYW5vbmljYWxFbnRyeShkdXBlLmVudHJ5KTtcbiAgICAgIGNvbnN0IGFmdGVyID0gY2Fub25pY2FsRW50cnkoZW50cnkpO1xuICAgICAgaWYgKGJlZm9yZSA9PT0gYWZ0ZXIpIHtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gSGFzaGVzIGRpZmZlci4gVHdvIGNhc2VzOlxuICAgICAgLy8gICAoYSkgU2FtZSBlbGVtZW50IHJlLWNhcHR1cmVkIGFmdGVyIGNvbnRlbnQgY2hhbmdlIOKAlCB0aGUgcmVjdFxuICAgICAgLy8gICAgICAgc3RheXMgcHV0ICh3aXRoaW4gYSBmZXcgcHgpLCBidXQgdGV4dC9vdXRlckhUTUwgbW92ZWQuXG4gICAgICAvLyAgICAgICBUcmVhdCBhcyBhIHJlZnJlc2guXG4gICAgICAvLyAgIChiKSBEaWZmZXJlbnQgZWxlbWVudCB0aGF0IGhhcHBlbnMgdG8gc2hhcmUgYSBzZWxlY3RvciDigJQgdGhlXG4gICAgICAvLyAgICAgICByZWN0IGlzIGluIGEgZGlmZmVyZW50IHBvc2l0aW9uLiBUcmVhdCBhcyBhIG5ldyBjYXB0dXJlLlxuICAgICAgLy8gV2UgZGlzY3JpbWluYXRlIGJ5IHJlY3Qgb3ZlcmxhcDogaWYgYm90aCByZWN0cyBleGlzdCBhbmQgdGhlaXJcbiAgICAgIC8vIGNlbnRlcnMgYXJlIHdpdGhpbiA4cHggb24gYm90aCBheGVzLCByZWZyZXNoOyBvdGhlcndpc2Uga2VlcFxuICAgICAgLy8gYm90aC5cbiAgICAgIGNvbnN0IHIxID0gZHVwZS5lbnRyeS5yZWN0O1xuICAgICAgY29uc3QgcjIgPSBlbnRyeS5yZWN0O1xuICAgICAgY29uc3Qgc2FtZUVsZW1lbnQgPSByMSAmJiByMlxuICAgICAgICAmJiBNYXRoLmFicygocjEueCArIHIxLncgLyAyKSAtIChyMi54ICsgcjIudyAvIDIpKSA8PSA4XG4gICAgICAgICYmIE1hdGguYWJzKChyMS55ICsgcjEuaCAvIDIpIC0gKHIyLnkgKyByMi5oIC8gMikpIDw9IDg7XG4gICAgICBpZiAoc2FtZUVsZW1lbnQpIHtcbiAgICAgICAgZGVsZXRlIGR1cGUuZHVwZVBlbmRpbmc7XG4gICAgICAgIGR1cGUuZW50cnkgPSBlbnRyeTtcbiAgICAgICAgcGVyc2lzdCgpOyByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBVcGRhdGVkICMke2R1cGUuZW50cnkubn1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIERpZmZlcmVudCBlbGVtZW50IHdpdGggdGhlIHNhbWUgc2VsZWN0b3Ig4oaSIGZhbGwgdGhyb3VnaCBhbmRcbiAgICAgIC8vIGVtaXQgYXMgYSBuZXcgY2FwdHVyZS4gVGhlIGFnZW50IHJlYWRpbmcgdGhlIGV4cG9ydCBzZWVzIGJvdGhcbiAgICAgIC8vIHJvd3Mgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBidXQgZGlmZmVyZW50IHVpZHMgKyByZWN0cy5cbiAgICB9XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgdGhlIHNlc3Npb24gRksgc28gdGhlIGNvbnN1bWVyIGNhbiBqb2luIGVudHJpZXMgdG8gdGhlaXJcbiAgICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS5cbiAgICBpZiAoc2Vzc2lvbklkKSBlbnRyeS5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gICAgY29uc3QgbmV3TXNnOiBTZWxlY3Rvck1lc3NhZ2UgPSB7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBlbnRyeS50cywgZW50cnl9O1xuICAgIC8vIFBhZ2Ugcm93cyBleGlzdCBvbmx5IGFzIGhlYWRlcnMgZm9yIGNhcHR1cmVkIHNlbGVjdG9ycy4gRG8gbm90IGNyZWF0ZVxuICAgIC8vIHRoZW0gZnJvbSB0YWIgYWN0aXZhdGlvbiwgdmFsaWRhdGlvbiwgb3IgcHJlZmVyZW5jZSBjaGFuZ2VzOyBpbnNlcnQgb25lXG4gICAgLy8gaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBmaXJzdCBzZWxlY3RvciBvZiBhIG5ldyBwYWdlIGJsb2NrLlxuICAgIGxldCBwcmV2aW91c1BhZ2U6IFBhZ2VNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IHBvc2l0aW9uIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlID09PSAncGFnZScpIHsgcHJldmlvdXNQYWdlID0gbTsgYnJlYWs7IH1cbiAgICAgIGlmIChtPy50eXBlID09PSAnc2VsZWN0b3InKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFwcmV2aW91c1BhZ2UgfHwgcHJldmlvdXNQYWdlLnVybCAhPT0gcGFnZS51cmwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNc2c6IFBhZ2VNZXNzYWdlID0ge1xuICAgICAgICB0eXBlOiAncGFnZScsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB1cmw6IHBhZ2UudXJsLCB0aXRsZTogcGFnZS50aXRsZSwgdmlld3BvcnQ6IHBhZ2Uudmlld3BvcnQsIHRva2VuczogcGFnZS50b2tlbnMsXG4gICAgICAgIHVzZXJBZ2VudDogcGFnZS51c2VyQWdlbnQsIGxhbmc6IHBhZ2UubGFuZyxcbiAgICAgICAgZ2l0Q29udGV4dDogKHBhZ2UgYXMgYW55KS5naXRDb250ZXh0LFxuICAgICAgICByb3V0ZTogKHBhZ2UgYXMgYW55KS5yb3V0ZSxcbiAgICAgICAgc3RhdGU6IChwYWdlIGFzIGFueSkuc3RhdGUsXG4gICAgICAgIHNlc3Npb25JZCxcbiAgICAgIH07XG4gICAgICAvLyBBdHRhY2ggYW55IHBhZ2Utc25hcHNob3QgdGhhdCBhcnJpdmVkIGJlZm9yZSB0aGlzIHBhZ2UgaGVhZGVyIGV4aXN0ZWQuXG4gICAgICBjb25zdCBwZW5kaW5nID0gcGVuZGluZ1NuYXBzaG90cy5nZXQocGFnZS51cmwpO1xuICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgKHBhZ2VNc2cgYXMgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QpLnNuYXBzaG90ID0gcGVuZGluZztcbiAgICAgICAgcGVuZGluZ1NuYXBzaG90cy5kZWxldGUocGFnZS51cmwpO1xuICAgICAgfVxuICAgICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBwYWdlTXNnKTtcbiAgICAgIHBvc2l0aW9uKys7XG4gICAgfVxuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgbmV3TXNnKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgLy8gSW50ZW50aW9uYWxseSBOTyBzZXRMYXN0QWN0aXZlKGVudHJ5LnNlbGVjdG9yKSBoZXJlIOKAlCB0aGUgdXNlciBhc2tlZFxuICAgIC8vIGZvciBmcmVzaCBjYXB0dXJlcyB0byBzdGF5IHVuLWhpZ2hsaWdodGVkIGluIHRoZSBzaWRlYmFyLiBUaGUgc3RpY2t5XG4gICAgLy8gcmluZyArIGxhc3QtYWN0aXZlIG91dGxpbmUgbm93IG9ubHkgZ2V0IGFwcGxpZWQgb24gZXhwbGljaXRcbiAgICAvLyBob3Zlci9jbGljayBvZiB0aGUgc2lkZWJhciBidWJibGUgKGFuZCB0aGUgcGFnZS1zaWRlIGZsYXNoIGZyb21cbiAgICAvLyBjYXB0dXJlRW50cnkgc3RpbGwgY29uZmlybXMgdGhlIGNhcHR1cmUgdmlzdWFsbHkgb24gdGhlIHBhZ2UpLlxuICAgIHJlbmRlcigpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgdm9pZCBmaXJlRWxlbWVudFNob3QobmV3TXNnKTtcbiAgICB2b2lkIGZpcmVQYWdlU2hvdElmTmVlZGVkKG5ld01zZyk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNjcmVlbnNob3Qgd2lyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBGaXJlIHRoZSBwZXItZWxlbWVudCBzaG90LCBhdHRhY2ggdGhlIHJldHVybmVkIGZpbGVuYW1lICsgZGF0YVVybCBvbnRvXG4gIC8vIHRoZSBlbnRyeSwgYW5kIHBlcnNpc3QuIHNob3VsZFNraXBTY3JlZW5zaG90IGJhaWxzIG9uIGhvc3RzIGluIHRoZVxuICAvLyB1c2VyJ3Mgc2tpcCBsaXN0OyBhdXRvU2NyZWVuc2hvdD1mYWxzZSBiYWlscyBnbG9iYWxseS5cbiAgY29uc3QgZmlyZUVsZW1lbnRTaG90ID0gYXN5bmMgKG1zZzogU2VsZWN0b3JNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGF1dG9TY3JlZW5zaG90PWZhbHNlJyk7XG4gICAgICAvLyBCdWcgIzI6IHRlbGwgdGhlIGV4cG9ydCB3aHkgdGhlIHNob3QgaXMgbWlzc2luZy5cbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnYXV0b1NjcmVlbnNob3RPZmYnfTtcbiAgICAgIC8vIFJlLXJlbmRlciBzbyB0aGUgcmVzZXJ2ZWQgc2tlbGV0b24gKHdoaWNoIGFzc3VtZWQgYSBzaG90IHdhcyBjb21pbmcpXG4gICAgICAvLyBjb2xsYXBzZXMgbm93IHRoYXQgd2Uga25vdyBvbmUgd29uJ3QgYXJyaXZlLlxuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGhvc3Qgb24gc2tpcCBsaXN0JywgbXNnLmVudHJ5LnVybCk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ3NraXBTY3JlZW5zaG90SG9zdHMnfTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qg4oaSJywgbXNnLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAvLyBTVyBjb2xkLXN0YXJ0IHJhY2U6IHRoZSBGSVJTVCBjYXB0dXJlIGluIGEgc2Vzc2lvbiBvZnRlbiBsb3NlcyBpdHNcbiAgICAvLyBmaXJzdCBtZXNzYWdlIGJlY2F1c2UgdGhlIGJnIHdvcmtlciBpcyBzdGlsbCBzdGFydGluZy4gUmV0cnkgb25jZVxuICAgIC8vIGFmdGVyIGEgc2hvcnQgZGVsYXkgaWYgdGhlIGZpcnN0IGNhbGwgY29tZXMgYmFjayBudWxsL2VtcHR5LlxuICAgIGxldCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHkgfHwgKCFyZXBseS5vayAmJiAhcmVwbHkuZXJyb3IpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJzdCBzY3JlZW5zaG90IHJlcGx5IHdhcyBlbXB0eTsgcmV0cnlpbmcgYWZ0ZXIgMjAwbXMgKFNXIGNvbGQtc3RhcnQpJyk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAyMDApKTtcbiAgICAgIHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3QgcmVwbHk6JywgcmVwbHkpO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkge1xuICAgICAgc2V0U3RhdHVzKGBTY3JlZW5zaG90IGZhaWxlZDogJHtyZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCd9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgIHVuYXZhaWxhYmxlUmVhc29uOiByZXBseT8uZXJyb3IgPz8gJ2NhcHR1cmVGYWlsZWQnLFxuICAgICAgfTtcbiAgICAgIC8vIENvbGxhcHNlIHRoZSByZXNlcnZlZCBza2VsZXRvbiDigJQgbm8gc2hvdCBpcyBjb21pbmcgZm9yIHRoaXMgY2FwdHVyZS5cbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBTdWNjZXNzZnVsIHJldHJ5IOKAlCBzdHJpcCBhbnkgcHJpb3IgdW5hdmFpbGFibGVSZWFzb24gc2luY2Ugd2Ugbm93XG4gICAgLy8gaGF2ZSBhIHJlYWwgc2hvdC5cbiAgICBkZWxldGUgbXNnLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgIGVsZW1lbnQ6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgLi4uKHJlcGx5LmNyb3AgPyB7Y3JvcDogcmVwbHkuY3JvcH0gOiB7fSksXG4gICAgfTtcbiAgICBpZiAocmVwbHkuZGF0YVVybCkge1xuICAgICAgc2hvdHMuc2V0KG1zZy5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KG1zZy5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmlyZSB0aGUgZ3JvdXAgc2hvdCAodW5pb24gYmJveCBvZiBoZWFkICsgYWxsIG1lbWJlcnMpIGFuZCBzdGFzaCB0aGVcbiAgLy8gZmlsZW5hbWUgb24gdGhlIGhlYWQtb2YtZ3JvdXAgZW50cnkuXG4gIGNvbnN0IGZpcmVHcm91cFNob3QgPSBhc3luYyAoaGVhZDogU2VsZWN0b3JNZXNzYWdlLCBzZWxlY3RvcnM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkgcmV0dXJuO1xuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChoZWFkLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtZ3JvdXAnLCBzZWxlY3RvcnMsIG46IGhlYWQuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHJldHVybjtcbiAgICBoZWFkLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4oaGVhZC5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgIGdyb3VwOiByZXBseS5maWxlbmFtZSxcbiAgICAgIGNhcHR1cmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQoaGVhZC5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZGF0YVVybCk7XG4gICAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHsgc2hvdHNGdWxsLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7IHBlcnNpc3RTaG90c0Z1bGwoKTsgfVxuICAgICAgcGVyc2lzdFNob3RzKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBQYWdlLWxldmVsIHNob3Qgb25jZSBwZXIgKHdvcmtzcGFjZSwgcGFnZS11cmwsIGRheSkuIFN1YnNlcXVlbnQgY2FwdHVyZXNcbiAgLy8gb24gdGhlIHNhbWUgcGFnZSByZXVzZSB0aGUgc2FtZSBvbi1kaXNrIGZpbGUgcGF0aC5cbiAgY29uc3QgZmlyZVBhZ2VTaG90SWZOZWVkZWQgPSBhc3luYyAobXNnOiBTZWxlY3Rvck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSByZXR1cm47XG4gICAgLy8gUGVyLWNhcHR1cmUgcGFnZS1zaG90IG1vZGUgKMKnNC41KTogd2hlbiBlbmFibGVkLCBza2lwIHRoZVxuICAgIC8vIHBlci0od29ya3NwYWNlLCB1cmwpIGRlZHVwZSBhbmQgZmlyZSBhIGZyZXNoIHBhZ2Ugc2hvdCBldmVyeSB0aW1lLlxuICAgIC8vIFVzZWZ1bCB3aGVuIHRoZSBwYWdlIHN0YXRlIGNoYW5nZXMgYmV0d2VlbiBjYXB0dXJlcyAobW9kYWwgb3BlbnMsXG4gICAgLy8gbXVsdGktc3RlcCBmbG93LCBldGMuKSBhbmQgdGhlIHVzZXIgd2FudHMgdG8gc2VlIHRoZSB3aG9sZSBwYWdlIGF0XG4gICAgLy8gZWFjaCBzdGVwLiBDb3N0cyBvbmUgZnVsbC1wYWdlIFBORyBwZXIgY2FwdHVyZSwgc28gZGVmYXVsdCBvZmYuXG4gICAgaWYgKCFwcmVmcy5wYWdlU2hvdFBlckNhcHR1cmUpIHtcbiAgICAgIGNvbnN0IGtleSA9IHBhZ2VTaG90S2V5KG1zZy5lbnRyeS51cmwpO1xuICAgICAgaWYgKHBhZ2VTaG90c0ZpcmVkLmhhcyhrZXkpKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gZmluZEV4aXN0aW5nUGFnZVNob3QobXNnLmVudHJ5LnVybCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgICAgIHBhZ2U6IGV4aXN0aW5nLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBhZ2VTaG90c0ZpcmVkLmFkZChrZXkpO1xuICAgIH1cbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtcGFnZScsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIC8vIEFwcGx5IHRvIFRISVMgZW50cnkgYW5kIHRvIGFueSBvdGhlciBlbnRyaWVzIGFscmVhZHkgY2FwdHVyZWQgb24gdGhlXG4gICAgLy8gc2FtZSBVUkwgdG9kYXkgKHNvIHRoZSBwYWdlLXNob3QgYXBwZWFycyB1bmlmb3JtbHkpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS51cmwgIT09IG1zZy5lbnRyeS51cmwpIGNvbnRpbnVlO1xuICAgICAgbS5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obS5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgcGFnZTogcmVwbHkuZmlsZW5hbWUsXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBTdGFzaCB0aGUgZnVsbCBQTkcgc28gdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGNhbiBidW5kbGUgaXQuIEtleWVkXG4gICAgLy8gYnkgVVJMIHNpbmNlIHBhZ2Ugc2hvdHMgYXJlIHBhZ2Utc2NvcGVkLCBub3Qgc2VsZWN0b3Itc2NvcGVkLlxuICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkge1xuICAgICAgc2hvdHNGdWxsLnNldCgncGFnZTo6JyArIG1zZy5lbnRyeS51cmwsIHJlcGx5LmZ1bGxEYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIEZpbmQgYW55IHNlbGVjdG9yIGVudHJ5IG9uIHRoaXMgVVJMIHRoYXQgYWxyZWFkeSBoYXMgYSBgcGFnZWAgc2hvdFxuICAvLyByZWNvcmRlZCDigJQgdXNlZCBzbyB0aGF0IHJldHJvYWN0aXZlIGNhcHR1cmVzIGluaGVyaXQgdGhlIGV4aXN0aW5nIFBOR1xuICAvLyBwYXRoIGluc3RlYWQgb2YgcmVmaXJpbmcuXG4gIGNvbnN0IGZpbmRFeGlzdGluZ1BhZ2VTaG90ID0gKHVybDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gdXJsKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIHJldHVybiBtLmVudHJ5LnNjcmVlbnNob3QucGFnZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgY29uc3Qgb25Ib3ZlciA9ICh7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3R9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdob3Zlcid9Pik6IHZvaWQgPT4ge1xuICAgIHNldFN0YXR1cyhgQWx0LWhvdmVyIMK3ICR7bGFiZWx9YCwge2tpbmQ6ICdpbmZvJ30pO1xuICAgIC8vIElkZW50aXR5IGlzIChzZWxlY3RvciwgdXJsKS4gU2FtZSBzZWxlY3RvciBvbiB0d28gZGlmZmVyZW50IFVSTHNcbiAgICAvLyBpcyB0d28gZGlmZmVyZW50IGNhcHR1cmVzOyB0aGUgcHJldmlvdXMgc2VsZWN0b3Itb25seSBsb29rdXBcbiAgICAvLyBjYXVzZWQgY3Jvc3MtcGFnZSBjb21tZW50IGNvbnRhbWluYXRpb24uIFByZWZlciBzYW1lLVVSTCArXG4gICAgLy8gc2FtZS1zZWxlY3RvciBhcyB0aGUgc3Ryb25nZXN0IG1hdGNoLlxuICAgIGNvbnN0IGV4aXN0aW5nID0gZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZShzZWxlY3Rvcik7XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICBpZiAocHJlZnMuYXV0b1Njcm9sbFRvSG92ZXJlZCkgc2Nyb2xsTWVzc2FnZUludG9WaWV3KGV4aXN0aW5nLmlkKTtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIoZXhpc3RpbmcuaWQpO1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24nLCBzZWxlY3RvciwgcGF5bG9hZDoge3VpZDogZXhpc3RpbmcuZW50cnkudWlkLCBuOiBleGlzdGluZy5lbnRyeS5uLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2t9fSk7XG4gICAgICBpZiAocGhhbnRvbVRhcmdldCkgeyBwaGFudG9tVGFyZ2V0ID0gbnVsbDsgcmVuZGVyKCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQUxXQVlTIHNob3cgdGhlIGNvbW1lbnQgYm94LCBldmVuIGZvciB1bmNhcHR1cmVkIGVsZW1lbnRzLiBPbiBzdWJtaXRcbiAgICAgIC8vIHRoZSBjb250ZW50IHNjcmlwdCB3aWxsIGNhcHR1cmUgdGhlIGVsZW1lbnQgZmlyc3QsIHRoZW4gYXR0YWNoIHRoZVxuICAgICAgLy8gY29tbWVudCDigJQgdHVybmluZyBob3Zlci1jb21tZW50IGludG8gYSBjYXB0dXJlK2NvbW1lbnQgc2hvcnRjdXQuXG4gICAgICBwaGFudG9tVGFyZ2V0ID0ge3NlbGVjdG9yLCBsYWJlbCwgdGFnLCByZWN0OiByZWN0IGFzIHVua25vd24gYXMgRE9NUmVjdH07XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7Y2FwdHVyZWQ6IGZhbHNlLCBmZWVkYmFjazogW119fSk7XG4gICAgICByZW5kZXJQaGFudG9tKCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBvbkhvdmVyRW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdGF0dXMudGV4dENvbnRlbnQ/LnN0YXJ0c1dpdGgoJ0FsdC1ob3ZlcicpKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnJztcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgeyBwaGFudG9tVGFyZ2V0ID0gbnVsbDsgcmVuZGVyUGhhbnRvbSgpOyB9XG4gICAgLy8gTm8gYW5ub3RhdGlvbi1jbGVhciBoZXJlIOKAlCB0aGUgY29udGVudCBzY3JpcHQga2VlcHMgdGhlIGJveCBvcGVuIHNvIHRoZVxuICAgIC8vIHVzZXIgY2FuIG1vdXNlIHRvIGl0IGFuZCB0eXBlLiBPdXRzaWRlLWNsaWNrIC8gRXNjIGRpc21pc3MgaXQuXG4gIH07XG5cbiAgY29uc3QgY29sbGVjdEZlZWRiYWNrQWZ0ZXIgPSAoc2VsZWN0b3JJZDogc3RyaW5nKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmICghZm91bmQpIHsgaWYgKG0uaWQgPT09IHNlbGVjdG9ySWQpIGZvdW5kID0gdHJ1ZTsgY29udGludWU7IH1cbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgfHwgbS50eXBlID09PSAncGFnZScpIGJyZWFrO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgb3V0LnB1c2gobS50ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBjb25zdCBjZW50ZXJFbGVtZW50SW5MaXN0ID0gKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGxpc3RSZWN0ID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBlbFJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0YXJnZXQgPSBsaXN0LnNjcm9sbFRvcCArIGVsUmVjdC50b3AgLSBsaXN0UmVjdC50b3AgLSAobGlzdC5jbGllbnRIZWlnaHQgLyAyKSArIChlbFJlY3QuaGVpZ2h0IC8gMik7XG4gICAgbGlzdC5zY3JvbGxUbyh7dG9wOiBNYXRoLm1heCgwLCB0YXJnZXQpLCBiZWhhdmlvcjogJ3Ntb290aCd9KTtcbiAgfTtcblxuICBjb25zdCBzY3JvbGxNZXNzYWdlSW50b1ZpZXcgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGlmICghZWwpIHJldHVybjtcbiAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGVsKTtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaC1pbnRvLXZpZXcnKTtcbiAgICB2b2lkIGVsLm9mZnNldFdpZHRoO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoLWludG8tdmlldycpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGlja3kgaGlnaGxpZ2h0IG1hbmFnZW1lbnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNldExhc3RBY3RpdmUgPSAoc2VsZWN0b3I6IHN0cmluZyB8IG51bGwpOiB2b2lkID0+IHtcbiAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICBjbGVhclRpbWVvdXQoc3RpY2t5VGltZXIpO1xuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICAgIGFybVN0aWNreUV4cGlyeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYXJtU3RpY2t5RXhwaXJ5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgc3RpY2t5VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXBhbmVsSG92ZXJlZCkge1xuICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3Rvci5sYXN0LWFjdGl2ZScpKSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdsYXN0LWFjdGl2ZScpO1xuICAgICAgfSBlbHNlIGFybVN0aWNreUV4cGlyeSgpO1xuICAgIH0sIFNUSUNLWV9UVExfTVMpO1xuICB9O1xuXG4gIC8vIEZhc3Qgc3RpY2t5LWNsZWFyOiB3aGVuIHRoZSB1c2VyJ3MgY3Vyc29yIGxlYXZlcyB0aGUgcGFuZWwsIGZpcmVcbiAgLy8gc3RpY2t5LWNsZWFyIGFmdGVyIGEgMzAwIG1zIGdyYWNlIHdpbmRvdy4gUHJpb3IgYmVoYXZpb3Igd2FpdGVkIHRoZVxuICAvLyBmdWxsIFNUSUNLWV9UVExfTVMgKH41IHMpIHdoaWNoIGZlbHQgbGlrZSB0aGUgcGFnZS1zaWRlIGhpZ2hsaWdodFxuICAvLyBcImRvZXNuJ3QgZ28gYXdheSBldmVuIGFmdGVyIEkgdW5ob3ZlclwiLiAzMDAgbXMgaXMgc2hvcnQgZW5vdWdoIHRvXG4gIC8vIGZlZWwgcmVzcG9uc2l2ZSBidXQgbG9uZyBlbm91Z2ggdGhhdCBhIHF1aWNrIHJlcG9zaXRpb24gKGUuZy5cbiAgLy8gYWNjaWRlbnRhbGx5IGNyb3NzaW5nIHRoZSBzZWFtKSBkb2Vzbid0IGtpbGwgdGhlIHJpbmcgbWlkLWZsaWdodC5cbiAgbGV0IHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgcGFuZWxIb3ZlcmVkID0gdHJ1ZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgeyBjbGVhclRpbWVvdXQoc3RpY2t5Q2xlYXJHcmFjZSk7IHN0aWNreUNsZWFyR3JhY2UgPSAwOyB9XG4gICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gIH0pO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gICAgaWYgKHN0aWNreUNsZWFyR3JhY2UpIGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTtcbiAgICBzdGlja3lDbGVhckdyYWNlID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICAgIC8vIEFsc28gZHJvcCBvdXIgb3duIGZyb20tcGFuZWwgKyBtdWx0aSByaW5ncyBpbiBjYXNlIHRoZXkgbGVha2VkLlxuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICBzdGlja3lDbGVhckdyYWNlID0gMDtcbiAgICB9LCAzMDApO1xuICB9KTtcbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIC8vIFdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlaXIgbW91c2UgaW50byB0aGUgcGFuZWwsIHN1cHByZXNzIHBhZ2Utc2lkZVxuICAgIC8vIGFsdC1ob3ZlciBzdGF0ZSBzbyB0aGUgb3JhbmdlIHJpbmcgZG9lc24ndCBrZWVwIGZvbGxvd2luZyB0aGUgY3Vyc29yLlxuICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFJlbmRlcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgTkVBUl9CT1RUT01fUFggPSA4MDtcbiAgY29uc3Qgd2FzTmVhckJvdHRvbSA9ICgpOiBib29sZWFuID0+XG4gICAgbGlzdC5zY3JvbGxIZWlnaHQgLSBsaXN0LnNjcm9sbFRvcCAtIGxpc3QuY2xpZW50SGVpZ2h0IDw9IE5FQVJfQk9UVE9NX1BYO1xuXG4gIGNvbnN0IG1hdGNoZXNTZWFyY2ggPSAobTogUGFuZWxNZXNzYWdlKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIG0udGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgLy8gTWF0Y2ggYWdhaW5zdCB0aGUgV0hPTEUgZW50cnkgKHNlbGVjdG9yLCB0ZXh0LCBjbGFzc2VzLCBhdHRycyxcbiAgICAgIC8vIG91dGVySFRNTCwgc3R5bGVzLCBldGMuKSBzbyBzZWFyY2ggaGl0cyBhbnl0aGluZyB2aXNpYmxlIGluIHRoZVxuICAgICAgLy8gYm9keS1qc29uLiBTdHJpbmdpZnlpbmcgb25jZSBpcyBmaW5lIOKAlCB0aGUgY29zdCBpcyB0aW55IHZzIHJlbmRlci5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShlKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIH1cbiAgICBpZiAobS50eXBlID09PSAncGFnZScpIHJldHVybiAobS51cmwgKyAnICcgKyAobS50aXRsZSA/PyAnJykpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgYnViYmxlJ3MgYm9keS1qc29uIChvciBvdXRlckhUTUwpIGNvbnRhaW5zIHRoZSBzZWFyY2gg4oCUXG4gIC8vIHRlbGxzIHJlbmRlclNlbGVjdG9yIHRvIGF1dG8tZXhwYW5kIHNvIHRoZSB1c2VyIHNlZXMgdGhlIGhpZ2hsaWdodGVkIGhpdC5cbiAgY29uc3QgYm9keU1hdGNoZXNTZWFyY2ggPSAobTogU2VsZWN0b3JNZXNzYWdlKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHEgPSBzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtLmVudHJ5KS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICB9O1xuXG4gIGNvbnN0IGluc2VydFJhaWwgPSAoYmVmb3JlSWQ6IHN0cmluZyk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ2luc2VydC1yYWlsJztcbiAgICBkaXYuZGF0YXNldC5iZWZvcmVJZCA9IGJlZm9yZUlkO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCA9PT0gYmVmb3JlSWQpIHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcpO1xuICAgICAgZGl2LmFwcGVuZChidWlsZElubGluZUNvbW1lbnQoe1xuICAgICAgICBvbkNhbmNlbDogKCkgPT4geyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7IHJlbmRlcigpOyB9LFxuICAgICAgICBvblN1Ym1pdDogKHRleHQpID0+IHNlbmRJbmxpbmUodGV4dCksXG4gICAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBidG4udHlwZSA9ICdidXR0b24nO1xuICAgICAgYnRuLmNsYXNzTmFtZSA9ICdhZGQtYnRuJztcbiAgICAgIGJ0bi5kYXRhc2V0LnRpcCA9ICdJbnNlcnQgY2FwdHVyZSBvciBjb21tZW50IGhlcmUnO1xuICAgICAgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdJbnNlcnQgY2FwdHVyZSBvciBjb21tZW50IGhlcmUnKTtcbiAgICAgIGJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3BsdXMnLCAxMik7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7IGluc2VydEJlZm9yZS5jb21tZW50ID0gdHJ1ZTsgcmVuZGVyKCk7IH0pO1xuICAgICAgZGl2LmFwcGVuZChidG4pO1xuICAgIH1cbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIHR5cGUgSW5saW5lQ29tbWVudE9wdHMgPSB7XG4gICAgaW5pdGlhbD86IHN0cmluZztcbiAgICBvbkNhbmNlbD86ICgpID0+IHZvaWQ7XG4gICAgb25TdWJtaXQ/OiAodGV4dDogc3RyaW5nKSA9PiB2b2lkO1xuICAgIGF1dG9mb2N1cz86IGJvb2xlYW47XG4gIH07XG4gIGNvbnN0IGJ1aWxkSW5saW5lQ29tbWVudCA9ICh7aW5pdGlhbCA9ICcnLCBvbkNhbmNlbCwgb25TdWJtaXQsIGF1dG9mb2N1c306IElubGluZUNvbW1lbnRPcHRzKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLmNsYXNzTmFtZSA9ICdpbmxpbmUtY29tbWVudCc7XG4gICAgY29uc3QgdGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIHRhLnZhbHVlID0gaW5pdGlhbDtcbiAgICB0YS5yb3dzID0gMjtcbiAgICB0YS5wbGFjZWhvbGRlciA9ICdJbnNlcnQgYSBjb21tZW50IGhlcmUsIG9yIEFsdCtDbGljayB0byBpbnNlcnQgYSBjYXB0dXJlJztcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3Jvdyc7XG4gICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBtZXRhLmNsYXNzTmFtZSA9ICdtZXRhJztcbiAgICBtZXRhLnRleHRDb250ZW50ID0gJzB3IMK3IDB0JztcbiAgICAvLyBCb3RoIFNhdmUgLyBDYW5jZWwgYXJlIHVuaWZvcm0gaWNvbiBidXR0b25zICguaWNvbmJ0bikuIFNhdmUgdXNlcyB0aGVcbiAgICAvLyBwcmltYXJ5IGFjY2VudCB2YXJpYW50IHZpYSAucHJpbWFyeSBzbyBpdCBzdGlsbCBwb3BzLCBidXQgaXRzIHdpZHRoXG4gICAgLy8gbWF0Y2hlcyBDYW5jZWwgZXhhY3RseS5cbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0bic7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCDCtyBFc2MnO1xuICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIGlubGluZSBjb21tZW50Jyk7XG4gICAgY2FuY2VsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDIwKTtcbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvbkNhbmNlbD8uKCkpO1xuICAgIGNvbnN0IHNlbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzZW5kLnR5cGUgPSAnYnV0dG9uJztcbiAgICBzZW5kLmNsYXNzTmFtZSA9ICdpY29uYnRuIHByaW1hcnknO1xuICAgIHNlbmQuZGF0YXNldC50aXAgPSAnU2F2ZSDCtyBFbnRlcic7XG4gICAgc2VuZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnU2F2ZSBpbmxpbmUgY29tbWVudCcpO1xuICAgIHNlbmQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGVjaycsIDIwKTtcbiAgICBjb25zdCBzdWJtaXQgPSAoKTogdm9pZCA9PiBvblN1Ym1pdD8uKHRhLnZhbHVlKTtcbiAgICBzZW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3VibWl0KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHsgbWV0YS50ZXh0Q29udGVudCA9IGAke3dvcmRDb3VudCh0YS52YWx1ZSl9dyDCtyAke3Rva2VuQ291bnQodGEudmFsdWUpfXRgOyB9KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXQoKTsgfVxuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgb25DYW5jZWw/LigpO1xuICAgIH0pO1xuICAgIHJvdy5hcHBlbmQobWV0YSwgY2FuY2VsLCBzZW5kKTtcbiAgICB3cmFwLmFwcGVuZCh0YSwgcm93KTtcbiAgICBpZiAoYXV0b2ZvY3VzKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGEuZm9jdXMoKSk7XG4gICAgcmV0dXJuIHdyYXA7XG4gIH07XG5cbiAgY29uc3Qgc2VuZElubGluZSA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB0ZXh0ID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCBiZWZvcmVJZCA9IGluc2VydEJlZm9yZS5jdXJyZW50O1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxldCBwb3MgPSBiZWZvcmVJZCA/IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gYmVmb3JlSWQpIDogbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChwb3MgPCAwKSBwb3MgPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgLy8gcGFyZW50VWlkIHJlc29sdXRpb246IHdhbGsgYmFjayBmcm9tIHRoZSBpbnNlcnQgcG9zaXRpb24gdG8gdGhlXG4gICAgLy8gbmVhcmVzdCBwcmVjZWRpbmcgc2VsZWN0b3IuIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHRoZSBGSy5cbiAgICBsZXQgcElkeCA9IHBvcyAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgLi4uKHBhcmVudFVpZCA/IHtwYXJlbnRVaWR9IDoge30pLFxuICAgIH07XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvcywgMCwgZmIpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0luc2VydGVkJyk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGhhbnRvbSA9ICgpOiB2b2lkID0+IHtcbiAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoJy5waGFudG9tJyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGhhbnRvbVRhcmdldCkgcmV0dXJuO1xuICAgIGNvbnN0IHBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGguY2xhc3NOYW1lID0gJ3BoYW50b20gdmlzaWJsZSc7XG4gICAgcGguaW5uZXJIVE1MID0gYDxjb2RlPiR7ZXNjYXBlSHRtbChwaGFudG9tVGFyZ2V0LmxhYmVsKX08L2NvZGU+YDtcbiAgICBsaXN0LmFwcGVuZChwaCk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgbGlzdC5zY3JvbGxUb3AgPSBsaXN0LnNjcm9sbEhlaWdodDsgfSk7XG4gIH07XG5cbiAgLy8gUmVvcmRlciBhIGZsYXQgbWVzc2FnZSBsaXN0IHNvIHNlbGVjdG9ycyB3aXRoaW4gZWFjaCBwYWdlLWRlbGltaXRlZFxuICAvLyBibG9jayBhcmUgc29ydGVkIGJ5IHRoZWlyIHZpc3VhbCByZWN0ICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkuXG4gIC8vIEZlZWRiYWNrIHJvd3Mgc3RheSBhdHRhY2hlZCB0byB0aGVpciBwcmVjZWRpbmcgc2VsZWN0b3IgKGNhcHR1cmVcbiAgLy8gYWRqYWNlbmN5KSBzbyBlZGl0aW5nL3RocmVhZGluZyBiZWhhdmlvciBzdXJ2aXZlcyB0aGUgc29ydC5cbiAgLy9cbiAgLy8gVXNlZCBPTkxZIGJ5IHRoZSBleHBvcnQgcGlwZWxpbmUgKGBidWlsZFNsaW1gKSwgbm90IHRoZSBzaWRlYmFyXG4gIC8vIHJlbmRlci4gVGhlIHNpZGViYXIga2VlcHMgbWVzc2FnZXMgaW4gaW5zZXJ0aW9uL2NhcHR1cmUgb3JkZXIgc29cbiAgLy8gdGhlIHVzZXIgc2VlcyB0aGVtIHdoZXJlIHRoZXkgZXhwZWN0OyB0aGUgZXhwb3J0IGdldHMgdGhlIGFnZW50LVxuICAvLyBmcmllbmRseSByZWFkaW5nLW9yZGVyIHRyZWF0bWVudC5cbiAgY29uc3QgcmVvcmRlckZvckV4cG9ydCA9IChtc2dzOiBQYW5lbE1lc3NhZ2VbXSk6IFBhbmVsTWVzc2FnZVtdID0+IHtcbiAgICB0eXBlIEdyb3VwID0ge2tpbmQ6ICdncm91cCc7IHNlbDogU2VsZWN0b3JNZXNzYWdlOyB0cmFpbGluZzogRmVlZGJhY2tNZXNzYWdlW119O1xuICAgIHR5cGUgTG9vc2UgPSB7a2luZDogJ2xvb3NlJzsgbTogRmVlZGJhY2tNZXNzYWdlfTtcbiAgICB0eXBlIFNsb3QgPSBHcm91cCB8IExvb3NlIHwge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9O1xuICAgIGNvbnN0IHNsb3RzOiBTbG90W10gPSBbXTtcbiAgICBsZXQgY3VyR3JvdXA6IEdyb3VwIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgZmx1c2hHcm91cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmIChjdXJHcm91cCkgeyBzbG90cy5wdXNoKGN1ckdyb3VwKTsgY3VyR3JvdXAgPSBudWxsOyB9XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbXNncykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgc2xvdHMucHVzaCh7a2luZDogJ3BhZ2UnLCBtfSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIGN1ckdyb3VwID0ge2tpbmQ6ICdncm91cCcsIHNlbDogbSwgdHJhaWxpbmc6IFtdfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjdXJHcm91cCkgY3VyR3JvdXAudHJhaWxpbmcucHVzaChtKTtcbiAgICAgICAgZWxzZSBzbG90cy5wdXNoKHtraW5kOiAnbG9vc2UnLCBtfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoR3JvdXAoKTtcbiAgICBjb25zdCBvdXQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgbGV0IHJ1blN0YXJ0ID0gMDtcbiAgICBjb25zdCBmbHVzaFJ1biA9IChlbmQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwUmVjdHM6IEFycmF5PHtpZHg6IG51bWJlcjsgeTogbnVtYmVyOyB4OiBudW1iZXJ9PiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IHJ1blN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHIgPSBzLnNlbC5lbnRyeS5yZWN0O1xuICAgICAgICAgIGdyb3VwUmVjdHMucHVzaCh7aWR4OiBpLCB5OiByPy55ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgeDogcj8ueCA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9KTtcbiAgICAgICAgfVxuICAgICAgICBpbmRpY2VzLnB1c2goaSk7XG4gICAgICB9XG4gICAgICBncm91cFJlY3RzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGEueSAhPT0gYi55KSByZXR1cm4gYS55IC0gYi55O1xuICAgICAgICByZXR1cm4gYS54IC0gYi54O1xuICAgICAgfSk7XG4gICAgICBsZXQgZ2kgPSAwO1xuICAgICAgZm9yIChjb25zdCBpIG9mIGluZGljZXMpIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50SWR4ID0gZ3JvdXBSZWN0c1tnaSsrXSEuaWR4O1xuICAgICAgICAgIGNvbnN0IHIgPSBzbG90c1tyZXBsYWNlbWVudElkeF0hIGFzIEdyb3VwO1xuICAgICAgICAgIG91dC5wdXNoKHIuc2VsKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGYgb2Ygci50cmFpbGluZykgb3V0LnB1c2goZik7XG4gICAgICAgIH0gZWxzZSBpZiAocy5raW5kID09PSAnbG9vc2UnKSB7XG4gICAgICAgICAgb3V0LnB1c2gocy5tKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNsb3RzW2ldIS5raW5kID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hSdW4oaSk7XG4gICAgICAgIG91dC5wdXNoKChzbG90c1tpXSBhcyB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX0pLm0pO1xuICAgICAgICBydW5TdGFydCA9IGkgKyAxO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaFJ1bihzbG90cy5sZW5ndGgpO1xuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHN0aWNrVG9Cb3R0b20gPSBsaXN0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCB3YXNOZWFyQm90dG9tKCk7XG4gICAgbGlzdC5pbm5lckhUTUwgPSAnJztcblxuICAgIC8vIFN0YXRzIG51bWJlcnNcbiAgICBsZXQgdG90YWxTZWxlY3RvcnMgPSAwO1xuICAgIGxldCB0b3RhbENvbW1lbnRzID0gMDtcbiAgICBsZXQgdG90YWxTdGFsZSA9IDA7XG4gICAgY29uc3QgZGlzdGluY3RQYWdlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICB0b3RhbFNlbGVjdG9ycysrO1xuICAgICAgICBpZiAoc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKSB0b3RhbFN0YWxlKys7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgdG90YWxDb21tZW50cysrO1xuICAgICAgZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLnNvbWUoKHgpID0+IHgudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiB4LmVudHJ5LnVybCA9PT0gbS51cmwpKSBkaXN0aW5jdFBhZ2VzLmFkZChtLnVybCk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzZWxlY3RvcnNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU2VsZWN0b3JzKTtcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwiY29tbWVudHNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsQ29tbWVudHMpO1xuICAgIGNvbnN0IHN0YWxlTnVtID0gc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInN0YWxlXCJdIC5zdGF0LW51bScpITtcbiAgICBzdGFsZU51bS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFN0YWxlKTtcbiAgICBzdGFsZU51bS5kYXRhc2V0Lnplcm8gPSB0b3RhbFN0YWxlID09PSAwID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwicGFnZXNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKGRpc3RpbmN0UGFnZXMuc2l6ZSk7XG4gICAgY29uc3QgZXhwb3J0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBzdGF0VG9rZW5zLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh0b2tlbkNvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcbiAgICBzdGF0V29yZHMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHdvcmRDb3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG5cbiAgICAvLyBNaW5pZnkgcmVkdWN0aW9uIHN0YXRzXG4gICAgbGV0IGZ1bGxUID0gMCwgY3VyVCA9IDAsIGZ1bGxXID0gMCwgY3VyVyA9IDAsIHBjdCA9IDA7XG4gICAgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgIGNvbnN0IHdhc01pbiA9IHByZWZzLm1pbmlmeTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHRydWU7IGNvbnN0IG1pblRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSBmYWxzZTsgY29uc3QgZnVsbFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB3YXNNaW47XG4gICAgICBmdWxsVCA9IHRva2VuQ291bnQoZnVsbFRleHQpOyBjdXJUID0gdG9rZW5Db3VudChtaW5UZXh0KTtcbiAgICAgIGZ1bGxXID0gd29yZENvdW50KGZ1bGxUZXh0KTsgY3VyVyA9IHdvcmRDb3VudChtaW5UZXh0KTtcbiAgICAgIHBjdCA9IGZ1bGxUID4gMCA/IE1hdGgucm91bmQoKDEgLSBjdXJUIC8gZnVsbFQpICogMTAwKSA6IDA7XG4gICAgfVxuICAgIGNvbnN0IG1pbmlmeVN0YXRzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWluaWZ5LXN0YXRzXScpO1xuICAgIGlmIChtaW5pZnlTdGF0c0VsKSB7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGAke2Z1bGxULnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clQudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7ZnVsbFcudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVy50b0xvY2FsZVN0cmluZygpfSB3b3JkcyDCtyAke3BjdH0lIHJlZHVjdGlvbmA7XG4gICAgICB9IGVsc2UgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGBXb3VsZCBzYXZlICR7KGZ1bGxUIC0gY3VyVCkudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7cGN0fSUgaWYgZW5hYmxlZGA7XG4gICAgICB9IGVsc2UgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIC8vIFBlci1jaGVja2JveCBjb250cmlidXRpb24gc3RhdHM6IGhvdyBtYW55IHRva2Vucy93b3JkcyBlYWNoIHRvZ2dsZVxuICAgIC8vIGFkZHMgdG8gdGhlIGN1cnJlbnQgZXhwb3J0LiBDb21wdXRlZCBieSB0b2dnbGluZyB0aGF0IHNpbmdsZSBwcmVmXG4gICAgLy8gYW5kIGRpZmZpbmcgdGhlIGV4cG9ydCDigJQgZ2l2ZXMgYW4gaG9uZXN0IGFuc3dlciB0aGF0IHJlZmxlY3RzIHRoZVxuICAgIC8vIGN1cnJlbnQgbWluaWZ5IHN0YXRlIGFuZCB0aGUgcmVzdCBvZiB0aGUgdG9nZ2xlcy5cbiAgICBjb25zdCBjb250cmliS2V5czogQXJyYXk8a2V5b2YgUHJlZnM+ID0gWydpbmNsdWRlT3V0ZXJIVE1MJywgJ2luY2x1ZGVNYXRjaGVkUnVsZXMnLCAnaW5jbHVkZVN0eWxlcyddO1xuICAgIGlmIChleHBvcnRUZXh0ICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYmFzZVQgPSB0b2tlbkNvdW50KGV4cG9ydFRleHQpO1xuICAgICAgY29uc3QgYmFzZVcgPSB3b3JkQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmICghZWwpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCB3YXNPbiA9IHByZWZzW2tleV0gYXMgYm9vbGVhbjtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9ICF3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IHdhc09uO1xuICAgICAgICBjb25zdCBhbHRUID0gdG9rZW5Db3VudChhbHRUZXh0KTtcbiAgICAgICAgY29uc3QgYWx0VyA9IHdvcmRDb3VudChhbHRUZXh0KTtcbiAgICAgICAgLy8gd2FzT249dHJ1ZSDihpIgY3VycmVudGx5IGluY2x1ZGVkOyBjb3N0ID0gYmFzZSAtIGFsdCAodHVybmluZyBPRkYgc2F2ZXMgdGhpcykuXG4gICAgICAgIC8vIHdhc09uPWZhbHNlIOKGkiBjdXJyZW50bHkgZXhjbHVkZWQ7IGdhaW4gPSBhbHQgLSBiYXNlICh0dXJuaW5nIE9OIGFkZHMgdGhpcykuXG4gICAgICAgIGNvbnN0IGRUID0gd2FzT24gPyBiYXNlVCAtIGFsdFQgOiBhbHRUIC0gYmFzZVQ7XG4gICAgICAgIGNvbnN0IGRXID0gd2FzT24gPyBiYXNlVyAtIGFsdFcgOiBhbHRXIC0gYmFzZVc7XG4gICAgICAgIGNvbnN0IHNpZ24gPSB3YXNPbiA/ICcnIDogJysnO1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHdhc09uXG4gICAgICAgICAgPyBgwrcgJHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpbiBleHBvcnQke3ByZWZzLm1pbmlmeSA/ICcgKG1pbmlmaWVkKScgOiAnJ31gXG4gICAgICAgICAgOiBgwrcgJHtzaWdufSR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke3NpZ259JHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGlmIGVuYWJsZWRgO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmIChlbCkgZWwudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUb29sYmFyIGV4cG9ydCBzdGF0c1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcuc3RhdC5leHBvcnQtc3RhdHMnKS5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICBjb25zdCBudW0gPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1udW0nKTtcbiAgICAgIGNvbnN0IGxhYiA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LWxhYmVsJyk7XG4gICAgICBpZiAobnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQhLnJlcGxhY2UoL1xcKiQvLCAnJyk7XG4gICAgICBpZiAobGFiKSBsYWIudGV4dENvbnRlbnQgPSBsYWIudGV4dENvbnRlbnQhLnJlcGxhY2UoL15cXCovLCAnJyk7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50ICsgJyonO1xuICAgICAgY29uc3QgaXNUb2tlbiA9IGkgPT09IDA7XG4gICAgICBjb25zdCBmdWxsViA9IGlzVG9rZW4gPyBmdWxsVCA6IGZ1bGxXO1xuICAgICAgY29uc3QgY3VyViA9IGlzVG9rZW4gPyBjdXJUIDogY3VyVztcbiAgICAgIGNvbnN0IHdoaWNoID0gaXNUb2tlbiA/ICd0b2tlbnMnIDogJ3dvcmRzJztcbiAgICAgIHMuZGF0YXNldC50aXAgPSBwcmVmcy5taW5pZnlcbiAgICAgICAgPyBgTUlOSUZJRUQgwrcgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9XFxuRnVsbCB3b3VsZCBiZSAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgXG4gICAgICAgIDogYCR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH0gwrcgZnVsbCBleHBvcnRcXG5NaW5pZmllZCB3b3VsZCBiZSAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWA7XG4gICAgfSk7XG5cbiAgICBpZiAobWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZW1wdHkuY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgICAgIGVtcHR5LmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiZW1wdHktaWNvblwiPvCfpI88L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LXRpdGxlXCI+U3RhcnQgd2l0aCB0aGUgcGFnZSB5b3Ugd2FudCB0byBjcml0aXF1ZS48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LWJvZHlcIj5PcGVuIGEgcGFnZSwgdGhlbiBjYXB0dXJlIGFuIGVsZW1lbnQuIENvbW1lbnRzIHN0YXkgcGFpcmVkIHdpdGggdGhlIHRoaW5nIHlvdSBncmFiYmVkLjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHkta2V5c1wiPkFsdCtDbGljayB0byBjYXB0dXJlPC9kaXY+YDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSByZW5kZXJQZW5kaW5nQmF5KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0b3JVcmxzID0gbmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS51cmwpKTtcbiAgICBjb25zdCB2aXNpYmxlTWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0udHlwZSAhPT0gJ3BhZ2UnIHx8IHNlbGVjdG9yVXJscy5oYXMobS51cmwpKTtcbiAgICBjb25zdCBwaW5uZWQgPSB2aXNpYmxlTWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIEJvb2xlYW4obS5waW5uZWQpKTtcbiAgICBjb25zdCB1bnBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pID0+ICFwaW5uZWQuaW5jbHVkZXMobSBhcyBTZWxlY3Rvck1lc3NhZ2UpKTtcbiAgICAvLyBTaWRlYmFyIHNob3dzIGNhcHR1cmVzIGluIElOU0VSVElPTiBvcmRlciAobW9zdCByZWNlbnQgYXQgdGhlXG4gICAgLy8gYm90dG9tKS4gVmlzdWFsLXBvc2l0aW9uIHJlb3JkZXJpbmcgaGFwcGVucyBPTkxZIGF0IGV4cG9ydCB0aW1lXG4gICAgLy8gc28gdGhlIHNpZGViYXIgc3RheXMgcHJlZGljdGFibGUgd2hpbGUgdGhlIGFnZW50LWZhY2luZyBleHBvcnRcbiAgICAvLyBnZXRzIHJlYWRpbmctb3JkZXIgY29udmVuaWVuY2UuIChQcmlvciBpbXBsZW1lbnRhdGlvbiBzb3J0ZWQgaW5cbiAgICAvLyBib3RoIHBsYWNlczsgdXNlciBmZWVkYmFjayB3YXMgdGhhdCBzaWRlYmFyIHNodWZmbGluZyB3YXNcbiAgICAvLyBkaXNvcmllbnRpbmcuKVxuICAgIGNvbnN0IG9yZGVyZWQgPSBbLi4ucGlubmVkLCAuLi51bnBpbm5lZF07XG5cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG1lc3NhZ2VzWzBdIS5pZCkpO1xuICAgIGxldCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIC8vIFRyYWNrIHRoZSBVUkwgb2YgdGhlIG1vc3QgcmVjZW50bHkgcmVuZGVyZWQgcGFnZSBkaXZpZGVyIHNvIHdlIGNhblxuICAgIC8vIHN1cHByZXNzIGEgcmVwZWF0ZWQgaGVhZGVyIHdoZW4gY29uc2VjdXRpdmUgY2FwdHVyZXMgc2hhcmUgdGhlIHNhbWVcbiAgICAvLyBwYWdlLiBSZXN0YXRpbmcgdGhlIFVSTCBhYm92ZSBldmVyeSBjYXB0dXJlIGluIGEgc2FtZS1VUkwgcnVuIGlzXG4gICAgLy8gbm9pc2Ug4oCUIHRoZSBkaXZpZGVyIG9ubHkgZWFybnMgaXRzIHNwYWNlIHdoZW4gdGhlIFVSTCBhY3R1YWxseVxuICAgIC8vIGNoYW5nZXMgZnJvbSB0aGUgcHJldmlvdXMgY2FwdHVyZSBpbiBzZXF1ZW5jZS5cbiAgICBsZXQgbGFzdFJlbmRlcmVkUGFnZVVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJlbmRlcmVkQW55ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmRlcmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gb3JkZXJlZFtpXSE7XG4gICAgICBpZiAoIW1hdGNoZXNTZWFyY2gobSkpIGNvbnRpbnVlO1xuICAgICAgLy8gQ29sbGFwc2UgY29uc2VjdXRpdmUgc2FtZS1VUkwgcGFnZSBkaXZpZGVycyBpbnRvIHRoZSBmaXJzdCBvbmUuXG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgaWYgKG0udXJsID09PSBsYXN0UmVuZGVyZWRQYWdlVXJsKSBjb250aW51ZTtcbiAgICAgICAgbGFzdFJlbmRlcmVkUGFnZVVybCA9IG0udXJsO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZSA9IHJlbmRlck1lc3NhZ2UobSwgbGFzdFNlbGVjdG9yU2VsKTtcbiAgICAgIGxpc3QuYXBwZW5kKG5vZGUpO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgbGFzdFNlbGVjdG9yU2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGlmIChpIDwgb3JkZXJlZC5sZW5ndGggLSAxKSBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG9yZGVyZWRbaSArIDFdIS5pZCkpO1xuICAgICAgcmVuZGVyZWRBbnkgPSB0cnVlO1xuICAgIH1cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKCdfX2VuZF9fJykpO1xuICAgIGlmICghcmVuZGVyZWRBbnkgJiYgc2VhcmNoUXVlcnkpIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSBgTm8gbWF0Y2hlcyBmb3IgXCIke3NlYXJjaFF1ZXJ5fVwiLmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgfVxuXG4gICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgcmVuZGVyUGhhbnRvbSgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhd05vb2RsZXMpO1xuICAgIGlmIChzdGlja1RvQm90dG9tKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQZW5kaW5nQmF5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBlbmRpbmctYmF5Jyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJheS5jbGFzc05hbWUgPSAncGVuZGluZy1iYXknO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgUGVuZGluZyBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9IGVsZW1lbnQke3BlbmRpbmdNdWx0aS5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gO1xuICAgIGJheS5hcHBlbmQoaGVhZCk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNhcmQuY2xhc3NOYW1lID0gJ3BlbmRpbmctY2FyZCc7XG4gICAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7aSArIDF9YDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSAoZS50ZXh0ICYmIGUudGV4dC5sZW5ndGggPD0gNjAgPyBlLnRleHQgOiAoZS5jb21wb25lbnRSb290ID8/IGUuc2VsZWN0b3IgPz8gZS50YWcpKTtcbiAgICAgIGNhcmQuYXBwZW5kKHNlcSwgbGFiZWwpO1xuICAgICAgYmF5LmFwcGVuZChjYXJkKTtcbiAgICB9KTtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3BlbmRpbmctcm93JztcbiAgICBjb25zdCBjb21taXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb21taXQudHlwZSA9ICdidXR0b24nO1xuICAgIGNvbW1pdC5jbGFzc05hbWUgPSAncHJpbWFyeSBwZW5kaW5nLWNvbW1pdCc7XG4gICAgY29tbWl0LnRleHRDb250ZW50ID0gYENvbW1pdCBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9YDtcbiAgICBjb21taXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY29tbWl0J30pKTtcbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwZW5kaW5nLWNhbmNlbCc7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJztcbiAgICBjYW5jZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJyk7XG4gICAgY2FuY2VsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDEzKTtcbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY2FuY2VsJ30pKTtcbiAgICByb3cuYXBwZW5kKGNvbW1pdCwgY2FuY2VsKTtcbiAgICBiYXkuYXBwZW5kKHJvdyk7XG4gICAgY29uc3QgaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhpbnQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGludCc7XG4gICAgaGludC50ZXh0Q29udGVudCA9ICdBbHQrU2hpZnQrQ2xpY2sgbW9yZSDCtyBDb21taXQgdG8gZmluYWxpemUgwrcgRXNjIHRvIGNhbmNlbCc7XG4gICAgYmF5LmFwcGVuZChoaW50KTtcbiAgICBsaXN0LmFwcGVuZChiYXkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBOb29kbGVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBjbGVhck5vb2RsZXMgPSAoKTogdm9pZCA9PiB7IGZvciAoY29uc3QgbiBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmVlLW5vb2RsZScpKSBuLnJlbW92ZSgpOyB9O1xuXG4gIC8vIENyb3NzLXNlYW0gcGFuZWzihpRjYW52YXMgbm9vZGxlcyB3ZXJlIHJlbW92ZWQ6IGFsaWduaW5nIHR3byBTVkcgaGFsdmVzXG4gIC8vIGFjcm9zcyB0aGUgcGFuZWwvcGFnZSBib3VuZGFyeSBkZXBlbmRlZCBvbiBpbm5lckhlaWdodCBwYXJpdHkgd2hpY2hcbiAgLy8gYnJlYWtzIHVuZGVyIERldlRvb2xzIGRvY2sgYW5kIHpvb20sIGFuZCB0aGUgdmlzdWFsIGJlbmVmaXQgZGlkbid0XG4gIC8vIGp1c3RpZnkgdGhlIG1haW50ZW5hbmNlIGNvc3QuIFRoZSBpbi1wYW5lbCBmZWVkYmFjay10cmVlIG5vb2RsZXNcbiAgLy8gKGRyYXdOb29kbGUgLyByZWRyYXdOb29kbGVzIGJlbG93KSBhcmUgdW5hZmZlY3RlZC5cbiAgY29uc3QgY2xlYXJCdWJibGVOb29kbGUgPSAoKTogdm9pZCA9PiB7IC8qIG5vLW9wICovIH07XG4gIGNvbnN0IHJlZHJhd05vb2RsZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJOb29kbGVzKCk7XG4gICAgbGV0IGxhc3RTZWxlY3RvckVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBbLi4ubGlzdC5jaGlsZHJlbl0gYXMgSFRNTEVsZW1lbnRbXSkge1xuICAgICAgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtc2cnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0b3InKSkgbGFzdFNlbGVjdG9yRWwgPSBub2RlO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWVkYmFjaycpICYmIGxhc3RTZWxlY3RvckVsKSBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCBub2RlKTtcbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtcmFpbCcpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5pbmxpbmUtY29tbWVudCcpID8/IG5vZGU7XG4gICAgICAgIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIHRhcmdldCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRpdmlkZXInKSB8fCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZ3JvdXAtaGVhZCcpKSB7XG4gICAgICAgIGxhc3RTZWxlY3RvckVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGRyYXdOb29kbGUgPSAoc2VsZWN0b3JFbDogSFRNTEVsZW1lbnQsIGZlZWRiYWNrRWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc1IgPSBzZWxlY3RvckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGZSID0gZmVlZGJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBsUiA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgeDEgPSBzUi5sZWZ0IC0gbFIubGVmdCArIDEyO1xuICAgIGNvbnN0IHkxID0gc1IuYm90dG9tIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3A7XG4gICAgY29uc3QgeDIgPSBmUi5sZWZ0IC0gbFIubGVmdDtcbiAgICBjb25zdCB5MiA9IGZSLnRvcCAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wICsgMTQ7XG4gICAgY29uc3QgdyA9IE1hdGgubWF4KDIwLCB4MiAtIHgxICsgNCk7XG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDIwLCB5MiAtIHkxKTtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RyZWUtbm9vZGxlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcodykpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFN0cmluZyhoKSk7XG4gICAgc3ZnLnN0eWxlLmxlZnQgPSBgJHt4MSAtIDJ9cHhgO1xuICAgIHN2Zy5zdHlsZS50b3AgPSBgJHt5MX1weGA7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIGNvbnN0IHN4ID0gMiwgc3kgPSAwLCBleCA9IHcgLSAyLCBleSA9IGg7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBgTSAke3N4fSAke3N5fSBDICR7c3h9ICR7c3kgKyBoICogMC41NX0sICR7ZXggLSB3ICogMC40fSAke2V5fSwgJHtleH0gJHtleX1gKTtcbiAgICBzdmcuYXBwZW5kKHBhdGgpO1xuICAgIGxpc3QuYXBwZW5kKHN2Zyk7XG4gIH07XG4gIGxldCBzY3JvbGxSYWYgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmFmKSByZXR1cm47XG4gICAgc2Nyb2xsUmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgc2Nyb2xsUmFmID0gMDsgcmVkcmF3Tm9vZGxlcygpOyB9KTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZWRyYXdOb29kbGVzKTtcblxuICAvLyDilIDilIDilIAgUGVyLW1lc3NhZ2UgcmVuZGVyZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCByZW5kZXJNZXNzYWdlID0gKG06IFBhbmVsTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIHJlbmRlclBhZ2UobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHJlbmRlclNlbGVjdG9yKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiByZW5kZXJGZWVkYmFjayhtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQYWdlID0gKG06IFBhZ2VNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkLmNsYXNzTmFtZSA9ICdwYWdlLWRpdmlkZXInO1xuICAgIGQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgY29uc3QgdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdHMuY2xhc3NOYW1lID0gJ3RhYi1zdGF0dXMnO1xuICAgIHRzLmRhdGFzZXQudXJsID0gbS51cmw7XG4gICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB0cy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgZC5hcHBlbmQodHMpO1xuICAgIGNvbnN0IHUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdS5jbGFzc05hbWUgPSAndXJsJztcbiAgICB1LnRleHRDb250ZW50ID0gbS51cmw7XG4gICAgdS5kYXRhc2V0LnRpcCA9IGAke20udGl0bGUgPz8gJyd9IMK3ICR7bS51cmx9YDtcbiAgICBkLmFwcGVuZCh1KTtcbiAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBvbiB0aGlzIHBhZ2UgaW4gdGhlIGFjdGl2ZSB0YWIsIGNsaWNraW5nIHRoZSBVUkxcbiAgICAgIC8vIHNob3VsZG4ndCByZWxvYWQgb3Igc3RlYWwgZm9jdXMg4oCUIGl0IHNob3VsZCBqdXN0IGJlIGEgbm8tb3BcbiAgICAgIC8vIHZpc3VhbGx5ICh0aGUgcm93IGFscmVhZHkgaW5kaWNhdGVzIFwib3BlblwiIHZpYSAudGFiLXN0YXR1cykuIFRoZVxuICAgICAgLy8gdXNlciBjb21wbGFpbmVkIGFib3V0IGdldHRpbmcgZm9yY2VkIGludG8gYSBuYXZpZ2F0aW9uIHdoZW4gdGhleVxuICAgICAgLy8gd2VyZSBqdXN0IHRyeWluZyB0byByZWFkIHRoZSByb3cuXG4gICAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHtcbiAgICAgICAgc2V0U3RhdHVzKCdBbHJlYWR5IG9uIHRoaXMgcGFnZScsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgciA9IGF3YWl0IHNlbmRUb0JnPHtmb3VuZD86IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcjsgZXJyb3I/OiBzdHJpbmd9Pih7a2luZDogJ3N3aXRjaC10by10YWInLCB1cmw6IG0udXJsLCBvcGVuSWZNaXNzaW5nOiB0cnVlfSk7XG4gICAgICBpZiAocj8uZm91bmQpIHNldFN0YXR1cygnU3dpdGNoZWQgdG8gdGFiJyk7XG4gICAgICBlbHNlIGlmIChyPy5vcGVuZWQpIHNldFN0YXR1cygnT3BlbmVkIGluIG5ldyB0YWInKTtcbiAgICAgIGVsc2Ugc2V0U3RhdHVzKFwiQ291bGRuJ3Qgb3BlbiB0YWJcIiwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pO1xuICAgIHJldHVybiBkO1xuICB9O1xuXG4gIGNvbnN0IHRpdGxlRnJvbUVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXN0SWQpIHJldHVybiBgW3Rlc3RJZD0ke2UudGVzdElkfV1gO1xuICAgIGlmIChlLmlkKSByZXR1cm4gYCMke2UuaWR9YDtcbiAgICBpZiAoZS5jbGFzc2VzPy5sZW5ndGgpIHJldHVybiBgJHtlLnRhZ30uJHtlLmNsYXNzZXMuc2xpY2UoMCwgMikuam9pbignLicpfWA7XG4gICAgcmV0dXJuIGUuc2VsZWN0b3IgfHwgZS50YWcgfHwgJyh1bmtub3duKSc7XG4gIH07XG5cbiAgLy8gUGljayB0aGUgbW9zdCBcImh1bWFubHkgcmVhZGFibGVcIiBsYWJlbCBmb3IgdGhlIGJ1YmJsZSBwcmV2aWV3LiBQcmVmZXJzXG4gIC8vIHZpc2libGUtdG8tdXNlciB0ZXh0IGluIHRoaXMgcHJpb3JpdHk6XG4gIC8vICAgMS4gaW5uZXJUZXh0IC8gdGV4dENvbnRlbnQgKGBlbnRyeS50ZXh0YCkg4oCUIHdoYXQgdGhlIHVzZXIgcmVhZHMgb24gc2NyZWVuXG4gIC8vICAgMi4gYWNjZXNzaWJsZU5hbWUgKGFyaWEtbGFiZWwgLyB0aXRsZSAvIGFsdCBmYWxsYmFjayBjaGFpbilcbiAgLy8gICAzLiBpbnB1dCB2YWx1ZSAoc2tpcHBlZCBpZiBpdCdzIHRoZSBtYXNrZWQgcGFzc3dvcmQgcGxhY2Vob2xkZXIpXG4gIC8vICAgNC4gaW5wdXQgcGxhY2Vob2xkZXJcbiAgLy8gICA1LiBpbWcgYWx0XG4gIC8vICAgNi4gY29tcG9uZW50Um9vdCAoZS5nLiBcImJ1dHRvbiNjdGFcIilcbiAgLy8gICA3LiB0aXRsZUZyb21FbnRyeSDigJQgbGFzdC1yZXNvcnQgdGFnL2NsYXNzL2lkIGZhbGxiYWNrXG4gIC8vIENTUyBoYW5kbGVzIHZpc3VhbCB0cnVuY2F0aW9uIHZpYSB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3ZSBzaGlwIHRoZVxuICAvLyBmdWxsIHN0cmluZyBzbyB0aGUgdG9vbHRpcCBvbiBob3ZlciBjYW4gc2hvdyB0aGUgY29tcGxldGUgdmFsdWUuXG4gIGNvbnN0IG5pY2VMYWJlbCA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGV4dCkgcmV0dXJuIGUudGV4dDtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSkgcmV0dXJuIGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgY29uc3QgdiA9IGUuYXR0cnM/LnZhbHVlO1xuICAgIGlmICh2ICYmIHYgIT09ICfigKLigKLigKLigKInKSByZXR1cm4gdjtcbiAgICBpZiAoZS5hdHRycz8ucGxhY2Vob2xkZXIpIHJldHVybiBlLmF0dHJzLnBsYWNlaG9sZGVyO1xuICAgIGlmIChlLmF0dHJzPy5hbHQpIHJldHVybiBlLmF0dHJzLmFsdDtcbiAgICBpZiAoZS5jb21wb25lbnRSb290KSByZXR1cm4gZS5jb21wb25lbnRSb290O1xuICAgIHJldHVybiB0aXRsZUZyb21FbnRyeShlKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTZWxlY3RvciA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgdmFsaWQgPSBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzYW1lUGF0aCA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJykgPT09IGxpdmVUYWJQYXRoO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIHNlbGVjdG9yJztcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlICYmIHNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhbGUnKTtcbiAgICBlbHNlIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgIXNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnZGlmZi1wYWdlJyk7XG4gICAgaWYgKG0ucGlubmVkKSBkaXYuY2xhc3NMaXN0LmFkZCgncGlubmVkJyk7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2hhcy1ncm91cCcpO1xuICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yID09PSBsYXN0QWN0aXZlU2VsZWN0b3IpIGRpdi5jbGFzc0xpc3QuYWRkKCdsYXN0LWFjdGl2ZScpO1xuICAgIC8vIEF1dG8tZXhwYW5kIG9uIHNlYXJjaCBoaXQgc28gdGhlIHVzZXIgc2VlcyB3aGVyZSB0aGUgbWF0Y2ggbGFuZGVkLlxuICAgIGNvbnN0IG1hdGNoZWRCb2R5ID0gYm9keU1hdGNoZXNTZWFyY2gobSk7XG4gICAgaWYgKG1hdGNoZWRCb2R5KSBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnLCAnc2VhcmNoLWhpdCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuZGF0YXNldC5zZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgLy8gRHJhZy10by1yZXBhcmVudDogZXZlcnkgc2VsZWN0b3IgYnViYmxlIGlzIGEgdmFsaWQgZHJvcCB0YXJnZXQgZm9yXG4gICAgLy8gYSBjb21tZW50IGJlaW5nIGRyYWdnZWQgZnJvbSBlbHNld2hlcmUgaW4gdGhlIHNpZGViYXIuXG4gICAgd2lyZVNlbGVjdG9yRHJvcFRhcmdldChkaXYsIG0pO1xuXG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ2hlYWQnO1xuICAgIGNvbnN0IGNhcmV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNhcmV0LmNsYXNzTmFtZSA9ICdjYXJldCc7XG4gICAgY2FyZXQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGV2cm9uLXJpZ2h0JywgMTIpO1xuICAgIGhlYWQuYXBwZW5kKGNhcmV0KTtcbiAgICBjb25zdCBwaW5NYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcGluTWFya2VyLmNsYXNzTmFtZSA9ICdwaW4tbWFya2VyJztcbiAgICBwaW5NYXJrZXIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdzdGFyLWZpbGxlZCcsIDExKTtcbiAgICBoZWFkLmFwcGVuZChwaW5NYXJrZXIpO1xuICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgc2VxLnRleHRDb250ZW50ID0gYCMke20uZW50cnkubn1gO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIHNlcS50ZXh0Q29udGVudCArPSBgKyR7bS5lbnRyeS5ncm91cC5sZW5ndGh9YDtcbiAgICBoZWFkLmFwcGVuZChzZXEpO1xuICAgIGNvbnN0IGNvbXBhY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29tcGFjdC5jbGFzc05hbWUgPSAnY29tcGFjdCc7XG4gICAgY29uc3QgY29tcGFjdFN0ciA9IG5pY2VMYWJlbChtLmVudHJ5KTtcbiAgICBjb21wYWN0LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGNvbXBhY3RTdHIsIHNlYXJjaFF1ZXJ5KTtcbiAgICAvLyBTaG93IHRoZSBmdWxsIGxhYmVsIG9uIGhvdmVyIGV2ZW4gd2hlbiBDU1MgZWxsaXBzaXMgdHJ1bmNhdGVzIHRoZVxuICAgIC8vIHZpc2libGUgcG9ydGlvbiDigJQgdXNlZnVsIHdoZW4gdGhlIHZpc2libGUgdGV4dC9wbGFjZWhvbGRlciBpcyBsb25nLlxuICAgIGlmIChjb21wYWN0U3RyLmxlbmd0aCA+IDI0KSBjb21wYWN0LmRhdGFzZXQudGlwID0gY29tcGFjdFN0cjtcbiAgICBoZWFkLmFwcGVuZChjb21wYWN0KTtcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9IHIgPyBgJHtyLnd9w5cke3IuaH1gIDogKG0uZW50cnkudGFnID8/ICcnKTtcbiAgICBoZWFkLmFwcGVuZChtZXRhKTtcbiAgICBkaXYuYXBwZW5kKGhlYWQpO1xuXG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzdW1tYXJ5LmNsYXNzTmFtZSA9ICdwZWVrLXN1bW1hcnknO1xuICAgIHN1bW1hcnkuaW5uZXJIVE1MID0gYDxzcGFuIGRhdGEtaWNvbj1cImFsZXJ0LWNpcmNsZVwiIGRhdGEtc2l6ZT1cIjExXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ0XCI+JHtkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWZmLXBhZ2UnKSA/ICdkaWZmZXJlbnQgcGFnZScgOiAnc3RhbGUnfTwvc3Bhbj5gO1xuICAgIGhlYWQuYXBwZW5kKHN1bW1hcnkpO1xuICAgIG1vdW50SWNvbnMoc3VtbWFyeSk7XG5cbiAgICBjb25zdCBlcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnIuY2xhc3NOYW1lID0gJ3BlZWstZXJyb3InO1xuICAgIGNvbnN0IHJlYXNvbiA9IHNlbGVjdG9yRXJyb3JzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBwYXRoRnJvbUVudHJ5ID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKTtcbiAgICBlcnIuaW5uZXJIVE1MID0gc2FtZVBhdGhcbiAgICAgID8gYDxiPlN0YWxlPC9iPiDCtyAke2VzY2FwZUh0bWwocmVhc29uID8/ICdubyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcy4nKX08YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gXG4gICAgICA6IGBDYXB0dXJlZCBvbiA8Y29kZT4ke2VzY2FwZUh0bWwocGF0aEZyb21FbnRyeSl9PC9jb2RlPiDigJQgY3VycmVudCB0YWIgaXMgPGNvZGU+JHtlc2NhcGVIdG1sKGxpdmVUYWJQYXRoID8/ICcnKX08L2NvZGU+LiBTd2l0Y2ggdGFicyB0byB2YWxpZGF0ZS48YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gO1xuICAgIGRpdi5hcHBlbmQoZXJyKTtcblxuICAgIC8vIEFuY2VzdG9yIGJyZWFkY3J1bWIg4oCUIFBsYXNtaWMtc3R5bGUgZXNjYWxhdG9yLiBDaGlwcyBmb3IgZWFjaCBlbnRyeSBpblxuICAgIC8vIGVudHJ5LmFuY2VzdG9ycyAoY2xvc2VzdCBmaXJzdCkuIENsaWNrIGEgY2hpcCB0byBjYXB0dXJlIHRoYXRcbiAgICAvLyBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIChkZXB0aCA9IGNoaXAgaW5kZXggKyAxIHNpbmNlIHRoZSBlbnRyeSdzXG4gICAgLy8gb3duIHNlbGVjdG9yIGlzIGRlcHRoIDApLiBCcmlnaHRuZXNzIGdyYWRpZW50IGRhcmtlbnMgZGVlcGVyIGNoaXBzLlxuICAgIGlmIChtLmVudHJ5LmFuY2VzdG9ycz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjcnVtYnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNydW1icy5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY3J1bWJzJztcbiAgICAgIGNydW1icy5kYXRhc2V0LnRpcCA9ICdDbGljayBhIGNydW1iIHRvIGVzY2FsYXRlIHRoZSBjYXB0dXJlIHRvIGFuIGFuY2VzdG9yIGVsZW1lbnQnO1xuICAgICAgbS5lbnRyeS5hbmNlc3RvcnMuZm9yRWFjaCgoYW5jLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2hpcC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGNoaXAuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNoaXAnO1xuICAgICAgICAvLyBCcmlnaHRuZXNzIGdyYWRpZW50OiBkZWVwZXIgY2hpcHMgZ2V0IHByb2dyZXNzaXZlbHkgZGltbWVyLlxuICAgICAgICBjaGlwLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7KDEgLSBpICogMC4wOCkudG9GaXhlZCgyKX0pYDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBhbmMudGVzdElkID8gYFske2FuYy50ZXN0SWR9XWBcbiAgICAgICAgICA6IGFuYy5pZCA/IGAjJHthbmMuaWR9YFxuICAgICAgICAgIDogYW5jLmNsYXNzZXM/Lmxlbmd0aCA/IGAke2FuYy50YWd9LiR7YW5jLmNsYXNzZXNbMF19YFxuICAgICAgICAgIDogYW5jLnRhZztcbiAgICAgICAgY2hpcC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjaGlwLmRhdGFzZXQudGlwID0gYENhcHR1cmUgdGhlIGFuY2VzdG9yICR7aSArIDF9IGxldmVsJHtpID8gJ3MnIDogJyd9IHVwIMK3ICR7YW5jLnRhZ30ke2FuYy5pZCA/ICcjJyArIGFuYy5pZCA6ICcnfWA7XG4gICAgICAgIC8vIEhvdmVyLXByZXZpZXcgdGhlIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2Ugc28gdGhlIHVzZXIgY2FuIHNlZVxuICAgICAgICAvLyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNvbW1pdHRpbmcuIE1pcnJvcnMgaG93XG4gICAgICAgIC8vIGhvdmVyaW5nIGEgc2VsZWN0b3IgYnViYmxlIHBhaW50cyBpdHMgcmluZy4gQ2xlYXJpbmcgb25cbiAgICAgICAgLy8gbW91c2VsZWF2ZSBzd2FwcyBiYWNrIHRvIHRoZSBidWJibGUncyBvd24gb3V0bGluZSAodGhlIGJ1YmJsZSdzXG4gICAgICAgIC8vIG1vdXNlZW50ZXIgaGFuZGxlciBwYWludGVkIGl0OyBsZWF2aW5nIHRoZSBjaGlwIGp1c3QgcmVtb3Zlc1xuICAgICAgICAvLyB0aGUgb3ZlcnJpZGUpLlxuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gUmUtcGFpbnQgdGhlIGJ1YmJsZSdzIG93biByaW5nIHJhdGhlciB0aGFuIGNsZWFyaW5nIGVudGlyZWx5XG4gICAgICAgICAgLy8gc28gdGhlIHVzZXIgZG9lc24ndCBzZWUgYSBmbGlja2VyIG9mIFwibm90aGluZ1wiIGJldHdlZW4gY2hpcHMuXG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7XG4gICAgICAgICAgICBraW5kOiAnY2FwdHVyZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDEsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKGBDYXB0dXJlZCBhbmNlc3RvciAke2FuYy50YWd9YCk7XG4gICAgICAgICAgZWxzZSBzZXRTdGF0dXMoJ0NvdWxkIG5vdCBjYXB0dXJlIGFuY2VzdG9yJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICB9KTtcbiAgICAgICAgY3J1bWJzLmFwcGVuZChjaGlwKTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFwcGVuZChjcnVtYnMpO1xuICAgIH1cblxuICAgIC8vIFByZXZpZXcgdGlsZS4gVGhlIGZ1bGwgUE5HIGxpdmVzIG9uIGRpc2sgdW5kZXJcbiAgICAvLyAucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvOyB0aGUgZGF0YVVybCBpcyBhIHNpZGUtcGFuZWwtZnJpZW5kbHlcbiAgICAvLyBkb3duc2NhbGUgKOKJpDMyMHB4IHdpZGUpLiBUbyBzdG9wIHRoZSBsYXlvdXQgZnJvbSBqdW1waW5nIHdoZW4gYSBzaG90XG4gICAgLy8gYXJyaXZlcyBhIHNlY29uZCBhZnRlciBjYXB0dXJlLCB3ZSBSRVNFUlZFIHRoZSBmaW5hbCBpbWFnZSBoZWlnaHQgdXBcbiAgICAvLyBmcm9udCB1c2luZyB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGtub3duIGFzcGVjdCByYXRpbyBhbmQgcGFpbnQgYVxuICAgIC8vIHNrZWxldG9uIGxvYWRlciBpbiB0aGF0IHNwYWNlLCB0aGVuIHN3YXAgdGhlIHNjcmVlbnNob3QgaW4gd2l0aCBub1xuICAgIC8vIHJlZmxvdy4gVGhlIHJlc2VydmF0aW9uIG9ubHkgaGFwcGVucyB3aGVuIGEgc2hvdCBpcyBhY3R1YWxseSBleHBlY3RlZFxuICAgIC8vIChhdXRvU2NyZWVuc2hvdCBvbiwgaG9zdCBub3Qgc2tpcHBlZCwgbm8gcmVjb3JkZWQgZmFpbHVyZSkgc28gY2FwdHVyZXNcbiAgICAvLyB0aGF0IHdpbGwgbmV2ZXIgZ2V0IGEgc2hvdCBkb24ndCBjYXJyeSBhbiBlbXB0eSBib3guXG4gICAgY29uc3Qgc2hvdERhdGFVcmwgPSBzaG90cy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3Qgc2hvdEV4cGVjdGVkID0gcHJlZnMuYXV0b1NjcmVlbnNob3RcbiAgICAgICYmICFzaG91bGRTa2lwU2NyZWVuc2hvdChtLmVudHJ5LnVybCA/PyAnJylcbiAgICAgICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIGlmIChzaG90RGF0YVVybCB8fCBzaG90RXhwZWN0ZWQpIHtcbiAgICAgIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXcuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgLy8gUmVzZXJ2ZSB2ZXJ0aWNhbCBzcGFjZSBpbW1lZGlhdGVseSBmcm9tIHRoZSBlbGVtZW50J3Mgd2lkdGgvaGVpZ2h0LlxuICAgICAgLy8gVGhlIHRodW1ibmFpbCBpcyByZW5kZXJlZCBhdCB0aGUgYnViYmxlJ3MgY29udGVudCB3aWR0aCwgc28gdGhlIGJveFxuICAgICAgLy8gaGVpZ2h0IHRyYWNrcyB0aGUgZWxlbWVudCdzIGFzcGVjdCByYXRpby4gQ2xhbXAgc28gYSB2ZXJ5IHRhbGxcbiAgICAgIC8vIGVsZW1lbnQgZG9lc24ndCByZXNlcnZlIGFuIGFic3VyZCBhbW91bnQgb2Ygc3BhY2UuXG4gICAgICBjb25zdCByID0gbS5lbnRyeS5yZWN0O1xuICAgICAgaWYgKHIgJiYgci53ID4gMCAmJiByLmggPiAwKSB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gTWF0aC5taW4oTWF0aC5tYXgoci5oIC8gci53LCAwLjEyKSwgMi4yKTtcbiAgICAgICAgcHJldmlldy5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zaG90LXJhdGlvJywgU3RyaW5nKHJhdGlvKSk7XG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgncmVzZXJ2ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaG90RGF0YVVybCkge1xuICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nLmNsYXNzTmFtZSA9ICdzaG90JztcbiAgICAgICAgaW1nLmFsdCA9IGBTY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gO1xuICAgICAgICAvLyBSZXZlYWwgb25seSBvbmNlIGRlY29kZWQgc28gdGhlIHN3YXAgaXMgaW5zdGFudCBhbmQgcmVmbG93LWZyZWU7XG4gICAgICAgIC8vIHRoZSBza2VsZXRvbiBzdGF5cyB2aXNpYmxlIHVuZGVybmVhdGggdW50aWwgdGhlbi5cbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpKTtcbiAgICAgICAgaW1nLnNyYyA9IHNob3REYXRhVXJsO1xuICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChpbWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gc2hvdCB5ZXQg4oCUIHNob3cgYSBza2VsZXRvbiBzaGltbWVyIG9jY3VweWluZyB0aGUgcmVzZXJ2ZWQgc3BhY2UuXG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuICAgICAgICBjb25zdCBza2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNrZWwuY2xhc3NOYW1lID0gJ3Nob3Qtc2tlbGV0b24nO1xuICAgICAgICBza2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBMb2FkaW5nIHNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChza2VsKTtcbiAgICAgIH1cbiAgICAgIGRpdi5hcHBlbmQocHJldmlldyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0cy5jbGFzc05hbWUgPSAnZW50LXN0YXRzJztcbiAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgIGNvbnN0IG15VG9rZW5zID0gdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtLmVudHJ5KSk7XG4gICAgY29uc3QgdG90YWxUb2tlbnMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobW0pOiBtbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5yZWR1Y2UoKHMsIG1tKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtbS5lbnRyeSkpLCAwKTtcbiAgICBjb25zdCBzaGFyZVBjdCA9IHRvdGFsVG9rZW5zID4gMCA/IE1hdGgucm91bmQoKG15VG9rZW5zIC8gdG90YWxUb2tlbnMpICogMTAwKSA6IDA7XG4gICAgY29uc3QgZ3JvdXBDb3VudCA9IG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGdyb3VwVG9rZW5zID0gKG0uZW50cnkuZ3JvdXAgPz8gW10pLnJlZHVjZSgocywgZykgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkoZykpLCAwKTtcbiAgICB0eXBlIFN0YXRDZWxsID0ge2xhYmVsOiBzdHJpbmc7IHZhbHVlOiBzdHJpbmc7IHRpcDogc3RyaW5nfTtcbiAgICBjb25zdCBjZWxsczogU3RhdENlbGxbXSA9IFtcbiAgICAgIHtsYWJlbDogJ0hUTUwnLCB2YWx1ZTogYCR7bS5lbnRyeS5vdXRlckhUTUw/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ091dGVyIEhUTUwgY2hhciBsZW5ndGgnfSxcbiAgICAgIHtsYWJlbDogJ1Rva2VucycsIHZhbHVlOiBgJHtteVRva2Vuc31gLCB0aXA6ICdBcHByb3ggTExNIHRva2VucyBmb3IgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnU2hhcmUnLCB2YWx1ZTogYCR7c2hhcmVQY3R9JWAsIHRpcDogJ1Rva2VuIHNoYXJlIG9mIGFsbCBzZWxlY3RvcnMnfSxcbiAgICAgIHtsYWJlbDogJ0NvbW1lbnRzJywgdmFsdWU6IGAke2ZiLmxlbmd0aH1gLCB0aXA6ICdJbmxpbmUgY29tbWVudHMgdGhyZWFkZWQgdW5kZXIgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnUnVsZXMnLCB2YWx1ZTogYCR7bS5lbnRyeS5tYXRjaGVkUnVsZXM/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ01hdGNoZWQgQ1NTIHJ1bGVzJ30sXG4gICAgICB7bGFiZWw6ICdTdHlsZXMnLCB2YWx1ZTogYCR7T2JqZWN0LmtleXMobS5lbnRyeS5zdHlsZXMgPz8ge30pLmxlbmd0aH1gLCB0aXA6ICdDb21wdXRlZC1zdHlsZSBmaWVsZHMga2VwdCd9LFxuICAgIF07XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAnLCB2YWx1ZTogYCR7Z3JvdXBDb3VudH1gLCB0aXA6ICdNZW1iZXJzIGZvbGRlZCBpbnRvIHRoaXMgZ3JvdXAnfSk7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwIFQnLCB2YWx1ZTogYCR7Z3JvdXBUb2tlbnN9YCwgdGlwOiAnVG9rZW5zIGNvbnRyaWJ1dGVkIGJ5IGdyb3VwIG1lbWJlcnMnfSk7XG4gICAgfVxuICAgIHN0YXRzLmlubmVySFRNTCA9IGNlbGxzLm1hcCgoYykgPT5cbiAgICAgIGA8c3BhbiBjbGFzcz1cImVudC1zdGF0XCIgZGF0YS10aXA9XCIke2VzY2FwZUh0bWwoYy50aXApfVwiPjxzcGFuIGNsYXNzPVwibGJsXCI+JHtjLmxhYmVsfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbFwiPiR7Yy52YWx1ZX08L3NwYW4+PC9zcGFuPmAsXG4gICAgKS5qb2luKCcnKTtcbiAgICBkaXYuYXBwZW5kKHN0YXRzKTtcblxuICAgIC8vIOKUgOKUgCBKU09OIHBhbmUgd2l0aCB0b29sYmFyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vIFRvb2xiYXIgYWJvdmUgdGhlIEpTT04gYm9keTogbGVmdCA9IGxpbmUtd3JhcCB0b2dnbGUsIHJpZ2h0ID0gY29weS5cbiAgICAvLyBUaGUgSlNPTiBpdHNlbGYgcmVmbGVjdHMgdGhlIGdsb2JhbCBgbWluaWZ5YCBzZXR0aW5nIHNvIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgc2FtZSBzaGFwZSB0aGF0IHdpbGwgZW5kIHVwIGluIHRoZSBleHBvcnQuXG4gICAgY29uc3QganNvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uV3JhcC5jbGFzc05hbWUgPSAnYm9keS1qc29uLXdyYXAnO1xuICAgIGNvbnN0IGpzb25CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uQmFyLmNsYXNzTmFtZSA9ICdib2R5LWpzb24tYmFyJztcblxuICAgIC8vIExpbmUtd3JhcCBjaGVja2JveCAocGVyLWJ1YmJsZSBsb2NhbCBzdGF0ZSwgZGVmYXVsdCBPTikuIFdoZW4gT04gdGhlXG4gICAgLy8gSlNPTiBpcyBmbGF0dGVuZWQgdG8gT05FIG1pbmlmaWVkIGxpbmUgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZSBidWJibGVcbiAgICAvLyB3aWR0aCAobm8gaG9yaXpvbnRhbCBzY3JvbGwpOyB3aGVuIE9GRiBpdCBmYWxscyBiYWNrIHRvIHRoZSBnbG9iYWxcbiAgICAvLyBtaW5pZnktcmVzcGVjdGluZyBwcmV0dHkvY29tcGFjdCBmb3JtIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgY29uc3Qgd3JhcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB3cmFwTGFiZWwuY2xhc3NOYW1lID0gJ2pzb24td3JhcC10b2dnbGUnO1xuICAgIHdyYXBMYWJlbC5kYXRhc2V0LnRpcCA9ICdGbGF0dGVuIHRvIGEgc2luZ2xlIHNvZnQtd3JhcHBpbmcgbGluZSBpbnN0ZWFkIG9mIGhvcml6b250YWwgc2Nyb2xsJztcbiAgICBjb25zdCB3cmFwQ2hlY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHdyYXBDaGVjay50eXBlID0gJ2NoZWNrYm94JztcbiAgICB3cmFwQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgd3JhcExhYmVsLmFwcGVuZCh3cmFwQ2hlY2ssIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgV3JhcCcpKTtcbiAgICBqc29uQmFyLmFwcGVuZCh3cmFwTGFiZWwpO1xuXG4gICAgLy8gQ29weSBidXR0b24gKG1pcnJvcnMgdGhlIFwiQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTlwiIGFjdGlvbiBiZWxvdyxcbiAgICAvLyBzdXJmYWNlZCBhdCB0aGUgdG9wIHNvIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBzY3JvbGwgcGFzdCB0aGUgSlNPTlxuICAgIC8vIHRvIGZpbmQgaXQpLlxuICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb3B5QnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb3B5QnRuLmNsYXNzTmFtZSA9ICdpY29uYnRuIGpzb24tY29weSc7XG4gICAgY29weUJ0bi5kYXRhc2V0LnRpcCA9ICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJztcbiAgICBjb3B5QnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb3B5IGNhcHR1cmUgYXMgSlNPTicpO1xuICAgIGNvcHlCdG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjb3B5JywgMTMpO1xuICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIC8vIEZ1bGwgc2luZ2xlLWNhcHR1cmUgZXhwb3J0OiBpZGVudGl0eSArIHBhdGhzICsgdGV4dC9jb250ZW50ICsgZXZlcnlcbiAgICAgIC8vIGF0dGFjaGVkIG5vdGUvY29tbWVudCDigJQgdGhlIHNhbWUgZGVwdGggYXMgYSBmdWxsIGV4cG9ydCwgc2NvcGVkIHRvXG4gICAgICAvLyB0aGlzIG9uZSBjYXB0dXJlIChpdGVtIDcpLiBEaXN0aW5jdCBmcm9tIHRoZSByYXcgZW50cnkgc2hvd24gYmVsb3cuXG4gICAgICBjb25zdCBmZWVkYmFjayA9IG1lc3NhZ2VzLmZsYXRNYXAoKHgpID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LnBhcmVudFVpZCA9PT0gbS5lbnRyeS51aWRcbiAgICAgICAgPyBbe3RleHQ6IHgudGV4dCwgdHM6IHgudHMsIHVpZDogeC5pZCwgcGFyZW50VWlkOiB4LnBhcmVudFVpZH1dIDogW10pO1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplQ2FwdHVyZUpzb24oe2VudHJ5OiBtLmVudHJ5LCBmZWVkYmFja30pKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNhcHR1cmUgZXhwb3J0Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY2FwdHVyZScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSk7XG4gICAganNvbkJhci5hcHBlbmQoY29weUJ0bik7XG4gICAganNvbldyYXAuYXBwZW5kKGpzb25CYXIpO1xuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvZHkuY2xhc3NOYW1lID0gJ2JvZHktanNvbiB3cmFwLW9uJztcbiAgICAvLyBSZW5kZXIgdGhlIEpTT04gdG8gbWF0Y2ggdGhlIHdyYXAgc3RhdGU6XG4gICAgLy8gICB3cmFwIE9OICDihpIgYSBzaW5nbGUgbWluaWZpZWQgbGluZSAoaW5kZW50IDApIHRoYXQgc29mdC13cmFwcyB0byB0aGVcbiAgICAvLyAgICAgICAgICAgICAgYnViYmxlIHdpZHRoIChDU1MgaGFuZGxlcyB0aGUgdmlzdWFsIHdyYXBwaW5nIHZpYVxuICAgIC8vICAgICAgICAgICAgICBvdmVyZmxvdy13cmFwOmFueXdoZXJlKSwgc28gdGhlIHdob2xlIG9iamVjdCBpcyBvbmVcbiAgICAvLyAgICAgICAgICAgICAgY29udGludW91cyBzdHJpbmcgd2l0aCBubyBob3Jpem9udGFsIHNjcm9sbC5cbiAgICAvLyAgIHdyYXAgT0ZGIOKGkiB0aGUgZ2xvYmFsIG1pbmlmeS1yZXNwZWN0aW5nIGZvcm06IHByZXR0eS1wcmludGVkIGZ1bGxcbiAgICAvLyAgICAgICAgICAgICAgZW50cnksIG9yIHRoZSBzbGltRW50cnkgY29tcGFjdCBmb3JtIHdoZW4gbWluaWZ5IGlzIG9uLFxuICAgIC8vICAgICAgICAgICAgICB3aXRoIGhvcml6b250YWwgc2Nyb2xsIGZvciBsb25nIGxpbmVzLlxuICAgIGNvbnN0IHJlbmRlckpzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gJyc7XG4gICAgICBjb25zdCB3cmFwcGVkID0gd3JhcENoZWNrLmNoZWNrZWQ7XG4gICAgICBjb25zdCBwYXlsb2FkID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IHNsaW1FbnRyeShtLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlfSkgOiBtLmVudHJ5O1xuICAgICAgY29uc3QgaW5kZW50ID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IDAgOiAyO1xuICAgICAgY29uc3QgdGV4dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIGluZGVudCk7XG4gICAgICBhcHBlbmRKc29uSGlnaGxpZ2h0KGJvZHksIHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICByZW5kZXJKc29uKCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG5cbiAgICAgIH0gZWxzZSBzZXRTdGF0dXMoJ1JlLWNhcHR1cmUgZmFpbGVkJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSB0aGlzIGNhcHR1cmUgYXMgYSBmdWxsIGV4cG9ydCAocGF0aHMsIHRleHQsIGNvbW1lbnRzKScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmVlZGJhY2sgPSAobTogRmVlZGJhY2tNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2snO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIGRpdi5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2gobS50ZXh0LCBzZWFyY2hRdWVyeSk7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkge1xuICAgICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IHNlbGVjdG9yIOKAlCBwcmVmZXIgcGFyZW50VWlkICh0aGUgcGVyc2lzdGVkIEZLKVxuICAgICAgLy8gb3ZlciBjYXB0dXJlLWFkamFjZW5jeSwgc2luY2UgZHJhZy10by1yZXBhcmVudCBtb3ZlcyB0aGUgY2hpcCBidXRcbiAgICAgIC8vIHRoZSB0cmFpbGluZy1zZWxlY3RvciBoZXVyaXN0aWMgZ2l2ZXMgc3RhbGUgcmVzdWx0cyB1bnRpbCByZW5kZXJcbiAgICAgIC8vIHNldHRsZXMuIFRoZSBhbm5vdGF0aW9uIG92ZXJsYXkgbmVlZHMgdGhlIHBhcmVudCdzIHNlbGVjdG9yIHRvXG4gICAgICAvLyBhbmNob3IgdGhlIG9uLXBhZ2UgdG9vbHRpcC5cbiAgICAgIGNvbnN0IHtwYXJlbnRTZWwsIHBhcmVudFVpZH0gPSAoKCkgPT4ge1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHtcbiAgICAgICAgICBjb25zdCBwID0gbWVzc2FnZXMuZmluZChcbiAgICAgICAgICAgIChtbSkgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAobW0gYXMgU2VsZWN0b3JNZXNzYWdlKS5lbnRyeS51aWQgPT09IG0ucGFyZW50VWlkLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHAgJiYgcC50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4ge3BhcmVudFNlbDogcC5lbnRyeS5zZWxlY3RvciwgcGFyZW50VWlkOiBwLmVudHJ5LnVpZH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtwYXJlbnRTZWw6IGxhc3RTZWxlY3RvclNlbCwgcGFyZW50VWlkOiB1bmRlZmluZWQgYXMgc3RyaW5nIHwgdW5kZWZpbmVkfTtcbiAgICAgIH0pKCk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICAvLyBTY3JvbGwgdGhlIHBhcmVudCBlbGVtZW50IGludG8gdmlldyArIHNob3cgdGhlIG9uLXBhZ2VcbiAgICAgICAgLy8gYW5ub3RhdGlvbiB0b29sdGlwIHJlbmRlcmluZyBUSElTIGNvbW1lbnQncyB0ZXh0LiBQYXNzIHRoZVxuICAgICAgICAvLyBwYXJlbnQncyB1aWQgc28gYSBzYW1lLXNlbGVjdG9yIHNpYmxpbmcgY2FwdHVyZSBkb2Vzbid0IGdldFxuICAgICAgICAvLyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgXCJ0aGUgc2FtZSB0YXJnZXRcIiBieSB0aGUgY29udGVudFxuICAgICAgICAvLyBzY3JpcHQncyBhbm5vdGF0aW9uIG92ZXJsYXkuXG4gICAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSB7XG4gICAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogcGFyZW50U2VsLCBzdGlja3k6IHRydWV9KTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kVG9DUyh7XG4gICAgICAgICAga2luZDogJ2Fubm90YXRpb24nLFxuICAgICAgICAgIHNlbGVjdG9yOiBwYXJlbnRTZWwsXG4gICAgICAgICAgcGF5bG9hZDoge3NlbGVjdG9yOiBwYXJlbnRTZWwsIHVpZDogcGFyZW50VWlkLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2s6IFttLnRleHRdfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkaXYuZGF0YXNldC5jb21tZW50SWQgPSBtLmlkO1xuICAgIGNvbnN0IGJlZ2luQ29tbWVudERyYWcgPSAoZTogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JywgbS5pZCk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgndGV4dC9wbGFpbicsIG0udGV4dCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgfTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYWN0aW9ucy5jbGFzc05hbWUgPSAnYWN0aW9ucyc7XG4gICAgY29uc3QgZHJhZ0hhbmRsZSA9IGFjdGlvbkJ0bignZ3JpcCcsICdEcmFnIHRoaXMgaGFuZGxlIG9udG8gYSBzZWxlY3RvciB0byByZXBhcmVudCcsICgpID0+IHsgLyogZHJhZyBoYW5kbGUgb25seSAqLyB9KTtcbiAgICBkcmFnSGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2RyYWctaGFuZGxlJyk7XG4gICAgZHJhZ0hhbmRsZS5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgYmVnaW5Db21tZW50RHJhZyk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZHJhZ0hhbmRsZSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjb3B5JywgJ0NvcHkgY29tbWVudCB0ZXh0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQobS50ZXh0KTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNvbW1lbnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncGVuY2lsJywgJ0VkaXQgY29tbWVudCcsICgpID0+IGVudGVyRmVlZGJhY2tFZGl0KGRpdiwgbSksIHtzaXplOiAxNX0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICAvLyBEcm9wIGhhbmRsZXIgc2hhcmVkIGJ5IGV2ZXJ5IHNlbGVjdG9yIGJ1YmJsZS4gQWNjZXB0cyBhIGRyYWdnZWRcbiAgLy8gY29tbWVudCBJRCB2aWEgdGhlIGBhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50YCBNSU1FLCB1cGRhdGVzXG4gIC8vIHBhcmVudFVpZCArIGFkamFjZW5jeSwgcGVyc2lzdHMsIHJlLXJlbmRlcnMuXG4gIGNvbnN0IHdpcmVTZWxlY3RvckRyb3BUYXJnZXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogU2VsZWN0b3JNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVzID0gZS5kYXRhVHJhbnNmZXI/LnR5cGVzO1xuICAgICAgaWYgKCF0eXBlcyB8fCAhQXJyYXkuZnJvbSh0eXBlcykuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnKSkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpKTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChlKSA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKTtcbiAgICAgIGNvbnN0IGlkID0gZS5kYXRhVHJhbnNmZXI/LmdldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnKTtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHNyY0lkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBpZCk7XG4gICAgICBpZiAoc3JjSWR4IDwgMCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc3JjID0gbWVzc2FnZXNbc3JjSWR4XSEgYXMgRmVlZGJhY2tNZXNzYWdlO1xuICAgICAgaWYgKHNyYy50eXBlICE9PSAnZmVlZGJhY2snKSByZXR1cm47XG4gICAgICBjb25zdCBkc3RJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBpZiAoZHN0SWR4IDwgMCkgcmV0dXJuO1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgRksgcG9pbnRlciBmaXJzdCDigJQgdGhhdCdzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggaW5cbiAgICAgIC8vIGV4cG9ydHMuIEFkamFjZW5jeSBpcyBqdXN0IGEgcmVuZGVyIGNvbnZlbmllbmNlLlxuICAgICAgc3JjLnBhcmVudFVpZCA9IG0uZW50cnkudWlkO1xuICAgICAgLy8gU3BsaWNlIHNyYyBvdXQgb2YgaXRzIGN1cnJlbnQgc2xvdCBhbmQgcmUtaW5zZXJ0IHJpZ2h0IGFmdGVyIHRoZVxuICAgICAgLy8gbmV3IHBhcmVudCAoYW5kIGFueSBmZWVkYmFjayBhbHJlYWR5IHRyYWlsaW5nIGl0LCBzbyB0aGUgbW9zdC1cbiAgICAgIC8vIHJlY2VudCBmZWVkYmFjayBlbmRzIHVwIG5lYXJlc3QgdGhlIHBhcmVudCB2aXN1YWxseSkuXG4gICAgICBtZXNzYWdlcy5zcGxpY2Uoc3JjSWR4LCAxKTtcbiAgICAgIGNvbnN0IG5ld0RzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGxldCBpbnNlcnRBdCA9IG5ld0RzdElkeCArIDE7XG4gICAgICB3aGlsZSAoaW5zZXJ0QXQgPCBtZXNzYWdlcy5sZW5ndGggJiYgbWVzc2FnZXNbaW5zZXJ0QXRdIS50eXBlID09PSAnZmVlZGJhY2snKSBpbnNlcnRBdCsrO1xuICAgICAgbWVzc2FnZXMuc3BsaWNlKGluc2VydEF0LCAwLCBzcmMpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgcmVwYXJlbnRlZCcpO1xuICAgIH0pO1xuICB9O1xuXG4gIHR5cGUgQWN0aW9uQnRuT3B0cyA9IHt3YXJuPzogYm9vbGVhbjsgdG9nZ2xlZD86IGJvb2xlYW47IHNpemU/OiBudW1iZXJ9O1xuICBjb25zdCBhY3Rpb25CdG4gPSAoaWNvbjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBmbjogKCkgPT4gdm9pZCwgb3B0czogQWN0aW9uQnRuT3B0cyA9IHt9KTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmRhdGFzZXQudGlwID0gdGl0bGU7XG4gICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0aXRsZSk7XG4gICAgaWYgKG9wdHMud2FybikgYi5jbGFzc05hbWUgPSAnd2Fybic7XG4gICAgaWYgKG9wdHMudG9nZ2xlZCkgYi5jbGFzc0xpc3QuYWRkKCd0b2dnbGVkJyk7XG4gICAgLy8gRGVmYXVsdCBpY29uIHNpemUgMTMgcmVhZHMgc2xpZ2h0bHkgc21hbGwgaW4gYSAyMsOXMjIgYnV0dG9uIOKAlCBmaW5lXG4gICAgLy8gZm9yIGljb25zIHdpdGggc2ltcGxlIHNoYXBlcyAoY3Jvc3NoYWlyLCBsaXN0LXRyZWUsIHVuZG8pIGJ1dCB2aXNpYmx5XG4gICAgLy8gc3F1ZWV6ZWQgZm9yIGBtZXNzYWdlLXNxdWFyZS1wbHVzYCBhbmQgYHBlbmNpbGAsIHdoZXJlIHRoZVxuICAgIC8vIGludGVyaW9yIHN0cm9rZXMgdmFuaXNoIGludG8gaGFpcmxpbmUgYmx1ci4gQ2FsbGVycyBjYW4gYnVtcCB3aXRoXG4gICAgLy8gYHNpemU6IDE1YCBmb3IgdGhvc2UuXG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoaWNvbiwgb3B0cy5zaXplID8/IDEzKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgZm4oKTsgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlQnRuID0gKG9uQ29uZmlybTogKCkgPT4gdm9pZCk6IEhUTUxCdXR0b25FbGVtZW50ID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYi50eXBlID0gJ2J1dHRvbic7XG4gICAgYi5jbGFzc05hbWUgPSAnd2Fybic7XG4gICAgYi5kYXRhc2V0LnRpcCA9ICdEZWxldGUnO1xuICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBjYXB0dXJlJyk7XG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMyk7XG4gICAgbGV0IHBhcmVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmV2ZXJ0VGltZXIgPSAwO1xuICAgIGNvbnN0IHJldmVydCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGFyZW50KSByZXR1cm47XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb25maXJtLXllcywgLmNvbmZpcm0tbm8nKSkgbi5yZW1vdmUoKTtcbiAgICAgIGlmICghYi5wYXJlbnRFbGVtZW50KSBwYXJlbnQuYXBwZW5kKGIpO1xuICAgICAgY2xlYXJUaW1lb3V0KHJldmVydFRpbWVyKTtcbiAgICB9O1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHBhcmVudCA9IGIucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgeWVzLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIHllcy5jbGFzc05hbWUgPSAnY29uZmlybS15ZXMnO1xuICAgICAgeWVzLmRhdGFzZXQudGlwID0gJ0NvbmZpcm0gZGVsZXRlJztcbiAgICAgIHllcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ29uZmlybSBkZWxldGUnKTtcbiAgICAgIHllcy5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMTMpO1xuICAgICAgeWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgb25Db25maXJtKCk7IH0pO1xuICAgICAgY29uc3Qgbm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIG5vLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIG5vLmNsYXNzTmFtZSA9ICdjb25maXJtLW5vJztcbiAgICAgIG5vLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBkZWxldGUnO1xuICAgICAgbm8uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBkZWxldGUnKTtcbiAgICAgIG5vLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDEzKTtcbiAgICAgIG5vLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgfSk7XG4gICAgICBiLnJlcGxhY2VXaXRoKHllcyk7XG4gICAgICB5ZXMuYWZ0ZXIobm8pO1xuICAgICAgcmV2ZXJ0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChyZXZlcnQsIDgwMDApO1xuICAgIH0pO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIGNvbnN0IGVudGVyRmVlZGJhY2tFZGl0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IEZlZWRiYWNrTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG5leHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuZXh0LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2sgZWRpdGluZyc7XG4gICAgaWYgKGRpdi5jbGFzc0xpc3QuY29udGFpbnMoJ3RocmVhZGVkJykpIG5leHQuY2xhc3NMaXN0LmFkZCgndGhyZWFkZWQnKTtcbiAgICBuZXh0LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIG5leHQuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICBpbml0aWFsOiBtLnRleHQsXG4gICAgICBvbkNhbmNlbDogKCkgPT4geyBkaXYucmVwbGFjZVdpdGgoZGl2LmNsb25lTm9kZSh0cnVlKSk7IHJlbmRlcigpOyB9LFxuICAgICAgb25TdWJtaXQ6ICh0ZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgICAgICBpZiAodHJpbW1lZCA9PT0gbS50ZXh0KSB7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS50ZXh0ID0gdHJpbW1lZDtcbiAgICAgICAgLy8gU2V2ZXJpdHkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBVSS4gU3RyaXAgYW55IGxlZ2FjeSB2YWx1ZVxuICAgICAgICAvLyB0aGF0IGNhbWUgYmFjayBmcm9tIGFuIG9sZGVyIEpTT05MIGltcG9ydCBzbyBzYXZlcyBkb24ndCBrZWVwXG4gICAgICAgIC8vIHJlLWVtaXR0aW5nIGl0LlxuICAgICAgICBkZWxldGUgKG0gYXMgYW55KS5zZXZlcml0eTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBhdXRvZm9jdXM6IHRydWUsXG4gICAgfSkpO1xuICAgIGRpdi5yZXBsYWNlV2l0aChuZXh0KTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVNZXNzYWdlID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBlbCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcbiAgICBjb25zdCBmaW5pc2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgbWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0uaWQgIT09IGlkKTtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgc2V0U3RhdHVzKCdEZWxldGVkJyk7XG4gICAgfTtcbiAgICBpZiAoIWVsKSB7IGZpbmlzaCgpOyByZXR1cm47IH1cbiAgICBlbC5zdHlsZS5tYXhIZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgncmVtb3ZpbmcnKTtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNsZWFudXAgPSAoKTogdm9pZCA9PiB7IGlmIChkb25lKSByZXR1cm47IGRvbmUgPSB0cnVlOyBmaW5pc2goKTsgfTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgY2xlYW51cCwge29uY2U6IHRydWV9KTtcbiAgICBzZXRUaW1lb3V0KGNsZWFudXAsIDM4MCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIENvbXBvc2VyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZW5kRmVlZGJhY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGNvbXBvc2VyLnZhbHVlLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGxldCBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIHBvc2l0aW9uID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBpbnNlcnRCZWZvcmUuY3VycmVudCk7XG4gICAgICBpZiAocG9zaXRpb24gPCAwKSBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFN0YW1wIHBhcmVudFVpZCBvbiB0aGUgaW4tbWVtb3J5IG1lc3NhZ2UgYXQgY3JlYXRpb24gdGltZSBzbyB0aGVcbiAgICAvLyBGSyBpcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aC4gVGhlIHNsaW0gZW1pdCBubyBsb25nZXIgaGFzIHRvXG4gICAgLy8gaW5mZXIgdGhlIHBhcmVudCBmcm9tIGNhcHR1cmUtYWRqYWNlbmN5LCBhbmQgYG1hbmlmZXN0LmNvdW50c2BcbiAgICAvLyBhY2N1cmF0ZWx5IHJlZmxlY3RzIGZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzLlxuICAgIC8vIFdhbGsgYmFjayB0byB0aGUgbmVhcmVzdCBwcmVjZWRpbmcgc2VsZWN0b3IgYmVmb3JlIHNwbGljZS5cbiAgICBsZXQgcElkeCA9IHBvc2l0aW9uIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgLi4uKHBhcmVudFVpZCA/IHtwYXJlbnRVaWR9IDoge30pLFxuICAgIH0pO1xuICAgIGNvbXBvc2VyLnZhbHVlID0gJyc7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIC8vIFNlbmRpbmcgY2xlYXJzIGFueSBhY3RpdmUgdmlzdWFsIGZpbmQgc28gdGhlIG5ldyBjb21tZW50IGlzbid0IGhpZGRlblxuICAgIC8vIGJlaGluZCBhIHN0YWxlIGZpbHRlci5cbiAgICBpZiAoc2VhcmNoUXVlcnkpIGNsb3NlRmluZCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ1NlbnQnKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIC8vIEJ1ZyAjMjogZmVlZGJhY2sncyBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LlxuICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgIXBhcmVudC5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChwYXJlbnQgYXMgU2VsZWN0b3JNZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgY29tcG9zZXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGFzeW5jIChlKSA9PiB7XG4gICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGhhbmRsZWQgPSBhd2FpdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyKCk7XG4gICAgICBpZiAoIWhhbmRsZWQpIHNlbmRGZWVkYmFjaygpO1xuICAgIH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnICYmIGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZUNvbXBvc2VyTWV0ZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdCA9IGNvbXBvc2VyLnZhbHVlO1xuICAgIGNvbXBXb3Jkcy50ZXh0Q29udGVudCA9IFN0cmluZyh3b3JkQ291bnQodCkpO1xuICAgIGNvbXBUb2tlbnMudGV4dENvbnRlbnQgPSBTdHJpbmcodG9rZW5Db3VudCh0KSk7XG4gICAgY29tcG9zZXIuY2xhc3NMaXN0LnRvZ2dsZSgnY21kLW1vZGUnLCAvXj4vLnRlc3QodC50cmltKCkpKTtcbiAgfTtcbiAgY29tcG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB1cGRhdGVDb21wb3Nlck1ldGVyKTtcblxuICAvLyDilIDilIAgSGVhZGVyIHNlYXJjaCDihpIgY29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBUaGUgaGVhZGVyIHNlYXJjaCBhZmZvcmRhbmNlIG5vIGxvbmdlciBydW5zIGl0cyBvd24gZmlsdGVyOyBjbGlja2luZyBvclxuICAvLyBmb2N1c2luZyBpdCBvcGVucyB0aGUgQ21kK0sgY29tbWFuZCBwYWxldHRlICh3aGljaCBzZWFyY2hlcyBjYXB0dXJlcyBBTkRcbiAgLy8gcnVucyBjb21tYW5kcykuIEl0J3MgYSByZWFkb25seSB0cmlnZ2VyLCBzbyB3ZSBqdXN0IG9wZW4gdGhlIHBhbGV0dGUgYW5kXG4gIC8vIGRyb3AgZm9jdXMgc28gdGhlIHBhbGV0dGUgaW5wdXQgdGFrZXMgb3ZlciBjbGVhbmx5LlxuICBjb25zdCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2ggPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYWxldHRlLmhpZGRlbikgcmV0dXJuO1xuICAgIG9wZW5QYWxldHRlKCk7XG4gICAgc2VhcmNoLmJsdXIoKTtcbiAgfTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKCk7IH1cbiAgfSk7XG5cbiAgLy8g4pSA4pSAIEN0cmwrRiB2aXN1YWwgZmluZCAoaW4tbGlzdCBmaWx0ZXIgKyBoaWdobGlnaHQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzY3JvbGxGaXJzdEZpbmRIaXRJbnRvVmlldyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm47XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZy5zZWxlY3Rvci5zZWFyY2gtaGl0Jyk7XG4gICAgICBpZiAoZmlyc3RIaXQpIHtcbiAgICAgICAgY2VudGVyRWxlbWVudEluTGlzdChmaXJzdEhpdCk7XG4gICAgICAgIGNvbnN0IG1rID0gZmlyc3RIaXQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ21hcmsnKTtcbiAgICAgICAgaWYgKG1rKSBjZW50ZXJFbGVtZW50SW5MaXN0KG1rKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TWF0Y2ggPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnIG1hcmsnKTtcbiAgICAgICAgaWYgKGZpcnN0TWF0Y2gpIGNlbnRlckVsZW1lbnRJbkxpc3QoZmlyc3RNYXRjaCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUZpbmRDb3VudCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWZpbmRDb3VudCkgcmV0dXJuO1xuICAgIGZpbmRDb3VudC50ZXh0Q29udGVudCA9IHNlYXJjaFF1ZXJ5ID8gYCR7bGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnJykubGVuZ3RofSBtYXRjaGAgOiAnJztcbiAgfTtcbiAgY29uc3QgYXBwbHlGaW5kID0gKHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBzZWFyY2hRdWVyeSA9IHZhbHVlLnRyaW0oKTtcbiAgICByZW5kZXIoKTtcbiAgICB1cGRhdGVGaW5kQ291bnQoKTtcbiAgICBzY3JvbGxGaXJzdEZpbmRIaXRJbnRvVmlldygpO1xuICB9O1xuICBjb25zdCBvcGVuRmluZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWZpbmRCYXIgfHwgIWZpbmRJbnB1dCkgcmV0dXJuO1xuICAgIGZpbmRCYXIuaGlkZGVuID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsJyk/LmNsYXNzTGlzdC5hZGQoJ2ZpbmQtb3BlbicpO1xuICAgIGZpbmRJbnB1dC5mb2N1cygpO1xuICAgIGZpbmRJbnB1dC5zZWxlY3QoKTtcbiAgfTtcbiAgY29uc3QgY2xvc2VGaW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChmaW5kQmFyKSBmaW5kQmFyLmhpZGRlbiA9IHRydWU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsJyk/LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbmQtb3BlbicpO1xuICAgIGlmIChmaW5kSW5wdXQpIGZpbmRJbnB1dC52YWx1ZSA9ICcnO1xuICAgIGlmIChzZWFyY2hRdWVyeSkgeyBzZWFyY2hRdWVyeSA9ICcnOyByZW5kZXIoKTsgfVxuICAgIHVwZGF0ZUZpbmRDb3VudCgpO1xuICB9O1xuICBmaW5kSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gYXBwbHlGaW5kKGZpbmRJbnB1dC52YWx1ZSkpO1xuICBmaW5kSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4geyBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7IGUucHJldmVudERlZmF1bHQoKTsgY2xvc2VGaW5kKCk7IH0gfSk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpbmQtY2xlYXJdJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VGaW5kKTtcblxuICBjb25zdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IG0gPSAvXj5cXHMqKC4rKSQvLmV4ZWMoY29tcG9zZXIudmFsdWUudHJpbSgpKTtcbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBzZWwgPSBtWzFdIS50cmltKCk7XG4gICAgaWYgKCFzZWwpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW59Pih7a2luZDogJ21hbnVhbC1jYXB0dXJlJywgc2VsZWN0b3I6IHNlbH0pO1xuICAgIGlmIChyZXBseT8ub2spIHsgY29tcG9zZXIudmFsdWUgPSAnJzsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyBzZXRTdGF0dXMoJ0NhcHR1cmVkICcgKyBzZWwpOyB9XG4gICAgZWxzZSBzZXRTdGF0dXMoJ1NlbGVjdG9yIGRpZCBub3QgbWF0Y2g6ICcgKyBzZWwsIHtraW5kOiAnd2Fybid9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0IGJ1aWxkZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyB2MiBleHBvcnQgc2hhcGU6IHRvcCBsZXZlbCBrZWVwcyB1c2VyLWZhY2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHNcbiAgLy8gKHVpZCwgbiwgc2VsZWN0b3IsIHRleHQsIHJvbGUsIGF0dHJzLCBoaW50cywgY2xhc3Nlcywgc3R5bGVzLCBjb21wb25lbnQsXG4gIC8vIHN0YXRlcywgc2NyZWVuc2hvdCwgZ3JvdXApLiBEaWFnbm9zdGljIC8gZGV0ZWN0aW9uIG1ldGFkYXRhIG1vdmVzIHVuZGVyXG4gIC8vIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBpblNoYWRvd0RPTSxcbiAgLy8gcHNldWRvRWxlbWVudHMsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBUaGUgdmVyc2lvbiBtYXJrZXIgaXMgZW1pdHRlZFxuICAvLyBhcyBgdjogMmAuIEltcG9ydGVycyBkZXRlY3QgZWl0aGVyIHYxIChmbGF0KSBvciB2MiBhbmQgZGVub3JtYWxpemUuXG4gIC8vXG4gIC8vIEFnZ3Jlc3NpdmUgbWluaWZ5IGFkZGl0aW9uYWxseSBkcm9wcyBmaWVsZHMgdGhlIHNlbGVjdG9yIGFscmVhZHlcbiAgLy8gaW1wbGllczogYW5jZXN0b3JzLCB2aWV3cG9ydCAob25lIHBlciBwYWdlKSwgY29tcG9uZW50Um9vdCB3aGVuXG4gIC8vIHJlZHVuZGFudCB3aXRoIHRoZSBzZWxlY3RvciwgYW5kIHBzZXVkb0VsZW1lbnRzLlxuICBjb25zdCBzbGltRW50cnkgPSAoZTogRW50cnksIG9wdHM6IHtpbmNsdWRlR3JvdXA/OiBib29sZWFuOyBldmVudEluZGV4PzogbnVtYmVyOyB2aXN1YWxPcmRlcj86IG51bWJlcjsgZ3JvdXBVaWQ/OiBzdHJpbmd9ID0ge30pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0+IHtcbiAgICBjb25zdCBpbmNsdWRlT3V0ZXIgPSBwcmVmcy5pbmNsdWRlT3V0ZXJIVE1MO1xuICAgIGNvbnN0IGluY2x1ZGVNYXRjaGVkID0gcHJlZnMuaW5jbHVkZU1hdGNoZWRSdWxlcztcbiAgICBjb25zdCBpbmNsdWRlU3R5bGVzID0gcHJlZnMuaW5jbHVkZVN0eWxlcztcbiAgICBjb25zdCBtaW5pZnkgPSBwcmVmcy5taW5pZnk7XG5cbiAgICAvLyBUb3AtbGV2ZWwgdXNlci1mYWNpbmcgZmllbGRzLiBPcmRlciBtYXR0ZXJzIGZvciBvdXRwdXQgcmVhZGFiaWxpdHkg4oCUXG4gICAgLy8gd2Ugd2FudCBgdiAvIHR5cGUgLyB1aWQgLyBuIC8gc2VsZWN0b3JgIGZpcnN0IHNvIEpTT05MIGlzIGdyZXBwYWJsZS5cbiAgICAvL1xuICAgIC8vIGBuYCBzdGF5cyBhcyB0aGUgY2FwdHVyZS1zZXF1ZW5jZSBkaXNwbGF5IGxhYmVsIGZvciBiYWNrd2FyZHNcbiAgICAvLyBjb21wYXRpYmlsaXR5IHdpdGggdjEvdjIgcmVhZGVycyAoYW5kIHRoZSBzaWRlYmFyJ3MgXCIjM1wiIGNoaXBzKS5cbiAgICAvLyBUaGUgZGlzYW1iaWd1YXRlZCBjb3VzaW5zIChgY2FwdHVyZUluZGV4YCwgYGV2ZW50SW5kZXhgLFxuICAgIC8vIGB2aXN1YWxPcmRlcmAsIGBkaXNwbGF5TGFiZWxgKSBsaXZlIG9uIHRoZSByb3cgc28gYSBkb3duc3RyZWFtXG4gICAgLy8gYWdlbnQgY2FuIHBpY2sgd2hpY2hldmVyIG9yZGVyaW5nIGlzIG1lYW5pbmdmdWwg4oCUIGJ1ZyAjMTAuXG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgdjogMixcbiAgICAgIHR5cGU6ICdzZWxlY3RvcicsXG4gICAgICB1aWQ6IGUudWlkLFxuICAgICAgbjogZS5uLFxuICAgICAgdHM6IGUudHMsXG4gICAgICB1cmw6IGUudXJsLFxuICAgICAgdGFnOiBlLnRhZyxcbiAgICAgIHNlbGVjdG9yOiBlLnNlbGVjdG9yLFxuICAgICAgY2FwdHVyZUluZGV4OiBlLm4sXG4gICAgICBkaXNwbGF5TGFiZWw6IFN0cmluZyhlLm4pLFxuICAgIH07XG4gICAgaWYgKG9wdHMuZXZlbnRJbmRleCAhPT0gdW5kZWZpbmVkKSBvdXQuZXZlbnRJbmRleCA9IG9wdHMuZXZlbnRJbmRleDtcbiAgICBpZiAob3B0cy52aXN1YWxPcmRlciAhPT0gdW5kZWZpbmVkKSBvdXQudmlzdWFsT3JkZXIgPSBvcHRzLnZpc3VhbE9yZGVyO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLnRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnRleHQgPSBtaW5pZnkgPyBlLnRleHQucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUudGV4dDtcbiAgICBpZiAoZS5yb2xlICE9PSB1bmRlZmluZWQpIG91dC5yb2xlID0gZS5yb2xlO1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IG1pbmlmeSA/IGUuYWNjZXNzaWJsZU5hbWUucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgaWYgKGUuaWQgIT09IHVuZGVmaW5lZCkgb3V0LmlkID0gZS5pZDtcbiAgICBpZiAoZS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgb3V0LnRlc3RJZCA9IGUudGVzdElkO1xuICAgIGlmIChlLmNsYXNzZXMgJiYgZS5jbGFzc2VzLmxlbmd0aCkge1xuICAgICAgb3V0LmNsYXNzZXMgPSAobWluaWZ5ICYmIGUuY2xhc3Nlcy5sZW5ndGggPiA4KSA/IGUuY2xhc3Nlcy5zbGljZSgwLCA4KSA6IGUuY2xhc3NlcztcbiAgICB9XG4gICAgaWYgKGUuYXR0cnMgJiYgT2JqZWN0LmtleXMoZS5hdHRycykubGVuZ3RoKSBvdXQuYXR0cnMgPSBlLmF0dHJzO1xuICAgIGlmIChlLmhpbnRzICYmIE9iamVjdC5rZXlzKGUuaGludHMpLmxlbmd0aCkgb3V0LmhpbnRzID0gZS5oaW50cztcbiAgICBpZiAoZS5yZWN0KSBvdXQucmVjdCA9IGUucmVjdDtcbiAgICBpZiAoZS5zdGF0ZXMgJiYgZS5zdGF0ZXMubGVuZ3RoKSBvdXQuc3RhdGVzID0gZS5zdGF0ZXM7XG4gICAgaWYgKGUuY29tcG9uZW50KSBvdXQuY29tcG9uZW50ID0gZS5jb21wb25lbnQ7XG4gICAgLy8gTG9jYXRvci1xdWFsaXR5IGZpZWxkLiBQcm9tb3RlIGV2ZW4gd2hlbiBtaW5pZmllZCDigJQgaXQncyBhIHNpbmdsZVxuICAgIC8vIHNtYWxsIGludCBhbmQgYSBkb3duc3RyZWFtIGFnZW50IHVzZXMgaXQgdG8gZGVjaWRlIHdoZXRoZXIgdG9cbiAgICAvLyB0cnVzdCB0aGUgc2VsZWN0b3IuXG4gICAgaWYgKGUuc2VsZWN0b3JNYXRjaENvdW50ICE9PSB1bmRlZmluZWQpIG91dC5zZWxlY3Rvck1hdGNoQ291bnQgPSBlLnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgICBpZiAoZS5hMTF5KSBvdXQuYTExeSA9IGUuYTExeTtcbiAgICBpZiAoZS5hc3NldHMgJiYgZS5hc3NldHMubGVuZ3RoKSBvdXQuYXNzZXRzID0gZS5hc3NldHM7XG4gICAgaWYgKGUubGF5b3V0Q29udGV4dCAmJiBlLmxheW91dENvbnRleHQubGVuZ3RoKSBvdXQubGF5b3V0Q29udGV4dCA9IGUubGF5b3V0Q29udGV4dDtcbiAgICBpZiAoaW5jbHVkZU91dGVyICYmIGUub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG91dC5vdXRlckhUTUwgPSBtaW5pZnkgPyBlLm91dGVySFRNTC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5vdXRlckhUTUw7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlU3R5bGVzICYmIGUuc3R5bGVzICYmIE9iamVjdC5rZXlzKGUuc3R5bGVzKS5sZW5ndGgpIG91dC5zdHlsZXMgPSBlLnN0eWxlcztcbiAgICBpZiAoZS5zY3JlZW5zaG90KSB7XG4gICAgICAvLyBQYXRoIG5vcm1hbGl6YXRpb246IHRoZSBsaXZlIGBlbnRyeS5zY3JlZW5zaG90LmVsZW1lbnRgIGNhcnJpZXMgYVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeGVkIHBhdGggKGUuZy4gYGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZ2ApXG4gICAgICAvLyBiZWNhdXNlIHRoZSBiYWNrZ3JvdW5kJ3MgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBBUEkgc3RhbXBzXG4gICAgICAvLyB0aGUgd29ya3NwYWNlIGludG8gdGhlIG9uLWRpc2sgcGF0aC4gQnV0IHRoZSAudGFyLnpzdCBhcmNoaXZlXG4gICAgICAvLyBidW5kbGVzIHNjcmVlbnNob3RzIGZsYXQgYXQgYHNjcmVlbnNob3RzL2Zvby5wbmdgLCBzbyB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXggd291bGQgcmVzb2x2ZSB0byBub3RoaW5nIGZvciBhbiBhZ2VudCB0aGF0XG4gICAgICAvLyBleHRyYWN0ZWQgdGhlIGFyY2hpdmUuIFN0cmlwIHRoZSB3b3Jrc3BhY2UgcHJlZml4IG9uIGVtaXQgc29cbiAgICAgIC8vIGV2ZXJ5IHBhdGggaXMgdmFsaWQgcmVsYXRpdmUgdG8gdGhlIG1hbmlmZXN0J3MgZGVjbGFyZWRcbiAgICAgIC8vIGBwYXRoUm9vdGAgKGFyY2hpdmUgcm9vdCBmb3IgdGFyLnpzdDsgd29ya3NwYWNlIHJvb3QgZm9yIHBsYWluXG4gICAgICAvLyBKU09OTCDigJQgaS5lLiwgYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgY29uc3Qgc3RyaXBXcyA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBpZiAoIXApIHJldHVybiBwO1xuICAgICAgICAvLyBTdHJpcCBleGFjdGx5IG9uZSBsZWFkaW5nIGA8d29ya3NwYWNlPi9gIHNlZ21lbnQgaWYgcHJlc2VudC5cbiAgICAgICAgY29uc3Qgd3NQcmVmaXggPSBgJHthY3RpdmVXc30vYDtcbiAgICAgICAgcmV0dXJuIHAuc3RhcnRzV2l0aCh3c1ByZWZpeCkgPyBwLnNsaWNlKHdzUHJlZml4Lmxlbmd0aCkgOiBwO1xuICAgICAgfTtcbiAgICAgIG91dC5zY3JlZW5zaG90ID0gey4uLmUuc2NyZWVuc2hvdH07XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZWxlbWVudCkgb3V0LnNjcmVlbnNob3QuZWxlbWVudCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZWxlbWVudCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZ3JvdXApIG91dC5zY3JlZW5zaG90Lmdyb3VwID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5ncm91cCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QucGFnZSkgb3V0LnNjcmVlbnNob3QucGFnZSA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QucGFnZSk7XG4gICAgfVxuICAgIC8vIFByb21vdGUgcnVudGltZS9iZWhhdmlvciBzaWduYWxzIHRvIHRvcC1sZXZlbC4gVGhlc2UgYXJlIHByaW1hcnlcbiAgICAvLyBzaWduYWwgZm9yIHRyaWFnZSAoZXZlbnRzIHRlbGxzIFwid2hpY2ggaGFuZGxlciByYW5cIiwgYmVoYXZpb3JBdHRyc1xuICAgIC8vIHRlbGxzIFwid2hhdCBzZXJ2ZXItcmVuZGVyZWQgYmluZGluZyBkb2VzIHRoaXMgZmlyZVwiLCBjYW52YXNDbGlja1xuICAgIC8vIHRlbGxzIFwid2hlcmUgb24gdGhlIGNoYXJ0IHdhcyBjbGlja2VkXCIsIGVkaXRvciB0ZWxscyBcIndoaWNoXG4gICAgLy8gcmljaC10ZXh0IGxpYnJhcnkgd3JhcHMgdGhpc1wiLCBkb21NdXRhdGlvbnMgdGVsbHMgXCJ3aGF0IGNoYW5nZWRcbiAgICAvLyBiZWZvcmUgdGhlIGNsaWNrXCIsIGlzQW5pbWF0aW5nIHdhcm5zIGFib3V0IHRyYW5zaWVudCBzdGF0ZSkuXG4gICAgaWYgKGUuZXZlbnRzICYmIE9iamVjdC5rZXlzKGUuZXZlbnRzKS5sZW5ndGgpIG91dC5ldmVudHMgPSBlLmV2ZW50cztcbiAgICBpZiAoZS5iZWhhdmlvckF0dHJzICYmIE9iamVjdC5rZXlzKGUuYmVoYXZpb3JBdHRycykubGVuZ3RoKSBvdXQuYmVoYXZpb3JBdHRycyA9IGUuYmVoYXZpb3JBdHRycztcbiAgICBpZiAoZS5jYW52YXNDbGljaykgb3V0LmNhbnZhc0NsaWNrID0gZS5jYW52YXNDbGljaztcbiAgICBpZiAoZS5lZGl0b3IpIG91dC5lZGl0b3IgPSBlLmVkaXRvcjtcbiAgICBpZiAoZS5pc0FuaW1hdGluZykgb3V0LmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICBpZiAoZS5zaGFkb3dIb3N0KSBvdXQuc2hhZG93SG9zdCA9IGUuc2hhZG93SG9zdDtcbiAgICBpZiAoZS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnJlbmRlcmVkVGV4dCA9IGUucmVuZGVyZWRUZXh0O1xuICAgIGlmIChlLnRydW5jYXRlZCAmJiBPYmplY3Qua2V5cyhlLnRydW5jYXRlZCkubGVuZ3RoKSBvdXQudHJ1bmNhdGVkID0gZS50cnVuY2F0ZWQ7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUuZG9tTXV0YXRpb25zICYmIGUuZG9tTXV0YXRpb25zLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGUuZG9tTXV0YXRpb25zO1xuXG4gICAgLy8gX2F1ZGl0OiBkZXRlY3Rpb24gY2hhaW4gJiBkaWFnbm9zdGljIHNoYXBlLlxuICAgIC8vIFJFQURNRSBjbGFpbWVkIGBfYXVkaXQuYW5jZXN0b3JzYCBhbmQgYF9hdWRpdC5jb21wb25lbnRSb290YCB3ZXJlXG4gICAgLy8gYWx3YXlzIHByZXNlbnQsIGJ1dCB0aGUgc2xpbSBlbWl0IGRyb3BwZWQgdGhlbSB3aGVuZXZlclxuICAgIC8vIGBtaW5pZnk6IHRydWVgLiBUaGUgZml4OiBlbWl0IGV2ZXJ5IGRlY2xhcmVkIGBfYXVkaXRgIGZpZWxkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHNvdXJjZSBkYXRhIGV4aXN0cywgYW5kIGxldFxuICAgIC8vIGBtaW5pZnlgIHNsaW0gT05MWSB0aGUgaGlnaC12b2x1bWUgYmxvY2tzIChtYXRjaGVkUnVsZXMsXG4gICAgLy8gcHNldWRvRWxlbWVudHMpLiBTbWFsbCBzdHJ1Y3R1cmFsIG1ldGFkYXRhIChhbmNlc3RvcnMsXG4gICAgLy8gY29tcG9uZW50Um9vdCwgdmlld3BvcnQpIHN1cnZpdmVzIG1pbmlmeSBzbyB0aGUgc2NoZW1hIGNsYWltc1xuICAgIC8vIHN0YXkgaG9uZXN0LlxuICAgIGNvbnN0IGF1ZGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGUuYW5jZXN0b3JzICYmIGUuYW5jZXN0b3JzLmxlbmd0aCkgYXVkaXQuYW5jZXN0b3JzID0gZS5hbmNlc3RvcnM7XG4gICAgaWYgKGUuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBhdWRpdC5jb21wb25lbnRSb290ID0gZS5jb21wb25lbnRSb290O1xuICAgIGlmIChlLmluU2hhZG93RE9NKSBhdWRpdC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgaWYgKGUucHNldWRvRWxlbWVudHMgJiYgT2JqZWN0LmtleXMoZS5wc2V1ZG9FbGVtZW50cykubGVuZ3RoICYmICFtaW5pZnkpIGF1ZGl0LnBzZXVkb0VsZW1lbnRzID0gZS5wc2V1ZG9FbGVtZW50cztcbiAgICBpZiAoaW5jbHVkZU1hdGNoZWQgJiYgZS5tYXRjaGVkUnVsZXMgJiYgZS5tYXRjaGVkUnVsZXMubGVuZ3RoKSB7XG4gICAgICBhdWRpdC5tYXRjaGVkUnVsZXMgPSBtaW5pZnlcbiAgICAgICAgPyBlLm1hdGNoZWRSdWxlcy5tYXAoKHIpID0+IHtcbiAgICAgICAgICBjb25zdCByMjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtzZWxlY3Rvcjogci5zZWxlY3Rvcn07XG4gICAgICAgICAgaWYgKHIuZGVjbGFyYXRpb25zICYmIE9iamVjdC5rZXlzKHIuZGVjbGFyYXRpb25zKS5sZW5ndGgpIHIyLmRlY2xhcmF0aW9ucyA9IHIuZGVjbGFyYXRpb25zO1xuICAgICAgICAgIGlmIChyLm1lZGlhKSByMi5tZWRpYSA9IHIubWVkaWE7XG4gICAgICAgICAgcmV0dXJuIHIyO1xuICAgICAgICB9KVxuICAgICAgICA6IGUubWF0Y2hlZFJ1bGVzO1xuICAgIH1cbiAgICBpZiAoZS52aWV3cG9ydCkgYXVkaXQudmlld3BvcnQgPSBlLnZpZXdwb3J0O1xuICAgIGlmIChPYmplY3Qua2V5cyhhdWRpdCkubGVuZ3RoKSBvdXQuX2F1ZGl0ID0gYXVkaXQ7XG5cbiAgICAvLyBHcm91cCBoZWFkIGxpbmthZ2UuIFByZXZpb3VzbHkgdGhlIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgXG4gICAgLy8gY2FycmllZCBmdWxsIG5lc3RlZCBlbnRyeSBvYmplY3RzLlxuICAgIC8vIFRoYXQgbWFkZSBEdWNrREIgam9pbnMgdWdseSBhbmQgYnJva2UgdGhlIHJ1bGUgdGhhdCBldmVyeVxuICAgIC8vIHNlbGVjdG9yIHNob3VsZCBiZSBhIHRvcC1sZXZlbCByb3cuIFdlIG5vdyBlbWl0OlxuICAgIC8vICAg4oCiIG9uIHRoZSBncm91cCBoZWFkOiBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlkLCB1aWQsIC4uLl1gIChqdXN0IElEcylcbiAgICAvLyAgIOKAoiBlYWNoIG1lbWJlciBhcyBpdHMgb3duIHRvcC1sZXZlbCBzbGltIHJvdyB3aXRoIGBncm91cFVpZGBcbiAgICAvLyAgICAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZCAoaGFuZGxlZCBpbiBgYnVpbGRTbGltYCBmbHVzaCBsb2dpYykuXG4gICAgaWYgKG9wdHMuaW5jbHVkZUdyb3VwICYmIGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgIG91dC5ncm91cE1lbWJlclVpZHMgPSBlLmdyb3VwLm1hcCgoZykgPT4gZy51aWQpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG4gICAgaWYgKG9wdHMuZ3JvdXBVaWQpIG91dC5ncm91cFVpZCA9IG9wdHMuZ3JvdXBVaWQ7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICAvLyDilIDilIDilIAgU2hhcmVkIFwic2xpbSBkYXRhXCIgcGlwZWxpbmUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEpTT05MIHJlbmRlcnMgb2ZmIHRoaXMgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uLiAoTWFya2Rvd24gdXNlZCB0b1xuICAvLyBzaGFyZSBpdDsgdGhlIE1hcmtkb3duIGV4cG9ydCB3YXMgcmV0aXJlZCBpbiBmYXZvciBvZiBKU09OTC1vbmx5LilcbiAgLy9cbiAgLy8gdjIgZGlmZmVyZW5jZXMgdnMgdjE6XG4gIC8vICAg4oCiIFNlbGVjdG9yIGxpbmVzIGhhdmUgZXhwbGljaXQgYHR5cGU6ICdzZWxlY3RvcidgIGFuZCBgdjogMmAuXG4gIC8vICAg4oCiIF9hdWRpdCBuZXN0cyBkZXRlY3Rpb24gLyBkZWJ1ZyBmaWVsZHMgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwg4oCmKS5cbiAgLy8gICDigKIgRmVlZGJhY2sgZW1pdHMgYXMgc3RhbmRhbG9uZSBge3R5cGU6J2ZlZWRiYWNrJywgcGFyZW50VWlkLCDigKZ9YCBsaW5lc1xuICAvLyAgICAgUExVUyBidW5kbGVkIGBmZWVkYmFja2AgYXJyYXlzIG9uIHNlbGVjdG9ycyAoc28gb2xkIHNpbmdsZS1saW5lXG4gIC8vICAgICByZWFkZXJzIHN0aWxsIHNlZSB0aGVtIGFkamFjZW50KS5cbiAgLy8gICDigKIgQSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgY2FycmllcyB3b3Jrc3BhY2UgKyBjb3VudHMgKyBmaWxlbmFtZS5cbiAgdHlwZSBTbGltUGFnZSA9IHt2OiAyOyB0eXBlOiAncGFnZSc7IHRzOiBzdHJpbmc7IHVybDogc3RyaW5nOyB0aXRsZT86IHN0cmluZzsgdmlld3BvcnQ/OiBWaWV3cG9ydDsgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgdXNlckFnZW50Pzogc3RyaW5nOyBsYW5nPzogc3RyaW5nOyBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307IHJvdXRlPzogYW55OyBzdGF0ZT86IGFueTsgc2Vzc2lvbklkPzogc3RyaW5nOyBzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH07XG4gIC8vIFNldmVyaXR5IHdhcyByZW1vdmVkIGZyb20gdGhlIFVJICgyMDI2LTA1KS4gVG9sZXJhbnQgcmVhZGVycyBtYXkgc3RpbGxcbiAgLy8gc2VlIGBzZXZlcml0eWAgb24gbGVnYWN5IEpTT05MIOKAlCBkZW5vcm1hbGl6ZUVudHJ5IHByZXNlcnZlcyBpdCBvblxuICAvLyBGZWVkYmFja01lc3NhZ2Ugc28gcmUtZXhwb3J0IHJvdW5kLXRyaXBzLCBidXQgbmV3IHNlc3Npb25zIG5ldmVyIHNldFxuICAvLyBpdCBhbmQgd2UgZG9uJ3QgZW1pdCBpdCBoZXJlLiBLZWVwIHRoZSBmaWVsZCBvZmYgU2xpbUZlZWRiYWNrIHNvIG5ld1xuICAvLyBleHBvcnRzIHN0YXkgY2xlYW4uXG4gIC8vIGB0YWdzYCBpcyBhbHdheXMgZW1pdHRlZCAoZGVmYXVsdCBlbXB0eSBhcnJheSkgc28gRHVja0RCIHNjaGVtYVxuICAvLyBpbmZlcmVuY2UgYWx3YXlzIHNlZXMgdGhlIGNvbHVtbi5cbiAgdHlwZSBTbGltRmVlZGJhY2sgPSB7djogMjsgdHlwZTogJ2ZlZWRiYWNrJzsgdWlkOiBzdHJpbmc7IHRzOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nOyB0YWdzOiBzdHJpbmdbXTsgaXNUZXN0RGF0YT86IGJvb2xlYW59O1xuICAvLyBDaGVhcCB0ZXN0LWRhdGEgc25pZmY6IG1hdGNoZXMgc3RyaW5ncyB0aGUgdXNlciB0eXBlcyB3aGlsZSBzbW9rZS1cbiAgLy8gdGVzdGluZyB0aGUgZXh0ZW5zaW9uIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsIFwibG9yZW0gaXBzdW1cIixcbiAgLy8gXCJwbGFjZWhvbGRlclwiLCBvciBhbnkgcGhyYXNlIG9idmlvdXNseSBzdHViYmVkLW91dCkuIEZhbHNlIHBvc2l0aXZlc1xuICAvLyBoZXJlIGFyZSByZWNvdmVyYWJsZSDigJQgdGhlIGNvbnN1bWVyIGNhbiBpZ25vcmUgdGhlIGZsYWcg4oCUIGJ1dFxuICAvLyBleGNsdWRpbmcgcmVhbCBmZWVkYmFjayB3b3VsZCBub3QgYmUsIHNvIHdlIGtlZXAgdGhlIHJlZ2V4IG5hcnJvdy5cbiAgY29uc3QgVEVTVF9EQVRBX1JFID0gL14odGVzdHxhc2RmfHF3ZXJ8Zm9vfGJhcnxiYXp8bG9yZW18cGxhY2Vob2xkZXJ8dG9kb3x4ezMsfXxoZWxsbyB3b3JsZHxzYW1wbGV8ZHVtbXl8c29tZXRoaW5nfGFueXRoaW5nfGlnbm9yZSBtZXx3aXB8dGJkfG5cXC9hfGhpKVxcYi9pO1xuICBjb25zdCBsb29rc0xpa2VUZXN0RGF0YSA9ICh0ZXh0OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50cmltKCk7XG4gICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKFRFU1RfREFUQV9SRS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoL3Rlc3QgZmVlZGJhY2svaS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHR5cGUgU2xpbVNlbGVjdG9yID0gUmVjb3JkPHN0cmluZywgYW55PiAmIHt2OiAyOyB0eXBlOiAnc2VsZWN0b3InOyBuOiBudW1iZXI7IHNlbGVjdG9yOiBzdHJpbmc7IGZlZWRiYWNrPzogc3RyaW5nW119O1xuICB0eXBlIFNsaW1MaW5lID0gU2xpbVBhZ2UgfCBTbGltRmVlZGJhY2sgfCBTbGltU2VsZWN0b3I7XG4gIGNvbnN0IGJ1aWxkU2xpbSA9ICgpOiBTbGltTGluZVtdID0+IHtcbiAgICBjb25zdCBsaW5lczogU2xpbUxpbmVbXSA9IFtdO1xuICAgIC8vIFByZS1jb21wdXRlIHZpc3VhbE9yZGVyICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkgZm9yIGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3IgbWVzc2FnZS4gVGhlIHByZXZpb3VzIHNpbmdsZSBgbmAgZmllbGQgY29uZmxhdGVkXG4gICAgLy8gY2FwdHVyZSBvcmRlciwgSlNPTkwgc3RyZWFtIG9yZGVyLFxuICAgIC8vIHZpc3VhbCBvcmRlciwgYW5kIGRpc3BsYXkgbGFiZWwuIFdlIG5vdyBlbWl0IGZvdXIgb3J0aG9nb25hbFxuICAgIC8vIGZpZWxkcyBhbmQgZG9jdW1lbnQgZWFjaDpcbiAgICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gICAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCB0aGUgb3JpZ2luYWwgYG5gIChjYXB0dXJlIHNlcXVlbmNlKVxuICAgIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgc29ydCBieSByZWN0LnkgYXNjLCByZWN0LnggYXNjXG4gICAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCB0aGUgaHVtYW4tZmFjaW5nIG51bWJlciBzaG93biBpbiB0aGUgc2lkZWJhclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAoY3VycmVudGx5IG1pcnJvcnMgY2FwdHVyZUluZGV4OyBjYW4gZHJpZnQgaWZcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhlIHNpZGViYXIgYWRvcHRzIGEgZGlmZmVyZW50IGxhYmVsIHNjaGVtZSkuXG4gICAgY29uc3QgdmlzdWFsUmFuayA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgY29uc3Qgc2VscyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFyID0gYS5lbnRyeS5yZWN0OyBjb25zdCBiciA9IGIuZW50cnkucmVjdDtcbiAgICAgICAgaWYgKCFhciB8fCAhYnIpIHJldHVybiAwO1xuICAgICAgICBpZiAoYXIueSAhPT0gYnIueSkgcmV0dXJuIGFyLnkgLSBici55O1xuICAgICAgICByZXR1cm4gYXIueCAtIGJyLng7XG4gICAgICB9KTtcbiAgICBzZWxzLmZvckVhY2goKG0sIGkpID0+IHZpc3VhbFJhbmsuc2V0KG0uaWQsIGkgKyAxKSk7XG4gICAgbGV0IHBlbmRpbmdTZWw6IFNlbGVjdG9yTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIC8vIFdlIGNvbGxlY3QgYm90aCB0aGUgYnVuZGxlZCBzdHJpbmcgYXJyYXkgKGZvciB2MS1mcmllbmRseSByZWFkZXJzKSBhbmRcbiAgICAvLyB0aGUgcmljaCBvYmplY3RzIChmb3IgdjIgc3RhbmRhbG9uZSBsaW5lcykuXG4gICAgbGV0IHBlbmRpbmdGYlN0cmluZ3M6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHBlbmRpbmdGYlJpY2g6IFNsaW1GZWVkYmFja1tdID0gW107XG4gICAgY29uc3QgZmx1c2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBlbmRpbmdTZWwpIHJldHVybjtcbiAgICAgIGNvbnN0IGV2ZW50SW5kZXggPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgY29uc3QgdmlzdWFsT3JkZXIgPSB2aXN1YWxSYW5rLmdldChwZW5kaW5nU2VsLmlkKTtcbiAgICAgIGNvbnN0IG91dDogYW55ID0gc2xpbUVudHJ5KHBlbmRpbmdTZWwuZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWUsIGV2ZW50SW5kZXgsIHZpc3VhbE9yZGVyfSk7XG4gICAgICBpZiAocGVuZGluZ0ZiU3RyaW5ncy5sZW5ndGgpIG91dC5mZWVkYmFjayA9IFsuLi5wZW5kaW5nRmJTdHJpbmdzXTtcbiAgICAgIGxpbmVzLnB1c2gob3V0IGFzIFNsaW1MaW5lKTtcbiAgICAgIC8vIEdyb3VwIGZsYXRuZXNzIChidWcgIzkpLiBFbWl0IGVhY2ggZ3JvdXAgbWVtYmVyIGFzIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzbGltIHJvdyByaWdodCBhZnRlciB0aGUgaGVhZCwgd2l0aCBgZ3JvdXBVaWRgXG4gICAgICAvLyBsaW5raW5nIGJhY2suIFRoaXMgbGV0cyBEdWNrREIgLyBTUUwgcXVlcmllcyB0cmVhdCBncm91cFxuICAgICAgLy8gbWVtYmVycyBhcyBmaXJzdC1jbGFzcyBzZWxlY3RvciByb3dzIHdpdGhvdXQgZGVzY2VuZGluZyBpbnRvXG4gICAgICAvLyBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgIGNvbnN0IGdyb3VwTWVtYmVycyA9IHBlbmRpbmdTZWwuZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBncm91cE1lbWJlcnMpIHtcbiAgICAgICAgY29uc3QgbUV2ZW50ID0gbGluZXMubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3QgbWVtYmVyUm93OiBhbnkgPSBzbGltRW50cnkobWVtYmVyLCB7aW5jbHVkZUdyb3VwOiBmYWxzZSwgZXZlbnRJbmRleDogbUV2ZW50LCBncm91cFVpZDogcGVuZGluZ1NlbC5lbnRyeS51aWR9KTtcbiAgICAgICAgbGluZXMucHVzaChtZW1iZXJSb3cgYXMgU2xpbUxpbmUpO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBlYWNoIHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZSByaWdodCBhZnRlciB0aGUgc2VsZWN0b3IocykuXG4gICAgICBmb3IgKGNvbnN0IGZiIG9mIHBlbmRpbmdGYlJpY2gpIGxpbmVzLnB1c2goZmIpO1xuICAgICAgcGVuZGluZ1NlbCA9IG51bGw7XG4gICAgICBwZW5kaW5nRmJTdHJpbmdzID0gW107XG4gICAgICBwZW5kaW5nRmJSaWNoID0gW107XG4gICAgfTtcbiAgICAvLyBSZW9yZGVyIGZvciBleHBvcnQgb25seSDigJQgc2lkZWJhciBrZWVwcyBjYXB0dXJlIG9yZGVyLCB0aGVcbiAgICAvLyBlbWl0dGVkIEpTT05MIHJlYWRzIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHdpdGhpbiBlYWNoIHBhZ2UuXG4gICAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciB2aWEgdGhlXG4gICAgLy8gYHJlb3JkZXJGb3JFeHBvcnRgIGhlbHBlciwgc28gdGhyZWFkaW5nIGlzIHByZXNlcnZlZCB0aHJvdWdoXG4gICAgLy8gdGhlIHJlYXJyYW5nZW1lbnQuXG4gICAgY29uc3QgZXhwb3J0T3JkZXJlZCA9IHJlb3JkZXJGb3JFeHBvcnQobWVzc2FnZXMpO1xuICAgIGZvciAoY29uc3QgbSBvZiBleHBvcnRPcmRlcmVkKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2goKTtcbiAgICAgICAgY29uc3Qgc2xpbTogU2xpbVBhZ2UgPSB7djogMiwgdHlwZTogJ3BhZ2UnLCB0czogbS50cywgdXJsOiBtLnVybH07XG4gICAgICAgIGlmIChtLnRpdGxlICE9PSB1bmRlZmluZWQpIHNsaW0udGl0bGUgPSBtLnRpdGxlO1xuICAgICAgICBpZiAobS52aWV3cG9ydCkgc2xpbS52aWV3cG9ydCA9IG0udmlld3BvcnQ7XG4gICAgICAgIGlmICghcHJlZnMubWluaWZ5ICYmIG0udG9rZW5zKSBzbGltLnRva2VucyA9IG0udG9rZW5zO1xuICAgICAgICBpZiAobS51c2VyQWdlbnQpIHNsaW0udXNlckFnZW50ID0gbS51c2VyQWdlbnQ7XG4gICAgICAgIGlmIChtLmxhbmcpIHNsaW0ubGFuZyA9IG0ubGFuZztcbiAgICAgICAgaWYgKG0uZ2l0Q29udGV4dCkgc2xpbS5naXRDb250ZXh0ID0gbS5naXRDb250ZXh0O1xuICAgICAgICBpZiAobS5yb3V0ZSkgc2xpbS5yb3V0ZSA9IG0ucm91dGU7XG4gICAgICAgIGlmIChtLnN0YXRlKSBzbGltLnN0YXRlID0gbS5zdGF0ZTtcbiAgICAgICAgaWYgKG0uc2Vzc2lvbklkKSBzbGltLnNlc3Npb25JZCA9IG0uc2Vzc2lvbklkO1xuICAgICAgICAvLyBGdWxsLXBhZ2Ugc25hcHNob3QgKHZpZXdwb3J0LCBzY3JvbGwgZXh0ZW50cywgZHByLCBsYW5nLCBzY3JlZW5zaG90KVxuICAgICAgICAvLyBjYXB0dXJlZCBmb3IgdGhpcyBVUkwuIFBhcnQgb2YgdGhlIGV4cG9ydCBkZWxpdmVyYWJsZSBzbyBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYWdlbnQgaGFzIHdob2xlLXBhZ2UgY29udGV4dCwgbm90IGp1c3QgZWxlbWVudCBjcm9wcy5cbiAgICAgICAgY29uc3Qgc25hcCA9IChtIGFzIFBhZ2VNZXNzYWdlICYge3NuYXBzaG90PzogUGFnZVNuYXBzaG90fSkuc25hcHNob3Q7XG4gICAgICAgIGlmIChzbmFwKSBzbGltLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgbGluZXMucHVzaChzbGltKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7IGZsdXNoKCk7IHBlbmRpbmdTZWwgPSBtOyB9XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgLy8gQWx3YXlzIGluY2x1ZGUgYHRhZ3M6IFtdYCAoZXZlbiB3aGVuIGVtcHR5KSBzbyBEdWNrREIncyBzY2hlbWFcbiAgICAgICAgLy8gaW5mZXJlbmNlIHBpY2tzIHRoZSBjb2x1bW4gdXAuXG4gICAgICAgIC8vIGB1aWRgIGlzIHRoZSBtZXNzYWdlJ3Mgc3RhYmxlIGlkOiBQUnMgLyByZXBhaXIgcmVwb3J0cyBuZWVkXG4gICAgICAgIC8vIGEgc3RhYmxlIHBlci1mZWVkYmFjayBoYW5kbGUsIG5vdCBqdXN0IHBhcmVudFVpZC5cbiAgICAgICAgY29uc3QgcmljaDogU2xpbUZlZWRiYWNrID0ge3Y6IDIsIHR5cGU6ICdmZWVkYmFjaycsIHVpZDogbS5pZCwgdHM6IG0udHMsIHRleHQ6IG0udGV4dCwgdGFnczogbS50YWdzID8/IFtdfTtcbiAgICAgICAgLy8gKHNldmVyaXR5IHJlbW92ZWQgMjAyNi0wNSDigJQgb2xkIEpTT05McyBtYXkgc3RpbGwgY29udGFpbiBpdFxuICAgICAgICAvLyBvbiB0aGUgcmVhZCBzaWRlLCBidXQgd2Ugbm8gbG9uZ2VyIGVtaXQgaXQgb24gd3JpdGUuKVxuICAgICAgICAvLyBIZXVyaXN0aWMgZmxhZyBmb3Igc3R1Yi1sb29raW5nIGZlZWRiYWNrIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsXG4gICAgICAgIC8vIFwiSG93ZHkgLCB0ZXN0IGZlZWRiYWNrIGhlcmVcIiwgZXRjKS4gTGV0cyBhIGRvd25zdHJlYW0gY29uc3VtZXJcbiAgICAgICAgLy8gZmlsdGVyIHBvbGx1dGlvbiBmcm9tIHJlYWwgaW50ZW50IHdpdGhvdXQgbWFudWFsIGNsZWFudXAuXG4gICAgICAgIGlmIChsb29rc0xpa2VUZXN0RGF0YShtLnRleHQpKSByaWNoLmlzVGVzdERhdGEgPSB0cnVlO1xuICAgICAgICBpZiAocGVuZGluZ1NlbCkge1xuICAgICAgICAgIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQgPz8gcGVuZGluZ1NlbC5lbnRyeS51aWQ7XG4gICAgICAgICAgcGVuZGluZ0ZiU3RyaW5ncy5wdXNoKG0udGV4dCk7XG4gICAgICAgICAgcGVuZGluZ0ZiUmljaC5wdXNoKHJpY2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtLnBhcmVudFVpZCkgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZDtcbiAgICAgICAgICBsaW5lcy5wdXNoKHJpY2gpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoKCk7XG4gICAgcmV0dXJuIGxpbmVzO1xuICB9O1xuICAvLyBCdWlsZCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIG9mIHRoZSBKU09OTCBleHBvcnQuIFRoZVxuICAvLyBtYW5pZmVzdCBjYXJyaWVzIHRoZSBleHBvcnQgZmlsZW5hbWUgKyB3b3Jrc3BhY2UgKyBob3N0KHMpICsgY291bnRzIHNvXG4gIC8vIGEgZG93bnN0cmVhbSBMTE0gY2FuIHJlc3luYyB0aGUgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgYW5kIGdyZXAgZm9yXG4gIC8vIGR1cGxpY2F0ZXMgYWNyb3NzIGV4cG9ydHMuXG4gIGNvbnN0IGJ1aWxkTWFuaWZlc3QgPSAoZmlsZW5hbWU6IHN0cmluZywgZm9ybWF0OiBFeHBvcnRNYW5pZmVzdFsnZm9ybWF0J10pOiBFeHBvcnRNYW5pZmVzdCA9PiB7XG4gICAgbGV0IG5TZWwgPSAwOyBsZXQgbkZiID0gMDsgbGV0IG5QZyA9IDA7XG4gICAgbGV0IG5Hcm91cE1lbWJlcnMgPSAwO1xuICAgIGxldCBuRmVlZGJhY2tCZWFyaW5nID0gMDtcbiAgICBsZXQgbk1pc3NpbmdTaG90ID0gMDtcbiAgICBsZXQgbkVsZW1lbnRTaG90cyA9IDA7XG4gICAgbGV0IG5Hcm91cFNob3RzID0gMDtcbiAgICBsZXQgblBhZ2VTaG90cyA9IDA7XG4gICAgbGV0IG5PcnBoYW5lZEZiID0gMDtcbiAgICBjb25zdCBzZWxlY3RvclVpZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgLy8gRmlyc3QgcGFzczogY29sbGVjdCB1aWRzICsgcGVyLXNlbGVjdG9yIGZlZWRiYWNrIHByZXNlbmNlLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICBuU2VsKys7XG4gICAgICAgIHNlbGVjdG9yVWlkcy5hZGQobS5lbnRyeS51aWQpO1xuICAgICAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBuR3JvdXBNZW1iZXJzICs9IG0uZW50cnkuZ3JvdXAubGVuZ3RoO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSBuRWxlbWVudFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSBuR3JvdXBTaG90cysrO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlKSBuUGFnZVNob3RzKys7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICBuRmIrKztcbiAgICAgICAgaWYgKG0ucGFyZW50VWlkKSBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmFkZChtLnBhcmVudFVpZCk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSBuUGcrKztcbiAgICB9XG4gICAgLy8gU2Vjb25kIHBhc3M6IGZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzICsgb3JwaGFuZWQgZmVlZGJhY2sgK1xuICAgIC8vIHNlbGVjdG9ycyB0aGF0IHNob3VsZCBoYXZlIGEgc2hvdCBidXQgZG9uJ3QuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InICYmIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuaGFzKG0uZW50cnkudWlkKSkge1xuICAgICAgICBuRmVlZGJhY2tCZWFyaW5nKys7XG4gICAgICAgIGlmICghbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50ICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSBuTWlzc2luZ1Nob3QrKztcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBmYlVpZCBvZiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yVWlkcy5oYXMoZmJVaWQpKSBuT3JwaGFuZWRGYisrO1xuICAgIH1cbiAgICBjb25zdCBvdXQ6IEV4cG9ydE1hbmlmZXN0ID0ge1xuICAgICAgdjogMiwgdHlwZTogJ21hbmlmZXN0JywgdG9vbDogJ3BpbmNoZ3JhYicsXG4gICAgICB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgZ2VuZXJhdGVkOiBEYXRlLm5vdygpLFxuICAgICAgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIGZpbGVuYW1lLFxuICAgICAgZm9ybWF0LFxuICAgICAgaG9zdHM6IGRpc3RpbmN0SG9zdHMoKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICAvLyBUb3RhbCBzZWxlY3RvciByb3dzIHRoZSBKU09OTCB3aWxsIGVtaXQgPSB0b3AtbGV2ZWwgKyBmbGF0XG4gICAgICAgIC8vIGdyb3VwIG1lbWJlcnMuIFRoaXMgbWF0Y2hlcyB3aGF0IGEgZG93bnN0cmVhbVxuICAgICAgICAvLyBgcmVhZF9qc29uX2F1dG8oLi4uKWAgd291bGQgc2VlOyB0aGUgcHJldmlvdXMgYmVoYXZpb3Igb2ZcbiAgICAgICAgLy8gcmVwb3J0aW5nIG9ubHkgdGhlIGluLW1lbW9yeSB0b3AtbGV2ZWwgY291bnQgY29udHJhZGljdGVkXG4gICAgICAgIC8vIHRoZSBhY3R1YWwgc3RyZWFtLlxuICAgICAgICBzZWxlY3RvcnM6IG5TZWwgKyBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBmZWVkYmFjazogbkZiLFxuICAgICAgICBwYWdlczogblBnLFxuICAgICAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM6IG5GZWVkYmFja0JlYXJpbmcsXG4gICAgICAgIGdyb3VwTWVtYmVyczogbkdyb3VwTWVtYmVycyxcbiAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiBuRWxlbWVudFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c0dyb3VwOiBuR3JvdXBTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNQYWdlOiBuUGFnZVNob3RzLFxuICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDogbk1pc3NpbmdTaG90LFxuICAgICAgICBvcnBoYW5lZEZlZWRiYWNrOiBuT3JwaGFuZWRGYixcbiAgICAgIH0sXG4gICAgICAvLyBTaW5nbGUgY2Fub25pY2FsIHJlc29sdXRpb24gcnVsZS4gRXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkxcbiAgICAgIC8vIChzY3JlZW5zaG90LmVsZW1lbnQvZ3JvdXAvcGFnZSkgaXMgcmVsYXRpdmUgdG8gYHBhdGhSb290YDpcbiAgICAgIC8vICAg4oCiICdhcmNoaXZlJzogZm9yIHRhci56c3QgZXhwb3J0cywgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZVxuICAgICAgLy8gICAgIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3QgKGUuZy4gYHNjcmVlbnNob3RzL2Zvby5wbmdgKS5cbiAgICAgIC8vICAg4oCiICd3b3Jrc3BhY2UnOiBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cywgcGF0aHMgYXJlIHJlbGF0aXZlIHRvXG4gICAgICAvLyAgICAgdGhlIHdvcmtzcGFjZSBkaXIgKGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gKS5cbiAgICAgIC8vIFJlY2VpdmVycyBubyBsb25nZXIgaGF2ZSB0byBndWVzcyB3aGljaCBwYXRoIHNoYXBlIGFwcGxpZXMuXG4gICAgICBwYXRoUm9vdDogZm9ybWF0ID09PSAndGFyLnpzdCcgPyAnYXJjaGl2ZScgOiAnd29ya3NwYWNlJyxcbiAgICB9O1xuICAgIC8vIEluZGlyZWN0aW9uIHBvaW50ZXJzIHNvIGEgZG93bnN0cmVhbSBhZ2VudCBrbm93cyB3aGljaCBVSSBza2lsbFxuICAgIC8vIG93bnMgdGhlIHRyaWFnZSBmbG93ICsgd2hpY2ggREVTSUdOLm1kIG93bnMgdGhlIHZpc3VhbCBpZGVudGl0eS5cbiAgICAvL1xuICAgIC8vIGBpbmxpbmU6IHRydWVgIGlzIHNldCBPTkxZIGZvciB0YXIuenN0IGV4cG9ydHMgKHdoZXJlIHRoZSAubWRcbiAgICAvLyBmaWxlcyBhcmUgcGh5c2ljYWxseSBidW5kbGVkIGludG8gdGhlIGFyY2hpdmUpLiBKU09OTC1vbmx5XG4gICAgLy8gZXhwb3J0cyBlbWl0IGBpbmxpbmU6IGZhbHNlYCBwbHVzIHRoZSByZWNlaXZlci1zaWRlIGBwYXRoYCBzb1xuICAgIC8vIGEgY29uc3VtZXIgcGFpcmVkIHdpdGggdGhlIHN0YW5kYWxvbmUgSlNPTkwgY2FuIHJlc29sdmUgdGhlXG4gICAgLy8gcmVmZXJlbmNlZCBmaWxlIG9mZiB0aGVpciBvd24gZmlsZXN5c3RlbS5cbiAgICAvL1xuICAgIC8vIGB0ZW1wbGF0ZTogdHJ1ZWAgZmxhZ3Mgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDigJQgdXNlZnVsXG4gICAgLy8gZm9yIHJlY2VpdmVycyB3aG8gd2FudCB0byBkaXN0aW5ndWlzaCBidW5kbGVkLWRlZmF1bHQgY29udGVudFxuICAgIC8vIGZyb20gdGhlIHVzZXIncyBhY3R1YWwgd29ya2luZyBub3Rlcy5cbiAgICBjb25zdCBpc1RhckJ1bmRsZSA9IGZvcm1hdCA9PT0gJ3Rhci56c3QnO1xuICAgIG91dC5za2lsbCA9IHtcbiAgICAgIG5hbWU6ICdQaW5jaEdyYWInLFxuICAgICAgcGF0aDogcHJlZnMuc2tpbGxQYXRoLFxuICAgICAgaW5saW5lOiBpc1RhckJ1bmRsZSxcbiAgICB9O1xuICAgIGlmIChpc1RhckJ1bmRsZSkgb3V0LnNraWxsLmFyY2hpdmVQYXRoID0gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCc7XG4gICAgaWYgKGlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpIG91dC5za2lsbC50ZW1wbGF0ZSA9IHRydWU7XG4gICAgZWxzZSBvdXQuc2tpbGwuY3VzdG9taXplZCA9IHRydWU7XG4gICAgb3V0LmRlc2lnbiA9IHtcbiAgICAgIHBhdGg6IHByZWZzLmRlc2lnblBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuZGVzaWduLmFyY2hpdmVQYXRoID0gJ0RFU0lHTi5tZCc7XG4gICAgaWYgKGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSBvdXQuZGVzaWduLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5kZXNpZ24uY3VzdG9taXplZCA9IHRydWU7XG5cbiAgICAvLyBTZWxmLXJvYXN0IGRpYWdub3N0aWNzLlxuICAgIGNvbnN0IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW10gPSBbXTtcbiAgICAvLyBGZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycyB3aXRoIG5vIHNjcmVlbnNob3QuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmICghZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSBjb250aW51ZTtcbiAgICAgIGlmICghbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50ICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0ZFRURCQUNLX1BBUkVOVF9NSVNTSU5HX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgJHttLmVudHJ5LnNlbGVjdG9yfSBjYXJyaWVzIGZlZWRiYWNrIGJ1dCBoYXMgbm8gZWxlbWVudC9ncm91cCBzY3JlZW5zaG90YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE9ycGhhbmVkIGZlZWRiYWNrIChwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlKS5cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgICAgY29kZTogJ09SUEhBTkVEX0ZFRURCQUNLJyxcbiAgICAgICAgICB1aWQ6IGZiVWlkLFxuICAgICAgICAgIGRldGFpbDogJ2ZlZWRiYWNrIHJvdyByZWZlcmVuY2VzIGEgcGFyZW50VWlkIHRoYXQgaGFzIG5vIG1hdGNoaW5nIHNlbGVjdG9yIGluIHRoaXMgYXJjaGl2ZScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBIb3Zlci1zdGF0ZSBjYXB0dXJlcyB1c3VhbGx5IG5lZWQgYSBiZWZvcmUvYWZ0ZXI7IGZsYWcgYW55IHdob3NlXG4gICAgLy8gc2NyZWVuc2hvdCBzdG9yeSBpcyBpbmNvbXBsZXRlIChidWcgIzE2IHBhcnRpYWwpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zdGF0ZXMgJiYgbS5lbnRyeS5zdGF0ZXMuaW5jbHVkZXMoJ2hvdmVyJykgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdIT1ZFUl9TVEFURV9OT19TQ1JFRU5TSE9UJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHNlbGVjdG9yIGNhcHR1cmVkIGluIDpob3ZlciBzdGF0ZSBidXQgaGFzIG5vIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQTExeTogZmxhZyBmYWlsaW5nIGNvbnRyYXN0IChidWcgIzE1IGZvbGxvdy10aHJvdWdoKS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuYTExeT8uY29udHJhc3RQYXNzZXMgPT09ICdmYWlsJykge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdDT05UUkFTVF9CRUxPV19BQScsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGB0ZXh0IGNvbnRyYXN0IHJhdGlvICR7bS5lbnRyeS5hMTF5LmNvbnRyYXN0UmF0aW8gPz8gJz8nfSBpcyBiZWxvdyBXQ0FHIEFBYCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkaWFnbm9zdGljcy5sZW5ndGgpIG91dC5leHBvcnREaWFnbm9zdGljcyA9IGRpYWdub3N0aWNzO1xuXG4gICAgLy8gQnVpbGQgaWRlbnRpdHkuIFB1bGwgZnJvbSB0aGUgbW9zdCByZWNlbnQgcGFnZSByb3cncyBnaXRDb250ZXh0XG4gICAgLy8gKHNvdXJjZWQgdmlhIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCI+YCBvbiB0aGUgY2FwdHVyZWQgYXBwKVxuICAgIC8vIHBsdXMgdGhlIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi4gT21pdCB0aGUgYmxvY2sgZW50aXJlbHlcbiAgICAvLyB3aGVuIG5laXRoZXIgaXMgYXZhaWxhYmxlLlxuICAgIGNvbnN0IGxhc3RQYWdlID0gWy4uLm1lc3NhZ2VzXS5yZXZlcnNlKCkuZmluZCgobSkgPT4gbS50eXBlID09PSAncGFnZScpIGFzIFBhZ2VNZXNzYWdlIHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IGdpdCA9IGxhc3RQYWdlPy5naXRDb250ZXh0O1xuICAgIGNvbnN0IGV4dFZlciA9IGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRNYW5pZmVzdCA/IGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbiA6IHVuZGVmaW5lZDtcbiAgICBpZiAoZ2l0IHx8IGV4dFZlcikge1xuICAgICAgb3V0LmJ1aWxkID0ge307XG4gICAgICBpZiAoZXh0VmVyKSBvdXQuYnVpbGQuZXh0ZW5zaW9uVmVyc2lvbiA9IGV4dFZlcjtcbiAgICAgIGlmIChnaXQ/LmNvbW1pdCkgb3V0LmJ1aWxkLmNvbW1pdCA9IGdpdC5jb21taXQ7XG4gICAgICBpZiAoZ2l0Py5icmFuY2gpIG91dC5idWlsZC5icmFuY2ggPSBnaXQuYnJhbmNoO1xuICAgICAgaWYgKGdpdD8uYnVpbGQpIG91dC5idWlsZC5kZXBsb3lCdWlsZCA9IGdpdC5idWlsZDtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgY29uc3QgYnVpbGRKc29ubCA9IChmaWxlbmFtZUZvck1hbmlmZXN0Pzogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSA9ICdqc29ubCcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZmlsZW5hbWVGb3JNYW5pZmVzdCA/PyBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gYnVpbGRNYW5pZmVzdChmaWxlbmFtZSwgZm9ybWF0KTtcbiAgICBjb25zdCBsaW5lcyA9IGJ1aWxkU2xpbSgpO1xuICAgIGlmICghbGluZXMubGVuZ3RoKSB7XG4gICAgICAvLyBFdmVuIGFuIGVtcHR5IHdvcmtzcGFjZSBnZXRzIGEgbWFuaWZlc3QgbGluZSBzbyBkb3duc3RyZWFtIHRvb2xzXG4gICAgICAvLyBjYW4gdmVyaWZ5IHRoZSBmaWxlIHdhcyBnZW5lcmF0ZWQgYnkgUGluY2hHcmFiLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSArICdcXG4nO1xuICAgIH1cbiAgICByZXR1cm4gW0pTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSwgLi4ubGluZXMubWFwKChsKSA9PiBKU09OLnN0cmluZ2lmeShsKSldLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gIH07XG4gIGNvbnN0IGRvd25sb2FkRmlsZSA9IChjb250ZW50OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWUgPSAndGV4dC9wbGFpbicpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtjb250ZW50XSwge3R5cGU6IG1pbWV9KSk7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7XG4gICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgIGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gIH07XG5cbiAgY29uc3Qgb25Db3B5QWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgaWYgKHRleHQudHJpbSgpLnNwbGl0KCdcXG4nKS5sZW5ndGggPD0gMSAmJiAhbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAvLyBNYW5pZmVzdC1vbmx5IG91dHB1dCBmb3IgYW4gZW1wdHkgd29ya3NwYWNlIHNob3VsZG4ndCBwcmV0ZW5kIHRvIGJlIGEgY29weS5cbiAgICAgIHNldFN0YXR1cygnTm90aGluZyB0byBjb3B5Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpO1xuICAgIHNldFN0YXR1cyhgQ29waWVkIEpTT05MIMK3ICR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICAgIHNob3dDb3BpZWQoJ0NvcGllZCBKU09OTCcsIGAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgfTtcbiAgLy8gU2F2ZSB0aHJvdWdoIHRoZSBiYWNrZ3JvdW5kJ3MgZmlsZSBicmlkZ2UgaWYgd2UncmUgaW4gYW4gZXh0ZW5zaW9uXG4gIC8vIGNvbnRleHQsIHNvIHRoZSBmaWxlIGxhbmRzIHVuZGVyIERvd25sb2Fkcy8ucGluY2hncmFiLzx3cz4vZXhwb3J0cy8uXG4gIC8vIE90aGVyd2lzZSAodGVzdCBwYWdlLCBkZXYgc2VydmVyKSwgZmFsbCBiYWNrIHRvIGEgc3ludGhldGljIGJsb2IgVVJMLlxuICBjb25zdCBzYXZlRXhwb3J0VG9EaXNrID0gYXN5bmMgKHRleHQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZTogc3RyaW5nLCBraW5kOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sg4oaSJywge2ZpbGVuYW1lLCBtaW1lLCBzaXplOiB0ZXh0Lmxlbmd0aCwga2luZH0pO1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtraW5kOiAnc2F2ZS10ZXh0Jywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWUsIHRleHQsIG1pbWV9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgcmVwbHk6JywgcmVwbHkpO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5hYnNQYXRoKSB7XG4gICAgICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IHJlcGx5LmZpbGVuYW1lID8/IG51bGw7XG4gICAgICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSByZXBseS5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gQm9vbGVhbihyZXBseS50ZW1wUGF0aCk7XG4gICAgICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIHNldFN0YXR1cyhgRXhwb3J0ZWQgwrcgJHtsYXN0RXhwb3J0LmNvcHlQYXRofWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCAod29ya2VyIGRlYWQ/IHJlbG9hZCBleHRlbnNpb24gYXQgY2hyb21lOi8vZXh0ZW5zaW9ucyknO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdzYXZlRXhwb3J0VG9EaXNrIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBFeHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZG93bmxvYWRGaWxlKHRleHQsIGZpbGVuYW1lLCBtaW1lKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICBzZXRTdGF0dXMoJ0V4cG9ydGVkJyk7XG4gIH07XG4gIGNvbnN0IG9uRXhwb3J0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubChmaWxlbmFtZSk7XG4gICAgYXdhaXQgc2F2ZUV4cG9ydFRvRGlzayh0ZXh0LCBmaWxlbmFtZSwgJ2FwcGxpY2F0aW9uL2pzb25sJywgJ2pzb25sJyk7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCB0YXIuenN0IHdvcmtzcGFjZSBleHBvcnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJ1bmRsZSBKU09OTCArIFJFQURNRSArIER1Y2tEQiByZWNpcGVzICsgc2NyZWVuc2hvdHMuanNvbiArIGFjdHVhbCBQTkdcbiAgLy8gc2NyZWVuc2hvdHMgaW50byBhIHNpbmdsZSAudGFyLnpzdCBhcmNoaXZlLiB0YXIgZ2l2ZXMgdXMgYSBjbGVhblxuICAvLyBjb250YWluZXIgKG9uZSBmaWxlIHBlciBlbnRyeSwgbm8gemlwLXN0eWxlIGNlbnRyYWwtZGlyZWN0b3J5XG4gIC8vIGNvbnRvcnRpb25zKTsgenN0ZCBpcyB0aGUgbW9kZXJuIGNvbXByZXNzaW9uIHBhaXIuIEltcGxlbWVudGF0aW9uIGlzXG4gIC8vIHB1cmUtVFMg4oCUIHNlZSBzcmMvdGFyLnRzIGZvciB0aGUgZW5jb2RlciArIHpzdGQtZnJhbWUgd3JpdGVyLlxuICAvLyBCdWcgIzI4OiBhIEpTT04tU2NoZW1hIGRlc2NyaWJpbmcgZXZlcnkgcm93IHR5cGUgaW4gdGhlIEpTT05MLlxuICAvLyBSZWNlaXZlcnMgY2FuIHVzZSB0aGlzIHRvIHZhbGlkYXRlIGZpeHR1cmVzLCBkcml2ZSBhdXRvY29tcGxldGUgaW5cbiAgLy8gZWRpdG9ycywgYW5kIGF1dG8tZ2VuZXJhdGUgcGFyc2Vycy4gS2VlcCB0aGlzIGluIHN5bmMgd2l0aCB0aGVcbiAgLy8gc2hhcGVzIGVtaXR0ZWQgYnkgYnVpbGRTbGltL3NsaW1FbnRyeSDigJQgYG5wbSBydW4gdGVzdGAgdmFsaWRhdGVzIGFcbiAgLy8gc2FtcGxlIGFnYWluc3QgdGhpcyBzY2hlbWEuXG4gIGNvbnN0IGJ1aWxkU2NoZW1hSnNvbiA9ICgpOiBzdHJpbmcgPT4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICRzY2hlbWE6ICdodHRwczovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC8yMDIwLTEyL3NjaGVtYScsXG4gICAgJGlkOiAnaHR0cHM6Ly93cmFubmdsZS5jb20vcGluY2hncmFiL2V4cG9ydC52Mi5zY2hlbWEuanNvbicsXG4gICAgdGl0bGU6ICdQaW5jaEdyYWIgZXhwb3J0ICh2MiknLFxuICAgIGRlc2NyaXB0aW9uOiAnSlNPTkwgcm93ICsgbWFuaWZlc3Qgc2NoZW1hcyBmb3IgUGluY2hHcmFiIHdvcmtzcGFjZSBleHBvcnRzLicsXG4gICAgb25lT2Y6IFtcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9tYW5pZmVzdCd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3BhZ2UnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9zZWxlY3Rvcid9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL2ZlZWRiYWNrJ30sXG4gICAgXSxcbiAgICAkZGVmczoge1xuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0b29sJywgJ3RzJywgJ3dvcmtzcGFjZScsICdmaWxlbmFtZScsICdmb3JtYXQnLCAnaG9zdHMnLCAnY291bnRzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ21hbmlmZXN0J30sXG4gICAgICAgICAgdG9vbDoge2NvbnN0OiAncGluY2hncmFiJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgZ2VuZXJhdGVkOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB3b3Jrc3BhY2U6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZmlsZW5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZm9ybWF0OiB7ZW51bTogWydqc29ubCcsICdtYXJrZG93bicsICd0YXIuenN0J119LFxuICAgICAgICAgIGhvc3RzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHBhdGhSb290OiB7ZW51bTogWydhcmNoaXZlJywgJ3dvcmtzcGFjZSddfSxcbiAgICAgICAgICBjb3VudHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3JzJywgJ2ZlZWRiYWNrJywgJ3BhZ2VzJ10sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgcGFnZXM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBncm91cE1lbWJlcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c0dyb3VwOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNQYWdlOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBvcnBoYW5lZEZlZWRiYWNrOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBza2lsbDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc2lnbjoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZXh0ZW5zaW9uVmVyc2lvbjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpcnR5OiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgZGVwbG95QnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwb3J0RGlhZ25vc3RpY3M6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2V2ZXJpdHknLCAnY29kZSddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgc2V2ZXJpdHk6IHtlbnVtOiBbJ2Vycm9yJywgJ3dhcm4nLCAnaW5mbyddfSxcbiAgICAgICAgICAgICAgICBjb2RlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGRldGFpbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGFnZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3RzJywgJ3VybCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdwYWdlJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRpdGxlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICB0b2tlbnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHVzZXJBZ2VudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBsYW5nOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2Vzc2lvbklkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ24nLCAndHMnLCAndXJsJywgJ3RhZycsICdzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdzZWxlY3Rvcid9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBuOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBjYXB0dXJlSW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGV2ZW50SW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHZpc3VhbE9yZGVyOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBkaXNwbGF5TGFiZWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvcjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvck1hdGNoQ291bnQ6IHt0eXBlOiAnaW50ZWdlcicsIG1pbmltdW06IDB9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcmVuZGVyZWRUZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJvbGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgYWNjZXNzaWJsZU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGVzdElkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGNsYXNzZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgYXR0cnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHJlY3Q6IHskcmVmOiAnIy8kZGVmcy9yZWN0J30sXG4gICAgICAgICAgc3RhdGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGZyYW1ld29yazoge2VudW06IFsncmVhY3QnLCAndnVlJywgJ2xpdCcsICdzdGVuY2lsJywgJ3N2ZWx0ZScsICd3ZWItY29tcG9uZW50J119LFxuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXNwbGF5TmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2hhaW46IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtmaWxlOiB7dHlwZTogWydzdHJpbmcnLCAnbnVsbCddfSwgbGluZToge3R5cGU6IFsnaW50ZWdlcicsICdudWxsJ119fSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdXRlckhUTUw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc3R5bGVzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBzY3JlZW5zaG90OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZ3JvdXA6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhZ2U6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNhcHR1cmVkQXQ6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hhZG93SG9zdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgZ3JvdXBVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ3JvdXBNZW1iZXJVaWRzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGZlZWRiYWNrOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIF9hdWRpdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGFuY2VzdG9yczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvYW5jZXN0b3InfX0sXG4gICAgICAgICAgICAgIGNvbXBvbmVudFJvb3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgcHNldWRvRWxlbWVudHM6IHt0eXBlOiAnb2JqZWN0J30sXG4gICAgICAgICAgICAgIG1hdGNoZWRSdWxlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvbWF0Y2hlZFJ1bGUnfX0sXG4gICAgICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBmZWVkYmFjazoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICd0cycsICd0ZXh0JywgJ3RhZ3MnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnZmVlZGJhY2snfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBwYXJlbnRVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGFnczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBpc1Rlc3REYXRhOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2aWV3cG9ydDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHc6IHt0eXBlOiAnaW50ZWdlcid9LCBoOiB7dHlwZTogJ2ludGVnZXInfSwgZHByOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICAgIGNvbG9yU2NoZW1lOiB7ZW51bTogWydsaWdodCcsICdkYXJrJ119LFxuICAgICAgICAgIHJlZHVjZWRNb3Rpb246IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGRpcmVjdGlvbjoge2VudW06IFsnbHRyJywgJ3J0bCddfSxcbiAgICAgICAgICB6b29tOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlY3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3gnLCAneScsICd3JywgJ2gnXSxcbiAgICAgICAgcHJvcGVydGllczoge3g6IHt0eXBlOiAnbnVtYmVyJ30sIHk6IHt0eXBlOiAnbnVtYmVyJ30sIHc6IHt0eXBlOiAnbnVtYmVyJ30sIGg6IHt0eXBlOiAnbnVtYmVyJ319LFxuICAgICAgfSxcbiAgICAgIGFuY2VzdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd0YWcnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1hdGNoZWRSdWxlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGVjbGFyYXRpb25zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBtZWRpYToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSwgbnVsbCwgMikgKyAnXFxuJztcblxuICAvLyBHZW5lcmF0ZSByZXBhaXItaW5kZXgubWQgYXMgYSBzdHJ1Y3R1cmVkIHN0YXJ0aW5nIHBvaW50IGZvciBhblxuICAvLyBhdXRvbm9tb3VzIGNvZGluZyBhZ2VudC4gRm9yIGV2ZXJ5IGZlZWRiYWNrIHJvdywgbWVjaGFuaWNhbGx5IGRlcml2ZTpcbiAgLy8gICDigKIgdGFyZ2V0IGlkZW50aXR5ICh1aWQsIHNlbGVjdG9yLCB0YWcsIGFjY2Vzc2libGUgbmFtZSlcbiAgLy8gICDigKIgc2NyZWVuc2hvdCBwYXRoICh3aXRoIGFyY2hpdmUtcmVsYXRpdmUgZm9ybSlcbiAgLy8gICDigKIgc291cmNlIGhpbnRzIChjb21wb25lbnQgY2hhaW4sIHNvdXJjZW1hcCBmaWxlL2xpbmUpXG4gIC8vICAg4oCiIHN1Z2dlc3RlZCBmaXggY2F0ZWdvcnkgKGNoZWFwIGhldXJpc3RpYyBvbiB0ZXh0KVxuICAvLyBUaGUgYWdlbnQgdXNlcyB0aGlzIGFzIGEgc3RhcnRpbmcgcHVuY2ggbGlzdCwgdGhlbiB2YWxpZGF0ZXMgK1xuICAvLyByZWZpbmVzIGVhY2ggc3VnZ2VzdGlvbiBhZ2FpbnN0IHRoZSBmdWxsIEpTT05MLlxuICBjb25zdCBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkgPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICgvXFxiKHR5cG98Y29weXx3b3JkaW5nfGxhYmVsfG1pc3NwZWxsfGdyYW1tYXJ8Y2FwaXRhbGl6KS8udGVzdCh0KSkgcmV0dXJuICdjb3B5JztcbiAgICBpZiAoL1xcYihhbGlnbnxzcGFjaW5nfHBhZGRpbmd8bWFyZ2lufGxheW91dHxvdmVybGFwfGNyb3dkZWR8Y3JhbXBlZHx0aWdodHxnYXApLy50ZXN0KHQpKSByZXR1cm4gJ2xheW91dCc7XG4gICAgaWYgKC9cXGIodW5jbGVhcnxjb25mdXNpbmd8d2hhdCBkb2VzfHdoYXQgaXN8ZG9uJ3QgdW5kZXJzdGFuZHxoYXJkIHRvfG5hdnxuYXZpZ2F0aW9uKS8udGVzdCh0KSkgcmV0dXJuICdhZmZvcmRhbmNlJztcbiAgICBpZiAoL1xcYihjb250cmFzdHxjb2xvciBibGluZHxzY3JlZW4gcmVhZGVyfGFyaWF8Zm9jdXN8a2V5Ym9hcmR8dGFifGExMXl8YWNjZXNzaWIpLy50ZXN0KHQpKSByZXR1cm4gJ2FjY2Vzc2liaWxpdHknO1xuICAgIGlmICgvXFxiKGJyb2tlbnxjcmFzaHxudWxsfHVuZGVmaW5lZHxlcnJvcnw0MDR8ZmFpbCkvLnRlc3QodCkpIHJldHVybiAnc3RhdGUnO1xuICAgIGlmICgvXFxiKHVnbHl8Y29sb3J8Z3JhZGllbnR8c2hhZG93fHBvbGlzaHx2aXN1YWx8c3R5bGUpLy50ZXN0KHQpKSByZXR1cm4gJ3Zpc3VhbC1wb2xpc2gnO1xuICAgIHJldHVybiAndW5zcGVjaWZpZWQnO1xuICB9O1xuICBjb25zdCBidWlsZFJlcGFpckluZGV4ID0gKG1hbmlmZXN0OiBFeHBvcnRNYW5pZmVzdCwganNvbmxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHR5cGUgUm93ID0ge2ZlZWRiYWNrOiBGZWVkYmFja01lc3NhZ2U7IHBhcmVudD86IFNlbGVjdG9yTWVzc2FnZX07XG4gICAgY29uc3Qgcm93czogUm93W10gPSBbXTtcbiAgICBjb25zdCBieVVpZCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3Rvck1lc3NhZ2U+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBieVVpZC5zZXQobS5lbnRyeS51aWQsIG0pO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ2ZlZWRiYWNrJykgY29udGludWU7XG4gICAgICBjb25zdCBwYXJlbnQgPSBtLnBhcmVudFVpZCA/IGJ5VWlkLmdldChtLnBhcmVudFVpZCkgOiB1bmRlZmluZWQ7XG4gICAgICByb3dzLnB1c2goe2ZlZWRiYWNrOiBtLCBwYXJlbnR9KTtcbiAgICB9XG4gICAgaWYgKCFyb3dzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgJyMgcmVwYWlyLWluZGV4Lm1kJyxcbiAgICAgICAgJycsXG4gICAgICAgIGBHZW5lcmF0ZWQ6ICR7bWFuaWZlc3QudHN9YCxcbiAgICAgICAgJycsXG4gICAgICAgICdfKG5vIGZlZWRiYWNrIGluIHRoaXMgZXhwb3J0IOKAlCBub3RoaW5nIHRvIHJlcGFpcilfJyxcbiAgICAgICAgJycsXG4gICAgICBdLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgb3V0LnB1c2goJyMgcmVwYWlyLWluZGV4Lm1kJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKGBHZW5lcmF0ZWQ6ICR7bWFuaWZlc3QudHN9YCk7XG4gICAgb3V0LnB1c2goYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgIMK3IEhvc3RzOiAke21hbmlmZXN0Lmhvc3RzLm1hcCgoaCkgPT4gJ2AnICsgaCArICdgJykuam9pbignLCAnKSB8fCAnKG5vbmUpJ31gKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJ0Egc3RhcnRpbmcgcHVuY2ggbGlzdCBmb3IgYW4gYXV0b25vbW91cyByZXBhaXIgYWdlbnQuIEVhY2ggcm93IGlzIG9uZSB1c2VyIGNvbXBsYWludCB3aXRoIHRoZSBkYXRhIG5lZWRlZCB0byBsb2NhdGUsIGZpeCwgYW5kIHZlcmlmeS4gQ3Jvc3MtcmVmZXJlbmNlIGAnICsganNvbmxOYW1lICsgJ2AgZm9yIHRoZSBmdWxsIHJlY29yZC4nKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJyMjIFRhc2tzJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIHJvd3MuZm9yRWFjaCgoe2ZlZWRiYWNrLCBwYXJlbnR9LCBpKSA9PiB7XG4gICAgICBjb25zdCBmYklkID0gYEYke1N0cmluZyhpICsgMSkucGFkU3RhcnQoMywgJzAnKX1gO1xuICAgICAgY29uc3QgdGFyZ2V0ID0gcGFyZW50Py5lbnRyeTtcbiAgICAgIG91dC5wdXNoKGAjIyMgJHtmYklkfSDigJQgJHtmZWVkYmFjay50ZXh0LnNsaWNlKDAsIDgwKX0ke2ZlZWRiYWNrLnRleHQubGVuZ3RoID4gODAgPyAn4oCmJyA6ICcnfWApO1xuICAgICAgb3V0LnB1c2goJycpO1xuICAgICAgb3V0LnB1c2goYD4gJHtmZWVkYmFjay50ZXh0LnNwbGl0KCdcXG4nKS5qb2luKCdcXG4+ICcpfWApO1xuICAgICAgb3V0LnB1c2goJycpO1xuICAgICAgb3V0LnB1c2goYC0gKipmZWVkYmFja1VpZDoqKiBcXGAke2ZlZWRiYWNrLmlkfVxcYGApO1xuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICBvdXQucHVzaChgLSAqKnRhcmdldDoqKiBcXGAke3RhcmdldC5zZWxlY3Rvcn1cXGAgXyh1aWQgXFxgJHt0YXJnZXQudWlkfVxcYCwgbj0ke3RhcmdldC5ufSlfYCk7XG4gICAgICAgIGlmICh0YXJnZXQudGFnKSBvdXQucHVzaChgLSAqKnRhZzoqKiBcXGA8JHt0YXJnZXQudGFnfT5cXGAke3RhcmdldC5yb2xlID8gYCDCtyByb2xlPVxcYCR7dGFyZ2V0LnJvbGV9XFxgYCA6ICcnfWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFjY2Vzc2libGVOYW1lKSBvdXQucHVzaChgLSAqKmFjY2Vzc2libGUgbmFtZToqKiBcIiR7dGFyZ2V0LmFjY2Vzc2libGVOYW1lLnNsaWNlKDAsIDEwMCl9XCJgKTtcbiAgICAgICAgaWYgKHRhcmdldC50ZXh0ICYmIHRhcmdldC50ZXh0ICE9PSB0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnZpc2libGUgdGV4dDoqKiBcIiR7dGFyZ2V0LnRleHQuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNlbGVjdG9yIHF1YWxpdHk6KiogbWF0Y2hlcyAke3RhcmdldC5zZWxlY3Rvck1hdGNoQ291bnR9IGVsZW1lbnQke3RhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgPT09IDEgPyAnJyA6ICdzJ31gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5lbGVtZW50fVxcYGApO1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5zY3JlZW5zaG90Py5ncm91cCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdCAoZ3JvdXApOioqIFxcYCR7dGFyZ2V0LnNjcmVlbnNob3QuZ3JvdXB9XFxgYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90OioqIF8obWlzc2luZyDigJQgc2VlIGV4cG9ydERpYWdub3N0aWNzKV9gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbnN0IGMgPSB0YXJnZXQuY29tcG9uZW50O1xuICAgICAgICAgIGNvbnN0IGNoID0gYy5jaGFpbiAmJiBjLmNoYWluLmxlbmd0aCA/IGAgwrcgY2hhaW4gJHtjLmNoYWluLnNsaWNlKDAsIDUpLm1hcCgobikgPT4gJ2AnICsgbiArICdgJykuam9pbignIOKGkiAnKX1gIDogJyc7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipjb21wb25lbnQ6KiogXFxgJHtjLm5hbWUgPz8gYy5kaXNwbGF5TmFtZSA/PyAnPyd9XFxgICgke2MuZnJhbWV3b3JrfSkke2NofWApO1xuICAgICAgICAgIGlmIChjLnNvdXJjZT8uZmlsZSkgb3V0LnB1c2goYC0gKipzb3VyY2U6KiogXFxgJHtjLnNvdXJjZS5maWxlfVxcYCR7Yy5zb3VyY2UubGluZSA/IGA6JHtjLnNvdXJjZS5saW5lfWAgOiAnJ31gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LmNvbXBvbmVudFJvb3QpIG91dC5wdXNoKGAtICoqY29tcG9uZW50IHJvb3Q6KiogJHt0YXJnZXQuY29tcG9uZW50Um9vdH1gKTtcbiAgICAgICAgaWYgKHRhcmdldC5hbmNlc3RvcnMgJiYgdGFyZ2V0LmFuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBjaGFpbiA9IHRhcmdldC5hbmNlc3RvcnMuc2xpY2UoMCwgNCkubWFwKChhKSA9PiBgPCR7YS50YWd9PiR7YS5pZCA/ICcjJyArIGEuaWQgOiBhLnRlc3RJZCA/IGBbdGVzdElkPVwiJHthLnRlc3RJZH1cIl1gIDogJyd9YCkuam9pbignIOKAuiAnKTtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmFuY2VzdG9yIGNoYWluOioqICR7Y2hhaW59YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC51cmwpIG91dC5wdXNoKGAtICoqdXJsOioqICR7dGFyZ2V0LnVybH1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIF8obm8gc2VsZWN0b3Ig4oCUIG9ycGhhbmVkIGZlZWRiYWNrKV9gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNhdCA9IGluZmVyRmVlZGJhY2tDYXRlZ29yeShmZWVkYmFjay50ZXh0KTtcbiAgICAgIG91dC5wdXNoKGAtICoqc3VnZ2VzdGVkIGNhdGVnb3J5OioqICR7Y2F0fWApO1xuICAgICAgb3V0LnB1c2goJycpO1xuICAgIH0pO1xuICAgIG91dC5wdXNoKCctLS0nKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJ0NhdGVnb3JpZXMgYXJlIGluZmVycmVkIGZyb20gZmVlZGJhY2sgdGV4dCB2aWEga2V5d29yZCBoZXVyaXN0aWNzIOKAlCB2ZXJpZnkgYmVmb3JlIGFjdGluZy4nKTtcbiAgICByZXR1cm4gb3V0LmpvaW4oJ1xcbicpO1xuICB9O1xuXG4gIGNvbnN0IGJ1aWxkUmVhZG1lID0gKG1hbmlmZXN0OiBFeHBvcnRNYW5pZmVzdCwganNvbmxOYW1lOiBzdHJpbmcsIHNob3RDb3VudDogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXG4gICAgICAnIyBQaW5jaEdyYWIgV29ya3NwYWNlIEV4cG9ydCcsXG4gICAgICAnJyxcbiAgICAgIGBHZW5lcmF0ZWQ6ICR7bWFuaWZlc3QudHN9YCxcbiAgICAgIGBXb3Jrc3BhY2U6IFxcYCR7bWFuaWZlc3Qud29ya3NwYWNlfVxcYGAsXG4gICAgICBgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubGVuZ3RoID8gbWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIDogJyhub25lKSd9YCxcbiAgICAgIGBDb3VudHM6ICoqJHttYW5pZmVzdC5jb3VudHMuc2VsZWN0b3JzfSoqIHNlbGVjdG9ycyDCtyAqKiR7bWFuaWZlc3QuY291bnRzLmZlZWRiYWNrfSoqIGNvbW1lbnRzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMucGFnZXN9KiogcGFnZXMgwrcgKioke3Nob3RDb3VudH0qKiBzY3JlZW5zaG90c2AsXG4gICAgICAnJyxcbiAgICAgICcjIyBUcmlhZ2UgbWF0ZXJpYWxzJyxcbiAgICAgICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZVxuICAgICAgICA/IGAtICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBidW5kbGVkIGF0IFxcYC4vJHttYW5pZmVzdC5za2lsbC5hcmNoaXZlUGF0aCA/PyAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJ31cXGAke21hbmlmZXN0LnNraWxsLmN1c3RvbWl6ZWQgPyAnIF8oY3VzdG9taXplZCDigJQgdHJ1c3QgYXMgYXV0aG9yaXRhdGl2ZSlfJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgZ2VuZXJpYyBib2lsZXJwbGF0ZSwgdmVyaWZ5IGJlZm9yZSBhcHBseWluZylfJyA6ICcnfSDigJQgaG93IHRvIHJlYWQgdGhpcyBleHBvcnQgYW5kIHRyaWFnZSB0aGUgY2FwdHVyZXMuYFxuICAgICAgICA6IChtYW5pZmVzdC5za2lsbD8ucGF0aFxuICAgICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIFxcYCR7bWFuaWZlc3Quc2tpbGwucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6Kiogbm90IGNvbmZpZ3VyZWQuJyksXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZVxuICAgICAgICA/IGAtICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIGJ1bmRsZWQgaW5saW5lIGF0IFxcYC4vJHttYW5pZmVzdC5kZXNpZ24uYXJjaGl2ZVBhdGggPz8gJ0RFU0lHTi5tZCd9XFxgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCB0aGUgdG9rZW5zIC8gdm9pY2UgcnVsZXMgYXMgcHJvamVjdCBjYW5vbilfJyA6IG1hbmlmZXN0LmRlc2lnbi50ZW1wbGF0ZSA/ICcgXyhidW5kbGVkIGRlZmF1bHQg4oCUIHBsYWNlaG9sZGVyLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBjb2xvciB0b2tlbnMsIHR5cG9ncmFwaHksIHNwYWNpbmcsIG1vdGlvbiwgdm9pY2UuYFxuICAgICAgICA6IChtYW5pZmVzdC5kZXNpZ24/LnBhdGhcbiAgICAgICAgICA/IGAtICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIFxcYCR7bWFuaWZlc3QuZGVzaWduLnBhdGh9XFxgIOKAlCByZWFkIG9uIHRoZSByZWNlaXZlcidzIGZpbGVzeXN0ZW0uYFxuICAgICAgICAgIDogJy0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6Kiogbm90IGNvbmZpZ3VyZWQuJyksXG4gICAgICAnJyxcbiAgICAgICcjIyBGaWxlcycsXG4gICAgICAnJyxcbiAgICAgICctIGByZXBhaXItaW5kZXgubWRgIOKAlCBhZ2VudC1mcmllbmRseSB0cmlhZ2UgcHVuY2ggbGlzdCAoc3RhcnQgaGVyZSkuJyxcbiAgICAgIGAtIFxcYCR7anNvbmxOYW1lfVxcYCDigJQgSlNPTkwgc3RyZWFtIChvbmUgY2FwdHVyZSBwZXIgbGluZSwgbGVhZGluZyBtYW5pZmVzdCwgc2NoZW1hIHYyKS5gLFxuICAgICAgJy0gYHNjcmVlbnNob3RzLyoucG5nYCDigJQgZnVsbC1yZXNvbHV0aW9uIFBOR3Mgb2YgZWFjaCBjYXB0dXJlZCBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlLicsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMuanNvbmAg4oCUIHVpZC1rZXllZCBpbmRleDogYGJ5VWlkW3VpZF0g4oaSIHsgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8gfWAsIGBieVVybFt1cmxdIOKGkiB7IHBhZ2U/LCB1aWRzW10gfWAsIHBsdXMgYSBmbGF0IGBmaWxlc1tdYCBsaXN0aW5nLicsXG4gICAgICAnLSBgc2NoZW1hLmpzb25gIOKAlCBKU09OLVNjaGVtYSAoZHJhZnQgMjAyMC0xMikgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZS4nLFxuICAgICAgJy0gYGR1Y2tkYi5zcWxgIOKAlCBjb3B5LWFuZC1wYXN0ZSByZWNpcGVzIGZvciBxdWVyeWluZyB0aGUgSlNPTkwgd2l0aCBEdWNrREIuJyxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gYC0gXFxgREVTSUdOLm1kXFxgIOKAlCAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCBkZXNpZ24gc291cmNlLW9mLXRydXRoICh0cnVzdCBhcyBjYW5vbmljYWwpLicgOiBtYW5pZmVzdC5kZXNpZ24udGVtcGxhdGUgPyAnUGluY2hHcmFiXFwncyBidW5kbGVkIERFU0lHTi5tZCB0ZW1wbGF0ZSAocGxhY2Vob2xkZXIg4oCUIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpLicgOiAnJ31gIDogJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lID8gYC0gXFxgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kXFxgIOKAlCAke21hbmlmZXN0LnNraWxsLmN1c3RvbWl6ZWQgPyAncHJvamVjdC1jdXN0b21pemVkIHRyaWFnZSBza2lsbC4nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnUGluY2hHcmFiXFwncyBidW5kbGVkIGRlZmF1bHQgdHJpYWdlIHNraWxsICh0ZW1wbGF0ZSBjb250ZW50KS4nIDogJyd9YCA6ICcnLFxuICAgICAgJycsXG4gICAgICAnIyMgRXh0cmFjdGluZycsXG4gICAgICAnJyxcbiAgICAgICdQaWNrIHdoaWNoZXZlciB2YXJpYW50IHlvdXIgbWFjaGluZSBzdXBwb3J0cyDigJQgbm90IGV2ZXJ5IHN5c3RlbSBzaGlwcyBgenN0ZGAuJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNoJyxcbiAgICAgICcjIDEuIE1vZGVybiB0YXIgd2l0aCBidWlsdC1pbiB6c3RkIHN1cHBvcnQgKExpbnV4ICsgcmVjZW50IG1hY09TKTonLFxuICAgICAgYHRhciAtLXpzdGQgLXhmICR7bWFuaWZlc3QuZmlsZW5hbWV9YCxcbiAgICAgICcnLFxuICAgICAgJyMgMi4gdGFyICsgc3RhbmRhbG9uZSB6c3RkIENMSTonLFxuICAgICAgYHpzdGQgLWQgJHttYW5pZmVzdC5maWxlbmFtZX0gLW8gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgdGFyIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgICcnLFxuICAgICAgJyMgMy4gUHVyZS1Ob2RlIGZhbGxiYWNrIChubyB6c3RkIENMSSAvIG5vIHRhcik6JyxcbiAgICAgIGBucHggLXkgQHJvbm9tb24venN0YW5kYXJkIDwgJHttYW5pZmVzdC5maWxlbmFtZX0gPiAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgIGAjIOKApiB0aGVuIHVzZSBhbnkgdGFyIHJlYWRlciAoZS5nLiBcXGBucHggdGFyLXN0cmVhbVxcYClgLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICdFeHBlY3RlZCBmaWxlIGxpc3QgYWZ0ZXIgZXh0cmFjdGlvbjonLFxuICAgICAgJycsXG4gICAgICAnYGBgJyxcbiAgICAgIGAke2pzb25sTmFtZX0gICAgICAgICAgICAgICAgICAgICMgSlNPTkwgc3RyZWFtICh0aGUgc291cmNlIG9mIHRydXRoKWAsXG4gICAgICBgc2NyZWVuc2hvdHMvICAgICAgICAgICAgICAgICAgICAjIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UgUE5Hc2AsXG4gICAgICBgc2NyZWVuc2hvdHMuanNvbiAgICAgICAgICAgICAgICAjIHVpZC1rZXllZCBsb29rdXAgaW5kZXhgLFxuICAgICAgYGR1Y2tkYi5zcWwgICAgICAgICAgICAgICAgICAgICAgIyBjb3B5LXBhc3RlIFNRTCByZWNpcGVzYCxcbiAgICAgIGBzY2hlbWEuanNvbiAgICAgICAgICAgICAgICAgICAgICMgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlYCxcbiAgICAgIGBSRUFETUUubWQgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBmaWxlYCxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gJ0RFU0lHTi5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB2aXN1YWwgaWRlbnRpdHkgc291cmNlLW9mLXRydXRoJyA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQgICMgdHJpYWdlIGluc3RydWN0aW9ucycgOiAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgUXVpY2sgRHVja0RCJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNxbCcsXG4gICAgICBgQ1JFQVRFIFRBQkxFIGNhcHR1cmVzIEFTIFNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oJyR7anNvbmxOYW1lfScsIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLCBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCk7YCxcbiAgICAgIFwiU0VMRUNUIG4sIHNlbGVjdG9yLCB0YWcsIHJvbGUsIGhpbnRzIEZST00gY2FwdHVyZXMgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgTElNSVQgMjA7XCIsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFNjaGVtYScsXG4gICAgICAnJyxcbiAgICAgICdTZWxlY3RvciBsaW5lcyBoYXZlIGB0eXBlOiBcInNlbGVjdG9yXCJgLCBgdjogMmAsIGEgc3RhYmxlIGB1aWRgLCB0b3AtbGV2ZWwgaWRlbnRpZmljYXRpb24gZmllbGRzLCBhbmQgYW4gYF9hdWRpdGAgbmFtZXNwYWNlIG5lc3RpbmcgZGV0ZWN0aW9uIG1ldGFkYXRhIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBGZWVkYmFjayBsaW5lcyBsaW5rIGJhY2sgdmlhIGBwYXJlbnRVaWRgIGFuZCBjYXJyeSB0aGVpciBvd24gYHVpZGAuIEdyb3VwIGhlYWRzIGNhcnJ5IGBncm91cE1lbWJlclVpZHM6IFt1aWTigKZdYDsgZWFjaCBncm91cCBtZW1iZXIgaXMgYSB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkLiBCdW5kbGVkIGBzY2hlbWEuanNvbmAgaXMgdGhlIGNhbm9uaWNhbCBtYWNoaW5lLXJlYWRhYmxlIGZvcm0uJyxcbiAgICAgICcnLFxuICAgIF07XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuICAvLyBzY3JlZW5zaG90cy5qc29uIOKAlCBwcm9wZXIga2V5ZWQgaW5kZXggaW5zdGVhZCBvZiB0aGUgb2xkIFRTVi4gVGhyZWVcbiAgLy8gc2hhcGVzIGZvciB0aHJlZSBsb29rdXAgcGF0dGVybnM6XG4gIC8vICAg4oCiIGJ5VWlkOiAgdWlkIOKGkiB7IG4sIHNlbGVjdG9yLCB1cmwsIGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/LCBtZW1iZXJzPyB9XG4gIC8vICAgICAgICAgICAgICBcImdpdmUgbWUgZXZlcnkgc2hvdCBmb3IgdGhpcyBlbnRyeVwiXG4gIC8vICAg4oCiIGJ5VXJsOiAgdXJsIOKGkiB7IHBhZ2U/LCB1aWRzW10gfVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0IHBhZ2Ugc2hvdCBjb3ZlcnMgdGhpcyBVUkw/IHdoaWNoIGNhcHR1cmVzIGxhbmRlZCBoZXJlP1wiXG4gIC8vICAg4oCiIGZpbGVzOiAgZmxhdCBsaXN0IG9mIGV2ZXJ5IFBORyBwYXRoIGluIHRoZSBhcmNoaXZlXG4gIC8vICAgICAgICAgICAgICBcIndoYXQncyBpbiBzY3JlZW5zaG90cy8gP1wiXG4gIC8vIFRoZSBgaW5BcmNoaXZlYCBmbGFnIG9uIGVhY2ggZmlsZSBtaXJyb3JzIHRoZSB0YXIgYnVuZGxlIG1lbWJlcnNoaXBcbiAgLy8gc28gYSBjb25zdW1lciBkb3duc3RyZWFtIG9mIHRoZSAudGFyLnpzdCBleHRyYWN0aW9uIGNhbiB0ZWxsIHdoaWNoXG4gIC8vIHBhdGhzIHBvaW50IElOU0lERSB0aGUgYXJjaGl2ZSAocmVsYXRpdmUpIHZzIGF0IG9uLWRpc2sgc2libGluZ3MuXG4gIGNvbnN0IGJ1aWxkU2NyZWVuc2hvdHNJbmRleCA9IChidW5kbGVkOiBTZXQ8c3RyaW5nPik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgYnlVaWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBjb25zdCBieVVybDogUmVjb3JkPHN0cmluZywge3BhZ2U/OiBzdHJpbmc7IHVpZHM6IHN0cmluZ1tdfT4gPSB7fTtcbiAgICBjb25zdCBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZyB8IG51bGw7IGtpbmQ6ICdlbGVtZW50JyB8ICdncm91cCcgfCAncGFnZSc7IHVpZD86IHN0cmluZzsgbj86IG51bWJlcjsgc2VsZWN0b3I/OiBzdHJpbmc7IHVybD86IHN0cmluZ30+ID0gW107XG4gICAgY29uc3Qgc2VlbkZpbGUgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBhcmNoaXZlTGVhZiA9IChyZWw6IHN0cmluZyk6IHN0cmluZyA9PiBgc2NyZWVuc2hvdHMvJHtyZWwuc3BsaXQoJy8nKS5wb3AoKSA/PyByZWx9YDtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICBpZiAoIWUudWlkKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHNsb3Q6IGFueSA9IHtuOiBlLm4sIHNlbGVjdG9yOiBlLnNlbGVjdG9yLCB1cmw6IGUudXJsfTtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LmVsZW1lbnQpIHNsb3QuZWxlbWVudCA9IGUuc2NyZWVuc2hvdC5lbGVtZW50O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZ3JvdXApIHNsb3QuZ3JvdXAgPSBlLnNjcmVlbnNob3QuZ3JvdXA7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlKSBzbG90LnBhZ2UgPSBlLnNjcmVlbnNob3QucGFnZTtcbiAgICAgIGlmIChlLmdyb3VwICYmIGUuZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIHNsb3QubWVtYmVycyA9IGUuZ3JvdXAubWFwKChnKSA9PiBnLnVpZCkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgfVxuICAgICAgYnlVaWRbZS51aWRdID0gc2xvdDtcblxuICAgICAgY29uc3QgdXJsID0gZS51cmw7XG4gICAgICBjb25zdCB1cmxTbG90ID0gYnlVcmxbdXJsXSA/PyAoYnlVcmxbdXJsXSA9IHt1aWRzOiBbXX0pO1xuICAgICAgdXJsU2xvdC51aWRzLnB1c2goZS51aWQpO1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8ucGFnZSAmJiAhdXJsU2xvdC5wYWdlKSB1cmxTbG90LnBhZ2UgPSBlLnNjcmVlbnNob3QucGFnZTtcblxuICAgICAgY29uc3QgcHVzaEZpbGUgPSAocmVsOiBzdHJpbmcgfCB1bmRlZmluZWQsIGtpbmQ6ICdlbGVtZW50JyB8ICdncm91cCcgfCAncGFnZScpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCFyZWwgfHwgc2VlbkZpbGUuaGFzKHJlbCkpIHJldHVybjtcbiAgICAgICAgc2VlbkZpbGUuYWRkKHJlbCk7XG4gICAgICAgIGNvbnN0IGluQXJjaGl2ZSA9IGJ1bmRsZWQuaGFzKHJlbCk7XG4gICAgICAgIGZpbGVzLnB1c2goe1xuICAgICAgICAgIHBhdGg6IHJlbCxcbiAgICAgICAgICBhcmNoaXZlUGF0aDogaW5BcmNoaXZlID8gYXJjaGl2ZUxlYWYocmVsKSA6IG51bGwsXG4gICAgICAgICAga2luZCwgdWlkOiBlLnVpZCwgbjogZS5uLFxuICAgICAgICAgIHNlbGVjdG9yOiBlLnNlbGVjdG9yLCB1cmw6IGUudXJsLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBwdXNoRmlsZShlLnNjcmVlbnNob3Q/LmVsZW1lbnQsICdlbGVtZW50Jyk7XG4gICAgICBwdXNoRmlsZShlLnNjcmVlbnNob3Q/Lmdyb3VwLCAnZ3JvdXAnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8ucGFnZSwgJ3BhZ2UnKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0ID0ge1xuICAgICAgdjogMixcbiAgICAgIGtpbmQ6ICdwaW5jaGdyYWIvc2NyZWVuc2hvdHMtaW5kZXgnLFxuICAgICAgZ2VuZXJhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICBjb3VudHM6IHtcbiAgICAgICAgZmlsZXM6IGZpbGVzLmxlbmd0aCxcbiAgICAgICAgYnVuZGxlZDogZmlsZXMuZmlsdGVyKChmKSA9PiBmLmFyY2hpdmVQYXRoKS5sZW5ndGgsXG4gICAgICAgIGNhcHR1cmVzOiBPYmplY3Qua2V5cyhieVVpZCkubGVuZ3RoLFxuICAgICAgICB1cmxzOiBPYmplY3Qua2V5cyhieVVybCkubGVuZ3RoLFxuICAgICAgfSxcbiAgICAgIGJ5VWlkLFxuICAgICAgYnlVcmwsXG4gICAgICBmaWxlcyxcbiAgICB9O1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvdXQsIG51bGwsIDIpICsgJ1xcbic7XG4gIH07XG5cbiAgLy8gRGVjb2RlIGEgYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwuLi5gIFVSTCBpbnRvIHRoZSByYXcgUE5HIGJ5dGVzLlxuICBjb25zdCBkYXRhVXJsVG9CeXRlcyA9IChkYXRhVXJsOiBzdHJpbmcpOiBVaW50OEFycmF5ID0+IHtcbiAgICBjb25zdCBjb21tYSA9IGRhdGFVcmwuaW5kZXhPZignLCcpO1xuICAgIGlmIChjb21tYSA8IDApIHJldHVybiBuZXcgVWludDhBcnJheSgpO1xuICAgIGNvbnN0IGI2NCA9IGRhdGFVcmwuc2xpY2UoY29tbWEgKyAxKTtcbiAgICBjb25zdCBiaW5hcnkgPSBhdG9iKGI2NCk7XG4gICAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoYmluYXJ5Lmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIG91dFtpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgLy8gV2FsayB0aGUgbWVzc2FnZXMgYW5kIGdhdGhlciBldmVyeSBzY3JlZW5zaG90IHdlIHNob3VsZCBidW5kbGUuXG4gIC8vIFJldHVybnMgdGhlIHRhciBlbnRyaWVzIChlYWNoIGBzY3JlZW5zaG90cy88bGVhZj4ucG5nYCkgQU5EIHRoZSBzZXQgb2ZcbiAgLy8gd29ya3NwYWNlLXJlbGF0aXZlIFBORyBwYXRocyB0aGF0IGxhbmRlZCBpbiB0aGUgYXJjaGl2ZSAoZm9yIHRoZVxuICAvLyBtYW5pZmVzdCdzIFwiaW4tYXJjaGl2ZVwiIGNvbHVtbikuXG4gIGNvbnN0IGNvbGxlY3RTY3JlZW5zaG90RW50cmllcyA9ICgpOiB7ZW50cmllczogVGFyRW50cnlbXTsgYnVuZGxlZDogU2V0PHN0cmluZz59ID0+IHtcbiAgICBjb25zdCBlbnRyaWVzOiBUYXJFbnRyeVtdID0gW107XG4gICAgY29uc3QgYnVuZGxlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBwdXNoID0gKHJlbFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCwgZGF0YVVybDogc3RyaW5nIHwgdW5kZWZpbmVkKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXJlbFBhdGggfHwgIWRhdGFVcmwpIHJldHVybjtcbiAgICAgIGNvbnN0IGxlYWYgPSByZWxQYXRoLnNwbGl0KCcvJykucG9wKCkgPz8gcmVsUGF0aDtcbiAgICAgIGlmIChzZWVuLmhhcyhsZWFmKSkgcmV0dXJuOyAvLyBkZWR1cGUgd2l0aGluIGFyY2hpdmVcbiAgICAgIGNvbnN0IGJ5dGVzID0gZGF0YVVybFRvQnl0ZXMoZGF0YVVybCk7XG4gICAgICBpZiAoIWJ5dGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgZW50cmllcy5wdXNoKHtuYW1lOiBgc2NyZWVuc2hvdHMvJHtsZWFmfWAsIGRhdGE6IGJ5dGVzfSk7XG4gICAgICBidW5kbGVkLmFkZChyZWxQYXRoKTtcbiAgICAgIHNlZW4uYWRkKGxlYWYpO1xuICAgIH07XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHNlbCA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBjb25zdCB1cmwgPSBtLmVudHJ5LnVybDtcbiAgICAgIHB1c2gobS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50LCBzaG90c0Z1bGwuZ2V0KHNlbCkpO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwLCBzaG90c0Z1bGwuZ2V0KHNlbCkpO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UsIHNob3RzRnVsbC5nZXQoJ3BhZ2U6OicgKyB1cmwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHtlbnRyaWVzLCBidW5kbGVkfTtcbiAgfTtcblxuICBjb25zdCBvbkV4cG9ydFppcCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gZXhwb3J0Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICBjb25zdCBhcmNoaXZlTmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ3Rhci56c3QnKTtcbiAgICBjb25zdCBzdGVtID0gYXJjaGl2ZU5hbWUucmVwbGFjZSgvXFwudGFyXFwuenN0JC8sICcnKTtcbiAgICBjb25zdCBqc29ubE5hbWUgPSBgJHtzdGVtfS5qc29ubGA7XG4gICAgY29uc3QgbWFuaWZlc3QgPSBidWlsZE1hbmlmZXN0KGFyY2hpdmVOYW1lLCAndGFyLnpzdCcpO1xuICAgIC8vIFRoZSBKU09OTCBpbnNpZGUgdGhlIGFyY2hpdmUgbXVzdCBkZWNsYXJlIGl0c2VsZiBhcyBwYXJ0IG9mIGFcbiAgICAvLyB0YXIuenN0IGJ1bmRsZSBzbyBpdHMgbWFuaWZlc3QncyBgZGVzaWduLmlubGluZWAgLyBgc2tpbGwuaW5saW5lYFxuICAgIC8vIGZsYWdzIG1hdGNoIHdoYXQncyBhY3R1YWxseSBwcmVzZW50IGluIHRoZSBzdXJyb3VuZGluZyB0YXIuXG4gICAgY29uc3QganNvbmxUZXh0ID0gYnVpbGRKc29ubChqc29ubE5hbWUsICd0YXIuenN0Jyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIGNvbnN0IHtlbnRyaWVzOiBzaG90RW50cmllcywgYnVuZGxlZH0gPSBjb2xsZWN0U2NyZWVuc2hvdEVudHJpZXMoKTtcbiAgICBjb25zdCByZWFkbWUgPSBidWlsZFJlYWRtZShtYW5pZmVzdCwganNvbmxOYW1lLCBzaG90RW50cmllcy5sZW5ndGgpO1xuICAgIGNvbnN0IHNob3RzSnNvbiA9IGJ1aWxkU2NyZWVuc2hvdHNJbmRleChidW5kbGVkKTtcblxuICAgIC8vIE1hcmtkb3duIGV4cG9ydCB3YXMgZHJvcHBlZDogaXQgY2FycmllZCBubyBkYXRhIHRoZSBKU09OTCBkaWRuJ3RcbiAgICAvLyBhbHJlYWR5IGhhdmUgKHRoZSBodW1hbi1yZWFkYWJsZSBzdXJmYWNlIHdhcyBqdXN0IGEgY3VyYXRlZCBzdWJzZXRcbiAgICAvLyBvZiB0aGUgc2FtZSBmaWVsZHMpLCBhbmQgdGhlIGRpdmVyZ2VuY2Ug4oCUIG1kIHNpbGVudGx5IGRyb3BwZWRcbiAgICAvLyBncm91cCBjaGlsZHJlbiArIHRoZSBlbnRpcmUgYF9hdWRpdGAgbmFtZXNwYWNlIOKAlCByaXNrZWRcbiAgICAvLyBtaXNsZWFkaW5nIGFueSBodW1hbiBza2ltLiBSRUFETUUubWQgaW5zaWRlIHRoZSBhcmNoaXZlIGlzIHRoZVxuICAgIC8vIGh1bWFuIGVudHJ5IHBvaW50IG5vdy5cbiAgICAvLyBCdWcgIzc6IGdlbmVyYXRlIHJlcGFpci1pbmRleC5tZCBhcyB0aGUgYWdlbnQncyBmaXJzdC1yZWFkIGVudHJ5XG4gICAgLy8gcG9pbnQuIEJ1ZyAjNDAgZmlyc3QtcmVhZCBvcmRlcjogUkVBRE1FIHBvaW50cyB0aGUgcmVjZWl2ZXIgYXRcbiAgICAvLyByZXBhaXItaW5kZXgubWQgYmVmb3JlIFNLSUxMLm1kIC8gREVTSUdOLm1kLlxuICAgIGNvbnN0IHJlcGFpckluZGV4ID0gYnVpbGRSZXBhaXJJbmRleChtYW5pZmVzdCwganNvbmxOYW1lKTtcbiAgICBjb25zdCB0YXJFbnRyaWVzOiBUYXJFbnRyeVtdID0gW1xuICAgICAge25hbWU6ICdSRUFETUUubWQnLCBkYXRhOiByZWFkbWV9LFxuICAgICAge25hbWU6ICdyZXBhaXItaW5kZXgubWQnLCBkYXRhOiByZXBhaXJJbmRleH0sXG4gICAgICB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBqc29ubFRleHR9LFxuICAgICAge25hbWU6ICdzY3JlZW5zaG90cy5qc29uJywgZGF0YTogc2hvdHNKc29ufSxcbiAgICAgIHtuYW1lOiAnZHVja2RiLnNxbCcsIGRhdGE6IHNxbH0sXG4gICAgICAvLyBCdWcgIzI4OiBtYWNoaW5lLXJlYWRhYmxlIEpTT04tU2NoZW1hIGZvciBldmVyeSByb3cgdHlwZS5cbiAgICAgIHtuYW1lOiAnc2NoZW1hLmpzb24nLCBkYXRhOiBidWlsZFNjaGVtYUpzb24oKX0sXG4gICAgICAuLi5zaG90RW50cmllcyxcbiAgICBdO1xuICAgIC8vIERFU0lHTi5tZCDigJQgZWl0aGVyIHRoZSB1c2VyJ3MgY3VzdG9taXplZCBjb250ZW50IG9yIHRoZSBidW5kbGVkXG4gICAgLy8gdGVtcGxhdGUgLyBsb2NhbCBvdmVycmlkZS4gUmVzb2x2ZWQgdGhyb3VnaCB0aGUgc2FtZSBsb2FkZXIgdGhlXG4gICAgLy8gc2V0dGluZ3MgbW9kYWwgdXNlcyBzbyBjaHJvbWUuc3RvcmFnZSBzdGF5cyBzbWFsbCAoZW1wdHkgcHJlZnNcbiAgICAvLyDihpIgZmFsbGJhY2sgdG8gZXh0ZW5zaW9uL3RlbXBsYXRlcy8qLm1kIHZpYSBmZXRjaCkuXG4gICAgY29uc3QgZGVzaWduQ29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgaWYgKGRlc2lnbkNvbnRlbnQudHJpbSgpKSB7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICdERVNJR04ubWQnLCBkYXRhOiBkZXNpZ25Db250ZW50fSk7XG4gICAgfVxuICAgIC8vIFBpbmNoR3JhYiBVSSBza2lsbCDigJQgc2FtZSBzdG9yeS4gTGl2ZXMgYXQgdGhlIGNhbm9uaWNhbCByZWNlaXZlclxuICAgIC8vIHBhdGggaW5zaWRlIHRoZSBhcmNoaXZlIHNvIHRoZSByZWNlaXZlcidzIGAuYWdlbnRzL2AgdHJlZSBjYW4gYmVcbiAgICAvLyBwb3B1bGF0ZWQgYnkgYSBzaW1wbGUgYHRhciAteGAgZnJvbSB0aGUgYXJjaGl2ZSByb290LlxuICAgIC8vXG4gICAgLy8gRnJvbnRtYXR0ZXIgcmVuYW1lOiBhIHVzZXIncyBzb3VyY2UgU0tJTEwubWQgbWF5IHVzZSBgbmFtZTogdWlgXG4gICAgLy8gKGJlY2F1c2UgdGhhdCdzIGhvdyBpdCdzIGNhdGFsb2d1ZWQgaW4gdGhlaXIgZ2xvYmFsIGAuYWdlbnRzL2BcbiAgICAvLyBza2lsbHMgdHJlZSkuIEluc2lkZSBhIFBpbmNoR3JhYiBhcmNoaXZlIHRoZSBza2lsbCBpcyAqdGhlKlxuICAgIC8vIFBpbmNoR3JhYiBza2lsbCwgc28gd2UgcmVicmFuZCB0aGUgZnJvbnRtYXR0ZXIgYG5hbWU6YCBmaWVsZCBvblxuICAgIC8vIHRoZSB3YXkgaW50byB0aGUgdGFyIHdpdGhvdXQgdG91Y2hpbmcgdGhlIGJvZHkuIE9ubHkgdGhlIEZJUlNUXG4gICAgLy8gYG5hbWU6YCBsaW5lIGluc2lkZSB0aGUgbGVhZGluZyBgLS0tYCBibG9jayBpcyByZXdyaXR0ZW4uXG4gICAgY29uc3Qgc2tpbGxDb250ZW50ID0gYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGlmIChza2lsbENvbnRlbnQudHJpbSgpKSB7XG4gICAgICBjb25zdCByZWJyYW5kZWQgPSByZWJyYW5kU2tpbGxOYW1lKHNraWxsQ29udGVudCwgJ1BpbmNoR3JhYicpO1xuICAgICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJywgZGF0YTogcmVicmFuZGVkfSk7XG4gICAgfVxuICAgIC8vIFJlYnVpbGQgdGhlIG1hbmlmZXN0IGxpbmUgaW4gdGhlIEpTT05MIHdpdGggYXJjaGl2ZUludGVncml0eVxuICAgIC8vIChmaWxlIGxpc3QgKyBzaXplcykuIEhhcyB0byBoYXBwZW4gQUZURVIgYWxsIHRhckVudHJpZXMgYXJlXG4gICAgLy8gYXNzZW1ibGVkIGJ1dCBCRUZPUkUgd2UgdGFyIHRoZW0sIHNvIHdlIGtub3cgd2hhdCdzIGluIHRoZVxuICAgIC8vIGJ1bmRsZS4gVGhlbiB3ZSByZXBsYWNlIHRoZSBKU09OTCdzIG1hbmlmZXN0IHdpdGggdGhlIGF1Z21lbnRlZFxuICAgIC8vIHZlcnNpb24uXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGludGVncml0eToge2ZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9Pn0gPSB7ZmlsZXM6IFtdfTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiB0YXJFbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShlLmRhdGEpIDogKGUuZGF0YSBhcyBVaW50OEFycmF5KTtcbiAgICAgICAgaW50ZWdyaXR5LmZpbGVzLnB1c2goe3BhdGg6IGUubmFtZSwgc2l6ZTogZGF0YS5sZW5ndGh9KTtcbiAgICAgIH1cbiAgICAgIC8vIFJlLWVtaXQgdGhlIEpTT05MIHdpdGggdGhlIGF1Z21lbnRlZCBtYW5pZmVzdC4gQ2hlYXBlciB0byBkb1xuICAgICAgLy8gdGhpcyByZS1yZW5kZXIgdGhhbiB0byBtYWludGFpbiBtdXRhYmxlIHN0YXRlIHRocm91Z2ggdGhlIHNsaW1cbiAgICAgIC8vIGVtaXQuIFdlIHN3YXAgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBpbi1wbGFjZS5cbiAgICAgIGNvbnN0IGF1Z21lbnRlZE1hbmlmZXN0ID0gey4uLm1hbmlmZXN0LCBhcmNoaXZlSW50ZWdyaXR5OiBpbnRlZ3JpdHl9O1xuICAgICAgY29uc3QgbGluZXMgPSBqc29ubFRleHQuc3BsaXQoJ1xcbicpO1xuICAgICAgbGluZXNbMF0gPSBKU09OLnN0cmluZ2lmeShhdWdtZW50ZWRNYW5pZmVzdCk7XG4gICAgICBjb25zdCBuZXdKc29ubCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgY29uc3QgaWR4ID0gdGFyRW50cmllcy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0ganNvbmxOYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkgdGFyRW50cmllc1tpZHhdID0ge25hbWU6IGpzb25sTmFtZSwgZGF0YTogbmV3SnNvbmx9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ2FyY2hpdmVJbnRlZ3JpdHkgY29tcHV0YXRpb24gZmFpbGVkJywgZXJyKTtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJCeXRlcyA9IGJ1aWxkVGFyKHRhckVudHJpZXMpO1xuICAgIGNvbnN0IGFyY2hpdmVCeXRlcyA9IHdyYXBac3RkKHRhckJ5dGVzKTtcblxuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIOKGkicsIHthcmNoaXZlTmFtZSwgdGFyQnl0ZXM6IHRhckJ5dGVzLmxlbmd0aCwgYXJjaGl2ZUJ5dGVzOiBhcmNoaXZlQnl0ZXMubGVuZ3RoLCBzY3JlZW5zaG90czogc2hvdEVudHJpZXMubGVuZ3RofSk7XG4gICAgICAvLyBQYXNzIGFzIGEgcGxhaW4gbnVtYmVyW10gb3ZlciBzZW5kTWVzc2FnZTsgc3RydWN0dXJlZC1jbG9uZSBvZlxuICAgICAgLy8gVWludDhBcnJheSB2aWEgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UgaXNuJ3QgcmVsaWFibGUgYWNyb3NzXG4gICAgICAvLyBDaHJvbWUgdmVyc2lvbnMuXG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2F2ZS1ieXRlcycsIHdvcmtzcGFjZTogYWN0aXZlV3MsIGZpbGVuYW1lOiBhcmNoaXZlTmFtZSxcbiAgICAgICAgYnl0ZXM6IEFycmF5LmZyb20oYXJjaGl2ZUJ5dGVzKSwgbWltZTogJ2FwcGxpY2F0aW9uL3pzdGQnLFxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdvbkV4cG9ydEFyY2hpdmUgcmVwbHk6JywgcmVwbHkpO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5hYnNQYXRoKSB7XG4gICAgICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IHJlcGx5LmZpbGVuYW1lID8/IG51bGw7XG4gICAgICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSByZXBseS5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gQm9vbGVhbihyZXBseS50ZW1wUGF0aCk7XG4gICAgICAgIGxhc3RFeHBvcnQua2luZCA9ICd0YXIuenN0JztcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgLy8gQXV0by1jb3B5IHRoZSBhYnNvbHV0ZSBwYXRoIHRvIGNsaXBib2FyZCBzbyB0aGUgdXNlciBkb2Vzbid0XG4gICAgICAgIC8vIGhhdmUgdG8gaHVudCBmb3IgaXQuIFRoZSB0b29sYmFyIGNvbGxhcHNlZCB0aGUgZGVkaWNhdGVkXG4gICAgICAgIC8vIFwiY29weSBwYXRoXCIgYnV0dG9uIGludG8gdGhpcyBzaW5nbGUgYWN0aW9uLlxuICAgICAgICBjb25zdCBwYXRoVG9Db3B5ID0gbGFzdEV4cG9ydC5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBjb25zdCBwYXRoQ29waWVkID0gYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KHBhdGhUb0NvcHkpO1xuICAgICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgICBpZiAocGF0aENvcGllZCkgc2hvd0NvcGllZCgnRXhwb3J0ZWQgYW5kIGNvcGllZCcsIGxlYWYpO1xuICAgICAgICBzZXRTdGF0dXMoXG4gICAgICAgICAgYEV4cG9ydGVkIMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCR7cGF0aENvcGllZCA/ICcgwrcgcGF0aCBjb3BpZWQnIDogJyd9JHtsYXN0RXhwb3J0LnRlbXBQYXRoID8gJyDCtyBQbGF5d3JpZ2h0IHRlbXAgaGlkZGVuJyA6ICcnfSDCtyAke2xlYWZ9YCxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdvbkV4cG9ydEFyY2hpdmUgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEFyY2hpdmUgZXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFRlc3QvZGV2IGZhbGxiYWNrOiBzeW50aGVzaXplIGEgZG93bmxvYWQgbGluay5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2FyY2hpdmVCeXRlcyBhcyB1bmtub3duIGFzIEJsb2JQYXJ0XSwge3R5cGU6ICdhcHBsaWNhdGlvbi96c3RkJ30pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBhcmNoaXZlTmFtZTsgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9ICd0YXIuenN0JztcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChhcmNoaXZlTmFtZSk7XG4gICAgc2hvd0NvcGllZCgnRXhwb3J0ZWQgYW5kIGNvcGllZCcsIGFyY2hpdmVOYW1lKTtcbiAgICBzZXRTdGF0dXMoYFdvcmtzcGFjZSBleHBvcnRlZCDCtyAke3Nob3RFbnRyaWVzLmxlbmd0aH0gc2NyZWVuc2hvdCR7c2hvdEVudHJpZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IGJ1bmRsZWQgwrcgcGF0aCBjb3BpZWRgKTtcbiAgfTtcblxuICAvLyBCZXN0LWVmZm9ydCBjbGlwYm9hcmQgd3JpdGUg4oCUIG5ldmVyIHRocm93czsgcmV0dXJucyB3aGV0aGVyIHRoZVxuICAvLyB3cml0ZSBzdWNjZWVkZWQgc28gdGhlIGNhbGxlciBjYW4gYWRqdXN0IHRoZSBzdGF0dXMgbWVzc2FnZS5cbiAgLy8gQ2xpcGJvYXJkIHdyaXRlcyBjYW4gZmFpbCB3aGVuIHRoZSBwYW5lbCBkb2Vzbid0IGhhdmUgZm9jdXMgb3IgaW5cbiAgLy8gc29tZSB0ZXN0IGhhcm5lc3NlcywgYW5kIHdlIGRvbid0IHdhbnQgdGhhdCB0byBibG9jayB0aGUgZXhwb3J0LlxuICBjb25zdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQgPSBhc3luYyAodGV4dDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgdHJ5IHsgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7IHJldHVybiB0cnVlOyB9XG4gICAgY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfTtcbiAgLy8g4pSA4pSA4pSAIER1Y2tEQiBzbmlwcGV0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDYW5vbmljYWwgU1FMIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIGEgSlNPTkwgZXhwb3J0LiBDb3BpZXMgdG8gY2xpcGJvYXJkXG4gIC8vIGFuZCBwcmludHMgYSBzdGF0dXMgbWVzc2FnZSDigJQgd2UgZG9uJ3QgcnVuIER1Y2tEQiBvdXJzZWx2ZXMsIHRoZSB1c2VyXG4gIC8vIHBpcGVzIHRoZSBzbmlwcGV0IGludG8gYGR1Y2tkYmAgb24gdGhlaXIgbWFjaGluZS4gVGhlIHJlY2lwZXMgdGFyZ2V0XG4gIC8vIHF1ZXN0aW9ucyBhIFVJLWVuZ2luZWVyIExMTSB3b3JrZmxvdyB0ZW5kcyB0byBhc2s6IGxpc3QgY2FwdHVyZXMgYnlcbiAgLy8gaG9zdCwgZmluZCBkdXBsaWNhdGUgb3V0ZXJIVE1MLCBmaW5kIGNhcHR1cmVzIG1pc3NpbmcgYSBzY3JlZW5zaG90LFxuICAvLyBhbmQgdW5pcXVlLXRva2VuIGZyZXF1ZW5jeSBmb3IgYSBxdWljayBkZXNpZ24tdG9rZW5zIG92ZXJ2aWV3LlxuICBjb25zdCBkdWNrRGJTbmlwcGV0ID0gKGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IGAtLSBQaW5jaEdyYWIg4oaSIER1Y2tEQiByZWNpcGVzXG4tLSBTYXZlIHlvdXIgSlNPTkwgZXhwb3J0LCB0aGVuIGluIHlvdXIgc2hlbGw6XG4tLSAgIGR1Y2tkYiA8IHRoaXNfZmlsZS5zcWxcbi0tIE9yIG9wZW4gYSBkdWNrZGIgc2hlbGwgYW5kIHBhc3RlIHRoZXNlIG9uZSBhdCBhIHRpbWUuXG5cbi0tIDEpIExvYWQgdGhlIEpTT05MIGludG8gYSB0YWJsZS5cbi0tICAgIHNhbXBsZV9zaXplPS0xIGZvcmNlcyBhIGZ1bGwtZmlsZSBzY2FuIGZvciBzY2hlbWEgaW5mZXJlbmNlLiBXaXRob3V0XG4tLSAgICBpdCwgRHVja0RCIG9ubHkgc25pZmZzIHRoZSBmaXJzdCAyMCA0ODAgcm93cyDigJQgYW5kIFBpbmNoR3JhYiBleHBvcnRzXG4tLSAgICBtaXggc2VsZWN0b3IgKyBmZWVkYmFjayByb3cgdHlwZXMsIHNvIHJhcmUgZmVlZGJhY2stb25seSBmaWVsZHNcbi0tICAgICh0YWdzLCBwYXJlbnRVaWQpIGNhbiBiZSBkcm9wcGVkIGZyb20gdGhlIGluZmVycmVkIHNjaGVtYSBpZiB0aGV5XG4tLSAgICBkb24ndCBhcHBlYXIgZWFybHkgZW5vdWdoLiBUaGF0IGJpdGVzIHJlY2lwZSA2IGJlbG93LlxuQ1JFQVRFIE9SIFJFUExBQ0UgVEFCTEUgcGcgQVNcblNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oXG4gICcke2pzb25sTmFtZX0nLFxuICBmb3JtYXQ9J25ld2xpbmVfZGVsaW1pdGVkJyxcbiAgbWF4aW11bV9vYmplY3Rfc2l6ZT0xMDQ4NTc2MDAsXG4gIHNhbXBsZV9zaXplPS0xXG4pO1xuXG4tLSAyKSBRdWljayBvdmVydmlldzogaG93IG1hbnkgY2FwdHVyZXMgcGVyIGhvc3QuXG5TRUxFQ1RcbiAgcmVnZXhwX2V4dHJhY3QodXJsLCAnOi8vKFteL10rKScsIDEpIEFTIGhvc3QsXG4gIENPVU5UKCopIEZJTFRFUiAoV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicpIEFTIGNhcHR1cmVzLFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnZmVlZGJhY2snKSBBUyBjb21tZW50c1xuRlJPTSBwZ1xuR1JPVVAgQlkgMVxuT1JERVIgQlkgY2FwdHVyZXMgREVTQztcblxuLS0gMykgRmluZCBkdXBsaWNhdGUgb3V0ZXJIVE1MIGFjcm9zcyBjYXB0dXJlcyAob2Z0ZW4gc2lnbmFscyBhIHJldXNlZFxuLS0gICAgY29tcG9uZW50IHRoZSB1c2VyIGhhcyBjbGlja2VkIGludG8gbXVsdGlwbGUgdGltZXMpLlxuU0VMRUNUIG91dGVySFRNTCwgQ09VTlQoKikgQVMgaGl0cywgbGlzdChzZWxlY3RvcikgQVMgc2VsZWN0b3JzXG5GUk9NIHBnXG5XSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgb3V0ZXJIVE1MIElTIE5PVCBOVUxMXG5HUk9VUCBCWSBvdXRlckhUTUxcbkhBVklORyBoaXRzID4gMVxuT1JERVIgQlkgaGl0cyBERVNDXG5MSU1JVCAyNTtcblxuLS0gNCkgQ2FwdHVyZXMgc3RpbGwgbWlzc2luZyBhIHNjcmVlbnNob3QgcGF0aC5cblNFTEVDVCBuLCB1cmwsIHNlbGVjdG9yXG5GUk9NIHBnXG5XSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgc2NyZWVuc2hvdCBJUyBOVUxMXG5PUkRFUiBCWSBuO1xuXG4tLSA1KSBRdWljayBkZXNpZ24tdG9rZW4gc3VyZmFjZTogcmFuayBjbGFzc2VzIHRoYXQgYXBwZWFyIGluIG1hbnkgY2FwdHVyZXMuXG4tLSAgICBOT1RFOiBmaWx0ZXIgY2xhc3NlcyBJUyBOT1QgTlVMTCByYXRoZXIgdGhhbiB1c2luZyBhIGNvYWxlc2NlLXdpdGgtZW1wdHlcbi0tICAgIGZhbGxiYWNrOyBEdWNrREIgY2Fubm90IGluZmVyIGVsZW1lbnQgdHlwZXMgZm9yIGFuIGVtcHR5IGxpc3QgbGl0ZXJhbC5cbldJVEggZXhwYW5kZWQgQVMgKFxuICBTRUxFQ1QgdW5uZXN0KGNsYXNzZXMpIEFTIGNcbiAgRlJPTSBwZ1xuICBXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgY2xhc3NlcyBJUyBOT1QgTlVMTFxuKVxuU0VMRUNUIGMsIENPVU5UKCopIEFTIGhpdHNcbkZST00gZXhwYW5kZWRcbkdST1VQIEJZIDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMzA7XG5cbi0tIDYpIENvbW1lbnRzIGpvaW5lZCB0byB0aGVpciBwYXJlbnQgc2VsZWN0b3IgdmlhIHBhcmVudFVpZC4gVGhlXG4tLSAgICBzLnR5cGUgZmlsdGVyIHByZXZlbnRzIGFuIGFjY2lkZW50YWwgZmVlZGJhY2vihpRmZWVkYmFjayBqb2luIGluIGNhc2Vcbi0tICAgIHR3byByb3dzIGV2ZXIgc2hhcmUgYSB1aWQgYnkgY29pbmNpZGVuY2UuXG5TRUxFQ1Qgcy5uLCBzLnNlbGVjdG9yLCBmLnRleHQsIGYudGFnc1xuRlJPTSBwZyBmXG5KT0lOIHBnIHNcbiAgT04gcy51aWQgPSBmLnBhcmVudFVpZFxuIEFORCBzLnR5cGUgPSAnc2VsZWN0b3InXG5XSEVSRSBmLnR5cGUgPSAnZmVlZGJhY2snXG5PUkRFUiBCWSBzLm47XG5gO1xuICBjb25zdCBvbkR1Y2tEYlNuaXBwZXQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgLy8gUHJlZmVyIHRoZSBKU09OTCBmaWxlbmFtZSBvZiB0aGUgbW9zdCByZWNlbnQgZXhwb3J0IHNvIHRoZSB1c2VyIGNhblxuICAgIC8vIHBhc3RlIHRoaXMgZGlyZWN0bHkgd2l0aG91dCBlZGl0aW5nIHRoZSByZWFkX2pzb25fYXV0byBwYXRoLiBGYWxsXG4gICAgLy8gYmFjayB0byBhIGZyZXNoIGVwb2NoLWJhc2VkIG5hbWUgaWYgbm90aGluZyBoYXMgYmVlbiBleHBvcnRlZCB5ZXQuXG4gICAgY29uc3QgbGFzdCA9IGxhc3RFeHBvcnQucmVsUGF0aDtcbiAgICBjb25zdCBqc29ubE5hbWUgPSAobGFzdCAmJiAvXFwuanNvbmwkLy50ZXN0KGxhc3QpKVxuICAgICAgPyBsYXN0LnNwbGl0KCcvJykucG9wKCkhICAvLyBzdHJpcCB3b3Jrc3BhY2UvZXhwb3J0cy8gcHJlZml4XG4gICAgICA6IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzcWwpO1xuICAgICAgc2V0U3RhdHVzKGBEdWNrREIgcmVjaXBlcyBjb3BpZWQgwrcgcGFzdGUgaW50byBcXGBkdWNrZGJcXGAgc2hlbGwgwrcgcmVmZXJlbmNlcyAke2pzb25sTmFtZX1gKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBEdWNrREIgU1FMJywganNvbmxOYW1lKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIGZhaWxlZCDigJQgb3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignQ2xpcGJvYXJkIGZhaWxlZCcsICdPcGVuIHRoZSBwYW5lbCBpbiBhbiBleHRlbnNpb24gY29udGV4dCcpO1xuICAgIH1cbiAgfTtcbiAgLy8g4pSA4pSA4pSAIFNjaGVtYSBtaWdyYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENvbnZlcnQgYSB2MS1zaGFwZWQgRW50cnktb3ItZXhwb3J0LWxpbmUgaW50byBvdXIgaW50ZXJuYWwgRW50cnkuIElkZW1wb3RlbnQuXG4gIC8vIFN1cHBvcnRzOlxuICAvLyAgIOKAoiBmbGF0IHYxIGVudHJ5IChubyBgX2F1ZGl0YCwgbm8gYHZgIGZpZWxkKVxuICAvLyAgIOKAoiB2MiBleHBvcnQgZW50cnkgKGhhcyBgX2F1ZGl0YCwgYHY6IDJgLCBgdHlwZTogJ3NlbGVjdG9yJ2ApXG4gIC8vICAg4oCiIG1peGVkIChzb21lIGZpZWxkcyBuZXN0ZWQsIHNvbWUgZmxhdCDigJQgbGFzdCB3aW5zIGZvciBzYWZldHkpXG4gIC8vIFB1cmU6IG5ldmVyIG11dGF0ZXMgYHJhd2Agb3IgYW55IG9mIGl0cyBuZXN0ZWQgb2JqZWN0cy4gUmV0dXJucyBhIG5ld1xuICAvLyBlbnRyeSB3aXRoIGFsbCBtaWdyYXRpb25zIGFwcGxpZWQuIFRvdWNoZWQgc3Vib2JqZWN0cyAoYXR0cnMsIGhpbnRzLFxuICAvLyBncm91cCBtZW1iZXJzKSBhcmUgY2xvbmVkIGJlZm9yZSBlZGl0OyB1bnRvdWNoZWQgb25lcyBzaGFyZSByZWZzIHdpdGhcbiAgLy8gcmF3LCB3aGljaCBpcyBmaW5lIHNpbmNlIHdlIG5ldmVyIHdyaXRlIHRvIHRoZW0uXG4gIGNvbnN0IGRlbm9ybWFsaXplRW50cnkgPSAocmF3OiBhbnkpOiBFbnRyeSA9PiB7XG4gICAgY29uc3Qgb3V0OiBhbnkgPSB7Li4ucmF3fTtcbiAgICBkZWxldGUgb3V0LnY7XG4gICAgZGVsZXRlIG91dC50eXBlO1xuICAgIGRlbGV0ZSBvdXQuZmVlZGJhY2s7XG4gICAgaWYgKG91dC5fYXVkaXQgJiYgdHlwZW9mIG91dC5fYXVkaXQgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBhID0gb3V0Ll9hdWRpdDtcbiAgICAgIGlmIChhLmFuY2VzdG9ycyAhPT0gdW5kZWZpbmVkKSBvdXQuYW5jZXN0b3JzID0gYS5hbmNlc3RvcnM7XG4gICAgICBpZiAoYS5jb21wb25lbnRSb290ICE9PSB1bmRlZmluZWQpIG91dC5jb21wb25lbnRSb290ID0gYS5jb21wb25lbnRSb290O1xuICAgICAgaWYgKGEuaW5TaGFkb3dET00gIT09IHVuZGVmaW5lZCkgb3V0LmluU2hhZG93RE9NID0gYS5pblNoYWRvd0RPTTtcbiAgICAgIGlmIChhLnBzZXVkb0VsZW1lbnRzICE9PSB1bmRlZmluZWQpIG91dC5wc2V1ZG9FbGVtZW50cyA9IGEucHNldWRvRWxlbWVudHM7XG4gICAgICBpZiAoYS5tYXRjaGVkUnVsZXMgIT09IHVuZGVmaW5lZCkgb3V0Lm1hdGNoZWRSdWxlcyA9IGEubWF0Y2hlZFJ1bGVzO1xuICAgICAgaWYgKGEudmlld3BvcnQgIT09IHVuZGVmaW5lZCkgb3V0LnZpZXdwb3J0ID0gYS52aWV3cG9ydDtcbiAgICAgIGRlbGV0ZSBvdXQuX2F1ZGl0O1xuICAgIH1cbiAgICAvLyBzdGF0ZXM6IHYxIHVzZWQgUmVjb3JkPHN0cmluZywgdHJ1ZT47IHYyIHVzZXMgc3RyaW5nW10uIE5vcm1hbGl6ZSBib3RoLlxuICAgIGlmIChvdXQuc3RhdGVzICYmICFBcnJheS5pc0FycmF5KG91dC5zdGF0ZXMpICYmIHR5cGVvZiBvdXQuc3RhdGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgb3V0LnN0YXRlcyA9IE9iamVjdC5rZXlzKG91dC5zdGF0ZXMpLmZpbHRlcigoaykgPT4gQm9vbGVhbigob3V0LnN0YXRlcyBhcyBhbnkpW2tdKSk7XG4gICAgfVxuICAgIC8vIGF0dHJzLmZvcm1hdCDihpIgaGludHMuZm9ybWF0LiBDbG9uZSBhdHRycyBmaXJzdCBzbyB3ZSBkb24ndCBtdXRhdGUgdGhlXG4gICAgLy8gY2FsbGVyJ3MgbmVzdGVkIG9iamVjdC4gU2FtZSBmb3IgaGludHMgKHdlIG1heSBtZXJnZSBpbnRvIGl0KS5cbiAgICBpZiAob3V0LmF0dHJzICYmIHR5cGVvZiBvdXQuYXR0cnMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBvdXQuYXR0cnMuZm9ybWF0ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgZm10ID0gb3V0LmF0dHJzLmZvcm1hdDtcbiAgICAgIGNvbnN0IHtmb3JtYXQ6IF9kcm9wLCAuLi5yZXN0QXR0cnN9ID0gb3V0LmF0dHJzO1xuICAgICAgb3V0LmF0dHJzID0gcmVzdEF0dHJzO1xuICAgICAgb3V0LmhpbnRzID0gey4uLihvdXQuaGludHMgPz8ge30pLCBmb3JtYXQ6IGZtdH07XG4gICAgfVxuICAgIGlmICghb3V0LnVpZCkgb3V0LnVpZCA9IG1zZ0lkKCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob3V0Lmdyb3VwKSkgb3V0Lmdyb3VwID0gb3V0Lmdyb3VwLm1hcChkZW5vcm1hbGl6ZUVudHJ5KTtcbiAgICByZXR1cm4gb3V0IGFzIEVudHJ5O1xuICB9O1xuICAvLyBXYWxrIGFsbCBsb2FkZWQgbWVzc2FnZXMgYW5kIG1pZ3JhdGUgYW55IGxlZ2FjeSBlbnRyaWVzLiBSZXR1cm5zIHRydWUgaWZcbiAgLy8gYW55dGhpbmcgbXV0YXRlZCBzbyB0aGUgY2FsbGVyIGNhbiBwZXJzaXN0LlxuICBjb25zdCBtaWdyYXRlTG9hZGVkTWVzc2FnZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgbGV0IG11dGF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgYmVmb3JlID0gbS5lbnRyeTtcbiAgICAgIC8vIENoZWFwIHByZS1jaGVjazogaWYgdWlkIGV4aXN0cyBBTkQgc3RhdGVzIGlzIGFuIGFycmF5IEFORCBubyBfYXVkaXRcbiAgICAgIC8vIEFORCBubyBhdHRycy5mb3JtYXQg4oaSIG5vdGhpbmcgdG8gZG8sIHNraXAgdGhlIHdvcmsuXG4gICAgICBjb25zdCBuZWVkc1dvcmsgPVxuICAgICAgICAhYmVmb3JlLnVpZCB8fFxuICAgICAgICAoYmVmb3JlLnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShiZWZvcmUuc3RhdGVzKSkgfHxcbiAgICAgICAgKGJlZm9yZSBhcyBhbnkpLl9hdWRpdCAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIChiZWZvcmUuYXR0cnMgJiYgdHlwZW9mIChiZWZvcmUuYXR0cnMgYXMgYW55KS5mb3JtYXQgPT09ICdzdHJpbmcnKTtcbiAgICAgIGlmICghbmVlZHNXb3JrKSBjb250aW51ZTtcbiAgICAgIG0uZW50cnkgPSBkZW5vcm1hbGl6ZUVudHJ5KGJlZm9yZSk7XG4gICAgICBtdXRhdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG11dGF0ZWQ7XG4gIH07XG4gIGNvbnN0IG9uSW1wb3J0ID0gKCk6IHZvaWQgPT4gaW1wb3J0RmlsZS5jbGljaygpO1xuICBpbXBvcnRGaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5maWxlcz8uWzBdO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgIGNvbnN0IGltcG9ydGVkOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiB0ZXh0LnNwbGl0KC9cXHI/XFxuLykpIHtcbiAgICAgIGlmICghbGluZS50cmltKCkpIGNvbnRpbnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbyA9IEpTT04ucGFyc2UobGluZSk7XG4gICAgICAgIGlmIChvLnR5cGUgPT09ICdtYW5pZmVzdCcpIHtcbiAgICAgICAgICAvLyBNYW5pZmVzdCBsaW5lIOKAlCBpbmZvcm1hdGlvbmFsIG9ubHkgb24gaW1wb3J0LiBTa2lwLlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvLnR5cGUgPT09ICdwYWdlJykgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3BhZ2UnLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB1cmw6IG8udXJsLCB0aXRsZTogby50aXRsZSwgdmlld3BvcnQ6IG8udmlld3BvcnQsIHRva2Vuczogby50b2tlbnMsIHVzZXJBZ2VudDogby51c2VyQWdlbnQsIGxhbmc6IG8ubGFuZ30pO1xuICAgICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksXG4gICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQ6IG8udGV4dCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChvLnBhcmVudFVpZCkgZmIucGFyZW50VWlkID0gby5wYXJlbnRVaWQ7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoby50YWdzKSAmJiBvLnRhZ3MubGVuZ3RoKSBmYi50YWdzID0gby50YWdzO1xuICAgICAgICAgIGlmIChvLnNldmVyaXR5KSBmYi5zZXZlcml0eSA9IG8uc2V2ZXJpdHk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaChmYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc2VsZWN0b3IgbGluZSDigJQgY291bGQgYmUgdjEgKGZsYXQpIG9yIHYyICh3aXRoIF9hdWRpdCkuIFRoZVxuICAgICAgICAgIC8vIGJ1bmRsZWQgZmVlZGJhY2sgYXJyYXkgbXVzdCBiZSBzcGxpdCBvdXQgaW50byBzZXBhcmF0ZSBmZWVkYmFja1xuICAgICAgICAgIC8vIG1lc3NhZ2VzIGZvciByb3VuZC10cmlwIHdpdGggdjEgcmVhZGVycyDigJQgYnV0IGluIHYyIHdlIGFscmVhZHlcbiAgICAgICAgICAvLyBlbWl0IHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZXMsIHNvIGRyb3BwaW5nIHRoZSBidW5kbGVkIGxpc3QgaXNcbiAgICAgICAgICAvLyBzYWZlIHRvIGF2b2lkIGRvdWJsZS1jb3VudGluZy5cbiAgICAgICAgICBjb25zdCBmYiA9IEFycmF5LmlzQXJyYXkoby5mZWVkYmFjaykgPyBvLmZlZWRiYWNrIDogbnVsbDtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGRlbm9ybWFsaXplRW50cnkobyk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnl9KTtcbiAgICAgICAgICAvLyBPbmx5IGluZmxhdGUgYnVuZGxlZCBmZWVkYmFjayBpZiB0aGUgZmlsZSBpcyB2MSAobm8gdmVyc2lvblxuICAgICAgICAgIC8vIG1hcmtlciBvbiB0aGUgc2VsZWN0b3IgbGluZXMpLiB2MiBoYXMgaXRzIG93biBzdGFuZGFsb25lXG4gICAgICAgICAgLy8gZmVlZGJhY2sgbGluZXMgdGhhdCBhcnJpdmUgc2VwYXJhdGVseS5cbiAgICAgICAgICBpZiAoZmIgJiYgby52ICE9PSAyKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZmIpIGltcG9ydGVkLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICB0ZXh0OiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgPyB0IDogdD8udGV4dCA/PyAnJyxcbiAgICAgICAgICAgICAgcGFyZW50VWlkOiBlbnRyeS51aWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggeyAvKiBza2lwIGJhZCBsaW5lICovIH1cbiAgICB9XG4gICAgbWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIC4uLmltcG9ydGVkXTtcbiAgICBwZXJzaXN0KCk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cyhgSW1wb3J0ZWQgJHtpbXBvcnRlZC5sZW5ndGh9IG1lc3NhZ2Uke2ltcG9ydGVkLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgIGltcG9ydEZpbGUudmFsdWUgPSAnJztcbiAgfSk7XG4gIC8vIOKUgOKUgOKUgCBXb3Jrc3BhY2Ugc25hcHNob3QgaGlzdG9yeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUGVyc2lzdGVudCAobm90IHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2spLiBBIENsZWFyLWFsbCBhcmNoaXZlcyB0aGVcbiAgLy8gY3VycmVudCB3b3Jrc3BhY2Ugc3RhdGUgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGZyb20gU2V0dGluZ3MgbGF0ZXIuXG4gIGxldCB3c1NuYXBzaG90czogV29ya3NwYWNlU25hcHNob3RbXSA9IFtdO1xuICBjb25zdCBsb2FkV3NTbmFwc2hvdHMgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVNuYXBzaG90W10+KHdzU25hcHNob3RzS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V3NTbmFwc2hvdHMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KHdzU25hcHNob3RzS2V5KGFjdGl2ZVdzKSwgd3NTbmFwc2hvdHMpOyB9O1xuICAvLyBBcmNoaXZlIHRoZSBDVVJSRU5UIHdvcmtzcGFjZSBzdGF0ZSAoYmVmb3JlIGl0J3Mgd2lwZWQpLiBOby1vcCBpZiBlbXB0eS5cbiAgY29uc3QgYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90ID0gKCk6IFdvcmtzcGFjZVNuYXBzaG90IHwgbnVsbCA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHNuYXA6IFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgICAgaWQ6IHNlY3VyZVRva2VuKDgpLFxuICAgICAgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIG1lc3NhZ2VzOiBzdHJ1Y3R1cmVkQ2xvbmUobWVzc2FnZXMpLFxuICAgICAgc2hvdHM6IE9iamVjdC5mcm9tRW50cmllcyhzaG90cyksXG4gICAgICBzZWxlY3RvcnM6IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5sZW5ndGgsXG4gICAgICBjb21tZW50czogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpLmxlbmd0aCxcbiAgICB9O1xuICAgIC8vIE5ld2VzdCBmaXJzdDsgY2FwIHRoZSBoaXN0b3J5LlxuICAgIHdzU25hcHNob3RzLnVuc2hpZnQoc25hcCk7XG4gICAgaWYgKHdzU25hcHNob3RzLmxlbmd0aCA+IFdTX1NOQVBTSE9UX0NBUCkgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5zbGljZSgwLCBXU19TTkFQU0hPVF9DQVApO1xuICAgIHBlcnNpc3RXc1NuYXBzaG90cygpO1xuICAgIHJldHVybiBzbmFwO1xuICB9O1xuICBjb25zdCByZXN0b3JlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHNuYXAgPSB3c1NuYXBzaG90cy5maW5kKChzKSA9PiBzLmlkID09PSBpZCk7XG4gICAgaWYgKCFzbmFwKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gUHVzaCB0aGUgbGl2ZSBzdGF0ZSBvbnRvIHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2sgc28gYSBtaXN0YWtlblxuICAgIC8vIHJlc3RvcmUgaXMgaXRzZWxmIHVuZG9hYmxlLlxuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBzdHJ1Y3R1cmVkQ2xvbmUoc25hcC5tZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzbmFwLnNob3RzKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgc2V0U3RhdHVzKGBSZXN0b3JlZCBzbmFwc2hvdCDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWxlY3RvcnNgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgZGVsZXRlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHdzU25hcHNob3RzID0gd3NTbmFwc2hvdHMuZmlsdGVyKChzKSA9PiBzLmlkICE9PSBpZCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICB9O1xuXG4gIGNvbnN0IG9uQ2xlYXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb25maXJtKCdDbGVhciBhbGwgY2FwdHVyZXMgYW5kIGNvbW1lbnRzPycpKSByZXR1cm47XG4gICAgLy8gQXJjaGl2ZSB0aGUgd29ya3NwYWNlIEJFRk9SRSB3aXBpbmcgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGxhdGVyLlxuICAgIGFyY2hpdmVXb3Jrc3BhY2VTbmFwc2hvdCgpO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBbXTtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgc2V0U3RhdHVzKCdDbGVhcmVkIMK3IHNuYXBzaG90IHNhdmVkJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFZhbGlkYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJ1blZhbGlkYXRpb24gPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgc2VsZWN0b3JzID0gWy4uLm5ldyBTZXQobWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpKV07XG4gICAgaWYgKCFzZWxlY3RvcnMubGVuZ3RoIHx8ICFpbkV4dGVuc2lvbikgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgaWYgKCF0YWJzWzBdKSByZXR1cm47XG4gICAgICBsaXZlVGFiVXJsID0gdGFic1swXS51cmwgPz8gbGl2ZVRhYlVybDtcbiAgICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKGxpdmVUYWJVcmwgPz8gJycpO1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkISwgcGcoe2tpbmQ6ICd2YWxpZGF0ZScsIHNlbGVjdG9yc30pKSBhcyB7dmFsaWQ/OiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPn07XG4gICAgICBpZiAocmVwbHk/LnZhbGlkKSB7XG4gICAgICAgIGZvciAoY29uc3QgW3NlbCwgb2tdIG9mIE9iamVjdC5lbnRyaWVzKHJlcGx5LnZhbGlkKSkge1xuICAgICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICAgIGlmICghb2spIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsICdObyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcyB0aGlzIHNlbGVjdG9yLicpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiB0YWIgbm90IHJlYWR5ICovIH1cbiAgfTtcbiAgY29uc3Qgb25WYWxpZGF0ZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBzZXRTdGF0dXMoJ1JlLWNoZWNraW5n4oCmJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgIGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICBzZXRTdGF0dXMoJ1ZhbGlkYXRlZCcpO1xuICB9O1xuXG4gIC8vIChTY3JlZW5zaG90IG1hY2hpbmVyeSByZW1vdmVkIGFsb25nc2lkZSB0aGUgLnByZXZpZXcgdGlsZS4pXG5cbiAgLy8g4pSA4pSA4pSAIEdpdEh1YiBzdGFycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgZmV0Y2hTdGFycyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBjYWNoZUtleSA9ICdwaW5jaGdyYWIuZ2guc3RhcnMnO1xuICAgIGNvbnN0IGNhY2hlZCA9IGF3YWl0IFN0b3JlLmdldDx7Y291bnQ6IG51bWJlcjsgdHM6IG51bWJlcn0gfCBudWxsPihjYWNoZUtleSwgbnVsbCk7XG4gICAgaWYgKGNhY2hlZCAmJiBEYXRlLm5vdygpIC0gY2FjaGVkLnRzIDwgM182MDBfMDAwKSB7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNhY2hlZC5jb3VudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mvd3Jhbm5nbGUvcGluY2hncmFiJywge2NhY2hlOiAnbm8tc3RvcmUnfSk7XG4gICAgICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcignc3RhdHVzICcgKyByLnN0YXR1cyk7XG4gICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCkgYXMge3N0YXJnYXplcnNfY291bnQ/OiBudW1iZXJ9O1xuICAgICAgY29uc3QgY291bnQgPSBqLnN0YXJnYXplcnNfY291bnQgPz8gMDtcbiAgICAgIHN0YXJzRWwudGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnQpO1xuICAgICAgdm9pZCBTdG9yZS5zZXQoY2FjaGVLZXksIHtjb3VudCwgdHM6IERhdGUubm93KCl9KTtcbiAgICB9IGNhdGNoIHsgc3RhcnNFbC50ZXh0Q29udGVudCA9ICfCtyc7IH1cbiAgfTtcbiAgY29uc3Qgb25HaXRodWIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS93cmFubmdsZS9waW5jaGdyYWInO1xuICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnRhYnMuY3JlYXRlKHt1cmx9KTtcbiAgICBlbHNlIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICdub29wZW5lcicpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBzbWFsbCBkb2N1bWVudCBzdW1tYXJpZXMuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBtYXJrZG93bk92ZXJ2aWV3ID0gKGNvbnRlbnQ6IHN0cmluZywga2luZDogTWRLaW5kLCB1c2luZ1RlbXBsYXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQudHJpbSgpID8gY29udGVudC5zcGxpdCgnXFxuJykubGVuZ3RoIDogMDtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFtjb250ZW50XSkuc2l6ZTtcbiAgICBjb25zdCBoZWFkaW5ncyA9IGNvbnRlbnRcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5tYXAoKGxpbmUpID0+IC9eI3sxLDN9XFxzKyguKykkLy5leGVjKGxpbmUudHJpbSgpKT8uWzFdPy50cmltKCkpXG4gICAgICAuZmlsdGVyKChoZWFkaW5nKTogaGVhZGluZyBpcyBzdHJpbmcgPT4gQm9vbGVhbihoZWFkaW5nKSlcbiAgICAgIC5zbGljZSgwLCA0KTtcbiAgICAvLyBXYXJtLCBwbGFpbi1sYW5ndWFnZSBmcmFtaW5nIG9mIHdoYXQgZWFjaCBmaWxlIHRlYWNoZXMgdGhlIGFnZW50LlxuICAgIC8vIERFU0lHTi5tZCBpcyB0aGUgaGVhZGxpbmUgYXJ0aWZhY3Q6IGl0J3Mgd2hlcmUgeW91IGRlc2NyaWJlIHlvdXIgb3duXG4gICAgLy8gYnJhbmQgYW5kIFVJIHRhc3RlIHNvIHRoZSBhZ2VudCBidWlsZHMgaW4gKnlvdXIqIHZvaWNlIHJhdGhlciB0aGFuIGFcbiAgICAvLyBnZW5lcmljIGRlZmF1bHQuIFNLSUxMLm1kIGlzIHRoZSBhZHZhbmNlZCB0cmlhZ2UgZ3VpZGUgZm9yIHJlYWRpbmdcbiAgICAvLyBleHBvcnRzIOKAlCB1c2VmdWwsIGJ1dCBub3Qgd2hlcmUgbW9zdCBwZW9wbGUgc2hvdWxkIHN0YXJ0LlxuICAgIGNvbnN0IGxhYmVsID0ga2luZCA9PT0gJ2Rlc2lnbidcbiAgICAgID8gJ1RlYWNoZXMgeW91ciBhZ2VudCB0byBidWlsZCBVSSBpbiB5b3VyIGJyYW5kJ1xuICAgICAgOiAnQWR2YW5jZWQ6IGhvdyB5b3VyIGFnZW50IHNob3VsZCByZWFkIFBpbmNoR3JhYiBleHBvcnRzJztcbiAgICBjb25zdCBzb3VyY2UgPSB1c2luZ1RlbXBsYXRlXG4gICAgICA/IChraW5kID09PSAnZGVzaWduJyA/ICdTdGFydGVyIHRlbXBsYXRlIOKAlCBtYWtlIGl0IHlvdXJzJyA6ICdCdW5kbGVkIHRlbXBsYXRlJylcbiAgICAgIDogJ0N1c3RvbWl6ZWQnO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gaGVhZGluZ3MubGVuZ3RoID8gaGVhZGluZ3Muam9pbignIC8gJykgOiAnTm8gc2VjdGlvbiBoZWFkaW5ncyBmb3VuZCc7XG4gICAgcmV0dXJuIGAke2xhYmVsfVxcbiR7c291cmNlfSDCtyAke2xpbmVzLnRvTG9jYWxlU3RyaW5nKCl9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JcXG5TZWN0aW9uczogJHtzZWN0aW9uc31gO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1kUHJldmlldyA9IGFzeW5jIChraW5kOiAnZGVzaWduJyB8ICdza2lsbCcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwcmV2aWV3RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtbWQtcHJldmlldz1cIiR7a2luZH1cIl1gKTtcbiAgICBpZiAoIXByZXZpZXdFbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBraW5kID09PSAnZGVzaWduJyA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGtpbmQgPT09ICdkZXNpZ24nID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHByZXZpZXdFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcoY29udGVudCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk1kTW9kYWwgPSBhc3luYyAoa2luZDogTWRLaW5kKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgICBjb25zdCB0aXRsZUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGl0bGVdJykhO1xuICAgIGNvbnN0IHRhRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRleHRhcmVhXScpITtcbiAgICBjb25zdCBzdGF0c0VsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3RhdHNdJykhO1xuICAgIGNvbnN0IGJhbm5lckVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtYmFubmVyXScpITtcbiAgICBjb25zdCBzdW1tYXJ5RWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdW1tYXJ5XScpITtcbiAgICBjb25zdCBzYXZlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc2F2ZV0nKSE7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1yZXNldF0nKSE7XG4gICAgY29uc3QgdXBsb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdXBsb2FkXScpITtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWRvd25sb2FkXScpITtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWNsb3NlXScpITtcblxuICAgIGNvbnN0IGlzRGVzaWduID0ga2luZCA9PT0gJ2Rlc2lnbic7XG4gICAgY29uc3QgaW5pdGlhbCA9IGlzRGVzaWduID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0gaXNEZXNpZ24gPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGlzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnUGluY2hHcmFiIFNLSUxMLm1kJztcbiAgICB0YUVsLnZhbHVlID0gaW5pdGlhbDtcbiAgICBvdmVybGF5LmRhdGFzZXQua2luZCA9IGtpbmQ7XG5cbiAgICBjb25zdCByZWZyZXNoU3RhdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICBzdGF0c0VsLnRleHRDb250ZW50ID0gYCR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgICAgc3VtbWFyeUVsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyh0ZXh0LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmIV0gPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHQuZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSAodCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIH1cbiAgfSk7XG4gIC8vIFRleHRhcmVhIGlucHV0cyBhbHNvIGZpcmUgYGlucHV0YCBldmVudHMgYXMgdGhlIHVzZXIgdHlwZXMg4oCUIHdlIHdhbnQgdG9cbiAgLy8gc2F2ZSB0aG9zZSBpbmNyZW1lbnRhbGx5IHNvIGEgcGFuZWwgcmVsb2FkIGRvZXNuJ3QgbG9zZSBoYWxmLXR5cGVkXG4gIC8vIGVudHJpZXMuIGBjaGFuZ2VgIG9ubHkgZmlyZXMgb24gYmx1ciBmb3IgdGV4dGFyZWFzLlxuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICBpZiAodD8uZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSB0LnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb3BlbkRyYXdlciA9ICgpOiB2b2lkID0+IHsgZHJhd2VyLmhpZGRlbiA9IGZhbHNlOyByZW5kZXJXc0NvbnRyb2xzKCk7IH07XG4gIGNvbnN0IGNsb3NlRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gdHJ1ZTsgfTtcblxuICAvLyBSZXVzYWJsZSBjcmVhdGUtd29ya3NwYWNlIGZsb3c6IHZhbGlkYXRlcyB1bmlxdWVuZXNzLCBwZXJzaXN0cywgc3dpdGNoZXMuXG4gIC8vIFNoYXJlZCBieSB0aGUgc2V0dGluZ3MgQ3JlYXRlIGJ1dHRvbiBhbmQgdGhlIGhlYWRlciBkcm9wZG93bidzXG4gIC8vIFwiKyBOZXcgd29ya3NwYWNlXCIgYWN0aW9uIHNvIGJvdGggcGF0aHMgYmVoYXZlIGlkZW50aWNhbGx5LlxuICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VGbG93ID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBuYW1lLnRyaW0oKTtcbiAgICBpZiAoIXRyaW1tZWQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAod29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IHRyaW1tZWQpKSB7XG4gICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgZXhpc3RzJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IHRyaW1tZWQsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7XG4gICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKHRyaW1tZWQpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICBzZXRTdGF0dXMoYENyZWF0ZWQgd29ya3NwYWNlIFwiJHt0cmltbWVkfVwiYCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyV3NDb250cm9scyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXdzU2VsZWN0KSByZXR1cm47XG4gICAgd3NTZWxlY3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gdy5uYW1lO1xuICAgICAgb3B0LnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIG9wdC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB3c1NlbGVjdC5hcHBlbmQob3B0KTtcbiAgICB9XG4gICAgLy8gSW5saW5lIFwiKyBOZXcgd29ya3NwYWNlXCIgYWN0aW9uIHNvIHVzZXJzIGNhbiBzcGluIHVwIGEgd29ya3NwYWNlXG4gICAgLy8gc3RyYWlnaHQgZnJvbSB0aGUgaGVhZGVyIHN3aXRjaGVyIHdpdGhvdXQgb3BlbmluZyBzZXR0aW5ncy4gSGFuZGxlZFxuICAgIC8vIGFzIGEgc2VudGluZWwgdmFsdWUgaW4gdGhlIGNoYW5nZSBsaXN0ZW5lciBiZWxvdy5cbiAgICBjb25zdCBuZXdPcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBuZXdPcHQudmFsdWUgPSAnX19uZXdfd29ya3NwYWNlX18nO1xuICAgIG5ld09wdC50ZXh0Q29udGVudCA9ICcrIE5ldyB3b3Jrc3BhY2UnO1xuICAgIHdzU2VsZWN0LmFwcGVuZChuZXdPcHQpO1xuICAgIGlmICghd3NMaXN0KSByZXR1cm47XG4gICAgd3NMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGZvciAoY29uc3QgdyBvZiB3b3Jrc3BhY2VzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5kYXRhc2V0LnRpcCA9IHcubmFtZSA9PT0gYWN0aXZlV3NcbiAgICAgICAgPyBgQWN0aXZlIHdvcmtzcGFjZTogJHt3Lm5hbWV9YFxuICAgICAgICA6IGBTd2l0Y2ggdG8gd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCJgO1xuICAgICAgLy8gV2hvbGUgcm93IGlzIHRoZSBzd2l0Y2ggdHJpZ2dlciDigJQgbm8gZGVkaWNhdGVkIGNoZWNrIGJ1dHRvbi5cbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgLy8gSWdub3JlIGNsaWNrcyBvbiBpbm5lciBjb250cm9scyAodGhlIGRlbGV0ZSBidXR0b24gYmVsb3cpLlxuICAgICAgICBpZiAoKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdidXR0b24nKSkgcmV0dXJuO1xuICAgICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgcmV0dXJuO1xuICAgICAgICBhd2FpdCBsb2FkV29ya3NwYWNlKHcubmFtZSk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbmFtZS5jbGFzc05hbWUgPSAnd3MtbmFtZSc7XG4gICAgICBuYW1lLnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgbGkuYXBwZW5kKG5hbWUpO1xuICAgICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG1ldGEuY2xhc3NOYW1lID0gJ3dzLW1ldGEnO1xuICAgICAgbWV0YS50ZXh0Q29udGVudCA9IG5ldyBEYXRlKHcuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgIGxpLmFwcGVuZChtZXRhKTtcbiAgICAgIGlmICh3b3Jrc3BhY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgZGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGRlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyJztcbiAgICAgICAgZGVsLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSB0aGlzIHdvcmtzcGFjZSBhbmQgZXZlcnl0aGluZyBpbiBpdCc7XG4gICAgICAgIGRlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBgRGVsZXRlIHdvcmtzcGFjZSAke3cubmFtZX1gKTtcbiAgICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICAgICAgZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGlmICghY29uZmlybShgRGVsZXRlIHdvcmtzcGFjZSBcIiR7dy5uYW1lfVwiIGFuZCBhbGwgaXRzIGNhcHR1cmVzP2ApKSByZXR1cm47XG4gICAgICAgICAgd29ya3NwYWNlcyA9IHdvcmtzcGFjZXMuZmlsdGVyKCh4KSA9PiB4Lm5hbWUgIT09IHcubmFtZSk7XG4gICAgICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICAgICAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShbd3NNc2dLZXkody5uYW1lKSwgd3NTaG90c0tleSh3Lm5hbWUpLCB3c1Nob3RzRnVsbEtleSh3Lm5hbWUpLCB3c1NuYXBzaG90c0tleSh3Lm5hbWUpXSkuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICAgICAgaWYgKGFjdGl2ZVdzID09PSB3Lm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod29ya3NwYWNlc1swXSEubmFtZSk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIH1cbiAgICAgIHdzTGlzdC5hcHBlbmQobGkpO1xuICAgIH1cbiAgICByZW5kZXJXc1NuYXBzaG90SGlzdG9yeSgpO1xuICB9O1xuXG4gIC8vIFJlbmRlciB0aGUgYWN0aXZlIHdvcmtzcGFjZSdzIHNuYXBzaG90IGhpc3RvcnkgKENsZWFyLWFsbCBhcmNoaXZlcykgd2l0aFxuICAvLyBhIFJlc3RvcmUgYWN0aW9uLiBBcHBlbmRlZCB1bmRlciB0aGUgd29ya3NwYWNlIGxpc3QgaW4gU2V0dGluZ3MuXG4gIGNvbnN0IHJlbmRlcldzU25hcHNob3RIaXN0b3J5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtd3Mtc25hcHNob3RzXScpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuO1xuICAgIGhvc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgaWYgKCF3c1NuYXBzaG90cy5sZW5ndGgpIHtcbiAgICAgIGhvc3QuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaG9zdC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnd3Mtc25hcC1oZWFkJztcbiAgICBoZWFkLnRleHRDb250ZW50ID0gYFNuYXBzaG90IGhpc3RvcnkgwrcgJHt3c1NuYXBzaG90cy5sZW5ndGh9YDtcbiAgICBoZWFkLmRhdGFzZXQudGlwID0gJ1Jlc3RvcmFibGUgc25hcHNob3RzIHNhdmVkIGJlZm9yZSBlYWNoIENsZWFyLWFsbCc7XG4gICAgaG9zdC5hcHBlbmQoaGVhZCk7XG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHVsLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWxpc3QnO1xuICAgIGZvciAoY29uc3Qgc25hcCBvZiB3c1NuYXBzaG90cykge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG1ldGEuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gYCR7bmV3IERhdGUoc25hcC50cykudG9Mb2NhbGVTdHJpbmcoKX0gwrcgJHtzbmFwLnNlbGVjdG9yc30gc2VsIMK3ICR7c25hcC5jb21tZW50c30gY210YDtcbiAgICAgIGxpLmFwcGVuZChtZXRhKTtcbiAgICAgIGNvbnN0IHJlc3RvcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIHJlc3RvcmUudHlwZSA9ICdidXR0b24nO1xuICAgICAgcmVzdG9yZS5jbGFzc05hbWUgPSAnd3Mtc25hcC1yZXN0b3JlJztcbiAgICAgIHJlc3RvcmUudGV4dENvbnRlbnQgPSAnUmVzdG9yZSc7XG4gICAgICByZXN0b3JlLmRhdGFzZXQudGlwID0gJ1Jlc3RvcmUgdGhpcyBzbmFwc2hvdCBpbnRvIHRoZSBjdXJyZW50IHdvcmtzcGFjZSAoY3VycmVudCBzdGF0ZSBpcyBrZXB0IG9uIHRoZSB1bmRvIHN0YWNrKSc7XG4gICAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCAmJiAhY29uZmlybSgnUmVzdG9yZSB0aGlzIHNuYXBzaG90PyBUaGUgY3VycmVudCBjYXB0dXJlcyB3aWxsIGJlIHJlcGxhY2VkICh1bmRvYWJsZSkuJykpIHJldHVybjtcbiAgICAgICAgcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQocmVzdG9yZSk7XG4gICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGRlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgICBkZWwuY2xhc3NOYW1lID0gJ2RhbmdlciB3cy1zbmFwLWRlbCc7XG4gICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgc25hcHNob3QnO1xuICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdEZWxldGUgc25hcHNob3QnKTtcbiAgICAgIGRlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMik7XG4gICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBkZWxldGVXb3Jrc3BhY2VTbmFwc2hvdChzbmFwLmlkKTtcbiAgICAgIH0pO1xuICAgICAgbGkuYXBwZW5kKGRlbCk7XG4gICAgICB1bC5hcHBlbmQobGkpO1xuICAgIH1cbiAgICBob3N0LmFwcGVuZCh1bCk7XG4gIH07XG4gIHdzU2VsZWN0Py5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gKGUudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZTtcbiAgICBpZiAodmFsdWUgPT09ICdfX25ld193b3Jrc3BhY2VfXycpIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBzZWxlY3QgYmFjayB0byB0aGUgYWN0aXZlIHdvcmtzcGFjZSBmaXJzdCBzbyB0aGUgc2VudGluZWxcbiAgICAgIC8vIG5ldmVyIHN0aWNrcyBhcyB0aGUgZGlzcGxheWVkIHZhbHVlIGlmIHRoZSBwcm9tcHQgaXMgY2FuY2VsbGVkLlxuICAgICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgICAgY29uc3QgbmFtZSA9ICh3aW5kb3cucHJvbXB0KCdOZXcgd29ya3NwYWNlIG5hbWUnKSA/PyAnJykudHJpbSgpO1xuICAgICAgaWYgKG5hbWUpIGF3YWl0IGNyZWF0ZVdvcmtzcGFjZUZsb3cobmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdFeHBvcnQgd29ya3NwYWNlIGFzIC50YXIuenN0IChKU09OTCArIHNjcmVlbnNob3RzICsgRHVja0RCICsgUkVBRE1FKScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydFppcCgpfSxcbiAgICB7aWQ6ICdjb3B5LXBhdGgnLCBsYWJlbDogJ0NvcHkgcGF0aCBvZiBsYXN0IGV4cG9ydCcsIHJ1bjogKCkgPT4gdm9pZCBvbkNvcHlQYXRoKCl9LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3ZhbGlkYXRlJywgbGFiZWw6ICdSZS1jaGVjayBzZWxlY3RvcnMnLCBydW46ICgpID0+IHZvaWQgb25WYWxpZGF0ZSgpfSxcbiAgICB7aWQ6ICdjbGVhcicsIGxhYmVsOiAnQ2xlYXIgYWxsIGNhcHR1cmVzJywgcnVuOiBvbkNsZWFyfSxcbiAgICB7aWQ6ICdzZXR0aW5ncycsIGxhYmVsOiAnT3BlbiBzZXR0aW5ncycsIHJ1bjogb3BlbkRyYXdlcn0sXG4gICAge2lkOiAnZ2l0aHViJywgbGFiZWw6ICdPcGVuIEdpdEh1YiByZXBvJywgcnVuOiBvbkdpdGh1Yn0sXG4gICAge2lkOiAnbWFudWFsJywgbGFiZWw6ICdNYW51YWwgY2FwdHVyZSAoc3RhcnQgY29tcG9zZXIgd2l0aCBgPiBzZWxlY3RvcmApJywgcnVuOiAoKSA9PiB7IGNvbXBvc2VyLnZhbHVlID0gJz4gJzsgY29tcG9zZXIuZm9jdXMoKTsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyB9fSxcbiAgICB7aWQ6ICd1bmRvJywgbGFiZWw6ICdVbmRvJywgcnVuOiB1bmRvfSxcbiAgICB7aWQ6ICdyZWRvJywgbGFiZWw6ICdSZWRvJywgcnVuOiByZWRvfSxcbiAgXTtcbiAgY29uc3QgcmVuZGVyUGFsZXR0ZSA9IChxID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBjb25zdCBxbCA9IHEudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIC4uLkNPTU1BTkRTLmZpbHRlcigoYykgPT4gIXFsIHx8IGMubGFiZWwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxbCkpXG4gICAgICAgIC5tYXAoKGMpID0+ICh7bGFiZWw6IGMubGFiZWwsIHByZXZpZXc6ICdjb21tYW5kJywgcnVuOiBjLnJ1bn0pKSxcbiAgICAgIC4uLm1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAoIXFsIHx8XG4gICAgICAgIChtLmVudHJ5LnNlbGVjdG9yICsgJyAnICsgKG0uZW50cnkudGV4dCA/PyAnJykgKyAnICcgKyAobS5lbnRyeS5jb21wb25lbnRSb290ID8/ICcnKSlcbiAgICAgICAgICAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxbCkpKVxuICAgICAgICAuc2xpY2UoMCwgMzApXG4gICAgICAgIC5tYXAoKG0pID0+IHtcbiAgICAgICAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgICAgICAgIGNvbnN0IHByZXZpZXcgPSAobS5lbnRyeS50ZXh0ID8/IGZiWzBdID8/IG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyBtLmVudHJ5LnNlbGVjdG9yID8/ICcnKS5zbGljZSgwLCA4MCk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhYmVsOiBgIyR7bS5lbnRyeS5ufSAke20uZW50cnkuY29tcG9uZW50Um9vdCA/PyBtLmVudHJ5LnNlbGVjdG9yfWAsXG4gICAgICAgICAgICBwcmV2aWV3LFxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGNsb3NlUGFsZXR0ZSgpO1xuICAgICAgICAgICAgICBzY3JvbGxNZXNzYWdlSW50b1ZpZXcobS5pZCk7XG4gICAgICAgICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICBdO1xuICAgIGl0ZW1zLmZvckVhY2goKGl0LCBpKSA9PiB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBsYmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYmwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICAgIGxibC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5sYWJlbCwgcSk7XG4gICAgICBsaS5hcHBlbmQobGJsKTtcbiAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBwLmNsYXNzTmFtZSA9ICdwcmV2aWV3JztcbiAgICAgIHAuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQucHJldmlldyA/PyAnJywgcSk7XG4gICAgICBsaS5hcHBlbmQocCk7XG4gICAgICBjb25zdCBrYmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBrYmQuY2xhc3NOYW1lID0gJ2tiZCc7XG4gICAgICBrYmQudGV4dENvbnRlbnQgPSAn4oa1JztcbiAgICAgIGxpLmFwcGVuZChrYmQpO1xuICAgICAgaWYgKGkgPT09IDApIGxpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGl0LnJ1bigpOyB9KTtcbiAgICAgIHBhbGV0dGVMaXN0LmFwcGVuZChsaSk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9wZW5QYWxldHRlID0gKHByZXNldCA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZS5oaWRkZW4gPSBmYWxzZTtcbiAgICBwYWxldHRlSW5wdXQudmFsdWUgPSBwcmVzZXQ7XG4gICAgcmVuZGVyUGFsZXR0ZShwcmVzZXQpO1xuICAgIHBhbGV0dGVJbnB1dC5mb2N1cygpO1xuICAgIHBhbGV0dGVJbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShwcmVzZXQubGVuZ3RoLCBwcmVzZXQubGVuZ3RoKTtcbiAgfTtcbiAgY29uc3QgY2xvc2VQYWxldHRlID0gKCk6IHZvaWQgPT4geyBwYWxldHRlLmhpZGRlbiA9IHRydWU7IH07XG4gIHBhbGV0dGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHJlbmRlclBhbGV0dGUocGFsZXR0ZUlucHV0LnZhbHVlKSk7XG4gIHBhbGV0dGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBjb25zdCBpdGVtcyA9IFsuLi5wYWxldHRlTGlzdC5jaGlsZHJlbl07XG4gICAgbGV0IGFjdGl2ZSA9IGl0ZW1zLmZpbmRJbmRleCgobGkpID0+IGxpLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpO1xuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3IgKGNvbnN0IGxpIG9mIGl0ZW1zKSBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgYWN0aXZlID0gTWF0aC5taW4oaXRlbXMubGVuZ3RoIC0gMSwgYWN0aXZlICsgMSk7IGl0ZW1zW2FjdGl2ZV0/LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dVcCcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3IgKGNvbnN0IGxpIG9mIGl0ZW1zKSBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgYWN0aXZlID0gTWF0aC5tYXgoMCwgYWN0aXZlIC0gMSk7IGl0ZW1zW2FjdGl2ZV0/LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7IGUucHJldmVudERlZmF1bHQoKTsgKGl0ZW1zW2FjdGl2ZV0gYXMgSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQpPy5jbGljaygpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgY2xvc2VQYWxldHRlKCk7XG4gIH0pO1xuICBwYWxldHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHsgaWYgKGUudGFyZ2V0ID09PSBwYWxldHRlKSBjbG9zZVBhbGV0dGUoKTsgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEN1c3RvbSB0b29sdGlwIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgdGlwRm9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBjb25zdCBzaG93VGlwID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXAnKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRvb2x0aXBFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpcFIgPSB0b29sdGlwRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHRvcCA9IHIuYm90dG9tICsgNDtcbiAgICBsZXQgbGVmdCA9IHIubGVmdCArIHIud2lkdGggLyAyIC0gdGlwUi53aWR0aCAvIDI7XG4gICAgaWYgKHRvcCArIHRpcFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSB0aXBSLmhlaWdodCAtIDQ7XG4gICAgaWYgKGxlZnQgPCA0KSBsZWZ0ID0gNDtcbiAgICBpZiAobGVmdCArIHRpcFIud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDQpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHRpcFIud2lkdGggLSA0O1xuICAgIHRvb2x0aXBFbC5zdHlsZS5jc3NUZXh0ID0gYHRvcDoke3RvcH1weDtsZWZ0OiR7bGVmdH1weDtgO1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnO1xuICB9O1xuICBjb25zdCBoaWRlVGlwID0gKCk6IHZvaWQgPT4ge1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ2ZhbHNlJztcbiAgICB0aXBGb3IgPSBudWxsO1xuICAgIHRvb2x0aXBFbC5oaWRkZW4gPSB0cnVlO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKCF0IHx8IHQgPT09IHRpcEZvcikgcmV0dXJuO1xuICAgIHRpcEZvciA9IHQ7XG4gICAgc2hvd1RpcCh0KTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0ICYmIHQgPT09IHRpcEZvciAmJiAhdC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVUaXAoKTtcbiAgfSk7XG4gIC8vIFRoZSBwYW5lbCByZS1yZW5kZXJzIGFnZ3Jlc3NpdmVseSAocmVuZGVyKCkgcmVzZXRzIGxpc3QuaW5uZXJIVE1MLCBjb25maXJtXG4gIC8vIGJ1dHRvbnMgcmVwbGFjZVdpdGgsIGRlbGV0ZS1jb25maXJtIHJldmVydHMgb24gYSB0aW1lcikgYW5kIHRoZSBsaXN0XG4gIC8vIHNjcm9sbHMg4oCUIGluIGFsbCBvZiB0aG9zZSB0aGUgYW5jaG9yZWQgbm9kZSBsZWF2ZXMgdGhlIERPTSBvciBtb3Zlc1xuICAvLyB3aXRob3V0IGV2ZXIgZmlyaW5nIG1vdXNlb3V0LCB3aGljaCB1c2VkIHRvIHN0cmFuZCB0aGUgdG9vbHRpcCBvbiBzY3JlZW5cbiAgLy8gKGNvdmVyaW5nIG90aGVyIGVsZW1lbnRzLCBuZXZlciBkaXNtaXNzaW5nKS4gRGlzbWlzcyBvbiBhbnkgc3VjaCBzaWduYWwuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBoaWRlVGlwLCB0cnVlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoaWRlVGlwLCB0cnVlKTtcbiAgY29uc3QgdGlwR3VhcmQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgaWYgKHRpcEZvciAmJiAhdGlwRm9yLmlzQ29ubmVjdGVkKSBoaWRlVGlwKCk7XG4gIH0pO1xuICB0aXBHdWFyZC5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWV9KTtcblxuICAvLyDilIDilIDilIAgU3RhdCBkcmlsbGRvd25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBlbmRIZWFkaW5nID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpO1xuICAgIGgudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGgpO1xuICB9O1xuICBjb25zdCBhcHBlbmRCb2xkID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJyk7XG4gICAgYi50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoYik7XG4gIH07XG4gIGNvbnN0IGFwcGVuZENvZGUgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgY29kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcbiAgICBjb2RlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChjb2RlKTtcbiAgfTtcbiAgY29uc3QgYnVpbGREcmlsbGRvd24gPSAoa2luZDogc3RyaW5nKTogRG9jdW1lbnRGcmFnbWVudCA9PiB7XG4gICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBpZiAoa2luZCA9PT0gJ3NlbGVjdG9ycycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1NlbGVjdG9ycyBieSBxdWFsaXR5Jyk7XG4gICAgICBjb25zdCBidWNrZXRzID0ge2lkOiAwLCB0ZXN0aWQ6IDAsIGNsYXNzOiAwLCBudGg6IDAsIHRhZzogMH07XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgICBpZiAoZS50ZXN0SWQpIGJ1Y2tldHMudGVzdGlkKys7XG4gICAgICAgIGVsc2UgaWYgKGUuaWQgfHwgL14jW1xcdy1dKyQvLnRlc3QoZS5zZWxlY3RvcikpIGJ1Y2tldHMuaWQrKztcbiAgICAgICAgZWxzZSBpZiAoKGUuc2VsZWN0b3IgPz8gJycpLmluY2x1ZGVzKCc6bnRoLW9mLXR5cGUnKSkgYnVja2V0cy5udGgrKztcbiAgICAgICAgZWxzZSBpZiAoL1xcLi8udGVzdChlLnNlbGVjdG9yID8/ICcnKSkgYnVja2V0cy5jbGFzcysrO1xuICAgICAgICBlbHNlIGJ1Y2tldHMudGFnKys7XG4gICAgICB9XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgbGFiZWxdIG9mIFtcbiAgICAgICAgW2J1Y2tldHMudGVzdGlkLCAnIGRhdGEtdGVzdGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmlkLCAnIHN0YWJsZSBpZCddLFxuICAgICAgICBbYnVja2V0cy5jbGFzcywgJyBjbGFzcy1iYXNlZCddLFxuICAgICAgICBbYnVja2V0cy5udGgsICcgbnRoLW9mLXR5cGUnXSxcbiAgICAgICAgW2J1Y2tldHMudGFnLCAnIHRhZy1vbmx5J10sXG4gICAgICBdIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgIGxpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnc3RhbGUnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTdGFsZSBjYXB0dXJlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc3RhbGUgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKTtcbiAgICAgIGlmICghc3RhbGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGkudGV4dENvbnRlbnQgPSAnTm9uZSAtIGV2ZXJ5dGhpbmcgcmVzb2x2ZXMuJztcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH0gZWxzZSBmb3IgKGNvbnN0IG0gb2Ygc3RhbGUpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBsaS5hcHBlbmQoJyAnKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgKG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDUwKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnY29tbWVudHMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdDb21tZW50cycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3QgZmJzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBGZWVkYmFja01lc3NhZ2UgPT4gbS50eXBlID09PSAnZmVlZGJhY2snKTtcbiAgICAgIGNvbnN0IHRvdGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHRvdGFsLmFwcGVuZCgnVG90YWwgd29yZHM6ICcpO1xuICAgICAgYXBwZW5kQm9sZCh0b3RhbCwgU3RyaW5nKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyB3b3JkQ291bnQobS50ZXh0KSwgMCkpKTtcbiAgICAgIHVsLmFwcGVuZCh0b3RhbCk7XG4gICAgICBjb25zdCBhdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgYXZnLmFwcGVuZCgnQXZlcmFnZSBsZW5ndGg6ICcpO1xuICAgICAgYXBwZW5kQm9sZChhdmcsIFN0cmluZyhmYnMubGVuZ3RoID8gTWF0aC5yb3VuZChmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgbS50ZXh0Lmxlbmd0aCwgMCkgLyBmYnMubGVuZ3RoKSA6IDApKTtcbiAgICAgIGF2Zy5hcHBlbmQoJyBjaGFycycpO1xuICAgICAgdWwuYXBwZW5kKGF2Zyk7XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAncGFnZXMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdQYWdlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNlZW4uc2V0KG0uZW50cnkudXJsLCAoc2Vlbi5nZXQobS5lbnRyeS51cmwpID8/IDApICsgMSk7XG4gICAgICBmb3IgKGNvbnN0IFt1cmwsIG5dIG9mIHNlZW4pIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcobikpO1xuICAgICAgICBsaS5hcHBlbmQoYCBzZWxlY3RvciR7biA9PT0gMSA/ICcnIDogJ3MnfSDCtyBgKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgcGF0aE9mKHVybCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZztcbiAgfTtcbiAgY29uc3Qgc2hvd0RyaWxsZG93biA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qga2luZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdCcpO1xuICAgIGlmICgha2luZCkgcmV0dXJuO1xuICAgIGRyaWxsZG93bkVsLnJlcGxhY2VDaGlsZHJlbihidWlsZERyaWxsZG93bihraW5kKSk7XG4gICAgZHJpbGxkb3duRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkUiA9IGRyaWxsZG93bkVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDY7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIGRSLndpZHRoIC8gMjtcbiAgICBpZiAodG9wICsgZFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSBkUi5oZWlnaHQgLSA2O1xuICAgIGlmIChsZWZ0IDwgNikgbGVmdCA9IDY7XG4gICAgaWYgKGxlZnQgKyBkUi53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNikgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZFIud2lkdGggLSA2O1xuICAgIGRyaWxsZG93bkVsLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7dG9wfXB4O2xlZnQ6JHtsZWZ0fXB4O2A7XG4gIH07XG4gIGNvbnN0IGhpZGVEcmlsbGRvd24gPSAoKTogdm9pZCA9PiB7IGRyaWxsZG93bkVsLmhpZGRlbiA9IHRydWU7IH07XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcuc3RhdFtkYXRhLXN0YXRdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0KSBzaG93RHJpbGxkb3duKHQpO1xuICB9KTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgaWYgKCFzdGF0c0VsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZURyaWxsZG93bigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0LWJ1dHRvbiBob3ZlciDihpIgb3V0bGluZS1tdWx0aSBvbiBwYWdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBmb3IgKGNvbnN0IGJ0biBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1leHBvcnQtaG92ZXJdJykpIHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpJywgc2VsZWN0b3JzfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QuYWRkKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgQ2xpY2sgZGVsZWdhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXIgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICBpZiAoIXRyaWdnZXIpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aW9uID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJyk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ3NlbmQnOiBzZW5kRmVlZGJhY2soKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1hbGwnOiB2b2lkIG9uQ29weUFsbCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQnOiB2b2lkIG9uRXhwb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydC16aXAnOiB2b2lkIG9uRXhwb3J0WmlwKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktcGF0aCc6IHZvaWQgb25Db3B5UGF0aCgpOyByZXR1cm47XG4gICAgICBjYXNlICdpbXBvcnQnOiBvbkltcG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHZvaWQgb25WYWxpZGF0ZSgpOyByZXR1cm47XG4gICAgICBjYXNlICdjbGVhcic6IG9uQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZ2l0aHViJzogb25HaXRodWIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOiBvcGVuRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Nsb3NlLWRyYXdlcic6IGNsb3NlRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3VuZG8nOiB1bmRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3JlZG8nOiByZWRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Rlc2lnbi1lZGl0JzogeyB2b2lkIG9wZW5NZE1vZGFsKCdkZXNpZ24nKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdza2lsbC1lZGl0JzogIHsgdm9pZCBvcGVuTWRNb2RhbCgnc2tpbGwnKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdkZXNpZ24tdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbi1tZC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyBQcmVmZXIgdGhlIHVzZXIncyBsb2NhbCBvdmVycmlkZSBpZiBwcmVzZW50IChzbyBhIGZvcmsnc1xuICAgICAgICAgIC8vIFwiRG93bmxvYWQgdGVtcGxhdGVcIiBwcm9kdWNlcyB0aGUgc2FtZSBjb250ZW50IHRoZSBmb3JrIHNoaXBzKVxuICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgICAgICAgICBjb25zdCB0ZXh0ID0gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxEZXNpZ24nKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKSk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQg4oCUIGZpbGwgaW4gYW5kIHJlLXVwbG9hZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLmRlc2lnbk1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ0RFU0lHTi5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NraWxsLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXRlbXBsYXRlLWRvd25sb2FkJzoge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsU2tpbGwnKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdTS0lMTC5tZCB0ZW1wbGF0ZSBkb3dubG9hZGVkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXJlc2V0LXRlbXBsYXRlJzoge1xuICAgICAgICBwcmVmcy5za2lsbE1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICd3cy1jcmVhdGUnOiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAod3NOYW1lLnZhbHVlID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xuICAgICAgICB2b2lkIGNyZWF0ZVdvcmtzcGFjZUZsb3cobmFtZSkudGhlbigob2spID0+IHsgaWYgKG9rKSB3c05hbWUudmFsdWUgPSAnJzsgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyDilIDilIDilIAgR2xvYmFsIGtleWJvYXJkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQgPSAodGFyZ2V0OiBFdmVudFRhcmdldCB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBlbCA9IHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID8gdGFyZ2V0IDogbnVsbDtcbiAgICByZXR1cm4gQm9vbGVhbihlbD8uY2xvc2VzdCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIFtjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdLCBbY29udGVudGVkaXRhYmxlPVwiXCJdJykpO1xuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGVkaXRhYmxlVGFyZ2V0ID0gaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0KGUudGFyZ2V0KTtcbiAgICBpZiAoZWRpdGFibGVUYXJnZXQgJiYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIFsnYScsICd6JywgJ3knXS5pbmNsdWRlcyhlLmtleS50b0xvd2VyQ2FzZSgpKSkgcmV0dXJuO1xuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2snKSB7IGUucHJldmVudERlZmF1bHQoKTsgcGFsZXR0ZS5oaWRkZW4gPyBvcGVuUGFsZXR0ZSgpIDogY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgIC8vIEN0cmwrRiAoYW5kIENtZCtGKSBvcGVucyB0aGUgaW4tbGlzdCB2aXN1YWwgZmluZCDigJQgZGlzdGluY3QgZnJvbSB0aGVcbiAgICAvLyBDbWQrSyBjb21tYW5kIHBhbGV0dGUuIE92ZXJyaWRlIHRoZSBicm93c2VyJ3MgbmF0aXZlIGZpbmQgc28gdGhlIHBhbmVsXG4gICAgLy8gb3ducyB0aGUgZ2VzdHVyZS5cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICdmJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IG9wZW5GaW5kKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgdW5kbygpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIChlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneScgfHwgKGUuc2hpZnRLZXkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onKSkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyByZWRvKCk7IHJldHVybjsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGNvbnN0IG1kTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgICBpZiAobWRNb2RhbCAmJiAhbWRNb2RhbC5oaWRkZW4pIHsgY2xvc2VNZE1vZGFsKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFwYWxldHRlLmhpZGRlbikgeyBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIWRyYXdlci5oaWRkZW4pIHsgY2xvc2VEcmF3ZXIoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoZmluZEJhciAmJiAhZmluZEJhci5oaWRkZW4pIHsgY2xvc2VGaW5kKCk7IHJldHVybjsgfVxuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHsgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY2FuY2VsJ30pOyBwZW5kaW5nTXVsdGkgPSBbXTsgcmVuZGVyKCk7IHNldFN0YXR1cygnUGVuZGluZyBncm91cCBjYW5jZWxsZWQnKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdJbnNlcnQgbW9kZSBjYW5jZWxsZWQnKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoc2VhcmNoUXVlcnkpIGNsb3NlRmluZCgpO1xuICAgIH1cbiAgICBpZiAoZS5rZXkgPT09ICdBbHQnIHx8IGUuYWx0S2V5KSB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IHRydWV9KTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICBpZiAoIWUuYWx0S2V5KSB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IGZhbHNlfSk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2Ugd2lyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgcGFuZWxSZWFkeSA9IGZhbHNlO1xuICBjb25zdCBwZW5kaW5nUGFuZWxNZXNzYWdlczogYW55W10gPSBbXTtcbiAgY29uc3QgcmVjZWl2ZVBhbmVsTWVzc2FnZSA9IChtOiBhbnkpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBhbmVsUmVhZHkpIHtcbiAgICAgIHBlbmRpbmdQYW5lbE1lc3NhZ2VzLnB1c2gobSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uQ3NNZXNzYWdlKG0pO1xuICB9O1xuICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAvLyBTaW5nbGUgY2hhbm5lbDogY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLiBUaGUgYmFja2dyb3VuZCB1c2VkIHRvIHJlbGF5XG4gICAgLy8gdGhyb3VnaCBhIHBvcnQgdG9vLCBidXQgY29udGVudC1zY3JpcHQgYnJvYWRjYXN0cyBhbHJlYWR5IHJlYWNoIHRoZVxuICAgIC8vIHNpZGUgcGFuZWwgZGlyZWN0bHkg4oCUIHJlbGF5aW5nIHByb2R1Y2VkIGR1cGxpY2F0ZSBkaXNwYXRjaGVzLlxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobTogYW55KSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKG0pKTtcbiAgICBjaHJvbWUudGFicz8ub25BY3RpdmF0ZWQ/LmFkZExpc3RlbmVyKCgpID0+IHZvaWQgcnVuVmFsaWRhdGlvbigpKTtcbiAgICBjaHJvbWUudGFicz8ub25VcGRhdGVkPy5hZGRMaXN0ZW5lcigoX2lkLCBpbmZvKSA9PiB7IGlmIChpbmZvPy5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHZvaWQgcnVuVmFsaWRhdGlvbigpOyB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOnRvLXBhbmVsJywgKGUpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UoKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbCkpO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIFRlc3QgQVBJIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpbnN0YWxsVGVzdEFwaSA9ICgpOiB2b2lkID0+IHtcbiAgICAod2luZG93IGFzIGFueSkuX19waW5jaGdyYWJfcGFuZWwgPSB7XG4gICAgICBwdXNoTWVzc2FnZTogKG06IFBhbmVsTWVzc2FnZSkgPT4geyBtZXNzYWdlcy5wdXNoKG0pOyBwZXJzaXN0KCk7IHJlbmRlcigpOyB9LFxuICAgICAgb25DYXB0dXJlLCBvbkhvdmVyLCBvbkhvdmVyRW5kLCBvblBhZ2VTbmFwc2hvdCxcbiAgICAgIGdldE1lc3NhZ2VzOiAoKSA9PiBbLi4ubWVzc2FnZXNdLFxuICAgICAgZ2V0UHJlZnM6ICgpID0+ICh7Li4ucHJlZnN9KSxcbiAgICAgIHNldFByZWZzOiAocDogUGFydGlhbDxQcmVmcz4pID0+IHsgcHJlZnMgPSB7Li4ucHJlZnMsIC4uLnB9OyBwZXJzaXN0UHJlZnMoKTsgYXBwbHlQcmVmc1RvVUkoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBidWlsZEpzb25sLFxuICAgICAgYnVpbGRFeHBvcnRGaWxlbmFtZSwgYnVpbGRNYW5pZmVzdCwgZG9taW5hbnRIb3N0U2x1ZywgZGlzdGluY3RIb3N0cyxcbiAgICAgIGR1Y2tEYlNuaXBwZXQsIG9uRXhwb3J0WmlwLCBvbkV4cG9ydCwgb25Db3B5UGF0aCxcbiAgICAgIGRlbm9ybWFsaXplRW50cnksXG4gICAgICBnZXRMYXN0RXhwb3J0OiAoKSA9PiAoey4uLmxhc3RFeHBvcnR9KSxcbiAgICAgIC8vIFRlc3QgaGF0Y2g6IHNlZWQgZXZlcnkgc2VsZWN0b3IgY2FwdHVyZSB3aXRoIHRoZSBzYW1lIGZ1bGwgUE5HIGRhdGFVUkxcbiAgICAgIC8vIHNvIHRoZSBhcmNoaXZlIGV4cG9ydCBoYXMgc29tZXRoaW5nIHRvIGJ1bmRsZS4gUmVhbCBjYXB0dXJlcyBwb3B1bGF0ZVxuICAgICAgLy8gc2hvdHNGdWxsIGZyb20gdGhlIGJnIGBydW5TaG90YCByZXBseTsgdGVzdHMgY2FuJ3QgZWFzaWx5IHJ1biBhXG4gICAgICAvLyBjYXB0dXJlVmlzaWJsZVRhYiwgc28gdGhpcyBsZXRzIHVzIHByb3ZlIHRoZSBQTkcgYnVuZGxpbmcgcGF0aC5cbiAgICAgIF9fc2VlZFNob3RzRnVsbDogKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzaG90c0Z1bGwuc2V0KG0uZW50cnkuc2VsZWN0b3IsIGRhdGFVcmwpO1xuICAgICAgICB9XG4gICAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICAgIH0sXG4gICAgICBfX2dldFNob3RzRnVsbDogKCkgPT4gc2hvdHNGdWxsLFxuICAgICAgLy8gc2V0U2VhcmNoIGRyaXZlcyB0aGUgQ3RybCtGIHZpc3VhbC1maW5kIHBhdGggKHRoZSBoZWFkZXIgc2VhcmNoIG5vd1xuICAgICAgLy8gb3BlbnMgdGhlIGNvbW1hbmQgcGFsZXR0ZSBpbnN0ZWFkIG9mIGZpbHRlcmluZykuXG4gICAgICBzZXRTZWFyY2g6IChxOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHEpIHsgb3BlbkZpbmQoKTsgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gcTsgYXBwbHlGaW5kKHEpOyB9XG4gICAgICAgIGVsc2UgY2xvc2VGaW5kKCk7XG4gICAgICB9LFxuICAgICAgb3BlbkZpbmQsIGNsb3NlRmluZCxcbiAgICAgIGlzRmluZE9wZW46ICgpID0+IEJvb2xlYW4oZmluZEJhciAmJiAhZmluZEJhci5oaWRkZW4pLFxuICAgICAgc2V0VmFsaWRpdHk6IChzZWw6IHN0cmluZywgb2s6IGJvb2xlYW4gfCAnZGlmZi1wYWdlJywgcmVhc29uPzogc3RyaW5nKSA9PiB7XG4gICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICBpZiAocmVhc29uKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCByZWFzb24pO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICAgICAgbGl2ZVRhYlBhdGggPSBudWxsO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgICAgICBzaG90cy5jbGVhcigpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9wZW5QYWxldHRlLCBjbG9zZVBhbGV0dGUsIG9wZW5EcmF3ZXIsIGNsb3NlRHJhd2VyLFxuICAgICAgc2VuZEZlZWRiYWNrLCB1bmRvLCByZWRvLFxuICAgICAgbGlzdFdvcmtzcGFjZXM6ICgpID0+IFsuLi53b3Jrc3BhY2VzXSxcbiAgICAgIGFjdGl2ZVdvcmtzcGFjZTogKCkgPT4gYWN0aXZlV3MsXG4gICAgICBzZXRTdGlja3lUVEw6IChtczogbnVtYmVyKSA9PiB7IFNUSUNLWV9UVExfTVMgPSBtczsgfSxcbiAgICAgIGZvcmNlU3RpY2t5RXhwaXJlOiAoKSA9PiB7IGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7IHBhbmVsSG92ZXJlZCA9IGZhbHNlOyBhcm1TdGlja3lFeHBpcnkoKTsgfSxcbiAgICAgIHNldExhc3RBY3RpdmUsXG4gICAgICBjcmVhdGVXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IHsgd29ya3NwYWNlcy5wdXNoKHtuYW1lOiBuLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0pOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZXR1cm4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlcik7IH0sXG4gICAgICBzd2l0Y2hXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IGxvYWRXb3Jrc3BhY2UobikudGhlbihyZW5kZXIpLFxuICAgICAgY2xlYXJBbGw6IG9uQ2xlYXIsXG4gICAgICBsaXN0U25hcHNob3RzOiAoKSA9PiB3c1NuYXBzaG90cy5tYXAoKHMpID0+ICh7aWQ6IHMuaWQsIHRzOiBzLnRzLCBzZWxlY3RvcnM6IHMuc2VsZWN0b3JzLCBjb21tZW50czogcy5jb21tZW50c30pKSxcbiAgICAgIHJlc3RvcmVTbmFwc2hvdDogKGlkOiBzdHJpbmcpID0+IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdChpZCksXG4gICAgfTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQm9vdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGxvYWRBbGwoKTtcbiAgICBwYW5lbFJlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgcGVuZGluZ1BhbmVsTWVzc2FnZXMuc3BsaWNlKDApKSBvbkNzTWVzc2FnZShtKTtcbiAgICByZW5kZXIoKTtcbiAgICBpbnN0YWxsVGVzdEFwaSgpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHZvaWQgZmV0Y2hTdGFycygpO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9uLCB3czogYWN0aXZlV3MsIG1lc3NhZ2VzOiBtZXNzYWdlcy5sZW5ndGh9KTtcbiAgfSkoKTtcbn0pKCk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQTZsQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUN6RixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBLEVBS0osSUFBTSxLQUFLLENBQTJCLGFBQzFDLEVBQUMsTUFBTSxNQUFNLE9BQU8sT0FBTyxNQUFNLFFBQU87OztFQ3JtQjNDLElBQU0sUUFBZ0M7QUFBQSxJQUNwQyxpQkFBaUI7QUFBQSxJQUNqQixnQkFBZ0I7QUFBQSxJQUNoQixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxNQUFNO0FBQUEsSUFDTixHQUFHO0FBQUEsSUFDSCxPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixvQkFBb0I7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O0FBQUEsVUFDZCxxQkFBcUI7QUFBQSxVQUNyQixlQUFlLENBQUM7QUFBQSxVQUNoQixpQkFBaUIsTUFBTTtBQUFBLFVBQ3ZCLE1BQU0sTUFBTTtBQUFBLFVBQ1osUUFBUTtBQUFBLFVBQ1IsT0FBTztBQUFBO0FBQUEsUUFFVDtBQUFBLFFBQWE7QUFBQSxRQUFjO0FBQUEsUUFBWTtBQUFBLFFBQ3ZDO0FBQUEsUUFBYztBQUFBLFFBQU07QUFBQSxRQUNwQixnQkFBZ0IsTUFBTSxDQUFDLEdBQUcsVUFBVTtBQUFBLFFBQ3BDLGlCQUFpQixNQUFNO0FBQUEsUUFDdkIsY0FBYyxDQUFDLE9BQWU7QUFBQSxVQUFFLGdCQUFnQjtBQUFBO0FBQUEsUUFDaEQsbUJBQW1CLE1BQU07QUFBQSxVQUFFLGFBQWEsV0FBVztBQUFBLFVBQUcsZUFBZTtBQUFBLFVBQU8sZ0JBQWdCO0FBQUE7QUFBQSxRQUM1RjtBQUFBLFFBQ0EsaUJBQWlCLENBQUMsTUFBYztBQUFBLFVBQUUsV0FBVyxLQUFLLEVBQUMsTUFBTSxHQUFHLFdBQVcsSUFBSSxLQUFLLEVBQUUsWUFBWSxFQUFDLENBQUM7QUFBQSxVQUFHLGtCQUFrQjtBQUFBLFVBQUcsT0FBTyxjQUFjLENBQUMsRUFBRSxLQUFLLE1BQU07QUFBQTtBQUFBLFFBQzNKLGlCQUFpQixDQUFDLE1BQWMsY0FBYyxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQUEsUUFDNUQsVUFBVTtBQUFBLFFBQ1YsZUFBZSxNQUFNLFlBQVksSUFBSSxDQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUUsSUFBSSxXQUFXLEVBQUUsV0FBVyxVQUFVLEVBQUUsU0FBUSxFQUFFO0FBQUEsUUFDaEgsaUJBQWlCLENBQUMsT0FBZSx5QkFBeUIsRUFBRTtBQUFBLE1BQzlEO0FBQUE7QUFBQSxLQUlJLFlBQVk7QUFBQSxNQUNoQixNQUFNLFFBQVE7QUFBQSxNQUNkLGFBQWE7QUFBQSxNQUNiLFdBQVcsS0FBSyxxQkFBcUIsT0FBTyxDQUFDO0FBQUEsUUFBRyxZQUFZLENBQUM7QUFBQSxNQUM3RCxPQUFPO0FBQUEsTUFDUCxlQUFlO0FBQUEsTUFDVixjQUFjO0FBQUEsTUFDZCxXQUFXO0FBQUEsTUFDaEIsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsUUFBUSxJQUFJLEtBQUssU0FBUyxFQUFDLGFBQWEsSUFBSSxVQUFVLFVBQVUsU0FBUyxPQUFNLENBQUM7QUFBQSxPQUMvRTtBQUFBLEtBQ0Y7IiwKICAiZGVidWdJZCI6ICI3QkRGQUZGREIxNEQ0Qjg0NjQ3NTZFMjE2NDc1NkUyMSIsCiAgIm5hbWVzIjogW10KfQ==
