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
      quietSaves: false,
      bundleSkills: true
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
      if (lastSelectorSel || m.parentUid) {
        actions.append(actionBtn("unlink", "Detach from its capture — make this a standalone comment", () => {
          snapshot();
          delete m.parentUid;
          m.detached = true;
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
            detached: { type: "boolean" },
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
      if (prefs.bundleSkills && BUNDLED_SKILLS_PRESENT) {
        const loaded = await Promise.all(BUNDLED_SKILL_FILES.map(async (f) => ({ f, data: await loadBundledSkillFile(f.ext) })));
        let skipped = 0;
        for (const { f, data } of loaded) {
          if (data == null) {
            skipped++;
            continue;
          }
          tarEntries.push({ name: f.archive, data });
        }
        if (skipped)
          console.warn(LOG, `bundled skills: ${skipped}/${loaded.length} files missing from this build — export continues without them`);
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
      { id: "export-zip", label: "Export workspace as .tar.zst (JSONL + screenshots + DuckDB + README)", run: () => void onExportZip() },
      { id: "copy-path", label: "Copy path of last export", run: () => void onCopyPath() },
      { id: "duckdb", label: "Generate DuckDB query snippet (SQL recipes)", run: () => void onDuckDbSnippet() },
      { id: "import", label: "Import JSONL file", run: onImport },
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
    const showTip = (target) => {
      const text = target.getAttribute("data-tip");
      if (!text)
        return;
      tooltipEl.textContent = text;
      tooltipEl.dataset.shown = "true";
    };
    const hideTip = () => {
      tipFor = null;
      tooltipEl.textContent = TIP_IDLE;
      tooltipEl.dataset.shown = "false";
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
        case "reattach":
          onReattach();
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

//# debugId=ECF11B710874053564756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3R5cGVzLnRzIiwgInNyYy9sdWNpZGUudHMiLCAic3JjL3Rhci50cyIsICJzcmMvdGVtcGxhdGVzLmdlbi50cyIsICJzcmMvYnVuZGxlZC1za2lsbHMuZ2VuLnRzIiwgInNyYy9leHBvcnQtY2FwdHVyZS5tanMiLCAic3JjL3NpZGVwYW5lbC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICIvLyBTaGFyZWQgdHlwZXMgJiBtZXNzYWdlIHByb3RvY29sIGJldHdlZW4gY29udGVudCBzY3JpcHQsIHNpZGUgcGFuZWwsIGFuZFxuLy8gYmFja2dyb3VuZCBzZXJ2aWNlIHdvcmtlci5cblxuZXhwb3J0IHR5cGUgUmVjdCA9IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgVmlld3BvcnQgPSB7XG4gIHc6IG51bWJlcjsgaDogbnVtYmVyOyBkcHI6IG51bWJlcjtcbiAgLy8gVXNlci1wcmVmZXJlbmNlIG1lZGlhLXF1ZXJ5IHN0YXRlIGF0IGNhcHR1cmUgdGltZS4gTGV0cyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYXNvbiBhYm91dCB3aHkgY2FwdHVyZWQgYXBwZWFyYW5jZSBkaWZmZXJzIGJldHdlZW4gc2Vzc2lvbnNcbiAgLy8gKGUuZy4gZGFyay1tb2RlIHZzIGxpZ2h0LW1vZGUgb2YgdGhlIHNhbWUgY29tcG9uZW50KS5cbiAgY29sb3JTY2hlbWU/OiAnZGFyaycgfCAnbGlnaHQnO1xuICByZWR1Y2VkTW90aW9uPzogYm9vbGVhbjtcbiAgLy8gRG9jdW1lbnQgZGlyZWN0aW9uIChgbHRyYCAvIGBydGxgKSDigJQgZGlmZmVyZW50IGZyb20gdmlld3BvcnQgc2l6ZSxcbiAgLy8gY2hhbmdlcyB0aGUgbWVhbmluZyBvZiBgc3RhcnRgL2BlbmRgIGluIENTUyBhbmQgdGhlIHNlbnNlIG9mXG4gIC8vIGByZWN0LnhgLiBDYXB0dXJlZCBwZXIgcGFnZSBoZWFkZXIgc28gUlRMIGNhcHR1cmVzIGRvbid0IGdldFxuICAvLyBzaWxlbnRseSBtaXhlZCB3aXRoIExUUiBvbmVzLlxuICBkaXJlY3Rpb24/OiAnbHRyJyB8ICdydGwnO1xuICAvLyBCcm93c2VyIHpvb20gbGV2ZWwuIGB2aXN1YWxWaWV3cG9ydC5zY2FsZWAgcmVwb3J0cyB0aGUgcGluY2gtem9vbVxuICAvLyBmYWN0b3I7IHZhbHVlcyAhPSAxIG1lYW4gdGhlIHVzZXIgaGFzIHpvb21lZCBpbi9vdXQgYW5kIGFueSBsYXlvdXRcbiAgLy8gYnVnIHRoZXkncmUgY2FwdHVyaW5nIG1heSBub3QgcmVwcm8gYXQgZGVmYXVsdCB6b29tLlxuICB6b29tPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgRnJhbWV3b3JrSW5mbyA9IHtcbiAgZnJhbWV3b3JrOiAncmVhY3QnIHwgJ3Z1ZScgfCAnbGl0JyB8ICdzdGVuY2lsJyB8ICdzdmVsdGUnIHwgJ3dlYi1jb21wb25lbnQnO1xuICBuYW1lPzogc3RyaW5nO1xuICBkaXNwbGF5TmFtZT86IHN0cmluZztcbiAgc291cmNlPzoge2ZpbGU/OiBzdHJpbmcgfCBudWxsOyBsaW5lPzogbnVtYmVyIHwgbnVsbH07XG4gIC8vIFVwLXRyZWUgY29tcG9uZW50IGFuY2VzdHJ5IChpbm5lcm1vc3QgZmlyc3QpLiBGb3IgUmVhY3QsIHdhbGtlZCB2aWFcbiAgLy8gZmliZXIgYHJldHVybmAgY2hhaW47IGZvciBWdWUsIHZpYSBgX192dWVQYXJlbnRDb21wb25lbnQucGFyZW50YC5cbiAgLy8gVGhlIGNvbXBvbmVudCBuYW1lIGFsb25lIGRvZXNuJ3QgdGVsbCBhbiBhZ2VudCB3aGljaCBmaWxlIG93bnMgdGhlXG4gIC8vIHJlbmRlcmluZyDigJQgdGhlIGNoYWluIGhlbHBzIGl0IGdyZXAgdXB3YXJkIHRvIGZpbmQgdGhlIHJvdXRlXG4gIC8vIGNvbXBvbmVudCwgdGhlbiBkcmlsbCBpbnRvIHRoZSBvd25pbmcgZmlsZS5cbiAgY2hhaW4/OiBzdHJpbmdbXTtcbn07XG5cbmV4cG9ydCB0eXBlIEFuY2VzdG9yID0ge1xuICB0YWc6IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7XG4gIHJvbGU/OiBzdHJpbmc7XG4gIHRlc3RJZD86IHN0cmluZztcbiAgY2xhc3Nlcz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgTWF0Y2hlZFJ1bGUgPSB7XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIGRlY2xhcmF0aW9ucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIG1lZGlhPzogc3RyaW5nO1xuICAvLyBXYXMgdGhlIEBtZWRpYSBxdWVyeSB0aGF0IHdyYXBzIHRoaXMgcnVsZSBhY3R1YWxseSBtYXRjaGVkIGF0XG4gIC8vIGNhcHR1cmUgdGltZT8gYHRydWVgID0gYWN0aXZlLFxuICAvLyBgZmFsc2VgID0gbWF0Y2hlZCB0aGUgc2VsZWN0b3IgYnV0IGluYWN0aXZlIChlLmcuIG1vYmlsZSBydWxlc1xuICAvLyBjYXB0dXJlZCBvbiBhIGRlc2t0b3Agdmlld3BvcnQpLCBgdW5kZWZpbmVkYCA9IG1hdGNoTWVkaWEgdGhyZXcuXG4gIG1lZGlhQWN0aXZlPzogYm9vbGVhbjtcbn07XG5cbi8vIFN5bnRoZXRpYyBoaW50cyBQaW5jaEdyYWIgYWRkcyB0byBlbnRyaWVzIOKAlCBrZXB0IGRpc3RpbmN0IGZyb20gYGF0dHJzYFxuLy8gKHJlYWwgRE9NIGF0dHJpYnV0ZXMpIHNvIGNvbnN1bWVycyBjYW4gdGVsbCB3aGF0IGNhbWUgZnJvbSB0aGUgcGFnZSB2c1xuLy8gd2hhdCB0aGUgY2FwdHVyZSBwaXBlbGluZSBpbmplY3RlZC5cbmV4cG9ydCB0eXBlIEVudHJ5SGludHMgPSB7XG4gIGZvcm1hdD86IHN0cmluZzsgICAgIC8vIGlucHV0IGZvcm1hdCBoaW50IChlLmcuICdZWVlZLU1NLUREJylcbiAgdmFsdWVNYXNrZWQ/OiBib29sZWFuOyAvLyBwYXNzd29yZCB2YWx1ZSB3YXMgbWFza2VkIGF0IGNhcHR1cmUgdGltZVxufTtcblxuZXhwb3J0IHR5cGUgRW50cnkgPSB7XG4gIC8vIFN0YWJsZSBwZXItZW50cnkgdXVpZC4gR2VuZXJhdGVkIGF0IGNhcHR1cmUgdGltZS4gRGlzdGluY3QgZnJvbSBgbmBcbiAgLy8gKGRpc3BsYXkgc2VxdWVuY2UpIGFuZCBmcm9tIGBpZGAgKERPTSBodG1sIGlkIGF0dHJpYnV0ZSkuIEZvcmVpZ24ta2V5XG4gIC8vIHRhcmdldCBmb3IgRmVlZGJhY2tNZXNzYWdlLnBhcmVudElkLlxuICB1aWQ6IHN0cmluZztcbiAgLy8gRm9yZWlnbiBrZXkgaW50byB0aGUgc2Vzc2lvbiByb3cgKFBhZ2VNZXNzYWdlLnNlc3Npb25JZCkuIExldHMgYVxuICAvLyBjb25zdW1lciBsaW5rIGNhcHR1cmVzIGJhY2sgdG8gXCJ3aGljaCBwYWdlLWxvYWQgY29udGV4dCBkaWQgdGhleVxuICAvLyBjb21lIGZyb20/XCIgd2l0aG91dCBkZXBlbmRpbmcgb24gVVJMIHN0cmluZyBlcXVhbGl0eSwgd2hpY2ggYnJlYWtzXG4gIC8vIG9uIGhhc2ggbmF2aWdhdGlvbiwgcXVlcnktcGFyYW0gc3dhcHMsIGFuZCBTUEEgcm91dGluZy4gU2V0IGJ5IHRoZVxuICAvLyBzaWRlIHBhbmVsIGF0IG1lc3NhZ2UtcmVjZWl2ZSB0aW1lLCBub3Qgb24gdGhlIHBhZ2Ugc2lkZS5cbiAgc2Vzc2lvbklkPzogc3RyaW5nO1xuICBuOiBudW1iZXI7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0YWc6IHN0cmluZztcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgb3V0ZXJIVE1MPzogc3RyaW5nO1xuICB0ZXh0Pzogc3RyaW5nO1xuICAvLyBUaGUgdmlzdWFsbHktcmVuZGVyZWQgZm9ybSB3aGVuIENTUyBgdGV4dC10cmFuc2Zvcm1gIGlzIHNldC4gQ2FwdHVyZWRcbiAgLy8gYWxvbmdzaWRlIGB0ZXh0YCAod2hpY2ggaXMgdGhlIHNvdXJjZS10cnV0aCBgdGV4dENvbnRlbnRgKSBzbyBhbiBMTE1cbiAgLy8gY2FuIGRpc2FtYmlndWF0ZSBiZXR3ZWVuIGUuZy4gc291cmNlIGBSZWZyZXNoYCBhbmQgcmVuZGVyZWQgYFJFRlJFU0hgXG4gIC8vIHdpdGhvdXQgZmFsc2UtZ3JlcHBpbmcgYWdhaW5zdCBlaXRoZXIuXG4gIHJlbmRlcmVkVGV4dD86IHN0cmluZztcbiAgcm9sZT86IHN0cmluZztcbiAgYWNjZXNzaWJsZU5hbWU/OiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nOyAgICAgICAgICAgIC8vIHRoZSBET00gaHRtbCBpZCBhdHRyaWJ1dGUgKHVuY2hhbmdlZClcbiAgdGVzdElkPzogc3RyaW5nO1xuICBjbGFzc2VzPzogc3RyaW5nW107XG4gIGF0dHJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgLy8gcmVhbCBET00gYXR0cmlidXRlcyBvbmx5XG4gIGhpbnRzPzogRW50cnlIaW50czsgICAgIC8vIHN5bnRoZXRpYyBjYXB0dXJlLXRpbWUgaGludHNcbiAgcmVjdDogUmVjdDtcbiAgdmlld3BvcnQ6IFZpZXdwb3J0O1xuICBpblNoYWRvd0RPTT86IGJvb2xlYW47XG4gIC8vIENTUyBzZWxlY3RvciBmb3IgdGhlIHNoYWRvdyBob3N0IHdoZW4gYGluU2hhZG93RE9NYCBpcyB0cnVlLiBMZXRzIGFcbiAgLy8gY29uc3VtZXIgKG9yIHRoZSBwYW5lbCdzIHJlLXZhbGlkYXRpb24gcGFzcykgZmluZCB0aGUgaG9zdCBlbGVtZW50XG4gIC8vIHNpbmNlIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsYCBkb2Vzbid0IHBpZXJjZSBzaGFkb3cgcm9vdHMuXG4gIHNoYWRvd0hvc3Q/OiBzdHJpbmc7XG4gIGNvbXBvbmVudFJvb3Q/OiBzdHJpbmc7XG4gIGFuY2VzdG9ycz86IEFuY2VzdG9yW107XG4gIGNvbXBvbmVudD86IEZyYW1ld29ya0luZm87XG4gIC8vIFJlYWN0IGV2ZW50IGhhbmRsZXIgbmFtZXMgcHJvYmVkIGZyb20gYF9fcmVhY3RQcm9wcyQ8a2V5PmAg4oCUIGFuc3dlcnNcbiAgLy8gXCJ3aGljaCBoYW5kbGVyIGZpcmVzIHdoZW4gdGhpcyBpcyBjbGlja2VkP1wiIHdpdGhvdXQgYW4gTExNIGhhdmluZyB0b1xuICAvLyBncmVwIHRoZSBjb2RlYmFzZS4gSW4gZGV2IGJ1aWxkcyB0aGVzZSBhcmUgcmVhbCBmdW5jdGlvbiBuYW1lczsgaW5cbiAgLy8gcHJvZCB0aGV5J3JlIG1pbmlmaWVkIGJ1dCBzdGlsbCBhbmNob3ItYWJsZS5cbiAgZXZlbnRzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gaHRteCAvIFN0aW11bHVzIC8gQWxwaW5lIC8gVHVyYm8gd2lyaW5nIG9uIHRoZSBlbGVtZW50LiBTZXJ2ZXItXG4gIC8vIHJlbmRlcmVkIGFwcHMgZG9uJ3QgaGF2ZSBSZWFjdCBmaWJlcnMg4oCUIGZvciB0aGVtLCB0aGlzIElTIHRoZVxuICAvLyBjb21wb25lbnQgc2hhcGUuXG4gIGJlaGF2aW9yQXR0cnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBUcnVlIHdoZW4gYGVsLmdldEFuaW1hdGlvbnMoKWAgcmVwb3J0ZWQgYW4gYWN0aXZlbHktcGxheWluZ1xuICAvLyBhbmltYXRpb24gYXQgY2FwdHVyZSB0aW1lLiBUZWxscyB0aGUgY29uc3VtZXIgdGhhdCBjYXB0dXJlZCByZWN0IC9cbiAgLy8gdHJhbnNmb3JtIC8gb3BhY2l0eSBtYXkgYmUgYXQgYW4gaW50ZXJwb2xhdGVkIG1pZC1hbmltYXRpb24gdmFsdWUuXG4gIGlzQW5pbWF0aW5nPzogYm9vbGVhbjtcbiAgLy8gRm9yIGVsZW1lbnRzIHJlbmRlcmVkIGludG8gYSBgPGNhbnZhcz5gLCB0aGUgRE9NIGdpdmVzIHVzIGVzc2VudGlhbGx5XG4gIC8vIG5vdGhpbmcgYWJvdXQgd2hhdCB3YXMgY2xpY2tlZCDigJQgdGhlIGNhbnZhcyBoYXMgbm8gY2hpbGRyZW4sIG5vXG4gIC8vIHRleHQsIG5vIG1lYW5pbmdmdWwgc2VsZWN0b3JzIGJlbG93IHRoZSBjYW52YXMgaXRzZWxmLiBDYXB0dXJlIHRoZVxuICAvLyBjbGljayBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY2FudmFzJ3MgYm91bmRpbmcgYm94IHNvIGEgZG93bnN0cmVhbVxuICAvLyBjb25zdW1lciBjYW4gY29ycmVsYXRlIChlLmcuIGFnYWluc3QgYSBEYXRhZG9nIC8gVGFibGVhdSAvIGNoYXJ0aW5nXG4gIC8vIGxpYnJhcnkgdGhhdCBleHBvc2VzIGRhdGEtcG9pbnQgY29vcmRpbmF0ZXMpLiBDb29yZGluYXRlcyBhcmUgQ1NTXG4gIC8vIHBpeGVsczsgbXVsdGlwbHkgYnkgYHZpZXdwb3J0LmRwcmAgdG8gZ2V0IGRldmljZSBwaXhlbHMuXG4gIGNhbnZhc0NsaWNrPzoge1xuICAgIG9mZnNldFg6IG51bWJlcjtcbiAgICBvZmZzZXRZOiBudW1iZXI7XG4gICAgY2FudmFzVzogbnVtYmVyO1xuICAgIGNhbnZhc0g6IG51bWJlcjtcbiAgICBjYW52YXNTZWxlY3Rvcjogc3RyaW5nO1xuICB9O1xuICAvLyBDb250ZW50ZWRpdGFibGUgcmljaC10ZXh0IGVkaXRvciBjb250ZXh0LiBQb3B1bGF0ZWQgd2hlbiB0aGUgY2FwdHVyZWRcbiAgLy8gbm9kZSBpcywgb3IgbGl2ZXMgaW5zaWRlLCBhIGBbY29udGVudGVkaXRhYmxlPXRydWVdYCBhbmNlc3Rvci4gTGV0c1xuICAvLyBhbiBMTE0gcmVhc29uaW5nIGFib3V0IGEgXCJjb3B5IGlzIHdyb25nXCIgLyBcInRoZSBlZGl0b3IgYnJlYWtzIHdoZW4gWFwiXG4gIC8vIGNhcHR1cmUga25vdyB3aGljaCBlZGl0b3IgbGlicmFyeSB0byBsb29rIGF0IOKAlCBzZWxlY3RvcnMgZ2VuZXJhdGVkXG4gIC8vIGJ5IFByb3NlTWlycm9yIC8gTGV4aWNhbCAvIGV0YyBhcmUgcnVudGltZS1pbnRlcm5hbCBhbmQgd29uJ3QgZ3JlcFxuICAvLyBhZ2FpbnN0IHVzZXIgY29kZSwgYnV0IHRoZSBMSUJSQVJZIHBvaW50ZXIgcm91dGVzIHRoZSBMTE0gdG8gdGhlXG4gIC8vIHJpZ2h0IHdyYXBwZXIgY29tcG9uZW50LlxuICBlZGl0b3I/OiB7XG4gICAga2luZDogJ3Byb3NlbWlycm9yJyB8ICdsZXhpY2FsJyB8ICdzbGF0ZScgfCAncXVpbGwnIHwgJ3RpcHRhcCcgfCAnbmF0aXZlJztcbiAgICByb290U2VsZWN0b3I6IHN0cmluZztcbiAgICBjb250ZW50TGVuZ3RoOiBudW1iZXI7XG4gIH07XG4gIC8vIExhc3QgZmV3IERPTSBtdXRhdGlvbnMgQkVGT1JFIHRoZSBjbGljay4gUmVwcm8gY29udGV4dCBmb3IgYnVncyBsaWtlXG4gIC8vIFwiSSBjbGlja2VkIHRoZSB3cm9uZyBkcm9wZG93biBvcHRpb25cIiBvciBcInRoZSB2YWx1ZSBmbGlja2VyZWQgYmVmb3JlXG4gIC8vIEkgY2xpY2tlZCBpdFwiIOKAlCB3aXRob3V0IHRoaXMsIHRoZSBKU09OIHNuYXBzaG90cyBvbmx5IHRoZSBwb3N0LVxuICAvLyBtdXRhdGlvbiBzdGF0ZSwgbGVhdmluZyB0aGUgTExNIGJsaW5kIHRvIHdoYXQgdHJpZ2dlcmVkIHRoZVxuICAvLyBhcHBlYXJhbmNlIHRoZSB1c2VyIGNvbXBsYWluZWQgYWJvdXQuIFBpbmNoZ3JhYiBrZWVwcyBhbiA4LXNlY29uZFxuICAvLyByaW5nIGJ1ZmZlciBvZiBtdXRhdGlvbiByZWNvcmRzOyBjYXB0dXJlIGF0dGFjaGVzIHRoZSBtb3N0IHJlY2VudFxuICAvLyAzIGFzIGEgc25hcHNob3QuXG4gIGRvbU11dGF0aW9ucz86IERvbU11dGF0aW9uW107XG4gIHN0YXRlcz86IHN0cmluZ1tdOyAgICAgIC8vIGFjdGl2ZSBwc2V1ZG8tY2xhc3NlcyAod2FzIFJlY29yZDxzdHJpbmcsIHRydWU+IGluIHYxKVxuICAvLyBMb2NhdG9yIHF1YWxpdHk6IGhvdyBtYW55IGVsZW1lbnRzIGBzZWxlY3RvcmAgcmVzb2x2ZXMgdG8gaW4gaXRzXG4gIC8vIHNjb3BlICgxID0gdW5pcXVlKS4gSGlnaGVyIG1lYW5zIHRoZSBzZWxlY3RvciBpcyBhbWJpZ3VvdXMuXG4gIHNlbGVjdG9yTWF0Y2hDb3VudD86IG51bWJlcjtcbiAgLy8gRGlzYW1iaWd1YXRlZCBvcmRlcmluZyBmaWVsZHMuXG4gIC8vIGBuYCBpcyBwcmVzZXJ2ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXQgKGl0J3MgdGhlIGNhcHR1cmUtc2VxdWVuY2VcbiAgLy8gZGlzcGxheSBsYWJlbCBpbiB0aGUgc2lkZWJhcikuIFRoZSBuZXcgZmllbGRzIGFyZSBlbWl0LXRpbWUgb25seTpcbiAgLy8gICDigKIgY2FwdHVyZUluZGV4IOKAlCBzYW1lIGFzIGBuYCAoY2FwdHVyZSBzZXF1ZW5jZSB3aXRoaW4gc2Vzc2lvbilcbiAgLy8gICDigKIgZXZlbnRJbmRleCAgIOKAlCBtb25vdG9uaWMgcG9zaXRpb24gaW4gdGhlIEpTT05MIHN0cmVhbVxuICAvLyAgIOKAoiB2aXN1YWxPcmRlciAg4oCUIHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0IHJhbmsgd2l0aGluIHRoZSBwYWdlXG4gIC8vICAg4oCiIGRpc3BsYXlMYWJlbCDigJQgaHVtYW4tZmFjaW5nIGxhYmVsIChtaXJyb3JzIGBuYCB0b2RheSlcbiAgY2FwdHVyZUluZGV4PzogbnVtYmVyO1xuICBldmVudEluZGV4PzogbnVtYmVyO1xuICB2aXN1YWxPcmRlcj86IG51bWJlcjtcbiAgZGlzcGxheUxhYmVsPzogc3RyaW5nO1xuICAvLyBHcm91cCBmbGF0dGVuaW5nIGZpZWxkcy5cbiAgLy8gVGhlIGdyb3VwIGhlYWQgY2FycmllcyBgZ3JvdXBNZW1iZXJVaWRzYCAoanVzdCB0aGUgSURzKTsgZWFjaFxuICAvLyBtZW1iZXIgZW1pdHMgYXMgaXRzIG93biB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZ1xuICAvLyBiYWNrIGF0IHRoZSBoZWFkLlxuICBncm91cE1lbWJlclVpZHM/OiBzdHJpbmdbXTtcbiAgZ3JvdXBVaWQ/OiBzdHJpbmc7XG4gIC8vIExpZ2h0d2VpZ2h0IGExMXkgYXVkaXQgY2FwdHVyZWQgYXQgY2xpY2sgdGltZS4gSGVhdmllciBjaGVja3NcbiAgLy8gKGZvY3VzLXZpc2libGUgc2NyZWVuc2hvdHMsIGF4ZSB2aW9sYXRpb25zKSBhcmUgbm90IHlldCB3aXJlZC5cbiAgYTExeT86IHtcbiAgICBjb250cmFzdFJhdGlvPzogbnVtYmVyO1xuICAgIGNvbnRyYXN0UGFzc2VzPzogJ0FBJyB8ICdBQUEnIHwgJ2ZhaWwnO1xuICAgIHRhYmJhYmxlPzogYm9vbGVhbjtcbiAgICBmb2N1c1Zpc2libGU/OiBib29sZWFuO1xuICB9O1xuICAvLyBQYXJlbnQgbGF5b3V0IGNvbnRleHQg4oCUIGZsZXgvZ3JpZC9vdmVyZmxvdy9zY3JvbGwvc3RhY2tpbmdcbiAgLy8gYW5jZXN0b3JzIHRoYXQgc2hhcGUgdGhlIGNhcHR1cmVkIGVsZW1lbnQncyBhcHBlYXJhbmNlLlxuICBsYXlvdXRDb250ZXh0PzogQXJyYXk8e1xuICAgIHRhZzogc3RyaW5nO1xuICAgIGRpc3BsYXk/OiBzdHJpbmc7XG4gICAgcG9zaXRpb24/OiBzdHJpbmc7XG4gICAgb3ZlcmZsb3c/OiBzdHJpbmc7XG4gICAgekluZGV4Pzogc3RyaW5nO1xuICAgIHRyYW5zZm9ybT86IHN0cmluZztcbiAgICB3aWxsQ2hhbmdlPzogc3RyaW5nO1xuICAgIGlzU2Nyb2xsQ29udGFpbmVyPzogYm9vbGVhbjtcbiAgICBzY3JvbGxMZWZ0PzogbnVtYmVyO1xuICAgIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgICBmbGV4Pzoge2RpcmVjdGlvbj86IHN0cmluZzsgd3JhcD86IHN0cmluZzsgYWxpZ25JdGVtcz86IHN0cmluZzsganVzdGlmeUNvbnRlbnQ/OiBzdHJpbmc7IGdhcD86IHN0cmluZ307XG4gICAgZ3JpZD86IHt0ZW1wbGF0ZUNvbHVtbnM/OiBzdHJpbmc7IHRlbXBsYXRlUm93cz86IHN0cmluZzsgZ2FwPzogc3RyaW5nfTtcbiAgfT47XG4gIC8vIEFzc2V0IHJlZmVyZW5jZXMgaW5zaWRlIHRoZSBjYXB0dXJlZCBzdWJ0cmVlIChpbWcgc3JjLCA8dXNlIGhyZWY+LFxuICAvLyBiYWNrZ3JvdW5kLWltYWdlIHVybCkuIFdoZW4gYSBjb21wbGFpbnQgaXMgYWJvdXQgYSBsb2dvIC8gaWNvbiAvXG4gIC8vIGFydHdvcmssIGFuIGFnZW50IHdpdGhvdXQgdGhlc2UgcmVmZXJlbmNlcyB3b3VsZCBiZSBsZWZ0IGd1ZXNzaW5nLlxuICBhc3NldHM/OiBBcnJheTx7XG4gICAgc3JjOiBzdHJpbmc7XG4gICAgbmF0dXJhbFc/OiBudW1iZXI7IG5hdHVyYWxIPzogbnVtYmVyO1xuICAgIHJlbmRlcmVkVz86IG51bWJlcjsgcmVuZGVyZWRIPzogbnVtYmVyO1xuICAgIGFsdD86IHN0cmluZztcbiAgICBsb2FkZWQ/OiBib29sZWFuO1xuICB9PjtcbiAgc3R5bGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgbWF0Y2hlZFJ1bGVzPzogTWF0Y2hlZFJ1bGVbXTtcbiAgcHNldWRvRWxlbWVudHM/OiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PjtcbiAgLy8gVHJ1bmNhdGlvbiBtYXJrZXJzIOKAlCBwcmVzZW50IHdoZW4gY2FwdHVyZSBoYWQgdG8gZWxpZGUgY29udGVudC4gTGV0c1xuICAvLyBhIGNvbnN1bWVyIGRldGVjdCBcInRoaXMgZW50cnkgd2FzIGN1dCBkb3duXCIgYW5kIHJlZmV0Y2ggZnJvbSB0aGVcbiAgLy8gbGl2ZSBwYWdlIGlmIGl0IG5lZWRzIHRoZSBmdWxsIHZlcnNpb24uXG4gIC8vICAgb3V0ZXJIVE1MIOKAlCBvcmlnaW5hbCBodG1sIGxlbmd0aCBiZWZvcmUgdGhlIHNpemUtY2FwIGtpY2tlZCBpbi5cbiAgLy8gICBjaGlsZHJlbiAg4oCUIG51bWJlciBvZiBkZXNjZW5kYW50IHN1YnRyZWVzIHJlcGxhY2VkIGJ5IGRlcHRoLWNhcFxuICAvLyAgICAgICAgICAgICAgIGVsaXNpb24gbWFya2VycyAoYDwhLS0gTiBjaGlsZHJlbiBlbGlkZWQgLS0+YCkuXG4gIHRydW5jYXRlZD86IHtvdXRlckhUTUw/OiBudW1iZXI7IGNoaWxkcmVuPzogbnVtYmVyOyB0ZXh0PzogbnVtYmVyfTtcbiAgLy8gR3JvdXAgb2YgYWRkaXRpb25hbCBjYXB0dXJlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBlbnRyeSAoQWx0K1NoaWZ0K0NsaWNrXG4gIC8vIC8gQWx0K2RyYWcgc2VsZWN0aW9ucyBjb2xsYXBzZSBoZXJlKS5cbiAgZ3JvdXA/OiBFbnRyeVtdO1xuICAvLyBPcHRpb25hbCBzY3JlZW5zaG90IGJ1bmRsZTogZWFjaCBmaWVsZCBpcyBhIHJlbGF0aXZlIHBhdGggdW5kZXIgdGhlXG4gIC8vIHVzZXIncyBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8gcm9vdC4gVGhlIGNhcHR1cmVkQXQgc3RhbXAgaXNcbiAgLy8gdGhlIElTTyB0aW1lc3RhbXAgd2hlbiB0aGUgc2hvdCB3YXMgdGFrZW4uXG4gIHNjcmVlbnNob3Q/OiB7XG4gICAgZWxlbWVudD86IHN0cmluZztcbiAgICBncm91cD86IHN0cmluZztcbiAgICBwYWdlPzogc3RyaW5nO1xuICAgIGNhcHR1cmVkQXQ/OiBzdHJpbmc7XG4gICAgLy8gQW4gZW1wdHkgYHNjcmVlbnNob3RgIGZpZWxkIGNvdWxkIG1lYW4gXCJub3QgeWV0IHNob3RcIiwgXCJmYWlsZWRcIixcbiAgICAvLyBvciBcInNraXBwZWQgb24gcHVycG9zZVwiLiBXaGVuIHRoZSBwaXBlbGluZSBkZWNsaW5lcyBvciBmYWlscyxcbiAgICAvLyBzZXQgdGhpcyBzbyByZWNlaXZlcnMga25vdyBpdCdzIG5vdCBhIHJldHJ5IGNhbmRpZGF0ZS5cbiAgICB1bmF2YWlsYWJsZVJlYXNvbj86ICdhdXRvU2NyZWVuc2hvdE9mZicgfCAnc2tpcFNjcmVlbnNob3RIb3N0cycgfCAnY2FwdHVyZUZhaWxlZCcgfCAncGVybWlzc2lvbkRlbmllZCcgfCBzdHJpbmc7XG4gICAgLy8gQ3JvcCBtZXRhZGF0YSBkZXNjcmliaW5nIHdoZXJlIHRoZSBjcm9wcGVkIFBORyBmaXRzIGluIHRoZVxuICAgIC8vIG9yaWdpbmFsIHBhZ2UgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgY3JvcD86IHtcbiAgICAgIGNzc1JlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgICAgZGV2aWNlUHhSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICAgIGRwcjogbnVtYmVyO1xuICAgICAgcGFkZGluZzogbnVtYmVyO1xuICAgICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgICB9O1xuICB9O1xufTtcblxuLy8gRnVsbC1wYWdlIHNjcmVlbnNob3QgKyBwYWdlIG1ldGFkYXRhLCBlbWl0dGVkIG9uY2UgcGVyIGRpc3RpbmN0IHBhZ2UgVVJMXG4vLyBpbnZvbHZlZCBpbiBjYXB0dXJlcyAoZGVkdXBlZCBieSBVUkwpLiBgc2NyZWVuc2hvdGAgaXMgYSBQTkcgZGF0YSBVUkwuXG4vLyBgcGFydGlhbGAgaXMgc2V0IHdoZW4gb25seSB0aGUgdmlld3BvcnQgY291bGQgYmUgY2FwdHVyZWQgKGZ1bGwtcGFnZSBzdGl0Y2hcbi8vIHVuYXZhaWxhYmxlKSDigJQgc2VlIGJhY2tncm91bmQudHMgc3RpdGNoUGFnZSBsaW1pdGF0aW9ucy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdCA9IHsgdXJsOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmc7IGNhcHR1cmVkQXQ6IHN0cmluZzsgdmlld3BvcnQ6IHt3aWR0aDogbnVtYmVyO2hlaWdodDogbnVtYmVyfTsgc2Nyb2xsV2lkdGg6IG51bWJlcjsgc2Nyb2xsSGVpZ2h0OiBudW1iZXI7IGRldmljZVBpeGVsUmF0aW86IG51bWJlcjsgbGFuZzogc3RyaW5nOyBzY3JlZW5zaG90OiBzdHJpbmc7IHBhcnRpYWw/OiBib29sZWFuIH07XG5cbmV4cG9ydCB0eXBlIERvbU11dGF0aW9uID0ge1xuICB0eXBlOiAnY2hpbGRMaXN0JyB8ICdhdHRyaWJ1dGVzJyB8ICdjaGFyYWN0ZXJEYXRhJztcbiAgdHM6IHN0cmluZzsgICAgICAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgbXV0YXRpb24gZmlyZWRcbiAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAvLyBjb21wYWN0IGRlc2NyaXB0b3Igb2YgdGhlIG11dGF0aW9uJ3MgdGFyZ2V0IChgdGFnI2lkLmNsc2ApXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG4gIG9sZFZhbHVlPzogc3RyaW5nOyAgICAgLy8gdHJ1bmNhdGVkLCB3aXRoIHNlY3JldC1zaGFwZWQgbmFtZXMgcmVkYWN0ZWRcbiAgbmV3VmFsdWU/OiBzdHJpbmc7ICAgICAvLyB0cnVuY2F0ZWQsIHdpdGggc2VjcmV0LXNoYXBlZCBuYW1lcyByZWRhY3RlZFxuICBhZGRlZD86IG51bWJlcjsgICAgICAgIC8vIGNoaWxkTGlzdDogY291bnQgb2YgYWRkZWQgbm9kZXNcbiAgcmVtb3ZlZD86IG51bWJlcjsgICAgICAvLyBjaGlsZExpc3Q6IGNvdW50IG9mIHJlbW92ZWQgbm9kZXNcbiAgc3VtbWFyeT86IHN0cmluZzsgICAgICAvLyBvbmUtbGluZSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvblxufTtcblxuZXhwb3J0IHR5cGUgUGFnZUNvbnRleHQgPSB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogVmlld3BvcnQ7XG4gIHRva2VuczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLy8gQnJvd3NlciArIGxvY2FsZSBmaW5nZXJwcmludCBmb3Igc2Vzc2lvbi1sZXZlbCBjb250ZXh0LiBMZXRzIGFcbiAgLy8gZG93bnN0cmVhbSBjb25zdW1lciBhbnN3ZXIgXCJ3aGljaCBicm93c2VyIHByb2R1Y2VkIHRoaXMgY2FwdHVyZT9cIiBvclxuICAvLyBcIndhcyB0aGUgY2FwdHVyZWQgYXBwIHJlbmRlcmVkIGluIGFuIFJUTCBsb2NhbGU/XCIgd2l0aG91dCByZXJ1bm5pbmcuXG4gIHVzZXJBZ2VudD86IHN0cmluZztcbiAgbGFuZz86IHN0cmluZztcbiAgLy8gR2l0IGJ1aWxkIGlkZW50aXR5LCB3aGVuIHRoZSBjYXB0dXJlZCBhcHAgZXhwb3Nlc1xuICAvLyBgPG1ldGEgbmFtZT1cInBpbmNoZ3JhYi1idWlsZFwiIGNvbnRlbnQ9XCJjb21taXQ6YWJjIGJyYW5jaDptYWluXCI+YC5cbiAgZ2l0Q29udGV4dD86IHtjb21taXQ/OiBzdHJpbmc7IGJyYW5jaD86IHN0cmluZzsgYnVpbGQ/OiBzdHJpbmd9O1xuICAvLyBXaGF0ZXZlciBlbGVtZW50IGhhZCBmb2N1cyBhdCBjYXB0dXJlIHRpbWUsIHBsdXMgYSBoaW50IGFzIHRvXG4gIC8vIHdoZXRoZXIgdGhlIHVzZXIgbmF2aWdhdGVkIHRoZXJlIHdpdGggdGhlIGtleWJvYXJkIChUYWIgLyBTaGlmdCtUYWJcbiAgLy8gcHJlc3NlZCBpbiB0aGUgbGFzdCBzZWNvbmQpLiBVc2VmdWwgZm9yIGFjY2Vzc2liaWxpdHktYnVnIGNhcHR1cmVzOlxuICAvLyBcInRoaXMgZWxlbWVudCBsb29rcyB3cm9uZyBvbmx5IHdoZW4ga2V5Ym9hcmQtZm9jdXNlZFwiLlxuICBhY3RpdmVGb2N1cz86IHtzZWxlY3Rvcj86IHN0cmluZzsgcmVjZW50bHlUYWJiZWQ/OiBib29sZWFufTtcbn07XG5cbi8vIC0tLS0tLS0tLS0gU2lkZS1wYW5lbCBcIm1lc3NhZ2VzXCIgKFVJIHJvd3MpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgU2VsZWN0b3JNZXNzYWdlID0ge1xuICB0eXBlOiAnc2VsZWN0b3InO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICBlbnRyeTogRW50cnk7XG4gIHBpbm5lZD86IGJvb2xlYW47XG4gIC8vIExlZ2FjeSBmaWVsZCBrZXB0IGFyb3VuZCBiZWNhdXNlIG9sZCB3b3Jrc3BhY2VzIG1heSBzdGlsbCBoYXZlIGl0OyB3ZVxuICAvLyBzdHJpcCBpdCBvbiBjYXB0dXJlLCBidXQgZG9uJ3QgcmVqZWN0IGl0IG9uIGltcG9ydC5cbiAgZHVwZVBlbmRpbmc/OiB1bmtub3duO1xufTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tNZXNzYWdlID0ge1xuICB0eXBlOiAnZmVlZGJhY2snO1xuICBpZDogc3RyaW5nO1xuICB0czogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIC8vIE9wdGlvbmFsIGZvcmVpZ24ga2V5IGludG8gRW50cnkudWlkLiBBZGphY2VuY3kgdG8gYSBwcmVjZWRpbmcgc2VsZWN0b3JcbiAgLy8gaXMgdGhlIGhpc3RvcmljYWwgbGluazsgcGFyZW50SWQgbWFrZXMgaXQgZXhwbGljaXQgYW5kIHN1cnZpdmVzXG4gIC8vIHJlLW9yZGVyaW5nIC8gc3BsaXQtZ3JvdXAgLyBpbXBvcnQtZXhwb3J0IHJvdW5kLXRyaXBzLlxuICBwYXJlbnRVaWQ/OiBzdHJpbmc7XG4gIC8vIFVzZXIgZXhwbGljaXRseSBkZXRhY2hlZCB0aGlzIGNvbW1lbnQgZnJvbSBhbnkgc2VsZWN0b3IuIFdpdGhvdXQgdGhlXG4gIC8vIGZsYWcsIGFkamFjZW5jeSB0byB0aGUgcHJlY2VkaW5nIHNlbGVjdG9yIHdvdWxkIHNpbGVudGx5IHJlLWFkb3B0IHRoZVxuICAvLyBjb21tZW50IGF0IHJlbmRlci9leHBvcnQgdGltZS5cbiAgZGV0YWNoZWQ/OiBib29sZWFuO1xuICB0YWdzPzogc3RyaW5nW107XG4gIC8vIFNldmVyaXR5IChgbm90ZWAgLyBgZml4YCAvIGBibG9ja2ApIHdhcyByZW1vdmVkIGZyb20gdGhlIFVJIGluXG4gIC8vIDIwMjYtMDUuIFRoZSBmaWVsZCBpcyByZXRhaW5lZCBvbiB0aGUgdHlwZSBhcyBgdW5rbm93bmAgc29cbiAgLy8gdG9sZXJhbnQgcmVhZGVycyAoYGRlbm9ybWFsaXplRW50cnlgKSBkb24ndCBkcm9wIHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGxlZ2FjeSBKU09OTCBleHBvcnRzOyBuZXcgc2Vzc2lvbnMgbmV2ZXIgc2V0IGl0LlxuICBzZXZlcml0eT86ICdub3RlJyB8ICdmaXgnIHwgJ2Jsb2NrJztcbn07XG5cbmV4cG9ydCB0eXBlIFBhZ2VNZXNzYWdlID0ge1xuICB0eXBlOiAncGFnZSc7XG4gIGlkOiBzdHJpbmc7XG4gIHRzOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgdmlld3BvcnQ/OiBWaWV3cG9ydDtcbiAgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgdXNlckFnZW50Pzogc3RyaW5nO1xuICBsYW5nPzogc3RyaW5nO1xuICBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307XG4gIC8vIFJvdXRlIGlkZW50aXR5IGJleW9uZCB0aGUgVVJMLiBCZXN0LWVmZm9ydCBicmVha2Rvd24gb2YgcGF0aG5hbWVcbiAgLy8gLyBxdWVyeSAvIGhhc2ggKyBhIGd1ZXNzIGF0IHRoZVxuICAvLyBhY3RpdmUgcm91dGVOYW1lIChgP3JvdXRlPXNldHRpbmdzYCBvciBgIy91c2Vycy80MmAgc3R5bGUpLlxuICByb3V0ZT86IHtcbiAgICBwYXRobmFtZT86IHN0cmluZztcbiAgICBxdWVyeT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgaGFzaD86IHN0cmluZztcbiAgICByb3V0ZU5hbWU/OiBzdHJpbmc7XG4gICAgcm91dGVQYXJhbT86IHN0cmluZztcbiAgfTtcbiAgLy8gUmVkYWN0ZWQgc3RhdGUgc25hcHNob3QuIFN1cmZhY2VzIHRoZSBTSEFQRSBvZiBzdGF0ZSB0aGF0IHByb2R1Y2VkXG4gIC8vIHRoZSBwYWdlIChzdG9yYWdlIGtleXMsIGNvb2tpZSBuYW1lcywgZmVhdHVyZSBmbGFncykgd2l0aG91dFxuICAvLyBsZWFraW5nIHZhbHVlcy4gTGV0cyBhIGRvd25zdHJlYW0gYWdlbnQgcmVwcm9kdWNlIGJ5IHNldHRpbmcgdXAgdGhlXG4gIC8vIHNhbWUga2V5cyB3aXRoIHRoZWlyIG93biBkYXRhLlxuICBzdGF0ZT86IHtcbiAgICBzdG9yYWdlS2V5cz86IHN0cmluZ1tdO1xuICAgIHNlc3Npb25LZXlzPzogc3RyaW5nW107XG4gICAgY29va2llTmFtZXM/OiBzdHJpbmdbXTtcbiAgICBmZWF0dXJlRmxhZ3M/OiBzdHJpbmc7XG4gIH07XG4gIC8vIFNlc3Npb24gdXVpZC4gU3RhYmxlIHBlciB3b3Jrc3BhY2UtYm9vdCDigJQgc2VsZWN0b3IgZW50cmllcyByZWZlcmVuY2VcbiAgLy8gaXQgdmlhIGBFbnRyeS5zZXNzaW9uSWRgIHNvIGEgY29uc3VtZXIgY2FuIGxpbmsgY2FwdHVyZXMgdG8gdGhlaXJcbiAgLy8gc2Vzc2lvbiBoZWFkZXIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmlzb24uXG4gIHNlc3Npb25JZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFBhbmVsTWVzc2FnZSA9IFNlbGVjdG9yTWVzc2FnZSB8IEZlZWRiYWNrTWVzc2FnZSB8IFBhZ2VNZXNzYWdlO1xuXG4vLyAtLS0tLS0tLS0tIElQQyBwYXlsb2FkcyAoQ1Mg4oaUIFBhbmVsIOKGlCBCYWNrZ3JvdW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHR5cGUgQ3NUb1BhbmVsID1cbiAgfCB7a2luZDogJ2NhcHR1cmUnOyBlbnRyeTogRW50cnk7IHBhZ2U6IFBhZ2VDb250ZXh0OyBncm91cGVkPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2hvdmVyJzsgc2VsZWN0b3I6IHN0cmluZzsgdGFnOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJlY3Q6IFJlY3R9XG4gIHwge2tpbmQ6ICdob3Zlci1lbmQnfVxuICB8IHtraW5kOiAncGVuZGluZy1hZGQnOyBlbnRyeTogRW50cnl9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNsZWFyJ31cbiAgLy8gQWRkIGEgZmVlZGJhY2sgcm93IGF0dGFjaGVkIHRvIGEgc2VsZWN0b3IuIFRoZSBsb29rdXAgaXMgYnlcbiAgLy8gY29tcG9zaXRlIGtleSDigJQgc2VsZWN0b3IgKyB1cmwgKyBwYXJlbnRVaWQg4oCUIHNvIGEgY29tbWVudCBvblxuICAvLyBgW2RhdGEtdGVzdGlkPVwiZm9yZWNhc3QtaXRlbVwiXWAgb24gcGFnZSBBIGRvZXNuJ3QgYmxlZWQgaW50byBhXG4gIC8vIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBvbiBwYWdlIEIuIHBhcmVudFVpZCAod2hlbiB0aGVcbiAgLy8gY29udGVudCBzY3JpcHQgY2FuIHN1cHBseSBpdCBmcm9tIHRoZSBhbm5vdGF0aW9uIG92ZXJsYXknc1xuICAvLyBhc3NvY2lhdGVkIGNhcHR1cmUpIGlzIHRoZSBzdHJvbmdlc3QgZGlzYW1iaWd1YXRvcjsgdXJsIGlzIHRoZVxuICAvLyBmYWxsYmFjayB3aGVuIG9ubHkgdGhlIG9uLXBhZ2UgY29tbWVudCBib3ggaXMgaW4gcGxheS5cbiAgfCB7a2luZDogJ2ZlZWRiYWNrLWFkZCc7IHNlbGVjdG9yOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgdXJsPzogc3RyaW5nOyBwYXJlbnRVaWQ/OiBzdHJpbmd9XG4gIC8vIEZpcmVkIHdoZW4gYSBzZXNzaW9uLWxldmVsIHByZWZlcmVuY2UgZmxpcHMgKGRhcmstbW9kZSB0b2dnbGUsIE9TXG4gIC8vIG1vdGlvbi1wcmVmIGNoYW5nZSkuIFRoZSBwYW5lbCBhcHBlbmRzIGEgZnJlc2ggcGFnZSByb3cgc28gdGhlXG4gIC8vIGV4cG9ydCdzIGNocm9ub2xvZ3kgcmVmbGVjdHMgdGhlIHRvZ2dsZSBhbmQgcG9zdC1jaGFuZ2UgY2FwdHVyZXNcbiAgLy8gY2FycnkgdGhlIG5ldyB2aWV3cG9ydCBzdGF0ZS5cbiAgfCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJzsgcmVhc29uOiAnY29sb3Itc2NoZW1lJyB8ICdyZWR1Y2VkLW1vdGlvbic7IHBhZ2U6IFBhZ2VDb250ZXh0fVxuICAvLyBGdWxsLXBhZ2Ugc2NyZWVuc2hvdCArIG1ldGFkYXRhIGZvciBvbmUgZGlzdGluY3QgcGFnZSAoVVJMKS4gRW1pdHRlZCBhdFxuICAvLyBtb3N0IG9uY2UgcGVyIFVSTCAodGhlIGNvbnRlbnQgc2NyaXB0IGRlZHVwZXMpLiBUaGUgcGFuZWwgY2FuIHN0YXNoIHRoZXNlXG4gIC8vIGFzIHBhZ2UtbGV2ZWwgY29udGV4dCAvIGV4cG9ydCB0aGVtIGFsb25nc2lkZSBlbGVtZW50IHNob3RzLlxuICB8IHtraW5kOiAncGFnZS1zbmFwc2hvdCc7IHBheWxvYWQ6IFBhZ2VTbmFwc2hvdH07XG5cbmV4cG9ydCB0eXBlIFBhbmVsVG9DcyA9XG4gIHwge2tpbmQ6ICdvdXRsaW5lJzsgc2VsZWN0b3I6IHN0cmluZzsgZ29sZD86IGJvb2xlYW47IGRhc2hlZD86IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdvdXRsaW5lLWNsZWFyJ31cbiAgfCB7a2luZDogJ291dGxpbmUtbXVsdGknOyBzZWxlY3RvcnM6IHN0cmluZ1tdfVxuICB8IHtraW5kOiAnb3V0bGluZS1tdWx0aS1jbGVhcid9XG4gIHwge2tpbmQ6ICdzY3JvbGwtdG8nOyBzZWxlY3Rvcjogc3RyaW5nOyBzdGlja3k/OiBib29sZWFufVxuICB8IHtraW5kOiAnc3RpY2t5LWNsZWFyJ31cbiAgLy8gT25lLXNob3QgbG9jYXRvciBhbmltYXRpb246IHNjcm9sbCBpbnRvIHZpZXcgKyB0aHJlZSBwdWxzaW5nIHJpbmdzLlxuICAvLyBEaXN0aW5jdCBmcm9tIGBvdXRsaW5lYCAoc3VidGxlIGhvdmVyIHJpbmcpIGFuZCBgc2Nyb2xsLXRvYCAoc2lsZW50XG4gIC8vIHJlY2VudGVyKSBzbyB0aGUgc2lkZSBwYW5lbCBMb2NhdGUgYnV0dG9uIGNhbiByZXF1ZXN0IHNvbWV0aGluZyB1c2Vyc1xuICAvLyBjYW4gYWN0dWFsbHkgZmluZCBvbiBhIGJ1c3kgcGFnZS5cbiAgfCB7a2luZDogJ2xvY2F0ZS1mbGFzaCc7IHNlbGVjdG9yOiBzdHJpbmd9XG4gIHwge2tpbmQ6ICd2YWxpZGF0ZSc7IHNlbGVjdG9yczogc3RyaW5nW119XG4gIHwge2tpbmQ6ICdsb2ctZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdyZWNhcHR1cmUnOyBzZWxlY3Rvcjogc3RyaW5nOyBuPzogbnVtYmVyfVxuICB8IHtraW5kOiAnY2FwdHVyZS1hbmNlc3Rvcic7IHNlbGVjdG9yOiBzdHJpbmc7IGRlcHRoOiBudW1iZXJ9XG4gIC8vIE91dGxpbmUgdGhlIE50aCBhbmNlc3RvciBvZiBgc2VsZWN0b3JgIHdpdGhvdXQgY2FwdHVyaW5nIGl0IOKAlCB1c2VkIGJ5XG4gIC8vIGhvdmVyIG9uIGFuY2VzdG9yIGJyZWFkY3J1bWIgY2hpcHMgaW4gdGhlIHNpZGUgcGFuZWwgc28gdGhlIHVzZXJcbiAgLy8gcHJldmlld3Mgd2hpY2ggZWxlbWVudCBhIGNoaXAgcmVmZXJzIHRvIGJlZm9yZSBjbGlja2luZy5cbiAgfCB7a2luZDogJ291dGxpbmUtYW5jZXN0b3InOyBzZWxlY3Rvcjogc3RyaW5nOyBkZXB0aDogbnVtYmVyfVxuICB8IHtraW5kOiAnYWx0LXN0YXRlJzsgb246IGJvb2xlYW59XG4gIHwge2tpbmQ6ICdtYW51YWwtY2FwdHVyZSc7IHNlbGVjdG9yOiBzdHJpbmc7IG4/OiBudW1iZXJ9XG4gIHwge2tpbmQ6ICdhbm5vdGF0aW9uJzsgc2VsZWN0b3I6IHN0cmluZzsgcGF5bG9hZDogQW5ub3RhdGlvblBheWxvYWQgfCBudWxsfVxuICB8IHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNhbmNlbCd9XG4gIHwge2tpbmQ6ICdwZW5kaW5nLWNvbW1pdCd9XG4gIHwge2tpbmQ6ICdjb250ZXh0LWNhcHR1cmUnfVxuICB8IHtraW5kOiAnc2V0LWNhcHR1cmVkJzsgc2VsZWN0b3JzOiBzdHJpbmdbXX1cbiAgfCB7a2luZDogJ3NldC1jcy1wcmVmcyc7IHNwYWNpbmdPdmVybGF5PzogYm9vbGVhbjsgaG92ZXJTbmFwPzogYm9vbGVhbn1cbiAgLy8gU2NyZWVuc2hvdC10aW1lIG92ZXJsYXkgdG9nZ2xlcy4gVGhlIGJhY2tncm91bmQgYXNrcyB0aGUgY29udGVudCBzY3JpcHRcbiAgLy8gdG8gaGlkZSBpdHMgc2hhZG93LXJvb3QgY2hyb21lIChyaW5ncywgcnViYmVyLWJhbmQsIGFubm90YXRpb24pIGJlZm9yZVxuICAvLyBjYXB0dXJlVmlzaWJsZVRhYiBmaXJlcywgdGhlbiByZXN0b3JlcyB2aXNpYmlsaXR5IG9uY2UgdGhlIFBORyBpcyBiYWNrLlxuICB8IHtraW5kOiAnaGlkZS1vdmVybGF5cyd9XG4gIHwge2tpbmQ6ICdzaG93LW92ZXJsYXlzJ307XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25QYXlsb2FkID0ge1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLy8gVGhlIGNhcHR1cmVkIGVudHJ5J3Mgc3RhYmxlIHVpZC4gVGhlIGNvbnRlbnQgc2NyaXB0IG5lZWRzIHRoaXMgc29cbiAgLy8gaXRzIG9uLXBhZ2UgY29tbWVudCBib3ggY2FuIHJvdXRlIHRoZSBjb21tZW50IHRvIHRoZSAqc3BlY2lmaWMqXG4gIC8vIGNhcHR1cmUgcmF0aGVyIHRoYW4gdG8gXCJhbnkgc2VsZWN0b3IgdGhhdCBtYXRjaGVzLlwiIFByZXZlbnRzXG4gIC8vIGNyb3NzLWNvbnRhbWluYXRpb24gd2hlbiB0d28gY2FwdHVyZXMgc2hhcmUgYSBzZWxlY3RvciBhY3Jvc3NcbiAgLy8gcGFnZXMgb3IgdHdvIHNpYmxpbmcgZWxlbWVudHMgc2hhcmUgYSB0ZXN0SWQuXG4gIHVpZD86IHN0cmluZztcbiAgbj86IG51bWJlcjtcbiAgY2FwdHVyZWQ/OiBib29sZWFuO1xuICBmZWVkYmFjaz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgUGFuZWxUb0JnID1cbiAgfCB7a2luZDogJ2NhcHR1cmUtc2NyZWVuc2hvdCc7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc3dpdGNoLXRvLXRhYic7IHVybDogc3RyaW5nOyBvcGVuSWZNaXNzaW5nPzogYm9vbGVhbn1cbiAgfCB7a2luZDogJ2xpc3Qtb3Blbi10YWJzJ31cbiAgfCB7a2luZDogJ3Nob3QtZWxlbWVudCc7IHNlbGVjdG9yOiBzdHJpbmc7IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1ncm91cCc7IHNlbGVjdG9yczogc3RyaW5nW107IG46IG51bWJlcjsgd29ya3NwYWNlOiBzdHJpbmc7IHBhZGRpbmc/OiBudW1iZXI7IHRhYklkPzogbnVtYmVyfVxuICB8IHtraW5kOiAnc2hvdC1wYWdlJzsgbjogbnVtYmVyOyB3b3Jrc3BhY2U6IHN0cmluZzsgdGFiSWQ/OiBudW1iZXJ9XG4gIC8vIEZ1bGwtcGFnZSAoYmVzdC1lZmZvcnQpIHNjcmVlbnNob3QgZm9yIHRoZSBwYWdlLXNuYXBzaG90IGZlYXR1cmUuIFVubGlrZVxuICAvLyBzaG90LXBhZ2UgdGhpcyBkb2VzIE5PVCB3cml0ZSBhIGZpbGUgb3IgYnVpbGQgYSB0aHVtYm5haWwg4oCUIGl0IGp1c3RcbiAgLy8gcmV0dXJucyB0aGUgc3RpdGNoZWQgUE5HIGFzIGEgZGF0YSBVUkwgc28gdGhlIGNhbGxlciAoY29udGVudCBzY3JpcHQpIGNhblxuICAvLyBhdHRhY2ggaXQgdG8gYSBQYWdlU25hcHNob3QuIGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnRcbiAgLy8gY291bGQgYmUgY2FwdHVyZWQuXG4gIHwge2tpbmQ6ICdwYWdlLXNuYXBzaG90LXNob3QnOyB0YWJJZD86IG51bWJlcn1cbiAgLy8gU2lkZSBwYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIHdyaXRlIGEgVVRGLTggc3RyaW5nIChKU09OTCwgTWFya2Rvd24sXG4gIC8vIFJFQURNRSkgdG8gZGlzay4gYHN1YmRpcmAgaXMgcmVsYXRpdmUgdG8gLnBpbmNoZ3JhYi88d29ya3NwYWNlPi8g4oCUIHdlXG4gIC8vIGRlZmF1bHQgdG8gJ2V4cG9ydHMnIHNvIEpTT05ML01EIGxpdmUgc2VwYXJhdGUgZnJvbSBzY3JlZW5zaG90cy5cbiAgfCB7a2luZDogJ3NhdmUtdGV4dCc7IHdvcmtzcGFjZTogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBTYW1lIGFzIHNhdmUtdGV4dCBidXQgZm9yIGJpbmFyeSBibG9icyAod29ya3NwYWNlIFpJUCkuIGNocm9tZS5ydW50aW1lXG4gIC8vIC5zZW5kTWVzc2FnZSB1c2VzIHN0cnVjdHVyZWQgY2xvbmluZywgd2hpY2ggcHJlc2VydmVzIFVpbnQ4QXJyYXksIHNvIHdlXG4gIC8vIHBhc3MgdGhlIHR5cGVkIGFycmF5IGRpcmVjdGx5LiBudW1iZXJbXSBpcyBhY2NlcHRlZCBhcyBhIGZhbGxiYWNrIGZvclxuICAvLyBvbGRlciBjYWxsZXJzIGFuZCB0ZXN0cyB0aGF0IHByZS1zZXJpYWxpemUuXG4gIHwge2tpbmQ6ICdzYXZlLWJ5dGVzJzsgd29ya3NwYWNlOiBzdHJpbmc7IGZpbGVuYW1lOiBzdHJpbmc7IGJ5dGVzOiBVaW50OEFycmF5IHwgbnVtYmVyW107IG1pbWU6IHN0cmluZzsgc3ViZGlyPzogc3RyaW5nfVxuICAvLyBQYW5lbCBhc2tzIHRoZSBiYWNrZ3JvdW5kIHRvIChyZSlpbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IOKAlCB0aGUgZml4XG4gIC8vIGZvciBcIkFsdCBzdG9wcGVkIHdvcmtpbmdcIiBhZnRlciBhbiBleHRlbnNpb24gcmVsb2FkIG9ycGhhbnMgdGhlIHBhZ2Unc1xuICAvLyBjb250ZW50IHNjcmlwdC4gRGVmYXVsdHMgdG8gdGhlIGFjdGl2ZSB0YWIuXG4gIHwge2tpbmQ6ICdwZy1yZWluamVjdCc7IHRhYklkPzogbnVtYmVyfTtcblxuZXhwb3J0IHR5cGUgU2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7ICAgICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgcGF0aCAoZS5nLiBkZWZhdWx0L3NjcmVlbnNob3RzL2Zvby5wbmcpXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAgICAgLy8gT1MtYWJzb2x1dGUgcGF0aCBmb3IgXCJDb3B5IGFzIHBhdGhcIlxuICBjb3B5UGF0aD86IHN0cmluZzsgICAgIC8vIFVJLWZhY2luZyBwYXRoOyBhdm9pZHMgUGxheXdyaWdodCB0ZW1wIGFydGlmYWN0IG5hbWVzXG4gIHRlbXBQYXRoPzogYm9vbGVhbjsgICAgLy8gdHJ1ZSB3aGVuIGFic1BhdGggaXMgYSBicm93c2VyL3Rlc3QtaGFybmVzcyBhcnRpZmFjdCBwYXRoXG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGRhdGFVcmw/OiBzdHJpbmc7ICAgICAgLy8gZG93bnNjYWxlZCB0aHVtYm5haWwgKOKJpDMyMHB4IHdpZGUpIGZvciB0aGUgc2lkZS1wYW5lbCBwcmV2aWV3XG4gIGZ1bGxEYXRhVXJsPzogc3RyaW5nOyAgLy8gZnVsbC1yZXNvbHV0aW9uIFBORyBkYXRhVVJMIOKAlCB1c2VkIGJ5IHRoZSB3b3Jrc3BhY2UgYXJjaGl2ZSBleHBvcnRcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRydW5jYXRlZD86IGJvb2xlYW47XG4gIC8vIENyb3AgbWV0YWRhdGEuIExldHMgcmVjZWl2ZXJzIG1hcCBiZXR3ZWVuIHRoZSBzdG9yZWQgUE5HIGFuZFxuICAvLyBvcmlnaW5hbCBwYWdlIGNvb3JkaW5hdGVzIHNvIHRoZXkgY2FuXG4gIC8vIGRyYXcgdGhlaXIgb3duIG92ZXJsYXkgb3IgcmVwcm9kdWNlIHRoZSBjcm9wIG9uIGEgZnJlc2ggY2FwdHVyZS5cbiAgY3JvcD86IHtcbiAgICBjc3NSZWN0OiB7eDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkZXZpY2VQeFJlY3Q6IHt4OiBudW1iZXI7IHk6IG51bWJlcjsgdzogbnVtYmVyOyBoOiBudW1iZXJ9O1xuICAgIGltYWdlU2l6ZToge3c6IG51bWJlcjsgaDogbnVtYmVyfTtcbiAgICBkcHI6IG51bWJlcjtcbiAgICBwYWRkaW5nOiBudW1iZXI7XG4gICAgc2VsZWN0b3JzOiBzdHJpbmdbXTtcbiAgfTtcbn07XG5cbi8vIFJlcGx5IHRvIGEgYHBhZ2Utc25hcHNob3Qtc2hvdGAgcmVxdWVzdC4gYHNjcmVlbnNob3RgIGlzIGEgUE5HIGRhdGEgVVJMIG9mXG4vLyB0aGUgKGJlc3QtZWZmb3J0KSBmdWxsIHBhZ2U7IGBwYXJ0aWFsYCBpcyB0cnVlIHdoZW4gb25seSB0aGUgdmlld3BvcnQgd2FzXG4vLyBjYXB0dXJlZC4gYG9rOmZhbHNlYCBjYXJyaWVzIGFuIGVycm9yIHN0cmluZy5cbmV4cG9ydCB0eXBlIFBhZ2VTbmFwc2hvdFJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgc2NyZWVuc2hvdD86IHN0cmluZztcbiAgcGFydGlhbD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU2F2ZVJlcGx5ID0ge1xuICBvazogYm9vbGVhbjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7IC8vIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoXG4gIGFic1BhdGg/OiBzdHJpbmc7ICAvLyBPUy1hYnNvbHV0ZSBwYXRoXG4gIGNvcHlQYXRoPzogc3RyaW5nOyAvLyBVSS1mYWNpbmcgcGF0aFxuICB0ZW1wUGF0aD86IGJvb2xlYW47XG4gIGRvd25sb2FkU3RhdGU/OiAnaW5fcHJvZ3Jlc3MnIHwgJ2ludGVycnVwdGVkJyB8ICdjb21wbGV0ZSc7XG4gIGVycm9yPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQmdSZXBseSA9XG4gIHwge2RhdGFVcmw6IHN0cmluZ31cbiAgfCB7Zm91bmQ6IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcn1cbiAgfCB7dGFiczogQXJyYXk8e2lkPzogbnVtYmVyOyB1cmw/OiBzdHJpbmc7IHRpdGxlPzogc3RyaW5nfT59XG4gIHwge2Vycm9yOiBzdHJpbmd9XG4gIHwgU2hvdFJlcGx5XG4gIHwgU2F2ZVJlcGx5XG4gIHwgUGFnZVNuYXBzaG90UmVwbHk7XG5cbi8vIOKUgOKUgOKUgCBFeHBvcnQgc2hhcGVzICh2Mikg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBNYW5pZmVzdCBsaW5lIGVtaXR0ZWQgYXMgdGhlIHZlcnkgZmlyc3QgSlNPTkwgbGluZS4gQ2FycmllcyB0aGUgbWV0YWRhdGFcbi8vIG5lY2Vzc2FyeSB0byByZXN5bmMgYSBkb3dubG9hZGVkIGZpbGUgd2l0aCBpdHMgd29ya3NwYWNlICsgdG9vbGluZy5cbmV4cG9ydCB0eXBlIEV4cG9ydE1hbmlmZXN0ID0ge1xuICB2OiAyO1xuICB0eXBlOiAnbWFuaWZlc3QnO1xuICB0czogc3RyaW5nOyAgICAgICAvLyBJU08gb2Ygd2hlbiB0aGUgZXhwb3J0IHdhcyBnZW5lcmF0ZWRcbiAgZ2VuZXJhdGVkOiBudW1iZXI7IC8vIGVwb2NoIG1zIChtaXJyb3Igb2YgdHMgaW4gbWFjaGluZS1yZWFkYWJsZSBmb3JtKVxuICB0b29sOiAncGluY2hncmFiJztcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG4gIGZpbGVuYW1lOiBzdHJpbmc7XG4gIGZvcm1hdDogJ2pzb25sJyB8ICdtYXJrZG93bicgfCAndGFyLnpzdCc7XG4gIC8vIENvbnRlbnQtZGVyaXZlZCBpZGVudGl0eTogZmlyc3QgMTYgaGV4IGNoYXJzIG9mIGEgU0hBLTI1NiBvdmVyIHRoZVxuICAvLyBzbGltIHJvd3MgKyBzY3JlZW5zaG90IG5hbWVzLiBTdGFibGUgYWNyb3NzIHJlLWV4cG9ydHMgb2YgdGhlIHNhbWVcbiAgLy8gY29udGVudCwgc28gZG93bnN0cmVhbSBzdGF0ZSAoZS5nLiB+Ly5waW5jaGdyYWIvd29ya3NwYWNlcy8qL2J1bmRsZXMvKVxuICAvLyBrZXlzIG9uIGl0IHdpdGhvdXQgZHVwbGljYXRpbmcgd29yay5cbiAgYnVuZGxlSWQ/OiBzdHJpbmc7XG4gIGhvc3RzOiBzdHJpbmdbXTtcbiAgLy8gQW1iaWd1b3VzIHRvdGFscy4gVGhlIHByZXZpb3VzIGBzZWxlY3RvcnMgLyBmZWVkYmFjayAvIHBhZ2VzYFxuICAvLyB0cmlwbGUgZGlkbid0IHNheSB3aGV0aGVyIG5lc3RlZFxuICAvLyBncm91cCBtZW1iZXJzIHdlcmUgY291bnRlZCwgd2hldGhlciBmZWVkYmFjay1iZWFyaW5nIHBhcmVudHMgd2VyZVxuICAvLyBhIHN1YnNldCwgb3IgaG93IHNjcmVlbnNob3RzIHdlcmUgdGFsbGllZC4gVGhlIGV4cGFuZGVkIHNoYXBlXG4gIC8vIGJlbG93IG5hbWVzIGV2ZXJ5IGNhdGVnb3J5IGV4cGxpY2l0bHkgc28gYSBkb3duc3RyZWFtIGFnZW50IGNhblxuICAvLyB0ZWxsIGV4YWN0bHkgd2hhdCdzIGluIHRoZSBidW5kbGUuXG4gIGNvdW50czoge1xuICAgIC8vIFRvcC1sZXZlbCBzZWxlY3RvciByb3dzIGluIHRoZSBKU09OTCBzdHJlYW0gKGV4Y2x1ZGVzIG5lc3RlZFxuICAgIC8vIGdyb3VwIG1lbWJlcnMsIGJ1dCB0aGUgYGdyb3VwTWVtYmVyc2AgZmllbGQgY291bnRzIHRob3NlKS5cbiAgICBzZWxlY3RvcnM6IG51bWJlcjtcbiAgICBmZWVkYmFjazogbnVtYmVyO1xuICAgIHBhZ2VzOiBudW1iZXI7XG4gICAgLy8gTnVtYmVyIG9mIHNlbGVjdG9yIHJvd3MgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZSBmZWVkYmFjayBjaGlsZC5cbiAgICAvLyBVc2VmdWwgZm9yIFwic2hvdyBtZSBvbmx5IHRoZSBpdGVtcyB3aXRoIGNvbW1lbnRzXCIuXG4gICAgZmVlZGJhY2tCZWFyaW5nU2VsZWN0b3JzPzogbnVtYmVyO1xuICAgIC8vIFNlbGVjdG9ycyB0aGF0IHNoaXAgdW5kZXIgYSBncm91cCBoZWFkJ3MgYGVudHJ5Lmdyb3VwYCBhcnJheVxuICAgIC8vIHJhdGhlciB0aGFuIGFzIHRoZWlyIG93biB0b3AtbGV2ZWwgcm93LlxuICAgIGdyb3VwTWVtYmVycz86IG51bWJlcjtcbiAgICAvLyBTY3JlZW5zaG90IGludmVudG9yeSAoY291bnRlZCBieSBmaWxlLCBkZWR1cGVkKS5cbiAgICBzY3JlZW5zaG90c0VsZW1lbnQ/OiBudW1iZXI7XG4gICAgc2NyZWVuc2hvdHNHcm91cD86IG51bWJlcjtcbiAgICBzY3JlZW5zaG90c1BhZ2U/OiBudW1iZXI7XG4gICAgLy8gU2VsZWN0b3Igcm93cyB0aGF0IHNob3VsZCBoYXZlIGFuIGVsZW1lbnQgc2NyZWVuc2hvdCBidXQgZG9uJ3RcbiAgICAvLyAocG9zdC1idWctIzIgZm9yY2VkIHNob290IG1heSBzdGlsbCBmYWlsKS4gUmVwYWlyIGFnZW50cyBjYW5cbiAgICAvLyBza2lwIHRoZXNlIG9yIHJlcXVlc3QgYSByZS1jYXB0dXJlLlxuICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90PzogbnVtYmVyO1xuICAgIC8vIEZlZWRiYWNrIHJvd3Mgd2hvc2UgcGFyZW50VWlkIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbnkgc2VsZWN0b3JcbiAgICAvLyBpbiB0aGlzIGFyY2hpdmUuIFNob3VsZCBhbHdheXMgYmUgMDsgbm9uLXplcm8gbWVhbnMgdGhlIGV4cG9ydFxuICAgIC8vIGdvdCB0cnVuY2F0ZWQgb3IgYSBwYXJlbnQgd2FzIGRlbGV0ZWQgYmV0d2VlbiBjYXB0dXJlICsgZW1pdC5cbiAgICBvcnBoYW5lZEZlZWRiYWNrPzogbnVtYmVyO1xuICB9O1xuICAvLyBSZXNvbHV0aW9uIHJvb3QgZm9yIGV2ZXJ5IHBhdGggZmllbGQgaW4gdGhlIEpTT05MIHN0cmVhbS5cbiAgLy8gICDigKIgJ2FyY2hpdmUnICAg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdFxuICAvLyAgICAgICAgICAgICAgICAgICAodXNlZCBmb3IgdGFyLnpzdCBleHBvcnRzKS5cbiAgLy8gICDigKIgJ3dvcmtzcGFjZScg4oCUIHBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgd29ya3NwYWNlIGRpciBvbiBkaXNrLFxuICAvLyAgICAgICAgICAgICAgICAgICBpLmUuIGBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d29ya3NwYWNlPi9gXG4gIC8vICAgICAgICAgICAgICAgICAgICh1c2VkIGZvciBwbGFpbiBKU09OTCBleHBvcnRzKS5cbiAgLy8gUmVjZWl2ZXJzIHByZXBlbmQgdGhlIGFwcHJvcHJpYXRlIHJvb3QgdG8gcmVzb2x2ZSBhbnkgcGF0aCBmaWVsZC5cbiAgcGF0aFJvb3Q/OiAnYXJjaGl2ZScgfCAnd29ya3NwYWNlJztcbiAgLy8gSW5kaXJlY3Rpb24gcG9pbnRlciB0byB0aGUgVUkgc2tpbGwgdGhhdCBrbm93cyBob3cgdG8gdHJpYWdlIHRoZXNlXG4gIC8vIGNhcHR1cmVzLiBXaGVuIGBpbmxpbmU6IHRydWVgLCB0aGUgc2tpbGwgY29udGVudCBsaXZlcyBhdFxuICAvLyBgYXJjaGl2ZVBhdGhgIGluc2lkZSB0aGUgdGFyIChkZWZhdWx0OiBgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kYCkuXG4gIC8vXG4gIC8vIGBjdXN0b21pemVkYCBhbmQgYHRlbXBsYXRlYCBhcmUgbXV0dWFsbHktZXhjbHVzaXZlIGNvbmZpZGVuY2UgZmxhZ3M6XG4gIC8vICAg4oCiIGN1c3RvbWl6ZWQ6IHRydWUg4oaSIHVzZXIgdXBsb2FkZWQgLyBwYXN0ZWQgdGhlaXIgb3duIGNvbnRlbnQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCB0aGUgZmlsZSBhcyBhdXRob3JpdGF0aXZlLlxuICAvLyAgIOKAoiB0ZW1wbGF0ZTogdHJ1ZSAgIOKGkiB1c2VyIGlzIHNoaXBwaW5nIHRoZSBidW5kbGVkIGRlZmF1bHQuXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBUcmVhdCBhcyBnZW5lcmljIGJvaWxlcnBsYXRlOyB2ZXJpZnkgYmVmb3JlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBhcHBseWluZy5cbiAgLy8gKFRoZSBwcmV2aW91cyBgdGVtcGxhdGVgIGZsYWcgYWxvbmUgd2FzIGFtYmlndW91cyBiZWNhdXNlIHRoZVxuICAvLyBidW5kbGVkIGxvY2FsIHRlbXBsYXRlIHN0aWxsIGxvb2tzIHByb2plY3Qtc3BlY2lmaWMuKVxuICBza2lsbD86IHtuYW1lOiBzdHJpbmc7IHBhdGg6IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBQb2ludGVyIHRvIHRoZSBwcm9qZWN0J3MgREVTSUdOLm1kLiBTYW1lIHJ1bGVzOiBgY3VzdG9taXplZDogdHJ1ZWBcbiAgLy8gbWVhbnMgdGhlIHVzZXIgc3VwcGxpZWQgdGhpcyBjb250ZW50OyBgdGVtcGxhdGU6IHRydWVgIG1lYW5zIGl0J3NcbiAgLy8gUGluY2hHcmFiJ3MgYnVuZGxlZCBkZWZhdWx0LlxuICBkZXNpZ24/OiB7cGF0aD86IHN0cmluZzsgaW5saW5lPzogYm9vbGVhbjsgYXJjaGl2ZVBhdGg/OiBzdHJpbmc7IHRlbXBsYXRlPzogYm9vbGVhbjsgY3VzdG9taXplZD86IGJvb2xlYW59O1xuICAvLyBTZWxmLXJvYXN0IHNlY3Rpb24uIFRoZSBleHBvcnQgc3VyZmFjZXMgaXRzIG93biBnYXBzIHNvIGFcbiAgLy8gZG93bnN0cmVhbSBMTE0gZG9lc24ndCBoYXZlIHRvIGRpc2NvdmVyXG4gIC8vIHRoZW0uIEVtcHR5IGFycmF5ID0gY2xlYW4gZXhwb3J0LiBFYWNoIGRpYWdub3N0aWMgaGFzIGEgc3RhYmxlXG4gIC8vIGBjb2RlYCBzbyByZWNlaXZlcnMgY2FuIGRpc3BhdGNoIG9uIGl0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGV4cG9ydERpYWdub3N0aWNzPzogRXhwb3J0RGlhZ25vc3RpY1tdO1xuICAvLyBBcmNoaXZlIGludGVncml0eS4gUmVjZWl2ZXJzIGNhbiBkZXRlY3QgcGFydGlhbCBleHRyYWN0aW9uIC9cbiAgLy8gY29ycnVwdGlvbiB3aXRoIGEgc2luZ2xlIGNoZWNrLlxuICBhcmNoaXZlSW50ZWdyaXR5Pzoge1xuICAgIGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9PjtcbiAgfTtcbiAgLy8gQnVpbGQvc291cmNlIGlkZW50aXR5LiBDYXB0dXJlZCBmcm9tIGFcbiAgLy8gYDxtZXRhIG5hbWU9XCJwaW5jaGdyYWItYnVpbGRcIiBjb250ZW50PVwiY29tbWl0OmFiYyBicmFuY2g6bWFpbiBkaXJ0eTp0cnVlXCI+YFxuICAvLyB0YWcgdGhlIHVzZXIncyBhcHAgaW5qZWN0cywgcGx1cyBQaW5jaEdyYWIgZXh0ZW5zaW9uIHZlcnNpb24uXG4gIC8vIFJlY2VpdmVycyBjYW4gdGVsbCBpZiB0aGUgZXhwb3J0IGlzIHN0YWxlIHJlbGF0aXZlIHRvIHRoZSByZXBvLlxuICAvLyBPbWl0dGVkIGVudGlyZWx5IHdoZW4gbm8gYnVpbGQgaW5mbyBpcyBhdmFpbGFibGUuXG4gIGJ1aWxkPzoge1xuICAgIGV4dGVuc2lvblZlcnNpb24/OiBzdHJpbmc7XG4gICAgY29tbWl0Pzogc3RyaW5nO1xuICAgIGJyYW5jaD86IHN0cmluZztcbiAgICBkaXJ0eT86IGJvb2xlYW47XG4gICAgZGVwbG95QnVpbGQ/OiBzdHJpbmc7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBFeHBvcnREaWFnbm9zdGljID0ge1xuICBzZXZlcml0eTogJ2Vycm9yJyB8ICd3YXJuJyB8ICdpbmZvJztcbiAgY29kZTogc3RyaW5nO1xuICBkZXRhaWw/OiBzdHJpbmc7XG4gIHVpZD86IHN0cmluZztcbn07XG5cbi8vIEVudmVsb3BlIG1hcmtlciB1c2VkIG9uIGV2ZXJ5IFBpbmNoR3JhYiBtZXNzYWdlIChzbyBvdGhlciBleHRlbnNpb25cbi8vIG1lc3NhZ2VzIHRyYXZlbGluZyB0aHJvdWdoIHRoZSBzYW1lIGNoYW5uZWwgYXJlIGlnbm9yZWQpLiBfX21pZCBpcyBhXG4vLyBwZXItZGlzcGF0Y2ggdW5pcXVlIHN0YW1wIHNvIHJlY2VpdmVycyBjYW4gZGVkdXBlIGEgbWVzc2FnZSB0aGF0IGFycml2ZXNcbi8vIHRocm91Z2ggbW9yZSB0aGFuIG9uZSBjaGFubmVsIChlLmcuIHJ1bnRpbWUub25NZXNzYWdlICsgYSBwb3J0IHJlbGF5KS5cbmV4cG9ydCB0eXBlIFBnRW52ZWxvcGU8VD4gPSBUICYge19fcGc6IHRydWU7IF9fbWlkOiBzdHJpbmd9O1xuXG5leHBvcnQgdHlwZSBBbnlNZXNzYWdlID0gQ3NUb1BhbmVsIHwgUGFuZWxUb0NzIHwgUGFuZWxUb0JnO1xuXG5sZXQgX21pZENvdW50ZXIgPSAwO1xuY29uc3QgbmV3TWlkID0gKCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHByZWZpeCA9IGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK19taWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtBcnJheS5mcm9tKGJ5dGVzKS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpfWA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cbn07XG5cbi8vIEhlbHBlcjogc3RhbXAgYSBwYXlsb2FkIHdpdGggdGhlIGVudmVsb3BlIG1hcmtlciArIHVuaXF1ZSBtZXNzYWdlIGlkLlxuZXhwb3J0IGNvbnN0IHBnID0gPFQgZXh0ZW5kcyB7a2luZDogc3RyaW5nfT4ocGF5bG9hZDogVCk6IFBnRW52ZWxvcGU8VD4gPT5cbiAgKHtfX3BnOiB0cnVlLCBfX21pZDogbmV3TWlkKCksIC4uLnBheWxvYWR9KSBhcyBQZ0VudmVsb3BlPFQ+O1xuIiwKICAgICIvLyBTdWJzZXQgb2YgbHVjaWRlLmRldiBpY29ucyBpbmxpbmVkIGFzIFNWRyBpbm5lci1tYXJrdXAuXG4vLyBFYWNoIGVudHJ5IGlzIHRoZSBib2R5IG9mIDxzdmcgLi4uID4gLi4uIDwvc3ZnPjsgc3ZnU3RyaW5nKCkgd3JhcHMgaXQuXG4vLyBTaXplcyBkZWZhdWx0IHRvIDE2OyBvdmVycmlkZSB3aXRoIHRoZSBzaXplIGFyZ3VtZW50LlxuLy9cbi8vIE1JVCDigJQgaHR0cHM6Ly9naXRodWIuY29tL2x1Y2lkZS1pY29ucy9sdWNpZGVcblxuY29uc3QgSUNPTlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdjaGV2cm9uLXJpZ2h0JzogJzxwYXRoIGQ9XCJtOSAxOCA2LTYtNi02XCIvPicsXG4gICdjaGV2cm9uLWRvd24nOiAnPHBhdGggZD1cIm02IDkgNiA2IDYtNlwiLz4nLFxuICBjb3B5OiAnPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgeD1cIjhcIiB5PVwiOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTQgMTZjLTEuMSAwLTItLjktMi0yVjRjMC0xLjEuOS0yIDItMmgxMGMxLjEgMCAyIC45IDIgMlwiLz4nLFxuICBwZW5jaWw6ICc8cGF0aCBkPVwiTTIxLjE3NCA2LjgxMmExIDEgMCAwIDAtMy45ODYtMy45ODdMMy44NDIgMTYuMTc0YTIgMiAwIDAgMC0uNS44M2wtMS4zMjEgNC4zNTJhLjUuNSAwIDAgMCAuNjIzLjYyMmw0LjM1My0xLjMyYTIgMiAwIDAgMCAuODMtLjQ5N3pcIi8+PHBhdGggZD1cIm0xNSA1IDQgNFwiLz4nLFxuICAndHJhc2gtMic6ICc8cGF0aCBkPVwiTTMgNmgxOFwiLz48cGF0aCBkPVwiTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNlwiLz48cGF0aCBkPVwiTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeDI9XCIxMFwiIHkxPVwiMTFcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB4Mj1cIjE0XCIgeTE9XCIxMVwiIHkyPVwiMTdcIi8+JyxcbiAgcGx1czogJzxwYXRoIGQ9XCJNNSAxMmgxNFwiLz48cGF0aCBkPVwiTTEyIDV2MTRcIi8+JyxcbiAgeDogJzxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPicsXG4gIG1pbnVzOiAnPHBhdGggZD1cIk01IDEyaDE0XCIvPicsXG4gIHNlYXJjaDogJzxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiLz48cGF0aCBkPVwibTIxIDIxLTQuMy00LjNcIi8+JyxcbiAgZG93bmxvYWQ6ICc8cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjcgMTAgMTIgMTUgMTcgMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjE1XCIgeTI9XCIzXCIvPicsXG4gIHVwbG9hZDogJzxwYXRoIGQ9XCJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNFwiLz48cG9seWxpbmUgcG9pbnRzPVwiMTcgOCAxMiAzIDcgOFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiM1wiIHkyPVwiMTVcIi8+JyxcbiAgZ2l0aHViOiAnPHBhdGggZD1cIk0xNSAyMnYtNGE0LjggNC44IDAgMCAwLTEtMy41YzMgMCA2LTIgNi01LjUuMDgtMS4yNS0uMjctMi40OC0xLTMuNS4yOC0xLjE1LjI4LTIuMzUgMC0zLjUgMCAwLTEgMC0zIDEuNS0yLjY0LS41LTUuMzYtLjUtOCAwQzYgMiA1IDIgNSAyYy0uMyAxLjE1LS4zIDIuMzUgMCAzLjVBNS40IDUuNCAwIDAgMCA0IDljMCAzLjUgMyA1LjUgNiA1LjUtLjM5LjQ5LS42OCAxLjA1LS44NSAxLjY1LS4xNy42LS4yMiAxLjIzLS4xNSAxLjg1djRcIi8+PHBhdGggZD1cIk05IDE4Yy00LjUxIDItNS0yLTctMlwiLz4nLFxuICBzdGFyOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiLz4nLFxuICAnY2lyY2xlLWRvdCc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgY3Jvc3NoYWlyOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjIyXCIgeDI9XCIxOFwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiNlwiIHgyPVwiMlwiIHkxPVwiMTJcIiB5Mj1cIjEyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCI2XCIgeTI9XCIyXCIvPjxsaW5lIHgxPVwiMTJcIiB4Mj1cIjEyXCIgeTE9XCIyMlwiIHkyPVwiMThcIi8+JyxcbiAgdGFyZ2V0OiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjZcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIyXCIvPicsXG4gICdwYW5lbC1sZWZ0LWNsb3NlJzogJzxyZWN0IHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHg9XCIzXCIgeT1cIjNcIiByeD1cIjJcIi8+PHBhdGggZD1cIk05IDN2MThcIi8+PHBhdGggZD1cIm0xNiAxNS0zLTMgMy0zXCIvPicsXG4gICdleHRlcm5hbC1saW5rJzogJzxwYXRoIGQ9XCJNMTUgM2g2djZcIi8+PHBhdGggZD1cIk0xMCAxNCAyMSAzXCIvPjxwYXRoIGQ9XCJNMTggMTN2NmEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNlwiLz4nLFxuICAnbWVzc2FnZS1zcXVhcmUtcGx1cyc6ICc8cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48bGluZSB4MT1cIjlcIiB4Mj1cIjE1XCIgeTE9XCIxMFwiIHkyPVwiMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjdcIiB5Mj1cIjEzXCIvPicsXG4gICdhbGVydC1jaXJjbGUnOiAnPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiOFwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTIuMDFcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz4nLFxuICAncmVmcmVzaC1jdyc6ICc8cGF0aCBkPVwiTTMgMTJhOSA5IDAgMCAxIDE1LTYuN0wyMSA4XCIvPjxwYXRoIGQ9XCJNMjEgM3Y1aC01XCIvPjxwYXRoIGQ9XCJNMjEgMTJhOSA5IDAgMCAxLTE1IDYuN0wzIDE2XCIvPjxwYXRoIGQ9XCJNMyAyMXYtNWg1XCIvPicsXG4gICdmaWxlLXRleHQnOiAnPHBhdGggZD1cIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjV6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIxNCAyIDE0IDggMjAgOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCI4XCIgeTE9XCIxM1wiIHkyPVwiMTNcIi8+PGxpbmUgeDE9XCIxNlwiIHgyPVwiOFwiIHkxPVwiMTdcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTBcIiB4Mj1cIjhcIiB5MT1cIjlcIiB5Mj1cIjlcIi8+JyxcbiAgJ2ZpbGUtY29kZSc6ICc8cGF0aCBkPVwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNXpcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDIgMTQgOCAyMCA4XCIvPjxwYXRoIGQ9XCJtMTAgMTMtMiAyIDIgMlwiLz48cGF0aCBkPVwibTE0IDE3IDItMi0yLTJcIi8+JyxcbiAgaW1hZ2U6ICc8cmVjdCB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB4PVwiM1wiIHk9XCIzXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCI5XCIgcj1cIjJcIi8+PHBhdGggZD1cIm0yMSAxNS0zLjA4Ni0zLjA4NmEyIDIgMCAwIDAtMi44MjggMEw2IDIxXCIvPicsXG4gIC8vIFN0eWxpc2VkIFwicGluY2hcIiDigJQgdHdvIG9wcG9zaW5nIGN1cnZlcyBtZWV0aW5nIGF0IGEgY2VudGVyIGRvdC5cbiAgcGluY2g6ICc8cGF0aCBkPVwiTTUgNWMzIDIgNSA0IDcgNy0yIDMtNCA1LTcgN1wiLz48cGF0aCBkPVwiTTE5IDVjLTMgMi01IDQtNyA3IDIgMyA0IDUgNyA3XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMS41XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nLFxuICAnc3Rhci1maWxsZWQnOiAnPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyxcbiAgcGluOiAnPHBhdGggZD1cIk0xMiAxN3Y1XCIvPjxwYXRoIGQ9XCJNOSAxMC43NmEyIDIgMCAwIDEtMS4xMSAxLjc5bC0xLjc4LjlBMiAyIDAgMCAwIDUgMTUuMjRWMTZhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xdi0uNzZhMiAyIDAgMCAwLTEuMTEtMS43OWwtMS43OC0uOUEyIDIgMCAwIDEgMTUgMTAuNzZWN2ExIDEgMCAwIDEgMS0xIDIgMiAwIDAgMCAwLTRIOGEyIDIgMCAwIDAgMCA0IDEgMSAwIDAgMSAxIDF6XCIvPicsXG4gIHVuZG86ICc8cGF0aCBkPVwiTTMgN3Y2aDZcIi8+PHBhdGggZD1cIk0yMSAxN2E5IDkgMCAwIDAtMTUtNi43TDMgMTNcIi8+JyxcbiAgcmVkbzogJzxwYXRoIGQ9XCJNMjEgN3Y2aC02XCIvPjxwYXRoIGQ9XCJNMyAxN2E5IDkgMCAwIDEgMTUtNi43TDIxIDEzXCIvPicsXG4gIGZvbGRlcjogJzxwYXRoIGQ9XCJNMjAgMjBhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJoLTcuOTNhMiAyIDAgMCAxLTEuNjYtLjlsLS44Mi0xLjJBMiAyIDAgMCAwIDcuOTMgM0g0YTIgMiAwIDAgMC0yIDJ2MTNhMiAyIDAgMCAwIDIgMlpcIi8+JyxcbiAgY2hlY2s6ICc8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIi8+JyxcbiAgJ2NpcmNsZS1jaGVjayc6ICc8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtOSAxMiAyIDIgNC00XCIvPicsXG4gIGdyaXA6ICc8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiNVwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCIxMlwiIHI9XCIxXCIvPjxjaXJjbGUgY3g9XCIxNVwiIGN5PVwiMTJcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMTlcIiByPVwiMVwiLz48Y2lyY2xlIGN4PVwiMTVcIiBjeT1cIjE5XCIgcj1cIjFcIi8+JyxcbiAgLy8gQnJva2VuLWNoYWluIGljb24gZm9yIFwiZGV0YWNoIGNvbW1lbnQgZnJvbSBpdHMgY2FwdHVyZVwiLiBMdWNpZGUncyBgdW5saW5rYC5cbiAgdW5saW5rOiAnPHBhdGggZD1cIm0xOC44NCAxMi4yNSAxLjcyLTEuNzFoLS4wMmE1LjAwNCA1LjAwNCAwIDAgMC0uMTItNy4wNyA1LjAwNiA1LjAwNiAwIDAgMC02Ljk1IDBsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwibTUuMTcgMTEuNzUtMS43MSAxLjcxYTUuMDA0IDUuMDA0IDAgMCAwIC4xMiA3LjA3IDUuMDA2IDUuMDA2IDAgMCAwIDYuOTUgMGwxLjcxLTEuNzFcIi8+PGxpbmUgeDE9XCI4XCIgeDI9XCI4XCIgeTE9XCIyXCIgeTI9XCI1XCIvPjxsaW5lIHgxPVwiMlwiIHgyPVwiNVwiIHkxPVwiOFwiIHkyPVwiOFwiLz48bGluZSB4MT1cIjE2XCIgeDI9XCIxNlwiIHkxPVwiMTlcIiB5Mj1cIjIyXCIvPjxsaW5lIHgxPVwiMTlcIiB4Mj1cIjIyXCIgeTE9XCIxNlwiIHkyPVwiMTZcIi8+JyxcbiAgc2V0dGluZ3M6ICc8cGF0aCBkPVwiTTEyLjIyIDJoLS40NGEyIDIgMCAwIDAtMiAydi4xOGEyIDIgMCAwIDEtMSAxLjczbC0uNDMuMjVhMiAyIDAgMCAxLTIgMGwtLjE1LS4wOGEyIDIgMCAwIDAtMi43My43M2wtLjIyLjM4YTIgMiAwIDAgMCAuNzMgMi43M2wuMTUuMWEyIDIgMCAwIDEgMSAxLjcydi41MWEyIDIgMCAwIDEtMSAxLjc0bC0uMTUuMDlhMiAyIDAgMCAwLS43MyAyLjczbC4yMi4zOGEyIDIgMCAwIDAgMi43My43M2wuMTUtLjA4YTIgMiAwIDAgMSAyIDBsLjQzLjI1YTIgMiAwIDAgMSAxIDEuNzNWMjBhMiAyIDAgMCAwIDIgMmguNDRhMiAyIDAgMCAwIDItMnYtLjE4YTIgMiAwIDAgMSAxLTEuNzNsLjQzLS4yNWEyIDIgMCAwIDEgMiAwbC4xNS4wOGEyIDIgMCAwIDAgMi43My0uNzNsLjIyLS4zOWEyIDIgMCAwIDAtLjczLTIuNzNsLS4xNS0uMDhhMiAyIDAgMCAxLTEtMS43NHYtLjVhMiAyIDAgMCAxIDEtMS43NGwuMTUtLjA5YTIgMiAwIDAgMCAuNzMtMi43M2wtLjIyLS4zOGEyIDIgMCAwIDAtMi43My0uNzNsLS4xNS4wOGEyIDIgMCAwIDEtMiAwbC0uNDMtLjI1YTIgMiAwIDAgMS0xLTEuNzNWNGEyIDIgMCAwIDAtMi0yelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+JyxcbiAgaW5mbzogJzxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xMiAxNnYtNFwiLz48cGF0aCBkPVwiTTEyIDhoLjAxXCIvPicsXG4gIC8vIFRyZWUtb2Ytcm93cyDigJQgdXNlZCBmb3IgXCJTcGxpdCBncm91cFwiIGFjdGlvbiAoZGVub3RlcyBvbmUgbm9kZSBmYW5uaW5nXG4gIC8vIG91dCBpbnRvIHNpYmxpbmdzKS4gTHVjaWRlJ3MgYGxpc3QtdHJlZWAuXG4gICdsaXN0LXRyZWUnOiAnPHBhdGggZD1cIk0yMSAxMmgtOFwiLz48cGF0aCBkPVwiTTIxIDZIOFwiLz48cGF0aCBkPVwiTTIxIDE4aC04XCIvPjxwYXRoIGQ9XCJNMyA2djRjMCAxLjEuOSAyIDIgMmgzXCIvPjxwYXRoIGQ9XCJNMyAxMHY2YzAgMS4xLjkgMiAyIDJoM1wiLz4nLFxuICAvLyBHZW5lcmljIHNwbGl0IGljb24gYXMgYSBmYWxsYmFjayBvcHRpb24uXG4gIHNwbGl0OiAnPHBhdGggZD1cIk0xNiAzaDV2NVwiLz48cGF0aCBkPVwiTTggM0gzdjVcIi8+PHBhdGggZD1cIm0yMSAzLTcuNDYgNy40NmEyIDIgMCAwIDAgMCAyLjgzTDIxIDIxXCIvPjxwYXRoIGQ9XCJNMyAzbDcuNDYgNy40NmEyIDIgMCAwIDEgMCAyLjgzTDMgMjFcIi8+JyxcbiAgLy8gQ2FyZGJvYXJkLXN0eWxlIGJveCB1c2VkIGZvciBcIkV4cG9ydCB3b3Jrc3BhY2UgYXMgWklQXCIuXG4gIHBhY2thZ2U6ICc8cGF0aCBkPVwibTcuNSA0LjI3IDkgNS4xNVwiLz48cGF0aCBkPVwiTTIxIDhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2WlwiLz48cGF0aCBkPVwiTTMuMyA3IDEyIDEybDguNy01XCIvPjxwYXRoIGQ9XCJNMTIgMjJWMTJcIi8+JyxcbiAgLy8gVHdvIGludGVybG9ja2luZyBsaW5rcyDigJQgdXNlZCBmb3IgXCJDb3B5IGFzIHBhdGhcIi5cbiAgbGluazogJzxwYXRoIGQ9XCJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MVwiLz48cGF0aCBkPVwiTTE0IDExYTUgNSAwIDAgMC03LjU0LS41NGwtMyAzYTUgNSAwIDAgMCA3LjA3IDcuMDdsMS43MS0xLjcxXCIvPicsXG4gIC8vIERhdGFiYXNlL2R1Y2sgaWNvbiBmb3IgdGhlIER1Y2tEQiBwYWxldHRlIGNvbW1hbmQuXG4gIGRhdGFiYXNlOiAnPGVsbGlwc2UgY3g9XCIxMlwiIGN5PVwiNVwiIHJ4PVwiOVwiIHJ5PVwiM1wiLz48cGF0aCBkPVwiTTMgNVYxOUE5IDMgMCAwIDAgMjEgMTlWNVwiLz48cGF0aCBkPVwiTTMgMTJBOSAzIDAgMCAwIDIxIDEyXCIvPicsXG59O1xuXG5jb25zdCB3cmFwID0gKGJvZHk6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPiR7Ym9keX08L3N2Zz5gO1xuXG5leHBvcnQgY29uc3QgUEdfSUNPTlMgPSB7XG4gIGhhczogKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4gbmFtZSBpbiBJQ09OUyxcbiAgc3ZnU3RyaW5nOiAobmFtZTogc3RyaW5nLCBzaXplID0gMTYpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBJQ09OU1tuYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2x1Y2lkZV0gbWlzc2luZyBpY29uJywgbmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiB3cmFwKGJvZHksIHNpemUpO1xuICB9LFxuICBtb3VudDogKGVsOiBFbGVtZW50IHwgbnVsbCwgbmFtZTogc3RyaW5nLCBzaXplPzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKGVsKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gIH0sXG59O1xuXG4vLyBTaWRlLWVmZmVjdCBmb3IgbGVnYWN5IHNjcmlwdC10YWcgaW5jbHVzaW9uIChzaWRlcGFuZWwuaHRtbCBzdGlsbCA8c2NyaXB0XG4vLyBzcmM9XCJsdWNpZGUuanNcIj4g4oCUIHByZS1idW5kbGUpLiBSZS1leHBvc2VzIHRoZSByZWdpc3RyeSBvbiBnbG9iYWxUaGlzLlxuaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAoZ2xvYmFsVGhpcyBhcyBhbnkpLlBHX0lDT05TID0gUEdfSUNPTlM7XG59XG4iLAogICAgIi8vIFVTVEFSLWZvcm1hdCB0YXIgZW5jb2Rlci4gRWFjaCBlbnRyeSBpcyBhIDUxMi1ieXRlIGhlYWRlciBmb2xsb3dlZCBieVxuLy8gY29udGVudCBieXRlcyBwYWRkZWQgdXAgdG8gdGhlIG5leHQgNTEyLWJ5dGUgYm91bmRhcnkuIFRoZSBhcmNoaXZlIGVuZHNcbi8vIHdpdGggdHdvIHplcm8tZmlsbGVkIDUxMi1ieXRlIGJsb2Nrcy4gfjgwIGxpbmVzLCBubyBkZXBlbmRlbmNpZXMuXG4vL1xuLy8gV2UgcGljayB0YXIgKHJhdGhlciB0aGFuIHppcCkgYmVjYXVzZSB6c3RkIGlzIHRoZSB3aXJlIGZvcm1hdCB3ZSB3YW50IHRvXG4vLyBwYWlyIGl0IHdpdGggYW5kIHRhci56c3QgaXMgdGhlIHN0YW5kYXJkIGNvbWJvICh6aXAgaXMgaXRzIG93blxuLy8gY29tcHJlc3Npb24gY29udGFpbmVyKS4gUGF0aHMgbG9uZ2VyIHRoYW4gMTAwIGNoYXJzIHVzZSB0aGUgc3RhbmRhcmRcbi8vIHVzdGFyIHByZWZpeCBmaWVsZCAoMTU1IGJ5dGVzIGF0IG9mZnNldCAzNDUpOiB0aGUgcGF0aCBpcyBzcGxpdCBhdCBhXG4vLyBzbGFzaCBpbnRvIHByZWZpeCjiiaQxNTUpL25hbWUo4omkMTAwKS4gT25seSB1bnNwbGl0dGFibGUgcGF0aHMgdGhyb3cg4oCUXG4vLyBHTlUvUEFYIGxvbmctbmFtZSBleHRlbnNpb25zIGFyZSBkZWxpYmVyYXRlbHkgbm90IGltcGxlbWVudGVkLlxuXG5jb25zdCBlbmMgPSBuZXcgVGV4dEVuY29kZXIoKTtcblxuY29uc3Qgd3JpdGVPY3RhbCA9IChidWY6IFVpbnQ4QXJyYXksIG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAvLyB0YXIgZmllbGRzIGFyZSB6ZXJvLXBhZGRlZCBudWxsLXRlcm1pbmF0ZWQgb2N0YWwgc3RyaW5ncy5cbiAgbGV0IHMgPSB2YWx1ZS50b1N0cmluZyg4KTtcbiAgcyA9IHMucGFkU3RhcnQobGVuZ3RoIC0gMSwgJzAnKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggLSAxOyBpKyspIGJ1ZltvZmZzZXQgKyBpXSA9IHMuY2hhckNvZGVBdChpKTtcbiAgYnVmW29mZnNldCArIGxlbmd0aCAtIDFdID0gMDtcbn07XG5cbmNvbnN0IHdyaXRlQXNjaWkgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgc3RyOiBzdHJpbmcsIGxlbmd0aDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIGNvbnN0IGJ5dGVzID0gZW5jLmVuY29kZShzdHIpO1xuICBjb25zdCBsZW4gPSBNYXRoLm1pbihieXRlcy5sZW5ndGgsIGxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVzW2ldITtcbn07XG5cbmNvbnN0IGhlYWRlckNoZWNrc3VtID0gKGhlYWRlcjogVWludDhBcnJheSk6IG51bWJlciA9PiB7XG4gIC8vIFRoZSBjaGVja3N1bSBmaWVsZCAoOCBieXRlcyBhdCBvZmZzZXQgMTQ4KSBpcyB0cmVhdGVkIGFzIEFTQ0lJIHNwYWNlc1xuICAvLyBkdXJpbmcgY29tcHV0YXRpb24sIHRoZW4gdGhlIGFjdHVhbCBjaGVja3N1bSBpcyB3cml0dGVuIGludG8gaXQuXG4gIGxldCBzdW0gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKSB7XG4gICAgaWYgKGkgPj0gMTQ4ICYmIGkgPCAxNTYpIHN1bSArPSAweDIwO1xuICAgIGVsc2Ugc3VtICs9IGhlYWRlcltpXSA/PyAwO1xuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG5leHBvcnQgdHlwZSBUYXJFbnRyeSA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICBkYXRhOiBVaW50OEFycmF5IHwgc3RyaW5nO1xuICBtdGltZT86IG51bWJlcjsgLy8gdW5peCBlcG9jaCBzZWNvbmRzOyBkZWZhdWx0cyB0byBub3dcbn07XG5cbi8vIHVzdGFyIG5hbWUgc3BsaXQ6IHBhdGhzIOKJpDEwMCBjaGFycyBnbyBzdHJhaWdodCBpbnRvIHRoZSBuYW1lIGZpZWxkO1xuLy8gbG9uZ2VyIHBhdGhzIHNwbGl0IGF0IHRoZSByaWdodG1vc3Qgc2xhc2ggdGhhdCBsZWF2ZXMgcHJlZml4IOKJpDE1NSBhbmRcbi8vIHRhaWwg4omkMTAwLiBUaGUgcmVhZGVyIHJlYXNzZW1ibGVzIGBwcmVmaXggKyAnLycgKyBuYW1lYC5cbmNvbnN0IHNwbGl0VGFyTmFtZSA9IChmdWxsOiBzdHJpbmcpOiB7bmFtZTogc3RyaW5nOyBwcmVmaXg6IHN0cmluZ30gPT4ge1xuICBpZiAoZnVsbC5sZW5ndGggPD0gMTAwKSByZXR1cm4ge25hbWU6IGZ1bGwsIHByZWZpeDogJyd9O1xuICBsZXQgY3V0ID0gLTE7XG4gIGZvciAobGV0IGkgPSBmdWxsLmluZGV4T2YoJy8nKTsgaSAhPT0gLTE7IGkgPSBmdWxsLmluZGV4T2YoJy8nLCBpICsgMSkpIHtcbiAgICBpZiAoaSA8PSAxNTUgJiYgZnVsbC5sZW5ndGggLSBpIC0gMSA8PSAxMDApIGN1dCA9IGk7XG4gIH1cbiAgaWYgKGN1dCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHRhcjogcGF0aCBub3Qgc3BsaXR0YWJsZSBpbnRvIHVzdGFyIHByZWZpeCgxNTUpL25hbWUoMTAwKTogJHtmdWxsfWApO1xuICB9XG4gIHJldHVybiB7cHJlZml4OiBmdWxsLnNsaWNlKDAsIGN1dCksIG5hbWU6IGZ1bGwuc2xpY2UoY3V0ICsgMSl9O1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkVGFyID0gKGVudHJpZXM6IFRhckVudHJ5W10pOiBVaW50OEFycmF5ID0+IHtcbiAgY29uc3QgYmxvY2tzOiBVaW50OEFycmF5W10gPSBbXTtcbiAgY29uc3Qgbm93U2VjID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZW50cnkuZGF0YSA9PT0gJ3N0cmluZycgPyBlbmMuZW5jb2RlKGVudHJ5LmRhdGEpIDogZW50cnkuZGF0YTtcbiAgICBjb25zdCB7bmFtZSwgcHJlZml4fSA9IHNwbGl0VGFyTmFtZShlbnRyeS5uYW1lKTtcbiAgICBjb25zdCBoZWFkZXIgPSBuZXcgVWludDhBcnJheSg1MTIpO1xuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAwLCBuYW1lLCAxMDApO1xuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMDAsIDBvNjQ0LCA4KTsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW9kZVxuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxMDgsIDAsIDgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdWlkXG4gICAgd3JpdGVPY3RhbChoZWFkZXIsIDExNiwgMCwgOCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnaWRcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTI0LCBkYXRhLmxlbmd0aCwgMTIpOyAgICAgICAgICAgICAgICAgIC8vIHNpemVcbiAgICB3cml0ZU9jdGFsKGhlYWRlciwgMTM2LCBlbnRyeS5tdGltZSA/PyBub3dTZWMsIDEyKTsgICAgICAgIC8vIG10aW1lXG4gICAgZm9yIChsZXQgaSA9IDE0ODsgaSA8IDE1NjsgaSsrKSBoZWFkZXJbaV0gPSAweDIwOyAgICAgICAgICAvLyBjaGVja3N1bSBwbGFjZWhvbGRlclxuICAgIGhlYWRlclsxNTZdID0gMHgzMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHlwZWZsYWcgJzAnID0gcmVndWxhciBmaWxlXG4gICAgd3JpdGVBc2NpaShoZWFkZXIsIDI1NywgJ3VzdGFyJywgNik7ICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWdpY1xuICAgIHdyaXRlQXNjaWkoaGVhZGVyLCAyNjMsICcwMCcsIDIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmVyc2lvblxuICAgIGlmIChwcmVmaXgpIHdyaXRlQXNjaWkoaGVhZGVyLCAzNDUsIHByZWZpeCwgMTU1KTsgICAgICAgICAgLy8gdXN0YXIgcHJlZml4XG4gICAgLy8gdW5hbWUvZ25hbWUvZGV2bWFqb3IvZGV2bWlub3IgbGVmdCB6ZXJvLlxuXG4gICAgY29uc3QgY2hlY2tzdW0gPSBoZWFkZXJDaGVja3N1bShoZWFkZXIpO1xuICAgIHdyaXRlT2N0YWwoaGVhZGVyLCAxNDgsIGNoZWNrc3VtLCA4KTtcblxuICAgIGJsb2Nrcy5wdXNoKGhlYWRlcik7XG4gICAgYmxvY2tzLnB1c2goZGF0YSk7XG4gICAgY29uc3QgcGFkID0gKDUxMiAtIChkYXRhLmxlbmd0aCAlIDUxMikpICUgNTEyO1xuICAgIGlmIChwYWQpIGJsb2Nrcy5wdXNoKG5ldyBVaW50OEFycmF5KHBhZCkpO1xuICB9XG4gIC8vIFRyYWlsZXI6IHR3byBjb25zZWN1dGl2ZSA1MTItYnl0ZSB6ZXJvIGJsb2Nrcy5cbiAgYmxvY2tzLnB1c2gobmV3IFVpbnQ4QXJyYXkoMTAyNCkpO1xuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHRvdGFsICs9IGIubGVuZ3RoO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheSh0b3RhbCk7XG4gIGxldCBvZmZzZXQgPSAwO1xuICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7IG91dC5zZXQoYiwgb2Zmc2V0KTsgb2Zmc2V0ICs9IGIubGVuZ3RoOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyDilIDilIDilIAgWnN0ZCByYXctYmxvY2sgZnJhbWUgd3JpdGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy9cbi8vIENvbXByZXNzaW9uU3RyZWFtKCd6c3RkJykgaXNuJ3Qgc2hpcHBlZCBpbiBjdXJyZW50IENocm9taXVtICh2ZXJpZmllZCB2aWFcbi8vIHJ1bnRpbWUgcHJvYmUpLCBzbyB3ZSB3cml0ZSBhIHZhbGlkIHpzdGQgZnJhbWUgY29udGFpbmluZyBvbmUgb3IgbW9yZVxuLy8gcmF3ICh1bmNvbXByZXNzZWQpIGJsb2Nrcy4gVGhlIG91dHB1dCBpcyBzdHJ1Y3R1cmFsbHkgYSByZWFsIGAudGFyLnpzdGBcbi8vIGZpbGU6IGB6c3RkIC1kYCBhY2NlcHRzIGl0LCA3LVppcCBhY2NlcHRzIGl0LCBsaWJ6c3RkIGFjY2VwdHMgaXQuIEl0XG4vLyBqdXN0IGRvZXNuJ3QgYWN0dWFsbHkgY29tcHJlc3Mg4oCUIGZvciBvdXIgcGF5bG9hZCwgd2hpY2ggaXMgbW9zdGx5IFBOR1xuLy8gKGFscmVhZHkgY29tcHJlc3NlZCkgcGx1cyBhIGZldyBLQiBvZiBKU09OTC9NYXJrZG93biwgdGhlIGxvc3MgdnMuIHJlYWxcbi8vIERFRkxBVEUgaXMgc2luZ2xlLWRpZ2l0IHBlcmNlbnQuXG4vL1xuLy8gRnJhbWUgbGF5b3V0IChwZXIgUkZDIDg4NzggKyBac3RhbmRhcmQgZm9ybWF0IHNwZWMpOlxuLy8gICBtYWdpY19udW1iZXIgICAgICAgNCBieXRlcyAgMHgyOCAweEI1IDB4MkYgMHhGRCAoTEU6IDB4RkQyRkI1MjgpXG4vLyAgIEZIRCAgICAgICAgICAgICAgICAxIGJ5dGUgICBGQ1Nfc2l6ZT0yICg0LWJ5dGUgRkNTKSwgU2luZ2xlX1NlZ21lbnQ9MVxuLy8gICBGQ1MgICAgICAgICAgICAgICAgNCBieXRlcyAgdW5jb21wcmVzc2VkIHBheWxvYWQgc2l6ZSAodTMyIExFKVxuLy8gICBibG9ja3MgICAgICAgICAgICAgTiBibG9ja3MgZWFjaDogMy1ieXRlIGhlYWRlciArIHBheWxvYWRcbi8vXG4vLyBCbG9jayBoZWFkZXIgKDMgYnl0ZXMgTEUpOlxuLy8gICBiaXQgMCAgICAgICBMYXN0X0Jsb2NrIGZsYWdcbi8vICAgYml0cyAxLi4yICAgQmxvY2tfVHlwZSAoMDAgPSBSYXcsIDAxID0gUkxFLCAxMCA9IENvbXByZXNzZWQsIDExID0gUmVzZXJ2ZWQpXG4vLyAgIGJpdHMgMy4uMjMgIEJsb2NrX1NpemUgKG1heCAxMjggS2lCIGZvciByYXcgLyBSTEUpXG4vL1xuLy8gV2UgY2h1bmsgaW50byAxMjggS2lCIHJhdyBibG9ja3MgdG8gcmVzcGVjdCB0aGUgcGVyLWJsb2NrIHNpemUgbGltaXQuXG5cbmNvbnN0IFpTVERfUkFXX0JMT0NLX01BWCA9IDEyOCAqIDEwMjQ7XG5cbmV4cG9ydCBjb25zdCB3cmFwWnN0ZCA9IChkYXRhOiBVaW50OEFycmF5KTogVWludDhBcnJheSA9PiB7XG4gIGNvbnN0IGJsb2NrczogVWludDhBcnJheVtdID0gW107XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zIDwgZGF0YS5sZW5ndGggfHwgZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCByZW1haW5pbmcgPSBkYXRhLmxlbmd0aCAtIHBvcztcbiAgICBjb25zdCBibG9ja1NpemUgPSBNYXRoLm1pbihyZW1haW5pbmcsIFpTVERfUkFXX0JMT0NLX01BWCk7XG4gICAgY29uc3QgaXNMYXN0ID0gcG9zICsgYmxvY2tTaXplID49IGRhdGEubGVuZ3RoID8gMSA6IDA7XG4gICAgY29uc3QgaGVhZGVySW50ID0gaXNMYXN0IHwgKDAgPDwgMSkgfCAoYmxvY2tTaXplIDw8IDMpOyAvLyB0eXBlPXJhdz0wXG4gICAgY29uc3QgYmxvY2tIZWFkZXIgPSBuZXcgVWludDhBcnJheShbXG4gICAgICBoZWFkZXJJbnQgJiAweGZmLFxuICAgICAgKGhlYWRlckludCA+Pj4gOCkgJiAweGZmLFxuICAgICAgKGhlYWRlckludCA+Pj4gMTYpICYgMHhmZixcbiAgICBdKTtcbiAgICBibG9ja3MucHVzaChibG9ja0hlYWRlcik7XG4gICAgaWYgKGJsb2NrU2l6ZSA+IDApIGJsb2Nrcy5wdXNoKGRhdGEuc3ViYXJyYXkocG9zLCBwb3MgKyBibG9ja1NpemUpKTtcbiAgICBwb3MgKz0gYmxvY2tTaXplO1xuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkgYnJlYWs7XG4gIH1cbiAgY29uc3QgZmNzID0gZGF0YS5sZW5ndGg7XG4gIGNvbnN0IGZoZCA9IDBiMTAxMF8wMDAwOyAvLyBGQ1Nfc2l6ZT0xMCAoNCBieXRlcykgfCBTaW5nbGVfU2VnbWVudD0xXG4gIGNvbnN0IGhlYWQgPSBuZXcgVWludDhBcnJheShbXG4gICAgMHgyOCwgMHhiNSwgMHgyZiwgMHhmZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWdpY1xuICAgIGZoZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRkhEXG4gICAgZmNzICYgMHhmZiwgKGZjcyA+Pj4gOCkgJiAweGZmLCAoZmNzID4+PiAxNikgJiAweGZmLCAoZmNzID4+PiAyNCkgJiAweGZmLFxuICBdKTtcbiAgbGV0IHRvdGFsID0gaGVhZC5sZW5ndGg7XG4gIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHRvdGFsICs9IGIubGVuZ3RoO1xuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheSh0b3RhbCk7XG4gIGxldCBvZmYgPSAwO1xuICBvdXQuc2V0KGhlYWQsIG9mZik7IG9mZiArPSBoZWFkLmxlbmd0aDtcbiAgZm9yIChjb25zdCBiIG9mIGJsb2NrcykgeyBvdXQuc2V0KGIsIG9mZik7IG9mZiArPSBiLmxlbmd0aDsgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gQ29tcGFuaW9uIGRlY29kZXIgZm9yIG91ciBvd24gd3JpdGVyIOKAlCB1c2VkIGJ5IHRlc3RzLiBBY2NlcHRzIGFueSB6c3RkXG4vLyBmcmFtZSB3cml0dGVuIGJ5IGB3cmFwWnN0ZGAgKHNpbmdsZSBSYXdfQmxvY2sgc3RyZWFtLCA0LWJ5dGUgRkNTLFxuLy8gc2luZ2xlLXNlZ21lbnQsIG5vIGNoZWNrc3VtLCBubyBkaWN0KS4gVGhyb3dzIG9uIGFueXRoaW5nIGVsc2Ugc28gdGVzdHNcbi8vIGZhaWwgbG91ZGx5IHJhdGhlciB0aGFuIHNpbGVudGx5IG1pcy1wYXJzZS5cbmV4cG9ydCBjb25zdCB1bndyYXBac3RkID0gKGZyYW1lOiBVaW50OEFycmF5KTogVWludDhBcnJheSA9PiB7XG4gIGlmIChmcmFtZS5sZW5ndGggPCA5KSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGZyYW1lIHRvbyBzaG9ydCcpO1xuICBpZiAoZnJhbWVbMF0gIT09IDB4MjggfHwgZnJhbWVbMV0gIT09IDB4YjUgfHwgZnJhbWVbMl0gIT09IDB4MmYgfHwgZnJhbWVbM10gIT09IDB4ZmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGJhZCBtYWdpYyBudW1iZXInKTtcbiAgfVxuICBjb25zdCBmaGQgPSBmcmFtZVs0XSE7XG4gIGNvbnN0IGZjc1NpemVGbGFnID0gKGZoZCA+Pj4gNikgJiAwYjExO1xuICBjb25zdCBzaW5nbGVTZWdtZW50ID0gKChmaGQgPj4+IDUpICYgMSkgPT09IDE7XG4gIGNvbnN0IGNoZWNrc3VtID0gKChmaGQgPj4+IDIpICYgMSkgPT09IDE7XG4gIGNvbnN0IGRpY3RJZCA9IGZoZCAmIDBiMTE7XG4gIGlmICghc2luZ2xlU2VnbWVudCkgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiBvbmx5IFNpbmdsZV9TZWdtZW50IGZyYW1lcyBzdXBwb3J0ZWQnKTtcbiAgaWYgKGNoZWNrc3VtKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGNvbnRlbnQgY2hlY2tzdW0gbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoZGljdElkKSB0aHJvdyBuZXcgRXJyb3IoJ3pzdGQ6IGRpY3Rpb25hcmllcyBub3Qgc3VwcG9ydGVkJyk7XG4gIGxldCBwb3MgPSA1O1xuICBsZXQgZmNzID0gMDtcbiAgaWYgKGZjc1NpemVGbGFnID09PSAwYjAwKSB7IGZjcyA9IGZyYW1lW3Bvc10hOyBwb3MgKz0gMTsgfVxuICBlbHNlIGlmIChmY3NTaXplRmxhZyA9PT0gMGIwMSkgeyBmY3MgPSBmcmFtZVtwb3NdISB8IChmcmFtZVtwb3MgKyAxXSEgPDwgOCk7IGZjcyArPSAyNTY7IHBvcyArPSAyOyB9XG4gIGVsc2UgaWYgKGZjc1NpemVGbGFnID09PSAwYjEwKSB7IGZjcyA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KSB8IChmcmFtZVtwb3MgKyAyXSEgPDwgMTYpIHwgKGZyYW1lW3BvcyArIDNdISAqIDB4MTAwMDAwMCk7IHBvcyArPSA0OyB9XG4gIGVsc2UgdGhyb3cgbmV3IEVycm9yKCd6c3RkOiA4LWJ5dGUgRkNTIHVuc3VwcG9ydGVkJyk7XG4gIGNvbnN0IG91dCA9IG5ldyBVaW50OEFycmF5KGZjcyk7XG4gIGxldCBvdXRQb3MgPSAwO1xuICBmb3IgKDs7KSB7XG4gICAgaWYgKHBvcyArIDMgPiBmcmFtZS5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignenN0ZDogdHJ1bmNhdGVkIGJsb2NrIGhlYWRlcicpO1xuICAgIGNvbnN0IGhlYWRlckludCA9IGZyYW1lW3Bvc10hIHwgKGZyYW1lW3BvcyArIDFdISA8PCA4KSB8IChmcmFtZVtwb3MgKyAyXSEgPDwgMTYpO1xuICAgIHBvcyArPSAzO1xuICAgIGNvbnN0IGlzTGFzdCA9IChoZWFkZXJJbnQgJiAxKSA9PT0gMTtcbiAgICBjb25zdCBibG9ja1R5cGUgPSAoaGVhZGVySW50ID4+PiAxKSAmIDBiMTE7XG4gICAgY29uc3QgYmxvY2tTaXplID0gKGhlYWRlckludCA+Pj4gMykgJiAweDFmX2ZmX2ZmO1xuICAgIGlmIChibG9ja1R5cGUgIT09IDApIHRocm93IG5ldyBFcnJvcihgenN0ZDogb25seSBSYXdfQmxvY2sgKDApIHN1cHBvcnRlZCwgZ290ICR7YmxvY2tUeXBlfWApO1xuICAgIGlmIChwb3MgKyBibG9ja1NpemUgPiBmcmFtZS5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignenN0ZDogdHJ1bmNhdGVkIGJsb2NrIHBheWxvYWQnKTtcbiAgICBvdXQuc2V0KGZyYW1lLnN1YmFycmF5KHBvcywgcG9zICsgYmxvY2tTaXplKSwgb3V0UG9zKTtcbiAgICBvdXRQb3MgKz0gYmxvY2tTaXplO1xuICAgIHBvcyArPSBibG9ja1NpemU7XG4gICAgaWYgKGlzTGFzdCkgYnJlYWs7XG4gIH1cbiAgaWYgKG91dFBvcyAhPT0gZmNzKSB0aHJvdyBuZXcgRXJyb3IoYHpzdGQ6IEZDUyBtaXNtYXRjaCAoZ290ICR7b3V0UG9zfSwgZXhwZWN0ZWQgJHtmY3N9KWApO1xuICByZXR1cm4gb3V0O1xufTtcblxuLy8g4pSA4pSA4pSAIFRhciBsaXN0aW5nIGRlY29kZXIgKHRlc3Qtb25seSkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBXYWxrcyBhIHRhciBieXRlIGJ1ZmZlciwgcmV0dXJuaW5nIHtuYW1lLCBkYXRhfSBmb3IgZWFjaCBlbnRyeS4gU3RvcHMgYXRcbi8vIHRoZSB0cmFpbGVyICh0d28gemVybyBibG9ja3MpLiBPbmx5IHJlYWRzIHRoZSBmaWVsZHMgUGluY2hHcmFiIHdyaXRlcy5cblxuZXhwb3J0IHR5cGUgUGFyc2VkVGFyRW50cnkgPSB7bmFtZTogc3RyaW5nOyBkYXRhOiBVaW50OEFycmF5OyBzaXplOiBudW1iZXJ9O1xuXG5jb25zdCBkZWMgPSBuZXcgVGV4dERlY29kZXIoKTtcblxuY29uc3QgcmVhZE51bGxTdHIgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICBsZXQgZW5kID0gb2Zmc2V0ICsgbGVuZ3RoO1xuICBmb3IgKGxldCBpID0gb2Zmc2V0OyBpIDwgb2Zmc2V0ICsgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldID09PSAwKSB7IGVuZCA9IGk7IGJyZWFrOyB9XG4gIH1cbiAgcmV0dXJuIGRlYy5kZWNvZGUoYnVmLnN1YmFycmF5KG9mZnNldCwgZW5kKSk7XG59O1xuXG5jb25zdCByZWFkT2N0YWwgPSAoYnVmOiBVaW50OEFycmF5LCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICBjb25zdCBzID0gcmVhZE51bGxTdHIoYnVmLCBvZmZzZXQsIGxlbmd0aCkudHJpbSgpO1xuICByZXR1cm4gcyA/IHBhcnNlSW50KHMsIDgpIDogMDtcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVRhciA9IChidWY6IFVpbnQ4QXJyYXkpOiBQYXJzZWRUYXJFbnRyeVtdID0+IHtcbiAgY29uc3QgZW50cmllczogUGFyc2VkVGFyRW50cnlbXSA9IFtdO1xuICBsZXQgcG9zID0gMDtcbiAgd2hpbGUgKHBvcyArIDUxMiA8PSBidWYubGVuZ3RoKSB7XG4gICAgY29uc3QgaGVhZGVyID0gYnVmLnN1YmFycmF5KHBvcywgcG9zICsgNTEyKTtcbiAgICBsZXQgYWxsWmVybyA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MTI7IGkrKykgeyBpZiAoaGVhZGVyW2ldICE9PSAwKSB7IGFsbFplcm8gPSBmYWxzZTsgYnJlYWs7IH0gfVxuICAgIGlmIChhbGxaZXJvKSBicmVhazsgLy8gdHJhaWxlclxuICAgIGNvbnN0IHNob3J0TmFtZSA9IHJlYWROdWxsU3RyKGhlYWRlciwgMCwgMTAwKTtcbiAgICBjb25zdCBwcmVmaXggPSByZWFkTnVsbFN0cihoZWFkZXIsIDM0NSwgMTU1KTtcbiAgICBjb25zdCBuYW1lID0gcHJlZml4ID8gYCR7cHJlZml4fS8ke3Nob3J0TmFtZX1gIDogc2hvcnROYW1lO1xuICAgIGNvbnN0IHNpemUgPSByZWFkT2N0YWwoaGVhZGVyLCAxMjQsIDEyKTtcbiAgICBwb3MgKz0gNTEyO1xuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgZW50cmllcy5wdXNoKHtuYW1lLCBzaXplLCBkYXRhOiBidWYuc3ViYXJyYXkocG9zLCBwb3MgKyBzaXplKX0pO1xuICAgICAgcG9zICs9IHNpemU7XG4gICAgICBjb25zdCBwYWQgPSAoNTEyIC0gKHNpemUgJSA1MTIpKSAlIDUxMjtcbiAgICAgIHBvcyArPSBwYWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBlbnRyaWVzO1xufTtcbiIsCiAgICAiLy8gQXV0by1nZW5lcmF0ZWQgYnkgc2NyaXB0cy9idWlsZC1leHRlbnNpb24udHMg4oCUIGRvIG5vdCBlZGl0LlxuLy8gVGVsbHMgdGhlIHNpZGVwYW5lbCB3aGljaCB0ZW1wbGF0ZSByZXNvdXJjZXMgZXhpc3QgaW4gdGhpcyBidWlsZC5cbi8vIEFjdHVhbCBjb250ZW50IGxpdmVzIGFzIC5tZCBmaWxlcyB1bmRlciBleHRlbnNpb24vdGVtcGxhdGVzLywgbG9hZGVkXG4vLyBsYXppbHkgdmlhIGNocm9tZS5ydW50aW1lLmdldFVSTCDigJQgc2VlIGxvYWRUZW1wbGF0ZSgpIGluIHNpZGVwYW5lbC50cy5cbmV4cG9ydCBjb25zdCBURU1QTEFURVNfUFJFU0VOVCA9IHtcImRlc2lnblRlbXBsYXRlXCI6dHJ1ZSxcInNraWxsVGVtcGxhdGVcIjp0cnVlLFwibG9jYWxEZXNpZ25cIjp0cnVlLFwibG9jYWxTa2lsbFwiOnRydWV9IGFzIGNvbnN0O1xuIiwKICAgICIvLyBBdXRvLWdlbmVyYXRlZCBieSBzY3JpcHRzL2J1aWxkLWV4dGVuc2lvbi50cyDigJQgZG8gbm90IGVkaXQuXG4vLyBJbnZlbnRvcnkgb2YgdmVuZG9yZWQgc2tpbGwgcmVzb3VyY2VzIHVuZGVyIGV4dGVuc2lvbi9za2lsbHMvIChzb3VyY2Ugb2Zcbi8vIHRydXRoOiB0aGlyZF9wYXJ0eS8qL1VQU1RSRUFNLmxvY2sgdmlhIHNjcmlwdHMvc3luYy1idW5kbGVkLXNraWxscy50cykuXG4vLyBgZXh0YCBpcyB0aGUgZXh0ZW5zaW9uLXJlbGF0aXZlIGZldGNoIHBhdGg7IGBhcmNoaXZlYCBpcyB3aGVyZSB0aGUgZmlsZVxuLy8gbGFuZHMgaW5zaWRlIGFuIGV4cG9ydGVkIC50YXIuenN0IGJ1bmRsZS5cbmV4cG9ydCBjb25zdCBCVU5ETEVEX1NLSUxMU19QUkVTRU5UID0gdHJ1ZTtcbmV4cG9ydCB0eXBlIEJ1bmRsZWRTa2lsbEZpbGUgPSB7ZXh0OiBzdHJpbmc7IGFyY2hpdmU6IHN0cmluZzsgYnl0ZXM6IG51bWJlcn07XG5leHBvcnQgY29uc3QgQlVORExFRF9TS0lMTF9GSUxFUzogQnVuZGxlZFNraWxsRmlsZVtdID0gW1xuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYWRhcHQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hZGFwdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTAzMDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FkYXB0Lm5hdGl2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzkxMFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYW5kcm9pZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuZHJvaWQubWRcIixcbiAgICBcImJ5dGVzXCI6IDMyMjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2FuaW1hdGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hbmltYXRlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMDcwOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9hdWRpdC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNzQzOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubmF0aXZlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYXVkaXQubmF0aXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA4MzEzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ib2xkZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9ib2xkZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDcwOTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2JyYW5kLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvYnJhbmQubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNDc3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jbGFyaWZ5Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY2xhcmlmeS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTA2NDZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvZGV4Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29kZXgubWRcIixcbiAgICBcImJ5dGVzXCI6IDcwMDJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NvbG9yaXplLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY29sb3JpemUubWRcIixcbiAgICBcImJ5dGVzXCI6IDEzNTY4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcmFmdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2NyYWZ0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTk0NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvY3JpdGlxdWUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9jcml0aXF1ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDEyOTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2RlbGlnaHQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kZWxpZ2h0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA5ODI3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kaXN0aWxsLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZGlzdGlsbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTc0MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvZG9jdW1lbnQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9kb2N1bWVudC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjc5NjZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2V4dHJhY3QubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9leHRyYWN0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzNDMxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9oYXJkZW4ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9oYXJkZW4ubWRcIixcbiAgICBcImJ5dGVzXCI6IDg1OTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2hvb2tzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaG9va3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDkyNTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2luaXQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pbml0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxODk1MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW50ZXJhY3Rpb24tZGVzaWduLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvaW50ZXJhY3Rpb24tZGVzaWduLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2NTc1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pb3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9pb3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDMwMzdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xheW91dC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xheW91dC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTE3OTBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL2xpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9saXZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA2MDE1NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb25ib2FyZC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29uYm9hcmQubWRcIixcbiAgICBcImJ5dGVzXCI6IDc3NDBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL29wdGltaXplLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2Uvb3B0aW1pemUubWRcIixcbiAgICBcImJ5dGVzXCI6IDc1OTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL292ZXJkcml2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL292ZXJkcml2ZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogOTEzOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcG9saXNoLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwiLmFnZW50cy9za2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcG9saXNoLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMjk1NVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvcHJvZHVjdC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3Byb2R1Y3QubWRcIixcbiAgICBcImJ5dGVzXCI6IDM3NThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3F1aWV0ZXIubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9xdWlldGVyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0OTExXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL3JlZmVyZW5jZS9zaGFwZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3NoYXBlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMTUyM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvaW1wZWNjYWJsZS9yZWZlcmVuY2UvdHlwZXNldC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvcmVmZXJlbmNlL3R5cGVzZXQubWRcIixcbiAgICBcImJ5dGVzXCI6IDE3MTM1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL0xJQ0VOU0VcIixcbiAgICBcImFyY2hpdmVcIjogXCIuYWdlbnRzL3NraWxscy9pbXBlY2NhYmxlL0xJQ0VOU0VcIixcbiAgICBcImJ5dGVzXCI6IDEwNzY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9pbXBlY2NhYmxlL05PVElDRS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcIi5hZ2VudHMvc2tpbGxzL2ltcGVjY2FibGUvTk9USUNFLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1MDNcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL21hcmtldHBsYWNlLmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9tYXJrZXRwbGFjZS5qc29uXCIsXG4gICAgXCJieXRlc1wiOiAxMTk0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uY2xhdWRlLXBsdWdpbi9wbHVnaW4uanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5jbGF1ZGUtcGx1Z2luL3BsdWdpbi5qc29uXCIsXG4gICAgXCJieXRlc1wiOiA3NTVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvRlVORElORy55bWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0ZVTkRJTkcueW1sXCIsXG4gICAgXCJieXRlc1wiOiA0N1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9kZXNpZ24tc3lzdGVtLXByb2ZpbGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2Rlc2lnbi1zeXN0ZW0tcHJvZmlsZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjgxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2ZyYW1ld29yay1jb3JyZWN0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9mcmFtZXdvcmstY29ycmVjdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzg5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2xlYXJuaW5nLXN1Ym1pc3Npb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL2xlYXJuaW5nLXN1Ym1pc3Npb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDM2NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vLmdpdGh1Yi9JU1NVRV9URU1QTEFURS9uZXctaGV1cmlzdGljLXJ1bGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL0lTU1VFX1RFTVBMQVRFL25ldy1oZXVyaXN0aWMtcnVsZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjkyXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aHViL1BVTExfUkVRVUVTVF9URU1QTEFURS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRodWIvUFVMTF9SRVFVRVNUX1RFTVBMQVRFLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NDJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduLy5naXRpZ25vcmVcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi8uZ2l0aWdub3JlXCIsXG4gICAgXCJieXRlc1wiOiA2NjVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NIQU5HRUxPRy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NIQU5HRUxPRy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTMxNTBcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NJVEFUSU9OLmNmZlwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NJVEFUSU9OLmNmZlwiLFxuICAgIFwiYnl0ZXNcIjogMTIxMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09ERV9PRl9DT05EVUNULm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09ERV9PRl9DT05EVUNULm1kXCIsXG4gICAgXCJieXRlc1wiOiAyNzRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVElORy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL0NPTlRSSUJVVElORy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTU2MVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUT1JTLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vQ09OVFJJQlVUT1JTLm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMzhcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL0xJQ0VOU0VcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9MSUNFTlNFXCIsXG4gICAgXCJieXRlc1wiOiAxMTU1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9OT1RJQ0VcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9OT1RJQ0VcIixcbiAgICBcImJ5dGVzXCI6IDQ1ODJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL1JFQURNRS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL1JFQURNRS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjE3MDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FsbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FsbC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzE4MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29tbWFuZHMvYW5hbHl6ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2FuYWx5emUubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNzc1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9ldmFsdWF0ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL2V2YWx1YXRlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyODM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb21tYW5kcy9zb2x2ZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvbW1hbmRzL3NvbHZlLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNjEzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9hbnRpLXBhdHRlcm5zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvYW50aS1wYXR0ZXJucy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjY3OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvY29uc3RpdHV0aW9uYWwtY29uc3RyYWludHMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9jb25zdGl0dXRpb25hbC1jb25zdHJhaW50cy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDU5MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvb3V0cHV0LXNjaGVtYS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL291dHB1dC1zY2hlbWEubWRcIixcbiAgICBcImJ5dGVzXCI6IDEwNTE4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS9wZmQtbGF5ZXItcnVicmljLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcGZkLWxheWVyLXJ1YnJpYy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTEyOTZcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9jb3JlL3BzeWNob2xvZ3kvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2NvcmUvcHN5Y2hvbG9neS9tdnMtcHN5Y2hvbG9neS1yZWZlcmVuY2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDIzNDI1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS90aWVyMi1wcm9tcHQtdGVtcGxhdGUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvY29yZS90aWVyMi1wcm9tcHQtdGVtcGxhdGUubWRcIixcbiAgICBcImJ5dGVzXCI6IDE1ODg4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvc2hvcGlmeS10aGVtZXMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvc2hvcGlmeS10aGVtZXMubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3MDMzXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3MvdGFpbHdpbmQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3MvdGFpbHdpbmQubWRcIixcbiAgICBcImJ5dGVzXCI6IDI3NDk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvZGVzaWduLXN5c3RlbXMvd2ViLWZyYW1ld29ya3Mvd29yZHByZXNzLXRoZW1lcy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9kZXNpZ24tc3lzdGVtcy93ZWItZnJhbWV3b3Jrcy93b3JkcHJlc3MtdGhlbWVzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMjI0NlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2ZvdW5kYXRpb24tcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9mb3VuZGF0aW9uLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDMzODgxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDEtcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMS1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAzNjEzOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wyLXJ1bGVzLnlhbWxcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDItcnVsZXMueWFtbFwiLFxuICAgIFwiYnl0ZXNcIjogMzkyNTJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sMy1ydWxlcy55YW1sXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL2hldXJpc3RpY3MvdW5pdmVyc2FsL2wzLXJ1bGVzLnlhbWxcIixcbiAgICBcImJ5dGVzXCI6IDIxNjc3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvaGV1cmlzdGljcy91bml2ZXJzYWwvbDQtcnVsZXMueWFtbFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy9oZXVyaXN0aWNzL3VuaXZlcnNhbC9sNC1ydWxlcy55YW1sXCIsXG4gICAgXCJieXRlc1wiOiAyNDgwNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1jcm9zcy1sYXllci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtY3Jvc3MtbGF5ZXIubWRcIixcbiAgICBcImJ5dGVzXCI6IDI4NTU0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLWV4Y2VsbGVudC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtZXhjZWxsZW50Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNzAyOFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1nb29kLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1nb29kLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMTMzM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS1tZWRpb2NyZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtbWVkaW9jcmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDI0Mzc3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXBvb3IubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXBvb3IubWRcIixcbiAgICBcImJ5dGVzXCI6IDI2MTM4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXRlcnJpYmxlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vY29ycHVzL3dvcmtlZC1leGFtcGxlcy93ZWIvZXhhbXBsZS10ZXJyaWJsZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjAxOTRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL2NvcnB1cy93b3JrZWQtZXhhbXBsZXMvd2ViL2V4YW1wbGUtdW5jb252ZW50aW9uYWwubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9jb3JwdXMvd29ya2VkLWV4YW1wbGVzL3dlYi9leGFtcGxlLXVuY29udmVudGlvbmFsLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyMzYzM1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL0FESEQtQ1VSQi1DVVQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9mcmFtZXdvcmsvQURIRC1DVVJCLUNVVC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTMwNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL1BFUkNFUFRJT04tRklSU1QtREVTSUdOLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vZnJhbWV3b3JrL1BFUkNFUFRJT04tRklSU1QtREVTSUdOLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5ODc3MFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vbGxtcy50eHRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9sbG1zLnR4dFwiLFxuICAgIFwiYnl0ZXNcIjogNjU0NFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2NyaXB0cy9nZW4tcGZkLWluZGV4LnB5XCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2NyaXB0cy9nZW4tcGZkLWluZGV4LnB5XCIsXG4gICAgXCJieXRlc1wiOiA0NTQ4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL1NLSUxMLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9TS0lMTC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjkyNTlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9hY2N1bXVsYXRlZC1sZWFybmluZ3MubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvYWNjdW11bGF0ZWQtbGVhcm5pbmdzLm1kXCIsXG4gICAgXCJieXRlc1wiOiA3MjJcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9jaXRhdGlvbi1zdGFuZGFyZHMubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvY2l0YXRpb24tc3RhbmRhcmRzLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxMzQzMVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2luc2lnaHRzLWxvZy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9pbnNpZ2h0cy1sb2cubWRcIixcbiAgICBcImJ5dGVzXCI6IDc0MlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMC9sMDE4LWJhY2tlbmQtbWVjaGFuaWNzLWFzLWZyb250ZW5kLWNvbXBsZXhpdHkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wwL2wwMTgtYmFja2VuZC1tZWNoYW5pY3MtYXMtZnJvbnRlbmQtY29tcGxleGl0eS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzYxNVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMS9sMDExLXZpc3VhbC1jaGFubmVsLWF1ZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMS9sMDExLXZpc3VhbC1jaGFubmVsLWF1ZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiAzMTQ4XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTMta2V5Ym9hcmQtZGVuc2l0eS1pcy1sMi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxMy1rZXlib2FyZC1kZW5zaXR5LWlzLWwyLm1kXCIsXG4gICAgXCJieXRlc1wiOiAxNDUxXG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMTYtbmVhci1taXNzLWNvbG9yLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDIvbDAxNi1uZWFyLW1pc3MtY29sb3ItYXN5bW1ldHJ5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA2MTM2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0wyL2wwMjQtYWEtY29uc3RyYWluZWQtdG9rZW4tbGFkZGVyLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMi9sMDI0LWFhLWNvbnN0cmFpbmVkLXRva2VuLWxhZGRlci5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTAzMFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMy9sMDIzLWZhbHNpZmlhYmlsaXR5LXRyaWFkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MMy9sMDIzLWZhbHNpZmlhYmlsaXR5LXRyaWFkLm1kXCIsXG4gICAgXCJieXRlc1wiOiA0Njk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDMtcHJlLXNlbmQtdnMtcG9zdC1yZXNwb25zZS5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwMy1wcmUtc2VuZC12cy1wb3N0LXJlc3BvbnNlLm1kXCIsXG4gICAgXCJieXRlc1wiOiA4MDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvTDQvbDAwNi1pbmZyYXN0cnVjdHVyZS12cy1hY3RpdmF0aW9uLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA2LWluZnJhc3RydWN0dXJlLXZzLWFjdGl2YXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDkzN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDA4LWVwaXN0ZW1pYy1hc3ltbWV0cnkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMDgtZXBpc3RlbWljLWFzeW1tZXRyeS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogODk5XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL0w0L2wwMjItbDQtc3ltbWV0cnktdGhyZXNob2xkLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9MNC9sMDIyLWw0LXN5bW1ldHJ5LXRocmVzaG9sZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDUyMFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9faW5kZXgubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19pbmRleC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMzczNFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9fc2VhcmNoLmpzb25cIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL19zZWFyY2guanNvblwiLFxuICAgIFwiYnl0ZXNcIjogMTQxMDRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAwOS10ZW1wb3JhbC1zZXNzaW9uLWNvbnRpbnVpdHkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMDktdGVtcG9yYWwtc2Vzc2lvbi1jb250aW51aXR5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA5NjlcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAxMi1yb3V0ZS12cy1zdXJ2ZXkta25vd2xlZGdlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDEyLXJvdXRlLXZzLXN1cnZleS1rbm93bGVkZ2UubWRcIixcbiAgICBcImJ5dGVzXCI6IDkzOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE1LWV4cGVyaWVudGlhbC1zZWxmLWNvbnRyYWRpY3Rpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTUtZXhwZXJpZW50aWFsLXNlbGYtY29udHJhZGljdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMTY1OFxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDE5LW11bHRpLWFydGlmYWN0LWVuZ2FnZW1lbnQtZmllbGQubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMTktbXVsdGktYXJ0aWZhY3QtZW5nYWdlbWVudC1maWVsZC5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNTQ5M1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDIxLWw0LWV0aGljcy1mdXNpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjEtbDQtZXRoaWNzLWZ1c2lvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNDExOVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI1LWNhc2NhZGUtY3JlZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9jcm9zcy9sMDI1LWNhc2NhZGUtY3JlZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NDE1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjYtYWVzdGhldGljLXN0YWJpbGl0eS1hcy10cnVzdC1wcm9kdWNlci5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyNi1hZXN0aGV0aWMtc3RhYmlsaXR5LWFzLXRydXN0LXByb2R1Y2VyLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1ODA0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL2Nyb3NzL2wwMjgtaGVsZC1kZWNpc2lvbi1jb21wb3VuZGluZy5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvY3Jvc3MvbDAyOC1oZWxkLWRlY2lzaW9uLWNvbXBvdW5kaW5nLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1Mjc1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMS1nZW5lcmF0aXZlLXZzLWV2YWx1YXRpdmUubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwMS1nZW5lcmF0aXZlLXZzLWV2YWx1YXRpdmUubWRcIixcbiAgICBcImJ5dGVzXCI6IDY3M1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDItYWNjZXNzLXZzLXNpZ25hbC5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDAyLWFjY2Vzcy12cy1zaWduYWwubWRcIixcbiAgICBcImJ5dGVzXCI6IDc1OVxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDQtd29ya3NwYWNlLXZzLXByb2R1Y3Qtc2VwYXJhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA0LXdvcmtzcGFjZS12cy1wcm9kdWN0LXNlcGFyYXRpb24ubWRcIixcbiAgICBcImJ5dGVzXCI6IDkwN1xuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMDUtcmVjdXJzaXZlLXZhbGlkYXRpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNS1yZWN1cnNpdmUtdmFsaWRhdGlvbi5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAwNy1jb252ZXJnZW50LWdhcC1pZGVudGlmaWNhdGlvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDA3LWNvbnZlcmdlbnQtZ2FwLWlkZW50aWZpY2F0aW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA5MThcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDEwLWNvbnN0cmFpbnRzLWFyZS1kaXN0cmlidXRpb25zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTAtY29uc3RyYWludHMtYXJlLWRpc3RyaWJ1dGlvbnMubWRcIixcbiAgICBcImJ5dGVzXCI6IDI5MDdcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE0LW9wZXJhdGlvbmFsLXZzLXN0cnVjdHVyYWwtZXRoaWNzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMTQtb3BlcmF0aW9uYWwtdnMtc3RydWN0dXJhbC1ldGhpY3MubWRcIixcbiAgICBcImJ5dGVzXCI6IDE1MjRcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDE3LWl0ZXJhdGl2ZS1yZWdyZXNzaW9uLWlzLXZpc2liaWxpdHkubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAxNy1pdGVyYXRpdmUtcmVncmVzc2lvbi1pcy12aXNpYmlsaXR5Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA0NzM3XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyMC1pbnRlcm5hdGlvbmFsLWNpdGF0aW9uLWV4cGFuc2lvbi5tZFwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInBlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9sZWFybmluZ3MvbWV0YS9sMDIwLWludGVybmF0aW9uYWwtY2l0YXRpb24tZXhwYW5zaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiA1NjY1XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbGVhcm5pbmdzL21ldGEvbDAyNy1pbnRlcm5hbC1hY2tub3dsZWRnbWVudC1zaWduYWxzLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjctaW50ZXJuYWwtYWNrbm93bGVkZ21lbnQtc2lnbmFscy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjcxMlxuICB9LFxuICB7XG4gICAgXCJleHRcIjogXCJza2lsbHMvcGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjktcG9ydC1kb250LWluc3RhbGwtbW90aW9uLWF1ZGl0Lm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL2xlYXJuaW5ncy9tZXRhL2wwMjktcG9ydC1kb250LWluc3RhbGwtbW90aW9uLWF1ZGl0Lm1kXCIsXG4gICAgXCJieXRlc1wiOiA2MDI0XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvbXZzLXBzeWNob2xvZ3ktcmVmZXJlbmNlLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL212cy1wc3ljaG9sb2d5LXJlZmVyZW5jZS5tZFwiLFxuICAgIFwiYnl0ZXNcIjogMjk3ODVcbiAgfSxcbiAge1xuICAgIFwiZXh0XCI6IFwic2tpbGxzL3BlcmNlcHRpb24tZmlyc3QtZGVzaWduL3NraWxscy9wZmQvcmVmZXJlbmNlcy9wZmQtc3BhdGlhbC1leHRlbnNpb24ubWRcIixcbiAgICBcImFyY2hpdmVcIjogXCJwZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcGZkLXNwYXRpYWwtZXh0ZW5zaW9uLm1kXCIsXG4gICAgXCJieXRlc1wiOiAyOTU2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9wZXJjZXB0aW9uLWZpcnN0LWRlc2lnbi9za2lsbHMvcGZkL3JlZmVyZW5jZXMvcHJhY3RpdGlvbmVyLWNvcnJlY3Rpb25zLm1kXCIsXG4gICAgXCJhcmNoaXZlXCI6IFwicGVyY2VwdGlvbi1maXJzdC1kZXNpZ24vc2tpbGxzL3BmZC9yZWZlcmVuY2VzL3ByYWN0aXRpb25lci1jb3JyZWN0aW9ucy5tZFwiLFxuICAgIFwiYnl0ZXNcIjogNjY2XG4gIH0sXG4gIHtcbiAgICBcImV4dFwiOiBcInNraWxscy9za2lsbHMtaW5kZXguanNvblwiLFxuICAgIFwiYXJjaGl2ZVwiOiBcInNraWxscy1pbmRleC5qc29uXCIsXG4gICAgXCJieXRlc1wiOiAxMDExM1xuICB9XG5dO1xuIiwKICAgICIvLyBTaW5nbGUtY2FwdHVyZSBmdWxsIGV4cG9ydC5cbi8vXG4vLyBcIkNvcHkgY2FwdHVyZSBhcyBKU09OXCIgd2FudHMgYSBDT01QTEVURSwgc2VsZi1jb250YWluZWQgdGV4dHVhbCBleHBvcnQgb2Zcbi8vIE9ORSBjYXB0dXJlOiBpdHMgc2VsZWN0b3JzL3BhdGhzLCBlbGVtZW50IHRleHQvY29udGVudCwgb3V0ZXJIVE1MLFxuLy8gbWV0YWRhdGEsIEFORCBldmVyeSBub3RlL2NvbW1lbnQgYXR0YWNoZWQgdG8gaXQg4oCUIGV2ZXJ5dGhpbmcgYSBmdWxsXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IGNhcnJpZXMsIGJ1dCBzY29wZWQgdG8gYSBzaW5nbGUgZWxlbWVudC5cbi8vXG4vLyBUaGUgcGFuZWwgbW9kZWxzIGEgY2FwdHVyZSBhcyBhbiBgRW50cnlgIChzcmMvdHlwZXMudHMpIHBsdXMgemVybyBvciBtb3JlXG4vLyBgRmVlZGJhY2tNZXNzYWdlYCByb3dzIGxpbmtlZCBiYWNrIHZpYSBgcGFyZW50VWlkIOKGkiBFbnRyeS51aWRgLiBCZWNhdXNlXG4vLyBub3RlcyBsaXZlIG9uIHNlcGFyYXRlIHJvd3MsIHRoZSBzZXJpYWxpemVyIHRha2VzIHRoZSBjYXB0dXJlIGVudHJ5IGFuZFxuLy8gaXRzIGZlZWRiYWNrIHJvd3MgdG9nZXRoZXIgc28gdGhlIEpTT04gaXMgZ2VudWluZWx5IHNlbGYtY29udGFpbmVkIOKAlCBhXG4vLyBjYWxsZXIgY2FuIGhhbmQgdGhlIG91dHB1dCB0byBhbiBhZ2VudCBhbmQgbm90aGluZyBkYW5nbGVzLlxuLy9cbi8vIEdyb3VwIGhlYWRzIChBbHQrU2hpZnQrQ2xpY2sgc2VsZWN0aW9ucykgY2FycnkgY2hpbGQgY2FwdHVyZXMgdW5kZXJcbi8vIGBlbnRyeS5ncm91cGA7IHdlIGlubGluZSB0aG9zZSBjaGlsZHJlbiAod2l0aCB0aGVpciBvd24gZmVlZGJhY2spIHNvIGFcbi8vIGdyb3VwZWQgY2FwdHVyZSBleHBvcnRzIGFzIG9uZSBjb21wbGV0ZSBvYmplY3QgdG9vLlxuLy9cbi8vIFR3byBvdXRwdXQgZm9ybXMsIG1pcnJvcmluZyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIEpTT04gKyBlbmdsaXNoIHNwbGl0OlxuLy8gICBzZXJpYWxpemVDYXB0dXJlRnVsbChjYXB0dXJlLCBvcHRzKSAgICAg4oaSIG9iamVjdCAgKHN0cnVjdHVyZWQsIGNvbXBsZXRlKVxuLy8gICBzZXJpYWxpemVDYXB0dXJlSnNvbihjYXB0dXJlLCBvcHRzKSAgICAgIOKGkiBzdHJpbmcgIChwcmV0dHkgSlNPTiArIG5ld2xpbmUpXG4vLyAgIHNlcmlhbGl6ZUNhcHR1cmVUZXh0KGNhcHR1cmUsIG9wdHMpICAgICAg4oaSIHN0cmluZyAgKG1hcmtkb3duLCBodW1hbi9MTE0pXG4vL1xuLy8gYGNhcHR1cmVgIGFjY2VwdHMgZWl0aGVyOlxuLy8gICDigKIgeyBlbnRyeSwgZmVlZGJhY2s/LCBtZW1iZXJzPyB9ICDigJQgZXhwbGljaXQgc2hhcGUsIE9SXG4vLyAgIOKAoiBhIGJhcmUgYEVudHJ5YCAgICAgICAgICAgICAgICAgIOKAlCBmZWVkYmFjayBkZWZhdWx0cyB0byBbXVxuLy9cbi8vIE91dHB1dCBpcyBkZXRlcm1pbmlzdGljOiBpZGVudGljYWwgaW5wdXQg4oaSIGJ5dGUtaWRlbnRpY2FsIG91dHB1dC4gTm9cbi8vIHRpbWVzdGFtcHMgYXJlIGluamVjdGVkOyBvbmx5IHRoZSBjYXB0dXJlJ3Mgb3duIGB0c2AgZmllbGRzIGFwcGVhci5cblxuLy8g4pSA4pSA4pSAIElucHV0IG5vcm1hbGl6YXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEFjY2VwdCBhIGJhcmUgRW50cnkgb3IgYSB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3cmFwcGVyIGFuZCByZXR1cm4gYVxuLy8gbm9ybWFsaXplZCB7ZW50cnksIGZlZWRiYWNrLCBtZW1iZXJzfSB3aXRoIGFycmF5cyBhbHdheXMgcHJlc2VudC5cbmNvbnN0IG5vcm1hbGl6ZUNhcHR1cmUgPSAoY2FwdHVyZSkgPT4ge1xuICBpZiAoIWNhcHR1cmUgfHwgdHlwZW9mIGNhcHR1cmUgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICAvLyBCYXJlIEVudHJ5OiBpdCBoYXMgYSBgc2VsZWN0b3JgIC8gYHVpZGAgYnV0IG5vIG5lc3RlZCBgZW50cnlgLlxuICBjb25zdCBlbnRyeSA9IGNhcHR1cmUuZW50cnkgPz8gY2FwdHVyZTtcbiAgaWYgKCFlbnRyeSB8fCB0eXBlb2YgZW50cnkgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXJpYWxpemVDYXB0dXJlRnVsbDogY2FwdHVyZSBoYXMgbm8gZW50cnlcIik7XG4gIH1cbiAgY29uc3QgZmVlZGJhY2sgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUuZmVlZGJhY2spID8gY2FwdHVyZS5mZWVkYmFjayA6IFtdO1xuICAvLyBHcm91cCBtZW1iZXJzIG1heSBiZSBzdXBwbGllZCBleHBsaWNpdGx5LCBlbHNlIGZhbGwgYmFjayB0byB0aGUgZW50cnknc1xuICAvLyBvd24gYGdyb3VwYCBhcnJheSAodGhlIHBhbmVsIHN0b3JlcyBjaGlsZCBjYXB0dXJlcyB0aGVyZSkuXG4gIGNvbnN0IG1lbWJlcnMgPSBBcnJheS5pc0FycmF5KGNhcHR1cmUubWVtYmVycylcbiAgICA/IGNhcHR1cmUubWVtYmVyc1xuICAgIDogQXJyYXkuaXNBcnJheShlbnRyeS5ncm91cClcbiAgICAgID8gZW50cnkuZ3JvdXBcbiAgICAgIDogW107XG4gIHJldHVybiB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9O1xufTtcblxuLy8gQSBmZWVkYmFjayByb3cgc2NvcGVkIHRvIGEgc2luZ2xlIGNhcHR1cmUuIFN0cmlwcyByb3V0aW5nL1VJIGNydWZ0XG4vLyAoaWQsIHR5cGUpIGFuZCBrZWVwcyBvbmx5IHdoYXQgYSByZXZpZXdlciBuZWVkczogdGhlIHRleHQsIHdoZW4gaXQgd2FzXG4vLyB3cml0dGVuLCBhbnkgdGFncywgYW5kIHRoZSBwYXJlbnQgbGluayBmb3IgdHJhY2VhYmlsaXR5LlxuY29uc3Qgc2xpbUNvbW1lbnQgPSAoZmIpID0+IHtcbiAgY29uc3Qgb3V0ID0geyB0ZXh0OiB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiIH07XG4gIGlmIChmYi50cykgb3V0LnRzID0gZmIudHM7XG4gIGlmIChmYi51aWQpIG91dC51aWQgPSBmYi51aWQ7XG4gIGlmIChmYi5wYXJlbnRVaWQpIG91dC5wYXJlbnRVaWQgPSBmYi5wYXJlbnRVaWQ7XG4gIGlmIChBcnJheS5pc0FycmF5KGZiLnRhZ3MpICYmIGZiLnRhZ3MubGVuZ3RoKSBvdXQudGFncyA9IGZiLnRhZ3M7XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vLyBDb2xsZWN0IHRoZSBwYXRocy9zZWxlY3RvcnMgZm9yIGEgY2FwdHVyZSBpbnRvIG9uZSBibG9jayBzbyBldmVyeSB3YXkgb2Zcbi8vIGxvY2F0aW5nIHRoZSBlbGVtZW50IGlzIGluIGEgc2luZ2xlLCBvYnZpb3VzIHBsYWNlLiBUb2xlcmFudCBvZiBib3RoIHRoZVxuLy8gcGFuZWwgYEVudHJ5YCBzaGFwZSAoZmxhdCBgc2VsZWN0b3JgICsgYGlkYC9gdGVzdElkYCkgYW5kIHRoZSByaWNoZXJcbi8vIGBzZWxlY3RvcnNgIHN1Yi1vYmplY3Qgc29tZSBjYXB0dXJlIHBpcGVsaW5lcyBlbWl0LlxuY29uc3QgY29sbGVjdFBhdGhzID0gKGVudHJ5KSA9PiB7XG4gIGNvbnN0IHBhdGhzID0ge307XG4gIGlmIChlbnRyeS5zZWxlY3RvcikgcGF0aHMuY3NzID0gZW50cnkuc2VsZWN0b3I7XG4gIGNvbnN0IHNlbCA9IGVudHJ5LnNlbGVjdG9ycztcbiAgaWYgKHNlbCAmJiB0eXBlb2Ygc2VsID09PSBcIm9iamVjdFwiKSB7XG4gICAgaWYgKHNlbC5jc3MgJiYgc2VsLmNzcyAhPT0gcGF0aHMuY3NzKSBwYXRocy5jc3NGdWxsID0gc2VsLmNzcztcbiAgICBpZiAoc2VsLmNvbXBhY3QpIHBhdGhzLmNvbXBhY3QgPSBzZWwuY29tcGFjdDtcbiAgICBpZiAoc2VsLnhwYXRoKSBwYXRocy54cGF0aCA9IHNlbC54cGF0aDtcbiAgICBpZiAoc2VsLmRhdGFJZHMpIHBhdGhzLmRhdGFJZHMgPSBzZWwuZGF0YUlkcztcbiAgfVxuICBpZiAoZW50cnkuY29tcG9uZW50Um9vdCkgcGF0aHMuY29tcG9uZW50Um9vdCA9IGVudHJ5LmNvbXBvbmVudFJvb3Q7XG4gIGlmIChlbnRyeS5zaGFkb3dIb3N0KSBwYXRocy5zaGFkb3dIb3N0ID0gZW50cnkuc2hhZG93SG9zdDtcbiAgaWYgKGVudHJ5LmlkKSBwYXRocy5kb21JZCA9IGVudHJ5LmlkO1xuICBpZiAoZW50cnkudGVzdElkKSBwYXRocy50ZXN0SWQgPSBlbnRyeS50ZXN0SWQ7XG4gIGlmICh0eXBlb2YgZW50cnkuc2VsZWN0b3JNYXRjaENvdW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgcGF0aHMubWF0Y2hDb3VudCA9IGVudHJ5LnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgfVxuICByZXR1cm4gcGF0aHM7XG59O1xuXG4vLyDilIDilIDilIAgRnVsbCBzdHJ1Y3R1cmVkIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIEJ1aWxkIHRoZSBjb21wbGV0ZSBvYmplY3QgZm9yIE9ORSBjYXB0dXJlLiBFdmVyeXRoaW5nIHRleHR1YWwgdGhlXG4vLyB3b3Jrc3BhY2UgZXhwb3J0IHdvdWxkIGNhcnJ5IGZvciB0aGlzIGVsZW1lbnQsIHdpdGggbm90ZXMvY29tbWVudHNcbi8vIGlubGluZWQuIEdyb3VwIG1lbWJlcnMgcmVjdXJzZSBzbyBhIGdyb3VwZWQgY2FwdHVyZSBpcyBzZWxmLWNvbnRhaW5lZC5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVDYXB0dXJlRnVsbCA9IChjYXB0dXJlLCBvcHRzID0ge30pID0+IHtcbiAgY29uc3QgeyBlbnRyeSwgZmVlZGJhY2ssIG1lbWJlcnMgfSA9IG5vcm1hbGl6ZUNhcHR1cmUoY2FwdHVyZSk7XG5cbiAgY29uc3Qgb3V0ID0ge1xuICAgIGtpbmQ6IFwicGluY2hncmFiL2NhcHR1cmUtZnVsbFwiLFxuICAgIHY6IDEsXG4gIH07XG4gIGlmIChlbnRyeS51aWQpIG91dC51aWQgPSBlbnRyeS51aWQ7XG4gIGlmIChlbnRyeS5uICE9PSB1bmRlZmluZWQpIG91dC5uID0gZW50cnkubjtcbiAgaWYgKGVudHJ5LnRzKSBvdXQudHMgPSBlbnRyeS50cztcbiAgaWYgKGVudHJ5LnVybCkgb3V0LnVybCA9IGVudHJ5LnVybDtcbiAgaWYgKGVudHJ5LnRhZykgb3V0LnRhZyA9IGVudHJ5LnRhZztcblxuICAvLyBJZGVudGl0eSAvIGExMXkgbmFtaW5nLlxuICBjb25zdCBpZGVudGl0eSA9IHt9O1xuICBpZiAoZW50cnkucm9sZSAhPT0gdW5kZWZpbmVkKSBpZGVudGl0eS5yb2xlID0gZW50cnkucm9sZTtcbiAgaWYgKGVudHJ5LmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIGlkZW50aXR5LmFjY2Vzc2libGVOYW1lID0gZW50cnkuYWNjZXNzaWJsZU5hbWU7XG4gIGlmIChlbnRyeS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkudGVzdElkID0gZW50cnkudGVzdElkO1xuICBpZiAoZW50cnkuaWQgIT09IHVuZGVmaW5lZCkgaWRlbnRpdHkuaWQgPSBlbnRyeS5pZDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkuY2xhc3NlcykgJiYgZW50cnkuY2xhc3Nlcy5sZW5ndGgpIGlkZW50aXR5LmNsYXNzZXMgPSBlbnRyeS5jbGFzc2VzO1xuICBpZiAoT2JqZWN0LmtleXMoaWRlbnRpdHkpLmxlbmd0aCkgb3V0LmlkZW50aXR5ID0gaWRlbnRpdHk7XG5cbiAgLy8gUGF0aHMg4oCUIGV2ZXJ5IHdheSB0byBsb2NhdGUgdGhlIGVsZW1lbnQuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIG91dC5wYXRocyA9IHBhdGhzO1xuXG4gIC8vIFRleHQgLyBjb250ZW50LiBXZSBrZWVwIGFsbCB0ZXh0dWFsIHN1cmZhY2VzIHNvIG5vdGhpbmcgdGhlIHVzZXIgY2FuXG4gIC8vIHNlZSBpcyBsb3N0OiBzb3VyY2UgdGV4dCwgdGhlIENTUy1yZW5kZXJlZCBmb3JtLCBhbmQgdGhlIG1hcmt1cC5cbiAgY29uc3QgY29udGVudCA9IHt9O1xuICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBjb250ZW50LnRleHQgPSBlbnRyeS50ZXh0O1xuICBpZiAoZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIGNvbnRlbnQucmVuZGVyZWRUZXh0ID0gZW50cnkucmVuZGVyZWRUZXh0O1xuICBpZiAoZW50cnkudmFsdWUgIT09IHVuZGVmaW5lZCkgY29udGVudC52YWx1ZSA9IGVudHJ5LnZhbHVlO1xuICBpZiAoZW50cnkucGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCkgY29udGVudC5wbGFjZWhvbGRlciA9IGVudHJ5LnBsYWNlaG9sZGVyO1xuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIGNvbnRlbnQub3V0ZXJIVE1MID0gZW50cnkub3V0ZXJIVE1MO1xuICBpZiAoT2JqZWN0LmtleXMoY29udGVudCkubGVuZ3RoKSBvdXQuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgLy8gTm90ZXMgLyBjb21tZW50cyBhdHRhY2hlZCB0byB0aGlzIGNhcHR1cmUuXG4gIGlmIChmZWVkYmFjay5sZW5ndGgpIG91dC5jb21tZW50cyA9IGZlZWRiYWNrLm1hcChzbGltQ29tbWVudCk7XG5cbiAgLy8gUmVtYWluaW5nIHN0cnVjdHVyZWQgbWV0YWRhdGEgYW4gYWdlbnQgbWF5IHdhbnQg4oCUIGNvcGllZCB0aHJvdWdoXG4gIC8vIHZlcmJhdGltIHNvIHRoaXMgZXhwb3J0IGlzIGFzIGNvbXBsZXRlIGFzIHRoZSBKU09OTCByb3cuIFdlIGFsbG93LWxpc3RcbiAgLy8gdGhlIGhlYXZ5L3N0cnVjdHVyZWQgZmllbGRzIHJhdGhlciB0aGFuIGR1bXBpbmcgdGhlIHdob2xlIEVudHJ5IHNvIHRoZVxuICAvLyBvdXRwdXQgb3JkZXJpbmcgc3RheXMgc3RhYmxlIGFuZCBvYnZpb3VzLlxuICBjb25zdCBtZXRhID0ge307XG4gIGNvbnN0IHBhc3N0aHJvdWdoID0gW1xuICAgIFwicmVjdFwiLCBcInZpZXdwb3J0XCIsIFwic3RhdGVzXCIsIFwiYXR0cnNcIiwgXCJoaW50c1wiLCBcImNvbXBvbmVudFwiLCBcImV2ZW50c1wiLFxuICAgIFwiYmVoYXZpb3JBdHRyc1wiLCBcImExMXlcIiwgXCJhc3NldHNcIiwgXCJsYXlvdXRDb250ZXh0XCIsIFwic3R5bGVzXCIsXG4gICAgXCJtYXRjaGVkUnVsZXNcIiwgXCJhbmNlc3RvcnNcIiwgXCJzY3JlZW5zaG90XCIsIFwidHJ1bmNhdGVkXCIsIFwic2Vzc2lvbklkXCIsXG4gICAgXCJjYW52YXNDbGlja1wiLCBcImVkaXRvclwiLCBcImRvbU11dGF0aW9uc1wiLCBcImlzQW5pbWF0aW5nXCIsXG4gIF07XG4gIGZvciAoY29uc3Qga2V5IG9mIHBhc3N0aHJvdWdoKSB7XG4gICAgaWYgKGVudHJ5W2tleV0gIT09IHVuZGVmaW5lZCkgbWV0YVtrZXldID0gZW50cnlba2V5XTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMobWV0YSkubGVuZ3RoKSBvdXQubWV0YSA9IG1ldGE7XG5cbiAgLy8gR3JvdXAgbWVtYmVyczogcmVjdXJzZSBzbyBlYWNoIGNoaWxkIGNhcHR1cmUgaXMgZnVsbHkgc2VyaWFsaXplZCB0b28uXG4gIC8vIEEgbWVtYmVyIG1heSBjYXJyeSBpdHMgb3duIGZlZWRiYWNrIHdoZW4gdGhlIGNhbGxlciBzdXBwbGllcyBhXG4gIC8vIHtlbnRyeSwgZmVlZGJhY2t9IHBhaXI7IGJhcmUgY2hpbGQgRW50cmllcyBzZXJpYWxpemUgd2l0aCBubyBjb21tZW50cy5cbiAgaWYgKG1lbWJlcnMubGVuZ3RoKSB7XG4gICAgb3V0Lm1lbWJlcnMgPSBtZW1iZXJzLm1hcCgobSkgPT4gc2VyaWFsaXplQ2FwdHVyZUZ1bGwobSwgb3B0cykpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8vIFByZXR0eSBKU09OIHN0cmluZyBmb3IgdGhlIFwiQ29weSBjYXB0dXJlIGFzIEpTT05cIiBidXR0b24uIFRyYWlsaW5nXG4vLyBuZXdsaW5lIHNvIGl0IHJvdW5kLXRyaXBzIGNsZWFubHkgdGhyb3VnaCBlZGl0b3JzIC8gYHBicGFzdGVgLlxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVKc29uID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT5cbiAgSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXplQ2FwdHVyZUZ1bGwoY2FwdHVyZSwgb3B0cyksIG51bGwsIDIpICsgXCJcXG5cIjtcblxuLy8g4pSA4pSA4pSAIFNpbmdsZS1jYXB0dXJlIG1hcmtkb3duIGZvcm0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vL1xuLy8gTWF0Y2hlcyB0aGUgd29ya3NwYWNlIGV4cG9ydCdzIGVuZ2xpc2gvbWFya2Rvd24gc3VyZmFjZSBidXQgc2NvcGVkIHRvIG9uZVxuLy8gY2FwdHVyZS4gVXNlZnVsIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gcGFzdGUgYSBodW1hbi1yZWFkYWJsZSBjYXJkIHJhdGhlclxuLy8gdGhhbiByYXcgSlNPTi5cblxuY29uc3QgaGVhZGluZyA9IChlbnRyeSkgPT4ge1xuICBjb25zdCBuYW1lID1cbiAgICBlbnRyeS5hY2Nlc3NpYmxlTmFtZSB8fFxuICAgIGVudHJ5LnRlc3RJZCB8fFxuICAgIGVudHJ5LmlkIHx8XG4gICAgZW50cnkuc2VsZWN0b3IgfHxcbiAgICBlbnRyeS50YWcgfHxcbiAgICBcImNhcHR1cmVcIjtcbiAgY29uc3QgbGFiZWwgPSBlbnRyeS5uICE9PSB1bmRlZmluZWQgPyBgQ2FwdHVyZSAjJHtlbnRyeS5ufWAgOiBcIkNhcHR1cmVcIjtcbiAgcmV0dXJuIGAke2xhYmVsfTogJHtuYW1lfWA7XG59O1xuXG5jb25zdCByZW5kZXJQYXRocyA9IChwYXRocykgPT4ge1xuICBjb25zdCBsaW5lcyA9IFtdO1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhwYXRocykpIHtcbiAgICBsaW5lcy5wdXNoKGAtICoqJHtrfToqKiBcXGAke3Z9XFxgYCk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZUNhcHR1cmVUZXh0ID0gKGNhcHR1cmUsIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB7IGVudHJ5LCBmZWVkYmFjaywgbWVtYmVycyB9ID0gbm9ybWFsaXplQ2FwdHVyZShjYXB0dXJlKTtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgbGluZXMucHVzaChgIyAke2hlYWRpbmcoZW50cnkpfWAsIFwiXCIpO1xuICBpZiAoZW50cnkudXJsKSBsaW5lcy5wdXNoKGBQYWdlOiA8JHtlbnRyeS51cmx9PmAsIFwiXCIpO1xuICBpZiAoZW50cnkudGFnKSBsaW5lcy5wdXNoKGBFbGVtZW50OiBcXGA8JHtlbnRyeS50YWd9PlxcYGAsIFwiXCIpO1xuXG4gIGNvbnN0IHBhdGhzID0gY29sbGVjdFBhdGhzKGVudHJ5KTtcbiAgaWYgKE9iamVjdC5rZXlzKHBhdGhzKS5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgUGF0aHNcIiwgXCJcIiwgLi4ucmVuZGVyUGF0aHMocGF0aHMpKTtcbiAgfVxuXG4gIGlmIChlbnRyeS50ZXh0ICE9PSB1bmRlZmluZWQgfHwgZW50cnkucmVuZGVyZWRUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgVGV4dFwiLCBcIlwiKTtcbiAgICBpZiAoZW50cnkudGV4dCAhPT0gdW5kZWZpbmVkKSBsaW5lcy5wdXNoKGBTb3VyY2U6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkudGV4dCl9YCk7XG4gICAgaWYgKGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gdW5kZWZpbmVkICYmIGVudHJ5LnJlbmRlcmVkVGV4dCAhPT0gZW50cnkudGV4dCkge1xuICAgICAgbGluZXMucHVzaChgUmVuZGVyZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZW50cnkucmVuZGVyZWRUZXh0KX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW50cnkub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICBsaW5lcy5wdXNoKFwiXCIsIFwiIyMgTWFya3VwXCIsIFwiXCIsIFwiYGBgaHRtbFwiLCBlbnRyeS5vdXRlckhUTUwsIFwiYGBgXCIpO1xuICB9XG5cbiAgaWYgKGZlZWRiYWNrLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBOb3RlcyAmIGNvbW1lbnRzXCIsIFwiXCIpO1xuICAgIGZvciAoY29uc3QgZmIgb2YgZmVlZGJhY2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgZmIudGV4dCA9PT0gXCJzdHJpbmdcIiA/IGZiLnRleHQgOiBcIlwiO1xuICAgICAgY29uc3QgdGFncyA9IEFycmF5LmlzQXJyYXkoZmIudGFncykgJiYgZmIudGFncy5sZW5ndGggPyBgIF8oJHtmYi50YWdzLmpvaW4oXCIsIFwiKX0pX2AgOiBcIlwiO1xuICAgICAgbGluZXMucHVzaChgLSAke3RleHR9JHt0YWdzfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtZW1iZXJzLmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goXCJcIiwgXCIjIyBHcm91cGVkIHdpdGhcIiwgXCJcIik7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lbWJlcnMpIHtcbiAgICAgIGNvbnN0IG1lID0gbm9ybWFsaXplQ2FwdHVyZShtKS5lbnRyeTtcbiAgICAgIGxpbmVzLnB1c2goYC0gJHtoZWFkaW5nKG1lKX0g4oCUIFxcYCR7bWUuc2VsZWN0b3IgPz8gbWUudGFnID8/IFwiP1wifVxcYGApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKFwiXFxuXCIpICsgXCJcXG5cIjtcbn07XG4iLAogICAgIi8vIFBpbmNoR3JhYiBzaWRlLXBhbmVsIFVJLiBSZWNlaXZlcyBjYXB0dXJlcyArIGhvdmVycyBmcm9tIHRoZSBjb250ZW50XG4vLyBzY3JpcHQ7IHJlbmRlcnMgdGhlIGNoYXQtYnViYmxlIHRpbWVsaW5lLCBleHBvcnRzLCB2YWxpZGF0ZXMsIGV0Yy5cbi8vXG4vLyBEZWNvbXBvc2VkIGludG8gc21hbGwgZmlsZXMgZm9yIGNsYXJpdHk6XG4vLyAgIOKAoiB0eXBlcy50cyAgICAgIOKAlCBzaGFyZWQgdHlwZXMsIG1lc3NhZ2UgcHJvdG9jb2xcbi8vICAg4oCiIGx1Y2lkZS50cyAgICAg4oCUIGljb24gcmVnaXN0cnlcbi8vICAg4oCiIHRoaXMgZmlsZSAgICAg4oCUIHdpcmUtdXAgLyByZW5kZXJpbmcgLyBleHBvcnQgYnVpbGRlcnNcbi8vXG4vLyBMb2FkZWQgYXMgdGhlIHNpZGUgcGFuZWwgcGFnZTogY2hyb21lLnNpZGVQYW5lbCBkZWZhdWx0X3BhdGguXG5cbmltcG9ydCB0eXBlIHtcbiAgQW5ub3RhdGlvblBheWxvYWQsIENzVG9QYW5lbCwgRW50cnksIEV4cG9ydERpYWdub3N0aWMsIEV4cG9ydE1hbmlmZXN0LCBGZWVkYmFja01lc3NhZ2UsIFBhZ2VNZXNzYWdlLFxuICBQYWdlU25hcHNob3QsIFBhbmVsTWVzc2FnZSwgUGFuZWxUb0JnLCBQYW5lbFRvQ3MsIFBnRW52ZWxvcGUsIFNhdmVSZXBseSwgU2VsZWN0b3JNZXNzYWdlLCBTaG90UmVwbHksIFZpZXdwb3J0LFxufSBmcm9tICcuL3R5cGVzLnRzJztcbmltcG9ydCB7cGd9IGZyb20gJy4vdHlwZXMudHMnO1xuaW1wb3J0IHtQR19JQ09OU30gZnJvbSAnLi9sdWNpZGUudHMnO1xuaW1wb3J0IHtidWlsZFRhciwgd3JhcFpzdGQsIHR5cGUgVGFyRW50cnl9IGZyb20gJy4vdGFyLnRzJztcbmltcG9ydCB7VEVNUExBVEVTX1BSRVNFTlR9IGZyb20gJy4vdGVtcGxhdGVzLmdlbi50cyc7XG5pbXBvcnQge0JVTkRMRURfU0tJTExTX1BSRVNFTlQsIEJVTkRMRURfU0tJTExfRklMRVN9IGZyb20gJy4vYnVuZGxlZC1za2lsbHMuZ2VuLnRzJztcbmltcG9ydCB7c2VyaWFsaXplQ2FwdHVyZUpzb259IGZyb20gJy4vZXhwb3J0LWNhcHR1cmUubWpzJztcblxuKCgpID0+IHtcbiAgY29uc3QgTE9HID0gJ1tQaW5jaEdyYWIvc3BdJztcbiAgY29uc3QgUFJFRlNfU1RPUkFHRV9OQU1FID0gJ3BpbmNoZ3JhYi5wcmVmcy52Mic7XG4gIGNvbnN0IFdPUktTUEFDRVNfS0VZID0gJ3BpbmNoZ3JhYi53b3Jrc3BhY2VzLnYxJztcbiAgY29uc3QgaW5FeHRlbnNpb24gPSB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiBCb29sZWFuKGNocm9tZS5ydW50aW1lPy5pZCk7XG5cbiAgLy8g4pSA4pSA4pSAIFRlbXBsYXRlIHJlc291cmNlIGxvYWRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gRWFybGllciB0aGUgdGVtcGxhdGVzIHdlcmUgYmFrZWQgYXMgc3RyaW5nIGNvbnN0YW50cyBpbnRvIHRoaXMgSUlGRVxuICAvLyAofjM2MEtCIGFjcm9zcyBERVNJR04gKyBTS0lMTCkuIFRoYXQgYmxvYXRlZCB0aGUgc2lkZXBhbmVsIGJ1bmRsZSB0b1xuICAvLyB+MS45NU1CIGFuZCBzbG93ZWQgZmlyc3Qtb3BlbiBwYXJzZSB0aW1lIG5vdGljZWFibHkuIFRoZXkgbm93IHNoaXAgYXNcbiAgLy8gc2VwYXJhdGUgYC5tZGAgZmlsZXMgdW5kZXIgYGV4dGVuc2lvbi90ZW1wbGF0ZXMvYCBhbmQgbG9hZCBvbiBkZW1hbmRcbiAgLy8gdmlhIGZldGNoIOKAlCB3aGVuIHRoZSB1c2VyIG9wZW5zIHRoZSBlZGl0b3IgbW9kYWwsIG9yIHdoZW4gdGhlIGV4cG9ydFxuICAvLyBwaXBlbGluZSBuZWVkcyB0byBidW5kbGUgYSBmYWxsYmFjay5cbiAgLy9cbiAgLy8gQ2FjaGUgcmVzdWx0cyBpbi1wcm9jZXNzIHNvIHJlcGVhdCByZWFkcyAobW9kYWwgb3BlbiDihpIgY2xvc2Ug4oaSIHJlb3BlbixcbiAgLy8gb3Igc2VxdWVudGlhbCBleHBvcnRzKSBkb24ndCByZS1mZXRjaC5cbiAgY29uc3QgdGVtcGxhdGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IFRFTVBMQVRFX0ZJTEVTID0ge1xuICAgIGRlc2lnblRlbXBsYXRlOiAnREVTSUdOLnRlbXBsYXRlLm1kJyxcbiAgICBza2lsbFRlbXBsYXRlOiAnUGluY2hHcmFiLlNLSUxMLnRlbXBsYXRlLm1kJyxcbiAgICBsb2NhbERlc2lnbjogJ2xvY2FsLkRFU0lHTi5tZCcsXG4gICAgbG9jYWxTa2lsbDogJ2xvY2FsLlNLSUxMLm1kJyxcbiAgfSBhcyBjb25zdDtcbiAgdHlwZSBUZW1wbGF0ZUtleSA9IGtleW9mIHR5cGVvZiBURU1QTEFURV9GSUxFUztcbiAgY29uc3QgdGVtcGxhdGVVcmwgPSAoZmlsZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAvLyBJbnNpZGUgdGhlIGV4dGVuc2lvbiwgdGhlIHNpZGVwYW5lbCBydW5zIGZyb21cbiAgICAvLyBjaHJvbWUtZXh0ZW5zaW9uOi8vPGlkPi9zaWRlcGFuZWwuaHRtbCwgc28gcmVzb3VyY2VzIHJlc29sdmUgdmlhXG4gICAgLy8gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMLiBUaGUgUGxheXdyaWdodCBzdGF0aWMtc2VydmVyIHRlc3RzIHNlcnZlXG4gICAgLy8gYC90ZW1wbGF0ZXMvPGZpbGU+YCBmcm9tIHRoZSBleHRlbnNpb24gcm9vdCBkaXJlY3RseSwgc28gYVxuICAgIC8vIHJlbGF0aXZlIFVSTCB3b3JrcyB0aGVyZSBhcyBhIGZhbGxiYWNrLlxuICAgIGlmIChpbkV4dGVuc2lvbiAmJiBjaHJvbWUucnVudGltZT8uZ2V0VVJMKSB7XG4gICAgICByZXR1cm4gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKGB0ZW1wbGF0ZXMvJHtmaWxlfWApO1xuICAgIH1cbiAgICByZXR1cm4gYHRlbXBsYXRlcy8ke2ZpbGV9YDtcbiAgfTtcbiAgY29uc3QgbG9hZFRlbXBsYXRlID0gYXN5bmMgKGtleTogVGVtcGxhdGVLZXkpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmICghVEVNUExBVEVTX1BSRVNFTlRba2V5XSkgcmV0dXJuICcnO1xuICAgIGNvbnN0IGZpbGUgPSBURU1QTEFURV9GSUxFU1trZXldO1xuICAgIGNvbnN0IGNhY2hlZCA9IHRlbXBsYXRlQ2FjaGUuZ2V0KGZpbGUpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godGVtcGxhdGVVcmwoZmlsZSkpO1xuICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgc3RhdHVzICR7cmVzLnN0YXR1c31gKTtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgdGV4dCk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihMT0csIGB0ZW1wbGF0ZSBmZXRjaCBmYWlsZWQ6ICR7ZmlsZX1gLCBlcnIpO1xuICAgICAgdGVtcGxhdGVDYWNoZS5zZXQoZmlsZSwgJycpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfTtcbiAgLy8gRWZmZWN0aXZlIGNvbnRlbnQgdXNlZCBieSB0aGUgZXhwb3J0IHBpcGVsaW5lIGFuZCB0aGUgbW9kYWwuIFdoZW4gdGhlXG4gIC8vIHVzZXIgaGFzIGN1c3RvbWl6ZWQgdmlhIHRoZSB0ZXh0YXJlYS91cGxvYWQsIHRoYXQgd2luczsgb3RoZXJ3aXNlIHdlXG4gIC8vIGZhbGwgYmFjayB0byBsb2NhbC4qICh0aGUgZGV2ZWxvcGVyJ3MgcHJlLWJha2VkIG92ZXJyaWRlKSB0aGVuIHRvXG4gIC8vIHRoZSBnZW5lcmljIHRlbXBsYXRlLlxuICBjb25zdCByZXNvbHZlRGVzaWduQ29udGVudCA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGlmIChwcmVmcy5kZXNpZ25NZCAmJiBwcmVmcy5kZXNpZ25NZC50cmltKCkpIHJldHVybiBwcmVmcy5kZXNpZ25NZDtcbiAgICByZXR1cm4gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxEZXNpZ24nKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnZGVzaWduVGVtcGxhdGUnKSk7XG4gIH07XG4gIGNvbnN0IHJlc29sdmVTa2lsbENvbnRlbnQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBpZiAocHJlZnMuc2tpbGxNZCAmJiBwcmVmcy5za2lsbE1kLnRyaW0oKSkgcmV0dXJuIHByZWZzLnNraWxsTWQ7XG4gICAgcmV0dXJuIChhd2FpdCBsb2FkVGVtcGxhdGUoJ2xvY2FsU2tpbGwnKSkgfHwgKGF3YWl0IGxvYWRUZW1wbGF0ZSgnc2tpbGxUZW1wbGF0ZScpKTtcbiAgfTtcbiAgLy8gVHJ1ZSB3aGVuIHRoZSB1c2VyIGhhc24ndCBjdXN0b21pemVkIOKGkiBwcmVmcy57ZGVzaWduTWR8c2tpbGxNZH0gaXNcbiAgLy8gZW1wdHkgYW5kIHdlJ3JlIGZhbGxpbmcgYmFjayB0byBhIGJ1bmRsZWQgdGVtcGxhdGUvbG9jYWwgcmVzb3VyY2UuXG4gIGNvbnN0IGlzVXNpbmdUZW1wbGF0ZURlc2lnbiA9ICgpOiBib29sZWFuID0+ICFwcmVmcy5kZXNpZ25NZCB8fCAhcHJlZnMuZGVzaWduTWQudHJpbSgpO1xuICBjb25zdCBpc1VzaW5nVGVtcGxhdGVTa2lsbCA9ICgpOiBib29sZWFuID0+ICFwcmVmcy5za2lsbE1kIHx8ICFwcmVmcy5za2lsbE1kLnRyaW0oKTtcblxuICAvLyBWZW5kb3JlZCB0aGlyZC1wYXJ0eSBza2lsbCByZXNvdXJjZXMgKGltcGVjY2FibGUgcmVmZXJlbmNlIHNldCArXG4gIC8vIHBlcmNlcHRpb24tZmlyc3QtZGVzaWduKSwgc2hpcHBlZCB1bmRlciBleHRlbnNpb24vc2tpbGxzLyBieSB0aGUgYnVpbGRcbiAgLy8gYW5kIGlubGluZWQgaW50byBidW5kbGUgZXhwb3J0cy4gU2FtZSBsYXp5IGZldGNoICsgY2FjaGUgcGF0dGVybiBhcyB0aGVcbiAgLy8gdGVtcGxhdGVzIGFib3ZlLlxuICBjb25zdCBidW5kbGVkU2tpbGxDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGxvYWRCdW5kbGVkU2tpbGxGaWxlID0gYXN5bmMgKGV4dFBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4gPT4ge1xuICAgIGNvbnN0IGNhY2hlZCA9IGJ1bmRsZWRTa2lsbENhY2hlLmdldChleHRQYXRoKTtcbiAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVybCA9IGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRVUkwgPyBjaHJvbWUucnVudGltZS5nZXRVUkwoZXh0UGF0aCkgOiBleHRQYXRoO1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYHN0YXR1cyAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICAgIGJ1bmRsZWRTa2lsbENhY2hlLnNldChleHRQYXRoLCB0ZXh0KTtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgYGJ1bmRsZWQgc2tpbGwgZmV0Y2ggZmFpbGVkOiAke2V4dFBhdGh9YCwgZXJyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgU3RvcmFnZSBhZGFwdGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBTdG9yZSA9IHtcbiAgICBhc3luYyBnZXQ8VD4oa2V5OiBzdHJpbmcsIGZhbGxiYWNrOiBUKTogUHJvbWlzZTxUPiB7XG4gICAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnN0b3JhZ2U/LmxvY2FsKSB7XG4gICAgICAgIHRyeSB7IGNvbnN0IG8gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoa2V5KTsgcmV0dXJuIChvW2tleV0gYXMgVCkgPz8gZmFsbGJhY2s7IH1cbiAgICAgICAgY2F0Y2ggeyByZXR1cm4gZmFsbGJhY2s7IH1cbiAgICAgIH1cbiAgICAgIHRyeSB7IGNvbnN0IHIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpOyByZXR1cm4gciA9PT0gbnVsbCA/IGZhbGxiYWNrIDogKEpTT04ucGFyc2UocikgYXMgVCk7IH1cbiAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbGxiYWNrOyB9XG4gICAgfSxcbiAgICBhc3luYyBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBpZiAoaW5FeHRlbnNpb24gJiYgY2hyb21lLnN0b3JhZ2U/LmxvY2FsKSB7XG4gICAgICAgIHRyeSB7IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7W2tleV06IHZhbHVlfSk7IHJldHVybjsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICB9XG4gICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgIH0sXG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIERPTSByZWZzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCAkID0gPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHM6IHN0cmluZyk6IFQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKSBhcyBUO1xuICBjb25zdCBsaXN0ID0gJCgnW2RhdGEtbGlzdF0nKTtcbiAgY29uc3QgY29tcG9zZXIgPSAkPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCdbZGF0YS1jb21wb3Nlcl0nKTtcbiAgY29uc3Qgc3RhdHVzID0gJCgnW2RhdGEtc3RhdHVzXScpO1xuICBjb25zdCBzZWFyY2ggPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1zZWFyY2hdJyk7XG4gIC8vIEN0cmwrRiB2aXN1YWwtZmluZCBiYXIgKGRpc3RpbmN0IGZyb20gdGhlIGhlYWRlciBzZWFyY2gsIHdoaWNoIG9wZW5zIHRoZVxuICAvLyBjb21tYW5kIHBhbGV0dGUpLiBNYXkgYmUgYWJzZW50IGluIHZlcnkgb2xkIGNhY2hlZCBtYXJrdXAsIHNvIGNvbnN1bWVyc1xuICAvLyBudWxsLWd1YXJkLlxuICBjb25zdCBmaW5kQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWZpbmQtYmFyXScpO1xuICBjb25zdCBmaW5kSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1maW5kXScpO1xuICBjb25zdCBmaW5kQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtZmluZC1jb3VudF0nKTtcbiAgLy8gQ2Fub25pY2FsaXplIGtleWJvYXJkLXNob3J0Y3V0IHBpbGxzIHBlciBwbGF0Zm9ybS4gRXZlcnkgc2hvcnRjdXQgcGlsbFxuICAvLyBpcyBhdXRob3JlZCBpbiB0aGUgY2Fub25pY2FsIENtZC1mb3JtIChlYWNoIHRva2VuIGNhcGl0YWxpemVkLCBqb2luZWRcbiAgLy8gd2l0aCAnKyc6IEFsdCtDbGljaywgQ21kK0ssIENtZCtTaGlmdCtaKTsgb24gbm9uLU1hYyB3ZSBzd2FwIHRoZSBsZWFkaW5nXG4gIC8vIENtZCBtb2RpZmllciBmb3IgQ3RybC4gUGlsbHMgb3B0IGluIHZpYSBkYXRhLW1vZC0qIHNvIGEgc3RyaW5nIGxpa2UgdGhlXG4gIC8vICdBbHQr4oCmJyBwaWxscyAod2hpY2ggbmV2ZXIgY2FycnkgQ21kKSBhcmUgbGVmdCB1bnRvdWNoZWQuXG4gIGNvbnN0IGlzTWFjID0gL01hY3xpUGhvbmV8aVBhZC9pLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtIHx8IG5hdmlnYXRvci51c2VyQWdlbnQgfHwgJycpO1xuICBpZiAoIWlzTWFjKSB7XG4gICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50Pigna2JkW2RhdGEtbW9kLWtdLCBrYmRbZGF0YS1tb2Qtel0sIGtiZFtkYXRhLW1vZC1zaGlmdC16XScpKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IChlbC50ZXh0Q29udGVudCA/PyAnJykucmVwbGFjZSgvXkNtZFxcYi8sICdDdHJsJyk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGltcG9ydEZpbGUgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCcjaW1wb3J0LWZpbGUnKTtcbiAgY29uc3Qgc3RhdHNFbCA9ICQoJ1tkYXRhLXN0YXRzXScpO1xuICBjb25zdCBzdGFyc0VsID0gJCgnW2RhdGEtc3RhcnNdJyk7XG4gIGNvbnN0IHRvb2x0aXBFbCA9ICQoJ1tkYXRhLXRvb2x0aXBdJyk7XG4gIGNvbnN0IGRyaWxsZG93bkVsID0gJCgnW2RhdGEtZHJpbGxkb3duXScpO1xuICBjb25zdCBkcmF3ZXIgPSAkKCdbZGF0YS1kcmF3ZXJdJyk7XG4gIGNvbnN0IHBhbGV0dGUgPSAkKCdbZGF0YS1wYWxldHRlXScpO1xuICBjb25zdCBwYWxldHRlSW5wdXQgPSAkPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1wYWxldHRlLWlucHV0XScpO1xuICBjb25zdCBwYWxldHRlTGlzdCA9ICQoJ1tkYXRhLXBhbGV0dGUtbGlzdF0nKTtcbiAgY29uc3QgY29tcFdvcmRzID0gJCgnW2RhdGEtY29tcC13b3Jkc10nKTtcbiAgY29uc3QgY29tcFRva2VucyA9ICQoJ1tkYXRhLWNvbXAtdG9rZW5zXScpO1xuICBjb25zdCBzdGF0VG9rZW5zID0gJCgnW2RhdGEtc3RhdC10b2tlbnNdJyk7XG4gIGNvbnN0IHN0YXRXb3JkcyA9ICQoJ1tkYXRhLXN0YXQtd29yZHNdJyk7XG4gIGNvbnN0IHdzU2VsZWN0ID0gJDxIVE1MU2VsZWN0RWxlbWVudD4oJ1tkYXRhLXdvcmtzcGFjZV0nKTtcbiAgY29uc3Qgd3NMaXN0ID0gJCgnW2RhdGEtd3MtbGlzdF0nKTtcbiAgY29uc3Qgd3NOYW1lID0gJDxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtd3MtbmFtZV0nKTtcblxuICBjb25zdCBtb3VudEljb25zID0gKHJvb3Q6IFBhcmVudE5vZGUgPSBkb2N1bWVudCk6IHZvaWQgPT4ge1xuICAgIGZvciAoY29uc3QgZWwgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtaWNvbl0nKSkge1xuICAgICAgY29uc3QgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pY29uJyk7XG4gICAgICBjb25zdCBzaXplID0gTnVtYmVyKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zaXplJykgPz8gMTYpO1xuICAgICAgaWYgKG5hbWUgJiYgUEdfSUNPTlMuaGFzKG5hbWUpKSBlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcobmFtZSwgc2l6ZSk7XG4gICAgfVxuICB9O1xuICBtb3VudEljb25zKCk7XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICB0eXBlIFByZWZzID0ge1xuICAgIGluY2x1ZGVPdXRlckhUTUw6IGJvb2xlYW47XG4gICAgaW5jbHVkZU1hdGNoZWRSdWxlczogYm9vbGVhbjtcbiAgICBpbmNsdWRlU3R5bGVzOiBib29sZWFuO1xuICAgIG1pbmlmeTogYm9vbGVhbjtcbiAgICBhdXRvU2Nyb2xsVG9Ib3ZlcmVkOiBib29sZWFuO1xuICAgIHVzZVNjcmVlbnNob3RzOiBib29sZWFuO1xuICAgIHNwYWNpbmdPdmVybGF5OiBib29sZWFuO1xuICAgIGhvdmVyU25hcDogYm9vbGVhbjtcbiAgICBhdXRvU2NyZWVuc2hvdDogYm9vbGVhbjtcbiAgICAvLyBDb21tYS1zZXBhcmF0ZWQgaG9zdCBwYXR0ZXJucyAoc3Vic3RyaW5nIG1hdGNoKS4gSG9zdHMgaW4gdGhpcyBsaXN0XG4gICAgLy8gc2tpcCB0aGUgZW50aXJlIHNjcmVlbnNob3QgcGlwZWxpbmUg4oCUIHVzZWZ1bCBmb3Igc2Vuc2l0aXZlIHBhZ2VzXG4gICAgLy8gKGJhbmtpbmcsIGludGVybmFsIGFkbWluKSB3aGVyZSB0aGUgdXNlciBkb2Vzbid0IHdhbnQgUE5HcyBsYW5kaW5nXG4gICAgLy8gb24gZGlzay5cbiAgICBza2lwU2NyZWVuc2hvdEhvc3RzOiBzdHJpbmc7XG4gICAgLy8gSW5saW5lIERFU0lHTi5tZCBjb250ZW50IHRoZSB1c2VyIHBhc3RlZCBvciB1cGxvYWRlZCB2aWEgdGhlIHNpZGVcbiAgICAvLyBwYW5lbCBzZXR0aW5ncy4gRGVmYXVsdHMgdG8gYSB0ZW1wbGF0ZWQgcGxhY2Vob2xkZXIgc28gb3V0LW9mLXRoZS1cbiAgICAvLyBib3ggZXhwb3J0cyBhbHdheXMgaW5jbHVkZSBhIERFU0lHTi5tZCDigJQgdGhlIGNvbnN1bWVyIExMTSBjYW5cbiAgICAvLyBlaXRoZXIgd29yayBmcm9tIHRoZSBwbGFjZWhvbGRlciAoYW5kIGFzayBmb3IgdGhlIHJlYWwgb25lKSBvclxuICAgIC8vIGZyb20gYSB1c2VyLWN1c3RvbWl6ZWQgY29weS4gVGhlIHNldHRpbmdzIFVJIGZsYWdzIHRoaXMgYmFubmVyLVxuICAgIC8vIHN0eWxlIHdoZW4gdGhlIHZhbHVlIHN0aWxsIG1hdGNoZXMgdGhlIHRlbXBsYXRlIHNvIHRoZSB1c2VyXG4gICAgLy8ga25vd3MgdG8gZmlsbCBpdCBpbi5cbiAgICBkZXNpZ25NZDogc3RyaW5nO1xuICAgIC8vIFJlc29sdmVkIHBhdGggdGhlIHJlY2VpdmVyIHNob3VsZCByZWFkIERFU0lHTi5tZCBmcm9tLiBEZWZhdWx0c1xuICAgIC8vIHRvIGB+Ly5hZ2VudHMvREVTSUdOLm1kYDsgdXNlciBjYW4gb3ZlcnJpZGUgcGVyLW1hY2hpbmUuXG4gICAgZGVzaWduUGF0aDogc3RyaW5nO1xuICAgIC8vIFJlc29sdmVkIHBhdGggb2YgdGhlIFBpbmNoR3JhYiBVSSBza2lsbCBvbiB0aGUgcmVjZWl2ZXInc1xuICAgIC8vIGZpbGVzeXN0ZW0uIFRoZSBza2lsbCBjb250ZW50IGl0c2VsZiBpcyBidW5kbGVkIGlubGluZSBpbnRvIHRoZVxuICAgIC8vIGFyY2hpdmUgKHNlZSBgc2tpbGxNZGApLCBzbyB0aGlzIGlzIGEgaGludCBmb3IgcmVjZWl2ZXJzIHRoYXRcbiAgICAvLyB3YW50IHRvIHBlcnNpc3QgdGhlIHNraWxsIGF0IGEgY2Fub25pY2FsIGxvY2F0aW9uLlxuICAgIHNraWxsUGF0aDogc3RyaW5nO1xuICAgIC8vIElubGluZSBVSS1za2lsbCBjb250ZW50LiBEZWZhdWx0IGlzIHRoZSBidW5kbGVkIFBpbmNoR3JhYiB0cmlhZ2VcbiAgICAvLyBza2lsbCB0ZW1wbGF0ZTsgdXNlciBjYW4gY3VzdG9taXplIHZpYSBzZXR0aW5ncyBwYXN0ZS91cGxvYWQuXG4gICAgLy8gQnVuZGxlZCBpbnRvIHRoZSBhcmNoaXZlIGF0IGAuLy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZGAuXG4gICAgc2tpbGxNZDogc3RyaW5nO1xuICAgIC8vIFdoZW4gdHJ1ZSwgZmlyZSBhIGZyZXNoIHBhZ2Ugc2NyZWVuc2hvdCBvbiBFVkVSWSBjYXB0dXJlIHJhdGhlclxuICAgIC8vIHRoYW4gb25jZSBwZXIgKHdvcmtzcGFjZSwgdXJsKSB0dXBsZS4gVXNlZnVsIGZvciBjYXB0dXJpbmcgYVxuICAgIC8vIG11bHRpLXN0ZXAgZmxvdyB3aGVyZSB0aGUgcGFnZSBzdGF0ZSBjaGFuZ2VzIGJldHdlZW4gY2FwdHVyZXMuXG4gICAgLy8gRGVmYXVsdCBmYWxzZSDigJQgbW9zdCB1c2VycyB3YW50IHRoZSBkZWZhdWx0IGZpcnN0LW9ubHkgYmVoYXZpb3JcbiAgICAvLyBzaW5jZSBwYWdlIHNjcmVlbnNob3RzIGFyZSBsYXJnZSBhbmQgdGhlIGZpcnN0IG9uZSBhbHJlYWR5IGdpdmVzXG4gICAgLy8gYSBzZXNzaW9uLWxldmVsIHJlZmVyZW5jZS5cbiAgICBwYWdlU2hvdFBlckNhcHR1cmU6IGJvb2xlYW47XG4gICAgLy8gU3VwcHJlc3MgQ2hyb21lJ3MgZG93bmxvYWQgYnViYmxlIHdoaWxlIFBpbmNoR3JhYiB3cml0ZXMgaXRzIG93blxuICAgIC8vIGZpbGVzIChzY3JlZW5zaG90cyArIGV4cG9ydHMpLiBSZXF1aXJlcyB0aGUgb3B0aW9uYWwgYGRvd25sb2Fkcy51aWBcbiAgICAvLyBwZXJtaXNzaW9uIOKAlCB0aGUgc2V0dGluZ3MgY2hlY2tib3ggcmVxdWVzdHMgaXQgb24gZW5hYmxlLlxuICAgIHF1aWV0U2F2ZXM6IGJvb2xlYW47XG4gICAgLy8gQnVuZGxlIHRoZSB2ZW5kb3JlZCB0aGlyZC1wYXJ0eSBkZXNpZ24gc2tpbGxzIChpbXBlY2NhYmxlIHJlZmVyZW5jZVxuICAgIC8vIHNldCArIHBlcmNlcHRpb24tZmlyc3QtZGVzaWduKSBwbHVzIHNraWxscy1pbmRleC5qc29uIGludG8gYXJjaGl2ZVxuICAgIC8vIGV4cG9ydHMuIE9uIGJ5IGRlZmF1bHQ6IHRoZSBTZW5kLXRvLUFnZW50IHByb3RvY29sJ3Mgc2tpbGwtbWFwcGluZ1xuICAgIC8vIHBoYXNlIGFzc3VtZXMgdGhlaXIgcHJlc2VuY2UuIH4xLjIgTUIgb2YgbWFya2Rvd24gcGVyIGJ1bmRsZS5cbiAgICBidW5kbGVTa2lsbHM6IGJvb2xlYW47XG4gIH07XG4gIGNvbnN0IERFRkFVTFRfUFJFRlM6IFByZWZzID0ge1xuICAgIGluY2x1ZGVPdXRlckhUTUw6IHRydWUsXG4gICAgaW5jbHVkZU1hdGNoZWRSdWxlczogdHJ1ZSxcbiAgICBpbmNsdWRlU3R5bGVzOiB0cnVlLFxuICAgIC8vIERlZmF1bHQgdG8gbWluaWZpZWQgZXhwb3J0cyDigJQgbW9zdCBhZ2VudHMgd2FudCB0aGUgc21hbGxlc3RcbiAgICAvLyB0b2tlbi1mb290cHJpbnQgcGF5bG9hZC4gRXhpc3RpbmcgdXNlcnMnIHNhdmVkIHByZWZzIGFyZSBtZXJnZWQgb3ZlclxuICAgIC8vIHRoaXMgZGVmYXVsdCBpbiBsb2FkQWxsKCksIHNvIG9ubHkgTkVXL3Vuc2V0IGluc3RhbGxzIHNlZSB0aGUgZmxpcC5cbiAgICBtaW5pZnk6IHRydWUsXG4gICAgYXV0b1Njcm9sbFRvSG92ZXJlZDogdHJ1ZSxcbiAgICB1c2VTY3JlZW5zaG90czogdHJ1ZSxcbiAgICBzcGFjaW5nT3ZlcmxheTogZmFsc2UsXG4gICAgaG92ZXJTbmFwOiB0cnVlLFxuICAgIGF1dG9TY3JlZW5zaG90OiB0cnVlLFxuICAgIHNraXBTY3JlZW5zaG90SG9zdHM6ICcnLFxuICAgIC8vIGRlc2lnbk1kIC8gc2tpbGxNZCBkZWZhdWx0IHRvICcnIHdoaWNoIHRoZSByZXNvbHZlciB0cmVhdHMgYXNcbiAgICAvLyBcImZhbGwgYmFjayB0byB0aGUgYnVuZGxlZCB0ZW1wbGF0ZSBhdCBleHBvcnQgdGltZVwiLiBTdG9yaW5nIHRoZVxuICAgIC8vIGVtcHR5IHN0cmluZyBrZWVwcyBjaHJvbWUuc3RvcmFnZSBzbWFsbCBhbmQgbGV0cyBgaXNVc2luZ1RlbXBsYXRlKmBcbiAgICAvLyBiZSBhIGNoZWFwIHN5bmNocm9ub3VzIGNoZWNrLlxuICAgIGRlc2lnbk1kOiAnJyxcbiAgICBkZXNpZ25QYXRoOiAnfi8uYWdlbnRzL0RFU0lHTi5tZCcsXG4gICAgc2tpbGxQYXRoOiAnfi8uYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLFxuICAgIHNraWxsTWQ6ICcnLFxuICAgIHBhZ2VTaG90UGVyQ2FwdHVyZTogZmFsc2UsXG4gICAgcXVpZXRTYXZlczogZmFsc2UsXG4gICAgYnVuZGxlU2tpbGxzOiB0cnVlLFxuICB9O1xuXG4gIC8vIFJld3JpdGUgdGhlIGBuYW1lOmAgZmllbGQgaW4gYSBTS0lMTC5tZCdzIFlBTUwgZnJvbnRtYXR0ZXIuIFRoZVxuICAvLyB1c2VyJ3Mgc291cmNlLW9mLXRydXRoIFNLSUxMLm1kIGlzIGNhdGFsb2d1ZWQgdW5kZXIgd2hhdGV2ZXIgbmFtZVxuICAvLyB0aGVpciB3aWRlciBgLmFnZW50cy9za2lsbHMvYCB0cmVlIHVzZXMgKG9mdGVuIGB1aWApOyB0aGUgYnVuZGxlZFxuICAvLyBhcmNoaXZlIGNvcHkgc2hvdWxkIGFsd2F5cyBpZGVudGlmeSBhcyBgUGluY2hHcmFiYCBzbyBhIGRvd25zdHJlYW1cbiAgLy8gTExNIHJlYWRpbmcgdGhlIG1hbmlmZXN0IGRvZXNuJ3QgZ2V0IGNvbmZ1c2VkIGFib3V0IHdoaWNoIHNraWxsXG4gIC8vIGZpbGUgYXBwbGllcy4gT25seSB0aGUgRklSU1QgdG9wLW9mLWZpbGUgYG5hbWU6YCBsaW5lIHdpdGhpbiB0aGVcbiAgLy8gbGVhZGluZyBgLS0tYCBibG9jayBpcyB0b3VjaGVkLlxuICBjb25zdCByZWJyYW5kU2tpbGxOYW1lID0gKG1kOiBzdHJpbmcsIG5ld05hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgLy8gVGhlIGZyb250bWF0dGVyIGJsb2NrLCBpZiBwcmVzZW50LCBpcyBiZXR3ZWVuIGxlYWRpbmcgYC0tLVxcbmBcbiAgICAvLyBhbmQgdGhlIG5leHQgYFxcbi0tLVxcbmAuIEFueXRoaW5nIGVsc2UgKG5vIGZyb250bWF0dGVyLCBuYW1lIG5vdFxuICAgIC8vIG9uIGEgc2luZ2xlIGxpbmUsIGV0Yy4pIHJldHVybnMgdW5jaGFuZ2VkIOKAlCBiZXR0ZXIgdG8gc2hpcCB0aGVcbiAgICAvLyBvcmlnaW5hbCB0aGFuIHJpc2sgY29ycnVwdGluZyB0aGUgZmlsZS5cbiAgICBjb25zdCBtID0gbWQubWF0Y2goL14tLS1cXHI/XFxuKFtcXHNcXFNdKj8pXFxyP1xcbi0tLVxccj9cXG4vKTtcbiAgICBpZiAoIW0pIHJldHVybiBtZDtcbiAgICBjb25zdCBmbSA9IG1bMV0hO1xuICAgIGNvbnN0IHJlYnJhbmRlZEZtID0gZm0ucmVwbGFjZSgvXm5hbWU6XFxzKi4rJC9tLCBgbmFtZTogJHtuZXdOYW1lfWApO1xuICAgIGlmIChyZWJyYW5kZWRGbSA9PT0gZm0pIHJldHVybiBtZDsgLy8gbm8gYG5hbWU6YCBmaWVsZDsgbm90aGluZyB0byBkb1xuICAgIHJldHVybiBtZC5yZXBsYWNlKG1bMF0sIGAtLS1cXG4ke3JlYnJhbmRlZEZtfVxcbi0tLVxcbmApO1xuICB9O1xuICB0eXBlIFdvcmtzcGFjZSA9IHtuYW1lOiBzdHJpbmc7IGNyZWF0ZWRBdDogc3RyaW5nOyB0YWJJZD86IG51bWJlcjsgdXJsPzogc3RyaW5nOyB0aXRsZT86IHN0cmluZ307XG4gIC8vIE9uZSBhcmNoaXZlZCBzdGF0ZSBvZiBhIHdvcmtzcGFjZSAoY2FwdHVyZWQganVzdCBiZWZvcmUgYSBDbGVhci1hbGwpLlxuICAvLyBgc2hvdHNgIGlzIHRoZSB0aHVtYm5haWwgbWFwIChmdWxsLXJlcyBQTkdzIGFyZSBzZXNzaW9uLW9ubHkgYW5kIG5vdFxuICAvLyBhcmNoaXZlZCkuIFJlc3RvcmFibGUgZnJvbSBTZXR0aW5ncyDihpIgV29ya3NwYWNlcy5cbiAgdHlwZSBXb3Jrc3BhY2VTbmFwc2hvdCA9IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHRzOiBzdHJpbmc7XG4gICAgbWVzc2FnZXM6IFBhbmVsTWVzc2FnZVtdO1xuICAgIHNob3RzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIHNlbGVjdG9yczogbnVtYmVyO1xuICAgIGNvbW1lbnRzOiBudW1iZXI7XG4gIH07XG5cbiAgbGV0IG1lc3NhZ2VzOiBQYW5lbE1lc3NhZ2VbXSA9IFtdO1xuICBsZXQgbGl2ZVRhYlVybDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsaXZlVGFiUGF0aDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHNlbGVjdG9yVmFsaWRpdHkgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbiB8ICdkaWZmLXBhZ2UnPigpO1xuICBjb25zdCBzZWxlY3RvckVycm9ycyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGNvbnN0IGluc2VydEJlZm9yZToge2N1cnJlbnQ6IHN0cmluZyB8IG51bGw7IGNvbW1lbnQ6IGJvb2xlYW59ID0ge2N1cnJlbnQ6IG51bGwsIGNvbW1lbnQ6IGZhbHNlfTtcbiAgbGV0IHNlYXJjaFF1ZXJ5ID0gJyc7XG4gIGxldCBsYXN0QWN0aXZlU2VsZWN0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgc3RpY2t5VGltZXIgPSAwO1xuICBsZXQgU1RJQ0tZX1RUTF9NUyA9IDVfMDAwO1xuICBsZXQgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gIGxldCBwaGFudG9tVGFyZ2V0OiB7c2VsZWN0b3I6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgdGFnPzogc3RyaW5nOyByZWN0PzogRE9NUmVjdH0gfCBudWxsID0gbnVsbDtcbiAgbGV0IHBlbmRpbmdNdWx0aTogRW50cnlbXSA9IFtdO1xuICBjb25zdCBzaG90cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIEZ1bGwtcmVzb2x1dGlvbiBQTkcgZGF0YVVSTCBwZXIgc2VsZWN0b3IuIE5PVCBwZXJzaXN0ZWQgdG9cbiAgLy8gY2hyb21lLnN0b3JhZ2UgKGNhcCBwcmVzc3VyZSDigJQgMTAwIGNhcHR1cmVzIMOXIDgwIEtCIGVhY2ggPSA4IE1CKSwgc29cbiAgLy8gaXQncyBvbmx5IGF2YWlsYWJsZSBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbidzIGFyY2hpdmUgZXhwb3J0LiBDbGVhcmVkXG4gIC8vIG9uIHdvcmtzcGFjZSBzd2l0Y2guXG4gIGNvbnN0IHNob3RzRnVsbCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIC8vIFRyYWNrIHdoaWNoICh3b3Jrc3BhY2UsIHBhZ2UtdXJsKSB0dXBsZXMgYWxyZWFkeSBmaXJlZCBhIHBhZ2Ugc2hvdCBzbyB3ZVxuICAvLyBkb24ndCByZS1zaG9vdCB0aGUgZW50aXJlIHBhZ2Ugb24gZXZlcnkgY2FwdHVyZS4gUmVzZXQgb24gd29ya3NwYWNlXG4gIC8vIHN3aXRjaCDigJQgbm8gZGF5IGtleSwgdGhlIGRlZHVwZSBpcyBwZXItc2Vzc2lvbi5cbiAgY29uc3QgcGFnZVNob3RzRmlyZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcGFnZVNob3RLZXkgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4gYCR7YWN0aXZlV3N9OiR7dXJsfWA7XG4gIC8vIExhc3Qgc3VjY2Vzc2Z1bCBleHBvcnQg4oCUIGJvdGggdGhlIHdvcmtzcGFjZS1yZWxhdGl2ZSBwYXRoIChzaG93biB0byB0aGVcbiAgLy8gdXNlcikgYW5kIHRoZSBPUy1hYnNvbHV0ZSBwYXRoIChjb3BpZWQgYnkgdGhlIFwiQ29weSBhcyBwYXRoXCIgYnV0dG9uKS5cbiAgLy8gVXBkYXRlZCBvbiBKU09OTC9NRC9aSVAvc2NyZWVuc2hvdCBzYXZlcy5cbiAgY29uc3QgbGFzdEV4cG9ydDoge3JlbFBhdGg6IHN0cmluZyB8IG51bGw7IGFic1BhdGg6IHN0cmluZyB8IG51bGw7IGNvcHlQYXRoOiBzdHJpbmcgfCBudWxsOyB0ZW1wUGF0aDogYm9vbGVhbjsga2luZDogc3RyaW5nIHwgbnVsbH0gPSB7XG4gICAgcmVsUGF0aDogbnVsbCwgYWJzUGF0aDogbnVsbCwgY29weVBhdGg6IG51bGwsIHRlbXBQYXRoOiBmYWxzZSwga2luZDogbnVsbCxcbiAgfTtcbiAgbGV0IHdvcmtzcGFjZXM6IFdvcmtzcGFjZVtdID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gIGxldCBhY3RpdmVXcyA9ICdkZWZhdWx0JztcbiAgLy8gU2Vzc2lvbiB1dWlkIOKAlCBnZW5lcmF0ZWQgb25jZSBwZXIgd29ya3NwYWNlIGJvb3QuIEdvZXMgb250byBldmVyeVxuICAvLyBwYWdlIHJvdyBhbmQgZXZlcnkgc2VsZWN0b3IgZW50cnkgc28gYSBjb25zdW1lciBjYW4gbGluayBjYXB0dXJlc1xuICAvLyB0byBcIndoaWNoIHNlc3Npb24/XCIgd2l0aG91dCBVUkwtc3RyaW5nIGNvbXBhcmUuIFN0YWJsZSBhY3Jvc3MgYVxuICAvLyBzaW5nbGUgd29ya3NwYWNlIGxvYWQ7IHJlc2V0cyBvbiB3b3Jrc3BhY2Ugc3dpdGNoLlxuICBsZXQgc2Vzc2lvbklkOiBzdHJpbmcgPSAnJztcbiAgY29uc3Qgd3NNc2dLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5tZXNzYWdlcy52MWA7XG4gIGNvbnN0IHdzU2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90cy52MWA7XG4gIC8vIFBlcnNpc3RlbnQgc25hcHNob3QgaGlzdG9yeSBwZXIgd29ya3NwYWNlIOKAlCBhIENsZWFyLWFsbCBhcmNoaXZlcyB0aGUgd2lwZWRcbiAgLy8gY2FwdHVyZXMrY29tbWVudHMrdGh1bWJuYWlscyBoZXJlIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIGxhdGVyIGZyb21cbiAgLy8gU2V0dGluZ3Mg4oaSIFdvcmtzcGFjZXMuIExpdmVzIGluIHRoZSBzYW1lIGNocm9tZS5zdG9yYWdlIGxheWVyIGFzIHRoZSByZXN0XG4gIC8vIG9mIHRoZSB3b3Jrc3BhY2UgZGF0YS5cbiAgY29uc3Qgd3NTbmFwc2hvdHNLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zbmFwc2hvdHMudjFgO1xuICAvLyBDYXAgc28gdGhlIGhpc3RvcnkgY2FuJ3QgYmFsbG9vbiBzdG9yYWdlOyBvbGRlc3Qgc25hcHNob3RzIGRyb3Agb2ZmLlxuICBjb25zdCBXU19TTkFQU0hPVF9DQVAgPSAxMDtcbiAgY29uc3Qgd3NTaG90c0Z1bGxLZXkgPSAobjogc3RyaW5nKTogc3RyaW5nID0+IGBwaW5jaGdyYWIud3MuJHtufS5zaG90c0Z1bGwudjFgO1xuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBoYXMgYSAxMCBNQiBkZWZhdWx0IHF1b3RhOyB3ZSBidWRnZXQgaGFsZiBvZlxuICAvLyB0aGF0IGZvciBmdWxsLXJlc29sdXRpb24gUE5HcyAodGhlIHJlc3QgaXMgbWVzc2FnZXMsIHByZWZzLCB0aHVtYnMpLlxuICAvLyBXaGVuIHRoZSBidWRnZXQgaXMgcmVhY2hlZCB3ZSBGSUZPLWV2aWN0IHRoZSBvbGRlc3QgZW50cmllcyAoTWFwXG4gIC8vIHByZXNlcnZlcyBpbnNlcnRpb24gb3JkZXIpLiBFc3RpbWF0ZSBkYXRhVVJMIHNpemUgPSBzdHJpbmcgbGVuZ3RoLlxuICBjb25zdCBTSE9UU19GVUxMX0JVREdFVF9CWVRFUyA9IDUgKiAxMDI0ICogMTAyNDtcbiAgY29uc3QgdW5kb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCByZWRvU3RhY2s6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFVORE9fQ0FQID0gMzA7XG4gIGxldCBzdXNwZW5kU25hcHNob3RzID0gZmFsc2U7XG4gIGxldCBwcmVmczogUHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGU307XG5cbiAgLy8g4pSA4pSA4pSAIFN0YXR1cyBoZWxwZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBzdGF0dXNUaW1lciA9IDA7XG4gIGNvbnN0IHNldFN0YXR1cyA9IChtc2c6IHN0cmluZywgb3B0czoge2tpbmQ/OiAnd2FybicgfCAnaW5mbycgfCAnb2snfSA9IHt9KTogdm9pZCA9PiB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gbXNnIHx8ICcnO1xuICAgIGNsZWFyVGltZW91dChzdGF0dXNUaW1lcik7XG4gICAgaWYgKG1zZykge1xuICAgICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gb3B0cy5raW5kID09PSAnd2FybicgPyAndmFyKC0tcmVkKScgOlxuICAgICAgICBvcHRzLmtpbmQgPT09ICdpbmZvJyA/ICd2YXIoLS10ZXh0LTMpJyA6ICd2YXIoLS1ncmVlbiknO1xuICAgICAgc3RhdHVzVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHN0YXR1cy50ZXh0Q29udGVudCA9ICcnOyB9LCAyMjAwKTtcbiAgICB9XG4gIH07XG4gIGxldCB0b2FzdFRpbWVyID0gMDtcbiAgY29uc3Qgc2hvd1RvYXN0ID0gKHRpdGxlOiBzdHJpbmcsIGRldGFpbCA9ICcnLCBraW5kOiAnb2snIHwgJ3dhcm4nID0gJ29rJyk6IHZvaWQgPT4ge1xuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1jb3B5LXRvYXN0XScpO1xuICAgIGlmICghdG9hc3QpIHtcbiAgICAgIHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b2FzdC5jbGFzc05hbWUgPSAnY29weS10b2FzdCc7XG4gICAgICB0b2FzdC5kYXRhc2V0LmNvcHlUb2FzdCA9ICd0cnVlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRvYXN0KTtcbiAgICB9XG4gICAgdG9hc3QuY2xhc3NMaXN0LnRvZ2dsZSgnd2FybicsIGtpbmQgPT09ICd3YXJuJyk7XG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC1pY29uXCI+JHtQR19JQ09OUy5zdmdTdHJpbmcoa2luZCA9PT0gJ3dhcm4nID8gJ2FsZXJ0LWNpcmNsZScgOiAnY2lyY2xlLWNoZWNrJywgMjIpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY29weS10b2FzdC10ZXh0XCI+PGI+JHtlc2NhcGVIdG1sKHRpdGxlKX08L2I+JHtkZXRhaWwgPyBgPHNtYWxsPiR7ZXNjYXBlSHRtbChkZXRhaWwpfTwvc21hbGw+YCA6ICcnfTwvc3Bhbj5gO1xuICAgIHRvYXN0LmhpZGRlbiA9IGZhbHNlO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB2b2lkIHRvYXN0Lm9mZnNldFdpZHRoO1xuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcik7XG4gICAgdG9hc3RUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRvYXN0Py5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IGlmICh0b2FzdCkgdG9hc3QuaGlkZGVuID0gdHJ1ZTsgfSwgMTgwKTtcbiAgICB9LCAxNDUwKTtcbiAgfTtcbiAgY29uc3Qgc2hvd0NvcGllZCA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWwgPSAnJyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICdvaycpO1xuICBjb25zdCBzaG93RG93bmxvYWRFcnJvciA9IChsYWJlbDogc3RyaW5nLCBkZXRhaWw6IHN0cmluZyk6IHZvaWQgPT4gc2hvd1RvYXN0KGxhYmVsLCBkZXRhaWwsICd3YXJuJyk7XG5cbiAgLy8g4pSA4pSA4pSAIFV0aWxpdGllcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgbGV0IGZhbGxiYWNrSWRDb3VudGVyID0gMDtcbiAgY29uc3Qgc2VjdXJlVG9rZW4gPSAoYnl0ZXMgPSAxMik6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBVaW50OEFycmF5KGJ5dGVzKTtcbiAgICAgIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYXcpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20ocmF3KS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGAke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfV8keygrK2ZhbGxiYWNrSWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG1zZ0lkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgdHJ5IHsgaWYgKGdsb2JhbFRoaXMuY3J5cHRvLnJhbmRvbVVVSUQpIHJldHVybiBnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEKCk7IH0gY2F0Y2ggeyAvKiBmYWxsIHRocm91Z2ggKi8gfVxuICAgIHJldHVybiBgaWRfJHtzZWN1cmVUb2tlbigxNil9YDtcbiAgfTtcbiAgY29uc3QgZXNjYXBlSHRtbCA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBTdHJpbmcocykucmVwbGFjZUFsbCgnJicsICcmYW1wOycpLnJlcGxhY2VBbGwoJzwnLCAnJmx0OycpLnJlcGxhY2VBbGwoJz4nLCAnJmd0OycpO1xuICBjb25zdCBlc2NhcGVSZSA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xuICBjb25zdCBoaWdobGlnaHRNYXRjaCA9ICh0ZXh0OiBzdHJpbmcsIHE6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFxKSByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KTtcbiAgICByZXR1cm4gZXNjYXBlSHRtbCh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoYCgke2VzY2FwZVJlKHEpfSlgLCAnZ2knKSwgJzxtYXJrPiQxPC9tYXJrPicpO1xuICB9O1xuICAvLyBXYWxrIHRleHQgbm9kZXMgaW5zaWRlIGByb290YCwgd3JhcHBpbmcgY2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGVzIG9mIGBxYFxuICAvLyBpbiA8bWFyaz4gZWxlbWVudHMuIERvZXNuJ3QgdG91Y2ggYXR0cmlidXRlIHN0cmluZ3Mgb3IgaW5uZXItdGFnIEhUTUwgc29cbiAgLy8gaXQncyBzYWZlIHRvIHJ1biBvbiBhbHJlYWR5LWhpZ2hsaWdodGVkIEpTT04gb3V0cHV0LlxuICBjb25zdCB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzID0gKHJvb3Q6IEhUTUxFbGVtZW50LCBxOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoIXEpIHJldHVybjtcbiAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmUocSksICdnaScpO1xuICAgIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIocm9vdCwgTm9kZUZpbHRlci5TSE9XX1RFWFQpO1xuICAgIGNvbnN0IHRhcmdldHM6IFRleHRbXSA9IFtdO1xuICAgIGxldCBub2RlOiBOb2RlIHwgbnVsbDtcbiAgICB3aGlsZSAoKG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgIGlmIChyZS50ZXN0KG5vZGUubm9kZVZhbHVlID8/ICcnKSkgdGFyZ2V0cy5wdXNoKG5vZGUgYXMgVGV4dCk7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHQgb2YgdGFyZ2V0cykge1xuICAgICAgY29uc3QgdmFsdWUgPSB0Lm5vZGVWYWx1ZSA/PyAnJztcbiAgICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBsZXQgbGFzdCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgdmFsdWUubWF0Y2hBbGwocmUpKSB7XG4gICAgICAgIGNvbnN0IGkgPSBtLmluZGV4ID8/IDA7XG4gICAgICAgIGlmIChpID4gbGFzdCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCwgaSkpO1xuICAgICAgICBjb25zdCBtayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21hcmsnKTtcbiAgICAgICAgbWsudGV4dENvbnRlbnQgPSBtWzBdO1xuICAgICAgICBmcmFnLmFwcGVuZChtayk7XG4gICAgICAgIGxhc3QgPSBpICsgbVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICBpZiAobGFzdCA8IHZhbHVlLmxlbmd0aCkgZnJhZy5hcHBlbmQodmFsdWUuc2xpY2UobGFzdCkpO1xuICAgICAgdC5yZXBsYWNlV2l0aChmcmFnKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHdvcmRDb3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gKHMubWF0Y2goL1xcUysvZykgPz8gW10pLmxlbmd0aDtcbiAgY29uc3QgdG9rZW5Db3VudCA9IChzOiBzdHJpbmcpOiBudW1iZXIgPT4gTWF0aC5jZWlsKHMubGVuZ3RoIC8gNCk7XG4gIGNvbnN0IHBhdGhPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5wYXRobmFtZTsgfSBjYXRjaCB7IHJldHVybiB1OyB9IH07XG4gIGNvbnN0IGhvc3RPZiA9ICh1OiBzdHJpbmcpOiBzdHJpbmcgPT4geyB0cnkgeyByZXR1cm4gbmV3IFVSTCh1KS5ob3N0OyB9IGNhdGNoIHsgcmV0dXJuICcnOyB9IH07XG4gIC8vIEZpbGVuYW1lLXNhZmUgaG9zdCBzbHVnOiBkb3RzIOKGkiB1bmRlcnNjb3JlcyBwZXIgcHJvamVjdCBjb252ZW50aW9uLlxuICAvLyBNaXJyb3JzIGJhY2tncm91bmQudHMgaG9zdFNsdWcgZm9yIHN5bW1ldHJ5IGFjcm9zcyBzY3JlZW5zaG90ICsgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcy5cbiAgY29uc3QgaG9zdFNsdWcgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGggPSBob3N0T2YodXJsKTtcbiAgICBpZiAoIWgpIHJldHVybiAndW5rbm93bic7XG4gICAgcmV0dXJuIGgucmVwbGFjZSgvXFwuL2csICdfJykucmVwbGFjZSgvW15cXHctXS9nLCAnXycpLnNsaWNlKDAsIDQwKSB8fCAndW5rbm93bic7XG4gIH07XG4gIC8vIFBpY2sgdGhlIG1vc3QtZnJlcXVlbnQgaG9zdCBhY3Jvc3MgYWxsIHNlbGVjdG9yIGNhcHR1cmVzIChmb3IgZXhwb3J0XG4gIC8vIGZpbGVuYW1lcykuIFdoZW4gdGhlIHdvcmtzcGFjZSBzcGFucyBtdWx0aXBsZSBob3N0cywgcmV0dXJuICdtdWx0aScuXG4gIGNvbnN0IGRvbWluYW50SG9zdFNsdWcgPSAoKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdFNsdWcobS5lbnRyeS51cmwpO1xuICAgICAgY291bnRzLnNldChoLCAoY291bnRzLmdldChoKSA/PyAwKSArIDEpO1xuICAgIH1cbiAgICBpZiAoIWNvdW50cy5zaXplKSByZXR1cm4gJ2VtcHR5JztcbiAgICBsZXQgYmVzdCA9ICcnO1xuICAgIGxldCBiZXN0TiA9IDA7XG4gICAgZm9yIChjb25zdCBbaCwgbl0gb2YgY291bnRzKSB7XG4gICAgICBpZiAobiA+IGJlc3ROKSB7IGJlc3QgPSBoOyBiZXN0TiA9IG47IH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50cy5zaXplID4gMSA/ICdtdWx0aScgOiBiZXN0O1xuICB9O1xuICAvLyBEaXN0aW5jdCBob3N0cyBwcmVzZW50IGluIHRoaXMgd29ya3NwYWNlIChhbHBoYWJldGljYWwsIGNhcHBlZCkuIFVzZWQgaW5cbiAgLy8gdGhlIGV4cG9ydCBtYW5pZmVzdCdzIGBob3N0c2AgZmllbGQuXG4gIGNvbnN0IGRpc3RpbmN0SG9zdHMgPSAoKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IHNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBoID0gaG9zdE9mKG0uZW50cnkudXJsKTtcbiAgICAgIGlmIChoKSBzZXQuYWRkKGgpO1xuICAgIH1cbiAgICByZXR1cm4gWy4uLnNldF0uc29ydCgpLnNsaWNlKDAsIDIwKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIERldGVybWluaXN0aWMgZXhwb3J0IGlkZW50aXR5IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBPbmUgY2xvY2sgcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGluc2lkZSBhIHNpbmdsZSBleHBvcnQgZGVyaXZlc1xuICAvLyBmcm9tIHRoZSBzYW1lIGluc3RhbnQsIGFuZCB0ZXN0cyBjYW4gZnJlZXplIGl0IHNvIHR3byBleHBvcnRzIG9mIHRoZVxuICAvLyBzYW1lIGNvbnRlbnQgYXJlIGJ5dGUtaWRlbnRpY2FsLlxuICBsZXQgZXhwb3J0Q2xvY2tPdmVycmlkZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGV4cG9ydE5vd0lzbyA9ICgpOiBzdHJpbmcgPT4gZXhwb3J0Q2xvY2tPdmVycmlkZSA/PyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIC8vIFN0YWJsZSBjb250ZW50IGlkZW50aXR5OiBTSEEtMjU2IG92ZXIgdGhlIHNsaW0gcm93cyBwbHVzIHRoZSBzb3J0ZWRcbiAgLy8gc2NyZWVuc2hvdCBhcmNoaXZlIG5hbWVzLiBTYW1lIHdvcmtzcGFjZSBjb250ZW50IOKGkiBzYW1lIGhhc2gg4oaSIHNhbWVcbiAgLy8gZmlsZW5hbWUgKHRoZSBiYWNrZ3JvdW5kIHNhdmVzIHdpdGggY29uZmxpY3RBY3Rpb24gJ292ZXJ3cml0ZScpLCBzb1xuICAvLyByZS1leHBvcnRpbmcgdW5jaGFuZ2VkIGNvbnRlbnQgcmVwbGFjZXMgcmF0aGVyIHRoYW4gZHVwbGljYXRlcy5cbiAgY29uc3QgY29tcHV0ZUNvbnRlbnRIYXNoID0gYXN5bmMgKHNob3ROYW1lczogc3RyaW5nW10pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGNvbnN0IHBheWxvYWQgPSBidWlsZFNsaW0oKS5tYXAoKGwpID0+IEpTT04uc3RyaW5naWZ5KGwpKS5qb2luKCdcXG4nKSArICdcXG4nICsgWy4uLnNob3ROYW1lc10uc29ydCgpLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGRpZ2VzdCA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEtMjU2JywgbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHBheWxvYWQpKTtcbiAgICByZXR1cm4gWy4uLm5ldyBVaW50OEFycmF5KGRpZ2VzdCldLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSkuam9pbignJyk7XG4gIH07XG4gIC8vIEJ1aWxkIGEgZmlsZW5hbWUgb2YgdGhlIHNoYXBlIGBwaW5jaGdyYWItPHdvcmtzcGFjZT4tPGhvc3Q+LTxzdGFtcD4uPGV4dD5gLlxuICAvLyBUaGUgc3RhbXAgaXMgdGhlIGV4cG9ydCdzIGNvbnRlbnQtaGFzaCBwcmVmaXggd2hlbiBzdXBwbGllZCAoYnVuZGxlIGFuZFxuICAvLyBKU09OTCBleHBvcnRzKSwgZmFsbGluZyBiYWNrIHRvIHRoZSBlcG9jaCBmb3IgbGVnYWN5IGNhbGxlcnMuXG4gIGNvbnN0IGJ1aWxkRXhwb3J0RmlsZW5hbWUgPSAoZXh0OiAnanNvbmwnIHwgJ21kJyB8ICd0YXIuenN0Jywgc3RhbXA/OiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBgcGluY2hncmFiLSR7YWN0aXZlV3N9LSR7ZG9taW5hbnRIb3N0U2x1ZygpfS0ke3N0YW1wID8/IERhdGUubm93KCl9LiR7ZXh0fWA7XG4gIC8vIFNraXAtbGlzdCBtYXRjaDogc3Vic3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSBtYXRjaCBhZ2FpbnN0IHRoZSBVUkwnc1xuICAvLyBob3N0LiBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBVUkwgcGFyc2luZyBvbiB0aGUgcGF0dGVybnMgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHdyaXRlIGB3cmFubmdsZS5jb21gIGFuZCBoYXZlIGl0IG1hdGNoIGBhcHAud3Jhbm5nbGUuY29tYCB0b28uXG4gIGNvbnN0IHNob3VsZFNraXBTY3JlZW5zaG90ID0gKHVybDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgbGlzdCA9IChwcmVmcy5za2lwU2NyZWVuc2hvdEhvc3RzID8/ICcnKS5zcGxpdCgnLCcpLm1hcCgocykgPT4gcy50cmltKCkudG9Mb3dlckNhc2UoKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0ID0gaG9zdE9mKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGlzdC5zb21lKChwYXQpID0+IGhvc3QuaW5jbHVkZXMocGF0KSk7XG4gIH07XG5cbiAgLy8gSlNPTiBzeW50YXggaGlnaGxpZ2h0IChwZXIta2V5IGNvbG9yIGlzIGhhc2hlZCBmb3IgdmlzdWFsIHZhcmlldHkpLlxuICBjb25zdCBLRVlfUEFMRVRURSA9IFsnI2ZmN2U3OCcsICcjZmZiNDU0JywgJyNmZmUwNjYnLCAnIzdiZDk3YScsICcjNWZkMWZmJywgJyM5YjhjZmYnLCAnI2ZmODVjMScsICcjZmY1ZjAwJywgJyMxMGI5ODEnLCAnI2Y1OWUwYicsICcjYTc4YmZhJywgJyMzNGQzOTknXTtcbiAgY29uc3QgY29sb3JGb3JLZXkgPSAoazogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBsZXQgaCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBoID0gKGggKiAzMSArIGsuY2hhckNvZGVBdChpKSkgPj4+IDA7XG4gICAgcmV0dXJuIEtFWV9QQUxFVFRFW2ggJSBLRVlfUEFMRVRURS5sZW5ndGhdITtcbiAgfTtcbiAgY29uc3QgSlNPTl9UT0tFTl9SRSA9IC8oXFxzKyl8KFwiKD86W15cIlxcXFxdfFxcXFwuKSpcIil8KHRydWV8ZmFsc2V8bnVsbCl8KC0/XFxkKyg/OlxcLlxcZCspPyg/OltlRV1bKy1dP1xcZCspPyl8KFt7fVtcXF0sOl0pL2c7XG4gIGNvbnN0IGFwcGVuZEpzb25IaWdobGlnaHQgPSAocm9vdDogSFRNTEVsZW1lbnQsIHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHJvb3QudGV4dENvbnRlbnQgPSAnJztcbiAgICBsZXQgbTogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcbiAgICBsZXQgbGFzdCA9IDA7XG4gICAgSlNPTl9UT0tFTl9SRS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IEpTT05fVE9LRU5fUkUuZXhlYyh0ZXh0KSkgIT09IG51bGwpIHtcbiAgICAgIGlmIChtLmluZGV4ID4gbGFzdCkgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dC5zbGljZShsYXN0LCBtLmluZGV4KSkpO1xuICAgICAgbGFzdCA9IEpTT05fVE9LRU5fUkUubGFzdEluZGV4O1xuICAgICAgY29uc3QgWywgd3MsIHN0ciwgbGl0LCBudW0sIHB1bmN0XSA9IG07XG4gICAgICBpZiAod3MpIHsgcm9vdC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUod3MpKTsgY29udGludWU7IH1cbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgbGV0IGsgPSBKU09OX1RPS0VOX1JFLmxhc3RJbmRleDtcbiAgICAgICAgd2hpbGUgKGsgPCB0ZXh0Lmxlbmd0aCAmJiAodGV4dFtrXSA9PT0gJyAnIHx8IHRleHRba10gPT09ICdcXHQnIHx8IHRleHRba10gPT09ICdcXG4nKSkgaysrO1xuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBpZiAodGV4dFtrXSA9PT0gJzonKSB7XG4gICAgICAgICAgbGV0IGtleTogc3RyaW5nO1xuICAgICAgICAgIHRyeSB7IGtleSA9IEpTT04ucGFyc2Uoc3RyKSBhcyBzdHJpbmc7IH0gY2F0Y2ggeyBrZXkgPSBzdHIuc2xpY2UoMSwgLTEpOyB9XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAnayc7XG4gICAgICAgICAgc3Bhbi5zdHlsZS5jb2xvciA9IGNvbG9yRm9yS2V5KGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Bhbi5jbGFzc05hbWUgPSAncyc7XG4gICAgICAgIH1cbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHN0cjtcbiAgICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGlmIChsaXQpIHNwYW4uY2xhc3NOYW1lID0gJ2InO1xuICAgICAgZWxzZSBpZiAobnVtKSBzcGFuLmNsYXNzTmFtZSA9ICduJztcbiAgICAgIGVsc2UgaWYgKHB1bmN0KSBzcGFuLmNsYXNzTmFtZSA9ICdwJztcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBsaXQgPz8gbnVtID8/IHB1bmN0ID8/ICcnO1xuICAgICAgcm9vdC5hcHBlbmQoc3Bhbik7XG4gICAgfVxuICAgIGlmIChsYXN0IDwgdGV4dC5sZW5ndGgpIHJvb3QuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCkpKTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgUGVyc2lzdGVuY2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGxvYWRBbGwgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd29ya3NwYWNlcyA9IChhd2FpdCBTdG9yZS5nZXQ8V29ya3NwYWNlW10+KFdPUktTUEFDRVNfS0VZLCB3b3Jrc3BhY2VzKSkgfHwgd29ya3NwYWNlcztcbiAgICBpZiAoIXdvcmtzcGFjZXMubGVuZ3RoKSB3b3Jrc3BhY2VzID0gW3tuYW1lOiAnZGVmYXVsdCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfV07XG4gICAgYWN0aXZlV3MgPSAoYXdhaXQgU3RvcmUuZ2V0PHN0cmluZz4oJ3BpbmNoZ3JhYi5hY3RpdmVXb3Jrc3BhY2UnLCAnZGVmYXVsdCcpKSB8fCAnZGVmYXVsdCc7XG4gICAgaWYgKCF3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gYWN0aXZlV3MpKSBhY3RpdmVXcyA9IHdvcmtzcGFjZXNbMF0hLm5hbWU7XG4gICAgcHJlZnMgPSB7Li4uREVGQVVMVF9QUkVGUywgLi4uKGF3YWl0IFN0b3JlLmdldDxQYXJ0aWFsPFByZWZzPj4oUFJFRlNfU1RPUkFHRV9OQU1FLCB7fSkpfTtcbiAgICAvLyBQYXRoIG1pZ3JhdGlvbjogcHJpb3IgdmVyc2lvbnMgZGVmYXVsdGVkIHNraWxsUGF0aCB0b1xuICAgIC8vIGB+Ly5hZ2VudHMvc2tpbGxzL3VpL1NLSUxMLm1kYCwgYW5kIHNvbWUgdXNlcnMgaGFkIGl0IHN0b3JlZCBhc1xuICAgIC8vIGB+Ly5kb3RmaWxlcy8uYWdlbnRzL3NraWxscy91aS9TS0lMTC5tZGAuIFRoZSBza2lsbCB3YXMgcmVuYW1lZFxuICAgIC8vIHRvIGBQaW5jaEdyYWJgOyBhbnkgYH4vLmRvdGZpbGVzL2AgcHJlZml4IGlzIHN0cmlwcGVkIGZyb21cbiAgICAvLyBleHBvc2VkIGRlZmF1bHRzIChkb3RmaWxlcyBpcyBhIHBlcnNvbmFsIGNvbmZpZyBzb3VyY2Ug4oCUIGV4cG9ydHNcbiAgICAvLyBzaG91bGRuJ3QgbGVhayB0aGF0IHBhdGgpLlxuICAgIGNvbnN0IHVwZ3JhZGVQYXRoID0gKHA6IHN0cmluZyB8IHVuZGVmaW5lZCwgZnJlc2g6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICBpZiAoIXApIHJldHVybiBmcmVzaDtcbiAgICAgIGlmIChwLmluY2x1ZGVzKCcuZG90ZmlsZXMnKSkgcmV0dXJuIGZyZXNoO1xuICAgICAgaWYgKHAuZW5kc1dpdGgoJ3NraWxscy91aS9TS0lMTC5tZCcpKSByZXR1cm4gZnJlc2g7XG4gICAgICByZXR1cm4gcDtcbiAgICB9O1xuICAgIHByZWZzLmRlc2lnblBhdGggPSB1cGdyYWRlUGF0aChwcmVmcy5kZXNpZ25QYXRoLCBERUZBVUxUX1BSRUZTLmRlc2lnblBhdGgpO1xuICAgIHByZWZzLnNraWxsUGF0aCA9IHVwZ3JhZGVQYXRoKHByZWZzLnNraWxsUGF0aCwgREVGQVVMVF9QUkVGUy5za2lsbFBhdGgpO1xuICAgIC8vIENvbnRlbnQgbWlncmF0aW9uOiBwcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgdGhlIGVudGlyZSB0ZW1wbGF0ZVxuICAgIC8vIHRleHQgaW5zaWRlIGBwcmVmcy5kZXNpZ25NZGAgLyBgcHJlZnMuc2tpbGxNZGAgYXMgZGVmYXVsdHMuIFRoYXRcbiAgICAvLyBhdGUgfjM2MEtCIG9mIGNocm9tZS5zdG9yYWdlIHF1b3RhIGZvciBubyBiZW5lZml0LiBEZXRlY3Qgd2hlblxuICAgIC8vIHRoZSBzdG9yZWQgdmFsdWUgbWF0Y2hlcyBvbmUgb2YgdGhlIGJ1bmRsZWQgdGVtcGxhdGVzIGFuZCBjbGVhclxuICAgIC8vIGl0IOKAlCB0aGUgcmVzb2x2ZXIgZmFsbHMgYmFjayB0byB0aGUgYnVuZGxlZCBmaWxlIG9uIHRoZSBmbHkuXG4gICAgLy8gQWxzbyBzY3J1YiBhbnkgbGVha2VkIGB+Ly5kb3RmaWxlcy9gIHN1YnN0cmluZy5cbiAgICBjb25zdCBzY3J1YkRvdGZpbGVzID0gKHM6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgICAgcy5yZXBsYWNlQWxsKCd+Ly5kb3RmaWxlcy8uYWdlbnRzLycsICd+Ly5hZ2VudHMvJylcbiAgICAgICAucmVwbGFjZUFsbCgnfi8uZG90ZmlsZXMvJywgJ34vLmFnZW50cy8nKTtcbiAgICBjb25zdCBjb2xsYXBzZUlmTWF0Y2hlc1RlbXBsYXRlID0gYXN5bmMgKGN1cnJlbnQ6IHN0cmluZywga2V5czogVGVtcGxhdGVLZXlbXSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICBpZiAoIWN1cnJlbnQgfHwgIWN1cnJlbnQudHJpbSgpKSByZXR1cm4gJyc7XG4gICAgICBjb25zdCB0cmltbWVkID0gY3VycmVudC50cmltKCk7XG4gICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xuICAgICAgICBjb25zdCB0cGwgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKGspKS50cmltKCk7XG4gICAgICAgIGlmICh0cGwgJiYgdHBsID09PSB0cmltbWVkKSByZXR1cm4gJyc7IC8vIG1hdGNoZXMgYSBidW5kbGVkIHRlbXBsYXRlIOKAlCBjb2xsYXBzZSB0byBlbXB0eVxuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnJlbnQuaW5jbHVkZXMoJy5kb3RmaWxlcycpID8gc2NydWJEb3RmaWxlcyhjdXJyZW50KSA6IGN1cnJlbnQ7XG4gICAgfTtcbiAgICBwcmVmcy5kZXNpZ25NZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuZGVzaWduTWQgPz8gJycsIFsnbG9jYWxEZXNpZ24nLCAnZGVzaWduVGVtcGxhdGUnXSk7XG4gICAgcHJlZnMuc2tpbGxNZCA9IGF3YWl0IGNvbGxhcHNlSWZNYXRjaGVzVGVtcGxhdGUocHJlZnMuc2tpbGxNZCA/PyAnJywgWydsb2NhbFNraWxsJywgJ3NraWxsVGVtcGxhdGUnXSk7XG4gICAgYXdhaXQgbG9hZFdvcmtzcGFjZShhY3RpdmVXcyk7XG4gIH07XG4gIGNvbnN0IGxvYWRXb3Jrc3BhY2UgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYWN0aXZlV3MgPSBuYW1lO1xuICAgIHZvaWQgU3RvcmUuc2V0KCdwaW5jaGdyYWIuYWN0aXZlV29ya3NwYWNlJywgbmFtZSk7XG4gICAgLy8gTWludCBhIG5ldyBzZXNzaW9uSWQgcGVyIHdvcmtzcGFjZSBsb2FkLiBTYW1lIHdvcmtzcGFjZSByZS1vcGVuZWRcbiAgICAvLyA9IG5ldyBzZXNzaW9uOiBkaXN0aW5jdCB1dWlkIHNvIGEgY29uc3VtZXIgY2FuIHRlbGwgdHdvIGJvb3RzXG4gICAgLy8gYXBhcnQgZXZlbiB3aGVuIHRoZSBjYXB0dXJlcyBsYW5kIGluIHRoZSBzYW1lIG9uLWRpc2sgZmlsZS5cbiAgICBzZXNzaW9uSWQgPSBtc2dJZCgpO1xuICAgIG1lc3NhZ2VzID0gKGF3YWl0IFN0b3JlLmdldDxQYW5lbE1lc3NhZ2VbXT4od3NNc2dLZXkobmFtZSksIFtdKSkgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkgbWVzc2FnZXMgPSBbXTtcbiAgICAvLyBNaWdyYXRlIGxlZ2FjeSBlbnRyaWVzIChubyB1aWQsIHN0YXRlcy1hcy1yZWNvcmQsIGF0dHJzLmZvcm1hdCkgYW5kXG4gICAgLy8gcGVyc2lzdCBpZiBhbnl0aGluZyBjaGFuZ2VkIHNvIHdlIGRvbid0IHBheSB0aGUgbWlncmF0aW9uIGNvc3QgYWdhaW5cbiAgICAvLyBuZXh0IGxvYWQuXG4gICAgaWYgKG1pZ3JhdGVMb2FkZWRNZXNzYWdlcygpKSB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShuYW1lKSwgbWVzc2FnZXMpO1xuICAgIHNob3RzLmNsZWFyKCk7XG4gICAgc2hvdHNGdWxsLmNsZWFyKCk7XG4gICAgcGFnZVNob3RzRmlyZWQuY2xlYXIoKTtcbiAgICBjb25zdCBzdG9yZWQgPSAoYXdhaXQgU3RvcmUuZ2V0PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KHdzU2hvdHNLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIC8vIFJlc3RvcmUgdGhlIGZ1bGwtcmVzb2x1dGlvbiBQTkcgY2FjaGUgc28gYSB3b3Jrc3BhY2UgYXJjaGl2ZVxuICAgIC8vIGV4cG9ydGVkIEFGVEVSIGEgcGFuZWwgcmVsb2FkIHN0aWxsIGJ1bmRsZXMgc2NyZWVuc2hvdHMgZnJvbVxuICAgIC8vIGVhcmxpZXIgY2FwdHVyZXMuIEZJRk8gb3JkZXIgaXMgcHJlc2VydmVkIGJ5IE9iamVjdCBrZXkgb3JkZXIuXG4gICAgY29uc3Qgc3RvcmVkRnVsbCA9IChhd2FpdCBTdG9yZS5nZXQ8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4od3NTaG90c0Z1bGxLZXkobmFtZSksIHt9KSkgfHwge307XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoc3RvcmVkRnVsbCkpIHNob3RzRnVsbC5zZXQoaywgdik7XG4gICAgLy8gTG9hZCB0aGlzIHdvcmtzcGFjZSdzIHBlcnNpc3RlbnQgc25hcHNob3QgaGlzdG9yeSAoQ2xlYXItYWxsIGFyY2hpdmVzKS5cbiAgICBhd2FpdCBsb2FkV3NTbmFwc2hvdHMobmFtZSk7XG4gICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgIHNlbGVjdG9yRXJyb3JzLmNsZWFyKCk7XG4gICAgdW5kb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgcmVkb1N0YWNrLmxlbmd0aCA9IDA7XG4gICAgbGl2ZVRhYlVybCA9IG51bGw7XG4gICAgbGFzdEFjdGl2ZVNlbGVjdG9yID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSBudWxsO1xuICAgIGxhc3RFeHBvcnQuYWJzUGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IG51bGw7XG4gICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IGZhbHNlO1xuICAgIGxhc3RFeHBvcnQua2luZCA9IG51bGw7XG4gICAgYXBwbHlQcmVmc1RvVUkoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgfTtcbiAgY29uc3QgcGVyc2lzdCA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldCh3c01zZ0tleShhY3RpdmVXcyksIG1lc3NhZ2VzKTtcbiAgICAvLyBQdXNoIGNhcHR1cmVkLXNlbGVjdG9yIHNldCBzbyB0aGUgY29udGVudCBzY3JpcHQncyBob3ZlciB3YWxrZXIgY2FuXG4gICAgLy8gcmVzb2x2ZSBkZXNjZW5kYW50cyDihpIgY2FwdHVyZWQgYW5jZXN0b3IuXG4gICAgY29uc3Qgc2VsZWN0b3JzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpO1xuICAgIHNlbmRUb0NTKHtraW5kOiAnc2V0LWNhcHR1cmVkJywgc2VsZWN0b3JzfSk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RQcmVmcyA9ICgpOiB2b2lkID0+IHtcbiAgICB2b2lkIFN0b3JlLnNldChQUkVGU19TVE9SQUdFX05BTUUsIHByZWZzKTtcbiAgICAvLyBQdXNoIHRoZSBzdWJzZXQgb2YgcHJlZnMgdGhlIGNvbnRlbnQgc2NyaXB0IGNhcmVzIGFib3V0IHNvIGl0c1xuICAgIC8vIG92ZXJsYXkgKHNwYWNpbmcgdmlzdWFsaXplciwgaG92ZXIgc25hcCwgZXRjLikgcmVmbGVjdHMgdGhlIGxhdGVzdC5cbiAgICB2b2lkIHNlbmRUb0NTKHtcbiAgICAgIGtpbmQ6ICdzZXQtY3MtcHJlZnMnLFxuICAgICAgc3BhY2luZ092ZXJsYXk6IHByZWZzLnNwYWNpbmdPdmVybGF5LFxuICAgICAgaG92ZXJTbmFwOiBwcmVmcy5ob3ZlclNuYXAsXG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90cyA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90cykgb2JqW2tdID0gdjtcbiAgICB2b2lkIFN0b3JlLnNldCh3c1Nob3RzS2V5KGFjdGl2ZVdzKSwgb2JqKTtcbiAgfTtcbiAgLy8gRnVsbC1yZXNvbHV0aW9uIFBORyBwZXJzaXN0ZW5jZSB3aXRoIEZJRk8gZXZpY3Rpb24uIGRhdGFVUkwgc3RyaW5nc1xuICAvLyBjYW4gcnVuIDUwLTUwMCBLQiBlYWNoOyB0aGUgZGVmYXVsdCBxdW90YSBnZXRzIGV4aGF1c3RlZCBpbiB0ZW5zIG9mXG4gIC8vIGNhcHR1cmVzIHdpdGhvdXQgYSBidWRnZXQuIE1hcCBpbnNlcnRpb24gb3JkZXIgPSBGSUZPIG9yZGVyLCBzb1xuICAvLyB3ZSBldmljdCBmcm9tIHRoZSBmcm9udCB1bnRpbCB1bmRlciBidWRnZXQgYmVmb3JlIHBlcnNpc3RpbmcuXG4gIGNvbnN0IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQgPSAoKTogbnVtYmVyID0+IHtcbiAgICBsZXQgdG90YWwgPSAwO1xuICAgIGZvciAoY29uc3QgdiBvZiBzaG90c0Z1bGwudmFsdWVzKCkpIHRvdGFsICs9IHYubGVuZ3RoO1xuICAgIGxldCBldmljdGVkID0gMDtcbiAgICB3aGlsZSAodG90YWwgPiBTSE9UU19GVUxMX0JVREdFVF9CWVRFUykge1xuICAgICAgY29uc3QgZmlyc3RLZXkgPSBzaG90c0Z1bGwua2V5cygpLm5leHQoKS52YWx1ZTtcbiAgICAgIGlmIChmaXJzdEtleSA9PT0gdW5kZWZpbmVkKSBicmVhaztcbiAgICAgIGNvbnN0IHJlbW92ZWQgPSBzaG90c0Z1bGwuZ2V0KGZpcnN0S2V5KTtcbiAgICAgIGlmIChyZW1vdmVkID09PSB1bmRlZmluZWQpIGJyZWFrO1xuICAgICAgc2hvdHNGdWxsLmRlbGV0ZShmaXJzdEtleSk7XG4gICAgICB0b3RhbCAtPSByZW1vdmVkLmxlbmd0aDtcbiAgICAgIGV2aWN0ZWQrKztcbiAgICB9XG4gICAgcmV0dXJuIGV2aWN0ZWQ7XG4gIH07XG4gIGNvbnN0IHBlcnNpc3RTaG90c0Z1bGwgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXZpY3RlZCA9IGV2aWN0U2hvdHNGdWxsVG9CdWRnZXQoKTtcbiAgICBpZiAoZXZpY3RlZCA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgYHNob3RzRnVsbCBGSUZPLWV2aWN0ZWQgJHtldmljdGVkfSBvbGRlc3QgZW50cmllcyB0byBmaXQgJHtTSE9UU19GVUxMX0JVREdFVF9CWVRFUyAvIDEwMjQgLyAxMDI0fU1CIGJ1ZGdldGApO1xuICAgIH1cbiAgICBjb25zdCBvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBzaG90c0Z1bGwpIG9ialtrXSA9IHY7XG4gICAgdm9pZCBTdG9yZS5zZXQod3NTaG90c0Z1bGxLZXkoYWN0aXZlV3MpLCBvYmopO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V29ya3NwYWNlcyA9ICgpOiB2b2lkID0+IHsgdm9pZCBTdG9yZS5zZXQoV09SS1NQQUNFU19LRVksIHdvcmtzcGFjZXMpOyB9O1xuXG4gIC8vIOKUgOKUgOKUgCBUYWIg4oeEIHdvcmtzcGFjZSBiaW5kaW5nICgjMTgpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBCYWNrZ3JvdW5kIGFubm91bmNlcyBlYWNoIHRvb2xiYXItY2xpY2sgYWN0aXZhdGlvbiB2aWEgJ3BnLXRhYi1hY3RpdmF0ZWQnLlxuICAvLyBUaGUgZmlyc3QgYWN0aXZhdGlvbiBhZG9wdHMgdGhlIGN1cnJlbnQgdW5ib3VuZCB3b3Jrc3BhY2U7IGxhdGVyIHRhYnMgZWFjaFxuICAvLyBnZXQgdGhlaXIgb3duLiBQaWNraW5nIGEgYm91bmQgd29ya3NwYWNlIGp1bXBzIHRoZSBicm93c2VyIHRvIGl0cyB0YWIuXG4gIGNvbnN0IHNsdWdGb3JUYWIgPSAodXJsOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHRyeSB7IGNvbnN0IGggPSBuZXcgVVJMKHVybCkuaG9zdG5hbWUucmVwbGFjZSgvXnd3d1xcLi8sICcnKTsgaWYgKGgpIHJldHVybiBoOyB9IGNhdGNoIHsgLyogbm90IGEgdXJsICovIH1cbiAgICBjb25zdCB0ID0gKHRpdGxlIHx8ICcnKS50cmltKCk7XG4gICAgcmV0dXJuIHQgPyB0LnNsaWNlKDAsIDI0KSA6ICd0YWInO1xuICB9O1xuICBjb25zdCB1bmlxdWVXc05hbWUgPSAoYmFzZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBpZiAoIXdvcmtzcGFjZXMuc29tZSgodykgPT4gdy5uYW1lID09PSBiYXNlKSkgcmV0dXJuIGJhc2U7XG4gICAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7IGNvbnN0IG4gPSBgJHtiYXNlfSAke2l9YDsgaWYgKCF3b3Jrc3BhY2VzLnNvbWUoKHcpID0+IHcubmFtZSA9PT0gbikpIHJldHVybiBuOyB9XG4gIH07XG4gIGNvbnN0IG9uVGFiQWN0aXZhdGVkID0gYXN5bmMgKHt0YWJJZCwgdXJsLCB0aXRsZX06IHt0YWJJZDogbnVtYmVyOyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZ30pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcudGFiSWQgPT09IHRhYklkKTtcbiAgICBpZiAod3MpIHtcbiAgICAgIGlmICh3cy51cmwgIT09IHVybCB8fCB3cy50aXRsZSAhPT0gdGl0bGUpIHsgd3MudXJsID0gdXJsOyB3cy50aXRsZSA9IHRpdGxlOyBwZXJzaXN0V29ya3NwYWNlcygpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gYWN0aXZlV3MpO1xuICAgICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC50YWJJZCA9PSBudWxsKSB7XG4gICAgICAgIHdzID0gY3VycmVudDsgd3MudGFiSWQgPSB0YWJJZDsgd3MudXJsID0gdXJsOyB3cy50aXRsZSA9IHRpdGxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3MgPSB7bmFtZTogdW5pcXVlV3NOYW1lKHNsdWdGb3JUYWIodXJsLCB0aXRsZSkpLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdGFiSWQsIHVybCwgdGl0bGV9O1xuICAgICAgICB3b3Jrc3BhY2VzLnB1c2god3MpO1xuICAgICAgfVxuICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICB9XG4gICAgaWYgKGFjdGl2ZVdzICE9PSB3cy5uYW1lKSBhd2FpdCBsb2FkV29ya3NwYWNlKHdzLm5hbWUpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcbiAgLy8gQnJpbmcgdGhlIGJyb3dzZXIgdG8gYSB3b3Jrc3BhY2UncyBib3VuZCB0YWIgd2hlbiB0aGUgdXNlciBwaWNrcyBpdC5cbiAgY29uc3QgZm9jdXNXb3Jrc3BhY2VUYWIgPSAobmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKCFpbkV4dGVuc2lvbiB8fCB3cz8udGFiSWQgPT0gbnVsbCkgcmV0dXJuO1xuICAgIGNocm9tZS50YWJzLnVwZGF0ZSh3cy50YWJJZCwge2FjdGl2ZTogdHJ1ZX0pLnRoZW4oKHQpID0+IHtcbiAgICAgIGlmICh0Py53aW5kb3dJZCAhPSBudWxsKSB2b2lkIGNocm9tZS53aW5kb3dzPy51cGRhdGUodC53aW5kb3dJZCwge2ZvY3VzZWQ6IHRydWV9KT8uY2F0Y2g/LigoKSA9PiB7IC8qIGlnbm9yZSAqLyB9KTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7IC8qIHRhYiB3YXMgY2xvc2VkICovIH0pO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTbmFwc2hvdCAvIHVuZG8gLyByZWRvIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzbmFwc2hvdCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoc3VzcGVuZFNuYXBzaG90cykgcmV0dXJuO1xuICAgIGlmICh1bmRvU3RhY2subGVuZ3RoID49IFVORE9fQ0FQKSB1bmRvU3RhY2suc2hpZnQoKTtcbiAgICB1bmRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlZG9TdGFjay5sZW5ndGggPSAwO1xuICAgIHVwZGF0ZVVuZG9CdXR0b25zKCk7XG4gIH07XG4gIGNvbnN0IHJlc3RvcmUgPSAoanNvbjogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgc3VzcGVuZFNuYXBzaG90cyA9IHRydWU7XG4gICAgdHJ5IHsgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGpzb24pIGFzIFBhbmVsTWVzc2FnZVtdOyB9IGNhdGNoIHsgbWVzc2FnZXMgPSBbXTsgfVxuICAgIHN1c3BlbmRTbmFwc2hvdHMgPSBmYWxzZTtcbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG4gIGNvbnN0IHVuZG8gPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCF1bmRvU3RhY2subGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byB1bmRvJywge2tpbmQ6ICdpbmZvJ30pOyByZXR1cm47IH1cbiAgICByZWRvU3RhY2sucHVzaChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuICAgIHJlc3RvcmUodW5kb1N0YWNrLnBvcCgpISk7XG4gICAgc2V0U3RhdHVzKCdVbmRvbmUnKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICB9O1xuICBjb25zdCByZWRvID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghcmVkb1N0YWNrLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gcmVkbycsIHtraW5kOiAnaW5mbyd9KTsgcmV0dXJuOyB9XG4gICAgdW5kb1N0YWNrLnB1c2goSlNPTi5zdHJpbmdpZnkobWVzc2FnZXMpKTtcbiAgICByZXN0b3JlKHJlZG9TdGFjay5wb3AoKSEpO1xuICAgIHNldFN0YXR1cygnUmVkb25lJyk7XG4gICAgdXBkYXRlVW5kb0J1dHRvbnMoKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlVW5kb0J1dHRvbnMgPSAoKTogdm9pZCA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uPVwidW5kb1wiXScpPy5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHVuZG9TdGFjay5sZW5ndGggPT09IDApO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInJlZG9cIl0nKT8uY2xhc3NMaXN0LnRvZ2dsZSgnZGlzYWJsZWQnLCByZWRvU3RhY2subGVuZ3RoID09PSAwKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlQ29weVBhdGhCdXR0b24gPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWFjdGlvbj1cImNvcHktcGF0aFwiXScpO1xuICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgY29uc3QgaGFzID0gQm9vbGVhbihsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCk7XG4gICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJywgIWhhcyk7XG4gICAgYnRuLmRhdGFzZXQudGlwID0gaGFzXG4gICAgICA/IGBDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuXFxuJHtsYXN0RXhwb3J0LmNvcHlQYXRoID8/IGxhc3RFeHBvcnQuYWJzUGF0aCA/PyAnJ31gXG4gICAgICA6ICdDb3B5IHRoZSBwYXRoIG9mIHlvdXIgbGFzdCBleHBvcnQuIFJ1biBhbiBleHBvcnQgZmlyc3QuJztcbiAgfTtcbiAgY29uc3Qgb25Db3B5UGF0aCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBwYXRoVG9Db3B5ID0gbGFzdEV4cG9ydC5jb3B5UGF0aCA/PyBsYXN0RXhwb3J0LmFic1BhdGg7XG4gICAgaWYgKCFwYXRoVG9Db3B5KSB7XG4gICAgICBzZXRTdGF0dXMoJ05vIGV4cG9ydCB5ZXQg4oCUIHJ1biBhIGRvd25sb2FkIGZpcnN0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocGF0aFRvQ29weSk7XG4gICAgICAvLyBTaG93IG9ubHkgdGhlIGxlYWYgZmlsZW5hbWUgaW4gdGhlIHN0YXR1cyDigJQgdGhlIGZ1bGwgV2luZG93cy1zdHlsZVxuICAgICAgLy8gYWJzb2x1dGUgcGF0aCB3b3VsZCBiZSAxMDArIGNoYXJzIGFuZCB3YXMgZGlzcnVwdGluZyB0aGUgc2lkZWJhclxuICAgICAgLy8gbGF5b3V0IGZvciB0aGUgMi1zZWNvbmQgc3RhdHVzIFRUTC5cbiAgICAgIGNvbnN0IGxlYWYgPSBwYXRoVG9Db3B5LnJlcGxhY2UoL1tcXFxcL10rJC8sICcnKS5zcGxpdCgvW1xcXFwvXS8pLnBvcCgpID8/IHBhdGhUb0NvcHk7XG4gICAgICBzZXRTdGF0dXMoYENvcGllZCBwYXRoIMK3ICR7bGVhZn1gKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBwYXRoJywgbGVhZik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0U3RhdHVzKCdDbGlwYm9hcmQgd3JpdGUgZmFpbGVkOiAnICsgU3RyaW5nKChlIGFzIEVycm9yKT8ubWVzc2FnZSA/PyBlKSwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpKTtcbiAgICB9XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB0byBhY3RpdmUgdGFiIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZW5kVG9DUyA9IGFzeW5jIChwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBtc2cgPSBwZyhwYXlsb2FkKTtcbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSk7XG4gICAgICAgIGlmICh0YWJzWzBdPy5pZCAhPSBudWxsKSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCBtc2cpLmNhdGNoKCgpID0+IHsgLyogaWdub3JlICovIH0pO1xuICAgICAgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7IHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGluY2hncmFiOnRvLWNzJywge2RldGFpbDogbXNnfSkpOyB9IGNhdGNoIHsgLyogaWdub3JlICovIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHNlbmRUb0NTQW5kV2FpdCA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQ3MpOiBQcm9taXNlPFIgfCBudWxsPiA9PiBuZXcgUHJvbWlzZTxSIHwgbnVsbD4oKHJlc29sdmUpID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zdCByZXFJZCA9IGByZXFfJHtzZWN1cmVUb2tlbigxMil9YDtcbiAgICAgIGNvbnN0IG9uUmVzcCA9IChlOiBFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSAoZSBhcyBDdXN0b21FdmVudCkuZGV0YWlsO1xuICAgICAgICBpZiAoZGV0YWlsPy5fX3JlcUlkID09PSByZXFJZCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgICAgIHJlc29sdmUoZGV0YWlsLnJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaW5jaGdyYWI6Y3MtcmVzcG9uc2UnLCBvblJlc3ApO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdwaW5jaGdyYWI6dG8tY3MnLCB7ZGV0YWlsOiB7X19yZXFJZDogcmVxSWQsIC4uLnBnKHBheWxvYWQpfX0pKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGluY2hncmFiOmNzLXJlc3BvbnNlJywgb25SZXNwKTsgcmVzb2x2ZShudWxsKTsgfSwgMTAwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9LCAodGFicykgPT4ge1xuICAgICAgaWYgKCF0YWJzWzBdPy5pZCkgeyByZXNvbHZlKG51bGwpOyByZXR1cm47IH1cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHBnKHBheWxvYWQpLCAocjogUikgPT4gcmVzb2x2ZShyKSk7XG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBzZW5kVG9CZyA9IGFzeW5jIDxSPihwYXlsb2FkOiBQYW5lbFRvQmcpOiBQcm9taXNlPFIgfCBudWxsPiA9PiB7XG4gICAgaWYgKCFpbkV4dGVuc2lvbikgcmV0dXJuIG51bGw7XG4gICAgdHJ5IHsgcmV0dXJuIChhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShwZyhwYXlsb2FkKSkpIGFzIFI7IH1cbiAgICBjYXRjaCAoZSkgeyByZXR1cm4ge2Vycm9yOiBTdHJpbmcoKGUgYXMgRXJyb3IpPy5tZXNzYWdlID8/IGUpfSBhcyB1bmtub3duIGFzIFI7IH1cbiAgfTtcblxuICAvLyDilIDilIDilIAgUmVjZWl2aW5nIGZyb20gY29udGVudCBzY3JpcHQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIERlZmVuc2l2ZSByaW5nLWJ1ZmZlciBkZWR1cGU6IGV2ZW4gdGhvdWdoIHdlIG5vdyB1c2Ugb25seSBvbmUgY2hhbm5lbCxcbiAgLy8gYW55IG1lc3NhZ2UgdGhhdCBzb21laG93IGFycml2ZXMgdHdpY2Ugd2l0aGluIH4yIHNlY29uZHMgaXMgaWdub3JlZC5cbiAgY29uc3QgcmVjZW50TWlkczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgUkVDRU5UX01JRF9DQVAgPSA2NDtcbiAgY29uc3Qgb25Dc01lc3NhZ2UgPSAobXNnOiBQZ0VudmVsb3BlPENzVG9QYW5lbD4pOiB2b2lkID0+IHtcbiAgICBpZiAoIW1zZyB8fCBtc2cuX19wZyAhPT0gdHJ1ZSkgcmV0dXJuO1xuICAgIGlmIChtc2cuX19taWQpIHtcbiAgICAgIGlmIChyZWNlbnRNaWRzLmluY2x1ZGVzKG1zZy5fX21pZCkpIHJldHVybjtcbiAgICAgIHJlY2VudE1pZHMucHVzaChtc2cuX19taWQpO1xuICAgICAgaWYgKHJlY2VudE1pZHMubGVuZ3RoID4gUkVDRU5UX01JRF9DQVApIHJlY2VudE1pZHMuc2hpZnQoKTtcbiAgICB9XG4gICAgaWYgKChtc2cgYXMge2tpbmQ/OiBzdHJpbmd9KS5raW5kID09PSAncGctdGFiLWFjdGl2YXRlZCcpIHtcbiAgICAgIHZvaWQgb25UYWJBY3RpdmF0ZWQobXNnIGFzIHVua25vd24gYXMge3RhYklkOiBudW1iZXI7IHVybDogc3RyaW5nOyB0aXRsZTogc3RyaW5nfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXRjaCAobXNnLmtpbmQpIHtcbiAgICAgIGNhc2UgJ2NhcHR1cmUnOiBvbkNhcHR1cmUobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnaG92ZXInOiBvbkhvdmVyKG1zZyBhcyBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdob3Zlcid9Pik7IHJldHVybjtcbiAgICAgIGNhc2UgJ2hvdmVyLWVuZCc6IG9uSG92ZXJFbmQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1hZGQnOiBvblBlbmRpbmdBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGVuZGluZy1jbGVhcic6IG9uUGVuZGluZ0NsZWFyKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2ZlZWRiYWNrLWFkZCc6IG9uRmVlZGJhY2tBZGQobXNnKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncHJlZmVyZW5jZS1jaGFuZ2UnOiBvblByZWZlcmVuY2VDaGFuZ2UobXNnIGFzIEV4dHJhY3Q8Q3NUb1BhbmVsLCB7a2luZDogJ3ByZWZlcmVuY2UtY2hhbmdlJ30+KTsgcmV0dXJuO1xuICAgICAgY2FzZSAncGFnZS1zbmFwc2hvdCc6IG9uUGFnZVNuYXBzaG90KChtc2cgYXMgRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAncGFnZS1zbmFwc2hvdCd9PikucGF5bG9hZCk7IHJldHVybjtcbiAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25QcmVmZXJlbmNlQ2hhbmdlID0gKHtyZWFzb24sIHBhZ2V9OiB7cmVhc29uOiBzdHJpbmc7IHBhZ2U6IGFueX0pOiB2b2lkID0+IHtcbiAgICBsaXZlVGFiVXJsID0gcGFnZT8udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgbGl2ZVRhYlBhdGggPSBsaXZlVGFiVXJsID8gcGF0aE9mKGxpdmVUYWJVcmwpIDogbGl2ZVRhYlBhdGg7XG4gICAgLy8gUGFnZSByb3dzIGFyZSBjYXB0dXJlIGhlYWRlcnMsIG5vdCBhIHRhYi9wYWdlIHRlbGVtZXRyeSBmZWVkLiBUaGUgbmV4dFxuICAgIC8vIHNlbGVjdG9yIGNhcHR1cmUgZnJvbSB0aGlzIHBhZ2Ugd2lsbCBjYXJyeSB0aGUgbmV3IHZpZXdwb3J0L3N0YXRlIGFuZFxuICAgIC8vIGluc2VydCBhIHBhZ2UgaGVhZGVyIG9ubHkgaWYgbmVlZGVkLlxuICAgIHNldFN0YXR1cyhgJHtyZWFzb259IGNoYW5nZWRgLCB7a2luZDogJ2luZm8nfSk7XG4gIH07XG5cbiAgLy8gUGFnZS1ncm91cCByZWNvcmRzIG1heSBjYXJyeSBhIGZ1bGwtcGFnZSBzbmFwc2hvdCAodmlld3BvcnQsIHNjcm9sbFxuICAvLyBleHRlbnRzLCBkcHIsIGxhbmcsIGZ1bGwtcGFnZSBzY3JlZW5zaG90KS4gUGFnZU1lc3NhZ2UgaW4gdHlwZXMudHMgZG9lc24ndFxuICAvLyB5ZXQgZGVjbGFyZSB0aGUgZmllbGQsIHNvIHdlIHdpZGVuIGl0IGxvY2FsbHkg4oCUIHRoZSB2YWx1ZSBwZXJzaXN0cyB3aXRoXG4gIC8vIHRoZSByZXN0IG9mIHRoZSBtZXNzYWdlIEpTT04gYW5kIHJvdW5kLXRyaXBzIHRocm91Z2ggZXhwb3J0LlxuICB0eXBlIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90ID0gUGFnZU1lc3NhZ2UgJiB7c25hcHNob3Q/OiBQYWdlU25hcHNob3R9O1xuICAvLyBTbmFwc2hvdHMgdGhhdCBhcnJpdmVkIGJlZm9yZSBhIHBhZ2UtZ3JvdXAgcmVjb3JkIGV4aXN0cyBmb3IgdGhlaXIgVVJMLlxuICAvLyBBcHBsaWVkIHdoZW4gdGhlIHBhZ2UgaGVhZGVyIGlzIGxhdGVyIGNyZWF0ZWQgKHNlZSBvbkNhcHR1cmUpLlxuICBjb25zdCBwZW5kaW5nU25hcHNob3RzID0gbmV3IE1hcDxzdHJpbmcsIFBhZ2VTbmFwc2hvdD4oKTtcbiAgY29uc3QgYXBwbHlTbmFwc2hvdFRvUGFnZSA9IChzbmFwOiBQYWdlU25hcHNob3QpOiBib29sZWFuID0+IHtcbiAgICAvLyBBdHRhY2ggdG8gdGhlIG1vc3QgcmVjZW50IHBhZ2UtZ3JvdXAgcmVjb3JkIGZvciB0aGlzIFVSTC5cbiAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlID09PSAncGFnZScgJiYgbS51cmwgPT09IHNuYXAudXJsKSB7XG4gICAgICAgIChtIGFzIFBhZ2VNZXNzYWdlV2l0aFNuYXBzaG90KS5zbmFwc2hvdCA9IHNuYXA7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IG9uUGFnZVNuYXBzaG90ID0gKHBheWxvYWQ6IFBhZ2VTbmFwc2hvdCk6IHZvaWQgPT4ge1xuICAgIGlmICghcGF5bG9hZD8udXJsKSByZXR1cm47XG4gICAgaWYgKGFwcGx5U25hcHNob3RUb1BhZ2UocGF5bG9hZCkpIHtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwYWdlIHJlY29yZCB5ZXQg4oCUIHN0YXNoIGZvciB0aGUgbmV4dCBjYXB0dXJlIG9uIHRoaXMgVVJMLlxuICAgICAgcGVuZGluZ1NuYXBzaG90cy5zZXQocGF5bG9hZC51cmwsIHBheWxvYWQpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvbkZlZWRiYWNrQWRkID0gKHtzZWxlY3RvciwgdGV4dCwgdXJsLCBwYXJlbnRVaWR9OiB7c2VsZWN0b3I6IHN0cmluZzsgdGV4dDogc3RyaW5nOyB1cmw/OiBzdHJpbmc7IHBhcmVudFVpZD86IHN0cmluZ30pOiB2b2lkID0+IHtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICAvLyBSZXNvbHZlIHRoZSBwYXJlbnQgaW4gcHJpb3JpdHkgb3JkZXI6XG4gICAgLy8gICAxLiBwYXJlbnRVaWQg4oCUIHRoZSBjb250ZW50IHNjcmlwdCBzdXBwbGllZCBhIHN0YWJsZSB1aWQgKHRoZVxuICAgIC8vICAgICAgc3Ryb25nZXN0IG1hdGNoOyBzdXJ2aXZlcyBzZWxlY3RvciBjaGFuZ2VzLCBzaWJsaW5nXG4gICAgLy8gICAgICBjb2xsaXNpb25zLCBtdWx0aXBsZSBjYXB0dXJlcyBvZiB0aGUgc2FtZSBlbGVtZW50KS5cbiAgICAvLyAgIDIuIHNlbGVjdG9yICsgdXJsIOKAlCBjb21wb3NpdGUga2V5OyBwcmV2ZW50cyBjcm9zcy1wYWdlXG4gICAgLy8gICAgICBjb250YW1pbmF0aW9uIHdoZW4gdGhlIHNhbWUgc2VsZWN0b3IgZXhpc3RzIG9uIG11bHRpcGxlIFVSTHMuXG4gICAgLy8gICAzLiBzZWxlY3RvciArIGxpdmVUYWJVcmwg4oCUIGZhbGxiYWNrIHdoZW4gdGhlIG1lc3NhZ2UgZGlkbid0XG4gICAgLy8gICAgICBjYXJyeSBhbiBleHBsaWNpdCB1cmwgKG9sZGVyIGNvbnRlbnQtc2NyaXB0IG1lc3NhZ2VzKS5cbiAgICBsZXQgaWR4ID0gLTE7XG4gICAgaWYgKHBhcmVudFVpZCkge1xuICAgICAgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS51aWQgPT09IHBhcmVudFVpZCk7XG4gICAgfVxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBjb25zdCB3YW50VXJsID0gdXJsID8/IGxpdmVUYWJVcmwgPz8gbnVsbDtcbiAgICAgIGlkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT5cbiAgICAgICAgbS50eXBlID09PSAnc2VsZWN0b3InXG4gICAgICAgICYmIG0uZW50cnkuc2VsZWN0b3IgPT09IHNlbGVjdG9yXG4gICAgICAgICYmICghd2FudFVybCB8fCBtLmVudHJ5LnVybCA9PT0gd2FudFVybCkpO1xuICAgIH1cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ29uRmVlZGJhY2tBZGQ6IG5vIHBhcmVudCBmb3VuZCcsIHtzZWxlY3RvciwgdXJsLCBwYXJlbnRVaWR9KTtcbiAgICAgIHNldFN0YXR1cygnQ29tbWVudCBsb3N0IGl0cyBwYXJlbnQg4oCUIGNoZWNrIHRoZSBhY3RpdmUgY2FwdHVyZScsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCBwYXJlbnRNc2cgPSBtZXNzYWdlc1tpZHhdIGFzIFNlbGVjdG9yTWVzc2FnZTtcbiAgICBsZXQgaW5zZXJ0QXQgPSBpZHggKyAxO1xuICAgIHdoaWxlIChpbnNlcnRBdCA8IG1lc3NhZ2VzLmxlbmd0aCAmJiBtZXNzYWdlc1tpbnNlcnRBdF0/LnR5cGUgPT09ICdmZWVkYmFjaycpIGluc2VydEF0Kys7XG4gICAgLy8gU3RhbXAgcGFyZW50VWlkIG9uIHRoZSBuZXcgZmVlZGJhY2sgcm93IHNvIHRoZSBleHBvcnQgY2Fycmllc1xuICAgIC8vIHRoZSBGSyBsaW5rIGV4cGxpY2l0bHkgKG5vdCBqdXN0IGJ5IGNhcHR1cmUtYWRqYWNlbmN5KS5cbiAgICBtZXNzYWdlcy5zcGxpY2UoaW5zZXJ0QXQsIDAsIHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgcGFyZW50VWlkOiBwYXJlbnRNc2cuZW50cnkudWlkLFxuICAgIH0pO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgYWRkZWQgZnJvbSBwYWdlJyk7XG4gICAgLy8gRXZlcnkgZmVlZGJhY2sgcGFyZW50IHNob3VsZCBoYXZlIGEgc2NyZWVuc2hvdC4gSWYgdGhlIHBhcmVudFxuICAgIC8vIGNhcHR1cmUgZGlkbid0IGdldCBvbmUgKGF1dG9TY3JlZW5zaG90IG9mZiwgc2tpcFNjcmVlbnNob3RIb3N0c1xuICAgIC8vIGhpdCwgbmV0d29yayBnbGl0Y2gpLCByZS1maXJlIG5vdy5cbiAgICBpZiAoIXBhcmVudE1zZy5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChwYXJlbnRNc2cpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvblBlbmRpbmdBZGQgPSAoe2VudHJ5fToge2VudHJ5OiBFbnRyeX0pOiB2b2lkID0+IHsgcGVuZGluZ011bHRpLnB1c2goZW50cnkpOyByZW5kZXIoKTsgfTtcbiAgY29uc3Qgb25QZW5kaW5nQ2xlYXIgPSAoKTogdm9pZCA9PiB7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgfTtcblxuICBjb25zdCBmaW5kRHVwbGljYXRlID0gKHNlbGVjdG9yOiBzdHJpbmcsIHVybDogc3RyaW5nKTogU2VsZWN0b3JNZXNzYWdlIHwgdW5kZWZpbmVkID0+XG4gICAgbWVzc2FnZXMuZmluZCgobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+XG4gICAgICBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgbS5lbnRyeS5zZWxlY3RvciA9PT0gc2VsZWN0b3IgJiYgKCF1cmwgfHwgbS5lbnRyeS51cmwgPT09IHVybCkpO1xuXG4gIC8vIEZpbmQgYW4gZXhpc3RpbmcgY2FwdHVyZSBmb3IgdGhlIGFjdGl2ZSB0YWIgKyBzZWxlY3Rvci4gQ3Jvc3MtcGFnZVxuICAvLyBjb250YW1pbmF0aW9uIHByZXZlbnRpb24gKHNlZSB0eXBlcy50cyBmZWVkYmFjay1hZGQgZG9jc3RyaW5nKTpcbiAgLy8gYSBzZWxlY3RvciBhbG9uZSBpcyBOT1QgYSBzdGFibGUgaWRlbnRpdHkg4oCUIGBbZGF0YS10ZXN0aWQ9XCJmb3JlY2FzdC1pdGVtXCJdYFxuICAvLyBleGlzdHMgb24gZXZlcnkgcGFnZTsgYGJ1dHRvbmAgaXMgZXZlcnl3aGVyZS4gU3Ryb25nIGlkZW50aXR5IGlzXG4gIC8vIChzZWxlY3RvciArIHVybCkuIFJldHVybnMgdGhlIG1vc3QgcmVjZW50IG1hdGNoIHNvIHJlLWhvdmVyaW5nIGFuXG4gIC8vIGFscmVhZHktY2FwdHVyZWQgZWxlbWVudCByZXNvbHZlcyBjb25zaXN0ZW50bHkuXG4gIGNvbnN0IGZpbmRDYXB0dXJlRm9yQ3VycmVudFBhZ2UgPSAoc2VsZWN0b3I6IHN0cmluZyk6IFNlbGVjdG9yTWVzc2FnZSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgY29uc3QgdXJsID0gbGl2ZVRhYlVybDtcbiAgICAvLyBXYWxrIGJhY2t3YXJkcyBzbyB0aGUgbW9zdCByZWNlbnQgbWF0Y2hpbmcgY2FwdHVyZSB3aW5zIHdoZW4gYVxuICAgIC8vIHNlbGVjdG9yIGxlZ2l0aW1hdGVseSBoYXMgbXVsdGlwbGUgY2FwdHVyZXMgb24gdGhlIHNhbWUgcGFnZVxuICAgIC8vIChlLmcuLCB0aGUgdXNlciByZS1jYXB0dXJlZCB0aGUgc2FtZSBlbGVtZW50IGFmdGVyIGVkaXRzKS5cbiAgICBmb3IgKGxldCBpID0gbWVzc2FnZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yICE9PSBzZWxlY3RvcikgY29udGludWU7XG4gICAgICBpZiAodXJsICYmIG0uZW50cnkudXJsICE9PSB1cmwpIGNvbnRpbnVlO1xuICAgICAgcmV0dXJuIG07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgY29uc3QgY2Fub25pY2FsRW50cnkgPSAoZTogRW50cnkpOiBzdHJpbmcgPT4gSlNPTi5zdHJpbmdpZnkoe1xuICAgIHRhZzogZS50YWcsIHNlbGVjdG9yOiBlLnNlbGVjdG9yLCB0ZXh0OiBlLnRleHQsIHJvbGU6IGUucm9sZSxcbiAgICBhdHRyczogZS5hdHRycywgY2xhc3NlczogZS5jbGFzc2VzLFxuICAgIHJlY3Q6IGUucmVjdCwgb3V0ZXJIVE1MOiBlLm91dGVySFRNTCxcbiAgICBzdHlsZXM6IGUuc3R5bGVzLCBtYXRjaGVkUnVsZXM6IGUubWF0Y2hlZFJ1bGVzLFxuICB9KTtcblxuICBjb25zdCBvbkNhcHR1cmUgPSAoe2VudHJ5LCBwYWdlLCBncm91cGVkfTogRXh0cmFjdDxDc1RvUGFuZWwsIHtraW5kOiAnY2FwdHVyZSd9Pik6IHZvaWQgPT4ge1xuICAgIGlmICghZW50cnkgfHwgIXBhZ2UpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGxpdmVUYWJVcmwgPSBwYWdlLnVybDtcbiAgICBsaXZlVGFiUGF0aCA9IHBhdGhPZihwYWdlLnVybCk7XG4gICAgaWYgKGdyb3VwZWQpIHtcbiAgICAgIGZvciAobGV0IGkgPSBtZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBtID0gbWVzc2FnZXNbaV07XG4gICAgICAgIGlmIChtPy50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSBtLmVudHJ5Lmdyb3VwID8/IFtdO1xuICAgICAgICAgIGdyb3VwLnB1c2goZW50cnkpO1xuICAgICAgICAgIG0uZW50cnkuZ3JvdXAgPSBncm91cDtcbiAgICAgICAgICBwZXJzaXN0KCk7IHJlbmRlcigpOyBjb21wb3Nlci5mb2N1cygpO1xuICAgICAgICAgIC8vIEZpcmUgYSBncm91cCBzaG90IHVzaW5nIHRoZSBoZWFkICsgbWVtYmVycy4gVGhlIGhlYWQncyBzZWxlY3RvclxuICAgICAgICAgIC8vIGlzIG0uZW50cnkuc2VsZWN0b3I7IG1lbWJlcnMnIHNlbGVjdG9ycyBhcmUgaW4gdGhlIGZyZXNobHlcbiAgICAgICAgICAvLyBtdXRhdGVkIGdyb3VwIGFycmF5LlxuICAgICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFttLmVudHJ5LnNlbGVjdG9yLCAuLi4obS5lbnRyeS5ncm91cCA/PyBbXSkubWFwKChnKSA9PiBnLnNlbGVjdG9yKV07XG4gICAgICAgICAgdm9pZCBmaXJlR3JvdXBTaG90KG0sIHNlbGVjdG9ycyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIER1cGUgZGV0ZWN0aW9uLiBDcm9zcy1jb250YW1pbmF0aW9uIGZpeDogYSAoc2VsZWN0b3IsIHVybCkgbWF0Y2hcbiAgICAvLyBpcyBORUNFU1NBUlkgYnV0IG5vdCBTVUZGSUNJRU5UIOKAlCB0d28gc2libGluZyBlbGVtZW50cyB3aXRoIHRoZVxuICAgIC8vIHNhbWUgdGVzdElkIC8gc2FtZSByb2xlL2FyaWEgc2VsZWN0b3IgbGl2ZSBvbiB0aGUgc2FtZSBVUkwgYnV0XG4gICAgLy8gYXJlIGRpZmZlcmVudCBjYXB0dXJlcy4gQ29tcGFyZSB0aGUgY2Fub25pY2FsLWVudHJ5IGhhc2ggKHdoaWNoXG4gICAgLy8gaW5jbHVkZXMgcmVjdCwgdGV4dCwgb3V0ZXJIVE1MLCBldGMuKSBiZWZvcmUgdHJlYXRpbmcgdGhlIG5ld1xuICAgIC8vIGNhcHR1cmUgYXMgYSByZWZyZXNoIG9mIHRoZSBvbGQgb25lLiBXaGVuIHRoZSBoYXNoIGRpZmZlcnMsIHdlXG4gICAgLy8ga2VlcCBCT1RIIGNhcHR1cmVzIHJhdGhlciB0aGFuIG92ZXJ3cml0aW5nLlxuICAgIGNvbnN0IGR1cGUgPSBmaW5kRHVwbGljYXRlKGVudHJ5LnNlbGVjdG9yLCBlbnRyeS51cmwpO1xuICAgIGlmIChkdXBlKSB7XG4gICAgICBjb25zdCBiZWZvcmUgPSBjYW5vbmljYWxFbnRyeShkdXBlLmVudHJ5KTtcbiAgICAgIGNvbnN0IGFmdGVyID0gY2Fub25pY2FsRW50cnkoZW50cnkpO1xuICAgICAgaWYgKGJlZm9yZSA9PT0gYWZ0ZXIpIHtcbiAgICAgICAgY29tcG9zZXIuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gSGFzaGVzIGRpZmZlci4gVHdvIGNhc2VzOlxuICAgICAgLy8gICAoYSkgU2FtZSBlbGVtZW50IHJlLWNhcHR1cmVkIGFmdGVyIGNvbnRlbnQgY2hhbmdlIOKAlCB0aGUgcmVjdFxuICAgICAgLy8gICAgICAgc3RheXMgcHV0ICh3aXRoaW4gYSBmZXcgcHgpLCBidXQgdGV4dC9vdXRlckhUTUwgbW92ZWQuXG4gICAgICAvLyAgICAgICBUcmVhdCBhcyBhIHJlZnJlc2guXG4gICAgICAvLyAgIChiKSBEaWZmZXJlbnQgZWxlbWVudCB0aGF0IGhhcHBlbnMgdG8gc2hhcmUgYSBzZWxlY3RvciDigJQgdGhlXG4gICAgICAvLyAgICAgICByZWN0IGlzIGluIGEgZGlmZmVyZW50IHBvc2l0aW9uLiBUcmVhdCBhcyBhIG5ldyBjYXB0dXJlLlxuICAgICAgLy8gV2UgZGlzY3JpbWluYXRlIGJ5IHJlY3Qgb3ZlcmxhcDogaWYgYm90aCByZWN0cyBleGlzdCBhbmQgdGhlaXJcbiAgICAgIC8vIGNlbnRlcnMgYXJlIHdpdGhpbiA4cHggb24gYm90aCBheGVzLCByZWZyZXNoOyBvdGhlcndpc2Uga2VlcFxuICAgICAgLy8gYm90aC5cbiAgICAgIGNvbnN0IHIxID0gZHVwZS5lbnRyeS5yZWN0O1xuICAgICAgY29uc3QgcjIgPSBlbnRyeS5yZWN0O1xuICAgICAgY29uc3Qgc2FtZUVsZW1lbnQgPSByMSAmJiByMlxuICAgICAgICAmJiBNYXRoLmFicygocjEueCArIHIxLncgLyAyKSAtIChyMi54ICsgcjIudyAvIDIpKSA8PSA4XG4gICAgICAgICYmIE1hdGguYWJzKChyMS55ICsgcjEuaCAvIDIpIC0gKHIyLnkgKyByMi5oIC8gMikpIDw9IDg7XG4gICAgICBpZiAoc2FtZUVsZW1lbnQpIHtcbiAgICAgICAgZGVsZXRlIGR1cGUuZHVwZVBlbmRpbmc7XG4gICAgICAgIGR1cGUuZW50cnkgPSBlbnRyeTtcbiAgICAgICAgcGVyc2lzdCgpOyByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBVcGRhdGVkICMke2R1cGUuZW50cnkubn1gLCB7a2luZDogJ2luZm8nfSk7XG4gICAgICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIERpZmZlcmVudCBlbGVtZW50IHdpdGggdGhlIHNhbWUgc2VsZWN0b3Ig4oaSIGZhbGwgdGhyb3VnaCBhbmRcbiAgICAgIC8vIGVtaXQgYXMgYSBuZXcgY2FwdHVyZS4gVGhlIGFnZW50IHJlYWRpbmcgdGhlIGV4cG9ydCBzZWVzIGJvdGhcbiAgICAgIC8vIHJvd3Mgd2l0aCB0aGUgc2FtZSBzZWxlY3RvciBidXQgZGlmZmVyZW50IHVpZHMgKyByZWN0cy5cbiAgICB9XG4gICAgbGV0IHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkge1xuICAgICAgcG9zaXRpb24gPSBtZXNzYWdlcy5maW5kSW5kZXgoKG0pID0+IG0uaWQgPT09IGluc2VydEJlZm9yZS5jdXJyZW50KTtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHBvc2l0aW9uID0gbWVzc2FnZXMubGVuZ3RoO1xuICAgICAgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gU3RhbXAgdGhlIHNlc3Npb24gRksgc28gdGhlIGNvbnN1bWVyIGNhbiBqb2luIGVudHJpZXMgdG8gdGhlaXJcbiAgICAvLyBzZXNzaW9uIGhlYWRlciB3aXRob3V0IFVSTC1zdHJpbmcgY29tcGFyZS5cbiAgICBpZiAoc2Vzc2lvbklkKSBlbnRyeS5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gICAgY29uc3QgbmV3TXNnOiBTZWxlY3Rvck1lc3NhZ2UgPSB7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBlbnRyeS50cywgZW50cnl9O1xuICAgIC8vIFBhZ2Ugcm93cyBleGlzdCBvbmx5IGFzIGhlYWRlcnMgZm9yIGNhcHR1cmVkIHNlbGVjdG9ycy4gRG8gbm90IGNyZWF0ZVxuICAgIC8vIHRoZW0gZnJvbSB0YWIgYWN0aXZhdGlvbiwgdmFsaWRhdGlvbiwgb3IgcHJlZmVyZW5jZSBjaGFuZ2VzOyBpbnNlcnQgb25lXG4gICAgLy8gaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBmaXJzdCBzZWxlY3RvciBvZiBhIG5ldyBwYWdlIGJsb2NrLlxuICAgIGxldCBwcmV2aW91c1BhZ2U6IFBhZ2VNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IHBvc2l0aW9uIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IG0gPSBtZXNzYWdlc1tpXTtcbiAgICAgIGlmIChtPy50eXBlID09PSAncGFnZScpIHsgcHJldmlvdXNQYWdlID0gbTsgYnJlYWs7IH1cbiAgICAgIGlmIChtPy50eXBlID09PSAnc2VsZWN0b3InKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFwcmV2aW91c1BhZ2UgfHwgcHJldmlvdXNQYWdlLnVybCAhPT0gcGFnZS51cmwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNc2c6IFBhZ2VNZXNzYWdlID0ge1xuICAgICAgICB0eXBlOiAncGFnZScsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB1cmw6IHBhZ2UudXJsLCB0aXRsZTogcGFnZS50aXRsZSwgdmlld3BvcnQ6IHBhZ2Uudmlld3BvcnQsIHRva2VuczogcGFnZS50b2tlbnMsXG4gICAgICAgIHVzZXJBZ2VudDogcGFnZS51c2VyQWdlbnQsIGxhbmc6IHBhZ2UubGFuZyxcbiAgICAgICAgZ2l0Q29udGV4dDogKHBhZ2UgYXMgYW55KS5naXRDb250ZXh0LFxuICAgICAgICByb3V0ZTogKHBhZ2UgYXMgYW55KS5yb3V0ZSxcbiAgICAgICAgc3RhdGU6IChwYWdlIGFzIGFueSkuc3RhdGUsXG4gICAgICAgIHNlc3Npb25JZCxcbiAgICAgIH07XG4gICAgICAvLyBBdHRhY2ggYW55IHBhZ2Utc25hcHNob3QgdGhhdCBhcnJpdmVkIGJlZm9yZSB0aGlzIHBhZ2UgaGVhZGVyIGV4aXN0ZWQuXG4gICAgICBjb25zdCBwZW5kaW5nID0gcGVuZGluZ1NuYXBzaG90cy5nZXQocGFnZS51cmwpO1xuICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgKHBhZ2VNc2cgYXMgUGFnZU1lc3NhZ2VXaXRoU25hcHNob3QpLnNuYXBzaG90ID0gcGVuZGluZztcbiAgICAgICAgcGVuZGluZ1NuYXBzaG90cy5kZWxldGUocGFnZS51cmwpO1xuICAgICAgfVxuICAgICAgbWVzc2FnZXMuc3BsaWNlKHBvc2l0aW9uLCAwLCBwYWdlTXNnKTtcbiAgICAgIHBvc2l0aW9uKys7XG4gICAgfVxuICAgIG1lc3NhZ2VzLnNwbGljZShwb3NpdGlvbiwgMCwgbmV3TXNnKTtcbiAgICBwZXJzaXN0KCk7XG4gICAgLy8gSW50ZW50aW9uYWxseSBOTyBzZXRMYXN0QWN0aXZlKGVudHJ5LnNlbGVjdG9yKSBoZXJlIOKAlCB0aGUgdXNlciBhc2tlZFxuICAgIC8vIGZvciBmcmVzaCBjYXB0dXJlcyB0byBzdGF5IHVuLWhpZ2hsaWdodGVkIGluIHRoZSBzaWRlYmFyLiBUaGUgc3RpY2t5XG4gICAgLy8gcmluZyArIGxhc3QtYWN0aXZlIG91dGxpbmUgbm93IG9ubHkgZ2V0IGFwcGxpZWQgb24gZXhwbGljaXRcbiAgICAvLyBob3Zlci9jbGljayBvZiB0aGUgc2lkZWJhciBidWJibGUgKGFuZCB0aGUgcGFnZS1zaWRlIGZsYXNoIGZyb21cbiAgICAvLyBjYXB0dXJlRW50cnkgc3RpbGwgY29uZmlybXMgdGhlIGNhcHR1cmUgdmlzdWFsbHkgb24gdGhlIHBhZ2UpLlxuICAgIHJlbmRlcigpO1xuICAgIGNvbXBvc2VyLmZvY3VzKCk7XG4gICAgdm9pZCBmaXJlRWxlbWVudFNob3QobmV3TXNnKTtcbiAgICB2b2lkIGZpcmVQYWdlU2hvdElmTmVlZGVkKG5ld01zZyk7XG4gICAgdm9pZCBydW5WYWxpZGF0aW9uKCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIFNjcmVlbnNob3Qgd2lyaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBGaXJlIHRoZSBwZXItZWxlbWVudCBzaG90LCBhdHRhY2ggdGhlIHJldHVybmVkIGZpbGVuYW1lICsgZGF0YVVybCBvbnRvXG4gIC8vIHRoZSBlbnRyeSwgYW5kIHBlcnNpc3QuIHNob3VsZFNraXBTY3JlZW5zaG90IGJhaWxzIG9uIGhvc3RzIGluIHRoZVxuICAvLyB1c2VyJ3Mgc2tpcCBsaXN0OyBhdXRvU2NyZWVuc2hvdD1mYWxzZSBiYWlscyBnbG9iYWxseS5cbiAgY29uc3QgZmlyZUVsZW1lbnRTaG90ID0gYXN5bmMgKG1zZzogU2VsZWN0b3JNZXNzYWdlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGF1dG9TY3JlZW5zaG90PWZhbHNlJyk7XG4gICAgICAvLyBCdWcgIzI6IHRlbGwgdGhlIGV4cG9ydCB3aHkgdGhlIHNob3QgaXMgbWlzc2luZy5cbiAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0gey4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksIHVuYXZhaWxhYmxlUmVhc29uOiAnYXV0b1NjcmVlbnNob3RPZmYnfTtcbiAgICAgIC8vIFJlLXJlbmRlciBzbyB0aGUgcmVzZXJ2ZWQgc2tlbGV0b24gKHdoaWNoIGFzc3VtZWQgYSBzaG90IHdhcyBjb21pbmcpXG4gICAgICAvLyBjb2xsYXBzZXMgbm93IHRoYXQgd2Uga25vdyBvbmUgd29uJ3QgYXJyaXZlLlxuICAgICAgcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChtc2cuZW50cnkudXJsKSkge1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnZmlyZUVsZW1lbnRTaG90IHNraXBwZWQ6IGhvc3Qgb24gc2tpcCBsaXN0JywgbXNnLmVudHJ5LnVybCk7XG4gICAgICBtc2cuZW50cnkuc2NyZWVuc2hvdCA9IHsuLi4obXNnLmVudHJ5LnNjcmVlbnNob3QgPz8ge30pLCB1bmF2YWlsYWJsZVJlYXNvbjogJ3NraXBTY3JlZW5zaG90SG9zdHMnfTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3Qg4oaSJywgbXNnLmVudHJ5LnNlbGVjdG9yKTtcbiAgICAvLyBTVyBjb2xkLXN0YXJ0IHJhY2U6IHRoZSBGSVJTVCBjYXB0dXJlIGluIGEgc2Vzc2lvbiBvZnRlbiBsb3NlcyBpdHNcbiAgICAvLyBmaXJzdCBtZXNzYWdlIGJlY2F1c2UgdGhlIGJnIHdvcmtlciBpcyBzdGlsbCBzdGFydGluZy4gUmV0cnkgb25jZVxuICAgIC8vIGFmdGVyIGEgc2hvcnQgZGVsYXkgaWYgdGhlIGZpcnN0IGNhbGwgY29tZXMgYmFjayBudWxsL2VtcHR5LlxuICAgIGxldCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtZWxlbWVudCcsIHNlbGVjdG9yOiBtc2cuZW50cnkuc2VsZWN0b3IsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHkgfHwgKCFyZXBseS5vayAmJiAhcmVwbHkuZXJyb3IpKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdmaXJzdCBzY3JlZW5zaG90IHJlcGx5IHdhcyBlbXB0eTsgcmV0cnlpbmcgYWZ0ZXIgMjAwbXMgKFNXIGNvbGQtc3RhcnQpJyk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAyMDApKTtcbiAgICAgIHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2hvdFJlcGx5Pih7XG4gICAgICAgIGtpbmQ6ICdzaG90LWVsZW1lbnQnLCBzZWxlY3RvcjogbXNnLmVudHJ5LnNlbGVjdG9yLCBuOiBtc2cuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhMT0csICdmaXJlRWxlbWVudFNob3QgcmVwbHk6JywgcmVwbHkpO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkge1xuICAgICAgc2V0U3RhdHVzKGBTY3JlZW5zaG90IGZhaWxlZDogJHtyZXBseT8uZXJyb3IgPz8gJ25vIHJlcGx5IGZyb20gYmFja2dyb3VuZCd9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgbXNnLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAgIC4uLihtc2cuZW50cnkuc2NyZWVuc2hvdCA/PyB7fSksXG4gICAgICAgIHVuYXZhaWxhYmxlUmVhc29uOiByZXBseT8uZXJyb3IgPz8gJ2NhcHR1cmVGYWlsZWQnLFxuICAgICAgfTtcbiAgICAgIC8vIENvbGxhcHNlIHRoZSByZXNlcnZlZCBza2VsZXRvbiDigJQgbm8gc2hvdCBpcyBjb21pbmcgZm9yIHRoaXMgY2FwdHVyZS5cbiAgICAgIHJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBTdWNjZXNzZnVsIHJldHJ5IOKAlCBzdHJpcCBhbnkgcHJpb3IgdW5hdmFpbGFibGVSZWFzb24gc2luY2Ugd2Ugbm93XG4gICAgLy8gaGF2ZSBhIHJlYWwgc2hvdC5cbiAgICBkZWxldGUgbXNnLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgIGVsZW1lbnQ6IHJlcGx5LmZpbGVuYW1lLFxuICAgICAgY2FwdHVyZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgLi4uKHJlcGx5LmNyb3AgPyB7Y3JvcDogcmVwbHkuY3JvcH0gOiB7fSksXG4gICAgfTtcbiAgICBpZiAocmVwbHkuZGF0YVVybCkge1xuICAgICAgc2hvdHMuc2V0KG1zZy5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZGF0YVVybCk7XG4gICAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICB9XG4gICAgaWYgKHJlcGx5LmZ1bGxEYXRhVXJsKSB7XG4gICAgICBzaG90c0Z1bGwuc2V0KG1zZy5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZnVsbERhdGFVcmwpO1xuICAgICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIH1cbiAgICBwZXJzaXN0KCk7XG4gICAgcmVuZGVyKCk7XG4gIH07XG5cbiAgLy8gRmlyZSB0aGUgZ3JvdXAgc2hvdCAodW5pb24gYmJveCBvZiBoZWFkICsgYWxsIG1lbWJlcnMpIGFuZCBzdGFzaCB0aGVcbiAgLy8gZmlsZW5hbWUgb24gdGhlIGhlYWQtb2YtZ3JvdXAgZW50cnkuXG4gIGNvbnN0IGZpcmVHcm91cFNob3QgPSBhc3luYyAoaGVhZDogU2VsZWN0b3JNZXNzYWdlLCBzZWxlY3RvcnM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcmVmcy5hdXRvU2NyZWVuc2hvdCkgcmV0dXJuO1xuICAgIGlmIChzaG91bGRTa2lwU2NyZWVuc2hvdChoZWFkLmVudHJ5LnVybCkpIHJldHVybjtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtZ3JvdXAnLCBzZWxlY3RvcnMsIG46IGhlYWQuZW50cnkubiwgd29ya3NwYWNlOiBhY3RpdmVXcyxcbiAgICB9KTtcbiAgICBpZiAoIXJlcGx5Py5vayB8fCAhcmVwbHkuZmlsZW5hbWUpIHJldHVybjtcbiAgICBoZWFkLmVudHJ5LnNjcmVlbnNob3QgPSB7XG4gICAgICAuLi4oaGVhZC5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgIGdyb3VwOiByZXBseS5maWxlbmFtZSxcbiAgICAgIGNhcHR1cmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9O1xuICAgIGlmIChyZXBseS5kYXRhVXJsKSB7XG4gICAgICBzaG90cy5zZXQoaGVhZC5lbnRyeS5zZWxlY3RvciwgcmVwbHkuZGF0YVVybCk7XG4gICAgICBpZiAocmVwbHkuZnVsbERhdGFVcmwpIHsgc2hvdHNGdWxsLnNldChoZWFkLmVudHJ5LnNlbGVjdG9yLCByZXBseS5mdWxsRGF0YVVybCk7IHBlcnNpc3RTaG90c0Z1bGwoKTsgfVxuICAgICAgcGVyc2lzdFNob3RzKCk7XG4gICAgfVxuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgfTtcblxuICAvLyBQYWdlLWxldmVsIHNob3Qgb25jZSBwZXIgKHdvcmtzcGFjZSwgcGFnZS11cmwsIGRheSkuIFN1YnNlcXVlbnQgY2FwdHVyZXNcbiAgLy8gb24gdGhlIHNhbWUgcGFnZSByZXVzZSB0aGUgc2FtZSBvbi1kaXNrIGZpbGUgcGF0aC5cbiAgY29uc3QgZmlyZVBhZ2VTaG90SWZOZWVkZWQgPSBhc3luYyAobXNnOiBTZWxlY3Rvck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIXByZWZzLmF1dG9TY3JlZW5zaG90KSByZXR1cm47XG4gICAgaWYgKHNob3VsZFNraXBTY3JlZW5zaG90KG1zZy5lbnRyeS51cmwpKSByZXR1cm47XG4gICAgLy8gUGVyLWNhcHR1cmUgcGFnZS1zaG90IG1vZGUgKMKnNC41KTogd2hlbiBlbmFibGVkLCBza2lwIHRoZVxuICAgIC8vIHBlci0od29ya3NwYWNlLCB1cmwpIGRlZHVwZSBhbmQgZmlyZSBhIGZyZXNoIHBhZ2Ugc2hvdCBldmVyeSB0aW1lLlxuICAgIC8vIFVzZWZ1bCB3aGVuIHRoZSBwYWdlIHN0YXRlIGNoYW5nZXMgYmV0d2VlbiBjYXB0dXJlcyAobW9kYWwgb3BlbnMsXG4gICAgLy8gbXVsdGktc3RlcCBmbG93LCBldGMuKSBhbmQgdGhlIHVzZXIgd2FudHMgdG8gc2VlIHRoZSB3aG9sZSBwYWdlIGF0XG4gICAgLy8gZWFjaCBzdGVwLiBDb3N0cyBvbmUgZnVsbC1wYWdlIFBORyBwZXIgY2FwdHVyZSwgc28gZGVmYXVsdCBvZmYuXG4gICAgaWYgKCFwcmVmcy5wYWdlU2hvdFBlckNhcHR1cmUpIHtcbiAgICAgIGNvbnN0IGtleSA9IHBhZ2VTaG90S2V5KG1zZy5lbnRyeS51cmwpO1xuICAgICAgaWYgKHBhZ2VTaG90c0ZpcmVkLmhhcyhrZXkpKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gZmluZEV4aXN0aW5nUGFnZVNob3QobXNnLmVudHJ5LnVybCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgIG1zZy5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAgICAgLi4uKG1zZy5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgICAgIHBhZ2U6IGV4aXN0aW5nLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBhZ2VTaG90c0ZpcmVkLmFkZChrZXkpO1xuICAgIH1cbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0JnPFNob3RSZXBseT4oe1xuICAgICAga2luZDogJ3Nob3QtcGFnZScsIG46IG1zZy5lbnRyeS5uLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgIH0pO1xuICAgIGlmICghcmVwbHk/Lm9rIHx8ICFyZXBseS5maWxlbmFtZSkgcmV0dXJuO1xuICAgIC8vIEFwcGx5IHRvIFRISVMgZW50cnkgYW5kIHRvIGFueSBvdGhlciBlbnRyaWVzIGFscmVhZHkgY2FwdHVyZWQgb24gdGhlXG4gICAgLy8gc2FtZSBVUkwgdG9kYXkgKHNvIHRoZSBwYWdlLXNob3QgYXBwZWFycyB1bmlmb3JtbHkpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS51cmwgIT09IG1zZy5lbnRyeS51cmwpIGNvbnRpbnVlO1xuICAgICAgbS5lbnRyeS5zY3JlZW5zaG90ID0ge1xuICAgICAgICAuLi4obS5lbnRyeS5zY3JlZW5zaG90ID8/IHt9KSxcbiAgICAgICAgcGFnZTogcmVwbHkuZmlsZW5hbWUsXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBTdGFzaCB0aGUgZnVsbCBQTkcgc28gdGhlIHdvcmtzcGFjZSBhcmNoaXZlIGNhbiBidW5kbGUgaXQuIEtleWVkXG4gICAgLy8gYnkgVVJMIHNpbmNlIHBhZ2Ugc2hvdHMgYXJlIHBhZ2Utc2NvcGVkLCBub3Qgc2VsZWN0b3Itc2NvcGVkLlxuICAgIGlmIChyZXBseS5mdWxsRGF0YVVybCkge1xuICAgICAgc2hvdHNGdWxsLnNldCgncGFnZTo6JyArIG1zZy5lbnRyeS51cmwsIHJlcGx5LmZ1bGxEYXRhVXJsKTtcbiAgICAgIHBlcnNpc3RTaG90c0Z1bGwoKTtcbiAgICB9XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICB9O1xuXG4gIC8vIEZpbmQgYW55IHNlbGVjdG9yIGVudHJ5IG9uIHRoaXMgVVJMIHRoYXQgYWxyZWFkeSBoYXMgYSBgcGFnZWAgc2hvdFxuICAvLyByZWNvcmRlZCDigJQgdXNlZCBzbyB0aGF0IHJldHJvYWN0aXZlIGNhcHR1cmVzIGluaGVyaXQgdGhlIGV4aXN0aW5nIFBOR1xuICAvLyBwYXRoIGluc3RlYWQgb2YgcmVmaXJpbmcuXG4gIGNvbnN0IGZpbmRFeGlzdGluZ1BhZ2VTaG90ID0gKHVybDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnVybCAhPT0gdXJsKSBjb250aW51ZTtcbiAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/LnBhZ2UpIHJldHVybiBtLmVudHJ5LnNjcmVlbnNob3QucGFnZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgY29uc3Qgb25Ib3ZlciA9ICh7c2VsZWN0b3IsIGxhYmVsLCB0YWcsIHJlY3R9OiBFeHRyYWN0PENzVG9QYW5lbCwge2tpbmQ6ICdob3Zlcid9Pik6IHZvaWQgPT4ge1xuICAgIHNldFN0YXR1cyhgQWx0LWhvdmVyIMK3ICR7bGFiZWx9YCwge2tpbmQ6ICdpbmZvJ30pO1xuICAgIC8vIElkZW50aXR5IGlzIChzZWxlY3RvciwgdXJsKS4gU2FtZSBzZWxlY3RvciBvbiB0d28gZGlmZmVyZW50IFVSTHNcbiAgICAvLyBpcyB0d28gZGlmZmVyZW50IGNhcHR1cmVzOyB0aGUgcHJldmlvdXMgc2VsZWN0b3Itb25seSBsb29rdXBcbiAgICAvLyBjYXVzZWQgY3Jvc3MtcGFnZSBjb21tZW50IGNvbnRhbWluYXRpb24uIFByZWZlciBzYW1lLVVSTCArXG4gICAgLy8gc2FtZS1zZWxlY3RvciBhcyB0aGUgc3Ryb25nZXN0IG1hdGNoLlxuICAgIGNvbnN0IGV4aXN0aW5nID0gZmluZENhcHR1cmVGb3JDdXJyZW50UGFnZShzZWxlY3Rvcik7XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICBpZiAocHJlZnMuYXV0b1Njcm9sbFRvSG92ZXJlZCkgc2Nyb2xsTWVzc2FnZUludG9WaWV3KGV4aXN0aW5nLmlkKTtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIoZXhpc3RpbmcuaWQpO1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ2Fubm90YXRpb24nLCBzZWxlY3RvciwgcGF5bG9hZDoge3VpZDogZXhpc3RpbmcuZW50cnkudWlkLCBuOiBleGlzdGluZy5lbnRyeS5uLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2t9fSk7XG4gICAgICBpZiAocGhhbnRvbVRhcmdldCkgeyBwaGFudG9tVGFyZ2V0ID0gbnVsbDsgcmVuZGVyKCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQUxXQVlTIHNob3cgdGhlIGNvbW1lbnQgYm94LCBldmVuIGZvciB1bmNhcHR1cmVkIGVsZW1lbnRzLiBPbiBzdWJtaXRcbiAgICAgIC8vIHRoZSBjb250ZW50IHNjcmlwdCB3aWxsIGNhcHR1cmUgdGhlIGVsZW1lbnQgZmlyc3QsIHRoZW4gYXR0YWNoIHRoZVxuICAgICAgLy8gY29tbWVudCDigJQgdHVybmluZyBob3Zlci1jb21tZW50IGludG8gYSBjYXB0dXJlK2NvbW1lbnQgc2hvcnRjdXQuXG4gICAgICBwaGFudG9tVGFyZ2V0ID0ge3NlbGVjdG9yLCBsYWJlbCwgdGFnLCByZWN0OiByZWN0IGFzIHVua25vd24gYXMgRE9NUmVjdH07XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbicsIHNlbGVjdG9yLCBwYXlsb2FkOiB7Y2FwdHVyZWQ6IGZhbHNlLCBmZWVkYmFjazogW119fSk7XG4gICAgICByZW5kZXJQaGFudG9tKCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBvbkhvdmVyRW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdGF0dXMudGV4dENvbnRlbnQ/LnN0YXJ0c1dpdGgoJ0FsdC1ob3ZlcicpKSBzdGF0dXMudGV4dENvbnRlbnQgPSAnJztcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgeyBwaGFudG9tVGFyZ2V0ID0gbnVsbDsgcmVuZGVyUGhhbnRvbSgpOyB9XG4gICAgLy8gTm8gYW5ub3RhdGlvbi1jbGVhciBoZXJlIOKAlCB0aGUgY29udGVudCBzY3JpcHQga2VlcHMgdGhlIGJveCBvcGVuIHNvIHRoZVxuICAgIC8vIHVzZXIgY2FuIG1vdXNlIHRvIGl0IGFuZCB0eXBlLiBPdXRzaWRlLWNsaWNrIC8gRXNjIGRpc21pc3MgaXQuXG4gIH07XG5cbiAgY29uc3QgY29sbGVjdEZlZWRiYWNrQWZ0ZXIgPSAoc2VsZWN0b3JJZDogc3RyaW5nKTogc3RyaW5nW10gPT4ge1xuICAgIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmICghZm91bmQpIHsgaWYgKG0uaWQgPT09IHNlbGVjdG9ySWQpIGZvdW5kID0gdHJ1ZTsgY29udGludWU7IH1cbiAgICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicgfHwgbS50eXBlID09PSAncGFnZScpIGJyZWFrO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgb3V0LnB1c2gobS50ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBjb25zdCBjZW50ZXJFbGVtZW50SW5MaXN0ID0gKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGxpc3RSZWN0ID0gbGlzdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBlbFJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0YXJnZXQgPSBsaXN0LnNjcm9sbFRvcCArIGVsUmVjdC50b3AgLSBsaXN0UmVjdC50b3AgLSAobGlzdC5jbGllbnRIZWlnaHQgLyAyKSArIChlbFJlY3QuaGVpZ2h0IC8gMik7XG4gICAgbGlzdC5zY3JvbGxUbyh7dG9wOiBNYXRoLm1heCgwLCB0YXJnZXQpLCBiZWhhdmlvcjogJ3Ntb290aCd9KTtcbiAgfTtcblxuICBjb25zdCBzY3JvbGxNZXNzYWdlSW50b1ZpZXcgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGVsID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIGlmICghZWwpIHJldHVybjtcbiAgICBjZW50ZXJFbGVtZW50SW5MaXN0KGVsKTtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaC1pbnRvLXZpZXcnKTtcbiAgICB2b2lkIGVsLm9mZnNldFdpZHRoO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoLWludG8tdmlldycpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBTdGlja3kgaGlnaGxpZ2h0IG1hbmFnZW1lbnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IHNldExhc3RBY3RpdmUgPSAoc2VsZWN0b3I6IHN0cmluZyB8IG51bGwpOiB2b2lkID0+IHtcbiAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICBjbGVhclRpbWVvdXQoc3RpY2t5VGltZXIpO1xuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICAgIGFybVN0aWNreUV4cGlyeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYXJtU3RpY2t5RXhwaXJ5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7XG4gICAgc3RpY2t5VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXBhbmVsSG92ZXJlZCkge1xuICAgICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnc3RpY2t5LWNsZWFyJ30pO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3Rvci5sYXN0LWFjdGl2ZScpKSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdsYXN0LWFjdGl2ZScpO1xuICAgICAgfSBlbHNlIGFybVN0aWNreUV4cGlyeSgpO1xuICAgIH0sIFNUSUNLWV9UVExfTVMpO1xuICB9O1xuXG4gIC8vIEZhc3Qgc3RpY2t5LWNsZWFyOiB3aGVuIHRoZSB1c2VyJ3MgY3Vyc29yIGxlYXZlcyB0aGUgcGFuZWwsIGZpcmVcbiAgLy8gc3RpY2t5LWNsZWFyIGFmdGVyIGEgMzAwIG1zIGdyYWNlIHdpbmRvdy4gUHJpb3IgYmVoYXZpb3Igd2FpdGVkIHRoZVxuICAvLyBmdWxsIFNUSUNLWV9UVExfTVMgKH41IHMpIHdoaWNoIGZlbHQgbGlrZSB0aGUgcGFnZS1zaWRlIGhpZ2hsaWdodFxuICAvLyBcImRvZXNuJ3QgZ28gYXdheSBldmVuIGFmdGVyIEkgdW5ob3ZlclwiLiAzMDAgbXMgaXMgc2hvcnQgZW5vdWdoIHRvXG4gIC8vIGZlZWwgcmVzcG9uc2l2ZSBidXQgbG9uZyBlbm91Z2ggdGhhdCBhIHF1aWNrIHJlcG9zaXRpb24gKGUuZy5cbiAgLy8gYWNjaWRlbnRhbGx5IGNyb3NzaW5nIHRoZSBzZWFtKSBkb2Vzbid0IGtpbGwgdGhlIHJpbmcgbWlkLWZsaWdodC5cbiAgbGV0IHN0aWNreUNsZWFyR3JhY2UgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgcGFuZWxIb3ZlcmVkID0gdHJ1ZTtcbiAgICBpZiAoc3RpY2t5Q2xlYXJHcmFjZSkgeyBjbGVhclRpbWVvdXQoc3RpY2t5Q2xlYXJHcmFjZSk7IHN0aWNreUNsZWFyR3JhY2UgPSAwOyB9XG4gICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gIH0pO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgcGFuZWxIb3ZlcmVkID0gZmFsc2U7XG4gICAgaWYgKHN0aWNreUNsZWFyR3JhY2UpIGNsZWFyVGltZW91dChzdGlja3lDbGVhckdyYWNlKTtcbiAgICBzdGlja3lDbGVhckdyYWNlID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3N0aWNreS1jbGVhcid9KTtcbiAgICAgIC8vIEFsc28gZHJvcCBvdXIgb3duIGZyb20tcGFuZWwgKyBtdWx0aSByaW5ncyBpbiBjYXNlIHRoZXkgbGVha2VkLlxuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICBzdGlja3lDbGVhckdyYWNlID0gMDtcbiAgICB9LCAzMDApO1xuICB9KTtcbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgIC8vIFdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlaXIgbW91c2UgaW50byB0aGUgcGFuZWwsIHN1cHByZXNzIHBhZ2Utc2lkZVxuICAgIC8vIGFsdC1ob3ZlciBzdGF0ZSBzbyB0aGUgb3JhbmdlIHJpbmcgZG9lc24ndCBrZWVwIGZvbGxvd2luZyB0aGUgY3Vyc29yLlxuICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIFJlbmRlcmluZyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgTkVBUl9CT1RUT01fUFggPSA4MDtcbiAgY29uc3Qgd2FzTmVhckJvdHRvbSA9ICgpOiBib29sZWFuID0+XG4gICAgbGlzdC5zY3JvbGxIZWlnaHQgLSBsaXN0LnNjcm9sbFRvcCAtIGxpc3QuY2xpZW50SGVpZ2h0IDw9IE5FQVJfQk9UVE9NX1BYO1xuXG4gIGNvbnN0IG1hdGNoZXNTZWFyY2ggPSAobTogUGFuZWxNZXNzYWdlKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgcSA9IHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcmV0dXJuIG0udGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHtcbiAgICAgIGNvbnN0IGUgPSBtLmVudHJ5O1xuICAgICAgLy8gTWF0Y2ggYWdhaW5zdCB0aGUgV0hPTEUgZW50cnkgKHNlbGVjdG9yLCB0ZXh0LCBjbGFzc2VzLCBhdHRycyxcbiAgICAgIC8vIG91dGVySFRNTCwgc3R5bGVzLCBldGMuKSBzbyBzZWFyY2ggaGl0cyBhbnl0aGluZyB2aXNpYmxlIGluIHRoZVxuICAgICAgLy8gYm9keS1qc29uLiBTdHJpbmdpZnlpbmcgb25jZSBpcyBmaW5lIOKAlCB0aGUgY29zdCBpcyB0aW55IHZzIHJlbmRlci5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShlKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICAgIH1cbiAgICBpZiAobS50eXBlID09PSAncGFnZScpIHJldHVybiAobS51cmwgKyAnICcgKyAobS50aXRsZSA/PyAnJykpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIC8vIFRydWUgd2hlbiB0aGUgYnViYmxlJ3MgYm9keS1qc29uIChvciBvdXRlckhUTUwpIGNvbnRhaW5zIHRoZSBzZWFyY2gg4oCUXG4gIC8vIHRlbGxzIHJlbmRlclNlbGVjdG9yIHRvIGF1dG8tZXhwYW5kIHNvIHRoZSB1c2VyIHNlZXMgdGhlIGhpZ2hsaWdodGVkIGhpdC5cbiAgY29uc3QgYm9keU1hdGNoZXNTZWFyY2ggPSAobTogU2VsZWN0b3JNZXNzYWdlKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKCFzZWFyY2hRdWVyeSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHEgPSBzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtLmVudHJ5KS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpO1xuICB9O1xuXG4gIGNvbnN0IGluc2VydFJhaWwgPSAoYmVmb3JlSWQ6IHN0cmluZyk6IEhUTUxEaXZFbGVtZW50ID0+IHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NOYW1lID0gJ2luc2VydC1yYWlsJztcbiAgICBkaXYuZGF0YXNldC5iZWZvcmVJZCA9IGJlZm9yZUlkO1xuICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCA9PT0gYmVmb3JlSWQpIHtcbiAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcpO1xuICAgICAgZGl2LmFwcGVuZChidWlsZElubGluZUNvbW1lbnQoe1xuICAgICAgICBvbkNhbmNlbDogKCkgPT4geyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7IHJlbmRlcigpOyB9LFxuICAgICAgICBvblN1Ym1pdDogKHRleHQpID0+IHNlbmRJbmxpbmUodGV4dCksXG4gICAgICAgIGF1dG9mb2N1czogdHJ1ZSxcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBidG4udHlwZSA9ICdidXR0b24nO1xuICAgICAgYnRuLmNsYXNzTmFtZSA9ICdhZGQtYnRuJztcbiAgICAgIGJ0bi5kYXRhc2V0LnRpcCA9ICdJbnNlcnQgY2FwdHVyZSBvciBjb21tZW50IGhlcmUnO1xuICAgICAgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdJbnNlcnQgY2FwdHVyZSBvciBjb21tZW50IGhlcmUnKTtcbiAgICAgIGJ0bi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3BsdXMnLCAxMik7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGluc2VydEJlZm9yZS5jdXJyZW50ID0gYmVmb3JlSWQ7IGluc2VydEJlZm9yZS5jb21tZW50ID0gdHJ1ZTsgcmVuZGVyKCk7IH0pO1xuICAgICAgZGl2LmFwcGVuZChidG4pO1xuICAgIH1cbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIHR5cGUgSW5saW5lQ29tbWVudE9wdHMgPSB7XG4gICAgaW5pdGlhbD86IHN0cmluZztcbiAgICBvbkNhbmNlbD86ICgpID0+IHZvaWQ7XG4gICAgb25TdWJtaXQ/OiAodGV4dDogc3RyaW5nKSA9PiB2b2lkO1xuICAgIGF1dG9mb2N1cz86IGJvb2xlYW47XG4gIH07XG4gIGNvbnN0IGJ1aWxkSW5saW5lQ29tbWVudCA9ICh7aW5pdGlhbCA9ICcnLCBvbkNhbmNlbCwgb25TdWJtaXQsIGF1dG9mb2N1c306IElubGluZUNvbW1lbnRPcHRzKTogSFRNTERpdkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLmNsYXNzTmFtZSA9ICdpbmxpbmUtY29tbWVudCc7XG4gICAgY29uc3QgdGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIHRhLnZhbHVlID0gaW5pdGlhbDtcbiAgICB0YS5yb3dzID0gMjtcbiAgICB0YS5wbGFjZWhvbGRlciA9ICdJbnNlcnQgYSBjb21tZW50IGhlcmUsIG9yIEFsdCtDbGljayB0byBpbnNlcnQgYSBjYXB0dXJlJztcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3Jvdyc7XG4gICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBtZXRhLmNsYXNzTmFtZSA9ICdtZXRhJztcbiAgICBtZXRhLnRleHRDb250ZW50ID0gJzB3IMK3IDB0JztcbiAgICAvLyBCb3RoIFNhdmUgLyBDYW5jZWwgYXJlIHVuaWZvcm0gaWNvbiBidXR0b25zICguaWNvbmJ0bikuIFNhdmUgdXNlcyB0aGVcbiAgICAvLyBwcmltYXJ5IGFjY2VudCB2YXJpYW50IHZpYSAucHJpbWFyeSBzbyBpdCBzdGlsbCBwb3BzLCBidXQgaXRzIHdpZHRoXG4gICAgLy8gbWF0Y2hlcyBDYW5jZWwgZXhhY3RseS5cbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0bic7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCDCtyBFc2MnO1xuICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ2FuY2VsIGlubGluZSBjb21tZW50Jyk7XG4gICAgY2FuY2VsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDIwKTtcbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvbkNhbmNlbD8uKCkpO1xuICAgIGNvbnN0IHNlbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzZW5kLnR5cGUgPSAnYnV0dG9uJztcbiAgICBzZW5kLmNsYXNzTmFtZSA9ICdpY29uYnRuIHByaW1hcnknO1xuICAgIHNlbmQuZGF0YXNldC50aXAgPSAnU2F2ZSDCtyBFbnRlcic7XG4gICAgc2VuZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnU2F2ZSBpbmxpbmUgY29tbWVudCcpO1xuICAgIHNlbmQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGVjaycsIDIwKTtcbiAgICBjb25zdCBzdWJtaXQgPSAoKTogdm9pZCA9PiBvblN1Ym1pdD8uKHRhLnZhbHVlKTtcbiAgICBzZW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3VibWl0KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHsgbWV0YS50ZXh0Q29udGVudCA9IGAke3dvcmRDb3VudCh0YS52YWx1ZSl9dyDCtyAke3Rva2VuQ291bnQodGEudmFsdWUpfXRgOyB9KTtcbiAgICB0YS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSByZXR1cm47XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzdWJtaXQoKTsgfVxuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgb25DYW5jZWw/LigpO1xuICAgIH0pO1xuICAgIHJvdy5hcHBlbmQobWV0YSwgY2FuY2VsLCBzZW5kKTtcbiAgICB3cmFwLmFwcGVuZCh0YSwgcm93KTtcbiAgICBpZiAoYXV0b2ZvY3VzKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGEuZm9jdXMoKSk7XG4gICAgcmV0dXJuIHdyYXA7XG4gIH07XG5cbiAgY29uc3Qgc2VuZElubGluZSA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB0ZXh0ID0gKHRleHQgPz8gJycpLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHsgaW5zZXJ0QmVmb3JlLmN1cnJlbnQgPSBudWxsOyByZW5kZXIoKTsgcmV0dXJuOyB9XG4gICAgc25hcHNob3QoKTtcbiAgICBjb25zdCBiZWZvcmVJZCA9IGluc2VydEJlZm9yZS5jdXJyZW50O1xuICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICBpbnNlcnRCZWZvcmUuY29tbWVudCA9IGZhbHNlO1xuICAgIGxldCBwb3MgPSBiZWZvcmVJZCA/IG1lc3NhZ2VzLmZpbmRJbmRleCgobSkgPT4gbS5pZCA9PT0gYmVmb3JlSWQpIDogbWVzc2FnZXMubGVuZ3RoO1xuICAgIGlmIChwb3MgPCAwKSBwb3MgPSBtZXNzYWdlcy5sZW5ndGg7XG4gICAgLy8gcGFyZW50VWlkIHJlc29sdXRpb246IHdhbGsgYmFjayBmcm9tIHRoZSBpbnNlcnQgcG9zaXRpb24gdG8gdGhlXG4gICAgLy8gbmVhcmVzdCBwcmVjZWRpbmcgc2VsZWN0b3IuIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIHRoZSBGSy5cbiAgICBsZXQgcElkeCA9IHBvcyAtIDE7XG4gICAgd2hpbGUgKHBJZHggPj0gMCAmJiBtZXNzYWdlc1twSWR4XT8udHlwZSA9PT0gJ2ZlZWRiYWNrJykgcElkeC0tO1xuICAgIGNvbnN0IHBhcmVudCA9IHBJZHggPj0gMCA/IG1lc3NhZ2VzW3BJZHhdIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcmVudFVpZCA9IHBhcmVudCAmJiBwYXJlbnQudHlwZSA9PT0gJ3NlbGVjdG9yJyA/IHBhcmVudC5lbnRyeS51aWQgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgLi4uKHBhcmVudFVpZCA/IHtwYXJlbnRVaWR9IDoge30pLFxuICAgIH07XG4gICAgbWVzc2FnZXMuc3BsaWNlKHBvcywgMCwgZmIpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ0luc2VydGVkJyk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUGhhbnRvbSA9ICgpOiB2b2lkID0+IHtcbiAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoJy5waGFudG9tJyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGhhbnRvbVRhcmdldCkgcmV0dXJuO1xuICAgIGNvbnN0IHBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGguY2xhc3NOYW1lID0gJ3BoYW50b20gdmlzaWJsZSc7XG4gICAgcGguaW5uZXJIVE1MID0gYDxjb2RlPiR7ZXNjYXBlSHRtbChwaGFudG9tVGFyZ2V0LmxhYmVsKX08L2NvZGU+YDtcbiAgICBsaXN0LmFwcGVuZChwaCk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgbGlzdC5zY3JvbGxUb3AgPSBsaXN0LnNjcm9sbEhlaWdodDsgfSk7XG4gIH07XG5cbiAgLy8gUmVvcmRlciBhIGZsYXQgbWVzc2FnZSBsaXN0IHNvIHNlbGVjdG9ycyB3aXRoaW4gZWFjaCBwYWdlLWRlbGltaXRlZFxuICAvLyBibG9jayBhcmUgc29ydGVkIGJ5IHRoZWlyIHZpc3VhbCByZWN0ICh0b3DihpJib3R0b20sIGxlZnTihpJyaWdodCkuXG4gIC8vIEZlZWRiYWNrIHJvd3Mgc3RheSBhdHRhY2hlZCB0byB0aGVpciBwcmVjZWRpbmcgc2VsZWN0b3IgKGNhcHR1cmVcbiAgLy8gYWRqYWNlbmN5KSBzbyBlZGl0aW5nL3RocmVhZGluZyBiZWhhdmlvciBzdXJ2aXZlcyB0aGUgc29ydC5cbiAgLy9cbiAgLy8gVXNlZCBPTkxZIGJ5IHRoZSBleHBvcnQgcGlwZWxpbmUgKGBidWlsZFNsaW1gKSwgbm90IHRoZSBzaWRlYmFyXG4gIC8vIHJlbmRlci4gVGhlIHNpZGViYXIga2VlcHMgbWVzc2FnZXMgaW4gaW5zZXJ0aW9uL2NhcHR1cmUgb3JkZXIgc29cbiAgLy8gdGhlIHVzZXIgc2VlcyB0aGVtIHdoZXJlIHRoZXkgZXhwZWN0OyB0aGUgZXhwb3J0IGdldHMgdGhlIGFnZW50LVxuICAvLyBmcmllbmRseSByZWFkaW5nLW9yZGVyIHRyZWF0bWVudC5cbiAgY29uc3QgcmVvcmRlckZvckV4cG9ydCA9IChtc2dzOiBQYW5lbE1lc3NhZ2VbXSk6IFBhbmVsTWVzc2FnZVtdID0+IHtcbiAgICB0eXBlIEdyb3VwID0ge2tpbmQ6ICdncm91cCc7IHNlbDogU2VsZWN0b3JNZXNzYWdlOyB0cmFpbGluZzogRmVlZGJhY2tNZXNzYWdlW119O1xuICAgIHR5cGUgTG9vc2UgPSB7a2luZDogJ2xvb3NlJzsgbTogRmVlZGJhY2tNZXNzYWdlfTtcbiAgICB0eXBlIFNsb3QgPSBHcm91cCB8IExvb3NlIHwge2tpbmQ6ICdwYWdlJzsgbTogUGFnZU1lc3NhZ2V9O1xuICAgIGNvbnN0IHNsb3RzOiBTbG90W10gPSBbXTtcbiAgICBsZXQgY3VyR3JvdXA6IEdyb3VwIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgZmx1c2hHcm91cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmIChjdXJHcm91cCkgeyBzbG90cy5wdXNoKGN1ckdyb3VwKTsgY3VyR3JvdXAgPSBudWxsOyB9XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbXNncykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSB7XG4gICAgICAgIGZsdXNoR3JvdXAoKTtcbiAgICAgICAgc2xvdHMucHVzaCh7a2luZDogJ3BhZ2UnLCBtfSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICBmbHVzaEdyb3VwKCk7XG4gICAgICAgIGN1ckdyb3VwID0ge2tpbmQ6ICdncm91cCcsIHNlbDogbSwgdHJhaWxpbmc6IFtdfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERldGFjaGVkIGNvbW1lbnRzIG5ldmVyIHRyYXZlbCB3aXRoIHRoZSBwcmVjZWRpbmcgc2VsZWN0b3Inc1xuICAgICAgICAvLyBncm91cCDigJQgdGhleSBzdGF5IGxvb3NlIGluIGV4cG9ydCBvcmRlci5cbiAgICAgICAgaWYgKGN1ckdyb3VwICYmICFtLmRldGFjaGVkKSBjdXJHcm91cC50cmFpbGluZy5wdXNoKG0pO1xuICAgICAgICBlbHNlIHNsb3RzLnB1c2goe2tpbmQ6ICdsb29zZScsIG19KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2hHcm91cCgpO1xuICAgIGNvbnN0IG91dDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBsZXQgcnVuU3RhcnQgPSAwO1xuICAgIGNvbnN0IGZsdXNoUnVuID0gKGVuZDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXBSZWN0czogQXJyYXk8e2lkeDogbnVtYmVyOyB5OiBudW1iZXI7IHg6IG51bWJlcn0+ID0gW107XG4gICAgICBmb3IgKGxldCBpID0gcnVuU3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgciA9IHMuc2VsLmVudHJ5LnJlY3Q7XG4gICAgICAgICAgZ3JvdXBSZWN0cy5wdXNoKHtpZHg6IGksIHk6IHI/LnkgPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCB4OiByPy54ID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWX0pO1xuICAgICAgICB9XG4gICAgICAgIGluZGljZXMucHVzaChpKTtcbiAgICAgIH1cbiAgICAgIGdyb3VwUmVjdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS55ICE9PSBiLnkpIHJldHVybiBhLnkgLSBiLnk7XG4gICAgICAgIHJldHVybiBhLnggLSBiLng7XG4gICAgICB9KTtcbiAgICAgIGxldCBnaSA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGkgb2YgaW5kaWNlcykge1xuICAgICAgICBjb25zdCBzID0gc2xvdHNbaV0hO1xuICAgICAgICBpZiAocy5raW5kID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRJZHggPSBncm91cFJlY3RzW2dpKytdIS5pZHg7XG4gICAgICAgICAgY29uc3QgciA9IHNsb3RzW3JlcGxhY2VtZW50SWR4XSEgYXMgR3JvdXA7XG4gICAgICAgICAgb3V0LnB1c2goci5zZWwpO1xuICAgICAgICAgIGZvciAoY29uc3QgZiBvZiByLnRyYWlsaW5nKSBvdXQucHVzaChmKTtcbiAgICAgICAgfSBlbHNlIGlmIChzLmtpbmQgPT09ICdsb29zZScpIHtcbiAgICAgICAgICBvdXQucHVzaChzLm0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2xvdHNbaV0hLmtpbmQgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaFJ1bihpKTtcbiAgICAgICAgb3V0LnB1c2goKHNsb3RzW2ldIGFzIHtraW5kOiAncGFnZSc7IG06IFBhZ2VNZXNzYWdlfSkubSk7XG4gICAgICAgIHJ1blN0YXJ0ID0gaSArIDE7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoUnVuKHNsb3RzLmxlbmd0aCk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBjb25zdCByZW5kZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc3RpY2tUb0JvdHRvbSA9IGxpc3QuY2hpbGRyZW4ubGVuZ3RoID09PSAwIHx8IHdhc05lYXJCb3R0b20oKTtcbiAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgLy8gU3RhdHMgbnVtYmVyc1xuICAgIGxldCB0b3RhbFNlbGVjdG9ycyA9IDA7XG4gICAgbGV0IHRvdGFsQ29tbWVudHMgPSAwO1xuICAgIGxldCB0b3RhbFN0YWxlID0gMDtcbiAgICBjb25zdCBkaXN0aW5jdFBhZ2VzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgIHRvdGFsU2VsZWN0b3JzKys7XG4gICAgICAgIGlmIChzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKSA9PT0gZmFsc2UpIHRvdGFsU3RhbGUrKztcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSAnZmVlZGJhY2snKSB0b3RhbENvbW1lbnRzKys7XG4gICAgICBlbHNlIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBpZiAobWVzc2FnZXMuc29tZSgoeCkgPT4geC50eXBlID09PSAnc2VsZWN0b3InICYmIHguZW50cnkudXJsID09PSBtLnVybCkpIGRpc3RpbmN0UGFnZXMuYWRkKG0udXJsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhdHNFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtc3RhdD1cInNlbGVjdG9yc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxTZWxlY3RvcnMpO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJjb21tZW50c1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcodG90YWxDb21tZW50cyk7XG4gICAgY29uc3Qgc3RhbGVOdW0gPSBzdGF0c0VsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1zdGF0PVwic3RhbGVcIl0gLnN0YXQtbnVtJykhO1xuICAgIHN0YWxlTnVtLnRleHRDb250ZW50ID0gU3RyaW5nKHRvdGFsU3RhbGUpO1xuICAgIHN0YWxlTnVtLmRhdGFzZXQuemVybyA9IHRvdGFsU3RhbGUgPT09IDAgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIHN0YXRzRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXN0YXQ9XCJwYWdlc1wiXSAuc3RhdC1udW0nKSEudGV4dENvbnRlbnQgPSBTdHJpbmcoZGlzdGluY3RQYWdlcy5zaXplKTtcbiAgICBjb25zdCBleHBvcnRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIHN0YXRUb2tlbnMudGV4dENvbnRlbnQgPSBleHBvcnRUZXh0ID8gU3RyaW5nKHRva2VuQ291bnQoZXhwb3J0VGV4dCkpIDogJzAnO1xuICAgIHN0YXRXb3Jkcy50ZXh0Q29udGVudCA9IGV4cG9ydFRleHQgPyBTdHJpbmcod29yZENvdW50KGV4cG9ydFRleHQpKSA6ICcwJztcblxuICAgIC8vIE1pbmlmeSByZWR1Y3Rpb24gc3RhdHNcbiAgICBsZXQgZnVsbFQgPSAwLCBjdXJUID0gMCwgZnVsbFcgPSAwLCBjdXJXID0gMCwgcGN0ID0gMDtcbiAgICBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgY29uc3Qgd2FzTWluID0gcHJlZnMubWluaWZ5O1xuICAgICAgcHJlZnMubWluaWZ5ID0gdHJ1ZTsgY29uc3QgbWluVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IGZhbHNlOyBjb25zdCBmdWxsVGV4dCA9IGJ1aWxkSnNvbmwoKTtcbiAgICAgIHByZWZzLm1pbmlmeSA9IHdhc01pbjtcbiAgICAgIGZ1bGxUID0gdG9rZW5Db3VudChmdWxsVGV4dCk7IGN1clQgPSB0b2tlbkNvdW50KG1pblRleHQpO1xuICAgICAgZnVsbFcgPSB3b3JkQ291bnQoZnVsbFRleHQpOyBjdXJXID0gd29yZENvdW50KG1pblRleHQpO1xuICAgICAgcGN0ID0gZnVsbFQgPiAwID8gTWF0aC5yb3VuZCgoMSAtIGN1clQgLyBmdWxsVCkgKiAxMDApIDogMDtcbiAgICB9XG4gICAgY29uc3QgbWluaWZ5U3RhdHNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1taW5pZnktc3RhdHNdJyk7XG4gICAgaWYgKG1pbmlmeVN0YXRzRWwpIHtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYCR7ZnVsbFQudG9Mb2NhbGVTdHJpbmcoKX0g4oaSICR7Y3VyVC50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtmdWxsVy50b0xvY2FsZVN0cmluZygpfSDihpIgJHtjdXJXLnRvTG9jYWxlU3RyaW5nKCl9IHdvcmRzIMK3ICR7cGN0fSUgcmVkdWN0aW9uYDtcbiAgICAgIH0gZWxzZSBpZiAoZXhwb3J0VGV4dCkge1xuICAgICAgICBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gYFdvdWxkIHNhdmUgJHsoZnVsbFQgLSBjdXJUKS50b0xvY2FsZVN0cmluZygpfSB0b2tlbnMgwrcgJHtwY3R9JSBpZiBlbmFibGVkYDtcbiAgICAgIH0gZWxzZSBtaW5pZnlTdGF0c0VsLnRleHRDb250ZW50ID0gJyc7XG4gICAgfVxuXG4gICAgLy8gUGVyLWNoZWNrYm94IGNvbnRyaWJ1dGlvbiBzdGF0czogaG93IG1hbnkgdG9rZW5zL3dvcmRzIGVhY2ggdG9nZ2xlXG4gICAgLy8gYWRkcyB0byB0aGUgY3VycmVudCBleHBvcnQuIENvbXB1dGVkIGJ5IHRvZ2dsaW5nIHRoYXQgc2luZ2xlIHByZWZcbiAgICAvLyBhbmQgZGlmZmluZyB0aGUgZXhwb3J0IOKAlCBnaXZlcyBhbiBob25lc3QgYW5zd2VyIHRoYXQgcmVmbGVjdHMgdGhlXG4gICAgLy8gY3VycmVudCBtaW5pZnkgc3RhdGUgYW5kIHRoZSByZXN0IG9mIHRoZSB0b2dnbGVzLlxuICAgIGNvbnN0IGNvbnRyaWJLZXlzOiBBcnJheTxrZXlvZiBQcmVmcz4gPSBbJ2luY2x1ZGVPdXRlckhUTUwnLCAnaW5jbHVkZU1hdGNoZWRSdWxlcycsICdpbmNsdWRlU3R5bGVzJ107XG4gICAgaWYgKGV4cG9ydFRleHQgJiYgbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBiYXNlVCA9IHRva2VuQ291bnQoZXhwb3J0VGV4dCk7XG4gICAgICBjb25zdCBiYXNlVyA9IHdvcmRDb3VudChleHBvcnRUZXh0KTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKCFlbCkgY29udGludWU7XG4gICAgICAgIGNvbnN0IHdhc09uID0gcHJlZnNba2V5XSBhcyBib29sZWFuO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gIXdhc09uO1xuICAgICAgICBjb25zdCBhbHRUZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgICAgICAocHJlZnMgYXMgYW55KVtrZXldID0gd2FzT247XG4gICAgICAgIGNvbnN0IGFsdFQgPSB0b2tlbkNvdW50KGFsdFRleHQpO1xuICAgICAgICBjb25zdCBhbHRXID0gd29yZENvdW50KGFsdFRleHQpO1xuICAgICAgICAvLyB3YXNPbj10cnVlIOKGkiBjdXJyZW50bHkgaW5jbHVkZWQ7IGNvc3QgPSBiYXNlIC0gYWx0ICh0dXJuaW5nIE9GRiBzYXZlcyB0aGlzKS5cbiAgICAgICAgLy8gd2FzT249ZmFsc2Ug4oaSIGN1cnJlbnRseSBleGNsdWRlZDsgZ2FpbiA9IGFsdCAtIGJhc2UgKHR1cm5pbmcgT04gYWRkcyB0aGlzKS5cbiAgICAgICAgY29uc3QgZFQgPSB3YXNPbiA/IGJhc2VUIC0gYWx0VCA6IGFsdFQgLSBiYXNlVDtcbiAgICAgICAgY29uc3QgZFcgPSB3YXNPbiA/IGJhc2VXIC0gYWx0VyA6IGFsdFcgLSBiYXNlVztcbiAgICAgICAgY29uc3Qgc2lnbiA9IHdhc09uID8gJycgOiAnKyc7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gd2FzT25cbiAgICAgICAgICA/IGDCtyAke2RULnRvTG9jYWxlU3RyaW5nKCl9IHQgwrcgJHtkVy50b0xvY2FsZVN0cmluZygpfSB3IGluIGV4cG9ydCR7cHJlZnMubWluaWZ5ID8gJyAobWluaWZpZWQpJyA6ICcnfWBcbiAgICAgICAgICA6IGDCtyAke3NpZ259JHtkVC50b0xvY2FsZVN0cmluZygpfSB0IMK3ICR7c2lnbn0ke2RXLnRvTG9jYWxlU3RyaW5nKCl9IHcgaWYgZW5hYmxlZGA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbnRyaWJLZXlzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWNvbnRyaWI9XCIke2tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsKSBlbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRvb2xiYXIgZXhwb3J0IHN0YXRzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy5zdGF0LmV4cG9ydC1zdGF0cycpLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICAgIGNvbnN0IG51bSA9IHMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5zdGF0LW51bScpO1xuICAgICAgY29uc3QgbGFiID0gcy5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnN0YXQtbGFiZWwnKTtcbiAgICAgIGlmIChudW0pIG51bS50ZXh0Q29udGVudCA9IG51bS50ZXh0Q29udGVudCEucmVwbGFjZSgvXFwqJC8sICcnKTtcbiAgICAgIGlmIChsYWIpIGxhYi50ZXh0Q29udGVudCA9IGxhYi50ZXh0Q29udGVudCEucmVwbGFjZSgvXlxcKi8sICcnKTtcbiAgICAgIGlmIChwcmVmcy5taW5pZnkgJiYgbnVtKSBudW0udGV4dENvbnRlbnQgPSBudW0udGV4dENvbnRlbnQgKyAnKic7XG4gICAgICBjb25zdCBpc1Rva2VuID0gaSA9PT0gMDtcbiAgICAgIGNvbnN0IGZ1bGxWID0gaXNUb2tlbiA/IGZ1bGxUIDogZnVsbFc7XG4gICAgICBjb25zdCBjdXJWID0gaXNUb2tlbiA/IGN1clQgOiBjdXJXO1xuICAgICAgY29uc3Qgd2hpY2ggPSBpc1Rva2VuID8gJ3Rva2VucycgOiAnd29yZHMnO1xuICAgICAgcy5kYXRhc2V0LnRpcCA9IHByZWZzLm1pbmlmeVxuICAgICAgICA/IGBNSU5JRklFRCDCtyAke2N1clYudG9Mb2NhbGVTdHJpbmcoKX0gJHt3aGljaH1cXG5GdWxsIHdvdWxkIGJlICR7ZnVsbFYudG9Mb2NhbGVTdHJpbmcoKX0gwrcgc2F2ZXMgJHtwY3R9JWBcbiAgICAgICAgOiBgJHtmdWxsVi50b0xvY2FsZVN0cmluZygpfSAke3doaWNofSDCtyBmdWxsIGV4cG9ydFxcbk1pbmlmaWVkIHdvdWxkIGJlICR7Y3VyVi50b0xvY2FsZVN0cmluZygpfSDCtyBzYXZlcyAke3BjdH0lYDtcbiAgICB9KTtcblxuICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJlbXB0eS1pY29uXCI+8J+kjzwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktdGl0bGVcIj5TdGFydCB3aXRoIHRoZSBwYWdlIHlvdSB3YW50IHRvIGNyaXRpcXVlLjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktYm9keVwiPk9wZW4gYSBwYWdlLCB0aGVuIGNhcHR1cmUgYW4gZWxlbWVudC4gQ29tbWVudHMgc3RheSBwYWlyZWQgd2l0aCB0aGUgdGhpbmcgeW91IGdyYWJiZWQuPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1rZXlzXCI+QWx0K0NsaWNrIHRvIGNhcHR1cmU8L2Rpdj5gO1xuICAgICAgbGlzdC5hcHBlbmQoZW1wdHkpO1xuICAgICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RvclVybHMgPSBuZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnVybCkpO1xuICAgIGNvbnN0IHZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlICE9PSAncGFnZScgfHwgc2VsZWN0b3JVcmxzLmhhcyhtLnVybCkpO1xuICAgIGNvbnN0IHBpbm5lZCA9IHZpc2libGVNZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicgJiYgQm9vbGVhbihtLnBpbm5lZCkpO1xuICAgIGNvbnN0IHVucGlubmVkID0gdmlzaWJsZU1lc3NhZ2VzLmZpbHRlcigobSkgPT4gIXBpbm5lZC5pbmNsdWRlcyhtIGFzIFNlbGVjdG9yTWVzc2FnZSkpO1xuICAgIC8vIFNpZGViYXIgc2hvd3MgY2FwdHVyZXMgaW4gSU5TRVJUSU9OIG9yZGVyIChtb3N0IHJlY2VudCBhdCB0aGVcbiAgICAvLyBib3R0b20pLiBWaXN1YWwtcG9zaXRpb24gcmVvcmRlcmluZyBoYXBwZW5zIE9OTFkgYXQgZXhwb3J0IHRpbWVcbiAgICAvLyBzbyB0aGUgc2lkZWJhciBzdGF5cyBwcmVkaWN0YWJsZSB3aGlsZSB0aGUgYWdlbnQtZmFjaW5nIGV4cG9ydFxuICAgIC8vIGdldHMgcmVhZGluZy1vcmRlciBjb252ZW5pZW5jZS4gKFByaW9yIGltcGxlbWVudGF0aW9uIHNvcnRlZCBpblxuICAgIC8vIGJvdGggcGxhY2VzOyB1c2VyIGZlZWRiYWNrIHdhcyB0aGF0IHNpZGViYXIgc2h1ZmZsaW5nIHdhc1xuICAgIC8vIGRpc29yaWVudGluZy4pXG4gICAgY29uc3Qgb3JkZXJlZCA9IFsuLi5waW5uZWQsIC4uLnVucGlubmVkXTtcblxuICAgIGxpc3QuYXBwZW5kKGluc2VydFJhaWwobWVzc2FnZXNbMF0hLmlkKSk7XG4gICAgbGV0IGxhc3RTZWxlY3RvclNlbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gVHJhY2sgdGhlIFVSTCBvZiB0aGUgbW9zdCByZWNlbnRseSByZW5kZXJlZCBwYWdlIGRpdmlkZXIgc28gd2UgY2FuXG4gICAgLy8gc3VwcHJlc3MgYSByZXBlYXRlZCBoZWFkZXIgd2hlbiBjb25zZWN1dGl2ZSBjYXB0dXJlcyBzaGFyZSB0aGUgc2FtZVxuICAgIC8vIHBhZ2UuIFJlc3RhdGluZyB0aGUgVVJMIGFib3ZlIGV2ZXJ5IGNhcHR1cmUgaW4gYSBzYW1lLVVSTCBydW4gaXNcbiAgICAvLyBub2lzZSDigJQgdGhlIGRpdmlkZXIgb25seSBlYXJucyBpdHMgc3BhY2Ugd2hlbiB0aGUgVVJMIGFjdHVhbGx5XG4gICAgLy8gY2hhbmdlcyBmcm9tIHRoZSBwcmV2aW91cyBjYXB0dXJlIGluIHNlcXVlbmNlLlxuICAgIGxldCBsYXN0UmVuZGVyZWRQYWdlVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmVuZGVyZWRBbnkgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZGVyZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSBvcmRlcmVkW2ldITtcbiAgICAgIGlmICghbWF0Y2hlc1NlYXJjaChtKSkgY29udGludWU7XG4gICAgICAvLyBDb2xsYXBzZSBjb25zZWN1dGl2ZSBzYW1lLVVSTCBwYWdlIGRpdmlkZXJzIGludG8gdGhlIGZpcnN0IG9uZS5cbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBpZiAobS51cmwgPT09IGxhc3RSZW5kZXJlZFBhZ2VVcmwpIGNvbnRpbnVlO1xuICAgICAgICBsYXN0UmVuZGVyZWRQYWdlVXJsID0gbS51cmw7XG4gICAgICB9XG4gICAgICAvLyBEZXRhY2hlZCBjb21tZW50cyByZW5kZXIgdW50aHJlYWRlZCDigJQgYWRqYWNlbmN5IG11c3Qgbm90IHJlLWFkb3B0XG4gICAgICAvLyBhIGNvbW1lbnQgdGhlIHVzZXIgZXhwbGljaXRseSBkaXNhc3NvY2lhdGVkLlxuICAgICAgY29uc3QgYWRqYWNlbmN5ID0gbS50eXBlID09PSAnZmVlZGJhY2snICYmIG0uZGV0YWNoZWQgPyBudWxsIDogbGFzdFNlbGVjdG9yU2VsO1xuICAgICAgY29uc3Qgbm9kZSA9IHJlbmRlck1lc3NhZ2UobSwgYWRqYWNlbmN5KTtcbiAgICAgIGxpc3QuYXBwZW5kKG5vZGUpO1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgbGFzdFNlbGVjdG9yU2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGlmIChpIDwgb3JkZXJlZC5sZW5ndGggLSAxKSBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKG9yZGVyZWRbaSArIDFdIS5pZCkpO1xuICAgICAgcmVuZGVyZWRBbnkgPSB0cnVlO1xuICAgIH1cbiAgICBsaXN0LmFwcGVuZChpbnNlcnRSYWlsKCdfX2VuZF9fJykpO1xuICAgIGlmICghcmVuZGVyZWRBbnkgJiYgc2VhcmNoUXVlcnkpIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbXB0eS5jbGFzc05hbWUgPSAnZW1wdHknO1xuICAgICAgZW1wdHkudGV4dENvbnRlbnQgPSBgTm8gbWF0Y2hlcyBmb3IgXCIke3NlYXJjaFF1ZXJ5fVwiLmA7XG4gICAgICBsaXN0LmFwcGVuZChlbXB0eSk7XG4gICAgfVxuXG4gICAgaWYgKHBlbmRpbmdNdWx0aS5sZW5ndGgpIHJlbmRlclBlbmRpbmdCYXkoKTtcbiAgICBpZiAocGhhbnRvbVRhcmdldCkgcmVuZGVyUGhhbnRvbSgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhd05vb2RsZXMpO1xuICAgIGlmIChzdGlja1RvQm90dG9tKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4geyBsaXN0LnNjcm9sbFRvcCA9IGxpc3Quc2Nyb2xsSGVpZ2h0OyB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQZW5kaW5nQmF5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGxpc3QucXVlcnlTZWxlY3RvcignLnBlbmRpbmctYmF5Jyk/LnJlbW92ZSgpO1xuICAgIGlmICghcGVuZGluZ011bHRpLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGJheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJheS5jbGFzc05hbWUgPSAncGVuZGluZy1iYXknO1xuICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZWFkLmNsYXNzTmFtZSA9ICdwZW5kaW5nLWhlYWQnO1xuICAgIGhlYWQudGV4dENvbnRlbnQgPSBgUGVuZGluZyBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9IGVsZW1lbnQke3BlbmRpbmdNdWx0aS5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ31gO1xuICAgIGJheS5hcHBlbmQoaGVhZCk7XG4gICAgcGVuZGluZ011bHRpLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNhcmQuY2xhc3NOYW1lID0gJ3BlbmRpbmctY2FyZCc7XG4gICAgICBjb25zdCBzZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgICBzZXEudGV4dENvbnRlbnQgPSBgIyR7aSArIDF9YDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSAoZS50ZXh0ICYmIGUudGV4dC5sZW5ndGggPD0gNjAgPyBlLnRleHQgOiAoZS5jb21wb25lbnRSb290ID8/IGUuc2VsZWN0b3IgPz8gZS50YWcpKTtcbiAgICAgIGNhcmQuYXBwZW5kKHNlcSwgbGFiZWwpO1xuICAgICAgYmF5LmFwcGVuZChjYXJkKTtcbiAgICB9KTtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByb3cuY2xhc3NOYW1lID0gJ3BlbmRpbmctcm93JztcbiAgICBjb25zdCBjb21taXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb21taXQudHlwZSA9ICdidXR0b24nO1xuICAgIGNvbW1pdC5jbGFzc05hbWUgPSAncHJpbWFyeSBwZW5kaW5nLWNvbW1pdCc7XG4gICAgY29tbWl0LnRleHRDb250ZW50ID0gYENvbW1pdCBncm91cCDCtyAke3BlbmRpbmdNdWx0aS5sZW5ndGh9YDtcbiAgICBjb21taXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY29tbWl0J30pKTtcbiAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWwudHlwZSA9ICdidXR0b24nO1xuICAgIGNhbmNlbC5jbGFzc05hbWUgPSAnaWNvbmJ0biBwZW5kaW5nLWNhbmNlbCc7XG4gICAgY2FuY2VsLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJztcbiAgICBjYW5jZWwuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBwZW5kaW5nIGdyb3VwJyk7XG4gICAgY2FuY2VsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDEzKTtcbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZW5kVG9DUyh7a2luZDogJ3BlbmRpbmctY2FuY2VsJ30pKTtcbiAgICByb3cuYXBwZW5kKGNvbW1pdCwgY2FuY2VsKTtcbiAgICBiYXkuYXBwZW5kKHJvdyk7XG4gICAgY29uc3QgaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhpbnQuY2xhc3NOYW1lID0gJ3BlbmRpbmctaGludCc7XG4gICAgaGludC50ZXh0Q29udGVudCA9ICdBbHQrU2hpZnQrQ2xpY2sgbW9yZSDCtyBDb21taXQgdG8gZmluYWxpemUgwrcgRXNjIHRvIGNhbmNlbCc7XG4gICAgYmF5LmFwcGVuZChoaW50KTtcbiAgICBsaXN0LmFwcGVuZChiYXkpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBOb29kbGVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBjbGVhck5vb2RsZXMgPSAoKTogdm9pZCA9PiB7IGZvciAoY29uc3QgbiBvZiBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmVlLW5vb2RsZScpKSBuLnJlbW92ZSgpOyB9O1xuXG4gIC8vIENyb3NzLXNlYW0gcGFuZWzihpRjYW52YXMgbm9vZGxlcyB3ZXJlIHJlbW92ZWQ6IGFsaWduaW5nIHR3byBTVkcgaGFsdmVzXG4gIC8vIGFjcm9zcyB0aGUgcGFuZWwvcGFnZSBib3VuZGFyeSBkZXBlbmRlZCBvbiBpbm5lckhlaWdodCBwYXJpdHkgd2hpY2hcbiAgLy8gYnJlYWtzIHVuZGVyIERldlRvb2xzIGRvY2sgYW5kIHpvb20sIGFuZCB0aGUgdmlzdWFsIGJlbmVmaXQgZGlkbid0XG4gIC8vIGp1c3RpZnkgdGhlIG1haW50ZW5hbmNlIGNvc3QuIFRoZSBpbi1wYW5lbCBmZWVkYmFjay10cmVlIG5vb2RsZXNcbiAgLy8gKGRyYXdOb29kbGUgLyByZWRyYXdOb29kbGVzIGJlbG93KSBhcmUgdW5hZmZlY3RlZC5cbiAgY29uc3QgY2xlYXJCdWJibGVOb29kbGUgPSAoKTogdm9pZCA9PiB7IC8qIG5vLW9wICovIH07XG4gIGNvbnN0IHJlZHJhd05vb2RsZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgY2xlYXJOb29kbGVzKCk7XG4gICAgbGV0IGxhc3RTZWxlY3RvckVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBbLi4ubGlzdC5jaGlsZHJlbl0gYXMgSFRNTEVsZW1lbnRbXSkge1xuICAgICAgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtc2cnKSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0b3InKSkgbGFzdFNlbGVjdG9yRWwgPSBub2RlO1xuICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21zZycpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWVkYmFjaycpICYmIGxhc3RTZWxlY3RvckVsKSBkcmF3Tm9vZGxlKGxhc3RTZWxlY3RvckVsLCBub2RlKTtcbiAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnNlcnQtcmFpbCcpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmRlZCcpICYmIGxhc3RTZWxlY3RvckVsKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5pbmxpbmUtY29tbWVudCcpID8/IG5vZGU7XG4gICAgICAgIGRyYXdOb29kbGUobGFzdFNlbGVjdG9yRWwsIHRhcmdldCk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRpdmlkZXInKSB8fCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnZ3JvdXAtaGVhZCcpKSB7XG4gICAgICAgIGxhc3RTZWxlY3RvckVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGRyYXdOb29kbGUgPSAoc2VsZWN0b3JFbDogSFRNTEVsZW1lbnQsIGZlZWRiYWNrRWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc1IgPSBzZWxlY3RvckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGZSID0gZmVlZGJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBsUiA9IGxpc3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgeDEgPSBzUi5sZWZ0IC0gbFIubGVmdCArIDEyO1xuICAgIGNvbnN0IHkxID0gc1IuYm90dG9tIC0gbFIudG9wICsgbGlzdC5zY3JvbGxUb3A7XG4gICAgY29uc3QgeDIgPSBmUi5sZWZ0IC0gbFIubGVmdDtcbiAgICBjb25zdCB5MiA9IGZSLnRvcCAtIGxSLnRvcCArIGxpc3Quc2Nyb2xsVG9wICsgMTQ7XG4gICAgY29uc3QgdyA9IE1hdGgubWF4KDIwLCB4MiAtIHgxICsgNCk7XG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDIwLCB5MiAtIHkxKTtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RyZWUtbm9vZGxlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcodykpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFN0cmluZyhoKSk7XG4gICAgc3ZnLnN0eWxlLmxlZnQgPSBgJHt4MSAtIDJ9cHhgO1xuICAgIHN2Zy5zdHlsZS50b3AgPSBgJHt5MX1weGA7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIGNvbnN0IHN4ID0gMiwgc3kgPSAwLCBleCA9IHcgLSAyLCBleSA9IGg7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBgTSAke3N4fSAke3N5fSBDICR7c3h9ICR7c3kgKyBoICogMC41NX0sICR7ZXggLSB3ICogMC40fSAke2V5fSwgJHtleH0gJHtleX1gKTtcbiAgICBzdmcuYXBwZW5kKHBhdGgpO1xuICAgIGxpc3QuYXBwZW5kKHN2Zyk7XG4gIH07XG4gIGxldCBzY3JvbGxSYWYgPSAwO1xuICBsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmFmKSByZXR1cm47XG4gICAgc2Nyb2xsUmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgc2Nyb2xsUmFmID0gMDsgcmVkcmF3Tm9vZGxlcygpOyB9KTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZWRyYXdOb29kbGVzKTtcblxuICAvLyDilIDilIDilIAgUGVyLW1lc3NhZ2UgcmVuZGVyZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCByZW5kZXJNZXNzYWdlID0gKG06IFBhbmVsTWVzc2FnZSwgbGFzdFNlbGVjdG9yU2VsOiBzdHJpbmcgfCBudWxsKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykgcmV0dXJuIHJlbmRlclBhZ2UobSk7XG4gICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgcmV0dXJuIHJlbmRlclNlbGVjdG9yKG0pO1xuICAgIGlmIChtLnR5cGUgPT09ICdmZWVkYmFjaycpIHJldHVybiByZW5kZXJGZWVkYmFjayhtLCBsYXN0U2VsZWN0b3JTZWwpO1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQYWdlID0gKG06IFBhZ2VNZXNzYWdlKTogSFRNTEVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkLmNsYXNzTmFtZSA9ICdwYWdlLWRpdmlkZXInO1xuICAgIGQuZGF0YXNldC5pZCA9IG0uaWQ7XG4gICAgY29uc3QgdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdHMuY2xhc3NOYW1lID0gJ3RhYi1zdGF0dXMnO1xuICAgIHRzLmRhdGFzZXQudXJsID0gbS51cmw7XG4gICAgaWYgKG0udXJsID09PSBsaXZlVGFiVXJsKSB0cy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgZC5hcHBlbmQodHMpO1xuICAgIGNvbnN0IHUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdS5jbGFzc05hbWUgPSAndXJsJztcbiAgICB1LnRleHRDb250ZW50ID0gbS51cmw7XG4gICAgdS5kYXRhc2V0LnRpcCA9IGAke20udGl0bGUgPz8gJyd9IMK3ICR7bS51cmx9YDtcbiAgICBkLmFwcGVuZCh1KTtcbiAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBvbiB0aGlzIHBhZ2UgaW4gdGhlIGFjdGl2ZSB0YWIsIGNsaWNraW5nIHRoZSBVUkxcbiAgICAgIC8vIHNob3VsZG4ndCByZWxvYWQgb3Igc3RlYWwgZm9jdXMg4oCUIGl0IHNob3VsZCBqdXN0IGJlIGEgbm8tb3BcbiAgICAgIC8vIHZpc3VhbGx5ICh0aGUgcm93IGFscmVhZHkgaW5kaWNhdGVzIFwib3BlblwiIHZpYSAudGFiLXN0YXR1cykuIFRoZVxuICAgICAgLy8gdXNlciBjb21wbGFpbmVkIGFib3V0IGdldHRpbmcgZm9yY2VkIGludG8gYSBuYXZpZ2F0aW9uIHdoZW4gdGhleVxuICAgICAgLy8gd2VyZSBqdXN0IHRyeWluZyB0byByZWFkIHRoZSByb3cuXG4gICAgICBpZiAobS51cmwgPT09IGxpdmVUYWJVcmwpIHtcbiAgICAgICAgc2V0U3RhdHVzKCdBbHJlYWR5IG9uIHRoaXMgcGFnZScsIHtraW5kOiAnaW5mbyd9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgciA9IGF3YWl0IHNlbmRUb0JnPHtmb3VuZD86IGJvb2xlYW47IG9wZW5lZD86IG51bWJlcjsgZXJyb3I/OiBzdHJpbmd9Pih7a2luZDogJ3N3aXRjaC10by10YWInLCB1cmw6IG0udXJsLCBvcGVuSWZNaXNzaW5nOiB0cnVlfSk7XG4gICAgICBpZiAocj8uZm91bmQpIHNldFN0YXR1cygnU3dpdGNoZWQgdG8gdGFiJyk7XG4gICAgICBlbHNlIGlmIChyPy5vcGVuZWQpIHNldFN0YXR1cygnT3BlbmVkIGluIG5ldyB0YWInKTtcbiAgICAgIGVsc2Ugc2V0U3RhdHVzKFwiQ291bGRuJ3Qgb3BlbiB0YWJcIiwge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pO1xuICAgIHJldHVybiBkO1xuICB9O1xuXG4gIGNvbnN0IHRpdGxlRnJvbUVudHJ5ID0gKGU6IEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICBpZiAoZS50ZXN0SWQpIHJldHVybiBgW3Rlc3RJZD0ke2UudGVzdElkfV1gO1xuICAgIGlmIChlLmlkKSByZXR1cm4gYCMke2UuaWR9YDtcbiAgICBpZiAoZS5jbGFzc2VzPy5sZW5ndGgpIHJldHVybiBgJHtlLnRhZ30uJHtlLmNsYXNzZXMuc2xpY2UoMCwgMikuam9pbignLicpfWA7XG4gICAgcmV0dXJuIGUuc2VsZWN0b3IgfHwgZS50YWcgfHwgJyh1bmtub3duKSc7XG4gIH07XG5cbiAgLy8gUGljayB0aGUgbW9zdCBcImh1bWFubHkgcmVhZGFibGVcIiBsYWJlbCBmb3IgdGhlIGJ1YmJsZSBwcmV2aWV3LiBQcmVmZXJzXG4gIC8vIHZpc2libGUtdG8tdXNlciB0ZXh0IGluIHRoaXMgcHJpb3JpdHk6XG4gIC8vICAgMS4gaW5uZXJUZXh0IC8gdGV4dENvbnRlbnQgKGBlbnRyeS50ZXh0YCkg4oCUIHdoYXQgdGhlIHVzZXIgcmVhZHMgb24gc2NyZWVuXG4gIC8vICAgMi4gYWNjZXNzaWJsZU5hbWUgKGFyaWEtbGFiZWwgLyB0aXRsZSAvIGFsdCBmYWxsYmFjayBjaGFpbilcbiAgLy8gICAzLiBpbnB1dCB2YWx1ZSAoc2tpcHBlZCBpZiBpdCdzIHRoZSBtYXNrZWQgcGFzc3dvcmQgcGxhY2Vob2xkZXIpXG4gIC8vICAgNC4gaW5wdXQgcGxhY2Vob2xkZXJcbiAgLy8gICA1LiBpbWcgYWx0XG4gIC8vICAgNi4gY29tcG9uZW50Um9vdCAoZS5nLiBcImJ1dHRvbiNjdGFcIilcbiAgLy8gICA3LiB0aXRsZUZyb21FbnRyeSDigJQgbGFzdC1yZXNvcnQgdGFnL2NsYXNzL2lkIGZhbGxiYWNrXG4gIC8vIENTUyBoYW5kbGVzIHZpc3VhbCB0cnVuY2F0aW9uIHZpYSB0ZXh0LW92ZXJmbG93OmVsbGlwc2lzOyB3ZSBzaGlwIHRoZVxuICAvLyBmdWxsIHN0cmluZyBzbyB0aGUgdG9vbHRpcCBvbiBob3ZlciBjYW4gc2hvdyB0aGUgY29tcGxldGUgdmFsdWUuXG4gIGNvbnN0IG5pY2VMYWJlbCA9IChlOiBFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKGUudGV4dCkgcmV0dXJuIGUudGV4dDtcbiAgICBpZiAoZS5hY2Nlc3NpYmxlTmFtZSkgcmV0dXJuIGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgY29uc3QgdiA9IGUuYXR0cnM/LnZhbHVlO1xuICAgIGlmICh2ICYmIHYgIT09ICfigKLigKLigKLigKInKSByZXR1cm4gdjtcbiAgICBpZiAoZS5hdHRycz8ucGxhY2Vob2xkZXIpIHJldHVybiBlLmF0dHJzLnBsYWNlaG9sZGVyO1xuICAgIGlmIChlLmF0dHJzPy5hbHQpIHJldHVybiBlLmF0dHJzLmFsdDtcbiAgICBpZiAoZS5jb21wb25lbnRSb290KSByZXR1cm4gZS5jb21wb25lbnRSb290O1xuICAgIHJldHVybiB0aXRsZUZyb21FbnRyeShlKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTZWxlY3RvciA9IChtOiBTZWxlY3Rvck1lc3NhZ2UpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgdmFsaWQgPSBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBzYW1lUGF0aCA9IHBhdGhPZihtLmVudHJ5LnVybCA/PyAnJykgPT09IGxpdmVUYWJQYXRoO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc05hbWUgPSAnbXNnIHNlbGVjdG9yJztcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlICYmIHNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhbGUnKTtcbiAgICBlbHNlIGlmICh2YWxpZCA9PT0gZmFsc2UgJiYgIXNhbWVQYXRoKSBkaXYuY2xhc3NMaXN0LmFkZCgnZGlmZi1wYWdlJyk7XG4gICAgaWYgKG0ucGlubmVkKSBkaXYuY2xhc3NMaXN0LmFkZCgncGlubmVkJyk7XG4gICAgaWYgKG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCkgZGl2LmNsYXNzTGlzdC5hZGQoJ2hhcy1ncm91cCcpO1xuICAgIGlmIChtLmVudHJ5LnNlbGVjdG9yID09PSBsYXN0QWN0aXZlU2VsZWN0b3IpIGRpdi5jbGFzc0xpc3QuYWRkKCdsYXN0LWFjdGl2ZScpO1xuICAgIC8vIEF1dG8tZXhwYW5kIG9uIHNlYXJjaCBoaXQgc28gdGhlIHVzZXIgc2VlcyB3aGVyZSB0aGUgbWF0Y2ggbGFuZGVkLlxuICAgIGNvbnN0IG1hdGNoZWRCb2R5ID0gYm9keU1hdGNoZXNTZWFyY2gobSk7XG4gICAgaWYgKG1hdGNoZWRCb2R5KSBkaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnLCAnc2VhcmNoLWhpdCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuZGF0YXNldC5zZWxlY3RvciA9IG0uZW50cnkuc2VsZWN0b3I7XG4gICAgLy8gRHJhZy10by1yZXBhcmVudDogZXZlcnkgc2VsZWN0b3IgYnViYmxlIGlzIGEgdmFsaWQgZHJvcCB0YXJnZXQgZm9yXG4gICAgLy8gYSBjb21tZW50IGJlaW5nIGRyYWdnZWQgZnJvbSBlbHNld2hlcmUgaW4gdGhlIHNpZGViYXIuXG4gICAgd2lyZVNlbGVjdG9yRHJvcFRhcmdldChkaXYsIG0pO1xuXG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlYWQuY2xhc3NOYW1lID0gJ2hlYWQnO1xuICAgIGNvbnN0IGNhcmV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNhcmV0LmNsYXNzTmFtZSA9ICdjYXJldCc7XG4gICAgY2FyZXQuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjaGV2cm9uLXJpZ2h0JywgMTIpO1xuICAgIGhlYWQuYXBwZW5kKGNhcmV0KTtcbiAgICBjb25zdCBwaW5NYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcGluTWFya2VyLmNsYXNzTmFtZSA9ICdwaW4tbWFya2VyJztcbiAgICBwaW5NYXJrZXIuaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdzdGFyLWZpbGxlZCcsIDExKTtcbiAgICBoZWFkLmFwcGVuZChwaW5NYXJrZXIpO1xuICAgIGNvbnN0IHNlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzZXEuY2xhc3NOYW1lID0gJ3NlcSc7XG4gICAgc2VxLnRleHRDb250ZW50ID0gYCMke20uZW50cnkubn1gO1xuICAgIGlmIChtLmVudHJ5Lmdyb3VwPy5sZW5ndGgpIHNlcS50ZXh0Q29udGVudCArPSBgKyR7bS5lbnRyeS5ncm91cC5sZW5ndGh9YDtcbiAgICBoZWFkLmFwcGVuZChzZXEpO1xuICAgIGNvbnN0IGNvbXBhY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29tcGFjdC5jbGFzc05hbWUgPSAnY29tcGFjdCc7XG4gICAgY29uc3QgY29tcGFjdFN0ciA9IG5pY2VMYWJlbChtLmVudHJ5KTtcbiAgICBjb21wYWN0LmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGNvbXBhY3RTdHIsIHNlYXJjaFF1ZXJ5KTtcbiAgICAvLyBTaG93IHRoZSBmdWxsIGxhYmVsIG9uIGhvdmVyIGV2ZW4gd2hlbiBDU1MgZWxsaXBzaXMgdHJ1bmNhdGVzIHRoZVxuICAgIC8vIHZpc2libGUgcG9ydGlvbiDigJQgdXNlZnVsIHdoZW4gdGhlIHZpc2libGUgdGV4dC9wbGFjZWhvbGRlciBpcyBsb25nLlxuICAgIGlmIChjb21wYWN0U3RyLmxlbmd0aCA+IDI0KSBjb21wYWN0LmRhdGFzZXQudGlwID0gY29tcGFjdFN0cjtcbiAgICBoZWFkLmFwcGVuZChjb21wYWN0KTtcbiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG1ldGEuY2xhc3NOYW1lID0gJ21ldGEnO1xuICAgIGNvbnN0IHIgPSBtLmVudHJ5LnJlY3Q7XG4gICAgbWV0YS50ZXh0Q29udGVudCA9IHIgPyBgJHtyLnd9w5cke3IuaH1gIDogKG0uZW50cnkudGFnID8/ICcnKTtcbiAgICBoZWFkLmFwcGVuZChtZXRhKTtcbiAgICBkaXYuYXBwZW5kKGhlYWQpO1xuXG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzdW1tYXJ5LmNsYXNzTmFtZSA9ICdwZWVrLXN1bW1hcnknO1xuICAgIHN1bW1hcnkuaW5uZXJIVE1MID0gYDxzcGFuIGRhdGEtaWNvbj1cImFsZXJ0LWNpcmNsZVwiIGRhdGEtc2l6ZT1cIjExXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ0XCI+JHtkaXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWZmLXBhZ2UnKSA/ICdkaWZmZXJlbnQgcGFnZScgOiAnc3RhbGUnfTwvc3Bhbj5gO1xuICAgIGhlYWQuYXBwZW5kKHN1bW1hcnkpO1xuICAgIG1vdW50SWNvbnMoc3VtbWFyeSk7XG5cbiAgICBjb25zdCBlcnIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnIuY2xhc3NOYW1lID0gJ3BlZWstZXJyb3InO1xuICAgIGNvbnN0IHJlYXNvbiA9IHNlbGVjdG9yRXJyb3JzLmdldChtLmVudHJ5LnNlbGVjdG9yKTtcbiAgICBjb25zdCBwYXRoRnJvbUVudHJ5ID0gcGF0aE9mKG0uZW50cnkudXJsID8/ICcnKTtcbiAgICBlcnIuaW5uZXJIVE1MID0gc2FtZVBhdGhcbiAgICAgID8gYDxiPlN0YWxlPC9iPiDCtyAke2VzY2FwZUh0bWwocmVhc29uID8/ICdubyBlbGVtZW50IG9uIHRoZSBsaXZlIHBhZ2UgbWF0Y2hlcy4nKX08YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gXG4gICAgICA6IGBDYXB0dXJlZCBvbiA8Y29kZT4ke2VzY2FwZUh0bWwocGF0aEZyb21FbnRyeSl9PC9jb2RlPiDigJQgY3VycmVudCB0YWIgaXMgPGNvZGU+JHtlc2NhcGVIdG1sKGxpdmVUYWJQYXRoID8/ICcnKX08L2NvZGU+LiBTd2l0Y2ggdGFicyB0byB2YWxpZGF0ZS48YnI+PGNvZGU+JHtlc2NhcGVIdG1sKG0uZW50cnkuc2VsZWN0b3IpfTwvY29kZT5gO1xuICAgIGRpdi5hcHBlbmQoZXJyKTtcblxuICAgIC8vIEFuY2VzdG9yIGJyZWFkY3J1bWIg4oCUIFBsYXNtaWMtc3R5bGUgZXNjYWxhdG9yLiBDaGlwcyBmb3IgZWFjaCBlbnRyeSBpblxuICAgIC8vIGVudHJ5LmFuY2VzdG9ycyAoY2xvc2VzdCBmaXJzdCkuIENsaWNrIGEgY2hpcCB0byBjYXB0dXJlIHRoYXRcbiAgICAvLyBhbmNlc3RvciBvbiB0aGUgbGl2ZSBwYWdlIChkZXB0aCA9IGNoaXAgaW5kZXggKyAxIHNpbmNlIHRoZSBlbnRyeSdzXG4gICAgLy8gb3duIHNlbGVjdG9yIGlzIGRlcHRoIDApLiBCcmlnaHRuZXNzIGdyYWRpZW50IGRhcmtlbnMgZGVlcGVyIGNoaXBzLlxuICAgIGlmIChtLmVudHJ5LmFuY2VzdG9ycz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjcnVtYnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNydW1icy5jbGFzc05hbWUgPSAnYW5jZXN0b3ItY3J1bWJzJztcbiAgICAgIGNydW1icy5kYXRhc2V0LnRpcCA9ICdDbGljayBhIGNydW1iIHRvIGVzY2FsYXRlIHRoZSBjYXB0dXJlIHRvIGFuIGFuY2VzdG9yIGVsZW1lbnQnO1xuICAgICAgbS5lbnRyeS5hbmNlc3RvcnMuZm9yRWFjaCgoYW5jLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2hpcC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGNoaXAuY2xhc3NOYW1lID0gJ2FuY2VzdG9yLWNoaXAnO1xuICAgICAgICAvLyBCcmlnaHRuZXNzIGdyYWRpZW50OiBkZWVwZXIgY2hpcHMgZ2V0IHByb2dyZXNzaXZlbHkgZGltbWVyLlxuICAgICAgICBjaGlwLnN0eWxlLmZpbHRlciA9IGBicmlnaHRuZXNzKCR7KDEgLSBpICogMC4wOCkudG9GaXhlZCgyKX0pYDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBhbmMudGVzdElkID8gYFske2FuYy50ZXN0SWR9XWBcbiAgICAgICAgICA6IGFuYy5pZCA/IGAjJHthbmMuaWR9YFxuICAgICAgICAgIDogYW5jLmNsYXNzZXM/Lmxlbmd0aCA/IGAke2FuYy50YWd9LiR7YW5jLmNsYXNzZXNbMF19YFxuICAgICAgICAgIDogYW5jLnRhZztcbiAgICAgICAgY2hpcC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjaGlwLmRhdGFzZXQudGlwID0gYENhcHR1cmUgdGhlIGFuY2VzdG9yICR7aSArIDF9IGxldmVsJHtpID8gJ3MnIDogJyd9IHVwIMK3ICR7YW5jLnRhZ30ke2FuYy5pZCA/ICcjJyArIGFuYy5pZCA6ICcnfWA7XG4gICAgICAgIC8vIEhvdmVyLXByZXZpZXcgdGhlIGFuY2VzdG9yIG9uIHRoZSBsaXZlIHBhZ2Ugc28gdGhlIHVzZXIgY2FuIHNlZVxuICAgICAgICAvLyB3aGljaCBlbGVtZW50IGEgY2hpcCByZWZlcnMgdG8gYmVmb3JlIGNvbW1pdHRpbmcuIE1pcnJvcnMgaG93XG4gICAgICAgIC8vIGhvdmVyaW5nIGEgc2VsZWN0b3IgYnViYmxlIHBhaW50cyBpdHMgcmluZy4gQ2xlYXJpbmcgb25cbiAgICAgICAgLy8gbW91c2VsZWF2ZSBzd2FwcyBiYWNrIHRvIHRoZSBidWJibGUncyBvd24gb3V0bGluZSAodGhlIGJ1YmJsZSdzXG4gICAgICAgIC8vIG1vdXNlZW50ZXIgaGFuZGxlciBwYWludGVkIGl0OyBsZWF2aW5nIHRoZSBjaGlwIGp1c3QgcmVtb3Zlc1xuICAgICAgICAvLyB0aGUgb3ZlcnJpZGUpLlxuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtYW5jZXN0b3InLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZGVwdGg6IGkgKyAxfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gUmUtcGFpbnQgdGhlIGJ1YmJsZSdzIG93biByaW5nIHJhdGhlciB0aGFuIGNsZWFyaW5nIGVudGlyZWx5XG4gICAgICAgICAgLy8gc28gdGhlIHVzZXIgZG9lc24ndCBzZWUgYSBmbGlja2VyIG9mIFwibm90aGluZ1wiIGJldHdlZW4gY2hpcHMuXG4gICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7XG4gICAgICAgICAgICBraW5kOiAnY2FwdHVyZS1hbmNlc3RvcicsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBkZXB0aDogaSArIDEsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKGBDYXB0dXJlZCBhbmNlc3RvciAke2FuYy50YWd9YCk7XG4gICAgICAgICAgZWxzZSBzZXRTdGF0dXMoJ0NvdWxkIG5vdCBjYXB0dXJlIGFuY2VzdG9yJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICB9KTtcbiAgICAgICAgY3J1bWJzLmFwcGVuZChjaGlwKTtcbiAgICAgIH0pO1xuICAgICAgZGl2LmFwcGVuZChjcnVtYnMpO1xuICAgIH1cblxuICAgIC8vIFByZXZpZXcgdGlsZS4gVGhlIGZ1bGwgUE5HIGxpdmVzIG9uIGRpc2sgdW5kZXJcbiAgICAvLyAucGluY2hncmFiLzx3cz4vc2NyZWVuc2hvdHMvOyB0aGUgZGF0YVVybCBpcyBhIHNpZGUtcGFuZWwtZnJpZW5kbHlcbiAgICAvLyBkb3duc2NhbGUgKOKJpDMyMHB4IHdpZGUpLiBUbyBzdG9wIHRoZSBsYXlvdXQgZnJvbSBqdW1waW5nIHdoZW4gYSBzaG90XG4gICAgLy8gYXJyaXZlcyBhIHNlY29uZCBhZnRlciBjYXB0dXJlLCB3ZSBSRVNFUlZFIHRoZSBmaW5hbCBpbWFnZSBoZWlnaHQgdXBcbiAgICAvLyBmcm9udCB1c2luZyB0aGUgY2FwdHVyZWQgZWxlbWVudCdzIGtub3duIGFzcGVjdCByYXRpbyBhbmQgcGFpbnQgYVxuICAgIC8vIHNrZWxldG9uIGxvYWRlciBpbiB0aGF0IHNwYWNlLCB0aGVuIHN3YXAgdGhlIHNjcmVlbnNob3QgaW4gd2l0aCBub1xuICAgIC8vIHJlZmxvdy4gVGhlIHJlc2VydmF0aW9uIG9ubHkgaGFwcGVucyB3aGVuIGEgc2hvdCBpcyBhY3R1YWxseSBleHBlY3RlZFxuICAgIC8vIChhdXRvU2NyZWVuc2hvdCBvbiwgaG9zdCBub3Qgc2tpcHBlZCwgbm8gcmVjb3JkZWQgZmFpbHVyZSkgc28gY2FwdHVyZXNcbiAgICAvLyB0aGF0IHdpbGwgbmV2ZXIgZ2V0IGEgc2hvdCBkb24ndCBjYXJyeSBhbiBlbXB0eSBib3guXG4gICAgY29uc3Qgc2hvdERhdGFVcmwgPSBzaG90cy5nZXQobS5lbnRyeS5zZWxlY3Rvcik7XG4gICAgY29uc3Qgc2hvdEV4cGVjdGVkID0gcHJlZnMuYXV0b1NjcmVlbnNob3RcbiAgICAgICYmICFzaG91bGRTa2lwU2NyZWVuc2hvdChtLmVudHJ5LnVybCA/PyAnJylcbiAgICAgICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/LnVuYXZhaWxhYmxlUmVhc29uO1xuICAgIGlmIChzaG90RGF0YVVybCB8fCBzaG90RXhwZWN0ZWQpIHtcbiAgICAgIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXcuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgLy8gUmVzZXJ2ZSB2ZXJ0aWNhbCBzcGFjZSBpbW1lZGlhdGVseSBmcm9tIHRoZSBlbGVtZW50J3Mgd2lkdGgvaGVpZ2h0LlxuICAgICAgLy8gVGhlIHRodW1ibmFpbCBpcyByZW5kZXJlZCBhdCB0aGUgYnViYmxlJ3MgY29udGVudCB3aWR0aCwgc28gdGhlIGJveFxuICAgICAgLy8gaGVpZ2h0IHRyYWNrcyB0aGUgZWxlbWVudCdzIGFzcGVjdCByYXRpby4gQ2xhbXAgc28gYSB2ZXJ5IHRhbGxcbiAgICAgIC8vIGVsZW1lbnQgZG9lc24ndCByZXNlcnZlIGFuIGFic3VyZCBhbW91bnQgb2Ygc3BhY2UuXG4gICAgICBjb25zdCByID0gbS5lbnRyeS5yZWN0O1xuICAgICAgaWYgKHIgJiYgci53ID4gMCAmJiByLmggPiAwKSB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gTWF0aC5taW4oTWF0aC5tYXgoci5oIC8gci53LCAwLjEyKSwgMi4yKTtcbiAgICAgICAgcHJldmlldy5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zaG90LXJhdGlvJywgU3RyaW5nKHJhdGlvKSk7XG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgncmVzZXJ2ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaG90RGF0YVVybCkge1xuICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nLmNsYXNzTmFtZSA9ICdzaG90JztcbiAgICAgICAgaW1nLmFsdCA9IGBTY3JlZW5zaG90IG9mICMke20uZW50cnkubn1gO1xuICAgICAgICAvLyBSZXZlYWwgb25seSBvbmNlIGRlY29kZWQgc28gdGhlIHN3YXAgaXMgaW5zdGFudCBhbmQgcmVmbG93LWZyZWU7XG4gICAgICAgIC8vIHRoZSBza2VsZXRvbiBzdGF5cyB2aXNpYmxlIHVuZGVybmVhdGggdW50aWwgdGhlbi5cbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpKTtcbiAgICAgICAgaW1nLnNyYyA9IHNob3REYXRhVXJsO1xuICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChpbWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gc2hvdCB5ZXQg4oCUIHNob3cgYSBza2VsZXRvbiBzaGltbWVyIG9jY3VweWluZyB0aGUgcmVzZXJ2ZWQgc3BhY2UuXG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpO1xuICAgICAgICBjb25zdCBza2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNrZWwuY2xhc3NOYW1lID0gJ3Nob3Qtc2tlbGV0b24nO1xuICAgICAgICBza2VsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBMb2FkaW5nIHNjcmVlbnNob3Qgb2YgIyR7bS5lbnRyeS5ufWApO1xuICAgICAgICBwcmV2aWV3LmFwcGVuZChza2VsKTtcbiAgICAgIH1cbiAgICAgIGRpdi5hcHBlbmQocHJldmlldyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0cy5jbGFzc05hbWUgPSAnZW50LXN0YXRzJztcbiAgICBjb25zdCBmYiA9IGNvbGxlY3RGZWVkYmFja0FmdGVyKG0uaWQpO1xuICAgIGNvbnN0IG15VG9rZW5zID0gdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtLmVudHJ5KSk7XG4gICAgY29uc3QgdG90YWxUb2tlbnMgPSBtZXNzYWdlc1xuICAgICAgLmZpbHRlcigobW0pOiBtbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJylcbiAgICAgIC5yZWR1Y2UoKHMsIG1tKSA9PiBzICsgdG9rZW5Db3VudChKU09OLnN0cmluZ2lmeShtbS5lbnRyeSkpLCAwKTtcbiAgICBjb25zdCBzaGFyZVBjdCA9IHRvdGFsVG9rZW5zID4gMCA/IE1hdGgucm91bmQoKG15VG9rZW5zIC8gdG90YWxUb2tlbnMpICogMTAwKSA6IDA7XG4gICAgY29uc3QgZ3JvdXBDb3VudCA9IG0uZW50cnkuZ3JvdXA/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGdyb3VwVG9rZW5zID0gKG0uZW50cnkuZ3JvdXAgPz8gW10pLnJlZHVjZSgocywgZykgPT4gcyArIHRva2VuQ291bnQoSlNPTi5zdHJpbmdpZnkoZykpLCAwKTtcbiAgICB0eXBlIFN0YXRDZWxsID0ge2xhYmVsOiBzdHJpbmc7IHZhbHVlOiBzdHJpbmc7IHRpcDogc3RyaW5nfTtcbiAgICBjb25zdCBjZWxsczogU3RhdENlbGxbXSA9IFtcbiAgICAgIHtsYWJlbDogJ0hUTUwnLCB2YWx1ZTogYCR7bS5lbnRyeS5vdXRlckhUTUw/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ091dGVyIEhUTUwgY2hhciBsZW5ndGgnfSxcbiAgICAgIHtsYWJlbDogJ1Rva2VucycsIHZhbHVlOiBgJHtteVRva2Vuc31gLCB0aXA6ICdBcHByb3ggTExNIHRva2VucyBmb3IgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnU2hhcmUnLCB2YWx1ZTogYCR7c2hhcmVQY3R9JWAsIHRpcDogJ1Rva2VuIHNoYXJlIG9mIGFsbCBzZWxlY3RvcnMnfSxcbiAgICAgIHtsYWJlbDogJ0NvbW1lbnRzJywgdmFsdWU6IGAke2ZiLmxlbmd0aH1gLCB0aXA6ICdJbmxpbmUgY29tbWVudHMgdGhyZWFkZWQgdW5kZXIgdGhpcyBlbnRyeSd9LFxuICAgICAge2xhYmVsOiAnUnVsZXMnLCB2YWx1ZTogYCR7bS5lbnRyeS5tYXRjaGVkUnVsZXM/Lmxlbmd0aCA/PyAwfWAsIHRpcDogJ01hdGNoZWQgQ1NTIHJ1bGVzJ30sXG4gICAgICB7bGFiZWw6ICdTdHlsZXMnLCB2YWx1ZTogYCR7T2JqZWN0LmtleXMobS5lbnRyeS5zdHlsZXMgPz8ge30pLmxlbmd0aH1gLCB0aXA6ICdDb21wdXRlZC1zdHlsZSBmaWVsZHMga2VwdCd9LFxuICAgIF07XG4gICAgaWYgKGdyb3VwQ291bnQpIHtcbiAgICAgIGNlbGxzLnB1c2goe2xhYmVsOiAnR3JvdXAnLCB2YWx1ZTogYCR7Z3JvdXBDb3VudH1gLCB0aXA6ICdNZW1iZXJzIGZvbGRlZCBpbnRvIHRoaXMgZ3JvdXAnfSk7XG4gICAgICBjZWxscy5wdXNoKHtsYWJlbDogJ0dyb3VwIFQnLCB2YWx1ZTogYCR7Z3JvdXBUb2tlbnN9YCwgdGlwOiAnVG9rZW5zIGNvbnRyaWJ1dGVkIGJ5IGdyb3VwIG1lbWJlcnMnfSk7XG4gICAgfVxuICAgIHN0YXRzLmlubmVySFRNTCA9IGNlbGxzLm1hcCgoYykgPT5cbiAgICAgIGA8c3BhbiBjbGFzcz1cImVudC1zdGF0XCIgZGF0YS10aXA9XCIke2VzY2FwZUh0bWwoYy50aXApfVwiPjxzcGFuIGNsYXNzPVwibGJsXCI+JHtjLmxhYmVsfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbFwiPiR7Yy52YWx1ZX08L3NwYW4+PC9zcGFuPmAsXG4gICAgKS5qb2luKCcnKTtcbiAgICBkaXYuYXBwZW5kKHN0YXRzKTtcblxuICAgIC8vIOKUgOKUgCBKU09OIHBhbmUgd2l0aCB0b29sYmFyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vIFRvb2xiYXIgYWJvdmUgdGhlIEpTT04gYm9keTogbGVmdCA9IGxpbmUtd3JhcCB0b2dnbGUsIHJpZ2h0ID0gY29weS5cbiAgICAvLyBUaGUgSlNPTiBpdHNlbGYgcmVmbGVjdHMgdGhlIGdsb2JhbCBgbWluaWZ5YCBzZXR0aW5nIHNvIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgc2FtZSBzaGFwZSB0aGF0IHdpbGwgZW5kIHVwIGluIHRoZSBleHBvcnQuXG4gICAgY29uc3QganNvbldyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uV3JhcC5jbGFzc05hbWUgPSAnYm9keS1qc29uLXdyYXAnO1xuICAgIGNvbnN0IGpzb25CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBqc29uQmFyLmNsYXNzTmFtZSA9ICdib2R5LWpzb24tYmFyJztcblxuICAgIC8vIExpbmUtd3JhcCBjaGVja2JveCAocGVyLWJ1YmJsZSBsb2NhbCBzdGF0ZSwgZGVmYXVsdCBPTikuIFdoZW4gT04gdGhlXG4gICAgLy8gSlNPTiBpcyBmbGF0dGVuZWQgdG8gT05FIG1pbmlmaWVkIGxpbmUgdGhhdCBzb2Z0LXdyYXBzIHRvIHRoZSBidWJibGVcbiAgICAvLyB3aWR0aCAobm8gaG9yaXpvbnRhbCBzY3JvbGwpOyB3aGVuIE9GRiBpdCBmYWxscyBiYWNrIHRvIHRoZSBnbG9iYWxcbiAgICAvLyBtaW5pZnktcmVzcGVjdGluZyBwcmV0dHkvY29tcGFjdCBmb3JtIHdpdGggaG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgY29uc3Qgd3JhcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB3cmFwTGFiZWwuY2xhc3NOYW1lID0gJ2pzb24td3JhcC10b2dnbGUnO1xuICAgIHdyYXBMYWJlbC5kYXRhc2V0LnRpcCA9ICdGbGF0dGVuIHRvIGEgc2luZ2xlIHNvZnQtd3JhcHBpbmcgbGluZSBpbnN0ZWFkIG9mIGhvcml6b250YWwgc2Nyb2xsJztcbiAgICBjb25zdCB3cmFwQ2hlY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHdyYXBDaGVjay50eXBlID0gJ2NoZWNrYm94JztcbiAgICB3cmFwQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgd3JhcExhYmVsLmFwcGVuZCh3cmFwQ2hlY2ssIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgV3JhcCcpKTtcbiAgICBqc29uQmFyLmFwcGVuZCh3cmFwTGFiZWwpO1xuXG4gICAgLy8gQ29weSBidXR0b24gKG1pcnJvcnMgdGhlIFwiQ29weSB0aGlzIGNhcHR1cmUgYXMgSlNPTlwiIGFjdGlvbiBiZWxvdyxcbiAgICAvLyBzdXJmYWNlZCBhdCB0aGUgdG9wIHNvIHRoZSB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBzY3JvbGwgcGFzdCB0aGUgSlNPTlxuICAgIC8vIHRvIGZpbmQgaXQpLlxuICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb3B5QnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjb3B5QnRuLmNsYXNzTmFtZSA9ICdpY29uYnRuIGpzb24tY29weSc7XG4gICAgY29weUJ0bi5kYXRhc2V0LnRpcCA9ICdDb3B5IHRoaXMgY2FwdHVyZSBhcyBKU09OJztcbiAgICBjb3B5QnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDb3B5IGNhcHR1cmUgYXMgSlNPTicpO1xuICAgIGNvcHlCdG4uaW5uZXJIVE1MID0gUEdfSUNPTlMuc3ZnU3RyaW5nKCdjb3B5JywgMTMpO1xuICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIC8vIEZ1bGwgc2luZ2xlLWNhcHR1cmUgZXhwb3J0OiBpZGVudGl0eSArIHBhdGhzICsgdGV4dC9jb250ZW50ICsgZXZlcnlcbiAgICAgIC8vIGF0dGFjaGVkIG5vdGUvY29tbWVudCDigJQgdGhlIHNhbWUgZGVwdGggYXMgYSBmdWxsIGV4cG9ydCwgc2NvcGVkIHRvXG4gICAgICAvLyB0aGlzIG9uZSBjYXB0dXJlIChpdGVtIDcpLiBEaXN0aW5jdCBmcm9tIHRoZSByYXcgZW50cnkgc2hvd24gYmVsb3cuXG4gICAgICBjb25zdCBmZWVkYmFjayA9IG1lc3NhZ2VzLmZsYXRNYXAoKHgpID0+IHgudHlwZSA9PT0gJ2ZlZWRiYWNrJyAmJiB4LnBhcmVudFVpZCA9PT0gbS5lbnRyeS51aWRcbiAgICAgICAgPyBbe3RleHQ6IHgudGV4dCwgdHM6IHgudHMsIHVpZDogeC5pZCwgcGFyZW50VWlkOiB4LnBhcmVudFVpZH1dIDogW10pO1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplQ2FwdHVyZUpzb24oe2VudHJ5OiBtLmVudHJ5LCBmZWVkYmFja30pKTtcbiAgICAgIHNldFN0YXR1cygnQ29waWVkIGNhcHR1cmUgZXhwb3J0Jyk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgY2FwdHVyZScsIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgfSk7XG4gICAganNvbkJhci5hcHBlbmQoY29weUJ0bik7XG4gICAganNvbldyYXAuYXBwZW5kKGpzb25CYXIpO1xuXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJvZHkuY2xhc3NOYW1lID0gJ2JvZHktanNvbiB3cmFwLW9uJztcbiAgICAvLyBSZW5kZXIgdGhlIEpTT04gdG8gbWF0Y2ggdGhlIHdyYXAgc3RhdGU6XG4gICAgLy8gICB3cmFwIE9OICDihpIgYSBzaW5nbGUgbWluaWZpZWQgbGluZSAoaW5kZW50IDApIHRoYXQgc29mdC13cmFwcyB0byB0aGVcbiAgICAvLyAgICAgICAgICAgICAgYnViYmxlIHdpZHRoIChDU1MgaGFuZGxlcyB0aGUgdmlzdWFsIHdyYXBwaW5nIHZpYVxuICAgIC8vICAgICAgICAgICAgICBvdmVyZmxvdy13cmFwOmFueXdoZXJlKSwgc28gdGhlIHdob2xlIG9iamVjdCBpcyBvbmVcbiAgICAvLyAgICAgICAgICAgICAgY29udGludW91cyBzdHJpbmcgd2l0aCBubyBob3Jpem9udGFsIHNjcm9sbC5cbiAgICAvLyAgIHdyYXAgT0ZGIOKGkiB0aGUgZ2xvYmFsIG1pbmlmeS1yZXNwZWN0aW5nIGZvcm06IHByZXR0eS1wcmludGVkIGZ1bGxcbiAgICAvLyAgICAgICAgICAgICAgZW50cnksIG9yIHRoZSBzbGltRW50cnkgY29tcGFjdCBmb3JtIHdoZW4gbWluaWZ5IGlzIG9uLFxuICAgIC8vICAgICAgICAgICAgICB3aXRoIGhvcml6b250YWwgc2Nyb2xsIGZvciBsb25nIGxpbmVzLlxuICAgIGNvbnN0IHJlbmRlckpzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gJyc7XG4gICAgICBjb25zdCB3cmFwcGVkID0gd3JhcENoZWNrLmNoZWNrZWQ7XG4gICAgICBjb25zdCBwYXlsb2FkID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IHNsaW1FbnRyeShtLmVudHJ5LCB7aW5jbHVkZUdyb3VwOiB0cnVlfSkgOiBtLmVudHJ5O1xuICAgICAgY29uc3QgaW5kZW50ID0gKHdyYXBwZWQgfHwgcHJlZnMubWluaWZ5KSA/IDAgOiAyO1xuICAgICAgY29uc3QgdGV4dCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIGluZGVudCk7XG4gICAgICBhcHBlbmRKc29uSGlnaGxpZ2h0KGJvZHksIHRleHQpO1xuICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSB3cmFwU2VhcmNoSGl0c0luVGV4dE5vZGVzKGJvZHksIHNlYXJjaFF1ZXJ5KTtcbiAgICB9O1xuICAgIHJlbmRlckpzb24oKTtcbiAgICB3cmFwQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9uJywgd3JhcENoZWNrLmNoZWNrZWQpO1xuICAgICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd3cmFwLW9mZicsICF3cmFwQ2hlY2suY2hlY2tlZCk7XG4gICAgICByZW5kZXJKc29uKCk7XG4gICAgfSk7XG4gICAgLy8gU3RvcCB0aGUgY2xpY2sgb24gdGhlIHRvb2xiYXIgZnJvbSBjb2xsYXBzaW5nIHRoZSBidWJibGUg4oCUIHRoZSBoZWFkJ3NcbiAgICAvLyBjbGljayBoYW5kbGVyIHRvZ2dsZXMgYC5leHBhbmRlZGAgb24gY2xpY2ssIGFuZCB0aGUgYmFyIGxpdmVzIGluc2lkZVxuICAgIC8vIHRoZSBidWJibGUuXG4gICAganNvbkJhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcbiAgICBqc29uV3JhcC5hcHBlbmQoYm9keSk7XG4gICAgZGl2LmFwcGVuZChqc29uV3JhcCk7XG5cbiAgICBoZWFkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGl2LmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3Tm9vZGxlcyk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBnb2xkOiB0cnVlfSk7XG4gICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBtLmVudHJ5LnNlbGVjdG9yO1xuICAgICAgYXJtU3RpY2t5RXhwaXJ5KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICB2b2lkIHNlbmRUb0NTKHtraW5kOiAnb3V0bGluZS1jbGVhcid9KTtcbiAgICAgIGlmIChsYXN0QWN0aXZlU2VsZWN0b3IpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogbGFzdEFjdGl2ZVNlbGVjdG9yLCBzdGlja3k6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdhY3Rpb25zJztcbiAgICAvLyBOb3RlOiBOTyBhY3Rpb25zLXJvdyBtb3VzZWVudGVyL21vdXNlbGVhdmUuIFRoZSBidWJibGUncyBvd25cbiAgICAvLyBtb3VzZWVudGVyL21vdXNlbGVhdmUgYWxyZWFkeSBwYWludHMgdGhlIHBhZ2Utc2lkZSBvdXRsaW5lIHdoaWxlXG4gICAgLy8gdGhlIGN1cnNvciBpcyBhbnl3aGVyZSBpbnNpZGUgdGhlIGJ1YmJsZSDigJQgaW5jbHVkaW5nIG92ZXIgYWN0aW9uXG4gICAgLy8gYnV0dG9ucy4gQWRkaW5nIGhhbmRsZXJzIEhFUkUgdXNlZCB0byBjbGVhciB0aGUgb3V0bGluZSB3aGVuZXZlclxuICAgIC8vIHRoZSBjdXJzb3IgbW92ZWQgZnJvbSAuYWN0aW9ucyBiYWNrIHRvIHRoZSBidWJibGUgYm9keSAoYmVjYXVzZVxuICAgIC8vIC5tb3VzZWxlYXZlIGZpcmVzIG9uIHRoZSBwYXJlbnQgcGF0aCBldmVuIHRob3VnaCAubW91c2VlbnRlciBvblxuICAgIC8vIHRoZSBidWJibGUgZG9lc24ndCByZWZpcmUpLCB3aGljaCByZWFkIGFzIFwidGhlIGhpZ2hsaWdodCBmbGlja2Vyc1xuICAgIC8vIG9mZiBtaWQtaG92ZXJcIi5cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4obS5waW5uZWQgPyAnc3Rhci1maWxsZWQnIDogJ3N0YXInLCBtLnBpbm5lZCA/ICdVbnBpbiBmcm9tIHRvcCcgOiAnUGluIHRvIHRvcCcsICgpID0+IHtcbiAgICAgIHNuYXBzaG90KCk7XG4gICAgICBtLnBpbm5lZCA9ICFtLnBpbm5lZDtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH0sIHt0b2dnbGVkOiBtLnBpbm5lZH0pKTtcbiAgICAvLyBMb2NhdGUgaXMgYSBvbmUtc2hvdDogc2Nyb2xsIHRoZSBwYWdlIHRvIHRoZSBlbGVtZW50IGFuZCBydW4gdGhlXG4gICAgLy8gMy1wdWxzZSBjeWFuIHJpbmcgYW5pbWF0aW9uLiBJdCB1c2VkIHRvIHNoYXJlIGBsYXN0QWN0aXZlU2VsZWN0b3JgXG4gICAgLy8gd2l0aCB0aGUgaG92ZXItc3RpY2t5IHBhdGgsIHdoaWNoIG1hZGUgdGhlIGJ1dHRvbiBhcHBlYXIgdG9nZ2xlZFxuICAgIC8vIGFueSB0aW1lIHRoZSB1c2VyIG1lcmVseSBob3ZlcmVkIHRoZSBidWJibGUuIE5vdyBpdCBoYXMgbm9cbiAgICAvLyBwZXJzaXN0ZW50IHN0YXRlIOKAlCBwcmVzc2luZyBpdCBhbHdheXMgcGxheXMgdGhlIHNhbWUgZmxhc2guXG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdjcm9zc2hhaXInLCAnTG9jYXRlIHRoaXMgZWxlbWVudCBvbiB0aGUgcGFnZScsICgpID0+IHtcbiAgICAgIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdsb2NhdGUtZmxhc2gnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3Rvcn0pO1xuICAgICAgc2V0U3RhdHVzKCdMb2NhdGluZ+KApicpO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ21lc3NhZ2Utc3F1YXJlLXBsdXMnLCAnQWRkIGEgY29tbWVudCBhZnRlciB0aGlzIGNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBtZXNzYWdlcy5maW5kSW5kZXgoKG1tKSA9PiBtbS5pZCA9PT0gbS5pZCk7XG4gICAgICBjb25zdCBiZWZvcmVJZCA9IGlkeCA+PSAwICYmIGlkeCA8IG1lc3NhZ2VzLmxlbmd0aCAtIDEgPyBtZXNzYWdlc1tpZHggKyAxXSEuaWQgOiAnX19lbmRfXyc7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IGJlZm9yZUlkO1xuICAgICAgaW5zZXJ0QmVmb3JlLmNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSwge3NpemU6IDE1fSkpO1xuICAgIGlmIChncm91cENvdW50KSB7XG4gICAgICAvLyBTcGxpdC1ncm91cCBhY3Rpb246IHByb21vdGUgZWFjaCBncm91cCBtZW1iZXIgYmFjayB0byBpdHMgb3duXG4gICAgICAvLyB0b3AtbGV2ZWwgc2VsZWN0b3IgZW50cnksIHRoZW4gZmlyZSBhIGZyZXNoIGVsZW1lbnQgc2NyZWVuc2hvdFxuICAgICAgLy8gZm9yIGVhY2ggcHJvbW90ZWQgbWVtYmVyLiBHcm91cCBjYXB0dXJlcyBzaGFyZSBhIHNpbmdsZSB1bmlvbi1cbiAgICAgIC8vIGJib3ggc2NyZWVuc2hvdCBrZXllZCBvbiB0aGUgaGVhZDsgdGhlIG1lbWJlcnMgbmV2ZXIgZ2V0IHRoZWlyXG4gICAgICAvLyBvd24gZWxlbWVudCBzaG90cyB1bnRpbCBzcGxpdC4gQWZ0ZXIgdGhpcywgZWFjaCBjaGlsZCBoYXMgaXRzXG4gICAgICAvLyBvd24gcmluZyArIHRodW1ibmFpbC5cbiAgICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignbGlzdC10cmVlJywgYFNwbGl0IHRoaXMgZ3JvdXAgb2YgJHtncm91cENvdW50fSBpbnRvIGluZGl2aWR1YWwgZW50cmllc2AsICgpID0+IHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IG0uaWQpO1xuICAgICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gbS5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgICAgZGVsZXRlIG0uZW50cnkuZ3JvdXA7XG4gICAgICAgIGNvbnN0IGZyZXNoOiBTZWxlY3Rvck1lc3NhZ2VbXSA9IG1lbWJlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0b3InLCBpZDogbXNnSWQoKSwgdHM6IGVudHJ5LnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnksXG4gICAgICAgIH0pKTtcbiAgICAgICAgbWVzc2FnZXMuc3BsaWNlKGlkeCArIDEsIDAsIC4uLmZyZXNoKTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBncm91cCBvZiAke21lbWJlcnMubGVuZ3RofSDCtyBjYXB0dXJpbmcgc2NyZWVuc2hvdHPigKZgKTtcbiAgICAgICAgLy8gRmlyZSBwZXItbWVtYmVyIGVsZW1lbnQgc2hvdHMg4oCUIHNlcXVlbnRpYWxseSBzbyB0aGV5IGRvbid0XG4gICAgICAgIC8vIHJhY2UgY2FwdHVyZVZpc2libGVUYWIuIEZhaWx1cmVzIChzZWxlY3RvciBubyBsb25nZXIgbWF0Y2hlcyxcbiAgICAgICAgLy8gaG9zdCBvbiBza2lwLWxpc3QpIGxlYXZlIHRoZSBtZW1iZXIgd2l0aG91dCBhIHRodW1ibmFpbCBidXRcbiAgICAgICAgLy8gZG9uJ3QgYmxvY2sgdGhlIG90aGVycy5cbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBjYXB0dXJlZCA9IDA7XG4gICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmVzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYXdhaXQgZmlyZUVsZW1lbnRTaG90KGNoaWxkKTtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQpIGNhcHR1cmVkKys7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihMT0csICdzcGxpdC1ncm91cCBzaG90IGZhaWxlZCBmb3InLCBjaGlsZC5lbnRyeS5zZWxlY3RvciwgZSk7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0U3RhdHVzKGBTcGxpdCBkb25lIMK3ICR7Y2FwdHVyZWR9LyR7bWVtYmVycy5sZW5ndGh9IHNjcmVlbnNob3RzYCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bignZXh0ZXJuYWwtbGluaycsICdMb2cgdGhlIGVsZW1lbnQgYW5kIGNvcHkgYSBjb25zb2xlIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7c25pcHBldD86IHN0cmluZ30+KHtraW5kOiAnbG9nLWVsZW1lbnQnLCBzZWxlY3RvcjogbS5lbnRyeS5zZWxlY3RvciwgbjogbS5lbnRyeS5ufSk7XG4gICAgICBjb25zdCBzbmlwcGV0ID0gcmVwbHk/LnNuaXBwZXQgPz8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyR7bS5lbnRyeS5zZWxlY3Rvcn0nKWA7XG4gICAgICB0cnkgeyBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzbmlwcGV0KTsgc2V0U3RhdHVzKCdMb2dnZWQgKyBjb3BpZWQgY29uc29sZSBzbmlwcGV0Jyk7IHNob3dDb3BpZWQoJ0NvcGllZCBzbmlwcGV0Jyk7IH1cbiAgICAgIGNhdGNoIHsgc2V0U3RhdHVzKCdMb2dnZWQgdG8gY29uc29sZScpOyB9XG4gICAgfSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGFjdGlvbkJ0bigncmVmcmVzaC1jdycsICdSZS1jYXB0dXJlIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBsaXZlIHBhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW47IGVudHJ5PzogRW50cnl9Pih7a2luZDogJ3JlY2FwdHVyZScsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yLCBuOiBtLmVudHJ5Lm59KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuZW50cnkpIHtcbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS5lbnRyeSA9IHJlcGx5LmVudHJ5O1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ1JlLWNhcHR1cmVkJyk7XG5cbiAgICAgIH0gZWxzZSBzZXRTdGF0dXMoJ1JlLWNhcHR1cmUgZmFpbGVkJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgIH0pKTtcbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSB0aGlzIGNhcHR1cmUgYXMgYSBmdWxsIGV4cG9ydCAocGF0aHMsIHRleHQsIGNvbW1lbnRzKScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZlZWRiYWNrID0gbWVzc2FnZXMuZmxhdE1hcCgoeCkgPT4geC50eXBlID09PSAnZmVlZGJhY2snICYmIHgucGFyZW50VWlkID09PSBtLmVudHJ5LnVpZFxuICAgICAgICA/IFt7dGV4dDogeC50ZXh0LCB0czogeC50cywgdWlkOiB4LmlkLCBwYXJlbnRVaWQ6IHgucGFyZW50VWlkfV0gOiBbXSk7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVDYXB0dXJlSnNvbih7ZW50cnk6IG0uZW50cnksIGZlZWRiYWNrfSkpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY2FwdHVyZSBleHBvcnQnKTtcbiAgICAgIHNob3dDb3BpZWQoJ0NvcGllZCBjYXB0dXJlJywgYCMke20uZW50cnkubn1gKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZGVsZXRlQnRuKCgpID0+IHJlbW92ZU1lc3NhZ2UobS5pZCkpKTtcbiAgICBkaXYuYXBwZW5kKGFjdGlvbnMpO1xuICAgIHJldHVybiBkaXY7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmVlZGJhY2sgPSAobTogRmVlZGJhY2tNZXNzYWdlLCBsYXN0U2VsZWN0b3JTZWw6IHN0cmluZyB8IG51bGwpOiBIVE1MRWxlbWVudCA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2snO1xuICAgIGlmIChsYXN0U2VsZWN0b3JTZWwpIGRpdi5jbGFzc0xpc3QuYWRkKCd0aHJlYWRlZCcpO1xuICAgIGRpdi5kYXRhc2V0LmlkID0gbS5pZDtcbiAgICBkaXYuaW5uZXJIVE1MID0gaGlnaGxpZ2h0TWF0Y2gobS50ZXh0LCBzZWFyY2hRdWVyeSk7XG4gICAgaWYgKGxhc3RTZWxlY3RvclNlbCkge1xuICAgICAgLy8gUmVzb2x2ZSB0aGUgcGFyZW50IHNlbGVjdG9yIOKAlCBwcmVmZXIgcGFyZW50VWlkICh0aGUgcGVyc2lzdGVkIEZLKVxuICAgICAgLy8gb3ZlciBjYXB0dXJlLWFkamFjZW5jeSwgc2luY2UgZHJhZy10by1yZXBhcmVudCBtb3ZlcyB0aGUgY2hpcCBidXRcbiAgICAgIC8vIHRoZSB0cmFpbGluZy1zZWxlY3RvciBoZXVyaXN0aWMgZ2l2ZXMgc3RhbGUgcmVzdWx0cyB1bnRpbCByZW5kZXJcbiAgICAgIC8vIHNldHRsZXMuIFRoZSBhbm5vdGF0aW9uIG92ZXJsYXkgbmVlZHMgdGhlIHBhcmVudCdzIHNlbGVjdG9yIHRvXG4gICAgICAvLyBhbmNob3IgdGhlIG9uLXBhZ2UgdG9vbHRpcC5cbiAgICAgIGNvbnN0IHtwYXJlbnRTZWwsIHBhcmVudFVpZH0gPSAoKCkgPT4ge1xuICAgICAgICBpZiAobS5wYXJlbnRVaWQpIHtcbiAgICAgICAgICBjb25zdCBwID0gbWVzc2FnZXMuZmluZChcbiAgICAgICAgICAgIChtbSkgPT4gbW0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiAobW0gYXMgU2VsZWN0b3JNZXNzYWdlKS5lbnRyeS51aWQgPT09IG0ucGFyZW50VWlkLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHAgJiYgcC50eXBlID09PSAnc2VsZWN0b3InKSByZXR1cm4ge3BhcmVudFNlbDogcC5lbnRyeS5zZWxlY3RvciwgcGFyZW50VWlkOiBwLmVudHJ5LnVpZH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtwYXJlbnRTZWw6IGxhc3RTZWxlY3RvclNlbCwgcGFyZW50VWlkOiB1bmRlZmluZWQgYXMgc3RyaW5nIHwgdW5kZWZpbmVkfTtcbiAgICAgIH0pKCk7XG4gICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdvdXRsaW5lJywgc2VsZWN0b3I6IHBhcmVudFNlbCwgZ29sZDogdHJ1ZX0pO1xuICAgICAgICAvLyBTY3JvbGwgdGhlIHBhcmVudCBlbGVtZW50IGludG8gdmlldyArIHNob3cgdGhlIG9uLXBhZ2VcbiAgICAgICAgLy8gYW5ub3RhdGlvbiB0b29sdGlwIHJlbmRlcmluZyBUSElTIGNvbW1lbnQncyB0ZXh0LiBQYXNzIHRoZVxuICAgICAgICAvLyBwYXJlbnQncyB1aWQgc28gYSBzYW1lLXNlbGVjdG9yIHNpYmxpbmcgY2FwdHVyZSBkb2Vzbid0IGdldFxuICAgICAgICAvLyBtaXN0YWtlbmx5IGlkZW50aWZpZWQgYXMgXCJ0aGUgc2FtZSB0YXJnZXRcIiBieSB0aGUgY29udGVudFxuICAgICAgICAvLyBzY3JpcHQncyBhbm5vdGF0aW9uIG92ZXJsYXkuXG4gICAgICAgIGlmIChwcmVmcy5hdXRvU2Nyb2xsVG9Ib3ZlcmVkKSB7XG4gICAgICAgICAgc2VuZFRvQ1Moe2tpbmQ6ICdzY3JvbGwtdG8nLCBzZWxlY3RvcjogcGFyZW50U2VsLCBzdGlja3k6IHRydWV9KTtcbiAgICAgICAgfVxuICAgICAgICBzZW5kVG9DUyh7XG4gICAgICAgICAga2luZDogJ2Fubm90YXRpb24nLFxuICAgICAgICAgIHNlbGVjdG9yOiBwYXJlbnRTZWwsXG4gICAgICAgICAgcGF5bG9hZDoge3NlbGVjdG9yOiBwYXJlbnRTZWwsIHVpZDogcGFyZW50VWlkLCBjYXB0dXJlZDogdHJ1ZSwgZmVlZGJhY2s6IFttLnRleHRdfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtY2xlYXInfSk7XG4gICAgICAgIHNlbmRUb0NTKHtraW5kOiAnYW5ub3RhdGlvbi1jbGVhcid9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkaXYuZGF0YXNldC5jb21tZW50SWQgPSBtLmlkO1xuICAgIGNvbnN0IGJlZ2luQ29tbWVudERyYWcgPSAoZTogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyPy5zZXREYXRhKCdhcHBsaWNhdGlvbi94LXBpbmNoZ3JhYi1jb21tZW50JywgbS5pZCk7XG4gICAgICBlLmRhdGFUcmFuc2Zlcj8uc2V0RGF0YSgndGV4dC9wbGFpbicsIG0udGV4dCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG4gICAgfTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsICgpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYWN0aW9ucy5jbGFzc05hbWUgPSAnYWN0aW9ucyc7XG4gICAgY29uc3QgZHJhZ0hhbmRsZSA9IGFjdGlvbkJ0bignZ3JpcCcsICdEcmFnIHRoaXMgaGFuZGxlIG9udG8gYSBzZWxlY3RvciB0byByZXBhcmVudCcsICgpID0+IHsgLyogZHJhZyBoYW5kbGUgb25seSAqLyB9KTtcbiAgICBkcmFnSGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2RyYWctaGFuZGxlJyk7XG4gICAgZHJhZ0hhbmRsZS5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgYmVnaW5Db21tZW50RHJhZyk7XG4gICAgZHJhZ0hhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJykpO1xuICAgIGRyYWdIYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoZHJhZ0hhbmRsZSk7XG4gICAgLy8gRGV0YWNoIOKAlCB0aGUgaW52ZXJzZSBvZiBkcmFnLXRvLXJlcGFyZW50LiBPbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVcbiAgICAvLyBjb21tZW50IGN1cnJlbnRseSByZWFkcyBhcyB0aHJlYWRlZCAoRksgb3IgYWRqYWNlbmN5KS5cbiAgICBpZiAobGFzdFNlbGVjdG9yU2VsIHx8IG0ucGFyZW50VWlkKSB7XG4gICAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ3VubGluaycsICdEZXRhY2ggZnJvbSBpdHMgY2FwdHVyZSDigJQgbWFrZSB0aGlzIGEgc3RhbmRhbG9uZSBjb21tZW50JywgKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBkZWxldGUgbS5wYXJlbnRVaWQ7XG4gICAgICAgIG0uZGV0YWNoZWQgPSB0cnVlO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgZGV0YWNoZWQg4oCUIGRyYWcgaXRzIGhhbmRsZSBvbnRvIGEgY2FwdHVyZSB0byByZWF0dGFjaCcpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICBhY3Rpb25zLmFwcGVuZChhY3Rpb25CdG4oJ2NvcHknLCAnQ29weSBjb21tZW50IHRleHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChtLnRleHQpO1xuICAgICAgc2V0U3RhdHVzKCdDb3BpZWQgY29tbWVudCcpO1xuICAgICAgc2hvd0NvcGllZCgnQ29waWVkIGNvbW1lbnQnKTtcbiAgICB9KSk7XG4gICAgYWN0aW9ucy5hcHBlbmQoYWN0aW9uQnRuKCdwZW5jaWwnLCAnRWRpdCBjb21tZW50JywgKCkgPT4gZW50ZXJGZWVkYmFja0VkaXQoZGl2LCBtKSwge3NpemU6IDE1fSkpO1xuICAgIGFjdGlvbnMuYXBwZW5kKGRlbGV0ZUJ0bigoKSA9PiByZW1vdmVNZXNzYWdlKG0uaWQpKSk7XG4gICAgZGl2LmFwcGVuZChhY3Rpb25zKTtcbiAgICByZXR1cm4gZGl2O1xuICB9O1xuXG4gIC8vIERyb3AgaGFuZGxlciBzaGFyZWQgYnkgZXZlcnkgc2VsZWN0b3IgYnViYmxlLiBBY2NlcHRzIGEgZHJhZ2dlZFxuICAvLyBjb21tZW50IElEIHZpYSB0aGUgYGFwcGxpY2F0aW9uL3gtcGluY2hncmFiLWNvbW1lbnRgIE1JTUUsIHVwZGF0ZXNcbiAgLy8gcGFyZW50VWlkICsgYWRqYWNlbmN5LCBwZXJzaXN0cywgcmUtcmVuZGVycy5cbiAgY29uc3Qgd2lyZVNlbGVjdG9yRHJvcFRhcmdldCA9IChkaXY6IEhUTUxFbGVtZW50LCBtOiBTZWxlY3Rvck1lc3NhZ2UpOiB2b2lkID0+IHtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgICAgY29uc3QgdHlwZXMgPSBlLmRhdGFUcmFuc2Zlcj8udHlwZXM7XG4gICAgICBpZiAoIXR5cGVzIHx8ICFBcnJheS5mcm9tKHR5cGVzKS5pbmNsdWRlcygnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZHJvcC10YXJnZXQnKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0JykpO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldCcpO1xuICAgICAgY29uc3QgaWQgPSBlLmRhdGFUcmFuc2Zlcj8uZ2V0RGF0YSgnYXBwbGljYXRpb24veC1waW5jaGdyYWItY29tbWVudCcpO1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3JjSWR4ID0gbWVzc2FnZXMuZmluZEluZGV4KChtbSkgPT4gbW0uaWQgPT09IGlkKTtcbiAgICAgIGlmIChzcmNJZHggPCAwKSByZXR1cm47XG4gICAgICBjb25zdCBzcmMgPSBtZXNzYWdlc1tzcmNJZHhdISBhcyBGZWVkYmFja01lc3NhZ2U7XG4gICAgICBpZiAoc3JjLnR5cGUgIT09ICdmZWVkYmFjaycpIHJldHVybjtcbiAgICAgIGNvbnN0IGRzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGlmIChkc3RJZHggPCAwKSByZXR1cm47XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgLy8gVXBkYXRlIHRoZSBGSyBwb2ludGVyIGZpcnN0IOKAlCB0aGF0J3MgdGhlIHNvdXJjZSBvZiB0cnV0aCBpblxuICAgICAgLy8gZXhwb3J0cy4gQWRqYWNlbmN5IGlzIGp1c3QgYSByZW5kZXIgY29udmVuaWVuY2UuIFJlcGFyZW50aW5nIGlzXG4gICAgICAvLyB0aGUgaW52ZXJzZSBvZiBkZXRhY2gsIHNvIHRoZSBkZXRhY2hlZCBmbGFnIGlzIGNsZWFyZWQuXG4gICAgICBzcmMucGFyZW50VWlkID0gbS5lbnRyeS51aWQ7XG4gICAgICBkZWxldGUgc3JjLmRldGFjaGVkO1xuICAgICAgLy8gU3BsaWNlIHNyYyBvdXQgb2YgaXRzIGN1cnJlbnQgc2xvdCBhbmQgcmUtaW5zZXJ0IHJpZ2h0IGFmdGVyIHRoZVxuICAgICAgLy8gbmV3IHBhcmVudCAoYW5kIGFueSBmZWVkYmFjayBhbHJlYWR5IHRyYWlsaW5nIGl0LCBzbyB0aGUgbW9zdC1cbiAgICAgIC8vIHJlY2VudCBmZWVkYmFjayBlbmRzIHVwIG5lYXJlc3QgdGhlIHBhcmVudCB2aXN1YWxseSkuXG4gICAgICBtZXNzYWdlcy5zcGxpY2Uoc3JjSWR4LCAxKTtcbiAgICAgIGNvbnN0IG5ld0RzdElkeCA9IG1lc3NhZ2VzLmZpbmRJbmRleCgobW0pID0+IG1tLmlkID09PSBtLmlkKTtcbiAgICAgIGxldCBpbnNlcnRBdCA9IG5ld0RzdElkeCArIDE7XG4gICAgICB3aGlsZSAoaW5zZXJ0QXQgPCBtZXNzYWdlcy5sZW5ndGggJiYgbWVzc2FnZXNbaW5zZXJ0QXRdIS50eXBlID09PSAnZmVlZGJhY2snKSBpbnNlcnRBdCsrO1xuICAgICAgbWVzc2FnZXMuc3BsaWNlKGluc2VydEF0LCAwLCBzcmMpO1xuICAgICAgcGVyc2lzdCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBzZXRTdGF0dXMoJ0NvbW1lbnQgcmVwYXJlbnRlZCcpO1xuICAgIH0pO1xuICB9O1xuXG4gIHR5cGUgQWN0aW9uQnRuT3B0cyA9IHt3YXJuPzogYm9vbGVhbjsgdG9nZ2xlZD86IGJvb2xlYW47IHNpemU/OiBudW1iZXJ9O1xuICBjb25zdCBhY3Rpb25CdG4gPSAoaWNvbjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBmbjogKCkgPT4gdm9pZCwgb3B0czogQWN0aW9uQnRuT3B0cyA9IHt9KTogSFRNTEJ1dHRvbkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBiLnR5cGUgPSAnYnV0dG9uJztcbiAgICBiLmRhdGFzZXQudGlwID0gdGl0bGU7XG4gICAgYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0aXRsZSk7XG4gICAgaWYgKG9wdHMud2FybikgYi5jbGFzc05hbWUgPSAnd2Fybic7XG4gICAgaWYgKG9wdHMudG9nZ2xlZCkgYi5jbGFzc0xpc3QuYWRkKCd0b2dnbGVkJyk7XG4gICAgLy8gRGVmYXVsdCBpY29uIHNpemUgMTMgcmVhZHMgc2xpZ2h0bHkgc21hbGwgaW4gYSAyMsOXMjIgYnV0dG9uIOKAlCBmaW5lXG4gICAgLy8gZm9yIGljb25zIHdpdGggc2ltcGxlIHNoYXBlcyAoY3Jvc3NoYWlyLCBsaXN0LXRyZWUsIHVuZG8pIGJ1dCB2aXNpYmx5XG4gICAgLy8gc3F1ZWV6ZWQgZm9yIGBtZXNzYWdlLXNxdWFyZS1wbHVzYCBhbmQgYHBlbmNpbGAsIHdoZXJlIHRoZVxuICAgIC8vIGludGVyaW9yIHN0cm9rZXMgdmFuaXNoIGludG8gaGFpcmxpbmUgYmx1ci4gQ2FsbGVycyBjYW4gYnVtcCB3aXRoXG4gICAgLy8gYHNpemU6IDE1YCBmb3IgdGhvc2UuXG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoaWNvbiwgb3B0cy5zaXplID8/IDEzKTtcbiAgICBiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgZm4oKTsgfSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlQnRuID0gKG9uQ29uZmlybTogKCkgPT4gdm9pZCk6IEhUTUxCdXR0b25FbGVtZW50ID0+IHtcbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYi50eXBlID0gJ2J1dHRvbic7XG4gICAgYi5jbGFzc05hbWUgPSAnd2Fybic7XG4gICAgYi5kYXRhc2V0LnRpcCA9ICdEZWxldGUnO1xuICAgIGIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbGV0ZSBjYXB0dXJlJyk7XG4gICAgYi5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMyk7XG4gICAgbGV0IHBhcmVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgcmV2ZXJ0VGltZXIgPSAwO1xuICAgIGNvbnN0IHJldmVydCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGFyZW50KSByZXR1cm47XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb25maXJtLXllcywgLmNvbmZpcm0tbm8nKSkgbi5yZW1vdmUoKTtcbiAgICAgIGlmICghYi5wYXJlbnRFbGVtZW50KSBwYXJlbnQuYXBwZW5kKGIpO1xuICAgICAgY2xlYXJUaW1lb3V0KHJldmVydFRpbWVyKTtcbiAgICB9O1xuICAgIGIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHBhcmVudCA9IGIucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgeWVzLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIHllcy5jbGFzc05hbWUgPSAnY29uZmlybS15ZXMnO1xuICAgICAgeWVzLmRhdGFzZXQudGlwID0gJ0NvbmZpcm0gZGVsZXRlJztcbiAgICAgIHllcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnQ29uZmlybSBkZWxldGUnKTtcbiAgICAgIHllcy5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ2NoZWNrJywgMTMpO1xuICAgICAgeWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgb25Db25maXJtKCk7IH0pO1xuICAgICAgY29uc3Qgbm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIG5vLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIG5vLmNsYXNzTmFtZSA9ICdjb25maXJtLW5vJztcbiAgICAgIG5vLmRhdGFzZXQudGlwID0gJ0NhbmNlbCBkZWxldGUnO1xuICAgICAgbm8uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0NhbmNlbCBkZWxldGUnKTtcbiAgICAgIG5vLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygneCcsIDEzKTtcbiAgICAgIG5vLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7IGV2LnN0b3BQcm9wYWdhdGlvbigpOyByZXZlcnQoKTsgfSk7XG4gICAgICBiLnJlcGxhY2VXaXRoKHllcyk7XG4gICAgICB5ZXMuYWZ0ZXIobm8pO1xuICAgICAgcmV2ZXJ0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChyZXZlcnQsIDgwMDApO1xuICAgIH0pO1xuICAgIHJldHVybiBiO1xuICB9O1xuXG4gIGNvbnN0IGVudGVyRmVlZGJhY2tFZGl0ID0gKGRpdjogSFRNTEVsZW1lbnQsIG06IEZlZWRiYWNrTWVzc2FnZSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG5leHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuZXh0LmNsYXNzTmFtZSA9ICdtc2cgZmVlZGJhY2sgZWRpdGluZyc7XG4gICAgaWYgKGRpdi5jbGFzc0xpc3QuY29udGFpbnMoJ3RocmVhZGVkJykpIG5leHQuY2xhc3NMaXN0LmFkZCgndGhyZWFkZWQnKTtcbiAgICBuZXh0LmRhdGFzZXQuaWQgPSBtLmlkO1xuICAgIG5leHQuYXBwZW5kKGJ1aWxkSW5saW5lQ29tbWVudCh7XG4gICAgICBpbml0aWFsOiBtLnRleHQsXG4gICAgICBvbkNhbmNlbDogKCkgPT4geyBkaXYucmVwbGFjZVdpdGgoZGl2LmNsb25lTm9kZSh0cnVlKSk7IHJlbmRlcigpOyB9LFxuICAgICAgb25TdWJtaXQ6ICh0ZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSAodGV4dCA/PyAnJykudHJpbSgpO1xuICAgICAgICBpZiAodHJpbW1lZCA9PT0gbS50ZXh0KSB7IHJlbmRlcigpOyByZXR1cm47IH1cbiAgICAgICAgc25hcHNob3QoKTtcbiAgICAgICAgbS50ZXh0ID0gdHJpbW1lZDtcbiAgICAgICAgLy8gU2V2ZXJpdHkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBVSS4gU3RyaXAgYW55IGxlZ2FjeSB2YWx1ZVxuICAgICAgICAvLyB0aGF0IGNhbWUgYmFjayBmcm9tIGFuIG9sZGVyIEpTT05MIGltcG9ydCBzbyBzYXZlcyBkb24ndCBrZWVwXG4gICAgICAgIC8vIHJlLWVtaXR0aW5nIGl0LlxuICAgICAgICBkZWxldGUgKG0gYXMgYW55KS5zZXZlcml0eTtcbiAgICAgICAgcGVyc2lzdCgpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBhdXRvZm9jdXM6IHRydWUsXG4gICAgfSkpO1xuICAgIGRpdi5yZXBsYWNlV2l0aChuZXh0KTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVNZXNzYWdlID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBlbCA9IGxpc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcbiAgICBjb25zdCBmaW5pc2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICBzbmFwc2hvdCgpO1xuICAgICAgbWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0uaWQgIT09IGlkKTtcbiAgICAgIHBlcnNpc3QoKTtcbiAgICAgIHJlbmRlcigpO1xuICAgICAgc2V0U3RhdHVzKCdEZWxldGVkJyk7XG4gICAgfTtcbiAgICBpZiAoIWVsKSB7IGZpbmlzaCgpOyByZXR1cm47IH1cbiAgICBlbC5zdHlsZS5tYXhIZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgIHZvaWQgZWwub2Zmc2V0V2lkdGg7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgncmVtb3ZpbmcnKTtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNsZWFudXAgPSAoKTogdm9pZCA9PiB7IGlmIChkb25lKSByZXR1cm47IGRvbmUgPSB0cnVlOyBmaW5pc2goKTsgfTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgY2xlYW51cCwge29uY2U6IHRydWV9KTtcbiAgICBzZXRUaW1lb3V0KGNsZWFudXAsIDM4MCk7XG4gIH07XG5cbiAgLy8g4pSA4pSA4pSAIENvbXBvc2VyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzZW5kRmVlZGJhY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGV4dCA9IGNvbXBvc2VyLnZhbHVlLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGxldCBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICBpZiAoaW5zZXJ0QmVmb3JlLmN1cnJlbnQpIHtcbiAgICAgIHBvc2l0aW9uID0gbWVzc2FnZXMuZmluZEluZGV4KChtKSA9PiBtLmlkID09PSBpbnNlcnRCZWZvcmUuY3VycmVudCk7XG4gICAgICBpZiAocG9zaXRpb24gPCAwKSBwb3NpdGlvbiA9IG1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgIGluc2VydEJlZm9yZS5jdXJyZW50ID0gbnVsbDtcbiAgICAgIGluc2VydEJlZm9yZS5jb21tZW50ID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFN0YW1wIHBhcmVudFVpZCBvbiB0aGUgaW4tbWVtb3J5IG1lc3NhZ2UgYXQgY3JlYXRpb24gdGltZSBzbyB0aGVcbiAgICAvLyBGSyBpcyB0aGUgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aC4gVGhlIHNsaW0gZW1pdCBubyBsb25nZXIgaGFzIHRvXG4gICAgLy8gaW5mZXIgdGhlIHBhcmVudCBmcm9tIGNhcHR1cmUtYWRqYWNlbmN5LCBhbmQgYG1hbmlmZXN0LmNvdW50c2BcbiAgICAvLyBhY2N1cmF0ZWx5IHJlZmxlY3RzIGZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzLlxuICAgIC8vIFdhbGsgYmFjayB0byB0aGUgbmVhcmVzdCBwcmVjZWRpbmcgc2VsZWN0b3IgYmVmb3JlIHNwbGljZS5cbiAgICBsZXQgcElkeCA9IHBvc2l0aW9uIC0gMTtcbiAgICB3aGlsZSAocElkeCA+PSAwICYmIG1lc3NhZ2VzW3BJZHhdPy50eXBlID09PSAnZmVlZGJhY2snKSBwSWR4LS07XG4gICAgY29uc3QgcGFyZW50ID0gcElkeCA+PSAwID8gbWVzc2FnZXNbcElkeF0gOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFyZW50VWlkID0gcGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnc2VsZWN0b3InID8gcGFyZW50LmVudHJ5LnVpZCA6IHVuZGVmaW5lZDtcbiAgICBtZXNzYWdlcy5zcGxpY2UocG9zaXRpb24sIDAsIHtcbiAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLCB0czogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0LFxuICAgICAgLi4uKHBhcmVudFVpZCA/IHtwYXJlbnRVaWR9IDoge30pLFxuICAgIH0pO1xuICAgIGNvbXBvc2VyLnZhbHVlID0gJyc7XG4gICAgdXBkYXRlQ29tcG9zZXJNZXRlcigpO1xuICAgIC8vIFNlbmRpbmcgY2xlYXJzIGFueSBhY3RpdmUgdmlzdWFsIGZpbmQgc28gdGhlIG5ldyBjb21tZW50IGlzbid0IGhpZGRlblxuICAgIC8vIGJlaGluZCBhIHN0YWxlIGZpbHRlci5cbiAgICBpZiAoc2VhcmNoUXVlcnkpIGNsb3NlRmluZCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICBzZXRTdGF0dXMoJ1NlbnQnKTtcbiAgICBjb21wb3Nlci5mb2N1cygpO1xuICAgIC8vIEJ1ZyAjMjogZmVlZGJhY2sncyBwYXJlbnQgc2hvdWxkIGhhdmUgYSBzY3JlZW5zaG90LlxuICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LnR5cGUgPT09ICdzZWxlY3RvcicgJiYgIXBhcmVudC5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSB7XG4gICAgICB2b2lkIGZpcmVFbGVtZW50U2hvdChwYXJlbnQgYXMgU2VsZWN0b3JNZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgY29tcG9zZXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGFzeW5jIChlKSA9PiB7XG4gICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHJldHVybjtcbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGhhbmRsZWQgPSBhd2FpdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyKCk7XG4gICAgICBpZiAoIWhhbmRsZWQpIHNlbmRGZWVkYmFjaygpO1xuICAgIH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnICYmIGluc2VydEJlZm9yZS5jdXJyZW50KSB7XG4gICAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgICBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZUNvbXBvc2VyTWV0ZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdCA9IGNvbXBvc2VyLnZhbHVlO1xuICAgIGNvbXBXb3Jkcy50ZXh0Q29udGVudCA9IFN0cmluZyh3b3JkQ291bnQodCkpO1xuICAgIGNvbXBUb2tlbnMudGV4dENvbnRlbnQgPSBTdHJpbmcodG9rZW5Db3VudCh0KSk7XG4gICAgY29tcG9zZXIuY2xhc3NMaXN0LnRvZ2dsZSgnY21kLW1vZGUnLCAvXj4vLnRlc3QodC50cmltKCkpKTtcbiAgfTtcbiAgY29tcG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB1cGRhdGVDb21wb3Nlck1ldGVyKTtcblxuICAvLyDilIDilIAgSGVhZGVyIHNlYXJjaCDihpIgY29tbWFuZCBwYWxldHRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBUaGUgaGVhZGVyIHNlYXJjaCBhZmZvcmRhbmNlIG5vIGxvbmdlciBydW5zIGl0cyBvd24gZmlsdGVyOyBjbGlja2luZyBvclxuICAvLyBmb2N1c2luZyBpdCBvcGVucyB0aGUgQ21kK0sgY29tbWFuZCBwYWxldHRlICh3aGljaCBzZWFyY2hlcyBjYXB0dXJlcyBBTkRcbiAgLy8gcnVucyBjb21tYW5kcykuIEl0J3MgYSByZWFkb25seSB0cmlnZ2VyLCBzbyB3ZSBqdXN0IG9wZW4gdGhlIHBhbGV0dGUgYW5kXG4gIC8vIGRyb3AgZm9jdXMgc28gdGhlIHBhbGV0dGUgaW5wdXQgdGFrZXMgb3ZlciBjbGVhbmx5LlxuICBjb25zdCB0cmlnZ2VyUGFsZXR0ZUZyb21TZWFyY2ggPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFwYWxldHRlLmhpZGRlbikgcmV0dXJuO1xuICAgIG9wZW5QYWxldHRlKCk7XG4gICAgc2VhcmNoLmJsdXIoKTtcbiAgfTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKTtcbiAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7IGUucHJldmVudERlZmF1bHQoKTsgdHJpZ2dlclBhbGV0dGVGcm9tU2VhcmNoKCk7IH1cbiAgfSk7XG5cbiAgLy8g4pSA4pSAIEN0cmwrRiB2aXN1YWwgZmluZCAoaW4tbGlzdCBmaWx0ZXIgKyBoaWdobGlnaHQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBzY3JvbGxGaXJzdEZpbmRIaXRJbnRvVmlldyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5KSByZXR1cm47XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gbGlzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm1zZy5zZWxlY3Rvci5zZWFyY2gtaGl0Jyk7XG4gICAgICBpZiAoZmlyc3RIaXQpIHtcbiAgICAgICAgY2VudGVyRWxlbWVudEluTGlzdChmaXJzdEhpdCk7XG4gICAgICAgIGNvbnN0IG1rID0gZmlyc3RIaXQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ21hcmsnKTtcbiAgICAgICAgaWYgKG1rKSBjZW50ZXJFbGVtZW50SW5MaXN0KG1rKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TWF0Y2ggPSBsaXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubXNnIG1hcmsnKTtcbiAgICAgICAgaWYgKGZpcnN0TWF0Y2gpIGNlbnRlckVsZW1lbnRJbkxpc3QoZmlyc3RNYXRjaCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUZpbmRDb3VudCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWZpbmRDb3VudCkgcmV0dXJuO1xuICAgIGZpbmRDb3VudC50ZXh0Q29udGVudCA9IHNlYXJjaFF1ZXJ5ID8gYCR7bGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnJykubGVuZ3RofSBtYXRjaGAgOiAnJztcbiAgfTtcbiAgY29uc3QgYXBwbHlGaW5kID0gKHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBzZWFyY2hRdWVyeSA9IHZhbHVlLnRyaW0oKTtcbiAgICByZW5kZXIoKTtcbiAgICB1cGRhdGVGaW5kQ291bnQoKTtcbiAgICBzY3JvbGxGaXJzdEZpbmRIaXRJbnRvVmlldygpO1xuICB9O1xuICBjb25zdCBvcGVuRmluZCA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIWZpbmRCYXIgfHwgIWZpbmRJbnB1dCkgcmV0dXJuO1xuICAgIGZpbmRCYXIuaGlkZGVuID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsJyk/LmNsYXNzTGlzdC5hZGQoJ2ZpbmQtb3BlbicpO1xuICAgIGZpbmRJbnB1dC5mb2N1cygpO1xuICAgIGZpbmRJbnB1dC5zZWxlY3QoKTtcbiAgfTtcbiAgY29uc3QgY2xvc2VGaW5kID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmIChmaW5kQmFyKSBmaW5kQmFyLmhpZGRlbiA9IHRydWU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsJyk/LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbmQtb3BlbicpO1xuICAgIGlmIChmaW5kSW5wdXQpIGZpbmRJbnB1dC52YWx1ZSA9ICcnO1xuICAgIGlmIChzZWFyY2hRdWVyeSkgeyBzZWFyY2hRdWVyeSA9ICcnOyByZW5kZXIoKTsgfVxuICAgIHVwZGF0ZUZpbmRDb3VudCgpO1xuICB9O1xuICBmaW5kSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gYXBwbHlGaW5kKGZpbmRJbnB1dC52YWx1ZSkpO1xuICBmaW5kSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4geyBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7IGUucHJldmVudERlZmF1bHQoKTsgY2xvc2VGaW5kKCk7IH0gfSk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpbmQtY2xlYXJdJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VGaW5kKTtcblxuICBjb25zdCB0cnlNYW51YWxDYXB0dXJlRnJvbUNvbXBvc2VyID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IG0gPSAvXj5cXHMqKC4rKSQvLmV4ZWMoY29tcG9zZXIudmFsdWUudHJpbSgpKTtcbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBzZWwgPSBtWzFdIS50cmltKCk7XG4gICAgaWYgKCFzZWwpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCByZXBseSA9IGF3YWl0IHNlbmRUb0NTQW5kV2FpdDx7b2s6IGJvb2xlYW59Pih7a2luZDogJ21hbnVhbC1jYXB0dXJlJywgc2VsZWN0b3I6IHNlbH0pO1xuICAgIGlmIChyZXBseT8ub2spIHsgY29tcG9zZXIudmFsdWUgPSAnJzsgdXBkYXRlQ29tcG9zZXJNZXRlcigpOyBzZXRTdGF0dXMoJ0NhcHR1cmVkICcgKyBzZWwpOyB9XG4gICAgZWxzZSBzZXRTdGF0dXMoJ1NlbGVjdG9yIGRpZCBub3QgbWF0Y2g6ICcgKyBzZWwsIHtraW5kOiAnd2Fybid9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgRXhwb3J0IGJ1aWxkZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyB2MiBleHBvcnQgc2hhcGU6IHRvcCBsZXZlbCBrZWVwcyB1c2VyLWZhY2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHNcbiAgLy8gKHVpZCwgbiwgc2VsZWN0b3IsIHRleHQsIHJvbGUsIGF0dHJzLCBoaW50cywgY2xhc3Nlcywgc3R5bGVzLCBjb21wb25lbnQsXG4gIC8vIHN0YXRlcywgc2NyZWVuc2hvdCwgZ3JvdXApLiBEaWFnbm9zdGljIC8gZGV0ZWN0aW9uIG1ldGFkYXRhIG1vdmVzIHVuZGVyXG4gIC8vIGFuIGBfYXVkaXRgIG5hbWVzcGFjZSAoYW5jZXN0b3JzLCBjb21wb25lbnRSb290LCBpblNoYWRvd0RPTSxcbiAgLy8gcHNldWRvRWxlbWVudHMsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBUaGUgdmVyc2lvbiBtYXJrZXIgaXMgZW1pdHRlZFxuICAvLyBhcyBgdjogMmAuIEltcG9ydGVycyBkZXRlY3QgZWl0aGVyIHYxIChmbGF0KSBvciB2MiBhbmQgZGVub3JtYWxpemUuXG4gIC8vXG4gIC8vIEFnZ3Jlc3NpdmUgbWluaWZ5IGFkZGl0aW9uYWxseSBkcm9wcyBmaWVsZHMgdGhlIHNlbGVjdG9yIGFscmVhZHlcbiAgLy8gaW1wbGllczogYW5jZXN0b3JzLCB2aWV3cG9ydCAob25lIHBlciBwYWdlKSwgY29tcG9uZW50Um9vdCB3aGVuXG4gIC8vIHJlZHVuZGFudCB3aXRoIHRoZSBzZWxlY3RvciwgYW5kIHBzZXVkb0VsZW1lbnRzLlxuICBjb25zdCBzbGltRW50cnkgPSAoZTogRW50cnksIG9wdHM6IHtpbmNsdWRlR3JvdXA/OiBib29sZWFuOyBldmVudEluZGV4PzogbnVtYmVyOyB2aXN1YWxPcmRlcj86IG51bWJlcjsgZ3JvdXBVaWQ/OiBzdHJpbmd9ID0ge30pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0+IHtcbiAgICBjb25zdCBpbmNsdWRlT3V0ZXIgPSBwcmVmcy5pbmNsdWRlT3V0ZXJIVE1MO1xuICAgIGNvbnN0IGluY2x1ZGVNYXRjaGVkID0gcHJlZnMuaW5jbHVkZU1hdGNoZWRSdWxlcztcbiAgICBjb25zdCBpbmNsdWRlU3R5bGVzID0gcHJlZnMuaW5jbHVkZVN0eWxlcztcbiAgICBjb25zdCBtaW5pZnkgPSBwcmVmcy5taW5pZnk7XG5cbiAgICAvLyBUb3AtbGV2ZWwgdXNlci1mYWNpbmcgZmllbGRzLiBPcmRlciBtYXR0ZXJzIGZvciBvdXRwdXQgcmVhZGFiaWxpdHkg4oCUXG4gICAgLy8gd2Ugd2FudCBgdiAvIHR5cGUgLyB1aWQgLyBuIC8gc2VsZWN0b3JgIGZpcnN0IHNvIEpTT05MIGlzIGdyZXBwYWJsZS5cbiAgICAvL1xuICAgIC8vIGBuYCBzdGF5cyBhcyB0aGUgY2FwdHVyZS1zZXF1ZW5jZSBkaXNwbGF5IGxhYmVsIGZvciBiYWNrd2FyZHNcbiAgICAvLyBjb21wYXRpYmlsaXR5IHdpdGggdjEvdjIgcmVhZGVycyAoYW5kIHRoZSBzaWRlYmFyJ3MgXCIjM1wiIGNoaXBzKS5cbiAgICAvLyBUaGUgZGlzYW1iaWd1YXRlZCBjb3VzaW5zIChgY2FwdHVyZUluZGV4YCwgYGV2ZW50SW5kZXhgLFxuICAgIC8vIGB2aXN1YWxPcmRlcmAsIGBkaXNwbGF5TGFiZWxgKSBsaXZlIG9uIHRoZSByb3cgc28gYSBkb3duc3RyZWFtXG4gICAgLy8gYWdlbnQgY2FuIHBpY2sgd2hpY2hldmVyIG9yZGVyaW5nIGlzIG1lYW5pbmdmdWwg4oCUIGJ1ZyAjMTAuXG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgdjogMixcbiAgICAgIHR5cGU6ICdzZWxlY3RvcicsXG4gICAgICB1aWQ6IGUudWlkLFxuICAgICAgbjogZS5uLFxuICAgICAgdHM6IGUudHMsXG4gICAgICB1cmw6IGUudXJsLFxuICAgICAgdGFnOiBlLnRhZyxcbiAgICAgIHNlbGVjdG9yOiBlLnNlbGVjdG9yLFxuICAgICAgY2FwdHVyZUluZGV4OiBlLm4sXG4gICAgICBkaXNwbGF5TGFiZWw6IFN0cmluZyhlLm4pLFxuICAgIH07XG4gICAgaWYgKG9wdHMuZXZlbnRJbmRleCAhPT0gdW5kZWZpbmVkKSBvdXQuZXZlbnRJbmRleCA9IG9wdHMuZXZlbnRJbmRleDtcbiAgICBpZiAob3B0cy52aXN1YWxPcmRlciAhPT0gdW5kZWZpbmVkKSBvdXQudmlzdWFsT3JkZXIgPSBvcHRzLnZpc3VhbE9yZGVyO1xuICAgIGlmIChlLnNlc3Npb25JZCkgb3V0LnNlc3Npb25JZCA9IGUuc2Vzc2lvbklkO1xuICAgIGlmIChlLnRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnRleHQgPSBtaW5pZnkgPyBlLnRleHQucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUudGV4dDtcbiAgICBpZiAoZS5yb2xlICE9PSB1bmRlZmluZWQpIG91dC5yb2xlID0gZS5yb2xlO1xuICAgIGlmIChlLmFjY2Vzc2libGVOYW1lICE9PSB1bmRlZmluZWQpIG91dC5hY2Nlc3NpYmxlTmFtZSA9IG1pbmlmeSA/IGUuYWNjZXNzaWJsZU5hbWUucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpLnRyaW0oKSA6IGUuYWNjZXNzaWJsZU5hbWU7XG4gICAgaWYgKGUuaWQgIT09IHVuZGVmaW5lZCkgb3V0LmlkID0gZS5pZDtcbiAgICBpZiAoZS50ZXN0SWQgIT09IHVuZGVmaW5lZCkgb3V0LnRlc3RJZCA9IGUudGVzdElkO1xuICAgIGlmIChlLmNsYXNzZXMgJiYgZS5jbGFzc2VzLmxlbmd0aCkge1xuICAgICAgb3V0LmNsYXNzZXMgPSAobWluaWZ5ICYmIGUuY2xhc3Nlcy5sZW5ndGggPiA4KSA/IGUuY2xhc3Nlcy5zbGljZSgwLCA4KSA6IGUuY2xhc3NlcztcbiAgICB9XG4gICAgaWYgKGUuYXR0cnMgJiYgT2JqZWN0LmtleXMoZS5hdHRycykubGVuZ3RoKSBvdXQuYXR0cnMgPSBlLmF0dHJzO1xuICAgIGlmIChlLmhpbnRzICYmIE9iamVjdC5rZXlzKGUuaGludHMpLmxlbmd0aCkgb3V0LmhpbnRzID0gZS5oaW50cztcbiAgICBpZiAoZS5yZWN0KSBvdXQucmVjdCA9IGUucmVjdDtcbiAgICBpZiAoZS5zdGF0ZXMgJiYgZS5zdGF0ZXMubGVuZ3RoKSBvdXQuc3RhdGVzID0gZS5zdGF0ZXM7XG4gICAgaWYgKGUuY29tcG9uZW50KSBvdXQuY29tcG9uZW50ID0gZS5jb21wb25lbnQ7XG4gICAgLy8gTG9jYXRvci1xdWFsaXR5IGZpZWxkLiBQcm9tb3RlIGV2ZW4gd2hlbiBtaW5pZmllZCDigJQgaXQncyBhIHNpbmdsZVxuICAgIC8vIHNtYWxsIGludCBhbmQgYSBkb3duc3RyZWFtIGFnZW50IHVzZXMgaXQgdG8gZGVjaWRlIHdoZXRoZXIgdG9cbiAgICAvLyB0cnVzdCB0aGUgc2VsZWN0b3IuXG4gICAgaWYgKGUuc2VsZWN0b3JNYXRjaENvdW50ICE9PSB1bmRlZmluZWQpIG91dC5zZWxlY3Rvck1hdGNoQ291bnQgPSBlLnNlbGVjdG9yTWF0Y2hDb3VudDtcbiAgICBpZiAoZS5hMTF5KSBvdXQuYTExeSA9IGUuYTExeTtcbiAgICBpZiAoZS5hc3NldHMgJiYgZS5hc3NldHMubGVuZ3RoKSBvdXQuYXNzZXRzID0gZS5hc3NldHM7XG4gICAgaWYgKGUubGF5b3V0Q29udGV4dCAmJiBlLmxheW91dENvbnRleHQubGVuZ3RoKSBvdXQubGF5b3V0Q29udGV4dCA9IGUubGF5b3V0Q29udGV4dDtcbiAgICBpZiAoaW5jbHVkZU91dGVyICYmIGUub3V0ZXJIVE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG91dC5vdXRlckhUTUwgPSBtaW5pZnkgPyBlLm91dGVySFRNTC5yZXBsYWNlQWxsKC9cXHMrL2csICcgJykudHJpbSgpIDogZS5vdXRlckhUTUw7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlU3R5bGVzICYmIGUuc3R5bGVzICYmIE9iamVjdC5rZXlzKGUuc3R5bGVzKS5sZW5ndGgpIG91dC5zdHlsZXMgPSBlLnN0eWxlcztcbiAgICBpZiAoZS5zY3JlZW5zaG90KSB7XG4gICAgICAvLyBQYXRoIG5vcm1hbGl6YXRpb246IHRoZSBsaXZlIGBlbnRyeS5zY3JlZW5zaG90LmVsZW1lbnRgIGNhcnJpZXMgYVxuICAgICAgLy8gd29ya3NwYWNlLXByZWZpeGVkIHBhdGggKGUuZy4gYGRlZmF1bHQvc2NyZWVuc2hvdHMvZm9vLnBuZ2ApXG4gICAgICAvLyBiZWNhdXNlIHRoZSBiYWNrZ3JvdW5kJ3MgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBBUEkgc3RhbXBzXG4gICAgICAvLyB0aGUgd29ya3NwYWNlIGludG8gdGhlIG9uLWRpc2sgcGF0aC4gQnV0IHRoZSAudGFyLnpzdCBhcmNoaXZlXG4gICAgICAvLyBidW5kbGVzIHNjcmVlbnNob3RzIGZsYXQgYXQgYHNjcmVlbnNob3RzL2Zvby5wbmdgLCBzbyB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZS1wcmVmaXggd291bGQgcmVzb2x2ZSB0byBub3RoaW5nIGZvciBhbiBhZ2VudCB0aGF0XG4gICAgICAvLyBleHRyYWN0ZWQgdGhlIGFyY2hpdmUuIFN0cmlwIHRoZSB3b3Jrc3BhY2UgcHJlZml4IG9uIGVtaXQgc29cbiAgICAgIC8vIGV2ZXJ5IHBhdGggaXMgdmFsaWQgcmVsYXRpdmUgdG8gdGhlIG1hbmlmZXN0J3MgZGVjbGFyZWRcbiAgICAgIC8vIGBwYXRoUm9vdGAgKGFyY2hpdmUgcm9vdCBmb3IgdGFyLnpzdDsgd29ya3NwYWNlIHJvb3QgZm9yIHBsYWluXG4gICAgICAvLyBKU09OTCDigJQgaS5lLiwgYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgY29uc3Qgc3RyaXBXcyA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBpZiAoIXApIHJldHVybiBwO1xuICAgICAgICAvLyBTdHJpcCBleGFjdGx5IG9uZSBsZWFkaW5nIGA8d29ya3NwYWNlPi9gIHNlZ21lbnQgaWYgcHJlc2VudC5cbiAgICAgICAgY29uc3Qgd3NQcmVmaXggPSBgJHthY3RpdmVXc30vYDtcbiAgICAgICAgcmV0dXJuIHAuc3RhcnRzV2l0aCh3c1ByZWZpeCkgPyBwLnNsaWNlKHdzUHJlZml4Lmxlbmd0aCkgOiBwO1xuICAgICAgfTtcbiAgICAgIG91dC5zY3JlZW5zaG90ID0gey4uLmUuc2NyZWVuc2hvdH07XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZWxlbWVudCkgb3V0LnNjcmVlbnNob3QuZWxlbWVudCA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QuZWxlbWVudCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QuZ3JvdXApIG91dC5zY3JlZW5zaG90Lmdyb3VwID0gc3RyaXBXcyhvdXQuc2NyZWVuc2hvdC5ncm91cCk7XG4gICAgICBpZiAob3V0LnNjcmVlbnNob3QucGFnZSkgb3V0LnNjcmVlbnNob3QucGFnZSA9IHN0cmlwV3Mob3V0LnNjcmVlbnNob3QucGFnZSk7XG4gICAgfVxuICAgIC8vIFByb21vdGUgcnVudGltZS9iZWhhdmlvciBzaWduYWxzIHRvIHRvcC1sZXZlbC4gVGhlc2UgYXJlIHByaW1hcnlcbiAgICAvLyBzaWduYWwgZm9yIHRyaWFnZSAoZXZlbnRzIHRlbGxzIFwid2hpY2ggaGFuZGxlciByYW5cIiwgYmVoYXZpb3JBdHRyc1xuICAgIC8vIHRlbGxzIFwid2hhdCBzZXJ2ZXItcmVuZGVyZWQgYmluZGluZyBkb2VzIHRoaXMgZmlyZVwiLCBjYW52YXNDbGlja1xuICAgIC8vIHRlbGxzIFwid2hlcmUgb24gdGhlIGNoYXJ0IHdhcyBjbGlja2VkXCIsIGVkaXRvciB0ZWxscyBcIndoaWNoXG4gICAgLy8gcmljaC10ZXh0IGxpYnJhcnkgd3JhcHMgdGhpc1wiLCBkb21NdXRhdGlvbnMgdGVsbHMgXCJ3aGF0IGNoYW5nZWRcbiAgICAvLyBiZWZvcmUgdGhlIGNsaWNrXCIsIGlzQW5pbWF0aW5nIHdhcm5zIGFib3V0IHRyYW5zaWVudCBzdGF0ZSkuXG4gICAgaWYgKGUuZXZlbnRzICYmIE9iamVjdC5rZXlzKGUuZXZlbnRzKS5sZW5ndGgpIG91dC5ldmVudHMgPSBlLmV2ZW50cztcbiAgICBpZiAoZS5iZWhhdmlvckF0dHJzICYmIE9iamVjdC5rZXlzKGUuYmVoYXZpb3JBdHRycykubGVuZ3RoKSBvdXQuYmVoYXZpb3JBdHRycyA9IGUuYmVoYXZpb3JBdHRycztcbiAgICBpZiAoZS5jYW52YXNDbGljaykgb3V0LmNhbnZhc0NsaWNrID0gZS5jYW52YXNDbGljaztcbiAgICBpZiAoZS5lZGl0b3IpIG91dC5lZGl0b3IgPSBlLmVkaXRvcjtcbiAgICBpZiAoZS5pc0FuaW1hdGluZykgb3V0LmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICBpZiAoZS5zaGFkb3dIb3N0KSBvdXQuc2hhZG93SG9zdCA9IGUuc2hhZG93SG9zdDtcbiAgICBpZiAoZS5yZW5kZXJlZFRleHQgIT09IHVuZGVmaW5lZCkgb3V0LnJlbmRlcmVkVGV4dCA9IGUucmVuZGVyZWRUZXh0O1xuICAgIGlmIChlLnRydW5jYXRlZCAmJiBPYmplY3Qua2V5cyhlLnRydW5jYXRlZCkubGVuZ3RoKSBvdXQudHJ1bmNhdGVkID0gZS50cnVuY2F0ZWQ7XG4gICAgaWYgKGUuc2Vzc2lvbklkKSBvdXQuc2Vzc2lvbklkID0gZS5zZXNzaW9uSWQ7XG4gICAgaWYgKGUuZG9tTXV0YXRpb25zICYmIGUuZG9tTXV0YXRpb25zLmxlbmd0aCkgb3V0LmRvbU11dGF0aW9ucyA9IGUuZG9tTXV0YXRpb25zO1xuXG4gICAgLy8gX2F1ZGl0OiBkZXRlY3Rpb24gY2hhaW4gJiBkaWFnbm9zdGljIHNoYXBlLlxuICAgIC8vIFJFQURNRSBjbGFpbWVkIGBfYXVkaXQuYW5jZXN0b3JzYCBhbmQgYF9hdWRpdC5jb21wb25lbnRSb290YCB3ZXJlXG4gICAgLy8gYWx3YXlzIHByZXNlbnQsIGJ1dCB0aGUgc2xpbSBlbWl0IGRyb3BwZWQgdGhlbSB3aGVuZXZlclxuICAgIC8vIGBtaW5pZnk6IHRydWVgLiBUaGUgZml4OiBlbWl0IGV2ZXJ5IGRlY2xhcmVkIGBfYXVkaXRgIGZpZWxkXG4gICAgLy8gd2hlbmV2ZXIgdGhlIHNvdXJjZSBkYXRhIGV4aXN0cywgYW5kIGxldFxuICAgIC8vIGBtaW5pZnlgIHNsaW0gT05MWSB0aGUgaGlnaC12b2x1bWUgYmxvY2tzIChtYXRjaGVkUnVsZXMsXG4gICAgLy8gcHNldWRvRWxlbWVudHMpLiBTbWFsbCBzdHJ1Y3R1cmFsIG1ldGFkYXRhIChhbmNlc3RvcnMsXG4gICAgLy8gY29tcG9uZW50Um9vdCwgdmlld3BvcnQpIHN1cnZpdmVzIG1pbmlmeSBzbyB0aGUgc2NoZW1hIGNsYWltc1xuICAgIC8vIHN0YXkgaG9uZXN0LlxuICAgIGNvbnN0IGF1ZGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGUuYW5jZXN0b3JzICYmIGUuYW5jZXN0b3JzLmxlbmd0aCkgYXVkaXQuYW5jZXN0b3JzID0gZS5hbmNlc3RvcnM7XG4gICAgaWYgKGUuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBhdWRpdC5jb21wb25lbnRSb290ID0gZS5jb21wb25lbnRSb290O1xuICAgIGlmIChlLmluU2hhZG93RE9NKSBhdWRpdC5pblNoYWRvd0RPTSA9IHRydWU7XG4gICAgaWYgKGUucHNldWRvRWxlbWVudHMgJiYgT2JqZWN0LmtleXMoZS5wc2V1ZG9FbGVtZW50cykubGVuZ3RoICYmICFtaW5pZnkpIGF1ZGl0LnBzZXVkb0VsZW1lbnRzID0gZS5wc2V1ZG9FbGVtZW50cztcbiAgICBpZiAoaW5jbHVkZU1hdGNoZWQgJiYgZS5tYXRjaGVkUnVsZXMgJiYgZS5tYXRjaGVkUnVsZXMubGVuZ3RoKSB7XG4gICAgICBhdWRpdC5tYXRjaGVkUnVsZXMgPSBtaW5pZnlcbiAgICAgICAgPyBlLm1hdGNoZWRSdWxlcy5tYXAoKHIpID0+IHtcbiAgICAgICAgICBjb25zdCByMjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtzZWxlY3Rvcjogci5zZWxlY3Rvcn07XG4gICAgICAgICAgaWYgKHIuZGVjbGFyYXRpb25zICYmIE9iamVjdC5rZXlzKHIuZGVjbGFyYXRpb25zKS5sZW5ndGgpIHIyLmRlY2xhcmF0aW9ucyA9IHIuZGVjbGFyYXRpb25zO1xuICAgICAgICAgIGlmIChyLm1lZGlhKSByMi5tZWRpYSA9IHIubWVkaWE7XG4gICAgICAgICAgcmV0dXJuIHIyO1xuICAgICAgICB9KVxuICAgICAgICA6IGUubWF0Y2hlZFJ1bGVzO1xuICAgIH1cbiAgICBpZiAoZS52aWV3cG9ydCkgYXVkaXQudmlld3BvcnQgPSBlLnZpZXdwb3J0O1xuICAgIGlmIChPYmplY3Qua2V5cyhhdWRpdCkubGVuZ3RoKSBvdXQuX2F1ZGl0ID0gYXVkaXQ7XG5cbiAgICAvLyBHcm91cCBoZWFkIGxpbmthZ2UuIFByZXZpb3VzbHkgdGhlIGdyb3VwIGhlYWQncyBgZW50cnkuZ3JvdXBgXG4gICAgLy8gY2FycmllZCBmdWxsIG5lc3RlZCBlbnRyeSBvYmplY3RzLlxuICAgIC8vIFRoYXQgbWFkZSBEdWNrREIgam9pbnMgdWdseSBhbmQgYnJva2UgdGhlIHJ1bGUgdGhhdCBldmVyeVxuICAgIC8vIHNlbGVjdG9yIHNob3VsZCBiZSBhIHRvcC1sZXZlbCByb3cuIFdlIG5vdyBlbWl0OlxuICAgIC8vICAg4oCiIG9uIHRoZSBncm91cCBoZWFkOiBgZ3JvdXBNZW1iZXJVaWRzOiBbdWlkLCB1aWQsIC4uLl1gIChqdXN0IElEcylcbiAgICAvLyAgIOKAoiBlYWNoIG1lbWJlciBhcyBpdHMgb3duIHRvcC1sZXZlbCBzbGltIHJvdyB3aXRoIGBncm91cFVpZGBcbiAgICAvLyAgICAgcG9pbnRpbmcgYmFjayBhdCB0aGUgaGVhZCAoaGFuZGxlZCBpbiBgYnVpbGRTbGltYCBmbHVzaCBsb2dpYykuXG4gICAgaWYgKG9wdHMuaW5jbHVkZUdyb3VwICYmIGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgIG91dC5ncm91cE1lbWJlclVpZHMgPSBlLmdyb3VwLm1hcCgoZykgPT4gZy51aWQpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG4gICAgaWYgKG9wdHMuZ3JvdXBVaWQpIG91dC5ncm91cFVpZCA9IG9wdHMuZ3JvdXBVaWQ7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICAvLyDilIDilIDilIAgU2hhcmVkIFwic2xpbSBkYXRhXCIgcGlwZWxpbmUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIEpTT05MIHJlbmRlcnMgb2ZmIHRoaXMgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uLiAoTWFya2Rvd24gdXNlZCB0b1xuICAvLyBzaGFyZSBpdDsgdGhlIE1hcmtkb3duIGV4cG9ydCB3YXMgcmV0aXJlZCBpbiBmYXZvciBvZiBKU09OTC1vbmx5LilcbiAgLy9cbiAgLy8gdjIgZGlmZmVyZW5jZXMgdnMgdjE6XG4gIC8vICAg4oCiIFNlbGVjdG9yIGxpbmVzIGhhdmUgZXhwbGljaXQgYHR5cGU6ICdzZWxlY3RvcidgIGFuZCBgdjogMmAuXG4gIC8vICAg4oCiIF9hdWRpdCBuZXN0cyBkZXRlY3Rpb24gLyBkZWJ1ZyBmaWVsZHMgKGFuY2VzdG9ycywgY29tcG9uZW50Um9vdCwg4oCmKS5cbiAgLy8gICDigKIgRmVlZGJhY2sgZW1pdHMgYXMgc3RhbmRhbG9uZSBge3R5cGU6J2ZlZWRiYWNrJywgcGFyZW50VWlkLCDigKZ9YCBsaW5lc1xuICAvLyAgICAgUExVUyBidW5kbGVkIGBmZWVkYmFja2AgYXJyYXlzIG9uIHNlbGVjdG9ycyAoc28gb2xkIHNpbmdsZS1saW5lXG4gIC8vICAgICByZWFkZXJzIHN0aWxsIHNlZSB0aGVtIGFkamFjZW50KS5cbiAgLy8gICDigKIgQSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgY2FycmllcyB3b3Jrc3BhY2UgKyBjb3VudHMgKyBmaWxlbmFtZS5cbiAgdHlwZSBTbGltUGFnZSA9IHt2OiAyOyB0eXBlOiAncGFnZSc7IHRzOiBzdHJpbmc7IHVybDogc3RyaW5nOyB0aXRsZT86IHN0cmluZzsgdmlld3BvcnQ/OiBWaWV3cG9ydDsgdG9rZW5zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgdXNlckFnZW50Pzogc3RyaW5nOyBsYW5nPzogc3RyaW5nOyBnaXRDb250ZXh0Pzoge2NvbW1pdD86IHN0cmluZzsgYnJhbmNoPzogc3RyaW5nOyBidWlsZD86IHN0cmluZ307IHJvdXRlPzogYW55OyBzdGF0ZT86IGFueTsgc2Vzc2lvbklkPzogc3RyaW5nOyBzbmFwc2hvdD86IFBhZ2VTbmFwc2hvdH07XG4gIC8vIFNldmVyaXR5IHdhcyByZW1vdmVkIGZyb20gdGhlIFVJICgyMDI2LTA1KS4gVG9sZXJhbnQgcmVhZGVycyBtYXkgc3RpbGxcbiAgLy8gc2VlIGBzZXZlcml0eWAgb24gbGVnYWN5IEpTT05MIOKAlCBkZW5vcm1hbGl6ZUVudHJ5IHByZXNlcnZlcyBpdCBvblxuICAvLyBGZWVkYmFja01lc3NhZ2Ugc28gcmUtZXhwb3J0IHJvdW5kLXRyaXBzLCBidXQgbmV3IHNlc3Npb25zIG5ldmVyIHNldFxuICAvLyBpdCBhbmQgd2UgZG9uJ3QgZW1pdCBpdCBoZXJlLiBLZWVwIHRoZSBmaWVsZCBvZmYgU2xpbUZlZWRiYWNrIHNvIG5ld1xuICAvLyBleHBvcnRzIHN0YXkgY2xlYW4uXG4gIC8vIGB0YWdzYCBpcyBhbHdheXMgZW1pdHRlZCAoZGVmYXVsdCBlbXB0eSBhcnJheSkgc28gRHVja0RCIHNjaGVtYVxuICAvLyBpbmZlcmVuY2UgYWx3YXlzIHNlZXMgdGhlIGNvbHVtbi5cbiAgdHlwZSBTbGltRmVlZGJhY2sgPSB7djogMjsgdHlwZTogJ2ZlZWRiYWNrJzsgdWlkOiBzdHJpbmc7IHRzOiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgcGFyZW50VWlkPzogc3RyaW5nOyBkZXRhY2hlZD86IGJvb2xlYW47IHRhZ3M6IHN0cmluZ1tdOyBpc1Rlc3REYXRhPzogYm9vbGVhbn07XG4gIC8vIENoZWFwIHRlc3QtZGF0YSBzbmlmZjogbWF0Y2hlcyBzdHJpbmdzIHRoZSB1c2VyIHR5cGVzIHdoaWxlIHNtb2tlLVxuICAvLyB0ZXN0aW5nIHRoZSBleHRlbnNpb24gKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIiwgXCJsb3JlbSBpcHN1bVwiLFxuICAvLyBcInBsYWNlaG9sZGVyXCIsIG9yIGFueSBwaHJhc2Ugb2J2aW91c2x5IHN0dWJiZWQtb3V0KS4gRmFsc2UgcG9zaXRpdmVzXG4gIC8vIGhlcmUgYXJlIHJlY292ZXJhYmxlIOKAlCB0aGUgY29uc3VtZXIgY2FuIGlnbm9yZSB0aGUgZmxhZyDigJQgYnV0XG4gIC8vIGV4Y2x1ZGluZyByZWFsIGZlZWRiYWNrIHdvdWxkIG5vdCBiZSwgc28gd2Uga2VlcCB0aGUgcmVnZXggbmFycm93LlxuICBjb25zdCBURVNUX0RBVEFfUkUgPSAvXih0ZXN0fGFzZGZ8cXdlcnxmb298YmFyfGJhenxsb3JlbXxwbGFjZWhvbGRlcnx0b2RvfHh7Myx9fGhlbGxvIHdvcmxkfHNhbXBsZXxkdW1teXxzb21ldGhpbmd8YW55dGhpbmd8aWdub3JlIG1lfHdpcHx0YmR8blxcL2F8aGkpXFxiL2k7XG4gIGNvbnN0IGxvb2tzTGlrZVRlc3REYXRhID0gKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHQgPSB0ZXh0LnRyaW0oKTtcbiAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoVEVTVF9EQVRBX1JFLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIGlmICgvdGVzdCBmZWVkYmFjay9pLnRlc3QodCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgdHlwZSBTbGltU2VsZWN0b3IgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+ICYge3Y6IDI7IHR5cGU6ICdzZWxlY3Rvcic7IG46IG51bWJlcjsgc2VsZWN0b3I6IHN0cmluZzsgZmVlZGJhY2s/OiBzdHJpbmdbXX07XG4gIHR5cGUgU2xpbUxpbmUgPSBTbGltUGFnZSB8IFNsaW1GZWVkYmFjayB8IFNsaW1TZWxlY3RvcjtcbiAgY29uc3QgYnVpbGRTbGltID0gKCk6IFNsaW1MaW5lW10gPT4ge1xuICAgIGNvbnN0IGxpbmVzOiBTbGltTGluZVtdID0gW107XG4gICAgLy8gUHJlLWNvbXB1dGUgdmlzdWFsT3JkZXIgKHRvcOKGkmJvdHRvbSwgbGVmdOKGknJpZ2h0KSBmb3IgZXZlcnlcbiAgICAvLyBzZWxlY3RvciBtZXNzYWdlLiBUaGUgcHJldmlvdXMgc2luZ2xlIGBuYCBmaWVsZCBjb25mbGF0ZWRcbiAgICAvLyBjYXB0dXJlIG9yZGVyLCBKU09OTCBzdHJlYW0gb3JkZXIsXG4gICAgLy8gdmlzdWFsIG9yZGVyLCBhbmQgZGlzcGxheSBsYWJlbC4gV2Ugbm93IGVtaXQgZm91ciBvcnRob2dvbmFsXG4gICAgLy8gZmllbGRzIGFuZCBkb2N1bWVudCBlYWNoOlxuICAgIC8vICAg4oCiIGV2ZW50SW5kZXggICDigJQgbW9ub3RvbmljIHBvc2l0aW9uIGluIHRoZSBKU09OTCBzdHJlYW1cbiAgICAvLyAgIOKAoiBjYXB0dXJlSW5kZXgg4oCUIHRoZSBvcmlnaW5hbCBgbmAgKGNhcHR1cmUgc2VxdWVuY2UpXG4gICAgLy8gICDigKIgdmlzdWFsT3JkZXIgIOKAlCBzb3J0IGJ5IHJlY3QueSBhc2MsIHJlY3QueCBhc2NcbiAgICAvLyAgIOKAoiBkaXNwbGF5TGFiZWwg4oCUIHRoZSBodW1hbi1mYWNpbmcgbnVtYmVyIHNob3duIGluIHRoZSBzaWRlYmFyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIChjdXJyZW50bHkgbWlycm9ycyBjYXB0dXJlSW5kZXg7IGNhbiBkcmlmdCBpZlxuICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGUgc2lkZWJhciBhZG9wdHMgYSBkaWZmZXJlbnQgbGFiZWwgc2NoZW1lKS5cbiAgICBjb25zdCB2aXN1YWxSYW5rID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBjb25zdCBzZWxzID0gbWVzc2FnZXNcbiAgICAgIC5maWx0ZXIoKG0pOiBtIGlzIFNlbGVjdG9yTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdzZWxlY3RvcicpXG4gICAgICAuc2xpY2UoKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYXIgPSBhLmVudHJ5LnJlY3Q7IGNvbnN0IGJyID0gYi5lbnRyeS5yZWN0O1xuICAgICAgICBpZiAoIWFyIHx8ICFicikgcmV0dXJuIDA7XG4gICAgICAgIGlmIChhci55ICE9PSBici55KSByZXR1cm4gYXIueSAtIGJyLnk7XG4gICAgICAgIHJldHVybiBhci54IC0gYnIueDtcbiAgICAgIH0pO1xuICAgIHNlbHMuZm9yRWFjaCgobSwgaSkgPT4gdmlzdWFsUmFuay5zZXQobS5pZCwgaSArIDEpKTtcbiAgICBsZXQgcGVuZGluZ1NlbDogU2VsZWN0b3JNZXNzYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgLy8gV2UgY29sbGVjdCBib3RoIHRoZSBidW5kbGVkIHN0cmluZyBhcnJheSAoZm9yIHYxLWZyaWVuZGx5IHJlYWRlcnMpIGFuZFxuICAgIC8vIHRoZSByaWNoIG9iamVjdHMgKGZvciB2MiBzdGFuZGFsb25lIGxpbmVzKS5cbiAgICBsZXQgcGVuZGluZ0ZiU3RyaW5nczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcGVuZGluZ0ZiUmljaDogU2xpbUZlZWRiYWNrW10gPSBbXTtcbiAgICBjb25zdCBmbHVzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcGVuZGluZ1NlbCkgcmV0dXJuO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IGxpbmVzLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCB2aXN1YWxPcmRlciA9IHZpc3VhbFJhbmsuZ2V0KHBlbmRpbmdTZWwuaWQpO1xuICAgICAgY29uc3Qgb3V0OiBhbnkgPSBzbGltRW50cnkocGVuZGluZ1NlbC5lbnRyeSwge2luY2x1ZGVHcm91cDogdHJ1ZSwgZXZlbnRJbmRleCwgdmlzdWFsT3JkZXJ9KTtcbiAgICAgIGlmIChwZW5kaW5nRmJTdHJpbmdzLmxlbmd0aCkgb3V0LmZlZWRiYWNrID0gWy4uLnBlbmRpbmdGYlN0cmluZ3NdO1xuICAgICAgbGluZXMucHVzaChvdXQgYXMgU2xpbUxpbmUpO1xuICAgICAgLy8gR3JvdXAgZmxhdG5lc3MgKGJ1ZyAjOSkuIEVtaXQgZWFjaCBncm91cCBtZW1iZXIgYXMgaXRzIG93blxuICAgICAgLy8gdG9wLWxldmVsIHNsaW0gcm93IHJpZ2h0IGFmdGVyIHRoZSBoZWFkLCB3aXRoIGBncm91cFVpZGBcbiAgICAgIC8vIGxpbmtpbmcgYmFjay4gVGhpcyBsZXRzIER1Y2tEQiAvIFNRTCBxdWVyaWVzIHRyZWF0IGdyb3VwXG4gICAgICAvLyBtZW1iZXJzIGFzIGZpcnN0LWNsYXNzIHNlbGVjdG9yIHJvd3Mgd2l0aG91dCBkZXNjZW5kaW5nIGludG9cbiAgICAgIC8vIG5lc3RlZCBvYmplY3RzLlxuICAgICAgY29uc3QgZ3JvdXBNZW1iZXJzID0gcGVuZGluZ1NlbC5lbnRyeS5ncm91cCA/PyBbXTtcbiAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGdyb3VwTWVtYmVycykge1xuICAgICAgICBjb25zdCBtRXZlbnQgPSBsaW5lcy5sZW5ndGggKyAxO1xuICAgICAgICBjb25zdCBtZW1iZXJSb3c6IGFueSA9IHNsaW1FbnRyeShtZW1iZXIsIHtpbmNsdWRlR3JvdXA6IGZhbHNlLCBldmVudEluZGV4OiBtRXZlbnQsIGdyb3VwVWlkOiBwZW5kaW5nU2VsLmVudHJ5LnVpZH0pO1xuICAgICAgICBsaW5lcy5wdXNoKG1lbWJlclJvdyBhcyBTbGltTGluZSk7XG4gICAgICB9XG4gICAgICAvLyBFbWl0IGVhY2ggc3RhbmRhbG9uZSBmZWVkYmFjayBsaW5lIHJpZ2h0IGFmdGVyIHRoZSBzZWxlY3RvcihzKS5cbiAgICAgIGZvciAoY29uc3QgZmIgb2YgcGVuZGluZ0ZiUmljaCkgbGluZXMucHVzaChmYik7XG4gICAgICBwZW5kaW5nU2VsID0gbnVsbDtcbiAgICAgIHBlbmRpbmdGYlN0cmluZ3MgPSBbXTtcbiAgICAgIHBlbmRpbmdGYlJpY2ggPSBbXTtcbiAgICB9O1xuICAgIC8vIFJlb3JkZXIgZm9yIGV4cG9ydCBvbmx5IOKAlCBzaWRlYmFyIGtlZXBzIGNhcHR1cmUgb3JkZXIsIHRoZVxuICAgIC8vIGVtaXR0ZWQgSlNPTkwgcmVhZHMgdG9w4oaSYm90dG9tLCBsZWZ04oaScmlnaHQgd2l0aGluIGVhY2ggcGFnZS5cbiAgICAvLyBGZWVkYmFjayByb3dzIHN0YXkgYXR0YWNoZWQgdG8gdGhlaXIgcHJlY2VkaW5nIHNlbGVjdG9yIHZpYSB0aGVcbiAgICAvLyBgcmVvcmRlckZvckV4cG9ydGAgaGVscGVyLCBzbyB0aHJlYWRpbmcgaXMgcHJlc2VydmVkIHRocm91Z2hcbiAgICAvLyB0aGUgcmVhcnJhbmdlbWVudC5cbiAgICBjb25zdCBleHBvcnRPcmRlcmVkID0gcmVvcmRlckZvckV4cG9ydChtZXNzYWdlcyk7XG4gICAgZm9yIChjb25zdCBtIG9mIGV4cG9ydE9yZGVyZWQpIHtcbiAgICAgIGlmIChtLnR5cGUgPT09ICdwYWdlJykge1xuICAgICAgICBmbHVzaCgpO1xuICAgICAgICBjb25zdCBzbGltOiBTbGltUGFnZSA9IHt2OiAyLCB0eXBlOiAncGFnZScsIHRzOiBtLnRzLCB1cmw6IG0udXJsfTtcbiAgICAgICAgaWYgKG0udGl0bGUgIT09IHVuZGVmaW5lZCkgc2xpbS50aXRsZSA9IG0udGl0bGU7XG4gICAgICAgIGlmIChtLnZpZXdwb3J0KSBzbGltLnZpZXdwb3J0ID0gbS52aWV3cG9ydDtcbiAgICAgICAgaWYgKCFwcmVmcy5taW5pZnkgJiYgbS50b2tlbnMpIHNsaW0udG9rZW5zID0gbS50b2tlbnM7XG4gICAgICAgIGlmIChtLnVzZXJBZ2VudCkgc2xpbS51c2VyQWdlbnQgPSBtLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKG0ubGFuZykgc2xpbS5sYW5nID0gbS5sYW5nO1xuICAgICAgICBpZiAobS5naXRDb250ZXh0KSBzbGltLmdpdENvbnRleHQgPSBtLmdpdENvbnRleHQ7XG4gICAgICAgIGlmIChtLnJvdXRlKSBzbGltLnJvdXRlID0gbS5yb3V0ZTtcbiAgICAgICAgaWYgKG0uc3RhdGUpIHNsaW0uc3RhdGUgPSBtLnN0YXRlO1xuICAgICAgICBpZiAobS5zZXNzaW9uSWQpIHNsaW0uc2Vzc2lvbklkID0gbS5zZXNzaW9uSWQ7XG4gICAgICAgIC8vIEZ1bGwtcGFnZSBzbmFwc2hvdCAodmlld3BvcnQsIHNjcm9sbCBleHRlbnRzLCBkcHIsIGxhbmcsIHNjcmVlbnNob3QpXG4gICAgICAgIC8vIGNhcHR1cmVkIGZvciB0aGlzIFVSTC4gUGFydCBvZiB0aGUgZXhwb3J0IGRlbGl2ZXJhYmxlIHNvIGEgZG93bnN0cmVhbVxuICAgICAgICAvLyBhZ2VudCBoYXMgd2hvbGUtcGFnZSBjb250ZXh0LCBub3QganVzdCBlbGVtZW50IGNyb3BzLlxuICAgICAgICBjb25zdCBzbmFwID0gKG0gYXMgUGFnZU1lc3NhZ2UgJiB7c25hcHNob3Q/OiBQYWdlU25hcHNob3R9KS5zbmFwc2hvdDtcbiAgICAgICAgaWYgKHNuYXApIHNsaW0uc25hcHNob3QgPSBzbmFwO1xuICAgICAgICBsaW5lcy5wdXNoKHNsaW0pO1xuICAgICAgfSBlbHNlIGlmIChtLnR5cGUgPT09ICdzZWxlY3RvcicpIHsgZmx1c2goKTsgcGVuZGluZ1NlbCA9IG07IH1cbiAgICAgIGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICAvLyBBbHdheXMgaW5jbHVkZSBgdGFnczogW11gIChldmVuIHdoZW4gZW1wdHkpIHNvIER1Y2tEQidzIHNjaGVtYVxuICAgICAgICAvLyBpbmZlcmVuY2UgcGlja3MgdGhlIGNvbHVtbiB1cC5cbiAgICAgICAgLy8gYHVpZGAgaXMgdGhlIG1lc3NhZ2UncyBzdGFibGUgaWQ6IFBScyAvIHJlcGFpciByZXBvcnRzIG5lZWRcbiAgICAgICAgLy8gYSBzdGFibGUgcGVyLWZlZWRiYWNrIGhhbmRsZSwgbm90IGp1c3QgcGFyZW50VWlkLlxuICAgICAgICBjb25zdCByaWNoOiBTbGltRmVlZGJhY2sgPSB7djogMiwgdHlwZTogJ2ZlZWRiYWNrJywgdWlkOiBtLmlkLCB0czogbS50cywgdGV4dDogbS50ZXh0LCB0YWdzOiBtLnRhZ3MgPz8gW119O1xuICAgICAgICAvLyAoc2V2ZXJpdHkgcmVtb3ZlZCAyMDI2LTA1IOKAlCBvbGQgSlNPTkxzIG1heSBzdGlsbCBjb250YWluIGl0XG4gICAgICAgIC8vIG9uIHRoZSByZWFkIHNpZGUsIGJ1dCB3ZSBubyBsb25nZXIgZW1pdCBpdCBvbiB3cml0ZS4pXG4gICAgICAgIC8vIEhldXJpc3RpYyBmbGFnIGZvciBzdHViLWxvb2tpbmcgZmVlZGJhY2sgKFwidGVzdFwiLCBcImFzZGZcIiwgXCJmb29cIixcbiAgICAgICAgLy8gXCJIb3dkeSAsIHRlc3QgZmVlZGJhY2sgaGVyZVwiLCBldGMpLiBMZXRzIGEgZG93bnN0cmVhbSBjb25zdW1lclxuICAgICAgICAvLyBmaWx0ZXIgcG9sbHV0aW9uIGZyb20gcmVhbCBpbnRlbnQgd2l0aG91dCBtYW51YWwgY2xlYW51cC5cbiAgICAgICAgaWYgKGxvb2tzTGlrZVRlc3REYXRhKG0udGV4dCkpIHJpY2guaXNUZXN0RGF0YSA9IHRydWU7XG4gICAgICAgIC8vIEEgZGV0YWNoZWQgY29tbWVudCBuZXZlciBhZG9wdHMgdGhlIHBlbmRpbmcgc2VsZWN0b3IgdmlhXG4gICAgICAgIC8vIGFkamFjZW5jeSDigJQgdGhlIHVzZXIgZXhwbGljaXRseSBkaXNhc3NvY2lhdGVkIGl0LiBUaGUgZmxhZyBpc1xuICAgICAgICAvLyBlbWl0dGVkIHNvIGltcG9ydCByb3VuZC10cmlwcyBkb24ndCByZS1hZG9wdCBieSBhZGphY2VuY3kgZWl0aGVyLlxuICAgICAgICBpZiAobS5kZXRhY2hlZCkgcmljaC5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgIGlmIChwZW5kaW5nU2VsICYmICFtLmRldGFjaGVkKSB7XG4gICAgICAgICAgcmljaC5wYXJlbnRVaWQgPSBtLnBhcmVudFVpZCA/PyBwZW5kaW5nU2VsLmVudHJ5LnVpZDtcbiAgICAgICAgICBwZW5kaW5nRmJTdHJpbmdzLnB1c2gobS50ZXh0KTtcbiAgICAgICAgICBwZW5kaW5nRmJSaWNoLnB1c2gocmljaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG0ucGFyZW50VWlkKSByaWNoLnBhcmVudFVpZCA9IG0ucGFyZW50VWlkO1xuICAgICAgICAgIGxpbmVzLnB1c2gocmljaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZmx1c2goKTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH07XG4gIC8vIEJ1aWxkIHRoZSBsZWFkaW5nIG1hbmlmZXN0IGxpbmUgb2YgdGhlIEpTT05MIGV4cG9ydC4gVGhlXG4gIC8vIG1hbmlmZXN0IGNhcnJpZXMgdGhlIGV4cG9ydCBmaWxlbmFtZSArIHdvcmtzcGFjZSArIGhvc3QocykgKyBjb3VudHMgc29cbiAgLy8gYSBkb3duc3RyZWFtIExMTSBjYW4gcmVzeW5jIHRoZSBmaWxlIHdpdGggaXRzIHdvcmtzcGFjZSBhbmQgZ3JlcCBmb3JcbiAgLy8gZHVwbGljYXRlcyBhY3Jvc3MgZXhwb3J0cy5cbiAgY29uc3QgYnVpbGRNYW5pZmVzdCA9IChmaWxlbmFtZTogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSwgb3B0czoge25vd0lzbz86IHN0cmluZzsgYnVuZGxlSWQ/OiBzdHJpbmd9ID0ge30pOiBFeHBvcnRNYW5pZmVzdCA9PiB7XG4gICAgbGV0IG5TZWwgPSAwOyBsZXQgbkZiID0gMDsgbGV0IG5QZyA9IDA7XG4gICAgbGV0IG5Hcm91cE1lbWJlcnMgPSAwO1xuICAgIGxldCBuRmVlZGJhY2tCZWFyaW5nID0gMDtcbiAgICBsZXQgbk1pc3NpbmdTaG90ID0gMDtcbiAgICBsZXQgbkVsZW1lbnRTaG90cyA9IDA7XG4gICAgbGV0IG5Hcm91cFNob3RzID0gMDtcbiAgICBsZXQgblBhZ2VTaG90cyA9IDA7XG4gICAgbGV0IG5PcnBoYW5lZEZiID0gMDtcbiAgICBjb25zdCBzZWxlY3RvclVpZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgLy8gRmlyc3QgcGFzczogY29sbGVjdCB1aWRzICsgcGVyLXNlbGVjdG9yIGZlZWRiYWNrIHByZXNlbmNlLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykge1xuICAgICAgICBuU2VsKys7XG4gICAgICAgIHNlbGVjdG9yVWlkcy5hZGQobS5lbnRyeS51aWQpO1xuICAgICAgICBpZiAobS5lbnRyeS5ncm91cD8ubGVuZ3RoKSBuR3JvdXBNZW1iZXJzICs9IG0uZW50cnkuZ3JvdXAubGVuZ3RoO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50KSBuRWxlbWVudFNob3RzKys7XG4gICAgICAgIGlmIChtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSBuR3JvdXBTaG90cysrO1xuICAgICAgICBpZiAobS5lbnRyeS5zY3JlZW5zaG90Py5wYWdlKSBuUGFnZVNob3RzKys7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ2ZlZWRiYWNrJykge1xuICAgICAgICBuRmIrKztcbiAgICAgICAgaWYgKG0ucGFyZW50VWlkKSBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzLmFkZChtLnBhcmVudFVpZCk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gJ3BhZ2UnKSBuUGcrKztcbiAgICB9XG4gICAgLy8gU2Vjb25kIHBhc3M6IGZlZWRiYWNrLWJlYXJpbmcgc2VsZWN0b3JzICsgb3JwaGFuZWQgZmVlZGJhY2sgK1xuICAgIC8vIHNlbGVjdG9ycyB0aGF0IHNob3VsZCBoYXZlIGEgc2hvdCBidXQgZG9uJ3QuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlID09PSAnc2VsZWN0b3InICYmIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMuaGFzKG0uZW50cnkudWlkKSkge1xuICAgICAgICBuRmVlZGJhY2tCZWFyaW5nKys7XG4gICAgICAgIGlmICghbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50ICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSBuTWlzc2luZ1Nob3QrKztcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBmYlVpZCBvZiBmZWVkYmFja1BhcmVudFNlbGVjdG9ySWRzKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yVWlkcy5oYXMoZmJVaWQpKSBuT3JwaGFuZWRGYisrO1xuICAgIH1cbiAgICBjb25zdCBub3dJc28gPSBvcHRzLm5vd0lzbyA/PyBleHBvcnROb3dJc28oKTtcbiAgICBjb25zdCBvdXQ6IEV4cG9ydE1hbmlmZXN0ID0ge1xuICAgICAgdjogMiwgdHlwZTogJ21hbmlmZXN0JywgdG9vbDogJ3BpbmNoZ3JhYicsXG4gICAgICB0czogbm93SXNvLFxuICAgICAgZ2VuZXJhdGVkOiBEYXRlLnBhcnNlKG5vd0lzbyksXG4gICAgICB3b3Jrc3BhY2U6IGFjdGl2ZVdzLFxuICAgICAgZmlsZW5hbWUsXG4gICAgICBmb3JtYXQsXG4gICAgICBob3N0czogZGlzdGluY3RIb3N0cygpLFxuICAgICAgY291bnRzOiB7XG4gICAgICAgIC8vIFRvdGFsIHNlbGVjdG9yIHJvd3MgdGhlIEpTT05MIHdpbGwgZW1pdCA9IHRvcC1sZXZlbCArIGZsYXRcbiAgICAgICAgLy8gZ3JvdXAgbWVtYmVycy4gVGhpcyBtYXRjaGVzIHdoYXQgYSBkb3duc3RyZWFtXG4gICAgICAgIC8vIGByZWFkX2pzb25fYXV0byguLi4pYCB3b3VsZCBzZWU7IHRoZSBwcmV2aW91cyBiZWhhdmlvciBvZlxuICAgICAgICAvLyByZXBvcnRpbmcgb25seSB0aGUgaW4tbWVtb3J5IHRvcC1sZXZlbCBjb3VudCBjb250cmFkaWN0ZWRcbiAgICAgICAgLy8gdGhlIGFjdHVhbCBzdHJlYW0uXG4gICAgICAgIHNlbGVjdG9yczogblNlbCArIG5Hcm91cE1lbWJlcnMsXG4gICAgICAgIGZlZWRiYWNrOiBuRmIsXG4gICAgICAgIHBhZ2VzOiBuUGcsXG4gICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczogbkZlZWRiYWNrQmVhcmluZyxcbiAgICAgICAgZ3JvdXBNZW1iZXJzOiBuR3JvdXBNZW1iZXJzLFxuICAgICAgICBzY3JlZW5zaG90c0VsZW1lbnQ6IG5FbGVtZW50U2hvdHMsXG4gICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IG5Hcm91cFNob3RzLFxuICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IG5QYWdlU2hvdHMsXG4gICAgICAgIHNlbGVjdG9yc01pc3NpbmdTY3JlZW5zaG90OiBuTWlzc2luZ1Nob3QsXG4gICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IG5PcnBoYW5lZEZiLFxuICAgICAgfSxcbiAgICAgIC8vIFNpbmdsZSBjYW5vbmljYWwgcmVzb2x1dGlvbiBydWxlLiBFdmVyeSBwYXRoIGZpZWxkIGluIHRoZSBKU09OTFxuICAgICAgLy8gKHNjcmVlbnNob3QuZWxlbWVudC9ncm91cC9wYWdlKSBpcyByZWxhdGl2ZSB0byBgcGF0aFJvb3RgOlxuICAgICAgLy8gICDigKIgJ2FyY2hpdmUnOiBmb3IgdGFyLnpzdCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG8gdGhlXG4gICAgICAvLyAgICAgZXh0cmFjdGVkIGFyY2hpdmUgcm9vdCAoZS5nLiBgc2NyZWVuc2hvdHMvZm9vLnBuZ2ApLlxuICAgICAgLy8gICDigKIgJ3dvcmtzcGFjZSc6IGZvciBwbGFpbiBKU09OTCBleHBvcnRzLCBwYXRocyBhcmUgcmVsYXRpdmUgdG9cbiAgICAgIC8vICAgICB0aGUgd29ya3NwYWNlIGRpciAoYERvd25sb2Fkcy8ucGluY2hncmFiLzx3b3Jrc3BhY2U+L2ApLlxuICAgICAgLy8gUmVjZWl2ZXJzIG5vIGxvbmdlciBoYXZlIHRvIGd1ZXNzIHdoaWNoIHBhdGggc2hhcGUgYXBwbGllcy5cbiAgICAgIHBhdGhSb290OiBmb3JtYXQgPT09ICd0YXIuenN0JyA/ICdhcmNoaXZlJyA6ICd3b3Jrc3BhY2UnLFxuICAgIH07XG4gICAgLy8gQ29udGVudC1kZXJpdmVkIGlkZW50aXR5IChTSEEtMjU2IHByZWZpeCBvdmVyIHNsaW0gcm93cyArIHNjcmVlbnNob3RcbiAgICAvLyBuYW1lcykuIFNhbWUgY29udGVudCDihpIgc2FtZSBidW5kbGVJZCDihpIgZG93bnN0cmVhbSB+Ly5waW5jaGdyYWIgc3RhdGVcbiAgICAvLyBrZXlzIHN0YXkgc3RhYmxlIGFjcm9zcyByZS1leHBvcnRzLlxuICAgIGlmIChvcHRzLmJ1bmRsZUlkKSBvdXQuYnVuZGxlSWQgPSBvcHRzLmJ1bmRsZUlkO1xuICAgIC8vIEluZGlyZWN0aW9uIHBvaW50ZXJzIHNvIGEgZG93bnN0cmVhbSBhZ2VudCBrbm93cyB3aGljaCBVSSBza2lsbFxuICAgIC8vIG93bnMgdGhlIHRyaWFnZSBmbG93ICsgd2hpY2ggREVTSUdOLm1kIG93bnMgdGhlIHZpc3VhbCBpZGVudGl0eS5cbiAgICAvL1xuICAgIC8vIGBpbmxpbmU6IHRydWVgIGlzIHNldCBPTkxZIGZvciB0YXIuenN0IGV4cG9ydHMgKHdoZXJlIHRoZSAubWRcbiAgICAvLyBmaWxlcyBhcmUgcGh5c2ljYWxseSBidW5kbGVkIGludG8gdGhlIGFyY2hpdmUpLiBKU09OTC1vbmx5XG4gICAgLy8gZXhwb3J0cyBlbWl0IGBpbmxpbmU6IGZhbHNlYCBwbHVzIHRoZSByZWNlaXZlci1zaWRlIGBwYXRoYCBzb1xuICAgIC8vIGEgY29uc3VtZXIgcGFpcmVkIHdpdGggdGhlIHN0YW5kYWxvbmUgSlNPTkwgY2FuIHJlc29sdmUgdGhlXG4gICAgLy8gcmVmZXJlbmNlZCBmaWxlIG9mZiB0aGVpciBvd24gZmlsZXN5c3RlbS5cbiAgICAvL1xuICAgIC8vIGB0ZW1wbGF0ZTogdHJ1ZWAgZmxhZ3Mgd2hlbiB0aGUgdXNlciBoYXNuJ3QgY3VzdG9taXplZCDigJQgdXNlZnVsXG4gICAgLy8gZm9yIHJlY2VpdmVycyB3aG8gd2FudCB0byBkaXN0aW5ndWlzaCBidW5kbGVkLWRlZmF1bHQgY29udGVudFxuICAgIC8vIGZyb20gdGhlIHVzZXIncyBhY3R1YWwgd29ya2luZyBub3Rlcy5cbiAgICBjb25zdCBpc1RhckJ1bmRsZSA9IGZvcm1hdCA9PT0gJ3Rhci56c3QnO1xuICAgIG91dC5za2lsbCA9IHtcbiAgICAgIG5hbWU6ICdQaW5jaEdyYWInLFxuICAgICAgcGF0aDogcHJlZnMuc2tpbGxQYXRoLFxuICAgICAgaW5saW5lOiBpc1RhckJ1bmRsZSxcbiAgICB9O1xuICAgIGlmIChpc1RhckJ1bmRsZSkgb3V0LnNraWxsLmFyY2hpdmVQYXRoID0gJy5hZ2VudHMvc2tpbGxzL1BpbmNoR3JhYi9TS0lMTC5tZCc7XG4gICAgaWYgKGlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpIG91dC5za2lsbC50ZW1wbGF0ZSA9IHRydWU7XG4gICAgZWxzZSBvdXQuc2tpbGwuY3VzdG9taXplZCA9IHRydWU7XG4gICAgb3V0LmRlc2lnbiA9IHtcbiAgICAgIHBhdGg6IHByZWZzLmRlc2lnblBhdGgsXG4gICAgICBpbmxpbmU6IGlzVGFyQnVuZGxlLFxuICAgIH07XG4gICAgaWYgKGlzVGFyQnVuZGxlKSBvdXQuZGVzaWduLmFyY2hpdmVQYXRoID0gJ0RFU0lHTi5tZCc7XG4gICAgaWYgKGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpKSBvdXQuZGVzaWduLnRlbXBsYXRlID0gdHJ1ZTtcbiAgICBlbHNlIG91dC5kZXNpZ24uY3VzdG9taXplZCA9IHRydWU7XG5cbiAgICAvLyBTZWxmLXJvYXN0IGRpYWdub3N0aWNzLlxuICAgIGNvbnN0IGRpYWdub3N0aWNzOiBFeHBvcnREaWFnbm9zdGljW10gPSBbXTtcbiAgICAvLyBGZWVkYmFjay1iZWFyaW5nIHNlbGVjdG9ycyB3aXRoIG5vIHNjcmVlbnNob3QuXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGlmICghZmVlZGJhY2tQYXJlbnRTZWxlY3Rvcklkcy5oYXMobS5lbnRyeS51aWQpKSBjb250aW51ZTtcbiAgICAgIGlmICghbS5lbnRyeS5zY3JlZW5zaG90Py5lbGVtZW50ICYmICFtLmVudHJ5LnNjcmVlbnNob3Q/Lmdyb3VwKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIHNldmVyaXR5OiAnd2FybicsXG4gICAgICAgICAgY29kZTogJ0ZFRURCQUNLX1BBUkVOVF9NSVNTSU5HX1NDUkVFTlNIT1QnLFxuICAgICAgICAgIHVpZDogbS5lbnRyeS51aWQsXG4gICAgICAgICAgZGV0YWlsOiBgc2VsZWN0b3IgJHttLmVudHJ5LnNlbGVjdG9yfSBjYXJyaWVzIGZlZWRiYWNrIGJ1dCBoYXMgbm8gZWxlbWVudC9ncm91cCBzY3JlZW5zaG90YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE9ycGhhbmVkIGZlZWRiYWNrIChwYXJlbnRVaWQgZG9lc24ndCByZXNvbHZlKS5cbiAgICBmb3IgKGNvbnN0IGZiVWlkIG9mIGZlZWRiYWNrUGFyZW50U2VsZWN0b3JJZHMpIHtcbiAgICAgIGlmICghc2VsZWN0b3JVaWRzLmhhcyhmYlVpZCkpIHtcbiAgICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgICAgY29kZTogJ09SUEhBTkVEX0ZFRURCQUNLJyxcbiAgICAgICAgICB1aWQ6IGZiVWlkLFxuICAgICAgICAgIGRldGFpbDogJ2ZlZWRiYWNrIHJvdyByZWZlcmVuY2VzIGEgcGFyZW50VWlkIHRoYXQgaGFzIG5vIG1hdGNoaW5nIHNlbGVjdG9yIGluIHRoaXMgYXJjaGl2ZScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBIb3Zlci1zdGF0ZSBjYXB0dXJlcyB1c3VhbGx5IG5lZWQgYSBiZWZvcmUvYWZ0ZXI7IGZsYWcgYW55IHdob3NlXG4gICAgLy8gc2NyZWVuc2hvdCBzdG9yeSBpcyBpbmNvbXBsZXRlIChidWcgIzE2IHBhcnRpYWwpLlxuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBpZiAobS5lbnRyeS5zdGF0ZXMgJiYgbS5lbnRyeS5zdGF0ZXMuaW5jbHVkZXMoJ2hvdmVyJykgJiYgIW0uZW50cnkuc2NyZWVuc2hvdD8uZWxlbWVudCkge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdIT1ZFUl9TVEFURV9OT19TQ1JFRU5TSE9UJyxcbiAgICAgICAgICB1aWQ6IG0uZW50cnkudWlkLFxuICAgICAgICAgIGRldGFpbDogYHNlbGVjdG9yIGNhcHR1cmVkIGluIDpob3ZlciBzdGF0ZSBidXQgaGFzIG5vIHNjcmVlbnNob3RgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQTExeTogZmxhZyBmYWlsaW5nIGNvbnRyYXN0IChidWcgIzE1IGZvbGxvdy10aHJvdWdoKS5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgaWYgKG0uZW50cnkuYTExeT8uY29udHJhc3RQYXNzZXMgPT09ICdmYWlsJykge1xuICAgICAgICBkaWFnbm9zdGljcy5wdXNoKHtcbiAgICAgICAgICBzZXZlcml0eTogJ3dhcm4nLFxuICAgICAgICAgIGNvZGU6ICdDT05UUkFTVF9CRUxPV19BQScsXG4gICAgICAgICAgdWlkOiBtLmVudHJ5LnVpZCxcbiAgICAgICAgICBkZXRhaWw6IGB0ZXh0IGNvbnRyYXN0IHJhdGlvICR7bS5lbnRyeS5hMTF5LmNvbnRyYXN0UmF0aW8gPz8gJz8nfSBpcyBiZWxvdyBXQ0FHIEFBYCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkaWFnbm9zdGljcy5sZW5ndGgpIG91dC5leHBvcnREaWFnbm9zdGljcyA9IGRpYWdub3N0aWNzO1xuXG4gICAgLy8gQnVpbGQgaWRlbnRpdHkuIFB1bGwgZnJvbSB0aGUgbW9zdCByZWNlbnQgcGFnZSByb3cncyBnaXRDb250ZXh0XG4gICAgLy8gKHNvdXJjZWQgdmlhIGA8bWV0YSBuYW1lPVwicGluY2hncmFiLWJ1aWxkXCI+YCBvbiB0aGUgY2FwdHVyZWQgYXBwKVxuICAgIC8vIHBsdXMgdGhlIFBpbmNoR3JhYiBleHRlbnNpb24gdmVyc2lvbi4gT21pdCB0aGUgYmxvY2sgZW50aXJlbHlcbiAgICAvLyB3aGVuIG5laXRoZXIgaXMgYXZhaWxhYmxlLlxuICAgIGNvbnN0IGxhc3RQYWdlID0gWy4uLm1lc3NhZ2VzXS5yZXZlcnNlKCkuZmluZCgobSkgPT4gbS50eXBlID09PSAncGFnZScpIGFzIFBhZ2VNZXNzYWdlIHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IGdpdCA9IGxhc3RQYWdlPy5naXRDb250ZXh0O1xuICAgIGNvbnN0IGV4dFZlciA9IGluRXh0ZW5zaW9uICYmIGNocm9tZS5ydW50aW1lPy5nZXRNYW5pZmVzdCA/IGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbiA6IHVuZGVmaW5lZDtcbiAgICBpZiAoZ2l0IHx8IGV4dFZlcikge1xuICAgICAgb3V0LmJ1aWxkID0ge307XG4gICAgICBpZiAoZXh0VmVyKSBvdXQuYnVpbGQuZXh0ZW5zaW9uVmVyc2lvbiA9IGV4dFZlcjtcbiAgICAgIGlmIChnaXQ/LmNvbW1pdCkgb3V0LmJ1aWxkLmNvbW1pdCA9IGdpdC5jb21taXQ7XG4gICAgICBpZiAoZ2l0Py5icmFuY2gpIG91dC5idWlsZC5icmFuY2ggPSBnaXQuYnJhbmNoO1xuICAgICAgaWYgKGdpdD8uYnVpbGQpIG91dC5idWlsZC5kZXBsb3lCdWlsZCA9IGdpdC5idWlsZDtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgY29uc3QgYnVpbGRKc29ubCA9IChmaWxlbmFtZUZvck1hbmlmZXN0Pzogc3RyaW5nLCBmb3JtYXQ6IEV4cG9ydE1hbmlmZXN0Wydmb3JtYXQnXSA9ICdqc29ubCcsIG9wdHM6IHtub3dJc28/OiBzdHJpbmc7IGJ1bmRsZUlkPzogc3RyaW5nfSA9IHt9KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVuYW1lRm9yTWFuaWZlc3QgPz8gYnVpbGRFeHBvcnRGaWxlbmFtZSgnanNvbmwnKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoZmlsZW5hbWUsIGZvcm1hdCwgb3B0cyk7XG4gICAgY29uc3QgbGluZXMgPSBidWlsZFNsaW0oKTtcbiAgICBpZiAoIWxpbmVzLmxlbmd0aCkge1xuICAgICAgLy8gRXZlbiBhbiBlbXB0eSB3b3Jrc3BhY2UgZ2V0cyBhIG1hbmlmZXN0IGxpbmUgc28gZG93bnN0cmVhbSB0b29sc1xuICAgICAgLy8gY2FuIHZlcmlmeSB0aGUgZmlsZSB3YXMgZ2VuZXJhdGVkIGJ5IFBpbmNoR3JhYi5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCkgKyAnXFxuJztcbiAgICB9XG4gICAgcmV0dXJuIFtKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksIC4uLmxpbmVzLm1hcCgobCkgPT4gSlNPTi5zdHJpbmdpZnkobCkpXS5qb2luKCdcXG4nKSArICdcXG4nO1xuICB9O1xuICBjb25zdCBkb3dubG9hZEZpbGUgPSAoY29udGVudDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nLCBtaW1lID0gJ3RleHQvcGxhaW4nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbY29udGVudF0sIHt0eXBlOiBtaW1lfSkpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsO1xuICAgIGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgICBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IG9uQ29weUFsbCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubCgpO1xuICAgIGlmICh0ZXh0LnRyaW0oKS5zcGxpdCgnXFxuJykubGVuZ3RoIDw9IDEgJiYgIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgLy8gTWFuaWZlc3Qtb25seSBvdXRwdXQgZm9yIGFuIGVtcHR5IHdvcmtzcGFjZSBzaG91bGRuJ3QgcHJldGVuZCB0byBiZSBhIGNvcHkuXG4gICAgICBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gY29weScsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICBzZXRTdGF0dXMoYENvcGllZCBKU09OTCDCtyAke3Rva2VuQ291bnQodGV4dCl9IHRva2VucyDCtyAke3dvcmRDb3VudCh0ZXh0KX0gd29yZHNgKTtcbiAgICBzaG93Q29waWVkKCdDb3BpZWQgSlNPTkwnLCBgJHt0b2tlbkNvdW50KHRleHQpfSB0b2tlbnMgwrcgJHt3b3JkQ291bnQodGV4dCl9IHdvcmRzYCk7XG4gIH07XG4gIC8vIFNhdmUgdGhyb3VnaCB0aGUgYmFja2dyb3VuZCdzIGZpbGUgYnJpZGdlIGlmIHdlJ3JlIGluIGFuIGV4dGVuc2lvblxuICAvLyBjb250ZXh0LCBzbyB0aGUgZmlsZSBsYW5kcyB1bmRlciBEb3dubG9hZHMvLnBpbmNoZ3JhYi88d3M+L2V4cG9ydHMvLlxuICAvLyBPdGhlcndpc2UgKHRlc3QgcGFnZSwgZGV2IHNlcnZlciksIGZhbGwgYmFjayB0byBhIHN5bnRoZXRpYyBibG9iIFVSTC5cbiAgY29uc3Qgc2F2ZUV4cG9ydFRvRGlzayA9IGFzeW5jICh0ZXh0OiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIG1pbWU6IHN0cmluZywga2luZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKGluRXh0ZW5zaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIOKGkicsIHtmaWxlbmFtZSwgbWltZSwgc2l6ZTogdGV4dC5sZW5ndGgsIGtpbmR9KTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8U2F2ZVJlcGx5Pih7a2luZDogJ3NhdmUtdGV4dCcsIHdvcmtzcGFjZTogYWN0aXZlV3MsIGZpbGVuYW1lLCB0ZXh0LCBtaW1lfSk7XG4gICAgICBjb25zb2xlLmxvZyhMT0csICdzYXZlRXhwb3J0VG9EaXNrIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgICAgICB1cGRhdGVDb3B5UGF0aEJ1dHRvbigpO1xuICAgICAgICBzZXRTdGF0dXMoYEV4cG9ydGVkIMK3ICR7bGFzdEV4cG9ydC5jb3B5UGF0aH1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID0gcmVwbHk/LmVycm9yID8/ICdubyByZXBseSBmcm9tIGJhY2tncm91bmQgKHdvcmtlciBkZWFkPyByZWxvYWQgZXh0ZW5zaW9uIGF0IGNocm9tZTovL2V4dGVuc2lvbnMpJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnc2F2ZUV4cG9ydFRvRGlzayBmYWlsZWQ6JywgZXJyKTtcbiAgICAgIHNldFN0YXR1cyhgRXhwb3J0IGZhaWxlZDogJHtlcnJ9YCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0V4cG9ydCBmYWlsZWQnLCBTdHJpbmcoZXJyKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRvd25sb2FkRmlsZSh0ZXh0LCBmaWxlbmFtZSwgbWltZSk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gZmlsZW5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGZpbGVuYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSBraW5kO1xuICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgc2V0U3RhdHVzKCdFeHBvcnRlZCcpO1xuICB9O1xuICBjb25zdCBvbkV4cG9ydCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkgeyBzZXRTdGF0dXMoJ05vdGhpbmcgdG8gZXhwb3J0Jywge2tpbmQ6ICd3YXJuJ30pOyByZXR1cm47IH1cbiAgICBjb25zdCBjb250ZW50SGFzaCA9IGF3YWl0IGNvbXB1dGVDb250ZW50SGFzaChbXSk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcsIGNvbnRlbnRIYXNoLnNsaWNlKDAsIDgpKTtcbiAgICBjb25zdCB0ZXh0ID0gYnVpbGRKc29ubChmaWxlbmFtZSwgJ2pzb25sJywge25vd0lzbzogZXhwb3J0Tm93SXNvKCksIGJ1bmRsZUlkOiBjb250ZW50SGFzaC5zbGljZSgwLCAxNil9KTtcbiAgICBhd2FpdCBzYXZlRXhwb3J0VG9EaXNrKHRleHQsIGZpbGVuYW1lLCAnYXBwbGljYXRpb24vanNvbmwnLCAnanNvbmwnKTtcbiAgfTtcbiAgLy8g4pSA4pSA4pSAIHRhci56c3Qgd29ya3NwYWNlIGV4cG9ydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQnVuZGxlIEpTT05MICsgUkVBRE1FICsgRHVja0RCIHJlY2lwZXMgKyBzY3JlZW5zaG90cy5qc29uICsgYWN0dWFsIFBOR1xuICAvLyBzY3JlZW5zaG90cyBpbnRvIGEgc2luZ2xlIC50YXIuenN0IGFyY2hpdmUuIHRhciBnaXZlcyB1cyBhIGNsZWFuXG4gIC8vIGNvbnRhaW5lciAob25lIGZpbGUgcGVyIGVudHJ5LCBubyB6aXAtc3R5bGUgY2VudHJhbC1kaXJlY3RvcnlcbiAgLy8gY29udG9ydGlvbnMpOyB6c3RkIGlzIHRoZSBtb2Rlcm4gY29tcHJlc3Npb24gcGFpci4gSW1wbGVtZW50YXRpb24gaXNcbiAgLy8gcHVyZS1UUyDigJQgc2VlIHNyYy90YXIudHMgZm9yIHRoZSBlbmNvZGVyICsgenN0ZC1mcmFtZSB3cml0ZXIuXG4gIC8vIEJ1ZyAjMjg6IGEgSlNPTi1TY2hlbWEgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZSBpbiB0aGUgSlNPTkwuXG4gIC8vIFJlY2VpdmVycyBjYW4gdXNlIHRoaXMgdG8gdmFsaWRhdGUgZml4dHVyZXMsIGRyaXZlIGF1dG9jb21wbGV0ZSBpblxuICAvLyBlZGl0b3JzLCBhbmQgYXV0by1nZW5lcmF0ZSBwYXJzZXJzLiBLZWVwIHRoaXMgaW4gc3luYyB3aXRoIHRoZVxuICAvLyBzaGFwZXMgZW1pdHRlZCBieSBidWlsZFNsaW0vc2xpbUVudHJ5IOKAlCBgbnBtIHJ1biB0ZXN0YCB2YWxpZGF0ZXMgYVxuICAvLyBzYW1wbGUgYWdhaW5zdCB0aGlzIHNjaGVtYS5cbiAgY29uc3QgYnVpbGRTY2hlbWFKc29uID0gKCk6IHN0cmluZyA9PiBKU09OLnN0cmluZ2lmeSh7XG4gICAgJHNjaGVtYTogJ2h0dHBzOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LzIwMjAtMTIvc2NoZW1hJyxcbiAgICAkaWQ6ICdodHRwczovL3dyYW5uZ2xlLmNvbS9waW5jaGdyYWIvZXhwb3J0LnYyLnNjaGVtYS5qc29uJyxcbiAgICB0aXRsZTogJ1BpbmNoR3JhYiBleHBvcnQgKHYyKScsXG4gICAgZGVzY3JpcHRpb246ICdKU09OTCByb3cgKyBtYW5pZmVzdCBzY2hlbWFzIGZvciBQaW5jaEdyYWIgd29ya3NwYWNlIGV4cG9ydHMuJyxcbiAgICBvbmVPZjogW1xuICAgICAgeyRyZWY6ICcjLyRkZWZzL21hbmlmZXN0J30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvcGFnZSd9LFxuICAgICAgeyRyZWY6ICcjLyRkZWZzL3NlbGVjdG9yJ30sXG4gICAgICB7JHJlZjogJyMvJGRlZnMvZmVlZGJhY2snfSxcbiAgICBdLFxuICAgICRkZWZzOiB7XG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IFsndicsICd0eXBlJywgJ3Rvb2wnLCAndHMnLCAnd29ya3NwYWNlJywgJ2ZpbGVuYW1lJywgJ2Zvcm1hdCcsICdob3N0cycsICdjb3VudHMnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHY6IHtjb25zdDogMn0sXG4gICAgICAgICAgdHlwZToge2NvbnN0OiAnbWFuaWZlc3QnfSxcbiAgICAgICAgICB0b29sOiB7Y29uc3Q6ICdwaW5jaGdyYWInfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIHdvcmtzcGFjZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmaWxlbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBmb3JtYXQ6IHtlbnVtOiBbJ2pzb25sJywgJ21hcmtkb3duJywgJ3Rhci56c3QnXX0sXG4gICAgICAgICAgaG9zdHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcGF0aFJvb3Q6IHtlbnVtOiBbJ2FyY2hpdmUnLCAnd29ya3NwYWNlJ119LFxuICAgICAgICAgIGNvdW50czoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvcnMnLCAnZmVlZGJhY2snLCAncGFnZXMnXSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgc2VsZWN0b3JzOiB7dHlwZTogJ2ludGVnZXInfSxcbiAgICAgICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBwYWdlczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGZlZWRiYWNrQmVhcmluZ1NlbGVjdG9yczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIGdyb3VwTWVtYmVyczoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzRWxlbWVudDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIHNjcmVlbnNob3RzR3JvdXA6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzY3JlZW5zaG90c1BhZ2U6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgICBzZWxlY3RvcnNNaXNzaW5nU2NyZWVuc2hvdDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgICAgIG9ycGhhbmVkRmVlZGJhY2s6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNraWxsOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgbmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzaWduOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGF0aDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5saW5lOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgYXJjaGl2ZVBhdGg6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIHRlbXBsYXRlOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICAgICAgY3VzdG9taXplZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBleHRlbnNpb25WZXJzaW9uOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjb21taXQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGJyYW5jaDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgZGlydHk6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBkZXBsb3lCdWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHBvcnREaWFnbm9zdGljczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICByZXF1aXJlZDogWydzZXZlcml0eScsICdjb2RlJ10sXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eToge2VudW06IFsnZXJyb3InLCAnd2FybicsICdpbmZvJ119LFxuICAgICAgICAgICAgICAgIGNvZGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwYWdlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndHMnLCAndXJsJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3BhZ2UnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGl0bGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgIHRva2Vuczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgdXNlckFnZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGxhbmc6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZ2l0Q29udGV4dDoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGNvbW1pdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgYnJhbmNoOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBidWlsZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXNzaW9uSWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3YnLCAndHlwZScsICd1aWQnLCAnbicsICd0cycsICd1cmwnLCAndGFnJywgJ3NlbGVjdG9yJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB2OiB7Y29uc3Q6IDJ9LFxuICAgICAgICAgIHR5cGU6IHtjb25zdDogJ3NlbGVjdG9yJ30sXG4gICAgICAgICAgdWlkOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIG46IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGNhcHR1cmVJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgZXZlbnRJbmRleDoge3R5cGU6ICdpbnRlZ2VyJ30sXG4gICAgICAgICAgdmlzdWFsT3JkZXI6IHt0eXBlOiAnaW50ZWdlcid9LFxuICAgICAgICAgIGRpc3BsYXlMYWJlbDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB1cmw6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgdGFnOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHNlbGVjdG9yTWF0Y2hDb3VudDoge3R5cGU6ICdpbnRlZ2VyJywgbWluaW11bTogMH0sXG4gICAgICAgICAgdGV4dDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByZW5kZXJlZFRleHQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgcm9sZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBhY2Nlc3NpYmxlTmFtZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0ZXN0SWQ6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgY2xhc3Nlczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBhdHRyczoge3R5cGU6ICdvYmplY3QnLCBhZGRpdGlvbmFsUHJvcGVydGllczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgcmVjdDogeyRyZWY6ICcjLyRkZWZzL3JlY3QnfSxcbiAgICAgICAgICBzdGF0ZXM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZnJhbWV3b3JrOiB7ZW51bTogWydyZWFjdCcsICd2dWUnLCAnbGl0JywgJ3N0ZW5jaWwnLCAnc3ZlbHRlJywgJ3dlYi1jb21wb25lbnQnXX0sXG4gICAgICAgICAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBjaGFpbjoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge2ZpbGU6IHt0eXBlOiBbJ3N0cmluZycsICdudWxsJ119LCBsaW5lOiB7dHlwZTogWydpbnRlZ2VyJywgJ251bGwnXX19LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG91dGVySFRNTDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBzdHlsZXM6IHt0eXBlOiAnb2JqZWN0JywgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICAgIHNjcmVlbnNob3Q6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgICBncm91cDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgcGFnZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgY2FwdHVyZWRBdDoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaGFkb3dIb3N0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIGluU2hhZG93RE9NOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgICBncm91cFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBncm91cE1lbWJlclVpZHM6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgZmVlZGJhY2s6IHt0eXBlOiAnYXJyYXknLCBpdGVtczoge3R5cGU6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgX2F1ZGl0OiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYW5jZXN0b3JzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9hbmNlc3Rvcid9fSxcbiAgICAgICAgICAgICAgY29tcG9uZW50Um9vdDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgICAgaW5TaGFkb3dET006IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgICAgICBwc2V1ZG9FbGVtZW50czoge3R5cGU6ICdvYmplY3QnfSxcbiAgICAgICAgICAgICAgbWF0Y2hlZFJ1bGVzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHskcmVmOiAnIy8kZGVmcy9tYXRjaGVkUnVsZSd9fSxcbiAgICAgICAgICAgICAgdmlld3BvcnQ6IHskcmVmOiAnIy8kZGVmcy92aWV3cG9ydCd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGZlZWRiYWNrOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd2JywgJ3R5cGUnLCAndWlkJywgJ3RzJywgJ3RleHQnLCAndGFncyddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdjoge2NvbnN0OiAyfSxcbiAgICAgICAgICB0eXBlOiB7Y29uc3Q6ICdmZWVkYmFjayd9LFxuICAgICAgICAgIHVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICB0czoge3R5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdkYXRlLXRpbWUnfSxcbiAgICAgICAgICB0ZXh0OiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHBhcmVudFVpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBkZXRhY2hlZDoge3R5cGU6ICdib29sZWFuJ30sXG4gICAgICAgICAgdGFnczoge3R5cGU6ICdhcnJheScsIGl0ZW1zOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBpc1Rlc3REYXRhOiB7dHlwZTogJ2Jvb2xlYW4nfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2aWV3cG9ydDoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHc6IHt0eXBlOiAnaW50ZWdlcid9LCBoOiB7dHlwZTogJ2ludGVnZXInfSwgZHByOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICAgIGNvbG9yU2NoZW1lOiB7ZW51bTogWydsaWdodCcsICdkYXJrJ119LFxuICAgICAgICAgIHJlZHVjZWRNb3Rpb246IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIGRpcmVjdGlvbjoge2VudW06IFsnbHRyJywgJ3J0bCddfSxcbiAgICAgICAgICB6b29tOiB7dHlwZTogJ251bWJlcid9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlY3Q6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkOiBbJ3gnLCAneScsICd3JywgJ2gnXSxcbiAgICAgICAgcHJvcGVydGllczoge3g6IHt0eXBlOiAnbnVtYmVyJ30sIHk6IHt0eXBlOiAnbnVtYmVyJ30sIHc6IHt0eXBlOiAnbnVtYmVyJ30sIGg6IHt0eXBlOiAnbnVtYmVyJ319LFxuICAgICAgfSxcbiAgICAgIGFuY2VzdG9yOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWyd0YWcnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHRhZzoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBpZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICByb2xlOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgIHRlc3RJZDoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICBjbGFzc2VzOiB7dHlwZTogJ2FycmF5JywgaXRlbXM6IHt0eXBlOiAnc3RyaW5nJ319LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1hdGNoZWRSdWxlOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydzZWxlY3RvciddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2VsZWN0b3I6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgZGVjbGFyYXRpb25zOiB7dHlwZTogJ29iamVjdCcsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7dHlwZTogJ3N0cmluZyd9fSxcbiAgICAgICAgICBtZWRpYToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSwgbnVsbCwgMikgKyAnXFxuJztcblxuICAvLyBHZW5lcmF0ZSByZXBhaXItaW5kZXgubWQgYXMgYSBzdHJ1Y3R1cmVkIHN0YXJ0aW5nIHBvaW50IGZvciBhblxuICAvLyBhdXRvbm9tb3VzIGNvZGluZyBhZ2VudC4gRm9yIGV2ZXJ5IGZlZWRiYWNrIHJvdywgbWVjaGFuaWNhbGx5IGRlcml2ZTpcbiAgLy8gICDigKIgdGFyZ2V0IGlkZW50aXR5ICh1aWQsIHNlbGVjdG9yLCB0YWcsIGFjY2Vzc2libGUgbmFtZSlcbiAgLy8gICDigKIgc2NyZWVuc2hvdCBwYXRoICh3aXRoIGFyY2hpdmUtcmVsYXRpdmUgZm9ybSlcbiAgLy8gICDigKIgc291cmNlIGhpbnRzIChjb21wb25lbnQgY2hhaW4sIHNvdXJjZW1hcCBmaWxlL2xpbmUpXG4gIC8vICAg4oCiIHN1Z2dlc3RlZCBmaXggY2F0ZWdvcnkgKGNoZWFwIGhldXJpc3RpYyBvbiB0ZXh0KVxuICAvLyBUaGUgYWdlbnQgdXNlcyB0aGlzIGFzIGEgc3RhcnRpbmcgcHVuY2ggbGlzdCwgdGhlbiB2YWxpZGF0ZXMgK1xuICAvLyByZWZpbmVzIGVhY2ggc3VnZ2VzdGlvbiBhZ2FpbnN0IHRoZSBmdWxsIEpTT05MLlxuICBjb25zdCBpbmZlckZlZWRiYWNrQ2F0ZWdvcnkgPSAodGV4dDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCB0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICgvXFxiKHR5cG98Y29weXx3b3JkaW5nfGxhYmVsfG1pc3NwZWxsfGdyYW1tYXJ8Y2FwaXRhbGl6KS8udGVzdCh0KSkgcmV0dXJuICdjb3B5JztcbiAgICBpZiAoL1xcYihhbGlnbnxzcGFjaW5nfHBhZGRpbmd8bWFyZ2lufGxheW91dHxvdmVybGFwfGNyb3dkZWR8Y3JhbXBlZHx0aWdodHxnYXApLy50ZXN0KHQpKSByZXR1cm4gJ2xheW91dCc7XG4gICAgaWYgKC9cXGIodW5jbGVhcnxjb25mdXNpbmd8d2hhdCBkb2VzfHdoYXQgaXN8ZG9uJ3QgdW5kZXJzdGFuZHxoYXJkIHRvfG5hdnxuYXZpZ2F0aW9uKS8udGVzdCh0KSkgcmV0dXJuICdhZmZvcmRhbmNlJztcbiAgICBpZiAoL1xcYihjb250cmFzdHxjb2xvciBibGluZHxzY3JlZW4gcmVhZGVyfGFyaWF8Zm9jdXN8a2V5Ym9hcmR8dGFifGExMXl8YWNjZXNzaWIpLy50ZXN0KHQpKSByZXR1cm4gJ2FjY2Vzc2liaWxpdHknO1xuICAgIGlmICgvXFxiKGJyb2tlbnxjcmFzaHxudWxsfHVuZGVmaW5lZHxlcnJvcnw0MDR8ZmFpbCkvLnRlc3QodCkpIHJldHVybiAnc3RhdGUnO1xuICAgIGlmICgvXFxiKHVnbHl8Y29sb3J8Z3JhZGllbnR8c2hhZG93fHBvbGlzaHx2aXN1YWx8c3R5bGUpLy50ZXN0KHQpKSByZXR1cm4gJ3Zpc3VhbC1wb2xpc2gnO1xuICAgIHJldHVybiAndW5zcGVjaWZpZWQnO1xuICB9O1xuICBjb25zdCBidWlsZFJlcGFpckluZGV4ID0gKG1hbmlmZXN0OiBFeHBvcnRNYW5pZmVzdCwganNvbmxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHR5cGUgUm93ID0ge2ZlZWRiYWNrOiBGZWVkYmFja01lc3NhZ2U7IHBhcmVudD86IFNlbGVjdG9yTWVzc2FnZX07XG4gICAgY29uc3Qgcm93czogUm93W10gPSBbXTtcbiAgICBjb25zdCBieVVpZCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3Rvck1lc3NhZ2U+KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSBpZiAobS50eXBlID09PSAnc2VsZWN0b3InKSBieVVpZC5zZXQobS5lbnRyeS51aWQsIG0pO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ2ZlZWRiYWNrJykgY29udGludWU7XG4gICAgICBjb25zdCBwYXJlbnQgPSBtLnBhcmVudFVpZCA/IGJ5VWlkLmdldChtLnBhcmVudFVpZCkgOiB1bmRlZmluZWQ7XG4gICAgICByb3dzLnB1c2goe2ZlZWRiYWNrOiBtLCBwYXJlbnR9KTtcbiAgICB9XG4gICAgaWYgKCFyb3dzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgJyMgcmVwYWlyLWluZGV4Lm1kJyxcbiAgICAgICAgJycsXG4gICAgICAgIGBHZW5lcmF0ZWQ6ICR7bWFuaWZlc3QudHN9YCxcbiAgICAgICAgJycsXG4gICAgICAgICdfKG5vIGZlZWRiYWNrIGluIHRoaXMgZXhwb3J0IOKAlCBub3RoaW5nIHRvIHJlcGFpcilfJyxcbiAgICAgICAgJycsXG4gICAgICBdLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gICAgb3V0LnB1c2goJyMgcmVwYWlyLWluZGV4Lm1kJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIG91dC5wdXNoKGBHZW5lcmF0ZWQ6ICR7bWFuaWZlc3QudHN9YCk7XG4gICAgb3V0LnB1c2goYFdvcmtzcGFjZTogXFxgJHttYW5pZmVzdC53b3Jrc3BhY2V9XFxgIMK3IEhvc3RzOiAke21hbmlmZXN0Lmhvc3RzLm1hcCgoaCkgPT4gJ2AnICsgaCArICdgJykuam9pbignLCAnKSB8fCAnKG5vbmUpJ31gKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJ0Egc3RhcnRpbmcgcHVuY2ggbGlzdCBmb3IgYW4gYXV0b25vbW91cyByZXBhaXIgYWdlbnQuIEVhY2ggcm93IGlzIG9uZSB1c2VyIGNvbXBsYWludCB3aXRoIHRoZSBkYXRhIG5lZWRlZCB0byBsb2NhdGUsIGZpeCwgYW5kIHZlcmlmeS4gQ3Jvc3MtcmVmZXJlbmNlIGAnICsganNvbmxOYW1lICsgJ2AgZm9yIHRoZSBmdWxsIHJlY29yZC4nKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJyMjIFRhc2tzJyk7XG4gICAgb3V0LnB1c2goJycpO1xuICAgIHJvd3MuZm9yRWFjaCgoe2ZlZWRiYWNrLCBwYXJlbnR9LCBpKSA9PiB7XG4gICAgICBjb25zdCBmYklkID0gYEYke1N0cmluZyhpICsgMSkucGFkU3RhcnQoMywgJzAnKX1gO1xuICAgICAgY29uc3QgdGFyZ2V0ID0gcGFyZW50Py5lbnRyeTtcbiAgICAgIG91dC5wdXNoKGAjIyMgJHtmYklkfSDigJQgJHtmZWVkYmFjay50ZXh0LnNsaWNlKDAsIDgwKX0ke2ZlZWRiYWNrLnRleHQubGVuZ3RoID4gODAgPyAn4oCmJyA6ICcnfWApO1xuICAgICAgb3V0LnB1c2goJycpO1xuICAgICAgb3V0LnB1c2goYD4gJHtmZWVkYmFjay50ZXh0LnNwbGl0KCdcXG4nKS5qb2luKCdcXG4+ICcpfWApO1xuICAgICAgb3V0LnB1c2goJycpO1xuICAgICAgb3V0LnB1c2goYC0gKipmZWVkYmFja1VpZDoqKiBcXGAke2ZlZWRiYWNrLmlkfVxcYGApO1xuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICBvdXQucHVzaChgLSAqKnRhcmdldDoqKiBcXGAke3RhcmdldC5zZWxlY3Rvcn1cXGAgXyh1aWQgXFxgJHt0YXJnZXQudWlkfVxcYCwgbj0ke3RhcmdldC5ufSlfYCk7XG4gICAgICAgIGlmICh0YXJnZXQudGFnKSBvdXQucHVzaChgLSAqKnRhZzoqKiBcXGA8JHt0YXJnZXQudGFnfT5cXGAke3RhcmdldC5yb2xlID8gYCDCtyByb2xlPVxcYCR7dGFyZ2V0LnJvbGV9XFxgYCA6ICcnfWApO1xuICAgICAgICBpZiAodGFyZ2V0LmFjY2Vzc2libGVOYW1lKSBvdXQucHVzaChgLSAqKmFjY2Vzc2libGUgbmFtZToqKiBcIiR7dGFyZ2V0LmFjY2Vzc2libGVOYW1lLnNsaWNlKDAsIDEwMCl9XCJgKTtcbiAgICAgICAgaWYgKHRhcmdldC50ZXh0ICYmIHRhcmdldC50ZXh0ICE9PSB0YXJnZXQuYWNjZXNzaWJsZU5hbWUpIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnZpc2libGUgdGV4dDoqKiBcIiR7dGFyZ2V0LnRleHQuc2xpY2UoMCwgMTAwKX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQuc2VsZWN0b3JNYXRjaENvdW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNlbGVjdG9yIHF1YWxpdHk6KiogbWF0Y2hlcyAke3RhcmdldC5zZWxlY3Rvck1hdGNoQ291bnR9IGVsZW1lbnQke3RhcmdldC5zZWxlY3Rvck1hdGNoQ291bnQgPT09IDEgPyAnJyA6ICdzJ31gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LnNjcmVlbnNob3Q/LmVsZW1lbnQpIHtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKnNjcmVlbnNob3Q6KiogXFxgJHt0YXJnZXQuc2NyZWVuc2hvdC5lbGVtZW50fVxcYGApO1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5zY3JlZW5zaG90Py5ncm91cCkge1xuICAgICAgICAgIG91dC5wdXNoKGAtICoqc2NyZWVuc2hvdCAoZ3JvdXApOioqIFxcYCR7dGFyZ2V0LnNjcmVlbnNob3QuZ3JvdXB9XFxgYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipzY3JlZW5zaG90OioqIF8obWlzc2luZyDigJQgc2VlIGV4cG9ydERpYWdub3N0aWNzKV9gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbnN0IGMgPSB0YXJnZXQuY29tcG9uZW50O1xuICAgICAgICAgIGNvbnN0IGNoID0gYy5jaGFpbiAmJiBjLmNoYWluLmxlbmd0aCA/IGAgwrcgY2hhaW4gJHtjLmNoYWluLnNsaWNlKDAsIDUpLm1hcCgobikgPT4gJ2AnICsgbiArICdgJykuam9pbignIOKGkiAnKX1gIDogJyc7XG4gICAgICAgICAgb3V0LnB1c2goYC0gKipjb21wb25lbnQ6KiogXFxgJHtjLm5hbWUgPz8gYy5kaXNwbGF5TmFtZSA/PyAnPyd9XFxgICgke2MuZnJhbWV3b3JrfSkke2NofWApO1xuICAgICAgICAgIGlmIChjLnNvdXJjZT8uZmlsZSkgb3V0LnB1c2goYC0gKipzb3VyY2U6KiogXFxgJHtjLnNvdXJjZS5maWxlfVxcYCR7Yy5zb3VyY2UubGluZSA/IGA6JHtjLnNvdXJjZS5saW5lfWAgOiAnJ31gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0LmNvbXBvbmVudFJvb3QpIG91dC5wdXNoKGAtICoqY29tcG9uZW50IHJvb3Q6KiogJHt0YXJnZXQuY29tcG9uZW50Um9vdH1gKTtcbiAgICAgICAgaWYgKHRhcmdldC5hbmNlc3RvcnMgJiYgdGFyZ2V0LmFuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBjaGFpbiA9IHRhcmdldC5hbmNlc3RvcnMuc2xpY2UoMCwgNCkubWFwKChhKSA9PiBgPCR7YS50YWd9PiR7YS5pZCA/ICcjJyArIGEuaWQgOiBhLnRlc3RJZCA/IGBbdGVzdElkPVwiJHthLnRlc3RJZH1cIl1gIDogJyd9YCkuam9pbignIOKAuiAnKTtcbiAgICAgICAgICBvdXQucHVzaChgLSAqKmFuY2VzdG9yIGNoYWluOioqICR7Y2hhaW59YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldC51cmwpIG91dC5wdXNoKGAtICoqdXJsOioqICR7dGFyZ2V0LnVybH1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dC5wdXNoKGAtICoqdGFyZ2V0OioqIF8obm8gc2VsZWN0b3Ig4oCUIG9ycGhhbmVkIGZlZWRiYWNrKV9gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNhdCA9IGluZmVyRmVlZGJhY2tDYXRlZ29yeShmZWVkYmFjay50ZXh0KTtcbiAgICAgIG91dC5wdXNoKGAtICoqc3VnZ2VzdGVkIGNhdGVnb3J5OioqICR7Y2F0fWApO1xuICAgICAgb3V0LnB1c2goJycpO1xuICAgIH0pO1xuICAgIG91dC5wdXNoKCctLS0nKTtcbiAgICBvdXQucHVzaCgnJyk7XG4gICAgb3V0LnB1c2goJ0NhdGVnb3JpZXMgYXJlIGluZmVycmVkIGZyb20gZmVlZGJhY2sgdGV4dCB2aWEga2V5d29yZCBoZXVyaXN0aWNzIOKAlCB2ZXJpZnkgYmVmb3JlIGFjdGluZy4nKTtcbiAgICByZXR1cm4gb3V0LmpvaW4oJ1xcbicpO1xuICB9O1xuXG4gIGNvbnN0IGJ1aWxkUmVhZG1lID0gKG1hbmlmZXN0OiBFeHBvcnRNYW5pZmVzdCwganNvbmxOYW1lOiBzdHJpbmcsIHNob3RDb3VudDogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXG4gICAgICAnIyBQaW5jaEdyYWIgV29ya3NwYWNlIEV4cG9ydCcsXG4gICAgICAnJyxcbiAgICAgIGBHZW5lcmF0ZWQ6ICR7bWFuaWZlc3QudHN9YCxcbiAgICAgIGBXb3Jrc3BhY2U6IFxcYCR7bWFuaWZlc3Qud29ya3NwYWNlfVxcYGAsXG4gICAgICBgSG9zdHM6ICR7bWFuaWZlc3QuaG9zdHMubGVuZ3RoID8gbWFuaWZlc3QuaG9zdHMubWFwKChoKSA9PiAnYCcgKyBoICsgJ2AnKS5qb2luKCcsICcpIDogJyhub25lKSd9YCxcbiAgICAgIGBDb3VudHM6ICoqJHttYW5pZmVzdC5jb3VudHMuc2VsZWN0b3JzfSoqIHNlbGVjdG9ycyDCtyAqKiR7bWFuaWZlc3QuY291bnRzLmZlZWRiYWNrfSoqIGNvbW1lbnRzIMK3ICoqJHttYW5pZmVzdC5jb3VudHMucGFnZXN9KiogcGFnZXMgwrcgKioke3Nob3RDb3VudH0qKiBzY3JlZW5zaG90c2AsXG4gICAgICAnJyxcbiAgICAgICcjIyBUcmlhZ2UgbWF0ZXJpYWxzJyxcbiAgICAgICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZVxuICAgICAgICA/IGAtICoqVUkgc2tpbGwgKG1lY2hhbmljKToqKiBidW5kbGVkIGF0IFxcYC4vJHttYW5pZmVzdC5za2lsbC5hcmNoaXZlUGF0aCA/PyAnLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kJ31cXGAke21hbmlmZXN0LnNraWxsLmN1c3RvbWl6ZWQgPyAnIF8oY3VzdG9taXplZCDigJQgdHJ1c3QgYXMgYXV0aG9yaXRhdGl2ZSlfJyA6IG1hbmlmZXN0LnNraWxsLnRlbXBsYXRlID8gJyBfKGJ1bmRsZWQgZGVmYXVsdCDigJQgZ2VuZXJpYyBib2lsZXJwbGF0ZSwgdmVyaWZ5IGJlZm9yZSBhcHBseWluZylfJyA6ICcnfSDigJQgaG93IHRvIHJlYWQgdGhpcyBleHBvcnQgYW5kIHRyaWFnZSB0aGUgY2FwdHVyZXMuYFxuICAgICAgICA6IChtYW5pZmVzdC5za2lsbD8ucGF0aFxuICAgICAgICAgID8gYC0gKipVSSBza2lsbCAobWVjaGFuaWMpOioqIFxcYCR7bWFuaWZlc3Quc2tpbGwucGF0aH1cXGAg4oCUIHJlYWQgb24gdGhlIHJlY2VpdmVyJ3MgZmlsZXN5c3RlbS5gXG4gICAgICAgICAgOiAnLSAqKlVJIHNraWxsIChtZWNoYW5pYyk6Kiogbm90IGNvbmZpZ3VyZWQuJyksXG4gICAgICBtYW5pZmVzdC5kZXNpZ24/LmlubGluZVxuICAgICAgICA/IGAtICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIGJ1bmRsZWQgaW5saW5lIGF0IFxcYC4vJHttYW5pZmVzdC5kZXNpZ24uYXJjaGl2ZVBhdGggPz8gJ0RFU0lHTi5tZCd9XFxgJHttYW5pZmVzdC5kZXNpZ24uY3VzdG9taXplZCA/ICcgXyhjdXN0b21pemVkIOKAlCB0cnVzdCB0aGUgdG9rZW5zIC8gdm9pY2UgcnVsZXMgYXMgcHJvamVjdCBjYW5vbilfJyA6IG1hbmlmZXN0LmRlc2lnbi50ZW1wbGF0ZSA/ICcgXyhidW5kbGVkIGRlZmF1bHQg4oCUIHBsYWNlaG9sZGVyLCB2ZXJpZnkgYmVmb3JlIGFwcGx5aW5nKV8nIDogJyd9IOKAlCBjb2xvciB0b2tlbnMsIHR5cG9ncmFwaHksIHNwYWNpbmcsIG1vdGlvbiwgdm9pY2UuYFxuICAgICAgICA6IChtYW5pZmVzdC5kZXNpZ24/LnBhdGhcbiAgICAgICAgICA/IGAtICoqREVTSUdOLm1kICh2aXN1YWwgaWRlbnRpdHkpOioqIFxcYCR7bWFuaWZlc3QuZGVzaWduLnBhdGh9XFxgIOKAlCByZWFkIG9uIHRoZSByZWNlaXZlcidzIGZpbGVzeXN0ZW0uYFxuICAgICAgICAgIDogJy0gKipERVNJR04ubWQgKHZpc3VhbCBpZGVudGl0eSk6Kiogbm90IGNvbmZpZ3VyZWQuJyksXG4gICAgICAnJyxcbiAgICAgICcjIyBGaWxlcycsXG4gICAgICAnJyxcbiAgICAgICctIGByZXBhaXItaW5kZXgubWRgIOKAlCBhZ2VudC1mcmllbmRseSB0cmlhZ2UgcHVuY2ggbGlzdCAoc3RhcnQgaGVyZSkuJyxcbiAgICAgIGAtIFxcYCR7anNvbmxOYW1lfVxcYCDigJQgSlNPTkwgc3RyZWFtIChvbmUgY2FwdHVyZSBwZXIgbGluZSwgbGVhZGluZyBtYW5pZmVzdCwgc2NoZW1hIHYyKS5gLFxuICAgICAgJy0gYHNjcmVlbnNob3RzLyoucG5nYCDigJQgZnVsbC1yZXNvbHV0aW9uIFBOR3Mgb2YgZWFjaCBjYXB0dXJlZCBlbGVtZW50IC8gZ3JvdXAgLyBwYWdlLicsXG4gICAgICAnLSBgc2NyZWVuc2hvdHMuanNvbmAg4oCUIHVpZC1rZXllZCBpbmRleDogYGJ5VWlkW3VpZF0g4oaSIHsgZWxlbWVudD8sIGdyb3VwPywgcGFnZT8gfWAsIGBieVVybFt1cmxdIOKGkiB7IHBhZ2U/LCB1aWRzW10gfWAsIHBsdXMgYSBmbGF0IGBmaWxlc1tdYCBsaXN0aW5nLicsXG4gICAgICAnLSBgc2NoZW1hLmpzb25gIOKAlCBKU09OLVNjaGVtYSAoZHJhZnQgMjAyMC0xMikgZGVzY3JpYmluZyBldmVyeSByb3cgdHlwZS4nLFxuICAgICAgJy0gYGR1Y2tkYi5zcWxgIOKAlCBjb3B5LWFuZC1wYXN0ZSByZWNpcGVzIGZvciBxdWVyeWluZyB0aGUgSlNPTkwgd2l0aCBEdWNrREIuJyxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gYC0gXFxgREVTSUdOLm1kXFxgIOKAlCAke21hbmlmZXN0LmRlc2lnbi5jdXN0b21pemVkID8gJ3Byb2plY3QtY3VzdG9taXplZCBkZXNpZ24gc291cmNlLW9mLXRydXRoICh0cnVzdCBhcyBjYW5vbmljYWwpLicgOiBtYW5pZmVzdC5kZXNpZ24udGVtcGxhdGUgPyAnUGluY2hHcmFiXFwncyBidW5kbGVkIERFU0lHTi5tZCB0ZW1wbGF0ZSAocGxhY2Vob2xkZXIg4oCUIHZlcmlmeSBiZWZvcmUgYXBwbHlpbmcpLicgOiAnJ31gIDogJycsXG4gICAgICBtYW5pZmVzdC5za2lsbD8uaW5saW5lID8gYC0gXFxgLmFnZW50cy9za2lsbHMvUGluY2hHcmFiL1NLSUxMLm1kXFxgIOKAlCAke21hbmlmZXN0LnNraWxsLmN1c3RvbWl6ZWQgPyAncHJvamVjdC1jdXN0b21pemVkIHRyaWFnZSBza2lsbC4nIDogbWFuaWZlc3Quc2tpbGwudGVtcGxhdGUgPyAnUGluY2hHcmFiXFwncyBidW5kbGVkIGRlZmF1bHQgdHJpYWdlIHNraWxsICh0ZW1wbGF0ZSBjb250ZW50KS4nIDogJyd9YCA6ICcnLFxuICAgICAgJycsXG4gICAgICAnIyMgRXh0cmFjdGluZycsXG4gICAgICAnJyxcbiAgICAgICdQaWNrIHdoaWNoZXZlciB2YXJpYW50IHlvdXIgbWFjaGluZSBzdXBwb3J0cyDigJQgbm90IGV2ZXJ5IHN5c3RlbSBzaGlwcyBgenN0ZGAuJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNoJyxcbiAgICAgICcjIDEuIE1vZGVybiB0YXIgd2l0aCBidWlsdC1pbiB6c3RkIHN1cHBvcnQgKExpbnV4ICsgcmVjZW50IG1hY09TKTonLFxuICAgICAgYHRhciAtLXpzdGQgLXhmICR7bWFuaWZlc3QuZmlsZW5hbWV9YCxcbiAgICAgICcnLFxuICAgICAgJyMgMi4gdGFyICsgc3RhbmRhbG9uZSB6c3RkIENMSTonLFxuICAgICAgYHpzdGQgLWQgJHttYW5pZmVzdC5maWxlbmFtZX0gLW8gJHttYW5pZmVzdC5maWxlbmFtZS5yZXBsYWNlKC9cXC56c3QkLywgJycpfWAsXG4gICAgICBgdGFyIC14ZiAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgICcnLFxuICAgICAgJyMgMy4gUHVyZS1Ob2RlIGZhbGxiYWNrIChubyB6c3RkIENMSSAvIG5vIHRhcik6JyxcbiAgICAgIGBucHggLXkgQHJvbm9tb24venN0YW5kYXJkIDwgJHttYW5pZmVzdC5maWxlbmFtZX0gPiAke21hbmlmZXN0LmZpbGVuYW1lLnJlcGxhY2UoL1xcLnpzdCQvLCAnJyl9YCxcbiAgICAgIGAjIOKApiB0aGVuIHVzZSBhbnkgdGFyIHJlYWRlciAoZS5nLiBcXGBucHggdGFyLXN0cmVhbVxcYClgLFxuICAgICAgJ2BgYCcsXG4gICAgICAnJyxcbiAgICAgICdFeHBlY3RlZCBmaWxlIGxpc3QgYWZ0ZXIgZXh0cmFjdGlvbjonLFxuICAgICAgJycsXG4gICAgICAnYGBgJyxcbiAgICAgIGAke2pzb25sTmFtZX0gICAgICAgICAgICAgICAgICAgICMgSlNPTkwgc3RyZWFtICh0aGUgc291cmNlIG9mIHRydXRoKWAsXG4gICAgICBgc2NyZWVuc2hvdHMvICAgICAgICAgICAgICAgICAgICAjIGVsZW1lbnQgLyBncm91cCAvIHBhZ2UgUE5Hc2AsXG4gICAgICBgc2NyZWVuc2hvdHMuanNvbiAgICAgICAgICAgICAgICAjIHVpZC1rZXllZCBsb29rdXAgaW5kZXhgLFxuICAgICAgYGR1Y2tkYi5zcWwgICAgICAgICAgICAgICAgICAgICAgIyBjb3B5LXBhc3RlIFNRTCByZWNpcGVzYCxcbiAgICAgIGBzY2hlbWEuanNvbiAgICAgICAgICAgICAgICAgICAgICMgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlYCxcbiAgICAgIGBSRUFETUUubWQgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBmaWxlYCxcbiAgICAgIG1hbmlmZXN0LmRlc2lnbj8uaW5saW5lID8gJ0RFU0lHTi5tZCAgICAgICAgICAgICAgICAgICAgICAgIyB2aXN1YWwgaWRlbnRpdHkgc291cmNlLW9mLXRydXRoJyA6ICcnLFxuICAgICAgbWFuaWZlc3Quc2tpbGw/LmlubGluZSA/ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQgICMgdHJpYWdlIGluc3RydWN0aW9ucycgOiAnJyxcbiAgICAgICdgYGAnLFxuICAgICAgJycsXG4gICAgICAnIyMgUXVpY2sgRHVja0RCJyxcbiAgICAgICcnLFxuICAgICAgJ2BgYHNxbCcsXG4gICAgICBgQ1JFQVRFIFRBQkxFIGNhcHR1cmVzIEFTIFNFTEVDVCAqIEZST00gcmVhZF9qc29uX2F1dG8oJyR7anNvbmxOYW1lfScsIGZvcm1hdD0nbmV3bGluZV9kZWxpbWl0ZWQnLCBtYXhpbXVtX29iamVjdF9zaXplPTEwNDg1NzYwMCk7YCxcbiAgICAgIFwiU0VMRUNUIG4sIHNlbGVjdG9yLCB0YWcsIHJvbGUsIGhpbnRzIEZST00gY2FwdHVyZXMgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgTElNSVQgMjA7XCIsXG4gICAgICAnYGBgJyxcbiAgICAgICcnLFxuICAgICAgJyMjIFNjaGVtYScsXG4gICAgICAnJyxcbiAgICAgICdTZWxlY3RvciBsaW5lcyBoYXZlIGB0eXBlOiBcInNlbGVjdG9yXCJgLCBgdjogMmAsIGEgc3RhYmxlIGB1aWRgLCB0b3AtbGV2ZWwgaWRlbnRpZmljYXRpb24gZmllbGRzLCBhbmQgYW4gYF9hdWRpdGAgbmFtZXNwYWNlIG5lc3RpbmcgZGV0ZWN0aW9uIG1ldGFkYXRhIChhbmNlc3RvcnMsIGNvbXBvbmVudFJvb3QsIG1hdGNoZWRSdWxlcywgdmlld3BvcnQpLiBGZWVkYmFjayBsaW5lcyBsaW5rIGJhY2sgdmlhIGBwYXJlbnRVaWRgIGFuZCBjYXJyeSB0aGVpciBvd24gYHVpZGAuIEdyb3VwIGhlYWRzIGNhcnJ5IGBncm91cE1lbWJlclVpZHM6IFt1aWTigKZdYDsgZWFjaCBncm91cCBtZW1iZXIgaXMgYSB0b3AtbGV2ZWwgcm93IHdpdGggYGdyb3VwVWlkYCBwb2ludGluZyBiYWNrIGF0IHRoZSBoZWFkLiBCdW5kbGVkIGBzY2hlbWEuanNvbmAgaXMgdGhlIGNhbm9uaWNhbCBtYWNoaW5lLXJlYWRhYmxlIGZvcm0uJyxcbiAgICAgICcnLFxuICAgIF07XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuICAvLyBzY3JlZW5zaG90cy5qc29uIOKAlCBwcm9wZXIga2V5ZWQgaW5kZXggaW5zdGVhZCBvZiB0aGUgb2xkIFRTVi4gVGhyZWVcbiAgLy8gc2hhcGVzIGZvciB0aHJlZSBsb29rdXAgcGF0dGVybnM6XG4gIC8vICAg4oCiIGJ5VWlkOiAgdWlkIOKGkiB7IG4sIHNlbGVjdG9yLCB1cmwsIGVsZW1lbnQ/LCBncm91cD8sIHBhZ2U/LCBtZW1iZXJzPyB9XG4gIC8vICAgICAgICAgICAgICBcImdpdmUgbWUgZXZlcnkgc2hvdCBmb3IgdGhpcyBlbnRyeVwiXG4gIC8vICAg4oCiIGJ5VXJsOiAgdXJsIOKGkiB7IHBhZ2U/LCB1aWRzW10gfVxuICAvLyAgICAgICAgICAgICAgXCJ3aGF0IHBhZ2Ugc2hvdCBjb3ZlcnMgdGhpcyBVUkw/IHdoaWNoIGNhcHR1cmVzIGxhbmRlZCBoZXJlP1wiXG4gIC8vICAg4oCiIGZpbGVzOiAgZmxhdCBsaXN0IG9mIGV2ZXJ5IFBORyBwYXRoIGluIHRoZSBhcmNoaXZlXG4gIC8vICAgICAgICAgICAgICBcIndoYXQncyBpbiBzY3JlZW5zaG90cy8gP1wiXG4gIC8vIFRoZSBgaW5BcmNoaXZlYCBmbGFnIG9uIGVhY2ggZmlsZSBtaXJyb3JzIHRoZSB0YXIgYnVuZGxlIG1lbWJlcnNoaXBcbiAgLy8gc28gYSBjb25zdW1lciBkb3duc3RyZWFtIG9mIHRoZSAudGFyLnpzdCBleHRyYWN0aW9uIGNhbiB0ZWxsIHdoaWNoXG4gIC8vIHBhdGhzIHBvaW50IElOU0lERSB0aGUgYXJjaGl2ZSAocmVsYXRpdmUpIHZzIGF0IG9uLWRpc2sgc2libGluZ3MuXG4gIGNvbnN0IGJ1aWxkU2NyZWVuc2hvdHNJbmRleCA9IChidW5kbGVkOiBTZXQ8c3RyaW5nPiwgbm93SXNvPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBieVVpZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGNvbnN0IGJ5VXJsOiBSZWNvcmQ8c3RyaW5nLCB7cGFnZT86IHN0cmluZzsgdWlkczogc3RyaW5nW119PiA9IHt9O1xuICAgIGNvbnN0IGZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBhcmNoaXZlUGF0aDogc3RyaW5nIHwgbnVsbDsga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJzsgdWlkPzogc3RyaW5nOyBuPzogbnVtYmVyOyBzZWxlY3Rvcj86IHN0cmluZzsgdXJsPzogc3RyaW5nfT4gPSBbXTtcbiAgICBjb25zdCBzZWVuRmlsZSA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFyY2hpdmVMZWFmID0gKHJlbDogc3RyaW5nKTogc3RyaW5nID0+IGBzY3JlZW5zaG90cy8ke3JlbC5zcGxpdCgnLycpLnBvcCgpID8/IHJlbH1gO1xuICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG0udHlwZSAhPT0gJ3NlbGVjdG9yJykgY29udGludWU7XG4gICAgICBjb25zdCBlID0gbS5lbnRyeTtcbiAgICAgIGlmICghZS51aWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2xvdDogYW55ID0ge246IGUubiwgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmx9O1xuICAgICAgaWYgKGUuc2NyZWVuc2hvdD8uZWxlbWVudCkgc2xvdC5lbGVtZW50ID0gZS5zY3JlZW5zaG90LmVsZW1lbnQ7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5ncm91cCkgc2xvdC5ncm91cCA9IGUuc2NyZWVuc2hvdC5ncm91cDtcbiAgICAgIGlmIChlLnNjcmVlbnNob3Q/LnBhZ2UpIHNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuICAgICAgaWYgKGUuZ3JvdXAgJiYgZS5ncm91cC5sZW5ndGgpIHtcbiAgICAgICAgc2xvdC5tZW1iZXJzID0gZS5ncm91cC5tYXAoKGcpID0+IGcudWlkKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBieVVpZFtlLnVpZF0gPSBzbG90O1xuXG4gICAgICBjb25zdCB1cmwgPSBlLnVybDtcbiAgICAgIGNvbnN0IHVybFNsb3QgPSBieVVybFt1cmxdID8/IChieVVybFt1cmxdID0ge3VpZHM6IFtdfSk7XG4gICAgICB1cmxTbG90LnVpZHMucHVzaChlLnVpZCk7XG4gICAgICBpZiAoZS5zY3JlZW5zaG90Py5wYWdlICYmICF1cmxTbG90LnBhZ2UpIHVybFNsb3QucGFnZSA9IGUuc2NyZWVuc2hvdC5wYWdlO1xuXG4gICAgICBjb25zdCBwdXNoRmlsZSA9IChyZWw6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZDogJ2VsZW1lbnQnIHwgJ2dyb3VwJyB8ICdwYWdlJyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXJlbCB8fCBzZWVuRmlsZS5oYXMocmVsKSkgcmV0dXJuO1xuICAgICAgICBzZWVuRmlsZS5hZGQocmVsKTtcbiAgICAgICAgY29uc3QgaW5BcmNoaXZlID0gYnVuZGxlZC5oYXMocmVsKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgcGF0aDogcmVsLFxuICAgICAgICAgIGFyY2hpdmVQYXRoOiBpbkFyY2hpdmUgPyBhcmNoaXZlTGVhZihyZWwpIDogbnVsbCxcbiAgICAgICAgICBraW5kLCB1aWQ6IGUudWlkLCBuOiBlLm4sXG4gICAgICAgICAgc2VsZWN0b3I6IGUuc2VsZWN0b3IsIHVybDogZS51cmwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICAgIHB1c2hGaWxlKGUuc2NyZWVuc2hvdD8uZ3JvdXAsICdncm91cCcpO1xuICAgICAgcHVzaEZpbGUoZS5zY3JlZW5zaG90Py5wYWdlLCAncGFnZScpO1xuICAgIH1cbiAgICBjb25zdCBvdXQgPSB7XG4gICAgICB2OiAyLFxuICAgICAga2luZDogJ3BpbmNoZ3JhYi9zY3JlZW5zaG90cy1pbmRleCcsXG4gICAgICBnZW5lcmF0ZWQ6IG5vd0lzbyA/PyBleHBvcnROb3dJc28oKSxcbiAgICAgIGNvdW50czoge1xuICAgICAgICBmaWxlczogZmlsZXMubGVuZ3RoLFxuICAgICAgICBidW5kbGVkOiBmaWxlcy5maWx0ZXIoKGYpID0+IGYuYXJjaGl2ZVBhdGgpLmxlbmd0aCxcbiAgICAgICAgY2FwdHVyZXM6IE9iamVjdC5rZXlzKGJ5VWlkKS5sZW5ndGgsXG4gICAgICAgIHVybHM6IE9iamVjdC5rZXlzKGJ5VXJsKS5sZW5ndGgsXG4gICAgICB9LFxuICAgICAgYnlVaWQsXG4gICAgICBieVVybCxcbiAgICAgIGZpbGVzLFxuICAgIH07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikgKyAnXFxuJztcbiAgfTtcblxuICAvLyBEZWNvZGUgYSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLmAgVVJMIGludG8gdGhlIHJhdyBQTkcgYnl0ZXMuXG4gIGNvbnN0IGRhdGFVcmxUb0J5dGVzID0gKGRhdGFVcmw6IHN0cmluZyk6IFVpbnQ4QXJyYXkgPT4ge1xuICAgIGNvbnN0IGNvbW1hID0gZGF0YVVybC5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGNvbW1hIDwgMCkgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgY29uc3QgYjY0ID0gZGF0YVVybC5zbGljZShjb21tYSArIDEpO1xuICAgIGNvbnN0IGJpbmFyeSA9IGF0b2IoYjY0KTtcbiAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykgb3V0W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICAvLyBXYWxrIHRoZSBtZXNzYWdlcyBhbmQgZ2F0aGVyIGV2ZXJ5IHNjcmVlbnNob3Qgd2Ugc2hvdWxkIGJ1bmRsZS5cbiAgLy8gUmV0dXJucyB0aGUgdGFyIGVudHJpZXMgKGVhY2ggYHNjcmVlbnNob3RzLzxsZWFmPi5wbmdgKSBBTkQgdGhlIHNldCBvZlxuICAvLyB3b3Jrc3BhY2UtcmVsYXRpdmUgUE5HIHBhdGhzIHRoYXQgbGFuZGVkIGluIHRoZSBhcmNoaXZlIChmb3IgdGhlXG4gIC8vIG1hbmlmZXN0J3MgXCJpbi1hcmNoaXZlXCIgY29sdW1uKS5cbiAgY29uc3QgY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzID0gKCk6IHtlbnRyaWVzOiBUYXJFbnRyeVtdOyBidW5kbGVkOiBTZXQ8c3RyaW5nPn0gPT4ge1xuICAgIGNvbnN0IGVudHJpZXM6IFRhckVudHJ5W10gPSBbXTtcbiAgICBjb25zdCBidW5kbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHB1c2ggPSAocmVsUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLCBkYXRhVXJsOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgIGlmICghcmVsUGF0aCB8fCAhZGF0YVVybCkgcmV0dXJuO1xuICAgICAgY29uc3QgbGVhZiA9IHJlbFBhdGguc3BsaXQoJy8nKS5wb3AoKSA/PyByZWxQYXRoO1xuICAgICAgaWYgKHNlZW4uaGFzKGxlYWYpKSByZXR1cm47IC8vIGRlZHVwZSB3aXRoaW4gYXJjaGl2ZVxuICAgICAgY29uc3QgYnl0ZXMgPSBkYXRhVXJsVG9CeXRlcyhkYXRhVXJsKTtcbiAgICAgIGlmICghYnl0ZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICBlbnRyaWVzLnB1c2goe25hbWU6IGBzY3JlZW5zaG90cy8ke2xlYWZ9YCwgZGF0YTogYnl0ZXN9KTtcbiAgICAgIGJ1bmRsZWQuYWRkKHJlbFBhdGgpO1xuICAgICAgc2Vlbi5hZGQobGVhZik7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtLnR5cGUgIT09ICdzZWxlY3RvcicpIGNvbnRpbnVlO1xuICAgICAgY29uc3Qgc2VsID0gbS5lbnRyeS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHVybCA9IG0uZW50cnkudXJsO1xuICAgICAgcHVzaChtLmVudHJ5LnNjcmVlbnNob3Q/LmVsZW1lbnQsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8uZ3JvdXAsIHNob3RzRnVsbC5nZXQoc2VsKSk7XG4gICAgICBwdXNoKG0uZW50cnkuc2NyZWVuc2hvdD8ucGFnZSwgc2hvdHNGdWxsLmdldCgncGFnZTo6JyArIHVybCkpO1xuICAgIH1cbiAgICByZXR1cm4ge2VudHJpZXMsIGJ1bmRsZWR9O1xuICB9O1xuXG4gIGNvbnN0IG9uRXhwb3J0WmlwID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7IHNldFN0YXR1cygnTm90aGluZyB0byBleHBvcnQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIC8vIE9uZSBjbG9jayArIG9uZSBjb250ZW50IGhhc2ggcGVyIGV4cG9ydDogZXZlcnkgdGltZXN0YW1wIGFuZCB0aGVcbiAgICAvLyBmaWxlbmFtZSBzdGVtIGRlcml2ZSBmcm9tIHRoZXNlIHNvIHJlLWV4cG9ydGluZyB1bmNoYW5nZWQgY29udGVudFxuICAgIC8vIHByb2R1Y2VzIHRoZSBzYW1lIGZpbGVuYW1lIChvdmVyd3JpdHRlbiwgbm90IGR1cGxpY2F0ZWQpIGFuZCDigJQgd2l0aFxuICAgIC8vIGEgZnJvemVuIGNsb2NrIOKAlCBieXRlLWlkZW50aWNhbCBhcmNoaXZlcy5cbiAgICBjb25zdCBleHBvcnRlZEF0SXNvID0gZXhwb3J0Tm93SXNvKCk7XG4gICAgY29uc3QgbXRpbWVTZWMgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoZXhwb3J0ZWRBdElzbykgLyAxMDAwKTtcbiAgICBjb25zdCB7ZW50cmllczogc2hvdEVudHJpZXMsIGJ1bmRsZWR9ID0gY29sbGVjdFNjcmVlbnNob3RFbnRyaWVzKCk7XG4gICAgY29uc3QgY29udGVudEhhc2ggPSBhd2FpdCBjb21wdXRlQ29udGVudEhhc2goc2hvdEVudHJpZXMubWFwKChlKSA9PiBlLm5hbWUpKTtcbiAgICBjb25zdCBidW5kbGVJZCA9IGNvbnRlbnRIYXNoLnNsaWNlKDAsIDE2KTtcbiAgICBjb25zdCBhcmNoaXZlTmFtZSA9IGJ1aWxkRXhwb3J0RmlsZW5hbWUoJ3Rhci56c3QnLCBjb250ZW50SGFzaC5zbGljZSgwLCA4KSk7XG4gICAgY29uc3Qgc3RlbSA9IGFyY2hpdmVOYW1lLnJlcGxhY2UoL1xcLnRhclxcLnpzdCQvLCAnJyk7XG4gICAgY29uc3QganNvbmxOYW1lID0gYCR7c3RlbX0uanNvbmxgO1xuICAgIGNvbnN0IG1hbmlmZXN0T3B0cyA9IHtub3dJc286IGV4cG9ydGVkQXRJc28sIGJ1bmRsZUlkfTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IGJ1aWxkTWFuaWZlc3QoYXJjaGl2ZU5hbWUsICd0YXIuenN0JywgbWFuaWZlc3RPcHRzKTtcbiAgICAvLyBUaGUgSlNPTkwgaW5zaWRlIHRoZSBhcmNoaXZlIG11c3QgZGVjbGFyZSBpdHNlbGYgYXMgcGFydCBvZiBhXG4gICAgLy8gdGFyLnpzdCBidW5kbGUgc28gaXRzIG1hbmlmZXN0J3MgYGRlc2lnbi5pbmxpbmVgIC8gYHNraWxsLmlubGluZWBcbiAgICAvLyBmbGFncyBtYXRjaCB3aGF0J3MgYWN0dWFsbHkgcHJlc2VudCBpbiB0aGUgc3Vycm91bmRpbmcgdGFyLlxuICAgIGNvbnN0IGpzb25sVGV4dCA9IGJ1aWxkSnNvbmwoanNvbmxOYW1lLCAndGFyLnpzdCcsIG1hbmlmZXN0T3B0cyk7XG4gICAgY29uc3Qgc3FsID0gZHVja0RiU25pcHBldChqc29ubE5hbWUpO1xuICAgIGNvbnN0IHJlYWRtZSA9IGJ1aWxkUmVhZG1lKG1hbmlmZXN0LCBqc29ubE5hbWUsIHNob3RFbnRyaWVzLmxlbmd0aCk7XG4gICAgY29uc3Qgc2hvdHNKc29uID0gYnVpbGRTY3JlZW5zaG90c0luZGV4KGJ1bmRsZWQsIGV4cG9ydGVkQXRJc28pO1xuXG4gICAgLy8gTWFya2Rvd24gZXhwb3J0IHdhcyBkcm9wcGVkOiBpdCBjYXJyaWVkIG5vIGRhdGEgdGhlIEpTT05MIGRpZG4ndFxuICAgIC8vIGFscmVhZHkgaGF2ZSAodGhlIGh1bWFuLXJlYWRhYmxlIHN1cmZhY2Ugd2FzIGp1c3QgYSBjdXJhdGVkIHN1YnNldFxuICAgIC8vIG9mIHRoZSBzYW1lIGZpZWxkcyksIGFuZCB0aGUgZGl2ZXJnZW5jZSDigJQgbWQgc2lsZW50bHkgZHJvcHBlZFxuICAgIC8vIGdyb3VwIGNoaWxkcmVuICsgdGhlIGVudGlyZSBgX2F1ZGl0YCBuYW1lc3BhY2Ug4oCUIHJpc2tlZFxuICAgIC8vIG1pc2xlYWRpbmcgYW55IGh1bWFuIHNraW0uIFJFQURNRS5tZCBpbnNpZGUgdGhlIGFyY2hpdmUgaXMgdGhlXG4gICAgLy8gaHVtYW4gZW50cnkgcG9pbnQgbm93LlxuICAgIC8vIEJ1ZyAjNzogZ2VuZXJhdGUgcmVwYWlyLWluZGV4Lm1kIGFzIHRoZSBhZ2VudCdzIGZpcnN0LXJlYWQgZW50cnlcbiAgICAvLyBwb2ludC4gQnVnICM0MCBmaXJzdC1yZWFkIG9yZGVyOiBSRUFETUUgcG9pbnRzIHRoZSByZWNlaXZlciBhdFxuICAgIC8vIHJlcGFpci1pbmRleC5tZCBiZWZvcmUgU0tJTEwubWQgLyBERVNJR04ubWQuXG4gICAgY29uc3QgcmVwYWlySW5kZXggPSBidWlsZFJlcGFpckluZGV4KG1hbmlmZXN0LCBqc29ubE5hbWUpO1xuICAgIGNvbnN0IHRhckVudHJpZXM6IFRhckVudHJ5W10gPSBbXG4gICAgICB7bmFtZTogJ1JFQURNRS5tZCcsIGRhdGE6IHJlYWRtZX0sXG4gICAgICB7bmFtZTogJ3JlcGFpci1pbmRleC5tZCcsIGRhdGE6IHJlcGFpckluZGV4fSxcbiAgICAgIHtuYW1lOiBqc29ubE5hbWUsIGRhdGE6IGpzb25sVGV4dH0sXG4gICAgICB7bmFtZTogJ3NjcmVlbnNob3RzLmpzb24nLCBkYXRhOiBzaG90c0pzb259LFxuICAgICAge25hbWU6ICdkdWNrZGIuc3FsJywgZGF0YTogc3FsfSxcbiAgICAgIC8vIEJ1ZyAjMjg6IG1hY2hpbmUtcmVhZGFibGUgSlNPTi1TY2hlbWEgZm9yIGV2ZXJ5IHJvdyB0eXBlLlxuICAgICAge25hbWU6ICdzY2hlbWEuanNvbicsIGRhdGE6IGJ1aWxkU2NoZW1hSnNvbigpfSxcbiAgICAgIC4uLnNob3RFbnRyaWVzLFxuICAgIF07XG4gICAgLy8gREVTSUdOLm1kIOKAlCBlaXRoZXIgdGhlIHVzZXIncyBjdXN0b21pemVkIGNvbnRlbnQgb3IgdGhlIGJ1bmRsZWRcbiAgICAvLyB0ZW1wbGF0ZSAvIGxvY2FsIG92ZXJyaWRlLiBSZXNvbHZlZCB0aHJvdWdoIHRoZSBzYW1lIGxvYWRlciB0aGVcbiAgICAvLyBzZXR0aW5ncyBtb2RhbCB1c2VzIHNvIGNocm9tZS5zdG9yYWdlIHN0YXlzIHNtYWxsIChlbXB0eSBwcmVmc1xuICAgIC8vIOKGkiBmYWxsYmFjayB0byBleHRlbnNpb24vdGVtcGxhdGVzLyoubWQgdmlhIGZldGNoKS5cbiAgICBjb25zdCBkZXNpZ25Db250ZW50ID0gYXdhaXQgcmVzb2x2ZURlc2lnbkNvbnRlbnQoKTtcbiAgICBpZiAoZGVzaWduQ29udGVudC50cmltKCkpIHtcbiAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogJ0RFU0lHTi5tZCcsIGRhdGE6IGRlc2lnbkNvbnRlbnR9KTtcbiAgICB9XG4gICAgLy8gUGluY2hHcmFiIFVJIHNraWxsIOKAlCBzYW1lIHN0b3J5LiBMaXZlcyBhdCB0aGUgY2Fub25pY2FsIHJlY2VpdmVyXG4gICAgLy8gcGF0aCBpbnNpZGUgdGhlIGFyY2hpdmUgc28gdGhlIHJlY2VpdmVyJ3MgYC5hZ2VudHMvYCB0cmVlIGNhbiBiZVxuICAgIC8vIHBvcHVsYXRlZCBieSBhIHNpbXBsZSBgdGFyIC14YCBmcm9tIHRoZSBhcmNoaXZlIHJvb3QuXG4gICAgLy9cbiAgICAvLyBGcm9udG1hdHRlciByZW5hbWU6IGEgdXNlcidzIHNvdXJjZSBTS0lMTC5tZCBtYXkgdXNlIGBuYW1lOiB1aWBcbiAgICAvLyAoYmVjYXVzZSB0aGF0J3MgaG93IGl0J3MgY2F0YWxvZ3VlZCBpbiB0aGVpciBnbG9iYWwgYC5hZ2VudHMvYFxuICAgIC8vIHNraWxscyB0cmVlKS4gSW5zaWRlIGEgUGluY2hHcmFiIGFyY2hpdmUgdGhlIHNraWxsIGlzICp0aGUqXG4gICAgLy8gUGluY2hHcmFiIHNraWxsLCBzbyB3ZSByZWJyYW5kIHRoZSBmcm9udG1hdHRlciBgbmFtZTpgIGZpZWxkIG9uXG4gICAgLy8gdGhlIHdheSBpbnRvIHRoZSB0YXIgd2l0aG91dCB0b3VjaGluZyB0aGUgYm9keS4gT25seSB0aGUgRklSU1RcbiAgICAvLyBgbmFtZTpgIGxpbmUgaW5zaWRlIHRoZSBsZWFkaW5nIGAtLS1gIGJsb2NrIGlzIHJld3JpdHRlbi5cbiAgICBjb25zdCBza2lsbENvbnRlbnQgPSBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgaWYgKHNraWxsQ29udGVudC50cmltKCkpIHtcbiAgICAgIGNvbnN0IHJlYnJhbmRlZCA9IHJlYnJhbmRTa2lsbE5hbWUoc2tpbGxDb250ZW50LCAnUGluY2hHcmFiJyk7XG4gICAgICB0YXJFbnRyaWVzLnB1c2goe25hbWU6ICcuYWdlbnRzL3NraWxscy9QaW5jaEdyYWIvU0tJTEwubWQnLCBkYXRhOiByZWJyYW5kZWR9KTtcbiAgICB9XG4gICAgLy8gVmVuZG9yZWQgdGhpcmQtcGFydHkgZGVzaWduIHNraWxscyArIHNraWxscy1pbmRleC5qc29uIOKAlCB0aGUgbG9jYXRvclxuICAgIC8vIHN1cmZhY2UgdGhlIFNlbmQtdG8tQWdlbnQgcHJvdG9jb2wncyBtYXBwZWRfc2tpbGxzIHBoYXNlIGNpdGVzLlxuICAgIC8vIFBlci1maWxlIGZhaWx1cmVzIHdhcm4gKyBza2lwOyBhbiBleHBvcnQgbmV2ZXIgaGFyZC1mYWlscyBvbiBhXG4gICAgLy8gbWlzc2luZyBza2lsbCByZXNvdXJjZS5cbiAgICBpZiAocHJlZnMuYnVuZGxlU2tpbGxzICYmIEJVTkRMRURfU0tJTExTX1BSRVNFTlQpIHtcbiAgICAgIGNvbnN0IGxvYWRlZCA9IGF3YWl0IFByb21pc2UuYWxsKEJVTkRMRURfU0tJTExfRklMRVMubWFwKGFzeW5jIChmKSA9PiAoe2YsIGRhdGE6IGF3YWl0IGxvYWRCdW5kbGVkU2tpbGxGaWxlKGYuZXh0KX0pKSk7XG4gICAgICBsZXQgc2tpcHBlZCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IHtmLCBkYXRhfSBvZiBsb2FkZWQpIHtcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkgeyBza2lwcGVkKys7IGNvbnRpbnVlOyB9XG4gICAgICAgIHRhckVudHJpZXMucHVzaCh7bmFtZTogZi5hcmNoaXZlLCBkYXRhfSk7XG4gICAgICB9XG4gICAgICBpZiAoc2tpcHBlZCkgY29uc29sZS53YXJuKExPRywgYGJ1bmRsZWQgc2tpbGxzOiAke3NraXBwZWR9LyR7bG9hZGVkLmxlbmd0aH0gZmlsZXMgbWlzc2luZyBmcm9tIHRoaXMgYnVpbGQg4oCUIGV4cG9ydCBjb250aW51ZXMgd2l0aG91dCB0aGVtYCk7XG4gICAgfVxuICAgIC8vIFJlYnVpbGQgdGhlIG1hbmlmZXN0IGxpbmUgaW4gdGhlIEpTT05MIHdpdGggYXJjaGl2ZUludGVncml0eVxuICAgIC8vIChmaWxlIGxpc3QgKyBzaXplcykuIEhhcyB0byBoYXBwZW4gQUZURVIgYWxsIHRhckVudHJpZXMgYXJlXG4gICAgLy8gYXNzZW1ibGVkIGJ1dCBCRUZPUkUgd2UgdGFyIHRoZW0sIHNvIHdlIGtub3cgd2hhdCdzIGluIHRoZVxuICAgIC8vIGJ1bmRsZS4gVGhlbiB3ZSByZXBsYWNlIHRoZSBKU09OTCdzIG1hbmlmZXN0IHdpdGggdGhlIGF1Z21lbnRlZFxuICAgIC8vIHZlcnNpb24uXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGludGVncml0eToge2ZpbGVzOiBBcnJheTx7cGF0aDogc3RyaW5nOyBzaXplOiBudW1iZXJ9Pn0gPSB7ZmlsZXM6IFtdfTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiB0YXJFbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShlLmRhdGEpIDogKGUuZGF0YSBhcyBVaW50OEFycmF5KTtcbiAgICAgICAgaW50ZWdyaXR5LmZpbGVzLnB1c2goe3BhdGg6IGUubmFtZSwgc2l6ZTogZGF0YS5sZW5ndGh9KTtcbiAgICAgIH1cbiAgICAgIC8vIFJlLWVtaXQgdGhlIEpTT05MIHdpdGggdGhlIGF1Z21lbnRlZCBtYW5pZmVzdC4gQ2hlYXBlciB0byBkb1xuICAgICAgLy8gdGhpcyByZS1yZW5kZXIgdGhhbiB0byBtYWludGFpbiBtdXRhYmxlIHN0YXRlIHRocm91Z2ggdGhlIHNsaW1cbiAgICAgIC8vIGVtaXQuIFdlIHN3YXAgdGhlIGxlYWRpbmcgbWFuaWZlc3QgbGluZSBpbi1wbGFjZS5cbiAgICAgIGNvbnN0IGF1Z21lbnRlZE1hbmlmZXN0ID0gey4uLm1hbmlmZXN0LCBhcmNoaXZlSW50ZWdyaXR5OiBpbnRlZ3JpdHl9O1xuICAgICAgY29uc3QgbGluZXMgPSBqc29ubFRleHQuc3BsaXQoJ1xcbicpO1xuICAgICAgbGluZXNbMF0gPSBKU09OLnN0cmluZ2lmeShhdWdtZW50ZWRNYW5pZmVzdCk7XG4gICAgICBjb25zdCBuZXdKc29ubCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgY29uc3QgaWR4ID0gdGFyRW50cmllcy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0ganNvbmxOYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkgdGFyRW50cmllc1tpZHhdID0ge25hbWU6IGpzb25sTmFtZSwgZGF0YTogbmV3SnNvbmx9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKExPRywgJ2FyY2hpdmVJbnRlZ3JpdHkgY29tcHV0YXRpb24gZmFpbGVkJywgZXJyKTtcbiAgICB9XG5cbiAgICAvLyBTdGFtcCBldmVyeSBlbnRyeSB3aXRoIHRoZSBleHBvcnQgY2xvY2sgc28gYXJjaGl2ZSBieXRlcyBhcmUgYSBwdXJlXG4gICAgLy8gZnVuY3Rpb24gb2YgY29udGVudCArIGNsb2NrIChidWlsZFRhciB3b3VsZCBvdGhlcndpc2Ugc2FtcGxlIG5vdygpKS5cbiAgICBmb3IgKGNvbnN0IGUgb2YgdGFyRW50cmllcykgZS5tdGltZSA/Pz0gbXRpbWVTZWM7XG4gICAgY29uc3QgdGFyQnl0ZXMgPSBidWlsZFRhcih0YXJFbnRyaWVzKTtcbiAgICBjb25zdCBhcmNoaXZlQnl0ZXMgPSB3cmFwWnN0ZCh0YXJCeXRlcyk7XG5cbiAgICBpZiAoaW5FeHRlbnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKExPRywgJ29uRXhwb3J0QXJjaGl2ZSDihpInLCB7YXJjaGl2ZU5hbWUsIHRhckJ5dGVzOiB0YXJCeXRlcy5sZW5ndGgsIGFyY2hpdmVCeXRlczogYXJjaGl2ZUJ5dGVzLmxlbmd0aCwgc2NyZWVuc2hvdHM6IHNob3RFbnRyaWVzLmxlbmd0aH0pO1xuICAgICAgLy8gUGFzcyBhcyBhIHBsYWluIG51bWJlcltdIG92ZXIgc2VuZE1lc3NhZ2U7IHN0cnVjdHVyZWQtY2xvbmUgb2ZcbiAgICAgIC8vIFVpbnQ4QXJyYXkgdmlhIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIGlzbid0IHJlbGlhYmxlIGFjcm9zc1xuICAgICAgLy8gQ2hyb21lIHZlcnNpb25zLlxuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBzZW5kVG9CZzxTYXZlUmVwbHk+KHtcbiAgICAgICAga2luZDogJ3NhdmUtYnl0ZXMnLCB3b3Jrc3BhY2U6IGFjdGl2ZVdzLCBmaWxlbmFtZTogYXJjaGl2ZU5hbWUsXG4gICAgICAgIGJ5dGVzOiBBcnJheS5mcm9tKGFyY2hpdmVCeXRlcyksIG1pbWU6ICdhcHBsaWNhdGlvbi96c3RkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coTE9HLCAnb25FeHBvcnRBcmNoaXZlIHJlcGx5OicsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseT8ub2sgJiYgcmVwbHkuYWJzUGF0aCkge1xuICAgICAgICBsYXN0RXhwb3J0LnJlbFBhdGggPSByZXBseS5maWxlbmFtZSA/PyBudWxsO1xuICAgICAgICBsYXN0RXhwb3J0LmFic1BhdGggPSByZXBseS5hYnNQYXRoO1xuICAgICAgICBsYXN0RXhwb3J0LmNvcHlQYXRoID0gcmVwbHkuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgbGFzdEV4cG9ydC50ZW1wUGF0aCA9IEJvb2xlYW4ocmVwbHkudGVtcFBhdGgpO1xuICAgICAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgICAgIHVwZGF0ZUNvcHlQYXRoQnV0dG9uKCk7XG4gICAgICAgIC8vIEF1dG8tY29weSB0aGUgYWJzb2x1dGUgcGF0aCB0byBjbGlwYm9hcmQgc28gdGhlIHVzZXIgZG9lc24ndFxuICAgICAgICAvLyBoYXZlIHRvIGh1bnQgZm9yIGl0LiBUaGUgdG9vbGJhciBjb2xsYXBzZWQgdGhlIGRlZGljYXRlZFxuICAgICAgICAvLyBcImNvcHkgcGF0aFwiIGJ1dHRvbiBpbnRvIHRoaXMgc2luZ2xlIGFjdGlvbi5cbiAgICAgICAgY29uc3QgcGF0aFRvQ29weSA9IGxhc3RFeHBvcnQuY29weVBhdGggPz8gcmVwbHkuYWJzUGF0aDtcbiAgICAgICAgY29uc3QgcGF0aENvcGllZCA9IGF3YWl0IGNvcHlUb0NsaXBib2FyZFNpbGVudChwYXRoVG9Db3B5KTtcbiAgICAgICAgY29uc3QgbGVhZiA9IHBhdGhUb0NvcHkucmVwbGFjZSgvW1xcXFwvXSskLywgJycpLnNwbGl0KC9bXFxcXC9dLykucG9wKCkgPz8gcGF0aFRvQ29weTtcbiAgICAgICAgaWYgKHBhdGhDb3BpZWQpIHNob3dDb3BpZWQoJ0V4cG9ydGVkIGFuZCBjb3BpZWQnLCBsZWFmKTtcbiAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgIGBFeHBvcnRlZCDCtyAke3Nob3RFbnRyaWVzLmxlbmd0aH0gc2NyZWVuc2hvdCR7c2hvdEVudHJpZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IGJ1bmRsZWQke3BhdGhDb3BpZWQgPyAnIMK3IHBhdGggY29waWVkJyA6ICcnfSR7bGFzdEV4cG9ydC50ZW1wUGF0aCA/ICcgwrcgUGxheXdyaWdodCB0ZW1wIGhpZGRlbicgOiAnJ30gwrcgJHtsZWFmfWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVyciA9IHJlcGx5Py5lcnJvciA/PyAnbm8gcmVwbHkgZnJvbSBiYWNrZ3JvdW5kJztcbiAgICAgIGNvbnNvbGUuZXJyb3IoTE9HLCAnb25FeHBvcnRBcmNoaXZlIGZhaWxlZDonLCBlcnIpO1xuICAgICAgc2V0U3RhdHVzKGBBcmNoaXZlIGV4cG9ydCBmYWlsZWQ6ICR7ZXJyfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgICAgIHNob3dEb3dubG9hZEVycm9yKCdFeHBvcnQgZmFpbGVkJywgU3RyaW5nKGVycikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBUZXN0L2RldiBmYWxsYmFjazogc3ludGhlc2l6ZSBhIGRvd25sb2FkIGxpbmsuXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFthcmNoaXZlQnl0ZXMgYXMgdW5rbm93biBhcyBCbG9iUGFydF0sIHt0eXBlOiAnYXBwbGljYXRpb24venN0ZCd9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gYXJjaGl2ZU5hbWU7IGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG4gICAgbGFzdEV4cG9ydC5yZWxQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5hYnNQYXRoID0gYXJjaGl2ZU5hbWU7XG4gICAgbGFzdEV4cG9ydC5jb3B5UGF0aCA9IGFyY2hpdmVOYW1lO1xuICAgIGxhc3RFeHBvcnQudGVtcFBhdGggPSBmYWxzZTtcbiAgICBsYXN0RXhwb3J0LmtpbmQgPSAndGFyLnpzdCc7XG4gICAgdXBkYXRlQ29weVBhdGhCdXR0b24oKTtcbiAgICBhd2FpdCBjb3B5VG9DbGlwYm9hcmRTaWxlbnQoYXJjaGl2ZU5hbWUpO1xuICAgIHNob3dDb3BpZWQoJ0V4cG9ydGVkIGFuZCBjb3BpZWQnLCBhcmNoaXZlTmFtZSk7XG4gICAgc2V0U3RhdHVzKGBXb3Jrc3BhY2UgZXhwb3J0ZWQgwrcgJHtzaG90RW50cmllcy5sZW5ndGh9IHNjcmVlbnNob3Qke3Nob3RFbnRyaWVzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfSBidW5kbGVkIMK3IHBhdGggY29waWVkYCk7XG4gIH07XG5cbiAgLy8gQmVzdC1lZmZvcnQgY2xpcGJvYXJkIHdyaXRlIOKAlCBuZXZlciB0aHJvd3M7IHJldHVybnMgd2hldGhlciB0aGVcbiAgLy8gd3JpdGUgc3VjY2VlZGVkIHNvIHRoZSBjYWxsZXIgY2FuIGFkanVzdCB0aGUgc3RhdHVzIG1lc3NhZ2UuXG4gIC8vIENsaXBib2FyZCB3cml0ZXMgY2FuIGZhaWwgd2hlbiB0aGUgcGFuZWwgZG9lc24ndCBoYXZlIGZvY3VzIG9yIGluXG4gIC8vIHNvbWUgdGVzdCBoYXJuZXNzZXMsIGFuZCB3ZSBkb24ndCB3YW50IHRoYXQgdG8gYmxvY2sgdGhlIGV4cG9ydC5cbiAgY29uc3QgY29weVRvQ2xpcGJvYXJkU2lsZW50ID0gYXN5bmMgKHRleHQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIHRyeSB7IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpOyByZXR1cm4gdHJ1ZTsgfVxuICAgIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBEdWNrREIgc25pcHBldCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gQ2Fub25pY2FsIFNRTCByZWNpcGVzIGZvciBxdWVyeWluZyBhIEpTT05MIGV4cG9ydC4gQ29waWVzIHRvIGNsaXBib2FyZFxuICAvLyBhbmQgcHJpbnRzIGEgc3RhdHVzIG1lc3NhZ2Ug4oCUIHdlIGRvbid0IHJ1biBEdWNrREIgb3Vyc2VsdmVzLCB0aGUgdXNlclxuICAvLyBwaXBlcyB0aGUgc25pcHBldCBpbnRvIGBkdWNrZGJgIG9uIHRoZWlyIG1hY2hpbmUuIFRoZSByZWNpcGVzIHRhcmdldFxuICAvLyBxdWVzdGlvbnMgYSBVSS1lbmdpbmVlciBMTE0gd29ya2Zsb3cgdGVuZHMgdG8gYXNrOiBsaXN0IGNhcHR1cmVzIGJ5XG4gIC8vIGhvc3QsIGZpbmQgZHVwbGljYXRlIG91dGVySFRNTCwgZmluZCBjYXB0dXJlcyBtaXNzaW5nIGEgc2NyZWVuc2hvdCxcbiAgLy8gYW5kIHVuaXF1ZS10b2tlbiBmcmVxdWVuY3kgZm9yIGEgcXVpY2sgZGVzaWduLXRva2VucyBvdmVydmlldy5cbiAgY29uc3QgZHVja0RiU25pcHBldCA9IChqc29ubE5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiBgLS0gUGluY2hHcmFiIOKGkiBEdWNrREIgcmVjaXBlc1xuLS0gU2F2ZSB5b3VyIEpTT05MIGV4cG9ydCwgdGhlbiBpbiB5b3VyIHNoZWxsOlxuLS0gICBkdWNrZGIgPCB0aGlzX2ZpbGUuc3FsXG4tLSBPciBvcGVuIGEgZHVja2RiIHNoZWxsIGFuZCBwYXN0ZSB0aGVzZSBvbmUgYXQgYSB0aW1lLlxuXG4tLSAxKSBMb2FkIHRoZSBKU09OTCBpbnRvIGEgdGFibGUuXG4tLSAgICBzYW1wbGVfc2l6ZT0tMSBmb3JjZXMgYSBmdWxsLWZpbGUgc2NhbiBmb3Igc2NoZW1hIGluZmVyZW5jZS4gV2l0aG91dFxuLS0gICAgaXQsIER1Y2tEQiBvbmx5IHNuaWZmcyB0aGUgZmlyc3QgMjAgNDgwIHJvd3Mg4oCUIGFuZCBQaW5jaEdyYWIgZXhwb3J0c1xuLS0gICAgbWl4IHNlbGVjdG9yICsgZmVlZGJhY2sgcm93IHR5cGVzLCBzbyByYXJlIGZlZWRiYWNrLW9ubHkgZmllbGRzXG4tLSAgICAodGFncywgcGFyZW50VWlkKSBjYW4gYmUgZHJvcHBlZCBmcm9tIHRoZSBpbmZlcnJlZCBzY2hlbWEgaWYgdGhleVxuLS0gICAgZG9uJ3QgYXBwZWFyIGVhcmx5IGVub3VnaC4gVGhhdCBiaXRlcyByZWNpcGUgNiBiZWxvdy5cbkNSRUFURSBPUiBSRVBMQUNFIFRBQkxFIHBnIEFTXG5TRUxFQ1QgKiBGUk9NIHJlYWRfanNvbl9hdXRvKFxuICAnJHtqc29ubE5hbWV9JyxcbiAgZm9ybWF0PSduZXdsaW5lX2RlbGltaXRlZCcsXG4gIG1heGltdW1fb2JqZWN0X3NpemU9MTA0ODU3NjAwLFxuICBzYW1wbGVfc2l6ZT0tMVxuKTtcblxuLS0gMikgUXVpY2sgb3ZlcnZpZXc6IGhvdyBtYW55IGNhcHR1cmVzIHBlciBob3N0LlxuU0VMRUNUXG4gIHJlZ2V4cF9leHRyYWN0KHVybCwgJzovLyhbXi9dKyknLCAxKSBBUyBob3N0LFxuICBDT1VOVCgqKSBGSUxURVIgKFdIRVJFIHR5cGUgPSAnc2VsZWN0b3InKSBBUyBjYXB0dXJlcyxcbiAgQ09VTlQoKikgRklMVEVSIChXSEVSRSB0eXBlID0gJ2ZlZWRiYWNrJykgQVMgY29tbWVudHNcbkZST00gcGdcbkdST1VQIEJZIDFcbk9SREVSIEJZIGNhcHR1cmVzIERFU0M7XG5cbi0tIDMpIEZpbmQgZHVwbGljYXRlIG91dGVySFRNTCBhY3Jvc3MgY2FwdHVyZXMgKG9mdGVuIHNpZ25hbHMgYSByZXVzZWRcbi0tICAgIGNvbXBvbmVudCB0aGUgdXNlciBoYXMgY2xpY2tlZCBpbnRvIG11bHRpcGxlIHRpbWVzKS5cblNFTEVDVCBvdXRlckhUTUwsIENPVU5UKCopIEFTIGhpdHMsIGxpc3Qoc2VsZWN0b3IpIEFTIHNlbGVjdG9yc1xuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIG91dGVySFRNTCBJUyBOT1QgTlVMTFxuR1JPVVAgQlkgb3V0ZXJIVE1MXG5IQVZJTkcgaGl0cyA+IDFcbk9SREVSIEJZIGhpdHMgREVTQ1xuTElNSVQgMjU7XG5cbi0tIDQpIENhcHR1cmVzIHN0aWxsIG1pc3NpbmcgYSBzY3JlZW5zaG90IHBhdGguXG5TRUxFQ1QgbiwgdXJsLCBzZWxlY3RvclxuRlJPTSBwZ1xuV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIHNjcmVlbnNob3QgSVMgTlVMTFxuT1JERVIgQlkgbjtcblxuLS0gNSkgUXVpY2sgZGVzaWduLXRva2VuIHN1cmZhY2U6IHJhbmsgY2xhc3NlcyB0aGF0IGFwcGVhciBpbiBtYW55IGNhcHR1cmVzLlxuLS0gICAgTk9URTogZmlsdGVyIGNsYXNzZXMgSVMgTk9UIE5VTEwgcmF0aGVyIHRoYW4gdXNpbmcgYSBjb2FsZXNjZS13aXRoLWVtcHR5XG4tLSAgICBmYWxsYmFjazsgRHVja0RCIGNhbm5vdCBpbmZlciBlbGVtZW50IHR5cGVzIGZvciBhbiBlbXB0eSBsaXN0IGxpdGVyYWwuXG5XSVRIIGV4cGFuZGVkIEFTIChcbiAgU0VMRUNUIHVubmVzdChjbGFzc2VzKSBBUyBjXG4gIEZST00gcGdcbiAgV0hFUkUgdHlwZSA9ICdzZWxlY3RvcicgQU5EIGNsYXNzZXMgSVMgTk9UIE5VTExcbilcblNFTEVDVCBjLCBDT1VOVCgqKSBBUyBoaXRzXG5GUk9NIGV4cGFuZGVkXG5HUk9VUCBCWSAxXG5PUkRFUiBCWSBoaXRzIERFU0NcbkxJTUlUIDMwO1xuXG4tLSA2KSBDb21tZW50cyBqb2luZWQgdG8gdGhlaXIgcGFyZW50IHNlbGVjdG9yIHZpYSBwYXJlbnRVaWQuIFRoZVxuLS0gICAgcy50eXBlIGZpbHRlciBwcmV2ZW50cyBhbiBhY2NpZGVudGFsIGZlZWRiYWNr4oaUZmVlZGJhY2sgam9pbiBpbiBjYXNlXG4tLSAgICB0d28gcm93cyBldmVyIHNoYXJlIGEgdWlkIGJ5IGNvaW5jaWRlbmNlLlxuU0VMRUNUIHMubiwgcy5zZWxlY3RvciwgZi50ZXh0LCBmLnRhZ3NcbkZST00gcGcgZlxuSk9JTiBwZyBzXG4gIE9OIHMudWlkID0gZi5wYXJlbnRVaWRcbiBBTkQgcy50eXBlID0gJ3NlbGVjdG9yJ1xuV0hFUkUgZi50eXBlID0gJ2ZlZWRiYWNrJ1xuT1JERVIgQlkgcy5uO1xuYDtcbiAgY29uc3Qgb25EdWNrRGJTbmlwcGV0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIFByZWZlciB0aGUgSlNPTkwgZmlsZW5hbWUgb2YgdGhlIG1vc3QgcmVjZW50IGV4cG9ydCBzbyB0aGUgdXNlciBjYW5cbiAgICAvLyBwYXN0ZSB0aGlzIGRpcmVjdGx5IHdpdGhvdXQgZWRpdGluZyB0aGUgcmVhZF9qc29uX2F1dG8gcGF0aC4gRmFsbFxuICAgIC8vIGJhY2sgdG8gYSBmcmVzaCBlcG9jaC1iYXNlZCBuYW1lIGlmIG5vdGhpbmcgaGFzIGJlZW4gZXhwb3J0ZWQgeWV0LlxuICAgIGNvbnN0IGxhc3QgPSBsYXN0RXhwb3J0LnJlbFBhdGg7XG4gICAgY29uc3QganNvbmxOYW1lID0gKGxhc3QgJiYgL1xcLmpzb25sJC8udGVzdChsYXN0KSlcbiAgICAgID8gbGFzdC5zcGxpdCgnLycpLnBvcCgpISAgLy8gc3RyaXAgd29ya3NwYWNlL2V4cG9ydHMvIHByZWZpeFxuICAgICAgOiBidWlsZEV4cG9ydEZpbGVuYW1lKCdqc29ubCcpO1xuICAgIGNvbnN0IHNxbCA9IGR1Y2tEYlNuaXBwZXQoanNvbmxOYW1lKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3FsKTtcbiAgICAgIHNldFN0YXR1cyhgRHVja0RCIHJlY2lwZXMgY29waWVkIMK3IHBhc3RlIGludG8gXFxgZHVja2RiXFxgIHNoZWxsIMK3IHJlZmVyZW5jZXMgJHtqc29ubE5hbWV9YCk7XG4gICAgICBzaG93Q29waWVkKCdDb3BpZWQgRHVja0RCIFNRTCcsIGpzb25sTmFtZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZXRTdGF0dXMoJ0NsaXBib2FyZCBmYWlsZWQg4oCUIG9wZW4gdGhlIHBhbmVsIGluIGFuIGV4dGVuc2lvbiBjb250ZXh0Jywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgc2hvd0Rvd25sb2FkRXJyb3IoJ0NsaXBib2FyZCBmYWlsZWQnLCAnT3BlbiB0aGUgcGFuZWwgaW4gYW4gZXh0ZW5zaW9uIGNvbnRleHQnKTtcbiAgICB9XG4gIH07XG4gIC8vIOKUgOKUgOKUgCBTY2hlbWEgbWlncmF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvLyBDb252ZXJ0IGEgdjEtc2hhcGVkIEVudHJ5LW9yLWV4cG9ydC1saW5lIGludG8gb3VyIGludGVybmFsIEVudHJ5LiBJZGVtcG90ZW50LlxuICAvLyBTdXBwb3J0czpcbiAgLy8gICDigKIgZmxhdCB2MSBlbnRyeSAobm8gYF9hdWRpdGAsIG5vIGB2YCBmaWVsZClcbiAgLy8gICDigKIgdjIgZXhwb3J0IGVudHJ5IChoYXMgYF9hdWRpdGAsIGB2OiAyYCwgYHR5cGU6ICdzZWxlY3RvcidgKVxuICAvLyAgIOKAoiBtaXhlZCAoc29tZSBmaWVsZHMgbmVzdGVkLCBzb21lIGZsYXQg4oCUIGxhc3Qgd2lucyBmb3Igc2FmZXR5KVxuICAvLyBQdXJlOiBuZXZlciBtdXRhdGVzIGByYXdgIG9yIGFueSBvZiBpdHMgbmVzdGVkIG9iamVjdHMuIFJldHVybnMgYSBuZXdcbiAgLy8gZW50cnkgd2l0aCBhbGwgbWlncmF0aW9ucyBhcHBsaWVkLiBUb3VjaGVkIHN1Ym9iamVjdHMgKGF0dHJzLCBoaW50cyxcbiAgLy8gZ3JvdXAgbWVtYmVycykgYXJlIGNsb25lZCBiZWZvcmUgZWRpdDsgdW50b3VjaGVkIG9uZXMgc2hhcmUgcmVmcyB3aXRoXG4gIC8vIHJhdywgd2hpY2ggaXMgZmluZSBzaW5jZSB3ZSBuZXZlciB3cml0ZSB0byB0aGVtLlxuICBjb25zdCBkZW5vcm1hbGl6ZUVudHJ5ID0gKHJhdzogYW55KTogRW50cnkgPT4ge1xuICAgIGNvbnN0IG91dDogYW55ID0gey4uLnJhd307XG4gICAgZGVsZXRlIG91dC52O1xuICAgIGRlbGV0ZSBvdXQudHlwZTtcbiAgICBkZWxldGUgb3V0LmZlZWRiYWNrO1xuICAgIGlmIChvdXQuX2F1ZGl0ICYmIHR5cGVvZiBvdXQuX2F1ZGl0ID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgYSA9IG91dC5fYXVkaXQ7XG4gICAgICBpZiAoYS5hbmNlc3RvcnMgIT09IHVuZGVmaW5lZCkgb3V0LmFuY2VzdG9ycyA9IGEuYW5jZXN0b3JzO1xuICAgICAgaWYgKGEuY29tcG9uZW50Um9vdCAhPT0gdW5kZWZpbmVkKSBvdXQuY29tcG9uZW50Um9vdCA9IGEuY29tcG9uZW50Um9vdDtcbiAgICAgIGlmIChhLmluU2hhZG93RE9NICE9PSB1bmRlZmluZWQpIG91dC5pblNoYWRvd0RPTSA9IGEuaW5TaGFkb3dET007XG4gICAgICBpZiAoYS5wc2V1ZG9FbGVtZW50cyAhPT0gdW5kZWZpbmVkKSBvdXQucHNldWRvRWxlbWVudHMgPSBhLnBzZXVkb0VsZW1lbnRzO1xuICAgICAgaWYgKGEubWF0Y2hlZFJ1bGVzICE9PSB1bmRlZmluZWQpIG91dC5tYXRjaGVkUnVsZXMgPSBhLm1hdGNoZWRSdWxlcztcbiAgICAgIGlmIChhLnZpZXdwb3J0ICE9PSB1bmRlZmluZWQpIG91dC52aWV3cG9ydCA9IGEudmlld3BvcnQ7XG4gICAgICBkZWxldGUgb3V0Ll9hdWRpdDtcbiAgICB9XG4gICAgLy8gc3RhdGVzOiB2MSB1c2VkIFJlY29yZDxzdHJpbmcsIHRydWU+OyB2MiB1c2VzIHN0cmluZ1tdLiBOb3JtYWxpemUgYm90aC5cbiAgICBpZiAob3V0LnN0YXRlcyAmJiAhQXJyYXkuaXNBcnJheShvdXQuc3RhdGVzKSAmJiB0eXBlb2Ygb3V0LnN0YXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG91dC5zdGF0ZXMgPSBPYmplY3Qua2V5cyhvdXQuc3RhdGVzKS5maWx0ZXIoKGspID0+IEJvb2xlYW4oKG91dC5zdGF0ZXMgYXMgYW55KVtrXSkpO1xuICAgIH1cbiAgICAvLyBhdHRycy5mb3JtYXQg4oaSIGhpbnRzLmZvcm1hdC4gQ2xvbmUgYXR0cnMgZmlyc3Qgc28gd2UgZG9uJ3QgbXV0YXRlIHRoZVxuICAgIC8vIGNhbGxlcidzIG5lc3RlZCBvYmplY3QuIFNhbWUgZm9yIGhpbnRzICh3ZSBtYXkgbWVyZ2UgaW50byBpdCkuXG4gICAgaWYgKG91dC5hdHRycyAmJiB0eXBlb2Ygb3V0LmF0dHJzID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3V0LmF0dHJzLmZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGZtdCA9IG91dC5hdHRycy5mb3JtYXQ7XG4gICAgICBjb25zdCB7Zm9ybWF0OiBfZHJvcCwgLi4ucmVzdEF0dHJzfSA9IG91dC5hdHRycztcbiAgICAgIG91dC5hdHRycyA9IHJlc3RBdHRycztcbiAgICAgIG91dC5oaW50cyA9IHsuLi4ob3V0LmhpbnRzID8/IHt9KSwgZm9ybWF0OiBmbXR9O1xuICAgIH1cbiAgICBpZiAoIW91dC51aWQpIG91dC51aWQgPSBtc2dJZCgpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG91dC5ncm91cCkpIG91dC5ncm91cCA9IG91dC5ncm91cC5tYXAoZGVub3JtYWxpemVFbnRyeSk7XG4gICAgcmV0dXJuIG91dCBhcyBFbnRyeTtcbiAgfTtcbiAgLy8gV2FsayBhbGwgbG9hZGVkIG1lc3NhZ2VzIGFuZCBtaWdyYXRlIGFueSBsZWdhY3kgZW50cmllcy4gUmV0dXJucyB0cnVlIGlmXG4gIC8vIGFueXRoaW5nIG11dGF0ZWQgc28gdGhlIGNhbGxlciBjYW4gcGVyc2lzdC5cbiAgY29uc3QgbWlncmF0ZUxvYWRlZE1lc3NhZ2VzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGxldCBtdXRhdGVkID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IG0uZW50cnk7XG4gICAgICAvLyBDaGVhcCBwcmUtY2hlY2s6IGlmIHVpZCBleGlzdHMgQU5EIHN0YXRlcyBpcyBhbiBhcnJheSBBTkQgbm8gX2F1ZGl0XG4gICAgICAvLyBBTkQgbm8gYXR0cnMuZm9ybWF0IOKGkiBub3RoaW5nIHRvIGRvLCBza2lwIHRoZSB3b3JrLlxuICAgICAgY29uc3QgbmVlZHNXb3JrID1cbiAgICAgICAgIWJlZm9yZS51aWQgfHxcbiAgICAgICAgKGJlZm9yZS5zdGF0ZXMgJiYgIUFycmF5LmlzQXJyYXkoYmVmb3JlLnN0YXRlcykpIHx8XG4gICAgICAgIChiZWZvcmUgYXMgYW55KS5fYXVkaXQgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAoYmVmb3JlLmF0dHJzICYmIHR5cGVvZiAoYmVmb3JlLmF0dHJzIGFzIGFueSkuZm9ybWF0ID09PSAnc3RyaW5nJyk7XG4gICAgICBpZiAoIW5lZWRzV29yaykgY29udGludWU7XG4gICAgICBtLmVudHJ5ID0gZGVub3JtYWxpemVFbnRyeShiZWZvcmUpO1xuICAgICAgbXV0YXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtdXRhdGVkO1xuICB9O1xuICBjb25zdCBvbkltcG9ydCA9ICgpOiB2b2lkID0+IGltcG9ydEZpbGUuY2xpY2soKTtcbiAgaW1wb3J0RmlsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXM/LlswXTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBzbmFwc2hvdCgpO1xuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBmaWxlLnRleHQoKTtcbiAgICBjb25zdCBpbXBvcnRlZDogUGFuZWxNZXNzYWdlW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgdGV4dC5zcGxpdCgvXFxyP1xcbi8pKSB7XG4gICAgICBpZiAoIWxpbmUudHJpbSgpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKGxpbmUpO1xuICAgICAgICBpZiAoby50eXBlID09PSAnbWFuaWZlc3QnKSB7XG4gICAgICAgICAgLy8gTWFuaWZlc3QgbGluZSDigJQgaW5mb3JtYXRpb25hbCBvbmx5IG9uIGltcG9ydC4gU2tpcC5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoby50eXBlID09PSAncGFnZScpIGltcG9ydGVkLnB1c2goe3R5cGU6ICdwYWdlJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdXJsOiBvLnVybCwgdGl0bGU6IG8udGl0bGUsIHZpZXdwb3J0OiBvLnZpZXdwb3J0LCB0b2tlbnM6IG8udG9rZW5zLCB1c2VyQWdlbnQ6IG8udXNlckFnZW50LCBsYW5nOiBvLmxhbmd9KTtcbiAgICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnZmVlZGJhY2snKSB7XG4gICAgICAgICAgY29uc3QgZmI6IEZlZWRiYWNrTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdmZWVkYmFjaycsIGlkOiBtc2dJZCgpLFxuICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCB0ZXh0OiBvLnRleHQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoby5wYXJlbnRVaWQpIGZiLnBhcmVudFVpZCA9IG8ucGFyZW50VWlkO1xuICAgICAgICAgIGlmIChvLmRldGFjaGVkKSBmYi5kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoby50YWdzKSAmJiBvLnRhZ3MubGVuZ3RoKSBmYi50YWdzID0gby50YWdzO1xuICAgICAgICAgIGlmIChvLnNldmVyaXR5KSBmYi5zZXZlcml0eSA9IG8uc2V2ZXJpdHk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaChmYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc2VsZWN0b3IgbGluZSDigJQgY291bGQgYmUgdjEgKGZsYXQpIG9yIHYyICh3aXRoIF9hdWRpdCkuIFRoZVxuICAgICAgICAgIC8vIGJ1bmRsZWQgZmVlZGJhY2sgYXJyYXkgbXVzdCBiZSBzcGxpdCBvdXQgaW50byBzZXBhcmF0ZSBmZWVkYmFja1xuICAgICAgICAgIC8vIG1lc3NhZ2VzIGZvciByb3VuZC10cmlwIHdpdGggdjEgcmVhZGVycyDigJQgYnV0IGluIHYyIHdlIGFscmVhZHlcbiAgICAgICAgICAvLyBlbWl0IHN0YW5kYWxvbmUgZmVlZGJhY2sgbGluZXMsIHNvIGRyb3BwaW5nIHRoZSBidW5kbGVkIGxpc3QgaXNcbiAgICAgICAgICAvLyBzYWZlIHRvIGF2b2lkIGRvdWJsZS1jb3VudGluZy5cbiAgICAgICAgICBjb25zdCBmYiA9IEFycmF5LmlzQXJyYXkoby5mZWVkYmFjaykgPyBvLmZlZWRiYWNrIDogbnVsbDtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGRlbm9ybWFsaXplRW50cnkobyk7XG4gICAgICAgICAgaW1wb3J0ZWQucHVzaCh7dHlwZTogJ3NlbGVjdG9yJywgaWQ6IG1zZ0lkKCksIHRzOiBvLnRzID8/IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgZW50cnl9KTtcbiAgICAgICAgICAvLyBPbmx5IGluZmxhdGUgYnVuZGxlZCBmZWVkYmFjayBpZiB0aGUgZmlsZSBpcyB2MSAobm8gdmVyc2lvblxuICAgICAgICAgIC8vIG1hcmtlciBvbiB0aGUgc2VsZWN0b3IgbGluZXMpLiB2MiBoYXMgaXRzIG93biBzdGFuZGFsb25lXG4gICAgICAgICAgLy8gZmVlZGJhY2sgbGluZXMgdGhhdCBhcnJpdmUgc2VwYXJhdGVseS5cbiAgICAgICAgICBpZiAoZmIgJiYgby52ICE9PSAyKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHQgb2YgZmIpIGltcG9ydGVkLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAnZmVlZGJhY2snLCBpZDogbXNnSWQoKSxcbiAgICAgICAgICAgICAgdHM6IG8udHMgPz8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICB0ZXh0OiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgPyB0IDogdD8udGV4dCA/PyAnJyxcbiAgICAgICAgICAgICAgcGFyZW50VWlkOiBlbnRyeS51aWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggeyAvKiBza2lwIGJhZCBsaW5lICovIH1cbiAgICB9XG4gICAgbWVzc2FnZXMgPSBbLi4ubWVzc2FnZXMsIC4uLmltcG9ydGVkXTtcbiAgICBwZXJzaXN0KCk7XG4gICAgYXdhaXQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldFN0YXR1cyhgSW1wb3J0ZWQgJHtpbXBvcnRlZC5sZW5ndGh9IG1lc3NhZ2Uke2ltcG9ydGVkLmxlbmd0aCA9PT0gMSA/ICcnIDogJ3MnfWApO1xuICAgIGltcG9ydEZpbGUudmFsdWUgPSAnJztcbiAgfSk7XG4gIC8vIOKUgOKUgOKUgCBXb3Jrc3BhY2Ugc25hcHNob3QgaGlzdG9yeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy8gUGVyc2lzdGVudCAobm90IHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2spLiBBIENsZWFyLWFsbCBhcmNoaXZlcyB0aGVcbiAgLy8gY3VycmVudCB3b3Jrc3BhY2Ugc3RhdGUgc28gaXQgY2FuIGJlIHJlc3RvcmVkIGZyb20gU2V0dGluZ3MgbGF0ZXIuXG4gIGxldCB3c1NuYXBzaG90czogV29ya3NwYWNlU25hcHNob3RbXSA9IFtdO1xuICBjb25zdCBsb2FkV3NTbmFwc2hvdHMgPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgd3NTbmFwc2hvdHMgPSAoYXdhaXQgU3RvcmUuZ2V0PFdvcmtzcGFjZVNuYXBzaG90W10+KHdzU25hcHNob3RzS2V5KG5hbWUpLCBbXSkpIHx8IFtdO1xuICB9O1xuICBjb25zdCBwZXJzaXN0V3NTbmFwc2hvdHMgPSAoKTogdm9pZCA9PiB7IHZvaWQgU3RvcmUuc2V0KHdzU25hcHNob3RzS2V5KGFjdGl2ZVdzKSwgd3NTbmFwc2hvdHMpOyB9O1xuICAvLyBBcmNoaXZlIHRoZSBDVVJSRU5UIHdvcmtzcGFjZSBzdGF0ZSAoYmVmb3JlIGl0J3Mgd2lwZWQpLiBOby1vcCBpZiBlbXB0eS5cbiAgY29uc3QgYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90ID0gKCk6IFdvcmtzcGFjZVNuYXBzaG90IHwgbnVsbCA9PiB7XG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHNuYXA6IFdvcmtzcGFjZVNuYXBzaG90ID0ge1xuICAgICAgaWQ6IHNlY3VyZVRva2VuKDgpLFxuICAgICAgdHM6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIG1lc3NhZ2VzOiBzdHJ1Y3R1cmVkQ2xvbmUobWVzc2FnZXMpLFxuICAgICAgc2hvdHM6IE9iamVjdC5mcm9tRW50cmllcyhzaG90cyksXG4gICAgICBzZWxlY3RvcnM6IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5sZW5ndGgsXG4gICAgICBjb21tZW50czogbWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpLmxlbmd0aCxcbiAgICB9O1xuICAgIC8vIE5ld2VzdCBmaXJzdDsgY2FwIHRoZSBoaXN0b3J5LlxuICAgIHdzU25hcHNob3RzLnVuc2hpZnQoc25hcCk7XG4gICAgaWYgKHdzU25hcHNob3RzLmxlbmd0aCA+IFdTX1NOQVBTSE9UX0NBUCkgd3NTbmFwc2hvdHMgPSB3c1NuYXBzaG90cy5zbGljZSgwLCBXU19TTkFQU0hPVF9DQVApO1xuICAgIHBlcnNpc3RXc1NuYXBzaG90cygpO1xuICAgIHJldHVybiBzbmFwO1xuICB9O1xuICBjb25zdCByZXN0b3JlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHNuYXAgPSB3c1NuYXBzaG90cy5maW5kKChzKSA9PiBzLmlkID09PSBpZCk7XG4gICAgaWYgKCFzbmFwKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gUHVzaCB0aGUgbGl2ZSBzdGF0ZSBvbnRvIHRoZSBpbi1zZXNzaW9uIHVuZG8gc3RhY2sgc28gYSBtaXN0YWtlblxuICAgIC8vIHJlc3RvcmUgaXMgaXRzZWxmIHVuZG9hYmxlLlxuICAgIHNuYXBzaG90KCk7XG4gICAgbWVzc2FnZXMgPSBzdHJ1Y3R1cmVkQ2xvbmUoc25hcC5tZXNzYWdlcyk7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhzbmFwLnNob3RzKSkgc2hvdHMuc2V0KGssIHYpO1xuICAgIHNob3RzRnVsbC5jbGVhcigpO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgcGVyc2lzdFNob3RzKCk7XG4gICAgcGVyc2lzdFNob3RzRnVsbCgpO1xuICAgIHBlcnNpc3QoKTtcbiAgICByZW5kZXIoKTtcbiAgICByZW5kZXJXc0NvbnRyb2xzKCk7XG4gICAgc2V0U3RhdHVzKGBSZXN0b3JlZCBzbmFwc2hvdCDCtyAke3NuYXAuc2VsZWN0b3JzfSBzZWxlY3RvcnNgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgY29uc3QgZGVsZXRlV29ya3NwYWNlU25hcHNob3QgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHdzU25hcHNob3RzID0gd3NTbmFwc2hvdHMuZmlsdGVyKChzKSA9PiBzLmlkICE9PSBpZCk7XG4gICAgcGVyc2lzdFdzU25hcHNob3RzKCk7XG4gICAgcmVuZGVyV3NDb250cm9scygpO1xuICB9O1xuXG4gIGNvbnN0IG9uQ2xlYXIgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb25maXJtKCdDbGVhciBhbGwgY2FwdHVyZXM/IEEgc25hcHNob3Qgd2lsbCBiZSBzYXZlZCB0byBTZXR0aW5ncyDihpIgV29ya3NwYWNlcyBmaXJzdC4nKSkgcmV0dXJuO1xuICAgIC8vIEFyY2hpdmUgdGhlIHdvcmtzcGFjZSBCRUZPUkUgd2lwaW5nIHNvIGl0IGNhbiBiZSByZXN0b3JlZCBsYXRlci5cbiAgICBjb25zdCBzbmFwID0gYXJjaGl2ZVdvcmtzcGFjZVNuYXBzaG90KCk7XG4gICAgc25hcHNob3QoKTtcbiAgICBtZXNzYWdlcyA9IFtdO1xuICAgIGxpdmVUYWJVcmwgPSBudWxsO1xuICAgIHNlbGVjdG9yVmFsaWRpdHkuY2xlYXIoKTtcbiAgICBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7XG4gICAgc2hvdHMuY2xlYXIoKTtcbiAgICBzaG90c0Z1bGwuY2xlYXIoKTtcbiAgICBwZXJzaXN0U2hvdHMoKTtcbiAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgcGVyc2lzdCgpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICAvLyBOZXZlciBjbGFpbSBhIHNuYXBzaG90IHRoYXQgZGlkbid0IGhhcHBlbiAoZW1wdHkgd29ya3NwYWNlIG5vLW9wcykuXG4gICAgc2V0U3RhdHVzKHNuYXAgPyAnQ2xlYXJlZCDCtyBzbmFwc2hvdCBzYXZlZCDigJQgcmVzdG9yZSBpbiBTZXR0aW5ncyDihpIgV29ya3NwYWNlcycgOiAnQ2xlYXJlZCcpO1xuICB9O1xuXG4gIC8vIOKUgOKUgOKUgCBWYWxpZGF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBjb25zdCBydW5WYWxpZGF0aW9uID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IFsuLi5uZXcgU2V0KG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJykubWFwKChtKSA9PiBtLmVudHJ5LnNlbGVjdG9yKSldO1xuICAgIGlmICghc2VsZWN0b3JzLmxlbmd0aCB8fCAhaW5FeHRlbnNpb24pIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHthY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWV9KTtcbiAgICAgIGlmICghdGFic1swXSkgcmV0dXJuO1xuICAgICAgbGl2ZVRhYlVybCA9IHRhYnNbMF0udXJsID8/IGxpdmVUYWJVcmw7XG4gICAgICBsaXZlVGFiUGF0aCA9IHBhdGhPZihsaXZlVGFiVXJsID8/ICcnKTtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCEsIHBnKHtraW5kOiAndmFsaWRhdGUnLCBzZWxlY3RvcnN9KSkgYXMge3ZhbGlkPzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj59O1xuICAgICAgaWYgKHJlcGx5Py52YWxpZCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtzZWwsIG9rXSBvZiBPYmplY3QuZW50cmllcyhyZXBseS52YWxpZCkpIHtcbiAgICAgICAgICBzZWxlY3RvclZhbGlkaXR5LnNldChzZWwsIG9rKTtcbiAgICAgICAgICBpZiAoIW9rKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCAnTm8gZWxlbWVudCBvbiB0aGUgbGl2ZSBwYWdlIG1hdGNoZXMgdGhpcyBzZWxlY3Rvci4nKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogdGFiIG5vdCByZWFkeSAqLyB9XG4gIH07XG4gIGNvbnN0IG9uVmFsaWRhdGUgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgc2V0U3RhdHVzKCdSZS1jaGVja2luZ+KApicsIHtraW5kOiAnaW5mbyd9KTtcbiAgICBhd2FpdCBydW5WYWxpZGF0aW9uKCk7XG4gICAgc2V0U3RhdHVzKCdWYWxpZGF0ZWQnKTtcbiAgfTtcblxuICAvLyAoU2NyZWVuc2hvdCBtYWNoaW5lcnkgcmVtb3ZlZCBhbG9uZ3NpZGUgdGhlIC5wcmV2aWV3IHRpbGUuKVxuXG4gIC8vIOKUgOKUgOKUgCBHaXRIdWIgc3RhcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGZldGNoU3RhcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSAncGluY2hncmFiLmdoLnN0YXJzJztcbiAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBTdG9yZS5nZXQ8e2NvdW50OiBudW1iZXI7IHRzOiBudW1iZXJ9IHwgbnVsbD4oY2FjaGVLZXksIG51bGwpO1xuICAgIGlmIChjYWNoZWQgJiYgRGF0ZS5ub3coKSAtIGNhY2hlZC50cyA8IDNfNjAwXzAwMCkge1xuICAgICAgc3RhcnNFbC50ZXh0Q29udGVudCA9IFN0cmluZyhjYWNoZWQuY291bnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3dyYW5uZ2xlL3BpbmNoZ3JhYicsIHtjYWNoZTogJ25vLXN0b3JlJ30pO1xuICAgICAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ3N0YXR1cyAnICsgci5zdGF0dXMpO1xuICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpIGFzIHtzdGFyZ2F6ZXJzX2NvdW50PzogbnVtYmVyfTtcbiAgICAgIGNvbnN0IGNvdW50ID0gai5zdGFyZ2F6ZXJzX2NvdW50ID8/IDA7XG4gICAgICBzdGFyc0VsLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50KTtcbiAgICAgIHZvaWQgU3RvcmUuc2V0KGNhY2hlS2V5LCB7Y291bnQsIHRzOiBEYXRlLm5vdygpfSk7XG4gICAgfSBjYXRjaCB7IHN0YXJzRWwudGV4dENvbnRlbnQgPSAnwrcnOyB9XG4gIH07XG4gIGNvbnN0IG9uR2l0aHViID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vd3Jhbm5nbGUvcGluY2hncmFiJztcbiAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsfSk7XG4gICAgZWxzZSB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgfTtcblxuICAvLyBSZS1pbmplY3QgdGhlIGNvbnRlbnQgc2NyaXB0IGludG8gdGhlIGFjdGl2ZSB0YWIg4oCUIHRoZSByZWNvdmVyeSBwYXRoXG4gIC8vIGZvciBcIkFsdCtDbGljayBzdG9wcGVkIHdvcmtpbmdcIiAoYW4gZXh0ZW5zaW9uIHJlbG9hZCBvcnBoYW5zIHRoZSBwYWdlJ3NcbiAgLy8gc2NyaXB0KS4gUmVmcmVzaGluZyBhbiBhdHRhY2hlZCB0YWIgcmUtaW5qZWN0cyBhdXRvbWF0aWNhbGx5OyB0aGlzXG4gIC8vIGNvdmVycyBldmVyeSBvdGhlciBjYXNlIHdpdGhvdXQgaHVudGluZyBmb3IgdGhlIHRvb2xiYXIgaWNvbi5cbiAgY29uc3Qgb25SZWF0dGFjaCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBpZiAoIWluRXh0ZW5zaW9uKSB7IHNldFN0YXR1cygnUmUtYXR0YWNoIG9ubHkgd29ya3MgaW5zaWRlIHRoZSBleHRlbnNpb24nLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgc2VuZFRvQmc8e29rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZ30+KHtraW5kOiAncGctcmVpbmplY3QnfSk7XG4gICAgaWYgKHJlcGx5Py5vaykgc2V0U3RhdHVzKCdSZS1hdHRhY2hlZCDigJQgQWx0K0NsaWNrIGlzIGxpdmUnKTtcbiAgICBlbHNlIHNldFN0YXR1cyhgQ291bGRuJ3QgcmUtYXR0YWNoIOKAlCBjbGljayB0aGUgUGluY2hHcmFiIHRvb2xiYXIgYnV0dG9uIG9uIHRoZSBwYWdlJHtyZXBseT8uZXJyb3IgPyBgIMK3ICR7cmVwbHkuZXJyb3J9YCA6ICcnfWAsIHtraW5kOiAnd2Fybid9KTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgU2V0dGluZ3MgZHJhd2VyIC8gd29ya3NwYWNlcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgYXBwbHlQcmVmc1RvVUkgPSAoKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBlbCBvZiBkcmF3ZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbZGF0YS1wcmVmXScpKSB7XG4gICAgICBlbC5jaGVja2VkID0gQm9vbGVhbihwcmVmc1tlbC5kYXRhc2V0LnByZWYgYXMga2V5b2YgUHJlZnNdKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBlbCBvZiBkcmF3ZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MVGV4dEFyZWFFbGVtZW50PigndGV4dGFyZWFbZGF0YS1wcmVmLXRleHRdJykpIHtcbiAgICAgIGVsLnZhbHVlID0gU3RyaW5nKHByZWZzW2VsLmRhdGFzZXQucHJlZlRleHQgYXMga2V5b2YgUHJlZnNdID8/ICcnKTtcbiAgICB9XG4gICAgLy8gUGxhaW4tdGV4dCBpbnB1dHMgKGRlc2lnblBhdGgsIHNraWxsUGF0aCkgYWxzbyB1c2UgZGF0YS1wcmVmLXRleHQuXG4gICAgZm9yIChjb25zdCBlbCBvZiBkcmF3ZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbdHlwZT1cInRleHRcIl1bZGF0YS1wcmVmLXRleHRdJykpIHtcbiAgICAgIGVsLnZhbHVlID0gU3RyaW5nKHByZWZzW2VsLmRhdGFzZXQucHJlZlRleHQgYXMga2V5b2YgUHJlZnNdID8/ICcnKTtcbiAgICB9XG4gICAgdXBkYXRlRGVzaWduTWRTdGF0dXMoKTtcbiAgfTtcbiAgLy8gUmVuZGVyIHRoZSBkZXNpZ24tbWQgLyBza2lsbC1tZCBzdGF0dXMgbGFiZWxzIGFuZCB0aGUgdGVtcGxhdGUtYmFubmVyXG4gIC8vIHNvIHRoZSB1c2VyIHNlZXMgYXQgYSBnbGFuY2Ugd2hldGhlciB0aGV5J3JlIHNoaXBwaW5nIGEgY3VzdG9taXplZFxuICAvLyBmaWxlIHZzLiBmYWxsaW5nIGJhY2sgdG8gdGhlIGJ1bmRsZWQgdGVtcGxhdGUuIEFzeW5jIGJlY2F1c2Ugd2VcbiAgLy8gbmVlZCB0byByZWFkIHRoZSBidW5kbGVkIGZpbGUncyBzaXplIHRvIGRpc3BsYXkgXCJ0ZW1wbGF0ZSDCtyBOIGxpbmVzXCJcbiAgLy8gZXZlbiB3aGVuIHByZWZzIGlzIGVtcHR5LlxuICBjb25zdCB1cGRhdGVNZFN0YXR1c2VzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGRlc2lnbkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLWRlc2lnbi1tZC1zdGF0dXNdJyk7XG4gICAgY29uc3Qgc2tpbGxFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1za2lsbC1tZC1zdGF0dXNdJyk7XG4gICAgY29uc3QgZGVzaWduQmFubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXRlbXBsYXRlLWJhbm5lcj1cImRlc2lnblwiXScpO1xuICAgIGNvbnN0IHNraWxsQmFubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLXRlbXBsYXRlLWJhbm5lcj1cInNraWxsXCJdJyk7XG4gICAgY29uc3QgdGFnID0gKG1kOiBzdHJpbmcsIGlzVHBsOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgIGNvbnN0IGxpbmVzID0gbWQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IEJsb2IoW21kXSkuc2l6ZTtcbiAgICAgIHJldHVybiBgJHtpc1RwbCA/ICd0ZW1wbGF0ZScgOiAnY3VzdG9tJ30gwrcgJHtsaW5lc30gbGluZXMgwrcgJHsoYnl0ZXMgLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gICAgfTtcbiAgICBpZiAoZGVzaWduRWwpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpO1xuICAgICAgZGVzaWduRWwudGV4dENvbnRlbnQgPSBjb250ZW50LnRyaW0oKSA/IHRhZyhjb250ZW50LCBpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSkgOiAnKGVtcHR5KSc7XG4gICAgICBkZXNpZ25FbC5jbGFzc0xpc3QudG9nZ2xlKCdoYXMtY29udGVudCcsICFpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKSk7XG4gICAgfVxuICAgIGlmIChza2lsbEVsKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgICAgc2tpbGxFbC50ZXh0Q29udGVudCA9IGNvbnRlbnQudHJpbSgpID8gdGFnKGNvbnRlbnQsIGlzVXNpbmdUZW1wbGF0ZVNraWxsKCkpIDogJyhlbXB0eSknO1xuICAgICAgc2tpbGxFbC5jbGFzc0xpc3QudG9nZ2xlKCdoYXMtY29udGVudCcsICFpc1VzaW5nVGVtcGxhdGVTa2lsbCgpKTtcbiAgICB9XG4gICAgaWYgKGRlc2lnbkJhbm5lcikgZGVzaWduQmFubmVyLmhpZGRlbiA9ICFpc1VzaW5nVGVtcGxhdGVEZXNpZ24oKTtcbiAgICBpZiAoc2tpbGxCYW5uZXIpIHNraWxsQmFubmVyLmhpZGRlbiA9ICFpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIC8vIEFsc28gcmVmcmVzaCB0aGUgY29tcGFjdCBwcmV2aWV3IHRleHQgb24gdGhlIGVkaXRvci1yb3cgYnV0dG9uLlxuICAgIGF3YWl0IHJlbmRlck1kUHJldmlldygnZGVzaWduJyk7XG4gICAgYXdhaXQgcmVuZGVyTWRQcmV2aWV3KCdza2lsbCcpO1xuICB9O1xuICAvLyBCYWNrLWNvbXBhdCBhbGlhcyDigJQgZWFybGllciBjb2RlIHBhdGhzIGNhbGxlZCB1cGRhdGVEZXNpZ25NZFN0YXR1cygpLlxuICBjb25zdCB1cGRhdGVEZXNpZ25NZFN0YXR1cyA9ICgpOiB2b2lkID0+IHsgdm9pZCB1cGRhdGVNZFN0YXR1c2VzKCk7IH07XG5cbiAgLy8g4pSA4pSA4pSAIENvbXBhY3QgcHJldmlldyArIG1vZGFsIGVkaXRvciBmb3IgREVTSUdOLm1kIC8gU0tJTEwubWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJlcGxhY2VzIHRoZSBnaWFudCBpbmxpbmUgdGV4dGFyZWFzIHdpdGggc21hbGwgZG9jdW1lbnQgc3VtbWFyaWVzLlxuICB0eXBlIE1kS2luZCA9ICdkZXNpZ24nIHwgJ3NraWxsJztcbiAgY29uc3QgbWFya2Rvd25PdmVydmlldyA9IChjb250ZW50OiBzdHJpbmcsIGtpbmQ6IE1kS2luZCwgdXNpbmdUZW1wbGF0ZTogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgbGluZXMgPSBjb250ZW50LnRyaW0oKSA/IGNvbnRlbnQuc3BsaXQoJ1xcbicpLmxlbmd0aCA6IDA7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbY29udGVudF0pLnNpemU7XG4gICAgY29uc3QgaGVhZGluZ3MgPSBjb250ZW50XG4gICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAubWFwKChsaW5lKSA9PiAvXiN7MSwzfVxccysoLispJC8uZXhlYyhsaW5lLnRyaW0oKSk/LlsxXT8udHJpbSgpKVxuICAgICAgLmZpbHRlcigoaGVhZGluZyk6IGhlYWRpbmcgaXMgc3RyaW5nID0+IEJvb2xlYW4oaGVhZGluZykpXG4gICAgICAuc2xpY2UoMCwgNCk7XG4gICAgLy8gV2FybSwgcGxhaW4tbGFuZ3VhZ2UgZnJhbWluZyBvZiB3aGF0IGVhY2ggZmlsZSB0ZWFjaGVzIHRoZSBhZ2VudC5cbiAgICAvLyBERVNJR04ubWQgaXMgdGhlIGhlYWRsaW5lIGFydGlmYWN0OiBpdCdzIHdoZXJlIHlvdSBkZXNjcmliZSB5b3VyIG93blxuICAgIC8vIGJyYW5kIGFuZCBVSSB0YXN0ZSBzbyB0aGUgYWdlbnQgYnVpbGRzIGluICp5b3VyKiB2b2ljZSByYXRoZXIgdGhhbiBhXG4gICAgLy8gZ2VuZXJpYyBkZWZhdWx0LiBTS0lMTC5tZCBpcyB0aGUgYWR2YW5jZWQgdHJpYWdlIGd1aWRlIGZvciByZWFkaW5nXG4gICAgLy8gZXhwb3J0cyDigJQgdXNlZnVsLCBidXQgbm90IHdoZXJlIG1vc3QgcGVvcGxlIHNob3VsZCBzdGFydC5cbiAgICBjb25zdCBsYWJlbCA9IGtpbmQgPT09ICdkZXNpZ24nXG4gICAgICA/ICdUZWFjaGVzIHlvdXIgYWdlbnQgdG8gYnVpbGQgVUkgaW4geW91ciBicmFuZCdcbiAgICAgIDogJ0FkdmFuY2VkOiBob3cgeW91ciBhZ2VudCBzaG91bGQgcmVhZCBQaW5jaEdyYWIgZXhwb3J0cyc7XG4gICAgY29uc3Qgc291cmNlID0gdXNpbmdUZW1wbGF0ZVxuICAgICAgPyAoa2luZCA9PT0gJ2Rlc2lnbicgPyAnU3RhcnRlciB0ZW1wbGF0ZSDigJQgbWFrZSBpdCB5b3VycycgOiAnQnVuZGxlZCB0ZW1wbGF0ZScpXG4gICAgICA6ICdDdXN0b21pemVkJztcbiAgICBjb25zdCBzZWN0aW9ucyA9IGhlYWRpbmdzLmxlbmd0aCA/IGhlYWRpbmdzLmpvaW4oJyAvICcpIDogJ05vIHNlY3Rpb24gaGVhZGluZ3MgZm91bmQnO1xuICAgIHJldHVybiBgJHtsYWJlbH1cXG4ke3NvdXJjZX0gwrcgJHtsaW5lcy50b0xvY2FsZVN0cmluZygpfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCXFxuU2VjdGlvbnM6ICR7c2VjdGlvbnN9YDtcbiAgfTtcblxuICBjb25zdCByZW5kZXJNZFByZXZpZXcgPSBhc3luYyAoa2luZDogJ2Rlc2lnbicgfCAnc2tpbGwnKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcHJldmlld0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYFtkYXRhLW1kLXByZXZpZXc9XCIke2tpbmR9XCJdYCk7XG4gICAgaWYgKCFwcmV2aWV3RWwpIHJldHVybjtcbiAgICBjb25zdCBjb250ZW50ID0ga2luZCA9PT0gJ2Rlc2lnbicgPyBhd2FpdCByZXNvbHZlRGVzaWduQ29udGVudCgpIDogYXdhaXQgcmVzb2x2ZVNraWxsQ29udGVudCgpO1xuICAgIGNvbnN0IHVzaW5nVGVtcGxhdGUgPSBraW5kID09PSAnZGVzaWduJyA/IGlzVXNpbmdUZW1wbGF0ZURlc2lnbigpIDogaXNVc2luZ1RlbXBsYXRlU2tpbGwoKTtcbiAgICBwcmV2aWV3RWwudGV4dENvbnRlbnQgPSBtYXJrZG93bk92ZXJ2aWV3KGNvbnRlbnQsIGtpbmQsIHVzaW5nVGVtcGxhdGUpO1xuICB9O1xuXG4gIGNvbnN0IG9wZW5NZE1vZGFsID0gYXN5bmMgKGtpbmQ6IE1kS2luZCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgaWYgKCFvdmVybGF5KSByZXR1cm47XG4gICAgY29uc3QgdGl0bGVFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXRpdGxlXScpITtcbiAgICBjb25zdCB0YUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC10ZXh0YXJlYV0nKSE7XG4gICAgY29uc3Qgc3RhdHNFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXN0YXRzXScpITtcbiAgICBjb25zdCBiYW5uZXJFbCA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLWJhbm5lcl0nKSE7XG4gICAgY29uc3Qgc3VtbWFyeUVsID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWwtc3VtbWFyeV0nKSE7XG4gICAgY29uc3Qgc2F2ZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXNhdmVdJykhO1xuICAgIGNvbnN0IHJlc2V0QnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtbWQtbW9kYWwtcmVzZXRdJykhO1xuICAgIGNvbnN0IHVwbG9hZEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLW1kLW1vZGFsLXVwbG9hZF0nKSE7XG4gICAgY29uc3QgZG93bmxvYWRCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1kb3dubG9hZF0nKSE7XG4gICAgY29uc3QgY2xvc2VCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbC1jbG9zZV0nKSE7XG5cbiAgICBjb25zdCBpc0Rlc2lnbiA9IGtpbmQgPT09ICdkZXNpZ24nO1xuICAgIGNvbnN0IGluaXRpYWwgPSBpc0Rlc2lnbiA/IGF3YWl0IHJlc29sdmVEZXNpZ25Db250ZW50KCkgOiBhd2FpdCByZXNvbHZlU2tpbGxDb250ZW50KCk7XG4gICAgY29uc3QgdXNpbmdUZW1wbGF0ZSA9IGlzRGVzaWduID8gaXNVc2luZ1RlbXBsYXRlRGVzaWduKCkgOiBpc1VzaW5nVGVtcGxhdGVTa2lsbCgpO1xuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSBpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1BpbmNoR3JhYiBTS0lMTC5tZCc7XG4gICAgdGFFbC52YWx1ZSA9IGluaXRpYWw7XG4gICAgb3ZlcmxheS5kYXRhc2V0LmtpbmQgPSBraW5kO1xuXG4gICAgY29uc3QgcmVmcmVzaFN0YXRzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhRWwudmFsdWU7XG4gICAgICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IEJsb2IoW3RleHRdKS5zaXplO1xuICAgICAgc3RhdHNFbC50ZXh0Q29udGVudCA9IGAke2xpbmVzfSBsaW5lcyDCtyAkeyhieXRlcyAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgICAgIHN1bW1hcnlFbC50ZXh0Q29udGVudCA9IG1hcmtkb3duT3ZlcnZpZXcodGV4dCwga2luZCwgdXNpbmdUZW1wbGF0ZSk7XG4gICAgfTtcbiAgICByZWZyZXNoU3RhdHMoKTtcbiAgICBiYW5uZXJFbC5oaWRkZW4gPSAhdXNpbmdUZW1wbGF0ZTtcbiAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9IHVzaW5nVGVtcGxhdGVcbiAgICAgID8gYOKaoCBDdXJyZW50bHkgc2hpcHBpbmcgdGhlIGJ1bmRsZWQgJHtpc0Rlc2lnbiA/ICdERVNJR04ubWQnIDogJ1NLSUxMLm1kJ30gdGVtcGxhdGUg4oCUIGVkaXRzIGhlcmUgYmVjb21lIHlvdXIgY3VzdG9taXplZCB2ZXJzaW9uLmBcbiAgICAgIDogJyc7XG4gICAgdGFFbC5vbmlucHV0ID0gcmVmcmVzaFN0YXRzO1xuXG4gICAgY29uc3Qgb25TYXZlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRhRWwudmFsdWU7XG4gICAgICAvLyBTYXZlIGVtcHR5IHN0cmluZyDihpIgcmV2ZXJ0IHRvIHRlbXBsYXRlIGZhbGxiYWNrLiBBbnl0aGluZyBub24tZW1wdHlcbiAgICAgIC8vIOKGkiB1c2VyIGN1c3RvbWl6YXRpb24gKHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZSkuXG4gICAgICBpZiAoaXNEZXNpZ24pIHByZWZzLmRlc2lnbk1kID0gdGV4dDtcbiAgICAgIGVsc2UgcHJlZnMuc2tpbGxNZCA9IHRleHQ7XG4gICAgICBwZXJzaXN0UHJlZnMoKTtcbiAgICAgIHZvaWQgdXBkYXRlTWRTdGF0dXNlcygpO1xuICAgICAgc2V0U3RhdHVzKGAke2lzRGVzaWduID8gJ0RFU0lHTi5tZCcgOiAnU0tJTEwubWQnfSBzYXZlZGApO1xuICAgICAgY2xvc2VNZE1vZGFsKCk7XG4gICAgfTtcbiAgICBjb25zdCBvblJlc2V0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGFFbC52YWx1ZSA9ICcnOyAvLyBlbXB0eSA9IGZhbGxiYWNrIHRvIGJ1bmRsZWQgdGVtcGxhdGVcbiAgICAgIHJlZnJlc2hTdGF0cygpO1xuICAgICAgYmFubmVyRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgICBiYW5uZXJFbC50ZXh0Q29udGVudCA9ICdDbGVhcmVkIOKAlCBTYXZlIHRvIHJldmVydCB0byBidW5kbGVkIHRlbXBsYXRlLCBvciBwYXN0ZSBuZXcgY29udGVudC4nO1xuICAgIH07XG4gICAgY29uc3Qgb25VcGxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBpbnB1dElkID0gaXNEZXNpZ24gPyAnZGVzaWduLW1kLWZpbGUnIDogJ3NraWxsLW1kLWZpbGUnO1xuICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uRG93bmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gaXNEZXNpZ24gPyAnREVTSUdOLnRlbXBsYXRlLm1kJyA6ICdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnO1xuICAgICAgZG93bmxvYWRUZXh0KG5hbWUsIHRhRWwudmFsdWUpO1xuICAgIH07XG5cbiAgICBzYXZlQnRuLm9uY2xpY2sgPSBvblNhdmU7XG4gICAgcmVzZXRCdG4ub25jbGljayA9IG9uUmVzZXQ7XG4gICAgdXBsb2FkQnRuLm9uY2xpY2sgPSBvblVwbG9hZDtcbiAgICBkb3dubG9hZEJ0bi5vbmNsaWNrID0gb25Eb3dubG9hZDtcbiAgICBjbG9zZUJ0bi5vbmNsaWNrID0gY2xvc2VNZE1vZGFsO1xuICAgIG92ZXJsYXkuaGlkZGVuID0gZmFsc2U7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRhRWwuZm9jdXMoKSk7XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNZE1vZGFsID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtbWQtbW9kYWxdJyk7XG4gICAgaWYgKG92ZXJsYXkpIG92ZXJsYXkuaGlkZGVuID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBkb3dubG9hZFRleHQgPSAoZmlsZW5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nLCBtaW1lID0gJ3RleHQvbWFya2Rvd24nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge3R5cGU6IG1pbWV9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsOyBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTsgYS5jbGljaygpOyBhLnJlbW92ZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbiAgfTtcblxuICBjb25zdCB3aXJlTWRGaWxlSW5wdXQgPSAoaWQ6IHN0cmluZywgcHJlZktleTogJ2Rlc2lnbk1kJyB8ICdza2lsbE1kJywgbGFiZWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcbiAgICBmaWxlSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBmaWxlSW5wdXQuZmlsZXM/LlswXTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IDUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICBzZXRTdGF0dXMoYCR7bGFiZWx9IHRvbyBsYXJnZSAoJHsoZmlsZS5zaXplIC8gMTAyNCAvIDEwMjQpLnRvRml4ZWQoMSl9IE1CID4gNSBNQiBjYXApYCwge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgICBmaWxlSW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgKHByZWZzIGFzIGFueSlbcHJlZktleV0gPSB0ZXh0O1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICBhcHBseVByZWZzVG9VSSgpO1xuICAgICAgc2V0U3RhdHVzKGAke2xhYmVsfSB1cGxvYWRlZCDCtyAke2ZpbGUubmFtZX0gwrcgJHsoZmlsZS5zaXplIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgKTtcbiAgICAgIGZpbGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgIH0pO1xuICB9O1xuICB3aXJlTWRGaWxlSW5wdXQoJ2Rlc2lnbi1tZC1maWxlJywgJ2Rlc2lnbk1kJywgJ0RFU0lHTi5tZCcpO1xuICB3aXJlTWRGaWxlSW5wdXQoJ3NraWxsLW1kLWZpbGUnLCAnc2tpbGxNZCcsICdTS0lMTC5tZCcpO1xuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgY29uc3QgdCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIGlmICgodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5kYXRhc2V0Py5wcmVmKSB7XG4gICAgICBjb25zdCBrZXkgPSB0LmRhdGFzZXQucHJlZiE7XG4gICAgICBjb25zdCBjaGVja2VkID0gQm9vbGVhbigodCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkKTtcbiAgICAgIC8vIFF1aWV0IHNhdmVzIG5lZWRzIHRoZSBvcHRpb25hbCBkb3dubG9hZHMudWkgcGVybWlzc2lvbjsgcmVxdWVzdCBpdFxuICAgICAgLy8gaW5zaWRlIHRoaXMgdXNlciBnZXN0dXJlIGFuZCByZXZlcnQgdGhlIGNoZWNrYm94IG9uIGRlY2xpbmUuXG4gICAgICBpZiAoa2V5ID09PSAncXVpZXRTYXZlcycgJiYgY2hlY2tlZCAmJiBpbkV4dGVuc2lvbiAmJiBjaHJvbWUucGVybWlzc2lvbnM/LnJlcXVlc3QpIHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBncmFudGVkID0gZmFsc2U7XG4gICAgICAgICAgdHJ5IHsgZ3JhbnRlZCA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5yZXF1ZXN0KHtwZXJtaXNzaW9uczogWydkb3dubG9hZHMudWknXX0pOyB9XG4gICAgICAgICAgY2F0Y2ggKGVycikgeyBjb25zb2xlLndhcm4oTE9HLCAnZG93bmxvYWRzLnVpIHBlcm1pc3Npb24gcmVxdWVzdCBmYWlsZWQnLCBlcnIpOyB9XG4gICAgICAgICAgcHJlZnMucXVpZXRTYXZlcyA9IGdyYW50ZWQ7XG4gICAgICAgICAgKHQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IGdyYW50ZWQ7XG4gICAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgICAgc2V0U3RhdHVzKGdyYW50ZWQgPyAnUXVpZXQgc2F2ZXMgb24g4oCUIG5vIG1vcmUgZG93bmxvYWQgcG9wdXBzJyA6ICdQZXJtaXNzaW9uIGRlY2xpbmVkIOKAlCBzYXZlcyBzdGF5IHZpc2libGUnLCBncmFudGVkID8ge30gOiB7a2luZDogJ3dhcm4nfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIChwcmVmcyBhcyBhbnkpW2tleV0gPSBjaGVja2VkO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICByZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHQuZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSAodCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZTtcbiAgICAgIHBlcnNpc3RQcmVmcygpO1xuICAgIH1cbiAgfSk7XG4gIC8vIFRleHRhcmVhIGlucHV0cyBhbHNvIGZpcmUgYGlucHV0YCBldmVudHMgYXMgdGhlIHVzZXIgdHlwZXMg4oCUIHdlIHdhbnQgdG9cbiAgLy8gc2F2ZSB0aG9zZSBpbmNyZW1lbnRhbGx5IHNvIGEgcGFuZWwgcmVsb2FkIGRvZXNuJ3QgbG9zZSBoYWxmLXR5cGVkXG4gIC8vIGVudHJpZXMuIGBjaGFuZ2VgIG9ubHkgZmlyZXMgb24gYmx1ciBmb3IgdGV4dGFyZWFzLlxuICBkcmF3ZXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gZS50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICBpZiAodD8uZGF0YXNldD8ucHJlZlRleHQpIHtcbiAgICAgIChwcmVmcyBhcyBhbnkpW3QuZGF0YXNldC5wcmVmVGV4dF0gPSB0LnZhbHVlO1xuICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb3BlbkRyYXdlciA9ICgpOiB2b2lkID0+IHsgZHJhd2VyLmhpZGRlbiA9IGZhbHNlOyByZW5kZXJXc0NvbnRyb2xzKCk7IH07XG4gIGNvbnN0IGNsb3NlRHJhd2VyID0gKCk6IHZvaWQgPT4geyBkcmF3ZXIuaGlkZGVuID0gdHJ1ZTsgfTtcblxuICAvLyBSZXVzYWJsZSBjcmVhdGUtd29ya3NwYWNlIGZsb3c6IHZhbGlkYXRlcyB1bmlxdWVuZXNzLCBwZXJzaXN0cywgc3dpdGNoZXMuXG4gIC8vIFNoYXJlZCBieSB0aGUgc2V0dGluZ3MgQ3JlYXRlIGJ1dHRvbiBhbmQgdGhlIGhlYWRlciBkcm9wZG93bidzXG4gIC8vIFwiKyBOZXcgd29ya3NwYWNlXCIgYWN0aW9uIHNvIGJvdGggcGF0aHMgYmVoYXZlIGlkZW50aWNhbGx5LlxuICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VGbG93ID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBuYW1lLnRyaW0oKTtcbiAgICBpZiAoIXRyaW1tZWQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAod29ya3NwYWNlcy5maW5kKCh3KSA9PiB3Lm5hbWUgPT09IHRyaW1tZWQpKSB7XG4gICAgICBzZXRTdGF0dXMoJ0FscmVhZHkgZXhpc3RzJywge2tpbmQ6ICd3YXJuJ30pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB3b3Jrc3BhY2VzLnB1c2goe25hbWU6IHRyaW1tZWQsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfSk7XG4gICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICBhd2FpdCBsb2FkV29ya3NwYWNlKHRyaW1tZWQpO1xuICAgIHJlbmRlcigpO1xuICAgIHJlbmRlcldzQ29udHJvbHMoKTtcbiAgICBzZXRTdGF0dXMoYENyZWF0ZWQgd29ya3NwYWNlIFwiJHt0cmltbWVkfVwiYCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyV3NDb250cm9scyA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAoIXdzU2VsZWN0KSByZXR1cm47XG4gICAgd3NTZWxlY3QuaW5uZXJIVE1MID0gJyc7XG4gICAgZm9yIChjb25zdCB3IG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gdy5uYW1lO1xuICAgICAgb3B0LnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgaWYgKHcubmFtZSA9PT0gYWN0aXZlV3MpIG9wdC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB3c1NlbGVjdC5hcHBlbmQob3B0KTtcbiAgICB9XG4gICAgLy8gSW5saW5lIFwiKyBOZXcgd29ya3NwYWNlXCIgYWN0aW9uIHNvIHVzZXJzIGNhbiBzcGluIHVwIGEgd29ya3NwYWNlXG4gICAgLy8gc3RyYWlnaHQgZnJvbSB0aGUgaGVhZGVyIHN3aXRjaGVyIHdpdGhvdXQgb3BlbmluZyBzZXR0aW5ncy4gSGFuZGxlZFxuICAgIC8vIGFzIGEgc2VudGluZWwgdmFsdWUgaW4gdGhlIGNoYW5nZSBsaXN0ZW5lciBiZWxvdy5cbiAgICBjb25zdCBuZXdPcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBuZXdPcHQudmFsdWUgPSAnX19uZXdfd29ya3NwYWNlX18nO1xuICAgIG5ld09wdC50ZXh0Q29udGVudCA9ICcrIE5ldyB3b3Jrc3BhY2UnO1xuICAgIHdzU2VsZWN0LmFwcGVuZChuZXdPcHQpO1xuICAgIGlmICghd3NMaXN0KSByZXR1cm47XG4gICAgd3NMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGZvciAoY29uc3QgdyBvZiB3b3Jrc3BhY2VzKSB7XG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5kYXRhc2V0LnRpcCA9IHcubmFtZSA9PT0gYWN0aXZlV3NcbiAgICAgICAgPyBgQWN0aXZlIHdvcmtzcGFjZTogJHt3Lm5hbWV9YFxuICAgICAgICA6IGBTd2l0Y2ggdG8gd29ya3NwYWNlIFwiJHt3Lm5hbWV9XCJgO1xuICAgICAgLy8gV2hvbGUgcm93IGlzIHRoZSBzd2l0Y2ggdHJpZ2dlciDigJQgbm8gZGVkaWNhdGVkIGNoZWNrIGJ1dHRvbi5cbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgLy8gSWdub3JlIGNsaWNrcyBvbiBpbm5lciBjb250cm9scyAodGhlIGRlbGV0ZSBidXR0b24gYmVsb3cpLlxuICAgICAgICBpZiAoKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdidXR0b24nKSkgcmV0dXJuO1xuICAgICAgICBmb2N1c1dvcmtzcGFjZVRhYih3Lm5hbWUpO1xuICAgICAgICBpZiAody5uYW1lID09PSBhY3RpdmVXcykgcmV0dXJuO1xuICAgICAgICBhd2FpdCBsb2FkV29ya3NwYWNlKHcubmFtZSk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbmFtZS5jbGFzc05hbWUgPSAnd3MtbmFtZSc7XG4gICAgICBuYW1lLnRleHRDb250ZW50ID0gdy5uYW1lO1xuICAgICAgbGkuYXBwZW5kKG5hbWUpO1xuICAgICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG1ldGEuY2xhc3NOYW1lID0gJ3dzLW1ldGEnO1xuICAgICAgbWV0YS50ZXh0Q29udGVudCA9IG5ldyBEYXRlKHcuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgIGxpLmFwcGVuZChtZXRhKTtcbiAgICAgIGlmICh3b3Jrc3BhY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgZGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGRlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGRlbC5jbGFzc05hbWUgPSAnZGFuZ2VyJztcbiAgICAgICAgZGVsLmRhdGFzZXQudGlwID0gJ0RlbGV0ZSB0aGlzIHdvcmtzcGFjZSBhbmQgZXZlcnl0aGluZyBpbiBpdCc7XG4gICAgICAgIGRlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBgRGVsZXRlIHdvcmtzcGFjZSAke3cubmFtZX1gKTtcbiAgICAgICAgZGVsLmlubmVySFRNTCA9IFBHX0lDT05TLnN2Z1N0cmluZygndHJhc2gtMicsIDEzKTtcbiAgICAgICAgZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGlmICghY29uZmlybShgRGVsZXRlIHdvcmtzcGFjZSBcIiR7dy5uYW1lfVwiIGFuZCBhbGwgaXRzIGNhcHR1cmVzP2ApKSByZXR1cm47XG4gICAgICAgICAgd29ya3NwYWNlcyA9IHdvcmtzcGFjZXMuZmlsdGVyKCh4KSA9PiB4Lm5hbWUgIT09IHcubmFtZSk7XG4gICAgICAgICAgcGVyc2lzdFdvcmtzcGFjZXMoKTtcbiAgICAgICAgICBpZiAoaW5FeHRlbnNpb24pIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShbd3NNc2dLZXkody5uYW1lKSwgd3NTaG90c0tleSh3Lm5hbWUpLCB3c1Nob3RzRnVsbEtleSh3Lm5hbWUpLCB3c1NuYXBzaG90c0tleSh3Lm5hbWUpXSkuY2F0Y2goKCkgPT4geyAvKiBpZ25vcmUgKi8gfSk7XG4gICAgICAgICAgaWYgKGFjdGl2ZVdzID09PSB3Lm5hbWUpIGF3YWl0IGxvYWRXb3Jrc3BhY2Uod29ya3NwYWNlc1swXSEubmFtZSk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaS5hcHBlbmQoZGVsKTtcbiAgICAgIH1cbiAgICAgIHdzTGlzdC5hcHBlbmQobGkpO1xuICAgIH1cbiAgICByZW5kZXJXc1NuYXBzaG90SGlzdG9yeSgpO1xuICB9O1xuXG4gIC8vIFJlbmRlciB0aGUgYWN0aXZlIHdvcmtzcGFjZSdzIHNuYXBzaG90IGhpc3RvcnkgKENsZWFyLWFsbCBhcmNoaXZlcykgd2l0aFxuICAvLyBhIFJlc3RvcmUgYWN0aW9uLiBBcHBlbmRlZCB1bmRlciB0aGUgd29ya3NwYWNlIGxpc3QgaW4gU2V0dGluZ3MuXG4gIGNvbnN0IHJlbmRlcldzU25hcHNob3RIaXN0b3J5ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW2RhdGEtd3Mtc25hcHNob3RzXScpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuO1xuICAgIGhvc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgaWYgKCF3c1NuYXBzaG90cy5sZW5ndGgpIHtcbiAgICAgIGhvc3QuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaG9zdC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZC5jbGFzc05hbWUgPSAnd3Mtc25hcC1oZWFkJztcbiAgICBoZWFkLnRleHRDb250ZW50ID0gYFNuYXBzaG90IGhpc3RvcnkgwrcgJHt3c1NuYXBzaG90cy5sZW5ndGh9YDtcbiAgICBoZWFkLmRhdGFzZXQudGlwID0gJ1Jlc3RvcmFibGUgc25hcHNob3RzIHNhdmVkIGJlZm9yZSBlYWNoIENsZWFyLWFsbCc7XG4gICAgaG9zdC5hcHBlbmQoaGVhZCk7XG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHVsLmNsYXNzTmFtZSA9ICd3cy1zbmFwLWxpc3QnO1xuICAgIGZvciAoY29uc3Qgc25hcCBvZiB3c1NuYXBzaG90cykge1xuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3QgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIG1ldGEuY2xhc3NOYW1lID0gJ3dzLXNuYXAtbWV0YSc7XG4gICAgICBtZXRhLnRleHRDb250ZW50ID0gYCR7bmV3IERhdGUoc25hcC50cykudG9Mb2NhbGVTdHJpbmcoKX0gwrcgJHtzbmFwLnNlbGVjdG9yc30gc2VsIMK3ICR7c25hcC5jb21tZW50c30gY210YDtcbiAgICAgIGxpLmFwcGVuZChtZXRhKTtcbiAgICAgIGNvbnN0IHJlc3RvcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIHJlc3RvcmUudHlwZSA9ICdidXR0b24nO1xuICAgICAgcmVzdG9yZS5jbGFzc05hbWUgPSAnd3Mtc25hcC1yZXN0b3JlJztcbiAgICAgIHJlc3RvcmUudGV4dENvbnRlbnQgPSAnUmVzdG9yZSc7XG4gICAgICByZXN0b3JlLmRhdGFzZXQudGlwID0gJ1Jlc3RvcmUgdGhpcyBzbmFwc2hvdCBpbnRvIHRoZSBjdXJyZW50IHdvcmtzcGFjZSAoY3VycmVudCBzdGF0ZSBpcyBrZXB0IG9uIHRoZSB1bmRvIHN0YWNrKSc7XG4gICAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCAmJiAhY29uZmlybSgnUmVzdG9yZSB0aGlzIHNuYXBzaG90PyBUaGUgY3VycmVudCBjYXB0dXJlcyB3aWxsIGJlIHJlcGxhY2VkICh1bmRvYWJsZSkuJykpIHJldHVybjtcbiAgICAgICAgcmVzdG9yZVdvcmtzcGFjZVNuYXBzaG90KHNuYXAuaWQpO1xuICAgICAgfSk7XG4gICAgICBsaS5hcHBlbmQocmVzdG9yZSk7XG4gICAgICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGRlbC50eXBlID0gJ2J1dHRvbic7XG4gICAgICBkZWwuY2xhc3NOYW1lID0gJ2RhbmdlciB3cy1zbmFwLWRlbCc7XG4gICAgICBkZWwuZGF0YXNldC50aXAgPSAnRGVsZXRlIHRoaXMgc25hcHNob3QnO1xuICAgICAgZGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdEZWxldGUgc25hcHNob3QnKTtcbiAgICAgIGRlbC5pbm5lckhUTUwgPSBQR19JQ09OUy5zdmdTdHJpbmcoJ3RyYXNoLTInLCAxMik7XG4gICAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBkZWxldGVXb3Jrc3BhY2VTbmFwc2hvdChzbmFwLmlkKTtcbiAgICAgIH0pO1xuICAgICAgbGkuYXBwZW5kKGRlbCk7XG4gICAgICB1bC5hcHBlbmQobGkpO1xuICAgIH1cbiAgICBob3N0LmFwcGVuZCh1bCk7XG4gIH07XG4gIHdzU2VsZWN0Py5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBhc3luYyAoZSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gKGUudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZTtcbiAgICBpZiAodmFsdWUgPT09ICdfX25ld193b3Jrc3BhY2VfXycpIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBzZWxlY3QgYmFjayB0byB0aGUgYWN0aXZlIHdvcmtzcGFjZSBmaXJzdCBzbyB0aGUgc2VudGluZWxcbiAgICAgIC8vIG5ldmVyIHN0aWNrcyBhcyB0aGUgZGlzcGxheWVkIHZhbHVlIGlmIHRoZSBwcm9tcHQgaXMgY2FuY2VsbGVkLlxuICAgICAgcmVuZGVyV3NDb250cm9scygpO1xuICAgICAgY29uc3QgbmFtZSA9ICh3aW5kb3cucHJvbXB0KCdOZXcgd29ya3NwYWNlIG5hbWUnKSA/PyAnJykudHJpbSgpO1xuICAgICAgaWYgKG5hbWUpIGF3YWl0IGNyZWF0ZVdvcmtzcGFjZUZsb3cobmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IGxvYWRXb3Jrc3BhY2UodmFsdWUpO1xuICAgIGZvY3VzV29ya3NwYWNlVGFiKHZhbHVlKTtcbiAgICByZW5kZXIoKTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIENvbW1hbmQgcGFsZXR0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdHlwZSBDb21tYW5kID0ge2lkOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHJ1bjogKCkgPT4gdm9pZH07XG4gIGNvbnN0IENPTU1BTkRTOiBDb21tYW5kW10gPSBbXG4gICAge2lkOiAnY29weS1hbGwnLCBsYWJlbDogJ0NvcHkgYWxsIGFzIEpTT05MJywgcnVuOiAoKSA9PiB2b2lkIG9uQ29weUFsbCgpfSxcbiAgICB7aWQ6ICdleHBvcnQnLCBsYWJlbDogJ0Rvd25sb2FkIEpTT05MIGZpbGUnLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnQoKX0sXG4gICAge2lkOiAnZXhwb3J0LXppcCcsIGxhYmVsOiAnRXhwb3J0IHdvcmtzcGFjZSBhcyAudGFyLnpzdCAoSlNPTkwgKyBzY3JlZW5zaG90cyArIER1Y2tEQiArIFJFQURNRSknLCBydW46ICgpID0+IHZvaWQgb25FeHBvcnRaaXAoKX0sXG4gICAge2lkOiAnY29weS1wYXRoJywgbGFiZWw6ICdDb3B5IHBhdGggb2YgbGFzdCBleHBvcnQnLCBydW46ICgpID0+IHZvaWQgb25Db3B5UGF0aCgpfSxcbiAgICB7aWQ6ICdkdWNrZGInLCBsYWJlbDogJ0dlbmVyYXRlIER1Y2tEQiBxdWVyeSBzbmlwcGV0IChTUUwgcmVjaXBlcyknLCBydW46ICgpID0+IHZvaWQgb25EdWNrRGJTbmlwcGV0KCl9LFxuICAgIHtpZDogJ2ltcG9ydCcsIGxhYmVsOiAnSW1wb3J0IEpTT05MIGZpbGUnLCBydW46IG9uSW1wb3J0fSxcbiAgICB7aWQ6ICd2YWxpZGF0ZScsIGxhYmVsOiAnUmUtY2hlY2sgc2VsZWN0b3JzJywgcnVuOiAoKSA9PiB2b2lkIG9uVmFsaWRhdGUoKX0sXG4gICAge2lkOiAncmVhdHRhY2gnLCBsYWJlbDogJ1JlLWF0dGFjaCB0byBwYWdlIChmaXggQWx0K0NsaWNrKScsIHJ1bjogKCkgPT4gdm9pZCBvblJlYXR0YWNoKCl9LFxuICAgIHtpZDogJ3JlbG9hZC1leHRlbnNpb24nLCBsYWJlbDogJ1JlbG9hZCB0aGUgUGluY2hHcmFiIGV4dGVuc2lvbiAobGFzdCByZXNvcnQpJywgcnVuOiAoKSA9PiB7IGlmIChpbkV4dGVuc2lvbikgY2hyb21lLnJ1bnRpbWUucmVsb2FkKCk7IH19LFxuICAgIHtpZDogJ2NsZWFyJywgbGFiZWw6ICdDbGVhciBhbGwgY2FwdHVyZXMnLCBydW46IG9uQ2xlYXJ9LFxuICAgIHtpZDogJ3NldHRpbmdzJywgbGFiZWw6ICdPcGVuIHNldHRpbmdzJywgcnVuOiBvcGVuRHJhd2VyfSxcbiAgICB7aWQ6ICdnaXRodWInLCBsYWJlbDogJ09wZW4gR2l0SHViIHJlcG8nLCBydW46IG9uR2l0aHVifSxcbiAgICB7aWQ6ICdtYW51YWwnLCBsYWJlbDogJ01hbnVhbCBjYXB0dXJlIChzdGFydCBjb21wb3NlciB3aXRoIGA+IHNlbGVjdG9yYCknLCBydW46ICgpID0+IHsgY29tcG9zZXIudmFsdWUgPSAnPiAnOyBjb21wb3Nlci5mb2N1cygpOyB1cGRhdGVDb21wb3Nlck1ldGVyKCk7IH19LFxuICAgIHtpZDogJ3VuZG8nLCBsYWJlbDogJ1VuZG8nLCBydW46IHVuZG99LFxuICAgIHtpZDogJ3JlZG8nLCBsYWJlbDogJ1JlZG8nLCBydW46IHJlZG99LFxuICBdO1xuICBjb25zdCByZW5kZXJQYWxldHRlID0gKHEgPSAnJyk6IHZvaWQgPT4ge1xuICAgIHBhbGV0dGVMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnN0IHFsID0gcS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uQ09NTUFORFMuZmlsdGVyKChjKSA9PiAhcWwgfHwgYy5sYWJlbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSlcbiAgICAgICAgLm1hcCgoYykgPT4gKHtsYWJlbDogYy5sYWJlbCwgcHJldmlldzogJ2NvbW1hbmQnLCBydW46IGMucnVufSkpLFxuICAgICAgLi4ubWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InICYmICghcWwgfHxcbiAgICAgICAgKG0uZW50cnkuc2VsZWN0b3IgKyAnICcgKyAobS5lbnRyeS50ZXh0ID8/ICcnKSArICcgJyArIChtLmVudHJ5LmNvbXBvbmVudFJvb3QgPz8gJycpKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHFsKSkpXG4gICAgICAgIC5zbGljZSgwLCAzMClcbiAgICAgICAgLm1hcCgobSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZiID0gY29sbGVjdEZlZWRiYWNrQWZ0ZXIobS5pZCk7XG4gICAgICAgICAgY29uc3QgcHJldmlldyA9IChtLmVudHJ5LnRleHQgPz8gZmJbMF0gPz8gbS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3IgPz8gJycpLnNsaWNlKDAsIDgwKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGFiZWw6IGAjJHttLmVudHJ5Lm59ICR7bS5lbnRyeS5jb21wb25lbnRSb290ID8/IG0uZW50cnkuc2VsZWN0b3J9YCxcbiAgICAgICAgICAgIHByZXZpZXcsXG4gICAgICAgICAgICBydW46ICgpID0+IHtcbiAgICAgICAgICAgICAgY2xvc2VQYWxldHRlKCk7XG4gICAgICAgICAgICAgIHNjcm9sbE1lc3NhZ2VJbnRvVmlldyhtLmlkKTtcbiAgICAgICAgICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ3Njcm9sbC10bycsIHNlbGVjdG9yOiBtLmVudHJ5LnNlbGVjdG9yfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgIF07XG4gICAgaXRlbXMuZm9yRWFjaCgoaXQsIGkpID0+IHtcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IGxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxibC5jbGFzc05hbWUgPSAnbGFiZWwnO1xuICAgICAgbGJsLmlubmVySFRNTCA9IGhpZ2hsaWdodE1hdGNoKGl0LmxhYmVsLCBxKTtcbiAgICAgIGxpLmFwcGVuZChsYmwpO1xuICAgICAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHAuY2xhc3NOYW1lID0gJ3ByZXZpZXcnO1xuICAgICAgcC5pbm5lckhUTUwgPSBoaWdobGlnaHRNYXRjaChpdC5wcmV2aWV3ID8/ICcnLCBxKTtcbiAgICAgIGxpLmFwcGVuZChwKTtcbiAgICAgIGNvbnN0IGtiZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGtiZC5jbGFzc05hbWUgPSAna2JkJztcbiAgICAgIGtiZC50ZXh0Q29udGVudCA9ICfihrUnO1xuICAgICAgbGkuYXBwZW5kKGtiZCk7XG4gICAgICBpZiAoaSA9PT0gMCkgbGkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgaXQucnVuKCk7IH0pO1xuICAgICAgcGFsZXR0ZUxpc3QuYXBwZW5kKGxpKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb3BlblBhbGV0dGUgPSAocHJlc2V0ID0gJycpOiB2b2lkID0+IHtcbiAgICBwYWxldHRlLmhpZGRlbiA9IGZhbHNlO1xuICAgIHBhbGV0dGVJbnB1dC52YWx1ZSA9IHByZXNldDtcbiAgICByZW5kZXJQYWxldHRlKHByZXNldCk7XG4gICAgcGFsZXR0ZUlucHV0LmZvY3VzKCk7XG4gICAgcGFsZXR0ZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKHByZXNldC5sZW5ndGgsIHByZXNldC5sZW5ndGgpO1xuICB9O1xuICBjb25zdCBjbG9zZVBhbGV0dGUgPSAoKTogdm9pZCA9PiB7IHBhbGV0dGUuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gcmVuZGVyUGFsZXR0ZShwYWxldHRlSW5wdXQudmFsdWUpKTtcbiAgcGFsZXR0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gWy4uLnBhbGV0dGVMaXN0LmNoaWxkcmVuXTtcbiAgICBsZXQgYWN0aXZlID0gaXRlbXMuZmluZEluZGV4KChsaSkgPT4gbGkuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSk7XG4gICAgaWYgKGUua2V5ID09PSAnQXJyb3dEb3duJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1pbihpdGVtcy5sZW5ndGggLSAxLCBhY3RpdmUgKyAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGZvciAoY29uc3QgbGkgb2YgaXRlbXMpIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpOyBhY3RpdmUgPSBNYXRoLm1heCgwLCBhY3RpdmUgLSAxKTsgaXRlbXNbYWN0aXZlXT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyAoaXRlbXNbYWN0aXZlXSBhcyBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCk/LmNsaWNrKCk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBjbG9zZVBhbGV0dGUoKTtcbiAgfSk7XG4gIHBhbGV0dGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4geyBpZiAoZS50YXJnZXQgPT09IHBhbGV0dGUpIGNsb3NlUGFsZXR0ZSgpOyB9KTtcblxuICAvLyDilIDilIDilIAgQ29udGV4dCBzdHJpcCAoaG92ZXIgaGVscCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vIFJlcGxhY2VzIHRoZSBvbGQgZmxvYXRpbmcgY3Vyc29yIHRvb2x0aXA6IFtkYXRhLXRpcF0gaG92ZXIgdGV4dCBpc1xuICAvLyB3cml0dGVuIGludG8gdGhlIGZpeGVkIHN0cmlwIHVuZGVyIHRoZSBoZWFkZXIsIHNvIGhlbHAgbmV2ZXIgb2NjbHVkZXNcbiAgLy8gb3RoZXIgY29udHJvbHMgYW5kIGNhbid0IHN0cmFuZCBtaWQtc2NyZWVuIHRocm91Z2ggcmUtcmVuZGVycy5cbiAgY29uc3QgVElQX0lETEUgPSAnQWx0K0NsaWNrIG9uIHRoZSBwYWdlIHRvIGNhcHR1cmUgwrcgaG92ZXIgYW55IGNvbnRyb2wgZm9yIGhlbHAnO1xuICBsZXQgdGlwRm9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBjb25zdCBzaG93VGlwID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXAnKTtcbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICB0b29sdGlwRWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHRvb2x0aXBFbC5kYXRhc2V0LnNob3duID0gJ3RydWUnO1xuICB9O1xuICBjb25zdCBoaWRlVGlwID0gKCk6IHZvaWQgPT4ge1xuICAgIHRpcEZvciA9IG51bGw7XG4gICAgdG9vbHRpcEVsLnRleHRDb250ZW50ID0gVElQX0lETEU7XG4gICAgdG9vbHRpcEVsLmRhdGFzZXQuc2hvd24gPSAnZmFsc2UnO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ1tkYXRhLXRpcF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKCF0IHx8IHQgPT09IHRpcEZvcikgcmV0dXJuO1xuICAgIHRpcEZvciA9IHQ7XG4gICAgc2hvd1RpcCh0KTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICBjb25zdCB0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdbZGF0YS10aXBdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICh0ICYmIHQgPT09IHRpcEZvciAmJiAhdC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIGhpZGVUaXAoKTtcbiAgfSk7XG4gIC8vIFJlLXJlbmRlcnMgY2FuIGRyb3AgdGhlIGhvdmVyZWQgbm9kZSB3aXRob3V0IGV2ZXIgZmlyaW5nIG1vdXNlb3V0XG4gIC8vIChyZW5kZXIoKSByZXNldHMgbGlzdC5pbm5lckhUTUwsIGNvbmZpcm0gYnV0dG9ucyByZXBsYWNlV2l0aCk7IHJlc2V0XG4gIC8vIHRoZSBzdHJpcCB0byBpdHMgaWRsZSBoaW50IHdoZW4gdGhhdCBoYXBwZW5zLlxuICBjb25zdCB0aXBHdWFyZCA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICBpZiAodGlwRm9yICYmICF0aXBGb3IuaXNDb25uZWN0ZWQpIGhpZGVUaXAoKTtcbiAgfSk7XG4gIHRpcEd1YXJkLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge2NoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZX0pO1xuXG4gIC8vIOKUgOKUgOKUgCBTdGF0IGRyaWxsZG93bnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGFwcGVuZEhlYWRpbmcgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g1Jyk7XG4gICAgaC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgcm9vdC5hcHBlbmQoaCk7XG4gIH07XG4gIGNvbnN0IGFwcGVuZEJvbGQgPSAocm9vdDogUGFyZW50Tm9kZSwgdGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKTtcbiAgICBiLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICByb290LmFwcGVuZChiKTtcbiAgfTtcbiAgY29uc3QgYXBwZW5kQ29kZSA9IChyb290OiBQYXJlbnROb2RlLCB0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29kZScpO1xuICAgIGNvZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHJvb3QuYXBwZW5kKGNvZGUpO1xuICB9O1xuICBjb25zdCBidWlsZERyaWxsZG93biA9IChraW5kOiBzdHJpbmcpOiBEb2N1bWVudEZyYWdtZW50ID0+IHtcbiAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGlmIChraW5kID09PSAnc2VsZWN0b3JzJykge1xuICAgICAgYXBwZW5kSGVhZGluZyhmcmFnLCAnU2VsZWN0b3JzIGJ5IHF1YWxpdHknKTtcbiAgICAgIGNvbnN0IGJ1Y2tldHMgPSB7aWQ6IDAsIHRlc3RpZDogMCwgY2xhc3M6IDAsIG50aDogMCwgdGFnOiAwfTtcbiAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykge1xuICAgICAgICBpZiAobS50eXBlICE9PSAnc2VsZWN0b3InKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgZSA9IG0uZW50cnk7XG4gICAgICAgIGlmIChlLnRlc3RJZCkgYnVja2V0cy50ZXN0aWQrKztcbiAgICAgICAgZWxzZSBpZiAoZS5pZCB8fCAvXiNbXFx3LV0rJC8udGVzdChlLnNlbGVjdG9yKSkgYnVja2V0cy5pZCsrO1xuICAgICAgICBlbHNlIGlmICgoZS5zZWxlY3RvciA/PyAnJykuaW5jbHVkZXMoJzpudGgtb2YtdHlwZScpKSBidWNrZXRzLm50aCsrO1xuICAgICAgICBlbHNlIGlmICgvXFwuLy50ZXN0KGUuc2VsZWN0b3IgPz8gJycpKSBidWNrZXRzLmNsYXNzKys7XG4gICAgICAgIGVsc2UgYnVja2V0cy50YWcrKztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGZvciAoY29uc3QgW3ZhbHVlLCBsYWJlbF0gb2YgW1xuICAgICAgICBbYnVja2V0cy50ZXN0aWQsICcgZGF0YS10ZXN0aWQnXSxcbiAgICAgICAgW2J1Y2tldHMuaWQsICcgc3RhYmxlIGlkJ10sXG4gICAgICAgIFtidWNrZXRzLmNsYXNzLCAnIGNsYXNzLWJhc2VkJ10sXG4gICAgICAgIFtidWNrZXRzLm50aCwgJyBudGgtb2YtdHlwZSddLFxuICAgICAgICBbYnVja2V0cy50YWcsICcgdGFnLW9ubHknXSxcbiAgICAgIF0gYXMgY29uc3QpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBhcHBlbmRCb2xkKGxpLCBTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgbGkuYXBwZW5kKGxhYmVsKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdzdGFsZScpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1N0YWxlIGNhcHR1cmVzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBzdGFsZSA9IG1lc3NhZ2VzLmZpbHRlcigobSk6IG0gaXMgU2VsZWN0b3JNZXNzYWdlID0+IG0udHlwZSA9PT0gJ3NlbGVjdG9yJyAmJiBzZWxlY3RvclZhbGlkaXR5LmdldChtLmVudHJ5LnNlbGVjdG9yKSA9PT0gZmFsc2UpO1xuICAgICAgaWYgKCFzdGFsZS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaS50ZXh0Q29udGVudCA9ICdOb25lIC0gZXZlcnl0aGluZyByZXNvbHZlcy4nO1xuICAgICAgICB1bC5hcHBlbmQobGkpO1xuICAgICAgfSBlbHNlIGZvciAoY29uc3QgbSBvZiBzdGFsZSkge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIGAjJHttLmVudHJ5Lm59YCk7XG4gICAgICAgIGxpLmFwcGVuZCgnICcpO1xuICAgICAgICBhcHBlbmRDb2RlKGxpLCAobS5lbnRyeS5zZWxlY3RvciA/PyAnJykuc2xpY2UoMCwgNTApKTtcbiAgICAgICAgdWwuYXBwZW5kKGxpKTtcbiAgICAgIH1cbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdjb21tZW50cycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ0NvbW1lbnRzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBmYnMgPSBtZXNzYWdlcy5maWx0ZXIoKG0pOiBtIGlzIEZlZWRiYWNrTWVzc2FnZSA9PiBtLnR5cGUgPT09ICdmZWVkYmFjaycpO1xuICAgICAgY29uc3QgdG90YWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgdG90YWwuYXBwZW5kKCdUb3RhbCB3b3JkczogJyk7XG4gICAgICBhcHBlbmRCb2xkKHRvdGFsLCBTdHJpbmcoZmJzLnJlZHVjZSgocywgbSkgPT4gcyArIHdvcmRDb3VudChtLnRleHQpLCAwKSkpO1xuICAgICAgdWwuYXBwZW5kKHRvdGFsKTtcbiAgICAgIGNvbnN0IGF2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBhdmcuYXBwZW5kKCdBdmVyYWdlIGxlbmd0aDogJyk7XG4gICAgICBhcHBlbmRCb2xkKGF2ZywgU3RyaW5nKGZicy5sZW5ndGggPyBNYXRoLnJvdW5kKGZicy5yZWR1Y2UoKHMsIG0pID0+IHMgKyBtLnRleHQubGVuZ3RoLCAwKSAvIGZicy5sZW5ndGgpIDogMCkpO1xuICAgICAgYXZnLmFwcGVuZCgnIGNoYXJzJyk7XG4gICAgICB1bC5hcHBlbmQoYXZnKTtcbiAgICAgIGZyYWcuYXBwZW5kKHVsKTtcbiAgICB9IGVsc2UgaWYgKGtpbmQgPT09ICdwYWdlcycpIHtcbiAgICAgIGFwcGVuZEhlYWRpbmcoZnJhZywgJ1BhZ2VzJyk7XG4gICAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBjb25zdCBzZWVuID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICAgIGZvciAoY29uc3QgbSBvZiBtZXNzYWdlcykgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2Vlbi5zZXQobS5lbnRyeS51cmwsIChzZWVuLmdldChtLmVudHJ5LnVybCkgPz8gMCkgKyAxKTtcbiAgICAgIGZvciAoY29uc3QgW3VybCwgbl0gb2Ygc2Vlbikge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFwcGVuZEJvbGQobGksIFN0cmluZyhuKSk7XG4gICAgICAgIGxpLmFwcGVuZChgIHNlbGVjdG9yJHtuID09PSAxID8gJycgOiAncyd9IMK3IGApO1xuICAgICAgICBhcHBlbmRDb2RlKGxpLCBwYXRoT2YodXJsKSk7XG4gICAgICAgIHVsLmFwcGVuZChsaSk7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZCh1bCk7XG4gICAgfVxuICAgIHJldHVybiBmcmFnO1xuICB9O1xuICBjb25zdCBzaG93RHJpbGxkb3duID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBraW5kID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zdGF0Jyk7XG4gICAgaWYgKCFraW5kKSByZXR1cm47XG4gICAgZHJpbGxkb3duRWwucmVwbGFjZUNoaWxkcmVuKGJ1aWxkRHJpbGxkb3duKGtpbmQpKTtcbiAgICBkcmlsbGRvd25FbC5oaWRkZW4gPSBmYWxzZTtcbiAgICBjb25zdCByID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGRSID0gZHJpbGxkb3duRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHRvcCA9IHIuYm90dG9tICsgNjtcbiAgICBsZXQgbGVmdCA9IHIubGVmdCArIHIud2lkdGggLyAyIC0gZFIud2lkdGggLyAyO1xuICAgIGlmICh0b3AgKyBkUi5oZWlnaHQgKyA0ID4gd2luZG93LmlubmVySGVpZ2h0KSB0b3AgPSByLnRvcCAtIGRSLmhlaWdodCAtIDY7XG4gICAgaWYgKGxlZnQgPCA2KSBsZWZ0ID0gNjtcbiAgICBpZiAobGVmdCArIGRSLndpZHRoID4gd2luZG93LmlubmVyV2lkdGggLSA2KSBsZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSBkUi53aWR0aCAtIDY7XG4gICAgZHJpbGxkb3duRWwuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHt0b3B9cHg7bGVmdDoke2xlZnR9cHg7YDtcbiAgfTtcbiAgY29uc3QgaGlkZURyaWxsZG93biA9ICgpOiB2b2lkID0+IHsgZHJpbGxkb3duRWwuaGlkZGVuID0gdHJ1ZTsgfTtcbiAgc3RhdHNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgIGNvbnN0IHQgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJy5zdGF0W2RhdGEtc3RhdF0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKHQpIHNob3dEcmlsbGRvd24odCk7XG4gIH0pO1xuICBzdGF0c0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICBpZiAoIXN0YXRzRWwuY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGUpKSBoaWRlRHJpbGxkb3duKCk7XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBFeHBvcnQtYnV0dG9uIGhvdmVyIOKGkiBvdXRsaW5lLW11bHRpIG9uIHBhZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGZvciAoY29uc3QgYnRuIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWV4cG9ydC1ob3Zlcl0nKSkge1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0b3JzID0gbWVzc2FnZXMuZmlsdGVyKChtKTogbSBpcyBTZWxlY3Rvck1lc3NhZ2UgPT4gbS50eXBlID09PSAnc2VsZWN0b3InKS5tYXAoKG0pID0+IG0uZW50cnkuc2VsZWN0b3IpO1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtbXVsdGknLCBzZWxlY3RvcnN9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubXNnLnNlbGVjdG9yJykpIGVsLmNsYXNzTGlzdC5hZGQoJ2V4cG9ydC1ob3ZlcicpO1xuICAgIH0pO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdm9pZCBzZW5kVG9DUyh7a2luZDogJ291dGxpbmUtbXVsdGktY2xlYXInfSk7XG4gICAgICBmb3IgKGNvbnN0IGVsIG9mIGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm1zZy5zZWxlY3RvcicpKSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdleHBvcnQtaG92ZXInKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBDbGljayBkZWxlZ2F0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgdHJpZ2dlciA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnW2RhdGEtYWN0aW9uXScpO1xuICAgIGlmICghdHJpZ2dlcikgcmV0dXJuO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1hY3Rpb24nKTtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSAnc2VuZCc6IHNlbmRGZWVkYmFjaygpOyByZXR1cm47XG4gICAgICBjYXNlICdjb3B5LWFsbCc6IHZvaWQgb25Db3B5QWxsKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2V4cG9ydCc6IHZvaWQgb25FeHBvcnQoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZXhwb3J0LXppcCc6IHZvaWQgb25FeHBvcnRaaXAoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY29weS1wYXRoJzogdm9pZCBvbkNvcHlQYXRoKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2ltcG9ydCc6IG9uSW1wb3J0KCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3ZhbGlkYXRlJzogdm9pZCBvblZhbGlkYXRlKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ3JlYXR0YWNoJzogdm9pZCBvblJlYXR0YWNoKCk7IHJldHVybjtcbiAgICAgIGNhc2UgJ2NsZWFyJzogb25DbGVhcigpOyByZXR1cm47XG4gICAgICBjYXNlICdnaXRodWInOiBvbkdpdGh1YigpOyByZXR1cm47XG4gICAgICBjYXNlICdzZXR0aW5ncyc6IG9wZW5EcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnY2xvc2UtZHJhd2VyJzogY2xvc2VEcmF3ZXIoKTsgcmV0dXJuO1xuICAgICAgY2FzZSAndW5kbyc6IHVuZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAncmVkbyc6IHJlZG8oKTsgcmV0dXJuO1xuICAgICAgY2FzZSAnZGVzaWduLWVkaXQnOiB7IHZvaWQgb3Blbk1kTW9kYWwoJ2Rlc2lnbicpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ3NraWxsLWVkaXQnOiAgeyB2b2lkIG9wZW5NZE1vZGFsKCdza2lsbCcpOyByZXR1cm47IH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduLW1kLWZpbGUnKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCk/LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi10ZW1wbGF0ZS1kb3dubG9hZCc6IHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIFByZWZlciB0aGUgdXNlcidzIGxvY2FsIG92ZXJyaWRlIGlmIHByZXNlbnQgKHNvIGEgZm9yaydzXG4gICAgICAgICAgLy8gXCJEb3dubG9hZCB0ZW1wbGF0ZVwiIHByb2R1Y2VzIHRoZSBzYW1lIGNvbnRlbnQgdGhlIGZvcmsgc2hpcHMpXG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBnZW5lcmljIHRlbXBsYXRlLlxuICAgICAgICAgIGNvbnN0IHRleHQgPSAoYXdhaXQgbG9hZFRlbXBsYXRlKCdsb2NhbERlc2lnbicpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdkZXNpZ25UZW1wbGF0ZScpKTtcbiAgICAgICAgICBpZiAoIXRleHQpIHsgc2V0U3RhdHVzKCdUZW1wbGF0ZSBub3QgZm91bmQnLCB7a2luZDogJ3dhcm4nfSk7IHJldHVybjsgfVxuICAgICAgICAgIGRvd25sb2FkVGV4dCgnREVTSUdOLnRlbXBsYXRlLm1kJywgdGV4dCk7XG4gICAgICAgICAgc2V0U3RhdHVzKCdERVNJR04ubWQgdGVtcGxhdGUgZG93bmxvYWRlZCDigJQgZmlsbCBpbiBhbmQgcmUtdXBsb2FkJyk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Rlc2lnbi1yZXNldC10ZW1wbGF0ZSc6IHtcbiAgICAgICAgcHJlZnMuZGVzaWduTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnREVTSUdOLm1kIHJlc2V0IOKAlCBleHBvcnRzIHdpbGwgYnVuZGxlIHRoZSB0ZW1wbGF0ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYXNlICdza2lsbC11cGxvYWQnOiB7XG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2tpbGwtbWQtZmlsZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsKT8uY2xpY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtdGVtcGxhdGUtZG93bmxvYWQnOiB7XG4gICAgICAgIHZvaWQgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gKGF3YWl0IGxvYWRUZW1wbGF0ZSgnbG9jYWxTa2lsbCcpKSB8fCAoYXdhaXQgbG9hZFRlbXBsYXRlKCdza2lsbFRlbXBsYXRlJykpO1xuICAgICAgICAgIGlmICghdGV4dCkgeyBzZXRTdGF0dXMoJ1RlbXBsYXRlIG5vdCBmb3VuZCcsIHtraW5kOiAnd2Fybid9KTsgcmV0dXJuOyB9XG4gICAgICAgICAgZG93bmxvYWRUZXh0KCdQaW5jaEdyYWIuU0tJTEwudGVtcGxhdGUubWQnLCB0ZXh0KTtcbiAgICAgICAgICBzZXRTdGF0dXMoJ1NLSUxMLm1kIHRlbXBsYXRlIGRvd25sb2FkZWQnKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FzZSAnc2tpbGwtcmVzZXQtdGVtcGxhdGUnOiB7XG4gICAgICAgIHByZWZzLnNraWxsTWQgPSAnJztcbiAgICAgICAgcGVyc2lzdFByZWZzKCk7XG4gICAgICAgIGFwcGx5UHJlZnNUb1VJKCk7XG4gICAgICAgIHNldFN0YXR1cygnU0tJTEwubWQgcmVzZXQg4oCUIGV4cG9ydHMgd2lsbCBidW5kbGUgdGhlIHRlbXBsYXRlJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3dzLWNyZWF0ZSc6IHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICh3c05hbWUudmFsdWUgPz8gJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG4gICAgICAgIHZvaWQgY3JlYXRlV29ya3NwYWNlRmxvdyhuYW1lKS50aGVuKChvaykgPT4geyBpZiAob2spIHdzTmFtZS52YWx1ZSA9ICcnOyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIOKUgOKUgOKUgCBHbG9iYWwga2V5Ym9hcmQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGNvbnN0IGlzRWRpdGFibGVLZXlib2FyZFRhcmdldCA9ICh0YXJnZXQ6IEV2ZW50VGFyZ2V0IHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IGVsID0gdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyB0YXJnZXQgOiBudWxsO1xuICAgIHJldHVybiBCb29sZWFuKGVsPy5jbG9zZXN0KCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCwgW2NvbnRlbnRlZGl0YWJsZT1cInRydWVcIl0sIFtjb250ZW50ZWRpdGFibGU9XCJcIl0nKSk7XG4gIH07XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgY29uc3QgZWRpdGFibGVUYXJnZXQgPSBpc0VkaXRhYmxlS2V5Ym9hcmRUYXJnZXQoZS50YXJnZXQpO1xuICAgIGlmIChlZGl0YWJsZVRhcmdldCAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgWydhJywgJ3onLCAneSddLmluY2x1ZGVzKGUua2V5LnRvTG93ZXJDYXNlKCkpKSByZXR1cm47XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAnaycpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBwYWxldHRlLmhpZGRlbiA/IG9wZW5QYWxldHRlKCkgOiBjbG9zZVBhbGV0dGUoKTsgcmV0dXJuOyB9XG4gICAgLy8gQ3RybCtGIChhbmQgQ21kK0YpIG9wZW5zIHRoZSBpbi1saXN0IHZpc3VhbCBmaW5kIOKAlCBkaXN0aW5jdCBmcm9tIHRoZVxuICAgIC8vIENtZCtLIGNvbW1hbmQgcGFsZXR0ZS4gT3ZlcnJpZGUgdGhlIGJyb3dzZXIncyBuYXRpdmUgZmluZCBzbyB0aGUgcGFuZWxcbiAgICAvLyBvd25zIHRoZSBnZXN0dXJlLlxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2YnKSB7IGUucHJldmVudERlZmF1bHQoKTsgb3BlbkZpbmQoKTsgcmV0dXJuOyB9XG4gICAgaWYgKChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicgJiYgIWUuc2hpZnRLZXkpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB1bmRvKCk7IHJldHVybjsgfVxuICAgIGlmICgoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkgJiYgKGUua2V5LnRvTG93ZXJDYXNlKCkgPT09ICd5JyB8fCAoZS5zaGlmdEtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicpKSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHJlZG8oKTsgcmV0dXJuOyB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgY29uc3QgbWRNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbZGF0YS1tZC1tb2RhbF0nKTtcbiAgICAgIGlmIChtZE1vZGFsICYmICFtZE1vZGFsLmhpZGRlbikgeyBjbG9zZU1kTW9kYWwoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAoIXBhbGV0dGUuaGlkZGVuKSB7IGNsb3NlUGFsZXR0ZSgpOyByZXR1cm47IH1cbiAgICAgIGlmICghZHJhd2VyLmhpZGRlbikgeyBjbG9zZURyYXdlcigpOyByZXR1cm47IH1cbiAgICAgIGlmIChmaW5kQmFyICYmICFmaW5kQmFyLmhpZGRlbikgeyBjbG9zZUZpbmQoKTsgcmV0dXJuOyB9XG4gICAgICBpZiAocGVuZGluZ011bHRpLmxlbmd0aCkgeyB2b2lkIHNlbmRUb0NTKHtraW5kOiAncGVuZGluZy1jYW5jZWwnfSk7IHBlbmRpbmdNdWx0aSA9IFtdOyByZW5kZXIoKTsgc2V0U3RhdHVzKCdQZW5kaW5nIGdyb3VwIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChpbnNlcnRCZWZvcmUuY3VycmVudCkgeyBpbnNlcnRCZWZvcmUuY3VycmVudCA9IG51bGw7IHJlbmRlcigpOyBzZXRTdGF0dXMoJ0luc2VydCBtb2RlIGNhbmNlbGxlZCcpOyByZXR1cm47IH1cbiAgICAgIGlmIChzZWFyY2hRdWVyeSkgY2xvc2VGaW5kKCk7XG4gICAgfVxuICAgIGlmIChlLmtleSA9PT0gJ0FsdCcgfHwgZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogdHJ1ZX0pO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIGlmICghZS5hbHRLZXkpIHZvaWQgc2VuZFRvQ1Moe2tpbmQ6ICdhbHQtc3RhdGUnLCBvbjogZmFsc2V9KTtcbiAgfSk7XG5cbiAgLy8g4pSA4pSA4pSAIEJyaWRnZSB3aXJpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIGxldCBwYW5lbFJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHBlbmRpbmdQYW5lbE1lc3NhZ2VzOiBhbnlbXSA9IFtdO1xuICBjb25zdCByZWNlaXZlUGFuZWxNZXNzYWdlID0gKG06IGFueSk6IHZvaWQgPT4ge1xuICAgIGlmICghcGFuZWxSZWFkeSkge1xuICAgICAgcGVuZGluZ1BhbmVsTWVzc2FnZXMucHVzaChtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25Dc01lc3NhZ2UobSk7XG4gIH07XG4gIGlmIChpbkV4dGVuc2lvbikge1xuICAgIC8vIFNpbmdsZSBjaGFubmVsOiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuIFRoZSBiYWNrZ3JvdW5kIHVzZWQgdG8gcmVsYXlcbiAgICAvLyB0aHJvdWdoIGEgcG9ydCB0b28sIGJ1dCBjb250ZW50LXNjcmlwdCBicm9hZGNhc3RzIGFscmVhZHkgcmVhY2ggdGhlXG4gICAgLy8gc2lkZSBwYW5lbCBkaXJlY3RseSDigJQgcmVsYXlpbmcgcHJvZHVjZWQgZHVwbGljYXRlIGRpc3BhdGNoZXMuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtOiBhbnkpID0+IHJlY2VpdmVQYW5lbE1lc3NhZ2UobSkpO1xuICAgIGNocm9tZS50YWJzPy5vbkFjdGl2YXRlZD8uYWRkTGlzdGVuZXIoKCkgPT4gdm9pZCBydW5WYWxpZGF0aW9uKCkpO1xuICAgIGNocm9tZS50YWJzPy5vblVwZGF0ZWQ/LmFkZExpc3RlbmVyKChfaWQsIGluZm8pID0+IHsgaWYgKGluZm8/LnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykgdm9pZCBydW5WYWxpZGF0aW9uKCk7IH0pO1xuICAgIGNocm9tZS50YWJzPy5vblJlbW92ZWQ/LmFkZExpc3RlbmVyKChjbG9zZWRJZCkgPT4ge1xuICAgICAgY29uc3Qgd3MgPSB3b3Jrc3BhY2VzLmZpbmQoKHcpID0+IHcudGFiSWQgPT09IGNsb3NlZElkKTtcbiAgICAgIGlmICh3cykgeyB3cy50YWJJZCA9IHVuZGVmaW5lZDsgcGVyc2lzdFdvcmtzcGFjZXMoKTsgcmVuZGVyV3NDb250cm9scygpOyB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BpbmNoZ3JhYjp0by1wYW5lbCcsIChlKSA9PiByZWNlaXZlUGFuZWxNZXNzYWdlKChlIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWwpKTtcbiAgfVxuXG4gIC8vIOKUgOKUgOKUgCBUZXN0IEFQSSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgY29uc3QgaW5zdGFsbFRlc3RBcGkgPSAoKTogdm9pZCA9PiB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLl9fcGluY2hncmFiX3BhbmVsID0ge1xuICAgICAgcHVzaE1lc3NhZ2U6IChtOiBQYW5lbE1lc3NhZ2UpID0+IHsgbWVzc2FnZXMucHVzaChtKTsgcGVyc2lzdCgpOyByZW5kZXIoKTsgfSxcbiAgICAgIG9uQ2FwdHVyZSwgb25Ib3Zlciwgb25Ib3ZlckVuZCwgb25QYWdlU25hcHNob3QsXG4gICAgICBnZXRNZXNzYWdlczogKCkgPT4gWy4uLm1lc3NhZ2VzXSxcbiAgICAgIGdldFByZWZzOiAoKSA9PiAoey4uLnByZWZzfSksXG4gICAgICBzZXRQcmVmczogKHA6IFBhcnRpYWw8UHJlZnM+KSA9PiB7IHByZWZzID0gey4uLnByZWZzLCAuLi5wfTsgcGVyc2lzdFByZWZzKCk7IGFwcGx5UHJlZnNUb1VJKCk7IHJlbmRlcigpOyB9LFxuICAgICAgYnVpbGRKc29ubCxcbiAgICAgIGJ1aWxkRXhwb3J0RmlsZW5hbWUsIGJ1aWxkTWFuaWZlc3QsIGRvbWluYW50SG9zdFNsdWcsIGRpc3RpbmN0SG9zdHMsXG4gICAgICBkdWNrRGJTbmlwcGV0LCBvbkV4cG9ydFppcCwgb25FeHBvcnQsIG9uQ29weVBhdGgsXG4gICAgICBkZW5vcm1hbGl6ZUVudHJ5LFxuICAgICAgZ2V0TGFzdEV4cG9ydDogKCkgPT4gKHsuLi5sYXN0RXhwb3J0fSksXG4gICAgICAvLyBUZXN0IGhhdGNoOiBzZWVkIGV2ZXJ5IHNlbGVjdG9yIGNhcHR1cmUgd2l0aCB0aGUgc2FtZSBmdWxsIFBORyBkYXRhVVJMXG4gICAgICAvLyBzbyB0aGUgYXJjaGl2ZSBleHBvcnQgaGFzIHNvbWV0aGluZyB0byBidW5kbGUuIFJlYWwgY2FwdHVyZXMgcG9wdWxhdGVcbiAgICAgIC8vIHNob3RzRnVsbCBmcm9tIHRoZSBiZyBgcnVuU2hvdGAgcmVwbHk7IHRlc3RzIGNhbid0IGVhc2lseSBydW4gYVxuICAgICAgLy8gY2FwdHVyZVZpc2libGVUYWIsIHNvIHRoaXMgbGV0cyB1cyBwcm92ZSB0aGUgUE5HIGJ1bmRsaW5nIHBhdGguXG4gICAgICBfX3NlZWRTaG90c0Z1bGw6IChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ3NlbGVjdG9yJykgc2hvdHNGdWxsLnNldChtLmVudHJ5LnNlbGVjdG9yLCBkYXRhVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBwZXJzaXN0U2hvdHNGdWxsKCk7XG4gICAgICB9LFxuICAgICAgX19nZXRTaG90c0Z1bGw6ICgpID0+IHNob3RzRnVsbCxcbiAgICAgIC8vIEZyZWV6ZSB0aGUgZXhwb3J0IGNsb2NrIChJU08gc3RyaW5nKSBzbyB0ZXN0cyBjYW4gYXNzZXJ0IHR3b1xuICAgICAgLy8gZXhwb3J0cyBvZiBpZGVudGljYWwgY29udGVudCBhcmUgYnl0ZS1pZGVudGljYWwuIFBhc3MgbnVsbCB0b1xuICAgICAgLy8gcmVzdG9yZSB3YWxsLWNsb2NrIGJlaGF2aW9yLlxuICAgICAgX19zZXRFeHBvcnRDbG9jazogKGlzbzogc3RyaW5nIHwgbnVsbCkgPT4geyBleHBvcnRDbG9ja092ZXJyaWRlID0gaXNvOyB9LFxuICAgICAgLy8gc2V0U2VhcmNoIGRyaXZlcyB0aGUgQ3RybCtGIHZpc3VhbC1maW5kIHBhdGggKHRoZSBoZWFkZXIgc2VhcmNoIG5vd1xuICAgICAgLy8gb3BlbnMgdGhlIGNvbW1hbmQgcGFsZXR0ZSBpbnN0ZWFkIG9mIGZpbHRlcmluZykuXG4gICAgICBzZXRTZWFyY2g6IChxOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHEpIHsgb3BlbkZpbmQoKTsgaWYgKGZpbmRJbnB1dCkgZmluZElucHV0LnZhbHVlID0gcTsgYXBwbHlGaW5kKHEpOyB9XG4gICAgICAgIGVsc2UgY2xvc2VGaW5kKCk7XG4gICAgICB9LFxuICAgICAgb3BlbkZpbmQsIGNsb3NlRmluZCxcbiAgICAgIGlzRmluZE9wZW46ICgpID0+IEJvb2xlYW4oZmluZEJhciAmJiAhZmluZEJhci5oaWRkZW4pLFxuICAgICAgc2V0VmFsaWRpdHk6IChzZWw6IHN0cmluZywgb2s6IGJvb2xlYW4gfCAnZGlmZi1wYWdlJywgcmVhc29uPzogc3RyaW5nKSA9PiB7XG4gICAgICAgIHNlbGVjdG9yVmFsaWRpdHkuc2V0KHNlbCwgb2spO1xuICAgICAgICBpZiAocmVhc29uKSBzZWxlY3RvckVycm9ycy5zZXQoc2VsLCByZWFzb24pO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0sXG4gICAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgICBzbmFwc2hvdCgpO1xuICAgICAgICBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsaXZlVGFiVXJsID0gbnVsbDtcbiAgICAgICAgbGl2ZVRhYlBhdGggPSBudWxsO1xuICAgICAgICBsYXN0QWN0aXZlU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICBwZW5kaW5nTXVsdGkgPSBbXTtcbiAgICAgICAgc2VsZWN0b3JWYWxpZGl0eS5jbGVhcigpO1xuICAgICAgICBzaG90cy5jbGVhcigpO1xuICAgICAgICBwZXJzaXN0KCk7XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSxcbiAgICAgIG9wZW5QYWxldHRlLCBjbG9zZVBhbGV0dGUsIG9wZW5EcmF3ZXIsIGNsb3NlRHJhd2VyLFxuICAgICAgc2VuZEZlZWRiYWNrLCB1bmRvLCByZWRvLFxuICAgICAgbGlzdFdvcmtzcGFjZXM6ICgpID0+IFsuLi53b3Jrc3BhY2VzXSxcbiAgICAgIGFjdGl2ZVdvcmtzcGFjZTogKCkgPT4gYWN0aXZlV3MsXG4gICAgICBzZXRTdGlja3lUVEw6IChtczogbnVtYmVyKSA9PiB7IFNUSUNLWV9UVExfTVMgPSBtczsgfSxcbiAgICAgIGZvcmNlU3RpY2t5RXhwaXJlOiAoKSA9PiB7IGNsZWFyVGltZW91dChzdGlja3lUaW1lcik7IHBhbmVsSG92ZXJlZCA9IGZhbHNlOyBhcm1TdGlja3lFeHBpcnkoKTsgfSxcbiAgICAgIHNldExhc3RBY3RpdmUsXG4gICAgICBjcmVhdGVXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IHsgd29ya3NwYWNlcy5wdXNoKHtuYW1lOiBuLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0pOyBwZXJzaXN0V29ya3NwYWNlcygpOyByZXR1cm4gbG9hZFdvcmtzcGFjZShuKS50aGVuKHJlbmRlcik7IH0sXG4gICAgICBzd2l0Y2hXb3Jrc3BhY2U6IChuOiBzdHJpbmcpID0+IGxvYWRXb3Jrc3BhY2UobikudGhlbihyZW5kZXIpLFxuICAgICAgY2xlYXJBbGw6IG9uQ2xlYXIsXG4gICAgICBsaXN0U25hcHNob3RzOiAoKSA9PiB3c1NuYXBzaG90cy5tYXAoKHMpID0+ICh7aWQ6IHMuaWQsIHRzOiBzLnRzLCBzZWxlY3RvcnM6IHMuc2VsZWN0b3JzLCBjb21tZW50czogcy5jb21tZW50c30pKSxcbiAgICAgIHJlc3RvcmVTbmFwc2hvdDogKGlkOiBzdHJpbmcpID0+IHJlc3RvcmVXb3Jrc3BhY2VTbmFwc2hvdChpZCksXG4gICAgfTtcbiAgfTtcblxuICAvLyDilIDilIDilIAgQm9vdCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGxvYWRBbGwoKTtcbiAgICBwYW5lbFJlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgcGVuZGluZ1BhbmVsTWVzc2FnZXMuc3BsaWNlKDApKSBvbkNzTWVzc2FnZShtKTtcbiAgICByZW5kZXIoKTtcbiAgICBpbnN0YWxsVGVzdEFwaSgpO1xuICAgIHZvaWQgcnVuVmFsaWRhdGlvbigpO1xuICAgIHZvaWQgZmV0Y2hTdGFycygpO1xuICAgIHVwZGF0ZUNvbXBvc2VyTWV0ZXIoKTtcbiAgICB1cGRhdGVVbmRvQnV0dG9ucygpO1xuICAgIGNvbnNvbGUubG9nKExPRywgJ3JlYWR5Jywge2luRXh0ZW5zaW9uLCB3czogYWN0aXZlV3MsIG1lc3NhZ2VzOiBtZXNzYWdlcy5sZW5ndGh9KTtcbiAgfSkoKTtcbn0pKCk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiOztFQTBtQkEsSUFBSSxjQUFjO0FBQUEsRUFDbEIsSUFBTSxTQUFTLE1BQWM7QUFBQSxJQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsU0FBUyxFQUFFO0FBQUEsSUFDeEUsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQUEsTUFDOUIsV0FBVyxPQUFPLGdCQUFnQixLQUFLO0FBQUEsTUFDdkMsT0FBTyxHQUFHLFVBQVUsTUFBTSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxNQUN6RixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBLEVBS0osSUFBTSxLQUFLLENBQTJCLGFBQzFDLEVB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QSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxNQUNFLEtBQU87QUFBQSxNQUNQLFNBQVc7QUFBQSxNQUNYLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsU0FBVztBQUFBLE1BQ1gsT0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxTQUFXO0FBQUEsTUFDWCxPQUFTO0FBQUEsSUFD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
