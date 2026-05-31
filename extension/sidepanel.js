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
    const slugForTab = (url, title) => {
      try {
        const h = new URL(url).hostname.replace(/^www\./, "");
        if (h)
          return h;
      } catch {}
      const t = (title || "").trim();
      return t ? t.slice(0, 24) : "tab";
    };
    const uniqueWsName = (base) => {
      if (!workspaces.some((w) => w.name === base))
        return base;
      for (let i = 2;; i++) {
        const n = `${base} ${i}`;
        if (!workspaces.some((w) => w.name === n))
          return n;
      }
    };
    const onTabActivated = async ({ tabId, url, title }) => {
      let ws = workspaces.find((w) => w.tabId === tabId);
      if (ws) {
        if (ws.url !== url || ws.title !== title) {
          ws.url = url;
          ws.title = title;
          persistWorkspaces();
        }
      } else {
        const current = workspaces.find((w) => w.name === activeWs);
        if (current && current.tabId == null) {
          ws = current;
          ws.tabId = tabId;
          ws.url = url;
          ws.title = title;
        } else {
          ws = { name: uniqueWsName(slugForTab(url, title)), createdAt: new Date().toISOString(), tabId, url, title };
          workspaces.push(ws);
        }
        persistWorkspaces();
      }
      if (activeWs !== ws.name)
        await loadWorkspace(ws.name);
      renderWsControls();
      render();
    };
    const focusWorkspaceTab = (name) => {
      const ws = workspaces.find((w) => w.name === name);
      if (!inExtension || ws?.tabId == null)
        return;
      chrome.tabs.update(ws.tabId, { active: true }).then((t) => {
        if (t?.windowId != null)
          chrome.windows?.update(t.windowId, { focused: true })?.catch?.(() => {});
      }).catch(() => {});
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
      if (msg.kind === "pg-tab-activated") {
        onTabActivated(msg);
        return;
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
          focusWorkspaceTab(w.name);
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
      focusWorkspaceTab(value);
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
      chrome.tabs?.onRemoved?.addListener((closedId) => {
        const ws = workspaces.find((w) => w.tabId === closedId);
        if (ws) {
          ws.tabId = undefined;
          persistWorkspaces();
          renderWsControls();
        }
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

//# debugId=D7A4AEB7BEDC11F464756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fVxuICAvLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIG1ldGFkYXRhIGZvciBvbmUgZGlzdGluY3QgcGFnZSAoVVJMKS4gRW1pdHRlZCBhdFxuICAvLyBtb3N0IG9uY2UgcGVyIFVSTCAodGhlIGNvbnRlbnQgc2NyaXB0IGRlZHVwZXMpLiBUaGUgcGFuZWwgY2FuIHN0YXNoIHRoZXNlXG4gIC8vIGFzIHBhZ2UtbGV2ZWwgY29udGV4dCAvIGV4cG9ydCB0aGVtIGFsb25nc2lkZSBlbGVtZW50IHNob3RzLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdCc7IHBheWxvYWQ6IFBhZ2VTbmFwc2hvdH07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9DcyA9XG4gIHwge2tpbmQ6ICdvdXRsaW5lJzsgc2VsZWN0b3I6IHN0cmluZzsgZ29sZD86IGJvb2xlYW47IGRhc2hlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ31cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGknOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9XG4gIHwge2tpbmQ6ICdzY3JvbGwtdG8nOyBzZWxlY3Rvcjogc3RyaW5nOyBzdGlja3k/OiBib29sZWFufVxuICB8IHtraW5kOiAnc3RpY2t5LWNsZWFyJ31cbiAgLy8gT25lLXNob3QgbG9jYXRvciBhbmltYXRpb246IHNjcm9sbCBpbnRvIHZpZXcgKyB0aHJlZSBwdWxzaW5nIHJpbmdzLlxuICAvLyBEaXN0aW5jdCBmcm9tIGBvdXRsaW5lYCAoc3VidGxlIGhvdmVyIHJpbmcpIGFuZCBgc2Nyb2xsLXRvYCAoc2lsZW50XG4gIC8vIHJlY2VudGVyKSBzbyB0aGUgc2lkZSBwYW5lbCBMb2NhdGUgYnV0dG9uIGNhbiByZXF1ZXN0IHNvbWV0aGluZyB1c2Vyc1xuICAvLyBjYW4gYWN0dWFsbHkgZmluZCBvbiBhIGJ1c3kgcGFnZS5cbiAgfCB7a2luZDogJ2xvY2F0ZS1mbGFzaCc7IHNlbGVjdG9yOiBzdHJpbmd9XG4gIHwge2tpbmQ6ICd2YWxpZGF0ZSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdsb2ctZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdyZWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnY2FwdHVyZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIC8vIE91dGxpbmUgdGhlIE50aCBhbmNlc3RvciBvZiBgc2VsZWN0b3JgIHdpdGhvdXQgY2FwdHVyaW5nIGl0IOKAlCB1c2VkIGJ5XG4gIC8vIGhvdmVyIG9uIGFuY2VzdG9yIGJyZWFkY3J1bWIgY2hpcHMgaW4gdGhlIHNpZGUgcGFuZWwgc28gdGhlIHVzZXJcbiAgLy8gcHJldmlld3Mgd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjbGlja2luZy5cbiAgfCB7a2luZDogJ291dGxpbmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICB8IHtraW5kOiAnYWx0LXN0YXRlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdtYW51YWwtY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uJzsgc2VsZWN0b3I6IHN0cmluZzsgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9XG4gIHwge2tpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfVxuICB8IHtraW5kOiAnc2V0LWNhcHR1cmVkJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ3NldC1jcy1wcmVmcyc7IHNwYWNpbmdPdmVybGF5PzogYm9vbGVhbjsgaG92ZXJTbmFwPzogYm9vbGVhbn1cbiAgLy8gU2NyZWVuc2hvdC10aW1lIG92ZXJsYXkgdG9nZ2xlcy4gVGhlIGJhY2tncm91bmQgYXNrcyB0aGUgY29udGVudCBzY3JpcHRcbiAgLy8gdG8gaGlkZSBpdHMgc2hhZG93LXJvb3QgY2hyb21lIChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIGJlZm9yZVxuICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlcywgdGhlbiByZXN0b3JlcyB2aXNpYmlsaXR5IG9uY2UgdGhlIFBORyBpcyBiYWNrLlxuICB8IHtraW5kOiAnaGlkZS1vdmVybGF5cyd9XG4gIHwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ307XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25QYXlsb2FkID0ge1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLy8gVGhlIGNhcHR1cmVkIGVudHJ5J3Mgc3RhYmxlIHVpZC4gVGhlIGNvbnRlbnQgc2NyaXB0IG5lZWRzIHRoaXMgc29cbiAgLy8gaXRzIG9uLXBhZ2UgY29tbWVudCBib3ggY2FuIHJvdXRlIHRoZSBjb21tZW50IHRvIHRoZSAqc3BlY2lmaWMqXG4gIC8vIGNhcHR1cmUgcmF0aGVyIHRoYW4gdG8gXCJhbnkgc2VsZWN0b3IgdGhhdCBtYXRjaGVzLlwiIFByZXZlbnRzXG4gIC8vIGNyb3NzLWNvbnRhbWluYXRpb24gd2hlbiB0d28gY2FwdHVyZXMgc2hhcmUgYSBzZWxlY3RvciBhY3Jvc3NcbiAgLy8gcGFnZXMgb3IgdHdvIHNpYmxpbmcgZWxlbWVudHMgc2hhcmUgYSB0ZXN0SWQuXG4gIHVpZD86IHN0cmluZztcbiAgbj86IG51bWJlcjtcbiAgY2FwdHVyZWQ/OiBib29sZWFuO1xuICBmZWVkYmFjaz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0JnID1cbiAgfCB7a2luZDogJ2NhcHR1cmUtc2NyZWVuc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc3dpdGNoLXRvLXRhYic7IHVybDogc3RyaW5nOyBvcGVuSWZNaXNzaW5nPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2xpc3Qtb3Blbi10YWJzJ31cbiAgfCB7a2luZDogJ3Nob3QtZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1ncm91cCc7IHNlbGVjdG9yczogc3RyaW5nW107IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1wYWdlJzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIEZ1bGwtcGFnZSAoYmVzdC1lZmZvcnQpIHNjcmVlbnNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFVubGlrZVxuICAvLyBzaG90LXBhZ2UgdGhpcyBkb2VzIE5PVCB3cml0ZSBhIGZpbGUgb3IgYnVpbGQgYSB0aHVtYm5haWwg4oCUIGl0IGp1c3RcbiAgLy8gcmV0dXJucyB0aGUgc3RpdGNoZWQgUE5HIGFzIGEgZGF0YSBVUkwgc28gdGhlIGNhbGxlciAoY29udGVudCBzY3JpcHQpIGNhblxuICAvLyBhdHRhY2ggaXQgdG8gYSBQYWdlU25hcHNob3QuIGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnRcbiAgLy8gY291bGQgYmUgY2FwdHVyZWQuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbi8vIFJlcGx5IHRvIGEgYHBhZ2Utc25hcHNob3Qtc2hvdGAgcmVxdWVzdC4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMIG9mXG4vLyB0aGUgKGJlc3QtZWZmb3J0KSBmdWxsIHBhZ2U7IGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnQgd2FzXG4vLyBjYXB0dXJlZC4gYG9rOmZhbHNlYCBjYXJyaWVzIGFuIGVycm9yIHN0cmluZy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgc2NyZWVuc2hvdD86IHN0cmluZztcbiAgcGFydGlhbD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5XG4gIHwgUGFnZVNuYXBzaG90UmVwbHk7XG5cbi8vIOKUgOKUgOKUgCBFeHBvcnQgc2hhcGVzICh2Mikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBNYW5pZmVzdCBsaW5lIGVtaXR0ZWQgYXMgdGhlIHZlcnkgZmlyc3QgSlNPTkwgbGluZS4gQ2FycmllcyB0aGUgbWV0YWRhdGFcbi8vIG5lY2Vzc2FyeSB0byByZXN5bmMgYSBkb3dubG9hZGVkIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlICsgdG9vbGluZy5cbmV4cG9ydCB0eXBlIEV4cG9ydE1hbmlmZXN0ID0ge1xuICB2OiAyO1xuICB0eXBlOiAnbWFuaWZlc3QnO1xuICB0czogc3RyaW5nOyAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgZXhwb3J0IHdhcyBnZW5lcmF0ZWRcbiAgZ2VuZXJhdGVkOiBudW1iZXI7IC8vIGVwb2NoIG1zIChtaXJyb3Igb2YgdHMgaW4gbWFjaGluZS1yZWFkYWJsZSBmb3JtKVxuICB0b29sOiAncGluY2hncmFiJztcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGZvcm1hdDogJ2pzb25sJyB8ICdtYXJrZG93bicgfCAndGFyLnpzdCc7XG4gIGhvc3RzOiBzdHJpbmdbXTtcbiAgLy8gQW1iaWd1b3VzIHRvdGFscy4gVGhlIHByZXZpb3VzIGBzZWxlY3RvcnMgLyBmZWVkYmFjayAvIHBhZ2VzYFxuICAvLyB0cmlwbGUgZGlkbid0IHNheSB3aGV0aGVyIG5lc3RlZFxuICAvLyBncm91cCBtZW1iZXJzIHdlcmUgY291bnRlZCwgd2hldGhlciBmZWVkYmFjay1iZWFyaW5nIHBhcmVudHMgd2VyZVxuICAvLyBhIHN1YnNldCwgb3IgaG93IHNjcmVlbnNob3RzIHdlcmUgdGFsbGllZC4gVGhlIGV4cGFuZGVkIHNoYXBlXG4gIC8vIGJlbG93IG5hbWVzIGV2ZXJ5IGNhdGVnb3J5IGV4cGxpY2l0bHkgc28gYSBkb3duc3RyZWFtIGFnZW50IGNhblxuICAvLyB0ZWxsIGV4YWN0bHkgd2hhdCdzIGluIHRoZSBidW5kbGUuXG4gIGNvdW50czoge1xuICAgIC8vIFRvcC1sZXZlbCBzZWxlY3RvciByb3dzIGluIHRoZSBKU09OTCBzdHJlYW0gKGV4Y2x1ZGVzIG5lc3RlZFxuICAgIC8vIGdyb3VwIG1lbWJlcnMsIGJ1dCB0aGUgYGdyb3VwTWVtYmVyc2AgZmllbGQgY291bnRzIHRob3NlKS5cbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBmZWVkYmFjazogbnVtYmVyO1xuICAgIHBhZ2VzOiBudW1iZXI7XG4gICAgLy8gTnVtYmVyIG9mIHNlbGVjdG9yIHJvd3MgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBjaGlsZC5cbiAgICAvLyBVc2VmdWwgZm9yIFwic2hvdyBtZSBvbmx5IHRoZSBpdGVtcyB3aXRoIGNvbW1lbnRzXCIuXG4gICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9ycyB0aGF0IHNoaXAgdW5kZXIgYSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYCBhcnJheVxuICAgIC8vIHJhdGhlciB0aGFuIGFzIHRoZWlyIG93biB0b3AtbGV2ZWwgcm93LlxuICAgIGdyb3VwTWVtYmVycz86IG51bWJlcjtcbiAgICAvLyBTY3JlZW5zaG90IGludmVudG9yeSAoY291bnRlZCBieSBmaWxlLCBkZWR1cGVkKS5cbiAgICBzY3JlZW5zaG90c0VsZW1lbnQ/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNHcm91cD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c1BhZ2U/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3Igcm93cyB0aGF0IHNob3VsZCBoYXZlIGFuIGVsZW1lbnQgc2NyZWVuc2hvdCBidXQgZG9uJ3RcbiAgICAvLyAocG9zdC1idWctIzIgZm9yY2VkIHNob290IG1heSBzdGlsbCBmYWlsKS4gUmVwYWlyIGFnZW50cyBjYW5cbiAgICAvLyBza2lwIHRoZXNlIG9yIHJlcXVlc3QgYSByZS1jYXB0dXJlLlxuICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90PzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2hvc2UgcGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbnkgc2VsZWN0b3JcbiAgICAvLyBpbiB0aGlzIGFyY2hpdmUuIFNob3VsZCBhbHdheXMgYmUgMDsgbm9uLXplcm8gbWVhbnMgdGhlIGV4cG9ydFxuICAgIC8vIGdvdCB0cnVuY2F0ZWQgb3IgYSBwYXJlbnQgd2FzIGRlbGV0ZWQgYmV0d2VlbiBjYXB0dXJlICsgZW1pdC5cbiAgICBvcnBoYW5lZEZlZWRiYWNrPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBTdWJzZXQgb2YgbHVjaWRlLmRldiBpY29ucyBpbmxpbmVkIGFzIFNWRyBpbm5lci1tYXJrdXAuXG4vLyBFYWNoIGVudHJ5IGlzIHRoZSBib2R5IG9mIDxzdmcgLi4uID4gLi4uIDwvc3ZnPjsgc3ZnU3RyaW5nKCkgd3JhcHMgaXQuXG4vLyBTaXplcyBkZWZhdWx0IHRvIDE2OyBvdmVycmlkZSB3aXRoIHRoZSBzaXplIGFyZ3VtZW50LlxuLy9cbi8vIE1JVCDigJQgaHR0cHM6Ly9naXRodWIuY29tL2x1Y2lkZS1pY29ucy9sdWNpZGVcblxuY29uc3QgSUNPTlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjaGV2cm9uLXJpZ2h0JzogJzxwYXRoIGQ9XCJtOSAxOCA2LTYtNi02XCIvPicsXG4gICdjaGV2cm9uLWRvd24nOiAnPHBhdGggZD1cIm02IDkgNiA2IDYtNlwiLz4nLFxuICBjb3B5OiAnPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgeD1cIjhcIiB5PVwiOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTQgMTZjLTEuMSAwLTItLjktMi0yVjRjMC0xLjEuOS0yIDItMmgxMGMxLjEgMCAyIC45IDIgMlwiLz4nLFxuICBwZW5jaWw6ICc8cGF0aCBkPVwiTTIxLjE3NCA2LjgxMmExIDEgMCAwIDAtMy45ODYtMy45ODdMMy44NDIgMTYuMTc0YTIgMiAwIDAgMC0uNS44M2wtMS4zMjEgNC4zNTJhLjUuNSAwIDAgMCAuNjIzLjYyMmw0LjM1My0xLjMyYTIgMiAwIDAgMCAuODMtLjQ5N3pcIi8+PHBhdGggZD1cIm0xNSA1IDQgNFwiLz4nLFxuICAndHJhc2gtMic6ICc8cGF0aCBkPVwiTTMgNmgxOFwiLz48cGF0aCBkPVwiTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNlwiLz48cGF0aCBkPVwiTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeDI9XCIxMFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB4Mj1cIjE0XCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+JyxcbiAgcGx1czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz48cGF0aCBkPVwiTTEyIDV2MTRcIi8+JyxcbiAgeDogJzxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPicsXG4gIG1pbnVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPicsXG4gIHNlYXJjaDogJzxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiLz48cGF0aCBkPVwibTIxIDIxLTQuMy00LjNcIi8+JyxcbiAgZG93bmxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjcgMTAgMTIgMTUgMTcgMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjE1XCIgeTI9XCIzXCIvPicsXG4gIHVwbG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTcgOCAxMiAzIDcgOFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiM1wiIHkyPVwiMTVcIi8+JyxcbiAgZ2l0aHViOiAnPHBhdGggZD1cIk0xNSAyMnYtNGE0LjggNC44IDAgMCAwLTEtMy41YzMgMCA2LTIgNi01LjUuMDgtMS4yNS0uMjctMi40OC0xLTMuNS4yOC0xLjE1LjI4LTIuMzUgMC0zLjUgMCAwLTEgMC0zIDEuNS0yLjY0LS41LTUuMzYtLjUtOCAwQzYgMiA1IDIgNSAyYy0uMyAxLjE1LS4zIDIuMzUgMCAzLjVBNS40IDUuNCAwIDAgMCA0IDljMCAzLjUgMyA1LjUgNiA1LjUtLjM5LjQ5LS42OCAxLjA1LS44NSAxLjY1LS4xNy42LS4yMiAxLjIzLS4xNSAxLjg1djRcIi8+PHBhdGggZD1cIk05IDE4Yy00LjUxIDItNS0yLTctMlwiLz4nLFxuICBzdGFyOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiLz4nLFxuICAnY2lyY2xlLWRvdCc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgY3Jvc3NoYWlyOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjIyXCIgeDI9XCIxOFwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiNlwiIHgyPVwiMlwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI2XCIgeTI9XCIyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIyMlwiIHkyPVwiMThcIi8+JyxcbiAgdGFyZ2V0OiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjZcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIyXCIvPicsXG4gICdwYW5lbC1sZWZ0LWNsb3NlJzogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIi8+PHBhdGggZD1cIk05IDN2MThcIi8+PHBhdGggZD1cIm0xNiAxNS0zLTMgMy0zXCIvPicsXG4gICdleHRlcm5hbC1saW5rJzogJzxwYXRoIGQ9XCJNMTUgM2g2djZcIi8+PHBhdGggZD1cIk0xMCAxNCAyMSAzXCIvPjxwYXRoIGQ9XCJNMTggMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNlwiLz4nLFxuICAnbWVzc2FnZS1zcXVhcmUtcGx1cyc6ICc8cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48bGluZSB4MT1cIjlcIiB4Mj1cIjE1XCIgeTE9XCIxMFwiIHkyPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjdcIiB5Mj1cIjEzXCIvPicsXG4gICdhbGVydC1jaXJjbGUnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiOFwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTIuMDFcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICAncmVmcmVzaC1jdyc6ICc8cGF0aCBkPVwiTTMgMTJhOSA5IDAgMCAxIDE1LTYuN0wyMSA4XCIvPjxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPjxwYXRoIGQ9XCJNMjEgMTJhOSA5IDAgMCAxLTE1IDYuN0wzIDE2XCIvPjxwYXRoIGQ9XCJNMyAyMXYtNWg1XCIvPicsXG4gICdmaWxlLXRleHQnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxM1wiIHkyPVwiMTNcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTdcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjhcIiB5MT1cIjlcIiB5Mj1cIjlcIi8+JyxcbiAgJ2ZpbGUtY29kZSc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxwYXRoIGQ9XCJtMTAgMTMtMiAyIDIgMlwiLz48cGF0aCBkPVwibTE0IDE3IDItMi0yLTJcIi8+JyxcbiAgaW1hZ2U6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCI5XCIgcj1cIjJcIi8+PHBhdGggZD1cIm0yMSAxNS0zLjA4Ni0zLjA4NmEyIDIgMCAwIDAtMi44MjggMEw2IDIxXCIvPicsXG4gIC8vIFN0eWxpc2VkIFwicGluY2hcIiDigJQgdHdvIG9wcG9zaW5nIGN1cnZlcyBtZWV0aW5nIGF0IGEgY2VudGVyIGRvdC5cbiAgcGluY2g6ICc8cGF0aCBkPVwiTTUgNWMzIDIgNSA0IDcgNy0yIDMtNCA1LTcgN1wiLz48cGF0aCBkPVwiTTE5IDVjLTMgMi01IDQtNyA3IDIgMyA0IDUgNyA3XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMS41XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICAnc3Rhci1maWxsZWQnOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgcGluOiAnPHBhdGggZD1cIk0xMiAxN3Y1XCIvPjxwYXRoIGQ9XCJNOSAxMC43NmEyIDIgMCAwIDEtMS4xMSAxLjc5bC0xLjc4LjlBMiAyIDAgMCAwIDUgMTUuMjRWMTZhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xdi0uNzZhMiAyIDAgMCAwLTEuMTEtMS43OWwtMS43OC0uOUEyIDIgMCAwIDEgMTUgMTAuNzZWN2ExIDEgMCAwIDEgMS0xIDIgMiAwIDAgMCAwLTRIOGEyIDIgMCAwIDAgMCA0IDEgMSAwIDAgMSAxIDF6XCIvPicsXG4gIHVuZG86ICc8cGF0aCBkPVwiTTMgN3Y2aDZcIi8+PHBhdGggZD1cIk0yMSAxN2E5IDkgMCAwIDAtMTUtNi43TDMgMTNcIi8+JyxcbiAgcmVkbzogJzxwYXRoIGQ9XCJNMjEgN3Y2aC02XCIvPjxwYXRoIGQ9XCJNMyAxN2E5IDkgMCAwIDEgMTUtNi43TDIxIDEzXCIvPicsXG4gIGZvbGRlcjogJzxwYXRoIGQ9XCJNMjAgMjBhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJoLTcuOTNhMiAyIDAgMCAxLTEuNjYtLjlsLS44Mi0xLjJBMiAyIDAgMCAwIDcuOTMgM0g0YTIgMiAwIDAgMC0yIDJ2MTNhMiAyIDAgMCAwIDIgMlpcIi8+JyxcbiAgY2hlY2s6ICc8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIi8+JyxcbiAgJ2NpcmNsZS1jaGVjayc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtOSAxMiAyIDIgNC00XCIvPicsXG4gIGdyaXA6ICc8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTlcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjE5XCIgcj1cIjFcIi8+JyxcbiAgc2V0dGluZ3M6ICc8cGF0aCBkPVwiTTEyLjIyIDJoLS40NGEyIDIgMCAwIDAtMiAydi4xOGEyIDIgMCAwIDEtMSAxLjczbC0uNDMuMjVhMiAyIDAgMCAxLTIgMGwtLjE1LS4wOGEyIDIgMCAwIDAtMi43My43M2wtLjIyLjM4YTIgMiAwIDAgMCAuNzMgMi43M2wuMTUuMWEyIDIgMCAwIDEgMSAxLjcydi41MWEyIDIgMCAwIDEtMSAxLjc0bC0uMTUuMDlhMiAyIDAgMCAwLS43MyAyLjczbC4yMi4zOGEyIDIgMCAwIDAgMi43My43M2wuMTUtLjA4YTIgMiAwIDAgMSAyIDBsLjQzLjI1YTIgMiAwIDAgMSAxIDEuNzNWMjBhMiAyIDAgMCAwIDIgMmguNDRhMiAyIDAgMCAwIDItMnYtLjE4YTIgMiAwIDAgMSAxLTEuNzNsLjQzLS4yNWEyIDIgMCAwIDEgMiAwbC4xNS4wOGEyIDIgMCAwIDAgMi43My0uNzNsLjIyLS4zOWEyIDIgMCAwIDAtLjczLTIuNzNsLS4xNS0uMDhhMiAyIDAgMCAxLTEtMS43NHYtLjVhMiAyIDAgMCAxIDEtMS43NGwuMTUtLjA5YTIgMiAwIDAgMCAuNzMtMi43M2wtLjIyLS4zOGEyIDIgMCAwIDAtMi43My0uNzNsLS4xNS4wOGEyIDIgMCAwIDEtMiAwbC0uNDMtLjI1YTIgMiAwIDAgMS0xLTEuNzNWNGEyIDIgMCAwIDAtMi0yelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+JyxcbiAgaW5mbzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xMiAxNnYtNFwiLz48cGF0aCBkPVwiTTEyIDhoLjAxXCIvPicsXG4gIC8vIFRyZWUtb2Ytcm93cyDigJQgdXNlZCBmb3IgXCJTcGxpdCBncm91cFwiIGFjdGlvbiAoZGVub3RlcyBvbmUgbm9kZSBmYW5uaW5nXG4gIC8vIG91dCBpbnRvIHNpYmxpbmdzKS4gTHVjaWRlJ3MgYGxpc3QtdHJlZWAuXG4gICdsaXN0LXRyZWUnOiAnPHBhdGggZD1cIk0yMSAxMmgtOFwiLz48cGF0aCBkPVwiTTIxIDZIOFwiLz48cGF0aCBkPVwiTTIxIDE4aC04XCIvPjxwYXRoIGQ9XCJNMyA2djRjMCAxLjEuOSAyIDIgMmgzXCIvPjxwYXRoIGQ9XCJNMyAxMHY2YzAgMS4xLjkgMiAyIDJoM1wiLz4nLFxuICAvLyBHZW5lcmljIHNwbGl0IGljb24gYXMgYSBmYWxsYmFjayBvcHRpb24uXG4gIHNwbGl0OiAnPHBhdGggZD1cIk0xNiAzaDV2NVwiLz48cGF0aCBkPVwiTTggM0gzdjVcIi8+PHBhdGggZD1cIm0yMSAzLTcuNDYgNy40NmEyIDIgMCAwIDAgMCAyLjgzTDIxIDIxXCIvPjxwYXRoIGQ9XCJNMyAzbDcuNDYgNy40NmEyIDIgMCAwIDEgMCAyLjgzTDMgMjFcIi8+JyxcbiAgLy8gQ2FyZGJvYXJkLXN0eWxlIGJveCB1c2VkIGZvciBcIkV4cG9ydCB3b3Jrc3BhY2UgYXMgWklQXCIuXG4gIHBhY2thZ2U6ICc8cGF0aCBkPVwibTcuNSA0LjI3IDkgNS4xNVwiLz48cGF0aCBkPVwiTTIxIDhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2WlwiLz48cGF0aCBkPVwiTTMuMyA3IDEyIDEybDguNy01XCIvPjxwYXRoIGQ9XCJNMTIgMjJWMTJcIi8+JyxcbiAgLy8gVHdvIGludGVybG9ja2luZyBsaW5rcyDigJQgdXNlZCBmb3IgXCJDb3B5IGFzIHBhdGhcIi5cbiAgbGluazogJzxwYXRoIGQ9XCJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwiTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxXCIvPicsXG4gIC8vIERhdGFiYXNlL2R1Y2sgaWNvbiBmb3IgdGhlIER1Y2tEQiBwYWxldHRlIGNvbW1hbmQuXG4gIGRhdGFiYXNlOiAnPGVsbGlwc2UgY3g9XCIxMlwiIGN5PVwiNVwiIHJ4PVwiOVwiIHJ5PVwiM1wiLz48cGF0aCBkPVwiTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNVwiLz48cGF0aCBkPVwiTTMgMTJBOSAzIDAgMCAwIDIxIDEyXCIvPicsXG59O1xuXG5jb25zdCB3cmFwID0gKGJvZHk6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPiR7Ym9keX08L3N2Zz5gO1xuXG5leHBvcnQgY29uc3QgUEdfSUNPTlMgPSB7XG4gIGhhczogKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4gbmFtZSBpbiBJQ09OUyxcbiAgc3ZnU3RyaW5nOiAobmFtZTogc3RyaW5nLCBzaXplID0gMTYpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBJQ09OU1tuYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2x1Y2lkZV0gbWlzc2luZyBpY29uJywgbmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiB3cmFwKGJvZHksIHNpemUpO1xuICB9LFxuICBtb3VudDogKGVsOiBFbGVtZW50IHwgbnVsbCwgbmFtZTogc3RyaW5nLCBzaXplPzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKGVsKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gIH0sXG59O1xuXG4vLyBTaWRlLWVmZmVjdCBmb3IgbGVnYWN5IHNjcmlwdC10YWcgaW5jbHVzaW9uIChzaWRlcGFuZWwuaHRtbCBzdGlsbCA8c2NyaXB0XG4vLyBzcmM9XCJsdWNpZGUuanNcIj4g4oCUIHByZS1idW5kbGUpLiBSZS1leHBvc2VzIHRoZSByZWdpc3RyeSBvbiBnbG9iYWxUaGlzLlxuaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBHX0lDT05TID0gUEdfSUNPTlM7XG59XG4iLAogICAgIi8vIFVTVEFSLWZvcm1hdCB0YXIgZW5jb2Rlci4gRWFjaCBlbnRyeSBpcyBhIDUxMi1ieXRlIGhlYWRlciBmb2xsb3dlZCBieVxuLy8gY29udGVudCBieXRlcyBwYWRkZWQgdXAgdG8gdGhlIG5leHQgNTEyLWJ5dGUgYm91bmRhcnkuIFRoZSBhcmNoaXZlIGVuZHNcbi8vIHdpdGggdHdvIHplcm8tZmlsbGVkIDUxMi1ieXRlIGJsb2Nrcy4gfjgwIGxpbmVzLCBubyBkZXBlbmRlbmNpZXMuXG4vL1xuLy8gV2UgcGljayB0YXIgKHJhdGhlciB0aGFuIHppcCkgYmVjYXVzZSB6c3RkIGlzIHRoZSB3aXJlIGZvcm1hdCB3ZSB3YW50IHRvXG4vLyBwYWlyIGl0IHdpdGggYW5kIHRhci56c3QgaXMgdGhlIHN0YW5kYXJkIGNvbWJvICh6aXAgaXMgaXRzIG93blxuLy8gY29tcHJlc3Npb24gY29udGFpbmVyKS4gRm9yIGZpbGVzIHdpdGggcGF0aHMgbG9uZ2VyIHRoYW4gMTAwIGNoYXJzIHdlXG4vLyB0aHJvdyByYXRoZXIgdGhhbiBpbXBsZW1lbnQgdGhlIEdOVS9QQVggbG9uZy1uYW1lIGV4dGVuc2lvbnMg4oCUIHRoZVxuLy8gUGluY2hHcmFiIGFyY2hpdmUgbGF5b3V0IHVzZXMgc2hvcnQgcGF0aHMgb25seS5cblxuY29uc3QgZW5jID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmNvbnN0IHdyaXRlT2N0YWwgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgLy8gdGFyIGZpZWxkcyBhcmUgemVyby1wYWRkZWQgbnVsbC10ZXJtaW5hdGVkIG9jdGFsIHN0cmluZ3MuXG4gIGxldCBzID0gdmFsdWUudG9TdHJpbmcoOCk7XG4gIHMgPSBzLnBhZFN0YXJ0KGxlbmd0aCAtIDEsICcwJyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIC0gMTsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBzLmNoYXJDb2RlQXQoaSk7XG4gIGJ1ZltvZmZzZXQgKyBsZW5ndGggLSAxXSA9IDA7XG59O1xuXG5jb25zdCB3cml0ZUFzY2lpID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHN0cjogc3RyaW5nLCBsZW5ndGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICBjb25zdCBieXRlcyA9IGVuYy5lbmNvZGUoc3RyKTtcbiAgY29uc3QgbGVuID0gTWF0aC5taW4oYnl0ZXMubGVuZ3RoLCBsZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXSE7XG59O1xuXG5jb25zdCBoZWFkZXJDaGVja3N1bSA9IChoZWFkZXI6IFVpbnQ4QXJyYXkpOiBudW1iZXIgPT4ge1xuICAvLyBUaGUgY2hlY2tzdW0gZmllbGQgKDggYnl0ZXMgYXQgb2Zmc2V0IDE0OCkgaXMgdHJlYXRlZCBhcyBBU0NJSSBzcGFjZXNcbiAgLy8gZHVyaW5nIGNvbXB1dGF0aW9uLCB0aGVuIHRoZSBhY3R1YWwgY2hlY2tzdW0gaXMgd3JpdHRlbiBpbnRvIGl0LlxuICBsZXQgc3VtID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MTI7IGkrKykge1xuICAgIGlmIChpID49IDE0OCAmJiBpIDwgMTU2KSBzdW0gKz0gMHgyMDtcbiAgICBlbHNlIHN1bSArPSBoZWFkZXJbaV0gPz8gMDtcbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuZXhwb3J0IHR5cGUgVGFyRW50cnkgPSB7XG4gIG5hbWU6IHN0cmluZztcbiAgZGF0YTogVWludDhBcnJheSB8IHN0cmluZztcbiAgbXRpbWU/OiBudW1iZXI7IC8vIHVuaXggZXBvY2ggc2Vjb25kczsgZGVmYXVsdHMgdG8gbm93XG59O1xuXG5leHBvcnQgY29uc3QgYnVpbGRUYXIgPSAoZW50cmllczogVGFyRW50cnlbXSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBjb25zdCBub3dTZWMgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlbnRyeS5kYXRhID09PSAnc3RyaW5nJyA/IGVuYy5lbmNvZGUoZW50cnkuZGF0YSkgOiBlbnRyeS5kYXRhO1xuICAgIGNvbnN0IG5hbWUgPSBlbnRyeS5uYW1lO1xuICAgIGlmIChuYW1lLmxlbmd0aCA+IDEwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0YXI6IGZpbGVuYW1lIHRvbyBsb25nICgke25hbWUubGVuZ3RofSA+IDEwMCBjaGFycyk6ICR7bmFtZX1gKTtcbiAgICB9XG4gICAgY29uc3QgaGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMCwgbmFtZSwgMTAwKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTAwLCAwbzY0NCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vZGVcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTA4LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMTYsIDAsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2lkXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEyNCwgZGF0YS5sZW5ndGgsIDEyKTsgICAgICAgICAgICAgICAgICAvLyBzaXplXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEzNiwgZW50cnkubXRpbWUgPz8gbm93U2VjLCAxMik7ICAgICAgICAvLyBtdGltZVxuICAgIGZvciAobGV0IGkgPSAxNDg7IGkgPCAxNTY7IGkrKykgaGVhZGVyW2ldID0gMHgyMDsgICAgICAgICAgLy8gY2hlY2tzdW0gcGxhY2Vob2xkZXJcbiAgICBoZWFkZXJbMTU2XSA9IDB4MzA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHR5cGVmbGFnICcwJyA9IHJlZ3VsYXIgZmlsZVxuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAyNTcsICd1c3RhcicsIDYpOyAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjYzLCAnMDAnLCAyKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZlcnNpb25cbiAgICAvLyB1bmFtZS9nbmFtZS9kZXZtYWpvci9kZXZtaW5vci9wcmVmaXggYWxsIGxlZnQgemVyby5cblxuICAgIGNvbnN0IGNoZWNrc3VtID0gaGVhZGVyQ2hlY2tzdW0oaGVhZGVyKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTQ4LCBjaGVja3N1bSwgOCk7XG5cbiAgICBibG9ja3MucHVzaChoZWFkZXIpO1xuICAgIGJsb2Nrcy5wdXNoKGRhdGEpO1xuICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoZGF0YS5sZW5ndGggJSA1MTIpKSAlIDUxMjtcbiAgICBpZiAocGFkKSBibG9ja3MucHVzaChuZXcgVWludDhBcnJheShwYWQpKTtcbiAgfVxuICAvLyBUcmFpbGVyOiB0d28gY29uc2VjdXRpdmUgNTEyLWJ5dGUgemVybyBibG9ja3MuXG4gIGJsb2Nrcy5wdXNoKG5ldyBVaW50OEFycmF5KDEwMjQpKTtcblxuICBsZXQgdG90YWwgPSAwO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgeyBvdXQuc2V0KGIsIG9mZnNldCk7IG9mZnNldCArPSBiLmxlbmd0aDsgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8g4pSA4pSA4pSAIFpzdGQgcmF3LWJsb2NrIGZyYW1lIHdyaXRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vXG4vLyBDb21wcmVzc2lvblN0cmVhbSgnenN0ZCcpIGlzbid0IHNoaXBwZWQgaW4gY3VycmVudCBDaHJvbWl1bSAodmVyaWZpZWQgdmlhXG4vLyBydW50aW1lIHByb2JlKSwgc28gd2Ugd3JpdGUgYSB2YWxpZCB6c3RkIGZyYW1lIGNvbnRhaW5pbmcgb25lIG9yIG1vcmVcbi8vIHJhdyAodW5jb21wcmVzc2VkKSBibG9ja3MuIFRoZSBvdXRwdXQgaXMgc3RydWN0dXJhbGx5IGEgcmVhbCBgLnRhci56c3RgXG4vLyBmaWxlOiBgenN0ZCAtZGAgYWNjZXB0cyBpdCwgNy1aaXAgYWNjZXB0cyBpdCwgbGlienN0ZCBhY2NlcHRzIGl0LiBJdFxuLy8ganVzdCBkb2Vzbid0IGFjdHVhbGx5IGNvbXByZXNzIOKAlCBmb3Igb3VyIHBheWxvYWQsIHdoaWNoIGlzIG1vc3RseSBQTkdcbi8vIChhbHJlYWR5IGNvbXByZXNzZWQpIHBsdXMgYSBmZXcgS0Igb2YgSlNPTkwvTWFya2Rvd24sIHRoZSBsb3NzIHZzLiByZWFsXG4vLyBERUZMQVRFIGlzIHNpbmdsZS1kaWdpdCBwZXJjZW50LlxuLy9cbi8vIEZyYW1lIGxheW91dCAocGVyIFJGQyA4ODc4ICsgWnN0YW5kYXJkIGZvcm1hdCBzcGVjKTpcbi8vICAgbWFnaWNfbnVtYmVyICAgICAgIDQgYnl0ZXMgIDB4MjggMHhCNSAweDJGIDB4RkQgKExFOiAweEZEMkZCNTI4KVxuLy8gICBGSEQgICAgICAgICAgICAgICAgMSBieXRlICAgRkNTX3NpemU9MiAoNC1ieXRlIEZDUyksIFNpbmdsZV9TZWdtZW50PTFcbi8vICAgRkNTICAgICAgICAgICAgICAgIDQgYnl0ZXMgIHVuY29tcHJlc3NlZCBwYXlsb2FkIHNpemUgKHUzMiBMRSlcbi8vICAgYmxvY2tzICAgICAgICAgICAgIE4gYmxvY2tzIGVhY2g6IDMtYnl0ZSBoZWFkZXIgKyBwYXlsb2FkXG4vL1xuLy8gQmxvY2sgaGVhZGVyICgzIGJ5dGVzIExFKTpcbi8vICAgYml0IDAgICAgICAgTGFzdF9CbG9jayBmbGFnXG4vLyAgIGJpdHMgMS4uMiAgIEJsb2NrX1R5cGUgKDAwID0gUmF3LCAwMSA9IFJMRSwgMTAgPSBDb21wcmVzc2VkLCAxMSA9IFJlc2VydmVkKVxuLy8gICBiaXRzIDMuLjIzICBCbG9ja19TaXplIChtYXggMTI4IEtpQiBmb3IgcmF3IC8gUkxFKVxuLy9cbi8vIFdlIGNodW5rIGludG8gMTI4IEtpQiByYXcgYmxvY2tzIHRvIHJlc3BlY3QgdGhlIHBlci1ibG9jayBzaXplIGxpbWl0LlxuXG5jb25zdCBaU1REX1JBV19CTE9DS19NQVggPSAxMjggKiAxMDI0O1xuXG5leHBvcnQgY29uc3Qgd3JhcFpzdGQgPSAoZGF0YTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBsZXQgcG9zID0gMDtcbiAgd2hpbGUgKHBvcyA8IGRhdGEubGVuZ3RoIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc3QgcmVtYWluaW5nID0gZGF0YS5sZW5ndGggLSBwb3M7XG4gICAgY29uc3QgYmxvY2tTaXplID0gTWF0aC5taW4ocmVtYWluaW5nLCBaU1REX1JBV19CTE9DS19NQVgpO1xuICAgIGNvbnN0IGlzTGFzdCA9IHBvcyArIGJsb2NrU2l6ZSA+PSBkYXRhLmxlbmd0aCA/IDEgOiAwO1xuICAgIGNvbnN0IGhlYWRlckludCA9IGlzTGFzdCB8ICgwIDw8IDEpIHwgKGJsb2NrU2l6ZSA8PCAzKTsgLy8gdHlwZT1yYXc9MFxuICAgIGNvbnN0IGJsb2NrSGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgaGVhZGVySW50ICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDgpICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDE2KSAmIDB4ZmYsXG4gICAgXSk7XG4gICAgYmxvY2tzLnB1c2goYmxvY2tIZWFkZXIpO1xuICAgIGlmIChibG9ja1NpemUgPiAwKSBibG9ja3MucHVzaChkYXRhLnN1YmFycmF5KHBvcywgcG9zICsgYmxvY2tTaXplKSk7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIGJyZWFrO1xuICB9XG4gIGNvbnN0IGZjcyA9IGRhdGEubGVuZ3RoO1xuICBjb25zdCBmaGQgPSAwYjEwMTBfMDAwMDsgLy8gRkNTX3NpemU9MTAgKDQgYnl0ZXMpIHwgU2luZ2xlX1NlZ21lbnQ9MVxuICBjb25zdCBoZWFkID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgIDB4MjgsIDB4YjUsIDB4MmYsIDB4ZmQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICBmaGQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZIRFxuICAgIGZjcyAmIDB4ZmYsIChmY3MgPj4+IDgpICYgMHhmZiwgKGZjcyA+Pj4gMTYpICYgMHhmZiwgKGZjcyA+Pj4gMjQpICYgMHhmZixcbiAgXSk7XG4gIGxldCB0b3RhbCA9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2ZmID0gMDtcbiAgb3V0LnNldChoZWFkLCBvZmYpOyBvZmYgKz0gaGVhZC5sZW5ndGg7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmYpOyBvZmYgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIENvbXBhbmlvbiBkZWNvZGVyIGZvciBvdXIgb3duIHdyaXRlciDigJQgdXNlZCBieSB0ZXN0cy4gQWNjZXB0cyBhbnkgenN0ZFxuLy8gZnJhbWUgd3JpdHRlbiBieSBgd3JhcFpzdGRgIChzaW5nbGUgUmF3X0Jsb2NrIHN0cmVhbSwgNC1ieXRlIEZDUyxcbi8vIHNpbmdsZS1zZWdtZW50LCBubyBjaGVja3N1bSwgbm8gZGljdCkuIFRocm93cyBvbiBhbnl0aGluZyBlbHNlIHNvIHRlc3RzXG4vLyBmYWlsIGxvdWRseSByYXRoZXIgdGhhbiBzaWxlbnRseSBtaXMtcGFyc2UuXG5leHBvcnQgY29uc3QgdW53cmFwWnN0ZCA9IChmcmFtZTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBpZiAoZnJhbWUubGVuZ3RoIDwgOSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBmcmFtZSB0b28gc2hvcnQnKTtcbiAgaWYgKGZyYW1lWzBdICE9PSAweDI4IHx8IGZyYW1lWzFdICE9PSAweGI1IHx8IGZyYW1lWzJdICE9PSAweDJmIHx8IGZyYW1lWzNdICE9PSAweGZkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBiYWQgbWFnaWMgbnVtYmVyJyk7XG4gIH1cbiAgY29uc3QgZmhkID0gZnJhbWVbNF0hO1xuICBjb25zdCBmY3NTaXplRmxhZyA9IChmaGQgPj4+IDYpICYgMGIxMTtcbiAgY29uc3Qgc2luZ2xlU2VnbWVudCA9ICgoZmhkID4+PiA1KSAmIDEpID09PSAxO1xuICBjb25zdCBjaGVja3N1bSA9ICgoZmhkID4+PiAyKSAmIDEpID09PSAxO1xuICBjb25zdCBkaWN0SWQgPSBmaGQgJiAwYjExO1xuICBpZiAoIXNpbmdsZVNlZ21lbnQpIHRocm93IG5ldyBFcnJvcignenN0ZDogb25seSBTaW5nbGVfU2VnbWVudCBmcmFtZXMgc3VwcG9ydGVkJyk7XG4gIGlmIChjaGVja3N1bSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBjb250ZW50IGNoZWNrc3VtIG5vdCBzdXBwb3J0ZWQnKTtcbiAgaWYgKGRpY3RJZCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBkaWN0aW9uYXJpZXMgbm90IHN1cHBvcnRlZCcpO1xuICBsZXQgcG9zID0gNTtcbiAgbGV0IGZjcyA9IDA7XG4gIGlmIChmY3NTaXplRmxhZyA9PT0gMGIwMCkgeyBmY3MgPSBmcmFtZVtwb3NdITsgcG9zICs9IDE7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDEpIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpOyBmY3MgKz0gMjU2OyBwb3MgKz0gMjsgfVxuICBlbHNlIGlmIChmY3NTaXplRmxhZyA9PT0gMGIxMCkgeyBmY3MgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KSB8IChmcmFtZVtwb3MgKyAzXSEgKiAweDEwMDAwMDApOyBwb3MgKz0gNDsgfVxuICBlbHNlIHRocm93IG5ldyBFcnJvcignenN0ZDogOC1ieXRlIEZDUyB1bnN1cHBvcnRlZCcpO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShmY3MpO1xuICBsZXQgb3V0UG9zID0gMDtcbiAgZm9yICg7Oykge1xuICAgIGlmIChwb3MgKyAzID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBoZWFkZXInKTtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KTtcbiAgICBwb3MgKz0gMztcbiAgICBjb25zdCBpc0xhc3QgPSAoaGVhZGVySW50ICYgMSkgPT09IDE7XG4gICAgY29uc3QgYmxvY2tUeXBlID0gKGhlYWRlckludCA+Pj4gMSkgJiAwYjExO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IChoZWFkZXJJbnQgPj4+IDMpICYgMHgxZl9mZl9mZjtcbiAgICBpZiAoYmxvY2tUeXBlICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoYHpzdGQ6IG9ubHkgUmF3X0Jsb2NrICgwKSBzdXBwb3J0ZWQsIGdvdCAke2Jsb2NrVHlwZX1gKTtcbiAgICBpZiAocG9zICsgYmxvY2tTaXplID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBwYXlsb2FkJyk7XG4gICAgb3V0LnNldChmcmFtZS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSksIG91dFBvcyk7XG4gICAgb3V0UG9zICs9IGJsb2NrU2l6ZTtcbiAgICBwb3MgKz0gYmxvY2tTaXplO1xuICAgIGlmIChpc0xhc3QpIGJyZWFrO1xuICB9XG4gIGlmIChvdXRQb3MgIT09IGZjcykgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBGQ1MgbWlzbWF0Y2ggKGdvdCAke291dFBvc30sIGV4cGVjdGVkICR7ZmNzfSlgKTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBUYXIgbGlzdGluZyBkZWNvZGVyICh0ZXN0LW9ubHkpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gV2Fsa3MgYSB0YXIgYnl0ZSBidWZmZXIsIHJldHVybmluZyB7bmFtZSwgZGF0YX0gZm9yIGVhY2ggZW50cnkuIFN0b3BzIGF0XG4vLyB0aGUgdHJhaWxlciAodHdvIHplcm8gYmxvY2tzKS4gT25seSByZWFkcyB0aGUgZmllbGRzIFBpbmNoR3JhYiB3cml0ZXMuXG5cbmV4cG9ydCB0eXBlIFBhcnNlZFRhckVudHJ5ID0ge25hbWU6IHN0cmluZzsgZGF0YTogVWludDhBcnJheTsgc2l6ZTogbnVtYmVyfTtcblxuY29uc3QgZGVjID0gbmV3IFRleHREZWNvZGVyKCk7XG5cbmNvbnN0IHJlYWROdWxsU3RyID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgbGV0IGVuZCA9IG9mZnNldCArIGxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IG9mZnNldDsgaSA8IG9mZnNldCArIGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA9PT0gMCkgeyBlbmQgPSBpOyBicmVhazsgfVxuICB9XG4gIHJldHVybiBkZWMuZGVjb2RlKGJ1Zi5zdWJhcnJheShvZmZzZXQsIGVuZCkpO1xufTtcblxuY29uc3QgcmVhZE9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgY29uc3QgcyA9IHJlYWROdWxsU3RyKGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpLnRyaW0oKTtcbiAgcmV0dXJuIHMgPyBwYXJzZUludChzLCA4KSA6IDA7XG59O1xuXG5leHBvcnQgY29uc3QgcGFyc2VUYXIgPSAoYnVmOiBVaW50OEFycmF5KTogUGFyc2VkVGFyRW50cnlbXSA9PiB7XG4gIGNvbnN0IGVudHJpZXM6IFBhcnNlZFRhckVudHJ5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgKyA1MTIgPD0gYnVmLmxlbmd0aCkge1xuICAgIGNvbnN0IGhlYWRlciA9IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIDUxMik7XG4gICAgbGV0IGFsbFplcm8gPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHsgaWYgKGhlYWRlcltpXSAhPT0gMCkgeyBhbGxaZXJvID0gZmFsc2U7IGJyZWFrOyB9IH1cbiAgICBpZiAoYWxsWmVybykgYnJlYWs7IC8vIHRyYWlsZXJcbiAgICBjb25zdCBuYW1lID0gcmVhZE51bGxTdHIoaGVhZGVyLCAwLCAxMDApO1xuICAgIGNvbnN0IHNpemUgPSByZWFkT2N0YWwoaGVhZGVyLCAxMjQsIDEyKTtcbiAgICBwb3MgKz0gNTEyO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgZW50cmllcy5wdXNoKHtuYW1lLCBzaXplLCBkYXRhOiBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyBzaXplKX0pO1xuICAgICAgcG9zICs9IHNpemU7XG4gICAgICBjb25zdCBwYWQgPSAoNTEyIC0gKHNpemUgJSA1MTIpKSAlIDUxMjtcbiAgICAgIHBvcyArPSBwYWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBlbnRyaWVzO1xufTtcbiIsCiAgICAiLy8gQXV0by1nZW5lcmF0ZWQgYnkgc2NyaXB0cy9idWlsZC1leHRlbnNpb24udHMg4oCUIGRvIG5vdCBlZGl0LlxuLy8gVGVsbHMgdGhlIHNpZGVwYW5lbCB3aGljaCB0ZW1wbGF0ZSByZXNvdXJjZXMgZXhpc3QgaW4gdGhpcyBidWlsZC5cbi8vIEFjdHVhbCBjb250ZW50IGxpdmVzIGFzIC5tZCBmaWxlcyB1bmRlciBleHRlbnNpb24vdGVtcGxhdGVzLywgbG9hZGVkXG4vLyBsYXppbHkgdmlhIGNocm9tZS5ydW50aW1lLmdldFVSTCDigJQgc2VlIGxvYWRUZW1wbGF0ZSgpIGluIHNpZGVwYW5lbC50cy5cbmV4cG9ydCBjb25zdCBURU1QTEFURVNfUFJFU0VOVCA9IHtcImRlc2lnblRlbXBsYXRlXCI6dHJ1ZSxcInNraWxsVGVtcGxhdGVcIjp0cnVlLFwibG9jYWxEZXNpZ25cIjp0cnVlLFwibG9jYWxTa2lsbFwiOnRydWV9IGFzIGNvbnN0O1xuIiwKICAgICIvLyBTaW5nbGUtY2FwdHVyZSBmdWxsIGV4cG9ydC5cbi8vXG4vLyBcIkNvcHkgY2FwdHVyZSBhcyBKU09OXCIgd2FudHMgYSBDT01QTEVURSwgc2VsZi1jb250YWluZWQgdGV4dHVhbCBleHBvcnQgb2Zcbi8vIE9ORSBjYXB0dXJlOiBpdHMgc2VsZWN0b3JzL3BhdGhzLCBlbGVtZW50IHRleHQvY29udGVudCwgb3V0ZXJIVE1MLFxuLy8gbWV0YWRhdGEsIEFORCBldmVyeSBub3RlL2NvbW1lbnQgYXR0YWNoZWQgdG8gaXQg4oCUIGV2ZXJ5dGhpbmcgYSBmdWxsXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IGNhcnJpZXMsIGJ1dCBzY29wZWQgdG8gYSBzaW5nbGUgZWxlbWVudC5cbi8vXG4vLyBUaGUgcGFuZWwgbW9kZWxzIGEgY2FwdHVyZSBhcyBhbiBgRW50cnlgIChzcmMvdHlwZXMudHMpIHBsdXMgemVybyBvciBtb3JlXG4vLyBgRmVlZGJhY2tNZXNzYWdlYCByb3dzIGxpbmtlZCBiYWNrIHZpYSBgcGFyZW50VWlkIOKGkiBFbnRyeS51aWRgLiBCZWNhdXNlXG4vLyBub3RlcyBsaXZlIG9uIHNlcGFyYXRlIHJvd3MsIHRoZSBzZXJpYWxpemVyIHRha2VzIHRoZSBjYXB0dXJlIGVudHJ5IGFuZFxuLy8gaXRzIGZlZWRiYWNrIHJvd3MgdG9nZXRoZXIgc28gdGhlIEpTT04gaXMgZ2VudWluZWx5IHNlbGYtY29udGFpbmVkIOKAlCBhXG4vLyBjYWxsZXIgY2FuIGhhbmQgdGhlIG91dHB1dCB0byBhbiBhZ2VudCBhbmQgbm90aGluZyBkYW5nbGVzLlxuLy9cbi8vIEdyb3VwIGhlYWRzIChBbHQrU2hpZnQrQ2xpY2sgc2VsZWN0aW9ucykgY2FycnkgY2hpbGQgY2FwdHVyZXMgdW5kZXJcbi8vIGBlbnRyeS5ncm91cGA7IHdlIGlubGluZSB0aG9zZSBjaGlsZHJlbiAod2l0aCB0aGVpciBvd24gZmVlZGJhY2spIHNvIGFcbi8vIGdyb3VwZWQgY2FwdHVyZSBleHBvcnRzIGFzIG9uZSBjb21wbGV0ZSBvYmplY3QgdG9vLlxuLy9cbi8vIFR3byBvdXRwdXQgZm9ybXMsIG1pcnJvcmluZyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIEpTT04gKyBlbmdsaXNoIHNwbGl0OlxuLy8gICBzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSAgICAg4oaSIG9iamVjdCAgKHN0cnVjdHVyZWQsIGNvbXBsZXRlKVxuLy8gICBzZXJpYWxpemVDYXB0dXJlSnNvbihjYXB0dXJlLCBvcHRzKSAgICAgIOKGkiBzdHJpbmcgIChwcmV0dHkgSlNPTiArIG5ld2xpbmUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVUZXh0KGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKG1hcmtkb3duLCBodW1hbi9MTE0pXG4vL1xuLy8gYGNhcHR1cmVgIGFjY2VwdHMgZWl0aGVyOlxuLy8gICDigKIgeyBlbnRyeSwgZmVlZGJhY2s/LCBtZW1iZXJzPyB9ICDigJQgZXhwbGljaXQgc2hhcGUsIE9SXG4vLyAgIOKAoiBhIGJhcmUgYEVudHJ5YCAgICAgICAgICAgICAgICAgIOKAlCBmZWVkYmFjayBkZWZhdWx0cyB0byBbXVxuLy9cbi8vIE91dHB1dCBpcyBkZXRlcm1pbmlzdGljOiBpZGVudGljYWwgaW5wdXQg4oaSIGJ5dGUtaWRlbnRpY2FsIG91dHB1dC4gTm9cbi8vIHRpbWVzdGFtcHMgYXJlIGluamVjdGVkOyBvbmx5IHRoZSBjYXB0dXJlJ3Mgb3duIGB0c2AgZmllbGRzIGFwcGVhci5cblxuLy8g4pSA4pSA4pSAIElucHV0IG5vcm1hbGl6YXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEFjY2VwdCBhIGJhcmUgRW50cnkgb3IgYSB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3cmFwcGVyIGFuZCByZXR1cm4gYVxuLy8gbm9ybWFsaXplZCB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3aXRoIGFycmF5cyBhbHdheXMgcHJlc2VudC5cbmNvbnN0IG5vcm1hbGl6ZUNhcHR1cmUgPSAoY2FwdHVyZSkgPT4ge1xuICBpZiAoIWNhcHR1cmUgfHwgdHlwZW9mIGNhcHR1cmUgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICAvLyBCYXJlIEVudHJ5OiBpdCBoYXMgYSBgc2VsZWN0b3JgIC8gYHVpZGAgYnV0IG5vIG5lc3RlZCBgZW50cnlgLlxuICBjb25zdCBlbnRyeSA9IGNhcHR1cmUuZW50cnkgPz8gY2FwdHVyZTtcbiAgaWYgKCFlbnRyeSB8fCB0eXBlb2YgZW50cnkgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBoYXMgbm8gZW50cnlcIik7XG4gIH1cbiAgY29uc3QgZmVlZGJhY2sgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUuZmVlZGJhY2spID8gY2FwdHVyZS5mZWVkYmFjayA6IFtdO1xuICAvLyBHcm91cCBtZW1iZXJzIG1heSBiZSBzdXBwbGllZCBleHBsaWNpdGx5LCBlbHNlIGZhbGwgYmFjayB0byB0aGUgZW50cnknc1xuICAvLyBvd24gYGdyb3VwYCBhcnJheSAodGhlIHBhbmVsIHN0b3JlcyBjaGlsZCBjYXB0dXJlcyB0aGVyZSkuXG4gIGNvbnN0IG1lbWJlcnMgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUubWVtYmVycylcbiAgICA/IGNhcHR1cmUubWVtYmVyc1xuICAgIDogQXJyYXkuaXNBcnJheShlbnRyeS5ncm91cClcbiAgICAgID8gZW50cnkuZ3JvdXBcbiAgICAgIDogW107XG4gIHJldHVybiB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9O1xufTtcblxuLy8gQSBmZWVkYmFjayByb3cgc2NvcGVkIHRvIGEgc2luZ2xlIGNhcHR1cmUuIFN0cmlwcyByb3V0aW5nL1VJIGNydWZ0XG4vLyAoaWQsIHR5cGUpIGFuZCBrZWVwcyBvbmx5IHdoYXQgYSByZXZpZXdlciBuZWVkczogdGhlIHRleHQsIHdoZW4gaXQgd2FzXG4vLyB3cml0dGVuLCBhbnkgdGFncywgYW5kIHRoZSBwYXJlbnQgbGluayBmb3IgdHJhY2VhYmlsaXR5LlxuY29uc3Qgc2xpbUNvbW1lbnQgPSAoZmIpID0+IHtcbiAgY29uc3Qgb3V0ID0geyB0ZXh0OiB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiIH07XG4gIGlmIChmYi50cykgb3V0LnRzID0gZmIudHM7XG4gIGlmIChmYi51aWQpIG91dC51aWQgPSBmYi51aWQ7XG4gIGlmIChmYi5wYXJlbnRVaWQpIG91dC5wYXJlbnRVaWQgPSBmYi5wYXJlbnRVaWQ7XG4gIGlmIChBcnJheS5pc0FycmF5KGZiLnRhZ3MpICYmIGZiLnRhZ3MubGVuZ3RoKSBvdXQudGFncyA9IGZiLnRhZ3M7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb2xsZWN0IHRoZSBwYXRocy9zZWxlY3RvcnMgZm9yIGEgY2FwdHVyZSBpbnRvIG9uZSBibG9jayBzbyBldmVyeSB3YXkgb2Zcbi8vIGxvY2F0aW5nIHRoZSBlbGVtZW50IGlzIGluIGEgc2luZ2xlLCBvYnZpb3VzIHBsYWNlLiBUb2xlcmFudCBvZiBib3RoIHRoZVxuLy8gcGFuZWwgYEVudHJ5YCBzaGFwZSAoZmxhdCBgc2VsZWN0b3JgICsgYGlkYC9gdGVzdElkYCkgYW5kIHRoZSByaWNoZXJcbi8vIGBzZWxlY3RvcnNgIHN1Yi1vYmplY3Qgc29tZSBjYXB0dXJlIHBpcGVsaW5lcyBlbWl0LlxuY29uc3QgY29sbGVjdFBhdGhzID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IHBhdGhzID0ge307XG4gIGlmIChlbnRyeS5zZWxlY3RvcikgcGF0aHMuY3NzID0gZW50cnkuc2VsZWN0b3I7XG4gIGNvbnN0IHNlbCA9IGVudHJ5LnNlbGVjdG9ycztcbiAgaWYgKHNlbCAmJiB0eXBlb2Ygc2VsID09PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKHNlbC5jc3MgJiYgc2VsLmNzcyAhPT0gcGF0aHMuY3NzKSBwYXRocy5jc3NGdWxsID0gc2VsLmNzcztcbiAgICBpZiAoc2VsLmNvbXBhY3QpIHBhdGhzLmNvbXBhY3QgPSBzZWwuY29tcGFjdDtcbiAgICBpZiAoc2VsLnhwYXRoKSBwYXRocy54cGF0aCA9IHNlbC54cGF0aDtcbiAgICBpZiAoc2VsLmRhdGFJZHMpIHBhdGhzLmRhdGFJZHMgPSBzZWwuZGF0YUlkcztcbiAgfVxuICBpZiAoZW50cnkuY29tcG9uZW50Um9vdCkgcGF0aHMuY29tcG9uZW50Um9vdCA9IGVudHJ5LmNvbXBvbmVudFJvb3Q7XG4gIGlmIChlbnRyeS5zaGFkb3dIb3N0KSBwYXRocy5zaGFkb3dIb3N0ID0gZW50cnkuc2hhZG93SG9zdDtcbiAgaWYgKGVudHJ5LmlkKSBwYXRocy5kb21JZCA9IGVudHJ5LmlkO1xuICBpZiAoZW50cnkudGVzdElkKSBwYXRocy50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmICh0eXBlb2YgZW50cnkuc2VsZWN0b3JNYXRjaENvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgcGF0aHMubWF0Y2hDb3VudCA9IGVudHJ5LnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgfVxuICByZXR1cm4gcGF0aHM7XG59O1xuXG4vLyDilIDilIDilIAgRnVsbCBzdHJ1Y3R1cmVkIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEJ1aWxkIHRoZSBjb21wbGV0ZSBvYmplY3QgZm9yIE9ORSBjYXB0dXJlLiBFdmVyeXRoaW5nIHRleHR1YWwgdGhlXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IHdvdWxkIGNhcnJ5IGZvciB0aGlzIGVsZW1lbnQsIHdpdGggbm90ZXMvY29tbWVudHNcbi8vIGlubGluZWQuIEdyb3VwIG1lbWJlcnMgcmVjdXJzZSBzbyBhIGdyb3VwZWQgY2FwdHVyZSBpcyBzZWxmLWNvbnRhaW5lZC5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVDYXB0dXJlRnVsbCA9IChjYXB0dXJlLCBvcHRzID0ge30pID0+IHtcbiAgY29uc3QgeyBlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnMgfSA9IG5vcm1hbGl6ZUNhcHR1cmUoY2FwdHVyZSk7XG5cbiAgY29uc3Qgb3V0ID0ge1xuICAgIGtpbmQ6IFwicGluY2hncmFiL2NhcHR1cmUtZnVsbFwiLFxuICAgIHY6IDEsXG4gIH07XG4gIGlmIChlbnRyeS51aWQpIG91dC51aWQgPSBlbnRyeS51aWQ7XG4gIGlmIChlbnRyeS5uICE9PSB1bmRlZmluZWQpIG91dC5uID0gZW50cnkubjtcbiAgaWYgKGVudHJ5LnRzKSBvdXQudHMgPSBlbnRyeS50cztcbiAgaWYgKGVudHJ5LnVybCkgb3V0LnVybCA9IGVudHJ5LnVybDtcbiAgaWYgKGVudHJ5LnRhZykgb3V0LnRhZyA9IGVudHJ5LnRhZztcblxuICAvLyBJZGVudGl0eSAvIGExMXkgbmFtaW5nLlxuICBjb25zdCBpZGVudGl0eSA9IHt9O1xuICBpZiAoZW50cnkucm9sZSAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5yb2xlID0gZW50cnkucm9sZTtcbiAgaWYgKGVudHJ5LmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LmFjY2Vzc2libGVOYW1lID0gZW50cnkuYWNjZXNzaWJsZU5hbWU7XG4gIGlmIChlbnRyeS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkudGVzdElkID0gZW50cnkudGVzdElkO1xuICBpZiAoZW50cnkuaWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuaWQgPSBlbnRyeS5pZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkuY2xhc3NlcykgJiYgZW50cnkuY2xhc3Nlcy5sZW5ndGgpIGlkZW50aXR5LmNsYXNzZXMgPSBlbnRyeS5jbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoaWRlbnRpdHkpLmxlbmd0aCkgb3V0LmlkZW50aXR5ID0gaWRlbnRpdHk7XG5cbiAgLy8gUGF0aHMg4oCUIGV2ZXJ5IHdheSB0byBsb2NhdGUgdGhlIGVsZW1lbnQuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIG91dC5wYXRocyA9IHBhdGhzO1xuXG4gIC8vIFRleHQgLyBjb250ZW50LiBXZSBrZWVwIGFsbCB0ZXh0dWFsIHN1cmZhY2VzIHNvIG5vdGhpbmcgdGhlIHVzZXIgY2FuXG4gIC8vIHNlZSBpcyBsb3N0OiBzb3VyY2UgdGV4dCwgdGhlIENTUy1yZW5kZXJlZCBmb3JtLCBhbmQgdGhlIG1hcmt1cC5cbiAgY29uc3QgY29udGVudCA9IHt9O1xuICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnRleHQgPSBlbnRyeS50ZXh0O1xuICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQucmVuZGVyZWRUZXh0ID0gZW50cnkucmVuZGVyZWRUZXh0O1xuICBpZiAoZW50cnkudmFsdWUgIT09IHVuZGVmaW5lZCkgY29udGVudC52YWx1ZSA9IGVudHJ5LnZhbHVlO1xuICBpZiAoZW50cnkucGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCkgY29udGVudC5wbGFjZWhvbGRlciA9IGVudHJ5LnBsYWNlaG9sZGVyO1xuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIGNvbnRlbnQub3V0ZXJIVE1MID0gZW50cnkub3V0ZXJIVE1MO1xuICBpZiAoT2JqZWN0LmtleXMoY29udGVudCkubGVuZ3RoKSBvdXQuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgLy8gTm90ZXMgLyBjb21tZW50cyBhdHRhY2hlZCB0byB0aGlzIGNhcHR1cmUuXG4gIGlmIChmZWVkYmFjay5sZW5ndGgpIG91dC5jb21tZW50cyA9IGZlZWRiYWNrLm1hcChzbGltQ29tbWVudCk7XG5cbiAgLy8gUmVtYWluaW5nIHN0cnVjdHVyZWQgbWV0YWRhdGEgYW4gYWdlbnQgbWF5IHdhbnQg4oCUIGNvcGllZCB0aHJvdWdoXG4gIC8vIHZlcmJhdGltIHNvIHRoaXMgZXhwb3J0IGlzIGFzIGNvbXBsZXRlIGFzIHRoZSBKU09OTCByb3cuIFdlIGFsbG93LWxpc3RcbiAgLy8gdGhlIGhlYXZ5L3N0cnVjdHVyZWQgZmllbGRzIHJhdGhlciB0aGFuIGR1bXBpbmcgdGhlIHdob2xlIEVudHJ5IHNvIHRoZVxuICAvLyBvdXRwdXQgb3JkZXJpbmcgc3RheXMgc3RhYmxlIGFuZCBvYnZpb3VzLlxuICBjb25zdCBtZXRhID0ge307XG4gIGNvbnN0IHBhc3N0aHJvdWdoID0gW1xuICAgIFwicmVjdFwiLCBcInZpZXdwb3J0XCIsIFwic3RhdGVzXCIsIFwiYXR0cnNcIiwgXCJoaW50c1wiLCBcImNvbXBvbmVudFwiLCBcImV2ZW50c1wiLFxuICAgIFwiYmVoYXZpb3JBdHRyc1wiLCBcImExMXlcIiwgXCJhc3NldHNcIiwgXCJsYXlvdXRDb250ZXh0XCIsIFwic3R5bGVzXCIsXG4gICAgXCJtYXRjaGVkUnVsZXNcIiwgXCJhbmNlc3RvcnNcIiwgXCJzY3JlZW5zaG90XCIsIFwidHJ1bmNhdGVkXCIsIFwic2Vzc2lvbklkXCIsXG4gICAgXCJjYW52YXNDbGlja1wiLCBcImVkaXRvclwiLCBcImRvbU11dGF0aW9uc1wiLCBcImlzQW5pbWF0aW5nXCIsXG4gIF07XG4gIGZvciAoY29uc3Qga2V5IG9mIHBhc3N0aHJvdWdoKSB7XG4gICAgaWYgKGVudHJ5W2tleV0gIT09IHVuZGVmaW5lZCkgbWV0YVtrZXldID0gZW50cnlba2V5XTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMobWV0YSkubGVuZ3RoKSBvdXQubWV0YSA9IG1ldGE7XG5cbiAgLy8gR3JvdXAgbWVtYmVyczogcmVjdXJzZSBzbyBlYWNoIGNoaWxkIGNhcHR1cmUgaXMgZnVsbHkgc2VyaWFsaXplZCB0b28uXG4gIC8vIEEgbWVtYmVyIG1heSBjYXJyeSBpdHMgb3duIGZlZWRiYWNrIHdoZW4gdGhlIGNhbGxlciBzdXBwbGllcyBhXG4gIC8vIHtlbnRyeSwgZmVlZGJhY2t9IHBhaXI7IGJhcmUgY2hpbGQgRW50cmllcyBzZXJpYWxpemUgd2l0aCBubyBjb21tZW50cy5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgb3V0Lm1lbWJlcnMgPSBtZW1iZXJzLm1hcCgobSkgPT4gc2VyaWFsaXplQ2FwdHVyZUZ1bGwobSwgb3B0cykpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFByZXR0eSBKU09OIHN0cmluZyBmb3IgdGhlIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiBidXR0b24uIFRyYWlsaW5nXG4vLyBuZXdsaW5lIHNvIGl0IHJvdW5kLXRyaXBzIGNsZWFubHkgdGhyb3VnaCBlZGl0b3JzIC8gYHBicGFzdGVgLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVKc29uID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT5cbiAgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXplQ2FwdHVyZUZ1bGwoY2FwdHVyZSwgb3B0cyksIG51bGwsIDIpICsgXCJcXG5cIjtcblxuLy8g4pSA4pSA4pSAIFNpbmdsZS1jYXB0dXJlIG1hcmtkb3duIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gTWF0Y2hlcyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIGVuZ2xpc2gvbWFya2Rvd24gc3VyZmFjZSBidXQgc2NvcGVkIHRvIG9uZVxuLy8gY2FwdHVyZS4gVXNlZnVsIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gcGFzdGUgYSBodW1hbi1yZWFkYWJsZSBjYXJkIHJhdGhlclxuLy8gdGhhbiByYXcgSlNPTi5cblxuY29uc3QgaGVhZGluZyA9IChlbnRyeSkgPT4ge1xuICBjb25zdCBuYW1lID1cbiAgICBlbnRyeS5hY2Nlc3NpYmxlTmFtZSB8fFxuICAgIGVudHJ5LnRlc3RJZCB8fFxuICAgIGVudHJ5LmlkIHx8XG4gICAgZW50cnkuc2VsZWN0b3IgfHxcbiAgICBlbnRyeS50YWcgfHxcbiAgICBcImNhcHR1cmVcIjtcbiAgY29uc3QgbGFiZWwgPSBlbnRyeS5uICE9PSB1bmRlZmluZWQgPyBgQ2FwdHVyZSAjJHtlbnRyeS5ufWAgOiBcIkNhcHR1cmVcIjtcbiAgcmV0dXJuIGAke2xhYmVsfTogJHtuYW1lfWA7XG59O1xuXG5jb25zdCByZW5kZXJQYXRocyA9IChwYXRocykgPT4ge1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhwYXRocykpIHtcbiAgICBsaW5lcy5wdXNoKGAtICoqJHtrfToqKiBcXGAke3Z9XFxgYCk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVUZXh0ID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgbGluZXMucHVzaChgIyAke2hlYWRpbmcoZW50cnkpfWAsIFwiXCIpO1xuICBpZiAoZW50cnkudXJsKSBsaW5lcy5wdXNoKGBQYWdlOiA8JHtlbnRyeS51cmx9PmAsIFwiXCIpO1xuICBpZiAoZW50cnkudGFnKSBsaW5lcy5wdXNoKGBFbGVtZW50OiBcXGA8JHtlbnRyeS50YWd9PlxcYGAsIFwiXCIpO1xuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgUGF0aHNcIiwgXCJcIiwgLi4ucmVuZGVyUGF0aHMocGF0aHMpKTtcbiAgfVxuXG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQgfHwgZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgVGV4dFwiLCBcIlwiKTtcbiAgICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBsaW5lcy5wdXNoKGBTb3VyY2U6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkudGV4dCl9YCk7XG4gICAgaWYgKGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkICYmIGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gZW50cnkudGV4dCkge1xuICAgICAgbGluZXMucHVzaChgUmVuZGVyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkucmVuZGVyZWRUZXh0KX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgTWFya3VwXCIsIFwiXCIsIFwiYGBgaHRtbFwiLCBlbnRyeS5vdXRlckhUTUwsIFwiYGBgXCIpO1xuICB9XG5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBOb3RlcyAmIGNvbW1lbnRzXCIsIFwiXCIpO1xuICAgIGZvciAoY29uc3QgZmIgb2YgZmVlZGJhY2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiO1xuICAgICAgY29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGggPyBgIF8oJHtmYi50YWdzLmpvaW4oXCIsIFwiKX0pX2AgOiBcIlwiO1xuICAgICAgbGluZXMucHVzaChgLSAke3RleHR9JHt0YWdzfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtZW1iZXJzLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBHcm91cGVkIHdpdGhcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lbWJlcnMpIHtcbiAgICAgIGNvbnN0IG1lID0gbm9ybWFsaXplQ2FwdHVyZShtKS5lbnRyeTtcbiAgICAgIGxpbmVzLnB1c2goYC0gJHtoZWFkaW5nKG1lKX0g4oCUIFxcYCR7bWUuc2VsZWN0b3IgPz8gbWUudGFnID8/IFwiP1wifVxcYGApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKFwiXFxuXCIpICsgXCJcXG5cIjtcbn07XG4iLAogICAgIi8vIFBpbmNoR3JhYiBzaWRlLXBhbmVsIFVJLiBSZWNlaXZlcyBjYXB0dXJlcyArIGhvdmVycyBmcm9tIHRoZSBjb250ZW50XG4vLyBzY3JpcHQ7IHJlbmRlcnMgdGhlIGNoYXQtYnViYmxlIHRpbWVsaW5lLCBleHBvcnRzLCB2YWxpZGF0ZXMsIGV0Yy5cbi8vXG4vLyBEZWNvbXBvc2VkIGludG8gc21hbGwgZmlsZXMgZm9yIGNsYXJpdHk6XG4vLyAgIOKAoiB0eXBlcy50cyAgICAgIOKAlCBzaGFyZWQgdHlwZXMsIG1lc3NhZ2UgcHJvdG9jb2xcbi8vICAg4oCiIGx1Y2lkZS50cyAgICAg4oCUIGljb24gcmVnaXN0cnlcbi8vICAg4oCiIHRoaXMgZmlsZSAgICAg4oCUIHdpcmUtdXAgLyByZW5kZXJpbmcgLyBleHBvcnQgYnVpbGRlcnNcbi8vXG4vLyBMb2FkZWQgYXMgdGhlIHNpZGUgcGFuZWwgcGFnZTogY2hyb21lLnNpZGVQYW5lbCBkZWZhdWx0X3BhdGguXG5cbmltcG9ydCB0eXBlIHtcbiAgQW5ub3RhdGlvblBheWxvYWQsIENzVG9QYW5lbCwgRW50cnksIEV4cG9ydERpYWdub3N0aWMsIEV4cG9ydE1hbmlmZXN0LCBGZWVkYmFja01lc3NhZ2UsIFBhZ2VNZXNzYWdlLFxuICBQYWdlU25hcHNob3QsIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5pbXBvcnQge3NlcmlhbGl6ZUNhcHR1cmVKc29ufSBmcm9tICcuL2V4cG9ydC1jYXB0dXJlLm1qcyc7XG5cbigoKSA9PiB7XG4gIGNvbnN0IExPRyA9ICdbUGluY2hHcmFiL3NwXSc7XG4gIGNvbnN0IFBSRUZTX1NUT1JBR0VfTkFNRSA9ICdwaW5jaGdyYWIucHJlZnMudjInO1xuICBjb25zdCBXT1JLU1BBQ0VTX0tFWSA9ICdwaW5jaGdyYWIud29ya3NwYWNlcy52MSc7XG4gIGNvbnN0IGluRXh0ZW5zaW9uID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCcgJiYgQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpO1xuXG4gIC8vIOKUgOKUgOKUgCBUZW1wbGF0ZSByZXNvdXJjZSBsb2FkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEVhcmxpZXIgdGhlIHRlbXBsYXRlcyB3ZXJlIGJha2VkIGFzIHN0cmluZyBjb25zdGFudHMgaW50byB0aGlzIElJRkVcbiAgLy8gKH4zNjBLQiBhY3Jvc3MgREVTSUdOICsgU0tJTEwpLiBUaGF0IGJsb2F0ZWQgdGhlIHNpZGVwYW5lbCBidW5kbGUgdG9cbiAgLy8gfjEuOTVNQiBhbmQgc2xvd2VkIGZpcnN0LW9wZW4gcGFyc2UgdGltZSBub3RpY2VhYmx5LiBUaGV5IG5vdyBzaGlwIGFzXG4gIC8vIHNlcGFyYXRlIGAubWRgIGZpbGVzIHVuZGVyIGBleHRlbnNpb24vdGVtcGxhdGVzL2AgYW5kIGxvYWQgb24gZGVtYW5kXG4gIC8vIHZpYSBmZXRjaCDigJQgd2hlbiB0aGUgdXNlciBvcGVucyB0aGUgZWRpdG9yIG1vZGFsLCBvciB3aGVuIHRoZSBleHBvcnRcbiAgLy8gcGlwZWxpbmUgbmVlZHMgdG8gYnVuZGxlIGEgZmFsbGJhY2suXG4gIC8vXG4gIC8vIENhY2hlIHJlc3VsdHMgaW4tcHJvY2VzcyBzbyByZXBlYXQgcmVhZHMgKG1vZGFsIG9wZW4g4oaSIGNsb3NlIOKGkiByZW9wZW4sXG4gIC8vIG9yIHNlcXVlbnRpYWwgZXhwb3J0cykgZG9uJ3QgcmUtZmV0Y2guXG4gIGNvbnN0IHRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBURU1QTEFURV9GSUxFUyA9IHtcbiAgICBkZXNpZ25UZW1wbGF0ZTogJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsXG4gICAgc2tpbGxUZW1wbGF0ZTogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCcsXG4gICAgbG9jYWxEZXNpZ246ICdsb2NhbC5ERVNJR04ubWQnLFxuICAgIGxvY2FsU2tpbGw6ICdsb2NhbC5TS0lMTC5tZCcsXG4gIH0gYXMgY29uc3Q7XG4gIHR5cGUgVGVtcGxhdGVLZXkgPSBrZXlvZiB0eXBlb2YgVEVNUExBVEVfRklMRVM7XG4gIGNvbnN0IHRlbXBsYXRlVXJsID0gKGZpbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gSW5zaWRlIHRoZSBleHRlbnNpb24sIHRoZSBzaWRlcGFuZWwgcnVucyBmcm9tXG4gICAgLy8gY2hyb21lLWV4dGVuc2lvbjovLzxpZD4vc2lkZXBhbmVsLmh0bWwsIHNvIHJlc291cmNlcyByZXNvbHZlIHZpYVxuICAgIC8vIGNocm9tZS5ydW50aW1lLmdldFVSTC4gVGhlIFBsYXl3cmlnaHQgc3RhdGljLXNlcnZlciB0ZXN0cyBzZXJ2ZVxuICAgIC8vIGAvdGVtcGxhdGVzLzxmaWxlPmAgZnJvbSB0aGUgZXh0ZW5zaW9uIHJvb3QgZGlyZWN0bHksIHNvIGFcbiAgICAvLyByZWxhdGl2ZSBVUkwgd29ya3MgdGhlcmUgYXMgYSBmYWxsYmFjay5cbiAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCkge1xuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChgdGVtcGxhdGVzLyR7ZmlsZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGB0ZW1wbGF0ZXMvJHtmaWxlfWA7XG4gIH07XG4gIGNvbnN0IGxvYWRUZW1wbGF0ZSA9IGFzeW5jIChrZXk6IFRlbXBsYXRlS2V5KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAoIVRFTVBMQVRFU19QUkVTRU5UW2tleV0pIHJldHVybiAnJztcbiAgICBjb25zdCBmaWxlID0gVEVNUExBVEVfRklMRVNba2V5XTtcbiAgICBjb25zdCBjYWNoZWQgPSB0ZW1wbGF0ZUNhY2hlLmdldChmaWxlKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRlbXBsYXRlVXJsKGZpbGUpKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgdGVtcGxhdGUgZmV0Y2ggZmFpbGVkOiAke2ZpbGV9YCwgZXJyKTtcbiAgICAgIHRlbXBsYXRlQ2FjaGUuc2V0KGZpbGUsICcnKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG4gIC8vIEVmZmVjdGl2ZSBjb250ZW50IHVzZWQgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSBhbmQgdGhlIG1vZGFsLiBXaGVuIHRoZVxuICAvLyB1c2VyIGhhcyBjdXN0b21pemVkIHZpYSB0aGUgdGV4dGFyZWEvdXBsb2FkLCB0aGF0IHdpbnM7IG90aGVyd2lzZSB3ZVxuICAvLyBmYWxsIGJhY2sgdG8gbG9jYWwuKiAodGhlIGRldmVsb3BlcidzIHByZS1iYWtlZCBvdmVycmlkZSkgdGhlbiB0b1xuICAvLyB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgY29uc3QgcmVzb2x2ZURlc2lnbkNvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuZGVzaWduTWQgJiYgcHJlZnMuZGVzaWduTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuZGVzaWduTWQ7XG4gICAgcmV0dXJuIChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsRGVzaWduJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJykpO1xuICB9O1xuICBjb25zdCByZXNvbHZlU2tpbGxDb250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLnNraWxsTWQgJiYgcHJlZnMuc2tpbGxNZC50cmltKCkpIHJldHVybiBwcmVmcy5za2lsbE1kO1xuICAgIHJldHVybiAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbFNraWxsJykpIHx8IChhd2FpdCBsb2FkVGVtcGxhdGUoJ3NraWxsVGVtcGxhdGUnKSk7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDihpIgcHJlZnMue2Rlc2lnbk1kfHNraWxsTWR9IGlzXG4gIC8vIGVtcHR5IGFuZCB3ZSdyZSBmYWxsaW5nIGJhY2sgdG8gYSBidW5kbGVkIHRlbXBsYXRlL2xvY2FsIHJlc291cmNlLlxuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24gPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuZGVzaWduTWQgfHwgIXByZWZzLmRlc2lnbk1kLnRyaW0oKTtcbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlU2tpbGwgPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuc2tpbGxNZCB8fCAhcHJlZnMuc2tpbGxNZC50cmltKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0b3JhZ2UgYWRhcHRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgU3RvcmUgPSB7XG4gICAgYXN5bmMgZ2V0PFQ+KGtleTogc3RyaW5nLCBmYWxsYmFjazogVCk6IFByb21pc2U8VD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7IHJldHVybiAob1trZXldIGFzIFQpID8/IGZhbGxiYWNrOyB9XG4gICAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBjb25zdCByID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTsgcmV0dXJuIHIgPT09IG51bGwgPyBmYWxsYmFjayA6IChKU09OLnBhcnNlKHIpIGFzIFQpOyB9XG4gICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgIH0sXG4gICAgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1trZXldOiB2YWx1ZX0pOyByZXR1cm47IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgfVxuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LFxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBET00gcmVmcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgJCA9IDxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50PihzOiBzdHJpbmcpOiBUID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocykgYXMgVDtcbiAgY29uc3QgbGlzdCA9ICQoJ1tkYXRhLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBvc2VyID0gJDxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtY29tcG9zZXJdJyk7XG4gIGNvbnN0IHN0YXR1cyA9ICQoJ1tkYXRhLXN0YXR1c10nKTtcbiAgY29uc3Qgc2VhcmNoID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtc2VhcmNoXScpO1xuICAvLyBDdHJsK0YgdmlzdWFsLWZpbmQgYmFyIChkaXN0aW5jdCBmcm9tIHRoZSBoZWFkZXIgc2VhcmNoLCB3aGljaCBvcGVucyB0aGVcbiAgLy8gY29tbWFuZCBwYWxldHRlKS4gTWF5IGJlIGFic2VudCBpbiB2ZXJ5IG9sZCBjYWNoZWQgbWFya3VwLCBzbyBjb25zdW1lcnNcbiAgLy8gbnVsbC1ndWFyZC5cbiAgY29uc3QgZmluZEJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1maW5kLWJhcl0nKTtcbiAgY29uc3QgZmluZElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtZmluZF0nKTtcbiAgY29uc3QgZmluZENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWZpbmQtY291bnRdJyk7XG4gIC8vIENhbm9uaWNhbGl6ZSBrZXlib2FyZC1zaG9ydGN1dCBwaWxscyBwZXIgcGxhdGZvcm0uIEV2ZXJ5IHNob3J0Y3V0IHBpbGxcbiAgLy8gaXMgYXV0aG9yZWQgaW4gdGhlIGNhbm9uaWNhbCBDbWQtZm9ybSAoZWFjaCB0b2tlbiBjYXBpdGFsaXplZCwgam9pbmVkXG4gIC8vIHdpdGggJysnOiBBbHQrQ2xpY2ssIENtZCtLLCBDbWQrU2hpZnQrWik7IG9uIG5vbi1NYWMgd2Ugc3dhcCB0aGUgbGVhZGluZ1xuICAvLyBDbWQgbW9kaWZpZXIgZm9yIEN0cmwuIFBpbGxzIG9wdCBpbiB2aWEgZGF0YS1tb2QtKiBzbyBhIHN0cmluZyBsaWtlIHRoZVxuICAvLyAnQWx0K+KApicgcGlsbHMgKHdoaWNoIG5ldmVyIGNhcnJ5IENtZCkgYXJlIGxlZnQgdW50b3VjaGVkLlxuICBjb25zdCBpc01hYyA9IC9NYWN8aVBob25lfGlQYWQvaS50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSB8fCBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnKTtcbiAgaWYgKCFpc01hYykge1xuICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ2tiZFtkYXRhLW1vZC1rXSwga2JkW2RhdGEtbW9kLXpdLCBrYmRbZGF0YS1tb2Qtc2hpZnQtel0nKSkge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSAoZWwudGV4dENvbnRlbnQgPz8gJycpLnJlcGxhY2UoL15DbWRcXGIvLCAnQ3RybCcpO1xuICAgIH1cbiAgfVxuICBjb25zdCBpbXBvcnRGaWxlID0gJDxIVE1MSW5wdXRFbGVtZW50PignI2ltcG9ydC1maWxlJyk7XG4gIGNvbnN0IHN0YXRzRWwgPSAkKCdbZGF0YS1zdGF0c10nKTtcbiAgY29uc3Qgc3RhcnNFbCA9ICQoJ1tkYXRhLXN0YXJzXScpO1xuICBjb25zdCB0b29sdGlwRWwgPSAkKCdbZGF0YS10b29sdGlwXScpO1xuICBjb25zdCBkcmlsbGRvd25FbCA9ICQoJ1tkYXRhLWRyaWxsZG93bl0nKTtcbiAgY29uc3QgZHJhd2VyID0gJCgnW2RhdGEtZHJhd2VyXScpO1xuICBjb25zdCBwYWxldHRlID0gJCgnW2RhdGEtcGFsZXR0ZV0nKTtcbiAgY29uc3QgcGFsZXR0ZUlucHV0ID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcGFsZXR0ZS1pbnB1dF0nKTtcbiAgY29uc3QgcGFsZXR0ZUxpc3QgPSAkKCdbZGF0YS1wYWxldHRlLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBXb3JkcyA9ICQoJ1tkYXRhLWNvbXAtd29yZHNdJyk7XG4gIGNvbnN0IGNvbXBUb2tlbnMgPSAkKCdbZGF0YS1jb21wLXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFRva2VucyA9ICQoJ1tkYXRhLXN0YXQtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0V29yZHMgPSAkKCdbZGF0YS1zdGF0LXdvcmRzXScpO1xuICBjb25zdCB3c1NlbGVjdCA9ICQ8SFRNTFNlbGVjdEVsZW1lbnQ+KCdbZGF0YS13b3Jrc3BhY2VdJyk7XG4gIGNvbnN0IHdzTGlzdCA9ICQoJ1tkYXRhLXdzLWxpc3RdJyk7XG4gIGNvbnN0IHdzTmFtZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXdzLW5hbWVdJyk7XG5cbiAgY29uc3QgbW91bnRJY29ucyA9IChyb290OiBQYXJlbnROb2RlID0gZG9jdW1lbnQpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWljb25dJykpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbicpO1xuICAgICAgY29uc3Qgc2l6ZSA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScpID8/IDE2KTtcbiAgICAgIGlmIChuYW1lICYmIFBHX0lDT05TLmhhcyhuYW1lKSkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICAgIH1cbiAgfTtcbiAgbW91bnRJY29ucygpO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiBib29sZWFuO1xuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IGJvb2xlYW47XG4gICAgaW5jbHVkZVN0eWxlczogYm9vbGVhbjtcbiAgICBtaW5pZnk6IGJvb2xlYW47XG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogYm9vbGVhbjtcbiAgICB1c2VTY3JlZW5zaG90czogYm9vbGVhbjtcbiAgICBzcGFjaW5nT3ZlcmxheTogYm9vbGVhbjtcbiAgICBob3ZlclNuYXA6IGJvb2xlYW47XG4gICAgYXV0b1NjcmVlbnNob3Q6IGJvb2xlYW47XG4gICAgLy8gQ29tbWEtc2VwYXJhdGVkIGhvc3QgcGF0dGVybnMgKHN1YnN0cmluZyBtYXRjaCkuIEhvc3RzIGluIHRoaXMgbGlzdFxuICAgIC8vIHNraXAgdGhlIGVudGlyZSBzY3JlZW5zaG90IHBpcGVsaW5lIOKAlCB1c2VmdWwgZm9yIHNlbnNpdGl2ZSBwYWdlc1xuICAgIC8vIChiYW5raW5nLCBpbnRlcm5hbCBhZG1pbikgd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IFBOR3MgbGFuZGluZ1xuICAgIC8vIG9uIGRpc2suXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogc3RyaW5nO1xuICAgIC8vIElubGluZSBERVNJR04ubWQgY29udGVudCB0aGUgdXNlciBwYXN0ZWQgb3IgdXBsb2FkZWQgdmlhIHRoZSBzaWRlXG4gICAgLy8gcGFuZWwgc2V0dGluZ3MuIERlZmF1bHRzIHRvIGEgdGVtcGxhdGVkIHBsYWNlaG9sZGVyIHNvIG91dC1vZi10aGUtXG4gICAgLy8gYm94IGV4cG9ydHMgYWx3YXlzIGluY2x1ZGUgYSBERVNJR04ubWQg4oCUIHRoZSBjb25zdW1lciBMTE0gY2FuXG4gICAgLy8gZWl0aGVyIHdvcmsgZnJvbSB0aGUgcGxhY2Vob2xkZXIgKGFuZCBhc2sgZm9yIHRoZSByZWFsIG9uZSkgb3JcbiAgICAvLyBmcm9tIGEgdXNlci1jdXN0b21pemVkIGNvcHkuIFRoZSBzZXR0aW5ncyBVSSBmbGFncyB0aGlzIGJhbm5lci1cbiAgICAvLyBzdHlsZSB3aGVuIHRoZSB2YWx1ZSBzdGlsbCBtYXRjaGVzIHRoZSB0ZW1wbGF0ZSBzbyB0aGUgdXNlclxuICAgIC8vIGtub3dzIHRvIGZpbGwgaXQgaW4uXG4gICAgZGVzaWduTWQ6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIHRoZSByZWNlaXZlciBzaG91bGQgcmVhZCBERVNJR04ubWQgZnJvbS4gRGVmYXVsdHNcbiAgICAvLyB0byBgfi8uYWdlbnRzL0RFU0lHTi5tZGA7IHVzZXIgY2FuIG92ZXJyaWRlIHBlci1tYWNoaW5lLlxuICAgIGRlc2lnblBhdGg6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIG9mIHRoZSBQaW5jaEdyYWIgVUkgc2tpbGwgb24gdGhlIHJlY2VpdmVyJ3NcbiAgICAvLyBmaWxlc3lzdGVtLiBUaGUgc2tpbGwgY29udGVudCBpdHNlbGYgaXMgYnVuZGxlZCBpbmxpbmUgaW50byB0aGVcbiAgICAvLyBhcmNoaXZlIChzZWUgYHNraWxsTWRgKSwgc28gdGhpcyBpcyBhIGhpbnQgZm9yIHJlY2VpdmVycyB0aGF0XG4gICAgLy8gd2FudCB0byBwZXJzaXN0IHRoZSBza2lsbCBhdCBhIGNhbm9uaWNhbCBsb2NhdGlvbi5cbiAgICBza2lsbFBhdGg6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgVUktc2tpbGwgY29udGVudC4gRGVmYXVsdCBpcyB0aGUgYnVuZGxlZCBQaW5jaEdyYWIgdHJpYWdlXG4gICAgLy8gc2tpbGwgdGVtcGxhdGU7IHVzZXIgY2FuIGN1c3RvbWl6ZSB2aWEgc2V0dGluZ3MgcGFzdGUvdXBsb2FkLlxuICAgIC8vIEJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSBhdCBgLi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgLlxuICAgIHNraWxsTWQ6IHN0cmluZztcbiAgICAvLyBXaGVuIHRydWUsIGZpcmUgYSBmcmVzaCBwYWdlIHNjcmVlbnNob3Qgb24gRVZFUlkgY2FwdHVyZSByYXRoZXJcbiAgICAvLyB0aGFuIG9uY2UgcGVyICh3b3Jrc3BhY2UsIHVybCkgdHVwbGUuIFVzZWZ1bCBmb3IgY2FwdHVyaW5nIGFcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3cgd2hlcmUgdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzLlxuICAgIC8vIERlZmF1bHQgZmFsc2Ug4oCUIG1vc3QgdXNlcnMgd2FudCB0aGUgZGVmYXVsdCBmaXJzdC1vbmx5IGJlaGF2aW9yXG4gICAgLy8gc2luY2UgcGFnZSBzY3JlZW5zaG90cyBhcmUgbGFyZ2UgYW5kIHRoZSBmaXJzdCBvbmUgYWxyZWFkeSBnaXZlc1xuICAgIC8vIGEgc2Vzc2lvbi1sZXZlbCByZWZlcmVuY2UuXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBib29sZWFuO1xuICB9O1xuICBjb25zdCBERUZBVUxUX1BSRUZTOiBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiB0cnVlLFxuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IHRydWUsXG4gICAgaW5jbHVkZVN0eWxlczogdHJ1ZSxcbiAgICAvLyBEZWZhdWx0IHRvIG1pbmlmaWVkIGV4cG9ydHMg4oCUIG1vc3QgYWdlbnRzIHdhbnQgdGhlIHNtYWxsZXN0XG4gICAgLy8gdG9rZW4tZm9vdHByaW50IHBheWxvYWQuIEV4aXN0aW5nIHVzZXJzJyBzYXZlZCBwcmVmcyBhcmUgbWVyZ2VkIG92ZXJcbiAgICAvLyB0aGlzIGRlZmF1bHQgaW4gbG9hZEFsbCgpLCBzbyBvbmx5IE5FVy91bnNldCBpbnN0YWxscyBzZWUgdGhlIGZsaXAuXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IHRydWUsXG4gICAgdXNlU2NyZWVuc2hvdHM6IHRydWUsXG4gICAgc3BhY2luZ092ZXJsYXk6IGZhbHNlLFxuICAgIGhvdmVyU25hcDogdHJ1ZSxcbiAgICBhdXRvU2NyZWVuc2hvdDogdHJ1ZSxcbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiAnJyxcbiAgICAvLyBkZXNpZ25NZCAvIHNraWxsTWQgZGVmYXVsdCB0byAnJyB3aGljaCB0aGUgcmVzb2x2ZXIgdHJlYXRzIGFzXG4gICAgLy8gXCJmYWxsIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUgYXQgZXhwb3J0IHRpbWVcIi4gU3RvcmluZyB0aGVcbiAgICAvLyBlbXB0eSBzdHJpbmcga2VlcHMgY2hyb21lLnN0b3JhZ2Ugc21hbGwgYW5kIGxldHMgYGlzVXNpbmdUZW1wbGF0ZSpgXG4gICAgLy8gYmUgYSBjaGVhcCBzeW5jaHJvbm91cyBjaGVjay5cbiAgICBkZXNpZ25NZDogJycsXG4gICAgZGVzaWduUGF0aDogJ34vLmFnZW50cy9ERVNJR04ubWQnLFxuICAgIHNraWxsUGF0aDogJ34vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICBza2lsbE1kOiAnJyxcbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGZhbHNlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nOyB0YWJJZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ307XG4gIC8vIE9uZSBhcmNoaXZlZCBzdGF0ZSBvZiBhIHdvcmtzcGFjZSAoY2FwdHVyZWQganVzdCBiZWZvcmUgYSBDbGVhci1hbGwpLlxuICAvLyBgc2hvdHNgIGlzIHRoZSB0aHVtYm5haWwgbWFwIChmdWxsLXJlcyBQTkdzIGFyZSBzZXNzaW9uLW9ubHkgYW5kIG5vdFxuICAvLyBhcmNoaXZlZCkuIFJlc3RvcmFibGUgZnJvbSBTZXR0aW5ncyDihpIgV29ya3NwYWNlcy5cbiAgdHlwZSBXb3Jrc3BhY2VTbmFwc2hvdCA9IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHRzOiBzdHJpbmc7XG4gICAgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdO1xuICAgIHNob3RzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGNvbW1lbnRzOiBudW1iZXI7XG4gIH07XG5cbiAgbGV0IG1lc3NhZ2VzOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICBsZXQgbGl2ZVRhYlVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsaXZlVGFiUGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHNlbGVjdG9yVmFsaWRpdHkgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbiB8ICdkaWZmLXBhZ2UnPigpO1xuICBjb25zdCBzZWxlY3RvckVycm9ycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGluc2VydEJlZm9yZToge2N1cnJlbnQ6IHN0cmluZyB8IG51bGw7IGNvbW1lbnQ6IGJvb2xlYW59ID0ge2N1cnJlbnQ6IG51bGwsIGNvbW1lbnQ6IGZhbHNlfTtcbiAgbGV0IHNlYXJjaFF1ZXJ5ID0gJyc7XG4gIGxldCBsYXN0QWN0aXZlU2VsZWN0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgc3RpY2t5VGltZXIgPSAwO1xuICBsZXQgU1RJQ0tZX1RUTF9NUyA9IDVfMDAwO1xuICBsZXQgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gIGxldCBwaGFudG9tVGFyZ2V0OiB7c2VsZWN0b3I6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgdGFnPzogc3RyaW5nOyByZWN0PzogRE9NUmVjdH0gfCBudWxsID0gbnVsbDtcbiAgbGV0IHBlbmRpbmdNdWx0aTogRW50cnlbXSA9IFtdO1xuICBjb25zdCBzaG90cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCBwZXIgc2VsZWN0b3IuIE5PVCBwZXJzaXN0ZWQgdG9cbiAgLy8gY2hyb21lLnN0b3JhZ2UgKGNhcCBwcmVzc3VyZSDigJQgMTAwIGNhcHR1cmVzIMOXIDgwIEtCIGVhY2ggPSA4IE1CKSwgc29cbiAgLy8gaXQncyBvbmx5IGF2YWlsYWJsZSBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbidzIGFyY2hpdmUgZXhwb3J0LiBDbGVhcmVkXG4gIC8vIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGNvbnN0IHNob3RzRnVsbCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIFRyYWNrIHdoaWNoICh3b3Jrc3BhY2UsIHBhZ2UtdXJsKSB0dXBsZXMgYWxyZWFkeSBmaXJlZCBhIHBhZ2Ugc2hvdCBzbyB3ZVxuICAvLyBkb24ndCByZS1zaG9vdCB0aGUgZW50aXJlIHBhZ2Ugb24gZXZlcnkgY2FwdHVyZS4gUmVzZXQgb24gd29ya3NwYWNlXG4gIC8vIHN3aXRjaCDigJQgbm8gZGF5IGtleSwgdGhlIGRlZHVwZSBpcyBwZXItc2Vzc2lvbi5cbiAgY29uc3QgcGFnZVNob3RzRmlyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcGFnZVNob3RLZXkgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4gYCR7YWN0aXZlV3N9OiR7dXJsfWA7XG4gIC8vIExhc3Qgc3VjY2Vzc2Z1bCBleHBvcnQg4oCUIGJvdGggdGhlIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChzaG93biB0byB0aGVcbiAgLy8gdXNlcikgYW5kIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIChjb3BpZWQgYnkgdGhlIFwiQ29weSBhcyBwYXRoXCIgYnV0dG9uKS5cbiAgLy8gVXBkYXRlZCBvbiBKU09OTC9NRC9aSVAvc2NyZWVuc2hvdCBzYXZlcy5cbiAgY29uc3QgbGFzdEV4cG9ydDoge3JlbFBhdGg6IHN0cmluZyB8IG51bGw7IGFic1BhdGg6IHN0cmluZyB8IG51bGw7IGNvcHlQYXRoOiBzdHJpbmcgfCBudWxsOyB0ZW1wUGF0aDogYm9vbGVhbjsga2luZDogc3RyaW5nIHwgbnVsbH0gPSB7XG4gICAgcmVsUGF0aDogbnVsbCwgYWJzUGF0aDogbnVsbCwgY29weVBhdGg6IG51bGwsIHRlbXBQYXRoOiBmYWxzZSwga2luZDogbnVsbCxcbiAgfTtcbiAgbGV0IHdvcmtzcGFjZXM6IFdvcmtzcGFjZVtdID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gIGxldCBhY3RpdmVXcyA9ICdkZWZhdWx0JztcbiAgLy8gU2Vzc2lvbiB1dWlkIOKAlCBnZW5lcmF0ZWQgb25jZSBwZXIgd29ya3NwYWNlIGJvb3QuIEdvZXMgb250byBldmVyeVxuICAvLyBwYWdlIHJvdyBhbmQgZXZlcnkgc2VsZWN0b3IgZW50cnkgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlc1xuICAvLyB0byBcIndoaWNoIHNlc3Npb24/XCIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuIFN0YWJsZSBhY3Jvc3MgYVxuICAvLyBzaW5nbGUgd29ya3NwYWNlIGxvYWQ7IHJlc2V0cyBvbiB3b3Jrc3BhY2Ugc3dpdGNoLlxuICBsZXQgc2Vzc2lvbklkOiBzdHJpbmcgPSAnJztcbiAgY29uc3Qgd3NNc2dLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5tZXNzYWdlcy52MWA7XG4gIGNvbnN0IHdzU2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90cy52MWA7XG4gIC8vIFBlcnNpc3RlbnQgc25hcHNob3QgaGlzdG9yeSBwZXIgd29ya3NwYWNlIOKAlCBhIENsZWFyLWFsbCBhcmNoaXZlcyB0aGUgd2lwZWRcbiAgLy8gY2FwdHVyZXMrY29tbWVudHMrdGh1bWJuYWlscyBoZXJlIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIGxhdGVyIGZyb21cbiAgLy8gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMuIExpdmVzIGluIHRoZSBzYW1lIGNocm9tZS5zdG9yYWdlIGxheWVyIGFzIHRoZSByZXN0XG4gIC8vIG9mIHRoZSB3b3Jrc3BhY2UgZGF0YS5cbiAgY29uc3Qgd3NTbmFwc2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zbmFwc2hvdHMudjFgO1xuICAvLyBDYXAgc28gdGhlIGhpc3RvcnkgY2FuJ3QgYmFsbG9vbiBzdG9yYWdlOyBvbGRlc3Qgc25hcHNob3RzIGRyb3Agb2ZmLlxuICBjb25zdCBXU19TTkFQU0hPVF9DQVAgPSAxMDtcbiAgY29uc3Qgd3NTaG90c0Z1bGxLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90c0Z1bGwudjFgO1xuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBoYXMgYSAxMCBNQiBkZWZhdWx0IHF1b3RhOyB3ZSBidWRnZXQgaGFsZiBvZlxuICAvLyB0aGF0IGZvciBmdWxsLXJlc29sdXRpb24gUE5HcyAodGhlIHJlc3QgaXMgbWVzc2FnZXMsIHByZWZzLCB0aHVtYnMpLlxuICAvLyBXaGVuIHRoZSBidWRnZXQgaXMgcmVhY2hlZCB3ZSBGSUZPLWV2aWN0IHRoZSBvbGRlc3QgZW50cmllcyAoTWFwXG4gIC8vIHByZXNlcnZlcyBpbnNlcnRpb24gb3JkZXIpLiBFc3RpbWF0ZSBkYXRhVVJMIHNpemUgPSBzdHJpbmcgbGVuZ3RoLlxuICBjb25zdCBTSE9UU19GVUxMX0JVREdFVF9CWVRFUyA9IDUgKiAxMDI0ICogMTAyNDtcbiAgY29uc3QgdW5kb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCByZWRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFVORE9fQ0FQID0gMzA7XG4gIGxldCBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gIGxldCBwcmVmczogUHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGU307XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXR1cyBoZWxwZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzdGF0dXNUaW1lciA9IDA7XG4gIGNvbnN0IHNldFN0YXR1cyA9IChtc2c6IHN0cmluZywgb3B0czoge2tpbmQ/OiAnd2FybicgfCAnaW5mbycgfCAnb2snfSA9IHt9KTogdm9pZCA9PiB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gbXNnIHx8ICcnO1xuICAgIGNsZWFyVGltZW91dChzdGF0dXNUaW1lcik7XG4gICAgaWYgKG1zZykge1xuICAgICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gb3B0cy5raW5kID09PSAnd2FybicgPyAndmFyKC0tcmVkKScgOlxuICAgICAgICBvcHRzLmtpbmQgPT09ICdpbmZvJyA/ICd2YXIoLS10ZXh0LTMpJyA6ICd2YXIoLS1ncmVlbiknO1xuICAgICAgc3RhdHVzVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHN0YXR1cy50ZXh0Q29udGVudCA9ICcnOyB9LCAyMjAwKTtcbiAgICB9XG4gIH07XG4gIGxldCB0b2FzdFRpbWVyID0gMDtcbiAgY29uc3Qgc2hvd1RvYXN0ID0gKHRpdGxlOiBzdHJpbmcsIGRldGFpbCA9ICcnLCBraW5kOiAnb2snIHwgJ3dhcm4nID0gJ29rJyk6IHZvaWQgPT4ge1xuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1jb3B5LXRvYXN0XScpO1xuICAgIGlmICghdG9hc3QpIHtcbiAgICAgIHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAnY29weS10b2FzdCc7XG4gICAgICB0b2FzdC5kYXRhc2V0LmNvcHlUb2FzdCA9ICd0cnVlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRvYXN0KTtcbiAgICB9XG4gICAgdG9hc3QuY2xhc3NMaXN0LnRvZ2dsZSgnd2FybicsIGtpbmQgPT09ICd3YXJuJyk7XG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC1pY29uXCI+JHtQR19JQ09OUy5zdmdTdHJpbmcoa2luZCA9PT0gJ3dhcm4nID8gJ2FsZXJ0LWNpcmNsZScgOiAnY2lyY2xlLWNoZWNrJywgMjIpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC10ZXh0XCI+PGI+JHtlc2NhcGVIdG1sKHRpdGxlKX08L2I+JHtkZXRhaWwgPyBgPHNtYWxsPiR7ZXNjYXBlSHRtbChkZXRhaWwpfTwvc21hbGw+YCA6ICcnfTwvc3Bhbj5gO1xuICAgIHRvYXN0LmhpZGRlbiA9IGZhbHNlO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB2b2lkIHRvYXN0Lm9mZnNldFdpZHRoO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcik7XG4gICAgdG9hc3RUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRvYXN0Py5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IGlmICh0b2FzdCkgdG9hc3QuaGlkZGVuID0gdHJ1ZTsgfSwgMTgwKTtcbiAgICB9LCAxNDUwKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0NvcGllZCA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWwgPSAnJyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICdvaycpO1xuICBjb25zdCBzaG93RG93bmxvYWRFcnJvciA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWw6IHN0cmluZyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICd3YXJuJyk7XG5cbiAgLy8g4pSA4pSA4pSAIFV0aWxpdGllcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGZhbGxiYWNrSWRDb3VudGVyID0gMDtcbiAgY29uc3Qgc2VjdXJlVG9rZW4gPSAoYnl0ZXMgPSAxMik6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBVaW50OEFycmF5KGJ5dGVzKTtcbiAgICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYXcpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocmF3KS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfV8keygrK2ZhbGxiYWNrSWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG1zZ0lkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgaWYgKGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQpIHJldHVybiBnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKCk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggKi8gfVxuICAgIHJldHVybiBgaWRfJHtzZWN1cmVUb2tlbigxNil9YDtcbiAgfTtcbiAgY29uc3QgZXNjYXBlSHRtbCA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBTdHJpbmcocykucmVwbGFjZUFsbCgnJicsICcmYW1wOycpLnJlcGxhY2VBbGwoJzwnLCAnJmx0OycpLnJlcGxhY2VBbGwoJz4nLCAnJmd0OycpO1xuICBjb25zdCBlc2NhcGVSZSA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xuICBjb25zdCBoaWdobGlnaHRNYXRjaCA9ICh0ZXh0OiBzdHJpbmcsIHE6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KTtcbiAgICByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoYCgke2VzY2FwZVJlKHEpfSlgLCAnZ2knKSwgJzxtYXJrPiQxPC9tYXJrPicpO1xuICB9O1xuICAvLyBXYWxrIHRleHQgbm9kZXMgaW5zaWRlIGByb290YCwgd3JhcHBpbmcgY2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGVzIG9mIGBxYFxuICAvLyBpbiA8bWFyaz4gZWxlbWVudHMuIERvZXNuJ3QgdG91Y2ggYXR0cmlidXRlIHN0cmluZ3Mgb3IgaW5uZXItdGFnIEhUTUwgc29cbiAgLy8gaXQncyBzYWZlIHRvIHJ1biBvbiBhbHJlYWR5LWhpZ2hsaWdodGVkIEpTT04gb3V0cHV0LlxuICBjb25zdCB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzID0gKHJvb3Q6IEhUTUxFbGVtZW50LCBxOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoIXEpIHJldHVybjtcbiAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmUocSksICdnaScpO1xuICAgIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIocm9vdCwgTm9kZUZpbHRlci5TSE9XX1RFWFQpO1xuICAgIGNvbnN0IHRhcmdldHM6IFRleHRbXSA9IFtdO1xuICAgIGxldCBub2RlOiBOb2RlIHwgbnVsbDtcbiAgICB3aGlsZSAoKG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgIGlmIChyZS50ZXN0KG5vZGUubm9kZVZhbHVlID8/ICcnKSkgdGFyZ2V0cy5wdXNoKG5vZGUgYXMgVGV4dCk7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFyZ2V0cykge1xuICAgICAgY29uc3QgdmFsdWUgPSB0Lm5vZGVWYWx1ZSA/PyAnJztcbiAgICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBsZXQgbGFzdCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgdmFsdWUubWF0Y2hBbGwocmUpKSB7XG4gICAgICAgIGNvbnN0IGkgPSBtLmluZGV4ID8/IDA7XG4gICAgICAgIGlmIChpID4gbGFzdCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCwgaSkpO1xuICAgICAgICBjb25zdCBtayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21hcmsnKTtcbiAgICAgICAgbWsudGV4dENvbnRlbnQgPSBtWzBdO1xuICAgICAgICBmcmFnLmFwcGVuZChtayk7XG4gICAgICAgIGxhc3QgPSBpICsgbVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICBpZiAobGFzdCA8IHZhbHVlLmxlbmd0aCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCkpO1xuICAgICAgdC5yZXBsYWNlV2l0aChmcmFnKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHdvcmRDb3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gKHMubWF0Y2goL1xcUysvZykgPz8gW10pLmxlbmd0aDtcbiAgY29uc3QgdG9rZW5Db3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gTWF0aC5jZWlsKHMubGVuZ3RoIC8gNCk7XG4gIGNvbnN0IHBhdGhPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5wYXRobmFtZTsgfSBjYXRjaCB7IHJldHVybiB1OyB9IH07XG4gIGNvbnN0IGhvc3RPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5ob3N0OyB9IGNhdGNoIHsgcmV0dXJuICcnOyB9IH07XG4gIC8vIEZpbGVuYW1lLXNhZmUgaG9zdCBzbHVnOiBkb3RzIOKGkiB1bmRlcnNjb3JlcyBwZXIgcHJvamVjdCBjb252ZW50aW9uLlxuICAvLyBNaXJyb3JzIGJhY2tncm91bmQudHMgaG9zdFNsdWcgZm9yIHN5bW1ldHJ5IGFjcm9zcyBzY3JlZW5zaG90ICsgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcy5cbiAgY29uc3QgaG9zdFNsdWcgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGggPSBob3N0T2YodXJsKTtcbiAgICBpZiAoIWgpIHJldHVybiAndW5rbm93bic7XG4gICAgcmV0dXJuIGgucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG4gIH07XG4gIC8vIFBpY2sgdGhlIG1vc3QtZnJlcXVlbnQgaG9zdCBhY3Jvc3MgYWxsIHNlbGVjdG9yIGNhcHR1cmVzIChmb3IgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcykuIFdoZW4gdGhlIHdvcmtzcGFjZSBzcGFucyBtdWx0aXBsZSBob3N0cywgcmV0dXJuICdtdWx0aScuXG4gIGNvbnN0IGRvbWluYW50SG9zdFNsdWcgPSAoKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdFNsdWcobS5lbnRyeS51cmwpO1xuICAgICAgY291bnRzLnNldChoLCAoY291bnRzLmdldChoKSA/PyAwKSArIDEpO1xuICAgIH1cbiAgICBpZiAoIWNvdW50cy5zaXplKSByZXR1cm4gJ2VtcHR5JztcbiAgICBsZXQgYmVzdCA9ICcnO1xuICAgIGxldCBiZXN0TiA9IDA7XG4gICAgZm9yIChjb25zdCBbaCwgbl0gb2YgY291bnRzKSB7XG4gICAgICBpZiAobiA+IGJlc3ROKSB7IGJlc3QgPSBoOyBiZXN0TiA9IG47IH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50cy5zaXplID4gMSA/ICdtdWx0aScgOiBiZXN0O1xuICB9O1xuICAvLyBEaXN0aW5jdCBob3N0cyBwcmVzZW50IGluIHRoaXMgd29ya3NwYWNlIChhbHBoYWJldGljYWwsIGNhcHBlZCkuIFVzZWQgaW5cbiAgLy8gdGhlIGV4cG9ydCBtYW5pZmVzdCdzIGBob3N0c2AgZmllbGQuXG4gIGNvbnN0IGRpc3RpbmN0SG9zdHMgPSAoKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IHNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdE9mKG0uZW50cnkudXJsKTtcbiAgICAgIGlmIChoKSBzZXQuYWRkKGgpO1xuICAgIH1cbiAgICByZXR1cm4gWy4uLnNldF0uc29ydCgpLnNsaWNlKDAsIDIwKTtcbiAgfTtcbiAgLy8gQnVpbGQgYSBmaWxlbmFtZSBvZiB0aGUgc2hhcGUgYHBpbmNoZ3JhYi08d29ya3NwYWNlPi08aG9zdD4tPGVwb2NoPi48ZXh0PmAuXG4gIGNvbnN0IGJ1aWxkRXhwb3J0RmlsZW5hbWUgPSAoZXh0OiAnanNvbmwnIHwgJ21kJyB8ICd0YXIuenN0Jyk6IHN0cmluZyA9PlxuICAgIGBwaW5jaGdyYWItJHthY3RpdmVXc30tJHtkb21pbmFudEhvc3RTbHVnKCl9LSR7RGF0ZS5ub3coKX0uJHtleHR9YDtcbiAgLy8gU2tpcC1saXN0IG1hdGNoOiBzdWJzdHJpbmcgKGNhc2UtaW5zZW5zaXRpdmUpIG1hdGNoIGFnYWluc3QgdGhlIFVSTCdzXG4gIC8vIGhvc3QuIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIFVSTCBwYXJzaW5nIG9uIHRoZSBwYXR0ZXJucyBzbyB0aGUgdXNlclxuICAvLyBjYW4gd3JpdGUgYHdyYW5uZ2xlLmNvbWAgYW5kIGhhdmUgaXQgbWF0Y2ggYGFwcC53cmFubmdsZS5jb21gIHRvby5cbiAgY29uc3Qgc2hvdWxkU2tpcFNjcmVlbnNob3QgPSAodXJsOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBsaXN0ID0gKHByZWZzLnNraXBTY3JlZW5zaG90SG9zdHMgPz8gJycpLnNwbGl0KCcsJykubWFwKChzKSA9PiBzLnRyaW0oKS50b0xvd2VyQ2FzZSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGhvc3QgPSBob3N0T2YodXJsKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBsaXN0LnNvbWUoKHBhdCkgPT4gaG9zdC5pbmNsdWRlcyhwYXQpKTtcbiAgfTtcblxuICAvLyBKU09OIHN5bnRheCBoaWdobGlnaHQgKHBlci1rZXkgY29sb3IgaXMgaGFzaGVkIGZvciB2aXN1YWwgdmFyaWV0eSkuXG4gIGNvbnN0IEtFWV9QQUxFVFRFID0gWycjZmY3ZTc4JywgJyNmZmI0NTQnLCAnI2ZmZTA2NicsICcjN2JkOTdhJywgJyM1ZmQxZmYnLCAnIzliOGNmZicsICcjZmY4NWMxJywgJyNmZjVmMDAnLCAnIzEwYjk4MScsICcjZjU5ZTBiJywgJyNhNzhiZmEnLCAnIzM0ZDM5OSddO1xuICBjb25zdCBjb2xvckZvcktleSA9IChrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGggPSAoaCAqIDMxICsgay5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgICByZXR1cm4gS0VZX1BBTEVUVEVbaCAlIEtFWV9QQUxFVFRFLmxlbmd0aF0hO1xuICB9O1xuICBjb25zdCBKU09OX1RPS0VOX1JFID0gLyhcXHMrKXwoXCIoPzpbXlwiXFxcXF18XFxcXC4pKlwiKXwodHJ1ZXxmYWxzZXxudWxsKXwoLT9cXGQrKD86XFwuXFxkKyk/KD86W2VFXVsrLV0/XFxkKyk/KXwoW3t9W1xcXSw6XSkvZztcbiAgY29uc3QgYXBwZW5kSnNvbkhpZ2hsaWdodCA9IChyb290OiBIVE1MRWxlbWVudCwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgcm9vdC50ZXh0Q29udGVudCA9ICcnO1xuICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xuICAgIGxldCBsYXN0ID0gMDtcbiAgICBKU09OX1RPS0VOX1JFLmxhc3RJbmRleCA9IDA7XG4gICAgd2hpbGUgKChtID0gSlNPTl9UT0tFTl9SRS5leGVjKHRleHQpKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKG0uaW5kZXggPiBsYXN0KSByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKGxhc3QsIG0uaW5kZXgpKSk7XG4gICAgICBsYXN0ID0gSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXg7XG4gICAgICBjb25zdCBbLCB3cywgc3RyLCBsaXQsIG51bSwgcHVuY3RdID0gbTtcbiAgICAgIGlmICh3cykgeyByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh3cykpOyBjb250aW51ZTsgfVxuICAgICAgaWYgKHN0cikge1xuICAgICAgICBsZXQgayA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgICB3aGlsZSAoayA8IHRleHQubGVuZ3RoICYmICh0ZXh0W2tdID09PSAnICcgfHwgdGV4dFtrXSA9PT0gJ1xcdCcgfHwgdGV4dFtrXSA9PT0gJ1xcbicpKSBrKys7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGlmICh0ZXh0W2tdID09PSAnOicpIHtcbiAgICAgICAgICBsZXQga2V5OiBzdHJpbmc7XG4gICAgICAgICAgdHJ5IHsga2V5ID0gSlNPTi5wYXJzZShzdHIpIGFzIHN0cmluZzsgfSBjYXRjaCB7IGtleSA9IHN0ci5zbGljZSgxLCAtMSk7IH1cbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdrJztcbiAgICAgICAgICBzcGFuLnN0eWxlLmNvbG9yID0gY29sb3JGb3JLZXkoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdzJztcbiAgICAgICAgfVxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gc3RyO1xuICAgICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgaWYgKGxpdCkgc3Bhbi5jbGFzc05hbWUgPSAnYic7XG4gICAgICBlbHNlIGlmIChudW0pIHNwYW4uY2xhc3NOYW1lID0gJ24nO1xuICAgICAgZWxzZSBpZiAocHVuY3QpIHNwYW4uY2xhc3NOYW1lID0gJ3AnO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGxpdCA/PyBudW0gPz8gcHVuY3QgPz8gJyc7XG4gICAgICByb290LmFwcGVuZChzcGFuKTtcbiAgICB9XG4gICAgaWYgKGxhc3QgPCB0ZXh0Lmxlbmd0aCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0KSkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBQZXJzaXN0ZW5jZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgbG9hZEFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICB3b3Jrc3BhY2VzID0gKGF3YWl0IFN0b3JlLmdldDxXb3Jrc3BhY2VbXT4oV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpKSB8fCB3b3Jrc3BhY2VzO1xuICAgIGlmICghd29ya3NwYWNlcy5sZW5ndGgpIHdvcmtzcGFjZXMgPSBbe25hbWU6ICdkZWZhdWx0JywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XTtcbiAgICBhY3RpdmVXcyA9IChhd2FpdCBTdG9yZS5nZXQ8c3RyaW5nPigncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsICdkZWZhdWx0JykpIHx8ICdkZWZhdWx0JztcbiAgICBpZiAoIXdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBhY3RpdmVXcykpIGFjdGl2ZVdzID0gd29ya3NwYWNlc1swXSEubmFtZTtcbiAgICBwcmVmcyA9IHsuLi5ERUZBVUxUX1BSRUZTLCAuLi4oYXdhaXQgU3RvcmUuZ2V0PFBhcnRpYWw8UHJlZnM+PihQUkVGU19TVE9SQUdFX05BTUUsIHt9KSl9O1xuICAgIC8vIFBhdGggbWlncmF0aW9uOiBwcmlvciB2ZXJzaW9ucyBkZWZhdWx0ZWQgc2tpbGxQYXRoIHRvXG4gICAgLy8gYH4vLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLCBhbmQgc29tZSB1c2VycyBoYWQgaXQgc3RvcmVkIGFzXG4gICAgLy8gYH4vLmRvdGZpbGVzLy5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYC4gVGhlIHNraWxsIHdhcyByZW5hbWVkXG4gICAgLy8gdG8gYFBpbmNoR3JhYmA7IGFueSBgfi8uZG90ZmlsZXMvYCBwcmVmaXggaXMgc3RyaXBwZWQgZnJvbVxuICAgIC8vIGV4cG9zZWQgZGVmYXVsdHMgKGRvdGZpbGVzIGlzIGEgcGVyc29uYWwgY29uZmlnIHNvdXJjZSDigJQgZXhwb3J0c1xuICAgIC8vIHNob3VsZG4ndCBsZWFrIHRoYXQgcGF0aCkuXG4gICAgY29uc3QgdXBncmFkZVBhdGggPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkLCBmcmVzaDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgIGlmICghcCkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuaW5jbHVkZXMoJy5kb3RmaWxlcycpKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5lbmRzV2l0aCgnc2tpbGxzL3VpL1NLSUxMLm1kJykpIHJldHVybiBmcmVzaDtcbiAgICAgIHJldHVybiBwO1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLmRlc2lnblBhdGgsIERFRkFVTFRfUFJFRlMuZGVzaWduUGF0aCk7XG4gICAgcHJlZnMuc2tpbGxQYXRoID0gdXBncmFkZVBhdGgocHJlZnMuc2tpbGxQYXRoLCBERUZBVUxUX1BSRUZTLnNraWxsUGF0aCk7XG4gICAgLy8gQ29udGVudCBtaWdyYXRpb246IHByZXZpb3VzIHZlcnNpb25zIHN0b3JlZCB0aGUgZW50aXJlIHRlbXBsYXRlXG4gICAgLy8gdGV4dCBpbnNpZGUgYHByZWZzLmRlc2lnbk1kYCAvIGBwcmVmcy5za2lsbE1kYCBhcyBkZWZhdWx0cy4gVGhhdFxuICAgIC8vIGF0ZSB+MzYwS0Igb2YgY2hyb21lLnN0b3JhZ2UgcXVvdGEgZm9yIG5vIGJlbmVmaXQuIERldGVjdCB3aGVuXG4gICAgLy8gdGhlIHN0b3JlZCB2YWx1ZSBtYXRjaGVzIG9uZSBvZiB0aGUgYnVuZGxlZCB0ZW1wbGF0ZXMgYW5kIGNsZWFyXG4gICAgLy8gaXQg4oCUIHRoZSByZXNvbHZlciBmYWxscyBiYWNrIHRvIHRoZSBidW5kbGVkIGZpbGUgb24gdGhlIGZseS5cbiAgICAvLyBBbHNvIHNjcnViIGFueSBsZWFrZWQgYH4vLmRvdGZpbGVzL2Agc3Vic3RyaW5nLlxuICAgIGNvbnN0IHNjcnViRG90ZmlsZXMgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgICBzLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLy5hZ2VudHMvJywgJ34vLmFnZW50cy8nKVxuICAgICAgIC5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8nLCAnfi8uYWdlbnRzLycpO1xuICAgIGNvbnN0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUgPSBhc3luYyAoY3VycmVudDogc3RyaW5nLCBrZXlzOiBUZW1wbGF0ZUtleVtdKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgIGlmICghY3VycmVudCB8fCAhY3VycmVudC50cmltKCkpIHJldHVybiAnJztcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSBjdXJyZW50LnRyaW0oKTtcbiAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgICAgIGNvbnN0IHRwbCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoaykpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRwbCAmJiB0cGwgPT09IHRyaW1tZWQpIHJldHVybiAnJzsgLy8gbWF0Y2hlcyBhIGJ1bmRsZWQgdGVtcGxhdGUg4oCUIGNvbGxhcHNlIHRvIGVtcHR5XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycmVudC5pbmNsdWRlcygnLmRvdGZpbGVzJykgPyBzY3J1YkRvdGZpbGVzKGN1cnJlbnQpIDogY3VycmVudDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnbk1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5kZXNpZ25NZCA/PyAnJywgWydsb2NhbERlc2lnbicsICdkZXNpZ25UZW1wbGF0ZSddKTtcbiAgICBwcmVmcy5za2lsbE1kID0gYXdhaXQgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZShwcmVmcy5za2lsbE1kID8/ICcnLCBbJ2xvY2FsU2tpbGwnLCAnc2tpbGxUZW1wbGF0ZSddKTtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKGFjdGl2ZVdzKTtcbiAgfTtcbiAgY29uc3QgbG9hZFdvcmtzcGFjZSA9IGFzeW5jIChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhY3RpdmVXcyA9IG5hbWU7XG4gICAgdm9pZCBTdG9yZS5zZXQoJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCBuYW1lKTtcbiAgICAvLyBNaW50IGEgbmV3IHNlc3Npb25JZCBwZXIgd29ya3NwYWNlIGxvYWQuIFNhbWUgd29ya3NwYWNlIHJlLW9wZW5lZFxuICAgIC8vID0gbmV3IHNlc3Npb246IGRpc3RpbmN0IHV1aWQgc28gYSBjb25zdW1lciBjYW4gdGVsbCB0d28gYm9vdHNcbiAgICAvLyBhcGFydCBldmVuIHdoZW4gdGhlIGNhcHR1cmVzIGxhbmQgaW4gdGhlIHNhbWUgb24tZGlzayBmaWxlLlxuICAgIHNlc3Npb25JZCA9IG1zZ0lkKCk7XG4gICAgbWVzc2FnZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFBhbmVsTWVzc2FnZVtdPih3c01zZ0tleShuYW1lKSwgW10pKSB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSBtZXNzYWdlcyA9IFtdO1xuICAgIC8vIE1pZ3JhdGUgbGVnYWN5IGVudHJpZXMgKG5vIHVpZCwgc3RhdGVzLWFzLXJlY29yZCwgYXR0cnMuZm9ybWF0KSBhbmRcbiAgICAvLyBwZXJzaXN0IGlmIGFueXRoaW5nIGNoYW5nZWQgc28gd2UgZG9uJ3QgcGF5IHRoZSBtaWdyYXRpb24gY29zdCBhZ2FpblxuICAgIC8vIG5leHQgbG9hZC5cbiAgICBpZiAobWlncmF0ZUxvYWRlZE1lc3NhZ2VzKCkpIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KG5hbWUpLCBtZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwYWdlU2hvdHNGaXJlZC5jbGVhcigpO1xuICAgIGNvbnN0IHN0b3JlZCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0tleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWQpKSBzaG90cy5zZXQoaywgdik7XG4gICAgLy8gUmVzdG9yZSB0aGUgZnVsbC1yZXNvbHV0aW9uIFBORyBjYWNoZSBzbyBhIHdvcmtzcGFjZSBhcmNoaXZlXG4gICAgLy8gZXhwb3J0ZWQgQUZURVIgYSBwYW5lbCByZWxvYWQgc3RpbGwgYnVuZGxlcyBzY3JlZW5zaG90cyBmcm9tXG4gICAgLy8gZWFybGllciBjYXB0dXJlcy4gRklGTyBvcmRlciBpcyBwcmVzZXJ2ZWQgYnkgT2JqZWN0IGtleSBvcmRlci5cbiAgICBjb25zdCBzdG9yZWRGdWxsID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzRnVsbEtleShuYW1lKSwge30pKSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzdG9yZWRGdWxsKSkgc2hvdHNGdWxsLnNldChrLCB2KTtcbiAgICAvLyBMb2FkIHRoaXMgd29ya3NwYWNlJ3MgcGVyc2lzdGVudCBzbmFwc2hvdCBoaXN0b3J5IChDbGVhci1hbGwgYXJjaGl2ZXMpLlxuICAgIGF3YWl0IGxvYWRXc1NuYXBzaG90cyhuYW1lKTtcbiAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgc2VsZWN0b3JFcnJvcnMuY2xlYXIoKTtcbiAgICB1bmRvU3RhY2subGVuZ3RoID0gMDtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gbnVsbDtcbiAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICB9O1xuICBjb25zdCBwZXJzaXN0ID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzTXNnS2V5KGFjdGl2ZVdzKSwgbWVzc2FnZXMpO1xuICAgIC8vIFB1c2ggY2FwdHVyZWQtc2VsZWN0b3Igc2V0IHNvIHRoZSBjb250ZW50IHNjcmlwdCdzIGhvdmVyIHdhbGtlciBjYW5cbiAgICAvLyByZXNvbHZlIGRlc2NlbmRhbnRzIOKGkiBjYXB0dXJlZCBhbmNlc3Rvci5cbiAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgc2VuZFRvQ1Moe2tpbmQ6ICdzZXQtY2FwdHVyZWQnLCBzZWxlY3RvcnN9KTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFByZWZzID0gKCk6IHZvaWQgPT4ge1xuICAgIHZvaWQgU3RvcmUuc2V0KFBSRUZTX1NUT1JBR0VfTkFNRSwgcHJlZnMpO1xuICAgIC8vIFB1c2ggdGhlIHN1YnNldCBvZiBwcmVmcyB0aGUgY29udGVudCBzY3JpcHQgY2FyZXMgYWJvdXQgc28gaXRzXG4gICAgLy8gb3ZlcmxheSAoc3BhY2luZyB2aXN1YWxpemVyLCBob3ZlciBzbmFwLCBldGMuKSByZWZsZWN0cyB0aGUgbGF0ZXN0LlxuICAgIHZvaWQgc2VuZFRvQ1Moe1xuICAgICAga2luZDogJ3NldC1jcy1wcmVmcycsXG4gICAgICBzcGFjaW5nT3ZlcmxheTogcHJlZnMuc3BhY2luZ092ZXJsYXksXG4gICAgICBob3ZlclNuYXA6IHByZWZzLmhvdmVyU25hcCxcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICAvLyBGdWxsLXJlc29sdXRpb24gUE5HIHBlcnNpc3RlbmNlIHdpdGggRklGTyBldmljdGlvbi4gZGF0YVVSTCBzdHJpbmdzXG4gIC8vIGNhbiBydW4gNTAtNTAwIEtCIGVhY2g7IHRoZSBkZWZhdWx0IHF1b3RhIGdldHMgZXhoYXVzdGVkIGluIHRlbnMgb2ZcbiAgLy8gY2FwdHVyZXMgd2l0aG91dCBhIGJ1ZGdldC4gTWFwIGluc2VydGlvbiBvcmRlciA9IEZJRk8gb3JkZXIsIHNvXG4gIC8vIHdlIGV2aWN0IGZyb20gdGhlIGZyb250IHVudGlsIHVuZGVyIGJ1ZGdldCBiZWZvcmUgcGVyc2lzdGluZy5cbiAgY29uc3QgZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgZm9yIChjb25zdCB2IG9mIHNob3RzRnVsbC52YWx1ZXMoKSkgdG90YWwgKz0gdi5sZW5ndGg7XG4gICAgbGV0IGV2aWN0ZWQgPSAwO1xuICAgIHdoaWxlICh0b3RhbCA+IFNIT1RTX0ZVTExfQlVER0VUX0JZVEVTKSB7XG4gICAgICBjb25zdCBmaXJzdEtleSA9IHNob3RzRnVsbC5rZXlzKCkubmV4dCgpLnZhbHVlO1xuICAgICAgaWYgKGZpcnN0S2V5ID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgY29uc3QgcmVtb3ZlZCA9IHNob3RzRnVsbC5nZXQoZmlyc3RLZXkpO1xuICAgICAgaWYgKHJlbW92ZWQgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBzaG90c0Z1bGwuZGVsZXRlKGZpcnN0S2V5KTtcbiAgICAgIHRvdGFsIC09IHJlbW92ZWQubGVuZ3RoO1xuICAgICAgZXZpY3RlZCsrO1xuICAgIH1cbiAgICByZXR1cm4gZXZpY3RlZDtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFNob3RzRnVsbCA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBldmljdGVkID0gZXZpY3RTaG90c0Z1bGxUb0J1ZGdldCgpO1xuICAgIGlmIChldmljdGVkID4gMCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCBgc2hvdHNGdWxsIEZJRk8tZXZpY3RlZCAke2V2aWN0ZWR9IG9sZGVzdCBlbnRyaWVzIHRvIGZpdCAke1NIT1RTX0ZVTExfQlVER0VUX0JZVEVTIC8gMTAyNCAvIDEwMjR9TUIgYnVkZ2V0YCk7XG4gICAgfVxuICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIHNob3RzRnVsbCkgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzRnVsbEtleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RXb3Jrc3BhY2VzID0gKCk6IHZvaWQgPT4geyB2b2lkIFN0b3JlLnNldChXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcyk7IH07XG5cbiAgLy8g4pSA4pSA4pSAIFRhYiDih4Qgd29ya3NwYWNlIGJpbmRpbmcgKCMxOCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJhY2tncm91bmQgYW5ub3VuY2VzIGVhY2ggdG9vbGJhci1jbGljayBhY3RpdmF0aW9uIHZpYSAncGctdGFiLWFjdGl2YXRlZCcuXG4gIC8vIFRoZSBmaXJzdCBhY3RpdmF0aW9uIGFkb3B0cyB0aGUgY3VycmVudCB1bmJvdW5kIHdvcmtzcGFjZTsgbGF0ZXIgdGFicyBlYWNoXG4gIC8vIGdldCB0aGVpciBvd24uIFBpY2tpbmcgYSBib3VuZCB3b3Jrc3BhY2UganVtcHMgdGhlIGJyb3dzZXIgdG8gaXRzIHRhYi5cbiAgY29uc3Qgc2x1Z0ZvclRhYiA9ICh1cmw6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgY29uc3QgaCA9IG5ldyBVUkwodXJsKS5ob3N0bmFtZS5yZXBsYWNlKC9ed3d3XFwuLywgJycpOyBpZiAoaCkgcmV0dXJuIGg7IH0gY2F0Y2ggeyAvKiBub3QgYSB1cmwgKi8gfVxuICAgIGNvbnN0IHQgPSAodGl0bGUgfHwgJycpLnRyaW0oKTtcbiAgICByZXR1cm4gdCA/IHQuc2xpY2UoMCwgMjQpIDogJ3RhYic7XG4gIH07XG4gIGNvbnN0IHVuaXF1ZVdzTmFtZSA9IChiYXNlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghd29ya3NwYWNlcy5zb21lKCh3KSA9PiB3Lm5hbWUgPT09IGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgICBmb3IgKGxldCBpID0gMjsgOyBpKyspIHsgY29uc3QgbiA9IGAke2Jhc2V9ICR7aX1gOyBpZiAoIXdvcmtzcGFjZXMuc29tZSgodykgPT4gdy5uYW1lID09PSBuKSkgcmV0dXJuIG47IH1cbiAgfTtcbiAgY29uc3Qgb25UYWJBY3RpdmF0ZWQgPSBhc3luYyAoe3RhYklkLCB1cmwsIHRpdGxlfToge3RhYklkOiBudW1iZXI7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nfSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGxldCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy50YWJJZCA9PT0gdGFiSWQpO1xuICAgIGlmICh3cykge1xuICAgICAgaWYgKHdzLnVybCAhPT0gdXJsIHx8IHdzLnRpdGxlICE9PSB0aXRsZSkgeyB3cy51cmwgPSB1cmw7IHdzLnRpdGxlID0gdGl0bGU7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VycmVudCA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBhY3RpdmVXcyk7XG4gICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LnRhYklkID09IG51bGwpIHtcbiAgICAgICAgd3MgPSBjdXJyZW50OyB3cy50YWJJZCA9IHRhYklkOyB3cy51cmwgPSB1cmw7IHdzLnRpdGxlID0gdGl0bGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cyA9IHtuYW1lOiB1bmlxdWVXc05hbWUoc2x1Z0ZvclRhYih1cmwsIHRpdGxlKSksIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0YWJJZCwgdXJsLCB0aXRsZX07XG4gICAgICAgIHdvcmtzcGFjZXMucHVzaCh3cyk7XG4gICAgICB9XG4gICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIH1cbiAgICBpZiAoYWN0aXZlV3MgIT09IHdzLm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod3MubmFtZSk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICAvLyBCcmluZyB0aGUgYnJvd3NlciB0byBhIHdvcmtzcGFjZSdzIGJvdW5kIHRhYiB3aGVuIHRoZSB1c2VyIHBpY2tzIGl0LlxuICBjb25zdCBmb2N1c1dvcmtzcGFjZVRhYiA9IChuYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCB3cyA9IHdvcmtzcGFjZXMuZmluZCgodykgPT4gdy5uYW1lID09PSBuYW1lKTtcbiAgICBpZiAoIWluRXh0ZW5zaW9uIHx8IHdzPy50YWJJZCA9PSBudWxsKSByZXR1cm47XG4gICAgY2hyb21lLnRhYnMudXBkYXRlKHdzLnRhYklkLCB7YWN0aXZlOiB0cnVlfSkudGhlbigodCkgPT4ge1xuICAgICAgaWYgKHQ/LndpbmRvd0lkICE9IG51bGwpIHZvaWQgY2hyb21lLndpbmRvd3M/LnVwZGF0ZSh0LndpbmRvd0lkLCB7Zm9jdXNlZDogdHJ1ZX0pPy5jYXRjaD8uKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgIH0pLmNhdGNoKCgpID0+IHsgLyogdGFiIHdhcyBjbG9zZWQgKi8gfSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNuYXBzaG90IC8gdW5kbyAvIHJlZG8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNuYXBzaG90ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdXNwZW5kU25hcHNob3RzKSByZXR1cm47XG4gICAgaWYgKHVuZG9TdGFjay5sZW5ndGggPj0gVU5ET19DQVApIHVuZG9TdGFjay5zaGlmdCgpO1xuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVzdG9yZSA9IChqc29uOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBzdXNwZW5kU25hcHNob3RzID0gdHJ1ZTtcbiAgICB0cnkgeyBtZXNzYWdlcyA9IEpTT04ucGFyc2UoanNvbikgYXMgUGFuZWxNZXNzYWdlW107IH0gY2F0Y2ggeyBtZXNzYWdlcyA9IFtdOyB9XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IGZhbHNlO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcbiAgY29uc3QgdW5kbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXVuZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHVuZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHJlZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZSh1bmRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1VuZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFyZWRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byByZWRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUocmVkb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdSZWRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCB1cGRhdGVVbmRvQnV0dG9ucyA9ICgpOiB2b2lkID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJ1bmRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgdW5kb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwicmVkb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHJlZG9TdGFjay5sZW5ndGggPT09IDApO1xuICB9O1xuICBjb25zdCB1cGRhdGVDb3B5UGF0aEJ1dHRvbiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtYWN0aW9uPVwiY29weS1wYXRoXCJdJyk7XG4gICAgaWYgKCFidG4pIHJldHVybjtcbiAgICBjb25zdCBoYXMgPSBCb29sZWFuKGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoKTtcbiAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCAhaGFzKTtcbiAgICBidG4uZGF0YXNldC50aXAgPSBoYXNcbiAgICAgID8gYENvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC5cXG4ke2xhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoID8/ICcnfWBcbiAgICAgIDogJ0NvcHkgdGhlIHBhdGggb2YgeW91ciBsYXN0IGV4cG9ydC4gUnVuIGFuIGV4cG9ydCBmaXJzdC4nO1xuICB9O1xuICBjb25zdCBvbkNvcHlQYXRoID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aDtcbiAgICBpZiAoIXBhdGhUb0NvcHkpIHtcbiAgICAgIHNldFN0YXR1cygnTm8gZXhwb3J0IHlldCDigJQgcnVuIGEgZG93bmxvYWQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwYXRoVG9Db3B5KTtcbiAgICAgIC8vIFNob3cgb25seSB0aGUgbGVhZiBmaWxlbmFtZSBpbiB0aGUgc3RhdHVzIOKAlCB0aGUgZnVsbCBXaW5kb3dzLXN0eWxlXG4gICAgICAvLyBhYnNvbHV0ZSBwYXRoIHdvdWxkIGJlIDEwMCsgY2hhcnMgYW5kIHdhcyBkaXNydXB0aW5nIHRoZSBzaWRlYmFyXG4gICAgICAvLyBsYXlvdXQgZm9yIHRoZSAyLXNlY29uZCBzdGF0dXMgVFRMLlxuICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgIHNldFN0YXR1cyhgQ29waWVkIHBhdGggwrcgJHtsZWFmfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIHBhdGgnLCBsZWFmKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCB3cml0ZSBmYWlsZWQ6ICcgKyBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignQ2xpcGJvYXJkIGZhaWxlZCcsIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSkpO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgQnJpZGdlIHRvIGFjdGl2ZSB0YWIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRUb0NTID0gYXN5bmMgKHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG1zZyA9IHBnKHBheWxvYWQpO1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgICAgaWYgKHRhYnNbMF0/LmlkICE9IG51bGwpIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIG1zZykuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHsgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiBtc2d9KSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgc2VuZFRvQ1NBbmRXYWl0ID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9Dcyk6IFByb21pc2U8UiB8IG51bGw+ID0+IG5ldyBQcm9taXNlPFIgfCBudWxsPigocmVzb2x2ZSkgPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnN0IHJlcUlkID0gYHJlcV8ke3NlY3VyZVRva2VuKDEyKX1gO1xuICAgICAgY29uc3Qgb25SZXNwID0gKGU6IEV2ZW50KTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGRldGFpbCA9IChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWw7XG4gICAgICAgIGlmIChkZXRhaWw/Ll9fcmVxSWQgPT09IHJlcUlkKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICAgICAgcmVzb2x2ZShkZXRhaWwucmVwbHkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IHtfX3JlcUlkOiByZXFJZCwgLi4ucGcocGF5bG9hZCl9fSkpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApOyByZXNvbHZlKG51bGwpOyB9LCAxMDAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sICh0YWJzKSA9PiB7XG4gICAgICBpZiAoIXRhYnNbMF0/LmlkKSB7IHJlc29sdmUobnVsbCk7IHJldHVybjsgfVxuICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgcGcocGF5bG9hZCksIChyOiBSKSA9PiByZXNvbHZlKHIpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGNvbnN0IHNlbmRUb0JnID0gYXN5bmMgPFI+KHBheWxvYWQ6IFBhbmVsVG9CZyk6IFByb21pc2U8UiB8IG51bGw+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm4gbnVsbDtcbiAgICB0cnkgeyByZXR1cm4gKGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHBnKHBheWxvYWQpKSkgYXMgUjsgfVxuICAgIGNhdGNoIChlKSB7IHJldHVybiB7ZXJyb3I6IFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSl9IGFzIHVua25vd24gYXMgUjsgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBSZWNlaXZpbmcgZnJvbSBjb250ZW50IHNjcmlwdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRGVmZW5zaXZlIHJpbmctYnVmZmVyIGRlZHVwZTogZXZlbiB0aG91Z2ggd2Ugbm93IHVzZSBvbmx5IG9uZSBjaGFubmVsLFxuICAvLyBhbnkgbWVzc2FnZSB0aGF0IHNvbWVob3cgYXJyaXZlcyB0d2ljZSB3aXRoaW4gfjIgc2Vjb25kcyBpcyBpZ25vcmVkLlxuICBjb25zdCByZWNlbnRNaWRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBSRUNFTlRfTUlEX0NBUCA9IDY0O1xuICBjb25zdCBvbkNzTWVzc2FnZSA9IChtc2c6IFBnRW52ZWxvcGU8Q3NUb1BhbmVsPik6IHZvaWQgPT4ge1xuICAgIGlmICghbXNnIHx8IG1zZy5fX3BnICE9PSB0cnVlKSByZXR1cm47XG4gICAgaWYgKG1zZy5fX21pZCkge1xuICAgICAgaWYgKHJlY2VudE1pZHMuaW5jbHVkZXMobXNnLl9fbWlkKSkgcmV0dXJuO1xuICAgICAgcmVjZW50TWlkcy5wdXNoKG1zZy5fX21pZCk7XG4gICAgICBpZiAocmVjZW50TWlkcy5sZW5ndGggPiBSRUNFTlRfTUlEX0NBUCkgcmVjZW50TWlkcy5zaGlmdCgpO1xuICAgIH1cbiAgICBpZiAoKG1zZyBhcyB7a2luZD86IHN0cmluZ30pLmtpbmQgPT09ICdwZy10YWItYWN0aXZhdGVkJykge1xuICAgICAgdm9pZCBvblRhYkFjdGl2YXRlZChtc2cgYXMgdW5rbm93biBhcyB7dGFiSWQ6IG51bWJlcjsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmd9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3dpdGNoIChtc2cua2luZCkge1xuICAgICAgY2FzZSAnY2FwdHVyZSc6IG9uQ2FwdHVyZShtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlcic6IG9uSG92ZXIobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXItZW5kJzogb25Ib3ZlckVuZCgpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWFkZCc6IG9uUGVuZGluZ0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwZW5kaW5nLWNsZWFyJzogb25QZW5kaW5nQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZmVlZGJhY2stYWRkJzogb25GZWVkYmFja0FkZChtc2cpOyByZXR1cm47XG4gICAgICBjYXNlICdwcmVmZXJlbmNlLWNoYW5nZSc6IG9uUHJlZmVyZW5jZUNoYW5nZShtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncHJlZmVyZW5jZS1jaGFuZ2UnfT4pOyByZXR1cm47XG4gICAgICBjYXNlICdwYWdlLXNuYXBzaG90Jzogb25QYWdlU25hcHNob3QoKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdwYWdlLXNuYXBzaG90J30+KS5wYXlsb2FkKTsgcmV0dXJuO1xuICAgICAgZGVmYXVsdDogcmV0dXJuO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvblByZWZlcmVuY2VDaGFuZ2UgPSAoe3JlYXNvbiwgcGFnZX06IHtyZWFzb246IHN0cmluZzsgcGFnZTogYW55fSk6IHZvaWQgPT4ge1xuICAgIGxpdmVUYWJVcmwgPSBwYWdlPy51cmwgPz8gbGl2ZVRhYlVybDtcbiAgICBsaXZlVGFiUGF0aCA9IGxpdmVUYWJVcmwgPyBwYXRoT2YobGl2ZVRhYlVybCkgOiBsaXZlVGFiUGF0aDtcbiAgICAvLyBQYWdlIHJvd3MgYXJlIGNhcHR1cmUgaGVhZGVycywgbm90IGEgdGFiL3BhZ2UgdGVsZW1ldHJ5IGZlZWQuIFRoZSBuZXh0XG4gICAgLy8gc2VsZWN0b3IgY2FwdHVyZSBmcm9tIHRoaXMgcGFnZSB3aWxsIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQvc3RhdGUgYW5kXG4gICAgLy8gaW5zZXJ0IGEgcGFnZSBoZWFkZXIgb25seSBpZiBuZWVkZWQuXG4gICAgc2V0U3RhdHVzKGAke3JlYXNvbn0gY2hhbmdlZGAsIHtraW5kOiAnaW5mbyd9KTtcbiAgfTtcblxuICAvLyBQYWdlLWdyb3VwIHJlY29yZHMgbWF5IGNhcnJ5IGEgZnVsbC1wYWdlIHNuYXBzaG90ICh2aWV3cG9ydCwgc2Nyb2xsXG4gIC8vIGV4dGVudHMsIGRwciwgbGFuZywgZnVsbC1wYWdlIHNjcmVlbnNob3QpLiBQYWdlTWVzc2FnZSBpbiB0eXBlcy50cyBkb2Vzbid0XG4gIC8vIHlldCBkZWNsYXJlIHRoZSBmaWVsZCwgc28gd2Ugd2lkZW4gaXQgbG9jYWxseSDigJQgdGhlIHZhbHVlIHBlcnNpc3RzIHdpdGhcbiAgLy8gdGhlIHJlc3Qgb2YgdGhlIG1lc3NhZ2UgSlNPTiBhbmQgcm91bmQtdHJpcHMgdGhyb3VnaCBleHBvcnQuXG4gIHR5cGUgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QgPSBQYWdlTWVzc2FnZSAmIHtzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH07XG4gIC8vIFNuYXBzaG90cyB0aGF0IGFycml2ZWQgYmVmb3JlIGEgcGFnZS1ncm91cCByZWNvcmQgZXhpc3RzIGZvciB0aGVpciBVUkwuXG4gIC8vIEFwcGxpZWQgd2hlbiB0aGUgcGFnZSBoZWFkZXIgaXMgbGF0ZXIgY3JlYXRlZCAoc2VlIG9uQ2FwdHVyZSkuXG4gIGNvbnN0IHBlbmRpbmdTbmFwc2hvdHMgPSBuZXcgTWFwPHN0cmluZywgUGFnZVNuYXBzaG90PigpO1xuICBjb25zdCBhcHBseVNuYXBzaG90VG9QYWdlID0gKHNuYXA6IFBhZ2VTbmFwc2hvdCk6IGJvb2xlYW4gPT4ge1xuICAgIC8vIEF0dGFjaCB0byB0aGUgbW9zdCByZWNlbnQgcGFnZS1ncm91cCByZWNvcmQgZm9yIHRoaXMgVVJMLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJyAmJiBtLnVybCA9PT0gc25hcC51cmwpIHtcbiAgICAgICAgKG0gYXMgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QpLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3Qgb25QYWdlU25hcHNob3QgPSAocGF5bG9hZDogUGFnZVNuYXBzaG90KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYXlsb2FkPy51cmwpIHJldHVybjtcbiAgICBpZiAoYXBwbHlTbmFwc2hvdFRvUGFnZShwYXlsb2FkKSkge1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHBhZ2UgcmVjb3JkIHlldCDigJQgc3Rhc2ggZm9yIHRoZSBuZXh0IGNhcHR1cmUgb24gdGhpcyBVUkwuXG4gICAgICBwZW5kaW5nU25hcHNob3RzLnNldChwYXlsb2FkLnVybCwgcGF5bG9hZCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uRmVlZGJhY2tBZGQgPSAoe3NlbGVjdG9yLCB0ZXh0LCB1cmwsIHBhcmVudFVpZH06IHtzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfSk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAvLyAgIDEuIHBhcmVudFVpZCDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IHN1cHBsaWVkIGEgc3RhYmxlIHVpZCAodGhlXG4gICAgLy8gICAgICBzdHJvbmdlc3QgbWF0Y2g7IHN1cnZpdmVzIHNlbGVjdG9yIGNoYW5nZXMsIHNpYmxpbmdcbiAgICAvLyAgICAgIGNvbGxpc2lvbnMsIG11bHRpcGxlIGNhcHR1cmVzIG9mIHRoZSBzYW1lIGVsZW1lbnQpLlxuICAgIC8vICAgMi4gc2VsZWN0b3IgKyB1cmwg4oCUIGNvbXBvc2l0ZSBrZXk7IHByZXZlbnRzIGNyb3NzLXBhZ2VcbiAgICAvLyAgICAgIGNvbnRhbWluYXRpb24gd2hlbiB0aGUgc2FtZSBzZWxlY3RvciBleGlzdHMgb24gbXVsdGlwbGUgVVJMcy5cbiAgICAvLyAgIDMuIHNlbGVjdG9yICsgbGl2ZVRhYlVybCDigJQgZmFsbGJhY2sgd2hlbiB0aGUgbWVzc2FnZSBkaWRuJ3RcbiAgICAvLyAgICAgIGNhcnJ5IGFuIGV4cGxpY2l0IHVybCAob2xkZXIgY29udGVudC1zY3JpcHQgbWVzc2FnZXMpLlxuICAgIGxldCBpZHggPSAtMTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnVpZCA9PT0gcGFyZW50VWlkKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnN0IHdhbnRVcmwgPSB1cmwgPz8gbGl2ZVRhYlVybCA/PyBudWxsO1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PlxuICAgICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcidcbiAgICAgICAgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3JcbiAgICAgICAgJiYgKCF3YW50VXJsIHx8IG0uZW50cnkudXJsID09PSB3YW50VXJsKSk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnb25GZWVkYmFja0FkZDogbm8gcGFyZW50IGZvdW5kJywge3NlbGVjdG9yLCB1cmwsIHBhcmVudFVpZH0pO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGxvc3QgaXRzIHBhcmVudCDigJQgY2hlY2sgdGhlIGFjdGl2ZSBjYXB0dXJlJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHBhcmVudE1zZyA9IG1lc3NhZ2VzW2lkeF0gYXMgU2VsZWN0b3JNZXNzYWdlO1xuICAgIGxldCBpbnNlcnRBdCA9IGlkeCArIDE7XG4gICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIG5ldyBmZWVkYmFjayByb3cgc28gdGhlIGV4cG9ydCBjYXJyaWVzXG4gICAgLy8gdGhlIEZLIGxpbmsgZXhwbGljaXRseSAobm90IGp1c3QgYnkgY2FwdHVyZS1hZGphY2VuY3kpLlxuICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICBwYXJlbnRVaWQ6IHBhcmVudE1zZy5lbnRyeS51aWQsXG4gICAgfSk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnQ29tbWVudCBhZGRlZCBmcm9tIHBhZ2UnKTtcbiAgICAvLyBFdmVyeSBmZWVkYmFjayBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LiBJZiB0aGUgcGFyZW50XG4gICAgLy8gY2FwdHVyZSBkaWRuJ3QgZ2V0IG9uZSAoYXV0b1NjcmVlbnNob3Qgb2ZmLCBza2lwU2NyZWVuc2hvdEhvc3RzXG4gICAgLy8gaGl0LCBuZXR3b3JrIGdsaXRjaCksIHJlLWZpcmUgbm93LlxuICAgIGlmICghcGFyZW50TXNnLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudE1zZyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUGVuZGluZ0FkZCA9ICh7ZW50cnl9OiB7ZW50cnk6IEVudHJ5fSk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkucHVzaChlbnRyeSk7IHJlbmRlcigpOyB9O1xuICBjb25zdCBvblBlbmRpbmdDbGVhciA9ICgpOiB2b2lkID0+IHsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyB9O1xuXG4gIGNvbnN0IGZpbmREdXBsaWNhdGUgPSAoc2VsZWN0b3I6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT5cbiAgICBtZXNzYWdlcy5maW5kKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT5cbiAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvciAmJiAoIXVybCB8fCBtLmVudHJ5LnVybCA9PT0gdXJsKSk7XG5cbiAgLy8gRmluZCBhbiBleGlzdGluZyBjYXB0dXJlIGZvciB0aGUgYWN0aXZlIHRhYiArIHNlbGVjdG9yLiBDcm9zcy1wYWdlXG4gIC8vIGNvbnRhbWluYXRpb24gcHJldmVudGlvbiAoc2VlIHR5cGVzLnRzIGZlZWRiYWNrLWFkZCBkb2NzdHJpbmcpOlxuICAvLyBhIHNlbGVjdG9yIGFsb25lIGlzIE5PVCBhIHN0YWJsZSBpZGVudGl0eSDigJQgYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gXG4gIC8vIGV4aXN0cyBvbiBldmVyeSBwYWdlOyBgYnV0dG9uYCBpcyBldmVyeXdoZXJlLiBTdHJvbmcgaWRlbnRpdHkgaXNcbiAgLy8gKHNlbGVjdG9yICsgdXJsKS4gUmV0dXJucyB0aGUgbW9zdCByZWNlbnQgbWF0Y2ggc28gcmUtaG92ZXJpbmcgYW5cbiAgLy8gYWxyZWFkeS1jYXB0dXJlZCBlbGVtZW50IHJlc29sdmVzIGNvbnNpc3RlbnRseS5cbiAgY29uc3QgZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZSA9IChzZWxlY3Rvcjogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBjb25zdCB1cmwgPSBsaXZlVGFiVXJsO1xuICAgIC8vIFdhbGsgYmFja3dhcmRzIHNvIHRoZSBtb3N0IHJlY2VudCBtYXRjaGluZyBjYXB0dXJlIHdpbnMgd2hlbiBhXG4gICAgLy8gc2VsZWN0b3IgbGVnaXRpbWF0ZWx5IGhhcyBtdWx0aXBsZSBjYXB0dXJlcyBvbiB0aGUgc2FtZSBwYWdlXG4gICAgLy8gKGUuZy4sIHRoZSB1c2VyIHJlLWNhcHR1cmVkIHRoZSBzYW1lIGVsZW1lbnQgYWZ0ZXIgZWRpdHMpLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSBjb250aW51ZTtcbiAgICAgIGlmICh1cmwgJiYgbS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBjYW5vbmljYWxFbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgdGFnOiBlLnRhZywgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHRleHQ6IGUudGV4dCwgcm9sZTogZS5yb2xlLFxuICAgIGF0dHJzOiBlLmF0dHJzLCBjbGFzc2VzOiBlLmNsYXNzZXMsXG4gICAgcmVjdDogZS5yZWN0LCBvdXRlckhUTUw6IGUub3V0ZXJIVE1MLFxuICAgIHN0eWxlczogZS5zdHlsZXMsIG1hdGNoZWRSdWxlczogZS5tYXRjaGVkUnVsZXMsXG4gIH0pO1xuXG4gIGNvbnN0IG9uQ2FwdHVyZSA9ICh7ZW50cnksIHBhZ2UsIGdyb3VwZWR9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdjYXB0dXJlJ30+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFlbnRyeSB8fCAhcGFnZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2UudXJsO1xuICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKHBhZ2UudXJsKTtcbiAgICBpZiAoZ3JvdXBlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgICAgZ3JvdXAucHVzaChlbnRyeSk7XG4gICAgICAgICAgbS5lbnRyeS5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7IGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgICAgLy8gRmlyZSBhIGdyb3VwIHNob3QgdXNpbmcgdGhlIGhlYWQgKyBtZW1iZXJzLiBUaGUgaGVhZCdzIHNlbGVjdG9yXG4gICAgICAgICAgLy8gaXMgbS5lbnRyeS5zZWxlY3RvcjsgbWVtYmVycycgc2VsZWN0b3JzIGFyZSBpbiB0aGUgZnJlc2hseVxuICAgICAgICAgIC8vIG11dGF0ZWQgZ3JvdXAgYXJyYXkuXG4gICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW20uZW50cnkuc2VsZWN0b3IsIC4uLihtLmVudHJ5Lmdyb3VwID8/IFtdKS5tYXAoKGcpID0+IGcuc2VsZWN0b3IpXTtcbiAgICAgICAgICB2b2lkIGZpcmVHcm91cFNob3QobSwgc2VsZWN0b3JzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRHVwZSBkZXRlY3Rpb24uIENyb3NzLWNvbnRhbWluYXRpb24gZml4OiBhIChzZWxlY3RvciwgdXJsKSBtYXRjaFxuICAgIC8vIGlzIE5FQ0VTU0FSWSBidXQgbm90IFNVRkZJQ0lFTlQg4oCUIHR3byBzaWJsaW5nIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgLy8gc2FtZSB0ZXN0SWQgLyBzYW1lIHJvbGUvYXJpYSBzZWxlY3RvciBsaXZlIG9uIHRoZSBzYW1lIFVSTCBidXRcbiAgICAvLyBhcmUgZGlmZmVyZW50IGNhcHR1cmVzLiBDb21wYXJlIHRoZSBjYW5vbmljYWwtZW50cnkgaGFzaCAod2hpY2hcbiAgICAvLyBpbmNsdWRlcyByZWN0LCB0ZXh0LCBvdXRlckhUTUwsIGV0Yy4pIGJlZm9yZSB0cmVhdGluZyB0aGUgbmV3XG4gICAgLy8gY2FwdHVyZSBhcyBhIHJlZnJlc2ggb2YgdGhlIG9sZCBvbmUuIFdoZW4gdGhlIGhhc2ggZGlmZmVycywgd2VcbiAgICAvLyBrZWVwIEJPVEggY2FwdHVyZXMgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcuXG4gICAgY29uc3QgZHVwZSA9IGZpbmREdXBsaWNhdGUoZW50cnkuc2VsZWN0b3IsIGVudHJ5LnVybCk7XG4gICAgaWYgKGR1cGUpIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IGNhbm9uaWNhbEVudHJ5KGR1cGUuZW50cnkpO1xuICAgICAgY29uc3QgYWZ0ZXIgPSBjYW5vbmljYWxFbnRyeShlbnRyeSk7XG4gICAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBIYXNoZXMgZGlmZmVyLiBUd28gY2FzZXM6XG4gICAgICAvLyAgIChhKSBTYW1lIGVsZW1lbnQgcmUtY2FwdHVyZWQgYWZ0ZXIgY29udGVudCBjaGFuZ2Ug4oCUIHRoZSByZWN0XG4gICAgICAvLyAgICAgICBzdGF5cyBwdXQgKHdpdGhpbiBhIGZldyBweCksIGJ1dCB0ZXh0L291dGVySFRNTCBtb3ZlZC5cbiAgICAgIC8vICAgICAgIFRyZWF0IGFzIGEgcmVmcmVzaC5cbiAgICAgIC8vICAgKGIpIERpZmZlcmVudCBlbGVtZW50IHRoYXQgaGFwcGVucyB0byBzaGFyZSBhIHNlbGVjdG9yIOKAlCB0aGVcbiAgICAgIC8vICAgICAgIHJlY3QgaXMgaW4gYSBkaWZmZXJlbnQgcG9zaXRpb24uIFRyZWF0IGFzIGEgbmV3IGNhcHR1cmUuXG4gICAgICAvLyBXZSBkaXNjcmltaW5hdGUgYnkgcmVjdCBvdmVybGFwOiBpZiBib3RoIHJlY3RzIGV4aXN0IGFuZCB0aGVpclxuICAgICAgLy8gY2VudGVycyBhcmUgd2l0aGluIDhweCBvbiBib3RoIGF4ZXMsIHJlZnJlc2g7IG90aGVyd2lzZSBrZWVwXG4gICAgICAvLyBib3RoLlxuICAgICAgY29uc3QgcjEgPSBkdXBlLmVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCByMiA9IGVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCBzYW1lRWxlbWVudCA9IHIxICYmIHIyXG4gICAgICAgICYmIE1hdGguYWJzKChyMS54ICsgcjEudyAvIDIpIC0gKHIyLnggKyByMi53IC8gMikpIDw9IDhcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnkgKyByMS5oIC8gMikgLSAocjIueSArIHIyLmggLyAyKSkgPD0gODtcbiAgICAgIGlmIChzYW1lRWxlbWVudCkge1xuICAgICAgICBkZWxldGUgZHVwZS5kdXBlUGVuZGluZztcbiAgICAgICAgZHVwZS5lbnRyeSA9IGVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFVwZGF0ZWQgIyR7ZHVwZS5lbnRyeS5ufWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlmZmVyZW50IGVsZW1lbnQgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciDihpIgZmFsbCB0aHJvdWdoIGFuZFxuICAgICAgLy8gZW1pdCBhcyBhIG5ldyBjYXB0dXJlLiBUaGUgYWdlbnQgcmVhZGluZyB0aGUgZXhwb3J0IHNlZXMgYm90aFxuICAgICAgLy8gcm93cyB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIGJ1dCBkaWZmZXJlbnQgdWlkcyArIHJlY3RzLlxuICAgIH1cbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCB0aGUgc2Vzc2lvbiBGSyBzbyB0aGUgY29uc3VtZXIgY2FuIGpvaW4gZW50cmllcyB0byB0aGVpclxuICAgIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLlxuICAgIGlmIChzZXNzaW9uSWQpIGVudHJ5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICBjb25zdCBuZXdNc2c6IFNlbGVjdG9yTWVzc2FnZSA9IHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzLCBlbnRyeX07XG4gICAgLy8gUGFnZSByb3dzIGV4aXN0IG9ubHkgYXMgaGVhZGVycyBmb3IgY2FwdHVyZWQgc2VsZWN0b3JzLiBEbyBub3QgY3JlYXRlXG4gICAgLy8gdGhlbSBmcm9tIHRhYiBhY3RpdmF0aW9uLCB2YWxpZGF0aW9uLCBvciBwcmVmZXJlbmNlIGNoYW5nZXM7IGluc2VydCBvbmVcbiAgICAvLyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGZpcnN0IHNlbGVjdG9yIG9mIGEgbmV3IHBhZ2UgYmxvY2suXG4gICAgbGV0IHByZXZpb3VzUGFnZTogUGFnZU1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gcG9zaXRpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJykgeyBwcmV2aW91c1BhZ2UgPSBtOyBicmVhazsgfVxuICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzUGFnZSB8fCBwcmV2aW91c1BhZ2UudXJsICE9PSBwYWdlLnVybCkge1xuICAgICAgY29uc3QgcGFnZU1zZzogUGFnZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHVybDogcGFnZS51cmwsIHRpdGxlOiBwYWdlLnRpdGxlLCB2aWV3cG9ydDogcGFnZS52aWV3cG9ydCwgdG9rZW5zOiBwYWdlLnRva2VucyxcbiAgICAgICAgdXNlckFnZW50OiBwYWdlLnVzZXJBZ2VudCwgbGFuZzogcGFnZS5sYW5nLFxuICAgICAgICBnaXRDb250ZXh0OiAocGFnZSBhcyBhbnkpLmdpdENvbnRleHQsXG4gICAgICAgIHJvdXRlOiAocGFnZSBhcyBhbnkpLnJvdXRlLFxuICAgICAgICBzdGF0ZTogKHBhZ2UgYXMgYW55KS5zdGF0ZSxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgfTtcbiAgICAgIC8vIEF0dGFjaCBhbnkgcGFnZS1zbmFwc2hvdCB0aGF0IGFycml2ZWQgYmVmb3JlIHRoaXMgcGFnZSBoZWFkZXIgZXhpc3RlZC5cbiAgICAgIGNvbnN0IHBlbmRpbmcgPSBwZW5kaW5nU25hcHNob3RzLmdldChwYWdlLnVybCk7XG4gICAgICBpZiAocGVuZGluZykge1xuICAgICAgICAocGFnZU1zZyBhcyBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCkuc25hcHNob3QgPSBwZW5kaW5nO1xuICAgICAgICBwZW5kaW5nU25hcHNob3RzLmRlbGV0ZShwYWdlLnVybCk7XG4gICAgICB9XG4gICAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIHBhZ2VNc2cpO1xuICAgICAgcG9zaXRpb24rKztcbiAgICB9XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBuZXdNc2cpO1xuICAgIHBlcnNpc3QoKTtcbiAgICAvLyBJbnRlbnRpb25hbGx5IE5PIHNldExhc3RBY3RpdmUoZW50cnkuc2VsZWN0b3IpIGhlcmUg4oCUIHRoZSB1c2VyIGFza2VkXG4gICAgLy8gZm9yIGZyZXNoIGNhcHR1cmVzIHRvIHN0YXkgdW4taGlnaGxpZ2h0ZWQgaW4gdGhlIHNpZGViYXIuIFRoZSBzdGlja3lcbiAgICAvLyByaW5nICsgbGFzdC1hY3RpdmUgb3V0bGluZSBub3cgb25seSBnZXQgYXBwbGllZCBvbiBleHBsaWNpdFxuICAgIC8vIGhvdmVyL2NsaWNrIG9mIHRoZSBzaWRlYmFyIGJ1YmJsZSAoYW5kIHRoZSBwYWdlLXNpZGUgZmxhc2ggZnJvbVxuICAgIC8vIGNhcHR1cmVFbnRyeSBzdGlsbCBjb25maXJtcyB0aGUgY2FwdHVyZSB2aXN1YWxseSBvbiB0aGUgcGFnZSkuXG4gICAgcmVuZGVyKCk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChuZXdNc2cpO1xuICAgIHZvaWQgZmlyZVBhZ2VTaG90SWZOZWVkZWQobmV3TXNnKTtcbiAgICB2b2lkIHJ1blZhbGlkYXRpb24oKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU2NyZWVuc2hvdCB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEZpcmUgdGhlIHBlci1lbGVtZW50IHNob3QsIGF0dGFjaCB0aGUgcmV0dXJuZWQgZmlsZW5hbWUgKyBkYXRhVXJsIG9udG9cbiAgLy8gdGhlIGVudHJ5LCBhbmQgcGVyc2lzdC4gc2hvdWxkU2tpcFNjcmVlbnNob3QgYmFpbHMgb24gaG9zdHMgaW4gdGhlXG4gIC8vIHVzZXIncyBza2lwIGxpc3Q7IGF1dG9TY3JlZW5zaG90PWZhbHNlIGJhaWxzIGdsb2JhbGx5LlxuICBjb25zdCBmaXJlRWxlbWVudFNob3QgPSBhc3luYyAobXNnOiBTZWxlY3Rvck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogYXV0b1NjcmVlbnNob3Q9ZmFsc2UnKTtcbiAgICAgIC8vIEJ1ZyAjMjogdGVsbCB0aGUgZXhwb3J0IHdoeSB0aGUgc2hvdCBpcyBtaXNzaW5nLlxuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7Li4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSwgdW5hdmFpbGFibGVSZWFzb246ICdhdXRvU2NyZWVuc2hvdE9mZid9O1xuICAgICAgLy8gUmUtcmVuZGVyIHNvIHRoZSByZXNlcnZlZCBza2VsZXRvbiAod2hpY2ggYXNzdW1lZCBhIHNob3Qgd2FzIGNvbWluZylcbiAgICAgIC8vIGNvbGxhcHNlcyBub3cgdGhhdCB3ZSBrbm93IG9uZSB3b24ndCBhcnJpdmUuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogaG9zdCBvbiBza2lwIGxpc3QnLCBtc2cuZW50cnkudXJsKTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnc2tpcFNjcmVlbnNob3RIb3N0cyd9O1xuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCDihpInLCBtc2cuZW50cnkuc2VsZWN0b3IpO1xuICAgIC8vIFNXIGNvbGQtc3RhcnQgcmFjZTogdGhlIEZJUlNUIGNhcHR1cmUgaW4gYSBzZXNzaW9uIG9mdGVuIGxvc2VzIGl0c1xuICAgIC8vIGZpcnN0IG1lc3NhZ2UgYmVjYXVzZSB0aGUgYmcgd29ya2VyIGlzIHN0aWxsIHN0YXJ0aW5nLiBSZXRyeSBvbmNlXG4gICAgLy8gYWZ0ZXIgYSBzaG9ydCBkZWxheSBpZiB0aGUgZmlyc3QgY2FsbCBjb21lcyBiYWNrIG51bGwvZW1wdHkuXG4gICAgbGV0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseSB8fCAoIXJlcGx5Lm9rICYmICFyZXBseS5lcnJvcikpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcnN0IHNjcmVlbnNob3QgcmVwbHkgd2FzIGVtcHR5OyByZXRyeWluZyBhZnRlciAyMDBtcyAoU1cgY29sZC1zdGFydCknKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIDIwMCkpO1xuICAgICAgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCByZXBseTonLCByZXBseSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSB7XG4gICAgICBzZXRTdGF0dXMoYFNjcmVlbnNob3QgZmFpbGVkOiAke3JlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJ31gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgdW5hdmFpbGFibGVSZWFzb246IHJlcGx5Py5lcnJvciA/PyAnY2FwdHVyZUZhaWxlZCcsXG4gICAgICB9O1xuICAgICAgLy8gQ29sbGFwc2UgdGhlIHJlc2VydmVkIHNrZWxldG9uIOKAlCBubyBzaG90IGlzIGNvbWluZyBmb3IgdGhpcyBjYXB0dXJlLlxuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFN1Y2Nlc3NmdWwgcmV0cnkg4oCUIHN0cmlwIGFueSBwcmlvciB1bmF2YWlsYWJsZVJlYXNvbiBzaW5jZSB3ZSBub3dcbiAgICAvLyBoYXZlIGEgcmVhbCBzaG90LlxuICAgIGRlbGV0ZSBtc2cuZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZWxlbWVudDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAuLi4ocmVwbHkuY3JvcCA/IHtjcm9wOiByZXBseS5jcm9wfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaXJlIHRoZSBncm91cCBzaG90ICh1bmlvbiBiYm94IG9mIGhlYWQgKyBhbGwgbWVtYmVycykgYW5kIHN0YXNoIHRoZVxuICAvLyBmaWxlbmFtZSBvbiB0aGUgaGVhZC1vZi1ncm91cCBlbnRyeS5cbiAgY29uc3QgZmlyZUdyb3VwU2hvdCA9IGFzeW5jIChoZWFkOiBTZWxlY3Rvck1lc3NhZ2UsIHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KGhlYWQuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1ncm91cCcsIHNlbGVjdG9ycywgbjogaGVhZC5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIGhlYWQuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihoZWFkLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZ3JvdXA6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkgeyBzaG90c0Z1bGwuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTsgcGVyc2lzdFNob3RzRnVsbCgpOyB9XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIFBhZ2UtbGV2ZWwgc2hvdCBvbmNlIHBlciAod29ya3NwYWNlLCBwYWdlLXVybCwgZGF5KS4gU3Vic2VxdWVudCBjYXB0dXJlc1xuICAvLyBvbiB0aGUgc2FtZSBwYWdlIHJldXNlIHRoZSBzYW1lIG9uLWRpc2sgZmlsZSBwYXRoLlxuICBjb25zdCBmaXJlUGFnZVNob3RJZk5lZWRlZCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICAvLyBQZXItY2FwdHVyZSBwYWdlLXNob3QgbW9kZSAowqc0LjUpOiB3aGVuIGVuYWJsZWQsIHNraXAgdGhlXG4gICAgLy8gcGVyLSh3b3Jrc3BhY2UsIHVybCkgZGVkdXBlIGFuZCBmaXJlIGEgZnJlc2ggcGFnZSBzaG90IGV2ZXJ5IHRpbWUuXG4gICAgLy8gVXNlZnVsIHdoZW4gdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzIChtb2RhbCBvcGVucyxcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3csIGV0Yy4pIGFuZCB0aGUgdXNlciB3YW50cyB0byBzZWUgdGhlIHdob2xlIHBhZ2UgYXRcbiAgICAvLyBlYWNoIHN0ZXAuIENvc3RzIG9uZSBmdWxsLXBhZ2UgUE5HIHBlciBjYXB0dXJlLCBzbyBkZWZhdWx0IG9mZi5cbiAgICBpZiAoIXByZWZzLnBhZ2VTaG90UGVyQ2FwdHVyZSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFnZVNob3RLZXkobXNnLmVudHJ5LnVybCk7XG4gICAgICBpZiAocGFnZVNob3RzRmlyZWQuaGFzKGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kRXhpc3RpbmdQYWdlU2hvdChtc2cuZW50cnkudXJsKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICAgICAgcGFnZTogZXhpc3RpbmcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGFnZVNob3RzRmlyZWQuYWRkKGtleSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1wYWdlJywgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgLy8gQXBwbHkgdG8gVEhJUyBlbnRyeSBhbmQgdG8gYW55IG90aGVyIGVudHJpZXMgYWxyZWFkeSBjYXB0dXJlZCBvbiB0aGVcbiAgICAvLyBzYW1lIFVSTCB0b2RheSAoc28gdGhlIHBhZ2Utc2hvdCBhcHBlYXJzIHVuaWZvcm1seSkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gbXNnLmVudHJ5LnVybCkgY29udGludWU7XG4gICAgICBtLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICBwYWdlOiByZXBseS5maWxlbmFtZSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFN0YXNoIHRoZSBmdWxsIFBORyBzbyB0aGUgd29ya3NwYWNlIGFyY2hpdmUgY2FuIGJ1bmRsZSBpdC4gS2V5ZWRcbiAgICAvLyBieSBVUkwgc2luY2UgcGFnZSBzaG90cyBhcmUgcGFnZS1zY29wZWQsIG5vdCBzZWxlY3Rvci1zY29wZWQuXG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KCdwYWdlOjonICsgbXNnLmVudHJ5LnVybCwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmluZCBhbnkgc2VsZWN0b3IgZW50cnkgb24gdGhpcyBVUkwgdGhhdCBhbHJlYWR5IGhhcyBhIGBwYWdlYCBzaG90XG4gIC8vIHJlY29yZGVkIOKAlCB1c2VkIHNvIHRoYXQgcmV0cm9hY3RpdmUgY2FwdHVyZXMgaW5oZXJpdCB0aGUgZXhpc3RpbmcgUE5HXG4gIC8vIHBhdGggaW5zdGVhZCBvZiByZWZpcmluZy5cbiAgY29uc3QgZmluZEV4aXN0aW5nUGFnZVNob3QgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgcmV0dXJuIG0uZW50cnkuc2NyZWVuc2hvdC5wYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBvbkhvdmVyID0gKHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTogdm9pZCA9PiB7XG4gICAgc2V0U3RhdHVzKGBBbHQtaG92ZXIgwrcgJHtsYWJlbH1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgLy8gSWRlbnRpdHkgaXMgKHNlbGVjdG9yLCB1cmwpLiBTYW1lIHNlbGVjdG9yIG9uIHR3byBkaWZmZXJlbnQgVVJMc1xuICAgIC8vIGlzIHR3byBkaWZmZXJlbnQgY2FwdHVyZXM7IHRoZSBwcmV2aW91cyBzZWxlY3Rvci1vbmx5IGxvb2t1cFxuICAgIC8vIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi4gUHJlZmVyIHNhbWUtVVJMICtcbiAgICAvLyBzYW1lLXNlbGVjdG9yIGFzIHRoZSBzdHJvbmdlc3QgbWF0Y2guXG4gICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSBzY3JvbGxNZXNzYWdlSW50b1ZpZXcoZXhpc3RpbmcuaWQpO1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihleGlzdGluZy5pZCk7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7dWlkOiBleGlzdGluZy5lbnRyeS51aWQsIG46IGV4aXN0aW5nLmVudHJ5Lm4sIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFja319KTtcbiAgICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXIoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBTFdBWVMgc2hvdyB0aGUgY29tbWVudCBib3gsIGV2ZW4gZm9yIHVuY2FwdHVyZWQgZWxlbWVudHMuIE9uIHN1Ym1pdFxuICAgICAgLy8gdGhlIGNvbnRlbnQgc2NyaXB0IHdpbGwgY2FwdHVyZSB0aGUgZWxlbWVudCBmaXJzdCwgdGhlbiBhdHRhY2ggdGhlXG4gICAgICAvLyBjb21tZW50IOKAlCB0dXJuaW5nIGhvdmVyLWNvbW1lbnQgaW50byBhIGNhcHR1cmUrY29tbWVudCBzaG9ydGN1dC5cbiAgICAgIHBoYW50b21UYXJnZXQgPSB7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3Q6IHJlY3QgYXMgdW5rbm93biBhcyBET01SZWN0fTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHtjYXB0dXJlZDogZmFsc2UsIGZlZWRiYWNrOiBbXX19KTtcbiAgICAgIHJlbmRlclBoYW50b20oKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudD8uc3RhcnRzV2l0aCgnQWx0LWhvdmVyJykpIHN0YXR1cy50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXJQaGFudG9tKCk7IH1cbiAgICAvLyBObyBhbm5vdGF0aW9uLWNsZWFyIGhlcmUg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBrZWVwcyB0aGUgYm94IG9wZW4gc28gdGhlXG4gICAgLy8gdXNlciBjYW4gbW91c2UgdG8gaXQgYW5kIHR5cGUuIE91dHNpZGUtY2xpY2sgLyBFc2MgZGlzbWlzcyBpdC5cbiAgfTtcblxuICBjb25zdCBjb2xsZWN0RmVlZGJhY2tBZnRlciA9IChzZWxlY3RvcklkOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKCFmb3VuZCkgeyBpZiAobS5pZCA9PT0gc2VsZWN0b3JJZCkgZm91bmQgPSB0cnVlOyBjb250aW51ZTsgfVxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyB8fCBtLnR5cGUgPT09ICdwYWdlJykgYnJlYWs7XG4gICAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSBvdXQucHVzaChtLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IGNlbnRlckVsZW1lbnRJbkxpc3QgPSAoZWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgbGlzdFJlY3QgPSBsaXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRhcmdldCA9IGxpc3Quc2Nyb2xsVG9wICsgZWxSZWN0LnRvcCAtIGxpc3RSZWN0LnRvcCAtIChsaXN0LmNsaWVudEhlaWdodCAvIDIpICsgKGVsUmVjdC5oZWlnaHQgLyAyKTtcbiAgICBsaXN0LnNjcm9sbFRvKHt0b3A6IE1hdGgubWF4KDAsIHRhcmdldCksIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICB9O1xuXG4gIGNvbnN0IHNjcm9sbE1lc3NhZ2VJbnRvVmlldyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGNlbnRlckVsZW1lbnRJbkxpc3QoZWwpO1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoLWludG8tdmlldycpO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gtaW50by12aWV3Jyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0aWNreSBoaWdobGlnaHQgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2V0TGFzdEFjdGl2ZSA9IChzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhcm1TdGlja3lFeHBpcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBzdGlja3lUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcGFuZWxIb3ZlcmVkKSB7XG4gICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yLmxhc3QtYWN0aXZlJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtYWN0aXZlJyk7XG4gICAgICB9IGVsc2UgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSwgU1RJQ0tZX1RUTF9NUyk7XG4gIH07XG5cbiAgLy8gRmFzdCBzdGlja3ktY2xlYXI6IHdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBwYW5lbCwgZmlyZVxuICAvLyBzdGlja3ktY2xlYXIgYWZ0ZXIgYSAzMDAgbXMgZ3JhY2Ugd2luZG93LiBQcmlvciBiZWhhdmlvciB3YWl0ZWQgdGhlXG4gIC8vIGZ1bGwgU1RJQ0tZX1RUTF9NUyAofjUgcykgd2hpY2ggZmVsdCBsaWtlIHRoZSBwYWdlLXNpZGUgaGlnaGxpZ2h0XG4gIC8vIFwiZG9lc24ndCBnbyBhd2F5IGV2ZW4gYWZ0ZXIgSSB1bmhvdmVyXCIuIDMwMCBtcyBpcyBzaG9ydCBlbm91Z2ggdG9cbiAgLy8gZmVlbCByZXNwb25zaXZlIGJ1dCBsb25nIGVub3VnaCB0aGF0IGEgcXVpY2sgcmVwb3NpdGlvbiAoZS5nLlxuICAvLyBhY2NpZGVudGFsbHkgY3Jvc3NpbmcgdGhlIHNlYW0pIGRvZXNuJ3Qga2lsbCB0aGUgcmluZyBtaWQtZmxpZ2h0LlxuICBsZXQgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSB0cnVlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSB7IGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTsgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7IH1cbiAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgfSk7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpO1xuICAgIHN0aWNreUNsZWFyR3JhY2UgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgLy8gQWxzbyBkcm9wIG91ciBvd24gZnJvbS1wYW5lbCArIG11bHRpIHJpbmdzIGluIGNhc2UgdGhleSBsZWFrZWQuXG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGVpciBtb3VzZSBpbnRvIHRoZSBwYW5lbCwgc3VwcHJlc3MgcGFnZS1zaWRlXG4gICAgLy8gYWx0LWhvdmVyIHN0YXRlIHNvIHRoZSBvcmFuZ2UgcmluZyBkb2Vzbid0IGtlZXAgZm9sbG93aW5nIHRoZSBjdXJzb3IuXG4gICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgUmVuZGVyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBORUFSX0JPVFRPTV9QWCA9IDgwO1xuICBjb25zdCB3YXNOZWFyQm90dG9tID0gKCk6IGJvb2xlYW4gPT5cbiAgICBsaXN0LnNjcm9sbEhlaWdodCAtIGxpc3Quc2Nyb2xsVG9wIC0gbGlzdC5jbGllbnRIZWlnaHQgPD0gTkVBUl9CT1RUT01fUFg7XG5cbiAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9IChtOiBQYW5lbE1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAvLyBNYXRjaCBhZ2FpbnN0IHRoZSBXSE9MRSBlbnRyeSAoc2VsZWN0b3IsIHRleHQsIGNsYXNzZXMsIGF0dHJzLFxuICAgICAgLy8gb3V0ZXJIVE1MLCBzdHlsZXMsIGV0Yy4pIHNvIHNlYXJjaCBoaXRzIGFueXRoaW5nIHZpc2libGUgaW4gdGhlXG4gICAgICAvLyBib2R5LWpzb24uIFN0cmluZ2lmeWluZyBvbmNlIGlzIGZpbmUg4oCUIHRoZSBjb3N0IGlzIHRpbnkgdnMgcmVuZGVyLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgfVxuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIChtLnVybCArICcgJyArIChtLnRpdGxlID8/ICcnKSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSBidWJibGUncyBib2R5LWpzb24gKG9yIG91dGVySFRNTCkgY29udGFpbnMgdGhlIHNlYXJjaCDigJRcbiAgLy8gdGVsbHMgcmVuZGVyU2VsZWN0b3IgdG8gYXV0by1leHBhbmQgc28gdGhlIHVzZXIgc2VlcyB0aGUgaGlnaGxpZ2h0ZWQgaGl0LlxuICBjb25zdCBib2R5TWF0Y2hlc1NlYXJjaCA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG0uZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0UmFpbCA9IChiZWZvcmVJZDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnaW5zZXJ0LXJhaWwnO1xuICAgIGRpdi5kYXRhc2V0LmJlZm9yZUlkID0gYmVmb3JlSWQ7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50ID09PSBiZWZvcmVJZCkge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICBkaXYuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTsgcmVuZGVyKCk7IH0sXG4gICAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4gc2VuZElubGluZSh0ZXh0KSxcbiAgICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidG4uY2xhc3NOYW1lID0gJ2FkZC1idG4nO1xuICAgICAgYnRuLmRhdGFzZXQudGlwID0gJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZSc7XG4gICAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZScpO1xuICAgICAgYnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygncGx1cycsIDEyKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBiZWZvcmVJZDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlOyByZW5kZXIoKTsgfSk7XG4gICAgICBkaXYuYXBwZW5kKGJ0bik7XG4gICAgfVxuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgdHlwZSBJbmxpbmVDb21tZW50T3B0cyA9IHtcbiAgICBpbml0aWFsPzogc3RyaW5nO1xuICAgIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDtcbiAgICBvblN1Ym1pdD86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgYXV0b2ZvY3VzPzogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgYnVpbGRJbmxpbmVDb21tZW50ID0gKHtpbml0aWFsID0gJycsIG9uQ2FuY2VsLCBvblN1Ym1pdCwgYXV0b2ZvY3VzfTogSW5saW5lQ29tbWVudE9wdHMpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXAuY2xhc3NOYW1lID0gJ2lubGluZS1jb21tZW50JztcbiAgICBjb25zdCB0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgdGEudmFsdWUgPSBpbml0aWFsO1xuICAgIHRhLnJvd3MgPSAyO1xuICAgIHRhLnBsYWNlaG9sZGVyID0gJ0luc2VydCBhIGNvbW1lbnQgaGVyZSwgb3IgQWx0K0NsaWNrIHRvIGluc2VydCBhIGNhcHR1cmUnO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncm93JztcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIG1ldGEudGV4dENvbnRlbnQgPSAnMHcgwrcgMHQnO1xuICAgIC8vIEJvdGggU2F2ZSAvIENhbmNlbCBhcmUgdW5pZm9ybSBpY29uIGJ1dHRvbnMgKC5pY29uYnRuKS4gU2F2ZSB1c2VzIHRoZVxuICAgIC8vIHByaW1hcnkgYWNjZW50IHZhcmlhbnQgdmlhIC5wcmltYXJ5IHNvIGl0IHN0aWxsIHBvcHMsIGJ1dCBpdHMgd2lkdGhcbiAgICAvLyBtYXRjaGVzIENhbmNlbCBleGFjdGx5LlxuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIMK3IEVzYyc7XG4gICAgY2FuY2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgaW5saW5lIGNvbW1lbnQnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMjApO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uQ2FuY2VsPy4oKSk7XG4gICAgY29uc3Qgc2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbmQudHlwZSA9ICdidXR0b24nO1xuICAgIHNlbmQuY2xhc3NOYW1lID0gJ2ljb25idG4gcHJpbWFyeSc7XG4gICAgc2VuZC5kYXRhc2V0LnRpcCA9ICdTYXZlIMK3IEVudGVyJztcbiAgICBzZW5kLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdTYXZlIGlubGluZSBjb21tZW50Jyk7XG4gICAgc2VuZC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMjApO1xuICAgIGNvbnN0IHN1Ym1pdCA9ICgpOiB2b2lkID0+IG9uU3VibWl0Py4odGEudmFsdWUpO1xuICAgIHNlbmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXQpO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4geyBtZXRhLnRleHRDb250ZW50ID0gYCR7d29yZENvdW50KHRhLnZhbHVlKX13IMK3ICR7dG9rZW5Db3VudCh0YS52YWx1ZSl9dGA7IH0pO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBvbkNhbmNlbD8uKCk7XG4gICAgfSk7XG4gICAgcm93LmFwcGVuZChtZXRhLCBjYW5jZWwsIHNlbmQpO1xuICAgIHdyYXAuYXBwZW5kKHRhLCByb3cpO1xuICAgIGlmIChhdXRvZm9jdXMpIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0YS5mb2N1cygpKTtcbiAgICByZXR1cm4gd3JhcDtcbiAgfTtcblxuICBjb25zdCBzZW5kSW5saW5lID0gKHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRleHQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgIGlmICghdGV4dCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IGJlZm9yZUlkID0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQ7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGV0IHBvcyA9IGJlZm9yZUlkID8gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBiZWZvcmVJZCkgOiBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKHBvcyA8IDApIHBvcyA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAvLyBwYXJlbnRVaWQgcmVzb2x1dGlvbjogd2FsayBiYWNrIGZyb20gdGhlIGluc2VydCBwb3NpdGlvbiB0byB0aGVcbiAgICAvLyBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3Rvci4gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgdGhlIEZLLlxuICAgIGxldCBwSWR4ID0gcG9zIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfTtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zLCAwLCBmYik7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnSW5zZXJ0ZWQnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQaGFudG9tID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBoYW50b20nKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwaGFudG9tVGFyZ2V0KSByZXR1cm47XG4gICAgY29uc3QgcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwaC5jbGFzc05hbWUgPSAncGhhbnRvbSB2aXNpYmxlJztcbiAgICBwaC5pbm5lckhUTUwgPSBgPGNvZGU+JHtlc2NhcGVIdG1sKHBoYW50b21UYXJnZXQubGFiZWwpfTwvY29kZT5gO1xuICAgIGxpc3QuYXBwZW5kKHBoKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICAvLyBSZW9yZGVyIGEgZmxhdCBtZXNzYWdlIGxpc3Qgc28gc2VsZWN0b3JzIHdpdGhpbiBlYWNoIHBhZ2UtZGVsaW1pdGVkXG4gIC8vIGJsb2NrIGFyZSBzb3J0ZWQgYnkgdGhlaXIgdmlzdWFsIHJlY3QgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KS5cbiAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciAoY2FwdHVyZVxuICAvLyBhZGphY2VuY3kpIHNvIGVkaXRpbmcvdGhyZWFkaW5nIGJlaGF2aW9yIHN1cnZpdmVzIHRoZSBzb3J0LlxuICAvL1xuICAvLyBVc2VkIE9OTFkgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSAoYGJ1aWxkU2xpbWApLCBub3QgdGhlIHNpZGViYXJcbiAgLy8gcmVuZGVyLiBUaGUgc2lkZWJhciBrZWVwcyBtZXNzYWdlcyBpbiBpbnNlcnRpb24vY2FwdHVyZSBvcmRlciBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZW0gd2hlcmUgdGhleSBleHBlY3Q7IHRoZSBleHBvcnQgZ2V0cyB0aGUgYWdlbnQtXG4gIC8vIGZyaWVuZGx5IHJlYWRpbmctb3JkZXIgdHJlYXRtZW50LlxuICBjb25zdCByZW9yZGVyRm9yRXhwb3J0ID0gKG1zZ3M6IFBhbmVsTWVzc2FnZVtdKTogUGFuZWxNZXNzYWdlW10gPT4ge1xuICAgIHR5cGUgR3JvdXAgPSB7a2luZDogJ2dyb3VwJzsgc2VsOiBTZWxlY3Rvck1lc3NhZ2U7IHRyYWlsaW5nOiBGZWVkYmFja01lc3NhZ2VbXX07XG4gICAgdHlwZSBMb29zZSA9IHtraW5kOiAnbG9vc2UnOyBtOiBGZWVkYmFja01lc3NhZ2V9O1xuICAgIHR5cGUgU2xvdCA9IEdyb3VwIHwgTG9vc2UgfCB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX07XG4gICAgY29uc3Qgc2xvdHM6IFNsb3RbXSA9IFtdO1xuICAgIGxldCBjdXJHcm91cDogR3JvdXAgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBmbHVzaEdyb3VwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKGN1ckdyb3VwKSB7IHNsb3RzLnB1c2goY3VyR3JvdXApOyBjdXJHcm91cCA9IG51bGw7IH1cbiAgICB9O1xuICAgIGZvciAoY29uc3QgbSBvZiBtc2dzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBzbG90cy5wdXNoKHtraW5kOiAncGFnZScsIG19KTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgY3VyR3JvdXAgPSB7a2luZDogJ2dyb3VwJywgc2VsOiBtLCB0cmFpbGluZzogW119O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGN1ckdyb3VwKSBjdXJHcm91cC50cmFpbGluZy5wdXNoKG0pO1xuICAgICAgICBlbHNlIHNsb3RzLnB1c2goe2tpbmQ6ICdsb29zZScsIG19KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hHcm91cCgpO1xuICAgIGNvbnN0IG91dDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBsZXQgcnVuU3RhcnQgPSAwO1xuICAgIGNvbnN0IGZsdXNoUnVuID0gKGVuZDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXBSZWN0czogQXJyYXk8e2lkeDogbnVtYmVyOyB5OiBudW1iZXI7IHg6IG51bWJlcn0+ID0gW107XG4gICAgICBmb3IgKGxldCBpID0gcnVuU3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgciA9IHMuc2VsLmVudHJ5LnJlY3Q7XG4gICAgICAgICAgZ3JvdXBSZWN0cy5wdXNoKHtpZHg6IGksIHk6IHI/LnkgPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCB4OiByPy54ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWX0pO1xuICAgICAgICB9XG4gICAgICAgIGluZGljZXMucHVzaChpKTtcbiAgICAgIH1cbiAgICAgIGdyb3VwUmVjdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS55ICE9PSBiLnkpIHJldHVybiBhLnkgLSBiLnk7XG4gICAgICAgIHJldHVybiBhLnggLSBiLng7XG4gICAgICB9KTtcbiAgICAgIGxldCBnaSA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRJZHggPSBncm91cFJlY3RzW2dpKytdIS5pZHg7XG4gICAgICAgICAgY29uc3QgciA9IHNsb3RzW3JlcGxhY2VtZW50SWR4XSEgYXMgR3JvdXA7XG4gICAgICAgICAgb3V0LnB1c2goci5zZWwpO1xuICAgICAgICAgIGZvciAoY29uc3QgZiBvZiByLnRyYWlsaW5nKSBvdXQucHVzaChmKTtcbiAgICAgICAgfSBlbHNlIGlmIChzLmtpbmQgPT09ICdsb29zZScpIHtcbiAgICAgICAgICBvdXQucHVzaChzLm0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2xvdHNbaV0hLmtpbmQgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaFJ1bihpKTtcbiAgICAgICAgb3V0LnB1c2goKHNsb3RzW2ldIGFzIHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfSkubSk7XG4gICAgICAgIHJ1blN0YXJ0ID0gaSArIDE7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoUnVuKHNsb3RzLmxlbmd0aCk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBjb25zdCByZW5kZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc3RpY2tUb0JvdHRvbSA9IGxpc3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwIHx8IHdhc05lYXJCb3R0b20oKTtcbiAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgLy8gU3RhdHMgbnVtYmVyc1xuICAgIGxldCB0b3RhbFNlbGVjdG9ycyA9IDA7XG4gICAgbGV0IHRvdGFsQ29tbWVudHMgPSAwO1xuICAgIGxldCB0b3RhbFN0YWxlID0gMDtcbiAgICBjb25zdCBkaXN0aW5jdFBhZ2VzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIHRvdGFsU2VsZWN0b3JzKys7XG4gICAgICAgIGlmIChzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKSA9PT0gZmFsc2UpIHRvdGFsU3RhbGUrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB0b3RhbENvbW1lbnRzKys7XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBpZiAobWVzc2FnZXMuc29tZSgoeCkgPT4geC50eXBlID09PSAnc2VsZWN0b3InICYmIHguZW50cnkudXJsID09PSBtLnVybCkpIGRpc3RpbmN0UGFnZXMuYWRkKG0udXJsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInNlbGVjdG9yc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTZWxlY3RvcnMpO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJjb21tZW50c1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxDb21tZW50cyk7XG4gICAgY29uc3Qgc3RhbGVOdW0gPSBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic3RhbGVcIl0gLnN0YXQtbnVtJykhO1xuICAgIHN0YWxlTnVtLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU3RhbGUpO1xuICAgIHN0YWxlTnVtLmRhdGFzZXQuemVybyA9IHRvdGFsU3RhbGUgPT09IDAgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJwYWdlc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcoZGlzdGluY3RQYWdlcy5zaXplKTtcbiAgICBjb25zdCBleHBvcnRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIHN0YXRUb2tlbnMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHRva2VuQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuICAgIHN0YXRXb3Jkcy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcod29yZENvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcblxuICAgIC8vIE1pbmlmeSByZWR1Y3Rpb24gc3RhdHNcbiAgICBsZXQgZnVsbFQgPSAwLCBjdXJUID0gMCwgZnVsbFcgPSAwLCBjdXJXID0gMCwgcGN0ID0gMDtcbiAgICBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgY29uc3Qgd2FzTWluID0gcHJlZnMubWluaWZ5O1xuICAgICAgcHJlZnMubWluaWZ5ID0gdHJ1ZTsgY29uc3QgbWluVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IGZhbHNlOyBjb25zdCBmdWxsVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHdhc01pbjtcbiAgICAgIGZ1bGxUID0gdG9rZW5Db3VudChmdWxsVGV4dCk7IGN1clQgPSB0b2tlbkNvdW50KG1pblRleHQpO1xuICAgICAgZnVsbFcgPSB3b3JkQ291bnQoZnVsbFRleHQpOyBjdXJXID0gd29yZENvdW50KG1pblRleHQpO1xuICAgICAgcGN0ID0gZnVsbFQgPiAwID8gTWF0aC5yb3VuZCgoMSAtIGN1clQgLyBmdWxsVCkgKiAxMDApIDogMDtcbiAgICB9XG4gICAgY29uc3QgbWluaWZ5U3RhdHNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1taW5pZnktc3RhdHNdJyk7XG4gICAgaWYgKG1pbmlmeVN0YXRzRWwpIHtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYCR7ZnVsbFQudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVC50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtmdWxsVy50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJXLnRvTG9jYWxlU3RyaW5nKCl9IHdvcmRzIMK3ICR7cGN0fSUgcmVkdWN0aW9uYDtcbiAgICAgIH0gZWxzZSBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYFdvdWxkIHNhdmUgJHsoZnVsbFQgLSBjdXJUKS50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtwY3R9JSBpZiBlbmFibGVkYDtcbiAgICAgIH0gZWxzZSBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxuXG4gICAgLy8gUGVyLWNoZWNrYm94IGNvbnRyaWJ1dGlvbiBzdGF0czogaG93IG1hbnkgdG9rZW5zL3dvcmRzIGVhY2ggdG9nZ2xlXG4gICAgLy8gYWRkcyB0byB0aGUgY3VycmVudCBleHBvcnQuIENvbXB1dGVkIGJ5IHRvZ2dsaW5nIHRoYXQgc2luZ2xlIHByZWZcbiAgICAvLyBhbmQgZGlmZmluZyB0aGUgZXhwb3J0IOKAlCBnaXZlcyBhbiBob25lc3QgYW5zd2VyIHRoYXQgcmVmbGVjdHMgdGhlXG4gICAgLy8gY3VycmVudCBtaW5pZnkgc3RhdGUgYW5kIHRoZSByZXN0IG9mIHRoZSB0b2dnbGVzLlxuICAgIGNvbnN0IGNvbnRyaWJLZXlzOiBBcnJheTxrZXlvZiBQcmVmcz4gPSBbJ2luY2x1ZGVPdXRlckhUTUwnLCAnaW5jbHVkZU1hdGNoZWRSdWxlcycsICdpbmNsdWRlU3R5bGVzJ107XG4gICAgaWYgKGV4cG9ydFRleHQgJiYgbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBiYXNlVCA9IHRva2VuQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBjb25zdCBiYXNlVyA9IHdvcmRDb3VudChleHBvcnRUZXh0KTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKCFlbCkgY29udGludWU7XG4gICAgICAgIGNvbnN0IHdhc09uID0gcHJlZnNba2V5XSBhcyBib29sZWFuO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gIXdhc09uO1xuICAgICAgICBjb25zdCBhbHRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFQgPSB0b2tlbkNvdW50KGFsdFRleHQpO1xuICAgICAgICBjb25zdCBhbHRXID0gd29yZENvdW50KGFsdFRleHQpO1xuICAgICAgICAvLyB3YXNPbj10cnVlIOKGkiBjdXJyZW50bHkgaW5jbHVkZWQ7IGNvc3QgPSBiYXNlIC0gYWx0ICh0dXJuaW5nIE9GRiBzYXZlcyB0aGlzKS5cbiAgICAgICAgLy8gd2FzT249ZmFsc2Ug4oaSIGN1cnJlbnRseSBleGNsdWRlZDsgZ2FpbiA9IGFsdCAtIGJhc2UgKHR1cm5pbmcgT04gYWRkcyB0aGlzKS5cbiAgICAgICAgY29uc3QgZFQgPSB3YXNPbiA/IGJhc2VUIC0gYWx0VCA6IGFsdFQgLSBiYXNlVDtcbiAgICAgICAgY29uc3QgZFcgPSB3YXNPbiA/IGJhc2VXIC0gYWx0VyA6IGFsdFcgLSBiYXNlVztcbiAgICAgICAgY29uc3Qgc2lnbiA9IHdhc09uID8gJycgOiAnKyc7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gd2FzT25cbiAgICAgICAgICA/IGDCtyAke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGluIGV4cG9ydCR7cHJlZnMubWluaWZ5ID8gJyAobWluaWZpZWQpJyA6ICcnfWBcbiAgICAgICAgICA6IGDCtyAke3NpZ259JHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7c2lnbn0ke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaWYgZW5hYmxlZGA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsKSBlbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRvb2xiYXIgZXhwb3J0IHN0YXRzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy5zdGF0LmV4cG9ydC1zdGF0cycpLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICAgIGNvbnN0IG51bSA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LW51bScpO1xuICAgICAgY29uc3QgbGFiID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbGFiZWwnKTtcbiAgICAgIGlmIChudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCEucmVwbGFjZSgvXFwqJC8sICcnKTtcbiAgICAgIGlmIChsYWIpIGxhYi50ZXh0Q29udGVudCA9IGxhYi50ZXh0Q29udGVudCEucmVwbGFjZSgvXlxcKi8sICcnKTtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgbnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQgKyAnKic7XG4gICAgICBjb25zdCBpc1Rva2VuID0gaSA9PT0gMDtcbiAgICAgIGNvbnN0IGZ1bGxWID0gaXNUb2tlbiA/IGZ1bGxUIDogZnVsbFc7XG4gICAgICBjb25zdCBjdXJWID0gaXNUb2tlbiA/IGN1clQgOiBjdXJXO1xuICAgICAgY29uc3Qgd2hpY2ggPSBpc1Rva2VuID8gJ3Rva2VucycgOiAnd29yZHMnO1xuICAgICAgcy5kYXRhc2V0LnRpcCA9IHByZWZzLm1pbmlmeVxuICAgICAgICA/IGBNSU5JRklFRCDCtyAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH1cXG5GdWxsIHdvdWxkIGJlICR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWBcbiAgICAgICAgOiBgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofSDCtyBmdWxsIGV4cG9ydFxcbk1pbmlmaWVkIHdvdWxkIGJlICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYDtcbiAgICB9KTtcblxuICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJlbXB0eS1pY29uXCI+8J+kjzwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktdGl0bGVcIj5TdGFydCB3aXRoIHRoZSBwYWdlIHlvdSB3YW50IHRvIGNyaXRpcXVlLjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktYm9keVwiPk9wZW4gYSBwYWdlLCB0aGVuIGNhcHR1cmUgYW4gZWxlbWVudC4gQ29tbWVudHMgc3RheSBwYWlyZWQgd2l0aCB0aGUgdGhpbmcgeW91IGdyYWJiZWQuPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1rZXlzXCI+QWx0K0NsaWNrIHRvIGNhcHR1cmU8L2Rpdj5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RvclVybHMgPSBuZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnVybCkpO1xuICAgIGNvbnN0IHZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlICE9PSAncGFnZScgfHwgc2VsZWN0b3JVcmxzLmhhcyhtLnVybCkpO1xuICAgIGNvbnN0IHBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgQm9vbGVhbihtLnBpbm5lZCkpO1xuICAgIGNvbnN0IHVucGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSkgPT4gIXBpbm5lZC5pbmNsdWRlcyhtIGFzIFNlbGVjdG9yTWVzc2FnZSkpO1xuICAgIC8vIFNpZGViYXIgc2hvd3MgY2FwdHVyZXMgaW4gSU5TRVJUSU9OIG9yZGVyIChtb3N0IHJlY2VudCBhdCB0aGVcbiAgICAvLyBib3R0b20pLiBWaXN1YWwtcG9zaXRpb24gcmVvcmRlcmluZyBoYXBwZW5zIE9OTFkgYXQgZXhwb3J0IHRpbWVcbiAgICAvLyBzbyB0aGUgc2lkZWJhciBzdGF5cyBwcmVkaWN0YWJsZSB3aGlsZSB0aGUgYWdlbnQtZmFjaW5nIGV4cG9ydFxuICAgIC8vIGdldHMgcmVhZGluZy1vcmRlciBjb252ZW5pZW5jZS4gKFByaW9yIGltcGxlbWVudGF0aW9uIHNvcnRlZCBpblxuICAgIC8vIGJvdGggcGxhY2VzOyB1c2VyIGZlZWRiYWNrIHdhcyB0aGF0IHNpZGViYXIgc2h1ZmZsaW5nIHdhc1xuICAgIC8vIGRpc29yaWVudGluZy4pXG4gICAgY29uc3Qgb3JkZXJlZCA9IFsuLi5waW5uZWQsIC4uLnVucGlubmVkXTtcblxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwobWVzc2FnZXNbMF0hLmlkKSk7XG4gICAgbGV0IGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gVHJhY2sgdGhlIFVSTCBvZiB0aGUgbW9zdCByZWNlbnRseSByZW5kZXJlZCBwYWdlIGRpdmlkZXIgc28gd2UgY2FuXG4gICAgLy8gc3VwcHJlc3MgYSByZXBlYXRlZCBoZWFkZXIgd2hlbiBjb25zZWN1dGl2ZSBjYXB0dXJlcyBzaGFyZSB0aGUgc2FtZVxuICAgIC8vIHBhZ2UuIFJlc3RhdGluZyB0aGUgVVJMIGFib3ZlIGV2ZXJ5IGNhcHR1cmUgaW4gYSBzYW1lLVVSTCBydW4gaXNcbiAgICAvLyBub2lzZSDigJQgdGhlIGRpdmlkZXIgb25seSBlYXJucyBpdHMgc3BhY2Ugd2hlbiB0aGUgVVJMIGFjdHVhbGx5XG4gICAgLy8gY2hhbmdlcyBmcm9tIHRoZSBwcmV2aW91cyBjYXB0dXJlIGluIHNlcXVlbmNlLlxuICAgIGxldCBsYXN0UmVuZGVyZWRQYWdlVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmVuZGVyZWRBbnkgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZGVyZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSBvcmRlcmVkW2ldITtcbiAgICAgIGlmICghbWF0Y2hlc1NlYXJjaChtKSkgY29udGludWU7XG4gICAgICAvLyBDb2xsYXBzZSBjb25zZWN1dGl2ZSBzYW1lLVVSTCBwYWdlIGRpdmlkZXJzIGludG8gdGhlIGZpcnN0IG9uZS5cbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBpZiAobS51cmwgPT09IGxhc3RSZW5kZXJlZFBhZ2VVcmwpIGNvbnRpbnVlO1xuICAgICAgICBsYXN0UmVuZGVyZWRQYWdlVXJsID0gbS51cmw7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gcmVuZGVyTWVzc2FnZShtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgICAgbGlzdC5hcHBlbmQobm9kZSk7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBsYXN0U2VsZWN0b3JTZWwgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgaWYgKGkgPCBvcmRlcmVkLmxlbmd0aCAtIDEpIGxpc3QuYXBwZW5kKGluc2VydFJhaWwob3JkZXJlZFtpICsgMV0hLmlkKSk7XG4gICAgICByZW5kZXJlZEFueSA9IHRydWU7XG4gICAgfVxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwoJ19fZW5kX18nKSk7XG4gICAgaWYgKCFyZW5kZXJlZEFueSAmJiBzZWFyY2hRdWVyeSkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS50ZXh0Q29udGVudCA9IGBObyBtYXRjaGVzIGZvciBcIiR7c2VhcmNoUXVlcnl9XCIuYDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSByZW5kZXJQaGFudG9tKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgaWYgKHN0aWNrVG9Cb3R0b20pIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBlbmRpbmdCYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGVuZGluZy1iYXknKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwZW5kaW5nTXVsdGkubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgYmF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYmF5LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWJheSc7XG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGVhZCc7XG4gICAgaGVhZC50ZXh0Q29udGVudCA9IGBQZW5kaW5nIGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH0gZWxlbWVudCR7cGVuZGluZ011bHRpLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWA7XG4gICAgYmF5LmFwcGVuZChoZWFkKTtcbiAgICBwZW5kaW5nTXVsdGkuZm9yRWFjaCgoZSwgaSkgPT4ge1xuICAgICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2FyZC5jbGFzc05hbWUgPSAncGVuZGluZy1jYXJkJztcbiAgICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICAgIHNlcS50ZXh0Q29udGVudCA9IGAjJHtpICsgMX1gO1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IChlLnRleHQgJiYgZS50ZXh0Lmxlbmd0aCA8PSA2MCA/IGUudGV4dCA6IChlLmNvbXBvbmVudFJvb3QgPz8gZS5zZWxlY3RvciA/PyBlLnRhZykpO1xuICAgICAgY2FyZC5hcHBlbmQoc2VxLCBsYWJlbCk7XG4gICAgICBiYXkuYXBwZW5kKGNhcmQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncGVuZGluZy1yb3cnO1xuICAgIGNvbnN0IGNvbW1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbW1pdC50eXBlID0gJ2J1dHRvbic7XG4gICAgY29tbWl0LmNsYXNzTmFtZSA9ICdwcmltYXJ5IHBlbmRpbmctY29tbWl0JztcbiAgICBjb21taXQudGV4dENvbnRlbnQgPSBgQ29tbWl0IGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH1gO1xuICAgIGNvbW1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jb21taXQnfSkpO1xuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuIHBlbmRpbmctY2FuY2VsJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnO1xuICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSkpO1xuICAgIHJvdy5hcHBlbmQoY29tbWl0LCBjYW5jZWwpO1xuICAgIGJheS5hcHBlbmQocm93KTtcbiAgICBjb25zdCBoaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGludC5jbGFzc05hbWUgPSAncGVuZGluZy1oaW50JztcbiAgICBoaW50LnRleHRDb250ZW50ID0gJ0FsdCtTaGlmdCtDbGljayBtb3JlIMK3IENvbW1pdCB0byBmaW5hbGl6ZSDCtyBFc2MgdG8gY2FuY2VsJztcbiAgICBiYXkuYXBwZW5kKGhpbnQpO1xuICAgIGxpc3QuYXBwZW5kKGJheSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGNsZWFyTm9vZGxlcyA9ICgpOiB2b2lkID0+IHsgZm9yIChjb25zdCBuIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLnRyZWUtbm9vZGxlJykpIG4ucmVtb3ZlKCk7IH07XG5cbiAgLy8gQ3Jvc3Mtc2VhbSBwYW5lbOKGlGNhbnZhcyBub29kbGVzIHdlcmUgcmVtb3ZlZDogYWxpZ25pbmcgdHdvIFNWRyBoYWx2ZXNcbiAgLy8gYWNyb3NzIHRoZSBwYW5lbC9wYWdlIGJvdW5kYXJ5IGRlcGVuZGVkIG9uIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaFxuICAvLyBicmVha3MgdW5kZXIgRGV2VG9vbHMgZG9jayBhbmQgem9vbSwgYW5kIHRoZSB2aXN1YWwgYmVuZWZpdCBkaWRuJ3RcbiAgLy8ganVzdGlmeSB0aGUgbWFpbnRlbmFuY2UgY29zdC4gVGhlIGluLXBhbmVsIGZlZWRiYWNrLXRyZWUgbm9vZGxlc1xuICAvLyAoZHJhd05vb2RsZSAvIHJlZHJhd05vb2RsZXMgYmVsb3cpIGFyZSB1bmFmZmVjdGVkLlxuICBjb25zdCBjbGVhckJ1YmJsZU5vb2RsZSA9ICgpOiB2b2lkID0+IHsgLyogbm8tb3AgKi8gfTtcbiAgY29uc3QgcmVkcmF3Tm9vZGxlcyA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhck5vb2RsZXMoKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIFsuLi5saXN0LmNoaWxkcmVuXSBhcyBIVE1MRWxlbWVudFtdKSB7XG4gICAgICBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RvcicpKSBsYXN0U2VsZWN0b3JFbCA9IG5vZGU7XG4gICAgICBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlZWRiYWNrJykgJiYgbGFzdFNlbGVjdG9yRWwpIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIG5vZGUpO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1yYWlsJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2V4cGFuZGVkJykgJiYgbGFzdFNlbGVjdG9yRWwpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gbm9kZS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmlubGluZS1jb21tZW50JykgPz8gbm9kZTtcbiAgICAgICAgZHJhd05vb2RsZShsYXN0U2VsZWN0b3JFbCwgdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZGl2aWRlcicpIHx8IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncm91cC1oZWFkJykpIHtcbiAgICAgICAgbGFzdFNlbGVjdG9yRWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgZHJhd05vb2RsZSA9IChzZWxlY3RvckVsOiBIVE1MRWxlbWVudCwgZmVlZGJhY2tFbDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzUiA9IHNlbGVjdG9yRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZlIgPSBmZWVkYmFja0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxSID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4MSA9IHNSLmxlZnQgLSBsUi5sZWZ0ICsgMTI7XG4gICAgY29uc3QgeTEgPSBzUi5ib3R0b20gLSBsUi50b3AgKyBsaXN0LnNjcm9sbFRvcDtcbiAgICBjb25zdCB4MiA9IGZSLmxlZnQgLSBsUi5sZWZ0O1xuICAgIGNvbnN0IHkyID0gZlIudG9wIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3AgKyAxNDtcbiAgICBjb25zdCB3ID0gTWF0aC5tYXgoMjAsIHgyIC0geDEgKyA0KTtcbiAgICBjb25zdCBoID0gTWF0aC5tYXgoMjAsIHkyIC0geTEpO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndHJlZS1ub29kbGUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyh3KSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKGgpKTtcbiAgICBzdmcuc3R5bGUubGVmdCA9IGAke3gxIC0gMn1weGA7XG4gICAgc3ZnLnN0eWxlLnRvcCA9IGAke3kxfXB4YDtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgY29uc3Qgc3ggPSAyLCBzeSA9IDAsIGV4ID0gdyAtIDIsIGV5ID0gaDtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIGBNICR7c3h9ICR7c3l9IEMgJHtzeH0gJHtzeSArIGggKiAwLjU1fSwgJHtleCAtIHcgKiAwLjR9ICR7ZXl9LCAke2V4fSAke2V5fWApO1xuICAgIHN2Zy5hcHBlbmQocGF0aCk7XG4gICAgbGlzdC5hcHBlbmQoc3ZnKTtcbiAgfTtcbiAgbGV0IHNjcm9sbFJhZiA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgIGlmIChzY3JvbGxSYWYpIHJldHVybjtcbiAgICBzY3JvbGxSYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBzY3JvbGxSYWYgPSAwOyByZWRyYXdOb29kbGVzKCk7IH0pO1xuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlZHJhd05vb2RsZXMpO1xuXG4gIC8vIOKUgOKUgOKUgCBQZXItbWVzc2FnZSByZW5kZXJlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJlbmRlck1lc3NhZ2UgPSAobTogUGFuZWxNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gcmVuZGVyUGFnZShtKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4gcmVuZGVyU2VsZWN0b3IobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIHJlbmRlckZlZWRiYWNrKG0sIGxhc3RTZWxlY3RvclNlbCk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBhZ2UgPSAobTogUGFnZU1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGQuY2xhc3NOYW1lID0gJ3BhZ2UtZGl2aWRlcic7XG4gICAgZC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBjb25zdCB0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0cy5jbGFzc05hbWUgPSAndGFiLXN0YXR1cyc7XG4gICAgdHMuZGF0YXNldC51cmwgPSBtLnVybDtcbiAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHRzLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICBkLmFwcGVuZCh0cyk7XG4gICAgY29uc3QgdSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB1LmNsYXNzTmFtZSA9ICd1cmwnO1xuICAgIHUudGV4dENvbnRlbnQgPSBtLnVybDtcbiAgICB1LmRhdGFzZXQudGlwID0gYCR7bS50aXRsZSA/PyAnJ30gwrcgJHttLnVybH1gO1xuICAgIGQuYXBwZW5kKHUpO1xuICAgIGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IG9uIHRoaXMgcGFnZSBpbiB0aGUgYWN0aXZlIHRhYiwgY2xpY2tpbmcgdGhlIFVSTFxuICAgICAgLy8gc2hvdWxkbid0IHJlbG9hZCBvciBzdGVhbCBmb2N1cyDigJQgaXQgc2hvdWxkIGp1c3QgYmUgYSBuby1vcFxuICAgICAgLy8gdmlzdWFsbHkgKHRoZSByb3cgYWxyZWFkeSBpbmRpY2F0ZXMgXCJvcGVuXCIgdmlhIC50YWItc3RhdHVzKS4gVGhlXG4gICAgICAvLyB1c2VyIGNvbXBsYWluZWQgYWJvdXQgZ2V0dGluZyBmb3JjZWQgaW50byBhIG5hdmlnYXRpb24gd2hlbiB0aGV5XG4gICAgICAvLyB3ZXJlIGp1c3QgdHJ5aW5nIHRvIHJlYWQgdGhlIHJvdy5cbiAgICAgIGlmIChtLnVybCA9PT0gbGl2ZVRhYlVybCkge1xuICAgICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgb24gdGhpcyBwYWdlJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByID0gYXdhaXQgc2VuZFRvQmc8e2ZvdW5kPzogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAnc3dpdGNoLXRvLXRhYicsIHVybDogbS51cmwsIG9wZW5JZk1pc3Npbmc6IHRydWV9KTtcbiAgICAgIGlmIChyPy5mb3VuZCkgc2V0U3RhdHVzKCdTd2l0Y2hlZCB0byB0YWInKTtcbiAgICAgIGVsc2UgaWYgKHI/Lm9wZW5lZCkgc2V0U3RhdHVzKCdPcGVuZWQgaW4gbmV3IHRhYicpO1xuICAgICAgZWxzZSBzZXRTdGF0dXMoXCJDb3VsZG4ndCBvcGVuIHRhYlwiLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGQ7XG4gIH07XG5cbiAgY29uc3QgdGl0bGVGcm9tRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChlLnRlc3RJZCkgcmV0dXJuIGBbdGVzdElkPSR7ZS50ZXN0SWR9XWA7XG4gICAgaWYgKGUuaWQpIHJldHVybiBgIyR7ZS5pZH1gO1xuICAgIGlmIChlLmNsYXNzZXM/Lmxlbmd0aCkgcmV0dXJuIGAke2UudGFnfS4ke2UuY2xhc3Nlcy5zbGljZSgwLCAyKS5qb2luKCcuJyl9YDtcbiAgICByZXR1cm4gZS5zZWxlY3RvciB8fCBlLnRhZyB8fCAnKHVua25vd24pJztcbiAgfTtcblxuICAvLyBQaWNrIHRoZSBtb3N0IFwiaHVtYW5seSByZWFkYWJsZVwiIGxhYmVsIGZvciB0aGUgYnViYmxlIHByZXZpZXcuIFByZWZlcnNcbiAgLy8gdmlzaWJsZS10by11c2VyIHRleHQgaW4gdGhpcyBwcmlvcml0eTpcbiAgLy8gICAxLiBpbm5lclRleHQgLyB0ZXh0Q29udGVudCAoYGVudHJ5LnRleHRgKSDigJQgd2hhdCB0aGUgdXNlciByZWFkcyBvbiBzY3JlZW5cbiAgLy8gICAyLiBhY2Nlc3NpYmxlTmFtZSAoYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZhbGxiYWNrIGNoYWluKVxuICAvLyAgIDMuIGlucHV0IHZhbHVlIChza2lwcGVkIGlmIGl0J3MgdGhlIG1hc2tlZCBwYXNzd29yZCBwbGFjZWhvbGRlcilcbiAgLy8gICA0LiBpbnB1dCBwbGFjZWhvbGRlclxuICAvLyAgIDUuIGltZyBhbHRcbiAgLy8gICA2LiBjb21wb25lbnRSb290IChlLmcuIFwiYnV0dG9uI2N0YVwiKVxuICAvLyAgIDcuIHRpdGxlRnJvbUVudHJ5IOKAlCBsYXN0LXJlc29ydCB0YWcvY2xhc3MvaWQgZmFsbGJhY2tcbiAgLy8gQ1NTIGhhbmRsZXMgdmlzdWFsIHRydW5jYXRpb24gdmlhIHRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7IHdlIHNoaXAgdGhlXG4gIC8vIGZ1bGwgc3RyaW5nIHNvIHRoZSB0b29sdGlwIG9uIGhvdmVyIGNhbiBzaG93IHRoZSBjb21wbGV0ZSB2YWx1ZS5cbiAgY29uc3QgbmljZUxhYmVsID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXh0KSByZXR1cm4gZS50ZXh0O1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lKSByZXR1cm4gZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBjb25zdCB2ID0gZS5hdHRycz8udmFsdWU7XG4gICAgaWYgKHYgJiYgdiAhPT0gJ+KAouKAouKAouKAoicpIHJldHVybiB2O1xuICAgIGlmIChlLmF0dHJzPy5wbGFjZWhvbGRlcikgcmV0dXJuIGUuYXR0cnMucGxhY2Vob2xkZXI7XG4gICAgaWYgKGUuYXR0cnM/LmFsdCkgcmV0dXJuIGUuYXR0cnMuYWx0O1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QpIHJldHVybiBlLmNvbXBvbmVudFJvb3Q7XG4gICAgcmV0dXJuIHRpdGxlRnJvbUVudHJ5KGUpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclNlbGVjdG9yID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCB2YWxpZCA9IHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHNhbWVQYXRoID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKSA9PT0gbGl2ZVRhYlBhdGg7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgc2VsZWN0b3InO1xuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdzdGFsZScpO1xuICAgIGVsc2UgaWYgKHZhbGlkID09PSBmYWxzZSAmJiAhc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdkaWZmLXBhZ2UnKTtcbiAgICBpZiAobS5waW5uZWQpIGRpdi5jbGFzc0xpc3QuYWRkKCdwaW5uZWQnKTtcbiAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBkaXYuY2xhc3NMaXN0LmFkZCgnaGFzLWdyb3VwJyk7XG4gICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgPT09IGxhc3RBY3RpdmVTZWxlY3RvcikgZGl2LmNsYXNzTGlzdC5hZGQoJ2xhc3QtYWN0aXZlJyk7XG4gICAgLy8gQXV0by1leHBhbmQgb24gc2VhcmNoIGhpdCBzbyB0aGUgdXNlciBzZWVzIHdoZXJlIHRoZSBtYXRjaCBsYW5kZWQuXG4gICAgY29uc3QgbWF0Y2hlZEJvZHkgPSBib2R5TWF0Y2hlc1NlYXJjaChtKTtcbiAgICBpZiAobWF0Y2hlZEJvZHkpIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcsICdzZWFyY2gtaGl0Jyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5kYXRhc2V0LnNlbGVjdG9yID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAvLyBEcmFnLXRvLXJlcGFyZW50OiBldmVyeSBzZWxlY3RvciBidWJibGUgaXMgYSB2YWxpZCBkcm9wIHRhcmdldCBmb3JcbiAgICAvLyBhIGNvbW1lbnQgYmVpbmcgZHJhZ2dlZCBmcm9tIGVsc2V3aGVyZSBpbiB0aGUgc2lkZWJhci5cbiAgICB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0KGRpdiwgbSk7XG5cbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnaGVhZCc7XG4gICAgY29uc3QgY2FyZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY2FyZXQuY2xhc3NOYW1lID0gJ2NhcmV0JztcbiAgICBjYXJldC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZXZyb24tcmlnaHQnLCAxMik7XG4gICAgaGVhZC5hcHBlbmQoY2FyZXQpO1xuICAgIGNvbnN0IHBpbk1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBwaW5NYXJrZXIuY2xhc3NOYW1lID0gJ3Bpbi1tYXJrZXInO1xuICAgIHBpbk1hcmtlci5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3N0YXItZmlsbGVkJywgMTEpO1xuICAgIGhlYWQuYXBwZW5kKHBpbk1hcmtlcik7XG4gICAgY29uc3Qgc2VxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7bS5lbnRyeS5ufWA7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgc2VxLnRleHRDb250ZW50ICs9IGArJHttLmVudHJ5Lmdyb3VwLmxlbmd0aH1gO1xuICAgIGhlYWQuYXBwZW5kKHNlcSk7XG4gICAgY29uc3QgY29tcGFjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb21wYWN0LmNsYXNzTmFtZSA9ICdjb21wYWN0JztcbiAgICBjb25zdCBjb21wYWN0U3RyID0gbmljZUxhYmVsKG0uZW50cnkpO1xuICAgIGNvbXBhY3QuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goY29tcGFjdFN0ciwgc2VhcmNoUXVlcnkpO1xuICAgIC8vIFNob3cgdGhlIGZ1bGwgbGFiZWwgb24gaG92ZXIgZXZlbiB3aGVuIENTUyBlbGxpcHNpcyB0cnVuY2F0ZXMgdGhlXG4gICAgLy8gdmlzaWJsZSBwb3J0aW9uIOKAlCB1c2VmdWwgd2hlbiB0aGUgdmlzaWJsZSB0ZXh0L3BsYWNlaG9sZGVyIGlzIGxvbmcuXG4gICAgaWYgKGNvbXBhY3RTdHIubGVuZ3RoID4gMjQpIGNvbXBhY3QuZGF0YXNldC50aXAgPSBjb21wYWN0U3RyO1xuICAgIGhlYWQuYXBwZW5kKGNvbXBhY3QpO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgY29uc3QgciA9IG0uZW50cnkucmVjdDtcbiAgICBtZXRhLnRleHRDb250ZW50ID0gciA/IGAke3Iud33DlyR7ci5ofWAgOiAobS5lbnRyeS50YWcgPz8gJycpO1xuICAgIGhlYWQuYXBwZW5kKG1ldGEpO1xuICAgIGRpdi5hcHBlbmQoaGVhZCk7XG5cbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHN1bW1hcnkuY2xhc3NOYW1lID0gJ3BlZWstc3VtbWFyeSc7XG4gICAgc3VtbWFyeS5pbm5lckhUTUwgPSBgPHNwYW4gZGF0YS1pY29uPVwiYWxlcnQtY2lyY2xlXCIgZGF0YS1zaXplPVwiMTFcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInRcIj4ke2Rpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2RpZmYtcGFnZScpID8gJ2RpZmZlcmVudCBwYWdlJyA6ICdzdGFsZSd9PC9zcGFuPmA7XG4gICAgaGVhZC5hcHBlbmQoc3VtbWFyeSk7XG4gICAgbW91bnRJY29ucyhzdW1tYXJ5KTtcblxuICAgIGNvbnN0IGVyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVyci5jbGFzc05hbWUgPSAncGVlay1lcnJvcic7XG4gICAgY29uc3QgcmVhc29uID0gc2VsZWN0b3JFcnJvcnMuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHBhdGhGcm9tRW50cnkgPSBwYXRoT2YobS5lbnRyeS51cmwgPz8gJycpO1xuICAgIGVyci5pbm5lckhUTUwgPSBzYW1lUGF0aFxuICAgICAgPyBgPGI+U3RhbGU8L2I+IMK3ICR7ZXNjYXBlSHRtbChyZWFzb24gPz8gJ25vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzLicpfTxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmBcbiAgICAgIDogYENhcHR1cmVkIG9uIDxjb2RlPiR7ZXNjYXBlSHRtbChwYXRoRnJvbUVudHJ5KX08L2NvZGU+IOKAlCBjdXJyZW50IHRhYiBpcyA8Y29kZT4ke2VzY2FwZUh0bWwobGl2ZVRhYlBhdGggPz8gJycpfTwvY29kZT4uIFN3aXRjaCB0YWJzIHRvIHZhbGlkYXRlLjxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmA7XG4gICAgZGl2LmFwcGVuZChlcnIpO1xuXG4gICAgLy8gQW5jZXN0b3IgYnJlYWRjcnVtYiDigJQgUGxhc21pYy1zdHlsZSBlc2NhbGF0b3IuIENoaXBzIGZvciBlYWNoIGVudHJ5IGluXG4gICAgLy8gZW50cnkuYW5jZXN0b3JzIChjbG9zZXN0IGZpcnN0KS4gQ2xpY2sgYSBjaGlwIHRvIGNhcHR1cmUgdGhhdFxuICAgIC8vIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2UgKGRlcHRoID0gY2hpcCBpbmRleCArIDEgc2luY2UgdGhlIGVudHJ5J3NcbiAgICAvLyBvd24gc2VsZWN0b3IgaXMgZGVwdGggMCkuIEJyaWdodG5lc3MgZ3JhZGllbnQgZGFya2VucyBkZWVwZXIgY2hpcHMuXG4gICAgaWYgKG0uZW50cnkuYW5jZXN0b3JzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNydW1icyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY3J1bWJzLmNsYXNzTmFtZSA9ICdhbmNlc3Rvci1jcnVtYnMnO1xuICAgICAgY3J1bWJzLmRhdGFzZXQudGlwID0gJ0NsaWNrIGEgY3J1bWIgdG8gZXNjYWxhdGUgdGhlIGNhcHR1cmUgdG8gYW4gYW5jZXN0b3IgZWxlbWVudCc7XG4gICAgICBtLmVudHJ5LmFuY2VzdG9ycy5mb3JFYWNoKChhbmMsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBjaGlwLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgY2hpcC5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY2hpcCc7XG4gICAgICAgIC8vIEJyaWdodG5lc3MgZ3JhZGllbnQ6IGRlZXBlciBjaGlwcyBnZXQgcHJvZ3Jlc3NpdmVseSBkaW1tZXIuXG4gICAgICAgIGNoaXAuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHsoMSAtIGkgKiAwLjA4KS50b0ZpeGVkKDIpfSlgO1xuICAgICAgICBjb25zdCBsYWJlbCA9IGFuYy50ZXN0SWQgPyBgWyR7YW5jLnRlc3RJZH1dYFxuICAgICAgICAgIDogYW5jLmlkID8gYCMke2FuYy5pZH1gXG4gICAgICAgICAgOiBhbmMuY2xhc3Nlcz8ubGVuZ3RoID8gYCR7YW5jLnRhZ30uJHthbmMuY2xhc3Nlc1swXX1gXG4gICAgICAgICAgOiBhbmMudGFnO1xuICAgICAgICBjaGlwLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNoaXAuZGF0YXNldC50aXAgPSBgQ2FwdHVyZSB0aGUgYW5jZXN0b3IgJHtpICsgMX0gbGV2ZWwke2kgPyAncycgOiAnJ30gdXAgwrcgJHthbmMudGFnfSR7YW5jLmlkID8gJyMnICsgYW5jLmlkIDogJyd9YDtcbiAgICAgICAgLy8gSG92ZXItcHJldmlldyB0aGUgYW5jZXN0b3Igb24gdGhlIGxpdmUgcGFnZSBzbyB0aGUgdXNlciBjYW4gc2VlXG4gICAgICAgIC8vIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY29tbWl0dGluZy4gTWlycm9ycyBob3dcbiAgICAgICAgLy8gaG92ZXJpbmcgYSBzZWxlY3RvciBidWJibGUgcGFpbnRzIGl0cyByaW5nLiBDbGVhcmluZyBvblxuICAgICAgICAvLyBtb3VzZWxlYXZlIHN3YXBzIGJhY2sgdG8gdGhlIGJ1YmJsZSdzIG93biBvdXRsaW5lICh0aGUgYnViYmxlJ3NcbiAgICAgICAgLy8gbW91c2VlbnRlciBoYW5kbGVyIHBhaW50ZWQgaXQ7IGxlYXZpbmcgdGhlIGNoaXAganVzdCByZW1vdmVzXG4gICAgICAgIC8vIHRoZSBvdmVycmlkZSkuXG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDF9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAvLyBSZS1wYWludCB0aGUgYnViYmxlJ3Mgb3duIHJpbmcgcmF0aGVyIHRoYW4gY2xlYXJpbmcgZW50aXJlbHlcbiAgICAgICAgICAvLyBzbyB0aGUgdXNlciBkb2Vzbid0IHNlZSBhIGZsaWNrZXIgb2YgXCJub3RoaW5nXCIgYmV0d2VlbiBjaGlwcy5cbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtcbiAgICAgICAgICAgIGtpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGRlcHRoOiBpICsgMSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAocmVwbHk/Lm9rKSBzZXRTdGF0dXMoYENhcHR1cmVkIGFuY2VzdG9yICR7YW5jLnRhZ31gKTtcbiAgICAgICAgICBlbHNlIHNldFN0YXR1cygnQ291bGQgbm90IGNhcHR1cmUgYW5jZXN0b3InLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjcnVtYnMuYXBwZW5kKGNoaXApO1xuICAgICAgfSk7XG4gICAgICBkaXYuYXBwZW5kKGNydW1icyk7XG4gICAgfVxuXG4gICAgLy8gUHJldmlldyB0aWxlLiBUaGUgZnVsbCBQTkcgbGl2ZXMgb24gZGlzayB1bmRlclxuICAgIC8vIC5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy87IHRoZSBkYXRhVXJsIGlzIGEgc2lkZS1wYW5lbC1mcmllbmRseVxuICAgIC8vIGRvd25zY2FsZSAo4omkMzIwcHggd2lkZSkuIFRvIHN0b3AgdGhlIGxheW91dCBmcm9tIGp1bXBpbmcgd2hlbiBhIHNob3RcbiAgICAvLyBhcnJpdmVzIGEgc2Vjb25kIGFmdGVyIGNhcHR1cmUsIHdlIFJFU0VSVkUgdGhlIGZpbmFsIGltYWdlIGhlaWdodCB1cFxuICAgIC8vIGZyb250IHVzaW5nIHRoZSBjYXB0dXJlZCBlbGVtZW50J3Mga25vd24gYXNwZWN0IHJhdGlvIGFuZCBwYWludCBhXG4gICAgLy8gc2tlbGV0b24gbG9hZGVyIGluIHRoYXQgc3BhY2UsIHRoZW4gc3dhcCB0aGUgc2NyZWVuc2hvdCBpbiB3aXRoIG5vXG4gICAgLy8gcmVmbG93LiBUaGUgcmVzZXJ2YXRpb24gb25seSBoYXBwZW5zIHdoZW4gYSBzaG90IGlzIGFjdHVhbGx5IGV4cGVjdGVkXG4gICAgLy8gKGF1dG9TY3JlZW5zaG90IG9uLCBob3N0IG5vdCBza2lwcGVkLCBubyByZWNvcmRlZCBmYWlsdXJlKSBzbyBjYXB0dXJlc1xuICAgIC8vIHRoYXQgd2lsbCBuZXZlciBnZXQgYSBzaG90IGRvbid0IGNhcnJ5IGFuIGVtcHR5IGJveC5cbiAgICBjb25zdCBzaG90RGF0YVVybCA9IHNob3RzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzaG90RXhwZWN0ZWQgPSBwcmVmcy5hdXRvU2NyZWVuc2hvdFxuICAgICAgJiYgIXNob3VsZFNraXBTY3JlZW5zaG90KG0uZW50cnkudXJsID8/ICcnKVxuICAgICAgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgaWYgKHNob3REYXRhVXJsIHx8IHNob3RFeHBlY3RlZCkge1xuICAgICAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJldmlldy5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICAvLyBSZXNlcnZlIHZlcnRpY2FsIHNwYWNlIGltbWVkaWF0ZWx5IGZyb20gdGhlIGVsZW1lbnQncyB3aWR0aC9oZWlnaHQuXG4gICAgICAvLyBUaGUgdGh1bWJuYWlsIGlzIHJlbmRlcmVkIGF0IHRoZSBidWJibGUncyBjb250ZW50IHdpZHRoLCBzbyB0aGUgYm94XG4gICAgICAvLyBoZWlnaHQgdHJhY2tzIHRoZSBlbGVtZW50J3MgYXNwZWN0IHJhdGlvLiBDbGFtcCBzbyBhIHZlcnkgdGFsbFxuICAgICAgLy8gZWxlbWVudCBkb2Vzbid0IHJlc2VydmUgYW4gYWJzdXJkIGFtb3VudCBvZiBzcGFjZS5cbiAgICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgICBpZiAociAmJiByLncgPiAwICYmIHIuaCA+IDApIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSBNYXRoLm1pbihNYXRoLm1heChyLmggLyByLncsIDAuMTIpLCAyLjIpO1xuICAgICAgICBwcmV2aWV3LnN0eWxlLnNldFByb3BlcnR5KCctLXNob3QtcmF0aW8nLCBTdHJpbmcocmF0aW8pKTtcbiAgICAgICAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdyZXNlcnZlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKHNob3REYXRhVXJsKSB7XG4gICAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWcuY2xhc3NOYW1lID0gJ3Nob3QnO1xuICAgICAgICBpbWcuYWx0ID0gYFNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWA7XG4gICAgICAgIC8vIFJldmVhbCBvbmx5IG9uY2UgZGVjb2RlZCBzbyB0aGUgc3dhcCBpcyBpbnN0YW50IGFuZCByZWZsb3ctZnJlZTtcbiAgICAgICAgLy8gdGhlIHNrZWxldG9uIHN0YXlzIHZpc2libGUgdW5kZXJuZWF0aCB1bnRpbCB0aGVuLlxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJykpO1xuICAgICAgICBpbWcuc3JjID0gc2hvdERhdGFVcmw7XG4gICAgICAgIGlmIChpbWcuY29tcGxldGUpIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XG4gICAgICAgIHByZXZpZXcuYXBwZW5kKGltZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBzaG90IHlldCDigJQgc2hvdyBhIHNrZWxldG9uIHNoaW1tZXIgb2NjdXB5aW5nIHRoZSByZXNlcnZlZCBzcGFjZS5cbiAgICAgICAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJyk7XG4gICAgICAgIGNvbnN0IHNrZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2tlbC5jbGFzc05hbWUgPSAnc2hvdC1za2VsZXRvbic7XG4gICAgICAgIHNrZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYExvYWRpbmcgc2NyZWVuc2hvdCBvZiAjJHttLmVudHJ5Lm59YCk7XG4gICAgICAgIHByZXZpZXcuYXBwZW5kKHNrZWwpO1xuICAgICAgfVxuICAgICAgZGl2LmFwcGVuZChwcmV2aWV3KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0YXRzLmNsYXNzTmFtZSA9ICdlbnQtc3RhdHMnO1xuICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgY29uc3QgbXlUb2tlbnMgPSB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG0uZW50cnkpKTtcbiAgICBjb25zdCB0b3RhbFRva2VucyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtbSk6IG1tIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnJlZHVjZSgocywgbW0pID0+IHMgKyB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG1tLmVudHJ5KSksIDApO1xuICAgIGNvbnN0IHNoYXJlUGN0ID0gdG90YWxUb2tlbnMgPiAwID8gTWF0aC5yb3VuZCgobXlUb2tlbnMgLyB0b3RhbFRva2VucykgKiAxMDApIDogMDtcbiAgICBjb25zdCBncm91cENvdW50ID0gbS5lbnRyeS5ncm91cD8ubGVuZ3RoID8/IDA7XG4gICAgY29uc3QgZ3JvdXBUb2tlbnMgPSAobS5lbnRyeS5ncm91cCA/PyBbXSkucmVkdWNlKChzLCBnKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShnKSksIDApO1xuICAgIHR5cGUgU3RhdENlbGwgPSB7bGFiZWw6IHN0cmluZzsgdmFsdWU6IHN0cmluZzsgdGlwOiBzdHJpbmd9O1xuICAgIGNvbnN0IGNlbGxzOiBTdGF0Q2VsbFtdID0gW1xuICAgICAge2xhYmVsOiAnSFRNTCcsIHZhbHVlOiBgJHttLmVudHJ5Lm91dGVySFRNTD8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnT3V0ZXIgSFRNTCBjaGFyIGxlbmd0aCd9LFxuICAgICAge2xhYmVsOiAnVG9rZW5zJywgdmFsdWU6IGAke215VG9rZW5zfWAsIHRpcDogJ0FwcHJveCBMTE0gdG9rZW5zIGZvciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdTaGFyZScsIHZhbHVlOiBgJHtzaGFyZVBjdH0lYCwgdGlwOiAnVG9rZW4gc2hhcmUgb2YgYWxsIHNlbGVjdG9ycyd9LFxuICAgICAge2xhYmVsOiAnQ29tbWVudHMnLCB2YWx1ZTogYCR7ZmIubGVuZ3RofWAsIHRpcDogJ0lubGluZSBjb21tZW50cyB0aHJlYWRlZCB1bmRlciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdSdWxlcycsIHZhbHVlOiBgJHttLmVudHJ5Lm1hdGNoZWRSdWxlcz8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnTWF0Y2hlZCBDU1MgcnVsZXMnfSxcbiAgICAgIHtsYWJlbDogJ1N0eWxlcycsIHZhbHVlOiBgJHtPYmplY3Qua2V5cyhtLmVudHJ5LnN0eWxlcyA/PyB7fSkubGVuZ3RofWAsIHRpcDogJ0NvbXB1dGVkLXN0eWxlIGZpZWxkcyBrZXB0J30sXG4gICAgXTtcbiAgICBpZiAoZ3JvdXBDb3VudCkge1xuICAgICAgY2VsbHMucHVzaCh7bGFiZWw6ICdHcm91cCcsIHZhbHVlOiBgJHtncm91cENvdW50fWAsIHRpcDogJ01lbWJlcnMgZm9sZGVkIGludG8gdGhpcyBncm91cCd9KTtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAgVCcsIHZhbHVlOiBgJHtncm91cFRva2Vuc31gLCB0aXA6ICdUb2tlbnMgY29udHJpYnV0ZWQgYnkgZ3JvdXAgbWVtYmVycyd9KTtcbiAgICB9XG4gICAgc3RhdHMuaW5uZXJIVE1MID0gY2VsbHMubWFwKChjKSA9PlxuICAgICAgYDxzcGFuIGNsYXNzPVwiZW50LXN0YXRcIiBkYXRhLXRpcD1cIiR7ZXNjYXBlSHRtbChjLnRpcCl9XCI+PHNwYW4gY2xhc3M9XCJsYmxcIj4ke2MubGFiZWx9PC9zcGFuPjxzcGFuIGNsYXNzPVwidmFsXCI+JHtjLnZhbHVlfTwvc3Bhbj48L3NwYW4+YCxcbiAgICApLmpvaW4oJycpO1xuICAgIGRpdi5hcHBlbmQoc3RhdHMpO1xuXG4gICAgLy8g4pSA4pSAIEpTT04gcGFuZSB3aXRoIHRvb2xiYXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy8gVG9vbGJhciBhYm92ZSB0aGUgSlNPTiBib2R5OiBsZWZ0ID0gbGluZS13cmFwIHRvZ2dsZSwgcmlnaHQgPSBjb3B5LlxuICAgIC8vIFRoZSBKU09OIGl0c2VsZiByZWZsZWN0cyB0aGUgZ2xvYmFsIGBtaW5pZnlgIHNldHRpbmcgc28gdGhlIHVzZXIgc2Vlc1xuICAgIC8vIHRoZSBzYW1lIHNoYXBlIHRoYXQgd2lsbCBlbmQgdXAgaW4gdGhlIGV4cG9ydC5cbiAgICBjb25zdCBqc29uV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25XcmFwLmNsYXNzTmFtZSA9ICdib2R5LWpzb24td3JhcCc7XG4gICAgY29uc3QganNvbkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25CYXIuY2xhc3NOYW1lID0gJ2JvZHktanNvbi1iYXInO1xuXG4gICAgLy8gTGluZS13cmFwIGNoZWNrYm94IChwZXItYnViYmxlIGxvY2FsIHN0YXRlLCBkZWZhdWx0IE9OKS4gV2hlbiBPTiB0aGVcbiAgICAvLyBKU09OIGlzIGZsYXR0ZW5lZCB0byBPTkUgbWluaWZpZWQgbGluZSB0aGF0IHNvZnQtd3JhcHMgdG8gdGhlIGJ1YmJsZVxuICAgIC8vIHdpZHRoIChubyBob3Jpem9udGFsIHNjcm9sbCk7IHdoZW4gT0ZGIGl0IGZhbGxzIGJhY2sgdG8gdGhlIGdsb2JhbFxuICAgIC8vIG1pbmlmeS1yZXNwZWN0aW5nIHByZXR0eS9jb21wYWN0IGZvcm0gd2l0aCBob3Jpem9udGFsIHNjcm9sbC5cbiAgICBjb25zdCB3cmFwTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHdyYXBMYWJlbC5jbGFzc05hbWUgPSAnanNvbi13cmFwLXRvZ2dsZSc7XG4gICAgd3JhcExhYmVsLmRhdGFzZXQudGlwID0gJ0ZsYXR0ZW4gdG8gYSBzaW5nbGUgc29mdC13cmFwcGluZyBsaW5lIGluc3RlYWQgb2YgaG9yaXpvbnRhbCBzY3JvbGwnO1xuICAgIGNvbnN0IHdyYXBDaGVjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgd3JhcENoZWNrLnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIHdyYXBDaGVjay5jaGVja2VkID0gdHJ1ZTtcbiAgICB3cmFwTGFiZWwuYXBwZW5kKHdyYXBDaGVjaywgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBXcmFwJykpO1xuICAgIGpzb25CYXIuYXBwZW5kKHdyYXBMYWJlbCk7XG5cbiAgICAvLyBDb3B5IGJ1dHRvbiAobWlycm9ycyB0aGUgXCJDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OXCIgYWN0aW9uIGJlbG93LFxuICAgIC8vIHN1cmZhY2VkIGF0IHRoZSB0b3Agc28gdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIHNjcm9sbCBwYXN0IHRoZSBKU09OXG4gICAgLy8gdG8gZmluZCBpdCkuXG4gICAgY29uc3QgY29weUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvcHlCdG4udHlwZSA9ICdidXR0b24nO1xuICAgIGNvcHlCdG4uY2xhc3NOYW1lID0gJ2ljb25idG4ganNvbi1jb3B5JztcbiAgICBjb3B5QnRuLmRhdGFzZXQudGlwID0gJ0NvcHkgdGhpcyBjYXB0dXJlIGFzIEpTT04nO1xuICAgIGNvcHlCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NvcHkgY2FwdHVyZSBhcyBKU09OJyk7XG4gICAgY29weUJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NvcHknLCAxMyk7XG4gICAgY29weUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgLy8gRnVsbCBzaW5nbGUtY2FwdHVyZSBleHBvcnQ6IGlkZW50aXR5ICsgcGF0aHMgKyB0ZXh0L2NvbnRlbnQgKyBldmVyeVxuICAgICAgLy8gYXR0YWNoZWQgbm90ZS9jb21tZW50IOKAlCB0aGUgc2FtZSBkZXB0aCBhcyBhIGZ1bGwgZXhwb3J0LCBzY29wZWQgdG9cbiAgICAgIC8vIHRoaXMgb25lIGNhcHR1cmUgKGl0ZW0gNykuIERpc3RpbmN0IGZyb20gdGhlIHJhdyBlbnRyeSBzaG93biBiZWxvdy5cbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KTtcbiAgICBqc29uQmFyLmFwcGVuZChjb3B5QnRuKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoanNvbkJhcik7XG5cbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9keS5jbGFzc05hbWUgPSAnYm9keS1qc29uIHdyYXAtb24nO1xuICAgIC8vIFJlbmRlciB0aGUgSlNPTiB0byBtYXRjaCB0aGUgd3JhcCBzdGF0ZTpcbiAgICAvLyAgIHdyYXAgT04gIOKGkiBhIHNpbmdsZSBtaW5pZmllZCBsaW5lIChpbmRlbnQgMCkgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZVxuICAgIC8vICAgICAgICAgICAgICBidWJibGUgd2lkdGggKENTUyBoYW5kbGVzIHRoZSB2aXN1YWwgd3JhcHBpbmcgdmlhXG4gICAgLy8gICAgICAgICAgICAgIG92ZXJmbG93LXdyYXA6YW55d2hlcmUpLCBzbyB0aGUgd2hvbGUgb2JqZWN0IGlzIG9uZVxuICAgIC8vICAgICAgICAgICAgICBjb250aW51b3VzIHN0cmluZyB3aXRoIG5vIGhvcml6b250YWwgc2Nyb2xsLlxuICAgIC8vICAgd3JhcCBPRkYg4oaSIHRoZSBnbG9iYWwgbWluaWZ5LXJlc3BlY3RpbmcgZm9ybTogcHJldHR5LXByaW50ZWQgZnVsbFxuICAgIC8vICAgICAgICAgICAgICBlbnRyeSwgb3IgdGhlIHNsaW1FbnRyeSBjb21wYWN0IGZvcm0gd2hlbiBtaW5pZnkgaXMgb24sXG4gICAgLy8gICAgICAgICAgICAgIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwgZm9yIGxvbmcgbGluZXMuXG4gICAgY29uc3QgcmVuZGVySnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGJvZHkudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwQ2hlY2suY2hlY2tlZDtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSAod3JhcHBlZCB8fCBwcmVmcy5taW5pZnkpID8gc2xpbUVudHJ5KG0uZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWV9KSA6IG0uZW50cnk7XG4gICAgICBjb25zdCBpbmRlbnQgPSAod3JhcHBlZCB8fCBwcmVmcy5taW5pZnkpID8gMCA6IDI7XG4gICAgICBjb25zdCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgaW5kZW50KTtcbiAgICAgIGFwcGVuZEpzb25IaWdobGlnaHQoYm9keSwgdGV4dCk7XG4gICAgICBpZiAoc2VhcmNoUXVlcnkpIHdyYXBTZWFyY2hIaXRzSW5UZXh0Tm9kZXMoYm9keSwgc2VhcmNoUXVlcnkpO1xuICAgIH07XG4gICAgcmVuZGVySnNvbigpO1xuICAgIHdyYXBDaGVjay5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb24nLCB3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb2ZmJywgIXdyYXBDaGVjay5jaGVja2VkKTtcbiAgICAgIHJlbmRlckpzb24oKTtcbiAgICB9KTtcbiAgICAvLyBTdG9wIHRoZSBjbGljayBvbiB0aGUgdG9vbGJhciBmcm9tIGNvbGxhcHNpbmcgdGhlIGJ1YmJsZSDigJQgdGhlIGhlYWQnc1xuICAgIC8vIGNsaWNrIGhhbmRsZXIgdG9nZ2xlcyBgLmV4cGFuZGVkYCBvbiBjbGljaywgYW5kIHRoZSBiYXIgbGl2ZXMgaW5zaWRlXG4gICAgLy8gdGhlIGJ1YmJsZS5cbiAgICBqc29uQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGpzb25XcmFwLmFwcGVuZChib2R5KTtcbiAgICBkaXYuYXBwZW5kKGpzb25XcmFwKTtcblxuICAgIGhlYWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwYW5kZWQnKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXdOb29kbGVzKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGdvbGQ6IHRydWV9KTtcbiAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgaWYgKGxhc3RBY3RpdmVTZWxlY3Rvcikgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBsYXN0QWN0aXZlU2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFjdGlvbnMuY2xhc3NOYW1lID0gJ2FjdGlvbnMnO1xuICAgIC8vIE5vdGU6IE5PIGFjdGlvbnMtcm93IG1vdXNlZW50ZXIvbW91c2VsZWF2ZS4gVGhlIGJ1YmJsZSdzIG93blxuICAgIC8vIG1vdXNlZW50ZXIvbW91c2VsZWF2ZSBhbHJlYWR5IHBhaW50cyB0aGUgcGFnZS1zaWRlIG91dGxpbmUgd2hpbGVcbiAgICAvLyB0aGUgY3Vyc29yIGlzIGFueXdoZXJlIGluc2lkZSB0aGUgYnViYmxlIOKAlCBpbmNsdWRpbmcgb3ZlciBhY3Rpb25cbiAgICAvLyBidXR0b25zLiBBZGRpbmcgaGFuZGxlcnMgSEVSRSB1c2VkIHRvIGNsZWFyIHRoZSBvdXRsaW5lIHdoZW5ldmVyXG4gICAgLy8gdGhlIGN1cnNvciBtb3ZlZCBmcm9tIC5hY3Rpb25zIGJhY2sgdG8gdGhlIGJ1YmJsZSBib2R5IChiZWNhdXNlXG4gICAgLy8gLm1vdXNlbGVhdmUgZmlyZXMgb24gdGhlIHBhcmVudCBwYXRoIGV2ZW4gdGhvdWdoIC5tb3VzZWVudGVyIG9uXG4gICAgLy8gdGhlIGJ1YmJsZSBkb2Vzbid0IHJlZmlyZSksIHdoaWNoIHJlYWQgYXMgXCJ0aGUgaGlnaGxpZ2h0IGZsaWNrZXJzXG4gICAgLy8gb2ZmIG1pZC1ob3ZlclwiLlxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bihtLnBpbm5lZCA/ICdzdGFyLWZpbGxlZCcgOiAnc3RhcicsIG0ucGlubmVkID8gJ1VucGluIGZyb20gdG9wJyA6ICdQaW4gdG8gdG9wJywgKCkgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG0ucGlubmVkID0gIW0ucGlubmVkO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3RvZ2dsZWQ6IG0ucGlubmVkfSkpO1xuICAgIC8vIExvY2F0ZSBpcyBhIG9uZS1zaG90OiBzY3JvbGwgdGhlIHBhZ2UgdG8gdGhlIGVsZW1lbnQgYW5kIHJ1biB0aGVcbiAgICAvLyAzLXB1bHNlIGN5YW4gcmluZyBhbmltYXRpb24uIEl0IHVzZWQgdG8gc2hhcmUgYGxhc3RBY3RpdmVTZWxlY3RvcmBcbiAgICAvLyB3aXRoIHRoZSBob3Zlci1zdGlja3kgcGF0aCwgd2hpY2ggbWFkZSB0aGUgYnV0dG9uIGFwcGVhciB0b2dnbGVkXG4gICAgLy8gYW55IHRpbWUgdGhlIHVzZXIgbWVyZWx5IGhvdmVyZWQgdGhlIGJ1YmJsZS4gTm93IGl0IGhhcyBub1xuICAgIC8vIHBlcnNpc3RlbnQgc3RhdGUg4oCUIHByZXNzaW5nIGl0IGFsd2F5cyBwbGF5cyB0aGUgc2FtZSBmbGFzaC5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2Nyb3NzaGFpcicsICdMb2NhdGUgdGhpcyBlbGVtZW50IG9uIHRoZSBwYWdlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2xvY2F0ZS1mbGFzaCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICBzZXRTdGF0dXMoJ0xvY2F0aW5n4oCmJyk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbWVzc2FnZS1zcXVhcmUtcGx1cycsICdBZGQgYSBjb21tZW50IGFmdGVyIHRoaXMgY2FwdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGNvbnN0IGJlZm9yZUlkID0gaWR4ID49IDAgJiYgaWR4IDwgbWVzc2FnZXMubGVuZ3RoIC0gMSA/IG1lc3NhZ2VzW2lkeCArIDFdIS5pZCA6ICdfX2VuZF9fJztcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7XG4gICAgICByZW5kZXIoKTtcbiAgICB9LCB7c2l6ZTogMTV9KSk7XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIC8vIFNwbGl0LWdyb3VwIGFjdGlvbjogcHJvbW90ZSBlYWNoIGdyb3VwIG1lbWJlciBiYWNrIHRvIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzZWxlY3RvciBlbnRyeSwgdGhlbiBmaXJlIGEgZnJlc2ggZWxlbWVudCBzY3JlZW5zaG90XG4gICAgICAvLyBmb3IgZWFjaCBwcm9tb3RlZCBtZW1iZXIuIEdyb3VwIGNhcHR1cmVzIHNoYXJlIGEgc2luZ2xlIHVuaW9uLVxuICAgICAgLy8gYmJveCBzY3JlZW5zaG90IGtleWVkIG9uIHRoZSBoZWFkOyB0aGUgbWVtYmVycyBuZXZlciBnZXQgdGhlaXJcbiAgICAgIC8vIG93biBlbGVtZW50IHNob3RzIHVudGlsIHNwbGl0LiBBZnRlciB0aGlzLCBlYWNoIGNoaWxkIGhhcyBpdHNcbiAgICAgIC8vIG93biByaW5nICsgdGh1bWJuYWlsLlxuICAgICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdsaXN0LXRyZWUnLCBgU3BsaXQgdGhpcyBncm91cCBvZiAke2dyb3VwQ291bnR9IGludG8gaW5kaXZpZHVhbCBlbnRyaWVzYCwgKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICAgIGlmIChpZHggPCAwKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBtLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgICBkZWxldGUgbS5lbnRyeS5ncm91cDtcbiAgICAgICAgY29uc3QgZnJlc2g6IFNlbGVjdG9yTWVzc2FnZVtdID0gbWVtYmVycy5tYXAoKGVudHJ5KSA9PiAoe1xuICAgICAgICAgIHR5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogZW50cnkudHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeSxcbiAgICAgICAgfSkpO1xuICAgICAgICBtZXNzYWdlcy5zcGxpY2UoaWR4ICsgMSwgMCwgLi4uZnJlc2gpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGdyb3VwIG9mICR7bWVtYmVycy5sZW5ndGh9IMK3IGNhcHR1cmluZyBzY3JlZW5zaG90c+KApmApO1xuICAgICAgICAvLyBGaXJlIHBlci1tZW1iZXIgZWxlbWVudCBzaG90cyDigJQgc2VxdWVudGlhbGx5IHNvIHRoZXkgZG9uJ3RcbiAgICAgICAgLy8gcmFjZSBjYXB0dXJlVmlzaWJsZVRhYi4gRmFpbHVyZXMgKHNlbGVjdG9yIG5vIGxvbmdlciBtYXRjaGVzLFxuICAgICAgICAvLyBob3N0IG9uIHNraXAtbGlzdCkgbGVhdmUgdGhlIG1lbWJlciB3aXRob3V0IGEgdGh1bWJuYWlsIGJ1dFxuICAgICAgICAvLyBkb24ndCBibG9jayB0aGUgb3RoZXJzLlxuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGNhcHR1cmVkID0gMDtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGZyZXNoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCBmaXJlRWxlbWVudFNob3QoY2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoY2hpbGQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgY2FwdHVyZWQrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ3NwbGl0LWdyb3VwIHNob3QgZmFpbGVkIGZvcicsIGNoaWxkLmVudHJ5LnNlbGVjdG9yLCBlKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGRvbmUgwrcgJHtjYXB0dXJlZH0vJHttZW1iZXJzLmxlbmd0aH0gc2NyZWVuc2hvdHNgKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdleHRlcm5hbC1saW5rJywgJ0xvZyB0aGUgZWxlbWVudCBhbmQgY29weSBhIGNvbnNvbGUgc25pcHBldCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtzbmlwcGV0Pzogc3RyaW5nfT4oe2tpbmQ6ICdsb2ctZWxlbWVudCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGNvbnN0IHNuaXBwZXQgPSByZXBseT8uc25pcHBldCA/PyBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignJHttLmVudHJ5LnNlbGVjdG9yfScpYDtcbiAgICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNuaXBwZXQpOyBzZXRTdGF0dXMoJ0xvZ2dlZCArIGNvcGllZCBjb25zb2xlIHNuaXBwZXQnKTsgc2hvd0NvcGllZCgnQ29waWVkIHNuaXBwZXQnKTsgfVxuICAgICAgY2F0Y2ggeyBzZXRTdGF0dXMoJ0xvZ2dlZCB0byBjb25zb2xlJyk7IH1cbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdyZWZyZXNoLWN3JywgJ1JlLWNhcHR1cmUgdGhpcyBlbGVtZW50IGZyb20gdGhlIGxpdmUgcGFnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtraW5kOiAncmVjYXB0dXJlJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIG46IG0uZW50cnkubn0pO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5lbnRyeSkge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLmVudHJ5ID0gcmVwbHkuZW50cnk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cygnUmUtY2FwdHVyZWQnKTtcblxuICAgICAgfSBlbHNlIHNldFN0YXR1cygnUmUtY2FwdHVyZSBmYWlsZWQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBhIGZ1bGwgZXhwb3J0IChwYXRocywgdGV4dCwgY29tbWVudHMpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBtZXNzYWdlcy5mbGF0TWFwKCh4KSA9PiB4LnR5cGUgPT09ICdmZWVkYmFjaycgJiYgeC5wYXJlbnRVaWQgPT09IG0uZW50cnkudWlkXG4gICAgICAgID8gW3t0ZXh0OiB4LnRleHQsIHRzOiB4LnRzLCB1aWQ6IHguaWQsIHBhcmVudFVpZDogeC5wYXJlbnRVaWR9XSA6IFtdKTtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNlcmlhbGl6ZUNhcHR1cmVKc29uKHtlbnRyeTogbS5lbnRyeSwgZmVlZGJhY2t9KSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjYXB0dXJlIGV4cG9ydCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNhcHR1cmUnLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJGZWVkYmFjayA9IChtOiBGZWVkYmFja01lc3NhZ2UsIGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayc7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChtLnRleHQsIHNlYXJjaFF1ZXJ5KTtcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSB7XG4gICAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgc2VsZWN0b3Ig4oCUIHByZWZlciBwYXJlbnRVaWQgKHRoZSBwZXJzaXN0ZWQgRkspXG4gICAgICAvLyBvdmVyIGNhcHR1cmUtYWRqYWNlbmN5LCBzaW5jZSBkcmFnLXRvLXJlcGFyZW50IG1vdmVzIHRoZSBjaGlwIGJ1dFxuICAgICAgLy8gdGhlIHRyYWlsaW5nLXNlbGVjdG9yIGhldXJpc3RpYyBnaXZlcyBzdGFsZSByZXN1bHRzIHVudGlsIHJlbmRlclxuICAgICAgLy8gc2V0dGxlcy4gVGhlIGFubm90YXRpb24gb3ZlcmxheSBuZWVkcyB0aGUgcGFyZW50J3Mgc2VsZWN0b3IgdG9cbiAgICAgIC8vIGFuY2hvciB0aGUgb24tcGFnZSB0b29sdGlwLlxuICAgICAgY29uc3Qge3BhcmVudFNlbCwgcGFyZW50VWlkfSA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkge1xuICAgICAgICAgIGNvbnN0IHAgPSBtZXNzYWdlcy5maW5kKFxuICAgICAgICAgICAgKG1tKSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InICYmIChtbSBhcyBTZWxlY3Rvck1lc3NhZ2UpLmVudHJ5LnVpZCA9PT0gbS5wYXJlbnRVaWQsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAocCAmJiBwLnR5cGUgPT09ICdzZWxlY3RvcicpIHJldHVybiB7cGFyZW50U2VsOiBwLmVudHJ5LnNlbGVjdG9yLCBwYXJlbnRVaWQ6IHAuZW50cnkudWlkfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3BhcmVudFNlbDogbGFzdFNlbGVjdG9yU2VsLCBwYXJlbnRVaWQ6IHVuZGVmaW5lZCBhcyBzdHJpbmcgfCB1bmRlZmluZWR9O1xuICAgICAgfSkoKTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogcGFyZW50U2VsLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIC8vIFNjcm9sbCB0aGUgcGFyZW50IGVsZW1lbnQgaW50byB2aWV3ICsgc2hvdyB0aGUgb24tcGFnZVxuICAgICAgICAvLyBhbm5vdGF0aW9uIHRvb2x0aXAgcmVuZGVyaW5nIFRISVMgY29tbWVudCdzIHRleHQuIFBhc3MgdGhlXG4gICAgICAgIC8vIHBhcmVudCdzIHVpZCBzbyBhIHNhbWUtc2VsZWN0b3Igc2libGluZyBjYXB0dXJlIGRvZXNuJ3QgZ2V0XG4gICAgICAgIC8vIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBcInRoZSBzYW1lIHRhcmdldFwiIGJ5IHRoZSBjb250ZW50XG4gICAgICAgIC8vIHNjcmlwdCdzIGFubm90YXRpb24gb3ZlcmxheS5cbiAgICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHtcbiAgICAgICAgICBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRUb0NTKHtcbiAgICAgICAgICBraW5kOiAnYW5ub3RhdGlvbicsXG4gICAgICAgICAgc2VsZWN0b3I6IHBhcmVudFNlbCxcbiAgICAgICAgICBwYXlsb2FkOiB7c2VsZWN0b3I6IHBhcmVudFNlbCwgdWlkOiBwYXJlbnRVaWQsIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFjazogW20udGV4dF19LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ30pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGRpdi5kYXRhc2V0LmNvbW1lbnRJZCA9IG0uaWQ7XG4gICAgY29uc3QgYmVnaW5Db21tZW50RHJhZyA9IChlOiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnLCBtLmlkKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCd0ZXh0L3BsYWluJywgbS50ZXh0KTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICB9O1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICBjb25zdCBkcmFnSGFuZGxlID0gYWN0aW9uQnRuKCdncmlwJywgJ0RyYWcgdGhpcyBoYW5kbGUgb250byBhIHNlbGVjdG9yIHRvIHJlcGFyZW50JywgKCkgPT4geyAvKiBkcmFnIGhhbmRsZSBvbmx5ICovIH0pO1xuICAgIGRyYWdIYW5kbGUuY2xhc3NMaXN0LmFkZCgnZHJhZy1oYW5kbGUnKTtcbiAgICBkcmFnSGFuZGxlLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBiZWdpbkNvbW1lbnREcmFnKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkcmFnSGFuZGxlKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSBjb21tZW50IHRleHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChtLnRleHQpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY29tbWVudCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNvbW1lbnQnKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdwZW5jaWwnLCAnRWRpdCBjb21tZW50JywgKCkgPT4gZW50ZXJGZWVkYmFja0VkaXQoZGl2LCBtKSwge3NpemU6IDE1fSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIC8vIERyb3AgaGFuZGxlciBzaGFyZWQgYnkgZXZlcnkgc2VsZWN0b3IgYnViYmxlLiBBY2NlcHRzIGEgZHJhZ2dlZFxuICAvLyBjb21tZW50IElEIHZpYSB0aGUgYGFwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnRgIE1JTUUsIHVwZGF0ZXNcbiAgLy8gcGFyZW50VWlkICsgYWRqYWNlbmN5LCBwZXJzaXN0cywgcmUtcmVuZGVycy5cbiAgY29uc3Qgd2lyZVNlbGVjdG9yRHJvcFRhcmdldCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBTZWxlY3Rvck1lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgICAgY29uc3QgdHlwZXMgPSBlLmRhdGFUcmFuc2Zlcj8udHlwZXM7XG4gICAgICBpZiAoIXR5cGVzIHx8ICFBcnJheS5mcm9tKHR5cGVzKS5pbmNsdWRlcygnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJvcC10YXJnZXQnKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0JykpO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpO1xuICAgICAgY29uc3QgaWQgPSBlLmRhdGFUcmFuc2Zlcj8uZ2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpO1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3JjSWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IGlkKTtcbiAgICAgIGlmIChzcmNJZHggPCAwKSByZXR1cm47XG4gICAgICBjb25zdCBzcmMgPSBtZXNzYWdlc1tzcmNJZHhdISBhcyBGZWVkYmFja01lc3NhZ2U7XG4gICAgICBpZiAoc3JjLnR5cGUgIT09ICdmZWVkYmFjaycpIHJldHVybjtcbiAgICAgIGNvbnN0IGRzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGlmIChkc3RJZHggPCAwKSByZXR1cm47XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgLy8gVXBkYXRlIHRoZSBGSyBwb2ludGVyIGZpcnN0IOKAlCB0aGF0J3MgdGhlIHNvdXJjZSBvZiB0cnV0aCBpblxuICAgICAgLy8gZXhwb3J0cy4gQWRqYWNlbmN5IGlzIGp1c3QgYSByZW5kZXIgY29udmVuaWVuY2UuXG4gICAgICBzcmMucGFyZW50VWlkID0gbS5lbnRyeS51aWQ7XG4gICAgICAvLyBTcGxpY2Ugc3JjIG91dCBvZiBpdHMgY3VycmVudCBzbG90IGFuZCByZS1pbnNlcnQgcmlnaHQgYWZ0ZXIgdGhlXG4gICAgICAvLyBuZXcgcGFyZW50IChhbmQgYW55IGZlZWRiYWNrIGFscmVhZHkgdHJhaWxpbmcgaXQsIHNvIHRoZSBtb3N0LVxuICAgICAgLy8gcmVjZW50IGZlZWRiYWNrIGVuZHMgdXAgbmVhcmVzdCB0aGUgcGFyZW50IHZpc3VhbGx5KS5cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShzcmNJZHgsIDEpO1xuICAgICAgY29uc3QgbmV3RHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgbGV0IGluc2VydEF0ID0gbmV3RHN0SWR4ICsgMTtcbiAgICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0hLnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHNyYyk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCByZXBhcmVudGVkJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdHlwZSBBY3Rpb25CdG5PcHRzID0ge3dhcm4/OiBib29sZWFuOyB0b2dnbGVkPzogYm9vbGVhbjsgc2l6ZT86IG51bWJlcn07XG4gIGNvbnN0IGFjdGlvbkJ0biA9IChpY29uOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGZuOiAoKSA9PiB2b2lkLCBvcHRzOiBBY3Rpb25CdG5PcHRzID0ge30pOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuZGF0YXNldC50aXAgPSB0aXRsZTtcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRpdGxlKTtcbiAgICBpZiAob3B0cy53YXJuKSBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBpZiAob3B0cy50b2dnbGVkKSBiLmNsYXNzTGlzdC5hZGQoJ3RvZ2dsZWQnKTtcbiAgICAvLyBEZWZhdWx0IGljb24gc2l6ZSAxMyByZWFkcyBzbGlnaHRseSBzbWFsbCBpbiBhIDIyw5cyMiBidXR0b24g4oCUIGZpbmVcbiAgICAvLyBmb3IgaWNvbnMgd2l0aCBzaW1wbGUgc2hhcGVzIChjcm9zc2hhaXIsIGxpc3QtdHJlZSwgdW5kbykgYnV0IHZpc2libHlcbiAgICAvLyBzcXVlZXplZCBmb3IgYG1lc3NhZ2Utc3F1YXJlLXBsdXNgIGFuZCBgcGVuY2lsYCwgd2hlcmUgdGhlXG4gICAgLy8gaW50ZXJpb3Igc3Ryb2tlcyB2YW5pc2ggaW50byBoYWlybGluZSBibHVyLiBDYWxsZXJzIGNhbiBidW1wIHdpdGhcbiAgICAvLyBgc2l6ZTogMTVgIGZvciB0aG9zZS5cbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhpY29uLCBvcHRzLnNpemUgPz8gMTMpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBmbigpOyB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBkZWxldGVCdG4gPSAob25Db25maXJtOiAoKSA9PiB2b2lkKTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBiLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSc7XG4gICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnRGVsZXRlIGNhcHR1cmUnKTtcbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZXZlcnRUaW1lciA9IDA7XG4gICAgY29uc3QgcmV2ZXJ0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbmZpcm0teWVzLCAuY29uZmlybS1ubycpKSBuLnJlbW92ZSgpO1xuICAgICAgaWYgKCFiLnBhcmVudEVsZW1lbnQpIHBhcmVudC5hcHBlbmQoYik7XG4gICAgICBjbGVhclRpbWVvdXQocmV2ZXJ0VGltZXIpO1xuICAgIH07XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcGFyZW50ID0gYi5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgeWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB5ZXMudHlwZSA9ICdidXR0b24nO1xuICAgICAgeWVzLmNsYXNzTmFtZSA9ICdjb25maXJtLXllcyc7XG4gICAgICB5ZXMuZGF0YXNldC50aXAgPSAnQ29uZmlybSBkZWxldGUnO1xuICAgICAgeWVzLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb25maXJtIGRlbGV0ZScpO1xuICAgICAgeWVzLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAxMyk7XG4gICAgICB5ZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyBvbkNvbmZpcm0oKTsgfSk7XG4gICAgICBjb25zdCBubyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgbm8udHlwZSA9ICdidXR0b24nO1xuICAgICAgbm8uY2xhc3NOYW1lID0gJ2NvbmZpcm0tbm8nO1xuICAgICAgbm8uZGF0YXNldC50aXAgPSAnQ2FuY2VsIGRlbGV0ZSc7XG4gICAgICBuby5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIGRlbGV0ZScpO1xuICAgICAgbm8uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgICAgbm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyB9KTtcbiAgICAgIGIucmVwbGFjZVdpdGgoeWVzKTtcbiAgICAgIHllcy5hZnRlcihubyk7XG4gICAgICByZXZlcnRUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHJldmVydCwgODAwMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZW50ZXJGZWVkYmFja0VkaXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogRmVlZGJhY2tNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5leHQuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayBlZGl0aW5nJztcbiAgICBpZiAoZGl2LmNsYXNzTGlzdC5jb250YWlucygndGhyZWFkZWQnKSkgbmV4dC5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIG5leHQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgbmV4dC5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgIGluaXRpYWw6IG0udGV4dCxcbiAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGRpdi5yZXBsYWNlV2l0aChkaXYuY2xvbmVOb2RlKHRydWUpKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvblN1Ym1pdDogKHRleHQpID0+IHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkID09PSBtLnRleHQpIHsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLnRleHQgPSB0cmltbWVkO1xuICAgICAgICAvLyBTZXZlcml0eSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFVJLiBTdHJpcCBhbnkgbGVnYWN5IHZhbHVlXG4gICAgICAgIC8vIHRoYXQgY2FtZSBiYWNrIGZyb20gYW4gb2xkZXIgSlNPTkwgaW1wb3J0IHNvIHNhdmVzIGRvbid0IGtlZXBcbiAgICAgICAgLy8gcmUtZW1pdHRpbmcgaXQuXG4gICAgICAgIGRlbGV0ZSAobSBhcyBhbnkpLnNldmVyaXR5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICB9KSk7XG4gICAgZGl2LnJlcGxhY2VXaXRoKG5leHQpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZU1lc3NhZ2UgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5pZCAhPT0gaWQpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0RlbGV0ZWQnKTtcbiAgICB9O1xuICAgIGlmICghZWwpIHsgZmluaXNoKCk7IHJldHVybjsgfVxuICAgIGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdyZW1vdmluZycpO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpOiB2b2lkID0+IHsgaWYgKGRvbmUpIHJldHVybjsgZG9uZSA9IHRydWU7IGZpbmlzaCgpOyB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBjbGVhbnVwLCB7b25jZTogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoY2xlYW51cCwgMzgwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQ29tcG9zZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRGZWVkYmFjayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gY29tcG9zZXIudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBpbi1tZW1vcnkgbWVzc2FnZSBhdCBjcmVhdGlvbiB0aW1lIHNvIHRoZVxuICAgIC8vIEZLIGlzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoLiBUaGUgc2xpbSBlbWl0IG5vIGxvbmdlciBoYXMgdG9cbiAgICAvLyBpbmZlciB0aGUgcGFyZW50IGZyb20gY2FwdHVyZS1hZGphY2VuY3ksIGFuZCBgbWFuaWZlc3QuY291bnRzYFxuICAgIC8vIGFjY3VyYXRlbHkgcmVmbGVjdHMgZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMuXG4gICAgLy8gV2FsayBiYWNrIHRvIHRoZSBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3RvciBiZWZvcmUgc3BsaWNlLlxuICAgIGxldCBwSWR4ID0gcG9zaXRpb24gLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfSk7XG4gICAgY29tcG9zZXIudmFsdWUgPSAnJztcbiAgICB1cGRhdGVDb21wb3Nlck1ldGVyKCk7XG4gICAgLy8gU2VuZGluZyBjbGVhcnMgYW55IGFjdGl2ZSB2aXN1YWwgZmluZCBzbyB0aGUgbmV3IGNvbW1lbnQgaXNuJ3QgaGlkZGVuXG4gICAgLy8gYmVoaW5kIGEgc3RhbGUgZmlsdGVyLlxuICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnU2VudCcpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgLy8gQnVnICMyOiBmZWVkYmFjaydzIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAhcGFyZW50LmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudCBhcyBTZWxlY3Rvck1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgKGUpID0+IHtcbiAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIoKTtcbiAgICAgIGlmICghaGFuZGxlZCkgc2VuZEZlZWRiYWNrKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlQ29tcG9zZXJNZXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ID0gY29tcG9zZXIudmFsdWU7XG4gICAgY29tcFdvcmRzLnRleHRDb250ZW50ID0gU3RyaW5nKHdvcmRDb3VudCh0KSk7XG4gICAgY29tcFRva2Vucy50ZXh0Q29udGVudCA9IFN0cmluZyh0b2tlbkNvdW50KHQpKTtcbiAgICBjb21wb3Nlci5jbGFzc0xpc3QudG9nZ2xlKCdjbWQtbW9kZScsIC9ePi8udGVzdCh0LnRyaW0oKSkpO1xuICB9O1xuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHVwZGF0ZUNvbXBvc2VyTWV0ZXIpO1xuXG4gIC8vIOKUgOKUgCBIZWFkZXIgc2VhcmNoIOKGkiBjb21tYW5kIHBhbGV0dGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFRoZSBoZWFkZXIgc2VhcmNoIGFmZm9yZGFuY2Ugbm8gbG9uZ2VyIHJ1bnMgaXRzIG93biBmaWx0ZXI7IGNsaWNraW5nIG9yXG4gIC8vIGZvY3VzaW5nIGl0IG9wZW5zIHRoZSBDbWQrSyBjb21tYW5kIHBhbGV0dGUgKHdoaWNoIHNlYXJjaGVzIGNhcHR1cmVzIEFORFxuICAvLyBydW5zIGNvbW1hbmRzKS4gSXQncyBhIHJlYWRvbmx5IHRyaWdnZXIsIHNvIHdlIGp1c3Qgb3BlbiB0aGUgcGFsZXR0ZSBhbmRcbiAgLy8gZHJvcCBmb2N1cyBzbyB0aGUgcGFsZXR0ZSBpbnB1dCB0YWtlcyBvdmVyIGNsZWFubHkuXG4gIGNvbnN0IHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSByZXR1cm47XG4gICAgb3BlblBhbGV0dGUoKTtcbiAgICBzZWFyY2guYmx1cigpO1xuICB9O1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2goKTsgfVxuICB9KTtcblxuICAvLyDilIDilIAgQ3RybCtGIHZpc3VhbCBmaW5kIChpbi1saXN0IGZpbHRlciArIGhpZ2hsaWdodCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybjtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY29uc3QgZmlyc3RIaXQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnLnNlbGVjdG9yLnNlYXJjaC1oaXQnKTtcbiAgICAgIGlmIChmaXJzdEhpdCkge1xuICAgICAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGZpcnN0SGl0KTtcbiAgICAgICAgY29uc3QgbWsgPSBmaXJzdEhpdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignbWFyaycpO1xuICAgICAgICBpZiAobWspIGNlbnRlckVsZW1lbnRJbkxpc3QobWspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlyc3RNYXRjaCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cgbWFyaycpO1xuICAgICAgICBpZiAoZmlyc3RNYXRjaCkgY2VudGVyRWxlbWVudEluTGlzdChmaXJzdE1hdGNoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlRmluZENvdW50ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZENvdW50KSByZXR1cm47XG4gICAgZmluZENvdW50LnRleHRDb250ZW50ID0gc2VhcmNoUXVlcnkgPyBgJHtsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cnKS5sZW5ndGh9IG1hdGNoYCA6ICcnO1xuICB9O1xuICBjb25zdCBhcHBseUZpbmQgPSAodmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHNlYXJjaFF1ZXJ5ID0gdmFsdWUudHJpbSgpO1xuICAgIHJlbmRlcigpO1xuICAgIHVwZGF0ZUZpbmRDb3VudCgpO1xuICAgIHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3KCk7XG4gIH07XG4gIGNvbnN0IG9wZW5GaW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZEJhciB8fCAhZmluZElucHV0KSByZXR1cm47XG4gICAgZmluZEJhci5oaWRkZW4gPSBmYWxzZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LmFkZCgnZmluZC1vcGVuJyk7XG4gICAgZmluZElucHV0LmZvY3VzKCk7XG4gICAgZmluZElucHV0LnNlbGVjdCgpO1xuICB9O1xuICBjb25zdCBjbG9zZUZpbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGZpbmRCYXIpIGZpbmRCYXIuaGlkZGVuID0gdHJ1ZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LnJlbW92ZSgnZmluZC1vcGVuJyk7XG4gICAgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gJyc7XG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7IHNlYXJjaFF1ZXJ5ID0gJyc7IHJlbmRlcigpOyB9XG4gICAgdXBkYXRlRmluZENvdW50KCk7XG4gIH07XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiBhcHBseUZpbmQoZmluZElucHV0LnZhbHVlKSk7XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7IGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBjbG9zZUZpbmQoKTsgfSB9KTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZmluZC1jbGVhcl0nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUZpbmQpO1xuXG4gIGNvbnN0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgbSA9IC9ePlxccyooLispJC8uZXhlYyhjb21wb3Nlci52YWx1ZS50cmltKCkpO1xuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHNlbCA9IG1bMV0hLnRyaW0oKTtcbiAgICBpZiAoIXNlbCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbn0+KHtraW5kOiAnbWFudWFsLWNhcHR1cmUnLCBzZWxlY3Rvcjogc2VsfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgeyBjb21wb3Nlci52YWx1ZSA9ICcnOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IHNldFN0YXR1cygnQ2FwdHVyZWQgJyArIHNlbCk7IH1cbiAgICBlbHNlIHNldFN0YXR1cygnU2VsZWN0b3IgZGlkIG5vdCBtYXRjaDogJyArIHNlbCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBFeHBvcnQgYnVpbGRlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHYyIGV4cG9ydCBzaGFwZTogdG9wIGxldmVsIGtlZXBzIHVzZXItZmFjaW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkc1xuICAvLyAodWlkLCBuLCBzZWxlY3RvciwgdGV4dCwgcm9sZSwgYXR0cnMsIGhpbnRzLCBjbGFzc2VzLCBzdHlsZXMsIGNvbXBvbmVudCxcbiAgLy8gc3RhdGVzLCBzY3JlZW5zaG90LCBncm91cCkuIERpYWdub3N0aWMgLyBkZXRlY3Rpb24gbWV0YWRhdGEgbW92ZXMgdW5kZXJcbiAgLy8gYW4gYF9hdWRpdGAgbmFtZXNwYWNlIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIGluU2hhZG93RE9NLFxuICAvLyBwc2V1ZG9FbGVtZW50cywgbWF0Y2hlZFJ1bGVzLCB2aWV3cG9ydCkuIFRoZSB2ZXJzaW9uIG1hcmtlciBpcyBlbWl0dGVkXG4gIC8vIGFzIGB2OiAyYC4gSW1wb3J0ZXJzIGRldGVjdCBlaXRoZXIgdjEgKGZsYXQpIG9yIHYyIGFuZCBkZW5vcm1hbGl6ZS5cbiAgLy9cbiAgLy8gQWdncmVzc2l2ZSBtaW5pZnkgYWRkaXRpb25hbGx5IGRyb3BzIGZpZWxkcyB0aGUgc2VsZWN0b3IgYWxyZWFkeVxuICAvLyBpbXBsaWVzOiBhbmNlc3RvcnMsIHZpZXdwb3J0IChvbmUgcGVyIHBhZ2UpLCBjb21wb25lbnRSb290IHdoZW5cbiAgLy8gcmVkdW5kYW50IHdpdGggdGhlIHNlbGVjdG9yLCBhbmQgcHNldWRvRWxlbWVudHMuXG4gIGNvbnN0IHNsaW1FbnRyeSA9IChlOiBFbnRyeSwgb3B0czoge2luY2x1ZGVHcm91cD86IGJvb2xlYW47IGV2ZW50SW5kZXg/OiBudW1iZXI7IHZpc3VhbE9yZGVyPzogbnVtYmVyOyBncm91cFVpZD86IHN0cmluZ30gPSB7fSk6IFJlY29yZDxzdHJpbmcsIGFueT4gPT4ge1xuICAgIGNvbnN0IGluY2x1ZGVPdXRlciA9IHByZWZzLmluY2x1ZGVPdXRlckhUTUw7XG4gICAgY29uc3QgaW5jbHVkZU1hdGNoZWQgPSBwcmVmcy5pbmNsdWRlTWF0Y2hlZFJ1bGVzO1xuICAgIGNvbnN0IGluY2x1ZGVTdHlsZXMgPSBwcmVmcy5pbmNsdWRlU3R5bGVzO1xuICAgIGNvbnN0IG1pbmlmeSA9IHByZWZzLm1pbmlmeTtcblxuICAgIC8vIFRvcC1sZXZlbCB1c2VyLWZhY2luZyBmaWVsZHMuIE9yZGVyIG1hdHRlcnMgZm9yIG91dHB1dCByZWFkYWJpbGl0eSDigJRcbiAgICAvLyB3ZSB3YW50IGB2IC8gdHlwZSAvIHVpZCAvIG4gLyBzZWxlY3RvcmAgZmlyc3Qgc28gSlNPTkwgaXMgZ3JlcHBhYmxlLlxuICAgIC8vXG4gICAgLy8gYG5gIHN0YXlzIGFzIHRoZSBjYXB0dXJlLXNlcXVlbmNlIGRpc3BsYXkgbGFiZWwgZm9yIGJhY2t3YXJkc1xuICAgIC8vIGNvbXBhdGliaWxpdHkgd2l0aCB2MS92MiByZWFkZXJzIChhbmQgdGhlIHNpZGViYXIncyBcIiMzXCIgY2hpcHMpLlxuICAgIC8vIFRoZSBkaXNhbWJpZ3VhdGVkIGNvdXNpbnMgKGBjYXB0dXJlSW5kZXhgLCBgZXZlbnRJbmRleGAsXG4gICAgLy8gYHZpc3VhbE9yZGVyYCwgYGRpc3BsYXlMYWJlbGApIGxpdmUgb24gdGhlIHJvdyBzbyBhIGRvd25zdHJlYW1cbiAgICAvLyBhZ2VudCBjYW4gcGljayB3aGljaGV2ZXIgb3JkZXJpbmcgaXMgbWVhbmluZ2Z1bCDigJQgYnVnICMxMC5cbiAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICB2OiAyLFxuICAgICAgdHlwZTogJ3NlbGVjdG9yJyxcbiAgICAgIHVpZDogZS51aWQsXG4gICAgICBuOiBlLm4sXG4gICAgICB0czogZS50cyxcbiAgICAgIHVybDogZS51cmwsXG4gICAgICB0YWc6IGUudGFnLFxuICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsXG4gICAgICBjYXB0dXJlSW5kZXg6IGUubixcbiAgICAgIGRpc3BsYXlMYWJlbDogU3RyaW5nKGUubiksXG4gICAgfTtcbiAgICBpZiAob3B0cy5ldmVudEluZGV4ICE9PSB1bmRlZmluZWQpIG91dC5ldmVudEluZGV4ID0gb3B0cy5ldmVudEluZGV4O1xuICAgIGlmIChvcHRzLnZpc3VhbE9yZGVyICE9PSB1bmRlZmluZWQpIG91dC52aXN1YWxPcmRlciA9IG9wdHMudmlzdWFsT3JkZXI7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUudGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQudGV4dCA9IG1pbmlmeSA/IGUudGV4dC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS50ZXh0O1xuICAgIGlmIChlLnJvbGUgIT09IHVuZGVmaW5lZCkgb3V0LnJvbGUgPSBlLnJvbGU7XG4gICAgaWYgKGUuYWNjZXNzaWJsZU5hbWUgIT09IHVuZGVmaW5lZCkgb3V0LmFjY2Vzc2libGVOYW1lID0gbWluaWZ5ID8gZS5hY2Nlc3NpYmxlTmFtZS5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBpZiAoZS5pZCAhPT0gdW5kZWZpbmVkKSBvdXQuaWQgPSBlLmlkO1xuICAgIGlmIChlLnRlc3RJZCAhPT0gdW5kZWZpbmVkKSBvdXQudGVzdElkID0gZS50ZXN0SWQ7XG4gICAgaWYgKGUuY2xhc3NlcyAmJiBlLmNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICBvdXQuY2xhc3NlcyA9IChtaW5pZnkgJiYgZS5jbGFzc2VzLmxlbmd0aCA+IDgpID8gZS5jbGFzc2VzLnNsaWNlKDAsIDgpIDogZS5jbGFzc2VzO1xuICAgIH1cbiAgICBpZiAoZS5hdHRycyAmJiBPYmplY3Qua2V5cyhlLmF0dHJzKS5sZW5ndGgpIG91dC5hdHRycyA9IGUuYXR0cnM7XG4gICAgaWYgKGUuaGludHMgJiYgT2JqZWN0LmtleXMoZS5oaW50cykubGVuZ3RoKSBvdXQuaGludHMgPSBlLmhpbnRzO1xuICAgIGlmIChlLnJlY3QpIG91dC5yZWN0ID0gZS5yZWN0O1xuICAgIGlmIChlLnN0YXRlcyAmJiBlLnN0YXRlcy5sZW5ndGgpIG91dC5zdGF0ZXMgPSBlLnN0YXRlcztcbiAgICBpZiAoZS5jb21wb25lbnQpIG91dC5jb21wb25lbnQgPSBlLmNvbXBvbmVudDtcbiAgICAvLyBMb2NhdG9yLXF1YWxpdHkgZmllbGQuIFByb21vdGUgZXZlbiB3aGVuIG1pbmlmaWVkIOKAlCBpdCdzIGEgc2luZ2xlXG4gICAgLy8gc21hbGwgaW50IGFuZCBhIGRvd25zdHJlYW0gYWdlbnQgdXNlcyBpdCB0byBkZWNpZGUgd2hldGhlciB0b1xuICAgIC8vIHRydXN0IHRoZSBzZWxlY3Rvci5cbiAgICBpZiAoZS5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkgb3V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9IGUuc2VsZWN0b3JNYXRjaENvdW50O1xuICAgIGlmIChlLmExMXkpIG91dC5hMTF5ID0gZS5hMTF5O1xuICAgIGlmIChlLmFzc2V0cyAmJiBlLmFzc2V0cy5sZW5ndGgpIG91dC5hc3NldHMgPSBlLmFzc2V0cztcbiAgICBpZiAoZS5sYXlvdXRDb250ZXh0ICYmIGUubGF5b3V0Q29udGV4dC5sZW5ndGgpIG91dC5sYXlvdXRDb250ZXh0ID0gZS5sYXlvdXRDb250ZXh0O1xuICAgIGlmIChpbmNsdWRlT3V0ZXIgJiYgZS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb3V0Lm91dGVySFRNTCA9IG1pbmlmeSA/IGUub3V0ZXJIVE1MLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLm91dGVySFRNTDtcbiAgICB9XG4gICAgaWYgKGluY2x1ZGVTdHlsZXMgJiYgZS5zdHlsZXMgJiYgT2JqZWN0LmtleXMoZS5zdHlsZXMpLmxlbmd0aCkgb3V0LnN0eWxlcyA9IGUuc3R5bGVzO1xuICAgIGlmIChlLnNjcmVlbnNob3QpIHtcbiAgICAgIC8vIFBhdGggbm9ybWFsaXphdGlvbjogdGhlIGxpdmUgYGVudHJ5LnNjcmVlbnNob3QuZWxlbWVudGAgY2FycmllcyBhXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4ZWQgcGF0aCAoZS5nLiBgZGVmYXVsdC9zY3JlZW5zaG90cy9mb28ucG5nYClcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGJhY2tncm91bmQncyBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIEFQSSBzdGFtcHNcbiAgICAgIC8vIHRoZSB3b3Jrc3BhY2UgaW50byB0aGUgb24tZGlzayBwYXRoLiBCdXQgdGhlIC50YXIuenN0IGFyY2hpdmVcbiAgICAgIC8vIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZmxhdCBhdCBgc2NyZWVuc2hvdHMvZm9vLnBuZ2AsIHNvIHRoZVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeCB3b3VsZCByZXNvbHZlIHRvIG5vdGhpbmcgZm9yIGFuIGFnZW50IHRoYXRcbiAgICAgIC8vIGV4dHJhY3RlZCB0aGUgYXJjaGl2ZS4gU3RyaXAgdGhlIHdvcmtzcGFjZSBwcmVmaXggb24gZW1pdCBzb1xuICAgICAgLy8gZXZlcnkgcGF0aCBpcyB2YWxpZCByZWxhdGl2ZSB0byB0aGUgbWFuaWZlc3QncyBkZWNsYXJlZFxuICAgICAgLy8gYHBhdGhSb290YCAoYXJjaGl2ZSByb290IGZvciB0YXIuenN0OyB3b3Jrc3BhY2Ugcm9vdCBmb3IgcGxhaW5cbiAgICAgIC8vIEpTT05MIOKAlCBpLmUuLCBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICBjb25zdCBzdHJpcFdzID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGlmICghcCkgcmV0dXJuIHA7XG4gICAgICAgIC8vIFN0cmlwIGV4YWN0bHkgb25lIGxlYWRpbmcgYDx3b3Jrc3BhY2U+L2Agc2VnbWVudCBpZiBwcmVzZW50LlxuICAgICAgICBjb25zdCB3c1ByZWZpeCA9IGAke2FjdGl2ZVdzfS9gO1xuICAgICAgICByZXR1cm4gcC5zdGFydHNXaXRoKHdzUHJlZml4KSA/IHAuc2xpY2Uod3NQcmVmaXgubGVuZ3RoKSA6IHA7XG4gICAgICB9O1xuICAgICAgb3V0LnNjcmVlbnNob3QgPSB7Li4uZS5zY3JlZW5zaG90fTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5lbGVtZW50KSBvdXQuc2NyZWVuc2hvdC5lbGVtZW50ID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5lbGVtZW50KTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5ncm91cCkgb3V0LnNjcmVlbnNob3QuZ3JvdXAgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90Lmdyb3VwKTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5wYWdlKSBvdXQuc2NyZWVuc2hvdC5wYWdlID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5wYWdlKTtcbiAgICB9XG4gICAgLy8gUHJvbW90ZSBydW50aW1lL2JlaGF2aW9yIHNpZ25hbHMgdG8gdG9wLWxldmVsLiBUaGVzZSBhcmUgcHJpbWFyeVxuICAgIC8vIHNpZ25hbCBmb3IgdHJpYWdlIChldmVudHMgdGVsbHMgXCJ3aGljaCBoYW5kbGVyIHJhblwiLCBiZWhhdmlvckF0dHJzXG4gICAgLy8gdGVsbHMgXCJ3aGF0IHNlcnZlci1yZW5kZXJlZCBiaW5kaW5nIGRvZXMgdGhpcyBmaXJlXCIsIGNhbnZhc0NsaWNrXG4gICAgLy8gdGVsbHMgXCJ3aGVyZSBvbiB0aGUgY2hhcnQgd2FzIGNsaWNrZWRcIiwgZWRpdG9yIHRlbGxzIFwid2hpY2hcbiAgICAvLyByaWNoLXRleHQgbGlicmFyeSB3cmFwcyB0aGlzXCIsIGRvbU11dGF0aW9ucyB0ZWxscyBcIndoYXQgY2hhbmdlZFxuICAgIC8vIGJlZm9yZSB0aGUgY2xpY2tcIiwgaXNBbmltYXRpbmcgd2FybnMgYWJvdXQgdHJhbnNpZW50IHN0YXRlKS5cbiAgICBpZiAoZS5ldmVudHMgJiYgT2JqZWN0LmtleXMoZS5ldmVudHMpLmxlbmd0aCkgb3V0LmV2ZW50cyA9IGUuZXZlbnRzO1xuICAgIGlmIChlLmJlaGF2aW9yQXR0cnMgJiYgT2JqZWN0LmtleXMoZS5iZWhhdmlvckF0dHJzKS5sZW5ndGgpIG91dC5iZWhhdmlvckF0dHJzID0gZS5iZWhhdmlvckF0dHJzO1xuICAgIGlmIChlLmNhbnZhc0NsaWNrKSBvdXQuY2FudmFzQ2xpY2sgPSBlLmNhbnZhc0NsaWNrO1xuICAgIGlmIChlLmVkaXRvcikgb3V0LmVkaXRvciA9IGUuZWRpdG9yO1xuICAgIGlmIChlLmlzQW5pbWF0aW5nKSBvdXQuaXNBbmltYXRpbmcgPSB0cnVlO1xuICAgIGlmIChlLnNoYWRvd0hvc3QpIG91dC5zaGFkb3dIb3N0ID0gZS5zaGFkb3dIb3N0O1xuICAgIGlmIChlLnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQucmVuZGVyZWRUZXh0ID0gZS5yZW5kZXJlZFRleHQ7XG4gICAgaWYgKGUudHJ1bmNhdGVkICYmIE9iamVjdC5rZXlzKGUudHJ1bmNhdGVkKS5sZW5ndGgpIG91dC50cnVuY2F0ZWQgPSBlLnRydW5jYXRlZDtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS5kb21NdXRhdGlvbnMgJiYgZS5kb21NdXRhdGlvbnMubGVuZ3RoKSBvdXQuZG9tTXV0YXRpb25zID0gZS5kb21NdXRhdGlvbnM7XG5cbiAgICAvLyBfYXVkaXQ6IGRldGVjdGlvbiBjaGFpbiAmIGRpYWdub3N0aWMgc2hhcGUuXG4gICAgLy8gUkVBRE1FIGNsYWltZWQgYF9hdWRpdC5hbmNlc3RvcnNgIGFuZCBgX2F1ZGl0LmNvbXBvbmVudFJvb3RgIHdlcmVcbiAgICAvLyBhbHdheXMgcHJlc2VudCwgYnV0IHRoZSBzbGltIGVtaXQgZHJvcHBlZCB0aGVtIHdoZW5ldmVyXG4gICAgLy8gYG1pbmlmeTogdHJ1ZWAuIFRoZSBmaXg6IGVtaXQgZXZlcnkgZGVjbGFyZWQgYF9hdWRpdGAgZmllbGRcbiAgICAvLyB3aGVuZXZlciB0aGUgc291cmNlIGRhdGEgZXhpc3RzLCBhbmQgbGV0XG4gICAgLy8gYG1pbmlmeWAgc2xpbSBPTkxZIHRoZSBoaWdoLXZvbHVtZSBibG9ja3MgKG1hdGNoZWRSdWxlcyxcbiAgICAvLyBwc2V1ZG9FbGVtZW50cykuIFNtYWxsIHN0cnVjdHVyYWwgbWV0YWRhdGEgKGFuY2VzdG9ycyxcbiAgICAvLyBjb21wb25lbnRSb290LCB2aWV3cG9ydCkgc3Vydml2ZXMgbWluaWZ5IHNvIHRoZSBzY2hlbWEgY2xhaW1zXG4gICAgLy8gc3RheSBob25lc3QuXG4gICAgY29uc3QgYXVkaXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAoZS5hbmNlc3RvcnMgJiYgZS5hbmNlc3RvcnMubGVuZ3RoKSBhdWRpdC5hbmNlc3RvcnMgPSBlLmFuY2VzdG9ycztcbiAgICBpZiAoZS5jb21wb25lbnRSb290ICE9PSB1bmRlZmluZWQpIGF1ZGl0LmNvbXBvbmVudFJvb3QgPSBlLmNvbXBvbmVudFJvb3Q7XG4gICAgaWYgKGUuaW5TaGFkb3dET00pIGF1ZGl0LmluU2hhZG93RE9NID0gdHJ1ZTtcbiAgICBpZiAoZS5wc2V1ZG9FbGVtZW50cyAmJiBPYmplY3Qua2V5cyhlLnBzZXVkb0VsZW1lbnRzKS5sZW5ndGggJiYgIW1pbmlmeSkgYXVkaXQucHNldWRvRWxlbWVudHMgPSBlLnBzZXVkb0VsZW1lbnRzO1xuICAgIGlmIChpbmNsdWRlTWF0Y2hlZCAmJiBlLm1hdGNoZWRSdWxlcyAmJiBlLm1hdGNoZWRSdWxlcy5sZW5ndGgpIHtcbiAgICAgIGF1ZGl0Lm1hdGNoZWRSdWxlcyA9IG1pbmlmeVxuICAgICAgICA/IGUubWF0Y2hlZFJ1bGVzLm1hcCgocikgPT4ge1xuICAgICAgICAgIGNvbnN0IHIyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge3NlbGVjdG9yOiByLnNlbGVjdG9yfTtcbiAgICAgICAgICBpZiAoci5kZWNsYXJhdGlvbnMgJiYgT2JqZWN0LmtleXMoci5kZWNsYXJhdGlvbnMpLmxlbmd0aCkgcjIuZGVjbGFyYXRpb25zID0gci5kZWNsYXJhdGlvbnM7XG4gICAgICAgICAgaWYgKHIubWVkaWEpIHIyLm1lZGlhID0gci5tZWRpYTtcbiAgICAgICAgICByZXR1cm4gcjI7XG4gICAgICAgIH0pXG4gICAgICAgIDogZS5tYXRjaGVkUnVsZXM7XG4gICAgfVxuICAgIGlmIChlLnZpZXdwb3J0KSBhdWRpdC52aWV3cG9ydCA9IGUudmlld3BvcnQ7XG4gICAgaWYgKE9iamVjdC5rZXlzKGF1ZGl0KS5sZW5ndGgpIG91dC5fYXVkaXQgPSBhdWRpdDtcblxuICAgIC8vIEdyb3VwIGhlYWQgbGlua2FnZS4gUHJldmlvdXNseSB0aGUgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGBcbiAgICAvLyBjYXJyaWVkIGZ1bGwgbmVzdGVkIGVudHJ5IG9iamVjdHMuXG4gICAgLy8gVGhhdCBtYWRlIER1Y2tEQiBqb2lucyB1Z2x5IGFuZCBicm9rZSB0aGUgcnVsZSB0aGF0IGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3Igc2hvdWxkIGJlIGEgdG9wLWxldmVsIHJvdy4gV2Ugbm93IGVtaXQ6XG4gICAgLy8gICDigKIgb24gdGhlIGdyb3VwIGhlYWQ6IGBncm91cE1lbWJlclVpZHM6IFt1aWQsIHVpZCwgLi4uXWAgKGp1c3QgSURzKVxuICAgIC8vICAg4oCiIGVhY2ggbWVtYmVyIGFzIGl0cyBvd24gdG9wLWxldmVsIHNsaW0gcm93IHdpdGggYGdyb3VwVWlkYFxuICAgIC8vICAgICBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkIChoYW5kbGVkIGluIGBidWlsZFNsaW1gIGZsdXNoIGxvZ2ljKS5cbiAgICBpZiAob3B0cy5pbmNsdWRlR3JvdXAgJiYgZS5ncm91cCAmJiBlLmdyb3VwLmxlbmd0aCkge1xuICAgICAgb3V0Lmdyb3VwTWVtYmVyVWlkcyA9IGUuZ3JvdXAubWFwKChnKSA9PiBnLnVpZCkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cbiAgICBpZiAob3B0cy5ncm91cFVpZCkgb3V0Lmdyb3VwVWlkID0gb3B0cy5ncm91cFVpZDtcblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTaGFyZWQgXCJzbGltIGRhdGFcIiBwaXBlbGluZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gSlNPTkwgcmVuZGVycyBvZmYgdGhpcyBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb24uIChNYXJrZG93biB1c2VkIHRvXG4gIC8vIHNoYXJlIGl0OyB0aGUgTWFya2Rvd24gZXhwb3J0IHdhcyByZXRpcmVkIGluIGZhdm9yIG9mIEpTT05MLW9ubHkuKVxuICAvL1xuICAvLyB2MiBkaWZmZXJlbmNlcyB2cyB2MTpcbiAgLy8gICDigKIgU2VsZWN0b3IgbGluZXMgaGF2ZSBleHBsaWNpdCBgdHlwZTogJ3NlbGVjdG9yJ2AgYW5kIGB2OiAyYC5cbiAgLy8gICDigKIgX2F1ZGl0IG5lc3RzIGRldGVjdGlvbiAvIGRlYnVnIGZpZWxkcyAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCDigKYpLlxuICAvLyAgIOKAoiBGZWVkYmFjayBlbWl0cyBhcyBzdGFuZGFsb25lIGB7dHlwZTonZmVlZGJhY2snLCBwYXJlbnRVaWQsIOKApn1gIGxpbmVzXG4gIC8vICAgICBQTFVTIGJ1bmRsZWQgYGZlZWRiYWNrYCBhcnJheXMgb24gc2VsZWN0b3JzIChzbyBvbGQgc2luZ2xlLWxpbmVcbiAgLy8gICAgIHJlYWRlcnMgc3RpbGwgc2VlIHRoZW0gYWRqYWNlbnQpLlxuICAvLyAgIOKAoiBBIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBjYXJyaWVzIHdvcmtzcGFjZSArIGNvdW50cyArIGZpbGVuYW1lLlxuICB0eXBlIFNsaW1QYWdlID0ge3Y6IDI7IHR5cGU6ICdwYWdlJzsgdHM6IHN0cmluZzsgdXJsOiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nOyB2aWV3cG9ydD86IFZpZXdwb3J0OyB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyB1c2VyQWdlbnQ/OiBzdHJpbmc7IGxhbmc/OiBzdHJpbmc7IGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTsgcm91dGU/OiBhbnk7IHN0YXRlPzogYW55OyBzZXNzaW9uSWQ/OiBzdHJpbmc7IHNuYXBzaG90PzogUGFnZVNuYXBzaG90fTtcbiAgLy8gU2V2ZXJpdHkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgKDIwMjYtMDUpLiBUb2xlcmFudCByZWFkZXJzIG1heSBzdGlsbFxuICAvLyBzZWUgYHNldmVyaXR5YCBvbiBsZWdhY3kgSlNPTkwg4oCUIGRlbm9ybWFsaXplRW50cnkgcHJlc2VydmVzIGl0IG9uXG4gIC8vIEZlZWRiYWNrTWVzc2FnZSBzbyByZS1leHBvcnQgcm91bmQtdHJpcHMsIGJ1dCBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0XG4gIC8vIGl0IGFuZCB3ZSBkb24ndCBlbWl0IGl0IGhlcmUuIEtlZXAgdGhlIGZpZWxkIG9mZiBTbGltRmVlZGJhY2sgc28gbmV3XG4gIC8vIGV4cG9ydHMgc3RheSBjbGVhbi5cbiAgLy8gYHRhZ3NgIGlzIGFsd2F5cyBlbWl0dGVkIChkZWZhdWx0IGVtcHR5IGFycmF5KSBzbyBEdWNrREIgc2NoZW1hXG4gIC8vIGluZmVyZW5jZSBhbHdheXMgc2VlcyB0aGUgY29sdW1uLlxuICB0eXBlIFNsaW1GZWVkYmFjayA9IHt2OiAyOyB0eXBlOiAnZmVlZGJhY2snOyB1aWQ6IHN0cmluZzsgdHM6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmc7IHRhZ3M6IHN0cmluZ1tdOyBpc1Rlc3REYXRhPzogYm9vbGVhbn07XG4gIC8vIENoZWFwIHRlc3QtZGF0YSBzbmlmZjogbWF0Y2hlcyBzdHJpbmdzIHRoZSB1c2VyIHR5cGVzIHdoaWxlIHNtb2tlLVxuICAvLyB0ZXN0aW5nIHRoZSBleHRlbnNpb24gKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIiwgXCJsb3JlbSBpcHN1bVwiLFxuICAvLyBcInBsYWNlaG9sZGVyXCIsIG9yIGFueSBwaHJhc2Ugb2J2aW91c2x5IHN0dWJiZWQtb3V0KS4gRmFsc2UgcG9zaXRpdmVzXG4gIC8vIGhlcmUgYXJlIHJlY292ZXJhYmxlIOKAlCB0aGUgY29uc3VtZXIgY2FuIGlnbm9yZSB0aGUgZmxhZyDigJQgYnV0XG4gIC8vIGV4Y2x1ZGluZyByZWFsIGZlZWRiYWNrIHdvdWxkIG5vdCBiZSwgc28gd2Uga2VlcCB0aGUgcmVnZXggbmFycm93LlxuICBjb25zdCBURVNUX0RBVEFfUkUgPSAvXih0ZXN0fGFzZGZ8cXdlcnxmb298YmFyfGJhenxsb3JlbXxwbGFjZWhvbGRlcnx0b2RvfHh7Myx9fGhlbGxvIHdvcmxkfHNhbXBsZXxkdW1teXxzb21ldGhpbmd8YW55dGhpbmd8aWdub3JlIG1lfHdpcHx0YmR8blxcL2F8aGkpXFxiL2k7XG4gIGNvbnN0IGxvb2tzTGlrZVRlc3REYXRhID0gKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRyaW0oKTtcbiAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoVEVTVF9EQVRBX1JFLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIGlmICgvdGVzdCBmZWVkYmFjay9pLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgdHlwZSBTbGltU2VsZWN0b3IgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+ICYge3Y6IDI7IHR5cGU6ICdzZWxlY3Rvcic7IG46IG51bWJlcjsgc2VsZWN0b3I6IHN0cmluZzsgZmVlZGJhY2s/OiBzdHJpbmdbXX07XG4gIHR5cGUgU2xpbUxpbmUgPSBTbGltUGFnZSB8IFNsaW1GZWVkYmFjayB8IFNsaW1TZWxlY3RvcjtcbiAgY29uc3QgYnVpbGRTbGltID0gKCk6IFNsaW1MaW5lW10gPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBTbGltTGluZVtdID0gW107XG4gICAgLy8gUHJlLWNvbXB1dGUgdmlzdWFsT3JkZXIgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KSBmb3IgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBtZXNzYWdlLiBUaGUgcHJldmlvdXMgc2luZ2xlIGBuYCBmaWVsZCBjb25mbGF0ZWRcbiAgICAvLyBjYXB0dXJlIG9yZGVyLCBKU09OTCBzdHJlYW0gb3JkZXIsXG4gICAgLy8gdmlzdWFsIG9yZGVyLCBhbmQgZGlzcGxheSBsYWJlbC4gV2Ugbm93IGVtaXQgZm91ciBvcnRob2dvbmFsXG4gICAgLy8gZmllbGRzIGFuZCBkb2N1bWVudCBlYWNoOlxuICAgIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHRoZSBvcmlnaW5hbCBgbmAgKGNhcHR1cmUgc2VxdWVuY2UpXG4gICAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCBzb3J0IGJ5IHJlY3QueSBhc2MsIHJlY3QueCBhc2NcbiAgICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIHRoZSBodW1hbi1mYWNpbmcgbnVtYmVyIHNob3duIGluIHRoZSBzaWRlYmFyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIChjdXJyZW50bHkgbWlycm9ycyBjYXB0dXJlSW5kZXg7IGNhbiBkcmlmdCBpZlxuICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGUgc2lkZWJhciBhZG9wdHMgYSBkaWZmZXJlbnQgbGFiZWwgc2NoZW1lKS5cbiAgICBjb25zdCB2aXN1YWxSYW5rID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBjb25zdCBzZWxzID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAuc2xpY2UoKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYXIgPSBhLmVudHJ5LnJlY3Q7IGNvbnN0IGJyID0gYi5lbnRyeS5yZWN0O1xuICAgICAgICBpZiAoIWFyIHx8ICFicikgcmV0dXJuIDA7XG4gICAgICAgIGlmIChhci55ICE9PSBici55KSByZXR1cm4gYXIueSAtIGJyLnk7XG4gICAgICAgIHJldHVybiBhci54IC0gYnIueDtcbiAgICAgIH0pO1xuICAgIHNlbHMuZm9yRWFjaCgobSwgaSkgPT4gdmlzdWFsUmFuay5zZXQobS5pZCwgaSArIDEpKTtcbiAgICBsZXQgcGVuZGluZ1NlbDogU2VsZWN0b3JNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gV2UgY29sbGVjdCBib3RoIHRoZSBidW5kbGVkIHN0cmluZyBhcnJheSAoZm9yIHYxLWZyaWVuZGx5IHJlYWRlcnMpIGFuZFxuICAgIC8vIHRoZSByaWNoIG9iamVjdHMgKGZvciB2MiBzdGFuZGFsb25lIGxpbmVzKS5cbiAgICBsZXQgcGVuZGluZ0ZiU3RyaW5nczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcGVuZGluZ0ZiUmljaDogU2xpbUZlZWRiYWNrW10gPSBbXTtcbiAgICBjb25zdCBmbHVzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGVuZGluZ1NlbCkgcmV0dXJuO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IGxpbmVzLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCB2aXN1YWxPcmRlciA9IHZpc3VhbFJhbmsuZ2V0KHBlbmRpbmdTZWwuaWQpO1xuICAgICAgY29uc3Qgb3V0OiBhbnkgPSBzbGltRW50cnkocGVuZGluZ1NlbC5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZSwgZXZlbnRJbmRleCwgdmlzdWFsT3JkZXJ9KTtcbiAgICAgIGlmIChwZW5kaW5nRmJTdHJpbmdzLmxlbmd0aCkgb3V0LmZlZWRiYWNrID0gWy4uLnBlbmRpbmdGYlN0cmluZ3NdO1xuICAgICAgbGluZXMucHVzaChvdXQgYXMgU2xpbUxpbmUpO1xuICAgICAgLy8gR3JvdXAgZmxhdG5lc3MgKGJ1ZyAjOSkuIEVtaXQgZWFjaCBncm91cCBtZW1iZXIgYXMgaXRzIG93blxuICAgICAgLy8gdG9wLWxldmVsIHNsaW0gcm93IHJpZ2h0IGFmdGVyIHRoZSBoZWFkLCB3aXRoIGBncm91cFVpZGBcbiAgICAgIC8vIGxpbmtpbmcgYmFjay4gVGhpcyBsZXRzIER1Y2tEQiAvIFNRTCBxdWVyaWVzIHRyZWF0IGdyb3VwXG4gICAgICAvLyBtZW1iZXJzIGFzIGZpcnN0LWNsYXNzIHNlbGVjdG9yIHJvd3Mgd2l0aG91dCBkZXNjZW5kaW5nIGludG9cbiAgICAgIC8vIG5lc3RlZCBvYmplY3RzLlxuICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gcGVuZGluZ1NlbC5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGdyb3VwTWVtYmVycykge1xuICAgICAgICBjb25zdCBtRXZlbnQgPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgICBjb25zdCBtZW1iZXJSb3c6IGFueSA9IHNsaW1FbnRyeShtZW1iZXIsIHtpbmNsdWRlR3JvdXA6IGZhbHNlLCBldmVudEluZGV4OiBtRXZlbnQsIGdyb3VwVWlkOiBwZW5kaW5nU2VsLmVudHJ5LnVpZH0pO1xuICAgICAgICBsaW5lcy5wdXNoKG1lbWJlclJvdyBhcyBTbGltTGluZSk7XG4gICAgICB9XG4gICAgICAvLyBFbWl0IGVhY2ggc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lIHJpZ2h0IGFmdGVyIHRoZSBzZWxlY3RvcihzKS5cbiAgICAgIGZvciAoY29uc3QgZmIgb2YgcGVuZGluZ0ZiUmljaCkgbGluZXMucHVzaChmYik7XG4gICAgICBwZW5kaW5nU2VsID0gbnVsbDtcbiAgICAgIHBlbmRpbmdGYlN0cmluZ3MgPSBbXTtcbiAgICAgIHBlbmRpbmdGYlJpY2ggPSBbXTtcbiAgICB9O1xuICAgIC8vIFJlb3JkZXIgZm9yIGV4cG9ydCBvbmx5IOKAlCBzaWRlYmFyIGtlZXBzIGNhcHR1cmUgb3JkZXIsIHRoZVxuICAgIC8vIGVtaXR0ZWQgSlNPTkwgcmVhZHMgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgd2l0aGluIGVhY2ggcGFnZS5cbiAgICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIHZpYSB0aGVcbiAgICAvLyBgcmVvcmRlckZvckV4cG9ydGAgaGVscGVyLCBzbyB0aHJlYWRpbmcgaXMgcHJlc2VydmVkIHRocm91Z2hcbiAgICAvLyB0aGUgcmVhcnJhbmdlbWVudC5cbiAgICBjb25zdCBleHBvcnRPcmRlcmVkID0gcmVvcmRlckZvckV4cG9ydChtZXNzYWdlcyk7XG4gICAgZm9yIChjb25zdCBtIG9mIGV4cG9ydE9yZGVyZWQpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaCgpO1xuICAgICAgICBjb25zdCBzbGltOiBTbGltUGFnZSA9IHt2OiAyLCB0eXBlOiAncGFnZScsIHRzOiBtLnRzLCB1cmw6IG0udXJsfTtcbiAgICAgICAgaWYgKG0udGl0bGUgIT09IHVuZGVmaW5lZCkgc2xpbS50aXRsZSA9IG0udGl0bGU7XG4gICAgICAgIGlmIChtLnZpZXdwb3J0KSBzbGltLnZpZXdwb3J0ID0gbS52aWV3cG9ydDtcbiAgICAgICAgaWYgKCFwcmVmcy5taW5pZnkgJiYgbS50b2tlbnMpIHNsaW0udG9rZW5zID0gbS50b2tlbnM7XG4gICAgICAgIGlmIChtLnVzZXJBZ2VudCkgc2xpbS51c2VyQWdlbnQgPSBtLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKG0ubGFuZykgc2xpbS5sYW5nID0gbS5sYW5nO1xuICAgICAgICBpZiAobS5naXRDb250ZXh0KSBzbGltLmdpdENvbnRleHQgPSBtLmdpdENvbnRleHQ7XG4gICAgICAgIGlmIChtLnJvdXRlKSBzbGltLnJvdXRlID0gbS5yb3V0ZTtcbiAgICAgICAgaWYgKG0uc3RhdGUpIHNsaW0uc3RhdGUgPSBtLnN0YXRlO1xuICAgICAgICBpZiAobS5zZXNzaW9uSWQpIHNsaW0uc2Vzc2lvbklkID0gbS5zZXNzaW9uSWQ7XG4gICAgICAgIC8vIEZ1bGwtcGFnZSBzbmFwc2hvdCAodmlld3BvcnQsIHNjcm9sbCBleHRlbnRzLCBkcHIsIGxhbmcsIHNjcmVlbnNob3QpXG4gICAgICAgIC8vIGNhcHR1cmVkIGZvciB0aGlzIFVSTC4gUGFydCBvZiB0aGUgZXhwb3J0IGRlbGl2ZXJhYmxlIHNvIGEgZG93bnN0cmVhbVxuICAgICAgICAvLyBhZ2VudCBoYXMgd2hvbGUtcGFnZSBjb250ZXh0LCBub3QganVzdCBlbGVtZW50IGNyb3BzLlxuICAgICAgICBjb25zdCBzbmFwID0gKG0gYXMgUGFnZU1lc3NhZ2UgJiB7c25hcHNob3Q/OiBQYWdlU25hcHNob3R9KS5zbmFwc2hvdDtcbiAgICAgICAgaWYgKHNuYXApIHNsaW0uc25hcHNob3QgPSBzbmFwO1xuICAgICAgICBsaW5lcy5wdXNoKHNsaW0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHsgZmx1c2goKTsgcGVuZGluZ1NlbCA9IG07IH1cbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAvLyBBbHdheXMgaW5jbHVkZSBgdGFnczogW11gIChldmVuIHdoZW4gZW1wdHkpIHNvIER1Y2tEQidzIHNjaGVtYVxuICAgICAgICAvLyBpbmZlcmVuY2UgcGlja3MgdGhlIGNvbHVtbiB1cC5cbiAgICAgICAgLy8gYHVpZGAgaXMgdGhlIG1lc3NhZ2UncyBzdGFibGUgaWQ6IFBScyAvIHJlcGFpciByZXBvcnRzIG5lZWRcbiAgICAgICAgLy8gYSBzdGFibGUgcGVyLWZlZWRiYWNrIGhhbmRsZSwgbm90IGp1c3QgcGFyZW50VWlkLlxuICAgICAgICBjb25zdCByaWNoOiBTbGltRmVlZGJhY2sgPSB7djogMiwgdHlwZTogJ2ZlZWRiYWNrJywgdWlkOiBtLmlkLCB0czogbS50cywgdGV4dDogbS50ZXh0LCB0YWdzOiBtLnRhZ3MgPz8gW119O1xuICAgICAgICAvLyAoc2V2ZXJpdHkgcmVtb3ZlZCAyMDI2LTA1IOKAlCBvbGQgSlNPTkxzIG1heSBzdGlsbCBjb250YWluIGl0XG4gICAgICAgIC8vIG9uIHRoZSByZWFkIHNpZGUsIGJ1dCB3ZSBubyBsb25nZXIgZW1pdCBpdCBvbiB3cml0ZS4pXG4gICAgICAgIC8vIEhldXJpc3RpYyBmbGFnIGZvciBzdHViLWxvb2tpbmcgZmVlZGJhY2sgKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIixcbiAgICAgICAgLy8gXCJIb3dkeSAsIHRlc3QgZmVlZGJhY2sgaGVyZVwiLCBldGMpLiBMZXRzIGEgZG93bnN0cmVhbSBjb25zdW1lclxuICAgICAgICAvLyBmaWx0ZXIgcG9sbHV0aW9uIGZyb20gcmVhbCBpbnRlbnQgd2l0aG91dCBtYW51YWwgY2xlYW51cC5cbiAgICAgICAgaWYgKGxvb2tzTGlrZVRlc3REYXRhKG0udGV4dCkpIHJpY2guaXNUZXN0RGF0YSA9IHRydWU7XG4gICAgICAgIGlmIChwZW5kaW5nU2VsKSB7XG4gICAgICAgICAgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZCA/PyBwZW5kaW5nU2VsLmVudHJ5LnVpZDtcbiAgICAgICAgICBwZW5kaW5nRmJTdHJpbmdzLnB1c2gobS50ZXh0KTtcbiAgICAgICAgICBwZW5kaW5nRmJSaWNoLnB1c2gocmljaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG0ucGFyZW50VWlkKSByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkO1xuICAgICAgICAgIGxpbmVzLnB1c2gocmljaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2goKTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH07XG4gIC8vIEJ1aWxkIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgb2YgdGhlIEpTT05MIGV4cG9ydC4gVGhlXG4gIC8vIG1hbmlmZXN0IGNhcnJpZXMgdGhlIGV4cG9ydCBmaWxlbmFtZSArIHdvcmtzcGFjZSArIGhvc3QocykgKyBjb3VudHMgc29cbiAgLy8gYSBkb3duc3RyZWFtIExMTSBjYW4gcmVzeW5jIHRoZSBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSBhbmQgZ3JlcCBmb3JcbiAgLy8gZHVwbGljYXRlcyBhY3Jvc3MgZXhwb3J0cy5cbiAgY29uc3QgYnVpbGRNYW5pZmVzdCA9IChmaWxlbmFtZTogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSk6IEV4cG9ydE1hbmlmZXN0ID0+IHtcbiAgICBsZXQgblNlbCA9IDA7IGxldCBuRmIgPSAwOyBsZXQgblBnID0gMDtcbiAgICBsZXQgbkdyb3VwTWVtYmVycyA9IDA7XG4gICAgbGV0IG5GZWVkYmFja0JlYXJpbmcgPSAwO1xuICAgIGxldCBuTWlzc2luZ1Nob3QgPSAwO1xuICAgIGxldCBuRWxlbWVudFNob3RzID0gMDtcbiAgICBsZXQgbkdyb3VwU2hvdHMgPSAwO1xuICAgIGxldCBuUGFnZVNob3RzID0gMDtcbiAgICBsZXQgbk9ycGhhbmVkRmIgPSAwO1xuICAgIGNvbnN0IHNlbGVjdG9yVWlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAvLyBGaXJzdCBwYXNzOiBjb2xsZWN0IHVpZHMgKyBwZXItc2VsZWN0b3IgZmVlZGJhY2sgcHJlc2VuY2UuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIG5TZWwrKztcbiAgICAgICAgc2VsZWN0b3JVaWRzLmFkZChtLmVudHJ5LnVpZCk7XG4gICAgICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIG5Hcm91cE1lbWJlcnMgKz0gbS5lbnRyeS5ncm91cC5sZW5ndGg7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIG5FbGVtZW50U2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5Hcm91cFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIG5QYWdlU2hvdHMrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIG5GYisrO1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuYWRkKG0ucGFyZW50VWlkKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIG5QZysrO1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzczogZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgKyBvcnBoYW5lZCBmZWVkYmFjayArXG4gICAgLy8gc2VsZWN0b3JzIHRoYXQgc2hvdWxkIGhhdmUgYSBzaG90IGJ1dCBkb24ndC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSB7XG4gICAgICAgIG5GZWVkYmFja0JlYXJpbmcrKztcbiAgICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5NaXNzaW5nU2hvdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIG5PcnBoYW5lZEZiKys7XG4gICAgfVxuICAgIGNvbnN0IG91dDogRXhwb3J0TWFuaWZlc3QgPSB7XG4gICAgICB2OiAyLCB0eXBlOiAnbWFuaWZlc3QnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICAgIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICBnZW5lcmF0ZWQ6IERhdGUubm93KCksXG4gICAgICB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBmb3JtYXQsXG4gICAgICBob3N0czogZGlzdGluY3RIb3N0cygpLFxuICAgICAgY291bnRzOiB7XG4gICAgICAgIC8vIFRvdGFsIHNlbGVjdG9yIHJvd3MgdGhlIEpTT05MIHdpbGwgZW1pdCA9IHRvcC1sZXZlbCArIGZsYXRcbiAgICAgICAgLy8gZ3JvdXAgbWVtYmVycy4gVGhpcyBtYXRjaGVzIHdoYXQgYSBkb3duc3RyZWFtXG4gICAgICAgIC8vIGByZWFkX2pzb25fYXV0byguLi4pYCB3b3VsZCBzZWU7IHRoZSBwcmV2aW91cyBiZWhhdmlvciBvZlxuICAgICAgICAvLyByZXBvcnRpbmcgb25seSB0aGUgaW4tbWVtb3J5IHRvcC1sZXZlbCBjb3VudCBjb250cmFkaWN0ZWRcbiAgICAgICAgLy8gdGhlIGFjdHVhbCBzdHJlYW0uXG4gICAgICAgIHNlbGVjdG9yczogblNlbCArIG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIGZlZWRiYWNrOiBuRmIsXG4gICAgICAgIHBhZ2VzOiBuUGcsXG4gICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczogbkZlZWRiYWNrQmVhcmluZyxcbiAgICAgICAgZ3JvdXBNZW1iZXJzOiBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IG5FbGVtZW50U2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IG5Hcm91cFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IG5QYWdlU2hvdHMsXG4gICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiBuTWlzc2luZ1Nob3QsXG4gICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IG5PcnBoYW5lZEZiLFxuICAgICAgfSxcbiAgICAgIC8vIFNpbmdsZSBjYW5vbmljYWwgcmVzb2x1dGlvbiBydWxlLiBFdmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTFxuICAgICAgLy8gKHNjcmVlbnNob3QuZWxlbWVudC9ncm91cC9wYWdlKSBpcyByZWxhdGl2ZSB0byBgcGF0aFJvb3RgOlxuICAgICAgLy8gICDigKIgJ2FyY2hpdmUnOiBmb3IgdGFyLnpzdCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlXG4gICAgICAvLyAgICAgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdCAoZS5nLiBgc2NyZWVuc2hvdHMvZm9vLnBuZ2ApLlxuICAgICAgLy8gICDigKIgJ3dvcmtzcGFjZSc6IGZvciBwbGFpbiBKU09OTCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG9cbiAgICAgIC8vICAgICB0aGUgd29ya3NwYWNlIGRpciAoYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgLy8gUmVjZWl2ZXJzIG5vIGxvbmdlciBoYXZlIHRvIGd1ZXNzIHdoaWNoIHBhdGggc2hhcGUgYXBwbGllcy5cbiAgICAgIHBhdGhSb290OiBmb3JtYXQgPT09ICd0YXIuenN0JyA/ICdhcmNoaXZlJyA6ICd3b3Jrc3BhY2UnLFxuICAgIH07XG4gICAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlcnMgc28gYSBkb3duc3RyZWFtIGFnZW50IGtub3dzIHdoaWNoIFVJIHNraWxsXG4gICAgLy8gb3ducyB0aGUgdHJpYWdlIGZsb3cgKyB3aGljaCBERVNJR04ubWQgb3ducyB0aGUgdmlzdWFsIGlkZW50aXR5LlxuICAgIC8vXG4gICAgLy8gYGlubGluZTogdHJ1ZWAgaXMgc2V0IE9OTFkgZm9yIHRhci56c3QgZXhwb3J0cyAod2hlcmUgdGhlIC5tZFxuICAgIC8vIGZpbGVzIGFyZSBwaHlzaWNhbGx5IGJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSkuIEpTT05MLW9ubHlcbiAgICAvLyBleHBvcnRzIGVtaXQgYGlubGluZTogZmFsc2VgIHBsdXMgdGhlIHJlY2VpdmVyLXNpZGUgYHBhdGhgIHNvXG4gICAgLy8gYSBjb25zdW1lciBwYWlyZWQgd2l0aCB0aGUgc3RhbmRhbG9uZSBKU09OTCBjYW4gcmVzb2x2ZSB0aGVcbiAgICAvLyByZWZlcmVuY2VkIGZpbGUgb2ZmIHRoZWlyIG93biBmaWxlc3lzdGVtLlxuICAgIC8vXG4gICAgLy8gYHRlbXBsYXRlOiB0cnVlYCBmbGFncyB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKAlCB1c2VmdWxcbiAgICAvLyBmb3IgcmVjZWl2ZXJzIHdobyB3YW50IHRvIGRpc3Rpbmd1aXNoIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50XG4gICAgLy8gZnJvbSB0aGUgdXNlcidzIGFjdHVhbCB3b3JraW5nIG5vdGVzLlxuICAgIGNvbnN0IGlzVGFyQnVuZGxlID0gZm9ybWF0ID09PSAndGFyLnpzdCc7XG4gICAgb3V0LnNraWxsID0ge1xuICAgICAgbmFtZTogJ1BpbmNoR3JhYicsXG4gICAgICBwYXRoOiBwcmVmcy5za2lsbFBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuc2tpbGwuYXJjaGl2ZVBhdGggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgb3V0LnNraWxsLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5za2lsbC5jdXN0b21pemVkID0gdHJ1ZTtcbiAgICBvdXQuZGVzaWduID0ge1xuICAgICAgcGF0aDogcHJlZnMuZGVzaWduUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5kZXNpZ24uYXJjaGl2ZVBhdGggPSAnREVTSUdOLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIG91dC5kZXNpZ24udGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LmRlc2lnbi5jdXN0b21pemVkID0gdHJ1ZTtcblxuICAgIC8vIFNlbGYtcm9hc3QgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IEV4cG9ydERpYWdub3N0aWNbXSA9IFtdO1xuICAgIC8vIEZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzIHdpdGggbm8gc2NyZWVuc2hvdC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnRkVFREJBQ0tfUEFSRU5UX01JU1NJTkdfU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciAke20uZW50cnkuc2VsZWN0b3J9IGNhcnJpZXMgZmVlZGJhY2sgYnV0IGhhcyBubyBlbGVtZW50L2dyb3VwIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3JwaGFuZWQgZmVlZGJhY2sgKHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUpLlxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICBjb2RlOiAnT1JQSEFORURfRkVFREJBQ0snLFxuICAgICAgICAgIHVpZDogZmJVaWQsXG4gICAgICAgICAgZGV0YWlsOiAnZmVlZGJhY2sgcm93IHJlZmVyZW5jZXMgYSBwYXJlbnRVaWQgdGhhdCBoYXMgbm8gbWF0Y2hpbmcgc2VsZWN0b3IgaW4gdGhpcyBhcmNoaXZlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEhvdmVyLXN0YXRlIGNhcHR1cmVzIHVzdWFsbHkgbmVlZCBhIGJlZm9yZS9hZnRlcjsgZmxhZyBhbnkgd2hvc2VcbiAgICAvLyBzY3JlZW5zaG90IHN0b3J5IGlzIGluY29tcGxldGUgKGJ1ZyAjMTYgcGFydGlhbCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnN0YXRlcyAmJiBtLmVudHJ5LnN0YXRlcy5pbmNsdWRlcygnaG92ZXInKSAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0hPVkVSX1NUQVRFX05PX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgY2FwdHVyZWQgaW4gOmhvdmVyIHN0YXRlIGJ1dCBoYXMgbm8gc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBMTF5OiBmbGFnIGZhaWxpbmcgY29udHJhc3QgKGJ1ZyAjMTUgZm9sbG93LXRocm91Z2gpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5hMTF5Py5jb250cmFzdFBhc3NlcyA9PT0gJ2ZhaWwnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0NPTlRSQVNUX0JFTE9XX0FBJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHRleHQgY29udHJhc3QgcmF0aW8gJHttLmVudHJ5LmExMXkuY29udHJhc3RSYXRpbyA/PyAnPyd9IGlzIGJlbG93IFdDQUcgQUFgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aCkgb3V0LmV4cG9ydERpYWdub3N0aWNzID0gZGlhZ25vc3RpY3M7XG5cbiAgICAvLyBCdWlsZCBpZGVudGl0eS4gUHVsbCBmcm9tIHRoZSBtb3N0IHJlY2VudCBwYWdlIHJvdydzIGdpdENvbnRleHRcbiAgICAvLyAoc291cmNlZCB2aWEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIj5gIG9uIHRoZSBjYXB0dXJlZCBhcHApXG4gICAgLy8gcGx1cyB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLiBPbWl0IHRoZSBibG9jayBlbnRpcmVseVxuICAgIC8vIHdoZW4gbmVpdGhlciBpcyBhdmFpbGFibGUuXG4gICAgY29uc3QgbGFzdFBhZ2UgPSBbLi4ubWVzc2FnZXNdLnJldmVyc2UoKS5maW5kKChtKSA9PiBtLnR5cGUgPT09ICdwYWdlJykgYXMgUGFnZU1lc3NhZ2UgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgZ2l0ID0gbGFzdFBhZ2U/LmdpdENvbnRleHQ7XG4gICAgY29uc3QgZXh0VmVyID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldE1hbmlmZXN0ID8gY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIGlmIChnaXQgfHwgZXh0VmVyKSB7XG4gICAgICBvdXQuYnVpbGQgPSB7fTtcbiAgICAgIGlmIChleHRWZXIpIG91dC5idWlsZC5leHRlbnNpb25WZXJzaW9uID0gZXh0VmVyO1xuICAgICAgaWYgKGdpdD8uY29tbWl0KSBvdXQuYnVpbGQuY29tbWl0ID0gZ2l0LmNvbW1pdDtcbiAgICAgIGlmIChnaXQ/LmJyYW5jaCkgb3V0LmJ1aWxkLmJyYW5jaCA9IGdpdC5icmFuY2g7XG4gICAgICBpZiAoZ2l0Py5idWlsZCkgb3V0LmJ1aWxkLmRlcGxveUJ1aWxkID0gZ2l0LmJ1aWxkO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCBidWlsZEpzb25sID0gKGZpbGVuYW1lRm9yTWFuaWZlc3Q/OiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddID0gJ2pzb25sJyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlbmFtZUZvck1hbmlmZXN0ID8/IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSBidWlsZE1hbmlmZXN0KGZpbGVuYW1lLCBmb3JtYXQpO1xuICAgIGNvbnN0IGxpbmVzID0gYnVpbGRTbGltKCk7XG4gICAgaWYgKCFsaW5lcy5sZW5ndGgpIHtcbiAgICAgIC8vIEV2ZW4gYW4gZW1wdHkgd29ya3NwYWNlIGdldHMgYSBtYW5pZmVzdCBsaW5lIHNvIGRvd25zdHJlYW0gdG9vbHNcbiAgICAgIC8vIGNhbiB2ZXJpZnkgdGhlIGZpbGUgd2FzIGdlbmVyYXRlZCBieSBQaW5jaEdyYWIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpICsgJ1xcbic7XG4gICAgfVxuICAgIHJldHVybiBbSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLCAuLi5saW5lcy5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKV0uam9pbignXFxuJykgKyAnXFxuJztcbiAgfTtcbiAgY29uc3QgZG93bmxvYWRGaWxlID0gKGNvbnRlbnQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZSA9ICd0ZXh0L3BsYWluJyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2NvbnRlbnRdLCB7dHlwZTogbWltZX0pKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCBvbkNvcHlBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBpZiAodGV4dC50cmltKCkuc3BsaXQoJ1xcbicpLmxlbmd0aCA8PSAxICYmICFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIC8vIE1hbmlmZXN0LW9ubHkgb3V0cHV0IGZvciBhbiBlbXB0eSB3b3Jrc3BhY2Ugc2hvdWxkbid0IHByZXRlbmQgdG8gYmUgYSBjb3B5LlxuICAgICAgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGNvcHknLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgc2V0U3RhdHVzKGBDb3BpZWQgSlNPTkwgwrcgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gICAgc2hvd0NvcGllZCgnQ29waWVkIEpTT05MJywgYCR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICB9O1xuICAvLyBTYXZlIHRocm91Z2ggdGhlIGJhY2tncm91bmQncyBmaWxlIGJyaWRnZSBpZiB3ZSdyZSBpbiBhbiBleHRlbnNpb25cbiAgLy8gY29udGV4dCwgc28gdGhlIGZpbGUgbGFuZHMgdW5kZXIgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9leHBvcnRzLy5cbiAgLy8gT3RoZXJ3aXNlICh0ZXN0IHBhZ2UsIGRldiBzZXJ2ZXIpLCBmYWxsIGJhY2sgdG8gYSBzeW50aGV0aWMgYmxvYiBVUkwuXG4gIGNvbnN0IHNhdmVFeHBvcnRUb0Rpc2sgPSBhc3luYyAodGV4dDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lOiBzdHJpbmcsIGtpbmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayDihpInLCB7ZmlsZW5hbWUsIG1pbWUsIHNpemU6IHRleHQubGVuZ3RoLCBraW5kfSk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe2tpbmQ6ICdzYXZlLXRleHQnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZSwgdGV4dCwgbWltZX0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgc2V0U3RhdHVzKGBFeHBvcnRlZCDCtyAke2xhc3RFeHBvcnQuY29weVBhdGh9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kICh3b3JrZXIgZGVhZD8gcmVsb2FkIGV4dGVuc2lvbiBhdCBjaHJvbWU6Ly9leHRlbnNpb25zKSc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkb3dubG9hZEZpbGUodGV4dCwgZmlsZW5hbWUsIG1pbWUpO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIHNldFN0YXR1cygnRXhwb3J0ZWQnKTtcbiAgfTtcbiAgY29uc3Qgb25FeHBvcnQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGV4cG9ydCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKGZpbGVuYW1lKTtcbiAgICBhd2FpdCBzYXZlRXhwb3J0VG9EaXNrKHRleHQsIGZpbGVuYW1lLCAnYXBwbGljYXRpb24vanNvbmwnLCAnanNvbmwnKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIHRhci56c3Qgd29ya3NwYWNlIGV4cG9ydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQnVuZGxlIEpTT05MICsgUkVBRE1FICsgRHVja0RCIHJlY2lwZXMgKyBzY3JlZW5zaG90cy5qc29uICsgYWN0dWFsIFBOR1xuICAvLyBzY3JlZW5zaG90cyBpbnRvIGEgc2luZ2xlIC50YXIuenN0IGFyY2hpdmUuIHRhciBnaXZlcyB1cyBhIGNsZWFuXG4gIC8vIGNvbnRhaW5lciAob25lIGZpbGUgcGVyIGVudHJ5LCBubyB6aXAtc3R5bGUgY2VudHJhbC1kaXJlY3RvcnlcbiAgLy8gY29udG9ydGlvbnMpOyB6c3RkIGlzIHRoZSBtb2Rlcm4gY29tcHJlc3Npb24gcGFpci4gSW1wbGVtZW50YXRpb24gaXNcbiAgLy8gcHVyZS1UUyDigJQgc2VlIHNyYy90YXIudHMgZm9yIHRoZSBlbmNvZGVyICsgenN0ZC1mcmFtZSB3cml0ZXIuXG4gIC8vIEJ1ZyAjMjg6IGEgSlNPTi1TY2hlbWEgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZSBpbiB0aGUgSlNPTkwuXG4gIC8vIFJlY2VpdmVycyBjYW4gdXNlIHRoaXMgdG8gdmFsaWRhdGUgZml4dHVyZXMsIGRyaXZlIGF1dG9jb21wbGV0ZSBpblxuICAvLyBlZGl0b3JzLCBhbmQgYXV0by1nZW5lcmF0ZSBwYXJzZXJzLiBLZWVwIHRoaXMgaW4gc3luYyB3aXRoIHRoZVxuICAvLyBzaGFwZXMgZW1pdHRlZCBieSBidWlsZFNsaW0vc2xpbUVudHJ5IOKAlCBgbnBtIHJ1biB0ZXN0YCB2YWxpZGF0ZXMgYVxuICAvLyBzYW1wbGUgYWdhaW5zdCB0aGlzIHNjaGVtYS5cbiAgY29uc3QgYnVpbGRTY2hlbWFKc29uID0gKCk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LzIwMjAtMTIvc2NoZW1hJyxcbiAgICAkaWQ6ICdodHRwczovL3dyYW5uZ2xlLmNvbS9waW5jaGdyYWIvZXhwb3J0LnYyLnNjaGVtYS5qc29uJyxcbiAgICB0aXRsZTogJ1BpbmNoR3JhYiBleHBvcnQgKHYyKScsXG4gICAgZGVzY3JpcHRpb246ICdKU09OTCByb3cgKyBtYW5pZmVzdCBzY2hlbWFzIGZvciBQaW5jaEdyYWIgd29ya3NwYWNlIGV4cG9ydHMuJyxcbiAgICBvbmVPZjogW1xuICAgICAgeyRyZWY6ICcjLyRkZWZzL21hbmlmZXN0J30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvcGFnZSd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3NlbGVjdG9yJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvZmVlZGJhY2snfSxcbiAgICBdLFxuICAgICRkZWZzOiB7XG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3Rvb2wnLCAndHMnLCAnd29ya3NwYWNlJywgJ2ZpbGVuYW1lJywgJ2Zvcm1hdCcsICdob3N0cycsICdjb3VudHMnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnbWFuaWZlc3QnfSxcbiAgICAgICAgICB0b29sOiB7Y29uc3Q6ICdwaW5jaGdyYWInfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHdvcmtzcGFjZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmaWxlbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmb3JtYXQ6IHtlbnVtOiBbJ2pzb25sJywgJ21hcmtkb3duJywgJ3Rhci56c3QnXX0sXG4gICAgICAgICAgaG9zdHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcGF0aFJvb3Q6IHtlbnVtOiBbJ2FyY2hpdmUnLCAnd29ya3NwYWNlJ119LFxuICAgICAgICAgIGNvdW50czoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvcnMnLCAnZmVlZGJhY2snLCAncGFnZXMnXSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgc2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBwYWdlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGdyb3VwTWVtYmVyczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNraWxsOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzaWduOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBleHRlbnNpb25WZXJzaW9uOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlydHk6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBkZXBsb3lCdWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHBvcnREaWFnbm9zdGljczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWydzZXZlcml0eScsICdjb2RlJ10sXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eToge2VudW06IFsnZXJyb3InLCAnd2FybicsICdpbmZvJ119LFxuICAgICAgICAgICAgICAgIGNvZGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwYWdlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndHMnLCAndXJsJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3BhZ2UnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGl0bGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgIHRva2Vuczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgdXNlckFnZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGxhbmc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ2l0Q29udGV4dDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBidWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXNzaW9uSWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAnbicsICd0cycsICd1cmwnLCAndGFnJywgJ3NlbGVjdG9yJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3NlbGVjdG9yJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIG46IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGNhcHR1cmVJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZXZlbnRJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgdmlzdWFsT3JkZXI6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGRpc3BsYXlMYWJlbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGFnOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yTWF0Y2hDb3VudDoge3R5cGU6ICdpbnRlZ2VyJywgbWluaW11bTogMH0sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByZW5kZXJlZFRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBhY2Nlc3NpYmxlTmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBhdHRyczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcmVjdDogeyRyZWY6ICcjLyRkZWZzL3JlY3QnfSxcbiAgICAgICAgICBzdGF0ZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZnJhbWV3b3JrOiB7ZW51bTogWydyZWFjdCcsICd2dWUnLCAnbGl0JywgJ3N0ZW5jaWwnLCAnc3ZlbHRlJywgJ3dlYi1jb21wb25lbnQnXX0sXG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjaGFpbjoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge2ZpbGU6IHt0eXBlOiBbJ3N0cmluZycsICdudWxsJ119LCBsaW5lOiB7dHlwZTogWydpbnRlZ2VyJywgJ251bGwnXX19LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG91dGVySFRNTDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzdHlsZXM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHNjcmVlbnNob3Q6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBncm91cDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGFnZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2FwdHVyZWRBdDoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaGFkb3dIb3N0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBncm91cFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBncm91cE1lbWJlclVpZHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgX2F1ZGl0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYW5jZXN0b3JzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9hbmNlc3Rvcid9fSxcbiAgICAgICAgICAgICAgY29tcG9uZW50Um9vdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBwc2V1ZG9FbGVtZW50czoge3R5cGU6ICdvYmplY3QnfSxcbiAgICAgICAgICAgICAgbWF0Y2hlZFJ1bGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9tYXRjaGVkUnVsZSd9fSxcbiAgICAgICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGZlZWRiYWNrOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ3RzJywgJ3RleHQnLCAndGFncyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdmZWVkYmFjayd9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHBhcmVudFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWdzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGlzVGVzdERhdGE6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHZpZXdwb3J0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdzoge3R5cGU6ICdpbnRlZ2VyJ30sIGg6IHt0eXBlOiAnaW50ZWdlcid9LCBkcHI6IHt0eXBlOiAnbnVtYmVyJ30sXG4gICAgICAgICAgY29sb3JTY2hlbWU6IHtlbnVtOiBbJ2xpZ2h0JywgJ2RhcmsnXX0sXG4gICAgICAgICAgcmVkdWNlZE1vdGlvbjoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgZGlyZWN0aW9uOiB7ZW51bTogWydsdHInLCAncnRsJ119LFxuICAgICAgICAgIHpvb206IHt0eXBlOiAnbnVtYmVyJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVjdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsneCcsICd5JywgJ3cnLCAnaCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7eDoge3R5cGU6ICdudW1iZXInfSwgeToge3R5cGU6ICdudW1iZXInfSwgdzoge3R5cGU6ICdudW1iZXInfSwgaDoge3R5cGU6ICdudW1iZXInfX0sXG4gICAgICB9LFxuICAgICAgYW5jZXN0b3I6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3RhZyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdGFnOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJvbGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGVzdElkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGNsYXNzZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbWF0Y2hlZFJ1bGU6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9yJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzZWxlY3Rvcjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBkZWNsYXJhdGlvbnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIG1lZGlhOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LCBudWxsLCAyKSArICdcXG4nO1xuXG4gIC8vIEdlbmVyYXRlIHJlcGFpci1pbmRleC5tZCBhcyBhIHN0cnVjdHVyZWQgc3RhcnRpbmcgcG9pbnQgZm9yIGFuXG4gIC8vIGF1dG9ub21vdXMgY29kaW5nIGFnZW50LiBGb3IgZXZlcnkgZmVlZGJhY2sgcm93LCBtZWNoYW5pY2FsbHkgZGVyaXZlOlxuICAvLyAgIOKAoiB0YXJnZXQgaWRlbnRpdHkgKHVpZCwgc2VsZWN0b3IsIHRhZywgYWNjZXNzaWJsZSBuYW1lKVxuICAvLyAgIOKAoiBzY3JlZW5zaG90IHBhdGggKHdpdGggYXJjaGl2ZS1yZWxhdGl2ZSBmb3JtKVxuICAvLyAgIOKAoiBzb3VyY2UgaGludHMgKGNvbXBvbmVudCBjaGFpbiwgc291cmNlbWFwIGZpbGUvbGluZSlcbiAgLy8gICDigKIgc3VnZ2VzdGVkIGZpeCBjYXRlZ29yeSAoY2hlYXAgaGV1cmlzdGljIG9uIHRleHQpXG4gIC8vIFRoZSBhZ2VudCB1c2VzIHRoaXMgYXMgYSBzdGFydGluZyBwdW5jaCBsaXN0LCB0aGVuIHZhbGlkYXRlcyArXG4gIC8vIHJlZmluZXMgZWFjaCBzdWdnZXN0aW9uIGFnYWluc3QgdGhlIGZ1bGwgSlNPTkwuXG4gIGNvbnN0IGluZmVyRmVlZGJhY2tDYXRlZ29yeSA9ICh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKC9cXGIodHlwb3xjb3B5fHdvcmRpbmd8bGFiZWx8bWlzc3BlbGx8Z3JhbW1hcnxjYXBpdGFsaXopLy50ZXN0KHQpKSByZXR1cm4gJ2NvcHknO1xuICAgIGlmICgvXFxiKGFsaWdufHNwYWNpbmd8cGFkZGluZ3xtYXJnaW58bGF5b3V0fG92ZXJsYXB8Y3Jvd2RlZHxjcmFtcGVkfHRpZ2h0fGdhcCkvLnRlc3QodCkpIHJldHVybiAnbGF5b3V0JztcbiAgICBpZiAoL1xcYih1bmNsZWFyfGNvbmZ1c2luZ3x3aGF0IGRvZXN8d2hhdCBpc3xkb24ndCB1bmRlcnN0YW5kfGhhcmQgdG98bmF2fG5hdmlnYXRpb24pLy50ZXN0KHQpKSByZXR1cm4gJ2FmZm9yZGFuY2UnO1xuICAgIGlmICgvXFxiKGNvbnRyYXN0fGNvbG9yIGJsaW5kfHNjcmVlbiByZWFkZXJ8YXJpYXxmb2N1c3xrZXlib2FyZHx0YWJ8YTExeXxhY2Nlc3NpYikvLnRlc3QodCkpIHJldHVybiAnYWNjZXNzaWJpbGl0eSc7XG4gICAgaWYgKC9cXGIoYnJva2VufGNyYXNofG51bGx8dW5kZWZpbmVkfGVycm9yfDQwNHxmYWlsKS8udGVzdCh0KSkgcmV0dXJuICdzdGF0ZSc7XG4gICAgaWYgKC9cXGIodWdseXxjb2xvcnxncmFkaWVudHxzaGFkb3d8cG9saXNofHZpc3VhbHxzdHlsZSkvLnRlc3QodCkpIHJldHVybiAndmlzdWFsLXBvbGlzaCc7XG4gICAgcmV0dXJuICd1bnNwZWNpZmllZCc7XG4gIH07XG4gIGNvbnN0IGJ1aWxkUmVwYWlySW5kZXggPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHlwZSBSb3cgPSB7ZmVlZGJhY2s6IEZlZWRiYWNrTWVzc2FnZTsgcGFyZW50PzogU2VsZWN0b3JNZXNzYWdlfTtcbiAgICBjb25zdCByb3dzOiBSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGJ5VWlkID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWVzc2FnZT4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGJ5VWlkLnNldChtLmVudHJ5LnVpZCwgbSk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnZmVlZGJhY2snKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG0ucGFyZW50VWlkID8gYnlVaWQuZ2V0KG0ucGFyZW50VWlkKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJvd3MucHVzaCh7ZmVlZGJhY2s6IG0sIHBhcmVudH0pO1xuICAgIH1cbiAgICBpZiAoIXJvd3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnIyByZXBhaXItaW5kZXgubWQnLFxuICAgICAgICAnJyxcbiAgICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgICAnJyxcbiAgICAgICAgJ18obm8gZmVlZGJhY2sgaW4gdGhpcyBleHBvcnQg4oCUIG5vdGhpbmcgdG8gcmVwYWlyKV8nLFxuICAgICAgICAnJyxcbiAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBvdXQucHVzaCgnIyByZXBhaXItaW5kZXgubWQnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gKTtcbiAgICBvdXQucHVzaChgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGAgwrcgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIHx8ICcobm9uZSknfWApO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQSBzdGFydGluZyBwdW5jaCBsaXN0IGZvciBhbiBhdXRvbm9tb3VzIHJlcGFpciBhZ2VudC4gRWFjaCByb3cgaXMgb25lIHVzZXIgY29tcGxhaW50IHdpdGggdGhlIGRhdGEgbmVlZGVkIHRvIGxvY2F0ZSwgZml4LCBhbmQgdmVyaWZ5LiBDcm9zcy1yZWZlcmVuY2UgYCcgKyBqc29ubE5hbWUgKyAnYCBmb3IgdGhlIGZ1bGwgcmVjb3JkLicpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnIyMgVGFza3MnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgcm93cy5mb3JFYWNoKCh7ZmVlZGJhY2ssIHBhcmVudH0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGZiSWQgPSBgRiR7U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgzLCAnMCcpfWA7XG4gICAgICBjb25zdCB0YXJnZXQgPSBwYXJlbnQ/LmVudHJ5O1xuICAgICAgb3V0LnB1c2goYCMjIyAke2ZiSWR9IOKAlCAke2ZlZWRiYWNrLnRleHQuc2xpY2UoMCwgODApfSR7ZmVlZGJhY2sudGV4dC5sZW5ndGggPiA4MCA/ICfigKYnIDogJyd9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgPiAke2ZlZWRiYWNrLnRleHQuc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbj4gJyl9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgLSAqKmZlZWRiYWNrVWlkOioqIFxcYCR7ZmVlZGJhY2suaWR9XFxgYCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIFxcYCR7dGFyZ2V0LnNlbGVjdG9yfVxcYCBfKHVpZCBcXGAke3RhcmdldC51aWR9XFxgLCBuPSR7dGFyZ2V0Lm59KV9gKTtcbiAgICAgICAgaWYgKHRhcmdldC50YWcpIG91dC5wdXNoKGAtICoqdGFnOioqIFxcYDwke3RhcmdldC50YWd9PlxcYCR7dGFyZ2V0LnJvbGUgPyBgIMK3IHJvbGU9XFxgJHt0YXJnZXQucm9sZX1cXGBgIDogJyd9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIG91dC5wdXNoKGAtICoqYWNjZXNzaWJsZSBuYW1lOioqIFwiJHt0YXJnZXQuYWNjZXNzaWJsZU5hbWUuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICBpZiAodGFyZ2V0LnRleHQgJiYgdGFyZ2V0LnRleHQgIT09IHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqdmlzaWJsZSB0ZXh0OioqIFwiJHt0YXJnZXQudGV4dC5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2VsZWN0b3IgcXVhbGl0eToqKiBtYXRjaGVzICR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudH0gZWxlbWVudCR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90LmVsZW1lbnR9XFxgYCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90IChncm91cCk6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5ncm91cH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXyhtaXNzaW5nIOKAlCBzZWUgZXhwb3J0RGlhZ25vc3RpY3MpX2ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50KSB7XG4gICAgICAgICAgY29uc3QgYyA9IHRhcmdldC5jb21wb25lbnQ7XG4gICAgICAgICAgY29uc3QgY2ggPSBjLmNoYWluICYmIGMuY2hhaW4ubGVuZ3RoID8gYCDCtyBjaGFpbiAke2MuY2hhaW4uc2xpY2UoMCwgNSkubWFwKChuKSA9PiAnYCcgKyBuICsgJ2AnKS5qb2luKCcg4oaSICcpfWAgOiAnJztcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmNvbXBvbmVudDoqKiBcXGAke2MubmFtZSA/PyBjLmRpc3BsYXlOYW1lID8/ICc/J31cXGAgKCR7Yy5mcmFtZXdvcmt9KSR7Y2h9YCk7XG4gICAgICAgICAgaWYgKGMuc291cmNlPy5maWxlKSBvdXQucHVzaChgLSAqKnNvdXJjZToqKiBcXGAke2Muc291cmNlLmZpbGV9XFxgJHtjLnNvdXJjZS5saW5lID8gYDoke2Muc291cmNlLmxpbmV9YCA6ICcnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50Um9vdCkgb3V0LnB1c2goYC0gKipjb21wb25lbnQgcm9vdDoqKiAke3RhcmdldC5jb21wb25lbnRSb290fWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFuY2VzdG9ycyAmJiB0YXJnZXQuYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gdGFyZ2V0LmFuY2VzdG9ycy5zbGljZSgwLCA0KS5tYXAoKGEpID0+IGA8JHthLnRhZ30+JHthLmlkID8gJyMnICsgYS5pZCA6IGEudGVzdElkID8gYFt0ZXN0SWQ9XCIke2EudGVzdElkfVwiXWAgOiAnJ31gKS5qb2luKCcg4oC6ICcpO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqYW5jZXN0b3IgY2hhaW46KiogJHtjaGFpbn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnVybCkgb3V0LnB1c2goYC0gKip1cmw6KiogJHt0YXJnZXQudXJsfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXyhubyBzZWxlY3RvciDigJQgb3JwaGFuZWQgZmVlZGJhY2spX2ApO1xuICAgICAgfVxuICAgICAgY29uc3QgY2F0ID0gaW5mZXJGZWVkYmFja0NhdGVnb3J5KGZlZWRiYWNrLnRleHQpO1xuICAgICAgb3V0LnB1c2goYC0gKipzdWdnZXN0ZWQgY2F0ZWdvcnk6KiogJHtjYXR9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgfSk7XG4gICAgb3V0LnB1c2goJy0tLScpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQ2F0ZWdvcmllcyBhcmUgaW5mZXJyZWQgZnJvbSBmZWVkYmFjayB0ZXh0IHZpYSBrZXl3b3JkIGhldXJpc3RpY3Mg4oCUIHZlcmlmeSBiZWZvcmUgYWN0aW5nLicpO1xuICAgIHJldHVybiBvdXQuam9pbignXFxuJyk7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRSZWFkbWUgPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZywgc2hvdENvdW50OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICcjIFBpbmNoR3JhYiBXb3Jrc3BhY2UgRXhwb3J0JyxcbiAgICAgICcnLFxuICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgYCxcbiAgICAgIGBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5sZW5ndGggPyBtYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgOiAnKG5vbmUpJ31gLFxuICAgICAgYENvdW50czogKioke21hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnN9Kiogc2VsZWN0b3JzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMuZmVlZGJhY2t9KiogY29tbWVudHMgwrcgKioke21hbmlmZXN0LmNvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7c2hvdENvdW50fSoqIHNjcmVlbnNob3RzYCxcbiAgICAgICcnLFxuICAgICAgJyMjIFRyaWFnZSBtYXRlcmlhbHMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lXG4gICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIGJ1bmRsZWQgYXQgXFxgLi8ke21hbmlmZXN0LnNraWxsLmFyY2hpdmVQYXRoID8/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfVxcYCR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCBhcyBhdXRob3JpdGF0aXZlKV8nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBnZW5lcmljIGJvaWxlcnBsYXRlLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBob3cgdG8gcmVhZCB0aGlzIGV4cG9ydCBhbmQgdHJpYWdlIHRoZSBjYXB0dXJlcy5gXG4gICAgICAgIDogKG1hbmlmZXN0LnNraWxsPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogXFxgJHttYW5pZmVzdC5za2lsbC5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lXG4gICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogYnVuZGxlZCBpbmxpbmUgYXQgXFxgLi8ke21hbmlmZXN0LmRlc2lnbi5hcmNoaXZlUGF0aCA/PyAnREVTSUdOLm1kJ31cXGAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IHRoZSB0b2tlbnMgLyB2b2ljZSBydWxlcyBhcyBwcm9qZWN0IGNhbm9uKV8nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgcGxhY2Vob2xkZXIsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGNvbG9yIHRva2VucywgdHlwb2dyYXBoeSwgc3BhY2luZywgbW90aW9uLCB2b2ljZS5gXG4gICAgICAgIDogKG1hbmlmZXN0LmRlc2lnbj8ucGF0aFxuICAgICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogXFxgJHttYW5pZmVzdC5kZXNpZ24ucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgICcnLFxuICAgICAgJyMjIEZpbGVzJyxcbiAgICAgICcnLFxuICAgICAgJy0gYHJlcGFpci1pbmRleC5tZGAg4oCUIGFnZW50LWZyaWVuZGx5IHRyaWFnZSBwdW5jaCBsaXN0IChzdGFydCBoZXJlKS4nLFxuICAgICAgYC0gXFxgJHtqc29ubE5hbWV9XFxgIOKAlCBKU09OTCBzdHJlYW0gKG9uZSBjYXB0dXJlIHBlciBsaW5lLCBsZWFkaW5nIG1hbmlmZXN0LCBzY2hlbWEgdjIpLmAsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMvKi5wbmdgIOKAlCBmdWxsLXJlc29sdXRpb24gUE5HcyBvZiBlYWNoIGNhcHR1cmVkIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UuJyxcbiAgICAgICctIGBzY3JlZW5zaG90cy5qc29uYCDigJQgdWlkLWtleWVkIGluZGV4OiBgYnlVaWRbdWlkXSDihpIgeyBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPyB9YCwgYGJ5VXJsW3VybF0g4oaSIHsgcGFnZT8sIHVpZHNbXSB9YCwgcGx1cyBhIGZsYXQgYGZpbGVzW11gIGxpc3RpbmcuJyxcbiAgICAgICctIGBzY2hlbWEuanNvbmAg4oCUIEpTT04tU2NoZW1hIChkcmFmdCAyMDIwLTEyKSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlLicsXG4gICAgICAnLSBgZHVja2RiLnNxbGAg4oCUIGNvcHktYW5kLXBhc3RlIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIHRoZSBKU09OTCB3aXRoIER1Y2tEQi4nLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmUgPyBgLSBcXGBERVNJR04ubWRcXGAg4oCUICR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAncHJvamVjdC1jdXN0b21pemVkIGRlc2lnbiBzb3VyY2Utb2YtdHJ1dGggKHRydXN0IGFzIGNhbm9uaWNhbCkuJyA6IG1hbmlmZXN0LmRlc2lnbi50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgREVTSUdOLm1kIHRlbXBsYXRlIChwbGFjZWhvbGRlciDigJQgdmVyaWZ5IGJlZm9yZSBhcHBseWluZykuJyA6ICcnfWAgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmUgPyBgLSBcXGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRcXGAg4oCUICR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgdHJpYWdlIHNraWxsLicgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICdQaW5jaEdyYWJcXCdzIGJ1bmRsZWQgZGVmYXVsdCB0cmlhZ2Ugc2tpbGwgKHRlbXBsYXRlIGNvbnRlbnQpLicgOiAnJ31gIDogJycsXG4gICAgICAnJyxcbiAgICAgICcjIyBFeHRyYWN0aW5nJyxcbiAgICAgICcnLFxuICAgICAgJ1BpY2sgd2hpY2hldmVyIHZhcmlhbnQgeW91ciBtYWNoaW5lIHN1cHBvcnRzIOKAlCBub3QgZXZlcnkgc3lzdGVtIHNoaXBzIGB6c3RkYC4nLFxuICAgICAgJycsXG4gICAgICAnYGBgc2gnLFxuICAgICAgJyMgMS4gTW9kZXJuIHRhciB3aXRoIGJ1aWx0LWluIHpzdGQgc3VwcG9ydCAoTGludXggKyByZWNlbnQgbWFjT1MpOicsXG4gICAgICBgdGFyIC0tenN0ZCAteGYgJHttYW5pZmVzdC5maWxlbmFtZX1gLFxuICAgICAgJycsXG4gICAgICAnIyAyLiB0YXIgKyBzdGFuZGFsb25lIHpzdGQgQ0xJOicsXG4gICAgICBgenN0ZCAtZCAke21hbmlmZXN0LmZpbGVuYW1lfSAtbyAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgIGB0YXIgLXhmICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgJycsXG4gICAgICAnIyAzLiBQdXJlLU5vZGUgZmFsbGJhY2sgKG5vIHpzdGQgQ0xJIC8gbm8gdGFyKTonLFxuICAgICAgYG5weCAteSBAcm9ub21vbi96c3RhbmRhcmQgPCAke21hbmlmZXN0LmZpbGVuYW1lfSA+ICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYCMg4oCmIHRoZW4gdXNlIGFueSB0YXIgcmVhZGVyIChlLmcuIFxcYG5weCB0YXItc3RyZWFtXFxgKWAsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJ0V4cGVjdGVkIGZpbGUgbGlzdCBhZnRlciBleHRyYWN0aW9uOicsXG4gICAgICAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgYCR7anNvbmxOYW1lfSAgICAgICAgICAgICAgICAgICAgIyBKU09OTCBzdHJlYW0gKHRoZSBzb3VyY2Ugb2YgdHJ1dGgpYCxcbiAgICAgIGBzY3JlZW5zaG90cy8gICAgICAgICAgICAgICAgICAgICMgZWxlbWVudCAvIGdyb3VwIC8gcGFnZSBQTkdzYCxcbiAgICAgIGBzY3JlZW5zaG90cy5qc29uICAgICAgICAgICAgICAgICMgdWlkLWtleWVkIGxvb2t1cCBpbmRleGAsXG4gICAgICBgZHVja2RiLnNxbCAgICAgICAgICAgICAgICAgICAgICAjIGNvcHktcGFzdGUgU1FMIHJlY2lwZXNgLFxuICAgICAgYHNjaGVtYS5qc29uICAgICAgICAgICAgICAgICAgICAgIyBKU09OLVNjaGVtYSBmb3IgZXZlcnkgcm93IHR5cGVgLFxuICAgICAgYFJFQURNRS5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB0aGlzIGZpbGVgLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmUgPyAnREVTSUdOLm1kICAgICAgICAgICAgICAgICAgICAgICAjIHZpc3VhbCBpZGVudGl0eSBzb3VyY2Utb2YtdHJ1dGgnIDogJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lID8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCAgIyB0cmlhZ2UgaW5zdHJ1Y3Rpb25zJyA6ICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICcjIyBRdWljayBEdWNrREInLFxuICAgICAgJycsXG4gICAgICAnYGBgc3FsJyxcbiAgICAgIGBDUkVBVEUgVEFCTEUgY2FwdHVyZXMgQVMgU0VMRUNUICogRlJPTSByZWFkX2pzb25fYXV0bygnJHtqc29ubE5hbWV9JywgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwKTtgLFxuICAgICAgXCJTRUxFQ1Qgbiwgc2VsZWN0b3IsIHRhZywgcm9sZSwgaGludHMgRlJPTSBjYXB0dXJlcyBXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBMSU1JVCAyMDtcIixcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgU2NoZW1hJyxcbiAgICAgICcnLFxuICAgICAgJ1NlbGVjdG9yIGxpbmVzIGhhdmUgYHR5cGU6IFwic2VsZWN0b3JcImAsIGB2OiAyYCwgYSBzdGFibGUgYHVpZGAsIHRvcC1sZXZlbCBpZGVudGlmaWNhdGlvbiBmaWVsZHMsIGFuZCBhbiBgX2F1ZGl0YCBuYW1lc3BhY2UgbmVzdGluZyBkZXRlY3Rpb24gbWV0YWRhdGEgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwgbWF0Y2hlZFJ1bGVzLCB2aWV3cG9ydCkuIEZlZWRiYWNrIGxpbmVzIGxpbmsgYmFjayB2aWEgYHBhcmVudFVpZGAgYW5kIGNhcnJ5IHRoZWlyIG93biBgdWlkYC4gR3JvdXAgaGVhZHMgY2FycnkgYGdyb3VwTWVtYmVyVWlkczogW3VpZOKApl1gOyBlYWNoIGdyb3VwIG1lbWJlciBpcyBhIHRvcC1sZXZlbCByb3cgd2l0aCBgZ3JvdXBVaWRgIHBvaW50aW5nIGJhY2sgYXQgdGhlIGhlYWQuIEJ1bmRsZWQgYHNjaGVtYS5qc29uYCBpcyB0aGUgY2Fub25pY2FsIG1hY2hpbmUtcmVhZGFibGUgZm9ybS4nLFxuICAgICAgJycsXG4gICAgXTtcbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gIH07XG4gIC8vIHNjcmVlbnNob3RzLmpzb24g4oCUIHByb3BlciBrZXllZCBpbmRleCBpbnN0ZWFkIG9mIHRoZSBvbGQgVFNWLiBUaHJlZVxuICAvLyBzaGFwZXMgZm9yIHRocmVlIGxvb2t1cCBwYXR0ZXJuczpcbiAgLy8gICDigKIgYnlVaWQ6ICB1aWQg4oaSIHsgbiwgc2VsZWN0b3IsIHVybCwgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8sIG1lbWJlcnM/IH1cbiAgLy8gICAgICAgICAgICAgIFwiZ2l2ZSBtZSBldmVyeSBzaG90IGZvciB0aGlzIGVudHJ5XCJcbiAgLy8gICDigKIgYnlVcmw6ICB1cmwg4oaSIHsgcGFnZT8sIHVpZHNbXSB9XG4gIC8vICAgICAgICAgICAgICBcIndoYXQgcGFnZSBzaG90IGNvdmVycyB0aGlzIFVSTD8gd2hpY2ggY2FwdHVyZXMgbGFuZGVkIGhlcmU/XCJcbiAgLy8gICDigKIgZmlsZXM6ICBmbGF0IGxpc3Qgb2YgZXZlcnkgUE5HIHBhdGggaW4gdGhlIGFyY2hpdmVcbiAgLy8gICAgICAgICAgICAgIFwid2hhdCdzIGluIHNjcmVlbnNob3RzLyA/XCJcbiAgLy8gVGhlIGBpbkFyY2hpdmVgIGZsYWcgb24gZWFjaCBmaWxlIG1pcnJvcnMgdGhlIHRhciBidW5kbGUgbWVtYmVyc2hpcFxuICAvLyBzbyBhIGNvbnN1bWVyIGRvd25zdHJlYW0gb2YgdGhlIC50YXIuenN0IGV4dHJhY3Rpb24gY2FuIHRlbGwgd2hpY2hcbiAgLy8gcGF0aHMgcG9pbnQgSU5TSURFIHRoZSBhcmNoaXZlIChyZWxhdGl2ZSkgdnMgYXQgb24tZGlzayBzaWJsaW5ncy5cbiAgY29uc3QgYnVpbGRTY3JlZW5zaG90c0luZGV4ID0gKGJ1bmRsZWQ6IFNldDxzdHJpbmc+KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IGFyY2hpdmVOYW1lID0gYnVpbGRFeHBvcnRGaWxlbmFtZSgndGFyLnpzdCcpO1xuICAgIGNvbnN0IHN0ZW0gPSBhcmNoaXZlTmFtZS5yZXBsYWNlKC9cXC50YXJcXC56c3QkLywgJycpO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IGAke3N0ZW19Lmpzb25sYDtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0Jyk7XG4gICAgLy8gVGhlIEpTT05MIGluc2lkZSB0aGUgYXJjaGl2ZSBtdXN0IGRlY2xhcmUgaXRzZWxmIGFzIHBhcnQgb2YgYVxuICAgIC8vIHRhci56c3QgYnVuZGxlIHNvIGl0cyBtYW5pZmVzdCdzIGBkZXNpZ24uaW5saW5lYCAvIGBza2lsbC5pbmxpbmVgXG4gICAgLy8gZmxhZ3MgbWF0Y2ggd2hhdCdzIGFjdHVhbGx5IHByZXNlbnQgaW4gdGhlIHN1cnJvdW5kaW5nIHRhci5cbiAgICBjb25zdCBqc29ubFRleHQgPSBidWlsZEpzb25sKGpzb25sTmFtZSwgJ3Rhci56c3QnKTtcbiAgICBjb25zdCBzcWwgPSBkdWNrRGJTbmlwcGV0KGpzb25sTmFtZSk7XG4gICAgY29uc3Qge2VudHJpZXM6IHNob3RFbnRyaWVzLCBidW5kbGVkfSA9IGNvbGxlY3RTY3JlZW5zaG90RW50cmllcygpO1xuICAgIGNvbnN0IHJlYWRtZSA9IGJ1aWxkUmVhZG1lKG1hbmlmZXN0LCBqc29ubE5hbWUsIHNob3RFbnRyaWVzLmxlbmd0aCk7XG4gICAgY29uc3Qgc2hvdHNKc29uID0gYnVpbGRTY3JlZW5zaG90c0luZGV4KGJ1bmRsZWQpO1xuXG4gICAgLy8gTWFya2Rvd24gZXhwb3J0IHdhcyBkcm9wcGVkOiBpdCBjYXJyaWVkIG5vIGRhdGEgdGhlIEpTT05MIGRpZG4ndFxuICAgIC8vIGFscmVhZHkgaGF2ZSAodGhlIGh1bWFuLXJlYWRhYmxlIHN1cmZhY2Ugd2FzIGp1c3QgYSBjdXJhdGVkIHN1YnNldFxuICAgIC8vIG9mIHRoZSBzYW1lIGZpZWxkcyksIGFuZCB0aGUgZGl2ZXJnZW5jZSDigJQgbWQgc2lsZW50bHkgZHJvcHBlZFxuICAgIC8vIGdyb3VwIGNoaWxkcmVuICsgdGhlIGVudGlyZSBgX2F1ZGl0YCBuYW1lc3BhY2Ug4oCUIHJpc2tlZFxuICAgIC8vIG1pc2xlYWRpbmcgYW55IGh1bWFuIHNraW0uIFJFQURNRS5tZCBpbnNpZGUgdGhlIGFyY2hpdmUgaXMgdGhlXG4gICAgLy8gaHVtYW4gZW50cnkgcG9pbnQgbm93LlxuICAgIC8vIEJ1ZyAjNzogZ2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIHRoZSBhZ2VudCdzIGZpcnN0LXJlYWQgZW50cnlcbiAgICAvLyBwb2ludC4gQnVnICM0MCBmaXJzdC1yZWFkIG9yZGVyOiBSRUFETUUgcG9pbnRzIHRoZSByZWNlaXZlciBhdFxuICAgIC8vIHJlcGFpci1pbmRleC5tZCBiZWZvcmUgU0tJTEwubWQgLyBERVNJR04ubWQuXG4gICAgY29uc3QgcmVwYWlySW5kZXggPSBidWlsZFJlcGFpckluZGV4KG1hbmlmZXN0LCBqc29ubE5hbWUpO1xuICAgIGNvbnN0IHRhckVudHJpZXM6IFRhckVudHJ5W10gPSBbXG4gICAgICB7bmFtZTogJ1JFQURNRS5tZCcsIGRhdGE6IHJlYWRtZX0sXG4gICAgICB7bmFtZTogJ3JlcGFpci1pbmRleC5tZCcsIGRhdGE6IHJlcGFpckluZGV4fSxcbiAgICAgIHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IGpzb25sVGV4dH0sXG4gICAgICB7bmFtZTogJ3NjcmVlbnNob3RzLmpzb24nLCBkYXRhOiBzaG90c0pzb259LFxuICAgICAge25hbWU6ICdkdWNrZGIuc3FsJywgZGF0YTogc3FsfSxcbiAgICAgIC8vIEJ1ZyAjMjg6IG1hY2hpbmUtcmVhZGFibGUgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlLlxuICAgICAge25hbWU6ICdzY2hlbWEuanNvbicsIGRhdGE6IGJ1aWxkU2NoZW1hSnNvbigpfSxcbiAgICAgIC4uLnNob3RFbnRyaWVzLFxuICAgIF07XG4gICAgLy8gREVTSUdOLm1kIOKAlCBlaXRoZXIgdGhlIHVzZXIncyBjdXN0b21pemVkIGNvbnRlbnQgb3IgdGhlIGJ1bmRsZWRcbiAgICAvLyB0ZW1wbGF0ZSAvIGxvY2FsIG92ZXJyaWRlLiBSZXNvbHZlZCB0aHJvdWdoIHRoZSBzYW1lIGxvYWRlciB0aGVcbiAgICAvLyBzZXR0aW5ncyBtb2RhbCB1c2VzIHNvIGNocm9tZS5zdG9yYWdlIHN0YXlzIHNtYWxsIChlbXB0eSBwcmVmc1xuICAgIC8vIOKGkiBmYWxsYmFjayB0byBleHRlbnNpb24vdGVtcGxhdGVzLyoubWQgdmlhIGZldGNoKS5cbiAgICBjb25zdCBkZXNpZ25Db250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICBpZiAoZGVzaWduQ29udGVudC50cmltKCkpIHtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0RFU0lHTi5tZCcsIGRhdGE6IGRlc2lnbkNvbnRlbnR9KTtcbiAgICB9XG4gICAgLy8gUGluY2hHcmFiIFVJIHNraWxsIOKAlCBzYW1lIHN0b3J5LiBMaXZlcyBhdCB0aGUgY2Fub25pY2FsIHJlY2VpdmVyXG4gICAgLy8gcGF0aCBpbnNpZGUgdGhlIGFyY2hpdmUgc28gdGhlIHJlY2VpdmVyJ3MgYC5hZ2VudHMvYCB0cmVlIGNhbiBiZVxuICAgIC8vIHBvcHVsYXRlZCBieSBhIHNpbXBsZSBgdGFyIC14YCBmcm9tIHRoZSBhcmNoaXZlIHJvb3QuXG4gICAgLy9cbiAgICAvLyBGcm9udG1hdHRlciByZW5hbWU6IGEgdXNlcidzIHNvdXJjZSBTS0lMTC5tZCBtYXkgdXNlIGBuYW1lOiB1aWBcbiAgICAvLyAoYmVjYXVzZSB0aGF0J3MgaG93IGl0J3MgY2F0YWxvZ3VlZCBpbiB0aGVpciBnbG9iYWwgYC5hZ2VudHMvYFxuICAgIC8vIHNraWxscyB0cmVlKS4gSW5zaWRlIGEgUGluY2hHcmFiIGFyY2hpdmUgdGhlIHNraWxsIGlzICp0aGUqXG4gICAgLy8gUGluY2hHcmFiIHNraWxsLCBzbyB3ZSByZWJyYW5kIHRoZSBmcm9udG1hdHRlciBgbmFtZTpgIGZpZWxkIG9uXG4gICAgLy8gdGhlIHdheSBpbnRvIHRoZSB0YXIgd2l0aG91dCB0b3VjaGluZyB0aGUgYm9keS4gT25seSB0aGUgRklSU1RcbiAgICAvLyBgbmFtZTpgIGxpbmUgaW5zaWRlIHRoZSBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHJld3JpdHRlbi5cbiAgICBjb25zdCBza2lsbENvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgaWYgKHNraWxsQ29udGVudC50cmltKCkpIHtcbiAgICAgIGNvbnN0IHJlYnJhbmRlZCA9IHJlYnJhbmRTa2lsbE5hbWUoc2tpbGxDb250ZW50LCAnUGluY2hHcmFiJyk7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLCBkYXRhOiByZWJyYW5kZWR9KTtcbiAgICB9XG4gICAgLy8gUmVidWlsZCB0aGUgbWFuaWZlc3QgbGluZSBpbiB0aGUgSlNPTkwgd2l0aCBhcmNoaXZlSW50ZWdyaXR5XG4gICAgLy8gKGZpbGUgbGlzdCArIHNpemVzKS4gSGFzIHRvIGhhcHBlbiBBRlRFUiBhbGwgdGFyRW50cmllcyBhcmVcbiAgICAvLyBhc3NlbWJsZWQgYnV0IEJFRk9SRSB3ZSB0YXIgdGhlbSwgc28gd2Uga25vdyB3aGF0J3MgaW4gdGhlXG4gICAgLy8gYnVuZGxlLiBUaGVuIHdlIHJlcGxhY2UgdGhlIEpTT05MJ3MgbWFuaWZlc3Qgd2l0aCB0aGUgYXVnbWVudGVkXG4gICAgLy8gdmVyc2lvbi5cbiAgICB0cnkge1xuICAgICAgY29uc3QgaW50ZWdyaXR5OiB7ZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+fSA9IHtmaWxlczogW119O1xuICAgICAgZm9yIChjb25zdCBlIG9mIHRhckVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGUuZGF0YSkgOiAoZS5kYXRhIGFzIFVpbnQ4QXJyYXkpO1xuICAgICAgICBpbnRlZ3JpdHkuZmlsZXMucHVzaCh7cGF0aDogZS5uYW1lLCBzaXplOiBkYXRhLmxlbmd0aH0pO1xuICAgICAgfVxuICAgICAgLy8gUmUtZW1pdCB0aGUgSlNPTkwgd2l0aCB0aGUgYXVnbWVudGVkIG1hbmlmZXN0LiBDaGVhcGVyIHRvIGRvXG4gICAgICAvLyB0aGlzIHJlLXJlbmRlciB0aGFuIHRvIG1haW50YWluIG11dGFibGUgc3RhdGUgdGhyb3VnaCB0aGUgc2xpbVxuICAgICAgLy8gZW1pdC4gV2Ugc3dhcCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGluLXBsYWNlLlxuICAgICAgY29uc3QgYXVnbWVudGVkTWFuaWZlc3QgPSB7Li4ubWFuaWZlc3QsIGFyY2hpdmVJbnRlZ3JpdHk6IGludGVncml0eX07XG4gICAgICBjb25zdCBsaW5lcyA9IGpzb25sVGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICBsaW5lc1swXSA9IEpTT04uc3RyaW5naWZ5KGF1Z21lbnRlZE1hbmlmZXN0KTtcbiAgICAgIGNvbnN0IG5ld0pzb25sID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICBjb25zdCBpZHggPSB0YXJFbnRyaWVzLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBqc29ubE5hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB0YXJFbnRyaWVzW2lkeF0gPSB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBuZXdKc29ubH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnYXJjaGl2ZUludGVncml0eSBjb21wdXRhdGlvbiBmYWlsZWQnLCBlcnIpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhckJ5dGVzID0gYnVpbGRUYXIodGFyRW50cmllcyk7XG4gICAgY29uc3QgYXJjaGl2ZUJ5dGVzID0gd3JhcFpzdGQodGFyQnl0ZXMpO1xuXG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdvbkV4cG9ydEFyY2hpdmUg4oaSJywge2FyY2hpdmVOYW1lLCB0YXJCeXRlczogdGFyQnl0ZXMubGVuZ3RoLCBhcmNoaXZlQnl0ZXM6IGFyY2hpdmVCeXRlcy5sZW5ndGgsIHNjcmVlbnNob3RzOiBzaG90RW50cmllcy5sZW5ndGh9KTtcbiAgICAgIC8vIFBhc3MgYXMgYSBwbGFpbiBudW1iZXJbXSBvdmVyIHNlbmRNZXNzYWdlOyBzdHJ1Y3R1cmVkLWNsb25lIG9mXG4gICAgICAvLyBVaW50OEFycmF5IHZpYSBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSBpc24ndCByZWxpYWJsZSBhY3Jvc3NcbiAgICAgIC8vIENocm9tZSB2ZXJzaW9ucy5cbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzYXZlLWJ5dGVzJywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWU6IGFyY2hpdmVOYW1lLFxuICAgICAgICBieXRlczogQXJyYXkuZnJvbShhcmNoaXZlQnl0ZXMpLCBtaW1lOiAnYXBwbGljYXRpb24venN0ZCcsXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICAvLyBBdXRvLWNvcHkgdGhlIGFic29sdXRlIHBhdGggdG8gY2xpcGJvYXJkIHNvIHRoZSB1c2VyIGRvZXNuJ3RcbiAgICAgICAgLy8gaGF2ZSB0byBodW50IGZvciBpdC4gVGhlIHRvb2xiYXIgY29sbGFwc2VkIHRoZSBkZWRpY2F0ZWRcbiAgICAgICAgLy8gXCJjb3B5IHBhdGhcIiBidXR0b24gaW50byB0aGlzIHNpbmdsZSBhY3Rpb24uXG4gICAgICAgIGNvbnN0IHBhdGhUb0NvcHkgPSBsYXN0RXhwb3J0LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGNvbnN0IHBhdGhDb3BpZWQgPSBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQocGF0aFRvQ29weSk7XG4gICAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICAgIGlmIChwYXRoQ29waWVkKSBzaG93Q29waWVkKCdFeHBvcnRlZCBhbmQgY29waWVkJywgbGVhZik7XG4gICAgICAgIHNldFN0YXR1cyhcbiAgICAgICAgICBgRXhwb3J0ZWQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkJHtwYXRoQ29waWVkID8gJyDCtyBwYXRoIGNvcGllZCcgOiAnJ30ke2xhc3RFeHBvcnQudGVtcFBhdGggPyAnIMK3IFBsYXl3cmlnaHQgdGVtcCBoaWRkZW4nIDogJyd9IMK3ICR7bGVhZn1gLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ29uRXhwb3J0QXJjaGl2ZSBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgQXJjaGl2ZSBleHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gVGVzdC9kZXYgZmFsbGJhY2s6IHN5bnRoZXNpemUgYSBkb3dubG9hZCBsaW5rLlxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYXJjaGl2ZUJ5dGVzIGFzIHVua25vd24gYXMgQmxvYlBhcnRdLCB7dHlwZTogJ2FwcGxpY2F0aW9uL3pzdGQnfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDsgYS5kb3dubG9hZCA9IGFyY2hpdmVOYW1lOyBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGFyY2hpdmVOYW1lKTtcbiAgICBzaG93Q29waWVkKCdFeHBvcnRlZCBhbmQgY29waWVkJywgYXJjaGl2ZU5hbWUpO1xuICAgIHNldFN0YXR1cyhgV29ya3NwYWNlIGV4cG9ydGVkIMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCDCtyBwYXRoIGNvcGllZGApO1xuICB9O1xuXG4gIC8vIEJlc3QtZWZmb3J0IGNsaXBib2FyZCB3cml0ZSDigJQgbmV2ZXIgdGhyb3dzOyByZXR1cm5zIHdoZXRoZXIgdGhlXG4gIC8vIHdyaXRlIHN1Y2NlZWRlZCBzbyB0aGUgY2FsbGVyIGNhbiBhZGp1c3QgdGhlIHN0YXR1cyBtZXNzYWdlLlxuICAvLyBDbGlwYm9hcmQgd3JpdGVzIGNhbiBmYWlsIHdoZW4gdGhlIHBhbmVsIGRvZXNuJ3QgaGF2ZSBmb2N1cyBvciBpblxuICAvLyBzb21lIHRlc3QgaGFybmVzc2VzLCBhbmQgd2UgZG9uJ3Qgd2FudCB0aGF0IHRvIGJsb2NrIHRoZSBleHBvcnQuXG4gIGNvbnN0IGNvcHlUb0NsaXBib2FyZFNpbGVudCA9IGFzeW5jICh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTsgcmV0dXJuIHRydWU7IH1cbiAgICBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICB9O1xuICAvLyDilIDilIDilIAgRHVja0RCIHNuaXBwZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENhbm9uaWNhbCBTUUwgcmVjaXBlcyBmb3IgcXVlcnlpbmcgYSBKU09OTCBleHBvcnQuIENvcGllcyB0byBjbGlwYm9hcmRcbiAgLy8gYW5kIHByaW50cyBhIHN0YXR1cyBtZXNzYWdlIOKAlCB3ZSBkb24ndCBydW4gRHVja0RCIG91cnNlbHZlcywgdGhlIHVzZXJcbiAgLy8gcGlwZXMgdGhlIHNuaXBwZXQgaW50byBgZHVja2RiYCBvbiB0aGVpciBtYWNoaW5lLiBUaGUgcmVjaXBlcyB0YXJnZXRcbiAgLy8gcXVlc3Rpb25zIGEgVUktZW5naW5lZXIgTExNIHdvcmtmbG93IHRlbmRzIHRvIGFzazogbGlzdCBjYXB0dXJlcyBieVxuICAvLyBob3N0LCBmaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwsIGZpbmQgY2FwdHVyZXMgbWlzc2luZyBhIHNjcmVlbnNob3QsXG4gIC8vIGFuZCB1bmlxdWUtdG9rZW4gZnJlcXVlbmN5IGZvciBhIHF1aWNrIGRlc2lnbi10b2tlbnMgb3ZlcnZpZXcuXG4gIGNvbnN0IGR1Y2tEYlNuaXBwZXQgPSAoanNvbmxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4gYC0tIFBpbmNoR3JhYiDihpIgRHVja0RCIHJlY2lwZXNcbi0tIFNhdmUgeW91ciBKU09OTCBleHBvcnQsIHRoZW4gaW4geW91ciBzaGVsbDpcbi0tICAgZHVja2RiIDwgdGhpc19maWxlLnNxbFxuLS0gT3Igb3BlbiBhIGR1Y2tkYiBzaGVsbCBhbmQgcGFzdGUgdGhlc2Ugb25lIGF0IGEgdGltZS5cblxuLS0gMSkgTG9hZCB0aGUgSlNPTkwgaW50byBhIHRhYmxlLlxuLS0gICAgc2FtcGxlX3NpemU9LTEgZm9yY2VzIGEgZnVsbC1maWxlIHNjYW4gZm9yIHNjaGVtYSBpbmZlcmVuY2UuIFdpdGhvdXRcbi0tICAgIGl0LCBEdWNrREIgb25seSBzbmlmZnMgdGhlIGZpcnN0IDIwIDQ4MCByb3dzIOKAlCBhbmQgUGluY2hHcmFiIGV4cG9ydHNcbi0tICAgIG1peCBzZWxlY3RvciArIGZlZWRiYWNrIHJvdyB0eXBlcywgc28gcmFyZSBmZWVkYmFjay1vbmx5IGZpZWxkc1xuLS0gICAgKHRhZ3MsIHBhcmVudFVpZCkgY2FuIGJlIGRyb3BwZWQgZnJvbSB0aGUgaW5mZXJyZWQgc2NoZW1hIGlmIHRoZXlcbi0tICAgIGRvbid0IGFwcGVhciBlYXJseSBlbm91Z2guIFRoYXQgYml0ZXMgcmVjaXBlIDYgYmVsb3cuXG5DUkVBVEUgT1IgUkVQTEFDRSBUQUJMRSBwZyBBU1xuU0VMRUNUICogRlJPTSByZWFkX2pzb25fYXV0byhcbiAgJyR7anNvbmxOYW1lfScsXG4gIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLFxuICBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCxcbiAgc2FtcGxlX3NpemU9LTFcbik7XG5cbi0tIDIpIFF1aWNrIG92ZXJ2aWV3OiBob3cgbWFueSBjYXB0dXJlcyBwZXIgaG9zdC5cblNFTEVDVFxuICByZWdleHBfZXh0cmFjdCh1cmwsICc6Ly8oW14vXSspJywgMSkgQVMgaG9zdCxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJykgQVMgY2FwdHVyZXMsXG4gIENPVU5UKCopIEZJTFRFUiAoV0hFUkUgdHlwZSA9ICdmZWVkYmFjaycpIEFTIGNvbW1lbnRzXG5GUk9NIHBnXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBjYXB0dXJlcyBERVNDO1xuXG4tLSAzKSBGaW5kIGR1cGxpY2F0ZSBvdXRlckhUTUwgYWNyb3NzIGNhcHR1cmVzIChvZnRlbiBzaWduYWxzIGEgcmV1c2VkXG4tLSAgICBjb21wb25lbnQgdGhlIHVzZXIgaGFzIGNsaWNrZWQgaW50byBtdWx0aXBsZSB0aW1lcykuXG5TRUxFQ1Qgb3V0ZXJIVE1MLCBDT1VOVCgqKSBBUyBoaXRzLCBsaXN0KHNlbGVjdG9yKSBBUyBzZWxlY3RvcnNcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBvdXRlckhUTUwgSVMgTk9UIE5VTExcbkdST1VQIEJZIG91dGVySFRNTFxuSEFWSU5HIGhpdHMgPiAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDI1O1xuXG4tLSA0KSBDYXB0dXJlcyBzdGlsbCBtaXNzaW5nIGEgc2NyZWVuc2hvdCBwYXRoLlxuU0VMRUNUIG4sIHVybCwgc2VsZWN0b3JcbkZST00gcGdcbldIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBzY3JlZW5zaG90IElTIE5VTExcbk9SREVSIEJZIG47XG5cbi0tIDUpIFF1aWNrIGRlc2lnbi10b2tlbiBzdXJmYWNlOiByYW5rIGNsYXNzZXMgdGhhdCBhcHBlYXIgaW4gbWFueSBjYXB0dXJlcy5cbi0tICAgIE5PVEU6IGZpbHRlciBjbGFzc2VzIElTIE5PVCBOVUxMIHJhdGhlciB0aGFuIHVzaW5nIGEgY29hbGVzY2Utd2l0aC1lbXB0eVxuLS0gICAgZmFsbGJhY2s7IER1Y2tEQiBjYW5ub3QgaW5mZXIgZWxlbWVudCB0eXBlcyBmb3IgYW4gZW1wdHkgbGlzdCBsaXRlcmFsLlxuV0lUSCBleHBhbmRlZCBBUyAoXG4gIFNFTEVDVCB1bm5lc3QoY2xhc3NlcykgQVMgY1xuICBGUk9NIHBnXG4gIFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InIEFORCBjbGFzc2VzIElTIE5PVCBOVUxMXG4pXG5TRUxFQ1QgYywgQ09VTlQoKikgQVMgaGl0c1xuRlJPTSBleHBhbmRlZFxuR1JPVVAgQlkgMVxuT1JERVIgQlkgaGl0cyBERVNDXG5MSU1JVCAzMDtcblxuLS0gNikgQ29tbWVudHMgam9pbmVkIHRvIHRoZWlyIHBhcmVudCBzZWxlY3RvciB2aWEgcGFyZW50VWlkLiBUaGVcbi0tICAgIHMudHlwZSBmaWx0ZXIgcHJldmVudHMgYW4gYWNjaWRlbnRhbCBmZWVkYmFja+KGlGZlZWRiYWNrIGpvaW4gaW4gY2FzZVxuLS0gICAgdHdvIHJvd3MgZXZlciBzaGFyZSBhIHVpZCBieSBjb2luY2lkZW5jZS5cblNFTEVDVCBzLm4sIHMuc2VsZWN0b3IsIGYudGV4dCwgZi50YWdzXG5GUk9NIHBnIGZcbkpPSU4gcGcgc1xuICBPTiBzLnVpZCA9IGYucGFyZW50VWlkXG4gQU5EIHMudHlwZSA9ICdzZWxlY3RvcidcbldIRVJFIGYudHlwZSA9ICdmZWVkYmFjaydcbk9SREVSIEJZIHMubjtcbmA7XG4gIGNvbnN0IG9uRHVja0RiU25pcHBldCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBQcmVmZXIgdGhlIEpTT05MIGZpbGVuYW1lIG9mIHRoZSBtb3N0IHJlY2VudCBleHBvcnQgc28gdGhlIHVzZXIgY2FuXG4gICAgLy8gcGFzdGUgdGhpcyBkaXJlY3RseSB3aXRob3V0IGVkaXRpbmcgdGhlIHJlYWRfanNvbl9hdXRvIHBhdGguIEZhbGxcbiAgICAvLyBiYWNrIHRvIGEgZnJlc2ggZXBvY2gtYmFzZWQgbmFtZSBpZiBub3RoaW5nIGhhcyBiZWVuIGV4cG9ydGVkIHlldC5cbiAgICBjb25zdCBsYXN0ID0gbGFzdEV4cG9ydC5yZWxQYXRoO1xuICAgIGNvbnN0IGpzb25sTmFtZSA9IChsYXN0ICYmIC9cXC5qc29ubCQvLnRlc3QobGFzdCkpXG4gICAgICA/IGxhc3Quc3BsaXQoJy8nKS5wb3AoKSEgIC8vIHN0cmlwIHdvcmtzcGFjZS9leHBvcnRzLyBwcmVmaXhcbiAgICAgIDogYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBzcWwgPSBkdWNrRGJTbmlwcGV0KGpzb25sTmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNxbCk7XG4gICAgICBzZXRTdGF0dXMoYER1Y2tEQiByZWNpcGVzIGNvcGllZCDCtyBwYXN0ZSBpbnRvIFxcYGR1Y2tkYlxcYCBzaGVsbCDCtyByZWZlcmVuY2VzICR7anNvbmxOYW1lfWApO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIER1Y2tEQiBTUUwnLCBqc29ubE5hbWUpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgZmFpbGVkIOKAlCBvcGVuIHRoZSBwYW5lbCBpbiBhbiBleHRlbnNpb24gY29udGV4dCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgJ09wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jyk7XG4gICAgfVxuICB9O1xuICAvLyDilIDilIDilIAgU2NoZW1hIG1pZ3JhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ29udmVydCBhIHYxLXNoYXBlZCBFbnRyeS1vci1leHBvcnQtbGluZSBpbnRvIG91ciBpbnRlcm5hbCBFbnRyeS4gSWRlbXBvdGVudC5cbiAgLy8gU3VwcG9ydHM6XG4gIC8vICAg4oCiIGZsYXQgdjEgZW50cnkgKG5vIGBfYXVkaXRgLCBubyBgdmAgZmllbGQpXG4gIC8vICAg4oCiIHYyIGV4cG9ydCBlbnRyeSAoaGFzIGBfYXVkaXRgLCBgdjogMmAsIGB0eXBlOiAnc2VsZWN0b3InYClcbiAgLy8gICDigKIgbWl4ZWQgKHNvbWUgZmllbGRzIG5lc3RlZCwgc29tZSBmbGF0IOKAlCBsYXN0IHdpbnMgZm9yIHNhZmV0eSlcbiAgLy8gUHVyZTogbmV2ZXIgbXV0YXRlcyBgcmF3YCBvciBhbnkgb2YgaXRzIG5lc3RlZCBvYmplY3RzLiBSZXR1cm5zIGEgbmV3XG4gIC8vIGVudHJ5IHdpdGggYWxsIG1pZ3JhdGlvbnMgYXBwbGllZC4gVG91Y2hlZCBzdWJvYmplY3RzIChhdHRycywgaGludHMsXG4gIC8vIGdyb3VwIG1lbWJlcnMpIGFyZSBjbG9uZWQgYmVmb3JlIGVkaXQ7IHVudG91Y2hlZCBvbmVzIHNoYXJlIHJlZnMgd2l0aFxuICAvLyByYXcsIHdoaWNoIGlzIGZpbmUgc2luY2Ugd2UgbmV2ZXIgd3JpdGUgdG8gdGhlbS5cbiAgY29uc3QgZGVub3JtYWxpemVFbnRyeSA9IChyYXc6IGFueSk6IEVudHJ5ID0+IHtcbiAgICBjb25zdCBvdXQ6IGFueSA9IHsuLi5yYXd9O1xuICAgIGRlbGV0ZSBvdXQudjtcbiAgICBkZWxldGUgb3V0LnR5cGU7XG4gICAgZGVsZXRlIG91dC5mZWVkYmFjaztcbiAgICBpZiAob3V0Ll9hdWRpdCAmJiB0eXBlb2Ygb3V0Ll9hdWRpdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IGEgPSBvdXQuX2F1ZGl0O1xuICAgICAgaWYgKGEuYW5jZXN0b3JzICE9PSB1bmRlZmluZWQpIG91dC5hbmNlc3RvcnMgPSBhLmFuY2VzdG9ycztcbiAgICAgIGlmIChhLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgb3V0LmNvbXBvbmVudFJvb3QgPSBhLmNvbXBvbmVudFJvb3Q7XG4gICAgICBpZiAoYS5pblNoYWRvd0RPTSAhPT0gdW5kZWZpbmVkKSBvdXQuaW5TaGFkb3dET00gPSBhLmluU2hhZG93RE9NO1xuICAgICAgaWYgKGEucHNldWRvRWxlbWVudHMgIT09IHVuZGVmaW5lZCkgb3V0LnBzZXVkb0VsZW1lbnRzID0gYS5wc2V1ZG9FbGVtZW50cztcbiAgICAgIGlmIChhLm1hdGNoZWRSdWxlcyAhPT0gdW5kZWZpbmVkKSBvdXQubWF0Y2hlZFJ1bGVzID0gYS5tYXRjaGVkUnVsZXM7XG4gICAgICBpZiAoYS52aWV3cG9ydCAhPT0gdW5kZWZpbmVkKSBvdXQudmlld3BvcnQgPSBhLnZpZXdwb3J0O1xuICAgICAgZGVsZXRlIG91dC5fYXVkaXQ7XG4gICAgfVxuICAgIC8vIHN0YXRlczogdjEgdXNlZCBSZWNvcmQ8c3RyaW5nLCB0cnVlPjsgdjIgdXNlcyBzdHJpbmdbXS4gTm9ybWFsaXplIGJvdGguXG4gICAgaWYgKG91dC5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkob3V0LnN0YXRlcykgJiYgdHlwZW9mIG91dC5zdGF0ZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICBvdXQuc3RhdGVzID0gT2JqZWN0LmtleXMob3V0LnN0YXRlcykuZmlsdGVyKChrKSA9PiBCb29sZWFuKChvdXQuc3RhdGVzIGFzIGFueSlba10pKTtcbiAgICB9XG4gICAgLy8gYXR0cnMuZm9ybWF0IOKGkiBoaW50cy5mb3JtYXQuIENsb25lIGF0dHJzIGZpcnN0IHNvIHdlIGRvbid0IG11dGF0ZSB0aGVcbiAgICAvLyBjYWxsZXIncyBuZXN0ZWQgb2JqZWN0LiBTYW1lIGZvciBoaW50cyAod2UgbWF5IG1lcmdlIGludG8gaXQpLlxuICAgIGlmIChvdXQuYXR0cnMgJiYgdHlwZW9mIG91dC5hdHRycyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG91dC5hdHRycy5mb3JtYXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBmbXQgPSBvdXQuYXR0cnMuZm9ybWF0O1xuICAgICAgY29uc3Qge2Zvcm1hdDogX2Ryb3AsIC4uLnJlc3RBdHRyc30gPSBvdXQuYXR0cnM7XG4gICAgICBvdXQuYXR0cnMgPSByZXN0QXR0cnM7XG4gICAgICBvdXQuaGludHMgPSB7Li4uKG91dC5oaW50cyA/PyB7fSksIGZvcm1hdDogZm10fTtcbiAgICB9XG4gICAgaWYgKCFvdXQudWlkKSBvdXQudWlkID0gbXNnSWQoKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvdXQuZ3JvdXApKSBvdXQuZ3JvdXAgPSBvdXQuZ3JvdXAubWFwKGRlbm9ybWFsaXplRW50cnkpO1xuICAgIHJldHVybiBvdXQgYXMgRW50cnk7XG4gIH07XG4gIC8vIFdhbGsgYWxsIGxvYWRlZCBtZXNzYWdlcyBhbmQgbWlncmF0ZSBhbnkgbGVnYWN5IGVudHJpZXMuIFJldHVybnMgdHJ1ZSBpZlxuICAvLyBhbnl0aGluZyBtdXRhdGVkIHNvIHRoZSBjYWxsZXIgY2FuIHBlcnNpc3QuXG4gIGNvbnN0IG1pZ3JhdGVMb2FkZWRNZXNzYWdlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICBsZXQgbXV0YXRlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBiZWZvcmUgPSBtLmVudHJ5O1xuICAgICAgLy8gQ2hlYXAgcHJlLWNoZWNrOiBpZiB1aWQgZXhpc3RzIEFORCBzdGF0ZXMgaXMgYW4gYXJyYXkgQU5EIG5vIF9hdWRpdFxuICAgICAgLy8gQU5EIG5vIGF0dHJzLmZvcm1hdCDihpIgbm90aGluZyB0byBkbywgc2tpcCB0aGUgd29yay5cbiAgICAgIGNvbnN0IG5lZWRzV29yayA9XG4gICAgICAgICFiZWZvcmUudWlkIHx8XG4gICAgICAgIChiZWZvcmUuc3RhdGVzICYmICFBcnJheS5pc0FycmF5KGJlZm9yZS5zdGF0ZXMpKSB8fFxuICAgICAgICAoYmVmb3JlIGFzIGFueSkuX2F1ZGl0ICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgKGJlZm9yZS5hdHRycyAmJiB0eXBlb2YgKGJlZm9yZS5hdHRycyBhcyBhbnkpLmZvcm1hdCA9PT0gJ3N0cmluZycpO1xuICAgICAgaWYgKCFuZWVkc1dvcmspIGNvbnRpbnVlO1xuICAgICAgbS5lbnRyeSA9IGRlbm9ybWFsaXplRW50cnkoYmVmb3JlKTtcbiAgICAgIG11dGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gbXV0YXRlZDtcbiAgfTtcbiAgY29uc3Qgb25JbXBvcnQgPSAoKTogdm9pZCA9PiBpbXBvcnRGaWxlLmNsaWNrKCk7XG4gIGltcG9ydEZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKGUpID0+IHtcbiAgICBjb25zdCBmaWxlID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzPy5bMF07XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgY29uc3QgaW1wb3J0ZWQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgZm9yIChjb25zdCBsaW5lIG9mIHRleHQuc3BsaXQoL1xccj9cXG4vKSkge1xuICAgICAgaWYgKCFsaW5lLnRyaW0oKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBvID0gSlNPTi5wYXJzZShsaW5lKTtcbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ21hbmlmZXN0Jykge1xuICAgICAgICAgIC8vIE1hbmlmZXN0IGxpbmUg4oCUIGluZm9ybWF0aW9uYWwgb25seSBvbiBpbXBvcnQuIFNraXAuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG8udHlwZSA9PT0gJ3BhZ2UnKSBpbXBvcnRlZC5wdXNoKHt0eXBlOiAncGFnZScsIGlkOiBtc2dJZCgpLCB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHVybDogby51cmwsIHRpdGxlOiBvLnRpdGxlLCB2aWV3cG9ydDogby52aWV3cG9ydCwgdG9rZW5zOiBvLnRva2VucywgdXNlckFnZW50OiBvLnVzZXJBZ2VudCwgbGFuZzogby5sYW5nfSk7XG4gICAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dDogby50ZXh0LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKG8ucGFyZW50VWlkKSBmYi5wYXJlbnRVaWQgPSBvLnBhcmVudFVpZDtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvLnRhZ3MpICYmIG8udGFncy5sZW5ndGgpIGZiLnRhZ3MgPSBvLnRhZ3M7XG4gICAgICAgICAgaWYgKG8uc2V2ZXJpdHkpIGZiLnNldmVyaXR5ID0gby5zZXZlcml0eTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKGZiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzZWxlY3RvciBsaW5lIOKAlCBjb3VsZCBiZSB2MSAoZmxhdCkgb3IgdjIgKHdpdGggX2F1ZGl0KS4gVGhlXG4gICAgICAgICAgLy8gYnVuZGxlZCBmZWVkYmFjayBhcnJheSBtdXN0IGJlIHNwbGl0IG91dCBpbnRvIHNlcGFyYXRlIGZlZWRiYWNrXG4gICAgICAgICAgLy8gbWVzc2FnZXMgZm9yIHJvdW5kLXRyaXAgd2l0aCB2MSByZWFkZXJzIOKAlCBidXQgaW4gdjIgd2UgYWxyZWFkeVxuICAgICAgICAgIC8vIGVtaXQgc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lcywgc28gZHJvcHBpbmcgdGhlIGJ1bmRsZWQgbGlzdCBpc1xuICAgICAgICAgIC8vIHNhZmUgdG8gYXZvaWQgZG91YmxlLWNvdW50aW5nLlxuICAgICAgICAgIGNvbnN0IGZiID0gQXJyYXkuaXNBcnJheShvLmZlZWRiYWNrKSA/IG8uZmVlZGJhY2sgOiBudWxsO1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShvKTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeX0pO1xuICAgICAgICAgIC8vIE9ubHkgaW5mbGF0ZSBidW5kbGVkIGZlZWRiYWNrIGlmIHRoZSBmaWxlIGlzIHYxIChubyB2ZXJzaW9uXG4gICAgICAgICAgLy8gbWFya2VyIG9uIHRoZSBzZWxlY3RvciBsaW5lcykuIHYyIGhhcyBpdHMgb3duIHN0YW5kYWxvbmVcbiAgICAgICAgICAvLyBmZWVkYmFjayBsaW5lcyB0aGF0IGFycml2ZSBzZXBhcmF0ZWx5LlxuICAgICAgICAgIGlmIChmYiAmJiBvLnYgIT09IDIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBmYikgaW1wb3J0ZWQucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgIHRleHQ6IHR5cGVvZiB0ID09PSAnc3RyaW5nJyA/IHQgOiB0Py50ZXh0ID8/ICcnLFxuICAgICAgICAgICAgICBwYXJlbnRVaWQ6IGVudHJ5LnVpZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7IC8qIHNraXAgYmFkIGxpbmUgKi8gfVxuICAgIH1cbiAgICBtZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgLi4uaW1wb3J0ZWRdO1xuICAgIHBlcnNpc3QoKTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKGBJbXBvcnRlZCAke2ltcG9ydGVkLmxlbmd0aH0gbWVzc2FnZSR7aW1wb3J0ZWQubGVuZ3RoID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgaW1wb3J0RmlsZS52YWx1ZSA9ICcnO1xuICB9KTtcbiAgLy8g4pSA4pSA4pSAIFdvcmtzcGFjZSBzbmFwc2hvdCBoaXN0b3J5IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBQZXJzaXN0ZW50IChub3QgdGhlIGluLXNlc3Npb24gdW5kbyBzdGFjaykuIEEgQ2xlYXItYWxsIGFyY2hpdmVzIHRoZVxuICAvLyBjdXJyZW50IHdvcmtzcGFjZSBzdGF0ZSBzbyBpdCBjYW4gYmUgcmVzdG9yZWQgZnJvbSBTZXR0aW5ncyBsYXRlci5cbiAgbGV0IHdzU25hcHNob3RzOiBXb3Jrc3BhY2VTbmFwc2hvdFtdID0gW107XG4gIGNvbnN0IGxvYWRXc1NuYXBzaG90cyA9IGFzeW5jIChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICB3c1NuYXBzaG90cyA9IChhd2FpdCBTdG9yZS5nZXQ8V29ya3NwYWNlU25hcHNob3RbXT4od3NTbmFwc2hvdHNLZXkobmFtZSksIFtdKSkgfHwgW107XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RXc1NuYXBzaG90cyA9ICgpOiB2b2lkID0+IHsgdm9pZCBTdG9yZS5zZXQod3NTbmFwc2hvdHNLZXkoYWN0aXZlV3MpLCB3c1NuYXBzaG90cyk7IH07XG4gIC8vIEFyY2hpdmUgdGhlIENVUlJFTlQgd29ya3NwYWNlIHN0YXRlIChiZWZvcmUgaXQncyB3aXBlZCkuIE5vLW9wIGlmIGVtcHR5LlxuICBjb25zdCBhcmNoaXZlV29ya3NwYWNlU25hcHNob3QgPSAoKTogV29ya3NwYWNlU25hcHNob3QgfCBudWxsID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgc25hcDogV29ya3NwYWNlU25hcHNob3QgPSB7XG4gICAgICBpZDogc2VjdXJlVG9rZW4oOCksXG4gICAgICB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgbWVzc2FnZXM6IHN0cnVjdHVyZWRDbG9uZShtZXNzYWdlcyksXG4gICAgICBzaG90czogT2JqZWN0LmZyb21FbnRyaWVzKHNob3RzKSxcbiAgICAgIHNlbGVjdG9yczogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLmxlbmd0aCxcbiAgICAgIGNvbW1lbnRzOiBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykubGVuZ3RoLFxuICAgIH07XG4gICAgLy8gTmV3ZXN0IGZpcnN0OyBjYXAgdGhlIGhpc3RvcnkuXG4gICAgd3NTbmFwc2hvdHMudW5zaGlmdChzbmFwKTtcbiAgICBpZiAod3NTbmFwc2hvdHMubGVuZ3RoID4gV1NfU05BUFNIT1RfQ0FQKSB3c1NuYXBzaG90cyA9IHdzU25hcHNob3RzLnNsaWNlKDAsIFdTX1NOQVBTSE9UX0NBUCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmV0dXJuIHNuYXA7XG4gIH07XG4gIGNvbnN0IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdCA9IChpZDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3Qgc25hcCA9IHdzU25hcHNob3RzLmZpbmQoKHMpID0+IHMuaWQgPT09IGlkKTtcbiAgICBpZiAoIXNuYXApIHJldHVybiBmYWxzZTtcbiAgICAvLyBQdXNoIHRoZSBsaXZlIHN0YXRlIG9udG8gdGhlIGluLXNlc3Npb24gdW5kbyBzdGFjayBzbyBhIG1pc3Rha2VuXG4gICAgLy8gcmVzdG9yZSBpcyBpdHNlbGYgdW5kb2FibGUuXG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IHN0cnVjdHVyZWRDbG9uZShzbmFwLm1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHNuYXAuc2hvdHMpKSBzaG90cy5zZXQoaywgdik7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICBzZXRTdGF0dXMoYFJlc3RvcmVkIHNuYXBzaG90IMK3ICR7c25hcC5zZWxlY3RvcnN9IHNlbGVjdG9yc2ApO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICBjb25zdCBkZWxldGVXb3Jrc3BhY2VTbmFwc2hvdCA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5maWx0ZXIoKHMpID0+IHMuaWQgIT09IGlkKTtcbiAgICBwZXJzaXN0V3NTbmFwc2hvdHMoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gIH07XG5cbiAgY29uc3Qgb25DbGVhciA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWNvbmZpcm0oJ0NsZWFyIGFsbCBjYXB0dXJlcyBhbmQgY29tbWVudHM/JykpIHJldHVybjtcbiAgICAvLyBBcmNoaXZlIHRoZSB3b3Jrc3BhY2UgQkVGT1JFIHdpcGluZyBzbyBpdCBjYW4gYmUgcmVzdG9yZWQgbGF0ZXIuXG4gICAgYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90KCk7XG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IFtdO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICBzZXRTdGF0dXMoJ0NsZWFyZWQgwrcgc25hcHNob3Qgc2F2ZWQnKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgVmFsaWRhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgcnVuVmFsaWRhdGlvbiA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBbLi4ubmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3RvcikpXTtcbiAgICBpZiAoIXNlbGVjdG9ycy5sZW5ndGggfHwgIWluRXh0ZW5zaW9uKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICBpZiAoIXRhYnNbMF0pIHJldHVybjtcbiAgICAgIGxpdmVUYWJVcmwgPSB0YWJzWzBdLnVybCA/PyBsaXZlVGFiVXJsO1xuICAgICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YobGl2ZVRhYlVybCA/PyAnJyk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQhLCBwZyh7a2luZDogJ3ZhbGlkYXRlJywgc2VsZWN0b3JzfSkpIGFzIHt2YWxpZD86IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+fTtcbiAgICAgIGlmIChyZXBseT8udmFsaWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBbc2VsLCBva10gb2YgT2JqZWN0LmVudHJpZXMocmVwbHkudmFsaWQpKSB7XG4gICAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgICAgaWYgKCFvaykgc2VsZWN0b3JFcnJvcnMuc2V0KHNlbCwgJ05vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzIHRoaXMgc2VsZWN0b3IuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIHRhYiBub3QgcmVhZHkgKi8gfVxuICB9O1xuICBjb25zdCBvblZhbGlkYXRlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHNldFN0YXR1cygnUmUtY2hlY2tpbmfigKYnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHNldFN0YXR1cygnVmFsaWRhdGVkJyk7XG4gIH07XG5cbiAgLy8gKFNjcmVlbnNob3QgbWFjaGluZXJ5IHJlbW92ZWQgYWxvbmdzaWRlIHRoZSAucHJldmlldyB0aWxlLilcblxuICAvLyDilIDilIDilIAgR2l0SHViIHN0YXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBmZXRjaFN0YXJzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGNhY2hlS2V5ID0gJ3BpbmNoZ3JhYi5naC5zdGFycyc7XG4gICAgY29uc3QgY2FjaGVkID0gYXdhaXQgU3RvcmUuZ2V0PHtjb3VudDogbnVtYmVyOyB0czogbnVtYmVyfSB8IG51bGw+KGNhY2hlS2V5LCBudWxsKTtcbiAgICBpZiAoY2FjaGVkICYmIERhdGUubm93KCkgLSBjYWNoZWQudHMgPCAzXzYwMF8wMDApIHtcbiAgICAgIHN0YXJzRWwudGV4dENvbnRlbnQgPSBTdHJpbmcoY2FjaGVkLmNvdW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy93cmFubmdsZS9waW5jaGdyYWInLCB7Y2FjaGU6ICduby1zdG9yZSd9KTtcbiAgICAgIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKCdzdGF0dXMgJyArIHIuc3RhdHVzKTtcbiAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKSBhcyB7c3RhcmdhemVyc19jb3VudD86IG51bWJlcn07XG4gICAgICBjb25zdCBjb3VudCA9IGouc3RhcmdhemVyc19jb3VudCA/PyAwO1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudCk7XG4gICAgICB2b2lkIFN0b3JlLnNldChjYWNoZUtleSwge2NvdW50LCB0czogRGF0ZS5ub3coKX0pO1xuICAgIH0gY2F0Y2ggeyBzdGFyc0VsLnRleHRDb250ZW50ID0gJ8K3JzsgfVxuICB9O1xuICBjb25zdCBvbkdpdGh1YiA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3dyYW5uZ2xlL3BpbmNoZ3JhYic7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSBjaHJvbWUudGFicy5jcmVhdGUoe3VybH0pO1xuICAgIGVsc2Ugd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJ25vb3BlbmVyJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNldHRpbmdzIGRyYXdlciAvIHdvcmtzcGFjZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFwcGx5UHJlZnNUb1VJID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W2RhdGEtcHJlZl0nKSkge1xuICAgICAgZWwuY2hlY2tlZCA9IEJvb2xlYW4ocHJlZnNbZWwuZGF0YXNldC5wcmVmIGFzIGtleW9mIFByZWZzXSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTFRleHRBcmVhRWxlbWVudD4oJ3RleHRhcmVhW2RhdGEtcHJlZi10ZXh0XScpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyhwcmVmc1tlbC5kYXRhc2V0LnByZWZUZXh0IGFzIGtleW9mIFByZWZzXSA/PyAnJyk7XG4gICAgfVxuICAgIC8vIFBsYWluLXRleHQgaW5wdXRzIChkZXNpZ25QYXRoLCBza2lsbFBhdGgpIGFsc28gdXNlIGRhdGEtcHJlZi10ZXh0LlxuICAgIGZvciAoY29uc3QgZWwgb2YgZHJhd2VyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW2RhdGEtcHJlZi10ZXh0XScpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyhwcmVmc1tlbC5kYXRhc2V0LnByZWZUZXh0IGFzIGtleW9mIFByZWZzXSA/PyAnJyk7XG4gICAgfVxuICAgIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCk7XG4gIH07XG4gIC8vIFJlbmRlciB0aGUgZGVzaWduLW1kIC8gc2tpbGwtbWQgc3RhdHVzIGxhYmVscyBhbmQgdGhlIHRlbXBsYXRlLWJhbm5lclxuICAvLyBzbyB0aGUgdXNlciBzZWVzIGF0IGEgZ2xhbmNlIHdoZXRoZXIgdGhleSdyZSBzaGlwcGluZyBhIGN1c3RvbWl6ZWRcbiAgLy8gZmlsZSB2cy4gZmFsbGluZyBiYWNrIHRvIHRoZSBidW5kbGVkIHRlbXBsYXRlLiBBc3luYyBiZWNhdXNlIHdlXG4gIC8vIG5lZWQgdG8gcmVhZCB0aGUgYnVuZGxlZCBmaWxlJ3Mgc2l6ZSB0byBkaXNwbGF5IFwidGVtcGxhdGUgwrcgTiBsaW5lc1wiXG4gIC8vIGV2ZW4gd2hlbiBwcmVmcyBpcyBlbXB0eS5cbiAgY29uc3QgdXBkYXRlTWRTdGF0dXNlcyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBkZXNpZ25FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kZXNpZ24tbWQtc3RhdHVzXScpO1xuICAgIGNvbnN0IHNraWxsRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc2tpbGwtbWQtc3RhdHVzXScpO1xuICAgIGNvbnN0IGRlc2lnbkJhbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS10ZW1wbGF0ZS1iYW5uZXI9XCJkZXNpZ25cIl0nKTtcbiAgICBjb25zdCBza2lsbEJhbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS10ZW1wbGF0ZS1iYW5uZXI9XCJza2lsbFwiXScpO1xuICAgIGNvbnN0IHRhZyA9IChtZDogc3RyaW5nLCBpc1RwbDogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICBjb25zdCBsaW5lcyA9IG1kLnNwbGl0KCdcXG4nKS5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFttZF0pLnNpemU7XG4gICAgICByZXR1cm4gYCR7aXNUcGwgPyAndGVtcGxhdGUnIDogJ2N1c3RvbSd9IMK3ICR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgIH07XG4gICAgaWYgKGRlc2lnbkVsKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICAgIGRlc2lnbkVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIDogJyhlbXB0eSknO1xuICAgICAgZGVzaWduRWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLWNvbnRlbnQnLCAhaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpO1xuICAgIH1cbiAgICBpZiAoc2tpbGxFbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICAgIHNraWxsRWwudGV4dENvbnRlbnQgPSBjb250ZW50LnRyaW0oKSA/IHRhZyhjb250ZW50LCBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKSA6ICcoZW1wdHkpJztcbiAgICAgIHNraWxsRWwuY2xhc3NMaXN0LnRvZ2dsZSgnaGFzLWNvbnRlbnQnLCAhaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSk7XG4gICAgfVxuICAgIGlmIChkZXNpZ25CYW5uZXIpIGRlc2lnbkJhbm5lci5oaWRkZW4gPSAhaXNVc2luZ1RlbXBsYXRlRGVzaWduKCk7XG4gICAgaWYgKHNraWxsQmFubmVyKSBza2lsbEJhbm5lci5oaWRkZW4gPSAhaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICAvLyBBbHNvIHJlZnJlc2ggdGhlIGNvbXBhY3QgcHJldmlldyB0ZXh0IG9uIHRoZSBlZGl0b3Itcm93IGJ1dHRvbi5cbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ2Rlc2lnbicpO1xuICAgIGF3YWl0IHJlbmRlck1kUHJldmlldygnc2tpbGwnKTtcbiAgfTtcbiAgLy8gQmFjay1jb21wYXQgYWxpYXMg4oCUIGVhcmxpZXIgY29kZSBwYXRocyBjYWxsZWQgdXBkYXRlRGVzaWduTWRTdGF0dXMoKS5cbiAgY29uc3QgdXBkYXRlRGVzaWduTWRTdGF0dXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgdXBkYXRlTWRTdGF0dXNlcygpOyB9O1xuXG4gIC8vIOKUgOKUgOKUgCBDb21wYWN0IHByZXZpZXcgKyBtb2RhbCBlZGl0b3IgZm9yIERFU0lHTi5tZCAvIFNLSUxMLm1kIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBSZXBsYWNlcyB0aGUgZ2lhbnQgaW5saW5lIHRleHRhcmVhcyB3aXRoIHNtYWxsIGRvY3VtZW50IHN1bW1hcmllcy5cbiAgdHlwZSBNZEtpbmQgPSAnZGVzaWduJyB8ICdza2lsbCc7XG4gIGNvbnN0IG1hcmtkb3duT3ZlcnZpZXcgPSAoY29udGVudDogc3RyaW5nLCBraW5kOiBNZEtpbmQsIHVzaW5nVGVtcGxhdGU6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzID0gY29udGVudC50cmltKCkgPyBjb250ZW50LnNwbGl0KCdcXG4nKS5sZW5ndGggOiAwO1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IEJsb2IoW2NvbnRlbnRdKS5zaXplO1xuICAgIGNvbnN0IGhlYWRpbmdzID0gY29udGVudFxuICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgLm1hcCgobGluZSkgPT4gL14jezEsM31cXHMrKC4rKSQvLmV4ZWMobGluZS50cmltKCkpPy5bMV0/LnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoKGhlYWRpbmcpOiBoZWFkaW5nIGlzIHN0cmluZyA9PiBCb29sZWFuKGhlYWRpbmcpKVxuICAgICAgLnNsaWNlKDAsIDQpO1xuICAgIC8vIFdhcm0sIHBsYWluLWxhbmd1YWdlIGZyYW1pbmcgb2Ygd2hhdCBlYWNoIGZpbGUgdGVhY2hlcyB0aGUgYWdlbnQuXG4gICAgLy8gREVTSUdOLm1kIGlzIHRoZSBoZWFkbGluZSBhcnRpZmFjdDogaXQncyB3aGVyZSB5b3UgZGVzY3JpYmUgeW91ciBvd25cbiAgICAvLyBicmFuZCBhbmQgVUkgdGFzdGUgc28gdGhlIGFnZW50IGJ1aWxkcyBpbiAqeW91ciogdm9pY2UgcmF0aGVyIHRoYW4gYVxuICAgIC8vIGdlbmVyaWMgZGVmYXVsdC4gU0tJTEwubWQgaXMgdGhlIGFkdmFuY2VkIHRyaWFnZSBndWlkZSBmb3IgcmVhZGluZ1xuICAgIC8vIGV4cG9ydHMg4oCUIHVzZWZ1bCwgYnV0IG5vdCB3aGVyZSBtb3N0IHBlb3BsZSBzaG91bGQgc3RhcnQuXG4gICAgY29uc3QgbGFiZWwgPSBraW5kID09PSAnZGVzaWduJ1xuICAgICAgPyAnVGVhY2hlcyB5b3VyIGFnZW50IHRvIGJ1aWxkIFVJIGluIHlvdXIgYnJhbmQnXG4gICAgICA6ICdBZHZhbmNlZDogaG93IHlvdXIgYWdlbnQgc2hvdWxkIHJlYWQgUGluY2hHcmFiIGV4cG9ydHMnO1xuICAgIGNvbnN0IHNvdXJjZSA9IHVzaW5nVGVtcGxhdGVcbiAgICAgID8gKGtpbmQgPT09ICdkZXNpZ24nID8gJ1N0YXJ0ZXIgdGVtcGxhdGUg4oCUIG1ha2UgaXQgeW91cnMnIDogJ0J1bmRsZWQgdGVtcGxhdGUnKVxuICAgICAgOiAnQ3VzdG9taXplZCc7XG4gICAgY29uc3Qgc2VjdGlvbnMgPSBoZWFkaW5ncy5sZW5ndGggPyBoZWFkaW5ncy5qb2luKCcgLyAnKSA6ICdObyBzZWN0aW9uIGhlYWRpbmdzIGZvdW5kJztcbiAgICByZXR1cm4gYCR7bGFiZWx9XFxuJHtzb3VyY2V9IMK3ICR7bGluZXMudG9Mb2NhbGVTdHJpbmcoKX0gbGluZXMgwrcgJHsoYnl0ZXMgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQlxcblNlY3Rpb25zOiAke3NlY3Rpb25zfWA7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyTWRQcmV2aWV3ID0gYXN5bmMgKGtpbmQ6ICdkZXNpZ24nIHwgJ3NraWxsJyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHByZXZpZXdFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1tZC1wcmV2aWV3PVwiJHtraW5kfVwiXWApO1xuICAgIGlmICghcHJldmlld0VsKSByZXR1cm47XG4gICAgY29uc3QgY29udGVudCA9IGtpbmQgPT09ICdkZXNpZ24nID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0ga2luZCA9PT0gJ2Rlc2lnbicgPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgcHJldmlld0VsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyhjb250ZW50LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgfTtcblxuICBjb25zdCBvcGVuTWRNb2RhbCA9IGFzeW5jIChraW5kOiBNZEtpbmQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgIGlmICghb3ZlcmxheSkgcmV0dXJuO1xuICAgIGNvbnN0IHRpdGxlRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC10aXRsZV0nKSE7XG4gICAgY29uc3QgdGFFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGV4dGFyZWFdJykhO1xuICAgIGNvbnN0IHN0YXRzRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdGF0c10nKSE7XG4gICAgY29uc3QgYmFubmVyRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1iYW5uZXJdJykhO1xuICAgIGNvbnN0IHN1bW1hcnlFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXN1bW1hcnldJykhO1xuICAgIGNvbnN0IHNhdmVCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zYXZlXScpITtcbiAgICBjb25zdCByZXNldEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXJlc2V0XScpITtcbiAgICBjb25zdCB1cGxvYWRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC11cGxvYWRdJykhO1xuICAgIGNvbnN0IGRvd25sb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtZG93bmxvYWRdJykhO1xuICAgIGNvbnN0IGNsb3NlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtY2xvc2VdJykhO1xuXG4gICAgY29uc3QgaXNEZXNpZ24gPSBraW5kID09PSAnZGVzaWduJztcbiAgICBjb25zdCBpbml0aWFsID0gaXNEZXNpZ24gPyBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpIDogYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGNvbnN0IHVzaW5nVGVtcGxhdGUgPSBpc0Rlc2lnbiA/IGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpIDogaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gaXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdQaW5jaEdyYWIgU0tJTEwubWQnO1xuICAgIHRhRWwudmFsdWUgPSBpbml0aWFsO1xuICAgIG92ZXJsYXkuZGF0YXNldC5raW5kID0ga2luZDtcblxuICAgIGNvbnN0IHJlZnJlc2hTdGF0cyA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSB0YUVsLnZhbHVlO1xuICAgICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KCdcXG4nKS5sZW5ndGg7XG4gICAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFt0ZXh0XSkuc2l6ZTtcbiAgICAgIHN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtsaW5lc30gbGluZXMgwrcgJHsoYnl0ZXMgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gICAgICBzdW1tYXJ5RWwudGV4dENvbnRlbnQgPSBtYXJrZG93bk92ZXJ2aWV3KHRleHQsIGtpbmQsIHVzaW5nVGVtcGxhdGUpO1xuICAgIH07XG4gICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgYmFubmVyRWwuaGlkZGVuID0gIXVzaW5nVGVtcGxhdGU7XG4gICAgYmFubmVyRWwudGV4dENvbnRlbnQgPSB1c2luZ1RlbXBsYXRlXG4gICAgICA/IGDimqAgQ3VycmVudGx5IHNoaXBwaW5nIHRoZSBidW5kbGVkICR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHRlbXBsYXRlIOKAlCBlZGl0cyBoZXJlIGJlY29tZSB5b3VyIGN1c3RvbWl6ZWQgdmVyc2lvbi5gXG4gICAgICA6ICcnO1xuICAgIHRhRWwub25pbnB1dCA9IHJlZnJlc2hTdGF0cztcblxuICAgIGNvbnN0IG9uU2F2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSB0YUVsLnZhbHVlO1xuICAgICAgLy8gU2F2ZSBlbXB0eSBzdHJpbmcg4oaSIHJldmVydCB0byB0ZW1wbGF0ZSBmYWxsYmFjay4gQW55dGhpbmcgbm9uLWVtcHR5XG4gICAgICAvLyDihpIgdXNlciBjdXN0b21pemF0aW9uIChwZXJzaXN0ZWQgaW4gY2hyb21lLnN0b3JhZ2UpLlxuICAgICAgaWYgKGlzRGVzaWduKSBwcmVmcy5kZXNpZ25NZCA9IHRleHQ7XG4gICAgICBlbHNlIHByZWZzLnNraWxsTWQgPSB0ZXh0O1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTtcbiAgICAgIHNldFN0YXR1cyhgJHtpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1NLSUxMLm1kJ30gc2F2ZWRgKTtcbiAgICAgIGNsb3NlTWRNb2RhbCgpO1xuICAgIH07XG4gICAgY29uc3Qgb25SZXNldCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHRhRWwudmFsdWUgPSAnJzsgLy8gZW1wdHkgPSBmYWxsYmFjayB0byBidW5kbGVkIHRlbXBsYXRlXG4gICAgICByZWZyZXNoU3RhdHMoKTtcbiAgICAgIGJhbm5lckVsLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgYmFubmVyRWwudGV4dENvbnRlbnQgPSAnQ2xlYXJlZCDigJQgU2F2ZSB0byByZXZlcnQgdG8gYnVuZGxlZCB0ZW1wbGF0ZSwgb3IgcGFzdGUgbmV3IGNvbnRlbnQuJztcbiAgICB9O1xuICAgIGNvbnN0IG9uVXBsb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgaW5wdXRJZCA9IGlzRGVzaWduID8gJ2Rlc2lnbi1tZC1maWxlJyA6ICdza2lsbC1tZC1maWxlJztcbiAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgfTtcbiAgICBjb25zdCBvbkRvd25sb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGlzRGVzaWduID8gJ0RFU0lHTi50ZW1wbGF0ZS5tZCcgOiAnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJztcbiAgICAgIGRvd25sb2FkVGV4dChuYW1lLCB0YUVsLnZhbHVlKTtcbiAgICB9O1xuXG4gICAgc2F2ZUJ0bi5vbmNsaWNrID0gb25TYXZlO1xuICAgIHJlc2V0QnRuLm9uY2xpY2sgPSBvblJlc2V0O1xuICAgIHVwbG9hZEJ0bi5vbmNsaWNrID0gb25VcGxvYWQ7XG4gICAgZG93bmxvYWRCdG4ub25jbGljayA9IG9uRG93bmxvYWQ7XG4gICAgY2xvc2VCdG4ub25jbGljayA9IGNsb3NlTWRNb2RhbDtcbiAgICBvdmVybGF5LmhpZGRlbiA9IGZhbHNlO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0YUVsLmZvY3VzKCkpO1xuICB9O1xuXG4gIGNvbnN0IGNsb3NlTWRNb2RhbCA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsXScpO1xuICAgIGlmIChvdmVybGF5KSBvdmVybGF5LmhpZGRlbiA9IHRydWU7XG4gIH07XG5cbiAgY29uc3QgZG93bmxvYWRUZXh0ID0gKGZpbGVuYW1lOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgbWltZSA9ICd0ZXh0L21hcmtkb3duJyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHt0eXBlOiBtaW1lfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDsgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7IGEuY2xpY2soKTsgYS5yZW1vdmUoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gIH07XG5cbiAgY29uc3Qgd2lyZU1kRmlsZUlucHV0ID0gKGlkOiBzdHJpbmcsIHByZWZLZXk6ICdkZXNpZ25NZCcgfCAnc2tpbGxNZCcsIGxhYmVsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG4gICAgZmlsZUlucHV0Py5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gZmlsZUlucHV0LmZpbGVzPy5bMF07XG4gICAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICAgIGlmIChmaWxlLnNpemUgPiA1ICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgc2V0U3RhdHVzKGAke2xhYmVsfSB0b28gbGFyZ2UgKCR7KGZpbGUuc2l6ZSAvIDEwMjQgLyAxMDI0KS50b0ZpeGVkKDEpfSBNQiA+IDUgTUIgY2FwKWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3ByZWZLZXldID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdXBsb2FkZWQgwrcgJHtmaWxlLm5hbWV9IMK3ICR7KGZpbGUuc2l6ZSAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYCk7XG4gICAgICBmaWxlSW5wdXQudmFsdWUgPSAnJztcbiAgICB9KTtcbiAgfTtcbiAgd2lyZU1kRmlsZUlucHV0KCdkZXNpZ24tbWQtZmlsZScsICdkZXNpZ25NZCcsICdERVNJR04ubWQnKTtcbiAgd2lyZU1kRmlsZUlucHV0KCdza2lsbC1tZC1maWxlJywgJ3NraWxsTWQnLCAnU0tJTEwubWQnKTtcbiAgZHJhd2VyPy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICBpZiAoKHQgYXMgSFRNTElucHV0RWxlbWVudCkuZGF0YXNldD8ucHJlZikge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWYhXSA9IEJvb2xlYW4oKHQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCk7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodC5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9ICh0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgLy8gVGV4dGFyZWEgaW5wdXRzIGFsc28gZmlyZSBgaW5wdXRgIGV2ZW50cyBhcyB0aGUgdXNlciB0eXBlcyDigJQgd2Ugd2FudCB0b1xuICAvLyBzYXZlIHRob3NlIGluY3JlbWVudGFsbHkgc28gYSBwYW5lbCByZWxvYWQgZG9lc24ndCBsb3NlIGhhbGYtdHlwZWRcbiAgLy8gZW50cmllcy4gYGNoYW5nZWAgb25seSBmaXJlcyBvbiBibHVyIGZvciB0ZXh0YXJlYXMuXG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICh0Py5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9IHQudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBvcGVuRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gZmFsc2U7IHJlbmRlcldzQ29udHJvbHMoKTsgfTtcbiAgY29uc3QgY2xvc2VEcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSB0cnVlOyB9O1xuXG4gIC8vIFJldXNhYmxlIGNyZWF0ZS13b3Jrc3BhY2UgZmxvdzogdmFsaWRhdGVzIHVuaXF1ZW5lc3MsIHBlcnNpc3RzLCBzd2l0Y2hlcy5cbiAgLy8gU2hhcmVkIGJ5IHRoZSBzZXR0aW5ncyBDcmVhdGUgYnV0dG9uIGFuZCB0aGUgaGVhZGVyIGRyb3Bkb3duJ3NcbiAgLy8gXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gYm90aCBwYXRocyBiZWhhdmUgaWRlbnRpY2FsbHkuXG4gIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUZsb3cgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5hbWUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gdHJpbW1lZCkpIHtcbiAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZTogdHJpbW1lZCwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodHJpbW1lZCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHNldFN0YXR1cyhgQ3JlYXRlZCB3b3Jrc3BhY2UgXCIke3RyaW1tZWR9XCJgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICAvLyBJbmxpbmUgXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gdXNlcnMgY2FuIHNwaW4gdXAgYSB3b3Jrc3BhY2VcbiAgICAvLyBzdHJhaWdodCBmcm9tIHRoZSBoZWFkZXIgc3dpdGNoZXIgd2l0aG91dCBvcGVuaW5nIHNldHRpbmdzLiBIYW5kbGVkXG4gICAgLy8gYXMgYSBzZW50aW5lbCB2YWx1ZSBpbiB0aGUgY2hhbmdlIGxpc3RlbmVyIGJlbG93LlxuICAgIGNvbnN0IG5ld09wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdC52YWx1ZSA9ICdfX25ld193b3Jrc3BhY2VfXyc7XG4gICAgbmV3T3B0LnRleHRDb250ZW50ID0gJysgTmV3IHdvcmtzcGFjZSc7XG4gICAgd3NTZWxlY3QuYXBwZW5kKG5ld09wdCk7XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGZvY3VzV29ya3NwYWNlVGFiKHcubmFtZSk7XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBEZWxldGUgd29ya3NwYWNlICR7dy5uYW1lfWApO1xuICAgICAgICBkZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgaWYgKCFjb25maXJtKGBEZWxldGUgd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCIgYW5kIGFsbCBpdHMgY2FwdHVyZXM/YCkpIHJldHVybjtcbiAgICAgICAgICB3b3Jrc3BhY2VzID0gd29ya3NwYWNlcy5maWx0ZXIoKHgpID0+IHgubmFtZSAhPT0gdy5uYW1lKTtcbiAgICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFt3c01zZ0tleSh3Lm5hbWUpLCB3c1Nob3RzS2V5KHcubmFtZSksIHdzU2hvdHNGdWxsS2V5KHcubmFtZSksIHdzU25hcHNob3RzS2V5KHcubmFtZSldKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgICAgICBpZiAoYWN0aXZlV3MgPT09IHcubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3b3Jrc3BhY2VzWzBdIS5uYW1lKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpLmFwcGVuZChkZWwpO1xuICAgICAgfVxuICAgICAgd3NMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuICAgIHJlbmRlcldzU25hcHNob3RIaXN0b3J5KCk7XG4gIH07XG5cbiAgLy8gUmVuZGVyIHRoZSBhY3RpdmUgd29ya3NwYWNlJ3Mgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKSB3aXRoXG4gIC8vIGEgUmVzdG9yZSBhY3Rpb24uIEFwcGVuZGVkIHVuZGVyIHRoZSB3b3Jrc3BhY2UgbGlzdCBpbiBTZXR0aW5ncy5cbiAgY29uc3QgcmVuZGVyV3NTbmFwc2hvdEhpc3RvcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS13cy1zbmFwc2hvdHNdJyk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAoIXdzU25hcHNob3RzLmxlbmd0aCkge1xuICAgICAgaG9zdC5oaWRkZW4gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBob3N0LmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgU25hcHNob3QgaGlzdG9yeSDCtyAke3dzU25hcHNob3RzLmxlbmd0aH1gO1xuICAgIGhlYWQuZGF0YXNldC50aXAgPSAnUmVzdG9yYWJsZSBzbmFwc2hvdHMgc2F2ZWQgYmVmb3JlIGVhY2ggQ2xlYXItYWxsJztcbiAgICBob3N0LmFwcGVuZChoZWFkKTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdWwuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbGlzdCc7XG4gICAgZm9yIChjb25zdCBzbmFwIG9mIHdzU25hcHNob3RzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3Mtc25hcC1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBgJHtuZXcgRGF0ZShzbmFwLnRzKS50b0xvY2FsZVN0cmluZygpfSDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWwgwrcgJHtzbmFwLmNvbW1lbnRzfSBjbXRgO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgY29uc3QgcmVzdG9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcmVzdG9yZS50eXBlID0gJ2J1dHRvbic7XG4gICAgICByZXN0b3JlLmNsYXNzTmFtZSA9ICd3cy1zbmFwLXJlc3RvcmUnO1xuICAgICAgcmVzdG9yZS50ZXh0Q29udGVudCA9ICdSZXN0b3JlJztcbiAgICAgIHJlc3RvcmUuZGF0YXNldC50aXAgPSAnUmVzdG9yZSB0aGlzIHNuYXBzaG90IGludG8gdGhlIGN1cnJlbnQgd29ya3NwYWNlIChjdXJyZW50IHN0YXRlIGlzIGtlcHQgb24gdGhlIHVuZG8gc3RhY2spJztcbiAgICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoICYmICFjb25maXJtKCdSZXN0b3JlIHRoaXMgc25hcHNob3Q/IFRoZSBjdXJyZW50IGNhcHR1cmVzIHdpbGwgYmUgcmVwbGFjZWQgKHVuZG9hYmxlKS4nKSkgcmV0dXJuO1xuICAgICAgICByZXN0b3JlV29ya3NwYWNlU25hcHNob3Qoc25hcC5pZCk7XG4gICAgICB9KTtcbiAgICAgIGxpLmFwcGVuZChyZXN0b3JlKTtcbiAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyIHdzLXNuYXAtZGVsJztcbiAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyBzbmFwc2hvdCc7XG4gICAgICBkZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBzbmFwc2hvdCcpO1xuICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEyKTtcbiAgICAgIGRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGRlbGV0ZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgfVxuICAgIGhvc3QuYXBwZW5kKHVsKTtcbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ19fbmV3X3dvcmtzcGFjZV9fJykge1xuICAgICAgLy8gUmVzZXQgdGhlIHNlbGVjdCBiYWNrIHRvIHRoZSBhY3RpdmUgd29ya3NwYWNlIGZpcnN0IHNvIHRoZSBzZW50aW5lbFxuICAgICAgLy8gbmV2ZXIgc3RpY2tzIGFzIHRoZSBkaXNwbGF5ZWQgdmFsdWUgaWYgdGhlIHByb21wdCBpcyBjYW5jZWxsZWQuXG4gICAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgICBjb25zdCBuYW1lID0gKHdpbmRvdy5wcm9tcHQoJ05ldyB3b3Jrc3BhY2UgbmFtZScpID8/ICcnKS50cmltKCk7XG4gICAgICBpZiAobmFtZSkgYXdhaXQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh2YWx1ZSk7XG4gICAgZm9jdXNXb3Jrc3BhY2VUYWIodmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdFeHBvcnQgd29ya3NwYWNlIGFzIC50YXIuenN0IChKU09OTCArIHNjcmVlbnNob3RzICsgRHVja0RCICsgUkVBRE1FKScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydFppcCgpfSxcbiAgICB7aWQ6ICdjb3B5LXBhdGgnLCBsYWJlbDogJ0NvcHkgcGF0aCBvZiBsYXN0IGV4cG9ydCcsIHJ1bjogKCkgPT4gdm9pZCBvbkNvcHlQYXRoKCl9LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3ZhbGlkYXRlJywgbGFiZWw6ICdSZS1jaGVjayBzZWxlY3RvcnMnLCBydW46ICgpID0+IHZvaWQgb25WYWxpZGF0ZSgpfSxcbiAgICB7aWQ6ICdjbGVhcicsIGxhYmVsOiAnQ2xlYXIgYWxsIGNhcHR1cmVzJywgcnVuOiBvbkNsZWFyfSxcbiAgICB7aWQ6ICdzZXR0aW5ncycsIGxhYmVsOiAnT3BlbiBzZXR0aW5ncycsIHJ1bjogb3BlbkRyYXdlcn0sXG4gICAge2lkOiAnZ2l0aHViJywgbGFiZWw6ICdPcGVuIEdpdEh1YiByZXBvJywgcnVuOiBvbkdpdGh1Yn0sXG4gICAge2lkOiAnbWFudWFsJywgbGFiZWw6ICdNYW51YWwgY2FwdHVyZSAoc3RhcnQgY29tcG9zZXIgd2l0aCBgPiBzZWxlY3RvcmApJywgcnVuOiAoKSA9PiB7IGNvbXBvc2VyLnZhbHVlID0gJz4gJzsgY29tcG9zZXIuZm9jdXMoKTsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyB9fSxcbiAgICB7aWQ6ICd1bmRvJywgbGFiZWw6ICdVbmRvJywgcnVuOiB1bmRvfSxcbiAgICB7aWQ6ICdyZWRvJywgbGFiZWw6ICdSZWRvJywgcnVuOiByZWRvfSxcbiAgXTtcbiAgY29uc3QgcmVuZGVyUGFsZXR0ZSA9IChxID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBjb25zdCBxbCA9IHEudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIC4uLkNPTU1BTkRTLmZpbHRlcigoYykgPT4gIXFsIHx8IGMubGFiZWwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxbCkpXG4gICAgICAgIC5tYXAoKGMpID0+ICh7bGFiZWw6IGMubGFiZWwsIHByZXZpZXc6ICdjb21tYW5kJywgcnVuOiBjLnJ1bn0pKSxcbiAgICAgIC4uLm1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAoIXFsIHx8XG4gICAgICAgIChtLmVudHJ5LnNlbGVjdG9yICsgJyAnICsgKG0uZW50cnkudGV4dCA/PyAnJykgKyAnICcgKyAobS5lbnRyeS5jb21wb25lbnRSb290ID8/ICcnKSlcbiAgICAgICAgICAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxbCkpKVxuICAgICAgICAuc2xpY2UoMCwgMzApXG4gICAgICAgIC5tYXAoKG0pID0+IHtcbiAgICAgICAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgICAgICAgIGNvbnN0IHByZXZpZXcgPSAobS5lbnRyeS50ZXh0ID8/IGZiWzBdID8/IG0uZW50cnkuY29tcG9uZW50Um9vdCA/PyBtLmVudHJ5LnNlbGVjdG9yID8/ICcnKS5zbGljZSgwLCA4MCk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhYmVsOiBgIyR7bS5lbnRyeS5ufSAke20uZW50cnkuY29tcG9uZW50Um9vdCA/PyBtLmVudHJ5LnNlbGVjdG9yfWAsXG4gICAgICAgICAgICBwcmV2aWV3LFxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGNsb3NlUGFsZXR0ZSgpO1xuICAgICAgICAgICAgICBzY3JvbGxNZXNzYWdlSW50b1ZpZXcobS5pZCk7XG4gICAgICAgICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICBdO1xuICAgIGl0ZW1zLmZvckVhY2goKGl0LCBpKSA9PiB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBsYmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYmwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICAgIGxibC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5sYWJlbCwgcSk7XG4gICAgICBsaS5hcHBlbmQobGJsKTtcbiAgICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBwLmNsYXNzTmFtZSA9ICdwcmV2aWV3JztcbiAgICAgIHAuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goaXQucHJldmlldyA/PyAnJywgcSk7XG4gICAgICBsaS5hcHBlbmQocCk7XG4gICAgICBjb25zdCBrYmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBrYmQuY2xhc3NOYW1lID0gJ2tiZCc7XG4gICAgICBrYmQudGV4dENvbnRlbnQgPSAn4oa1JztcbiAgICAgIGxpLmFwcGVuZChrYmQpO1xuICAgICAgaWYgKGkgPT09IDApIGxpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGl0LnJ1bigpOyB9KTtcbiAgICAgIHBhbGV0dGVMaXN0LmFwcGVuZChsaSk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9wZW5QYWxldHRlID0gKHByZXNldCA9ICcnKTogdm9pZCA9PiB7XG4gICAgcGFsZXR0ZS5oaWRkZW4gPSBmYWxzZTtcbiAgICBwYWxldHRlSW5wdXQudmFsdWUgPSBwcmVzZXQ7XG4gICAgcmVuZGVyUGFsZXR0ZShwcmVzZXQpO1xuICAgIHBhbGV0dGVJbnB1dC5mb2N1cygpO1xuICAgIHBhbGV0dGVJbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShwcmVzZXQubGVuZ3RoLCBwcmVzZXQubGVuZ3RoKTtcbiAgfTtcbiAgY29uc3QgY2xvc2VQYWxldHRlID0gKCk6IHZvaWQgPT4geyBwYWxldHRlLmhpZGRlbiA9IHRydWU7IH07XG4gIHBhbGV0dGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHJlbmRlclBhbGV0dGUocGFsZXR0ZUlucHV0LnZhbHVlKSk7XG4gIHBhbGV0dGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBjb25zdCBpdGVtcyA9IFsuLi5wYWxldHRlTGlzdC5jaGlsZHJlbl07XG4gICAgbGV0IGFjdGl2ZSA9IGl0ZW1zLmZpbmRJbmRleCgobGkpID0+IGxpLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpO1xuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3IgKGNvbnN0IGxpIG9mIGl0ZW1zKSBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgYWN0aXZlID0gTWF0aC5taW4oaXRlbXMubGVuZ3RoIC0gMSwgYWN0aXZlICsgMSk7IGl0ZW1zW2FjdGl2ZV0/LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dVcCcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3IgKGNvbnN0IGxpIG9mIGl0ZW1zKSBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgYWN0aXZlID0gTWF0aC5tYXgoMCwgYWN0aXZlIC0gMSk7IGl0ZW1zW2FjdGl2ZV0/LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7IGUucHJldmVudERlZmF1bHQoKTsgKGl0ZW1zW2FjdGl2ZV0gYXMgSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQpPy5jbGljaygpOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgY2xvc2VQYWxldHRlKCk7XG4gIH0pO1xuICBwYWxldHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHsgaWYgKGUudGFyZ2V0ID09PSBwYWxldHRlKSBjbG9zZVBhbGV0dGUoKTsgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEN1c3RvbSB0b29sdGlwIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgdGlwRm9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBjb25zdCBzaG93VGlwID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXAnKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRvb2x0aXBFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRpcFIgPSB0b29sdGlwRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHRvcCA9IHIuYm90dG9tICsgNDtcbiAgICBsZXQgbGVmdCA9IHIubGVmdCArIHIud2lkdGggLyAyIC0gdGlwUi53aWR0aCAvIDI7XG4gICAgaWYgKHRvcCArIHRpcFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSB0aXBSLmhlaWdodCAtIDQ7XG4gICAgaWYgKGxlZnQgPCA0KSBsZWZ0ID0gNDtcbiAgICBpZiAobGVmdCArIHRpcFIud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDQpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHRpcFIud2lkdGggLSA0O1xuICAgIHRvb2x0aXBFbC5zdHlsZS5jc3NUZXh0ID0gYHRvcDoke3RvcH1weDtsZWZ0OiR7bGVmdH1weDtgO1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnO1xuICB9O1xuICBjb25zdCBoaWRlVGlwID0gKCk6IHZvaWQgPT4ge1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ2ZhbHNlJztcbiAgICB0aXBGb3IgPSBudWxsO1xuICAgIHRvb2x0aXBFbC5oaWRkZW4gPSB0cnVlO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKCF0IHx8IHQgPT09IHRpcEZvcikgcmV0dXJuO1xuICAgIHRpcEZvciA9IHQ7XG4gICAgc2hvd1RpcCh0KTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0ICYmIHQgPT09IHRpcEZvciAmJiAhdC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVUaXAoKTtcbiAgfSk7XG4gIC8vIFRoZSBwYW5lbCByZS1yZW5kZXJzIGFnZ3Jlc3NpdmVseSAocmVuZGVyKCkgcmVzZXRzIGxpc3QuaW5uZXJIVE1MLCBjb25maXJtXG4gIC8vIGJ1dHRvbnMgcmVwbGFjZVdpdGgsIGRlbGV0ZS1jb25maXJtIHJldmVydHMgb24gYSB0aW1lcikgYW5kIHRoZSBsaXN0XG4gIC8vIHNjcm9sbHMg4oCUIGluIGFsbCBvZiB0aG9zZSB0aGUgYW5jaG9yZWQgbm9kZSBsZWF2ZXMgdGhlIERPTSBvciBtb3Zlc1xuICAvLyB3aXRob3V0IGV2ZXIgZmlyaW5nIG1vdXNlb3V0LCB3aGljaCB1c2VkIHRvIHN0cmFuZCB0aGUgdG9vbHRpcCBvbiBzY3JlZW5cbiAgLy8gKGNvdmVyaW5nIG90aGVyIGVsZW1lbnRzLCBuZXZlciBkaXNtaXNzaW5nKS4gRGlzbWlzcyBvbiBhbnkgc3VjaCBzaWduYWwuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBoaWRlVGlwLCB0cnVlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoaWRlVGlwLCB0cnVlKTtcbiAgY29uc3QgdGlwR3VhcmQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgaWYgKHRpcEZvciAmJiAhdGlwRm9yLmlzQ29ubmVjdGVkKSBoaWRlVGlwKCk7XG4gIH0pO1xuICB0aXBHdWFyZC5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWV9KTtcblxuICAvLyDilIDilIDilIAgU3RhdCBkcmlsbGRvd25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBlbmRIZWFkaW5nID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpO1xuICAgIGgudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGgpO1xuICB9O1xuICBjb25zdCBhcHBlbmRCb2xkID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJyk7XG4gICAgYi50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoYik7XG4gIH07XG4gIGNvbnN0IGFwcGVuZENvZGUgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgY29kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcbiAgICBjb2RlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChjb2RlKTtcbiAgfTtcbiAgY29uc3QgYnVpbGREcmlsbGRvd24gPSAoa2luZDogc3RyaW5nKTogRG9jdW1lbnRGcmFnbWVudCA9PiB7XG4gICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBpZiAoa2luZCA9PT0gJ3NlbGVjdG9ycycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1NlbGVjdG9ycyBieSBxdWFsaXR5Jyk7XG4gICAgICBjb25zdCBidWNrZXRzID0ge2lkOiAwLCB0ZXN0aWQ6IDAsIGNsYXNzOiAwLCBudGg6IDAsIHRhZzogMH07XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgICBpZiAoZS50ZXN0SWQpIGJ1Y2tldHMudGVzdGlkKys7XG4gICAgICAgIGVsc2UgaWYgKGUuaWQgfHwgL14jW1xcdy1dKyQvLnRlc3QoZS5zZWxlY3RvcikpIGJ1Y2tldHMuaWQrKztcbiAgICAgICAgZWxzZSBpZiAoKGUuc2VsZWN0b3IgPz8gJycpLmluY2x1ZGVzKCc6bnRoLW9mLXR5cGUnKSkgYnVja2V0cy5udGgrKztcbiAgICAgICAgZWxzZSBpZiAoL1xcLi8udGVzdChlLnNlbGVjdG9yID8/ICcnKSkgYnVja2V0cy5jbGFzcysrO1xuICAgICAgICBlbHNlIGJ1Y2tldHMudGFnKys7XG4gICAgICB9XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgbGFiZWxdIG9mIFtcbiAgICAgICAgW2J1Y2tldHMudGVzdGlkLCAnIGRhdGEtdGVzdGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmlkLCAnIHN0YWJsZSBpZCddLFxuICAgICAgICBbYnVja2V0cy5jbGFzcywgJyBjbGFzcy1iYXNlZCddLFxuICAgICAgICBbYnVja2V0cy5udGgsICcgbnRoLW9mLXR5cGUnXSxcbiAgICAgICAgW2J1Y2tldHMudGFnLCAnIHRhZy1vbmx5J10sXG4gICAgICBdIGFzIGNvbnN0KSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgIGxpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnc3RhbGUnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTdGFsZSBjYXB0dXJlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc3RhbGUgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKTtcbiAgICAgIGlmICghc3RhbGUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGkudGV4dENvbnRlbnQgPSAnTm9uZSAtIGV2ZXJ5dGhpbmcgcmVzb2x2ZXMuJztcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH0gZWxzZSBmb3IgKGNvbnN0IG0gb2Ygc3RhbGUpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBsaS5hcHBlbmQoJyAnKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgKG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDUwKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAnY29tbWVudHMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdDb21tZW50cycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3QgZmJzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBGZWVkYmFja01lc3NhZ2UgPT4gbS50eXBlID09PSAnZmVlZGJhY2snKTtcbiAgICAgIGNvbnN0IHRvdGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHRvdGFsLmFwcGVuZCgnVG90YWwgd29yZHM6ICcpO1xuICAgICAgYXBwZW5kQm9sZCh0b3RhbCwgU3RyaW5nKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyB3b3JkQ291bnQobS50ZXh0KSwgMCkpKTtcbiAgICAgIHVsLmFwcGVuZCh0b3RhbCk7XG4gICAgICBjb25zdCBhdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgYXZnLmFwcGVuZCgnQXZlcmFnZSBsZW5ndGg6ICcpO1xuICAgICAgYXBwZW5kQm9sZChhdmcsIFN0cmluZyhmYnMubGVuZ3RoID8gTWF0aC5yb3VuZChmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgbS50ZXh0Lmxlbmd0aCwgMCkgLyBmYnMubGVuZ3RoKSA6IDApKTtcbiAgICAgIGF2Zy5hcHBlbmQoJyBjaGFycycpO1xuICAgICAgdWwuYXBwZW5kKGF2Zyk7XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfSBlbHNlIGlmIChraW5kID09PSAncGFnZXMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdQYWdlcycpO1xuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNlZW4uc2V0KG0uZW50cnkudXJsLCAoc2Vlbi5nZXQobS5lbnRyeS51cmwpID8/IDApICsgMSk7XG4gICAgICBmb3IgKGNvbnN0IFt1cmwsIG5dIG9mIHNlZW4pIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcobikpO1xuICAgICAgICBsaS5hcHBlbmQoYCBzZWxlY3RvciR7biA9PT0gMSA/ICcnIDogJ3MnfSDCtyBgKTtcbiAgICAgICAgYXBwZW5kQ29kZShsaSwgcGF0aE9mKHVybCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZztcbiAgfTtcbiAgY29uc3Qgc2hvd0RyaWxsZG93biA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qga2luZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdCcpO1xuICAgIGlmICgha2luZCkgcmV0dXJuO1xuICAgIGRyaWxsZG93bkVsLnJlcGxhY2VDaGlsZHJlbihidWlsZERyaWxsZG93bihraW5kKSk7XG4gICAgZHJpbGxkb3duRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgY29uc3QgciA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkUiA9IGRyaWxsZG93bkVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB0b3AgPSByLmJvdHRvbSArIDY7XG4gICAgbGV0IGxlZnQgPSByLmxlZnQgKyByLndpZHRoIC8gMiAtIGRSLndpZHRoIC8gMjtcbiAgICBpZiAodG9wICsgZFIuaGVpZ2h0ICsgNCA+IHdpbmRvdy5pbm5lckhlaWdodCkgdG9wID0gci50b3AgLSBkUi5oZWlnaHQgLSA2O1xuICAgIGlmIChsZWZ0IDwgNikgbGVmdCA9IDY7XG4gICAgaWYgKGxlZnQgKyBkUi53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNikgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZFIud2lkdGggLSA2O1xuICAgIGRyaWxsZG93bkVsLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7dG9wfXB4O2xlZnQ6JHtsZWZ0fXB4O2A7XG4gIH07XG4gIGNvbnN0IGhpZGVEcmlsbGRvd24gPSAoKTogdm9pZCA9PiB7IGRyaWxsZG93bkVsLmhpZGRlbiA9IHRydWU7IH07XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcuc3RhdFtkYXRhLXN0YXRdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0KSBzaG93RHJpbGxkb3duKHQpO1xuICB9KTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgaWYgKCFzdGF0c0VsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZURyaWxsZG93bigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0LWJ1dHRvbiBob3ZlciDihpIgb3V0bGluZS1tdWx0aSBvbiBwYWdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBmb3IgKGNvbnN0IGJ0biBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1leHBvcnQtaG92ZXJdJykpIHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpJywgc2VsZWN0b3JzfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QuYWRkKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLW11bHRpLWNsZWFyJ30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgQ2xpY2sgZGVsZWdhdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXIgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICBpZiAoIXRyaWdnZXIpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aW9uID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJyk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ3NlbmQnOiBzZW5kRmVlZGJhY2soKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1hbGwnOiB2b2lkIG9uQ29weUFsbCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQnOiB2b2lkIG9uRXhwb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydC16aXAnOiB2b2lkIG9uRXhwb3J0WmlwKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktcGF0aCc6IHZvaWQgb25Db3B5UGF0aCgpOyByZXR1cm47XG4gICAgICBjYXNlICdpbXBvcnQnOiBvbkltcG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICd2YWxpZGF0ZSc6IHZvaWQgb25WYWxpZGF0ZSgpOyByZXR1cm47XG4gICAgICBjYXNlICdjbGVhcic6IG9uQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZ2l0aHViJzogb25HaXRodWIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOiBvcGVuRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Nsb3NlLWRyYXdlcic6IGNsb3NlRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3VuZG8nOiB1bmRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3JlZG8nOiByZWRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Rlc2lnbi1lZGl0JzogeyB2b2lkIG9wZW5NZE1vZGFsKCdkZXNpZ24nKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdza2lsbC1lZGl0JzogIHsgdm9pZCBvcGVuTWRNb2RhbCgnc2tpbGwnKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdkZXNpZ24tdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbi1tZC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyBQcmVmZXIgdGhlIHVzZXIncyBsb2NhbCBvdmVycmlkZSBpZiBwcmVzZW50IChzbyBhIGZvcmsnc1xuICAgICAgICAgIC8vIFwiRG93bmxvYWQgdGVtcGxhdGVcIiBwcm9kdWNlcyB0aGUgc2FtZSBjb250ZW50IHRoZSBmb3JrIHNoaXBzKVxuICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgZ2VuZXJpYyB0ZW1wbGF0ZS5cbiAgICAgICAgICBjb25zdCB0ZXh0ID0gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxEZXNpZ24nKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKSk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQg4oCUIGZpbGwgaW4gYW5kIHJlLXVwbG9hZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLmRlc2lnbk1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ0RFU0lHTi5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NraWxsLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXRlbXBsYXRlLWRvd25sb2FkJzoge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsU2tpbGwnKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdTS0lMTC5tZCB0ZW1wbGF0ZSBkb3dubG9hZGVkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXJlc2V0LXRlbXBsYXRlJzoge1xuICAgICAgICBwcmVmcy5za2lsbE1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICd3cy1jcmVhdGUnOiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAod3NOYW1lLnZhbHVlID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xuICAgICAgICB2b2lkIGNyZWF0ZVdvcmtzcGFjZUZsb3cobmFtZSkudGhlbigob2spID0+IHsgaWYgKG9rKSB3c05hbWUudmFsdWUgPSAnJzsgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyDilIDilIDilIAgR2xvYmFsIGtleWJvYXJkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQgPSAodGFyZ2V0OiBFdmVudFRhcmdldCB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBlbCA9IHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID8gdGFyZ2V0IDogbnVsbDtcbiAgICByZXR1cm4gQm9vbGVhbihlbD8uY2xvc2VzdCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIFtjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdLCBbY29udGVudGVkaXRhYmxlPVwiXCJdJykpO1xuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGVkaXRhYmxlVGFyZ2V0ID0gaXNFZGl0YWJsZUtleWJvYXJkVGFyZ2V0KGUudGFyZ2V0KTtcbiAgICBpZiAoZWRpdGFibGVUYXJnZXQgJiYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIFsnYScsICd6JywgJ3knXS5pbmNsdWRlcyhlLmtleS50b0xvd2VyQ2FzZSgpKSkgcmV0dXJuO1xuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2snKSB7IGUucHJldmVudERlZmF1bHQoKTsgcGFsZXR0ZS5oaWRkZW4gPyBvcGVuUGFsZXR0ZSgpIDogY2xvc2VQYWxldHRlKCk7IHJldHVybjsgfVxuICAgIC8vIEN0cmwrRiAoYW5kIENtZCtGKSBvcGVucyB0aGUgaW4tbGlzdCB2aXN1YWwgZmluZCDigJQgZGlzdGluY3QgZnJvbSB0aGVcbiAgICAvLyBDbWQrSyBjb21tYW5kIHBhbGV0dGUuIE92ZXJyaWRlIHRoZSBicm93c2VyJ3MgbmF0aXZlIGZpbmQgc28gdGhlIHBhbmVsXG4gICAgLy8gb3ducyB0aGUgZ2VzdHVyZS5cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICdmJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IG9wZW5GaW5kKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgdW5kbygpOyByZXR1cm47IH1cbiAgICBpZiAoKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpICYmIChlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneScgfHwgKGUuc2hpZnRLZXkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ3onKSkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyByZWRvKCk7IHJldHVybjsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGNvbnN0IG1kTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgICBpZiAobWRNb2RhbCAmJiAhbWRNb2RhbC5oaWRkZW4pIHsgY2xvc2VNZE1vZGFsKCk7IHJldHVybjsgfVxuICAgICAgaWYgKCFwYWxldHRlLmhpZGRlbikgeyBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIWRyYXdlci5oaWRkZW4pIHsgY2xvc2VEcmF3ZXIoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoZmluZEJhciAmJiAhZmluZEJhci5oaWRkZW4pIHsgY2xvc2VGaW5kKCk7IHJldHVybjsgfVxuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHsgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY2FuY2VsJ30pOyBwZW5kaW5nTXVsdGkgPSBbXTsgcmVuZGVyKCk7IHNldFN0YXR1cygnUGVuZGluZyBncm91cCBjYW5jZWxsZWQnKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdJbnNlcnQgbW9kZSBjYW5jZWxsZWQnKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoc2VhcmNoUXVlcnkpIGNsb3NlRmluZCgpO1xuICAgIH1cbiAgICBpZiAoZS5rZXkgPT09ICdBbHQnIHx8IGUuYWx0S2V5KSB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IHRydWV9KTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICBpZiAoIWUuYWx0S2V5KSB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IGZhbHNlfSk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2Ugd2lyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgcGFuZWxSZWFkeSA9IGZhbHNlO1xuICBjb25zdCBwZW5kaW5nUGFuZWxNZXNzYWdlczogYW55W10gPSBbXTtcbiAgY29uc3QgcmVjZWl2ZVBhbmVsTWVzc2FnZSA9IChtOiBhbnkpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBhbmVsUmVhZHkpIHtcbiAgICAgIHBlbmRpbmdQYW5lbE1lc3NhZ2VzLnB1c2gobSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uQ3NNZXNzYWdlKG0pO1xuICB9O1xuICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAvLyBTaW5nbGUgY2hhbm5lbDogY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLiBUaGUgYmFja2dyb3VuZCB1c2VkIHRvIHJlbGF5XG4gICAgLy8gdGhyb3VnaCBhIHBvcnQgdG9vLCBidXQgY29udGVudC1zY3JpcHQgYnJvYWRjYXN0cyBhbHJlYWR5IHJlYWNoIHRoZVxuICAgIC8vIHNpZGUgcGFuZWwgZGlyZWN0bHkg4oCUIHJlbGF5aW5nIHByb2R1Y2VkIGR1cGxpY2F0ZSBkaXNwYXRjaGVzLlxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobTogYW55KSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKG0pKTtcbiAgICBjaHJvbWUudGFicz8ub25BY3RpdmF0ZWQ/LmFkZExpc3RlbmVyKCgpID0+IHZvaWQgcnVuVmFsaWRhdGlvbigpKTtcbiAgICBjaHJvbWUudGFicz8ub25VcGRhdGVkPy5hZGRMaXN0ZW5lcigoX2lkLCBpbmZvKSA9PiB7IGlmIChpbmZvPy5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHZvaWQgcnVuVmFsaWRhdGlvbigpOyB9KTtcbiAgICBjaHJvbWUudGFicz8ub25SZW1vdmVkPy5hZGRMaXN0ZW5lcigoY2xvc2VkSWQpID0+IHtcbiAgICAgIGNvbnN0IHdzID0gd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3LnRhYklkID09PSBjbG9zZWRJZCk7XG4gICAgICBpZiAod3MpIHsgd3MudGFiSWQgPSB1bmRlZmluZWQ7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IHJlbmRlcldzQ29udHJvbHMoKTsgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6dG8tcGFuZWwnLCAoZSkgPT4gcmVjZWl2ZVBhbmVsTWVzc2FnZSgoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsKSk7XG4gIH1cblxuICAvLyDilIDilIDilIAgVGVzdCBBUEkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGluc3RhbGxUZXN0QXBpID0gKCk6IHZvaWQgPT4ge1xuICAgICh3aW5kb3cgYXMgYW55KS5fX3BpbmNoZ3JhYl9wYW5lbCA9IHtcbiAgICAgIHB1c2hNZXNzYWdlOiAobTogUGFuZWxNZXNzYWdlKSA9PiB7IG1lc3NhZ2VzLnB1c2gobSk7IHBlcnNpc3QoKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvbkNhcHR1cmUsIG9uSG92ZXIsIG9uSG92ZXJFbmQsIG9uUGFnZVNuYXBzaG90LFxuICAgICAgZ2V0TWVzc2FnZXM6ICgpID0+IFsuLi5tZXNzYWdlc10sXG4gICAgICBnZXRQcmVmczogKCkgPT4gKHsuLi5wcmVmc30pLFxuICAgICAgc2V0UHJlZnM6IChwOiBQYXJ0aWFsPFByZWZzPikgPT4geyBwcmVmcyA9IHsuLi5wcmVmcywgLi4ucH07IHBlcnNpc3RQcmVmcygpOyBhcHBseVByZWZzVG9VSSgpOyByZW5kZXIoKTsgfSxcbiAgICAgIGJ1aWxkSnNvbmwsXG4gICAgICBidWlsZEV4cG9ydEZpbGVuYW1lLCBidWlsZE1hbmlmZXN0LCBkb21pbmFudEhvc3RTbHVnLCBkaXN0aW5jdEhvc3RzLFxuICAgICAgZHVja0RiU25pcHBldCwgb25FeHBvcnRaaXAsIG9uRXhwb3J0LCBvbkNvcHlQYXRoLFxuICAgICAgZGVub3JtYWxpemVFbnRyeSxcbiAgICAgIGdldExhc3RFeHBvcnQ6ICgpID0+ICh7Li4ubGFzdEV4cG9ydH0pLFxuICAgICAgLy8gVGVzdCBoYXRjaDogc2VlZCBldmVyeSBzZWxlY3RvciBjYXB0dXJlIHdpdGggdGhlIHNhbWUgZnVsbCBQTkcgZGF0YVVSTFxuICAgICAgLy8gc28gdGhlIGFyY2hpdmUgZXhwb3J0IGhhcyBzb21ldGhpbmcgdG8gYnVuZGxlLiBSZWFsIGNhcHR1cmVzIHBvcHVsYXRlXG4gICAgICAvLyBzaG90c0Z1bGwgZnJvbSB0aGUgYmcgYHJ1blNob3RgIHJlcGx5OyB0ZXN0cyBjYW4ndCBlYXNpbHkgcnVuIGFcbiAgICAgIC8vIGNhcHR1cmVWaXNpYmxlVGFiLCBzbyB0aGlzIGxldHMgdXMgcHJvdmUgdGhlIFBORyBidW5kbGluZyBwYXRoLlxuICAgICAgX19zZWVkU2hvdHNGdWxsOiAoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHNob3RzRnVsbC5zZXQobS5lbnRyeS5zZWxlY3RvciwgZGF0YVVybCk7XG4gICAgICAgIH1cbiAgICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgICAgfSxcbiAgICAgIF9fZ2V0U2hvdHNGdWxsOiAoKSA9PiBzaG90c0Z1bGwsXG4gICAgICAvLyBzZXRTZWFyY2ggZHJpdmVzIHRoZSBDdHJsK0YgdmlzdWFsLWZpbmQgcGF0aCAodGhlIGhlYWRlciBzZWFyY2ggbm93XG4gICAgICAvLyBvcGVucyB0aGUgY29tbWFuZCBwYWxldHRlIGluc3RlYWQgb2YgZmlsdGVyaW5nKS5cbiAgICAgIHNldFNlYXJjaDogKHE6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAocSkgeyBvcGVuRmluZCgpOyBpZiAoZmluZElucHV0KSBmaW5kSW5wdXQudmFsdWUgPSBxOyBhcHBseUZpbmQocSk7IH1cbiAgICAgICAgZWxzZSBjbG9zZUZpbmQoKTtcbiAgICAgIH0sXG4gICAgICBvcGVuRmluZCwgY2xvc2VGaW5kLFxuICAgICAgaXNGaW5kT3BlbjogKCkgPT4gQm9vbGVhbihmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbiksXG4gICAgICBzZXRWYWxpZGl0eTogKHNlbDogc3RyaW5nLCBvazogYm9vbGVhbiB8ICdkaWZmLXBhZ2UnLCByZWFzb24/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChyZWFzb24pIHNlbGVjdG9yRXJyb3JzLnNldChzZWwsIHJlYXNvbik7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyOiAoKSA9PiB7XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgICAgICBsaXZlVGFiUGF0aCA9IG51bGw7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIHBlbmRpbmdNdWx0aSA9IFtdO1xuICAgICAgICBzZWxlY3RvclZhbGlkaXR5LmNsZWFyKCk7XG4gICAgICAgIHNob3RzLmNsZWFyKCk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgb3BlblBhbGV0dGUsIGNsb3NlUGFsZXR0ZSwgb3BlbkRyYXdlciwgY2xvc2VEcmF3ZXIsXG4gICAgICBzZW5kRmVlZGJhY2ssIHVuZG8sIHJlZG8sXG4gICAgICBsaXN0V29ya3NwYWNlczogKCkgPT4gWy4uLndvcmtzcGFjZXNdLFxuICAgICAgYWN0aXZlV29ya3NwYWNlOiAoKSA9PiBhY3RpdmVXcyxcbiAgICAgIHNldFN0aWNreVRUTDogKG1zOiBudW1iZXIpID0+IHsgU1RJQ0tZX1RUTF9NUyA9IG1zOyB9LFxuICAgICAgZm9yY2VTdGlja3lFeHBpcmU6ICgpID0+IHsgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTsgcGFuZWxIb3ZlcmVkID0gZmFsc2U7IGFybVN0aWNreUV4cGlyeSgpOyB9LFxuICAgICAgc2V0TGFzdEFjdGl2ZSxcbiAgICAgIGNyZWF0ZVdvcmtzcGFjZTogKG46IHN0cmluZykgPT4geyB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IG4sIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7IHBlcnNpc3RXb3Jrc3BhY2VzKCk7IHJldHVybiBsb2FkV29ya3NwYWNlKG4pLnRoZW4ocmVuZGVyKTsgfSxcbiAgICAgIHN3aXRjaFdvcmtzcGFjZTogKG46IHN0cmluZykgPT4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlciksXG4gICAgICBjbGVhckFsbDogb25DbGVhcixcbiAgICAgIGxpc3RTbmFwc2hvdHM6ICgpID0+IHdzU25hcHNob3RzLm1hcCgocykgPT4gKHtpZDogcy5pZCwgdHM6IHMudHMsIHNlbGVjdG9yczogcy5zZWxlY3RvcnMsIGNvbW1lbnRzOiBzLmNvbW1lbnRzfSkpLFxuICAgICAgcmVzdG9yZVNuYXBzaG90OiAoaWQ6IHN0cmluZykgPT4gcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90KGlkKSxcbiAgICB9O1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCb290IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9hZEFsbCgpO1xuICAgIHBhbmVsUmVhZHkgPSB0cnVlO1xuICAgIGZvciAoY29uc3QgbSBvZiBwZW5kaW5nUGFuZWxNZXNzYWdlcy5zcGxpY2UoMCkpIG9uQ3NNZXNzYWdlKG0pO1xuICAgIHJlbmRlcigpO1xuICAgIGluc3RhbGxUZXN0QXBpKCk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gICAgdm9pZCBmZXRjaFN0YXJzKCk7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gICAgY29uc29sZS5sb2coTE9HLCAncmVhZHknLCB7aW5FeHRlbnNpb24sIHdzOiBhY3RpdmVXcywgbWVzc2FnZXM6IG1lc3NhZ2VzLmxlbmd0aH0pO1xuICB9KSgpO1xufSkoKTtcbiIKICBdLAogICJtYXBwaW5ncyI6ICI7O0VBNmxCQSxJQUFJLGNBQWM7QUFBQSxFQUNsQixJQUFNLFNBQVMsTUFBYztBQUFBLElBQzNCLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsYUFBYSxTQUFTLEVBQUU7QUFBQSxJQUN4RSxJQUFJO0FBQUEsTUFDRixNQUFNLFFBQVEsSUFBSSxXQUFXLENBQUM7QUFBQSxNQUM5QixXQUFXLE9BQU8sZ0JBQWdCLEtBQUs7QUFBQSxNQUN2QyxPQUFPLEdBQUcsVUFBVSxNQUFNLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUFBLE1BQ3pGLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBO0FBQUEsRUFLSixJQUFNLEtBQUssQ0FBMkIsYUFDMUMsRUFBQyxNQUFNLE1BQU0sT0FBTyxPQUFPLE1BQU0sUUFBTzs7O0VDcm1CM0MsSUFBTSxRQUFnQztBQUFBLElBQ3BDLGlCQUFpQjtBQUFBLElBQ2pCLGdCQUFnQjtBQUFBLElBQ2hCLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLE1BQU07QUFBQSxJQUNOLEdBQUc7QUFBQSxJQUNILE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLG9CQUFvQjtBQUFBLElB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QVcsQ0FBQztBQUFBLFVBQ1osYUFBYTtBQUFBLFVBQ2IsY0FBYztBQUFBLFVBQ2QscUJBQXFCO0FBQUEsVUFDckIsZUFBZSxDQUFDO0FBQUEsVUFDaEIsaUJBQWlCLE1BQU07QUFBQSxVQUN2QixNQUFNLE1BQU07QUFBQSxVQUNaLFFBQVE7QUFBQSxVQUNSLE9BQU87QUFBQTtBQUFBLFFBRVQ7QUFBQSxRQUFhO0FBQUEsUUFBYztBQUFBLFFBQVk7QUFBQSxRQUN2QztBQUFBLFFBQWM7QUFBQSxRQUFNO0FBQUEsUUFDcEIsZ0JBQWdCLE1BQU0sQ0FBQyxHQUFHLFVBQVU7QUFBQSxRQUNwQyxpQkFBaUIsTUFBTTtBQUFBLFFBQ3ZCLGNBQWMsQ0FBQyxPQUFlO0FBQUEsVUFBRSxnQkFBZ0I7QUFBQTtBQUFBLFFBQ2hELG1CQUFtQixNQUFNO0FBQUEsVUFBRSxhQUFhLFdBQVc7QUFBQSxVQUFHLGVBQWU7QUFBQSxVQUFPLGdCQUFnQjtBQUFBO0FBQUEsUUFDNUY7QUFBQSxRQUNBLGlCQUFpQixDQUFDLE1BQWM7QUFBQSxVQUFFLFdBQVcsS0FBSyxFQUFDLE1BQU0sR0FBRyxXQUFXLElBQUksS0FBSyxFQUFFLFlBQVksRUFBQyxDQUFDO0FBQUEsVUFBRyxrQkFBa0I7QUFBQSxVQUFHLE9BQU8sY0FBYyxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQUE7QUFBQSxRQUMzSixpQkFBaUIsQ0FBQyxNQUFjLGNBQWMsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUFBLFFBQzVELFVBQVU7QUFBQSxRQUNWLGVBQWUsTUFBTSxZQUFZLElBQUksQ0FBQyxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLElBQUksV0FBVyxFQUFFLFdBQVcsVUFBVSxFQUFFLFNBQVEsRUFBRTtBQUFBLFFBQ2hILGlCQUFpQixDQUFDLE9BQWUseUJBQXlCLEVBQUU7QUFBQSxNQUM5RDtBQUFBO0FBQUEsS0FJSSxZQUFZO0FBQUEsTUFDaEIsTUFBTSxRQUFRO0FBQUEsTUFDZCxhQUFhO0FBQUEsTUFDYixXQUFXLEtBQUsscUJBQXFCLE9BQU8sQ0FBQztBQUFBLFFBQUcsWUFBWSxDQUFDO0FBQUEsTUFDN0QsT0FBTztBQUFBLE1BQ1AsZUFBZTtBQUFBLE1BQ1YsY0FBYztBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ2hCLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLFFBQVEsSUFBSSxLQUFLLFNBQVMsRUFBQyxhQUFhLElBQUksVUFBVSxVQUFVLFNBQVMsT0FBTSxDQUFDO0FBQUEsT0FDL0U7QUFBQSxLQUNGOyIsCiAgImRlYnVnSWQiOiAiRDdBNEFFQjdCRURDMTFGNDY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
