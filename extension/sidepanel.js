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
    unlink: '<path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/>',
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
  var splitTarName = (full) => {
    if (full.length <= 100)
      return { name: full, prefix: "" };
    let cut = -1;
    for (let i = full.indexOf("/");i !== -1; i = full.indexOf("/", i + 1)) {
      if (i <= 155 && full.length - i - 1 <= 100)
        cut = i;
    }
    if (cut === -1) {
      throw new Error(`tar: path not splittable into ustar prefix(155)/name(100): ${full}`);
    }
    return { prefix: full.slice(0, cut), name: full.slice(cut + 1) };
  };
  var buildTar = (entries) => {
    const blocks = [];
    const nowSec = Math.floor(Date.now() / 1000);
    for (const entry of entries) {
      const data = typeof entry.data === "string" ? enc.encode(entry.data) : entry.data;
      const { name, prefix } = splitTarName(entry.name);
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
      if (prefix)
        writeAscii(header, 345, prefix, 155);
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

  // src/bundled-skills.gen.ts
  var BUNDLED_SKILLS_PRESENT = true;
  var BUNDLED_SKILL_FILES = [
    {
      ext: "skills/impeccable/reference/adapt.md",
      archive: ".agents/skills/impeccable/reference/adapt.md",
      bytes: 10307
    },
    {
      ext: "skills/impeccable/reference/adapt.native.md",
      archive: ".agents/skills/impeccable/reference/adapt.native.md",
      bytes: 3910
    },
    {
      ext: "skills/impeccable/reference/android.md",
      archive: ".agents/skills/impeccable/reference/android.md",
      bytes: 3224
    },
    {
      ext: "skills/impeccable/reference/animate.md",
      archive: ".agents/skills/impeccable/reference/animate.md",
      bytes: 10708
    },
    {
      ext: "skills/impeccable/reference/audit.md",
      archive: ".agents/skills/impeccable/reference/audit.md",
      bytes: 7438
    },
    {
      ext: "skills/impeccable/reference/audit.native.md",
      archive: ".agents/skills/impeccable/reference/audit.native.md",
      bytes: 8313
    },
    {
      ext: "skills/impeccable/reference/bolder.md",
      archive: ".agents/skills/impeccable/reference/bolder.md",
      bytes: 7092
    },
    {
      ext: "skills/impeccable/reference/brand.md",
      archive: ".agents/skills/impeccable/reference/brand.md",
      bytes: 10477
    },
    {
      ext: "skills/impeccable/reference/clarify.md",
      archive: ".agents/skills/impeccable/reference/clarify.md",
      bytes: 10646
    },
    {
      ext: "skills/impeccable/reference/codex.md",
      archive: ".agents/skills/impeccable/reference/codex.md",
      bytes: 7002
    },
    {
      ext: "skills/impeccable/reference/colorize.md",
      archive: ".agents/skills/impeccable/reference/colorize.md",
      bytes: 13568
    },
    {
      ext: "skills/impeccable/reference/craft.md",
      archive: ".agents/skills/impeccable/reference/craft.md",
      bytes: 11944
    },
    {
      ext: "skills/impeccable/reference/critique.md",
      archive: ".agents/skills/impeccable/reference/critique.md",
      bytes: 41299
    },
    {
      ext: "skills/impeccable/reference/delight.md",
      archive: ".agents/skills/impeccable/reference/delight.md",
      bytes: 9827
    },
    {
      ext: "skills/impeccable/reference/distill.md",
      archive: ".agents/skills/impeccable/reference/distill.md",
      bytes: 5740
    },
    {
      ext: "skills/impeccable/reference/document.md",
      archive: ".agents/skills/impeccable/reference/document.md",
      bytes: 27966
    },
    {
      ext: "skills/impeccable/reference/extract.md",
      archive: ".agents/skills/impeccable/reference/extract.md",
      bytes: 3431
    },
    {
      ext: "skills/impeccable/reference/harden.md",
      archive: ".agents/skills/impeccable/reference/harden.md",
      bytes: 8594
    },
    {
      ext: "skills/impeccable/reference/hooks.md",
      archive: ".agents/skills/impeccable/reference/hooks.md",
      bytes: 9256
    },
    {
      ext: "skills/impeccable/reference/init.md",
      archive: ".agents/skills/impeccable/reference/init.md",
      bytes: 18952
    },
    {
      ext: "skills/impeccable/reference/interaction-design.md",
      archive: ".agents/skills/impeccable/reference/interaction-design.md",
      bytes: 6575
    },
    {
      ext: "skills/impeccable/reference/ios.md",
      archive: ".agents/skills/impeccable/reference/ios.md",
      bytes: 3037
    },
    {
      ext: "skills/impeccable/reference/layout.md",
      archive: ".agents/skills/impeccable/reference/layout.md",
      bytes: 11790
    },
    {
      ext: "skills/impeccable/reference/live.md",
      archive: ".agents/skills/impeccable/reference/live.md",
      bytes: 60156
    },
    {
      ext: "skills/impeccable/reference/onboard.md",
      archive: ".agents/skills/impeccable/reference/onboard.md",
      bytes: 7740
    },
    {
      ext: "skills/impeccable/reference/optimize.md",
      archive: ".agents/skills/impeccable/reference/optimize.md",
      bytes: 7599
    },
    {
      ext: "skills/impeccable/reference/overdrive.md",
      archive: ".agents/skills/impeccable/reference/overdrive.md",
      bytes: 9139
    },
    {
      ext: "skills/impeccable/reference/polish.md",
      archive: ".agents/skills/impeccable/reference/polish.md",
      bytes: 12955
    },
    {
      ext: "skills/impeccable/reference/product.md",
      archive: ".agents/skills/impeccable/reference/product.md",
      bytes: 3758
    },
    {
      ext: "skills/impeccable/reference/quieter.md",
      archive: ".agents/skills/impeccable/reference/quieter.md",
      bytes: 4911
    },
    {
      ext: "skills/impeccable/reference/shape.md",
      archive: ".agents/skills/impeccable/reference/shape.md",
      bytes: 11523
    },
    {
      ext: "skills/impeccable/reference/typeset.md",
      archive: ".agents/skills/impeccable/reference/typeset.md",
      bytes: 17135
    },
    {
      ext: "skills/impeccable/LICENSE",
      archive: ".agents/skills/impeccable/LICENSE",
      bytes: 10766
    },
    {
      ext: "skills/impeccable/NOTICE.md",
      archive: ".agents/skills/impeccable/NOTICE.md",
      bytes: 503
    },
    {
      ext: "skills/perception-first-design/.claude-plugin/marketplace.json",
      archive: "perception-first-design/.claude-plugin/marketplace.json",
      bytes: 1194
    },
    {
      ext: "skills/perception-first-design/.claude-plugin/plugin.json",
      archive: "perception-first-design/.claude-plugin/plugin.json",
      bytes: 755
    },
    {
      ext: "skills/perception-first-design/.github/FUNDING.yml",
      archive: "perception-first-design/.github/FUNDING.yml",
      bytes: 47
    },
    {
      ext: "skills/perception-first-design/.github/ISSUE_TEMPLATE/design-system-profile.md",
      archive: "perception-first-design/.github/ISSUE_TEMPLATE/design-system-profile.md",
      bytes: 281
    },
    {
      ext: "skills/perception-first-design/.github/ISSUE_TEMPLATE/framework-correction.md",
      archive: "perception-first-design/.github/ISSUE_TEMPLATE/framework-correction.md",
      bytes: 389
    },
    {
      ext: "skills/perception-first-design/.github/ISSUE_TEMPLATE/learning-submission.md",
      archive: "perception-first-design/.github/ISSUE_TEMPLATE/learning-submission.md",
      bytes: 364
    },
    {
      ext: "skills/perception-first-design/.github/ISSUE_TEMPLATE/new-heuristic-rule.md",
      archive: "perception-first-design/.github/ISSUE_TEMPLATE/new-heuristic-rule.md",
      bytes: 292
    },
    {
      ext: "skills/perception-first-design/.github/PULL_REQUEST_TEMPLATE.md",
      archive: "perception-first-design/.github/PULL_REQUEST_TEMPLATE.md",
      bytes: 442
    },
    {
      ext: "skills/perception-first-design/.gitignore",
      archive: "perception-first-design/.gitignore",
      bytes: 665
    },
    {
      ext: "skills/perception-first-design/CHANGELOG.md",
      archive: "perception-first-design/CHANGELOG.md",
      bytes: 13150
    },
    {
      ext: "skills/perception-first-design/CITATION.cff",
      archive: "perception-first-design/CITATION.cff",
      bytes: 1211
    },
    {
      ext: "skills/perception-first-design/CODE_OF_CONDUCT.md",
      archive: "perception-first-design/CODE_OF_CONDUCT.md",
      bytes: 274
    },
    {
      ext: "skills/perception-first-design/CONTRIBUTING.md",
      archive: "perception-first-design/CONTRIBUTING.md",
      bytes: 5561
    },
    {
      ext: "skills/perception-first-design/CONTRIBUTORS.md",
      archive: "perception-first-design/CONTRIBUTORS.md",
      bytes: 338
    },
    {
      ext: "skills/perception-first-design/LICENSE",
      archive: "perception-first-design/LICENSE",
      bytes: 1155
    },
    {
      ext: "skills/perception-first-design/NOTICE",
      archive: "perception-first-design/NOTICE",
      bytes: 4582
    },
    {
      ext: "skills/perception-first-design/README.md",
      archive: "perception-first-design/README.md",
      bytes: 21704
    },
    {
      ext: "skills/perception-first-design/commands/all.md",
      archive: "perception-first-design/commands/all.md",
      bytes: 3182
    },
    {
      ext: "skills/perception-first-design/commands/analyze.md",
      archive: "perception-first-design/commands/analyze.md",
      bytes: 10775
    },
    {
      ext: "skills/perception-first-design/commands/evaluate.md",
      archive: "perception-first-design/commands/evaluate.md",
      bytes: 2838
    },
    {
      ext: "skills/perception-first-design/commands/solve.md",
      archive: "perception-first-design/commands/solve.md",
      bytes: 1613
    },
    {
      ext: "skills/perception-first-design/corpus/core/anti-patterns.md",
      archive: "perception-first-design/corpus/core/anti-patterns.md",
      bytes: 2678
    },
    {
      ext: "skills/perception-first-design/corpus/core/constitutional-constraints.md",
      archive: "perception-first-design/corpus/core/constitutional-constraints.md",
      bytes: 4592
    },
    {
      ext: "skills/perception-first-design/corpus/core/output-schema.md",
      archive: "perception-first-design/corpus/core/output-schema.md",
      bytes: 10518
    },
    {
      ext: "skills/perception-first-design/corpus/core/pfd-layer-rubric.md",
      archive: "perception-first-design/corpus/core/pfd-layer-rubric.md",
      bytes: 11296
    },
    {
      ext: "skills/perception-first-design/corpus/core/psychology/mvs-psychology-reference.md",
      archive: "perception-first-design/corpus/core/psychology/mvs-psychology-reference.md",
      bytes: 23425
    },
    {
      ext: "skills/perception-first-design/corpus/core/tier2-prompt-template.md",
      archive: "perception-first-design/corpus/core/tier2-prompt-template.md",
      bytes: 15888
    },
    {
      ext: "skills/perception-first-design/corpus/design-systems/web-frameworks/shopify-themes.md",
      archive: "perception-first-design/corpus/design-systems/web-frameworks/shopify-themes.md",
      bytes: 27033
    },
    {
      ext: "skills/perception-first-design/corpus/design-systems/web-frameworks/tailwind.md",
      archive: "perception-first-design/corpus/design-systems/web-frameworks/tailwind.md",
      bytes: 27499
    },
    {
      ext: "skills/perception-first-design/corpus/design-systems/web-frameworks/wordpress-themes.md",
      archive: "perception-first-design/corpus/design-systems/web-frameworks/wordpress-themes.md",
      bytes: 22246
    },
    {
      ext: "skills/perception-first-design/corpus/heuristics/universal/foundation-rules.yaml",
      archive: "perception-first-design/corpus/heuristics/universal/foundation-rules.yaml",
      bytes: 33881
    },
    {
      ext: "skills/perception-first-design/corpus/heuristics/universal/l1-rules.yaml",
      archive: "perception-first-design/corpus/heuristics/universal/l1-rules.yaml",
      bytes: 36139
    },
    {
      ext: "skills/perception-first-design/corpus/heuristics/universal/l2-rules.yaml",
      archive: "perception-first-design/corpus/heuristics/universal/l2-rules.yaml",
      bytes: 39252
    },
    {
      ext: "skills/perception-first-design/corpus/heuristics/universal/l3-rules.yaml",
      archive: "perception-first-design/corpus/heuristics/universal/l3-rules.yaml",
      bytes: 21677
    },
    {
      ext: "skills/perception-first-design/corpus/heuristics/universal/l4-rules.yaml",
      archive: "perception-first-design/corpus/heuristics/universal/l4-rules.yaml",
      bytes: 24804
    },
    {
      ext: "skills/perception-first-design/corpus/worked-examples/web/example-cross-layer.md",
      archive: "perception-first-design/corpus/worked-examples/web/example-cross-layer.md",
      bytes: 28554
    },
    {
      ext: "skills/perception-first-design/corpus/worked-examples/web/example-excellent.md",
      archive: "perception-first-design/corpus/worked-examples/web/example-excellent.md",
      bytes: 17028
    },
    {
      ext: "skills/perception-first-design/corpus/worked-examples/web/example-good.md",
      archive: "perception-first-design/corpus/worked-examples/web/example-good.md",
      bytes: 21333
    },
    {
      ext: "skills/perception-first-design/corpus/worked-examples/web/example-mediocre.md",
      archive: "perception-first-design/corpus/worked-examples/web/example-mediocre.md",
      bytes: 24377
    },
    {
      ext: "skills/perception-first-design/corpus/worked-examples/web/example-poor.md",
      archive: "perception-first-design/corpus/worked-examples/web/example-poor.md",
      bytes: 26138
    },
    {
      ext: "skills/perception-first-design/corpus/worked-examples/web/example-terrible.md",
      archive: "perception-first-design/corpus/worked-examples/web/example-terrible.md",
      bytes: 20194
    },
    {
      ext: "skills/perception-first-design/corpus/worked-examples/web/example-unconventional.md",
      archive: "perception-first-design/corpus/worked-examples/web/example-unconventional.md",
      bytes: 23633
    },
    {
      ext: "skills/perception-first-design/framework/ADHD-CURB-CUT.md",
      archive: "perception-first-design/framework/ADHD-CURB-CUT.md",
      bytes: 5305
    },
    {
      ext: "skills/perception-first-design/framework/PERCEPTION-FIRST-DESIGN.md",
      archive: "perception-first-design/framework/PERCEPTION-FIRST-DESIGN.md",
      bytes: 98770
    },
    {
      ext: "skills/perception-first-design/llms.txt",
      archive: "perception-first-design/llms.txt",
      bytes: 6544
    },
    {
      ext: "skills/perception-first-design/scripts/gen-pfd-index.py",
      archive: "perception-first-design/scripts/gen-pfd-index.py",
      bytes: 4548
    },
    {
      ext: "skills/perception-first-design/skills/pfd/SKILL.md",
      archive: "perception-first-design/skills/pfd/SKILL.md",
      bytes: 29259
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/accumulated-learnings.md",
      archive: "perception-first-design/skills/pfd/references/accumulated-learnings.md",
      bytes: 722
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/citation-standards.md",
      archive: "perception-first-design/skills/pfd/references/citation-standards.md",
      bytes: 13431
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/insights-log.md",
      archive: "perception-first-design/skills/pfd/references/insights-log.md",
      bytes: 742
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L0/l018-backend-mechanics-as-frontend-complexity.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L0/l018-backend-mechanics-as-frontend-complexity.md",
      bytes: 3615
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L1/l011-visual-channel-audit.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L1/l011-visual-channel-audit.md",
      bytes: 3148
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L2/l013-keyboard-density-is-l2.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L2/l013-keyboard-density-is-l2.md",
      bytes: 1451
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L2/l016-near-miss-color-asymmetry.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L2/l016-near-miss-color-asymmetry.md",
      bytes: 6136
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L2/l024-aa-constrained-token-ladder.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L2/l024-aa-constrained-token-ladder.md",
      bytes: 5030
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L3/l023-falsifiability-triad.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L3/l023-falsifiability-triad.md",
      bytes: 4699
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L4/l003-pre-send-vs-post-response.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L4/l003-pre-send-vs-post-response.md",
      bytes: 807
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L4/l006-infrastructure-vs-activation.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L4/l006-infrastructure-vs-activation.md",
      bytes: 937
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L4/l008-epistemic-asymmetry.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L4/l008-epistemic-asymmetry.md",
      bytes: 899
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/L4/l022-l4-symmetry-threshold.md",
      archive: "perception-first-design/skills/pfd/references/learnings/L4/l022-l4-symmetry-threshold.md",
      bytes: 4520
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/_index.md",
      archive: "perception-first-design/skills/pfd/references/learnings/_index.md",
      bytes: 3734
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/_search.json",
      archive: "perception-first-design/skills/pfd/references/learnings/_search.json",
      bytes: 14104
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l009-temporal-session-continuity.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l009-temporal-session-continuity.md",
      bytes: 969
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l012-route-vs-survey-knowledge.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l012-route-vs-survey-knowledge.md",
      bytes: 939
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l015-experiential-self-contradiction.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l015-experiential-self-contradiction.md",
      bytes: 1658
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l019-multi-artifact-engagement-field.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l019-multi-artifact-engagement-field.md",
      bytes: 5493
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l021-l4-ethics-fusion.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l021-l4-ethics-fusion.md",
      bytes: 4119
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l025-cascade-credit.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l025-cascade-credit.md",
      bytes: 5415
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l026-aesthetic-stability-as-trust-producer.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l026-aesthetic-stability-as-trust-producer.md",
      bytes: 5804
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/cross/l028-held-decision-compounding.md",
      archive: "perception-first-design/skills/pfd/references/learnings/cross/l028-held-decision-compounding.md",
      bytes: 5275
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l001-generative-vs-evaluative.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l001-generative-vs-evaluative.md",
      bytes: 673
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l002-access-vs-signal.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l002-access-vs-signal.md",
      bytes: 759
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l004-workspace-vs-product-separation.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l004-workspace-vs-product-separation.md",
      bytes: 907
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l005-recursive-validation.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l005-recursive-validation.md",
      bytes: 666
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l007-convergent-gap-identification.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l007-convergent-gap-identification.md",
      bytes: 918
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l010-constraints-are-distributions.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l010-constraints-are-distributions.md",
      bytes: 2907
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l014-operational-vs-structural-ethics.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l014-operational-vs-structural-ethics.md",
      bytes: 1524
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l017-iterative-regression-is-visibility.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l017-iterative-regression-is-visibility.md",
      bytes: 4737
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l020-international-citation-expansion.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l020-international-citation-expansion.md",
      bytes: 5665
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l027-internal-acknowledgment-signals.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l027-internal-acknowledgment-signals.md",
      bytes: 6712
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/learnings/meta/l029-port-dont-install-motion-audit.md",
      archive: "perception-first-design/skills/pfd/references/learnings/meta/l029-port-dont-install-motion-audit.md",
      bytes: 6024
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/mvs-psychology-reference.md",
      archive: "perception-first-design/skills/pfd/references/mvs-psychology-reference.md",
      bytes: 29785
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/pfd-spatial-extension.md",
      archive: "perception-first-design/skills/pfd/references/pfd-spatial-extension.md",
      bytes: 2956
    },
    {
      ext: "skills/perception-first-design/skills/pfd/references/practitioner-corrections.md",
      archive: "perception-first-design/skills/pfd/references/practitioner-corrections.md",
      bytes: 666
    },
    {
      ext: "skills/skills-index.json",
      archive: "skills-index.json",
      bytes: 10113
    }
  ];

  // src/export-agent-prompt.mjs
  var workspaceRoot = (workspace) => `~/.pinchgrab/workspaces/${workspace}`;
  var extractDir = (workspace, bundleId) => `${workspaceRoot(workspace)}/bundles/${bundleId}/extracted`;
  var sq = (v) => String(v).replace(/'/g, "'\\''");
  var buildBootstrapScript = ({ workspace, bundleId, archivePath, exportTs }) => [
    "#!/usr/bin/env bash",
    "# PinchGrab bootstrap — idempotent; safe to re-run.",
    "set -euo pipefail",
    `WS='${sq(workspace)}'`,
    `BID='${sq(bundleId)}'`,
    `SRC='${sq(archivePath)}'`,
    "# Normalize the archive path: expand a leading ~ (clipboard may carry the",
    "# ~/Downloads form) and translate Windows drive paths for WSL/Git-Bash.",
    'SRC="${SRC/#\\~/$HOME}"',
    'case "$SRC" in',
    "  [A-Za-z]:[\\\\/]*)",
    '    if command -v wslpath >/dev/null 2>&1; then SRC="$(wslpath -u "$SRC")";',
    '    elif command -v cygpath >/dev/null 2>&1; then SRC="$(cygpath -u "$SRC")";',
    "    else",
    '      drive="$(printf %s "${SRC%%:*}" | tr "[:upper:]" "[:lower:]")"',
    '      rest="${SRC#*:}"; rest="${rest//\\\\//}"',
    '      SRC="/mnt/$drive$rest"',
    "    fi;;",
    "esac",
    'ROOT="$HOME/.pinchgrab/workspaces/$WS"',
    'DEST="$ROOT/bundles/$BID"',
    'if [ -f "$DEST/.extracted" ] && [ "$(cat "$DEST/.extracted")" = "$BID" ]; then',
    '  echo "already-extracted $DEST/extracted"',
    "else",
    '  mkdir -p "$DEST/extracted" "$ROOT/plans/$BID" "$ROOT/audits/$BID" "$ROOT/recaptures"',
    '  if tar --zstd -xf "$SRC" -C "$DEST/extracted" 2>/dev/null; then :; else',
    '    zstd -dc "$SRC" | tar -x -C "$DEST/extracted"',
    "  fi",
    '  cp -f "$SRC" "$DEST/bundle.tar.zst"',
    `  printf '%s' "$BID" > "$DEST/.extracted"`,
    '  echo "extracted $DEST/extracted"',
    "fi",
    `[ -f "$ROOT/work-manifest.jsonl" ] || printf '%s\\n' '{"v":1,"type":"work-manifest-header","tool":"pinchgrab","workspace":"${workspace}","created":"${exportTs}"}' > "$ROOT/work-manifest.jsonl"`,
    'echo "workdir $ROOT"'
  ].join(`
`);
  var renderBundleTree = (entryNames, { collapseAt = 8, collapseDepth = 3, maxLines = 120 } = {}) => {
    const rootNode = { dirs: new Map, files: [] };
    for (const name of [...entryNames].sort()) {
      const parts = name.split("/");
      let node = rootNode;
      for (const dir of parts.slice(0, -1)) {
        if (!node.dirs.has(dir))
          node.dirs.set(dir, { dirs: new Map, files: [] });
        node = node.dirs.get(dir);
      }
      node.files.push(parts[parts.length - 1]);
    }
    const countFiles = (node) => node.files.length + [...node.dirs.values()].reduce((a, d) => a + countFiles(d), 0);
    const lines = [];
    const emit = (node, depth) => {
      const pad = "  ".repeat(depth);
      for (const [dir, child] of [...node.dirs.entries()].sort(([a], [b]) => a < b ? -1 : 1)) {
        const total = countFiles(child);
        const flat = child.dirs.size === 0;
        if (flat && total > collapseAt || depth >= collapseDepth) {
          lines.push(`${pad}${dir}/ (${total} files)`);
        } else {
          lines.push(`${pad}${dir}/`);
          emit(child, depth + 1);
        }
      }
      for (const f of node.files)
        lines.push(`${pad}${f}`);
    };
    emit(rootNode, 0);
    if (lines.length > maxLines) {
      const dropped = lines.length - maxLines;
      return [...lines.slice(0, maxLines), `… +${dropped} more`].join(`
`);
    }
    return lines.join(`
`);
  };
  var PINCHGRAB_SKILL_PATH = ".agents/skills/PinchGrab/SKILL.md";
  var PFD_SKILL_PATH = "perception-first-design/skills/pfd/SKILL.md";
  var SKILLS_INDEX_PATH = "skills-index.json";
  var SIGNAL_PATHS = [
    "AGENT-PROTOCOL.md",
    "README.md",
    "repair-index.md",
    "DESIGN.md",
    PINCHGRAB_SKILL_PATH,
    PFD_SKILL_PATH,
    SKILLS_INDEX_PATH
  ];
  var isSignalPath = (name, jsonlName) => name === jsonlName || SIGNAL_PATHS.includes(name);
  var buildBundleIgnore = () => [
    "# PinchGrab bundle ignore — a token-accounting + read-lazily signal.",
    "#",
    "# The paths below are NOT part of the up-front read: vendored skills are",
    "# consulted per-comment, screenshots per-comment, licenses/indexes on",
    "# reference. Token estimators can discount them; the manifest's `tokens`",
    "# field reports the signal (up-front) vs total counts.",
    "#",
    "# AGENTS: do NOT honor this too strictly. It is a lazy-read hint, NOT a",
    "# never-open rule — you MUST still read the skill files you map to each",
    "# comment, and any screenshot you are verifying (see AGENT-PROTOCOL.md).",
    "",
    "# Vendored design skills (read the ones you map per comment).",
    ".agents/skills/impeccable/",
    "perception-first-design/",
    "!perception-first-design/skills/pfd/SKILL.md",
    "",
    "# Binaries + generated reference (open on demand).",
    "screenshots/",
    "pages/",
    "duckdb.sql",
    "schema.json",
    "",
    "# Upstream licenses / notices.",
    "**/LICENSE",
    "**/NOTICE",
    "**/NOTICE.md",
    ""
  ].join(`
`);
  var orchestrationText = ({ workspace, bundleId, jsonlName }) => `PHASE map: for EVERY comment row in ${jsonlName}, decide which bundled skills apply and append one comment row to ~/.pinchgrab/workspaces/${workspace}/work-manifest.jsonl carrying a mapped_skills field whose entries are locators — paths relative to the extraction root (e.g. .agents/skills/impeccable/reference/<file>.md, ${PFD_SKILL_PATH}, ${PINCHGRAB_SKILL_PATH}; the full index is ${SKILLS_INDEX_PATH}). The export pre-seeds heuristic suggestedSkills on each feedback row; verify and correct them, do not trust them blindly. ` + `PHASE plan: fan out one background atomic subagent per comment; pass each subagent a standalone JSONL subinstruction (template in AGENT-PROTOCOL.md) containing the full comment row, its parent selector row, the bundle manifest line, and the FULL TEXT of every mapped skill prompt; each subagent uses your /plan (planning) capability for its phase and returns a plan, saved to plans/${bundleId}/<FEEDBACK_UID>.plan.md; each subagent also polishes its plan with /perception-first-design:all. ` + `PHASE implement: YOU — the foreground agent the operator pasted this prompt into — do all implementation, test development, testing, and iteration in <PROJECT_ROOT>; subagents only plan. Polish the implemented result with /perception-first-design:all. ` + `PHASE audit: send the combined plans + implementation for a blind atomic 'roast' peer review of BOTH plan and implementation, using whatever other-agent peer-review skills exist in YOUR OWN environment; write it to audits/${bundleId}/<runId>-roast.md and address every blocker. ` + `PHASE verify: see the 'verify' line. ` + `DEGRADATION RULE: if you cannot spawn subagents, or lack a /plan, /perception-first-design, or roast capability, perform the same phases yourself SERIALLY in this exact order — never skip a phase. ` + `SKILLS RULE: the bundled skills are for this job only — read them from the extraction directory; there is NO need to install them permanently, and you must NOT overwrite your own persistent skills, agent config, or dotfiles.`;
  var verifyText = ({ workspace, xDir, jsonlName }) => `Final verification pass, only after implementation and audit: start the product locally, then run: npx -y pinchgrab recapture ${xDir}/${jsonlName} <APP_URL> --workspace-dir ~/.pinchgrab/workspaces/${workspace} (use bunx if npx is unavailable). This re-locates every commented selector with PinchGrab's own CSS->XPath->a11y chain, screenshots each element, and writes an append-only run under recaptures/<runId>/. Read each recaptured PNG next to its original in ${xDir}/screenshots/ and confirm every comment is visibly resolved; then update the matching work-manifest.jsonl rows to status done, or blocked with a reason.`;
  var doneText = ({ bundleId }) => `You are finished when every comment has a work-manifest.jsonl row with status done or blocked, plans/${bundleId}/ holds one plan per comment, audits/${bundleId}/ holds at least one roast, and the latest recapture run locates every commented selector. work-manifest.jsonl is append-only: add rows, never rewrite history.`;
  var warningText = "The bundled DESIGN.md is PinchGrab's bare stock template — the operator did not customize it. Do NOT treat it as product canon. Prefer a more applicable canonical design source if one exists for this product (search <PROJECT_ROOT> for DESIGN.md, docs/design*, brand/ or style-guide files) and use the bundled template only as a generic checklist.";
  var buildAgentPromptJsonl = (opts) => {
    const { workspace, bundleId, archivePath, exportTs, jsonlName, counts, entryNames, designIsTemplate } = opts;
    const xDir = extractDir(workspace, bundleId);
    const has = (name) => entryNames.includes(name);
    const lines = [];
    lines.push({
      v: 1,
      type: "pinchgrab-send-to-agent",
      tool: "pinchgrab",
      workspace,
      bundleId,
      archive: archivePath,
      generated: exportTs,
      counts: { comments: counts.comments, selectors: counts.selectors, pages: counts.pages, screenshots: counts.screenshots },
      designIsStockTemplate: designIsTemplate
    });
    lines.push({
      type: "instruction",
      text: `You have been handed a PinchGrab feedback bundle: ${counts.comments} operator comments pinned to live UI elements of the product built from <PROJECT_ROOT> (infer <PROJECT_ROOT> from your current working directory; if ambiguous, ask before editing). Do this now, in order: (1) execute the bash script in the next 'bootstrap' line exactly as written (its 'script' field is a JSON-escaped plain bash script; it self-normalizes ~ and Windows drive paths for WSL/Git-Bash); (2) read EVERY file listed in the 'files' line fully into context; (3) follow AGENT-PROTOCOL.md to map, plan, implement, test, audit, and verify a fix for every comment.`
    });
    lines.push({
      type: "bootstrap",
      lang: "bash",
      idempotent: true,
      script: buildBootstrapScript({ workspace, bundleId, archivePath, exportTs })
    });
    const paths = [
      `@${xDir}/AGENT-PROTOCOL.md`,
      `@${xDir}/README.md`,
      `@${xDir}/repair-index.md`,
      `@${xDir}/${jsonlName}`
    ];
    if (has("DESIGN.md"))
      paths.push(`@${xDir}/DESIGN.md`);
    if (has(PINCHGRAB_SKILL_PATH))
      paths.push(`@${xDir}/${PINCHGRAB_SKILL_PATH}`);
    if (has(PFD_SKILL_PATH))
      paths.push(`@${xDir}/${PFD_SKILL_PATH}`);
    lines.push({
      type: "files",
      readFully: true,
      noGrep: true,
      rule: "Read each path below END-TO-END with your file-reading tool. This is NON-OPTIONAL. Do NOT grep them, do NOT head/tail them, do NOT sample line ranges — full contents into context. Screenshots and the impeccable reference files are read per-comment later, as AGENT-PROTOCOL.md directs.",
      paths
    });
    lines.push({
      type: "tree",
      root: xDir,
      entries: entryNames.length,
      text: renderBundleTree(entryNames)
    });
    lines.push({
      type: "orchestration",
      phases: ["map", "plan", "implement", "audit", "verify"],
      text: orchestrationText({ workspace, bundleId, jsonlName })
    });
    if (designIsTemplate) {
      lines.push({ type: "warning", code: "DESIGN_MD_IS_STOCK_TEMPLATE", text: warningText });
    }
    lines.push({ type: "verify", text: verifyText({ workspace, xDir, jsonlName }) });
    lines.push({ type: "done", text: doneText({ bundleId }) });
    return lines.map((l) => JSON.stringify(l)).join(`
`);
  };
  var buildAgentProtocolMd = (opts) => {
    const { workspace, bundleId, exportTs, jsonlName, counts, entryNames, designIsTemplate, skillsIndex } = opts;
    const xDir = extractDir(workspace, bundleId);
    const root = workspaceRoot(workspace);
    const has = (name) => entryNames.includes(name);
    const out = [];
    out.push("# AGENT-PROTOCOL.md");
    out.push("");
    out.push(`Workspace: \`${workspace}\` · Bundle: \`${bundleId}\` · Generated: ${exportTs}`);
    out.push(`Counts: **${counts.comments}** comments · **${counts.selectors}** selectors · **${counts.pages}** pages · **${counts.screenshots}** screenshots`);
    out.push("");
    out.push("This file is the full working doctrine for the coding agent handed this");
    out.push("bundle. The operator's clipboard prompt (JSONL) is a compact bootstrap of");
    out.push("the same content — if you only have this archive, everything you need is");
    out.push("here. Tokens in `<ANGLE_BRACKETS>` are yours to infer: `<PROJECT_ROOT>` is");
    out.push("the product's repository (usually your working directory), `<APP_URL>` is");
    out.push("the locally running product, `<FEEDBACK_UID>`/`<runId>` are per-item ids.");
    out.push("");
    out.push("## 0 · Bootstrap (idempotent)");
    out.push("");
    out.push("If `" + xDir + "` does not exist yet, run the script below with");
    out.push("`<ARCHIVE_PATH>` replaced by the absolute path of this bundle's `.tar.zst`");
    out.push("(when you are reading this from the extracted archive, that step already");
    out.push("happened — re-running is a safe no-op).");
    out.push("");
    out.push("```bash");
    out.push(buildBootstrapScript({ workspace, bundleId, archivePath: "<ARCHIVE_PATH>", exportTs }));
    out.push("```");
    out.push("");
    out.push("## 1 · Persistent workspace layout");
    out.push("");
    out.push("All PinchGrab work state lives under the persistence root — keep your");
    out.push("planning artifacts there and keep the work manifest updated:");
    out.push("");
    out.push("```");
    out.push(`${root}/`);
    out.push("  work-manifest.jsonl              # append-only agent state ledger");
    out.push("  bundles/");
    out.push(`    ${bundleId}/`);
    out.push("      bundle.tar.zst               # copy of the original archive");
    out.push("      .extracted                   # guard marker (contains the bundleId)");
    out.push("      extracted/                   # tar output — treat as IMMUTABLE input");
    out.push("  plans/");
    out.push(`    ${bundleId}/<FEEDBACK_UID>.plan.md`);
    out.push("  audits/");
    out.push(`    ${bundleId}/<runId>-roast.md`);
    out.push("  recaptures/");
    out.push("    <runId>/                       # append-only; never reuse a runId");
    out.push("      recapture-manifest.jsonl");
    out.push("      screenshots/<uid>.png");
    out.push("```");
    out.push("");
    out.push("`work-manifest.jsonl` rows (append-only; reducers group by");
    out.push("`(bundleId, feedbackUid)` and the LAST row wins — accrete, never rewrite):");
    out.push("");
    out.push("```jsonc");
    out.push("// written once by the bootstrap");
    out.push(`{"v":1,"type":"work-manifest-header","tool":"pinchgrab","workspace":"${workspace}","created":"${exportTs}"}`);
    out.push("// one per comment, appended each time its state advances");
    out.push(`{"v":1,"type":"comment","bundleId":"${bundleId}","feedbackUid":"<FEEDBACK_UID>","parentUid":"<selector uid>","selector":"<css>","mapped_skills":[{"skill":"<id from skills-index.json>","locator":"<path relative to extraction root>"}],"status":"mapped|planned|in-progress|done|blocked","plan":"plans/${bundleId}/<FEEDBACK_UID>.plan.md","notes":"<short>","ts":"<ISO>"}`);
    out.push("// appended by `pinchgrab recapture` runs");
    out.push(`{"v":1,"type":"recapture-run","runId":"<runId>","ts":"<ISO>","bundleId":"${bundleId}","located":0,"total":0}`);
    out.push("```");
    out.push("");
    out.push("## 2 · Read order (non-optional, full reads, no grep)");
    out.push("");
    out.push("Read each of these END-TO-END before any other action. Do not grep, head,");
    out.push("tail, or sample line ranges — full contents into context:");
    out.push("");
    out.push(`1. \`${xDir}/AGENT-PROTOCOL.md\` (this file)`);
    out.push(`2. \`${xDir}/README.md\``);
    out.push(`3. \`${xDir}/repair-index.md\``);
    out.push(`4. \`${xDir}/${jsonlName}\``);
    if (has("DESIGN.md"))
      out.push(`5. \`${xDir}/DESIGN.md\``);
    if (has(PINCHGRAB_SKILL_PATH))
      out.push(`6. \`${xDir}/${PINCHGRAB_SKILL_PATH}\``);
    if (has(PFD_SKILL_PATH))
      out.push(`7. \`${xDir}/${PFD_SKILL_PATH}\``);
    out.push("");
    out.push("Screenshots (`screenshots/`, indexed by `screenshots.json`) and the");
    out.push("impeccable reference files are read per-comment during the phases below.");
    out.push("");
    out.push("The bundle ships a `.gitignore` marking that lazy set (skills, screenshots,");
    out.push("licenses, indexes) so token estimators can discount it — the manifest's");
    out.push("`tokens` field reports the up-front `signal` vs `total`. **Do NOT honor the");
    out.push(".gitignore too strictly:** it is a read-lazily hint, not a never-open rule.");
    out.push("You MUST still read every skill file you map to a comment, and any");
    out.push("screenshot you verify.");
    out.push("");
    if (designIsTemplate) {
      out.push("> **WARNING — DESIGN_MD_IS_STOCK_TEMPLATE.** " + warningText);
      out.push("");
    }
    out.push("## 3 · Bundled skills");
    out.push("");
    out.push("The bundled skills are for this job only: read them from the extraction");
    out.push("directory. There is NO need to install them permanently, and you must");
    out.push("NOT overwrite your own persistent skills, agent config, or dotfiles.");
    out.push("");
    if (skillsIndex && Array.isArray(skillsIndex.skills) && skillsIndex.skills.length) {
      const cell = (v) => String(v ?? "").replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
      out.push("| id | locator (relative to extraction root) | purpose |");
      out.push("| --- | --- | --- |");
      for (const s of skillsIndex.skills) {
        const invoke = s.invoke ? ` Invoke: \`${cell(s.invoke)}\`.` : "";
        out.push(`| \`${cell(s.id)}\` | \`${cell(s.path)}\` | ${cell(s.purpose)}${invoke} |`);
      }
      out.push("");
      out.push("Provenance (upstream repo + pinned commit + license) for every vendored");
      out.push(`skill is recorded in \`${SKILLS_INDEX_PATH}\` at the archive root.`);
    } else {
      out.push("_This bundle was exported without the vendored skill set (the operator");
      out.push('disabled "Bundle design skills"). Map comments against whatever design');
      out.push("skills exist in YOUR OWN environment instead, and note that in the");
      out.push("work manifest._");
    }
    out.push("");
    out.push("## 4 · Phases");
    out.push("");
    out.push("Run the five phases in order. **Degradation rule:** if you cannot spawn");
    out.push("subagents, or lack a `/plan`, `/perception-first-design`, or roast");
    out.push("capability, perform the same phases yourself SERIALLY in this exact order");
    out.push("— never skip a phase.");
    out.push("");
    out.push("### map");
    out.push("");
    out.push(`For EVERY comment row in \`${jsonlName}\`, decide which bundled skills apply`);
    out.push("and append one `comment` row to `work-manifest.jsonl` carrying a");
    out.push("`mapped_skills` field whose entries are locators (see §3). The export");
    out.push("pre-seeds heuristic `suggestedSkills` on each feedback row; verify and");
    out.push("correct them, do not trust them blindly.");
    out.push("");
    out.push("### plan");
    out.push("");
    out.push("Fan out ONE background atomic subagent per comment. Pass each subagent a");
    out.push("standalone JSONL subinstruction containing the full comment row, its");
    out.push("parent selector row, the bundle manifest line, and the FULL TEXT of every");
    out.push("mapped skill prompt. Each subagent uses your `/plan` (planning) capability");
    out.push(`for its phase, polishes its plan with \`/perception-first-design:all\`, and`);
    out.push(`returns a plan you save to \`plans/${bundleId}/<FEEDBACK_UID>.plan.md\`.`);
    out.push("");
    out.push("Subagent subinstruction template (one JSONL document per subagent; hydrate");
    out.push("every `<...>` before dispatch):");
    out.push("");
    out.push("```jsonc");
    out.push(`{"v":1,"type":"pinchgrab-subagent-plan","bundleId":"${bundleId}","feedbackUid":"<FEEDBACK_UID>"}`);
    out.push('{"type":"instruction","text":"You are a planning subagent for ONE user complaint about a live UI element. Use your /plan capability. Produce an implementation plan ONLY — do not edit files. Deliver: root-cause hypothesis, exact files/selectors to change in <PROJECT_ROOT>, step-by-step edits, test plan, and how the fix will be visually verified against the original screenshot. Polish the plan with /perception-first-design:all before returning it."}');
    out.push('{"type":"comment","row":<full feedback row from the bundle JSONL>}');
    out.push('{"type":"target","row":<full parent selector row from the bundle JSONL>}');
    out.push('{"type":"manifest","row":<the bundle manifest line>}');
    out.push(`{"type":"screenshot","path":"${xDir}/screenshots/<file>.png"}`);
    out.push('{"type":"skill","id":"<mapped skill id>","text":"<FULL TEXT of the mapped skill file>"}');
    out.push("```");
    out.push("");
    out.push("### implement");
    out.push("");
    out.push("YOU — the foreground agent the operator pasted the prompt into — do all");
    out.push("implementation, test development, testing, and iteration in");
    out.push("`<PROJECT_ROOT>`. Subagents only plan. Work one comment at a time, update");
    out.push("its work-manifest row to `in-progress` then `done`/`blocked`, and polish");
    out.push("the implemented result with `/perception-first-design:all`.");
    out.push("");
    out.push("### audit");
    out.push("");
    out.push("Send the combined plans + implementation for a blind atomic 'roast' peer");
    out.push("review of BOTH plan and implementation, using whatever other-agent");
    out.push(`peer-review skills exist in YOUR OWN environment. Write it to`);
    out.push(`\`audits/${bundleId}/<runId>-roast.md\` and address every blocker it raises.`);
    out.push("");
    out.push("### verify");
    out.push("");
    out.push("Only after implementation and audit: start the product locally, then run");
    out.push("");
    out.push("```bash");
    out.push(`npx -y pinchgrab recapture ${xDir}/${jsonlName} <APP_URL> --workspace-dir ${root}`);
    out.push("# bunx works too; add --auth-state <storageState.json> for logged-in pages");
    out.push("```");
    out.push("");
    out.push("This re-locates every commented selector with PinchGrab's own");
    out.push("CSS→XPath→a11y chain, screenshots each element, and writes an append-only");
    out.push(`run under \`recaptures/<runId>/\` (plus a \`recapture-run\` ledger row). It`);
    out.push("exits 0 only when every commented selector still resolves. Read each");
    out.push(`recaptured PNG next to its original in \`${xDir}/screenshots/\` and confirm`);
    out.push("every comment is visibly resolved; then update the matching");
    out.push("work-manifest rows to `done`, or `blocked` with a reason.");
    out.push("");
    out.push("## 5 · Done criteria");
    out.push("");
    out.push(doneText({ bundleId }));
    out.push("");
    return out.join(`
`);
  };

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
      return loadTemplate("designTemplate");
    };
    const resolveSkillContent = async () => {
      if (prefs.skillMd && prefs.skillMd.trim())
        return prefs.skillMd;
      return loadTemplate("skillTemplate");
    };
    const isUsingTemplateDesign = () => !prefs.designMd || !prefs.designMd.trim();
    const isUsingTemplateSkill = () => !prefs.skillMd || !prefs.skillMd.trim();
    const bundledSkillCache = new Map;
    const loadBundledSkillFile = async (extPath) => {
      const cached = bundledSkillCache.get(extPath);
      if (cached !== undefined)
        return cached;
      try {
        const url = inExtension && chrome.runtime?.getURL ? chrome.runtime.getURL(extPath) : extPath;
        const res = await fetch(url);
        if (!res.ok)
          throw new Error(`status ${res.status}`);
        const text = await res.text();
        bundledSkillCache.set(extPath, text);
        return text;
      } catch (err) {
        console.warn(LOG, `bundled skill fetch failed: ${extPath}`, err);
        return null;
      }
    };
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
      pageShotPerCapture: false,
      quietSaves: true,
      quietNudgeDismissed: false,
      autosaveToDisk: true,
      bundleSkills: true,
      includePageHTML: false
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
      kind: null,
      agentPrompt: null
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
    let exportClockOverride = null;
    const exportNowIso = () => exportClockOverride ?? new Date().toISOString();
    const computeContentHash = async (shotNames) => {
      const payload = buildSlim().map((l) => JSON.stringify(l)).join(`
`) + `
` + [...shotNames].sort().join(`
`);
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
      return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    };
    const buildExportFilename = (ext, stamp) => `pinchgrab-${activeWs}-${dominantHostSlug()}-${stamp ?? Date.now()}.${ext}`;
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
      scheduleAutosave();
    };
    const AUTOSAVE_DEBOUNCE_MS = 12000;
    let autosaveTimer;
    let autosaveDirty = false;
    const flushAutosave = () => {
      autosaveDirty = false;
      if (autosaveTimer) {
        clearTimeout(autosaveTimer);
        autosaveTimer = undefined;
      }
      if (!inExtension || !prefs.autosaveToDisk || !messages.length)
        return;
      const ws = activeWs;
      const filename = `${ws}.autosave.jsonl`;
      try {
        const text = buildJsonl(filename, "jsonl");
        sendToBg({ kind: "save-text", workspace: ws, filename, text, mime: "application/jsonl", subdir: "" });
      } catch (err) {
        console.warn(LOG, "autosave failed", err);
      }
    };
    const scheduleAutosave = () => {
      if (!inExtension || !prefs.autosaveToDisk)
        return;
      autosaveDirty = true;
      if (autosaveTimer)
        return;
      autosaveTimer = setTimeout(() => {
        autosaveTimer = undefined;
        if (autosaveDirty)
          flushAutosave();
      }, AUTOSAVE_DEBOUNCE_MS);
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && autosaveDirty)
        flushAutosave();
    });
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
        case "select-mode":
          syncSelectMode(msg.on);
          return;
        default:
          return;
      }
    };
    let selectMode = false;
    const reflectSelectMode = () => {
      for (const b of document.querySelectorAll('[data-action="select-mode"]')) {
        b.classList.toggle("toggled", selectMode);
        b.setAttribute("aria-pressed", String(selectMode));
      }
    };
    const syncSelectMode = (on) => {
      if (selectMode === on)
        return;
      selectMode = on;
      reflectSelectMode();
      setStatus(on ? "Pinch mode on — click the page to capture (Esc exits)" : "Pinch mode off");
    };
    const onToggleSelectMode = () => {
      selectMode = !selectMode;
      sendToCS({ kind: "select-mode", on: selectMode });
      reflectSelectMode();
      setStatus(selectMode ? "Pinch mode on — click the page to capture (Esc exits)" : "Pinch mode off");
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
          if (curGroup && !m.detached)
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
        const adjacency = m.type === "feedback" && m.detached ? null : lastSelectorSel;
        const node = renderMessage(m, adjacency);
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
        else if (node.classList.contains("msg") && node.classList.contains("feedback") && node.classList.contains("threaded") && lastSelectorEl)
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
      if (lastSelectorSel || m.parentUid) {
        actions.append(actionBtn("unlink", "Detach from its capture — make this a standalone comment", () => {
          const live = messages.find((x) => x.type === "feedback" && x.id === m.id);
          if (!live) {
            setStatus("Comment no longer exists", { kind: "warn" });
            return;
          }
          snapshot();
          delete live.parentUid;
          live.detached = true;
          persist();
          render();
          setStatus("Comment detached — drag its handle onto a capture to reattach");
        }));
      }
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
        delete src.detached;
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
          if (m.detached)
            rich.detached = true;
          rich.suggestedSkills = suggestSkillsFor(m.text);
          if (pendingSel && !m.detached) {
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
    const buildManifest = (filename, format, opts = {}) => {
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
      const nowIso = opts.nowIso ?? exportNowIso();
      const out = {
        v: 2,
        type: "manifest",
        tool: "pinchgrab",
        ts: nowIso,
        generated: Date.parse(nowIso),
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
      if (opts.bundleId)
        out.bundleId = opts.bundleId;
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
    const buildJsonl = (filenameForManifest, format = "jsonl", opts = {}) => {
      const filename = filenameForManifest ?? buildExportFilename("jsonl");
      const manifest = buildManifest(filename, format, opts);
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
      const contentHash = await computeContentHash([]);
      const filename = buildExportFilename("jsonl", contentHash.slice(0, 8));
      const text = buildJsonl(filename, "jsonl", { nowIso: exportNowIso(), bundleId: contentHash.slice(0, 16) });
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
            bundleId: { type: "string", pattern: "^[0-9a-f]{16}$" },
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
                orphanedFeedback: { type: "integer" },
                pagesHtml: { type: "integer" }
              }
            },
            agentProtocol: {
              type: "object",
              required: ["archivePath"],
              properties: { archivePath: { type: "string" } }
            },
            tokens: {
              type: "object",
              required: ["signalBytes", "totalBytes", "signalTokens", "totalTokens", "ignore"],
              properties: {
                signalBytes: { type: "integer" },
                totalBytes: { type: "integer" },
                signalTokens: { type: "integer" },
                totalTokens: { type: "integer" },
                ignore: { type: "string" }
              }
            },
            bundledSkills: {
              type: "array",
              items: {
                type: "object",
                required: ["id", "kind", "archivePath"],
                properties: {
                  id: { type: "string" },
                  kind: { enum: ["skill", "reference"] },
                  archivePath: { type: "string" },
                  invocation: { type: "string" }
                }
              }
            },
            pagesHtml: {
              type: "array",
              items: {
                type: "object",
                required: ["url", "archivePath", "bytes"],
                properties: {
                  url: { type: "string" },
                  archivePath: { type: "string" },
                  bytes: { type: "integer" }
                }
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
            detached: { type: "boolean" },
            tags: { type: "array", items: { type: "string" } },
            isTestData: { type: "boolean" },
            suggestedSkills: {
              type: "array",
              items: {
                type: "object",
                required: ["skill", "locator"],
                properties: { skill: { type: "string" }, locator: { type: "string" } }
              }
            }
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
    const suggestSkillsFor = (text) => {
      const PINCHGRAB = { skill: "pinchgrab", locator: ".agents/skills/PinchGrab/SKILL.md" };
      const PFD = { skill: "pfd", locator: "perception-first-design/skills/pfd/SKILL.md" };
      const imp = (slug) => ({ skill: `impeccable/${slug}`, locator: `.agents/skills/impeccable/reference/${slug}.md` });
      const vendored = prefs.bundleSkills && BUNDLED_SKILLS_PRESENT;
      if (!vendored)
        return [PINCHGRAB];
      switch (inferFeedbackCategory(text)) {
        case "copy":
          return [PINCHGRAB, imp("clarify"), PFD];
        case "layout":
          return [PINCHGRAB, imp("layout"), PFD];
        case "affordance":
          return [PINCHGRAB, imp("interaction-design"), PFD];
        case "accessibility":
          return [PINCHGRAB, imp("audit"), PFD];
        case "state":
          return [PINCHGRAB, PFD];
        case "visual-polish":
          return [PINCHGRAB, imp("polish"), PFD];
        default:
          return [PINCHGRAB, PFD];
      }
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
        manifest.agentProtocol ? `- \`${manifest.agentProtocol.archivePath}\` — the agent working doctrine: phases, persistence layout, verification loop (**agents start here**).` : "",
        "- `repair-index.md` — agent-friendly triage punch list (one task per comment).",
        `- \`${jsonlName}\` — JSONL stream (one capture per line, leading manifest, schema v2).`,
        "- `screenshots/*.png` — full-resolution PNGs of each captured element / group / page.",
        "- `screenshots.json` — uid-keyed index: `byUid[uid] → { element?, group?, page? }`, `byUrl[url] → { page?, uids[] }`, plus a flat `files[]` listing.",
        "- `schema.json` — JSON-Schema (draft 2020-12) describing every row type.",
        "- `duckdb.sql` — copy-and-paste recipes for querying the JSONL with DuckDB.",
        manifest.bundledSkills?.length ? `- \`skills-index.json\` — locator index for the ${manifest.bundledSkills.length} bundled skill documents (id → archive path → purpose → upstream provenance).` : "",
        manifest.tokens ? `- \`.gitignore\` — the read-lazily set (skills, screenshots, licenses). The up-front read is ~**${manifest.tokens.signalTokens.toLocaleString()}** tokens of ~**${manifest.tokens.totalTokens.toLocaleString()}** total; the rest is opened on demand. Do NOT honor it too strictly — you still read mapped skill files and verified screenshots.` : "",
        manifest.bundledSkills?.length ? "- `.agents/skills/impeccable/reference/*.md` + `perception-first-design/**` — vendored design skills, each with its upstream license; read them from this archive, no installation needed." : "",
        manifest.pagesHtml?.length ? `- \`pages/*.html\` — full serialized HTML of ${manifest.pagesHtml.length} captured page${manifest.pagesHtml.length === 1 ? "" : "s"} (opt-in).` : "",
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
        manifest.agentProtocol ? "AGENT-PROTOCOL.md               # agent working doctrine (start here)" : "",
        `screenshots/                    # element / group / page PNGs`,
        `screenshots.json                # uid-keyed lookup index`,
        `duckdb.sql                      # copy-paste SQL recipes`,
        `schema.json                     # JSON-Schema for every row type`,
        `README.md                       # this file`,
        manifest.bundledSkills?.length ? "skills-index.json               # bundled-skill locator index" : "",
        manifest.bundledSkills?.length ? ".agents/skills/impeccable/      # vendored reference guides (Apache-2.0)" : "",
        manifest.bundledSkills?.length ? "perception-first-design/        # vendored PFD framework (CC BY-SA 4.0)" : "",
        manifest.pagesHtml?.length ? "pages/                          # full page HTML (opt-in)" : "",
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
    const buildScreenshotsIndex = (bundled, nowIso) => {
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
        generated: nowIso ?? exportNowIso(),
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
    const pageHtmlSlug = (url, taken) => {
      let slug = "page";
      try {
        const u = new URL(url);
        slug = `${u.host}${u.pathname}`.replace(/\/+$/, "").replace(/[^\w.-]+/g, "_").slice(0, 80) || u.host;
      } catch {}
      let unique = slug;
      for (let i = 2;taken.has(unique); i++)
        unique = `${slug}~${i}`;
      taken.add(unique);
      return unique;
    };
    const collectPageHtmlEntries = async () => {
      const entries = [];
      const pagesMeta = [];
      const diagnostics = [];
      if (!prefs.includePageHTML || !inExtension)
        return { entries, pagesMeta, diagnostics };
      const urls = new Set;
      for (const m of messages) {
        if (m.type === "selector" && m.entry.url)
          urls.add(m.entry.url);
        else if (m.type === "page" && m.url)
          urls.add(m.url);
      }
      if (!urls.size)
        return { entries, pagesMeta, diagnostics };
      let tabs = [];
      try {
        tabs = await chrome.tabs.query({});
      } catch {}
      const taken = new Set;
      for (const url of [...urls].sort()) {
        const tab = tabs.find((t) => t.url === url) ?? tabs.find((t) => (t.url ?? "").split("#")[0] === url.split("#")[0]);
        let html;
        if (tab?.id != null) {
          try {
            const reply = await chrome.tabs.sendMessage(tab.id, pg({ kind: "page-html" }));
            if (reply?.ok && reply.html)
              html = reply.html;
          } catch {}
        }
        if (!html) {
          diagnostics.push({ severity: "info", code: "PAGE_HTML_UNAVAILABLE", detail: url });
          continue;
        }
        const archivePath = `pages/${pageHtmlSlug(url, taken)}.html`;
        entries.push({ name: archivePath, data: html });
        pagesMeta.push({ url, archivePath, bytes: new TextEncoder().encode(html).length });
      }
      return { entries, pagesMeta, diagnostics };
    };
    const onExportZip = async () => {
      if (!messages.length) {
        setStatus("Nothing to export", { kind: "warn" });
        return;
      }
      const exportedAtIso = exportNowIso();
      const mtimeSec = Math.floor(Date.parse(exportedAtIso) / 1000);
      const { entries: shotEntries, bundled } = collectScreenshotEntries();
      const contentHash = await computeContentHash(shotEntries.map((e) => e.name));
      const bundleId = contentHash.slice(0, 16);
      const archiveName = buildExportFilename("tar.zst", contentHash.slice(0, 8));
      const stem = archiveName.replace(/\.tar\.zst$/, "");
      const jsonlName = `${stem}.jsonl`;
      const manifestOpts = { nowIso: exportedAtIso, bundleId };
      const manifest = buildManifest(archiveName, "tar.zst", manifestOpts);
      const { entries: pageHtmlEntries, pagesMeta, diagnostics: pageHtmlDiagnostics } = await collectPageHtmlEntries();
      const entryNames = [
        "README.md",
        "repair-index.md",
        jsonlName,
        "screenshots.json",
        "duckdb.sql",
        "schema.json",
        "AGENT-PROTOCOL.md",
        ".gitignore",
        ...shotEntries.map((e) => e.name),
        "DESIGN.md",
        ".agents/skills/PinchGrab/SKILL.md",
        ...prefs.bundleSkills && BUNDLED_SKILLS_PRESENT ? BUNDLED_SKILL_FILES.map((f) => f.archive) : [],
        ...pageHtmlEntries.map((e) => e.name)
      ].sort();
      const agentPromptOpts = {
        workspace: activeWs,
        bundleId,
        archivePath: `~/Downloads/pinchgrab/${activeWs}/exports/${archiveName}`,
        exportTs: exportedAtIso,
        jsonlName,
        counts: { comments: manifest.counts.feedback, selectors: manifest.counts.selectors, pages: manifest.counts.pages, screenshots: shotEntries.length },
        entryNames,
        designIsTemplate: isUsingTemplateDesign()
      };
      lastExport.agentPrompt = buildAgentPromptJsonl(agentPromptOpts);
      const earlyCopied = await copyToClipboardSilent(lastExport.agentPrompt);
      if (earlyCopied)
        showCopied("Prompt copied", "assembling the bundle…");
      const skillEntries = [];
      let skillsIndex = null;
      if (prefs.bundleSkills && BUNDLED_SKILLS_PRESENT) {
        const loaded = await Promise.all(BUNDLED_SKILL_FILES.map(async (f) => ({ f, data: await loadBundledSkillFile(f.ext) })));
        let skipped = 0;
        for (const { f, data } of loaded) {
          if (data == null) {
            skipped++;
            continue;
          }
          skillEntries.push({ name: f.archive, data });
          if (f.archive === "skills-index.json") {
            try {
              skillsIndex = JSON.parse(data);
            } catch {}
          }
        }
        if (skipped)
          console.warn(LOG, `bundled skills: ${skipped}/${loaded.length} files missing from this build — export continues without them`);
      }
      manifest.agentProtocol = { archivePath: "AGENT-PROTOCOL.md" };
      if (skillsIndex?.skills?.length) {
        manifest.bundledSkills = skillsIndex.skills.map((s) => ({
          id: s.id,
          kind: s.id.startsWith("impeccable/") ? "reference" : "skill",
          archivePath: s.path,
          ...s.invoke ? { invocation: s.invoke } : {}
        }));
      }
      if (pagesMeta.length) {
        manifest.pagesHtml = pagesMeta;
        manifest.counts.pagesHtml = pagesMeta.length;
      }
      if (pageHtmlDiagnostics.length) {
        manifest.exportDiagnostics = [...manifest.exportDiagnostics ?? [], ...pageHtmlDiagnostics];
      }
      const jsonlText = buildJsonl(jsonlName, "tar.zst", manifestOpts);
      const sql = duckDbSnippet(jsonlName);
      const readme = buildReadme(manifest, jsonlName, shotEntries.length);
      const shotsJson = buildScreenshotsIndex(bundled, exportedAtIso);
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
      tarEntries.push(...skillEntries, ...pageHtmlEntries);
      tarEntries.push({ name: "AGENT-PROTOCOL.md", data: buildAgentProtocolMd({ ...agentPromptOpts, skillsIndex }) });
      tarEntries.push({ name: ".gitignore", data: buildBundleIgnore() });
      let signalBytes = 0;
      let totalBytes = 0;
      for (const e of tarEntries) {
        const b = typeof e.data === "string" ? new TextEncoder().encode(e.data).length : e.data.length;
        totalBytes += b;
        if (isSignalPath(e.name, jsonlName))
          signalBytes += b;
      }
      manifest.tokens = {
        signalBytes,
        totalBytes,
        signalTokens: Math.ceil(signalBytes / 4),
        totalTokens: Math.ceil(totalBytes / 4),
        ignore: ".gitignore"
      };
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
      for (const e of tarEntries)
        e.mtime ??= mtimeSec;
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
          lastExport.agentPrompt = buildAgentPromptJsonl({ ...agentPromptOpts, archivePath: pathToCopy });
          const lateCopied = await copyToClipboardSilent(lastExport.agentPrompt);
          const promptCopied = lateCopied || earlyCopied;
          const leaf = pathToCopy.replace(/[\\/]+$/, "").split(/[\\/]/).pop() ?? pathToCopy;
          if (promptCopied)
            showCopied("Sent to agent", "prompt copied — paste into your coding agent");
          setStatus(`Sent to agent · ${shotEntries.length} screenshot${shotEntries.length === 1 ? "" : "s"} bundled${promptCopied ? " · prompt copied" : " · clipboard blocked — use Cmd+K → Copy Send-to-Agent prompt"}${lastExport.tempPath ? " · Playwright temp hidden" : ""} · ${leaf}`);
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
      showCopied("Sent to agent", "prompt copied — paste into your coding agent");
      setStatus(`Sent to agent · ${shotEntries.length} screenshot${shotEntries.length === 1 ? "" : "s"} bundled${earlyCopied ? " · prompt copied" : ""}`);
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
            if (o.detached)
              fb.detached = true;
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
      if (!confirm("Clear all captures? A snapshot will be saved to Settings → Workspaces first."))
        return;
      const snap = archiveWorkspaceSnapshot();
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
      setStatus(snap ? "Cleared · snapshot saved — restore in Settings → Workspaces" : "Cleared");
    };
    const runValidation = async () => {
      const selectors = [...new Set(messages.filter((m) => m.type === "selector").map((m) => m.entry.selector))];
      if (!selectors.length || !inExtension)
        return { total: selectors.length, resolved: 0, attached: true };
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0])
          return { total: selectors.length, resolved: 0, attached: false };
        liveTabUrl = tabs[0].url ?? liveTabUrl;
        liveTabPath = pathOf(liveTabUrl ?? "");
        const reply = await chrome.tabs.sendMessage(tabs[0].id, pg({ kind: "validate", selectors }));
        if (!reply?.valid)
          return { total: selectors.length, resolved: 0, attached: false };
        let resolved = 0;
        for (const [sel, ok] of Object.entries(reply.valid)) {
          selectorValidity.set(sel, ok);
          if (ok)
            resolved++;
          else
            selectorErrors.set(sel, "No element on the live page matches this selector.");
        }
        render();
        return { total: selectors.length, resolved, attached: true };
      } catch {
        return { total: selectors.length, resolved: 0, attached: false };
      }
    };
    const onValidate = async () => {
      if (!messages.some((m) => m.type === "selector")) {
        setStatus("No selectors to re-check", { kind: "info" });
        return;
      }
      setStatus("Re-checking selectors on the live page…", { kind: "info" });
      const r = await runValidation();
      if (!r.attached) {
        setStatus("Can't reach the page — use Re-attach to page (Cmd+K), then re-check", { kind: "warn" });
        return;
      }
      const missed = r.total - r.resolved;
      setStatus(missed === 0 ? `All ${r.total} selector${r.total === 1 ? "" : "s"} resolve on the live page ✓` : `${r.resolved}/${r.total} selectors resolve · ${missed} no longer match (flagged Stale)`, missed === 0 ? { kind: "ok" } : { kind: "warn" });
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
    const onReattach = async () => {
      if (!inExtension) {
        setStatus("Re-attach only works inside the extension", { kind: "warn" });
        return;
      }
      const reply = await sendToBg({ kind: "pg-reinject" });
      if (reply?.ok)
        setStatus("Re-attached — Alt+Click is live");
      else
        setStatus(`Couldn't re-attach — click the PinchGrab toolbar button on the page${reply?.error ? ` · ${reply.error}` : ""}`, { kind: "warn" });
    };
    const quietNudge = document.querySelector("[data-quiet-nudge]");
    const maybeShowQuietNudge = async () => {
      if (!quietNudge || !inExtension || !chrome.permissions?.contains)
        return;
      if (!prefs.quietSaves || prefs.quietNudgeDismissed) {
        quietNudge.hidden = true;
        return;
      }
      try {
        const granted = await chrome.permissions.contains({ permissions: ["downloads.ui"] });
        quietNudge.hidden = granted;
      } catch {
        quietNudge.hidden = true;
      }
    };
    const onQuietEnable = async () => {
      let granted = false;
      try {
        granted = await chrome.permissions.request({ permissions: ["downloads.ui"] });
      } catch (err) {
        console.warn(LOG, "downloads.ui permission request failed", err);
      }
      prefs.quietSaves = granted;
      if (!granted)
        prefs.quietNudgeDismissed = true;
      persistPrefs();
      applyPrefsToUI();
      if (quietNudge)
        quietNudge.hidden = true;
      setStatus(granted ? "Quiet saves on — no more download popups" : "Saves stay visible — re-enable in Settings → Capture", granted ? {} : { kind: "info" });
    };
    const onQuietDismiss = () => {
      prefs.quietSaves = false;
      prefs.quietNudgeDismissed = true;
      persistPrefs();
      applyPrefsToUI();
      if (quietNudge)
        quietNudge.hidden = true;
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
        const key = t.dataset.pref;
        const checked = Boolean(t.checked);
        if (key === "quietSaves" && checked && inExtension && chrome.permissions?.request) {
          (async () => {
            let granted = false;
            try {
              granted = await chrome.permissions.request({ permissions: ["downloads.ui"] });
            } catch (err) {
              console.warn(LOG, "downloads.ui permission request failed", err);
            }
            prefs.quietSaves = granted;
            t.checked = granted;
            persistPrefs();
            setStatus(granted ? "Quiet saves on — no more download popups" : "Permission declined — saves stay visible", granted ? {} : { kind: "warn" });
          })();
          return;
        }
        prefs[key] = checked;
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
      { id: "export-zip", label: "Send to Agent — export .tar.zst + copy the agent prompt", run: () => void onExportZip() },
      { id: "copy-path", label: "Copy path of last export", run: () => void onCopyPath() },
      { id: "copy-agent-prompt", label: "Copy Send-to-Agent prompt (last export)", run: () => {
        (async () => {
          if (!lastExport.agentPrompt) {
            setStatus("No export yet — Send to Agent first", { kind: "warn" });
            return;
          }
          const ok = await copyToClipboardSilent(lastExport.agentPrompt);
          setStatus(ok ? "Agent prompt copied" : "Clipboard unavailable", ok ? {} : { kind: "warn" });
        })();
      } },
      { id: "duckdb", label: "Generate DuckDB query snippet (SQL recipes)", run: () => void onDuckDbSnippet() },
      { id: "import", label: "Import JSONL file", run: onImport },
      { id: "select-mode", label: "Toggle pinch mode (capture without holding Alt)", run: onToggleSelectMode },
      { id: "validate", label: "Re-check selectors", run: () => void onValidate() },
      { id: "reattach", label: "Re-attach to page (fix Alt+Click)", run: () => void onReattach() },
      { id: "reload-extension", label: "Reload the PinchGrab extension (last resort)", run: () => {
        if (inExtension)
          chrome.runtime.reload();
      } },
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
    const TIP_IDLE = "Alt+Click on the page to capture · hover any control for help";
    let tipFor = null;
    const drawerTipEl = document.querySelector("[data-drawer-tip]");
    const showTip = (target) => {
      const text = target.getAttribute("data-tip");
      if (!text)
        return;
      tooltipEl.textContent = text;
      tooltipEl.dataset.shown = "true";
      if (drawerTipEl) {
        drawerTipEl.textContent = text;
        drawerTipEl.dataset.shown = "true";
      }
    };
    const hideTip = () => {
      tipFor = null;
      tooltipEl.textContent = TIP_IDLE;
      tooltipEl.dataset.shown = "false";
      if (drawerTipEl) {
        drawerTipEl.textContent = "";
        drawerTipEl.dataset.shown = "false";
      }
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
        case "select-mode":
          onToggleSelectMode();
          return;
        case "reattach":
          onReattach();
          return;
        case "quiet-enable":
          onQuietEnable();
          return;
        case "quiet-dismiss":
          onQuietDismiss();
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
            const text = await loadTemplate("designTemplate");
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
            const text = await loadTemplate("skillTemplate");
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
        getLastAgentPrompt: () => lastExport.agentPrompt,
        __seedShotsFull: (dataUrl) => {
          for (const m of messages) {
            if (m.type === "selector")
              shotsFull.set(m.entry.selector, dataUrl);
          }
          persistShotsFull();
        },
        __getShotsFull: () => shotsFull,
        __setExportClock: (iso) => {
          exportClockOverride = iso;
        },
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
    const watchContextHealth = () => {
      if (!inExtension)
        return;
      const RELOAD_KEY = "pg.ctxReloads";
      setTimeout(() => {
        try {
          sessionStorage.removeItem(RELOAD_KEY);
        } catch {}
      }, 15000);
      setInterval(() => {
        let alive = false;
        try {
          alive = Boolean(chrome.runtime?.id);
        } catch {
          alive = false;
        }
        if (alive)
          return;
        let n = 0;
        try {
          n = Number(sessionStorage.getItem(RELOAD_KEY) ?? "0");
        } catch {}
        if (n >= 3) {
          if (status)
            status.textContent = "PinchGrab was reloaded — close this panel and reopen it from the toolbar.";
          return;
        }
        try {
          sessionStorage.setItem(RELOAD_KEY, String(n + 1));
        } catch {}
        if (status)
          status.textContent = "PinchGrab reloaded — reconnecting…";
        setTimeout(() => {
          try {
            location.reload();
          } catch {}
        }, 600);
      }, 2000);
    };
    (async () => {
      await loadAll();
      panelReady = true;
      for (const m of pendingPanelMessages.splice(0))
        onCsMessage(m);
      render();
      installTestApi();
      runValidation();
      maybeShowQuietNudge();
      fetchStars();
      updateComposerMeter();
      updateUndoButtons();
      watchContextHealth();
      console.log(LOG, "ready", { inExtension, ws: activeWs, messages: messages.length });
    })();
  })();
})();

//# debugId=190CD0DEDE56DEDF64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvYnVuZGxlZC1za2lsbHMuZ2VuLnRzIiwgInNyYy9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICAvLyBVc2VyIGV4cGxpY2l0bHkgZGV0YWNoZWQgdGhpcyBjb21tZW50IGZyb20gYW55IHNlbGVjdG9yLiBXaXRob3V0IHRoZVxuICAvLyBmbGFnLCBhZGphY2VuY3kgdG8gdGhlIHByZWNlZGluZyBzZWxlY3RvciB3b3VsZCBzaWxlbnRseSByZS1hZG9wdCB0aGVcbiAgLy8gY29tbWVudCBhdCByZW5kZXIvZXhwb3J0IHRpbWUuXG4gIGRldGFjaGVkPzogYm9vbGVhbjtcbiAgdGFncz86IHN0cmluZ1tdO1xuICAvLyBTZXZlcml0eSAoYG5vdGVgIC8gYGZpeGAgLyBgYmxvY2tgKSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSBpblxuICAvLyAyMDI2LTA1LiBUaGUgZmllbGQgaXMgcmV0YWluZWQgb24gdGhlIHR5cGUgYXMgYHVua25vd25gIHNvXG4gIC8vIHRvbGVyYW50IHJlYWRlcnMgKGBkZW5vcm1hbGl6ZUVudHJ5YCkgZG9uJ3QgZHJvcCB0aGUgdmFsdWUgZnJvbVxuICAvLyBsZWdhY3kgSlNPTkwgZXhwb3J0czsgbmV3IHNlc3Npb25zIG5ldmVyIHNldCBpdC5cbiAgc2V2ZXJpdHk/OiAnbm90ZScgfCAnZml4JyB8ICdibG9jayc7XG59O1xuXG5leHBvcnQgdHlwZSBQYWdlTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3BhZ2UnO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHZpZXdwb3J0PzogVmlld3BvcnQ7XG4gIHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBSb3V0ZSBpZGVudGl0eSBiZXlvbmQgdGhlIFVSTC4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIG9mIHBhdGhuYW1lXG4gIC8vIC8gcXVlcnkgLyBoYXNoICsgYSBndWVzcyBhdCB0aGVcbiAgLy8gYWN0aXZlIHJvdXRlTmFtZSAoYD9yb3V0ZT1zZXR0aW5nc2Agb3IgYCMvdXNlcnMvNDJgIHN0eWxlKS5cbiAgcm91dGU/OiB7XG4gICAgcGF0aG5hbWU/OiBzdHJpbmc7XG4gICAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGhhc2g/OiBzdHJpbmc7XG4gICAgcm91dGVOYW1lPzogc3RyaW5nO1xuICAgIHJvdXRlUGFyYW0/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFJlZGFjdGVkIHN0YXRlIHNuYXBzaG90LiBTdXJmYWNlcyB0aGUgU0hBUEUgb2Ygc3RhdGUgdGhhdCBwcm9kdWNlZFxuICAvLyB0aGUgcGFnZSAoc3RvcmFnZSBrZXlzLCBjb29raWUgbmFtZXMsIGZlYXR1cmUgZmxhZ3MpIHdpdGhvdXRcbiAgLy8gbGVha2luZyB2YWx1ZXMuIExldHMgYSBkb3duc3RyZWFtIGFnZW50IHJlcHJvZHVjZSBieSBzZXR0aW5nIHVwIHRoZVxuICAvLyBzYW1lIGtleXMgd2l0aCB0aGVpciBvd24gZGF0YS5cbiAgc3RhdGU/OiB7XG4gICAgc3RvcmFnZUtleXM/OiBzdHJpbmdbXTtcbiAgICBzZXNzaW9uS2V5cz86IHN0cmluZ1tdO1xuICAgIGNvb2tpZU5hbWVzPzogc3RyaW5nW107XG4gICAgZmVhdHVyZUZsYWdzPzogc3RyaW5nO1xuICB9O1xuICAvLyBTZXNzaW9uIHV1aWQuIFN0YWJsZSBwZXIgd29ya3NwYWNlLWJvb3Qg4oCUIHNlbGVjdG9yIGVudHJpZXMgcmVmZXJlbmNlXG4gIC8vIGl0IHZpYSBgRW50cnkuc2Vzc2lvbklkYCBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzIHRvIHRoZWlyXG4gIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJpc29uLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbE1lc3NhZ2UgPSBTZWxlY3Rvck1lc3NhZ2UgfCBGZWVkYmFja01lc3NhZ2UgfCBQYWdlTWVzc2FnZTtcblxuLy8gLS0tLS0tLS0tLSBJUEMgcGF5bG9hZHMgKENTIOKGlCBQYW5lbCDihpQgQmFja2dyb3VuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIENzVG9QYW5lbCA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlJzsgZW50cnk6IEVudHJ5OyBwYWdlOiBQYWdlQ29udGV4dDsgZ3JvdXBlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdob3Zlcic7IHNlbGVjdG9yOiBzdHJpbmc7IHRhZzogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByZWN0OiBSZWN0fVxuICB8IHtraW5kOiAnaG92ZXItZW5kJ31cbiAgLy8gUGFnZSByZXBvcnRzIGl0cyBzdGlja3kgcGluY2gtbW9kZSBzdGF0ZSAoZS5nLiB0aGUgdXNlciBwcmVzc2VkIEVzYyBvblxuICAvLyB0aGUgcGFnZSB0byBleGl0KSBzbyB0aGUgcGFuZWwgdG9nZ2xlIHN0YXlzIGluIHN5bmMuXG4gIHwge2tpbmQ6ICdzZWxlY3QtbW9kZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fVxuICAvLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIG1ldGFkYXRhIGZvciBvbmUgZGlzdGluY3QgcGFnZSAoVVJMKS4gRW1pdHRlZCBhdFxuICAvLyBtb3N0IG9uY2UgcGVyIFVSTCAodGhlIGNvbnRlbnQgc2NyaXB0IGRlZHVwZXMpLiBUaGUgcGFuZWwgY2FuIHN0YXNoIHRoZXNlXG4gIC8vIGFzIHBhZ2UtbGV2ZWwgY29udGV4dCAvIGV4cG9ydCB0aGVtIGFsb25nc2lkZSBlbGVtZW50IHNob3RzLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdCc7IHBheWxvYWQ6IFBhZ2VTbmFwc2hvdH07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9DcyA9XG4gIHwge2tpbmQ6ICdvdXRsaW5lJzsgc2VsZWN0b3I6IHN0cmluZzsgZ29sZD86IGJvb2xlYW47IGRhc2hlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ31cbiAgLy8gU3RpY2t5IFwicGluY2ggbW9kZVwiOiB3aGlsZSBvbiwgcGxhaW4gaG92ZXIvY2xpY2sgY2FwdHVyZXMgd2l0aG91dCB0aGVcbiAgLy8gQWx0IG1vZGlmaWVyLCBhbmQgdGhlIHBhZ2Ugc2hvd3MgYSBtb2RlIGluZGljYXRvci4gRXNjIGV4aXRzLlxuICB8IHtraW5kOiAnc2VsZWN0LW1vZGUnOyBvbjogYm9vbGVhbn1cbiAgLy8gRXhwb3J0LXRpbWUgcmVxdWVzdCBmb3IgdGhlIGZ1bGwgc2VyaWFsaXplZCBwYWdlIChvcHQtaW4gcHJlZlxuICAvLyBpbmNsdWRlUGFnZUhUTUwpLiBSZXBsaWVkIHdpdGgge29rLCB1cmwsIHRpdGxlLCBodG1sfTsgbmV2ZXIgcGVyc2lzdGVkXG4gIC8vIHRvIGNocm9tZS5zdG9yYWdlIOKAlCB0aGUgcGF5bG9hZCBnb2VzIHN0cmFpZ2h0IGludG8gdGhlIHRhci5cbiAgfCB7a2luZDogJ3BhZ2UtaHRtbCd9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBGdWxsLXBhZ2UgKGJlc3QtZWZmb3J0KSBzY3JlZW5zaG90IGZvciB0aGUgcGFnZS1zbmFwc2hvdCBmZWF0dXJlLiBVbmxpa2VcbiAgLy8gc2hvdC1wYWdlIHRoaXMgZG9lcyBOT1Qgd3JpdGUgYSBmaWxlIG9yIGJ1aWxkIGEgdGh1bWJuYWlsIOKAlCBpdCBqdXN0XG4gIC8vIHJldHVybnMgdGhlIHN0aXRjaGVkIFBORyBhcyBhIGRhdGEgVVJMIHNvIHRoZSBjYWxsZXIgKGNvbnRlbnQgc2NyaXB0KSBjYW5cbiAgLy8gYXR0YWNoIGl0IHRvIGEgUGFnZVNuYXBzaG90LiBgcGFydGlhbGAgaXMgdHJ1ZSB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0XG4gIC8vIGNvdWxkIGJlIGNhcHR1cmVkLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdC1zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIFNpZGUgcGFuZWwgYXNrcyB0aGUgYmFja2dyb3VuZCB0byB3cml0ZSBhIFVURi04IHN0cmluZyAoSlNPTkwsIE1hcmtkb3duLFxuICAvLyBSRUFETUUpIHRvIGRpc2suIGBzdWJkaXJgIGlzIHJlbGF0aXZlIHRvIC5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIOKAlCB3ZVxuICAvLyBkZWZhdWx0IHRvICdleHBvcnRzJyBzbyBKU09OTC9NRCBsaXZlIHNlcGFyYXRlIGZyb20gc2NyZWVuc2hvdHMuXG4gIHwge2tpbmQ6ICdzYXZlLXRleHQnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBtaW1lOiBzdHJpbmc7IHN1YmRpcj86IHN0cmluZ31cbiAgLy8gU2FtZSBhcyBzYXZlLXRleHQgYnV0IGZvciBiaW5hcnkgYmxvYnMgKHdvcmtzcGFjZSBaSVApLiBjaHJvbWUucnVudGltZVxuICAvLyAuc2VuZE1lc3NhZ2UgdXNlcyBzdHJ1Y3R1cmVkIGNsb25pbmcsIHdoaWNoIHByZXNlcnZlcyBVaW50OEFycmF5LCBzbyB3ZVxuICAvLyBwYXNzIHRoZSB0eXBlZCBhcnJheSBkaXJlY3RseS4gbnVtYmVyW10gaXMgYWNjZXB0ZWQgYXMgYSBmYWxsYmFjayBmb3JcbiAgLy8gb2xkZXIgY2FsbGVycyBhbmQgdGVzdHMgdGhhdCBwcmUtc2VyaWFsaXplLlxuICB8IHtraW5kOiAnc2F2ZS1ieXRlcyc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyBieXRlczogVWludDhBcnJheSB8IG51bWJlcltdOyBtaW1lOiBzdHJpbmc7IHN1YmRpcj86IHN0cmluZ31cbiAgLy8gUGFuZWwgYXNrcyB0aGUgYmFja2dyb3VuZCB0byAocmUpaW5qZWN0IHRoZSBjb250ZW50IHNjcmlwdCDigJQgdGhlIGZpeFxuICAvLyBmb3IgXCJBbHQgc3RvcHBlZCB3b3JraW5nXCIgYWZ0ZXIgYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gY29udGVudCBzY3JpcHQuIERlZmF1bHRzIHRvIHRoZSBhY3RpdmUgdGFiLlxuICB8IHtraW5kOiAncGctcmVpbmplY3QnOyB0YWJJZD86IG51bWJlcn07XG5cbmV4cG9ydCB0eXBlIFNob3RSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAgICAgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKGUuZy4gZGVmYXVsdC9zY3JlZW5zaG90cy9mb28ucG5nKVxuICBhYnNQYXRoPzogc3RyaW5nOyAgICAgIC8vIE9TLWFic29sdXRlIHBhdGggZm9yIFwiQ29weSBhcyBwYXRoXCJcbiAgY29weVBhdGg/OiBzdHJpbmc7ICAgICAvLyBVSS1mYWNpbmcgcGF0aDsgYXZvaWRzIFBsYXl3cmlnaHQgdGVtcCBhcnRpZmFjdCBuYW1lc1xuICB0ZW1wUGF0aD86IGJvb2xlYW47ICAgIC8vIHRydWUgd2hlbiBhYnNQYXRoIGlzIGEgYnJvd3Nlci90ZXN0LWhhcm5lc3MgYXJ0aWZhY3QgcGF0aFxuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBkYXRhVXJsPzogc3RyaW5nOyAgICAgIC8vIGRvd25zY2FsZWQgdGh1bWJuYWlsICjiiaQzMjBweCB3aWRlKSBmb3IgdGhlIHNpZGUtcGFuZWwgcHJldmlld1xuICBmdWxsRGF0YVVybD86IHN0cmluZzsgIC8vIGZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCDigJQgdXNlZCBieSB0aGUgd29ya3NwYWNlIGFyY2hpdmUgZXhwb3J0XG4gIGVycm9yPzogc3RyaW5nO1xuICB0cnVuY2F0ZWQ/OiBib29sZWFuO1xuICAvLyBDcm9wIG1ldGFkYXRhLiBMZXRzIHJlY2VpdmVycyBtYXAgYmV0d2VlbiB0aGUgc3RvcmVkIFBORyBhbmRcbiAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlcyBzbyB0aGV5IGNhblxuICAvLyBkcmF3IHRoZWlyIG93biBvdmVybGF5IG9yIHJlcHJvZHVjZSB0aGUgY3JvcCBvbiBhIGZyZXNoIGNhcHR1cmUuXG4gIGNyb3A/OiB7XG4gICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgZGV2aWNlUHhSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgZHByOiBudW1iZXI7XG4gICAgcGFkZGluZzogbnVtYmVyO1xuICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gIH07XG59O1xuXG4vLyBSZXBseSB0byBhIGBwYWdlLXNuYXBzaG90LXNob3RgIHJlcXVlc3QuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTCBvZlxuLy8gdGhlIChiZXN0LWVmZm9ydCkgZnVsbCBwYWdlOyBgcGFydGlhbGAgaXMgdHJ1ZSB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IHdhc1xuLy8gY2FwdHVyZWQuIGBvazpmYWxzZWAgY2FycmllcyBhbiBlcnJvciBzdHJpbmcuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3RSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIHNjcmVlbnNob3Q/OiBzdHJpbmc7XG4gIHBhcnRpYWw/OiBib29sZWFuO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFNhdmVSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aFxuICBhYnNQYXRoPzogc3RyaW5nOyAgLy8gT1MtYWJzb2x1dGUgcGF0aFxuICBjb3B5UGF0aD86IHN0cmluZzsgLy8gVUktZmFjaW5nIHBhdGhcbiAgdGVtcFBhdGg/OiBib29sZWFuO1xuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEJnUmVwbHkgPVxuICB8IHtkYXRhVXJsOiBzdHJpbmd9XG4gIHwge2ZvdW5kOiBib29sZWFuOyBvcGVuZWQ/OiBudW1iZXJ9XG4gIHwge3RhYnM6IEFycmF5PHtpZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ30+fVxuICB8IHtlcnJvcjogc3RyaW5nfVxuICB8IFNob3RSZXBseVxuICB8IFNhdmVSZXBseVxuICB8IFBhZ2VTbmFwc2hvdFJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICAvLyBDb250ZW50LWRlcml2ZWQgaWRlbnRpdHk6IGZpcnN0IDE2IGhleCBjaGFycyBvZiBhIFNIQS0yNTYgb3ZlciB0aGVcbiAgLy8gc2xpbSByb3dzICsgc2NyZWVuc2hvdCBuYW1lcy4gU3RhYmxlIGFjcm9zcyByZS1leHBvcnRzIG9mIHRoZSBzYW1lXG4gIC8vIGNvbnRlbnQsIHNvIGRvd25zdHJlYW0gc3RhdGUgKGUuZy4gfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvKi9idW5kbGVzLylcbiAgLy8ga2V5cyBvbiBpdCB3aXRob3V0IGR1cGxpY2F0aW5nIHdvcmsuXG4gIGJ1bmRsZUlkPzogc3RyaW5nO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgICAvLyBGdWxsLXBhZ2UgSFRNTCBkb2N1bWVudHMgYnVuZGxlZCB1bmRlciBwYWdlcy8gKG9wdC1pbiBwcmVmKS5cbiAgICBwYWdlc0h0bWw/OiBudW1iZXI7XG4gIH07XG4gIC8vIFJlc29sdXRpb24gcm9vdCBmb3IgZXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkwgc3RyZWFtLlxuICAvLyAgIOKAoiAnYXJjaGl2ZScgICDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBleHRyYWN0ZWQgYXJjaGl2ZSByb290XG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciB0YXIuenN0IGV4cG9ydHMpLlxuICAvLyAgIOKAoiAnd29ya3NwYWNlJyDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB3b3Jrc3BhY2UgZGlyIG9uIGRpc2ssXG4gIC8vICAgICAgICAgICAgICAgICAgIGkuZS4gYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2BcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHBsYWluIEpTT05MIGV4cG9ydHMpLlxuICAvLyBSZWNlaXZlcnMgcHJlcGVuZCB0aGUgYXBwcm9wcmlhdGUgcm9vdCB0byByZXNvbHZlIGFueSBwYXRoIGZpZWxkLlxuICBwYXRoUm9vdD86ICdhcmNoaXZlJyB8ICd3b3Jrc3BhY2UnO1xuICAvLyBJbmRpcmVjdGlvbiBwb2ludGVyIHRvIHRoZSBVSSBza2lsbCB0aGF0IGtub3dzIGhvdyB0byB0cmlhZ2UgdGhlc2VcbiAgLy8gY2FwdHVyZXMuIFdoZW4gYGlubGluZTogdHJ1ZWAsIHRoZSBza2lsbCBjb250ZW50IGxpdmVzIGF0XG4gIC8vIGBhcmNoaXZlUGF0aGAgaW5zaWRlIHRoZSB0YXIgKGRlZmF1bHQ6IGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgKS5cbiAgLy9cbiAgLy8gYGN1c3RvbWl6ZWRgIGFuZCBgdGVtcGxhdGVgIGFyZSBtdXR1YWxseS1leGNsdXNpdmUgY29uZmlkZW5jZSBmbGFnczpcbiAgLy8gICDigKIgY3VzdG9taXplZDogdHJ1ZSDihpIgdXNlciB1cGxvYWRlZCAvIHBhc3RlZCB0aGVpciBvd24gY29udGVudC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IHRoZSBmaWxlIGFzIGF1dGhvcml0YXRpdmUuXG4gIC8vICAg4oCiIHRlbXBsYXRlOiB0cnVlICAg4oaSIHVzZXIgaXMgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgZGVmYXVsdC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IGFzIGdlbmVyaWMgYm9pbGVycGxhdGU7IHZlcmlmeSBiZWZvcmVcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIGFwcGx5aW5nLlxuICAvLyAoVGhlIHByZXZpb3VzIGB0ZW1wbGF0ZWAgZmxhZyBhbG9uZSB3YXMgYW1iaWd1b3VzIGJlY2F1c2UgdGhlXG4gIC8vIGJ1bmRsZWQgbG9jYWwgdGVtcGxhdGUgc3RpbGwgbG9va3MgcHJvamVjdC1zcGVjaWZpYy4pXG4gIHNraWxsPzoge25hbWU6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFBvaW50ZXIgdG8gdGhlIHByb2plY3QncyBERVNJR04ubWQuIFNhbWUgcnVsZXM6IGBjdXN0b21pemVkOiB0cnVlYFxuICAvLyBtZWFucyB0aGUgdXNlciBzdXBwbGllZCB0aGlzIGNvbnRlbnQ7IGB0ZW1wbGF0ZTogdHJ1ZWAgbWVhbnMgaXQnc1xuICAvLyBQaW5jaEdyYWIncyBidW5kbGVkIGRlZmF1bHQuXG4gIGRlc2lnbj86IHtwYXRoPzogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFdoZXJlIHRoZSBhZ2VudCBkb2N0cmluZSBsaXZlcyBpbnNpZGUgdGhlIGFyY2hpdmUgKFNlbmQtdG8tQWdlbnRcbiAgLy8gcHJvdG9jb2wpLiBBYnNlbnQgb24gcGxhaW4gSlNPTkwgZXhwb3J0cy5cbiAgYWdlbnRQcm90b2NvbD86IHthcmNoaXZlUGF0aDogc3RyaW5nfTtcbiAgLy8gQnVuZGxlIHRva2VuIGJ1ZGdldDogYHNpZ25hbCpgIGlzIHRoZSB1cC1mcm9udCByZWFkIChBR0VOVC1QUk9UT0NPTCxcbiAgLy8gUkVBRE1FLCByZXBhaXItaW5kZXgsIHRoZSBKU09OTCwgREVTSUdOLCB0aGUgdHdvIFNLSUxMcywgc2tpbGxzLWluZGV4KTtcbiAgLy8gYHRvdGFsKmAgaXMgdGhlIHdob2xlIGFyY2hpdmUuIFRoZSBsYXp5IHJlbWFpbmRlciBpcyBlbnVtZXJhdGVkIGluIHRoZVxuICAvLyBidW5kbGUgZmlsZSBuYW1lZCBieSBgaWdub3JlYC4gRXN0aW1hdG9yIGhldXJpc3RpYzogYnl0ZXMgLyA0LlxuICB0b2tlbnM/OiB7c2lnbmFsQnl0ZXM6IG51bWJlcjsgdG90YWxCeXRlczogbnVtYmVyOyBzaWduYWxUb2tlbnM6IG51bWJlcjsgdG90YWxUb2tlbnM6IG51bWJlcjsgaWdub3JlOiBzdHJpbmd9O1xuICAvLyBWZW5kb3JlZCBza2lsbCBkb2N1bWVudHMgYnVuZGxlZCBpbnRvIHRoaXMgYXJjaGl2ZSAoc3Vic2V0IG9mIHRoZVxuICAvLyByaWNoZXIgc2tpbGxzLWluZGV4Lmpzb24gYXQgdGhlIGFyY2hpdmUgcm9vdCkuIGBpbnZvY2F0aW9uYCBjYXJyaWVzIGFcbiAgLy8gcGx1Z2luLWNvbW1hbmQgZm9ybSBmb3IgaGFybmVzc2VzIHRoYXQgc3VwcG9ydCBpdC5cbiAgYnVuZGxlZFNraWxscz86IEFycmF5PHtpZDogc3RyaW5nOyBraW5kOiAnc2tpbGwnIHwgJ3JlZmVyZW5jZSc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGludm9jYXRpb24/OiBzdHJpbmd9PjtcbiAgLy8gRnVsbC1wYWdlIEhUTUwgZG9jdW1lbnRzIGJ1bmRsZWQgdW5kZXIgcGFnZXMvIChvcHQtaW4gcHJlZikuXG4gIHBhZ2VzSHRtbD86IEFycmF5PHt1cmw6IHN0cmluZzsgYXJjaGl2ZVBhdGg6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn0+O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBTdWJzZXQgb2YgbHVjaWRlLmRldiBpY29ucyBpbmxpbmVkIGFzIFNWRyBpbm5lci1tYXJrdXAuXG4vLyBFYWNoIGVudHJ5IGlzIHRoZSBib2R5IG9mIDxzdmcgLi4uID4gLi4uIDwvc3ZnPjsgc3ZnU3RyaW5nKCkgd3JhcHMgaXQuXG4vLyBTaXplcyBkZWZhdWx0IHRvIDE2OyBvdmVycmlkZSB3aXRoIHRoZSBzaXplIGFyZ3VtZW50LlxuLy9cbi8vIE1JVCDigJQgaHR0cHM6Ly9naXRodWIuY29tL2x1Y2lkZS1pY29ucy9sdWNpZGVcblxuY29uc3QgSUNPTlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjaGV2cm9uLXJpZ2h0JzogJzxwYXRoIGQ9XCJtOSAxOCA2LTYtNi02XCIvPicsXG4gICdjaGV2cm9uLWRvd24nOiAnPHBhdGggZD1cIm02IDkgNiA2IDYtNlwiLz4nLFxuICBjb3B5OiAnPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgeD1cIjhcIiB5PVwiOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTQgMTZjLTEuMSAwLTItLjktMi0yVjRjMC0xLjEuOS0yIDItMmgxMGMxLjEgMCAyIC45IDIgMlwiLz4nLFxuICBwZW5jaWw6ICc8cGF0aCBkPVwiTTIxLjE3NCA2LjgxMmExIDEgMCAwIDAtMy45ODYtMy45ODdMMy44NDIgMTYuMTc0YTIgMiAwIDAgMC0uNS44M2wtMS4zMjEgNC4zNTJhLjUuNSAwIDAgMCAuNjIzLjYyMmw0LjM1My0xLjMyYTIgMiAwIDAgMCAuODMtLjQ5N3pcIi8+PHBhdGggZD1cIm0xNSA1IDQgNFwiLz4nLFxuICAndHJhc2gtMic6ICc8cGF0aCBkPVwiTTMgNmgxOFwiLz48cGF0aCBkPVwiTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNlwiLz48cGF0aCBkPVwiTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeDI9XCIxMFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB4Mj1cIjE0XCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+JyxcbiAgcGx1czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz48cGF0aCBkPVwiTTEyIDV2MTRcIi8+JyxcbiAgeDogJzxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPicsXG4gIG1pbnVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPicsXG4gIHNlYXJjaDogJzxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiLz48cGF0aCBkPVwibTIxIDIxLTQuMy00LjNcIi8+JyxcbiAgZG93bmxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjcgMTAgMTIgMTUgMTcgMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjE1XCIgeTI9XCIzXCIvPicsXG4gIHVwbG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTcgOCAxMiAzIDcgOFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiM1wiIHkyPVwiMTVcIi8+JyxcbiAgZ2l0aHViOiAnPHBhdGggZD1cIk0xNSAyMnYtNGE0LjggNC44IDAgMCAwLTEtMy41YzMgMCA2LTIgNi01LjUuMDgtMS4yNS0uMjctMi40OC0xLTMuNS4yOC0xLjE1LjI4LTIuMzUgMC0zLjUgMCAwLTEgMC0zIDEuNS0yLjY0LS41LTUuMzYtLjUtOCAwQzYgMiA1IDIgNSAyYy0uMyAxLjE1LS4zIDIuMzUgMCAzLjVBNS40IDUuNCAwIDAgMCA0IDljMCAzLjUgMyA1LjUgNiA1LjUtLjM5LjQ5LS42OCAxLjA1LS44NSAxLjY1LS4xNy42LS4yMiAxLjIzLS4xNSAxLjg1djRcIi8+PHBhdGggZD1cIk05IDE4Yy00LjUxIDItNS0yLTctMlwiLz4nLFxuICBzdGFyOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiLz4nLFxuICAnY2lyY2xlLWRvdCc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgY3Jvc3NoYWlyOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjIyXCIgeDI9XCIxOFwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiNlwiIHgyPVwiMlwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI2XCIgeTI9XCIyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIyMlwiIHkyPVwiMThcIi8+JyxcbiAgdGFyZ2V0OiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjZcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIyXCIvPicsXG4gICdwYW5lbC1sZWZ0LWNsb3NlJzogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIi8+PHBhdGggZD1cIk05IDN2MThcIi8+PHBhdGggZD1cIm0xNiAxNS0zLTMgMy0zXCIvPicsXG4gICdleHRlcm5hbC1saW5rJzogJzxwYXRoIGQ9XCJNMTUgM2g2djZcIi8+PHBhdGggZD1cIk0xMCAxNCAyMSAzXCIvPjxwYXRoIGQ9XCJNMTggMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNlwiLz4nLFxuICAnbWVzc2FnZS1zcXVhcmUtcGx1cyc6ICc8cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48bGluZSB4MT1cIjlcIiB4Mj1cIjE1XCIgeTE9XCIxMFwiIHkyPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjdcIiB5Mj1cIjEzXCIvPicsXG4gICdhbGVydC1jaXJjbGUnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiOFwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTIuMDFcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICAncmVmcmVzaC1jdyc6ICc8cGF0aCBkPVwiTTMgMTJhOSA5IDAgMCAxIDE1LTYuN0wyMSA4XCIvPjxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPjxwYXRoIGQ9XCJNMjEgMTJhOSA5IDAgMCAxLTE1IDYuN0wzIDE2XCIvPjxwYXRoIGQ9XCJNMyAyMXYtNWg1XCIvPicsXG4gICdmaWxlLXRleHQnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxM1wiIHkyPVwiMTNcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTdcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjhcIiB5MT1cIjlcIiB5Mj1cIjlcIi8+JyxcbiAgJ2ZpbGUtY29kZSc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxwYXRoIGQ9XCJtMTAgMTMtMiAyIDIgMlwiLz48cGF0aCBkPVwibTE0IDE3IDItMi0yLTJcIi8+JyxcbiAgaW1hZ2U6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCI5XCIgcj1cIjJcIi8+PHBhdGggZD1cIm0yMSAxNS0zLjA4Ni0zLjA4NmEyIDIgMCAwIDAtMi44MjggMEw2IDIxXCIvPicsXG4gIC8vIFN0eWxpc2VkIFwicGluY2hcIiDigJQgdHdvIG9wcG9zaW5nIGN1cnZlcyBtZWV0aW5nIGF0IGEgY2VudGVyIGRvdC5cbiAgcGluY2g6ICc8cGF0aCBkPVwiTTUgNWMzIDIgNSA0IDcgNy0yIDMtNCA1LTcgN1wiLz48cGF0aCBkPVwiTTE5IDVjLTMgMi01IDQtNyA3IDIgMyA0IDUgNyA3XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMS41XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICAnc3Rhci1maWxsZWQnOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgcGluOiAnPHBhdGggZD1cIk0xMiAxN3Y1XCIvPjxwYXRoIGQ9XCJNOSAxMC43NmEyIDIgMCAwIDEtMS4xMSAxLjc5bC0xLjc4LjlBMiAyIDAgMCAwIDUgMTUuMjRWMTZhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xdi0uNzZhMiAyIDAgMCAwLTEuMTEtMS43OWwtMS43OC0uOUEyIDIgMCAwIDEgMTUgMTAuNzZWN2ExIDEgMCAwIDEgMS0xIDIgMiAwIDAgMCAwLTRIOGEyIDIgMCAwIDAgMCA0IDEgMSAwIDAgMSAxIDF6XCIvPicsXG4gIHVuZG86ICc8cGF0aCBkPVwiTTMgN3Y2aDZcIi8+PHBhdGggZD1cIk0yMSAxN2E5IDkgMCAwIDAtMTUtNi43TDMgMTNcIi8+JyxcbiAgcmVkbzogJzxwYXRoIGQ9XCJNMjEgN3Y2aC02XCIvPjxwYXRoIGQ9XCJNMyAxN2E5IDkgMCAwIDEgMTUtNi43TDIxIDEzXCIvPicsXG4gIGZvbGRlcjogJzxwYXRoIGQ9XCJNMjAgMjBhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJoLTcuOTNhMiAyIDAgMCAxLTEuNjYtLjlsLS44Mi0xLjJBMiAyIDAgMCAwIDcuOTMgM0g0YTIgMiAwIDAgMC0yIDJ2MTNhMiAyIDAgMCAwIDIgMlpcIi8+JyxcbiAgY2hlY2s6ICc8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIi8+JyxcbiAgJ2NpcmNsZS1jaGVjayc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtOSAxMiAyIDIgNC00XCIvPicsXG4gIGdyaXA6ICc8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTlcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjE5XCIgcj1cIjFcIi8+JyxcbiAgLy8gQnJva2VuLWNoYWluIGljb24gZm9yIFwiZGV0YWNoIGNvbW1lbnQgZnJvbSBpdHMgY2FwdHVyZVwiLiBMdWNpZGUncyBgdW5saW5rYC5cbiAgdW5saW5rOiAnPHBhdGggZD1cIm0xOC44NCAxMi4yNSAxLjcyLTEuNzFoLS4wMmE1LjAwNCA1LjAwNCAwIDAgMC0uMTItNy4wNyA1LjAwNiA1LjAwNiAwIDAgMC02Ljk1IDBsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwibTUuMTcgMTEuNzUtMS43MSAxLjcxYTUuMDA0IDUuMDA0IDAgMCAwIC4xMiA3LjA3IDUuMDA2IDUuMDA2IDAgMCAwIDYuOTUgMGwxLjcxLTEuNzFcIi8+PGxpbmUgeDE9XCI4XCIgeDI9XCI4XCIgeTE9XCIyXCIgeTI9XCI1XCIvPjxsaW5lIHgxPVwiMlwiIHgyPVwiNVwiIHkxPVwiOFwiIHkyPVwiOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCIxNlwiIHkxPVwiMTlcIiB5Mj1cIjIyXCIvPjxsaW5lIHgxPVwiMTlcIiB4Mj1cIjIyXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgc2V0dGluZ3M6ICc8cGF0aCBkPVwiTTEyLjIyIDJoLS40NGEyIDIgMCAwIDAtMiAydi4xOGEyIDIgMCAwIDEtMSAxLjczbC0uNDMuMjVhMiAyIDAgMCAxLTIgMGwtLjE1LS4wOGEyIDIgMCAwIDAtMi43My43M2wtLjIyLjM4YTIgMiAwIDAgMCAuNzMgMi43M2wuMTUuMWEyIDIgMCAwIDEgMSAxLjcydi41MWEyIDIgMCAwIDEtMSAxLjc0bC0uMTUuMDlhMiAyIDAgMCAwLS43MyAyLjczbC4yMi4zOGEyIDIgMCAwIDAgMi43My43M2wuMTUtLjA4YTIgMiAwIDAgMSAyIDBsLjQzLjI1YTIgMiAwIDAgMSAxIDEuNzNWMjBhMiAyIDAgMCAwIDIgMmguNDRhMiAyIDAgMCAwIDItMnYtLjE4YTIgMiAwIDAgMSAxLTEuNzNsLjQzLS4yNWEyIDIgMCAwIDEgMiAwbC4xNS4wOGEyIDIgMCAwIDAgMi43My0uNzNsLjIyLS4zOWEyIDIgMCAwIDAtLjczLTIuNzNsLS4xNS0uMDhhMiAyIDAgMCAxLTEtMS43NHYtLjVhMiAyIDAgMCAxIDEtMS43NGwuMTUtLjA5YTIgMiAwIDAgMCAuNzMtMi43M2wtLjIyLS4zOGEyIDIgMCAwIDAtMi43My0uNzNsLS4xNS4wOGEyIDIgMCAwIDEtMiAwbC0uNDMtLjI1YTIgMiAwIDAgMS0xLTEuNzNWNGEyIDIgMCAwIDAtMi0yelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+JyxcbiAgaW5mbzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xMiAxNnYtNFwiLz48cGF0aCBkPVwiTTEyIDhoLjAxXCIvPicsXG4gIC8vIFRyZWUtb2Ytcm93cyDigJQgdXNlZCBmb3IgXCJTcGxpdCBncm91cFwiIGFjdGlvbiAoZGVub3RlcyBvbmUgbm9kZSBmYW5uaW5nXG4gIC8vIG91dCBpbnRvIHNpYmxpbmdzKS4gTHVjaWRlJ3MgYGxpc3QtdHJlZWAuXG4gICdsaXN0LXRyZWUnOiAnPHBhdGggZD1cIk0yMSAxMmgtOFwiLz48cGF0aCBkPVwiTTIxIDZIOFwiLz48cGF0aCBkPVwiTTIxIDE4aC04XCIvPjxwYXRoIGQ9XCJNMyA2djRjMCAxLjEuOSAyIDIgMmgzXCIvPjxwYXRoIGQ9XCJNMyAxMHY2YzAgMS4xLjkgMiAyIDJoM1wiLz4nLFxuICAvLyBHZW5lcmljIHNwbGl0IGljb24gYXMgYSBmYWxsYmFjayBvcHRpb24uXG4gIHNwbGl0OiAnPHBhdGggZD1cIk0xNiAzaDV2NVwiLz48cGF0aCBkPVwiTTggM0gzdjVcIi8+PHBhdGggZD1cIm0yMSAzLTcuNDYgNy40NmEyIDIgMCAwIDAgMCAyLjgzTDIxIDIxXCIvPjxwYXRoIGQ9XCJNMyAzbDcuNDYgNy40NmEyIDIgMCAwIDEgMCAyLjgzTDMgMjFcIi8+JyxcbiAgLy8gQ2FyZGJvYXJkLXN0eWxlIGJveCB1c2VkIGZvciBcIkV4cG9ydCB3b3Jrc3BhY2UgYXMgWklQXCIuXG4gIHBhY2thZ2U6ICc8cGF0aCBkPVwibTcuNSA0LjI3IDkgNS4xNVwiLz48cGF0aCBkPVwiTTIxIDhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2WlwiLz48cGF0aCBkPVwiTTMuMyA3IDEyIDEybDguNy01XCIvPjxwYXRoIGQ9XCJNMTIgMjJWMTJcIi8+JyxcbiAgLy8gVHdvIGludGVybG9ja2luZyBsaW5rcyDigJQgdXNlZCBmb3IgXCJDb3B5IGFzIHBhdGhcIi5cbiAgbGluazogJzxwYXRoIGQ9XCJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwiTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxXCIvPicsXG4gIC8vIERhdGFiYXNlL2R1Y2sgaWNvbiBmb3IgdGhlIER1Y2tEQiBwYWxldHRlIGNvbW1hbmQuXG4gIGRhdGFiYXNlOiAnPGVsbGlwc2UgY3g9XCIxMlwiIGN5PVwiNVwiIHJ4PVwiOVwiIHJ5PVwiM1wiLz48cGF0aCBkPVwiTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNVwiLz48cGF0aCBkPVwiTTMgMTJBOSAzIDAgMCAwIDIxIDEyXCIvPicsXG59O1xuXG5jb25zdCB3cmFwID0gKGJvZHk6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPiR7Ym9keX08L3N2Zz5gO1xuXG5leHBvcnQgY29uc3QgUEdfSUNPTlMgPSB7XG4gIGhhczogKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4gbmFtZSBpbiBJQ09OUyxcbiAgc3ZnU3RyaW5nOiAobmFtZTogc3RyaW5nLCBzaXplID0gMTYpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBJQ09OU1tuYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2x1Y2lkZV0gbWlzc2luZyBpY29uJywgbmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiB3cmFwKGJvZHksIHNpemUpO1xuICB9LFxuICBtb3VudDogKGVsOiBFbGVtZW50IHwgbnVsbCwgbmFtZTogc3RyaW5nLCBzaXplPzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKGVsKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gIH0sXG59O1xuXG4vLyBTaWRlLWVmZmVjdCBmb3IgbGVnYWN5IHNjcmlwdC10YWcgaW5jbHVzaW9uIChzaWRlcGFuZWwuaHRtbCBzdGlsbCA8c2NyaXB0XG4vLyBzcmM9XCJsdWNpZGUuanNcIj4g4oCUIHByZS1idW5kbGUpLiBSZS1leHBvc2VzIHRoZSByZWdpc3RyeSBvbiBnbG9iYWxUaGlzLlxuaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBHX0lDT05TID0gUEdfSUNPTlM7XG59XG4iLAogICAgIi8vIFVTVEFSLWZvcm1hdCB0YXIgZW5jb2Rlci4gRWFjaCBlbnRyeSBpcyBhIDUxMi1ieXRlIGhlYWRlciBmb2xsb3dlZCBieVxuLy8gY29udGVudCBieXRlcyBwYWRkZWQgdXAgdG8gdGhlIG5leHQgNTEyLWJ5dGUgYm91bmRhcnkuIFRoZSBhcmNoaXZlIGVuZHNcbi8vIHdpdGggdHdvIHplcm8tZmlsbGVkIDUxMi1ieXRlIGJsb2Nrcy4gfjgwIGxpbmVzLCBubyBkZXBlbmRlbmNpZXMuXG4vL1xuLy8gV2UgcGljayB0YXIgKHJhdGhlciB0aGFuIHppcCkgYmVjYXVzZSB6c3RkIGlzIHRoZSB3aXJlIGZvcm1hdCB3ZSB3YW50IHRvXG4vLyBwYWlyIGl0IHdpdGggYW5kIHRhci56c3QgaXMgdGhlIHN0YW5kYXJkIGNvbWJvICh6aXAgaXMgaXRzIG93blxuLy8gY29tcHJlc3Npb24gY29udGFpbmVyKS4gUGF0aHMgbG9uZ2VyIHRoYW4gMTAwIGNoYXJzIHVzZSB0aGUgc3RhbmRhcmRcbi8vIHVzdGFyIHByZWZpeCBmaWVsZCAoMTU1IGJ5dGVzIGF0IG9mZnNldCAzNDUpOiB0aGUgcGF0aCBpcyBzcGxpdCBhdCBhXG4vLyBzbGFzaCBpbnRvIHByZWZpeCjiiaQxNTUpL25hbWUo4omkMTAwKS4gT25seSB1bnNwbGl0dGFibGUgcGF0aHMgdGhyb3cg4oCUXG4vLyBHTlUvUEFYIGxvbmctbmFtZSBleHRlbnNpb25zIGFyZSBkZWxpYmVyYXRlbHkgbm90IGltcGxlbWVudGVkLlxuXG5jb25zdCBlbmMgPSBuZXcgVGV4dEVuY29kZXIoKTtcblxuY29uc3Qgd3JpdGVPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAvLyB0YXIgZmllbGRzIGFyZSB6ZXJvLXBhZGRlZCBudWxsLXRlcm1pbmF0ZWQgb2N0YWwgc3RyaW5ncy5cbiAgbGV0IHMgPSB2YWx1ZS50b1N0cmluZyg4KTtcbiAgcyA9IHMucGFkU3RhcnQobGVuZ3RoIC0gMSwgJzAnKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggLSAxOyBpKyspIGJ1ZltvZmZzZXQgKyBpXSA9IHMuY2hhckNvZGVBdChpKTtcbiAgYnVmW29mZnNldCArIGxlbmd0aCAtIDFdID0gMDtcbn07XG5cbmNvbnN0IHdyaXRlQXNjaWkgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgc3RyOiBzdHJpbmcsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIGNvbnN0IGJ5dGVzID0gZW5jLmVuY29kZShzdHIpO1xuICBjb25zdCBsZW4gPSBNYXRoLm1pbihieXRlcy5sZW5ndGgsIGxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVzW2ldITtcbn07XG5cbmNvbnN0IGhlYWRlckNoZWNrc3VtID0gKGhlYWRlcjogVWludDhBcnJheSk6IG51bWJlciA9PiB7XG4gIC8vIFRoZSBjaGVja3N1bSBmaWVsZCAoOCBieXRlcyBhdCBvZmZzZXQgMTQ4KSBpcyB0cmVhdGVkIGFzIEFTQ0lJIHNwYWNlc1xuICAvLyBkdXJpbmcgY29tcHV0YXRpb24sIHRoZW4gdGhlIGFjdHVhbCBjaGVja3N1bSBpcyB3cml0dGVuIGludG8gaXQuXG4gIGxldCBzdW0gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7XG4gICAgaWYgKGkgPj0gMTQ4ICYmIGkgPCAxNTYpIHN1bSArPSAweDIwO1xuICAgIGVsc2Ugc3VtICs9IGhlYWRlcltpXSA/PyAwO1xuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG5leHBvcnQgdHlwZSBUYXJFbnRyeSA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICBkYXRhOiBVaW50OEFycmF5IHwgc3RyaW5nO1xuICBtdGltZT86IG51bWJlcjsgLy8gdW5peCBlcG9jaCBzZWNvbmRzOyBkZWZhdWx0cyB0byBub3dcbn07XG5cbi8vIHVzdGFyIG5hbWUgc3BsaXQ6IHBhdGhzIOKJpDEwMCBjaGFycyBnbyBzdHJhaWdodCBpbnRvIHRoZSBuYW1lIGZpZWxkO1xuLy8gbG9uZ2VyIHBhdGhzIHNwbGl0IGF0IHRoZSByaWdodG1vc3Qgc2xhc2ggdGhhdCBsZWF2ZXMgcHJlZml4IOKJpDE1NSBhbmRcbi8vIHRhaWwg4omkMTAwLiBUaGUgcmVhZGVyIHJlYXNzZW1ibGVzIGBwcmVmaXggKyAnLycgKyBuYW1lYC5cbmNvbnN0IHNwbGl0VGFyTmFtZSA9IChmdWxsOiBzdHJpbmcpOiB7bmFtZTogc3RyaW5nOyBwcmVmaXg6IHN0cmluZ30gPT4ge1xuICBpZiAoZnVsbC5sZW5ndGggPD0gMTAwKSByZXR1cm4ge25hbWU6IGZ1bGwsIHByZWZpeDogJyd9O1xuICBsZXQgY3V0ID0gLTE7XG4gIGZvciAobGV0IGkgPSBmdWxsLmluZGV4T2YoJy8nKTsgaSAhPT0gLTE7IGkgPSBmdWxsLmluZGV4T2YoJy8nLCBpICsgMSkpIHtcbiAgICBpZiAoaSA8PSAxNTUgJiYgZnVsbC5sZW5ndGggLSBpIC0gMSA8PSAxMDApIGN1dCA9IGk7XG4gIH1cbiAgaWYgKGN1dCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHRhcjogcGF0aCBub3Qgc3BsaXR0YWJsZSBpbnRvIHVzdGFyIHByZWZpeCgxNTUpL25hbWUoMTAwKTogJHtmdWxsfWApO1xuICB9XG4gIHJldHVybiB7cHJlZml4OiBmdWxsLnNsaWNlKDAsIGN1dCksIG5hbWU6IGZ1bGwuc2xpY2UoY3V0ICsgMSl9O1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVGFyID0gKGVudHJpZXM6IFRhckVudHJ5W10pOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgY29uc3Qgbm93U2VjID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZW50cnkuZGF0YSA9PT0gJ3N0cmluZycgPyBlbmMuZW5jb2RlKGVudHJ5LmRhdGEpIDogZW50cnkuZGF0YTtcbiAgICBjb25zdCB7bmFtZSwgcHJlZml4fSA9IHNwbGl0VGFyTmFtZShlbnRyeS5uYW1lKTtcbiAgICBjb25zdCBoZWFkZXIgPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAwLCBuYW1lLCAxMDApO1xuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMDAsIDBvNjQ0LCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW9kZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMDgsIDAsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdWlkXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDExNiwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnaWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTI0LCBkYXRhLmxlbmd0aCwgMTIpOyAgICAgICAgICAgICAgICAgIC8vIHNpemVcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTM2LCBlbnRyeS5tdGltZSA/PyBub3dTZWMsIDEyKTsgICAgICAgIC8vIG10aW1lXG4gICAgZm9yIChsZXQgaSA9IDE0ODsgaSA8IDE1NjsgaSsrKSBoZWFkZXJbaV0gPSAweDIwOyAgICAgICAgICAvLyBjaGVja3N1bSBwbGFjZWhvbGRlclxuICAgIGhlYWRlclsxNTZdID0gMHgzMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHlwZWZsYWcgJzAnID0gcmVndWxhciBmaWxlXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI1NywgJ3VzdGFyJywgNik7ICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWdpY1xuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAyNjMsICcwMCcsIDIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmVyc2lvblxuICAgIGlmIChwcmVmaXgpIHdyaXRlQXNjaWkoaGVhZGVyLCAzNDUsIHByZWZpeCwgMTU1KTsgICAgICAgICAgLy8gdXN0YXIgcHJlZml4XG4gICAgLy8gdW5hbWUvZ25hbWUvZGV2bWFqb3IvZGV2bWlub3IgbGVmdCB6ZXJvLlxuXG4gICAgY29uc3QgY2hlY2tzdW0gPSBoZWFkZXJDaGVja3N1bShoZWFkZXIpO1xuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxNDgsIGNoZWNrc3VtLCA4KTtcblxuICAgIGJsb2Nrcy5wdXNoKGhlYWRlcik7XG4gICAgYmxvY2tzLnB1c2goZGF0YSk7XG4gICAgY29uc3QgcGFkID0gKDUxMiAtIChkYXRhLmxlbmd0aCAlIDUxMikpICUgNTEyO1xuICAgIGlmIChwYWQpIGJsb2Nrcy5wdXNoKG5ldyBVaW50OEFycmF5KHBhZCkpO1xuICB9XG4gIC8vIFRyYWlsZXI6IHR3byBjb25zZWN1dGl2ZSA1MTItYnl0ZSB6ZXJvIGJsb2Nrcy5cbiAgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkoMTAyNCkpO1xuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHRvdGFsICs9IGIubGVuZ3RoO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheSh0b3RhbCk7XG4gIGxldCBvZmZzZXQgPSAwO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2Zmc2V0KTsgb2Zmc2V0ICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgWnN0ZCByYXctYmxvY2sgZnJhbWUgd3JpdGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy9cbi8vIENvbXByZXNzaW9uU3RyZWFtKCd6c3RkJykgaXNuJ3Qgc2hpcHBlZCBpbiBjdXJyZW50IENocm9taXVtICh2ZXJpZmllZCB2aWFcbi8vIHJ1bnRpbWUgcHJvYmUpLCBzbyB3ZSB3cml0ZSBhIHZhbGlkIHpzdGQgZnJhbWUgY29udGFpbmluZyBvbmUgb3IgbW9yZVxuLy8gcmF3ICh1bmNvbXByZXNzZWQpIGJsb2Nrcy4gVGhlIG91dHB1dCBpcyBzdHJ1Y3R1cmFsbHkgYSByZWFsIGAudGFyLnpzdGBcbi8vIGZpbGU6IGB6c3RkIC1kYCBhY2NlcHRzIGl0LCA3LVppcCBhY2NlcHRzIGl0LCBsaWJ6c3RkIGFjY2VwdHMgaXQuIEl0XG4vLyBqdXN0IGRvZXNuJ3QgYWN0dWFsbHkgY29tcHJlc3Mg4oCUIGZvciBvdXIgcGF5bG9hZCwgd2hpY2ggaXMgbW9zdGx5IFBOR1xuLy8gKGFscmVhZHkgY29tcHJlc3NlZCkgcGx1cyBhIGZldyBLQiBvZiBKU09OTC9NYXJrZG93biwgdGhlIGxvc3MgdnMuIHJlYWxcbi8vIERFRkxBVEUgaXMgc2luZ2xlLWRpZ2l0IHBlcmNlbnQuXG4vL1xuLy8gRnJhbWUgbGF5b3V0IChwZXIgUkZDIDg4NzggKyBac3RhbmRhcmQgZm9ybWF0IHNwZWMpOlxuLy8gICBtYWdpY19udW1iZXIgICAgICAgNCBieXRlcyAgMHgyOCAweEI1IDB4MkYgMHhGRCAoTEU6IDB4RkQyRkI1MjgpXG4vLyAgIEZIRCAgICAgICAgICAgICAgICAxIGJ5dGUgICBGQ1Nfc2l6ZT0yICg0LWJ5dGUgRkNTKSwgU2luZ2xlX1NlZ21lbnQ9MVxuLy8gICBGQ1MgICAgICAgICAgICAgICAgNCBieXRlcyAgdW5jb21wcmVzc2VkIHBheWxvYWQgc2l6ZSAodTMyIExFKVxuLy8gICBibG9ja3MgICAgICAgICAgICAgTiBibG9ja3MgZWFjaDogMy1ieXRlIGhlYWRlciArIHBheWxvYWRcbi8vXG4vLyBCbG9jayBoZWFkZXIgKDMgYnl0ZXMgTEUpOlxuLy8gICBiaXQgMCAgICAgICBMYXN0X0Jsb2NrIGZsYWdcbi8vICAgYml0cyAxLi4yICAgQmxvY2tfVHlwZSAoMDAgPSBSYXcsIDAxID0gUkxFLCAxMCA9IENvbXByZXNzZWQsIDExID0gUmVzZXJ2ZWQpXG4vLyAgIGJpdHMgMy4uMjMgIEJsb2NrX1NpemUgKG1heCAxMjggS2lCIGZvciByYXcgLyBSTEUpXG4vL1xuLy8gV2UgY2h1bmsgaW50byAxMjggS2lCIHJhdyBibG9ja3MgdG8gcmVzcGVjdCB0aGUgcGVyLWJsb2NrIHNpemUgbGltaXQuXG5cbmNvbnN0IFpTVERfUkFXX0JMT0NLX01BWCA9IDEyOCAqIDEwMjQ7XG5cbmV4cG9ydCBjb25zdCB3cmFwWnN0ZCA9IChkYXRhOiBVaW50OEFycmF5KTogVWludDhBcnJheSA9PiB7XG4gIGNvbnN0IGJsb2NrczogVWludDhBcnJheVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zIDwgZGF0YS5sZW5ndGggfHwgZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCByZW1haW5pbmcgPSBkYXRhLmxlbmd0aCAtIHBvcztcbiAgICBjb25zdCBibG9ja1NpemUgPSBNYXRoLm1pbihyZW1haW5pbmcsIFpTVERfUkFXX0JMT0NLX01BWCk7XG4gICAgY29uc3QgaXNMYXN0ID0gcG9zICsgYmxvY2tTaXplID49IGRhdGEubGVuZ3RoID8gMSA6IDA7XG4gICAgY29uc3QgaGVhZGVySW50ID0gaXNMYXN0IHwgKDAgPDwgMSkgfCAoYmxvY2tTaXplIDw8IDMpOyAvLyB0eXBlPXJhdz0wXG4gICAgY29uc3QgYmxvY2tIZWFkZXIgPSBuZXcgVWludDhBcnJheShbXG4gICAgICBoZWFkZXJJbnQgJiAweGZmLFxuICAgICAgKGhlYWRlckludCA+Pj4gOCkgJiAweGZmLFxuICAgICAgKGhlYWRlckludCA+Pj4gMTYpICYgMHhmZixcbiAgICBdKTtcbiAgICBibG9ja3MucHVzaChibG9ja0hlYWRlcik7XG4gICAgaWYgKGJsb2NrU2l6ZSA+IDApIGJsb2Nrcy5wdXNoKGRhdGEuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpKTtcbiAgICBwb3MgKz0gYmxvY2tTaXplO1xuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkgYnJlYWs7XG4gIH1cbiAgY29uc3QgZmNzID0gZGF0YS5sZW5ndGg7XG4gIGNvbnN0IGZoZCA9IDBiMTAxMF8wMDAwOyAvLyBGQ1Nfc2l6ZT0xMCAoNCBieXRlcykgfCBTaW5nbGVfU2VnbWVudD0xXG4gIGNvbnN0IGhlYWQgPSBuZXcgVWludDhBcnJheShbXG4gICAgMHgyOCwgMHhiNSwgMHgyZiwgMHhmZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWdpY1xuICAgIGZoZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRkhEXG4gICAgZmNzICYgMHhmZiwgKGZjcyA+Pj4gOCkgJiAweGZmLCAoZmNzID4+PiAxNikgJiAweGZmLCAoZmNzID4+PiAyNCkgJiAweGZmLFxuICBdKTtcbiAgbGV0IHRvdGFsID0gaGVhZC5sZW5ndGg7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHRvdGFsICs9IGIubGVuZ3RoO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheSh0b3RhbCk7XG4gIGxldCBvZmYgPSAwO1xuICBvdXQuc2V0KGhlYWQsIG9mZik7IG9mZiArPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgeyBvdXQuc2V0KGIsIG9mZik7IG9mZiArPSBiLmxlbmd0aDsgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gQ29tcGFuaW9uIGRlY29kZXIgZm9yIG91ciBvd24gd3JpdGVyIOKAlCB1c2VkIGJ5IHRlc3RzLiBBY2NlcHRzIGFueSB6c3RkXG4vLyBmcmFtZSB3cml0dGVuIGJ5IGB3cmFwWnN0ZGAgKHNpbmdsZSBSYXdfQmxvY2sgc3RyZWFtLCA0LWJ5dGUgRkNTLFxuLy8gc2luZ2xlLXNlZ21lbnQsIG5vIGNoZWNrc3VtLCBubyBkaWN0KS4gVGhyb3dzIG9uIGFueXRoaW5nIGVsc2Ugc28gdGVzdHNcbi8vIGZhaWwgbG91ZGx5IHJhdGhlciB0aGFuIHNpbGVudGx5IG1pcy1wYXJzZS5cbmV4cG9ydCBjb25zdCB1bndyYXBac3RkID0gKGZyYW1lOiBVaW50OEFycmF5KTogVWludDhBcnJheSA9PiB7XG4gIGlmIChmcmFtZS5sZW5ndGggPCA5KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGZyYW1lIHRvbyBzaG9ydCcpO1xuICBpZiAoZnJhbWVbMF0gIT09IDB4MjggfHwgZnJhbWVbMV0gIT09IDB4YjUgfHwgZnJhbWVbMl0gIT09IDB4MmYgfHwgZnJhbWVbM10gIT09IDB4ZmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGJhZCBtYWdpYyBudW1iZXInKTtcbiAgfVxuICBjb25zdCBmaGQgPSBmcmFtZVs0XSE7XG4gIGNvbnN0IGZjc1NpemVGbGFnID0gKGZoZCA+Pj4gNikgJiAwYjExO1xuICBjb25zdCBzaW5nbGVTZWdtZW50ID0gKChmaGQgPj4+IDUpICYgMSkgPT09IDE7XG4gIGNvbnN0IGNoZWNrc3VtID0gKChmaGQgPj4+IDIpICYgMSkgPT09IDE7XG4gIGNvbnN0IGRpY3RJZCA9IGZoZCAmIDBiMTE7XG4gIGlmICghc2luZ2xlU2VnbWVudCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBvbmx5IFNpbmdsZV9TZWdtZW50IGZyYW1lcyBzdXBwb3J0ZWQnKTtcbiAgaWYgKGNoZWNrc3VtKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGNvbnRlbnQgY2hlY2tzdW0gbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoZGljdElkKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGRpY3Rpb25hcmllcyBub3Qgc3VwcG9ydGVkJyk7XG4gIGxldCBwb3MgPSA1O1xuICBsZXQgZmNzID0gMDtcbiAgaWYgKGZjc1NpemVGbGFnID09PSAwYjAwKSB7IGZjcyA9IGZyYW1lW3Bvc10hOyBwb3MgKz0gMTsgfVxuICBlbHNlIGlmIChmY3NTaXplRmxhZyA9PT0gMGIwMSkgeyBmY3MgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCk7IGZjcyArPSAyNTY7IHBvcyArPSAyOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjEwKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KSB8IChmcmFtZVtwb3MgKyAyXSEgPDwgMTYpIHwgKGZyYW1lW3BvcyArIDNdISAqIDB4MTAwMDAwMCk7IHBvcyArPSA0OyB9XG4gIGVsc2UgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiA4LWJ5dGUgRkNTIHVuc3VwcG9ydGVkJyk7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KGZjcyk7XG4gIGxldCBvdXRQb3MgPSAwO1xuICBmb3IgKDs7KSB7XG4gICAgaWYgKHBvcyArIDMgPiBmcmFtZS5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignenN0ZDogdHJ1bmNhdGVkIGJsb2NrIGhlYWRlcicpO1xuICAgIGNvbnN0IGhlYWRlckludCA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KSB8IChmcmFtZVtwb3MgKyAyXSEgPDwgMTYpO1xuICAgIHBvcyArPSAzO1xuICAgIGNvbnN0IGlzTGFzdCA9IChoZWFkZXJJbnQgJiAxKSA9PT0gMTtcbiAgICBjb25zdCBibG9ja1R5cGUgPSAoaGVhZGVySW50ID4+PiAxKSAmIDBiMTE7XG4gICAgY29uc3QgYmxvY2tTaXplID0gKGhlYWRlckludCA+Pj4gMykgJiAweDFmX2ZmX2ZmO1xuICAgIGlmIChibG9ja1R5cGUgIT09IDApIHRocm93IG5ldyBFcnJvcihgenN0ZDogb25seSBSYXdfQmxvY2sgKDApIHN1cHBvcnRlZCwgZ290ICR7YmxvY2tUeXBlfWApO1xuICAgIGlmIChwb3MgKyBibG9ja1NpemUgPiBmcmFtZS5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignenN0ZDogdHJ1bmNhdGVkIGJsb2NrIHBheWxvYWQnKTtcbiAgICBvdXQuc2V0KGZyYW1lLnN1YmFycmF5KHBvcywgcG9zICsgYmxvY2tTaXplKSwgb3V0UG9zKTtcbiAgICBvdXRQb3MgKz0gYmxvY2tTaXplO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGlzTGFzdCkgYnJlYWs7XG4gIH1cbiAgaWYgKG91dFBvcyAhPT0gZmNzKSB0aHJvdyBuZXcgRXJyb3IoYHpzdGQ6IEZDUyBtaXNtYXRjaCAoZ290ICR7b3V0UG9zfSwgZXhwZWN0ZWQgJHtmY3N9KWApO1xuICByZXR1cm4gb3V0O1xufTtcblxuLy8g4pSA4pSA4pSAIFRhciBsaXN0aW5nIGRlY29kZXIgKHRlc3Qtb25seSkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBXYWxrcyBhIHRhciBieXRlIGJ1ZmZlciwgcmV0dXJuaW5nIHtuYW1lLCBkYXRhfSBmb3IgZWFjaCBlbnRyeS4gU3RvcHMgYXRcbi8vIHRoZSB0cmFpbGVyICh0d28gemVybyBibG9ja3MpLiBPbmx5IHJlYWRzIHRoZSBmaWVsZHMgUGluY2hHcmFiIHdyaXRlcy5cblxuZXhwb3J0IHR5cGUgUGFyc2VkVGFyRW50cnkgPSB7bmFtZTogc3RyaW5nOyBkYXRhOiBVaW50OEFycmF5OyBzaXplOiBudW1iZXJ9O1xuXG5jb25zdCBkZWMgPSBuZXcgVGV4dERlY29kZXIoKTtcblxuY29uc3QgcmVhZE51bGxTdHIgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICBsZXQgZW5kID0gb2Zmc2V0ICsgbGVuZ3RoO1xuICBmb3IgKGxldCBpID0gb2Zmc2V0OyBpIDwgb2Zmc2V0ICsgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldID09PSAwKSB7IGVuZCA9IGk7IGJyZWFrOyB9XG4gIH1cbiAgcmV0dXJuIGRlYy5kZWNvZGUoYnVmLnN1YmFycmF5KG9mZnNldCwgZW5kKSk7XG59O1xuXG5jb25zdCByZWFkT2N0YWwgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICBjb25zdCBzID0gcmVhZE51bGxTdHIoYnVmLCBvZmZzZXQsIGxlbmd0aCkudHJpbSgpO1xuICByZXR1cm4gcyA/IHBhcnNlSW50KHMsIDgpIDogMDtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVRhciA9IChidWY6IFVpbnQ4QXJyYXkpOiBQYXJzZWRUYXJFbnRyeVtdID0+IHtcbiAgY29uc3QgZW50cmllczogUGFyc2VkVGFyRW50cnlbXSA9IFtdO1xuICBsZXQgcG9zID0gMDtcbiAgd2hpbGUgKHBvcyArIDUxMiA8PSBidWYubGVuZ3RoKSB7XG4gICAgY29uc3QgaGVhZGVyID0gYnVmLnN1YmFycmF5KHBvcywgcG9zICsgNTEyKTtcbiAgICBsZXQgYWxsWmVybyA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MTI7IGkrKykgeyBpZiAoaGVhZGVyW2ldICE9PSAwKSB7IGFsbFplcm8gPSBmYWxzZTsgYnJlYWs7IH0gfVxuICAgIGlmIChhbGxaZXJvKSBicmVhazsgLy8gdHJhaWxlclxuICAgIGNvbnN0IHNob3J0TmFtZSA9IHJlYWROdWxsU3RyKGhlYWRlciwgMCwgMTAwKTtcbiAgICBjb25zdCBwcmVmaXggPSByZWFkTnVsbFN0cihoZWFkZXIsIDM0NSwgMTU1KTtcbiAgICBjb25zdCBuYW1lID0gcHJlZml4ID8gYCR7cHJlZml4fS8ke3Nob3J0TmFtZX1gIDogc2hvcnROYW1lO1xuICAgIGNvbnN0IHNpemUgPSByZWFkT2N0YWwoaGVhZGVyLCAxMjQsIDEyKTtcbiAgICBwb3MgKz0gNTEyO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgZW50cmllcy5wdXNoKHtuYW1lLCBzaXplLCBkYXRhOiBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyBzaXplKX0pO1xuICAgICAgcG9zICs9IHNpemU7XG4gICAgICBjb25zdCBwYWQgPSAoNTEyIC0gKHNpemUgJSA1MTIpKSAlIDUxMjtcbiAgICAgIHBvcyArPSBwYWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBlbnRyaWVzO1xufTtcbiIsCiAgICAiLy8gQXV0by1nZW5lcmF0ZWQgYnkgc2NyaXB0cy9idWlsZC1leHRlbnNpb24udHMg4oCUIGRvIG5vdCBlZGl0LlxuLy8gVGVsbHMgdGhlIHNpZGVwYW5lbCB3aGljaCB0ZW1wbGF0ZSByZXNvdXJjZXMgZXhpc3QgaW4gdGhpcyBidWlsZC5cbi8vIEFjdHVhbCBjb250ZW50IGxpdmVzIGFzIC5tZCBmaWxlcyB1bmRlciBleHRlbnNpb24vdGVtcGxhdGVzLywgbG9hZGVkXG4vLyBsYXppbHkgdmlhIGNocm9tZS5ydW50aW1lLmdldFVSTCDigJQgc2VlIGxvYWRUZW1wbGF0ZSgpIGluIHNpZGVwYW5lbC50cy5cbmV4cG9ydCBjb25zdCBURU1QTEFURVNfUFJFU0VOVCA9IHtcImRlc2lnblRlbXBsYXRlXCI6dHJ1ZSxcInNraWxsVGVtcGxhdGVcIjp0cnVlLFwibG9jYWxEZXNpZ25cIjp0cnVlLFwibG9jYWxTa2lsbFwiOnRydWV9IGFzIGNvbnN0O1xuIiwKICAgICIvLyBBdXRvLWdlbmVyYXRlZCBieSBzY3JpcHRzL2J1aWxkLWV4dGVuc2lvbi50cyDigJQgZG8gbm90IGVkaXQuXG4vLyBJbnZlbnRvcnkgb2YgdmVuZG9yZWQgc2tpbGwgcmVzb3VyY2VzIHVuZGVyIGV4dGVuc2lvbi9za2lsbHMvIChzb3VyY2Ugb2Zcbi8vIHRydXRoOiB0aGlyZF9wYXJ0eS8qL1VQU1RSRUFNLmxvY2sgdmlhIHNjcmlwdHMvc3luYy1idW5kbGVkLXNraWxscy50cykuXG4vLyBgZXh0YCBpcyB0aGUgZXh0ZW5zaW9uLXJlbGF0aXZlIGZldGNoIHBhdGg7IGBhcmNoaXZlYCBpcyB3aGVyZSB0aGUgZmlsZVxuLy8gbGFuZHMgaW5zaWRlIGFuIGV4cG9ydGVkIC50YXIuenN0IGJ1bmRsZS5cbmV4cG9ydCBjb25zdCBCVU5ETEVEX1NLSUxMU19QUkVTRU5UID0gdHJ1ZTtcbmV4cG9ydCB0eXBlIEJ1bmRsZWRTa2lsbEZpbGUgPSB7ZXh0OiBzdHJpbmc7IGFyY2hpdmU6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn07XG5leHBvcnQgY29uc3QgQlVORExFRF9TS0lMTF9GSUxFUzogQnVuZGxlZFNraWxsRmlsZVtdID0gW1xuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTAzMDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzkxMFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5kcm9pZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuZHJvaWQubWRcIixcbiAgICBcImJ5dGVzXCI6IDMyMjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuaW1hdGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmltYXRlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDcwOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzQzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubmF0aXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubmF0aXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA4MzEzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ib2xkZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ib2xkZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDcwOTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JyYW5kLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYnJhbmQubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNDc3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jbGFyaWZ5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY2xhcmlmeS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA2NDZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvZGV4Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29kZXgubWRcIixcbiAgICBcImJ5dGVzXCI6IDcwMDJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvbG9yaXplLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29sb3JpemUubWRcIixcbiAgICBcImJ5dGVzXCI6IDEzNTY4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcmFmdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyYWZ0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTk0NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JpdGlxdWUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcml0aXF1ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDEyOTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RlbGlnaHQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kZWxpZ2h0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA5ODI3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kaXN0aWxsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGlzdGlsbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTc0MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZG9jdW1lbnQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kb2N1bWVudC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjc5NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2V4dHJhY3QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9leHRyYWN0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNDMxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9oYXJkZW4ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9oYXJkZW4ubWRcIixcbiAgICBcImJ5dGVzXCI6IDg1OTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hvb2tzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaG9va3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDkyNTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2luaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbml0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxODk1MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW50ZXJhY3Rpb24tZGVzaWduLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW50ZXJhY3Rpb24tZGVzaWduLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NTc1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pb3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pb3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDMwMzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xheW91dC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xheW91dC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTE3OTBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9saXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2MDE1NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb25ib2FyZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29uYm9hcmQubWRcIixcbiAgICBcImJ5dGVzXCI6IDc3NDBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29wdGltaXplLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3B0aW1pemUubWRcIixcbiAgICBcImJ5dGVzXCI6IDc1OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL292ZXJkcml2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL292ZXJkcml2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTEzOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcG9saXNoLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcG9saXNoLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMjk1NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcHJvZHVjdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3Byb2R1Y3QubWRcIixcbiAgICBcImJ5dGVzXCI6IDM3NThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3F1aWV0ZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9xdWlldGVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0OTExXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9zaGFwZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3NoYXBlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTUyM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvdHlwZXNldC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3R5cGVzZXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE3MTM1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL0xJQ0VOU0VcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL0xJQ0VOU0VcIixcbiAgICBcImJ5dGVzXCI6IDEwNzY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL05PVElDRS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvTk9USUNFLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MDNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL21hcmtldHBsYWNlLmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9tYXJrZXRwbGFjZS5qc29uXCIsXG4gICAgXCJieXRlc1wiOiAxMTk0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9wbHVnaW4uanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL3BsdWdpbi5qc29uXCIsXG4gICAgXCJieXRlc1wiOiA3NTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvRlVORElORy55bWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0ZVTkRJTkcueW1sXCIsXG4gICAgXCJieXRlc1wiOiA0N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9kZXNpZ24tc3lzdGVtLXByb2ZpbGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2Rlc2lnbi1zeXN0ZW0tcHJvZmlsZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjgxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2ZyYW1ld29yay1jb3JyZWN0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9mcmFtZXdvcmstY29ycmVjdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzg5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2xlYXJuaW5nLXN1Ym1pc3Npb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2xlYXJuaW5nLXN1Ym1pc3Npb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDM2NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9uZXctaGV1cmlzdGljLXJ1bGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL25ldy1oZXVyaXN0aWMtcnVsZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjkyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL1BVTExfUkVRVUVTVF9URU1QTEFURS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvUFVMTF9SRVFVRVNUX1RFTVBMQVRFLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NDJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRpZ25vcmVcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aWdub3JlXCIsXG4gICAgXCJieXRlc1wiOiA2NjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NIQU5HRUxPRy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NIQU5HRUxPRy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTMxNTBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NJVEFUSU9OLmNmZlwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NJVEFUSU9OLmNmZlwiLFxuICAgIFwiYnl0ZXNcIjogMTIxMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09ERV9PRl9DT05EVUNULm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09ERV9PRl9DT05EVUNULm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVElORy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVElORy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTU2MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUT1JTLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUT1JTLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0xJQ0VOU0VcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9MSUNFTlNFXCIsXG4gICAgXCJieXRlc1wiOiAxMTU1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9OT1RJQ0VcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9OT1RJQ0VcIixcbiAgICBcImJ5dGVzXCI6IDQ1ODJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL1JFQURNRS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL1JFQURNRS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjE3MDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FsbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FsbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzE4MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYW5hbHl6ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FuYWx5emUubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNzc1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9ldmFsdWF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2V2YWx1YXRlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyODM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9zb2x2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL3NvbHZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNjEzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9hbnRpLXBhdHRlcm5zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvYW50aS1wYXR0ZXJucy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjY3OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvY29uc3RpdHV0aW9uYWwtY29uc3RyYWludHMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9jb25zdGl0dXRpb25hbC1jb25zdHJhaW50cy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDU5MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvb3V0cHV0LXNjaGVtYS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL291dHB1dC1zY2hlbWEubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNTE4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wZmQtbGF5ZXItcnVicmljLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcGZkLWxheWVyLXJ1YnJpYy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTEyOTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BzeWNob2xvZ3kvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcHN5Y2hvbG9neS9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDIzNDI1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS90aWVyMi1wcm9tcHQtdGVtcGxhdGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS90aWVyMi1wcm9tcHQtdGVtcGxhdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDE1ODg4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvc2hvcGlmeS10aGVtZXMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvc2hvcGlmeS10aGVtZXMubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3MDMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3MvdGFpbHdpbmQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3MvdGFpbHdpbmQubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3NDk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvd29yZHByZXNzLXRoZW1lcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy93b3JkcHJlc3MtdGhlbWVzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMjI0NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2ZvdW5kYXRpb24tcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9mb3VuZGF0aW9uLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDMzODgxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDEtcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMS1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAzNjEzOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wyLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDItcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMzkyNTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMy1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wzLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDIxNjc3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDQtcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sNC1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAyNDgwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1jcm9zcy1sYXllci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtY3Jvc3MtbGF5ZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDI4NTU0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWV4Y2VsbGVudC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZXhjZWxsZW50Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNzAyOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1nb29kLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1nb29kLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMTMzM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1tZWRpb2NyZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtbWVkaW9jcmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI0Mzc3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXBvb3IubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXBvb3IubWRcIixcbiAgICBcImJ5dGVzXCI6IDI2MTM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXRlcnJpYmxlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS10ZXJyaWJsZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjAxOTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdW5jb252ZW50aW9uYWwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXVuY29udmVudGlvbmFsLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMzYzM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL0FESEQtQ1VSQi1DVVQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvQURIRC1DVVJCLUNVVC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTMwNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL1BFUkNFUFRJT04tRklSU1QtREVTSUdOLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL1BFUkNFUFRJT04tRklSU1QtREVTSUdOLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5ODc3MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vbGxtcy50eHRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9sbG1zLnR4dFwiLFxuICAgIFwiYnl0ZXNcIjogNjU0NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2NyaXB0cy9nZW4tcGZkLWluZGV4LnB5XCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2NyaXB0cy9nZW4tcGZkLWluZGV4LnB5XCIsXG4gICAgXCJieXRlc1wiOiA0NTQ4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjkyNTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9hY2N1bXVsYXRlZC1sZWFybmluZ3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvYWNjdW11bGF0ZWQtbGVhcm5pbmdzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3MjJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9jaXRhdGlvbi1zdGFuZGFyZHMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvY2l0YXRpb24tc3RhbmRhcmRzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMzQzMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2luc2lnaHRzLWxvZy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9pbnNpZ2h0cy1sb2cubWRcIixcbiAgICBcImJ5dGVzXCI6IDc0MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMC9sMDE4LWJhY2tlbmQtbWVjaGFuaWNzLWFzLWZyb250ZW5kLWNvbXBsZXhpdHkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wwL2wwMTgtYmFja2VuZC1tZWNoYW5pY3MtYXMtZnJvbnRlbmQtY29tcGxleGl0eS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzYxNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMS9sMDExLXZpc3VhbC1jaGFubmVsLWF1ZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMS9sMDExLXZpc3VhbC1jaGFubmVsLWF1ZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMTQ4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTMta2V5Ym9hcmQtZGVuc2l0eS1pcy1sMi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxMy1rZXlib2FyZC1kZW5zaXR5LWlzLWwyLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNDUxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTYtbmVhci1taXNzLWNvbG9yLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxNi1uZWFyLW1pc3MtY29sb3ItYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA2MTM2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMjQtYWEtY29uc3RyYWluZWQtdG9rZW4tbGFkZGVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDI0LWFhLWNvbnN0cmFpbmVkLXRva2VuLWxhZGRlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTAzMFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMy9sMDIzLWZhbHNpZmlhYmlsaXR5LXRyaWFkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMy9sMDIzLWZhbHNpZmlhYmlsaXR5LXRyaWFkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0Njk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDMtcHJlLXNlbmQtdnMtcG9zdC1yZXNwb25zZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwMy1wcmUtc2VuZC12cy1wb3N0LXJlc3BvbnNlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA4MDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwNi1pbmZyYXN0cnVjdHVyZS12cy1hY3RpdmF0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA2LWluZnJhc3RydWN0dXJlLXZzLWFjdGl2YXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDkzN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA4LWVwaXN0ZW1pYy1hc3ltbWV0cnkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDgtZXBpc3RlbWljLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMjItbDQtc3ltbWV0cnktdGhyZXNob2xkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDIyLWw0LXN5bW1ldHJ5LXRocmVzaG9sZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDUyMFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9faW5kZXgubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19pbmRleC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzczNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9fc2VhcmNoLmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19zZWFyY2guanNvblwiLFxuICAgIFwiYnl0ZXNcIjogMTQxMDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAwOS10ZW1wb3JhbC1zZXNzaW9uLWNvbnRpbnVpdHkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMDktdGVtcG9yYWwtc2Vzc2lvbi1jb250aW51aXR5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA5NjlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxMi1yb3V0ZS12cy1zdXJ2ZXkta25vd2xlZGdlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDEyLXJvdXRlLXZzLXN1cnZleS1rbm93bGVkZ2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDkzOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE1LWV4cGVyaWVudGlhbC1zZWxmLWNvbnRyYWRpY3Rpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTUtZXhwZXJpZW50aWFsLXNlbGYtY29udHJhZGljdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTY1OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE5LW11bHRpLWFydGlmYWN0LWVuZ2FnZW1lbnQtZmllbGQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTktbXVsdGktYXJ0aWZhY3QtZW5nYWdlbWVudC1maWVsZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTQ5M1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDIxLWw0LWV0aGljcy1mdXNpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjEtbDQtZXRoaWNzLWZ1c2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDExOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI1LWNhc2NhZGUtY3JlZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI1LWNhc2NhZGUtY3JlZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NDE1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjYtYWVzdGhldGljLXN0YWJpbGl0eS1hcy10cnVzdC1wcm9kdWNlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNi1hZXN0aGV0aWMtc3RhYmlsaXR5LWFzLXRydXN0LXByb2R1Y2VyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1ODA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjgtaGVsZC1kZWNpc2lvbi1jb21wb3VuZGluZy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyOC1oZWxkLWRlY2lzaW9uLWNvbXBvdW5kaW5nLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1Mjc1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMS1nZW5lcmF0aXZlLXZzLWV2YWx1YXRpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMS1nZW5lcmF0aXZlLXZzLWV2YWx1YXRpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDY3M1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDItYWNjZXNzLXZzLXNpZ25hbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAyLWFjY2Vzcy12cy1zaWduYWwubWRcIixcbiAgICBcImJ5dGVzXCI6IDc1OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDQtd29ya3NwYWNlLXZzLXByb2R1Y3Qtc2VwYXJhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA0LXdvcmtzcGFjZS12cy1wcm9kdWN0LXNlcGFyYXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDkwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDUtcmVjdXJzaXZlLXZhbGlkYXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNS1yZWN1cnNpdmUtdmFsaWRhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNy1jb252ZXJnZW50LWdhcC1pZGVudGlmaWNhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA3LWNvbnZlcmdlbnQtZ2FwLWlkZW50aWZpY2F0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDEwLWNvbnN0cmFpbnRzLWFyZS1kaXN0cmlidXRpb25zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTAtY29uc3RyYWludHMtYXJlLWRpc3RyaWJ1dGlvbnMubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5MDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE0LW9wZXJhdGlvbmFsLXZzLXN0cnVjdHVyYWwtZXRoaWNzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTQtb3BlcmF0aW9uYWwtdnMtc3RydWN0dXJhbC1ldGhpY3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDE1MjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE3LWl0ZXJhdGl2ZS1yZWdyZXNzaW9uLWlzLXZpc2liaWxpdHkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNy1pdGVyYXRpdmUtcmVncmVzc2lvbi1pcy12aXNpYmlsaXR5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NzM3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyMC1pbnRlcm5hdGlvbmFsLWNpdGF0aW9uLWV4cGFuc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDIwLWludGVybmF0aW9uYWwtY2l0YXRpb24tZXhwYW5zaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NjY1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyNy1pbnRlcm5hbC1hY2tub3dsZWRnbWVudC1zaWduYWxzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjctaW50ZXJuYWwtYWNrbm93bGVkZ21lbnQtc2lnbmFscy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjcxMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjktcG9ydC1kb250LWluc3RhbGwtbW90aW9uLWF1ZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjktcG9ydC1kb250LWluc3RhbGwtbW90aW9uLWF1ZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA2MDI0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjk3ODVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wZmQtc3BhdGlhbC1leHRlbnNpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcGZkLXNwYXRpYWwtZXh0ZW5zaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTU2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcHJhY3RpdGlvbmVyLWNvcnJlY3Rpb25zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3ByYWN0aXRpb25lci1jb3JyZWN0aW9ucy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9za2lsbHMtaW5kZXguanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInNraWxscy1pbmRleC5qc29uXCIsXG4gICAgXCJieXRlc1wiOiAxMDExM1xuICB9XG5dO1xuIiwKICAgICIvLyBTZW5kLXRvLUFnZW50IHByb21wdCArIHByb3RvY29sIGJ1aWxkZXJzLlxuLy9cbi8vIFR3byBhcnRpZmFjdHMsIG9uZSBkb2N0cmluZTpcbi8vICAg4oCiIGJ1aWxkQWdlbnRQcm9tcHRKc29ubCDigJQgdGhlIEpTT05MIGNsaXBib2FyZCBwYXlsb2FkIGNvcGllZCB3aGVuIHRoZVxuLy8gICAgIHVzZXIgY2xpY2tzIFwiU2VuZCB0byBBZ2VudFwiLiBOaW5lIGRlbnNlIGxpbmVzOiBoZWFkZXIsIGluc3RydWN0aW9uLFxuLy8gICAgIGlkZW1wb3RlbnQgYmFzaCBib290c3RyYXAsIG1hbmRhdG9yeSBmdWxsLXJlYWQgZmlsZSBsaXN0LCBidW5kbGVcbi8vICAgICB0cmVlLCBvcmNoZXN0cmF0aW9uIHBoYXNlcywgY29uZGl0aW9uYWwgc3RvY2stREVTSUdOIHdhcm5pbmcsXG4vLyAgICAgcmVjYXB0dXJlIHZlcmlmaWNhdGlvbiwgZG9uZS1jcml0ZXJpYS5cbi8vICAg4oCiIGJ1aWxkQWdlbnRQcm90b2NvbE1kIOKAlCBBR0VOVC1QUk9UT0NPTC5tZCBpbnNpZGUgZXZlcnkgYnVuZGxlOiB0aGVcbi8vICAgICBmdWxsIGV4cGFuc2lvbiBvZiB0aGUgc2FtZSBkb2N0cmluZSwgc28gYSBsb3N0IGNsaXBib2FyZCBkZWdyYWRlcyB0b1xuLy8gICAgIFwiZXh0cmFjdCB0aGUgYXJjaGl2ZSBhbmQgcmVhZCBBR0VOVC1QUk9UT0NPTC5tZFwiLlxuLy9cbi8vIEh5ZHJhdGlvbiBjb252ZW50aW9ucyAobWlycm9yZWQgaW4gdGhlIGRvY3MpOlxuLy8gICDigKIgdmFsdWVzIGJha2VkIGluIGF0IGV4cG9ydCB0aW1lIGNvbWUgZnJvbSB0aGUgb3B0aW9ucyBvYmplY3Rcbi8vICAgICAod29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZSBwYXRoLCBleHBvcnQgdGltZXN0YW1wLCB0YXIgZW50cmllcyk7XG4vLyAgIOKAoiA8QU5HTEVfVE9LRU5TPiBhcmUgbGVmdCB2ZXJiYXRpbSBmb3IgdGhlIFJFQ0VJVklORyBhZ2VudCB0byBpbmZlclxuLy8gICAgICg8UFJPSkVDVF9ST09UPiwgPEFQUF9VUkw+LCA8RkVFREJBQ0tfVUlEPiwgPHJ1bklkPiwgPEFSQ0hJVkVfUEFUSD4pLlxuLy9cbi8vIERldGVybWluaXNtIGNvbnRyYWN0OiBpZGVudGljYWwgaW5wdXRzIOKGkiBpZGVudGljYWwgb3V0cHV0IHN0cmluZ3MuIE5vXG4vLyBEYXRlLm5vdygpL01hdGgucmFuZG9tKCkgaW4gaGVyZSDigJQgdGhlIGV4cG9ydCBjbG9jayBhcnJpdmVzIHZpYSBvcHRzLlxuLy8gbm9kZS10ZXN0YWJsZSAobm8gYnJvd3NlciBBUElzKTsgY29uc3VtZWQgYnkgc2lkZXBhbmVsLnRzIGF0IGV4cG9ydCB0aW1lLlxuXG4vKiogUGVyc2lzdGVuY2Ugcm9vdCBmb3IgYSB3b3Jrc3BhY2UsIGFzIHRoZSByZWNlaXZpbmcgYWdlbnQgc2VlcyBpdC4gKi9cbmV4cG9ydCBjb25zdCB3b3Jrc3BhY2VSb290ID0gKHdvcmtzcGFjZSkgPT4gYH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyR7d29ya3NwYWNlfWA7XG5cbi8qKiBFeHRyYWN0aW9uIGRpciBmb3IgYSBidW5kbGUgaW5zaWRlIHRoZSBwZXJzaXN0ZW5jZSByb290LiAqL1xuZXhwb3J0IGNvbnN0IGV4dHJhY3REaXIgPSAod29ya3NwYWNlLCBidW5kbGVJZCkgPT5cbiAgYCR7d29ya3NwYWNlUm9vdCh3b3Jrc3BhY2UpfS9idW5kbGVzLyR7YnVuZGxlSWR9L2V4dHJhY3RlZGA7XG5cbi8vIFNpbmdsZS1xdW90ZS1zYWZlIGludGVycG9sYXRpb24gZm9yIGJhc2g6ICdpdCdcXCcncycgc3Vydml2ZXMgYW55IGlucHV0LlxuY29uc3Qgc3EgPSAodikgPT4gU3RyaW5nKHYpLnJlcGxhY2UoLycvZywgXCInXFxcXCcnXCIpO1xuXG4vKipcbiAqIElkZW1wb3RlbnQgYmFzaCBib290c3RyYXAuIGBhcmNoaXZlUGF0aGAgaXMgdGhlIGh5ZHJhdGVkIGFic29sdXRlIHBhdGggb2ZcbiAqIHRoZSAudGFyLnpzdCBvbiB0aGUgb3BlcmF0b3IncyBtYWNoaW5lOyBwYXNzIHRoZSBsaXRlcmFsIHRva2VuXG4gKiAnPEFSQ0hJVkVfUEFUSD4nIHRvIGVtaXQgdGhlIHRva2VuaXplZCBjb3B5IHNoaXBwZWQgaW4gQUdFTlQtUFJPVE9DT0wubWQuXG4gKlxuICogVGhlIHNjcmlwdCBzZWxmLW5vcm1hbGl6ZXMgdGhlIGFyY2hpdmUgcGF0aCBzbyBcImV4ZWN1dGUgZXhhY3RseSBhc1xuICogd3JpdHRlblwiIHN0YXlzIHRydWUgZXZlcnl3aGVyZSB0aGUgb3BlcmF0b3IncyBicm93c2VyIGFuZCBhZ2VudCBjYW5cbiAqIGRpc2FncmVlIGFib3V0IHBhdGggc2hhcGU6IGEgbGVhZGluZyB+IGlzIGV4cGFuZGVkLCBhbmQgYSBXaW5kb3dzXG4gKiBkcml2ZSBwYXRoIChDaHJvbWUgb24gV2luZG93cyArIGFnZW50IGluIFdTTC9HaXQtQmFzaCkgaXMgY29udmVydGVkXG4gKiB2aWEgd3NscGF0aCwgY3lncGF0aCwgb3IgYSBtYW51YWwgL21udC88ZHJpdmU+IGZhbGxiYWNrLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRCb290c3RyYXBTY3JpcHQgPSAoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmVQYXRoLCBleHBvcnRUc30pID0+IFtcbiAgJyMhL3Vzci9iaW4vZW52IGJhc2gnLFxuICAnIyBQaW5jaEdyYWIgYm9vdHN0cmFwIOKAlCBpZGVtcG90ZW50OyBzYWZlIHRvIHJlLXJ1bi4nLFxuICAnc2V0IC1ldW8gcGlwZWZhaWwnLFxuICBgV1M9JyR7c3Eod29ya3NwYWNlKX0nYCxcbiAgYEJJRD0nJHtzcShidW5kbGVJZCl9J2AsXG4gIGBTUkM9JyR7c3EoYXJjaGl2ZVBhdGgpfSdgLFxuICAnIyBOb3JtYWxpemUgdGhlIGFyY2hpdmUgcGF0aDogZXhwYW5kIGEgbGVhZGluZyB+IChjbGlwYm9hcmQgbWF5IGNhcnJ5IHRoZScsXG4gICcjIH4vRG93bmxvYWRzIGZvcm0pIGFuZCB0cmFuc2xhdGUgV2luZG93cyBkcml2ZSBwYXRocyBmb3IgV1NML0dpdC1CYXNoLicsXG4gICdTUkM9XCIke1NSQy8jXFxcXH4vJEhPTUV9XCInLFxuICAnY2FzZSBcIiRTUkNcIiBpbicsXG4gICcgIFtBLVphLXpdOltcXFxcXFxcXC9dKiknLFxuICAnICAgIGlmIGNvbW1hbmQgLXYgd3NscGF0aCA+L2Rldi9udWxsIDI+JjE7IHRoZW4gU1JDPVwiJCh3c2xwYXRoIC11IFwiJFNSQ1wiKVwiOycsXG4gICcgICAgZWxpZiBjb21tYW5kIC12IGN5Z3BhdGggPi9kZXYvbnVsbCAyPiYxOyB0aGVuIFNSQz1cIiQoY3lncGF0aCAtdSBcIiRTUkNcIilcIjsnLFxuICAnICAgIGVsc2UnLFxuICAnICAgICAgZHJpdmU9XCIkKHByaW50ZiAlcyBcIiR7U1JDJSU6Kn1cIiB8IHRyIFwiWzp1cHBlcjpdXCIgXCJbOmxvd2VyOl1cIilcIicsXG4gICcgICAgICByZXN0PVwiJHtTUkMjKjp9XCI7IHJlc3Q9XCIke3Jlc3QvL1xcXFxcXFxcLy99XCInLFxuICAnICAgICAgU1JDPVwiL21udC8kZHJpdmUkcmVzdFwiJyxcbiAgJyAgICBmaTs7JyxcbiAgJ2VzYWMnLFxuICAnUk9PVD1cIiRIT01FLy5waW5jaGdyYWIvd29ya3NwYWNlcy8kV1NcIicsXG4gICdERVNUPVwiJFJPT1QvYnVuZGxlcy8kQklEXCInLFxuICAnaWYgWyAtZiBcIiRERVNULy5leHRyYWN0ZWRcIiBdICYmIFsgXCIkKGNhdCBcIiRERVNULy5leHRyYWN0ZWRcIilcIiA9IFwiJEJJRFwiIF07IHRoZW4nLFxuICAnICBlY2hvIFwiYWxyZWFkeS1leHRyYWN0ZWQgJERFU1QvZXh0cmFjdGVkXCInLFxuICAnZWxzZScsXG4gICcgIG1rZGlyIC1wIFwiJERFU1QvZXh0cmFjdGVkXCIgXCIkUk9PVC9wbGFucy8kQklEXCIgXCIkUk9PVC9hdWRpdHMvJEJJRFwiIFwiJFJPT1QvcmVjYXB0dXJlc1wiJyxcbiAgJyAgaWYgdGFyIC0tenN0ZCAteGYgXCIkU1JDXCIgLUMgXCIkREVTVC9leHRyYWN0ZWRcIiAyPi9kZXYvbnVsbDsgdGhlbiA6OyBlbHNlJyxcbiAgJyAgICB6c3RkIC1kYyBcIiRTUkNcIiB8IHRhciAteCAtQyBcIiRERVNUL2V4dHJhY3RlZFwiJyxcbiAgJyAgZmknLFxuICAnICBjcCAtZiBcIiRTUkNcIiBcIiRERVNUL2J1bmRsZS50YXIuenN0XCInLFxuICAnICBwcmludGYgXFwnJXNcXCcgXCIkQklEXCIgPiBcIiRERVNULy5leHRyYWN0ZWRcIicsXG4gICcgIGVjaG8gXCJleHRyYWN0ZWQgJERFU1QvZXh0cmFjdGVkXCInLFxuICAnZmknLFxuICBgWyAtZiBcIiRST09UL3dvcmstbWFuaWZlc3QuanNvbmxcIiBdIHx8IHByaW50ZiAnJXNcXFxcbicgJ3tcInZcIjoxLFwidHlwZVwiOlwid29yay1tYW5pZmVzdC1oZWFkZXJcIixcInRvb2xcIjpcInBpbmNoZ3JhYlwiLFwid29ya3NwYWNlXCI6XCIke3dvcmtzcGFjZX1cIixcImNyZWF0ZWRcIjpcIiR7ZXhwb3J0VHN9XCJ9JyA+IFwiJFJPT1Qvd29yay1tYW5pZmVzdC5qc29ubFwiYCxcbiAgJ2VjaG8gXCJ3b3JrZGlyICRST09UXCInLFxuXS5qb2luKCdcXG4nKTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGJ1bmRsZSdzIHRhciBlbnRyeSBuYW1lcyBhcyBhbiBpbmRlbnRlZCB0cmVlLiBDb2xsYXBzZSBydWxlc1xuICoga2VlcCB0aGUgY2xpcGJvYXJkIGRlbnNlIFdJVEhPVVQgaGlkaW5nIHN0cnVjdHVyZSB0aGUgcHJvdG9jb2wgY2l0ZXNcbiAqIChhIG5haXZlIHNpemUtYmFzZWQgY29sbGFwc2UgZm9sZGVkIHRoZSB3aG9sZSBgLmFnZW50cy9gIHNraWxsIHRyZWUgaW50b1xuICogb25lIG9wYXF1ZSBsaW5lKTpcbiAqICAg4oCiIGEgZGlyZWN0b3J5IGNvbGxhcHNlcyB0byBgZGlyLyAoTiBmaWxlcylgIG9ubHkgd2hlbiBpdCBpcyBGTEFUXG4gKiAgICAgKG5vIHN1YmRpcmVjdG9yaWVzKSBhbmQgaG9sZHMgbW9yZSB0aGFuIGBjb2xsYXBzZUF0YCBmaWxlcyDigJRcbiAqICAgICBzY3JlZW5zaG90cy8sIGltcGVjY2FibGUncyByZWZlcmVuY2UvIOKAlCBvciB3aGVuIGl0IHNpdHMgYXRcbiAqICAgICBgY29sbGFwc2VEZXB0aGAgb3IgZGVlcGVyLCB3aGVyZSBkZXRhaWwgc3RvcHMgcGF5aW5nIGZvciBpdHNlbGY7XG4gKiAgIOKAoiBzdHJ1Y3R1cmVkIGRpcmVjdG9yaWVzIGFyZSBkZXNjZW5kZWQgc28gdGhlaXIgc2tpbGwvbG9jYXRvciBsYXlvdXRcbiAqICAgICBzdGF5cyB2aXNpYmxlLlxuICogT3V0cHV0IGlzIGNhcHBlZCBhdCBgbWF4TGluZXNgIHdpdGggYSBg4oCmICtOIG1vcmVgIHRhaWwgYXMgYSBiYWNrc3RvcC5cbiAqIERldGVybWluaXN0aWM6IGVudHJpZXMgYXJlIHNvcnRlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IHJlbmRlckJ1bmRsZVRyZWUgPSAoZW50cnlOYW1lcywge2NvbGxhcHNlQXQgPSA4LCBjb2xsYXBzZURlcHRoID0gMywgbWF4TGluZXMgPSAxMjB9ID0ge30pID0+IHtcbiAgLy8gQnVpbGQgYSBuZXN0ZWQge2RpcnM6IE1hcCwgZmlsZXM6IFtdfSBzdHJ1Y3R1cmUuXG4gIGNvbnN0IHJvb3ROb2RlID0ge2RpcnM6IG5ldyBNYXAoKSwgZmlsZXM6IFtdfTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFsuLi5lbnRyeU5hbWVzXS5zb3J0KCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5hbWUuc3BsaXQoJy8nKTtcbiAgICBsZXQgbm9kZSA9IHJvb3ROb2RlO1xuICAgIGZvciAoY29uc3QgZGlyIG9mIHBhcnRzLnNsaWNlKDAsIC0xKSkge1xuICAgICAgaWYgKCFub2RlLmRpcnMuaGFzKGRpcikpIG5vZGUuZGlycy5zZXQoZGlyLCB7ZGlyczogbmV3IE1hcCgpLCBmaWxlczogW119KTtcbiAgICAgIG5vZGUgPSBub2RlLmRpcnMuZ2V0KGRpcik7XG4gICAgfVxuICAgIG5vZGUuZmlsZXMucHVzaChwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgY29uc3QgY291bnRGaWxlcyA9IChub2RlKSA9PiBub2RlLmZpbGVzLmxlbmd0aCArIFsuLi5ub2RlLmRpcnMudmFsdWVzKCldLnJlZHVjZSgoYSwgZCkgPT4gYSArIGNvdW50RmlsZXMoZCksIDApO1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBjb25zdCBlbWl0ID0gKG5vZGUsIGRlcHRoKSA9PiB7XG4gICAgY29uc3QgcGFkID0gJyAgJy5yZXBlYXQoZGVwdGgpO1xuICAgIGZvciAoY29uc3QgW2RpciwgY2hpbGRdIG9mIFsuLi5ub2RlLmRpcnMuZW50cmllcygpXS5zb3J0KChbYV0sIFtiXSkgPT4gKGEgPCBiID8gLTEgOiAxKSkpIHtcbiAgICAgIGNvbnN0IHRvdGFsID0gY291bnRGaWxlcyhjaGlsZCk7XG4gICAgICBjb25zdCBmbGF0ID0gY2hpbGQuZGlycy5zaXplID09PSAwO1xuICAgICAgLy8gYGNoaWxkYCByZW5kZXJzIGF0IHRoaXMgYGRlcHRoYCAoZW1pdCdzIGRlcHRoIGlzIHRoZSBwYWQgbGV2ZWwgb2ZcbiAgICAgIC8vIG5vZGUncyBvd24gY2hpbGRyZW4pLlxuICAgICAgaWYgKChmbGF0ICYmIHRvdGFsID4gY29sbGFwc2VBdCkgfHwgZGVwdGggPj0gY29sbGFwc2VEZXB0aCkge1xuICAgICAgICBsaW5lcy5wdXNoKGAke3BhZH0ke2Rpcn0vICgke3RvdGFsfSBmaWxlcylgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmVzLnB1c2goYCR7cGFkfSR7ZGlyfS9gKTtcbiAgICAgICAgZW1pdChjaGlsZCwgZGVwdGggKyAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBmIG9mIG5vZGUuZmlsZXMpIGxpbmVzLnB1c2goYCR7cGFkfSR7Zn1gKTtcbiAgfTtcbiAgZW1pdChyb290Tm9kZSwgMCk7XG4gIGlmIChsaW5lcy5sZW5ndGggPiBtYXhMaW5lcykge1xuICAgIGNvbnN0IGRyb3BwZWQgPSBsaW5lcy5sZW5ndGggLSBtYXhMaW5lcztcbiAgICByZXR1cm4gWy4uLmxpbmVzLnNsaWNlKDAsIG1heExpbmVzKSwgYOKApiArJHtkcm9wcGVkfSBtb3JlYF0uam9pbignXFxuJyk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xufTtcblxuLy8gQnVuZGxlIGZpbGVzIHdob3NlIHByZXNlbmNlIGdhdGVzIGEgbWFuZGF0b3J5LXJlYWQgcGF0aCAvIHByb21wdCBsaW5lLlxuY29uc3QgUElOQ0hHUkFCX1NLSUxMX1BBVEggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbmNvbnN0IFBGRF9TS0lMTF9QQVRIID0gJ3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWQnO1xuY29uc3QgU0tJTExTX0lOREVYX1BBVEggPSAnc2tpbGxzLWluZGV4Lmpzb24nO1xuXG4vLyDilIDilIDilIAgQnVuZGxlIHRva2VuIGFjY291bnRpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBUaGUgYnVuZGxlJ3MgYnl0ZSB3ZWlnaHQgaXMgZG9taW5hdGVkIGJ5IHJlYWQtbGF6aWx5IHNjYWZmb2xkaW5nICh0aGUgfjEuMiBNQlxuLy8gb2YgdmVuZG9yZWQgc2tpbGxzLCBsaWNlbnNlcywgc2NyZWVuc2hvdHMsIGdlbmVyYXRlZCBpbmRleGVzKS4gVGhlIFwic2lnbmFsXCJcbi8vIOKAlCB3aGF0IGFuIGFnZW50IGFjdHVhbGx5IHJlYWRzIGVuZC10by1lbmQgdXAgZnJvbnQg4oCUIGlzIGEgc21hbGwgc3Vic2V0LiBXZVxuLy8gc2hpcCBhIGJ1bmRsZSAuZ2l0aWdub3JlIG1hcmtpbmcgdGhlIGxhenkgc2V0IHNvIHRva2VuIGVzdGltYXRvcnMgZGlzY291bnRcbi8vIGl0LCBhbmQgcmVwb3J0IHNpZ25hbC12cy10b3RhbCBpbiB0aGUgbWFuaWZlc3QuIFRoZSBib290c3RyYXAvQUdFTlQtUFJPVE9DT0xcbi8vIHdhcm5zIHRoZSBhZ2VudCBOT1QgdG8gaG9ub3IgdGhlIGlnbm9yZSB0b28gc3RyaWN0bHkgKG1hcHBlZCBza2lsbHMgYXJlXG4vLyBzdGlsbCByZWFkIG9uIGRlbWFuZCkuXG5cbi8qKiBGaWxlcyB0aGUgYWdlbnQgcmVhZHMgVVAgRlJPTlQg4oCUIHRoZSB0b2tlbiBcInNpZ25hbFwiLiAqL1xuZXhwb3J0IGNvbnN0IFNJR05BTF9QQVRIUyA9IFtcbiAgJ0FHRU5ULVBST1RPQ09MLm1kJywgJ1JFQURNRS5tZCcsICdyZXBhaXItaW5kZXgubWQnLCAnREVTSUdOLm1kJyxcbiAgUElOQ0hHUkFCX1NLSUxMX1BBVEgsIFBGRF9TS0lMTF9QQVRILCBTS0lMTFNfSU5ERVhfUEFUSCxcbl07XG5cbi8qKiBUcnVlIHdoZW4gYG5hbWVgIGlzIHBhcnQgb2YgdGhlIHVwLWZyb250IHJlYWQgKHNpZ25hbCksIG5vdCBsYXp5LiAqL1xuZXhwb3J0IGNvbnN0IGlzU2lnbmFsUGF0aCA9IChuYW1lLCBqc29ubE5hbWUpID0+IG5hbWUgPT09IGpzb25sTmFtZSB8fCBTSUdOQUxfUEFUSFMuaW5jbHVkZXMobmFtZSk7XG5cbi8qKiBnaXRpZ25vcmUtc3ludGF4IGNvbnRlbnQgZm9yIHRoZSBidW5kbGUgcm9vdCDigJQgdGhlIGxhenktcmVhZCBtYW5pZmVzdC4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEJ1bmRsZUlnbm9yZSA9ICgpID0+IFtcbiAgJyMgUGluY2hHcmFiIGJ1bmRsZSBpZ25vcmUg4oCUIGEgdG9rZW4tYWNjb3VudGluZyArIHJlYWQtbGF6aWx5IHNpZ25hbC4nLFxuICAnIycsXG4gICcjIFRoZSBwYXRocyBiZWxvdyBhcmUgTk9UIHBhcnQgb2YgdGhlIHVwLWZyb250IHJlYWQ6IHZlbmRvcmVkIHNraWxscyBhcmUnLFxuICAnIyBjb25zdWx0ZWQgcGVyLWNvbW1lbnQsIHNjcmVlbnNob3RzIHBlci1jb21tZW50LCBsaWNlbnNlcy9pbmRleGVzIG9uJyxcbiAgJyMgcmVmZXJlbmNlLiBUb2tlbiBlc3RpbWF0b3JzIGNhbiBkaXNjb3VudCB0aGVtOyB0aGUgbWFuaWZlc3RcXCdzIGB0b2tlbnNgJyxcbiAgJyMgZmllbGQgcmVwb3J0cyB0aGUgc2lnbmFsICh1cC1mcm9udCkgdnMgdG90YWwgY291bnRzLicsXG4gICcjJyxcbiAgJyMgQUdFTlRTOiBkbyBOT1QgaG9ub3IgdGhpcyB0b28gc3RyaWN0bHkuIEl0IGlzIGEgbGF6eS1yZWFkIGhpbnQsIE5PVCBhJyxcbiAgJyMgbmV2ZXItb3BlbiBydWxlIOKAlCB5b3UgTVVTVCBzdGlsbCByZWFkIHRoZSBza2lsbCBmaWxlcyB5b3UgbWFwIHRvIGVhY2gnLFxuICAnIyBjb21tZW50LCBhbmQgYW55IHNjcmVlbnNob3QgeW91IGFyZSB2ZXJpZnlpbmcgKHNlZSBBR0VOVC1QUk9UT0NPTC5tZCkuJyxcbiAgJycsXG4gICcjIFZlbmRvcmVkIGRlc2lnbiBza2lsbHMgKHJlYWQgdGhlIG9uZXMgeW91IG1hcCBwZXIgY29tbWVudCkuJyxcbiAgJy5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvJyxcbiAgJ3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLycsXG4gICchcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZCcsXG4gICcnLFxuICAnIyBCaW5hcmllcyArIGdlbmVyYXRlZCByZWZlcmVuY2UgKG9wZW4gb24gZGVtYW5kKS4nLFxuICAnc2NyZWVuc2hvdHMvJyxcbiAgJ3BhZ2VzLycsXG4gICdkdWNrZGIuc3FsJyxcbiAgJ3NjaGVtYS5qc29uJyxcbiAgJycsXG4gICcjIFVwc3RyZWFtIGxpY2Vuc2VzIC8gbm90aWNlcy4nLFxuICAnKiovTElDRU5TRScsXG4gICcqKi9OT1RJQ0UnLFxuICAnKiovTk9USUNFLm1kJyxcbiAgJycsXG5dLmpvaW4oJ1xcbicpO1xuXG5jb25zdCBvcmNoZXN0cmF0aW9uVGV4dCA9ICh7d29ya3NwYWNlLCBidW5kbGVJZCwganNvbmxOYW1lfSkgPT5cbiAgYFBIQVNFIG1hcDogZm9yIEVWRVJZIGNvbW1lbnQgcm93IGluICR7anNvbmxOYW1lfSwgZGVjaWRlIHdoaWNoIGJ1bmRsZWQgc2tpbGxzIGFwcGx5IGFuZCBhcHBlbmQgb25lIGNvbW1lbnQgcm93IHRvIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyR7d29ya3NwYWNlfS93b3JrLW1hbmlmZXN0Lmpzb25sIGNhcnJ5aW5nIGEgbWFwcGVkX3NraWxscyBmaWVsZCB3aG9zZSBlbnRyaWVzIGFyZSBsb2NhdG9ycyDigJQgcGF0aHMgcmVsYXRpdmUgdG8gdGhlIGV4dHJhY3Rpb24gcm9vdCAoZS5nLiAuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS88ZmlsZT4ubWQsICR7UEZEX1NLSUxMX1BBVEh9LCAke1BJTkNIR1JBQl9TS0lMTF9QQVRIfTsgdGhlIGZ1bGwgaW5kZXggaXMgJHtTS0lMTFNfSU5ERVhfUEFUSH0pLiBUaGUgZXhwb3J0IHByZS1zZWVkcyBoZXVyaXN0aWMgc3VnZ2VzdGVkU2tpbGxzIG9uIGVhY2ggZmVlZGJhY2sgcm93OyB2ZXJpZnkgYW5kIGNvcnJlY3QgdGhlbSwgZG8gbm90IHRydXN0IHRoZW0gYmxpbmRseS4gYCArXG4gIGBQSEFTRSBwbGFuOiBmYW4gb3V0IG9uZSBiYWNrZ3JvdW5kIGF0b21pYyBzdWJhZ2VudCBwZXIgY29tbWVudDsgcGFzcyBlYWNoIHN1YmFnZW50IGEgc3RhbmRhbG9uZSBKU09OTCBzdWJpbnN0cnVjdGlvbiAodGVtcGxhdGUgaW4gQUdFTlQtUFJPVE9DT0wubWQpIGNvbnRhaW5pbmcgdGhlIGZ1bGwgY29tbWVudCByb3csIGl0cyBwYXJlbnQgc2VsZWN0b3Igcm93LCB0aGUgYnVuZGxlIG1hbmlmZXN0IGxpbmUsIGFuZCB0aGUgRlVMTCBURVhUIG9mIGV2ZXJ5IG1hcHBlZCBza2lsbCBwcm9tcHQ7IGVhY2ggc3ViYWdlbnQgdXNlcyB5b3VyIC9wbGFuIChwbGFubmluZykgY2FwYWJpbGl0eSBmb3IgaXRzIHBoYXNlIGFuZCByZXR1cm5zIGEgcGxhbiwgc2F2ZWQgdG8gcGxhbnMvJHtidW5kbGVJZH0vPEZFRURCQUNLX1VJRD4ucGxhbi5tZDsgZWFjaCBzdWJhZ2VudCBhbHNvIHBvbGlzaGVzIGl0cyBwbGFuIHdpdGggL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbC4gYCArXG4gIGBQSEFTRSBpbXBsZW1lbnQ6IFlPVSDigJQgdGhlIGZvcmVncm91bmQgYWdlbnQgdGhlIG9wZXJhdG9yIHBhc3RlZCB0aGlzIHByb21wdCBpbnRvIOKAlCBkbyBhbGwgaW1wbGVtZW50YXRpb24sIHRlc3QgZGV2ZWxvcG1lbnQsIHRlc3RpbmcsIGFuZCBpdGVyYXRpb24gaW4gPFBST0pFQ1RfUk9PVD47IHN1YmFnZW50cyBvbmx5IHBsYW4uIFBvbGlzaCB0aGUgaW1wbGVtZW50ZWQgcmVzdWx0IHdpdGggL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbC4gYCArXG4gIGBQSEFTRSBhdWRpdDogc2VuZCB0aGUgY29tYmluZWQgcGxhbnMgKyBpbXBsZW1lbnRhdGlvbiBmb3IgYSBibGluZCBhdG9taWMgJ3JvYXN0JyBwZWVyIHJldmlldyBvZiBCT1RIIHBsYW4gYW5kIGltcGxlbWVudGF0aW9uLCB1c2luZyB3aGF0ZXZlciBvdGhlci1hZ2VudCBwZWVyLXJldmlldyBza2lsbHMgZXhpc3QgaW4gWU9VUiBPV04gZW52aXJvbm1lbnQ7IHdyaXRlIGl0IHRvIGF1ZGl0cy8ke2J1bmRsZUlkfS88cnVuSWQ+LXJvYXN0Lm1kIGFuZCBhZGRyZXNzIGV2ZXJ5IGJsb2NrZXIuIGAgK1xuICBgUEhBU0UgdmVyaWZ5OiBzZWUgdGhlICd2ZXJpZnknIGxpbmUuIGAgK1xuICBgREVHUkFEQVRJT04gUlVMRTogaWYgeW91IGNhbm5vdCBzcGF3biBzdWJhZ2VudHMsIG9yIGxhY2sgYSAvcGxhbiwgL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLCBvciByb2FzdCBjYXBhYmlsaXR5LCBwZXJmb3JtIHRoZSBzYW1lIHBoYXNlcyB5b3Vyc2VsZiBTRVJJQUxMWSBpbiB0aGlzIGV4YWN0IG9yZGVyIOKAlCBuZXZlciBza2lwIGEgcGhhc2UuIGAgK1xuICBgU0tJTExTIFJVTEU6IHRoZSBidW5kbGVkIHNraWxscyBhcmUgZm9yIHRoaXMgam9iIG9ubHkg4oCUIHJlYWQgdGhlbSBmcm9tIHRoZSBleHRyYWN0aW9uIGRpcmVjdG9yeTsgdGhlcmUgaXMgTk8gbmVlZCB0byBpbnN0YWxsIHRoZW0gcGVybWFuZW50bHksIGFuZCB5b3UgbXVzdCBOT1Qgb3ZlcndyaXRlIHlvdXIgb3duIHBlcnNpc3RlbnQgc2tpbGxzLCBhZ2VudCBjb25maWcsIG9yIGRvdGZpbGVzLmA7XG5cbmNvbnN0IHZlcmlmeVRleHQgPSAoe3dvcmtzcGFjZSwgeERpciwganNvbmxOYW1lfSkgPT5cbiAgYEZpbmFsIHZlcmlmaWNhdGlvbiBwYXNzLCBvbmx5IGFmdGVyIGltcGxlbWVudGF0aW9uIGFuZCBhdWRpdDogc3RhcnQgdGhlIHByb2R1Y3QgbG9jYWxseSwgdGhlbiBydW46IG5weCAteSBwaW5jaGdyYWIgcmVjYXB0dXJlICR7eERpcn0vJHtqc29ubE5hbWV9IDxBUFBfVVJMPiAtLXdvcmtzcGFjZS1kaXIgfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvJHt3b3Jrc3BhY2V9ICh1c2UgYnVueCBpZiBucHggaXMgdW5hdmFpbGFibGUpLiBUaGlzIHJlLWxvY2F0ZXMgZXZlcnkgY29tbWVudGVkIHNlbGVjdG9yIHdpdGggUGluY2hHcmFiJ3Mgb3duIENTUy0+WFBhdGgtPmExMXkgY2hhaW4sIHNjcmVlbnNob3RzIGVhY2ggZWxlbWVudCwgYW5kIHdyaXRlcyBhbiBhcHBlbmQtb25seSBydW4gdW5kZXIgcmVjYXB0dXJlcy88cnVuSWQ+Ly4gUmVhZCBlYWNoIHJlY2FwdHVyZWQgUE5HIG5leHQgdG8gaXRzIG9yaWdpbmFsIGluICR7eERpcn0vc2NyZWVuc2hvdHMvIGFuZCBjb25maXJtIGV2ZXJ5IGNvbW1lbnQgaXMgdmlzaWJseSByZXNvbHZlZDsgdGhlbiB1cGRhdGUgdGhlIG1hdGNoaW5nIHdvcmstbWFuaWZlc3QuanNvbmwgcm93cyB0byBzdGF0dXMgZG9uZSwgb3IgYmxvY2tlZCB3aXRoIGEgcmVhc29uLmA7XG5cbmNvbnN0IGRvbmVUZXh0ID0gKHtidW5kbGVJZH0pID0+XG4gIGBZb3UgYXJlIGZpbmlzaGVkIHdoZW4gZXZlcnkgY29tbWVudCBoYXMgYSB3b3JrLW1hbmlmZXN0Lmpzb25sIHJvdyB3aXRoIHN0YXR1cyBkb25lIG9yIGJsb2NrZWQsIHBsYW5zLyR7YnVuZGxlSWR9LyBob2xkcyBvbmUgcGxhbiBwZXIgY29tbWVudCwgYXVkaXRzLyR7YnVuZGxlSWR9LyBob2xkcyBhdCBsZWFzdCBvbmUgcm9hc3QsIGFuZCB0aGUgbGF0ZXN0IHJlY2FwdHVyZSBydW4gbG9jYXRlcyBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3IuIHdvcmstbWFuaWZlc3QuanNvbmwgaXMgYXBwZW5kLW9ubHk6IGFkZCByb3dzLCBuZXZlciByZXdyaXRlIGhpc3RvcnkuYDtcblxuY29uc3Qgd2FybmluZ1RleHQgPVxuICAnVGhlIGJ1bmRsZWQgREVTSUdOLm1kIGlzIFBpbmNoR3JhYlxcJ3MgYmFyZSBzdG9jayB0ZW1wbGF0ZSDigJQgdGhlIG9wZXJhdG9yIGRpZCBub3QgY3VzdG9taXplIGl0LiBEbyBOT1QgdHJlYXQgaXQgYXMgcHJvZHVjdCBjYW5vbi4gUHJlZmVyIGEgbW9yZSBhcHBsaWNhYmxlIGNhbm9uaWNhbCBkZXNpZ24gc291cmNlIGlmIG9uZSBleGlzdHMgZm9yIHRoaXMgcHJvZHVjdCAoc2VhcmNoIDxQUk9KRUNUX1JPT1Q+IGZvciBERVNJR04ubWQsIGRvY3MvZGVzaWduKiwgYnJhbmQvIG9yIHN0eWxlLWd1aWRlIGZpbGVzKSBhbmQgdXNlIHRoZSBidW5kbGVkIHRlbXBsYXRlIG9ubHkgYXMgYSBnZW5lcmljIGNoZWNrbGlzdC4nO1xuXG4vKipcbiAqIFRoZSBuaW5lLWxpbmUgU2VuZC10by1BZ2VudCBjbGlwYm9hcmQgcGF5bG9hZC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0c1xuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMud29ya3NwYWNlXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5idW5kbGVJZCAgICAgICAxNi1oZXggY29udGVudCBoYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5hcmNoaXZlUGF0aCAgICBhYnNvbHV0ZSBwYXRoIG9mIHRoZSBzYXZlZCAudGFyLnpzdFxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuZXhwb3J0VHMgICAgICAgSVNPIHRpbWVzdGFtcCAodGhlIGV4cG9ydCBjbG9jaylcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmpzb25sTmFtZSAgICAgIHRoZSBidW5kbGUncyBKU09OTCBlbnRyeSBuYW1lXG4gKiBAcGFyYW0ge3tjb21tZW50czogbnVtYmVyLCBzZWxlY3RvcnM6IG51bWJlciwgcGFnZXM6IG51bWJlciwgc2NyZWVuc2hvdHM6IG51bWJlcn19IG9wdHMuY291bnRzXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBvcHRzLmVudHJ5TmFtZXMgICBldmVyeSB0YXIgZW50cnkgbmFtZSBpbiB0aGUgYnVuZGxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG9wdHMuZGVzaWduSXNUZW1wbGF0ZVxuICogQHJldHVybnMge3N0cmluZ30gbmV3bGluZS1qb2luZWQgSlNPTkwgKG5vIHRyYWlsaW5nIG5ld2xpbmUpXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEFnZW50UHJvbXB0SnNvbmwgPSAob3B0cykgPT4ge1xuICBjb25zdCB7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGgsIGV4cG9ydFRzLCBqc29ubE5hbWUsIGNvdW50cywgZW50cnlOYW1lcywgZGVzaWduSXNUZW1wbGF0ZX0gPSBvcHRzO1xuICBjb25zdCB4RGlyID0gZXh0cmFjdERpcih3b3Jrc3BhY2UsIGJ1bmRsZUlkKTtcbiAgY29uc3QgaGFzID0gKG5hbWUpID0+IGVudHJ5TmFtZXMuaW5jbHVkZXMobmFtZSk7XG4gIGNvbnN0IGxpbmVzID0gW107XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdjogMSwgdHlwZTogJ3BpbmNoZ3JhYi1zZW5kLXRvLWFnZW50JywgdG9vbDogJ3BpbmNoZ3JhYicsXG4gICAgd29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZTogYXJjaGl2ZVBhdGgsIGdlbmVyYXRlZDogZXhwb3J0VHMsXG4gICAgY291bnRzOiB7Y29tbWVudHM6IGNvdW50cy5jb21tZW50cywgc2VsZWN0b3JzOiBjb3VudHMuc2VsZWN0b3JzLCBwYWdlczogY291bnRzLnBhZ2VzLCBzY3JlZW5zaG90czogY291bnRzLnNjcmVlbnNob3RzfSxcbiAgICBkZXNpZ25Jc1N0b2NrVGVtcGxhdGU6IGRlc2lnbklzVGVtcGxhdGUsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdpbnN0cnVjdGlvbicsXG4gICAgdGV4dDogYFlvdSBoYXZlIGJlZW4gaGFuZGVkIGEgUGluY2hHcmFiIGZlZWRiYWNrIGJ1bmRsZTogJHtjb3VudHMuY29tbWVudHN9IG9wZXJhdG9yIGNvbW1lbnRzIHBpbm5lZCB0byBsaXZlIFVJIGVsZW1lbnRzIG9mIHRoZSBwcm9kdWN0IGJ1aWx0IGZyb20gPFBST0pFQ1RfUk9PVD4gKGluZmVyIDxQUk9KRUNUX1JPT1Q+IGZyb20geW91ciBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5OyBpZiBhbWJpZ3VvdXMsIGFzayBiZWZvcmUgZWRpdGluZykuIERvIHRoaXMgbm93LCBpbiBvcmRlcjogKDEpIGV4ZWN1dGUgdGhlIGJhc2ggc2NyaXB0IGluIHRoZSBuZXh0ICdib290c3RyYXAnIGxpbmUgZXhhY3RseSBhcyB3cml0dGVuIChpdHMgJ3NjcmlwdCcgZmllbGQgaXMgYSBKU09OLWVzY2FwZWQgcGxhaW4gYmFzaCBzY3JpcHQ7IGl0IHNlbGYtbm9ybWFsaXplcyB+IGFuZCBXaW5kb3dzIGRyaXZlIHBhdGhzIGZvciBXU0wvR2l0LUJhc2gpOyAoMikgcmVhZCBFVkVSWSBmaWxlIGxpc3RlZCBpbiB0aGUgJ2ZpbGVzJyBsaW5lIGZ1bGx5IGludG8gY29udGV4dDsgKDMpIGZvbGxvdyBBR0VOVC1QUk9UT0NPTC5tZCB0byBtYXAsIHBsYW4sIGltcGxlbWVudCwgdGVzdCwgYXVkaXQsIGFuZCB2ZXJpZnkgYSBmaXggZm9yIGV2ZXJ5IGNvbW1lbnQuYCxcbiAgfSk7XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ2Jvb3RzdHJhcCcsIGxhbmc6ICdiYXNoJywgaWRlbXBvdGVudDogdHJ1ZSxcbiAgICBzY3JpcHQ6IGJ1aWxkQm9vdHN0cmFwU2NyaXB0KHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aCwgZXhwb3J0VHN9KSxcbiAgfSk7XG5cbiAgY29uc3QgcGF0aHMgPSBbXG4gICAgYEAke3hEaXJ9L0FHRU5ULVBST1RPQ09MLm1kYCxcbiAgICBgQCR7eERpcn0vUkVBRE1FLm1kYCxcbiAgICBgQCR7eERpcn0vcmVwYWlyLWluZGV4Lm1kYCxcbiAgICBgQCR7eERpcn0vJHtqc29ubE5hbWV9YCxcbiAgXTtcbiAgaWYgKGhhcygnREVTSUdOLm1kJykpIHBhdGhzLnB1c2goYEAke3hEaXJ9L0RFU0lHTi5tZGApO1xuICBpZiAoaGFzKFBJTkNIR1JBQl9TS0lMTF9QQVRIKSkgcGF0aHMucHVzaChgQCR7eERpcn0vJHtQSU5DSEdSQUJfU0tJTExfUEFUSH1gKTtcbiAgaWYgKGhhcyhQRkRfU0tJTExfUEFUSCkpIHBhdGhzLnB1c2goYEAke3hEaXJ9LyR7UEZEX1NLSUxMX1BBVEh9YCk7XG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdmaWxlcycsIHJlYWRGdWxseTogdHJ1ZSwgbm9HcmVwOiB0cnVlLFxuICAgIHJ1bGU6ICdSZWFkIGVhY2ggcGF0aCBiZWxvdyBFTkQtVE8tRU5EIHdpdGggeW91ciBmaWxlLXJlYWRpbmcgdG9vbC4gVGhpcyBpcyBOT04tT1BUSU9OQUwuIERvIE5PVCBncmVwIHRoZW0sIGRvIE5PVCBoZWFkL3RhaWwgdGhlbSwgZG8gTk9UIHNhbXBsZSBsaW5lIHJhbmdlcyDigJQgZnVsbCBjb250ZW50cyBpbnRvIGNvbnRleHQuIFNjcmVlbnNob3RzIGFuZCB0aGUgaW1wZWNjYWJsZSByZWZlcmVuY2UgZmlsZXMgYXJlIHJlYWQgcGVyLWNvbW1lbnQgbGF0ZXIsIGFzIEFHRU5ULVBST1RPQ09MLm1kIGRpcmVjdHMuJyxcbiAgICBwYXRocyxcbiAgfSk7XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ3RyZWUnLCByb290OiB4RGlyLCBlbnRyaWVzOiBlbnRyeU5hbWVzLmxlbmd0aCxcbiAgICB0ZXh0OiByZW5kZXJCdW5kbGVUcmVlKGVudHJ5TmFtZXMpLFxuICB9KTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnb3JjaGVzdHJhdGlvbicsXG4gICAgcGhhc2VzOiBbJ21hcCcsICdwbGFuJywgJ2ltcGxlbWVudCcsICdhdWRpdCcsICd2ZXJpZnknXSxcbiAgICB0ZXh0OiBvcmNoZXN0cmF0aW9uVGV4dCh7d29ya3NwYWNlLCBidW5kbGVJZCwganNvbmxOYW1lfSksXG4gIH0pO1xuXG4gIGlmIChkZXNpZ25Jc1RlbXBsYXRlKSB7XG4gICAgbGluZXMucHVzaCh7dHlwZTogJ3dhcm5pbmcnLCBjb2RlOiAnREVTSUdOX01EX0lTX1NUT0NLX1RFTVBMQVRFJywgdGV4dDogd2FybmluZ1RleHR9KTtcbiAgfVxuXG4gIGxpbmVzLnB1c2goe3R5cGU6ICd2ZXJpZnknLCB0ZXh0OiB2ZXJpZnlUZXh0KHt3b3Jrc3BhY2UsIHhEaXIsIGpzb25sTmFtZX0pfSk7XG4gIGxpbmVzLnB1c2goe3R5cGU6ICdkb25lJywgdGV4dDogZG9uZVRleHQoe2J1bmRsZUlkfSl9KTtcblxuICByZXR1cm4gbGluZXMubWFwKChsKSA9PiBKU09OLnN0cmluZ2lmeShsKSkuam9pbignXFxuJyk7XG59O1xuXG4vKipcbiAqIEFHRU5ULVBST1RPQ09MLm1kIOKAlCB0aGUgaW4tYnVuZGxlIGV4cGFuc2lvbiBvZiB0aGUgY2xpcGJvYXJkIGRvY3RyaW5lLlxuICogc2tpbGxzSW5kZXggaXMgdGhlIHBhcnNlZCBza2lsbHMtaW5kZXguanNvbiAob3IgbnVsbCB3aGVuIHNraWxscyB3ZXJlbid0XG4gKiBidW5kbGVkKTsgdXNlZCB0byBoeWRyYXRlIHRoZSBza2lsbCBpbnZlbnRvcnkgdGFibGUuXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZEFnZW50UHJvdG9jb2xNZCA9IChvcHRzKSA9PiB7XG4gIGNvbnN0IHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBleHBvcnRUcywganNvbmxOYW1lLCBjb3VudHMsIGVudHJ5TmFtZXMsIGRlc2lnbklzVGVtcGxhdGUsIHNraWxsc0luZGV4fSA9IG9wdHM7XG4gIGNvbnN0IHhEaXIgPSBleHRyYWN0RGlyKHdvcmtzcGFjZSwgYnVuZGxlSWQpO1xuICBjb25zdCByb290ID0gd29ya3NwYWNlUm9vdCh3b3Jrc3BhY2UpO1xuICBjb25zdCBoYXMgPSAobmFtZSkgPT4gZW50cnlOYW1lcy5pbmNsdWRlcyhuYW1lKTtcbiAgY29uc3Qgb3V0ID0gW107XG5cbiAgb3V0LnB1c2goJyMgQUdFTlQtUFJPVE9DT0wubWQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaChgV29ya3NwYWNlOiBcXGAke3dvcmtzcGFjZX1cXGAgwrcgQnVuZGxlOiBcXGAke2J1bmRsZUlkfVxcYCDCtyBHZW5lcmF0ZWQ6ICR7ZXhwb3J0VHN9YCk7XG4gIG91dC5wdXNoKGBDb3VudHM6ICoqJHtjb3VudHMuY29tbWVudHN9KiogY29tbWVudHMgwrcgKioke2NvdW50cy5zZWxlY3RvcnN9Kiogc2VsZWN0b3JzIMK3ICoqJHtjb3VudHMucGFnZXN9KiogcGFnZXMgwrcgKioke2NvdW50cy5zY3JlZW5zaG90c30qKiBzY3JlZW5zaG90c2ApO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdUaGlzIGZpbGUgaXMgdGhlIGZ1bGwgd29ya2luZyBkb2N0cmluZSBmb3IgdGhlIGNvZGluZyBhZ2VudCBoYW5kZWQgdGhpcycpO1xuICBvdXQucHVzaCgnYnVuZGxlLiBUaGUgb3BlcmF0b3JcXCdzIGNsaXBib2FyZCBwcm9tcHQgKEpTT05MKSBpcyBhIGNvbXBhY3QgYm9vdHN0cmFwIG9mJyk7XG4gIG91dC5wdXNoKCd0aGUgc2FtZSBjb250ZW50IOKAlCBpZiB5b3Ugb25seSBoYXZlIHRoaXMgYXJjaGl2ZSwgZXZlcnl0aGluZyB5b3UgbmVlZCBpcycpO1xuICBvdXQucHVzaCgnaGVyZS4gVG9rZW5zIGluIGA8QU5HTEVfQlJBQ0tFVFM+YCBhcmUgeW91cnMgdG8gaW5mZXI6IGA8UFJPSkVDVF9ST09UPmAgaXMnKTtcbiAgb3V0LnB1c2goJ3RoZSBwcm9kdWN0XFwncyByZXBvc2l0b3J5ICh1c3VhbGx5IHlvdXIgd29ya2luZyBkaXJlY3RvcnkpLCBgPEFQUF9VUkw+YCBpcycpO1xuICBvdXQucHVzaCgndGhlIGxvY2FsbHkgcnVubmluZyBwcm9kdWN0LCBgPEZFRURCQUNLX1VJRD5gL2A8cnVuSWQ+YCBhcmUgcGVyLWl0ZW0gaWRzLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyAwIMK3IEJvb3RzdHJhcCAoaWRlbXBvdGVudCknKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnSWYgYCcgKyB4RGlyICsgJ2AgZG9lcyBub3QgZXhpc3QgeWV0LCBydW4gdGhlIHNjcmlwdCBiZWxvdyB3aXRoJyk7XG4gIG91dC5wdXNoKCdgPEFSQ0hJVkVfUEFUSD5gIHJlcGxhY2VkIGJ5IHRoZSBhYnNvbHV0ZSBwYXRoIG9mIHRoaXMgYnVuZGxlXFwncyBgLnRhci56c3RgJyk7XG4gIG91dC5wdXNoKCcod2hlbiB5b3UgYXJlIHJlYWRpbmcgdGhpcyBmcm9tIHRoZSBleHRyYWN0ZWQgYXJjaGl2ZSwgdGhhdCBzdGVwIGFscmVhZHknKTtcbiAgb3V0LnB1c2goJ2hhcHBlbmVkIOKAlCByZS1ydW5uaW5nIGlzIGEgc2FmZSBuby1vcCkuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYGJhc2gnKTtcbiAgb3V0LnB1c2goYnVpbGRCb290c3RyYXBTY3JpcHQoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmVQYXRoOiAnPEFSQ0hJVkVfUEFUSD4nLCBleHBvcnRUc30pKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyAxIMK3IFBlcnNpc3RlbnQgd29ya3NwYWNlIGxheW91dCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdBbGwgUGluY2hHcmFiIHdvcmsgc3RhdGUgbGl2ZXMgdW5kZXIgdGhlIHBlcnNpc3RlbmNlIHJvb3Qg4oCUIGtlZXAgeW91cicpO1xuICBvdXQucHVzaCgncGxhbm5pbmcgYXJ0aWZhY3RzIHRoZXJlIGFuZCBrZWVwIHRoZSB3b3JrIG1hbmlmZXN0IHVwZGF0ZWQ6Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaChgJHtyb290fS9gKTtcbiAgb3V0LnB1c2goJyAgd29yay1tYW5pZmVzdC5qc29ubCAgICAgICAgICAgICAgIyBhcHBlbmQtb25seSBhZ2VudCBzdGF0ZSBsZWRnZXInKTtcbiAgb3V0LnB1c2goJyAgYnVuZGxlcy8nKTtcbiAgb3V0LnB1c2goYCAgICAke2J1bmRsZUlkfS9gKTtcbiAgb3V0LnB1c2goJyAgICAgIGJ1bmRsZS50YXIuenN0ICAgICAgICAgICAgICAgIyBjb3B5IG9mIHRoZSBvcmlnaW5hbCBhcmNoaXZlJyk7XG4gIG91dC5wdXNoKCcgICAgICAuZXh0cmFjdGVkICAgICAgICAgICAgICAgICAgICMgZ3VhcmQgbWFya2VyIChjb250YWlucyB0aGUgYnVuZGxlSWQpJyk7XG4gIG91dC5wdXNoKCcgICAgICBleHRyYWN0ZWQvICAgICAgICAgICAgICAgICAgICMgdGFyIG91dHB1dCDigJQgdHJlYXQgYXMgSU1NVVRBQkxFIGlucHV0Jyk7XG4gIG91dC5wdXNoKCcgIHBsYW5zLycpO1xuICBvdXQucHVzaChgICAgICR7YnVuZGxlSWR9LzxGRUVEQkFDS19VSUQ+LnBsYW4ubWRgKTtcbiAgb3V0LnB1c2goJyAgYXVkaXRzLycpO1xuICBvdXQucHVzaChgICAgICR7YnVuZGxlSWR9LzxydW5JZD4tcm9hc3QubWRgKTtcbiAgb3V0LnB1c2goJyAgcmVjYXB0dXJlcy8nKTtcbiAgb3V0LnB1c2goJyAgICA8cnVuSWQ+LyAgICAgICAgICAgICAgICAgICAgICAgIyBhcHBlbmQtb25seTsgbmV2ZXIgcmV1c2UgYSBydW5JZCcpO1xuICBvdXQucHVzaCgnICAgICAgcmVjYXB0dXJlLW1hbmlmZXN0Lmpzb25sJyk7XG4gIG91dC5wdXNoKCcgICAgICBzY3JlZW5zaG90cy88dWlkPi5wbmcnKTtcbiAgb3V0LnB1c2goJ2BgYCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgd29yay1tYW5pZmVzdC5qc29ubGAgcm93cyAoYXBwZW5kLW9ubHk7IHJlZHVjZXJzIGdyb3VwIGJ5Jyk7XG4gIG91dC5wdXNoKCdgKGJ1bmRsZUlkLCBmZWVkYmFja1VpZClgIGFuZCB0aGUgTEFTVCByb3cgd2lucyDigJQgYWNjcmV0ZSwgbmV2ZXIgcmV3cml0ZSk6Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYGpzb25jJyk7XG4gIG91dC5wdXNoKCcvLyB3cml0dGVuIG9uY2UgYnkgdGhlIGJvb3RzdHJhcCcpO1xuICBvdXQucHVzaChge1widlwiOjEsXCJ0eXBlXCI6XCJ3b3JrLW1hbmlmZXN0LWhlYWRlclwiLFwidG9vbFwiOlwicGluY2hncmFiXCIsXCJ3b3Jrc3BhY2VcIjpcIiR7d29ya3NwYWNlfVwiLFwiY3JlYXRlZFwiOlwiJHtleHBvcnRUc31cIn1gKTtcbiAgb3V0LnB1c2goJy8vIG9uZSBwZXIgY29tbWVudCwgYXBwZW5kZWQgZWFjaCB0aW1lIGl0cyBzdGF0ZSBhZHZhbmNlcycpO1xuICBvdXQucHVzaChge1widlwiOjEsXCJ0eXBlXCI6XCJjb21tZW50XCIsXCJidW5kbGVJZFwiOlwiJHtidW5kbGVJZH1cIixcImZlZWRiYWNrVWlkXCI6XCI8RkVFREJBQ0tfVUlEPlwiLFwicGFyZW50VWlkXCI6XCI8c2VsZWN0b3IgdWlkPlwiLFwic2VsZWN0b3JcIjpcIjxjc3M+XCIsXCJtYXBwZWRfc2tpbGxzXCI6W3tcInNraWxsXCI6XCI8aWQgZnJvbSBza2lsbHMtaW5kZXguanNvbj5cIixcImxvY2F0b3JcIjpcIjxwYXRoIHJlbGF0aXZlIHRvIGV4dHJhY3Rpb24gcm9vdD5cIn1dLFwic3RhdHVzXCI6XCJtYXBwZWR8cGxhbm5lZHxpbi1wcm9ncmVzc3xkb25lfGJsb2NrZWRcIixcInBsYW5cIjpcInBsYW5zLyR7YnVuZGxlSWR9LzxGRUVEQkFDS19VSUQ+LnBsYW4ubWRcIixcIm5vdGVzXCI6XCI8c2hvcnQ+XCIsXCJ0c1wiOlwiPElTTz5cIn1gKTtcbiAgb3V0LnB1c2goJy8vIGFwcGVuZGVkIGJ5IGBwaW5jaGdyYWIgcmVjYXB0dXJlYCBydW5zJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcInJlY2FwdHVyZS1ydW5cIixcInJ1bklkXCI6XCI8cnVuSWQ+XCIsXCJ0c1wiOlwiPElTTz5cIixcImJ1bmRsZUlkXCI6XCIke2J1bmRsZUlkfVwiLFwibG9jYXRlZFwiOjAsXCJ0b3RhbFwiOjB9YCk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgMiDCtyBSZWFkIG9yZGVyIChub24tb3B0aW9uYWwsIGZ1bGwgcmVhZHMsIG5vIGdyZXApJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1JlYWQgZWFjaCBvZiB0aGVzZSBFTkQtVE8tRU5EIGJlZm9yZSBhbnkgb3RoZXIgYWN0aW9uLiBEbyBub3QgZ3JlcCwgaGVhZCwnKTtcbiAgb3V0LnB1c2goJ3RhaWwsIG9yIHNhbXBsZSBsaW5lIHJhbmdlcyDigJQgZnVsbCBjb250ZW50cyBpbnRvIGNvbnRleHQ6Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goYDEuIFxcYCR7eERpcn0vQUdFTlQtUFJPVE9DT0wubWRcXGAgKHRoaXMgZmlsZSlgKTtcbiAgb3V0LnB1c2goYDIuIFxcYCR7eERpcn0vUkVBRE1FLm1kXFxgYCk7XG4gIG91dC5wdXNoKGAzLiBcXGAke3hEaXJ9L3JlcGFpci1pbmRleC5tZFxcYGApO1xuICBvdXQucHVzaChgNC4gXFxgJHt4RGlyfS8ke2pzb25sTmFtZX1cXGBgKTtcbiAgaWYgKGhhcygnREVTSUdOLm1kJykpIG91dC5wdXNoKGA1LiBcXGAke3hEaXJ9L0RFU0lHTi5tZFxcYGApO1xuICBpZiAoaGFzKFBJTkNIR1JBQl9TS0lMTF9QQVRIKSkgb3V0LnB1c2goYDYuIFxcYCR7eERpcn0vJHtQSU5DSEdSQUJfU0tJTExfUEFUSH1cXGBgKTtcbiAgaWYgKGhhcyhQRkRfU0tJTExfUEFUSCkpIG91dC5wdXNoKGA3LiBcXGAke3hEaXJ9LyR7UEZEX1NLSUxMX1BBVEh9XFxgYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1NjcmVlbnNob3RzIChgc2NyZWVuc2hvdHMvYCwgaW5kZXhlZCBieSBgc2NyZWVuc2hvdHMuanNvbmApIGFuZCB0aGUnKTtcbiAgb3V0LnB1c2goJ2ltcGVjY2FibGUgcmVmZXJlbmNlIGZpbGVzIGFyZSByZWFkIHBlci1jb21tZW50IGR1cmluZyB0aGUgcGhhc2VzIGJlbG93LicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdUaGUgYnVuZGxlIHNoaXBzIGEgYC5naXRpZ25vcmVgIG1hcmtpbmcgdGhhdCBsYXp5IHNldCAoc2tpbGxzLCBzY3JlZW5zaG90cywnKTtcbiAgb3V0LnB1c2goJ2xpY2Vuc2VzLCBpbmRleGVzKSBzbyB0b2tlbiBlc3RpbWF0b3JzIGNhbiBkaXNjb3VudCBpdCDigJQgdGhlIG1hbmlmZXN0XFwncycpO1xuICBvdXQucHVzaCgnYHRva2Vuc2AgZmllbGQgcmVwb3J0cyB0aGUgdXAtZnJvbnQgYHNpZ25hbGAgdnMgYHRvdGFsYC4gKipEbyBOT1QgaG9ub3IgdGhlJyk7XG4gIG91dC5wdXNoKCcuZ2l0aWdub3JlIHRvbyBzdHJpY3RseToqKiBpdCBpcyBhIHJlYWQtbGF6aWx5IGhpbnQsIG5vdCBhIG5ldmVyLW9wZW4gcnVsZS4nKTtcbiAgb3V0LnB1c2goJ1lvdSBNVVNUIHN0aWxsIHJlYWQgZXZlcnkgc2tpbGwgZmlsZSB5b3UgbWFwIHRvIGEgY29tbWVudCwgYW5kIGFueScpO1xuICBvdXQucHVzaCgnc2NyZWVuc2hvdCB5b3UgdmVyaWZ5LicpO1xuICBvdXQucHVzaCgnJyk7XG4gIGlmIChkZXNpZ25Jc1RlbXBsYXRlKSB7XG4gICAgb3V0LnB1c2goJz4gKipXQVJOSU5HIOKAlCBERVNJR05fTURfSVNfU1RPQ0tfVEVNUExBVEUuKiogJyArIHdhcm5pbmdUZXh0KTtcbiAgICBvdXQucHVzaCgnJyk7XG4gIH1cbiAgb3V0LnB1c2goJyMjIDMgwrcgQnVuZGxlZCBza2lsbHMnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnVGhlIGJ1bmRsZWQgc2tpbGxzIGFyZSBmb3IgdGhpcyBqb2Igb25seTogcmVhZCB0aGVtIGZyb20gdGhlIGV4dHJhY3Rpb24nKTtcbiAgb3V0LnB1c2goJ2RpcmVjdG9yeS4gVGhlcmUgaXMgTk8gbmVlZCB0byBpbnN0YWxsIHRoZW0gcGVybWFuZW50bHksIGFuZCB5b3UgbXVzdCcpO1xuICBvdXQucHVzaCgnTk9UIG92ZXJ3cml0ZSB5b3VyIG93biBwZXJzaXN0ZW50IHNraWxscywgYWdlbnQgY29uZmlnLCBvciBkb3RmaWxlcy4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBpZiAoc2tpbGxzSW5kZXggJiYgQXJyYXkuaXNBcnJheShza2lsbHNJbmRleC5za2lsbHMpICYmIHNraWxsc0luZGV4LnNraWxscy5sZW5ndGgpIHtcbiAgICAvLyBUYWJsZS1jZWxsIHNhbml0aXplciBmb3Igc2VtaS10cnVzdGVkIGluZGV4IHN0cmluZ3MgKHB1cnBvc2VzIGNvbWVcbiAgICAvLyBmcm9tIHZlbmRvcmVkIHVwc3RyZWFtIGZyb250bWF0dGVyKTogZXNjYXBlIHRoZSBlc2NhcGUgY2hhcmFjdGVyXG4gICAgLy8gRklSU1QsIHRoZW4gdGhlIGNlbGwgZGVsaW1pdGVyLCBhbmQgZmxhdHRlbiBuZXdsaW5lcyDigJQgb3RoZXJ3aXNlIGFcbiAgICAvLyBjcmFmdGVkIHB1cnBvc2UgY291bGQgYnJlYWsgb3V0IG9mIGl0cyBjZWxsIGFuZCBpbmplY3Qgcm93cyBpbnRvIGFcbiAgICAvLyBkb2N1bWVudCBhZ2VudHMgdHJlYXQgYXMgZG9jdHJpbmUgKENvZGVRTCBqcy9pbmNvbXBsZXRlLXNhbml0aXphdGlvbikuXG4gICAgY29uc3QgY2VsbCA9ICh2KSA9PiBTdHJpbmcodiA/PyAnJykucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKS5yZXBsYWNlKC9cXHwvZywgJ1xcXFx8JykucmVwbGFjZSgvXFxyP1xcbi9nLCAnICcpO1xuICAgIG91dC5wdXNoKCd8IGlkIHwgbG9jYXRvciAocmVsYXRpdmUgdG8gZXh0cmFjdGlvbiByb290KSB8IHB1cnBvc2UgfCcpO1xuICAgIG91dC5wdXNoKCd8IC0tLSB8IC0tLSB8IC0tLSB8Jyk7XG4gICAgZm9yIChjb25zdCBzIG9mIHNraWxsc0luZGV4LnNraWxscykge1xuICAgICAgY29uc3QgaW52b2tlID0gcy5pbnZva2UgPyBgIEludm9rZTogXFxgJHtjZWxsKHMuaW52b2tlKX1cXGAuYCA6ICcnO1xuICAgICAgb3V0LnB1c2goYHwgXFxgJHtjZWxsKHMuaWQpfVxcYCB8IFxcYCR7Y2VsbChzLnBhdGgpfVxcYCB8ICR7Y2VsbChzLnB1cnBvc2UpfSR7aW52b2tlfSB8YCk7XG4gICAgfVxuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnUHJvdmVuYW5jZSAodXBzdHJlYW0gcmVwbyArIHBpbm5lZCBjb21taXQgKyBsaWNlbnNlKSBmb3IgZXZlcnkgdmVuZG9yZWQnKTtcbiAgICBvdXQucHVzaChgc2tpbGwgaXMgcmVjb3JkZWQgaW4gXFxgJHtTS0lMTFNfSU5ERVhfUEFUSH1cXGAgYXQgdGhlIGFyY2hpdmUgcm9vdC5gKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQucHVzaCgnX1RoaXMgYnVuZGxlIHdhcyBleHBvcnRlZCB3aXRob3V0IHRoZSB2ZW5kb3JlZCBza2lsbCBzZXQgKHRoZSBvcGVyYXRvcicpO1xuICAgIG91dC5wdXNoKCdkaXNhYmxlZCBcIkJ1bmRsZSBkZXNpZ24gc2tpbGxzXCIpLiBNYXAgY29tbWVudHMgYWdhaW5zdCB3aGF0ZXZlciBkZXNpZ24nKTtcbiAgICBvdXQucHVzaCgnc2tpbGxzIGV4aXN0IGluIFlPVVIgT1dOIGVudmlyb25tZW50IGluc3RlYWQsIGFuZCBub3RlIHRoYXQgaW4gdGhlJyk7XG4gICAgb3V0LnB1c2goJ3dvcmsgbWFuaWZlc3QuXycpO1xuICB9XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDQgwrcgUGhhc2VzJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1J1biB0aGUgZml2ZSBwaGFzZXMgaW4gb3JkZXIuICoqRGVncmFkYXRpb24gcnVsZToqKiBpZiB5b3UgY2Fubm90IHNwYXduJyk7XG4gIG91dC5wdXNoKCdzdWJhZ2VudHMsIG9yIGxhY2sgYSBgL3BsYW5gLCBgL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduYCwgb3Igcm9hc3QnKTtcbiAgb3V0LnB1c2goJ2NhcGFiaWxpdHksIHBlcmZvcm0gdGhlIHNhbWUgcGhhc2VzIHlvdXJzZWxmIFNFUklBTExZIGluIHRoaXMgZXhhY3Qgb3JkZXInKTtcbiAgb3V0LnB1c2goJ+KAlCBuZXZlciBza2lwIGEgcGhhc2UuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyBtYXAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaChgRm9yIEVWRVJZIGNvbW1lbnQgcm93IGluIFxcYCR7anNvbmxOYW1lfVxcYCwgZGVjaWRlIHdoaWNoIGJ1bmRsZWQgc2tpbGxzIGFwcGx5YCk7XG4gIG91dC5wdXNoKCdhbmQgYXBwZW5kIG9uZSBgY29tbWVudGAgcm93IHRvIGB3b3JrLW1hbmlmZXN0Lmpzb25sYCBjYXJyeWluZyBhJyk7XG4gIG91dC5wdXNoKCdgbWFwcGVkX3NraWxsc2AgZmllbGQgd2hvc2UgZW50cmllcyBhcmUgbG9jYXRvcnMgKHNlZSDCpzMpLiBUaGUgZXhwb3J0Jyk7XG4gIG91dC5wdXNoKCdwcmUtc2VlZHMgaGV1cmlzdGljIGBzdWdnZXN0ZWRTa2lsbHNgIG9uIGVhY2ggZmVlZGJhY2sgcm93OyB2ZXJpZnkgYW5kJyk7XG4gIG91dC5wdXNoKCdjb3JyZWN0IHRoZW0sIGRvIG5vdCB0cnVzdCB0aGVtIGJsaW5kbHkuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyBwbGFuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ0ZhbiBvdXQgT05FIGJhY2tncm91bmQgYXRvbWljIHN1YmFnZW50IHBlciBjb21tZW50LiBQYXNzIGVhY2ggc3ViYWdlbnQgYScpO1xuICBvdXQucHVzaCgnc3RhbmRhbG9uZSBKU09OTCBzdWJpbnN0cnVjdGlvbiBjb250YWluaW5nIHRoZSBmdWxsIGNvbW1lbnQgcm93LCBpdHMnKTtcbiAgb3V0LnB1c2goJ3BhcmVudCBzZWxlY3RvciByb3csIHRoZSBidW5kbGUgbWFuaWZlc3QgbGluZSwgYW5kIHRoZSBGVUxMIFRFWFQgb2YgZXZlcnknKTtcbiAgb3V0LnB1c2goJ21hcHBlZCBza2lsbCBwcm9tcHQuIEVhY2ggc3ViYWdlbnQgdXNlcyB5b3VyIGAvcGxhbmAgKHBsYW5uaW5nKSBjYXBhYmlsaXR5Jyk7XG4gIG91dC5wdXNoKGBmb3IgaXRzIHBoYXNlLCBwb2xpc2hlcyBpdHMgcGxhbiB3aXRoIFxcYC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGxcXGAsIGFuZGApO1xuICBvdXQucHVzaChgcmV0dXJucyBhIHBsYW4geW91IHNhdmUgdG8gXFxgcGxhbnMvJHtidW5kbGVJZH0vPEZFRURCQUNLX1VJRD4ucGxhbi5tZFxcYC5gKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnU3ViYWdlbnQgc3ViaW5zdHJ1Y3Rpb24gdGVtcGxhdGUgKG9uZSBKU09OTCBkb2N1bWVudCBwZXIgc3ViYWdlbnQ7IGh5ZHJhdGUnKTtcbiAgb3V0LnB1c2goJ2V2ZXJ5IGA8Li4uPmAgYmVmb3JlIGRpc3BhdGNoKTonKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBganNvbmMnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwicGluY2hncmFiLXN1YmFnZW50LXBsYW5cIixcImJ1bmRsZUlkXCI6XCIke2J1bmRsZUlkfVwiLFwiZmVlZGJhY2tVaWRcIjpcIjxGRUVEQkFDS19VSUQ+XCJ9YCk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJpbnN0cnVjdGlvblwiLFwidGV4dFwiOlwiWW91IGFyZSBhIHBsYW5uaW5nIHN1YmFnZW50IGZvciBPTkUgdXNlciBjb21wbGFpbnQgYWJvdXQgYSBsaXZlIFVJIGVsZW1lbnQuIFVzZSB5b3VyIC9wbGFuIGNhcGFiaWxpdHkuIFByb2R1Y2UgYW4gaW1wbGVtZW50YXRpb24gcGxhbiBPTkxZIOKAlCBkbyBub3QgZWRpdCBmaWxlcy4gRGVsaXZlcjogcm9vdC1jYXVzZSBoeXBvdGhlc2lzLCBleGFjdCBmaWxlcy9zZWxlY3RvcnMgdG8gY2hhbmdlIGluIDxQUk9KRUNUX1JPT1Q+LCBzdGVwLWJ5LXN0ZXAgZWRpdHMsIHRlc3QgcGxhbiwgYW5kIGhvdyB0aGUgZml4IHdpbGwgYmUgdmlzdWFsbHkgdmVyaWZpZWQgYWdhaW5zdCB0aGUgb3JpZ2luYWwgc2NyZWVuc2hvdC4gUG9saXNoIHRoZSBwbGFuIHdpdGggL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbCBiZWZvcmUgcmV0dXJuaW5nIGl0LlwifScpO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwiY29tbWVudFwiLFwicm93XCI6PGZ1bGwgZmVlZGJhY2sgcm93IGZyb20gdGhlIGJ1bmRsZSBKU09OTD59Jyk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJ0YXJnZXRcIixcInJvd1wiOjxmdWxsIHBhcmVudCBzZWxlY3RvciByb3cgZnJvbSB0aGUgYnVuZGxlIEpTT05MPn0nKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcIm1hbmlmZXN0XCIsXCJyb3dcIjo8dGhlIGJ1bmRsZSBtYW5pZmVzdCBsaW5lPn0nKTtcbiAgb3V0LnB1c2goYHtcInR5cGVcIjpcInNjcmVlbnNob3RcIixcInBhdGhcIjpcIiR7eERpcn0vc2NyZWVuc2hvdHMvPGZpbGU+LnBuZ1wifWApO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwic2tpbGxcIixcImlkXCI6XCI8bWFwcGVkIHNraWxsIGlkPlwiLFwidGV4dFwiOlwiPEZVTEwgVEVYVCBvZiB0aGUgbWFwcGVkIHNraWxsIGZpbGU+XCJ9Jyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIGltcGxlbWVudCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdZT1Ug4oCUIHRoZSBmb3JlZ3JvdW5kIGFnZW50IHRoZSBvcGVyYXRvciBwYXN0ZWQgdGhlIHByb21wdCBpbnRvIOKAlCBkbyBhbGwnKTtcbiAgb3V0LnB1c2goJ2ltcGxlbWVudGF0aW9uLCB0ZXN0IGRldmVsb3BtZW50LCB0ZXN0aW5nLCBhbmQgaXRlcmF0aW9uIGluJyk7XG4gIG91dC5wdXNoKCdgPFBST0pFQ1RfUk9PVD5gLiBTdWJhZ2VudHMgb25seSBwbGFuLiBXb3JrIG9uZSBjb21tZW50IGF0IGEgdGltZSwgdXBkYXRlJyk7XG4gIG91dC5wdXNoKCdpdHMgd29yay1tYW5pZmVzdCByb3cgdG8gYGluLXByb2dyZXNzYCB0aGVuIGBkb25lYC9gYmxvY2tlZGAsIGFuZCBwb2xpc2gnKTtcbiAgb3V0LnB1c2goJ3RoZSBpbXBsZW1lbnRlZCByZXN1bHQgd2l0aCBgL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduOmFsbGAuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyBhdWRpdCcpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdTZW5kIHRoZSBjb21iaW5lZCBwbGFucyArIGltcGxlbWVudGF0aW9uIGZvciBhIGJsaW5kIGF0b21pYyBcXCdyb2FzdFxcJyBwZWVyJyk7XG4gIG91dC5wdXNoKCdyZXZpZXcgb2YgQk9USCBwbGFuIGFuZCBpbXBsZW1lbnRhdGlvbiwgdXNpbmcgd2hhdGV2ZXIgb3RoZXItYWdlbnQnKTtcbiAgb3V0LnB1c2goYHBlZXItcmV2aWV3IHNraWxscyBleGlzdCBpbiBZT1VSIE9XTiBlbnZpcm9ubWVudC4gV3JpdGUgaXQgdG9gKTtcbiAgb3V0LnB1c2goYFxcYGF1ZGl0cy8ke2J1bmRsZUlkfS88cnVuSWQ+LXJvYXN0Lm1kXFxgIGFuZCBhZGRyZXNzIGV2ZXJ5IGJsb2NrZXIgaXQgcmFpc2VzLmApO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgdmVyaWZ5Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ09ubHkgYWZ0ZXIgaW1wbGVtZW50YXRpb24gYW5kIGF1ZGl0OiBzdGFydCB0aGUgcHJvZHVjdCBsb2NhbGx5LCB0aGVuIHJ1bicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBiYXNoJyk7XG4gIG91dC5wdXNoKGBucHggLXkgcGluY2hncmFiIHJlY2FwdHVyZSAke3hEaXJ9LyR7anNvbmxOYW1lfSA8QVBQX1VSTD4gLS13b3Jrc3BhY2UtZGlyICR7cm9vdH1gKTtcbiAgb3V0LnB1c2goJyMgYnVueCB3b3JrcyB0b287IGFkZCAtLWF1dGgtc3RhdGUgPHN0b3JhZ2VTdGF0ZS5qc29uPiBmb3IgbG9nZ2VkLWluIHBhZ2VzJyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnVGhpcyByZS1sb2NhdGVzIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3RvciB3aXRoIFBpbmNoR3JhYlxcJ3Mgb3duJyk7XG4gIG91dC5wdXNoKCdDU1PihpJYUGF0aOKGkmExMXkgY2hhaW4sIHNjcmVlbnNob3RzIGVhY2ggZWxlbWVudCwgYW5kIHdyaXRlcyBhbiBhcHBlbmQtb25seScpO1xuICBvdXQucHVzaChgcnVuIHVuZGVyIFxcYHJlY2FwdHVyZXMvPHJ1bklkPi9cXGAgKHBsdXMgYSBcXGByZWNhcHR1cmUtcnVuXFxgIGxlZGdlciByb3cpLiBJdGApO1xuICBvdXQucHVzaCgnZXhpdHMgMCBvbmx5IHdoZW4gZXZlcnkgY29tbWVudGVkIHNlbGVjdG9yIHN0aWxsIHJlc29sdmVzLiBSZWFkIGVhY2gnKTtcbiAgb3V0LnB1c2goYHJlY2FwdHVyZWQgUE5HIG5leHQgdG8gaXRzIG9yaWdpbmFsIGluIFxcYCR7eERpcn0vc2NyZWVuc2hvdHMvXFxgIGFuZCBjb25maXJtYCk7XG4gIG91dC5wdXNoKCdldmVyeSBjb21tZW50IGlzIHZpc2libHkgcmVzb2x2ZWQ7IHRoZW4gdXBkYXRlIHRoZSBtYXRjaGluZycpO1xuICBvdXQucHVzaCgnd29yay1tYW5pZmVzdCByb3dzIHRvIGBkb25lYCwgb3IgYGJsb2NrZWRgIHdpdGggYSByZWFzb24uJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDUgwrcgRG9uZSBjcml0ZXJpYScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGRvbmVUZXh0KHtidW5kbGVJZH0pKTtcbiAgb3V0LnB1c2goJycpO1xuICByZXR1cm4gb3V0LmpvaW4oJ1xcbicpO1xufTtcbiIsCiAgICAiLy8gU2luZ2xlLWNhcHR1cmUgZnVsbCBleHBvcnQuXG4vL1xuLy8gXCJDb3B5IGNhcHR1cmUgYXMgSlNPTlwiIHdhbnRzIGEgQ09NUExFVEUsIHNlbGYtY29udGFpbmVkIHRleHR1YWwgZXhwb3J0IG9mXG4vLyBPTkUgY2FwdHVyZTogaXRzIHNlbGVjdG9ycy9wYXRocywgZWxlbWVudCB0ZXh0L2NvbnRlbnQsIG91dGVySFRNTCxcbi8vIG1ldGFkYXRhLCBBTkQgZXZlcnkgbm90ZS9jb21tZW50IGF0dGFjaGVkIHRvIGl0IOKAlCBldmVyeXRoaW5nIGEgZnVsbFxuLy8gd29ya3NwYWNlIGV4cG9ydCBjYXJyaWVzLCBidXQgc2NvcGVkIHRvIGEgc2luZ2xlIGVsZW1lbnQuXG4vL1xuLy8gVGhlIHBhbmVsIG1vZGVscyBhIGNhcHR1cmUgYXMgYW4gYEVudHJ5YCAoc3JjL3R5cGVzLnRzKSBwbHVzIHplcm8gb3IgbW9yZVxuLy8gYEZlZWRiYWNrTWVzc2FnZWAgcm93cyBsaW5rZWQgYmFjayB2aWEgYHBhcmVudFVpZCDihpIgRW50cnkudWlkYC4gQmVjYXVzZVxuLy8gbm90ZXMgbGl2ZSBvbiBzZXBhcmF0ZSByb3dzLCB0aGUgc2VyaWFsaXplciB0YWtlcyB0aGUgY2FwdHVyZSBlbnRyeSBhbmRcbi8vIGl0cyBmZWVkYmFjayByb3dzIHRvZ2V0aGVyIHNvIHRoZSBKU09OIGlzIGdlbnVpbmVseSBzZWxmLWNvbnRhaW5lZCDigJQgYVxuLy8gY2FsbGVyIGNhbiBoYW5kIHRoZSBvdXRwdXQgdG8gYW4gYWdlbnQgYW5kIG5vdGhpbmcgZGFuZ2xlcy5cbi8vXG4vLyBHcm91cCBoZWFkcyAoQWx0K1NoaWZ0K0NsaWNrIHNlbGVjdGlvbnMpIGNhcnJ5IGNoaWxkIGNhcHR1cmVzIHVuZGVyXG4vLyBgZW50cnkuZ3JvdXBgOyB3ZSBpbmxpbmUgdGhvc2UgY2hpbGRyZW4gKHdpdGggdGhlaXIgb3duIGZlZWRiYWNrKSBzbyBhXG4vLyBncm91cGVkIGNhcHR1cmUgZXhwb3J0cyBhcyBvbmUgY29tcGxldGUgb2JqZWN0IHRvby5cbi8vXG4vLyBUd28gb3V0cHV0IGZvcm1zLCBtaXJyb3JpbmcgdGhlIHdvcmtzcGFjZSBleHBvcnQncyBKU09OICsgZW5nbGlzaCBzcGxpdDpcbi8vICAgc2VyaWFsaXplQ2FwdHVyZUZ1bGwoY2FwdHVyZSwgb3B0cykgICAgIOKGkiBvYmplY3QgIChzdHJ1Y3R1cmVkLCBjb21wbGV0ZSlcbi8vICAgc2VyaWFsaXplQ2FwdHVyZUpzb24oY2FwdHVyZSwgb3B0cykgICAgICDihpIgc3RyaW5nICAocHJldHR5IEpTT04gKyBuZXdsaW5lKVxuLy8gICBzZXJpYWxpemVDYXB0dXJlVGV4dChjYXB0dXJlLCBvcHRzKSAgICAgIOKGkiBzdHJpbmcgIChtYXJrZG93biwgaHVtYW4vTExNKVxuLy9cbi8vIGBjYXB0dXJlYCBhY2NlcHRzIGVpdGhlcjpcbi8vICAg4oCiIHsgZW50cnksIGZlZWRiYWNrPywgbWVtYmVycz8gfSAg4oCUIGV4cGxpY2l0IHNoYXBlLCBPUlxuLy8gICDigKIgYSBiYXJlIGBFbnRyeWAgICAgICAgICAgICAgICAgICDigJQgZmVlZGJhY2sgZGVmYXVsdHMgdG8gW11cbi8vXG4vLyBPdXRwdXQgaXMgZGV0ZXJtaW5pc3RpYzogaWRlbnRpY2FsIGlucHV0IOKGkiBieXRlLWlkZW50aWNhbCBvdXRwdXQuIE5vXG4vLyB0aW1lc3RhbXBzIGFyZSBpbmplY3RlZDsgb25seSB0aGUgY2FwdHVyZSdzIG93biBgdHNgIGZpZWxkcyBhcHBlYXIuXG5cbi8vIOKUgOKUgOKUgCBJbnB1dCBub3JtYWxpemF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyBBY2NlcHQgYSBiYXJlIEVudHJ5IG9yIGEge2VudHJ5LCBmZWVkYmFjaywgbWVtYmVyc30gd3JhcHBlciBhbmQgcmV0dXJuIGFcbi8vIG5vcm1hbGl6ZWQge2VudHJ5LCBmZWVkYmFjaywgbWVtYmVyc30gd2l0aCBhcnJheXMgYWx3YXlzIHByZXNlbnQuXG5jb25zdCBub3JtYWxpemVDYXB0dXJlID0gKGNhcHR1cmUpID0+IHtcbiAgaWYgKCFjYXB0dXJlIHx8IHR5cGVvZiBjYXB0dXJlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwic2VyaWFsaXplQ2FwdHVyZUZ1bGw6IGNhcHR1cmUgbXVzdCBiZSBhbiBvYmplY3RcIik7XG4gIH1cbiAgLy8gQmFyZSBFbnRyeTogaXQgaGFzIGEgYHNlbGVjdG9yYCAvIGB1aWRgIGJ1dCBubyBuZXN0ZWQgYGVudHJ5YC5cbiAgY29uc3QgZW50cnkgPSBjYXB0dXJlLmVudHJ5ID8/IGNhcHR1cmU7XG4gIGlmICghZW50cnkgfHwgdHlwZW9mIGVudHJ5ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwic2VyaWFsaXplQ2FwdHVyZUZ1bGw6IGNhcHR1cmUgaGFzIG5vIGVudHJ5XCIpO1xuICB9XG4gIGNvbnN0IGZlZWRiYWNrID0gQXJyYXkuaXNBcnJheShjYXB0dXJlLmZlZWRiYWNrKSA/IGNhcHR1cmUuZmVlZGJhY2sgOiBbXTtcbiAgLy8gR3JvdXAgbWVtYmVycyBtYXkgYmUgc3VwcGxpZWQgZXhwbGljaXRseSwgZWxzZSBmYWxsIGJhY2sgdG8gdGhlIGVudHJ5J3NcbiAgLy8gb3duIGBncm91cGAgYXJyYXkgKHRoZSBwYW5lbCBzdG9yZXMgY2hpbGQgY2FwdHVyZXMgdGhlcmUpLlxuICBjb25zdCBtZW1iZXJzID0gQXJyYXkuaXNBcnJheShjYXB0dXJlLm1lbWJlcnMpXG4gICAgPyBjYXB0dXJlLm1lbWJlcnNcbiAgICA6IEFycmF5LmlzQXJyYXkoZW50cnkuZ3JvdXApXG4gICAgICA/IGVudHJ5Lmdyb3VwXG4gICAgICA6IFtdO1xuICByZXR1cm4geyBlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnMgfTtcbn07XG5cbi8vIEEgZmVlZGJhY2sgcm93IHNjb3BlZCB0byBhIHNpbmdsZSBjYXB0dXJlLiBTdHJpcHMgcm91dGluZy9VSSBjcnVmdFxuLy8gKGlkLCB0eXBlKSBhbmQga2VlcHMgb25seSB3aGF0IGEgcmV2aWV3ZXIgbmVlZHM6IHRoZSB0ZXh0LCB3aGVuIGl0IHdhc1xuLy8gd3JpdHRlbiwgYW55IHRhZ3MsIGFuZCB0aGUgcGFyZW50IGxpbmsgZm9yIHRyYWNlYWJpbGl0eS5cbmNvbnN0IHNsaW1Db21tZW50ID0gKGZiKSA9PiB7XG4gIGNvbnN0IG91dCA9IHsgdGV4dDogdHlwZW9mIGZiLnRleHQgPT09IFwic3RyaW5nXCIgPyBmYi50ZXh0IDogXCJcIiB9O1xuICBpZiAoZmIudHMpIG91dC50cyA9IGZiLnRzO1xuICBpZiAoZmIudWlkKSBvdXQudWlkID0gZmIudWlkO1xuICBpZiAoZmIucGFyZW50VWlkKSBvdXQucGFyZW50VWlkID0gZmIucGFyZW50VWlkO1xuICBpZiAoQXJyYXkuaXNBcnJheShmYi50YWdzKSAmJiBmYi50YWdzLmxlbmd0aCkgb3V0LnRhZ3MgPSBmYi50YWdzO1xuICByZXR1cm4gb3V0O1xufTtcblxuLy8gQ29sbGVjdCB0aGUgcGF0aHMvc2VsZWN0b3JzIGZvciBhIGNhcHR1cmUgaW50byBvbmUgYmxvY2sgc28gZXZlcnkgd2F5IG9mXG4vLyBsb2NhdGluZyB0aGUgZWxlbWVudCBpcyBpbiBhIHNpbmdsZSwgb2J2aW91cyBwbGFjZS4gVG9sZXJhbnQgb2YgYm90aCB0aGVcbi8vIHBhbmVsIGBFbnRyeWAgc2hhcGUgKGZsYXQgYHNlbGVjdG9yYCArIGBpZGAvYHRlc3RJZGApIGFuZCB0aGUgcmljaGVyXG4vLyBgc2VsZWN0b3JzYCBzdWItb2JqZWN0IHNvbWUgY2FwdHVyZSBwaXBlbGluZXMgZW1pdC5cbmNvbnN0IGNvbGxlY3RQYXRocyA9IChlbnRyeSkgPT4ge1xuICBjb25zdCBwYXRocyA9IHt9O1xuICBpZiAoZW50cnkuc2VsZWN0b3IpIHBhdGhzLmNzcyA9IGVudHJ5LnNlbGVjdG9yO1xuICBjb25zdCBzZWwgPSBlbnRyeS5zZWxlY3RvcnM7XG4gIGlmIChzZWwgJiYgdHlwZW9mIHNlbCA9PT0gXCJvYmplY3RcIikge1xuICAgIGlmIChzZWwuY3NzICYmIHNlbC5jc3MgIT09IHBhdGhzLmNzcykgcGF0aHMuY3NzRnVsbCA9IHNlbC5jc3M7XG4gICAgaWYgKHNlbC5jb21wYWN0KSBwYXRocy5jb21wYWN0ID0gc2VsLmNvbXBhY3Q7XG4gICAgaWYgKHNlbC54cGF0aCkgcGF0aHMueHBhdGggPSBzZWwueHBhdGg7XG4gICAgaWYgKHNlbC5kYXRhSWRzKSBwYXRocy5kYXRhSWRzID0gc2VsLmRhdGFJZHM7XG4gIH1cbiAgaWYgKGVudHJ5LmNvbXBvbmVudFJvb3QpIHBhdGhzLmNvbXBvbmVudFJvb3QgPSBlbnRyeS5jb21wb25lbnRSb290O1xuICBpZiAoZW50cnkuc2hhZG93SG9zdCkgcGF0aHMuc2hhZG93SG9zdCA9IGVudHJ5LnNoYWRvd0hvc3Q7XG4gIGlmIChlbnRyeS5pZCkgcGF0aHMuZG9tSWQgPSBlbnRyeS5pZDtcbiAgaWYgKGVudHJ5LnRlc3RJZCkgcGF0aHMudGVzdElkID0gZW50cnkudGVzdElkO1xuICBpZiAodHlwZW9mIGVudHJ5LnNlbGVjdG9yTWF0Y2hDb3VudCA9PT0gXCJudW1iZXJcIikge1xuICAgIHBhdGhzLm1hdGNoQ291bnQgPSBlbnRyeS5zZWxlY3Rvck1hdGNoQ291bnQ7XG4gIH1cbiAgcmV0dXJuIHBhdGhzO1xufTtcblxuLy8g4pSA4pSA4pSAIEZ1bGwgc3RydWN0dXJlZCBmb3JtIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyBCdWlsZCB0aGUgY29tcGxldGUgb2JqZWN0IGZvciBPTkUgY2FwdHVyZS4gRXZlcnl0aGluZyB0ZXh0dWFsIHRoZVxuLy8gd29ya3NwYWNlIGV4cG9ydCB3b3VsZCBjYXJyeSBmb3IgdGhpcyBlbGVtZW50LCB3aXRoIG5vdGVzL2NvbW1lbnRzXG4vLyBpbmxpbmVkLiBHcm91cCBtZW1iZXJzIHJlY3Vyc2Ugc28gYSBncm91cGVkIGNhcHR1cmUgaXMgc2VsZi1jb250YWluZWQuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplQ2FwdHVyZUZ1bGwgPSAoY2FwdHVyZSwgb3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzIH0gPSBub3JtYWxpemVDYXB0dXJlKGNhcHR1cmUpO1xuXG4gIGNvbnN0IG91dCA9IHtcbiAgICBraW5kOiBcInBpbmNoZ3JhYi9jYXB0dXJlLWZ1bGxcIixcbiAgICB2OiAxLFxuICB9O1xuICBpZiAoZW50cnkudWlkKSBvdXQudWlkID0gZW50cnkudWlkO1xuICBpZiAoZW50cnkubiAhPT0gdW5kZWZpbmVkKSBvdXQubiA9IGVudHJ5Lm47XG4gIGlmIChlbnRyeS50cykgb3V0LnRzID0gZW50cnkudHM7XG4gIGlmIChlbnRyeS51cmwpIG91dC51cmwgPSBlbnRyeS51cmw7XG4gIGlmIChlbnRyeS50YWcpIG91dC50YWcgPSBlbnRyeS50YWc7XG5cbiAgLy8gSWRlbnRpdHkgLyBhMTF5IG5hbWluZy5cbiAgY29uc3QgaWRlbnRpdHkgPSB7fTtcbiAgaWYgKGVudHJ5LnJvbGUgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkucm9sZSA9IGVudHJ5LnJvbGU7XG4gIGlmIChlbnRyeS5hY2Nlc3NpYmxlTmFtZSAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5hY2Nlc3NpYmxlTmFtZSA9IGVudHJ5LmFjY2Vzc2libGVOYW1lO1xuICBpZiAoZW50cnkudGVzdElkICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LnRlc3RJZCA9IGVudHJ5LnRlc3RJZDtcbiAgaWYgKGVudHJ5LmlkICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LmlkID0gZW50cnkuaWQ7XG4gIGlmIChBcnJheS5pc0FycmF5KGVudHJ5LmNsYXNzZXMpICYmIGVudHJ5LmNsYXNzZXMubGVuZ3RoKSBpZGVudGl0eS5jbGFzc2VzID0gZW50cnkuY2xhc3NlcztcbiAgaWYgKE9iamVjdC5rZXlzKGlkZW50aXR5KS5sZW5ndGgpIG91dC5pZGVudGl0eSA9IGlkZW50aXR5O1xuXG4gIC8vIFBhdGhzIOKAlCBldmVyeSB3YXkgdG8gbG9jYXRlIHRoZSBlbGVtZW50LlxuICBjb25zdCBwYXRocyA9IGNvbGxlY3RQYXRocyhlbnRyeSk7XG4gIGlmIChPYmplY3Qua2V5cyhwYXRocykubGVuZ3RoKSBvdXQucGF0aHMgPSBwYXRocztcblxuICAvLyBUZXh0IC8gY29udGVudC4gV2Uga2VlcCBhbGwgdGV4dHVhbCBzdXJmYWNlcyBzbyBub3RoaW5nIHRoZSB1c2VyIGNhblxuICAvLyBzZWUgaXMgbG9zdDogc291cmNlIHRleHQsIHRoZSBDU1MtcmVuZGVyZWQgZm9ybSwgYW5kIHRoZSBtYXJrdXAuXG4gIGNvbnN0IGNvbnRlbnQgPSB7fTtcbiAgaWYgKGVudHJ5LnRleHQgIT09IHVuZGVmaW5lZCkgY29udGVudC50ZXh0ID0gZW50cnkudGV4dDtcbiAgaWYgKGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnJlbmRlcmVkVGV4dCA9IGVudHJ5LnJlbmRlcmVkVGV4dDtcbiAgaWYgKGVudHJ5LnZhbHVlICE9PSB1bmRlZmluZWQpIGNvbnRlbnQudmFsdWUgPSBlbnRyeS52YWx1ZTtcbiAgaWYgKGVudHJ5LnBsYWNlaG9sZGVyICE9PSB1bmRlZmluZWQpIGNvbnRlbnQucGxhY2Vob2xkZXIgPSBlbnRyeS5wbGFjZWhvbGRlcjtcbiAgaWYgKGVudHJ5Lm91dGVySFRNTCAhPT0gdW5kZWZpbmVkKSBjb250ZW50Lm91dGVySFRNTCA9IGVudHJ5Lm91dGVySFRNTDtcbiAgaWYgKE9iamVjdC5rZXlzKGNvbnRlbnQpLmxlbmd0aCkgb3V0LmNvbnRlbnQgPSBjb250ZW50O1xuXG4gIC8vIE5vdGVzIC8gY29tbWVudHMgYXR0YWNoZWQgdG8gdGhpcyBjYXB0dXJlLlxuICBpZiAoZmVlZGJhY2subGVuZ3RoKSBvdXQuY29tbWVudHMgPSBmZWVkYmFjay5tYXAoc2xpbUNvbW1lbnQpO1xuXG4gIC8vIFJlbWFpbmluZyBzdHJ1Y3R1cmVkIG1ldGFkYXRhIGFuIGFnZW50IG1heSB3YW50IOKAlCBjb3BpZWQgdGhyb3VnaFxuICAvLyB2ZXJiYXRpbSBzbyB0aGlzIGV4cG9ydCBpcyBhcyBjb21wbGV0ZSBhcyB0aGUgSlNPTkwgcm93LiBXZSBhbGxvdy1saXN0XG4gIC8vIHRoZSBoZWF2eS9zdHJ1Y3R1cmVkIGZpZWxkcyByYXRoZXIgdGhhbiBkdW1waW5nIHRoZSB3aG9sZSBFbnRyeSBzbyB0aGVcbiAgLy8gb3V0cHV0IG9yZGVyaW5nIHN0YXlzIHN0YWJsZSBhbmQgb2J2aW91cy5cbiAgY29uc3QgbWV0YSA9IHt9O1xuICBjb25zdCBwYXNzdGhyb3VnaCA9IFtcbiAgICBcInJlY3RcIiwgXCJ2aWV3cG9ydFwiLCBcInN0YXRlc1wiLCBcImF0dHJzXCIsIFwiaGludHNcIiwgXCJjb21wb25lbnRcIiwgXCJldmVudHNcIixcbiAgICBcImJlaGF2aW9yQXR0cnNcIiwgXCJhMTF5XCIsIFwiYXNzZXRzXCIsIFwibGF5b3V0Q29udGV4dFwiLCBcInN0eWxlc1wiLFxuICAgIFwibWF0Y2hlZFJ1bGVzXCIsIFwiYW5jZXN0b3JzXCIsIFwic2NyZWVuc2hvdFwiLCBcInRydW5jYXRlZFwiLCBcInNlc3Npb25JZFwiLFxuICAgIFwiY2FudmFzQ2xpY2tcIiwgXCJlZGl0b3JcIiwgXCJkb21NdXRhdGlvbnNcIiwgXCJpc0FuaW1hdGluZ1wiLFxuICBdO1xuICBmb3IgKGNvbnN0IGtleSBvZiBwYXNzdGhyb3VnaCkge1xuICAgIGlmIChlbnRyeVtrZXldICE9PSB1bmRlZmluZWQpIG1ldGFba2V5XSA9IGVudHJ5W2tleV07XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKG1ldGEpLmxlbmd0aCkgb3V0Lm1ldGEgPSBtZXRhO1xuXG4gIC8vIEdyb3VwIG1lbWJlcnM6IHJlY3Vyc2Ugc28gZWFjaCBjaGlsZCBjYXB0dXJlIGlzIGZ1bGx5IHNlcmlhbGl6ZWQgdG9vLlxuICAvLyBBIG1lbWJlciBtYXkgY2FycnkgaXRzIG93biBmZWVkYmFjayB3aGVuIHRoZSBjYWxsZXIgc3VwcGxpZXMgYVxuICAvLyB7ZW50cnksIGZlZWRiYWNrfSBwYWlyOyBiYXJlIGNoaWxkIEVudHJpZXMgc2VyaWFsaXplIHdpdGggbm8gY29tbWVudHMuXG4gIGlmIChtZW1iZXJzLmxlbmd0aCkge1xuICAgIG91dC5tZW1iZXJzID0gbWVtYmVycy5tYXAoKG0pID0+IHNlcmlhbGl6ZUNhcHR1cmVGdWxsKG0sIG9wdHMpKTtcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBQcmV0dHkgSlNPTiBzdHJpbmcgZm9yIHRoZSBcIkNvcHkgY2FwdHVyZSBhcyBKU09OXCIgYnV0dG9uLiBUcmFpbGluZ1xuLy8gbmV3bGluZSBzbyBpdCByb3VuZC10cmlwcyBjbGVhbmx5IHRocm91Z2ggZWRpdG9ycyAvIGBwYnBhc3RlYC5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVDYXB0dXJlSnNvbiA9IChjYXB0dXJlLCBvcHRzID0ge30pID0+XG4gIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6ZUNhcHR1cmVGdWxsKGNhcHR1cmUsIG9wdHMpLCBudWxsLCAyKSArIFwiXFxuXCI7XG5cbi8vIOKUgOKUgOKUgCBTaW5nbGUtY2FwdHVyZSBtYXJrZG93biBmb3JtIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy9cbi8vIE1hdGNoZXMgdGhlIHdvcmtzcGFjZSBleHBvcnQncyBlbmdsaXNoL21hcmtkb3duIHN1cmZhY2UgYnV0IHNjb3BlZCB0byBvbmVcbi8vIGNhcHR1cmUuIFVzZWZ1bCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIHBhc3RlIGEgaHVtYW4tcmVhZGFibGUgY2FyZCByYXRoZXJcbi8vIHRoYW4gcmF3IEpTT04uXG5cbmNvbnN0IGhlYWRpbmcgPSAoZW50cnkpID0+IHtcbiAgY29uc3QgbmFtZSA9XG4gICAgZW50cnkuYWNjZXNzaWJsZU5hbWUgfHxcbiAgICBlbnRyeS50ZXN0SWQgfHxcbiAgICBlbnRyeS5pZCB8fFxuICAgIGVudHJ5LnNlbGVjdG9yIHx8XG4gICAgZW50cnkudGFnIHx8XG4gICAgXCJjYXB0dXJlXCI7XG4gIGNvbnN0IGxhYmVsID0gZW50cnkubiAhPT0gdW5kZWZpbmVkID8gYENhcHR1cmUgIyR7ZW50cnkubn1gIDogXCJDYXB0dXJlXCI7XG4gIHJldHVybiBgJHtsYWJlbH06ICR7bmFtZX1gO1xufTtcblxuY29uc3QgcmVuZGVyUGF0aHMgPSAocGF0aHMpID0+IHtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocGF0aHMpKSB7XG4gICAgbGluZXMucHVzaChgLSAqKiR7a306KiogXFxgJHt2fVxcYGApO1xuICB9XG4gIHJldHVybiBsaW5lcztcbn07XG5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVDYXB0dXJlVGV4dCA9IChjYXB0dXJlLCBvcHRzID0ge30pID0+IHtcbiAgY29uc3QgeyBlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnMgfSA9IG5vcm1hbGl6ZUNhcHR1cmUoY2FwdHVyZSk7XG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGxpbmVzLnB1c2goYCMgJHtoZWFkaW5nKGVudHJ5KX1gLCBcIlwiKTtcbiAgaWYgKGVudHJ5LnVybCkgbGluZXMucHVzaChgUGFnZTogPCR7ZW50cnkudXJsfT5gLCBcIlwiKTtcbiAgaWYgKGVudHJ5LnRhZykgbGluZXMucHVzaChgRWxlbWVudDogXFxgPCR7ZW50cnkudGFnfT5cXGBgLCBcIlwiKTtcblxuICBjb25zdCBwYXRocyA9IGNvbGxlY3RQYXRocyhlbnRyeSk7XG4gIGlmIChPYmplY3Qua2V5cyhwYXRocykubGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIFBhdGhzXCIsIFwiXCIsIC4uLnJlbmRlclBhdGhzKHBhdGhzKSk7XG4gIH1cblxuICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkIHx8IGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIFRleHRcIiwgXCJcIik7XG4gICAgaWYgKGVudHJ5LnRleHQgIT09IHVuZGVmaW5lZCkgbGluZXMucHVzaChgU291cmNlOiAke0pTT04uc3RyaW5naWZ5KGVudHJ5LnRleHQpfWApO1xuICAgIGlmIChlbnRyeS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCAmJiBlbnRyeS5yZW5kZXJlZFRleHQgIT09IGVudHJ5LnRleHQpIHtcbiAgICAgIGxpbmVzLnB1c2goYFJlbmRlcmVkOiAke0pTT04uc3RyaW5naWZ5KGVudHJ5LnJlbmRlcmVkVGV4dCl9YCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGVudHJ5Lm91dGVySFRNTCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIE1hcmt1cFwiLCBcIlwiLCBcImBgYGh0bWxcIiwgZW50cnkub3V0ZXJIVE1MLCBcImBgYFwiKTtcbiAgfVxuXG4gIGlmIChmZWVkYmFjay5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgTm90ZXMgJiBjb21tZW50c1wiLCBcIlwiKTtcbiAgICBmb3IgKGNvbnN0IGZiIG9mIGZlZWRiYWNrKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gdHlwZW9mIGZiLnRleHQgPT09IFwic3RyaW5nXCIgPyBmYi50ZXh0IDogXCJcIjtcbiAgICAgIGNvbnN0IHRhZ3MgPSBBcnJheS5pc0FycmF5KGZiLnRhZ3MpICYmIGZiLnRhZ3MubGVuZ3RoID8gYCBfKCR7ZmIudGFncy5qb2luKFwiLCBcIil9KV9gIDogXCJcIjtcbiAgICAgIGxpbmVzLnB1c2goYC0gJHt0ZXh0fSR7dGFnc31gKTtcbiAgICB9XG4gIH1cblxuICBpZiAobWVtYmVycy5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgR3JvdXBlZCB3aXRoXCIsIFwiXCIpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZW1iZXJzKSB7XG4gICAgICBjb25zdCBtZSA9IG5vcm1hbGl6ZUNhcHR1cmUobSkuZW50cnk7XG4gICAgICBsaW5lcy5wdXNoKGAtICR7aGVhZGluZyhtZSl9IOKAlCBcXGAke21lLnNlbGVjdG9yID8/IG1lLnRhZyA/PyBcIj9cIn1cXGBgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGluZXMuam9pbihcIlxcblwiKSArIFwiXFxuXCI7XG59O1xuIiwKICAgICIvLyBQaW5jaEdyYWIgc2lkZS1wYW5lbCBVSS4gUmVjZWl2ZXMgY2FwdHVyZXMgKyBob3ZlcnMgZnJvbSB0aGUgY29udGVudFxuLy8gc2NyaXB0OyByZW5kZXJzIHRoZSBjaGF0LWJ1YmJsZSB0aW1lbGluZSwgZXhwb3J0cywgdmFsaWRhdGVzLCBldGMuXG4vL1xuLy8gRGVjb21wb3NlZCBpbnRvIHNtYWxsIGZpbGVzIGZvciBjbGFyaXR5OlxuLy8gICDigKIgdHlwZXMudHMgICAgICDigJQgc2hhcmVkIHR5cGVzLCBtZXNzYWdlIHByb3RvY29sXG4vLyAgIOKAoiBsdWNpZGUudHMgICAgIOKAlCBpY29uIHJlZ2lzdHJ5XG4vLyAgIOKAoiB0aGlzIGZpbGUgICAgIOKAlCB3aXJlLXVwIC8gcmVuZGVyaW5nIC8gZXhwb3J0IGJ1aWxkZXJzXG4vL1xuLy8gTG9hZGVkIGFzIHRoZSBzaWRlIHBhbmVsIHBhZ2U6IGNocm9tZS5zaWRlUGFuZWwgZGVmYXVsdF9wYXRoLlxuXG5pbXBvcnQgdHlwZSB7XG4gIEFubm90YXRpb25QYXlsb2FkLCBDc1RvUGFuZWwsIEVudHJ5LCBFeHBvcnREaWFnbm9zdGljLCBFeHBvcnRNYW5pZmVzdCwgRmVlZGJhY2tNZXNzYWdlLCBQYWdlTWVzc2FnZSxcbiAgUGFnZVNuYXBzaG90LCBQYW5lbE1lc3NhZ2UsIFBhbmVsVG9CZywgUGFuZWxUb0NzLCBQZ0VudmVsb3BlLCBTYXZlUmVwbHksIFNlbGVjdG9yTWVzc2FnZSwgU2hvdFJlcGx5LCBWaWV3cG9ydCxcbn0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge3BnfSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7UEdfSUNPTlN9IGZyb20gJy4vbHVjaWRlLnRzJztcbmltcG9ydCB7YnVpbGRUYXIsIHdyYXBac3RkLCB0eXBlIFRhckVudHJ5fSBmcm9tICcuL3Rhci50cyc7XG5pbXBvcnQge1RFTVBMQVRFU19QUkVTRU5UfSBmcm9tICcuL3RlbXBsYXRlcy5nZW4udHMnO1xuaW1wb3J0IHtCVU5ETEVEX1NLSUxMU19QUkVTRU5ULCBCVU5ETEVEX1NLSUxMX0ZJTEVTfSBmcm9tICcuL2J1bmRsZWQtc2tpbGxzLmdlbi50cyc7XG5pbXBvcnQge2J1aWxkQWdlbnRQcm9tcHRKc29ubCwgYnVpbGRBZ2VudFByb3RvY29sTWQsIGJ1aWxkQnVuZGxlSWdub3JlLCBpc1NpZ25hbFBhdGgsIHR5cGUgU2tpbGxzSW5kZXh9IGZyb20gJy4vZXhwb3J0LWFnZW50LXByb21wdC5tanMnO1xuaW1wb3J0IHtzZXJpYWxpemVDYXB0dXJlSnNvbn0gZnJvbSAnLi9leHBvcnQtY2FwdHVyZS5tanMnO1xuXG4oKCkgPT4ge1xuICBjb25zdCBMT0cgPSAnW1BpbmNoR3JhYi9zcF0nO1xuICBjb25zdCBQUkVGU19TVE9SQUdFX05BTUUgPSAncGluY2hncmFiLnByZWZzLnYyJztcbiAgY29uc3QgV09SS1NQQUNFU19LRVkgPSAncGluY2hncmFiLndvcmtzcGFjZXMudjEnO1xuICBjb25zdCBpbkV4dGVuc2lvbiA9IHR5cGVvZiBjaHJvbWUgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4oY2hyb21lLnJ1bnRpbWU/LmlkKTtcblxuICAvLyDilIDilIDilIAgVGVtcGxhdGUgcmVzb3VyY2UgbG9hZGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBFYXJsaWVyIHRoZSB0ZW1wbGF0ZXMgd2VyZSBiYWtlZCBhcyBzdHJpbmcgY29uc3RhbnRzIGludG8gdGhpcyBJSUZFXG4gIC8vICh+MzYwS0IgYWNyb3NzIERFU0lHTiArIFNLSUxMKS4gVGhhdCBibG9hdGVkIHRoZSBzaWRlcGFuZWwgYnVuZGxlIHRvXG4gIC8vIH4xLjk1TUIgYW5kIHNsb3dlZCBmaXJzdC1vcGVuIHBhcnNlIHRpbWUgbm90aWNlYWJseS4gVGhleSBub3cgc2hpcCBhc1xuICAvLyBzZXBhcmF0ZSBgLm1kYCBmaWxlcyB1bmRlciBgZXh0ZW5zaW9uL3RlbXBsYXRlcy9gIGFuZCBsb2FkIG9uIGRlbWFuZFxuICAvLyB2aWEgZmV0Y2gg4oCUIHdoZW4gdGhlIHVzZXIgb3BlbnMgdGhlIGVkaXRvciBtb2RhbCwgb3Igd2hlbiB0aGUgZXhwb3J0XG4gIC8vIHBpcGVsaW5lIG5lZWRzIHRvIGJ1bmRsZSBhIGZhbGxiYWNrLlxuICAvL1xuICAvLyBDYWNoZSByZXN1bHRzIGluLXByb2Nlc3Mgc28gcmVwZWF0IHJlYWRzIChtb2RhbCBvcGVuIOKGkiBjbG9zZSDihpIgcmVvcGVuLFxuICAvLyBvciBzZXF1ZW50aWFsIGV4cG9ydHMpIGRvbid0IHJlLWZldGNoLlxuICBjb25zdCB0ZW1wbGF0ZUNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgVEVNUExBVEVfRklMRVMgPSB7XG4gICAgZGVzaWduVGVtcGxhdGU6ICdERVNJR04udGVtcGxhdGUubWQnLFxuICAgIHNraWxsVGVtcGxhdGU6ICdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLFxuICAgIGxvY2FsRGVzaWduOiAnbG9jYWwuREVTSUdOLm1kJyxcbiAgICBsb2NhbFNraWxsOiAnbG9jYWwuU0tJTEwubWQnLFxuICB9IGFzIGNvbnN0O1xuICB0eXBlIFRlbXBsYXRlS2V5ID0ga2V5b2YgdHlwZW9mIFRFTVBMQVRFX0ZJTEVTO1xuICBjb25zdCB0ZW1wbGF0ZVVybCA9IChmaWxlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIC8vIEluc2lkZSB0aGUgZXh0ZW5zaW9uLCB0aGUgc2lkZXBhbmVsIHJ1bnMgZnJvbVxuICAgIC8vIGNocm9tZS1leHRlbnNpb246Ly88aWQ+L3NpZGVwYW5lbC5odG1sLCBzbyByZXNvdXJjZXMgcmVzb2x2ZSB2aWFcbiAgICAvLyBjaHJvbWUucnVudGltZS5nZXRVUkwuIFRoZSBQbGF5d3JpZ2h0IHN0YXRpYy1zZXJ2ZXIgdGVzdHMgc2VydmVcbiAgICAvLyBgL3RlbXBsYXRlcy88ZmlsZT5gIGZyb20gdGhlIGV4dGVuc2lvbiByb290IGRpcmVjdGx5LCBzbyBhXG4gICAgLy8gcmVsYXRpdmUgVVJMIHdvcmtzIHRoZXJlIGFzIGEgZmFsbGJhY2suXG4gICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRVUkwpIHtcbiAgICAgIHJldHVybiBjaHJvbWUucnVudGltZS5nZXRVUkwoYHRlbXBsYXRlcy8ke2ZpbGV9YCk7XG4gICAgfVxuICAgIHJldHVybiBgdGVtcGxhdGVzLyR7ZmlsZX1gO1xuICB9O1xuICBjb25zdCBsb2FkVGVtcGxhdGUgPSBhc3luYyAoa2V5OiBUZW1wbGF0ZUtleSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKCFURU1QTEFURVNfUFJFU0VOVFtrZXldKSByZXR1cm4gJyc7XG4gICAgY29uc3QgZmlsZSA9IFRFTVBMQVRFX0ZJTEVTW2tleV07XG4gICAgY29uc3QgY2FjaGVkID0gdGVtcGxhdGVDYWNoZS5nZXQoZmlsZSk7XG4gICAgaWYgKGNhY2hlZCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gY2FjaGVkO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh0ZW1wbGF0ZVVybChmaWxlKSk7XG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKGBzdGF0dXMgJHtyZXMuc3RhdHVzfWApO1xuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlcy50ZXh0KCk7XG4gICAgICB0ZW1wbGF0ZUNhY2hlLnNldChmaWxlLCB0ZXh0KTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgYHRlbXBsYXRlIGZldGNoIGZhaWxlZDogJHtmaWxlfWAsIGVycik7XG4gICAgICB0ZW1wbGF0ZUNhY2hlLnNldChmaWxlLCAnJyk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9O1xuICAvLyBFZmZlY3RpdmUgY29udGVudCB1c2VkIGJ5IHRoZSBleHBvcnQgcGlwZWxpbmUgYW5kIHRoZSBtb2RhbC4gV2hlbiB0aGVcbiAgLy8gdXNlciBoYXMgY3VzdG9taXplZCB2aWEgdGhlIHRleHRhcmVhL3VwbG9hZCwgdGhhdCB3aW5zOyBvdGhlcndpc2UgdGhlXG4gIC8vIFBMQUlOIFNUT0NLIHRlbXBsYXRlLiBUaGUgb2xkIGBsb2NhbC4qYCBkZXYtb3ZlcnJpZGUgcHJlZmVyZW5jZSBpc1xuICAvLyBnb25lIChvcGVyYXRvciBydWxpbmcgMjAyNi0wNy0xMSk6IGl0IHNpbGVudGx5IHN1YnN0aXR1dGVkIHRoZVxuICAvLyBkZXZlbG9wZXIncyBvd24gYnJhbmQgZmlsZXMgYXMgdGhlIFwiZGVmYXVsdFwiLCBjb250YW1pbmF0aW5nIGV4cG9ydHNcbiAgLy8gdGhhdCB0aGUgbWFuaWZlc3Qgc3RpbGwgZmxhZ2dlZCBhcyBidW5kbGVkLWRlZmF1bHQgY29udGVudC5cbiAgY29uc3QgcmVzb2x2ZURlc2lnbkNvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuZGVzaWduTWQgJiYgcHJlZnMuZGVzaWduTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuZGVzaWduTWQ7XG4gICAgcmV0dXJuIGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKTtcbiAgfTtcbiAgY29uc3QgcmVzb2x2ZVNraWxsQ29udGVudCA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmIChwcmVmcy5za2lsbE1kICYmIHByZWZzLnNraWxsTWQudHJpbSgpKSByZXR1cm4gcHJlZnMuc2tpbGxNZDtcbiAgICByZXR1cm4gbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJyk7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDihpIgcHJlZnMue2Rlc2lnbk1kfHNraWxsTWR9IGlzXG4gIC8vIGVtcHR5IGFuZCB3ZSdyZSBmYWxsaW5nIGJhY2sgdG8gYSBidW5kbGVkIHRlbXBsYXRlL2xvY2FsIHJlc291cmNlLlxuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24gPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuZGVzaWduTWQgfHwgIXByZWZzLmRlc2lnbk1kLnRyaW0oKTtcbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlU2tpbGwgPSAoKTogYm9vbGVhbiA9PiAhcHJlZnMuc2tpbGxNZCB8fCAhcHJlZnMuc2tpbGxNZC50cmltKCk7XG5cbiAgLy8gVmVuZG9yZWQgdGhpcmQtcGFydHkgc2tpbGwgcmVzb3VyY2VzIChpbXBlY2NhYmxlIHJlZmVyZW5jZSBzZXQgK1xuICAvLyBwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbiksIHNoaXBwZWQgdW5kZXIgZXh0ZW5zaW9uL3NraWxscy8gYnkgdGhlIGJ1aWxkXG4gIC8vIGFuZCBpbmxpbmVkIGludG8gYnVuZGxlIGV4cG9ydHMuIFNhbWUgbGF6eSBmZXRjaCArIGNhY2hlIHBhdHRlcm4gYXMgdGhlXG4gIC8vIHRlbXBsYXRlcyBhYm92ZS5cbiAgY29uc3QgYnVuZGxlZFNraWxsQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBsb2FkQnVuZGxlZFNraWxsRmlsZSA9IGFzeW5jIChleHRQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+ID0+IHtcbiAgICBjb25zdCBjYWNoZWQgPSBidW5kbGVkU2tpbGxDYWNoZS5nZXQoZXh0UGF0aCk7XG4gICAgaWYgKGNhY2hlZCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gY2FjaGVkO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB1cmwgPSBpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0VVJMID8gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKGV4dFBhdGgpIDogZXh0UGF0aDtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKGBzdGF0dXMgJHtyZXMuc3RhdHVzfWApO1xuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlcy50ZXh0KCk7XG4gICAgICBidW5kbGVkU2tpbGxDYWNoZS5zZXQoZXh0UGF0aCwgdGV4dCk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csIGBidW5kbGVkIHNraWxsIGZldGNoIGZhaWxlZDogJHtleHRQYXRofWAsIGVycik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0b3JhZ2UgYWRhcHRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgU3RvcmUgPSB7XG4gICAgYXN5bmMgZ2V0PFQ+KGtleTogc3RyaW5nLCBmYWxsYmFjazogVCk6IFByb21pc2U8VD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBjb25zdCBvID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7IHJldHVybiAob1trZXldIGFzIFQpID8/IGZhbGxiYWNrOyB9XG4gICAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBjb25zdCByID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTsgcmV0dXJuIHIgPT09IG51bGwgPyBmYWxsYmFjayA6IChKU09OLnBhcnNlKHIpIGFzIFQpOyB9XG4gICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgIH0sXG4gICAgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYgKGluRXh0ZW5zaW9uICYmIGNocm9tZS5zdG9yYWdlPy5sb2NhbCkge1xuICAgICAgICB0cnkgeyBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1trZXldOiB2YWx1ZX0pOyByZXR1cm47IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgfVxuICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9LFxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBET00gcmVmcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgJCA9IDxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50PihzOiBzdHJpbmcpOiBUID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocykgYXMgVDtcbiAgY29uc3QgbGlzdCA9ICQoJ1tkYXRhLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBvc2VyID0gJDxIVE1MVGV4dEFyZWFFbGVtZW50PignW2RhdGEtY29tcG9zZXJdJyk7XG4gIGNvbnN0IHN0YXR1cyA9ICQoJ1tkYXRhLXN0YXR1c10nKTtcbiAgY29uc3Qgc2VhcmNoID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtc2VhcmNoXScpO1xuICAvLyBDdHJsK0YgdmlzdWFsLWZpbmQgYmFyIChkaXN0aW5jdCBmcm9tIHRoZSBoZWFkZXIgc2VhcmNoLCB3aGljaCBvcGVucyB0aGVcbiAgLy8gY29tbWFuZCBwYWxldHRlKS4gTWF5IGJlIGFic2VudCBpbiB2ZXJ5IG9sZCBjYWNoZWQgbWFya3VwLCBzbyBjb25zdW1lcnNcbiAgLy8gbnVsbC1ndWFyZC5cbiAgY29uc3QgZmluZEJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1maW5kLWJhcl0nKTtcbiAgY29uc3QgZmluZElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtZmluZF0nKTtcbiAgY29uc3QgZmluZENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWZpbmQtY291bnRdJyk7XG4gIC8vIENhbm9uaWNhbGl6ZSBrZXlib2FyZC1zaG9ydGN1dCBwaWxscyBwZXIgcGxhdGZvcm0uIEV2ZXJ5IHNob3J0Y3V0IHBpbGxcbiAgLy8gaXMgYXV0aG9yZWQgaW4gdGhlIGNhbm9uaWNhbCBDbWQtZm9ybSAoZWFjaCB0b2tlbiBjYXBpdGFsaXplZCwgam9pbmVkXG4gIC8vIHdpdGggJysnOiBBbHQrQ2xpY2ssIENtZCtLLCBDbWQrU2hpZnQrWik7IG9uIG5vbi1NYWMgd2Ugc3dhcCB0aGUgbGVhZGluZ1xuICAvLyBDbWQgbW9kaWZpZXIgZm9yIEN0cmwuIFBpbGxzIG9wdCBpbiB2aWEgZGF0YS1tb2QtKiBzbyBhIHN0cmluZyBsaWtlIHRoZVxuICAvLyAnQWx0K+KApicgcGlsbHMgKHdoaWNoIG5ldmVyIGNhcnJ5IENtZCkgYXJlIGxlZnQgdW50b3VjaGVkLlxuICBjb25zdCBpc01hYyA9IC9NYWN8aVBob25lfGlQYWQvaS50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSB8fCBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnKTtcbiAgaWYgKCFpc01hYykge1xuICAgIGZvciAoY29uc3QgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ2tiZFtkYXRhLW1vZC1rXSwga2JkW2RhdGEtbW9kLXpdLCBrYmRbZGF0YS1tb2Qtc2hpZnQtel0nKSkge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSAoZWwudGV4dENvbnRlbnQgPz8gJycpLnJlcGxhY2UoL15DbWRcXGIvLCAnQ3RybCcpO1xuICAgIH1cbiAgfVxuICBjb25zdCBpbXBvcnRGaWxlID0gJDxIVE1MSW5wdXRFbGVtZW50PignI2ltcG9ydC1maWxlJyk7XG4gIGNvbnN0IHN0YXRzRWwgPSAkKCdbZGF0YS1zdGF0c10nKTtcbiAgY29uc3Qgc3RhcnNFbCA9ICQoJ1tkYXRhLXN0YXJzXScpO1xuICBjb25zdCB0b29sdGlwRWwgPSAkKCdbZGF0YS10b29sdGlwXScpO1xuICBjb25zdCBkcmlsbGRvd25FbCA9ICQoJ1tkYXRhLWRyaWxsZG93bl0nKTtcbiAgY29uc3QgZHJhd2VyID0gJCgnW2RhdGEtZHJhd2VyXScpO1xuICBjb25zdCBwYWxldHRlID0gJCgnW2RhdGEtcGFsZXR0ZV0nKTtcbiAgY29uc3QgcGFsZXR0ZUlucHV0ID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcGFsZXR0ZS1pbnB1dF0nKTtcbiAgY29uc3QgcGFsZXR0ZUxpc3QgPSAkKCdbZGF0YS1wYWxldHRlLWxpc3RdJyk7XG4gIGNvbnN0IGNvbXBXb3JkcyA9ICQoJ1tkYXRhLWNvbXAtd29yZHNdJyk7XG4gIGNvbnN0IGNvbXBUb2tlbnMgPSAkKCdbZGF0YS1jb21wLXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFRva2VucyA9ICQoJ1tkYXRhLXN0YXQtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0V29yZHMgPSAkKCdbZGF0YS1zdGF0LXdvcmRzXScpO1xuICBjb25zdCB3c1NlbGVjdCA9ICQ8SFRNTFNlbGVjdEVsZW1lbnQ+KCdbZGF0YS13b3Jrc3BhY2VdJyk7XG4gIGNvbnN0IHdzTGlzdCA9ICQoJ1tkYXRhLXdzLWxpc3RdJyk7XG4gIGNvbnN0IHdzTmFtZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXdzLW5hbWVdJyk7XG5cbiAgY29uc3QgbW91bnRJY29ucyA9IChyb290OiBQYXJlbnROb2RlID0gZG9jdW1lbnQpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWljb25dJykpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvbicpO1xuICAgICAgY29uc3Qgc2l6ZSA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScpID8/IDE2KTtcbiAgICAgIGlmIChuYW1lICYmIFBHX0lDT05TLmhhcyhuYW1lKSkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICAgIH1cbiAgfTtcbiAgbW91bnRJY29ucygpO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiBib29sZWFuO1xuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IGJvb2xlYW47XG4gICAgaW5jbHVkZVN0eWxlczogYm9vbGVhbjtcbiAgICBtaW5pZnk6IGJvb2xlYW47XG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogYm9vbGVhbjtcbiAgICB1c2VTY3JlZW5zaG90czogYm9vbGVhbjtcbiAgICBzcGFjaW5nT3ZlcmxheTogYm9vbGVhbjtcbiAgICBob3ZlclNuYXA6IGJvb2xlYW47XG4gICAgYXV0b1NjcmVlbnNob3Q6IGJvb2xlYW47XG4gICAgLy8gQ29tbWEtc2VwYXJhdGVkIGhvc3QgcGF0dGVybnMgKHN1YnN0cmluZyBtYXRjaCkuIEhvc3RzIGluIHRoaXMgbGlzdFxuICAgIC8vIHNraXAgdGhlIGVudGlyZSBzY3JlZW5zaG90IHBpcGVsaW5lIOKAlCB1c2VmdWwgZm9yIHNlbnNpdGl2ZSBwYWdlc1xuICAgIC8vIChiYW5raW5nLCBpbnRlcm5hbCBhZG1pbikgd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IFBOR3MgbGFuZGluZ1xuICAgIC8vIG9uIGRpc2suXG4gICAgc2tpcFNjcmVlbnNob3RIb3N0czogc3RyaW5nO1xuICAgIC8vIElubGluZSBERVNJR04ubWQgY29udGVudCB0aGUgdXNlciBwYXN0ZWQgb3IgdXBsb2FkZWQgdmlhIHRoZSBzaWRlXG4gICAgLy8gcGFuZWwgc2V0dGluZ3MuIERlZmF1bHRzIHRvIGEgdGVtcGxhdGVkIHBsYWNlaG9sZGVyIHNvIG91dC1vZi10aGUtXG4gICAgLy8gYm94IGV4cG9ydHMgYWx3YXlzIGluY2x1ZGUgYSBERVNJR04ubWQg4oCUIHRoZSBjb25zdW1lciBMTE0gY2FuXG4gICAgLy8gZWl0aGVyIHdvcmsgZnJvbSB0aGUgcGxhY2Vob2xkZXIgKGFuZCBhc2sgZm9yIHRoZSByZWFsIG9uZSkgb3JcbiAgICAvLyBmcm9tIGEgdXNlci1jdXN0b21pemVkIGNvcHkuIFRoZSBzZXR0aW5ncyBVSSBmbGFncyB0aGlzIGJhbm5lci1cbiAgICAvLyBzdHlsZSB3aGVuIHRoZSB2YWx1ZSBzdGlsbCBtYXRjaGVzIHRoZSB0ZW1wbGF0ZSBzbyB0aGUgdXNlclxuICAgIC8vIGtub3dzIHRvIGZpbGwgaXQgaW4uXG4gICAgZGVzaWduTWQ6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIHRoZSByZWNlaXZlciBzaG91bGQgcmVhZCBERVNJR04ubWQgZnJvbS4gRGVmYXVsdHNcbiAgICAvLyB0byBgfi8uYWdlbnRzL0RFU0lHTi5tZGA7IHVzZXIgY2FuIG92ZXJyaWRlIHBlci1tYWNoaW5lLlxuICAgIGRlc2lnblBhdGg6IHN0cmluZztcbiAgICAvLyBSZXNvbHZlZCBwYXRoIG9mIHRoZSBQaW5jaEdyYWIgVUkgc2tpbGwgb24gdGhlIHJlY2VpdmVyJ3NcbiAgICAvLyBmaWxlc3lzdGVtLiBUaGUgc2tpbGwgY29udGVudCBpdHNlbGYgaXMgYnVuZGxlZCBpbmxpbmUgaW50byB0aGVcbiAgICAvLyBhcmNoaXZlIChzZWUgYHNraWxsTWRgKSwgc28gdGhpcyBpcyBhIGhpbnQgZm9yIHJlY2VpdmVycyB0aGF0XG4gICAgLy8gd2FudCB0byBwZXJzaXN0IHRoZSBza2lsbCBhdCBhIGNhbm9uaWNhbCBsb2NhdGlvbi5cbiAgICBza2lsbFBhdGg6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgVUktc2tpbGwgY29udGVudC4gRGVmYXVsdCBpcyB0aGUgYnVuZGxlZCBQaW5jaEdyYWIgdHJpYWdlXG4gICAgLy8gc2tpbGwgdGVtcGxhdGU7IHVzZXIgY2FuIGN1c3RvbWl6ZSB2aWEgc2V0dGluZ3MgcGFzdGUvdXBsb2FkLlxuICAgIC8vIEJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSBhdCBgLi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgLlxuICAgIHNraWxsTWQ6IHN0cmluZztcbiAgICAvLyBXaGVuIHRydWUsIGZpcmUgYSBmcmVzaCBwYWdlIHNjcmVlbnNob3Qgb24gRVZFUlkgY2FwdHVyZSByYXRoZXJcbiAgICAvLyB0aGFuIG9uY2UgcGVyICh3b3Jrc3BhY2UsIHVybCkgdHVwbGUuIFVzZWZ1bCBmb3IgY2FwdHVyaW5nIGFcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3cgd2hlcmUgdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzLlxuICAgIC8vIERlZmF1bHQgZmFsc2Ug4oCUIG1vc3QgdXNlcnMgd2FudCB0aGUgZGVmYXVsdCBmaXJzdC1vbmx5IGJlaGF2aW9yXG4gICAgLy8gc2luY2UgcGFnZSBzY3JlZW5zaG90cyBhcmUgbGFyZ2UgYW5kIHRoZSBmaXJzdCBvbmUgYWxyZWFkeSBnaXZlc1xuICAgIC8vIGEgc2Vzc2lvbi1sZXZlbCByZWZlcmVuY2UuXG4gICAgcGFnZVNob3RQZXJDYXB0dXJlOiBib29sZWFuO1xuICAgIC8vIFN1cHByZXNzIENocm9tZSdzIGRvd25sb2FkIGJ1YmJsZSB3aGlsZSBQaW5jaEdyYWIgd3JpdGVzIGl0cyBvd25cbiAgICAvLyBmaWxlcyAoc2NyZWVuc2hvdHMgKyBleHBvcnRzKS4gUmVxdWlyZXMgdGhlIG9wdGlvbmFsIGBkb3dubG9hZHMudWlgXG4gICAgLy8gcGVybWlzc2lvbi4gRGVmYXVsdCBPTiBhcyBpbnRlbnQ7IHVudGlsIHRoZSBwZXJtaXNzaW9uIGlzIGFjdHVhbGx5XG4gICAgLy8gZ3JhbnRlZCAobmVlZHMgYSB1c2VyIGdlc3R1cmUg4oCUIHRoZSBudWRnZSBiYW5uZXIgb3IgdGhlIHNldHRpbmdzXG4gICAgLy8gY2hlY2tib3gpLCBzYXZlcyBzdGF5IHZpc2libGUuXG4gICAgcXVpZXRTYXZlczogYm9vbGVhbjtcbiAgICAvLyBUaGUgdXNlciBkaXNtaXNzZWQgdGhlIHF1aWV0LXNhdmVzIG51ZGdlIGJhbm5lciDigJQgbmV2ZXIgcmUtc2hvdyBpdC5cbiAgICBxdWlldE51ZGdlRGlzbWlzc2VkOiBib29sZWFuO1xuICAgIC8vIENvbnRpbnVvdXNseSBtaXJyb3IgdGhlIHdvcmtzcGFjZSBKU09OTCB0byBkaXNrIChiZXNpZGUgc2NyZWVuc2hvdHMpXG4gICAgLy8gc28gY2FwdHVyZXMgKyBjb21tZW50cyBzdXJ2aXZlIGEgc3RvcmFnZSBjbGVhciAvIGV4dGVuc2lvbiByZWluc3RhbGwuXG4gICAgLy8gT24gYnkgZGVmYXVsdCDigJQgdGhpcyBpcyB0aGUgc2FmZXR5IG5ldCBhZ2FpbnN0IHNpbGVudCBhbm5vdGF0aW9uIGxvc3MuXG4gICAgYXV0b3NhdmVUb0Rpc2s6IGJvb2xlYW47XG4gICAgLy8gQnVuZGxlIHRoZSB2ZW5kb3JlZCB0aGlyZC1wYXJ0eSBkZXNpZ24gc2tpbGxzIChpbXBlY2NhYmxlIHJlZmVyZW5jZVxuICAgIC8vIHNldCArIHBlcmNlcHRpb24tZmlyc3QtZGVzaWduKSBwbHVzIHNraWxscy1pbmRleC5qc29uIGludG8gYXJjaGl2ZVxuICAgIC8vIGV4cG9ydHMuIE9uIGJ5IGRlZmF1bHQ6IHRoZSBTZW5kLXRvLUFnZW50IHByb3RvY29sJ3Mgc2tpbGwtbWFwcGluZ1xuICAgIC8vIHBoYXNlIGFzc3VtZXMgdGhlaXIgcHJlc2VuY2UuIH4xLjIgTUIgb2YgbWFya2Rvd24gcGVyIGJ1bmRsZS5cbiAgICBidW5kbGVTa2lsbHM6IGJvb2xlYW47XG4gICAgLy8gQnVuZGxlIHRoZSBmdWxsIHNlcmlhbGl6ZWQgSFRNTCBvZiBlYWNoIGNhcHR1cmVkIHBhZ2UgdW5kZXIgcGFnZXMvLlxuICAgIC8vIE9mZiBieSBkZWZhdWx0IChkb2N1bWVudHMgY2FuIGJlIGh1Z2UpOyBjb2xsZWN0ZWQgbGF6aWx5IGF0IGV4cG9ydFxuICAgIC8vIHRpbWUgZnJvbSBsaXZlIHRhYnMsIG5ldmVyIHBlcnNpc3RlZCB0byBjaHJvbWUuc3RvcmFnZS5cbiAgICBpbmNsdWRlUGFnZUhUTUw6IGJvb2xlYW47XG4gIH07XG4gIGNvbnN0IERFRkFVTFRfUFJFRlM6IFByZWZzID0ge1xuICAgIGluY2x1ZGVPdXRlckhUTUw6IHRydWUsXG4gICAgaW5jbHVkZU1hdGNoZWRSdWxlczogdHJ1ZSxcbiAgICBpbmNsdWRlU3R5bGVzOiB0cnVlLFxuICAgIC8vIERlZmF1bHQgdG8gbWluaWZpZWQgZXhwb3J0cyDigJQgbW9zdCBhZ2VudHMgd2FudCB0aGUgc21hbGxlc3RcbiAgICAvLyB0b2tlbi1mb290cHJpbnQgcGF5bG9hZC4gRXhpc3RpbmcgdXNlcnMnIHNhdmVkIHByZWZzIGFyZSBtZXJnZWQgb3ZlclxuICAgIC8vIHRoaXMgZGVmYXVsdCBpbiBsb2FkQWxsKCksIHNvIG9ubHkgTkVXL3Vuc2V0IGluc3RhbGxzIHNlZSB0aGUgZmxpcC5cbiAgICBtaW5pZnk6IHRydWUsXG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogdHJ1ZSxcbiAgICB1c2VTY3JlZW5zaG90czogdHJ1ZSxcbiAgICBzcGFjaW5nT3ZlcmxheTogZmFsc2UsXG4gICAgaG92ZXJTbmFwOiB0cnVlLFxuICAgIGF1dG9TY3JlZW5zaG90OiB0cnVlLFxuICAgIHNraXBTY3JlZW5zaG90SG9zdHM6ICcnLFxuICAgIC8vIGRlc2lnbk1kIC8gc2tpbGxNZCBkZWZhdWx0IHRvICcnIHdoaWNoIHRoZSByZXNvbHZlciB0cmVhdHMgYXNcbiAgICAvLyBcImZhbGwgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZSBhdCBleHBvcnQgdGltZVwiLiBTdG9yaW5nIHRoZVxuICAgIC8vIGVtcHR5IHN0cmluZyBrZWVwcyBjaHJvbWUuc3RvcmFnZSBzbWFsbCBhbmQgbGV0cyBgaXNVc2luZ1RlbXBsYXRlKmBcbiAgICAvLyBiZSBhIGNoZWFwIHN5bmNocm9ub3VzIGNoZWNrLlxuICAgIGRlc2lnbk1kOiAnJyxcbiAgICBkZXNpZ25QYXRoOiAnfi8uYWdlbnRzL0RFU0lHTi5tZCcsXG4gICAgc2tpbGxQYXRoOiAnfi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLFxuICAgIHNraWxsTWQ6ICcnLFxuICAgIHBhZ2VTaG90UGVyQ2FwdHVyZTogZmFsc2UsXG4gICAgcXVpZXRTYXZlczogdHJ1ZSxcbiAgICBxdWlldE51ZGdlRGlzbWlzc2VkOiBmYWxzZSxcbiAgICBhdXRvc2F2ZVRvRGlzazogdHJ1ZSxcbiAgICBidW5kbGVTa2lsbHM6IHRydWUsXG4gICAgaW5jbHVkZVBhZ2VIVE1MOiBmYWxzZSxcbiAgfTtcblxuICAvLyBSZXdyaXRlIHRoZSBgbmFtZTpgIGZpZWxkIGluIGEgU0tJTEwubWQncyBZQU1MIGZyb250bWF0dGVyLiBUaGVcbiAgLy8gdXNlcidzIHNvdXJjZS1vZi10cnV0aCBTS0lMTC5tZCBpcyBjYXRhbG9ndWVkIHVuZGVyIHdoYXRldmVyIG5hbWVcbiAgLy8gdGhlaXIgd2lkZXIgYC5hZ2VudHMvc2tpbGxzL2AgdHJlZSB1c2VzIChvZnRlbiBgdWlgKTsgdGhlIGJ1bmRsZWRcbiAgLy8gYXJjaGl2ZSBjb3B5IHNob3VsZCBhbHdheXMgaWRlbnRpZnkgYXMgYFBpbmNoR3JhYmAgc28gYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFkaW5nIHRoZSBtYW5pZmVzdCBkb2Vzbid0IGdldCBjb25mdXNlZCBhYm91dCB3aGljaCBza2lsbFxuICAvLyBmaWxlIGFwcGxpZXMuIE9ubHkgdGhlIEZJUlNUIHRvcC1vZi1maWxlIGBuYW1lOmAgbGluZSB3aXRoaW4gdGhlXG4gIC8vIGxlYWRpbmcgYC0tLWAgYmxvY2sgaXMgdG91Y2hlZC5cbiAgY29uc3QgcmVicmFuZFNraWxsTmFtZSA9IChtZDogc3RyaW5nLCBuZXdOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIC8vIFRoZSBmcm9udG1hdHRlciBibG9jaywgaWYgcHJlc2VudCwgaXMgYmV0d2VlbiBsZWFkaW5nIGAtLS1cXG5gXG4gICAgLy8gYW5kIHRoZSBuZXh0IGBcXG4tLS1cXG5gLiBBbnl0aGluZyBlbHNlIChubyBmcm9udG1hdHRlciwgbmFtZSBub3RcbiAgICAvLyBvbiBhIHNpbmdsZSBsaW5lLCBldGMuKSByZXR1cm5zIHVuY2hhbmdlZCDigJQgYmV0dGVyIHRvIHNoaXAgdGhlXG4gICAgLy8gb3JpZ2luYWwgdGhhbiByaXNrIGNvcnJ1cHRpbmcgdGhlIGZpbGUuXG4gICAgY29uc3QgbSA9IG1kLm1hdGNoKC9eLS0tXFxyP1xcbihbXFxzXFxTXSo/KVxccj9cXG4tLS1cXHI/XFxuLyk7XG4gICAgaWYgKCFtKSByZXR1cm4gbWQ7XG4gICAgY29uc3QgZm0gPSBtWzFdITtcbiAgICBjb25zdCByZWJyYW5kZWRGbSA9IGZtLnJlcGxhY2UoL15uYW1lOlxccyouKyQvbSwgYG5hbWU6ICR7bmV3TmFtZX1gKTtcbiAgICBpZiAocmVicmFuZGVkRm0gPT09IGZtKSByZXR1cm4gbWQ7IC8vIG5vIGBuYW1lOmAgZmllbGQ7IG5vdGhpbmcgdG8gZG9cbiAgICByZXR1cm4gbWQucmVwbGFjZShtWzBdLCBgLS0tXFxuJHtyZWJyYW5kZWRGbX1cXG4tLS1cXG5gKTtcbiAgfTtcbiAgdHlwZSBXb3Jrc3BhY2UgPSB7bmFtZTogc3RyaW5nOyBjcmVhdGVkQXQ6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXI7IHVybD86IHN0cmluZzsgdGl0bGU/OiBzdHJpbmd9O1xuICAvLyBPbmUgYXJjaGl2ZWQgc3RhdGUgb2YgYSB3b3Jrc3BhY2UgKGNhcHR1cmVkIGp1c3QgYmVmb3JlIGEgQ2xlYXItYWxsKS5cbiAgLy8gYHNob3RzYCBpcyB0aGUgdGh1bWJuYWlsIG1hcCAoZnVsbC1yZXMgUE5HcyBhcmUgc2Vzc2lvbi1vbmx5IGFuZCBub3RcbiAgLy8gYXJjaGl2ZWQpLiBSZXN0b3JhYmxlIGZyb20gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMuXG4gIHR5cGUgV29ya3NwYWNlU25hcHNob3QgPSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICB0czogc3RyaW5nO1xuICAgIG1lc3NhZ2VzOiBQYW5lbE1lc3NhZ2VbXTtcbiAgICBzaG90czogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBjb21tZW50czogbnVtYmVyO1xuICB9O1xuXG4gIGxldCBtZXNzYWdlczogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgbGV0IGxpdmVUYWJVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgbGl2ZVRhYlBhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBzZWxlY3RvclZhbGlkaXR5ID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4gfCAnZGlmZi1wYWdlJz4oKTtcbiAgY29uc3Qgc2VsZWN0b3JFcnJvcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBjb25zdCBpbnNlcnRCZWZvcmU6IHtjdXJyZW50OiBzdHJpbmcgfCBudWxsOyBjb21tZW50OiBib29sZWFufSA9IHtjdXJyZW50OiBudWxsLCBjb21tZW50OiBmYWxzZX07XG4gIGxldCBzZWFyY2hRdWVyeSA9ICcnO1xuICBsZXQgbGFzdEFjdGl2ZVNlbGVjdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IHN0aWNreVRpbWVyID0gMDtcbiAgbGV0IFNUSUNLWV9UVExfTVMgPSA1XzAwMDtcbiAgbGV0IHBhbmVsSG92ZXJlZCA9IGZhbHNlO1xuICBsZXQgcGhhbnRvbVRhcmdldDoge3NlbGVjdG9yOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHRhZz86IHN0cmluZzsgcmVjdD86IERPTVJlY3R9IHwgbnVsbCA9IG51bGw7XG4gIGxldCBwZW5kaW5nTXVsdGk6IEVudHJ5W10gPSBbXTtcbiAgY29uc3Qgc2hvdHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAvLyBGdWxsLXJlc29sdXRpb24gUE5HIGRhdGFVUkwgcGVyIHNlbGVjdG9yLiBOT1QgcGVyc2lzdGVkIHRvXG4gIC8vIGNocm9tZS5zdG9yYWdlIChjYXAgcHJlc3N1cmUg4oCUIDEwMCBjYXB0dXJlcyDDlyA4MCBLQiBlYWNoID0gOCBNQiksIHNvXG4gIC8vIGl0J3Mgb25seSBhdmFpbGFibGUgZm9yIHRoZSBjdXJyZW50IHNlc3Npb24ncyBhcmNoaXZlIGV4cG9ydC4gQ2xlYXJlZFxuICAvLyBvbiB3b3Jrc3BhY2Ugc3dpdGNoLlxuICBjb25zdCBzaG90c0Z1bGwgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAvLyBUcmFjayB3aGljaCAod29ya3NwYWNlLCBwYWdlLXVybCkgdHVwbGVzIGFscmVhZHkgZmlyZWQgYSBwYWdlIHNob3Qgc28gd2VcbiAgLy8gZG9uJ3QgcmUtc2hvb3QgdGhlIGVudGlyZSBwYWdlIG9uIGV2ZXJ5IGNhcHR1cmUuIFJlc2V0IG9uIHdvcmtzcGFjZVxuICAvLyBzd2l0Y2gg4oCUIG5vIGRheSBrZXksIHRoZSBkZWR1cGUgaXMgcGVyLXNlc3Npb24uXG4gIGNvbnN0IHBhZ2VTaG90c0ZpcmVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IHBhZ2VTaG90S2V5ID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IGAke2FjdGl2ZVdzfToke3VybH1gO1xuICAvLyBMYXN0IHN1Y2Nlc3NmdWwgZXhwb3J0IOKAlCBib3RoIHRoZSB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoc2hvd24gdG8gdGhlXG4gIC8vIHVzZXIpIGFuZCB0aGUgT1MtYWJzb2x1dGUgcGF0aCAoY29waWVkIGJ5IHRoZSBcIkNvcHkgYXMgcGF0aFwiIGJ1dHRvbikuXG4gIC8vIFVwZGF0ZWQgb24gSlNPTkwvTUQvWklQL3NjcmVlbnNob3Qgc2F2ZXMuXG4gIGNvbnN0IGxhc3RFeHBvcnQ6IHtyZWxQYXRoOiBzdHJpbmcgfCBudWxsOyBhYnNQYXRoOiBzdHJpbmcgfCBudWxsOyBjb3B5UGF0aDogc3RyaW5nIHwgbnVsbDsgdGVtcFBhdGg6IGJvb2xlYW47IGtpbmQ6IHN0cmluZyB8IG51bGw7IGFnZW50UHJvbXB0OiBzdHJpbmcgfCBudWxsfSA9IHtcbiAgICByZWxQYXRoOiBudWxsLCBhYnNQYXRoOiBudWxsLCBjb3B5UGF0aDogbnVsbCwgdGVtcFBhdGg6IGZhbHNlLCBraW5kOiBudWxsLCBhZ2VudFByb21wdDogbnVsbCxcbiAgfTtcbiAgbGV0IHdvcmtzcGFjZXM6IFdvcmtzcGFjZVtdID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gIGxldCBhY3RpdmVXcyA9ICdkZWZhdWx0JztcbiAgLy8gU2Vzc2lvbiB1dWlkIOKAlCBnZW5lcmF0ZWQgb25jZSBwZXIgd29ya3NwYWNlIGJvb3QuIEdvZXMgb250byBldmVyeVxuICAvLyBwYWdlIHJvdyBhbmQgZXZlcnkgc2VsZWN0b3IgZW50cnkgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlc1xuICAvLyB0byBcIndoaWNoIHNlc3Npb24/XCIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuIFN0YWJsZSBhY3Jvc3MgYVxuICAvLyBzaW5nbGUgd29ya3NwYWNlIGxvYWQ7IHJlc2V0cyBvbiB3b3Jrc3BhY2Ugc3dpdGNoLlxuICBsZXQgc2Vzc2lvbklkOiBzdHJpbmcgPSAnJztcbiAgY29uc3Qgd3NNc2dLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5tZXNzYWdlcy52MWA7XG4gIGNvbnN0IHdzU2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90cy52MWA7XG4gIC8vIFBlcnNpc3RlbnQgc25hcHNob3QgaGlzdG9yeSBwZXIgd29ya3NwYWNlIOKAlCBhIENsZWFyLWFsbCBhcmNoaXZlcyB0aGUgd2lwZWRcbiAgLy8gY2FwdHVyZXMrY29tbWVudHMrdGh1bWJuYWlscyBoZXJlIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIGxhdGVyIGZyb21cbiAgLy8gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMuIExpdmVzIGluIHRoZSBzYW1lIGNocm9tZS5zdG9yYWdlIGxheWVyIGFzIHRoZSByZXN0XG4gIC8vIG9mIHRoZSB3b3Jrc3BhY2UgZGF0YS5cbiAgY29uc3Qgd3NTbmFwc2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zbmFwc2hvdHMudjFgO1xuICAvLyBDYXAgc28gdGhlIGhpc3RvcnkgY2FuJ3QgYmFsbG9vbiBzdG9yYWdlOyBvbGRlc3Qgc25hcHNob3RzIGRyb3Agb2ZmLlxuICBjb25zdCBXU19TTkFQU0hPVF9DQVAgPSAxMDtcbiAgY29uc3Qgd3NTaG90c0Z1bGxLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90c0Z1bGwudjFgO1xuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBoYXMgYSAxMCBNQiBkZWZhdWx0IHF1b3RhOyB3ZSBidWRnZXQgaGFsZiBvZlxuICAvLyB0aGF0IGZvciBmdWxsLXJlc29sdXRpb24gUE5HcyAodGhlIHJlc3QgaXMgbWVzc2FnZXMsIHByZWZzLCB0aHVtYnMpLlxuICAvLyBXaGVuIHRoZSBidWRnZXQgaXMgcmVhY2hlZCB3ZSBGSUZPLWV2aWN0IHRoZSBvbGRlc3QgZW50cmllcyAoTWFwXG4gIC8vIHByZXNlcnZlcyBpbnNlcnRpb24gb3JkZXIpLiBFc3RpbWF0ZSBkYXRhVVJMIHNpemUgPSBzdHJpbmcgbGVuZ3RoLlxuICBjb25zdCBTSE9UU19GVUxMX0JVREdFVF9CWVRFUyA9IDUgKiAxMDI0ICogMTAyNDtcbiAgY29uc3QgdW5kb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCByZWRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFVORE9fQ0FQID0gMzA7XG4gIGxldCBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gIGxldCBwcmVmczogUHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGU307XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXR1cyBoZWxwZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzdGF0dXNUaW1lciA9IDA7XG4gIGNvbnN0IHNldFN0YXR1cyA9IChtc2c6IHN0cmluZywgb3B0czoge2tpbmQ/OiAnd2FybicgfCAnaW5mbycgfCAnb2snfSA9IHt9KTogdm9pZCA9PiB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gbXNnIHx8ICcnO1xuICAgIGNsZWFyVGltZW91dChzdGF0dXNUaW1lcik7XG4gICAgaWYgKG1zZykge1xuICAgICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gb3B0cy5raW5kID09PSAnd2FybicgPyAndmFyKC0tcmVkKScgOlxuICAgICAgICBvcHRzLmtpbmQgPT09ICdpbmZvJyA/ICd2YXIoLS10ZXh0LTMpJyA6ICd2YXIoLS1ncmVlbiknO1xuICAgICAgc3RhdHVzVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHN0YXR1cy50ZXh0Q29udGVudCA9ICcnOyB9LCAyMjAwKTtcbiAgICB9XG4gIH07XG4gIGxldCB0b2FzdFRpbWVyID0gMDtcbiAgY29uc3Qgc2hvd1RvYXN0ID0gKHRpdGxlOiBzdHJpbmcsIGRldGFpbCA9ICcnLCBraW5kOiAnb2snIHwgJ3dhcm4nID0gJ29rJyk6IHZvaWQgPT4ge1xuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1jb3B5LXRvYXN0XScpO1xuICAgIGlmICghdG9hc3QpIHtcbiAgICAgIHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAnY29weS10b2FzdCc7XG4gICAgICB0b2FzdC5kYXRhc2V0LmNvcHlUb2FzdCA9ICd0cnVlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRvYXN0KTtcbiAgICB9XG4gICAgdG9hc3QuY2xhc3NMaXN0LnRvZ2dsZSgnd2FybicsIGtpbmQgPT09ICd3YXJuJyk7XG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC1pY29uXCI+JHtQR19JQ09OUy5zdmdTdHJpbmcoa2luZCA9PT0gJ3dhcm4nID8gJ2FsZXJ0LWNpcmNsZScgOiAnY2lyY2xlLWNoZWNrJywgMjIpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC10ZXh0XCI+PGI+JHtlc2NhcGVIdG1sKHRpdGxlKX08L2I+JHtkZXRhaWwgPyBgPHNtYWxsPiR7ZXNjYXBlSHRtbChkZXRhaWwpfTwvc21hbGw+YCA6ICcnfTwvc3Bhbj5gO1xuICAgIHRvYXN0LmhpZGRlbiA9IGZhbHNlO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB2b2lkIHRvYXN0Lm9mZnNldFdpZHRoO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcik7XG4gICAgdG9hc3RUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRvYXN0Py5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IGlmICh0b2FzdCkgdG9hc3QuaGlkZGVuID0gdHJ1ZTsgfSwgMTgwKTtcbiAgICB9LCAxNDUwKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0NvcGllZCA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWwgPSAnJyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICdvaycpO1xuICBjb25zdCBzaG93RG93bmxvYWRFcnJvciA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWw6IHN0cmluZyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICd3YXJuJyk7XG5cbiAgLy8g4pSA4pSA4pSAIFV0aWxpdGllcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGZhbGxiYWNrSWRDb3VudGVyID0gMDtcbiAgY29uc3Qgc2VjdXJlVG9rZW4gPSAoYnl0ZXMgPSAxMik6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBVaW50OEFycmF5KGJ5dGVzKTtcbiAgICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYXcpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocmF3KS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfV8keygrK2ZhbGxiYWNrSWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG1zZ0lkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgaWYgKGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQpIHJldHVybiBnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKCk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggKi8gfVxuICAgIHJldHVybiBgaWRfJHtzZWN1cmVUb2tlbigxNil9YDtcbiAgfTtcbiAgY29uc3QgZXNjYXBlSHRtbCA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBTdHJpbmcocykucmVwbGFjZUFsbCgnJicsICcmYW1wOycpLnJlcGxhY2VBbGwoJzwnLCAnJmx0OycpLnJlcGxhY2VBbGwoJz4nLCAnJmd0OycpO1xuICBjb25zdCBlc2NhcGVSZSA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xuICBjb25zdCBoaWdobGlnaHRNYXRjaCA9ICh0ZXh0OiBzdHJpbmcsIHE6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KTtcbiAgICByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoYCgke2VzY2FwZVJlKHEpfSlgLCAnZ2knKSwgJzxtYXJrPiQxPC9tYXJrPicpO1xuICB9O1xuICAvLyBXYWxrIHRleHQgbm9kZXMgaW5zaWRlIGByb290YCwgd3JhcHBpbmcgY2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGVzIG9mIGBxYFxuICAvLyBpbiA8bWFyaz4gZWxlbWVudHMuIERvZXNuJ3QgdG91Y2ggYXR0cmlidXRlIHN0cmluZ3Mgb3IgaW5uZXItdGFnIEhUTUwgc29cbiAgLy8gaXQncyBzYWZlIHRvIHJ1biBvbiBhbHJlYWR5LWhpZ2hsaWdodGVkIEpTT04gb3V0cHV0LlxuICBjb25zdCB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzID0gKHJvb3Q6IEhUTUxFbGVtZW50LCBxOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoIXEpIHJldHVybjtcbiAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmUocSksICdnaScpO1xuICAgIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIocm9vdCwgTm9kZUZpbHRlci5TSE9XX1RFWFQpO1xuICAgIGNvbnN0IHRhcmdldHM6IFRleHRbXSA9IFtdO1xuICAgIGxldCBub2RlOiBOb2RlIHwgbnVsbDtcbiAgICB3aGlsZSAoKG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgIGlmIChyZS50ZXN0KG5vZGUubm9kZVZhbHVlID8/ICcnKSkgdGFyZ2V0cy5wdXNoKG5vZGUgYXMgVGV4dCk7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFyZ2V0cykge1xuICAgICAgY29uc3QgdmFsdWUgPSB0Lm5vZGVWYWx1ZSA/PyAnJztcbiAgICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBsZXQgbGFzdCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgdmFsdWUubWF0Y2hBbGwocmUpKSB7XG4gICAgICAgIGNvbnN0IGkgPSBtLmluZGV4ID8/IDA7XG4gICAgICAgIGlmIChpID4gbGFzdCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCwgaSkpO1xuICAgICAgICBjb25zdCBtayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21hcmsnKTtcbiAgICAgICAgbWsudGV4dENvbnRlbnQgPSBtWzBdO1xuICAgICAgICBmcmFnLmFwcGVuZChtayk7XG4gICAgICAgIGxhc3QgPSBpICsgbVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICBpZiAobGFzdCA8IHZhbHVlLmxlbmd0aCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCkpO1xuICAgICAgdC5yZXBsYWNlV2l0aChmcmFnKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHdvcmRDb3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gKHMubWF0Y2goL1xcUysvZykgPz8gW10pLmxlbmd0aDtcbiAgY29uc3QgdG9rZW5Db3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gTWF0aC5jZWlsKHMubGVuZ3RoIC8gNCk7XG4gIGNvbnN0IHBhdGhPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5wYXRobmFtZTsgfSBjYXRjaCB7IHJldHVybiB1OyB9IH07XG4gIGNvbnN0IGhvc3RPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5ob3N0OyB9IGNhdGNoIHsgcmV0dXJuICcnOyB9IH07XG4gIC8vIEZpbGVuYW1lLXNhZmUgaG9zdCBzbHVnOiBkb3RzIOKGkiB1bmRlcnNjb3JlcyBwZXIgcHJvamVjdCBjb252ZW50aW9uLlxuICAvLyBNaXJyb3JzIGJhY2tncm91bmQudHMgaG9zdFNsdWcgZm9yIHN5bW1ldHJ5IGFjcm9zcyBzY3JlZW5zaG90ICsgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcy5cbiAgY29uc3QgaG9zdFNsdWcgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGggPSBob3N0T2YodXJsKTtcbiAgICBpZiAoIWgpIHJldHVybiAndW5rbm93bic7XG4gICAgcmV0dXJuIGgucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG4gIH07XG4gIC8vIFBpY2sgdGhlIG1vc3QtZnJlcXVlbnQgaG9zdCBhY3Jvc3MgYWxsIHNlbGVjdG9yIGNhcHR1cmVzIChmb3IgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcykuIFdoZW4gdGhlIHdvcmtzcGFjZSBzcGFucyBtdWx0aXBsZSBob3N0cywgcmV0dXJuICdtdWx0aScuXG4gIGNvbnN0IGRvbWluYW50SG9zdFNsdWcgPSAoKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdFNsdWcobS5lbnRyeS51cmwpO1xuICAgICAgY291bnRzLnNldChoLCAoY291bnRzLmdldChoKSA/PyAwKSArIDEpO1xuICAgIH1cbiAgICBpZiAoIWNvdW50cy5zaXplKSByZXR1cm4gJ2VtcHR5JztcbiAgICBsZXQgYmVzdCA9ICcnO1xuICAgIGxldCBiZXN0TiA9IDA7XG4gICAgZm9yIChjb25zdCBbaCwgbl0gb2YgY291bnRzKSB7XG4gICAgICBpZiAobiA+IGJlc3ROKSB7IGJlc3QgPSBoOyBiZXN0TiA9IG47IH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50cy5zaXplID4gMSA/ICdtdWx0aScgOiBiZXN0O1xuICB9O1xuICAvLyBEaXN0aW5jdCBob3N0cyBwcmVzZW50IGluIHRoaXMgd29ya3NwYWNlIChhbHBoYWJldGljYWwsIGNhcHBlZCkuIFVzZWQgaW5cbiAgLy8gdGhlIGV4cG9ydCBtYW5pZmVzdCdzIGBob3N0c2AgZmllbGQuXG4gIGNvbnN0IGRpc3RpbmN0SG9zdHMgPSAoKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IHNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdE9mKG0uZW50cnkudXJsKTtcbiAgICAgIGlmIChoKSBzZXQuYWRkKGgpO1xuICAgIH1cbiAgICByZXR1cm4gWy4uLnNldF0uc29ydCgpLnNsaWNlKDAsIDIwKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIERldGVybWluaXN0aWMgZXhwb3J0IGlkZW50aXR5IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBPbmUgY2xvY2sgcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGluc2lkZSBhIHNpbmdsZSBleHBvcnQgZGVyaXZlc1xuICAvLyBmcm9tIHRoZSBzYW1lIGluc3RhbnQsIGFuZCB0ZXN0cyBjYW4gZnJlZXplIGl0IHNvIHR3byBleHBvcnRzIG9mIHRoZVxuICAvLyBzYW1lIGNvbnRlbnQgYXJlIGJ5dGUtaWRlbnRpY2FsLlxuICBsZXQgZXhwb3J0Q2xvY2tPdmVycmlkZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGV4cG9ydE5vd0lzbyA9ICgpOiBzdHJpbmcgPT4gZXhwb3J0Q2xvY2tPdmVycmlkZSA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIC8vIFN0YWJsZSBjb250ZW50IGlkZW50aXR5OiBTSEEtMjU2IG92ZXIgdGhlIHNsaW0gcm93cyBwbHVzIHRoZSBzb3J0ZWRcbiAgLy8gc2NyZWVuc2hvdCBhcmNoaXZlIG5hbWVzLiBTYW1lIHdvcmtzcGFjZSBjb250ZW50IOKGkiBzYW1lIGhhc2gg4oaSIHNhbWVcbiAgLy8gZmlsZW5hbWUgKHRoZSBiYWNrZ3JvdW5kIHNhdmVzIHdpdGggY29uZmxpY3RBY3Rpb24gJ292ZXJ3cml0ZScpLCBzb1xuICAvLyByZS1leHBvcnRpbmcgdW5jaGFuZ2VkIGNvbnRlbnQgcmVwbGFjZXMgcmF0aGVyIHRoYW4gZHVwbGljYXRlcy5cbiAgY29uc3QgY29tcHV0ZUNvbnRlbnRIYXNoID0gYXN5bmMgKHNob3ROYW1lczogc3RyaW5nW10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSBidWlsZFNsaW0oKS5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKS5qb2luKCdcXG4nKSArICdcXG4nICsgWy4uLnNob3ROYW1lc10uc29ydCgpLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGRpZ2VzdCA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEtMjU2JywgbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHBheWxvYWQpKTtcbiAgICByZXR1cm4gWy4uLm5ldyBVaW50OEFycmF5KGRpZ2VzdCldLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyk7XG4gIH07XG4gIC8vIEJ1aWxkIGEgZmlsZW5hbWUgb2YgdGhlIHNoYXBlIGBwaW5jaGdyYWItPHdvcmtzcGFjZT4tPGhvc3Q+LTxzdGFtcD4uPGV4dD5gLlxuICAvLyBUaGUgc3RhbXAgaXMgdGhlIGV4cG9ydCdzIGNvbnRlbnQtaGFzaCBwcmVmaXggd2hlbiBzdXBwbGllZCAoYnVuZGxlIGFuZFxuICAvLyBKU09OTCBleHBvcnRzKSwgZmFsbGluZyBiYWNrIHRvIHRoZSBlcG9jaCBmb3IgbGVnYWN5IGNhbGxlcnMuXG4gIGNvbnN0IGJ1aWxkRXhwb3J0RmlsZW5hbWUgPSAoZXh0OiAnanNvbmwnIHwgJ21kJyB8ICd0YXIuenN0Jywgc3RhbXA/OiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBgcGluY2hncmFiLSR7YWN0aXZlV3N9LSR7ZG9taW5hbnRIb3N0U2x1ZygpfS0ke3N0YW1wID8/IERhdGUubm93KCl9LiR7ZXh0fWA7XG4gIC8vIFNraXAtbGlzdCBtYXRjaDogc3Vic3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSBtYXRjaCBhZ2FpbnN0IHRoZSBVUkwnc1xuICAvLyBob3N0LiBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBVUkwgcGFyc2luZyBvbiB0aGUgcGF0dGVybnMgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHdyaXRlIGB3cmFubmdsZS5jb21gIGFuZCBoYXZlIGl0IG1hdGNoIGBhcHAud3Jhbm5nbGUuY29tYCB0b28uXG4gIGNvbnN0IHNob3VsZFNraXBTY3JlZW5zaG90ID0gKHVybDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgbGlzdCA9IChwcmVmcy5za2lwU2NyZWVuc2hvdEhvc3RzID8/ICcnKS5zcGxpdCgnLCcpLm1hcCgocykgPT4gcy50cmltKCkudG9Mb3dlckNhc2UoKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0ID0gaG9zdE9mKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGlzdC5zb21lKChwYXQpID0+IGhvc3QuaW5jbHVkZXMocGF0KSk7XG4gIH07XG5cbiAgLy8gSlNPTiBzeW50YXggaGlnaGxpZ2h0IChwZXIta2V5IGNvbG9yIGlzIGhhc2hlZCBmb3IgdmlzdWFsIHZhcmlldHkpLlxuICBjb25zdCBLRVlfUEFMRVRURSA9IFsnI2ZmN2U3OCcsICcjZmZiNDU0JywgJyNmZmUwNjYnLCAnIzdiZDk3YScsICcjNWZkMWZmJywgJyM5YjhjZmYnLCAnI2ZmODVjMScsICcjZmY1ZjAwJywgJyMxMGI5ODEnLCAnI2Y1OWUwYicsICcjYTc4YmZhJywgJyMzNGQzOTknXTtcbiAgY29uc3QgY29sb3JGb3JLZXkgPSAoazogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgaCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIGsuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gICAgcmV0dXJuIEtFWV9QQUxFVFRFW2ggJSBLRVlfUEFMRVRURS5sZW5ndGhdITtcbiAgfTtcbiAgY29uc3QgSlNPTl9UT0tFTl9SRSA9IC8oXFxzKyl8KFwiKD86W15cIlxcXFxdfFxcXFwuKSpcIil8KHRydWV8ZmFsc2V8bnVsbCl8KC0/XFxkKyg/OlxcLlxcZCspPyg/OltlRV1bKy1dP1xcZCspPyl8KFt7fVtcXF0sOl0pL2c7XG4gIGNvbnN0IGFwcGVuZEpzb25IaWdobGlnaHQgPSAocm9vdDogSFRNTEVsZW1lbnQsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHJvb3QudGV4dENvbnRlbnQgPSAnJztcbiAgICBsZXQgbTogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcbiAgICBsZXQgbGFzdCA9IDA7XG4gICAgSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IEpTT05fVE9LRU5fUkUuZXhlYyh0ZXh0KSkgIT09IG51bGwpIHtcbiAgICAgIGlmIChtLmluZGV4ID4gbGFzdCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0LCBtLmluZGV4KSkpO1xuICAgICAgbGFzdCA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgY29uc3QgWywgd3MsIHN0ciwgbGl0LCBudW0sIHB1bmN0XSA9IG07XG4gICAgICBpZiAod3MpIHsgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUod3MpKTsgY29udGludWU7IH1cbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgbGV0IGsgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgICAgd2hpbGUgKGsgPCB0ZXh0Lmxlbmd0aCAmJiAodGV4dFtrXSA9PT0gJyAnIHx8IHRleHRba10gPT09ICdcXHQnIHx8IHRleHRba10gPT09ICdcXG4nKSkgaysrO1xuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBpZiAodGV4dFtrXSA9PT0gJzonKSB7XG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuICAgICAgICAgIHRyeSB7IGtleSA9IEpTT04ucGFyc2Uoc3RyKSBhcyBzdHJpbmc7IH0gY2F0Y2ggeyBrZXkgPSBzdHIuc2xpY2UoMSwgLTEpOyB9XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAnayc7XG4gICAgICAgICAgc3Bhbi5zdHlsZS5jb2xvciA9IGNvbG9yRm9yS2V5KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAncyc7XG4gICAgICAgIH1cbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHN0cjtcbiAgICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGlmIChsaXQpIHNwYW4uY2xhc3NOYW1lID0gJ2InO1xuICAgICAgZWxzZSBpZiAobnVtKSBzcGFuLmNsYXNzTmFtZSA9ICduJztcbiAgICAgIGVsc2UgaWYgKHB1bmN0KSBzcGFuLmNsYXNzTmFtZSA9ICdwJztcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBsaXQgPz8gbnVtID8/IHB1bmN0ID8/ICcnO1xuICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgfVxuICAgIGlmIChsYXN0IDwgdGV4dC5sZW5ndGgpIHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCkpKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUGVyc2lzdGVuY2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGxvYWRBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd29ya3NwYWNlcyA9IChhd2FpdCBTdG9yZS5nZXQ8V29ya3NwYWNlW10+KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKSkgfHwgd29ya3NwYWNlcztcbiAgICBpZiAoIXdvcmtzcGFjZXMubGVuZ3RoKSB3b3Jrc3BhY2VzID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gICAgYWN0aXZlV3MgPSAoYXdhaXQgU3RvcmUuZ2V0PHN0cmluZz4oJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCAnZGVmYXVsdCcpKSB8fCAnZGVmYXVsdCc7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gYWN0aXZlV3MpKSBhY3RpdmVXcyA9IHdvcmtzcGFjZXNbMF0hLm5hbWU7XG4gICAgcHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGUywgLi4uKGF3YWl0IFN0b3JlLmdldDxQYXJ0aWFsPFByZWZzPj4oUFJFRlNfU1RPUkFHRV9OQU1FLCB7fSkpfTtcbiAgICAvLyBQYXRoIG1pZ3JhdGlvbjogcHJpb3IgdmVyc2lvbnMgZGVmYXVsdGVkIHNraWxsUGF0aCB0b1xuICAgIC8vIGB+Ly5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYCwgYW5kIHNvbWUgdXNlcnMgaGFkIGl0IHN0b3JlZCBhc1xuICAgIC8vIGB+Ly5kb3RmaWxlcy8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAuIFRoZSBza2lsbCB3YXMgcmVuYW1lZFxuICAgIC8vIHRvIGBQaW5jaEdyYWJgOyBhbnkgYH4vLmRvdGZpbGVzL2AgcHJlZml4IGlzIHN0cmlwcGVkIGZyb21cbiAgICAvLyBleHBvc2VkIGRlZmF1bHRzIChkb3RmaWxlcyBpcyBhIHBlcnNvbmFsIGNvbmZpZyBzb3VyY2Ug4oCUIGV4cG9ydHNcbiAgICAvLyBzaG91bGRuJ3QgbGVhayB0aGF0IHBhdGgpLlxuICAgIGNvbnN0IHVwZ3JhZGVQYXRoID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCwgZnJlc2g6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICBpZiAoIXApIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmluY2x1ZGVzKCcuZG90ZmlsZXMnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuZW5kc1dpdGgoJ3NraWxscy91aS9TS0lMTC5tZCcpKSByZXR1cm4gZnJlc2g7XG4gICAgICByZXR1cm4gcDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnblBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5kZXNpZ25QYXRoLCBERUZBVUxUX1BSRUZTLmRlc2lnblBhdGgpO1xuICAgIHByZWZzLnNraWxsUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLnNraWxsUGF0aCwgREVGQVVMVF9QUkVGUy5za2lsbFBhdGgpO1xuICAgIC8vIENvbnRlbnQgbWlncmF0aW9uOiBwcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgdGhlIGVudGlyZSB0ZW1wbGF0ZVxuICAgIC8vIHRleHQgaW5zaWRlIGBwcmVmcy5kZXNpZ25NZGAgLyBgcHJlZnMuc2tpbGxNZGAgYXMgZGVmYXVsdHMuIFRoYXRcbiAgICAvLyBhdGUgfjM2MEtCIG9mIGNocm9tZS5zdG9yYWdlIHF1b3RhIGZvciBubyBiZW5lZml0LiBEZXRlY3Qgd2hlblxuICAgIC8vIHRoZSBzdG9yZWQgdmFsdWUgbWF0Y2hlcyBvbmUgb2YgdGhlIGJ1bmRsZWQgdGVtcGxhdGVzIGFuZCBjbGVhclxuICAgIC8vIGl0IOKAlCB0aGUgcmVzb2x2ZXIgZmFsbHMgYmFjayB0byB0aGUgYnVuZGxlZCBmaWxlIG9uIHRoZSBmbHkuXG4gICAgLy8gQWxzbyBzY3J1YiBhbnkgbGVha2VkIGB+Ly5kb3RmaWxlcy9gIHN1YnN0cmluZy5cbiAgICBjb25zdCBzY3J1YkRvdGZpbGVzID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgICAgcy5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8uYWdlbnRzLycsICd+Ly5hZ2VudHMvJylcbiAgICAgICAucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvJywgJ34vLmFnZW50cy8nKTtcbiAgICBjb25zdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlID0gYXN5bmMgKGN1cnJlbnQ6IHN0cmluZywga2V5czogVGVtcGxhdGVLZXlbXSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICBpZiAoIWN1cnJlbnQgfHwgIWN1cnJlbnQudHJpbSgpKSByZXR1cm4gJyc7XG4gICAgICBjb25zdCB0cmltbWVkID0gY3VycmVudC50cmltKCk7XG4gICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xuICAgICAgICBjb25zdCB0cGwgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKGspKS50cmltKCk7XG4gICAgICAgIGlmICh0cGwgJiYgdHBsID09PSB0cmltbWVkKSByZXR1cm4gJyc7IC8vIG1hdGNoZXMgYSBidW5kbGVkIHRlbXBsYXRlIOKAlCBjb2xsYXBzZSB0byBlbXB0eVxuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnJlbnQuaW5jbHVkZXMoJy5kb3RmaWxlcycpID8gc2NydWJEb3RmaWxlcyhjdXJyZW50KSA6IGN1cnJlbnQ7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25NZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuZGVzaWduTWQgPz8gJycsIFsnbG9jYWxEZXNpZ24nLCAnZGVzaWduVGVtcGxhdGUnXSk7XG4gICAgcHJlZnMuc2tpbGxNZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuc2tpbGxNZCA/PyAnJywgWydsb2NhbFNraWxsJywgJ3NraWxsVGVtcGxhdGUnXSk7XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZShhY3RpdmVXcyk7XG4gIH07XG4gIGNvbnN0IGxvYWRXb3Jrc3BhY2UgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYWN0aXZlV3MgPSBuYW1lO1xuICAgIHZvaWQgU3RvcmUuc2V0KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgbmFtZSk7XG4gICAgLy8gTWludCBhIG5ldyBzZXNzaW9uSWQgcGVyIHdvcmtzcGFjZSBsb2FkLiBTYW1lIHdvcmtzcGFjZSByZS1vcGVuZWRcbiAgICAvLyA9IG5ldyBzZXNzaW9uOiBkaXN0aW5jdCB1dWlkIHNvIGEgY29uc3VtZXIgY2FuIHRlbGwgdHdvIGJvb3RzXG4gICAgLy8gYXBhcnQgZXZlbiB3aGVuIHRoZSBjYXB0dXJlcyBsYW5kIGluIHRoZSBzYW1lIG9uLWRpc2sgZmlsZS5cbiAgICBzZXNzaW9uSWQgPSBtc2dJZCgpO1xuICAgIG1lc3NhZ2VzID0gKGF3YWl0IFN0b3JlLmdldDxQYW5lbE1lc3NhZ2VbXT4od3NNc2dLZXkobmFtZSksIFtdKSkgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkgbWVzc2FnZXMgPSBbXTtcbiAgICAvLyBNaWdyYXRlIGxlZ2FjeSBlbnRyaWVzIChubyB1aWQsIHN0YXRlcy1hcy1yZWNvcmQsIGF0dHJzLmZvcm1hdCkgYW5kXG4gICAgLy8gcGVyc2lzdCBpZiBhbnl0aGluZyBjaGFuZ2VkIHNvIHdlIGRvbid0IHBheSB0aGUgbWlncmF0aW9uIGNvc3QgYWdhaW5cbiAgICAvLyBuZXh0IGxvYWQuXG4gICAgaWYgKG1pZ3JhdGVMb2FkZWRNZXNzYWdlcygpKSB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShuYW1lKSwgbWVzc2FnZXMpO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGFnZVNob3RzRmlyZWQuY2xlYXIoKTtcbiAgICBjb25zdCBzdG9yZWQgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIC8vIFJlc3RvcmUgdGhlIGZ1bGwtcmVzb2x1dGlvbiBQTkcgY2FjaGUgc28gYSB3b3Jrc3BhY2UgYXJjaGl2ZVxuICAgIC8vIGV4cG9ydGVkIEFGVEVSIGEgcGFuZWwgcmVsb2FkIHN0aWxsIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZnJvbVxuICAgIC8vIGVhcmxpZXIgY2FwdHVyZXMuIEZJRk8gb3JkZXIgaXMgcHJlc2VydmVkIGJ5IE9iamVjdCBrZXkgb3JkZXIuXG4gICAgY29uc3Qgc3RvcmVkRnVsbCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0Z1bGxLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkRnVsbCkpIHNob3RzRnVsbC5zZXQoaywgdik7XG4gICAgLy8gTG9hZCB0aGlzIHdvcmtzcGFjZSdzIHBlcnNpc3RlbnQgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKS5cbiAgICBhd2FpdCBsb2FkV3NTbmFwc2hvdHMobmFtZSk7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIHNlbGVjdG9yRXJyb3JzLmNsZWFyKCk7XG4gICAgdW5kb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IG51bGw7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdCA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShhY3RpdmVXcyksIG1lc3NhZ2VzKTtcbiAgICAvLyBQdXNoIGNhcHR1cmVkLXNlbGVjdG9yIHNldCBzbyB0aGUgY29udGVudCBzY3JpcHQncyBob3ZlciB3YWxrZXIgY2FuXG4gICAgLy8gcmVzb2x2ZSBkZXNjZW5kYW50cyDihpIgY2FwdHVyZWQgYW5jZXN0b3IuXG4gICAgY29uc3Qgc2VsZWN0b3JzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIHNlbmRUb0NTKHtraW5kOiAnc2V0LWNhcHR1cmVkJywgc2VsZWN0b3JzfSk7XG4gICAgc2NoZWR1bGVBdXRvc2F2ZSgpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBEaXNrIGF1dG9zYXZlIChjcmFzaC9yZWluc3RhbGwgc2FmZXR5IG5ldCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENhcHR1cmVzICsgY29tbWVudHMgb3RoZXJ3aXNlIGxpdmUgT05MWSBpbiBjaHJvbWUuc3RvcmFnZSB1bnRpbCBhblxuICAvLyBleHBvcnQuIGNocm9tZS5zdG9yYWdlIGlzIHBlci1leHRlbnNpb24taW5zdGFuY2UsIHNvIGEgUmVtb3ZlK3JlLWFkZCBvZlxuICAvLyBhbiB1bnBhY2tlZCBidWlsZCAobmV3IGV4dGVuc2lvbiBpZCkg4oCUIG9yIGEgc3RvcmFnZSBjbGVhciDigJQgc2lsZW50bHlcbiAgLy8gd2lwZXMgZXZlcnkgd29ya3NwYWNlLCBhbmQgdGhlIG9uLWRpc2sgc2NyZWVuc2hvdHMgYmVjb21lIG9ycGhhbnMgd2l0aFxuICAvLyBubyBhbm5vdGF0aW9ucy4gVGhpcyBkZWJvdW5jZWQgbWlycm9yIHdyaXRlcyB0aGUgd29ya3NwYWNlIEpTT05MIHRvXG4gIC8vIERvd25sb2Fkcy9waW5jaGdyYWIvPHdzPi88d3M+LmF1dG9zYXZlLmpzb25sIChyaWdodCBiZXNpZGUgc2NyZWVuc2hvdHMvKVxuICAvLyBzbyB0aGUgd29yayBpcyBhbHdheXMgcmVjb3ZlcmFibGUgYnkgSW1wb3J0LCBpbmRlcGVuZGVudCBvZiB0aGVcbiAgLy8gZXh0ZW5zaW9uJ3Mgc3RvcmFnZS4gT3ZlcndyaXRlcyBpbiBwbGFjZTsgUXVpZXQgc2F2ZXMgc3VwcHJlc3NlcyB0aGVcbiAgLy8gZG93bmxvYWQgcG9wdXAuXG4gIGNvbnN0IEFVVE9TQVZFX0RFQk9VTkNFX01TID0gMTIwMDA7XG4gIGxldCBhdXRvc2F2ZVRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IHVuZGVmaW5lZDtcbiAgbGV0IGF1dG9zYXZlRGlydHkgPSBmYWxzZTtcbiAgY29uc3QgZmx1c2hBdXRvc2F2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICBhdXRvc2F2ZURpcnR5ID0gZmFsc2U7XG4gICAgaWYgKGF1dG9zYXZlVGltZXIpIHsgY2xlYXJUaW1lb3V0KGF1dG9zYXZlVGltZXIpOyBhdXRvc2F2ZVRpbWVyID0gdW5kZWZpbmVkOyB9XG4gICAgaWYgKCFpbkV4dGVuc2lvbiB8fCAhcHJlZnMuYXV0b3NhdmVUb0Rpc2sgfHwgIW1lc3NhZ2VzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IHdzID0gYWN0aXZlV3M7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHt3c30uYXV0b3NhdmUuanNvbmxgO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubChmaWxlbmFtZSwgJ2pzb25sJyk7XG4gICAgICB2b2lkIHNlbmRUb0JnKHtraW5kOiAnc2F2ZS10ZXh0Jywgd29ya3NwYWNlOiB3cywgZmlsZW5hbWUsIHRleHQsIG1pbWU6ICdhcHBsaWNhdGlvbi9qc29ubCcsIHN1YmRpcjogJyd9KTtcbiAgICB9IGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKExPRywgJ2F1dG9zYXZlIGZhaWxlZCcsIGVycik7IH1cbiAgfTtcbiAgY29uc3Qgc2NoZWR1bGVBdXRvc2F2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uIHx8ICFwcmVmcy5hdXRvc2F2ZVRvRGlzaykgcmV0dXJuO1xuICAgIGF1dG9zYXZlRGlydHkgPSB0cnVlO1xuICAgIGlmIChhdXRvc2F2ZVRpbWVyKSByZXR1cm47IC8vIG9uZSB3cml0ZSBwZXIgZGVib3VuY2Ugd2luZG93XG4gICAgYXV0b3NhdmVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4geyBhdXRvc2F2ZVRpbWVyID0gdW5kZWZpbmVkOyBpZiAoYXV0b3NhdmVEaXJ0eSkgZmx1c2hBdXRvc2F2ZSgpOyB9LCBBVVRPU0FWRV9ERUJPVU5DRV9NUyk7XG4gIH07XG4gIC8vIEZsdXNoIHBlbmRpbmcgd29yayB0aGUgbW9tZW50IHRoZSBwYW5lbCBpcyBoaWRkZW4vY2xvc2VkIOKAlCB0aGUgbGFzdFxuICAvLyBkZWJvdW5jZSB3aW5kb3cgd291bGQgb3RoZXJ3aXNlIGJlIGxvc3Qgb24gY2xvc2UuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCAoKSA9PiB7IGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nICYmIGF1dG9zYXZlRGlydHkpIGZsdXNoQXV0b3NhdmUoKTsgfSk7XG4gIGNvbnN0IHBlcnNpc3RQcmVmcyA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldChQUkVGU19TVE9SQUdFX05BTUUsIHByZWZzKTtcbiAgICAvLyBQdXNoIHRoZSBzdWJzZXQgb2YgcHJlZnMgdGhlIGNvbnRlbnQgc2NyaXB0IGNhcmVzIGFib3V0IHNvIGl0c1xuICAgIC8vIG92ZXJsYXkgKHNwYWNpbmcgdmlzdWFsaXplciwgaG92ZXIgc25hcCwgZXRjLikgcmVmbGVjdHMgdGhlIGxhdGVzdC5cbiAgICB2b2lkIHNlbmRUb0NTKHtcbiAgICAgIGtpbmQ6ICdzZXQtY3MtcHJlZnMnLFxuICAgICAgc3BhY2luZ092ZXJsYXk6IHByZWZzLnNwYWNpbmdPdmVybGF5LFxuICAgICAgaG92ZXJTbmFwOiBwcmVmcy5ob3ZlclNuYXAsXG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90cyA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90cykgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBwZXJzaXN0ZW5jZSB3aXRoIEZJRk8gZXZpY3Rpb24uIGRhdGFVUkwgc3RyaW5nc1xuICAvLyBjYW4gcnVuIDUwLTUwMCBLQiBlYWNoOyB0aGUgZGVmYXVsdCBxdW90YSBnZXRzIGV4aGF1c3RlZCBpbiB0ZW5zIG9mXG4gIC8vIGNhcHR1cmVzIHdpdGhvdXQgYSBidWRnZXQuIE1hcCBpbnNlcnRpb24gb3JkZXIgPSBGSUZPIG9yZGVyLCBzb1xuICAvLyB3ZSBldmljdCBmcm9tIHRoZSBmcm9udCB1bnRpbCB1bmRlciBidWRnZXQgYmVmb3JlIHBlcnNpc3RpbmcuXG4gIGNvbnN0IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQgPSAoKTogbnVtYmVyID0+IHtcbiAgICBsZXQgdG90YWwgPSAwO1xuICAgIGZvciAoY29uc3QgdiBvZiBzaG90c0Z1bGwudmFsdWVzKCkpIHRvdGFsICs9IHYubGVuZ3RoO1xuICAgIGxldCBldmljdGVkID0gMDtcbiAgICB3aGlsZSAodG90YWwgPiBTSE9UU19GVUxMX0JVREdFVF9CWVRFUykge1xuICAgICAgY29uc3QgZmlyc3RLZXkgPSBzaG90c0Z1bGwua2V5cygpLm5leHQoKS52YWx1ZTtcbiAgICAgIGlmIChmaXJzdEtleSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIGNvbnN0IHJlbW92ZWQgPSBzaG90c0Z1bGwuZ2V0KGZpcnN0S2V5KTtcbiAgICAgIGlmIChyZW1vdmVkID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgc2hvdHNGdWxsLmRlbGV0ZShmaXJzdEtleSk7XG4gICAgICB0b3RhbCAtPSByZW1vdmVkLmxlbmd0aDtcbiAgICAgIGV2aWN0ZWQrKztcbiAgICB9XG4gICAgcmV0dXJuIGV2aWN0ZWQ7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90c0Z1bGwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXZpY3RlZCA9IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQoKTtcbiAgICBpZiAoZXZpY3RlZCA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgYHNob3RzRnVsbCBGSUZPLWV2aWN0ZWQgJHtldmljdGVkfSBvbGRlc3QgZW50cmllcyB0byBmaXQgJHtTSE9UU19GVUxMX0JVREdFVF9CWVRFUyAvIDEwMjQgLyAxMDI0fU1CIGJ1ZGdldGApO1xuICAgIH1cbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90c0Z1bGwpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0Z1bGxLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V29ya3NwYWNlcyA9ICgpOiB2b2lkID0+IHsgdm9pZCBTdG9yZS5zZXQoV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpOyB9O1xuXG4gIC8vIOKUgOKUgOKUgCBUYWIg4oeEIHdvcmtzcGFjZSBiaW5kaW5nICgjMTgpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCYWNrZ3JvdW5kIGFubm91bmNlcyBlYWNoIHRvb2xiYXItY2xpY2sgYWN0aXZhdGlvbiB2aWEgJ3BnLXRhYi1hY3RpdmF0ZWQnLlxuICAvLyBUaGUgZmlyc3QgYWN0aXZhdGlvbiBhZG9wdHMgdGhlIGN1cnJlbnQgdW5ib3VuZCB3b3Jrc3BhY2U7IGxhdGVyIHRhYnMgZWFjaFxuICAvLyBnZXQgdGhlaXIgb3duLiBQaWNraW5nIGEgYm91bmQgd29ya3NwYWNlIGp1bXBzIHRoZSBicm93c2VyIHRvIGl0cyB0YWIuXG4gIGNvbnN0IHNsdWdGb3JUYWIgPSAodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7IGNvbnN0IGggPSBuZXcgVVJMKHVybCkuaG9zdG5hbWUucmVwbGFjZSgvXnd3d1xcLi8sICcnKTsgaWYgKGgpIHJldHVybiBoOyB9IGNhdGNoIHsgLyogbm90IGEgdXJsICovIH1cbiAgICBjb25zdCB0ID0gKHRpdGxlIHx8ICcnKS50cmltKCk7XG4gICAgcmV0dXJuIHQgPyB0LnNsaWNlKDAsIDI0KSA6ICd0YWInO1xuICB9O1xuICBjb25zdCB1bmlxdWVXc05hbWUgPSAoYmFzZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIXdvcmtzcGFjZXMuc29tZSgodykgPT4gdy5uYW1lID09PSBiYXNlKSkgcmV0dXJuIGJhc2U7XG4gICAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7IGNvbnN0IG4gPSBgJHtiYXNlfSAke2l9YDsgaWYgKCF3b3Jrc3BhY2VzLnNvbWUoKHcpID0+IHcubmFtZSA9PT0gbikpIHJldHVybiBuOyB9XG4gIH07XG4gIGNvbnN0IG9uVGFiQWN0aXZhdGVkID0gYXN5bmMgKHt0YWJJZCwgdXJsLCB0aXRsZX06IHt0YWJJZDogbnVtYmVyOyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZ30pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcudGFiSWQgPT09IHRhYklkKTtcbiAgICBpZiAod3MpIHtcbiAgICAgIGlmICh3cy51cmwgIT09IHVybCB8fCB3cy50aXRsZSAhPT0gdGl0bGUpIHsgd3MudXJsID0gdXJsOyB3cy50aXRsZSA9IHRpdGxlOyBwZXJzaXN0V29ya3NwYWNlcygpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gYWN0aXZlV3MpO1xuICAgICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC50YWJJZCA9PSBudWxsKSB7XG4gICAgICAgIHdzID0gY3VycmVudDsgd3MudGFiSWQgPSB0YWJJZDsgd3MudXJsID0gdXJsOyB3cy50aXRsZSA9IHRpdGxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3MgPSB7bmFtZTogdW5pcXVlV3NOYW1lKHNsdWdGb3JUYWIodXJsLCB0aXRsZSkpLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGFiSWQsIHVybCwgdGl0bGV9O1xuICAgICAgICB3b3Jrc3BhY2VzLnB1c2god3MpO1xuICAgICAgfVxuICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICB9XG4gICAgaWYgKGFjdGl2ZVdzICE9PSB3cy5uYW1lKSBhd2FpdCBsb2FkV29ya3NwYWNlKHdzLm5hbWUpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcbiAgLy8gQnJpbmcgdGhlIGJyb3dzZXIgdG8gYSB3b3Jrc3BhY2UncyBib3VuZCB0YWIgd2hlbiB0aGUgdXNlciBwaWNrcyBpdC5cbiAgY29uc3QgZm9jdXNXb3Jrc3BhY2VUYWIgPSAobmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKCFpbkV4dGVuc2lvbiB8fCB3cz8udGFiSWQgPT0gbnVsbCkgcmV0dXJuO1xuICAgIGNocm9tZS50YWJzLnVwZGF0ZSh3cy50YWJJZCwge2FjdGl2ZTogdHJ1ZX0pLnRoZW4oKHQpID0+IHtcbiAgICAgIGlmICh0Py53aW5kb3dJZCAhPSBudWxsKSB2b2lkIGNocm9tZS53aW5kb3dzPy51cGRhdGUodC53aW5kb3dJZCwge2ZvY3VzZWQ6IHRydWV9KT8uY2F0Y2g/LigoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7IC8qIHRhYiB3YXMgY2xvc2VkICovIH0pO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTbmFwc2hvdCAvIHVuZG8gLyByZWRvIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzbmFwc2hvdCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoc3VzcGVuZFNuYXBzaG90cykgcmV0dXJuO1xuICAgIGlmICh1bmRvU3RhY2subGVuZ3RoID49IFVORE9fQ0FQKSB1bmRvU3RhY2suc2hpZnQoKTtcbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlc3RvcmUgPSAoanNvbjogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IHRydWU7XG4gICAgdHJ5IHsgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGpzb24pIGFzIFBhbmVsTWVzc2FnZVtdOyB9IGNhdGNoIHsgbWVzc2FnZXMgPSBbXTsgfVxuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSBmYWxzZTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG4gIGNvbnN0IHVuZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCF1bmRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byB1bmRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICByZWRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUodW5kb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdVbmRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZWRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcmVkb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gcmVkbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHJlZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnUmVkb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlVW5kb0J1dHRvbnMgPSAoKTogdm9pZCA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwidW5kb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHVuZG9TdGFjay5sZW5ndGggPT09IDApO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInJlZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCByZWRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlQ29weVBhdGhCdXR0b24gPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWFjdGlvbj1cImNvcHktcGF0aFwiXScpO1xuICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgY29uc3QgaGFzID0gQm9vbGVhbihsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCk7XG4gICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgIWhhcyk7XG4gICAgYnRuLmRhdGFzZXQudGlwID0gaGFzXG4gICAgICA/IGBDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuXFxuJHtsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCA/PyAnJ31gXG4gICAgICA6ICdDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuIFJ1biBhbiBleHBvcnQgZmlyc3QuJztcbiAgfTtcbiAgY29uc3Qgb25Db3B5UGF0aCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwYXRoVG9Db3B5ID0gbGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGg7XG4gICAgaWYgKCFwYXRoVG9Db3B5KSB7XG4gICAgICBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIHJ1biBhIGRvd25sb2FkIGZpcnN0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocGF0aFRvQ29weSk7XG4gICAgICAvLyBTaG93IG9ubHkgdGhlIGxlYWYgZmlsZW5hbWUgaW4gdGhlIHN0YXR1cyDigJQgdGhlIGZ1bGwgV2luZG93cy1zdHlsZVxuICAgICAgLy8gYWJzb2x1dGUgcGF0aCB3b3VsZCBiZSAxMDArIGNoYXJzIGFuZCB3YXMgZGlzcnVwdGluZyB0aGUgc2lkZWJhclxuICAgICAgLy8gbGF5b3V0IGZvciB0aGUgMi1zZWNvbmQgc3RhdHVzIFRUTC5cbiAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICBzZXRTdGF0dXMoYENvcGllZCBwYXRoIMK3ICR7bGVhZn1gKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBwYXRoJywgbGVhZik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgd3JpdGUgZmFpbGVkOiAnICsgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB0byBhY3RpdmUgdGFiIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZW5kVG9DUyA9IGFzeW5jIChwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBtc2cgPSBwZyhwYXlsb2FkKTtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgIGlmICh0YWJzWzBdPy5pZCAhPSBudWxsKSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCBtc2cpLmNhdGNoKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7IHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLWNzJywge2RldGFpbDogbXNnfSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHNlbmRUb0NTQW5kV2FpdCA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPFIgfCBudWxsPiA9PiBuZXcgUHJvbWlzZTxSIHwgbnVsbD4oKHJlc29sdmUpID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zdCByZXFJZCA9IGByZXFfJHtzZWN1cmVUb2tlbigxMil9YDtcbiAgICAgIGNvbnN0IG9uUmVzcCA9IChlOiBFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSAoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsO1xuICAgICAgICBpZiAoZGV0YWlsPy5fX3JlcUlkID09PSByZXFJZCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgICAgIHJlc29sdmUoZGV0YWlsLnJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiB7X19yZXFJZDogcmVxSWQsIC4uLnBnKHBheWxvYWQpfX0pKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTsgcmVzb2x2ZShudWxsKTsgfSwgMTAwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9LCAodGFicykgPT4ge1xuICAgICAgaWYgKCF0YWJzWzBdPy5pZCkgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHBnKHBheWxvYWQpLCAocjogUikgPT4gcmVzb2x2ZShyKSk7XG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBzZW5kVG9CZyA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQmcpOiBQcm9taXNlPFIgfCBudWxsPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHsgcmV0dXJuIChhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShwZyhwYXlsb2FkKSkpIGFzIFI7IH1cbiAgICBjYXRjaCAoZSkgeyByZXR1cm4ge2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBhcyB1bmtub3duIGFzIFI7IH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgUmVjZWl2aW5nIGZyb20gY29udGVudCBzY3JpcHQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIERlZmVuc2l2ZSByaW5nLWJ1ZmZlciBkZWR1cGU6IGV2ZW4gdGhvdWdoIHdlIG5vdyB1c2Ugb25seSBvbmUgY2hhbm5lbCxcbiAgLy8gYW55IG1lc3NhZ2UgdGhhdCBzb21laG93IGFycml2ZXMgdHdpY2Ugd2l0aGluIH4yIHNlY29uZHMgaXMgaWdub3JlZC5cbiAgY29uc3QgcmVjZW50TWlkczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgUkVDRU5UX01JRF9DQVAgPSA2NDtcbiAgY29uc3Qgb25Dc01lc3NhZ2UgPSAobXNnOiBQZ0VudmVsb3BlPENzVG9QYW5lbD4pOiB2b2lkID0+IHtcbiAgICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuO1xuICAgIGlmIChtc2cuX19taWQpIHtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmluY2x1ZGVzKG1zZy5fX21pZCkpIHJldHVybjtcbiAgICAgIHJlY2VudE1pZHMucHVzaChtc2cuX19taWQpO1xuICAgICAgaWYgKHJlY2VudE1pZHMubGVuZ3RoID4gUkVDRU5UX01JRF9DQVApIHJlY2VudE1pZHMuc2hpZnQoKTtcbiAgICB9XG4gICAgaWYgKChtc2cgYXMge2tpbmQ/OiBzdHJpbmd9KS5raW5kID09PSAncGctdGFiLWFjdGl2YXRlZCcpIHtcbiAgICAgIHZvaWQgb25UYWJBY3RpdmF0ZWQobXNnIGFzIHVua25vd24gYXMge3RhYklkOiBudW1iZXI7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXRjaCAobXNnLmtpbmQpIHtcbiAgICAgIGNhc2UgJ2NhcHR1cmUnOiBvbkNhcHR1cmUobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXInOiBvbkhvdmVyKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdob3Zlcid9Pik7IHJldHVybjtcbiAgICAgIGNhc2UgJ2hvdmVyLWVuZCc6IG9uSG92ZXJFbmQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1hZGQnOiBvblBlbmRpbmdBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1jbGVhcic6IG9uUGVuZGluZ0NsZWFyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2ZlZWRiYWNrLWFkZCc6IG9uRmVlZGJhY2tBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncHJlZmVyZW5jZS1jaGFuZ2UnOiBvblByZWZlcmVuY2VDaGFuZ2UobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGFnZS1zbmFwc2hvdCc6IG9uUGFnZVNuYXBzaG90KChtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncGFnZS1zbmFwc2hvdCd9PikucGF5bG9hZCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3NlbGVjdC1tb2RlJzogc3luY1NlbGVjdE1vZGUoKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdzZWxlY3QtbW9kZSd9Pikub24pOyByZXR1cm47XG4gICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGlja3kgcGluY2ggbW9kZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gVG9nZ2xlIFwiY2FwdHVyZSB3aXRob3V0IGhvbGRpbmcgQWx0XCIuIFRoZSBwYWdlIG93bnMgdGhlIGFjdHVhbCBnZXN0dXJlXG4gIC8vIGdhdGUgKyBFc2MtdG8tZXhpdDsgdGhlIHBhbmVsIG1pcnJvcnMgdGhlIHN0YXRlIG9uIGl0cyBidXR0b24gYW5kIHJlZmxlY3RzXG4gIC8vIHRoZSBwYWdlJ3Mgb3duIGV4aXQgKEVzYykgdmlhIHRoZSBzZWxlY3QtbW9kZSBtZXNzYWdlLlxuICBsZXQgc2VsZWN0TW9kZSA9IGZhbHNlO1xuICBjb25zdCByZWZsZWN0U2VsZWN0TW9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGIgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWFjdGlvbj1cInNlbGVjdC1tb2RlXCJdJykpIHtcbiAgICAgIGIuY2xhc3NMaXN0LnRvZ2dsZSgndG9nZ2xlZCcsIHNlbGVjdE1vZGUpO1xuICAgICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsIFN0cmluZyhzZWxlY3RNb2RlKSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBzeW5jU2VsZWN0TW9kZSA9IChvbjogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChzZWxlY3RNb2RlID09PSBvbikgcmV0dXJuO1xuICAgIHNlbGVjdE1vZGUgPSBvbjtcbiAgICByZWZsZWN0U2VsZWN0TW9kZSgpO1xuICAgIHNldFN0YXR1cyhvbiA/ICdQaW5jaCBtb2RlIG9uIOKAlCBjbGljayB0aGUgcGFnZSB0byBjYXB0dXJlIChFc2MgZXhpdHMpJyA6ICdQaW5jaCBtb2RlIG9mZicpO1xuICB9O1xuICBjb25zdCBvblRvZ2dsZVNlbGVjdE1vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgc2VsZWN0TW9kZSA9ICFzZWxlY3RNb2RlO1xuICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzZWxlY3QtbW9kZScsIG9uOiBzZWxlY3RNb2RlfSk7XG4gICAgcmVmbGVjdFNlbGVjdE1vZGUoKTtcbiAgICBzZXRTdGF0dXMoc2VsZWN0TW9kZSA/ICdQaW5jaCBtb2RlIG9uIOKAlCBjbGljayB0aGUgcGFnZSB0byBjYXB0dXJlIChFc2MgZXhpdHMpJyA6ICdQaW5jaCBtb2RlIG9mZicpO1xuICB9O1xuXG4gIGNvbnN0IG9uUHJlZmVyZW5jZUNoYW5nZSA9ICh7cmVhc29uLCBwYWdlfToge3JlYXNvbjogc3RyaW5nOyBwYWdlOiBhbnl9KTogdm9pZCA9PiB7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2U/LnVybCA/PyBsaXZlVGFiVXJsO1xuICAgIGxpdmVUYWJQYXRoID0gbGl2ZVRhYlVybCA/IHBhdGhPZihsaXZlVGFiVXJsKSA6IGxpdmVUYWJQYXRoO1xuICAgIC8vIFBhZ2Ugcm93cyBhcmUgY2FwdHVyZSBoZWFkZXJzLCBub3QgYSB0YWIvcGFnZSB0ZWxlbWV0cnkgZmVlZC4gVGhlIG5leHRcbiAgICAvLyBzZWxlY3RvciBjYXB0dXJlIGZyb20gdGhpcyBwYWdlIHdpbGwgY2FycnkgdGhlIG5ldyB2aWV3cG9ydC9zdGF0ZSBhbmRcbiAgICAvLyBpbnNlcnQgYSBwYWdlIGhlYWRlciBvbmx5IGlmIG5lZWRlZC5cbiAgICBzZXRTdGF0dXMoYCR7cmVhc29ufSBjaGFuZ2VkYCwge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuXG4gIC8vIFBhZ2UtZ3JvdXAgcmVjb3JkcyBtYXkgY2FycnkgYSBmdWxsLXBhZ2Ugc25hcHNob3QgKHZpZXdwb3J0LCBzY3JvbGxcbiAgLy8gZXh0ZW50cywgZHByLCBsYW5nLCBmdWxsLXBhZ2Ugc2NyZWVuc2hvdCkuIFBhZ2VNZXNzYWdlIGluIHR5cGVzLnRzIGRvZXNuJ3RcbiAgLy8geWV0IGRlY2xhcmUgdGhlIGZpZWxkLCBzbyB3ZSB3aWRlbiBpdCBsb2NhbGx5IOKAlCB0aGUgdmFsdWUgcGVyc2lzdHMgd2l0aFxuICAvLyB0aGUgcmVzdCBvZiB0aGUgbWVzc2FnZSBKU09OIGFuZCByb3VuZC10cmlwcyB0aHJvdWdoIGV4cG9ydC5cbiAgdHlwZSBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCA9IFBhZ2VNZXNzYWdlICYge3NuYXBzaG90PzogUGFnZVNuYXBzaG90fTtcbiAgLy8gU25hcHNob3RzIHRoYXQgYXJyaXZlZCBiZWZvcmUgYSBwYWdlLWdyb3VwIHJlY29yZCBleGlzdHMgZm9yIHRoZWlyIFVSTC5cbiAgLy8gQXBwbGllZCB3aGVuIHRoZSBwYWdlIGhlYWRlciBpcyBsYXRlciBjcmVhdGVkIChzZWUgb25DYXB0dXJlKS5cbiAgY29uc3QgcGVuZGluZ1NuYXBzaG90cyA9IG5ldyBNYXA8c3RyaW5nLCBQYWdlU25hcHNob3Q+KCk7XG4gIGNvbnN0IGFwcGx5U25hcHNob3RUb1BhZ2UgPSAoc25hcDogUGFnZVNuYXBzaG90KTogYm9vbGVhbiA9PiB7XG4gICAgLy8gQXR0YWNoIHRvIHRoZSBtb3N0IHJlY2VudCBwYWdlLWdyb3VwIHJlY29yZCBmb3IgdGhpcyBVUkwuXG4gICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3BhZ2UnICYmIG0udXJsID09PSBzbmFwLnVybCkge1xuICAgICAgICAobSBhcyBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCkuc25hcHNob3QgPSBzbmFwO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBjb25zdCBvblBhZ2VTbmFwc2hvdCA9IChwYXlsb2FkOiBQYWdlU25hcHNob3QpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBheWxvYWQ/LnVybCkgcmV0dXJuO1xuICAgIGlmIChhcHBseVNuYXBzaG90VG9QYWdlKHBheWxvYWQpKSB7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gcGFnZSByZWNvcmQgeWV0IOKAlCBzdGFzaCBmb3IgdGhlIG5leHQgY2FwdHVyZSBvbiB0aGlzIFVSTC5cbiAgICAgIHBlbmRpbmdTbmFwc2hvdHMuc2V0KHBheWxvYWQudXJsLCBwYXlsb2FkKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25GZWVkYmFja0FkZCA9ICh7c2VsZWN0b3IsIHRleHQsIHVybCwgcGFyZW50VWlkfToge3NlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9KTogdm9pZCA9PiB7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IGluIHByaW9yaXR5IG9yZGVyOlxuICAgIC8vICAgMS4gcGFyZW50VWlkIOKAlCB0aGUgY29udGVudCBzY3JpcHQgc3VwcGxpZWQgYSBzdGFibGUgdWlkICh0aGVcbiAgICAvLyAgICAgIHN0cm9uZ2VzdCBtYXRjaDsgc3Vydml2ZXMgc2VsZWN0b3IgY2hhbmdlcywgc2libGluZ1xuICAgIC8vICAgICAgY29sbGlzaW9ucywgbXVsdGlwbGUgY2FwdHVyZXMgb2YgdGhlIHNhbWUgZWxlbWVudCkuXG4gICAgLy8gICAyLiBzZWxlY3RvciArIHVybCDigJQgY29tcG9zaXRlIGtleTsgcHJldmVudHMgY3Jvc3MtcGFnZVxuICAgIC8vICAgICAgY29udGFtaW5hdGlvbiB3aGVuIHRoZSBzYW1lIHNlbGVjdG9yIGV4aXN0cyBvbiBtdWx0aXBsZSBVUkxzLlxuICAgIC8vICAgMy4gc2VsZWN0b3IgKyBsaXZlVGFiVXJsIOKAlCBmYWxsYmFjayB3aGVuIHRoZSBtZXNzYWdlIGRpZG4ndFxuICAgIC8vICAgICAgY2FycnkgYW4gZXhwbGljaXQgdXJsIChvbGRlciBjb250ZW50LXNjcmlwdCBtZXNzYWdlcykuXG4gICAgbGV0IGlkeCA9IC0xO1xuICAgIGlmIChwYXJlbnRVaWQpIHtcbiAgICAgIGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIG0uZW50cnkudWlkID09PSBwYXJlbnRVaWQpO1xuICAgIH1cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgY29uc3Qgd2FudFVybCA9IHVybCA/PyBsaXZlVGFiVXJsID8/IG51bGw7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+XG4gICAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJ1xuICAgICAgICAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvclxuICAgICAgICAmJiAoIXdhbnRVcmwgfHwgbS5lbnRyeS51cmwgPT09IHdhbnRVcmwpKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csICdvbkZlZWRiYWNrQWRkOiBubyBwYXJlbnQgZm91bmQnLCB7c2VsZWN0b3IsIHVybCwgcGFyZW50VWlkfSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgbG9zdCBpdHMgcGFyZW50IOKAlCBjaGVjayB0aGUgYWN0aXZlIGNhcHR1cmUnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgcGFyZW50TXNnID0gbWVzc2FnZXNbaWR4XSBhcyBTZWxlY3Rvck1lc3NhZ2U7XG4gICAgbGV0IGluc2VydEF0ID0gaWR4ICsgMTtcbiAgICB3aGlsZSAoaW5zZXJ0QXQgPCBtZXNzYWdlcy5sZW5ndGggJiYgbWVzc2FnZXNbaW5zZXJ0QXRdPy50eXBlID09PSAnZmVlZGJhY2snKSBpbnNlcnRBdCsrO1xuICAgIC8vIFN0YW1wIHBhcmVudFVpZCBvbiB0aGUgbmV3IGZlZWRiYWNrIHJvdyBzbyB0aGUgZXhwb3J0IGNhcnJpZXNcbiAgICAvLyB0aGUgRksgbGluayBleHBsaWNpdGx5IChub3QganVzdCBieSBjYXB0dXJlLWFkamFjZW5jeSkuXG4gICAgbWVzc2FnZXMuc3BsaWNlKGluc2VydEF0LCAwLCB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIHBhcmVudFVpZDogcGFyZW50TXNnLmVudHJ5LnVpZCxcbiAgICB9KTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdDb21tZW50IGFkZGVkIGZyb20gcGFnZScpO1xuICAgIC8vIEV2ZXJ5IGZlZWRiYWNrIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuIElmIHRoZSBwYXJlbnRcbiAgICAvLyBjYXB0dXJlIGRpZG4ndCBnZXQgb25lIChhdXRvU2NyZWVuc2hvdCBvZmYsIHNraXBTY3JlZW5zaG90SG9zdHNcbiAgICAvLyBoaXQsIG5ldHdvcmsgZ2xpdGNoKSwgcmUtZmlyZSBub3cuXG4gICAgaWYgKCFwYXJlbnRNc2cuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgdm9pZCBmaXJlRWxlbWVudFNob3QocGFyZW50TXNnKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25QZW5kaW5nQWRkID0gKHtlbnRyeX06IHtlbnRyeTogRW50cnl9KTogdm9pZCA9PiB7IHBlbmRpbmdNdWx0aS5wdXNoKGVudHJ5KTsgcmVuZGVyKCk7IH07XG4gIGNvbnN0IG9uUGVuZGluZ0NsZWFyID0gKCk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkgPSBbXTsgcmVuZGVyKCk7IH07XG5cbiAgY29uc3QgZmluZER1cGxpY2F0ZSA9IChzZWxlY3Rvcjogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFNlbGVjdG9yTWVzc2FnZSB8IHVuZGVmaW5lZCA9PlxuICAgIG1lc3NhZ2VzLmZpbmQoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PlxuICAgICAgbS50eXBlID09PSAnc2VsZWN0b3InICYmIG0uZW50cnkuc2VsZWN0b3IgPT09IHNlbGVjdG9yICYmICghdXJsIHx8IG0uZW50cnkudXJsID09PSB1cmwpKTtcblxuICAvLyBGaW5kIGFuIGV4aXN0aW5nIGNhcHR1cmUgZm9yIHRoZSBhY3RpdmUgdGFiICsgc2VsZWN0b3IuIENyb3NzLXBhZ2VcbiAgLy8gY29udGFtaW5hdGlvbiBwcmV2ZW50aW9uIChzZWUgdHlwZXMudHMgZmVlZGJhY2stYWRkIGRvY3N0cmluZyk6XG4gIC8vIGEgc2VsZWN0b3IgYWxvbmUgaXMgTk9UIGEgc3RhYmxlIGlkZW50aXR5IOKAlCBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWBcbiAgLy8gZXhpc3RzIG9uIGV2ZXJ5IHBhZ2U7IGBidXR0b25gIGlzIGV2ZXJ5d2hlcmUuIFN0cm9uZyBpZGVudGl0eSBpc1xuICAvLyAoc2VsZWN0b3IgKyB1cmwpLiBSZXR1cm5zIHRoZSBtb3N0IHJlY2VudCBtYXRjaCBzbyByZS1ob3ZlcmluZyBhblxuICAvLyBhbHJlYWR5LWNhcHR1cmVkIGVsZW1lbnQgcmVzb2x2ZXMgY29uc2lzdGVudGx5LlxuICBjb25zdCBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlID0gKHNlbGVjdG9yOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IGxpdmVUYWJVcmw7XG4gICAgLy8gV2FsayBiYWNrd2FyZHMgc28gdGhlIG1vc3QgcmVjZW50IG1hdGNoaW5nIGNhcHR1cmUgd2lucyB3aGVuIGFcbiAgICAvLyBzZWxlY3RvciBsZWdpdGltYXRlbHkgaGFzIG11bHRpcGxlIGNhcHR1cmVzIG9uIHRoZSBzYW1lIHBhZ2VcbiAgICAvLyAoZS5nLiwgdGhlIHVzZXIgcmUtY2FwdHVyZWQgdGhlIHNhbWUgZWxlbWVudCBhZnRlciBlZGl0cykuXG4gICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zZWxlY3RvciAhPT0gc2VsZWN0b3IpIGNvbnRpbnVlO1xuICAgICAgaWYgKHVybCAmJiBtLmVudHJ5LnVybCAhPT0gdXJsKSBjb250aW51ZTtcbiAgICAgIHJldHVybiBtO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIGNvbnN0IGNhbm9uaWNhbEVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICB0YWc6IGUudGFnLCBzZWxlY3RvcjogZS5zZWxlY3RvciwgdGV4dDogZS50ZXh0LCByb2xlOiBlLnJvbGUsXG4gICAgYXR0cnM6IGUuYXR0cnMsIGNsYXNzZXM6IGUuY2xhc3NlcyxcbiAgICByZWN0OiBlLnJlY3QsIG91dGVySFRNTDogZS5vdXRlckhUTUwsXG4gICAgc3R5bGVzOiBlLnN0eWxlcywgbWF0Y2hlZFJ1bGVzOiBlLm1hdGNoZWRSdWxlcyxcbiAgfSk7XG5cbiAgY29uc3Qgb25DYXB0dXJlID0gKHtlbnRyeSwgcGFnZSwgZ3JvdXBlZH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2NhcHR1cmUnfT4pOiB2b2lkID0+IHtcbiAgICBpZiAoIWVudHJ5IHx8ICFwYWdlKSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBsaXZlVGFiVXJsID0gcGFnZS51cmw7XG4gICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YocGFnZS51cmwpO1xuICAgIGlmIChncm91cGVkKSB7XG4gICAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgICBpZiAobT8udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgICBncm91cC5wdXNoKGVudHJ5KTtcbiAgICAgICAgICBtLmVudHJ5Lmdyb3VwID0gZ3JvdXA7XG4gICAgICAgICAgcGVyc2lzdCgpOyByZW5kZXIoKTsgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgICAvLyBGaXJlIGEgZ3JvdXAgc2hvdCB1c2luZyB0aGUgaGVhZCArIG1lbWJlcnMuIFRoZSBoZWFkJ3Mgc2VsZWN0b3JcbiAgICAgICAgICAvLyBpcyBtLmVudHJ5LnNlbGVjdG9yOyBtZW1iZXJzJyBzZWxlY3RvcnMgYXJlIGluIHRoZSBmcmVzaGx5XG4gICAgICAgICAgLy8gbXV0YXRlZCBncm91cCBhcnJheS5cbiAgICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSBbbS5lbnRyeS5zZWxlY3RvciwgLi4uKG0uZW50cnkuZ3JvdXAgPz8gW10pLm1hcCgoZykgPT4gZy5zZWxlY3RvcildO1xuICAgICAgICAgIHZvaWQgZmlyZUdyb3VwU2hvdChtLCBzZWxlY3RvcnMpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBEdXBlIGRldGVjdGlvbi4gQ3Jvc3MtY29udGFtaW5hdGlvbiBmaXg6IGEgKHNlbGVjdG9yLCB1cmwpIG1hdGNoXG4gICAgLy8gaXMgTkVDRVNTQVJZIGJ1dCBub3QgU1VGRklDSUVOVCDigJQgdHdvIHNpYmxpbmcgZWxlbWVudHMgd2l0aCB0aGVcbiAgICAvLyBzYW1lIHRlc3RJZCAvIHNhbWUgcm9sZS9hcmlhIHNlbGVjdG9yIGxpdmUgb24gdGhlIHNhbWUgVVJMIGJ1dFxuICAgIC8vIGFyZSBkaWZmZXJlbnQgY2FwdHVyZXMuIENvbXBhcmUgdGhlIGNhbm9uaWNhbC1lbnRyeSBoYXNoICh3aGljaFxuICAgIC8vIGluY2x1ZGVzIHJlY3QsIHRleHQsIG91dGVySFRNTCwgZXRjLikgYmVmb3JlIHRyZWF0aW5nIHRoZSBuZXdcbiAgICAvLyBjYXB0dXJlIGFzIGEgcmVmcmVzaCBvZiB0aGUgb2xkIG9uZS4gV2hlbiB0aGUgaGFzaCBkaWZmZXJzLCB3ZVxuICAgIC8vIGtlZXAgQk9USCBjYXB0dXJlcyByYXRoZXIgdGhhbiBvdmVyd3JpdGluZy5cbiAgICBjb25zdCBkdXBlID0gZmluZER1cGxpY2F0ZShlbnRyeS5zZWxlY3RvciwgZW50cnkudXJsKTtcbiAgICBpZiAoZHVwZSkge1xuICAgICAgY29uc3QgYmVmb3JlID0gY2Fub25pY2FsRW50cnkoZHVwZS5lbnRyeSk7XG4gICAgICBjb25zdCBhZnRlciA9IGNhbm9uaWNhbEVudHJ5KGVudHJ5KTtcbiAgICAgIGlmIChiZWZvcmUgPT09IGFmdGVyKSB7XG4gICAgICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIEhhc2hlcyBkaWZmZXIuIFR3byBjYXNlczpcbiAgICAgIC8vICAgKGEpIFNhbWUgZWxlbWVudCByZS1jYXB0dXJlZCBhZnRlciBjb250ZW50IGNoYW5nZSDigJQgdGhlIHJlY3RcbiAgICAgIC8vICAgICAgIHN0YXlzIHB1dCAod2l0aGluIGEgZmV3IHB4KSwgYnV0IHRleHQvb3V0ZXJIVE1MIG1vdmVkLlxuICAgICAgLy8gICAgICAgVHJlYXQgYXMgYSByZWZyZXNoLlxuICAgICAgLy8gICAoYikgRGlmZmVyZW50IGVsZW1lbnQgdGhhdCBoYXBwZW5zIHRvIHNoYXJlIGEgc2VsZWN0b3Ig4oCUIHRoZVxuICAgICAgLy8gICAgICAgcmVjdCBpcyBpbiBhIGRpZmZlcmVudCBwb3NpdGlvbi4gVHJlYXQgYXMgYSBuZXcgY2FwdHVyZS5cbiAgICAgIC8vIFdlIGRpc2NyaW1pbmF0ZSBieSByZWN0IG92ZXJsYXA6IGlmIGJvdGggcmVjdHMgZXhpc3QgYW5kIHRoZWlyXG4gICAgICAvLyBjZW50ZXJzIGFyZSB3aXRoaW4gOHB4IG9uIGJvdGggYXhlcywgcmVmcmVzaDsgb3RoZXJ3aXNlIGtlZXBcbiAgICAgIC8vIGJvdGguXG4gICAgICBjb25zdCByMSA9IGR1cGUuZW50cnkucmVjdDtcbiAgICAgIGNvbnN0IHIyID0gZW50cnkucmVjdDtcbiAgICAgIGNvbnN0IHNhbWVFbGVtZW50ID0gcjEgJiYgcjJcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnggKyByMS53IC8gMikgLSAocjIueCArIHIyLncgLyAyKSkgPD0gOFxuICAgICAgICAmJiBNYXRoLmFicygocjEueSArIHIxLmggLyAyKSAtIChyMi55ICsgcjIuaCAvIDIpKSA8PSA4O1xuICAgICAgaWYgKHNhbWVFbGVtZW50KSB7XG4gICAgICAgIGRlbGV0ZSBkdXBlLmR1cGVQZW5kaW5nO1xuICAgICAgICBkdXBlLmVudHJ5ID0gZW50cnk7XG4gICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cyhgVXBkYXRlZCAjJHtkdXBlLmVudHJ5Lm59YCwge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBEaWZmZXJlbnQgZWxlbWVudCB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIOKGkiBmYWxsIHRocm91Z2ggYW5kXG4gICAgICAvLyBlbWl0IGFzIGEgbmV3IGNhcHR1cmUuIFRoZSBhZ2VudCByZWFkaW5nIHRoZSBleHBvcnQgc2VlcyBib3RoXG4gICAgICAvLyByb3dzIHdpdGggdGhlIHNhbWUgc2VsZWN0b3IgYnV0IGRpZmZlcmVudCB1aWRzICsgcmVjdHMuXG4gICAgfVxuICAgIGxldCBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIHBvc2l0aW9uID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBpbnNlcnRCZWZvcmUuY3VycmVudCk7XG4gICAgICBpZiAocG9zaXRpb24gPCAwKSBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFN0YW1wIHRoZSBzZXNzaW9uIEZLIHNvIHRoZSBjb25zdW1lciBjYW4gam9pbiBlbnRyaWVzIHRvIHRoZWlyXG4gICAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuXG4gICAgaWYgKHNlc3Npb25JZCkgZW50cnkuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgIGNvbnN0IG5ld01zZzogU2VsZWN0b3JNZXNzYWdlID0ge3R5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogZW50cnkudHMsIGVudHJ5fTtcbiAgICAvLyBQYWdlIHJvd3MgZXhpc3Qgb25seSBhcyBoZWFkZXJzIGZvciBjYXB0dXJlZCBzZWxlY3RvcnMuIERvIG5vdCBjcmVhdGVcbiAgICAvLyB0aGVtIGZyb20gdGFiIGFjdGl2YXRpb24sIHZhbGlkYXRpb24sIG9yIHByZWZlcmVuY2UgY2hhbmdlczsgaW5zZXJ0IG9uZVxuICAgIC8vIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZmlyc3Qgc2VsZWN0b3Igb2YgYSBuZXcgcGFnZSBibG9jay5cbiAgICBsZXQgcHJldmlvdXNQYWdlOiBQYWdlTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSBwb3NpdGlvbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3BhZ2UnKSB7IHByZXZpb3VzUGFnZSA9IG07IGJyZWFrOyB9XG4gICAgICBpZiAobT8udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnJlYWs7XG4gICAgfVxuICAgIGlmICghcHJldmlvdXNQYWdlIHx8IHByZXZpb3VzUGFnZS51cmwgIT09IHBhZ2UudXJsKSB7XG4gICAgICBjb25zdCBwYWdlTXNnOiBQYWdlTWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ3BhZ2UnLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgdXJsOiBwYWdlLnVybCwgdGl0bGU6IHBhZ2UudGl0bGUsIHZpZXdwb3J0OiBwYWdlLnZpZXdwb3J0LCB0b2tlbnM6IHBhZ2UudG9rZW5zLFxuICAgICAgICB1c2VyQWdlbnQ6IHBhZ2UudXNlckFnZW50LCBsYW5nOiBwYWdlLmxhbmcsXG4gICAgICAgIGdpdENvbnRleHQ6IChwYWdlIGFzIGFueSkuZ2l0Q29udGV4dCxcbiAgICAgICAgcm91dGU6IChwYWdlIGFzIGFueSkucm91dGUsXG4gICAgICAgIHN0YXRlOiAocGFnZSBhcyBhbnkpLnN0YXRlLFxuICAgICAgICBzZXNzaW9uSWQsXG4gICAgICB9O1xuICAgICAgLy8gQXR0YWNoIGFueSBwYWdlLXNuYXBzaG90IHRoYXQgYXJyaXZlZCBiZWZvcmUgdGhpcyBwYWdlIGhlYWRlciBleGlzdGVkLlxuICAgICAgY29uc3QgcGVuZGluZyA9IHBlbmRpbmdTbmFwc2hvdHMuZ2V0KHBhZ2UudXJsKTtcbiAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgIChwYWdlTXNnIGFzIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90KS5zbmFwc2hvdCA9IHBlbmRpbmc7XG4gICAgICAgIHBlbmRpbmdTbmFwc2hvdHMuZGVsZXRlKHBhZ2UudXJsKTtcbiAgICAgIH1cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgcGFnZU1zZyk7XG4gICAgICBwb3NpdGlvbisrO1xuICAgIH1cbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIG5ld01zZyk7XG4gICAgcGVyc2lzdCgpO1xuICAgIC8vIEludGVudGlvbmFsbHkgTk8gc2V0TGFzdEFjdGl2ZShlbnRyeS5zZWxlY3RvcikgaGVyZSDigJQgdGhlIHVzZXIgYXNrZWRcbiAgICAvLyBmb3IgZnJlc2ggY2FwdHVyZXMgdG8gc3RheSB1bi1oaWdobGlnaHRlZCBpbiB0aGUgc2lkZWJhci4gVGhlIHN0aWNreVxuICAgIC8vIHJpbmcgKyBsYXN0LWFjdGl2ZSBvdXRsaW5lIG5vdyBvbmx5IGdldCBhcHBsaWVkIG9uIGV4cGxpY2l0XG4gICAgLy8gaG92ZXIvY2xpY2sgb2YgdGhlIHNpZGViYXIgYnViYmxlIChhbmQgdGhlIHBhZ2Utc2lkZSBmbGFzaCBmcm9tXG4gICAgLy8gY2FwdHVyZUVudHJ5IHN0aWxsIGNvbmZpcm1zIHRoZSBjYXB0dXJlIHZpc3VhbGx5IG9uIHRoZSBwYWdlKS5cbiAgICByZW5kZXIoKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KG5ld01zZyk7XG4gICAgdm9pZCBmaXJlUGFnZVNob3RJZk5lZWRlZChuZXdNc2cpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTY3JlZW5zaG90IHdpcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRmlyZSB0aGUgcGVyLWVsZW1lbnQgc2hvdCwgYXR0YWNoIHRoZSByZXR1cm5lZCBmaWxlbmFtZSArIGRhdGFVcmwgb250b1xuICAvLyB0aGUgZW50cnksIGFuZCBwZXJzaXN0LiBzaG91bGRTa2lwU2NyZWVuc2hvdCBiYWlscyBvbiBob3N0cyBpbiB0aGVcbiAgLy8gdXNlcidzIHNraXAgbGlzdDsgYXV0b1NjcmVlbnNob3Q9ZmFsc2UgYmFpbHMgZ2xvYmFsbHkuXG4gIGNvbnN0IGZpcmVFbGVtZW50U2hvdCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCBza2lwcGVkOiBhdXRvU2NyZWVuc2hvdD1mYWxzZScpO1xuICAgICAgLy8gQnVnICMyOiB0ZWxsIHRoZSBleHBvcnQgd2h5IHRoZSBzaG90IGlzIG1pc3NpbmcuXG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ2F1dG9TY3JlZW5zaG90T2ZmJ307XG4gICAgICAvLyBSZS1yZW5kZXIgc28gdGhlIHJlc2VydmVkIHNrZWxldG9uICh3aGljaCBhc3N1bWVkIGEgc2hvdCB3YXMgY29taW5nKVxuICAgICAgLy8gY29sbGFwc2VzIG5vdyB0aGF0IHdlIGtub3cgb25lIHdvbid0IGFycml2ZS5cbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCBza2lwcGVkOiBob3N0IG9uIHNraXAgbGlzdCcsIG1zZy5lbnRyeS51cmwpO1xuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7Li4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSwgdW5hdmFpbGFibGVSZWFzb246ICdza2lwU2NyZWVuc2hvdEhvc3RzJ307XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IOKGkicsIG1zZy5lbnRyeS5zZWxlY3Rvcik7XG4gICAgLy8gU1cgY29sZC1zdGFydCByYWNlOiB0aGUgRklSU1QgY2FwdHVyZSBpbiBhIHNlc3Npb24gb2Z0ZW4gbG9zZXMgaXRzXG4gICAgLy8gZmlyc3QgbWVzc2FnZSBiZWNhdXNlIHRoZSBiZyB3b3JrZXIgaXMgc3RpbGwgc3RhcnRpbmcuIFJldHJ5IG9uY2VcbiAgICAvLyBhZnRlciBhIHNob3J0IGRlbGF5IGlmIHRoZSBmaXJzdCBjYWxsIGNvbWVzIGJhY2sgbnVsbC9lbXB0eS5cbiAgICBsZXQgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5IHx8ICghcmVwbHkub2sgJiYgIXJlcGx5LmVycm9yKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyc3Qgc2NyZWVuc2hvdCByZXBseSB3YXMgZW1wdHk7IHJldHJ5aW5nIGFmdGVyIDIwMG1zIChTVyBjb2xkLXN0YXJ0KScpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMjAwKSk7XG4gICAgICByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHJlcGx5OicsIHJlcGx5KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHtcbiAgICAgIHNldFN0YXR1cyhgU2NyZWVuc2hvdCBmYWlsZWQ6ICR7cmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICB1bmF2YWlsYWJsZVJlYXNvbjogcmVwbHk/LmVycm9yID8/ICdjYXB0dXJlRmFpbGVkJyxcbiAgICAgIH07XG4gICAgICAvLyBDb2xsYXBzZSB0aGUgcmVzZXJ2ZWQgc2tlbGV0b24g4oCUIG5vIHNob3QgaXMgY29taW5nIGZvciB0aGlzIGNhcHR1cmUuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gU3VjY2Vzc2Z1bCByZXRyeSDigJQgc3RyaXAgYW55IHByaW9yIHVuYXZhaWxhYmxlUmVhc29uIHNpbmNlIHdlIG5vd1xuICAgIC8vIGhhdmUgYSByZWFsIHNob3QuXG4gICAgZGVsZXRlIG1zZy5lbnRyeS5zY3JlZW5zaG90Py51bmF2YWlsYWJsZVJlYXNvbjtcbiAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICBlbGVtZW50OiByZXBseS5maWxlbmFtZSxcbiAgICAgIGNhcHR1cmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIC4uLihyZXBseS5jcm9wID8ge2Nyb3A6IHJlcGx5LmNyb3B9IDoge30pLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChtc2cuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmRhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzKCk7XG4gICAgfVxuICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkge1xuICAgICAgc2hvdHNGdWxsLnNldChtc2cuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIEZpcmUgdGhlIGdyb3VwIHNob3QgKHVuaW9uIGJib3ggb2YgaGVhZCArIGFsbCBtZW1iZXJzKSBhbmQgc3Rhc2ggdGhlXG4gIC8vIGZpbGVuYW1lIG9uIHRoZSBoZWFkLW9mLWdyb3VwIGVudHJ5LlxuICBjb25zdCBmaXJlR3JvdXBTaG90ID0gYXN5bmMgKGhlYWQ6IFNlbGVjdG9yTWVzc2FnZSwgc2VsZWN0b3JzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QoaGVhZC5lbnRyeS51cmwpKSByZXR1cm47XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LWdyb3VwJywgc2VsZWN0b3JzLCBuOiBoZWFkLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgaGVhZC5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgLi4uKGhlYWQuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICBncm91cDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfTtcbiAgICBpZiAocmVwbHkuZGF0YVVybCkge1xuICAgICAgc2hvdHMuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmRhdGFVcmwpO1xuICAgICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7IHNob3RzRnVsbC5zZXQoaGVhZC5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZnVsbERhdGFVcmwpOyBwZXJzaXN0U2hvdHNGdWxsKCk7IH1cbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gUGFnZS1sZXZlbCBzaG90IG9uY2UgcGVyICh3b3Jrc3BhY2UsIHBhZ2UtdXJsLCBkYXkpLiBTdWJzZXF1ZW50IGNhcHR1cmVzXG4gIC8vIG9uIHRoZSBzYW1lIHBhZ2UgcmV1c2UgdGhlIHNhbWUgb24tZGlzayBmaWxlIHBhdGguXG4gIGNvbnN0IGZpcmVQYWdlU2hvdElmTmVlZGVkID0gYXN5bmMgKG1zZzogU2VsZWN0b3JNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkgcmV0dXJuO1xuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIC8vIFBlci1jYXB0dXJlIHBhZ2Utc2hvdCBtb2RlICjCpzQuNSk6IHdoZW4gZW5hYmxlZCwgc2tpcCB0aGVcbiAgICAvLyBwZXItKHdvcmtzcGFjZSwgdXJsKSBkZWR1cGUgYW5kIGZpcmUgYSBmcmVzaCBwYWdlIHNob3QgZXZlcnkgdGltZS5cbiAgICAvLyBVc2VmdWwgd2hlbiB0aGUgcGFnZSBzdGF0ZSBjaGFuZ2VzIGJldHdlZW4gY2FwdHVyZXMgKG1vZGFsIG9wZW5zLFxuICAgIC8vIG11bHRpLXN0ZXAgZmxvdywgZXRjLikgYW5kIHRoZSB1c2VyIHdhbnRzIHRvIHNlZSB0aGUgd2hvbGUgcGFnZSBhdFxuICAgIC8vIGVhY2ggc3RlcC4gQ29zdHMgb25lIGZ1bGwtcGFnZSBQTkcgcGVyIGNhcHR1cmUsIHNvIGRlZmF1bHQgb2ZmLlxuICAgIGlmICghcHJlZnMucGFnZVNob3RQZXJDYXB0dXJlKSB7XG4gICAgICBjb25zdCBrZXkgPSBwYWdlU2hvdEtleShtc2cuZW50cnkudXJsKTtcbiAgICAgIGlmIChwYWdlU2hvdHNGaXJlZC5oYXMoa2V5KSkge1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IGZpbmRFeGlzdGluZ1BhZ2VTaG90KG1zZy5lbnRyeS51cmwpO1xuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgICAgICBwYWdlOiBleGlzdGluZyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwYWdlU2hvdHNGaXJlZC5hZGQoa2V5KTtcbiAgICB9XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgIGtpbmQ6ICdzaG90LXBhZ2UnLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHJldHVybjtcbiAgICAvLyBBcHBseSB0byBUSElTIGVudHJ5IGFuZCB0byBhbnkgb3RoZXIgZW50cmllcyBhbHJlYWR5IGNhcHR1cmVkIG9uIHRoZVxuICAgIC8vIHNhbWUgVVJMIHRvZGF5IChzbyB0aGUgcGFnZS1zaG90IGFwcGVhcnMgdW5pZm9ybWx5KS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSBtc2cuZW50cnkudXJsKSBjb250aW51ZTtcbiAgICAgIG0uZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgLi4uKG0uZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgIHBhZ2U6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gU3Rhc2ggdGhlIGZ1bGwgUE5HIHNvIHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBjYW4gYnVuZGxlIGl0LiBLZXllZFxuICAgIC8vIGJ5IFVSTCBzaW5jZSBwYWdlIHNob3RzIGFyZSBwYWdlLXNjb3BlZCwgbm90IHNlbGVjdG9yLXNjb3BlZC5cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQoJ3BhZ2U6OicgKyBtc2cuZW50cnkudXJsLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaW5kIGFueSBzZWxlY3RvciBlbnRyeSBvbiB0aGlzIFVSTCB0aGF0IGFscmVhZHkgaGFzIGEgYHBhZ2VgIHNob3RcbiAgLy8gcmVjb3JkZWQg4oCUIHVzZWQgc28gdGhhdCByZXRyb2FjdGl2ZSBjYXB0dXJlcyBpbmhlcml0IHRoZSBleGlzdGluZyBQTkdcbiAgLy8gcGF0aCBpbnN0ZWFkIG9mIHJlZmlyaW5nLlxuICBjb25zdCBmaW5kRXhpc3RpbmdQYWdlU2hvdCA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlKSByZXR1cm4gbS5lbnRyeS5zY3JlZW5zaG90LnBhZ2U7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGNvbnN0IG9uSG92ZXIgPSAoe3NlbGVjdG9yLCBsYWJlbCwgdGFnLCByZWN0fTogRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnaG92ZXInfT4pOiB2b2lkID0+IHtcbiAgICBzZXRTdGF0dXMoYEFsdC1ob3ZlciDCtyAke2xhYmVsfWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAvLyBJZGVudGl0eSBpcyAoc2VsZWN0b3IsIHVybCkuIFNhbWUgc2VsZWN0b3Igb24gdHdvIGRpZmZlcmVudCBVUkxzXG4gICAgLy8gaXMgdHdvIGRpZmZlcmVudCBjYXB0dXJlczsgdGhlIHByZXZpb3VzIHNlbGVjdG9yLW9ubHkgbG9va3VwXG4gICAgLy8gY2F1c2VkIGNyb3NzLXBhZ2UgY29tbWVudCBjb250YW1pbmF0aW9uLiBQcmVmZXIgc2FtZS1VUkwgK1xuICAgIC8vIHNhbWUtc2VsZWN0b3IgYXMgdGhlIHN0cm9uZ2VzdCBtYXRjaC5cbiAgICBjb25zdCBleGlzdGluZyA9IGZpbmRDYXB0dXJlRm9yQ3VycmVudFBhZ2Uoc2VsZWN0b3IpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhleGlzdGluZy5pZCk7XG4gICAgICBjb25zdCBmZWVkYmFjayA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKGV4aXN0aW5nLmlkKTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHt1aWQ6IGV4aXN0aW5nLmVudHJ5LnVpZCwgbjogZXhpc3RpbmcuZW50cnkubiwgY2FwdHVyZWQ6IHRydWUsIGZlZWRiYWNrfX0pO1xuICAgICAgaWYgKHBoYW50b21UYXJnZXQpIHsgcGhhbnRvbVRhcmdldCA9IG51bGw7IHJlbmRlcigpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFMV0FZUyBzaG93IHRoZSBjb21tZW50IGJveCwgZXZlbiBmb3IgdW5jYXB0dXJlZCBlbGVtZW50cy4gT24gc3VibWl0XG4gICAgICAvLyB0aGUgY29udGVudCBzY3JpcHQgd2lsbCBjYXB0dXJlIHRoZSBlbGVtZW50IGZpcnN0LCB0aGVuIGF0dGFjaCB0aGVcbiAgICAgIC8vIGNvbW1lbnQg4oCUIHR1cm5pbmcgaG92ZXItY29tbWVudCBpbnRvIGEgY2FwdHVyZStjb21tZW50IHNob3J0Y3V0LlxuICAgICAgcGhhbnRvbVRhcmdldCA9IHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdDogcmVjdCBhcyB1bmtub3duIGFzIERPTVJlY3R9O1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24nLCBzZWxlY3RvciwgcGF5bG9hZDoge2NhcHR1cmVkOiBmYWxzZSwgZmVlZGJhY2s6IFtdfX0pO1xuICAgICAgcmVuZGVyUGhhbnRvbSgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25Ib3ZlckVuZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoc3RhdHVzLnRleHRDb250ZW50Py5zdGFydHNXaXRoKCdBbHQtaG92ZXInKSkgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7XG4gICAgaWYgKHBoYW50b21UYXJnZXQpIHsgcGhhbnRvbVRhcmdldCA9IG51bGw7IHJlbmRlclBoYW50b20oKTsgfVxuICAgIC8vIE5vIGFubm90YXRpb24tY2xlYXIgaGVyZSDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IGtlZXBzIHRoZSBib3ggb3BlbiBzbyB0aGVcbiAgICAvLyB1c2VyIGNhbiBtb3VzZSB0byBpdCBhbmQgdHlwZS4gT3V0c2lkZS1jbGljayAvIEVzYyBkaXNtaXNzIGl0LlxuICB9O1xuXG4gIGNvbnN0IGNvbGxlY3RGZWVkYmFja0FmdGVyID0gKHNlbGVjdG9ySWQ6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAoIWZvdW5kKSB7IGlmIChtLmlkID09PSBzZWxlY3RvcklkKSBmb3VuZCA9IHRydWU7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InIHx8IG0udHlwZSA9PT0gJ3BhZ2UnKSBicmVhaztcbiAgICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIG91dC5wdXNoKG0udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgY29uc3QgY2VudGVyRWxlbWVudEluTGlzdCA9IChlbDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBsaXN0UmVjdCA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZWxSZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdGFyZ2V0ID0gbGlzdC5zY3JvbGxUb3AgKyBlbFJlY3QudG9wIC0gbGlzdFJlY3QudG9wIC0gKGxpc3QuY2xpZW50SGVpZ2h0IC8gMikgKyAoZWxSZWN0LmhlaWdodCAvIDIpO1xuICAgIGxpc3Quc2Nyb2xsVG8oe3RvcDogTWF0aC5tYXgoMCwgdGFyZ2V0KSwgYmVoYXZpb3I6ICdzbW9vdGgnfSk7XG4gIH07XG5cbiAgY29uc3Qgc2Nyb2xsTWVzc2FnZUludG9WaWV3ID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBlbCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgY2VudGVyRWxlbWVudEluTGlzdChlbCk7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gtaW50by12aWV3Jyk7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdmbGFzaC1pbnRvLXZpZXcnKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RpY2t5IGhpZ2hsaWdodCBtYW5hZ2VtZW50IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZXRMYXN0QWN0aXZlID0gKHNlbGVjdG9yOiBzdHJpbmcgfCBudWxsKTogdm9pZCA9PiB7XG4gICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3Rvciwgc3RpY2t5OiB0cnVlfSk7XG4gICAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGFybVN0aWNreUV4cGlyeSA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhclRpbWVvdXQoc3RpY2t5VGltZXIpO1xuICAgIHN0aWNreVRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCFwYW5lbEhvdmVyZWQpIHtcbiAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICAgICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3IubGFzdC1hY3RpdmUnKSkgZWwuY2xhc3NMaXN0LnJlbW92ZSgnbGFzdC1hY3RpdmUnKTtcbiAgICAgIH0gZWxzZSBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9LCBTVElDS1lfVFRMX01TKTtcbiAgfTtcblxuICAvLyBGYXN0IHN0aWNreS1jbGVhcjogd2hlbiB0aGUgdXNlcidzIGN1cnNvciBsZWF2ZXMgdGhlIHBhbmVsLCBmaXJlXG4gIC8vIHN0aWNreS1jbGVhciBhZnRlciBhIDMwMCBtcyBncmFjZSB3aW5kb3cuIFByaW9yIGJlaGF2aW9yIHdhaXRlZCB0aGVcbiAgLy8gZnVsbCBTVElDS1lfVFRMX01TICh+NSBzKSB3aGljaCBmZWx0IGxpa2UgdGhlIHBhZ2Utc2lkZSBoaWdobGlnaHRcbiAgLy8gXCJkb2Vzbid0IGdvIGF3YXkgZXZlbiBhZnRlciBJIHVuaG92ZXJcIi4gMzAwIG1zIGlzIHNob3J0IGVub3VnaCB0b1xuICAvLyBmZWVsIHJlc3BvbnNpdmUgYnV0IGxvbmcgZW5vdWdoIHRoYXQgYSBxdWljayByZXBvc2l0aW9uIChlLmcuXG4gIC8vIGFjY2lkZW50YWxseSBjcm9zc2luZyB0aGUgc2VhbSkgZG9lc24ndCBraWxsIHRoZSByaW5nIG1pZC1mbGlnaHQuXG4gIGxldCBzdGlja3lDbGVhckdyYWNlID0gMDtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIHBhbmVsSG92ZXJlZCA9IHRydWU7XG4gICAgaWYgKHN0aWNreUNsZWFyR3JhY2UpIHsgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpOyBzdGlja3lDbGVhckdyYWNlID0gMDsgfVxuICAgIGFybVN0aWNreUV4cGlyeSgpO1xuICB9KTtcbiAgbGlzdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgIHBhbmVsSG92ZXJlZCA9IGZhbHNlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSBjbGVhclRpbWVvdXQoc3RpY2t5Q2xlYXJHcmFjZSk7XG4gICAgc3RpY2t5Q2xlYXJHcmFjZSA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAvLyBBbHNvIGRyb3Agb3VyIG93biBmcm9tLXBhbmVsICsgbXVsdGkgcmluZ3MgaW4gY2FzZSB0aGV5IGxlYWtlZC5cbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gICAgfSwgMzAwKTtcbiAgfSk7XG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAvLyBXaGVuIHRoZSB1c2VyIG1vdmVzIHRoZWlyIG1vdXNlIGludG8gdGhlIHBhbmVsLCBzdXBwcmVzcyBwYWdlLXNpZGVcbiAgICAvLyBhbHQtaG92ZXIgc3RhdGUgc28gdGhlIG9yYW5nZSByaW5nIGRvZXNuJ3Qga2VlcCBmb2xsb3dpbmcgdGhlIGN1cnNvci5cbiAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYWx0LXN0YXRlJywgb246IGZhbHNlfSk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBSZW5kZXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IE5FQVJfQk9UVE9NX1BYID0gODA7XG4gIGNvbnN0IHdhc05lYXJCb3R0b20gPSAoKTogYm9vbGVhbiA9PlxuICAgIGxpc3Quc2Nyb2xsSGVpZ2h0IC0gbGlzdC5zY3JvbGxUb3AgLSBsaXN0LmNsaWVudEhlaWdodCA8PSBORUFSX0JPVFRPTV9QWDtcblxuICBjb25zdCBtYXRjaGVzU2VhcmNoID0gKG06IFBhbmVsTWVzc2FnZSk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHEgPSBzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiBtLnRleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIC8vIE1hdGNoIGFnYWluc3QgdGhlIFdIT0xFIGVudHJ5IChzZWxlY3RvciwgdGV4dCwgY2xhc3NlcywgYXR0cnMsXG4gICAgICAvLyBvdXRlckhUTUwsIHN0eWxlcywgZXRjLikgc28gc2VhcmNoIGhpdHMgYW55dGhpbmcgdmlzaWJsZSBpbiB0aGVcbiAgICAgIC8vIGJvZHktanNvbi4gU3RyaW5naWZ5aW5nIG9uY2UgaXMgZmluZSDigJQgdGhlIGNvc3QgaXMgdGlueSB2cyByZW5kZXIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICB9XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gKG0udXJsICsgJyAnICsgKG0udGl0bGUgPz8gJycpKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICAvLyBUcnVlIHdoZW4gdGhlIGJ1YmJsZSdzIGJvZHktanNvbiAob3Igb3V0ZXJIVE1MKSBjb250YWlucyB0aGUgc2VhcmNoIOKAlFxuICAvLyB0ZWxscyByZW5kZXJTZWxlY3RvciB0byBhdXRvLWV4cGFuZCBzbyB0aGUgdXNlciBzZWVzIHRoZSBoaWdobGlnaHRlZCBoaXQuXG4gIGNvbnN0IGJvZHlNYXRjaGVzU2VhcmNoID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobS5lbnRyeSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgfTtcblxuICBjb25zdCBpbnNlcnRSYWlsID0gKGJlZm9yZUlkOiBzdHJpbmcpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdpbnNlcnQtcmFpbCc7XG4gICAgZGl2LmRhdGFzZXQuYmVmb3JlSWQgPSBiZWZvcmVJZDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPT09IGJlZm9yZUlkKSB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcbiAgICAgIGRpdi5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlOyByZW5kZXIoKTsgfSxcbiAgICAgICAgb25TdWJtaXQ6ICh0ZXh0KSA9PiBzZW5kSW5saW5lKHRleHQpLFxuICAgICAgICBhdXRvZm9jdXM6IHRydWUsXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgYnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGJ0bi5jbGFzc05hbWUgPSAnYWRkLWJ0bic7XG4gICAgICBidG4uZGF0YXNldC50aXAgPSAnSW5zZXJ0IGNhcHR1cmUgb3IgY29tbWVudCBoZXJlJztcbiAgICAgIGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnSW5zZXJ0IGNhcHR1cmUgb3IgY29tbWVudCBoZXJlJyk7XG4gICAgICBidG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdwbHVzJywgMTIpO1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkOyBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7IHJlbmRlcigpOyB9KTtcbiAgICAgIGRpdi5hcHBlbmQoYnRuKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICB0eXBlIElubGluZUNvbW1lbnRPcHRzID0ge1xuICAgIGluaXRpYWw/OiBzdHJpbmc7XG4gICAgb25DYW5jZWw/OiAoKSA9PiB2b2lkO1xuICAgIG9uU3VibWl0PzogKHRleHQ6IHN0cmluZykgPT4gdm9pZDtcbiAgICBhdXRvZm9jdXM/OiBib29sZWFuO1xuICB9O1xuICBjb25zdCBidWlsZElubGluZUNvbW1lbnQgPSAoe2luaXRpYWwgPSAnJywgb25DYW5jZWwsIG9uU3VibWl0LCBhdXRvZm9jdXN9OiBJbmxpbmVDb21tZW50T3B0cyk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcC5jbGFzc05hbWUgPSAnaW5saW5lLWNvbW1lbnQnO1xuICAgIGNvbnN0IHRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB0YS52YWx1ZSA9IGluaXRpYWw7XG4gICAgdGEucm93cyA9IDI7XG4gICAgdGEucGxhY2Vob2xkZXIgPSAnSW5zZXJ0IGEgY29tbWVudCBoZXJlLCBvciBBbHQrQ2xpY2sgdG8gaW5zZXJ0IGEgY2FwdHVyZSc7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcm93LmNsYXNzTmFtZSA9ICdyb3cnO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9ICcwdyDCtyAwdCc7XG4gICAgLy8gQm90aCBTYXZlIC8gQ2FuY2VsIGFyZSB1bmlmb3JtIGljb24gYnV0dG9ucyAoLmljb25idG4pLiBTYXZlIHVzZXMgdGhlXG4gICAgLy8gcHJpbWFyeSBhY2NlbnQgdmFyaWFudCB2aWEgLnByaW1hcnkgc28gaXQgc3RpbGwgcG9wcywgYnV0IGl0cyB3aWR0aFxuICAgIC8vIG1hdGNoZXMgQ2FuY2VsIGV4YWN0bHkuXG4gICAgY29uc3QgY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjYW5jZWwuY2xhc3NOYW1lID0gJ2ljb25idG4nO1xuICAgIGNhbmNlbC5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgwrcgRXNjJztcbiAgICBjYW5jZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBpbmxpbmUgY29tbWVudCcpO1xuICAgIGNhbmNlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAyMCk7XG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gb25DYW5jZWw/LigpKTtcbiAgICBjb25zdCBzZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2VuZC50eXBlID0gJ2J1dHRvbic7XG4gICAgc2VuZC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwcmltYXJ5JztcbiAgICBzZW5kLmRhdGFzZXQudGlwID0gJ1NhdmUgwrcgRW50ZXInO1xuICAgIHNlbmQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1NhdmUgaW5saW5lIGNvbW1lbnQnKTtcbiAgICBzZW5kLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAyMCk7XG4gICAgY29uc3Qgc3VibWl0ID0gKCk6IHZvaWQgPT4gb25TdWJtaXQ/Lih0YS52YWx1ZSk7XG4gICAgc2VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdCk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7IG1ldGEudGV4dENvbnRlbnQgPSBgJHt3b3JkQ291bnQodGEudmFsdWUpfXcgwrcgJHt0b2tlbkNvdW50KHRhLnZhbHVlKX10YDsgfSk7XG4gICAgdGEuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgc3VibWl0KCk7IH1cbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIG9uQ2FuY2VsPy4oKTtcbiAgICB9KTtcbiAgICByb3cuYXBwZW5kKG1ldGEsIGNhbmNlbCwgc2VuZCk7XG4gICAgd3JhcC5hcHBlbmQodGEsIHJvdyk7XG4gICAgaWYgKGF1dG9mb2N1cykgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhLmZvY3VzKCkpO1xuICAgIHJldHVybiB3cmFwO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRJbmxpbmUgPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGV4dCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgYmVmb3JlSWQgPSBpbnNlcnRCZWZvcmUuY3VycmVudDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsZXQgcG9zID0gYmVmb3JlSWQgPyBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGJlZm9yZUlkKSA6IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAocG9zIDwgMCkgcG9zID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIC8vIHBhcmVudFVpZCByZXNvbHV0aW9uOiB3YWxrIGJhY2sgZnJvbSB0aGUgaW5zZXJ0IHBvc2l0aW9uIHRvIHRoZVxuICAgIC8vIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yLiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciB0aGUgRksuXG4gICAgbGV0IHBJZHggPSBwb3MgLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGZiOiBGZWVkYmFja01lc3NhZ2UgPSB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9O1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3MsIDAsIGZiKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdJbnNlcnRlZCcpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBoYW50b20gPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGhhbnRvbScpPy5yZW1vdmUoKTtcbiAgICBpZiAoIXBoYW50b21UYXJnZXQpIHJldHVybjtcbiAgICBjb25zdCBwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBoLmNsYXNzTmFtZSA9ICdwaGFudG9tIHZpc2libGUnO1xuICAgIHBoLmlubmVySFRNTCA9IGA8Y29kZT4ke2VzY2FwZUh0bWwocGhhbnRvbVRhcmdldC5sYWJlbCl9PC9jb2RlPmA7XG4gICAgbGlzdC5hcHBlbmQocGgpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIC8vIFJlb3JkZXIgYSBmbGF0IG1lc3NhZ2UgbGlzdCBzbyBzZWxlY3RvcnMgd2l0aGluIGVhY2ggcGFnZS1kZWxpbWl0ZWRcbiAgLy8gYmxvY2sgYXJlIHNvcnRlZCBieSB0aGVpciB2aXN1YWwgcmVjdCAodG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQpLlxuICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIChjYXB0dXJlXG4gIC8vIGFkamFjZW5jeSkgc28gZWRpdGluZy90aHJlYWRpbmcgYmVoYXZpb3Igc3Vydml2ZXMgdGhlIHNvcnQuXG4gIC8vXG4gIC8vIFVzZWQgT05MWSBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIChgYnVpbGRTbGltYCksIG5vdCB0aGUgc2lkZWJhclxuICAvLyByZW5kZXIuIFRoZSBzaWRlYmFyIGtlZXBzIG1lc3NhZ2VzIGluIGluc2VydGlvbi9jYXB0dXJlIG9yZGVyIHNvXG4gIC8vIHRoZSB1c2VyIHNlZXMgdGhlbSB3aGVyZSB0aGV5IGV4cGVjdDsgdGhlIGV4cG9ydCBnZXRzIHRoZSBhZ2VudC1cbiAgLy8gZnJpZW5kbHkgcmVhZGluZy1vcmRlciB0cmVhdG1lbnQuXG4gIGNvbnN0IHJlb3JkZXJGb3JFeHBvcnQgPSAobXNnczogUGFuZWxNZXNzYWdlW10pOiBQYW5lbE1lc3NhZ2VbXSA9PiB7XG4gICAgdHlwZSBHcm91cCA9IHtraW5kOiAnZ3JvdXAnOyBzZWw6IFNlbGVjdG9yTWVzc2FnZTsgdHJhaWxpbmc6IEZlZWRiYWNrTWVzc2FnZVtdfTtcbiAgICB0eXBlIExvb3NlID0ge2tpbmQ6ICdsb29zZSc7IG06IEZlZWRiYWNrTWVzc2FnZX07XG4gICAgdHlwZSBTbG90ID0gR3JvdXAgfCBMb29zZSB8IHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfTtcbiAgICBjb25zdCBzbG90czogU2xvdFtdID0gW107XG4gICAgbGV0IGN1ckdyb3VwOiBHcm91cCB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGZsdXNoR3JvdXAgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoY3VyR3JvdXApIHsgc2xvdHMucHVzaChjdXJHcm91cCk7IGN1ckdyb3VwID0gbnVsbDsgfVxuICAgIH07XG4gICAgZm9yIChjb25zdCBtIG9mIG1zZ3MpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIHNsb3RzLnB1c2goe2tpbmQ6ICdwYWdlJywgbX0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBjdXJHcm91cCA9IHtraW5kOiAnZ3JvdXAnLCBzZWw6IG0sIHRyYWlsaW5nOiBbXX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEZXRhY2hlZCBjb21tZW50cyBuZXZlciB0cmF2ZWwgd2l0aCB0aGUgcHJlY2VkaW5nIHNlbGVjdG9yJ3NcbiAgICAgICAgLy8gZ3JvdXAg4oCUIHRoZXkgc3RheSBsb29zZSBpbiBleHBvcnQgb3JkZXIuXG4gICAgICAgIGlmIChjdXJHcm91cCAmJiAhbS5kZXRhY2hlZCkgY3VyR3JvdXAudHJhaWxpbmcucHVzaChtKTtcbiAgICAgICAgZWxzZSBzbG90cy5wdXNoKHtraW5kOiAnbG9vc2UnLCBtfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoR3JvdXAoKTtcbiAgICBjb25zdCBvdXQ6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gICAgbGV0IHJ1blN0YXJ0ID0gMDtcbiAgICBjb25zdCBmbHVzaFJ1biA9IChlbmQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwUmVjdHM6IEFycmF5PHtpZHg6IG51bWJlcjsgeTogbnVtYmVyOyB4OiBudW1iZXJ9PiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IHJ1blN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHIgPSBzLnNlbC5lbnRyeS5yZWN0O1xuICAgICAgICAgIGdyb3VwUmVjdHMucHVzaCh7aWR4OiBpLCB5OiByPy55ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgeDogcj8ueCA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9KTtcbiAgICAgICAgfVxuICAgICAgICBpbmRpY2VzLnB1c2goaSk7XG4gICAgICB9XG4gICAgICBncm91cFJlY3RzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGEueSAhPT0gYi55KSByZXR1cm4gYS55IC0gYi55O1xuICAgICAgICByZXR1cm4gYS54IC0gYi54O1xuICAgICAgfSk7XG4gICAgICBsZXQgZ2kgPSAwO1xuICAgICAgZm9yIChjb25zdCBpIG9mIGluZGljZXMpIHtcbiAgICAgICAgY29uc3QgcyA9IHNsb3RzW2ldITtcbiAgICAgICAgaWYgKHMua2luZCA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50SWR4ID0gZ3JvdXBSZWN0c1tnaSsrXSEuaWR4O1xuICAgICAgICAgIGNvbnN0IHIgPSBzbG90c1tyZXBsYWNlbWVudElkeF0hIGFzIEdyb3VwO1xuICAgICAgICAgIG91dC5wdXNoKHIuc2VsKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGYgb2Ygci50cmFpbGluZykgb3V0LnB1c2goZik7XG4gICAgICAgIH0gZWxzZSBpZiAocy5raW5kID09PSAnbG9vc2UnKSB7XG4gICAgICAgICAgb3V0LnB1c2gocy5tKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNsb3RzW2ldIS5raW5kID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hSdW4oaSk7XG4gICAgICAgIG91dC5wdXNoKChzbG90c1tpXSBhcyB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX0pLm0pO1xuICAgICAgICBydW5TdGFydCA9IGkgKyAxO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaFJ1bihzbG90cy5sZW5ndGgpO1xuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHN0aWNrVG9Cb3R0b20gPSBsaXN0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCB3YXNOZWFyQm90dG9tKCk7XG4gICAgbGlzdC5pbm5lckhUTUwgPSAnJztcblxuICAgIC8vIFN0YXRzIG51bWJlcnNcbiAgICBsZXQgdG90YWxTZWxlY3RvcnMgPSAwO1xuICAgIGxldCB0b3RhbENvbW1lbnRzID0gMDtcbiAgICBsZXQgdG90YWxTdGFsZSA9IDA7XG4gICAgY29uc3QgZGlzdGluY3RQYWdlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICB0b3RhbFNlbGVjdG9ycysrO1xuICAgICAgICBpZiAoc2VsZWN0b3JWYWxpZGl0eS5nZXQobS5lbnRyeS5zZWxlY3RvcikgPT09IGZhbHNlKSB0b3RhbFN0YWxlKys7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgdG90YWxDb21tZW50cysrO1xuICAgICAgZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLnNvbWUoKHgpID0+IHgudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiB4LmVudHJ5LnVybCA9PT0gbS51cmwpKSBkaXN0aW5jdFBhZ2VzLmFkZChtLnVybCk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzZWxlY3RvcnNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU2VsZWN0b3JzKTtcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwiY29tbWVudHNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsQ29tbWVudHMpO1xuICAgIGNvbnN0IHN0YWxlTnVtID0gc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInN0YWxlXCJdIC5zdGF0LW51bScpITtcbiAgICBzdGFsZU51bS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFN0YWxlKTtcbiAgICBzdGFsZU51bS5kYXRhc2V0Lnplcm8gPSB0b3RhbFN0YWxlID09PSAwID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwicGFnZXNcIl0gLnN0YXQtbnVtJykhLnRleHRDb250ZW50ID0gU3RyaW5nKGRpc3RpbmN0UGFnZXMuc2l6ZSk7XG4gICAgY29uc3QgZXhwb3J0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBzdGF0VG9rZW5zLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh0b2tlbkNvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcbiAgICBzdGF0V29yZHMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHdvcmRDb3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG5cbiAgICAvLyBNaW5pZnkgcmVkdWN0aW9uIHN0YXRzXG4gICAgbGV0IGZ1bGxUID0gMCwgY3VyVCA9IDAsIGZ1bGxXID0gMCwgY3VyVyA9IDAsIHBjdCA9IDA7XG4gICAgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgIGNvbnN0IHdhc01pbiA9IHByZWZzLm1pbmlmeTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHRydWU7IGNvbnN0IG1pblRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSBmYWxzZTsgY29uc3QgZnVsbFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB3YXNNaW47XG4gICAgICBmdWxsVCA9IHRva2VuQ291bnQoZnVsbFRleHQpOyBjdXJUID0gdG9rZW5Db3VudChtaW5UZXh0KTtcbiAgICAgIGZ1bGxXID0gd29yZENvdW50KGZ1bGxUZXh0KTsgY3VyVyA9IHdvcmRDb3VudChtaW5UZXh0KTtcbiAgICAgIHBjdCA9IGZ1bGxUID4gMCA/IE1hdGgucm91bmQoKDEgLSBjdXJUIC8gZnVsbFQpICogMTAwKSA6IDA7XG4gICAgfVxuICAgIGNvbnN0IG1pbmlmeVN0YXRzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWluaWZ5LXN0YXRzXScpO1xuICAgIGlmIChtaW5pZnlTdGF0c0VsKSB7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGAke2Z1bGxULnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clQudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7ZnVsbFcudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVy50b0xvY2FsZVN0cmluZygpfSB3b3JkcyDCtyAke3BjdH0lIHJlZHVjdGlvbmA7XG4gICAgICB9IGVsc2UgaWYgKGV4cG9ydFRleHQpIHtcbiAgICAgICAgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9IGBXb3VsZCBzYXZlICR7KGZ1bGxUIC0gY3VyVCkudG9Mb2NhbGVTdHJpbmcoKX0gdG9rZW5zIMK3ICR7cGN0fSUgaWYgZW5hYmxlZGA7XG4gICAgICB9IGVsc2UgbWluaWZ5U3RhdHNFbC50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIC8vIFBlci1jaGVja2JveCBjb250cmlidXRpb24gc3RhdHM6IGhvdyBtYW55IHRva2Vucy93b3JkcyBlYWNoIHRvZ2dsZVxuICAgIC8vIGFkZHMgdG8gdGhlIGN1cnJlbnQgZXhwb3J0LiBDb21wdXRlZCBieSB0b2dnbGluZyB0aGF0IHNpbmdsZSBwcmVmXG4gICAgLy8gYW5kIGRpZmZpbmcgdGhlIGV4cG9ydCDigJQgZ2l2ZXMgYW4gaG9uZXN0IGFuc3dlciB0aGF0IHJlZmxlY3RzIHRoZVxuICAgIC8vIGN1cnJlbnQgbWluaWZ5IHN0YXRlIGFuZCB0aGUgcmVzdCBvZiB0aGUgdG9nZ2xlcy5cbiAgICBjb25zdCBjb250cmliS2V5czogQXJyYXk8a2V5b2YgUHJlZnM+ID0gWydpbmNsdWRlT3V0ZXJIVE1MJywgJ2luY2x1ZGVNYXRjaGVkUnVsZXMnLCAnaW5jbHVkZVN0eWxlcyddO1xuICAgIGlmIChleHBvcnRUZXh0ICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYmFzZVQgPSB0b2tlbkNvdW50KGV4cG9ydFRleHQpO1xuICAgICAgY29uc3QgYmFzZVcgPSB3b3JkQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmICghZWwpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCB3YXNPbiA9IHByZWZzW2tleV0gYXMgYm9vbGVhbjtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9ICF3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IHdhc09uO1xuICAgICAgICBjb25zdCBhbHRUID0gdG9rZW5Db3VudChhbHRUZXh0KTtcbiAgICAgICAgY29uc3QgYWx0VyA9IHdvcmRDb3VudChhbHRUZXh0KTtcbiAgICAgICAgLy8gd2FzT249dHJ1ZSDihpIgY3VycmVudGx5IGluY2x1ZGVkOyBjb3N0ID0gYmFzZSAtIGFsdCAodHVybmluZyBPRkYgc2F2ZXMgdGhpcykuXG4gICAgICAgIC8vIHdhc09uPWZhbHNlIOKGkiBjdXJyZW50bHkgZXhjbHVkZWQ7IGdhaW4gPSBhbHQgLSBiYXNlICh0dXJuaW5nIE9OIGFkZHMgdGhpcykuXG4gICAgICAgIGNvbnN0IGRUID0gd2FzT24gPyBiYXNlVCAtIGFsdFQgOiBhbHRUIC0gYmFzZVQ7XG4gICAgICAgIGNvbnN0IGRXID0gd2FzT24gPyBiYXNlVyAtIGFsdFcgOiBhbHRXIC0gYmFzZVc7XG4gICAgICAgIGNvbnN0IHNpZ24gPSB3YXNPbiA/ICcnIDogJysnO1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHdhc09uXG4gICAgICAgICAgPyBgwrcgJHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpbiBleHBvcnQke3ByZWZzLm1pbmlmeSA/ICcgKG1pbmlmaWVkKScgOiAnJ31gXG4gICAgICAgICAgOiBgwrcgJHtzaWdufSR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke3NpZ259JHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGlmIGVuYWJsZWRgO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb250cmliS2V5cykge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1jb250cmliPVwiJHtrZXl9XCJdYCk7XG4gICAgICAgIGlmIChlbCkgZWwudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUb29sYmFyIGV4cG9ydCBzdGF0c1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcuc3RhdC5leHBvcnQtc3RhdHMnKS5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICBjb25zdCBudW0gPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1udW0nKTtcbiAgICAgIGNvbnN0IGxhYiA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LWxhYmVsJyk7XG4gICAgICBpZiAobnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQhLnJlcGxhY2UoL1xcKiQvLCAnJyk7XG4gICAgICBpZiAobGFiKSBsYWIudGV4dENvbnRlbnQgPSBsYWIudGV4dENvbnRlbnQhLnJlcGxhY2UoL15cXCovLCAnJyk7XG4gICAgICBpZiAocHJlZnMubWluaWZ5ICYmIG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50ICsgJyonO1xuICAgICAgY29uc3QgaXNUb2tlbiA9IGkgPT09IDA7XG4gICAgICBjb25zdCBmdWxsViA9IGlzVG9rZW4gPyBmdWxsVCA6IGZ1bGxXO1xuICAgICAgY29uc3QgY3VyViA9IGlzVG9rZW4gPyBjdXJUIDogY3VyVztcbiAgICAgIGNvbnN0IHdoaWNoID0gaXNUb2tlbiA/ICd0b2tlbnMnIDogJ3dvcmRzJztcbiAgICAgIHMuZGF0YXNldC50aXAgPSBwcmVmcy5taW5pZnlcbiAgICAgICAgPyBgTUlOSUZJRUQgwrcgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9XFxuRnVsbCB3b3VsZCBiZSAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgXG4gICAgICAgIDogYCR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH0gwrcgZnVsbCBleHBvcnRcXG5NaW5pZmllZCB3b3VsZCBiZSAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWA7XG4gICAgfSk7XG5cbiAgICBpZiAobWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZW1wdHkuY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgICAgIGVtcHR5LmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiZW1wdHktaWNvblwiPvCfpI88L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LXRpdGxlXCI+U3RhcnQgd2l0aCB0aGUgcGFnZSB5b3Ugd2FudCB0byBjcml0aXF1ZS48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LWJvZHlcIj5PcGVuIGEgcGFnZSwgdGhlbiBjYXB0dXJlIGFuIGVsZW1lbnQuIENvbW1lbnRzIHN0YXkgcGFpcmVkIHdpdGggdGhlIHRoaW5nIHlvdSBncmFiYmVkLjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHkta2V5c1wiPkFsdCtDbGljayB0byBjYXB0dXJlPC9kaXY+YDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSByZW5kZXJQZW5kaW5nQmF5KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0b3JVcmxzID0gbmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS51cmwpKTtcbiAgICBjb25zdCB2aXNpYmxlTWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0udHlwZSAhPT0gJ3BhZ2UnIHx8IHNlbGVjdG9yVXJscy5oYXMobS51cmwpKTtcbiAgICBjb25zdCBwaW5uZWQgPSB2aXNpYmxlTWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIEJvb2xlYW4obS5waW5uZWQpKTtcbiAgICBjb25zdCB1bnBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pID0+ICFwaW5uZWQuaW5jbHVkZXMobSBhcyBTZWxlY3Rvck1lc3NhZ2UpKTtcbiAgICAvLyBTaWRlYmFyIHNob3dzIGNhcHR1cmVzIGluIElOU0VSVElPTiBvcmRlciAobW9zdCByZWNlbnQgYXQgdGhlXG4gICAgLy8gYm90dG9tKS4gVmlzdWFsLXBvc2l0aW9uIHJlb3JkZXJpbmcgaGFwcGVucyBPTkxZIGF0IGV4cG9ydCB0aW1lXG4gICAgLy8gc28gdGhlIHNpZGViYXIgc3RheXMgcHJlZGljdGFibGUgd2hpbGUgdGhlIGFnZW50LWZhY2luZyBleHBvcnRcbiAgICAvLyBnZXRzIHJlYWRpbmctb3JkZXIgY29udmVuaWVuY2UuIChQcmlvciBpbXBsZW1lbnRhdGlvbiBzb3J0ZWQgaW5cbiAgICAvLyBib3RoIHBsYWNlczsgdXNlciBmZWVkYmFjayB3YXMgdGhhdCBzaWRlYmFyIHNodWZmbGluZyB3YXNcbiAgICAvLyBkaXNvcmllbnRpbmcuKVxuICAgIGNvbnN0IG9yZGVyZWQgPSBbLi4ucGlubmVkLCAuLi51bnBpbm5lZF07XG5cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG1lc3NhZ2VzWzBdIS5pZCkpO1xuICAgIGxldCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIC8vIFRyYWNrIHRoZSBVUkwgb2YgdGhlIG1vc3QgcmVjZW50bHkgcmVuZGVyZWQgcGFnZSBkaXZpZGVyIHNvIHdlIGNhblxuICAgIC8vIHN1cHByZXNzIGEgcmVwZWF0ZWQgaGVhZGVyIHdoZW4gY29uc2VjdXRpdmUgY2FwdHVyZXMgc2hhcmUgdGhlIHNhbWVcbiAgICAvLyBwYWdlLiBSZXN0YXRpbmcgdGhlIFVSTCBhYm92ZSBldmVyeSBjYXB0dXJlIGluIGEgc2FtZS1VUkwgcnVuIGlzXG4gICAgLy8gbm9pc2Ug4oCUIHRoZSBkaXZpZGVyIG9ubHkgZWFybnMgaXRzIHNwYWNlIHdoZW4gdGhlIFVSTCBhY3R1YWxseVxuICAgIC8vIGNoYW5nZXMgZnJvbSB0aGUgcHJldmlvdXMgY2FwdHVyZSBpbiBzZXF1ZW5jZS5cbiAgICBsZXQgbGFzdFJlbmRlcmVkUGFnZVVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJlbmRlcmVkQW55ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmRlcmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gb3JkZXJlZFtpXSE7XG4gICAgICBpZiAoIW1hdGNoZXNTZWFyY2gobSkpIGNvbnRpbnVlO1xuICAgICAgLy8gQ29sbGFwc2UgY29uc2VjdXRpdmUgc2FtZS1VUkwgcGFnZSBkaXZpZGVycyBpbnRvIHRoZSBmaXJzdCBvbmUuXG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgaWYgKG0udXJsID09PSBsYXN0UmVuZGVyZWRQYWdlVXJsKSBjb250aW51ZTtcbiAgICAgICAgbGFzdFJlbmRlcmVkUGFnZVVybCA9IG0udXJsO1xuICAgICAgfVxuICAgICAgLy8gRGV0YWNoZWQgY29tbWVudHMgcmVuZGVyIHVudGhyZWFkZWQg4oCUIGFkamFjZW5jeSBtdXN0IG5vdCByZS1hZG9wdFxuICAgICAgLy8gYSBjb21tZW50IHRoZSB1c2VyIGV4cGxpY2l0bHkgZGlzYXNzb2NpYXRlZC5cbiAgICAgIGNvbnN0IGFkamFjZW5jeSA9IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiBtLmRldGFjaGVkID8gbnVsbCA6IGxhc3RTZWxlY3RvclNlbDtcbiAgICAgIGNvbnN0IG5vZGUgPSByZW5kZXJNZXNzYWdlKG0sIGFkamFjZW5jeSk7XG4gICAgICBsaXN0LmFwcGVuZChub2RlKTtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGxhc3RTZWxlY3RvclNlbCA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBpZiAoaSA8IG9yZGVyZWQubGVuZ3RoIC0gMSkgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbChvcmRlcmVkW2kgKyAxXSEuaWQpKTtcbiAgICAgIHJlbmRlcmVkQW55ID0gdHJ1ZTtcbiAgICB9XG4gICAgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbCgnX19lbmRfXycpKTtcbiAgICBpZiAoIXJlbmRlcmVkQW55ICYmIHNlYXJjaFF1ZXJ5KSB7XG4gICAgICBjb25zdCBlbXB0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZW1wdHkuY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgICAgIGVtcHR5LnRleHRDb250ZW50ID0gYE5vIG1hdGNoZXMgZm9yIFwiJHtzZWFyY2hRdWVyeX1cIi5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgIH1cblxuICAgIGlmIChwZW5kaW5nTXVsdGkubGVuZ3RoKSByZW5kZXJQZW5kaW5nQmF5KCk7XG4gICAgaWYgKHBoYW50b21UYXJnZXQpIHJlbmRlclBoYW50b20oKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXdOb29kbGVzKTtcbiAgICBpZiAoc3RpY2tUb0JvdHRvbSkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgbGlzdC5zY3JvbGxUb3AgPSBsaXN0LnNjcm9sbEhlaWdodDsgfSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGVuZGluZ0JheSA9ICgpOiB2b2lkID0+IHtcbiAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoJy5wZW5kaW5nLWJheScpPy5yZW1vdmUoKTtcbiAgICBpZiAoIXBlbmRpbmdNdWx0aS5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBiYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBiYXkuY2xhc3NOYW1lID0gJ3BlbmRpbmctYmF5JztcbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAncGVuZGluZy1oZWFkJztcbiAgICBoZWFkLnRleHRDb250ZW50ID0gYFBlbmRpbmcgZ3JvdXAgwrcgJHtwZW5kaW5nTXVsdGkubGVuZ3RofSBlbGVtZW50JHtwZW5kaW5nTXVsdGkubGVuZ3RoID09PSAxID8gJycgOiAncyd9YDtcbiAgICBiYXkuYXBwZW5kKGhlYWQpO1xuICAgIHBlbmRpbmdNdWx0aS5mb3JFYWNoKChlLCBpKSA9PiB7XG4gICAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjYXJkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWNhcmQnO1xuICAgICAgY29uc3Qgc2VxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgc2VxLmNsYXNzTmFtZSA9ICdzZXEnO1xuICAgICAgc2VxLnRleHRDb250ZW50ID0gYCMke2kgKyAxfWA7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gKGUudGV4dCAmJiBlLnRleHQubGVuZ3RoIDw9IDYwID8gZS50ZXh0IDogKGUuY29tcG9uZW50Um9vdCA/PyBlLnNlbGVjdG9yID8/IGUudGFnKSk7XG4gICAgICBjYXJkLmFwcGVuZChzZXEsIGxhYmVsKTtcbiAgICAgIGJheS5hcHBlbmQoY2FyZCk7XG4gICAgfSk7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcm93LmNsYXNzTmFtZSA9ICdwZW5kaW5nLXJvdyc7XG4gICAgY29uc3QgY29tbWl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29tbWl0LnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb21taXQuY2xhc3NOYW1lID0gJ3ByaW1hcnkgcGVuZGluZy1jb21taXQnO1xuICAgIGNvbW1pdC50ZXh0Q29udGVudCA9IGBDb21taXQgZ3JvdXAgwrcgJHtwZW5kaW5nTXVsdGkubGVuZ3RofWA7XG4gICAgY29tbWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9KSk7XG4gICAgY29uc3QgY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjYW5jZWwuY2xhc3NOYW1lID0gJ2ljb25idG4gcGVuZGluZy1jYW5jZWwnO1xuICAgIGNhbmNlbC5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgcGVuZGluZyBncm91cCc7XG4gICAgY2FuY2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgcGVuZGluZyBncm91cCcpO1xuICAgIGNhbmNlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAxMyk7XG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2VuZFRvQ1Moe2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9KSk7XG4gICAgcm93LmFwcGVuZChjb21taXQsIGNhbmNlbCk7XG4gICAgYmF5LmFwcGVuZChyb3cpO1xuICAgIGNvbnN0IGhpbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoaW50LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhpbnQnO1xuICAgIGhpbnQudGV4dENvbnRlbnQgPSAnQWx0K1NoaWZ0K0NsaWNrIG1vcmUgwrcgQ29tbWl0IHRvIGZpbmFsaXplIMK3IEVzYyB0byBjYW5jZWwnO1xuICAgIGJheS5hcHBlbmQoaGludCk7XG4gICAgbGlzdC5hcHBlbmQoYmF5KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgTm9vZGxlcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgY2xlYXJOb29kbGVzID0gKCk6IHZvaWQgPT4geyBmb3IgKGNvbnN0IG4gb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcudHJlZS1ub29kbGUnKSkgbi5yZW1vdmUoKTsgfTtcblxuICAvLyBDcm9zcy1zZWFtIHBhbmVs4oaUY2FudmFzIG5vb2RsZXMgd2VyZSByZW1vdmVkOiBhbGlnbmluZyB0d28gU1ZHIGhhbHZlc1xuICAvLyBhY3Jvc3MgdGhlIHBhbmVsL3BhZ2UgYm91bmRhcnkgZGVwZW5kZWQgb24gaW5uZXJIZWlnaHQgcGFyaXR5IHdoaWNoXG4gIC8vIGJyZWFrcyB1bmRlciBEZXZUb29scyBkb2NrIGFuZCB6b29tLCBhbmQgdGhlIHZpc3VhbCBiZW5lZml0IGRpZG4ndFxuICAvLyBqdXN0aWZ5IHRoZSBtYWludGVuYW5jZSBjb3N0LiBUaGUgaW4tcGFuZWwgZmVlZGJhY2stdHJlZSBub29kbGVzXG4gIC8vIChkcmF3Tm9vZGxlIC8gcmVkcmF3Tm9vZGxlcyBiZWxvdykgYXJlIHVuYWZmZWN0ZWQuXG4gIGNvbnN0IGNsZWFyQnViYmxlTm9vZGxlID0gKCk6IHZvaWQgPT4geyAvKiBuby1vcCAqLyB9O1xuICBjb25zdCByZWRyYXdOb29kbGVzID0gKCk6IHZvaWQgPT4ge1xuICAgIGNsZWFyTm9vZGxlcygpO1xuICAgIGxldCBsYXN0U2VsZWN0b3JFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgWy4uLmxpc3QuY2hpbGRyZW5dIGFzIEhUTUxFbGVtZW50W10pIHtcbiAgICAgIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdG9yJykpIGxhc3RTZWxlY3RvckVsID0gbm9kZTtcbiAgICAgIC8vIE9ubHkgVEhSRUFERUQgY29tbWVudHMgZ2V0IGEgY29ubmVjdG9yIOKAlCBhIGRldGFjaGVkIGNvbW1lbnQgbXVzdFxuICAgICAgLy8gbG9zZSBpdHMgbm9vZGxlLCBub3QganVzdCBpdHMgaW5kZW50ICh0aGUgdmlzaWJsZSBcImRpc2Nvbm5lY3RcIikuXG4gICAgICBlbHNlIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbXNnJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlZWRiYWNrJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RocmVhZGVkJykgJiYgbGFzdFNlbGVjdG9yRWwpIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIG5vZGUpO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2luc2VydC1yYWlsJykgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2V4cGFuZGVkJykgJiYgbGFzdFNlbGVjdG9yRWwpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gbm9kZS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmlubGluZS1jb21tZW50JykgPz8gbm9kZTtcbiAgICAgICAgZHJhd05vb2RsZShsYXN0U2VsZWN0b3JFbCwgdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZGl2aWRlcicpIHx8IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncm91cC1oZWFkJykpIHtcbiAgICAgICAgbGFzdFNlbGVjdG9yRWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgZHJhd05vb2RsZSA9IChzZWxlY3RvckVsOiBIVE1MRWxlbWVudCwgZmVlZGJhY2tFbDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzUiA9IHNlbGVjdG9yRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZlIgPSBmZWVkYmFja0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxSID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB4MSA9IHNSLmxlZnQgLSBsUi5sZWZ0ICsgMTI7XG4gICAgY29uc3QgeTEgPSBzUi5ib3R0b20gLSBsUi50b3AgKyBsaXN0LnNjcm9sbFRvcDtcbiAgICBjb25zdCB4MiA9IGZSLmxlZnQgLSBsUi5sZWZ0O1xuICAgIGNvbnN0IHkyID0gZlIudG9wIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3AgKyAxNDtcbiAgICBjb25zdCB3ID0gTWF0aC5tYXgoMjAsIHgyIC0geDEgKyA0KTtcbiAgICBjb25zdCBoID0gTWF0aC5tYXgoMjAsIHkyIC0geTEpO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndHJlZS1ub29kbGUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyh3KSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKGgpKTtcbiAgICBzdmcuc3R5bGUubGVmdCA9IGAke3gxIC0gMn1weGA7XG4gICAgc3ZnLnN0eWxlLnRvcCA9IGAke3kxfXB4YDtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgY29uc3Qgc3ggPSAyLCBzeSA9IDAsIGV4ID0gdyAtIDIsIGV5ID0gaDtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIGBNICR7c3h9ICR7c3l9IEMgJHtzeH0gJHtzeSArIGggKiAwLjU1fSwgJHtleCAtIHcgKiAwLjR9ICR7ZXl9LCAke2V4fSAke2V5fWApO1xuICAgIHN2Zy5hcHBlbmQocGF0aCk7XG4gICAgbGlzdC5hcHBlbmQoc3ZnKTtcbiAgfTtcbiAgbGV0IHNjcm9sbFJhZiA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgIGlmIChzY3JvbGxSYWYpIHJldHVybjtcbiAgICBzY3JvbGxSYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBzY3JvbGxSYWYgPSAwOyByZWRyYXdOb29kbGVzKCk7IH0pO1xuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlZHJhd05vb2RsZXMpO1xuXG4gIC8vIOKUgOKUgOKUgCBQZXItbWVzc2FnZSByZW5kZXJlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHJlbmRlck1lc3NhZ2UgPSAobTogUGFuZWxNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSByZXR1cm4gcmVuZGVyUGFnZShtKTtcbiAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4gcmVuZGVyU2VsZWN0b3IobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIHJlbmRlckZlZWRiYWNrKG0sIGxhc3RTZWxlY3RvclNlbCk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBhZ2UgPSAobTogUGFnZU1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGQuY2xhc3NOYW1lID0gJ3BhZ2UtZGl2aWRlcic7XG4gICAgZC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBjb25zdCB0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0cy5jbGFzc05hbWUgPSAndGFiLXN0YXR1cyc7XG4gICAgdHMuZGF0YXNldC51cmwgPSBtLnVybDtcbiAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHRzLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICBkLmFwcGVuZCh0cyk7XG4gICAgY29uc3QgdSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB1LmNsYXNzTmFtZSA9ICd1cmwnO1xuICAgIHUudGV4dENvbnRlbnQgPSBtLnVybDtcbiAgICB1LmRhdGFzZXQudGlwID0gYCR7bS50aXRsZSA/PyAnJ30gwrcgJHttLnVybH1gO1xuICAgIGQuYXBwZW5kKHUpO1xuICAgIGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IG9uIHRoaXMgcGFnZSBpbiB0aGUgYWN0aXZlIHRhYiwgY2xpY2tpbmcgdGhlIFVSTFxuICAgICAgLy8gc2hvdWxkbid0IHJlbG9hZCBvciBzdGVhbCBmb2N1cyDigJQgaXQgc2hvdWxkIGp1c3QgYmUgYSBuby1vcFxuICAgICAgLy8gdmlzdWFsbHkgKHRoZSByb3cgYWxyZWFkeSBpbmRpY2F0ZXMgXCJvcGVuXCIgdmlhIC50YWItc3RhdHVzKS4gVGhlXG4gICAgICAvLyB1c2VyIGNvbXBsYWluZWQgYWJvdXQgZ2V0dGluZyBmb3JjZWQgaW50byBhIG5hdmlnYXRpb24gd2hlbiB0aGV5XG4gICAgICAvLyB3ZXJlIGp1c3QgdHJ5aW5nIHRvIHJlYWQgdGhlIHJvdy5cbiAgICAgIGlmIChtLnVybCA9PT0gbGl2ZVRhYlVybCkge1xuICAgICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgb24gdGhpcyBwYWdlJywge2tpbmQ6ICdpbmZvJ30pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByID0gYXdhaXQgc2VuZFRvQmc8e2ZvdW5kPzogYm9vbGVhbjsgb3BlbmVkPzogbnVtYmVyOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAnc3dpdGNoLXRvLXRhYicsIHVybDogbS51cmwsIG9wZW5JZk1pc3Npbmc6IHRydWV9KTtcbiAgICAgIGlmIChyPy5mb3VuZCkgc2V0U3RhdHVzKCdTd2l0Y2hlZCB0byB0YWInKTtcbiAgICAgIGVsc2UgaWYgKHI/Lm9wZW5lZCkgc2V0U3RhdHVzKCdPcGVuZWQgaW4gbmV3IHRhYicpO1xuICAgICAgZWxzZSBzZXRTdGF0dXMoXCJDb3VsZG4ndCBvcGVuIHRhYlwiLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGQ7XG4gIH07XG5cbiAgY29uc3QgdGl0bGVGcm9tRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChlLnRlc3RJZCkgcmV0dXJuIGBbdGVzdElkPSR7ZS50ZXN0SWR9XWA7XG4gICAgaWYgKGUuaWQpIHJldHVybiBgIyR7ZS5pZH1gO1xuICAgIGlmIChlLmNsYXNzZXM/Lmxlbmd0aCkgcmV0dXJuIGAke2UudGFnfS4ke2UuY2xhc3Nlcy5zbGljZSgwLCAyKS5qb2luKCcuJyl9YDtcbiAgICByZXR1cm4gZS5zZWxlY3RvciB8fCBlLnRhZyB8fCAnKHVua25vd24pJztcbiAgfTtcblxuICAvLyBQaWNrIHRoZSBtb3N0IFwiaHVtYW5seSByZWFkYWJsZVwiIGxhYmVsIGZvciB0aGUgYnViYmxlIHByZXZpZXcuIFByZWZlcnNcbiAgLy8gdmlzaWJsZS10by11c2VyIHRleHQgaW4gdGhpcyBwcmlvcml0eTpcbiAgLy8gICAxLiBpbm5lclRleHQgLyB0ZXh0Q29udGVudCAoYGVudHJ5LnRleHRgKSDigJQgd2hhdCB0aGUgdXNlciByZWFkcyBvbiBzY3JlZW5cbiAgLy8gICAyLiBhY2Nlc3NpYmxlTmFtZSAoYXJpYS1sYWJlbCAvIHRpdGxlIC8gYWx0IGZhbGxiYWNrIGNoYWluKVxuICAvLyAgIDMuIGlucHV0IHZhbHVlIChza2lwcGVkIGlmIGl0J3MgdGhlIG1hc2tlZCBwYXNzd29yZCBwbGFjZWhvbGRlcilcbiAgLy8gICA0LiBpbnB1dCBwbGFjZWhvbGRlclxuICAvLyAgIDUuIGltZyBhbHRcbiAgLy8gICA2LiBjb21wb25lbnRSb290IChlLmcuIFwiYnV0dG9uI2N0YVwiKVxuICAvLyAgIDcuIHRpdGxlRnJvbUVudHJ5IOKAlCBsYXN0LXJlc29ydCB0YWcvY2xhc3MvaWQgZmFsbGJhY2tcbiAgLy8gQ1NTIGhhbmRsZXMgdmlzdWFsIHRydW5jYXRpb24gdmlhIHRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7IHdlIHNoaXAgdGhlXG4gIC8vIGZ1bGwgc3RyaW5nIHNvIHRoZSB0b29sdGlwIG9uIGhvdmVyIGNhbiBzaG93IHRoZSBjb21wbGV0ZSB2YWx1ZS5cbiAgY29uc3QgbmljZUxhYmVsID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXh0KSByZXR1cm4gZS50ZXh0O1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lKSByZXR1cm4gZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBjb25zdCB2ID0gZS5hdHRycz8udmFsdWU7XG4gICAgaWYgKHYgJiYgdiAhPT0gJ+KAouKAouKAouKAoicpIHJldHVybiB2O1xuICAgIGlmIChlLmF0dHJzPy5wbGFjZWhvbGRlcikgcmV0dXJuIGUuYXR0cnMucGxhY2Vob2xkZXI7XG4gICAgaWYgKGUuYXR0cnM/LmFsdCkgcmV0dXJuIGUuYXR0cnMuYWx0O1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QpIHJldHVybiBlLmNvbXBvbmVudFJvb3Q7XG4gICAgcmV0dXJuIHRpdGxlRnJvbUVudHJ5KGUpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclNlbGVjdG9yID0gKG06IFNlbGVjdG9yTWVzc2FnZSk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCB2YWxpZCA9IHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHNhbWVQYXRoID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKSA9PT0gbGl2ZVRhYlBhdGg7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgc2VsZWN0b3InO1xuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdzdGFsZScpO1xuICAgIGVsc2UgaWYgKHZhbGlkID09PSBmYWxzZSAmJiAhc2FtZVBhdGgpIGRpdi5jbGFzc0xpc3QuYWRkKCdkaWZmLXBhZ2UnKTtcbiAgICBpZiAobS5waW5uZWQpIGRpdi5jbGFzc0xpc3QuYWRkKCdwaW5uZWQnKTtcbiAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBkaXYuY2xhc3NMaXN0LmFkZCgnaGFzLWdyb3VwJyk7XG4gICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgPT09IGxhc3RBY3RpdmVTZWxlY3RvcikgZGl2LmNsYXNzTGlzdC5hZGQoJ2xhc3QtYWN0aXZlJyk7XG4gICAgLy8gQXV0by1leHBhbmQgb24gc2VhcmNoIGhpdCBzbyB0aGUgdXNlciBzZWVzIHdoZXJlIHRoZSBtYXRjaCBsYW5kZWQuXG4gICAgY29uc3QgbWF0Y2hlZEJvZHkgPSBib2R5TWF0Y2hlc1NlYXJjaChtKTtcbiAgICBpZiAobWF0Y2hlZEJvZHkpIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcsICdzZWFyY2gtaGl0Jyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5kYXRhc2V0LnNlbGVjdG9yID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAvLyBEcmFnLXRvLXJlcGFyZW50OiBldmVyeSBzZWxlY3RvciBidWJibGUgaXMgYSB2YWxpZCBkcm9wIHRhcmdldCBmb3JcbiAgICAvLyBhIGNvbW1lbnQgYmVpbmcgZHJhZ2dlZCBmcm9tIGVsc2V3aGVyZSBpbiB0aGUgc2lkZWJhci5cbiAgICB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0KGRpdiwgbSk7XG5cbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnaGVhZCc7XG4gICAgY29uc3QgY2FyZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY2FyZXQuY2xhc3NOYW1lID0gJ2NhcmV0JztcbiAgICBjYXJldC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZXZyb24tcmlnaHQnLCAxMik7XG4gICAgaGVhZC5hcHBlbmQoY2FyZXQpO1xuICAgIGNvbnN0IHBpbk1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBwaW5NYXJrZXIuY2xhc3NOYW1lID0gJ3Bpbi1tYXJrZXInO1xuICAgIHBpbk1hcmtlci5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3N0YXItZmlsbGVkJywgMTEpO1xuICAgIGhlYWQuYXBwZW5kKHBpbk1hcmtlcik7XG4gICAgY29uc3Qgc2VxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7bS5lbnRyeS5ufWA7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgc2VxLnRleHRDb250ZW50ICs9IGArJHttLmVudHJ5Lmdyb3VwLmxlbmd0aH1gO1xuICAgIGhlYWQuYXBwZW5kKHNlcSk7XG4gICAgY29uc3QgY29tcGFjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb21wYWN0LmNsYXNzTmFtZSA9ICdjb21wYWN0JztcbiAgICBjb25zdCBjb21wYWN0U3RyID0gbmljZUxhYmVsKG0uZW50cnkpO1xuICAgIGNvbXBhY3QuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2goY29tcGFjdFN0ciwgc2VhcmNoUXVlcnkpO1xuICAgIC8vIFNob3cgdGhlIGZ1bGwgbGFiZWwgb24gaG92ZXIgZXZlbiB3aGVuIENTUyBlbGxpcHNpcyB0cnVuY2F0ZXMgdGhlXG4gICAgLy8gdmlzaWJsZSBwb3J0aW9uIOKAlCB1c2VmdWwgd2hlbiB0aGUgdmlzaWJsZSB0ZXh0L3BsYWNlaG9sZGVyIGlzIGxvbmcuXG4gICAgaWYgKGNvbXBhY3RTdHIubGVuZ3RoID4gMjQpIGNvbXBhY3QuZGF0YXNldC50aXAgPSBjb21wYWN0U3RyO1xuICAgIGhlYWQuYXBwZW5kKGNvbXBhY3QpO1xuICAgIGNvbnN0IG1ldGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWV0YS5jbGFzc05hbWUgPSAnbWV0YSc7XG4gICAgY29uc3QgciA9IG0uZW50cnkucmVjdDtcbiAgICBtZXRhLnRleHRDb250ZW50ID0gciA/IGAke3Iud33DlyR7ci5ofWAgOiAobS5lbnRyeS50YWcgPz8gJycpO1xuICAgIGhlYWQuYXBwZW5kKG1ldGEpO1xuICAgIGRpdi5hcHBlbmQoaGVhZCk7XG5cbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHN1bW1hcnkuY2xhc3NOYW1lID0gJ3BlZWstc3VtbWFyeSc7XG4gICAgc3VtbWFyeS5pbm5lckhUTUwgPSBgPHNwYW4gZGF0YS1pY29uPVwiYWxlcnQtY2lyY2xlXCIgZGF0YS1zaXplPVwiMTFcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInRcIj4ke2Rpdi5jbGFzc0xpc3QuY29udGFpbnMoJ2RpZmYtcGFnZScpID8gJ2RpZmZlcmVudCBwYWdlJyA6ICdzdGFsZSd9PC9zcGFuPmA7XG4gICAgaGVhZC5hcHBlbmQoc3VtbWFyeSk7XG4gICAgbW91bnRJY29ucyhzdW1tYXJ5KTtcblxuICAgIGNvbnN0IGVyciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVyci5jbGFzc05hbWUgPSAncGVlay1lcnJvcic7XG4gICAgY29uc3QgcmVhc29uID0gc2VsZWN0b3JFcnJvcnMuZ2V0KG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIGNvbnN0IHBhdGhGcm9tRW50cnkgPSBwYXRoT2YobS5lbnRyeS51cmwgPz8gJycpO1xuICAgIGVyci5pbm5lckhUTUwgPSBzYW1lUGF0aFxuICAgICAgPyBgPGI+U3RhbGU8L2I+IMK3ICR7ZXNjYXBlSHRtbChyZWFzb24gPz8gJ25vIGVsZW1lbnQgb24gdGhlIGxpdmUgcGFnZSBtYXRjaGVzLicpfTxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmBcbiAgICAgIDogYENhcHR1cmVkIG9uIDxjb2RlPiR7ZXNjYXBlSHRtbChwYXRoRnJvbUVudHJ5KX08L2NvZGU+IOKAlCBjdXJyZW50IHRhYiBpcyA8Y29kZT4ke2VzY2FwZUh0bWwobGl2ZVRhYlBhdGggPz8gJycpfTwvY29kZT4uIFN3aXRjaCB0YWJzIHRvIHZhbGlkYXRlLjxicj48Y29kZT4ke2VzY2FwZUh0bWwobS5lbnRyeS5zZWxlY3Rvcil9PC9jb2RlPmA7XG4gICAgZGl2LmFwcGVuZChlcnIpO1xuXG4gICAgLy8gQW5jZXN0b3IgYnJlYWRjcnVtYiDigJQgUGxhc21pYy1zdHlsZSBlc2NhbGF0b3IuIENoaXBzIGZvciBlYWNoIGVudHJ5IGluXG4gICAgLy8gZW50cnkuYW5jZXN0b3JzIChjbG9zZXN0IGZpcnN0KS4gQ2xpY2sgYSBjaGlwIHRvIGNhcHR1cmUgdGhhdFxuICAgIC8vIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2UgKGRlcHRoID0gY2hpcCBpbmRleCArIDEgc2luY2UgdGhlIGVudHJ5J3NcbiAgICAvLyBvd24gc2VsZWN0b3IgaXMgZGVwdGggMCkuIEJyaWdodG5lc3MgZ3JhZGllbnQgZGFya2VucyBkZWVwZXIgY2hpcHMuXG4gICAgaWYgKG0uZW50cnkuYW5jZXN0b3JzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNydW1icyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY3J1bWJzLmNsYXNzTmFtZSA9ICdhbmNlc3Rvci1jcnVtYnMnO1xuICAgICAgY3J1bWJzLmRhdGFzZXQudGlwID0gJ0NsaWNrIGEgY3J1bWIgdG8gZXNjYWxhdGUgdGhlIGNhcHR1cmUgdG8gYW4gYW5jZXN0b3IgZWxlbWVudCc7XG4gICAgICBtLmVudHJ5LmFuY2VzdG9ycy5mb3JFYWNoKChhbmMsIGkpID0+IHtcbiAgICAgICAgY29uc3QgY2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBjaGlwLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgY2hpcC5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY2hpcCc7XG4gICAgICAgIC8vIEJyaWdodG5lc3MgZ3JhZGllbnQ6IGRlZXBlciBjaGlwcyBnZXQgcHJvZ3Jlc3NpdmVseSBkaW1tZXIuXG4gICAgICAgIGNoaXAuc3R5bGUuZmlsdGVyID0gYGJyaWdodG5lc3MoJHsoMSAtIGkgKiAwLjA4KS50b0ZpeGVkKDIpfSlgO1xuICAgICAgICBjb25zdCBsYWJlbCA9IGFuYy50ZXN0SWQgPyBgWyR7YW5jLnRlc3RJZH1dYFxuICAgICAgICAgIDogYW5jLmlkID8gYCMke2FuYy5pZH1gXG4gICAgICAgICAgOiBhbmMuY2xhc3Nlcz8ubGVuZ3RoID8gYCR7YW5jLnRhZ30uJHthbmMuY2xhc3Nlc1swXX1gXG4gICAgICAgICAgOiBhbmMudGFnO1xuICAgICAgICBjaGlwLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNoaXAuZGF0YXNldC50aXAgPSBgQ2FwdHVyZSB0aGUgYW5jZXN0b3IgJHtpICsgMX0gbGV2ZWwke2kgPyAncycgOiAnJ30gdXAgwrcgJHthbmMudGFnfSR7YW5jLmlkID8gJyMnICsgYW5jLmlkIDogJyd9YDtcbiAgICAgICAgLy8gSG92ZXItcHJldmlldyB0aGUgYW5jZXN0b3Igb24gdGhlIGxpdmUgcGFnZSBzbyB0aGUgdXNlciBjYW4gc2VlXG4gICAgICAgIC8vIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY29tbWl0dGluZy4gTWlycm9ycyBob3dcbiAgICAgICAgLy8gaG92ZXJpbmcgYSBzZWxlY3RvciBidWJibGUgcGFpbnRzIGl0cyByaW5nLiBDbGVhcmluZyBvblxuICAgICAgICAvLyBtb3VzZWxlYXZlIHN3YXBzIGJhY2sgdG8gdGhlIGJ1YmJsZSdzIG93biBvdXRsaW5lICh0aGUgYnViYmxlJ3NcbiAgICAgICAgLy8gbW91c2VlbnRlciBoYW5kbGVyIHBhaW50ZWQgaXQ7IGxlYXZpbmcgdGhlIGNoaXAganVzdCByZW1vdmVzXG4gICAgICAgIC8vIHRoZSBvdmVycmlkZSkuXG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDF9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAvLyBSZS1wYWludCB0aGUgYnViYmxlJ3Mgb3duIHJpbmcgcmF0aGVyIHRoYW4gY2xlYXJpbmcgZW50aXJlbHlcbiAgICAgICAgICAvLyBzbyB0aGUgdXNlciBkb2Vzbid0IHNlZSBhIGZsaWNrZXIgb2YgXCJub3RoaW5nXCIgYmV0d2VlbiBjaGlwcy5cbiAgICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtcbiAgICAgICAgICAgIGtpbmQ6ICdjYXB0dXJlLWFuY2VzdG9yJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGRlcHRoOiBpICsgMSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAocmVwbHk/Lm9rKSBzZXRTdGF0dXMoYENhcHR1cmVkIGFuY2VzdG9yICR7YW5jLnRhZ31gKTtcbiAgICAgICAgICBlbHNlIHNldFN0YXR1cygnQ291bGQgbm90IGNhcHR1cmUgYW5jZXN0b3InLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjcnVtYnMuYXBwZW5kKGNoaXApO1xuICAgICAgfSk7XG4gICAgICBkaXYuYXBwZW5kKGNydW1icyk7XG4gICAgfVxuXG4gICAgLy8gUHJldmlldyB0aWxlLiBUaGUgZnVsbCBQTkcgbGl2ZXMgb24gZGlzayB1bmRlclxuICAgIC8vIC5waW5jaGdyYWIvPHdzPi9zY3JlZW5zaG90cy87IHRoZSBkYXRhVXJsIGlzIGEgc2lkZS1wYW5lbC1mcmllbmRseVxuICAgIC8vIGRvd25zY2FsZSAo4omkMzIwcHggd2lkZSkuIFRvIHN0b3AgdGhlIGxheW91dCBmcm9tIGp1bXBpbmcgd2hlbiBhIHNob3RcbiAgICAvLyBhcnJpdmVzIGEgc2Vjb25kIGFmdGVyIGNhcHR1cmUsIHdlIFJFU0VSVkUgdGhlIGZpbmFsIGltYWdlIGhlaWdodCB1cFxuICAgIC8vIGZyb250IHVzaW5nIHRoZSBjYXB0dXJlZCBlbGVtZW50J3Mga25vd24gYXNwZWN0IHJhdGlvIGFuZCBwYWludCBhXG4gICAgLy8gc2tlbGV0b24gbG9hZGVyIGluIHRoYXQgc3BhY2UsIHRoZW4gc3dhcCB0aGUgc2NyZWVuc2hvdCBpbiB3aXRoIG5vXG4gICAgLy8gcmVmbG93LiBUaGUgcmVzZXJ2YXRpb24gb25seSBoYXBwZW5zIHdoZW4gYSBzaG90IGlzIGFjdHVhbGx5IGV4cGVjdGVkXG4gICAgLy8gKGF1dG9TY3JlZW5zaG90IG9uLCBob3N0IG5vdCBza2lwcGVkLCBubyByZWNvcmRlZCBmYWlsdXJlKSBzbyBjYXB0dXJlc1xuICAgIC8vIHRoYXQgd2lsbCBuZXZlciBnZXQgYSBzaG90IGRvbid0IGNhcnJ5IGFuIGVtcHR5IGJveC5cbiAgICBjb25zdCBzaG90RGF0YVVybCA9IHNob3RzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzaG90RXhwZWN0ZWQgPSBwcmVmcy5hdXRvU2NyZWVuc2hvdFxuICAgICAgJiYgIXNob3VsZFNraXBTY3JlZW5zaG90KG0uZW50cnkudXJsID8/ICcnKVxuICAgICAgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgaWYgKHNob3REYXRhVXJsIHx8IHNob3RFeHBlY3RlZCkge1xuICAgICAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJldmlldy5jbGFzc05hbWUgPSAncHJldmlldyc7XG4gICAgICAvLyBSZXNlcnZlIHZlcnRpY2FsIHNwYWNlIGltbWVkaWF0ZWx5IGZyb20gdGhlIGVsZW1lbnQncyB3aWR0aC9oZWlnaHQuXG4gICAgICAvLyBUaGUgdGh1bWJuYWlsIGlzIHJlbmRlcmVkIGF0IHRoZSBidWJibGUncyBjb250ZW50IHdpZHRoLCBzbyB0aGUgYm94XG4gICAgICAvLyBoZWlnaHQgdHJhY2tzIHRoZSBlbGVtZW50J3MgYXNwZWN0IHJhdGlvLiBDbGFtcCBzbyBhIHZlcnkgdGFsbFxuICAgICAgLy8gZWxlbWVudCBkb2Vzbid0IHJlc2VydmUgYW4gYWJzdXJkIGFtb3VudCBvZiBzcGFjZS5cbiAgICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgICBpZiAociAmJiByLncgPiAwICYmIHIuaCA+IDApIHtcbiAgICAgICAgY29uc3QgcmF0aW8gPSBNYXRoLm1pbihNYXRoLm1heChyLmggLyByLncsIDAuMTIpLCAyLjIpO1xuICAgICAgICBwcmV2aWV3LnN0eWxlLnNldFByb3BlcnR5KCctLXNob3QtcmF0aW8nLCBTdHJpbmcocmF0aW8pKTtcbiAgICAgICAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdyZXNlcnZlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKHNob3REYXRhVXJsKSB7XG4gICAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWcuY2xhc3NOYW1lID0gJ3Nob3QnO1xuICAgICAgICBpbWcuYWx0ID0gYFNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWA7XG4gICAgICAgIC8vIFJldmVhbCBvbmx5IG9uY2UgZGVjb2RlZCBzbyB0aGUgc3dhcCBpcyBpbnN0YW50IGFuZCByZWZsb3ctZnJlZTtcbiAgICAgICAgLy8gdGhlIHNrZWxldG9uIHN0YXlzIHZpc2libGUgdW5kZXJuZWF0aCB1bnRpbCB0aGVuLlxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJykpO1xuICAgICAgICBpbWcuc3JjID0gc2hvdERhdGFVcmw7XG4gICAgICAgIGlmIChpbWcuY29tcGxldGUpIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XG4gICAgICAgIHByZXZpZXcuYXBwZW5kKGltZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBzaG90IHlldCDigJQgc2hvdyBhIHNrZWxldG9uIHNoaW1tZXIgb2NjdXB5aW5nIHRoZSByZXNlcnZlZCBzcGFjZS5cbiAgICAgICAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJyk7XG4gICAgICAgIGNvbnN0IHNrZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2tlbC5jbGFzc05hbWUgPSAnc2hvdC1za2VsZXRvbic7XG4gICAgICAgIHNrZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYExvYWRpbmcgc2NyZWVuc2hvdCBvZiAjJHttLmVudHJ5Lm59YCk7XG4gICAgICAgIHByZXZpZXcuYXBwZW5kKHNrZWwpO1xuICAgICAgfVxuICAgICAgZGl2LmFwcGVuZChwcmV2aWV3KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0YXRzLmNsYXNzTmFtZSA9ICdlbnQtc3RhdHMnO1xuICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgY29uc3QgbXlUb2tlbnMgPSB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG0uZW50cnkpKTtcbiAgICBjb25zdCB0b3RhbFRva2VucyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtbSk6IG1tIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnJlZHVjZSgocywgbW0pID0+IHMgKyB0b2tlbkNvdW50KEpTT04uc3RyaW5naWZ5KG1tLmVudHJ5KSksIDApO1xuICAgIGNvbnN0IHNoYXJlUGN0ID0gdG90YWxUb2tlbnMgPiAwID8gTWF0aC5yb3VuZCgobXlUb2tlbnMgLyB0b3RhbFRva2VucykgKiAxMDApIDogMDtcbiAgICBjb25zdCBncm91cENvdW50ID0gbS5lbnRyeS5ncm91cD8ubGVuZ3RoID8/IDA7XG4gICAgY29uc3QgZ3JvdXBUb2tlbnMgPSAobS5lbnRyeS5ncm91cCA/PyBbXSkucmVkdWNlKChzLCBnKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShnKSksIDApO1xuICAgIHR5cGUgU3RhdENlbGwgPSB7bGFiZWw6IHN0cmluZzsgdmFsdWU6IHN0cmluZzsgdGlwOiBzdHJpbmd9O1xuICAgIGNvbnN0IGNlbGxzOiBTdGF0Q2VsbFtdID0gW1xuICAgICAge2xhYmVsOiAnSFRNTCcsIHZhbHVlOiBgJHttLmVudHJ5Lm91dGVySFRNTD8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnT3V0ZXIgSFRNTCBjaGFyIGxlbmd0aCd9LFxuICAgICAge2xhYmVsOiAnVG9rZW5zJywgdmFsdWU6IGAke215VG9rZW5zfWAsIHRpcDogJ0FwcHJveCBMTE0gdG9rZW5zIGZvciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdTaGFyZScsIHZhbHVlOiBgJHtzaGFyZVBjdH0lYCwgdGlwOiAnVG9rZW4gc2hhcmUgb2YgYWxsIHNlbGVjdG9ycyd9LFxuICAgICAge2xhYmVsOiAnQ29tbWVudHMnLCB2YWx1ZTogYCR7ZmIubGVuZ3RofWAsIHRpcDogJ0lubGluZSBjb21tZW50cyB0aHJlYWRlZCB1bmRlciB0aGlzIGVudHJ5J30sXG4gICAgICB7bGFiZWw6ICdSdWxlcycsIHZhbHVlOiBgJHttLmVudHJ5Lm1hdGNoZWRSdWxlcz8ubGVuZ3RoID8/IDB9YCwgdGlwOiAnTWF0Y2hlZCBDU1MgcnVsZXMnfSxcbiAgICAgIHtsYWJlbDogJ1N0eWxlcycsIHZhbHVlOiBgJHtPYmplY3Qua2V5cyhtLmVudHJ5LnN0eWxlcyA/PyB7fSkubGVuZ3RofWAsIHRpcDogJ0NvbXB1dGVkLXN0eWxlIGZpZWxkcyBrZXB0J30sXG4gICAgXTtcbiAgICBpZiAoZ3JvdXBDb3VudCkge1xuICAgICAgY2VsbHMucHVzaCh7bGFiZWw6ICdHcm91cCcsIHZhbHVlOiBgJHtncm91cENvdW50fWAsIHRpcDogJ01lbWJlcnMgZm9sZGVkIGludG8gdGhpcyBncm91cCd9KTtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAgVCcsIHZhbHVlOiBgJHtncm91cFRva2Vuc31gLCB0aXA6ICdUb2tlbnMgY29udHJpYnV0ZWQgYnkgZ3JvdXAgbWVtYmVycyd9KTtcbiAgICB9XG4gICAgc3RhdHMuaW5uZXJIVE1MID0gY2VsbHMubWFwKChjKSA9PlxuICAgICAgYDxzcGFuIGNsYXNzPVwiZW50LXN0YXRcIiBkYXRhLXRpcD1cIiR7ZXNjYXBlSHRtbChjLnRpcCl9XCI+PHNwYW4gY2xhc3M9XCJsYmxcIj4ke2MubGFiZWx9PC9zcGFuPjxzcGFuIGNsYXNzPVwidmFsXCI+JHtjLnZhbHVlfTwvc3Bhbj48L3NwYW4+YCxcbiAgICApLmpvaW4oJycpO1xuICAgIGRpdi5hcHBlbmQoc3RhdHMpO1xuXG4gICAgLy8g4pSA4pSAIEpTT04gcGFuZSB3aXRoIHRvb2xiYXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy8gVG9vbGJhciBhYm92ZSB0aGUgSlNPTiBib2R5OiBsZWZ0ID0gbGluZS13cmFwIHRvZ2dsZSwgcmlnaHQgPSBjb3B5LlxuICAgIC8vIFRoZSBKU09OIGl0c2VsZiByZWZsZWN0cyB0aGUgZ2xvYmFsIGBtaW5pZnlgIHNldHRpbmcgc28gdGhlIHVzZXIgc2Vlc1xuICAgIC8vIHRoZSBzYW1lIHNoYXBlIHRoYXQgd2lsbCBlbmQgdXAgaW4gdGhlIGV4cG9ydC5cbiAgICBjb25zdCBqc29uV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25XcmFwLmNsYXNzTmFtZSA9ICdib2R5LWpzb24td3JhcCc7XG4gICAgY29uc3QganNvbkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGpzb25CYXIuY2xhc3NOYW1lID0gJ2JvZHktanNvbi1iYXInO1xuXG4gICAgLy8gTGluZS13cmFwIGNoZWNrYm94IChwZXItYnViYmxlIGxvY2FsIHN0YXRlLCBkZWZhdWx0IE9OKS4gV2hlbiBPTiB0aGVcbiAgICAvLyBKU09OIGlzIGZsYXR0ZW5lZCB0byBPTkUgbWluaWZpZWQgbGluZSB0aGF0IHNvZnQtd3JhcHMgdG8gdGhlIGJ1YmJsZVxuICAgIC8vIHdpZHRoIChubyBob3Jpem9udGFsIHNjcm9sbCk7IHdoZW4gT0ZGIGl0IGZhbGxzIGJhY2sgdG8gdGhlIGdsb2JhbFxuICAgIC8vIG1pbmlmeS1yZXNwZWN0aW5nIHByZXR0eS9jb21wYWN0IGZvcm0gd2l0aCBob3Jpem9udGFsIHNjcm9sbC5cbiAgICBjb25zdCB3cmFwTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHdyYXBMYWJlbC5jbGFzc05hbWUgPSAnanNvbi13cmFwLXRvZ2dsZSc7XG4gICAgd3JhcExhYmVsLmRhdGFzZXQudGlwID0gJ0ZsYXR0ZW4gdG8gYSBzaW5nbGUgc29mdC13cmFwcGluZyBsaW5lIGluc3RlYWQgb2YgaG9yaXpvbnRhbCBzY3JvbGwnO1xuICAgIGNvbnN0IHdyYXBDaGVjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgd3JhcENoZWNrLnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIHdyYXBDaGVjay5jaGVja2VkID0gdHJ1ZTtcbiAgICB3cmFwTGFiZWwuYXBwZW5kKHdyYXBDaGVjaywgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBXcmFwJykpO1xuICAgIGpzb25CYXIuYXBwZW5kKHdyYXBMYWJlbCk7XG5cbiAgICAvLyBDb3B5IGJ1dHRvbiAobWlycm9ycyB0aGUgXCJDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OXCIgYWN0aW9uIGJlbG93LFxuICAgIC8vIHN1cmZhY2VkIGF0IHRoZSB0b3Agc28gdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIHNjcm9sbCBwYXN0IHRoZSBKU09OXG4gICAgLy8gdG8gZmluZCBpdCkuXG4gICAgY29uc3QgY29weUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvcHlCdG4udHlwZSA9ICdidXR0b24nO1xuICAgIGNvcHlCdG4uY2xhc3NOYW1lID0gJ2ljb25idG4ganNvbi1jb3B5JztcbiAgICBjb3B5QnRuLmRhdGFzZXQudGlwID0gJ0NvcHkgdGhpcyBjYXB0dXJlIGFzIEpTT04nO1xuICAgIGNvcHlCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NvcHkgY2FwdHVyZSBhcyBKU09OJyk7XG4gICAgY29weUJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NvcHknLCAxMyk7XG4gICAgY29weUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgLy8gRnVsbCBzaW5nbGUtY2FwdHVyZSBleHBvcnQ6IGlkZW50aXR5ICsgcGF0aHMgKyB0ZXh0L2NvbnRlbnQgKyBldmVyeVxuICAgICAgLy8gYXR0YWNoZWQgbm90ZS9jb21tZW50IOKAlCB0aGUgc2FtZSBkZXB0aCBhcyBhIGZ1bGwgZXhwb3J0LCBzY29wZWQgdG9cbiAgICAgIC8vIHRoaXMgb25lIGNhcHR1cmUgKGl0ZW0gNykuIERpc3RpbmN0IGZyb20gdGhlIHJhdyBlbnRyeSBzaG93biBiZWxvdy5cbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KTtcbiAgICBqc29uQmFyLmFwcGVuZChjb3B5QnRuKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoanNvbkJhcik7XG5cbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9keS5jbGFzc05hbWUgPSAnYm9keS1qc29uIHdyYXAtb24nO1xuICAgIC8vIFJlbmRlciB0aGUgSlNPTiB0byBtYXRjaCB0aGUgd3JhcCBzdGF0ZTpcbiAgICAvLyAgIHdyYXAgT04gIOKGkiBhIHNpbmdsZSBtaW5pZmllZCBsaW5lIChpbmRlbnQgMCkgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZVxuICAgIC8vICAgICAgICAgICAgICBidWJibGUgd2lkdGggKENTUyBoYW5kbGVzIHRoZSB2aXN1YWwgd3JhcHBpbmcgdmlhXG4gICAgLy8gICAgICAgICAgICAgIG92ZXJmbG93LXdyYXA6YW55d2hlcmUpLCBzbyB0aGUgd2hvbGUgb2JqZWN0IGlzIG9uZVxuICAgIC8vICAgICAgICAgICAgICBjb250aW51b3VzIHN0cmluZyB3aXRoIG5vIGhvcml6b250YWwgc2Nyb2xsLlxuICAgIC8vICAgd3JhcCBPRkYg4oaSIHRoZSBnbG9iYWwgbWluaWZ5LXJlc3BlY3RpbmcgZm9ybTogcHJldHR5LXByaW50ZWQgZnVsbFxuICAgIC8vICAgICAgICAgICAgICBlbnRyeSwgb3IgdGhlIHNsaW1FbnRyeSBjb21wYWN0IGZvcm0gd2hlbiBtaW5pZnkgaXMgb24sXG4gICAgLy8gICAgICAgICAgICAgIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwgZm9yIGxvbmcgbGluZXMuXG4gICAgY29uc3QgcmVuZGVySnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGJvZHkudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwQ2hlY2suY2hlY2tlZDtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSAod3JhcHBlZCB8fCBwcmVmcy5taW5pZnkpID8gc2xpbUVudHJ5KG0uZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWV9KSA6IG0uZW50cnk7XG4gICAgICBjb25zdCBpbmRlbnQgPSAod3JhcHBlZCB8fCBwcmVmcy5taW5pZnkpID8gMCA6IDI7XG4gICAgICBjb25zdCB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgaW5kZW50KTtcbiAgICAgIGFwcGVuZEpzb25IaWdobGlnaHQoYm9keSwgdGV4dCk7XG4gICAgICBpZiAoc2VhcmNoUXVlcnkpIHdyYXBTZWFyY2hIaXRzSW5UZXh0Tm9kZXMoYm9keSwgc2VhcmNoUXVlcnkpO1xuICAgIH07XG4gICAgcmVuZGVySnNvbigpO1xuICAgIHdyYXBDaGVjay5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb24nLCB3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3dyYXAtb2ZmJywgIXdyYXBDaGVjay5jaGVja2VkKTtcbiAgICAgIHJlbmRlckpzb24oKTtcbiAgICB9KTtcbiAgICAvLyBTdG9wIHRoZSBjbGljayBvbiB0aGUgdG9vbGJhciBmcm9tIGNvbGxhcHNpbmcgdGhlIGJ1YmJsZSDigJQgdGhlIGhlYWQnc1xuICAgIC8vIGNsaWNrIGhhbmRsZXIgdG9nZ2xlcyBgLmV4cGFuZGVkYCBvbiBjbGljaywgYW5kIHRoZSBiYXIgbGl2ZXMgaW5zaWRlXG4gICAgLy8gdGhlIGJ1YmJsZS5cbiAgICBqc29uQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGpzb25XcmFwLmFwcGVuZChib2R5KTtcbiAgICBkaXYuYXBwZW5kKGpzb25XcmFwKTtcblxuICAgIGhlYWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwYW5kZWQnKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXdOb29kbGVzKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIGdvbGQ6IHRydWV9KTtcbiAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ30pO1xuICAgICAgaWYgKGxhc3RBY3RpdmVTZWxlY3Rvcikgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBsYXN0QWN0aXZlU2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFjdGlvbnMuY2xhc3NOYW1lID0gJ2FjdGlvbnMnO1xuICAgIC8vIE5vdGU6IE5PIGFjdGlvbnMtcm93IG1vdXNlZW50ZXIvbW91c2VsZWF2ZS4gVGhlIGJ1YmJsZSdzIG93blxuICAgIC8vIG1vdXNlZW50ZXIvbW91c2VsZWF2ZSBhbHJlYWR5IHBhaW50cyB0aGUgcGFnZS1zaWRlIG91dGxpbmUgd2hpbGVcbiAgICAvLyB0aGUgY3Vyc29yIGlzIGFueXdoZXJlIGluc2lkZSB0aGUgYnViYmxlIOKAlCBpbmNsdWRpbmcgb3ZlciBhY3Rpb25cbiAgICAvLyBidXR0b25zLiBBZGRpbmcgaGFuZGxlcnMgSEVSRSB1c2VkIHRvIGNsZWFyIHRoZSBvdXRsaW5lIHdoZW5ldmVyXG4gICAgLy8gdGhlIGN1cnNvciBtb3ZlZCBmcm9tIC5hY3Rpb25zIGJhY2sgdG8gdGhlIGJ1YmJsZSBib2R5IChiZWNhdXNlXG4gICAgLy8gLm1vdXNlbGVhdmUgZmlyZXMgb24gdGhlIHBhcmVudCBwYXRoIGV2ZW4gdGhvdWdoIC5tb3VzZWVudGVyIG9uXG4gICAgLy8gdGhlIGJ1YmJsZSBkb2Vzbid0IHJlZmlyZSksIHdoaWNoIHJlYWQgYXMgXCJ0aGUgaGlnaGxpZ2h0IGZsaWNrZXJzXG4gICAgLy8gb2ZmIG1pZC1ob3ZlclwiLlxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bihtLnBpbm5lZCA/ICdzdGFyLWZpbGxlZCcgOiAnc3RhcicsIG0ucGlubmVkID8gJ1VucGluIGZyb20gdG9wJyA6ICdQaW4gdG8gdG9wJywgKCkgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG0ucGlubmVkID0gIW0ucGlubmVkO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3RvZ2dsZWQ6IG0ucGlubmVkfSkpO1xuICAgIC8vIExvY2F0ZSBpcyBhIG9uZS1zaG90OiBzY3JvbGwgdGhlIHBhZ2UgdG8gdGhlIGVsZW1lbnQgYW5kIHJ1biB0aGVcbiAgICAvLyAzLXB1bHNlIGN5YW4gcmluZyBhbmltYXRpb24uIEl0IHVzZWQgdG8gc2hhcmUgYGxhc3RBY3RpdmVTZWxlY3RvcmBcbiAgICAvLyB3aXRoIHRoZSBob3Zlci1zdGlja3kgcGF0aCwgd2hpY2ggbWFkZSB0aGUgYnV0dG9uIGFwcGVhciB0b2dnbGVkXG4gICAgLy8gYW55IHRpbWUgdGhlIHVzZXIgbWVyZWx5IGhvdmVyZWQgdGhlIGJ1YmJsZS4gTm93IGl0IGhhcyBub1xuICAgIC8vIHBlcnNpc3RlbnQgc3RhdGUg4oCUIHByZXNzaW5nIGl0IGFsd2F5cyBwbGF5cyB0aGUgc2FtZSBmbGFzaC5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2Nyb3NzaGFpcicsICdMb2NhdGUgdGhpcyBlbGVtZW50IG9uIHRoZSBwYWdlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2xvY2F0ZS1mbGFzaCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICBzZXRTdGF0dXMoJ0xvY2F0aW5n4oCmJyk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbWVzc2FnZS1zcXVhcmUtcGx1cycsICdBZGQgYSBjb21tZW50IGFmdGVyIHRoaXMgY2FwdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGNvbnN0IGJlZm9yZUlkID0gaWR4ID49IDAgJiYgaWR4IDwgbWVzc2FnZXMubGVuZ3RoIC0gMSA/IG1lc3NhZ2VzW2lkeCArIDFdIS5pZCA6ICdfX2VuZF9fJztcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IHRydWU7XG4gICAgICByZW5kZXIoKTtcbiAgICB9LCB7c2l6ZTogMTV9KSk7XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIC8vIFNwbGl0LWdyb3VwIGFjdGlvbjogcHJvbW90ZSBlYWNoIGdyb3VwIG1lbWJlciBiYWNrIHRvIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzZWxlY3RvciBlbnRyeSwgdGhlbiBmaXJlIGEgZnJlc2ggZWxlbWVudCBzY3JlZW5zaG90XG4gICAgICAvLyBmb3IgZWFjaCBwcm9tb3RlZCBtZW1iZXIuIEdyb3VwIGNhcHR1cmVzIHNoYXJlIGEgc2luZ2xlIHVuaW9uLVxuICAgICAgLy8gYmJveCBzY3JlZW5zaG90IGtleWVkIG9uIHRoZSBoZWFkOyB0aGUgbWVtYmVycyBuZXZlciBnZXQgdGhlaXJcbiAgICAgIC8vIG93biBlbGVtZW50IHNob3RzIHVudGlsIHNwbGl0LiBBZnRlciB0aGlzLCBlYWNoIGNoaWxkIGhhcyBpdHNcbiAgICAgIC8vIG93biByaW5nICsgdGh1bWJuYWlsLlxuICAgICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdsaXN0LXRyZWUnLCBgU3BsaXQgdGhpcyBncm91cCBvZiAke2dyb3VwQ291bnR9IGludG8gaW5kaXZpZHVhbCBlbnRyaWVzYCwgKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICAgIGlmIChpZHggPCAwKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBtLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgICBkZWxldGUgbS5lbnRyeS5ncm91cDtcbiAgICAgICAgY29uc3QgZnJlc2g6IFNlbGVjdG9yTWVzc2FnZVtdID0gbWVtYmVycy5tYXAoKGVudHJ5KSA9PiAoe1xuICAgICAgICAgIHR5cGU6ICdzZWxlY3RvcicsIGlkOiBtc2dJZCgpLCB0czogZW50cnkudHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeSxcbiAgICAgICAgfSkpO1xuICAgICAgICBtZXNzYWdlcy5zcGxpY2UoaWR4ICsgMSwgMCwgLi4uZnJlc2gpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGdyb3VwIG9mICR7bWVtYmVycy5sZW5ndGh9IMK3IGNhcHR1cmluZyBzY3JlZW5zaG90c+KApmApO1xuICAgICAgICAvLyBGaXJlIHBlci1tZW1iZXIgZWxlbWVudCBzaG90cyDigJQgc2VxdWVudGlhbGx5IHNvIHRoZXkgZG9uJ3RcbiAgICAgICAgLy8gcmFjZSBjYXB0dXJlVmlzaWJsZVRhYi4gRmFpbHVyZXMgKHNlbGVjdG9yIG5vIGxvbmdlciBtYXRjaGVzLFxuICAgICAgICAvLyBob3N0IG9uIHNraXAtbGlzdCkgbGVhdmUgdGhlIG1lbWJlciB3aXRob3V0IGEgdGh1bWJuYWlsIGJ1dFxuICAgICAgICAvLyBkb24ndCBibG9jayB0aGUgb3RoZXJzLlxuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGNhcHR1cmVkID0gMDtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGZyZXNoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCBmaXJlRWxlbWVudFNob3QoY2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoY2hpbGQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgY2FwdHVyZWQrKztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKExPRywgJ3NwbGl0LWdyb3VwIHNob3QgZmFpbGVkIGZvcicsIGNoaWxkLmVudHJ5LnNlbGVjdG9yLCBlKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRTdGF0dXMoYFNwbGl0IGRvbmUgwrcgJHtjYXB0dXJlZH0vJHttZW1iZXJzLmxlbmd0aH0gc2NyZWVuc2hvdHNgKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdleHRlcm5hbC1saW5rJywgJ0xvZyB0aGUgZWxlbWVudCBhbmQgY29weSBhIGNvbnNvbGUgc25pcHBldCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtzbmlwcGV0Pzogc3RyaW5nfT4oe2tpbmQ6ICdsb2ctZWxlbWVudCcsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGNvbnN0IHNuaXBwZXQgPSByZXBseT8uc25pcHBldCA/PyBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignJHttLmVudHJ5LnNlbGVjdG9yfScpYDtcbiAgICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNuaXBwZXQpOyBzZXRTdGF0dXMoJ0xvZ2dlZCArIGNvcGllZCBjb25zb2xlIHNuaXBwZXQnKTsgc2hvd0NvcGllZCgnQ29waWVkIHNuaXBwZXQnKTsgfVxuICAgICAgY2F0Y2ggeyBzZXRTdGF0dXMoJ0xvZ2dlZCB0byBjb25zb2xlJyk7IH1cbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdyZWZyZXNoLWN3JywgJ1JlLWNhcHR1cmUgdGhpcyBlbGVtZW50IGZyb20gdGhlIGxpdmUgcGFnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbjsgZW50cnk/OiBFbnRyeX0+KHtraW5kOiAncmVjYXB0dXJlJywgc2VsZWN0b3I6IG0uZW50cnkuc2VsZWN0b3IsIG46IG0uZW50cnkubn0pO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5lbnRyeSkge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLmVudHJ5ID0gcmVwbHkuZW50cnk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cygnUmUtY2FwdHVyZWQnKTtcblxuICAgICAgfSBlbHNlIHNldFN0YXR1cygnUmUtY2FwdHVyZSBmYWlsZWQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBhIGZ1bGwgZXhwb3J0IChwYXRocywgdGV4dCwgY29tbWVudHMpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBtZXNzYWdlcy5mbGF0TWFwKCh4KSA9PiB4LnR5cGUgPT09ICdmZWVkYmFjaycgJiYgeC5wYXJlbnRVaWQgPT09IG0uZW50cnkudWlkXG4gICAgICAgID8gW3t0ZXh0OiB4LnRleHQsIHRzOiB4LnRzLCB1aWQ6IHguaWQsIHBhcmVudFVpZDogeC5wYXJlbnRVaWR9XSA6IFtdKTtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHNlcmlhbGl6ZUNhcHR1cmVKc29uKHtlbnRyeTogbS5lbnRyeSwgZmVlZGJhY2t9KSk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjYXB0dXJlIGV4cG9ydCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNhcHR1cmUnLCBgIyR7bS5lbnRyeS5ufWApO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJGZWVkYmFjayA9IChtOiBGZWVkYmFja01lc3NhZ2UsIGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCk6IEhUTUxFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayc7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkgZGl2LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgZGl2LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIGRpdi5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChtLnRleHQsIHNlYXJjaFF1ZXJ5KTtcbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsKSB7XG4gICAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgc2VsZWN0b3Ig4oCUIHByZWZlciBwYXJlbnRVaWQgKHRoZSBwZXJzaXN0ZWQgRkspXG4gICAgICAvLyBvdmVyIGNhcHR1cmUtYWRqYWNlbmN5LCBzaW5jZSBkcmFnLXRvLXJlcGFyZW50IG1vdmVzIHRoZSBjaGlwIGJ1dFxuICAgICAgLy8gdGhlIHRyYWlsaW5nLXNlbGVjdG9yIGhldXJpc3RpYyBnaXZlcyBzdGFsZSByZXN1bHRzIHVudGlsIHJlbmRlclxuICAgICAgLy8gc2V0dGxlcy4gVGhlIGFubm90YXRpb24gb3ZlcmxheSBuZWVkcyB0aGUgcGFyZW50J3Mgc2VsZWN0b3IgdG9cbiAgICAgIC8vIGFuY2hvciB0aGUgb24tcGFnZSB0b29sdGlwLlxuICAgICAgY29uc3Qge3BhcmVudFNlbCwgcGFyZW50VWlkfSA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkge1xuICAgICAgICAgIGNvbnN0IHAgPSBtZXNzYWdlcy5maW5kKFxuICAgICAgICAgICAgKG1tKSA9PiBtbS50eXBlID09PSAnc2VsZWN0b3InICYmIChtbSBhcyBTZWxlY3Rvck1lc3NhZ2UpLmVudHJ5LnVpZCA9PT0gbS5wYXJlbnRVaWQsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAocCAmJiBwLnR5cGUgPT09ICdzZWxlY3RvcicpIHJldHVybiB7cGFyZW50U2VsOiBwLmVudHJ5LnNlbGVjdG9yLCBwYXJlbnRVaWQ6IHAuZW50cnkudWlkfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3BhcmVudFNlbDogbGFzdFNlbGVjdG9yU2VsLCBwYXJlbnRVaWQ6IHVuZGVmaW5lZCBhcyBzdHJpbmcgfCB1bmRlZmluZWR9O1xuICAgICAgfSkoKTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogcGFyZW50U2VsLCBnb2xkOiB0cnVlfSk7XG4gICAgICAgIC8vIFNjcm9sbCB0aGUgcGFyZW50IGVsZW1lbnQgaW50byB2aWV3ICsgc2hvdyB0aGUgb24tcGFnZVxuICAgICAgICAvLyBhbm5vdGF0aW9uIHRvb2x0aXAgcmVuZGVyaW5nIFRISVMgY29tbWVudCdzIHRleHQuIFBhc3MgdGhlXG4gICAgICAgIC8vIHBhcmVudCdzIHVpZCBzbyBhIHNhbWUtc2VsZWN0b3Igc2libGluZyBjYXB0dXJlIGRvZXNuJ3QgZ2V0XG4gICAgICAgIC8vIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBcInRoZSBzYW1lIHRhcmdldFwiIGJ5IHRoZSBjb250ZW50XG4gICAgICAgIC8vIHNjcmlwdCdzIGFubm90YXRpb24gb3ZlcmxheS5cbiAgICAgICAgaWYgKHByZWZzLmF1dG9TY3JvbGxUb0hvdmVyZWQpIHtcbiAgICAgICAgICBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBwYXJlbnRTZWwsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbmRUb0NTKHtcbiAgICAgICAgICBraW5kOiAnYW5ub3RhdGlvbicsXG4gICAgICAgICAgc2VsZWN0b3I6IHBhcmVudFNlbCxcbiAgICAgICAgICBwYXlsb2FkOiB7c2VsZWN0b3I6IHBhcmVudFNlbCwgdWlkOiBwYXJlbnRVaWQsIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFjazogW20udGV4dF19LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uLWNsZWFyJ30pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGRpdi5kYXRhc2V0LmNvbW1lbnRJZCA9IG0uaWQ7XG4gICAgY29uc3QgYmVnaW5Db21tZW50RHJhZyA9IChlOiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgZS5kYXRhVHJhbnNmZXI/LnNldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnLCBtLmlkKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCd0ZXh0L3BsYWluJywgbS50ZXh0KTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICB9O1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICBjb25zdCBkcmFnSGFuZGxlID0gYWN0aW9uQnRuKCdncmlwJywgJ0RyYWcgdGhpcyBoYW5kbGUgb250byBhIHNlbGVjdG9yIHRvIHJlcGFyZW50JywgKCkgPT4geyAvKiBkcmFnIGhhbmRsZSBvbmx5ICovIH0pO1xuICAgIGRyYWdIYW5kbGUuY2xhc3NMaXN0LmFkZCgnZHJhZy1oYW5kbGUnKTtcbiAgICBkcmFnSGFuZGxlLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBiZWdpbkNvbW1lbnREcmFnKTtcbiAgICBkcmFnSGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKSk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkcmFnSGFuZGxlKTtcbiAgICAvLyBEZXRhY2gg4oCUIHRoZSBpbnZlcnNlIG9mIGRyYWctdG8tcmVwYXJlbnQuIE9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZVxuICAgIC8vIGNvbW1lbnQgY3VycmVudGx5IHJlYWRzIGFzIHRocmVhZGVkIChGSyBvciBhZGphY2VuY3kpLlxuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwgfHwgbS5wYXJlbnRVaWQpIHtcbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigndW5saW5rJywgJ0RldGFjaCBmcm9tIGl0cyBjYXB0dXJlIOKAlCBtYWtlIHRoaXMgYSBzdGFuZGFsb25lIGNvbW1lbnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIFJlc29sdmUgYnkgaWQgZnJvbSB0aGUgTElWRSBhcnJheTogd29ya3NwYWNlIHN3aXRjaGVzIGFuZFxuICAgICAgICAvLyB1bmRvL3JlZG8gcmVhc3NpZ24gYG1lc3NhZ2VzYCwgc28gdGhlIGNsb3N1cmUncyBgbWAgY2FuIGJlIGFcbiAgICAgICAgLy8gc3RhbGUgb2JqZWN0IHdob3NlIG11dGF0aW9uIHdvdWxkIGJlIHNpbGVudGx5IGRyb3BwZWQgYnkgdGhlXG4gICAgICAgIC8vIG5leHQgcGVyc2lzdCgpLlxuICAgICAgICBjb25zdCBsaXZlID0gbWVzc2FnZXMuZmluZCgoeCk6IHggaXMgRmVlZGJhY2tNZXNzYWdlID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LmlkID09PSBtLmlkKTtcbiAgICAgICAgaWYgKCFsaXZlKSB7IHNldFN0YXR1cygnQ29tbWVudCBubyBsb25nZXIgZXhpc3RzJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgZGVsZXRlIGxpdmUucGFyZW50VWlkO1xuICAgICAgICBsaXZlLmRldGFjaGVkID0gdHJ1ZTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGRldGFjaGVkIOKAlCBkcmFnIGl0cyBoYW5kbGUgb250byBhIGNhcHR1cmUgdG8gcmVhdHRhY2gnKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjb3B5JywgJ0NvcHkgY29tbWVudCB0ZXh0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQobS50ZXh0KTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNvbW1lbnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncGVuY2lsJywgJ0VkaXQgY29tbWVudCcsICgpID0+IGVudGVyRmVlZGJhY2tFZGl0KGRpdiwgbSksIHtzaXplOiAxNX0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChkZWxldGVCdG4oKCkgPT4gcmVtb3ZlTWVzc2FnZShtLmlkKSkpO1xuICAgIGRpdi5hcHBlbmQoYWN0aW9ucyk7XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICAvLyBEcm9wIGhhbmRsZXIgc2hhcmVkIGJ5IGV2ZXJ5IHNlbGVjdG9yIGJ1YmJsZS4gQWNjZXB0cyBhIGRyYWdnZWRcbiAgLy8gY29tbWVudCBJRCB2aWEgdGhlIGBhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50YCBNSU1FLCB1cGRhdGVzXG4gIC8vIHBhcmVudFVpZCArIGFkamFjZW5jeSwgcGVyc2lzdHMsIHJlLXJlbmRlcnMuXG4gIGNvbnN0IHdpcmVTZWxlY3RvckRyb3BUYXJnZXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogU2VsZWN0b3JNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVzID0gZS5kYXRhVHJhbnNmZXI/LnR5cGVzO1xuICAgICAgaWYgKCF0eXBlcyB8fCAhQXJyYXkuZnJvbSh0eXBlcykuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnKSkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpKTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChlKSA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKTtcbiAgICAgIGNvbnN0IGlkID0gZS5kYXRhVHJhbnNmZXI/LmdldERhdGEoJ2FwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnQnKTtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHNyY0lkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBpZCk7XG4gICAgICBpZiAoc3JjSWR4IDwgMCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc3JjID0gbWVzc2FnZXNbc3JjSWR4XSEgYXMgRmVlZGJhY2tNZXNzYWdlO1xuICAgICAgaWYgKHNyYy50eXBlICE9PSAnZmVlZGJhY2snKSByZXR1cm47XG4gICAgICBjb25zdCBkc3RJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBpZiAoZHN0SWR4IDwgMCkgcmV0dXJuO1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgRksgcG9pbnRlciBmaXJzdCDigJQgdGhhdCdzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggaW5cbiAgICAgIC8vIGV4cG9ydHMuIEFkamFjZW5jeSBpcyBqdXN0IGEgcmVuZGVyIGNvbnZlbmllbmNlLiBSZXBhcmVudGluZyBpc1xuICAgICAgLy8gdGhlIGludmVyc2Ugb2YgZGV0YWNoLCBzbyB0aGUgZGV0YWNoZWQgZmxhZyBpcyBjbGVhcmVkLlxuICAgICAgc3JjLnBhcmVudFVpZCA9IG0uZW50cnkudWlkO1xuICAgICAgZGVsZXRlIHNyYy5kZXRhY2hlZDtcbiAgICAgIC8vIFNwbGljZSBzcmMgb3V0IG9mIGl0cyBjdXJyZW50IHNsb3QgYW5kIHJlLWluc2VydCByaWdodCBhZnRlciB0aGVcbiAgICAgIC8vIG5ldyBwYXJlbnQgKGFuZCBhbnkgZmVlZGJhY2sgYWxyZWFkeSB0cmFpbGluZyBpdCwgc28gdGhlIG1vc3QtXG4gICAgICAvLyByZWNlbnQgZmVlZGJhY2sgZW5kcyB1cCBuZWFyZXN0IHRoZSBwYXJlbnQgdmlzdWFsbHkpLlxuICAgICAgbWVzc2FnZXMuc3BsaWNlKHNyY0lkeCwgMSk7XG4gICAgICBjb25zdCBuZXdEc3RJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBsZXQgaW5zZXJ0QXQgPSBuZXdEc3RJZHggKyAxO1xuICAgICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XSEudHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwgc3JjKTtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IHJlcGFyZW50ZWQnKTtcbiAgICB9KTtcbiAgfTtcblxuICB0eXBlIEFjdGlvbkJ0bk9wdHMgPSB7d2Fybj86IGJvb2xlYW47IHRvZ2dsZWQ/OiBib29sZWFuOyBzaXplPzogbnVtYmVyfTtcbiAgY29uc3QgYWN0aW9uQnRuID0gKGljb246IHN0cmluZywgdGl0bGU6IHN0cmluZywgZm46ICgpID0+IHZvaWQsIG9wdHM6IEFjdGlvbkJ0bk9wdHMgPSB7fSk6IEhUTUxCdXR0b25FbGVtZW50ID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYi50eXBlID0gJ2J1dHRvbic7XG4gICAgYi5kYXRhc2V0LnRpcCA9IHRpdGxlO1xuICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGl0bGUpO1xuICAgIGlmIChvcHRzLndhcm4pIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGlmIChvcHRzLnRvZ2dsZWQpIGIuY2xhc3NMaXN0LmFkZCgndG9nZ2xlZCcpO1xuICAgIC8vIERlZmF1bHQgaWNvbiBzaXplIDEzIHJlYWRzIHNsaWdodGx5IHNtYWxsIGluIGEgMjLDlzIyIGJ1dHRvbiDigJQgZmluZVxuICAgIC8vIGZvciBpY29ucyB3aXRoIHNpbXBsZSBzaGFwZXMgKGNyb3NzaGFpciwgbGlzdC10cmVlLCB1bmRvKSBidXQgdmlzaWJseVxuICAgIC8vIHNxdWVlemVkIGZvciBgbWVzc2FnZS1zcXVhcmUtcGx1c2AgYW5kIGBwZW5jaWxgLCB3aGVyZSB0aGVcbiAgICAvLyBpbnRlcmlvciBzdHJva2VzIHZhbmlzaCBpbnRvIGhhaXJsaW5lIGJsdXIuIENhbGxlcnMgY2FuIGJ1bXAgd2l0aFxuICAgIC8vIGBzaXplOiAxNWAgZm9yIHRob3NlLlxuICAgIGIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKGljb24sIG9wdHMuc2l6ZSA/PyAxMyk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGZuKCk7IH0pO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUJ0biA9IChvbkNvbmZpcm06ICgpID0+IHZvaWQpOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuY2xhc3NOYW1lID0gJ3dhcm4nO1xuICAgIGIuZGF0YXNldC50aXAgPSAnRGVsZXRlJztcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdEZWxldGUgY2FwdHVyZScpO1xuICAgIGIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgIGxldCBwYXJlbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJldmVydFRpbWVyID0gMDtcbiAgICBjb25zdCByZXZlcnQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBhcmVudCkgcmV0dXJuO1xuICAgICAgZm9yIChjb25zdCBuIG9mIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29uZmlybS15ZXMsIC5jb25maXJtLW5vJykpIG4ucmVtb3ZlKCk7XG4gICAgICBpZiAoIWIucGFyZW50RWxlbWVudCkgcGFyZW50LmFwcGVuZChiKTtcbiAgICAgIGNsZWFyVGltZW91dChyZXZlcnRUaW1lcik7XG4gICAgfTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBwYXJlbnQgPSBiLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCB5ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIHllcy50eXBlID0gJ2J1dHRvbic7XG4gICAgICB5ZXMuY2xhc3NOYW1lID0gJ2NvbmZpcm0teWVzJztcbiAgICAgIHllcy5kYXRhc2V0LnRpcCA9ICdDb25maXJtIGRlbGV0ZSc7XG4gICAgICB5ZXMuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NvbmZpcm0gZGVsZXRlJyk7XG4gICAgICB5ZXMuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGVjaycsIDEzKTtcbiAgICAgIHllcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4geyBldi5zdG9wUHJvcGFnYXRpb24oKTsgcmV2ZXJ0KCk7IG9uQ29uZmlybSgpOyB9KTtcbiAgICAgIGNvbnN0IG5vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBuby50eXBlID0gJ2J1dHRvbic7XG4gICAgICBuby5jbGFzc05hbWUgPSAnY29uZmlybS1ubyc7XG4gICAgICBuby5kYXRhc2V0LnRpcCA9ICdDYW5jZWwgZGVsZXRlJztcbiAgICAgIG5vLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgZGVsZXRlJyk7XG4gICAgICBuby5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3gnLCAxMyk7XG4gICAgICBuby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4geyBldi5zdG9wUHJvcGFnYXRpb24oKTsgcmV2ZXJ0KCk7IH0pO1xuICAgICAgYi5yZXBsYWNlV2l0aCh5ZXMpO1xuICAgICAgeWVzLmFmdGVyKG5vKTtcbiAgICAgIHJldmVydFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQocmV2ZXJ0LCA4MDAwKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBlbnRlckZlZWRiYWNrRWRpdCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBGZWVkYmFja01lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmV4dC5jbGFzc05hbWUgPSAnbXNnIGZlZWRiYWNrIGVkaXRpbmcnO1xuICAgIGlmIChkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aHJlYWRlZCcpKSBuZXh0LmNsYXNzTGlzdC5hZGQoJ3RocmVhZGVkJyk7XG4gICAgbmV4dC5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBuZXh0LmFwcGVuZChidWlsZElubGluZUNvbW1lbnQoe1xuICAgICAgaW5pdGlhbDogbS50ZXh0LFxuICAgICAgb25DYW5jZWw6ICgpID0+IHsgZGl2LnJlcGxhY2VXaXRoKGRpdi5jbG9uZU5vZGUodHJ1ZSkpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4ge1xuICAgICAgICBjb25zdCB0cmltbWVkID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRyaW1tZWQgPT09IG0udGV4dCkgeyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIG0udGV4dCA9IHRyaW1tZWQ7XG4gICAgICAgIC8vIFNldmVyaXR5IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgVUkuIFN0cmlwIGFueSBsZWdhY3kgdmFsdWVcbiAgICAgICAgLy8gdGhhdCBjYW1lIGJhY2sgZnJvbSBhbiBvbGRlciBKU09OTCBpbXBvcnQgc28gc2F2ZXMgZG9uJ3Qga2VlcFxuICAgICAgICAvLyByZS1lbWl0dGluZyBpdC5cbiAgICAgICAgZGVsZXRlIChtIGFzIGFueSkuc2V2ZXJpdHk7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9LFxuICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgIH0pKTtcbiAgICBkaXYucmVwbGFjZVdpdGgobmV4dCk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlTWVzc2FnZSA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgY29uc3QgZmluaXNoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgc25hcHNob3QoKTtcbiAgICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmlkICE9PSBpZCk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnRGVsZXRlZCcpO1xuICAgIH07XG4gICAgaWYgKCFlbCkgeyBmaW5pc2goKTsgcmV0dXJuOyB9XG4gICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICB2b2lkIGVsLm9mZnNldFdpZHRoO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3JlbW92aW5nJyk7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBjbGVhbnVwID0gKCk6IHZvaWQgPT4geyBpZiAoZG9uZSkgcmV0dXJuOyBkb25lID0gdHJ1ZTsgZmluaXNoKCk7IH07XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGNsZWFudXAsIHtvbmNlOiB0cnVlfSk7XG4gICAgc2V0VGltZW91dChjbGVhbnVwLCAzODApO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBDb21wb3NlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZEZlZWRiYWNrID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBjb21wb3Nlci52YWx1ZS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgc25hcHNob3QoKTtcbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIGluLW1lbW9yeSBtZXNzYWdlIGF0IGNyZWF0aW9uIHRpbWUgc28gdGhlXG4gICAgLy8gRksgaXMgdGhlIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGguIFRoZSBzbGltIGVtaXQgbm8gbG9uZ2VyIGhhcyB0b1xuICAgIC8vIGluZmVyIHRoZSBwYXJlbnQgZnJvbSBjYXB0dXJlLWFkamFjZW5jeSwgYW5kIGBtYW5pZmVzdC5jb3VudHNgXG4gICAgLy8gYWNjdXJhdGVseSByZWZsZWN0cyBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycy5cbiAgICAvLyBXYWxrIGJhY2sgdG8gdGhlIG5lYXJlc3QgcHJlY2VkaW5nIHNlbGVjdG9yIGJlZm9yZSBzcGxpY2UuXG4gICAgbGV0IHBJZHggPSBwb3NpdGlvbiAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCB7XG4gICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSwgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGV4dCxcbiAgICAgIC4uLihwYXJlbnRVaWQgPyB7cGFyZW50VWlkfSA6IHt9KSxcbiAgICB9KTtcbiAgICBjb21wb3Nlci52YWx1ZSA9ICcnO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICAvLyBTZW5kaW5nIGNsZWFycyBhbnkgYWN0aXZlIHZpc3VhbCBmaW5kIHNvIHRoZSBuZXcgY29tbWVudCBpc24ndCBoaWRkZW5cbiAgICAvLyBiZWhpbmQgYSBzdGFsZSBmaWx0ZXIuXG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSBjbG9zZUZpbmQoKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKCdTZW50Jyk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAvLyBCdWcgIzI6IGZlZWRiYWNrJ3MgcGFyZW50IHNob3VsZCBoYXZlIGEgc2NyZWVuc2hvdC5cbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InICYmICFwYXJlbnQuZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgdm9pZCBmaXJlRWxlbWVudFNob3QocGFyZW50IGFzIFNlbGVjdG9yTWVzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyAoZSkgPT4ge1xuICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYW5kbGVkID0gYXdhaXQgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlcigpO1xuICAgICAgaWYgKCFoYW5kbGVkKSBzZW5kRmVlZGJhY2soKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyAmJiBpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgc2V0U3RhdHVzKCdJbnNlcnQgbW9kZSBjYW5jZWxsZWQnKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCB1cGRhdGVDb21wb3Nlck1ldGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHQgPSBjb21wb3Nlci52YWx1ZTtcbiAgICBjb21wV29yZHMudGV4dENvbnRlbnQgPSBTdHJpbmcod29yZENvdW50KHQpKTtcbiAgICBjb21wVG9rZW5zLnRleHRDb250ZW50ID0gU3RyaW5nKHRva2VuQ291bnQodCkpO1xuICAgIGNvbXBvc2VyLmNsYXNzTGlzdC50b2dnbGUoJ2NtZC1tb2RlJywgL14+Ly50ZXN0KHQudHJpbSgpKSk7XG4gIH07XG4gIGNvbXBvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdXBkYXRlQ29tcG9zZXJNZXRlcik7XG5cbiAgLy8g4pSA4pSAIEhlYWRlciBzZWFyY2gg4oaSIGNvbW1hbmQgcGFsZXR0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gVGhlIGhlYWRlciBzZWFyY2ggYWZmb3JkYW5jZSBubyBsb25nZXIgcnVucyBpdHMgb3duIGZpbHRlcjsgY2xpY2tpbmcgb3JcbiAgLy8gZm9jdXNpbmcgaXQgb3BlbnMgdGhlIENtZCtLIGNvbW1hbmQgcGFsZXR0ZSAod2hpY2ggc2VhcmNoZXMgY2FwdHVyZXMgQU5EXG4gIC8vIHJ1bnMgY29tbWFuZHMpLiBJdCdzIGEgcmVhZG9ubHkgdHJpZ2dlciwgc28gd2UganVzdCBvcGVuIHRoZSBwYWxldHRlIGFuZFxuICAvLyBkcm9wIGZvY3VzIHNvIHRoZSBwYWxldHRlIGlucHV0IHRha2VzIG92ZXIgY2xlYW5seS5cbiAgY29uc3QgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGFsZXR0ZS5oaWRkZW4pIHJldHVybjtcbiAgICBvcGVuUGFsZXR0ZSgpO1xuICAgIHNlYXJjaC5ibHVyKCk7XG4gIH07XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCk7XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCk7XG4gIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCgpOyB9XG4gIH0pO1xuXG4gIC8vIOKUgOKUgCBDdHJsK0YgdmlzdWFsIGZpbmQgKGluLWxpc3QgZmlsdGVyICsgaGlnaGxpZ2h0KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2Nyb2xsRmlyc3RGaW5kSGl0SW50b1ZpZXcgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBjb25zdCBmaXJzdEhpdCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cuc2VsZWN0b3Iuc2VhcmNoLWhpdCcpO1xuICAgICAgaWYgKGZpcnN0SGl0KSB7XG4gICAgICAgIGNlbnRlckVsZW1lbnRJbkxpc3QoZmlyc3RIaXQpO1xuICAgICAgICBjb25zdCBtayA9IGZpcnN0SGl0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdtYXJrJyk7XG4gICAgICAgIGlmIChtaykgY2VudGVyRWxlbWVudEluTGlzdChtayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmaXJzdE1hdGNoID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZyBtYXJrJyk7XG4gICAgICAgIGlmIChmaXJzdE1hdGNoKSBjZW50ZXJFbGVtZW50SW5MaXN0KGZpcnN0TWF0Y2gpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBjb25zdCB1cGRhdGVGaW5kQ291bnQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFmaW5kQ291bnQpIHJldHVybjtcbiAgICBmaW5kQ291bnQudGV4dENvbnRlbnQgPSBzZWFyY2hRdWVyeSA/IGAke2xpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZycpLmxlbmd0aH0gbWF0Y2hgIDogJyc7XG4gIH07XG4gIGNvbnN0IGFwcGx5RmluZCA9ICh2YWx1ZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgc2VhcmNoUXVlcnkgPSB2YWx1ZS50cmltKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgdXBkYXRlRmluZENvdW50KCk7XG4gICAgc2Nyb2xsRmlyc3RGaW5kSGl0SW50b1ZpZXcoKTtcbiAgfTtcbiAgY29uc3Qgb3BlbkZpbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFmaW5kQmFyIHx8ICFmaW5kSW5wdXQpIHJldHVybjtcbiAgICBmaW5kQmFyLmhpZGRlbiA9IGZhbHNlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbCcpPy5jbGFzc0xpc3QuYWRkKCdmaW5kLW9wZW4nKTtcbiAgICBmaW5kSW5wdXQuZm9jdXMoKTtcbiAgICBmaW5kSW5wdXQuc2VsZWN0KCk7XG4gIH07XG4gIGNvbnN0IGNsb3NlRmluZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoZmluZEJhcikgZmluZEJhci5oaWRkZW4gPSB0cnVlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbCcpPy5jbGFzc0xpc3QucmVtb3ZlKCdmaW5kLW9wZW4nKTtcbiAgICBpZiAoZmluZElucHV0KSBmaW5kSW5wdXQudmFsdWUgPSAnJztcbiAgICBpZiAoc2VhcmNoUXVlcnkpIHsgc2VhcmNoUXVlcnkgPSAnJzsgcmVuZGVyKCk7IH1cbiAgICB1cGRhdGVGaW5kQ291bnQoKTtcbiAgfTtcbiAgZmluZElucHV0Py5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IGFwcGx5RmluZChmaW5kSW5wdXQudmFsdWUpKTtcbiAgZmluZElucHV0Py5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHsgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGNsb3NlRmluZCgpOyB9IH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maW5kLWNsZWFyXScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRmluZCk7XG5cbiAgY29uc3QgdHJ5TWFudWFsQ2FwdHVyZUZyb21Db21wb3NlciA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICBjb25zdCBtID0gL14+XFxzKiguKykkLy5leGVjKGNvbXBvc2VyLnZhbHVlLnRyaW0oKSk7XG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3Qgc2VsID0gbVsxXSEudHJpbSgpO1xuICAgIGlmICghc2VsKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9DU0FuZFdhaXQ8e29rOiBib29sZWFufT4oe2tpbmQ6ICdtYW51YWwtY2FwdHVyZScsIHNlbGVjdG9yOiBzZWx9KTtcbiAgICBpZiAocmVwbHk/Lm9rKSB7IGNvbXBvc2VyLnZhbHVlID0gJyc7IHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTsgc2V0U3RhdHVzKCdDYXB0dXJlZCAnICsgc2VsKTsgfVxuICAgIGVsc2Ugc2V0U3RhdHVzKCdTZWxlY3RvciBkaWQgbm90IG1hdGNoOiAnICsgc2VsLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydCBidWlsZGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gdjIgZXhwb3J0IHNoYXBlOiB0b3AgbGV2ZWwga2VlcHMgdXNlci1mYWNpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzXG4gIC8vICh1aWQsIG4sIHNlbGVjdG9yLCB0ZXh0LCByb2xlLCBhdHRycywgaGludHMsIGNsYXNzZXMsIHN0eWxlcywgY29tcG9uZW50LFxuICAvLyBzdGF0ZXMsIHNjcmVlbnNob3QsIGdyb3VwKS4gRGlhZ25vc3RpYyAvIGRldGVjdGlvbiBtZXRhZGF0YSBtb3ZlcyB1bmRlclxuICAvLyBhbiBgX2F1ZGl0YCBuYW1lc3BhY2UgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwgaW5TaGFkb3dET00sXG4gIC8vIHBzZXVkb0VsZW1lbnRzLCBtYXRjaGVkUnVsZXMsIHZpZXdwb3J0KS4gVGhlIHZlcnNpb24gbWFya2VyIGlzIGVtaXR0ZWRcbiAgLy8gYXMgYHY6IDJgLiBJbXBvcnRlcnMgZGV0ZWN0IGVpdGhlciB2MSAoZmxhdCkgb3IgdjIgYW5kIGRlbm9ybWFsaXplLlxuICAvL1xuICAvLyBBZ2dyZXNzaXZlIG1pbmlmeSBhZGRpdGlvbmFsbHkgZHJvcHMgZmllbGRzIHRoZSBzZWxlY3RvciBhbHJlYWR5XG4gIC8vIGltcGxpZXM6IGFuY2VzdG9ycywgdmlld3BvcnQgKG9uZSBwZXIgcGFnZSksIGNvbXBvbmVudFJvb3Qgd2hlblxuICAvLyByZWR1bmRhbnQgd2l0aCB0aGUgc2VsZWN0b3IsIGFuZCBwc2V1ZG9FbGVtZW50cy5cbiAgY29uc3Qgc2xpbUVudHJ5ID0gKGU6IEVudHJ5LCBvcHRzOiB7aW5jbHVkZUdyb3VwPzogYm9vbGVhbjsgZXZlbnRJbmRleD86IG51bWJlcjsgdmlzdWFsT3JkZXI/OiBudW1iZXI7IGdyb3VwVWlkPzogc3RyaW5nfSA9IHt9KTogUmVjb3JkPHN0cmluZywgYW55PiA9PiB7XG4gICAgY29uc3QgaW5jbHVkZU91dGVyID0gcHJlZnMuaW5jbHVkZU91dGVySFRNTDtcbiAgICBjb25zdCBpbmNsdWRlTWF0Y2hlZCA9IHByZWZzLmluY2x1ZGVNYXRjaGVkUnVsZXM7XG4gICAgY29uc3QgaW5jbHVkZVN0eWxlcyA9IHByZWZzLmluY2x1ZGVTdHlsZXM7XG4gICAgY29uc3QgbWluaWZ5ID0gcHJlZnMubWluaWZ5O1xuXG4gICAgLy8gVG9wLWxldmVsIHVzZXItZmFjaW5nIGZpZWxkcy4gT3JkZXIgbWF0dGVycyBmb3Igb3V0cHV0IHJlYWRhYmlsaXR5IOKAlFxuICAgIC8vIHdlIHdhbnQgYHYgLyB0eXBlIC8gdWlkIC8gbiAvIHNlbGVjdG9yYCBmaXJzdCBzbyBKU09OTCBpcyBncmVwcGFibGUuXG4gICAgLy9cbiAgICAvLyBgbmAgc3RheXMgYXMgdGhlIGNhcHR1cmUtc2VxdWVuY2UgZGlzcGxheSBsYWJlbCBmb3IgYmFja3dhcmRzXG4gICAgLy8gY29tcGF0aWJpbGl0eSB3aXRoIHYxL3YyIHJlYWRlcnMgKGFuZCB0aGUgc2lkZWJhcidzIFwiIzNcIiBjaGlwcykuXG4gICAgLy8gVGhlIGRpc2FtYmlndWF0ZWQgY291c2lucyAoYGNhcHR1cmVJbmRleGAsIGBldmVudEluZGV4YCxcbiAgICAvLyBgdmlzdWFsT3JkZXJgLCBgZGlzcGxheUxhYmVsYCkgbGl2ZSBvbiB0aGUgcm93IHNvIGEgZG93bnN0cmVhbVxuICAgIC8vIGFnZW50IGNhbiBwaWNrIHdoaWNoZXZlciBvcmRlcmluZyBpcyBtZWFuaW5nZnVsIOKAlCBidWcgIzEwLlxuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHY6IDIsXG4gICAgICB0eXBlOiAnc2VsZWN0b3InLFxuICAgICAgdWlkOiBlLnVpZCxcbiAgICAgIG46IGUubixcbiAgICAgIHRzOiBlLnRzLFxuICAgICAgdXJsOiBlLnVybCxcbiAgICAgIHRhZzogZS50YWcsXG4gICAgICBzZWxlY3RvcjogZS5zZWxlY3RvcixcbiAgICAgIGNhcHR1cmVJbmRleDogZS5uLFxuICAgICAgZGlzcGxheUxhYmVsOiBTdHJpbmcoZS5uKSxcbiAgICB9O1xuICAgIGlmIChvcHRzLmV2ZW50SW5kZXggIT09IHVuZGVmaW5lZCkgb3V0LmV2ZW50SW5kZXggPSBvcHRzLmV2ZW50SW5kZXg7XG4gICAgaWYgKG9wdHMudmlzdWFsT3JkZXIgIT09IHVuZGVmaW5lZCkgb3V0LnZpc3VhbE9yZGVyID0gb3B0cy52aXN1YWxPcmRlcjtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS50ZXh0ICE9PSB1bmRlZmluZWQpIG91dC50ZXh0ID0gbWluaWZ5ID8gZS50ZXh0LnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLnRleHQ7XG4gICAgaWYgKGUucm9sZSAhPT0gdW5kZWZpbmVkKSBvdXQucm9sZSA9IGUucm9sZTtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSAhPT0gdW5kZWZpbmVkKSBvdXQuYWNjZXNzaWJsZU5hbWUgPSBtaW5pZnkgPyBlLmFjY2Vzc2libGVOYW1lLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLmFjY2Vzc2libGVOYW1lO1xuICAgIGlmIChlLmlkICE9PSB1bmRlZmluZWQpIG91dC5pZCA9IGUuaWQ7XG4gICAgaWYgKGUudGVzdElkICE9PSB1bmRlZmluZWQpIG91dC50ZXN0SWQgPSBlLnRlc3RJZDtcbiAgICBpZiAoZS5jbGFzc2VzICYmIGUuY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIG91dC5jbGFzc2VzID0gKG1pbmlmeSAmJiBlLmNsYXNzZXMubGVuZ3RoID4gOCkgPyBlLmNsYXNzZXMuc2xpY2UoMCwgOCkgOiBlLmNsYXNzZXM7XG4gICAgfVxuICAgIGlmIChlLmF0dHJzICYmIE9iamVjdC5rZXlzKGUuYXR0cnMpLmxlbmd0aCkgb3V0LmF0dHJzID0gZS5hdHRycztcbiAgICBpZiAoZS5oaW50cyAmJiBPYmplY3Qua2V5cyhlLmhpbnRzKS5sZW5ndGgpIG91dC5oaW50cyA9IGUuaGludHM7XG4gICAgaWYgKGUucmVjdCkgb3V0LnJlY3QgPSBlLnJlY3Q7XG4gICAgaWYgKGUuc3RhdGVzICYmIGUuc3RhdGVzLmxlbmd0aCkgb3V0LnN0YXRlcyA9IGUuc3RhdGVzO1xuICAgIGlmIChlLmNvbXBvbmVudCkgb3V0LmNvbXBvbmVudCA9IGUuY29tcG9uZW50O1xuICAgIC8vIExvY2F0b3ItcXVhbGl0eSBmaWVsZC4gUHJvbW90ZSBldmVuIHdoZW4gbWluaWZpZWQg4oCUIGl0J3MgYSBzaW5nbGVcbiAgICAvLyBzbWFsbCBpbnQgYW5kIGEgZG93bnN0cmVhbSBhZ2VudCB1c2VzIGl0IHRvIGRlY2lkZSB3aGV0aGVyIHRvXG4gICAgLy8gdHJ1c3QgdGhlIHNlbGVjdG9yLlxuICAgIGlmIChlLnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSBvdXQuc2VsZWN0b3JNYXRjaENvdW50ID0gZS5zZWxlY3Rvck1hdGNoQ291bnQ7XG4gICAgaWYgKGUuYTExeSkgb3V0LmExMXkgPSBlLmExMXk7XG4gICAgaWYgKGUuYXNzZXRzICYmIGUuYXNzZXRzLmxlbmd0aCkgb3V0LmFzc2V0cyA9IGUuYXNzZXRzO1xuICAgIGlmIChlLmxheW91dENvbnRleHQgJiYgZS5sYXlvdXRDb250ZXh0Lmxlbmd0aCkgb3V0LmxheW91dENvbnRleHQgPSBlLmxheW91dENvbnRleHQ7XG4gICAgaWYgKGluY2x1ZGVPdXRlciAmJiBlLm91dGVySFRNTCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXQub3V0ZXJIVE1MID0gbWluaWZ5ID8gZS5vdXRlckhUTUwucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUub3V0ZXJIVE1MO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZVN0eWxlcyAmJiBlLnN0eWxlcyAmJiBPYmplY3Qua2V5cyhlLnN0eWxlcykubGVuZ3RoKSBvdXQuc3R5bGVzID0gZS5zdHlsZXM7XG4gICAgaWYgKGUuc2NyZWVuc2hvdCkge1xuICAgICAgLy8gUGF0aCBub3JtYWxpemF0aW9uOiB0aGUgbGl2ZSBgZW50cnkuc2NyZWVuc2hvdC5lbGVtZW50YCBjYXJyaWVzIGFcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXhlZCBwYXRoIChlLmcuIGBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmdgKVxuICAgICAgLy8gYmVjYXVzZSB0aGUgYmFja2dyb3VuZCdzIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgQVBJIHN0YW1wc1xuICAgICAgLy8gdGhlIHdvcmtzcGFjZSBpbnRvIHRoZSBvbi1kaXNrIHBhdGguIEJ1dCB0aGUgLnRhci56c3QgYXJjaGl2ZVxuICAgICAgLy8gYnVuZGxlcyBzY3JlZW5zaG90cyBmbGF0IGF0IGBzY3JlZW5zaG90cy9mb28ucG5nYCwgc28gdGhlXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4IHdvdWxkIHJlc29sdmUgdG8gbm90aGluZyBmb3IgYW4gYWdlbnQgdGhhdFxuICAgICAgLy8gZXh0cmFjdGVkIHRoZSBhcmNoaXZlLiBTdHJpcCB0aGUgd29ya3NwYWNlIHByZWZpeCBvbiBlbWl0IHNvXG4gICAgICAvLyBldmVyeSBwYXRoIGlzIHZhbGlkIHJlbGF0aXZlIHRvIHRoZSBtYW5pZmVzdCdzIGRlY2xhcmVkXG4gICAgICAvLyBgcGF0aFJvb3RgIChhcmNoaXZlIHJvb3QgZm9yIHRhci56c3Q7IHdvcmtzcGFjZSByb290IGZvciBwbGFpblxuICAgICAgLy8gSlNPTkwg4oCUIGkuZS4sIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gKS5cbiAgICAgIGNvbnN0IHN0cmlwV3MgPSAocDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgaWYgKCFwKSByZXR1cm4gcDtcbiAgICAgICAgLy8gU3RyaXAgZXhhY3RseSBvbmUgbGVhZGluZyBgPHdvcmtzcGFjZT4vYCBzZWdtZW50IGlmIHByZXNlbnQuXG4gICAgICAgIGNvbnN0IHdzUHJlZml4ID0gYCR7YWN0aXZlV3N9L2A7XG4gICAgICAgIHJldHVybiBwLnN0YXJ0c1dpdGgod3NQcmVmaXgpID8gcC5zbGljZSh3c1ByZWZpeC5sZW5ndGgpIDogcDtcbiAgICAgIH07XG4gICAgICBvdXQuc2NyZWVuc2hvdCA9IHsuLi5lLnNjcmVlbnNob3R9O1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpIG91dC5zY3JlZW5zaG90LmVsZW1lbnQgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LmVsZW1lbnQpO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90Lmdyb3VwKSBvdXQuc2NyZWVuc2hvdC5ncm91cCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZ3JvdXApO1xuICAgICAgaWYgKG91dC5zY3JlZW5zaG90LnBhZ2UpIG91dC5zY3JlZW5zaG90LnBhZ2UgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90LnBhZ2UpO1xuICAgIH1cbiAgICAvLyBQcm9tb3RlIHJ1bnRpbWUvYmVoYXZpb3Igc2lnbmFscyB0byB0b3AtbGV2ZWwuIFRoZXNlIGFyZSBwcmltYXJ5XG4gICAgLy8gc2lnbmFsIGZvciB0cmlhZ2UgKGV2ZW50cyB0ZWxscyBcIndoaWNoIGhhbmRsZXIgcmFuXCIsIGJlaGF2aW9yQXR0cnNcbiAgICAvLyB0ZWxscyBcIndoYXQgc2VydmVyLXJlbmRlcmVkIGJpbmRpbmcgZG9lcyB0aGlzIGZpcmVcIiwgY2FudmFzQ2xpY2tcbiAgICAvLyB0ZWxscyBcIndoZXJlIG9uIHRoZSBjaGFydCB3YXMgY2xpY2tlZFwiLCBlZGl0b3IgdGVsbHMgXCJ3aGljaFxuICAgIC8vIHJpY2gtdGV4dCBsaWJyYXJ5IHdyYXBzIHRoaXNcIiwgZG9tTXV0YXRpb25zIHRlbGxzIFwid2hhdCBjaGFuZ2VkXG4gICAgLy8gYmVmb3JlIHRoZSBjbGlja1wiLCBpc0FuaW1hdGluZyB3YXJucyBhYm91dCB0cmFuc2llbnQgc3RhdGUpLlxuICAgIGlmIChlLmV2ZW50cyAmJiBPYmplY3Qua2V5cyhlLmV2ZW50cykubGVuZ3RoKSBvdXQuZXZlbnRzID0gZS5ldmVudHM7XG4gICAgaWYgKGUuYmVoYXZpb3JBdHRycyAmJiBPYmplY3Qua2V5cyhlLmJlaGF2aW9yQXR0cnMpLmxlbmd0aCkgb3V0LmJlaGF2aW9yQXR0cnMgPSBlLmJlaGF2aW9yQXR0cnM7XG4gICAgaWYgKGUuY2FudmFzQ2xpY2spIG91dC5jYW52YXNDbGljayA9IGUuY2FudmFzQ2xpY2s7XG4gICAgaWYgKGUuZWRpdG9yKSBvdXQuZWRpdG9yID0gZS5lZGl0b3I7XG4gICAgaWYgKGUuaXNBbmltYXRpbmcpIG91dC5pc0FuaW1hdGluZyA9IHRydWU7XG4gICAgaWYgKGUuc2hhZG93SG9zdCkgb3V0LnNoYWRvd0hvc3QgPSBlLnNoYWRvd0hvc3Q7XG4gICAgaWYgKGUucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIG91dC5yZW5kZXJlZFRleHQgPSBlLnJlbmRlcmVkVGV4dDtcbiAgICBpZiAoZS50cnVuY2F0ZWQgJiYgT2JqZWN0LmtleXMoZS50cnVuY2F0ZWQpLmxlbmd0aCkgb3V0LnRydW5jYXRlZCA9IGUudHJ1bmNhdGVkO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLmRvbU11dGF0aW9ucyAmJiBlLmRvbU11dGF0aW9ucy5sZW5ndGgpIG91dC5kb21NdXRhdGlvbnMgPSBlLmRvbU11dGF0aW9ucztcblxuICAgIC8vIF9hdWRpdDogZGV0ZWN0aW9uIGNoYWluICYgZGlhZ25vc3RpYyBzaGFwZS5cbiAgICAvLyBSRUFETUUgY2xhaW1lZCBgX2F1ZGl0LmFuY2VzdG9yc2AgYW5kIGBfYXVkaXQuY29tcG9uZW50Um9vdGAgd2VyZVxuICAgIC8vIGFsd2F5cyBwcmVzZW50LCBidXQgdGhlIHNsaW0gZW1pdCBkcm9wcGVkIHRoZW0gd2hlbmV2ZXJcbiAgICAvLyBgbWluaWZ5OiB0cnVlYC4gVGhlIGZpeDogZW1pdCBldmVyeSBkZWNsYXJlZCBgX2F1ZGl0YCBmaWVsZFxuICAgIC8vIHdoZW5ldmVyIHRoZSBzb3VyY2UgZGF0YSBleGlzdHMsIGFuZCBsZXRcbiAgICAvLyBgbWluaWZ5YCBzbGltIE9OTFkgdGhlIGhpZ2gtdm9sdW1lIGJsb2NrcyAobWF0Y2hlZFJ1bGVzLFxuICAgIC8vIHBzZXVkb0VsZW1lbnRzKS4gU21hbGwgc3RydWN0dXJhbCBtZXRhZGF0YSAoYW5jZXN0b3JzLFxuICAgIC8vIGNvbXBvbmVudFJvb3QsIHZpZXdwb3J0KSBzdXJ2aXZlcyBtaW5pZnkgc28gdGhlIHNjaGVtYSBjbGFpbXNcbiAgICAvLyBzdGF5IGhvbmVzdC5cbiAgICBjb25zdCBhdWRpdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChlLmFuY2VzdG9ycyAmJiBlLmFuY2VzdG9ycy5sZW5ndGgpIGF1ZGl0LmFuY2VzdG9ycyA9IGUuYW5jZXN0b3JzO1xuICAgIGlmIChlLmNvbXBvbmVudFJvb3QgIT09IHVuZGVmaW5lZCkgYXVkaXQuY29tcG9uZW50Um9vdCA9IGUuY29tcG9uZW50Um9vdDtcbiAgICBpZiAoZS5pblNoYWRvd0RPTSkgYXVkaXQuaW5TaGFkb3dET00gPSB0cnVlO1xuICAgIGlmIChlLnBzZXVkb0VsZW1lbnRzICYmIE9iamVjdC5rZXlzKGUucHNldWRvRWxlbWVudHMpLmxlbmd0aCAmJiAhbWluaWZ5KSBhdWRpdC5wc2V1ZG9FbGVtZW50cyA9IGUucHNldWRvRWxlbWVudHM7XG4gICAgaWYgKGluY2x1ZGVNYXRjaGVkICYmIGUubWF0Y2hlZFJ1bGVzICYmIGUubWF0Y2hlZFJ1bGVzLmxlbmd0aCkge1xuICAgICAgYXVkaXQubWF0Y2hlZFJ1bGVzID0gbWluaWZ5XG4gICAgICAgID8gZS5tYXRjaGVkUnVsZXMubWFwKChyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcjI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7c2VsZWN0b3I6IHIuc2VsZWN0b3J9O1xuICAgICAgICAgIGlmIChyLmRlY2xhcmF0aW9ucyAmJiBPYmplY3Qua2V5cyhyLmRlY2xhcmF0aW9ucykubGVuZ3RoKSByMi5kZWNsYXJhdGlvbnMgPSByLmRlY2xhcmF0aW9ucztcbiAgICAgICAgICBpZiAoci5tZWRpYSkgcjIubWVkaWEgPSByLm1lZGlhO1xuICAgICAgICAgIHJldHVybiByMjtcbiAgICAgICAgfSlcbiAgICAgICAgOiBlLm1hdGNoZWRSdWxlcztcbiAgICB9XG4gICAgaWYgKGUudmlld3BvcnQpIGF1ZGl0LnZpZXdwb3J0ID0gZS52aWV3cG9ydDtcbiAgICBpZiAoT2JqZWN0LmtleXMoYXVkaXQpLmxlbmd0aCkgb3V0Ll9hdWRpdCA9IGF1ZGl0O1xuXG4gICAgLy8gR3JvdXAgaGVhZCBsaW5rYWdlLiBQcmV2aW91c2x5IHRoZSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYFxuICAgIC8vIGNhcnJpZWQgZnVsbCBuZXN0ZWQgZW50cnkgb2JqZWN0cy5cbiAgICAvLyBUaGF0IG1hZGUgRHVja0RCIGpvaW5zIHVnbHkgYW5kIGJyb2tlIHRoZSBydWxlIHRoYXQgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBzaG91bGQgYmUgYSB0b3AtbGV2ZWwgcm93LiBXZSBub3cgZW1pdDpcbiAgICAvLyAgIOKAoiBvbiB0aGUgZ3JvdXAgaGVhZDogYGdyb3VwTWVtYmVyVWlkczogW3VpZCwgdWlkLCAuLi5dYCAoanVzdCBJRHMpXG4gICAgLy8gICDigKIgZWFjaCBtZW1iZXIgYXMgaXRzIG93biB0b3AtbGV2ZWwgc2xpbSByb3cgd2l0aCBgZ3JvdXBVaWRgXG4gICAgLy8gICAgIHBvaW50aW5nIGJhY2sgYXQgdGhlIGhlYWQgKGhhbmRsZWQgaW4gYGJ1aWxkU2xpbWAgZmx1c2ggbG9naWMpLlxuICAgIGlmIChvcHRzLmluY2x1ZGVHcm91cCAmJiBlLmdyb3VwICYmIGUuZ3JvdXAubGVuZ3RoKSB7XG4gICAgICBvdXQuZ3JvdXBNZW1iZXJVaWRzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuICAgIGlmIChvcHRzLmdyb3VwVWlkKSBvdXQuZ3JvdXBVaWQgPSBvcHRzLmdyb3VwVWlkO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIFNoYXJlZCBcInNsaW0gZGF0YVwiIHBpcGVsaW5lIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBKU09OTCByZW5kZXJzIG9mZiB0aGlzIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvbi4gKE1hcmtkb3duIHVzZWQgdG9cbiAgLy8gc2hhcmUgaXQ7IHRoZSBNYXJrZG93biBleHBvcnQgd2FzIHJldGlyZWQgaW4gZmF2b3Igb2YgSlNPTkwtb25seS4pXG4gIC8vXG4gIC8vIHYyIGRpZmZlcmVuY2VzIHZzIHYxOlxuICAvLyAgIOKAoiBTZWxlY3RvciBsaW5lcyBoYXZlIGV4cGxpY2l0IGB0eXBlOiAnc2VsZWN0b3InYCBhbmQgYHY6IDJgLlxuICAvLyAgIOKAoiBfYXVkaXQgbmVzdHMgZGV0ZWN0aW9uIC8gZGVidWcgZmllbGRzIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIOKApikuXG4gIC8vICAg4oCiIEZlZWRiYWNrIGVtaXRzIGFzIHN0YW5kYWxvbmUgYHt0eXBlOidmZWVkYmFjaycsIHBhcmVudFVpZCwg4oCmfWAgbGluZXNcbiAgLy8gICAgIFBMVVMgYnVuZGxlZCBgZmVlZGJhY2tgIGFycmF5cyBvbiBzZWxlY3RvcnMgKHNvIG9sZCBzaW5nbGUtbGluZVxuICAvLyAgICAgcmVhZGVycyBzdGlsbCBzZWUgdGhlbSBhZGphY2VudCkuXG4gIC8vICAg4oCiIEEgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGNhcnJpZXMgd29ya3NwYWNlICsgY291bnRzICsgZmlsZW5hbWUuXG4gIHR5cGUgU2xpbVBhZ2UgPSB7djogMjsgdHlwZTogJ3BhZ2UnOyB0czogc3RyaW5nOyB1cmw6IHN0cmluZzsgdGl0bGU/OiBzdHJpbmc7IHZpZXdwb3J0PzogVmlld3BvcnQ7IHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IHVzZXJBZ2VudD86IHN0cmluZzsgbGFuZz86IHN0cmluZzsgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9OyByb3V0ZT86IGFueTsgc3RhdGU/OiBhbnk7IHNlc3Npb25JZD86IHN0cmluZzsgc25hcHNob3Q/OiBQYWdlU25hcHNob3R9O1xuICAvLyBTZXZlcml0eSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSAoMjAyNi0wNSkuIFRvbGVyYW50IHJlYWRlcnMgbWF5IHN0aWxsXG4gIC8vIHNlZSBgc2V2ZXJpdHlgIG9uIGxlZ2FjeSBKU09OTCDigJQgZGVub3JtYWxpemVFbnRyeSBwcmVzZXJ2ZXMgaXQgb25cbiAgLy8gRmVlZGJhY2tNZXNzYWdlIHNvIHJlLWV4cG9ydCByb3VuZC10cmlwcywgYnV0IG5ldyBzZXNzaW9ucyBuZXZlciBzZXRcbiAgLy8gaXQgYW5kIHdlIGRvbid0IGVtaXQgaXQgaGVyZS4gS2VlcCB0aGUgZmllbGQgb2ZmIFNsaW1GZWVkYmFjayBzbyBuZXdcbiAgLy8gZXhwb3J0cyBzdGF5IGNsZWFuLlxuICAvLyBgdGFnc2AgaXMgYWx3YXlzIGVtaXR0ZWQgKGRlZmF1bHQgZW1wdHkgYXJyYXkpIHNvIER1Y2tEQiBzY2hlbWFcbiAgLy8gaW5mZXJlbmNlIGFsd2F5cyBzZWVzIHRoZSBjb2x1bW4uXG4gIHR5cGUgU2xpbUZlZWRiYWNrID0ge3Y6IDI7IHR5cGU6ICdmZWVkYmFjayc7IHVpZDogc3RyaW5nOyB0czogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZzsgZGV0YWNoZWQ/OiBib29sZWFuOyB0YWdzOiBzdHJpbmdbXTsgaXNUZXN0RGF0YT86IGJvb2xlYW47IHN1Z2dlc3RlZFNraWxscz86IEFycmF5PHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9Pn07XG4gIC8vIENoZWFwIHRlc3QtZGF0YSBzbmlmZjogbWF0Y2hlcyBzdHJpbmdzIHRoZSB1c2VyIHR5cGVzIHdoaWxlIHNtb2tlLVxuICAvLyB0ZXN0aW5nIHRoZSBleHRlbnNpb24gKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIiwgXCJsb3JlbSBpcHN1bVwiLFxuICAvLyBcInBsYWNlaG9sZGVyXCIsIG9yIGFueSBwaHJhc2Ugb2J2aW91c2x5IHN0dWJiZWQtb3V0KS4gRmFsc2UgcG9zaXRpdmVzXG4gIC8vIGhlcmUgYXJlIHJlY292ZXJhYmxlIOKAlCB0aGUgY29uc3VtZXIgY2FuIGlnbm9yZSB0aGUgZmxhZyDigJQgYnV0XG4gIC8vIGV4Y2x1ZGluZyByZWFsIGZlZWRiYWNrIHdvdWxkIG5vdCBiZSwgc28gd2Uga2VlcCB0aGUgcmVnZXggbmFycm93LlxuICBjb25zdCBURVNUX0RBVEFfUkUgPSAvXih0ZXN0fGFzZGZ8cXdlcnxmb298YmFyfGJhenxsb3JlbXxwbGFjZWhvbGRlcnx0b2RvfHh7Myx9fGhlbGxvIHdvcmxkfHNhbXBsZXxkdW1teXxzb21ldGhpbmd8YW55dGhpbmd8aWdub3JlIG1lfHdpcHx0YmR8blxcL2F8aGkpXFxiL2k7XG4gIGNvbnN0IGxvb2tzTGlrZVRlc3REYXRhID0gKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRyaW0oKTtcbiAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoVEVTVF9EQVRBX1JFLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIGlmICgvdGVzdCBmZWVkYmFjay9pLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgdHlwZSBTbGltU2VsZWN0b3IgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+ICYge3Y6IDI7IHR5cGU6ICdzZWxlY3Rvcic7IG46IG51bWJlcjsgc2VsZWN0b3I6IHN0cmluZzsgZmVlZGJhY2s/OiBzdHJpbmdbXX07XG4gIHR5cGUgU2xpbUxpbmUgPSBTbGltUGFnZSB8IFNsaW1GZWVkYmFjayB8IFNsaW1TZWxlY3RvcjtcbiAgY29uc3QgYnVpbGRTbGltID0gKCk6IFNsaW1MaW5lW10gPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBTbGltTGluZVtdID0gW107XG4gICAgLy8gUHJlLWNvbXB1dGUgdmlzdWFsT3JkZXIgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KSBmb3IgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBtZXNzYWdlLiBUaGUgcHJldmlvdXMgc2luZ2xlIGBuYCBmaWVsZCBjb25mbGF0ZWRcbiAgICAvLyBjYXB0dXJlIG9yZGVyLCBKU09OTCBzdHJlYW0gb3JkZXIsXG4gICAgLy8gdmlzdWFsIG9yZGVyLCBhbmQgZGlzcGxheSBsYWJlbC4gV2Ugbm93IGVtaXQgZm91ciBvcnRob2dvbmFsXG4gICAgLy8gZmllbGRzIGFuZCBkb2N1bWVudCBlYWNoOlxuICAgIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHRoZSBvcmlnaW5hbCBgbmAgKGNhcHR1cmUgc2VxdWVuY2UpXG4gICAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCBzb3J0IGJ5IHJlY3QueSBhc2MsIHJlY3QueCBhc2NcbiAgICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIHRoZSBodW1hbi1mYWNpbmcgbnVtYmVyIHNob3duIGluIHRoZSBzaWRlYmFyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIChjdXJyZW50bHkgbWlycm9ycyBjYXB0dXJlSW5kZXg7IGNhbiBkcmlmdCBpZlxuICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGUgc2lkZWJhciBhZG9wdHMgYSBkaWZmZXJlbnQgbGFiZWwgc2NoZW1lKS5cbiAgICBjb25zdCB2aXN1YWxSYW5rID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBjb25zdCBzZWxzID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAuc2xpY2UoKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYXIgPSBhLmVudHJ5LnJlY3Q7IGNvbnN0IGJyID0gYi5lbnRyeS5yZWN0O1xuICAgICAgICBpZiAoIWFyIHx8ICFicikgcmV0dXJuIDA7XG4gICAgICAgIGlmIChhci55ICE9PSBici55KSByZXR1cm4gYXIueSAtIGJyLnk7XG4gICAgICAgIHJldHVybiBhci54IC0gYnIueDtcbiAgICAgIH0pO1xuICAgIHNlbHMuZm9yRWFjaCgobSwgaSkgPT4gdmlzdWFsUmFuay5zZXQobS5pZCwgaSArIDEpKTtcbiAgICBsZXQgcGVuZGluZ1NlbDogU2VsZWN0b3JNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gV2UgY29sbGVjdCBib3RoIHRoZSBidW5kbGVkIHN0cmluZyBhcnJheSAoZm9yIHYxLWZyaWVuZGx5IHJlYWRlcnMpIGFuZFxuICAgIC8vIHRoZSByaWNoIG9iamVjdHMgKGZvciB2MiBzdGFuZGFsb25lIGxpbmVzKS5cbiAgICBsZXQgcGVuZGluZ0ZiU3RyaW5nczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcGVuZGluZ0ZiUmljaDogU2xpbUZlZWRiYWNrW10gPSBbXTtcbiAgICBjb25zdCBmbHVzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGVuZGluZ1NlbCkgcmV0dXJuO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IGxpbmVzLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCB2aXN1YWxPcmRlciA9IHZpc3VhbFJhbmsuZ2V0KHBlbmRpbmdTZWwuaWQpO1xuICAgICAgY29uc3Qgb3V0OiBhbnkgPSBzbGltRW50cnkocGVuZGluZ1NlbC5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZSwgZXZlbnRJbmRleCwgdmlzdWFsT3JkZXJ9KTtcbiAgICAgIGlmIChwZW5kaW5nRmJTdHJpbmdzLmxlbmd0aCkgb3V0LmZlZWRiYWNrID0gWy4uLnBlbmRpbmdGYlN0cmluZ3NdO1xuICAgICAgbGluZXMucHVzaChvdXQgYXMgU2xpbUxpbmUpO1xuICAgICAgLy8gR3JvdXAgZmxhdG5lc3MgKGJ1ZyAjOSkuIEVtaXQgZWFjaCBncm91cCBtZW1iZXIgYXMgaXRzIG93blxuICAgICAgLy8gdG9wLWxldmVsIHNsaW0gcm93IHJpZ2h0IGFmdGVyIHRoZSBoZWFkLCB3aXRoIGBncm91cFVpZGBcbiAgICAgIC8vIGxpbmtpbmcgYmFjay4gVGhpcyBsZXRzIER1Y2tEQiAvIFNRTCBxdWVyaWVzIHRyZWF0IGdyb3VwXG4gICAgICAvLyBtZW1iZXJzIGFzIGZpcnN0LWNsYXNzIHNlbGVjdG9yIHJvd3Mgd2l0aG91dCBkZXNjZW5kaW5nIGludG9cbiAgICAgIC8vIG5lc3RlZCBvYmplY3RzLlxuICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gcGVuZGluZ1NlbC5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGdyb3VwTWVtYmVycykge1xuICAgICAgICBjb25zdCBtRXZlbnQgPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgICBjb25zdCBtZW1iZXJSb3c6IGFueSA9IHNsaW1FbnRyeShtZW1iZXIsIHtpbmNsdWRlR3JvdXA6IGZhbHNlLCBldmVudEluZGV4OiBtRXZlbnQsIGdyb3VwVWlkOiBwZW5kaW5nU2VsLmVudHJ5LnVpZH0pO1xuICAgICAgICBsaW5lcy5wdXNoKG1lbWJlclJvdyBhcyBTbGltTGluZSk7XG4gICAgICB9XG4gICAgICAvLyBFbWl0IGVhY2ggc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lIHJpZ2h0IGFmdGVyIHRoZSBzZWxlY3RvcihzKS5cbiAgICAgIGZvciAoY29uc3QgZmIgb2YgcGVuZGluZ0ZiUmljaCkgbGluZXMucHVzaChmYik7XG4gICAgICBwZW5kaW5nU2VsID0gbnVsbDtcbiAgICAgIHBlbmRpbmdGYlN0cmluZ3MgPSBbXTtcbiAgICAgIHBlbmRpbmdGYlJpY2ggPSBbXTtcbiAgICB9O1xuICAgIC8vIFJlb3JkZXIgZm9yIGV4cG9ydCBvbmx5IOKAlCBzaWRlYmFyIGtlZXBzIGNhcHR1cmUgb3JkZXIsIHRoZVxuICAgIC8vIGVtaXR0ZWQgSlNPTkwgcmVhZHMgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgd2l0aGluIGVhY2ggcGFnZS5cbiAgICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIHZpYSB0aGVcbiAgICAvLyBgcmVvcmRlckZvckV4cG9ydGAgaGVscGVyLCBzbyB0aHJlYWRpbmcgaXMgcHJlc2VydmVkIHRocm91Z2hcbiAgICAvLyB0aGUgcmVhcnJhbmdlbWVudC5cbiAgICBjb25zdCBleHBvcnRPcmRlcmVkID0gcmVvcmRlckZvckV4cG9ydChtZXNzYWdlcyk7XG4gICAgZm9yIChjb25zdCBtIG9mIGV4cG9ydE9yZGVyZWQpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaCgpO1xuICAgICAgICBjb25zdCBzbGltOiBTbGltUGFnZSA9IHt2OiAyLCB0eXBlOiAncGFnZScsIHRzOiBtLnRzLCB1cmw6IG0udXJsfTtcbiAgICAgICAgaWYgKG0udGl0bGUgIT09IHVuZGVmaW5lZCkgc2xpbS50aXRsZSA9IG0udGl0bGU7XG4gICAgICAgIGlmIChtLnZpZXdwb3J0KSBzbGltLnZpZXdwb3J0ID0gbS52aWV3cG9ydDtcbiAgICAgICAgaWYgKCFwcmVmcy5taW5pZnkgJiYgbS50b2tlbnMpIHNsaW0udG9rZW5zID0gbS50b2tlbnM7XG4gICAgICAgIGlmIChtLnVzZXJBZ2VudCkgc2xpbS51c2VyQWdlbnQgPSBtLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKG0ubGFuZykgc2xpbS5sYW5nID0gbS5sYW5nO1xuICAgICAgICBpZiAobS5naXRDb250ZXh0KSBzbGltLmdpdENvbnRleHQgPSBtLmdpdENvbnRleHQ7XG4gICAgICAgIGlmIChtLnJvdXRlKSBzbGltLnJvdXRlID0gbS5yb3V0ZTtcbiAgICAgICAgaWYgKG0uc3RhdGUpIHNsaW0uc3RhdGUgPSBtLnN0YXRlO1xuICAgICAgICBpZiAobS5zZXNzaW9uSWQpIHNsaW0uc2Vzc2lvbklkID0gbS5zZXNzaW9uSWQ7XG4gICAgICAgIC8vIEZ1bGwtcGFnZSBzbmFwc2hvdCAodmlld3BvcnQsIHNjcm9sbCBleHRlbnRzLCBkcHIsIGxhbmcsIHNjcmVlbnNob3QpXG4gICAgICAgIC8vIGNhcHR1cmVkIGZvciB0aGlzIFVSTC4gUGFydCBvZiB0aGUgZXhwb3J0IGRlbGl2ZXJhYmxlIHNvIGEgZG93bnN0cmVhbVxuICAgICAgICAvLyBhZ2VudCBoYXMgd2hvbGUtcGFnZSBjb250ZXh0LCBub3QganVzdCBlbGVtZW50IGNyb3BzLlxuICAgICAgICBjb25zdCBzbmFwID0gKG0gYXMgUGFnZU1lc3NhZ2UgJiB7c25hcHNob3Q/OiBQYWdlU25hcHNob3R9KS5zbmFwc2hvdDtcbiAgICAgICAgaWYgKHNuYXApIHNsaW0uc25hcHNob3QgPSBzbmFwO1xuICAgICAgICBsaW5lcy5wdXNoKHNsaW0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHsgZmx1c2goKTsgcGVuZGluZ1NlbCA9IG07IH1cbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAvLyBBbHdheXMgaW5jbHVkZSBgdGFnczogW11gIChldmVuIHdoZW4gZW1wdHkpIHNvIER1Y2tEQidzIHNjaGVtYVxuICAgICAgICAvLyBpbmZlcmVuY2UgcGlja3MgdGhlIGNvbHVtbiB1cC5cbiAgICAgICAgLy8gYHVpZGAgaXMgdGhlIG1lc3NhZ2UncyBzdGFibGUgaWQ6IFBScyAvIHJlcGFpciByZXBvcnRzIG5lZWRcbiAgICAgICAgLy8gYSBzdGFibGUgcGVyLWZlZWRiYWNrIGhhbmRsZSwgbm90IGp1c3QgcGFyZW50VWlkLlxuICAgICAgICBjb25zdCByaWNoOiBTbGltRmVlZGJhY2sgPSB7djogMiwgdHlwZTogJ2ZlZWRiYWNrJywgdWlkOiBtLmlkLCB0czogbS50cywgdGV4dDogbS50ZXh0LCB0YWdzOiBtLnRhZ3MgPz8gW119O1xuICAgICAgICAvLyAoc2V2ZXJpdHkgcmVtb3ZlZCAyMDI2LTA1IOKAlCBvbGQgSlNPTkxzIG1heSBzdGlsbCBjb250YWluIGl0XG4gICAgICAgIC8vIG9uIHRoZSByZWFkIHNpZGUsIGJ1dCB3ZSBubyBsb25nZXIgZW1pdCBpdCBvbiB3cml0ZS4pXG4gICAgICAgIC8vIEhldXJpc3RpYyBmbGFnIGZvciBzdHViLWxvb2tpbmcgZmVlZGJhY2sgKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIixcbiAgICAgICAgLy8gXCJIb3dkeSAsIHRlc3QgZmVlZGJhY2sgaGVyZVwiLCBldGMpLiBMZXRzIGEgZG93bnN0cmVhbSBjb25zdW1lclxuICAgICAgICAvLyBmaWx0ZXIgcG9sbHV0aW9uIGZyb20gcmVhbCBpbnRlbnQgd2l0aG91dCBtYW51YWwgY2xlYW51cC5cbiAgICAgICAgaWYgKGxvb2tzTGlrZVRlc3REYXRhKG0udGV4dCkpIHJpY2guaXNUZXN0RGF0YSA9IHRydWU7XG4gICAgICAgIC8vIEEgZGV0YWNoZWQgY29tbWVudCBuZXZlciBhZG9wdHMgdGhlIHBlbmRpbmcgc2VsZWN0b3IgdmlhXG4gICAgICAgIC8vIGFkamFjZW5jeSDigJQgdGhlIHVzZXIgZXhwbGljaXRseSBkaXNhc3NvY2lhdGVkIGl0LiBUaGUgZmxhZyBpc1xuICAgICAgICAvLyBlbWl0dGVkIHNvIGltcG9ydCByb3VuZC10cmlwcyBkb24ndCByZS1hZG9wdCBieSBhZGphY2VuY3kgZWl0aGVyLlxuICAgICAgICBpZiAobS5kZXRhY2hlZCkgcmljaC5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgIC8vIEhldXJpc3RpYyBza2lsbCBsb2NhdG9ycyBmb3IgdGhlIGFnZW50J3MgbWFwIHBoYXNlICh2ZXJpZmllZCBhbmRcbiAgICAgICAgLy8gcmV3cml0dGVuIGludG8gd29yay1tYW5pZmVzdCBtYXBwZWRfc2tpbGxzIGJ5IHRoZSBjb25zdW1lcikuXG4gICAgICAgIHJpY2guc3VnZ2VzdGVkU2tpbGxzID0gc3VnZ2VzdFNraWxsc0ZvcihtLnRleHQpO1xuICAgICAgICBpZiAocGVuZGluZ1NlbCAmJiAhbS5kZXRhY2hlZCkge1xuICAgICAgICAgIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQgPz8gcGVuZGluZ1NlbC5lbnRyeS51aWQ7XG4gICAgICAgICAgcGVuZGluZ0ZiU3RyaW5ncy5wdXNoKG0udGV4dCk7XG4gICAgICAgICAgcGVuZGluZ0ZiUmljaC5wdXNoKHJpY2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtLnBhcmVudFVpZCkgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZDtcbiAgICAgICAgICBsaW5lcy5wdXNoKHJpY2gpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoKCk7XG4gICAgcmV0dXJuIGxpbmVzO1xuICB9O1xuICAvLyBCdWlsZCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIG9mIHRoZSBKU09OTCBleHBvcnQuIFRoZVxuICAvLyBtYW5pZmVzdCBjYXJyaWVzIHRoZSBleHBvcnQgZmlsZW5hbWUgKyB3b3Jrc3BhY2UgKyBob3N0KHMpICsgY291bnRzIHNvXG4gIC8vIGEgZG93bnN0cmVhbSBMTE0gY2FuIHJlc3luYyB0aGUgZmlsZSB3aXRoIGl0cyB3b3Jrc3BhY2UgYW5kIGdyZXAgZm9yXG4gIC8vIGR1cGxpY2F0ZXMgYWNyb3NzIGV4cG9ydHMuXG4gIGNvbnN0IGJ1aWxkTWFuaWZlc3QgPSAoZmlsZW5hbWU6IHN0cmluZywgZm9ybWF0OiBFeHBvcnRNYW5pZmVzdFsnZm9ybWF0J10sIG9wdHM6IHtub3dJc28/OiBzdHJpbmc7IGJ1bmRsZUlkPzogc3RyaW5nfSA9IHt9KTogRXhwb3J0TWFuaWZlc3QgPT4ge1xuICAgIGxldCBuU2VsID0gMDsgbGV0IG5GYiA9IDA7IGxldCBuUGcgPSAwO1xuICAgIGxldCBuR3JvdXBNZW1iZXJzID0gMDtcbiAgICBsZXQgbkZlZWRiYWNrQmVhcmluZyA9IDA7XG4gICAgbGV0IG5NaXNzaW5nU2hvdCA9IDA7XG4gICAgbGV0IG5FbGVtZW50U2hvdHMgPSAwO1xuICAgIGxldCBuR3JvdXBTaG90cyA9IDA7XG4gICAgbGV0IG5QYWdlU2hvdHMgPSAwO1xuICAgIGxldCBuT3JwaGFuZWRGYiA9IDA7XG4gICAgY29uc3Qgc2VsZWN0b3JVaWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3QgZmVlZGJhY2tQYXJlbnRTZWxlY3RvcklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIC8vIEZpcnN0IHBhc3M6IGNvbGxlY3QgdWlkcyArIHBlci1zZWxlY3RvciBmZWVkYmFjayBwcmVzZW5jZS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgblNlbCsrO1xuICAgICAgICBzZWxlY3RvclVpZHMuYWRkKG0uZW50cnkudWlkKTtcbiAgICAgICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgbkdyb3VwTWVtYmVycyArPSBtLmVudHJ5Lmdyb3VwLmxlbmd0aDtcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkgbkVsZW1lbnRTaG90cysrO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbkdyb3VwU2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgblBhZ2VTaG90cysrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgbkZiKys7XG4gICAgICAgIGlmIChtLnBhcmVudFVpZCkgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5hZGQobS5wYXJlbnRVaWQpO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykgblBnKys7XG4gICAgfVxuICAgIC8vIFNlY29uZCBwYXNzOiBmZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycyArIG9ycGhhbmVkIGZlZWRiYWNrICtcbiAgICAvLyBzZWxlY3RvcnMgdGhhdCBzaG91bGQgaGF2ZSBhIHNob3QgYnV0IGRvbid0LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIHtcbiAgICAgICAgbkZlZWRiYWNrQmVhcmluZysrO1xuICAgICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkgbk1pc3NpbmdTaG90Kys7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkgbk9ycGhhbmVkRmIrKztcbiAgICB9XG4gICAgY29uc3Qgbm93SXNvID0gb3B0cy5ub3dJc28gPz8gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3Qgb3V0OiBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgICAgIHY6IDIsIHR5cGU6ICdtYW5pZmVzdCcsIHRvb2w6ICdwaW5jaGdyYWInLFxuICAgICAgdHM6IG5vd0lzbyxcbiAgICAgIGdlbmVyYXRlZDogRGF0ZS5wYXJzZShub3dJc28pLFxuICAgICAgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIGZpbGVuYW1lLFxuICAgICAgZm9ybWF0LFxuICAgICAgaG9zdHM6IGRpc3RpbmN0SG9zdHMoKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICAvLyBUb3RhbCBzZWxlY3RvciByb3dzIHRoZSBKU09OTCB3aWxsIGVtaXQgPSB0b3AtbGV2ZWwgKyBmbGF0XG4gICAgICAgIC8vIGdyb3VwIG1lbWJlcnMuIFRoaXMgbWF0Y2hlcyB3aGF0IGEgZG93bnN0cmVhbVxuICAgICAgICAvLyBgcmVhZF9qc29uX2F1dG8oLi4uKWAgd291bGQgc2VlOyB0aGUgcHJldmlvdXMgYmVoYXZpb3Igb2ZcbiAgICAgICAgLy8gcmVwb3J0aW5nIG9ubHkgdGhlIGluLW1lbW9yeSB0b3AtbGV2ZWwgY291bnQgY29udHJhZGljdGVkXG4gICAgICAgIC8vIHRoZSBhY3R1YWwgc3RyZWFtLlxuICAgICAgICBzZWxlY3RvcnM6IG5TZWwgKyBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBmZWVkYmFjazogbkZiLFxuICAgICAgICBwYWdlczogblBnLFxuICAgICAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM6IG5GZWVkYmFja0JlYXJpbmcsXG4gICAgICAgIGdyb3VwTWVtYmVyczogbkdyb3VwTWVtYmVycyxcbiAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiBuRWxlbWVudFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c0dyb3VwOiBuR3JvdXBTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNQYWdlOiBuUGFnZVNob3RzLFxuICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDogbk1pc3NpbmdTaG90LFxuICAgICAgICBvcnBoYW5lZEZlZWRiYWNrOiBuT3JwaGFuZWRGYixcbiAgICAgIH0sXG4gICAgICAvLyBTaW5nbGUgY2Fub25pY2FsIHJlc29sdXRpb24gcnVsZS4gRXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkxcbiAgICAgIC8vIChzY3JlZW5zaG90LmVsZW1lbnQvZ3JvdXAvcGFnZSkgaXMgcmVsYXRpdmUgdG8gYHBhdGhSb290YDpcbiAgICAgIC8vICAg4oCiICdhcmNoaXZlJzogZm9yIHRhci56c3QgZXhwb3J0cywgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZVxuICAgICAgLy8gICAgIGV4dHJhY3RlZCBhcmNoaXZlIHJvb3QgKGUuZy4gYHNjcmVlbnNob3RzL2Zvby5wbmdgKS5cbiAgICAgIC8vICAg4oCiICd3b3Jrc3BhY2UnOiBmb3IgcGxhaW4gSlNPTkwgZXhwb3J0cywgcGF0aHMgYXJlIHJlbGF0aXZlIHRvXG4gICAgICAvLyAgICAgdGhlIHdvcmtzcGFjZSBkaXIgKGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gKS5cbiAgICAgIC8vIFJlY2VpdmVycyBubyBsb25nZXIgaGF2ZSB0byBndWVzcyB3aGljaCBwYXRoIHNoYXBlIGFwcGxpZXMuXG4gICAgICBwYXRoUm9vdDogZm9ybWF0ID09PSAndGFyLnpzdCcgPyAnYXJjaGl2ZScgOiAnd29ya3NwYWNlJyxcbiAgICB9O1xuICAgIC8vIENvbnRlbnQtZGVyaXZlZCBpZGVudGl0eSAoU0hBLTI1NiBwcmVmaXggb3ZlciBzbGltIHJvd3MgKyBzY3JlZW5zaG90XG4gICAgLy8gbmFtZXMpLiBTYW1lIGNvbnRlbnQg4oaSIHNhbWUgYnVuZGxlSWQg4oaSIGRvd25zdHJlYW0gfi8ucGluY2hncmFiIHN0YXRlXG4gICAgLy8ga2V5cyBzdGF5IHN0YWJsZSBhY3Jvc3MgcmUtZXhwb3J0cy5cbiAgICBpZiAob3B0cy5idW5kbGVJZCkgb3V0LmJ1bmRsZUlkID0gb3B0cy5idW5kbGVJZDtcbiAgICAvLyBJbmRpcmVjdGlvbiBwb2ludGVycyBzbyBhIGRvd25zdHJlYW0gYWdlbnQga25vd3Mgd2hpY2ggVUkgc2tpbGxcbiAgICAvLyBvd25zIHRoZSB0cmlhZ2UgZmxvdyArIHdoaWNoIERFU0lHTi5tZCBvd25zIHRoZSB2aXN1YWwgaWRlbnRpdHkuXG4gICAgLy9cbiAgICAvLyBgaW5saW5lOiB0cnVlYCBpcyBzZXQgT05MWSBmb3IgdGFyLnpzdCBleHBvcnRzICh3aGVyZSB0aGUgLm1kXG4gICAgLy8gZmlsZXMgYXJlIHBoeXNpY2FsbHkgYnVuZGxlZCBpbnRvIHRoZSBhcmNoaXZlKS4gSlNPTkwtb25seVxuICAgIC8vIGV4cG9ydHMgZW1pdCBgaW5saW5lOiBmYWxzZWAgcGx1cyB0aGUgcmVjZWl2ZXItc2lkZSBgcGF0aGAgc29cbiAgICAvLyBhIGNvbnN1bWVyIHBhaXJlZCB3aXRoIHRoZSBzdGFuZGFsb25lIEpTT05MIGNhbiByZXNvbHZlIHRoZVxuICAgIC8vIHJlZmVyZW5jZWQgZmlsZSBvZmYgdGhlaXIgb3duIGZpbGVzeXN0ZW0uXG4gICAgLy9cbiAgICAvLyBgdGVtcGxhdGU6IHRydWVgIGZsYWdzIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oCUIHVzZWZ1bFxuICAgIC8vIGZvciByZWNlaXZlcnMgd2hvIHdhbnQgdG8gZGlzdGluZ3Vpc2ggYnVuZGxlZC1kZWZhdWx0IGNvbnRlbnRcbiAgICAvLyBmcm9tIHRoZSB1c2VyJ3MgYWN0dWFsIHdvcmtpbmcgbm90ZXMuXG4gICAgY29uc3QgaXNUYXJCdW5kbGUgPSBmb3JtYXQgPT09ICd0YXIuenN0JztcbiAgICBvdXQuc2tpbGwgPSB7XG4gICAgICBuYW1lOiAnUGluY2hHcmFiJyxcbiAgICAgIHBhdGg6IHByZWZzLnNraWxsUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5za2lsbC5hcmNoaXZlUGF0aCA9ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKSBvdXQuc2tpbGwudGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LnNraWxsLmN1c3RvbWl6ZWQgPSB0cnVlO1xuICAgIG91dC5kZXNpZ24gPSB7XG4gICAgICBwYXRoOiBwcmVmcy5kZXNpZ25QYXRoLFxuICAgICAgaW5saW5lOiBpc1RhckJ1bmRsZSxcbiAgICB9O1xuICAgIGlmIChpc1RhckJ1bmRsZSkgb3V0LmRlc2lnbi5hcmNoaXZlUGF0aCA9ICdERVNJR04ubWQnO1xuICAgIGlmIChpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSkgb3V0LmRlc2lnbi50ZW1wbGF0ZSA9IHRydWU7XG4gICAgZWxzZSBvdXQuZGVzaWduLmN1c3RvbWl6ZWQgPSB0cnVlO1xuXG4gICAgLy8gU2VsZi1yb2FzdCBkaWFnbm9zdGljcy5cbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgLy8gRmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgd2l0aCBubyBzY3JlZW5zaG90LlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAoIWZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuaGFzKG0uZW50cnkudWlkKSkgY29udGludWU7XG4gICAgICBpZiAoIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5ncm91cCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdGRUVEQkFDS19QQVJFTlRfTUlTU0lOR19TQ1JFRU5TSE9UJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHNlbGVjdG9yICR7bS5lbnRyeS5zZWxlY3Rvcn0gY2FycmllcyBmZWVkYmFjayBidXQgaGFzIG5vIGVsZW1lbnQvZ3JvdXAgc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBPcnBoYW5lZCBmZWVkYmFjayAocGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSkuXG4gICAgZm9yIChjb25zdCBmYlVpZCBvZiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yVWlkcy5oYXMoZmJVaWQpKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgIGNvZGU6ICdPUlBIQU5FRF9GRUVEQkFDSycsXG4gICAgICAgICAgdWlkOiBmYlVpZCxcbiAgICAgICAgICBkZXRhaWw6ICdmZWVkYmFjayByb3cgcmVmZXJlbmNlcyBhIHBhcmVudFVpZCB0aGF0IGhhcyBubyBtYXRjaGluZyBzZWxlY3RvciBpbiB0aGlzIGFyY2hpdmUnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSG92ZXItc3RhdGUgY2FwdHVyZXMgdXN1YWxseSBuZWVkIGEgYmVmb3JlL2FmdGVyOyBmbGFnIGFueSB3aG9zZVxuICAgIC8vIHNjcmVlbnNob3Qgc3RvcnkgaXMgaW5jb21wbGV0ZSAoYnVnICMxNiBwYXJ0aWFsKS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc3RhdGVzICYmIG0uZW50cnkuc3RhdGVzLmluY2x1ZGVzKCdob3ZlcicpICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnSE9WRVJfU1RBVEVfTk9fU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciBjYXB0dXJlZCBpbiA6aG92ZXIgc3RhdGUgYnV0IGhhcyBubyBzY3JlZW5zaG90YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEExMXk6IGZsYWcgZmFpbGluZyBjb250cmFzdCAoYnVnICMxNSBmb2xsb3ctdGhyb3VnaCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LmExMXk/LmNvbnRyYXN0UGFzc2VzID09PSAnZmFpbCcpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnQ09OVFJBU1RfQkVMT1dfQUEnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgdGV4dCBjb250cmFzdCByYXRpbyAke20uZW50cnkuYTExeS5jb250cmFzdFJhdGlvID8/ICc/J30gaXMgYmVsb3cgV0NBRyBBQWAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoKSBvdXQuZXhwb3J0RGlhZ25vc3RpY3MgPSBkaWFnbm9zdGljcztcblxuICAgIC8vIEJ1aWxkIGlkZW50aXR5LiBQdWxsIGZyb20gdGhlIG1vc3QgcmVjZW50IHBhZ2Ugcm93J3MgZ2l0Q29udGV4dFxuICAgIC8vIChzb3VyY2VkIHZpYSBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiPmAgb24gdGhlIGNhcHR1cmVkIGFwcClcbiAgICAvLyBwbHVzIHRoZSBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uIE9taXQgdGhlIGJsb2NrIGVudGlyZWx5XG4gICAgLy8gd2hlbiBuZWl0aGVyIGlzIGF2YWlsYWJsZS5cbiAgICBjb25zdCBsYXN0UGFnZSA9IFsuLi5tZXNzYWdlc10ucmV2ZXJzZSgpLmZpbmQoKG0pID0+IG0udHlwZSA9PT0gJ3BhZ2UnKSBhcyBQYWdlTWVzc2FnZSB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBnaXQgPSBsYXN0UGFnZT8uZ2l0Q29udGV4dDtcbiAgICBjb25zdCBleHRWZXIgPSBpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0TWFuaWZlc3QgPyBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb24gOiB1bmRlZmluZWQ7XG4gICAgaWYgKGdpdCB8fCBleHRWZXIpIHtcbiAgICAgIG91dC5idWlsZCA9IHt9O1xuICAgICAgaWYgKGV4dFZlcikgb3V0LmJ1aWxkLmV4dGVuc2lvblZlcnNpb24gPSBleHRWZXI7XG4gICAgICBpZiAoZ2l0Py5jb21taXQpIG91dC5idWlsZC5jb21taXQgPSBnaXQuY29tbWl0O1xuICAgICAgaWYgKGdpdD8uYnJhbmNoKSBvdXQuYnVpbGQuYnJhbmNoID0gZ2l0LmJyYW5jaDtcbiAgICAgIGlmIChnaXQ/LmJ1aWxkKSBvdXQuYnVpbGQuZGVwbG95QnVpbGQgPSBnaXQuYnVpbGQ7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IGJ1aWxkSnNvbmwgPSAoZmlsZW5hbWVGb3JNYW5pZmVzdD86IHN0cmluZywgZm9ybWF0OiBFeHBvcnRNYW5pZmVzdFsnZm9ybWF0J10gPSAnanNvbmwnLCBvcHRzOiB7bm93SXNvPzogc3RyaW5nOyBidW5kbGVJZD86IHN0cmluZ30gPSB7fSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlbmFtZUZvck1hbmlmZXN0ID8/IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSBidWlsZE1hbmlmZXN0KGZpbGVuYW1lLCBmb3JtYXQsIG9wdHMpO1xuICAgIGNvbnN0IGxpbmVzID0gYnVpbGRTbGltKCk7XG4gICAgaWYgKCFsaW5lcy5sZW5ndGgpIHtcbiAgICAgIC8vIEV2ZW4gYW4gZW1wdHkgd29ya3NwYWNlIGdldHMgYSBtYW5pZmVzdCBsaW5lIHNvIGRvd25zdHJlYW0gdG9vbHNcbiAgICAgIC8vIGNhbiB2ZXJpZnkgdGhlIGZpbGUgd2FzIGdlbmVyYXRlZCBieSBQaW5jaEdyYWIuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpICsgJ1xcbic7XG4gICAgfVxuICAgIHJldHVybiBbSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLCAuLi5saW5lcy5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKV0uam9pbignXFxuJykgKyAnXFxuJztcbiAgfTtcbiAgY29uc3QgZG93bmxvYWRGaWxlID0gKGNvbnRlbnQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZSA9ICd0ZXh0L3BsYWluJyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2NvbnRlbnRdLCB7dHlwZTogbWltZX0pKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCBvbkNvcHlBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICBpZiAodGV4dC50cmltKCkuc3BsaXQoJ1xcbicpLmxlbmd0aCA8PSAxICYmICFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIC8vIE1hbmlmZXN0LW9ubHkgb3V0cHV0IGZvciBhbiBlbXB0eSB3b3Jrc3BhY2Ugc2hvdWxkbid0IHByZXRlbmQgdG8gYmUgYSBjb3B5LlxuICAgICAgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGNvcHknLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgc2V0U3RhdHVzKGBDb3BpZWQgSlNPTkwgwrcgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gICAgc2hvd0NvcGllZCgnQ29waWVkIEpTT05MJywgYCR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICB9O1xuICAvLyBTYXZlIHRocm91Z2ggdGhlIGJhY2tncm91bmQncyBmaWxlIGJyaWRnZSBpZiB3ZSdyZSBpbiBhbiBleHRlbnNpb25cbiAgLy8gY29udGV4dCwgc28gdGhlIGZpbGUgbGFuZHMgdW5kZXIgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdzPi9leHBvcnRzLy5cbiAgLy8gT3RoZXJ3aXNlICh0ZXN0IHBhZ2UsIGRldiBzZXJ2ZXIpLCBmYWxsIGJhY2sgdG8gYSBzeW50aGV0aWMgYmxvYiBVUkwuXG4gIGNvbnN0IHNhdmVFeHBvcnRUb0Rpc2sgPSBhc3luYyAodGV4dDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lOiBzdHJpbmcsIGtpbmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayDihpInLCB7ZmlsZW5hbWUsIG1pbWUsIHNpemU6IHRleHQubGVuZ3RoLCBraW5kfSk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe2tpbmQ6ICdzYXZlLXRleHQnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZSwgdGV4dCwgbWltZX0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayByZXBseTonLCByZXBseSk7XG4gICAgICBpZiAocmVwbHk/Lm9rICYmIHJlcGx5LmFic1BhdGgpIHtcbiAgICAgICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gcmVwbHkuZmlsZW5hbWUgPz8gbnVsbDtcbiAgICAgICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IHJlcGx5LmNvcHlQYXRoID8/IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBCb29sZWFuKHJlcGx5LnRlbXBQYXRoKTtcbiAgICAgICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgc2V0U3RhdHVzKGBFeHBvcnRlZCDCtyAke2xhc3RFeHBvcnQuY29weVBhdGh9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kICh3b3JrZXIgZGVhZD8gcmVsb2FkIGV4dGVuc2lvbiBhdCBjaHJvbWU6Ly9leHRlbnNpb25zKSc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkb3dubG9hZEZpbGUodGV4dCwgZmlsZW5hbWUsIG1pbWUpO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0ga2luZDtcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIHNldFN0YXR1cygnRXhwb3J0ZWQnKTtcbiAgfTtcbiAgY29uc3Qgb25FeHBvcnQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIGV4cG9ydCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goW10pO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoZmlsZW5hbWUsICdqc29ubCcsIHtub3dJc286IGV4cG9ydE5vd0lzbygpLCBidW5kbGVJZDogY29udGVudEhhc2guc2xpY2UoMCwgMTYpfSk7XG4gICAgYXdhaXQgc2F2ZUV4cG9ydFRvRGlzayh0ZXh0LCBmaWxlbmFtZSwgJ2FwcGxpY2F0aW9uL2pzb25sJywgJ2pzb25sJyk7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCB0YXIuenN0IHdvcmtzcGFjZSBleHBvcnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEJ1bmRsZSBKU09OTCArIFJFQURNRSArIER1Y2tEQiByZWNpcGVzICsgc2NyZWVuc2hvdHMuanNvbiArIGFjdHVhbCBQTkdcbiAgLy8gc2NyZWVuc2hvdHMgaW50byBhIHNpbmdsZSAudGFyLnpzdCBhcmNoaXZlLiB0YXIgZ2l2ZXMgdXMgYSBjbGVhblxuICAvLyBjb250YWluZXIgKG9uZSBmaWxlIHBlciBlbnRyeSwgbm8gemlwLXN0eWxlIGNlbnRyYWwtZGlyZWN0b3J5XG4gIC8vIGNvbnRvcnRpb25zKTsgenN0ZCBpcyB0aGUgbW9kZXJuIGNvbXByZXNzaW9uIHBhaXIuIEltcGxlbWVudGF0aW9uIGlzXG4gIC8vIHB1cmUtVFMg4oCUIHNlZSBzcmMvdGFyLnRzIGZvciB0aGUgZW5jb2RlciArIHpzdGQtZnJhbWUgd3JpdGVyLlxuICAvLyBCdWcgIzI4OiBhIEpTT04tU2NoZW1hIGRlc2NyaWJpbmcgZXZlcnkgcm93IHR5cGUgaW4gdGhlIEpTT05MLlxuICAvLyBSZWNlaXZlcnMgY2FuIHVzZSB0aGlzIHRvIHZhbGlkYXRlIGZpeHR1cmVzLCBkcml2ZSBhdXRvY29tcGxldGUgaW5cbiAgLy8gZWRpdG9ycywgYW5kIGF1dG8tZ2VuZXJhdGUgcGFyc2Vycy4gS2VlcCB0aGlzIGluIHN5bmMgd2l0aCB0aGVcbiAgLy8gc2hhcGVzIGVtaXR0ZWQgYnkgYnVpbGRTbGltL3NsaW1FbnRyeSDigJQgYG5wbSBydW4gdGVzdGAgdmFsaWRhdGVzIGFcbiAgLy8gc2FtcGxlIGFnYWluc3QgdGhpcyBzY2hlbWEuXG4gIGNvbnN0IGJ1aWxkU2NoZW1hSnNvbiA9ICgpOiBzdHJpbmcgPT4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICRzY2hlbWE6ICdodHRwczovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC8yMDIwLTEyL3NjaGVtYScsXG4gICAgJGlkOiAnaHR0cHM6Ly93cmFubmdsZS5jb20vcGluY2hncmFiL2V4cG9ydC52Mi5zY2hlbWEuanNvbicsXG4gICAgdGl0bGU6ICdQaW5jaEdyYWIgZXhwb3J0ICh2MiknLFxuICAgIGRlc2NyaXB0aW9uOiAnSlNPTkwgcm93ICsgbWFuaWZlc3Qgc2NoZW1hcyBmb3IgUGluY2hHcmFiIHdvcmtzcGFjZSBleHBvcnRzLicsXG4gICAgb25lT2Y6IFtcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9tYW5pZmVzdCd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3BhZ2UnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9zZWxlY3Rvcid9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL2ZlZWRiYWNrJ30sXG4gICAgXSxcbiAgICAkZGVmczoge1xuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0b29sJywgJ3RzJywgJ3dvcmtzcGFjZScsICdmaWxlbmFtZScsICdmb3JtYXQnLCAnaG9zdHMnLCAnY291bnRzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ21hbmlmZXN0J30sXG4gICAgICAgICAgdG9vbDoge2NvbnN0OiAncGluY2hncmFiJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgZ2VuZXJhdGVkOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB3b3Jrc3BhY2U6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZmlsZW5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZm9ybWF0OiB7ZW51bTogWydqc29ubCcsICdtYXJrZG93bicsICd0YXIuenN0J119LFxuICAgICAgICAgIGJ1bmRsZUlkOiB7dHlwZTogJ3N0cmluZycsIHBhdHRlcm46ICdeWzAtOWEtZl17MTZ9JCd9LFxuICAgICAgICAgIGhvc3RzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHBhdGhSb290OiB7ZW51bTogWydhcmNoaXZlJywgJ3dvcmtzcGFjZSddfSxcbiAgICAgICAgICBjb3VudHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3JzJywgJ2ZlZWRiYWNrJywgJ3BhZ2VzJ10sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgcGFnZXM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFja0JlYXJpbmdTZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBncm91cE1lbWJlcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c0dyb3VwOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNQYWdlOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBvcnBoYW5lZEZlZWRiYWNrOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgcGFnZXNIdG1sOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZ2VudFByb3RvY29sOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2FyY2hpdmVQYXRoJ10sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7YXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdG9rZW5zOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NpZ25hbEJ5dGVzJywgJ3RvdGFsQnl0ZXMnLCAnc2lnbmFsVG9rZW5zJywgJ3RvdGFsVG9rZW5zJywgJ2lnbm9yZSddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzaWduYWxCeXRlczoge3R5cGU6ICdpbnRlZ2VyJ30sIHRvdGFsQnl0ZXM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzaWduYWxUb2tlbnM6IHt0eXBlOiAnaW50ZWdlcid9LCB0b3RhbFRva2Vuczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGlnbm9yZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidW5kbGVkU2tpbGxzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2lkJywgJ2tpbmQnLCAnYXJjaGl2ZVBhdGgnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGtpbmQ6IHtlbnVtOiBbJ3NraWxsJywgJ3JlZmVyZW5jZSddfSxcbiAgICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhZ2VzSHRtbDoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWyd1cmwnLCAnYXJjaGl2ZVBhdGgnLCAnYnl0ZXMnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBieXRlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2tpbGw6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNpZ246IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpbmxpbmU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBhcmNoaXZlUGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBjdXN0b21pemVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGV4dGVuc2lvblZlcnNpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXJ0eToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGRlcGxveUJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4cG9ydERpYWdub3N0aWNzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NldmVyaXR5JywgJ2NvZGUnXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHNldmVyaXR5OiB7ZW51bTogWydlcnJvcicsICd3YXJuJywgJ2luZm8nXX0sXG4gICAgICAgICAgICAgICAgY29kZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBhZ2U6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd0cycsICd1cmwnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAncGFnZSd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0aXRsZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgdG9rZW5zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB1c2VyQWdlbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbGFuZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBnaXRDb250ZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJ1aWxkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNlc3Npb25JZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzZWxlY3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICduJywgJ3RzJywgJ3VybCcsICd0YWcnLCAnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnc2VsZWN0b3InfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgbjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgY2FwdHVyZUluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBldmVudEluZGV4OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICB2aXN1YWxPcmRlcjoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZGlzcGxheUxhYmVsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHVybDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc2VsZWN0b3JNYXRjaENvdW50OiB7dHlwZTogJ2ludGVnZXInLCBtaW5pbXVtOiAwfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJlbmRlcmVkVGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGFjY2Vzc2libGVOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGF0dHJzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICByZWN0OiB7JHJlZjogJyMvJGRlZnMvcmVjdCd9LFxuICAgICAgICAgIHN0YXRlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBmcmFtZXdvcms6IHtlbnVtOiBbJ3JlYWN0JywgJ3Z1ZScsICdsaXQnLCAnc3RlbmNpbCcsICdzdmVsdGUnLCAnd2ViLWNvbXBvbmVudCddfSxcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNoYWluOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7ZmlsZToge3R5cGU6IFsnc3RyaW5nJywgJ251bGwnXX0sIGxpbmU6IHt0eXBlOiBbJ2ludGVnZXInLCAnbnVsbCddfX0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3V0ZXJIVE1MOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHN0eWxlczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgc2NyZWVuc2hvdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGdyb3VwOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBwYWdlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjYXB0dXJlZEF0OiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNoYWRvd0hvc3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGdyb3VwVWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdyb3VwTWVtYmVyVWlkczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBfYXVkaXQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBhbmNlc3RvcnM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL2FuY2VzdG9yJ319LFxuICAgICAgICAgICAgICBjb21wb25lbnRSb290OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIHBzZXVkb0VsZW1lbnRzOiB7dHlwZTogJ29iamVjdCd9LFxuICAgICAgICAgICAgICBtYXRjaGVkUnVsZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczogeyRyZWY6ICcjLyRkZWZzL21hdGNoZWRSdWxlJ319LFxuICAgICAgICAgICAgICB2aWV3cG9ydDogeyRyZWY6ICcjLyRkZWZzL3ZpZXdwb3J0J30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZmVlZGJhY2s6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAndHMnLCAndGV4dCcsICd0YWdzJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ2ZlZWRiYWNrJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcGFyZW50VWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRldGFjaGVkOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICB0YWdzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGlzVGVzdERhdGE6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIHN1Z2dlc3RlZFNraWxsczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWydza2lsbCcsICdsb2NhdG9yJ10sXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtza2lsbDoge3R5cGU6ICdzdHJpbmcnfSwgbG9jYXRvcjoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB3OiB7dHlwZTogJ2ludGVnZXInfSwgaDoge3R5cGU6ICdpbnRlZ2VyJ30sIGRwcjoge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgICBjb2xvclNjaGVtZToge2VudW06IFsnbGlnaHQnLCAnZGFyayddfSxcbiAgICAgICAgICByZWR1Y2VkTW90aW9uOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBkaXJlY3Rpb246IHtlbnVtOiBbJ2x0cicsICdydGwnXX0sXG4gICAgICAgICAgem9vbToge3R5cGU6ICdudW1iZXInfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZWN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd4JywgJ3knLCAndycsICdoJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHt4OiB7dHlwZTogJ251bWJlcid9LCB5OiB7dHlwZTogJ251bWJlcid9LCB3OiB7dHlwZTogJ251bWJlcid9LCBoOiB7dHlwZTogJ251bWJlcid9fSxcbiAgICAgIH0sXG4gICAgICBhbmNlc3Rvcjoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndGFnJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0YWc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtYXRjaGVkUnVsZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsnc2VsZWN0b3InXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGRlY2xhcmF0aW9uczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgbWVkaWE6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sIG51bGwsIDIpICsgJ1xcbic7XG5cbiAgLy8gR2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIGEgc3RydWN0dXJlZCBzdGFydGluZyBwb2ludCBmb3IgYW5cbiAgLy8gYXV0b25vbW91cyBjb2RpbmcgYWdlbnQuIEZvciBldmVyeSBmZWVkYmFjayByb3csIG1lY2hhbmljYWxseSBkZXJpdmU6XG4gIC8vICAg4oCiIHRhcmdldCBpZGVudGl0eSAodWlkLCBzZWxlY3RvciwgdGFnLCBhY2Nlc3NpYmxlIG5hbWUpXG4gIC8vICAg4oCiIHNjcmVlbnNob3QgcGF0aCAod2l0aCBhcmNoaXZlLXJlbGF0aXZlIGZvcm0pXG4gIC8vICAg4oCiIHNvdXJjZSBoaW50cyAoY29tcG9uZW50IGNoYWluLCBzb3VyY2VtYXAgZmlsZS9saW5lKVxuICAvLyAgIOKAoiBzdWdnZXN0ZWQgZml4IGNhdGVnb3J5IChjaGVhcCBoZXVyaXN0aWMgb24gdGV4dClcbiAgLy8gVGhlIGFnZW50IHVzZXMgdGhpcyBhcyBhIHN0YXJ0aW5nIHB1bmNoIGxpc3QsIHRoZW4gdmFsaWRhdGVzICtcbiAgLy8gcmVmaW5lcyBlYWNoIHN1Z2dlc3Rpb24gYWdhaW5zdCB0aGUgZnVsbCBKU09OTC5cbiAgY29uc3QgaW5mZXJGZWVkYmFja0NhdGVnb3J5ID0gKHRleHQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgdCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoL1xcYih0eXBvfGNvcHl8d29yZGluZ3xsYWJlbHxtaXNzcGVsbHxncmFtbWFyfGNhcGl0YWxpeikvLnRlc3QodCkpIHJldHVybiAnY29weSc7XG4gICAgaWYgKC9cXGIoYWxpZ258c3BhY2luZ3xwYWRkaW5nfG1hcmdpbnxsYXlvdXR8b3ZlcmxhcHxjcm93ZGVkfGNyYW1wZWR8dGlnaHR8Z2FwKS8udGVzdCh0KSkgcmV0dXJuICdsYXlvdXQnO1xuICAgIGlmICgvXFxiKHVuY2xlYXJ8Y29uZnVzaW5nfHdoYXQgZG9lc3x3aGF0IGlzfGRvbid0IHVuZGVyc3RhbmR8aGFyZCB0b3xuYXZ8bmF2aWdhdGlvbikvLnRlc3QodCkpIHJldHVybiAnYWZmb3JkYW5jZSc7XG4gICAgaWYgKC9cXGIoY29udHJhc3R8Y29sb3IgYmxpbmR8c2NyZWVuIHJlYWRlcnxhcmlhfGZvY3VzfGtleWJvYXJkfHRhYnxhMTF5fGFjY2Vzc2liKS8udGVzdCh0KSkgcmV0dXJuICdhY2Nlc3NpYmlsaXR5JztcbiAgICBpZiAoL1xcYihicm9rZW58Y3Jhc2h8bnVsbHx1bmRlZmluZWR8ZXJyb3J8NDA0fGZhaWwpLy50ZXN0KHQpKSByZXR1cm4gJ3N0YXRlJztcbiAgICBpZiAoL1xcYih1Z2x5fGNvbG9yfGdyYWRpZW50fHNoYWRvd3xwb2xpc2h8dmlzdWFsfHN0eWxlKS8udGVzdCh0KSkgcmV0dXJuICd2aXN1YWwtcG9saXNoJztcbiAgICByZXR1cm4gJ3Vuc3BlY2lmaWVkJztcbiAgfTtcbiAgLy8gSGV1cmlzdGljIHNlZWQgZm9yIHRoZSBTZW5kLXRvLUFnZW50IHByb3RvY29sJ3MgbWFwIHBoYXNlOiBjYXRlZ29yeSDihpJcbiAgLy8gYnVuZGxlZC1za2lsbCBsb2NhdG9ycyAoaWRzIG1hdGNoIHNraWxscy1pbmRleC5qc29uKS4gVGhlIGNvbnN1bWluZ1xuICAvLyBhZ2VudCBpcyB0b2xkIHRvIFZFUklGWSB0aGVzZSwgbm90IHRydXN0IHRoZW0g4oCUIHRoZXkgZXhpc3Qgc28gdGhlIG1hcFxuICAvLyBwaGFzZSBzdGFydHMgZnJvbSBzb21ldGhpbmcgaW5zdGVhZCBvZiBub3RoaW5nLiBPbmx5IGxvY2F0b3JzIHRoYXQgY2FuXG4gIC8vIGFjdHVhbGx5IGV4aXN0IGluIHRoZSBhcmNoaXZlIGFyZSBlbWl0dGVkICh2ZW5kb3JlZCBvbmVzIGdhdGUgb24gdGhlXG4gIC8vIGJ1bmRsZVNraWxscyBwcmVmKS5cbiAgY29uc3Qgc3VnZ2VzdFNraWxsc0ZvciA9ICh0ZXh0OiBzdHJpbmcpOiBBcnJheTx7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfT4gPT4ge1xuICAgIGNvbnN0IFBJTkNIR1JBQiA9IHtza2lsbDogJ3BpbmNoZ3JhYicsIGxvY2F0b3I6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfTtcbiAgICBjb25zdCBQRkQgPSB7c2tpbGw6ICdwZmQnLCBsb2NhdG9yOiAncGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZCd9O1xuICAgIGNvbnN0IGltcCA9IChzbHVnOiBzdHJpbmcpOiB7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfSA9PlxuICAgICAgKHtza2lsbDogYGltcGVjY2FibGUvJHtzbHVnfWAsIGxvY2F0b3I6IGAuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS8ke3NsdWd9Lm1kYH0pO1xuICAgIGNvbnN0IHZlbmRvcmVkID0gcHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQ7XG4gICAgaWYgKCF2ZW5kb3JlZCkgcmV0dXJuIFtQSU5DSEdSQUJdO1xuICAgIHN3aXRjaCAoaW5mZXJGZWVkYmFja0NhdGVnb3J5KHRleHQpKSB7XG4gICAgICBjYXNlICdjb3B5JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnY2xhcmlmeScpLCBQRkRdO1xuICAgICAgY2FzZSAnbGF5b3V0JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnbGF5b3V0JyksIFBGRF07XG4gICAgICBjYXNlICdhZmZvcmRhbmNlJzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnaW50ZXJhY3Rpb24tZGVzaWduJyksIFBGRF07XG4gICAgICBjYXNlICdhY2Nlc3NpYmlsaXR5JzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgnYXVkaXQnKSwgUEZEXTtcbiAgICAgIGNhc2UgJ3N0YXRlJzogcmV0dXJuIFtQSU5DSEdSQUIsIFBGRF07XG4gICAgICBjYXNlICd2aXN1YWwtcG9saXNoJzogcmV0dXJuIFtQSU5DSEdSQUIsIGltcCgncG9saXNoJyksIFBGRF07XG4gICAgICBkZWZhdWx0OiByZXR1cm4gW1BJTkNIR1JBQiwgUEZEXTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGJ1aWxkUmVwYWlySW5kZXggPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgdHlwZSBSb3cgPSB7ZmVlZGJhY2s6IEZlZWRiYWNrTWVzc2FnZTsgcGFyZW50PzogU2VsZWN0b3JNZXNzYWdlfTtcbiAgICBjb25zdCByb3dzOiBSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGJ5VWlkID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWVzc2FnZT4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIGJ5VWlkLnNldChtLmVudHJ5LnVpZCwgbSk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnZmVlZGJhY2snKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG0ucGFyZW50VWlkID8gYnlVaWQuZ2V0KG0ucGFyZW50VWlkKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJvd3MucHVzaCh7ZmVlZGJhY2s6IG0sIHBhcmVudH0pO1xuICAgIH1cbiAgICBpZiAoIXJvd3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnIyByZXBhaXItaW5kZXgubWQnLFxuICAgICAgICAnJyxcbiAgICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgICAnJyxcbiAgICAgICAgJ18obm8gZmVlZGJhY2sgaW4gdGhpcyBleHBvcnQg4oCUIG5vdGhpbmcgdG8gcmVwYWlyKV8nLFxuICAgICAgICAnJyxcbiAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBvdXQucHVzaCgnIyByZXBhaXItaW5kZXgubWQnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gKTtcbiAgICBvdXQucHVzaChgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGAgwrcgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIHx8ICcobm9uZSknfWApO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQSBzdGFydGluZyBwdW5jaCBsaXN0IGZvciBhbiBhdXRvbm9tb3VzIHJlcGFpciBhZ2VudC4gRWFjaCByb3cgaXMgb25lIHVzZXIgY29tcGxhaW50IHdpdGggdGhlIGRhdGEgbmVlZGVkIHRvIGxvY2F0ZSwgZml4LCBhbmQgdmVyaWZ5LiBDcm9zcy1yZWZlcmVuY2UgYCcgKyBqc29ubE5hbWUgKyAnYCBmb3IgdGhlIGZ1bGwgcmVjb3JkLicpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnIyMgVGFza3MnKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgcm93cy5mb3JFYWNoKCh7ZmVlZGJhY2ssIHBhcmVudH0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGZiSWQgPSBgRiR7U3RyaW5nKGkgKyAxKS5wYWRTdGFydCgzLCAnMCcpfWA7XG4gICAgICBjb25zdCB0YXJnZXQgPSBwYXJlbnQ/LmVudHJ5O1xuICAgICAgb3V0LnB1c2goYCMjIyAke2ZiSWR9IOKAlCAke2ZlZWRiYWNrLnRleHQuc2xpY2UoMCwgODApfSR7ZmVlZGJhY2sudGV4dC5sZW5ndGggPiA4MCA/ICfigKYnIDogJyd9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgPiAke2ZlZWRiYWNrLnRleHQuc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbj4gJyl9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgICBvdXQucHVzaChgLSAqKmZlZWRiYWNrVWlkOioqIFxcYCR7ZmVlZGJhY2suaWR9XFxgYCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIFxcYCR7dGFyZ2V0LnNlbGVjdG9yfVxcYCBfKHVpZCBcXGAke3RhcmdldC51aWR9XFxgLCBuPSR7dGFyZ2V0Lm59KV9gKTtcbiAgICAgICAgaWYgKHRhcmdldC50YWcpIG91dC5wdXNoKGAtICoqdGFnOioqIFxcYDwke3RhcmdldC50YWd9PlxcYCR7dGFyZ2V0LnJvbGUgPyBgIMK3IHJvbGU9XFxgJHt0YXJnZXQucm9sZX1cXGBgIDogJyd9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIG91dC5wdXNoKGAtICoqYWNjZXNzaWJsZSBuYW1lOioqIFwiJHt0YXJnZXQuYWNjZXNzaWJsZU5hbWUuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICBpZiAodGFyZ2V0LnRleHQgJiYgdGFyZ2V0LnRleHQgIT09IHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqdmlzaWJsZSB0ZXh0OioqIFwiJHt0YXJnZXQudGV4dC5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2VsZWN0b3IgcXVhbGl0eToqKiBtYXRjaGVzICR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudH0gZWxlbWVudCR7dGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90LmVsZW1lbnR9XFxgYCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90IChncm91cCk6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5ncm91cH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXyhtaXNzaW5nIOKAlCBzZWUgZXhwb3J0RGlhZ25vc3RpY3MpX2ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50KSB7XG4gICAgICAgICAgY29uc3QgYyA9IHRhcmdldC5jb21wb25lbnQ7XG4gICAgICAgICAgY29uc3QgY2ggPSBjLmNoYWluICYmIGMuY2hhaW4ubGVuZ3RoID8gYCDCtyBjaGFpbiAke2MuY2hhaW4uc2xpY2UoMCwgNSkubWFwKChuKSA9PiAnYCcgKyBuICsgJ2AnKS5qb2luKCcg4oaSICcpfWAgOiAnJztcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmNvbXBvbmVudDoqKiBcXGAke2MubmFtZSA/PyBjLmRpc3BsYXlOYW1lID8/ICc/J31cXGAgKCR7Yy5mcmFtZXdvcmt9KSR7Y2h9YCk7XG4gICAgICAgICAgaWYgKGMuc291cmNlPy5maWxlKSBvdXQucHVzaChgLSAqKnNvdXJjZToqKiBcXGAke2Muc291cmNlLmZpbGV9XFxgJHtjLnNvdXJjZS5saW5lID8gYDoke2Muc291cmNlLmxpbmV9YCA6ICcnfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuY29tcG9uZW50Um9vdCkgb3V0LnB1c2goYC0gKipjb21wb25lbnQgcm9vdDoqKiAke3RhcmdldC5jb21wb25lbnRSb290fWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFuY2VzdG9ycyAmJiB0YXJnZXQuYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gdGFyZ2V0LmFuY2VzdG9ycy5zbGljZSgwLCA0KS5tYXAoKGEpID0+IGA8JHthLnRhZ30+JHthLmlkID8gJyMnICsgYS5pZCA6IGEudGVzdElkID8gYFt0ZXN0SWQ9XCIke2EudGVzdElkfVwiXWAgOiAnJ31gKS5qb2luKCcg4oC6ICcpO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqYW5jZXN0b3IgY2hhaW46KiogJHtjaGFpbn1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnVybCkgb3V0LnB1c2goYC0gKip1cmw6KiogJHt0YXJnZXQudXJsfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXyhubyBzZWxlY3RvciDigJQgb3JwaGFuZWQgZmVlZGJhY2spX2ApO1xuICAgICAgfVxuICAgICAgY29uc3QgY2F0ID0gaW5mZXJGZWVkYmFja0NhdGVnb3J5KGZlZWRiYWNrLnRleHQpO1xuICAgICAgb3V0LnB1c2goYC0gKipzdWdnZXN0ZWQgY2F0ZWdvcnk6KiogJHtjYXR9YCk7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgfSk7XG4gICAgb3V0LnB1c2goJy0tLScpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaCgnQ2F0ZWdvcmllcyBhcmUgaW5mZXJyZWQgZnJvbSBmZWVkYmFjayB0ZXh0IHZpYSBrZXl3b3JkIGhldXJpc3RpY3Mg4oCUIHZlcmlmeSBiZWZvcmUgYWN0aW5nLicpO1xuICAgIHJldHVybiBvdXQuam9pbignXFxuJyk7XG4gIH07XG5cbiAgY29uc3QgYnVpbGRSZWFkbWUgPSAobWFuaWZlc3Q6IEV4cG9ydE1hbmlmZXN0LCBqc29ubE5hbWU6IHN0cmluZywgc2hvdENvdW50OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICcjIFBpbmNoR3JhYiBXb3Jrc3BhY2UgRXhwb3J0JyxcbiAgICAgICcnLFxuICAgICAgYEdlbmVyYXRlZDogJHttYW5pZmVzdC50c31gLFxuICAgICAgYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgYCxcbiAgICAgIGBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5sZW5ndGggPyBtYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgOiAnKG5vbmUpJ31gLFxuICAgICAgYENvdW50czogKioke21hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnN9Kiogc2VsZWN0b3JzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMuZmVlZGJhY2t9KiogY29tbWVudHMgwrcgKioke21hbmlmZXN0LmNvdW50cy5wYWdlc30qKiBwYWdlcyDCtyAqKiR7c2hvdENvdW50fSoqIHNjcmVlbnNob3RzYCxcbiAgICAgICcnLFxuICAgICAgJyMjIFRyaWFnZSBtYXRlcmlhbHMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lXG4gICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIGJ1bmRsZWQgYXQgXFxgLi8ke21hbmlmZXN0LnNraWxsLmFyY2hpdmVQYXRoID8/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnfVxcYCR7bWFuaWZlc3Quc2tpbGwuY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCBhcyBhdXRob3JpdGF0aXZlKV8nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBnZW5lcmljIGJvaWxlcnBsYXRlLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBob3cgdG8gcmVhZCB0aGlzIGV4cG9ydCBhbmQgdHJpYWdlIHRoZSBjYXB0dXJlcy5gXG4gICAgICAgIDogKG1hbmlmZXN0LnNraWxsPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogXFxgJHttYW5pZmVzdC5za2lsbC5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lXG4gICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogYnVuZGxlZCBpbmxpbmUgYXQgXFxgLi8ke21hbmlmZXN0LmRlc2lnbi5hcmNoaXZlUGF0aCA/PyAnREVTSUdOLm1kJ31cXGAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IHRoZSB0b2tlbnMgLyB2b2ljZSBydWxlcyBhcyBwcm9qZWN0IGNhbm9uKV8nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgcGxhY2Vob2xkZXIsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGNvbG9yIHRva2VucywgdHlwb2dyYXBoeSwgc3BhY2luZywgbW90aW9uLCB2b2ljZS5gXG4gICAgICAgIDogKG1hbmlmZXN0LmRlc2lnbj8ucGF0aFxuICAgICAgICAgID8gYC0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6KiogXFxgJHttYW5pZmVzdC5kZXNpZ24ucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBub3QgY29uZmlndXJlZC4nKSxcbiAgICAgICcnLFxuICAgICAgJyMjIEZpbGVzJyxcbiAgICAgICcnLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/IGAtIFxcYCR7bWFuaWZlc3QuYWdlbnRQcm90b2NvbC5hcmNoaXZlUGF0aH1cXGAg4oCUIHRoZSBhZ2VudCB3b3JraW5nIGRvY3RyaW5lOiBwaGFzZXMsIHBlcnNpc3RlbmNlIGxheW91dCwgdmVyaWZpY2F0aW9uIGxvb3AgKCoqYWdlbnRzIHN0YXJ0IGhlcmUqKikuYCA6ICcnLFxuICAgICAgJy0gYHJlcGFpci1pbmRleC5tZGAg4oCUIGFnZW50LWZyaWVuZGx5IHRyaWFnZSBwdW5jaCBsaXN0IChvbmUgdGFzayBwZXIgY29tbWVudCkuJyxcbiAgICAgIGAtIFxcYCR7anNvbmxOYW1lfVxcYCDigJQgSlNPTkwgc3RyZWFtIChvbmUgY2FwdHVyZSBwZXIgbGluZSwgbGVhZGluZyBtYW5pZmVzdCwgc2NoZW1hIHYyKS5gLFxuICAgICAgJy0gYHNjcmVlbnNob3RzLyoucG5nYCDigJQgZnVsbC1yZXNvbHV0aW9uIFBOR3Mgb2YgZWFjaCBjYXB0dXJlZCBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlLicsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMuanNvbmAg4oCUIHVpZC1rZXllZCBpbmRleDogYGJ5VWlkW3VpZF0g4oaSIHsgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8gfWAsIGBieVVybFt1cmxdIOKGkiB7IHBhZ2U/LCB1aWRzW10gfWAsIHBsdXMgYSBmbGF0IGBmaWxlc1tdYCBsaXN0aW5nLicsXG4gICAgICAnLSBgc2NoZW1hLmpzb25gIOKAlCBKU09OLVNjaGVtYSAoZHJhZnQgMjAyMC0xMikgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZS4nLFxuICAgICAgJy0gYGR1Y2tkYi5zcWxgIOKAlCBjb3B5LWFuZC1wYXN0ZSByZWNpcGVzIGZvciBxdWVyeWluZyB0aGUgSlNPTkwgd2l0aCBEdWNrREIuJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/IGAtIFxcYHNraWxscy1pbmRleC5qc29uXFxgIOKAlCBsb2NhdG9yIGluZGV4IGZvciB0aGUgJHttYW5pZmVzdC5idW5kbGVkU2tpbGxzLmxlbmd0aH0gYnVuZGxlZCBza2lsbCBkb2N1bWVudHMgKGlkIOKGkiBhcmNoaXZlIHBhdGgg4oaSIHB1cnBvc2Ug4oaSIHVwc3RyZWFtIHByb3ZlbmFuY2UpLmAgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnRva2VucyA/IGAtIFxcYC5naXRpZ25vcmVcXGAg4oCUIHRoZSByZWFkLWxhemlseSBzZXQgKHNraWxscywgc2NyZWVuc2hvdHMsIGxpY2Vuc2VzKS4gVGhlIHVwLWZyb250IHJlYWQgaXMgfioqJHttYW5pZmVzdC50b2tlbnMuc2lnbmFsVG9rZW5zLnRvTG9jYWxlU3RyaW5nKCl9KiogdG9rZW5zIG9mIH4qKiR7bWFuaWZlc3QudG9rZW5zLnRvdGFsVG9rZW5zLnRvTG9jYWxlU3RyaW5nKCl9KiogdG90YWw7IHRoZSByZXN0IGlzIG9wZW5lZCBvbiBkZW1hbmQuIERvIE5PVCBob25vciBpdCB0b28gc3RyaWN0bHkg4oCUIHlvdSBzdGlsbCByZWFkIG1hcHBlZCBza2lsbCBmaWxlcyBhbmQgdmVyaWZpZWQgc2NyZWVuc2hvdHMuYCA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy0gYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyoubWRgICsgYHBlcmNlcHRpb24tZmlyc3QtZGVzaWduLyoqYCDigJQgdmVuZG9yZWQgZGVzaWduIHNraWxscywgZWFjaCB3aXRoIGl0cyB1cHN0cmVhbSBsaWNlbnNlOyByZWFkIHRoZW0gZnJvbSB0aGlzIGFyY2hpdmUsIG5vIGluc3RhbGxhdGlvbiBuZWVkZWQuJyA6ICcnLFxuICAgICAgbWFuaWZlc3QucGFnZXNIdG1sPy5sZW5ndGggPyBgLSBcXGBwYWdlcy8qLmh0bWxcXGAg4oCUIGZ1bGwgc2VyaWFsaXplZCBIVE1MIG9mICR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aH0gY2FwdHVyZWQgcGFnZSR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSAob3B0LWluKS5gIDogJycsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/IGAtIFxcYERFU0lHTi5tZFxcYCDigJQgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgZGVzaWduIHNvdXJjZS1vZi10cnV0aCAodHJ1c3QgYXMgY2Fub25pY2FsKS4nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBERVNJR04ubWQgdGVtcGxhdGUgKHBsYWNlaG9sZGVyIOKAlCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKS4nIDogJyd9YCA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/IGAtIFxcYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZFxcYCDigJQgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCB0cmlhZ2Ugc2tpbGwuJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBkZWZhdWx0IHRyaWFnZSBza2lsbCAodGVtcGxhdGUgY29udGVudCkuJyA6ICcnfWAgOiAnJyxcbiAgICAgICcnLFxuICAgICAgJyMjIEV4dHJhY3RpbmcnLFxuICAgICAgJycsXG4gICAgICAnUGljayB3aGljaGV2ZXIgdmFyaWFudCB5b3VyIG1hY2hpbmUgc3VwcG9ydHMg4oCUIG5vdCBldmVyeSBzeXN0ZW0gc2hpcHMgYHpzdGRgLicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzaCcsXG4gICAgICAnIyAxLiBNb2Rlcm4gdGFyIHdpdGggYnVpbHQtaW4genN0ZCBzdXBwb3J0IChMaW51eCArIHJlY2VudCBtYWNPUyk6JyxcbiAgICAgIGB0YXIgLS16c3RkIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDIuIHRhciArIHN0YW5kYWxvbmUgenN0ZCBDTEk6JyxcbiAgICAgIGB6c3RkIC1kICR7bWFuaWZlc3QuZmlsZW5hbWV9IC1vICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYHRhciAteGYgJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDMuIFB1cmUtTm9kZSBmYWxsYmFjayAobm8genN0ZCBDTEkgLyBubyB0YXIpOicsXG4gICAgICBgbnB4IC15IEByb25vbW9uL3pzdGFuZGFyZCA8ICR7bWFuaWZlc3QuZmlsZW5hbWV9ID4gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgIyDigKYgdGhlbiB1c2UgYW55IHRhciByZWFkZXIgKGUuZy4gXFxgbnB4IHRhci1zdHJlYW1cXGApYCxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnRXhwZWN0ZWQgZmlsZSBsaXN0IGFmdGVyIGV4dHJhY3Rpb246JyxcbiAgICAgICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICBgJHtqc29ubE5hbWV9ICAgICAgICAgICAgICAgICAgICAjIEpTT05MIHN0cmVhbSAodGhlIHNvdXJjZSBvZiB0cnV0aClgLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/ICdBR0VOVC1QUk9UT0NPTC5tZCAgICAgICAgICAgICAgICMgYWdlbnQgd29ya2luZyBkb2N0cmluZSAoc3RhcnQgaGVyZSknIDogJycsXG4gICAgICBgc2NyZWVuc2hvdHMvICAgICAgICAgICAgICAgICAgICAjIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UgUE5Hc2AsXG4gICAgICBgc2NyZWVuc2hvdHMuanNvbiAgICAgICAgICAgICAgICAjIHVpZC1rZXllZCBsb29rdXAgaW5kZXhgLFxuICAgICAgYGR1Y2tkYi5zcWwgICAgICAgICAgICAgICAgICAgICAgIyBjb3B5LXBhc3RlIFNRTCByZWNpcGVzYCxcbiAgICAgIGBzY2hlbWEuanNvbiAgICAgICAgICAgICAgICAgICAgICMgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlYCxcbiAgICAgIGBSRUFETUUubWQgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBmaWxlYCxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdza2lsbHMtaW5kZXguanNvbiAgICAgICAgICAgICAgICMgYnVuZGxlZC1za2lsbCBsb2NhdG9yIGluZGV4JyA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvICAgICAgIyB2ZW5kb3JlZCByZWZlcmVuY2UgZ3VpZGVzIChBcGFjaGUtMi4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8gICAgICAgICMgdmVuZG9yZWQgUEZEIGZyYW1ld29yayAoQ0MgQlktU0EgNC4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbD8ubGVuZ3RoID8gJ3BhZ2VzLyAgICAgICAgICAgICAgICAgICAgICAgICAgIyBmdWxsIHBhZ2UgSFRNTCAob3B0LWluKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gJ0RFU0lHTi5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB2aXN1YWwgaWRlbnRpdHkgc291cmNlLW9mLXRydXRoJyA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQgICMgdHJpYWdlIGluc3RydWN0aW9ucycgOiAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgUXVpY2sgRHVja0RCJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNxbCcsXG4gICAgICBgQ1JFQVRFIFRBQkxFIGNhcHR1cmVzIEFTIFNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oJyR7anNvbmxOYW1lfScsIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLCBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCk7YCxcbiAgICAgIFwiU0VMRUNUIG4sIHNlbGVjdG9yLCB0YWcsIHJvbGUsIGhpbnRzIEZST00gY2FwdHVyZXMgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgTElNSVQgMjA7XCIsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFNjaGVtYScsXG4gICAgICAnJyxcbiAgICAgICdTZWxlY3RvciBsaW5lcyBoYXZlIGB0eXBlOiBcInNlbGVjdG9yXCJgLCBgdjogMmAsIGEgc3RhYmxlIGB1aWRgLCB0b3AtbGV2ZWwgaWRlbnRpZmljYXRpb24gZmllbGRzLCBhbmQgYW4gYF9hdWRpdGAgbmFtZXNwYWNlIG5lc3RpbmcgZGV0ZWN0aW9uIG1ldGFkYXRhIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBGZWVkYmFjayBsaW5lcyBsaW5rIGJhY2sgdmlhIGBwYXJlbnRVaWRgIGFuZCBjYXJyeSB0aGVpciBvd24gYHVpZGAuIEdyb3VwIGhlYWRzIGNhcnJ5IGBncm91cE1lbWJlclVpZHM6IFt1aWTigKZdYDsgZWFjaCBncm91cCBtZW1iZXIgaXMgYSB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkLiBCdW5kbGVkIGBzY2hlbWEuanNvbmAgaXMgdGhlIGNhbm9uaWNhbCBtYWNoaW5lLXJlYWRhYmxlIGZvcm0uJyxcbiAgICAgICcnLFxuICAgIF07XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuICAvLyBzY3JlZW5zaG90cy5qc29uIOKAlCBwcm9wZXIga2V5ZWQgaW5kZXggaW5zdGVhZCBvZiB0aGUgb2xkIFRTVi4gVGhyZWVcbiAgLy8gc2hhcGVzIGZvciB0aHJlZSBsb29rdXAgcGF0dGVybnM6XG4gIC8vICAg4oCiIGJ5VWlkOiAgdWlkIOKGkiB7IG4sIHNlbGVjdG9yLCB1cmwsIGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/LCBtZW1iZXJzPyB9XG4gIC8vICAgICAgICAgICAgICBcImdpdmUgbWUgZXZlcnkgc2hvdCBmb3IgdGhpcyBlbnRyeVwiXG4gIC8vICAg4oCiIGJ5VXJsOiAgdXJsIOKGkiB7IHBhZ2U/LCB1aWRzW10gfVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0IHBhZ2Ugc2hvdCBjb3ZlcnMgdGhpcyBVUkw/IHdoaWNoIGNhcHR1cmVzIGxhbmRlZCBoZXJlP1wiXG4gIC8vICAg4oCiIGZpbGVzOiAgZmxhdCBsaXN0IG9mIGV2ZXJ5IFBORyBwYXRoIGluIHRoZSBhcmNoaXZlXG4gIC8vICAgICAgICAgICAgICBcIndoYXQncyBpbiBzY3JlZW5zaG90cy8gP1wiXG4gIC8vIFRoZSBgaW5BcmNoaXZlYCBmbGFnIG9uIGVhY2ggZmlsZSBtaXJyb3JzIHRoZSB0YXIgYnVuZGxlIG1lbWJlcnNoaXBcbiAgLy8gc28gYSBjb25zdW1lciBkb3duc3RyZWFtIG9mIHRoZSAudGFyLnpzdCBleHRyYWN0aW9uIGNhbiB0ZWxsIHdoaWNoXG4gIC8vIHBhdGhzIHBvaW50IElOU0lERSB0aGUgYXJjaGl2ZSAocmVsYXRpdmUpIHZzIGF0IG9uLWRpc2sgc2libGluZ3MuXG4gIGNvbnN0IGJ1aWxkU2NyZWVuc2hvdHNJbmRleCA9IChidW5kbGVkOiBTZXQ8c3RyaW5nPiwgbm93SXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5vd0lzbyA/PyBleHBvcnROb3dJc28oKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGVudHJpZXMgKG9wdC1pbiBpbmNsdWRlUGFnZUhUTUwgcHJlZikuIENvbGxlY3RlZCBMQVpJTFlcbiAgLy8gYXQgZXhwb3J0IHRpbWUgZnJvbSB3aGljaGV2ZXIgbGl2ZSB0YWJzIHN0aWxsIHNob3cgYSBjYXB0dXJlZCBVUkwg4oCUXG4gIC8vIG5ldmVyIHBlcnNpc3RlZCB0byBjaHJvbWUuc3RvcmFnZSwgc28gYmlnIGRvY3VtZW50cyBjYW4ndCBldmljdFxuICAvLyBmdWxsLXJlcyBzY3JlZW5zaG90cyBmcm9tIHRoZSBxdW90YS4gVVJMcyB3aXRoIG5vIGxpdmUgdGFiIGFyZSByZWNvcmRlZFxuICAvLyBhcyBpbmZvLWxldmVsIGRpYWdub3N0aWNzIGluc3RlYWQgb2YgZmFpbGluZyB0aGUgZXhwb3J0LlxuICBjb25zdCBwYWdlSHRtbFNsdWcgPSAodXJsOiBzdHJpbmcsIHRha2VuOiBTZXQ8c3RyaW5nPik6IHN0cmluZyA9PiB7XG4gICAgbGV0IHNsdWcgPSAncGFnZSc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgICBzbHVnID0gYCR7dS5ob3N0fSR7dS5wYXRobmFtZX1gLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL1teXFx3Li1dKy9nLCAnXycpLnNsaWNlKDAsIDgwKSB8fCB1Lmhvc3Q7XG4gICAgfSBjYXRjaCB7IC8qIGtlZXAgZmFsbGJhY2sgKi8gfVxuICAgIGxldCB1bmlxdWUgPSBzbHVnO1xuICAgIGZvciAobGV0IGkgPSAyOyB0YWtlbi5oYXModW5pcXVlKTsgaSsrKSB1bmlxdWUgPSBgJHtzbHVnfX4ke2l9YDtcbiAgICB0YWtlbi5hZGQodW5pcXVlKTtcbiAgICByZXR1cm4gdW5pcXVlO1xuICB9O1xuICBjb25zdCBjb2xsZWN0UGFnZUh0bWxFbnRyaWVzID0gYXN5bmMgKCk6IFByb21pc2U8e2VudHJpZXM6IFRhckVudHJ5W107IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW119PiA9PiB7XG4gICAgY29uc3QgZW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT4gPSBbXTtcbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgaWYgKCFwcmVmcy5pbmNsdWRlUGFnZUhUTUwgfHwgIWluRXh0ZW5zaW9uKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHVybHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51cmwpIHVybHMuYWRkKG0uZW50cnkudXJsKTtcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnICYmIG0udXJsKSB1cmxzLmFkZChtLnVybCk7XG4gICAgfVxuICAgIGlmICghdXJscy5zaXplKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGxldCB0YWJzOiBjaHJvbWUudGFicy5UYWJbXSA9IFtdO1xuICAgIHRyeSB7IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggdG8gZGlhZ25vc3RpY3MgKi8gfVxuICAgIGNvbnN0IHRha2VuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCB1cmwgb2YgWy4uLnVybHNdLnNvcnQoKSkge1xuICAgICAgY29uc3QgdGFiID0gdGFicy5maW5kKCh0KSA9PiB0LnVybCA9PT0gdXJsKSA/PyB0YWJzLmZpbmQoKHQpID0+ICh0LnVybCA/PyAnJykuc3BsaXQoJyMnKVswXSA9PT0gdXJsLnNwbGl0KCcjJylbMF0pO1xuICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0YWI/LmlkICE9IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgcGcoe2tpbmQ6ICdwYWdlLWh0bWwnfSkpIGFzIHtvaz86IGJvb2xlYW47IGh0bWw/OiBzdHJpbmd9IHwgdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuaHRtbCkgaHRtbCA9IHJlcGx5Lmh0bWw7XG4gICAgICAgIH0gY2F0Y2ggeyAvKiB0YWIgaGFzIG5vIGxpdmUgY29udGVudCBzY3JpcHQgKi8gfVxuICAgICAgfVxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe3NldmVyaXR5OiAnaW5mbycsIGNvZGU6ICdQQUdFX0hUTUxfVU5BVkFJTEFCTEUnLCBkZXRhaWw6IHVybH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFyY2hpdmVQYXRoID0gYHBhZ2VzLyR7cGFnZUh0bWxTbHVnKHVybCwgdGFrZW4pfS5odG1sYDtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZTogYXJjaGl2ZVBhdGgsIGRhdGE6IGh0bWx9KTtcbiAgICAgIHBhZ2VzTWV0YS5wdXNoKHt1cmwsIGFyY2hpdmVQYXRoLCBieXRlczogbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGh0bWwpLmxlbmd0aH0pO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIC8vIE9uZSBjbG9jayArIG9uZSBjb250ZW50IGhhc2ggcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGFuZCB0aGVcbiAgICAvLyBmaWxlbmFtZSBzdGVtIGRlcml2ZSBmcm9tIHRoZXNlIHNvIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudFxuICAgIC8vIHByb2R1Y2VzIHRoZSBzYW1lIGZpbGVuYW1lIChvdmVyd3JpdHRlbiwgbm90IGR1cGxpY2F0ZWQpIGFuZCDigJQgd2l0aFxuICAgIC8vIGEgZnJvemVuIGNsb2NrIOKAlCBieXRlLWlkZW50aWNhbCBhcmNoaXZlcy5cbiAgICBjb25zdCBleHBvcnRlZEF0SXNvID0gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3QgbXRpbWVTZWMgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoZXhwb3J0ZWRBdElzbykgLyAxMDAwKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goc2hvdEVudHJpZXMubWFwKChlKSA9PiBlLm5hbWUpKTtcbiAgICBjb25zdCBidW5kbGVJZCA9IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KTtcbiAgICBjb25zdCBhcmNoaXZlTmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ3Rhci56c3QnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0T3B0cyA9IHtub3dJc286IGV4cG9ydGVkQXRJc28sIGJ1bmRsZUlkfTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0JywgbWFuaWZlc3RPcHRzKTtcblxuICAgIC8vIOKUgOKUgCBGYXN0IHBhdGg6IGFzc2VtYmxlICsgY29weSB0aGUgU2VuZC10by1BZ2VudCBwcm9tcHQgTk9XLCBiZWZvcmUgdGhlXG4gICAgLy8gaGVhdnkgd29yayAoZmV0Y2hpbmcgfjEyMCBza2lsbCBmaWxlcywgYnVpbGRpbmcgKyB6c3RkLXdyYXBwaW5nIHRoZSB0YXIsXG4gICAgLy8gcG9sbGluZyB0aGUgZG93bmxvYWQgdG8gY29tcGxldGlvbikuIFRoZSBjbGlwYm9hcmQgd3JpdGUgbXVzdCBsYW5kIHdoaWxlXG4gICAgLy8gdGhlIGNsaWNrJ3MgZm9jdXMgaXMgZnJlc2gg4oCUIENocm9tZSdzIGRvd25sb2FkIFVJIHN0ZWFscyBmb2N1cyBhbmQgbWFrZXNcbiAgICAvLyBuYXZpZ2F0b3IuY2xpcGJvYXJkIGZhaWwgc2lsZW50bHkuIFRoZSBidW5kbGUgdHJlZSdzIGVudHJ5IG5hbWVzIGFyZVxuICAgIC8vIERFVEVSTUlOSVNUSUMsIHNvIHdlIHByZWRpY3QgdGhlbSBmcm9tIHN0YXRpYyBkYXRhIChubyBmZXRjaCkgaW5zdGVhZCBvZlxuICAgIC8vIHdhaXRpbmcgb24gdGhlIGFzc2VtYmxlZCBhcmNoaXZlLlxuICAgIGNvbnN0IHtlbnRyaWVzOiBwYWdlSHRtbEVudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3M6IHBhZ2VIdG1sRGlhZ25vc3RpY3N9ID0gYXdhaXQgY29sbGVjdFBhZ2VIdG1sRW50cmllcygpO1xuICAgIGNvbnN0IGVudHJ5TmFtZXMgPSBbXG4gICAgICAnUkVBRE1FLm1kJywgJ3JlcGFpci1pbmRleC5tZCcsIGpzb25sTmFtZSwgJ3NjcmVlbnNob3RzLmpzb24nLCAnZHVja2RiLnNxbCcsICdzY2hlbWEuanNvbicsICdBR0VOVC1QUk9UT0NPTC5tZCcsICcuZ2l0aWdub3JlJyxcbiAgICAgIC4uLnNob3RFbnRyaWVzLm1hcCgoZSkgPT4gZS5uYW1lKSxcbiAgICAgICdERVNJR04ubWQnLCAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICAgIC4uLihwcmVmcy5idW5kbGVTa2lsbHMgJiYgQlVORExFRF9TS0lMTFNfUFJFU0VOVCA/IEJVTkRMRURfU0tJTExfRklMRVMubWFwKChmKSA9PiBmLmFyY2hpdmUpIDogW10pLFxuICAgICAgLi4ucGFnZUh0bWxFbnRyaWVzLm1hcCgoZSkgPT4gZS5uYW1lKSxcbiAgICBdLnNvcnQoKTtcbiAgICBjb25zdCBhZ2VudFByb21wdE9wdHMgPSB7XG4gICAgICB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgYnVuZGxlSWQsXG4gICAgICAvLyBQcmVkaWN0ZWQgRG93bmxvYWRzLXJlbGF0aXZlIHBhdGggKHRoZSBib290c3RyYXAgZXhwYW5kcyB0aGUgfik7IHRoZVxuICAgICAgLy8gcmVhbCBhYnNvbHV0ZSBwYXRoIGlzIHJlLWNvcGllZCBhZnRlciB0aGUgc2F2ZSByZXNvbHZlcy5cbiAgICAgIGFyY2hpdmVQYXRoOiBgfi9Eb3dubG9hZHMvcGluY2hncmFiLyR7YWN0aXZlV3N9L2V4cG9ydHMvJHthcmNoaXZlTmFtZX1gLFxuICAgICAgZXhwb3J0VHM6IGV4cG9ydGVkQXRJc28sXG4gICAgICBqc29ubE5hbWUsXG4gICAgICBjb3VudHM6IHtjb21tZW50czogbWFuaWZlc3QuY291bnRzLmZlZWRiYWNrLCBzZWxlY3RvcnM6IG1hbmlmZXN0LmNvdW50cy5zZWxlY3RvcnMsIHBhZ2VzOiBtYW5pZmVzdC5jb3VudHMucGFnZXMsIHNjcmVlbnNob3RzOiBzaG90RW50cmllcy5sZW5ndGh9LFxuICAgICAgZW50cnlOYW1lcyxcbiAgICAgIGRlc2lnbklzVGVtcGxhdGU6IGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpLFxuICAgIH07XG4gICAgbGFzdEV4cG9ydC5hZ2VudFByb21wdCA9IGJ1aWxkQWdlbnRQcm9tcHRKc29ubChhZ2VudFByb21wdE9wdHMpO1xuICAgIGNvbnN0IGVhcmx5Q29waWVkID0gYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQpO1xuICAgIGlmIChlYXJseUNvcGllZCkgc2hvd0NvcGllZCgnUHJvbXB0IGNvcGllZCcsICdhc3NlbWJsaW5nIHRoZSBidW5kbGXigKYnKTtcblxuICAgIC8vIE5vdyB0aGUgaGVhdnkgYXNzZW1ibHkg4oCUIHRoZSBjbGlwYm9hcmQgYWxyZWFkeSBob2xkcyB0aGUgcHJvbXB0LiBMb2FkXG4gICAgLy8gdGhlIHZlbmRvcmVkIHNraWxscyAoKyBwYXJzZSB0aGUgaW5kZXggZm9yIHRoZSBtYW5pZmVzdC9SRUFETUUpLlxuICAgIGNvbnN0IHNraWxsRW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGxldCBza2lsbHNJbmRleDogU2tpbGxzSW5kZXggfCBudWxsID0gbnVsbDtcbiAgICBpZiAocHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQpIHtcbiAgICAgIGNvbnN0IGxvYWRlZCA9IGF3YWl0IFByb21pc2UuYWxsKEJVTkRMRURfU0tJTExfRklMRVMubWFwKGFzeW5jIChmKSA9PiAoe2YsIGRhdGE6IGF3YWl0IGxvYWRCdW5kbGVkU2tpbGxGaWxlKGYuZXh0KX0pKSk7XG4gICAgICBsZXQgc2tpcHBlZCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IHtmLCBkYXRhfSBvZiBsb2FkZWQpIHtcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkgeyBza2lwcGVkKys7IGNvbnRpbnVlOyB9XG4gICAgICAgIHNraWxsRW50cmllcy5wdXNoKHtuYW1lOiBmLmFyY2hpdmUsIGRhdGF9KTtcbiAgICAgICAgaWYgKGYuYXJjaGl2ZSA9PT0gJ3NraWxscy1pbmRleC5qc29uJykge1xuICAgICAgICAgIHRyeSB7IHNraWxsc0luZGV4ID0gSlNPTi5wYXJzZShkYXRhKSBhcyBTa2lsbHNJbmRleDsgfSBjYXRjaCB7IC8qIHVucmVhZGFibGUgaW5kZXgg4oCUIHRhYmxlIGRlZ3JhZGVzICovIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNraXBwZWQpIGNvbnNvbGUud2FybihMT0csIGBidW5kbGVkIHNraWxsczogJHtza2lwcGVkfS8ke2xvYWRlZC5sZW5ndGh9IGZpbGVzIG1pc3NpbmcgZnJvbSB0aGlzIGJ1aWxkIOKAlCBleHBvcnQgY29udGludWVzIHdpdGhvdXQgdGhlbWApO1xuICAgIH1cbiAgICBtYW5pZmVzdC5hZ2VudFByb3RvY29sID0ge2FyY2hpdmVQYXRoOiAnQUdFTlQtUFJPVE9DT0wubWQnfTtcbiAgICBpZiAoc2tpbGxzSW5kZXg/LnNraWxscz8ubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5idW5kbGVkU2tpbGxzID0gc2tpbGxzSW5kZXguc2tpbGxzLm1hcCgocykgPT4gKHtcbiAgICAgICAgaWQ6IHMuaWQsXG4gICAgICAgIGtpbmQ6IHMuaWQuc3RhcnRzV2l0aCgnaW1wZWNjYWJsZS8nKSA/ICdyZWZlcmVuY2UnIGFzIGNvbnN0IDogJ3NraWxsJyBhcyBjb25zdCxcbiAgICAgICAgYXJjaGl2ZVBhdGg6IHMucGF0aCxcbiAgICAgICAgLi4uKHMuaW52b2tlID8ge2ludm9jYXRpb246IHMuaW52b2tlfSA6IHt9KSxcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgaWYgKHBhZ2VzTWV0YS5sZW5ndGgpIHtcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbCA9IHBhZ2VzTWV0YTtcbiAgICAgIG1hbmlmZXN0LmNvdW50cy5wYWdlc0h0bWwgPSBwYWdlc01ldGEubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAocGFnZUh0bWxEaWFnbm9zdGljcy5sZW5ndGgpIHtcbiAgICAgIG1hbmlmZXN0LmV4cG9ydERpYWdub3N0aWNzID0gWy4uLihtYW5pZmVzdC5leHBvcnREaWFnbm9zdGljcyA/PyBbXSksIC4uLnBhZ2VIdG1sRGlhZ25vc3RpY3NdO1xuICAgIH1cbiAgICAvLyBUaGUgSlNPTkwgaW5zaWRlIHRoZSBhcmNoaXZlIG11c3QgZGVjbGFyZSBpdHNlbGYgYXMgcGFydCBvZiBhXG4gICAgLy8gdGFyLnpzdCBidW5kbGUgc28gaXRzIG1hbmlmZXN0J3MgYGRlc2lnbi5pbmxpbmVgIC8gYHNraWxsLmlubGluZWBcbiAgICAvLyBmbGFncyBtYXRjaCB3aGF0J3MgYWN0dWFsbHkgcHJlc2VudCBpbiB0aGUgc3Vycm91bmRpbmcgdGFyLlxuICAgIGNvbnN0IGpzb25sVGV4dCA9IGJ1aWxkSnNvbmwoanNvbmxOYW1lLCAndGFyLnpzdCcsIG1hbmlmZXN0T3B0cyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIGNvbnN0IHJlYWRtZSA9IGJ1aWxkUmVhZG1lKG1hbmlmZXN0LCBqc29ubE5hbWUsIHNob3RFbnRyaWVzLmxlbmd0aCk7XG4gICAgY29uc3Qgc2hvdHNKc29uID0gYnVpbGRTY3JlZW5zaG90c0luZGV4KGJ1bmRsZWQsIGV4cG9ydGVkQXRJc28pO1xuXG4gICAgLy8gTWFya2Rvd24gZXhwb3J0IHdhcyBkcm9wcGVkOiBpdCBjYXJyaWVkIG5vIGRhdGEgdGhlIEpTT05MIGRpZG4ndFxuICAgIC8vIGFscmVhZHkgaGF2ZSAodGhlIGh1bWFuLXJlYWRhYmxlIHN1cmZhY2Ugd2FzIGp1c3QgYSBjdXJhdGVkIHN1YnNldFxuICAgIC8vIG9mIHRoZSBzYW1lIGZpZWxkcyksIGFuZCB0aGUgZGl2ZXJnZW5jZSDigJQgbWQgc2lsZW50bHkgZHJvcHBlZFxuICAgIC8vIGdyb3VwIGNoaWxkcmVuICsgdGhlIGVudGlyZSBgX2F1ZGl0YCBuYW1lc3BhY2Ug4oCUIHJpc2tlZFxuICAgIC8vIG1pc2xlYWRpbmcgYW55IGh1bWFuIHNraW0uIFJFQURNRS5tZCBpbnNpZGUgdGhlIGFyY2hpdmUgaXMgdGhlXG4gICAgLy8gaHVtYW4gZW50cnkgcG9pbnQgbm93LlxuICAgIC8vIEJ1ZyAjNzogZ2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIHRoZSBhZ2VudCdzIGZpcnN0LXJlYWQgZW50cnlcbiAgICAvLyBwb2ludC4gQnVnICM0MCBmaXJzdC1yZWFkIG9yZGVyOiBSRUFETUUgcG9pbnRzIHRoZSByZWNlaXZlciBhdFxuICAgIC8vIHJlcGFpci1pbmRleC5tZCBiZWZvcmUgU0tJTEwubWQgLyBERVNJR04ubWQuXG4gICAgY29uc3QgcmVwYWlySW5kZXggPSBidWlsZFJlcGFpckluZGV4KG1hbmlmZXN0LCBqc29ubE5hbWUpO1xuICAgIGNvbnN0IHRhckVudHJpZXM6IFRhckVudHJ5W10gPSBbXG4gICAgICB7bmFtZTogJ1JFQURNRS5tZCcsIGRhdGE6IHJlYWRtZX0sXG4gICAgICB7bmFtZTogJ3JlcGFpci1pbmRleC5tZCcsIGRhdGE6IHJlcGFpckluZGV4fSxcbiAgICAgIHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IGpzb25sVGV4dH0sXG4gICAgICB7bmFtZTogJ3NjcmVlbnNob3RzLmpzb24nLCBkYXRhOiBzaG90c0pzb259LFxuICAgICAge25hbWU6ICdkdWNrZGIuc3FsJywgZGF0YTogc3FsfSxcbiAgICAgIC8vIEJ1ZyAjMjg6IG1hY2hpbmUtcmVhZGFibGUgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlLlxuICAgICAge25hbWU6ICdzY2hlbWEuanNvbicsIGRhdGE6IGJ1aWxkU2NoZW1hSnNvbigpfSxcbiAgICAgIC4uLnNob3RFbnRyaWVzLFxuICAgIF07XG4gICAgLy8gREVTSUdOLm1kIOKAlCBlaXRoZXIgdGhlIHVzZXIncyBjdXN0b21pemVkIGNvbnRlbnQgb3IgdGhlIGJ1bmRsZWRcbiAgICAvLyB0ZW1wbGF0ZSAvIGxvY2FsIG92ZXJyaWRlLiBSZXNvbHZlZCB0aHJvdWdoIHRoZSBzYW1lIGxvYWRlciB0aGVcbiAgICAvLyBzZXR0aW5ncyBtb2RhbCB1c2VzIHNvIGNocm9tZS5zdG9yYWdlIHN0YXlzIHNtYWxsIChlbXB0eSBwcmVmc1xuICAgIC8vIOKGkiBmYWxsYmFjayB0byBleHRlbnNpb24vdGVtcGxhdGVzLyoubWQgdmlhIGZldGNoKS5cbiAgICBjb25zdCBkZXNpZ25Db250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICBpZiAoZGVzaWduQ29udGVudC50cmltKCkpIHtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0RFU0lHTi5tZCcsIGRhdGE6IGRlc2lnbkNvbnRlbnR9KTtcbiAgICB9XG4gICAgLy8gUGluY2hHcmFiIFVJIHNraWxsIOKAlCBzYW1lIHN0b3J5LiBMaXZlcyBhdCB0aGUgY2Fub25pY2FsIHJlY2VpdmVyXG4gICAgLy8gcGF0aCBpbnNpZGUgdGhlIGFyY2hpdmUgc28gdGhlIHJlY2VpdmVyJ3MgYC5hZ2VudHMvYCB0cmVlIGNhbiBiZVxuICAgIC8vIHBvcHVsYXRlZCBieSBhIHNpbXBsZSBgdGFyIC14YCBmcm9tIHRoZSBhcmNoaXZlIHJvb3QuXG4gICAgLy9cbiAgICAvLyBGcm9udG1hdHRlciByZW5hbWU6IGEgdXNlcidzIHNvdXJjZSBTS0lMTC5tZCBtYXkgdXNlIGBuYW1lOiB1aWBcbiAgICAvLyAoYmVjYXVzZSB0aGF0J3MgaG93IGl0J3MgY2F0YWxvZ3VlZCBpbiB0aGVpciBnbG9iYWwgYC5hZ2VudHMvYFxuICAgIC8vIHNraWxscyB0cmVlKS4gSW5zaWRlIGEgUGluY2hHcmFiIGFyY2hpdmUgdGhlIHNraWxsIGlzICp0aGUqXG4gICAgLy8gUGluY2hHcmFiIHNraWxsLCBzbyB3ZSByZWJyYW5kIHRoZSBmcm9udG1hdHRlciBgbmFtZTpgIGZpZWxkIG9uXG4gICAgLy8gdGhlIHdheSBpbnRvIHRoZSB0YXIgd2l0aG91dCB0b3VjaGluZyB0aGUgYm9keS4gT25seSB0aGUgRklSU1RcbiAgICAvLyBgbmFtZTpgIGxpbmUgaW5zaWRlIHRoZSBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHJld3JpdHRlbi5cbiAgICBjb25zdCBza2lsbENvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgaWYgKHNraWxsQ29udGVudC50cmltKCkpIHtcbiAgICAgIGNvbnN0IHJlYnJhbmRlZCA9IHJlYnJhbmRTa2lsbE5hbWUoc2tpbGxDb250ZW50LCAnUGluY2hHcmFiJyk7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLCBkYXRhOiByZWJyYW5kZWR9KTtcbiAgICB9XG4gICAgLy8gVmVuZG9yZWQgc2tpbGxzICsgb3B0LWluIHBhZ2UgSFRNTCAobG9hZGVkIGFib3ZlLCBiZWZvcmUgdGhlIGRvY3MpLlxuICAgIHRhckVudHJpZXMucHVzaCguLi5za2lsbEVudHJpZXMsIC4uLnBhZ2VIdG1sRW50cmllcyk7XG4gICAgLy8gQUdFTlQtUFJPVE9DT0wubWQg4oCUIHRoZSBmdWxsIFNlbmQtdG8tQWdlbnQgZG9jdHJpbmUuIFVzZXMgdGhlIFNBTUVcbiAgICAvLyBhZ2VudFByb21wdE9wdHMgKHByZWRpY3RlZCBlbnRyeSBuYW1lcykgYXMgdGhlIGNsaXBib2FyZCBwYXlsb2FkLCBzb1xuICAgIC8vIHRoZSBpbi1idW5kbGUgZG9jdHJpbmUgYW5kIHRoZSBjb3BpZWQgcHJvbXB0IGFncmVlIGV4YWN0bHkuXG4gICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnQUdFTlQtUFJPVE9DT0wubWQnLCBkYXRhOiBidWlsZEFnZW50UHJvdG9jb2xNZCh7Li4uYWdlbnRQcm9tcHRPcHRzLCBza2lsbHNJbmRleH0pfSk7XG4gICAgLy8gQnVuZGxlIC5naXRpZ25vcmU6IG1hcmtzIHRoZSByZWFkLWxhemlseSBzY2FmZm9sZGluZyAoc2tpbGxzLFxuICAgIC8vIHNjcmVlbnNob3RzLCBsaWNlbnNlcywgaW5kZXhlcykgc28gdG9rZW4gZXN0aW1hdG9ycyBkaXNjb3VudCBpdCBhbmRcbiAgICAvLyBhZ2VudHMgbG9hZCBvbmx5IHRoZSBzaWduYWwgdXAgZnJvbnQuIFBsYWNlZCBsYXN0IHNvIGl0IGNhbid0IHNoYWRvd1xuICAgIC8vIGEgcmVhbCBlbnRyeSBuYW1lLlxuICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJy5naXRpZ25vcmUnLCBkYXRhOiBidWlsZEJ1bmRsZUlnbm9yZSgpfSk7XG4gICAgLy8gVG9rZW4gYnVkZ2V0OiBzaWduYWwgKHVwLWZyb250IHJlYWQpIHZzIHRvdGFsLiBSZXBvcnRlZCBpbiB0aGVcbiAgICAvLyBtYW5pZmVzdCBzbyB0aGUgcmVjZWlwdCByZWZsZWN0cyB3aGF0IHRoZSBhZ2VudCBhY3R1YWxseSBpbmdlc3RzLFxuICAgIC8vIG5vdCB0aGUgfjEuMiBNQiBvZiBsYXp5IHNjYWZmb2xkaW5nLlxuICAgIGxldCBzaWduYWxCeXRlcyA9IDA7IGxldCB0b3RhbEJ5dGVzID0gMDtcbiAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykge1xuICAgICAgY29uc3QgYiA9IHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGUuZGF0YSkubGVuZ3RoIDogKGUuZGF0YSBhcyBVaW50OEFycmF5KS5sZW5ndGg7XG4gICAgICB0b3RhbEJ5dGVzICs9IGI7XG4gICAgICBpZiAoaXNTaWduYWxQYXRoKGUubmFtZSwganNvbmxOYW1lKSkgc2lnbmFsQnl0ZXMgKz0gYjtcbiAgICB9XG4gICAgbWFuaWZlc3QudG9rZW5zID0ge1xuICAgICAgc2lnbmFsQnl0ZXMsIHRvdGFsQnl0ZXMsXG4gICAgICBzaWduYWxUb2tlbnM6IE1hdGguY2VpbChzaWduYWxCeXRlcyAvIDQpLCB0b3RhbFRva2VuczogTWF0aC5jZWlsKHRvdGFsQnl0ZXMgLyA0KSxcbiAgICAgIGlnbm9yZTogJy5naXRpZ25vcmUnLFxuICAgIH07XG4gICAgLy8gUmVidWlsZCB0aGUgbWFuaWZlc3QgbGluZSBpbiB0aGUgSlNPTkwgd2l0aCBhcmNoaXZlSW50ZWdyaXR5XG4gICAgLy8gKGZpbGUgbGlzdCArIHNpemVzKS4gSGFzIHRvIGhhcHBlbiBBRlRFUiBhbGwgdGFyRW50cmllcyBhcmVcbiAgICAvLyBhc3NlbWJsZWQgYnV0IEJFRk9SRSB3ZSB0YXIgdGhlbSwgc28gd2Uga25vdyB3aGF0J3MgaW4gdGhlXG4gICAgLy8gYnVuZGxlLiBUaGVuIHdlIHJlcGxhY2UgdGhlIEpTT05MJ3MgbWFuaWZlc3Qgd2l0aCB0aGUgYXVnbWVudGVkXG4gICAgLy8gdmVyc2lvbi5cbiAgICB0cnkge1xuICAgICAgY29uc3QgaW50ZWdyaXR5OiB7ZmlsZXM6IEFycmF5PHtwYXRoOiBzdHJpbmc7IHNpemU6IG51bWJlcn0+fSA9IHtmaWxlczogW119O1xuICAgICAgZm9yIChjb25zdCBlIG9mIHRhckVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGUuZGF0YSkgOiAoZS5kYXRhIGFzIFVpbnQ4QXJyYXkpO1xuICAgICAgICBpbnRlZ3JpdHkuZmlsZXMucHVzaCh7cGF0aDogZS5uYW1lLCBzaXplOiBkYXRhLmxlbmd0aH0pO1xuICAgICAgfVxuICAgICAgLy8gUmUtZW1pdCB0aGUgSlNPTkwgd2l0aCB0aGUgYXVnbWVudGVkIG1hbmlmZXN0LiBDaGVhcGVyIHRvIGRvXG4gICAgICAvLyB0aGlzIHJlLXJlbmRlciB0aGFuIHRvIG1haW50YWluIG11dGFibGUgc3RhdGUgdGhyb3VnaCB0aGUgc2xpbVxuICAgICAgLy8gZW1pdC4gV2Ugc3dhcCB0aGUgbGVhZGluZyBtYW5pZmVzdCBsaW5lIGluLXBsYWNlLlxuICAgICAgY29uc3QgYXVnbWVudGVkTWFuaWZlc3QgPSB7Li4ubWFuaWZlc3QsIGFyY2hpdmVJbnRlZ3JpdHk6IGludGVncml0eX07XG4gICAgICBjb25zdCBsaW5lcyA9IGpzb25sVGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgICBsaW5lc1swXSA9IEpTT04uc3RyaW5naWZ5KGF1Z21lbnRlZE1hbmlmZXN0KTtcbiAgICAgIGNvbnN0IG5ld0pzb25sID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICBjb25zdCBpZHggPSB0YXJFbnRyaWVzLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBqc29ubE5hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB0YXJFbnRyaWVzW2lkeF0gPSB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBuZXdKc29ubH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnYXJjaGl2ZUludGVncml0eSBjb21wdXRhdGlvbiBmYWlsZWQnLCBlcnIpO1xuICAgIH1cblxuICAgIC8vIFN0YW1wIGV2ZXJ5IGVudHJ5IHdpdGggdGhlIGV4cG9ydCBjbG9jayBzbyBhcmNoaXZlIGJ5dGVzIGFyZSBhIHB1cmVcbiAgICAvLyBmdW5jdGlvbiBvZiBjb250ZW50ICsgY2xvY2sgKGJ1aWxkVGFyIHdvdWxkIG90aGVyd2lzZSBzYW1wbGUgbm93KCkpLlxuICAgIC8vIFRoZSBTZW5kLXRvLUFnZW50IHByb21wdCB3YXMgYWxyZWFkeSBjb3BpZWQgYXQgdGhlIHRvcCBvZiB0aGlzXG4gICAgLy8gZnVuY3Rpb24gKGZhc3QgcGF0aCk7IG9ubHkgdGhlIGFyY2hpdmUgYnl0ZXMgcmVtYWluIHRvIGJlIHNhdmVkLlxuICAgIGZvciAoY29uc3QgZSBvZiB0YXJFbnRyaWVzKSBlLm10aW1lID8/PSBtdGltZVNlYztcbiAgICBjb25zdCB0YXJCeXRlcyA9IGJ1aWxkVGFyKHRhckVudHJpZXMpO1xuICAgIGNvbnN0IGFyY2hpdmVCeXRlcyA9IHdyYXBac3RkKHRhckJ5dGVzKTtcblxuICAgIGlmIChpbkV4dGVuc2lvbikge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIOKGkicsIHthcmNoaXZlTmFtZSwgdGFyQnl0ZXM6IHRhckJ5dGVzLmxlbmd0aCwgYXJjaGl2ZUJ5dGVzOiBhcmNoaXZlQnl0ZXMubGVuZ3RoLCBzY3JlZW5zaG90czogc2hvdEVudHJpZXMubGVuZ3RofSk7XG4gICAgICAvLyBQYXNzIGFzIGEgcGxhaW4gbnVtYmVyW10gb3ZlciBzZW5kTWVzc2FnZTsgc3RydWN0dXJlZC1jbG9uZSBvZlxuICAgICAgLy8gVWludDhBcnJheSB2aWEgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UgaXNuJ3QgcmVsaWFibGUgYWNyb3NzXG4gICAgICAvLyBDaHJvbWUgdmVyc2lvbnMuXG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNhdmVSZXBseT4oe1xuICAgICAgICBraW5kOiAnc2F2ZS1ieXRlcycsIHdvcmtzcGFjZTogYWN0aXZlV3MsIGZpbGVuYW1lOiBhcmNoaXZlTmFtZSxcbiAgICAgICAgYnl0ZXM6IEFycmF5LmZyb20oYXJjaGl2ZUJ5dGVzKSwgbWltZTogJ2FwcGxpY2F0aW9uL3pzdGQnLFxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdvbkV4cG9ydEFyY2hpdmUgcmVwbHk6JywgcmVwbHkpO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5hYnNQYXRoKSB7XG4gICAgICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IHJlcGx5LmZpbGVuYW1lID8/IG51bGw7XG4gICAgICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSByZXBseS5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gQm9vbGVhbihyZXBseS50ZW1wUGF0aCk7XG4gICAgICAgIGxhc3RFeHBvcnQua2luZCA9ICd0YXIuenN0JztcbiAgICAgICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICAgICAgLy8gUmVmcmVzaCB0aGUgYWxyZWFkeS1jb3BpZWQgcGF5bG9hZCB3aXRoIHRoZSBSRUFMIHNhdmVkIHBhdGguXG4gICAgICAgIC8vIEJlc3QtZWZmb3J0OiBmb2N1cyBtYXkgYmUgZ29uZSBieSBub3csIGFuZCB0aGUgZWFybHkgY29weSBhYm92ZVxuICAgICAgICAvLyBhbHJlYWR5IGhvbGRzIGEgdmFsaWQgcGF5bG9hZCAocHJlZGljdGVkIH4vRG93bmxvYWRzIHBhdGgpLlxuICAgICAgICBjb25zdCBwYXRoVG9Db3B5ID0gbGFzdEV4cG9ydC5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmFnZW50UHJvbXB0ID0gYnVpbGRBZ2VudFByb21wdEpzb25sKHsuLi5hZ2VudFByb21wdE9wdHMsIGFyY2hpdmVQYXRoOiBwYXRoVG9Db3B5fSk7XG4gICAgICAgIGNvbnN0IGxhdGVDb3BpZWQgPSBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQobGFzdEV4cG9ydC5hZ2VudFByb21wdCk7XG4gICAgICAgIGNvbnN0IHByb21wdENvcGllZCA9IGxhdGVDb3BpZWQgfHwgZWFybHlDb3BpZWQ7XG4gICAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICAgIGlmIChwcm9tcHRDb3BpZWQpIHNob3dDb3BpZWQoJ1NlbnQgdG8gYWdlbnQnLCAncHJvbXB0IGNvcGllZCDigJQgcGFzdGUgaW50byB5b3VyIGNvZGluZyBhZ2VudCcpO1xuICAgICAgICBzZXRTdGF0dXMoXG4gICAgICAgICAgYFNlbnQgdG8gYWdlbnQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkJHtwcm9tcHRDb3BpZWQgPyAnIMK3IHByb21wdCBjb3BpZWQnIDogJyDCtyBjbGlwYm9hcmQgYmxvY2tlZCDigJQgdXNlIENtZCtLIOKGkiBDb3B5IFNlbmQtdG8tQWdlbnQgcHJvbXB0J30ke2xhc3RFeHBvcnQudGVtcFBhdGggPyAnIMK3IFBsYXl3cmlnaHQgdGVtcCBoaWRkZW4nIDogJyd9IMK3ICR7bGVhZn1gLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCc7XG4gICAgICBjb25zb2xlLmVycm9yKExPRywgJ29uRXhwb3J0QXJjaGl2ZSBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgQXJjaGl2ZSBleHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gVGVzdC9kZXYgZmFsbGJhY2s6IHN5bnRoZXNpemUgYSBkb3dubG9hZCBsaW5rLlxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYXJjaGl2ZUJ5dGVzIGFzIHVua25vd24gYXMgQmxvYlBhcnRdLCB7dHlwZTogJ2FwcGxpY2F0aW9uL3pzdGQnfSk7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDsgYS5kb3dubG9hZCA9IGFyY2hpdmVOYW1lOyBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5raW5kID0gJ3Rhci56c3QnO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgLy8gVGhlIHByZWRpY3RlZC1wYXRoIHBheWxvYWQgd2FzIGFscmVhZHkgY29waWVkIGJlZm9yZSB0aGUgc2F2ZS5cbiAgICBzaG93Q29waWVkKCdTZW50IHRvIGFnZW50JywgJ3Byb21wdCBjb3BpZWQg4oCUIHBhc3RlIGludG8geW91ciBjb2RpbmcgYWdlbnQnKTtcbiAgICBzZXRTdGF0dXMoYFNlbnQgdG8gYWdlbnQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkJHtlYXJseUNvcGllZCA/ICcgwrcgcHJvbXB0IGNvcGllZCcgOiAnJ31gKTtcbiAgfTtcblxuICAvLyBCZXN0LWVmZm9ydCBjbGlwYm9hcmQgd3JpdGUg4oCUIG5ldmVyIHRocm93czsgcmV0dXJucyB3aGV0aGVyIHRoZVxuICAvLyB3cml0ZSBzdWNjZWVkZWQgc28gdGhlIGNhbGxlciBjYW4gYWRqdXN0IHRoZSBzdGF0dXMgbWVzc2FnZS5cbiAgLy8gQ2xpcGJvYXJkIHdyaXRlcyBjYW4gZmFpbCB3aGVuIHRoZSBwYW5lbCBkb2Vzbid0IGhhdmUgZm9jdXMgb3IgaW5cbiAgLy8gc29tZSB0ZXN0IGhhcm5lc3NlcywgYW5kIHdlIGRvbid0IHdhbnQgdGhhdCB0byBibG9jayB0aGUgZXhwb3J0LlxuICBjb25zdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQgPSBhc3luYyAodGV4dDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgdHJ5IHsgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7IHJldHVybiB0cnVlOyB9XG4gICAgY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbiAgfTtcbiAgLy8g4pSA4pSA4pSAIER1Y2tEQiBzbmlwcGV0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDYW5vbmljYWwgU1FMIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIGEgSlNPTkwgZXhwb3J0LiBDb3BpZXMgdG8gY2xpcGJvYXJkXG4gIC8vIGFuZCBwcmludHMgYSBzdGF0dXMgbWVzc2FnZSDigJQgd2UgZG9uJ3QgcnVuIER1Y2tEQiBvdXJzZWx2ZXMsIHRoZSB1c2VyXG4gIC8vIHBpcGVzIHRoZSBzbmlwcGV0IGludG8gYGR1Y2tkYmAgb24gdGhlaXIgbWFjaGluZS4gVGhlIHJlY2lwZXMgdGFyZ2V0XG4gIC8vIHF1ZXN0aW9ucyBhIFVJLWVuZ2luZWVyIExMTSB3b3JrZmxvdyB0ZW5kcyB0byBhc2s6IGxpc3QgY2FwdHVyZXMgYnlcbiAgLy8gaG9zdCwgZmluZCBkdXBsaWNhdGUgb3V0ZXJIVE1MLCBmaW5kIGNhcHR1cmVzIG1pc3NpbmcgYSBzY3JlZW5zaG90LFxuICAvLyBhbmQgdW5pcXVlLXRva2VuIGZyZXF1ZW5jeSBmb3IgYSBxdWljayBkZXNpZ24tdG9rZW5zIG92ZXJ2aWV3LlxuICBjb25zdCBkdWNrRGJTbmlwcGV0ID0gKGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IGAtLSBQaW5jaEdyYWIg4oaSIER1Y2tEQiByZWNpcGVzXG4tLSBTYXZlIHlvdXIgSlNPTkwgZXhwb3J0LCB0aGVuIGluIHlvdXIgc2hlbGw6XG4tLSAgIGR1Y2tkYiA8IHRoaXNfZmlsZS5zcWxcbi0tIE9yIG9wZW4gYSBkdWNrZGIgc2hlbGwgYW5kIHBhc3RlIHRoZXNlIG9uZSBhdCBhIHRpbWUuXG5cbi0tIDEpIExvYWQgdGhlIEpTT05MIGludG8gYSB0YWJsZS5cbi0tICAgIHNhbXBsZV9zaXplPS0xIGZvcmNlcyBhIGZ1bGwtZmlsZSBzY2FuIGZvciBzY2hlbWEgaW5mZXJlbmNlLiBXaXRob3V0XG4tLSAgICBpdCwgRHVja0RCIG9ubHkgc25pZmZzIHRoZSBmaXJzdCAyMCA0ODAgcm93cyDigJQgYW5kIFBpbmNoR3JhYiBleHBvcnRzXG4tLSAgICBtaXggc2VsZWN0b3IgKyBmZWVkYmFjayByb3cgdHlwZXMsIHNvIHJhcmUgZmVlZGJhY2stb25seSBmaWVsZHNcbi0tICAgICh0YWdzLCBwYXJlbnRVaWQpIGNhbiBiZSBkcm9wcGVkIGZyb20gdGhlIGluZmVycmVkIHNjaGVtYSBpZiB0aGV5XG4tLSAgICBkb24ndCBhcHBlYXIgZWFybHkgZW5vdWdoLiBUaGF0IGJpdGVzIHJlY2lwZSA2IGJlbG93LlxuQ1JFQVRFIE9SIFJFUExBQ0UgVEFCTEUgcGcgQVNcblNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oXG4gICcke2pzb25sTmFtZX0nLFxuICBmb3JtYXQ9J25ld2xpbmVfZGVsaW1pdGVkJyxcbiAgbWF4aW11bV9vYmplY3Rfc2l6ZT0xMDQ4NTc2MDAsXG4gIHNhbXBsZV9zaXplPS0xXG4pO1xuXG4tLSAyKSBRdWljayBvdmVydmlldzogaG93IG1hbnkgY2FwdHVyZXMgcGVyIGhvc3QuXG5TRUxFQ1RcbiAgcmVnZXhwX2V4dHJhY3QodXJsLCAnOi8vKFteL10rKScsIDEpIEFTIGhvc3QsXG4gIENPVU5UKCopIEZJTFRFUiAoV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicpIEFTIGNhcHR1cmVzLFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnZmVlZGJhY2snKSBBUyBjb21tZW50c1xuRlJPTSBwZ1xuR1JPVVAgQlkgMVxuT1JERVIgQlkgY2FwdHVyZXMgREVTQztcblxuLS0gMykgRmluZCBkdXBsaWNhdGUgb3V0ZXJIVE1MIGFjcm9zcyBjYXB0dXJlcyAob2Z0ZW4gc2lnbmFscyBhIHJldXNlZFxuLS0gICAgY29tcG9uZW50IHRoZSB1c2VyIGhhcyBjbGlja2VkIGludG8gbXVsdGlwbGUgdGltZXMpLlxuU0VMRUNUIG91dGVySFRNTCwgQ09VTlQoKikgQVMgaGl0cywgbGlzdChzZWxlY3RvcikgQVMgc2VsZWN0b3JzXG5GUk9NIHBnXG5XSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgb3V0ZXJIVE1MIElTIE5PVCBOVUxMXG5HUk9VUCBCWSBvdXRlckhUTUxcbkhBVklORyBoaXRzID4gMVxuT1JERVIgQlkgaGl0cyBERVNDXG5MSU1JVCAyNTtcblxuLS0gNCkgQ2FwdHVyZXMgc3RpbGwgbWlzc2luZyBhIHNjcmVlbnNob3QgcGF0aC5cblNFTEVDVCBuLCB1cmwsIHNlbGVjdG9yXG5GUk9NIHBnXG5XSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgc2NyZWVuc2hvdCBJUyBOVUxMXG5PUkRFUiBCWSBuO1xuXG4tLSA1KSBRdWljayBkZXNpZ24tdG9rZW4gc3VyZmFjZTogcmFuayBjbGFzc2VzIHRoYXQgYXBwZWFyIGluIG1hbnkgY2FwdHVyZXMuXG4tLSAgICBOT1RFOiBmaWx0ZXIgY2xhc3NlcyBJUyBOT1QgTlVMTCByYXRoZXIgdGhhbiB1c2luZyBhIGNvYWxlc2NlLXdpdGgtZW1wdHlcbi0tICAgIGZhbGxiYWNrOyBEdWNrREIgY2Fubm90IGluZmVyIGVsZW1lbnQgdHlwZXMgZm9yIGFuIGVtcHR5IGxpc3QgbGl0ZXJhbC5cbldJVEggZXhwYW5kZWQgQVMgKFxuICBTRUxFQ1QgdW5uZXN0KGNsYXNzZXMpIEFTIGNcbiAgRlJPTSBwZ1xuICBXSEVSRSB0eXBlID0gJ3NlbGVjdG9yJyBBTkQgY2xhc3NlcyBJUyBOT1QgTlVMTFxuKVxuU0VMRUNUIGMsIENPVU5UKCopIEFTIGhpdHNcbkZST00gZXhwYW5kZWRcbkdST1VQIEJZIDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMzA7XG5cbi0tIDYpIENvbW1lbnRzIGpvaW5lZCB0byB0aGVpciBwYXJlbnQgc2VsZWN0b3IgdmlhIHBhcmVudFVpZC4gVGhlXG4tLSAgICBzLnR5cGUgZmlsdGVyIHByZXZlbnRzIGFuIGFjY2lkZW50YWwgZmVlZGJhY2vihpRmZWVkYmFjayBqb2luIGluIGNhc2Vcbi0tICAgIHR3byByb3dzIGV2ZXIgc2hhcmUgYSB1aWQgYnkgY29pbmNpZGVuY2UuXG5TRUxFQ1Qgcy5uLCBzLnNlbGVjdG9yLCBmLnRleHQsIGYudGFnc1xuRlJPTSBwZyBmXG5KT0lOIHBnIHNcbiAgT04gcy51aWQgPSBmLnBhcmVudFVpZFxuIEFORCBzLnR5cGUgPSAnc2VsZWN0b3InXG5XSEVSRSBmLnR5cGUgPSAnZmVlZGJhY2snXG5PUkRFUiBCWSBzLm47XG5gO1xuICBjb25zdCBvbkR1Y2tEYlNuaXBwZXQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgLy8gUHJlZmVyIHRoZSBKU09OTCBmaWxlbmFtZSBvZiB0aGUgbW9zdCByZWNlbnQgZXhwb3J0IHNvIHRoZSB1c2VyIGNhblxuICAgIC8vIHBhc3RlIHRoaXMgZGlyZWN0bHkgd2l0aG91dCBlZGl0aW5nIHRoZSByZWFkX2pzb25fYXV0byBwYXRoLiBGYWxsXG4gICAgLy8gYmFjayB0byBhIGZyZXNoIGVwb2NoLWJhc2VkIG5hbWUgaWYgbm90aGluZyBoYXMgYmVlbiBleHBvcnRlZCB5ZXQuXG4gICAgY29uc3QgbGFzdCA9IGxhc3RFeHBvcnQucmVsUGF0aDtcbiAgICBjb25zdCBqc29ubE5hbWUgPSAobGFzdCAmJiAvXFwuanNvbmwkLy50ZXN0KGxhc3QpKVxuICAgICAgPyBsYXN0LnNwbGl0KCcvJykucG9wKCkhICAvLyBzdHJpcCB3b3Jrc3BhY2UvZXhwb3J0cy8gcHJlZml4XG4gICAgICA6IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzcWwpO1xuICAgICAgc2V0U3RhdHVzKGBEdWNrREIgcmVjaXBlcyBjb3BpZWQgwrcgcGFzdGUgaW50byBcXGBkdWNrZGJcXGAgc2hlbGwgwrcgcmVmZXJlbmNlcyAke2pzb25sTmFtZX1gKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBEdWNrREIgU1FMJywganNvbmxOYW1lKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIGZhaWxlZCDigJQgb3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignQ2xpcGJvYXJkIGZhaWxlZCcsICdPcGVuIHRoZSBwYW5lbCBpbiBhbiBleHRlbnNpb24gY29udGV4dCcpO1xuICAgIH1cbiAgfTtcbiAgLy8g4pSA4pSA4pSAIFNjaGVtYSBtaWdyYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIENvbnZlcnQgYSB2MS1zaGFwZWQgRW50cnktb3ItZXhwb3J0LWxpbmUgaW50byBvdXIgaW50ZXJuYWwgRW50cnkuIElkZW1wb3RlbnQuXG4gIC8vIFN1cHBvcnRzOlxuICAvLyAgIOKAoiBmbGF0IHYxIGVudHJ5IChubyBgX2F1ZGl0YCwgbm8gYHZgIGZpZWxkKVxuICAvLyAgIOKAoiB2MiBleHBvcnQgZW50cnkgKGhhcyBgX2F1ZGl0YCwgYHY6IDJgLCBgdHlwZTogJ3NlbGVjdG9yJ2ApXG4gIC8vICAg4oCiIG1peGVkIChzb21lIGZpZWxkcyBuZXN0ZWQsIHNvbWUgZmxhdCDigJQgbGFzdCB3aW5zIGZvciBzYWZldHkpXG4gIC8vIFB1cmU6IG5ldmVyIG11dGF0ZXMgYHJhd2Agb3IgYW55IG9mIGl0cyBuZXN0ZWQgb2JqZWN0cy4gUmV0dXJucyBhIG5ld1xuICAvLyBlbnRyeSB3aXRoIGFsbCBtaWdyYXRpb25zIGFwcGxpZWQuIFRvdWNoZWQgc3Vib2JqZWN0cyAoYXR0cnMsIGhpbnRzLFxuICAvLyBncm91cCBtZW1iZXJzKSBhcmUgY2xvbmVkIGJlZm9yZSBlZGl0OyB1bnRvdWNoZWQgb25lcyBzaGFyZSByZWZzIHdpdGhcbiAgLy8gcmF3LCB3aGljaCBpcyBmaW5lIHNpbmNlIHdlIG5ldmVyIHdyaXRlIHRvIHRoZW0uXG4gIGNvbnN0IGRlbm9ybWFsaXplRW50cnkgPSAocmF3OiBhbnkpOiBFbnRyeSA9PiB7XG4gICAgY29uc3Qgb3V0OiBhbnkgPSB7Li4ucmF3fTtcbiAgICBkZWxldGUgb3V0LnY7XG4gICAgZGVsZXRlIG91dC50eXBlO1xuICAgIGRlbGV0ZSBvdXQuZmVlZGJhY2s7XG4gICAgaWYgKG91dC5fYXVkaXQgJiYgdHlwZW9mIG91dC5fYXVkaXQgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBhID0gb3V0Ll9hdWRpdDtcbiAgICAgIGlmIChhLmFuY2VzdG9ycyAhPT0gdW5kZWZpbmVkKSBvdXQuYW5jZXN0b3JzID0gYS5hbmNlc3RvcnM7XG4gICAgICBpZiAoYS5jb21wb25lbnRSb290ICE9PSB1bmRlZmluZWQpIG91dC5jb21wb25lbnRSb290ID0gYS5jb21wb25lbnRSb290O1xuICAgICAgaWYgKGEuaW5TaGFkb3dET00gIT09IHVuZGVmaW5lZCkgb3V0LmluU2hhZG93RE9NID0gYS5pblNoYWRvd0RPTTtcbiAgICAgIGlmIChhLnBzZXVkb0VsZW1lbnRzICE9PSB1bmRlZmluZWQpIG91dC5wc2V1ZG9FbGVtZW50cyA9IGEucHNldWRvRWxlbWVudHM7XG4gICAgICBpZiAoYS5tYXRjaGVkUnVsZXMgIT09IHVuZGVmaW5lZCkgb3V0Lm1hdGNoZWRSdWxlcyA9IGEubWF0Y2hlZFJ1bGVzO1xuICAgICAgaWYgKGEudmlld3BvcnQgIT09IHVuZGVmaW5lZCkgb3V0LnZpZXdwb3J0ID0gYS52aWV3cG9ydDtcbiAgICAgIGRlbGV0ZSBvdXQuX2F1ZGl0O1xuICAgIH1cbiAgICAvLyBzdGF0ZXM6IHYxIHVzZWQgUmVjb3JkPHN0cmluZywgdHJ1ZT47IHYyIHVzZXMgc3RyaW5nW10uIE5vcm1hbGl6ZSBib3RoLlxuICAgIGlmIChvdXQuc3RhdGVzICYmICFBcnJheS5pc0FycmF5KG91dC5zdGF0ZXMpICYmIHR5cGVvZiBvdXQuc3RhdGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgb3V0LnN0YXRlcyA9IE9iamVjdC5rZXlzKG91dC5zdGF0ZXMpLmZpbHRlcigoaykgPT4gQm9vbGVhbigob3V0LnN0YXRlcyBhcyBhbnkpW2tdKSk7XG4gICAgfVxuICAgIC8vIGF0dHJzLmZvcm1hdCDihpIgaGludHMuZm9ybWF0LiBDbG9uZSBhdHRycyBmaXJzdCBzbyB3ZSBkb24ndCBtdXRhdGUgdGhlXG4gICAgLy8gY2FsbGVyJ3MgbmVzdGVkIG9iamVjdC4gU2FtZSBmb3IgaGludHMgKHdlIG1heSBtZXJnZSBpbnRvIGl0KS5cbiAgICBpZiAob3V0LmF0dHJzICYmIHR5cGVvZiBvdXQuYXR0cnMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBvdXQuYXR0cnMuZm9ybWF0ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgZm10ID0gb3V0LmF0dHJzLmZvcm1hdDtcbiAgICAgIGNvbnN0IHtmb3JtYXQ6IF9kcm9wLCAuLi5yZXN0QXR0cnN9ID0gb3V0LmF0dHJzO1xuICAgICAgb3V0LmF0dHJzID0gcmVzdEF0dHJzO1xuICAgICAgb3V0LmhpbnRzID0gey4uLihvdXQuaGludHMgPz8ge30pLCBmb3JtYXQ6IGZtdH07XG4gICAgfVxuICAgIGlmICghb3V0LnVpZCkgb3V0LnVpZCA9IG1zZ0lkKCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob3V0Lmdyb3VwKSkgb3V0Lmdyb3VwID0gb3V0Lmdyb3VwLm1hcChkZW5vcm1hbGl6ZUVudHJ5KTtcbiAgICByZXR1cm4gb3V0IGFzIEVudHJ5O1xuICB9O1xuICAvLyBXYWxrIGFsbCBsb2FkZWQgbWVzc2FnZXMgYW5kIG1pZ3JhdGUgYW55IGxlZ2FjeSBlbnRyaWVzLiBSZXR1cm5zIHRydWUgaWZcbiAgLy8gYW55dGhpbmcgbXV0YXRlZCBzbyB0aGUgY2FsbGVyIGNhbiBwZXJzaXN0LlxuICBjb25zdCBtaWdyYXRlTG9hZGVkTWVzc2FnZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgbGV0IG11dGF0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgYmVmb3JlID0gbS5lbnRyeTtcbiAgICAgIC8vIENoZWFwIHByZS1jaGVjazogaWYgdWlkIGV4aXN0cyBBTkQgc3RhdGVzIGlzIGFuIGFycmF5IEFORCBubyBfYXVkaXRcbiAgICAgIC8vIEFORCBubyBhdHRycy5mb3JtYXQg4oaSIG5vdGhpbmcgdG8gZG8sIHNraXAgdGhlIHdvcmsuXG4gICAgICBjb25zdCBuZWVkc1dvcmsgPVxuICAgICAgICAhYmVmb3JlLnVpZCB8fFxuICAgICAgICAoYmVmb3JlLnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShiZWZvcmUuc3RhdGVzKSkgfHxcbiAgICAgICAgKGJlZm9yZSBhcyBhbnkpLl9hdWRpdCAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIChiZWZvcmUuYXR0cnMgJiYgdHlwZW9mIChiZWZvcmUuYXR0cnMgYXMgYW55KS5mb3JtYXQgPT09ICdzdHJpbmcnKTtcbiAgICAgIGlmICghbmVlZHNXb3JrKSBjb250aW51ZTtcbiAgICAgIG0uZW50cnkgPSBkZW5vcm1hbGl6ZUVudHJ5KGJlZm9yZSk7XG4gICAgICBtdXRhdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG11dGF0ZWQ7XG4gIH07XG4gIGNvbnN0IG9uSW1wb3J0ID0gKCk6IHZvaWQgPT4gaW1wb3J0RmlsZS5jbGljaygpO1xuICBpbXBvcnRGaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5maWxlcz8uWzBdO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgIGNvbnN0IGltcG9ydGVkOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiB0ZXh0LnNwbGl0KC9cXHI/XFxuLykpIHtcbiAgICAgIGlmICghbGluZS50cmltKCkpIGNvbnRpbnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbyA9IEpTT04ucGFyc2UobGluZSk7XG4gICAgICAgIGlmIChvLnR5cGUgPT09ICdtYW5pZmVzdCcpIHtcbiAgICAgICAgICAvLyBNYW5pZmVzdCBsaW5lIOKAlCBpbmZvcm1hdGlvbmFsIG9ubHkgb24gaW1wb3J0LiBTa2lwLlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvLnR5cGUgPT09ICdwYWdlJykgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3BhZ2UnLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB1cmw6IG8udXJsLCB0aXRsZTogby50aXRsZSwgdmlld3BvcnQ6IG8udmlld3BvcnQsIHRva2Vuczogby50b2tlbnMsIHVzZXJBZ2VudDogby51c2VyQWdlbnQsIGxhbmc6IG8ubGFuZ30pO1xuICAgICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksXG4gICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQ6IG8udGV4dCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChvLnBhcmVudFVpZCkgZmIucGFyZW50VWlkID0gby5wYXJlbnRVaWQ7XG4gICAgICAgICAgaWYgKG8uZGV0YWNoZWQpIGZiLmRldGFjaGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvLnRhZ3MpICYmIG8udGFncy5sZW5ndGgpIGZiLnRhZ3MgPSBvLnRhZ3M7XG4gICAgICAgICAgaWYgKG8uc2V2ZXJpdHkpIGZiLnNldmVyaXR5ID0gby5zZXZlcml0eTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKGZiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzZWxlY3RvciBsaW5lIOKAlCBjb3VsZCBiZSB2MSAoZmxhdCkgb3IgdjIgKHdpdGggX2F1ZGl0KS4gVGhlXG4gICAgICAgICAgLy8gYnVuZGxlZCBmZWVkYmFjayBhcnJheSBtdXN0IGJlIHNwbGl0IG91dCBpbnRvIHNlcGFyYXRlIGZlZWRiYWNrXG4gICAgICAgICAgLy8gbWVzc2FnZXMgZm9yIHJvdW5kLXRyaXAgd2l0aCB2MSByZWFkZXJzIOKAlCBidXQgaW4gdjIgd2UgYWxyZWFkeVxuICAgICAgICAgIC8vIGVtaXQgc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lcywgc28gZHJvcHBpbmcgdGhlIGJ1bmRsZWQgbGlzdCBpc1xuICAgICAgICAgIC8vIHNhZmUgdG8gYXZvaWQgZG91YmxlLWNvdW50aW5nLlxuICAgICAgICAgIGNvbnN0IGZiID0gQXJyYXkuaXNBcnJheShvLmZlZWRiYWNrKSA/IG8uZmVlZGJhY2sgOiBudWxsO1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShvKTtcbiAgICAgICAgICBpbXBvcnRlZC5wdXNoKHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBlbnRyeX0pO1xuICAgICAgICAgIC8vIE9ubHkgaW5mbGF0ZSBidW5kbGVkIGZlZWRiYWNrIGlmIHRoZSBmaWxlIGlzIHYxIChubyB2ZXJzaW9uXG4gICAgICAgICAgLy8gbWFya2VyIG9uIHRoZSBzZWxlY3RvciBsaW5lcykuIHYyIGhhcyBpdHMgb3duIHN0YW5kYWxvbmVcbiAgICAgICAgICAvLyBmZWVkYmFjayBsaW5lcyB0aGF0IGFycml2ZSBzZXBhcmF0ZWx5LlxuICAgICAgICAgIGlmIChmYiAmJiBvLnYgIT09IDIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBmYikgaW1wb3J0ZWQucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgICB0czogby50cyA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgIHRleHQ6IHR5cGVvZiB0ID09PSAnc3RyaW5nJyA/IHQgOiB0Py50ZXh0ID8/ICcnLFxuICAgICAgICAgICAgICBwYXJlbnRVaWQ6IGVudHJ5LnVpZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7IC8qIHNraXAgYmFkIGxpbmUgKi8gfVxuICAgIH1cbiAgICBtZXNzYWdlcyA9IFsuLi5tZXNzYWdlcywgLi4uaW1wb3J0ZWRdO1xuICAgIHBlcnNpc3QoKTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgcmVuZGVyKCk7XG4gICAgc2V0U3RhdHVzKGBJbXBvcnRlZCAke2ltcG9ydGVkLmxlbmd0aH0gbWVzc2FnZSR7aW1wb3J0ZWQubGVuZ3RoID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgaW1wb3J0RmlsZS52YWx1ZSA9ICcnO1xuICB9KTtcbiAgLy8g4pSA4pSA4pSAIFdvcmtzcGFjZSBzbmFwc2hvdCBoaXN0b3J5IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBQZXJzaXN0ZW50IChub3QgdGhlIGluLXNlc3Npb24gdW5kbyBzdGFjaykuIEEgQ2xlYXItYWxsIGFyY2hpdmVzIHRoZVxuICAvLyBjdXJyZW50IHdvcmtzcGFjZSBzdGF0ZSBzbyBpdCBjYW4gYmUgcmVzdG9yZWQgZnJvbSBTZXR0aW5ncyBsYXRlci5cbiAgbGV0IHdzU25hcHNob3RzOiBXb3Jrc3BhY2VTbmFwc2hvdFtdID0gW107XG4gIGNvbnN0IGxvYWRXc1NuYXBzaG90cyA9IGFzeW5jIChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICB3c1NuYXBzaG90cyA9IChhd2FpdCBTdG9yZS5nZXQ8V29ya3NwYWNlU25hcHNob3RbXT4od3NTbmFwc2hvdHNLZXkobmFtZSksIFtdKSkgfHwgW107XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RXc1NuYXBzaG90cyA9ICgpOiB2b2lkID0+IHsgdm9pZCBTdG9yZS5zZXQod3NTbmFwc2hvdHNLZXkoYWN0aXZlV3MpLCB3c1NuYXBzaG90cyk7IH07XG4gIC8vIEFyY2hpdmUgdGhlIENVUlJFTlQgd29ya3NwYWNlIHN0YXRlIChiZWZvcmUgaXQncyB3aXBlZCkuIE5vLW9wIGlmIGVtcHR5LlxuICBjb25zdCBhcmNoaXZlV29ya3NwYWNlU25hcHNob3QgPSAoKTogV29ya3NwYWNlU25hcHNob3QgfCBudWxsID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgc25hcDogV29ya3NwYWNlU25hcHNob3QgPSB7XG4gICAgICBpZDogc2VjdXJlVG9rZW4oOCksXG4gICAgICB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgbWVzc2FnZXM6IHN0cnVjdHVyZWRDbG9uZShtZXNzYWdlcyksXG4gICAgICBzaG90czogT2JqZWN0LmZyb21FbnRyaWVzKHNob3RzKSxcbiAgICAgIHNlbGVjdG9yczogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLmxlbmd0aCxcbiAgICAgIGNvbW1lbnRzOiBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykubGVuZ3RoLFxuICAgIH07XG4gICAgLy8gTmV3ZXN0IGZpcnN0OyBjYXAgdGhlIGhpc3RvcnkuXG4gICAgd3NTbmFwc2hvdHMudW5zaGlmdChzbmFwKTtcbiAgICBpZiAod3NTbmFwc2hvdHMubGVuZ3RoID4gV1NfU05BUFNIT1RfQ0FQKSB3c1NuYXBzaG90cyA9IHdzU25hcHNob3RzLnNsaWNlKDAsIFdTX1NOQVBTSE9UX0NBUCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmV0dXJuIHNuYXA7XG4gIH07XG4gIGNvbnN0IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdCA9IChpZDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3Qgc25hcCA9IHdzU25hcHNob3RzLmZpbmQoKHMpID0+IHMuaWQgPT09IGlkKTtcbiAgICBpZiAoIXNuYXApIHJldHVybiBmYWxzZTtcbiAgICAvLyBQdXNoIHRoZSBsaXZlIHN0YXRlIG9udG8gdGhlIGluLXNlc3Npb24gdW5kbyBzdGFjayBzbyBhIG1pc3Rha2VuXG4gICAgLy8gcmVzdG9yZSBpcyBpdHNlbGYgdW5kb2FibGUuXG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IHN0cnVjdHVyZWRDbG9uZShzbmFwLm1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHNuYXAuc2hvdHMpKSBzaG90cy5zZXQoaywgdik7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICBzZXRTdGF0dXMoYFJlc3RvcmVkIHNuYXBzaG90IMK3ICR7c25hcC5zZWxlY3RvcnN9IHNlbGVjdG9yc2ApO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICBjb25zdCBkZWxldGVXb3Jrc3BhY2VTbmFwc2hvdCA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5maWx0ZXIoKHMpID0+IHMuaWQgIT09IGlkKTtcbiAgICBwZXJzaXN0V3NTbmFwc2hvdHMoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gIH07XG5cbiAgY29uc3Qgb25DbGVhciA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWNvbmZpcm0oJ0NsZWFyIGFsbCBjYXB0dXJlcz8gQSBzbmFwc2hvdCB3aWxsIGJlIHNhdmVkIHRvIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzIGZpcnN0LicpKSByZXR1cm47XG4gICAgLy8gQXJjaGl2ZSB0aGUgd29ya3NwYWNlIEJFRk9SRSB3aXBpbmcgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGxhdGVyLlxuICAgIGNvbnN0IHNuYXAgPSBhcmNoaXZlV29ya3NwYWNlU25hcHNob3QoKTtcbiAgICBzbmFwc2hvdCgpO1xuICAgIG1lc3NhZ2VzID0gW107XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBlcnNpc3RTaG90cygpO1xuICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIC8vIE5ldmVyIGNsYWltIGEgc25hcHNob3QgdGhhdCBkaWRuJ3QgaGFwcGVuIChlbXB0eSB3b3Jrc3BhY2Ugbm8tb3BzKS5cbiAgICBzZXRTdGF0dXMoc25hcCA/ICdDbGVhcmVkIMK3IHNuYXBzaG90IHNhdmVkIOKAlCByZXN0b3JlIGluIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzJyA6ICdDbGVhcmVkJyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFZhbGlkYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJldHVybnMgYSBzdW1tYXJ5IHNvIHRoZSBjYWxsZXIgY2FuIGdpdmUgaG9uZXN0IGZlZWRiYWNrOiBgYXR0YWNoZWRgXG4gIC8vIGRpc3Rpbmd1aXNoZXMgXCJjb250ZW50IHNjcmlwdCBpc24ndCBvbiB0aGUgcGFnZVwiICh0aGUgc2lsZW50LW5vLW9wIGNhc2VcbiAgLy8gdGhhdCBtYWRlIHRoaXMgZmVhdHVyZSBmZWVsIHVzZWxlc3MpIGZyb20gYSByZWFsIHJlc29sdmUvbWlzcyBjb3VudC5cbiAgdHlwZSBWYWxpZGF0aW9uUmVzdWx0ID0ge3RvdGFsOiBudW1iZXI7IHJlc29sdmVkOiBudW1iZXI7IGF0dGFjaGVkOiBib29sZWFufTtcbiAgY29uc3QgcnVuVmFsaWRhdGlvbiA9IGFzeW5jICgpOiBQcm9taXNlPFZhbGlkYXRpb25SZXN1bHQ+ID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBbLi4ubmV3IFNldChtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3RvcikpXTtcbiAgICBpZiAoIXNlbGVjdG9ycy5sZW5ndGggfHwgIWluRXh0ZW5zaW9uKSByZXR1cm4ge3RvdGFsOiBzZWxlY3RvcnMubGVuZ3RoLCByZXNvbHZlZDogMCwgYXR0YWNoZWQ6IHRydWV9O1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgaWYgKCF0YWJzWzBdKSByZXR1cm4ge3RvdGFsOiBzZWxlY3RvcnMubGVuZ3RoLCByZXNvbHZlZDogMCwgYXR0YWNoZWQ6IGZhbHNlfTtcbiAgICAgIGxpdmVUYWJVcmwgPSB0YWJzWzBdLnVybCA/PyBsaXZlVGFiVXJsO1xuICAgICAgbGl2ZVRhYlBhdGggPSBwYXRoT2YobGl2ZVRhYlVybCA/PyAnJyk7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQhLCBwZyh7a2luZDogJ3ZhbGlkYXRlJywgc2VsZWN0b3JzfSkpIGFzIHt2YWxpZD86IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+fTtcbiAgICAgIGlmICghcmVwbHk/LnZhbGlkKSByZXR1cm4ge3RvdGFsOiBzZWxlY3RvcnMubGVuZ3RoLCByZXNvbHZlZDogMCwgYXR0YWNoZWQ6IGZhbHNlfTtcbiAgICAgIGxldCByZXNvbHZlZCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IFtzZWwsIG9rXSBvZiBPYmplY3QuZW50cmllcyhyZXBseS52YWxpZCkpIHtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5zZXQoc2VsLCBvayk7XG4gICAgICAgIGlmIChvaykgcmVzb2x2ZWQrKztcbiAgICAgICAgZWxzZSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCAnTm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMgdGhpcyBzZWxlY3Rvci4nKTtcbiAgICAgIH1cbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuIHt0b3RhbDogc2VsZWN0b3JzLmxlbmd0aCwgcmVzb2x2ZWQsIGF0dGFjaGVkOiB0cnVlfTtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIHt0b3RhbDogc2VsZWN0b3JzLmxlbmd0aCwgcmVzb2x2ZWQ6IDAsIGF0dGFjaGVkOiBmYWxzZX07IH1cbiAgfTtcbiAgY29uc3Qgb25WYWxpZGF0ZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLnNvbWUoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykpIHsgc2V0U3RhdHVzKCdObyBzZWxlY3RvcnMgdG8gcmUtY2hlY2snLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHNldFN0YXR1cygnUmUtY2hlY2tpbmcgc2VsZWN0b3JzIG9uIHRoZSBsaXZlIHBhZ2XigKYnLCB7a2luZDogJ2luZm8nfSk7XG4gICAgY29uc3QgciA9IGF3YWl0IHJ1blZhbGlkYXRpb24oKTtcbiAgICBpZiAoIXIuYXR0YWNoZWQpIHtcbiAgICAgIHNldFN0YXR1cyhcIkNhbid0IHJlYWNoIHRoZSBwYWdlIOKAlCB1c2UgUmUtYXR0YWNoIHRvIHBhZ2UgKENtZCtLKSwgdGhlbiByZS1jaGVja1wiLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1pc3NlZCA9IHIudG90YWwgLSByLnJlc29sdmVkO1xuICAgIHNldFN0YXR1cyhcbiAgICAgIG1pc3NlZCA9PT0gMFxuICAgICAgICA/IGBBbGwgJHtyLnRvdGFsfSBzZWxlY3RvciR7ci50b3RhbCA9PT0gMSA/ICcnIDogJ3MnfSByZXNvbHZlIG9uIHRoZSBsaXZlIHBhZ2Ug4pyTYFxuICAgICAgICA6IGAke3IucmVzb2x2ZWR9LyR7ci50b3RhbH0gc2VsZWN0b3JzIHJlc29sdmUgwrcgJHttaXNzZWR9IG5vIGxvbmdlciBtYXRjaCAoZmxhZ2dlZCBTdGFsZSlgLFxuICAgICAgbWlzc2VkID09PSAwID8ge2tpbmQ6ICdvayd9IDoge2tpbmQ6ICd3YXJuJ30sXG4gICAgKTtcbiAgfTtcblxuICAvLyAoU2NyZWVuc2hvdCBtYWNoaW5lcnkgcmVtb3ZlZCBhbG9uZ3NpZGUgdGhlIC5wcmV2aWV3IHRpbGUuKVxuXG4gIC8vIOKUgOKUgOKUgCBHaXRIdWIgc3RhcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGZldGNoU3RhcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSAncGluY2hncmFiLmdoLnN0YXJzJztcbiAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBTdG9yZS5nZXQ8e2NvdW50OiBudW1iZXI7IHRzOiBudW1iZXJ9IHwgbnVsbD4oY2FjaGVLZXksIG51bGwpO1xuICAgIGlmIChjYWNoZWQgJiYgRGF0ZS5ub3coKSAtIGNhY2hlZC50cyA8IDNfNjAwXzAwMCkge1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjYWNoZWQuY291bnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3dyYW5uZ2xlL3BpbmNoZ3JhYicsIHtjYWNoZTogJ25vLXN0b3JlJ30pO1xuICAgICAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ3N0YXR1cyAnICsgci5zdGF0dXMpO1xuICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpIGFzIHtzdGFyZ2F6ZXJzX2NvdW50PzogbnVtYmVyfTtcbiAgICAgIGNvbnN0IGNvdW50ID0gai5zdGFyZ2F6ZXJzX2NvdW50ID8/IDA7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50KTtcbiAgICAgIHZvaWQgU3RvcmUuc2V0KGNhY2hlS2V5LCB7Y291bnQsIHRzOiBEYXRlLm5vdygpfSk7XG4gICAgfSBjYXRjaCB7IHN0YXJzRWwudGV4dENvbnRlbnQgPSAnwrcnOyB9XG4gIH07XG4gIGNvbnN0IG9uR2l0aHViID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vd3Jhbm5nbGUvcGluY2hncmFiJztcbiAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsfSk7XG4gICAgZWxzZSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgfTtcblxuICAvLyBSZS1pbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gdGhlIGFjdGl2ZSB0YWIg4oCUIHRoZSByZWNvdmVyeSBwYXRoXG4gIC8vIGZvciBcIkFsdCtDbGljayBzdG9wcGVkIHdvcmtpbmdcIiAoYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gc2NyaXB0KS4gUmVmcmVzaGluZyBhbiBhdHRhY2hlZCB0YWIgcmUtaW5qZWN0cyBhdXRvbWF0aWNhbGx5OyB0aGlzXG4gIC8vIGNvdmVycyBldmVyeSBvdGhlciBjYXNlIHdpdGhvdXQgaHVudGluZyBmb3IgdGhlIHRvb2xiYXIgaWNvbi5cbiAgY29uc3Qgb25SZWF0dGFjaCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7IHNldFN0YXR1cygnUmUtYXR0YWNoIG9ubHkgd29ya3MgaW5zaWRlIHRoZSBleHRlbnNpb24nLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8e29rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAncGctcmVpbmplY3QnfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKCdSZS1hdHRhY2hlZCDigJQgQWx0K0NsaWNrIGlzIGxpdmUnKTtcbiAgICBlbHNlIHNldFN0YXR1cyhgQ291bGRuJ3QgcmUtYXR0YWNoIOKAlCBjbGljayB0aGUgUGluY2hHcmFiIHRvb2xiYXIgYnV0dG9uIG9uIHRoZSBwYWdlJHtyZXBseT8uZXJyb3IgPyBgIMK3ICR7cmVwbHkuZXJyb3J9YCA6ICcnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUXVpZXQtc2F2ZXMgbnVkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHF1aWV0U2F2ZXMgZGVmYXVsdHMgT04gYXMgaW50ZW50LCBidXQgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aVxuICAvLyBwZXJtaXNzaW9uIENocm9tZSBkZW1hbmRzIGNhbiBvbmx5IGJlIHJlcXVlc3RlZCBpbnNpZGUgYSB1c2VyIGdlc3R1cmUuXG4gIC8vIFRoaXMgYmFubmVyIGlzIHRoYXQgZ2VzdHVyZTogc2hvd24gd2hpbGUgdGhlIHByZWYgaXMgb24sIHRoZSBwZXJtaXNzaW9uXG4gIC8vIGlzIG1pc3NpbmcsIGFuZCB0aGUgdXNlciBoYXNuJ3QgZGlzbWlzc2VkIGl0LlxuICBjb25zdCBxdWlldE51ZGdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXF1aWV0LW51ZGdlXScpO1xuICBjb25zdCBtYXliZVNob3dRdWlldE51ZGdlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcXVpZXROdWRnZSB8fCAhaW5FeHRlbnNpb24gfHwgIWNocm9tZS5wZXJtaXNzaW9ucz8uY29udGFpbnMpIHJldHVybjtcbiAgICBpZiAoIXByZWZzLnF1aWV0U2F2ZXMgfHwgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCkgeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IHJldHVybjsgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pO1xuICAgICAgcXVpZXROdWRnZS5oaWRkZW4gPSBncmFudGVkO1xuICAgIH0gY2F0Y2ggeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IH1cbiAgfTtcbiAgY29uc3Qgb25RdWlldEVuYWJsZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgZ3JhbnRlZCA9IGZhbHNlO1xuICAgIHRyeSB7IGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KTsgfVxuICAgIGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy51aSBwZXJtaXNzaW9uIHJlcXVlc3QgZmFpbGVkJywgZXJyKTsgfVxuICAgIHByZWZzLnF1aWV0U2F2ZXMgPSBncmFudGVkO1xuICAgIGlmICghZ3JhbnRlZCkgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7IC8vIGRlY2xpbmVkIG9uY2Ug4oCUIG5ldmVyIG5hZyBhZ2FpblxuICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgaWYgKHF1aWV0TnVkZ2UpIHF1aWV0TnVkZ2UuaGlkZGVuID0gdHJ1ZTtcbiAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1NhdmVzIHN0YXkgdmlzaWJsZSDigJQgcmUtZW5hYmxlIGluIFNldHRpbmdzIOKGkiBDYXB0dXJlJywgZ3JhbnRlZCA/IHt9IDoge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuICBjb25zdCBvblF1aWV0RGlzbWlzcyA9ICgpOiB2b2lkID0+IHtcbiAgICBwcmVmcy5xdWlldFNhdmVzID0gZmFsc2U7XG4gICAgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7XG4gICAgcGVyc2lzdFByZWZzKCk7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICBpZiAocXVpZXROdWRnZSkgcXVpZXROdWRnZS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBzbWFsbCBkb2N1bWVudCBzdW1tYXJpZXMuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBtYXJrZG93bk92ZXJ2aWV3ID0gKGNvbnRlbnQ6IHN0cmluZywga2luZDogTWRLaW5kLCB1c2luZ1RlbXBsYXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQudHJpbSgpID8gY29udGVudC5zcGxpdCgnXFxuJykubGVuZ3RoIDogMDtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFtjb250ZW50XSkuc2l6ZTtcbiAgICBjb25zdCBoZWFkaW5ncyA9IGNvbnRlbnRcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5tYXAoKGxpbmUpID0+IC9eI3sxLDN9XFxzKyguKykkLy5leGVjKGxpbmUudHJpbSgpKT8uWzFdPy50cmltKCkpXG4gICAgICAuZmlsdGVyKChoZWFkaW5nKTogaGVhZGluZyBpcyBzdHJpbmcgPT4gQm9vbGVhbihoZWFkaW5nKSlcbiAgICAgIC5zbGljZSgwLCA0KTtcbiAgICAvLyBXYXJtLCBwbGFpbi1sYW5ndWFnZSBmcmFtaW5nIG9mIHdoYXQgZWFjaCBmaWxlIHRlYWNoZXMgdGhlIGFnZW50LlxuICAgIC8vIERFU0lHTi5tZCBpcyB0aGUgaGVhZGxpbmUgYXJ0aWZhY3Q6IGl0J3Mgd2hlcmUgeW91IGRlc2NyaWJlIHlvdXIgb3duXG4gICAgLy8gYnJhbmQgYW5kIFVJIHRhc3RlIHNvIHRoZSBhZ2VudCBidWlsZHMgaW4gKnlvdXIqIHZvaWNlIHJhdGhlciB0aGFuIGFcbiAgICAvLyBnZW5lcmljIGRlZmF1bHQuIFNLSUxMLm1kIGlzIHRoZSBhZHZhbmNlZCB0cmlhZ2UgZ3VpZGUgZm9yIHJlYWRpbmdcbiAgICAvLyBleHBvcnRzIOKAlCB1c2VmdWwsIGJ1dCBub3Qgd2hlcmUgbW9zdCBwZW9wbGUgc2hvdWxkIHN0YXJ0LlxuICAgIGNvbnN0IGxhYmVsID0ga2luZCA9PT0gJ2Rlc2lnbidcbiAgICAgID8gJ1RlYWNoZXMgeW91ciBhZ2VudCB0byBidWlsZCBVSSBpbiB5b3VyIGJyYW5kJ1xuICAgICAgOiAnQWR2YW5jZWQ6IGhvdyB5b3VyIGFnZW50IHNob3VsZCByZWFkIFBpbmNoR3JhYiBleHBvcnRzJztcbiAgICBjb25zdCBzb3VyY2UgPSB1c2luZ1RlbXBsYXRlXG4gICAgICA/IChraW5kID09PSAnZGVzaWduJyA/ICdTdGFydGVyIHRlbXBsYXRlIOKAlCBtYWtlIGl0IHlvdXJzJyA6ICdCdW5kbGVkIHRlbXBsYXRlJylcbiAgICAgIDogJ0N1c3RvbWl6ZWQnO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gaGVhZGluZ3MubGVuZ3RoID8gaGVhZGluZ3Muam9pbignIC8gJykgOiAnTm8gc2VjdGlvbiBoZWFkaW5ncyBmb3VuZCc7XG4gICAgcmV0dXJuIGAke2xhYmVsfVxcbiR7c291cmNlfSDCtyAke2xpbmVzLnRvTG9jYWxlU3RyaW5nKCl9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JcXG5TZWN0aW9uczogJHtzZWN0aW9uc31gO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1kUHJldmlldyA9IGFzeW5jIChraW5kOiAnZGVzaWduJyB8ICdza2lsbCcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwcmV2aWV3RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtbWQtcHJldmlldz1cIiR7a2luZH1cIl1gKTtcbiAgICBpZiAoIXByZXZpZXdFbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBraW5kID09PSAnZGVzaWduJyA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGtpbmQgPT09ICdkZXNpZ24nID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHByZXZpZXdFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcoY29udGVudCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk1kTW9kYWwgPSBhc3luYyAoa2luZDogTWRLaW5kKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgICBjb25zdCB0aXRsZUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGl0bGVdJykhO1xuICAgIGNvbnN0IHRhRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRleHRhcmVhXScpITtcbiAgICBjb25zdCBzdGF0c0VsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3RhdHNdJykhO1xuICAgIGNvbnN0IGJhbm5lckVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtYmFubmVyXScpITtcbiAgICBjb25zdCBzdW1tYXJ5RWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdW1tYXJ5XScpITtcbiAgICBjb25zdCBzYXZlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc2F2ZV0nKSE7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1yZXNldF0nKSE7XG4gICAgY29uc3QgdXBsb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdXBsb2FkXScpITtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWRvd25sb2FkXScpITtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWNsb3NlXScpITtcblxuICAgIGNvbnN0IGlzRGVzaWduID0ga2luZCA9PT0gJ2Rlc2lnbic7XG4gICAgY29uc3QgaW5pdGlhbCA9IGlzRGVzaWduID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0gaXNEZXNpZ24gPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGlzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnUGluY2hHcmFiIFNLSUxMLm1kJztcbiAgICB0YUVsLnZhbHVlID0gaW5pdGlhbDtcbiAgICBvdmVybGF5LmRhdGFzZXQua2luZCA9IGtpbmQ7XG5cbiAgICBjb25zdCByZWZyZXNoU3RhdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICBzdGF0c0VsLnRleHRDb250ZW50ID0gYCR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgICAgc3VtbWFyeUVsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyh0ZXh0LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIGNvbnN0IGtleSA9IHQuZGF0YXNldC5wcmVmITtcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgLy8gUXVpZXQgc2F2ZXMgbmVlZHMgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aSBwZXJtaXNzaW9uOyByZXF1ZXN0IGl0XG4gICAgICAvLyBpbnNpZGUgdGhpcyB1c2VyIGdlc3R1cmUgYW5kIHJldmVydCB0aGUgY2hlY2tib3ggb24gZGVjbGluZS5cbiAgICAgIGlmIChrZXkgPT09ICdxdWlldFNhdmVzJyAmJiBjaGVja2VkICYmIGluRXh0ZW5zaW9uICYmIGNocm9tZS5wZXJtaXNzaW9ucz8ucmVxdWVzdCkge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGdyYW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0cnkgeyBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3Qoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7IH1cbiAgICAgICAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMudWkgcGVybWlzc2lvbiByZXF1ZXN0IGZhaWxlZCcsIGVycik7IH1cbiAgICAgICAgICBwcmVmcy5xdWlldFNhdmVzID0gZ3JhbnRlZDtcbiAgICAgICAgICAodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gZ3JhbnRlZDtcbiAgICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1Blcm1pc3Npb24gZGVjbGluZWQg4oCUIHNhdmVzIHN0YXkgdmlzaWJsZScsIGdyYW50ZWQgPyB7fSA6IHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IGNoZWNrZWQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodC5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9ICh0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgLy8gVGV4dGFyZWEgaW5wdXRzIGFsc28gZmlyZSBgaW5wdXRgIGV2ZW50cyBhcyB0aGUgdXNlciB0eXBlcyDigJQgd2Ugd2FudCB0b1xuICAvLyBzYXZlIHRob3NlIGluY3JlbWVudGFsbHkgc28gYSBwYW5lbCByZWxvYWQgZG9lc24ndCBsb3NlIGhhbGYtdHlwZWRcbiAgLy8gZW50cmllcy4gYGNoYW5nZWAgb25seSBmaXJlcyBvbiBibHVyIGZvciB0ZXh0YXJlYXMuXG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICh0Py5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9IHQudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBvcGVuRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gZmFsc2U7IHJlbmRlcldzQ29udHJvbHMoKTsgfTtcbiAgY29uc3QgY2xvc2VEcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSB0cnVlOyB9O1xuXG4gIC8vIFJldXNhYmxlIGNyZWF0ZS13b3Jrc3BhY2UgZmxvdzogdmFsaWRhdGVzIHVuaXF1ZW5lc3MsIHBlcnNpc3RzLCBzd2l0Y2hlcy5cbiAgLy8gU2hhcmVkIGJ5IHRoZSBzZXR0aW5ncyBDcmVhdGUgYnV0dG9uIGFuZCB0aGUgaGVhZGVyIGRyb3Bkb3duJ3NcbiAgLy8gXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gYm90aCBwYXRocyBiZWhhdmUgaWRlbnRpY2FsbHkuXG4gIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUZsb3cgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5hbWUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gdHJpbW1lZCkpIHtcbiAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZTogdHJpbW1lZCwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodHJpbW1lZCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHNldFN0YXR1cyhgQ3JlYXRlZCB3b3Jrc3BhY2UgXCIke3RyaW1tZWR9XCJgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICAvLyBJbmxpbmUgXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gdXNlcnMgY2FuIHNwaW4gdXAgYSB3b3Jrc3BhY2VcbiAgICAvLyBzdHJhaWdodCBmcm9tIHRoZSBoZWFkZXIgc3dpdGNoZXIgd2l0aG91dCBvcGVuaW5nIHNldHRpbmdzLiBIYW5kbGVkXG4gICAgLy8gYXMgYSBzZW50aW5lbCB2YWx1ZSBpbiB0aGUgY2hhbmdlIGxpc3RlbmVyIGJlbG93LlxuICAgIGNvbnN0IG5ld09wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdC52YWx1ZSA9ICdfX25ld193b3Jrc3BhY2VfXyc7XG4gICAgbmV3T3B0LnRleHRDb250ZW50ID0gJysgTmV3IHdvcmtzcGFjZSc7XG4gICAgd3NTZWxlY3QuYXBwZW5kKG5ld09wdCk7XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGZvY3VzV29ya3NwYWNlVGFiKHcubmFtZSk7XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBEZWxldGUgd29ya3NwYWNlICR7dy5uYW1lfWApO1xuICAgICAgICBkZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgaWYgKCFjb25maXJtKGBEZWxldGUgd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCIgYW5kIGFsbCBpdHMgY2FwdHVyZXM/YCkpIHJldHVybjtcbiAgICAgICAgICB3b3Jrc3BhY2VzID0gd29ya3NwYWNlcy5maWx0ZXIoKHgpID0+IHgubmFtZSAhPT0gdy5uYW1lKTtcbiAgICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFt3c01zZ0tleSh3Lm5hbWUpLCB3c1Nob3RzS2V5KHcubmFtZSksIHdzU2hvdHNGdWxsS2V5KHcubmFtZSksIHdzU25hcHNob3RzS2V5KHcubmFtZSldKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgICAgICBpZiAoYWN0aXZlV3MgPT09IHcubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3b3Jrc3BhY2VzWzBdIS5uYW1lKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpLmFwcGVuZChkZWwpO1xuICAgICAgfVxuICAgICAgd3NMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuICAgIHJlbmRlcldzU25hcHNob3RIaXN0b3J5KCk7XG4gIH07XG5cbiAgLy8gUmVuZGVyIHRoZSBhY3RpdmUgd29ya3NwYWNlJ3Mgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKSB3aXRoXG4gIC8vIGEgUmVzdG9yZSBhY3Rpb24uIEFwcGVuZGVkIHVuZGVyIHRoZSB3b3Jrc3BhY2UgbGlzdCBpbiBTZXR0aW5ncy5cbiAgY29uc3QgcmVuZGVyV3NTbmFwc2hvdEhpc3RvcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS13cy1zbmFwc2hvdHNdJyk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAoIXdzU25hcHNob3RzLmxlbmd0aCkge1xuICAgICAgaG9zdC5oaWRkZW4gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBob3N0LmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgU25hcHNob3QgaGlzdG9yeSDCtyAke3dzU25hcHNob3RzLmxlbmd0aH1gO1xuICAgIGhlYWQuZGF0YXNldC50aXAgPSAnUmVzdG9yYWJsZSBzbmFwc2hvdHMgc2F2ZWQgYmVmb3JlIGVhY2ggQ2xlYXItYWxsJztcbiAgICBob3N0LmFwcGVuZChoZWFkKTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdWwuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbGlzdCc7XG4gICAgZm9yIChjb25zdCBzbmFwIG9mIHdzU25hcHNob3RzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3Mtc25hcC1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBgJHtuZXcgRGF0ZShzbmFwLnRzKS50b0xvY2FsZVN0cmluZygpfSDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWwgwrcgJHtzbmFwLmNvbW1lbnRzfSBjbXRgO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgY29uc3QgcmVzdG9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcmVzdG9yZS50eXBlID0gJ2J1dHRvbic7XG4gICAgICByZXN0b3JlLmNsYXNzTmFtZSA9ICd3cy1zbmFwLXJlc3RvcmUnO1xuICAgICAgcmVzdG9yZS50ZXh0Q29udGVudCA9ICdSZXN0b3JlJztcbiAgICAgIHJlc3RvcmUuZGF0YXNldC50aXAgPSAnUmVzdG9yZSB0aGlzIHNuYXBzaG90IGludG8gdGhlIGN1cnJlbnQgd29ya3NwYWNlIChjdXJyZW50IHN0YXRlIGlzIGtlcHQgb24gdGhlIHVuZG8gc3RhY2spJztcbiAgICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoICYmICFjb25maXJtKCdSZXN0b3JlIHRoaXMgc25hcHNob3Q/IFRoZSBjdXJyZW50IGNhcHR1cmVzIHdpbGwgYmUgcmVwbGFjZWQgKHVuZG9hYmxlKS4nKSkgcmV0dXJuO1xuICAgICAgICByZXN0b3JlV29ya3NwYWNlU25hcHNob3Qoc25hcC5pZCk7XG4gICAgICB9KTtcbiAgICAgIGxpLmFwcGVuZChyZXN0b3JlKTtcbiAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyIHdzLXNuYXAtZGVsJztcbiAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyBzbmFwc2hvdCc7XG4gICAgICBkZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBzbmFwc2hvdCcpO1xuICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEyKTtcbiAgICAgIGRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGRlbGV0ZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgfVxuICAgIGhvc3QuYXBwZW5kKHVsKTtcbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ19fbmV3X3dvcmtzcGFjZV9fJykge1xuICAgICAgLy8gUmVzZXQgdGhlIHNlbGVjdCBiYWNrIHRvIHRoZSBhY3RpdmUgd29ya3NwYWNlIGZpcnN0IHNvIHRoZSBzZW50aW5lbFxuICAgICAgLy8gbmV2ZXIgc3RpY2tzIGFzIHRoZSBkaXNwbGF5ZWQgdmFsdWUgaWYgdGhlIHByb21wdCBpcyBjYW5jZWxsZWQuXG4gICAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgICBjb25zdCBuYW1lID0gKHdpbmRvdy5wcm9tcHQoJ05ldyB3b3Jrc3BhY2UgbmFtZScpID8/ICcnKS50cmltKCk7XG4gICAgICBpZiAobmFtZSkgYXdhaXQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh2YWx1ZSk7XG4gICAgZm9jdXNXb3Jrc3BhY2VUYWIodmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdTZW5kIHRvIEFnZW50IOKAlCBleHBvcnQgLnRhci56c3QgKyBjb3B5IHRoZSBhZ2VudCBwcm9tcHQnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdjb3B5LWFnZW50LXByb21wdCcsIGxhYmVsOiAnQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCAobGFzdCBleHBvcnQpJywgcnVuOiAoKSA9PiB7XG4gICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICghbGFzdEV4cG9ydC5hZ2VudFByb21wdCkgeyBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIFNlbmQgdG8gQWdlbnQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBvayA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICAgICAgc2V0U3RhdHVzKG9rID8gJ0FnZW50IHByb21wdCBjb3BpZWQnIDogJ0NsaXBib2FyZCB1bmF2YWlsYWJsZScsIG9rID8ge30gOiB7a2luZDogJ3dhcm4nfSk7XG4gICAgICB9KSgpO1xuICAgIH19LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3NlbGVjdC1tb2RlJywgbGFiZWw6ICdUb2dnbGUgcGluY2ggbW9kZSAoY2FwdHVyZSB3aXRob3V0IGhvbGRpbmcgQWx0KScsIHJ1bjogb25Ub2dnbGVTZWxlY3RNb2RlfSxcbiAgICB7aWQ6ICd2YWxpZGF0ZScsIGxhYmVsOiAnUmUtY2hlY2sgc2VsZWN0b3JzJywgcnVuOiAoKSA9PiB2b2lkIG9uVmFsaWRhdGUoKX0sXG4gICAge2lkOiAncmVhdHRhY2gnLCBsYWJlbDogJ1JlLWF0dGFjaCB0byBwYWdlIChmaXggQWx0K0NsaWNrKScsIHJ1bjogKCkgPT4gdm9pZCBvblJlYXR0YWNoKCl9LFxuICAgIHtpZDogJ3JlbG9hZC1leHRlbnNpb24nLCBsYWJlbDogJ1JlbG9hZCB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiAobGFzdCByZXNvcnQpJywgcnVuOiAoKSA9PiB7IGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnJ1bnRpbWUucmVsb2FkKCk7IH19LFxuICAgIHtpZDogJ2NsZWFyJywgbGFiZWw6ICdDbGVhciBhbGwgY2FwdHVyZXMnLCBydW46IG9uQ2xlYXJ9LFxuICAgIHtpZDogJ3NldHRpbmdzJywgbGFiZWw6ICdPcGVuIHNldHRpbmdzJywgcnVuOiBvcGVuRHJhd2VyfSxcbiAgICB7aWQ6ICdnaXRodWInLCBsYWJlbDogJ09wZW4gR2l0SHViIHJlcG8nLCBydW46IG9uR2l0aHVifSxcbiAgICB7aWQ6ICdtYW51YWwnLCBsYWJlbDogJ01hbnVhbCBjYXB0dXJlIChzdGFydCBjb21wb3NlciB3aXRoIGA+IHNlbGVjdG9yYCknLCBydW46ICgpID0+IHsgY29tcG9zZXIudmFsdWUgPSAnPiAnOyBjb21wb3Nlci5mb2N1cygpOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IH19LFxuICAgIHtpZDogJ3VuZG8nLCBsYWJlbDogJ1VuZG8nLCBydW46IHVuZG99LFxuICAgIHtpZDogJ3JlZG8nLCBsYWJlbDogJ1JlZG8nLCBydW46IHJlZG99LFxuICBdO1xuICBjb25zdCByZW5kZXJQYWxldHRlID0gKHEgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGVMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnN0IHFsID0gcS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uQ09NTUFORFMuZmlsdGVyKChjKSA9PiAhcWwgfHwgYy5sYWJlbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSlcbiAgICAgICAgLm1hcCgoYykgPT4gKHtsYWJlbDogYy5sYWJlbCwgcHJldmlldzogJ2NvbW1hbmQnLCBydW46IGMucnVufSkpLFxuICAgICAgLi4ubWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmICghcWwgfHxcbiAgICAgICAgKG0uZW50cnkuc2VsZWN0b3IgKyAnICcgKyAobS5lbnRyeS50ZXh0ID8/ICcnKSArICcgJyArIChtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gJycpKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSkpXG4gICAgICAgIC5zbGljZSgwLCAzMClcbiAgICAgICAgLm1hcCgobSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgICAgICAgY29uc3QgcHJldmlldyA9IChtLmVudHJ5LnRleHQgPz8gZmJbMF0gPz8gbS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDgwKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGFiZWw6IGAjJHttLmVudHJ5Lm59ICR7bS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3J9YCxcbiAgICAgICAgICAgIHByZXZpZXcsXG4gICAgICAgICAgICBydW46ICgpID0+IHtcbiAgICAgICAgICAgICAgY2xvc2VQYWxldHRlKCk7XG4gICAgICAgICAgICAgIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhtLmlkKTtcbiAgICAgICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgIF07XG4gICAgaXRlbXMuZm9yRWFjaCgoaXQsIGkpID0+IHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IGxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxibC5jbGFzc05hbWUgPSAnbGFiZWwnO1xuICAgICAgbGJsLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LmxhYmVsLCBxKTtcbiAgICAgIGxpLmFwcGVuZChsYmwpO1xuICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHAuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgcC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5wcmV2aWV3ID8/ICcnLCBxKTtcbiAgICAgIGxpLmFwcGVuZChwKTtcbiAgICAgIGNvbnN0IGtiZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGtiZC5jbGFzc05hbWUgPSAna2JkJztcbiAgICAgIGtiZC50ZXh0Q29udGVudCA9ICfihrUnO1xuICAgICAgbGkuYXBwZW5kKGtiZCk7XG4gICAgICBpZiAoaSA9PT0gMCkgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaXQucnVuKCk7IH0pO1xuICAgICAgcGFsZXR0ZUxpc3QuYXBwZW5kKGxpKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb3BlblBhbGV0dGUgPSAocHJlc2V0ID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlLmhpZGRlbiA9IGZhbHNlO1xuICAgIHBhbGV0dGVJbnB1dC52YWx1ZSA9IHByZXNldDtcbiAgICByZW5kZXJQYWxldHRlKHByZXNldCk7XG4gICAgcGFsZXR0ZUlucHV0LmZvY3VzKCk7XG4gICAgcGFsZXR0ZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKHByZXNldC5sZW5ndGgsIHByZXNldC5sZW5ndGgpO1xuICB9O1xuICBjb25zdCBjbG9zZVBhbGV0dGUgPSAoKTogdm9pZCA9PiB7IHBhbGV0dGUuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gcmVuZGVyUGFsZXR0ZShwYWxldHRlSW5wdXQudmFsdWUpKTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gWy4uLnBhbGV0dGVMaXN0LmNoaWxkcmVuXTtcbiAgICBsZXQgYWN0aXZlID0gaXRlbXMuZmluZEluZGV4KChsaSkgPT4gbGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSk7XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1pbihpdGVtcy5sZW5ndGggLSAxLCBhY3RpdmUgKyAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1heCgwLCBhY3RpdmUgLSAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyAoaXRlbXNbYWN0aXZlXSBhcyBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCk/LmNsaWNrKCk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBjbG9zZVBhbGV0dGUoKTtcbiAgfSk7XG4gIHBhbGV0dGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IHBhbGV0dGUpIGNsb3NlUGFsZXR0ZSgpOyB9KTtcblxuICAvLyDilIDilIDilIAgQ29udGV4dCBzdHJpcCAoaG92ZXIgaGVscCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJlcGxhY2VzIHRoZSBvbGQgZmxvYXRpbmcgY3Vyc29yIHRvb2x0aXA6IFtkYXRhLXRpcF0gaG92ZXIgdGV4dCBpc1xuICAvLyB3cml0dGVuIGludG8gdGhlIGZpeGVkIHN0cmlwIHVuZGVyIHRoZSBoZWFkZXIsIHNvIGhlbHAgbmV2ZXIgb2NjbHVkZXNcbiAgLy8gb3RoZXIgY29udHJvbHMgYW5kIGNhbid0IHN0cmFuZCBtaWQtc2NyZWVuIHRocm91Z2ggcmUtcmVuZGVycy5cbiAgY29uc3QgVElQX0lETEUgPSAnQWx0K0NsaWNrIG9uIHRoZSBwYWdlIHRvIGNhcHR1cmUgwrcgaG92ZXIgYW55IGNvbnRyb2wgZm9yIGhlbHAnO1xuICBsZXQgdGlwRm9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBUaGUgc2V0dGluZ3MgZHJhd2VyIG92ZXJsYXlzIHRoZSBzdHJpcCAocG9zaXRpb246YWJzb2x1dGUsIGluc2V0IDApLCBzb1xuICAvLyBob3ZlciBoZWxwIGZvciBkcmF3ZXIgY29udHJvbHMgbGFuZHMgaW4gYSBzZWNvbmQgc2luayBpbnNpZGUgdGhlXG4gIC8vIGRyYXdlciBoZWFkZXIuIEJvdGggc2lua3MgYWx3YXlzIHJlY2VpdmUgdGhlIHNhbWUgdGV4dC5cbiAgY29uc3QgZHJhd2VyVGlwRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZHJhd2VyLXRpcF0nKTtcbiAgY29uc3Qgc2hvd1RpcCA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlwJyk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgdG9vbHRpcEVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICd0cnVlJztcbiAgICBpZiAoZHJhd2VyVGlwRWwpIHsgZHJhd2VyVGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0OyBkcmF3ZXJUaXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnOyB9XG4gIH07XG4gIGNvbnN0IGhpZGVUaXAgPSAoKTogdm9pZCA9PiB7XG4gICAgdGlwRm9yID0gbnVsbDtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSBUSVBfSURMRTtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7XG4gICAgaWYgKGRyYXdlclRpcEVsKSB7IGRyYXdlclRpcEVsLnRleHRDb250ZW50ID0gJyc7IGRyYXdlclRpcEVsLmRhdGFzZXQuc2hvd24gPSAnZmFsc2UnOyB9XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoIXQgfHwgdCA9PT0gdGlwRm9yKSByZXR1cm47XG4gICAgdGlwRm9yID0gdDtcbiAgICBzaG93VGlwKHQpO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHQgJiYgdCA9PT0gdGlwRm9yICYmICF0LmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZVRpcCgpO1xuICB9KTtcbiAgLy8gUmUtcmVuZGVycyBjYW4gZHJvcCB0aGUgaG92ZXJlZCBub2RlIHdpdGhvdXQgZXZlciBmaXJpbmcgbW91c2VvdXRcbiAgLy8gKHJlbmRlcigpIHJlc2V0cyBsaXN0LmlubmVySFRNTCwgY29uZmlybSBidXR0b25zIHJlcGxhY2VXaXRoKTsgcmVzZXRcbiAgLy8gdGhlIHN0cmlwIHRvIGl0cyBpZGxlIGhpbnQgd2hlbiB0aGF0IGhhcHBlbnMuXG4gIGNvbnN0IHRpcEd1YXJkID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgIGlmICh0aXBGb3IgJiYgIXRpcEZvci5pc0Nvbm5lY3RlZCkgaGlkZVRpcCgpO1xuICB9KTtcbiAgdGlwR3VhcmQub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7Y2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXQgZHJpbGxkb3ducyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgYXBwZW5kSGVhZGluZyA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDUnKTtcbiAgICBoLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChoKTtcbiAgfTtcbiAgY29uc3QgYXBwZW5kQm9sZCA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYicpO1xuICAgIGIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGIpO1xuICB9O1xuICBjb25zdCBhcHBlbmRDb2RlID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb2RlJyk7XG4gICAgY29kZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoY29kZSk7XG4gIH07XG4gIGNvbnN0IGJ1aWxkRHJpbGxkb3duID0gKGtpbmQ6IHN0cmluZyk6IERvY3VtZW50RnJhZ21lbnQgPT4ge1xuICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgaWYgKGtpbmQgPT09ICdzZWxlY3RvcnMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTZWxlY3RvcnMgYnkgcXVhbGl0eScpO1xuICAgICAgY29uc3QgYnVja2V0cyA9IHtpZDogMCwgdGVzdGlkOiAwLCBjbGFzczogMCwgbnRoOiAwLCB0YWc6IDB9O1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgICAgaWYgKGUudGVzdElkKSBidWNrZXRzLnRlc3RpZCsrO1xuICAgICAgICBlbHNlIGlmIChlLmlkIHx8IC9eI1tcXHctXSskLy50ZXN0KGUuc2VsZWN0b3IpKSBidWNrZXRzLmlkKys7XG4gICAgICAgIGVsc2UgaWYgKChlLnNlbGVjdG9yID8/ICcnKS5pbmNsdWRlcygnOm50aC1vZi10eXBlJykpIGJ1Y2tldHMubnRoKys7XG4gICAgICAgIGVsc2UgaWYgKC9cXC4vLnRlc3QoZS5zZWxlY3RvciA/PyAnJykpIGJ1Y2tldHMuY2xhc3MrKztcbiAgICAgICAgZWxzZSBidWNrZXRzLnRhZysrO1xuICAgICAgfVxuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgZm9yIChjb25zdCBbdmFsdWUsIGxhYmVsXSBvZiBbXG4gICAgICAgIFtidWNrZXRzLnRlc3RpZCwgJyBkYXRhLXRlc3RpZCddLFxuICAgICAgICBbYnVja2V0cy5pZCwgJyBzdGFibGUgaWQnXSxcbiAgICAgICAgW2J1Y2tldHMuY2xhc3MsICcgY2xhc3MtYmFzZWQnXSxcbiAgICAgICAgW2J1Y2tldHMubnRoLCAnIG50aC1vZi10eXBlJ10sXG4gICAgICAgIFtidWNrZXRzLnRhZywgJyB0YWctb25seSddLFxuICAgICAgXSBhcyBjb25zdCkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICBsaS5hcHBlbmQobGFiZWwpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3N0YWxlJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnU3RhbGUgY2FwdHVyZXMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IHN0YWxlID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSk7XG4gICAgICBpZiAoIXN0YWxlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gJ05vbmUgLSBldmVyeXRoaW5nIHJlc29sdmVzLic7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9IGVsc2UgZm9yIChjb25zdCBtIG9mIHN0YWxlKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgYCMke20uZW50cnkubn1gKTtcbiAgICAgICAgbGkuYXBwZW5kKCcgJyk7XG4gICAgICAgIGFwcGVuZENvZGUobGksIChtLmVudHJ5LnNlbGVjdG9yID8/ICcnKS5zbGljZSgwLCA1MCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ2NvbW1lbnRzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnQ29tbWVudHMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IGZicyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgRmVlZGJhY2tNZXNzYWdlID0+IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJyk7XG4gICAgICBjb25zdCB0b3RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICB0b3RhbC5hcHBlbmQoJ1RvdGFsIHdvcmRzOiAnKTtcbiAgICAgIGFwcGVuZEJvbGQodG90YWwsIFN0cmluZyhmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgd29yZENvdW50KG0udGV4dCksIDApKSk7XG4gICAgICB1bC5hcHBlbmQodG90YWwpO1xuICAgICAgY29uc3QgYXZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGF2Zy5hcHBlbmQoJ0F2ZXJhZ2UgbGVuZ3RoOiAnKTtcbiAgICAgIGFwcGVuZEJvbGQoYXZnLCBTdHJpbmcoZmJzLmxlbmd0aCA/IE1hdGgucm91bmQoZmJzLnJlZHVjZSgocywgbSkgPT4gcyArIG0udGV4dC5sZW5ndGgsIDApIC8gZmJzLmxlbmd0aCkgOiAwKSk7XG4gICAgICBhdmcuYXBwZW5kKCcgY2hhcnMnKTtcbiAgICAgIHVsLmFwcGVuZChhdmcpO1xuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3BhZ2VzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnUGFnZXMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzZWVuLnNldChtLmVudHJ5LnVybCwgKHNlZW4uZ2V0KG0uZW50cnkudXJsKSA/PyAwKSArIDEpO1xuICAgICAgZm9yIChjb25zdCBbdXJsLCBuXSBvZiBzZWVuKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKG4pKTtcbiAgICAgICAgbGkuYXBwZW5kKGAgc2VsZWN0b3Ike24gPT09IDEgPyAnJyA6ICdzJ30gwrcgYCk7XG4gICAgICAgIGFwcGVuZENvZGUobGksIHBhdGhPZih1cmwpKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWc7XG4gIH07XG4gIGNvbnN0IHNob3dEcmlsbGRvd24gPSAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGtpbmQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXQnKTtcbiAgICBpZiAoIWtpbmQpIHJldHVybjtcbiAgICBkcmlsbGRvd25FbC5yZXBsYWNlQ2hpbGRyZW4oYnVpbGREcmlsbGRvd24oa2luZCkpO1xuICAgIGRyaWxsZG93bkVsLmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IHIgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZFIgPSBkcmlsbGRvd25FbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgdG9wID0gci5ib3R0b20gKyA2O1xuICAgIGxldCBsZWZ0ID0gci5sZWZ0ICsgci53aWR0aCAvIDIgLSBkUi53aWR0aCAvIDI7XG4gICAgaWYgKHRvcCArIGRSLmhlaWdodCArIDQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHRvcCA9IHIudG9wIC0gZFIuaGVpZ2h0IC0gNjtcbiAgICBpZiAobGVmdCA8IDYpIGxlZnQgPSA2O1xuICAgIGlmIChsZWZ0ICsgZFIud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDYpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGRSLndpZHRoIC0gNjtcbiAgICBkcmlsbGRvd25FbC5zdHlsZS5jc3NUZXh0ID0gYHRvcDoke3RvcH1weDtsZWZ0OiR7bGVmdH1weDtgO1xuICB9O1xuICBjb25zdCBoaWRlRHJpbGxkb3duID0gKCk6IHZvaWQgPT4geyBkcmlsbGRvd25FbC5oaWRkZW4gPSB0cnVlOyB9O1xuICBzdGF0c0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnLnN0YXRbZGF0YS1zdGF0XScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCkgc2hvd0RyaWxsZG93bih0KTtcbiAgfSk7XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGlmICghc3RhdHNFbC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVEcmlsbGRvd24oKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydC1idXR0b24gaG92ZXIg4oaSIG91dGxpbmUtbXVsdGkgb24gcGFnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZm9yIChjb25zdCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZXhwb3J0LWhvdmVyXScpKSB7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aScsIHNlbGVjdG9yc30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LmFkZCgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2V4cG9ydC1ob3ZlcicpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIENsaWNrIGRlbGVnYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCB0cmlnZ2VyID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgaWYgKCF0cmlnZ2VyKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWFjdGlvbicpO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdzZW5kJzogc2VuZEZlZWRiYWNrKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktYWxsJzogdm9pZCBvbkNvcHlBbGwoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZXhwb3J0Jzogdm9pZCBvbkV4cG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQtemlwJzogdm9pZCBvbkV4cG9ydFppcCgpOyByZXR1cm47XG4gICAgICBjYXNlICdjb3B5LXBhdGgnOiB2b2lkIG9uQ29weVBhdGgoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaW1wb3J0Jzogb25JbXBvcnQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndmFsaWRhdGUnOiB2b2lkIG9uVmFsaWRhdGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2VsZWN0LW1vZGUnOiBvblRvZ2dsZVNlbGVjdE1vZGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVhdHRhY2gnOiB2b2lkIG9uUmVhdHRhY2goKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncXVpZXQtZW5hYmxlJzogdm9pZCBvblF1aWV0RW5hYmxlKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3F1aWV0LWRpc21pc3MnOiBvblF1aWV0RGlzbWlzcygpOyByZXR1cm47XG4gICAgICBjYXNlICdjbGVhcic6IG9uQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZ2l0aHViJzogb25HaXRodWIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOiBvcGVuRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Nsb3NlLWRyYXdlcic6IGNsb3NlRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3VuZG8nOiB1bmRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3JlZG8nOiByZWRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Rlc2lnbi1lZGl0JzogeyB2b2lkIG9wZW5NZE1vZGFsKCdkZXNpZ24nKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdza2lsbC1lZGl0JzogIHsgdm9pZCBvcGVuTWRNb2RhbCgnc2tpbGwnKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdkZXNpZ24tdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbi1tZC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyBBbHdheXMgdGhlIFBMQUlOIFNUT0NLIHRlbXBsYXRlIOKAlCB0aGUgbG9jYWwuKiBkZXYtb3ZlcnJpZGVcbiAgICAgICAgICAvLyBwcmVmZXJlbmNlIGNvbnRhbWluYXRlZCBkZWZhdWx0cyB3aXRoIGEgZGV2ZWxvcGVyJ3Mgb3duIGJyYW5kLlxuICAgICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJyk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQg4oCUIGZpbGwgaW4gYW5kIHJlLXVwbG9hZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLmRlc2lnbk1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ0RFU0lHTi5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NraWxsLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXRlbXBsYXRlLWRvd25sb2FkJzoge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpO1xuICAgICAgICAgIGlmICghdGV4dCkgeyBzZXRTdGF0dXMoJ1RlbXBsYXRlIG5vdCBmb3VuZCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgZG93bmxvYWRUZXh0KCdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLCB0ZXh0KTtcbiAgICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQnKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLnNraWxsTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgcmVzZXQg4oCUIGV4cG9ydHMgd2lsbCBidW5kbGUgdGhlIHRlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3dzLWNyZWF0ZSc6IHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICh3c05hbWUudmFsdWUgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG4gICAgICAgIHZvaWQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKS50aGVuKChvaykgPT4geyBpZiAob2spIHdzTmFtZS52YWx1ZSA9ICcnOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBHbG9iYWwga2V5Ym9hcmQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldCA9ICh0YXJnZXQ6IEV2ZW50VGFyZ2V0IHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGVsID0gdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyB0YXJnZXQgOiBudWxsO1xuICAgIHJldHVybiBCb29sZWFuKGVsPy5jbG9zZXN0KCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCwgW2NvbnRlbnRlZGl0YWJsZT1cInRydWVcIl0sIFtjb250ZW50ZWRpdGFibGU9XCJcIl0nKSk7XG4gIH07XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgZWRpdGFibGVUYXJnZXQgPSBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQoZS50YXJnZXQpO1xuICAgIGlmIChlZGl0YWJsZVRhcmdldCAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgWydhJywgJ3onLCAneSddLmluY2x1ZGVzKGUua2V5LnRvTG93ZXJDYXNlKCkpKSByZXR1cm47XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnaycpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBwYWxldHRlLmhpZGRlbiA/IG9wZW5QYWxldHRlKCkgOiBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgLy8gQ3RybCtGIChhbmQgQ21kK0YpIG9wZW5zIHRoZSBpbi1saXN0IHZpc3VhbCBmaW5kIOKAlCBkaXN0aW5jdCBmcm9tIHRoZVxuICAgIC8vIENtZCtLIGNvbW1hbmQgcGFsZXR0ZS4gT3ZlcnJpZGUgdGhlIGJyb3dzZXIncyBuYXRpdmUgZmluZCBzbyB0aGUgcGFuZWxcbiAgICAvLyBvd25zIHRoZSBnZXN0dXJlLlxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2YnKSB7IGUucHJldmVudERlZmF1bHQoKTsgb3BlbkZpbmQoKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB1bmRvKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgKGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd5JyB8fCAoZS5zaGlmdEtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicpKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHJlZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgY29uc3QgbWRNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICAgIGlmIChtZE1vZGFsICYmICFtZE1vZGFsLmhpZGRlbikgeyBjbG9zZU1kTW9kYWwoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSB7IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAgIGlmICghZHJhd2VyLmhpZGRlbikgeyBjbG9zZURyYXdlcigpOyByZXR1cm47IH1cbiAgICAgIGlmIChmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbikgeyBjbG9zZUZpbmQoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgeyB2b2lkIHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSk7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdQZW5kaW5nIGdyb3VwIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogdHJ1ZX0pO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIGlmICghZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBwYW5lbFJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHBlbmRpbmdQYW5lbE1lc3NhZ2VzOiBhbnlbXSA9IFtdO1xuICBjb25zdCByZWNlaXZlUGFuZWxNZXNzYWdlID0gKG06IGFueSk6IHZvaWQgPT4ge1xuICAgIGlmICghcGFuZWxSZWFkeSkge1xuICAgICAgcGVuZGluZ1BhbmVsTWVzc2FnZXMucHVzaChtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25Dc01lc3NhZ2UobSk7XG4gIH07XG4gIGlmIChpbkV4dGVuc2lvbikge1xuICAgIC8vIFNpbmdsZSBjaGFubmVsOiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuIFRoZSBiYWNrZ3JvdW5kIHVzZWQgdG8gcmVsYXlcbiAgICAvLyB0aHJvdWdoIGEgcG9ydCB0b28sIGJ1dCBjb250ZW50LXNjcmlwdCBicm9hZGNhc3RzIGFscmVhZHkgcmVhY2ggdGhlXG4gICAgLy8gc2lkZSBwYW5lbCBkaXJlY3RseSDigJQgcmVsYXlpbmcgcHJvZHVjZWQgZHVwbGljYXRlIGRpc3BhdGNoZXMuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtOiBhbnkpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UobSkpO1xuICAgIGNocm9tZS50YWJzPy5vbkFjdGl2YXRlZD8uYWRkTGlzdGVuZXIoKCkgPT4gdm9pZCBydW5WYWxpZGF0aW9uKCkpO1xuICAgIGNocm9tZS50YWJzPy5vblVwZGF0ZWQ/LmFkZExpc3RlbmVyKChfaWQsIGluZm8pID0+IHsgaWYgKGluZm8/LnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykgdm9pZCBydW5WYWxpZGF0aW9uKCk7IH0pO1xuICAgIGNocm9tZS50YWJzPy5vblJlbW92ZWQ/LmFkZExpc3RlbmVyKChjbG9zZWRJZCkgPT4ge1xuICAgICAgY29uc3Qgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcudGFiSWQgPT09IGNsb3NlZElkKTtcbiAgICAgIGlmICh3cykgeyB3cy50YWJJZCA9IHVuZGVmaW5lZDsgcGVyc2lzdFdvcmtzcGFjZXMoKTsgcmVuZGVyV3NDb250cm9scygpOyB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIChlKSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWwpKTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBUZXN0IEFQSSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaW5zdGFsbFRlc3RBcGkgPSAoKTogdm9pZCA9PiB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLl9fcGluY2hncmFiX3BhbmVsID0ge1xuICAgICAgcHVzaE1lc3NhZ2U6IChtOiBQYW5lbE1lc3NhZ2UpID0+IHsgbWVzc2FnZXMucHVzaChtKTsgcGVyc2lzdCgpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uQ2FwdHVyZSwgb25Ib3Zlciwgb25Ib3ZlckVuZCwgb25QYWdlU25hcHNob3QsXG4gICAgICBnZXRNZXNzYWdlczogKCkgPT4gWy4uLm1lc3NhZ2VzXSxcbiAgICAgIGdldFByZWZzOiAoKSA9PiAoey4uLnByZWZzfSksXG4gICAgICBzZXRQcmVmczogKHA6IFBhcnRpYWw8UHJlZnM+KSA9PiB7IHByZWZzID0gey4uLnByZWZzLCAuLi5wfTsgcGVyc2lzdFByZWZzKCk7IGFwcGx5UHJlZnNUb1VJKCk7IHJlbmRlcigpOyB9LFxuICAgICAgYnVpbGRKc29ubCxcbiAgICAgIGJ1aWxkRXhwb3J0RmlsZW5hbWUsIGJ1aWxkTWFuaWZlc3QsIGRvbWluYW50SG9zdFNsdWcsIGRpc3RpbmN0SG9zdHMsXG4gICAgICBkdWNrRGJTbmlwcGV0LCBvbkV4cG9ydFppcCwgb25FeHBvcnQsIG9uQ29weVBhdGgsXG4gICAgICBkZW5vcm1hbGl6ZUVudHJ5LFxuICAgICAgZ2V0TGFzdEV4cG9ydDogKCkgPT4gKHsuLi5sYXN0RXhwb3J0fSksXG4gICAgICBnZXRMYXN0QWdlbnRQcm9tcHQ6ICgpID0+IGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQsXG4gICAgICAvLyBUZXN0IGhhdGNoOiBzZWVkIGV2ZXJ5IHNlbGVjdG9yIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBmdWxsIFBORyBkYXRhVVJMXG4gICAgICAvLyBzbyB0aGUgYXJjaGl2ZSBleHBvcnQgaGFzIHNvbWV0aGluZyB0byBidW5kbGUuIFJlYWwgY2FwdHVyZXMgcG9wdWxhdGVcbiAgICAgIC8vIHNob3RzRnVsbCBmcm9tIHRoZSBiZyBgcnVuU2hvdGAgcmVwbHk7IHRlc3RzIGNhbid0IGVhc2lseSBydW4gYVxuICAgICAgLy8gY2FwdHVyZVZpc2libGVUYWIsIHNvIHRoaXMgbGV0cyB1cyBwcm92ZSB0aGUgUE5HIGJ1bmRsaW5nIHBhdGguXG4gICAgICBfX3NlZWRTaG90c0Z1bGw6IChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2hvdHNGdWxsLnNldChtLmVudHJ5LnNlbGVjdG9yLCBkYXRhVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgICB9LFxuICAgICAgX19nZXRTaG90c0Z1bGw6ICgpID0+IHNob3RzRnVsbCxcbiAgICAgIC8vIEZyZWV6ZSB0aGUgZXhwb3J0IGNsb2NrIChJU08gc3RyaW5nKSBzbyB0ZXN0cyBjYW4gYXNzZXJ0IHR3b1xuICAgICAgLy8gZXhwb3J0cyBvZiBpZGVudGljYWwgY29udGVudCBhcmUgYnl0ZS1pZGVudGljYWwuIFBhc3MgbnVsbCB0b1xuICAgICAgLy8gcmVzdG9yZSB3YWxsLWNsb2NrIGJlaGF2aW9yLlxuICAgICAgX19zZXRFeHBvcnRDbG9jazogKGlzbzogc3RyaW5nIHwgbnVsbCkgPT4geyBleHBvcnRDbG9ja092ZXJyaWRlID0gaXNvOyB9LFxuICAgICAgLy8gc2V0U2VhcmNoIGRyaXZlcyB0aGUgQ3RybCtGIHZpc3VhbC1maW5kIHBhdGggKHRoZSBoZWFkZXIgc2VhcmNoIG5vd1xuICAgICAgLy8gb3BlbnMgdGhlIGNvbW1hbmQgcGFsZXR0ZSBpbnN0ZWFkIG9mIGZpbHRlcmluZykuXG4gICAgICBzZXRTZWFyY2g6IChxOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHEpIHsgb3BlbkZpbmQoKTsgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gcTsgYXBwbHlGaW5kKHEpOyB9XG4gICAgICAgIGVsc2UgY2xvc2VGaW5kKCk7XG4gICAgICB9LFxuICAgICAgb3BlbkZpbmQsIGNsb3NlRmluZCxcbiAgICAgIGlzRmluZE9wZW46ICgpID0+IEJvb2xlYW4oZmluZEJhciAmJiAhZmluZEJhci5oaWRkZW4pLFxuICAgICAgc2V0VmFsaWRpdHk6IChzZWw6IHN0cmluZywgb2s6IGJvb2xlYW4gfCAnZGlmZi1wYWdlJywgcmVhc29uPzogc3RyaW5nKSA9PiB7XG4gICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICBpZiAocmVhc29uKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCByZWFzb24pO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICAgICAgbGl2ZVRhYlBhdGggPSBudWxsO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgICAgICBzaG90cy5jbGVhcigpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9wZW5QYWxldHRlLCBjbG9zZVBhbGV0dGUsIG9wZW5EcmF3ZXIsIGNsb3NlRHJhd2VyLFxuICAgICAgc2VuZEZlZWRiYWNrLCB1bmRvLCByZWRvLFxuICAgICAgbGlzdFdvcmtzcGFjZXM6ICgpID0+IFsuLi53b3Jrc3BhY2VzXSxcbiAgICAgIGFjdGl2ZVdvcmtzcGFjZTogKCkgPT4gYWN0aXZlV3MsXG4gICAgICBzZXRTdGlja3lUVEw6IChtczogbnVtYmVyKSA9PiB7IFNUSUNLWV9UVExfTVMgPSBtczsgfSxcbiAgICAgIGZvcmNlU3RpY2t5RXhwaXJlOiAoKSA9PiB7IGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7IHBhbmVsSG92ZXJlZCA9IGZhbHNlOyBhcm1TdGlja3lFeHBpcnkoKTsgfSxcbiAgICAgIHNldExhc3RBY3RpdmUsXG4gICAgICBjcmVhdGVXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IHsgd29ya3NwYWNlcy5wdXNoKHtuYW1lOiBuLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0pOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZXR1cm4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlcik7IH0sXG4gICAgICBzd2l0Y2hXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IGxvYWRXb3Jrc3BhY2UobikudGhlbihyZW5kZXIpLFxuICAgICAgY2xlYXJBbGw6IG9uQ2xlYXIsXG4gICAgICBsaXN0U25hcHNob3RzOiAoKSA9PiB3c1NuYXBzaG90cy5tYXAoKHMpID0+ICh7aWQ6IHMuaWQsIHRzOiBzLnRzLCBzZWxlY3RvcnM6IHMuc2VsZWN0b3JzLCBjb21tZW50czogcy5jb21tZW50c30pKSxcbiAgICAgIHJlc3RvcmVTbmFwc2hvdDogKGlkOiBzdHJpbmcpID0+IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdChpZCksXG4gICAgfTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUGFuZWwgc2VsZi1oZWFsIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBBZnRlciBhIGRldiBleHRlbnNpb24gcmVsb2FkIChvciBhbiBhdXRvLXVwZGF0ZSksIHRoZSBzaWRlIHBhbmVsIGtlZXBzXG4gIC8vIHJ1bm5pbmcgaXRzIE9MRCBjb2RlIHdpdGggYW4gSU5WQUxJREFURUQgY2hyb21lLnJ1bnRpbWU6IGNocm9tZS5ydW50aW1lLmlkXG4gIC8vIGdvZXMgdW5kZWZpbmVkIGFuZCBldmVyeSBjaHJvbWUuKiBjYWxsIHRocm93cyBcIkV4dGVuc2lvbiBjb250ZXh0XG4gIC8vIGludmFsaWRhdGVkXCIuIEEgZGVhZCBwYW5lbCBjYW4ndCByZWFjaCB0aGUgYmFja2dyb3VuZCwgc28gTk8gYnV0dG9uIGluIGl0XG4gIC8vIHdvcmtzIOKAlCB3aGljaCBpcyBleGFjdGx5IHdoeSB0aGUgb25seSByZWNvdmVyeSB1c2VkIHRvIGJlIFwiY2xvc2UgdGhlIHBhbmVcbiAgLy8gYW5kIHJlY2xpY2sgdGhlIHRvb2xiYXJcIi4gVGhpcyBoZWFydGJlYXQgZGV0ZWN0cyB0aGF0IGRlYXRoIGFuZCByZWxvYWRzXG4gIC8vIHRoZSBwYW5lbCBwYWdlLCB3aGljaCByZS1mZXRjaGVzIHRoZSBmcmVzaCBjb2RlIGFuZCByZWNvbm5lY3RzLiBBXG4gIC8vIHNlc3Npb25TdG9yYWdlIGNvdW50ZXIgKHN1cnZpdmVzIHRoZSByZWxvYWQpIHByZXZlbnRzIGEgbG9vcCB3aGVuIHRoZVxuICAvLyBleHRlbnNpb24gaXMgZ2VudWluZWx5IGdvbmUgcmF0aGVyIHRoYW4gcmVsb2FkZWQuXG4gIGNvbnN0IHdhdGNoQ29udGV4dEhlYWx0aCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm47XG4gICAgY29uc3QgUkVMT0FEX0tFWSA9ICdwZy5jdHhSZWxvYWRzJztcbiAgICAvLyBPbmNlIHdlJ3ZlIGJlZW4gc3RhYmx5IGFsaXZlIGZvciBhIHdoaWxlLCBjbGVhciB0aGUgbG9vcCBndWFyZC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdHJ5IHsgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShSRUxPQURfS0VZKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9IH0sIDE1MDAwKTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBsZXQgYWxpdmUgPSBmYWxzZTtcbiAgICAgIHRyeSB7IGFsaXZlID0gQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpOyB9IGNhdGNoIHsgYWxpdmUgPSBmYWxzZTsgfVxuICAgICAgaWYgKGFsaXZlKSByZXR1cm47XG4gICAgICBsZXQgbiA9IDA7XG4gICAgICB0cnkgeyBuID0gTnVtYmVyKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVMT0FEX0tFWSkgPz8gJzAnKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICBpZiAobiA+PSAzKSB7XG4gICAgICAgIC8vIEF1dG8tcmVjb3ZlcnkgZXhoYXVzdGVkIChleHRlbnNpb24gbGlrZWx5IHVuaW5zdGFsbGVkLCBub3QgcmVsb2FkZWQpLlxuICAgICAgICBpZiAoc3RhdHVzKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnUGluY2hHcmFiIHdhcyByZWxvYWRlZCDigJQgY2xvc2UgdGhpcyBwYW5lbCBhbmQgcmVvcGVuIGl0IGZyb20gdGhlIHRvb2xiYXIuJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxPQURfS0VZLCBTdHJpbmcobiArIDEpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICBpZiAoc3RhdHVzKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnUGluY2hHcmFiIHJlbG9hZGVkIOKAlCByZWNvbm5lY3RpbmfigKYnO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRyeSB7IGxvY2F0aW9uLnJlbG9hZCgpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfSwgNjAwKTtcbiAgICB9LCAyMDAwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQm9vdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGxvYWRBbGwoKTtcbiAgICBwYW5lbFJlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgcGVuZGluZ1BhbmVsTWVzc2FnZXMuc3BsaWNlKDApKSBvbkNzTWVzc2FnZShtKTtcbiAgICByZW5kZXIoKTtcbiAgICBpbnN0YWxsVGVzdEFwaSgpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHZvaWQgbWF5YmVTaG93UXVpZXROdWRnZSgpO1xuICAgIHZvaWQgZmV0Y2hTdGFycygpO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICAgIHdhdGNoQ29udGV4dEhlYWx0aCgpO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9uLCB3czogYWN0aXZlV3MsIG1lc3NhZ2VzOiBtZXNzYWdlcy5sZW5ndGh9KTtcbiAgfSkoKTtcbn0pKCk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQW9vQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUN6RixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBLEVBS0osSUFBTSxLQUFLLENBQTJCLGFBQzFDLEVBQUMsTUFBTSxNQUFNLE9BQU8sT0FBTyxNQUFNLFFBQU87OztFQzVvQjNDLElBQU0sUUFBZ0M7QUFBQSxJQUNwQyxpQkFBaUI7QUFBQSxJQUNqQixnQkFBZ0I7QUFBQSxJQUNoQixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxNQUFNO0FBQUEsSUFDTixHQUFHO0FBQUEsSUFDSCxPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixvQkFBb0I7QUFBQSxJQUNwQixpQkFBaUI7QUFBQSxJQUNqQix1QkFBdUI7QUFBQSxJQUN2QixnQkFBZ0I7QUFBQSxJQUNoQixjQUFjO0FBQUEsSUFDZCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFDYixPQUFPO0FBQUEsSUFFUCxPQUFPO0FBQUEsSUFDUCxlQUFlO0FBQUEsSUFDZixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixPQUFPO0FBQUEsSUFDUCxnQkFBZ0I7QUFBQSxJQUNoQixNQUFNO0FBQUEsSUFFTixRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFHTixhQUFhO0FBQUEsSUFFYixPQUFPO0FBQUEsSUFFUCxTQUFTO0FBQUEsSUFFVCxNQUFNO0FBQUEsSUFFTixVQUFVO0FBQUEsRUFDWjtBQUFBLEVBRUEsSUFBTSxPQUFPLENBQUMsTUFBYyxTQUMxQixrREFBa0QsaUJBQWlCLCtIQUErSDtBQUFBLEVBRTdMLElBQU0sV0FBVztBQUFBLElBQ3RCLEtBQUssQ0FBQyxVQUEwQixRQUFRO0FBQUEsSUFDeEMsV0FBVyxDQUFDLE1BQWMsT0FBTyxPQUFlO0FBQUEsTUFDOUMsTUFBTSxPQUFPLE1BQU07QUFBQSxNQUNuQixJQUFJLENBQUMsTUFBTTtBQUFBLFFBQ1QsUUFBUSxLQUFLLHlCQUF5QixJQUFJO0FBQUEsUUFDMUMsT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLE9BQU8sS0FBSyxNQUFNLElBQUk7QUFBQTtBQUFBLElBRXhCLE9BQU8sQ0FBQyxJQUFvQixNQUFjLFNBQXdCO0FBQUEsTUFDaEUsSUFBSTtBQUFBLFFBQUksR0FBRyxZQUFZLFNBQVMsVUFBVSxNQUFNLElBQUk7QUFBQTtBQUFBLEVBRXhEO0FBQUEsRUFJQSxJQUFJLE9BQU8sZUFBZSxhQUFhO0FBQUEsSUFDcEMsV0FBbUIsV0FBVztBQUFBLEVBQ2pDOzs7RUNyRUEsSUFBTSxNQUFNLElBQUk7QUFBQSxFQUVoQixJQUFNLGFBQWEsQ0FBQyxLQUFpQixRQUFnQixPQUFlLFdBQXlCO0FBQUEsSUFFM0YsSUFBSSxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQUEsSUFDeEIsSUFBSSxFQUFFLFNBQVMsU0FBUyxHQUFHLEdBQUc7QUFBQSxJQUM5QixTQUFTLElBQUksRUFBRyxJQUFJLFNBQVMsR0FBRztBQUFBLE1BQUssSUFBSSxTQUFTLEtBQUssRUFBRSxXQUFXLENBQUM7QUFBQSxJQUNyRSxJQUFJLFNBQVMsU0FBUyxLQUFLO0FBQUE7QUFBQSxFQUc3QixJQUFNLGFBQWEsQ0FBQyxLQUFpQixRQUFnQixLQUFhLFdBQXlCO0FBQUEsSUFDekYsTUFBTSxRQUFRLElBQUksT0FBTyxHQUFHO0FBQUEsSUFDNUIsTUFBTSxNQUFNLEtBQUssSUFBSSxNQUFNLFFBQVEsTUFBTTtBQUFBLElBQ3pDLFNBQVMsSUFBSSxFQUFHLElBQUksS0FBSztBQUFBLE1BQUssSUFBSSxTQUFTLEtBQUssTUFBTTtBQUFBO0FBQUEsRUFHeEQsSUFBTSxpQkFBaUIsQ0FBQyxXQUErQjtBQUFBLElBR3JELElBQUksTUFBTTtBQUFBLElBQ1YsU0FBUyxJQUFJLEVBQUcsSUFBSSxLQUFLLEtBQUs7QUFBQSxNQUM1QixJQUFJLEtBQUssT0FBTyxJQUFJO0FBQUEsUUFBSyxPQUFPO0FBQUEsTUFDM0I7QUFBQSxlQUFPLE9BQU8sTUFBTTtBQUFBLElBQzNCO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQSxFQVlULElBQU0sZUFBZSxDQUFDLFNBQWlEO0FBQUEsSUFDckUsSUFBSSxLQUFLLFVBQVU7QUFBQSxNQUFLLE9BQU8sRUFBQyxNQUFNLE1BQU0sUUFBUSxHQUFFO0FBQUEsSUFDdEQsSUFBSSxNQUFNO0FBQUEsSUFDVixTQUFTLElBQUksS0FBSyxRQUFRLEdBQUcsRUFBRyxNQUFNLElBQUksSUFBSSxLQUFLLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRztBQUFBLE1BQ3RFLElBQUksS0FBSyxPQUFPLEtBQUssU0FBUyxJQUFJLEtBQUs7QUFBQSxRQUFLLE1BQU07QUFBQSxJQUNwRDtBQUFBLElBQ0EsSUFBSSxRQUFRLElBQUk7QUFBQSxNQUNkLE1BQU0sSUFBSSxNQUFNLDhEQUE4RCxNQUFNO0FBQUEsSUFDdEY7QUFBQSxJQUNBLE9BQU8sRUFBQyxRQUFRLEtBQUssTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLEtBQUssTUFBTSxNQUFNLENBQUMsRUFBQztBQUFBO0FBQUEsRUFHeEQsSUFBTSxXQUFXLENBQUMsWUFBb0M7QUFBQSxJQUMzRCxNQUFNLFNBQXVCLENBQUM7QUFBQSxJQUM5QixNQUFNLFNBQVMsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLElBQUk7QUFBQSxJQUMzQyxXQUFXLFNBQVMsU0FBUztBQUFBLE1BQzNCLE1BQU0sT0FBTyxPQUFPLE1BQU0sU0FBUyxXQUFXLElBQUksT0FBTyxNQUFNLElBQUksSUFBSSxNQUFNO0FBQUEsTUFDN0UsUUFBTyxNQUFNLFdBQVUsYUFBYSxNQUFNLElBQUk7QUFBQSxNQUM5QyxNQUFNLFNBQVMsSUFBSSxXQUFXLEdBQUc7QUFBQSxNQUNqQyxXQUFXLFFBQVEsR0FBRyxNQUFNLEdBQUc7QUFBQSxNQUMvQixXQUFXLFFBQVEsS0FBSyxLQUFPLENBQUM7QUFBQSxNQUNoQyxXQUFXLFFBQVEsS0FBSyxHQUFHLENBQUM7QUFBQSxNQUM1QixXQUFXLFFBQVEsS0FBSyxHQUFHLENBQUM7QUFBQSxNQUM1QixXQUFXLFFBQVEsS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUFBLE1BQ3ZDLFdBQVcsUUFBUSxLQUFLLE1BQU0sU0FBUyxRQUFRLEVBQUU7QUFBQSxNQUNqRCxTQUFTLElBQUksSUFBSyxJQUFJLEtBQUs7QUFBQSxRQUFLLE9BQU8sS0FBSztBQUFBLE1BQzVDLE9BQU8sT0FBTztBQUFBLE1BQ2QsV0FBVyxRQUFRLEtBQUssU0FBUyxDQUFDO0FBQUEsTUFDbEMsV0FBVyxRQUFRLEtBQUssTUFBTSxDQUFDO0FBQUEsTUFDL0IsSUFBSTtBQUFBLFFBQVEsV0FBVyxRQUFRLEtBQUssUUFBUSxHQUFHO0FBQUEsTUFHL0MsTUFBTSxXQUFXLGVBQWUsTUFBTTtBQUFBLE1BQ3RDLFdBQVcsUUFBUSxLQUFLLFVBQVUsQ0FBQztBQUFBLE1BRW5DLE9BQU8sS0FBSyxNQUFNO0FBQUEsTUFDbEIsT0FBTyxLQUFLLElBQUk7QUFBQSxNQUNoQixNQUFNLE9BQU8sTUFBTyxLQUFLLFNBQVMsT0FBUTtBQUFBLE1BQzFDLElBQUk7QUFBQSxRQUFLLE9BQU8sS0FBSyxJQUFJLFdBQVcsR0FBRyxDQUFDO0FBQUEsSUFDMUM7QUFBQSxJQUVBLE9BQU8sS0FBSyxJQUFJLFdBQVcsSUFBSSxDQUFDO0FBQUEsSUFFaEMsSUFBSSxRQUFRO0FBQUEsSUFDWixXQUFXLEtBQUs7QUFBQSxNQUFRLFNBQVMsRUFBRTtBQUFBLElBQ25DLE1BQU0sTUFBTSxJQUFJLFdBQVcsS0FBSztBQUFBLElBQ2hDLElBQUksU0FBUztBQUFBLElBQ2IsV0FBVyxLQUFLLFFBQVE7QUFBQSxNQUFFLElBQUksSUFBSSxHQUFHLE1BQU07QUFBQSxNQUFHLFVBQVUsRUFBRTtBQUFBLElBQVE7QUFBQSxJQUNsRSxPQUFPO0FBQUE7QUFBQSxFQTBCVCxJQUFNLHFCQUFxQixNQUFNO0FBQUEsRUFFMUIsSUFBTSxXQUFXLENBQUMsU0FBaUM7QUFBQSxJQUN4RCxNQUFNLFNBQXVCLENBQUM7QUFBQSxJQUM5QixJQUFJLE1BQU07QUFBQSxJQUNWLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxXQUFXLEdBQUc7QUFBQSxNQUM3QyxNQUFNLFlBQVksS0FBSyxTQUFTO0FBQUEsTUFDaEMsTUFBTSxZQUFZLEtBQUssSUFBSSxXQUFXLGtCQUFrQjtBQUFBLE1BQ3hELE1BQU0sU0FBUyxNQUFNLGFBQWEsS0FBSyxTQUFTLElBQUk7QUFBQSxNQUNwRCxNQUFNLFlBQVksU0FBVSxLQUFLLElBQU0sYUFBYTtBQUFBLE1BQ3BELE1BQU0sY0FBYyxJQUFJLFdBQVc7QUFBQSxRQUNqQyxZQUFZO0FBQUEsUUFDWCxjQUFjLElBQUs7QUFBQSxRQUNuQixjQUFjLEtBQU07QUFBQSxNQUN2QixDQUFDO0FBQUEsTUFDRCxPQUFPLEtBQUssV0FBVztBQUFBLE1BQ3ZCLElBQUksWUFBWTtBQUFBLFFBQUcsT0FBTyxLQUFLLEtBQUssU0FBUyxLQUFLLE1BQU0sU0FBUyxDQUFDO0FBQUEsTUFDbEUsT0FBTztBQUFBLE1BQ1AsSUFBSSxLQUFLLFdBQVc7QUFBQSxRQUFHO0FBQUEsSUFDekI7QUFBQSxJQUNBLE1BQU0sTUFBTSxLQUFLO0FBQUEsSUFDakIsTUFBTSxNQUFNO0FBQUEsSUFDWixNQUFNLE9BQU8sSUFBSSxXQUFXO0FBQUEsTUFDMUI7QUFBQSxNQUFNO0FBQUEsTUFBTTtBQUFBLE1BQU07QUFBQSxNQUNsQjtBQUFBLE1BQ0EsTUFBTTtBQUFBLE1BQU8sUUFBUSxJQUFLO0FBQUEsTUFBTyxRQUFRLEtBQU07QUFBQSxNQUFPLFFBQVEsS0FBTTtBQUFBLElBQ3RFLENBQUM7QUFBQSxJQUNELElBQUksUUFBUSxLQUFLO0FBQUEsSUFDakIsV0FBVyxLQUFLO0FBQUEsTUFBUSxTQUFTLEVBQUU7QUFBQSxJQUNuQyxNQUFNLE1BQU0sSUFBSSxXQUFXLEtBQUs7QUFBQSxJQUNoQyxJQUFJLE1BQU07QUFBQSxJQUNWLElBQUksSUFBSSxNQUFNLEdBQUc7QUFBQSxJQUFHLE9BQU8sS0FBSztBQUFBLElBQ2hDLFdBQVcsS0FBSyxRQUFRO0FBQUEsTUFBRSxJQUFJLElBQUksR0FBRyxHQUFHO0FBQUEsTUFBRyxPQUFPLEVBQUU7QUFBQSxJQUFRO0FBQUEsSUFDNUQsT0FBTztBQUFBO0VBb0RULElBQU0sTUFBTSxJQUFJOzs7RUMxTVQsSUFBTSxvQkFBb0IsRUFBQyxnQkFBaUIsTUFBSyxlQUFnQixNQUFLLGFBQWMsTUFBSyxZQUFhLEtBQUk7OztFQ0MxRyxJQUFNLHlCQUF5QjtBQUFBLEVBRS9CLElBQU0sc0JBQTBDO0FBQUEsSUFDckQ7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNY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
