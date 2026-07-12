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

//# debugId=1D658C8327B33C9B64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvYnVuZGxlZC1za2lsbHMuZ2VuLnRzIiwgInNyYy9leHBvcnQtYWdlbnQtcHJvbXB0Lm1qcyIsICJzcmMvZXhwb3J0LWNhcHR1cmUubWpzIiwgInNyYy9zaWRlcGFuZWwudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiLy8gU2hhcmVkIHR5cGVzICYgbWVzc2FnZSBwcm90b2NvbCBiZXR3ZWVuIGNvbnRlbnQgc2NyaXB0LCBzaWRlIHBhbmVsLCBhbmRcbi8vIGJhY2tncm91bmQgc2VydmljZSB3b3JrZXIuXG5cbmV4cG9ydCB0eXBlIFJlY3QgPSB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIFZpZXdwb3J0ID0ge1xuICB3OiBudW1iZXI7IGg6IG51bWJlcjsgZHByOiBudW1iZXI7XG4gIC8vIFVzZXItcHJlZmVyZW5jZSBtZWRpYS1xdWVyeSBzdGF0ZSBhdCBjYXB0dXJlIHRpbWUuIExldHMgYSBkb3duc3RyZWFtXG4gIC8vIExMTSByZWFzb24gYWJvdXQgd2h5IGNhcHR1cmVkIGFwcGVhcmFuY2UgZGlmZmVycyBiZXR3ZWVuIHNlc3Npb25zXG4gIC8vIChlLmcuIGRhcmstbW9kZSB2cyBsaWdodC1tb2RlIG9mIHRoZSBzYW1lIGNvbXBvbmVudCkuXG4gIGNvbG9yU2NoZW1lPzogJ2RhcmsnIHwgJ2xpZ2h0JztcbiAgcmVkdWNlZE1vdGlvbj86IGJvb2xlYW47XG4gIC8vIERvY3VtZW50IGRpcmVjdGlvbiAoYGx0cmAgLyBgcnRsYCkg4oCUIGRpZmZlcmVudCBmcm9tIHZpZXdwb3J0IHNpemUsXG4gIC8vIGNoYW5nZXMgdGhlIG1lYW5pbmcgb2YgYHN0YXJ0YC9gZW5kYCBpbiBDU1MgYW5kIHRoZSBzZW5zZSBvZlxuICAvLyBgcmVjdC54YC4gQ2FwdHVyZWQgcGVyIHBhZ2UgaGVhZGVyIHNvIFJUTCBjYXB0dXJlcyBkb24ndCBnZXRcbiAgLy8gc2lsZW50bHkgbWl4ZWQgd2l0aCBMVFIgb25lcy5cbiAgZGlyZWN0aW9uPzogJ2x0cicgfCAncnRsJztcbiAgLy8gQnJvd3NlciB6b29tIGxldmVsLiBgdmlzdWFsVmlld3BvcnQuc2NhbGVgIHJlcG9ydHMgdGhlIHBpbmNoLXpvb21cbiAgLy8gZmFjdG9yOyB2YWx1ZXMgIT0gMSBtZWFuIHRoZSB1c2VyIGhhcyB6b29tZWQgaW4vb3V0IGFuZCBhbnkgbGF5b3V0XG4gIC8vIGJ1ZyB0aGV5J3JlIGNhcHR1cmluZyBtYXkgbm90IHJlcHJvIGF0IGRlZmF1bHQgem9vbS5cbiAgem9vbT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZyYW1ld29ya0luZm8gPSB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ2xpdCcgfCAnc3RlbmNpbCcgfCAnc3ZlbHRlJyB8ICd3ZWItY29tcG9uZW50JztcbiAgbmFtZT86IHN0cmluZztcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG4gIHNvdXJjZT86IHtmaWxlPzogc3RyaW5nIHwgbnVsbDsgbGluZT86IG51bWJlciB8IG51bGx9O1xuICAvLyBVcC10cmVlIGNvbXBvbmVudCBhbmNlc3RyeSAoaW5uZXJtb3N0IGZpcnN0KS4gRm9yIFJlYWN0LCB3YWxrZWQgdmlhXG4gIC8vIGZpYmVyIGByZXR1cm5gIGNoYWluOyBmb3IgVnVlLCB2aWEgYF9fdnVlUGFyZW50Q29tcG9uZW50LnBhcmVudGAuXG4gIC8vIFRoZSBjb21wb25lbnQgbmFtZSBhbG9uZSBkb2Vzbid0IHRlbGwgYW4gYWdlbnQgd2hpY2ggZmlsZSBvd25zIHRoZVxuICAvLyByZW5kZXJpbmcg4oCUIHRoZSBjaGFpbiBoZWxwcyBpdCBncmVwIHVwd2FyZCB0byBmaW5kIHRoZSByb3V0ZVxuICAvLyBjb21wb25lbnQsIHRoZW4gZHJpbGwgaW50byB0aGUgb3duaW5nIGZpbGUuXG4gIGNoYWluPzogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBBbmNlc3RvciA9IHtcbiAgdGFnOiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIGNsYXNzZXM/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE1hdGNoZWRSdWxlID0ge1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBkZWNsYXJhdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBtZWRpYT86IHN0cmluZztcbiAgLy8gV2FzIHRoZSBAbWVkaWEgcXVlcnkgdGhhdCB3cmFwcyB0aGlzIHJ1bGUgYWN0dWFsbHkgbWF0Y2hlZCBhdFxuICAvLyBjYXB0dXJlIHRpbWU/IGB0cnVlYCA9IGFjdGl2ZSxcbiAgLy8gYGZhbHNlYCA9IG1hdGNoZWQgdGhlIHNlbGVjdG9yIGJ1dCBpbmFjdGl2ZSAoZS5nLiBtb2JpbGUgcnVsZXNcbiAgLy8gY2FwdHVyZWQgb24gYSBkZXNrdG9wIHZpZXdwb3J0KSwgYHVuZGVmaW5lZGAgPSBtYXRjaE1lZGlhIHRocmV3LlxuICBtZWRpYUFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG4vLyBTeW50aGV0aWMgaGludHMgUGluY2hHcmFiIGFkZHMgdG8gZW50cmllcyDigJQga2VwdCBkaXN0aW5jdCBmcm9tIGBhdHRyc2Bcbi8vIChyZWFsIERPTSBhdHRyaWJ1dGVzKSBzbyBjb25zdW1lcnMgY2FuIHRlbGwgd2hhdCBjYW1lIGZyb20gdGhlIHBhZ2UgdnNcbi8vIHdoYXQgdGhlIGNhcHR1cmUgcGlwZWxpbmUgaW5qZWN0ZWQuXG5leHBvcnQgdHlwZSBFbnRyeUhpbnRzID0ge1xuICBmb3JtYXQ/OiBzdHJpbmc7ICAgICAvLyBpbnB1dCBmb3JtYXQgaGludCAoZS5nLiAnWVlZWS1NTS1ERCcpXG4gIHZhbHVlTWFza2VkPzogYm9vbGVhbjsgLy8gcGFzc3dvcmQgdmFsdWUgd2FzIG1hc2tlZCBhdCBjYXB0dXJlIHRpbWVcbn07XG5cbmV4cG9ydCB0eXBlIEVudHJ5ID0ge1xuICAvLyBTdGFibGUgcGVyLWVudHJ5IHV1aWQuIEdlbmVyYXRlZCBhdCBjYXB0dXJlIHRpbWUuIERpc3RpbmN0IGZyb20gYG5gXG4gIC8vIChkaXNwbGF5IHNlcXVlbmNlKSBhbmQgZnJvbSBgaWRgIChET00gaHRtbCBpZCBhdHRyaWJ1dGUpLiBGb3JlaWduLWtleVxuICAvLyB0YXJnZXQgZm9yIEZlZWRiYWNrTWVzc2FnZS5wYXJlbnRJZC5cbiAgdWlkOiBzdHJpbmc7XG4gIC8vIEZvcmVpZ24ga2V5IGludG8gdGhlIHNlc3Npb24gcm93IChQYWdlTWVzc2FnZS5zZXNzaW9uSWQpLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgbGluayBjYXB0dXJlcyBiYWNrIHRvIFwid2hpY2ggcGFnZS1sb2FkIGNvbnRleHQgZGlkIHRoZXlcbiAgLy8gY29tZSBmcm9tP1wiIHdpdGhvdXQgZGVwZW5kaW5nIG9uIFVSTCBzdHJpbmcgZXF1YWxpdHksIHdoaWNoIGJyZWFrc1xuICAvLyBvbiBoYXNoIG5hdmlnYXRpb24sIHF1ZXJ5LXBhcmFtIHN3YXBzLCBhbmQgU1BBIHJvdXRpbmcuIFNldCBieSB0aGVcbiAgLy8gc2lkZSBwYW5lbCBhdCBtZXNzYWdlLXJlY2VpdmUgdGltZSwgbm90IG9uIHRoZSBwYWdlIHNpZGUuXG4gIHNlc3Npb25JZD86IHN0cmluZztcbiAgbjogbnVtYmVyO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGFnOiBzdHJpbmc7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIG91dGVySFRNTD86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgLy8gVGhlIHZpc3VhbGx5LXJlbmRlcmVkIGZvcm0gd2hlbiBDU1MgYHRleHQtdHJhbnNmb3JtYCBpcyBzZXQuIENhcHR1cmVkXG4gIC8vIGFsb25nc2lkZSBgdGV4dGAgKHdoaWNoIGlzIHRoZSBzb3VyY2UtdHJ1dGggYHRleHRDb250ZW50YCkgc28gYW4gTExNXG4gIC8vIGNhbiBkaXNhbWJpZ3VhdGUgYmV0d2VlbiBlLmcuIHNvdXJjZSBgUmVmcmVzaGAgYW5kIHJlbmRlcmVkIGBSRUZSRVNIYFxuICAvLyB3aXRob3V0IGZhbHNlLWdyZXBwaW5nIGFnYWluc3QgZWl0aGVyLlxuICByZW5kZXJlZFRleHQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIGFjY2Vzc2libGVOYW1lPzogc3RyaW5nO1xuICBpZD86IHN0cmluZzsgICAgICAgICAgICAvLyB0aGUgRE9NIGh0bWwgaWQgYXR0cmlidXRlICh1bmNoYW5nZWQpXG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIHJlYWwgRE9NIGF0dHJpYnV0ZXMgb25seVxuICBoaW50cz86IEVudHJ5SGludHM7ICAgICAvLyBzeW50aGV0aWMgY2FwdHVyZS10aW1lIGhpbnRzXG4gIHJlY3Q6IFJlY3Q7XG4gIHZpZXdwb3J0OiBWaWV3cG9ydDtcbiAgaW5TaGFkb3dET00/OiBib29sZWFuO1xuICAvLyBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzaGFkb3cgaG9zdCB3aGVuIGBpblNoYWRvd0RPTWAgaXMgdHJ1ZS4gTGV0cyBhXG4gIC8vIGNvbnN1bWVyIChvciB0aGUgcGFuZWwncyByZS12YWxpZGF0aW9uIHBhc3MpIGZpbmQgdGhlIGhvc3QgZWxlbWVudFxuICAvLyBzaW5jZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgZG9lc24ndCBwaWVyY2Ugc2hhZG93IHJvb3RzLlxuICBzaGFkb3dIb3N0Pzogc3RyaW5nO1xuICBjb21wb25lbnRSb290Pzogc3RyaW5nO1xuICBhbmNlc3RvcnM/OiBBbmNlc3RvcltdO1xuICBjb21wb25lbnQ/OiBGcmFtZXdvcmtJbmZvO1xuICAvLyBSZWFjdCBldmVudCBoYW5kbGVyIG5hbWVzIHByb2JlZCBmcm9tIGBfX3JlYWN0UHJvcHMkPGtleT5gIOKAlCBhbnN3ZXJzXG4gIC8vIFwid2hpY2ggaGFuZGxlciBmaXJlcyB3aGVuIHRoaXMgaXMgY2xpY2tlZD9cIiB3aXRob3V0IGFuIExMTSBoYXZpbmcgdG9cbiAgLy8gZ3JlcCB0aGUgY29kZWJhc2UuIEluIGRldiBidWlsZHMgdGhlc2UgYXJlIHJlYWwgZnVuY3Rpb24gbmFtZXM7IGluXG4gIC8vIHByb2QgdGhleSdyZSBtaW5pZmllZCBidXQgc3RpbGwgYW5jaG9yLWFibGUuXG4gIGV2ZW50cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIGh0bXggLyBTdGltdWx1cyAvIEFscGluZSAvIFR1cmJvIHdpcmluZyBvbiB0aGUgZWxlbWVudC4gU2VydmVyLVxuICAvLyByZW5kZXJlZCBhcHBzIGRvbid0IGhhdmUgUmVhY3QgZmliZXJzIOKAlCBmb3IgdGhlbSwgdGhpcyBJUyB0aGVcbiAgLy8gY29tcG9uZW50IHNoYXBlLlxuICBiZWhhdmlvckF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gVHJ1ZSB3aGVuIGBlbC5nZXRBbmltYXRpb25zKClgIHJlcG9ydGVkIGFuIGFjdGl2ZWx5LXBsYXlpbmdcbiAgLy8gYW5pbWF0aW9uIGF0IGNhcHR1cmUgdGltZS4gVGVsbHMgdGhlIGNvbnN1bWVyIHRoYXQgY2FwdHVyZWQgcmVjdCAvXG4gIC8vIHRyYW5zZm9ybSAvIG9wYWNpdHkgbWF5IGJlIGF0IGFuIGludGVycG9sYXRlZCBtaWQtYW5pbWF0aW9uIHZhbHVlLlxuICBpc0FuaW1hdGluZz86IGJvb2xlYW47XG4gIC8vIEZvciBlbGVtZW50cyByZW5kZXJlZCBpbnRvIGEgYDxjYW52YXM+YCwgdGhlIERPTSBnaXZlcyB1cyBlc3NlbnRpYWxseVxuICAvLyBub3RoaW5nIGFib3V0IHdoYXQgd2FzIGNsaWNrZWQg4oCUIHRoZSBjYW52YXMgaGFzIG5vIGNoaWxkcmVuLCBub1xuICAvLyB0ZXh0LCBubyBtZWFuaW5nZnVsIHNlbGVjdG9ycyBiZWxvdyB0aGUgY2FudmFzIGl0c2VsZi4gQ2FwdHVyZSB0aGVcbiAgLy8gY2xpY2sgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNhbnZhcydzIGJvdW5kaW5nIGJveCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gY29uc3VtZXIgY2FuIGNvcnJlbGF0ZSAoZS5nLiBhZ2FpbnN0IGEgRGF0YWRvZyAvIFRhYmxlYXUgLyBjaGFydGluZ1xuICAvLyBsaWJyYXJ5IHRoYXQgZXhwb3NlcyBkYXRhLXBvaW50IGNvb3JkaW5hdGVzKS4gQ29vcmRpbmF0ZXMgYXJlIENTU1xuICAvLyBwaXhlbHM7IG11bHRpcGx5IGJ5IGB2aWV3cG9ydC5kcHJgIHRvIGdldCBkZXZpY2UgcGl4ZWxzLlxuICBjYW52YXNDbGljaz86IHtcbiAgICBvZmZzZXRYOiBudW1iZXI7XG4gICAgb2Zmc2V0WTogbnVtYmVyO1xuICAgIGNhbnZhc1c6IG51bWJlcjtcbiAgICBjYW52YXNIOiBudW1iZXI7XG4gICAgY2FudmFzU2VsZWN0b3I6IHN0cmluZztcbiAgfTtcbiAgLy8gQ29udGVudGVkaXRhYmxlIHJpY2gtdGV4dCBlZGl0b3IgY29udGV4dC4gUG9wdWxhdGVkIHdoZW4gdGhlIGNhcHR1cmVkXG4gIC8vIG5vZGUgaXMsIG9yIGxpdmVzIGluc2lkZSwgYSBgW2NvbnRlbnRlZGl0YWJsZT10cnVlXWAgYW5jZXN0b3IuIExldHNcbiAgLy8gYW4gTExNIHJlYXNvbmluZyBhYm91dCBhIFwiY29weSBpcyB3cm9uZ1wiIC8gXCJ0aGUgZWRpdG9yIGJyZWFrcyB3aGVuIFhcIlxuICAvLyBjYXB0dXJlIGtub3cgd2hpY2ggZWRpdG9yIGxpYnJhcnkgdG8gbG9vayBhdCDigJQgc2VsZWN0b3JzIGdlbmVyYXRlZFxuICAvLyBieSBQcm9zZU1pcnJvciAvIExleGljYWwgLyBldGMgYXJlIHJ1bnRpbWUtaW50ZXJuYWwgYW5kIHdvbid0IGdyZXBcbiAgLy8gYWdhaW5zdCB1c2VyIGNvZGUsIGJ1dCB0aGUgTElCUkFSWSBwb2ludGVyIHJvdXRlcyB0aGUgTExNIHRvIHRoZVxuICAvLyByaWdodCB3cmFwcGVyIGNvbXBvbmVudC5cbiAgZWRpdG9yPzoge1xuICAgIGtpbmQ6ICdwcm9zZW1pcnJvcicgfCAnbGV4aWNhbCcgfCAnc2xhdGUnIHwgJ3F1aWxsJyB8ICd0aXB0YXAnIHwgJ25hdGl2ZSc7XG4gICAgcm9vdFNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29udGVudExlbmd0aDogbnVtYmVyO1xuICB9O1xuICAvLyBMYXN0IGZldyBET00gbXV0YXRpb25zIEJFRk9SRSB0aGUgY2xpY2suIFJlcHJvIGNvbnRleHQgZm9yIGJ1Z3MgbGlrZVxuICAvLyBcIkkgY2xpY2tlZCB0aGUgd3JvbmcgZHJvcGRvd24gb3B0aW9uXCIgb3IgXCJ0aGUgdmFsdWUgZmxpY2tlcmVkIGJlZm9yZVxuICAvLyBJIGNsaWNrZWQgaXRcIiDigJQgd2l0aG91dCB0aGlzLCB0aGUgSlNPTiBzbmFwc2hvdHMgb25seSB0aGUgcG9zdC1cbiAgLy8gbXV0YXRpb24gc3RhdGUsIGxlYXZpbmcgdGhlIExMTSBibGluZCB0byB3aGF0IHRyaWdnZXJlZCB0aGVcbiAgLy8gYXBwZWFyYW5jZSB0aGUgdXNlciBjb21wbGFpbmVkIGFib3V0LiBQaW5jaGdyYWIga2VlcHMgYW4gOC1zZWNvbmRcbiAgLy8gcmluZyBidWZmZXIgb2YgbXV0YXRpb24gcmVjb3JkczsgY2FwdHVyZSBhdHRhY2hlcyB0aGUgbW9zdCByZWNlbnRcbiAgLy8gMyBhcyBhIHNuYXBzaG90LlxuICBkb21NdXRhdGlvbnM/OiBEb21NdXRhdGlvbltdO1xuICBzdGF0ZXM/OiBzdHJpbmdbXTsgICAgICAvLyBhY3RpdmUgcHNldWRvLWNsYXNzZXMgKHdhcyBSZWNvcmQ8c3RyaW5nLCB0cnVlPiBpbiB2MSlcbiAgLy8gTG9jYXRvciBxdWFsaXR5OiBob3cgbWFueSBlbGVtZW50cyBgc2VsZWN0b3JgIHJlc29sdmVzIHRvIGluIGl0c1xuICAvLyBzY29wZSAoMSA9IHVuaXF1ZSkuIEhpZ2hlciBtZWFucyB0aGUgc2VsZWN0b3IgaXMgYW1iaWd1b3VzLlxuICBzZWxlY3Rvck1hdGNoQ291bnQ/OiBudW1iZXI7XG4gIC8vIERpc2FtYmlndWF0ZWQgb3JkZXJpbmcgZmllbGRzLlxuICAvLyBgbmAgaXMgcHJlc2VydmVkIGZvciBiYWNrd2FyZHMgY29tcGF0IChpdCdzIHRoZSBjYXB0dXJlLXNlcXVlbmNlXG4gIC8vIGRpc3BsYXkgbGFiZWwgaW4gdGhlIHNpZGViYXIpLiBUaGUgbmV3IGZpZWxkcyBhcmUgZW1pdC10aW1lIG9ubHk6XG4gIC8vICAg4oCiIGNhcHR1cmVJbmRleCDigJQgc2FtZSBhcyBgbmAgKGNhcHR1cmUgc2VxdWVuY2Ugd2l0aGluIHNlc3Npb24pXG4gIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCB0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCByYW5rIHdpdGhpbiB0aGUgcGFnZVxuICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIGh1bWFuLWZhY2luZyBsYWJlbCAobWlycm9ycyBgbmAgdG9kYXkpXG4gIGNhcHR1cmVJbmRleD86IG51bWJlcjtcbiAgZXZlbnRJbmRleD86IG51bWJlcjtcbiAgdmlzdWFsT3JkZXI/OiBudW1iZXI7XG4gIGRpc3BsYXlMYWJlbD86IHN0cmluZztcbiAgLy8gR3JvdXAgZmxhdHRlbmluZyBmaWVsZHMuXG4gIC8vIFRoZSBncm91cCBoZWFkIGNhcnJpZXMgYGdyb3VwTWVtYmVyVWlkc2AgKGp1c3QgdGhlIElEcyk7IGVhY2hcbiAgLy8gbWVtYmVyIGVtaXRzIGFzIGl0cyBvd24gdG9wLWxldmVsIHJvdyB3aXRoIGBncm91cFVpZGAgcG9pbnRpbmdcbiAgLy8gYmFjayBhdCB0aGUgaGVhZC5cbiAgZ3JvdXBNZW1iZXJVaWRzPzogc3RyaW5nW107XG4gIGdyb3VwVWlkPzogc3RyaW5nO1xuICAvLyBMaWdodHdlaWdodCBhMTF5IGF1ZGl0IGNhcHR1cmVkIGF0IGNsaWNrIHRpbWUuIEhlYXZpZXIgY2hlY2tzXG4gIC8vIChmb2N1cy12aXNpYmxlIHNjcmVlbnNob3RzLCBheGUgdmlvbGF0aW9ucykgYXJlIG5vdCB5ZXQgd2lyZWQuXG4gIGExMXk/OiB7XG4gICAgY29udHJhc3RSYXRpbz86IG51bWJlcjtcbiAgICBjb250cmFzdFBhc3Nlcz86ICdBQScgfCAnQUFBJyB8ICdmYWlsJztcbiAgICB0YWJiYWJsZT86IGJvb2xlYW47XG4gICAgZm9jdXNWaXNpYmxlPzogYm9vbGVhbjtcbiAgfTtcbiAgLy8gUGFyZW50IGxheW91dCBjb250ZXh0IOKAlCBmbGV4L2dyaWQvb3ZlcmZsb3cvc2Nyb2xsL3N0YWNraW5nXG4gIC8vIGFuY2VzdG9ycyB0aGF0IHNoYXBlIHRoZSBjYXB0dXJlZCBlbGVtZW50J3MgYXBwZWFyYW5jZS5cbiAgbGF5b3V0Q29udGV4dD86IEFycmF5PHtcbiAgICB0YWc6IHN0cmluZztcbiAgICBkaXNwbGF5Pzogc3RyaW5nO1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICAgIG92ZXJmbG93Pzogc3RyaW5nO1xuICAgIHpJbmRleD86IHN0cmluZztcbiAgICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG4gICAgd2lsbENoYW5nZT86IHN0cmluZztcbiAgICBpc1Njcm9sbENvbnRhaW5lcj86IGJvb2xlYW47XG4gICAgc2Nyb2xsTGVmdD86IG51bWJlcjtcbiAgICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gICAgZmxleD86IHtkaXJlY3Rpb24/OiBzdHJpbmc7IHdyYXA/OiBzdHJpbmc7IGFsaWduSXRlbXM/OiBzdHJpbmc7IGp1c3RpZnlDb250ZW50Pzogc3RyaW5nOyBnYXA/OiBzdHJpbmd9O1xuICAgIGdyaWQ/OiB7dGVtcGxhdGVDb2x1bW5zPzogc3RyaW5nOyB0ZW1wbGF0ZVJvd3M/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gIH0+O1xuICAvLyBBc3NldCByZWZlcmVuY2VzIGluc2lkZSB0aGUgY2FwdHVyZWQgc3VidHJlZSAoaW1nIHNyYywgPHVzZSBocmVmPixcbiAgLy8gYmFja2dyb3VuZC1pbWFnZSB1cmwpLiBXaGVuIGEgY29tcGxhaW50IGlzIGFib3V0IGEgbG9nbyAvIGljb24gL1xuICAvLyBhcnR3b3JrLCBhbiBhZ2VudCB3aXRob3V0IHRoZXNlIHJlZmVyZW5jZXMgd291bGQgYmUgbGVmdCBndWVzc2luZy5cbiAgYXNzZXRzPzogQXJyYXk8e1xuICAgIHNyYzogc3RyaW5nO1xuICAgIG5hdHVyYWxXPzogbnVtYmVyOyBuYXR1cmFsSD86IG51bWJlcjtcbiAgICByZW5kZXJlZFc/OiBudW1iZXI7IHJlbmRlcmVkSD86IG51bWJlcjtcbiAgICBhbHQ/OiBzdHJpbmc7XG4gICAgbG9hZGVkPzogYm9vbGVhbjtcbiAgfT47XG4gIHN0eWxlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1hdGNoZWRSdWxlcz86IE1hdGNoZWRSdWxlW107XG4gIHBzZXVkb0VsZW1lbnRzPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj47XG4gIC8vIFRydW5jYXRpb24gbWFya2VycyDigJQgcHJlc2VudCB3aGVuIGNhcHR1cmUgaGFkIHRvIGVsaWRlIGNvbnRlbnQuIExldHNcbiAgLy8gYSBjb25zdW1lciBkZXRlY3QgXCJ0aGlzIGVudHJ5IHdhcyBjdXQgZG93blwiIGFuZCByZWZldGNoIGZyb20gdGhlXG4gIC8vIGxpdmUgcGFnZSBpZiBpdCBuZWVkcyB0aGUgZnVsbCB2ZXJzaW9uLlxuICAvLyAgIG91dGVySFRNTCDigJQgb3JpZ2luYWwgaHRtbCBsZW5ndGggYmVmb3JlIHRoZSBzaXplLWNhcCBraWNrZWQgaW4uXG4gIC8vICAgY2hpbGRyZW4gIOKAlCBudW1iZXIgb2YgZGVzY2VuZGFudCBzdWJ0cmVlcyByZXBsYWNlZCBieSBkZXB0aC1jYXBcbiAgLy8gICAgICAgICAgICAgICBlbGlzaW9uIG1hcmtlcnMgKGA8IS0tIE4gY2hpbGRyZW4gZWxpZGVkIC0tPmApLlxuICB0cnVuY2F0ZWQ/OiB7b3V0ZXJIVE1MPzogbnVtYmVyOyBjaGlsZHJlbj86IG51bWJlcjsgdGV4dD86IG51bWJlcn07XG4gIC8vIEdyb3VwIG9mIGFkZGl0aW9uYWwgY2FwdHVyZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50cnkgKEFsdCtTaGlmdCtDbGlja1xuICAvLyAvIEFsdCtkcmFnIHNlbGVjdGlvbnMgY29sbGFwc2UgaGVyZSkuXG4gIGdyb3VwPzogRW50cnlbXTtcbiAgLy8gT3B0aW9uYWwgc2NyZWVuc2hvdCBidW5kbGU6IGVhY2ggZmllbGQgaXMgYSByZWxhdGl2ZSBwYXRoIHVuZGVyIHRoZVxuICAvLyB1c2VyJ3MgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIHJvb3QuIFRoZSBjYXB0dXJlZEF0IHN0YW1wIGlzXG4gIC8vIHRoZSBJU08gdGltZXN0YW1wIHdoZW4gdGhlIHNob3Qgd2FzIHRha2VuLlxuICBzY3JlZW5zaG90Pzoge1xuICAgIGVsZW1lbnQ/OiBzdHJpbmc7XG4gICAgZ3JvdXA/OiBzdHJpbmc7XG4gICAgcGFnZT86IHN0cmluZztcbiAgICBjYXB0dXJlZEF0Pzogc3RyaW5nO1xuICAgIC8vIEFuIGVtcHR5IGBzY3JlZW5zaG90YCBmaWVsZCBjb3VsZCBtZWFuIFwibm90IHlldCBzaG90XCIsIFwiZmFpbGVkXCIsXG4gICAgLy8gb3IgXCJza2lwcGVkIG9uIHB1cnBvc2VcIi4gV2hlbiB0aGUgcGlwZWxpbmUgZGVjbGluZXMgb3IgZmFpbHMsXG4gICAgLy8gc2V0IHRoaXMgc28gcmVjZWl2ZXJzIGtub3cgaXQncyBub3QgYSByZXRyeSBjYW5kaWRhdGUuXG4gICAgdW5hdmFpbGFibGVSZWFzb24/OiAnYXV0b1NjcmVlbnNob3RPZmYnIHwgJ3NraXBTY3JlZW5zaG90SG9zdHMnIHwgJ2NhcHR1cmVGYWlsZWQnIHwgJ3Blcm1pc3Npb25EZW5pZWQnIHwgc3RyaW5nO1xuICAgIC8vIENyb3AgbWV0YWRhdGEgZGVzY3JpYmluZyB3aGVyZSB0aGUgY3JvcHBlZCBQTkcgZml0cyBpbiB0aGVcbiAgICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgIGNyb3A/OiB7XG4gICAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRldmljZVB4UmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgICBkcHI6IG51bWJlcjtcbiAgICAgIHBhZGRpbmc6IG51bWJlcjtcbiAgICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gICAgfTtcbiAgfTtcbn07XG5cbi8vIEZ1bGwtcGFnZSBzY3JlZW5zaG90ICsgcGFnZSBtZXRhZGF0YSwgZW1pdHRlZCBvbmNlIHBlciBkaXN0aW5jdCBwYWdlIFVSTFxuLy8gaW52b2x2ZWQgaW4gY2FwdHVyZXMgKGRlZHVwZWQgYnkgVVJMKS4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMLlxuLy8gYHBhcnRpYWxgIGlzIHNldCB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IGNvdWxkIGJlIGNhcHR1cmVkIChmdWxsLXBhZ2Ugc3RpdGNoXG4vLyB1bmF2YWlsYWJsZSkg4oCUIHNlZSBiYWNrZ3JvdW5kLnRzIHN0aXRjaFBhZ2UgbGltaXRhdGlvbnMuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3QgPSB7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nOyBjYXB0dXJlZEF0OiBzdHJpbmc7IHZpZXdwb3J0OiB7d2lkdGg6IG51bWJlcjtoZWlnaHQ6IG51bWJlcn07IHNjcm9sbFdpZHRoOiBudW1iZXI7IHNjcm9sbEhlaWdodDogbnVtYmVyOyBkZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7IGxhbmc6IHN0cmluZzsgc2NyZWVuc2hvdDogc3RyaW5nOyBwYXJ0aWFsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBEb21NdXRhdGlvbiA9IHtcbiAgdHlwZTogJ2NoaWxkTGlzdCcgfCAnYXR0cmlidXRlcycgfCAnY2hhcmFjdGVyRGF0YSc7XG4gIHRzOiBzdHJpbmc7ICAgICAgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIG11dGF0aW9uIGZpcmVkXG4gIHRhcmdldDogc3RyaW5nOyAgICAgICAgLy8gY29tcGFjdCBkZXNjcmlwdG9yIG9mIHRoZSBtdXRhdGlvbidzIHRhcmdldCAoYHRhZyNpZC5jbHNgKVxuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICBvbGRWYWx1ZT86IHN0cmluZzsgICAgIC8vIHRydW5jYXRlZCwgd2l0aCBzZWNyZXQtc2hhcGVkIG5hbWVzIHJlZGFjdGVkXG4gIG5ld1ZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgYWRkZWQ/OiBudW1iZXI7ICAgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIGFkZGVkIG5vZGVzXG4gIHJlbW92ZWQ/OiBudW1iZXI7ICAgICAgLy8gY2hpbGRMaXN0OiBjb3VudCBvZiByZW1vdmVkIG5vZGVzXG4gIHN1bW1hcnk/OiBzdHJpbmc7ICAgICAgLy8gb25lLWxpbmUgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb25cbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VDb250ZXh0ID0ge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICB0b2tlbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8vIEJyb3dzZXIgKyBsb2NhbGUgZmluZ2VycHJpbnQgZm9yIHNlc3Npb24tbGV2ZWwgY29udGV4dC4gTGV0cyBhXG4gIC8vIGRvd25zdHJlYW0gY29uc3VtZXIgYW5zd2VyIFwid2hpY2ggYnJvd3NlciBwcm9kdWNlZCB0aGlzIGNhcHR1cmU/XCIgb3JcbiAgLy8gXCJ3YXMgdGhlIGNhcHR1cmVkIGFwcCByZW5kZXJlZCBpbiBhbiBSVEwgbG9jYWxlP1wiIHdpdGhvdXQgcmVydW5uaW5nLlxuICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG4gIGxhbmc/OiBzdHJpbmc7XG4gIC8vIEdpdCBidWlsZCBpZGVudGl0eSwgd2hlbiB0aGUgY2FwdHVyZWQgYXBwIGV4cG9zZXNcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpblwiPmAuXG4gIGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTtcbiAgLy8gV2hhdGV2ZXIgZWxlbWVudCBoYWQgZm9jdXMgYXQgY2FwdHVyZSB0aW1lLCBwbHVzIGEgaGludCBhcyB0b1xuICAvLyB3aGV0aGVyIHRoZSB1c2VyIG5hdmlnYXRlZCB0aGVyZSB3aXRoIHRoZSBrZXlib2FyZCAoVGFiIC8gU2hpZnQrVGFiXG4gIC8vIHByZXNzZWQgaW4gdGhlIGxhc3Qgc2Vjb25kKS4gVXNlZnVsIGZvciBhY2Nlc3NpYmlsaXR5LWJ1ZyBjYXB0dXJlczpcbiAgLy8gXCJ0aGlzIGVsZW1lbnQgbG9va3Mgd3Jvbmcgb25seSB3aGVuIGtleWJvYXJkLWZvY3VzZWRcIi5cbiAgYWN0aXZlRm9jdXM/OiB7c2VsZWN0b3I/OiBzdHJpbmc7IHJlY2VudGx5VGFiYmVkPzogYm9vbGVhbn07XG59O1xuXG4vLyAtLS0tLS0tLS0tIFNpZGUtcGFuZWwgXCJtZXNzYWdlc1wiIChVSSByb3dzKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIFNlbGVjdG9yTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3NlbGVjdG9yJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgZW50cnk6IEVudHJ5O1xuICBwaW5uZWQ/OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmllbGQga2VwdCBhcm91bmQgYmVjYXVzZSBvbGQgd29ya3NwYWNlcyBtYXkgc3RpbGwgaGF2ZSBpdDsgd2VcbiAgLy8gc3RyaXAgaXQgb24gY2FwdHVyZSwgYnV0IGRvbid0IHJlamVjdCBpdCBvbiBpbXBvcnQuXG4gIGR1cGVQZW5kaW5nPzogdW5rbm93bjtcbn07XG5cbmV4cG9ydCB0eXBlIEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgdHlwZTogJ2ZlZWRiYWNrJztcbiAgaWQ6IHN0cmluZztcbiAgdHM6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICAvLyBPcHRpb25hbCBmb3JlaWduIGtleSBpbnRvIEVudHJ5LnVpZC4gQWRqYWNlbmN5IHRvIGEgcHJlY2VkaW5nIHNlbGVjdG9yXG4gIC8vIGlzIHRoZSBoaXN0b3JpY2FsIGxpbms7IHBhcmVudElkIG1ha2VzIGl0IGV4cGxpY2l0IGFuZCBzdXJ2aXZlc1xuICAvLyByZS1vcmRlcmluZyAvIHNwbGl0LWdyb3VwIC8gaW1wb3J0LWV4cG9ydCByb3VuZC10cmlwcy5cbiAgcGFyZW50VWlkPzogc3RyaW5nO1xuICAvLyBVc2VyIGV4cGxpY2l0bHkgZGV0YWNoZWQgdGhpcyBjb21tZW50IGZyb20gYW55IHNlbGVjdG9yLiBXaXRob3V0IHRoZVxuICAvLyBmbGFnLCBhZGphY2VuY3kgdG8gdGhlIHByZWNlZGluZyBzZWxlY3RvciB3b3VsZCBzaWxlbnRseSByZS1hZG9wdCB0aGVcbiAgLy8gY29tbWVudCBhdCByZW5kZXIvZXhwb3J0IHRpbWUuXG4gIGRldGFjaGVkPzogYm9vbGVhbjtcbiAgdGFncz86IHN0cmluZ1tdO1xuICAvLyBTZXZlcml0eSAoYG5vdGVgIC8gYGZpeGAgLyBgYmxvY2tgKSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBVSSBpblxuICAvLyAyMDI2LTA1LiBUaGUgZmllbGQgaXMgcmV0YWluZWQgb24gdGhlIHR5cGUgYXMgYHVua25vd25gIHNvXG4gIC8vIHRvbGVyYW50IHJlYWRlcnMgKGBkZW5vcm1hbGl6ZUVudHJ5YCkgZG9uJ3QgZHJvcCB0aGUgdmFsdWUgZnJvbVxuICAvLyBsZWdhY3kgSlNPTkwgZXhwb3J0czsgbmV3IHNlc3Npb25zIG5ldmVyIHNldCBpdC5cbiAgc2V2ZXJpdHk/OiAnbm90ZScgfCAnZml4JyB8ICdibG9jayc7XG59O1xuXG5leHBvcnQgdHlwZSBQYWdlTWVzc2FnZSA9IHtcbiAgdHlwZTogJ3BhZ2UnO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHZpZXdwb3J0PzogVmlld3BvcnQ7XG4gIHRva2Vucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBSb3V0ZSBpZGVudGl0eSBiZXlvbmQgdGhlIFVSTC4gQmVzdC1lZmZvcnQgYnJlYWtkb3duIG9mIHBhdGhuYW1lXG4gIC8vIC8gcXVlcnkgLyBoYXNoICsgYSBndWVzcyBhdCB0aGVcbiAgLy8gYWN0aXZlIHJvdXRlTmFtZSAoYD9yb3V0ZT1zZXR0aW5nc2Agb3IgYCMvdXNlcnMvNDJgIHN0eWxlKS5cbiAgcm91dGU/OiB7XG4gICAgcGF0aG5hbWU/OiBzdHJpbmc7XG4gICAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGhhc2g/OiBzdHJpbmc7XG4gICAgcm91dGVOYW1lPzogc3RyaW5nO1xuICAgIHJvdXRlUGFyYW0/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFJlZGFjdGVkIHN0YXRlIHNuYXBzaG90LiBTdXJmYWNlcyB0aGUgU0hBUEUgb2Ygc3RhdGUgdGhhdCBwcm9kdWNlZFxuICAvLyB0aGUgcGFnZSAoc3RvcmFnZSBrZXlzLCBjb29raWUgbmFtZXMsIGZlYXR1cmUgZmxhZ3MpIHdpdGhvdXRcbiAgLy8gbGVha2luZyB2YWx1ZXMuIExldHMgYSBkb3duc3RyZWFtIGFnZW50IHJlcHJvZHVjZSBieSBzZXR0aW5nIHVwIHRoZVxuICAvLyBzYW1lIGtleXMgd2l0aCB0aGVpciBvd24gZGF0YS5cbiAgc3RhdGU/OiB7XG4gICAgc3RvcmFnZUtleXM/OiBzdHJpbmdbXTtcbiAgICBzZXNzaW9uS2V5cz86IHN0cmluZ1tdO1xuICAgIGNvb2tpZU5hbWVzPzogc3RyaW5nW107XG4gICAgZmVhdHVyZUZsYWdzPzogc3RyaW5nO1xuICB9O1xuICAvLyBTZXNzaW9uIHV1aWQuIFN0YWJsZSBwZXIgd29ya3NwYWNlLWJvb3Qg4oCUIHNlbGVjdG9yIGVudHJpZXMgcmVmZXJlbmNlXG4gIC8vIGl0IHZpYSBgRW50cnkuc2Vzc2lvbklkYCBzbyBhIGNvbnN1bWVyIGNhbiBsaW5rIGNhcHR1cmVzIHRvIHRoZWlyXG4gIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJpc29uLlxuICBzZXNzaW9uSWQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBQYW5lbE1lc3NhZ2UgPSBTZWxlY3Rvck1lc3NhZ2UgfCBGZWVkYmFja01lc3NhZ2UgfCBQYWdlTWVzc2FnZTtcblxuLy8gLS0tLS0tLS0tLSBJUEMgcGF5bG9hZHMgKENTIOKGlCBQYW5lbCDihpQgQmFja2dyb3VuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB0eXBlIENzVG9QYW5lbCA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlJzsgZW50cnk6IEVudHJ5OyBwYWdlOiBQYWdlQ29udGV4dDsgZ3JvdXBlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdob3Zlcic7IHNlbGVjdG9yOiBzdHJpbmc7IHRhZzogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyByZWN0OiBSZWN0fVxuICB8IHtraW5kOiAnaG92ZXItZW5kJ31cbiAgLy8gUGFnZSByZXBvcnRzIGl0cyBzdGlja3kgcGluY2gtbW9kZSBzdGF0ZSAoZS5nLiB0aGUgdXNlciBwcmVzc2VkIEVzYyBvblxuICAvLyB0aGUgcGFnZSB0byBleGl0KSBzbyB0aGUgcGFuZWwgdG9nZ2xlIHN0YXlzIGluIHN5bmMuXG4gIHwge2tpbmQ6ICdzZWxlY3QtbW9kZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fVxuICAvLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIG1ldGFkYXRhIGZvciBvbmUgZGlzdGluY3QgcGFnZSAoVVJMKS4gRW1pdHRlZCBhdFxuICAvLyBtb3N0IG9uY2UgcGVyIFVSTCAodGhlIGNvbnRlbnQgc2NyaXB0IGRlZHVwZXMpLiBUaGUgcGFuZWwgY2FuIHN0YXNoIHRoZXNlXG4gIC8vIGFzIHBhZ2UtbGV2ZWwgY29udGV4dCAvIGV4cG9ydCB0aGVtIGFsb25nc2lkZSBlbGVtZW50IHNob3RzLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdCc7IHBheWxvYWQ6IFBhZ2VTbmFwc2hvdH07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9DcyA9XG4gIHwge2tpbmQ6ICdvdXRsaW5lJzsgc2VsZWN0b3I6IHN0cmluZzsgZ29sZD86IGJvb2xlYW47IGRhc2hlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ31cbiAgLy8gU3RpY2t5IFwicGluY2ggbW9kZVwiOiB3aGlsZSBvbiwgcGxhaW4gaG92ZXIvY2xpY2sgY2FwdHVyZXMgd2l0aG91dCB0aGVcbiAgLy8gQWx0IG1vZGlmaWVyLCBhbmQgdGhlIHBhZ2Ugc2hvd3MgYSBtb2RlIGluZGljYXRvci4gRXNjIGV4aXRzLlxuICB8IHtraW5kOiAnc2VsZWN0LW1vZGUnOyBvbjogYm9vbGVhbn1cbiAgLy8gRXhwb3J0LXRpbWUgcmVxdWVzdCBmb3IgdGhlIGZ1bGwgc2VyaWFsaXplZCBwYWdlIChvcHQtaW4gcHJlZlxuICAvLyBpbmNsdWRlUGFnZUhUTUwpLiBSZXBsaWVkIHdpdGgge29rLCB1cmwsIHRpdGxlLCBodG1sfTsgbmV2ZXIgcGVyc2lzdGVkXG4gIC8vIHRvIGNocm9tZS5zdG9yYWdlIOKAlCB0aGUgcGF5bG9hZCBnb2VzIHN0cmFpZ2h0IGludG8gdGhlIHRhci5cbiAgfCB7a2luZDogJ3BhZ2UtaHRtbCd9XG4gIHwge2tpbmQ6ICdvdXRsaW5lLW11bHRpJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfVxuICB8IHtraW5kOiAnc2Nyb2xsLXRvJzsgc2VsZWN0b3I6IHN0cmluZzsgc3RpY2t5PzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ3N0aWNreS1jbGVhcid9XG4gIC8vIE9uZS1zaG90IGxvY2F0b3IgYW5pbWF0aW9uOiBzY3JvbGwgaW50byB2aWV3ICsgdGhyZWUgcHVsc2luZyByaW5ncy5cbiAgLy8gRGlzdGluY3QgZnJvbSBgb3V0bGluZWAgKHN1YnRsZSBob3ZlciByaW5nKSBhbmQgYHNjcm9sbC10b2AgKHNpbGVudFxuICAvLyByZWNlbnRlcikgc28gdGhlIHNpZGUgcGFuZWwgTG9jYXRlIGJ1dHRvbiBjYW4gcmVxdWVzdCBzb21ldGhpbmcgdXNlcnNcbiAgLy8gY2FuIGFjdHVhbGx5IGZpbmQgb24gYSBidXN5IHBhZ2UuXG4gIHwge2tpbmQ6ICdsb2NhdGUtZmxhc2gnOyBzZWxlY3Rvcjogc3RyaW5nfVxuICB8IHtraW5kOiAndmFsaWRhdGUnOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnbG9nLWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAncmVjYXB0dXJlJzsgc2VsZWN0b3I6IHN0cmluZzsgbj86IG51bWJlcn1cbiAgfCB7a2luZDogJ2NhcHR1cmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICAvLyBPdXRsaW5lIHRoZSBOdGggYW5jZXN0b3Igb2YgYHNlbGVjdG9yYCB3aXRob3V0IGNhcHR1cmluZyBpdCDigJQgdXNlZCBieVxuICAvLyBob3ZlciBvbiBhbmNlc3RvciBicmVhZGNydW1iIGNoaXBzIGluIHRoZSBzaWRlIHBhbmVsIHNvIHRoZSB1c2VyXG4gIC8vIHByZXZpZXdzIHdoaWNoIGVsZW1lbnQgYSBjaGlwIHJlZmVycyB0byBiZWZvcmUgY2xpY2tpbmcuXG4gIHwge2tpbmQ6ICdvdXRsaW5lLWFuY2VzdG9yJzsgc2VsZWN0b3I6IHN0cmluZzsgZGVwdGg6IG51bWJlcn1cbiAgfCB7a2luZDogJ2FsdC1zdGF0ZSc7IG9uOiBib29sZWFufVxuICB8IHtraW5kOiAnbWFudWFsLWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbic7IHNlbGVjdG9yOiBzdHJpbmc7IHBheWxvYWQ6IEFubm90YXRpb25QYXlsb2FkIHwgbnVsbH1cbiAgfCB7a2luZDogJ2Fubm90YXRpb24tY2xlYXInfVxuICB8IHtraW5kOiAncGVuZGluZy1jYW5jZWwnfVxuICB8IHtraW5kOiAncGVuZGluZy1jb21taXQnfVxuICB8IHtraW5kOiAnY29udGV4dC1jYXB0dXJlJ31cbiAgfCB7a2luZDogJ3NldC1jYXB0dXJlZCc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdzZXQtY3MtcHJlZnMnOyBzcGFjaW5nT3ZlcmxheT86IGJvb2xlYW47IGhvdmVyU25hcD86IGJvb2xlYW59XG4gIC8vIFNjcmVlbnNob3QtdGltZSBvdmVybGF5IHRvZ2dsZXMuIFRoZSBiYWNrZ3JvdW5kIGFza3MgdGhlIGNvbnRlbnQgc2NyaXB0XG4gIC8vIHRvIGhpZGUgaXRzIHNoYWRvdy1yb290IGNocm9tZSAocmluZ3MsIHJ1YmJlci1iYW5kLCBhbm5vdGF0aW9uKSBiZWZvcmVcbiAgLy8gY2FwdHVyZVZpc2libGVUYWIgZmlyZXMsIHRoZW4gcmVzdG9yZXMgdmlzaWJpbGl0eSBvbmNlIHRoZSBQTkcgaXMgYmFjay5cbiAgfCB7a2luZDogJ2hpZGUtb3ZlcmxheXMnfVxuICB8IHtraW5kOiAnc2hvdy1vdmVybGF5cyd9O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uUGF5bG9hZCA9IHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8vIFRoZSBjYXB0dXJlZCBlbnRyeSdzIHN0YWJsZSB1aWQuIFRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0aGlzIHNvXG4gIC8vIGl0cyBvbi1wYWdlIGNvbW1lbnQgYm94IGNhbiByb3V0ZSB0aGUgY29tbWVudCB0byB0aGUgKnNwZWNpZmljKlxuICAvLyBjYXB0dXJlIHJhdGhlciB0aGFuIHRvIFwiYW55IHNlbGVjdG9yIHRoYXQgbWF0Y2hlcy5cIiBQcmV2ZW50c1xuICAvLyBjcm9zcy1jb250YW1pbmF0aW9uIHdoZW4gdHdvIGNhcHR1cmVzIHNoYXJlIGEgc2VsZWN0b3IgYWNyb3NzXG4gIC8vIHBhZ2VzIG9yIHR3byBzaWJsaW5nIGVsZW1lbnRzIHNoYXJlIGEgdGVzdElkLlxuICB1aWQ/OiBzdHJpbmc7XG4gIG4/OiBudW1iZXI7XG4gIGNhcHR1cmVkPzogYm9vbGVhbjtcbiAgZmVlZGJhY2s/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9CZyA9XG4gIHwge2tpbmQ6ICdjYXB0dXJlLXNjcmVlbnNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3N3aXRjaC10by10YWInOyB1cmw6IHN0cmluZzsgb3BlbklmTWlzc2luZz86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdsaXN0LW9wZW4tdGFicyd9XG4gIHwge2tpbmQ6ICdzaG90LWVsZW1lbnQnOyBzZWxlY3Rvcjogc3RyaW5nOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtZ3JvdXAnOyBzZWxlY3RvcnM6IHN0cmluZ1tdOyBuOiBudW1iZXI7IHdvcmtzcGFjZTogc3RyaW5nOyBwYWRkaW5nPzogbnVtYmVyOyB0YWJJZD86IG51bWJlcn1cbiAgfCB7a2luZDogJ3Nob3QtcGFnZSc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHRhYklkPzogbnVtYmVyfVxuICAvLyBGdWxsLXBhZ2UgKGJlc3QtZWZmb3J0KSBzY3JlZW5zaG90IGZvciB0aGUgcGFnZS1zbmFwc2hvdCBmZWF0dXJlLiBVbmxpa2VcbiAgLy8gc2hvdC1wYWdlIHRoaXMgZG9lcyBOT1Qgd3JpdGUgYSBmaWxlIG9yIGJ1aWxkIGEgdGh1bWJuYWlsIOKAlCBpdCBqdXN0XG4gIC8vIHJldHVybnMgdGhlIHN0aXRjaGVkIFBORyBhcyBhIGRhdGEgVVJMIHNvIHRoZSBjYWxsZXIgKGNvbnRlbnQgc2NyaXB0KSBjYW5cbiAgLy8gYXR0YWNoIGl0IHRvIGEgUGFnZVNuYXBzaG90LiBgcGFydGlhbGAgaXMgdHJ1ZSB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0XG4gIC8vIGNvdWxkIGJlIGNhcHR1cmVkLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdC1zaG90JzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIFNpZGUgcGFuZWwgYXNrcyB0aGUgYmFja2dyb3VuZCB0byB3cml0ZSBhIFVURi04IHN0cmluZyAoSlNPTkwsIE1hcmtkb3duLFxuICAvLyBSRUFETUUpIHRvIGRpc2suIGBzdWJkaXJgIGlzIHJlbGF0aXZlIHRvIC5waW5jaGdyYWIvPHdvcmtzcGFjZT4vIOKAlCB3ZVxuICAvLyBkZWZhdWx0IHRvICdleHBvcnRzJyBzbyBKU09OTC9NRCBsaXZlIHNlcGFyYXRlIGZyb20gc2NyZWVuc2hvdHMuXG4gIHwge2tpbmQ6ICdzYXZlLXRleHQnOyB3b3Jrc3BhY2U6IHN0cmluZzsgZmlsZW5hbWU6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBtaW1lOiBzdHJpbmc7IHN1YmRpcj86IHN0cmluZ31cbiAgLy8gU2FtZSBhcyBzYXZlLXRleHQgYnV0IGZvciBiaW5hcnkgYmxvYnMgKHdvcmtzcGFjZSBaSVApLiBjaHJvbWUucnVudGltZVxuICAvLyAuc2VuZE1lc3NhZ2UgdXNlcyBzdHJ1Y3R1cmVkIGNsb25pbmcsIHdoaWNoIHByZXNlcnZlcyBVaW50OEFycmF5LCBzbyB3ZVxuICAvLyBwYXNzIHRoZSB0eXBlZCBhcnJheSBkaXJlY3RseS4gbnVtYmVyW10gaXMgYWNjZXB0ZWQgYXMgYSBmYWxsYmFjayBmb3JcbiAgLy8gb2xkZXIgY2FsbGVycyBhbmQgdGVzdHMgdGhhdCBwcmUtc2VyaWFsaXplLlxuICB8IHtraW5kOiAnc2F2ZS1ieXRlcyc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyBieXRlczogVWludDhBcnJheSB8IG51bWJlcltdOyBtaW1lOiBzdHJpbmc7IHN1YmRpcj86IHN0cmluZ31cbiAgLy8gUGFuZWwgYXNrcyB0aGUgYmFja2dyb3VuZCB0byAocmUpaW5qZWN0IHRoZSBjb250ZW50IHNjcmlwdCDigJQgdGhlIGZpeFxuICAvLyBmb3IgXCJBbHQgc3RvcHBlZCB3b3JraW5nXCIgYWZ0ZXIgYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gY29udGVudCBzY3JpcHQuIERlZmF1bHRzIHRvIHRoZSBhY3RpdmUgdGFiLlxuICB8IHtraW5kOiAncGctcmVpbmplY3QnOyB0YWJJZD86IG51bWJlcn07XG5cbmV4cG9ydCB0eXBlIFNob3RSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAgICAgLy8gd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKGUuZy4gZGVmYXVsdC9zY3JlZW5zaG90cy9mb28ucG5nKVxuICBhYnNQYXRoPzogc3RyaW5nOyAgICAgIC8vIE9TLWFic29sdXRlIHBhdGggZm9yIFwiQ29weSBhcyBwYXRoXCJcbiAgY29weVBhdGg/OiBzdHJpbmc7ICAgICAvLyBVSS1mYWNpbmcgcGF0aDsgYXZvaWRzIFBsYXl3cmlnaHQgdGVtcCBhcnRpZmFjdCBuYW1lc1xuICB0ZW1wUGF0aD86IGJvb2xlYW47ICAgIC8vIHRydWUgd2hlbiBhYnNQYXRoIGlzIGEgYnJvd3Nlci90ZXN0LWhhcm5lc3MgYXJ0aWZhY3QgcGF0aFxuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBkYXRhVXJsPzogc3RyaW5nOyAgICAgIC8vIGRvd25zY2FsZWQgdGh1bWJuYWlsICjiiaQzMjBweCB3aWRlKSBmb3IgdGhlIHNpZGUtcGFuZWwgcHJldmlld1xuICBmdWxsRGF0YVVybD86IHN0cmluZzsgIC8vIGZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCDigJQgdXNlZCBieSB0aGUgd29ya3NwYWNlIGFyY2hpdmUgZXhwb3J0XG4gIGVycm9yPzogc3RyaW5nO1xuICB0cnVuY2F0ZWQ/OiBib29sZWFuO1xuICAvLyBDcm9wIG1ldGFkYXRhLiBMZXRzIHJlY2VpdmVycyBtYXAgYmV0d2VlbiB0aGUgc3RvcmVkIFBORyBhbmRcbiAgLy8gb3JpZ2luYWwgcGFnZSBjb29yZGluYXRlcyBzbyB0aGV5IGNhblxuICAvLyBkcmF3IHRoZWlyIG93biBvdmVybGF5IG9yIHJlcHJvZHVjZSB0aGUgY3JvcCBvbiBhIGZyZXNoIGNhcHR1cmUuXG4gIGNyb3A/OiB7XG4gICAgY3NzUmVjdDoge3g6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgZGV2aWNlUHhSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBpbWFnZVNpemU6IHt3OiBudW1iZXI7IGg6IG51bWJlcn07XG4gICAgZHByOiBudW1iZXI7XG4gICAgcGFkZGluZzogbnVtYmVyO1xuICAgIHNlbGVjdG9yczogc3RyaW5nW107XG4gIH07XG59O1xuXG4vLyBSZXBseSB0byBhIGBwYWdlLXNuYXBzaG90LXNob3RgIHJlcXVlc3QuIGBzY3JlZW5zaG90YCBpcyBhIFBORyBkYXRhIFVSTCBvZlxuLy8gdGhlIChiZXN0LWVmZm9ydCkgZnVsbCBwYWdlOyBgcGFydGlhbGAgaXMgdHJ1ZSB3aGVuIG9ubHkgdGhlIHZpZXdwb3J0IHdhc1xuLy8gY2FwdHVyZWQuIGBvazpmYWxzZWAgY2FycmllcyBhbiBlcnJvciBzdHJpbmcuXG5leHBvcnQgdHlwZSBQYWdlU25hcHNob3RSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIHNjcmVlbnNob3Q/OiBzdHJpbmc7XG4gIHBhcnRpYWw/OiBib29sZWFuO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFNhdmVSZXBseSA9IHtcbiAgb2s6IGJvb2xlYW47XG4gIGZpbGVuYW1lPzogc3RyaW5nOyAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aFxuICBhYnNQYXRoPzogc3RyaW5nOyAgLy8gT1MtYWJzb2x1dGUgcGF0aFxuICBjb3B5UGF0aD86IHN0cmluZzsgLy8gVUktZmFjaW5nIHBhdGhcbiAgdGVtcFBhdGg/OiBib29sZWFuO1xuICBkb3dubG9hZFN0YXRlPzogJ2luX3Byb2dyZXNzJyB8ICdpbnRlcnJ1cHRlZCcgfCAnY29tcGxldGUnO1xuICBlcnJvcj86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEJnUmVwbHkgPVxuICB8IHtkYXRhVXJsOiBzdHJpbmd9XG4gIHwge2ZvdW5kOiBib29sZWFuOyBvcGVuZWQ/OiBudW1iZXJ9XG4gIHwge3RhYnM6IEFycmF5PHtpZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ30+fVxuICB8IHtlcnJvcjogc3RyaW5nfVxuICB8IFNob3RSZXBseVxuICB8IFNhdmVSZXBseVxuICB8IFBhZ2VTbmFwc2hvdFJlcGx5O1xuXG4vLyDilIDilIDilIAgRXhwb3J0IHNoYXBlcyAodjIpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gTWFuaWZlc3QgbGluZSBlbWl0dGVkIGFzIHRoZSB2ZXJ5IGZpcnN0IEpTT05MIGxpbmUuIENhcnJpZXMgdGhlIG1ldGFkYXRhXG4vLyBuZWNlc3NhcnkgdG8gcmVzeW5jIGEgZG93bmxvYWRlZCBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSArIHRvb2xpbmcuXG5leHBvcnQgdHlwZSBFeHBvcnRNYW5pZmVzdCA9IHtcbiAgdjogMjtcbiAgdHlwZTogJ21hbmlmZXN0JztcbiAgdHM6IHN0cmluZzsgICAgICAgLy8gSVNPIG9mIHdoZW4gdGhlIGV4cG9ydCB3YXMgZ2VuZXJhdGVkXG4gIGdlbmVyYXRlZDogbnVtYmVyOyAvLyBlcG9jaCBtcyAobWlycm9yIG9mIHRzIGluIG1hY2hpbmUtcmVhZGFibGUgZm9ybSlcbiAgdG9vbDogJ3BpbmNoZ3JhYic7XG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBmb3JtYXQ6ICdqc29ubCcgfCAnbWFya2Rvd24nIHwgJ3Rhci56c3QnO1xuICAvLyBDb250ZW50LWRlcml2ZWQgaWRlbnRpdHk6IGZpcnN0IDE2IGhleCBjaGFycyBvZiBhIFNIQS0yNTYgb3ZlciB0aGVcbiAgLy8gc2xpbSByb3dzICsgc2NyZWVuc2hvdCBuYW1lcy4gU3RhYmxlIGFjcm9zcyByZS1leHBvcnRzIG9mIHRoZSBzYW1lXG4gIC8vIGNvbnRlbnQsIHNvIGRvd25zdHJlYW0gc3RhdGUgKGUuZy4gfi8ucGluY2hncmFiL3dvcmtzcGFjZXMvKi9idW5kbGVzLylcbiAgLy8ga2V5cyBvbiBpdCB3aXRob3V0IGR1cGxpY2F0aW5nIHdvcmsuXG4gIGJ1bmRsZUlkPzogc3RyaW5nO1xuICBob3N0czogc3RyaW5nW107XG4gIC8vIEFtYmlndW91cyB0b3RhbHMuIFRoZSBwcmV2aW91cyBgc2VsZWN0b3JzIC8gZmVlZGJhY2sgLyBwYWdlc2BcbiAgLy8gdHJpcGxlIGRpZG4ndCBzYXkgd2hldGhlciBuZXN0ZWRcbiAgLy8gZ3JvdXAgbWVtYmVycyB3ZXJlIGNvdW50ZWQsIHdoZXRoZXIgZmVlZGJhY2stYmVhcmluZyBwYXJlbnRzIHdlcmVcbiAgLy8gYSBzdWJzZXQsIG9yIGhvdyBzY3JlZW5zaG90cyB3ZXJlIHRhbGxpZWQuIFRoZSBleHBhbmRlZCBzaGFwZVxuICAvLyBiZWxvdyBuYW1lcyBldmVyeSBjYXRlZ29yeSBleHBsaWNpdGx5IHNvIGEgZG93bnN0cmVhbSBhZ2VudCBjYW5cbiAgLy8gdGVsbCBleGFjdGx5IHdoYXQncyBpbiB0aGUgYnVuZGxlLlxuICBjb3VudHM6IHtcbiAgICAvLyBUb3AtbGV2ZWwgc2VsZWN0b3Igcm93cyBpbiB0aGUgSlNPTkwgc3RyZWFtIChleGNsdWRlcyBuZXN0ZWRcbiAgICAvLyBncm91cCBtZW1iZXJzLCBidXQgdGhlIGBncm91cE1lbWJlcnNgIGZpZWxkIGNvdW50cyB0aG9zZSkuXG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgZmVlZGJhY2s6IG51bWJlcjtcbiAgICBwYWdlczogbnVtYmVyO1xuICAgIC8vIE51bWJlciBvZiBzZWxlY3RvciByb3dzIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmUgZmVlZGJhY2sgY2hpbGQuXG4gICAgLy8gVXNlZnVsIGZvciBcInNob3cgbWUgb25seSB0aGUgaXRlbXMgd2l0aCBjb21tZW50c1wiLlxuICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9ycz86IG51bWJlcjtcbiAgICAvLyBTZWxlY3RvcnMgdGhhdCBzaGlwIHVuZGVyIGEgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGAgYXJyYXlcbiAgICAvLyByYXRoZXIgdGhhbiBhcyB0aGVpciBvd24gdG9wLWxldmVsIHJvdy5cbiAgICBncm91cE1lbWJlcnM/OiBudW1iZXI7XG4gICAgLy8gU2NyZWVuc2hvdCBpbnZlbnRvcnkgKGNvdW50ZWQgYnkgZmlsZSwgZGVkdXBlZCkuXG4gICAgc2NyZWVuc2hvdHNFbGVtZW50PzogbnVtYmVyO1xuICAgIHNjcmVlbnNob3RzR3JvdXA/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNQYWdlPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9yIHJvd3MgdGhhdCBzaG91bGQgaGF2ZSBhbiBlbGVtZW50IHNjcmVlbnNob3QgYnV0IGRvbid0XG4gICAgLy8gKHBvc3QtYnVnLSMyIGZvcmNlZCBzaG9vdCBtYXkgc3RpbGwgZmFpbCkuIFJlcGFpciBhZ2VudHMgY2FuXG4gICAgLy8gc2tpcCB0aGVzZSBvciByZXF1ZXN0IGEgcmUtY2FwdHVyZS5cbiAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdD86IG51bWJlcjtcbiAgICAvLyBGZWVkYmFjayByb3dzIHdob3NlIHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUgdG8gYW55IHNlbGVjdG9yXG4gICAgLy8gaW4gdGhpcyBhcmNoaXZlLiBTaG91bGQgYWx3YXlzIGJlIDA7IG5vbi16ZXJvIG1lYW5zIHRoZSBleHBvcnRcbiAgICAvLyBnb3QgdHJ1bmNhdGVkIG9yIGEgcGFyZW50IHdhcyBkZWxldGVkIGJldHdlZW4gY2FwdHVyZSArIGVtaXQuXG4gICAgb3JwaGFuZWRGZWVkYmFjaz86IG51bWJlcjtcbiAgICAvLyBGdWxsLXBhZ2UgSFRNTCBkb2N1bWVudHMgYnVuZGxlZCB1bmRlciBwYWdlcy8gKG9wdC1pbiBwcmVmKS5cbiAgICBwYWdlc0h0bWw/OiBudW1iZXI7XG4gIH07XG4gIC8vIFJlc29sdXRpb24gcm9vdCBmb3IgZXZlcnkgcGF0aCBmaWVsZCBpbiB0aGUgSlNPTkwgc3RyZWFtLlxuICAvLyAgIOKAoiAnYXJjaGl2ZScgICDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBleHRyYWN0ZWQgYXJjaGl2ZSByb290XG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciB0YXIuenN0IGV4cG9ydHMpLlxuICAvLyAgIOKAoiAnd29ya3NwYWNlJyDigJQgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB3b3Jrc3BhY2UgZGlyIG9uIGRpc2ssXG4gIC8vICAgICAgICAgICAgICAgICAgIGkuZS4gYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2BcbiAgLy8gICAgICAgICAgICAgICAgICAgKHVzZWQgZm9yIHBsYWluIEpTT05MIGV4cG9ydHMpLlxuICAvLyBSZWNlaXZlcnMgcHJlcGVuZCB0aGUgYXBwcm9wcmlhdGUgcm9vdCB0byByZXNvbHZlIGFueSBwYXRoIGZpZWxkLlxuICBwYXRoUm9vdD86ICdhcmNoaXZlJyB8ICd3b3Jrc3BhY2UnO1xuICAvLyBJbmRpcmVjdGlvbiBwb2ludGVyIHRvIHRoZSBVSSBza2lsbCB0aGF0IGtub3dzIGhvdyB0byB0cmlhZ2UgdGhlc2VcbiAgLy8gY2FwdHVyZXMuIFdoZW4gYGlubGluZTogdHJ1ZWAsIHRoZSBza2lsbCBjb250ZW50IGxpdmVzIGF0XG4gIC8vIGBhcmNoaXZlUGF0aGAgaW5zaWRlIHRoZSB0YXIgKGRlZmF1bHQ6IGAuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWRgKS5cbiAgLy9cbiAgLy8gYGN1c3RvbWl6ZWRgIGFuZCBgdGVtcGxhdGVgIGFyZSBtdXR1YWxseS1leGNsdXNpdmUgY29uZmlkZW5jZSBmbGFnczpcbiAgLy8gICDigKIgY3VzdG9taXplZDogdHJ1ZSDihpIgdXNlciB1cGxvYWRlZCAvIHBhc3RlZCB0aGVpciBvd24gY29udGVudC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IHRoZSBmaWxlIGFzIGF1dGhvcml0YXRpdmUuXG4gIC8vICAg4oCiIHRlbXBsYXRlOiB0cnVlICAg4oaSIHVzZXIgaXMgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgZGVmYXVsdC5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIFRyZWF0IGFzIGdlbmVyaWMgYm9pbGVycGxhdGU7IHZlcmlmeSBiZWZvcmVcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIGFwcGx5aW5nLlxuICAvLyAoVGhlIHByZXZpb3VzIGB0ZW1wbGF0ZWAgZmxhZyBhbG9uZSB3YXMgYW1iaWd1b3VzIGJlY2F1c2UgdGhlXG4gIC8vIGJ1bmRsZWQgbG9jYWwgdGVtcGxhdGUgc3RpbGwgbG9va3MgcHJvamVjdC1zcGVjaWZpYy4pXG4gIHNraWxsPzoge25hbWU6IHN0cmluZzsgcGF0aDogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFBvaW50ZXIgdG8gdGhlIHByb2plY3QncyBERVNJR04ubWQuIFNhbWUgcnVsZXM6IGBjdXN0b21pemVkOiB0cnVlYFxuICAvLyBtZWFucyB0aGUgdXNlciBzdXBwbGllZCB0aGlzIGNvbnRlbnQ7IGB0ZW1wbGF0ZTogdHJ1ZWAgbWVhbnMgaXQnc1xuICAvLyBQaW5jaEdyYWIncyBidW5kbGVkIGRlZmF1bHQuXG4gIGRlc2lnbj86IHtwYXRoPzogc3RyaW5nOyBpbmxpbmU/OiBib29sZWFuOyBhcmNoaXZlUGF0aD86IHN0cmluZzsgdGVtcGxhdGU/OiBib29sZWFuOyBjdXN0b21pemVkPzogYm9vbGVhbn07XG4gIC8vIFdoZXJlIHRoZSBhZ2VudCBkb2N0cmluZSBsaXZlcyBpbnNpZGUgdGhlIGFyY2hpdmUgKFNlbmQtdG8tQWdlbnRcbiAgLy8gcHJvdG9jb2wpLiBBYnNlbnQgb24gcGxhaW4gSlNPTkwgZXhwb3J0cy5cbiAgYWdlbnRQcm90b2NvbD86IHthcmNoaXZlUGF0aDogc3RyaW5nfTtcbiAgLy8gVmVuZG9yZWQgc2tpbGwgZG9jdW1lbnRzIGJ1bmRsZWQgaW50byB0aGlzIGFyY2hpdmUgKHN1YnNldCBvZiB0aGVcbiAgLy8gcmljaGVyIHNraWxscy1pbmRleC5qc29uIGF0IHRoZSBhcmNoaXZlIHJvb3QpLiBgaW52b2NhdGlvbmAgY2FycmllcyBhXG4gIC8vIHBsdWdpbi1jb21tYW5kIGZvcm0gZm9yIGhhcm5lc3NlcyB0aGF0IHN1cHBvcnQgaXQuXG4gIGJ1bmRsZWRTa2lsbHM/OiBBcnJheTx7aWQ6IHN0cmluZzsga2luZDogJ3NraWxsJyB8ICdyZWZlcmVuY2UnOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBpbnZvY2F0aW9uPzogc3RyaW5nfT47XG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGRvY3VtZW50cyBidW5kbGVkIHVuZGVyIHBhZ2VzLyAob3B0LWluIHByZWYpLlxuICBwYWdlc0h0bWw/OiBBcnJheTx7dXJsOiBzdHJpbmc7IGFyY2hpdmVQYXRoOiBzdHJpbmc7IGJ5dGVzOiBudW1iZXJ9PjtcbiAgLy8gU2VsZi1yb2FzdCBzZWN0aW9uLiBUaGUgZXhwb3J0IHN1cmZhY2VzIGl0cyBvd24gZ2FwcyBzbyBhXG4gIC8vIGRvd25zdHJlYW0gTExNIGRvZXNuJ3QgaGF2ZSB0byBkaXNjb3ZlclxuICAvLyB0aGVtLiBFbXB0eSBhcnJheSA9IGNsZWFuIGV4cG9ydC4gRWFjaCBkaWFnbm9zdGljIGhhcyBhIHN0YWJsZVxuICAvLyBgY29kZWAgc28gcmVjZWl2ZXJzIGNhbiBkaXNwYXRjaCBvbiBpdCBwcm9ncmFtbWF0aWNhbGx5LlxuICBleHBvcnREaWFnbm9zdGljcz86IEV4cG9ydERpYWdub3N0aWNbXTtcbiAgLy8gQXJjaGl2ZSBpbnRlZ3JpdHkuIFJlY2VpdmVycyBjYW4gZGV0ZWN0IHBhcnRpYWwgZXh0cmFjdGlvbiAvXG4gIC8vIGNvcnJ1cHRpb24gd2l0aCBhIHNpbmdsZSBjaGVjay5cbiAgYXJjaGl2ZUludGVncml0eT86IHtcbiAgICBmaWxlczogQXJyYXk8e3BhdGg6IHN0cmluZzsgc2l6ZTogbnVtYmVyfT47XG4gIH07XG4gIC8vIEJ1aWxkL3NvdXJjZSBpZGVudGl0eS4gQ2FwdHVyZWQgZnJvbSBhXG4gIC8vIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCIgY29udGVudD1cImNvbW1pdDphYmMgYnJhbmNoOm1haW4gZGlydHk6dHJ1ZVwiPmBcbiAgLy8gdGFnIHRoZSB1c2VyJ3MgYXBwIGluamVjdHMsIHBsdXMgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLlxuICAvLyBSZWNlaXZlcnMgY2FuIHRlbGwgaWYgdGhlIGV4cG9ydCBpcyBzdGFsZSByZWxhdGl2ZSB0byB0aGUgcmVwby5cbiAgLy8gT21pdHRlZCBlbnRpcmVseSB3aGVuIG5vIGJ1aWxkIGluZm8gaXMgYXZhaWxhYmxlLlxuICBidWlsZD86IHtcbiAgICBleHRlbnNpb25WZXJzaW9uPzogc3RyaW5nO1xuICAgIGNvbW1pdD86IHN0cmluZztcbiAgICBicmFuY2g/OiBzdHJpbmc7XG4gICAgZGlydHk/OiBib29sZWFuO1xuICAgIGRlcGxveUJ1aWxkPzogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IHR5cGUgRXhwb3J0RGlhZ25vc3RpYyA9IHtcbiAgc2V2ZXJpdHk6ICdlcnJvcicgfCAnd2FybicgfCAnaW5mbyc7XG4gIGNvZGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB1aWQ/OiBzdHJpbmc7XG59O1xuXG4vLyBFbnZlbG9wZSBtYXJrZXIgdXNlZCBvbiBldmVyeSBQaW5jaEdyYWIgbWVzc2FnZSAoc28gb3RoZXIgZXh0ZW5zaW9uXG4vLyBtZXNzYWdlcyB0cmF2ZWxpbmcgdGhyb3VnaCB0aGUgc2FtZSBjaGFubmVsIGFyZSBpZ25vcmVkKS4gX19taWQgaXMgYVxuLy8gcGVyLWRpc3BhdGNoIHVuaXF1ZSBzdGFtcCBzbyByZWNlaXZlcnMgY2FuIGRlZHVwZSBhIG1lc3NhZ2UgdGhhdCBhcnJpdmVzXG4vLyB0aHJvdWdoIG1vcmUgdGhhbiBvbmUgY2hhbm5lbCAoZS5nLiBydW50aW1lLm9uTWVzc2FnZSArIGEgcG9ydCByZWxheSkuXG5leHBvcnQgdHlwZSBQZ0VudmVsb3BlPFQ+ID0gVCAmIHtfX3BnOiB0cnVlOyBfX21pZDogc3RyaW5nfTtcblxuZXhwb3J0IHR5cGUgQW55TWVzc2FnZSA9IENzVG9QYW5lbCB8IFBhbmVsVG9DcyB8IFBhbmVsVG9CZztcblxubGV0IF9taWRDb3VudGVyID0gMDtcbmNvbnN0IG5ld01pZCA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBwcmVmaXggPSBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX0tJHsoKytfbWlkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gIHRyeSB7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7QXJyYXkuZnJvbShieXRlcykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG59O1xuXG4vLyBIZWxwZXI6IHN0YW1wIGEgcGF5bG9hZCB3aXRoIHRoZSBlbnZlbG9wZSBtYXJrZXIgKyB1bmlxdWUgbWVzc2FnZSBpZC5cbmV4cG9ydCBjb25zdCBwZyA9IDxUIGV4dGVuZHMge2tpbmQ6IHN0cmluZ30+KHBheWxvYWQ6IFQpOiBQZ0VudmVsb3BlPFQ+ID0+XG4gICh7X19wZzogdHJ1ZSwgX19taWQ6IG5ld01pZCgpLCAuLi5wYXlsb2FkfSkgYXMgUGdFbnZlbG9wZTxUPjtcbiIsCiAgICAiLy8gU3Vic2V0IG9mIGx1Y2lkZS5kZXYgaWNvbnMgaW5saW5lZCBhcyBTVkcgaW5uZXItbWFya3VwLlxuLy8gRWFjaCBlbnRyeSBpcyB0aGUgYm9keSBvZiA8c3ZnIC4uLiA+IC4uLiA8L3N2Zz47IHN2Z1N0cmluZygpIHdyYXBzIGl0LlxuLy8gU2l6ZXMgZGVmYXVsdCB0byAxNjsgb3ZlcnJpZGUgd2l0aCB0aGUgc2l6ZSBhcmd1bWVudC5cbi8vXG4vLyBNSVQg4oCUIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWNpZGUtaWNvbnMvbHVjaWRlXG5cbmNvbnN0IElDT05TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnY2hldnJvbi1yaWdodCc6ICc8cGF0aCBkPVwibTkgMTggNi02LTYtNlwiLz4nLFxuICAnY2hldnJvbi1kb3duJzogJzxwYXRoIGQ9XCJtNiA5IDYgNiA2LTZcIi8+JyxcbiAgY29weTogJzxyZWN0IHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHg9XCI4XCIgeT1cIjhcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk00IDE2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDJcIi8+JyxcbiAgcGVuY2lsOiAnPHBhdGggZD1cIk0yMS4xNzQgNi44MTJhMSAxIDAgMCAwLTMuOTg2LTMuOTg3TDMuODQyIDE2LjE3NGEyIDIgMCAwIDAtLjUuODNsLTEuMzIxIDQuMzUyYS41LjUgMCAwIDAgLjYyMy42MjJsNC4zNTMtMS4zMmEyIDIgMCAwIDAgLjgzLS40OTd6XCIvPjxwYXRoIGQ9XCJtMTUgNSA0IDRcIi8+JyxcbiAgJ3RyYXNoLTInOiAnPHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YzAgMS0xIDItMiAySDdjLTEgMC0yLTEtMi0yVjZcIi8+PHBhdGggZD1cIk04IDZWNGMwLTEgMS0yIDItMmg0YzEgMCAyIDEgMiAydjJcIi8+PGxpbmUgeDE9XCIxMFwiIHgyPVwiMTBcIiB5MT1cIjExXCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjE0XCIgeDI9XCIxNFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPicsXG4gIHBsdXM6ICc8cGF0aCBkPVwiTTUgMTJoMTRcIi8+PHBhdGggZD1cIk0xMiA1djE0XCIvPicsXG4gIHg6ICc8cGF0aCBkPVwiTTE4IDYgNiAxOFwiLz48cGF0aCBkPVwibTYgNiAxMiAxMlwiLz4nLFxuICBtaW51czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz4nLFxuICBzZWFyY2g6ICc8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjhcIi8+PHBhdGggZD1cIm0yMSAyMS00LjMtNC4zXCIvPicsXG4gIGRvd25sb2FkOiAnPHBhdGggZD1cIk0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00XCIvPjxwb2x5bGluZSBwb2ludHM9XCI3IDEwIDEyIDE1IDE3IDEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIxNVwiIHkyPVwiM1wiLz4nLFxuICB1cGxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE3IDggMTIgMyA3IDhcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjNcIiB5Mj1cIjE1XCIvPicsXG4gIGdpdGh1YjogJzxwYXRoIGQ9XCJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNCA1LjQgMCAwIDAgNCA5YzAgMy41IDMgNS41IDYgNS41LS4zOS40OS0uNjggMS4wNS0uODUgMS42NS0uMTcuNi0uMjIgMS4yMy0uMTUgMS44NXY0XCIvPjxwYXRoIGQ9XCJNOSAxOGMtNC41MSAyLTUtMi03LTJcIi8+JyxcbiAgc3RhcjogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIi8+JyxcbiAgJ2NpcmNsZS1kb3QnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIGNyb3NzaGFpcjogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIyMlwiIHgyPVwiMThcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjZcIiB4Mj1cIjJcIiB5MT1cIjEyXCIgeTI9XCIxMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiNlwiIHkyPVwiMlwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiMjJcIiB5Mj1cIjE4XCIvPicsXG4gIHRhcmdldDogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI2XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMlwiLz4nLFxuICAncGFuZWwtbGVmdC1jbG9zZSc6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIvPjxwYXRoIGQ9XCJNOSAzdjE4XCIvPjxwYXRoIGQ9XCJtMTYgMTUtMy0zIDMtM1wiLz4nLFxuICAnZXh0ZXJuYWwtbGluayc6ICc8cGF0aCBkPVwiTTE1IDNoNnY2XCIvPjxwYXRoIGQ9XCJNMTAgMTQgMjEgM1wiLz48cGF0aCBkPVwiTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDZcIi8+JyxcbiAgJ21lc3NhZ2Utc3F1YXJlLXBsdXMnOiAnPHBhdGggZD1cIk0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnpcIi8+PGxpbmUgeDE9XCI5XCIgeDI9XCIxNVwiIHkxPVwiMTBcIiB5Mj1cIjEwXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI3XCIgeTI9XCIxM1wiLz4nLFxuICAnYWxlcnQtY2lyY2xlJzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjhcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyLjAxXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgJ3JlZnJlc2gtY3cnOiAnPHBhdGggZD1cIk0zIDEyYTkgOSAwIDAgMSAxNS02LjdMMjEgOFwiLz48cGF0aCBkPVwiTTIxIDN2NWgtNVwiLz48cGF0aCBkPVwiTTIxIDEyYTkgOSAwIDAgMS0xNSA2LjdMMyAxNlwiLz48cGF0aCBkPVwiTTMgMjF2LTVoNVwiLz4nLFxuICAnZmlsZS10ZXh0JzogJzxwYXRoIGQ9XCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41elwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTQgMiAxNCA4IDIwIDhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTNcIiB5Mj1cIjEzXCIvPjxsaW5lIHgxPVwiMTZcIiB4Mj1cIjhcIiB5MT1cIjE3XCIgeTI9XCIxN1wiLz48bGluZSB4MT1cIjEwXCIgeDI9XCI4XCIgeTE9XCI5XCIgeTI9XCI5XCIvPicsXG4gICdmaWxlLWNvZGUnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48cGF0aCBkPVwibTEwIDEzLTIgMiAyIDJcIi8+PHBhdGggZD1cIm0xNCAxNyAyLTItMi0yXCIvPicsXG4gIGltYWdlOiAnPHJlY3Qgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgeD1cIjNcIiB5PVwiM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiOVwiIHI9XCIyXCIvPjxwYXRoIGQ9XCJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMVwiLz4nLFxuICAvLyBTdHlsaXNlZCBcInBpbmNoXCIg4oCUIHR3byBvcHBvc2luZyBjdXJ2ZXMgbWVldGluZyBhdCBhIGNlbnRlciBkb3QuXG4gIHBpbmNoOiAnPHBhdGggZD1cIk01IDVjMyAyIDUgNCA3IDctMiAzLTQgNS03IDdcIi8+PHBhdGggZD1cIk0xOSA1Yy0zIDItNSA0LTcgNyAyIDMgNCA1IDcgN1wiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEuNVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgJ3N0YXItZmlsbGVkJzogJzxwb2x5Z29uIHBvaW50cz1cIjEyIDIgMTUuMDkgOC4yNiAyMiA5LjI3IDE3IDE0LjE0IDE4LjE4IDIxLjAyIDEyIDE3Ljc3IDUuODIgMjEuMDIgNyAxNC4xNCAyIDkuMjcgOC45MSA4LjI2IDEyIDJcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicsXG4gIHBpbjogJzxwYXRoIGQ9XCJNMTIgMTd2NVwiLz48cGF0aCBkPVwiTTkgMTAuNzZhMiAyIDAgMCAxLTEuMTEgMS43OWwtMS43OC45QTIgMiAwIDAgMCA1IDE1LjI0VjE2YTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtLjc2YTIgMiAwIDAgMC0xLjExLTEuNzlsLTEuNzgtLjlBMiAyIDAgMCAxIDE1IDEwLjc2VjdhMSAxIDAgMCAxIDEtMSAyIDIgMCAwIDAgMC00SDhhMiAyIDAgMCAwIDAgNCAxIDEgMCAwIDEgMSAxelwiLz4nLFxuICB1bmRvOiAnPHBhdGggZD1cIk0zIDd2Nmg2XCIvPjxwYXRoIGQ9XCJNMjEgMTdhOSA5IDAgMCAwLTE1LTYuN0wzIDEzXCIvPicsXG4gIHJlZG86ICc8cGF0aCBkPVwiTTIxIDd2NmgtNlwiLz48cGF0aCBkPVwiTTMgMTdhOSA5IDAgMCAxIDE1LTYuN0wyMSAxM1wiLz4nLFxuICBmb2xkZXI6ICc8cGF0aCBkPVwiTTIwIDIwYTIgMiAwIDAgMCAyLTJWOGEyIDIgMCAwIDAtMi0yaC03LjkzYTIgMiAwIDAgMS0xLjY2LS45bC0uODItMS4yQTIgMiAwIDAgMCA3LjkzIDNINGEyIDIgMCAwIDAtMiAydjEzYTIgMiAwIDAgMCAyIDJaXCIvPicsXG4gIGNoZWNrOiAnPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIvPicsXG4gICdjaXJjbGUtY2hlY2snOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiLz4nLFxuICBncmlwOiAnPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjVcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjEyXCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjlcIiBjeT1cIjE5XCIgcj1cIjFcIi8+PGNpcmNsZSBjeD1cIjE1XCIgY3k9XCIxOVwiIHI9XCIxXCIvPicsXG4gIC8vIEJyb2tlbi1jaGFpbiBpY29uIGZvciBcImRldGFjaCBjb21tZW50IGZyb20gaXRzIGNhcHR1cmVcIi4gTHVjaWRlJ3MgYHVubGlua2AuXG4gIHVubGluazogJzxwYXRoIGQ9XCJtMTguODQgMTIuMjUgMS43Mi0xLjcxaC0uMDJhNS4wMDQgNS4wMDQgMCAwIDAtLjEyLTcuMDcgNS4wMDYgNS4wMDYgMCAwIDAtNi45NSAwbC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIm01LjE3IDExLjc1LTEuNzEgMS43MWE1LjAwNCA1LjAwNCAwIDAgMCAuMTIgNy4wNyA1LjAwNiA1LjAwNiAwIDAgMCA2Ljk1IDBsMS43MS0xLjcxXCIvPjxsaW5lIHgxPVwiOFwiIHgyPVwiOFwiIHkxPVwiMlwiIHkyPVwiNVwiLz48bGluZSB4MT1cIjJcIiB4Mj1cIjVcIiB5MT1cIjhcIiB5Mj1cIjhcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiMTZcIiB5MT1cIjE5XCIgeTI9XCIyMlwiLz48bGluZSB4MT1cIjE5XCIgeDI9XCIyMlwiIHkxPVwiMTZcIiB5Mj1cIjE2XCIvPicsXG4gIHNldHRpbmdzOiAnPHBhdGggZD1cIk0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIvPicsXG4gIGluZm86ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJNMTIgMTZ2LTRcIi8+PHBhdGggZD1cIk0xMiA4aC4wMVwiLz4nLFxuICAvLyBUcmVlLW9mLXJvd3Mg4oCUIHVzZWQgZm9yIFwiU3BsaXQgZ3JvdXBcIiBhY3Rpb24gKGRlbm90ZXMgb25lIG5vZGUgZmFubmluZ1xuICAvLyBvdXQgaW50byBzaWJsaW5ncykuIEx1Y2lkZSdzIGBsaXN0LXRyZWVgLlxuICAnbGlzdC10cmVlJzogJzxwYXRoIGQ9XCJNMjEgMTJoLThcIi8+PHBhdGggZD1cIk0yMSA2SDhcIi8+PHBhdGggZD1cIk0yMSAxOGgtOFwiLz48cGF0aCBkPVwiTTMgNnY0YzAgMS4xLjkgMiAyIDJoM1wiLz48cGF0aCBkPVwiTTMgMTB2NmMwIDEuMS45IDIgMiAyaDNcIi8+JyxcbiAgLy8gR2VuZXJpYyBzcGxpdCBpY29uIGFzIGEgZmFsbGJhY2sgb3B0aW9uLlxuICBzcGxpdDogJzxwYXRoIGQ9XCJNMTYgM2g1djVcIi8+PHBhdGggZD1cIk04IDNIM3Y1XCIvPjxwYXRoIGQ9XCJtMjEgMy03LjQ2IDcuNDZhMiAyIDAgMCAwIDAgMi44M0wyMSAyMVwiLz48cGF0aCBkPVwiTTMgM2w3LjQ2IDcuNDZhMiAyIDAgMCAxIDAgMi44M0wzIDIxXCIvPicsXG4gIC8vIENhcmRib2FyZC1zdHlsZSBib3ggdXNlZCBmb3IgXCJFeHBvcnQgd29ya3NwYWNlIGFzIFpJUFwiLlxuICBwYWNrYWdlOiAnPHBhdGggZD1cIm03LjUgNC4yNyA5IDUuMTVcIi8+PHBhdGggZD1cIk0yMSA4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAwbC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00QTIgMiAwIDAgMCAyMSAxNlpcIi8+PHBhdGggZD1cIk0zLjMgNyAxMiAxMmw4LjctNVwiLz48cGF0aCBkPVwiTTEyIDIyVjEyXCIvPicsXG4gIC8vIFR3byBpbnRlcmxvY2tpbmcgbGlua3Mg4oCUIHVzZWQgZm9yIFwiQ29weSBhcyBwYXRoXCIuXG4gIGxpbms6ICc8cGF0aCBkPVwiTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzFcIi8+PHBhdGggZD1cIk0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MVwiLz4nLFxuICAvLyBEYXRhYmFzZS9kdWNrIGljb24gZm9yIHRoZSBEdWNrREIgcGFsZXR0ZSBjb21tYW5kLlxuICBkYXRhYmFzZTogJzxlbGxpcHNlIGN4PVwiMTJcIiBjeT1cIjVcIiByeD1cIjlcIiByeT1cIjNcIi8+PHBhdGggZD1cIk0zIDVWMTlBOSAzIDAgMCAwIDIxIDE5VjVcIi8+PHBhdGggZD1cIk0zIDEyQTkgMyAwIDAgMCAyMSAxMlwiLz4nLFxufTtcblxuY29uc3Qgd3JhcCA9IChib2R5OiBzdHJpbmcsIHNpemU6IG51bWJlcik6IHN0cmluZyA9PlxuICBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj4ke2JvZHl9PC9zdmc+YDtcblxuZXhwb3J0IGNvbnN0IFBHX0lDT05TID0ge1xuICBoYXM6IChuYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IG5hbWUgaW4gSUNPTlMsXG4gIHN2Z1N0cmluZzogKG5hbWU6IHN0cmluZywgc2l6ZSA9IDE2KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBib2R5ID0gSUNPTlNbbmFtZV07XG4gICAgaWYgKCFib2R5KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tsdWNpZGVdIG1pc3NpbmcgaWNvbicsIG5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChib2R5LCBzaXplKTtcbiAgfSxcbiAgbW91bnQ6IChlbDogRWxlbWVudCB8IG51bGwsIG5hbWU6IHN0cmluZywgc2l6ZT86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChlbCkgZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKG5hbWUsIHNpemUpO1xuICB9LFxufTtcblxuLy8gU2lkZS1lZmZlY3QgZm9yIGxlZ2FjeSBzY3JpcHQtdGFnIGluY2x1c2lvbiAoc2lkZXBhbmVsLmh0bWwgc3RpbGwgPHNjcmlwdFxuLy8gc3JjPVwibHVjaWRlLmpzXCI+IOKAlCBwcmUtYnVuZGxlKS4gUmUtZXhwb3NlcyB0aGUgcmVnaXN0cnkgb24gZ2xvYmFsVGhpcy5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5QR19JQ09OUyA9IFBHX0lDT05TO1xufVxuIiwKICAgICIvLyBVU1RBUi1mb3JtYXQgdGFyIGVuY29kZXIuIEVhY2ggZW50cnkgaXMgYSA1MTItYnl0ZSBoZWFkZXIgZm9sbG93ZWQgYnlcbi8vIGNvbnRlbnQgYnl0ZXMgcGFkZGVkIHVwIHRvIHRoZSBuZXh0IDUxMi1ieXRlIGJvdW5kYXJ5LiBUaGUgYXJjaGl2ZSBlbmRzXG4vLyB3aXRoIHR3byB6ZXJvLWZpbGxlZCA1MTItYnl0ZSBibG9ja3MuIH44MCBsaW5lcywgbm8gZGVwZW5kZW5jaWVzLlxuLy9cbi8vIFdlIHBpY2sgdGFyIChyYXRoZXIgdGhhbiB6aXApIGJlY2F1c2UgenN0ZCBpcyB0aGUgd2lyZSBmb3JtYXQgd2Ugd2FudCB0b1xuLy8gcGFpciBpdCB3aXRoIGFuZCB0YXIuenN0IGlzIHRoZSBzdGFuZGFyZCBjb21ibyAoemlwIGlzIGl0cyBvd25cbi8vIGNvbXByZXNzaW9uIGNvbnRhaW5lcikuIFBhdGhzIGxvbmdlciB0aGFuIDEwMCBjaGFycyB1c2UgdGhlIHN0YW5kYXJkXG4vLyB1c3RhciBwcmVmaXggZmllbGQgKDE1NSBieXRlcyBhdCBvZmZzZXQgMzQ1KTogdGhlIHBhdGggaXMgc3BsaXQgYXQgYVxuLy8gc2xhc2ggaW50byBwcmVmaXgo4omkMTU1KS9uYW1lKOKJpDEwMCkuIE9ubHkgdW5zcGxpdHRhYmxlIHBhdGhzIHRocm93IOKAlFxuLy8gR05VL1BBWCBsb25nLW5hbWUgZXh0ZW5zaW9ucyBhcmUgZGVsaWJlcmF0ZWx5IG5vdCBpbXBsZW1lbnRlZC5cblxuY29uc3QgZW5jID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbmNvbnN0IHdyaXRlT2N0YWwgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgLy8gdGFyIGZpZWxkcyBhcmUgemVyby1wYWRkZWQgbnVsbC10ZXJtaW5hdGVkIG9jdGFsIHN0cmluZ3MuXG4gIGxldCBzID0gdmFsdWUudG9TdHJpbmcoOCk7XG4gIHMgPSBzLnBhZFN0YXJ0KGxlbmd0aCAtIDEsICcwJyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIC0gMTsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBzLmNoYXJDb2RlQXQoaSk7XG4gIGJ1ZltvZmZzZXQgKyBsZW5ndGggLSAxXSA9IDA7XG59O1xuXG5jb25zdCB3cml0ZUFzY2lpID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIHN0cjogc3RyaW5nLCBsZW5ndGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICBjb25zdCBieXRlcyA9IGVuYy5lbmNvZGUoc3RyKTtcbiAgY29uc3QgbGVuID0gTWF0aC5taW4oYnl0ZXMubGVuZ3RoLCBsZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXSE7XG59O1xuXG5jb25zdCBoZWFkZXJDaGVja3N1bSA9IChoZWFkZXI6IFVpbnQ4QXJyYXkpOiBudW1iZXIgPT4ge1xuICAvLyBUaGUgY2hlY2tzdW0gZmllbGQgKDggYnl0ZXMgYXQgb2Zmc2V0IDE0OCkgaXMgdHJlYXRlZCBhcyBBU0NJSSBzcGFjZXNcbiAgLy8gZHVyaW5nIGNvbXB1dGF0aW9uLCB0aGVuIHRoZSBhY3R1YWwgY2hlY2tzdW0gaXMgd3JpdHRlbiBpbnRvIGl0LlxuICBsZXQgc3VtID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MTI7IGkrKykge1xuICAgIGlmIChpID49IDE0OCAmJiBpIDwgMTU2KSBzdW0gKz0gMHgyMDtcbiAgICBlbHNlIHN1bSArPSBoZWFkZXJbaV0gPz8gMDtcbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuZXhwb3J0IHR5cGUgVGFyRW50cnkgPSB7XG4gIG5hbWU6IHN0cmluZztcbiAgZGF0YTogVWludDhBcnJheSB8IHN0cmluZztcbiAgbXRpbWU/OiBudW1iZXI7IC8vIHVuaXggZXBvY2ggc2Vjb25kczsgZGVmYXVsdHMgdG8gbm93XG59O1xuXG4vLyB1c3RhciBuYW1lIHNwbGl0OiBwYXRocyDiiaQxMDAgY2hhcnMgZ28gc3RyYWlnaHQgaW50byB0aGUgbmFtZSBmaWVsZDtcbi8vIGxvbmdlciBwYXRocyBzcGxpdCBhdCB0aGUgcmlnaHRtb3N0IHNsYXNoIHRoYXQgbGVhdmVzIHByZWZpeCDiiaQxNTUgYW5kXG4vLyB0YWlsIOKJpDEwMC4gVGhlIHJlYWRlciByZWFzc2VtYmxlcyBgcHJlZml4ICsgJy8nICsgbmFtZWAuXG5jb25zdCBzcGxpdFRhck5hbWUgPSAoZnVsbDogc3RyaW5nKToge25hbWU6IHN0cmluZzsgcHJlZml4OiBzdHJpbmd9ID0+IHtcbiAgaWYgKGZ1bGwubGVuZ3RoIDw9IDEwMCkgcmV0dXJuIHtuYW1lOiBmdWxsLCBwcmVmaXg6ICcnfTtcbiAgbGV0IGN1dCA9IC0xO1xuICBmb3IgKGxldCBpID0gZnVsbC5pbmRleE9mKCcvJyk7IGkgIT09IC0xOyBpID0gZnVsbC5pbmRleE9mKCcvJywgaSArIDEpKSB7XG4gICAgaWYgKGkgPD0gMTU1ICYmIGZ1bGwubGVuZ3RoIC0gaSAtIDEgPD0gMTAwKSBjdXQgPSBpO1xuICB9XG4gIGlmIChjdXQgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGB0YXI6IHBhdGggbm90IHNwbGl0dGFibGUgaW50byB1c3RhciBwcmVmaXgoMTU1KS9uYW1lKDEwMCk6ICR7ZnVsbH1gKTtcbiAgfVxuICByZXR1cm4ge3ByZWZpeDogZnVsbC5zbGljZSgwLCBjdXQpLCBuYW1lOiBmdWxsLnNsaWNlKGN1dCArIDEpfTtcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZFRhciA9IChlbnRyaWVzOiBUYXJFbnRyeVtdKTogVWludDhBcnJheSA9PiB7XG4gIGNvbnN0IGJsb2NrczogVWludDhBcnJheVtdID0gW107XG4gIGNvbnN0IG5vd1NlYyA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCBkYXRhID0gdHlwZW9mIGVudHJ5LmRhdGEgPT09ICdzdHJpbmcnID8gZW5jLmVuY29kZShlbnRyeS5kYXRhKSA6IGVudHJ5LmRhdGE7XG4gICAgY29uc3Qge25hbWUsIHByZWZpeH0gPSBzcGxpdFRhck5hbWUoZW50cnkubmFtZSk7XG4gICAgY29uc3QgaGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoNTEyKTtcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMCwgbmFtZSwgMTAwKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTAwLCAwbzY0NCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1vZGVcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTA4LCAwLCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVpZFxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMTYsIDAsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2lkXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEyNCwgZGF0YS5sZW5ndGgsIDEyKTsgICAgICAgICAgICAgICAgICAvLyBzaXplXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDEzNiwgZW50cnkubXRpbWUgPz8gbm93U2VjLCAxMik7ICAgICAgICAvLyBtdGltZVxuICAgIGZvciAobGV0IGkgPSAxNDg7IGkgPCAxNTY7IGkrKykgaGVhZGVyW2ldID0gMHgyMDsgICAgICAgICAgLy8gY2hlY2tzdW0gcGxhY2Vob2xkZXJcbiAgICBoZWFkZXJbMTU2XSA9IDB4MzA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHR5cGVmbGFnICcwJyA9IHJlZ3VsYXIgZmlsZVxuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAyNTcsICd1c3RhcicsIDYpOyAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICB3cml0ZUFzY2lpKGhlYWRlciwgMjYzLCAnMDAnLCAyKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZlcnNpb25cbiAgICBpZiAocHJlZml4KSB3cml0ZUFzY2lpKGhlYWRlciwgMzQ1LCBwcmVmaXgsIDE1NSk7ICAgICAgICAgIC8vIHVzdGFyIHByZWZpeFxuICAgIC8vIHVuYW1lL2duYW1lL2Rldm1ham9yL2Rldm1pbm9yIGxlZnQgemVyby5cblxuICAgIGNvbnN0IGNoZWNrc3VtID0gaGVhZGVyQ2hlY2tzdW0oaGVhZGVyKTtcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTQ4LCBjaGVja3N1bSwgOCk7XG5cbiAgICBibG9ja3MucHVzaChoZWFkZXIpO1xuICAgIGJsb2Nrcy5wdXNoKGRhdGEpO1xuICAgIGNvbnN0IHBhZCA9ICg1MTIgLSAoZGF0YS5sZW5ndGggJSA1MTIpKSAlIDUxMjtcbiAgICBpZiAocGFkKSBibG9ja3MucHVzaChuZXcgVWludDhBcnJheShwYWQpKTtcbiAgfVxuICAvLyBUcmFpbGVyOiB0d28gY29uc2VjdXRpdmUgNTEyLWJ5dGUgemVybyBibG9ja3MuXG4gIGJsb2Nrcy5wdXNoKG5ldyBVaW50OEFycmF5KDEwMjQpKTtcblxuICBsZXQgdG90YWwgPSAwO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgeyBvdXQuc2V0KGIsIG9mZnNldCk7IG9mZnNldCArPSBiLmxlbmd0aDsgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8g4pSA4pSA4pSAIFpzdGQgcmF3LWJsb2NrIGZyYW1lIHdyaXRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vXG4vLyBDb21wcmVzc2lvblN0cmVhbSgnenN0ZCcpIGlzbid0IHNoaXBwZWQgaW4gY3VycmVudCBDaHJvbWl1bSAodmVyaWZpZWQgdmlhXG4vLyBydW50aW1lIHByb2JlKSwgc28gd2Ugd3JpdGUgYSB2YWxpZCB6c3RkIGZyYW1lIGNvbnRhaW5pbmcgb25lIG9yIG1vcmVcbi8vIHJhdyAodW5jb21wcmVzc2VkKSBibG9ja3MuIFRoZSBvdXRwdXQgaXMgc3RydWN0dXJhbGx5IGEgcmVhbCBgLnRhci56c3RgXG4vLyBmaWxlOiBgenN0ZCAtZGAgYWNjZXB0cyBpdCwgNy1aaXAgYWNjZXB0cyBpdCwgbGlienN0ZCBhY2NlcHRzIGl0LiBJdFxuLy8ganVzdCBkb2Vzbid0IGFjdHVhbGx5IGNvbXByZXNzIOKAlCBmb3Igb3VyIHBheWxvYWQsIHdoaWNoIGlzIG1vc3RseSBQTkdcbi8vIChhbHJlYWR5IGNvbXByZXNzZWQpIHBsdXMgYSBmZXcgS0Igb2YgSlNPTkwvTWFya2Rvd24sIHRoZSBsb3NzIHZzLiByZWFsXG4vLyBERUZMQVRFIGlzIHNpbmdsZS1kaWdpdCBwZXJjZW50LlxuLy9cbi8vIEZyYW1lIGxheW91dCAocGVyIFJGQyA4ODc4ICsgWnN0YW5kYXJkIGZvcm1hdCBzcGVjKTpcbi8vICAgbWFnaWNfbnVtYmVyICAgICAgIDQgYnl0ZXMgIDB4MjggMHhCNSAweDJGIDB4RkQgKExFOiAweEZEMkZCNTI4KVxuLy8gICBGSEQgICAgICAgICAgICAgICAgMSBieXRlICAgRkNTX3NpemU9MiAoNC1ieXRlIEZDUyksIFNpbmdsZV9TZWdtZW50PTFcbi8vICAgRkNTICAgICAgICAgICAgICAgIDQgYnl0ZXMgIHVuY29tcHJlc3NlZCBwYXlsb2FkIHNpemUgKHUzMiBMRSlcbi8vICAgYmxvY2tzICAgICAgICAgICAgIE4gYmxvY2tzIGVhY2g6IDMtYnl0ZSBoZWFkZXIgKyBwYXlsb2FkXG4vL1xuLy8gQmxvY2sgaGVhZGVyICgzIGJ5dGVzIExFKTpcbi8vICAgYml0IDAgICAgICAgTGFzdF9CbG9jayBmbGFnXG4vLyAgIGJpdHMgMS4uMiAgIEJsb2NrX1R5cGUgKDAwID0gUmF3LCAwMSA9IFJMRSwgMTAgPSBDb21wcmVzc2VkLCAxMSA9IFJlc2VydmVkKVxuLy8gICBiaXRzIDMuLjIzICBCbG9ja19TaXplIChtYXggMTI4IEtpQiBmb3IgcmF3IC8gUkxFKVxuLy9cbi8vIFdlIGNodW5rIGludG8gMTI4IEtpQiByYXcgYmxvY2tzIHRvIHJlc3BlY3QgdGhlIHBlci1ibG9jayBzaXplIGxpbWl0LlxuXG5jb25zdCBaU1REX1JBV19CTE9DS19NQVggPSAxMjggKiAxMDI0O1xuXG5leHBvcnQgY29uc3Qgd3JhcFpzdGQgPSAoZGF0YTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBjb25zdCBibG9ja3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICBsZXQgcG9zID0gMDtcbiAgd2hpbGUgKHBvcyA8IGRhdGEubGVuZ3RoIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc3QgcmVtYWluaW5nID0gZGF0YS5sZW5ndGggLSBwb3M7XG4gICAgY29uc3QgYmxvY2tTaXplID0gTWF0aC5taW4ocmVtYWluaW5nLCBaU1REX1JBV19CTE9DS19NQVgpO1xuICAgIGNvbnN0IGlzTGFzdCA9IHBvcyArIGJsb2NrU2l6ZSA+PSBkYXRhLmxlbmd0aCA/IDEgOiAwO1xuICAgIGNvbnN0IGhlYWRlckludCA9IGlzTGFzdCB8ICgwIDw8IDEpIHwgKGJsb2NrU2l6ZSA8PCAzKTsgLy8gdHlwZT1yYXc9MFxuICAgIGNvbnN0IGJsb2NrSGVhZGVyID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgaGVhZGVySW50ICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDgpICYgMHhmZixcbiAgICAgIChoZWFkZXJJbnQgPj4+IDE2KSAmIDB4ZmYsXG4gICAgXSk7XG4gICAgYmxvY2tzLnB1c2goYmxvY2tIZWFkZXIpO1xuICAgIGlmIChibG9ja1NpemUgPiAwKSBibG9ja3MucHVzaChkYXRhLnN1YmFycmF5KHBvcywgcG9zICsgYmxvY2tTaXplKSk7XG4gICAgcG9zICs9IGJsb2NrU2l6ZTtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIGJyZWFrO1xuICB9XG4gIGNvbnN0IGZjcyA9IGRhdGEubGVuZ3RoO1xuICBjb25zdCBmaGQgPSAwYjEwMTBfMDAwMDsgLy8gRkNTX3NpemU9MTAgKDQgYnl0ZXMpIHwgU2luZ2xlX1NlZ21lbnQ9MVxuICBjb25zdCBoZWFkID0gbmV3IFVpbnQ4QXJyYXkoW1xuICAgIDB4MjgsIDB4YjUsIDB4MmYsIDB4ZmQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFnaWNcbiAgICBmaGQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZIRFxuICAgIGZjcyAmIDB4ZmYsIChmY3MgPj4+IDgpICYgMHhmZiwgKGZjcyA+Pj4gMTYpICYgMHhmZiwgKGZjcyA+Pj4gMjQpICYgMHhmZixcbiAgXSk7XG4gIGxldCB0b3RhbCA9IGhlYWQubGVuZ3RoO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB0b3RhbCArPSBiLmxlbmd0aDtcbiAgY29uc3Qgb3V0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWwpO1xuICBsZXQgb2ZmID0gMDtcbiAgb3V0LnNldChoZWFkLCBvZmYpOyBvZmYgKz0gaGVhZC5sZW5ndGg7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHsgb3V0LnNldChiLCBvZmYpOyBvZmYgKz0gYi5sZW5ndGg7IH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIENvbXBhbmlvbiBkZWNvZGVyIGZvciBvdXIgb3duIHdyaXRlciDigJQgdXNlZCBieSB0ZXN0cy4gQWNjZXB0cyBhbnkgenN0ZFxuLy8gZnJhbWUgd3JpdHRlbiBieSBgd3JhcFpzdGRgIChzaW5nbGUgUmF3X0Jsb2NrIHN0cmVhbSwgNC1ieXRlIEZDUyxcbi8vIHNpbmdsZS1zZWdtZW50LCBubyBjaGVja3N1bSwgbm8gZGljdCkuIFRocm93cyBvbiBhbnl0aGluZyBlbHNlIHNvIHRlc3RzXG4vLyBmYWlsIGxvdWRseSByYXRoZXIgdGhhbiBzaWxlbnRseSBtaXMtcGFyc2UuXG5leHBvcnQgY29uc3QgdW53cmFwWnN0ZCA9IChmcmFtZTogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBpZiAoZnJhbWUubGVuZ3RoIDwgOSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBmcmFtZSB0b28gc2hvcnQnKTtcbiAgaWYgKGZyYW1lWzBdICE9PSAweDI4IHx8IGZyYW1lWzFdICE9PSAweGI1IHx8IGZyYW1lWzJdICE9PSAweDJmIHx8IGZyYW1lWzNdICE9PSAweGZkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBiYWQgbWFnaWMgbnVtYmVyJyk7XG4gIH1cbiAgY29uc3QgZmhkID0gZnJhbWVbNF0hO1xuICBjb25zdCBmY3NTaXplRmxhZyA9IChmaGQgPj4+IDYpICYgMGIxMTtcbiAgY29uc3Qgc2luZ2xlU2VnbWVudCA9ICgoZmhkID4+PiA1KSAmIDEpID09PSAxO1xuICBjb25zdCBjaGVja3N1bSA9ICgoZmhkID4+PiAyKSAmIDEpID09PSAxO1xuICBjb25zdCBkaWN0SWQgPSBmaGQgJiAwYjExO1xuICBpZiAoIXNpbmdsZVNlZ21lbnQpIHRocm93IG5ldyBFcnJvcignenN0ZDogb25seSBTaW5nbGVfU2VnbWVudCBmcmFtZXMgc3VwcG9ydGVkJyk7XG4gIGlmIChjaGVja3N1bSkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBjb250ZW50IGNoZWNrc3VtIG5vdCBzdXBwb3J0ZWQnKTtcbiAgaWYgKGRpY3RJZCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBkaWN0aW9uYXJpZXMgbm90IHN1cHBvcnRlZCcpO1xuICBsZXQgcG9zID0gNTtcbiAgbGV0IGZjcyA9IDA7XG4gIGlmIChmY3NTaXplRmxhZyA9PT0gMGIwMCkgeyBmY3MgPSBmcmFtZVtwb3NdITsgcG9zICs9IDE7IH1cbiAgZWxzZSBpZiAoZmNzU2l6ZUZsYWcgPT09IDBiMDEpIHsgZmNzID0gZnJhbWVbcG9zXSEgfCAoZnJhbWVbcG9zICsgMV0hIDw8IDgpOyBmY3MgKz0gMjU2OyBwb3MgKz0gMjsgfVxuICBlbHNlIGlmIChmY3NTaXplRmxhZyA9PT0gMGIxMCkgeyBmY3MgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KSB8IChmcmFtZVtwb3MgKyAzXSEgKiAweDEwMDAwMDApOyBwb3MgKz0gNDsgfVxuICBlbHNlIHRocm93IG5ldyBFcnJvcignenN0ZDogOC1ieXRlIEZDUyB1bnN1cHBvcnRlZCcpO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShmY3MpO1xuICBsZXQgb3V0UG9zID0gMDtcbiAgZm9yICg7Oykge1xuICAgIGlmIChwb3MgKyAzID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBoZWFkZXInKTtcbiAgICBjb25zdCBoZWFkZXJJbnQgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCkgfCAoZnJhbWVbcG9zICsgMl0hIDw8IDE2KTtcbiAgICBwb3MgKz0gMztcbiAgICBjb25zdCBpc0xhc3QgPSAoaGVhZGVySW50ICYgMSkgPT09IDE7XG4gICAgY29uc3QgYmxvY2tUeXBlID0gKGhlYWRlckludCA+Pj4gMSkgJiAwYjExO1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IChoZWFkZXJJbnQgPj4+IDMpICYgMHgxZl9mZl9mZjtcbiAgICBpZiAoYmxvY2tUeXBlICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoYHpzdGQ6IG9ubHkgUmF3X0Jsb2NrICgwKSBzdXBwb3J0ZWQsIGdvdCAke2Jsb2NrVHlwZX1gKTtcbiAgICBpZiAocG9zICsgYmxvY2tTaXplID4gZnJhbWUubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IHRydW5jYXRlZCBibG9jayBwYXlsb2FkJyk7XG4gICAgb3V0LnNldChmcmFtZS5zdWJhcnJheShwb3MsIHBvcyArIGJsb2NrU2l6ZSksIG91dFBvcyk7XG4gICAgb3V0UG9zICs9IGJsb2NrU2l6ZTtcbiAgICBwb3MgKz0gYmxvY2tTaXplO1xuICAgIGlmIChpc0xhc3QpIGJyZWFrO1xuICB9XG4gIGlmIChvdXRQb3MgIT09IGZjcykgdGhyb3cgbmV3IEVycm9yKGB6c3RkOiBGQ1MgbWlzbWF0Y2ggKGdvdCAke291dFBvc30sIGV4cGVjdGVkICR7ZmNzfSlgKTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIOKUgOKUgOKUgCBUYXIgbGlzdGluZyBkZWNvZGVyICh0ZXN0LW9ubHkpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gV2Fsa3MgYSB0YXIgYnl0ZSBidWZmZXIsIHJldHVybmluZyB7bmFtZSwgZGF0YX0gZm9yIGVhY2ggZW50cnkuIFN0b3BzIGF0XG4vLyB0aGUgdHJhaWxlciAodHdvIHplcm8gYmxvY2tzKS4gT25seSByZWFkcyB0aGUgZmllbGRzIFBpbmNoR3JhYiB3cml0ZXMuXG5cbmV4cG9ydCB0eXBlIFBhcnNlZFRhckVudHJ5ID0ge25hbWU6IHN0cmluZzsgZGF0YTogVWludDhBcnJheTsgc2l6ZTogbnVtYmVyfTtcblxuY29uc3QgZGVjID0gbmV3IFRleHREZWNvZGVyKCk7XG5cbmNvbnN0IHJlYWROdWxsU3RyID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgbGV0IGVuZCA9IG9mZnNldCArIGxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IG9mZnNldDsgaSA8IG9mZnNldCArIGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA9PT0gMCkgeyBlbmQgPSBpOyBicmVhazsgfVxuICB9XG4gIHJldHVybiBkZWMuZGVjb2RlKGJ1Zi5zdWJhcnJheShvZmZzZXQsIGVuZCkpO1xufTtcblxuY29uc3QgcmVhZE9jdGFsID0gKGJ1ZjogVWludDhBcnJheSwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgY29uc3QgcyA9IHJlYWROdWxsU3RyKGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpLnRyaW0oKTtcbiAgcmV0dXJuIHMgPyBwYXJzZUludChzLCA4KSA6IDA7XG59O1xuXG5leHBvcnQgY29uc3QgcGFyc2VUYXIgPSAoYnVmOiBVaW50OEFycmF5KTogUGFyc2VkVGFyRW50cnlbXSA9PiB7XG4gIGNvbnN0IGVudHJpZXM6IFBhcnNlZFRhckVudHJ5W10gPSBbXTtcbiAgbGV0IHBvcyA9IDA7XG4gIHdoaWxlIChwb3MgKyA1MTIgPD0gYnVmLmxlbmd0aCkge1xuICAgIGNvbnN0IGhlYWRlciA9IGJ1Zi5zdWJhcnJheShwb3MsIHBvcyArIDUxMik7XG4gICAgbGV0IGFsbFplcm8gPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspIHsgaWYgKGhlYWRlcltpXSAhPT0gMCkgeyBhbGxaZXJvID0gZmFsc2U7IGJyZWFrOyB9IH1cbiAgICBpZiAoYWxsWmVybykgYnJlYWs7IC8vIHRyYWlsZXJcbiAgICBjb25zdCBzaG9ydE5hbWUgPSByZWFkTnVsbFN0cihoZWFkZXIsIDAsIDEwMCk7XG4gICAgY29uc3QgcHJlZml4ID0gcmVhZE51bGxTdHIoaGVhZGVyLCAzNDUsIDE1NSk7XG4gICAgY29uc3QgbmFtZSA9IHByZWZpeCA/IGAke3ByZWZpeH0vJHtzaG9ydE5hbWV9YCA6IHNob3J0TmFtZTtcbiAgICBjb25zdCBzaXplID0gcmVhZE9jdGFsKGhlYWRlciwgMTI0LCAxMik7XG4gICAgcG9zICs9IDUxMjtcbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZSwgc2l6ZSwgZGF0YTogYnVmLnN1YmFycmF5KHBvcywgcG9zICsgc2l6ZSl9KTtcbiAgICAgIHBvcyArPSBzaXplO1xuICAgICAgY29uc3QgcGFkID0gKDUxMiAtIChzaXplICUgNTEyKSkgJSA1MTI7XG4gICAgICBwb3MgKz0gcGFkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZW50cmllcztcbn07XG4iLAogICAgIi8vIEF1dG8tZ2VuZXJhdGVkIGJ5IHNjcmlwdHMvYnVpbGQtZXh0ZW5zaW9uLnRzIOKAlCBkbyBub3QgZWRpdC5cbi8vIFRlbGxzIHRoZSBzaWRlcGFuZWwgd2hpY2ggdGVtcGxhdGUgcmVzb3VyY2VzIGV4aXN0IGluIHRoaXMgYnVpbGQuXG4vLyBBY3R1YWwgY29udGVudCBsaXZlcyBhcyAubWQgZmlsZXMgdW5kZXIgZXh0ZW5zaW9uL3RlbXBsYXRlcy8sIGxvYWRlZFxuLy8gbGF6aWx5IHZpYSBjaHJvbWUucnVudGltZS5nZXRVUkwg4oCUIHNlZSBsb2FkVGVtcGxhdGUoKSBpbiBzaWRlcGFuZWwudHMuXG5leHBvcnQgY29uc3QgVEVNUExBVEVTX1BSRVNFTlQgPSB7XCJkZXNpZ25UZW1wbGF0ZVwiOnRydWUsXCJza2lsbFRlbXBsYXRlXCI6dHJ1ZSxcImxvY2FsRGVzaWduXCI6dHJ1ZSxcImxvY2FsU2tpbGxcIjp0cnVlfSBhcyBjb25zdDtcbiIsCiAgICAiLy8gQXV0by1nZW5lcmF0ZWQgYnkgc2NyaXB0cy9idWlsZC1leHRlbnNpb24udHMg4oCUIGRvIG5vdCBlZGl0LlxuLy8gSW52ZW50b3J5IG9mIHZlbmRvcmVkIHNraWxsIHJlc291cmNlcyB1bmRlciBleHRlbnNpb24vc2tpbGxzLyAoc291cmNlIG9mXG4vLyB0cnV0aDogdGhpcmRfcGFydHkvKi9VUFNUUkVBTS5sb2NrIHZpYSBzY3JpcHRzL3N5bmMtYnVuZGxlZC1za2lsbHMudHMpLlxuLy8gYGV4dGAgaXMgdGhlIGV4dGVuc2lvbi1yZWxhdGl2ZSBmZXRjaCBwYXRoOyBgYXJjaGl2ZWAgaXMgd2hlcmUgdGhlIGZpbGVcbi8vIGxhbmRzIGluc2lkZSBhbiBleHBvcnRlZCAudGFyLnpzdCBidW5kbGUuXG5leHBvcnQgY29uc3QgQlVORExFRF9TS0lMTFNfUFJFU0VOVCA9IHRydWU7XG5leHBvcnQgdHlwZSBCdW5kbGVkU2tpbGxGaWxlID0ge2V4dDogc3RyaW5nOyBhcmNoaXZlOiBzdHJpbmc7IGJ5dGVzOiBudW1iZXJ9O1xuZXhwb3J0IGNvbnN0IEJVTkRMRURfU0tJTExfRklMRVM6IEJ1bmRsZWRTa2lsbEZpbGVbXSA9IFtcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwMzA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5uYXRpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5uYXRpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDM5MTBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuZHJvaWQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmRyb2lkLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMjI0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmltYXRlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5pbWF0ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA3MDhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDc0MzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2F1ZGl0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODMxM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYm9sZGVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYm9sZGVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3MDkyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9icmFuZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JyYW5kLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDQ3N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY2xhcmlmeS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NsYXJpZnkubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNjQ2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2RleC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvZGV4Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA3MDAyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jb2xvcml6ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvbG9yaXplLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMzU2OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JhZnQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcmFmdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTE5NDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyaXRpcXVlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JpdGlxdWUubWRcIixcbiAgICBcImJ5dGVzXCI6IDQxMjk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kZWxpZ2h0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGVsaWdodC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTgyN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGlzdGlsbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2Rpc3RpbGwubWRcIixcbiAgICBcImJ5dGVzXCI6IDU3NDBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RvY3VtZW50Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZG9jdW1lbnQubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3OTY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9leHRyYWN0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZXh0cmFjdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzQzMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaGFyZGVuLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaGFyZGVuLm1kXCIsXG4gICAgXCJieXRlc1wiOiA4NTk0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ob29rcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hvb2tzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MjU2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbml0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW5pdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTg5NTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2ludGVyYWN0aW9uLWRlc2lnbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2ludGVyYWN0aW9uLWRlc2lnbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjU3NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW9zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW9zLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMDM3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9sYXlvdXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9sYXlvdXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDExNzkwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9saXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvbGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjAxNTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29uYm9hcmQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vbmJvYXJkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NzQwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vcHRpbWl6ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29wdGltaXplLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NTk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vdmVyZHJpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9vdmVyZHJpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDkxMzlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3BvbGlzaC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3BvbGlzaC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTI5NTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3Byb2R1Y3QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9wcm9kdWN0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNzU4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9xdWlldGVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcXVpZXRlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDkxMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvc2hhcGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9zaGFwZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTE1MjNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3R5cGVzZXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS90eXBlc2V0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNzEzNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9MSUNFTlNFXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9MSUNFTlNFXCIsXG4gICAgXCJieXRlc1wiOiAxMDc2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9OT1RJQ0UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL05PVElDRS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTAzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9tYXJrZXRwbGFjZS5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vbWFya2V0cGxhY2UuanNvblwiLFxuICAgIFwiYnl0ZXNcIjogMTE5NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmNsYXVkZS1wbHVnaW4vcGx1Z2luLmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9wbHVnaW4uanNvblwiLFxuICAgIFwiYnl0ZXNcIjogNzU1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0ZVTkRJTkcueW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9GVU5ESU5HLnltbFwiLFxuICAgIFwiYnl0ZXNcIjogNDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZGVzaWduLXN5c3RlbS1wcm9maWxlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9kZXNpZ24tc3lzdGVtLXByb2ZpbGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI4MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9mcmFtZXdvcmstY29ycmVjdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvZnJhbWV3b3JrLWNvcnJlY3Rpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDM4OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9sZWFybmluZy1zdWJtaXNzaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9sZWFybmluZy1zdWJtaXNzaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvSVNTVUVfVEVNUExBVEUvbmV3LWhldXJpc3RpYy1ydWxlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9uZXctaGV1cmlzdGljLXJ1bGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9QVUxMX1JFUVVFU1RfVEVNUExBVEUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL1BVTExfUkVRVUVTVF9URU1QTEFURS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDQyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aWdub3JlXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGlnbm9yZVwiLFxuICAgIFwiYnl0ZXNcIjogNjY1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSEFOR0VMT0cubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSEFOR0VMT0cubWRcIixcbiAgICBcImJ5dGVzXCI6IDEzMTUwXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSVRBVElPTi5jZmZcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DSVRBVElPTi5jZmZcIixcbiAgICBcImJ5dGVzXCI6IDEyMTFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPREVfT0ZfQ09ORFVDVC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPREVfT0ZfQ09ORFVDVC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjc0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRJTkcubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9DT05UUklCVVRJTkcubWRcIixcbiAgICBcImJ5dGVzXCI6IDU1NjFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVE9SUy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVE9SUy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9MSUNFTlNFXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTElDRU5TRVwiLFxuICAgIFwiYnl0ZXNcIjogMTE1NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTk9USUNFXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vTk9USUNFXCIsXG4gICAgXCJieXRlc1wiOiA0NTgyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9SRUFETUUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9SRUFETUUubWRcIixcbiAgICBcImJ5dGVzXCI6IDIxNzA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbGwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbGwubWRcIixcbiAgICBcImJ5dGVzXCI6IDMxODJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FuYWx5emUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9hbmFseXplLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDc3NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvZXZhbHVhdGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9ldmFsdWF0ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjgzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvc29sdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9zb2x2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTYxM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvYW50aS1wYXR0ZXJucy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2FudGktcGF0dGVybnMubWRcIixcbiAgICBcImJ5dGVzXCI6IDI2NzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL2NvbnN0aXR1dGlvbmFsLWNvbnN0cmFpbnRzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvY29uc3RpdHV0aW9uYWwtY29uc3RyYWludHMubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ1OTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL291dHB1dC1zY2hlbWEubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9vdXRwdXQtc2NoZW1hLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDUxOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcGZkLWxheWVyLXJ1YnJpYy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BmZC1sYXllci1ydWJyaWMubWRcIixcbiAgICBcImJ5dGVzXCI6IDExMjk2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wc3ljaG9sb2d5L212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BzeWNob2xvZ3kvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMzQyNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvdGllcjItcHJvbXB0LXRlbXBsYXRlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvdGllcjItcHJvbXB0LXRlbXBsYXRlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNTg4OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3Nob3BpZnktdGhlbWVzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3Nob3BpZnktdGhlbWVzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzAzM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3RhaWx3aW5kLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3RhaWx3aW5kLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzQ5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2Rlc2lnbi1zeXN0ZW1zL3dlYi1mcmFtZXdvcmtzL3dvcmRwcmVzcy10aGVtZXMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvd29yZHByZXNzLXRoZW1lcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjIyNDZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9mb3VuZGF0aW9uLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvZm91bmRhdGlvbi1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAzMzg4MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wxLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDEtcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMzYxMzlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMi1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wyLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDM5MjUyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDMtcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMy1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAyMTY3N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2w0LXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDQtcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMjQ4MDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtY3Jvc3MtbGF5ZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWNyb3NzLWxheWVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyODU1NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1leGNlbGxlbnQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWV4Y2VsbGVudC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTcwMjhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZ29vZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZ29vZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjEzMzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtbWVkaW9jcmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLW1lZGlvY3JlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNDM3N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1wb29yLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1wb29yLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNjEzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS10ZXJyaWJsZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdGVycmlibGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDIwMTk0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXVuY29udmVudGlvbmFsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS11bmNvbnZlbnRpb25hbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjM2MzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9BREhELUNVUkItQ1VULm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL0FESEQtQ1VSQi1DVVQubWRcIixcbiAgICBcImJ5dGVzXCI6IDUzMDVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9QRVJDRVBUSU9OLUZJUlNULURFU0lHTi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2ZyYW1ld29yay9QRVJDRVBUSU9OLUZJUlNULURFU0lHTi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTg3NzBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2xsbXMudHh0XCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vbGxtcy50eHRcIixcbiAgICBcImJ5dGVzXCI6IDY1NDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NjcmlwdHMvZ2VuLXBmZC1pbmRleC5weVwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NjcmlwdHMvZ2VuLXBmZC1pbmRleC5weVwiLFxuICAgIFwiYnl0ZXNcIjogNDU0OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvU0tJTEwubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5MjU5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvYWNjdW11bGF0ZWQtbGVhcm5pbmdzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2FjY3VtdWxhdGVkLWxlYXJuaW5ncy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzIyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvY2l0YXRpb24tc3RhbmRhcmRzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2NpdGF0aW9uLXN0YW5kYXJkcy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTM0MzFcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9pbnNpZ2h0cy1sb2cubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvaW5zaWdodHMtbG9nLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NDJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDAvbDAxOC1iYWNrZW5kLW1lY2hhbmljcy1hcy1mcm9udGVuZC1jb21wbGV4aXR5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMC9sMDE4LWJhY2tlbmQtbWVjaGFuaWNzLWFzLWZyb250ZW5kLWNvbXBsZXhpdHkubWRcIixcbiAgICBcImJ5dGVzXCI6IDM2MTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDEvbDAxMS12aXN1YWwtY2hhbm5lbC1hdWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDEvbDAxMS12aXN1YWwtY2hhbm5lbC1hdWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzE0OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDEzLWtleWJvYXJkLWRlbnNpdHktaXMtbDIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTMta2V5Ym9hcmQtZGVuc2l0eS1pcy1sMi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTQ1MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDE2LW5lYXItbWlzcy1jb2xvci1hc3ltbWV0cnkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTYtbmVhci1taXNzLWNvbG9yLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjEzNlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDI0LWFhLWNvbnN0cmFpbmVkLXRva2VuLWxhZGRlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAyNC1hYS1jb25zdHJhaW5lZC10b2tlbi1sYWRkZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDUwMzBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDMvbDAyMy1mYWxzaWZpYWJpbGl0eS10cmlhZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDMvbDAyMy1mYWxzaWZpYWJpbGl0eS10cmlhZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDY5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDAzLXByZS1zZW5kLXZzLXBvc3QtcmVzcG9uc2UubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDMtcHJlLXNlbmQtdnMtcG9zdC1yZXNwb25zZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDYtaW5mcmFzdHJ1Y3R1cmUtdnMtYWN0aXZhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwNi1pbmZyYXN0cnVjdHVyZS12cy1hY3RpdmF0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwOC1lcGlzdGVtaWMtYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA4LWVwaXN0ZW1pYy1hc3ltbWV0cnkubWRcIixcbiAgICBcImJ5dGVzXCI6IDg5OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDIyLWw0LXN5bW1ldHJ5LXRocmVzaG9sZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAyMi1sNC1zeW1tZXRyeS10aHJlc2hvbGQubWRcIixcbiAgICBcImJ5dGVzXCI6IDQ1MjBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX2luZGV4Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9faW5kZXgubWRcIixcbiAgICBcImJ5dGVzXCI6IDM3MzRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvX3NlYXJjaC5qc29uXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9fc2VhcmNoLmpzb25cIixcbiAgICBcImJ5dGVzXCI6IDE0MTA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMDktdGVtcG9yYWwtc2Vzc2lvbi1jb250aW51aXR5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDA5LXRlbXBvcmFsLXNlc3Npb24tY29udGludWl0eS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTY5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTItcm91dGUtdnMtc3VydmV5LWtub3dsZWRnZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxMi1yb3V0ZS12cy1zdXJ2ZXkta25vd2xlZGdlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MzlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxNS1leHBlcmllbnRpYWwtc2VsZi1jb250cmFkaWN0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE1LWV4cGVyaWVudGlhbC1zZWxmLWNvbnRyYWRpY3Rpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDE2NThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxOS1tdWx0aS1hcnRpZmFjdC1lbmdhZ2VtZW50LWZpZWxkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE5LW11bHRpLWFydGlmYWN0LWVuZ2FnZW1lbnQtZmllbGQubWRcIixcbiAgICBcImJ5dGVzXCI6IDU0OTNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyMS1sNC1ldGhpY3MtZnVzaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDIxLWw0LWV0aGljcy1mdXNpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDQxMTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNS1jYXNjYWRlLWNyZWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNS1jYXNjYWRlLWNyZWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTQxNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI2LWFlc3RoZXRpYy1zdGFiaWxpdHktYXMtdHJ1c3QtcHJvZHVjZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjYtYWVzdGhldGljLXN0YWJpbGl0eS1hcy10cnVzdC1wcm9kdWNlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTgwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI4LWhlbGQtZGVjaXNpb24tY29tcG91bmRpbmcubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjgtaGVsZC1kZWNpc2lvbi1jb21wb3VuZGluZy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTI3NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDEtZ2VuZXJhdGl2ZS12cy1ldmFsdWF0aXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDEtZ2VuZXJhdGl2ZS12cy1ldmFsdWF0aXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NzNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAyLWFjY2Vzcy12cy1zaWduYWwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMi1hY2Nlc3MtdnMtc2lnbmFsLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3NTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA0LXdvcmtzcGFjZS12cy1wcm9kdWN0LXNlcGFyYXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNC13b3Jrc3BhY2UtdnMtcHJvZHVjdC1zZXBhcmF0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA1LXJlY3Vyc2l2ZS12YWxpZGF0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDUtcmVjdXJzaXZlLXZhbGlkYXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDY2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDctY29udmVyZ2VudC1nYXAtaWRlbnRpZmljYXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNy1jb252ZXJnZW50LWdhcC1pZGVudGlmaWNhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTE4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxMC1jb25zdHJhaW50cy1hcmUtZGlzdHJpYnV0aW9ucy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDEwLWNvbnN0cmFpbnRzLWFyZS1kaXN0cmlidXRpb25zLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTA3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNC1vcGVyYXRpb25hbC12cy1zdHJ1Y3R1cmFsLWV0aGljcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE0LW9wZXJhdGlvbmFsLXZzLXN0cnVjdHVyYWwtZXRoaWNzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNTI0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNy1pdGVyYXRpdmUtcmVncmVzc2lvbi1pcy12aXNpYmlsaXR5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTctaXRlcmF0aXZlLXJlZ3Jlc3Npb24taXMtdmlzaWJpbGl0eS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDczN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjAtaW50ZXJuYXRpb25hbC1jaXRhdGlvbi1leHBhbnNpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyMC1pbnRlcm5hdGlvbmFsLWNpdGF0aW9uLWV4cGFuc2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTY2NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjctaW50ZXJuYWwtYWNrbm93bGVkZ21lbnQtc2lnbmFscy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI3LWludGVybmFsLWFja25vd2xlZGdtZW50LXNpZ25hbHMubWRcIixcbiAgICBcImJ5dGVzXCI6IDY3MTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI5LXBvcnQtZG9udC1pbnN0YWxsLW1vdGlvbi1hdWRpdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDI5LXBvcnQtZG9udC1pbnN0YWxsLW1vdGlvbi1hdWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjAyNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5Nzg1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcGZkLXNwYXRpYWwtZXh0ZW5zaW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3BmZC1zcGF0aWFsLWV4dGVuc2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjk1NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3ByYWN0aXRpb25lci1jb3JyZWN0aW9ucy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wcmFjdGl0aW9uZXItY29ycmVjdGlvbnMubWRcIixcbiAgICBcImJ5dGVzXCI6IDY2NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvc2tpbGxzLWluZGV4Lmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJza2lsbHMtaW5kZXguanNvblwiLFxuICAgIFwiYnl0ZXNcIjogMTAxMTNcbiAgfVxuXTtcbiIsCiAgICAiLy8gU2VuZC10by1BZ2VudCBwcm9tcHQgKyBwcm90b2NvbCBidWlsZGVycy5cbi8vXG4vLyBUd28gYXJ0aWZhY3RzLCBvbmUgZG9jdHJpbmU6XG4vLyAgIOKAoiBidWlsZEFnZW50UHJvbXB0SnNvbmwg4oCUIHRoZSBKU09OTCBjbGlwYm9hcmQgcGF5bG9hZCBjb3BpZWQgd2hlbiB0aGVcbi8vICAgICB1c2VyIGNsaWNrcyBcIlNlbmQgdG8gQWdlbnRcIi4gTmluZSBkZW5zZSBsaW5lczogaGVhZGVyLCBpbnN0cnVjdGlvbixcbi8vICAgICBpZGVtcG90ZW50IGJhc2ggYm9vdHN0cmFwLCBtYW5kYXRvcnkgZnVsbC1yZWFkIGZpbGUgbGlzdCwgYnVuZGxlXG4vLyAgICAgdHJlZSwgb3JjaGVzdHJhdGlvbiBwaGFzZXMsIGNvbmRpdGlvbmFsIHN0b2NrLURFU0lHTiB3YXJuaW5nLFxuLy8gICAgIHJlY2FwdHVyZSB2ZXJpZmljYXRpb24sIGRvbmUtY3JpdGVyaWEuXG4vLyAgIOKAoiBidWlsZEFnZW50UHJvdG9jb2xNZCDigJQgQUdFTlQtUFJPVE9DT0wubWQgaW5zaWRlIGV2ZXJ5IGJ1bmRsZTogdGhlXG4vLyAgICAgZnVsbCBleHBhbnNpb24gb2YgdGhlIHNhbWUgZG9jdHJpbmUsIHNvIGEgbG9zdCBjbGlwYm9hcmQgZGVncmFkZXMgdG9cbi8vICAgICBcImV4dHJhY3QgdGhlIGFyY2hpdmUgYW5kIHJlYWQgQUdFTlQtUFJPVE9DT0wubWRcIi5cbi8vXG4vLyBIeWRyYXRpb24gY29udmVudGlvbnMgKG1pcnJvcmVkIGluIHRoZSBkb2NzKTpcbi8vICAg4oCiIHZhbHVlcyBiYWtlZCBpbiBhdCBleHBvcnQgdGltZSBjb21lIGZyb20gdGhlIG9wdGlvbnMgb2JqZWN0XG4vLyAgICAgKHdvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmUgcGF0aCwgZXhwb3J0IHRpbWVzdGFtcCwgdGFyIGVudHJpZXMpO1xuLy8gICDigKIgPEFOR0xFX1RPS0VOUz4gYXJlIGxlZnQgdmVyYmF0aW0gZm9yIHRoZSBSRUNFSVZJTkcgYWdlbnQgdG8gaW5mZXJcbi8vICAgICAoPFBST0pFQ1RfUk9PVD4sIDxBUFBfVVJMPiwgPEZFRURCQUNLX1VJRD4sIDxydW5JZD4sIDxBUkNISVZFX1BBVEg+KS5cbi8vXG4vLyBEZXRlcm1pbmlzbSBjb250cmFjdDogaWRlbnRpY2FsIGlucHV0cyDihpIgaWRlbnRpY2FsIG91dHB1dCBzdHJpbmdzLiBOb1xuLy8gRGF0ZS5ub3coKS9NYXRoLnJhbmRvbSgpIGluIGhlcmUg4oCUIHRoZSBleHBvcnQgY2xvY2sgYXJyaXZlcyB2aWEgb3B0cy5cbi8vIG5vZGUtdGVzdGFibGUgKG5vIGJyb3dzZXIgQVBJcyk7IGNvbnN1bWVkIGJ5IHNpZGVwYW5lbC50cyBhdCBleHBvcnQgdGltZS5cblxuLyoqIFBlcnNpc3RlbmNlIHJvb3QgZm9yIGEgd29ya3NwYWNlLCBhcyB0aGUgcmVjZWl2aW5nIGFnZW50IHNlZXMgaXQuICovXG5leHBvcnQgY29uc3Qgd29ya3NwYWNlUm9vdCA9ICh3b3Jrc3BhY2UpID0+IGB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8ke3dvcmtzcGFjZX1gO1xuXG4vKiogRXh0cmFjdGlvbiBkaXIgZm9yIGEgYnVuZGxlIGluc2lkZSB0aGUgcGVyc2lzdGVuY2Ugcm9vdC4gKi9cbmV4cG9ydCBjb25zdCBleHRyYWN0RGlyID0gKHdvcmtzcGFjZSwgYnVuZGxlSWQpID0+XG4gIGAke3dvcmtzcGFjZVJvb3Qod29ya3NwYWNlKX0vYnVuZGxlcy8ke2J1bmRsZUlkfS9leHRyYWN0ZWRgO1xuXG4vLyBTaW5nbGUtcXVvdGUtc2FmZSBpbnRlcnBvbGF0aW9uIGZvciBiYXNoOiAnaXQnXFwnJ3MnIHN1cnZpdmVzIGFueSBpbnB1dC5cbmNvbnN0IHNxID0gKHYpID0+IFN0cmluZyh2KS5yZXBsYWNlKC8nL2csIFwiJ1xcXFwnJ1wiKTtcblxuLyoqXG4gKiBJZGVtcG90ZW50IGJhc2ggYm9vdHN0cmFwLiBgYXJjaGl2ZVBhdGhgIGlzIHRoZSBoeWRyYXRlZCBhYnNvbHV0ZSBwYXRoIG9mXG4gKiB0aGUgLnRhci56c3Qgb24gdGhlIG9wZXJhdG9yJ3MgbWFjaGluZTsgcGFzcyB0aGUgbGl0ZXJhbCB0b2tlblxuICogJzxBUkNISVZFX1BBVEg+JyB0byBlbWl0IHRoZSB0b2tlbml6ZWQgY29weSBzaGlwcGVkIGluIEFHRU5ULVBST1RPQ09MLm1kLlxuICpcbiAqIFRoZSBzY3JpcHQgc2VsZi1ub3JtYWxpemVzIHRoZSBhcmNoaXZlIHBhdGggc28gXCJleGVjdXRlIGV4YWN0bHkgYXNcbiAqIHdyaXR0ZW5cIiBzdGF5cyB0cnVlIGV2ZXJ5d2hlcmUgdGhlIG9wZXJhdG9yJ3MgYnJvd3NlciBhbmQgYWdlbnQgY2FuXG4gKiBkaXNhZ3JlZSBhYm91dCBwYXRoIHNoYXBlOiBhIGxlYWRpbmcgfiBpcyBleHBhbmRlZCwgYW5kIGEgV2luZG93c1xuICogZHJpdmUgcGF0aCAoQ2hyb21lIG9uIFdpbmRvd3MgKyBhZ2VudCBpbiBXU0wvR2l0LUJhc2gpIGlzIGNvbnZlcnRlZFxuICogdmlhIHdzbHBhdGgsIGN5Z3BhdGgsIG9yIGEgbWFudWFsIC9tbnQvPGRyaXZlPiBmYWxsYmFjay5cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkQm9vdHN0cmFwU2NyaXB0ID0gKHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aCwgZXhwb3J0VHN9KSA9PiBbXG4gICcjIS91c3IvYmluL2VudiBiYXNoJyxcbiAgJyMgUGluY2hHcmFiIGJvb3RzdHJhcCDigJQgaWRlbXBvdGVudDsgc2FmZSB0byByZS1ydW4uJyxcbiAgJ3NldCAtZXVvIHBpcGVmYWlsJyxcbiAgYFdTPScke3NxKHdvcmtzcGFjZSl9J2AsXG4gIGBCSUQ9JyR7c3EoYnVuZGxlSWQpfSdgLFxuICBgU1JDPScke3NxKGFyY2hpdmVQYXRoKX0nYCxcbiAgJyMgTm9ybWFsaXplIHRoZSBhcmNoaXZlIHBhdGg6IGV4cGFuZCBhIGxlYWRpbmcgfiAoY2xpcGJvYXJkIG1heSBjYXJyeSB0aGUnLFxuICAnIyB+L0Rvd25sb2FkcyBmb3JtKSBhbmQgdHJhbnNsYXRlIFdpbmRvd3MgZHJpdmUgcGF0aHMgZm9yIFdTTC9HaXQtQmFzaC4nLFxuICAnU1JDPVwiJHtTUkMvI1xcXFx+LyRIT01FfVwiJyxcbiAgJ2Nhc2UgXCIkU1JDXCIgaW4nLFxuICAnICBbQS1aYS16XTpbXFxcXFxcXFwvXSopJyxcbiAgJyAgICBpZiBjb21tYW5kIC12IHdzbHBhdGggPi9kZXYvbnVsbCAyPiYxOyB0aGVuIFNSQz1cIiQod3NscGF0aCAtdSBcIiRTUkNcIilcIjsnLFxuICAnICAgIGVsaWYgY29tbWFuZCAtdiBjeWdwYXRoID4vZGV2L251bGwgMj4mMTsgdGhlbiBTUkM9XCIkKGN5Z3BhdGggLXUgXCIkU1JDXCIpXCI7JyxcbiAgJyAgICBlbHNlJyxcbiAgJyAgICAgIGRyaXZlPVwiJChwcmludGYgJXMgXCIke1NSQyUlOip9XCIgfCB0ciBcIls6dXBwZXI6XVwiIFwiWzpsb3dlcjpdXCIpXCInLFxuICAnICAgICAgcmVzdD1cIiR7U1JDIyo6fVwiOyByZXN0PVwiJHtyZXN0Ly9cXFxcXFxcXC8vfVwiJyxcbiAgJyAgICAgIFNSQz1cIi9tbnQvJGRyaXZlJHJlc3RcIicsXG4gICcgICAgZmk7OycsXG4gICdlc2FjJyxcbiAgJ1JPT1Q9XCIkSE9NRS8ucGluY2hncmFiL3dvcmtzcGFjZXMvJFdTXCInLFxuICAnREVTVD1cIiRST09UL2J1bmRsZXMvJEJJRFwiJyxcbiAgJ2lmIFsgLWYgXCIkREVTVC8uZXh0cmFjdGVkXCIgXSAmJiBbIFwiJChjYXQgXCIkREVTVC8uZXh0cmFjdGVkXCIpXCIgPSBcIiRCSURcIiBdOyB0aGVuJyxcbiAgJyAgZWNobyBcImFscmVhZHktZXh0cmFjdGVkICRERVNUL2V4dHJhY3RlZFwiJyxcbiAgJ2Vsc2UnLFxuICAnICBta2RpciAtcCBcIiRERVNUL2V4dHJhY3RlZFwiIFwiJFJPT1QvcGxhbnMvJEJJRFwiIFwiJFJPT1QvYXVkaXRzLyRCSURcIiBcIiRST09UL3JlY2FwdHVyZXNcIicsXG4gICcgIGlmIHRhciAtLXpzdGQgLXhmIFwiJFNSQ1wiIC1DIFwiJERFU1QvZXh0cmFjdGVkXCIgMj4vZGV2L251bGw7IHRoZW4gOjsgZWxzZScsXG4gICcgICAgenN0ZCAtZGMgXCIkU1JDXCIgfCB0YXIgLXggLUMgXCIkREVTVC9leHRyYWN0ZWRcIicsXG4gICcgIGZpJyxcbiAgJyAgY3AgLWYgXCIkU1JDXCIgXCIkREVTVC9idW5kbGUudGFyLnpzdFwiJyxcbiAgJyAgcHJpbnRmIFxcJyVzXFwnIFwiJEJJRFwiID4gXCIkREVTVC8uZXh0cmFjdGVkXCInLFxuICAnICBlY2hvIFwiZXh0cmFjdGVkICRERVNUL2V4dHJhY3RlZFwiJyxcbiAgJ2ZpJyxcbiAgYFsgLWYgXCIkUk9PVC93b3JrLW1hbmlmZXN0Lmpzb25sXCIgXSB8fCBwcmludGYgJyVzXFxcXG4nICd7XCJ2XCI6MSxcInR5cGVcIjpcIndvcmstbWFuaWZlc3QtaGVhZGVyXCIsXCJ0b29sXCI6XCJwaW5jaGdyYWJcIixcIndvcmtzcGFjZVwiOlwiJHt3b3Jrc3BhY2V9XCIsXCJjcmVhdGVkXCI6XCIke2V4cG9ydFRzfVwifScgPiBcIiRST09UL3dvcmstbWFuaWZlc3QuanNvbmxcImAsXG4gICdlY2hvIFwid29ya2RpciAkUk9PVFwiJyxcbl0uam9pbignXFxuJyk7XG5cbi8qKlxuICogUmVuZGVyIHRoZSBidW5kbGUncyB0YXIgZW50cnkgbmFtZXMgYXMgYW4gaW5kZW50ZWQgdHJlZS4gQ29sbGFwc2UgcnVsZXNcbiAqIGtlZXAgdGhlIGNsaXBib2FyZCBkZW5zZSBXSVRIT1VUIGhpZGluZyBzdHJ1Y3R1cmUgdGhlIHByb3RvY29sIGNpdGVzXG4gKiAoYSBuYWl2ZSBzaXplLWJhc2VkIGNvbGxhcHNlIGZvbGRlZCB0aGUgd2hvbGUgYC5hZ2VudHMvYCBza2lsbCB0cmVlIGludG9cbiAqIG9uZSBvcGFxdWUgbGluZSk6XG4gKiAgIOKAoiBhIGRpcmVjdG9yeSBjb2xsYXBzZXMgdG8gYGRpci8gKE4gZmlsZXMpYCBvbmx5IHdoZW4gaXQgaXMgRkxBVFxuICogICAgIChubyBzdWJkaXJlY3RvcmllcykgYW5kIGhvbGRzIG1vcmUgdGhhbiBgY29sbGFwc2VBdGAgZmlsZXMg4oCUXG4gKiAgICAgc2NyZWVuc2hvdHMvLCBpbXBlY2NhYmxlJ3MgcmVmZXJlbmNlLyDigJQgb3Igd2hlbiBpdCBzaXRzIGF0XG4gKiAgICAgYGNvbGxhcHNlRGVwdGhgIG9yIGRlZXBlciwgd2hlcmUgZGV0YWlsIHN0b3BzIHBheWluZyBmb3IgaXRzZWxmO1xuICogICDigKIgc3RydWN0dXJlZCBkaXJlY3RvcmllcyBhcmUgZGVzY2VuZGVkIHNvIHRoZWlyIHNraWxsL2xvY2F0b3IgbGF5b3V0XG4gKiAgICAgc3RheXMgdmlzaWJsZS5cbiAqIE91dHB1dCBpcyBjYXBwZWQgYXQgYG1heExpbmVzYCB3aXRoIGEgYOKApiArTiBtb3JlYCB0YWlsIGFzIGEgYmFja3N0b3AuXG4gKiBEZXRlcm1pbmlzdGljOiBlbnRyaWVzIGFyZSBzb3J0ZWQuXG4gKi9cbmV4cG9ydCBjb25zdCByZW5kZXJCdW5kbGVUcmVlID0gKGVudHJ5TmFtZXMsIHtjb2xsYXBzZUF0ID0gOCwgY29sbGFwc2VEZXB0aCA9IDMsIG1heExpbmVzID0gMTIwfSA9IHt9KSA9PiB7XG4gIC8vIEJ1aWxkIGEgbmVzdGVkIHtkaXJzOiBNYXAsIGZpbGVzOiBbXX0gc3RydWN0dXJlLlxuICBjb25zdCByb290Tm9kZSA9IHtkaXJzOiBuZXcgTWFwKCksIGZpbGVzOiBbXX07XG4gIGZvciAoY29uc3QgbmFtZSBvZiBbLi4uZW50cnlOYW1lc10uc29ydCgpKSB7XG4gICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KCcvJyk7XG4gICAgbGV0IG5vZGUgPSByb290Tm9kZTtcbiAgICBmb3IgKGNvbnN0IGRpciBvZiBwYXJ0cy5zbGljZSgwLCAtMSkpIHtcbiAgICAgIGlmICghbm9kZS5kaXJzLmhhcyhkaXIpKSBub2RlLmRpcnMuc2V0KGRpciwge2RpcnM6IG5ldyBNYXAoKSwgZmlsZXM6IFtdfSk7XG4gICAgICBub2RlID0gbm9kZS5kaXJzLmdldChkaXIpO1xuICAgIH1cbiAgICBub2RlLmZpbGVzLnB1c2gocGFydHNbcGFydHMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGNvbnN0IGNvdW50RmlsZXMgPSAobm9kZSkgPT4gbm9kZS5maWxlcy5sZW5ndGggKyBbLi4ubm9kZS5kaXJzLnZhbHVlcygpXS5yZWR1Y2UoKGEsIGQpID0+IGEgKyBjb3VudEZpbGVzKGQpLCAwKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgY29uc3QgZW1pdCA9IChub2RlLCBkZXB0aCkgPT4ge1xuICAgIGNvbnN0IHBhZCA9ICcgICcucmVwZWF0KGRlcHRoKTtcbiAgICBmb3IgKGNvbnN0IFtkaXIsIGNoaWxkXSBvZiBbLi4ubm9kZS5kaXJzLmVudHJpZXMoKV0uc29ydCgoW2FdLCBbYl0pID0+IChhIDwgYiA/IC0xIDogMSkpKSB7XG4gICAgICBjb25zdCB0b3RhbCA9IGNvdW50RmlsZXMoY2hpbGQpO1xuICAgICAgY29uc3QgZmxhdCA9IGNoaWxkLmRpcnMuc2l6ZSA9PT0gMDtcbiAgICAgIC8vIGBjaGlsZGAgcmVuZGVycyBhdCB0aGlzIGBkZXB0aGAgKGVtaXQncyBkZXB0aCBpcyB0aGUgcGFkIGxldmVsIG9mXG4gICAgICAvLyBub2RlJ3Mgb3duIGNoaWxkcmVuKS5cbiAgICAgIGlmICgoZmxhdCAmJiB0b3RhbCA+IGNvbGxhcHNlQXQpIHx8IGRlcHRoID49IGNvbGxhcHNlRGVwdGgpIHtcbiAgICAgICAgbGluZXMucHVzaChgJHtwYWR9JHtkaXJ9LyAoJHt0b3RhbH0gZmlsZXMpYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lcy5wdXNoKGAke3BhZH0ke2Rpcn0vYCk7XG4gICAgICAgIGVtaXQoY2hpbGQsIGRlcHRoICsgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgZiBvZiBub2RlLmZpbGVzKSBsaW5lcy5wdXNoKGAke3BhZH0ke2Z9YCk7XG4gIH07XG4gIGVtaXQocm9vdE5vZGUsIDApO1xuICBpZiAobGluZXMubGVuZ3RoID4gbWF4TGluZXMpIHtcbiAgICBjb25zdCBkcm9wcGVkID0gbGluZXMubGVuZ3RoIC0gbWF4TGluZXM7XG4gICAgcmV0dXJuIFsuLi5saW5lcy5zbGljZSgwLCBtYXhMaW5lcyksIGDigKYgKyR7ZHJvcHBlZH0gbW9yZWBdLmpvaW4oJ1xcbicpO1xuICB9XG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbn07XG5cbi8vIEJ1bmRsZSBmaWxlcyB3aG9zZSBwcmVzZW5jZSBnYXRlcyBhIG1hbmRhdG9yeS1yZWFkIHBhdGggLyBwcm9tcHQgbGluZS5cbmNvbnN0IFBJTkNIR1JBQl9TS0lMTF9QQVRIID0gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCc7XG5jb25zdCBQRkRfU0tJTExfUEFUSCA9ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kJztcbmNvbnN0IFNLSUxMU19JTkRFWF9QQVRIID0gJ3NraWxscy1pbmRleC5qc29uJztcblxuY29uc3Qgb3JjaGVzdHJhdGlvblRleHQgPSAoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGpzb25sTmFtZX0pID0+XG4gIGBQSEFTRSBtYXA6IGZvciBFVkVSWSBjb21tZW50IHJvdyBpbiAke2pzb25sTmFtZX0sIGRlY2lkZSB3aGljaCBidW5kbGVkIHNraWxscyBhcHBseSBhbmQgYXBwZW5kIG9uZSBjb21tZW50IHJvdyB0byB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8ke3dvcmtzcGFjZX0vd29yay1tYW5pZmVzdC5qc29ubCBjYXJyeWluZyBhIG1hcHBlZF9za2lsbHMgZmllbGQgd2hvc2UgZW50cmllcyBhcmUgbG9jYXRvcnMg4oCUIHBhdGhzIHJlbGF0aXZlIHRvIHRoZSBleHRyYWN0aW9uIHJvb3QgKGUuZy4gLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvPGZpbGU+Lm1kLCAke1BGRF9TS0lMTF9QQVRIfSwgJHtQSU5DSEdSQUJfU0tJTExfUEFUSH07IHRoZSBmdWxsIGluZGV4IGlzICR7U0tJTExTX0lOREVYX1BBVEh9KS4gVGhlIGV4cG9ydCBwcmUtc2VlZHMgaGV1cmlzdGljIHN1Z2dlc3RlZFNraWxscyBvbiBlYWNoIGZlZWRiYWNrIHJvdzsgdmVyaWZ5IGFuZCBjb3JyZWN0IHRoZW0sIGRvIG5vdCB0cnVzdCB0aGVtIGJsaW5kbHkuIGAgK1xuICBgUEhBU0UgcGxhbjogZmFuIG91dCBvbmUgYmFja2dyb3VuZCBhdG9taWMgc3ViYWdlbnQgcGVyIGNvbW1lbnQ7IHBhc3MgZWFjaCBzdWJhZ2VudCBhIHN0YW5kYWxvbmUgSlNPTkwgc3ViaW5zdHJ1Y3Rpb24gKHRlbXBsYXRlIGluIEFHRU5ULVBST1RPQ09MLm1kKSBjb250YWluaW5nIHRoZSBmdWxsIGNvbW1lbnQgcm93LCBpdHMgcGFyZW50IHNlbGVjdG9yIHJvdywgdGhlIGJ1bmRsZSBtYW5pZmVzdCBsaW5lLCBhbmQgdGhlIEZVTEwgVEVYVCBvZiBldmVyeSBtYXBwZWQgc2tpbGwgcHJvbXB0OyBlYWNoIHN1YmFnZW50IHVzZXMgeW91ciAvcGxhbiAocGxhbm5pbmcpIGNhcGFiaWxpdHkgZm9yIGl0cyBwaGFzZSBhbmQgcmV0dXJucyBhIHBsYW4sIHNhdmVkIHRvIHBsYW5zLyR7YnVuZGxlSWR9LzxGRUVEQkFDS19VSUQ+LnBsYW4ubWQ7IGVhY2ggc3ViYWdlbnQgYWxzbyBwb2xpc2hlcyBpdHMgcGxhbiB3aXRoIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGwuIGAgK1xuICBgUEhBU0UgaW1wbGVtZW50OiBZT1Ug4oCUIHRoZSBmb3JlZ3JvdW5kIGFnZW50IHRoZSBvcGVyYXRvciBwYXN0ZWQgdGhpcyBwcm9tcHQgaW50byDigJQgZG8gYWxsIGltcGxlbWVudGF0aW9uLCB0ZXN0IGRldmVsb3BtZW50LCB0ZXN0aW5nLCBhbmQgaXRlcmF0aW9uIGluIDxQUk9KRUNUX1JPT1Q+OyBzdWJhZ2VudHMgb25seSBwbGFuLiBQb2xpc2ggdGhlIGltcGxlbWVudGVkIHJlc3VsdCB3aXRoIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGwuIGAgK1xuICBgUEhBU0UgYXVkaXQ6IHNlbmQgdGhlIGNvbWJpbmVkIHBsYW5zICsgaW1wbGVtZW50YXRpb24gZm9yIGEgYmxpbmQgYXRvbWljICdyb2FzdCcgcGVlciByZXZpZXcgb2YgQk9USCBwbGFuIGFuZCBpbXBsZW1lbnRhdGlvbiwgdXNpbmcgd2hhdGV2ZXIgb3RoZXItYWdlbnQgcGVlci1yZXZpZXcgc2tpbGxzIGV4aXN0IGluIFlPVVIgT1dOIGVudmlyb25tZW50OyB3cml0ZSBpdCB0byBhdWRpdHMvJHtidW5kbGVJZH0vPHJ1bklkPi1yb2FzdC5tZCBhbmQgYWRkcmVzcyBldmVyeSBibG9ja2VyLiBgICtcbiAgYFBIQVNFIHZlcmlmeTogc2VlIHRoZSAndmVyaWZ5JyBsaW5lLiBgICtcbiAgYERFR1JBREFUSU9OIFJVTEU6IGlmIHlvdSBjYW5ub3Qgc3Bhd24gc3ViYWdlbnRzLCBvciBsYWNrIGEgL3BsYW4sIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbiwgb3Igcm9hc3QgY2FwYWJpbGl0eSwgcGVyZm9ybSB0aGUgc2FtZSBwaGFzZXMgeW91cnNlbGYgU0VSSUFMTFkgaW4gdGhpcyBleGFjdCBvcmRlciDigJQgbmV2ZXIgc2tpcCBhIHBoYXNlLiBgICtcbiAgYFNLSUxMUyBSVUxFOiB0aGUgYnVuZGxlZCBza2lsbHMgYXJlIGZvciB0aGlzIGpvYiBvbmx5IOKAlCByZWFkIHRoZW0gZnJvbSB0aGUgZXh0cmFjdGlvbiBkaXJlY3Rvcnk7IHRoZXJlIGlzIE5PIG5lZWQgdG8gaW5zdGFsbCB0aGVtIHBlcm1hbmVudGx5LCBhbmQgeW91IG11c3QgTk9UIG92ZXJ3cml0ZSB5b3VyIG93biBwZXJzaXN0ZW50IHNraWxscywgYWdlbnQgY29uZmlnLCBvciBkb3RmaWxlcy5gO1xuXG5jb25zdCB2ZXJpZnlUZXh0ID0gKHt3b3Jrc3BhY2UsIHhEaXIsIGpzb25sTmFtZX0pID0+XG4gIGBGaW5hbCB2ZXJpZmljYXRpb24gcGFzcywgb25seSBhZnRlciBpbXBsZW1lbnRhdGlvbiBhbmQgYXVkaXQ6IHN0YXJ0IHRoZSBwcm9kdWN0IGxvY2FsbHksIHRoZW4gcnVuOiBucHggLXkgcGluY2hncmFiIHJlY2FwdHVyZSAke3hEaXJ9LyR7anNvbmxOYW1lfSA8QVBQX1VSTD4gLS13b3Jrc3BhY2UtZGlyIH4vLnBpbmNoZ3JhYi93b3Jrc3BhY2VzLyR7d29ya3NwYWNlfSAodXNlIGJ1bnggaWYgbnB4IGlzIHVuYXZhaWxhYmxlKS4gVGhpcyByZS1sb2NhdGVzIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3RvciB3aXRoIFBpbmNoR3JhYidzIG93biBDU1MtPlhQYXRoLT5hMTF5IGNoYWluLCBzY3JlZW5zaG90cyBlYWNoIGVsZW1lbnQsIGFuZCB3cml0ZXMgYW4gYXBwZW5kLW9ubHkgcnVuIHVuZGVyIHJlY2FwdHVyZXMvPHJ1bklkPi8uIFJlYWQgZWFjaCByZWNhcHR1cmVkIFBORyBuZXh0IHRvIGl0cyBvcmlnaW5hbCBpbiAke3hEaXJ9L3NjcmVlbnNob3RzLyBhbmQgY29uZmlybSBldmVyeSBjb21tZW50IGlzIHZpc2libHkgcmVzb2x2ZWQ7IHRoZW4gdXBkYXRlIHRoZSBtYXRjaGluZyB3b3JrLW1hbmlmZXN0Lmpzb25sIHJvd3MgdG8gc3RhdHVzIGRvbmUsIG9yIGJsb2NrZWQgd2l0aCBhIHJlYXNvbi5gO1xuXG5jb25zdCBkb25lVGV4dCA9ICh7YnVuZGxlSWR9KSA9PlxuICBgWW91IGFyZSBmaW5pc2hlZCB3aGVuIGV2ZXJ5IGNvbW1lbnQgaGFzIGEgd29yay1tYW5pZmVzdC5qc29ubCByb3cgd2l0aCBzdGF0dXMgZG9uZSBvciBibG9ja2VkLCBwbGFucy8ke2J1bmRsZUlkfS8gaG9sZHMgb25lIHBsYW4gcGVyIGNvbW1lbnQsIGF1ZGl0cy8ke2J1bmRsZUlkfS8gaG9sZHMgYXQgbGVhc3Qgb25lIHJvYXN0LCBhbmQgdGhlIGxhdGVzdCByZWNhcHR1cmUgcnVuIGxvY2F0ZXMgZXZlcnkgY29tbWVudGVkIHNlbGVjdG9yLiB3b3JrLW1hbmlmZXN0Lmpzb25sIGlzIGFwcGVuZC1vbmx5OiBhZGQgcm93cywgbmV2ZXIgcmV3cml0ZSBoaXN0b3J5LmA7XG5cbmNvbnN0IHdhcm5pbmdUZXh0ID1cbiAgJ1RoZSBidW5kbGVkIERFU0lHTi5tZCBpcyBQaW5jaEdyYWJcXCdzIGJhcmUgc3RvY2sgdGVtcGxhdGUg4oCUIHRoZSBvcGVyYXRvciBkaWQgbm90IGN1c3RvbWl6ZSBpdC4gRG8gTk9UIHRyZWF0IGl0IGFzIHByb2R1Y3QgY2Fub24uIFByZWZlciBhIG1vcmUgYXBwbGljYWJsZSBjYW5vbmljYWwgZGVzaWduIHNvdXJjZSBpZiBvbmUgZXhpc3RzIGZvciB0aGlzIHByb2R1Y3QgKHNlYXJjaCA8UFJPSkVDVF9ST09UPiBmb3IgREVTSUdOLm1kLCBkb2NzL2Rlc2lnbiosIGJyYW5kLyBvciBzdHlsZS1ndWlkZSBmaWxlcykgYW5kIHVzZSB0aGUgYnVuZGxlZCB0ZW1wbGF0ZSBvbmx5IGFzIGEgZ2VuZXJpYyBjaGVja2xpc3QuJztcblxuLyoqXG4gKiBUaGUgbmluZS1saW5lIFNlbmQtdG8tQWdlbnQgY2xpcGJvYXJkIHBheWxvYWQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLndvcmtzcGFjZVxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuYnVuZGxlSWQgICAgICAgMTYtaGV4IGNvbnRlbnQgaGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IG9wdHMuYXJjaGl2ZVBhdGggICAgYWJzb2x1dGUgcGF0aCBvZiB0aGUgc2F2ZWQgLnRhci56c3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmV4cG9ydFRzICAgICAgIElTTyB0aW1lc3RhbXAgKHRoZSBleHBvcnQgY2xvY2spXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5qc29ubE5hbWUgICAgICB0aGUgYnVuZGxlJ3MgSlNPTkwgZW50cnkgbmFtZVxuICogQHBhcmFtIHt7Y29tbWVudHM6IG51bWJlciwgc2VsZWN0b3JzOiBudW1iZXIsIHBhZ2VzOiBudW1iZXIsIHNjcmVlbnNob3RzOiBudW1iZXJ9fSBvcHRzLmNvdW50c1xuICogQHBhcmFtIHtzdHJpbmdbXX0gb3B0cy5lbnRyeU5hbWVzICAgZXZlcnkgdGFyIGVudHJ5IG5hbWUgaW4gdGhlIGJ1bmRsZVxuICogQHBhcmFtIHtib29sZWFufSBvcHRzLmRlc2lnbklzVGVtcGxhdGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IG5ld2xpbmUtam9pbmVkIEpTT05MIChubyB0cmFpbGluZyBuZXdsaW5lKVxuICovXG5leHBvcnQgY29uc3QgYnVpbGRBZ2VudFByb21wdEpzb25sID0gKG9wdHMpID0+IHtcbiAgY29uc3Qge3dvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmVQYXRoLCBleHBvcnRUcywganNvbmxOYW1lLCBjb3VudHMsIGVudHJ5TmFtZXMsIGRlc2lnbklzVGVtcGxhdGV9ID0gb3B0cztcbiAgY29uc3QgeERpciA9IGV4dHJhY3REaXIod29ya3NwYWNlLCBidW5kbGVJZCk7XG4gIGNvbnN0IGhhcyA9IChuYW1lKSA9PiBlbnRyeU5hbWVzLmluY2x1ZGVzKG5hbWUpO1xuICBjb25zdCBsaW5lcyA9IFtdO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHY6IDEsIHR5cGU6ICdwaW5jaGdyYWItc2VuZC10by1hZ2VudCcsIHRvb2w6ICdwaW5jaGdyYWInLFxuICAgIHdvcmtzcGFjZSwgYnVuZGxlSWQsIGFyY2hpdmU6IGFyY2hpdmVQYXRoLCBnZW5lcmF0ZWQ6IGV4cG9ydFRzLFxuICAgIGNvdW50czoge2NvbW1lbnRzOiBjb3VudHMuY29tbWVudHMsIHNlbGVjdG9yczogY291bnRzLnNlbGVjdG9ycywgcGFnZXM6IGNvdW50cy5wYWdlcywgc2NyZWVuc2hvdHM6IGNvdW50cy5zY3JlZW5zaG90c30sXG4gICAgZGVzaWduSXNTdG9ja1RlbXBsYXRlOiBkZXNpZ25Jc1RlbXBsYXRlLFxuICB9KTtcblxuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnaW5zdHJ1Y3Rpb24nLFxuICAgIHRleHQ6IGBZb3UgaGF2ZSBiZWVuIGhhbmRlZCBhIFBpbmNoR3JhYiBmZWVkYmFjayBidW5kbGU6ICR7Y291bnRzLmNvbW1lbnRzfSBvcGVyYXRvciBjb21tZW50cyBwaW5uZWQgdG8gbGl2ZSBVSSBlbGVtZW50cyBvZiB0aGUgcHJvZHVjdCBidWlsdCBmcm9tIDxQUk9KRUNUX1JPT1Q+IChpbmZlciA8UFJPSkVDVF9ST09UPiBmcm9tIHlvdXIgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeTsgaWYgYW1iaWd1b3VzLCBhc2sgYmVmb3JlIGVkaXRpbmcpLiBEbyB0aGlzIG5vdywgaW4gb3JkZXI6ICgxKSBleGVjdXRlIHRoZSBiYXNoIHNjcmlwdCBpbiB0aGUgbmV4dCAnYm9vdHN0cmFwJyBsaW5lIGV4YWN0bHkgYXMgd3JpdHRlbiAoaXRzICdzY3JpcHQnIGZpZWxkIGlzIGEgSlNPTi1lc2NhcGVkIHBsYWluIGJhc2ggc2NyaXB0OyBpdCBzZWxmLW5vcm1hbGl6ZXMgfiBhbmQgV2luZG93cyBkcml2ZSBwYXRocyBmb3IgV1NML0dpdC1CYXNoKTsgKDIpIHJlYWQgRVZFUlkgZmlsZSBsaXN0ZWQgaW4gdGhlICdmaWxlcycgbGluZSBmdWxseSBpbnRvIGNvbnRleHQ7ICgzKSBmb2xsb3cgQUdFTlQtUFJPVE9DT0wubWQgdG8gbWFwLCBwbGFuLCBpbXBsZW1lbnQsIHRlc3QsIGF1ZGl0LCBhbmQgdmVyaWZ5IGEgZml4IGZvciBldmVyeSBjb21tZW50LmAsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICdib290c3RyYXAnLCBsYW5nOiAnYmFzaCcsIGlkZW1wb3RlbnQ6IHRydWUsXG4gICAgc2NyaXB0OiBidWlsZEJvb3RzdHJhcFNjcmlwdCh7d29ya3NwYWNlLCBidW5kbGVJZCwgYXJjaGl2ZVBhdGgsIGV4cG9ydFRzfSksXG4gIH0pO1xuXG4gIGNvbnN0IHBhdGhzID0gW1xuICAgIGBAJHt4RGlyfS9BR0VOVC1QUk9UT0NPTC5tZGAsXG4gICAgYEAke3hEaXJ9L1JFQURNRS5tZGAsXG4gICAgYEAke3hEaXJ9L3JlcGFpci1pbmRleC5tZGAsXG4gICAgYEAke3hEaXJ9LyR7anNvbmxOYW1lfWAsXG4gIF07XG4gIGlmIChoYXMoJ0RFU0lHTi5tZCcpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS9ERVNJR04ubWRgKTtcbiAgaWYgKGhhcyhQSU5DSEdSQUJfU0tJTExfUEFUSCkpIHBhdGhzLnB1c2goYEAke3hEaXJ9LyR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9YCk7XG4gIGlmIChoYXMoUEZEX1NLSUxMX1BBVEgpKSBwYXRocy5wdXNoKGBAJHt4RGlyfS8ke1BGRF9TS0lMTF9QQVRIfWApO1xuICBsaW5lcy5wdXNoKHtcbiAgICB0eXBlOiAnZmlsZXMnLCByZWFkRnVsbHk6IHRydWUsIG5vR3JlcDogdHJ1ZSxcbiAgICBydWxlOiAnUmVhZCBlYWNoIHBhdGggYmVsb3cgRU5ELVRPLUVORCB3aXRoIHlvdXIgZmlsZS1yZWFkaW5nIHRvb2wuIFRoaXMgaXMgTk9OLU9QVElPTkFMLiBEbyBOT1QgZ3JlcCB0aGVtLCBkbyBOT1QgaGVhZC90YWlsIHRoZW0sIGRvIE5PVCBzYW1wbGUgbGluZSByYW5nZXMg4oCUIGZ1bGwgY29udGVudHMgaW50byBjb250ZXh0LiBTY3JlZW5zaG90cyBhbmQgdGhlIGltcGVjY2FibGUgcmVmZXJlbmNlIGZpbGVzIGFyZSByZWFkIHBlci1jb21tZW50IGxhdGVyLCBhcyBBR0VOVC1QUk9UT0NPTC5tZCBkaXJlY3RzLicsXG4gICAgcGF0aHMsXG4gIH0pO1xuXG4gIGxpbmVzLnB1c2goe1xuICAgIHR5cGU6ICd0cmVlJywgcm9vdDogeERpciwgZW50cmllczogZW50cnlOYW1lcy5sZW5ndGgsXG4gICAgdGV4dDogcmVuZGVyQnVuZGxlVHJlZShlbnRyeU5hbWVzKSxcbiAgfSk7XG5cbiAgbGluZXMucHVzaCh7XG4gICAgdHlwZTogJ29yY2hlc3RyYXRpb24nLFxuICAgIHBoYXNlczogWydtYXAnLCAncGxhbicsICdpbXBsZW1lbnQnLCAnYXVkaXQnLCAndmVyaWZ5J10sXG4gICAgdGV4dDogb3JjaGVzdHJhdGlvblRleHQoe3dvcmtzcGFjZSwgYnVuZGxlSWQsIGpzb25sTmFtZX0pLFxuICB9KTtcblxuICBpZiAoZGVzaWduSXNUZW1wbGF0ZSkge1xuICAgIGxpbmVzLnB1c2goe3R5cGU6ICd3YXJuaW5nJywgY29kZTogJ0RFU0lHTl9NRF9JU19TVE9DS19URU1QTEFURScsIHRleHQ6IHdhcm5pbmdUZXh0fSk7XG4gIH1cblxuICBsaW5lcy5wdXNoKHt0eXBlOiAndmVyaWZ5JywgdGV4dDogdmVyaWZ5VGV4dCh7d29ya3NwYWNlLCB4RGlyLCBqc29ubE5hbWV9KX0pO1xuICBsaW5lcy5wdXNoKHt0eXBlOiAnZG9uZScsIHRleHQ6IGRvbmVUZXh0KHtidW5kbGVJZH0pfSk7XG5cbiAgcmV0dXJuIGxpbmVzLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBBR0VOVC1QUk9UT0NPTC5tZCDigJQgdGhlIGluLWJ1bmRsZSBleHBhbnNpb24gb2YgdGhlIGNsaXBib2FyZCBkb2N0cmluZS5cbiAqIHNraWxsc0luZGV4IGlzIHRoZSBwYXJzZWQgc2tpbGxzLWluZGV4Lmpzb24gKG9yIG51bGwgd2hlbiBza2lsbHMgd2VyZW4ndFxuICogYnVuZGxlZCk7IHVzZWQgdG8gaHlkcmF0ZSB0aGUgc2tpbGwgaW52ZW50b3J5IHRhYmxlLlxuICovXG5leHBvcnQgY29uc3QgYnVpbGRBZ2VudFByb3RvY29sTWQgPSAob3B0cykgPT4ge1xuICBjb25zdCB7d29ya3NwYWNlLCBidW5kbGVJZCwgZXhwb3J0VHMsIGpzb25sTmFtZSwgY291bnRzLCBlbnRyeU5hbWVzLCBkZXNpZ25Jc1RlbXBsYXRlLCBza2lsbHNJbmRleH0gPSBvcHRzO1xuICBjb25zdCB4RGlyID0gZXh0cmFjdERpcih3b3Jrc3BhY2UsIGJ1bmRsZUlkKTtcbiAgY29uc3Qgcm9vdCA9IHdvcmtzcGFjZVJvb3Qod29ya3NwYWNlKTtcbiAgY29uc3QgaGFzID0gKG5hbWUpID0+IGVudHJ5TmFtZXMuaW5jbHVkZXMobmFtZSk7XG4gIGNvbnN0IG91dCA9IFtdO1xuXG4gIG91dC5wdXNoKCcjIEFHRU5ULVBST1RPQ09MLm1kJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goYFdvcmtzcGFjZTogXFxgJHt3b3Jrc3BhY2V9XFxgIMK3IEJ1bmRsZTogXFxgJHtidW5kbGVJZH1cXGAgwrcgR2VuZXJhdGVkOiAke2V4cG9ydFRzfWApO1xuICBvdXQucHVzaChgQ291bnRzOiAqKiR7Y291bnRzLmNvbW1lbnRzfSoqIGNvbW1lbnRzIMK3ICoqJHtjb3VudHMuc2VsZWN0b3JzfSoqIHNlbGVjdG9ycyDCtyAqKiR7Y291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtjb3VudHMuc2NyZWVuc2hvdHN9Kiogc2NyZWVuc2hvdHNgKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnVGhpcyBmaWxlIGlzIHRoZSBmdWxsIHdvcmtpbmcgZG9jdHJpbmUgZm9yIHRoZSBjb2RpbmcgYWdlbnQgaGFuZGVkIHRoaXMnKTtcbiAgb3V0LnB1c2goJ2J1bmRsZS4gVGhlIG9wZXJhdG9yXFwncyBjbGlwYm9hcmQgcHJvbXB0IChKU09OTCkgaXMgYSBjb21wYWN0IGJvb3RzdHJhcCBvZicpO1xuICBvdXQucHVzaCgndGhlIHNhbWUgY29udGVudCDigJQgaWYgeW91IG9ubHkgaGF2ZSB0aGlzIGFyY2hpdmUsIGV2ZXJ5dGhpbmcgeW91IG5lZWQgaXMnKTtcbiAgb3V0LnB1c2goJ2hlcmUuIFRva2VucyBpbiBgPEFOR0xFX0JSQUNLRVRTPmAgYXJlIHlvdXJzIHRvIGluZmVyOiBgPFBST0pFQ1RfUk9PVD5gIGlzJyk7XG4gIG91dC5wdXNoKCd0aGUgcHJvZHVjdFxcJ3MgcmVwb3NpdG9yeSAodXN1YWxseSB5b3VyIHdvcmtpbmcgZGlyZWN0b3J5KSwgYDxBUFBfVVJMPmAgaXMnKTtcbiAgb3V0LnB1c2goJ3RoZSBsb2NhbGx5IHJ1bm5pbmcgcHJvZHVjdCwgYDxGRUVEQkFDS19VSUQ+YC9gPHJ1bklkPmAgYXJlIHBlci1pdGVtIGlkcy4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgMCDCtyBCb290c3RyYXAgKGlkZW1wb3RlbnQpJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ0lmIGAnICsgeERpciArICdgIGRvZXMgbm90IGV4aXN0IHlldCwgcnVuIHRoZSBzY3JpcHQgYmVsb3cgd2l0aCcpO1xuICBvdXQucHVzaCgnYDxBUkNISVZFX1BBVEg+YCByZXBsYWNlZCBieSB0aGUgYWJzb2x1dGUgcGF0aCBvZiB0aGlzIGJ1bmRsZVxcJ3MgYC50YXIuenN0YCcpO1xuICBvdXQucHVzaCgnKHdoZW4geW91IGFyZSByZWFkaW5nIHRoaXMgZnJvbSB0aGUgZXh0cmFjdGVkIGFyY2hpdmUsIHRoYXQgc3RlcCBhbHJlYWR5Jyk7XG4gIG91dC5wdXNoKCdoYXBwZW5lZCDigJQgcmUtcnVubmluZyBpcyBhIHNhZmUgbm8tb3ApLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBiYXNoJyk7XG4gIG91dC5wdXNoKGJ1aWxkQm9vdHN0cmFwU2NyaXB0KHt3b3Jrc3BhY2UsIGJ1bmRsZUlkLCBhcmNoaXZlUGF0aDogJzxBUkNISVZFX1BBVEg+JywgZXhwb3J0VHN9KSk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMgMSDCtyBQZXJzaXN0ZW50IHdvcmtzcGFjZSBsYXlvdXQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnQWxsIFBpbmNoR3JhYiB3b3JrIHN0YXRlIGxpdmVzIHVuZGVyIHRoZSBwZXJzaXN0ZW5jZSByb290IOKAlCBrZWVwIHlvdXInKTtcbiAgb3V0LnB1c2goJ3BsYW5uaW5nIGFydGlmYWN0cyB0aGVyZSBhbmQga2VlcCB0aGUgd29yayBtYW5pZmVzdCB1cGRhdGVkOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goYCR7cm9vdH0vYCk7XG4gIG91dC5wdXNoKCcgIHdvcmstbWFuaWZlc3QuanNvbmwgICAgICAgICAgICAgICMgYXBwZW5kLW9ubHkgYWdlbnQgc3RhdGUgbGVkZ2VyJyk7XG4gIG91dC5wdXNoKCcgIGJ1bmRsZXMvJyk7XG4gIG91dC5wdXNoKGAgICAgJHtidW5kbGVJZH0vYCk7XG4gIG91dC5wdXNoKCcgICAgICBidW5kbGUudGFyLnpzdCAgICAgICAgICAgICAgICMgY29weSBvZiB0aGUgb3JpZ2luYWwgYXJjaGl2ZScpO1xuICBvdXQucHVzaCgnICAgICAgLmV4dHJhY3RlZCAgICAgICAgICAgICAgICAgICAjIGd1YXJkIG1hcmtlciAoY29udGFpbnMgdGhlIGJ1bmRsZUlkKScpO1xuICBvdXQucHVzaCgnICAgICAgZXh0cmFjdGVkLyAgICAgICAgICAgICAgICAgICAjIHRhciBvdXRwdXQg4oCUIHRyZWF0IGFzIElNTVVUQUJMRSBpbnB1dCcpO1xuICBvdXQucHVzaCgnICBwbGFucy8nKTtcbiAgb3V0LnB1c2goYCAgICAke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kYCk7XG4gIG91dC5wdXNoKCcgIGF1ZGl0cy8nKTtcbiAgb3V0LnB1c2goYCAgICAke2J1bmRsZUlkfS88cnVuSWQ+LXJvYXN0Lm1kYCk7XG4gIG91dC5wdXNoKCcgIHJlY2FwdHVyZXMvJyk7XG4gIG91dC5wdXNoKCcgICAgPHJ1bklkPi8gICAgICAgICAgICAgICAgICAgICAgICMgYXBwZW5kLW9ubHk7IG5ldmVyIHJldXNlIGEgcnVuSWQnKTtcbiAgb3V0LnB1c2goJyAgICAgIHJlY2FwdHVyZS1tYW5pZmVzdC5qc29ubCcpO1xuICBvdXQucHVzaCgnICAgICAgc2NyZWVuc2hvdHMvPHVpZD4ucG5nJyk7XG4gIG91dC5wdXNoKCdgYGAnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYHdvcmstbWFuaWZlc3QuanNvbmxgIHJvd3MgKGFwcGVuZC1vbmx5OyByZWR1Y2VycyBncm91cCBieScpO1xuICBvdXQucHVzaCgnYChidW5kbGVJZCwgZmVlZGJhY2tVaWQpYCBhbmQgdGhlIExBU1Qgcm93IHdpbnMg4oCUIGFjY3JldGUsIG5ldmVyIHJld3JpdGUpOicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdgYGBqc29uYycpO1xuICBvdXQucHVzaCgnLy8gd3JpdHRlbiBvbmNlIGJ5IHRoZSBib290c3RyYXAnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwid29yay1tYW5pZmVzdC1oZWFkZXJcIixcInRvb2xcIjpcInBpbmNoZ3JhYlwiLFwid29ya3NwYWNlXCI6XCIke3dvcmtzcGFjZX1cIixcImNyZWF0ZWRcIjpcIiR7ZXhwb3J0VHN9XCJ9YCk7XG4gIG91dC5wdXNoKCcvLyBvbmUgcGVyIGNvbW1lbnQsIGFwcGVuZGVkIGVhY2ggdGltZSBpdHMgc3RhdGUgYWR2YW5jZXMnKTtcbiAgb3V0LnB1c2goYHtcInZcIjoxLFwidHlwZVwiOlwiY29tbWVudFwiLFwiYnVuZGxlSWRcIjpcIiR7YnVuZGxlSWR9XCIsXCJmZWVkYmFja1VpZFwiOlwiPEZFRURCQUNLX1VJRD5cIixcInBhcmVudFVpZFwiOlwiPHNlbGVjdG9yIHVpZD5cIixcInNlbGVjdG9yXCI6XCI8Y3NzPlwiLFwibWFwcGVkX3NraWxsc1wiOlt7XCJza2lsbFwiOlwiPGlkIGZyb20gc2tpbGxzLWluZGV4Lmpzb24+XCIsXCJsb2NhdG9yXCI6XCI8cGF0aCByZWxhdGl2ZSB0byBleHRyYWN0aW9uIHJvb3Q+XCJ9XSxcInN0YXR1c1wiOlwibWFwcGVkfHBsYW5uZWR8aW4tcHJvZ3Jlc3N8ZG9uZXxibG9ja2VkXCIsXCJwbGFuXCI6XCJwbGFucy8ke2J1bmRsZUlkfS88RkVFREJBQ0tfVUlEPi5wbGFuLm1kXCIsXCJub3Rlc1wiOlwiPHNob3J0PlwiLFwidHNcIjpcIjxJU08+XCJ9YCk7XG4gIG91dC5wdXNoKCcvLyBhcHBlbmRlZCBieSBgcGluY2hncmFiIHJlY2FwdHVyZWAgcnVucycpO1xuICBvdXQucHVzaChge1widlwiOjEsXCJ0eXBlXCI6XCJyZWNhcHR1cmUtcnVuXCIsXCJydW5JZFwiOlwiPHJ1bklkPlwiLFwidHNcIjpcIjxJU08+XCIsXCJidW5kbGVJZFwiOlwiJHtidW5kbGVJZH1cIixcImxvY2F0ZWRcIjowLFwidG90YWxcIjowfWApO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIDIgwrcgUmVhZCBvcmRlciAobm9uLW9wdGlvbmFsLCBmdWxsIHJlYWRzLCBubyBncmVwKScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdSZWFkIGVhY2ggb2YgdGhlc2UgRU5ELVRPLUVORCBiZWZvcmUgYW55IG90aGVyIGFjdGlvbi4gRG8gbm90IGdyZXAsIGhlYWQsJyk7XG4gIG91dC5wdXNoKCd0YWlsLCBvciBzYW1wbGUgbGluZSByYW5nZXMg4oCUIGZ1bGwgY29udGVudHMgaW50byBjb250ZXh0OicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKGAxLiBcXGAke3hEaXJ9L0FHRU5ULVBST1RPQ09MLm1kXFxgICh0aGlzIGZpbGUpYCk7XG4gIG91dC5wdXNoKGAyLiBcXGAke3hEaXJ9L1JFQURNRS5tZFxcYGApO1xuICBvdXQucHVzaChgMy4gXFxgJHt4RGlyfS9yZXBhaXItaW5kZXgubWRcXGBgKTtcbiAgb3V0LnB1c2goYDQuIFxcYCR7eERpcn0vJHtqc29ubE5hbWV9XFxgYCk7XG4gIGlmIChoYXMoJ0RFU0lHTi5tZCcpKSBvdXQucHVzaChgNS4gXFxgJHt4RGlyfS9ERVNJR04ubWRcXGBgKTtcbiAgaWYgKGhhcyhQSU5DSEdSQUJfU0tJTExfUEFUSCkpIG91dC5wdXNoKGA2LiBcXGAke3hEaXJ9LyR7UElOQ0hHUkFCX1NLSUxMX1BBVEh9XFxgYCk7XG4gIGlmIChoYXMoUEZEX1NLSUxMX1BBVEgpKSBvdXQucHVzaChgNy4gXFxgJHt4RGlyfS8ke1BGRF9TS0lMTF9QQVRIfVxcYGApO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdTY3JlZW5zaG90cyAoYHNjcmVlbnNob3RzL2AsIGluZGV4ZWQgYnkgYHNjcmVlbnNob3RzLmpzb25gKSBhbmQgdGhlJyk7XG4gIG91dC5wdXNoKCdpbXBlY2NhYmxlIHJlZmVyZW5jZSBmaWxlcyBhcmUgcmVhZCBwZXItY29tbWVudCBkdXJpbmcgdGhlIHBoYXNlcyBiZWxvdy4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBpZiAoZGVzaWduSXNUZW1wbGF0ZSkge1xuICAgIG91dC5wdXNoKCc+ICoqV0FSTklORyDigJQgREVTSUdOX01EX0lTX1NUT0NLX1RFTVBMQVRFLioqICcgKyB3YXJuaW5nVGV4dCk7XG4gICAgb3V0LnB1c2goJycpO1xuICB9XG4gIG91dC5wdXNoKCcjIyAzIMK3IEJ1bmRsZWQgc2tpbGxzJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoZSBidW5kbGVkIHNraWxscyBhcmUgZm9yIHRoaXMgam9iIG9ubHk6IHJlYWQgdGhlbSBmcm9tIHRoZSBleHRyYWN0aW9uJyk7XG4gIG91dC5wdXNoKCdkaXJlY3RvcnkuIFRoZXJlIGlzIE5PIG5lZWQgdG8gaW5zdGFsbCB0aGVtIHBlcm1hbmVudGx5LCBhbmQgeW91IG11c3QnKTtcbiAgb3V0LnB1c2goJ05PVCBvdmVyd3JpdGUgeW91ciBvd24gcGVyc2lzdGVudCBza2lsbHMsIGFnZW50IGNvbmZpZywgb3IgZG90ZmlsZXMuJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgaWYgKHNraWxsc0luZGV4ICYmIEFycmF5LmlzQXJyYXkoc2tpbGxzSW5kZXguc2tpbGxzKSAmJiBza2lsbHNJbmRleC5za2lsbHMubGVuZ3RoKSB7XG4gICAgLy8gVGFibGUtY2VsbCBzYW5pdGl6ZXIgZm9yIHNlbWktdHJ1c3RlZCBpbmRleCBzdHJpbmdzIChwdXJwb3NlcyBjb21lXG4gICAgLy8gZnJvbSB2ZW5kb3JlZCB1cHN0cmVhbSBmcm9udG1hdHRlcik6IGVzY2FwZSB0aGUgZXNjYXBlIGNoYXJhY3RlclxuICAgIC8vIEZJUlNULCB0aGVuIHRoZSBjZWxsIGRlbGltaXRlciwgYW5kIGZsYXR0ZW4gbmV3bGluZXMg4oCUIG90aGVyd2lzZSBhXG4gICAgLy8gY3JhZnRlZCBwdXJwb3NlIGNvdWxkIGJyZWFrIG91dCBvZiBpdHMgY2VsbCBhbmQgaW5qZWN0IHJvd3MgaW50byBhXG4gICAgLy8gZG9jdW1lbnQgYWdlbnRzIHRyZWF0IGFzIGRvY3RyaW5lIChDb2RlUUwganMvaW5jb21wbGV0ZS1zYW5pdGl6YXRpb24pLlxuICAgIGNvbnN0IGNlbGwgPSAodikgPT4gU3RyaW5nKHYgPz8gJycpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXFx8L2csICdcXFxcfCcpLnJlcGxhY2UoL1xccj9cXG4vZywgJyAnKTtcbiAgICBvdXQucHVzaCgnfCBpZCB8IGxvY2F0b3IgKHJlbGF0aXZlIHRvIGV4dHJhY3Rpb24gcm9vdCkgfCBwdXJwb3NlIHwnKTtcbiAgICBvdXQucHVzaCgnfCAtLS0gfCAtLS0gfCAtLS0gfCcpO1xuICAgIGZvciAoY29uc3QgcyBvZiBza2lsbHNJbmRleC5za2lsbHMpIHtcbiAgICAgIGNvbnN0IGludm9rZSA9IHMuaW52b2tlID8gYCBJbnZva2U6IFxcYCR7Y2VsbChzLmludm9rZSl9XFxgLmAgOiAnJztcbiAgICAgIG91dC5wdXNoKGB8IFxcYCR7Y2VsbChzLmlkKX1cXGAgfCBcXGAke2NlbGwocy5wYXRoKX1cXGAgfCAke2NlbGwocy5wdXJwb3NlKX0ke2ludm9rZX0gfGApO1xuICAgIH1cbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJ1Byb3ZlbmFuY2UgKHVwc3RyZWFtIHJlcG8gKyBwaW5uZWQgY29tbWl0ICsgbGljZW5zZSkgZm9yIGV2ZXJ5IHZlbmRvcmVkJyk7XG4gICAgb3V0LnB1c2goYHNraWxsIGlzIHJlY29yZGVkIGluIFxcYCR7U0tJTExTX0lOREVYX1BBVEh9XFxgIGF0IHRoZSBhcmNoaXZlIHJvb3QuYCk7XG4gIH0gZWxzZSB7XG4gICAgb3V0LnB1c2goJ19UaGlzIGJ1bmRsZSB3YXMgZXhwb3J0ZWQgd2l0aG91dCB0aGUgdmVuZG9yZWQgc2tpbGwgc2V0ICh0aGUgb3BlcmF0b3InKTtcbiAgICBvdXQucHVzaCgnZGlzYWJsZWQgXCJCdW5kbGUgZGVzaWduIHNraWxsc1wiKS4gTWFwIGNvbW1lbnRzIGFnYWluc3Qgd2hhdGV2ZXIgZGVzaWduJyk7XG4gICAgb3V0LnB1c2goJ3NraWxscyBleGlzdCBpbiBZT1VSIE9XTiBlbnZpcm9ubWVudCBpbnN0ZWFkLCBhbmQgbm90ZSB0aGF0IGluIHRoZScpO1xuICAgIG91dC5wdXNoKCd3b3JrIG1hbmlmZXN0Ll8nKTtcbiAgfVxuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyA0IMK3IFBoYXNlcycpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdSdW4gdGhlIGZpdmUgcGhhc2VzIGluIG9yZGVyLiAqKkRlZ3JhZGF0aW9uIHJ1bGU6KiogaWYgeW91IGNhbm5vdCBzcGF3bicpO1xuICBvdXQucHVzaCgnc3ViYWdlbnRzLCBvciBsYWNrIGEgYC9wbGFuYCwgYC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbmAsIG9yIHJvYXN0Jyk7XG4gIG91dC5wdXNoKCdjYXBhYmlsaXR5LCBwZXJmb3JtIHRoZSBzYW1lIHBoYXNlcyB5b3Vyc2VsZiBTRVJJQUxMWSBpbiB0aGlzIGV4YWN0IG9yZGVyJyk7XG4gIG91dC5wdXNoKCfigJQgbmV2ZXIgc2tpcCBhIHBoYXNlLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgbWFwJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goYEZvciBFVkVSWSBjb21tZW50IHJvdyBpbiBcXGAke2pzb25sTmFtZX1cXGAsIGRlY2lkZSB3aGljaCBidW5kbGVkIHNraWxscyBhcHBseWApO1xuICBvdXQucHVzaCgnYW5kIGFwcGVuZCBvbmUgYGNvbW1lbnRgIHJvdyB0byBgd29yay1tYW5pZmVzdC5qc29ubGAgY2FycnlpbmcgYScpO1xuICBvdXQucHVzaCgnYG1hcHBlZF9za2lsbHNgIGZpZWxkIHdob3NlIGVudHJpZXMgYXJlIGxvY2F0b3JzIChzZWUgwqczKS4gVGhlIGV4cG9ydCcpO1xuICBvdXQucHVzaCgncHJlLXNlZWRzIGhldXJpc3RpYyBgc3VnZ2VzdGVkU2tpbGxzYCBvbiBlYWNoIGZlZWRiYWNrIHJvdzsgdmVyaWZ5IGFuZCcpO1xuICBvdXQucHVzaCgnY29ycmVjdCB0aGVtLCBkbyBub3QgdHJ1c3QgdGhlbSBibGluZGx5LicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgcGxhbicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdGYW4gb3V0IE9ORSBiYWNrZ3JvdW5kIGF0b21pYyBzdWJhZ2VudCBwZXIgY29tbWVudC4gUGFzcyBlYWNoIHN1YmFnZW50IGEnKTtcbiAgb3V0LnB1c2goJ3N0YW5kYWxvbmUgSlNPTkwgc3ViaW5zdHJ1Y3Rpb24gY29udGFpbmluZyB0aGUgZnVsbCBjb21tZW50IHJvdywgaXRzJyk7XG4gIG91dC5wdXNoKCdwYXJlbnQgc2VsZWN0b3Igcm93LCB0aGUgYnVuZGxlIG1hbmlmZXN0IGxpbmUsIGFuZCB0aGUgRlVMTCBURVhUIG9mIGV2ZXJ5Jyk7XG4gIG91dC5wdXNoKCdtYXBwZWQgc2tpbGwgcHJvbXB0LiBFYWNoIHN1YmFnZW50IHVzZXMgeW91ciBgL3BsYW5gIChwbGFubmluZykgY2FwYWJpbGl0eScpO1xuICBvdXQucHVzaChgZm9yIGl0cyBwaGFzZSwgcG9saXNoZXMgaXRzIHBsYW4gd2l0aCBcXGAvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ246YWxsXFxgLCBhbmRgKTtcbiAgb3V0LnB1c2goYHJldHVybnMgYSBwbGFuIHlvdSBzYXZlIHRvIFxcYHBsYW5zLyR7YnVuZGxlSWR9LzxGRUVEQkFDS19VSUQ+LnBsYW4ubWRcXGAuYCk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1N1YmFnZW50IHN1Ymluc3RydWN0aW9uIHRlbXBsYXRlIChvbmUgSlNPTkwgZG9jdW1lbnQgcGVyIHN1YmFnZW50OyBoeWRyYXRlJyk7XG4gIG91dC5wdXNoKCdldmVyeSBgPC4uLj5gIGJlZm9yZSBkaXNwYXRjaCk6Jyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ2BgYGpzb25jJyk7XG4gIG91dC5wdXNoKGB7XCJ2XCI6MSxcInR5cGVcIjpcInBpbmNoZ3JhYi1zdWJhZ2VudC1wbGFuXCIsXCJidW5kbGVJZFwiOlwiJHtidW5kbGVJZH1cIixcImZlZWRiYWNrVWlkXCI6XCI8RkVFREJBQ0tfVUlEPlwifWApO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwiaW5zdHJ1Y3Rpb25cIixcInRleHRcIjpcIllvdSBhcmUgYSBwbGFubmluZyBzdWJhZ2VudCBmb3IgT05FIHVzZXIgY29tcGxhaW50IGFib3V0IGEgbGl2ZSBVSSBlbGVtZW50LiBVc2UgeW91ciAvcGxhbiBjYXBhYmlsaXR5LiBQcm9kdWNlIGFuIGltcGxlbWVudGF0aW9uIHBsYW4gT05MWSDigJQgZG8gbm90IGVkaXQgZmlsZXMuIERlbGl2ZXI6IHJvb3QtY2F1c2UgaHlwb3RoZXNpcywgZXhhY3QgZmlsZXMvc2VsZWN0b3JzIHRvIGNoYW5nZSBpbiA8UFJPSkVDVF9ST09UPiwgc3RlcC1ieS1zdGVwIGVkaXRzLCB0ZXN0IHBsYW4sIGFuZCBob3cgdGhlIGZpeCB3aWxsIGJlIHZpc3VhbGx5IHZlcmlmaWVkIGFnYWluc3QgdGhlIG9yaWdpbmFsIHNjcmVlbnNob3QuIFBvbGlzaCB0aGUgcGxhbiB3aXRoIC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGwgYmVmb3JlIHJldHVybmluZyBpdC5cIn0nKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcImNvbW1lbnRcIixcInJvd1wiOjxmdWxsIGZlZWRiYWNrIHJvdyBmcm9tIHRoZSBidW5kbGUgSlNPTkw+fScpO1xuICBvdXQucHVzaCgne1widHlwZVwiOlwidGFyZ2V0XCIsXCJyb3dcIjo8ZnVsbCBwYXJlbnQgc2VsZWN0b3Igcm93IGZyb20gdGhlIGJ1bmRsZSBKU09OTD59Jyk7XG4gIG91dC5wdXNoKCd7XCJ0eXBlXCI6XCJtYW5pZmVzdFwiLFwicm93XCI6PHRoZSBidW5kbGUgbWFuaWZlc3QgbGluZT59Jyk7XG4gIG91dC5wdXNoKGB7XCJ0eXBlXCI6XCJzY3JlZW5zaG90XCIsXCJwYXRoXCI6XCIke3hEaXJ9L3NjcmVlbnNob3RzLzxmaWxlPi5wbmdcIn1gKTtcbiAgb3V0LnB1c2goJ3tcInR5cGVcIjpcInNraWxsXCIsXCJpZFwiOlwiPG1hcHBlZCBza2lsbCBpZD5cIixcInRleHRcIjpcIjxGVUxMIFRFWFQgb2YgdGhlIG1hcHBlZCBza2lsbCBmaWxlPlwifScpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJyMjIyBpbXBsZW1lbnQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnWU9VIOKAlCB0aGUgZm9yZWdyb3VuZCBhZ2VudCB0aGUgb3BlcmF0b3IgcGFzdGVkIHRoZSBwcm9tcHQgaW50byDigJQgZG8gYWxsJyk7XG4gIG91dC5wdXNoKCdpbXBsZW1lbnRhdGlvbiwgdGVzdCBkZXZlbG9wbWVudCwgdGVzdGluZywgYW5kIGl0ZXJhdGlvbiBpbicpO1xuICBvdXQucHVzaCgnYDxQUk9KRUNUX1JPT1Q+YC4gU3ViYWdlbnRzIG9ubHkgcGxhbi4gV29yayBvbmUgY29tbWVudCBhdCBhIHRpbWUsIHVwZGF0ZScpO1xuICBvdXQucHVzaCgnaXRzIHdvcmstbWFuaWZlc3Qgcm93IHRvIGBpbi1wcm9ncmVzc2AgdGhlbiBgZG9uZWAvYGJsb2NrZWRgLCBhbmQgcG9saXNoJyk7XG4gIG91dC5wdXNoKCd0aGUgaW1wbGVtZW50ZWQgcmVzdWx0IHdpdGggYC9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbjphbGxgLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyMgYXVkaXQnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnU2VuZCB0aGUgY29tYmluZWQgcGxhbnMgKyBpbXBsZW1lbnRhdGlvbiBmb3IgYSBibGluZCBhdG9taWMgXFwncm9hc3RcXCcgcGVlcicpO1xuICBvdXQucHVzaCgncmV2aWV3IG9mIEJPVEggcGxhbiBhbmQgaW1wbGVtZW50YXRpb24sIHVzaW5nIHdoYXRldmVyIG90aGVyLWFnZW50Jyk7XG4gIG91dC5wdXNoKGBwZWVyLXJldmlldyBza2lsbHMgZXhpc3QgaW4gWU9VUiBPV04gZW52aXJvbm1lbnQuIFdyaXRlIGl0IHRvYCk7XG4gIG91dC5wdXNoKGBcXGBhdWRpdHMvJHtidW5kbGVJZH0vPHJ1bklkPi1yb2FzdC5tZFxcYCBhbmQgYWRkcmVzcyBldmVyeSBibG9ja2VyIGl0IHJhaXNlcy5gKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnIyMjIHZlcmlmeScpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCdPbmx5IGFmdGVyIGltcGxlbWVudGF0aW9uIGFuZCBhdWRpdDogc3RhcnQgdGhlIHByb2R1Y3QgbG9jYWxseSwgdGhlbiBydW4nKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaCgnYGBgYmFzaCcpO1xuICBvdXQucHVzaChgbnB4IC15IHBpbmNoZ3JhYiByZWNhcHR1cmUgJHt4RGlyfS8ke2pzb25sTmFtZX0gPEFQUF9VUkw+IC0td29ya3NwYWNlLWRpciAke3Jvb3R9YCk7XG4gIG91dC5wdXNoKCcjIGJ1bnggd29ya3MgdG9vOyBhZGQgLS1hdXRoLXN0YXRlIDxzdG9yYWdlU3RhdGUuanNvbj4gZm9yIGxvZ2dlZC1pbiBwYWdlcycpO1xuICBvdXQucHVzaCgnYGBgJyk7XG4gIG91dC5wdXNoKCcnKTtcbiAgb3V0LnB1c2goJ1RoaXMgcmUtbG9jYXRlcyBldmVyeSBjb21tZW50ZWQgc2VsZWN0b3Igd2l0aCBQaW5jaEdyYWJcXCdzIG93bicpO1xuICBvdXQucHVzaCgnQ1NT4oaSWFBhdGjihpJhMTF5IGNoYWluLCBzY3JlZW5zaG90cyBlYWNoIGVsZW1lbnQsIGFuZCB3cml0ZXMgYW4gYXBwZW5kLW9ubHknKTtcbiAgb3V0LnB1c2goYHJ1biB1bmRlciBcXGByZWNhcHR1cmVzLzxydW5JZD4vXFxgIChwbHVzIGEgXFxgcmVjYXB0dXJlLXJ1blxcYCBsZWRnZXIgcm93KS4gSXRgKTtcbiAgb3V0LnB1c2goJ2V4aXRzIDAgb25seSB3aGVuIGV2ZXJ5IGNvbW1lbnRlZCBzZWxlY3RvciBzdGlsbCByZXNvbHZlcy4gUmVhZCBlYWNoJyk7XG4gIG91dC5wdXNoKGByZWNhcHR1cmVkIFBORyBuZXh0IHRvIGl0cyBvcmlnaW5hbCBpbiBcXGAke3hEaXJ9L3NjcmVlbnNob3RzL1xcYCBhbmQgY29uZmlybWApO1xuICBvdXQucHVzaCgnZXZlcnkgY29tbWVudCBpcyB2aXNpYmx5IHJlc29sdmVkOyB0aGVuIHVwZGF0ZSB0aGUgbWF0Y2hpbmcnKTtcbiAgb3V0LnB1c2goJ3dvcmstbWFuaWZlc3Qgcm93cyB0byBgZG9uZWAsIG9yIGBibG9ja2VkYCB3aXRoIGEgcmVhc29uLicpO1xuICBvdXQucHVzaCgnJyk7XG4gIG91dC5wdXNoKCcjIyA1IMK3IERvbmUgY3JpdGVyaWEnKTtcbiAgb3V0LnB1c2goJycpO1xuICBvdXQucHVzaChkb25lVGV4dCh7YnVuZGxlSWR9KSk7XG4gIG91dC5wdXNoKCcnKTtcbiAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbn07XG4iLAogICAgIi8vIFNpbmdsZS1jYXB0dXJlIGZ1bGwgZXhwb3J0LlxuLy9cbi8vIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiB3YW50cyBhIENPTVBMRVRFLCBzZWxmLWNvbnRhaW5lZCB0ZXh0dWFsIGV4cG9ydCBvZlxuLy8gT05FIGNhcHR1cmU6IGl0cyBzZWxlY3RvcnMvcGF0aHMsIGVsZW1lbnQgdGV4dC9jb250ZW50LCBvdXRlckhUTUwsXG4vLyBtZXRhZGF0YSwgQU5EIGV2ZXJ5IG5vdGUvY29tbWVudCBhdHRhY2hlZCB0byBpdCDigJQgZXZlcnl0aGluZyBhIGZ1bGxcbi8vIHdvcmtzcGFjZSBleHBvcnQgY2FycmllcywgYnV0IHNjb3BlZCB0byBhIHNpbmdsZSBlbGVtZW50LlxuLy9cbi8vIFRoZSBwYW5lbCBtb2RlbHMgYSBjYXB0dXJlIGFzIGFuIGBFbnRyeWAgKHNyYy90eXBlcy50cykgcGx1cyB6ZXJvIG9yIG1vcmVcbi8vIGBGZWVkYmFja01lc3NhZ2VgIHJvd3MgbGlua2VkIGJhY2sgdmlhIGBwYXJlbnRVaWQg4oaSIEVudHJ5LnVpZGAuIEJlY2F1c2Vcbi8vIG5vdGVzIGxpdmUgb24gc2VwYXJhdGUgcm93cywgdGhlIHNlcmlhbGl6ZXIgdGFrZXMgdGhlIGNhcHR1cmUgZW50cnkgYW5kXG4vLyBpdHMgZmVlZGJhY2sgcm93cyB0b2dldGhlciBzbyB0aGUgSlNPTiBpcyBnZW51aW5lbHkgc2VsZi1jb250YWluZWQg4oCUIGFcbi8vIGNhbGxlciBjYW4gaGFuZCB0aGUgb3V0cHV0IHRvIGFuIGFnZW50IGFuZCBub3RoaW5nIGRhbmdsZXMuXG4vL1xuLy8gR3JvdXAgaGVhZHMgKEFsdCtTaGlmdCtDbGljayBzZWxlY3Rpb25zKSBjYXJyeSBjaGlsZCBjYXB0dXJlcyB1bmRlclxuLy8gYGVudHJ5Lmdyb3VwYDsgd2UgaW5saW5lIHRob3NlIGNoaWxkcmVuICh3aXRoIHRoZWlyIG93biBmZWVkYmFjaykgc28gYVxuLy8gZ3JvdXBlZCBjYXB0dXJlIGV4cG9ydHMgYXMgb25lIGNvbXBsZXRlIG9iamVjdCB0b28uXG4vL1xuLy8gVHdvIG91dHB1dCBmb3JtcywgbWlycm9yaW5nIHRoZSB3b3Jrc3BhY2UgZXhwb3J0J3MgSlNPTiArIGVuZ2xpc2ggc3BsaXQ6XG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVGdWxsKGNhcHR1cmUsIG9wdHMpICAgICDihpIgb2JqZWN0ICAoc3RydWN0dXJlZCwgY29tcGxldGUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVKc29uKGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKHByZXR0eSBKU09OICsgbmV3bGluZSlcbi8vICAgc2VyaWFsaXplQ2FwdHVyZVRleHQoY2FwdHVyZSwgb3B0cykgICAgICDihpIgc3RyaW5nICAobWFya2Rvd24sIGh1bWFuL0xMTSlcbi8vXG4vLyBgY2FwdHVyZWAgYWNjZXB0cyBlaXRoZXI6XG4vLyAgIOKAoiB7IGVudHJ5LCBmZWVkYmFjaz8sIG1lbWJlcnM/IH0gIOKAlCBleHBsaWNpdCBzaGFwZSwgT1Jcbi8vICAg4oCiIGEgYmFyZSBgRW50cnlgICAgICAgICAgICAgICAgICAg4oCUIGZlZWRiYWNrIGRlZmF1bHRzIHRvIFtdXG4vL1xuLy8gT3V0cHV0IGlzIGRldGVybWluaXN0aWM6IGlkZW50aWNhbCBpbnB1dCDihpIgYnl0ZS1pZGVudGljYWwgb3V0cHV0LiBOb1xuLy8gdGltZXN0YW1wcyBhcmUgaW5qZWN0ZWQ7IG9ubHkgdGhlIGNhcHR1cmUncyBvd24gYHRzYCBmaWVsZHMgYXBwZWFyLlxuXG4vLyDilIDilIDilIAgSW5wdXQgbm9ybWFsaXphdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gQWNjZXB0IGEgYmFyZSBFbnRyeSBvciBhIHtlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnN9IHdyYXBwZXIgYW5kIHJldHVybiBhXG4vLyBub3JtYWxpemVkIHtlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnN9IHdpdGggYXJyYXlzIGFsd2F5cyBwcmVzZW50LlxuY29uc3Qgbm9ybWFsaXplQ2FwdHVyZSA9IChjYXB0dXJlKSA9PiB7XG4gIGlmICghY2FwdHVyZSB8fCB0eXBlb2YgY2FwdHVyZSAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInNlcmlhbGl6ZUNhcHR1cmVGdWxsOiBjYXB0dXJlIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIC8vIEJhcmUgRW50cnk6IGl0IGhhcyBhIGBzZWxlY3RvcmAgLyBgdWlkYCBidXQgbm8gbmVzdGVkIGBlbnRyeWAuXG4gIGNvbnN0IGVudHJ5ID0gY2FwdHVyZS5lbnRyeSA/PyBjYXB0dXJlO1xuICBpZiAoIWVudHJ5IHx8IHR5cGVvZiBlbnRyeSAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInNlcmlhbGl6ZUNhcHR1cmVGdWxsOiBjYXB0dXJlIGhhcyBubyBlbnRyeVwiKTtcbiAgfVxuICBjb25zdCBmZWVkYmFjayA9IEFycmF5LmlzQXJyYXkoY2FwdHVyZS5mZWVkYmFjaykgPyBjYXB0dXJlLmZlZWRiYWNrIDogW107XG4gIC8vIEdyb3VwIG1lbWJlcnMgbWF5IGJlIHN1cHBsaWVkIGV4cGxpY2l0bHksIGVsc2UgZmFsbCBiYWNrIHRvIHRoZSBlbnRyeSdzXG4gIC8vIG93biBgZ3JvdXBgIGFycmF5ICh0aGUgcGFuZWwgc3RvcmVzIGNoaWxkIGNhcHR1cmVzIHRoZXJlKS5cbiAgY29uc3QgbWVtYmVycyA9IEFycmF5LmlzQXJyYXkoY2FwdHVyZS5tZW1iZXJzKVxuICAgID8gY2FwdHVyZS5tZW1iZXJzXG4gICAgOiBBcnJheS5pc0FycmF5KGVudHJ5Lmdyb3VwKVxuICAgICAgPyBlbnRyeS5ncm91cFxuICAgICAgOiBbXTtcbiAgcmV0dXJuIHsgZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzIH07XG59O1xuXG4vLyBBIGZlZWRiYWNrIHJvdyBzY29wZWQgdG8gYSBzaW5nbGUgY2FwdHVyZS4gU3RyaXBzIHJvdXRpbmcvVUkgY3J1ZnRcbi8vIChpZCwgdHlwZSkgYW5kIGtlZXBzIG9ubHkgd2hhdCBhIHJldmlld2VyIG5lZWRzOiB0aGUgdGV4dCwgd2hlbiBpdCB3YXNcbi8vIHdyaXR0ZW4sIGFueSB0YWdzLCBhbmQgdGhlIHBhcmVudCBsaW5rIGZvciB0cmFjZWFiaWxpdHkuXG5jb25zdCBzbGltQ29tbWVudCA9IChmYikgPT4ge1xuICBjb25zdCBvdXQgPSB7IHRleHQ6IHR5cGVvZiBmYi50ZXh0ID09PSBcInN0cmluZ1wiID8gZmIudGV4dCA6IFwiXCIgfTtcbiAgaWYgKGZiLnRzKSBvdXQudHMgPSBmYi50cztcbiAgaWYgKGZiLnVpZCkgb3V0LnVpZCA9IGZiLnVpZDtcbiAgaWYgKGZiLnBhcmVudFVpZCkgb3V0LnBhcmVudFVpZCA9IGZiLnBhcmVudFVpZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGgpIG91dC50YWdzID0gZmIudGFncztcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIENvbGxlY3QgdGhlIHBhdGhzL3NlbGVjdG9ycyBmb3IgYSBjYXB0dXJlIGludG8gb25lIGJsb2NrIHNvIGV2ZXJ5IHdheSBvZlxuLy8gbG9jYXRpbmcgdGhlIGVsZW1lbnQgaXMgaW4gYSBzaW5nbGUsIG9idmlvdXMgcGxhY2UuIFRvbGVyYW50IG9mIGJvdGggdGhlXG4vLyBwYW5lbCBgRW50cnlgIHNoYXBlIChmbGF0IGBzZWxlY3RvcmAgKyBgaWRgL2B0ZXN0SWRgKSBhbmQgdGhlIHJpY2hlclxuLy8gYHNlbGVjdG9yc2Agc3ViLW9iamVjdCBzb21lIGNhcHR1cmUgcGlwZWxpbmVzIGVtaXQuXG5jb25zdCBjb2xsZWN0UGF0aHMgPSAoZW50cnkpID0+IHtcbiAgY29uc3QgcGF0aHMgPSB7fTtcbiAgaWYgKGVudHJ5LnNlbGVjdG9yKSBwYXRocy5jc3MgPSBlbnRyeS5zZWxlY3RvcjtcbiAgY29uc3Qgc2VsID0gZW50cnkuc2VsZWN0b3JzO1xuICBpZiAoc2VsICYmIHR5cGVvZiBzZWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICBpZiAoc2VsLmNzcyAmJiBzZWwuY3NzICE9PSBwYXRocy5jc3MpIHBhdGhzLmNzc0Z1bGwgPSBzZWwuY3NzO1xuICAgIGlmIChzZWwuY29tcGFjdCkgcGF0aHMuY29tcGFjdCA9IHNlbC5jb21wYWN0O1xuICAgIGlmIChzZWwueHBhdGgpIHBhdGhzLnhwYXRoID0gc2VsLnhwYXRoO1xuICAgIGlmIChzZWwuZGF0YUlkcykgcGF0aHMuZGF0YUlkcyA9IHNlbC5kYXRhSWRzO1xuICB9XG4gIGlmIChlbnRyeS5jb21wb25lbnRSb290KSBwYXRocy5jb21wb25lbnRSb290ID0gZW50cnkuY29tcG9uZW50Um9vdDtcbiAgaWYgKGVudHJ5LnNoYWRvd0hvc3QpIHBhdGhzLnNoYWRvd0hvc3QgPSBlbnRyeS5zaGFkb3dIb3N0O1xuICBpZiAoZW50cnkuaWQpIHBhdGhzLmRvbUlkID0gZW50cnkuaWQ7XG4gIGlmIChlbnRyeS50ZXN0SWQpIHBhdGhzLnRlc3RJZCA9IGVudHJ5LnRlc3RJZDtcbiAgaWYgKHR5cGVvZiBlbnRyeS5zZWxlY3Rvck1hdGNoQ291bnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICBwYXRocy5tYXRjaENvdW50ID0gZW50cnkuc2VsZWN0b3JNYXRjaENvdW50O1xuICB9XG4gIHJldHVybiBwYXRocztcbn07XG5cbi8vIOKUgOKUgOKUgCBGdWxsIHN0cnVjdHVyZWQgZm9ybSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuLy8gQnVpbGQgdGhlIGNvbXBsZXRlIG9iamVjdCBmb3IgT05FIGNhcHR1cmUuIEV2ZXJ5dGhpbmcgdGV4dHVhbCB0aGVcbi8vIHdvcmtzcGFjZSBleHBvcnQgd291bGQgY2FycnkgZm9yIHRoaXMgZWxlbWVudCwgd2l0aCBub3Rlcy9jb21tZW50c1xuLy8gaW5saW5lZC4gR3JvdXAgbWVtYmVycyByZWN1cnNlIHNvIGEgZ3JvdXBlZCBjYXB0dXJlIGlzIHNlbGYtY29udGFpbmVkLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVGdWxsID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcblxuICBjb25zdCBvdXQgPSB7XG4gICAga2luZDogXCJwaW5jaGdyYWIvY2FwdHVyZS1mdWxsXCIsXG4gICAgdjogMSxcbiAgfTtcbiAgaWYgKGVudHJ5LnVpZCkgb3V0LnVpZCA9IGVudHJ5LnVpZDtcbiAgaWYgKGVudHJ5Lm4gIT09IHVuZGVmaW5lZCkgb3V0Lm4gPSBlbnRyeS5uO1xuICBpZiAoZW50cnkudHMpIG91dC50cyA9IGVudHJ5LnRzO1xuICBpZiAoZW50cnkudXJsKSBvdXQudXJsID0gZW50cnkudXJsO1xuICBpZiAoZW50cnkudGFnKSBvdXQudGFnID0gZW50cnkudGFnO1xuXG4gIC8vIElkZW50aXR5IC8gYTExeSBuYW1pbmcuXG4gIGNvbnN0IGlkZW50aXR5ID0ge307XG4gIGlmIChlbnRyeS5yb2xlICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LnJvbGUgPSBlbnRyeS5yb2xlO1xuICBpZiAoZW50cnkuYWNjZXNzaWJsZU5hbWUgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuYWNjZXNzaWJsZU5hbWUgPSBlbnRyeS5hY2Nlc3NpYmxlTmFtZTtcbiAgaWYgKGVudHJ5LnRlc3RJZCAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmIChlbnRyeS5pZCAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5pZCA9IGVudHJ5LmlkO1xuICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeS5jbGFzc2VzKSAmJiBlbnRyeS5jbGFzc2VzLmxlbmd0aCkgaWRlbnRpdHkuY2xhc3NlcyA9IGVudHJ5LmNsYXNzZXM7XG4gIGlmIChPYmplY3Qua2V5cyhpZGVudGl0eSkubGVuZ3RoKSBvdXQuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxuICAvLyBQYXRocyDigJQgZXZlcnkgd2F5IHRvIGxvY2F0ZSB0aGUgZWxlbWVudC5cbiAgY29uc3QgcGF0aHMgPSBjb2xsZWN0UGF0aHMoZW50cnkpO1xuICBpZiAoT2JqZWN0LmtleXMocGF0aHMpLmxlbmd0aCkgb3V0LnBhdGhzID0gcGF0aHM7XG5cbiAgLy8gVGV4dCAvIGNvbnRlbnQuIFdlIGtlZXAgYWxsIHRleHR1YWwgc3VyZmFjZXMgc28gbm90aGluZyB0aGUgdXNlciBjYW5cbiAgLy8gc2VlIGlzIGxvc3Q6IHNvdXJjZSB0ZXh0LCB0aGUgQ1NTLXJlbmRlcmVkIGZvcm0sIGFuZCB0aGUgbWFya3VwLlxuICBjb25zdCBjb250ZW50ID0ge307XG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQudGV4dCA9IGVudHJ5LnRleHQ7XG4gIGlmIChlbnRyeS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgY29udGVudC5yZW5kZXJlZFRleHQgPSBlbnRyeS5yZW5kZXJlZFRleHQ7XG4gIGlmIChlbnRyeS52YWx1ZSAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnZhbHVlID0gZW50cnkudmFsdWU7XG4gIGlmIChlbnRyeS5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnBsYWNlaG9sZGVyID0gZW50cnkucGxhY2Vob2xkZXI7XG4gIGlmIChlbnRyeS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkgY29udGVudC5vdXRlckhUTUwgPSBlbnRyeS5vdXRlckhUTUw7XG4gIGlmIChPYmplY3Qua2V5cyhjb250ZW50KS5sZW5ndGgpIG91dC5jb250ZW50ID0gY29udGVudDtcblxuICAvLyBOb3RlcyAvIGNvbW1lbnRzIGF0dGFjaGVkIHRvIHRoaXMgY2FwdHVyZS5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkgb3V0LmNvbW1lbnRzID0gZmVlZGJhY2subWFwKHNsaW1Db21tZW50KTtcblxuICAvLyBSZW1haW5pbmcgc3RydWN0dXJlZCBtZXRhZGF0YSBhbiBhZ2VudCBtYXkgd2FudCDigJQgY29waWVkIHRocm91Z2hcbiAgLy8gdmVyYmF0aW0gc28gdGhpcyBleHBvcnQgaXMgYXMgY29tcGxldGUgYXMgdGhlIEpTT05MIHJvdy4gV2UgYWxsb3ctbGlzdFxuICAvLyB0aGUgaGVhdnkvc3RydWN0dXJlZCBmaWVsZHMgcmF0aGVyIHRoYW4gZHVtcGluZyB0aGUgd2hvbGUgRW50cnkgc28gdGhlXG4gIC8vIG91dHB1dCBvcmRlcmluZyBzdGF5cyBzdGFibGUgYW5kIG9idmlvdXMuXG4gIGNvbnN0IG1ldGEgPSB7fTtcbiAgY29uc3QgcGFzc3Rocm91Z2ggPSBbXG4gICAgXCJyZWN0XCIsIFwidmlld3BvcnRcIiwgXCJzdGF0ZXNcIiwgXCJhdHRyc1wiLCBcImhpbnRzXCIsIFwiY29tcG9uZW50XCIsIFwiZXZlbnRzXCIsXG4gICAgXCJiZWhhdmlvckF0dHJzXCIsIFwiYTExeVwiLCBcImFzc2V0c1wiLCBcImxheW91dENvbnRleHRcIiwgXCJzdHlsZXNcIixcbiAgICBcIm1hdGNoZWRSdWxlc1wiLCBcImFuY2VzdG9yc1wiLCBcInNjcmVlbnNob3RcIiwgXCJ0cnVuY2F0ZWRcIiwgXCJzZXNzaW9uSWRcIixcbiAgICBcImNhbnZhc0NsaWNrXCIsIFwiZWRpdG9yXCIsIFwiZG9tTXV0YXRpb25zXCIsIFwiaXNBbmltYXRpbmdcIixcbiAgXTtcbiAgZm9yIChjb25zdCBrZXkgb2YgcGFzc3Rocm91Z2gpIHtcbiAgICBpZiAoZW50cnlba2V5XSAhPT0gdW5kZWZpbmVkKSBtZXRhW2tleV0gPSBlbnRyeVtrZXldO1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhtZXRhKS5sZW5ndGgpIG91dC5tZXRhID0gbWV0YTtcblxuICAvLyBHcm91cCBtZW1iZXJzOiByZWN1cnNlIHNvIGVhY2ggY2hpbGQgY2FwdHVyZSBpcyBmdWxseSBzZXJpYWxpemVkIHRvby5cbiAgLy8gQSBtZW1iZXIgbWF5IGNhcnJ5IGl0cyBvd24gZmVlZGJhY2sgd2hlbiB0aGUgY2FsbGVyIHN1cHBsaWVzIGFcbiAgLy8ge2VudHJ5LCBmZWVkYmFja30gcGFpcjsgYmFyZSBjaGlsZCBFbnRyaWVzIHNlcmlhbGl6ZSB3aXRoIG5vIGNvbW1lbnRzLlxuICBpZiAobWVtYmVycy5sZW5ndGgpIHtcbiAgICBvdXQubWVtYmVycyA9IG1lbWJlcnMubWFwKChtKSA9PiBzZXJpYWxpemVDYXB0dXJlRnVsbChtLCBvcHRzKSk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gUHJldHR5IEpTT04gc3RyaW5nIGZvciB0aGUgXCJDb3B5IGNhcHR1cmUgYXMgSlNPTlwiIGJ1dHRvbi4gVHJhaWxpbmdcbi8vIG5ld2xpbmUgc28gaXQgcm91bmQtdHJpcHMgY2xlYW5seSB0aHJvdWdoIGVkaXRvcnMgLyBgcGJwYXN0ZWAuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplQ2FwdHVyZUpzb24gPSAoY2FwdHVyZSwgb3B0cyA9IHt9KSA9PlxuICBKU09OLnN0cmluZ2lmeShzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSwgbnVsbCwgMikgKyBcIlxcblwiO1xuXG4vLyDilIDilIDilIAgU2luZ2xlLWNhcHR1cmUgbWFya2Rvd24gZm9ybSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vXG4vLyBNYXRjaGVzIHRoZSB3b3Jrc3BhY2UgZXhwb3J0J3MgZW5nbGlzaC9tYXJrZG93biBzdXJmYWNlIGJ1dCBzY29wZWQgdG8gb25lXG4vLyBjYXB0dXJlLiBVc2VmdWwgd2hlbiB0aGUgdXNlciB3YW50cyB0byBwYXN0ZSBhIGh1bWFuLXJlYWRhYmxlIGNhcmQgcmF0aGVyXG4vLyB0aGFuIHJhdyBKU09OLlxuXG5jb25zdCBoZWFkaW5nID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IG5hbWUgPVxuICAgIGVudHJ5LmFjY2Vzc2libGVOYW1lIHx8XG4gICAgZW50cnkudGVzdElkIHx8XG4gICAgZW50cnkuaWQgfHxcbiAgICBlbnRyeS5zZWxlY3RvciB8fFxuICAgIGVudHJ5LnRhZyB8fFxuICAgIFwiY2FwdHVyZVwiO1xuICBjb25zdCBsYWJlbCA9IGVudHJ5Lm4gIT09IHVuZGVmaW5lZCA/IGBDYXB0dXJlICMke2VudHJ5Lm59YCA6IFwiQ2FwdHVyZVwiO1xuICByZXR1cm4gYCR7bGFiZWx9OiAke25hbWV9YDtcbn07XG5cbmNvbnN0IHJlbmRlclBhdGhzID0gKHBhdGhzKSA9PiB7XG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHBhdGhzKSkge1xuICAgIGxpbmVzLnB1c2goYC0gKioke2t9OioqIFxcYCR7dn1cXGBgKTtcbiAgfVxuICByZXR1cm4gbGluZXM7XG59O1xuXG5leHBvcnQgY29uc3Qgc2VyaWFsaXplQ2FwdHVyZVRleHQgPSAoY2FwdHVyZSwgb3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzIH0gPSBub3JtYWxpemVDYXB0dXJlKGNhcHR1cmUpO1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBsaW5lcy5wdXNoKGAjICR7aGVhZGluZyhlbnRyeSl9YCwgXCJcIik7XG4gIGlmIChlbnRyeS51cmwpIGxpbmVzLnB1c2goYFBhZ2U6IDwke2VudHJ5LnVybH0+YCwgXCJcIik7XG4gIGlmIChlbnRyeS50YWcpIGxpbmVzLnB1c2goYEVsZW1lbnQ6IFxcYDwke2VudHJ5LnRhZ30+XFxgYCwgXCJcIik7XG5cbiAgY29uc3QgcGF0aHMgPSBjb2xsZWN0UGF0aHMoZW50cnkpO1xuICBpZiAoT2JqZWN0LmtleXMocGF0aHMpLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBQYXRoc1wiLCBcIlwiLCAuLi5yZW5kZXJQYXRocyhwYXRocykpO1xuICB9XG5cbiAgaWYgKGVudHJ5LnRleHQgIT09IHVuZGVmaW5lZCB8fCBlbnRyeS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBUZXh0XCIsIFwiXCIpO1xuICAgIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQpIGxpbmVzLnB1c2goYFNvdXJjZTogJHtKU09OLnN0cmluZ2lmeShlbnRyeS50ZXh0KX1gKTtcbiAgICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQgJiYgZW50cnkucmVuZGVyZWRUZXh0ICE9PSBlbnRyeS50ZXh0KSB7XG4gICAgICBsaW5lcy5wdXNoKGBSZW5kZXJlZDogJHtKU09OLnN0cmluZ2lmeShlbnRyeS5yZW5kZXJlZFRleHQpfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbnRyeS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBNYXJrdXBcIiwgXCJcIiwgXCJgYGBodG1sXCIsIGVudHJ5Lm91dGVySFRNTCwgXCJgYGBcIik7XG4gIH1cblxuICBpZiAoZmVlZGJhY2subGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIE5vdGVzICYgY29tbWVudHNcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBmYiBvZiBmZWVkYmFjaykge1xuICAgICAgY29uc3QgdGV4dCA9IHR5cGVvZiBmYi50ZXh0ID09PSBcInN0cmluZ1wiID8gZmIudGV4dCA6IFwiXCI7XG4gICAgICBjb25zdCB0YWdzID0gQXJyYXkuaXNBcnJheShmYi50YWdzKSAmJiBmYi50YWdzLmxlbmd0aCA/IGAgXygke2ZiLnRhZ3Muam9pbihcIiwgXCIpfSlfYCA6IFwiXCI7XG4gICAgICBsaW5lcy5wdXNoKGAtICR7dGV4dH0ke3RhZ3N9YCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChcIlwiLCBcIiMjIEdyb3VwZWQgd2l0aFwiLCBcIlwiKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVtYmVycykge1xuICAgICAgY29uc3QgbWUgPSBub3JtYWxpemVDYXB0dXJlKG0pLmVudHJ5O1xuICAgICAgbGluZXMucHVzaChgLSAke2hlYWRpbmcobWUpfSDigJQgXFxgJHttZS5zZWxlY3RvciA/PyBtZS50YWcgPz8gXCI/XCJ9XFxgYCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzLmpvaW4oXCJcXG5cIikgKyBcIlxcblwiO1xufTtcbiIsCiAgICAiLy8gUGluY2hHcmFiIHNpZGUtcGFuZWwgVUkuIFJlY2VpdmVzIGNhcHR1cmVzICsgaG92ZXJzIGZyb20gdGhlIGNvbnRlbnRcbi8vIHNjcmlwdDsgcmVuZGVycyB0aGUgY2hhdC1idWJibGUgdGltZWxpbmUsIGV4cG9ydHMsIHZhbGlkYXRlcywgZXRjLlxuLy9cbi8vIERlY29tcG9zZWQgaW50byBzbWFsbCBmaWxlcyBmb3IgY2xhcml0eTpcbi8vICAg4oCiIHR5cGVzLnRzICAgICAg4oCUIHNoYXJlZCB0eXBlcywgbWVzc2FnZSBwcm90b2NvbFxuLy8gICDigKIgbHVjaWRlLnRzICAgICDigJQgaWNvbiByZWdpc3RyeVxuLy8gICDigKIgdGhpcyBmaWxlICAgICDigJQgd2lyZS11cCAvIHJlbmRlcmluZyAvIGV4cG9ydCBidWlsZGVyc1xuLy9cbi8vIExvYWRlZCBhcyB0aGUgc2lkZSBwYW5lbCBwYWdlOiBjaHJvbWUuc2lkZVBhbmVsIGRlZmF1bHRfcGF0aC5cblxuaW1wb3J0IHR5cGUge1xuICBBbm5vdGF0aW9uUGF5bG9hZCwgQ3NUb1BhbmVsLCBFbnRyeSwgRXhwb3J0RGlhZ25vc3RpYywgRXhwb3J0TWFuaWZlc3QsIEZlZWRiYWNrTWVzc2FnZSwgUGFnZU1lc3NhZ2UsXG4gIFBhZ2VTbmFwc2hvdCwgUGFuZWxNZXNzYWdlLCBQYW5lbFRvQmcsIFBhbmVsVG9DcywgUGdFbnZlbG9wZSwgU2F2ZVJlcGx5LCBTZWxlY3Rvck1lc3NhZ2UsIFNob3RSZXBseSwgVmlld3BvcnQsXG59IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtwZ30gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQge1BHX0lDT05TfSBmcm9tICcuL2x1Y2lkZS50cyc7XG5pbXBvcnQge2J1aWxkVGFyLCB3cmFwWnN0ZCwgdHlwZSBUYXJFbnRyeX0gZnJvbSAnLi90YXIudHMnO1xuaW1wb3J0IHtURU1QTEFURVNfUFJFU0VOVH0gZnJvbSAnLi90ZW1wbGF0ZXMuZ2VuLnRzJztcbmltcG9ydCB7QlVORExFRF9TS0lMTFNfUFJFU0VOVCwgQlVORExFRF9TS0lMTF9GSUxFU30gZnJvbSAnLi9idW5kbGVkLXNraWxscy5nZW4udHMnO1xuaW1wb3J0IHtidWlsZEFnZW50UHJvbXB0SnNvbmwsIGJ1aWxkQWdlbnRQcm90b2NvbE1kLCB0eXBlIFNraWxsc0luZGV4fSBmcm9tICcuL2V4cG9ydC1hZ2VudC1wcm9tcHQubWpzJztcbmltcG9ydCB7c2VyaWFsaXplQ2FwdHVyZUpzb259IGZyb20gJy4vZXhwb3J0LWNhcHR1cmUubWpzJztcblxuKCgpID0+IHtcbiAgY29uc3QgTE9HID0gJ1tQaW5jaEdyYWIvc3BdJztcbiAgY29uc3QgUFJFRlNfU1RPUkFHRV9OQU1FID0gJ3BpbmNoZ3JhYi5wcmVmcy52Mic7XG4gIGNvbnN0IFdPUktTUEFDRVNfS0VZID0gJ3BpbmNoZ3JhYi53b3Jrc3BhY2VzLnYxJztcbiAgY29uc3QgaW5FeHRlbnNpb24gPSB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKGNocm9tZS5ydW50aW1lPy5pZCk7XG5cbiAgLy8g4pSA4pSA4pSAIFRlbXBsYXRlIHJlc291cmNlIGxvYWRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRWFybGllciB0aGUgdGVtcGxhdGVzIHdlcmUgYmFrZWQgYXMgc3RyaW5nIGNvbnN0YW50cyBpbnRvIHRoaXMgSUlGRVxuICAvLyAofjM2MEtCIGFjcm9zcyBERVNJR04gKyBTS0lMTCkuIFRoYXQgYmxvYXRlZCB0aGUgc2lkZXBhbmVsIGJ1bmRsZSB0b1xuICAvLyB+MS45NU1CIGFuZCBzbG93ZWQgZmlyc3Qtb3BlbiBwYXJzZSB0aW1lIG5vdGljZWFibHkuIFRoZXkgbm93IHNoaXAgYXNcbiAgLy8gc2VwYXJhdGUgYC5tZGAgZmlsZXMgdW5kZXIgYGV4dGVuc2lvbi90ZW1wbGF0ZXMvYCBhbmQgbG9hZCBvbiBkZW1hbmRcbiAgLy8gdmlhIGZldGNoIOKAlCB3aGVuIHRoZSB1c2VyIG9wZW5zIHRoZSBlZGl0b3IgbW9kYWwsIG9yIHdoZW4gdGhlIGV4cG9ydFxuICAvLyBwaXBlbGluZSBuZWVkcyB0byBidW5kbGUgYSBmYWxsYmFjay5cbiAgLy9cbiAgLy8gQ2FjaGUgcmVzdWx0cyBpbi1wcm9jZXNzIHNvIHJlcGVhdCByZWFkcyAobW9kYWwgb3BlbiDihpIgY2xvc2Ug4oaSIHJlb3BlbixcbiAgLy8gb3Igc2VxdWVudGlhbCBleHBvcnRzKSBkb24ndCByZS1mZXRjaC5cbiAgY29uc3QgdGVtcGxhdGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IFRFTVBMQVRFX0ZJTEVTID0ge1xuICAgIGRlc2lnblRlbXBsYXRlOiAnREVTSUdOLnRlbXBsYXRlLm1kJyxcbiAgICBza2lsbFRlbXBsYXRlOiAnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJyxcbiAgICBsb2NhbERlc2lnbjogJ2xvY2FsLkRFU0lHTi5tZCcsXG4gICAgbG9jYWxTa2lsbDogJ2xvY2FsLlNLSUxMLm1kJyxcbiAgfSBhcyBjb25zdDtcbiAgdHlwZSBUZW1wbGF0ZUtleSA9IGtleW9mIHR5cGVvZiBURU1QTEFURV9GSUxFUztcbiAgY29uc3QgdGVtcGxhdGVVcmwgPSAoZmlsZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAvLyBJbnNpZGUgdGhlIGV4dGVuc2lvbiwgdGhlIHNpZGVwYW5lbCBydW5zIGZyb21cbiAgICAvLyBjaHJvbWUtZXh0ZW5zaW9uOi8vPGlkPi9zaWRlcGFuZWwuaHRtbCwgc28gcmVzb3VyY2VzIHJlc29sdmUgdmlhXG4gICAgLy8gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMLiBUaGUgUGxheXdyaWdodCBzdGF0aWMtc2VydmVyIHRlc3RzIHNlcnZlXG4gICAgLy8gYC90ZW1wbGF0ZXMvPGZpbGU+YCBmcm9tIHRoZSBleHRlbnNpb24gcm9vdCBkaXJlY3RseSwgc28gYVxuICAgIC8vIHJlbGF0aXZlIFVSTCB3b3JrcyB0aGVyZSBhcyBhIGZhbGxiYWNrLlxuICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0VVJMKSB7XG4gICAgICByZXR1cm4gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKGB0ZW1wbGF0ZXMvJHtmaWxlfWApO1xuICAgIH1cbiAgICByZXR1cm4gYHRlbXBsYXRlcy8ke2ZpbGV9YDtcbiAgfTtcbiAgY29uc3QgbG9hZFRlbXBsYXRlID0gYXN5bmMgKGtleTogVGVtcGxhdGVLZXkpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmICghVEVNUExBVEVTX1BSRVNFTlRba2V5XSkgcmV0dXJuICcnO1xuICAgIGNvbnN0IGZpbGUgPSBURU1QTEFURV9GSUxFU1trZXldO1xuICAgIGNvbnN0IGNhY2hlZCA9IHRlbXBsYXRlQ2FjaGUuZ2V0KGZpbGUpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godGVtcGxhdGVVcmwoZmlsZSkpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgc3RhdHVzICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgdGV4dCk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csIGB0ZW1wbGF0ZSBmZXRjaCBmYWlsZWQ6ICR7ZmlsZX1gLCBlcnIpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgJycpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfTtcbiAgLy8gRWZmZWN0aXZlIGNvbnRlbnQgdXNlZCBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIGFuZCB0aGUgbW9kYWwuIFdoZW4gdGhlXG4gIC8vIHVzZXIgaGFzIGN1c3RvbWl6ZWQgdmlhIHRoZSB0ZXh0YXJlYS91cGxvYWQsIHRoYXQgd2luczsgb3RoZXJ3aXNlIHRoZVxuICAvLyBQTEFJTiBTVE9DSyB0ZW1wbGF0ZS4gVGhlIG9sZCBgbG9jYWwuKmAgZGV2LW92ZXJyaWRlIHByZWZlcmVuY2UgaXNcbiAgLy8gZ29uZSAob3BlcmF0b3IgcnVsaW5nIDIwMjYtMDctMTEpOiBpdCBzaWxlbnRseSBzdWJzdGl0dXRlZCB0aGVcbiAgLy8gZGV2ZWxvcGVyJ3Mgb3duIGJyYW5kIGZpbGVzIGFzIHRoZSBcImRlZmF1bHRcIiwgY29udGFtaW5hdGluZyBleHBvcnRzXG4gIC8vIHRoYXQgdGhlIG1hbmlmZXN0IHN0aWxsIGZsYWdnZWQgYXMgYnVuZGxlZC1kZWZhdWx0IGNvbnRlbnQuXG4gIGNvbnN0IHJlc29sdmVEZXNpZ25Db250ZW50ID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgaWYgKHByZWZzLmRlc2lnbk1kICYmIHByZWZzLmRlc2lnbk1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLmRlc2lnbk1kO1xuICAgIHJldHVybiBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJyk7XG4gIH07XG4gIGNvbnN0IHJlc29sdmVTa2lsbENvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuc2tpbGxNZCAmJiBwcmVmcy5za2lsbE1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLnNraWxsTWQ7XG4gICAgcmV0dXJuIGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpO1xuICB9O1xuICAvLyBUcnVlIHdoZW4gdGhlIHVzZXIgaGFzbid0IGN1c3RvbWl6ZWQg4oaSIHByZWZzLntkZXNpZ25NZHxza2lsbE1kfSBpc1xuICAvLyBlbXB0eSBhbmQgd2UncmUgZmFsbGluZyBiYWNrIHRvIGEgYnVuZGxlZCB0ZW1wbGF0ZS9sb2NhbCByZXNvdXJjZS5cbiAgY29uc3QgaXNVc2luZ1RlbXBsYXRlRGVzaWduID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLmRlc2lnbk1kIHx8ICFwcmVmcy5kZXNpZ25NZC50cmltKCk7XG4gIGNvbnN0IGlzVXNpbmdUZW1wbGF0ZVNraWxsID0gKCk6IGJvb2xlYW4gPT4gIXByZWZzLnNraWxsTWQgfHwgIXByZWZzLnNraWxsTWQudHJpbSgpO1xuXG4gIC8vIFZlbmRvcmVkIHRoaXJkLXBhcnR5IHNraWxsIHJlc291cmNlcyAoaW1wZWNjYWJsZSByZWZlcmVuY2Ugc2V0ICtcbiAgLy8gcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24pLCBzaGlwcGVkIHVuZGVyIGV4dGVuc2lvbi9za2lsbHMvIGJ5IHRoZSBidWlsZFxuICAvLyBhbmQgaW5saW5lZCBpbnRvIGJ1bmRsZSBleHBvcnRzLiBTYW1lIGxhenkgZmV0Y2ggKyBjYWNoZSBwYXR0ZXJuIGFzIHRoZVxuICAvLyB0ZW1wbGF0ZXMgYWJvdmUuXG4gIGNvbnN0IGJ1bmRsZWRTa2lsbENhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgbG9hZEJ1bmRsZWRTa2lsbEZpbGUgPSBhc3luYyAoZXh0UGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiA9PiB7XG4gICAgY29uc3QgY2FjaGVkID0gYnVuZGxlZFNraWxsQ2FjaGUuZ2V0KGV4dFBhdGgpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdXJsID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldFVSTCA/IGNocm9tZS5ydW50aW1lLmdldFVSTChleHRQYXRoKSA6IGV4dFBhdGg7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgc3RhdHVzICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgYnVuZGxlZFNraWxsQ2FjaGUuc2V0KGV4dFBhdGgsIHRleHQpO1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCBgYnVuZGxlZCBza2lsbCBmZXRjaCBmYWlsZWQ6ICR7ZXh0UGF0aH1gLCBlcnIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdG9yYWdlIGFkYXB0ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IFN0b3JlID0ge1xuICAgIGFzeW5jIGdldDxUPihrZXk6IHN0cmluZywgZmFsbGJhY2s6IFQpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgY29uc3QgbyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXkpOyByZXR1cm4gKG9ba2V5XSBhcyBUKSA/PyBmYWxsYmFjazsgfVxuICAgICAgICBjYXRjaCB7IHJldHVybiBmYWxsYmFjazsgfVxuICAgICAgfVxuICAgICAgdHJ5IHsgY29uc3QgciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7IHJldHVybiByID09PSBudWxsID8gZmFsbGJhY2sgOiAoSlNPTi5wYXJzZShyKSBhcyBUKTsgfVxuICAgICAgY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbiAgICB9LFxuICAgIGFzeW5jIHNldChrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUuc3RvcmFnZT8ubG9jYWwpIHtcbiAgICAgICAgdHJ5IHsgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtba2V5XTogdmFsdWV9KTsgcmV0dXJuOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICAgIH1cbiAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSxcbiAgfTtcblxuICAvLyDilIDilIDilIAgRE9NIHJlZnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0ICQgPSA8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oczogc3RyaW5nKTogVCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHMpIGFzIFQ7XG4gIGNvbnN0IGxpc3QgPSAkKCdbZGF0YS1saXN0XScpO1xuICBjb25zdCBjb21wb3NlciA9ICQ8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLWNvbXBvc2VyXScpO1xuICBjb25zdCBzdGF0dXMgPSAkKCdbZGF0YS1zdGF0dXNdJyk7XG4gIGNvbnN0IHNlYXJjaCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNlYXJjaF0nKTtcbiAgLy8gQ3RybCtGIHZpc3VhbC1maW5kIGJhciAoZGlzdGluY3QgZnJvbSB0aGUgaGVhZGVyIHNlYXJjaCwgd2hpY2ggb3BlbnMgdGhlXG4gIC8vIGNvbW1hbmQgcGFsZXR0ZSkuIE1heSBiZSBhYnNlbnQgaW4gdmVyeSBvbGQgY2FjaGVkIG1hcmt1cCwgc28gY29uc3VtZXJzXG4gIC8vIG51bGwtZ3VhcmQuXG4gIGNvbnN0IGZpbmRCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZmluZC1iYXJdJyk7XG4gIGNvbnN0IGZpbmRJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLWZpbmRdJyk7XG4gIGNvbnN0IGZpbmRDb3VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1maW5kLWNvdW50XScpO1xuICAvLyBDYW5vbmljYWxpemUga2V5Ym9hcmQtc2hvcnRjdXQgcGlsbHMgcGVyIHBsYXRmb3JtLiBFdmVyeSBzaG9ydGN1dCBwaWxsXG4gIC8vIGlzIGF1dGhvcmVkIGluIHRoZSBjYW5vbmljYWwgQ21kLWZvcm0gKGVhY2ggdG9rZW4gY2FwaXRhbGl6ZWQsIGpvaW5lZFxuICAvLyB3aXRoICcrJzogQWx0K0NsaWNrLCBDbWQrSywgQ21kK1NoaWZ0K1opOyBvbiBub24tTWFjIHdlIHN3YXAgdGhlIGxlYWRpbmdcbiAgLy8gQ21kIG1vZGlmaWVyIGZvciBDdHJsLiBQaWxscyBvcHQgaW4gdmlhIGRhdGEtbW9kLSogc28gYSBzdHJpbmcgbGlrZSB0aGVcbiAgLy8gJ0FsdCvigKYnIHBpbGxzICh3aGljaCBuZXZlciBjYXJyeSBDbWQpIGFyZSBsZWZ0IHVudG91Y2hlZC5cbiAgY29uc3QgaXNNYWMgPSAvTWFjfGlQaG9uZXxpUGFkL2kudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0gfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJyk7XG4gIGlmICghaXNNYWMpIHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdrYmRbZGF0YS1tb2Qta10sIGtiZFtkYXRhLW1vZC16XSwga2JkW2RhdGEtbW9kLXNoaWZ0LXpdJykpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gKGVsLnRleHRDb250ZW50ID8/ICcnKS5yZXBsYWNlKC9eQ21kXFxiLywgJ0N0cmwnKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaW1wb3J0RmlsZSA9ICQ8SFRNTElucHV0RWxlbWVudD4oJyNpbXBvcnQtZmlsZScpO1xuICBjb25zdCBzdGF0c0VsID0gJCgnW2RhdGEtc3RhdHNdJyk7XG4gIGNvbnN0IHN0YXJzRWwgPSAkKCdbZGF0YS1zdGFyc10nKTtcbiAgY29uc3QgdG9vbHRpcEVsID0gJCgnW2RhdGEtdG9vbHRpcF0nKTtcbiAgY29uc3QgZHJpbGxkb3duRWwgPSAkKCdbZGF0YS1kcmlsbGRvd25dJyk7XG4gIGNvbnN0IGRyYXdlciA9ICQoJ1tkYXRhLWRyYXdlcl0nKTtcbiAgY29uc3QgcGFsZXR0ZSA9ICQoJ1tkYXRhLXBhbGV0dGVdJyk7XG4gIGNvbnN0IHBhbGV0dGVJbnB1dCA9ICQ8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXBhbGV0dGUtaW5wdXRdJyk7XG4gIGNvbnN0IHBhbGV0dGVMaXN0ID0gJCgnW2RhdGEtcGFsZXR0ZS1saXN0XScpO1xuICBjb25zdCBjb21wV29yZHMgPSAkKCdbZGF0YS1jb21wLXdvcmRzXScpO1xuICBjb25zdCBjb21wVG9rZW5zID0gJCgnW2RhdGEtY29tcC10b2tlbnNdJyk7XG4gIGNvbnN0IHN0YXRUb2tlbnMgPSAkKCdbZGF0YS1zdGF0LXRva2Vuc10nKTtcbiAgY29uc3Qgc3RhdFdvcmRzID0gJCgnW2RhdGEtc3RhdC13b3Jkc10nKTtcbiAgY29uc3Qgd3NTZWxlY3QgPSAkPEhUTUxTZWxlY3RFbGVtZW50PignW2RhdGEtd29ya3NwYWNlXScpO1xuICBjb25zdCB3c0xpc3QgPSAkKCdbZGF0YS13cy1saXN0XScpO1xuICBjb25zdCB3c05hbWUgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS13cy1uYW1lXScpO1xuXG4gIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdDogUGFyZW50Tm9kZSA9IGRvY3VtZW50KTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBlbCBvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1pY29uXScpKSB7XG4gICAgICBjb25zdCBuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWljb24nKTtcbiAgICAgIGNvbnN0IHNpemUgPSBOdW1iZXIoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXNpemUnKSA/PyAxNik7XG4gICAgICBpZiAobmFtZSAmJiBQR19JQ09OUy5oYXMobmFtZSkpIGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhuYW1lLCBzaXplKTtcbiAgICB9XG4gIH07XG4gIG1vdW50SWNvbnMoKTtcblxuICAvLyDilIDilIDilIAgU3RhdGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIHR5cGUgUHJlZnMgPSB7XG4gICAgaW5jbHVkZU91dGVySFRNTDogYm9vbGVhbjtcbiAgICBpbmNsdWRlTWF0Y2hlZFJ1bGVzOiBib29sZWFuO1xuICAgIGluY2x1ZGVTdHlsZXM6IGJvb2xlYW47XG4gICAgbWluaWZ5OiBib29sZWFuO1xuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IGJvb2xlYW47XG4gICAgdXNlU2NyZWVuc2hvdHM6IGJvb2xlYW47XG4gICAgc3BhY2luZ092ZXJsYXk6IGJvb2xlYW47XG4gICAgaG92ZXJTbmFwOiBib29sZWFuO1xuICAgIGF1dG9TY3JlZW5zaG90OiBib29sZWFuO1xuICAgIC8vIENvbW1hLXNlcGFyYXRlZCBob3N0IHBhdHRlcm5zIChzdWJzdHJpbmcgbWF0Y2gpLiBIb3N0cyBpbiB0aGlzIGxpc3RcbiAgICAvLyBza2lwIHRoZSBlbnRpcmUgc2NyZWVuc2hvdCBwaXBlbGluZSDigJQgdXNlZnVsIGZvciBzZW5zaXRpdmUgcGFnZXNcbiAgICAvLyAoYmFua2luZywgaW50ZXJuYWwgYWRtaW4pIHdoZXJlIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCBQTkdzIGxhbmRpbmdcbiAgICAvLyBvbiBkaXNrLlxuICAgIHNraXBTY3JlZW5zaG90SG9zdHM6IHN0cmluZztcbiAgICAvLyBJbmxpbmUgREVTSUdOLm1kIGNvbnRlbnQgdGhlIHVzZXIgcGFzdGVkIG9yIHVwbG9hZGVkIHZpYSB0aGUgc2lkZVxuICAgIC8vIHBhbmVsIHNldHRpbmdzLiBEZWZhdWx0cyB0byBhIHRlbXBsYXRlZCBwbGFjZWhvbGRlciBzbyBvdXQtb2YtdGhlLVxuICAgIC8vIGJveCBleHBvcnRzIGFsd2F5cyBpbmNsdWRlIGEgREVTSUdOLm1kIOKAlCB0aGUgY29uc3VtZXIgTExNIGNhblxuICAgIC8vIGVpdGhlciB3b3JrIGZyb20gdGhlIHBsYWNlaG9sZGVyIChhbmQgYXNrIGZvciB0aGUgcmVhbCBvbmUpIG9yXG4gICAgLy8gZnJvbSBhIHVzZXItY3VzdG9taXplZCBjb3B5LiBUaGUgc2V0dGluZ3MgVUkgZmxhZ3MgdGhpcyBiYW5uZXItXG4gICAgLy8gc3R5bGUgd2hlbiB0aGUgdmFsdWUgc3RpbGwgbWF0Y2hlcyB0aGUgdGVtcGxhdGUgc28gdGhlIHVzZXJcbiAgICAvLyBrbm93cyB0byBmaWxsIGl0IGluLlxuICAgIGRlc2lnbk1kOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCB0aGUgcmVjZWl2ZXIgc2hvdWxkIHJlYWQgREVTSUdOLm1kIGZyb20uIERlZmF1bHRzXG4gICAgLy8gdG8gYH4vLmFnZW50cy9ERVNJR04ubWRgOyB1c2VyIGNhbiBvdmVycmlkZSBwZXItbWFjaGluZS5cbiAgICBkZXNpZ25QYXRoOiBzdHJpbmc7XG4gICAgLy8gUmVzb2x2ZWQgcGF0aCBvZiB0aGUgUGluY2hHcmFiIFVJIHNraWxsIG9uIHRoZSByZWNlaXZlcidzXG4gICAgLy8gZmlsZXN5c3RlbS4gVGhlIHNraWxsIGNvbnRlbnQgaXRzZWxmIGlzIGJ1bmRsZWQgaW5saW5lIGludG8gdGhlXG4gICAgLy8gYXJjaGl2ZSAoc2VlIGBza2lsbE1kYCksIHNvIHRoaXMgaXMgYSBoaW50IGZvciByZWNlaXZlcnMgdGhhdFxuICAgIC8vIHdhbnQgdG8gcGVyc2lzdCB0aGUgc2tpbGwgYXQgYSBjYW5vbmljYWwgbG9jYXRpb24uXG4gICAgc2tpbGxQYXRoOiBzdHJpbmc7XG4gICAgLy8gSW5saW5lIFVJLXNraWxsIGNvbnRlbnQuIERlZmF1bHQgaXMgdGhlIGJ1bmRsZWQgUGluY2hHcmFiIHRyaWFnZVxuICAgIC8vIHNraWxsIHRlbXBsYXRlOyB1c2VyIGNhbiBjdXN0b21pemUgdmlhIHNldHRpbmdzIHBhc3RlL3VwbG9hZC5cbiAgICAvLyBCdW5kbGVkIGludG8gdGhlIGFyY2hpdmUgYXQgYC4vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYC5cbiAgICBza2lsbE1kOiBzdHJpbmc7XG4gICAgLy8gV2hlbiB0cnVlLCBmaXJlIGEgZnJlc2ggcGFnZSBzY3JlZW5zaG90IG9uIEVWRVJZIGNhcHR1cmUgcmF0aGVyXG4gICAgLy8gdGhhbiBvbmNlIHBlciAod29ya3NwYWNlLCB1cmwpIHR1cGxlLiBVc2VmdWwgZm9yIGNhcHR1cmluZyBhXG4gICAgLy8gbXVsdGktc3RlcCBmbG93IHdoZXJlIHRoZSBwYWdlIHN0YXRlIGNoYW5nZXMgYmV0d2VlbiBjYXB0dXJlcy5cbiAgICAvLyBEZWZhdWx0IGZhbHNlIOKAlCBtb3N0IHVzZXJzIHdhbnQgdGhlIGRlZmF1bHQgZmlyc3Qtb25seSBiZWhhdmlvclxuICAgIC8vIHNpbmNlIHBhZ2Ugc2NyZWVuc2hvdHMgYXJlIGxhcmdlIGFuZCB0aGUgZmlyc3Qgb25lIGFscmVhZHkgZ2l2ZXNcbiAgICAvLyBhIHNlc3Npb24tbGV2ZWwgcmVmZXJlbmNlLlxuICAgIHBhZ2VTaG90UGVyQ2FwdHVyZTogYm9vbGVhbjtcbiAgICAvLyBTdXBwcmVzcyBDaHJvbWUncyBkb3dubG9hZCBidWJibGUgd2hpbGUgUGluY2hHcmFiIHdyaXRlcyBpdHMgb3duXG4gICAgLy8gZmlsZXMgKHNjcmVlbnNob3RzICsgZXhwb3J0cykuIFJlcXVpcmVzIHRoZSBvcHRpb25hbCBgZG93bmxvYWRzLnVpYFxuICAgIC8vIHBlcm1pc3Npb24uIERlZmF1bHQgT04gYXMgaW50ZW50OyB1bnRpbCB0aGUgcGVybWlzc2lvbiBpcyBhY3R1YWxseVxuICAgIC8vIGdyYW50ZWQgKG5lZWRzIGEgdXNlciBnZXN0dXJlIOKAlCB0aGUgbnVkZ2UgYmFubmVyIG9yIHRoZSBzZXR0aW5nc1xuICAgIC8vIGNoZWNrYm94KSwgc2F2ZXMgc3RheSB2aXNpYmxlLlxuICAgIHF1aWV0U2F2ZXM6IGJvb2xlYW47XG4gICAgLy8gVGhlIHVzZXIgZGlzbWlzc2VkIHRoZSBxdWlldC1zYXZlcyBudWRnZSBiYW5uZXIg4oCUIG5ldmVyIHJlLXNob3cgaXQuXG4gICAgcXVpZXROdWRnZURpc21pc3NlZDogYm9vbGVhbjtcbiAgICAvLyBDb250aW51b3VzbHkgbWlycm9yIHRoZSB3b3Jrc3BhY2UgSlNPTkwgdG8gZGlzayAoYmVzaWRlIHNjcmVlbnNob3RzKVxuICAgIC8vIHNvIGNhcHR1cmVzICsgY29tbWVudHMgc3Vydml2ZSBhIHN0b3JhZ2UgY2xlYXIgLyBleHRlbnNpb24gcmVpbnN0YWxsLlxuICAgIC8vIE9uIGJ5IGRlZmF1bHQg4oCUIHRoaXMgaXMgdGhlIHNhZmV0eSBuZXQgYWdhaW5zdCBzaWxlbnQgYW5ub3RhdGlvbiBsb3NzLlxuICAgIGF1dG9zYXZlVG9EaXNrOiBib29sZWFuO1xuICAgIC8vIEJ1bmRsZSB0aGUgdmVuZG9yZWQgdGhpcmQtcGFydHkgZGVzaWduIHNraWxscyAoaW1wZWNjYWJsZSByZWZlcmVuY2VcbiAgICAvLyBzZXQgKyBwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbikgcGx1cyBza2lsbHMtaW5kZXguanNvbiBpbnRvIGFyY2hpdmVcbiAgICAvLyBleHBvcnRzLiBPbiBieSBkZWZhdWx0OiB0aGUgU2VuZC10by1BZ2VudCBwcm90b2NvbCdzIHNraWxsLW1hcHBpbmdcbiAgICAvLyBwaGFzZSBhc3N1bWVzIHRoZWlyIHByZXNlbmNlLiB+MS4yIE1CIG9mIG1hcmtkb3duIHBlciBidW5kbGUuXG4gICAgYnVuZGxlU2tpbGxzOiBib29sZWFuO1xuICAgIC8vIEJ1bmRsZSB0aGUgZnVsbCBzZXJpYWxpemVkIEhUTUwgb2YgZWFjaCBjYXB0dXJlZCBwYWdlIHVuZGVyIHBhZ2VzLy5cbiAgICAvLyBPZmYgYnkgZGVmYXVsdCAoZG9jdW1lbnRzIGNhbiBiZSBodWdlKTsgY29sbGVjdGVkIGxhemlseSBhdCBleHBvcnRcbiAgICAvLyB0aW1lIGZyb20gbGl2ZSB0YWJzLCBuZXZlciBwZXJzaXN0ZWQgdG8gY2hyb21lLnN0b3JhZ2UuXG4gICAgaW5jbHVkZVBhZ2VIVE1MOiBib29sZWFuO1xuICB9O1xuICBjb25zdCBERUZBVUxUX1BSRUZTOiBQcmVmcyA9IHtcbiAgICBpbmNsdWRlT3V0ZXJIVE1MOiB0cnVlLFxuICAgIGluY2x1ZGVNYXRjaGVkUnVsZXM6IHRydWUsXG4gICAgaW5jbHVkZVN0eWxlczogdHJ1ZSxcbiAgICAvLyBEZWZhdWx0IHRvIG1pbmlmaWVkIGV4cG9ydHMg4oCUIG1vc3QgYWdlbnRzIHdhbnQgdGhlIHNtYWxsZXN0XG4gICAgLy8gdG9rZW4tZm9vdHByaW50IHBheWxvYWQuIEV4aXN0aW5nIHVzZXJzJyBzYXZlZCBwcmVmcyBhcmUgbWVyZ2VkIG92ZXJcbiAgICAvLyB0aGlzIGRlZmF1bHQgaW4gbG9hZEFsbCgpLCBzbyBvbmx5IE5FVy91bnNldCBpbnN0YWxscyBzZWUgdGhlIGZsaXAuXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIGF1dG9TY3JvbGxUb0hvdmVyZWQ6IHRydWUsXG4gICAgdXNlU2NyZWVuc2hvdHM6IHRydWUsXG4gICAgc3BhY2luZ092ZXJsYXk6IGZhbHNlLFxuICAgIGhvdmVyU25hcDogdHJ1ZSxcbiAgICBhdXRvU2NyZWVuc2hvdDogdHJ1ZSxcbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiAnJyxcbiAgICAvLyBkZXNpZ25NZCAvIHNraWxsTWQgZGVmYXVsdCB0byAnJyB3aGljaCB0aGUgcmVzb2x2ZXIgdHJlYXRzIGFzXG4gICAgLy8gXCJmYWxsIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUgYXQgZXhwb3J0IHRpbWVcIi4gU3RvcmluZyB0aGVcbiAgICAvLyBlbXB0eSBzdHJpbmcga2VlcHMgY2hyb21lLnN0b3JhZ2Ugc21hbGwgYW5kIGxldHMgYGlzVXNpbmdUZW1wbGF0ZSpgXG4gICAgLy8gYmUgYSBjaGVhcCBzeW5jaHJvbm91cyBjaGVjay5cbiAgICBkZXNpZ25NZDogJycsXG4gICAgZGVzaWduUGF0aDogJ34vLmFnZW50cy9ERVNJR04ubWQnLFxuICAgIHNraWxsUGF0aDogJ34vLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJyxcbiAgICBza2lsbE1kOiAnJyxcbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGZhbHNlLFxuICAgIHF1aWV0U2F2ZXM6IHRydWUsXG4gICAgcXVpZXROdWRnZURpc21pc3NlZDogZmFsc2UsXG4gICAgYXV0b3NhdmVUb0Rpc2s6IHRydWUsXG4gICAgYnVuZGxlU2tpbGxzOiB0cnVlLFxuICAgIGluY2x1ZGVQYWdlSFRNTDogZmFsc2UsXG4gIH07XG5cbiAgLy8gUmV3cml0ZSB0aGUgYG5hbWU6YCBmaWVsZCBpbiBhIFNLSUxMLm1kJ3MgWUFNTCBmcm9udG1hdHRlci4gVGhlXG4gIC8vIHVzZXIncyBzb3VyY2Utb2YtdHJ1dGggU0tJTEwubWQgaXMgY2F0YWxvZ3VlZCB1bmRlciB3aGF0ZXZlciBuYW1lXG4gIC8vIHRoZWlyIHdpZGVyIGAuYWdlbnRzL3NraWxscy9gIHRyZWUgdXNlcyAob2Z0ZW4gYHVpYCk7IHRoZSBidW5kbGVkXG4gIC8vIGFyY2hpdmUgY29weSBzaG91bGQgYWx3YXlzIGlkZW50aWZ5IGFzIGBQaW5jaEdyYWJgIHNvIGEgZG93bnN0cmVhbVxuICAvLyBMTE0gcmVhZGluZyB0aGUgbWFuaWZlc3QgZG9lc24ndCBnZXQgY29uZnVzZWQgYWJvdXQgd2hpY2ggc2tpbGxcbiAgLy8gZmlsZSBhcHBsaWVzLiBPbmx5IHRoZSBGSVJTVCB0b3Atb2YtZmlsZSBgbmFtZTpgIGxpbmUgd2l0aGluIHRoZVxuICAvLyBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHRvdWNoZWQuXG4gIGNvbnN0IHJlYnJhbmRTa2lsbE5hbWUgPSAobWQ6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAvLyBUaGUgZnJvbnRtYXR0ZXIgYmxvY2ssIGlmIHByZXNlbnQsIGlzIGJldHdlZW4gbGVhZGluZyBgLS0tXFxuYFxuICAgIC8vIGFuZCB0aGUgbmV4dCBgXFxuLS0tXFxuYC4gQW55dGhpbmcgZWxzZSAobm8gZnJvbnRtYXR0ZXIsIG5hbWUgbm90XG4gICAgLy8gb24gYSBzaW5nbGUgbGluZSwgZXRjLikgcmV0dXJucyB1bmNoYW5nZWQg4oCUIGJldHRlciB0byBzaGlwIHRoZVxuICAgIC8vIG9yaWdpbmFsIHRoYW4gcmlzayBjb3JydXB0aW5nIHRoZSBmaWxlLlxuICAgIGNvbnN0IG0gPSBtZC5tYXRjaCgvXi0tLVxccj9cXG4oW1xcc1xcU10qPylcXHI/XFxuLS0tXFxyP1xcbi8pO1xuICAgIGlmICghbSkgcmV0dXJuIG1kO1xuICAgIGNvbnN0IGZtID0gbVsxXSE7XG4gICAgY29uc3QgcmVicmFuZGVkRm0gPSBmbS5yZXBsYWNlKC9ebmFtZTpcXHMqLiskL20sIGBuYW1lOiAke25ld05hbWV9YCk7XG4gICAgaWYgKHJlYnJhbmRlZEZtID09PSBmbSkgcmV0dXJuIG1kOyAvLyBubyBgbmFtZTpgIGZpZWxkOyBub3RoaW5nIHRvIGRvXG4gICAgcmV0dXJuIG1kLnJlcGxhY2UobVswXSwgYC0tLVxcbiR7cmVicmFuZGVkRm19XFxuLS0tXFxuYCk7XG4gIH07XG4gIHR5cGUgV29ya3NwYWNlID0ge25hbWU6IHN0cmluZzsgY3JlYXRlZEF0OiBzdHJpbmc7IHRhYklkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfTtcbiAgLy8gT25lIGFyY2hpdmVkIHN0YXRlIG9mIGEgd29ya3NwYWNlIChjYXB0dXJlZCBqdXN0IGJlZm9yZSBhIENsZWFyLWFsbCkuXG4gIC8vIGBzaG90c2AgaXMgdGhlIHRodW1ibmFpbCBtYXAgKGZ1bGwtcmVzIFBOR3MgYXJlIHNlc3Npb24tb25seSBhbmQgbm90XG4gIC8vIGFyY2hpdmVkKS4gUmVzdG9yYWJsZSBmcm9tIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzLlxuICB0eXBlIFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgdHM6IHN0cmluZztcbiAgICBtZXNzYWdlczogUGFuZWxNZXNzYWdlW107XG4gICAgc2hvdHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgc2VsZWN0b3JzOiBudW1iZXI7XG4gICAgY29tbWVudHM6IG51bWJlcjtcbiAgfTtcblxuICBsZXQgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdID0gW107XG4gIGxldCBsaXZlVGFiVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGxpdmVUYWJQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3Qgc2VsZWN0b3JWYWxpZGl0eSA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuIHwgJ2RpZmYtcGFnZSc+KCk7XG4gIGNvbnN0IHNlbGVjdG9yRXJyb3JzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgaW5zZXJ0QmVmb3JlOiB7Y3VycmVudDogc3RyaW5nIHwgbnVsbDsgY29tbWVudDogYm9vbGVhbn0gPSB7Y3VycmVudDogbnVsbCwgY29tbWVudDogZmFsc2V9O1xuICBsZXQgc2VhcmNoUXVlcnkgPSAnJztcbiAgbGV0IGxhc3RBY3RpdmVTZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBzdGlja3lUaW1lciA9IDA7XG4gIGxldCBTVElDS1lfVFRMX01TID0gNV8wMDA7XG4gIGxldCBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgbGV0IHBoYW50b21UYXJnZXQ6IHtzZWxlY3Rvcjogc3RyaW5nOyBsYWJlbDogc3RyaW5nOyB0YWc/OiBzdHJpbmc7IHJlY3Q/OiBET01SZWN0fSB8IG51bGwgPSBudWxsO1xuICBsZXQgcGVuZGluZ011bHRpOiBFbnRyeVtdID0gW107XG4gIGNvbnN0IHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIHBlciBzZWxlY3Rvci4gTk9UIHBlcnNpc3RlZCB0b1xuICAvLyBjaHJvbWUuc3RvcmFnZSAoY2FwIHByZXNzdXJlIOKAlCAxMDAgY2FwdHVyZXMgw5cgODAgS0IgZWFjaCA9IDggTUIpLCBzb1xuICAvLyBpdCdzIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBzZXNzaW9uJ3MgYXJjaGl2ZSBleHBvcnQuIENsZWFyZWRcbiAgLy8gb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgY29uc3Qgc2hvdHNGdWxsID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgLy8gVHJhY2sgd2hpY2ggKHdvcmtzcGFjZSwgcGFnZS11cmwpIHR1cGxlcyBhbHJlYWR5IGZpcmVkIGEgcGFnZSBzaG90IHNvIHdlXG4gIC8vIGRvbid0IHJlLXNob290IHRoZSBlbnRpcmUgcGFnZSBvbiBldmVyeSBjYXB0dXJlLiBSZXNldCBvbiB3b3Jrc3BhY2VcbiAgLy8gc3dpdGNoIOKAlCBubyBkYXkga2V5LCB0aGUgZGVkdXBlIGlzIHBlci1zZXNzaW9uLlxuICBjb25zdCBwYWdlU2hvdHNGaXJlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBwYWdlU2hvdEtleSA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiBgJHthY3RpdmVXc306JHt1cmx9YDtcbiAgLy8gTGFzdCBzdWNjZXNzZnVsIGV4cG9ydCDigJQgYm90aCB0aGUgd29ya3NwYWNlLXJlbGF0aXZlIHBhdGggKHNob3duIHRvIHRoZVxuICAvLyB1c2VyKSBhbmQgdGhlIE9TLWFic29sdXRlIHBhdGggKGNvcGllZCBieSB0aGUgXCJDb3B5IGFzIHBhdGhcIiBidXR0b24pLlxuICAvLyBVcGRhdGVkIG9uIEpTT05ML01EL1pJUC9zY3JlZW5zaG90IHNhdmVzLlxuICBjb25zdCBsYXN0RXhwb3J0OiB7cmVsUGF0aDogc3RyaW5nIHwgbnVsbDsgYWJzUGF0aDogc3RyaW5nIHwgbnVsbDsgY29weVBhdGg6IHN0cmluZyB8IG51bGw7IHRlbXBQYXRoOiBib29sZWFuOyBraW5kOiBzdHJpbmcgfCBudWxsOyBhZ2VudFByb21wdDogc3RyaW5nIHwgbnVsbH0gPSB7XG4gICAgcmVsUGF0aDogbnVsbCwgYWJzUGF0aDogbnVsbCwgY29weVBhdGg6IG51bGwsIHRlbXBQYXRoOiBmYWxzZSwga2luZDogbnVsbCwgYWdlbnRQcm9tcHQ6IG51bGwsXG4gIH07XG4gIGxldCB3b3Jrc3BhY2VzOiBXb3Jrc3BhY2VbXSA9IFt7bmFtZTogJ2RlZmF1bHQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dO1xuICBsZXQgYWN0aXZlV3MgPSAnZGVmYXVsdCc7XG4gIC8vIFNlc3Npb24gdXVpZCDigJQgZ2VuZXJhdGVkIG9uY2UgcGVyIHdvcmtzcGFjZSBib290LiBHb2VzIG9udG8gZXZlcnlcbiAgLy8gcGFnZSByb3cgYW5kIGV2ZXJ5IHNlbGVjdG9yIGVudHJ5IHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXNcbiAgLy8gdG8gXCJ3aGljaCBzZXNzaW9uP1wiIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLiBTdGFibGUgYWNyb3NzIGFcbiAgLy8gc2luZ2xlIHdvcmtzcGFjZSBsb2FkOyByZXNldHMgb24gd29ya3NwYWNlIHN3aXRjaC5cbiAgbGV0IHNlc3Npb25JZDogc3RyaW5nID0gJyc7XG4gIGNvbnN0IHdzTXNnS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0ubWVzc2FnZXMudjFgO1xuICBjb25zdCB3c1Nob3RzS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0uc2hvdHMudjFgO1xuICAvLyBQZXJzaXN0ZW50IHNuYXBzaG90IGhpc3RvcnkgcGVyIHdvcmtzcGFjZSDigJQgYSBDbGVhci1hbGwgYXJjaGl2ZXMgdGhlIHdpcGVkXG4gIC8vIGNhcHR1cmVzK2NvbW1lbnRzK3RodW1ibmFpbHMgaGVyZSBzbyB0aGV5IGNhbiBiZSByZXN0b3JlZCBsYXRlciBmcm9tXG4gIC8vIFNldHRpbmdzIOKGkiBXb3Jrc3BhY2VzLiBMaXZlcyBpbiB0aGUgc2FtZSBjaHJvbWUuc3RvcmFnZSBsYXllciBhcyB0aGUgcmVzdFxuICAvLyBvZiB0aGUgd29ya3NwYWNlIGRhdGEuXG4gIGNvbnN0IHdzU25hcHNob3RzS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0uc25hcHNob3RzLnYxYDtcbiAgLy8gQ2FwIHNvIHRoZSBoaXN0b3J5IGNhbid0IGJhbGxvb24gc3RvcmFnZTsgb2xkZXN0IHNuYXBzaG90cyBkcm9wIG9mZi5cbiAgY29uc3QgV1NfU05BUFNIT1RfQ0FQID0gMTA7XG4gIGNvbnN0IHdzU2hvdHNGdWxsS2V5ID0gKG46IHN0cmluZyk6IHN0cmluZyA9PiBgcGluY2hncmFiLndzLiR7bn0uc2hvdHNGdWxsLnYxYDtcbiAgLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgaGFzIGEgMTAgTUIgZGVmYXVsdCBxdW90YTsgd2UgYnVkZ2V0IGhhbGYgb2ZcbiAgLy8gdGhhdCBmb3IgZnVsbC1yZXNvbHV0aW9uIFBOR3MgKHRoZSByZXN0IGlzIG1lc3NhZ2VzLCBwcmVmcywgdGh1bWJzKS5cbiAgLy8gV2hlbiB0aGUgYnVkZ2V0IGlzIHJlYWNoZWQgd2UgRklGTy1ldmljdCB0aGUgb2xkZXN0IGVudHJpZXMgKE1hcFxuICAvLyBwcmVzZXJ2ZXMgaW5zZXJ0aW9uIG9yZGVyKS4gRXN0aW1hdGUgZGF0YVVSTCBzaXplID0gc3RyaW5nIGxlbmd0aC5cbiAgY29uc3QgU0hPVFNfRlVMTF9CVURHRVRfQllURVMgPSA1ICogMTAyNCAqIDEwMjQ7XG4gIGNvbnN0IHVuZG9TdGFjazogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgcmVkb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBVTkRPX0NBUCA9IDMwO1xuICBsZXQgc3VzcGVuZFNuYXBzaG90cyA9IGZhbHNlO1xuICBsZXQgcHJlZnM6IFByZWZzID0gey4uLkRFRkFVTFRfUFJFRlN9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0dXMgaGVscGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBsZXQgc3RhdHVzVGltZXIgPSAwO1xuICBjb25zdCBzZXRTdGF0dXMgPSAobXNnOiBzdHJpbmcsIG9wdHM6IHtraW5kPzogJ3dhcm4nIHwgJ2luZm8nIHwgJ29rJ30gPSB7fSk6IHZvaWQgPT4ge1xuICAgIHN0YXR1cy50ZXh0Q29udGVudCA9IG1zZyB8fCAnJztcbiAgICBjbGVhclRpbWVvdXQoc3RhdHVzVGltZXIpO1xuICAgIGlmIChtc2cpIHtcbiAgICAgIHN0YXR1cy5zdHlsZS5jb2xvciA9IG9wdHMua2luZCA9PT0gJ3dhcm4nID8gJ3ZhcigtLXJlZCknIDpcbiAgICAgICAgb3B0cy5raW5kID09PSAnaW5mbycgPyAndmFyKC0tdGV4dC0zKScgOiAndmFyKC0tZ3JlZW4pJztcbiAgICAgIHN0YXR1c1RpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyBzdGF0dXMudGV4dENvbnRlbnQgPSAnJzsgfSwgMjIwMCk7XG4gICAgfVxuICB9O1xuICBsZXQgdG9hc3RUaW1lciA9IDA7XG4gIGNvbnN0IHNob3dUb2FzdCA9ICh0aXRsZTogc3RyaW5nLCBkZXRhaWwgPSAnJywga2luZDogJ29rJyB8ICd3YXJuJyA9ICdvaycpOiB2b2lkID0+IHtcbiAgICBsZXQgdG9hc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtY29weS10b2FzdF0nKTtcbiAgICBpZiAoIXRvYXN0KSB7XG4gICAgICB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdG9hc3QuY2xhc3NOYW1lID0gJ2NvcHktdG9hc3QnO1xuICAgICAgdG9hc3QuZGF0YXNldC5jb3B5VG9hc3QgPSAndHJ1ZSc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZCh0b2FzdCk7XG4gICAgfVxuICAgIHRvYXN0LmNsYXNzTGlzdC50b2dnbGUoJ3dhcm4nLCBraW5kID09PSAnd2FybicpO1xuICAgIHRvYXN0LmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cImNvcHktdG9hc3QtaWNvblwiPiR7UEdfSUNPTlMuc3ZnU3RyaW5nKGtpbmQgPT09ICd3YXJuJyA/ICdhbGVydC1jaXJjbGUnIDogJ2NpcmNsZS1jaGVjaycsIDIyKX08L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNvcHktdG9hc3QtdGV4dFwiPjxiPiR7ZXNjYXBlSHRtbCh0aXRsZSl9PC9iPiR7ZGV0YWlsID8gYDxzbWFsbD4ke2VzY2FwZUh0bWwoZGV0YWlsKX08L3NtYWxsPmAgOiAnJ308L3NwYW4+YDtcbiAgICB0b2FzdC5oaWRkZW4gPSBmYWxzZTtcbiAgICB0b2FzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgdm9pZCB0b2FzdC5vZmZzZXRXaWR0aDtcbiAgICB0b2FzdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgY2xlYXJUaW1lb3V0KHRvYXN0VGltZXIpO1xuICAgIHRvYXN0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0b2FzdD8uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyBpZiAodG9hc3QpIHRvYXN0LmhpZGRlbiA9IHRydWU7IH0sIDE4MCk7XG4gICAgfSwgMTQ1MCk7XG4gIH07XG4gIGNvbnN0IHNob3dDb3BpZWQgPSAobGFiZWw6IHN0cmluZywgZGV0YWlsID0gJycpOiB2b2lkID0+IHNob3dUb2FzdChsYWJlbCwgZGV0YWlsLCAnb2snKTtcbiAgY29uc3Qgc2hvd0Rvd25sb2FkRXJyb3IgPSAobGFiZWw6IHN0cmluZywgZGV0YWlsOiBzdHJpbmcpOiB2b2lkID0+IHNob3dUb2FzdChsYWJlbCwgZGV0YWlsLCAnd2FybicpO1xuXG4gIC8vIOKUgOKUgOKUgCBVdGlsaXRpZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBmYWxsYmFja0lkQ291bnRlciA9IDA7XG4gIGNvbnN0IHNlY3VyZVRva2VuID0gKGJ5dGVzID0gMTIpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG4gICAgICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMocmF3KTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHJhdykubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBgJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX1fJHsoKytmYWxsYmFja0lkQ291bnRlcikudG9TdHJpbmcoMzYpfWA7XG4gICAgfVxuICB9O1xuICBjb25zdCBtc2dJZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7IGlmIChnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKSByZXR1cm4gZ2xvYmFsVGhpcy5jcnlwdG8ucmFuZG9tVVVJRCgpOyB9IGNhdGNoIHsgLyogZmFsbCB0aHJvdWdoICovIH1cbiAgICByZXR1cm4gYGlkXyR7c2VjdXJlVG9rZW4oMTYpfWA7XG4gIH07XG4gIGNvbnN0IGVzY2FwZUh0bWwgPSAoczogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgU3RyaW5nKHMpLnJlcGxhY2VBbGwoJyYnLCAnJmFtcDsnKS5yZXBsYWNlQWxsKCc8JywgJyZsdDsnKS5yZXBsYWNlQWxsKCc+JywgJyZndDsnKTtcbiAgY29uc3QgZXNjYXBlUmUgPSAoczogc3RyaW5nKTogc3RyaW5nID0+IHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbiAgY29uc3QgaGlnaGxpZ2h0TWF0Y2ggPSAodGV4dDogc3RyaW5nLCBxOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghcSkgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCk7XG4gICAgcmV0dXJuIGVzY2FwZUh0bWwodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKGAoJHtlc2NhcGVSZShxKX0pYCwgJ2dpJyksICc8bWFyaz4kMTwvbWFyaz4nKTtcbiAgfTtcbiAgLy8gV2FsayB0ZXh0IG5vZGVzIGluc2lkZSBgcm9vdGAsIHdyYXBwaW5nIGNhc2UtaW5zZW5zaXRpdmUgbWF0Y2hlcyBvZiBgcWBcbiAgLy8gaW4gPG1hcms+IGVsZW1lbnRzLiBEb2Vzbid0IHRvdWNoIGF0dHJpYnV0ZSBzdHJpbmdzIG9yIGlubmVyLXRhZyBIVE1MIHNvXG4gIC8vIGl0J3Mgc2FmZSB0byBydW4gb24gYWxyZWFkeS1oaWdobGlnaHRlZCBKU09OIG91dHB1dC5cbiAgY29uc3Qgd3JhcFNlYXJjaEhpdHNJblRleHROb2RlcyA9IChyb290OiBIVE1MRWxlbWVudCwgcTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm47XG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKGVzY2FwZVJlKHEpLCAnZ2knKTtcbiAgICBjb25zdCB3YWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKHJvb3QsIE5vZGVGaWx0ZXIuU0hPV19URVhUKTtcbiAgICBjb25zdCB0YXJnZXRzOiBUZXh0W10gPSBbXTtcbiAgICBsZXQgbm9kZTogTm9kZSB8IG51bGw7XG4gICAgd2hpbGUgKChub2RlID0gd2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICBpZiAocmUudGVzdChub2RlLm5vZGVWYWx1ZSA/PyAnJykpIHRhcmdldHMucHVzaChub2RlIGFzIFRleHQpO1xuICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9XG4gICAgZm9yIChjb25zdCB0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdC5ub2RlVmFsdWUgPz8gJyc7XG4gICAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgbGV0IGxhc3QgPSAwO1xuICAgICAgZm9yIChjb25zdCBtIG9mIHZhbHVlLm1hdGNoQWxsKHJlKSkge1xuICAgICAgICBjb25zdCBpID0gbS5pbmRleCA/PyAwO1xuICAgICAgICBpZiAoaSA+IGxhc3QpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QsIGkpKTtcbiAgICAgICAgY29uc3QgbWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYXJrJyk7XG4gICAgICAgIG1rLnRleHRDb250ZW50ID0gbVswXTtcbiAgICAgICAgZnJhZy5hcHBlbmQobWspO1xuICAgICAgICBsYXN0ID0gaSArIG1bMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGxhc3QgPCB2YWx1ZS5sZW5ndGgpIGZyYWcuYXBwZW5kKHZhbHVlLnNsaWNlKGxhc3QpKTtcbiAgICAgIHQucmVwbGFjZVdpdGgoZnJhZyk7XG4gICAgfVxuICB9O1xuICBjb25zdCB3b3JkQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IChzLm1hdGNoKC9cXFMrL2cpID8/IFtdKS5sZW5ndGg7XG4gIGNvbnN0IHRva2VuQ291bnQgPSAoczogc3RyaW5nKTogbnVtYmVyID0+IE1hdGguY2VpbChzLmxlbmd0aCAvIDQpO1xuICBjb25zdCBwYXRoT2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkucGF0aG5hbWU7IH0gY2F0Y2ggeyByZXR1cm4gdTsgfSB9O1xuICBjb25zdCBob3N0T2YgPSAodTogc3RyaW5nKTogc3RyaW5nID0+IHsgdHJ5IHsgcmV0dXJuIG5ldyBVUkwodSkuaG9zdDsgfSBjYXRjaCB7IHJldHVybiAnJzsgfSB9O1xuICAvLyBGaWxlbmFtZS1zYWZlIGhvc3Qgc2x1ZzogZG90cyDihpIgdW5kZXJzY29yZXMgcGVyIHByb2plY3QgY29udmVudGlvbi5cbiAgLy8gTWlycm9ycyBiYWNrZ3JvdW5kLnRzIGhvc3RTbHVnIGZvciBzeW1tZXRyeSBhY3Jvc3Mgc2NyZWVuc2hvdCArIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMuXG4gIGNvbnN0IGhvc3RTbHVnID0gKHVybDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBoID0gaG9zdE9mKHVybCk7XG4gICAgaWYgKCFoKSByZXR1cm4gJ3Vua25vd24nO1xuICAgIHJldHVybiBoLnJlcGxhY2UoL1xcLi9nLCAnXycpLnJlcGxhY2UoL1teXFx3LV0vZywgJ18nKS5zbGljZSgwLCA0MCkgfHwgJ3Vua25vd24nO1xuICB9O1xuICAvLyBQaWNrIHRoZSBtb3N0LWZyZXF1ZW50IGhvc3QgYWNyb3NzIGFsbCBzZWxlY3RvciBjYXB0dXJlcyAoZm9yIGV4cG9ydFxuICAvLyBmaWxlbmFtZXMpLiBXaGVuIHRoZSB3b3Jrc3BhY2Ugc3BhbnMgbXVsdGlwbGUgaG9zdHMsIHJldHVybiAnbXVsdGknLlxuICBjb25zdCBkb21pbmFudEhvc3RTbHVnID0gKCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgY291bnRzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RTbHVnKG0uZW50cnkudXJsKTtcbiAgICAgIGNvdW50cy5zZXQoaCwgKGNvdW50cy5nZXQoaCkgPz8gMCkgKyAxKTtcbiAgICB9XG4gICAgaWYgKCFjb3VudHMuc2l6ZSkgcmV0dXJuICdlbXB0eSc7XG4gICAgbGV0IGJlc3QgPSAnJztcbiAgICBsZXQgYmVzdE4gPSAwO1xuICAgIGZvciAoY29uc3QgW2gsIG5dIG9mIGNvdW50cykge1xuICAgICAgaWYgKG4gPiBiZXN0TikgeyBiZXN0ID0gaDsgYmVzdE4gPSBuOyB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudHMuc2l6ZSA+IDEgPyAnbXVsdGknIDogYmVzdDtcbiAgfTtcbiAgLy8gRGlzdGluY3QgaG9zdHMgcHJlc2VudCBpbiB0aGlzIHdvcmtzcGFjZSAoYWxwaGFiZXRpY2FsLCBjYXBwZWQpLiBVc2VkIGluXG4gIC8vIHRoZSBleHBvcnQgbWFuaWZlc3QncyBgaG9zdHNgIGZpZWxkLlxuICBjb25zdCBkaXN0aW5jdEhvc3RzID0gKCk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCBzZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaCA9IGhvc3RPZihtLmVudHJ5LnVybCk7XG4gICAgICBpZiAoaCkgc2V0LmFkZChoKTtcbiAgICB9XG4gICAgcmV0dXJuIFsuLi5zZXRdLnNvcnQoKS5zbGljZSgwLCAyMCk7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEZXRlcm1pbmlzdGljIGV4cG9ydCBpZGVudGl0eSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gT25lIGNsb2NrIHBlciBleHBvcnQ6IGV2ZXJ5IHRpbWVzdGFtcCBpbnNpZGUgYSBzaW5nbGUgZXhwb3J0IGRlcml2ZXNcbiAgLy8gZnJvbSB0aGUgc2FtZSBpbnN0YW50LCBhbmQgdGVzdHMgY2FuIGZyZWV6ZSBpdCBzbyB0d28gZXhwb3J0cyBvZiB0aGVcbiAgLy8gc2FtZSBjb250ZW50IGFyZSBieXRlLWlkZW50aWNhbC5cbiAgbGV0IGV4cG9ydENsb2NrT3ZlcnJpZGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBleHBvcnROb3dJc28gPSAoKTogc3RyaW5nID0+IGV4cG9ydENsb2NrT3ZlcnJpZGUgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAvLyBTdGFibGUgY29udGVudCBpZGVudGl0eTogU0hBLTI1NiBvdmVyIHRoZSBzbGltIHJvd3MgcGx1cyB0aGUgc29ydGVkXG4gIC8vIHNjcmVlbnNob3QgYXJjaGl2ZSBuYW1lcy4gU2FtZSB3b3Jrc3BhY2UgY29udGVudCDihpIgc2FtZSBoYXNoIOKGkiBzYW1lXG4gIC8vIGZpbGVuYW1lICh0aGUgYmFja2dyb3VuZCBzYXZlcyB3aXRoIGNvbmZsaWN0QWN0aW9uICdvdmVyd3JpdGUnKSwgc29cbiAgLy8gcmUtZXhwb3J0aW5nIHVuY2hhbmdlZCBjb250ZW50IHJlcGxhY2VzIHJhdGhlciB0aGFuIGR1cGxpY2F0ZXMuXG4gIGNvbnN0IGNvbXB1dGVDb250ZW50SGFzaCA9IGFzeW5jIChzaG90TmFtZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBjb25zdCBwYXlsb2FkID0gYnVpbGRTbGltKCkubWFwKChsKSA9PiBKU09OLnN0cmluZ2lmeShsKSkuam9pbignXFxuJykgKyAnXFxuJyArIFsuLi5zaG90TmFtZXNdLnNvcnQoKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBkaWdlc3QgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShwYXlsb2FkKSk7XG4gICAgcmV0dXJuIFsuLi5uZXcgVWludDhBcnJheShkaWdlc3QpXS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICB9O1xuICAvLyBCdWlsZCBhIGZpbGVuYW1lIG9mIHRoZSBzaGFwZSBgcGluY2hncmFiLTx3b3Jrc3BhY2U+LTxob3N0Pi08c3RhbXA+LjxleHQ+YC5cbiAgLy8gVGhlIHN0YW1wIGlzIHRoZSBleHBvcnQncyBjb250ZW50LWhhc2ggcHJlZml4IHdoZW4gc3VwcGxpZWQgKGJ1bmRsZSBhbmRcbiAgLy8gSlNPTkwgZXhwb3J0cyksIGZhbGxpbmcgYmFjayB0byB0aGUgZXBvY2ggZm9yIGxlZ2FjeSBjYWxsZXJzLlxuICBjb25zdCBidWlsZEV4cG9ydEZpbGVuYW1lID0gKGV4dDogJ2pzb25sJyB8ICdtZCcgfCAndGFyLnpzdCcsIHN0YW1wPzogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgYHBpbmNoZ3JhYi0ke2FjdGl2ZVdzfS0ke2RvbWluYW50SG9zdFNsdWcoKX0tJHtzdGFtcCA/PyBEYXRlLm5vdygpfS4ke2V4dH1gO1xuICAvLyBTa2lwLWxpc3QgbWF0Y2g6IHN1YnN0cmluZyAoY2FzZS1pbnNlbnNpdGl2ZSkgbWF0Y2ggYWdhaW5zdCB0aGUgVVJMJ3NcbiAgLy8gaG9zdC4gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgVVJMIHBhcnNpbmcgb24gdGhlIHBhdHRlcm5zIHNvIHRoZSB1c2VyXG4gIC8vIGNhbiB3cml0ZSBgd3Jhbm5nbGUuY29tYCBhbmQgaGF2ZSBpdCBtYXRjaCBgYXBwLndyYW5uZ2xlLmNvbWAgdG9vLlxuICBjb25zdCBzaG91bGRTa2lwU2NyZWVuc2hvdCA9ICh1cmw6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGxpc3QgPSAocHJlZnMuc2tpcFNjcmVlbnNob3RIb3N0cyA/PyAnJykuc3BsaXQoJywnKS5tYXAoKHMpID0+IHMudHJpbSgpLnRvTG93ZXJDYXNlKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaG9zdCA9IGhvc3RPZih1cmwpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGxpc3Quc29tZSgocGF0KSA9PiBob3N0LmluY2x1ZGVzKHBhdCkpO1xuICB9O1xuXG4gIC8vIEpTT04gc3ludGF4IGhpZ2hsaWdodCAocGVyLWtleSBjb2xvciBpcyBoYXNoZWQgZm9yIHZpc3VhbCB2YXJpZXR5KS5cbiAgY29uc3QgS0VZX1BBTEVUVEUgPSBbJyNmZjdlNzgnLCAnI2ZmYjQ1NCcsICcjZmZlMDY2JywgJyM3YmQ5N2EnLCAnIzVmZDFmZicsICcjOWI4Y2ZmJywgJyNmZjg1YzEnLCAnI2ZmNWYwMCcsICcjMTBiOTgxJywgJyNmNTllMGInLCAnI2E3OGJmYScsICcjMzRkMzk5J107XG4gIGNvbnN0IGNvbG9yRm9yS2V5ID0gKGs6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgbGV0IGggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgay5sZW5ndGg7IGkrKykgaCA9IChoICogMzEgKyBrLmNoYXJDb2RlQXQoaSkpID4+PiAwO1xuICAgIHJldHVybiBLRVlfUEFMRVRURVtoICUgS0VZX1BBTEVUVEUubGVuZ3RoXSE7XG4gIH07XG4gIGNvbnN0IEpTT05fVE9LRU5fUkUgPSAvKFxccyspfChcIig/OlteXCJcXFxcXXxcXFxcLikqXCIpfCh0cnVlfGZhbHNlfG51bGwpfCgtP1xcZCsoPzpcXC5cXGQrKT8oPzpbZUVdWystXT9cXGQrKT8pfChbe31bXFxdLDpdKS9nO1xuICBjb25zdCBhcHBlbmRKc29uSGlnaGxpZ2h0ID0gKHJvb3Q6IEhUTUxFbGVtZW50LCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICByb290LnRleHRDb250ZW50ID0gJyc7XG4gICAgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIEpTT05fVE9LRU5fUkUubGFzdEluZGV4ID0gMDtcbiAgICB3aGlsZSAoKG0gPSBKU09OX1RPS0VOX1JFLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBpZiAobS5pbmRleCA+IGxhc3QpIHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCwgbS5pbmRleCkpKTtcbiAgICAgIGxhc3QgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgIGNvbnN0IFssIHdzLCBzdHIsIGxpdCwgbnVtLCBwdW5jdF0gPSBtO1xuICAgICAgaWYgKHdzKSB7IHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHdzKSk7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoc3RyKSB7XG4gICAgICAgIGxldCBrID0gSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXg7XG4gICAgICAgIHdoaWxlIChrIDwgdGV4dC5sZW5ndGggJiYgKHRleHRba10gPT09ICcgJyB8fCB0ZXh0W2tdID09PSAnXFx0JyB8fCB0ZXh0W2tdID09PSAnXFxuJykpIGsrKztcbiAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgaWYgKHRleHRba10gPT09ICc6Jykge1xuICAgICAgICAgIGxldCBrZXk6IHN0cmluZztcbiAgICAgICAgICB0cnkgeyBrZXkgPSBKU09OLnBhcnNlKHN0cikgYXMgc3RyaW5nOyB9IGNhdGNoIHsga2V5ID0gc3RyLnNsaWNlKDEsIC0xKTsgfVxuICAgICAgICAgIHNwYW4uY2xhc3NOYW1lID0gJ2snO1xuICAgICAgICAgIHNwYW4uc3R5bGUuY29sb3IgPSBjb2xvckZvcktleShrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW4uY2xhc3NOYW1lID0gJ3MnO1xuICAgICAgICB9XG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBzdHI7XG4gICAgICAgIHJvb3QuYXBwZW5kKHNwYW4pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBpZiAobGl0KSBzcGFuLmNsYXNzTmFtZSA9ICdiJztcbiAgICAgIGVsc2UgaWYgKG51bSkgc3Bhbi5jbGFzc05hbWUgPSAnbic7XG4gICAgICBlbHNlIGlmIChwdW5jdCkgc3Bhbi5jbGFzc05hbWUgPSAncCc7XG4gICAgICBzcGFuLnRleHRDb250ZW50ID0gbGl0ID8/IG51bSA/PyBwdW5jdCA/PyAnJztcbiAgICAgIHJvb3QuYXBwZW5kKHNwYW4pO1xuICAgIH1cbiAgICBpZiAobGFzdCA8IHRleHQubGVuZ3RoKSByb290LmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0LnNsaWNlKGxhc3QpKSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFBlcnNpc3RlbmNlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBsb2FkQWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHdvcmtzcGFjZXMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVtdPihXT1JLU1BBQ0VTX0tFWSwgd29ya3NwYWNlcykpIHx8IHdvcmtzcGFjZXM7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmxlbmd0aCkgd29ya3NwYWNlcyA9IFt7bmFtZTogJ2RlZmF1bHQnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dO1xuICAgIGFjdGl2ZVdzID0gKGF3YWl0IFN0b3JlLmdldDxzdHJpbmc+KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgJ2RlZmF1bHQnKSkgfHwgJ2RlZmF1bHQnO1xuICAgIGlmICghd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IGFjdGl2ZVdzKSkgYWN0aXZlV3MgPSB3b3Jrc3BhY2VzWzBdIS5uYW1lO1xuICAgIHByZWZzID0gey4uLkRFRkFVTFRfUFJFRlMsIC4uLihhd2FpdCBTdG9yZS5nZXQ8UGFydGlhbDxQcmVmcz4+KFBSRUZTX1NUT1JBR0VfTkFNRSwge30pKX07XG4gICAgLy8gUGF0aCBtaWdyYXRpb246IHByaW9yIHZlcnNpb25zIGRlZmF1bHRlZCBza2lsbFBhdGggdG9cbiAgICAvLyBgfi8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAsIGFuZCBzb21lIHVzZXJzIGhhZCBpdCBzdG9yZWQgYXNcbiAgICAvLyBgfi8uZG90ZmlsZXMvLmFnZW50cy9za2lsbHMvdWkvU0tJTEwubWRgLiBUaGUgc2tpbGwgd2FzIHJlbmFtZWRcbiAgICAvLyB0byBgUGluY2hHcmFiYDsgYW55IGB+Ly5kb3RmaWxlcy9gIHByZWZpeCBpcyBzdHJpcHBlZCBmcm9tXG4gICAgLy8gZXhwb3NlZCBkZWZhdWx0cyAoZG90ZmlsZXMgaXMgYSBwZXJzb25hbCBjb25maWcgc291cmNlIOKAlCBleHBvcnRzXG4gICAgLy8gc2hvdWxkbid0IGxlYWsgdGhhdCBwYXRoKS5cbiAgICBjb25zdCB1cGdyYWRlUGF0aCA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQsIGZyZXNoOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgaWYgKCFwKSByZXR1cm4gZnJlc2g7XG4gICAgICBpZiAocC5pbmNsdWRlcygnLmRvdGZpbGVzJykpIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmVuZHNXaXRoKCdza2lsbHMvdWkvU0tJTEwubWQnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25QYXRoID0gdXBncmFkZVBhdGgocHJlZnMuZGVzaWduUGF0aCwgREVGQVVMVF9QUkVGUy5kZXNpZ25QYXRoKTtcbiAgICBwcmVmcy5za2lsbFBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5za2lsbFBhdGgsIERFRkFVTFRfUFJFRlMuc2tpbGxQYXRoKTtcbiAgICAvLyBDb250ZW50IG1pZ3JhdGlvbjogcHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHRoZSBlbnRpcmUgdGVtcGxhdGVcbiAgICAvLyB0ZXh0IGluc2lkZSBgcHJlZnMuZGVzaWduTWRgIC8gYHByZWZzLnNraWxsTWRgIGFzIGRlZmF1bHRzLiBUaGF0XG4gICAgLy8gYXRlIH4zNjBLQiBvZiBjaHJvbWUuc3RvcmFnZSBxdW90YSBmb3Igbm8gYmVuZWZpdC4gRGV0ZWN0IHdoZW5cbiAgICAvLyB0aGUgc3RvcmVkIHZhbHVlIG1hdGNoZXMgb25lIG9mIHRoZSBidW5kbGVkIHRlbXBsYXRlcyBhbmQgY2xlYXJcbiAgICAvLyBpdCDigJQgdGhlIHJlc29sdmVyIGZhbGxzIGJhY2sgdG8gdGhlIGJ1bmRsZWQgZmlsZSBvbiB0aGUgZmx5LlxuICAgIC8vIEFsc28gc2NydWIgYW55IGxlYWtlZCBgfi8uZG90ZmlsZXMvYCBzdWJzdHJpbmcuXG4gICAgY29uc3Qgc2NydWJEb3RmaWxlcyA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgIHMucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvLmFnZW50cy8nLCAnfi8uYWdlbnRzLycpXG4gICAgICAgLnJlcGxhY2VBbGwoJ34vLmRvdGZpbGVzLycsICd+Ly5hZ2VudHMvJyk7XG4gICAgY29uc3QgY29sbGFwc2VJZk1hdGNoZXNUZW1wbGF0ZSA9IGFzeW5jIChjdXJyZW50OiBzdHJpbmcsIGtleXM6IFRlbXBsYXRlS2V5W10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgaWYgKCFjdXJyZW50IHx8ICFjdXJyZW50LnRyaW0oKSkgcmV0dXJuICcnO1xuICAgICAgY29uc3QgdHJpbW1lZCA9IGN1cnJlbnQudHJpbSgpO1xuICAgICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcbiAgICAgICAgY29uc3QgdHBsID0gKGF3YWl0IGxvYWRUZW1wbGF0ZShrKSkudHJpbSgpO1xuICAgICAgICBpZiAodHBsICYmIHRwbCA9PT0gdHJpbW1lZCkgcmV0dXJuICcnOyAvLyBtYXRjaGVzIGEgYnVuZGxlZCB0ZW1wbGF0ZSDigJQgY29sbGFwc2UgdG8gZW1wdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJyZW50LmluY2x1ZGVzKCcuZG90ZmlsZXMnKSA/IHNjcnViRG90ZmlsZXMoY3VycmVudCkgOiBjdXJyZW50O1xuICAgIH07XG4gICAgcHJlZnMuZGVzaWduTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLmRlc2lnbk1kID8/ICcnLCBbJ2xvY2FsRGVzaWduJywgJ2Rlc2lnblRlbXBsYXRlJ10pO1xuICAgIHByZWZzLnNraWxsTWQgPSBhd2FpdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlKHByZWZzLnNraWxsTWQgPz8gJycsIFsnbG9jYWxTa2lsbCcsICdza2lsbFRlbXBsYXRlJ10pO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UoYWN0aXZlV3MpO1xuICB9O1xuICBjb25zdCBsb2FkV29ya3NwYWNlID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGFjdGl2ZVdzID0gbmFtZTtcbiAgICB2b2lkIFN0b3JlLnNldCgncGluY2hncmFiLmFjdGl2ZVdvcmtzcGFjZScsIG5hbWUpO1xuICAgIC8vIE1pbnQgYSBuZXcgc2Vzc2lvbklkIHBlciB3b3Jrc3BhY2UgbG9hZC4gU2FtZSB3b3Jrc3BhY2UgcmUtb3BlbmVkXG4gICAgLy8gPSBuZXcgc2Vzc2lvbjogZGlzdGluY3QgdXVpZCBzbyBhIGNvbnN1bWVyIGNhbiB0ZWxsIHR3byBib290c1xuICAgIC8vIGFwYXJ0IGV2ZW4gd2hlbiB0aGUgY2FwdHVyZXMgbGFuZCBpbiB0aGUgc2FtZSBvbi1kaXNrIGZpbGUuXG4gICAgc2Vzc2lvbklkID0gbXNnSWQoKTtcbiAgICBtZXNzYWdlcyA9IChhd2FpdCBTdG9yZS5nZXQ8UGFuZWxNZXNzYWdlW10+KHdzTXNnS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIG1lc3NhZ2VzID0gW107XG4gICAgLy8gTWlncmF0ZSBsZWdhY3kgZW50cmllcyAobm8gdWlkLCBzdGF0ZXMtYXMtcmVjb3JkLCBhdHRycy5mb3JtYXQpIGFuZFxuICAgIC8vIHBlcnNpc3QgaWYgYW55dGhpbmcgY2hhbmdlZCBzbyB3ZSBkb24ndCBwYXkgdGhlIG1pZ3JhdGlvbiBjb3N0IGFnYWluXG4gICAgLy8gbmV4dCBsb2FkLlxuICAgIGlmIChtaWdyYXRlTG9hZGVkTWVzc2FnZXMoKSkgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkobmFtZSksIG1lc3NhZ2VzKTtcbiAgICBzaG90cy5jbGVhcigpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHBhZ2VTaG90c0ZpcmVkLmNsZWFyKCk7XG4gICAgY29uc3Qgc3RvcmVkID0gKGF3YWl0IFN0b3JlLmdldDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih3c1Nob3RzS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZCkpIHNob3RzLnNldChrLCB2KTtcbiAgICAvLyBSZXN0b3JlIHRoZSBmdWxsLXJlc29sdXRpb24gUE5HIGNhY2hlIHNvIGEgd29ya3NwYWNlIGFyY2hpdmVcbiAgICAvLyBleHBvcnRlZCBBRlRFUiBhIHBhbmVsIHJlbG9hZCBzdGlsbCBidW5kbGVzIHNjcmVlbnNob3RzIGZyb21cbiAgICAvLyBlYXJsaWVyIGNhcHR1cmVzLiBGSUZPIG9yZGVyIGlzIHByZXNlcnZlZCBieSBPYmplY3Qga2V5IG9yZGVyLlxuICAgIGNvbnN0IHN0b3JlZEZ1bGwgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNGdWxsS2V5KG5hbWUpLCB7fSkpIHx8IHt9O1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHN0b3JlZEZ1bGwpKSBzaG90c0Z1bGwuc2V0KGssIHYpO1xuICAgIC8vIExvYWQgdGhpcyB3b3Jrc3BhY2UncyBwZXJzaXN0ZW50IHNuYXBzaG90IGhpc3RvcnkgKENsZWFyLWFsbCBhcmNoaXZlcykuXG4gICAgYXdhaXQgbG9hZFdzU25hcHNob3RzKG5hbWUpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBzZWxlY3RvckVycm9ycy5jbGVhcigpO1xuICAgIHVuZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gbnVsbDtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBudWxsO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3QgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NNc2dLZXkoYWN0aXZlV3MpLCBtZXNzYWdlcyk7XG4gICAgLy8gUHVzaCBjYXB0dXJlZC1zZWxlY3RvciBzZXQgc28gdGhlIGNvbnRlbnQgc2NyaXB0J3MgaG92ZXIgd2Fsa2VyIGNhblxuICAgIC8vIHJlc29sdmUgZGVzY2VuZGFudHMg4oaSIGNhcHR1cmVkIGFuY2VzdG9yLlxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBzZW5kVG9DUyh7a2luZDogJ3NldC1jYXB0dXJlZCcsIHNlbGVjdG9yc30pO1xuICAgIHNjaGVkdWxlQXV0b3NhdmUoKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgRGlzayBhdXRvc2F2ZSAoY3Jhc2gvcmVpbnN0YWxsIHNhZmV0eSBuZXQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDYXB0dXJlcyArIGNvbW1lbnRzIG90aGVyd2lzZSBsaXZlIE9OTFkgaW4gY2hyb21lLnN0b3JhZ2UgdW50aWwgYW5cbiAgLy8gZXhwb3J0LiBjaHJvbWUuc3RvcmFnZSBpcyBwZXItZXh0ZW5zaW9uLWluc3RhbmNlLCBzbyBhIFJlbW92ZStyZS1hZGQgb2ZcbiAgLy8gYW4gdW5wYWNrZWQgYnVpbGQgKG5ldyBleHRlbnNpb24gaWQpIOKAlCBvciBhIHN0b3JhZ2UgY2xlYXIg4oCUIHNpbGVudGx5XG4gIC8vIHdpcGVzIGV2ZXJ5IHdvcmtzcGFjZSwgYW5kIHRoZSBvbi1kaXNrIHNjcmVlbnNob3RzIGJlY29tZSBvcnBoYW5zIHdpdGhcbiAgLy8gbm8gYW5ub3RhdGlvbnMuIFRoaXMgZGVib3VuY2VkIG1pcnJvciB3cml0ZXMgdGhlIHdvcmtzcGFjZSBKU09OTCB0b1xuICAvLyBEb3dubG9hZHMvcGluY2hncmFiLzx3cz4vPHdzPi5hdXRvc2F2ZS5qc29ubCAocmlnaHQgYmVzaWRlIHNjcmVlbnNob3RzLylcbiAgLy8gc28gdGhlIHdvcmsgaXMgYWx3YXlzIHJlY292ZXJhYmxlIGJ5IEltcG9ydCwgaW5kZXBlbmRlbnQgb2YgdGhlXG4gIC8vIGV4dGVuc2lvbidzIHN0b3JhZ2UuIE92ZXJ3cml0ZXMgaW4gcGxhY2U7IFF1aWV0IHNhdmVzIHN1cHByZXNzZXMgdGhlXG4gIC8vIGRvd25sb2FkIHBvcHVwLlxuICBjb25zdCBBVVRPU0FWRV9ERUJPVU5DRV9NUyA9IDEyMDAwO1xuICBsZXQgYXV0b3NhdmVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG4gIGxldCBhdXRvc2F2ZURpcnR5ID0gZmFsc2U7XG4gIGNvbnN0IGZsdXNoQXV0b3NhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgYXV0b3NhdmVEaXJ0eSA9IGZhbHNlO1xuICAgIGlmIChhdXRvc2F2ZVRpbWVyKSB7IGNsZWFyVGltZW91dChhdXRvc2F2ZVRpbWVyKTsgYXV0b3NhdmVUaW1lciA9IHVuZGVmaW5lZDsgfVxuICAgIGlmICghaW5FeHRlbnNpb24gfHwgIXByZWZzLmF1dG9zYXZlVG9EaXNrIHx8ICFtZXNzYWdlcy5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCB3cyA9IGFjdGl2ZVdzO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYCR7d3N9LmF1dG9zYXZlLmpzb25sYDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGV4dCA9IGJ1aWxkSnNvbmwoZmlsZW5hbWUsICdqc29ubCcpO1xuICAgICAgdm9pZCBzZW5kVG9CZyh7a2luZDogJ3NhdmUtdGV4dCcsIHdvcmtzcGFjZTogd3MsIGZpbGVuYW1lLCB0ZXh0LCBtaW1lOiAnYXBwbGljYXRpb24vanNvbmwnLCBzdWJkaXI6ICcnfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdhdXRvc2F2ZSBmYWlsZWQnLCBlcnIpOyB9XG4gIH07XG4gIGNvbnN0IHNjaGVkdWxlQXV0b3NhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbiB8fCAhcHJlZnMuYXV0b3NhdmVUb0Rpc2spIHJldHVybjtcbiAgICBhdXRvc2F2ZURpcnR5ID0gdHJ1ZTtcbiAgICBpZiAoYXV0b3NhdmVUaW1lcikgcmV0dXJuOyAvLyBvbmUgd3JpdGUgcGVyIGRlYm91bmNlIHdpbmRvd1xuICAgIGF1dG9zYXZlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHsgYXV0b3NhdmVUaW1lciA9IHVuZGVmaW5lZDsgaWYgKGF1dG9zYXZlRGlydHkpIGZsdXNoQXV0b3NhdmUoKTsgfSwgQVVUT1NBVkVfREVCT1VOQ0VfTVMpO1xuICB9O1xuICAvLyBGbHVzaCBwZW5kaW5nIHdvcmsgdGhlIG1vbWVudCB0aGUgcGFuZWwgaXMgaGlkZGVuL2Nsb3NlZCDigJQgdGhlIGxhc3RcbiAgLy8gZGVib3VuY2Ugd2luZG93IHdvdWxkIG90aGVyd2lzZSBiZSBsb3N0IG9uIGNsb3NlLlxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgKCkgPT4geyBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJyAmJiBhdXRvc2F2ZURpcnR5KSBmbHVzaEF1dG9zYXZlKCk7IH0pO1xuICBjb25zdCBwZXJzaXN0UHJlZnMgPSAoKTogdm9pZCA9PiB7XG4gICAgdm9pZCBTdG9yZS5zZXQoUFJFRlNfU1RPUkFHRV9OQU1FLCBwcmVmcyk7XG4gICAgLy8gUHVzaCB0aGUgc3Vic2V0IG9mIHByZWZzIHRoZSBjb250ZW50IHNjcmlwdCBjYXJlcyBhYm91dCBzbyBpdHNcbiAgICAvLyBvdmVybGF5IChzcGFjaW5nIHZpc3VhbGl6ZXIsIGhvdmVyIHNuYXAsIGV0Yy4pIHJlZmxlY3RzIHRoZSBsYXRlc3QuXG4gICAgdm9pZCBzZW5kVG9DUyh7XG4gICAgICBraW5kOiAnc2V0LWNzLXByZWZzJyxcbiAgICAgIHNwYWNpbmdPdmVybGF5OiBwcmVmcy5zcGFjaW5nT3ZlcmxheSxcbiAgICAgIGhvdmVyU25hcDogcHJlZnMuaG92ZXJTbmFwLFxuICAgIH0pO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHMpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0tleShhY3RpdmVXcyksIG9iaik7XG4gIH07XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgcGVyc2lzdGVuY2Ugd2l0aCBGSUZPIGV2aWN0aW9uLiBkYXRhVVJMIHN0cmluZ3NcbiAgLy8gY2FuIHJ1biA1MC01MDAgS0IgZWFjaDsgdGhlIGRlZmF1bHQgcXVvdGEgZ2V0cyBleGhhdXN0ZWQgaW4gdGVucyBvZlxuICAvLyBjYXB0dXJlcyB3aXRob3V0IGEgYnVkZ2V0LiBNYXAgaW5zZXJ0aW9uIG9yZGVyID0gRklGTyBvcmRlciwgc29cbiAgLy8gd2UgZXZpY3QgZnJvbSB0aGUgZnJvbnQgdW50aWwgdW5kZXIgYnVkZ2V0IGJlZm9yZSBwZXJzaXN0aW5nLlxuICBjb25zdCBldmljdFNob3RzRnVsbFRvQnVkZ2V0ID0gKCk6IG51bWJlciA9PiB7XG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2hvdHNGdWxsLnZhbHVlcygpKSB0b3RhbCArPSB2Lmxlbmd0aDtcbiAgICBsZXQgZXZpY3RlZCA9IDA7XG4gICAgd2hpbGUgKHRvdGFsID4gU0hPVFNfRlVMTF9CVURHRVRfQllURVMpIHtcbiAgICAgIGNvbnN0IGZpcnN0S2V5ID0gc2hvdHNGdWxsLmtleXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICBpZiAoZmlyc3RLZXkgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICBjb25zdCByZW1vdmVkID0gc2hvdHNGdWxsLmdldChmaXJzdEtleSk7XG4gICAgICBpZiAocmVtb3ZlZCA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIHNob3RzRnVsbC5kZWxldGUoZmlyc3RLZXkpO1xuICAgICAgdG90YWwgLT0gcmVtb3ZlZC5sZW5ndGg7XG4gICAgICBldmljdGVkKys7XG4gICAgfVxuICAgIHJldHVybiBldmljdGVkO1xuICB9O1xuICBjb25zdCBwZXJzaXN0U2hvdHNGdWxsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGV2aWN0ZWQgPSBldmljdFNob3RzRnVsbFRvQnVkZ2V0KCk7XG4gICAgaWYgKGV2aWN0ZWQgPiAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csIGBzaG90c0Z1bGwgRklGTy1ldmljdGVkICR7ZXZpY3RlZH0gb2xkZXN0IGVudHJpZXMgdG8gZml0ICR7U0hPVFNfRlVMTF9CVURHRVRfQllURVMgLyAxMDI0IC8gMTAyNH1NQiBidWRnZXRgKTtcbiAgICB9XG4gICAgY29uc3Qgb2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2Ygc2hvdHNGdWxsKSBvYmpba10gPSB2O1xuICAgIHZvaWQgU3RvcmUuc2V0KHdzU2hvdHNGdWxsS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdFdvcmtzcGFjZXMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKTsgfTtcblxuICAvLyDilIDilIDilIAgVGFiIOKHhCB3b3Jrc3BhY2UgYmluZGluZyAoIzE4KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQmFja2dyb3VuZCBhbm5vdW5jZXMgZWFjaCB0b29sYmFyLWNsaWNrIGFjdGl2YXRpb24gdmlhICdwZy10YWItYWN0aXZhdGVkJy5cbiAgLy8gVGhlIGZpcnN0IGFjdGl2YXRpb24gYWRvcHRzIHRoZSBjdXJyZW50IHVuYm91bmQgd29ya3NwYWNlOyBsYXRlciB0YWJzIGVhY2hcbiAgLy8gZ2V0IHRoZWlyIG93bi4gUGlja2luZyBhIGJvdW5kIHdvcmtzcGFjZSBqdW1wcyB0aGUgYnJvd3NlciB0byBpdHMgdGFiLlxuICBjb25zdCBzbHVnRm9yVGFiID0gKHVybDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0cnkgeyBjb25zdCBoID0gbmV3IFVSTCh1cmwpLmhvc3RuYW1lLnJlcGxhY2UoL153d3dcXC4vLCAnJyk7IGlmIChoKSByZXR1cm4gaDsgfSBjYXRjaCB7IC8qIG5vdCBhIHVybCAqLyB9XG4gICAgY29uc3QgdCA9ICh0aXRsZSB8fCAnJykudHJpbSgpO1xuICAgIHJldHVybiB0ID8gdC5zbGljZSgwLCAyNCkgOiAndGFiJztcbiAgfTtcbiAgY29uc3QgdW5pcXVlV3NOYW1lID0gKGJhc2U6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLnNvbWUoKHcpID0+IHcubmFtZSA9PT0gYmFzZSkpIHJldHVybiBiYXNlO1xuICAgIGZvciAobGV0IGkgPSAyOyA7IGkrKykgeyBjb25zdCBuID0gYCR7YmFzZX0gJHtpfWA7IGlmICghd29ya3NwYWNlcy5zb21lKCh3KSA9PiB3Lm5hbWUgPT09IG4pKSByZXR1cm4gbjsgfVxuICB9O1xuICBjb25zdCBvblRhYkFjdGl2YXRlZCA9IGFzeW5jICh7dGFiSWQsIHVybCwgdGl0bGV9OiB7dGFiSWQ6IG51bWJlcjsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmd9KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IHdzID0gd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3LnRhYklkID09PSB0YWJJZCk7XG4gICAgaWYgKHdzKSB7XG4gICAgICBpZiAod3MudXJsICE9PSB1cmwgfHwgd3MudGl0bGUgIT09IHRpdGxlKSB7IHdzLnVybCA9IHVybDsgd3MudGl0bGUgPSB0aXRsZTsgcGVyc2lzdFdvcmtzcGFjZXMoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IGFjdGl2ZVdzKTtcbiAgICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQudGFiSWQgPT0gbnVsbCkge1xuICAgICAgICB3cyA9IGN1cnJlbnQ7IHdzLnRhYklkID0gdGFiSWQ7IHdzLnVybCA9IHVybDsgd3MudGl0bGUgPSB0aXRsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdzID0ge25hbWU6IHVuaXF1ZVdzTmFtZShzbHVnRm9yVGFiKHVybCwgdGl0bGUpKSwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRhYklkLCB1cmwsIHRpdGxlfTtcbiAgICAgICAgd29ya3NwYWNlcy5wdXNoKHdzKTtcbiAgICAgIH1cbiAgICAgIHBlcnNpc3RXb3Jrc3BhY2VzKCk7XG4gICAgfVxuICAgIGlmIChhY3RpdmVXcyAhPT0gd3MubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3cy5uYW1lKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG4gIC8vIEJyaW5nIHRoZSBicm93c2VyIHRvIGEgd29ya3NwYWNlJ3MgYm91bmQgdGFiIHdoZW4gdGhlIHVzZXIgcGlja3MgaXQuXG4gIGNvbnN0IGZvY3VzV29ya3NwYWNlVGFiID0gKG5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHdzID0gd29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IG5hbWUpO1xuICAgIGlmICghaW5FeHRlbnNpb24gfHwgd3M/LnRhYklkID09IG51bGwpIHJldHVybjtcbiAgICBjaHJvbWUudGFicy51cGRhdGUod3MudGFiSWQsIHthY3RpdmU6IHRydWV9KS50aGVuKCh0KSA9PiB7XG4gICAgICBpZiAodD8ud2luZG93SWQgIT0gbnVsbCkgdm9pZCBjaHJvbWUud2luZG93cz8udXBkYXRlKHQud2luZG93SWQsIHtmb2N1c2VkOiB0cnVlfSk/LmNhdGNoPy4oKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgfSkuY2F0Y2goKCkgPT4geyAvKiB0YWIgd2FzIGNsb3NlZCAqLyB9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU25hcHNob3QgLyB1bmRvIC8gcmVkbyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc25hcHNob3QgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN1c3BlbmRTbmFwc2hvdHMpIHJldHVybjtcbiAgICBpZiAodW5kb1N0YWNrLmxlbmd0aCA+PSBVTkRPX0NBUCkgdW5kb1N0YWNrLnNoaWZ0KCk7XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZXN0b3JlID0gKGpzb246IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSB0cnVlO1xuICAgIHRyeSB7IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShqc29uKSBhcyBQYW5lbE1lc3NhZ2VbXTsgfSBjYXRjaCB7IG1lc3NhZ2VzID0gW107IH1cbiAgICBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuICBjb25zdCB1bmRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghdW5kb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gdW5kbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgcmVkb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHVuZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnVW5kb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgcmVkbyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXJlZG9TdGFjay5sZW5ndGgpIHsgc2V0U3RhdHVzKCdOb3RoaW5nIHRvIHJlZG8nLCB7a2luZDogJ2luZm8nfSk7IHJldHVybjsgfVxuICAgIHVuZG9TdGFjay5wdXNoKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgcmVzdG9yZShyZWRvU3RhY2sucG9wKCkhKTtcbiAgICBzZXRTdGF0dXMoJ1JlZG9uZScpO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVVuZG9CdXR0b25zID0gKCk6IHZvaWQgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInVuZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCB1bmRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJyZWRvXCJdJyk/LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgcmVkb1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUNvcHlQYXRoQnV0dG9uID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1hY3Rpb249XCJjb3B5LXBhdGhcIl0nKTtcbiAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgIGNvbnN0IGhhcyA9IEJvb2xlYW4obGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGgpO1xuICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsICFoYXMpO1xuICAgIGJ0bi5kYXRhc2V0LnRpcCA9IGhhc1xuICAgICAgPyBgQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LlxcbiR7bGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGggPz8gJyd9YFxuICAgICAgOiAnQ29weSB0aGUgcGF0aCBvZiB5b3VyIGxhc3QgZXhwb3J0LiBSdW4gYW4gZXhwb3J0IGZpcnN0Lic7XG4gIH07XG4gIGNvbnN0IG9uQ29weVBhdGggPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gbGFzdEV4cG9ydC5hYnNQYXRoO1xuICAgIGlmICghcGF0aFRvQ29weSkge1xuICAgICAgc2V0U3RhdHVzKCdObyBleHBvcnQgeWV0IOKAlCBydW4gYSBkb3dubG9hZCBmaXJzdCcsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHBhdGhUb0NvcHkpO1xuICAgICAgLy8gU2hvdyBvbmx5IHRoZSBsZWFmIGZpbGVuYW1lIGluIHRoZSBzdGF0dXMg4oCUIHRoZSBmdWxsIFdpbmRvd3Mtc3R5bGVcbiAgICAgIC8vIGFic29sdXRlIHBhdGggd291bGQgYmUgMTAwKyBjaGFycyBhbmQgd2FzIGRpc3J1cHRpbmcgdGhlIHNpZGViYXJcbiAgICAgIC8vIGxheW91dCBmb3IgdGhlIDItc2Vjb25kIHN0YXR1cyBUVEwuXG4gICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgc2V0U3RhdHVzKGBDb3BpZWQgcGF0aCDCtyAke2xlYWZ9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgcGF0aCcsIGxlYWYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFN0YXR1cygnQ2xpcGJvYXJkIHdyaXRlIGZhaWxlZDogJyArIFN0cmluZygoZSBhcyBFcnJvcik/Lm1lc3NhZ2UgPz8gZSksIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdDbGlwYm9hcmQgZmFpbGVkJywgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBCcmlkZ2UgdG8gYWN0aXZlIHRhYiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2VuZFRvQ1MgPSBhc3luYyAocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgbXNnID0gcGcocGF5bG9hZCk7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0pO1xuICAgICAgICBpZiAodGFic1swXT8uaWQgIT0gbnVsbCkgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgbXNnKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgIH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkgeyB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3BpbmNoZ3JhYjp0by1jcycsIHtkZXRhaWw6IG1zZ30pKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfVxuICB9O1xuICBjb25zdCBzZW5kVG9DU0FuZFdhaXQgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0NzKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4gbmV3IFByb21pc2U8UiB8IG51bGw+KChyZXNvbHZlKSA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikge1xuICAgICAgY29uc3QgcmVxSWQgPSBgcmVxXyR7c2VjdXJlVG9rZW4oMTIpfWA7XG4gICAgICBjb25zdCBvblJlc3AgPSAoZTogRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3QgZGV0YWlsID0gKGUgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbDtcbiAgICAgICAgaWYgKGRldGFpbD8uX19yZXFJZCA9PT0gcmVxSWQpIHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTtcbiAgICAgICAgICByZXNvbHZlKGRldGFpbC5yZXBseSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLWNzJywge2RldGFpbDoge19fcmVxSWQ6IHJlcUlkLCAuLi5wZyhwYXlsb2FkKX19KSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjpjcy1yZXNwb25zZScsIG9uUmVzcCk7IHJlc29sdmUobnVsbCk7IH0sIDEwMDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgKHRhYnMpID0+IHtcbiAgICAgIGlmICghdGFic1swXT8uaWQpIHsgcmVzb2x2ZShudWxsKTsgcmV0dXJuOyB9XG4gICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCBwZyhwYXlsb2FkKSwgKHI6IFIpID0+IHJlc29sdmUocikpO1xuICAgIH0pO1xuICB9KTtcbiAgY29uc3Qgc2VuZFRvQmcgPSBhc3luYyA8Uj4ocGF5bG9hZDogUGFuZWxUb0JnKTogUHJvbWlzZTxSIHwgbnVsbD4gPT4ge1xuICAgIGlmICghaW5FeHRlbnNpb24pIHJldHVybiBudWxsO1xuICAgIHRyeSB7IHJldHVybiAoYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UocGcocGF5bG9hZCkpKSBhcyBSOyB9XG4gICAgY2F0Y2ggKGUpIHsgcmV0dXJuIHtlcnJvcjogU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKX0gYXMgdW5rbm93biBhcyBSOyB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFJlY2VpdmluZyBmcm9tIGNvbnRlbnQgc2NyaXB0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBEZWZlbnNpdmUgcmluZy1idWZmZXIgZGVkdXBlOiBldmVuIHRob3VnaCB3ZSBub3cgdXNlIG9ubHkgb25lIGNoYW5uZWwsXG4gIC8vIGFueSBtZXNzYWdlIHRoYXQgc29tZWhvdyBhcnJpdmVzIHR3aWNlIHdpdGhpbiB+MiBzZWNvbmRzIGlzIGlnbm9yZWQuXG4gIGNvbnN0IHJlY2VudE1pZHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFJFQ0VOVF9NSURfQ0FQID0gNjQ7XG4gIGNvbnN0IG9uQ3NNZXNzYWdlID0gKG1zZzogUGdFbnZlbG9wZTxDc1RvUGFuZWw+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFtc2cgfHwgbXNnLl9fcGcgIT09IHRydWUpIHJldHVybjtcbiAgICBpZiAobXNnLl9fbWlkKSB7XG4gICAgICBpZiAocmVjZW50TWlkcy5pbmNsdWRlcyhtc2cuX19taWQpKSByZXR1cm47XG4gICAgICByZWNlbnRNaWRzLnB1c2gobXNnLl9fbWlkKTtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmxlbmd0aCA+IFJFQ0VOVF9NSURfQ0FQKSByZWNlbnRNaWRzLnNoaWZ0KCk7XG4gICAgfVxuICAgIGlmICgobXNnIGFzIHtraW5kPzogc3RyaW5nfSkua2luZCA9PT0gJ3BnLXRhYi1hY3RpdmF0ZWQnKSB7XG4gICAgICB2b2lkIG9uVGFiQWN0aXZhdGVkKG1zZyBhcyB1bmtub3duIGFzIHt0YWJJZDogbnVtYmVyOyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzd2l0Y2ggKG1zZy5raW5kKSB7XG4gICAgICBjYXNlICdjYXB0dXJlJzogb25DYXB0dXJlKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2hvdmVyJzogb25Ib3Zlcihtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnaG92ZXInfT4pOyByZXR1cm47XG4gICAgICBjYXNlICdob3Zlci1lbmQnOiBvbkhvdmVyRW5kKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BlbmRpbmctYWRkJzogb25QZW5kaW5nQWRkKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BlbmRpbmctY2xlYXInOiBvblBlbmRpbmdDbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdmZWVkYmFjay1hZGQnOiBvbkZlZWRiYWNrQWRkKG1zZyk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3ByZWZlcmVuY2UtY2hhbmdlJzogb25QcmVmZXJlbmNlQ2hhbmdlKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdwcmVmZXJlbmNlLWNoYW5nZSd9Pik7IHJldHVybjtcbiAgICAgIGNhc2UgJ3BhZ2Utc25hcHNob3QnOiBvblBhZ2VTbmFwc2hvdCgobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ3BhZ2Utc25hcHNob3QnfT4pLnBheWxvYWQpOyByZXR1cm47XG4gICAgICBjYXNlICdzZWxlY3QtbW9kZSc6IHN5bmNTZWxlY3RNb2RlKChtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnc2VsZWN0LW1vZGUnfT4pLm9uKTsgcmV0dXJuO1xuICAgICAgZGVmYXVsdDogcmV0dXJuO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RpY2t5IHBpbmNoIG1vZGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFRvZ2dsZSBcImNhcHR1cmUgd2l0aG91dCBob2xkaW5nIEFsdFwiLiBUaGUgcGFnZSBvd25zIHRoZSBhY3R1YWwgZ2VzdHVyZVxuICAvLyBnYXRlICsgRXNjLXRvLWV4aXQ7IHRoZSBwYW5lbCBtaXJyb3JzIHRoZSBzdGF0ZSBvbiBpdHMgYnV0dG9uIGFuZCByZWZsZWN0c1xuICAvLyB0aGUgcGFnZSdzIG93biBleGl0IChFc2MpIHZpYSB0aGUgc2VsZWN0LW1vZGUgbWVzc2FnZS5cbiAgbGV0IHNlbGVjdE1vZGUgPSBmYWxzZTtcbiAgY29uc3QgcmVmbGVjdFNlbGVjdE1vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBiIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1hY3Rpb249XCJzZWxlY3QtbW9kZVwiXScpKSB7XG4gICAgICBiLmNsYXNzTGlzdC50b2dnbGUoJ3RvZ2dsZWQnLCBzZWxlY3RNb2RlKTtcbiAgICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCBTdHJpbmcoc2VsZWN0TW9kZSkpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc3luY1NlbGVjdE1vZGUgPSAob246IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBpZiAoc2VsZWN0TW9kZSA9PT0gb24pIHJldHVybjtcbiAgICBzZWxlY3RNb2RlID0gb247XG4gICAgcmVmbGVjdFNlbGVjdE1vZGUoKTtcbiAgICBzZXRTdGF0dXMob24gPyAnUGluY2ggbW9kZSBvbiDigJQgY2xpY2sgdGhlIHBhZ2UgdG8gY2FwdHVyZSAoRXNjIGV4aXRzKScgOiAnUGluY2ggbW9kZSBvZmYnKTtcbiAgfTtcbiAgY29uc3Qgb25Ub2dnbGVTZWxlY3RNb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgIHNlbGVjdE1vZGUgPSAhc2VsZWN0TW9kZTtcbiAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2VsZWN0LW1vZGUnLCBvbjogc2VsZWN0TW9kZX0pO1xuICAgIHJlZmxlY3RTZWxlY3RNb2RlKCk7XG4gICAgc2V0U3RhdHVzKHNlbGVjdE1vZGUgPyAnUGluY2ggbW9kZSBvbiDigJQgY2xpY2sgdGhlIHBhZ2UgdG8gY2FwdHVyZSAoRXNjIGV4aXRzKScgOiAnUGluY2ggbW9kZSBvZmYnKTtcbiAgfTtcblxuICBjb25zdCBvblByZWZlcmVuY2VDaGFuZ2UgPSAoe3JlYXNvbiwgcGFnZX06IHtyZWFzb246IHN0cmluZzsgcGFnZTogYW55fSk6IHZvaWQgPT4ge1xuICAgIGxpdmVUYWJVcmwgPSBwYWdlPy51cmwgPz8gbGl2ZVRhYlVybDtcbiAgICBsaXZlVGFiUGF0aCA9IGxpdmVUYWJVcmwgPyBwYXRoT2YobGl2ZVRhYlVybCkgOiBsaXZlVGFiUGF0aDtcbiAgICAvLyBQYWdlIHJvd3MgYXJlIGNhcHR1cmUgaGVhZGVycywgbm90IGEgdGFiL3BhZ2UgdGVsZW1ldHJ5IGZlZWQuIFRoZSBuZXh0XG4gICAgLy8gc2VsZWN0b3IgY2FwdHVyZSBmcm9tIHRoaXMgcGFnZSB3aWxsIGNhcnJ5IHRoZSBuZXcgdmlld3BvcnQvc3RhdGUgYW5kXG4gICAgLy8gaW5zZXJ0IGEgcGFnZSBoZWFkZXIgb25seSBpZiBuZWVkZWQuXG4gICAgc2V0U3RhdHVzKGAke3JlYXNvbn0gY2hhbmdlZGAsIHtraW5kOiAnaW5mbyd9KTtcbiAgfTtcblxuICAvLyBQYWdlLWdyb3VwIHJlY29yZHMgbWF5IGNhcnJ5IGEgZnVsbC1wYWdlIHNuYXBzaG90ICh2aWV3cG9ydCwgc2Nyb2xsXG4gIC8vIGV4dGVudHMsIGRwciwgbGFuZywgZnVsbC1wYWdlIHNjcmVlbnNob3QpLiBQYWdlTWVzc2FnZSBpbiB0eXBlcy50cyBkb2Vzbid0XG4gIC8vIHlldCBkZWNsYXJlIHRoZSBmaWVsZCwgc28gd2Ugd2lkZW4gaXQgbG9jYWxseSDigJQgdGhlIHZhbHVlIHBlcnNpc3RzIHdpdGhcbiAgLy8gdGhlIHJlc3Qgb2YgdGhlIG1lc3NhZ2UgSlNPTiBhbmQgcm91bmQtdHJpcHMgdGhyb3VnaCBleHBvcnQuXG4gIHR5cGUgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QgPSBQYWdlTWVzc2FnZSAmIHtzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH07XG4gIC8vIFNuYXBzaG90cyB0aGF0IGFycml2ZWQgYmVmb3JlIGEgcGFnZS1ncm91cCByZWNvcmQgZXhpc3RzIGZvciB0aGVpciBVUkwuXG4gIC8vIEFwcGxpZWQgd2hlbiB0aGUgcGFnZSBoZWFkZXIgaXMgbGF0ZXIgY3JlYXRlZCAoc2VlIG9uQ2FwdHVyZSkuXG4gIGNvbnN0IHBlbmRpbmdTbmFwc2hvdHMgPSBuZXcgTWFwPHN0cmluZywgUGFnZVNuYXBzaG90PigpO1xuICBjb25zdCBhcHBseVNuYXBzaG90VG9QYWdlID0gKHNuYXA6IFBhZ2VTbmFwc2hvdCk6IGJvb2xlYW4gPT4ge1xuICAgIC8vIEF0dGFjaCB0byB0aGUgbW9zdCByZWNlbnQgcGFnZS1ncm91cCByZWNvcmQgZm9yIHRoaXMgVVJMLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJyAmJiBtLnVybCA9PT0gc25hcC51cmwpIHtcbiAgICAgICAgKG0gYXMgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QpLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3Qgb25QYWdlU25hcHNob3QgPSAocGF5bG9hZDogUGFnZVNuYXBzaG90KTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYXlsb2FkPy51cmwpIHJldHVybjtcbiAgICBpZiAoYXBwbHlTbmFwc2hvdFRvUGFnZShwYXlsb2FkKSkge1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHBhZ2UgcmVjb3JkIHlldCDigJQgc3Rhc2ggZm9yIHRoZSBuZXh0IGNhcHR1cmUgb24gdGhpcyBVUkwuXG4gICAgICBwZW5kaW5nU25hcHNob3RzLnNldChwYXlsb2FkLnVybCwgcGF5bG9hZCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uRmVlZGJhY2tBZGQgPSAoe3NlbGVjdG9yLCB0ZXh0LCB1cmwsIHBhcmVudFVpZH06IHtzZWxlY3Rvcjogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHVybD86IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nfSk6IHZvaWQgPT4ge1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIC8vIFJlc29sdmUgdGhlIHBhcmVudCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAvLyAgIDEuIHBhcmVudFVpZCDigJQgdGhlIGNvbnRlbnQgc2NyaXB0IHN1cHBsaWVkIGEgc3RhYmxlIHVpZCAodGhlXG4gICAgLy8gICAgICBzdHJvbmdlc3QgbWF0Y2g7IHN1cnZpdmVzIHNlbGVjdG9yIGNoYW5nZXMsIHNpYmxpbmdcbiAgICAvLyAgICAgIGNvbGxpc2lvbnMsIG11bHRpcGxlIGNhcHR1cmVzIG9mIHRoZSBzYW1lIGVsZW1lbnQpLlxuICAgIC8vICAgMi4gc2VsZWN0b3IgKyB1cmwg4oCUIGNvbXBvc2l0ZSBrZXk7IHByZXZlbnRzIGNyb3NzLXBhZ2VcbiAgICAvLyAgICAgIGNvbnRhbWluYXRpb24gd2hlbiB0aGUgc2FtZSBzZWxlY3RvciBleGlzdHMgb24gbXVsdGlwbGUgVVJMcy5cbiAgICAvLyAgIDMuIHNlbGVjdG9yICsgbGl2ZVRhYlVybCDigJQgZmFsbGJhY2sgd2hlbiB0aGUgbWVzc2FnZSBkaWRuJ3RcbiAgICAvLyAgICAgIGNhcnJ5IGFuIGV4cGxpY2l0IHVybCAob2xkZXIgY29udGVudC1zY3JpcHQgbWVzc2FnZXMpLlxuICAgIGxldCBpZHggPSAtMTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnVpZCA9PT0gcGFyZW50VWlkKTtcbiAgICB9XG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGNvbnN0IHdhbnRVcmwgPSB1cmwgPz8gbGl2ZVRhYlVybCA/PyBudWxsO1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PlxuICAgICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcidcbiAgICAgICAgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3JcbiAgICAgICAgJiYgKCF3YW50VXJsIHx8IG0uZW50cnkudXJsID09PSB3YW50VXJsKSk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oTE9HLCAnb25GZWVkYmFja0FkZDogbm8gcGFyZW50IGZvdW5kJywge3NlbGVjdG9yLCB1cmwsIHBhcmVudFVpZH0pO1xuICAgICAgc2V0U3RhdHVzKCdDb21tZW50IGxvc3QgaXRzIHBhcmVudCDigJQgY2hlY2sgdGhlIGFjdGl2ZSBjYXB0dXJlJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHBhcmVudE1zZyA9IG1lc3NhZ2VzW2lkeF0gYXMgU2VsZWN0b3JNZXNzYWdlO1xuICAgIGxldCBpbnNlcnRBdCA9IGlkeCArIDE7XG4gICAgd2hpbGUgKGluc2VydEF0IDwgbWVzc2FnZXMubGVuZ3RoICYmIG1lc3NhZ2VzW2luc2VydEF0XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgaW5zZXJ0QXQrKztcbiAgICAvLyBTdGFtcCBwYXJlbnRVaWQgb24gdGhlIG5ldyBmZWVkYmFjayByb3cgc28gdGhlIGV4cG9ydCBjYXJyaWVzXG4gICAgLy8gdGhlIEZLIGxpbmsgZXhwbGljaXRseSAobm90IGp1c3QgYnkgY2FwdHVyZS1hZGphY2VuY3kpLlxuICAgIG1lc3NhZ2VzLnNwbGljZShpbnNlcnRBdCwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICBwYXJlbnRVaWQ6IHBhcmVudE1zZy5lbnRyeS51aWQsXG4gICAgfSk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnQ29tbWVudCBhZGRlZCBmcm9tIHBhZ2UnKTtcbiAgICAvLyBFdmVyeSBmZWVkYmFjayBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LiBJZiB0aGUgcGFyZW50XG4gICAgLy8gY2FwdHVyZSBkaWRuJ3QgZ2V0IG9uZSAoYXV0b1NjcmVlbnNob3Qgb2ZmLCBza2lwU2NyZWVuc2hvdEhvc3RzXG4gICAgLy8gaGl0LCBuZXR3b3JrIGdsaXRjaCksIHJlLWZpcmUgbm93LlxuICAgIGlmICghcGFyZW50TXNnLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudE1zZyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uUGVuZGluZ0FkZCA9ICh7ZW50cnl9OiB7ZW50cnk6IEVudHJ5fSk6IHZvaWQgPT4geyBwZW5kaW5nTXVsdGkucHVzaChlbnRyeSk7IHJlbmRlcigpOyB9O1xuICBjb25zdCBvblBlbmRpbmdDbGVhciA9ICgpOiB2b2lkID0+IHsgcGVuZGluZ011bHRpID0gW107IHJlbmRlcigpOyB9O1xuXG4gIGNvbnN0IGZpbmREdXBsaWNhdGUgPSAoc2VsZWN0b3I6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBTZWxlY3Rvck1lc3NhZ2UgfCB1bmRlZmluZWQgPT5cbiAgICBtZXNzYWdlcy5maW5kKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT5cbiAgICAgIG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBtLmVudHJ5LnNlbGVjdG9yID09PSBzZWxlY3RvciAmJiAoIXVybCB8fCBtLmVudHJ5LnVybCA9PT0gdXJsKSk7XG5cbiAgLy8gRmluZCBhbiBleGlzdGluZyBjYXB0dXJlIGZvciB0aGUgYWN0aXZlIHRhYiArIHNlbGVjdG9yLiBDcm9zcy1wYWdlXG4gIC8vIGNvbnRhbWluYXRpb24gcHJldmVudGlvbiAoc2VlIHR5cGVzLnRzIGZlZWRiYWNrLWFkZCBkb2NzdHJpbmcpOlxuICAvLyBhIHNlbGVjdG9yIGFsb25lIGlzIE5PVCBhIHN0YWJsZSBpZGVudGl0eSDigJQgYFtkYXRhLXRlc3RpZD1cImZvcmVjYXN0LWl0ZW1cIl1gXG4gIC8vIGV4aXN0cyBvbiBldmVyeSBwYWdlOyBgYnV0dG9uYCBpcyBldmVyeXdoZXJlLiBTdHJvbmcgaWRlbnRpdHkgaXNcbiAgLy8gKHNlbGVjdG9yICsgdXJsKS4gUmV0dXJucyB0aGUgbW9zdCByZWNlbnQgbWF0Y2ggc28gcmUtaG92ZXJpbmcgYW5cbiAgLy8gYWxyZWFkeS1jYXB0dXJlZCBlbGVtZW50IHJlc29sdmVzIGNvbnNpc3RlbnRseS5cbiAgY29uc3QgZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZSA9IChzZWxlY3Rvcjogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+IHtcbiAgICBjb25zdCB1cmwgPSBsaXZlVGFiVXJsO1xuICAgIC8vIFdhbGsgYmFja3dhcmRzIHNvIHRoZSBtb3N0IHJlY2VudCBtYXRjaGluZyBjYXB0dXJlIHdpbnMgd2hlbiBhXG4gICAgLy8gc2VsZWN0b3IgbGVnaXRpbWF0ZWx5IGhhcyBtdWx0aXBsZSBjYXB0dXJlcyBvbiB0aGUgc2FtZSBwYWdlXG4gICAgLy8gKGUuZy4sIHRoZSB1c2VyIHJlLWNhcHR1cmVkIHRoZSBzYW1lIGVsZW1lbnQgYWZ0ZXIgZWRpdHMpLlxuICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSBjb250aW51ZTtcbiAgICAgIGlmICh1cmwgJiYgbS5lbnRyeS51cmwgIT09IHVybCkgY29udGludWU7XG4gICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBjb25zdCBjYW5vbmljYWxFbnRyeSA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgdGFnOiBlLnRhZywgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHRleHQ6IGUudGV4dCwgcm9sZTogZS5yb2xlLFxuICAgIGF0dHJzOiBlLmF0dHJzLCBjbGFzc2VzOiBlLmNsYXNzZXMsXG4gICAgcmVjdDogZS5yZWN0LCBvdXRlckhUTUw6IGUub3V0ZXJIVE1MLFxuICAgIHN0eWxlczogZS5zdHlsZXMsIG1hdGNoZWRSdWxlczogZS5tYXRjaGVkUnVsZXMsXG4gIH0pO1xuXG4gIGNvbnN0IG9uQ2FwdHVyZSA9ICh7ZW50cnksIHBhZ2UsIGdyb3VwZWR9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdjYXB0dXJlJ30+KTogdm9pZCA9PiB7XG4gICAgaWYgKCFlbnRyeSB8fCAhcGFnZSkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGl2ZVRhYlVybCA9IHBhZ2UudXJsO1xuICAgIGxpdmVUYWJQYXRoID0gcGF0aE9mKHBhZ2UudXJsKTtcbiAgICBpZiAoZ3JvdXBlZCkge1xuICAgICAgZm9yIChsZXQgaSA9IG1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IG0uZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICAgICAgZ3JvdXAucHVzaChlbnRyeSk7XG4gICAgICAgICAgbS5lbnRyeS5ncm91cCA9IGdyb3VwO1xuICAgICAgICAgIHBlcnNpc3QoKTsgcmVuZGVyKCk7IGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgICAgLy8gRmlyZSBhIGdyb3VwIHNob3QgdXNpbmcgdGhlIGhlYWQgKyBtZW1iZXJzLiBUaGUgaGVhZCdzIHNlbGVjdG9yXG4gICAgICAgICAgLy8gaXMgbS5lbnRyeS5zZWxlY3RvcjsgbWVtYmVycycgc2VsZWN0b3JzIGFyZSBpbiB0aGUgZnJlc2hseVxuICAgICAgICAgIC8vIG11dGF0ZWQgZ3JvdXAgYXJyYXkuXG4gICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gW20uZW50cnkuc2VsZWN0b3IsIC4uLihtLmVudHJ5Lmdyb3VwID8/IFtdKS5tYXAoKGcpID0+IGcuc2VsZWN0b3IpXTtcbiAgICAgICAgICB2b2lkIGZpcmVHcm91cFNob3QobSwgc2VsZWN0b3JzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRHVwZSBkZXRlY3Rpb24uIENyb3NzLWNvbnRhbWluYXRpb24gZml4OiBhIChzZWxlY3RvciwgdXJsKSBtYXRjaFxuICAgIC8vIGlzIE5FQ0VTU0FSWSBidXQgbm90IFNVRkZJQ0lFTlQg4oCUIHR3byBzaWJsaW5nIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgLy8gc2FtZSB0ZXN0SWQgLyBzYW1lIHJvbGUvYXJpYSBzZWxlY3RvciBsaXZlIG9uIHRoZSBzYW1lIFVSTCBidXRcbiAgICAvLyBhcmUgZGlmZmVyZW50IGNhcHR1cmVzLiBDb21wYXJlIHRoZSBjYW5vbmljYWwtZW50cnkgaGFzaCAod2hpY2hcbiAgICAvLyBpbmNsdWRlcyByZWN0LCB0ZXh0LCBvdXRlckhUTUwsIGV0Yy4pIGJlZm9yZSB0cmVhdGluZyB0aGUgbmV3XG4gICAgLy8gY2FwdHVyZSBhcyBhIHJlZnJlc2ggb2YgdGhlIG9sZCBvbmUuIFdoZW4gdGhlIGhhc2ggZGlmZmVycywgd2VcbiAgICAvLyBrZWVwIEJPVEggY2FwdHVyZXMgcmF0aGVyIHRoYW4gb3ZlcndyaXRpbmcuXG4gICAgY29uc3QgZHVwZSA9IGZpbmREdXBsaWNhdGUoZW50cnkuc2VsZWN0b3IsIGVudHJ5LnVybCk7XG4gICAgaWYgKGR1cGUpIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IGNhbm9uaWNhbEVudHJ5KGR1cGUuZW50cnkpO1xuICAgICAgY29uc3QgYWZ0ZXIgPSBjYW5vbmljYWxFbnRyeShlbnRyeSk7XG4gICAgICBpZiAoYmVmb3JlID09PSBhZnRlcikge1xuICAgICAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBIYXNoZXMgZGlmZmVyLiBUd28gY2FzZXM6XG4gICAgICAvLyAgIChhKSBTYW1lIGVsZW1lbnQgcmUtY2FwdHVyZWQgYWZ0ZXIgY29udGVudCBjaGFuZ2Ug4oCUIHRoZSByZWN0XG4gICAgICAvLyAgICAgICBzdGF5cyBwdXQgKHdpdGhpbiBhIGZldyBweCksIGJ1dCB0ZXh0L291dGVySFRNTCBtb3ZlZC5cbiAgICAgIC8vICAgICAgIFRyZWF0IGFzIGEgcmVmcmVzaC5cbiAgICAgIC8vICAgKGIpIERpZmZlcmVudCBlbGVtZW50IHRoYXQgaGFwcGVucyB0byBzaGFyZSBhIHNlbGVjdG9yIOKAlCB0aGVcbiAgICAgIC8vICAgICAgIHJlY3QgaXMgaW4gYSBkaWZmZXJlbnQgcG9zaXRpb24uIFRyZWF0IGFzIGEgbmV3IGNhcHR1cmUuXG4gICAgICAvLyBXZSBkaXNjcmltaW5hdGUgYnkgcmVjdCBvdmVybGFwOiBpZiBib3RoIHJlY3RzIGV4aXN0IGFuZCB0aGVpclxuICAgICAgLy8gY2VudGVycyBhcmUgd2l0aGluIDhweCBvbiBib3RoIGF4ZXMsIHJlZnJlc2g7IG90aGVyd2lzZSBrZWVwXG4gICAgICAvLyBib3RoLlxuICAgICAgY29uc3QgcjEgPSBkdXBlLmVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCByMiA9IGVudHJ5LnJlY3Q7XG4gICAgICBjb25zdCBzYW1lRWxlbWVudCA9IHIxICYmIHIyXG4gICAgICAgICYmIE1hdGguYWJzKChyMS54ICsgcjEudyAvIDIpIC0gKHIyLnggKyByMi53IC8gMikpIDw9IDhcbiAgICAgICAgJiYgTWF0aC5hYnMoKHIxLnkgKyByMS5oIC8gMikgLSAocjIueSArIHIyLmggLyAyKSkgPD0gODtcbiAgICAgIGlmIChzYW1lRWxlbWVudCkge1xuICAgICAgICBkZWxldGUgZHVwZS5kdXBlUGVuZGluZztcbiAgICAgICAgZHVwZS5lbnRyeSA9IGVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoYFVwZGF0ZWQgIyR7ZHVwZS5lbnRyeS5ufWAsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlmZmVyZW50IGVsZW1lbnQgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciDihpIgZmFsbCB0aHJvdWdoIGFuZFxuICAgICAgLy8gZW1pdCBhcyBhIG5ldyBjYXB0dXJlLiBUaGUgYWdlbnQgcmVhZGluZyB0aGUgZXhwb3J0IHNlZXMgYm90aFxuICAgICAgLy8gcm93cyB3aXRoIHRoZSBzYW1lIHNlbGVjdG9yIGJ1dCBkaWZmZXJlbnQgdWlkcyArIHJlY3RzLlxuICAgIH1cbiAgICBsZXQgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBwb3NpdGlvbiA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQpO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkgcG9zaXRpb24gPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBTdGFtcCB0aGUgc2Vzc2lvbiBGSyBzbyB0aGUgY29uc3VtZXIgY2FuIGpvaW4gZW50cmllcyB0byB0aGVpclxuICAgIC8vIHNlc3Npb24gaGVhZGVyIHdpdGhvdXQgVVJMLXN0cmluZyBjb21wYXJlLlxuICAgIGlmIChzZXNzaW9uSWQpIGVudHJ5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICBjb25zdCBuZXdNc2c6IFNlbGVjdG9yTWVzc2FnZSA9IHt0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzLCBlbnRyeX07XG4gICAgLy8gUGFnZSByb3dzIGV4aXN0IG9ubHkgYXMgaGVhZGVycyBmb3IgY2FwdHVyZWQgc2VsZWN0b3JzLiBEbyBub3QgY3JlYXRlXG4gICAgLy8gdGhlbSBmcm9tIHRhYiBhY3RpdmF0aW9uLCB2YWxpZGF0aW9uLCBvciBwcmVmZXJlbmNlIGNoYW5nZXM7IGluc2VydCBvbmVcbiAgICAvLyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGZpcnN0IHNlbGVjdG9yIG9mIGEgbmV3IHBhZ2UgYmxvY2suXG4gICAgbGV0IHByZXZpb3VzUGFnZTogUGFnZU1lc3NhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gcG9zaXRpb24gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbSA9IG1lc3NhZ2VzW2ldO1xuICAgICAgaWYgKG0/LnR5cGUgPT09ICdwYWdlJykgeyBwcmV2aW91c1BhZ2UgPSBtOyBicmVhazsgfVxuICAgICAgaWYgKG0/LnR5cGUgPT09ICdzZWxlY3RvcicpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzUGFnZSB8fCBwcmV2aW91c1BhZ2UudXJsICE9PSBwYWdlLnVybCkge1xuICAgICAgY29uc3QgcGFnZU1zZzogUGFnZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHVybDogcGFnZS51cmwsIHRpdGxlOiBwYWdlLnRpdGxlLCB2aWV3cG9ydDogcGFnZS52aWV3cG9ydCwgdG9rZW5zOiBwYWdlLnRva2VucyxcbiAgICAgICAgdXNlckFnZW50OiBwYWdlLnVzZXJBZ2VudCwgbGFuZzogcGFnZS5sYW5nLFxuICAgICAgICBnaXRDb250ZXh0OiAocGFnZSBhcyBhbnkpLmdpdENvbnRleHQsXG4gICAgICAgIHJvdXRlOiAocGFnZSBhcyBhbnkpLnJvdXRlLFxuICAgICAgICBzdGF0ZTogKHBhZ2UgYXMgYW55KS5zdGF0ZSxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgfTtcbiAgICAgIC8vIEF0dGFjaCBhbnkgcGFnZS1zbmFwc2hvdCB0aGF0IGFycml2ZWQgYmVmb3JlIHRoaXMgcGFnZSBoZWFkZXIgZXhpc3RlZC5cbiAgICAgIGNvbnN0IHBlbmRpbmcgPSBwZW5kaW5nU25hcHNob3RzLmdldChwYWdlLnVybCk7XG4gICAgICBpZiAocGVuZGluZykge1xuICAgICAgICAocGFnZU1zZyBhcyBQYWdlTWVzc2FnZVdpdGhTbmFwc2hvdCkuc25hcHNob3QgPSBwZW5kaW5nO1xuICAgICAgICBwZW5kaW5nU25hcHNob3RzLmRlbGV0ZShwYWdlLnVybCk7XG4gICAgICB9XG4gICAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIHBhZ2VNc2cpO1xuICAgICAgcG9zaXRpb24rKztcbiAgICB9XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBuZXdNc2cpO1xuICAgIHBlcnNpc3QoKTtcbiAgICAvLyBJbnRlbnRpb25hbGx5IE5PIHNldExhc3RBY3RpdmUoZW50cnkuc2VsZWN0b3IpIGhlcmUg4oCUIHRoZSB1c2VyIGFza2VkXG4gICAgLy8gZm9yIGZyZXNoIGNhcHR1cmVzIHRvIHN0YXkgdW4taGlnaGxpZ2h0ZWQgaW4gdGhlIHNpZGViYXIuIFRoZSBzdGlja3lcbiAgICAvLyByaW5nICsgbGFzdC1hY3RpdmUgb3V0bGluZSBub3cgb25seSBnZXQgYXBwbGllZCBvbiBleHBsaWNpdFxuICAgIC8vIGhvdmVyL2NsaWNrIG9mIHRoZSBzaWRlYmFyIGJ1YmJsZSAoYW5kIHRoZSBwYWdlLXNpZGUgZmxhc2ggZnJvbVxuICAgIC8vIGNhcHR1cmVFbnRyeSBzdGlsbCBjb25maXJtcyB0aGUgY2FwdHVyZSB2aXN1YWxseSBvbiB0aGUgcGFnZSkuXG4gICAgcmVuZGVyKCk7XG4gICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChuZXdNc2cpO1xuICAgIHZvaWQgZmlyZVBhZ2VTaG90SWZOZWVkZWQobmV3TXNnKTtcbiAgICB2b2lkIHJ1blZhbGlkYXRpb24oKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU2NyZWVuc2hvdCB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEZpcmUgdGhlIHBlci1lbGVtZW50IHNob3QsIGF0dGFjaCB0aGUgcmV0dXJuZWQgZmlsZW5hbWUgKyBkYXRhVXJsIG9udG9cbiAgLy8gdGhlIGVudHJ5LCBhbmQgcGVyc2lzdC4gc2hvdWxkU2tpcFNjcmVlbnNob3QgYmFpbHMgb24gaG9zdHMgaW4gdGhlXG4gIC8vIHVzZXIncyBza2lwIGxpc3Q7IGF1dG9TY3JlZW5zaG90PWZhbHNlIGJhaWxzIGdsb2JhbGx5LlxuICBjb25zdCBmaXJlRWxlbWVudFNob3QgPSBhc3luYyAobXNnOiBTZWxlY3Rvck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogYXV0b1NjcmVlbnNob3Q9ZmFsc2UnKTtcbiAgICAgIC8vIEJ1ZyAjMjogdGVsbCB0aGUgZXhwb3J0IHdoeSB0aGUgc2hvdCBpcyBtaXNzaW5nLlxuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7Li4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSwgdW5hdmFpbGFibGVSZWFzb246ICdhdXRvU2NyZWVuc2hvdE9mZid9O1xuICAgICAgLy8gUmUtcmVuZGVyIHNvIHRoZSByZXNlcnZlZCBza2VsZXRvbiAod2hpY2ggYXNzdW1lZCBhIHNob3Qgd2FzIGNvbWluZylcbiAgICAgIC8vIGNvbGxhcHNlcyBub3cgdGhhdCB3ZSBrbm93IG9uZSB3b24ndCBhcnJpdmUuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qgc2tpcHBlZDogaG9zdCBvbiBza2lwIGxpc3QnLCBtc2cuZW50cnkudXJsKTtcbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnc2tpcFNjcmVlbnNob3RIb3N0cyd9O1xuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCDihpInLCBtc2cuZW50cnkuc2VsZWN0b3IpO1xuICAgIC8vIFNXIGNvbGQtc3RhcnQgcmFjZTogdGhlIEZJUlNUIGNhcHR1cmUgaW4gYSBzZXNzaW9uIG9mdGVuIGxvc2VzIGl0c1xuICAgIC8vIGZpcnN0IG1lc3NhZ2UgYmVjYXVzZSB0aGUgYmcgd29ya2VyIGlzIHN0aWxsIHN0YXJ0aW5nLiBSZXRyeSBvbmNlXG4gICAgLy8gYWZ0ZXIgYSBzaG9ydCBkZWxheSBpZiB0aGUgZmlyc3QgY2FsbCBjb21lcyBiYWNrIG51bGwvZW1wdHkuXG4gICAgbGV0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1lbGVtZW50Jywgc2VsZWN0b3I6IG1zZy5lbnRyeS5zZWxlY3RvciwgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseSB8fCAoIXJlcGx5Lm9rICYmICFyZXBseS5lcnJvcikpIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcnN0IHNjcmVlbnNob3QgcmVwbHkgd2FzIGVtcHR5OyByZXRyeWluZyBhZnRlciAyMDBtcyAoU1cgY29sZC1zdGFydCknKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIDIwMCkpO1xuICAgICAgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTaG90UmVwbHk+KHtcbiAgICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKExPRywgJ2ZpcmVFbGVtZW50U2hvdCByZXBseTonLCByZXBseSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSB7XG4gICAgICBzZXRTdGF0dXMoYFNjcmVlbnNob3QgZmFpbGVkOiAke3JlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJ31gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgdW5hdmFpbGFibGVSZWFzb246IHJlcGx5Py5lcnJvciA/PyAnY2FwdHVyZUZhaWxlZCcsXG4gICAgICB9O1xuICAgICAgLy8gQ29sbGFwc2UgdGhlIHJlc2VydmVkIHNrZWxldG9uIOKAlCBubyBzaG90IGlzIGNvbWluZyBmb3IgdGhpcyBjYXB0dXJlLlxuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFN1Y2Nlc3NmdWwgcmV0cnkg4oCUIHN0cmlwIGFueSBwcmlvciB1bmF2YWlsYWJsZVJlYXNvbiBzaW5jZSB3ZSBub3dcbiAgICAvLyBoYXZlIGEgcmVhbCBzaG90LlxuICAgIGRlbGV0ZSBtc2cuZW50cnkuc2NyZWVuc2hvdD8udW5hdmFpbGFibGVSZWFzb247XG4gICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZWxlbWVudDogcmVwbHkuZmlsZW5hbWUsXG4gICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAuLi4ocmVwbHkuY3JvcCA/IHtjcm9wOiByZXBseS5jcm9wfSA6IHt9KSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90cygpO1xuICAgIH1cbiAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHtcbiAgICAgIHNob3RzRnVsbC5zZXQobXNnLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBGaXJlIHRoZSBncm91cCBzaG90ICh1bmlvbiBiYm94IG9mIGhlYWQgKyBhbGwgbWVtYmVycykgYW5kIHN0YXNoIHRoZVxuICAvLyBmaWxlbmFtZSBvbiB0aGUgaGVhZC1vZi1ncm91cCBlbnRyeS5cbiAgY29uc3QgZmlyZUdyb3VwU2hvdCA9IGFzeW5jIChoZWFkOiBTZWxlY3Rvck1lc3NhZ2UsIHNlbGVjdG9yczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KGhlYWQuZW50cnkudXJsKSkgcmV0dXJuO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1ncm91cCcsIHNlbGVjdG9ycywgbjogaGVhZC5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIGhlYWQuZW50cnkuc2NyZWVuc2hvdCA9IHtcbiAgICAgIC4uLihoZWFkLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgZ3JvdXA6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgaWYgKHJlcGx5LmRhdGFVcmwpIHtcbiAgICAgIHNob3RzLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5kYXRhVXJsKTtcbiAgICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkgeyBzaG90c0Z1bGwuc2V0KGhlYWQuZW50cnkuc2VsZWN0b3IsIHJlcGx5LmZ1bGxEYXRhVXJsKTsgcGVyc2lzdFNob3RzRnVsbCgpOyB9XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIFBhZ2UtbGV2ZWwgc2hvdCBvbmNlIHBlciAod29ya3NwYWNlLCBwYWdlLXVybCwgZGF5KS4gU3Vic2VxdWVudCBjYXB0dXJlc1xuICAvLyBvbiB0aGUgc2FtZSBwYWdlIHJldXNlIHRoZSBzYW1lIG9uLWRpc2sgZmlsZSBwYXRoLlxuICBjb25zdCBmaXJlUGFnZVNob3RJZk5lZWRlZCA9IGFzeW5jIChtc2c6IFNlbGVjdG9yTWVzc2FnZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcHJlZnMuYXV0b1NjcmVlbnNob3QpIHJldHVybjtcbiAgICBpZiAoc2hvdWxkU2tpcFNjcmVlbnNob3QobXNnLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICAvLyBQZXItY2FwdHVyZSBwYWdlLXNob3QgbW9kZSAowqc0LjUpOiB3aGVuIGVuYWJsZWQsIHNraXAgdGhlXG4gICAgLy8gcGVyLSh3b3Jrc3BhY2UsIHVybCkgZGVkdXBlIGFuZCBmaXJlIGEgZnJlc2ggcGFnZSBzaG90IGV2ZXJ5IHRpbWUuXG4gICAgLy8gVXNlZnVsIHdoZW4gdGhlIHBhZ2Ugc3RhdGUgY2hhbmdlcyBiZXR3ZWVuIGNhcHR1cmVzIChtb2RhbCBvcGVucyxcbiAgICAvLyBtdWx0aS1zdGVwIGZsb3csIGV0Yy4pIGFuZCB0aGUgdXNlciB3YW50cyB0byBzZWUgdGhlIHdob2xlIHBhZ2UgYXRcbiAgICAvLyBlYWNoIHN0ZXAuIENvc3RzIG9uZSBmdWxsLXBhZ2UgUE5HIHBlciBjYXB0dXJlLCBzbyBkZWZhdWx0IG9mZi5cbiAgICBpZiAoIXByZWZzLnBhZ2VTaG90UGVyQ2FwdHVyZSkge1xuICAgICAgY29uc3Qga2V5ID0gcGFnZVNob3RLZXkobXNnLmVudHJ5LnVybCk7XG4gICAgICBpZiAocGFnZVNob3RzRmlyZWQuaGFzKGtleSkpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kRXhpc3RpbmdQYWdlU2hvdChtc2cuZW50cnkudXJsKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgICAgICAuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICAgICAgcGFnZTogZXhpc3RpbmcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGFnZVNob3RzRmlyZWQuYWRkKGtleSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICBraW5kOiAnc2hvdC1wYWdlJywgbjogbXNnLmVudHJ5Lm4sIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgfSk7XG4gICAgaWYgKCFyZXBseT8ub2sgfHwgIXJlcGx5LmZpbGVuYW1lKSByZXR1cm47XG4gICAgLy8gQXBwbHkgdG8gVEhJUyBlbnRyeSBhbmQgdG8gYW55IG90aGVyIGVudHJpZXMgYWxyZWFkeSBjYXB0dXJlZCBvbiB0aGVcbiAgICAvLyBzYW1lIFVSTCB0b2RheSAoc28gdGhlIHBhZ2Utc2hvdCBhcHBlYXJzIHVuaWZvcm1seSkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gbXNnLmVudHJ5LnVybCkgY29udGludWU7XG4gICAgICBtLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLFxuICAgICAgICBwYWdlOiByZXBseS5maWxlbmFtZSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIFN0YXNoIHRoZSBmdWxsIFBORyBzbyB0aGUgd29ya3NwYWNlIGFyY2hpdmUgY2FuIGJ1bmRsZSBpdC4gS2V5ZWRcbiAgICAvLyBieSBVUkwgc2luY2UgcGFnZSBzaG90cyBhcmUgcGFnZS1zY29wZWQsIG5vdCBzZWxlY3Rvci1zY29wZWQuXG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KCdwYWdlOjonICsgbXNnLmVudHJ5LnVybCwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmluZCBhbnkgc2VsZWN0b3IgZW50cnkgb24gdGhpcyBVUkwgdGhhdCBhbHJlYWR5IGhhcyBhIGBwYWdlYCBzaG90XG4gIC8vIHJlY29yZGVkIOKAlCB1c2VkIHNvIHRoYXQgcmV0cm9hY3RpdmUgY2FwdHVyZXMgaW5oZXJpdCB0aGUgZXhpc3RpbmcgUE5HXG4gIC8vIHBhdGggaW5zdGVhZCBvZiByZWZpcmluZy5cbiAgY29uc3QgZmluZEV4aXN0aW5nUGFnZVNob3QgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSkgcmV0dXJuIG0uZW50cnkuc2NyZWVuc2hvdC5wYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBvbkhvdmVyID0gKHtzZWxlY3RvciwgbGFiZWwsIHRhZywgcmVjdH06IEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ2hvdmVyJ30+KTogdm9pZCA9PiB7XG4gICAgc2V0U3RhdHVzKGBBbHQtaG92ZXIgwrcgJHtsYWJlbH1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgLy8gSWRlbnRpdHkgaXMgKHNlbGVjdG9yLCB1cmwpLiBTYW1lIHNlbGVjdG9yIG9uIHR3byBkaWZmZXJlbnQgVVJMc1xuICAgIC8vIGlzIHR3byBkaWZmZXJlbnQgY2FwdHVyZXM7IHRoZSBwcmV2aW91cyBzZWxlY3Rvci1vbmx5IGxvb2t1cFxuICAgIC8vIGNhdXNlZCBjcm9zcy1wYWdlIGNvbW1lbnQgY29udGFtaW5hdGlvbi4gUHJlZmVyIHNhbWUtVVJMICtcbiAgICAvLyBzYW1lLXNlbGVjdG9yIGFzIHRoZSBzdHJvbmdlc3QgbWF0Y2guXG4gICAgY29uc3QgZXhpc3RpbmcgPSBmaW5kQ2FwdHVyZUZvckN1cnJlbnRQYWdlKHNlbGVjdG9yKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSBzY3JvbGxNZXNzYWdlSW50b1ZpZXcoZXhpc3RpbmcuaWQpO1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBjb2xsZWN0RmVlZGJhY2tBZnRlcihleGlzdGluZy5pZCk7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7dWlkOiBleGlzdGluZy5lbnRyeS51aWQsIG46IGV4aXN0aW5nLmVudHJ5Lm4sIGNhcHR1cmVkOiB0cnVlLCBmZWVkYmFja319KTtcbiAgICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXIoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBTFdBWVMgc2hvdyB0aGUgY29tbWVudCBib3gsIGV2ZW4gZm9yIHVuY2FwdHVyZWQgZWxlbWVudHMuIE9uIHN1Ym1pdFxuICAgICAgLy8gdGhlIGNvbnRlbnQgc2NyaXB0IHdpbGwgY2FwdHVyZSB0aGUgZWxlbWVudCBmaXJzdCwgdGhlbiBhdHRhY2ggdGhlXG4gICAgICAvLyBjb21tZW50IOKAlCB0dXJuaW5nIGhvdmVyLWNvbW1lbnQgaW50byBhIGNhcHR1cmUrY29tbWVudCBzaG9ydGN1dC5cbiAgICAgIHBoYW50b21UYXJnZXQgPSB7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3Q6IHJlY3QgYXMgdW5rbm93biBhcyBET01SZWN0fTtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbm5vdGF0aW9uJywgc2VsZWN0b3IsIHBheWxvYWQ6IHtjYXB0dXJlZDogZmFsc2UsIGZlZWRiYWNrOiBbXX19KTtcbiAgICAgIHJlbmRlclBoYW50b20oKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uSG92ZXJFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHN0YXR1cy50ZXh0Q29udGVudD8uc3RhcnRzV2l0aCgnQWx0LWhvdmVyJykpIHN0YXR1cy50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSB7IHBoYW50b21UYXJnZXQgPSBudWxsOyByZW5kZXJQaGFudG9tKCk7IH1cbiAgICAvLyBObyBhbm5vdGF0aW9uLWNsZWFyIGhlcmUg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBrZWVwcyB0aGUgYm94IG9wZW4gc28gdGhlXG4gICAgLy8gdXNlciBjYW4gbW91c2UgdG8gaXQgYW5kIHR5cGUuIE91dHNpZGUtY2xpY2sgLyBFc2MgZGlzbWlzcyBpdC5cbiAgfTtcblxuICBjb25zdCBjb2xsZWN0RmVlZGJhY2tBZnRlciA9IChzZWxlY3RvcklkOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKCFmb3VuZCkgeyBpZiAobS5pZCA9PT0gc2VsZWN0b3JJZCkgZm91bmQgPSB0cnVlOyBjb250aW51ZTsgfVxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJyB8fCBtLnR5cGUgPT09ICdwYWdlJykgYnJlYWs7XG4gICAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSBvdXQucHVzaChtLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IGNlbnRlckVsZW1lbnRJbkxpc3QgPSAoZWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgbGlzdFJlY3QgPSBsaXN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRhcmdldCA9IGxpc3Quc2Nyb2xsVG9wICsgZWxSZWN0LnRvcCAtIGxpc3RSZWN0LnRvcCAtIChsaXN0LmNsaWVudEhlaWdodCAvIDIpICsgKGVsUmVjdC5oZWlnaHQgLyAyKTtcbiAgICBsaXN0LnNjcm9sbFRvKHt0b3A6IE1hdGgubWF4KDAsIHRhcmdldCksIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICB9O1xuXG4gIGNvbnN0IHNjcm9sbE1lc3NhZ2VJbnRvVmlldyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGNlbnRlckVsZW1lbnRJbkxpc3QoZWwpO1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoLWludG8tdmlldycpO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gtaW50by12aWV3Jyk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFN0aWNreSBoaWdobGlnaHQgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3Qgc2V0TGFzdEFjdGl2ZSA9IChzZWxlY3Rvcjogc3RyaW5nIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc2Nyb2xsLXRvJywgc2VsZWN0b3IsIHN0aWNreTogdHJ1ZX0pO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBhcm1TdGlja3lFeHBpcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHN0aWNreVRpbWVyKTtcbiAgICBzdGlja3lUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcGFuZWxIb3ZlcmVkKSB7XG4gICAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzdGlja3ktY2xlYXInfSk7XG4gICAgICAgIGxhc3RBY3RpdmVTZWxlY3RvciA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yLmxhc3QtYWN0aXZlJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtYWN0aXZlJyk7XG4gICAgICB9IGVsc2UgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSwgU1RJQ0tZX1RUTF9NUyk7XG4gIH07XG5cbiAgLy8gRmFzdCBzdGlja3ktY2xlYXI6IHdoZW4gdGhlIHVzZXIncyBjdXJzb3IgbGVhdmVzIHRoZSBwYW5lbCwgZmlyZVxuICAvLyBzdGlja3ktY2xlYXIgYWZ0ZXIgYSAzMDAgbXMgZ3JhY2Ugd2luZG93LiBQcmlvciBiZWhhdmlvciB3YWl0ZWQgdGhlXG4gIC8vIGZ1bGwgU1RJQ0tZX1RUTF9NUyAofjUgcykgd2hpY2ggZmVsdCBsaWtlIHRoZSBwYWdlLXNpZGUgaGlnaGxpZ2h0XG4gIC8vIFwiZG9lc24ndCBnbyBhd2F5IGV2ZW4gYWZ0ZXIgSSB1bmhvdmVyXCIuIDMwMCBtcyBpcyBzaG9ydCBlbm91Z2ggdG9cbiAgLy8gZmVlbCByZXNwb25zaXZlIGJ1dCBsb25nIGVub3VnaCB0aGF0IGEgcXVpY2sgcmVwb3NpdGlvbiAoZS5nLlxuICAvLyBhY2NpZGVudGFsbHkgY3Jvc3NpbmcgdGhlIHNlYW0pIGRvZXNuJ3Qga2lsbCB0aGUgcmluZyBtaWQtZmxpZ2h0LlxuICBsZXQgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSB0cnVlO1xuICAgIGlmIChzdGlja3lDbGVhckdyYWNlKSB7IGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTsgc3RpY2t5Q2xlYXJHcmFjZSA9IDA7IH1cbiAgICBhcm1TdGlja3lFeHBpcnkoKTtcbiAgfSk7XG4gIGxpc3QuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBwYW5lbEhvdmVyZWQgPSBmYWxzZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgY2xlYXJUaW1lb3V0KHN0aWNreUNsZWFyR3JhY2UpO1xuICAgIHN0aWNreUNsZWFyR3JhY2UgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgLy8gQWxzbyBkcm9wIG91ciBvd24gZnJvbS1wYW5lbCArIG11bHRpIHJpbmdzIGluIGNhc2UgdGhleSBsZWFrZWQuXG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGVpciBtb3VzZSBpbnRvIHRoZSBwYW5lbCwgc3VwcHJlc3MgcGFnZS1zaWRlXG4gICAgLy8gYWx0LWhvdmVyIHN0YXRlIHNvIHRoZSBvcmFuZ2UgcmluZyBkb2Vzbid0IGtlZXAgZm9sbG93aW5nIHRoZSBjdXJzb3IuXG4gICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2FsdC1zdGF0ZScsIG9uOiBmYWxzZX0pO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgUmVuZGVyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBORUFSX0JPVFRPTV9QWCA9IDgwO1xuICBjb25zdCB3YXNOZWFyQm90dG9tID0gKCk6IGJvb2xlYW4gPT5cbiAgICBsaXN0LnNjcm9sbEhlaWdodCAtIGxpc3Quc2Nyb2xsVG9wIC0gbGlzdC5jbGllbnRIZWlnaHQgPD0gTkVBUl9CT1RUT01fUFg7XG5cbiAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9IChtOiBQYW5lbE1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBxID0gc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSByZXR1cm4gbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAvLyBNYXRjaCBhZ2FpbnN0IHRoZSBXSE9MRSBlbnRyeSAoc2VsZWN0b3IsIHRleHQsIGNsYXNzZXMsIGF0dHJzLFxuICAgICAgLy8gb3V0ZXJIVE1MLCBzdHlsZXMsIGV0Yy4pIHNvIHNlYXJjaCBoaXRzIGFueXRoaW5nIHZpc2libGUgaW4gdGhlXG4gICAgICAvLyBib2R5LWpzb24uIFN0cmluZ2lmeWluZyBvbmNlIGlzIGZpbmUg4oCUIHRoZSBjb3N0IGlzIHRpbnkgdnMgcmVuZGVyLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgfVxuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIChtLnVybCArICcgJyArIChtLnRpdGxlID8/ICcnKSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSBidWJibGUncyBib2R5LWpzb24gKG9yIG91dGVySFRNTCkgY29udGFpbnMgdGhlIHNlYXJjaCDigJRcbiAgLy8gdGVsbHMgcmVuZGVyU2VsZWN0b3IgdG8gYXV0by1leHBhbmQgc28gdGhlIHVzZXIgc2VlcyB0aGUgaGlnaGxpZ2h0ZWQgaGl0LlxuICBjb25zdCBib2R5TWF0Y2hlc1NlYXJjaCA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG0uZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gIH07XG5cbiAgY29uc3QgaW5zZXJ0UmFpbCA9IChiZWZvcmVJZDogc3RyaW5nKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnaW5zZXJ0LXJhaWwnO1xuICAgIGRpdi5kYXRhc2V0LmJlZm9yZUlkID0gYmVmb3JlSWQ7XG4gICAgaWYgKGluc2VydEJlZm9yZS5jdXJyZW50ID09PSBiZWZvcmVJZCkge1xuICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICBkaXYuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTsgcmVuZGVyKCk7IH0sXG4gICAgICAgIG9uU3VibWl0OiAodGV4dCkgPT4gc2VuZElubGluZSh0ZXh0KSxcbiAgICAgICAgYXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidG4uY2xhc3NOYW1lID0gJ2FkZC1idG4nO1xuICAgICAgYnRuLmRhdGFzZXQudGlwID0gJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZSc7XG4gICAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0luc2VydCBjYXB0dXJlIG9yIGNvbW1lbnQgaGVyZScpO1xuICAgICAgYnRuLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygncGx1cycsIDEyKTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBiZWZvcmVJZDsgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlOyByZW5kZXIoKTsgfSk7XG4gICAgICBkaXYuYXBwZW5kKGJ0bik7XG4gICAgfVxuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgdHlwZSBJbmxpbmVDb21tZW50T3B0cyA9IHtcbiAgICBpbml0aWFsPzogc3RyaW5nO1xuICAgIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDtcbiAgICBvblN1Ym1pdD86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgYXV0b2ZvY3VzPzogYm9vbGVhbjtcbiAgfTtcbiAgY29uc3QgYnVpbGRJbmxpbmVDb21tZW50ID0gKHtpbml0aWFsID0gJycsIG9uQ2FuY2VsLCBvblN1Ym1pdCwgYXV0b2ZvY3VzfTogSW5saW5lQ29tbWVudE9wdHMpOiBIVE1MRGl2RWxlbWVudCA9PiB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXAuY2xhc3NOYW1lID0gJ2lubGluZS1jb21tZW50JztcbiAgICBjb25zdCB0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgdGEudmFsdWUgPSBpbml0aWFsO1xuICAgIHRhLnJvd3MgPSAyO1xuICAgIHRhLnBsYWNlaG9sZGVyID0gJ0luc2VydCBhIGNvbW1lbnQgaGVyZSwgb3IgQWx0K0NsaWNrIHRvIGluc2VydCBhIGNhcHR1cmUnO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncm93JztcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIG1ldGEudGV4dENvbnRlbnQgPSAnMHcgwrcgMHQnO1xuICAgIC8vIEJvdGggU2F2ZSAvIENhbmNlbCBhcmUgdW5pZm9ybSBpY29uIGJ1dHRvbnMgKC5pY29uYnRuKS4gU2F2ZSB1c2VzIHRoZVxuICAgIC8vIHByaW1hcnkgYWNjZW50IHZhcmlhbnQgdmlhIC5wcmltYXJ5IHNvIGl0IHN0aWxsIHBvcHMsIGJ1dCBpdHMgd2lkdGhcbiAgICAvLyBtYXRjaGVzIENhbmNlbCBleGFjdGx5LlxuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIMK3IEVzYyc7XG4gICAgY2FuY2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDYW5jZWwgaW5saW5lIGNvbW1lbnQnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMjApO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uQ2FuY2VsPy4oKSk7XG4gICAgY29uc3Qgc2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbmQudHlwZSA9ICdidXR0b24nO1xuICAgIHNlbmQuY2xhc3NOYW1lID0gJ2ljb25idG4gcHJpbWFyeSc7XG4gICAgc2VuZC5kYXRhc2V0LnRpcCA9ICdTYXZlIMK3IEVudGVyJztcbiAgICBzZW5kLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdTYXZlIGlubGluZSBjb21tZW50Jyk7XG4gICAgc2VuZC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMjApO1xuICAgIGNvbnN0IHN1Ym1pdCA9ICgpOiB2b2lkID0+IG9uU3VibWl0Py4odGEudmFsdWUpO1xuICAgIHNlbmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXQpO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4geyBtZXRhLnRleHRDb250ZW50ID0gYCR7d29yZENvdW50KHRhLnZhbHVlKX13IMK3ICR7dG9rZW5Db3VudCh0YS52YWx1ZSl9dGA7IH0pO1xuICAgIHRhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHN1Ym1pdCgpOyB9XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBvbkNhbmNlbD8uKCk7XG4gICAgfSk7XG4gICAgcm93LmFwcGVuZChtZXRhLCBjYW5jZWwsIHNlbmQpO1xuICAgIHdyYXAuYXBwZW5kKHRhLCByb3cpO1xuICAgIGlmIChhdXRvZm9jdXMpIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0YS5mb2N1cygpKTtcbiAgICByZXR1cm4gd3JhcDtcbiAgfTtcblxuICBjb25zdCBzZW5kSW5saW5lID0gKHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRleHQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgIGlmICghdGV4dCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IGJlZm9yZUlkID0gaW5zZXJ0QmVmb3JlLmN1cnJlbnQ7XG4gICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgbGV0IHBvcyA9IGJlZm9yZUlkID8gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBiZWZvcmVJZCkgOiBtZXNzYWdlcy5sZW5ndGg7XG4gICAgaWYgKHBvcyA8IDApIHBvcyA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAvLyBwYXJlbnRVaWQgcmVzb2x1dGlvbjogd2FsayBiYWNrIGZyb20gdGhlIGluc2VydCBwb3NpdGlvbiB0byB0aGVcbiAgICAvLyBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3Rvci4gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgdGhlIEZLLlxuICAgIGxldCBwSWR4ID0gcG9zIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBmYjogRmVlZGJhY2tNZXNzYWdlID0ge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfTtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zLCAwLCBmYik7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnSW5zZXJ0ZWQnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQaGFudG9tID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBoYW50b20nKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwaGFudG9tVGFyZ2V0KSByZXR1cm47XG4gICAgY29uc3QgcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwaC5jbGFzc05hbWUgPSAncGhhbnRvbSB2aXNpYmxlJztcbiAgICBwaC5pbm5lckhUTUwgPSBgPGNvZGU+JHtlc2NhcGVIdG1sKHBoYW50b21UYXJnZXQubGFiZWwpfTwvY29kZT5gO1xuICAgIGxpc3QuYXBwZW5kKHBoKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICAvLyBSZW9yZGVyIGEgZmxhdCBtZXNzYWdlIGxpc3Qgc28gc2VsZWN0b3JzIHdpdGhpbiBlYWNoIHBhZ2UtZGVsaW1pdGVkXG4gIC8vIGJsb2NrIGFyZSBzb3J0ZWQgYnkgdGhlaXIgdmlzdWFsIHJlY3QgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KS5cbiAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciAoY2FwdHVyZVxuICAvLyBhZGphY2VuY3kpIHNvIGVkaXRpbmcvdGhyZWFkaW5nIGJlaGF2aW9yIHN1cnZpdmVzIHRoZSBzb3J0LlxuICAvL1xuICAvLyBVc2VkIE9OTFkgYnkgdGhlIGV4cG9ydCBwaXBlbGluZSAoYGJ1aWxkU2xpbWApLCBub3QgdGhlIHNpZGViYXJcbiAgLy8gcmVuZGVyLiBUaGUgc2lkZWJhciBrZWVwcyBtZXNzYWdlcyBpbiBpbnNlcnRpb24vY2FwdHVyZSBvcmRlciBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZW0gd2hlcmUgdGhleSBleHBlY3Q7IHRoZSBleHBvcnQgZ2V0cyB0aGUgYWdlbnQtXG4gIC8vIGZyaWVuZGx5IHJlYWRpbmctb3JkZXIgdHJlYXRtZW50LlxuICBjb25zdCByZW9yZGVyRm9yRXhwb3J0ID0gKG1zZ3M6IFBhbmVsTWVzc2FnZVtdKTogUGFuZWxNZXNzYWdlW10gPT4ge1xuICAgIHR5cGUgR3JvdXAgPSB7a2luZDogJ2dyb3VwJzsgc2VsOiBTZWxlY3Rvck1lc3NhZ2U7IHRyYWlsaW5nOiBGZWVkYmFja01lc3NhZ2VbXX07XG4gICAgdHlwZSBMb29zZSA9IHtraW5kOiAnbG9vc2UnOyBtOiBGZWVkYmFja01lc3NhZ2V9O1xuICAgIHR5cGUgU2xvdCA9IEdyb3VwIHwgTG9vc2UgfCB7a2luZDogJ3BhZ2UnOyBtOiBQYWdlTWVzc2FnZX07XG4gICAgY29uc3Qgc2xvdHM6IFNsb3RbXSA9IFtdO1xuICAgIGxldCBjdXJHcm91cDogR3JvdXAgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBmbHVzaEdyb3VwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKGN1ckdyb3VwKSB7IHNsb3RzLnB1c2goY3VyR3JvdXApOyBjdXJHcm91cCA9IG51bGw7IH1cbiAgICB9O1xuICAgIGZvciAoY29uc3QgbSBvZiBtc2dzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2hHcm91cCgpO1xuICAgICAgICBzbG90cy5wdXNoKHtraW5kOiAncGFnZScsIG19KTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgY3VyR3JvdXAgPSB7a2luZDogJ2dyb3VwJywgc2VsOiBtLCB0cmFpbGluZzogW119O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGV0YWNoZWQgY29tbWVudHMgbmV2ZXIgdHJhdmVsIHdpdGggdGhlIHByZWNlZGluZyBzZWxlY3RvcidzXG4gICAgICAgIC8vIGdyb3VwIOKAlCB0aGV5IHN0YXkgbG9vc2UgaW4gZXhwb3J0IG9yZGVyLlxuICAgICAgICBpZiAoY3VyR3JvdXAgJiYgIW0uZGV0YWNoZWQpIGN1ckdyb3VwLnRyYWlsaW5nLnB1c2gobSk7XG4gICAgICAgIGVsc2Ugc2xvdHMucHVzaCh7a2luZDogJ2xvb3NlJywgbX0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaEdyb3VwKCk7XG4gICAgY29uc3Qgb3V0OiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICAgIGxldCBydW5TdGFydCA9IDA7XG4gICAgY29uc3QgZmx1c2hSdW4gPSAoZW5kOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgICBjb25zdCBncm91cFJlY3RzOiBBcnJheTx7aWR4OiBudW1iZXI7IHk6IG51bWJlcjsgeDogbnVtYmVyfT4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSBydW5TdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByID0gcy5zZWwuZW50cnkucmVjdDtcbiAgICAgICAgICBncm91cFJlY3RzLnB1c2goe2lkeDogaSwgeTogcj8ueSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIHg6IHI/LnggPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5kaWNlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgZ3JvdXBSZWN0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnkgIT09IGIueSkgcmV0dXJuIGEueSAtIGIueTtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICAgIH0pO1xuICAgICAgbGV0IGdpID0gMDtcbiAgICAgIGZvciAoY29uc3QgaSBvZiBpbmRpY2VzKSB7XG4gICAgICAgIGNvbnN0IHMgPSBzbG90c1tpXSE7XG4gICAgICAgIGlmIChzLmtpbmQgPT09ICdncm91cCcpIHtcbiAgICAgICAgICBjb25zdCByZXBsYWNlbWVudElkeCA9IGdyb3VwUmVjdHNbZ2krK10hLmlkeDtcbiAgICAgICAgICBjb25zdCByID0gc2xvdHNbcmVwbGFjZW1lbnRJZHhdISBhcyBHcm91cDtcbiAgICAgICAgICBvdXQucHVzaChyLnNlbCk7XG4gICAgICAgICAgZm9yIChjb25zdCBmIG9mIHIudHJhaWxpbmcpIG91dC5wdXNoKGYpO1xuICAgICAgICB9IGVsc2UgaWYgKHMua2luZCA9PT0gJ2xvb3NlJykge1xuICAgICAgICAgIG91dC5wdXNoKHMubSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzbG90c1tpXSEua2luZCA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoUnVuKGkpO1xuICAgICAgICBvdXQucHVzaCgoc2xvdHNbaV0gYXMge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9KS5tKTtcbiAgICAgICAgcnVuU3RhcnQgPSBpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hSdW4oc2xvdHMubGVuZ3RoKTtcbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdGlja1RvQm90dG9tID0gbGlzdC5jaGlsZHJlbi5sZW5ndGggPT09IDAgfHwgd2FzTmVhckJvdHRvbSgpO1xuICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAvLyBTdGF0cyBudW1iZXJzXG4gICAgbGV0IHRvdGFsU2VsZWN0b3JzID0gMDtcbiAgICBsZXQgdG90YWxDb21tZW50cyA9IDA7XG4gICAgbGV0IHRvdGFsU3RhbGUgPSAwO1xuICAgIGNvbnN0IGRpc3RpbmN0UGFnZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgdG90YWxTZWxlY3RvcnMrKztcbiAgICAgICAgaWYgKHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSkgdG90YWxTdGFsZSsrO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHRvdGFsQ29tbWVudHMrKztcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtZXNzYWdlcy5zb21lKCh4KSA9PiB4LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgeC5lbnRyeS51cmwgPT09IG0udXJsKSkgZGlzdGluY3RQYWdlcy5hZGQobS51cmwpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic2VsZWN0b3JzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbFNlbGVjdG9ycyk7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cImNvbW1lbnRzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyh0b3RhbENvbW1lbnRzKTtcbiAgICBjb25zdCBzdGFsZU51bSA9IHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJzdGFsZVwiXSAuc3RhdC1udW0nKSE7XG4gICAgc3RhbGVOdW0udGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTdGFsZSk7XG4gICAgc3RhbGVOdW0uZGF0YXNldC56ZXJvID0gdG90YWxTdGFsZSA9PT0gMCA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInBhZ2VzXCJdIC5zdGF0LW51bScpIS50ZXh0Q29udGVudCA9IFN0cmluZyhkaXN0aW5jdFBhZ2VzLnNpemUpO1xuICAgIGNvbnN0IGV4cG9ydFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgc3RhdFRva2Vucy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcodG9rZW5Db3VudChleHBvcnRUZXh0KSkgOiAnMCc7XG4gICAgc3RhdFdvcmRzLnRleHRDb250ZW50ID0gZXhwb3J0VGV4dCA/IFN0cmluZyh3b3JkQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuXG4gICAgLy8gTWluaWZ5IHJlZHVjdGlvbiBzdGF0c1xuICAgIGxldCBmdWxsVCA9IDAsIGN1clQgPSAwLCBmdWxsVyA9IDAsIGN1clcgPSAwLCBwY3QgPSAwO1xuICAgIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICBjb25zdCB3YXNNaW4gPSBwcmVmcy5taW5pZnk7XG4gICAgICBwcmVmcy5taW5pZnkgPSB0cnVlOyBjb25zdCBtaW5UZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gZmFsc2U7IGNvbnN0IGZ1bGxUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgcHJlZnMubWluaWZ5ID0gd2FzTWluO1xuICAgICAgZnVsbFQgPSB0b2tlbkNvdW50KGZ1bGxUZXh0KTsgY3VyVCA9IHRva2VuQ291bnQobWluVGV4dCk7XG4gICAgICBmdWxsVyA9IHdvcmRDb3VudChmdWxsVGV4dCk7IGN1clcgPSB3b3JkQ291bnQobWluVGV4dCk7XG4gICAgICBwY3QgPSBmdWxsVCA+IDAgPyBNYXRoLnJvdW5kKCgxIC0gY3VyVCAvIGZ1bGxUKSAqIDEwMCkgOiAwO1xuICAgIH1cbiAgICBjb25zdCBtaW5pZnlTdGF0c0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1pbmlmeS1zdGF0c10nKTtcbiAgICBpZiAobWluaWZ5U3RhdHNFbCkge1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgJHtmdWxsVC50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJULnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke2Z1bGxXLnRvTG9jYWxlU3RyaW5nKCl9IOKGkiAke2N1clcudG9Mb2NhbGVTdHJpbmcoKX0gd29yZHMgwrcgJHtwY3R9JSByZWR1Y3Rpb25gO1xuICAgICAgfSBlbHNlIGlmIChleHBvcnRUZXh0KSB7XG4gICAgICAgIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSBgV291bGQgc2F2ZSAkeyhmdWxsVCAtIGN1clQpLnRvTG9jYWxlU3RyaW5nKCl9IHRva2VucyDCtyAke3BjdH0lIGlmIGVuYWJsZWRgO1xuICAgICAgfSBlbHNlIG1pbmlmeVN0YXRzRWwudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG5cbiAgICAvLyBQZXItY2hlY2tib3ggY29udHJpYnV0aW9uIHN0YXRzOiBob3cgbWFueSB0b2tlbnMvd29yZHMgZWFjaCB0b2dnbGVcbiAgICAvLyBhZGRzIHRvIHRoZSBjdXJyZW50IGV4cG9ydC4gQ29tcHV0ZWQgYnkgdG9nZ2xpbmcgdGhhdCBzaW5nbGUgcHJlZlxuICAgIC8vIGFuZCBkaWZmaW5nIHRoZSBleHBvcnQg4oCUIGdpdmVzIGFuIGhvbmVzdCBhbnN3ZXIgdGhhdCByZWZsZWN0cyB0aGVcbiAgICAvLyBjdXJyZW50IG1pbmlmeSBzdGF0ZSBhbmQgdGhlIHJlc3Qgb2YgdGhlIHRvZ2dsZXMuXG4gICAgY29uc3QgY29udHJpYktleXM6IEFycmF5PGtleW9mIFByZWZzPiA9IFsnaW5jbHVkZU91dGVySFRNTCcsICdpbmNsdWRlTWF0Y2hlZFJ1bGVzJywgJ2luY2x1ZGVTdHlsZXMnXTtcbiAgICBpZiAoZXhwb3J0VGV4dCAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJhc2VUID0gdG9rZW5Db3VudChleHBvcnRUZXh0KTtcbiAgICAgIGNvbnN0IGJhc2VXID0gd29yZENvdW50KGV4cG9ydFRleHQpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoIWVsKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qgd2FzT24gPSBwcmVmc1trZXldIGFzIGJvb2xlYW47XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSAhd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSB3YXNPbjtcbiAgICAgICAgY29uc3QgYWx0VCA9IHRva2VuQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIGNvbnN0IGFsdFcgPSB3b3JkQ291bnQoYWx0VGV4dCk7XG4gICAgICAgIC8vIHdhc09uPXRydWUg4oaSIGN1cnJlbnRseSBpbmNsdWRlZDsgY29zdCA9IGJhc2UgLSBhbHQgKHR1cm5pbmcgT0ZGIHNhdmVzIHRoaXMpLlxuICAgICAgICAvLyB3YXNPbj1mYWxzZSDihpIgY3VycmVudGx5IGV4Y2x1ZGVkOyBnYWluID0gYWx0IC0gYmFzZSAodHVybmluZyBPTiBhZGRzIHRoaXMpLlxuICAgICAgICBjb25zdCBkVCA9IHdhc09uID8gYmFzZVQgLSBhbHRUIDogYWx0VCAtIGJhc2VUO1xuICAgICAgICBjb25zdCBkVyA9IHdhc09uID8gYmFzZVcgLSBhbHRXIDogYWx0VyAtIGJhc2VXO1xuICAgICAgICBjb25zdCBzaWduID0gd2FzT24gPyAnJyA6ICcrJztcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB3YXNPblxuICAgICAgICAgID8gYMK3ICR7ZFQudG9Mb2NhbGVTdHJpbmcoKX0gdCDCtyAke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaW4gZXhwb3J0JHtwcmVmcy5taW5pZnkgPyAnIChtaW5pZmllZCknIDogJyd9YFxuICAgICAgICAgIDogYMK3ICR7c2lnbn0ke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtzaWdufSR7ZFcudG9Mb2NhbGVTdHJpbmcoKX0gdyBpZiBlbmFibGVkYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgY29udHJpYktleXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtY29udHJpYj1cIiR7a2V5fVwiXWApO1xuICAgICAgICBpZiAoZWwpIGVsLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG9vbGJhciBleHBvcnQgc3RhdHNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignLnN0YXQuZXhwb3J0LXN0YXRzJykuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgY29uc3QgbnVtID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbnVtJyk7XG4gICAgICBjb25zdCBsYWIgPSBzLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuc3RhdC1sYWJlbCcpO1xuICAgICAgaWYgKG51bSkgbnVtLnRleHRDb250ZW50ID0gbnVtLnRleHRDb250ZW50IS5yZXBsYWNlKC9cXCokLywgJycpO1xuICAgICAgaWYgKGxhYikgbGFiLnRleHRDb250ZW50ID0gbGFiLnRleHRDb250ZW50IS5yZXBsYWNlKC9eXFwqLywgJycpO1xuICAgICAgaWYgKHByZWZzLm1pbmlmeSAmJiBudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCArICcqJztcbiAgICAgIGNvbnN0IGlzVG9rZW4gPSBpID09PSAwO1xuICAgICAgY29uc3QgZnVsbFYgPSBpc1Rva2VuID8gZnVsbFQgOiBmdWxsVztcbiAgICAgIGNvbnN0IGN1clYgPSBpc1Rva2VuID8gY3VyVCA6IGN1clc7XG4gICAgICBjb25zdCB3aGljaCA9IGlzVG9rZW4gPyAndG9rZW5zJyA6ICd3b3Jkcyc7XG4gICAgICBzLmRhdGFzZXQudGlwID0gcHJlZnMubWluaWZ5XG4gICAgICAgID8gYE1JTklGSUVEIMK3ICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofVxcbkZ1bGwgd291bGQgYmUgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYFxuICAgICAgICA6IGAke2Z1bGxWLnRvTG9jYWxlU3RyaW5nKCl9ICR7d2hpY2h9IMK3IGZ1bGwgZXhwb3J0XFxuTWluaWZpZWQgd291bGQgYmUgJHtjdXJWLnRvTG9jYWxlU3RyaW5nKCl9IMK3IHNhdmVzICR7cGN0fSVgO1xuICAgIH0pO1xuXG4gICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cImVtcHR5LWljb25cIj7wn6SPPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS10aXRsZVwiPlN0YXJ0IHdpdGggdGhlIHBhZ2UgeW91IHdhbnQgdG8gY3JpdGlxdWUuPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1ib2R5XCI+T3BlbiBhIHBhZ2UsIHRoZW4gY2FwdHVyZSBhbiBlbGVtZW50LiBDb21tZW50cyBzdGF5IHBhaXJlZCB3aXRoIHRoZSB0aGluZyB5b3UgZ3JhYmJlZC48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LWtleXNcIj5BbHQrQ2xpY2sgdG8gY2FwdHVyZTwvZGl2PmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdG9yVXJscyA9IG5ldyBTZXQobWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkudXJsKSk7XG4gICAgY29uc3QgdmlzaWJsZU1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgIT09ICdwYWdlJyB8fCBzZWxlY3RvclVybHMuaGFzKG0udXJsKSk7XG4gICAgY29uc3QgcGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBCb29sZWFuKG0ucGlubmVkKSk7XG4gICAgY29uc3QgdW5waW5uZWQgPSB2aXNpYmxlTWVzc2FnZXMuZmlsdGVyKChtKSA9PiAhcGlubmVkLmluY2x1ZGVzKG0gYXMgU2VsZWN0b3JNZXNzYWdlKSk7XG4gICAgLy8gU2lkZWJhciBzaG93cyBjYXB0dXJlcyBpbiBJTlNFUlRJT04gb3JkZXIgKG1vc3QgcmVjZW50IGF0IHRoZVxuICAgIC8vIGJvdHRvbSkuIFZpc3VhbC1wb3NpdGlvbiByZW9yZGVyaW5nIGhhcHBlbnMgT05MWSBhdCBleHBvcnQgdGltZVxuICAgIC8vIHNvIHRoZSBzaWRlYmFyIHN0YXlzIHByZWRpY3RhYmxlIHdoaWxlIHRoZSBhZ2VudC1mYWNpbmcgZXhwb3J0XG4gICAgLy8gZ2V0cyByZWFkaW5nLW9yZGVyIGNvbnZlbmllbmNlLiAoUHJpb3IgaW1wbGVtZW50YXRpb24gc29ydGVkIGluXG4gICAgLy8gYm90aCBwbGFjZXM7IHVzZXIgZmVlZGJhY2sgd2FzIHRoYXQgc2lkZWJhciBzaHVmZmxpbmcgd2FzXG4gICAgLy8gZGlzb3JpZW50aW5nLilcbiAgICBjb25zdCBvcmRlcmVkID0gWy4uLnBpbm5lZCwgLi4udW5waW5uZWRdO1xuXG4gICAgbGlzdC5hcHBlbmQoaW5zZXJ0UmFpbChtZXNzYWdlc1swXSEuaWQpKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICAvLyBUcmFjayB0aGUgVVJMIG9mIHRoZSBtb3N0IHJlY2VudGx5IHJlbmRlcmVkIHBhZ2UgZGl2aWRlciBzbyB3ZSBjYW5cbiAgICAvLyBzdXBwcmVzcyBhIHJlcGVhdGVkIGhlYWRlciB3aGVuIGNvbnNlY3V0aXZlIGNhcHR1cmVzIHNoYXJlIHRoZSBzYW1lXG4gICAgLy8gcGFnZS4gUmVzdGF0aW5nIHRoZSBVUkwgYWJvdmUgZXZlcnkgY2FwdHVyZSBpbiBhIHNhbWUtVVJMIHJ1biBpc1xuICAgIC8vIG5vaXNlIOKAlCB0aGUgZGl2aWRlciBvbmx5IGVhcm5zIGl0cyBzcGFjZSB3aGVuIHRoZSBVUkwgYWN0dWFsbHlcbiAgICAvLyBjaGFuZ2VzIGZyb20gdGhlIHByZXZpb3VzIGNhcHR1cmUgaW4gc2VxdWVuY2UuXG4gICAgbGV0IGxhc3RSZW5kZXJlZFBhZ2VVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZW5kZXJlZEFueSA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JkZXJlZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbSA9IG9yZGVyZWRbaV0hO1xuICAgICAgaWYgKCFtYXRjaGVzU2VhcmNoKG0pKSBjb250aW51ZTtcbiAgICAgIC8vIENvbGxhcHNlIGNvbnNlY3V0aXZlIHNhbWUtVVJMIHBhZ2UgZGl2aWRlcnMgaW50byB0aGUgZmlyc3Qgb25lLlxuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGlmIChtLnVybCA9PT0gbGFzdFJlbmRlcmVkUGFnZVVybCkgY29udGludWU7XG4gICAgICAgIGxhc3RSZW5kZXJlZFBhZ2VVcmwgPSBtLnVybDtcbiAgICAgIH1cbiAgICAgIC8vIERldGFjaGVkIGNvbW1lbnRzIHJlbmRlciB1bnRocmVhZGVkIOKAlCBhZGphY2VuY3kgbXVzdCBub3QgcmUtYWRvcHRcbiAgICAgIC8vIGEgY29tbWVudCB0aGUgdXNlciBleHBsaWNpdGx5IGRpc2Fzc29jaWF0ZWQuXG4gICAgICBjb25zdCBhZGphY2VuY3kgPSBtLnR5cGUgPT09ICdmZWVkYmFjaycgJiYgbS5kZXRhY2hlZCA/IG51bGwgOiBsYXN0U2VsZWN0b3JTZWw7XG4gICAgICBjb25zdCBub2RlID0gcmVuZGVyTWVzc2FnZShtLCBhZGphY2VuY3kpO1xuICAgICAgbGlzdC5hcHBlbmQobm9kZSk7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBsYXN0U2VsZWN0b3JTZWwgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgaWYgKGkgPCBvcmRlcmVkLmxlbmd0aCAtIDEpIGxpc3QuYXBwZW5kKGluc2VydFJhaWwob3JkZXJlZFtpICsgMV0hLmlkKSk7XG4gICAgICByZW5kZXJlZEFueSA9IHRydWU7XG4gICAgfVxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwoJ19fZW5kX18nKSk7XG4gICAgaWYgKCFyZW5kZXJlZEFueSAmJiBzZWFyY2hRdWVyeSkge1xuICAgICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVtcHR5LmNsYXNzTmFtZSA9ICdlbXB0eSc7XG4gICAgICBlbXB0eS50ZXh0Q29udGVudCA9IGBObyBtYXRjaGVzIGZvciBcIiR7c2VhcmNoUXVlcnl9XCIuYDtcbiAgICAgIGxpc3QuYXBwZW5kKGVtcHR5KTtcbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgcmVuZGVyUGVuZGluZ0JheSgpO1xuICAgIGlmIChwaGFudG9tVGFyZ2V0KSByZW5kZXJQaGFudG9tKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgaWYgKHN0aWNrVG9Cb3R0b20pIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IGxpc3Quc2Nyb2xsVG9wID0gbGlzdC5zY3JvbGxIZWlnaHQ7IH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBlbmRpbmdCYXkgPSAoKTogdm9pZCA9PiB7XG4gICAgbGlzdC5xdWVyeVNlbGVjdG9yKCcucGVuZGluZy1iYXknKT8ucmVtb3ZlKCk7XG4gICAgaWYgKCFwZW5kaW5nTXVsdGkubGVuZ3RoKSByZXR1cm47XG4gICAgY29uc3QgYmF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYmF5LmNsYXNzTmFtZSA9ICdwZW5kaW5nLWJheSc7XG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGVhZCc7XG4gICAgaGVhZC50ZXh0Q29udGVudCA9IGBQZW5kaW5nIGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH0gZWxlbWVudCR7cGVuZGluZ011bHRpLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWA7XG4gICAgYmF5LmFwcGVuZChoZWFkKTtcbiAgICBwZW5kaW5nTXVsdGkuZm9yRWFjaCgoZSwgaSkgPT4ge1xuICAgICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2FyZC5jbGFzc05hbWUgPSAncGVuZGluZy1jYXJkJztcbiAgICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHNlcS5jbGFzc05hbWUgPSAnc2VxJztcbiAgICAgIHNlcS50ZXh0Q29udGVudCA9IGAjJHtpICsgMX1gO1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IChlLnRleHQgJiYgZS50ZXh0Lmxlbmd0aCA8PSA2MCA/IGUudGV4dCA6IChlLmNvbXBvbmVudFJvb3QgPz8gZS5zZWxlY3RvciA/PyBlLnRhZykpO1xuICAgICAgY2FyZC5hcHBlbmQoc2VxLCBsYWJlbCk7XG4gICAgICBiYXkuYXBwZW5kKGNhcmQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJvdy5jbGFzc05hbWUgPSAncGVuZGluZy1yb3cnO1xuICAgIGNvbnN0IGNvbW1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbW1pdC50eXBlID0gJ2J1dHRvbic7XG4gICAgY29tbWl0LmNsYXNzTmFtZSA9ICdwcmltYXJ5IHBlbmRpbmctY29tbWl0JztcbiAgICBjb21taXQudGV4dENvbnRlbnQgPSBgQ29tbWl0IGdyb3VwIMK3ICR7cGVuZGluZ011bHRpLmxlbmd0aH1gO1xuICAgIGNvbW1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jb21taXQnfSkpO1xuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2FuY2VsLmNsYXNzTmFtZSA9ICdpY29uYnRuIHBlbmRpbmctY2FuY2VsJztcbiAgICBjYW5jZWwuZGF0YXNldC50aXAgPSAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnO1xuICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIHBlbmRpbmcgZ3JvdXAnKTtcbiAgICBjYW5jZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSkpO1xuICAgIHJvdy5hcHBlbmQoY29tbWl0LCBjYW5jZWwpO1xuICAgIGJheS5hcHBlbmQocm93KTtcbiAgICBjb25zdCBoaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGludC5jbGFzc05hbWUgPSAncGVuZGluZy1oaW50JztcbiAgICBoaW50LnRleHRDb250ZW50ID0gJ0FsdCtTaGlmdCtDbGljayBtb3JlIMK3IENvbW1pdCB0byBmaW5hbGl6ZSDCtyBFc2MgdG8gY2FuY2VsJztcbiAgICBiYXkuYXBwZW5kKGhpbnQpO1xuICAgIGxpc3QuYXBwZW5kKGJheSk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIE5vb2RsZXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGNsZWFyTm9vZGxlcyA9ICgpOiB2b2lkID0+IHsgZm9yIChjb25zdCBuIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLnRyZWUtbm9vZGxlJykpIG4ucmVtb3ZlKCk7IH07XG5cbiAgLy8gQ3Jvc3Mtc2VhbSBwYW5lbOKGlGNhbnZhcyBub29kbGVzIHdlcmUgcmVtb3ZlZDogYWxpZ25pbmcgdHdvIFNWRyBoYWx2ZXNcbiAgLy8gYWNyb3NzIHRoZSBwYW5lbC9wYWdlIGJvdW5kYXJ5IGRlcGVuZGVkIG9uIGlubmVySGVpZ2h0IHBhcml0eSB3aGljaFxuICAvLyBicmVha3MgdW5kZXIgRGV2VG9vbHMgZG9jayBhbmQgem9vbSwgYW5kIHRoZSB2aXN1YWwgYmVuZWZpdCBkaWRuJ3RcbiAgLy8ganVzdGlmeSB0aGUgbWFpbnRlbmFuY2UgY29zdC4gVGhlIGluLXBhbmVsIGZlZWRiYWNrLXRyZWUgbm9vZGxlc1xuICAvLyAoZHJhd05vb2RsZSAvIHJlZHJhd05vb2RsZXMgYmVsb3cpIGFyZSB1bmFmZmVjdGVkLlxuICBjb25zdCBjbGVhckJ1YmJsZU5vb2RsZSA9ICgpOiB2b2lkID0+IHsgLyogbm8tb3AgKi8gfTtcbiAgY29uc3QgcmVkcmF3Tm9vZGxlcyA9ICgpOiB2b2lkID0+IHtcbiAgICBjbGVhck5vb2RsZXMoKTtcbiAgICBsZXQgbGFzdFNlbGVjdG9yRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIFsuLi5saXN0LmNoaWxkcmVuXSBhcyBIVE1MRWxlbWVudFtdKSB7XG4gICAgICBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RvcicpKSBsYXN0U2VsZWN0b3JFbCA9IG5vZGU7XG4gICAgICAvLyBPbmx5IFRIUkVBREVEIGNvbW1lbnRzIGdldCBhIGNvbm5lY3RvciDigJQgYSBkZXRhY2hlZCBjb21tZW50IG11c3RcbiAgICAgIC8vIGxvc2UgaXRzIG5vb2RsZSwgbm90IGp1c3QgaXRzIGluZGVudCAodGhlIHZpc2libGUgXCJkaXNjb25uZWN0XCIpLlxuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWVkYmFjaycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aHJlYWRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCBub2RlKTtcbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtcmFpbCcpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5pbmxpbmUtY29tbWVudCcpID8/IG5vZGU7XG4gICAgICAgIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIHRhcmdldCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRpdmlkZXInKSB8fCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZ3JvdXAtaGVhZCcpKSB7XG4gICAgICAgIGxhc3RTZWxlY3RvckVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGRyYXdOb29kbGUgPSAoc2VsZWN0b3JFbDogSFRNTEVsZW1lbnQsIGZlZWRiYWNrRWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc1IgPSBzZWxlY3RvckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGZSID0gZmVlZGJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBsUiA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgeDEgPSBzUi5sZWZ0IC0gbFIubGVmdCArIDEyO1xuICAgIGNvbnN0IHkxID0gc1IuYm90dG9tIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3A7XG4gICAgY29uc3QgeDIgPSBmUi5sZWZ0IC0gbFIubGVmdDtcbiAgICBjb25zdCB5MiA9IGZSLnRvcCAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wICsgMTQ7XG4gICAgY29uc3QgdyA9IE1hdGgubWF4KDIwLCB4MiAtIHgxICsgNCk7XG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDIwLCB5MiAtIHkxKTtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RyZWUtbm9vZGxlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcodykpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFN0cmluZyhoKSk7XG4gICAgc3ZnLnN0eWxlLmxlZnQgPSBgJHt4MSAtIDJ9cHhgO1xuICAgIHN2Zy5zdHlsZS50b3AgPSBgJHt5MX1weGA7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIGNvbnN0IHN4ID0gMiwgc3kgPSAwLCBleCA9IHcgLSAyLCBleSA9IGg7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBgTSAke3N4fSAke3N5fSBDICR7c3h9ICR7c3kgKyBoICogMC41NX0sICR7ZXggLSB3ICogMC40fSAke2V5fSwgJHtleH0gJHtleX1gKTtcbiAgICBzdmcuYXBwZW5kKHBhdGgpO1xuICAgIGxpc3QuYXBwZW5kKHN2Zyk7XG4gIH07XG4gIGxldCBzY3JvbGxSYWYgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmFmKSByZXR1cm47XG4gICAgc2Nyb2xsUmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgc2Nyb2xsUmFmID0gMDsgcmVkcmF3Tm9vZGxlcygpOyB9KTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZWRyYXdOb29kbGVzKTtcblxuICAvLyDilIDilIDilIAgUGVyLW1lc3NhZ2UgcmVuZGVyZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCByZW5kZXJNZXNzYWdlID0gKG06IFBhbmVsTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIHJlbmRlclBhZ2UobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHJlbmRlclNlbGVjdG9yKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiByZW5kZXJGZWVkYmFjayhtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQYWdlID0gKG06IFBhZ2VNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkLmNsYXNzTmFtZSA9ICdwYWdlLWRpdmlkZXInO1xuICAgIGQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgY29uc3QgdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdHMuY2xhc3NOYW1lID0gJ3RhYi1zdGF0dXMnO1xuICAgIHRzLmRhdGFzZXQudXJsID0gbS51cmw7XG4gICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB0cy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgZC5hcHBlbmQodHMpO1xuICAgIGNvbnN0IHUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdS5jbGFzc05hbWUgPSAndXJsJztcbiAgICB1LnRleHRDb250ZW50ID0gbS51cmw7XG4gICAgdS5kYXRhc2V0LnRpcCA9IGAke20udGl0bGUgPz8gJyd9IMK3ICR7bS51cmx9YDtcbiAgICBkLmFwcGVuZCh1KTtcbiAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBvbiB0aGlzIHBhZ2UgaW4gdGhlIGFjdGl2ZSB0YWIsIGNsaWNraW5nIHRoZSBVUkxcbiAgICAgIC8vIHNob3VsZG4ndCByZWxvYWQgb3Igc3RlYWwgZm9jdXMg4oCUIGl0IHNob3VsZCBqdXN0IGJlIGEgbm8tb3BcbiAgICAgIC8vIHZpc3VhbGx5ICh0aGUgcm93IGFscmVhZHkgaW5kaWNhdGVzIFwib3BlblwiIHZpYSAudGFiLXN0YXR1cykuIFRoZVxuICAgICAgLy8gdXNlciBjb21wbGFpbmVkIGFib3V0IGdldHRpbmcgZm9yY2VkIGludG8gYSBuYXZpZ2F0aW9uIHdoZW4gdGhleVxuICAgICAgLy8gd2VyZSBqdXN0IHRyeWluZyB0byByZWFkIHRoZSByb3cuXG4gICAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHtcbiAgICAgICAgc2V0U3RhdHVzKCdBbHJlYWR5IG9uIHRoaXMgcGFnZScsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgciA9IGF3YWl0IHNlbmRUb0JnPHtmb3VuZD86IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcjsgZXJyb3I/OiBzdHJpbmd9Pih7a2luZDogJ3N3aXRjaC10by10YWInLCB1cmw6IG0udXJsLCBvcGVuSWZNaXNzaW5nOiB0cnVlfSk7XG4gICAgICBpZiAocj8uZm91bmQpIHNldFN0YXR1cygnU3dpdGNoZWQgdG8gdGFiJyk7XG4gICAgICBlbHNlIGlmIChyPy5vcGVuZWQpIHNldFN0YXR1cygnT3BlbmVkIGluIG5ldyB0YWInKTtcbiAgICAgIGVsc2Ugc2V0U3RhdHVzKFwiQ291bGRuJ3Qgb3BlbiB0YWJcIiwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pO1xuICAgIHJldHVybiBkO1xuICB9O1xuXG4gIGNvbnN0IHRpdGxlRnJvbUVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXN0SWQpIHJldHVybiBgW3Rlc3RJZD0ke2UudGVzdElkfV1gO1xuICAgIGlmIChlLmlkKSByZXR1cm4gYCMke2UuaWR9YDtcbiAgICBpZiAoZS5jbGFzc2VzPy5sZW5ndGgpIHJldHVybiBgJHtlLnRhZ30uJHtlLmNsYXNzZXMuc2xpY2UoMCwgMikuam9pbignLicpfWA7XG4gICAgcmV0dXJuIGUuc2VsZWN0b3IgfHwgZS50YWcgfHwgJyh1bmtub3duKSc7XG4gIH07XG5cbiAgLy8gUGljayB0aGUgbW9zdCBcImh1bWFubHkgcmVhZGFibGVcIiBsYWJlbCBmb3IgdGhlIGJ1YmJsZSBwcmV2aWV3LiBQcmVmZXJzXG4gIC8vIHZpc2libGUtdG8tdXNlciB0ZXh0IGluIHRoaXMgcHJpb3JpdHk6XG4gIC8vICAgMS4gaW5uZXJUZXh0IC8gdGV4dENvbnRlbnQgKGBlbnRyeS50ZXh0YCkg4oCUIHdoYXQgdGhlIHVzZXIgcmVhZHMgb24gc2NyZWVuXG4gIC8vICAgMi4gYWNjZXNzaWJsZU5hbWUgKGFyaWEtbGFiZWwgLyB0aXRsZSAvIGFsdCBmYWxsYmFjayBjaGFpbilcbiAgLy8gICAzLiBpbnB1dCB2YWx1ZSAoc2tpcHBlZCBpZiBpdCdzIHRoZSBtYXNrZWQgcGFzc3dvcmQgcGxhY2Vob2xkZXIpXG4gIC8vICAgNC4gaW5wdXQgcGxhY2Vob2xkZXJcbiAgLy8gICA1LiBpbWcgYWx0XG4gIC8vICAgNi4gY29tcG9uZW50Um9vdCAoZS5nLiBcImJ1dHRvbiNjdGFcIilcbiAgLy8gICA3LiB0aXRsZUZyb21FbnRyeSDigJQgbGFzdC1yZXNvcnQgdGFnL2NsYXNzL2lkIGZhbGxiYWNrXG4gIC8vIENTUyBoYW5kbGVzIHZpc3VhbCB0cnVuY2F0aW9uIHZpYSB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3ZSBzaGlwIHRoZVxuICAvLyBmdWxsIHN0cmluZyBzbyB0aGUgdG9vbHRpcCBvbiBob3ZlciBjYW4gc2hvdyB0aGUgY29tcGxldGUgdmFsdWUuXG4gIGNvbnN0IG5pY2VMYWJlbCA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGV4dCkgcmV0dXJuIGUudGV4dDtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSkgcmV0dXJuIGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgY29uc3QgdiA9IGUuYXR0cnM/LnZhbHVlO1xuICAgIGlmICh2ICYmIHYgIT09ICfigKLigKLigKLigKInKSByZXR1cm4gdjtcbiAgICBpZiAoZS5hdHRycz8ucGxhY2Vob2xkZXIpIHJldHVybiBlLmF0dHJzLnBsYWNlaG9sZGVyO1xuICAgIGlmIChlLmF0dHJzPy5hbHQpIHJldHVybiBlLmF0dHJzLmFsdDtcbiAgICBpZiAoZS5jb21wb25lbnRSb290KSByZXR1cm4gZS5jb21wb25lbnRSb290O1xuICAgIHJldHVybiB0aXRsZUZyb21FbnRyeShlKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTZWxlY3RvciA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgdmFsaWQgPSBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzYW1lUGF0aCA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJykgPT09IGxpdmVUYWJQYXRoO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIHNlbGVjdG9yJztcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlICYmIHNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhbGUnKTtcbiAgICBlbHNlIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgIXNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnZGlmZi1wYWdlJyk7XG4gICAgaWYgKG0ucGlubmVkKSBkaXYuY2xhc3NMaXN0LmFkZCgncGlubmVkJyk7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2hhcy1ncm91cCcpO1xuICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yID09PSBsYXN0QWN0aXZlU2VsZWN0b3IpIGRpdi5jbGFzc0xpc3QuYWRkKCdsYXN0LWFjdGl2ZScpO1xuICAgIC8vIEF1dG8tZXhwYW5kIG9uIHNlYXJjaCBoaXQgc28gdGhlIHVzZXIgc2VlcyB3aGVyZSB0aGUgbWF0Y2ggbGFuZGVkLlxuICAgIGNvbnN0IG1hdGNoZWRCb2R5ID0gYm9keU1hdGNoZXNTZWFyY2gobSk7XG4gICAgaWYgKG1hdGNoZWRCb2R5KSBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnLCAnc2VhcmNoLWhpdCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuZGF0YXNldC5zZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgLy8gRHJhZy10by1yZXBhcmVudDogZXZlcnkgc2VsZWN0b3IgYnViYmxlIGlzIGEgdmFsaWQgZHJvcCB0YXJnZXQgZm9yXG4gICAgLy8gYSBjb21tZW50IGJlaW5nIGRyYWdnZWQgZnJvbSBlbHNld2hlcmUgaW4gdGhlIHNpZGViYXIuXG4gICAgd2lyZVNlbGVjdG9yRHJvcFRhcmdldChkaXYsIG0pO1xuXG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ2hlYWQnO1xuICAgIGNvbnN0IGNhcmV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNhcmV0LmNsYXNzTmFtZSA9ICdjYXJldCc7XG4gICAgY2FyZXQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGV2cm9uLXJpZ2h0JywgMTIpO1xuICAgIGhlYWQuYXBwZW5kKGNhcmV0KTtcbiAgICBjb25zdCBwaW5NYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcGluTWFya2VyLmNsYXNzTmFtZSA9ICdwaW4tbWFya2VyJztcbiAgICBwaW5NYXJrZXIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdzdGFyLWZpbGxlZCcsIDExKTtcbiAgICBoZWFkLmFwcGVuZChwaW5NYXJrZXIpO1xuICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgc2VxLnRleHRDb250ZW50ID0gYCMke20uZW50cnkubn1gO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIHNlcS50ZXh0Q29udGVudCArPSBgKyR7bS5lbnRyeS5ncm91cC5sZW5ndGh9YDtcbiAgICBoZWFkLmFwcGVuZChzZXEpO1xuICAgIGNvbnN0IGNvbXBhY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29tcGFjdC5jbGFzc05hbWUgPSAnY29tcGFjdCc7XG4gICAgY29uc3QgY29tcGFjdFN0ciA9IG5pY2VMYWJlbChtLmVudHJ5KTtcbiAgICBjb21wYWN0LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGNvbXBhY3RTdHIsIHNlYXJjaFF1ZXJ5KTtcbiAgICAvLyBTaG93IHRoZSBmdWxsIGxhYmVsIG9uIGhvdmVyIGV2ZW4gd2hlbiBDU1MgZWxsaXBzaXMgdHJ1bmNhdGVzIHRoZVxuICAgIC8vIHZpc2libGUgcG9ydGlvbiDigJQgdXNlZnVsIHdoZW4gdGhlIHZpc2libGUgdGV4dC9wbGFjZWhvbGRlciBpcyBsb25nLlxuICAgIGlmIChjb21wYWN0U3RyLmxlbmd0aCA+IDI0KSBjb21wYWN0LmRhdGFzZXQudGlwID0gY29tcGFjdFN0cjtcbiAgICBoZWFkLmFwcGVuZChjb21wYWN0KTtcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9IHIgPyBgJHtyLnd9w5cke3IuaH1gIDogKG0uZW50cnkudGFnID8/ICcnKTtcbiAgICBoZWFkLmFwcGVuZChtZXRhKTtcbiAgICBkaXYuYXBwZW5kKGhlYWQpO1xuXG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzdW1tYXJ5LmNsYXNzTmFtZSA9ICdwZWVrLXN1bW1hcnknO1xuICAgIHN1bW1hcnkuaW5uZXJIVE1MID0gYDxzcGFuIGRhdGEtaWNvbj1cImFsZXJ0LWNpcmNsZVwiIGRhdGEtc2l6ZT1cIjExXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ0XCI+JHtkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWZmLXBhZ2UnKSA/ICdkaWZmZXJlbnQgcGFnZScgOiAnc3RhbGUnfTwvc3Bhbj5gO1xuICAgIGhlYWQuYXBwZW5kKHN1bW1hcnkpO1xuICAgIG1vdW50SWNvbnMoc3VtbWFyeSk7XG5cbiAgICBjb25zdCBlcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnIuY2xhc3NOYW1lID0gJ3BlZWstZXJyb3InO1xuICAgIGNvbnN0IHJlYXNvbiA9IHNlbGVjdG9yRXJyb3JzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBwYXRoRnJvbUVudHJ5ID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKTtcbiAgICBlcnIuaW5uZXJIVE1MID0gc2FtZVBhdGhcbiAgICAgID8gYDxiPlN0YWxlPC9iPiDCtyAke2VzY2FwZUh0bWwocmVhc29uID8/ICdubyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcy4nKX08YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gXG4gICAgICA6IGBDYXB0dXJlZCBvbiA8Y29kZT4ke2VzY2FwZUh0bWwocGF0aEZyb21FbnRyeSl9PC9jb2RlPiDigJQgY3VycmVudCB0YWIgaXMgPGNvZGU+JHtlc2NhcGVIdG1sKGxpdmVUYWJQYXRoID8/ICcnKX08L2NvZGU+LiBTd2l0Y2ggdGFicyB0byB2YWxpZGF0ZS48YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gO1xuICAgIGRpdi5hcHBlbmQoZXJyKTtcblxuICAgIC8vIEFuY2VzdG9yIGJyZWFkY3J1bWIg4oCUIFBsYXNtaWMtc3R5bGUgZXNjYWxhdG9yLiBDaGlwcyBmb3IgZWFjaCBlbnRyeSBpblxuICAgIC8vIGVudHJ5LmFuY2VzdG9ycyAoY2xvc2VzdCBmaXJzdCkuIENsaWNrIGEgY2hpcCB0byBjYXB0dXJlIHRoYXRcbiAgICAvLyBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIChkZXB0aCA9IGNoaXAgaW5kZXggKyAxIHNpbmNlIHRoZSBlbnRyeSdzXG4gICAgLy8gb3duIHNlbGVjdG9yIGlzIGRlcHRoIDApLiBCcmlnaHRuZXNzIGdyYWRpZW50IGRhcmtlbnMgZGVlcGVyIGNoaXBzLlxuICAgIGlmIChtLmVudHJ5LmFuY2VzdG9ycz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjcnVtYnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNydW1icy5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY3J1bWJzJztcbiAgICAgIGNydW1icy5kYXRhc2V0LnRpcCA9ICdDbGljayBhIGNydW1iIHRvIGVzY2FsYXRlIHRoZSBjYXB0dXJlIHRvIGFuIGFuY2VzdG9yIGVsZW1lbnQnO1xuICAgICAgbS5lbnRyeS5hbmNlc3RvcnMuZm9yRWFjaCgoYW5jLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2hpcC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGNoaXAuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNoaXAnO1xuICAgICAgICAvLyBCcmlnaHRuZXNzIGdyYWRpZW50OiBkZWVwZXIgY2hpcHMgZ2V0IHByb2dyZXNzaXZlbHkgZGltbWVyLlxuICAgICAgICBjaGlwLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7KDEgLSBpICogMC4wOCkudG9GaXhlZCgyKX0pYDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBhbmMudGVzdElkID8gYFske2FuYy50ZXN0SWR9XWBcbiAgICAgICAgICA6IGFuYy5pZCA/IGAjJHthbmMuaWR9YFxuICAgICAgICAgIDogYW5jLmNsYXNzZXM/Lmxlbmd0aCA/IGAke2FuYy50YWd9LiR7YW5jLmNsYXNzZXNbMF19YFxuICAgICAgICAgIDogYW5jLnRhZztcbiAgICAgICAgY2hpcC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjaGlwLmRhdGFzZXQudGlwID0gYENhcHR1cmUgdGhlIGFuY2VzdG9yICR7aSArIDF9IGxldmVsJHtpID8gJ3MnIDogJyd9IHVwIMK3ICR7YW5jLnRhZ30ke2FuYy5pZCA/ICcjJyArIGFuYy5pZCA6ICcnfWA7XG4gICAgICAgIC8vIEhvdmVyLXByZXZpZXcgdGhlIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2Ugc28gdGhlIHVzZXIgY2FuIHNlZVxuICAgICAgICAvLyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNvbW1pdHRpbmcuIE1pcnJvcnMgaG93XG4gICAgICAgIC8vIGhvdmVyaW5nIGEgc2VsZWN0b3IgYnViYmxlIHBhaW50cyBpdHMgcmluZy4gQ2xlYXJpbmcgb25cbiAgICAgICAgLy8gbW91c2VsZWF2ZSBzd2FwcyBiYWNrIHRvIHRoZSBidWJibGUncyBvd24gb3V0bGluZSAodGhlIGJ1YmJsZSdzXG4gICAgICAgIC8vIG1vdXNlZW50ZXIgaGFuZGxlciBwYWludGVkIGl0OyBsZWF2aW5nIHRoZSBjaGlwIGp1c3QgcmVtb3Zlc1xuICAgICAgICAvLyB0aGUgb3ZlcnJpZGUpLlxuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gUmUtcGFpbnQgdGhlIGJ1YmJsZSdzIG93biByaW5nIHJhdGhlciB0aGFuIGNsZWFyaW5nIGVudGlyZWx5XG4gICAgICAgICAgLy8gc28gdGhlIHVzZXIgZG9lc24ndCBzZWUgYSBmbGlja2VyIG9mIFwibm90aGluZ1wiIGJldHdlZW4gY2hpcHMuXG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7XG4gICAgICAgICAgICBraW5kOiAnY2FwdHVyZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDEsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKGBDYXB0dXJlZCBhbmNlc3RvciAke2FuYy50YWd9YCk7XG4gICAgICAgICAgZWxzZSBzZXRTdGF0dXMoJ0NvdWxkIG5vdCBjYXB0dXJlIGFuY2VzdG9yJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICB9KTtcbiAgICAgICAgY3J1bWJzLmFwcGVuZChjaGlwKTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFwcGVuZChjcnVtYnMpO1xuICAgIH1cblxuICAgIC8vIFByZXZpZXcgdGlsZS4gVGhlIGZ1bGwgUE5HIGxpdmVzIG9uIGRpc2sgdW5kZXJcbiAgICAvLyAucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvOyB0aGUgZGF0YVVybCBpcyBhIHNpZGUtcGFuZWwtZnJpZW5kbHlcbiAgICAvLyBkb3duc2NhbGUgKOKJpDMyMHB4IHdpZGUpLiBUbyBzdG9wIHRoZSBsYXlvdXQgZnJvbSBqdW1waW5nIHdoZW4gYSBzaG90XG4gICAgLy8gYXJyaXZlcyBhIHNlY29uZCBhZnRlciBjYXB0dXJlLCB3ZSBSRVNFUlZFIHRoZSBmaW5hbCBpbWFnZSBoZWlnaHQgdXBcbiAgICAvLyBmcm9udCB1c2luZyB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGtub3duIGFzcGVjdCByYXRpbyBhbmQgcGFpbnQgYVxuICAgIC8vIHNrZWxldG9uIGxvYWRlciBpbiB0aGF0IHNwYWNlLCB0aGVuIHN3YXAgdGhlIHNjcmVlbnNob3QgaW4gd2l0aCBub1xuICAgIC8vIHJlZmxvdy4gVGhlIHJlc2VydmF0aW9uIG9ubHkgaGFwcGVucyB3aGVuIGEgc2hvdCBpcyBhY3R1YWxseSBleHBlY3RlZFxuICAgIC8vIChhdXRvU2NyZWVuc2hvdCBvbiwgaG9zdCBub3Qgc2tpcHBlZCwgbm8gcmVjb3JkZWQgZmFpbHVyZSkgc28gY2FwdHVyZXNcbiAgICAvLyB0aGF0IHdpbGwgbmV2ZXIgZ2V0IGEgc2hvdCBkb24ndCBjYXJyeSBhbiBlbXB0eSBib3guXG4gICAgY29uc3Qgc2hvdERhdGFVcmwgPSBzaG90cy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3Qgc2hvdEV4cGVjdGVkID0gcHJlZnMuYXV0b1NjcmVlbnNob3RcbiAgICAgICYmICFzaG91bGRTa2lwU2NyZWVuc2hvdChtLmVudHJ5LnVybCA/PyAnJylcbiAgICAgICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIGlmIChzaG90RGF0YVVybCB8fCBzaG90RXhwZWN0ZWQpIHtcbiAgICAgIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXcuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgLy8gUmVzZXJ2ZSB2ZXJ0aWNhbCBzcGFjZSBpbW1lZGlhdGVseSBmcm9tIHRoZSBlbGVtZW50J3Mgd2lkdGgvaGVpZ2h0LlxuICAgICAgLy8gVGhlIHRodW1ibmFpbCBpcyByZW5kZXJlZCBhdCB0aGUgYnViYmxlJ3MgY29udGVudCB3aWR0aCwgc28gdGhlIGJveFxuICAgICAgLy8gaGVpZ2h0IHRyYWNrcyB0aGUgZWxlbWVudCdzIGFzcGVjdCByYXRpby4gQ2xhbXAgc28gYSB2ZXJ5IHRhbGxcbiAgICAgIC8vIGVsZW1lbnQgZG9lc24ndCByZXNlcnZlIGFuIGFic3VyZCBhbW91bnQgb2Ygc3BhY2UuXG4gICAgICBjb25zdCByID0gbS5lbnRyeS5yZWN0O1xuICAgICAgaWYgKHIgJiYgci53ID4gMCAmJiByLmggPiAwKSB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gTWF0aC5taW4oTWF0aC5tYXgoci5oIC8gci53LCAwLjEyKSwgMi4yKTtcbiAgICAgICAgcHJldmlldy5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zaG90LXJhdGlvJywgU3RyaW5nKHJhdGlvKSk7XG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgncmVzZXJ2ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaG90RGF0YVVybCkge1xuICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nLmNsYXNzTmFtZSA9ICdzaG90JztcbiAgICAgICAgaW1nLmFsdCA9IGBTY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gO1xuICAgICAgICAvLyBSZXZlYWwgb25seSBvbmNlIGRlY29kZWQgc28gdGhlIHN3YXAgaXMgaW5zdGFudCBhbmQgcmVmbG93LWZyZWU7XG4gICAgICAgIC8vIHRoZSBza2VsZXRvbiBzdGF5cyB2aXNpYmxlIHVuZGVybmVhdGggdW50aWwgdGhlbi5cbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpKTtcbiAgICAgICAgaW1nLnNyYyA9IHNob3REYXRhVXJsO1xuICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChpbWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gc2hvdCB5ZXQg4oCUIHNob3cgYSBza2VsZXRvbiBzaGltbWVyIG9jY3VweWluZyB0aGUgcmVzZXJ2ZWQgc3BhY2UuXG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuICAgICAgICBjb25zdCBza2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNrZWwuY2xhc3NOYW1lID0gJ3Nob3Qtc2tlbGV0b24nO1xuICAgICAgICBza2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBMb2FkaW5nIHNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChza2VsKTtcbiAgICAgIH1cbiAgICAgIGRpdi5hcHBlbmQocHJldmlldyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0cy5jbGFzc05hbWUgPSAnZW50LXN0YXRzJztcbiAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgIGNvbnN0IG15VG9rZW5zID0gdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtLmVudHJ5KSk7XG4gICAgY29uc3QgdG90YWxUb2tlbnMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobW0pOiBtbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5yZWR1Y2UoKHMsIG1tKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtbS5lbnRyeSkpLCAwKTtcbiAgICBjb25zdCBzaGFyZVBjdCA9IHRvdGFsVG9rZW5zID4gMCA/IE1hdGgucm91bmQoKG15VG9rZW5zIC8gdG90YWxUb2tlbnMpICogMTAwKSA6IDA7XG4gICAgY29uc3QgZ3JvdXBDb3VudCA9IG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGdyb3VwVG9rZW5zID0gKG0uZW50cnkuZ3JvdXAgPz8gW10pLnJlZHVjZSgocywgZykgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkoZykpLCAwKTtcbiAgICB0eXBlIFN0YXRDZWxsID0ge2xhYmVsOiBzdHJpbmc7IHZhbHVlOiBzdHJpbmc7IHRpcDogc3RyaW5nfTtcbiAgICBjb25zdCBjZWxsczogU3RhdENlbGxbXSA9IFtcbiAgICAgIHtsYWJlbDogJ0hUTUwnLCB2YWx1ZTogYCR7bS5lbnRyeS5vdXRlckhUTUw/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ091dGVyIEhUTUwgY2hhciBsZW5ndGgnfSxcbiAgICAgIHtsYWJlbDogJ1Rva2VucycsIHZhbHVlOiBgJHtteVRva2Vuc31gLCB0aXA6ICdBcHByb3ggTExNIHRva2VucyBmb3IgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnU2hhcmUnLCB2YWx1ZTogYCR7c2hhcmVQY3R9JWAsIHRpcDogJ1Rva2VuIHNoYXJlIG9mIGFsbCBzZWxlY3RvcnMnfSxcbiAgICAgIHtsYWJlbDogJ0NvbW1lbnRzJywgdmFsdWU6IGAke2ZiLmxlbmd0aH1gLCB0aXA6ICdJbmxpbmUgY29tbWVudHMgdGhyZWFkZWQgdW5kZXIgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnUnVsZXMnLCB2YWx1ZTogYCR7bS5lbnRyeS5tYXRjaGVkUnVsZXM/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ01hdGNoZWQgQ1NTIHJ1bGVzJ30sXG4gICAgICB7bGFiZWw6ICdTdHlsZXMnLCB2YWx1ZTogYCR7T2JqZWN0LmtleXMobS5lbnRyeS5zdHlsZXMgPz8ge30pLmxlbmd0aH1gLCB0aXA6ICdDb21wdXRlZC1zdHlsZSBmaWVsZHMga2VwdCd9LFxuICAgIF07XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAnLCB2YWx1ZTogYCR7Z3JvdXBDb3VudH1gLCB0aXA6ICdNZW1iZXJzIGZvbGRlZCBpbnRvIHRoaXMgZ3JvdXAnfSk7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwIFQnLCB2YWx1ZTogYCR7Z3JvdXBUb2tlbnN9YCwgdGlwOiAnVG9rZW5zIGNvbnRyaWJ1dGVkIGJ5IGdyb3VwIG1lbWJlcnMnfSk7XG4gICAgfVxuICAgIHN0YXRzLmlubmVySFRNTCA9IGNlbGxzLm1hcCgoYykgPT5cbiAgICAgIGA8c3BhbiBjbGFzcz1cImVudC1zdGF0XCIgZGF0YS10aXA9XCIke2VzY2FwZUh0bWwoYy50aXApfVwiPjxzcGFuIGNsYXNzPVwibGJsXCI+JHtjLmxhYmVsfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbFwiPiR7Yy52YWx1ZX08L3NwYW4+PC9zcGFuPmAsXG4gICAgKS5qb2luKCcnKTtcbiAgICBkaXYuYXBwZW5kKHN0YXRzKTtcblxuICAgIC8vIOKUgOKUgCBKU09OIHBhbmUgd2l0aCB0b29sYmFyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vIFRvb2xiYXIgYWJvdmUgdGhlIEpTT04gYm9keTogbGVmdCA9IGxpbmUtd3JhcCB0b2dnbGUsIHJpZ2h0ID0gY29weS5cbiAgICAvLyBUaGUgSlNPTiBpdHNlbGYgcmVmbGVjdHMgdGhlIGdsb2JhbCBgbWluaWZ5YCBzZXR0aW5nIHNvIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgc2FtZSBzaGFwZSB0aGF0IHdpbGwgZW5kIHVwIGluIHRoZSBleHBvcnQuXG4gICAgY29uc3QganNvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uV3JhcC5jbGFzc05hbWUgPSAnYm9keS1qc29uLXdyYXAnO1xuICAgIGNvbnN0IGpzb25CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uQmFyLmNsYXNzTmFtZSA9ICdib2R5LWpzb24tYmFyJztcblxuICAgIC8vIExpbmUtd3JhcCBjaGVja2JveCAocGVyLWJ1YmJsZSBsb2NhbCBzdGF0ZSwgZGVmYXVsdCBPTikuIFdoZW4gT04gdGhlXG4gICAgLy8gSlNPTiBpcyBmbGF0dGVuZWQgdG8gT05FIG1pbmlmaWVkIGxpbmUgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZSBidWJibGVcbiAgICAvLyB3aWR0aCAobm8gaG9yaXpvbnRhbCBzY3JvbGwpOyB3aGVuIE9GRiBpdCBmYWxscyBiYWNrIHRvIHRoZSBnbG9iYWxcbiAgICAvLyBtaW5pZnktcmVzcGVjdGluZyBwcmV0dHkvY29tcGFjdCBmb3JtIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgY29uc3Qgd3JhcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB3cmFwTGFiZWwuY2xhc3NOYW1lID0gJ2pzb24td3JhcC10b2dnbGUnO1xuICAgIHdyYXBMYWJlbC5kYXRhc2V0LnRpcCA9ICdGbGF0dGVuIHRvIGEgc2luZ2xlIHNvZnQtd3JhcHBpbmcgbGluZSBpbnN0ZWFkIG9mIGhvcml6b250YWwgc2Nyb2xsJztcbiAgICBjb25zdCB3cmFwQ2hlY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHdyYXBDaGVjay50eXBlID0gJ2NoZWNrYm94JztcbiAgICB3cmFwQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgd3JhcExhYmVsLmFwcGVuZCh3cmFwQ2hlY2ssIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgV3JhcCcpKTtcbiAgICBqc29uQmFyLmFwcGVuZCh3cmFwTGFiZWwpO1xuXG4gICAgLy8gQ29weSBidXR0b24gKG1pcnJvcnMgdGhlIFwiQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTlwiIGFjdGlvbiBiZWxvdyxcbiAgICAvLyBzdXJmYWNlZCBhdCB0aGUgdG9wIHNvIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBzY3JvbGwgcGFzdCB0aGUgSlNPTlxuICAgIC8vIHRvIGZpbmQgaXQpLlxuICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb3B5QnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb3B5QnRuLmNsYXNzTmFtZSA9ICdpY29uYnRuIGpzb24tY29weSc7XG4gICAgY29weUJ0bi5kYXRhc2V0LnRpcCA9ICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJztcbiAgICBjb3B5QnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb3B5IGNhcHR1cmUgYXMgSlNPTicpO1xuICAgIGNvcHlCdG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjb3B5JywgMTMpO1xuICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIC8vIEZ1bGwgc2luZ2xlLWNhcHR1cmUgZXhwb3J0OiBpZGVudGl0eSArIHBhdGhzICsgdGV4dC9jb250ZW50ICsgZXZlcnlcbiAgICAgIC8vIGF0dGFjaGVkIG5vdGUvY29tbWVudCDigJQgdGhlIHNhbWUgZGVwdGggYXMgYSBmdWxsIGV4cG9ydCwgc2NvcGVkIHRvXG4gICAgICAvLyB0aGlzIG9uZSBjYXB0dXJlIChpdGVtIDcpLiBEaXN0aW5jdCBmcm9tIHRoZSByYXcgZW50cnkgc2hvd24gYmVsb3cuXG4gICAgICBjb25zdCBmZWVkYmFjayA9IG1lc3NhZ2VzLmZsYXRNYXAoKHgpID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LnBhcmVudFVpZCA9PT0gbS5lbnRyeS51aWRcbiAgICAgICAgPyBbe3RleHQ6IHgudGV4dCwgdHM6IHgudHMsIHVpZDogeC5pZCwgcGFyZW50VWlkOiB4LnBhcmVudFVpZH1dIDogW10pO1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplQ2FwdHVyZUpzb24oe2VudHJ5OiBtLmVudHJ5LCBmZWVkYmFja30pKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNhcHR1cmUgZXhwb3J0Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY2FwdHVyZScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSk7XG4gICAganNvbkJhci5hcHBlbmQoY29weUJ0bik7XG4gICAganNvbldyYXAuYXBwZW5kKGpzb25CYXIpO1xuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvZHkuY2xhc3NOYW1lID0gJ2JvZHktanNvbiB3cmFwLW9uJztcbiAgICAvLyBSZW5kZXIgdGhlIEpTT04gdG8gbWF0Y2ggdGhlIHdyYXAgc3RhdGU6XG4gICAgLy8gICB3cmFwIE9OICDihpIgYSBzaW5nbGUgbWluaWZpZWQgbGluZSAoaW5kZW50IDApIHRoYXQgc29mdC13cmFwcyB0byB0aGVcbiAgICAvLyAgICAgICAgICAgICAgYnViYmxlIHdpZHRoIChDU1MgaGFuZGxlcyB0aGUgdmlzdWFsIHdyYXBwaW5nIHZpYVxuICAgIC8vICAgICAgICAgICAgICBvdmVyZmxvdy13cmFwOmFueXdoZXJlKSwgc28gdGhlIHdob2xlIG9iamVjdCBpcyBvbmVcbiAgICAvLyAgICAgICAgICAgICAgY29udGludW91cyBzdHJpbmcgd2l0aCBubyBob3Jpem9udGFsIHNjcm9sbC5cbiAgICAvLyAgIHdyYXAgT0ZGIOKGkiB0aGUgZ2xvYmFsIG1pbmlmeS1yZXNwZWN0aW5nIGZvcm06IHByZXR0eS1wcmludGVkIGZ1bGxcbiAgICAvLyAgICAgICAgICAgICAgZW50cnksIG9yIHRoZSBzbGltRW50cnkgY29tcGFjdCBmb3JtIHdoZW4gbWluaWZ5IGlzIG9uLFxuICAgIC8vICAgICAgICAgICAgICB3aXRoIGhvcml6b250YWwgc2Nyb2xsIGZvciBsb25nIGxpbmVzLlxuICAgIGNvbnN0IHJlbmRlckpzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gJyc7XG4gICAgICBjb25zdCB3cmFwcGVkID0gd3JhcENoZWNrLmNoZWNrZWQ7XG4gICAgICBjb25zdCBwYXlsb2FkID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IHNsaW1FbnRyeShtLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlfSkgOiBtLmVudHJ5O1xuICAgICAgY29uc3QgaW5kZW50ID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IDAgOiAyO1xuICAgICAgY29uc3QgdGV4dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIGluZGVudCk7XG4gICAgICBhcHBlbmRKc29uSGlnaGxpZ2h0KGJvZHksIHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICByZW5kZXJKc29uKCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG5cbiAgICAgIH0gZWxzZSBzZXRTdGF0dXMoJ1JlLWNhcHR1cmUgZmFpbGVkJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSB0aGlzIGNhcHR1cmUgYXMgYSBmdWxsIGV4cG9ydCAocGF0aHMsIHRleHQsIGNvbW1lbnRzKScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmVlZGJhY2sgPSAobTogRmVlZGJhY2tNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2snO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIGRpdi5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2gobS50ZXh0LCBzZWFyY2hRdWVyeSk7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkge1xuICAgICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IHNlbGVjdG9yIOKAlCBwcmVmZXIgcGFyZW50VWlkICh0aGUgcGVyc2lzdGVkIEZLKVxuICAgICAgLy8gb3ZlciBjYXB0dXJlLWFkamFjZW5jeSwgc2luY2UgZHJhZy10by1yZXBhcmVudCBtb3ZlcyB0aGUgY2hpcCBidXRcbiAgICAgIC8vIHRoZSB0cmFpbGluZy1zZWxlY3RvciBoZXVyaXN0aWMgZ2l2ZXMgc3RhbGUgcmVzdWx0cyB1bnRpbCByZW5kZXJcbiAgICAgIC8vIHNldHRsZXMuIFRoZSBhbm5vdGF0aW9uIG92ZXJsYXkgbmVlZHMgdGhlIHBhcmVudCdzIHNlbGVjdG9yIHRvXG4gICAgICAvLyBhbmNob3IgdGhlIG9uLXBhZ2UgdG9vbHRpcC5cbiAgICAgIGNvbnN0IHtwYXJlbnRTZWwsIHBhcmVudFVpZH0gPSAoKCkgPT4ge1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHtcbiAgICAgICAgICBjb25zdCBwID0gbWVzc2FnZXMuZmluZChcbiAgICAgICAgICAgIChtbSkgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAobW0gYXMgU2VsZWN0b3JNZXNzYWdlKS5lbnRyeS51aWQgPT09IG0ucGFyZW50VWlkLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHAgJiYgcC50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4ge3BhcmVudFNlbDogcC5lbnRyeS5zZWxlY3RvciwgcGFyZW50VWlkOiBwLmVudHJ5LnVpZH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtwYXJlbnRTZWw6IGxhc3RTZWxlY3RvclNlbCwgcGFyZW50VWlkOiB1bmRlZmluZWQgYXMgc3RyaW5nIHwgdW5kZWZpbmVkfTtcbiAgICAgIH0pKCk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICAvLyBTY3JvbGwgdGhlIHBhcmVudCBlbGVtZW50IGludG8gdmlldyArIHNob3cgdGhlIG9uLXBhZ2VcbiAgICAgICAgLy8gYW5ub3RhdGlvbiB0b29sdGlwIHJlbmRlcmluZyBUSElTIGNvbW1lbnQncyB0ZXh0LiBQYXNzIHRoZVxuICAgICAgICAvLyBwYXJlbnQncyB1aWQgc28gYSBzYW1lLXNlbGVjdG9yIHNpYmxpbmcgY2FwdHVyZSBkb2Vzbid0IGdldFxuICAgICAgICAvLyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgXCJ0aGUgc2FtZSB0YXJnZXRcIiBieSB0aGUgY29udGVudFxuICAgICAgICAvLyBzY3JpcHQncyBhbm5vdGF0aW9uIG92ZXJsYXkuXG4gICAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSB7XG4gICAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogcGFyZW50U2VsLCBzdGlja3k6IHRydWV9KTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kVG9DUyh7XG4gICAgICAgICAga2luZDogJ2Fubm90YXRpb24nLFxuICAgICAgICAgIHNlbGVjdG9yOiBwYXJlbnRTZWwsXG4gICAgICAgICAgcGF5bG9hZDoge3NlbGVjdG9yOiBwYXJlbnRTZWwsIHVpZDogcGFyZW50VWlkLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2s6IFttLnRleHRdfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkaXYuZGF0YXNldC5jb21tZW50SWQgPSBtLmlkO1xuICAgIGNvbnN0IGJlZ2luQ29tbWVudERyYWcgPSAoZTogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JywgbS5pZCk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgndGV4dC9wbGFpbicsIG0udGV4dCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgfTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYWN0aW9ucy5jbGFzc05hbWUgPSAnYWN0aW9ucyc7XG4gICAgY29uc3QgZHJhZ0hhbmRsZSA9IGFjdGlvbkJ0bignZ3JpcCcsICdEcmFnIHRoaXMgaGFuZGxlIG9udG8gYSBzZWxlY3RvciB0byByZXBhcmVudCcsICgpID0+IHsgLyogZHJhZyBoYW5kbGUgb25seSAqLyB9KTtcbiAgICBkcmFnSGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2RyYWctaGFuZGxlJyk7XG4gICAgZHJhZ0hhbmRsZS5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgYmVnaW5Db21tZW50RHJhZyk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZHJhZ0hhbmRsZSk7XG4gICAgLy8gRGV0YWNoIOKAlCB0aGUgaW52ZXJzZSBvZiBkcmFnLXRvLXJlcGFyZW50LiBPbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVcbiAgICAvLyBjb21tZW50IGN1cnJlbnRseSByZWFkcyBhcyB0aHJlYWRlZCAoRksgb3IgYWRqYWNlbmN5KS5cbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsIHx8IG0ucGFyZW50VWlkKSB7XG4gICAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3VubGluaycsICdEZXRhY2ggZnJvbSBpdHMgY2FwdHVyZSDigJQgbWFrZSB0aGlzIGEgc3RhbmRhbG9uZSBjb21tZW50JywgKCkgPT4ge1xuICAgICAgICAvLyBSZXNvbHZlIGJ5IGlkIGZyb20gdGhlIExJVkUgYXJyYXk6IHdvcmtzcGFjZSBzd2l0Y2hlcyBhbmRcbiAgICAgICAgLy8gdW5kby9yZWRvIHJlYXNzaWduIGBtZXNzYWdlc2AsIHNvIHRoZSBjbG9zdXJlJ3MgYG1gIGNhbiBiZSBhXG4gICAgICAgIC8vIHN0YWxlIG9iamVjdCB3aG9zZSBtdXRhdGlvbiB3b3VsZCBiZSBzaWxlbnRseSBkcm9wcGVkIGJ5IHRoZVxuICAgICAgICAvLyBuZXh0IHBlcnNpc3QoKS5cbiAgICAgICAgY29uc3QgbGl2ZSA9IG1lc3NhZ2VzLmZpbmQoKHgpOiB4IGlzIEZlZWRiYWNrTWVzc2FnZSA9PiB4LnR5cGUgPT09ICdmZWVkYmFjaycgJiYgeC5pZCA9PT0gbS5pZCk7XG4gICAgICAgIGlmICghbGl2ZSkgeyBzZXRTdGF0dXMoJ0NvbW1lbnQgbm8gbG9uZ2VyIGV4aXN0cycsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgIHNuYXBzaG90KCk7XG4gICAgICAgIGRlbGV0ZSBsaXZlLnBhcmVudFVpZDtcbiAgICAgICAgbGl2ZS5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgIHBlcnNpc3QoKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIHNldFN0YXR1cygnQ29tbWVudCBkZXRhY2hlZCDigJQgZHJhZyBpdHMgaGFuZGxlIG9udG8gYSBjYXB0dXJlIHRvIHJlYXR0YWNoJyk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignY29weScsICdDb3B5IGNvbW1lbnQgdGV4dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KG0udGV4dCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvcGllZCBjb21tZW50Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY29tbWVudCcpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3BlbmNpbCcsICdFZGl0IGNvbW1lbnQnLCAoKSA9PiBlbnRlckZlZWRiYWNrRWRpdChkaXYsIG0pLCB7c2l6ZTogMTV9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgLy8gRHJvcCBoYW5kbGVyIHNoYXJlZCBieSBldmVyeSBzZWxlY3RvciBidWJibGUuIEFjY2VwdHMgYSBkcmFnZ2VkXG4gIC8vIGNvbW1lbnQgSUQgdmlhIHRoZSBgYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudGAgTUlNRSwgdXBkYXRlc1xuICAvLyBwYXJlbnRVaWQgKyBhZGphY2VuY3ksIHBlcnNpc3RzLCByZS1yZW5kZXJzLlxuICBjb25zdCB3aXJlU2VsZWN0b3JEcm9wVGFyZ2V0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IFNlbGVjdG9yTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICBjb25zdCB0eXBlcyA9IGUuZGF0YVRyYW5zZmVyPy50eXBlcztcbiAgICAgIGlmICghdHlwZXMgfHwgIUFycmF5LmZyb20odHlwZXMpLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JykpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLmRhdGFUcmFuc2ZlcikgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkcm9wLXRhcmdldCcpO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoKSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQnKSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZSkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0Jyk7XG4gICAgICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyPy5nZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50Jyk7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBzcmNJZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gaWQpO1xuICAgICAgaWYgKHNyY0lkeCA8IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHNyYyA9IG1lc3NhZ2VzW3NyY0lkeF0hIGFzIEZlZWRiYWNrTWVzc2FnZTtcbiAgICAgIGlmIChzcmMudHlwZSAhPT0gJ2ZlZWRiYWNrJykgcmV0dXJuO1xuICAgICAgY29uc3QgZHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgaWYgKGRzdElkeCA8IDApIHJldHVybjtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICAvLyBVcGRhdGUgdGhlIEZLIHBvaW50ZXIgZmlyc3Qg4oCUIHRoYXQncyB0aGUgc291cmNlIG9mIHRydXRoIGluXG4gICAgICAvLyBleHBvcnRzLiBBZGphY2VuY3kgaXMganVzdCBhIHJlbmRlciBjb252ZW5pZW5jZS4gUmVwYXJlbnRpbmcgaXNcbiAgICAgIC8vIHRoZSBpbnZlcnNlIG9mIGRldGFjaCwgc28gdGhlIGRldGFjaGVkIGZsYWcgaXMgY2xlYXJlZC5cbiAgICAgIHNyYy5wYXJlbnRVaWQgPSBtLmVudHJ5LnVpZDtcbiAgICAgIGRlbGV0ZSBzcmMuZGV0YWNoZWQ7XG4gICAgICAvLyBTcGxpY2Ugc3JjIG91dCBvZiBpdHMgY3VycmVudCBzbG90IGFuZCByZS1pbnNlcnQgcmlnaHQgYWZ0ZXIgdGhlXG4gICAgICAvLyBuZXcgcGFyZW50IChhbmQgYW55IGZlZWRiYWNrIGFscmVhZHkgdHJhaWxpbmcgaXQsIHNvIHRoZSBtb3N0LVxuICAgICAgLy8gcmVjZW50IGZlZWRiYWNrIGVuZHMgdXAgbmVhcmVzdCB0aGUgcGFyZW50IHZpc3VhbGx5KS5cbiAgICAgIG1lc3NhZ2VzLnNwbGljZShzcmNJZHgsIDEpO1xuICAgICAgY29uc3QgbmV3RHN0SWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgbGV0IGluc2VydEF0ID0gbmV3RHN0SWR4ICsgMTtcbiAgICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0hLnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHNyYyk7XG4gICAgICBwZXJzaXN0KCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCByZXBhcmVudGVkJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdHlwZSBBY3Rpb25CdG5PcHRzID0ge3dhcm4/OiBib29sZWFuOyB0b2dnbGVkPzogYm9vbGVhbjsgc2l6ZT86IG51bWJlcn07XG4gIGNvbnN0IGFjdGlvbkJ0biA9IChpY29uOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGZuOiAoKSA9PiB2b2lkLCBvcHRzOiBBY3Rpb25CdG5PcHRzID0ge30pOiBIVE1MQnV0dG9uRWxlbWVudCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGIudHlwZSA9ICdidXR0b24nO1xuICAgIGIuZGF0YXNldC50aXAgPSB0aXRsZTtcbiAgICBiLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRpdGxlKTtcbiAgICBpZiAob3B0cy53YXJuKSBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBpZiAob3B0cy50b2dnbGVkKSBiLmNsYXNzTGlzdC5hZGQoJ3RvZ2dsZWQnKTtcbiAgICAvLyBEZWZhdWx0IGljb24gc2l6ZSAxMyByZWFkcyBzbGlnaHRseSBzbWFsbCBpbiBhIDIyw5cyMiBidXR0b24g4oCUIGZpbmVcbiAgICAvLyBmb3IgaWNvbnMgd2l0aCBzaW1wbGUgc2hhcGVzIChjcm9zc2hhaXIsIGxpc3QtdHJlZSwgdW5kbykgYnV0IHZpc2libHlcbiAgICAvLyBzcXVlZXplZCBmb3IgYG1lc3NhZ2Utc3F1YXJlLXBsdXNgIGFuZCBgcGVuY2lsYCwgd2hlcmUgdGhlXG4gICAgLy8gaW50ZXJpb3Igc3Ryb2tlcyB2YW5pc2ggaW50byBoYWlybGluZSBibHVyLiBDYWxsZXJzIGNhbiBidW1wIHdpdGhcbiAgICAvLyBgc2l6ZTogMTVgIGZvciB0aG9zZS5cbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZyhpY29uLCBvcHRzLnNpemUgPz8gMTMpO1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBmbigpOyB9KTtcbiAgICByZXR1cm4gYjtcbiAgfTtcblxuICBjb25zdCBkZWxldGVCdG4gPSAob25Db25maXJtOiAoKSA9PiB2b2lkKTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmNsYXNzTmFtZSA9ICd3YXJuJztcbiAgICBiLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSc7XG4gICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnRGVsZXRlIGNhcHR1cmUnKTtcbiAgICBiLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICBsZXQgcGFyZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZXZlcnRUaW1lciA9IDA7XG4gICAgY29uc3QgcmV2ZXJ0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFwYXJlbnQpIHJldHVybjtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbmZpcm0teWVzLCAuY29uZmlybS1ubycpKSBuLnJlbW92ZSgpO1xuICAgICAgaWYgKCFiLnBhcmVudEVsZW1lbnQpIHBhcmVudC5hcHBlbmQoYik7XG4gICAgICBjbGVhclRpbWVvdXQocmV2ZXJ0VGltZXIpO1xuICAgIH07XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcGFyZW50ID0gYi5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgeWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB5ZXMudHlwZSA9ICdidXR0b24nO1xuICAgICAgeWVzLmNsYXNzTmFtZSA9ICdjb25maXJtLXllcyc7XG4gICAgICB5ZXMuZGF0YXNldC50aXAgPSAnQ29uZmlybSBkZWxldGUnO1xuICAgICAgeWVzLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb25maXJtIGRlbGV0ZScpO1xuICAgICAgeWVzLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygnY2hlY2snLCAxMyk7XG4gICAgICB5ZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyBvbkNvbmZpcm0oKTsgfSk7XG4gICAgICBjb25zdCBubyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgbm8udHlwZSA9ICdidXR0b24nO1xuICAgICAgbm8uY2xhc3NOYW1lID0gJ2NvbmZpcm0tbm8nO1xuICAgICAgbm8uZGF0YXNldC50aXAgPSAnQ2FuY2VsIGRlbGV0ZSc7XG4gICAgICBuby5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIGRlbGV0ZScpO1xuICAgICAgbm8uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd4JywgMTMpO1xuICAgICAgbm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHsgZXYuc3RvcFByb3BhZ2F0aW9uKCk7IHJldmVydCgpOyB9KTtcbiAgICAgIGIucmVwbGFjZVdpdGgoeWVzKTtcbiAgICAgIHllcy5hZnRlcihubyk7XG4gICAgICByZXZlcnRUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHJldmVydCwgODAwMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZW50ZXJGZWVkYmFja0VkaXQgPSAoZGl2OiBIVE1MRWxlbWVudCwgbTogRmVlZGJhY2tNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5leHQuY2xhc3NOYW1lID0gJ21zZyBmZWVkYmFjayBlZGl0aW5nJztcbiAgICBpZiAoZGl2LmNsYXNzTGlzdC5jb250YWlucygndGhyZWFkZWQnKSkgbmV4dC5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIG5leHQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgbmV4dC5hcHBlbmQoYnVpbGRJbmxpbmVDb21tZW50KHtcbiAgICAgIGluaXRpYWw6IG0udGV4dCxcbiAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7IGRpdi5yZXBsYWNlV2l0aChkaXYuY2xvbmVOb2RlKHRydWUpKTsgcmVuZGVyKCk7IH0sXG4gICAgICBvblN1Ym1pdDogKHRleHQpID0+IHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9ICh0ZXh0ID8/ICcnKS50cmltKCk7XG4gICAgICAgIGlmICh0cmltbWVkID09PSBtLnRleHQpIHsgcmVuZGVyKCk7IHJldHVybjsgfVxuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtLnRleHQgPSB0cmltbWVkO1xuICAgICAgICAvLyBTZXZlcml0eSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFVJLiBTdHJpcCBhbnkgbGVnYWN5IHZhbHVlXG4gICAgICAgIC8vIHRoYXQgY2FtZSBiYWNrIGZyb20gYW4gb2xkZXIgSlNPTkwgaW1wb3J0IHNvIHNhdmVzIGRvbid0IGtlZXBcbiAgICAgICAgLy8gcmUtZW1pdHRpbmcgaXQuXG4gICAgICAgIGRlbGV0ZSAobSBhcyBhbnkpLnNldmVyaXR5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICB9KSk7XG4gICAgZGl2LnJlcGxhY2VXaXRoKG5leHQpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZU1lc3NhZ2UgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5pZCAhPT0gaWQpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0RlbGV0ZWQnKTtcbiAgICB9O1xuICAgIGlmICghZWwpIHsgZmluaXNoKCk7IHJldHVybjsgfVxuICAgIGVsLnN0eWxlLm1heEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgdm9pZCBlbC5vZmZzZXRXaWR0aDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdyZW1vdmluZycpO1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpOiB2b2lkID0+IHsgaWYgKGRvbmUpIHJldHVybjsgZG9uZSA9IHRydWU7IGZpbmlzaCgpOyB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBjbGVhbnVwLCB7b25jZTogdHJ1ZX0pO1xuICAgIHNldFRpbWVvdXQoY2xlYW51cCwgMzgwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQ29tcG9zZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNlbmRGZWVkYmFjayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gY29tcG9zZXIudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIHNuYXBzaG90KCk7XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBpbi1tZW1vcnkgbWVzc2FnZSBhdCBjcmVhdGlvbiB0aW1lIHNvIHRoZVxuICAgIC8vIEZLIGlzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoLiBUaGUgc2xpbSBlbWl0IG5vIGxvbmdlciBoYXMgdG9cbiAgICAvLyBpbmZlciB0aGUgcGFyZW50IGZyb20gY2FwdHVyZS1hZGphY2VuY3ksIGFuZCBgbWFuaWZlc3QuY291bnRzYFxuICAgIC8vIGFjY3VyYXRlbHkgcmVmbGVjdHMgZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMuXG4gICAgLy8gV2FsayBiYWNrIHRvIHRoZSBuZWFyZXN0IHByZWNlZGluZyBzZWxlY3RvciBiZWZvcmUgc3BsaWNlLlxuICAgIGxldCBwSWR4ID0gcG9zaXRpb24gLSAxO1xuICAgIHdoaWxlIChwSWR4ID49IDAgJiYgbWVzc2FnZXNbcElkeF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIHBJZHgtLTtcbiAgICBjb25zdCBwYXJlbnQgPSBwSWR4ID49IDAgPyBtZXNzYWdlc1twSWR4XSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJlbnRVaWQgPSBwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgPyBwYXJlbnQuZW50cnkudWlkIDogdW5kZWZpbmVkO1xuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwge1xuICAgICAgdHlwZTogJ2ZlZWRiYWNrJywgaWQ6IG1zZ0lkKCksIHRzOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIHRleHQsXG4gICAgICAuLi4ocGFyZW50VWlkID8ge3BhcmVudFVpZH0gOiB7fSksXG4gICAgfSk7XG4gICAgY29tcG9zZXIudmFsdWUgPSAnJztcbiAgICB1cGRhdGVDb21wb3Nlck1ldGVyKCk7XG4gICAgLy8gU2VuZGluZyBjbGVhcnMgYW55IGFjdGl2ZSB2aXN1YWwgZmluZCBzbyB0aGUgbmV3IGNvbW1lbnQgaXNuJ3QgaGlkZGVuXG4gICAgLy8gYmVoaW5kIGEgc3RhbGUgZmlsdGVyLlxuICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cygnU2VudCcpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgLy8gQnVnICMyOiBmZWVkYmFjaydzIHBhcmVudCBzaG91bGQgaGF2ZSBhIHNjcmVlbnNob3QuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAhcGFyZW50LmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgIHZvaWQgZmlyZUVsZW1lbnRTaG90KHBhcmVudCBhcyBTZWxlY3Rvck1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgKGUpID0+IHtcbiAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkgcmV0dXJuO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIoKTtcbiAgICAgIGlmICghaGFuZGxlZCkgc2VuZEZlZWRiYWNrKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIHNldFN0YXR1cygnSW5zZXJ0IG1vZGUgY2FuY2VsbGVkJyk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlQ29tcG9zZXJNZXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ID0gY29tcG9zZXIudmFsdWU7XG4gICAgY29tcFdvcmRzLnRleHRDb250ZW50ID0gU3RyaW5nKHdvcmRDb3VudCh0KSk7XG4gICAgY29tcFRva2Vucy50ZXh0Q29udGVudCA9IFN0cmluZyh0b2tlbkNvdW50KHQpKTtcbiAgICBjb21wb3Nlci5jbGFzc0xpc3QudG9nZ2xlKCdjbWQtbW9kZScsIC9ePi8udGVzdCh0LnRyaW0oKSkpO1xuICB9O1xuICBjb21wb3Nlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHVwZGF0ZUNvbXBvc2VyTWV0ZXIpO1xuXG4gIC8vIOKUgOKUgCBIZWFkZXIgc2VhcmNoIOKGkiBjb21tYW5kIHBhbGV0dGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFRoZSBoZWFkZXIgc2VhcmNoIGFmZm9yZGFuY2Ugbm8gbG9uZ2VyIHJ1bnMgaXRzIG93biBmaWx0ZXI7IGNsaWNraW5nIG9yXG4gIC8vIGZvY3VzaW5nIGl0IG9wZW5zIHRoZSBDbWQrSyBjb21tYW5kIHBhbGV0dGUgKHdoaWNoIHNlYXJjaGVzIGNhcHR1cmVzIEFORFxuICAvLyBydW5zIGNvbW1hbmRzKS4gSXQncyBhIHJlYWRvbmx5IHRyaWdnZXIsIHNvIHdlIGp1c3Qgb3BlbiB0aGUgcGFsZXR0ZSBhbmRcbiAgLy8gZHJvcCBmb2N1cyBzbyB0aGUgcGFsZXR0ZSBpbnB1dCB0YWtlcyBvdmVyIGNsZWFubHkuXG4gIGNvbnN0IHRyaWdnZXJQYWxldHRlRnJvbVNlYXJjaCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSByZXR1cm47XG4gICAgb3BlblBhbGV0dGUoKTtcbiAgICBzZWFyY2guYmx1cigpO1xuICB9O1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2gpO1xuICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2goKTsgfVxuICB9KTtcblxuICAvLyDilIDilIAgQ3RybCtGIHZpc3VhbCBmaW5kIChpbi1saXN0IGZpbHRlciArIGhpZ2hsaWdodCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybjtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY29uc3QgZmlyc3RIaXQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnLnNlbGVjdG9yLnNlYXJjaC1oaXQnKTtcbiAgICAgIGlmIChmaXJzdEhpdCkge1xuICAgICAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGZpcnN0SGl0KTtcbiAgICAgICAgY29uc3QgbWsgPSBmaXJzdEhpdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignbWFyaycpO1xuICAgICAgICBpZiAobWspIGNlbnRlckVsZW1lbnRJbkxpc3QobWspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlyc3RNYXRjaCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5tc2cgbWFyaycpO1xuICAgICAgICBpZiAoZmlyc3RNYXRjaCkgY2VudGVyRWxlbWVudEluTGlzdChmaXJzdE1hdGNoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlRmluZENvdW50ID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZENvdW50KSByZXR1cm47XG4gICAgZmluZENvdW50LnRleHRDb250ZW50ID0gc2VhcmNoUXVlcnkgPyBgJHtsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cnKS5sZW5ndGh9IG1hdGNoYCA6ICcnO1xuICB9O1xuICBjb25zdCBhcHBseUZpbmQgPSAodmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHNlYXJjaFF1ZXJ5ID0gdmFsdWUudHJpbSgpO1xuICAgIHJlbmRlcigpO1xuICAgIHVwZGF0ZUZpbmRDb3VudCgpO1xuICAgIHNjcm9sbEZpcnN0RmluZEhpdEludG9WaWV3KCk7XG4gIH07XG4gIGNvbnN0IG9wZW5GaW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghZmluZEJhciB8fCAhZmluZElucHV0KSByZXR1cm47XG4gICAgZmluZEJhci5oaWRkZW4gPSBmYWxzZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LmFkZCgnZmluZC1vcGVuJyk7XG4gICAgZmluZElucHV0LmZvY3VzKCk7XG4gICAgZmluZElucHV0LnNlbGVjdCgpO1xuICB9O1xuICBjb25zdCBjbG9zZUZpbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKGZpbmRCYXIpIGZpbmRCYXIuaGlkZGVuID0gdHJ1ZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKT8uY2xhc3NMaXN0LnJlbW92ZSgnZmluZC1vcGVuJyk7XG4gICAgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gJyc7XG4gICAgaWYgKHNlYXJjaFF1ZXJ5KSB7IHNlYXJjaFF1ZXJ5ID0gJyc7IHJlbmRlcigpOyB9XG4gICAgdXBkYXRlRmluZENvdW50KCk7XG4gIH07XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiBhcHBseUZpbmQoZmluZElucHV0LnZhbHVlKSk7XG4gIGZpbmRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7IGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBjbG9zZUZpbmQoKTsgfSB9KTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZmluZC1jbGVhcl0nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUZpbmQpO1xuXG4gIGNvbnN0IHRyeU1hbnVhbENhcHR1cmVGcm9tQ29tcG9zZXIgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgbSA9IC9ePlxccyooLispJC8uZXhlYyhjb21wb3Nlci52YWx1ZS50cmltKCkpO1xuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHNlbCA9IG1bMV0hLnRyaW0oKTtcbiAgICBpZiAoIXNlbCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQ1NBbmRXYWl0PHtvazogYm9vbGVhbn0+KHtraW5kOiAnbWFudWFsLWNhcHR1cmUnLCBzZWxlY3Rvcjogc2VsfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgeyBjb21wb3Nlci52YWx1ZSA9ICcnOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IHNldFN0YXR1cygnQ2FwdHVyZWQgJyArIHNlbCk7IH1cbiAgICBlbHNlIHNldFN0YXR1cygnU2VsZWN0b3IgZGlkIG5vdCBtYXRjaDogJyArIHNlbCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBFeHBvcnQgYnVpbGRlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHYyIGV4cG9ydCBzaGFwZTogdG9wIGxldmVsIGtlZXBzIHVzZXItZmFjaW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkc1xuICAvLyAodWlkLCBuLCBzZWxlY3RvciwgdGV4dCwgcm9sZSwgYXR0cnMsIGhpbnRzLCBjbGFzc2VzLCBzdHlsZXMsIGNvbXBvbmVudCxcbiAgLy8gc3RhdGVzLCBzY3JlZW5zaG90LCBncm91cCkuIERpYWdub3N0aWMgLyBkZXRlY3Rpb24gbWV0YWRhdGEgbW92ZXMgdW5kZXJcbiAgLy8gYW4gYF9hdWRpdGAgbmFtZXNwYWNlIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIGluU2hhZG93RE9NLFxuICAvLyBwc2V1ZG9FbGVtZW50cywgbWF0Y2hlZFJ1bGVzLCB2aWV3cG9ydCkuIFRoZSB2ZXJzaW9uIG1hcmtlciBpcyBlbWl0dGVkXG4gIC8vIGFzIGB2OiAyYC4gSW1wb3J0ZXJzIGRldGVjdCBlaXRoZXIgdjEgKGZsYXQpIG9yIHYyIGFuZCBkZW5vcm1hbGl6ZS5cbiAgLy9cbiAgLy8gQWdncmVzc2l2ZSBtaW5pZnkgYWRkaXRpb25hbGx5IGRyb3BzIGZpZWxkcyB0aGUgc2VsZWN0b3IgYWxyZWFkeVxuICAvLyBpbXBsaWVzOiBhbmNlc3RvcnMsIHZpZXdwb3J0IChvbmUgcGVyIHBhZ2UpLCBjb21wb25lbnRSb290IHdoZW5cbiAgLy8gcmVkdW5kYW50IHdpdGggdGhlIHNlbGVjdG9yLCBhbmQgcHNldWRvRWxlbWVudHMuXG4gIGNvbnN0IHNsaW1FbnRyeSA9IChlOiBFbnRyeSwgb3B0czoge2luY2x1ZGVHcm91cD86IGJvb2xlYW47IGV2ZW50SW5kZXg/OiBudW1iZXI7IHZpc3VhbE9yZGVyPzogbnVtYmVyOyBncm91cFVpZD86IHN0cmluZ30gPSB7fSk6IFJlY29yZDxzdHJpbmcsIGFueT4gPT4ge1xuICAgIGNvbnN0IGluY2x1ZGVPdXRlciA9IHByZWZzLmluY2x1ZGVPdXRlckhUTUw7XG4gICAgY29uc3QgaW5jbHVkZU1hdGNoZWQgPSBwcmVmcy5pbmNsdWRlTWF0Y2hlZFJ1bGVzO1xuICAgIGNvbnN0IGluY2x1ZGVTdHlsZXMgPSBwcmVmcy5pbmNsdWRlU3R5bGVzO1xuICAgIGNvbnN0IG1pbmlmeSA9IHByZWZzLm1pbmlmeTtcblxuICAgIC8vIFRvcC1sZXZlbCB1c2VyLWZhY2luZyBmaWVsZHMuIE9yZGVyIG1hdHRlcnMgZm9yIG91dHB1dCByZWFkYWJpbGl0eSDigJRcbiAgICAvLyB3ZSB3YW50IGB2IC8gdHlwZSAvIHVpZCAvIG4gLyBzZWxlY3RvcmAgZmlyc3Qgc28gSlNPTkwgaXMgZ3JlcHBhYmxlLlxuICAgIC8vXG4gICAgLy8gYG5gIHN0YXlzIGFzIHRoZSBjYXB0dXJlLXNlcXVlbmNlIGRpc3BsYXkgbGFiZWwgZm9yIGJhY2t3YXJkc1xuICAgIC8vIGNvbXBhdGliaWxpdHkgd2l0aCB2MS92MiByZWFkZXJzIChhbmQgdGhlIHNpZGViYXIncyBcIiMzXCIgY2hpcHMpLlxuICAgIC8vIFRoZSBkaXNhbWJpZ3VhdGVkIGNvdXNpbnMgKGBjYXB0dXJlSW5kZXhgLCBgZXZlbnRJbmRleGAsXG4gICAgLy8gYHZpc3VhbE9yZGVyYCwgYGRpc3BsYXlMYWJlbGApIGxpdmUgb24gdGhlIHJvdyBzbyBhIGRvd25zdHJlYW1cbiAgICAvLyBhZ2VudCBjYW4gcGljayB3aGljaGV2ZXIgb3JkZXJpbmcgaXMgbWVhbmluZ2Z1bCDigJQgYnVnICMxMC5cbiAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICB2OiAyLFxuICAgICAgdHlwZTogJ3NlbGVjdG9yJyxcbiAgICAgIHVpZDogZS51aWQsXG4gICAgICBuOiBlLm4sXG4gICAgICB0czogZS50cyxcbiAgICAgIHVybDogZS51cmwsXG4gICAgICB0YWc6IGUudGFnLFxuICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsXG4gICAgICBjYXB0dXJlSW5kZXg6IGUubixcbiAgICAgIGRpc3BsYXlMYWJlbDogU3RyaW5nKGUubiksXG4gICAgfTtcbiAgICBpZiAob3B0cy5ldmVudEluZGV4ICE9PSB1bmRlZmluZWQpIG91dC5ldmVudEluZGV4ID0gb3B0cy5ldmVudEluZGV4O1xuICAgIGlmIChvcHRzLnZpc3VhbE9yZGVyICE9PSB1bmRlZmluZWQpIG91dC52aXN1YWxPcmRlciA9IG9wdHMudmlzdWFsT3JkZXI7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUudGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQudGV4dCA9IG1pbmlmeSA/IGUudGV4dC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS50ZXh0O1xuICAgIGlmIChlLnJvbGUgIT09IHVuZGVmaW5lZCkgb3V0LnJvbGUgPSBlLnJvbGU7XG4gICAgaWYgKGUuYWNjZXNzaWJsZU5hbWUgIT09IHVuZGVmaW5lZCkgb3V0LmFjY2Vzc2libGVOYW1lID0gbWluaWZ5ID8gZS5hY2Nlc3NpYmxlTmFtZS5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5hY2Nlc3NpYmxlTmFtZTtcbiAgICBpZiAoZS5pZCAhPT0gdW5kZWZpbmVkKSBvdXQuaWQgPSBlLmlkO1xuICAgIGlmIChlLnRlc3RJZCAhPT0gdW5kZWZpbmVkKSBvdXQudGVzdElkID0gZS50ZXN0SWQ7XG4gICAgaWYgKGUuY2xhc3NlcyAmJiBlLmNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICBvdXQuY2xhc3NlcyA9IChtaW5pZnkgJiYgZS5jbGFzc2VzLmxlbmd0aCA+IDgpID8gZS5jbGFzc2VzLnNsaWNlKDAsIDgpIDogZS5jbGFzc2VzO1xuICAgIH1cbiAgICBpZiAoZS5hdHRycyAmJiBPYmplY3Qua2V5cyhlLmF0dHJzKS5sZW5ndGgpIG91dC5hdHRycyA9IGUuYXR0cnM7XG4gICAgaWYgKGUuaGludHMgJiYgT2JqZWN0LmtleXMoZS5oaW50cykubGVuZ3RoKSBvdXQuaGludHMgPSBlLmhpbnRzO1xuICAgIGlmIChlLnJlY3QpIG91dC5yZWN0ID0gZS5yZWN0O1xuICAgIGlmIChlLnN0YXRlcyAmJiBlLnN0YXRlcy5sZW5ndGgpIG91dC5zdGF0ZXMgPSBlLnN0YXRlcztcbiAgICBpZiAoZS5jb21wb25lbnQpIG91dC5jb21wb25lbnQgPSBlLmNvbXBvbmVudDtcbiAgICAvLyBMb2NhdG9yLXF1YWxpdHkgZmllbGQuIFByb21vdGUgZXZlbiB3aGVuIG1pbmlmaWVkIOKAlCBpdCdzIGEgc2luZ2xlXG4gICAgLy8gc21hbGwgaW50IGFuZCBhIGRvd25zdHJlYW0gYWdlbnQgdXNlcyBpdCB0byBkZWNpZGUgd2hldGhlciB0b1xuICAgIC8vIHRydXN0IHRoZSBzZWxlY3Rvci5cbiAgICBpZiAoZS5zZWxlY3Rvck1hdGNoQ291bnQgIT09IHVuZGVmaW5lZCkgb3V0LnNlbGVjdG9yTWF0Y2hDb3VudCA9IGUuc2VsZWN0b3JNYXRjaENvdW50O1xuICAgIGlmIChlLmExMXkpIG91dC5hMTF5ID0gZS5hMTF5O1xuICAgIGlmIChlLmFzc2V0cyAmJiBlLmFzc2V0cy5sZW5ndGgpIG91dC5hc3NldHMgPSBlLmFzc2V0cztcbiAgICBpZiAoZS5sYXlvdXRDb250ZXh0ICYmIGUubGF5b3V0Q29udGV4dC5sZW5ndGgpIG91dC5sYXlvdXRDb250ZXh0ID0gZS5sYXlvdXRDb250ZXh0O1xuICAgIGlmIChpbmNsdWRlT3V0ZXIgJiYgZS5vdXRlckhUTUwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb3V0Lm91dGVySFRNTCA9IG1pbmlmeSA/IGUub3V0ZXJIVE1MLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKS50cmltKCkgOiBlLm91dGVySFRNTDtcbiAgICB9XG4gICAgaWYgKGluY2x1ZGVTdHlsZXMgJiYgZS5zdHlsZXMgJiYgT2JqZWN0LmtleXMoZS5zdHlsZXMpLmxlbmd0aCkgb3V0LnN0eWxlcyA9IGUuc3R5bGVzO1xuICAgIGlmIChlLnNjcmVlbnNob3QpIHtcbiAgICAgIC8vIFBhdGggbm9ybWFsaXphdGlvbjogdGhlIGxpdmUgYGVudHJ5LnNjcmVlbnNob3QuZWxlbWVudGAgY2FycmllcyBhXG4gICAgICAvLyB3b3Jrc3BhY2UtcHJlZml4ZWQgcGF0aCAoZS5nLiBgZGVmYXVsdC9zY3JlZW5zaG90cy9mb28ucG5nYClcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGJhY2tncm91bmQncyBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIEFQSSBzdGFtcHNcbiAgICAgIC8vIHRoZSB3b3Jrc3BhY2UgaW50byB0aGUgb24tZGlzayBwYXRoLiBCdXQgdGhlIC50YXIuenN0IGFyY2hpdmVcbiAgICAgIC8vIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZmxhdCBhdCBgc2NyZWVuc2hvdHMvZm9vLnBuZ2AsIHNvIHRoZVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeCB3b3VsZCByZXNvbHZlIHRvIG5vdGhpbmcgZm9yIGFuIGFnZW50IHRoYXRcbiAgICAgIC8vIGV4dHJhY3RlZCB0aGUgYXJjaGl2ZS4gU3RyaXAgdGhlIHdvcmtzcGFjZSBwcmVmaXggb24gZW1pdCBzb1xuICAgICAgLy8gZXZlcnkgcGF0aCBpcyB2YWxpZCByZWxhdGl2ZSB0byB0aGUgbWFuaWZlc3QncyBkZWNsYXJlZFxuICAgICAgLy8gYHBhdGhSb290YCAoYXJjaGl2ZSByb290IGZvciB0YXIuenN0OyB3b3Jrc3BhY2Ugcm9vdCBmb3IgcGxhaW5cbiAgICAgIC8vIEpTT05MIOKAlCBpLmUuLCBgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICBjb25zdCBzdHJpcFdzID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGlmICghcCkgcmV0dXJuIHA7XG4gICAgICAgIC8vIFN0cmlwIGV4YWN0bHkgb25lIGxlYWRpbmcgYDx3b3Jrc3BhY2U+L2Agc2VnbWVudCBpZiBwcmVzZW50LlxuICAgICAgICBjb25zdCB3c1ByZWZpeCA9IGAke2FjdGl2ZVdzfS9gO1xuICAgICAgICByZXR1cm4gcC5zdGFydHNXaXRoKHdzUHJlZml4KSA/IHAuc2xpY2Uod3NQcmVmaXgubGVuZ3RoKSA6IHA7XG4gICAgICB9O1xuICAgICAgb3V0LnNjcmVlbnNob3QgPSB7Li4uZS5zY3JlZW5zaG90fTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5lbGVtZW50KSBvdXQuc2NyZWVuc2hvdC5lbGVtZW50ID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5lbGVtZW50KTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5ncm91cCkgb3V0LnNjcmVlbnNob3QuZ3JvdXAgPSBzdHJpcFdzKG91dC5zY3JlZW5zaG90Lmdyb3VwKTtcbiAgICAgIGlmIChvdXQuc2NyZWVuc2hvdC5wYWdlKSBvdXQuc2NyZWVuc2hvdC5wYWdlID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5wYWdlKTtcbiAgICB9XG4gICAgLy8gUHJvbW90ZSBydW50aW1lL2JlaGF2aW9yIHNpZ25hbHMgdG8gdG9wLWxldmVsLiBUaGVzZSBhcmUgcHJpbWFyeVxuICAgIC8vIHNpZ25hbCBmb3IgdHJpYWdlIChldmVudHMgdGVsbHMgXCJ3aGljaCBoYW5kbGVyIHJhblwiLCBiZWhhdmlvckF0dHJzXG4gICAgLy8gdGVsbHMgXCJ3aGF0IHNlcnZlci1yZW5kZXJlZCBiaW5kaW5nIGRvZXMgdGhpcyBmaXJlXCIsIGNhbnZhc0NsaWNrXG4gICAgLy8gdGVsbHMgXCJ3aGVyZSBvbiB0aGUgY2hhcnQgd2FzIGNsaWNrZWRcIiwgZWRpdG9yIHRlbGxzIFwid2hpY2hcbiAgICAvLyByaWNoLXRleHQgbGlicmFyeSB3cmFwcyB0aGlzXCIsIGRvbU11dGF0aW9ucyB0ZWxscyBcIndoYXQgY2hhbmdlZFxuICAgIC8vIGJlZm9yZSB0aGUgY2xpY2tcIiwgaXNBbmltYXRpbmcgd2FybnMgYWJvdXQgdHJhbnNpZW50IHN0YXRlKS5cbiAgICBpZiAoZS5ldmVudHMgJiYgT2JqZWN0LmtleXMoZS5ldmVudHMpLmxlbmd0aCkgb3V0LmV2ZW50cyA9IGUuZXZlbnRzO1xuICAgIGlmIChlLmJlaGF2aW9yQXR0cnMgJiYgT2JqZWN0LmtleXMoZS5iZWhhdmlvckF0dHJzKS5sZW5ndGgpIG91dC5iZWhhdmlvckF0dHJzID0gZS5iZWhhdmlvckF0dHJzO1xuICAgIGlmIChlLmNhbnZhc0NsaWNrKSBvdXQuY2FudmFzQ2xpY2sgPSBlLmNhbnZhc0NsaWNrO1xuICAgIGlmIChlLmVkaXRvcikgb3V0LmVkaXRvciA9IGUuZWRpdG9yO1xuICAgIGlmIChlLmlzQW5pbWF0aW5nKSBvdXQuaXNBbmltYXRpbmcgPSB0cnVlO1xuICAgIGlmIChlLnNoYWRvd0hvc3QpIG91dC5zaGFkb3dIb3N0ID0gZS5zaGFkb3dIb3N0O1xuICAgIGlmIChlLnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkKSBvdXQucmVuZGVyZWRUZXh0ID0gZS5yZW5kZXJlZFRleHQ7XG4gICAgaWYgKGUudHJ1bmNhdGVkICYmIE9iamVjdC5rZXlzKGUudHJ1bmNhdGVkKS5sZW5ndGgpIG91dC50cnVuY2F0ZWQgPSBlLnRydW5jYXRlZDtcbiAgICBpZiAoZS5zZXNzaW9uSWQpIG91dC5zZXNzaW9uSWQgPSBlLnNlc3Npb25JZDtcbiAgICBpZiAoZS5kb21NdXRhdGlvbnMgJiYgZS5kb21NdXRhdGlvbnMubGVuZ3RoKSBvdXQuZG9tTXV0YXRpb25zID0gZS5kb21NdXRhdGlvbnM7XG5cbiAgICAvLyBfYXVkaXQ6IGRldGVjdGlvbiBjaGFpbiAmIGRpYWdub3N0aWMgc2hhcGUuXG4gICAgLy8gUkVBRE1FIGNsYWltZWQgYF9hdWRpdC5hbmNlc3RvcnNgIGFuZCBgX2F1ZGl0LmNvbXBvbmVudFJvb3RgIHdlcmVcbiAgICAvLyBhbHdheXMgcHJlc2VudCwgYnV0IHRoZSBzbGltIGVtaXQgZHJvcHBlZCB0aGVtIHdoZW5ldmVyXG4gICAgLy8gYG1pbmlmeTogdHJ1ZWAuIFRoZSBmaXg6IGVtaXQgZXZlcnkgZGVjbGFyZWQgYF9hdWRpdGAgZmllbGRcbiAgICAvLyB3aGVuZXZlciB0aGUgc291cmNlIGRhdGEgZXhpc3RzLCBhbmQgbGV0XG4gICAgLy8gYG1pbmlmeWAgc2xpbSBPTkxZIHRoZSBoaWdoLXZvbHVtZSBibG9ja3MgKG1hdGNoZWRSdWxlcyxcbiAgICAvLyBwc2V1ZG9FbGVtZW50cykuIFNtYWxsIHN0cnVjdHVyYWwgbWV0YWRhdGEgKGFuY2VzdG9ycyxcbiAgICAvLyBjb21wb25lbnRSb290LCB2aWV3cG9ydCkgc3Vydml2ZXMgbWluaWZ5IHNvIHRoZSBzY2hlbWEgY2xhaW1zXG4gICAgLy8gc3RheSBob25lc3QuXG4gICAgY29uc3QgYXVkaXQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAoZS5hbmNlc3RvcnMgJiYgZS5hbmNlc3RvcnMubGVuZ3RoKSBhdWRpdC5hbmNlc3RvcnMgPSBlLmFuY2VzdG9ycztcbiAgICBpZiAoZS5jb21wb25lbnRSb290ICE9PSB1bmRlZmluZWQpIGF1ZGl0LmNvbXBvbmVudFJvb3QgPSBlLmNvbXBvbmVudFJvb3Q7XG4gICAgaWYgKGUuaW5TaGFkb3dET00pIGF1ZGl0LmluU2hhZG93RE9NID0gdHJ1ZTtcbiAgICBpZiAoZS5wc2V1ZG9FbGVtZW50cyAmJiBPYmplY3Qua2V5cyhlLnBzZXVkb0VsZW1lbnRzKS5sZW5ndGggJiYgIW1pbmlmeSkgYXVkaXQucHNldWRvRWxlbWVudHMgPSBlLnBzZXVkb0VsZW1lbnRzO1xuICAgIGlmIChpbmNsdWRlTWF0Y2hlZCAmJiBlLm1hdGNoZWRSdWxlcyAmJiBlLm1hdGNoZWRSdWxlcy5sZW5ndGgpIHtcbiAgICAgIGF1ZGl0Lm1hdGNoZWRSdWxlcyA9IG1pbmlmeVxuICAgICAgICA/IGUubWF0Y2hlZFJ1bGVzLm1hcCgocikgPT4ge1xuICAgICAgICAgIGNvbnN0IHIyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge3NlbGVjdG9yOiByLnNlbGVjdG9yfTtcbiAgICAgICAgICBpZiAoci5kZWNsYXJhdGlvbnMgJiYgT2JqZWN0LmtleXMoci5kZWNsYXJhdGlvbnMpLmxlbmd0aCkgcjIuZGVjbGFyYXRpb25zID0gci5kZWNsYXJhdGlvbnM7XG4gICAgICAgICAgaWYgKHIubWVkaWEpIHIyLm1lZGlhID0gci5tZWRpYTtcbiAgICAgICAgICByZXR1cm4gcjI7XG4gICAgICAgIH0pXG4gICAgICAgIDogZS5tYXRjaGVkUnVsZXM7XG4gICAgfVxuICAgIGlmIChlLnZpZXdwb3J0KSBhdWRpdC52aWV3cG9ydCA9IGUudmlld3BvcnQ7XG4gICAgaWYgKE9iamVjdC5rZXlzKGF1ZGl0KS5sZW5ndGgpIG91dC5fYXVkaXQgPSBhdWRpdDtcblxuICAgIC8vIEdyb3VwIGhlYWQgbGlua2FnZS4gUHJldmlvdXNseSB0aGUgZ3JvdXAgaGVhZCdzIGBlbnRyeS5ncm91cGBcbiAgICAvLyBjYXJyaWVkIGZ1bGwgbmVzdGVkIGVudHJ5IG9iamVjdHMuXG4gICAgLy8gVGhhdCBtYWRlIER1Y2tEQiBqb2lucyB1Z2x5IGFuZCBicm9rZSB0aGUgcnVsZSB0aGF0IGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3Igc2hvdWxkIGJlIGEgdG9wLWxldmVsIHJvdy4gV2Ugbm93IGVtaXQ6XG4gICAgLy8gICDigKIgb24gdGhlIGdyb3VwIGhlYWQ6IGBncm91cE1lbWJlclVpZHM6IFt1aWQsIHVpZCwgLi4uXWAgKGp1c3QgSURzKVxuICAgIC8vICAg4oCiIGVhY2ggbWVtYmVyIGFzIGl0cyBvd24gdG9wLWxldmVsIHNsaW0gcm93IHdpdGggYGdyb3VwVWlkYFxuICAgIC8vICAgICBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkIChoYW5kbGVkIGluIGBidWlsZFNsaW1gIGZsdXNoIGxvZ2ljKS5cbiAgICBpZiAob3B0cy5pbmNsdWRlR3JvdXAgJiYgZS5ncm91cCAmJiBlLmdyb3VwLmxlbmd0aCkge1xuICAgICAgb3V0Lmdyb3VwTWVtYmVyVWlkcyA9IGUuZ3JvdXAubWFwKChnKSA9PiBnLnVpZCkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cbiAgICBpZiAob3B0cy5ncm91cFVpZCkgb3V0Lmdyb3VwVWlkID0gb3B0cy5ncm91cFVpZDtcblxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTaGFyZWQgXCJzbGltIGRhdGFcIiBwaXBlbGluZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gSlNPTkwgcmVuZGVycyBvZmYgdGhpcyBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb24uIChNYXJrZG93biB1c2VkIHRvXG4gIC8vIHNoYXJlIGl0OyB0aGUgTWFya2Rvd24gZXhwb3J0IHdhcyByZXRpcmVkIGluIGZhdm9yIG9mIEpTT05MLW9ubHkuKVxuICAvL1xuICAvLyB2MiBkaWZmZXJlbmNlcyB2cyB2MTpcbiAgLy8gICDigKIgU2VsZWN0b3IgbGluZXMgaGF2ZSBleHBsaWNpdCBgdHlwZTogJ3NlbGVjdG9yJ2AgYW5kIGB2OiAyYC5cbiAgLy8gICDigKIgX2F1ZGl0IG5lc3RzIGRldGVjdGlvbiAvIGRlYnVnIGZpZWxkcyAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCDigKYpLlxuICAvLyAgIOKAoiBGZWVkYmFjayBlbWl0cyBhcyBzdGFuZGFsb25lIGB7dHlwZTonZmVlZGJhY2snLCBwYXJlbnRVaWQsIOKApn1gIGxpbmVzXG4gIC8vICAgICBQTFVTIGJ1bmRsZWQgYGZlZWRiYWNrYCBhcnJheXMgb24gc2VsZWN0b3JzIChzbyBvbGQgc2luZ2xlLWxpbmVcbiAgLy8gICAgIHJlYWRlcnMgc3RpbGwgc2VlIHRoZW0gYWRqYWNlbnQpLlxuICAvLyAgIOKAoiBBIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBjYXJyaWVzIHdvcmtzcGFjZSArIGNvdW50cyArIGZpbGVuYW1lLlxuICB0eXBlIFNsaW1QYWdlID0ge3Y6IDI7IHR5cGU6ICdwYWdlJzsgdHM6IHN0cmluZzsgdXJsOiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nOyB2aWV3cG9ydD86IFZpZXdwb3J0OyB0b2tlbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyB1c2VyQWdlbnQ/OiBzdHJpbmc7IGxhbmc/OiBzdHJpbmc7IGdpdENvbnRleHQ/OiB7Y29tbWl0Pzogc3RyaW5nOyBicmFuY2g/OiBzdHJpbmc7IGJ1aWxkPzogc3RyaW5nfTsgcm91dGU/OiBhbnk7IHN0YXRlPzogYW55OyBzZXNzaW9uSWQ/OiBzdHJpbmc7IHNuYXBzaG90PzogUGFnZVNuYXBzaG90fTtcbiAgLy8gU2V2ZXJpdHkgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVUkgKDIwMjYtMDUpLiBUb2xlcmFudCByZWFkZXJzIG1heSBzdGlsbFxuICAvLyBzZWUgYHNldmVyaXR5YCBvbiBsZWdhY3kgSlNPTkwg4oCUIGRlbm9ybWFsaXplRW50cnkgcHJlc2VydmVzIGl0IG9uXG4gIC8vIEZlZWRiYWNrTWVzc2FnZSBzbyByZS1leHBvcnQgcm91bmQtdHJpcHMsIGJ1dCBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0XG4gIC8vIGl0IGFuZCB3ZSBkb24ndCBlbWl0IGl0IGhlcmUuIEtlZXAgdGhlIGZpZWxkIG9mZiBTbGltRmVlZGJhY2sgc28gbmV3XG4gIC8vIGV4cG9ydHMgc3RheSBjbGVhbi5cbiAgLy8gYHRhZ3NgIGlzIGFsd2F5cyBlbWl0dGVkIChkZWZhdWx0IGVtcHR5IGFycmF5KSBzbyBEdWNrREIgc2NoZW1hXG4gIC8vIGluZmVyZW5jZSBhbHdheXMgc2VlcyB0aGUgY29sdW1uLlxuICB0eXBlIFNsaW1GZWVkYmFjayA9IHt2OiAyOyB0eXBlOiAnZmVlZGJhY2snOyB1aWQ6IHN0cmluZzsgdHM6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmc7IGRldGFjaGVkPzogYm9vbGVhbjsgdGFnczogc3RyaW5nW107IGlzVGVzdERhdGE/OiBib29sZWFuOyBzdWdnZXN0ZWRTa2lsbHM/OiBBcnJheTx7c2tpbGw6IHN0cmluZzsgbG9jYXRvcjogc3RyaW5nfT59O1xuICAvLyBDaGVhcCB0ZXN0LWRhdGEgc25pZmY6IG1hdGNoZXMgc3RyaW5ncyB0aGUgdXNlciB0eXBlcyB3aGlsZSBzbW9rZS1cbiAgLy8gdGVzdGluZyB0aGUgZXh0ZW5zaW9uIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsIFwibG9yZW0gaXBzdW1cIixcbiAgLy8gXCJwbGFjZWhvbGRlclwiLCBvciBhbnkgcGhyYXNlIG9idmlvdXNseSBzdHViYmVkLW91dCkuIEZhbHNlIHBvc2l0aXZlc1xuICAvLyBoZXJlIGFyZSByZWNvdmVyYWJsZSDigJQgdGhlIGNvbnN1bWVyIGNhbiBpZ25vcmUgdGhlIGZsYWcg4oCUIGJ1dFxuICAvLyBleGNsdWRpbmcgcmVhbCBmZWVkYmFjayB3b3VsZCBub3QgYmUsIHNvIHdlIGtlZXAgdGhlIHJlZ2V4IG5hcnJvdy5cbiAgY29uc3QgVEVTVF9EQVRBX1JFID0gL14odGVzdHxhc2RmfHF3ZXJ8Zm9vfGJhcnxiYXp8bG9yZW18cGxhY2Vob2xkZXJ8dG9kb3x4ezMsfXxoZWxsbyB3b3JsZHxzYW1wbGV8ZHVtbXl8c29tZXRoaW5nfGFueXRoaW5nfGlnbm9yZSBtZXx3aXB8dGJkfG5cXC9hfGhpKVxcYi9pO1xuICBjb25zdCBsb29rc0xpa2VUZXN0RGF0YSA9ICh0ZXh0OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50cmltKCk7XG4gICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKFRFU1RfREFUQV9SRS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoL3Rlc3QgZmVlZGJhY2svaS50ZXN0KHQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHR5cGUgU2xpbVNlbGVjdG9yID0gUmVjb3JkPHN0cmluZywgYW55PiAmIHt2OiAyOyB0eXBlOiAnc2VsZWN0b3InOyBuOiBudW1iZXI7IHNlbGVjdG9yOiBzdHJpbmc7IGZlZWRiYWNrPzogc3RyaW5nW119O1xuICB0eXBlIFNsaW1MaW5lID0gU2xpbVBhZ2UgfCBTbGltRmVlZGJhY2sgfCBTbGltU2VsZWN0b3I7XG4gIGNvbnN0IGJ1aWxkU2xpbSA9ICgpOiBTbGltTGluZVtdID0+IHtcbiAgICBjb25zdCBsaW5lczogU2xpbUxpbmVbXSA9IFtdO1xuICAgIC8vIFByZS1jb21wdXRlIHZpc3VhbE9yZGVyICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkgZm9yIGV2ZXJ5XG4gICAgLy8gc2VsZWN0b3IgbWVzc2FnZS4gVGhlIHByZXZpb3VzIHNpbmdsZSBgbmAgZmllbGQgY29uZmxhdGVkXG4gICAgLy8gY2FwdHVyZSBvcmRlciwgSlNPTkwgc3RyZWFtIG9yZGVyLFxuICAgIC8vIHZpc3VhbCBvcmRlciwgYW5kIGRpc3BsYXkgbGFiZWwuIFdlIG5vdyBlbWl0IGZvdXIgb3J0aG9nb25hbFxuICAgIC8vIGZpZWxkcyBhbmQgZG9jdW1lbnQgZWFjaDpcbiAgICAvLyAgIOKAoiBldmVudEluZGV4ICAg4oCUIG1vbm90b25pYyBwb3NpdGlvbiBpbiB0aGUgSlNPTkwgc3RyZWFtXG4gICAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCB0aGUgb3JpZ2luYWwgYG5gIChjYXB0dXJlIHNlcXVlbmNlKVxuICAgIC8vICAg4oCiIHZpc3VhbE9yZGVyICDigJQgc29ydCBieSByZWN0LnkgYXNjLCByZWN0LnggYXNjXG4gICAgLy8gICDigKIgZGlzcGxheUxhYmVsIOKAlCB0aGUgaHVtYW4tZmFjaW5nIG51bWJlciBzaG93biBpbiB0aGUgc2lkZWJhclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAoY3VycmVudGx5IG1pcnJvcnMgY2FwdHVyZUluZGV4OyBjYW4gZHJpZnQgaWZcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhlIHNpZGViYXIgYWRvcHRzIGEgZGlmZmVyZW50IGxhYmVsIHNjaGVtZSkuXG4gICAgY29uc3QgdmlzdWFsUmFuayA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgY29uc3Qgc2VscyA9IG1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKVxuICAgICAgLnNsaWNlKClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFyID0gYS5lbnRyeS5yZWN0OyBjb25zdCBiciA9IGIuZW50cnkucmVjdDtcbiAgICAgICAgaWYgKCFhciB8fCAhYnIpIHJldHVybiAwO1xuICAgICAgICBpZiAoYXIueSAhPT0gYnIueSkgcmV0dXJuIGFyLnkgLSBici55O1xuICAgICAgICByZXR1cm4gYXIueCAtIGJyLng7XG4gICAgICB9KTtcbiAgICBzZWxzLmZvckVhY2goKG0sIGkpID0+IHZpc3VhbFJhbmsuc2V0KG0uaWQsIGkgKyAxKSk7XG4gICAgbGV0IHBlbmRpbmdTZWw6IFNlbGVjdG9yTWVzc2FnZSB8IG51bGwgPSBudWxsO1xuICAgIC8vIFdlIGNvbGxlY3QgYm90aCB0aGUgYnVuZGxlZCBzdHJpbmcgYXJyYXkgKGZvciB2MS1mcmllbmRseSByZWFkZXJzKSBhbmRcbiAgICAvLyB0aGUgcmljaCBvYmplY3RzIChmb3IgdjIgc3RhbmRhbG9uZSBsaW5lcykuXG4gICAgbGV0IHBlbmRpbmdGYlN0cmluZ3M6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHBlbmRpbmdGYlJpY2g6IFNsaW1GZWVkYmFja1tdID0gW107XG4gICAgY29uc3QgZmx1c2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXBlbmRpbmdTZWwpIHJldHVybjtcbiAgICAgIGNvbnN0IGV2ZW50SW5kZXggPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgY29uc3QgdmlzdWFsT3JkZXIgPSB2aXN1YWxSYW5rLmdldChwZW5kaW5nU2VsLmlkKTtcbiAgICAgIGNvbnN0IG91dDogYW55ID0gc2xpbUVudHJ5KHBlbmRpbmdTZWwuZW50cnksIHtpbmNsdWRlR3JvdXA6IHRydWUsIGV2ZW50SW5kZXgsIHZpc3VhbE9yZGVyfSk7XG4gICAgICBpZiAocGVuZGluZ0ZiU3RyaW5ncy5sZW5ndGgpIG91dC5mZWVkYmFjayA9IFsuLi5wZW5kaW5nRmJTdHJpbmdzXTtcbiAgICAgIGxpbmVzLnB1c2gob3V0IGFzIFNsaW1MaW5lKTtcbiAgICAgIC8vIEdyb3VwIGZsYXRuZXNzIChidWcgIzkpLiBFbWl0IGVhY2ggZ3JvdXAgbWVtYmVyIGFzIGl0cyBvd25cbiAgICAgIC8vIHRvcC1sZXZlbCBzbGltIHJvdyByaWdodCBhZnRlciB0aGUgaGVhZCwgd2l0aCBgZ3JvdXBVaWRgXG4gICAgICAvLyBsaW5raW5nIGJhY2suIFRoaXMgbGV0cyBEdWNrREIgLyBTUUwgcXVlcmllcyB0cmVhdCBncm91cFxuICAgICAgLy8gbWVtYmVycyBhcyBmaXJzdC1jbGFzcyBzZWxlY3RvciByb3dzIHdpdGhvdXQgZGVzY2VuZGluZyBpbnRvXG4gICAgICAvLyBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgIGNvbnN0IGdyb3VwTWVtYmVycyA9IHBlbmRpbmdTZWwuZW50cnkuZ3JvdXAgPz8gW107XG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBncm91cE1lbWJlcnMpIHtcbiAgICAgICAgY29uc3QgbUV2ZW50ID0gbGluZXMubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3QgbWVtYmVyUm93OiBhbnkgPSBzbGltRW50cnkobWVtYmVyLCB7aW5jbHVkZUdyb3VwOiBmYWxzZSwgZXZlbnRJbmRleDogbUV2ZW50LCBncm91cFVpZDogcGVuZGluZ1NlbC5lbnRyeS51aWR9KTtcbiAgICAgICAgbGluZXMucHVzaChtZW1iZXJSb3cgYXMgU2xpbUxpbmUpO1xuICAgICAgfVxuICAgICAgLy8gRW1pdCBlYWNoIHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZSByaWdodCBhZnRlciB0aGUgc2VsZWN0b3IocykuXG4gICAgICBmb3IgKGNvbnN0IGZiIG9mIHBlbmRpbmdGYlJpY2gpIGxpbmVzLnB1c2goZmIpO1xuICAgICAgcGVuZGluZ1NlbCA9IG51bGw7XG4gICAgICBwZW5kaW5nRmJTdHJpbmdzID0gW107XG4gICAgICBwZW5kaW5nRmJSaWNoID0gW107XG4gICAgfTtcbiAgICAvLyBSZW9yZGVyIGZvciBleHBvcnQgb25seSDigJQgc2lkZWJhciBrZWVwcyBjYXB0dXJlIG9yZGVyLCB0aGVcbiAgICAvLyBlbWl0dGVkIEpTT05MIHJlYWRzIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHdpdGhpbiBlYWNoIHBhZ2UuXG4gICAgLy8gRmVlZGJhY2sgcm93cyBzdGF5IGF0dGFjaGVkIHRvIHRoZWlyIHByZWNlZGluZyBzZWxlY3RvciB2aWEgdGhlXG4gICAgLy8gYHJlb3JkZXJGb3JFeHBvcnRgIGhlbHBlciwgc28gdGhyZWFkaW5nIGlzIHByZXNlcnZlZCB0aHJvdWdoXG4gICAgLy8gdGhlIHJlYXJyYW5nZW1lbnQuXG4gICAgY29uc3QgZXhwb3J0T3JkZXJlZCA9IHJlb3JkZXJGb3JFeHBvcnQobWVzc2FnZXMpO1xuICAgIGZvciAoY29uc3QgbSBvZiBleHBvcnRPcmRlcmVkKSB7XG4gICAgICBpZiAobS50eXBlID09PSAncGFnZScpIHtcbiAgICAgICAgZmx1c2goKTtcbiAgICAgICAgY29uc3Qgc2xpbTogU2xpbVBhZ2UgPSB7djogMiwgdHlwZTogJ3BhZ2UnLCB0czogbS50cywgdXJsOiBtLnVybH07XG4gICAgICAgIGlmIChtLnRpdGxlICE9PSB1bmRlZmluZWQpIHNsaW0udGl0bGUgPSBtLnRpdGxlO1xuICAgICAgICBpZiAobS52aWV3cG9ydCkgc2xpbS52aWV3cG9ydCA9IG0udmlld3BvcnQ7XG4gICAgICAgIGlmICghcHJlZnMubWluaWZ5ICYmIG0udG9rZW5zKSBzbGltLnRva2VucyA9IG0udG9rZW5zO1xuICAgICAgICBpZiAobS51c2VyQWdlbnQpIHNsaW0udXNlckFnZW50ID0gbS51c2VyQWdlbnQ7XG4gICAgICAgIGlmIChtLmxhbmcpIHNsaW0ubGFuZyA9IG0ubGFuZztcbiAgICAgICAgaWYgKG0uZ2l0Q29udGV4dCkgc2xpbS5naXRDb250ZXh0ID0gbS5naXRDb250ZXh0O1xuICAgICAgICBpZiAobS5yb3V0ZSkgc2xpbS5yb3V0ZSA9IG0ucm91dGU7XG4gICAgICAgIGlmIChtLnN0YXRlKSBzbGltLnN0YXRlID0gbS5zdGF0ZTtcbiAgICAgICAgaWYgKG0uc2Vzc2lvbklkKSBzbGltLnNlc3Npb25JZCA9IG0uc2Vzc2lvbklkO1xuICAgICAgICAvLyBGdWxsLXBhZ2Ugc25hcHNob3QgKHZpZXdwb3J0LCBzY3JvbGwgZXh0ZW50cywgZHByLCBsYW5nLCBzY3JlZW5zaG90KVxuICAgICAgICAvLyBjYXB0dXJlZCBmb3IgdGhpcyBVUkwuIFBhcnQgb2YgdGhlIGV4cG9ydCBkZWxpdmVyYWJsZSBzbyBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYWdlbnQgaGFzIHdob2xlLXBhZ2UgY29udGV4dCwgbm90IGp1c3QgZWxlbWVudCBjcm9wcy5cbiAgICAgICAgY29uc3Qgc25hcCA9IChtIGFzIFBhZ2VNZXNzYWdlICYge3NuYXBzaG90PzogUGFnZVNuYXBzaG90fSkuc25hcHNob3Q7XG4gICAgICAgIGlmIChzbmFwKSBzbGltLnNuYXBzaG90ID0gc25hcDtcbiAgICAgICAgbGluZXMucHVzaChzbGltKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7IGZsdXNoKCk7IHBlbmRpbmdTZWwgPSBtOyB9XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHtcbiAgICAgICAgLy8gQWx3YXlzIGluY2x1ZGUgYHRhZ3M6IFtdYCAoZXZlbiB3aGVuIGVtcHR5KSBzbyBEdWNrREIncyBzY2hlbWFcbiAgICAgICAgLy8gaW5mZXJlbmNlIHBpY2tzIHRoZSBjb2x1bW4gdXAuXG4gICAgICAgIC8vIGB1aWRgIGlzIHRoZSBtZXNzYWdlJ3Mgc3RhYmxlIGlkOiBQUnMgLyByZXBhaXIgcmVwb3J0cyBuZWVkXG4gICAgICAgIC8vIGEgc3RhYmxlIHBlci1mZWVkYmFjayBoYW5kbGUsIG5vdCBqdXN0IHBhcmVudFVpZC5cbiAgICAgICAgY29uc3QgcmljaDogU2xpbUZlZWRiYWNrID0ge3Y6IDIsIHR5cGU6ICdmZWVkYmFjaycsIHVpZDogbS5pZCwgdHM6IG0udHMsIHRleHQ6IG0udGV4dCwgdGFnczogbS50YWdzID8/IFtdfTtcbiAgICAgICAgLy8gKHNldmVyaXR5IHJlbW92ZWQgMjAyNi0wNSDigJQgb2xkIEpTT05McyBtYXkgc3RpbGwgY29udGFpbiBpdFxuICAgICAgICAvLyBvbiB0aGUgcmVhZCBzaWRlLCBidXQgd2Ugbm8gbG9uZ2VyIGVtaXQgaXQgb24gd3JpdGUuKVxuICAgICAgICAvLyBIZXVyaXN0aWMgZmxhZyBmb3Igc3R1Yi1sb29raW5nIGZlZWRiYWNrIChcInRlc3RcIiwgXCJhc2RmXCIsIFwiZm9vXCIsXG4gICAgICAgIC8vIFwiSG93ZHkgLCB0ZXN0IGZlZWRiYWNrIGhlcmVcIiwgZXRjKS4gTGV0cyBhIGRvd25zdHJlYW0gY29uc3VtZXJcbiAgICAgICAgLy8gZmlsdGVyIHBvbGx1dGlvbiBmcm9tIHJlYWwgaW50ZW50IHdpdGhvdXQgbWFudWFsIGNsZWFudXAuXG4gICAgICAgIGlmIChsb29rc0xpa2VUZXN0RGF0YShtLnRleHQpKSByaWNoLmlzVGVzdERhdGEgPSB0cnVlO1xuICAgICAgICAvLyBBIGRldGFjaGVkIGNvbW1lbnQgbmV2ZXIgYWRvcHRzIHRoZSBwZW5kaW5nIHNlbGVjdG9yIHZpYVxuICAgICAgICAvLyBhZGphY2VuY3kg4oCUIHRoZSB1c2VyIGV4cGxpY2l0bHkgZGlzYXNzb2NpYXRlZCBpdC4gVGhlIGZsYWcgaXNcbiAgICAgICAgLy8gZW1pdHRlZCBzbyBpbXBvcnQgcm91bmQtdHJpcHMgZG9uJ3QgcmUtYWRvcHQgYnkgYWRqYWNlbmN5IGVpdGhlci5cbiAgICAgICAgaWYgKG0uZGV0YWNoZWQpIHJpY2guZGV0YWNoZWQgPSB0cnVlO1xuICAgICAgICAvLyBIZXVyaXN0aWMgc2tpbGwgbG9jYXRvcnMgZm9yIHRoZSBhZ2VudCdzIG1hcCBwaGFzZSAodmVyaWZpZWQgYW5kXG4gICAgICAgIC8vIHJld3JpdHRlbiBpbnRvIHdvcmstbWFuaWZlc3QgbWFwcGVkX3NraWxscyBieSB0aGUgY29uc3VtZXIpLlxuICAgICAgICByaWNoLnN1Z2dlc3RlZFNraWxscyA9IHN1Z2dlc3RTa2lsbHNGb3IobS50ZXh0KTtcbiAgICAgICAgaWYgKHBlbmRpbmdTZWwgJiYgIW0uZGV0YWNoZWQpIHtcbiAgICAgICAgICByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkID8/IHBlbmRpbmdTZWwuZW50cnkudWlkO1xuICAgICAgICAgIHBlbmRpbmdGYlN0cmluZ3MucHVzaChtLnRleHQpO1xuICAgICAgICAgIHBlbmRpbmdGYlJpY2gucHVzaChyaWNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHJpY2gucGFyZW50VWlkID0gbS5wYXJlbnRVaWQ7XG4gICAgICAgICAgbGluZXMucHVzaChyaWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmbHVzaCgpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfTtcbiAgLy8gQnVpbGQgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBvZiB0aGUgSlNPTkwgZXhwb3J0LiBUaGVcbiAgLy8gbWFuaWZlc3QgY2FycmllcyB0aGUgZXhwb3J0IGZpbGVuYW1lICsgd29ya3NwYWNlICsgaG9zdChzKSArIGNvdW50cyBzb1xuICAvLyBhIGRvd25zdHJlYW0gTExNIGNhbiByZXN5bmMgdGhlIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlIGFuZCBncmVwIGZvclxuICAvLyBkdXBsaWNhdGVzIGFjcm9zcyBleHBvcnRzLlxuICBjb25zdCBidWlsZE1hbmlmZXN0ID0gKGZpbGVuYW1lOiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddLCBvcHRzOiB7bm93SXNvPzogc3RyaW5nOyBidW5kbGVJZD86IHN0cmluZ30gPSB7fSk6IEV4cG9ydE1hbmlmZXN0ID0+IHtcbiAgICBsZXQgblNlbCA9IDA7IGxldCBuRmIgPSAwOyBsZXQgblBnID0gMDtcbiAgICBsZXQgbkdyb3VwTWVtYmVycyA9IDA7XG4gICAgbGV0IG5GZWVkYmFja0JlYXJpbmcgPSAwO1xuICAgIGxldCBuTWlzc2luZ1Nob3QgPSAwO1xuICAgIGxldCBuRWxlbWVudFNob3RzID0gMDtcbiAgICBsZXQgbkdyb3VwU2hvdHMgPSAwO1xuICAgIGxldCBuUGFnZVNob3RzID0gMDtcbiAgICBsZXQgbk9ycGhhbmVkRmIgPSAwO1xuICAgIGNvbnN0IHNlbGVjdG9yVWlkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAvLyBGaXJzdCBwYXNzOiBjb2xsZWN0IHVpZHMgKyBwZXItc2VsZWN0b3IgZmVlZGJhY2sgcHJlc2VuY2UuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIG5TZWwrKztcbiAgICAgICAgc2VsZWN0b3JVaWRzLmFkZChtLmVudHJ5LnVpZCk7XG4gICAgICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIG5Hcm91cE1lbWJlcnMgKz0gbS5lbnRyeS5ncm91cC5sZW5ndGg7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIG5FbGVtZW50U2hvdHMrKztcbiAgICAgICAgaWYgKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5Hcm91cFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIG5QYWdlU2hvdHMrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgIG5GYisrO1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuYWRkKG0ucGFyZW50VWlkKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAncGFnZScpIG5QZysrO1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzczogZmVlZGJhY2stYmVhcmluZyBzZWxlY3RvcnMgKyBvcnBoYW5lZCBmZWVkYmFjayArXG4gICAgLy8gc2VsZWN0b3JzIHRoYXQgc2hvdWxkIGhhdmUgYSBzaG90IGJ1dCBkb24ndC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSB7XG4gICAgICAgIG5GZWVkYmFja0JlYXJpbmcrKztcbiAgICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIG5NaXNzaW5nU2hvdCsrO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIG5PcnBoYW5lZEZiKys7XG4gICAgfVxuICAgIGNvbnN0IG5vd0lzbyA9IG9wdHMubm93SXNvID8/IGV4cG9ydE5vd0lzbygpO1xuICAgIGNvbnN0IG91dDogRXhwb3J0TWFuaWZlc3QgPSB7XG4gICAgICB2OiAyLCB0eXBlOiAnbWFuaWZlc3QnLCB0b29sOiAncGluY2hncmFiJyxcbiAgICAgIHRzOiBub3dJc28sXG4gICAgICBnZW5lcmF0ZWQ6IERhdGUucGFyc2Uobm93SXNvKSxcbiAgICAgIHdvcmtzcGFjZTogYWN0aXZlV3MsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGZvcm1hdCxcbiAgICAgIGhvc3RzOiBkaXN0aW5jdEhvc3RzKCksXG4gICAgICBjb3VudHM6IHtcbiAgICAgICAgLy8gVG90YWwgc2VsZWN0b3Igcm93cyB0aGUgSlNPTkwgd2lsbCBlbWl0ID0gdG9wLWxldmVsICsgZmxhdFxuICAgICAgICAvLyBncm91cCBtZW1iZXJzLiBUaGlzIG1hdGNoZXMgd2hhdCBhIGRvd25zdHJlYW1cbiAgICAgICAgLy8gYHJlYWRfanNvbl9hdXRvKC4uLilgIHdvdWxkIHNlZTsgdGhlIHByZXZpb3VzIGJlaGF2aW9yIG9mXG4gICAgICAgIC8vIHJlcG9ydGluZyBvbmx5IHRoZSBpbi1tZW1vcnkgdG9wLWxldmVsIGNvdW50IGNvbnRyYWRpY3RlZFxuICAgICAgICAvLyB0aGUgYWN0dWFsIHN0cmVhbS5cbiAgICAgICAgc2VsZWN0b3JzOiBuU2VsICsgbkdyb3VwTWVtYmVycyxcbiAgICAgICAgZmVlZGJhY2s6IG5GYixcbiAgICAgICAgcGFnZXM6IG5QZyxcbiAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiBuRmVlZGJhY2tCZWFyaW5nLFxuICAgICAgICBncm91cE1lbWJlcnM6IG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDogbkVsZW1lbnRTaG90cyxcbiAgICAgICAgc2NyZWVuc2hvdHNHcm91cDogbkdyb3VwU2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzUGFnZTogblBhZ2VTaG90cyxcbiAgICAgICAgc2VsZWN0b3JzTWlzc2luZ1NjcmVlbnNob3Q6IG5NaXNzaW5nU2hvdCxcbiAgICAgICAgb3JwaGFuZWRGZWVkYmFjazogbk9ycGhhbmVkRmIsXG4gICAgICB9LFxuICAgICAgLy8gU2luZ2xlIGNhbm9uaWNhbCByZXNvbHV0aW9uIHJ1bGUuIEV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MXG4gICAgICAvLyAoc2NyZWVuc2hvdC5lbGVtZW50L2dyb3VwL3BhZ2UpIGlzIHJlbGF0aXZlIHRvIGBwYXRoUm9vdGA6XG4gICAgICAvLyAgIOKAoiAnYXJjaGl2ZSc6IGZvciB0YXIuenN0IGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGVcbiAgICAgIC8vICAgICBleHRyYWN0ZWQgYXJjaGl2ZSByb290IChlLmcuIGBzY3JlZW5zaG90cy9mb28ucG5nYCkuXG4gICAgICAvLyAgIOKAoiAnd29ya3NwYWNlJzogZm9yIHBsYWluIEpTT05MIGV4cG9ydHMsIHBhdGhzIGFyZSByZWxhdGl2ZSB0b1xuICAgICAgLy8gICAgIHRoZSB3b3Jrc3BhY2UgZGlyIChgRG93bmxvYWRzLy5waW5jaGdyYWIvPHdvcmtzcGFjZT4vYCkuXG4gICAgICAvLyBSZWNlaXZlcnMgbm8gbG9uZ2VyIGhhdmUgdG8gZ3Vlc3Mgd2hpY2ggcGF0aCBzaGFwZSBhcHBsaWVzLlxuICAgICAgcGF0aFJvb3Q6IGZvcm1hdCA9PT0gJ3Rhci56c3QnID8gJ2FyY2hpdmUnIDogJ3dvcmtzcGFjZScsXG4gICAgfTtcbiAgICAvLyBDb250ZW50LWRlcml2ZWQgaWRlbnRpdHkgKFNIQS0yNTYgcHJlZml4IG92ZXIgc2xpbSByb3dzICsgc2NyZWVuc2hvdFxuICAgIC8vIG5hbWVzKS4gU2FtZSBjb250ZW50IOKGkiBzYW1lIGJ1bmRsZUlkIOKGkiBkb3duc3RyZWFtIH4vLnBpbmNoZ3JhYiBzdGF0ZVxuICAgIC8vIGtleXMgc3RheSBzdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMuXG4gICAgaWYgKG9wdHMuYnVuZGxlSWQpIG91dC5idW5kbGVJZCA9IG9wdHMuYnVuZGxlSWQ7XG4gICAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlcnMgc28gYSBkb3duc3RyZWFtIGFnZW50IGtub3dzIHdoaWNoIFVJIHNraWxsXG4gICAgLy8gb3ducyB0aGUgdHJpYWdlIGZsb3cgKyB3aGljaCBERVNJR04ubWQgb3ducyB0aGUgdmlzdWFsIGlkZW50aXR5LlxuICAgIC8vXG4gICAgLy8gYGlubGluZTogdHJ1ZWAgaXMgc2V0IE9OTFkgZm9yIHRhci56c3QgZXhwb3J0cyAod2hlcmUgdGhlIC5tZFxuICAgIC8vIGZpbGVzIGFyZSBwaHlzaWNhbGx5IGJ1bmRsZWQgaW50byB0aGUgYXJjaGl2ZSkuIEpTT05MLW9ubHlcbiAgICAvLyBleHBvcnRzIGVtaXQgYGlubGluZTogZmFsc2VgIHBsdXMgdGhlIHJlY2VpdmVyLXNpZGUgYHBhdGhgIHNvXG4gICAgLy8gYSBjb25zdW1lciBwYWlyZWQgd2l0aCB0aGUgc3RhbmRhbG9uZSBKU09OTCBjYW4gcmVzb2x2ZSB0aGVcbiAgICAvLyByZWZlcmVuY2VkIGZpbGUgb2ZmIHRoZWlyIG93biBmaWxlc3lzdGVtLlxuICAgIC8vXG4gICAgLy8gYHRlbXBsYXRlOiB0cnVlYCBmbGFncyB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKAlCB1c2VmdWxcbiAgICAvLyBmb3IgcmVjZWl2ZXJzIHdobyB3YW50IHRvIGRpc3Rpbmd1aXNoIGJ1bmRsZWQtZGVmYXVsdCBjb250ZW50XG4gICAgLy8gZnJvbSB0aGUgdXNlcidzIGFjdHVhbCB3b3JraW5nIG5vdGVzLlxuICAgIGNvbnN0IGlzVGFyQnVuZGxlID0gZm9ybWF0ID09PSAndGFyLnpzdCc7XG4gICAgb3V0LnNraWxsID0ge1xuICAgICAgbmFtZTogJ1BpbmNoR3JhYicsXG4gICAgICBwYXRoOiBwcmVmcy5za2lsbFBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuc2tpbGwuYXJjaGl2ZVBhdGggPSAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgb3V0LnNraWxsLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5za2lsbC5jdXN0b21pemVkID0gdHJ1ZTtcbiAgICBvdXQuZGVzaWduID0ge1xuICAgICAgcGF0aDogcHJlZnMuZGVzaWduUGF0aCxcbiAgICAgIGlubGluZTogaXNUYXJCdW5kbGUsXG4gICAgfTtcbiAgICBpZiAoaXNUYXJCdW5kbGUpIG91dC5kZXNpZ24uYXJjaGl2ZVBhdGggPSAnREVTSUdOLm1kJztcbiAgICBpZiAoaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkpIG91dC5kZXNpZ24udGVtcGxhdGUgPSB0cnVlO1xuICAgIGVsc2Ugb3V0LmRlc2lnbi5jdXN0b21pemVkID0gdHJ1ZTtcblxuICAgIC8vIFNlbGYtcm9hc3QgZGlhZ25vc3RpY3MuXG4gICAgY29uc3QgZGlhZ25vc3RpY3M6IEV4cG9ydERpYWdub3N0aWNbXSA9IFtdO1xuICAgIC8vIEZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzIHdpdGggbm8gc2NyZWVuc2hvdC5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmhhcyhtLmVudHJ5LnVpZCkpIGNvbnRpbnVlO1xuICAgICAgaWYgKCFtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuJyxcbiAgICAgICAgICBjb2RlOiAnRkVFREJBQ0tfUEFSRU5UX01JU1NJTkdfU0NSRUVOU0hPVCcsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGBzZWxlY3RvciAke20uZW50cnkuc2VsZWN0b3J9IGNhcnJpZXMgZmVlZGJhY2sgYnV0IGhhcyBubyBlbGVtZW50L2dyb3VwIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gT3JwaGFuZWQgZmVlZGJhY2sgKHBhcmVudFVpZCBkb2Vzbid0IHJlc29sdmUpLlxuICAgIGZvciAoY29uc3QgZmJVaWQgb2YgZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcykge1xuICAgICAgaWYgKCFzZWxlY3RvclVpZHMuaGFzKGZiVWlkKSkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICBjb2RlOiAnT1JQSEFORURfRkVFREJBQ0snLFxuICAgICAgICAgIHVpZDogZmJVaWQsXG4gICAgICAgICAgZGV0YWlsOiAnZmVlZGJhY2sgcm93IHJlZmVyZW5jZXMgYSBwYXJlbnRVaWQgdGhhdCBoYXMgbm8gbWF0Y2hpbmcgc2VsZWN0b3IgaW4gdGhpcyBhcmNoaXZlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEhvdmVyLXN0YXRlIGNhcHR1cmVzIHVzdWFsbHkgbmVlZCBhIGJlZm9yZS9hZnRlcjsgZmxhZyBhbnkgd2hvc2VcbiAgICAvLyBzY3JlZW5zaG90IHN0b3J5IGlzIGluY29tcGxldGUgKGJ1ZyAjMTYgcGFydGlhbCkuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnN0YXRlcyAmJiBtLmVudHJ5LnN0YXRlcy5pbmNsdWRlcygnaG92ZXInKSAmJiAhbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0hPVkVSX1NUQVRFX05PX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgY2FwdHVyZWQgaW4gOmhvdmVyIHN0YXRlIGJ1dCBoYXMgbm8gc2NyZWVuc2hvdGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBMTF5OiBmbGFnIGZhaWxpbmcgY29udHJhc3QgKGJ1ZyAjMTUgZm9sbG93LXRocm91Z2gpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5hMTF5Py5jb250cmFzdFBhc3NlcyA9PT0gJ2ZhaWwnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0NPTlRSQVNUX0JFTE9XX0FBJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHRleHQgY29udHJhc3QgcmF0aW8gJHttLmVudHJ5LmExMXkuY29udHJhc3RSYXRpbyA/PyAnPyd9IGlzIGJlbG93IFdDQUcgQUFgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aCkgb3V0LmV4cG9ydERpYWdub3N0aWNzID0gZGlhZ25vc3RpY3M7XG5cbiAgICAvLyBCdWlsZCBpZGVudGl0eS4gUHVsbCBmcm9tIHRoZSBtb3N0IHJlY2VudCBwYWdlIHJvdydzIGdpdENvbnRleHRcbiAgICAvLyAoc291cmNlZCB2aWEgYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIj5gIG9uIHRoZSBjYXB0dXJlZCBhcHApXG4gICAgLy8gcGx1cyB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiB2ZXJzaW9uLiBPbWl0IHRoZSBibG9jayBlbnRpcmVseVxuICAgIC8vIHdoZW4gbmVpdGhlciBpcyBhdmFpbGFibGUuXG4gICAgY29uc3QgbGFzdFBhZ2UgPSBbLi4ubWVzc2FnZXNdLnJldmVyc2UoKS5maW5kKChtKSA9PiBtLnR5cGUgPT09ICdwYWdlJykgYXMgUGFnZU1lc3NhZ2UgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgZ2l0ID0gbGFzdFBhZ2U/LmdpdENvbnRleHQ7XG4gICAgY29uc3QgZXh0VmVyID0gaW5FeHRlbnNpb24gJiYgY2hyb21lLnJ1bnRpbWU/LmdldE1hbmlmZXN0ID8gY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIGlmIChnaXQgfHwgZXh0VmVyKSB7XG4gICAgICBvdXQuYnVpbGQgPSB7fTtcbiAgICAgIGlmIChleHRWZXIpIG91dC5idWlsZC5leHRlbnNpb25WZXJzaW9uID0gZXh0VmVyO1xuICAgICAgaWYgKGdpdD8uY29tbWl0KSBvdXQuYnVpbGQuY29tbWl0ID0gZ2l0LmNvbW1pdDtcbiAgICAgIGlmIChnaXQ/LmJyYW5jaCkgb3V0LmJ1aWxkLmJyYW5jaCA9IGdpdC5icmFuY2g7XG4gICAgICBpZiAoZ2l0Py5idWlsZCkgb3V0LmJ1aWxkLmRlcGxveUJ1aWxkID0gZ2l0LmJ1aWxkO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCBidWlsZEpzb25sID0gKGZpbGVuYW1lRm9yTWFuaWZlc3Q/OiBzdHJpbmcsIGZvcm1hdDogRXhwb3J0TWFuaWZlc3RbJ2Zvcm1hdCddID0gJ2pzb25sJywgb3B0czoge25vd0lzbz86IHN0cmluZzsgYnVuZGxlSWQ/OiBzdHJpbmd9ID0ge30pOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZmlsZW5hbWVGb3JNYW5pZmVzdCA/PyBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gYnVpbGRNYW5pZmVzdChmaWxlbmFtZSwgZm9ybWF0LCBvcHRzKTtcbiAgICBjb25zdCBsaW5lcyA9IGJ1aWxkU2xpbSgpO1xuICAgIGlmICghbGluZXMubGVuZ3RoKSB7XG4gICAgICAvLyBFdmVuIGFuIGVtcHR5IHdvcmtzcGFjZSBnZXRzIGEgbWFuaWZlc3QgbGluZSBzbyBkb3duc3RyZWFtIHRvb2xzXG4gICAgICAvLyBjYW4gdmVyaWZ5IHRoZSBmaWxlIHdhcyBnZW5lcmF0ZWQgYnkgUGluY2hHcmFiLlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSArICdcXG4nO1xuICAgIH1cbiAgICByZXR1cm4gW0pTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSwgLi4ubGluZXMubWFwKChsKSA9PiBKU09OLnN0cmluZ2lmeShsKSldLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gIH07XG4gIGNvbnN0IGRvd25sb2FkRmlsZSA9IChjb250ZW50OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWUgPSAndGV4dC9wbGFpbicpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtjb250ZW50XSwge3R5cGU6IG1pbWV9KSk7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7XG4gICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgIGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gIH07XG5cbiAgY29uc3Qgb25Db3B5QWxsID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKCk7XG4gICAgaWYgKHRleHQudHJpbSgpLnNwbGl0KCdcXG4nKS5sZW5ndGggPD0gMSAmJiAhbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAvLyBNYW5pZmVzdC1vbmx5IG91dHB1dCBmb3IgYW4gZW1wdHkgd29ya3NwYWNlIHNob3VsZG4ndCBwcmV0ZW5kIHRvIGJlIGEgY29weS5cbiAgICAgIHNldFN0YXR1cygnTm90aGluZyB0byBjb3B5Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpO1xuICAgIHNldFN0YXR1cyhgQ29waWVkIEpTT05MIMK3ICR7dG9rZW5Db3VudCh0ZXh0KX0gdG9rZW5zIMK3ICR7d29yZENvdW50KHRleHQpfSB3b3Jkc2ApO1xuICAgIHNob3dDb3BpZWQoJ0NvcGllZCBKU09OTCcsIGAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgfTtcbiAgLy8gU2F2ZSB0aHJvdWdoIHRoZSBiYWNrZ3JvdW5kJ3MgZmlsZSBicmlkZ2UgaWYgd2UncmUgaW4gYW4gZXh0ZW5zaW9uXG4gIC8vIGNvbnRleHQsIHNvIHRoZSBmaWxlIGxhbmRzIHVuZGVyIERvd25sb2Fkcy8ucGluY2hncmFiLzx3cz4vZXhwb3J0cy8uXG4gIC8vIE90aGVyd2lzZSAodGVzdCBwYWdlLCBkZXYgc2VydmVyKSwgZmFsbCBiYWNrIHRvIGEgc3ludGhldGljIGJsb2IgVVJMLlxuICBjb25zdCBzYXZlRXhwb3J0VG9EaXNrID0gYXN5bmMgKHRleHQ6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZywgbWltZTogc3RyaW5nLCBraW5kOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sg4oaSJywge2ZpbGVuYW1lLCBtaW1lLCBzaXplOiB0ZXh0Lmxlbmd0aCwga2luZH0pO1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtraW5kOiAnc2F2ZS10ZXh0Jywgd29ya3NwYWNlOiBhY3RpdmVXcywgZmlsZW5hbWUsIHRleHQsIG1pbWV9KTtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ3NhdmVFeHBvcnRUb0Rpc2sgcmVwbHk6JywgcmVwbHkpO1xuICAgICAgaWYgKHJlcGx5Py5vayAmJiByZXBseS5hYnNQYXRoKSB7XG4gICAgICAgIGxhc3RFeHBvcnQucmVsUGF0aCA9IHJlcGx5LmZpbGVuYW1lID8/IG51bGw7XG4gICAgICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IHJlcGx5LmFic1BhdGg7XG4gICAgICAgIGxhc3RFeHBvcnQuY29weVBhdGggPSByZXBseS5jb3B5UGF0aCA/PyByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LnRlbXBQYXRoID0gQm9vbGVhbihyZXBseS50ZW1wUGF0aCk7XG4gICAgICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIHNldFN0YXR1cyhgRXhwb3J0ZWQgwrcgJHtsYXN0RXhwb3J0LmNvcHlQYXRofWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlcnIgPSByZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCAod29ya2VyIGRlYWQ/IHJlbG9hZCBleHRlbnNpb24gYXQgY2hyb21lOi8vZXh0ZW5zaW9ucyknO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdzYXZlRXhwb3J0VG9EaXNrIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBFeHBvcnQgZmFpbGVkOiAke2Vycn1gLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICBzaG93RG93bmxvYWRFcnJvcignRXhwb3J0IGZhaWxlZCcsIFN0cmluZyhlcnIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZG93bmxvYWRGaWxlKHRleHQsIGZpbGVuYW1lLCBtaW1lKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBmaWxlbmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IGtpbmQ7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICBzZXRTdGF0dXMoJ0V4cG9ydGVkJyk7XG4gIH07XG4gIGNvbnN0IG9uRXhwb3J0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IGNvbnRlbnRIYXNoID0gYXdhaXQgY29tcHV0ZUNvbnRlbnRIYXNoKFtdKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ2pzb25sJywgY29udGVudEhhc2guc2xpY2UoMCwgOCkpO1xuICAgIGNvbnN0IHRleHQgPSBidWlsZEpzb25sKGZpbGVuYW1lLCAnanNvbmwnLCB7bm93SXNvOiBleHBvcnROb3dJc28oKSwgYnVuZGxlSWQ6IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KX0pO1xuICAgIGF3YWl0IHNhdmVFeHBvcnRUb0Rpc2sodGV4dCwgZmlsZW5hbWUsICdhcHBsaWNhdGlvbi9qc29ubCcsICdqc29ubCcpO1xuICB9O1xuICAvLyDilIDilIDilIAgdGFyLnpzdCB3b3Jrc3BhY2UgZXhwb3J0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCdW5kbGUgSlNPTkwgKyBSRUFETUUgKyBEdWNrREIgcmVjaXBlcyArIHNjcmVlbnNob3RzLmpzb24gKyBhY3R1YWwgUE5HXG4gIC8vIHNjcmVlbnNob3RzIGludG8gYSBzaW5nbGUgLnRhci56c3QgYXJjaGl2ZS4gdGFyIGdpdmVzIHVzIGEgY2xlYW5cbiAgLy8gY29udGFpbmVyIChvbmUgZmlsZSBwZXIgZW50cnksIG5vIHppcC1zdHlsZSBjZW50cmFsLWRpcmVjdG9yeVxuICAvLyBjb250b3J0aW9ucyk7IHpzdGQgaXMgdGhlIG1vZGVybiBjb21wcmVzc2lvbiBwYWlyLiBJbXBsZW1lbnRhdGlvbiBpc1xuICAvLyBwdXJlLVRTIOKAlCBzZWUgc3JjL3Rhci50cyBmb3IgdGhlIGVuY29kZXIgKyB6c3RkLWZyYW1lIHdyaXRlci5cbiAgLy8gQnVnICMyODogYSBKU09OLVNjaGVtYSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlIGluIHRoZSBKU09OTC5cbiAgLy8gUmVjZWl2ZXJzIGNhbiB1c2UgdGhpcyB0byB2YWxpZGF0ZSBmaXh0dXJlcywgZHJpdmUgYXV0b2NvbXBsZXRlIGluXG4gIC8vIGVkaXRvcnMsIGFuZCBhdXRvLWdlbmVyYXRlIHBhcnNlcnMuIEtlZXAgdGhpcyBpbiBzeW5jIHdpdGggdGhlXG4gIC8vIHNoYXBlcyBlbWl0dGVkIGJ5IGJ1aWxkU2xpbS9zbGltRW50cnkg4oCUIGBucG0gcnVuIHRlc3RgIHZhbGlkYXRlcyBhXG4gIC8vIHNhbXBsZSBhZ2FpbnN0IHRoaXMgc2NoZW1hLlxuICBjb25zdCBidWlsZFNjaGVtYUpzb24gPSAoKTogc3RyaW5nID0+IEpTT04uc3RyaW5naWZ5KHtcbiAgICAkc2NoZW1hOiAnaHR0cHM6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQvMjAyMC0xMi9zY2hlbWEnLFxuICAgICRpZDogJ2h0dHBzOi8vd3Jhbm5nbGUuY29tL3BpbmNoZ3JhYi9leHBvcnQudjIuc2NoZW1hLmpzb24nLFxuICAgIHRpdGxlOiAnUGluY2hHcmFiIGV4cG9ydCAodjIpJyxcbiAgICBkZXNjcmlwdGlvbjogJ0pTT05MIHJvdyArIG1hbmlmZXN0IHNjaGVtYXMgZm9yIFBpbmNoR3JhYiB3b3Jrc3BhY2UgZXhwb3J0cy4nLFxuICAgIG9uZU9mOiBbXG4gICAgICB7JHJlZjogJyMvJGRlZnMvbWFuaWZlc3QnfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9wYWdlJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvc2VsZWN0b3InfSxcbiAgICAgIHskcmVmOiAnIy8kZGVmcy9mZWVkYmFjayd9LFxuICAgIF0sXG4gICAgJGRlZnM6IHtcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndG9vbCcsICd0cycsICd3b3Jrc3BhY2UnLCAnZmlsZW5hbWUnLCAnZm9ybWF0JywgJ2hvc3RzJywgJ2NvdW50cyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdtYW5pZmVzdCd9LFxuICAgICAgICAgIHRvb2w6IHtjb25zdDogJ3BpbmNoZ3JhYid9LFxuICAgICAgICAgIHRzOiB7dHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZSd9LFxuICAgICAgICAgIGdlbmVyYXRlZDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgd29ya3NwYWNlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZpbGVuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGZvcm1hdDoge2VudW06IFsnanNvbmwnLCAnbWFya2Rvd24nLCAndGFyLnpzdCddfSxcbiAgICAgICAgICBidW5kbGVJZDoge3R5cGU6ICdzdHJpbmcnLCBwYXR0ZXJuOiAnXlswLTlhLWZdezE2fSQnfSxcbiAgICAgICAgICBob3N0czoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBwYXRoUm9vdDoge2VudW06IFsnYXJjaGl2ZScsICd3b3Jrc3BhY2UnXX0sXG4gICAgICAgICAgY291bnRzOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NlbGVjdG9ycycsICdmZWVkYmFjaycsICdwYWdlcyddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzZWxlY3RvcnM6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBmZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZ3JvdXBNZW1iZXJzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNFbGVtZW50OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgc2NyZWVuc2hvdHNHcm91cDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzUGFnZToge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgb3JwaGFuZWRGZWVkYmFjazoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHBhZ2VzSHRtbDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWdlbnRQcm90b2NvbDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydhcmNoaXZlUGF0aCddLFxuICAgICAgICAgICAgcHJvcGVydGllczoge2FyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1bmRsZWRTa2lsbHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnaWQnLCAna2luZCcsICdhcmNoaXZlUGF0aCddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAga2luZDoge2VudW06IFsnc2tpbGwnLCAncmVmZXJlbmNlJ119LFxuICAgICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGludm9jYXRpb246IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGFnZXNIdG1sOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3VybCcsICdhcmNoaXZlUGF0aCcsICdieXRlcyddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGJ5dGVzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBza2lsbDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc2lnbjoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGlubGluZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGFyY2hpdmVQYXRoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICAgIGN1c3RvbWl6ZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZXh0ZW5zaW9uVmVyc2lvbjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY29tbWl0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBicmFuY2g6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpcnR5OiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgZGVwbG95QnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwb3J0RGlhZ25vc3RpY3M6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc2V2ZXJpdHknLCAnY29kZSddLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgc2V2ZXJpdHk6IHtlbnVtOiBbJ2Vycm9yJywgJ3dhcm4nLCAnaW5mbyddfSxcbiAgICAgICAgICAgICAgICBjb2RlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIGRldGFpbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGFnZToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3RzJywgJ3VybCddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdwYWdlJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRpdGxlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICB0b2tlbnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHVzZXJBZ2VudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBsYW5nOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGdpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2Vzc2lvbklkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ24nLCAndHMnLCAndXJsJywgJ3RhZycsICdzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdzZWxlY3Rvcid9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBuOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBjYXB0dXJlSW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGV2ZW50SW5kZXg6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHZpc3VhbE9yZGVyOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICBkaXNwbGF5TGFiZWw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdXJsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvcjoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzZWxlY3Rvck1hdGNoQ291bnQ6IHt0eXBlOiAnaW50ZWdlcicsIG1pbmltdW06IDB9LFxuICAgICAgICAgIHRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcmVuZGVyZWRUZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHJvbGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgYWNjZXNzaWJsZU5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGVzdElkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGNsYXNzZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgYXR0cnM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHJlY3Q6IHskcmVmOiAnIy8kZGVmcy9yZWN0J30sXG4gICAgICAgICAgc3RhdGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGZyYW1ld29yazoge2VudW06IFsncmVhY3QnLCAndnVlJywgJ2xpdCcsICdzdGVuY2lsJywgJ3N2ZWx0ZScsICd3ZWItY29tcG9uZW50J119LFxuICAgICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBkaXNwbGF5TmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2hhaW46IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtmaWxlOiB7dHlwZTogWydzdHJpbmcnLCAnbnVsbCddfSwgbGluZToge3R5cGU6IFsnaW50ZWdlcicsICdudWxsJ119fSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdXRlckhUTUw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgc3R5bGVzOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBzY3JlZW5zaG90OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZ3JvdXA6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHBhZ2U6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGNhcHR1cmVkQXQ6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hhZG93SG9zdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpblNoYWRvd0RPTToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgZ3JvdXBVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ3JvdXBNZW1iZXJVaWRzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIGZlZWRiYWNrOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIF9hdWRpdDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGFuY2VzdG9yczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvYW5jZXN0b3InfX0sXG4gICAgICAgICAgICAgIGNvbXBvbmVudFJvb3Q6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgcHNldWRvRWxlbWVudHM6IHt0eXBlOiAnb2JqZWN0J30sXG4gICAgICAgICAgICAgIG1hdGNoZWRSdWxlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7JHJlZjogJyMvJGRlZnMvbWF0Y2hlZFJ1bGUnfX0sXG4gICAgICAgICAgICAgIHZpZXdwb3J0OiB7JHJlZjogJyMvJGRlZnMvdmlld3BvcnQnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBmZWVkYmFjazoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3VpZCcsICd0cycsICd0ZXh0JywgJ3RhZ3MnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnZmVlZGJhY2snfSxcbiAgICAgICAgICB1aWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdHM6IHt0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJ30sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBwYXJlbnRVaWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGV0YWNoZWQ6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIHRhZ3M6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgaXNUZXN0RGF0YToge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgc3VnZ2VzdGVkU2tpbGxzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3NraWxsJywgJ2xvY2F0b3InXSxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge3NraWxsOiB7dHlwZTogJ3N0cmluZyd9LCBsb2NhdG9yOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2aWV3cG9ydDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHc6IHt0eXBlOiAnaW50ZWdlcid9LCBoOiB7dHlwZTogJ2ludGVnZXInfSwgZHByOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICAgIGNvbG9yU2NoZW1lOiB7ZW51bTogWydsaWdodCcsICdkYXJrJ119LFxuICAgICAgICAgIHJlZHVjZWRNb3Rpb246IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGRpcmVjdGlvbjoge2VudW06IFsnbHRyJywgJ3J0bCddfSxcbiAgICAgICAgICB6b29tOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlY3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3gnLCAneScsICd3JywgJ2gnXSxcbiAgICAgICAgcHJvcGVydGllczoge3g6IHt0eXBlOiAnbnVtYmVyJ30sIHk6IHt0eXBlOiAnbnVtYmVyJ30sIHc6IHt0eXBlOiAnbnVtYmVyJ30sIGg6IHt0eXBlOiAnbnVtYmVyJ319LFxuICAgICAgfSxcbiAgICAgIGFuY2VzdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd0YWcnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1hdGNoZWRSdWxlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGVjbGFyYXRpb25zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBtZWRpYToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSwgbnVsbCwgMikgKyAnXFxuJztcblxuICAvLyBHZW5lcmF0ZSByZXBhaXItaW5kZXgubWQgYXMgYSBzdHJ1Y3R1cmVkIHN0YXJ0aW5nIHBvaW50IGZvciBhblxuICAvLyBhdXRvbm9tb3VzIGNvZGluZyBhZ2VudC4gRm9yIGV2ZXJ5IGZlZWRiYWNrIHJvdywgbWVjaGFuaWNhbGx5IGRlcml2ZTpcbiAgLy8gICDigKIgdGFyZ2V0IGlkZW50aXR5ICh1aWQsIHNlbGVjdG9yLCB0YWcsIGFjY2Vzc2libGUgbmFtZSlcbiAgLy8gICDigKIgc2NyZWVuc2hvdCBwYXRoICh3aXRoIGFyY2hpdmUtcmVsYXRpdmUgZm9ybSlcbiAgLy8gICDigKIgc291cmNlIGhpbnRzIChjb21wb25lbnQgY2hhaW4sIHNvdXJjZW1hcCBmaWxlL2xpbmUpXG4gIC8vICAg4oCiIHN1Z2dlc3RlZCBmaXggY2F0ZWdvcnkgKGNoZWFwIGhldXJpc3RpYyBvbiB0ZXh0KVxuICAvLyBUaGUgYWdlbnQgdXNlcyB0aGlzIGFzIGEgc3RhcnRpbmcgcHVuY2ggbGlzdCwgdGhlbiB2YWxpZGF0ZXMgK1xuICAvLyByZWZpbmVzIGVhY2ggc3VnZ2VzdGlvbiBhZ2FpbnN0IHRoZSBmdWxsIEpTT05MLlxuICBjb25zdCBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkgPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICgvXFxiKHR5cG98Y29weXx3b3JkaW5nfGxhYmVsfG1pc3NwZWxsfGdyYW1tYXJ8Y2FwaXRhbGl6KS8udGVzdCh0KSkgcmV0dXJuICdjb3B5JztcbiAgICBpZiAoL1xcYihhbGlnbnxzcGFjaW5nfHBhZGRpbmd8bWFyZ2lufGxheW91dHxvdmVybGFwfGNyb3dkZWR8Y3JhbXBlZHx0aWdodHxnYXApLy50ZXN0KHQpKSByZXR1cm4gJ2xheW91dCc7XG4gICAgaWYgKC9cXGIodW5jbGVhcnxjb25mdXNpbmd8d2hhdCBkb2VzfHdoYXQgaXN8ZG9uJ3QgdW5kZXJzdGFuZHxoYXJkIHRvfG5hdnxuYXZpZ2F0aW9uKS8udGVzdCh0KSkgcmV0dXJuICdhZmZvcmRhbmNlJztcbiAgICBpZiAoL1xcYihjb250cmFzdHxjb2xvciBibGluZHxzY3JlZW4gcmVhZGVyfGFyaWF8Zm9jdXN8a2V5Ym9hcmR8dGFifGExMXl8YWNjZXNzaWIpLy50ZXN0KHQpKSByZXR1cm4gJ2FjY2Vzc2liaWxpdHknO1xuICAgIGlmICgvXFxiKGJyb2tlbnxjcmFzaHxudWxsfHVuZGVmaW5lZHxlcnJvcnw0MDR8ZmFpbCkvLnRlc3QodCkpIHJldHVybiAnc3RhdGUnO1xuICAgIGlmICgvXFxiKHVnbHl8Y29sb3J8Z3JhZGllbnR8c2hhZG93fHBvbGlzaHx2aXN1YWx8c3R5bGUpLy50ZXN0KHQpKSByZXR1cm4gJ3Zpc3VhbC1wb2xpc2gnO1xuICAgIHJldHVybiAndW5zcGVjaWZpZWQnO1xuICB9O1xuICAvLyBIZXVyaXN0aWMgc2VlZCBmb3IgdGhlIFNlbmQtdG8tQWdlbnQgcHJvdG9jb2wncyBtYXAgcGhhc2U6IGNhdGVnb3J5IOKGklxuICAvLyBidW5kbGVkLXNraWxsIGxvY2F0b3JzIChpZHMgbWF0Y2ggc2tpbGxzLWluZGV4Lmpzb24pLiBUaGUgY29uc3VtaW5nXG4gIC8vIGFnZW50IGlzIHRvbGQgdG8gVkVSSUZZIHRoZXNlLCBub3QgdHJ1c3QgdGhlbSDigJQgdGhleSBleGlzdCBzbyB0aGUgbWFwXG4gIC8vIHBoYXNlIHN0YXJ0cyBmcm9tIHNvbWV0aGluZyBpbnN0ZWFkIG9mIG5vdGhpbmcuIE9ubHkgbG9jYXRvcnMgdGhhdCBjYW5cbiAgLy8gYWN0dWFsbHkgZXhpc3QgaW4gdGhlIGFyY2hpdmUgYXJlIGVtaXR0ZWQgKHZlbmRvcmVkIG9uZXMgZ2F0ZSBvbiB0aGVcbiAgLy8gYnVuZGxlU2tpbGxzIHByZWYpLlxuICBjb25zdCBzdWdnZXN0U2tpbGxzRm9yID0gKHRleHQ6IHN0cmluZyk6IEFycmF5PHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9PiA9PiB7XG4gICAgY29uc3QgUElOQ0hHUkFCID0ge3NraWxsOiAncGluY2hncmFiJywgbG9jYXRvcjogJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9O1xuICAgIGNvbnN0IFBGRCA9IHtza2lsbDogJ3BmZCcsIGxvY2F0b3I6ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kJ307XG4gICAgY29uc3QgaW1wID0gKHNsdWc6IHN0cmluZyk6IHtza2lsbDogc3RyaW5nOyBsb2NhdG9yOiBzdHJpbmd9ID0+XG4gICAgICAoe3NraWxsOiBgaW1wZWNjYWJsZS8ke3NsdWd9YCwgbG9jYXRvcjogYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyR7c2x1Z30ubWRgfSk7XG4gICAgY29uc3QgdmVuZG9yZWQgPSBwcmVmcy5idW5kbGVTa2lsbHMgJiYgQlVORExFRF9TS0lMTFNfUFJFU0VOVDtcbiAgICBpZiAoIXZlbmRvcmVkKSByZXR1cm4gW1BJTkNIR1JBQl07XG4gICAgc3dpdGNoIChpbmZlckZlZWRiYWNrQ2F0ZWdvcnkodGV4dCkpIHtcbiAgICAgIGNhc2UgJ2NvcHknOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdjbGFyaWZ5JyksIFBGRF07XG4gICAgICBjYXNlICdsYXlvdXQnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdsYXlvdXQnKSwgUEZEXTtcbiAgICAgIGNhc2UgJ2FmZm9yZGFuY2UnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdpbnRlcmFjdGlvbi1kZXNpZ24nKSwgUEZEXTtcbiAgICAgIGNhc2UgJ2FjY2Vzc2liaWxpdHknOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdhdWRpdCcpLCBQRkRdO1xuICAgICAgY2FzZSAnc3RhdGUnOiByZXR1cm4gW1BJTkNIR1JBQiwgUEZEXTtcbiAgICAgIGNhc2UgJ3Zpc3VhbC1wb2xpc2gnOiByZXR1cm4gW1BJTkNIR1JBQiwgaW1wKCdwb2xpc2gnKSwgUEZEXTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBbUElOQ0hHUkFCLCBQRkRdO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYnVpbGRSZXBhaXJJbmRleCA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0eXBlIFJvdyA9IHtmZWVkYmFjazogRmVlZGJhY2tNZXNzYWdlOyBwYXJlbnQ/OiBTZWxlY3Rvck1lc3NhZ2V9O1xuICAgIGNvbnN0IHJvd3M6IFJvd1tdID0gW107XG4gICAgY29uc3QgYnlVaWQgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNZXNzYWdlPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgYnlVaWQuc2V0KG0uZW50cnkudWlkLCBtKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdmZWVkYmFjaycpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcGFyZW50ID0gbS5wYXJlbnRVaWQgPyBieVVpZC5nZXQobS5wYXJlbnRVaWQpIDogdW5kZWZpbmVkO1xuICAgICAgcm93cy5wdXNoKHtmZWVkYmFjazogbSwgcGFyZW50fSk7XG4gICAgfVxuICAgIGlmICghcm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICcjIHJlcGFpci1pbmRleC5tZCcsXG4gICAgICAgICcnLFxuICAgICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICAgICcnLFxuICAgICAgICAnXyhubyBmZWVkYmFjayBpbiB0aGlzIGV4cG9ydCDigJQgbm90aGluZyB0byByZXBhaXIpXycsXG4gICAgICAgICcnLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICAgIG91dC5wdXNoKCcjIHJlcGFpci1pbmRleC5tZCcpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICBvdXQucHVzaChgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWApO1xuICAgIG91dC5wdXNoKGBXb3Jrc3BhY2U6IFxcYCR7bWFuaWZlc3Qud29ya3NwYWNlfVxcYCDCtyBIb3N0czogJHttYW5pZmVzdC5ob3N0cy5tYXAoKGgpID0+ICdgJyArIGggKyAnYCcpLmpvaW4oJywgJykgfHwgJyhub25lKSd9YCk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdBIHN0YXJ0aW5nIHB1bmNoIGxpc3QgZm9yIGFuIGF1dG9ub21vdXMgcmVwYWlyIGFnZW50LiBFYWNoIHJvdyBpcyBvbmUgdXNlciBjb21wbGFpbnQgd2l0aCB0aGUgZGF0YSBuZWVkZWQgdG8gbG9jYXRlLCBmaXgsIGFuZCB2ZXJpZnkuIENyb3NzLXJlZmVyZW5jZSBgJyArIGpzb25sTmFtZSArICdgIGZvciB0aGUgZnVsbCByZWNvcmQuJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCcjIyBUYXNrcycpO1xuICAgIG91dC5wdXNoKCcnKTtcbiAgICByb3dzLmZvckVhY2goKHtmZWVkYmFjaywgcGFyZW50fSwgaSkgPT4ge1xuICAgICAgY29uc3QgZmJJZCA9IGBGJHtTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDMsICcwJyl9YDtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHBhcmVudD8uZW50cnk7XG4gICAgICBvdXQucHVzaChgIyMjICR7ZmJJZH0g4oCUICR7ZmVlZGJhY2sudGV4dC5zbGljZSgwLCA4MCl9JHtmZWVkYmFjay50ZXh0Lmxlbmd0aCA+IDgwID8gJ+KApicgOiAnJ31gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGA+ICR7ZmVlZGJhY2sudGV4dC5zcGxpdCgnXFxuJykuam9pbignXFxuPiAnKX1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICAgIG91dC5wdXNoKGAtICoqZmVlZGJhY2tVaWQ6KiogXFxgJHtmZWVkYmFjay5pZH1cXGBgKTtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgb3V0LnB1c2goYC0gKip0YXJnZXQ6KiogXFxgJHt0YXJnZXQuc2VsZWN0b3J9XFxgIF8odWlkIFxcYCR7dGFyZ2V0LnVpZH1cXGAsIG49JHt0YXJnZXQubn0pX2ApO1xuICAgICAgICBpZiAodGFyZ2V0LnRhZykgb3V0LnB1c2goYC0gKip0YWc6KiogXFxgPCR7dGFyZ2V0LnRhZ30+XFxgJHt0YXJnZXQucm9sZSA/IGAgwrcgcm9sZT1cXGAke3RhcmdldC5yb2xlfVxcYGAgOiAnJ31gKTtcbiAgICAgICAgaWYgKHRhcmdldC5hY2Nlc3NpYmxlTmFtZSkgb3V0LnB1c2goYC0gKiphY2Nlc3NpYmxlIG5hbWU6KiogXCIke3RhcmdldC5hY2Nlc3NpYmxlTmFtZS5zbGljZSgwLCAxMDApfVwiYCk7XG4gICAgICAgIGlmICh0YXJnZXQudGV4dCAmJiB0YXJnZXQudGV4dCAhPT0gdGFyZ2V0LmFjY2Vzc2libGVOYW1lKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKip2aXNpYmxlIHRleHQ6KiogXCIke3RhcmdldC50ZXh0LnNsaWNlKDAsIDEwMCl9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yTWF0Y2hDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzZWxlY3RvciBxdWFsaXR5OioqIG1hdGNoZXMgJHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50fSBlbGVtZW50JHt0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50ID09PSAxID8gJycgOiAncyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90OioqIFxcYCR7dGFyZ2V0LnNjcmVlbnNob3QuZWxlbWVudH1cXGBgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuc2NyZWVuc2hvdD8uZ3JvdXApIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3QgKGdyb3VwKToqKiBcXGAke3RhcmdldC5zY3JlZW5zaG90Lmdyb3VwfVxcYGApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdDoqKiBfKG1pc3Npbmcg4oCUIHNlZSBleHBvcnREaWFnbm9zdGljcylfYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb25zdCBjID0gdGFyZ2V0LmNvbXBvbmVudDtcbiAgICAgICAgICBjb25zdCBjaCA9IGMuY2hhaW4gJiYgYy5jaGFpbi5sZW5ndGggPyBgIMK3IGNoYWluICR7Yy5jaGFpbi5zbGljZSgwLCA1KS5tYXAoKG4pID0+ICdgJyArIG4gKyAnYCcpLmpvaW4oJyDihpIgJyl9YCA6ICcnO1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqY29tcG9uZW50OioqIFxcYCR7Yy5uYW1lID8/IGMuZGlzcGxheU5hbWUgPz8gJz8nfVxcYCAoJHtjLmZyYW1ld29ya30pJHtjaH1gKTtcbiAgICAgICAgICBpZiAoYy5zb3VyY2U/LmZpbGUpIG91dC5wdXNoKGAtICoqc291cmNlOioqIFxcYCR7Yy5zb3VyY2UuZmlsZX1cXGAke2Muc291cmNlLmxpbmUgPyBgOiR7Yy5zb3VyY2UubGluZX1gIDogJyd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC5jb21wb25lbnRSb290KSBvdXQucHVzaChgLSAqKmNvbXBvbmVudCByb290OioqICR7dGFyZ2V0LmNvbXBvbmVudFJvb3R9YCk7XG4gICAgICAgIGlmICh0YXJnZXQuYW5jZXN0b3JzICYmIHRhcmdldC5hbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgY2hhaW4gPSB0YXJnZXQuYW5jZXN0b3JzLnNsaWNlKDAsIDQpLm1hcCgoYSkgPT4gYDwke2EudGFnfT4ke2EuaWQgPyAnIycgKyBhLmlkIDogYS50ZXN0SWQgPyBgW3Rlc3RJZD1cIiR7YS50ZXN0SWR9XCJdYCA6ICcnfWApLmpvaW4oJyDigLogJyk7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKiphbmNlc3RvciBjaGFpbjoqKiAke2NoYWlufWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQudXJsKSBvdXQucHVzaChgLSAqKnVybDoqKiAke3RhcmdldC51cmx9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQucHVzaChgLSAqKnRhcmdldDoqKiBfKG5vIHNlbGVjdG9yIOKAlCBvcnBoYW5lZCBmZWVkYmFjaylfYCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjYXQgPSBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkoZmVlZGJhY2sudGV4dCk7XG4gICAgICBvdXQucHVzaChgLSAqKnN1Z2dlc3RlZCBjYXRlZ29yeToqKiAke2NhdH1gKTtcbiAgICAgIG91dC5wdXNoKCcnKTtcbiAgICB9KTtcbiAgICBvdXQucHVzaCgnLS0tJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKCdDYXRlZ29yaWVzIGFyZSBpbmZlcnJlZCBmcm9tIGZlZWRiYWNrIHRleHQgdmlhIGtleXdvcmQgaGV1cmlzdGljcyDigJQgdmVyaWZ5IGJlZm9yZSBhY3RpbmcuJyk7XG4gICAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbiAgfTtcblxuICBjb25zdCBidWlsZFJlYWRtZSA9IChtYW5pZmVzdDogRXhwb3J0TWFuaWZlc3QsIGpzb25sTmFtZTogc3RyaW5nLCBzaG90Q291bnQ6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW1xuICAgICAgJyMgUGluY2hHcmFiIFdvcmtzcGFjZSBFeHBvcnQnLFxuICAgICAgJycsXG4gICAgICBgR2VuZXJhdGVkOiAke21hbmlmZXN0LnRzfWAsXG4gICAgICBgV29ya3NwYWNlOiBcXGAke21hbmlmZXN0LndvcmtzcGFjZX1cXGBgLFxuICAgICAgYEhvc3RzOiAke21hbmlmZXN0Lmhvc3RzLmxlbmd0aCA/IG1hbmlmZXN0Lmhvc3RzLm1hcCgoaCkgPT4gJ2AnICsgaCArICdgJykuam9pbignLCAnKSA6ICcobm9uZSknfWAsXG4gICAgICBgQ291bnRzOiAqKiR7bWFuaWZlc3QuY291bnRzLnNlbGVjdG9yc30qKiBzZWxlY3RvcnMgwrcgKioke21hbmlmZXN0LmNvdW50cy5mZWVkYmFja30qKiBjb21tZW50cyDCtyAqKiR7bWFuaWZlc3QuY291bnRzLnBhZ2VzfSoqIHBhZ2VzIMK3ICoqJHtzaG90Q291bnR9Kiogc2NyZWVuc2hvdHNgLFxuICAgICAgJycsXG4gICAgICAnIyMgVHJpYWdlIG1hdGVyaWFscycsXG4gICAgICAnJyxcbiAgICAgIG1hbmlmZXN0LnNraWxsPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6KiogYnVuZGxlZCBhdCBcXGAuLyR7bWFuaWZlc3Quc2tpbGwuYXJjaGl2ZVBhdGggPz8gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCd9XFxgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJyBfKGN1c3RvbWl6ZWQg4oCUIHRydXN0IGFzIGF1dGhvcml0YXRpdmUpXycgOiBtYW5pZmVzdC5za2lsbC50ZW1wbGF0ZSA/ICcgXyhidW5kbGVkIGRlZmF1bHQg4oCUIGdlbmVyaWMgYm9pbGVycGxhdGUsIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpXycgOiAnJ30g4oCUIGhvdyB0byByZWFkIHRoaXMgZXhwb3J0IGFuZCB0cmlhZ2UgdGhlIGNhcHR1cmVzLmBcbiAgICAgICAgOiAobWFuaWZlc3Quc2tpbGw/LnBhdGhcbiAgICAgICAgICA/IGAtICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBcXGAke21hbmlmZXN0LnNraWxsLnBhdGh9XFxgIOKAlCByZWFkIG9uIHRoZSByZWNlaXZlcidzIGZpbGVzeXN0ZW0uYFxuICAgICAgICAgIDogJy0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgbWFuaWZlc3QuZGVzaWduPy5pbmxpbmVcbiAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBidW5kbGVkIGlubGluZSBhdCBcXGAuLyR7bWFuaWZlc3QuZGVzaWduLmFyY2hpdmVQYXRoID8/ICdERVNJR04ubWQnfVxcYCR7bWFuaWZlc3QuZGVzaWduLmN1c3RvbWl6ZWQgPyAnIF8oY3VzdG9taXplZCDigJQgdHJ1c3QgdGhlIHRva2VucyAvIHZvaWNlIHJ1bGVzIGFzIHByb2plY3QgY2Fub24pXycgOiBtYW5pZmVzdC5kZXNpZ24udGVtcGxhdGUgPyAnIF8oYnVuZGxlZCBkZWZhdWx0IOKAlCBwbGFjZWhvbGRlciwgdmVyaWZ5IGJlZm9yZSBhcHBseWluZylfJyA6ICcnfSDigJQgY29sb3IgdG9rZW5zLCB0eXBvZ3JhcGh5LCBzcGFjaW5nLCBtb3Rpb24sIHZvaWNlLmBcbiAgICAgICAgOiAobWFuaWZlc3QuZGVzaWduPy5wYXRoXG4gICAgICAgICAgPyBgLSAqKkRFU0lHTi5tZCAodmlzdWFsIGlkZW50aXR5KToqKiBcXGAke21hbmlmZXN0LmRlc2lnbi5wYXRofVxcYCDigJQgcmVhZCBvbiB0aGUgcmVjZWl2ZXIncyBmaWxlc3lzdGVtLmBcbiAgICAgICAgICA6ICctICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIG5vdCBjb25maWd1cmVkLicpLFxuICAgICAgJycsXG4gICAgICAnIyMgRmlsZXMnLFxuICAgICAgJycsXG4gICAgICBtYW5pZmVzdC5hZ2VudFByb3RvY29sID8gYC0gXFxgJHttYW5pZmVzdC5hZ2VudFByb3RvY29sLmFyY2hpdmVQYXRofVxcYCDigJQgdGhlIGFnZW50IHdvcmtpbmcgZG9jdHJpbmU6IHBoYXNlcywgcGVyc2lzdGVuY2UgbGF5b3V0LCB2ZXJpZmljYXRpb24gbG9vcCAoKiphZ2VudHMgc3RhcnQgaGVyZSoqKS5gIDogJycsXG4gICAgICAnLSBgcmVwYWlyLWluZGV4Lm1kYCDigJQgYWdlbnQtZnJpZW5kbHkgdHJpYWdlIHB1bmNoIGxpc3QgKG9uZSB0YXNrIHBlciBjb21tZW50KS4nLFxuICAgICAgYC0gXFxgJHtqc29ubE5hbWV9XFxgIOKAlCBKU09OTCBzdHJlYW0gKG9uZSBjYXB0dXJlIHBlciBsaW5lLCBsZWFkaW5nIG1hbmlmZXN0LCBzY2hlbWEgdjIpLmAsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMvKi5wbmdgIOKAlCBmdWxsLXJlc29sdXRpb24gUE5HcyBvZiBlYWNoIGNhcHR1cmVkIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UuJyxcbiAgICAgICctIGBzY3JlZW5zaG90cy5qc29uYCDigJQgdWlkLWtleWVkIGluZGV4OiBgYnlVaWRbdWlkXSDihpIgeyBlbGVtZW50PywgZ3JvdXA/LCBwYWdlPyB9YCwgYGJ5VXJsW3VybF0g4oaSIHsgcGFnZT8sIHVpZHNbXSB9YCwgcGx1cyBhIGZsYXQgYGZpbGVzW11gIGxpc3RpbmcuJyxcbiAgICAgICctIGBzY2hlbWEuanNvbmAg4oCUIEpTT04tU2NoZW1hIChkcmFmdCAyMDIwLTEyKSBkZXNjcmliaW5nIGV2ZXJ5IHJvdyB0eXBlLicsXG4gICAgICAnLSBgZHVja2RiLnNxbGAg4oCUIGNvcHktYW5kLXBhc3RlIHJlY2lwZXMgZm9yIHF1ZXJ5aW5nIHRoZSBKU09OTCB3aXRoIER1Y2tEQi4nLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gYC0gXFxgc2tpbGxzLWluZGV4Lmpzb25cXGAg4oCUIGxvY2F0b3IgaW5kZXggZm9yIHRoZSAke21hbmlmZXN0LmJ1bmRsZWRTa2lsbHMubGVuZ3RofSBidW5kbGVkIHNraWxsIGRvY3VtZW50cyAoaWQg4oaSIGFyY2hpdmUgcGF0aCDihpIgcHVycG9zZSDihpIgdXBzdHJlYW0gcHJvdmVuYW5jZSkuYCA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy0gYC5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlLyoubWRgICsgYHBlcmNlcHRpb24tZmlyc3QtZGVzaWduLyoqYCDigJQgdmVuZG9yZWQgZGVzaWduIHNraWxscywgZWFjaCB3aXRoIGl0cyB1cHN0cmVhbSBsaWNlbnNlOyByZWFkIHRoZW0gZnJvbSB0aGlzIGFyY2hpdmUsIG5vIGluc3RhbGxhdGlvbiBuZWVkZWQuJyA6ICcnLFxuICAgICAgbWFuaWZlc3QucGFnZXNIdG1sPy5sZW5ndGggPyBgLSBcXGBwYWdlcy8qLmh0bWxcXGAg4oCUIGZ1bGwgc2VyaWFsaXplZCBIVE1MIG9mICR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aH0gY2FwdHVyZWQgcGFnZSR7bWFuaWZlc3QucGFnZXNIdG1sLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSAob3B0LWluKS5gIDogJycsXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZSA/IGAtIFxcYERFU0lHTi5tZFxcYCDigJQgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICdwcm9qZWN0LWN1c3RvbWl6ZWQgZGVzaWduIHNvdXJjZS1vZi10cnV0aCAodHJ1c3QgYXMgY2Fub25pY2FsKS4nIDogbWFuaWZlc3QuZGVzaWduLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBERVNJR04ubWQgdGVtcGxhdGUgKHBsYWNlaG9sZGVyIOKAlCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKS4nIDogJyd9YCA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/IGAtIFxcYC5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZFxcYCDigJQgJHttYW5pZmVzdC5za2lsbC5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCB0cmlhZ2Ugc2tpbGwuJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJ1BpbmNoR3JhYlxcJ3MgYnVuZGxlZCBkZWZhdWx0IHRyaWFnZSBza2lsbCAodGVtcGxhdGUgY29udGVudCkuJyA6ICcnfWAgOiAnJyxcbiAgICAgICcnLFxuICAgICAgJyMjIEV4dHJhY3RpbmcnLFxuICAgICAgJycsXG4gICAgICAnUGljayB3aGljaGV2ZXIgdmFyaWFudCB5b3VyIG1hY2hpbmUgc3VwcG9ydHMg4oCUIG5vdCBldmVyeSBzeXN0ZW0gc2hpcHMgYHpzdGRgLicsXG4gICAgICAnJyxcbiAgICAgICdgYGBzaCcsXG4gICAgICAnIyAxLiBNb2Rlcm4gdGFyIHdpdGggYnVpbHQtaW4genN0ZCBzdXBwb3J0IChMaW51eCArIHJlY2VudCBtYWNPUyk6JyxcbiAgICAgIGB0YXIgLS16c3RkIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDIuIHRhciArIHN0YW5kYWxvbmUgenN0ZCBDTEk6JyxcbiAgICAgIGB6c3RkIC1kICR7bWFuaWZlc3QuZmlsZW5hbWV9IC1vICR7bWFuaWZlc3QuZmlsZW5hbWUucmVwbGFjZSgvXFwuenN0JC8sICcnKX1gLFxuICAgICAgYHRhciAteGYgJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICAnJyxcbiAgICAgICcjIDMuIFB1cmUtTm9kZSBmYWxsYmFjayAobm8genN0ZCBDTEkgLyBubyB0YXIpOicsXG4gICAgICBgbnB4IC15IEByb25vbW9uL3pzdGFuZGFyZCA8ICR7bWFuaWZlc3QuZmlsZW5hbWV9ID4gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgIyDigKYgdGhlbiB1c2UgYW55IHRhciByZWFkZXIgKGUuZy4gXFxgbnB4IHRhci1zdHJlYW1cXGApYCxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnRXhwZWN0ZWQgZmlsZSBsaXN0IGFmdGVyIGV4dHJhY3Rpb246JyxcbiAgICAgICcnLFxuICAgICAgJ2BgYCcsXG4gICAgICBgJHtqc29ubE5hbWV9ICAgICAgICAgICAgICAgICAgICAjIEpTT05MIHN0cmVhbSAodGhlIHNvdXJjZSBvZiB0cnV0aClgLFxuICAgICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA/ICdBR0VOVC1QUk9UT0NPTC5tZCAgICAgICAgICAgICAgICMgYWdlbnQgd29ya2luZyBkb2N0cmluZSAoc3RhcnQgaGVyZSknIDogJycsXG4gICAgICBgc2NyZWVuc2hvdHMvICAgICAgICAgICAgICAgICAgICAjIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UgUE5Hc2AsXG4gICAgICBgc2NyZWVuc2hvdHMuanNvbiAgICAgICAgICAgICAgICAjIHVpZC1rZXllZCBsb29rdXAgaW5kZXhgLFxuICAgICAgYGR1Y2tkYi5zcWwgICAgICAgICAgICAgICAgICAgICAgIyBjb3B5LXBhc3RlIFNRTCByZWNpcGVzYCxcbiAgICAgIGBzY2hlbWEuanNvbiAgICAgICAgICAgICAgICAgICAgICMgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlYCxcbiAgICAgIGBSRUFETUUubWQgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBmaWxlYCxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdza2lsbHMtaW5kZXguanNvbiAgICAgICAgICAgICAgICMgYnVuZGxlZC1za2lsbCBsb2NhdG9yIGluZGV4JyA6ICcnLFxuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscz8ubGVuZ3RoID8gJy5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvICAgICAgIyB2ZW5kb3JlZCByZWZlcmVuY2UgZ3VpZGVzIChBcGFjaGUtMi4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmJ1bmRsZWRTa2lsbHM/Lmxlbmd0aCA/ICdwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8gICAgICAgICMgdmVuZG9yZWQgUEZEIGZyYW1ld29yayAoQ0MgQlktU0EgNC4wKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LnBhZ2VzSHRtbD8ubGVuZ3RoID8gJ3BhZ2VzLyAgICAgICAgICAgICAgICAgICAgICAgICAgIyBmdWxsIHBhZ2UgSFRNTCAob3B0LWluKScgOiAnJyxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gJ0RFU0lHTi5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB2aXN1YWwgaWRlbnRpdHkgc291cmNlLW9mLXRydXRoJyA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQgICMgdHJpYWdlIGluc3RydWN0aW9ucycgOiAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgUXVpY2sgRHVja0RCJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNxbCcsXG4gICAgICBgQ1JFQVRFIFRBQkxFIGNhcHR1cmVzIEFTIFNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oJyR7anNvbmxOYW1lfScsIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLCBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCk7YCxcbiAgICAgIFwiU0VMRUNUIG4sIHNlbGVjdG9yLCB0YWcsIHJvbGUsIGhpbnRzIEZST00gY2FwdHVyZXMgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgTElNSVQgMjA7XCIsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFNjaGVtYScsXG4gICAgICAnJyxcbiAgICAgICdTZWxlY3RvciBsaW5lcyBoYXZlIGB0eXBlOiBcInNlbGVjdG9yXCJgLCBgdjogMmAsIGEgc3RhYmxlIGB1aWRgLCB0b3AtbGV2ZWwgaWRlbnRpZmljYXRpb24gZmllbGRzLCBhbmQgYW4gYF9hdWRpdGAgbmFtZXNwYWNlIG5lc3RpbmcgZGV0ZWN0aW9uIG1ldGFkYXRhIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBGZWVkYmFjayBsaW5lcyBsaW5rIGJhY2sgdmlhIGBwYXJlbnRVaWRgIGFuZCBjYXJyeSB0aGVpciBvd24gYHVpZGAuIEdyb3VwIGhlYWRzIGNhcnJ5IGBncm91cE1lbWJlclVpZHM6IFt1aWTigKZdYDsgZWFjaCBncm91cCBtZW1iZXIgaXMgYSB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkLiBCdW5kbGVkIGBzY2hlbWEuanNvbmAgaXMgdGhlIGNhbm9uaWNhbCBtYWNoaW5lLXJlYWRhYmxlIGZvcm0uJyxcbiAgICAgICcnLFxuICAgIF07XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuICAvLyBzY3JlZW5zaG90cy5qc29uIOKAlCBwcm9wZXIga2V5ZWQgaW5kZXggaW5zdGVhZCBvZiB0aGUgb2xkIFRTVi4gVGhyZWVcbiAgLy8gc2hhcGVzIGZvciB0aHJlZSBsb29rdXAgcGF0dGVybnM6XG4gIC8vICAg4oCiIGJ5VWlkOiAgdWlkIOKGkiB7IG4sIHNlbGVjdG9yLCB1cmwsIGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/LCBtZW1iZXJzPyB9XG4gIC8vICAgICAgICAgICAgICBcImdpdmUgbWUgZXZlcnkgc2hvdCBmb3IgdGhpcyBlbnRyeVwiXG4gIC8vICAg4oCiIGJ5VXJsOiAgdXJsIOKGkiB7IHBhZ2U/LCB1aWRzW10gfVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0IHBhZ2Ugc2hvdCBjb3ZlcnMgdGhpcyBVUkw/IHdoaWNoIGNhcHR1cmVzIGxhbmRlZCBoZXJlP1wiXG4gIC8vICAg4oCiIGZpbGVzOiAgZmxhdCBsaXN0IG9mIGV2ZXJ5IFBORyBwYXRoIGluIHRoZSBhcmNoaXZlXG4gIC8vICAgICAgICAgICAgICBcIndoYXQncyBpbiBzY3JlZW5zaG90cy8gP1wiXG4gIC8vIFRoZSBgaW5BcmNoaXZlYCBmbGFnIG9uIGVhY2ggZmlsZSBtaXJyb3JzIHRoZSB0YXIgYnVuZGxlIG1lbWJlcnNoaXBcbiAgLy8gc28gYSBjb25zdW1lciBkb3duc3RyZWFtIG9mIHRoZSAudGFyLnpzdCBleHRyYWN0aW9uIGNhbiB0ZWxsIHdoaWNoXG4gIC8vIHBhdGhzIHBvaW50IElOU0lERSB0aGUgYXJjaGl2ZSAocmVsYXRpdmUpIHZzIGF0IG9uLWRpc2sgc2libGluZ3MuXG4gIGNvbnN0IGJ1aWxkU2NyZWVuc2hvdHNJbmRleCA9IChidW5kbGVkOiBTZXQ8c3RyaW5nPiwgbm93SXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5vd0lzbyA/PyBleHBvcnROb3dJc28oKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIC8vIEZ1bGwtcGFnZSBIVE1MIGVudHJpZXMgKG9wdC1pbiBpbmNsdWRlUGFnZUhUTUwgcHJlZikuIENvbGxlY3RlZCBMQVpJTFlcbiAgLy8gYXQgZXhwb3J0IHRpbWUgZnJvbSB3aGljaGV2ZXIgbGl2ZSB0YWJzIHN0aWxsIHNob3cgYSBjYXB0dXJlZCBVUkwg4oCUXG4gIC8vIG5ldmVyIHBlcnNpc3RlZCB0byBjaHJvbWUuc3RvcmFnZSwgc28gYmlnIGRvY3VtZW50cyBjYW4ndCBldmljdFxuICAvLyBmdWxsLXJlcyBzY3JlZW5zaG90cyBmcm9tIHRoZSBxdW90YS4gVVJMcyB3aXRoIG5vIGxpdmUgdGFiIGFyZSByZWNvcmRlZFxuICAvLyBhcyBpbmZvLWxldmVsIGRpYWdub3N0aWNzIGluc3RlYWQgb2YgZmFpbGluZyB0aGUgZXhwb3J0LlxuICBjb25zdCBwYWdlSHRtbFNsdWcgPSAodXJsOiBzdHJpbmcsIHRha2VuOiBTZXQ8c3RyaW5nPik6IHN0cmluZyA9PiB7XG4gICAgbGV0IHNsdWcgPSAncGFnZSc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgICBzbHVnID0gYCR7dS5ob3N0fSR7dS5wYXRobmFtZX1gLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL1teXFx3Li1dKy9nLCAnXycpLnNsaWNlKDAsIDgwKSB8fCB1Lmhvc3Q7XG4gICAgfSBjYXRjaCB7IC8qIGtlZXAgZmFsbGJhY2sgKi8gfVxuICAgIGxldCB1bmlxdWUgPSBzbHVnO1xuICAgIGZvciAobGV0IGkgPSAyOyB0YWtlbi5oYXModW5pcXVlKTsgaSsrKSB1bmlxdWUgPSBgJHtzbHVnfX4ke2l9YDtcbiAgICB0YWtlbi5hZGQodW5pcXVlKTtcbiAgICByZXR1cm4gdW5pcXVlO1xuICB9O1xuICBjb25zdCBjb2xsZWN0UGFnZUh0bWxFbnRyaWVzID0gYXN5bmMgKCk6IFByb21pc2U8e2VudHJpZXM6IFRhckVudHJ5W107IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT47IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW119PiA9PiB7XG4gICAgY29uc3QgZW50cmllczogVGFyRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IHBhZ2VzTWV0YTogQXJyYXk8e3VybDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nOyBieXRlczogbnVtYmVyfT4gPSBbXTtcbiAgICBjb25zdCBkaWFnbm9zdGljczogRXhwb3J0RGlhZ25vc3RpY1tdID0gW107XG4gICAgaWYgKCFwcmVmcy5pbmNsdWRlUGFnZUhUTUwgfHwgIWluRXh0ZW5zaW9uKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHVybHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51cmwpIHVybHMuYWRkKG0uZW50cnkudXJsKTtcbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnICYmIG0udXJsKSB1cmxzLmFkZChtLnVybCk7XG4gICAgfVxuICAgIGlmICghdXJscy5zaXplKSByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICAgIGxldCB0YWJzOiBjaHJvbWUudGFicy5UYWJbXSA9IFtdO1xuICAgIHRyeSB7IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggdG8gZGlhZ25vc3RpY3MgKi8gfVxuICAgIGNvbnN0IHRha2VuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCB1cmwgb2YgWy4uLnVybHNdLnNvcnQoKSkge1xuICAgICAgY29uc3QgdGFiID0gdGFicy5maW5kKCh0KSA9PiB0LnVybCA9PT0gdXJsKSA/PyB0YWJzLmZpbmQoKHQpID0+ICh0LnVybCA/PyAnJykuc3BsaXQoJyMnKVswXSA9PT0gdXJsLnNwbGl0KCcjJylbMF0pO1xuICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0YWI/LmlkICE9IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgcGcoe2tpbmQ6ICdwYWdlLWh0bWwnfSkpIGFzIHtvaz86IGJvb2xlYW47IGh0bWw/OiBzdHJpbmd9IHwgdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuaHRtbCkgaHRtbCA9IHJlcGx5Lmh0bWw7XG4gICAgICAgIH0gY2F0Y2ggeyAvKiB0YWIgaGFzIG5vIGxpdmUgY29udGVudCBzY3JpcHQgKi8gfVxuICAgICAgfVxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe3NldmVyaXR5OiAnaW5mbycsIGNvZGU6ICdQQUdFX0hUTUxfVU5BVkFJTEFCTEUnLCBkZXRhaWw6IHVybH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFyY2hpdmVQYXRoID0gYHBhZ2VzLyR7cGFnZUh0bWxTbHVnKHVybCwgdGFrZW4pfS5odG1sYDtcbiAgICAgIGVudHJpZXMucHVzaCh7bmFtZTogYXJjaGl2ZVBhdGgsIGRhdGE6IGh0bWx9KTtcbiAgICAgIHBhZ2VzTWV0YS5wdXNoKHt1cmwsIGFyY2hpdmVQYXRoLCBieXRlczogbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGh0bWwpLmxlbmd0aH0pO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3N9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIC8vIE9uZSBjbG9jayArIG9uZSBjb250ZW50IGhhc2ggcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGFuZCB0aGVcbiAgICAvLyBmaWxlbmFtZSBzdGVtIGRlcml2ZSBmcm9tIHRoZXNlIHNvIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudFxuICAgIC8vIHByb2R1Y2VzIHRoZSBzYW1lIGZpbGVuYW1lIChvdmVyd3JpdHRlbiwgbm90IGR1cGxpY2F0ZWQpIGFuZCDigJQgd2l0aFxuICAgIC8vIGEgZnJvemVuIGNsb2NrIOKAlCBieXRlLWlkZW50aWNhbCBhcmNoaXZlcy5cbiAgICBjb25zdCBleHBvcnRlZEF0SXNvID0gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3QgbXRpbWVTZWMgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoZXhwb3J0ZWRBdElzbykgLyAxMDAwKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goc2hvdEVudHJpZXMubWFwKChlKSA9PiBlLm5hbWUpKTtcbiAgICBjb25zdCBidW5kbGVJZCA9IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KTtcbiAgICBjb25zdCBhcmNoaXZlTmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ3Rhci56c3QnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0T3B0cyA9IHtub3dJc286IGV4cG9ydGVkQXRJc28sIGJ1bmRsZUlkfTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0JywgbWFuaWZlc3RPcHRzKTtcblxuICAgIC8vIOKUgOKUgCBGYXN0IHBhdGg6IGFzc2VtYmxlICsgY29weSB0aGUgU2VuZC10by1BZ2VudCBwcm9tcHQgTk9XLCBiZWZvcmUgdGhlXG4gICAgLy8gaGVhdnkgd29yayAoZmV0Y2hpbmcgfjEyMCBza2lsbCBmaWxlcywgYnVpbGRpbmcgKyB6c3RkLXdyYXBwaW5nIHRoZSB0YXIsXG4gICAgLy8gcG9sbGluZyB0aGUgZG93bmxvYWQgdG8gY29tcGxldGlvbikuIFRoZSBjbGlwYm9hcmQgd3JpdGUgbXVzdCBsYW5kIHdoaWxlXG4gICAgLy8gdGhlIGNsaWNrJ3MgZm9jdXMgaXMgZnJlc2gg4oCUIENocm9tZSdzIGRvd25sb2FkIFVJIHN0ZWFscyBmb2N1cyBhbmQgbWFrZXNcbiAgICAvLyBuYXZpZ2F0b3IuY2xpcGJvYXJkIGZhaWwgc2lsZW50bHkuIFRoZSBidW5kbGUgdHJlZSdzIGVudHJ5IG5hbWVzIGFyZVxuICAgIC8vIERFVEVSTUlOSVNUSUMsIHNvIHdlIHByZWRpY3QgdGhlbSBmcm9tIHN0YXRpYyBkYXRhIChubyBmZXRjaCkgaW5zdGVhZCBvZlxuICAgIC8vIHdhaXRpbmcgb24gdGhlIGFzc2VtYmxlZCBhcmNoaXZlLlxuICAgIGNvbnN0IHtlbnRyaWVzOiBwYWdlSHRtbEVudHJpZXMsIHBhZ2VzTWV0YSwgZGlhZ25vc3RpY3M6IHBhZ2VIdG1sRGlhZ25vc3RpY3N9ID0gYXdhaXQgY29sbGVjdFBhZ2VIdG1sRW50cmllcygpO1xuICAgIGNvbnN0IGVudHJ5TmFtZXMgPSBbXG4gICAgICAnUkVBRE1FLm1kJywgJ3JlcGFpci1pbmRleC5tZCcsIGpzb25sTmFtZSwgJ3NjcmVlbnNob3RzLmpzb24nLCAnZHVja2RiLnNxbCcsICdzY2hlbWEuanNvbicsICdBR0VOVC1QUk9UT0NPTC5tZCcsXG4gICAgICAuLi5zaG90RW50cmllcy5tYXAoKGUpID0+IGUubmFtZSksXG4gICAgICAnREVTSUdOLm1kJywgJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCcsXG4gICAgICAuLi4ocHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQgPyBCVU5ETEVEX1NLSUxMX0ZJTEVTLm1hcCgoZikgPT4gZi5hcmNoaXZlKSA6IFtdKSxcbiAgICAgIC4uLnBhZ2VIdG1sRW50cmllcy5tYXAoKGUpID0+IGUubmFtZSksXG4gICAgXS5zb3J0KCk7XG4gICAgY29uc3QgYWdlbnRQcm9tcHRPcHRzID0ge1xuICAgICAgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIGJ1bmRsZUlkLFxuICAgICAgLy8gUHJlZGljdGVkIERvd25sb2Fkcy1yZWxhdGl2ZSBwYXRoICh0aGUgYm9vdHN0cmFwIGV4cGFuZHMgdGhlIH4pOyB0aGVcbiAgICAgIC8vIHJlYWwgYWJzb2x1dGUgcGF0aCBpcyByZS1jb3BpZWQgYWZ0ZXIgdGhlIHNhdmUgcmVzb2x2ZXMuXG4gICAgICBhcmNoaXZlUGF0aDogYH4vRG93bmxvYWRzL3BpbmNoZ3JhYi8ke2FjdGl2ZVdzfS9leHBvcnRzLyR7YXJjaGl2ZU5hbWV9YCxcbiAgICAgIGV4cG9ydFRzOiBleHBvcnRlZEF0SXNvLFxuICAgICAganNvbmxOYW1lLFxuICAgICAgY291bnRzOiB7Y29tbWVudHM6IG1hbmlmZXN0LmNvdW50cy5mZWVkYmFjaywgc2VsZWN0b3JzOiBtYW5pZmVzdC5jb3VudHMuc2VsZWN0b3JzLCBwYWdlczogbWFuaWZlc3QuY291bnRzLnBhZ2VzLCBzY3JlZW5zaG90czogc2hvdEVudHJpZXMubGVuZ3RofSxcbiAgICAgIGVudHJ5TmFtZXMsXG4gICAgICBkZXNpZ25Jc1RlbXBsYXRlOiBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSxcbiAgICB9O1xuICAgIGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQgPSBidWlsZEFnZW50UHJvbXB0SnNvbmwoYWdlbnRQcm9tcHRPcHRzKTtcbiAgICBjb25zdCBlYXJseUNvcGllZCA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICBpZiAoZWFybHlDb3BpZWQpIHNob3dDb3BpZWQoJ1Byb21wdCBjb3BpZWQnLCAnYXNzZW1ibGluZyB0aGUgYnVuZGxl4oCmJyk7XG5cbiAgICAvLyBOb3cgdGhlIGhlYXZ5IGFzc2VtYmx5IOKAlCB0aGUgY2xpcGJvYXJkIGFscmVhZHkgaG9sZHMgdGhlIHByb21wdC4gTG9hZFxuICAgIC8vIHRoZSB2ZW5kb3JlZCBza2lsbHMgKCsgcGFyc2UgdGhlIGluZGV4IGZvciB0aGUgbWFuaWZlc3QvUkVBRE1FKS5cbiAgICBjb25zdCBza2lsbEVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBsZXQgc2tpbGxzSW5kZXg6IFNraWxsc0luZGV4IHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKHByZWZzLmJ1bmRsZVNraWxscyAmJiBCVU5ETEVEX1NLSUxMU19QUkVTRU5UKSB7XG4gICAgICBjb25zdCBsb2FkZWQgPSBhd2FpdCBQcm9taXNlLmFsbChCVU5ETEVEX1NLSUxMX0ZJTEVTLm1hcChhc3luYyAoZikgPT4gKHtmLCBkYXRhOiBhd2FpdCBsb2FkQnVuZGxlZFNraWxsRmlsZShmLmV4dCl9KSkpO1xuICAgICAgbGV0IHNraXBwZWQgPSAwO1xuICAgICAgZm9yIChjb25zdCB7ZiwgZGF0YX0gb2YgbG9hZGVkKSB7XG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHsgc2tpcHBlZCsrOyBjb250aW51ZTsgfVxuICAgICAgICBza2lsbEVudHJpZXMucHVzaCh7bmFtZTogZi5hcmNoaXZlLCBkYXRhfSk7XG4gICAgICAgIGlmIChmLmFyY2hpdmUgPT09ICdza2lsbHMtaW5kZXguanNvbicpIHtcbiAgICAgICAgICB0cnkgeyBza2lsbHNJbmRleCA9IEpTT04ucGFyc2UoZGF0YSkgYXMgU2tpbGxzSW5kZXg7IH0gY2F0Y2ggeyAvKiB1bnJlYWRhYmxlIGluZGV4IOKAlCB0YWJsZSBkZWdyYWRlcyAqLyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChza2lwcGVkKSBjb25zb2xlLndhcm4oTE9HLCBgYnVuZGxlZCBza2lsbHM6ICR7c2tpcHBlZH0vJHtsb2FkZWQubGVuZ3RofSBmaWxlcyBtaXNzaW5nIGZyb20gdGhpcyBidWlsZCDigJQgZXhwb3J0IGNvbnRpbnVlcyB3aXRob3V0IHRoZW1gKTtcbiAgICB9XG4gICAgbWFuaWZlc3QuYWdlbnRQcm90b2NvbCA9IHthcmNoaXZlUGF0aDogJ0FHRU5ULVBST1RPQ09MLm1kJ307XG4gICAgaWYgKHNraWxsc0luZGV4Py5za2lsbHM/Lmxlbmd0aCkge1xuICAgICAgbWFuaWZlc3QuYnVuZGxlZFNraWxscyA9IHNraWxsc0luZGV4LnNraWxscy5tYXAoKHMpID0+ICh7XG4gICAgICAgIGlkOiBzLmlkLFxuICAgICAgICBraW5kOiBzLmlkLnN0YXJ0c1dpdGgoJ2ltcGVjY2FibGUvJykgPyAncmVmZXJlbmNlJyBhcyBjb25zdCA6ICdza2lsbCcgYXMgY29uc3QsXG4gICAgICAgIGFyY2hpdmVQYXRoOiBzLnBhdGgsXG4gICAgICAgIC4uLihzLmludm9rZSA/IHtpbnZvY2F0aW9uOiBzLmludm9rZX0gOiB7fSksXG4gICAgICB9KSk7XG4gICAgfVxuICAgIGlmIChwYWdlc01ldGEubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5wYWdlc0h0bWwgPSBwYWdlc01ldGE7XG4gICAgICBtYW5pZmVzdC5jb3VudHMucGFnZXNIdG1sID0gcGFnZXNNZXRhLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKHBhZ2VIdG1sRGlhZ25vc3RpY3MubGVuZ3RoKSB7XG4gICAgICBtYW5pZmVzdC5leHBvcnREaWFnbm9zdGljcyA9IFsuLi4obWFuaWZlc3QuZXhwb3J0RGlhZ25vc3RpY3MgPz8gW10pLCAuLi5wYWdlSHRtbERpYWdub3N0aWNzXTtcbiAgICB9XG4gICAgLy8gVGhlIEpTT05MIGluc2lkZSB0aGUgYXJjaGl2ZSBtdXN0IGRlY2xhcmUgaXRzZWxmIGFzIHBhcnQgb2YgYVxuICAgIC8vIHRhci56c3QgYnVuZGxlIHNvIGl0cyBtYW5pZmVzdCdzIGBkZXNpZ24uaW5saW5lYCAvIGBza2lsbC5pbmxpbmVgXG4gICAgLy8gZmxhZ3MgbWF0Y2ggd2hhdCdzIGFjdHVhbGx5IHByZXNlbnQgaW4gdGhlIHN1cnJvdW5kaW5nIHRhci5cbiAgICBjb25zdCBqc29ubFRleHQgPSBidWlsZEpzb25sKGpzb25sTmFtZSwgJ3Rhci56c3QnLCBtYW5pZmVzdE9wdHMpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICBjb25zdCByZWFkbWUgPSBidWlsZFJlYWRtZShtYW5pZmVzdCwganNvbmxOYW1lLCBzaG90RW50cmllcy5sZW5ndGgpO1xuICAgIGNvbnN0IHNob3RzSnNvbiA9IGJ1aWxkU2NyZWVuc2hvdHNJbmRleChidW5kbGVkLCBleHBvcnRlZEF0SXNvKTtcblxuICAgIC8vIE1hcmtkb3duIGV4cG9ydCB3YXMgZHJvcHBlZDogaXQgY2FycmllZCBubyBkYXRhIHRoZSBKU09OTCBkaWRuJ3RcbiAgICAvLyBhbHJlYWR5IGhhdmUgKHRoZSBodW1hbi1yZWFkYWJsZSBzdXJmYWNlIHdhcyBqdXN0IGEgY3VyYXRlZCBzdWJzZXRcbiAgICAvLyBvZiB0aGUgc2FtZSBmaWVsZHMpLCBhbmQgdGhlIGRpdmVyZ2VuY2Ug4oCUIG1kIHNpbGVudGx5IGRyb3BwZWRcbiAgICAvLyBncm91cCBjaGlsZHJlbiArIHRoZSBlbnRpcmUgYF9hdWRpdGAgbmFtZXNwYWNlIOKAlCByaXNrZWRcbiAgICAvLyBtaXNsZWFkaW5nIGFueSBodW1hbiBza2ltLiBSRUFETUUubWQgaW5zaWRlIHRoZSBhcmNoaXZlIGlzIHRoZVxuICAgIC8vIGh1bWFuIGVudHJ5IHBvaW50IG5vdy5cbiAgICAvLyBCdWcgIzc6IGdlbmVyYXRlIHJlcGFpci1pbmRleC5tZCBhcyB0aGUgYWdlbnQncyBmaXJzdC1yZWFkIGVudHJ5XG4gICAgLy8gcG9pbnQuIEJ1ZyAjNDAgZmlyc3QtcmVhZCBvcmRlcjogUkVBRE1FIHBvaW50cyB0aGUgcmVjZWl2ZXIgYXRcbiAgICAvLyByZXBhaXItaW5kZXgubWQgYmVmb3JlIFNLSUxMLm1kIC8gREVTSUdOLm1kLlxuICAgIGNvbnN0IHJlcGFpckluZGV4ID0gYnVpbGRSZXBhaXJJbmRleChtYW5pZmVzdCwganNvbmxOYW1lKTtcbiAgICBjb25zdCB0YXJFbnRyaWVzOiBUYXJFbnRyeVtdID0gW1xuICAgICAge25hbWU6ICdSRUFETUUubWQnLCBkYXRhOiByZWFkbWV9LFxuICAgICAge25hbWU6ICdyZXBhaXItaW5kZXgubWQnLCBkYXRhOiByZXBhaXJJbmRleH0sXG4gICAgICB7bmFtZToganNvbmxOYW1lLCBkYXRhOiBqc29ubFRleHR9LFxuICAgICAge25hbWU6ICdzY3JlZW5zaG90cy5qc29uJywgZGF0YTogc2hvdHNKc29ufSxcbiAgICAgIHtuYW1lOiAnZHVja2RiLnNxbCcsIGRhdGE6IHNxbH0sXG4gICAgICAvLyBCdWcgIzI4OiBtYWNoaW5lLXJlYWRhYmxlIEpTT04tU2NoZW1hIGZvciBldmVyeSByb3cgdHlwZS5cbiAgICAgIHtuYW1lOiAnc2NoZW1hLmpzb24nLCBkYXRhOiBidWlsZFNjaGVtYUpzb24oKX0sXG4gICAgICAuLi5zaG90RW50cmllcyxcbiAgICBdO1xuICAgIC8vIERFU0lHTi5tZCDigJQgZWl0aGVyIHRoZSB1c2VyJ3MgY3VzdG9taXplZCBjb250ZW50IG9yIHRoZSBidW5kbGVkXG4gICAgLy8gdGVtcGxhdGUgLyBsb2NhbCBvdmVycmlkZS4gUmVzb2x2ZWQgdGhyb3VnaCB0aGUgc2FtZSBsb2FkZXIgdGhlXG4gICAgLy8gc2V0dGluZ3MgbW9kYWwgdXNlcyBzbyBjaHJvbWUuc3RvcmFnZSBzdGF5cyBzbWFsbCAoZW1wdHkgcHJlZnNcbiAgICAvLyDihpIgZmFsbGJhY2sgdG8gZXh0ZW5zaW9uL3RlbXBsYXRlcy8qLm1kIHZpYSBmZXRjaCkuXG4gICAgY29uc3QgZGVzaWduQ29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgaWYgKGRlc2lnbkNvbnRlbnQudHJpbSgpKSB7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICdERVNJR04ubWQnLCBkYXRhOiBkZXNpZ25Db250ZW50fSk7XG4gICAgfVxuICAgIC8vIFBpbmNoR3JhYiBVSSBza2lsbCDigJQgc2FtZSBzdG9yeS4gTGl2ZXMgYXQgdGhlIGNhbm9uaWNhbCByZWNlaXZlclxuICAgIC8vIHBhdGggaW5zaWRlIHRoZSBhcmNoaXZlIHNvIHRoZSByZWNlaXZlcidzIGAuYWdlbnRzL2AgdHJlZSBjYW4gYmVcbiAgICAvLyBwb3B1bGF0ZWQgYnkgYSBzaW1wbGUgYHRhciAteGAgZnJvbSB0aGUgYXJjaGl2ZSByb290LlxuICAgIC8vXG4gICAgLy8gRnJvbnRtYXR0ZXIgcmVuYW1lOiBhIHVzZXIncyBzb3VyY2UgU0tJTEwubWQgbWF5IHVzZSBgbmFtZTogdWlgXG4gICAgLy8gKGJlY2F1c2UgdGhhdCdzIGhvdyBpdCdzIGNhdGFsb2d1ZWQgaW4gdGhlaXIgZ2xvYmFsIGAuYWdlbnRzL2BcbiAgICAvLyBza2lsbHMgdHJlZSkuIEluc2lkZSBhIFBpbmNoR3JhYiBhcmNoaXZlIHRoZSBza2lsbCBpcyAqdGhlKlxuICAgIC8vIFBpbmNoR3JhYiBza2lsbCwgc28gd2UgcmVicmFuZCB0aGUgZnJvbnRtYXR0ZXIgYG5hbWU6YCBmaWVsZCBvblxuICAgIC8vIHRoZSB3YXkgaW50byB0aGUgdGFyIHdpdGhvdXQgdG91Y2hpbmcgdGhlIGJvZHkuIE9ubHkgdGhlIEZJUlNUXG4gICAgLy8gYG5hbWU6YCBsaW5lIGluc2lkZSB0aGUgbGVhZGluZyBgLS0tYCBibG9jayBpcyByZXdyaXR0ZW4uXG4gICAgY29uc3Qgc2tpbGxDb250ZW50ID0gYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGlmIChza2lsbENvbnRlbnQudHJpbSgpKSB7XG4gICAgICBjb25zdCByZWJyYW5kZWQgPSByZWJyYW5kU2tpbGxOYW1lKHNraWxsQ29udGVudCwgJ1BpbmNoR3JhYicpO1xuICAgICAgdGFyRW50cmllcy5wdXNoKHtuYW1lOiAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJywgZGF0YTogcmVicmFuZGVkfSk7XG4gICAgfVxuICAgIC8vIFZlbmRvcmVkIHNraWxscyArIG9wdC1pbiBwYWdlIEhUTUwgKGxvYWRlZCBhYm92ZSwgYmVmb3JlIHRoZSBkb2NzKS5cbiAgICB0YXJFbnRyaWVzLnB1c2goLi4uc2tpbGxFbnRyaWVzLCAuLi5wYWdlSHRtbEVudHJpZXMpO1xuICAgIC8vIEFHRU5ULVBST1RPQ09MLm1kIOKAlCB0aGUgZnVsbCBTZW5kLXRvLUFnZW50IGRvY3RyaW5lLiBVc2VzIHRoZSBTQU1FXG4gICAgLy8gYWdlbnRQcm9tcHRPcHRzIChwcmVkaWN0ZWQgZW50cnkgbmFtZXMpIGFzIHRoZSBjbGlwYm9hcmQgcGF5bG9hZCwgc29cbiAgICAvLyB0aGUgaW4tYnVuZGxlIGRvY3RyaW5lIGFuZCB0aGUgY29waWVkIHByb21wdCBhZ3JlZSBleGFjdGx5LlxuICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0FHRU5ULVBST1RPQ09MLm1kJywgZGF0YTogYnVpbGRBZ2VudFByb3RvY29sTWQoey4uLmFnZW50UHJvbXB0T3B0cywgc2tpbGxzSW5kZXh9KX0pO1xuICAgIC8vIFJlYnVpbGQgdGhlIG1hbmlmZXN0IGxpbmUgaW4gdGhlIEpTT05MIHdpdGggYXJjaGl2ZUludGVncml0eVxuICAgIC8vIChmaWxlIGxpc3QgKyBzaXplcykuIEhhcyB0byBoYXBwZW4gQUZURVIgYWxsIHRhckVudHJpZXMgYXJlXG4gICAgLy8gYXNzZW1ibGVkIGJ1dCBCRUZPUkUgd2UgdGFyIHRoZW0sIHNvIHdlIGtub3cgd2hhdCdzIGluIHRoZVxuICAgIC8vIGJ1bmRsZS4gVGhlbiB3ZSByZXBsYWNlIHRoZSBKU09OTCdzIG1hbmlmZXN0IHdpdGggdGhlIGF1Z21lbnRlZFxuICAgIC8vIHZlcnNpb24uXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGludGVncml0eToge2ZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9Pn0gPSB7ZmlsZXM6IFtdfTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiB0YXJFbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShlLmRhdGEpIDogKGUuZGF0YSBhcyBVaW50OEFycmF5KTtcbiAgICAgICAgaW50ZWdyaXR5LmZpbGVzLnB1c2goe3BhdGg6IGUubmFtZSwgc2l6ZTogZGF0YS5sZW5ndGh9KTtcbiAgICAgIH1cbiAgICAgIC8vIFJlLWVtaXQgdGhlIEpTT05MIHdpdGggdGhlIGF1Z21lbnRlZCBtYW5pZmVzdC4gQ2hlYXBlciB0byBkb1xuICAgICAgLy8gdGhpcyByZS1yZW5kZXIgdGhhbiB0byBtYWludGFpbiBtdXRhYmxlIHN0YXRlIHRocm91Z2ggdGhlIHNsaW1cbiAgICAgIC8vIGVtaXQuIFdlIHN3YXAgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBpbi1wbGFjZS5cbiAgICAgIGNvbnN0IGF1Z21lbnRlZE1hbmlmZXN0ID0gey4uLm1hbmlmZXN0LCBhcmNoaXZlSW50ZWdyaXR5OiBpbnRlZ3JpdHl9O1xuICAgICAgY29uc3QgbGluZXMgPSBqc29ubFRleHQuc3BsaXQoJ1xcbicpO1xuICAgICAgbGluZXNbMF0gPSBKU09OLnN0cmluZ2lmeShhdWdtZW50ZWRNYW5pZmVzdCk7XG4gICAgICBjb25zdCBuZXdKc29ubCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgY29uc3QgaWR4ID0gdGFyRW50cmllcy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0ganNvbmxOYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkgdGFyRW50cmllc1tpZHhdID0ge25hbWU6IGpzb25sTmFtZSwgZGF0YTogbmV3SnNvbmx9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ2FyY2hpdmVJbnRlZ3JpdHkgY29tcHV0YXRpb24gZmFpbGVkJywgZXJyKTtcbiAgICB9XG5cbiAgICAvLyBTdGFtcCBldmVyeSBlbnRyeSB3aXRoIHRoZSBleHBvcnQgY2xvY2sgc28gYXJjaGl2ZSBieXRlcyBhcmUgYSBwdXJlXG4gICAgLy8gZnVuY3Rpb24gb2YgY29udGVudCArIGNsb2NrIChidWlsZFRhciB3b3VsZCBvdGhlcndpc2Ugc2FtcGxlIG5vdygpKS5cbiAgICAvLyBUaGUgU2VuZC10by1BZ2VudCBwcm9tcHQgd2FzIGFscmVhZHkgY29waWVkIGF0IHRoZSB0b3Agb2YgdGhpc1xuICAgIC8vIGZ1bmN0aW9uIChmYXN0IHBhdGgpOyBvbmx5IHRoZSBhcmNoaXZlIGJ5dGVzIHJlbWFpbiB0byBiZSBzYXZlZC5cbiAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykgZS5tdGltZSA/Pz0gbXRpbWVTZWM7XG4gICAgY29uc3QgdGFyQnl0ZXMgPSBidWlsZFRhcih0YXJFbnRyaWVzKTtcbiAgICBjb25zdCBhcmNoaXZlQnl0ZXMgPSB3cmFwWnN0ZCh0YXJCeXRlcyk7XG5cbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSDihpInLCB7YXJjaGl2ZU5hbWUsIHRhckJ5dGVzOiB0YXJCeXRlcy5sZW5ndGgsIGFyY2hpdmVCeXRlczogYXJjaGl2ZUJ5dGVzLmxlbmd0aCwgc2NyZWVuc2hvdHM6IHNob3RFbnRyaWVzLmxlbmd0aH0pO1xuICAgICAgLy8gUGFzcyBhcyBhIHBsYWluIG51bWJlcltdIG92ZXIgc2VuZE1lc3NhZ2U7IHN0cnVjdHVyZWQtY2xvbmUgb2ZcbiAgICAgIC8vIFVpbnQ4QXJyYXkgdmlhIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGlzbid0IHJlbGlhYmxlIGFjcm9zc1xuICAgICAgLy8gQ2hyb21lIHZlcnNpb25zLlxuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtcbiAgICAgICAga2luZDogJ3NhdmUtYnl0ZXMnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZTogYXJjaGl2ZU5hbWUsXG4gICAgICAgIGJ5dGVzOiBBcnJheS5mcm9tKGFyY2hpdmVCeXRlcyksIG1pbWU6ICdhcHBsaWNhdGlvbi96c3RkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIC8vIFJlZnJlc2ggdGhlIGFscmVhZHktY29waWVkIHBheWxvYWQgd2l0aCB0aGUgUkVBTCBzYXZlZCBwYXRoLlxuICAgICAgICAvLyBCZXN0LWVmZm9ydDogZm9jdXMgbWF5IGJlIGdvbmUgYnkgbm93LCBhbmQgdGhlIGVhcmx5IGNvcHkgYWJvdmVcbiAgICAgICAgLy8gYWxyZWFkeSBob2xkcyBhIHZhbGlkIHBheWxvYWQgKHByZWRpY3RlZCB+L0Rvd25sb2FkcyBwYXRoKS5cbiAgICAgICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC5hZ2VudFByb21wdCA9IGJ1aWxkQWdlbnRQcm9tcHRKc29ubCh7Li4uYWdlbnRQcm9tcHRPcHRzLCBhcmNoaXZlUGF0aDogcGF0aFRvQ29weX0pO1xuICAgICAgICBjb25zdCBsYXRlQ29waWVkID0gYXdhaXQgY29weVRvQ2xpcGJvYXJkU2lsZW50KGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQpO1xuICAgICAgICBjb25zdCBwcm9tcHRDb3BpZWQgPSBsYXRlQ29waWVkIHx8IGVhcmx5Q29waWVkO1xuICAgICAgICBjb25zdCBsZWFmID0gcGF0aFRvQ29weS5yZXBsYWNlKC9bXFxcXC9dKyQvLCAnJykuc3BsaXQoL1tcXFxcL10vKS5wb3AoKSA/PyBwYXRoVG9Db3B5O1xuICAgICAgICBpZiAocHJvbXB0Q29waWVkKSBzaG93Q29waWVkKCdTZW50IHRvIGFnZW50JywgJ3Byb21wdCBjb3BpZWQg4oCUIHBhc3RlIGludG8geW91ciBjb2RpbmcgYWdlbnQnKTtcbiAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgIGBTZW50IHRvIGFnZW50IMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCR7cHJvbXB0Q29waWVkID8gJyDCtyBwcm9tcHQgY29waWVkJyA6ICcgwrcgY2xpcGJvYXJkIGJsb2NrZWQg4oCUIHVzZSBDbWQrSyDihpIgQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCd9JHtsYXN0RXhwb3J0LnRlbXBQYXRoID8gJyDCtyBQbGF5d3JpZ2h0IHRlbXAgaGlkZGVuJyA6ICcnfSDCtyAke2xlYWZ9YCxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQnO1xuICAgICAgY29uc29sZS5lcnJvcihMT0csICdvbkV4cG9ydEFyY2hpdmUgZmFpbGVkOicsIGVycik7XG4gICAgICBzZXRTdGF0dXMoYEFyY2hpdmUgZXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFRlc3QvZGV2IGZhbGxiYWNrOiBzeW50aGVzaXplIGEgZG93bmxvYWQgbGluay5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2FyY2hpdmVCeXRlcyBhcyB1bmtub3duIGFzIEJsb2JQYXJ0XSwge3R5cGU6ICdhcHBsaWNhdGlvbi96c3RkJ30pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBhcmNoaXZlTmFtZTsgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmFic1BhdGggPSBhcmNoaXZlTmFtZTtcbiAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9ICd0YXIuenN0JztcbiAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgIC8vIFRoZSBwcmVkaWN0ZWQtcGF0aCBwYXlsb2FkIHdhcyBhbHJlYWR5IGNvcGllZCBiZWZvcmUgdGhlIHNhdmUuXG4gICAgc2hvd0NvcGllZCgnU2VudCB0byBhZ2VudCcsICdwcm9tcHQgY29waWVkIOKAlCBwYXN0ZSBpbnRvIHlvdXIgY29kaW5nIGFnZW50Jyk7XG4gICAgc2V0U3RhdHVzKGBTZW50IHRvIGFnZW50IMK3ICR7c2hvdEVudHJpZXMubGVuZ3RofSBzY3JlZW5zaG90JHtzaG90RW50cmllcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gYnVuZGxlZCR7ZWFybHlDb3BpZWQgPyAnIMK3IHByb21wdCBjb3BpZWQnIDogJyd9YCk7XG4gIH07XG5cbiAgLy8gQmVzdC1lZmZvcnQgY2xpcGJvYXJkIHdyaXRlIOKAlCBuZXZlciB0aHJvd3M7IHJldHVybnMgd2hldGhlciB0aGVcbiAgLy8gd3JpdGUgc3VjY2VlZGVkIHNvIHRoZSBjYWxsZXIgY2FuIGFkanVzdCB0aGUgc3RhdHVzIG1lc3NhZ2UuXG4gIC8vIENsaXBib2FyZCB3cml0ZXMgY2FuIGZhaWwgd2hlbiB0aGUgcGFuZWwgZG9lc24ndCBoYXZlIGZvY3VzIG9yIGluXG4gIC8vIHNvbWUgdGVzdCBoYXJuZXNzZXMsIGFuZCB3ZSBkb24ndCB3YW50IHRoYXQgdG8gYmxvY2sgdGhlIGV4cG9ydC5cbiAgY29uc3QgY29weVRvQ2xpcGJvYXJkU2lsZW50ID0gYXN5bmMgKHRleHQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpOyByZXR1cm4gdHJ1ZTsgfVxuICAgIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEdWNrREIgc25pcHBldCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ2Fub25pY2FsIFNRTCByZWNpcGVzIGZvciBxdWVyeWluZyBhIEpTT05MIGV4cG9ydC4gQ29waWVzIHRvIGNsaXBib2FyZFxuICAvLyBhbmQgcHJpbnRzIGEgc3RhdHVzIG1lc3NhZ2Ug4oCUIHdlIGRvbid0IHJ1biBEdWNrREIgb3Vyc2VsdmVzLCB0aGUgdXNlclxuICAvLyBwaXBlcyB0aGUgc25pcHBldCBpbnRvIGBkdWNrZGJgIG9uIHRoZWlyIG1hY2hpbmUuIFRoZSByZWNpcGVzIHRhcmdldFxuICAvLyBxdWVzdGlvbnMgYSBVSS1lbmdpbmVlciBMTE0gd29ya2Zsb3cgdGVuZHMgdG8gYXNrOiBsaXN0IGNhcHR1cmVzIGJ5XG4gIC8vIGhvc3QsIGZpbmQgZHVwbGljYXRlIG91dGVySFRNTCwgZmluZCBjYXB0dXJlcyBtaXNzaW5nIGEgc2NyZWVuc2hvdCxcbiAgLy8gYW5kIHVuaXF1ZS10b2tlbiBmcmVxdWVuY3kgZm9yIGEgcXVpY2sgZGVzaWduLXRva2VucyBvdmVydmlldy5cbiAgY29uc3QgZHVja0RiU25pcHBldCA9IChqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiBgLS0gUGluY2hHcmFiIOKGkiBEdWNrREIgcmVjaXBlc1xuLS0gU2F2ZSB5b3VyIEpTT05MIGV4cG9ydCwgdGhlbiBpbiB5b3VyIHNoZWxsOlxuLS0gICBkdWNrZGIgPCB0aGlzX2ZpbGUuc3FsXG4tLSBPciBvcGVuIGEgZHVja2RiIHNoZWxsIGFuZCBwYXN0ZSB0aGVzZSBvbmUgYXQgYSB0aW1lLlxuXG4tLSAxKSBMb2FkIHRoZSBKU09OTCBpbnRvIGEgdGFibGUuXG4tLSAgICBzYW1wbGVfc2l6ZT0tMSBmb3JjZXMgYSBmdWxsLWZpbGUgc2NhbiBmb3Igc2NoZW1hIGluZmVyZW5jZS4gV2l0aG91dFxuLS0gICAgaXQsIER1Y2tEQiBvbmx5IHNuaWZmcyB0aGUgZmlyc3QgMjAgNDgwIHJvd3Mg4oCUIGFuZCBQaW5jaEdyYWIgZXhwb3J0c1xuLS0gICAgbWl4IHNlbGVjdG9yICsgZmVlZGJhY2sgcm93IHR5cGVzLCBzbyByYXJlIGZlZWRiYWNrLW9ubHkgZmllbGRzXG4tLSAgICAodGFncywgcGFyZW50VWlkKSBjYW4gYmUgZHJvcHBlZCBmcm9tIHRoZSBpbmZlcnJlZCBzY2hlbWEgaWYgdGhleVxuLS0gICAgZG9uJ3QgYXBwZWFyIGVhcmx5IGVub3VnaC4gVGhhdCBiaXRlcyByZWNpcGUgNiBiZWxvdy5cbkNSRUFURSBPUiBSRVBMQUNFIFRBQkxFIHBnIEFTXG5TRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKFxuICAnJHtqc29ubE5hbWV9JyxcbiAgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsXG4gIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwLFxuICBzYW1wbGVfc2l6ZT0tMVxuKTtcblxuLS0gMikgUXVpY2sgb3ZlcnZpZXc6IGhvdyBtYW55IGNhcHR1cmVzIHBlciBob3N0LlxuU0VMRUNUXG4gIHJlZ2V4cF9leHRyYWN0KHVybCwgJzovLyhbXi9dKyknLCAxKSBBUyBob3N0LFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InKSBBUyBjYXB0dXJlcyxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ2ZlZWRiYWNrJykgQVMgY29tbWVudHNcbkZST00gcGdcbkdST1VQIEJZIDFcbk9SREVSIEJZIGNhcHR1cmVzIERFU0M7XG5cbi0tIDMpIEZpbmQgZHVwbGljYXRlIG91dGVySFRNTCBhY3Jvc3MgY2FwdHVyZXMgKG9mdGVuIHNpZ25hbHMgYSByZXVzZWRcbi0tICAgIGNvbXBvbmVudCB0aGUgdXNlciBoYXMgY2xpY2tlZCBpbnRvIG11bHRpcGxlIHRpbWVzKS5cblNFTEVDVCBvdXRlckhUTUwsIENPVU5UKCopIEFTIGhpdHMsIGxpc3Qoc2VsZWN0b3IpIEFTIHNlbGVjdG9yc1xuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIG91dGVySFRNTCBJUyBOT1QgTlVMTFxuR1JPVVAgQlkgb3V0ZXJIVE1MXG5IQVZJTkcgaGl0cyA+IDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMjU7XG5cbi0tIDQpIENhcHR1cmVzIHN0aWxsIG1pc3NpbmcgYSBzY3JlZW5zaG90IHBhdGguXG5TRUxFQ1QgbiwgdXJsLCBzZWxlY3RvclxuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIHNjcmVlbnNob3QgSVMgTlVMTFxuT1JERVIgQlkgbjtcblxuLS0gNSkgUXVpY2sgZGVzaWduLXRva2VuIHN1cmZhY2U6IHJhbmsgY2xhc3NlcyB0aGF0IGFwcGVhciBpbiBtYW55IGNhcHR1cmVzLlxuLS0gICAgTk9URTogZmlsdGVyIGNsYXNzZXMgSVMgTk9UIE5VTEwgcmF0aGVyIHRoYW4gdXNpbmcgYSBjb2FsZXNjZS13aXRoLWVtcHR5XG4tLSAgICBmYWxsYmFjazsgRHVja0RCIGNhbm5vdCBpbmZlciBlbGVtZW50IHR5cGVzIGZvciBhbiBlbXB0eSBsaXN0IGxpdGVyYWwuXG5XSVRIIGV4cGFuZGVkIEFTIChcbiAgU0VMRUNUIHVubmVzdChjbGFzc2VzKSBBUyBjXG4gIEZST00gcGdcbiAgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIGNsYXNzZXMgSVMgTk9UIE5VTExcbilcblNFTEVDVCBjLCBDT1VOVCgqKSBBUyBoaXRzXG5GUk9NIGV4cGFuZGVkXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDMwO1xuXG4tLSA2KSBDb21tZW50cyBqb2luZWQgdG8gdGhlaXIgcGFyZW50IHNlbGVjdG9yIHZpYSBwYXJlbnRVaWQuIFRoZVxuLS0gICAgcy50eXBlIGZpbHRlciBwcmV2ZW50cyBhbiBhY2NpZGVudGFsIGZlZWRiYWNr4oaUZmVlZGJhY2sgam9pbiBpbiBjYXNlXG4tLSAgICB0d28gcm93cyBldmVyIHNoYXJlIGEgdWlkIGJ5IGNvaW5jaWRlbmNlLlxuU0VMRUNUIHMubiwgcy5zZWxlY3RvciwgZi50ZXh0LCBmLnRhZ3NcbkZST00gcGcgZlxuSk9JTiBwZyBzXG4gIE9OIHMudWlkID0gZi5wYXJlbnRVaWRcbiBBTkQgcy50eXBlID0gJ3NlbGVjdG9yJ1xuV0hFUkUgZi50eXBlID0gJ2ZlZWRiYWNrJ1xuT1JERVIgQlkgcy5uO1xuYDtcbiAgY29uc3Qgb25EdWNrRGJTbmlwcGV0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIFByZWZlciB0aGUgSlNPTkwgZmlsZW5hbWUgb2YgdGhlIG1vc3QgcmVjZW50IGV4cG9ydCBzbyB0aGUgdXNlciBjYW5cbiAgICAvLyBwYXN0ZSB0aGlzIGRpcmVjdGx5IHdpdGhvdXQgZWRpdGluZyB0aGUgcmVhZF9qc29uX2F1dG8gcGF0aC4gRmFsbFxuICAgIC8vIGJhY2sgdG8gYSBmcmVzaCBlcG9jaC1iYXNlZCBuYW1lIGlmIG5vdGhpbmcgaGFzIGJlZW4gZXhwb3J0ZWQgeWV0LlxuICAgIGNvbnN0IGxhc3QgPSBsYXN0RXhwb3J0LnJlbFBhdGg7XG4gICAgY29uc3QganNvbmxOYW1lID0gKGxhc3QgJiYgL1xcLmpzb25sJC8udGVzdChsYXN0KSlcbiAgICAgID8gbGFzdC5zcGxpdCgnLycpLnBvcCgpISAgLy8gc3RyaXAgd29ya3NwYWNlL2V4cG9ydHMvIHByZWZpeFxuICAgICAgOiBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3FsKTtcbiAgICAgIHNldFN0YXR1cyhgRHVja0RCIHJlY2lwZXMgY29waWVkIMK3IHBhc3RlIGludG8gXFxgZHVja2RiXFxgIHNoZWxsIMK3IHJlZmVyZW5jZXMgJHtqc29ubE5hbWV9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgRHVja0RCIFNRTCcsIGpzb25sTmFtZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCBmYWlsZWQg4oCUIG9wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCAnT3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnKTtcbiAgICB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTY2hlbWEgbWlncmF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDb252ZXJ0IGEgdjEtc2hhcGVkIEVudHJ5LW9yLWV4cG9ydC1saW5lIGludG8gb3VyIGludGVybmFsIEVudHJ5LiBJZGVtcG90ZW50LlxuICAvLyBTdXBwb3J0czpcbiAgLy8gICDigKIgZmxhdCB2MSBlbnRyeSAobm8gYF9hdWRpdGAsIG5vIGB2YCBmaWVsZClcbiAgLy8gICDigKIgdjIgZXhwb3J0IGVudHJ5IChoYXMgYF9hdWRpdGAsIGB2OiAyYCwgYHR5cGU6ICdzZWxlY3RvcidgKVxuICAvLyAgIOKAoiBtaXhlZCAoc29tZSBmaWVsZHMgbmVzdGVkLCBzb21lIGZsYXQg4oCUIGxhc3Qgd2lucyBmb3Igc2FmZXR5KVxuICAvLyBQdXJlOiBuZXZlciBtdXRhdGVzIGByYXdgIG9yIGFueSBvZiBpdHMgbmVzdGVkIG9iamVjdHMuIFJldHVybnMgYSBuZXdcbiAgLy8gZW50cnkgd2l0aCBhbGwgbWlncmF0aW9ucyBhcHBsaWVkLiBUb3VjaGVkIHN1Ym9iamVjdHMgKGF0dHJzLCBoaW50cyxcbiAgLy8gZ3JvdXAgbWVtYmVycykgYXJlIGNsb25lZCBiZWZvcmUgZWRpdDsgdW50b3VjaGVkIG9uZXMgc2hhcmUgcmVmcyB3aXRoXG4gIC8vIHJhdywgd2hpY2ggaXMgZmluZSBzaW5jZSB3ZSBuZXZlciB3cml0ZSB0byB0aGVtLlxuICBjb25zdCBkZW5vcm1hbGl6ZUVudHJ5ID0gKHJhdzogYW55KTogRW50cnkgPT4ge1xuICAgIGNvbnN0IG91dDogYW55ID0gey4uLnJhd307XG4gICAgZGVsZXRlIG91dC52O1xuICAgIGRlbGV0ZSBvdXQudHlwZTtcbiAgICBkZWxldGUgb3V0LmZlZWRiYWNrO1xuICAgIGlmIChvdXQuX2F1ZGl0ICYmIHR5cGVvZiBvdXQuX2F1ZGl0ID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgYSA9IG91dC5fYXVkaXQ7XG4gICAgICBpZiAoYS5hbmNlc3RvcnMgIT09IHVuZGVmaW5lZCkgb3V0LmFuY2VzdG9ycyA9IGEuYW5jZXN0b3JzO1xuICAgICAgaWYgKGEuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBvdXQuY29tcG9uZW50Um9vdCA9IGEuY29tcG9uZW50Um9vdDtcbiAgICAgIGlmIChhLmluU2hhZG93RE9NICE9PSB1bmRlZmluZWQpIG91dC5pblNoYWRvd0RPTSA9IGEuaW5TaGFkb3dET007XG4gICAgICBpZiAoYS5wc2V1ZG9FbGVtZW50cyAhPT0gdW5kZWZpbmVkKSBvdXQucHNldWRvRWxlbWVudHMgPSBhLnBzZXVkb0VsZW1lbnRzO1xuICAgICAgaWYgKGEubWF0Y2hlZFJ1bGVzICE9PSB1bmRlZmluZWQpIG91dC5tYXRjaGVkUnVsZXMgPSBhLm1hdGNoZWRSdWxlcztcbiAgICAgIGlmIChhLnZpZXdwb3J0ICE9PSB1bmRlZmluZWQpIG91dC52aWV3cG9ydCA9IGEudmlld3BvcnQ7XG4gICAgICBkZWxldGUgb3V0Ll9hdWRpdDtcbiAgICB9XG4gICAgLy8gc3RhdGVzOiB2MSB1c2VkIFJlY29yZDxzdHJpbmcsIHRydWU+OyB2MiB1c2VzIHN0cmluZ1tdLiBOb3JtYWxpemUgYm90aC5cbiAgICBpZiAob3V0LnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShvdXQuc3RhdGVzKSAmJiB0eXBlb2Ygb3V0LnN0YXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG91dC5zdGF0ZXMgPSBPYmplY3Qua2V5cyhvdXQuc3RhdGVzKS5maWx0ZXIoKGspID0+IEJvb2xlYW4oKG91dC5zdGF0ZXMgYXMgYW55KVtrXSkpO1xuICAgIH1cbiAgICAvLyBhdHRycy5mb3JtYXQg4oaSIGhpbnRzLmZvcm1hdC4gQ2xvbmUgYXR0cnMgZmlyc3Qgc28gd2UgZG9uJ3QgbXV0YXRlIHRoZVxuICAgIC8vIGNhbGxlcidzIG5lc3RlZCBvYmplY3QuIFNhbWUgZm9yIGhpbnRzICh3ZSBtYXkgbWVyZ2UgaW50byBpdCkuXG4gICAgaWYgKG91dC5hdHRycyAmJiB0eXBlb2Ygb3V0LmF0dHJzID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3V0LmF0dHJzLmZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGZtdCA9IG91dC5hdHRycy5mb3JtYXQ7XG4gICAgICBjb25zdCB7Zm9ybWF0OiBfZHJvcCwgLi4ucmVzdEF0dHJzfSA9IG91dC5hdHRycztcbiAgICAgIG91dC5hdHRycyA9IHJlc3RBdHRycztcbiAgICAgIG91dC5oaW50cyA9IHsuLi4ob3V0LmhpbnRzID8/IHt9KSwgZm9ybWF0OiBmbXR9O1xuICAgIH1cbiAgICBpZiAoIW91dC51aWQpIG91dC51aWQgPSBtc2dJZCgpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG91dC5ncm91cCkpIG91dC5ncm91cCA9IG91dC5ncm91cC5tYXAoZGVub3JtYWxpemVFbnRyeSk7XG4gICAgcmV0dXJuIG91dCBhcyBFbnRyeTtcbiAgfTtcbiAgLy8gV2FsayBhbGwgbG9hZGVkIG1lc3NhZ2VzIGFuZCBtaWdyYXRlIGFueSBsZWdhY3kgZW50cmllcy4gUmV0dXJucyB0cnVlIGlmXG4gIC8vIGFueXRoaW5nIG11dGF0ZWQgc28gdGhlIGNhbGxlciBjYW4gcGVyc2lzdC5cbiAgY29uc3QgbWlncmF0ZUxvYWRlZE1lc3NhZ2VzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGxldCBtdXRhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IG0uZW50cnk7XG4gICAgICAvLyBDaGVhcCBwcmUtY2hlY2s6IGlmIHVpZCBleGlzdHMgQU5EIHN0YXRlcyBpcyBhbiBhcnJheSBBTkQgbm8gX2F1ZGl0XG4gICAgICAvLyBBTkQgbm8gYXR0cnMuZm9ybWF0IOKGkiBub3RoaW5nIHRvIGRvLCBza2lwIHRoZSB3b3JrLlxuICAgICAgY29uc3QgbmVlZHNXb3JrID1cbiAgICAgICAgIWJlZm9yZS51aWQgfHxcbiAgICAgICAgKGJlZm9yZS5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkoYmVmb3JlLnN0YXRlcykpIHx8XG4gICAgICAgIChiZWZvcmUgYXMgYW55KS5fYXVkaXQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAoYmVmb3JlLmF0dHJzICYmIHR5cGVvZiAoYmVmb3JlLmF0dHJzIGFzIGFueSkuZm9ybWF0ID09PSAnc3RyaW5nJyk7XG4gICAgICBpZiAoIW5lZWRzV29yaykgY29udGludWU7XG4gICAgICBtLmVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShiZWZvcmUpO1xuICAgICAgbXV0YXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtdXRhdGVkO1xuICB9O1xuICBjb25zdCBvbkltcG9ydCA9ICgpOiB2b2lkID0+IGltcG9ydEZpbGUuY2xpY2soKTtcbiAgaW1wb3J0RmlsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM/LlswXTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICBjb25zdCBpbXBvcnRlZDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgdGV4dC5zcGxpdCgvXFxyP1xcbi8pKSB7XG4gICAgICBpZiAoIWxpbmUudHJpbSgpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKGxpbmUpO1xuICAgICAgICBpZiAoby50eXBlID09PSAnbWFuaWZlc3QnKSB7XG4gICAgICAgICAgLy8gTWFuaWZlc3QgbGluZSDigJQgaW5mb3JtYXRpb25hbCBvbmx5IG9uIGltcG9ydC4gU2tpcC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoby50eXBlID09PSAncGFnZScpIGltcG9ydGVkLnB1c2goe3R5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdXJsOiBvLnVybCwgdGl0bGU6IG8udGl0bGUsIHZpZXdwb3J0OiBvLnZpZXdwb3J0LCB0b2tlbnM6IG8udG9rZW5zLCB1c2VyQWdlbnQ6IG8udXNlckFnZW50LCBsYW5nOiBvLmxhbmd9KTtcbiAgICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0OiBvLnRleHQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoby5wYXJlbnRVaWQpIGZiLnBhcmVudFVpZCA9IG8ucGFyZW50VWlkO1xuICAgICAgICAgIGlmIChvLmRldGFjaGVkKSBmYi5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoby50YWdzKSAmJiBvLnRhZ3MubGVuZ3RoKSBmYi50YWdzID0gby50YWdzO1xuICAgICAgICAgIGlmIChvLnNldmVyaXR5KSBmYi5zZXZlcml0eSA9IG8uc2V2ZXJpdHk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaChmYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc2VsZWN0b3IgbGluZSDigJQgY291bGQgYmUgdjEgKGZsYXQpIG9yIHYyICh3aXRoIF9hdWRpdCkuIFRoZVxuICAgICAgICAgIC8vIGJ1bmRsZWQgZmVlZGJhY2sgYXJyYXkgbXVzdCBiZSBzcGxpdCBvdXQgaW50byBzZXBhcmF0ZSBmZWVkYmFja1xuICAgICAgICAgIC8vIG1lc3NhZ2VzIGZvciByb3VuZC10cmlwIHdpdGggdjEgcmVhZGVycyDigJQgYnV0IGluIHYyIHdlIGFscmVhZHlcbiAgICAgICAgICAvLyBlbWl0IHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZXMsIHNvIGRyb3BwaW5nIHRoZSBidW5kbGVkIGxpc3QgaXNcbiAgICAgICAgICAvLyBzYWZlIHRvIGF2b2lkIGRvdWJsZS1jb3VudGluZy5cbiAgICAgICAgICBjb25zdCBmYiA9IEFycmF5LmlzQXJyYXkoby5mZWVkYmFjaykgPyBvLmZlZWRiYWNrIDogbnVsbDtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGRlbm9ybWFsaXplRW50cnkobyk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnl9KTtcbiAgICAgICAgICAvLyBPbmx5IGluZmxhdGUgYnVuZGxlZCBmZWVkYmFjayBpZiB0aGUgZmlsZSBpcyB2MSAobm8gdmVyc2lvblxuICAgICAgICAgIC8vIG1hcmtlciBvbiB0aGUgc2VsZWN0b3IgbGluZXMpLiB2MiBoYXMgaXRzIG93biBzdGFuZGFsb25lXG4gICAgICAgICAgLy8gZmVlZGJhY2sgbGluZXMgdGhhdCBhcnJpdmUgc2VwYXJhdGVseS5cbiAgICAgICAgICBpZiAoZmIgJiYgby52ICE9PSAyKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZmIpIGltcG9ydGVkLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICB0ZXh0OiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgPyB0IDogdD8udGV4dCA/PyAnJyxcbiAgICAgICAgICAgICAgcGFyZW50VWlkOiBlbnRyeS51aWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggeyAvKiBza2lwIGJhZCBsaW5lICovIH1cbiAgICB9XG4gICAgbWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIC4uLmltcG9ydGVkXTtcbiAgICBwZXJzaXN0KCk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cyhgSW1wb3J0ZWQgJHtpbXBvcnRlZC5sZW5ndGh9IG1lc3NhZ2Uke2ltcG9ydGVkLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgIGltcG9ydEZpbGUudmFsdWUgPSAnJztcbiAgfSk7XG4gIC8vIOKUgOKUgOKUgCBXb3Jrc3BhY2Ugc25hcHNob3QgaGlzdG9yeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUGVyc2lzdGVudCAobm90IHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2spLiBBIENsZWFyLWFsbCBhcmNoaXZlcyB0aGVcbiAgLy8gY3VycmVudCB3b3Jrc3BhY2Ugc3RhdGUgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGZyb20gU2V0dGluZ3MgbGF0ZXIuXG4gIGxldCB3c1NuYXBzaG90czogV29ya3NwYWNlU25hcHNob3RbXSA9IFtdO1xuICBjb25zdCBsb2FkV3NTbmFwc2hvdHMgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVNuYXBzaG90W10+KHdzU25hcHNob3RzS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V3NTbmFwc2hvdHMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KHdzU25hcHNob3RzS2V5KGFjdGl2ZVdzKSwgd3NTbmFwc2hvdHMpOyB9O1xuICAvLyBBcmNoaXZlIHRoZSBDVVJSRU5UIHdvcmtzcGFjZSBzdGF0ZSAoYmVmb3JlIGl0J3Mgd2lwZWQpLiBOby1vcCBpZiBlbXB0eS5cbiAgY29uc3QgYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90ID0gKCk6IFdvcmtzcGFjZVNuYXBzaG90IHwgbnVsbCA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHNuYXA6IFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgICAgaWQ6IHNlY3VyZVRva2VuKDgpLFxuICAgICAgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIG1lc3NhZ2VzOiBzdHJ1Y3R1cmVkQ2xvbmUobWVzc2FnZXMpLFxuICAgICAgc2hvdHM6IE9iamVjdC5mcm9tRW50cmllcyhzaG90cyksXG4gICAgICBzZWxlY3RvcnM6IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5sZW5ndGgsXG4gICAgICBjb21tZW50czogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpLmxlbmd0aCxcbiAgICB9O1xuICAgIC8vIE5ld2VzdCBmaXJzdDsgY2FwIHRoZSBoaXN0b3J5LlxuICAgIHdzU25hcHNob3RzLnVuc2hpZnQoc25hcCk7XG4gICAgaWYgKHdzU25hcHNob3RzLmxlbmd0aCA+IFdTX1NOQVBTSE9UX0NBUCkgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5zbGljZSgwLCBXU19TTkFQU0hPVF9DQVApO1xuICAgIHBlcnNpc3RXc1NuYXBzaG90cygpO1xuICAgIHJldHVybiBzbmFwO1xuICB9O1xuICBjb25zdCByZXN0b3JlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHNuYXAgPSB3c1NuYXBzaG90cy5maW5kKChzKSA9PiBzLmlkID09PSBpZCk7XG4gICAgaWYgKCFzbmFwKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gUHVzaCB0aGUgbGl2ZSBzdGF0ZSBvbnRvIHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2sgc28gYSBtaXN0YWtlblxuICAgIC8vIHJlc3RvcmUgaXMgaXRzZWxmIHVuZG9hYmxlLlxuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBzdHJ1Y3R1cmVkQ2xvbmUoc25hcC5tZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzbmFwLnNob3RzKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgc2V0U3RhdHVzKGBSZXN0b3JlZCBzbmFwc2hvdCDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWxlY3RvcnNgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgZGVsZXRlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHdzU25hcHNob3RzID0gd3NTbmFwc2hvdHMuZmlsdGVyKChzKSA9PiBzLmlkICE9PSBpZCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICB9O1xuXG4gIGNvbnN0IG9uQ2xlYXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb25maXJtKCdDbGVhciBhbGwgY2FwdHVyZXM/IEEgc25hcHNob3Qgd2lsbCBiZSBzYXZlZCB0byBTZXR0aW5ncyDihpIgV29ya3NwYWNlcyBmaXJzdC4nKSkgcmV0dXJuO1xuICAgIC8vIEFyY2hpdmUgdGhlIHdvcmtzcGFjZSBCRUZPUkUgd2lwaW5nIHNvIGl0IGNhbiBiZSByZXN0b3JlZCBsYXRlci5cbiAgICBjb25zdCBzbmFwID0gYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90KCk7XG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IFtdO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICAvLyBOZXZlciBjbGFpbSBhIHNuYXBzaG90IHRoYXQgZGlkbid0IGhhcHBlbiAoZW1wdHkgd29ya3NwYWNlIG5vLW9wcykuXG4gICAgc2V0U3RhdHVzKHNuYXAgPyAnQ2xlYXJlZCDCtyBzbmFwc2hvdCBzYXZlZCDigJQgcmVzdG9yZSBpbiBTZXR0aW5ncyDihpIgV29ya3NwYWNlcycgOiAnQ2xlYXJlZCcpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBWYWxpZGF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBydW5WYWxpZGF0aW9uID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IFsuLi5uZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKSldO1xuICAgIGlmICghc2VsZWN0b3JzLmxlbmd0aCB8fCAhaW5FeHRlbnNpb24pIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgIGlmICghdGFic1swXSkgcmV0dXJuO1xuICAgICAgbGl2ZVRhYlVybCA9IHRhYnNbMF0udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgICBsaXZlVGFiUGF0aCA9IHBhdGhPZihsaXZlVGFiVXJsID8/ICcnKTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCEsIHBnKHtraW5kOiAndmFsaWRhdGUnLCBzZWxlY3RvcnN9KSkgYXMge3ZhbGlkPzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj59O1xuICAgICAgaWYgKHJlcGx5Py52YWxpZCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtzZWwsIG9rXSBvZiBPYmplY3QuZW50cmllcyhyZXBseS52YWxpZCkpIHtcbiAgICAgICAgICBzZWxlY3RvclZhbGlkaXR5LnNldChzZWwsIG9rKTtcbiAgICAgICAgICBpZiAoIW9rKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCAnTm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMgdGhpcyBzZWxlY3Rvci4nKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogdGFiIG5vdCByZWFkeSAqLyB9XG4gIH07XG4gIGNvbnN0IG9uVmFsaWRhdGUgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgc2V0U3RhdHVzKCdSZS1jaGVja2luZ+KApicsIHtraW5kOiAnaW5mbyd9KTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgc2V0U3RhdHVzKCdWYWxpZGF0ZWQnKTtcbiAgfTtcblxuICAvLyAoU2NyZWVuc2hvdCBtYWNoaW5lcnkgcmVtb3ZlZCBhbG9uZ3NpZGUgdGhlIC5wcmV2aWV3IHRpbGUuKVxuXG4gIC8vIOKUgOKUgOKUgCBHaXRIdWIgc3RhcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGZldGNoU3RhcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSAncGluY2hncmFiLmdoLnN0YXJzJztcbiAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBTdG9yZS5nZXQ8e2NvdW50OiBudW1iZXI7IHRzOiBudW1iZXJ9IHwgbnVsbD4oY2FjaGVLZXksIG51bGwpO1xuICAgIGlmIChjYWNoZWQgJiYgRGF0ZS5ub3coKSAtIGNhY2hlZC50cyA8IDNfNjAwXzAwMCkge1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjYWNoZWQuY291bnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3dyYW5uZ2xlL3BpbmNoZ3JhYicsIHtjYWNoZTogJ25vLXN0b3JlJ30pO1xuICAgICAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ3N0YXR1cyAnICsgci5zdGF0dXMpO1xuICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpIGFzIHtzdGFyZ2F6ZXJzX2NvdW50PzogbnVtYmVyfTtcbiAgICAgIGNvbnN0IGNvdW50ID0gai5zdGFyZ2F6ZXJzX2NvdW50ID8/IDA7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50KTtcbiAgICAgIHZvaWQgU3RvcmUuc2V0KGNhY2hlS2V5LCB7Y291bnQsIHRzOiBEYXRlLm5vdygpfSk7XG4gICAgfSBjYXRjaCB7IHN0YXJzRWwudGV4dENvbnRlbnQgPSAnwrcnOyB9XG4gIH07XG4gIGNvbnN0IG9uR2l0aHViID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vd3Jhbm5nbGUvcGluY2hncmFiJztcbiAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsfSk7XG4gICAgZWxzZSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgfTtcblxuICAvLyBSZS1pbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gdGhlIGFjdGl2ZSB0YWIg4oCUIHRoZSByZWNvdmVyeSBwYXRoXG4gIC8vIGZvciBcIkFsdCtDbGljayBzdG9wcGVkIHdvcmtpbmdcIiAoYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gc2NyaXB0KS4gUmVmcmVzaGluZyBhbiBhdHRhY2hlZCB0YWIgcmUtaW5qZWN0cyBhdXRvbWF0aWNhbGx5OyB0aGlzXG4gIC8vIGNvdmVycyBldmVyeSBvdGhlciBjYXNlIHdpdGhvdXQgaHVudGluZyBmb3IgdGhlIHRvb2xiYXIgaWNvbi5cbiAgY29uc3Qgb25SZWF0dGFjaCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7IHNldFN0YXR1cygnUmUtYXR0YWNoIG9ubHkgd29ya3MgaW5zaWRlIHRoZSBleHRlbnNpb24nLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8e29rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAncGctcmVpbmplY3QnfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKCdSZS1hdHRhY2hlZCDigJQgQWx0K0NsaWNrIGlzIGxpdmUnKTtcbiAgICBlbHNlIHNldFN0YXR1cyhgQ291bGRuJ3QgcmUtYXR0YWNoIOKAlCBjbGljayB0aGUgUGluY2hHcmFiIHRvb2xiYXIgYnV0dG9uIG9uIHRoZSBwYWdlJHtyZXBseT8uZXJyb3IgPyBgIMK3ICR7cmVwbHkuZXJyb3J9YCA6ICcnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUXVpZXQtc2F2ZXMgbnVkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIHF1aWV0U2F2ZXMgZGVmYXVsdHMgT04gYXMgaW50ZW50LCBidXQgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aVxuICAvLyBwZXJtaXNzaW9uIENocm9tZSBkZW1hbmRzIGNhbiBvbmx5IGJlIHJlcXVlc3RlZCBpbnNpZGUgYSB1c2VyIGdlc3R1cmUuXG4gIC8vIFRoaXMgYmFubmVyIGlzIHRoYXQgZ2VzdHVyZTogc2hvd24gd2hpbGUgdGhlIHByZWYgaXMgb24sIHRoZSBwZXJtaXNzaW9uXG4gIC8vIGlzIG1pc3NpbmcsIGFuZCB0aGUgdXNlciBoYXNuJ3QgZGlzbWlzc2VkIGl0LlxuICBjb25zdCBxdWlldE51ZGdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXF1aWV0LW51ZGdlXScpO1xuICBjb25zdCBtYXliZVNob3dRdWlldE51ZGdlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghcXVpZXROdWRnZSB8fCAhaW5FeHRlbnNpb24gfHwgIWNocm9tZS5wZXJtaXNzaW9ucz8uY29udGFpbnMpIHJldHVybjtcbiAgICBpZiAoIXByZWZzLnF1aWV0U2F2ZXMgfHwgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCkgeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IHJldHVybjsgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pO1xuICAgICAgcXVpZXROdWRnZS5oaWRkZW4gPSBncmFudGVkO1xuICAgIH0gY2F0Y2ggeyBxdWlldE51ZGdlLmhpZGRlbiA9IHRydWU7IH1cbiAgfTtcbiAgY29uc3Qgb25RdWlldEVuYWJsZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgZ3JhbnRlZCA9IGZhbHNlO1xuICAgIHRyeSB7IGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7cGVybWlzc2lvbnM6IFsnZG93bmxvYWRzLnVpJ119KTsgfVxuICAgIGNhdGNoIChlcnIpIHsgY29uc29sZS53YXJuKExPRywgJ2Rvd25sb2Fkcy51aSBwZXJtaXNzaW9uIHJlcXVlc3QgZmFpbGVkJywgZXJyKTsgfVxuICAgIHByZWZzLnF1aWV0U2F2ZXMgPSBncmFudGVkO1xuICAgIGlmICghZ3JhbnRlZCkgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7IC8vIGRlY2xpbmVkIG9uY2Ug4oCUIG5ldmVyIG5hZyBhZ2FpblxuICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgaWYgKHF1aWV0TnVkZ2UpIHF1aWV0TnVkZ2UuaGlkZGVuID0gdHJ1ZTtcbiAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1NhdmVzIHN0YXkgdmlzaWJsZSDigJQgcmUtZW5hYmxlIGluIFNldHRpbmdzIOKGkiBDYXB0dXJlJywgZ3JhbnRlZCA/IHt9IDoge2tpbmQ6ICdpbmZvJ30pO1xuICB9O1xuICBjb25zdCBvblF1aWV0RGlzbWlzcyA9ICgpOiB2b2lkID0+IHtcbiAgICBwcmVmcy5xdWlldFNhdmVzID0gZmFsc2U7XG4gICAgcHJlZnMucXVpZXROdWRnZURpc21pc3NlZCA9IHRydWU7XG4gICAgcGVyc2lzdFByZWZzKCk7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICBpZiAocXVpZXROdWRnZSkgcXVpZXROdWRnZS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTZXR0aW5ncyBkcmF3ZXIgLyB3b3Jrc3BhY2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBhcHBseVByZWZzVG9VSSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXByZWZdJykpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBCb29sZWFuKHByZWZzW2VsLmRhdGFzZXQucHJlZiBhcyBrZXlvZiBQcmVmc10pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCd0ZXh0YXJlYVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICAvLyBQbGFpbi10ZXh0IGlucHV0cyAoZGVzaWduUGF0aCwgc2tpbGxQYXRoKSBhbHNvIHVzZSBkYXRhLXByZWYtdGV4dC5cbiAgICBmb3IgKGNvbnN0IGVsIG9mIGRyYXdlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwidGV4dFwiXVtkYXRhLXByZWYtdGV4dF0nKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcocHJlZnNbZWwuZGF0YXNldC5wcmVmVGV4dCBhcyBrZXlvZiBQcmVmc10gPz8gJycpO1xuICAgIH1cbiAgICB1cGRhdGVEZXNpZ25NZFN0YXR1cygpO1xuICB9O1xuICAvLyBSZW5kZXIgdGhlIGRlc2lnbi1tZCAvIHNraWxsLW1kIHN0YXR1cyBsYWJlbHMgYW5kIHRoZSB0ZW1wbGF0ZS1iYW5uZXJcbiAgLy8gc28gdGhlIHVzZXIgc2VlcyBhdCBhIGdsYW5jZSB3aGV0aGVyIHRoZXkncmUgc2hpcHBpbmcgYSBjdXN0b21pemVkXG4gIC8vIGZpbGUgdnMuIGZhbGxpbmcgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZS4gQXN5bmMgYmVjYXVzZSB3ZVxuICAvLyBuZWVkIHRvIHJlYWQgdGhlIGJ1bmRsZWQgZmlsZSdzIHNpemUgdG8gZGlzcGxheSBcInRlbXBsYXRlIMK3IE4gbGluZXNcIlxuICAvLyBldmVuIHdoZW4gcHJlZnMgaXMgZW1wdHkuXG4gIGNvbnN0IHVwZGF0ZU1kU3RhdHVzZXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGVzaWduRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZGVzaWduLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBza2lsbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXNraWxsLW1kLXN0YXR1c10nKTtcbiAgICBjb25zdCBkZXNpZ25CYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwiZGVzaWduXCJdJyk7XG4gICAgY29uc3Qgc2tpbGxCYW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtdGVtcGxhdGUtYmFubmVyPVwic2tpbGxcIl0nKTtcbiAgICBjb25zdCB0YWcgPSAobWQ6IHN0cmluZywgaXNUcGw6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgbGluZXMgPSBtZC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbbWRdKS5zaXplO1xuICAgICAgcmV0dXJuIGAke2lzVHBsID8gJ3RlbXBsYXRlJyA6ICdjdXN0b20nfSDCtyAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICB9O1xuICAgIGlmIChkZXNpZ25FbCkge1xuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCk7XG4gICAgICBkZXNpZ25FbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSA6ICcoZW1wdHkpJztcbiAgICAgIGRlc2lnbkVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKTtcbiAgICB9XG4gICAgaWYgKHNraWxsRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgICBza2lsbEVsLnRleHRDb250ZW50ID0gY29udGVudC50cmltKCkgPyB0YWcoY29udGVudCwgaXNVc2luZ1RlbXBsYXRlU2tpbGwoKSkgOiAnKGVtcHR5KSc7XG4gICAgICBza2lsbEVsLmNsYXNzTGlzdC50b2dnbGUoJ2hhcy1jb250ZW50JywgIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpO1xuICAgIH1cbiAgICBpZiAoZGVzaWduQmFubmVyKSBkZXNpZ25CYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZURlc2lnbigpO1xuICAgIGlmIChza2lsbEJhbm5lcikgc2tpbGxCYW5uZXIuaGlkZGVuID0gIWlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgLy8gQWxzbyByZWZyZXNoIHRoZSBjb21wYWN0IHByZXZpZXcgdGV4dCBvbiB0aGUgZWRpdG9yLXJvdyBidXR0b24uXG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdkZXNpZ24nKTtcbiAgICBhd2FpdCByZW5kZXJNZFByZXZpZXcoJ3NraWxsJyk7XG4gIH07XG4gIC8vIEJhY2stY29tcGF0IGFsaWFzIOKAlCBlYXJsaWVyIGNvZGUgcGF0aHMgY2FsbGVkIHVwZGF0ZURlc2lnbk1kU3RhdHVzKCkuXG4gIGNvbnN0IHVwZGF0ZURlc2lnbk1kU3RhdHVzID0gKCk6IHZvaWQgPT4geyB2b2lkIHVwZGF0ZU1kU3RhdHVzZXMoKTsgfTtcblxuICAvLyDilIDilIDilIAgQ29tcGFjdCBwcmV2aWV3ICsgbW9kYWwgZWRpdG9yIGZvciBERVNJR04ubWQgLyBTS0lMTC5tZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUmVwbGFjZXMgdGhlIGdpYW50IGlubGluZSB0ZXh0YXJlYXMgd2l0aCBzbWFsbCBkb2N1bWVudCBzdW1tYXJpZXMuXG4gIHR5cGUgTWRLaW5kID0gJ2Rlc2lnbicgfCAnc2tpbGwnO1xuICBjb25zdCBtYXJrZG93bk92ZXJ2aWV3ID0gKGNvbnRlbnQ6IHN0cmluZywga2luZDogTWRLaW5kLCB1c2luZ1RlbXBsYXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQudHJpbSgpID8gY29udGVudC5zcGxpdCgnXFxuJykubGVuZ3RoIDogMDtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBCbG9iKFtjb250ZW50XSkuc2l6ZTtcbiAgICBjb25zdCBoZWFkaW5ncyA9IGNvbnRlbnRcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5tYXAoKGxpbmUpID0+IC9eI3sxLDN9XFxzKyguKykkLy5leGVjKGxpbmUudHJpbSgpKT8uWzFdPy50cmltKCkpXG4gICAgICAuZmlsdGVyKChoZWFkaW5nKTogaGVhZGluZyBpcyBzdHJpbmcgPT4gQm9vbGVhbihoZWFkaW5nKSlcbiAgICAgIC5zbGljZSgwLCA0KTtcbiAgICAvLyBXYXJtLCBwbGFpbi1sYW5ndWFnZSBmcmFtaW5nIG9mIHdoYXQgZWFjaCBmaWxlIHRlYWNoZXMgdGhlIGFnZW50LlxuICAgIC8vIERFU0lHTi5tZCBpcyB0aGUgaGVhZGxpbmUgYXJ0aWZhY3Q6IGl0J3Mgd2hlcmUgeW91IGRlc2NyaWJlIHlvdXIgb3duXG4gICAgLy8gYnJhbmQgYW5kIFVJIHRhc3RlIHNvIHRoZSBhZ2VudCBidWlsZHMgaW4gKnlvdXIqIHZvaWNlIHJhdGhlciB0aGFuIGFcbiAgICAvLyBnZW5lcmljIGRlZmF1bHQuIFNLSUxMLm1kIGlzIHRoZSBhZHZhbmNlZCB0cmlhZ2UgZ3VpZGUgZm9yIHJlYWRpbmdcbiAgICAvLyBleHBvcnRzIOKAlCB1c2VmdWwsIGJ1dCBub3Qgd2hlcmUgbW9zdCBwZW9wbGUgc2hvdWxkIHN0YXJ0LlxuICAgIGNvbnN0IGxhYmVsID0ga2luZCA9PT0gJ2Rlc2lnbidcbiAgICAgID8gJ1RlYWNoZXMgeW91ciBhZ2VudCB0byBidWlsZCBVSSBpbiB5b3VyIGJyYW5kJ1xuICAgICAgOiAnQWR2YW5jZWQ6IGhvdyB5b3VyIGFnZW50IHNob3VsZCByZWFkIFBpbmNoR3JhYiBleHBvcnRzJztcbiAgICBjb25zdCBzb3VyY2UgPSB1c2luZ1RlbXBsYXRlXG4gICAgICA/IChraW5kID09PSAnZGVzaWduJyA/ICdTdGFydGVyIHRlbXBsYXRlIOKAlCBtYWtlIGl0IHlvdXJzJyA6ICdCdW5kbGVkIHRlbXBsYXRlJylcbiAgICAgIDogJ0N1c3RvbWl6ZWQnO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gaGVhZGluZ3MubGVuZ3RoID8gaGVhZGluZ3Muam9pbignIC8gJykgOiAnTm8gc2VjdGlvbiBoZWFkaW5ncyBmb3VuZCc7XG4gICAgcmV0dXJuIGAke2xhYmVsfVxcbiR7c291cmNlfSDCtyAke2xpbmVzLnRvTG9jYWxlU3RyaW5nKCl9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JcXG5TZWN0aW9uczogJHtzZWN0aW9uc31gO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1kUHJldmlldyA9IGFzeW5jIChraW5kOiAnZGVzaWduJyB8ICdza2lsbCcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwcmV2aWV3RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtbWQtcHJldmlldz1cIiR7a2luZH1cIl1gKTtcbiAgICBpZiAoIXByZXZpZXdFbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBraW5kID09PSAnZGVzaWduJyA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGtpbmQgPT09ICdkZXNpZ24nID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHByZXZpZXdFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcoY29udGVudCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk1kTW9kYWwgPSBhc3luYyAoa2luZDogTWRLaW5kKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAoIW92ZXJsYXkpIHJldHVybjtcbiAgICBjb25zdCB0aXRsZUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdGl0bGVdJykhO1xuICAgIGNvbnN0IHRhRWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRleHRhcmVhXScpITtcbiAgICBjb25zdCBzdGF0c0VsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3RhdHNdJykhO1xuICAgIGNvbnN0IGJhbm5lckVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtYmFubmVyXScpITtcbiAgICBjb25zdCBzdW1tYXJ5RWwgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1zdW1tYXJ5XScpITtcbiAgICBjb25zdCBzYXZlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc2F2ZV0nKSE7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1yZXNldF0nKSE7XG4gICAgY29uc3QgdXBsb2FkQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtdXBsb2FkXScpITtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWRvd25sb2FkXScpITtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWNsb3NlXScpITtcblxuICAgIGNvbnN0IGlzRGVzaWduID0ga2luZCA9PT0gJ2Rlc2lnbic7XG4gICAgY29uc3QgaW5pdGlhbCA9IGlzRGVzaWduID8gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKSA6IGF3YWl0IHJlc29sdmVTa2lsbENvbnRlbnQoKTtcbiAgICBjb25zdCB1c2luZ1RlbXBsYXRlID0gaXNEZXNpZ24gPyBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSA6IGlzVXNpbmdUZW1wbGF0ZVNraWxsKCk7XG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGlzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnUGluY2hHcmFiIFNLSUxMLm1kJztcbiAgICB0YUVsLnZhbHVlID0gaW5pdGlhbDtcbiAgICBvdmVybGF5LmRhdGFzZXQua2luZCA9IGtpbmQ7XG5cbiAgICBjb25zdCByZWZyZXNoU3RhdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICBzdGF0c0VsLnRleHRDb250ZW50ID0gYCR7bGluZXN9IGxpbmVzIMK3ICR7KGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICAgICAgc3VtbWFyeUVsLnRleHRDb250ZW50ID0gbWFya2Rvd25PdmVydmlldyh0ZXh0LCBraW5kLCB1c2luZ1RlbXBsYXRlKTtcbiAgICB9O1xuICAgIHJlZnJlc2hTdGF0cygpO1xuICAgIGJhbm5lckVsLmhpZGRlbiA9ICF1c2luZ1RlbXBsYXRlO1xuICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyBg4pqgIEN1cnJlbnRseSBzaGlwcGluZyB0aGUgYnVuZGxlZCAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSB0ZW1wbGF0ZSDigJQgZWRpdHMgaGVyZSBiZWNvbWUgeW91ciBjdXN0b21pemVkIHZlcnNpb24uYFxuICAgICAgOiAnJztcbiAgICB0YUVsLm9uaW5wdXQgPSByZWZyZXNoU3RhdHM7XG5cbiAgICBjb25zdCBvblNhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGFFbC52YWx1ZTtcbiAgICAgIC8vIFNhdmUgZW1wdHkgc3RyaW5nIOKGkiByZXZlcnQgdG8gdGVtcGxhdGUgZmFsbGJhY2suIEFueXRoaW5nIG5vbi1lbXB0eVxuICAgICAgLy8g4oaSIHVzZXIgY3VzdG9taXphdGlvbiAocGVyc2lzdGVkIGluIGNocm9tZS5zdG9yYWdlKS5cbiAgICAgIGlmIChpc0Rlc2lnbikgcHJlZnMuZGVzaWduTWQgPSB0ZXh0O1xuICAgICAgZWxzZSBwcmVmcy5za2lsbE1kID0gdGV4dDtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7aXNEZXNpZ24gPyAnREVTSUdOLm1kJyA6ICdTS0lMTC5tZCd9IHNhdmVkYCk7XG4gICAgICBjbG9zZU1kTW9kYWwoKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0YUVsLnZhbHVlID0gJyc7IC8vIGVtcHR5ID0gZmFsbGJhY2sgdG8gYnVuZGxlZCB0ZW1wbGF0ZVxuICAgICAgcmVmcmVzaFN0YXRzKCk7XG4gICAgICBiYW5uZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIGJhbm5lckVsLnRleHRDb250ZW50ID0gJ0NsZWFyZWQg4oCUIFNhdmUgdG8gcmV2ZXJ0IHRvIGJ1bmRsZWQgdGVtcGxhdGUsIG9yIHBhc3RlIG5ldyBjb250ZW50Lic7XG4gICAgfTtcbiAgICBjb25zdCBvblVwbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBpc0Rlc2lnbiA/ICdkZXNpZ24tbWQtZmlsZScgOiAnc2tpbGwtbWQtZmlsZSc7XG4gICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgIH07XG4gICAgY29uc3Qgb25Eb3dubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBpc0Rlc2lnbiA/ICdERVNJR04udGVtcGxhdGUubWQnIDogJ1BpbmNoR3JhYi5TS0lMTC50ZW1wbGF0ZS5tZCc7XG4gICAgICBkb3dubG9hZFRleHQobmFtZSwgdGFFbC52YWx1ZSk7XG4gICAgfTtcblxuICAgIHNhdmVCdG4ub25jbGljayA9IG9uU2F2ZTtcbiAgICByZXNldEJ0bi5vbmNsaWNrID0gb25SZXNldDtcbiAgICB1cGxvYWRCdG4ub25jbGljayA9IG9uVXBsb2FkO1xuICAgIGRvd25sb2FkQnRuLm9uY2xpY2sgPSBvbkRvd25sb2FkO1xuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1kTW9kYWw7XG4gICAgb3ZlcmxheS5oaWRkZW4gPSBmYWxzZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGFFbC5mb2N1cygpKTtcbiAgfTtcblxuICBjb25zdCBjbG9zZU1kTW9kYWwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICBpZiAob3ZlcmxheSkgb3ZlcmxheS5oaWRkZW4gPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkVGV4dCA9IChmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIG1pbWUgPSAndGV4dC9tYXJrZG93bicpOiB2b2lkID0+IHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7dHlwZTogbWltZX0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7IGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOyBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IHdpcmVNZEZpbGVJbnB1dCA9IChpZDogc3RyaW5nLCBwcmVmS2V5OiAnZGVzaWduTWQnIHwgJ3NraWxsTWQnLCBsYWJlbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVJbnB1dC5maWxlcz8uWzBdO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICBpZiAoZmlsZS5zaXplID4gNSAqIDEwMjQgKiAxMDI0KSB7XG4gICAgICAgIHNldFN0YXR1cyhgJHtsYWJlbH0gdG9vIGxhcmdlICgkeyhmaWxlLnNpemUgLyAxMDI0IC8gMTAyNCkudG9GaXhlZCgxKX0gTUIgPiA1IE1CIGNhcClgLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XG4gICAgICAocHJlZnMgYXMgYW55KVtwcmVmS2V5XSA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHVwbG9hZGVkIMK3ICR7ZmlsZS5uYW1lfSDCtyAkeyhmaWxlLnNpemUgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmApO1xuICAgICAgZmlsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG4gIHdpcmVNZEZpbGVJbnB1dCgnZGVzaWduLW1kLWZpbGUnLCAnZGVzaWduTWQnLCAnREVTSUdOLm1kJyk7XG4gIHdpcmVNZEZpbGVJbnB1dCgnc2tpbGwtbWQtZmlsZScsICdza2lsbE1kJywgJ1NLSUxMLm1kJyk7XG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgaWYgKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmRhdGFzZXQ/LnByZWYpIHtcbiAgICAgIGNvbnN0IGtleSA9IHQuZGF0YXNldC5wcmVmITtcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSBCb29sZWFuKCh0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpO1xuICAgICAgLy8gUXVpZXQgc2F2ZXMgbmVlZHMgdGhlIG9wdGlvbmFsIGRvd25sb2Fkcy51aSBwZXJtaXNzaW9uOyByZXF1ZXN0IGl0XG4gICAgICAvLyBpbnNpZGUgdGhpcyB1c2VyIGdlc3R1cmUgYW5kIHJldmVydCB0aGUgY2hlY2tib3ggb24gZGVjbGluZS5cbiAgICAgIGlmIChrZXkgPT09ICdxdWlldFNhdmVzJyAmJiBjaGVja2VkICYmIGluRXh0ZW5zaW9uICYmIGNocm9tZS5wZXJtaXNzaW9ucz8ucmVxdWVzdCkge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGdyYW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0cnkgeyBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3Qoe3Blcm1pc3Npb25zOiBbJ2Rvd25sb2Fkcy51aSddfSk7IH1cbiAgICAgICAgICBjYXRjaCAoZXJyKSB7IGNvbnNvbGUud2FybihMT0csICdkb3dubG9hZHMudWkgcGVybWlzc2lvbiByZXF1ZXN0IGZhaWxlZCcsIGVycik7IH1cbiAgICAgICAgICBwcmVmcy5xdWlldFNhdmVzID0gZ3JhbnRlZDtcbiAgICAgICAgICAodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gZ3JhbnRlZDtcbiAgICAgICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgICAgICBzZXRTdGF0dXMoZ3JhbnRlZCA/ICdRdWlldCBzYXZlcyBvbiDigJQgbm8gbW9yZSBkb3dubG9hZCBwb3B1cHMnIDogJ1Blcm1pc3Npb24gZGVjbGluZWQg4oCUIHNhdmVzIHN0YXkgdmlzaWJsZScsIGdyYW50ZWQgPyB7fSA6IHtraW5kOiAnd2Fybid9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgKHByZWZzIGFzIGFueSlba2V5XSA9IGNoZWNrZWQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodC5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9ICh0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgLy8gVGV4dGFyZWEgaW5wdXRzIGFsc28gZmlyZSBgaW5wdXRgIGV2ZW50cyBhcyB0aGUgdXNlciB0eXBlcyDigJQgd2Ugd2FudCB0b1xuICAvLyBzYXZlIHRob3NlIGluY3JlbWVudGFsbHkgc28gYSBwYW5lbCByZWxvYWQgZG9lc24ndCBsb3NlIGhhbGYtdHlwZWRcbiAgLy8gZW50cmllcy4gYGNoYW5nZWAgb25seSBmaXJlcyBvbiBibHVyIGZvciB0ZXh0YXJlYXMuXG4gIGRyYXdlcj8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICh0Py5kYXRhc2V0Py5wcmVmVGV4dCkge1xuICAgICAgKHByZWZzIGFzIGFueSlbdC5kYXRhc2V0LnByZWZUZXh0XSA9IHQudmFsdWU7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBvcGVuRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gZmFsc2U7IHJlbmRlcldzQ29udHJvbHMoKTsgfTtcbiAgY29uc3QgY2xvc2VEcmF3ZXIgPSAoKTogdm9pZCA9PiB7IGRyYXdlci5oaWRkZW4gPSB0cnVlOyB9O1xuXG4gIC8vIFJldXNhYmxlIGNyZWF0ZS13b3Jrc3BhY2UgZmxvdzogdmFsaWRhdGVzIHVuaXF1ZW5lc3MsIHBlcnNpc3RzLCBzd2l0Y2hlcy5cbiAgLy8gU2hhcmVkIGJ5IHRoZSBzZXR0aW5ncyBDcmVhdGUgYnV0dG9uIGFuZCB0aGUgaGVhZGVyIGRyb3Bkb3duJ3NcbiAgLy8gXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gYm90aCBwYXRocyBiZWhhdmUgaWRlbnRpY2FsbHkuXG4gIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUZsb3cgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5hbWUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gdHJpbW1lZCkpIHtcbiAgICAgIHNldFN0YXR1cygnQWxyZWFkeSBleGlzdHMnLCB7a2luZDogJ3dhcm4nfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdvcmtzcGFjZXMucHVzaCh7bmFtZTogdHJpbW1lZCwgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9KTtcbiAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodHJpbW1lZCk7XG4gICAgcmVuZGVyKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgIHNldFN0YXR1cyhgQ3JlYXRlZCB3b3Jrc3BhY2UgXCIke3RyaW1tZWR9XCJgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJXc0NvbnRyb2xzID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghd3NTZWxlY3QpIHJldHVybjtcbiAgICB3c1NlbGVjdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd29ya3NwYWNlcykge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSB3Lm5hbWU7XG4gICAgICBvcHQudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgb3B0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHdzU2VsZWN0LmFwcGVuZChvcHQpO1xuICAgIH1cbiAgICAvLyBJbmxpbmUgXCIrIE5ldyB3b3Jrc3BhY2VcIiBhY3Rpb24gc28gdXNlcnMgY2FuIHNwaW4gdXAgYSB3b3Jrc3BhY2VcbiAgICAvLyBzdHJhaWdodCBmcm9tIHRoZSBoZWFkZXIgc3dpdGNoZXIgd2l0aG91dCBvcGVuaW5nIHNldHRpbmdzLiBIYW5kbGVkXG4gICAgLy8gYXMgYSBzZW50aW5lbCB2YWx1ZSBpbiB0aGUgY2hhbmdlIGxpc3RlbmVyIGJlbG93LlxuICAgIGNvbnN0IG5ld09wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdC52YWx1ZSA9ICdfX25ld193b3Jrc3BhY2VfXyc7XG4gICAgbmV3T3B0LnRleHRDb250ZW50ID0gJysgTmV3IHdvcmtzcGFjZSc7XG4gICAgd3NTZWxlY3QuYXBwZW5kKG5ld09wdCk7XG4gICAgaWYgKCF3c0xpc3QpIHJldHVybjtcbiAgICB3c0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGxpLmRhdGFzZXQudGlwID0gdy5uYW1lID09PSBhY3RpdmVXc1xuICAgICAgICA/IGBBY3RpdmUgd29ya3NwYWNlOiAke3cubmFtZX1gXG4gICAgICAgIDogYFN3aXRjaCB0byB3b3Jrc3BhY2UgXCIke3cubmFtZX1cImA7XG4gICAgICAvLyBXaG9sZSByb3cgaXMgdGhlIHN3aXRjaCB0cmlnZ2VyIOKAlCBubyBkZWRpY2F0ZWQgY2hlY2sgYnV0dG9uLlxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIG9uIGlubmVyIGNvbnRyb2xzICh0aGUgZGVsZXRlIGJ1dHRvbiBiZWxvdykuXG4gICAgICAgIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpKSByZXR1cm47XG4gICAgICAgIGZvY3VzV29ya3NwYWNlVGFiKHcubmFtZSk7XG4gICAgICAgIGlmICh3Lm5hbWUgPT09IGFjdGl2ZVdzKSByZXR1cm47XG4gICAgICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2Uody5uYW1lKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBuYW1lLmNsYXNzTmFtZSA9ICd3cy1uYW1lJztcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSB3Lm5hbWU7XG4gICAgICBsaS5hcHBlbmQobmFtZSk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3MtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gbmV3IERhdGUody5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgaWYgKHdvcmtzcGFjZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZGVsLmNsYXNzTmFtZSA9ICdkYW5nZXInO1xuICAgICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgd29ya3NwYWNlIGFuZCBldmVyeXRoaW5nIGluIGl0JztcbiAgICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBEZWxldGUgd29ya3NwYWNlICR7dy5uYW1lfWApO1xuICAgICAgICBkZWwuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCd0cmFzaC0yJywgMTMpO1xuICAgICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgaWYgKCFjb25maXJtKGBEZWxldGUgd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCIgYW5kIGFsbCBpdHMgY2FwdHVyZXM/YCkpIHJldHVybjtcbiAgICAgICAgICB3b3Jrc3BhY2VzID0gd29ya3NwYWNlcy5maWx0ZXIoKHgpID0+IHgubmFtZSAhPT0gdy5uYW1lKTtcbiAgICAgICAgICBwZXJzaXN0V29ya3NwYWNlcygpO1xuICAgICAgICAgIGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFt3c01zZ0tleSh3Lm5hbWUpLCB3c1Nob3RzS2V5KHcubmFtZSksIHdzU2hvdHNGdWxsS2V5KHcubmFtZSksIHdzU25hcHNob3RzS2V5KHcubmFtZSldKS5jYXRjaCgoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICAgICAgICBpZiAoYWN0aXZlV3MgPT09IHcubmFtZSkgYXdhaXQgbG9hZFdvcmtzcGFjZSh3b3Jrc3BhY2VzWzBdIS5uYW1lKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpLmFwcGVuZChkZWwpO1xuICAgICAgfVxuICAgICAgd3NMaXN0LmFwcGVuZChsaSk7XG4gICAgfVxuICAgIHJlbmRlcldzU25hcHNob3RIaXN0b3J5KCk7XG4gIH07XG5cbiAgLy8gUmVuZGVyIHRoZSBhY3RpdmUgd29ya3NwYWNlJ3Mgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKSB3aXRoXG4gIC8vIGEgUmVzdG9yZSBhY3Rpb24uIEFwcGVuZGVkIHVuZGVyIHRoZSB3b3Jrc3BhY2UgbGlzdCBpbiBTZXR0aW5ncy5cbiAgY29uc3QgcmVuZGVyV3NTbmFwc2hvdEhpc3RvcnkgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS13cy1zbmFwc2hvdHNdJyk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaG9zdC5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAoIXdzU25hcHNob3RzLmxlbmd0aCkge1xuICAgICAgaG9zdC5oaWRkZW4gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBob3N0LmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgU25hcHNob3QgaGlzdG9yeSDCtyAke3dzU25hcHNob3RzLmxlbmd0aH1gO1xuICAgIGhlYWQuZGF0YXNldC50aXAgPSAnUmVzdG9yYWJsZSBzbmFwc2hvdHMgc2F2ZWQgYmVmb3JlIGVhY2ggQ2xlYXItYWxsJztcbiAgICBob3N0LmFwcGVuZChoZWFkKTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdWwuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbGlzdCc7XG4gICAgZm9yIChjb25zdCBzbmFwIG9mIHdzU25hcHNob3RzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbWV0YS5jbGFzc05hbWUgPSAnd3Mtc25hcC1tZXRhJztcbiAgICAgIG1ldGEudGV4dENvbnRlbnQgPSBgJHtuZXcgRGF0ZShzbmFwLnRzKS50b0xvY2FsZVN0cmluZygpfSDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWwgwrcgJHtzbmFwLmNvbW1lbnRzfSBjbXRgO1xuICAgICAgbGkuYXBwZW5kKG1ldGEpO1xuICAgICAgY29uc3QgcmVzdG9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcmVzdG9yZS50eXBlID0gJ2J1dHRvbic7XG4gICAgICByZXN0b3JlLmNsYXNzTmFtZSA9ICd3cy1zbmFwLXJlc3RvcmUnO1xuICAgICAgcmVzdG9yZS50ZXh0Q29udGVudCA9ICdSZXN0b3JlJztcbiAgICAgIHJlc3RvcmUuZGF0YXNldC50aXAgPSAnUmVzdG9yZSB0aGlzIHNuYXBzaG90IGludG8gdGhlIGN1cnJlbnQgd29ya3NwYWNlIChjdXJyZW50IHN0YXRlIGlzIGtlcHQgb24gdGhlIHVuZG8gc3RhY2spJztcbiAgICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoICYmICFjb25maXJtKCdSZXN0b3JlIHRoaXMgc25hcHNob3Q/IFRoZSBjdXJyZW50IGNhcHR1cmVzIHdpbGwgYmUgcmVwbGFjZWQgKHVuZG9hYmxlKS4nKSkgcmV0dXJuO1xuICAgICAgICByZXN0b3JlV29ya3NwYWNlU25hcHNob3Qoc25hcC5pZCk7XG4gICAgICB9KTtcbiAgICAgIGxpLmFwcGVuZChyZXN0b3JlKTtcbiAgICAgIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgZGVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyIHdzLXNuYXAtZGVsJztcbiAgICAgIGRlbC5kYXRhc2V0LnRpcCA9ICdEZWxldGUgdGhpcyBzbmFwc2hvdCc7XG4gICAgICBkZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBzbmFwc2hvdCcpO1xuICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEyKTtcbiAgICAgIGRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGRlbGV0ZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgfVxuICAgIGhvc3QuYXBwZW5kKHVsKTtcbiAgfTtcbiAgd3NTZWxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChlKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSAoZS50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ19fbmV3X3dvcmtzcGFjZV9fJykge1xuICAgICAgLy8gUmVzZXQgdGhlIHNlbGVjdCBiYWNrIHRvIHRoZSBhY3RpdmUgd29ya3NwYWNlIGZpcnN0IHNvIHRoZSBzZW50aW5lbFxuICAgICAgLy8gbmV2ZXIgc3RpY2tzIGFzIHRoZSBkaXNwbGF5ZWQgdmFsdWUgaWYgdGhlIHByb21wdCBpcyBjYW5jZWxsZWQuXG4gICAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgICBjb25zdCBuYW1lID0gKHdpbmRvdy5wcm9tcHQoJ05ldyB3b3Jrc3BhY2UgbmFtZScpID8/ICcnKS50cmltKCk7XG4gICAgICBpZiAobmFtZSkgYXdhaXQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZSh2YWx1ZSk7XG4gICAgZm9jdXNXb3Jrc3BhY2VUYWIodmFsdWUpO1xuICAgIHJlbmRlcigpO1xuICB9KTtcblxuICAvLyDilIDilIDilIAgQ29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIENvbW1hbmQgPSB7aWQ6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcnVuOiAoKSA9PiB2b2lkfTtcbiAgY29uc3QgQ09NTUFORFM6IENvbW1hbmRbXSA9IFtcbiAgICB7aWQ6ICdjb3B5LWFsbCcsIGxhYmVsOiAnQ29weSBhbGwgYXMgSlNPTkwnLCBydW46ICgpID0+IHZvaWQgb25Db3B5QWxsKCl9LFxuICAgIHtpZDogJ2V4cG9ydCcsIGxhYmVsOiAnRG93bmxvYWQgSlNPTkwgZmlsZScsIHJ1bjogKCkgPT4gdm9pZCBvbkV4cG9ydCgpfSxcbiAgICB7aWQ6ICdleHBvcnQtemlwJywgbGFiZWw6ICdTZW5kIHRvIEFnZW50IOKAlCBleHBvcnQgLnRhci56c3QgKyBjb3B5IHRoZSBhZ2VudCBwcm9tcHQnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdjb3B5LWFnZW50LXByb21wdCcsIGxhYmVsOiAnQ29weSBTZW5kLXRvLUFnZW50IHByb21wdCAobGFzdCBleHBvcnQpJywgcnVuOiAoKSA9PiB7XG4gICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICghbGFzdEV4cG9ydC5hZ2VudFByb21wdCkgeyBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIFNlbmQgdG8gQWdlbnQgZmlyc3QnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBvayA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChsYXN0RXhwb3J0LmFnZW50UHJvbXB0KTtcbiAgICAgICAgc2V0U3RhdHVzKG9rID8gJ0FnZW50IHByb21wdCBjb3BpZWQnIDogJ0NsaXBib2FyZCB1bmF2YWlsYWJsZScsIG9rID8ge30gOiB7a2luZDogJ3dhcm4nfSk7XG4gICAgICB9KSgpO1xuICAgIH19LFxuICAgIHtpZDogJ2R1Y2tkYicsIGxhYmVsOiAnR2VuZXJhdGUgRHVja0RCIHF1ZXJ5IHNuaXBwZXQgKFNRTCByZWNpcGVzKScsIHJ1bjogKCkgPT4gdm9pZCBvbkR1Y2tEYlNuaXBwZXQoKX0sXG4gICAge2lkOiAnaW1wb3J0JywgbGFiZWw6ICdJbXBvcnQgSlNPTkwgZmlsZScsIHJ1bjogb25JbXBvcnR9LFxuICAgIHtpZDogJ3NlbGVjdC1tb2RlJywgbGFiZWw6ICdUb2dnbGUgcGluY2ggbW9kZSAoY2FwdHVyZSB3aXRob3V0IGhvbGRpbmcgQWx0KScsIHJ1bjogb25Ub2dnbGVTZWxlY3RNb2RlfSxcbiAgICB7aWQ6ICd2YWxpZGF0ZScsIGxhYmVsOiAnUmUtY2hlY2sgc2VsZWN0b3JzJywgcnVuOiAoKSA9PiB2b2lkIG9uVmFsaWRhdGUoKX0sXG4gICAge2lkOiAncmVhdHRhY2gnLCBsYWJlbDogJ1JlLWF0dGFjaCB0byBwYWdlIChmaXggQWx0K0NsaWNrKScsIHJ1bjogKCkgPT4gdm9pZCBvblJlYXR0YWNoKCl9LFxuICAgIHtpZDogJ3JlbG9hZC1leHRlbnNpb24nLCBsYWJlbDogJ1JlbG9hZCB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiAobGFzdCByZXNvcnQpJywgcnVuOiAoKSA9PiB7IGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnJ1bnRpbWUucmVsb2FkKCk7IH19LFxuICAgIHtpZDogJ2NsZWFyJywgbGFiZWw6ICdDbGVhciBhbGwgY2FwdHVyZXMnLCBydW46IG9uQ2xlYXJ9LFxuICAgIHtpZDogJ3NldHRpbmdzJywgbGFiZWw6ICdPcGVuIHNldHRpbmdzJywgcnVuOiBvcGVuRHJhd2VyfSxcbiAgICB7aWQ6ICdnaXRodWInLCBsYWJlbDogJ09wZW4gR2l0SHViIHJlcG8nLCBydW46IG9uR2l0aHVifSxcbiAgICB7aWQ6ICdtYW51YWwnLCBsYWJlbDogJ01hbnVhbCBjYXB0dXJlIChzdGFydCBjb21wb3NlciB3aXRoIGA+IHNlbGVjdG9yYCknLCBydW46ICgpID0+IHsgY29tcG9zZXIudmFsdWUgPSAnPiAnOyBjb21wb3Nlci5mb2N1cygpOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IH19LFxuICAgIHtpZDogJ3VuZG8nLCBsYWJlbDogJ1VuZG8nLCBydW46IHVuZG99LFxuICAgIHtpZDogJ3JlZG8nLCBsYWJlbDogJ1JlZG8nLCBydW46IHJlZG99LFxuICBdO1xuICBjb25zdCByZW5kZXJQYWxldHRlID0gKHEgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGVMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnN0IHFsID0gcS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uQ09NTUFORFMuZmlsdGVyKChjKSA9PiAhcWwgfHwgYy5sYWJlbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSlcbiAgICAgICAgLm1hcCgoYykgPT4gKHtsYWJlbDogYy5sYWJlbCwgcHJldmlldzogJ2NvbW1hbmQnLCBydW46IGMucnVufSkpLFxuICAgICAgLi4ubWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmICghcWwgfHxcbiAgICAgICAgKG0uZW50cnkuc2VsZWN0b3IgKyAnICcgKyAobS5lbnRyeS50ZXh0ID8/ICcnKSArICcgJyArIChtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gJycpKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSkpXG4gICAgICAgIC5zbGljZSgwLCAzMClcbiAgICAgICAgLm1hcCgobSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgICAgICAgY29uc3QgcHJldmlldyA9IChtLmVudHJ5LnRleHQgPz8gZmJbMF0gPz8gbS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDgwKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGFiZWw6IGAjJHttLmVudHJ5Lm59ICR7bS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3J9YCxcbiAgICAgICAgICAgIHByZXZpZXcsXG4gICAgICAgICAgICBydW46ICgpID0+IHtcbiAgICAgICAgICAgICAgY2xvc2VQYWxldHRlKCk7XG4gICAgICAgICAgICAgIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhtLmlkKTtcbiAgICAgICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgIF07XG4gICAgaXRlbXMuZm9yRWFjaCgoaXQsIGkpID0+IHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IGxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxibC5jbGFzc05hbWUgPSAnbGFiZWwnO1xuICAgICAgbGJsLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LmxhYmVsLCBxKTtcbiAgICAgIGxpLmFwcGVuZChsYmwpO1xuICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHAuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgcC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5wcmV2aWV3ID8/ICcnLCBxKTtcbiAgICAgIGxpLmFwcGVuZChwKTtcbiAgICAgIGNvbnN0IGtiZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGtiZC5jbGFzc05hbWUgPSAna2JkJztcbiAgICAgIGtiZC50ZXh0Q29udGVudCA9ICfihrUnO1xuICAgICAgbGkuYXBwZW5kKGtiZCk7XG4gICAgICBpZiAoaSA9PT0gMCkgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaXQucnVuKCk7IH0pO1xuICAgICAgcGFsZXR0ZUxpc3QuYXBwZW5kKGxpKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb3BlblBhbGV0dGUgPSAocHJlc2V0ID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlLmhpZGRlbiA9IGZhbHNlO1xuICAgIHBhbGV0dGVJbnB1dC52YWx1ZSA9IHByZXNldDtcbiAgICByZW5kZXJQYWxldHRlKHByZXNldCk7XG4gICAgcGFsZXR0ZUlucHV0LmZvY3VzKCk7XG4gICAgcGFsZXR0ZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKHByZXNldC5sZW5ndGgsIHByZXNldC5sZW5ndGgpO1xuICB9O1xuICBjb25zdCBjbG9zZVBhbGV0dGUgPSAoKTogdm9pZCA9PiB7IHBhbGV0dGUuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gcmVuZGVyUGFsZXR0ZShwYWxldHRlSW5wdXQudmFsdWUpKTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gWy4uLnBhbGV0dGVMaXN0LmNoaWxkcmVuXTtcbiAgICBsZXQgYWN0aXZlID0gaXRlbXMuZmluZEluZGV4KChsaSkgPT4gbGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSk7XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1pbihpdGVtcy5sZW5ndGggLSAxLCBhY3RpdmUgKyAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1heCgwLCBhY3RpdmUgLSAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyAoaXRlbXNbYWN0aXZlXSBhcyBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCk/LmNsaWNrKCk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBjbG9zZVBhbGV0dGUoKTtcbiAgfSk7XG4gIHBhbGV0dGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IHBhbGV0dGUpIGNsb3NlUGFsZXR0ZSgpOyB9KTtcblxuICAvLyDilIDilIDilIAgQ29udGV4dCBzdHJpcCAoaG92ZXIgaGVscCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJlcGxhY2VzIHRoZSBvbGQgZmxvYXRpbmcgY3Vyc29yIHRvb2x0aXA6IFtkYXRhLXRpcF0gaG92ZXIgdGV4dCBpc1xuICAvLyB3cml0dGVuIGludG8gdGhlIGZpeGVkIHN0cmlwIHVuZGVyIHRoZSBoZWFkZXIsIHNvIGhlbHAgbmV2ZXIgb2NjbHVkZXNcbiAgLy8gb3RoZXIgY29udHJvbHMgYW5kIGNhbid0IHN0cmFuZCBtaWQtc2NyZWVuIHRocm91Z2ggcmUtcmVuZGVycy5cbiAgY29uc3QgVElQX0lETEUgPSAnQWx0K0NsaWNrIG9uIHRoZSBwYWdlIHRvIGNhcHR1cmUgwrcgaG92ZXIgYW55IGNvbnRyb2wgZm9yIGhlbHAnO1xuICBsZXQgdGlwRm9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBUaGUgc2V0dGluZ3MgZHJhd2VyIG92ZXJsYXlzIHRoZSBzdHJpcCAocG9zaXRpb246YWJzb2x1dGUsIGluc2V0IDApLCBzb1xuICAvLyBob3ZlciBoZWxwIGZvciBkcmF3ZXIgY29udHJvbHMgbGFuZHMgaW4gYSBzZWNvbmQgc2luayBpbnNpZGUgdGhlXG4gIC8vIGRyYXdlciBoZWFkZXIuIEJvdGggc2lua3MgYWx3YXlzIHJlY2VpdmUgdGhlIHNhbWUgdGV4dC5cbiAgY29uc3QgZHJhd2VyVGlwRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZHJhd2VyLXRpcF0nKTtcbiAgY29uc3Qgc2hvd1RpcCA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlwJyk7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm47XG4gICAgdG9vbHRpcEVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICd0cnVlJztcbiAgICBpZiAoZHJhd2VyVGlwRWwpIHsgZHJhd2VyVGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0OyBkcmF3ZXJUaXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnOyB9XG4gIH07XG4gIGNvbnN0IGhpZGVUaXAgPSAoKTogdm9pZCA9PiB7XG4gICAgdGlwRm9yID0gbnVsbDtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSBUSVBfSURMRTtcbiAgICB0b29sdGlwRWwuZGF0YXNldC5zaG93biA9ICdmYWxzZSc7XG4gICAgaWYgKGRyYXdlclRpcEVsKSB7IGRyYXdlclRpcEVsLnRleHRDb250ZW50ID0gJyc7IGRyYXdlclRpcEVsLmRhdGFzZXQuc2hvd24gPSAnZmFsc2UnOyB9XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtdGlwXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoIXQgfHwgdCA9PT0gdGlwRm9yKSByZXR1cm47XG4gICAgdGlwRm9yID0gdDtcbiAgICBzaG93VGlwKHQpO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHQgJiYgdCA9PT0gdGlwRm9yICYmICF0LmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCBhcyBOb2RlKSkgaGlkZVRpcCgpO1xuICB9KTtcbiAgLy8gUmUtcmVuZGVycyBjYW4gZHJvcCB0aGUgaG92ZXJlZCBub2RlIHdpdGhvdXQgZXZlciBmaXJpbmcgbW91c2VvdXRcbiAgLy8gKHJlbmRlcigpIHJlc2V0cyBsaXN0LmlubmVySFRNTCwgY29uZmlybSBidXR0b25zIHJlcGxhY2VXaXRoKTsgcmVzZXRcbiAgLy8gdGhlIHN0cmlwIHRvIGl0cyBpZGxlIGhpbnQgd2hlbiB0aGF0IGhhcHBlbnMuXG4gIGNvbnN0IHRpcEd1YXJkID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgIGlmICh0aXBGb3IgJiYgIXRpcEZvci5pc0Nvbm5lY3RlZCkgaGlkZVRpcCgpO1xuICB9KTtcbiAgdGlwR3VhcmQub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7Y2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXQgZHJpbGxkb3ducyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgYXBwZW5kSGVhZGluZyA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDUnKTtcbiAgICBoLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChoKTtcbiAgfTtcbiAgY29uc3QgYXBwZW5kQm9sZCA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYicpO1xuICAgIGIudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGIpO1xuICB9O1xuICBjb25zdCBhcHBlbmRDb2RlID0gKHJvb3Q6IFBhcmVudE5vZGUsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb2RlJyk7XG4gICAgY29kZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoY29kZSk7XG4gIH07XG4gIGNvbnN0IGJ1aWxkRHJpbGxkb3duID0gKGtpbmQ6IHN0cmluZyk6IERvY3VtZW50RnJhZ21lbnQgPT4ge1xuICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgaWYgKGtpbmQgPT09ICdzZWxlY3RvcnMnKSB7XG4gICAgICBhcHBlbmRIZWFkaW5nKGZyYWcsICdTZWxlY3RvcnMgYnkgcXVhbGl0eScpO1xuICAgICAgY29uc3QgYnVja2V0cyA9IHtpZDogMCwgdGVzdGlkOiAwLCBjbGFzczogMCwgbnRoOiAwLCB0YWc6IDB9O1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgICAgaWYgKGUudGVzdElkKSBidWNrZXRzLnRlc3RpZCsrO1xuICAgICAgICBlbHNlIGlmIChlLmlkIHx8IC9eI1tcXHctXSskLy50ZXN0KGUuc2VsZWN0b3IpKSBidWNrZXRzLmlkKys7XG4gICAgICAgIGVsc2UgaWYgKChlLnNlbGVjdG9yID8/ICcnKS5pbmNsdWRlcygnOm50aC1vZi10eXBlJykpIGJ1Y2tldHMubnRoKys7XG4gICAgICAgIGVsc2UgaWYgKC9cXC4vLnRlc3QoZS5zZWxlY3RvciA/PyAnJykpIGJ1Y2tldHMuY2xhc3MrKztcbiAgICAgICAgZWxzZSBidWNrZXRzLnRhZysrO1xuICAgICAgfVxuICAgICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgZm9yIChjb25zdCBbdmFsdWUsIGxhYmVsXSBvZiBbXG4gICAgICAgIFtidWNrZXRzLnRlc3RpZCwgJyBkYXRhLXRlc3RpZCddLFxuICAgICAgICBbYnVja2V0cy5pZCwgJyBzdGFibGUgaWQnXSxcbiAgICAgICAgW2J1Y2tldHMuY2xhc3MsICcgY2xhc3MtYmFzZWQnXSxcbiAgICAgICAgW2J1Y2tldHMubnRoLCAnIG50aC1vZi10eXBlJ10sXG4gICAgICAgIFtidWNrZXRzLnRhZywgJyB0YWctb25seSddLFxuICAgICAgXSBhcyBjb25zdCkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICBsaS5hcHBlbmQobGFiZWwpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3N0YWxlJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnU3RhbGUgY2FwdHVyZXMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IHN0YWxlID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmIHNlbGVjdG9yVmFsaWRpdHkuZ2V0KG0uZW50cnkuc2VsZWN0b3IpID09PSBmYWxzZSk7XG4gICAgICBpZiAoIXN0YWxlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gJ05vbmUgLSBldmVyeXRoaW5nIHJlc29sdmVzLic7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9IGVsc2UgZm9yIChjb25zdCBtIG9mIHN0YWxlKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgYCMke20uZW50cnkubn1gKTtcbiAgICAgICAgbGkuYXBwZW5kKCcgJyk7XG4gICAgICAgIGFwcGVuZENvZGUobGksIChtLmVudHJ5LnNlbGVjdG9yID8/ICcnKS5zbGljZSgwLCA1MCkpO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ2NvbW1lbnRzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnQ29tbWVudHMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IGZicyA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgRmVlZGJhY2tNZXNzYWdlID0+IG0udHlwZSA9PT0gJ2ZlZWRiYWNrJyk7XG4gICAgICBjb25zdCB0b3RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICB0b3RhbC5hcHBlbmQoJ1RvdGFsIHdvcmRzOiAnKTtcbiAgICAgIGFwcGVuZEJvbGQodG90YWwsIFN0cmluZyhmYnMucmVkdWNlKChzLCBtKSA9PiBzICsgd29yZENvdW50KG0udGV4dCksIDApKSk7XG4gICAgICB1bC5hcHBlbmQodG90YWwpO1xuICAgICAgY29uc3QgYXZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGF2Zy5hcHBlbmQoJ0F2ZXJhZ2UgbGVuZ3RoOiAnKTtcbiAgICAgIGFwcGVuZEJvbGQoYXZnLCBTdHJpbmcoZmJzLmxlbmd0aCA/IE1hdGgucm91bmQoZmJzLnJlZHVjZSgocywgbSkgPT4gcyArIG0udGV4dC5sZW5ndGgsIDApIC8gZmJzLmxlbmd0aCkgOiAwKSk7XG4gICAgICBhdmcuYXBwZW5kKCcgY2hhcnMnKTtcbiAgICAgIHVsLmFwcGVuZChhdmcpO1xuICAgICAgZnJhZy5hcHBlbmQodWwpO1xuICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3BhZ2VzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnUGFnZXMnKTtcbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBzZWVuLnNldChtLmVudHJ5LnVybCwgKHNlZW4uZ2V0KG0uZW50cnkudXJsKSA/PyAwKSArIDEpO1xuICAgICAgZm9yIChjb25zdCBbdXJsLCBuXSBvZiBzZWVuKSB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgYXBwZW5kQm9sZChsaSwgU3RyaW5nKG4pKTtcbiAgICAgICAgbGkuYXBwZW5kKGAgc2VsZWN0b3Ike24gPT09IDEgPyAnJyA6ICdzJ30gwrcgYCk7XG4gICAgICAgIGFwcGVuZENvZGUobGksIHBhdGhPZih1cmwpKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWc7XG4gIH07XG4gIGNvbnN0IHNob3dEcmlsbGRvd24gPSAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGtpbmQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXQnKTtcbiAgICBpZiAoIWtpbmQpIHJldHVybjtcbiAgICBkcmlsbGRvd25FbC5yZXBsYWNlQ2hpbGRyZW4oYnVpbGREcmlsbGRvd24oa2luZCkpO1xuICAgIGRyaWxsZG93bkVsLmhpZGRlbiA9IGZhbHNlO1xuICAgIGNvbnN0IHIgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZFIgPSBkcmlsbGRvd25FbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgdG9wID0gci5ib3R0b20gKyA2O1xuICAgIGxldCBsZWZ0ID0gci5sZWZ0ICsgci53aWR0aCAvIDIgLSBkUi53aWR0aCAvIDI7XG4gICAgaWYgKHRvcCArIGRSLmhlaWdodCArIDQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHRvcCA9IHIudG9wIC0gZFIuaGVpZ2h0IC0gNjtcbiAgICBpZiAobGVmdCA8IDYpIGxlZnQgPSA2O1xuICAgIGlmIChsZWZ0ICsgZFIud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDYpIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGRSLndpZHRoIC0gNjtcbiAgICBkcmlsbGRvd25FbC5zdHlsZS5jc3NUZXh0ID0gYHRvcDoke3RvcH1weDtsZWZ0OiR7bGVmdH1weDtgO1xuICB9O1xuICBjb25zdCBoaWRlRHJpbGxkb3duID0gKCk6IHZvaWQgPT4geyBkcmlsbGRvd25FbC5oaWRkZW4gPSB0cnVlOyB9O1xuICBzdGF0c0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnLnN0YXRbZGF0YS1zdGF0XScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodCkgc2hvd0RyaWxsZG93bih0KTtcbiAgfSk7XG4gIHN0YXRzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgIGlmICghc3RhdHNFbC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVEcmlsbGRvd24oKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEV4cG9ydC1idXR0b24gaG92ZXIg4oaSIG91dGxpbmUtbXVsdGkgb24gcGFnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgZm9yIChjb25zdCBidG4gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZXhwb3J0LWhvdmVyXScpKSB7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RvcnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpLm1hcCgobSkgPT4gbS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aScsIHNlbGVjdG9yc30pO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tc2cuc2VsZWN0b3InKSkgZWwuY2xhc3NMaXN0LmFkZCgnZXhwb3J0LWhvdmVyJyk7XG4gICAgfSk7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yJykpIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2V4cG9ydC1ob3ZlcicpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g4pSA4pSA4pSAIENsaWNrIGRlbGVnYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCB0cmlnZ2VyID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgaWYgKCF0cmlnZ2VyKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWFjdGlvbicpO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdzZW5kJzogc2VuZEZlZWRiYWNrKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NvcHktYWxsJzogdm9pZCBvbkNvcHlBbGwoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZXhwb3J0Jzogdm9pZCBvbkV4cG9ydCgpOyByZXR1cm47XG4gICAgICBjYXNlICdleHBvcnQtemlwJzogdm9pZCBvbkV4cG9ydFppcCgpOyByZXR1cm47XG4gICAgICBjYXNlICdjb3B5LXBhdGgnOiB2b2lkIG9uQ29weVBhdGgoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaW1wb3J0Jzogb25JbXBvcnQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndmFsaWRhdGUnOiB2b2lkIG9uVmFsaWRhdGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2VsZWN0LW1vZGUnOiBvblRvZ2dsZVNlbGVjdE1vZGUoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVhdHRhY2gnOiB2b2lkIG9uUmVhdHRhY2goKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncXVpZXQtZW5hYmxlJzogdm9pZCBvblF1aWV0RW5hYmxlKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3F1aWV0LWRpc21pc3MnOiBvblF1aWV0RGlzbWlzcygpOyByZXR1cm47XG4gICAgICBjYXNlICdjbGVhcic6IG9uQ2xlYXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZ2l0aHViJzogb25HaXRodWIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOiBvcGVuRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Nsb3NlLWRyYXdlcic6IGNsb3NlRHJhd2VyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3VuZG8nOiB1bmRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3JlZG8nOiByZWRvKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2Rlc2lnbi1lZGl0JzogeyB2b2lkIG9wZW5NZE1vZGFsKCdkZXNpZ24nKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdza2lsbC1lZGl0JzogIHsgdm9pZCBvcGVuTWRNb2RhbCgnc2tpbGwnKTsgcmV0dXJuOyB9XG4gICAgICBjYXNlICdkZXNpZ24tdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbi1tZC1maWxlJykgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGwpPy5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyBBbHdheXMgdGhlIFBMQUlOIFNUT0NLIHRlbXBsYXRlIOKAlCB0aGUgbG9jYWwuKiBkZXYtb3ZlcnJpZGVcbiAgICAgICAgICAvLyBwcmVmZXJlbmNlIGNvbnRhbWluYXRlZCBkZWZhdWx0cyB3aXRoIGEgZGV2ZWxvcGVyJ3Mgb3duIGJyYW5kLlxuICAgICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCBsb2FkVGVtcGxhdGUoJ2Rlc2lnblRlbXBsYXRlJyk7XG4gICAgICAgICAgaWYgKCF0ZXh0KSB7IHNldFN0YXR1cygnVGVtcGxhdGUgbm90IGZvdW5kJywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICAgICAgICBkb3dubG9hZFRleHQoJ0RFU0lHTi50ZW1wbGF0ZS5tZCcsIHRleHQpO1xuICAgICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQg4oCUIGZpbGwgaW4gYW5kIHJlLXVwbG9hZCcpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdkZXNpZ24tcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLmRlc2lnbk1kID0gJyc7XG4gICAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgICBzZXRTdGF0dXMoJ0RFU0lHTi5tZCByZXNldCDigJQgZXhwb3J0cyB3aWxsIGJ1bmRsZSB0aGUgdGVtcGxhdGUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdXBsb2FkJzoge1xuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NraWxsLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3NraWxsLXRlbXBsYXRlLWRvd25sb2FkJzoge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpO1xuICAgICAgICAgIGlmICghdGV4dCkgeyBzZXRTdGF0dXMoJ1RlbXBsYXRlIG5vdCBmb3VuZCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgZG93bmxvYWRUZXh0KCdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLCB0ZXh0KTtcbiAgICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQnKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLnNraWxsTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgcmVzZXQg4oCUIGV4cG9ydHMgd2lsbCBidW5kbGUgdGhlIHRlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3dzLWNyZWF0ZSc6IHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICh3c05hbWUudmFsdWUgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG4gICAgICAgIHZvaWQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKS50aGVuKChvaykgPT4geyBpZiAob2spIHdzTmFtZS52YWx1ZSA9ICcnOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBHbG9iYWwga2V5Ym9hcmQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldCA9ICh0YXJnZXQ6IEV2ZW50VGFyZ2V0IHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGVsID0gdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyB0YXJnZXQgOiBudWxsO1xuICAgIHJldHVybiBCb29sZWFuKGVsPy5jbG9zZXN0KCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCwgW2NvbnRlbnRlZGl0YWJsZT1cInRydWVcIl0sIFtjb250ZW50ZWRpdGFibGU9XCJcIl0nKSk7XG4gIH07XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgZWRpdGFibGVUYXJnZXQgPSBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQoZS50YXJnZXQpO1xuICAgIGlmIChlZGl0YWJsZVRhcmdldCAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgWydhJywgJ3onLCAneSddLmluY2x1ZGVzKGUua2V5LnRvTG93ZXJDYXNlKCkpKSByZXR1cm47XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnaycpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBwYWxldHRlLmhpZGRlbiA/IG9wZW5QYWxldHRlKCkgOiBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgLy8gQ3RybCtGIChhbmQgQ21kK0YpIG9wZW5zIHRoZSBpbi1saXN0IHZpc3VhbCBmaW5kIOKAlCBkaXN0aW5jdCBmcm9tIHRoZVxuICAgIC8vIENtZCtLIGNvbW1hbmQgcGFsZXR0ZS4gT3ZlcnJpZGUgdGhlIGJyb3dzZXIncyBuYXRpdmUgZmluZCBzbyB0aGUgcGFuZWxcbiAgICAvLyBvd25zIHRoZSBnZXN0dXJlLlxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2YnKSB7IGUucHJldmVudERlZmF1bHQoKTsgb3BlbkZpbmQoKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB1bmRvKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgKGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd5JyB8fCAoZS5zaGlmdEtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicpKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHJlZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgY29uc3QgbWRNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICAgIGlmIChtZE1vZGFsICYmICFtZE1vZGFsLmhpZGRlbikgeyBjbG9zZU1kTW9kYWwoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSB7IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAgIGlmICghZHJhd2VyLmhpZGRlbikgeyBjbG9zZURyYXdlcigpOyByZXR1cm47IH1cbiAgICAgIGlmIChmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbikgeyBjbG9zZUZpbmQoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgeyB2b2lkIHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSk7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdQZW5kaW5nIGdyb3VwIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogdHJ1ZX0pO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIGlmICghZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBwYW5lbFJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHBlbmRpbmdQYW5lbE1lc3NhZ2VzOiBhbnlbXSA9IFtdO1xuICBjb25zdCByZWNlaXZlUGFuZWxNZXNzYWdlID0gKG06IGFueSk6IHZvaWQgPT4ge1xuICAgIGlmICghcGFuZWxSZWFkeSkge1xuICAgICAgcGVuZGluZ1BhbmVsTWVzc2FnZXMucHVzaChtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25Dc01lc3NhZ2UobSk7XG4gIH07XG4gIGlmIChpbkV4dGVuc2lvbikge1xuICAgIC8vIFNpbmdsZSBjaGFubmVsOiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuIFRoZSBiYWNrZ3JvdW5kIHVzZWQgdG8gcmVsYXlcbiAgICAvLyB0aHJvdWdoIGEgcG9ydCB0b28sIGJ1dCBjb250ZW50LXNjcmlwdCBicm9hZGNhc3RzIGFscmVhZHkgcmVhY2ggdGhlXG4gICAgLy8gc2lkZSBwYW5lbCBkaXJlY3RseSDigJQgcmVsYXlpbmcgcHJvZHVjZWQgZHVwbGljYXRlIGRpc3BhdGNoZXMuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtOiBhbnkpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UobSkpO1xuICAgIGNocm9tZS50YWJzPy5vbkFjdGl2YXRlZD8uYWRkTGlzdGVuZXIoKCkgPT4gdm9pZCBydW5WYWxpZGF0aW9uKCkpO1xuICAgIGNocm9tZS50YWJzPy5vblVwZGF0ZWQ/LmFkZExpc3RlbmVyKChfaWQsIGluZm8pID0+IHsgaWYgKGluZm8/LnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykgdm9pZCBydW5WYWxpZGF0aW9uKCk7IH0pO1xuICAgIGNocm9tZS50YWJzPy5vblJlbW92ZWQ/LmFkZExpc3RlbmVyKChjbG9zZWRJZCkgPT4ge1xuICAgICAgY29uc3Qgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcudGFiSWQgPT09IGNsb3NlZElkKTtcbiAgICAgIGlmICh3cykgeyB3cy50YWJJZCA9IHVuZGVmaW5lZDsgcGVyc2lzdFdvcmtzcGFjZXMoKTsgcmVuZGVyV3NDb250cm9scygpOyB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIChlKSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWwpKTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBUZXN0IEFQSSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaW5zdGFsbFRlc3RBcGkgPSAoKTogdm9pZCA9PiB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLl9fcGluY2hncmFiX3BhbmVsID0ge1xuICAgICAgcHVzaE1lc3NhZ2U6IChtOiBQYW5lbE1lc3NhZ2UpID0+IHsgbWVzc2FnZXMucHVzaChtKTsgcGVyc2lzdCgpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uQ2FwdHVyZSwgb25Ib3Zlciwgb25Ib3ZlckVuZCwgb25QYWdlU25hcHNob3QsXG4gICAgICBnZXRNZXNzYWdlczogKCkgPT4gWy4uLm1lc3NhZ2VzXSxcbiAgICAgIGdldFByZWZzOiAoKSA9PiAoey4uLnByZWZzfSksXG4gICAgICBzZXRQcmVmczogKHA6IFBhcnRpYWw8UHJlZnM+KSA9PiB7IHByZWZzID0gey4uLnByZWZzLCAuLi5wfTsgcGVyc2lzdFByZWZzKCk7IGFwcGx5UHJlZnNUb1VJKCk7IHJlbmRlcigpOyB9LFxuICAgICAgYnVpbGRKc29ubCxcbiAgICAgIGJ1aWxkRXhwb3J0RmlsZW5hbWUsIGJ1aWxkTWFuaWZlc3QsIGRvbWluYW50SG9zdFNsdWcsIGRpc3RpbmN0SG9zdHMsXG4gICAgICBkdWNrRGJTbmlwcGV0LCBvbkV4cG9ydFppcCwgb25FeHBvcnQsIG9uQ29weVBhdGgsXG4gICAgICBkZW5vcm1hbGl6ZUVudHJ5LFxuICAgICAgZ2V0TGFzdEV4cG9ydDogKCkgPT4gKHsuLi5sYXN0RXhwb3J0fSksXG4gICAgICBnZXRMYXN0QWdlbnRQcm9tcHQ6ICgpID0+IGxhc3RFeHBvcnQuYWdlbnRQcm9tcHQsXG4gICAgICAvLyBUZXN0IGhhdGNoOiBzZWVkIGV2ZXJ5IHNlbGVjdG9yIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBmdWxsIFBORyBkYXRhVVJMXG4gICAgICAvLyBzbyB0aGUgYXJjaGl2ZSBleHBvcnQgaGFzIHNvbWV0aGluZyB0byBidW5kbGUuIFJlYWwgY2FwdHVyZXMgcG9wdWxhdGVcbiAgICAgIC8vIHNob3RzRnVsbCBmcm9tIHRoZSBiZyBgcnVuU2hvdGAgcmVwbHk7IHRlc3RzIGNhbid0IGVhc2lseSBydW4gYVxuICAgICAgLy8gY2FwdHVyZVZpc2libGVUYWIsIHNvIHRoaXMgbGV0cyB1cyBwcm92ZSB0aGUgUE5HIGJ1bmRsaW5nIHBhdGguXG4gICAgICBfX3NlZWRTaG90c0Z1bGw6IChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2hvdHNGdWxsLnNldChtLmVudHJ5LnNlbGVjdG9yLCBkYXRhVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgICB9LFxuICAgICAgX19nZXRTaG90c0Z1bGw6ICgpID0+IHNob3RzRnVsbCxcbiAgICAgIC8vIEZyZWV6ZSB0aGUgZXhwb3J0IGNsb2NrIChJU08gc3RyaW5nKSBzbyB0ZXN0cyBjYW4gYXNzZXJ0IHR3b1xuICAgICAgLy8gZXhwb3J0cyBvZiBpZGVudGljYWwgY29udGVudCBhcmUgYnl0ZS1pZGVudGljYWwuIFBhc3MgbnVsbCB0b1xuICAgICAgLy8gcmVzdG9yZSB3YWxsLWNsb2NrIGJlaGF2aW9yLlxuICAgICAgX19zZXRFeHBvcnRDbG9jazogKGlzbzogc3RyaW5nIHwgbnVsbCkgPT4geyBleHBvcnRDbG9ja092ZXJyaWRlID0gaXNvOyB9LFxuICAgICAgLy8gc2V0U2VhcmNoIGRyaXZlcyB0aGUgQ3RybCtGIHZpc3VhbC1maW5kIHBhdGggKHRoZSBoZWFkZXIgc2VhcmNoIG5vd1xuICAgICAgLy8gb3BlbnMgdGhlIGNvbW1hbmQgcGFsZXR0ZSBpbnN0ZWFkIG9mIGZpbHRlcmluZykuXG4gICAgICBzZXRTZWFyY2g6IChxOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHEpIHsgb3BlbkZpbmQoKTsgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gcTsgYXBwbHlGaW5kKHEpOyB9XG4gICAgICAgIGVsc2UgY2xvc2VGaW5kKCk7XG4gICAgICB9LFxuICAgICAgb3BlbkZpbmQsIGNsb3NlRmluZCxcbiAgICAgIGlzRmluZE9wZW46ICgpID0+IEJvb2xlYW4oZmluZEJhciAmJiAhZmluZEJhci5oaWRkZW4pLFxuICAgICAgc2V0VmFsaWRpdHk6IChzZWw6IHN0cmluZywgb2s6IGJvb2xlYW4gfCAnZGlmZi1wYWdlJywgcmVhc29uPzogc3RyaW5nKSA9PiB7XG4gICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICBpZiAocmVhc29uKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCByZWFzb24pO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICAgICAgbGl2ZVRhYlBhdGggPSBudWxsO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgICAgICBzaG90cy5jbGVhcigpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9wZW5QYWxldHRlLCBjbG9zZVBhbGV0dGUsIG9wZW5EcmF3ZXIsIGNsb3NlRHJhd2VyLFxuICAgICAgc2VuZEZlZWRiYWNrLCB1bmRvLCByZWRvLFxuICAgICAgbGlzdFdvcmtzcGFjZXM6ICgpID0+IFsuLi53b3Jrc3BhY2VzXSxcbiAgICAgIGFjdGl2ZVdvcmtzcGFjZTogKCkgPT4gYWN0aXZlV3MsXG4gICAgICBzZXRTdGlja3lUVEw6IChtczogbnVtYmVyKSA9PiB7IFNUSUNLWV9UVExfTVMgPSBtczsgfSxcbiAgICAgIGZvcmNlU3RpY2t5RXhwaXJlOiAoKSA9PiB7IGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7IHBhbmVsSG92ZXJlZCA9IGZhbHNlOyBhcm1TdGlja3lFeHBpcnkoKTsgfSxcbiAgICAgIHNldExhc3RBY3RpdmUsXG4gICAgICBjcmVhdGVXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IHsgd29ya3NwYWNlcy5wdXNoKHtuYW1lOiBuLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0pOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZXR1cm4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlcik7IH0sXG4gICAgICBzd2l0Y2hXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IGxvYWRXb3Jrc3BhY2UobikudGhlbihyZW5kZXIpLFxuICAgICAgY2xlYXJBbGw6IG9uQ2xlYXIsXG4gICAgICBsaXN0U25hcHNob3RzOiAoKSA9PiB3c1NuYXBzaG90cy5tYXAoKHMpID0+ICh7aWQ6IHMuaWQsIHRzOiBzLnRzLCBzZWxlY3RvcnM6IHMuc2VsZWN0b3JzLCBjb21tZW50czogcy5jb21tZW50c30pKSxcbiAgICAgIHJlc3RvcmVTbmFwc2hvdDogKGlkOiBzdHJpbmcpID0+IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdChpZCksXG4gICAgfTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUGFuZWwgc2VsZi1oZWFsIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBBZnRlciBhIGRldiBleHRlbnNpb24gcmVsb2FkIChvciBhbiBhdXRvLXVwZGF0ZSksIHRoZSBzaWRlIHBhbmVsIGtlZXBzXG4gIC8vIHJ1bm5pbmcgaXRzIE9MRCBjb2RlIHdpdGggYW4gSU5WQUxJREFURUQgY2hyb21lLnJ1bnRpbWU6IGNocm9tZS5ydW50aW1lLmlkXG4gIC8vIGdvZXMgdW5kZWZpbmVkIGFuZCBldmVyeSBjaHJvbWUuKiBjYWxsIHRocm93cyBcIkV4dGVuc2lvbiBjb250ZXh0XG4gIC8vIGludmFsaWRhdGVkXCIuIEEgZGVhZCBwYW5lbCBjYW4ndCByZWFjaCB0aGUgYmFja2dyb3VuZCwgc28gTk8gYnV0dG9uIGluIGl0XG4gIC8vIHdvcmtzIOKAlCB3aGljaCBpcyBleGFjdGx5IHdoeSB0aGUgb25seSByZWNvdmVyeSB1c2VkIHRvIGJlIFwiY2xvc2UgdGhlIHBhbmVcbiAgLy8gYW5kIHJlY2xpY2sgdGhlIHRvb2xiYXJcIi4gVGhpcyBoZWFydGJlYXQgZGV0ZWN0cyB0aGF0IGRlYXRoIGFuZCByZWxvYWRzXG4gIC8vIHRoZSBwYW5lbCBwYWdlLCB3aGljaCByZS1mZXRjaGVzIHRoZSBmcmVzaCBjb2RlIGFuZCByZWNvbm5lY3RzLiBBXG4gIC8vIHNlc3Npb25TdG9yYWdlIGNvdW50ZXIgKHN1cnZpdmVzIHRoZSByZWxvYWQpIHByZXZlbnRzIGEgbG9vcCB3aGVuIHRoZVxuICAvLyBleHRlbnNpb24gaXMgZ2VudWluZWx5IGdvbmUgcmF0aGVyIHRoYW4gcmVsb2FkZWQuXG4gIGNvbnN0IHdhdGNoQ29udGV4dEhlYWx0aCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSByZXR1cm47XG4gICAgY29uc3QgUkVMT0FEX0tFWSA9ICdwZy5jdHhSZWxvYWRzJztcbiAgICAvLyBPbmNlIHdlJ3ZlIGJlZW4gc3RhYmx5IGFsaXZlIGZvciBhIHdoaWxlLCBjbGVhciB0aGUgbG9vcCBndWFyZC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdHJ5IHsgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShSRUxPQURfS0VZKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9IH0sIDE1MDAwKTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBsZXQgYWxpdmUgPSBmYWxzZTtcbiAgICAgIHRyeSB7IGFsaXZlID0gQm9vbGVhbihjaHJvbWUucnVudGltZT8uaWQpOyB9IGNhdGNoIHsgYWxpdmUgPSBmYWxzZTsgfVxuICAgICAgaWYgKGFsaXZlKSByZXR1cm47XG4gICAgICBsZXQgbiA9IDA7XG4gICAgICB0cnkgeyBuID0gTnVtYmVyKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVMT0FEX0tFWSkgPz8gJzAnKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICBpZiAobiA+PSAzKSB7XG4gICAgICAgIC8vIEF1dG8tcmVjb3ZlcnkgZXhoYXVzdGVkIChleHRlbnNpb24gbGlrZWx5IHVuaW5zdGFsbGVkLCBub3QgcmVsb2FkZWQpLlxuICAgICAgICBpZiAoc3RhdHVzKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnUGluY2hHcmFiIHdhcyByZWxvYWRlZCDigJQgY2xvc2UgdGhpcyBwYW5lbCBhbmQgcmVvcGVuIGl0IGZyb20gdGhlIHRvb2xiYXIuJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxPQURfS0VZLCBTdHJpbmcobiArIDEpKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICBpZiAoc3RhdHVzKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnUGluY2hHcmFiIHJlbG9hZGVkIOKAlCByZWNvbm5lY3RpbmfigKYnO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRyeSB7IGxvY2F0aW9uLnJlbG9hZCgpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH0gfSwgNjAwKTtcbiAgICB9LCAyMDAwKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQm9vdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGxvYWRBbGwoKTtcbiAgICBwYW5lbFJlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgcGVuZGluZ1BhbmVsTWVzc2FnZXMuc3BsaWNlKDApKSBvbkNzTWVzc2FnZShtKTtcbiAgICByZW5kZXIoKTtcbiAgICBpbnN0YWxsVGVzdEFwaSgpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHZvaWQgbWF5YmVTaG93UXVpZXROdWRnZSgpO1xuICAgIHZvaWQgZmV0Y2hTdGFycygpO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICAgIHdhdGNoQ29udGV4dEhlYWx0aCgpO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9uLCB3czogYWN0aXZlV3MsIG1lc3NhZ2VzOiBtZXNzYWdlcy5sZW5ndGh9KTtcbiAgfSkoKTtcbn0pKCk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQStuQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJ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O0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGOzs7RUNwa0JPLElBQU0sZ0JBQWdCLENBQUMsY0FB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QUNyRSxJQUFJLEtBQUssR0FBRztBQUFBLFVBRVYsSUFBSTtBQUFBLFlBQVEsT0FBTyxjQUFjO0FBQUEsVUFDakM7QUFBQSxRQUNGO0FBQUEsUUFDQSxJQUFJO0FBQUEsVUFBRSxlQUFlLFFBQVEsWUFBWSxPQUFPLElBQUksQ0FBQyxDQUFDO0FBQUEsVUFBSyxNQUFNO0FBQUEsUUFDakUsSUFBSTtBQUFBLFVBQVEsT0FBTyxjQUFjO0FBQUEsUUFDakMsV0FBVyxNQUFNO0FBQUEsVUFBRSxJQUFJO0FBQUEsWUFBRSxTQUFTLE9BQU87QUFBQSxZQUFLLE1BQU07QUFBQSxXQUFvQixHQUFHO0FBQUEsU0FDMUUsSUFBSTtBQUFBO0FBQUEsS0FJSCxZQUFZO0FBQUEsTUFDaEIsTUFBTSxRQUFRO0FBQUEsTUFDZCxhQUFhO0FBQUEsTUFDYixXQUFXLEtBQUsscUJBQXFCLE9BQU8sQ0FBQztBQUFBLFFBQUcsWUFBWSxDQUFDO0FBQUEsTUFDN0QsT0FBTztBQUFBLE1BQ1AsZUFBZTtBQUFBLE1BQ1YsY0FBYztBQUFBLE1BQ2Qsb0JBQW9CO0FBQUEsTUFDcEIsV0FBVztBQUFBLE1BQ2hCLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLG1CQUFtQjtBQUFBLE1BQ25CLFFBQVEsSUFBSSxLQUFLLFNBQVMsRUFBQyxhQUFhLElBQUksVUFBVSxVQUFVLFNBQVMsT0FBTSxDQUFDO0FBQUEsT0FDL0U7QUFBQSxLQUNGOyIsCiAgImRlYnVnSWQiOiAiMUQ2NThDODMyN0IzM0M5QjY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
